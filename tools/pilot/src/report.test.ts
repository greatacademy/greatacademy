import { appendEvent, createSession, type Db, learnerFor, recordAnswer, updateSession } from "@ga/db";
import { createTestDb, createUser } from "@ga/db/testing";
import { initialState } from "@ga/engine";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { type AnswerRow, loadPilotData, normalizeResponse, renderPilotReport, summarize } from "./report.ts";

const row = (learnerId: string, correct: boolean, response = "1", kp = 0, topicId = "a"): AnswerRow => ({
  learnerId,
  topicId,
  kp,
  response,
  skipped: false,
  correct,
});
const options = { minLearners: 2, wrongPerKp: 2 };

describe("summarize", () => {
  it("counts the first answer of each learner on its own", () => {
    const report = summarize({ answers: [row("x", false, "2"), row("x", true), row("y", true)], sessions: [], lessons: [] }, options);
    expect(report.kps).toHaveLength(1);
    expect(report.kps[0]).toMatchObject({ answers: 3, learners: 2, firstTryRate: 0.5 });
    expect(report.kps[0]?.correctRate).toBeCloseTo(2 / 3);
  });

  it("puts the hardest knowledge point first and leaves out those with too few learners", () => {
    const answers = [
      row("x", true, "1", 0),
      row("y", true, "1", 0),
      row("x", false, "2", 1),
      row("y", true, "1", 1),
      row("x", false, "2", 2),
    ];
    const report = summarize({ answers, sessions: [], lessons: [] }, options);
    expect(report.kps.map((k) => k.kp)).toEqual([1, 0]);
    expect(report.tooFew).toBe(1);
  });

  it("lists every different rejected sentence, and no chosen options", () => {
    const answers = [
      row("x", false, "We left, because it rained."),
      row("y", false, "we left, because it  rained."),
      row("x", false, "2"),
      row("y", true),
    ];
    const report = summarize({ answers, sessions: [], lessons: [] }, options);
    expect(report.kps[0]?.rejectedSentences).toEqual(["we left, because it  rained."]);
  });

  it("groups wrong responses by learner, ignoring spacing and skipped answers", () => {
    const answers = [
      row("x", false, "x = 3"),
      row("x", false, "x=3"),
      row("y", false, "x =3"),
      row("z", false, "5"),
      { ...row("z", false, ""), skipped: true },
    ];
    const report = summarize({ answers, sessions: [], lessons: [] }, options);
    expect(report.kps[0]?.wrong).toEqual([
      { response: "x = 3", learners: 2 },
      { response: "5", learners: 1 },
    ]);
    expect(report.kps[0]?.skipRate).toBeCloseTo(0.2);
  });

  it("sums up lessons and sessions", () => {
    const report = summarize(
      {
        answers: [],
        sessions: [
          { learnerId: "x", kind: "lesson", status: "completed" },
          { learnerId: "y", kind: "lesson", status: "abandoned" },
          { learnerId: "y", kind: "review", status: "active" },
        ],
        lessons: [
          { learnerId: "x", topicId: "a", passed: true },
          { learnerId: "y", topicId: "a", passed: false },
          { learnerId: "y", topicId: "b", passed: true },
        ],
      },
      options,
    );
    expect(report.learners).toBe(2);
    expect(report.lessonsEnded).toBe(3);
    expect(report.lessonsPassed).toBe(2);
    expect(report.topics).toEqual([{ topicId: "a", lessons: 2, learners: 2, failRate: 0.5 }]);
    expect(report.sessions).toEqual([
      { kind: "lesson", started: 2, completed: 1, abandoned: 1 },
      { kind: "review", started: 1, completed: 0, abandoned: 0 },
    ]);
  });

  it("has no rate to divide by zero on no data", () => {
    const report = summarize({ answers: [], sessions: [], lessons: [] }, options);
    expect(report).toMatchObject({ learners: 0, lessonsEnded: 0, kps: [], topics: [], tooFew: 0 });
  });
});

describe("normalizeResponse", () => {
  it("ignores spacing and case", () => {
    expect(normalizeResponse(" X = 3 ")).toBe("x=3");
  });
});

describe("renderPilotReport", () => {
  it("names topics and knowledge points and escapes table cells", () => {
    const report = summarize({ answers: [row("x", false, "|x|"), row("y", false, "|x|")], sessions: [], lessons: [] }, options);
    const text = renderPilotReport("course", report, { topic: () => "Topic A", kp: () => "Point 1" });
    expect(text).toContain("| Topic A | Point 1 | 2 | 0% | 0% | 0% |");
    expect(text).toContain("`\\|x\\|`");
  });
});

describe("loadPilotData", () => {
  let db: Db & { close(): Promise<void> };
  const t0 = Date.UTC(2026, 0, 1);

  beforeEach(async () => {
    db = await createTestDb();
  });
  afterEach(() => db.close());

  async function session(userId: string, courseId: string) {
    await createUser(db, userId);
    const learnerId = await learnerFor(db, userId);
    const s = await createSession(db, {
      learnerId,
      subjectId: "test",
      courseId,
      kind: "lesson",
      topicId: "a",
      state: {},
      at: new Date(t0),
    });
    return { learnerId, id: s.id };
  }

  it("reads one course's rows, from the given time on", async () => {
    const { learnerId, id } = await session("u1", "c1");
    const other = await session("u2", "c2");
    const answer = (sessionId: string, learner: string, index: number, at: number) =>
      recordAnswer(db, {
        sessionId,
        learnerId: learner,
        index,
        topicId: "a",
        kp: 0,
        seed: 1,
        response: String(index),
        skipped: false,
        correct: true,
        at: new Date(at),
      });
    await answer(id, learnerId, 0, t0);
    await answer(id, learnerId, 1, t0 + 1000);
    await answer(other.id, other.learnerId, 0, t0);
    await updateSession(db, id, {}, "completed", new Date(t0 + 2000));
    const event = { type: "lesson", at: t0 + 2000, topic: "a", passed: true, asked: 2, correct: 2 } as const;
    await appendEvent(db, { learnerId, subjectId: "test", seq: 1, event, xp: 12, state: initialState, courseId: "c1", sessionId: id });

    const all = await loadPilotData(db, "c1");
    expect(all.answers.map((a) => a.response)).toEqual(["0", "1"]);
    expect(all.sessions).toEqual([{ learnerId, kind: "lesson", status: "completed" }]);
    expect(all.lessons).toEqual([{ learnerId, topicId: "a", passed: true }]);

    const later = await loadPilotData(db, "c1", new Date(t0 + 500));
    expect(later.answers.map((a) => a.response)).toEqual(["1"]);
    expect(later.sessions).toEqual([]);
  });
});
