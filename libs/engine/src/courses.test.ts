import { compileSubject, same, type TopicDef, t } from "@ga/content";
import { describe, expect, it } from "vitest";

import {
  courseFinished,
  courseIndex,
  courseRoute,
  coursesAfter,
  followingCourse,
  homeCourse,
  nextCourse,
  placementAdvice,
} from "./courses.ts";
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

/** Two routes from one start: low, a, a2 and low, b, b2, with c after both a2 and b2 and on no route. */
const branching = compileSubject({
  id: "branching",
  title: same("Branching"),
  topics: [
    ...chain("p", 2),
    ...chain("a", 2, "p2"),
    ...chain("b", 2, "p2"),
    ...chain("x", 2, "a2"),
    ...chain("y", 2, "b2"),
    ...chain("z", 1, "y2"),
  ],
  courses: [
    course("low", ids("p", 1, 2)),
    course("a", ids("a", 1, 2), ["low"]),
    course("b", ids("b", 1, 2), ["low"]),
    course("a2", ids("x", 1, 2), ["a"]),
    course("b2", ids("y", 1, 2), ["b"]),
    course("c", ["z1"], ["b2", "a2"]),
  ],
  sequences: [
    { id: "first", title: same("First"), courses: ["low", "a", "a2"] },
    { id: "second", title: same("Second"), courses: ["low", "b", "b2"] },
  ],
  mark: "B",
  hue: 100,
  checkers: [],
});
const routes = courseIndex(branching.courses, branching.def.sequences);
const route = (course: string, taken: string[], target?: string) => courseRoute(routes, course, taken, target)?.id;

describe("courseRoute", () => {
  it("follows the route that leads to the course set out for", () => {
    expect(route("low", [], "b2")).toBe("second");
    expect(route("low", [], "a")).toBe("first");
  });

  it("follows the route of the courses taken, else the first", () => {
    expect(route("low", [])).toBe("first");
    expect(route("b", ["low"])).toBe("second");
    expect(route("low", ["b", "b2"])).toBe("second");
  });

  it("ignores a target the route does not lead to", () => {
    expect(route("a", [], "b2")).toBe("first");
  });

  it("has no route for a course on none", () => {
    expect(route("c", ["a2"])).toBeUndefined();
  });
});

describe("followingCourse", () => {
  it("moves on along the route, then to what builds on its last course", () => {
    const second = routes.sequences[1];
    expect(followingCourse(routes, second, "low")).toBe("b");
    expect(followingCourse(routes, second, "b2")).toBe("c");
    expect(followingCourse(routes, undefined, "low")).toBe("a");
    expect(followingCourse(routes, second, "c")).toBeUndefined();
  });

  it("lists the courses after, leaving out those taken", () => {
    const second = routes.sequences[1];
    expect(coursesAfter(routes, second, "low", 3)).toEqual(["b", "b2", "c"]);
    expect(coursesAfter(routes, second, "low", 2)).toEqual(["b", "b2"]);
    expect(coursesAfter(routes, second, "low", 3, ["b2"])).toEqual(["b", "c"]);
  });

  it("leads back to the course set out for", () => {
    const first = routes.sequences[0];
    expect(nextCourse(routes, first, "low", "b2")).toBe("b2");
    expect(nextCourse(routes, routes.sequences[1], "low", "b2")).toBe("b");
    expect(nextCourse(routes, first, "a", "a2")).toBe("a2");
    expect(nextCourse(routes, first, "a2", "a2")).toBe("c");
    expect(coursesAfter(routes, first, "low", 3, [], "b2")).toEqual(["b2", "c"]);
  });

  it("recommends the course after on the route", () => {
    const pl: Planner = {
      params: defaultParams,
      graph: engineGraph(branching.graph),
      scope: courseScope(engineGraph(branching.graph), branching.courses.get("low")!),
    };
    const p = { known: ["p1", "p2"], tested: ["p2"], missed: [] };
    const s = applyEvent({ params: defaultParams, graph: pl.graph }, initialState, { type: "placed", at: 0, course: "low", ...p });
    expect(placementAdvice(pl, routes, s, p)).toEqual({ kind: "later", course: "a" });
    expect(placementAdvice(pl, routes, s, p, routes.sequences[1])).toEqual({ kind: "later", course: "b" });
  });
});
