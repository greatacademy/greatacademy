import { compileSubject, createRng, heardResponse, same, type TopicDef, t } from "@ga/content";
import { describe, expect, it } from "vitest";

import { courseScope, engineGraph } from "./graph.ts";
import { defaultParams } from "./params.ts";
import { initialState, newTopicState } from "./state.ts";
import { diagnosticCandidates, dueTopics, type Planner, quizPlan } from "./tasks.ts";

const T0 = Date.UTC(2026, 0, 1);

function topic(id: string, prerequisites: string[], spoken?: string): TopicDef {
  return {
    id,
    title: t(id, id),
    summary: t(id, id),
    prerequisites,
    encompasses: [],
    xp: 10,
    ...(spoken && { spoken }),
    knowledgePoints: [
      {
        id: "kp",
        title: same("k"),
        explanation: same("e"),
        generate: () =>
          spoken
            ? {
                prompt: same("Say it."),
                answer: {
                  checker: "speech",
                  expected: { mode: "read", reference: "hello" },
                  input: { kind: "speech", language: spoken, mode: "read", text: "hello", maxSeconds: 5 },
                },
                solution: same("s"),
                canonical: heardResponse({ text: "hello", confidence: 1, seconds: 1 }),
              }
            : {
                prompt: same("Type it."),
                answer: { checker: "text", expected: ["hello"], input: { kind: "text" } },
                solution: same("s"),
                canonical: "hello",
              },
      },
    ],
  };
}

// a → s (spoken); a learner reads and writes a, and says s.
const subject = compileSubject({
  id: "test",
  title: same("Test"),
  topics: [topic("a", []), topic("s", ["a"], "en-US")],
  courses: [
    {
      id: "course",
      title: same("Course"),
      description: same("Course"),
      masteryFloor: [],
      units: [{ title: same("U"), modules: [{ title: same("M"), topics: ["a", "s"] }] }],
    },
  ],
  mark: "T",
  hue: 200,
  checkers: [],
});
const graph = engineGraph(subject.graph);
const planner: Planner = { params: defaultParams, graph, scope: courseScope(graph, subject.courses.get("course")!) };

describe("spoken topics", () => {
  it("are left out of the diagnostic and of quizzes, but reviewed", () => {
    expect(diagnosticCandidates(planner, initialState)).toEqual(["a"]);
    const state = {
      ...initialState,
      diagnosed: ["course"],
      topics: { a: newTopicState(T0, 0, 1, false), s: newTopicState(T0, 0, 1, false) },
    };
    expect(quizPlan(planner, state, createRng(1))).toEqual(["a"]);
    expect(dueTopics(planner, state, T0 + 400 * 24 * 3600_000)).toContain("s");
  });

  it("cannot be a prerequisite of a topic that is not spoken", () => {
    expect(() =>
      compileSubject({
        id: "bad",
        title: same("Bad"),
        topics: [topic("s", [], "en-US"), topic("a", ["s"])],
        courses: [],
        mark: "B",
        hue: 0,
        checkers: [],
      }),
    ).toThrow(/is spoken/);
  });
});
