import { compileSubject, createRng, same, type TopicDef, t } from "@ga/content";
import { describe, expect, it } from "vitest";

import { applyEvent } from "./events.ts";
import { courseScope, engineGraph } from "./graph.ts";
import { answerLesson, startLesson } from "./lesson.ts";
import { DAY, defaultParams } from "./params.ts";
import { initialState, newTopicState } from "./state.ts";
import { compressReviews, diagnosticCandidates, dueTopics, frontier, type Planner, quizPlan } from "./tasks.ts";

const T0 = Date.UTC(2026, 0, 1);
const criterion = { id: "argues", version: "1", question: "Does the essay argue for its thesis?", quoteWhenMet: true };

function topic(id: string, prerequisites: string[], extra: Partial<TopicDef> = {}): TopicDef {
  return {
    id,
    title: t(id, id),
    summary: t(id, id),
    prerequisites,
    encompasses: [],
    xp: 12,
    criteria: [criterion],
    knowledgePoints: [
      {
        id: "kp",
        title: same("k"),
        explanation: same("e"),
        generate: () => ({
          prompt: same("Write."),
          answer: {
            checker: "writing",
            expected: { minWords: 3, maxChars: 600 },
            input: { kind: "writing", minWords: 3, maxChars: 600 },
            judged: { criteria: ["argues"] },
          },
          solution: same("s"),
          canonical: "One good essay.",
        }),
      },
    ],
    ...extra,
  };
}

// a → b, and the essay w builds on b and practices it.
const subject = compileSubject({
  id: "test",
  title: same("Test"),
  topics: [topic("a", []), topic("b", ["a"]), topic("w", ["b"], { essay: true, encompasses: [{ topic: "b", weight: 0.5 }] })],
  courses: [
    {
      id: "course",
      title: same("Course"),
      description: same("Course"),
      masteryFloor: [],
      units: [{ title: same("U"), modules: [{ title: same("M"), topics: ["a", "b", "w"] }] }],
    },
  ],
  mark: "T",
  hue: 200,
  checkers: [],
});
const graph = engineGraph(subject.graph);
const planner: Planner = { params: defaultParams, graph, scope: courseScope(graph, subject.courses.get("course")!) };
const ctx = { params: defaultParams, graph };
const learned = (topics: string[]) => ({
  ...initialState,
  diagnosed: ["course"],
  topics: Object.fromEntries(topics.map((id) => [id, newTopicState(T0, 0, 1, false)])),
});

describe("essays", () => {
  it("pass or fail their lesson on one text", () => {
    const lesson = startLesson("w", 1, true);
    expect(answerLesson(defaultParams, lesson, true).outcome).toBe("passed");
    expect(answerLesson(defaultParams, lesson, false).outcome).toBe("failed");
    expect(answerLesson(defaultParams, startLesson("b", 1), true).outcome).toBeUndefined();
  });

  it("are learned with a neutral speed and credit what they encompass", () => {
    const s = applyEvent(ctx, learned(["a", "b"]), { type: "lesson", at: T0 + 5 * DAY, topic: "w", passed: true, asked: 1, correct: 1 });
    expect(s.topics.w).toMatchObject({ learned: true, speed: 1 });
    expect(s.topics.b!.repNum).toBeGreaterThan(0);
  });

  it("are taught, but never reviewed, quizzed or asked by the diagnostic", () => {
    expect(frontier(planner, learned(["a", "b"]))).toEqual(["w"]);
    expect(diagnosticCandidates(planner, { ...initialState })).toEqual(["a", "b"]);
    const s = learned(["a", "b", "w"]);
    const later = T0 + 400 * DAY;
    const due = dueTopics(planner, s, later);
    expect(due).not.toContain("w");
    expect(compressReviews(planner, s, due, new Set()).map((r) => r.kind === "review" && r.topic)).not.toContain("w");
    expect(quizPlan(planner, s, createRng(1))).not.toContain("w");
  });
});
