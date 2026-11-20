import { describe, expect, it } from "vitest";

import { layoutRoadmap, prerequisitesOf, ROADMAP_SIZE, type RoadmapCourse } from "./roadmap.ts";

const course = (id: string, ...buildsOn: string[]): RoadmapCourse => ({ id, buildsOn });
const row = (y: number) => Math.round(y / (ROADMAP_SIZE.boxHeight + ROADMAP_SIZE.rowGap));

describe("layoutRoadmap", () => {
  it("puts a course above what it builds on, the first courses at the bottom", () => {
    const map = layoutRoadmap([course("a"), course("b", "a"), course("c", "b")]);
    const y = new Map(map.boxes.map((b) => [b.id, b.y]));
    expect(row(y.get("c") ?? -1)).toBe(0);
    expect(row(y.get("b") ?? -1)).toBe(1);
    expect(row(y.get("a") ?? -1)).toBe(2);
    expect(map.height).toBe(2 * (ROADMAP_SIZE.boxHeight + ROADMAP_SIZE.rowGap) + ROADMAP_SIZE.boxHeight);
    expect(map.edges.map((e) => `${e.from}>${e.to}`)).toEqual(["a>b", "b>c"]);
  });

  it("pulls a course up next to the course that follows it", () => {
    // f1 > f2 > late sits beside the long chain a > b > c > late rather than at the bottom.
    const map = layoutRoadmap([
      course("a"),
      course("b", "a"),
      course("c", "b"),
      course("f1"),
      course("f2", "f1"),
      course("late", "c", "f2"),
    ]);
    const y = new Map(map.boxes.map((b) => [b.id, b.y]));
    expect(y.get("f2")).toBe(y.get("c"));
    expect(y.get("f1")).toBe(y.get("b"));
  });

  it("keeps boxes of a row apart and inside the width", () => {
    const map = layoutRoadmap([course("a"), course("b"), course("c"), course("d", "a", "b", "c")]);
    const bottom = map.boxes.filter((b) => b.id !== "d").sort((p, q) => p.x - q.x);
    for (let i = 1; i < bottom.length; i++) {
      expect((bottom[i]?.x ?? 0) - (bottom[i - 1]?.x ?? 0)).toBeGreaterThanOrEqual(ROADMAP_SIZE.boxWidth + ROADMAP_SIZE.gap);
    }
    for (const b of map.boxes) {
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + ROADMAP_SIZE.boxWidth).toBeLessThanOrEqual(map.width + 0.1);
    }
    // d sits centered over the three it builds on.
    const d = map.boxes.find((b) => b.id === "d");
    expect(d?.x).toBeCloseTo(bottom[1]?.x ?? 0, 0);
  });

  it("routes a line that skips rows through a point in each row between", () => {
    const map = layoutRoadmap([course("a"), course("b", "a"), course("c", "b"), course("x"), course("y", "x"), course("d", "c", "x")]);
    const long = map.edges.find((e) => e.from === "x" && e.to === "d");
    expect(long?.path.match(/C/g)).toHaveLength(3);
  });

  it("orders rows to avoid crossings and leaves out courses it does not know", () => {
    const map = layoutRoadmap([course("a"), course("b"), course("a2", "a", "gone"), course("b2", "b")]);
    const x = new Map(map.boxes.map((b) => [b.id, b.x]));
    expect(Math.sign((x.get("a") ?? 0) - (x.get("b") ?? 0))).toBe(Math.sign((x.get("a2") ?? 0) - (x.get("b2") ?? 0)));
    expect(map.edges).toHaveLength(2);
  });

  it("joins a course to one it reaches through another only through that one", () => {
    const map = layoutRoadmap([course("a"), course("b", "a"), course("c", "b", "a")]);
    expect(map.edges.map((e) => `${e.from}>${e.to}`)).toEqual(["a>b", "b>c"]);
  });

  it("gives the same roadmap for the same courses", () => {
    const list = [course("a"), course("b", "a"), course("c", "a"), course("d", "b", "c"), course("e")];
    expect(layoutRoadmap(list)).toEqual(layoutRoadmap(list));
  });
});

describe("prerequisitesOf", () => {
  it("lists a course and all it builds on", () => {
    const list = [course("a"), course("b", "a"), course("c", "b"), course("x")];
    expect([...prerequisitesOf(list, "c")].sort()).toEqual(["a", "b", "c"]);
  });
});
