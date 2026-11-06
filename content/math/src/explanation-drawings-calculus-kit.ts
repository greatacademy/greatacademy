// Helpers for the drawings of the calculus explanations: panels of graphs, holes, areas under curves and Riemann sums.

import type { Compass, Mark, PlaneMark, Point } from "@ga/subject-math";
import { chain, chart, curveOf, type Scale } from "./explanation-drawings-charts.ts";
import { plot, wall } from "./explanation-drawings-curves.ts";
import { ln, shape, shift } from "./explanation-drawings-geometry-2.ts";
import { dotAt, note, ring, seg } from "./explanation-drawings-kit.ts";

type Tone = "action" | "result";
type Fn = (x: number) => number;

/** Pane is a small graph inside a drawing with several graphs; each method adds marks and returns the pane. */
export interface Pane {
  /** f adds the graph of a function between two values of x, by default across the whole pane. */
  f(fn: Fn, from?: number, to?: number, s?: Tone, dashed?: boolean): Pane;
  /** path joins points of the graph. */
  path(points: readonly Point[], s?: Tone, dashed?: boolean): Pane;
  /** dot adds a filled point. */
  dot(x: number, y: number, text?: string, dir?: Compass, s?: Tone): Pane;
  /** open adds a hollow point, one the graph does not include. */
  open(x: number, y: number, text?: string, dir?: Compass): Pane;
  /** wall adds the dashed vertical line through x. */
  wall(x: number): Pane;
  /** level adds the dashed horizontal line at height y. */
  level(y: number, s?: Tone): Pane;
  /** say adds a note at a place of the graph. */
  say(x: number, y: number, text: string, dir?: Compass): Pane;
  /** under shades the region between the graph of a function and the x-axis. */
  under(fn: Fn, from: number, to: number, s?: Tone): Pane;
  /** marks gives the marks of the pane, moved to the right by the pane's offset. */
  marks(): Mark[];
}

/** pane starts a small graph with its own scales, its left edge dx to the right in the drawing. */
export function pane(dx: number, x: Scale, y: Scale, w = 6, h = 5, xName = "x", yName = "y"): Pane {
  const c = chart({ x, y, xName, yName, w, h });
  const out: Mark[] = [...c.marks];
  const self: Pane = {
    f(fn, from = x[0], to = x[1], s, dashed = false) {
      out.push(...plot(c, fn, from, to, y[0], y[1], s, dashed));
      return self;
    },
    path(points, s, dashed = false) {
      out.push(
        ...chain(
          points.map((p) => c.at(p[0], p[1])),
          s,
          dashed,
        ),
      );
      return self;
    },
    dot(a, b, text, dir = "ne", s) {
      out.push(...dotAt(c.at(a, b), text, dir, s));
      return self;
    },
    open(a, b, text, dir = "ne") {
      out.push(ring(0.09, c.at(a, b)));
      if (text) out.push(note(c.at(a, b), text, dir));
      return self;
    },
    wall(a) {
      out.push(wall(c, a, y[0], y[1]));
      return self;
    },
    level(b, s) {
      out.push(seg(c.at(x[0], b), c.at(x[1], b), s, true));
      return self;
    },
    say(a, b, text, dir = "n") {
      out.push(note(c.at(a, b), text, dir));
      return self;
    },
    under(fn, from, to, s = "result") {
      const top = Array.from({ length: 49 }, (_, i): Point => c.at(from + ((to - from) * i) / 48, fn(from + ((to - from) * i) / 48)));
      out.push({ kind: "shade", points: [c.at(from, 0), ...top, c.at(to, 0)], tone: s });
      return self;
    },
    marks: () => shift(out, dx),
  };
  return self;
}

/** broken is a function drawn with a hollow point where it has a hole. */
export const broken = (f: Fn, a: number, from: number, to: number, tone?: Tone): PlaneMark[] => [
  curveOf(f, tone, from, a - 0.001),
  curveOf(f, tone, a + 0.001, to),
];

/** area is the shaded region between the graph of f and the x-axis, from a to b. */
export const area = (f: Fn, a: number, b: number, tone: Tone = "result"): PlaneMark =>
  shape([[a, 0], ...Array.from({ length: 61 }, (_, i): Point => [a + ((b - a) * i) / 60, f(a + ((b - a) * i) / 60)]), [b, 0]], tone);

/** strip is the outline of a rectangle or trapezoid standing on the x-axis, from x = a to x = b, with the heights at its two sides. */
export const strip = (a: number, b: number, ya: number, yb: number, tone: Tone = "result"): PlaneMark[] => [
  shape(
    [
      [a, 0],
      [a, ya],
      [b, yb],
      [b, 0],
    ],
    tone,
  ),
  {
    kind: "path",
    points: [
      [a, 0],
      [a, ya],
      [b, yb],
      [b, 0],
    ],
  },
];

/** sum draws the n rectangles of a left, right or midpoint sum of f on [a, b]. */
export function sum(f: Fn, a: number, b: number, n: number, rule: "left" | "right" | "mid", tone: Tone = "result"): PlaneMark[] {
  const d = (b - a) / n;
  const offset = rule === "left" ? 0 : rule === "right" ? 1 : 0.5;
  return Array.from({ length: n }, (_, i) => {
    const h = f(a + (i + offset) * d);
    return strip(a + i * d, a + (i + 1) * d, h, h, tone);
  }).flat();
}

/** traps draws the n trapezoids of the trapezoidal rule of f on [a, b]. */
export function traps(f: Fn, a: number, b: number, n: number, tone: Tone = "result"): PlaneMark[] {
  const d = (b - a) / n;
  return Array.from({ length: n }, (_, i) => strip(a + i * d, a + (i + 1) * d, f(a + i * d), f(a + (i + 1) * d), tone)).flat();
}

/** tangent is the line through a point with a slope. */
export const tangent = (p: Point, m: number, tone: Tone = "action", dashed = false): PlaneMark => ln(p, [p[0] + 1, p[1] + m], tone, dashed);

/** joined is the broken line through points of the plane. */
export const joined = (points: readonly Point[], tone?: Tone, dashed = false): PlaneMark => ({
  kind: "path",
  points,
  ...(tone && { tone }),
  ...(dashed && { dashed }),
});

/** head is a straight arrow from a to b in a drawing without axes. */
export const head = (a: Point, b: Point, s?: Tone): Mark[] => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const [ux, uy] = [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
  const barb = (side: number): Point => [b[0] - 0.28 * ux + side * 0.14 * uy, b[1] - 0.28 * uy - side * 0.14 * ux];
  return [seg(a, b, s), seg(b, barb(1), s), seg(b, barb(-1), s)];
};

/** lines is the function whose graph joins the given points, in order of x. */
export const lines =
  (points: readonly Point[]): Fn =>
  (x) => {
    for (let i = 1; i < points.length; i++) {
      const [a, b] = [points[i - 1] as Point, points[i] as Point];
      if (x <= b[0]) return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);
    }
    return (points[points.length - 1] as Point)[1];
  };

/** bars adds the n rectangles of a left, right or midpoint sum of f on [a, b] to a pane. */
export function bars(p: Pane, f: Fn, a: number, b: number, n: number, rule: "left" | "right" | "mid", s: Tone = "result"): Pane {
  const d = (b - a) / n;
  const offset = rule === "left" ? 0 : rule === "right" ? 1 : 0.5;
  for (let i = 0; i < n; i++) {
    const [l, r, h] = [a + i * d, a + (i + 1) * d, f(a + (i + offset) * d)];
    p.under(() => h, l, r, s).path(
      [
        [l, 0],
        [l, h],
        [r, h],
        [r, 0],
      ],
      s,
    );
  }
  return p;
}

/** slabs adds the n trapezoids of the trapezoidal rule of f on [a, b] to a pane. */
export function slabs(p: Pane, f: Fn, a: number, b: number, n: number, s: Tone = "result"): Pane {
  const d = (b - a) / n;
  for (let i = 0; i < n; i++) {
    const [l, r] = [a + i * d, a + (i + 1) * d];
    const top: Point[] = [
      [l, f(l)],
      [r, f(r)],
    ];
    p.under(lines(top), l, r, s).path([[l, 0], ...top, [r, 0]], s);
  }
  return p;
}

/** can is the outline of a cylinder standing on the base at height y, with or without a lid. */
export function can(r: number, h: number, c: Point = [0, 0], lid = true): Mark[] {
  const oval = (y: number, from: number, to: number): Point[] =>
    Array.from({ length: 37 }, (_, i): Point => {
      const a = ((from + ((to - from) * i) / 36) * Math.PI) / 180;
      return [c[0] + r * Math.cos(a), y + 0.25 * r * Math.sin(a)];
    });
  return [
    seg([c[0] - r, c[1]], [c[0] - r, c[1] + h]),
    seg([c[0] + r, c[1]], [c[0] + r, c[1] + h]),
    ...chain(oval(c[1], 180, 360)),
    ...chain(oval(c[1], 0, 180), undefined, true),
    ...chain(oval(c[1] + h, 180, 360)),
    ...chain(oval(c[1] + h, 0, 180), undefined, !lid),
  ];
}

/** between is the shaded region between the graphs of f and g, from a to b. */
export const between = (f: Fn, g: Fn, a: number, b: number, tone: Tone = "result"): PlaneMark => {
  const at = (h: Fn, i: number): Point => [a + ((b - a) * i) / 60, h(a + ((b - a) * i) / 60)];
  const n = Array.from({ length: 61 }, (_, i) => i);
  return shape([...n.map((i) => at(f, i)), ...n.reverse().map((i) => at(g, i))], tone);
};

/** polarPts lists points of the polar curve r(θ) for θ from a to b. */
export const polarPts = (r: Fn, a: number, b: number, n = 160): Point[] =>
  Array.from({ length: n + 1 }, (_, i): Point => {
    const t = a + ((b - a) * i) / n;
    return [r(t) * Math.cos(t), r(t) * Math.sin(t)];
  });

/** sector is the shaded region swept from the pole by the polar curve r(θ) for θ from a to b. */
export const sector = (r: Fn, a: number, b: number, tone: Tone = "result"): PlaneMark => shape([[0, 0], ...polarPts(r, a, b)], tone);

/** polarBand is the shaded region between the polar curves outer and inner for θ from a to b. */
export const polarBand = (outer: Fn, inner: Fn, a: number, b: number, tone: Tone = "result"): PlaneMark =>
  shape([...polarPts(outer, a, b), ...polarPts(inner, a, b).reverse()], tone);

/** hoop is an ellipse with its center at c: a circle seen at a slant. */
export const hoop = (c: Point, rx: number, ry: number, tone?: Tone, dashed = false): PlaneMark =>
  joined(
    Array.from({ length: 73 }, (_, i): Point => [c[0] + rx * Math.cos((i * Math.PI) / 36), c[1] + ry * Math.sin((i * Math.PI) / 36)]),
    tone,
    dashed,
  );

/** aboutX draws the region between y = f(x) and the line y = c rotated about that line: the curve, its mirror image, the end circle and one slice. */
export function aboutX(f: Fn, a: number, b: number, c: number, at: number): PlaneMark[] {
  const r = (x: number): number => Math.abs(f(x) - c);
  return [
    between(f, () => c, a, b),
    curveOf(f, undefined, a, b),
    curveOf((x) => 2 * c - f(x), undefined, a, b, true),
    hoop([b, c], 0.3 * r(b), r(b)),
    hoop([at, c], 0.3 * r(at), r(at), "action"),
    joined(
      [
        [at, c],
        [at, f(at)],
      ],
      "action",
    ),
  ];
}

/** aboutY draws the region between x = g(y) and the y-axis rotated about that axis: the curve, its mirror image, the end circle and one slice. */
export function aboutY(g: Fn, c: number, d: number, at: number): PlaneMark[] {
  const ys = Array.from({ length: 61 }, (_, i) => c + ((d - c) * i) / 60);
  return [
    shape([[0, c], ...ys.map((y): Point => [g(y), y]), [0, d]], "result"),
    joined(ys.map((y): Point => [g(y), y])),
    joined(
      ys.map((y): Point => [-g(y), y]),
      undefined,
      true,
    ),
    hoop([0, d], g(d), 0.3 * g(d)),
    hoop([0, at], g(at), 0.3 * g(at), "action"),
    joined(
      [
        [0, at],
        [g(at), at],
      ],
      "action",
    ),
  ];
}

/** p3 is where the point (x, y, z) of a solid lands in a drawing: x runs across, y runs back at a slant, and z runs up, all scaled by k. */
export const p3 = (x: number, y: number, z: number, k = 3): Point => [k * (x + 0.6 * y), k * (z + 0.45 * y)];

/** sections draws a base outline in the xy-plane and cross sections standing on it: each cut is a chord from y = lo to y = hi at x, and cross gives the outline of the section on a chord of width w, as points (along the chord, height). */
export function sections(
  outline: readonly Point[],
  cuts: readonly (readonly [x: number, lo: number, hi: number])[],
  cross: (w: number) => readonly Point[],
  k = 3,
): Mark[] {
  const closed = (p: readonly Point[]): Point[] => [...p, p[0] as Point];
  return [
    ...chain(closed(outline.map((p) => p3(p[0], p[1], 0, k)))),
    ...cuts.flatMap(([x, lo, hi]): Mark[] => {
      const points = cross(hi - lo).map((p) => p3(x, lo + p[0], p[1], k));
      return [{ kind: "shade", points, tone: "result" }, ...chain(closed(points), "result")];
    }),
  ];
}

/** field gives the short segments of a slope field at the grid points, in the tone chosen for each by mark. */
export const field = (
  slope: (x: number, y: number) => number,
  xs: readonly number[],
  ys: readonly number[],
  len = 0.5,
  mark: (x: number, y: number) => Tone | undefined = () => undefined,
): PlaneMark[] =>
  xs.flatMap((x) =>
    ys.map((y) => {
      const m = slope(x, y);
      const dx = len / 2 / Math.hypot(1, m);
      return joined(
        [
          [x - dx, y - m * dx],
          [x + dx, y + m * dx],
        ],
        mark(x, y),
      );
    }),
  );

/** count lists the numbers from a to b in steps of d. */
export const count = (a: number, b: number, d = 1): number[] => Array.from({ length: Math.round((b - a) / d) + 1 }, (_, i) => a + i * d);
