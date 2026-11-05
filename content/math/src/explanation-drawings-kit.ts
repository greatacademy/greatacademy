// Helpers for the drawings placed in explanations: each drawing shows the
// explanation's own names and worked numbers, so words and picture read together.

import type { Figure } from "@ga/content";
import { t } from "@ga/content";
import { type Compass, type Mark, type PlaneMark, type PlaneView, type Point, plane, sketch } from "@ga/subject-math";

/** Style is the role a mark plays: what the text is about, what acts on it, or what comes out. */
export type Style = "accent" | "action" | "result";

/** styled turns a style into the fields of a mark. */
export const styled = (s?: Style): { readonly accent?: boolean; readonly tone?: "action" | "result" } =>
  s === "accent" ? { accent: true } : s ? { tone: s } : {};

/** drawing makes a figure from the marks of a sketch. */
export const drawing = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** graphed makes a figure from marks in the coordinate plane. */
export const graphed = (view: PlaneView, marks: readonly PlaneMark[], en: string, zh: string): Figure => ({
  svg: plane(view, marks),
  alt: t(en, zh),
});

/** seg is a segment from a to b. */
export const seg = (a: Point, b: Point, s?: Style, dashed = false): Mark => ({
  kind: "segment",
  a,
  b,
  ...styled(s),
  ...(dashed && { dashed }),
});

/** name labels a point in italics, as a named point is written. */
export const name = (at: Point, text: string, dir: Compass): Mark => ({ kind: "label", at, text, dir, italic: true });

/** note labels a place with a number or an expression. */
export const note = (at: Point, text: string, dir: Compass): Mark => ({ kind: "label", at, text, dir });

/** dotAt is a dot, with a name when one is given. */
export const dotAt = (at: Point, text?: string, dir: Compass = "n", s?: "action" | "result"): Mark[] => [
  { kind: "dot", at, ...(s && { tone: s }) },
  ...(text ? [name(at, text, dir)] : []),
];

/** angle marks the angle at vertex between the rays to from and to, with an optional label. */
export const angle = (vertex: Point, from: Point, to: Point, s?: Style, label?: string): Mark => ({
  kind: "arc",
  vertex,
  from,
  to,
  ...styled(s),
  ...(label && { label }),
});

/** square marks a right angle at vertex. */
export const square = (vertex: Point, from: Point, to: Point): Mark => ({ kind: "right", vertex, from, to });

/** on is the point at the given angle in degrees and distance from a center. */
export const on = (degrees: number, r = 1, c: Point = [0, 0]): Point => [
  c[0] + r * Math.cos((degrees * Math.PI) / 180),
  c[1] + r * Math.sin((degrees * Math.PI) / 180),
];

/** ring is a circle of radius r about c. */
export const ring = (r = 1, c: Point = [0, 0], s?: Style): Mark => ({
  kind: "polygon",
  points: Array.from({ length: 96 }, (_, i) => on(i * 3.75, r, c)),
  ...styled(s),
});

/** bend is an arc from degrees a counterclockwise to degrees b, in short segments. */
export const bend = (a: number, b: number, r = 1, c: Point = [0, 0], s: Style = "accent"): Mark[] => {
  const span = (((b - a) % 360) + 360) % 360 || 360;
  const n = Math.max(2, Math.ceil(span / 4));
  return Array.from({ length: n }, (_, i) => seg(on(a + (span * i) / n, r, c), on(a + (span * (i + 1)) / n, r, c), s));
};

/** wedge is the region of a sector, for shading. */
export const wedge = (a: number, b: number, r = 1, c: Point = [0, 0], tone?: "action" | "result"): Mark => {
  const span = (((b - a) % 360) + 360) % 360 || 360;
  const n = Math.max(2, Math.ceil(span / 4));
  return {
    kind: "shade",
    points: [c, ...Array.from({ length: n + 1 }, (_, i) => on(a + (span * i) / n, r, c))],
    ...(tone && { tone }),
  };
};

/** Triangle is the three corners of a triangle, counterclockwise. */
export type Triangle = readonly [Point, Point, Point];

/** fromSides places a triangle with sides ab, bc and ca, with a at the origin and b to its right. */
export function fromSides(ab: number, bc: number, ca: number): Triangle {
  const x = (ab * ab + ca * ca - bc * bc) / (2 * ab);
  return [
    [0, 0],
    [ab, 0],
    [x, Math.sqrt(Math.max(0, ca * ca - x * x))],
  ];
}

/** fromAngles places a triangle with the given angles at a and b, with side ab of the given length. */
export function fromAngles(a: number, b: number, ab = 4): Triangle {
  const k = ab / Math.sin(((a + b) * Math.PI) / 180);
  return [[0, 0], [ab, 0], on(a, k * Math.sin((b * Math.PI) / 180))];
}

/** PairOptions say what a pair of corresponding triangles shows; sides count from 0: ab, bc, ca, and corners from 0: a, b, c. */
export interface PairOptions {
  readonly shape?: Triangle;
  /** k is the scale of the second triangle. */
  readonly k?: number;
  readonly names?: readonly [string, string, string, string, string, string];
  /** ticks marks congruent sides: each entry is a side and how many strokes. */
  readonly ticks?: readonly (readonly [number, number])[];
  /** corners marks corresponding angles, with a style and labels on the first and the second triangle. */
  readonly corners?: readonly (readonly [number, Style, string?, string?])[];
  /** lengths writes side lengths on the first and the second triangle. */
  readonly lengths?: readonly (readonly [number, string?, string?])[];
  /** rightAt marks a right angle at one corner of both. */
  readonly rightAt?: number;
  /** outsideTop writes the labels of corner c beside it, outside the triangle, where small triangles have no room inside. */
  readonly outsideTop?: boolean;
}

/** awayDir is the compass direction from the middle of a triangle toward one of its corners. */
function awayDir(tri: Triangle, i: number): Compass {
  const [x, y] = tri[i]!;
  const dx = x - (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
  const dy = y - (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
  const size = Math.max(...tri.map((p) => Math.hypot(p[0] - tri[0][0], p[1] - tri[0][1])));
  const ew = Math.abs(dx) > size * 0.12 ? (dx > 0 ? "e" : "w") : "";
  const ns = Math.abs(dy) > size * 0.12 ? (dy > 0 ? "n" : "s") : "";
  return (ns + ew || "n") as Compass;
}

/** clockwise says whether a triangle's corners run clockwise. */
function clockwise(tri: Triangle): boolean {
  const [a, b, c] = tri;
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) < 0;
}

/** pair draws two triangles with corresponding parts marked: the second is a copy of the first, scaled by k. */
export function pair(o: PairOptions, en: string, zh: string): Figure {
  const base = o.shape ?? fromAngles(62, 48);
  const k = o.k ?? 1;
  const width = Math.max(...base.map((p) => p[0]));
  const least = Math.min(...base.map((p) => p[0]));
  const gap = (width - least) * 0.45 + 0.6;
  const shifted = base.map((p): Point => [width + gap + (p[0] - least) * k, p[1] * k]) as unknown as Triangle;
  const names = o.names ?? ["A", "B", "C", "D", "E", "F"];
  const marks: Mark[] = [];
  const one = (tri: Triangle, offset: number) => {
    marks.push({ kind: "polygon", points: tri });
    tri.forEach((p, i) => {
      marks.push(name(p, names[offset + i]!, awayDir(tri, i)));
    });
    for (const [side, count] of o.ticks ?? []) marks.push({ kind: "ticks", a: tri[side]!, b: tri[(side + 1) % 3]!, count });
    for (const [i, style, first, second] of o.corners ?? []) {
      const label = offset === 0 ? first : second;
      const beside = o.outsideTop === true && i === 2;
      marks.push(angle(tri[i]!, tri[(i + 1) % 3]!, tri[(i + 2) % 3]!, style, beside ? undefined : label));
      if (beside && label) marks.push(note([tri[i]![0] + 0.25, tri[i]![1]], label, "e"));
    }
    for (const [side, first, second] of o.lengths ?? []) {
      const text = offset === 0 ? first : second;
      const [from, to] = [tri[side]!, tri[(side + 1) % 3]!];
      if (text) marks.push({ kind: "side", a: clockwise(tri) ? to : from, b: clockwise(tri) ? from : to, text });
    }
    if (o.rightAt !== undefined) marks.push(square(tri[o.rightAt]!, tri[(o.rightAt + 1) % 3]!, tri[(o.rightAt + 2) % 3]!));
  };
  one(base, 0);
  one(shifted, 3);
  return drawing(marks, en, zh);
}

/** RightOptions say what a right triangle shows: the right angle is at c, with leg a along the bottom and leg b up the side. */
export interface RightOptions {
  readonly legs: readonly [number, number];
  readonly a?: string;
  readonly b?: string;
  readonly c?: string;
  /** names are the corners: at the end of the bottom leg, at the right angle, at the top of the upright leg. */
  readonly names?: readonly [string, string, string];
  /** at marks the angle at the end of the bottom leg, and top the angle at the top of the upright leg. */
  readonly at?: string;
  readonly top?: string;
}

/** rightTriangle draws a right triangle with its legs, hypotenuse and acute angles labeled as asked. */
export function rightTriangle(o: RightOptions, en: string, zh: string): Figure {
  const [w, h] = o.legs;
  const [P, R, Q]: Triangle = [
    [-w, 0],
    [0, 0],
    [0, h],
  ];
  const marks: Mark[] = [{ kind: "polygon", points: [P, R, Q] }, square(R, P, Q)];
  if (o.a) marks.push({ kind: "side", a: P, b: R, text: o.a });
  if (o.b) marks.push({ kind: "side", a: R, b: Q, text: o.b });
  if (o.c) marks.push({ kind: "side", a: Q, b: P, text: o.c });
  if (o.at) marks.push(angle(P, R, Q, "accent", o.at));
  if (o.top) marks.push(angle(Q, P, R, "action", o.top));
  if (o.names) {
    marks.push(name(P, o.names[0], "sw"), name(R, o.names[1], "se"), name(Q, o.names[2], "n"));
  }
  return drawing(marks, en, zh);
}

/** Cut is a triangle a, b, c with a point d on ab and a point e on ac at the same fraction from a. */
export interface Cut {
  readonly a: Point;
  readonly b: Point;
  readonly c: Point;
  readonly d: Point;
  readonly e: Point;
}

/** cutTriangle places the triangle of a segment de parallel to bc, at fraction r of the way from a. */
export function cutTriangle(r: number, s = 1): Cut {
  const [a, b, c]: Triangle = [
    [2.2 * s, 3.4 * s],
    [0, 0],
    [6 * s, 0],
  ];
  return { a, b, c, d: [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r], e: [a[0] + (c[0] - a[0]) * r, a[1] + (c[1] - a[1]) * r] };
}

/** cutMarks draws a cut triangle with its corners named. */
export function cutMarks(k: Cut, parallel = true): Mark[] {
  return [
    { kind: "polygon", points: [k.a, k.b, k.c] },
    seg(k.d, k.e, "accent"),
    name(k.a, "A", "n"),
    name(k.b, "B", "sw"),
    name(k.c, "C", "se"),
    name(k.d, "D", "w"),
    name(k.e, "E", "e"),
    ...(parallel
      ? ([
          { kind: "arrows", a: k.d, b: k.e, count: 1 },
          { kind: "arrows", a: k.b, b: k.c, count: 1 },
        ] satisfies Mark[])
      : []),
  ];
}

/** Q and P are the crossings of a transversal with the lines of a transversal drawing. */
const upper: Point = [4, 3];
const lower: Point = [2, 0];

/** cornerRays gives, for angles 1 to 4 at a crossing, the two rays: upper left, upper right, lower left, lower right. */
const cornerRays = (v: Point, n: number): readonly [Point, Point] => {
  const [left, right, up, down]: Point[] = [
    [v[0] - 2, v[1]],
    [v[0] + 2, v[1]],
    [v[0] + 1, v[1] + 1.5],
    [v[0] - 1, v[1] - 1.5],
  ] as Point[];
  return [
    [left!, up!],
    [up!, right!],
    [left!, down!],
    [down!, right!],
  ][(n - 1) % 4] as unknown as readonly [Point, Point];
};

/** TransversalOptions say which angles of a transversal drawing to show: angles 1 to 4 sit on line ℓ and 5 to 8 on line m, upper left, upper right, lower left, lower right. */
export interface TransversalOptions {
  readonly extra?: readonly Mark[];
  /** angles lists angles by number, with a style and a label; the number itself is the label unless one is given. */
  readonly angles: readonly (readonly [number, Style?, string?])[];
  /** marked shows the arrows that say ℓ and m are parallel. */
  readonly marked?: boolean;
}

/** transversal draws two lines ℓ and m cut by a transversal t, with the angles asked for. */
export function transversal(o: TransversalOptions, en: string, zh: string): Figure {
  const marks: Mark[] = [
    seg([0, 3], [7, 3]),
    seg([0, 0], [7, 0]),
    seg([0.8, -1.8], [5.2, 4.8]),
    note([7, 3], "ℓ", "e"),
    note([7, 0], "m", "e"),
    note([5.2, 4.8], "t", "ne"),
  ];
  marks.push(...(o.extra ?? []));
  if (o.marked !== false)
    marks.push({ kind: "arrows", a: [0.6, 3], b: [1.6, 3], count: 1 }, { kind: "arrows", a: [0.6, 0], b: [1.6, 0], count: 1 });
  for (const [n, style, label] of o.angles) {
    const v = n <= 4 ? upper : lower;
    const [a, b] = cornerRays(v, n);
    marks.push(angle(v, a, b, style, label === "" ? undefined : (label ?? String(n))));
  }
  return drawing(marks, en, zh);
}

/** allEight lists all angles of a transversal drawing, with styles for some of them. */
export const allEight = (styles: Readonly<Record<number, Style>>): readonly (readonly [number, Style?])[] =>
  [1, 2, 3, 4, 5, 6, 7, 8].map((n) => (styles[n] ? [n, styles[n]] : [n]));

/** boxMarks draws a rectangular solid seen from above, with its hidden edges dashed, and returns the marks with its corners: front left, front right, back right, top versions. */
export function boxMarks(l: number, w: number, h: number): { marks: Mark[]; corners: Record<string, Point> } {
  const dx = w * 0.45;
  const dy = w * 0.35;
  const c: Record<string, Point> = {
    A: [0, 0],
    B: [l, 0],
    C: [l + dx, dy],
    D: [dx, dy],
    E: [0, h],
    F: [l, h],
    G: [l + dx, h + dy],
    H: [dx, h + dy],
  };
  const solid: readonly (readonly [string, string])[] = [
    ["A", "B"],
    ["B", "C"],
    ["A", "E"],
    ["B", "F"],
    ["C", "G"],
    ["E", "F"],
    ["F", "G"],
    ["G", "H"],
    ["H", "E"],
  ];
  const hidden: readonly (readonly [string, string])[] = [
    ["A", "D"],
    ["D", "C"],
    ["D", "H"],
  ];
  return {
    corners: c,
    marks: [...solid.map(([p, q]) => seg(c[p]!, c[q]!)), ...hidden.map(([p, q]) => seg(c[p]!, c[q]!, undefined, true))],
  };
}

/** ellipse is the marks of an ellipse about c with half axes rx and ry, its back half dashed when asked. */
export function ellipse(c: Point, rx: number, ry: number, backDashed = false, s?: Style): Mark[] {
  const at = (d: number): Point => [c[0] + rx * Math.cos((d * Math.PI) / 180), c[1] + ry * Math.sin((d * Math.PI) / 180)];
  return Array.from({ length: 48 }, (_, i) => seg(at(i * 7.5), at((i + 1) * 7.5), s, backDashed && i < 24));
}

/** cylinderMarks draws a cylinder standing on its base, with labels for the radius and the height. */
export function cylinderMarks(r: number, h: number, radius?: string, height?: string): Mark[] {
  const ry = r * 0.3;
  return [
    ...ellipse([0, h], r, ry),
    ...ellipse([0, 0], r, ry, true),
    seg([-r, 0], [-r, h]),
    seg([r, 0], [r, h]),
    seg([0, 0], [r, 0], "accent"),
    ...(radius ? [note([r / 2, 0], radius, "s")] : []),
    ...(height ? [note([r, h / 2], height, "e")] : []),
  ];
}

/** coneMarks draws a cone standing on its base, with labels for the radius, height and slant height. */
export function coneMarks(r: number, h: number, radius?: string, height?: string, slant?: string): Mark[] {
  const ry = r * 0.3;
  return [
    ...ellipse([0, 0], r, ry, true),
    seg([-r, 0], [0, h]),
    seg([r, 0], [0, h], slant ? "result" : undefined),
    seg([0, 0], [0, h], "action", true),
    seg([0, 0], [r, 0], "accent"),
    square([0, 0], [r, 0], [0, h]),
    ...(radius ? [note([r / 2, 0], radius, "s")] : []),
    ...(height ? [note([0, h / 2], height, "w")] : []),
    ...(slant ? [note([r / 2, h / 2], slant, "ne")] : []),
  ];
}

/** pyramidMarks draws a pyramid on a square base, with labels for the base edge, height and slant height. */
export function pyramidMarks(s: number, h: number, edge?: string, height?: string, slant?: string): Mark[] {
  const dx = s * 0.45;
  const dy = s * 0.35;
  const [A, B, C, D]: Point[] = [
    [0, 0],
    [s, 0],
    [s + dx, dy],
    [dx, dy],
  ] as Point[];
  const O: Point = [(s + dx) / 2, dy / 2];
  const T: Point = [O[0], O[1] + h];
  const M: Point = [s / 2, 0];
  return [
    seg(A!, B!),
    seg(B!, C!),
    seg(A!, D!, undefined, true),
    seg(D!, C!, undefined, true),
    seg(T, A!),
    seg(T, B!),
    seg(T, C!),
    seg(T, D!, undefined, true),
    ...(height ? [seg(O, T, "action", true), square(O, M, T), note([O[0], O[1] + h / 2], height, "e")] : []),
    ...(slant ? [seg(M, T, "result"), note([(M[0] + T[0]) / 2, (M[1] + T[1]) / 2], slant, "w")] : []),
    ...(edge ? [note(M, edge, "s")] : []),
  ];
}
