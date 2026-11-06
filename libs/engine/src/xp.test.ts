import { describe, expect, it } from "vitest";

import { applyEvent, type EngineEvent } from "./events.ts";
import { ctx, graph } from "./fixture.test-util.ts";
import { defaultParams as p } from "./params.ts";
import { initialState, type LearnerState, newTopicState } from "./state.ts";
import { blowOffPenalty, eventXp, fullXp, isBlownOff, nextBlowOffs, reviewXp } from "./xp.ts";

const T0 = Date.UTC(2026, 0, 1);
const topic = [...graph.graph.topics.keys()][0]!;
const full = graph.graph.topics.get(topic)!.xp;
const lesson = (passed: boolean, asked: number, correct: number, blownOff = false): EngineEvent => ({
  type: "lesson",
  at: T0,
  topic,
  passed,
  asked,
  correct,
  ...(blownOff && { blownOff }),
});
const xpOf = (e: EngineEvent, s: LearnerState = initialState) => eventXp(ctx, s, e);

describe("the XP of a task", () => {
  it("adds a bonus to a perfect lesson", () => {
    expect(xpOf(lesson(true, 4, 4))).toBe(full + p.xpPerfectBonus);
  });

  it("is full for a nearly perfect lesson and a share of it for a passable one", () => {
    expect(xpOf(lesson(true, 5, 4))).toBe(full);
    expect(xpOf(lesson(true, 10, 6))).toBe(Math.round(full * 0.6));
  });

  it("is a little for a nearly passed lesson and nothing for a poor one", () => {
    expect(xpOf(lesson(false, 6, 3))).toBe(Math.max(1, Math.round(full * p.xpNearlyPassableShare)));
    expect(xpOf(lesson(false, 6, 2))).toBe(0);
  });

  it("rewards a perfect review or quiz and pays the others by their share correct", () => {
    const worth = reviewXp(full);
    const review = (correct: number): EngineEvent => ({ type: "review", at: T0, topic, correct, total: 3 });
    expect(xpOf(review(3))).toBe(worth + p.xpPerfectBonus);
    expect(xpOf(review(2))).toBe(Math.round((worth * 2) / 3));
    expect(xpOf(review(1))).toBe(0);
    const quiz = (flags: boolean[]): EngineEvent => ({ type: "quiz", at: T0, results: flags.map((correct) => ({ topic, correct })) });
    expect(xpOf(quiz([true, true]))).toBe(p.quizXp + p.xpPerfectBonus);
    expect(xpOf(quiz([true, false]))).toBe(Math.round(p.quizXp / 2));
  });

  it("reports what a task is worth, before any bonus", () => {
    expect(fullXp(ctx, lesson(false, 5, 0))).toBe(full);
    expect(fullXp(ctx, { type: "quiz", at: T0, results: [] })).toBe(p.quizXp);
    expect(fullXp(ctx, { type: "placed", at: T0, course: "c", known: [], tested: [] })).toBe(0);
  });
});

describe("blowing off a task", () => {
  const quick = { correct: false, elapsedMs: 1000 };
  const slow = { correct: false, elapsedMs: 60_000 };

  it("is seen in failed tasks with several rushed wrong answers", () => {
    expect(isBlownOff(p, false, [quick, quick])).toBe(true);
    expect(isBlownOff(p, false, [quick, quick, slow, slow])).toBe(true);
  });

  it("is not seen in slow failures, one slip, or passed tasks", () => {
    expect(isBlownOff(p, false, [slow, slow, slow])).toBe(false);
    expect(isBlownOff(p, false, [quick, slow])).toBe(false);
    expect(isBlownOff(p, false, [quick, quick, slow, slow, slow])).toBe(false);
    expect(isBlownOff(p, true, [quick, quick])).toBe(false);
    expect(isBlownOff(p, false, [{ correct: true, elapsedMs: 100 }, { correct: true, elapsedMs: 100 }, slow])).toBe(false);
  });

  it("costs nothing at first, then more as it continues, up to a cap", () => {
    expect([0, 2, 3, 5, 6, 9].map((n) => blowOffPenalty(p, n, 100))).toEqual([0, 0, 1, 1, 2, 3]);
    expect(blowOffPenalty(p, 300, 100)).toBe(p.blowOffMaxPenalty);
    expect(blowOffPenalty(p, 300, 4)).toBe(4);
  });

  it("earns nothing, even when enough answers were right for some XP", () => {
    expect(xpOf(lesson(false, 6, 3, true))).toBe(0);
  });

  it("never takes the total below zero", () => {
    const s: LearnerState = { ...initialState, xp: 2, blowOffs: 30 };
    expect(xpOf(lesson(false, 5, 0, true), s)).toBe(-2);
    expect(applyEvent(ctx, s, lesson(false, 5, 0, true)).xp).toBe(0);
  });

  it("is counted when it happens and forgiven slowly by passed tasks", () => {
    const after = applyEvent(ctx, { ...initialState, xp: 50 }, lesson(false, 5, 0, true));
    expect(after.blowOffs).toBe(1);
    const learned = { ...after, topics: { [topic]: newTopicState(T0, 0, 1, false) } };
    expect(nextBlowOffs(p, learned, lesson(true, 4, 4))).toBeCloseTo(0.8);
    expect(nextBlowOffs(p, learned, lesson(false, 5, 1))).toBe(1);
    expect(nextBlowOffs(p, initialState, lesson(true, 4, 4))).toBe(0);
  });
});
