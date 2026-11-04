import type { Figure, Text } from "@ga/content";
import { t } from "@ga/content";

import { curveFigure, dotsFigure, type PlotView, plotFrame } from "./exam.ts";

// Drawings for exam questions. Labels are math and numbers only, so that one drawing serves both locales. A figure shows
// what the question gives and marks what it asks with "?", the way the tests do; it never shows the answer.

/** Pt is a point in the units of a drawing, with y pointing up. */
export type Pt = readonly [number, number];

/** Label places text at a point, moved by pixels away from another point; a negative distance moves it toward that point. */
export interface Label {
  readonly at: Pt;
  readonly text: string;
  readonly from?: Pt;
  readonly by?: number;
}

/** Shape is a path of straight segments or a circle. */
export type Shape =
  | { readonly pts: readonly Pt[]; readonly closed?: boolean; readonly dash?: boolean; readonly shade?: boolean }
  | { readonly center: Pt; readonly r: number; readonly shade?: boolean };

/** Scene lists what sceneFigure draws: shapes, regions shaded between an outer outline and an inner circle, right-angle marks and labels. */
export interface Scene {
  readonly shapes: readonly Shape[];
  readonly rings?: readonly {
    readonly outer: readonly Pt[] | { readonly center: Pt; readonly r: number };
    readonly center: Pt;
    readonly r: number;
  }[];
  readonly rights?: readonly { readonly at: Pt; readonly a: Pt; readonly b: Pt }[];
  readonly labels?: readonly Label[];
}

const givenMeasures = t("A figure labeled with the measures given in the question.", "标有题中已知量的图形。");
const givenGraph = t("A graph of what the question describes.", "题中所述内容的图象。");
const rad = (d: number): number => (d * Math.PI) / 180;
const r1 = (n: number): string => String(Math.round(n * 10) / 10);
const polar = (r: number, d: number, o: Pt = [0, 0]): Pt => [o[0] + r * Math.cos(rad(d)), o[1] + r * Math.sin(rad(d))];
const centroid = (pts: readonly Pt[]): Pt => [
  pts.reduce((s, p) => s + p[0], 0) / pts.length,
  pts.reduce((s, p) => s + p[1], 0) / pts.length,
];

/** sceneFigure draws a scene on a 320 by 240 canvas, scaled to fit and keeping its proportions. */
export function sceneFigure(s: Scene, alt: Text = givenMeasures): Figure {
  const [W, H, M] = [320, 240, 34];
  const xs: number[] = [];
  const ys: number[] = [];
  for (const shape of s.shapes) {
    if ("pts" in shape) {
      xs.push(...shape.pts.map((p) => p[0]));
      ys.push(...shape.pts.map((p) => p[1]));
    } else {
      xs.push(shape.center[0] - shape.r, shape.center[0] + shape.r);
      ys.push(shape.center[1] - shape.r, shape.center[1] + shape.r);
    }
  }
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const scale = Math.min((W - 2 * M) / Math.max(x1 - x0, 1e-6), (H - 2 * M) / Math.max(y1 - y0, 1e-6));
  const px = (x: number) => W / 2 + (x - (x0 + x1) / 2) * scale;
  const py = (y: number) => H / 2 - (y - (y0 + y1) / 2) * scale;
  const pair = (p: Pt) => `${r1(px(p[0]))},${r1(py(p[1]))}`;
  const circlePath = (c: Pt, r: number) => {
    const R = r1(r * scale);
    return `M${r1(px(c[0]) - r * scale)},${r1(py(c[1]))}a${R},${R} 0 1,0 ${r1(2 * r * scale)},0a${R},${R} 0 1,0 ${r1(-2 * r * scale)},0Z`;
  };
  const parts: string[] = [];
  for (const ring of s.rings ?? []) {
    const outer = ring.outer;
    const poly = "center" in outer ? circlePath(outer.center, outer.r) : `M${outer.map(pair).join("L")}Z`;
    parts.push(
      `<path d="${poly}${circlePath(ring.center, ring.r)}" fill-rule="evenodd" fill="currentColor" fill-opacity="0.18" stroke="none"/>`,
    );
  }
  for (const shape of s.shapes) {
    const shade = shape.shade ? ' fill="currentColor" fill-opacity="0.18"' : "";
    if ("pts" in shape) {
      const tag = shape.closed ? "polygon" : "polyline";
      parts.push(
        `<${tag} points="${shape.pts.map(pair).join(" ")}" stroke-width="1.6"${shade}${shape.dash ? ' stroke-dasharray="4 4"' : ""}/>`,
      );
    } else
      parts.push(
        `<circle cx="${r1(px(shape.center[0]))}" cy="${r1(py(shape.center[1]))}" r="${r1(shape.r * scale)}" stroke-width="1.6"${shade}/>`,
      );
  }
  for (const { at, a, b } of s.rights ?? []) {
    const unit = (to: Pt): Pt => {
      const [dx, dy] = [px(to[0]) - px(at[0]), py(to[1]) - py(at[1])];
      const l = Math.hypot(dx, dy) || 1;
      return [(dx / l) * 10, (dy / l) * 10];
    };
    const [u, v] = [unit(a), unit(b)];
    const o: Pt = [px(at[0]), py(at[1])];
    parts.push(
      `<polyline points="${r1(o[0] + u[0])},${r1(o[1] + u[1])} ${r1(o[0] + u[0] + v[0])},${r1(o[1] + u[1] + v[1])} ${r1(o[0] + v[0])},${r1(o[1] + v[1])}" stroke-width="1"/>`,
    );
  }
  for (const { at, text, from, by = 0 } of s.labels ?? []) {
    let [x, y] = [px(at[0]), py(at[1])];
    if (from) {
      const [dx, dy] = [x - px(from[0]), y - py(from[1])];
      const l = Math.hypot(dx, dy) || 1;
      x += (dx / l) * by;
      y += (dy / l) * by;
    }
    parts.push(`<text x="${r1(x)}" y="${r1(y + 5)}" font-size="14" text-anchor="middle" fill="currentColor" stroke="none">${text}</text>`);
  }
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" stroke="currentColor">${parts.join("")}</svg>`,
    alt,
  };
}

/** Marks labels a polygon: names at its vertices, angles inside them and sides beside the segment from each vertex to the next; right gives the vertex with a right-angle mark. */
export interface Marks {
  readonly v?: readonly (string | null)[];
  readonly a?: readonly (string | null)[];
  readonly s?: readonly (string | null)[];
  readonly right?: number;
}

function polygonScene(pts: readonly Pt[], m: Marks): Scene {
  const c = centroid(pts);
  const labels: Label[] = [];
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % pts.length]!;
    const name = m.v?.[i];
    const angle = m.a?.[i];
    const side = m.s?.[i];
    if (name) labels.push({ at: p, text: name, from: c, by: 15 });
    if (angle) labels.push({ at: p, text: angle, from: c, by: -30 });
    if (side) labels.push({ at: [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], text: side, from: c, by: 15 });
  });
  const at = m.right === undefined ? undefined : pts[m.right];
  return {
    shapes: [{ pts, closed: true }],
    labels,
    ...(at && { rights: [{ at, a: pts[(m.right! + 1) % pts.length]!, b: pts[(m.right! + pts.length - 1) % pts.length]! }] }),
  };
}

/** polyFigure draws a labeled polygon. */
export function polyFigure(pts: readonly Pt[], m: Marks = {}): Figure {
  return sceneFigure(polygonScene(pts, m));
}

/** rightPts are the vertices of a right triangle with legs w and h, with the right angle at the second vertex: top, corner, then right. */
export const rightPts = (w: number, h: number): Pt[] => [
  [0, h],
  [0, 0],
  [w, 0],
];

/** anglePts are the vertices of a triangle with angle a at the first vertex and angle b at the second. */
export function anglePts(a: number, b: number): Pt[] {
  const side = Math.sin(rad(b)) / Math.sin(rad(180 - a - b));
  return [[0, 0], [1, 0], polar(side, a)];
}

/** isoPts are the vertices of an isosceles triangle with the given vertex angle at the third vertex. */
export const isoPts = (apex: number): Pt[] => [
  [-1, 0],
  [1, 0],
  [0, 1 / Math.tan(rad(apex / 2))],
];

/** sasPts are the vertices of a triangle with two sides meeting at the given angle at the first vertex; the sides are drawn in proportion within limits. */
export function sasPts(a: number, b: number, angle: number): Pt[] {
  const ratio = Math.min(2.5, Math.max(0.4, b / a));
  return [[0, 0], [1, 0], polar(ratio, angle)];
}

/** regularPts are the vertices of a regular polygon with n sides. */
export const regularPts = (n: number): Pt[] => Array.from({ length: n }, (_, i) => polar(1, 90 + (360 * i) / n));

/** rectFigure draws a rectangle with its width labeled below and its height at the side. */
export function rectFigure(w: number, h: number, wLabel: string | null, hLabel: string | null): Figure {
  const ratio = Math.min(3, Math.max(1 / 2, w / h));
  return polyFigure(
    [
      [0, 0],
      [ratio, 0],
      [ratio, 1],
      [0, 1],
    ],
    { s: [wLabel, hLabel, null, null] },
  );
}

/** exteriorFigure draws a triangle with the given angles and its base extended, the two remote angles labeled at the left and the top and the exterior angle at the right. */
export function exteriorFigure(a: number, b: number, aLabel: string, bLabel: string, extLabel: string): Figure {
  const [P, R, Q] = anglePtsAcross(a, b);
  const c = centroid([P, R, Q]);
  return sceneFigure({
    shapes: [{ pts: [P, Q, R], closed: true }, { pts: [R, [R[0] + 0.45, 0]] }],
    labels: [
      { at: P, text: aLabel, from: c, by: -30 },
      { at: Q, text: bLabel, from: c, by: -30 },
      { at: [R[0] + 0.18, 0], text: extLabel, from: [R[0] + 0.18, -1], by: 16 },
    ],
  });
}

function anglePtsAcross(a: number, b: number): [Pt, Pt, Pt] {
  const side = Math.sin(rad(180 - a - b)) / Math.sin(rad(b));
  return [[0, 0], [1, 0], polar(side, a)];
}

/** bowtieFigure draws segments AD and BE crossing at C, with angles a and b at A and B and c at D, and asks for the angle at E. */
export function bowtieFigure(a: number, b: number, c: number): Figure {
  const m = 180 - a - b;
  const O: Pt = [0, 0];
  const A = polar(Math.sin(rad(b)), 180 - m / 2);
  const B = polar(Math.sin(rad(a)), 180 + m / 2);
  const e = 180 - m - c;
  const D = polar(Math.sin(rad(e)), -m / 2);
  const E = polar(Math.sin(rad(c)), m / 2);
  const left = centroid([A, B, O]);
  const right = centroid([D, E, O]);
  return sceneFigure({
    shapes: [
      { pts: [A, B, O], closed: true },
      { pts: [D, E, O], closed: true },
    ],
    labels: [
      { at: A, text: "A", from: left, by: 14 },
      { at: B, text: "B", from: left, by: 14 },
      { at: D, text: "D", from: right, by: 14 },
      { at: E, text: "E", from: right, by: 14 },
      { at: O, text: "C", from: [0, 1], by: -16 },
      { at: A, text: `${a}°`, from: left, by: -26 },
      { at: B, text: `${b}°`, from: left, by: -26 },
      { at: D, text: `${c}°`, from: right, by: -26 },
      { at: E, text: "?", from: right, by: -26 },
    ],
  });
}

/** kiteFigure draws triangles ABC and ADC on opposite sides of AC, with the given angles at A, B and D. */
export function kiteFigure(bac: number, b: number, dac: number, d: number): Figure {
  const A: Pt = [0, 0];
  const C: Pt = [1, 0];
  const B = polar(Math.sin(rad(180 - bac - b)) / Math.sin(rad(b)), -bac);
  const D = polar(Math.sin(rad(180 - dac - d)) / Math.sin(rad(d)), dac);
  return sceneFigure({
    shapes: [{ pts: [A, B, C, D], closed: true }, { pts: [A, C] }],
    labels: [
      { at: A, text: "A", from: C, by: 15 },
      { at: C, text: "C", from: A, by: 15 },
      { at: B, text: "B", from: A, by: 15 },
      { at: D, text: "D", from: A, by: 15 },
      { at: polar(0.3, -bac / 2), text: `${bac}°` },
      { at: polar(0.3, dac / 2), text: `${dac}°` },
      { at: B, text: `${b}°`, from: [0.5, 0], by: -26 },
      { at: D, text: `${d}°`, from: [0.5, 0], by: -26 },
    ],
  });
}

/** cevianFigure draws triangle ABC with D on BC, with angle b at B and angle a of triangle ABD at A; dac gives the rest of the angle at A, and the question mark goes at C if it is given and at D otherwise. */
export function cevianFigure(a: number, b: number, dac?: number): Figure {
  const B: Pt = [0, 0];
  const D: Pt = [1, 0];
  const adb = 180 - a - b;
  const A = polar(Math.sin(rad(adb)) / Math.sin(rad(a)), b);
  const ad = Math.sin(rad(b)) / Math.sin(rad(a));
  const c = 180 - a - b - (dac ?? 30);
  const C: Pt = [1 + (ad * Math.sin(rad(dac ?? 30))) / Math.sin(rad(c)), 0];
  const mid = centroid([A, B, C]);
  return sceneFigure({
    shapes: [{ pts: [A, B, C], closed: true }, { pts: [A, D] }],
    labels: [
      { at: A, text: "A", from: mid, by: 15 },
      { at: B, text: "B", from: mid, by: 15 },
      { at: C, text: "C", from: mid, by: 15 },
      { at: D, text: "D", from: [D[0], 1], by: 15 },
      { at: B, text: `${b}°`, from: centroid([A, B, D]), by: -26 },
      { at: A, text: `${a}°`, from: [(A[0] + 0.4) * 1.0, A[1] + 1], by: 34 },
      ...(dac === undefined
        ? [{ at: D, text: "?", from: [D[0] - 1, -1] as Pt, by: 22 }]
        : [
            { at: A, text: `${dac}°`, from: [A[0] - 0.4, A[1] + 1] as Pt, by: 34 },
            { at: C, text: "?", from: mid, by: -24 },
          ]),
    ],
  });
}

/** crossFigure draws two crossing lines with labels in two of the angles they form; vertical puts the second label opposite the first and otherwise beside it. */
export function crossFigure(angle: number, first: string, second: string, vertical: boolean): Figure {
  const slant = Math.max(30, Math.min(150, angle));
  return sceneFigure({
    shapes: [
      {
        pts: [
          [-1, 0],
          [1, 0],
        ],
      },
      { pts: [polar(0.9, slant + 180), polar(0.9, slant)] },
    ],
    labels: [
      { at: polar(0.28, slant / 2), text: first },
      { at: polar(0.28, vertical ? slant / 2 + 180 : (slant + 180) / 2), text: second },
    ],
  });
}

/** transversalFigure draws two parallel lines crossed by a third, with an angle labeled at the upper crossing and another at the lower one; corresponding puts the second in the same position, and otherwise it is on the same side between the lines. */
export function transversalFigure(angle: number, first: string, second: string, corresponding: boolean): Figure {
  const slant = Math.max(35, Math.min(145, corresponding ? angle : 180 - angle));
  const run = 1 / Math.tan(rad(slant));
  const top: Pt = [run / 2, 0.5];
  const low: Pt = [-run / 2, -0.5];
  const up = (at: Pt): Pt => polar(0.26, slant / 2, at);
  const under = (at: Pt): Pt => polar(0.26, -(180 - slant) / 2, at);
  return sceneFigure({
    shapes: [
      {
        pts: [
          [-1.5, 0.5],
          [1.5, 0.5],
        ],
      },
      {
        pts: [
          [-1.5, -0.5],
          [1.5, -0.5],
        ],
      },
      {
        pts: [
          [low[0] - run * 0.45, -0.95],
          [top[0] + run * 0.45, 0.95],
        ],
      },
    ],
    labels: [
      { at: corresponding ? up(top) : under(top), text: first },
      { at: up(low), text: second },
    ],
  });
}

/** radiusFigure draws a circle with a labeled radius. */
export function radiusFigure(label: string): Figure {
  return sceneFigure({
    shapes: [{ center: [0, 0], r: 1 }, { pts: [[0, 0], polar(1, 25)] }],
    labels: [{ at: polar(0.55, 42), text: label }],
  });
}

/** diameterFigure draws a circle with a labeled diameter. */
export function diameterFigure(label: string): Figure {
  return sceneFigure({
    shapes: [
      { center: [0, 0], r: 1 },
      {
        pts: [
          [-1, 0],
          [1, 0],
        ],
      },
    ],
    labels: [{ at: [0, 0.14], text: label }],
  });
}

/** chordFigure draws radii OA and OB with the chord between them and labels for the angles at O and at A. */
export function chordFigure(aob: number, atO: string, atA: string): Figure {
  const O: Pt = [0, 0];
  const A = polar(1, 90 + aob / 2);
  const B = polar(1, 90 - aob / 2);
  const c = centroid([O, A, B]);
  return sceneFigure({
    shapes: [
      { center: O, r: 1 },
      { pts: [O, A, B], closed: true },
    ],
    labels: [
      { at: O, text: "O", from: c, by: 15 },
      { at: A, text: "A", from: O, by: 15 },
      { at: B, text: "B", from: O, by: 15 },
      { at: O, text: atO, from: c, by: -30 },
      { at: A, text: atA, from: c, by: -30 },
    ],
  });
}

/** squareCircleFigure draws a circle inscribed in a square, optionally shading the region outside the circle, with the radius or the side labeled. */
export function squareCircleFigure(opts: { readonly radius?: string; readonly side?: string; readonly shade?: boolean }): Figure {
  const square: Pt[] = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  return sceneFigure({
    shapes: [{ pts: square, closed: true }, { center: [0, 0], r: 1 }, ...(opts.radius ? [{ pts: [[0, 0], polar(1, 30)] as Pt[] }] : [])],
    ...(opts.shade && { rings: [{ outer: square, center: [0, 0] as Pt, r: 1 }] }),
    labels: [
      ...(opts.radius ? [{ at: polar(0.55, 48), text: opts.radius }] : []),
      ...(opts.side ? [{ at: [0, -1] as Pt, text: opts.side, from: [0, 0] as Pt, by: 15 }] : []),
    ],
  });
}

/** incircleFigure draws a circle inscribed in an equilateral triangle, with the radius drawn to the base and labeled. */
export function incircleFigure(radius: string): Figure {
  const s = Math.sqrt(3);
  return sceneFigure({
    shapes: [
      {
        pts: [
          [-s, -1],
          [s, -1],
          [0, 2],
        ],
        closed: true,
      },
      { center: [0, 0], r: 1 },
      {
        pts: [
          [0, 0],
          [0, -1],
        ],
      },
    ],
    labels: [{ at: [0.22, -0.5], text: radius }],
  });
}

/** circumcircleFigure draws an equilateral triangle inscribed in a circle, with a radius drawn to a vertex and labeled. */
export function circumcircleFigure(radius: string): Figure {
  const pts = [polar(1, 90), polar(1, 210), polar(1, 330)];
  return sceneFigure({
    shapes: [{ center: [0, 0], r: 1 }, { pts, closed: true }, { pts: [[0, 0], polar(1, 90)] }],
    labels: [{ at: [0.14, 0.5], text: radius }],
  });
}

/** equilateralFigure draws an equilateral triangle with its height dashed, a side labeled and the height labeled if a label is given. */
export function equilateralFigure(side: string, height: string | null): Figure {
  const s = Math.sqrt(3);
  return sceneFigure({
    shapes: [
      {
        pts: [
          [-1, 0],
          [1, 0],
          [0, s],
        ],
        closed: true,
      },
      {
        pts: [
          [0, 0],
          [0, s],
        ],
        dash: true,
      },
    ],
    rights: [{ at: [0, 0], a: [1, 0], b: [0, s] }],
    labels: [{ at: [0, 0], text: side, from: [0, 1], by: 15 }, ...(height ? [{ at: [0.14, s / 2] as Pt, text: height }] : [])],
  });
}

/** twoTrianglesFigure draws two congruent or similar triangles side by side, the second at the given scale. */
export function twoTrianglesFigure(pts: readonly Pt[], first: Marks, second: Marks, scale = 1): Figure {
  const width = Math.max(...pts.map((p) => p[0])) - Math.min(...pts.map((p) => p[0]));
  const left = polygonScene(pts, first);
  const moved = pts.map(([x, y]): Pt => [x * scale + width * 1.5, y * scale]);
  const right = polygonScene(moved, second);
  return sceneFigure({
    shapes: [...left.shapes, ...right.shapes],
    labels: [...(left.labels ?? []), ...(right.labels ?? [])],
    rights: [...(left.rights ?? []), ...(right.rights ?? [])],
  });
}

/** altitudeFigure draws a right triangle ABC with the altitude CD to the hypotenuse, with AD = p and DB = q; the label goes on the altitude if one is given. */
export function altitudeFigure(p: number, q: number, altitude: string | null): Figure {
  const ratio = Math.min(8, Math.max(1 / 8, p / q));
  const [a, b] = [ratio, 1];
  const A: Pt = [0, 0];
  const D: Pt = [a, 0];
  const B: Pt = [a + b, 0];
  const C: Pt = [a, Math.sqrt(a * b)];
  return sceneFigure({
    shapes: [
      { pts: [A, B, C], closed: true },
      { pts: [C, D], dash: true },
    ],
    rights: [{ at: D, a: B, b: C }],
    labels: [
      { at: A, text: "A", from: C, by: 14 },
      { at: B, text: "B", from: C, by: 14 },
      { at: C, text: "C", from: D, by: 14 },
      { at: D, text: "D", from: C, by: 28 },
      { at: [a / 2, 0], text: `${p}`, from: C, by: 15 },
      { at: [a + b / 2, 0], text: `${q}`, from: C, by: 15 },
      ...(altitude ? [{ at: [a, C[1] / 2] as Pt, text: altitude, from: A, by: 13 }] : []),
    ],
  });
}

/** heightFigure draws a triangle with its base labeled and its height dashed and labeled. */
export function heightFigure(base: string, height: string | null): Figure {
  const A: Pt = [0, 0];
  const B: Pt = [2, 0];
  const C: Pt = [0.7, 1.2];
  const D: Pt = [0.7, 0];
  return sceneFigure({
    shapes: [
      { pts: [A, B, C], closed: true },
      { pts: [C, D], dash: true },
    ],
    rights: [{ at: D, a: B, b: C }],
    labels: [
      { at: [1, 0], text: base, from: [1, 1], by: 15 },
      ...(height ? [{ at: [0.7, 0.6] as Pt, text: height, from: [0, 0.6] as Pt, by: 13 }] : []),
    ],
  });
}

/** numberLineFigure divides a number line into equal parts, labels its two ends and marks the given part with "?". */
export function numberLineFigure(from: number, to: number, parts: number, mark: number): Figure {
  const ticks = Array.from(
    { length: parts + 1 },
    (_, i): Shape => ({
      pts: [
        [i, -0.12],
        [i, 0.12],
      ],
    }),
  );
  return sceneFigure({
    shapes: [
      {
        pts: [
          [-0.4, 0],
          [parts + 0.4, 0],
        ],
      },
      ...ticks,
    ],
    labels: [
      { at: [0, 0], text: `${from}`, from: [0, 1], by: 20 },
      { at: [parts, 0], text: `${to}`, from: [parts, 1], by: 20 },
      { at: [mark, 0], text: "?", from: [mark, -1], by: 20 },
    ],
  });
}

/** stripFigure draws a rectangle divided into n equal parts with the first ones shaded. */
export function stripFigure(n: number, shaded: number): Figure {
  const cell = (i: number, shade: boolean): Shape => ({
    pts: [
      [i, 0],
      [i + 1, 0],
      [i + 1, 2],
      [i, 2],
    ],
    closed: true,
    shade,
  });
  return sceneFigure({ shapes: Array.from({ length: n }, (_, i) => cell(i, i < shaded)) });
}

/** nestedSquaresFigure draws a square with a smaller shaded square inside it, the sides in the given ratio. */
export function nestedSquaresFigure(outer: string, inner: string, ratio: number): Figure {
  const s = 2 / ratio;
  return sceneFigure({
    shapes: [
      {
        pts: [
          [0, 0],
          [2, 0],
          [2, 2],
          [0, 2],
        ],
        closed: true,
      },
      {
        pts: [
          [0, 0],
          [s, 0],
          [s, s],
          [0, s],
        ],
        closed: true,
        shade: true,
      },
    ],
    labels: [
      { at: [1, 2], text: outer, from: [1, 1], by: 15 },
      { at: [s, s / 2], text: inner, from: [0, s / 2], by: 15 },
    ],
  });
}

/** ringFigure draws two concentric circles with the ring between them shaded and both radii labeled. */
export function ringFigure(inner: number, outer: number): Figure {
  const r = Math.max(0.3, Math.min(0.8, inner / outer));
  return sceneFigure({
    shapes: [{ center: [0, 0], r: 1 }, { center: [0, 0], r }, { pts: [[0, 0], polar(r, 150)] }, { pts: [[0, 0], polar(1, 30)] }],
    rings: [{ outer: { center: [0, 0], r: 1 }, center: [0, 0], r }],
    labels: [
      { at: polar(r / 2, 150), text: `${inner}`, from: polar(r / 2, 240), by: 15 },
      { at: polar(0.6, 30), text: `${outer}`, from: polar(0.6, -60), by: 15 },
    ],
  });
}

/** twoSquaresFigure draws two squares side by side with their sides labeled. */
export function twoSquaresFigure(small: string, large: string, ratio: number): Figure {
  const k = Math.min(3, ratio);
  const square = (x: number, s: number): Shape => ({
    pts: [
      [x, 0],
      [x + s, 0],
      [x + s, s],
      [x, s],
    ],
    closed: true,
  });
  return sceneFigure({
    shapes: [square(0, 1), square(1.5, k)],
    labels: [
      { at: [0.5, 0], text: small, from: [0.5, 1], by: 15 },
      { at: [1.5 + k / 2, 0], text: large, from: [1.5 + k / 2, 1], by: 15 },
    ],
  });
}

/** triangleInRectFigure draws a triangle and a rectangle with the same base and height, side by side. */
export function triangleInRectFigure(base: string, height: string): Figure {
  return sceneFigure({
    shapes: [
      {
        pts: [
          [0, 0],
          [2, 0],
          [0.7, 1.5],
        ],
        closed: true,
      },
      {
        pts: [
          [0.7, 0],
          [0.7, 1.5],
        ],
        dash: true,
      },
      {
        pts: [
          [3, 0],
          [5, 0],
          [5, 1.5],
          [3, 1.5],
        ],
        closed: true,
      },
    ],
    labels: [
      { at: [1, 0], text: base, from: [1, 1], by: 15 },
      { at: [4, 0], text: base, from: [4, 1], by: 15 },
      { at: [0.7, 0.75], text: height, from: [0, 0.75], by: 13 },
      { at: [5, 0.75], text: height, from: [4, 0.75], by: 15 },
    ],
  });
}

/** twoCirclesFigure draws two circles side by side with their radii labeled. */
export function twoCirclesFigure(small: string, large: string, ratio: number): Figure {
  const k = Math.min(2.5, ratio);
  const c: Pt = [1 + 0.4 + k, 0];
  return sceneFigure({
    shapes: [
      { center: [0, 0], r: 1 },
      {
        pts: [
          [0, 0],
          [1, 0],
        ],
      },
      { center: c, r: k },
      { pts: [c, [c[0] + k, 0]] },
    ],
    labels: [
      { at: [0.5, 0], text: small, from: [0.5, -1], by: 11 },
      { at: [c[0] + k / 2, 0], text: large, from: [c[0] + k / 2, -1], by: 11 },
    ],
  });
}

/** sectorFigure draws a circle with a shaded sector, its central angle labeled and, if given, its radius. */
export function sectorFigure(angle: number, angleLabel: string, radius: string | null): Figure {
  const n = Math.max(2, Math.round(angle / 6));
  const arc = Array.from({ length: n + 1 }, (_, i) => polar(1, (angle * i) / n));
  return sceneFigure({
    shapes: [
      { center: [0, 0], r: 1 },
      { pts: [[0, 0], ...arc], closed: true, shade: true },
    ],
    labels: [
      { at: polar(0.45, angle / 2), text: angleLabel },
      ...(radius ? [{ at: polar(0.55, -8), text: radius, from: [0.55, 1] as Pt, by: 10 }] : []),
    ],
  });
}

/** inscribedAngleFigure draws a central angle and an inscribed angle on the same arc, labeling the central one and marking the inscribed one with "?". */
export function inscribedAngleFigure(central: number): Figure {
  const A = polar(1, -90 - central / 2);
  const B = polar(1, -90 + central / 2);
  const P = polar(1, 90);
  return sceneFigure({
    shapes: [{ center: [0, 0], r: 1 }, { pts: [A, [0, 0], B] }, { pts: [A, P, B] }],
    labels: [
      { at: [0, 0], text: `${central}°`, from: [0, -1], by: 16 },
      { at: P, text: "?", from: [0, 0], by: -34 },
    ],
  });
}

/** diameterTriangleFigure draws triangle ABC inscribed in a circle with AB a diameter, labeling the angle at A and marking the angle at B with "?". */
export function diameterTriangleFigure(a: number): Figure {
  const A: Pt = [-1, 0];
  const B: Pt = [1, 0];
  const C = polar(1, 180 - 2 * a);
  const c = centroid([A, B, C]);
  return sceneFigure({
    shapes: [
      { center: [0, 0], r: 1 },
      { pts: [A, B, C], closed: true },
    ],
    rights: [{ at: C, a: A, b: B }],
    labels: [
      { at: A, text: "A", from: [0, 0], by: 15 },
      { at: B, text: "B", from: [0, 0], by: 15 },
      { at: C, text: "C", from: [0, 0], by: 15 },
      { at: A, text: `${a}°`, from: c, by: -30 },
      { at: B, text: "?", from: c, by: -30 },
    ],
  });
}

/** squareInCircleFigure draws a square inscribed in a circle, with a diagonal dashed and a radius labeled. */
export function squareInCircleFigure(radius: string): Figure {
  const pts = [polar(1, 45), polar(1, 135), polar(1, 225), polar(1, 315)];
  return sceneFigure({
    shapes: [
      { center: [0, 0], r: 1 },
      { pts, closed: true },
      { pts: [pts[0]!, pts[2]!], dash: true },
    ],
    labels: [{ at: polar(0.5, 45), text: radius, from: polar(0.5, 135), by: 15 }],
  });
}

/** hexagonSpokesFigure draws a regular hexagon divided into six equilateral triangles. */
export function hexagonSpokesFigure(): Figure {
  const pts = regularPts(6);
  return sceneFigure({
    shapes: [{ pts, closed: true }, ...pts.map((p): Shape => ({ pts: [[0, 0], p] }))],
  });
}

/** pieFigure draws a circle graph with a shaded sector labeled with its percent. */
export function pieFigure(percent: number): Figure {
  const angle = percent * 3.6;
  const n = Math.max(2, Math.round(angle / 6));
  const arc = Array.from({ length: n + 1 }, (_, i) => polar(1, 90 - (angle * i) / n));
  return sceneFigure(
    {
      shapes: [
        { center: [0, 0], r: 1 },
        { pts: [[0, 0], ...arc], closed: true, shade: true },
      ],
      labels: [{ at: polar(0.6, 90 - angle / 2), text: `${percent}%` }],
    },
    t("A circle graph with one shaded sector labeled with its percent.", "一张扇形图，其中一个阴影扇形标有百分比。"),
  );
}

const niceStep = (span: number): number => {
  for (const step of [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000]) if (span / step <= 10) return step;
  return 2000;
};

/** viewOf is a window around the given values, on a grid of round numbers that includes the origin of each axis when it is near. */
export function viewOf(xs: readonly number[], ys: readonly number[]): PlotView {
  const axis = (v: readonly number[]): [number, number, number] => {
    const [lo, hi] = [Math.min(0, ...v), Math.max(0, ...v)];
    const step = niceStep(hi - lo || 1);
    return [Math.floor(lo / step - 0.5) * step, Math.ceil(hi / step + 0.5) * step, step];
  };
  const [x0, x1, dx] = axis(xs);
  const [y0, y1, dy] = axis(ys);
  return { x: [x0, x1], y: [y0, y1], dx, dy };
}

/** lineFigure graphs the line y = mx + b. */
export function lineFigure(m: number, b: number): Figure {
  return curveFigure((x) => m * x + b, { x: [-10, 10], y: [-12, 12], dx: 2, dy: 2 }, givenGraph);
}

/** curvePlot graphs f over the given ranges, on a grid that fits them. */
export function curvePlot(f: (x: number) => number, x: readonly [number, number], y: readonly [number, number]): Figure {
  return curveFigure(f, { x, y, dx: niceStep(x[1] - x[0]), dy: niceStep(y[1] - y[0]) }, givenGraph);
}

/** linesFigure graphs two lines y = mx + b. */
export function linesFigure(first: readonly [number, number], second: readonly [number, number]): Figure {
  const view: PlotView = { x: [-10, 10], y: [-20, 20], dx: 2, dy: 5 };
  const line = (m: number, b: number, px: (x: number) => number, py: (y: number) => number): string => {
    const clip = (x: number): number => Math.max(-10, Math.min(10, x));
    const [xa, xb] = m === 0 ? [-10, 10] : [clip((-20 - b) / m), clip((20 - b) / m)].sort((p, q) => p - q);
    return `<line class="accent" x1="${r1(px(xa!))}" y1="${r1(py(m * xa! + b))}" x2="${r1(px(xb!))}" y2="${r1(py(m * xb! + b))}" stroke-width="2"/>`;
  };
  return plotFrame(view, (px, py) => line(first[0], first[1], px, py) + line(second[0], second[1], px, py), givenGraph);
}

/** pointsFigure plots points on a grid that fits them, with an optional segment through two points. */
export function pointsFigure(
  points: readonly (readonly [number, number])[],
  segment?: readonly [readonly [number, number], readonly [number, number]],
): Figure {
  return dotsFigure(
    points,
    viewOf(
      points.map((p) => p[0]),
      points.map((p) => p[1]),
    ),
    givenGraph,
    segment,
  );
}

/** regionFigure graphs the solutions of y > mx + b or y < mx + b: a dashed boundary line with the solutions shaded. */
export function regionFigure(m: number, b: number, above: boolean): Figure {
  const view: PlotView = { x: [-10, 10], y: [-12, 12], dx: 2, dy: 2 };
  return plotFrame(
    view,
    (px, py) => {
      const clip = (x: number): number => Math.max(-10, Math.min(10, x));
      const [xa, xc] = [clip((-12 - b) / m), clip((12 - b) / m)].sort((p, q) => p - q) as [number, number];
      const [ya, yc] = [m * xa + b, m * xc + b];
      const edge = above ? 12 : -12;
      const corners: Pt[] = [
        [xa, ya],
        [xc, yc],
      ];
      if (xc < 10 && yc !== edge) corners.push([10, yc], [10, edge]);
      else if (xc === 10) corners.push([10, edge]);
      else corners.push([10, edge]);
      corners.push([-10, edge]);
      if (xa > -10 && ya !== edge) corners.push([-10, ya]);
      else if (xa === -10) corners.push([-10, ya]);
      const pts = corners.map((p) => `${r1(px(p[0]))},${r1(py(p[1]))}`).join(" ");
      return `<polygon points="${pts}" fill="currentColor" fill-opacity="0.15" stroke="none"/><line class="accent" x1="${r1(px(xa))}" y1="${r1(py(ya))}" x2="${r1(px(xc))}" y2="${r1(py(yc))}" stroke-width="2" stroke-dasharray="6 4"/>`;
    },
    givenGraph,
  );
}

/** rectPlot draws a rectangle on a coordinate grid from its corner and size, leaving out the corner the question asks for if asked. */
export function rectPlot(x: number, y: number, w: number, h: number, hideFourth: boolean): Figure {
  const corners: (readonly [number, number])[] = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    ...(hideFourth ? [] : ([[x, y + h]] as (readonly [number, number])[])),
  ];
  const view = viewOf([x, x + w], [y, y + h]);
  const frame = plotFrame(
    view,
    (px, py) => {
      const dots = corners
        .map(([a, b]) => `<circle cx="${r1(px(a))}" cy="${r1(py(b))}" r="3.2" fill="currentColor" stroke="none"/>`)
        .join("");
      const path = corners.map(([a, b]) => `${r1(px(a))},${r1(py(b))}`).join(" ");
      return `${dots}<polyline class="accent" points="${path}${hideFourth ? "" : ` ${r1(px(x))},${r1(py(y))}`}" stroke-width="2"/>`;
    },
    givenGraph,
  );
  return frame;
}
