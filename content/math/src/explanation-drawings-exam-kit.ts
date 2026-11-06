// Helpers for the drawings of the SAT and ACT explanations: labeled triangles, rectangles, circles, angles at crossings, bars, box plots and number lines.

import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { go } from "./explanation-drawings-algebra-kit.ts";
import { angle, ellipse, note, on, ring, type Style, seg, square, type Triangle, wedge } from "./explanation-drawings-kit.ts";

/** Tone is the color role of a mark that is not the subject of a drawing. */
export type Tone = "action" | "result";

/** TriOptions say what a triangle shows: its corners, sides ab, bc, ca and angles at a, b, c, each with an optional style. */
export interface TriOptions {
  readonly names?: readonly (string | undefined)[];
  readonly sides?: readonly (string | undefined)[];
  readonly angles?: readonly (string | undefined)[];
  readonly angleStyles?: readonly (Style | undefined)[];
  readonly sideStyles?: readonly (Style | undefined)[];
  /** right marks a right angle at a corner by its index. */
  readonly right?: number;
  /** ticks marks equal sides: each entry is a side and how many strokes. */
  readonly ticks?: readonly (readonly [number, number])[];
}

/** nameDir points a corner's name away from the middle of the triangle. */
function nameDir(t: Triangle, i: number): "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" {
  const [x, y] = t[i] as Point;
  const dx = x - (t[0][0] + t[1][0] + t[2][0]) / 3;
  const dy = y - (t[0][1] + t[1][1] + t[2][1]) / 3;
  const size = Math.hypot(dx, dy) || 1;
  const ns = dy / size > 0.38 ? "n" : dy / size < -0.38 ? "s" : "";
  const ew = dx / size > 0.38 ? "e" : dx / size < -0.38 ? "w" : "";
  return (ns + ew || "n") as "n";
}

/** tri draws a counterclockwise triangle with the labels asked for; side labels fall outside it. */
export function tri(t: Triangle, o: TriOptions = {}): Mark[] {
  const marks: Mark[] = [{ kind: "polygon", points: t }];
  t.forEach((p, i) => {
    const q = t[(i + 1) % 3] as Point;
    const r = t[(i + 2) % 3] as Point;
    const style = o.sideStyles?.[i];
    if (style) marks.push(seg(p, q, style));
    const side = o.sides?.[i];
    if (side) marks.push({ kind: "side", a: p, b: q, text: side });
    if (o.right === i) marks.push(square(p, q, r));
    const label = o.angles?.[i];
    const angleStyle = o.angleStyles?.[i];
    if (label || angleStyle) marks.push(angle(p, q, r, angleStyle, label));
    const name = o.names?.[i];
    if (name) marks.push({ kind: "label", at: p, text: name, dir: nameDir(t, i), italic: true });
  });
  for (const [side, count] of o.ticks ?? []) marks.push({ kind: "ticks", a: t[side] as Point, b: t[(side + 1) % 3] as Point, count });
  return marks;
}

/** rt draws a right triangle with legs w along the bottom and h up the right, the right angle at the corner of index 1. */
export const rt = (w: number, h: number, o: TriOptions = {}): Mark[] =>
  tri(
    [
      [0, 0],
      [w, 0],
      [w, h],
    ],
    { right: 1, ...o },
  );

/** moved is a triangle moved by an offset and scaled about the origin. */
export const moved = (t: Triangle, dx: number, k = 1, dy = 0): Triangle =>
  t.map((p) => [dx + p[0] * k, dy + p[1] * k]) as unknown as Triangle;

/** SideLabels name the bottom, right, top and left of a rectangle. */
export interface SideLabels {
  readonly bottom?: string;
  readonly right?: string;
  readonly top?: string;
  readonly left?: string;
}

/** corners lists the corners of a rectangle counterclockwise from its lower left. */
export const corners = (x: number, y: number, w: number, h: number): Point[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

/** fill shades a region. */
export const fill = (points: readonly Point[], tone?: Tone): Mark => ({ kind: "shade", points, ...(tone && { tone }) });

/** box draws a rectangle with side labels and, when asked, a tone for its outline or its inside. */
export function box(
  x: number,
  y: number,
  w: number,
  h: number,
  o: SideLabels & { line?: Style; shade?: Tone; inside?: string } = {},
): Mark[] {
  const c = corners(x, y, w, h);
  const [a, b, d, e] = c as [Point, Point, Point, Point];
  const marks: Mark[] = [];
  if (o.shade) marks.push(fill(c, o.shade));
  marks.push({ kind: "polygon", points: c, ...(o.line === "accent" ? { accent: true } : o.line ? { tone: o.line } : {}) });
  if (o.bottom) marks.push({ kind: "side", a, b, text: o.bottom });
  if (o.right) marks.push({ kind: "side", a: b, b: d, text: o.right });
  if (o.top) marks.push({ kind: "side", a: d, b: e, text: o.top });
  if (o.left) marks.push({ kind: "side", a: e, b: a, text: o.left });
  if (o.inside) marks.push(note([x + w / 2, y + h / 2 - 0.02 * h], o.inside, "n"));
  return marks;
}

/** crossing draws two lines through a point, the second at deg from the first, with labels on the four angles counterclockwise from the one at deg. */
export function crossing(deg: number, labels: readonly (string | undefined)[], styles: readonly (Style | undefined)[] = [], r = 3): Mark[] {
  const rays: Point[] = [on(0, r), on(deg, r), on(180, r), on(180 + deg, r)];
  const marks: Mark[] = [seg(rays[0] as Point, rays[2] as Point), seg(rays[1] as Point, rays[3] as Point)];
  for (let i = 0; i < 4; i++) {
    const label = labels[i];
    const style = styles[i];
    if (label || style) marks.push(angle([0, 0], rays[i] as Point, rays[(i + 1) % 4] as Point, style, label));
  }
  return marks;
}

/** CutAngle is one of the eight angles of a transversal drawing, with its style and its label: 1 to 4 on the upper line and 5 to 8 on the lower, upper left, upper right, lower left, lower right. */
export type CutAngle = readonly [number, Style?, string?];

/** parallelCut draws two parallel lines cut by a transversal that makes the acute angle deg with them, and the angles asked for. */
export function parallelCut(deg: number, angles: readonly CutAngle[], gap = 2.6, half = 3.2): Mark[] {
  const reach = gap * 0.6;
  const dir = on(deg, 1);
  const k = reach / dir[1];
  const run = (gap / dir[1]) * dir[0];
  const low: Point = [0, 0];
  const up: Point = [run, gap];
  const marks: Mark[] = [
    seg([-half, gap], [run + half, gap]),
    seg([-half, 0], [run + half, 0]),
    seg([low[0] - dir[0] * k, -reach], [up[0] + dir[0] * k, gap + reach]),
    { kind: "arrows", a: [-half, gap], b: [-half + 2, gap], count: 1 },
    { kind: "arrows", a: [-half, 0], b: [-half + 2, 0], count: 1 },
  ];
  for (const [n, style, label] of angles) {
    const v = n <= 4 ? up : low;
    const left: Point = [v[0] - 1, v[1]];
    const right: Point = [v[0] + 1, v[1]];
    const upRay: Point = [v[0] + dir[0], v[1] + dir[1]];
    const downRay: Point = [v[0] - dir[0], v[1] - dir[1]];
    const pair = [
      [left, upRay],
      [upRay, right],
      [left, downRay],
      [downRay, right],
    ][(n - 1) % 4] as [Point, Point];
    marks.push(angle(v, pair[0], pair[1], style, label));
  }
  return marks;
}

/** NumberLine is the marks of a number line and the place of a value on it. */
export interface NumberLine {
  readonly marks: Mark[];
  readonly at: (v: number) => Point;
}

/** numberLine draws a number line from lo to hi with a tick at every whole step and a number at every labeled one. */
export function numberLine(lo: number, hi: number, every = 1, y = 0): NumberLine {
  const at = (v: number): Point => [v - lo, y];
  const marks: Mark[] = [seg([-0.4, y], [hi - lo + 0.4, y])];
  for (let v = lo; v <= hi; v++) {
    marks.push(seg([v - lo, y - 0.12], [v - lo, y + 0.12]));
    if ((v - lo) % every === 0) marks.push(note([v - lo, y - 0.1], String(v).replace("-", "−"), "s"));
  }
  return { marks, at };
}

/** hop is an arrow along a number line, lifted above it by lift, with a note over its middle. */
export function hop(l: NumberLine, from: number, to: number, lift: number, text?: string, s?: Tone): Mark[] {
  const a = l.at(from);
  const b = l.at(to);
  return [...go([a[0], a[1] + lift], [b[0], b[1] + lift], s), ...(text ? [note([(a[0] + b[0]) / 2, a[1] + lift], text, "n")] : [])];
}

/** BarOptions say how bars are drawn: the top of the scale, the distance between numbers, the bars to color, the names under them and the numbers over them. */
export interface BarOptions {
  readonly top: number;
  readonly step: number;
  readonly hi?: readonly number[];
  readonly names?: readonly string[];
  readonly over?: boolean;
  /** grid draws a dashed line across at every number of the scale. */
  readonly grid?: boolean;
  /** level draws a dashed line across at a height, with a note. */
  readonly level?: readonly [number, string];
  readonly tone?: Tone;
}

/** bars draws a bar graph of the values to scale. */
export function bars(values: readonly number[], o: BarOptions): Mark[] {
  const h = 4 / o.top;
  const w = values.length * 1.3 + 0.3;
  const marks: Mark[] = [seg([0, 0], [w, 0]), seg([0, 0], [0, o.top * h])];
  for (let v = o.step; v <= o.top + 1e-9; v += o.step) {
    marks.push(seg([-0.07, v * h], [0.07, v * h]), note([0, v * h], String(v), "w"));
    if (o.grid) marks.push(seg([0, v * h], [w, v * h], undefined, true));
  }
  values.forEach((v, i) => {
    const x = 0.3 + i * 1.3;
    const c = corners(x, 0, 1, v * h);
    const tone = o.tone ?? "result";
    if (o.hi?.includes(i)) marks.push(fill(c, tone));
    marks.push({ kind: "polygon", points: c });
    const label = o.names?.[i];
    if (label) marks.push(note([x + 0.5, 0], label, "s"));
    if (o.over) marks.push(note([x + 0.5, v * h], String(v), "n"));
  });
  if (o.level) {
    marks.push(seg([0, o.level[0] * h], [w, o.level[0] * h], "action", true), note([w, o.level[0] * h], o.level[1], "e"));
  }
  return marks;
}

/** whisker draws a box plot of a five-number summary over a number line, with parts colored as asked. */
export function whisker(
  five: readonly [number, number, number, number, number],
  lo: number,
  hi: number,
  step: number,
  o: { median?: Tone; box?: Tone; show?: boolean } = {},
): Mark[] {
  const k = 7 / (hi - lo);
  const x = (v: number): number => (v - lo) * k;
  const [a, q1, m, q3, b] = five;
  const marks: Mark[] = [seg([0, 0], [7, 0])];
  for (let v = lo; v <= hi + 1e-9; v += step) marks.push(seg([x(v), -0.08], [x(v), 0.08]), note([x(v), -0.05], String(v), "s"));
  if (o.box) marks.push(fill(corners(x(q1), 0.5, x(q3) - x(q1), 1.2), o.box));
  marks.push(
    seg([x(a), 1.1], [x(q1), 1.1]),
    seg([x(q3), 1.1], [x(b), 1.1]),
    seg([x(a), 0.8], [x(a), 1.4]),
    seg([x(b), 0.8], [x(b), 1.4]),
    { kind: "polygon", points: corners(x(q1), 0.5, x(q3) - x(q1), 1.2) },
    seg([x(m), 0.5], [x(m), 1.7], o.median),
  );
  return marks;
}

/** pie draws a circle cut into sectors by percent, counterclockwise from the top, with the sector asked for shaded and a label in each. */
export function pie(percents: readonly number[], hi: number, labels: readonly string[], r = 2.4): Mark[] {
  const marks: Mark[] = [];
  let a = 90;
  percents.forEach((p, i) => {
    const b = a + (p / 100) * 360;
    if (i === hi) marks.push(wedge(a, b, r, [0, 0], "result"));
    marks.push(seg([0, 0], on(a, r)));
    const label = labels[i];
    if (label) marks.push({ kind: "label", at: on((a + b) / 2, r * 0.48), text: label, dir: "n" });
    a = b;
  });
  marks.push(ring(r));
  return marks;
}

/** cornersFromAngles places a closed polygon with the given interior angles, in order, walking counterclockwise from the origin along the given side lengths; the last two sides are solved so that it closes. */
export function cornersFromAngles(interior: readonly number[], lengths: readonly number[]): Point[] {
  const n = interior.length;
  const headings: number[] = [0];
  for (let i = 1; i < n; i++) headings.push((headings[i - 1] as number) + 180 - (interior[i] as number));
  const pts: Point[] = [[0, 0]];
  for (let i = 0; i < n - 2; i++) {
    const p = pts[i] as Point;
    const d = on(headings[i] as number, lengths[i] as number);
    pts.push([p[0] + d[0], p[1] + d[1]]);
  }
  const last = pts[n - 2] as Point;
  const u = on(headings[n - 2] as number, 1);
  const w = on(headings[n - 1] as number, 1);
  const det = u[0] * w[1] - u[1] * w[0];
  const s = (-last[0] * w[1] + last[1] * w[0]) / det;
  pts.push([last[0] + u[0] * s, last[1] + u[1] * s]);
  return pts;
}

/** dash is a dashed segment of the plane. */
export const dash = (a: Point, b: Point, tone?: Tone): PlaneMark => ({ kind: "segment", a, b, dashed: true, ...(tone && { tone }) });

/** solid is a segment of the plane. */
export const solid = (a: Point, b: Point, tone?: Tone): PlaneMark => ({ kind: "segment", a, b, ...(tone && { tone }) });

/** cornerMark is the small square of a right angle in the plane, at a point between two directions. */
export const cornerMark = (at: Point, u: Point, v: Point, size = 0.45): PlaneMark => {
  const nu = Math.hypot(u[0], u[1]);
  const nv = Math.hypot(v[0], v[1]);
  const p: Point = [at[0] + (u[0] / nu) * size, at[1] + (u[1] / nu) * size];
  const q: Point = [at[0] + (v[0] / nv) * size, at[1] + (v[1] / nv) * size];
  return { kind: "path", points: [p, [p[0] + q[0] - at[0], p[1] + q[1] - at[1]], q] };
};

/** vee is the graph of y = |x − h| + k across the given inputs, with a sharp corner. */
export const vee = (h: number, k: number, from: number, to: number, tone?: Tone, dashed = false): PlaneMark => ({
  kind: "path",
  points: [
    [from, Math.abs(from - h) + k],
    [h, k],
    [to, Math.abs(to - h) + k],
  ],
  ...(tone && { tone }),
  ...(dashed && { dashed }),
});

/** holed shades the inside of a closed outline that starts and ends on the positive x-axis, leaving out a circle of radius r about the origin. */
export function holed(outline: readonly Point[], r: number, tone?: Tone): Mark {
  const circle = Array.from({ length: 73 }, (_, i) => on(-i * 5, r));
  return fill([...outline, ...circle], tone);
}

/** ball draws a sphere with its equator and a labeled radius. */
export const ball = (r: number, text?: string): Mark[] => [
  ring(r),
  ...ellipse([0, 0], r, r * 0.28, true),
  seg([0, 0], [r, 0], "accent"),
  { kind: "dot", at: [0, 0] },
  ...(text ? [note([r / 2, 0], text, "n")] : []),
];
