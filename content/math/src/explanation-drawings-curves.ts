// Helpers for drawings of curves, angles and vectors: windows of the plane with their own scale,
// charts with multiples of π on the x-axis, and angles in standard position.

import type { Mark, PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { type Chart, curveOf } from "./explanation-drawings-charts.ts";
import { ln } from "./explanation-drawings-geometry-2.ts";
import { side, text } from "./explanation-drawings-grades-2.ts";
import { arrows } from "./explanation-drawings-grades-3.ts";
import { angle, note, on, ring, type Style, seg, type Triangle } from "./explanation-drawings-kit.ts";

type Tone = "action" | "result";
type Fn = (x: number) => number;

/** wide is a window of the plane with any corners, a grid step and names for the axes. */
export const wide = (
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  labelEvery = 1,
  step = 1,
  xName?: string,
  yName?: string,
): PlaneView => ({
  xMin,
  xMax,
  yMin,
  yMax,
  step,
  labelEvery,
  ...(xName && { xName }),
  ...(yName && { yName }),
});

/** conic is the curve f(x, y) = 0 of the plane. */
export const conic = (f: (x: number, y: number) => number, dashed = false): PlaneMark => ({
  kind: "contour",
  f,
  level: 0,
  ...(dashed && { dashed }),
});

/** across is a dashed horizontal line of the plane. */
export const across = (y: number, tone?: Tone): PlaneMark => ln([0, y], [1, y], tone, true);

/** upright is a dashed vertical line of the plane. */
export const upright = (x: number, tone?: Tone): PlaneMark => ln([x, 0], [x, 1], tone, true);

/** bare is a point of the plane with no label. */
export const bare = (at: Point, tone?: Tone): PlaneMark => ({ kind: "point", at, ...(tone && { tone }) });

/** branches is y = f(x) on both sides of the vertical asymptote x = h. */
export const branches = (f: Fn, h: number, lo: number, hi: number, tone?: Tone, dashed = false): PlaneMark[] => [
  curveOf(f, tone, lo, h - 0.01, dashed),
  curveOf(f, tone, h + 0.01, hi, dashed),
];

/** trail is the curve of the plane through the points of a parameter from a to b. */
export const trail = (p: (t: number) => Point, a: number, b: number, tone?: Tone, dashed = false): PlaneMark => ({
  kind: "path",
  points: Array.from({ length: 121 }, (_, i) => p(a + ((b - a) * i) / 120)),
  ...(tone && { tone }),
  ...(dashed && { dashed }),
});

/** thick is a segment of the plane in a color, which marks an interval or a stretch of a curve. */
export const thick = (a: Point, b: Point, tone: Tone = "result"): PlaneMark => ({ kind: "segment", a, b, tone });

const piText = (n: number, d: number): string => {
  if (n === 0) return "0";
  const g = gcd(Math.abs(n), d);
  const [a, b] = [n / g, d / g];
  const top = Math.abs(a) === 1 ? "π" : `${Math.abs(a)}π`;
  return `${a < 0 ? "−" : ""}${top}${b === 1 ? "" : `/${b}`}`;
};
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** piChart draws axes whose x-axis counts in steps of π/d from lo to hi steps, each `every` steps labeled. */
export function piChart(lo: number, hi: number, d: number, y: readonly [number, number, number], w = 8, h = 4, every = 1): Chart {
  const [xa, xb] = [(lo * Math.PI) / d, (hi * Math.PI) / d];
  const at = (a: number, b: number): Point => [((a - xa) / (xb - xa)) * w, ((b - y[0]) / (y[1] - y[0])) * h];
  const y0 = y[0] <= 0 && y[1] >= 0 ? 0 : y[0];
  const x0 = xa <= 0 && xb >= 0 ? 0 : xa;
  const marks: Mark[] = [seg(at(xa, y0), at(xb, y0)), seg(at(x0, y[0]), at(x0, y[1]))];
  for (let n = lo; n <= hi; n += 1) {
    const p = at((n * Math.PI) / d, y0);
    if (n === 0 || Math.abs(n % every) !== 0) continue;
    marks.push(seg([p[0], p[1] - 0.07], [p[0], p[1] + 0.07]), text(p, piText(n, d), "s"));
  }
  for (let v = y[0]; v <= y[1] + 1e-9; v += y[2]) {
    const p = at(x0, v);
    if (Math.abs(v - y0) > 1e-9) marks.push(seg([p[0] - 0.07, p[1]], [p[0] + 0.07, p[1]]), text(p, String(v).replace("-", "−"), "w"));
  }
  marks.push(text(at(xb, y0), "x", "e"), text(at(x0, y[1]), "y", "n"));
  return { marks, at };
}

/** plot is y = f(x) in a chart, in short segments, left out where it runs beyond the low and high values; dashed leaves every other few out. */
export function plot(c: Chart, f: Fn, from: number, to: number, lo: number, hi: number, s?: Style, dashed = false): Mark[] {
  const n = 240;
  const marks: Mark[] = [];
  for (let i = 0; i < n; i += 1) {
    const a = from + ((to - from) * i) / n;
    const b = from + ((to - from) * (i + 1)) / n;
    const [fa, fb] = [f(a), f(b)];
    const gap = dashed && Math.floor(i / 4) % 2 === 1;
    if (!gap && fa >= lo && fa <= hi && fb >= lo && fb <= hi && Math.abs(fa - fb) < (hi - lo) / 2)
      marks.push(seg(c.at(a, fa), c.at(b, fb), s));
  }
  return marks;
}

/** wall is the dashed vertical line x = v in a chart. */
export const wall = (c: Chart, v: number, lo: number, hi: number, s?: Style): Mark => seg(c.at(v, lo), c.at(v, hi), s, true);

/** cross is a pair of axes through the origin, reaching r each way. */
export const cross = (r = 3.6, x = "x", y = "y"): Mark[] => [
  seg([-r, 0], [r, 0]),
  seg([0, -r], [0, r]),
  note([r, 0], x, "e"),
  note([0, r], y, "n"),
];

/** circleAxes is a circle of radius r about the origin with axes, its radius marked 1 where it meets them. */
export const circleAxes = (r = 3, marked = true): Mark[] => [
  ...cross(r + 0.6),
  ring(r),
  ...(marked ? [note([r, 0], "1", "se"), note([0, r], "1", "nw"), note([-r, 0], "−1", "sw"), note([0, -r], "−1", "sw")] : []),
];

/** sweep is the turn of an angle of any size and sign, from the positive x-axis, widening as it goes, with an arrow at its end. */
export function sweep(degrees: number, r = 0.8, s: Style = "action", widen = 0.35): Mark[] {
  const n = Math.max(4, Math.ceil(Math.abs(degrees) / 5));
  const at = (d: number): Point => on(d, r + (widen * Math.abs(d)) / 360);
  const marks: Mark[] = Array.from({ length: n }, (_, i) => seg(at((degrees * i) / n), at((degrees * (i + 1)) / n), s));
  marks.push(arrows(at((degrees * (n - 1)) / n), at(degrees), 1));
  return marks;
}

/** spoke is the side of an angle in standard position, reaching r from the origin. */
export const spoke = (degrees: number, r = 3, s?: Style): Mark => seg([0, 0], on(degrees, r), s);

/** standard is an angle in standard position: axes, the turn and the terminal side, in a window that reaches r each way. */
export const standard = (degrees: number, r = 3): Mark[] => [...cross(r + 0.3), spoke(degrees, r, "result"), ...sweep(degrees)];

/** Labels name the sides ab, bc, ca and the angles at a, b, c of a triangle; a missing one is left out. */
export interface TriangleLabels {
  readonly names?: readonly [string, string, string];
  readonly sides?: readonly [string?, string?, string?];
  readonly angles?: readonly [string?, string?, string?];
}

/** labeled is a triangle with its names, sides and angles. */
export function labeled(t: Triangle, { names, sides, angles }: TriangleLabels): Mark[] {
  const [a, b, c] = t;
  const cx = (a[0] + b[0] + c[0]) / 3;
  const cy = (a[1] + b[1] + c[1]) / 3;
  const dir = (p: Point): "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" => {
    const v = p[1] - cy > Math.abs(p[0] - cx) / 2 ? "n" : p[1] - cy < -Math.abs(p[0] - cx) / 2 ? "s" : "";
    const h = p[0] - cx > Math.abs(p[1] - cy) / 2 ? "e" : p[0] - cx < -Math.abs(p[1] - cy) / 2 ? "w" : "";
    return (v + h || "n") as "n";
  };
  const marks: Mark[] = [{ kind: "polygon", points: [a, b, c] }];
  const corners = [a, b, c] as const;
  corners.forEach((p, i) => {
    const q = corners[(i + 1) % 3] as Point;
    const r = corners[(i + 2) % 3] as Point;
    const nm = names?.[i];
    if (nm) marks.push(note(p, nm, dir(p)));
    const ang = angles?.[i];
    if (ang) marks.push(angle(p, q, r, "accent", ang));
    const sd = sides?.[i];
    if (sd) marks.push(side(p, q, sd));
  });
  return marks;
}
