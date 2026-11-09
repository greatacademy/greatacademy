import { type Client, Code, ConnectError, createClient, createRouterTransport, type Interceptor } from "@connectrpc/connect";
import { generateProblem } from "@ga/content";
import { compileMath } from "@ga/content-math";
import { appendEvent, type Db, getSession, learnerFor, loadState } from "@ga/db";
import { createTestDb, createUser } from "@ga/db/testing";
import { DAY, type EngineEvent, initialState, WEEK, weekStart } from "@ga/engine";
import { AccountService, LeagueOutcome } from "@ga/proto/account/v1/account_pb";
import { LearningService, type Session } from "@ga/proto/learning/v1/learning_pb";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { accountService, normalUsername } from "./account.ts";
import { dbKey, userIdKey } from "./context.ts";
import { learningService } from "./learning.ts";
import { localGateway, Registry } from "./registry.ts";
import type { RunState } from "./runner.ts";

const compiled = compileMath();
const registry = await Registry.open([localGateway(compiled)]);
const COURSE = "algebra-foundations";
const OTHER_COURSE = "prealgebra";
const MONDAY = Date.UTC(2026, 9, 5);

let db: Db & { close(): Promise<void> };
let now: number;
let seed: number;

const transport = (user: string) => {
  const auth: Interceptor = (next) => (req) => {
    req.contextValues.set(dbKey, db);
    req.contextValues.set(userIdKey, user);
    return next(req);
  };
  return createRouterTransport(
    (router) => {
      router.service(AccountService, accountService({ registry, now: () => now }));
      router.service(LearningService, learningService({ registry, now: () => now, seed: () => seed++ }));
    },
    { router: { interceptors: [auth] } },
  );
};
const account = (user: string): Client<typeof AccountService> => createClient(AccountService, transport(user));
const learning = (user: string): Client<typeof LearningService> => createClient(LearningService, transport(user));

/** earn records XP at a time, as a finished task would. */
const seqs = new Map<string, number>();
async function earn(user: string, xp: number, at: number, subjectId = "math") {
  const learnerId = await learnerFor(db, user);
  const e: EngineEvent = { type: "quiz", at, results: [] };
  const seq = (seqs.get(`${user} ${subjectId}`) ?? 0) + 1;
  seqs.set(`${user} ${subjectId}`, seq);
  await appendEvent(db, { learnerId, subjectId, seq, event: e, xp, state: initialState });
}

/** league signs a user up for leagues. */
async function join(user: string) {
  await account(user).setUsername({ username: `${user}-name` });
  await account(user).setLeagues({ enabled: true });
}

async function code(p: Promise<unknown>): Promise<Code | undefined> {
  return p.then(
    () => undefined,
    (e) => ConnectError.from(e).code,
  );
}

beforeEach(async () => {
  db = await createTestDb();
  for (const u of ["u1", "u2", "u3"]) await createUser(db, u);
  seqs.clear();
  now = MONDAY + 3.5 * DAY;
  seed = 1;
});
afterEach(() => db.close());

describe("usernames", () => {
  it("accept letters of any script and refuse the rest", () => {
    expect(normalUsername(" 小明_01 ")).toBe("小明_01");
    for (const bad of ["ab", "a b c", "a".repeat(21), "<script>"]) expect(() => normalUsername(bad)).toThrow();
  });

  it("are unique ignoring case", async () => {
    await account("u1").setUsername({ username: "Ada-L" });
    expect(await code(account("u2").setUsername({ username: "ada-l" }))).toBe(Code.AlreadyExists);
    await account("u1").setUsername({ username: "ada-l" });
    expect((await account("u1").getSettings({})).username).toBe("ada-l");
  });
});

describe("goals", () => {
  it("set the day's and week's targets of a subject, unless paused", async () => {
    await learning("u1").chooseCourse({ courseId: COURSE });
    // A Thursday: 3 days after Monday.
    await learning("u1").setGoals({ subjectId: "math", goals: { weekdays: [10, 20, 30, 40, 50, 60, 70], paused: false } });
    await earn("u1", 7, MONDAY + DAY);
    await earn("u1", 5, now - 1000);
    await earn("u1", 100, MONDAY - 1000);
    const profile = await learning("u1").getProfile({ timeZone: "UTC" });
    expect(profile.xp).toMatchObject({ goalToday: 40, goalWeek: 280, week: 12, today: 5 });
    expect(profile.enrollments[0]?.xp).toMatchObject({ goalToday: 40, week: 12, total: 112 });
    const dash = await learning("u1").getDashboard({ courseId: COURSE, timeZone: "UTC" });
    expect(dash.xp).toMatchObject({ goalToday: 40, today: 5 });
    expect(dash.goals?.weekdays).toEqual([10, 20, 30, 40, 50, 60, 70]);
    await learning("u1").setGoals({ subjectId: "math", goals: { weekdays: [10, 20, 30, 40, 50, 60, 70], paused: true } });
    expect((await learning("u1").getProfile({ timeZone: "UTC" })).xp).toMatchObject({ goalToday: 0, goalWeek: 0, week: 12 });
  });

  it("count each subject's XP apart, and the profile sums them", async () => {
    await learning("u1").chooseCourse({ courseId: COURSE });
    await learning("u1").setGoals({ subjectId: "math", goals: { weekdays: [10, 10, 10, 10, 10, 10, 10], paused: false } });
    await earn("u1", 7, now - 1000);
    await earn("u1", 3, now - 1000, "english");
    const profile = await learning("u1").getProfile({ timeZone: "UTC" });
    expect(profile.xp).toMatchObject({ goalToday: 10, today: 10, total: 10 });
    expect(profile.enrollments[0]?.xp).toMatchObject({ today: 7, total: 7 });
  });

  it("take seven valid weekdays and a subject that exists", async () => {
    const set = (weekdays: number[], subjectId = "math") =>
      code(learning("u1").setGoals({ subjectId, goals: { weekdays, paused: false } }));
    expect(await set([10])).toBe(Code.InvalidArgument);
    expect(await set([-1, 0, 0, 0, 0, 0, 0])).toBe(Code.InvalidArgument);
    expect(await set([], "history")).toBe(Code.NotFound);
  });
});

describe("end dates", () => {
  it("are set and cleared by the supervisor, and dropped with the course", async () => {
    await learning("u1").chooseCourse({ courseId: COURSE });
    expect(await code(learning("u1").setEndDate({ subjectId: "math", endDate: "2026-02-30" }))).toBe(Code.InvalidArgument);
    await learning("u1").setEndDate({ subjectId: "math", endDate: "2027-06-30" });
    expect((await learning("u1").getDashboard({ courseId: COURSE, timeZone: "UTC" })).endDate).toBe("2027-06-30");
    await learning("u1").chooseCourse({ courseId: OTHER_COURSE });
    expect((await learning("u1").getDashboard({ courseId: OTHER_COURSE, timeZone: "UTC" })).endDate).toBe("");
  });
});

describe("leagues", () => {
  it("need a username", async () => {
    expect(await code(account("u1").setLeagues({ enabled: true }))).toBe(Code.FailedPrecondition);
  });

  it("list no one until the learner earns XP in the week", async () => {
    await join("u1");
    const league = await account("u1").getLeague({});
    expect(league).toMatchObject({ enabled: true, tier: 0, rows: [] });
    expect(Number(league.endsAt)).toBe(weekStart(now) + WEEK);
  });

  it("rank a group by the XP of the week, showing only usernames", async () => {
    for (const u of ["u1", "u2", "u3"]) await join(u);
    await earn("u1", 10, now);
    await earn("u2", 30, now);
    await earn("u3", 20, now);
    await earn("u3", 500, MONDAY - 1000);
    await account("u1").getLeague({});
    await account("u2").getLeague({});
    const league = await account("u3").getLeague({});
    expect(league.rows.map((r) => [r.rank, r.username, r.xp, r.me])).toEqual([
      [1, "u2-name", 30, false],
      [2, "u3-name", 20, true],
      [3, "u1-name", 10, false],
    ]);
    expect(league).toMatchObject({ promote: 1, demote: 0 });
  });

  it("moves members by how the week ended, with nothing but the log", async () => {
    for (const u of ["u1", "u2", "u3"]) await join(u);
    for (const [u, xp] of [
      ["u1", 30],
      ["u2", 20],
      ["u3", 10],
    ] as const) {
      await earn(u, xp, now);
      await account(u).getLeague({});
    }
    now += WEEK;
    const first = await account("u1").getLeague({});
    expect(first.tier).toBe(1);
    expect(first.last).toMatchObject({ rank: 1, tier: 0, outcome: LeagueOutcome.PROMOTED, missedWeeks: 0 });
    expect((await account("u2").getLeague({})).tier).toBe(0);
    await earn("u1", 5, now);
    const inTier = await account("u1").getLeague({});
    expect(inTier).toMatchObject({ tier: 1, rows: [{ rank: 1, me: true }] });
    expect(inTier.last?.outcome).toBe(LeagueOutcome.PROMOTED);
  });

  it("lowers the tier for a week missed", async () => {
    for (const u of ["u1", "u2"]) await join(u);
    await earn("u1", 30, now);
    await account("u1").getLeague({});
    now += WEEK;
    expect((await account("u1").getLeague({})).tier).toBe(1);
    await earn("u1", 1, now);
    await account("u1").getLeague({});
    now += 3 * WEEK;
    const later = await account("u1").getLeague({});
    expect(later.last?.missedWeeks).toBe(2);
    expect(later.tier).toBe(0);
  });

  it("drop a learner who leaves from this week's group", async () => {
    await join("u1");
    await earn("u1", 30, now);
    expect((await account("u1").getLeague({})).rows).toHaveLength(1);
    await account("u1").setLeagues({ enabled: false });
    expect(await account("u1").getLeague({})).toMatchObject({ enabled: false, rows: [] });
  });

  it("start with the first XP of a finished task", async () => {
    await join("u1");
    await learning("u1").chooseCourse({ courseId: COURSE });
    await learning("u1").skipDiagnostic({ courseId: COURSE });
    const session = await finishLesson("u1");
    expect(session.step.case).toBe("result");
    expect((await account("u1").getLeague({})).rows).toHaveLength(1);
  });
});

/** finishLesson takes the first lesson on offer perfectly and returns the last session. */
async function finishLesson(user: string): Promise<Session> {
  const { tasks } = await learning(user).getDashboard({ courseId: COURSE });
  let session = (await learning(user).startTask({ courseId: COURSE, task: tasks.find((t) => t.kind.case === "lesson")! })).session!;
  const learnerId = await learnerFor(db, user);
  while (session.step.case === "question") {
    const run = (await getSession(db, learnerId, session.id))!.state as RunState;
    now += 20_000;
    const response = generateProblem(compiled, run.current!).canonical;
    session = (await learning(user).submitAnswer({ sessionId: session.id, index: run.asked.length, response, skip: false })).session!;
  }
  return session;
}

describe("the XP of a session", () => {
  beforeEach(async () => {
    await learning("u1").chooseCourse({ courseId: COURSE });
    await learning("u1").skipDiagnostic({ courseId: COURSE });
  });

  it("reports a perfect lesson with its bonus", async () => {
    const session = await finishLesson("u1");
    if (session.step.case !== "result") throw new Error("expected a result");
    const { xp, fullXp, blownOff } = session.step.value;
    expect(xp).toBe(fullXp + 2);
    expect(blownOff).toBe(false);
    const [row] = (await learning("u1").listSessions({ courseId: COURSE })).sessions;
    expect(row).toMatchObject({ xp, fullXp });
  });

  /** failLesson answers wrongly until the lesson ends, secondsEach apart. */
  async function failLesson(secondsEach: number): Promise<Session> {
    const { tasks } = await learning("u1").getDashboard({ courseId: COURSE });
    let session = (await learning("u1").startTask({ courseId: COURSE, task: tasks.find((t) => t.kind.case === "lesson")! })).session!;
    for (let index = 0; session.step.case === "question"; index++) {
      now += secondsEach * 1000;
      session = (await learning("u1").submitAnswer({ sessionId: session.id, index, response: "no such answer", skip: false })).session!;
    }
    return session;
  }

  it("spares a slow failure and warns about a rushed one, which then starts to cost XP", async () => {
    const slow = await failLesson(30);
    expect(slow.step.case === "result" && slow.step.value.blownOff).toBe(false);
    const learnerId = await learnerFor(db, "u1");
    const rushed = await failLesson(1);
    expect(rushed.step.case === "result" && rushed.step.value).toMatchObject({ blownOff: true, xp: 0 });
    const { state } = await loadState(db, learnerId, "math", initialState);
    expect(state.blowOffs).toBe(1);
    expect(state.xp).toBe(0);
  });

  it("forecasts what the course still takes and the pace so far", async () => {
    const before = await learning("u1").getDashboard({ courseId: COURSE, timeZone: "UTC" });
    expect(before.remainingXp).toBeGreaterThan(0);
    expect(before.pace).toBe(0);
    await finishLesson("u1");
    const after = await learning("u1").getDashboard({ courseId: COURSE, timeZone: "UTC" });
    expect(after.remainingXp).toBeLessThan(before.remainingXp);
    expect(after.pace).toBe(after.xp!.total / 14);
  });
});

describe("guardians", () => {
  it("follow a learner with an invitation that works once", async () => {
    const { code: invite } = await account("u1").createGuardianInvite({});
    expect(await code(account("u1").acceptGuardianInvite({ code: invite }))).toBe(Code.InvalidArgument);
    const again = (await account("u1").createGuardianInvite({})).code;
    const { learnerId } = await account("u2").acceptGuardianInvite({ code: again.toLowerCase() });
    expect(await code(account("u3").acceptGuardianInvite({ code: again }))).toBe(Code.NotFound);
    expect((await account("u1").getSettings({})).guardians.map((g) => g.userId)).toEqual(["u2"]);
    const { learners } = await account("u2").listGuardedLearners({ timeZone: "UTC" });
    expect(learners.map((l) => [l.learnerId, l.name])).toEqual([[learnerId, "u1"]]);
  });

  it("refuse an expired invitation", async () => {
    const { code: invite } = await account("u1").createGuardianInvite({});
    now += 8 * DAY;
    expect(await code(account("u2").acceptGuardianInvite({ code: invite }))).toBe(Code.NotFound);
  });

  it("see how the learner is doing and set goals, while others cannot", async () => {
    await learning("u1").chooseCourse({ courseId: COURSE });
    const { code: invite } = await account("u1").createGuardianInvite({});
    const { learnerId } = await account("u2").acceptGuardianInvite({ code: invite });
    const seen = await account("u2").getGuardedLearner({ learnerId, timeZone: "UTC" });
    expect(seen.learner?.enrollments.map((e) => [e.courseId, e.subjectId])).toEqual([[COURSE, "math"]]);
    expect(seen.learner).toMatchObject({ lastActiveAt: 0n, studying: false });
    expect(seen.learner?.recent).toMatchObject({ lessons: 0, failedLessons: 0, blownOff: 0 });
    await learning("u2").setGoals({ learnerId, subjectId: "math", goals: { weekdays: [5, 5, 5, 5, 5, 5, 5], paused: false } });
    expect((await learning("u1").getDashboard({ courseId: COURSE, timeZone: "UTC" })).goals?.weekdays).toHaveLength(7);
    expect(await code(account("u3").getGuardedLearner({ learnerId, timeZone: "UTC" }))).toBe(Code.NotFound);
    expect(await code(learning("u3").setGoals({ learnerId, subjectId: "math", goals: { weekdays: [], paused: false } }))).toBe(
      Code.NotFound,
    );
    expect(await code(account("u3").getGuardedLearner({ learnerId: "not-a-uuid", timeZone: "UTC" }))).toBe(Code.NotFound);
  });

  it("read the learner's course, but no one else's, and only while they follow", async () => {
    await learning("u1").chooseCourse({ courseId: COURSE });
    const { tasks } = await learning("u1").getDashboard({ courseId: COURSE, timeZone: "UTC" });
    await learning("u1").startTask({ courseId: COURSE, task: tasks[0] });
    const { code: invite } = await account("u1").createGuardianInvite({});
    const { learnerId } = await account("u2").acceptGuardianInvite({ code: invite });

    const [seen] = (await account("u2").listGuardedLearners({ timeZone: "UTC" })).learners;
    expect(seen).toMatchObject({ studying: true });
    expect(seen?.enrollments[0]?.courseId).toBe(COURSE);
    expect(Number(seen?.lastActiveAt)).toBe(now);

    const read = (user: string, id: string) =>
      Promise.all([
        learning(user).getDashboard({ courseId: COURSE, timeZone: "UTC", learnerId: id }),
        learning(user).getCourseProgress({ courseId: COURSE, learnerId: id }),
        learning(user).listSessions({ courseId: COURSE, learnerId: id }),
      ]);
    const [dashboard] = await read("u2", learnerId);
    expect(dashboard.active?.task).toBeDefined();
    expect(await code(read("u3", learnerId))).toBe(Code.NotFound);
    expect(await code(read("u2", "not-a-uuid"))).toBe(Code.NotFound);

    await account("u2").removeGuardedLearner({ learnerId });
    expect(await code(read("u2", learnerId))).toBe(Code.NotFound);
  });

  it("can be removed by either side", async () => {
    const add = async () =>
      (await account("u2").acceptGuardianInvite({ code: (await account("u1").createGuardianInvite({})).code })).learnerId;
    let learnerId = await add();
    await account("u1").removeGuardian({ userId: "u2" });
    expect(await code(account("u2").getGuardedLearner({ learnerId, timeZone: "UTC" }))).toBe(Code.NotFound);
    learnerId = await add();
    await account("u2").removeGuardedLearner({ learnerId });
    expect((await account("u1").getSettings({})).guardians).toEqual([]);
  });
});
