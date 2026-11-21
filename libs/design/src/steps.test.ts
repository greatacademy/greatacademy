import { describe, expect, it } from "vitest";

import { type StepsInput, sameTarget, sessionSteps, stepTargets } from "./steps.ts";

const lesson = (over: Partial<StepsInput> = {}): StepsInput => ({
  kind: "lesson",
  index: 0,
  total: 0,
  lesson: { knowledgePoint: 0, knowledgePoints: 2, streak: 0, needed: 2, practice: false, pass: 2 },
  intros: [{ knowledgePoint: 0, example: true }],
  stage: "intro",
  answered: [],
  current: { parts: 1, earlier: [] },
  ...over,
});

const marks = (input: StepsInput) => sessionSteps(input).map((g) => g.steps.map((s) => `${s.kind[0]}:${s.marks.join("+")}`));

describe("sessionSteps", () => {
  it("lays out a lesson by knowledge point, the explanation first", () => {
    expect(marks(lesson())).toEqual([
      ["i:current", "e:future", "q:future", "q:future"],
      ["i:future", "e:future", "q:future", "q:future"],
    ]);
    expect(stepTargets(sessionSteps(lesson()))).toEqual([{ kind: "intro", knowledgePoint: 0 }]);
  });

  it("marks the answers given, and adds a question after a wrong one only once asked", () => {
    const input = lesson({
      index: 2,
      stage: "question",
      lesson: { knowledgePoint: 0, knowledgePoints: 2, streak: 1, needed: 2, practice: false, pass: 2 },
      answered: [
        { index: 0, knowledgePoint: 0, parts: [false] },
        { index: 1, knowledgePoint: 0, parts: [true] },
      ],
      current: { parts: 1, earlier: [], verdict: false },
    });
    expect(marks(input)[0]).toEqual(["i:done", "e:done", "q:wrong", "q:right", "q:wrong"]);
    expect(stepTargets(sessionSteps(input))).toEqual([
      { kind: "intro", knowledgePoint: 0 },
      { kind: "example", knowledgePoint: 0 },
      { kind: "answered", index: 0 },
      { kind: "answered", index: 1 },
      { kind: "current" },
    ]);
  });

  it("splits a multistep problem into its parts", () => {
    const input = lesson({ stage: "question", current: { parts: 3, earlier: [true] } });
    expect(marks(input)[0]?.[2]).toBe("q:right+current+future");
  });

  it("leaves out explanations in a lesson that starts with practice", () => {
    const input = lesson({
      stage: "question",
      intros: [],
      lesson: { knowledgePoint: 0, knowledgePoints: 2, streak: 0, needed: 2, practice: true, pass: 2 },
    });
    expect(marks(input)).toEqual([
      ["q:current", "q:future"],
      ["q:future", "q:future"],
    ]);
  });

  it("lays out a review's questions, those to come after the answered", () => {
    const input: StepsInput = {
      kind: "review",
      index: 1,
      total: 4,
      intros: [],
      stage: "question",
      answered: [{ index: 0, knowledgePoint: 1, parts: [true] }],
      current: { parts: 1, earlier: [] },
    };
    expect(marks(input)).toEqual([["q:right", "q:current", "q:future", "q:future"]]);
  });

  it("shows the diagnostic's questions before as gone through, with none to open", () => {
    const input: StepsInput = {
      kind: "diagnostic",
      index: 2,
      total: 4,
      intros: [],
      stage: "question",
      answered: [],
      current: { parts: 1, earlier: [] },
    };
    expect(marks(input)).toEqual([["q:done", "q:done", "q:current", "q:future"]]);
    expect(stepTargets(sessionSteps(input))).toEqual([{ kind: "current" }]);
  });

  it("lays out a quiz's questions, answered or not, any of them to open", () => {
    const input: StepsInput = {
      kind: "quiz",
      index: 1,
      total: 3,
      intros: [],
      stage: "question",
      answered: [],
      current: { parts: 1, earlier: [] },
      slots: [{ answered: true }, { answered: false }, { answered: false }],
    };
    expect(marks(input)).toEqual([["q:done", "q:current", "q:future"]]);
    expect(stepTargets(sessionSteps(input))).toHaveLength(3);
  });
});

describe("sameTarget", () => {
  it("matches targets by what they open", () => {
    expect(sameTarget({ kind: "answered", index: 1 }, { kind: "answered", index: 1 })).toBe(true);
    expect(sameTarget({ kind: "intro", knowledgePoint: 0 }, { kind: "example", knowledgePoint: 0 })).toBe(false);
    expect(sameTarget(undefined, { kind: "current" })).toBe(false);
  });
});
