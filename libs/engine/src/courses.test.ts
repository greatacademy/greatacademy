import { compileSubject, same, type TopicDef, t } from "@ga/content";
import { describe, expect, it } from "vitest";

import { courseFinished, courseIndex, homeCourse, placementAdvice } from "./courses.ts";
import type { Placement } from "./diagnostic.ts";
import { applyEvent } from "./events.ts";
import { courseScope, engineGraph } from "./graph.ts";
import { defaultParams } from "./params.ts";
import { initialState, type LearnerState } from "./state.ts";
import type { Planner } from "./tasks.ts";

function topic(id: string, prerequisites: string[]): TopicDef {
  return {
    id,
    title: t(id, id),
    summary: t(id, id),
    prerequisites,
    encompasses: [],
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
  };
}

/** chain makes topics `prefix`1 … `prefix`n, each requiring the one before, the first requiring `after`. */
function chain(prefix: string, n: number, after?: string): TopicDef[] {
  return Array.from({ length: n }, (_, i) => topic(`${prefix}${i + 1}`, i === 0 ? (after ? [after] : []) : [`${prefix}${i}`]));
}

const ids = (prefix: string, from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);

const course = (id: string, topics: string[], buildsOn?: string[]) => ({
  id,
  title: same(id),
  description: same(id),
  units: [{ title: same("U"), modules: [{ title: same("M"), topics }] }],
  ...(buildsOn && { buildsOn }),
});

/** Three courses in a row: low teaches p1–p10, mid q1–q10 after p10, top r1–r5 after q10. */
const subject = compileSubject({
  id: "test",
  title: same("Test"),
  topics: [...chain("p", 10), ...chain("q", 10, "p10"), ...chain("r", 5, "q10")],
  courses: [course("low", ids("p", 1, 10)), course("mid", ids("q", 1, 10), ["low"]), course("top", ids("r", 1, 5), ["mid"])],
  mark: "T",
  hue: 200,
  checkers: [],
});
const graph = engineGraph(subject.graph);
const ctx = { params: defaultParams, graph };
const index = courseIndex(subject.courses);
const planner = (id: string): Planner => ({ params: defaultParams, graph, scope: courseScope(graph, subject.courses.get(id)!) });

/** placed is the state after a course's diagnostic placed `known`, having missed `missed`. */
function placed(courseId: string, p: Placement): LearnerState {
  return applyEvent(ctx, initialState, { type: "placed", at: 0, course: courseId, ...p });
}

describe("courseIndex", () => {
  it("relates the courses through what they build on", () => {
    expect(index.earlier.get("top")).toEqual(["mid", "low"]);
    expect(index.next.get("low")).toEqual(["mid"]);
    expect(index.next.get("top")).toEqual([]);
  });

  it("names the course a foundation comes from", () => {
    expect(homeCourse(index, "top", "p3")).toBe("low");
    expect(homeCourse(index, "top", "q3")).toBe("mid");
    expect(homeCourse(index, "top", "r1")).toBeUndefined();
  });
});

describe("placementAdvice", () => {
  it("recommends nothing after a skipped diagnostic", () => {
    const p = { known: [], tested: [], missed: [] };
    expect(placementAdvice(planner("top"), index, placed("top", p), p)).toEqual({ kind: "stay" });
  });

  it("points to the lowest course with gaps the answers showed", () => {
    const p = { known: [], tested: [], missed: ["p4"] };
    expect(placementAdvice(planner("top"), index, placed("top", p), p)).toEqual({ kind: "earlier", course: "low" });
  });

  it("points to the course just before when the gaps start there", () => {
    const p = { known: [...ids("p", 1, 10), ...ids("q", 1, 5)], tested: ["p10", "q5"], missed: ["q6"] };
    expect(placementAdvice(planner("top"), index, placed("top", p), p)).toEqual({ kind: "earlier", course: "mid" });
  });

  it("keeps the course when the gaps are few", () => {
    const p = { known: [...ids("p", 1, 10), ...ids("q", 1, 8)], tested: ["q8"], missed: ["q9"] };
    expect(placementAdvice(planner("top"), index, placed("top", p), p)).toEqual({ kind: "stay" });
  });

  it("does not count what the diagnostic left unresolved as gaps", () => {
    const p = { known: ["r1"], tested: ["r1"], missed: [] };
    expect(placementAdvice(planner("top"), index, placed("top", p), p)).toEqual({ kind: "stay" });
  });

  it("points to the next course when most of the course is known", () => {
    const p = { known: [...ids("p", 1, 10), ...ids("q", 1, 9)], tested: ["q9"], missed: ["q10"] };
    expect(placementAdvice(planner("mid"), index, placed("mid", p), p)).toEqual({ kind: "later", course: "top" });
  });
});

describe("courseFinished", () => {
  it("tells when every topic of the course is learned", () => {
    const most = { known: ids("q", 1, 9), tested: [], missed: [] };
    expect(courseFinished(planner("mid"), placed("mid", most))).toBe(false);
    const all = { known: ids("q", 1, 10), tested: [], missed: [] };
    expect(courseFinished(planner("mid"), placed("mid", all))).toBe(true);
  });
});
