import { type Client, Code, ConnectError, createClient, createRouterTransport, type Interceptor } from "@connectrpc/connect";
import { createRng, generateProblem } from "@ga/content";
import { compileMath } from "@ga/content-math";
import { type Db, events, getSession, learnerFor, loadState } from "@ga/db";
import { createTestDb, createUser } from "@ga/db/testing";
import { applyEvent, DAY, diagnosticLength, initialState, type LearnerState, replay } from "@ga/engine";
import { CatalogService } from "@ga/proto/catalog/v1/catalog_pb";
import { LearningService, type Session, TopicStatus } from "@ga/proto/learning/v1/learning_pb";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { catalogService } from "./catalog.ts";
import { dbKey, userIdKey } from "./context.ts";
import { sessionMessage } from "./convert.ts";
import { learningService } from "./learning.ts";
import { localGateway, Registry } from "./registry.ts";
import { type RunState, startRun } from "./runner.ts";

const compiled = compileMath();
const registry = await Registry.open([localGateway(compiled)]);
const COURSE = "algebra-foundations";

let db: Db & { close(): Promise<void> };
let now: number;
let seed: number;
let learning: Client<typeof LearningService>;
let anonymous: Client<typeof LearningService>;
let catalog: Client<typeof CatalogService>;

beforeEach(async () => {
  db = await createTestDb();
  await createUser(db, "u1");
  now = Date.UTC(2026, 9, 1, 8);
  seed = 1;
  // The host authenticates and opens the database; here a header names the user.
  const auth: Interceptor = (next) => (req) => {
    req.contextValues.set(dbKey, db);
    const user = req.header.get("x-user");
    if (user) req.contextValues.set(userIdKey, user);
    return next(req);
  };
  const transport = (user?: string) =>
    createRouterTransport(
      (router) => {
        router.service(CatalogService, catalogService(registry));
        router.service(LearningService, learningService({ registry, now: () => now, seed: () => seed++ }));
      },
      {
        router: { interceptors: [auth] },
        transport: {
          interceptors: [
            (next) => (req) => {
              if (user) req.header.set("x-user", user);
              return next(req);
            },
          ],
        },
      },
    );
  learning = createClient(LearningService, transport("u1"));
  anonymous = createClient(LearningService, transport());
  catalog = createClient(CatalogService, transport());
});
afterEach(() => db.close());

/** correctAnswer peeks at the server's state to answer the current question correctly, as a perfect student would. */
async function correctAnswer(session: Session): Promise<string> {
  const row = await getSession(db, await learnerFor(db, "u1"), session.id);
  const run = row!.state as RunState;
  return generateProblem(compiled, run.current!).canonical;
}

function question(session: Session | undefined) {
  if (session?.step.case !== "question") throw new Error(`expected a question, got ${session?.step.case}`);
  return session.step.value;
}

/** finish answers every question of a session: correctly while `right` says so. */
async function finish(session: Session, right: (i: number) => boolean = () => true): Promise<Session> {
  let s = session;
  while (s.step.case === "question") {
    const q = s.step.value;
    const response = right(q.index) ? await correctAnswer(s) : "this is wrong";
    s = (await learning.submitAnswer({ sessionId: s.id, index: q.index, response })).session!;
  }
  return s;
}

async function expectCode(p: Promise<unknown>, code: Code) {
  const err = await p.then(
    () => undefined,
    (e: unknown) => e,
  );
  expect(ConnectError.from(err).code).toBe(code);
}

async function skipToLessons() {
  await learning.enroll({ courseId: COURSE });
  await learning.skipDiagnostic({ courseId: COURSE });
}

describe("rereading", () => {
  it("returns a topic's lesson with its links, and worked examples chosen by a seed", async () => {
    await skipToLessons();
    const { tasks } = await learning.getDashboard({ courseId: COURSE, timeZone: "UTC" });
    const lesson = tasks.find((t) => t.kind.case === "lesson");
    if (lesson?.kind.case !== "lesson") throw new Error("no lesson");
    const topic = await learning.getTopic({ courseId: COURSE, topicId: lesson.kind.value.topicId });
    expect(topic.knowledgePoints.length).toBe(lesson.kind.value.knowledgePoints);
    expect(topic.status).toBe(TopicStatus.AVAILABLE);
    expect(topic.knowledgePoints[0]?.example?.solution?.values.en).toBeTruthy();
    expect(topic.dependents.length).toBeGreaterThan(0);
    await expectCode(learning.getTopic({ courseId: COURSE, topicId: "nope" }), Code.NotFound);
    await expectCode(anonymous.getTopic({ courseId: COURSE, topicId: lesson.kind.value.topicId }), Code.Unauthenticated);
  });

  it("lists finished sessions, newest first, and reopens them with their questions", async () => {
    await skipToLessons();
    expect((await learning.listSessions({ courseId: COURSE })).sessions).toEqual([]);
    const { tasks } = await learning.getDashboard({ courseId: COURSE, timeZone: "UTC" });
    const task = tasks.find((t) => t.kind.case === "lesson");
    const started = await learning.startTask({ courseId: COURSE, task });
    const done = await finish(started.session!);
    const { sessions } = await learning.listSessions({ courseId: COURSE });
    expect(sessions.map((s) => s.id)).toEqual([done.id]);
    expect(sessions[0]?.passed).toBe(true);
    expect(sessions[0]?.task?.kind.case).toBe("lesson");
    expect(Number(sessions[0]?.completedAt)).toBe(now);
    const reopened = await learning.getSession({ id: done.id });
    expect(reopened.session?.step.case === "result" && reopened.session.step.value.items.length).toBe(sessions[0]?.asked);
  });
});

describe("CatalogService", () => {
  it("lists courses and returns the outline of one", async () => {
    const { courses } = await catalog.listCourses({});
    expect(courses.map((c) => c.id)).toContain(COURSE);
    const { course } = await catalog.getCourse({ courseId: COURSE });
    expect(course?.topicCount).toBe(20);
    expect(course?.title?.values["zh-CN"]).toBe("代数基础");
    expect(course?.units.flatMap((u) => u.modules.flatMap((m) => m.topics))).toHaveLength(20);
    await expectCode(catalog.getCourse({ courseId: "nope" }), Code.NotFound);
  });
});

describe("LearningService", () => {
  it("requires a signed-in, enrolled learner", async () => {
    await expectCode(anonymous.getProfile({}), Code.Unauthenticated);
    await expectCode(learning.getDashboard({ courseId: COURSE }), Code.FailedPrecondition);
    await expectCode(learning.enroll({ courseId: "nope" }), Code.NotFound);
    await expectCode(learning.getProfile({ timeZone: "Mars/Olympus" }), Code.InvalidArgument);
  });

  it("offers the diagnostic first and places the learner from it", async () => {
    await learning.enroll({ courseId: COURSE });
    const dash = await learning.getDashboard({ courseId: COURSE });
    expect(dash.diagnosed).toBe(false);
    expect(dash.tasks.map((t) => t.kind.case)).toEqual(["diagnostic"]);

    const { session } = await learning.startTask({ courseId: COURSE, task: dash.tasks[0] });
    const q = question(session);
    expect(q.canSkip).toBe(true);
    expect(q.feedback).toBe(false);
    // A learner who knows the first two units: answer correctly on integer and expression topics only.
    const knows = new Set((await registry.course(COURSE))!.course.def.units.slice(0, 2).flatMap((u) => u.modules.flatMap((m) => m.topics)));
    let s = session!;
    while (s.step.case === "question") {
      const step = s.step.value;
      const row = await getSession(db, await learnerFor(db, "u1"), s.id);
      const topic = (row!.state as RunState).current!.topic;
      const res = await learning.submitAnswer(
        knows.has(topic)
          ? { sessionId: s.id, index: step.index, response: await correctAnswer(s) }
          : { sessionId: s.id, index: step.index, skip: true },
      );
      expect(res.feedback).toBeUndefined();
      s = res.session!;
    }
    expect(s.step.case).toBe("result");
    const placed = s.step.case === "result" ? s.step.value.placed : 0;
    expect(placed).toBe(knows.size);

    const after = await learning.getDashboard({ courseId: COURSE });
    expect(after.diagnosed).toBe(true);
    expect(after.stats?.learned).toBe(knows.size);
    const firstLesson = after.tasks.find((t) => t.kind.case === "lesson");
    expect(firstLesson?.kind.case === "lesson" && firstLesson.kind.value.topicId).toBe("one-step-equations-addition");

    // Another course of the subject has its own diagnostic, over the topics not placed yet.
    await learning.enroll({ courseId: "prealgebra" });
    const other = await learning.getDashboard({ courseId: "prealgebra" });
    expect(other.diagnosed).toBe(false);
    const task = other.tasks[0]?.kind;
    const { topics, assumed } = (await registry.course("prealgebra"))!.planner.scope;
    const open = topics.filter((t) => !knows.has(t) && !assumed.has(t));
    expect(task?.case === "diagnostic" && task.value.maxQuestions).toBe(diagnosticLength(open.length));
    await learning.skipDiagnostic({ courseId: "prealgebra" });
    expect((await learning.getDashboard({ courseId: "prealgebra" })).diagnosed).toBe(true);
    expect((await learning.getDashboard({ courseId: COURSE })).stats?.learned).toBe(knows.size);
  });

  it("starts a practice-only lesson with practice, unless the learner failed it", async () => {
    const c = (await registry.course("sat-math-prep"))!;
    const topic = c.course.topics.find((t) => t.includes("-exam-"))!;
    const intro = async (state: LearnerState) => {
      const run = startRun(c, { kind: "lesson", topic }, state, createRng(1));
      const step = (await sessionMessage(c, "s", run, state)).step;
      return step?.case === "question" ? step.value.intro : undefined;
    };
    expect(await intro(initialState)).toBeUndefined();
    const failed = applyEvent(c.ctx, initialState, { type: "lesson", at: now, topic, passed: false, asked: 5, correct: 1 });
    expect((await intro(failed))?.example?.answer).not.toBe("");
  });

  it("teaches a lesson knowledge point by knowledge point and awards its XP", async () => {
    await skipToLessons();
    const dash = await learning.getDashboard({ courseId: COURSE, timeZone: "Asia/Shanghai" });
    const lesson = dash.tasks.find((t) => t.kind.case === "lesson")!;
    expect(lesson.kind.case === "lesson" && lesson.kind.value.topicId).toBe("integers-and-opposites");

    const { session } = await learning.startTask({ courseId: COURSE, task: lesson });
    const q = question(session);
    expect(q.intro?.index).toBe(0);
    expect(q.intro?.example?.answer).not.toBe("");
    expect(q.lesson).toMatchObject({ knowledgePoint: 0, streak: 0, needed: 2 });

    // Resuming returns the same session, whatever task is asked for.
    const again = await learning.startTask({ courseId: COURSE, task: dash.tasks[1] });
    expect(again.session?.id).toBe(session!.id);
    expect((await learning.getDashboard({ courseId: COURSE })).active?.id).toBe(session!.id);

    // A correct answer gets feedback; the second question has no intro.
    const first = await learning.submitAnswer({ sessionId: session!.id, index: 0, response: await correctAnswer(session!) });
    expect(first.feedback).toMatchObject({ correct: true });
    expect(question(first.session).intro).toBeUndefined();
    expect(question(first.session).lesson?.streak).toBe(1);
    // A stale index is rejected.
    await expectCode(learning.submitAnswer({ sessionId: session!.id, index: 0, response: "1" }), Code.FailedPrecondition);
    // A wrong answer reveals the answer and the solution.
    const wrong = await learning.submitAnswer({ sessionId: session!.id, index: 1, response: "this is wrong" });
    expect(wrong.feedback?.correct).toBe(false);
    expect(wrong.feedback?.answer).not.toBe("");
    expect(wrong.feedback?.solution?.values.en).not.toBe("");

    const done = await finish(wrong.session!);
    expect(done.step.case === "result" && done.step.value).toMatchObject({ passed: true, xp: 13 });
    const after = await learning.getDashboard({ courseId: COURSE, timeZone: "Asia/Shanghai" });
    expect(after.active).toBeUndefined();
    expect(after.xp).toMatchObject({ total: 13, today: 13 });
    expect(after.xp?.days).toHaveLength(14);
    expect(after.stats?.learned).toBe(1);
  });

  it("only starts offered tasks", async () => {
    await skipToLessons();
    const task = { kind: { case: "lesson" as const, value: { topicId: "two-step-equations" } } };
    await expectCode(learning.startTask({ courseId: COURSE, task }), Code.FailedPrecondition);
    await expectCode(learning.startTask({ courseId: COURSE, task: { kind: { case: "diagnostic", value: {} } } }), Code.FailedPrecondition);
  });

  it("fails a lesson after repeated mistakes and holds the topic back until its prerequisites are reviewed", async () => {
    await skipToLessons();
    const lessonTask = async () => (await learning.getDashboard({ courseId: COURSE })).tasks.find((t) => t.kind.case === "lesson")!;
    const first = await learning.startTask({ courseId: COURSE, task: await lessonTask() });
    await finish(first.session!);
    now += 10 * 60_000;

    const next = await lessonTask();
    const topicId = next.kind.case === "lesson" ? next.kind.value.topicId : "";
    const { session } = await learning.startTask({ courseId: COURSE, task: next });
    const done = await finish(session!, () => false);
    expect(done.step.case === "result" && done.step.value).toMatchObject({ passed: false, xp: 0, asked: 4 });
    const status = async () => (await learning.getCourseProgress({ courseId: COURSE })).topics.find((t) => t.topicId === topicId)?.status;
    expect(await status()).toBe(TopicStatus.FAILED);
    expect(
      (await learning.getDashboard({ courseId: COURSE })).tasks.some((t) => t.kind.case === "lesson" && t.kind.value.topicId === topicId),
    ).toBe(false);
  });

  it("reviews a topic once it is due, and the log replays to the stored state", async () => {
    await skipToLessons();
    const dash = await learning.getDashboard({ courseId: COURSE });
    const { session } = await learning.startTask({ courseId: COURSE, task: dash.tasks.find((t) => t.kind.case === "lesson") });
    await finish(session!);

    now += 2 * DAY;
    const later = await learning.getDashboard({ courseId: COURSE });
    expect(later.stats?.due).toBe(1);
    const review = later.tasks.find((t) => t.kind.case === "review")!;
    expect(review.kind.case === "review" && review.kind.value.covers).toEqual(["integers-and-opposites"]);
    const started = await learning.startTask({ courseId: COURSE, task: review });
    expect(question(started.session).total).toBe(3);
    const done = await finish(started.session!, (i) => i !== 1);
    expect(done.step.case === "result" && done.step.value).toMatchObject({ passed: true, correct: 2, asked: 3 });
    expect(done.step.case === "result" && done.step.value.items.map((i) => i.correct)).toEqual([true, false, true]);
    expect((await learning.getDashboard({ courseId: COURSE })).stats?.due).toBe(0);

    const learnerId = await learnerFor(db, "u1");
    const stored = await loadState(db, learnerId, "math", initialState);
    expect(stored.seq).toBe(3);
    expect(replay((await registry.subject("math"))!.ctx, await events(db, learnerId, "math"), initialState)).toEqual(stored.state);
  });

  it("summarizes the profile", async () => {
    await skipToLessons();
    const { enrollments, xp } = await learning.getProfile({ timeZone: "UTC" });
    expect(enrollments).toHaveLength(1);
    expect(enrollments[0]).toMatchObject({ courseId: COURSE, stats: { learned: 0, total: 20, due: 0 } });
    expect(xp).toMatchObject({ total: 0, today: 0 });
  });
});
