import { createRng } from "@ga/content";
import { describe, expect, it } from "vitest";

import { answerDiagnostic, finishDiagnostic, nextDiagnosticTopic, startDiagnostic } from "./diagnostic.ts";
import { applyEvent, type EngineEvent, replay } from "./events.ts";
import { applyRepetition, credited, earlyFactor } from "./fire.ts";
import { ctx, graph, planner } from "./fixture.test-util.ts";
import { answerLesson, type LessonProgress, lessonSpeed, startLesson } from "./lesson.ts";
import { DAY, defaultParams as p } from "./params.ts";
import { reviewPlan, reviewResult } from "./review.ts";
import { dueAt, initialState, isDue, type LearnerState, memory, newTopicState } from "./state.ts";
import { compressReviews, diagnosticCandidates, diagnosticDue, dueTopics, frontier, nextTasks, quizDue, quizPlan } from "./tasks.ts";

const T0 = Date.UTC(2026, 0, 1);

function learnedState(topics: string[], at = T0, repNum = 0): LearnerState {
  return {
    ...initialState,
    diagnosed: ["course"],
    topics: Object.fromEntries(topics.map((t) => [t, newTopicState(at, repNum, 1, false)])),
  };
}

describe("graph closures", () => {
  it("multiplies weights along paths and keeps the largest", () => {
    expect(graph.encompassed.get("g")).toEqual(
      new Map([
        ["f", 1],
        ["e", 1],
        ["d", 0.4],
        ["c", 0.4],
        ["b", 0.4],
        ["a", 0.2],
      ]),
    );
    expect(graph.encompassers.get("a")!.get("c")).toBe(0.5);
    expect([...graph.descendants.get("e")!].sort()).toEqual(["f", "g"]);
  });
});

describe("memory", () => {
  const s = newTopicState(T0, 0, 1, false);
  it("halves every interval and is due at the halfway point", () => {
    expect(memory(p, s, T0)).toBe(1);
    expect(memory(p, s, T0 + DAY)).toBeCloseTo(0.5);
    expect(isDue(p, s, T0 + DAY - 1)).toBe(false);
    expect(isDue(p, s, T0 + DAY)).toBe(true);
    expect(dueAt(p, { ...s, repNum: 2 })).toBe(T0 + 6.25 * DAY);
  });
  it("grows the interval geometrically with repetitions", () => {
    expect(memory(p, { ...s, repNum: 1 }, T0 + 2.5 * DAY)).toBeCloseTo(0.5);
  });
});

describe("FIRe credit", () => {
  it("discounts early repetitions", () => {
    expect(earlyFactor(p, 1)).toBe(0);
    expect(earlyFactor(p, 0.75)).toBe(0.5);
    expect(earlyFactor(p, 0.5)).toBe(1);
    expect(earlyFactor(p, 0.1)).toBe(1);
  });
  it("gives a full repetition when due, scaled by speed", () => {
    const s = newTopicState(T0, 0, 1.2, false);
    const after = credited(p, s, 1, T0 + DAY);
    expect(after.repNum).toBeCloseTo(1.2);
    expect(after.last).toBe(T0 + DAY);
    expect(credited(p, s, 1, T0).repNum).toBe(0);
  });
  it("moves memory partway for a partial credit", () => {
    const after = credited(p, newTopicState(T0, 0, 1, false), 0.5, T0 + 2 * DAY);
    expect(after.repNum).toBeCloseTo(0.5);
    expect(after.last).toBe(T0 + DAY);
  });
  it("credits encompassed topics in proportion to their weights", () => {
    const state = learnedState(["a", "b", "c", "d"]);
    const after = applyRepetition(p, graph, state, "d", 1, T0 + 10 * DAY);
    expect(after.topics.d!.repNum).toBeCloseTo(1);
    expect(after.topics.c!.repNum).toBeCloseTo(1);
    expect(after.topics.b!.repNum).toBeCloseTo(1);
    expect(after.topics.a!.repNum).toBeCloseTo(0.5);
  });
  it("gives no implicit credit to topics the learner is slow on", () => {
    const state = learnedState(["c", "d"]);
    const slow = { ...state, topics: { ...state.topics, c: { ...state.topics.c!, speed: 0.8 } } };
    expect(applyRepetition(p, graph, slow, "d", 1, T0 + 10 * DAY).topics.c!.repNum).toBe(0);
  });
  it("penalizes a failed topic and, scaled, the topics that encompass it", () => {
    const state = learnedState(["b", "c", "d", "e"], T0, 3);
    const after = applyRepetition(p, graph, state, "c", 0, T0 + DAY);
    expect(after.topics.c!.repNum).toBe(2);
    expect(after.topics.c!.last).toBe(T0 + DAY);
    expect(after.topics.d!.repNum).toBe(2.5);
    expect(after.topics.e!.repNum).toBeCloseTo(3 - 0.4 * 0.5);
    expect(after.topics.d!.last).toBe(T0);
    expect(after.topics.b!.repNum).toBe(3);
  });
});

describe("lessons", () => {
  const run = (answers: boolean[], kps = 2) => answers.reduce<LessonProgress>((l, a) => answerLesson(p, l, a), startLesson("t", kps));
  it("passes a knowledge point after two correct answers in a row", () => {
    expect(run([true, true]).kp).toBe(1);
    expect(run([true, false, true, true]).kp).toBe(1);
    expect(run([true, true, true, true]).outcome).toBe("passed");
  });
  it("fails as soon as a knowledge point cannot be passed within five questions", () => {
    expect(run([false, false, false]).outcome).toBeUndefined();
    expect(run([false, false, false, true, true]).kp).toBe(1);
    expect(run([false, true, false, false]).outcome).toBe("failed");
  });
  it("estimates speed from the questions needed", () => {
    expect(lessonSpeed(p, 2, 4)).toBe(1.5);
    expect(lessonSpeed(p, 2, 8)).toBe(1);
  });
});

describe("reviews", () => {
  it("asks every knowledge point, the last ones most", () => {
    expect(reviewPlan(p, 2, createRng(1)).sort()).toEqual([0, 1, 1]);
    expect(reviewPlan(p, 5, createRng(1)).sort()).toEqual([2, 3, 4]);
    expect(reviewPlan(p, 1, createRng(1))).toEqual([0, 0, 0]);
  });
  it("passes with two of three", () => {
    expect(reviewResult(p, 1, 3)).toBe(0);
    expect(reviewResult(p, 2, 3)).toBeCloseTo(2 / 3);
    expect(reviewResult(p, 3, 3)).toBe(1);
  });
});

describe("diagnostic", () => {
  const candidates = ["a", "b", "c", "d", "e", "f", "g", "s"];
  const place = (knows: Set<string>) => {
    let d = startDiagnostic(candidates);
    for (let t = nextDiagnosticTopic(graph, d); t; t = nextDiagnosticTopic(graph, d)) d = answerDiagnostic(graph, d, t, knows.has(t));
    return { d, placement: finishDiagnostic(d) };
  };
  it("places a learner with few questions by searching the chain", () => {
    const { d, placement } = place(new Set(["a", "b", "c", "d"]));
    expect(placement.known).toEqual(["a", "b", "c", "d"]);
    expect(d.asked.length).toBeLessThanOrEqual(5);
  });
  it("places a beginner and an expert", () => {
    expect(place(new Set()).placement.known).toEqual([]);
    expect(place(new Set(candidates)).placement.known).toEqual(candidates);
  });
  it("records which known topics were tested directly", () => {
    const { d, placement } = place(new Set(["a", "b"]));
    const correct = d.asked.filter((x) => x.correct).map((x) => x.topic);
    expect(placement.tested).toEqual(placement.known.filter((t) => correct.includes(t)));
  });
});

describe("events", () => {
  it("places known topics and marks the course diagnosed", () => {
    const s = applyEvent(ctx, initialState, { type: "placed", at: T0, course: "course", known: ["a", "b"], tested: ["b"] });
    expect(s.diagnosed).toEqual(["course"]);
    expect(s.topics.a).toMatchObject({ learned: true, placed: true, repNum: 1 });
    expect(s.topics.b!.repNum).toBe(1.5);
  });
  it("learns a topic on a passed lesson and credits what it encompasses", () => {
    const s0 = learnedState(["a", "b"]);
    const s = applyEvent(ctx, s0, { type: "lesson", at: T0 + 5 * DAY, topic: "c", passed: true, asked: 4, correct: 4 });
    expect(s.topics.c).toMatchObject({ learned: true, repNum: 0, speed: 1.5, last: T0 + 5 * DAY });
    expect(s.topics.b!.repNum).toBeCloseTo(1);
    expect(s.xp).toBe(12);
  });
  it("blocks a failed lesson until its key prerequisites are reviewed", () => {
    const s0 = learnedState(["a", "b"]);
    const failed = applyEvent(ctx, s0, { type: "lesson", at: T0 + DAY, topic: "c", passed: false, asked: 4, correct: 1 });
    expect(failed.topics.c!.learned).toBe(false);
    expect(failed.xp).toBe(0);
    expect(frontier(planner, failed)).toEqual(["s"]);
    const reviewed = applyEvent(ctx, failed, { type: "review", at: T0 + 2 * DAY, topic: "b", correct: 3, total: 3 });
    expect(frontier(planner, reviewed)).toEqual(["c", "s"]);
  });
  it("updates speed and counts reviews", () => {
    const s = applyEvent(ctx, learnedState(["a"]), { type: "review", at: T0 + DAY, topic: "a", correct: 1, total: 3 });
    expect(s.topics.a!.explicitReviews).toBe(1);
    expect(s.topics.a!.speed).toBeCloseTo(0.8 + 0.2 * (0.5 + 1 / 3));
    expect(s.topics.a!.repNum).toBe(0);
    expect(s.xp).toBe(0);
  });
  it("replays to the same state", () => {
    const events: EngineEvent[] = [
      { type: "placed", at: T0, course: "course", known: ["a"], tested: ["a"] },
      { type: "lesson", at: T0 + DAY, topic: "b", passed: true, asked: 6, correct: 5 },
      { type: "review", at: T0 + 3 * DAY, topic: "a", correct: 2, total: 3 },
      {
        type: "quiz",
        at: T0 + 4 * DAY,
        results: [
          { topic: "a", correct: true },
          { topic: "b", correct: false },
        ],
      },
    ];
    let s = initialState;
    for (const e of events) s = applyEvent(ctx, s, e);
    expect(replay(ctx, events, initialState)).toEqual(s);
    expect(s.quizzes).toBe(1);
    expect(s.xpAtLastQuiz).toBe(s.xp);
  });
});

describe("tasks", () => {
  it("starts with the diagnostic", () => {
    expect(nextTasks(planner, initialState, T0)).toEqual([{ kind: "diagnostic" }]);
  });
  it("offers each course's diagnostic once, over the topics not yet known", () => {
    const other = { ...learnedState(["a", "b"]), diagnosed: ["other-course"] };
    expect(nextTasks(planner, other, T0)).toEqual([{ kind: "diagnostic" }]);
    expect(diagnosticCandidates(planner, other)).toEqual(planner.scope.topics.filter((t) => t !== "a" && t !== "b"));
    const all = { ...learnedState(planner.scope.topics.filter((t) => !planner.scope.assumed.has(t))), diagnosed: [] };
    expect(diagnosticDue(planner, all)).toBe(false);
  });
  it("offers the frontier, treating the mastery floor as known", () => {
    const s = { ...initialState, diagnosed: ["course"] };
    expect(frontier(planner, s)).toEqual(["a"]);
    expect(frontier(planner, learnedState(["a"]))).toEqual(["b", "s"]);
  });
  it("compresses due reviews into one review of an encompassing topic", () => {
    const s = learnedState(["a", "b", "c", "d"]);
    const now = T0 + 3 * DAY;
    const due = dueTopics(planner, s, now);
    expect(new Set(due)).toEqual(new Set(["a", "b", "c", "d"]));
    const reviews = compressReviews(planner, s, due, new Set());
    // Through d, a is encompassed with weight 1 · 1 · 0.5, enough to count as covered.
    expect(reviews).toEqual([{ kind: "review", topic: "d", covers: ["d", "c", "b", "a"] }]);
    const lowered = { ...planner, params: { ...planner.params, minCoverWeight: 0.6 } };
    expect(compressReviews(lowered, s, due, new Set()).map((r) => r.kind === "review" && r.topic)).toEqual(["d", "a"]);
  });
  it("lets lessons repair the due topics they encompass", () => {
    const s = learnedState(["a", "b", "c"]);
    const tasks = nextTasks(planner, s, T0 + 3 * DAY);
    expect(tasks).toEqual([
      { kind: "lesson", topic: "d" },
      { kind: "lesson", topic: "s" },
    ]);
  });
  it("keeps a share of lessons when many reviews are due", () => {
    const s = learnedState(["a", "b", "c", "d", "e", "f"]);
    const tasks = nextTasks(planner, s, T0 + 30 * DAY, 4);
    expect(tasks.filter((t) => t.kind === "lesson").length).toBeGreaterThanOrEqual(1);
    expect(tasks.length).toBeLessThanOrEqual(4);
  });
  it("puts a lesson first after four reviews in a row", () => {
    const s = learnedState(["a", "b", "c", "d", "e", "f"]);
    const now = T0 + 30 * DAY;
    expect(nextTasks(planner, s, now)[0]?.kind).toBe("review");
    let after = s;
    for (let i = 0; i < 4; i++) after = applyEvent(ctx, after, { type: "review", at: now, topic: "a", correct: 1, total: 3 });
    expect(after.reviewsSinceLesson).toBe(4);
    expect(nextTasks(planner, after, now)[0]?.kind).toBe("lesson");
    const lesson = applyEvent(ctx, after, { type: "lesson", at: now, topic: "g", passed: false, asked: 5, correct: 1 });
    expect(lesson.reviewsSinceLesson).toBe(0);
  });
  it("offers a quiz every 150 XP once enough topics are learned", () => {
    const s = learnedState(["a", "b", "c", "d"]);
    expect(quizDue(planner, { ...s, xp: 149 })).toBe(false);
    expect(quizDue(planner, { ...s, xp: 150 })).toBe(true);
    expect(nextTasks(planner, { ...s, xp: 150 }, T0)[0]).toEqual({ kind: "quiz" });
  });
  it("quizzes recent topics first", () => {
    const s = learnedState(["a", "b", "c", "d", "e"]);
    const topics = { ...s.topics, e: { ...s.topics.e!, learnedAt: T0 + DAY } };
    const plan = quizPlan(planner, { ...s, topics }, createRng(3));
    expect(plan).toHaveLength(5);
    expect(plan).toContain("e");
  });
});
