import { Code, ConnectError, type HandlerContext, type ServiceImpl } from "@connectrpc/connect";
import { createRng, type Rng } from "@ga/content";
import {
  activeSession,
  appendEvent,
  completedSessions,
  createSession,
  type Db,
  enroll,
  enrollments,
  getSession,
  isEnrolled,
  isGuardian,
  learnerFor,
  loadState,
  recordAnswer,
  type SessionRow,
  updateSession,
} from "@ga/db";
import {
  applyEvent,
  courseProgress,
  diagnosticDue,
  type EngineEvent,
  frontier,
  initialState,
  isDue,
  type LearnerState,
  memory,
  nextTasks,
  remainingXp,
  type Task,
} from "@ga/engine";
import { type LearningService, type Task as TaskMessage, TopicStatus } from "@ga/proto/learning/v1/learning_pb";

import { requirePlan } from "./billing.ts";
import { requireStudy, studiedToday } from "./capabilities.ts";
import { dbKey, userIdKey } from "./context.ts";
import { figure, knowledgePointIntro, sessionMessage, taskMessage, text } from "./convert.ts";
import { joinLeague } from "./league.ts";
import type { CourseEntry, Registry } from "./registry.ts";
import { answerRun, type RunState, runTask, startRun } from "./runner.ts";
import { xpSummary } from "./summary.ts";

/** historyLength bounds the finished sessions a learner's history lists. */
const historyLength = 100;

/** topicStatus is a learner's standing on a topic; open is the learner's frontier. */
function topicStatus(c: CourseEntry, s: LearnerState, open: ReadonlySet<string>, id: string, now: number): TopicStatus {
  const t = s.topics[id];
  if (c.planner.scope.assumed.has(id)) return TopicStatus.ASSUMED;
  if (t?.learned) return isDue(c.ctx.params, t, now) ? TopicStatus.DUE : TopicStatus.LEARNED;
  if (open.has(id)) return TopicStatus.AVAILABLE;
  return t?.failedAt !== undefined ? TopicStatus.FAILED : TopicStatus.LOCKED;
}

/** LearningDeps are the learning service's dependencies besides the request context. */
export interface LearningDeps {
  readonly registry: Registry;
  /** now is the clock, in milliseconds since the epoch. */
  now(): number;
  /** seed draws a fresh 32-bit seed; problem instances and plans derive from it. */
  seed(): number;
  /** billing makes studying a subject need a plan that covers it (docs/billing.md §6). */
  readonly billing?: boolean;
}

function auth(ctx: HandlerContext): { db: Db; userId: string } {
  const db = ctx.values.get(dbKey);
  if (!db) throw new ConnectError("no database", Code.Internal);
  const userId = ctx.values.get(userIdKey);
  if (!userId) throw new ConnectError("sign in first", Code.Unauthenticated);
  return { db, userId };
}

/** sameTask tells whether a requested task is the engine task. */
function sameTask(req: TaskMessage | undefined, task: Task): boolean {
  const k = req?.kind;
  if (!k?.case || k.case !== task.kind) return false;
  if (k.case === "reading") return task.kind === "reading" && k.value.passageId === task.passage;
  return k.case === "diagnostic" || k.case === "quiz" || ("topic" in task && k.value.topicId === task.topic);
}

/** learningService implements LearningService over the event log. */
export function learningService(deps: LearningDeps): ServiceImpl<typeof LearningService> {
  const { registry } = deps;

  const course = async (id: string): Promise<CourseEntry> => {
    const c = await registry.course(id);
    if (!c) throw new ConnectError(`unknown course ${id}`, Code.NotFound);
    return c;
  };

  /** enrolled resolves the learner and checks the enrollment; a guardian can name a learner they follow. */
  const enrolled = async (ctx: HandlerContext, courseId: string, guardedId = "") => {
    const { db, userId } = auth(ctx);
    const c = await course(courseId);
    if (guardedId && !(await isGuardian(db, userId, guardedId))) throw new ConnectError("no such learner", Code.NotFound);
    const learnerId = guardedId || (await learnerFor(db, userId));
    if (!guardedId) {
      await requireStudy(db, learnerId, deps.now());
      if (deps.billing) await requirePlan(db, learnerId, c.subject.def.id, deps.now());
    }
    if (!(await isEnrolled(db, learnerId, courseId))) throw new ConnectError(`not enrolled in ${courseId}`, Code.FailedPrecondition);
    return { db, c, learnerId };
  };

  const state = async (db: Db, learnerId: string, c: CourseEntry, lock = false) =>
    loadState(db, learnerId, c.subject.def.id, initialState, lock);

  /** append folds an event into the learner's state and appends it, in the caller's transaction. */
  const append = async (db: Db, learnerId: string, c: CourseEntry, e: EngineEvent, sessionId?: string) => {
    const stored = await state(db, learnerId, c, true);
    const next = applyEvent(c.ctx, stored.state, e);
    await appendEvent(db, {
      learnerId,
      subjectId: c.subject.def.id,
      seq: stored.seq + 1,
      event: e,
      xp: next.xp - stored.state.xp,
      state: next,
      courseId: c.id,
      ...(sessionId && { sessionId }),
    });
    return next;
  };

  const view = async (db: Db, learnerId: string, row: SessionRow) => {
    const c = await course(row.courseId);
    const { state: s } = await state(db, learnerId, c);
    return sessionMessage(c, row.id, row.state as RunState, s);
  };

  const rng = (): Rng => createRng(deps.seed());

  return {
    async getProfile(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const now = deps.now();
      const list = [];
      for (const e of await enrollments(db, learnerId)) {
        const c = await registry.course(e.courseId);
        if (!c) continue;
        const { state: s } = await state(db, learnerId, c);
        const p = courseProgress(c.planner, s, now);
        list.push({ courseId: c.id, stats: { learned: p.learned, total: p.total, due: p.due } });
      }
      return { enrollments: list, xp: await xpSummary(db, learnerId, now, req.timeZone) };
    },

    async enroll(req, ctx) {
      const { db, userId } = auth(ctx);
      const c = await course(req.courseId);
      const learnerId = await learnerFor(db, userId);
      await requireStudy(db, learnerId, deps.now());
      if (deps.billing) await requirePlan(db, learnerId, c.subject.def.id, deps.now());
      await enroll(db, learnerId, c.subject.def.id, c.id);
      return {};
    },

    async getDashboard(req, ctx) {
      const { db, c, learnerId } = await enrolled(ctx, req.courseId, req.learnerId);
      const now = deps.now();
      const { state: s } = await state(db, learnerId, c);
      const active = await activeSession(db, learnerId, c.id);
      const p = courseProgress(c.planner, s, now);
      const run = active?.state as RunState | undefined;
      const xp = await xpSummary(db, learnerId, now, req.timeZone);
      return {
        courseId: c.id,
        diagnosed: !diagnosticDue(c.planner, s),
        tasks: nextTasks(c.planner, s, now).map((t) => taskMessage(c, t, s)),
        ...(active && run && { active: { id: active.id, task: taskMessage(c, runTask(run), s) } }),
        stats: { learned: p.learned, total: p.total, due: p.due },
        xp,
        xpToQuiz: Math.max(0, c.ctx.params.quizEveryXp - (s.xp - s.xpAtLastQuiz)),
        remainingXp: remainingXp(c.planner, s),
        pace: (xp.days ?? []).reduce((a, b) => a + b, 0) / 14,
      };
    },

    async getCourseProgress(req, ctx) {
      const { db, c, learnerId } = await enrolled(ctx, req.courseId, req.learnerId);
      const now = deps.now();
      const { state: s } = await state(db, learnerId, c);
      const p = c.ctx.params;
      const open = new Set(frontier(c.planner, s));
      return {
        topics: c.planner.scope.topics.map((id) => {
          const t = s.topics[id];
          return {
            topicId: id,
            status: topicStatus(c, s, open, id, now),
            placed: t?.placed === true,
            memory: t?.learned ? memory(p, t, now) : 0,
            foundation: !c.planner.scope.inCourse.has(id),
          };
        }),
      };
    },

    async getTopic(req, ctx) {
      const { db, c, learnerId } = await enrolled(ctx, req.courseId);
      const topic = c.subject.topics.get(req.topicId);
      if (!topic) throw new ConnectError("no such topic", Code.NotFound);
      const now = deps.now();
      const { state: s } = await state(db, learnerId, c);
      const open = new Set(frontier(c.planner, s));
      const count = topic.knowledgePoints.length;
      const indexes = Array.from({ length: count }, (_, kp) => kp);
      const [lessons, examples] = await Promise.all([
        Promise.all(indexes.map((kp) => c.source.lesson(topic.id, kp))),
        c.source.problems(indexes.map((kp) => ({ topic: topic.id, kp, seed: req.exampleSeed + 1 }))),
      ]);
      const link = (id: string) => ({
        topicId: id,
        title: text(c.subject.topics.get(id)!.title),
        status: topicStatus(c, s, open, id, now),
      });
      const dependents = c.planner.scope.topics.filter((id) => c.subject.topics.get(id)?.prerequisites.includes(topic.id));
      return {
        topicId: topic.id,
        title: text(topic.title),
        summary: text(topic.summary),
        status: topicStatus(c, s, open, topic.id, now),
        knowledgePoints: indexes.map((kp) => knowledgePointIntro(lessons[kp]!, examples[kp]!, kp, count)),
        prerequisites: topic.prerequisites.map(link),
        dependents: dependents.map(link),
      };
    },

    async listSessions(req, ctx) {
      const { db, c, learnerId } = await enrolled(ctx, req.courseId, req.learnerId);
      const { state: s } = await state(db, learnerId, c);
      const rows = await completedSessions(db, learnerId, c.id, historyLength);
      return {
        sessions: rows.flatMap((row) => {
          const run = row.state as RunState;
          const r = run.result;
          if (!r) return [];
          return [
            {
              id: row.id,
              task: taskMessage(c, runTask(run), s),
              completedAt: BigInt(row.completedAt?.getTime() ?? row.updatedAt.getTime()),
              passed: r.passed,
              correct: r.correct,
              asked: r.asked,
              xp: r.xp,
              fullXp: r.full ?? r.xp,
              blownOff: r.blownOff ?? false,
            },
          ];
        }),
      };
    },

    async startTask(req, ctx) {
      const { db, c, learnerId } = await enrolled(ctx, req.courseId);
      const now = deps.now();
      const { age } = await requireStudy(db, learnerId, now);
      const timeLimit = age.dailyMinutes;
      const row = await db.transaction(async (tx) => {
        const active = await activeSession(tx, learnerId, c.id);
        if (active) return active;
        if (timeLimit !== null && (await studiedToday(tx, learnerId, now, req.timeZone)) >= timeLimit * 60_000)
          throw new ConnectError("today's study time is used up", Code.ResourceExhausted);
        const { state: s } = await state(tx, learnerId, c, true);
        const task = nextTasks(c.planner, s, now).find((t) => sameTask(req.task, t));
        if (!task) throw new ConnectError("that task is not offered now", Code.FailedPrecondition);
        const run = startRun(c, task, s, now, rng());
        return createSession(tx, {
          learnerId,
          subjectId: c.subject.def.id,
          courseId: c.id,
          kind: task.kind,
          ...("topic" in task && { topicId: task.topic }),
          state: run,
          at: new Date(now),
        });
      });
      return { session: await view(db, learnerId, row) };
    },

    async skipDiagnostic(req, ctx) {
      const { db, c, learnerId } = await enrolled(ctx, req.courseId);
      const now = deps.now();
      await db.transaction(async (tx) => {
        const { state: s } = await state(tx, learnerId, c, true);
        if (!diagnosticDue(c.planner, s)) return;
        const active = await activeSession(tx, learnerId, c.id);
        if (active) await updateSession(tx, active.id, active.state, "abandoned", new Date(now));
        await append(tx, learnerId, c, { type: "placed", at: now, course: c.id, known: [], tested: [] });
      });
      return {};
    },

    async getSession(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      await requireStudy(db, learnerId, deps.now());
      const row = await getSession(db, learnerId, req.id);
      if (!row) throw new ConnectError("no such session", Code.NotFound);
      return { session: await view(db, learnerId, row) };
    },

    async submitAnswer(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const now = deps.now();
      await requireStudy(db, learnerId, now);
      const { row, answered } = await db.transaction(async (tx) => {
        const row = await getSession(tx, learnerId, req.sessionId, true);
        if (!row) throw new ConnectError("no such session", Code.NotFound);
        if (row.status !== "active") throw new ConnectError("the session is over", Code.FailedPrecondition);
        const run = row.state as RunState;
        if (req.index !== run.asked.length) throw new ConnectError("that question was already answered", Code.FailedPrecondition);
        const c = await course(row.courseId);
        const { state: before } = await state(tx, learnerId, c, true);
        const answered = await answerRun(c, run, before, req.response, req.skip, now, rng());
        const ref = run.current!;
        await recordAnswer(tx, {
          sessionId: row.id,
          learnerId,
          index: req.index,
          topicId: ref.topic,
          kp: ref.kp,
          seed: ref.seed,
          response: answered.skipped ? "" : req.response,
          skipped: answered.skipped,
          correct: answered.verdict.correct,
          at: new Date(now),
        });
        if (answered.event) {
          await append(tx, learnerId, c, answered.event, row.id);
          await joinLeague(tx, learnerId, now);
        }
        await updateSession(tx, row.id, answered.run, answered.event ? "completed" : "active", new Date(now));
        return { row: { ...row, state: answered.run }, answered };
      });
      const run = row.state as RunState;
      const feedback = run.kind === "lesson" || run.kind === "review" || run.kind === "reading";
      const v = answered.verdict;
      return {
        ...(feedback && {
          feedback: {
            correct: v.correct,
            ...(v.feedback && { message: text(v.feedback) }),
            solution: text(answered.problem.solution),
            ...(answered.problem.solutionFigure && { solutionFigure: figure(answered.problem.solutionFigure) }),
            answer: answered.problem.canonical,
          },
        }),
        session: await view(db, learnerId, row),
      };
    },
  };
}
