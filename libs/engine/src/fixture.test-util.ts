import { compileSubject, same, type TopicDef, t } from "@ga/content";

import { courseScope, engineGraph } from "./graph.ts";
import { defaultParams } from "./params.ts";
import type { Planner } from "./tasks.ts";

function topic(id: string, prerequisites: string[], encompasses: [string, number][] = [], kps = 2): TopicDef {
  return {
    id,
    title: t(id, id),
    summary: t(id, id),
    prerequisites,
    encompasses: encompasses.map(([topic, weight]) => ({ topic, weight })),
    xp: 12,
    knowledgePoints: Array.from({ length: kps }, (_, i) => ({
      id: `kp${i}`,
      title: same("k"),
      explanation: same("e"),
      generate: () => ({
        prompt: same("p"),
        answer: { checker: "text", expected: ["1"], input: { kind: "text" } },
        solution: same("s"),
        canonical: "1",
      }),
    })),
  };
}

/**
 * The fixture is a chain a → b → c → d → e → f → g, where each topic fully
 * encompasses its predecessor except that b encompasses a with weight 0.5 and e
 * encompasses d with weight 0.4. The graph starts at z and has
 * a side topic s that requires a. All but z make up the course, and z is
 * its mastery floor.
 */
export const subject = compileSubject({
  id: "test",
  title: same("Test"),
  topics: [
    topic("z", []),
    topic("a", ["z"]),
    topic("b", ["a"], [["a", 0.5]]),
    topic("c", ["b"], [["b", 1]]),
    topic("d", ["c"], [["c", 1]]),
    topic("e", ["d"], [["d", 0.4]]),
    topic("f", ["e"], [["e", 1]]),
    topic("g", ["f"], [["f", 1]]),
    topic("s", ["a"]),
  ],
  courses: [
    {
      id: "course",
      title: same("Course"),
      description: same("Course"),
      masteryFloor: ["z"],
      units: [{ title: same("U"), modules: [{ title: same("M"), topics: ["a", "b", "c", "d", "e", "f", "g", "s"] }] }],
    },
  ],
  checkers: [],
});

export const graph = engineGraph(subject.graph);
export const planner: Planner = { params: defaultParams, graph, scope: courseScope(graph, subject.courses.get("course")!) };
export const ctx = { params: defaultParams, graph };
