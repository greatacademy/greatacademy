import { Code, ConnectError, type HandlerContext, type ServiceImpl } from "@connectrpc/connect";
import { createRng, type Heard, type Judged, type Problem, type Rng, type Verdict } from "@ga/content";
import {
  activeSession,
  chooseCourse,
  completedSessions,
  createJudgment,
  createSession,
  currentCourse,
  currentCourses,
  type Db,
  decidePlacement,
  essaySessions,
  getSession,
  guardiansOf,
  isGuardian,
  type JudgmentRow,
  latestJudgment,
  learnerFor,
  placedEvent,
  reopenPlacement,
  type SessionRow,
  speakingOffUntil,
  subjectSettings,
  updateSession,
  updateSubjectSettings,
} from "@ga/db";
import {
  courseFinished,
  courseProgress,
  diagnosticDue,
  frontier,
  isDue,
  isKnown,
  type LearnerState,
  memory,
  nextTasks,
  placementAdvice,
  remainingXp,
  retakeEvent,
  type Task,
} from "@ga/engine";
import { criterionKey } from "@ga/judge";
import { type LearningService, type Task as TaskMessage, TopicStatus } from "@ga/proto/learning/v1/learning_pb";

import { requirePlan } from "./billing.ts";
import { accessOf, requireStudy, speechRoute, studiedToday } from "./capabilities.ts";
import { dbKey, userIdKey } from "./context.ts";
import { figure, knowledgePointIntro, sessionMessage, sounds, taskMessage, text } from "./convert.ts";
import { requireJudgingQuota } from "./costs.ts";
import { ESSAY_NOTICE_MS, essayRun, essayTopics, finishEssay, judgeEssay } from "./essays.ts";
import { forLearner, type JudgingDeps, judgedCriteria, runJudgment, viewJudgment } from "./judging.ts";
import type { CourseEntry, Registry } from "./registry.ts";
import { answerRun, canSkip, type Given, type RunState, runTask, startRun } from "./runner.ts";
import { appendTo, learnerState, settleAnswer } from "./sessions.ts";
import { hearRecording, SPEAKING_OFF_FOREVER, setSpeaking, speakingAvailable, speakingOff, speakingUntil, spokenTopics } from "./speech.ts";
import { xpSummary } from "./summary.ts";

/** maxDailyGoal bounds a weekday's goal, far above what anyone studies in a day. */
const maxDailyGoal = 1000;

/** checkGoals validates goals: seven weekdays, or none. */
function checkGoals(goals: { weekdays: readonly number[]; paused: boolean } | undefined): { goals: number[] | null; goalsPaused: boolean } {
  const days = goals?.weekdays ?? [];
  if (days.length !== 0 && days.length !== 7) throw new ConnectError("goals need seven weekdays", Code.InvalidArgument);
  if (days.some((d) => !Number.isInteger(d) || d < 0 || d > maxDailyGoal))
    throw new ConnectError("goal out of range", Code.InvalidArgument);
  return { goals: days.length === 0 ? null : [...days], goalsPaused: goals?.paused ?? false };
}

/** checkDate validates a calendar day, "YYYY-MM-DD"; empty means none. */
function checkDate(day: string): string | null {
  if (day === "") return null;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(day) ? new Date(`${day}T00:00:00Z`) : undefined;
  if (!parsed || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== day)
    throw new ConnectError("a date is YYYY-MM-DD", Code.InvalidArgument);
  return day;
}

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

/** placementReport sums up what a course's diagnostic found, with the course it recommends (docs/learning-engine.md §9). */
function placementReport(
  c: CourseEntry,
  s: LearnerState,
  placed: { known: readonly string[]; tested: readonly string[]; missed?: readonly string[] },
) {
  const own = c.course.topics;
  const known = new Set(placed.known);
  const advice = placementAdvice(c.planner, c.index, s, { known: placed.known, tested: placed.tested, missed: placed.missed ?? [] });
  return {
    placed: own.filter((id) => known.has(id)).length,
    total: own.length,
    foundations: foundationsLeft(c, s),
    recommended: advice.kind === "stay" ? "" : advice.course,
    earlier: advice.kind === "earlier",
  };
}

/** foundationsLeft counts the course's foundations the learner has not shown they know. */
function foundationsLeft(c: CourseEntry, s: LearnerState): number {
  const { scope } = c.planner;
  return scope.topics.filter((id) => !scope.inCourse.has(id) && !scope.assumed.has(id) && !isKnown(c.planner, s, id)).length;
}

/**
 * startEarlier is the course a learner new to the subject may start with instead: while the diagnostic is due and the
 * course needs more topics of earlier courses than it has of its own, the course it builds on; empty otherwise.
 */
function startEarlier(c: CourseEntry, diagnosed: boolean, foundations: number): string {
  if (diagnosed || foundations <= c.planner.scope.inCourse.size) return "";
  return c.course.def.buildsOn?.[0] ?? "";
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
  /** judging lets answers be judged by models; without it no topic judged by a model is taught. */
  readonly judging?: JudgingDeps;
  /**
   * defer keeps work running after the response is sent, given a database that
   * outlives the request. Without it a judgment runs when GetJudgment first asks after it.
   */
  readonly defer?: (work: Promise<unknown>) => void;
}

/**
 * speakingWaits tells whether spoken topics of a course are left unlearned only because the learner turned speaking
 * off: the course is not finished then, since they come back when speaking does.
 */
async function speakingWaits(db: Db, full: CourseEntry, learnerId: string, s: LearnerState, now: number): Promise<boolean> {
  if (!(await speakingOff(db, learnerId, now))) return false;
  for (const g of spokenTopics(full)) {
    if (g.ids.some((id) => !s.topics[id]?.learned) && (await speechRoute(db, "stt", g.language, learnerId, now, g.verbatim))) return true;
  }
  return false;
}

/** speakingOf tells whether spoken topics are taught to a learner, and whether a speech service serves them at all. */
async function speakingOf(db: Db, learnerId: string, now: number) {
  const available = await speakingAvailable(db, learnerId, now);
  const until = await speakingOffUntil(db, learnerId);
  const off = until !== null && until.getTime() > now;
  return {
    speaking: available && !off,
    speakingAvailable: available,
    speakingBackTomorrow: off && until.getTime() < SPEAKING_OFF_FOREVER.getTime(),
  };
}

/** feedbackOf is the feedback on an answer, with a model's verdict when one judged it; a text sent back for a rewrite shows no model answer. */
function feedbackOf(problem: Problem, verdict: Verdict, judged?: { readonly row: JudgmentRow; readonly revise: boolean }) {
  const hide = judged?.revise || (!verdict.correct && problem.answer.judged !== undefined && !judged);
  return {
    correct: verdict.correct,
    ...(verdict.feedback && { message: text(verdict.feedback) }),
    ...(!hide && {
      solution: text(problem.solution),
      ...(problem.solutionFigure && { solutionFigure: figure(problem.solutionFigure) }),
      solutionSounds: sounds(problem.solutionSounds),
      answer: problem.canonical,
    }),
    ...(judged?.row.verdict && {
      criteria: judged.row.verdict.criteria.map(({ id, met, quotation, note }) => ({ id, met, quotation, note })),
      points: judged.row.verdict.feedback.map(({ point, quotation }) => ({ point, quotation })),
      score: judged.row.score ?? 0,
      revise: judged.revise,
    }),
    ...(hide && !judged && { revise: true }),
  };
}

/** withFeedback tells whether a run's answers get feedback at once. */
function withFeedback(run: RunState): boolean {
  return run.kind === "lesson" || run.kind === "review" || run.kind === "reading";
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

  /** learner resolves the learner a request is about: the caller, or a learner the caller is a guardian of. */
  const learner = async (ctx: HandlerContext, guardedId = "") => {
    const { db, userId } = auth(ctx);
    if (guardedId && !(await isGuardian(db, userId, guardedId))) throw new ConnectError("no such learner", Code.NotFound);
    return { db, learnerId: guardedId || (await learnerFor(db, userId)), guardian: guardedId !== "" };
  };

  /**
   * canDecide tells whether the caller is the learner's supervisor, who chooses the course and sets the goals and the
   * end date: a guardian of the learner, or the learner themself when an adult, or a teen no guardian follows.
   */
  const canDecide = async (db: Db, learnerId: string, guardian: boolean) => {
    if (guardian) return true;
    const band = (await accessOf(db, learnerId, deps.now())).age.band;
    return band === "adult" || (band === "teen" && (await guardiansOf(db, learnerId)).length === 0);
  };

  /** current resolves the learner and checks the course is their current one; a guardian can name a learner they follow. */
  const current = async (ctx: HandlerContext, courseId: string, guardedId = "") => {
    const { db, learnerId, guardian } = await learner(ctx, guardedId);
    const c = await forLearner(db, await course(courseId), learnerId, deps.now());
    if (!guardian) {
      await requireStudy(db, learnerId, deps.now());
      if (deps.billing) await requirePlan(db, learnerId, c.subject.def.id, deps.now());
    }
    const chosen = await currentCourse(db, learnerId, courseId);
    if (!chosen) throw new ConnectError(`${courseId} is not the current course`, Code.FailedPrecondition);
    return { db, c, learnerId, guardian, decided: chosen.decided };
  };

  /** decider resolves a learner whose course, goals or end date the caller is changing, refusing anyone but their supervisor. */
  const decider = async (ctx: HandlerContext, guardedId: string) => {
    const { db, learnerId, guardian } = await learner(ctx, guardedId);
    if (!guardian) {
      await requireStudy(db, learnerId, deps.now());
      if (!(await canDecide(db, learnerId, false))) throw new ConnectError("the learner's guardian decides", Code.PermissionDenied);
    }
    return { db, learnerId };
  };

  /** subject checks that a subject is served. */
  const subject = (id: string) => {
    if (!registry.listings.some((s) => s.id === id)) throw new ConnectError(`unknown subject ${id}`, Code.NotFound);
    return id;
  };

  const state = learnerState;
  const append = appendTo;
  const settle = settleAnswer;

  /** view describes a session; an essay shows as submitted until it is judged, then its result carries the verdict. */
  const view = async (db: Db, learnerId: string, row: SessionRow) => {
    const c = await course(row.courseId);
    const { state: s } = await state(db, learnerId, c);
    const run = row.state as RunState;
    if (essayRun(run) && run.pending && (row.status === "submitted" || row.status === "abandoned")) {
      const submitted = { response: run.pending.response, failed: row.status === "abandoned" };
      return sessionMessage(c, row.id, run, s, undefined, { submitted });
    }
    if (essayRun(run) && run.result) {
      const j = await latestJudgment(db, row.id, run.asked.length - 1);
      if (j?.status === "done") {
        const [problem] = await c.source.problems([{ topic: j.topicId, kp: j.kp, seed: j.seed }]);
        const feedback = feedbackOf(problem!, { correct: viewJudgment(j).passed }, { row: j, revise: false });
        return sessionMessage(c, row.id, run, s, undefined, { feedback });
      }
    }
    const j = run.pending ? await latestJudgment(db, row.id, run.asked.length) : undefined;
    return sessionMessage(c, row.id, run, s, j && { delayed: j.status === "pending" && j.error !== null, failed: j.status === "failed" });
  };

  /**
   * settleEssays settles the learner's submitted essays of a course whose judgments ended, and carries on, after the
   * response, those whose judgment is due. It returns the topics of the essays still being judged, which are not
   * offered again meanwhile.
   */
  const settleEssays = async (db: Db, c: CourseEntry, learnerId: string, now: number): Promise<Set<string>> => {
    const waiting = new Set<string>();
    for (const row of await essaySessions(db, learnerId, c.id, essayTopics(c), new Date(now))) {
      if (row.status !== "submitted") continue;
      const after = await finishEssay(db, c, learnerId, row.id, now, deps.seed());
      if (after) continue;
      if (row.topicId) waiting.add(row.topicId);
      const { judging, defer } = deps;
      if (judging && defer) defer(judgeEssay(db, c, row, judging, now, deps.seed()).catch(() => undefined));
    }
    return waiting;
  };

  /** offered are the tasks the planner offers, without the lesson of an essay still being judged. */
  const offered = (c: CourseEntry, s: LearnerState, now: number, waiting: ReadonlySet<string>) =>
    nextTasks(c.planner, s, now).filter((t) => !(t.kind === "lesson" && waiting.has(t.topic)));

  /** judgeLater runs a judgment after the response, where work can be deferred. */
  const judgeLater = (db: Db, c: CourseEntry, id: string) => {
    const { judging, defer } = deps;
    if (judging && defer) defer(runJudgment(db, c, id, judging, deps.now()).catch(() => undefined));
  };

  const rng = (): Rng => createRng(deps.seed());

  return {
    async getProfile(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const now = deps.now();
      const list = [];
      for (const e of await currentCourses(db, learnerId)) {
        const entry = await registry.course(e.courseId);
        if (!entry) continue;
        // The learner's own view, as on the dashboard: without the topics no route may judge for them.
        const c = await forLearner(db, entry, learnerId, now);
        const { state: s } = await state(db, learnerId, c);
        const p = courseProgress(c.planner, s, now);
        list.push({
          courseId: c.id,
          subjectId: e.subjectId,
          stats: { learned: p.learned, total: p.total, due: p.due },
          xp: await xpSummary(db, learnerId, now, req.timeZone, e.subjectId),
        });
      }
      return {
        enrollments: list,
        xp: await xpSummary(db, learnerId, now, req.timeZone),
        canDecide: await canDecide(db, learnerId, false),
        ...(await speakingOf(db, learnerId, now)),
      };
    },

    async chooseCourse(req, ctx) {
      const { db, learnerId } = await decider(ctx, req.learnerId);
      const c = await course(req.courseId);
      if (c.course.def.retired && !(await currentCourses(db, learnerId)).some((e) => e.courseId === c.id))
        throw new ConnectError(`course ${c.id} is retired`, Code.FailedPrecondition);
      if (deps.billing) await requirePlan(db, learnerId, c.subject.def.id, deps.now());
      const at = new Date(deps.now());
      await db.transaction(async (tx) => {
        // Taking another course answers the report of the one replaced, and drops its end date.
        const replaced = (await currentCourses(tx, learnerId)).find((e) => e.subjectId === c.subject.def.id && e.courseId !== c.id);
        if (replaced) {
          await decidePlacement(tx, learnerId, replaced.courseId, at);
          await updateSubjectSettings(tx, learnerId, c.subject.def.id, { endDate: null });
        }
        await chooseCourse(tx, learnerId, c.subject.def.id, c.id, at);
      });
      return {};
    },

    async setGoals(req, ctx) {
      const { db, learnerId } = await decider(ctx, req.learnerId);
      await updateSubjectSettings(db, learnerId, subject(req.subjectId), checkGoals(req.goals));
      return {};
    },

    async setEndDate(req, ctx) {
      const { db, learnerId } = await decider(ctx, req.learnerId);
      await updateSubjectSettings(db, learnerId, subject(req.subjectId), { endDate: checkDate(req.endDate) });
      return {};
    },

    async keepCourse(req, ctx) {
      const { db, learnerId } = await decider(ctx, req.learnerId);
      const c = await course(req.courseId);
      if (!(await currentCourse(db, learnerId, c.id))) throw new ConnectError(`${c.id} is not the current course`, Code.FailedPrecondition);
      await decidePlacement(db, learnerId, c.id, new Date(deps.now()));
      return {};
    },

    async getDashboard(req, ctx) {
      const { db, c, learnerId, guardian, decided } = await current(ctx, req.courseId, req.learnerId);
      const now = deps.now();
      const waiting = await settleEssays(db, c, learnerId, now);
      const { state: s } = await state(db, learnerId, c);
      const active = await activeSession(db, learnerId, c.id);
      const essays = await essaySessions(db, learnerId, c.id, essayTopics(c), new Date(now - ESSAY_NOTICE_MS));
      const p = courseProgress(c.planner, s, now);
      const run = active?.state as RunState | undefined;
      const xp = await xpSummary(db, learnerId, now, req.timeZone, c.subject.def.id);
      const settings = await subjectSettings(db, learnerId, c.subject.def.id);
      const diagnosed = !diagnosticDue(c.planner, s);
      const placed = diagnosed && !decided ? await placedEvent(db, learnerId, c.subject.def.id, c.id) : undefined;
      const report = placed && (placed.tested.length > 0 || (placed.missed?.length ?? 0) > 0) ? placementReport(c, s, placed) : undefined;
      const foundations = foundationsLeft(c, s);
      return {
        courseId: c.id,
        diagnosed,
        ...(report && { report }),
        finished: courseFinished(c.planner, s) && !(await speakingWaits(db, await course(c.id), learnerId, s, now)),
        nextCourses: [...(c.index.next.get(c.id) ?? [])],
        canDecide: await canDecide(db, learnerId, guardian),
        subjectId: c.subject.def.id,
        goals: { weekdays: [...(settings.goals ?? [])], paused: settings.goalsPaused },
        endDate: settings.endDate ?? "",
        foundations,
        startEarlier: startEarlier(c, diagnosed, foundations),
        tasks: offered(c, s, now, waiting).map((t) => taskMessage(c, t, s)),
        essays: essays.map((row) => ({
          sessionId: row.id,
          title: text(c.subject.topics.get(row.topicId ?? "")?.title ?? { en: "", "zh-CN": "" }),
          judged: row.status === "completed",
          passed: (row.state as RunState).result?.passed ?? false,
        })),
        ...(active && run && { active: { id: active.id, task: taskMessage(c, runTask(run), s) } }),
        stats: { learned: p.learned, total: p.total, due: p.due },
        xp,
        xpToQuiz: Math.max(0, c.ctx.params.quizEveryXp - (s.xp - s.xpAtLastQuiz)),
        remainingXp: remainingXp(c.planner, s),
        pace: (xp.days ?? []).reduce((a, b) => a + b, 0) / 14,
      };
    },

    async getCourseProgress(req, ctx) {
      const { db, c, learnerId } = await current(ctx, req.courseId, req.learnerId);
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
      const { db, c, learnerId } = await current(ctx, req.courseId);
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
      const { db, c, learnerId } = await current(ctx, req.courseId, req.learnerId);
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
      const { db, c, learnerId } = await current(ctx, req.courseId);
      const now = deps.now();
      const { age } = await requireStudy(db, learnerId, now);
      const timeLimit = age.dailyMinutes;
      const row = await db.transaction(async (tx) => {
        const active = await activeSession(tx, learnerId, c.id);
        if (active) return active;
        if (timeLimit !== null && (await studiedToday(tx, learnerId, now, req.timeZone)) >= timeLimit * 60_000)
          throw new ConnectError("today's study time is used up", Code.ResourceExhausted);
        const waiting = new Set(
          (await essaySessions(tx, learnerId, c.id, essayTopics(c), new Date(now))).flatMap((r) =>
            r.status === "submitted" && r.topicId ? [r.topicId] : [],
          ),
        );
        const { state: s } = await state(tx, learnerId, c, true);
        const task = offered(c, s, now, waiting).find((t) => sameTask(req.task, t));
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
      const { db, c, learnerId } = await current(ctx, req.courseId);
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

    async retakeDiagnostic(req, ctx) {
      const { db, learnerId } = await decider(ctx, req.learnerId);
      const c = await course(req.courseId);
      if (!(await currentCourse(db, learnerId, c.id))) throw new ConnectError(`${c.id} is not the current course`, Code.FailedPrecondition);
      const now = deps.now();
      await db.transaction(async (tx) => {
        const { state: s } = await state(tx, learnerId, c, true);
        // A diagnostic still to be taken has nothing to start over.
        if (diagnosticDue(c.planner, s)) return;
        const active = await activeSession(tx, learnerId, c.id);
        if (active) await updateSession(tx, active.id, active.state, "abandoned", new Date(now));
        await append(tx, learnerId, c, retakeEvent(c.planner, s, now));
        await reopenPlacement(tx, learnerId, c.id);
      });
      return {};
    },

    async resetKnowledge(req, ctx) {
      const { db, learnerId } = await decider(ctx, req.learnerId);
      const subjectId = subject(req.subjectId);
      const enrolled = (await currentCourses(db, learnerId)).find((e) => e.subjectId === subjectId);
      if (!enrolled) throw new ConnectError(`no course in ${subjectId}`, Code.FailedPrecondition);
      const c = await course(enrolled.courseId);
      const now = deps.now();
      await db.transaction(async (tx) => {
        const active = await activeSession(tx, learnerId, c.id);
        if (active) await updateSession(tx, active.id, active.state, "abandoned", new Date(now));
        await append(tx, learnerId, c, { type: "reset", at: now });
        await reopenPlacement(tx, learnerId, c.id);
      });
      return {};
    },

    async getSession(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      await requireStudy(db, learnerId, deps.now());
      const row = await getSession(db, learnerId, req.id);
      if (!row) throw new ConnectError("no such session", Code.NotFound);
      // A submitted essay whose judgment has ended is settled when it is looked at.
      const settled =
        row.status === "submitted"
          ? await finishEssay(db, await course(row.courseId), learnerId, row.id, deps.now(), deps.seed())
          : undefined;
      return { session: await view(db, learnerId, settled ?? row) };
    },

    async submitAnswer(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const now = deps.now();
      await requireStudy(db, learnerId, now);
      // A recording is heard before the answer is taken, outside the transaction: what was heard is the response.
      let response = req.response;
      let heard: Heard | undefined;
      if (req.audio.length > 0 && !req.skip) {
        const row = await getSession(db, learnerId, req.sessionId);
        if (!row) throw new ConnectError("no such session", Code.NotFound);
        const run = row.state as RunState;
        if (row.status !== "active" || req.index !== run.asked.length || !run.current)
          throw new ConnectError("that question was already answered", Code.FailedPrecondition);
        if (!deps.judging) throw new ConnectError("speaking is not available", Code.FailedPrecondition);
        const entry = await course(row.courseId);
        const [problem] = await entry.source.problems([run.current]);
        const verbatim = !!entry.subject.topics.get(run.current.topic)?.verbatim;
        const hearing = await hearRecording(db, deps.judging, learnerId, problem!, req.audio, now, verbatim);
        if ("again" in hearing) return { recordAgain: text(hearing.again), session: await view(db, learnerId, row) };
        ({ response, heard } = hearing);
      }
      const out = await db.transaction(async (tx) => {
        const row = await getSession(tx, learnerId, req.sessionId, true);
        if (!row) throw new ConnectError("no such session", Code.NotFound);
        if (row.status !== "active") throw new ConnectError("the session is over", Code.FailedPrecondition);
        const run = row.state as RunState;
        if (req.index !== run.asked.length) throw new ConnectError("that question was already answered", Code.FailedPrecondition);
        const c = await course(row.courseId);
        const ref = run.current!;
        if (run.pending) {
          const j = await latestJudgment(tx, row.id, req.index);
          const failed = j?.status === "failed";
          if (req.skip && failed) {
            // A judgment that failed for good leaves the question with no result: the session ends without an event.
            await updateSession(tx, row.id, run, "abandoned", new Date(now));
            return { kind: "abandoned" as const, row: { ...row, status: "abandoned" as const } };
          }
          if (!failed && !j?.error) throw new ConnectError("the answer is still being judged", Code.FailedPrecondition);
        }
        const skipping = req.skip && canSkip(run);
        const judged: Judged | undefined = skipping ? undefined : await c.source.judge(ref, response);
        if (judged?.problem.answer.input.kind === "speech" && !heard)
          throw new ConnectError("a spoken question is answered with a recording", Code.InvalidArgument);
        if (judged?.problem.answer.judged) {
          if (!judged.verdict.correct) return { kind: "rejected" as const, row, judged };
          await requireJudgingQuota(tx, learnerId, now);
          const j = await createJudgment(tx, {
            sessionId: row.id,
            learnerId,
            index: req.index,
            attempt: (run.attempt ?? 0) + 1,
            topicId: ref.topic,
            kp: ref.kp,
            seed: ref.seed,
            response,
            criteria: judgedCriteria(c, ref.topic, judged.problem).map(criterionKey),
            createdAt: new Date(now),
            nextAt: new Date(now),
          });
          const next = { ...run, pending: { judgment: j.id, response } } as RunState;
          // An essay ends its session when it is submitted; it is judged after.
          const status = essayRun(run) ? ("submitted" as const) : ("active" as const);
          await updateSession(tx, row.id, next, status, new Date(now));
          return { kind: "pending" as const, row: { ...row, status, state: next }, c, judgment: j.id };
        }
        const { state: before } = await state(tx, learnerId, c, true);
        const answered = await answerRun(c, run, before, response, req.skip, now, rng(), judged as Given | undefined);
        return { kind: "answered" as const, row: await settle(tx, learnerId, c, row, ref, answered, now), answered };
      });
      if (out.kind === "pending" && out.row.status === "submitted") {
        const { judging, defer } = deps;
        const { c, row } = out;
        if (judging && defer) defer(judgeEssay(db, c, row, judging, now, deps.seed()).catch(() => undefined));
      } else if (out.kind === "pending") judgeLater(db, out.c, out.judgment);
      const session = await view(db, learnerId, out.row);
      if (out.kind === "pending") return { pending: true, session };
      if (out.kind === "rejected") return { feedback: feedbackOf(out.judged.problem, out.judged.verdict), session };
      if (out.kind === "abandoned") return { session };
      const run = out.row.state as RunState;
      return {
        ...(withFeedback(run) && {
          feedback: { ...feedbackOf(out.answered.problem, out.answered.verdict), ...(heard && { heard: heard.text }) },
        }),
        session,
      };
    },

    async setSpeaking(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const now = deps.now();
      await requireStudy(db, learnerId, now);
      await setSpeaking(db, learnerId, req.on ? null : speakingUntil(req.todayOnly, now, req.timeZone || "UTC"));
      if (req.on) return {};
      // A session waiting on a spoken question is left with nothing counted, so that study goes on without speaking.
      for (const e of await currentCourses(db, learnerId)) {
        const row = await activeSession(db, learnerId, e.courseId);
        const c = row && (await registry.course(row.courseId));
        const ref = (row?.state as RunState | undefined)?.current;
        if (row && c && ref && c.subject.topics.get(ref.topic)?.spoken)
          await updateSession(db, row.id, row.state, "abandoned", new Date(now));
      }
      return {};
    },

    async getJudgment(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const now = deps.now();
      await requireStudy(db, learnerId, now);
      const found = await getSession(db, learnerId, req.sessionId);
      if (!found) throw new ConnectError("no such session", Code.NotFound);
      if (found.status === "submitted") {
        // A learner still on the page of a submitted essay sees its verdict as soon as it comes.
        const after = await judgeEssay(db, await course(found.courseId), found, deps.judging, now, deps.seed());
        return { pending: !after, session: await view(db, learnerId, after ?? found) };
      }
      let j = await latestJudgment(db, found.id, req.index);
      if (!j) throw new ConnectError("no judgment for that question", Code.NotFound);
      const c = await course(found.courseId);
      if (j.status === "pending" && deps.judging && j.nextAt.getTime() <= now) {
        await runJudgment(db, c, j.id, deps.judging, now);
        j = (await latestJudgment(db, found.id, req.index))!;
      }
      if (j.status !== "done") return { pending: true, session: await view(db, learnerId, found) };
      const done = j;
      const [problem] = await c.source.problems([{ topic: done.topicId, kp: done.kp, seed: done.seed }]);
      const verdict = viewJudgment(done);
      const row = await db.transaction(async (tx) => {
        const r = (await getSession(tx, learnerId, req.sessionId, true))!;
        const run = r.state as RunState;
        if (r.status !== "active" || run.pending?.judgment !== done.id) return r;
        if (verdict.revise) {
          const next: Record<string, unknown> = { ...run, attempt: (run.attempt ?? 0) + 1, servedAt: now };
          delete next.pending;
          await updateSession(tx, r.id, next as unknown as RunState, "active", new Date(now));
          return { ...r, state: next };
        }
        const { state: before } = await state(tx, learnerId, c, true);
        const given = { problem: problem!, verdict: { correct: verdict.passed }, score: done.score ?? 0 };
        const answered = await answerRun(c, run, before, done.response, false, now, rng(), given);
        return settle(tx, learnerId, c, r, run.current!, answered, now);
      });
      return {
        ...(withFeedback(row.state as RunState) && { feedback: feedbackOf(problem!, { correct: verdict.passed }, verdict) }),
        session: await view(db, learnerId, row),
      };
    },
  };
}
