import type { MessageInitShape } from "@bufbuild/protobuf";
import { Code, ConnectError, type HandlerContext, type ServiceImpl } from "@connectrpc/connect";
import { createRng, type Rng } from "@ga/content";
import {
  activeSession,
  appendEvent,
  createSession,
  type Db,
  enroll,
  enrollments,
  getSession,
  isEnrolled,
  learnerFor,
  loadState,
  recordAnswer,
  type SessionRow,
  totalXp,
  updateSession,
  xpByDay,
} from "@ga/db";
import { applyEvent, courseProgress, DAY, type EngineEvent, frontier, initialState, isDue, memory, nextTasks, type Task } from "@ga/engine";
import { type LearningService, type Task as TaskMessage, TopicStatus, type XpSummarySchema } from "@ga/proto/learning/v1/learning_pb";

import { dbKey, userIdKey } from "./context.ts";
import { sessionMessage, taskMessage, text } from "./convert.ts";
import type { CourseEntry, Registry } from "./registry.ts";
import { answerRun, type RunState, startRun } from "./runner.ts";

/** LearningDeps are the learning service's dependencies besides the request context. */
export interface LearningDeps {
  readonly registry: Registry;
  /** now is the clock, in milliseconds since the epoch. */
  now(): number;
  /** seed draws a fresh 32-bit seed; problem instances and plans derive from it. */
  seed(): number;
}

function auth(ctx: HandlerContext): { db: Db; userId: string } {
  const db = ctx.values.get(dbKey);
  if (!db) throw new ConnectError("no database", Code.Internal);
  const userId = ctx.values.get(userIdKey);
  if (!userId) throw new ConnectError("sign in first", Code.Unauthenticated);
  return { db, userId };
}

/** checkTimeZone returns a valid IANA time zone, UTC when none is given. */
export function checkTimeZone(timeZone: string): string {
  const tz = timeZone || "UTC";
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: tz });
  } catch {
    throw new ConnectError(`unknown time zone ${tz}`, Code.InvalidArgument);
  }
  return tz;
}

/** sameTask tells whether a requested task is the engine task. */
function sameTask(req: TaskMessage | undefined, task: Task): boolean {
  const k = req?.kind;
  if (!k?.case || k.case !== task.kind) return false;
  return k.case === "diagnostic" || k.case === "quiz" || ("topic" in task && k.value.topicId === task.topic);
}

/** learningService implements LearningService over the event log. */
export function learningService(deps: LearningDeps): ServiceImpl<typeof LearningService> {
  const { registry } = deps;

  const course = (id: string): CourseEntry => {
    const c = registry.courses.get(id);
    if (!c) throw new ConnectError(`unknown course ${id}`, Code.NotFound);
    return c;
  };

  /** enrolled resolves the learner and checks the enrollment. */
  const enrolled = async (ctx: HandlerContext, courseId: string) => {
    const { db, userId } = auth(ctx);
    const c = course(courseId);
    const learnerId = await learnerFor(db, userId);
    if (!(await isEnrolled(db, learnerId, courseId))) throw new ConnectError(`not enrolled in ${courseId}`, Code.FailedPrecondition);
    return { db, c, learnerId };
  };

  const state = async (db: Db, learnerId: string, c: CourseEntry, lock = false) =>
    loadState(db, learnerId, c.subject.def.id, initialState, lock);

  const xp = async (db: Db, learnerId: string, now: number, timeZone: string): Promise<MessageInitShape<typeof XpSummarySchema>> => {
    const tz = checkTimeZone(timeZone);
    const day = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" });
    const byDay = await xpByDay(db, learnerId, new Date(now - 15 * DAY), tz);
    const days = Array.from({ length: 14 }, (_, i) => byDay.get(day.format(new Date(now - (13 - i) * DAY))) ?? 0);
    return { total: await totalXp(db, learnerId), today: days[13]!, days };
  };

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
    const c = course(row.courseId);
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
        const c = registry.courses.get(e.courseId);
        if (!c) continue;
        const { state: s } = await state(db, learnerId, c);
        const p = courseProgress(c.planner, s, now);
        list.push({ courseId: c.id, stats: { learned: p.learned, total: p.total, due: p.due } });
      }
      return { enrollments: list, xp: await xp(db, learnerId, now, req.timeZone) };
    },

    async enroll(req, ctx) {
      const { db, userId } = auth(ctx);
      const c = course(req.courseId);
      await enroll(db, await learnerFor(db, userId), c.subject.def.id, c.id);
      return {};
    },

    async getDashboard(req, ctx) {
      const { db, c, learnerId } = await enrolled(ctx, req.courseId);
      const now = deps.now();
      const { state: s } = await state(db, learnerId, c);
      const active = await activeSession(db, learnerId, c.id);
      const p = courseProgress(c.planner, s, now);
      const run = active?.state as RunState | undefined;
      return {
        courseId: c.id,
        diagnosed: s.diagnosed,
        tasks: nextTasks(c.planner, s, now).map((t) => taskMessage(c, t, s)),
        ...(active && run && { active: { id: active.id, task: sessionMessage(c, active.id, run, s).task } }),
        stats: { learned: p.learned, total: p.total, due: p.due },
        xp: await xp(db, learnerId, now, req.timeZone),
        xpToQuiz: Math.max(0, c.ctx.params.quizEveryXp - (s.xp - s.xpAtLastQuiz)),
      };
    },

    async getCourseProgress(req, ctx) {
      const { db, c, learnerId } = await enrolled(ctx, req.courseId);
      const now = deps.now();
      const { state: s } = await state(db, learnerId, c);
      const p = c.ctx.params;
      const open = new Set(frontier(c.planner, s));
      return {
        topics: c.planner.scope.topics.map((id) => {
          const t = s.topics[id];
          const status = c.planner.scope.assumed.has(id)
            ? TopicStatus.ASSUMED
            : t?.learned
              ? isDue(p, t, now)
                ? TopicStatus.DUE
                : TopicStatus.LEARNED
              : open.has(id)
                ? TopicStatus.AVAILABLE
                : t?.failedAt !== undefined
                  ? TopicStatus.FAILED
                  : TopicStatus.LOCKED;
          return {
            topicId: id,
            status,
            placed: t?.placed === true,
            memory: t?.learned ? memory(p, t, now) : 0,
            foundation: !c.planner.scope.inCourse.has(id),
          };
        }),
      };
    },

    async startTask(req, ctx) {
      const { db, c, learnerId } = await enrolled(ctx, req.courseId);
      const now = deps.now();
      const row = await db.transaction(async (tx) => {
        const active = await activeSession(tx, learnerId, c.id);
        if (active) return active;
        const { state: s } = await state(tx, learnerId, c, true);
        const task = nextTasks(c.planner, s, now).find((t) => sameTask(req.task, t));
        if (!task) throw new ConnectError("that task is not offered now", Code.FailedPrecondition);
        const run = startRun(c, task, s, rng());
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
        if (s.diagnosed) return;
        const active = await activeSession(tx, learnerId, c.id);
        if (active) await updateSession(tx, active.id, active.state, "abandoned", new Date(now));
        await append(tx, learnerId, c, { type: "placed", at: now, known: [], tested: [] });
      });
      return {};
    },

    async getSession(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const row = await getSession(db, learnerId, req.id);
      if (!row) throw new ConnectError("no such session", Code.NotFound);
      return { session: await view(db, learnerId, row) };
    },

    async submitAnswer(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const now = deps.now();
      const { row, answered } = await db.transaction(async (tx) => {
        const row = await getSession(tx, learnerId, req.sessionId, true);
        if (!row) throw new ConnectError("no such session", Code.NotFound);
        if (row.status !== "active") throw new ConnectError("the session is over", Code.FailedPrecondition);
        const run = row.state as RunState;
        if (req.index !== run.asked.length) throw new ConnectError("that question was already answered", Code.FailedPrecondition);
        const c = course(row.courseId);
        const answered = answerRun(c, run, req.response, req.skip, now, rng());
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
        if (answered.event) await append(tx, learnerId, c, answered.event, row.id);
        await updateSession(tx, row.id, answered.run, answered.event ? "completed" : "active", new Date(now));
        return { row: { ...row, state: answered.run }, answered };
      });
      const run = row.state as RunState;
      const feedback = run.kind === "lesson" || run.kind === "review";
      const v = answered.verdict;
      return {
        ...(feedback && {
          feedback: {
            correct: v.correct,
            ...(v.feedback && { message: text(v.feedback) }),
            solution: text(answered.problem.solution),
            answer: answered.problem.canonical,
          },
        }),
        session: await view(db, learnerId, row),
      };
    },
  };
}
