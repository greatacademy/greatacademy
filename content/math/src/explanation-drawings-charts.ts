// Helpers for explanation drawings of graphs with different units on the two axes,
// and for small panels that compare a few graphs side by side.

import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { text } from "./explanation-drawings-grades-2.ts";
import { type Style, seg } from "./explanation-drawings-kit.ts";

/** Scale is the lowest and highest value of an axis and the distance between its labeled ticks. */
export type Scale = readonly [lo: number, hi: number, step: number];

/** ChartOptions describe a chart: its two scales, the names of its axes and its size in drawing units. */
export interface ChartOptions {
  readonly x: Scale;
  readonly y: Scale;
  readonly xName: string;
  readonly yName: string;
  readonly w?: number;
  readonly h?: number;
}

/** Chart is the marks of a chart's axes and the place in the drawing of a point of its data. */
export interface Chart {
  readonly marks: Mark[];
  readonly at: (x: number, y: number) => Point;
}

const minus = (v: number): string => String(v).replace("-", "−");

/** chart draws axes with their own units, crossing at zero or at the low end of a scale. */
export function chart({ x, y, xName, yName, w = 7, h = 5 }: ChartOptions): Chart {
  const at = (a: number, b: number): Point => [((a - x[0]) / (x[1] - x[0])) * w, ((b - y[0]) / (y[1] - y[0])) * h];
  const x0 = x[0] <= 0 && x[1] >= 0 ? 0 : x[0];
  const y0 = y[0] <= 0 && y[1] >= 0 ? 0 : y[0];
  const marks: Mark[] = [seg(at(x[0], y0), at(x[1], y0)), seg(at(x0, y[0]), at(x0, y[1]))];
  for (let v = x[0]; v <= x[1] + 1e-9; v += x[2]) {
    const p = at(v, y0);
    if (v !== x0) marks.push(seg([p[0], p[1] - 0.08], [p[0], p[1] + 0.08]), text(p, minus(v), "s"));
  }
  for (let v = y[0]; v <= y[1] + 1e-9; v += y[2]) {
    const p = at(x0, v);
    if (v !== y0) marks.push(seg([p[0] - 0.08, p[1]], [p[0] + 0.08, p[1]]), text(p, minus(v), "w"));
  }
  marks.push(text(at(x[1], y0), xName, "e"), text(at(x0, y[1]), yName, "n"));
  return { marks, at };
}

/** chain joins points of a drawing with segments. */
export const chain = (points: readonly Point[], s?: Style, dashed = false): Mark[] =>
  points.slice(1).map((p, i) => seg(points[i] as Point, p, s, dashed));

/** traced is the graph of f between two values of x in a chart, in short segments, broken outside the low and high values given. */
export function traced(
  at: Chart["at"],
  f: (x: number) => number,
  from: number,
  to: number,
  lo: number,
  hi: number,
  s?: Style,
  dashed = false,
): Mark[] {
  const n = 48;
  const marks: Mark[] = [];
  for (let i = 0; i < n; i += 1) {
    const a = from + ((to - from) * i) / n;
    const b = from + ((to - from) * (i + 1)) / n;
    if (f(a) >= lo && f(a) <= hi && f(b) >= lo && f(b) <= hi) marks.push(seg(at(a, f(a)), at(b, f(b)), s, dashed));
  }
  return marks;
}

/** curveOf is the graph of f in the plane, between two values of x when they are given. */
export const curveOf = (f: (x: number) => number, tone?: "action" | "result", from?: number, to?: number, dashed = false): PlaneMark => ({
  kind: "curve",
  f,
  ...(tone && { tone }),
  ...(from !== undefined && { from }),
  ...(to !== undefined && { to }),
  ...(dashed && { dashed }),
});

/** openPt is a hollow point of the plane, one the graph does not include, with an optional label. */
export const openPt = (at: Point, label?: string, dir: "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" = "ne"): PlaneMark => ({
  kind: "point",
  at,
  open: true,
  ...(label && { label, dir }),
});

/** tag labels a place of the plane. */
export const tag = (at: Point, s: string, dir: "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" = "n"): PlaneMark => ({
  kind: "label",
  at,
  text: s,
  dir,
});

/** toward is the arrow of the plane from one point to another. */
export const toward = (from: Point, to: Point, tone?: "action" | "result"): PlaneMark => ({
  kind: "arrow",
  from,
  to,
  ...(tone && { tone }),
});
