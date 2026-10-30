import { compileSubject, same, t } from "@ga/content";
import { applyEvent, DAY, defaultParams, type EngineEvent, engineGraph, initialState, replay } from "@ga/engine";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { Db } from "./db.ts";
import {
  activeSession,
  appendEvent,
  createSession,
  enroll,
  enrollments,
  events,
  getSession,
  isEnrolled,
  learnerFor,
  loadState,
  recordAnswer,
  totalXp,
  updateSession,
  xpByDay,
} from "./learning.ts";
import { createTestDb, createUser } from "./testing.ts";

const subject = compileSubject({
  id: "test",
  title: same("Test"),
  topics: ["a", "b", "c"].map((id, i, all) => ({
    id,
    title: t(id, id),
    summary: t(id, id),
    prerequisites: i === 0 ? [] : [all[i - 1]!],
    encompasses: i === 0 ? [] : [{ topic: all[i - 1]!, weight: 1 }],
    xp: 12,
    knowledgePoints: [
      {
        id: "kp",
        title: same("k"),
        explanation: same("e"),
        generate: () => ({
          prompt: same("p"),
          answer: { checker: "text", expected: ["1"], input: { kind: "text" } },
          solution: same("s"),
          canonical: "1",
        }),
      },
    ],
  })),
  courses: [],
  checkers: [],
});
const ctx = { params: defaultParams, graph: engineGraph(subject.graph) };
const t0 = Date.UTC(2026, 9, 1, 15, 30);

let db: Db & { close(): Promise<void> };
beforeEach(async () => {
  db = await createTestDb();
  await createUser(db, "u1");
});
afterEach(() => db.close());

/** record appends events the way the API does: fold, then append with the next seq. */
async function record(learnerId: string, evs: EngineEvent[]) {
  for (const e of evs) {
    const stored = await loadState(db, learnerId, "test", initialState);
    const state = applyEvent(ctx, stored.state, e);
    await appendEvent(db, { learnerId, subjectId: "test", seq: stored.seq + 1, event: e, xp: state.xp - stored.state.xp, state });
  }
}

const log: EngineEvent[] = [
  { type: "placed", at: t0, course: "course", known: [], tested: [] },
  { type: "lesson", at: t0 + 60_000, topic: "a", passed: true, asked: 2, correct: 2 },
  { type: "lesson", at: t0 + 120_000, topic: "b", passed: false, asked: 4, correct: 2 },
  { type: "review", at: t0 + DAY, topic: "a", correct: 3, total: 3 },
  { type: "lesson", at: t0 + DAY + 60_000, topic: "b", passed: true, asked: 3, correct: 2 },
];

describe("learners and enrollments", () => {
  it("creates one learner per user", async () => {
    const a = await learnerFor(db, "u1");
    expect(await learnerFor(db, "u1")).toBe(a);
  });

  it("enrolls idempotently", async () => {
    const l = await learnerFor(db, "u1");
    await enroll(db, l, "test", "c1");
    await enroll(db, l, "test", "c1");
    expect(await enrollments(db, l)).toEqual([{ subjectId: "test", courseId: "c1" }]);
    expect(await isEnrolled(db, l, "c1")).toBe(true);
    expect(await isEnrolled(db, l, "c2")).toBe(false);
  });
});

describe("event log", () => {
  it("stores a snapshot that replaying the log reproduces", async () => {
    const l = await learnerFor(db, "u1");
    await record(l, log);
    const stored = await loadState(db, l, "test", initialState);
    expect(stored.seq).toBe(log.length);
    expect(await events(db, l, "test")).toEqual(log);
    expect(replay(ctx, await events(db, l, "test"), initialState)).toEqual(stored.state);
  });

  it("rejects a second event with the same seq", async () => {
    const l = await learnerFor(db, "u1");
    await record(l, log.slice(0, 1));
    const e = log[1]!;
    const append = () => appendEvent(db, { learnerId: l, subjectId: "test", seq: 1, event: e, xp: 0, state: initialState });
    await expect(append()).rejects.toThrow();
  });

  it("sums XP in total and per day in the learner's time zone", async () => {
    const l = await learnerFor(db, "u1");
    await record(l, log);
    // Lessons of 12 XP on day 1, then a 4 XP review and a 12 XP lesson on day 2.
    expect(await totalXp(db, l)).toBe(28);
    const utc = await xpByDay(db, l, new Date(t0 - DAY), "UTC");
    expect(Object.fromEntries(utc)).toEqual({ "2026-10-01": 12, "2026-10-02": 16 });
    // 15:30 UTC is 05:30 the next day at UTC+14.
    const kiritimati = await xpByDay(db, l, new Date(t0 - DAY), "Pacific/Kiritimati");
    expect(Object.fromEntries(kiritimati)).toEqual({ "2026-10-02": 12, "2026-10-03": 16 });
  });
});

describe("sessions", () => {
  it("allows one active session per course and records answers", async () => {
    const l = await learnerFor(db, "u1");
    const at = new Date(t0);
    const s = await createSession(db, {
      learnerId: l,
      subjectId: "test",
      courseId: "c1",
      kind: "lesson",
      topicId: "a",
      state: { n: 1 },
      at,
    });
    await expect(createSession(db, { learnerId: l, subjectId: "test", courseId: "c1", kind: "quiz", state: {}, at })).rejects.toThrow();
    expect((await activeSession(db, l, "c1"))?.id).toBe(s.id);

    await recordAnswer(db, {
      sessionId: s.id,
      learnerId: l,
      index: 0,
      topicId: "a",
      kp: 0,
      seed: 4_000_000_000,
      response: "1",
      correct: true,
      at,
    });
    await expect(
      recordAnswer(db, { sessionId: s.id, learnerId: l, index: 0, topicId: "a", kp: 0, seed: 1, response: "2", correct: false, at }),
    ).rejects.toThrow();

    await db.transaction(async (tx) => {
      const locked = await getSession(tx, l, s.id, true);
      expect(locked?.state).toEqual({ n: 1 });
      await updateSession(tx, s.id, { n: 2 }, "completed", new Date(t0 + 1000));
    });
    expect(await activeSession(db, l, "c1")).toBeUndefined();
    const done = await getSession(db, l, s.id);
    expect(done).toMatchObject({ status: "completed", state: { n: 2 } });
    expect(done?.completedAt?.getTime()).toBe(t0 + 1000);
    // Another learner cannot read it.
    await createUser(db, "u2");
    expect(await getSession(db, await learnerFor(db, "u2"), s.id)).toBeUndefined();
  });
});
