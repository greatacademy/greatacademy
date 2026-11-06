// Helpers for the drawings of the remaining explanations: small marks shared by their tables, and the route that gives a shard's topics their drawings.

import type { Figure, TopicDef } from "@ga/content";
import type { Compass, Mark, PlaneMark, Point } from "@ga/subject-math";
import { go } from "./explanation-drawings-algebra-kit.ts";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { solid } from "./explanation-drawings-exam-kit.ts";
import { note, on, seg } from "./explanation-drawings-kit.ts";

/** Tone says how a mark is highlighted. */
export type Tone = "action" | "result";

/** withDrawings gives each knowledge point of the topics its drawing from the table, leaving a figure it already has. */
export function withDrawings(topics: readonly TopicDef[], table: Readonly<Record<string, Figure>>): readonly TopicDef[] {
  return topics.map((topic) => ({
    ...topic,
    knowledgePoints: topic.knowledgePoints.map((kp) => {
      const figure = table[`${topic.id}#${kp.id}`];
      return figure && !kp.figure ? { ...kp, figure } : kp;
    }),
  }));
}

/** circleOn draws a circle on a coordinate plane. */
export const circleOn = (center: Point, r: number, tone?: Tone, dashed = false): PlaneMark => ({
  kind: "circle",
  center,
  r,
  ...(tone && { tone }),
  ...(dashed && { dashed }),
});

/** dot marks a point of a drawing. */
export const dot = (at: Point, tone?: Tone): Mark => ({ kind: "dot", at, ...(tone && { tone }) });

/** outline draws the closed outline through the points of a drawing. */
export const outline = (points: readonly Point[], style?: Tone, dashed = false): Mark[] =>
  points.map((p, i) => seg(p, points[(i + 1) % points.length] as Point, style, dashed));

/** outlineOn draws the closed outline through the points of a coordinate plane. */
export const outlineOn = (points: readonly Point[], tone?: Tone): PlaneMark[] =>
  points.map((p, i) => solid(p, points[(i + 1) % points.length] as Point, tone));

/** regular lists the corners of a regular polygon around the origin, starting at the angle from. */
export const regular = (n: number, r: number, from = 0): Point[] => Array.from({ length: n }, (_, i) => on(from + (360 * i) / n, r));

/** axes draws a pair of named axes reaching from the lows to the highs. */
export const axes = (xLo: number, xHi: number, yLo: number, yHi: number): Mark[] => [
  seg([xLo, 0], [xHi, 0]),
  seg([0, yLo], [0, yHi]),
  note([xHi, 0], "x", "e"),
  note([0, yHi], "y", "n"),
];

/** arcTo draws an arc about the origin from one angle to another, with an arrow at its end. */
export function arcTo(from: number, to: number, r: number, s?: Tone): Mark[] {
  const n = Math.max(4, Math.ceil(Math.abs(to - from) / 6));
  const at = (i: number): Point => on(from + ((to - from) * i) / n, r);
  return [...Array.from({ length: n - 1 }, (_, i) => seg(at(i), at(i + 1), s)), ...go(at(n - 1), at(n), s)];
}

/** curveMarks draws the points of a curve as a chain of segments of a drawing. */
export const curveMarks = (points: readonly Point[], s?: Tone, dashed = false): Mark[] =>
  points.slice(1).map((p, i) => seg(points[i] as Point, p, s, dashed));

/** Solve is a graph of a trigonometric equation: the wave, its levels, the dashed lines the wave never crosses, and the solutions. */
export interface Solve {
  readonly fn: (x: number) => number;
  /** y is the scale of the height. */
  readonly y?: readonly [number, number, number];
  /** to is the end of the x scale, by default a full turn. */
  readonly to?: number;
  /** levels are the heights to solve for, with the tone of each line. */
  readonly levels?: readonly (readonly [number, Tone?])[];
  /** walls are the values of x at which the wave breaks. */
  readonly walls?: readonly number[];
  /** dots are the solutions, as x and the height there. */
  readonly dots?: readonly (readonly [number, number])[];
  /** says write numbers on the x-axis: the value and on which side of the axis. */
  readonly says?: readonly (readonly [number, Compass])[];
}

/** solveMarks draws a graph of a trigonometric equation in degrees, with the end of its scale marked. */
export function solveMarks({ fn, y = [-1, 1, 1], to = 360, levels = [], walls = [], dots = [], says = [] }: Solve): Mark[] {
  const p = pane(0, [0, to * 1.08, 99999], [y[0], y[1], y[2]], 6.5, 3.6, "x", "y");
  const edges = [0, ...walls, to];
  for (let i = 0; i + 1 < edges.length; i++)
    p.f(fn, (edges[i] as number) + (i === 0 ? 0 : 0.2), (edges[i + 1] as number) - (i + 2 === edges.length ? 0 : 0.2));
  for (const x of walls) p.wall(x);
  for (const [h, tone] of levels) p.level(h, tone);
  for (const [x, h] of dots) p.dot(x, h, "", "n", "result");
  for (const [x, dir] of says) p.say(x, 0, String(x), dir);
  if (!says.some(([x]) => to - x < to / 8)) p.say(to, 0, String(to), fn(to * 0.97) < 0 ? "n" : "s");
  return p.marks();
}

/** deg3 reads a point in space as a point of an oblique drawing: x across, y going back, z up. */
export const deg3 = (x: number, y: number, z: number): Point => [x + 0.45 * y, z + 0.35 * y];

/** box3 draws a parallelepiped drawn from one corner along three edges in an oblique view. */
export function box3(u: Point, v: Point, w: Point, s?: Tone): Mark[] {
  const add = (...ps: Point[]): Point => [ps.reduce((a, p) => a + p[0], 0), ps.reduce((a, p) => a + p[1], 0)];
  const o: Point = [0, 0];
  return [
    seg(o, u, s),
    seg(o, w, s),
    seg(u, add(u, v), s),
    seg(u, add(u, w), s),
    seg(w, add(w, u), s),
    seg(w, add(w, v), s),
    seg(add(u, v), add(u, v, w), s),
    seg(add(u, w), add(u, v, w), s),
    seg(add(w, v), add(u, v, w), s),
    seg(o, v, s, true),
    seg(v, add(v, u), s, true),
    seg(v, add(v, w), s, true),
  ];
}
