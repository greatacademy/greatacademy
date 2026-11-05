// More drawings in the explanations of Precalculus: vectors, hyperbolas, parametric curves, polar coordinates, complex numbers,
// inverse trigonometric functions and statistics, with every coordinate computed from the numbers in the alt text.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { chain, chart, curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { bare, circleAxes, conic, thick, trail, wide } from "./explanation-drawings-curves.ts";
import { ln, pt, shape, shift } from "./explanation-drawings-geometry-2.ts";
import { angle, bend, dotAt, drawing, graphed, note, on, seg, square } from "./explanation-drawings-kit.ts";

const { PI: pi, atan, cos, cosh, exp, hypot, sin, sinh, sqrt } = Math;
const rad = (d: number): number => (d * pi) / 180;
const deg = (r: number): number => (r * 180) / pi;
const polar = (r: number, d: number): Point => [r * cos(rad(d)), r * sin(rad(d))];
const O: Point = [0, 0];
type Tone = "action" | "result";
type F = (x: number, y: number) => number;

const arc = (degrees: number, r = 1, start = 0, tone: Tone = "action", c: Point = O): PlaneMark => ({
  kind: "turn",
  center: c,
  from: [c[0] + r * cos(rad(start)), c[1] + r * sin(rad(start))],
  degrees,
  tone,
});
const dash = (a: Point, b: Point, tone?: Tone): PlaneMark => ({ kind: "path", points: [a, b], dashed: true, ...(tone && { tone }) });
const round = (c: Point, r: number, tone?: Tone, dashed = false): PlaneMark => ({
  kind: "circle",
  center: c,
  r,
  ...(tone && { tone }),
  ...(dashed && { dashed }),
});
const corner = (p: Point, u: Point, v: Point, s = 0.25): PlaneMark => {
  const unit = (w: Point): Point => [w[0] / hypot(w[0], w[1]), w[1] / hypot(w[0], w[1])];
  const [a, b] = [unit(u), unit(v)];
  return {
    kind: "path",
    points: [
      [p[0] + s * a[0], p[1] + s * a[1]],
      [p[0] + s * (a[0] + b[0]), p[1] + s * (a[1] + b[1])],
      [p[0] + s * b[0], p[1] + s * b[1]],
    ],
  };
};
const sideways =
  (h: number, k: number, a: number, b: number): F =>
  (x, y) =>
    ((x - h) / a) ** 2 - ((y - k) / b) ** 2 - 1;
const upward =
  (h: number, k: number, a: number, b: number): F =>
  (x, y) =>
    ((y - k) / a) ** 2 - ((x - h) / b) ** 2 - 1;
const complex = (lo: number, hi: number, yLo: number, yHi: number, every = 1): PlaneView => wide(lo, hi, yLo, yHi, every, 1, "Re", "Im");

/** a segment with an arrowhead, for drawings without axes */
const head = (a: Point, b: Point, s?: Tone): Mark[] => {
  const l = hypot(b[0] - a[0], b[1] - a[1]);
  const [ux, uy] = [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
  const barb = (side: number): Point => [b[0] - 0.28 * ux + side * 0.14 * uy, b[1] - 0.28 * uy - side * 0.14 * ux];
  return [seg(a, b, s), seg(b, barb(1), s), seg(b, barb(-1), s)];
};

/** where the unit vectors land in a right-angle rotation, drawn twice their size with their true coordinates as labels */
const turned = (dx: number, degrees: number): Mark[] => {
  const round0 = (v: number): number => Math.round(v);
  const e1 = [round0(cos(rad(degrees))), round0(sin(rad(degrees)))] as const;
  const e2 = [-e1[1], e1[0]] as const;
  const name = (v: readonly [number, number]): string => `(${String(v[0]).replace("-", "−")}, ${String(v[1]).replace("-", "−")})`;
  const dirOf = (v: readonly [number, number]) => (v[0] > 0 ? "e" : v[0] < 0 ? "w" : v[1] > 0 ? "n" : "s") as "e" | "w" | "n" | "s";
  return shift(
    [
      seg([-2.6, 0], [2.6, 0]),
      seg([0, -2.6], [0, 2.6]),
      ...head(O, [2 * e1[0], 2 * e1[1]], "result"),
      ...head(O, [2 * e2[0], 2 * e2[1]], "action"),
      note([2 * e1[0], 2 * e1[1]], "e₁", dirOf(e1)),
      note([2 * e2[0], 2 * e2[1]], "e₂", dirOf(e2)),
      note([0, -3.8], `${degrees}°`, "s"),
      note([0, -4.8], `e₁ → ${name(e1)}`, "s"),
      note([0, -5.8], `e₂ → ${name(e2)}`, "s"),
    ],
    dx,
  );
};

/** a small chart of residuals with a dashed zero line */
const residuals = (dx: number, points: readonly Point[], label: string): Mark[] => {
  const c = chart({ x: [0, 9, 9], y: [-3, 3, 3], xName: "x", yName: "e", w: 3.8, h: 3.2 });
  return shift(
    [...c.marks, ...points.flatMap((p) => dotAt(c.at(p[0], p[1]), undefined, "n", "result")), note(c.at(4.5, -3.8), label, "s")],
    dx,
  );
};
const xs = [1, 2, 3, 4, 5, 6, 7, 8];
const curved = (s: number): Point[] => xs.map((x): Point => [x, s * (0.25 * (x - 4.5) ** 2 - 1.5)]);

/** the axes of an inverse ratio drawing, with its principal range drawn as a double arc */
const range = (from: number, to: number): Mark[] => [
  ...circleAxes(3),
  ...bend(from, to, 3, O, "result"),
  ...bend(from, to, 3.15, O, "result"),
];

/** precalculusDrawings4 are more drawings in the explanations of Precalculus, by topic and knowledge point. */
export const precalculusDrawings4: Readonly<Record<string, Figure>> = {
  "parallel-vectors#collinearity-condition": graphed(
    wide(-1, 7, -1, 5),
    [
      toward(O, [2, 1]),
      toward([0, 2], [4, 4], "result"),
      toward([4, 0], [5, 3], "action"),
      tag([2, 1], "v = ⟨2, 1⟩", "se"),
      tag([2, 3], "u = ⟨4, 2⟩", "nw"),
      tag([5, 3], "w = ⟨1, 3⟩", "ne"),
    ],
    "For example, u = ⟨4, 2⟩ = 2v for v = ⟨2, 1⟩, so u and v are parallel. No k gives w = ⟨1, 3⟩ = kv, since the first components need k = 1/2 and the second k = 3.",
    "例如，对 v = ⟨2, 1⟩，u = ⟨4, 2⟩ = 2v，所以 u 与 v 平行。没有 k 使 w = ⟨1, 3⟩ = kv，因为第一分量要 k = 1/2，第二分量要 k = 3。",
  ),
  "linear-combinations-of-vectors-and-their-properties#the-coefficient-of-a-vector-written-in-terms-of-two-others": graphed(
    wide(-1, 8, -1, 6),
    [
      toward(O, [4, 2], "action"),
      toward([4, 2], [7, 5], "action"),
      toward(O, [7, 5], "result"),
      toward(O, [2, 1]),
      toward(O, [1, 1]),
      tag([2, 1], "p", "se"),
      tag([1, 1], "q", "nw"),
      tag([3.4, 1.7], "2p", "se"),
      tag([5.5, 3.5], "3q", "se"),
      tag([7, 5], "w = ⟨7, 5⟩", "n"),
    ],
    "For example, w = ⟨7, 5⟩ with p = ⟨2, 1⟩ and q = ⟨1, 1⟩: the components give 2a + b = 7 and a + b = 5, so a = 2, b = 3 and w = 2p + 3q.",
    "例如，w = ⟨7, 5⟩，p = ⟨2, 1⟩，q = ⟨1, 1⟩：比较分量得 2a + b = 7 和 a + b = 5，所以 a = 2、b = 3，w = 2p + 3q。",
  ),
  "calculating-the-direction-of-cartesian-vectors-in-2d#direction-angle-quadrant-i-and-axes": graphed(
    wide(-5, 5, -5, 5),
    [
      toward(O, [3, 4], "result"),
      arc(deg(atan(4 / 3)), 1.2),
      toward(O, [4, 0]),
      toward(O, [0, 4]),
      toward(O, [-4, 0]),
      toward(O, [0, -4]),
      tag([3, 4], "⟨3, 4⟩", "ne"),
      tag(polar(1.5, 25), "θ ≈ 53.1°", "e"),
      tag([4, 0], "0°", "n"),
      tag([0, 4], "90°", "w"),
      tag([-4, 0], "180°", "n"),
      tag([0, -4], "270°", "e"),
    ],
    "For example, ⟨3, 4⟩ in Quadrant I has θ = arctan(4/3) ≈ 53.1°. A vector along an axis has θ = 0°, 90°, 180° or 270°, by the way it points.",
    "例如，第一象限的 ⟨3, 4⟩ 有 θ = arctan(4/3) ≈ 53.1°。沿坐标轴的向量按其指向有 θ = 0°、90°、180° 或 270°。",
  ),
  "calculating-a-vector-projection#vector-projection-formula": graphed(
    wide(-1, 5, -1, 4),
    [
      toward(O, [3, 1]),
      toward(O, [1, 3], "action"),
      toward(O, [1.8, 0.6], "result"),
      dash([1, 3], [1.8, 0.6]),
      corner([1.8, 0.6], [-3, -1], [-0.8, 2.4]),
      tag([3, 1], "v = ⟨3, 1⟩", "e"),
      tag([1, 3], "u = ⟨1, 3⟩", "e"),
      tag([2.1, 0.3], "⟨1.8, 0.6⟩", "e"),
    ],
    "For example, u = ⟨1, 3⟩ and v = ⟨3, 1⟩: u · v = 6 and v · v = 10, so proj_v u = (6/10)v = ⟨1.8, 0.6⟩, along v, at the foot of the perpendicular from u.",
    "例如，u = ⟨1, 3⟩、v = ⟨3, 1⟩：u · v = 6，v · v = 10，所以 proj_v u = (6/10)v = ⟨1.8, 0.6⟩，沿 v 方向，落在从 u 所作垂线的垂足处。",
  ),
  "dilations-and-reflections-as-linear-transformations#reflecting-twice": graphed(
    wide(-5, 5, -4, 4),
    [
      toward([3, 2], [3, -2], "action"),
      toward([3, -2], [-3, -2], "action"),
      dash([3, 2], [-3, -2], "result"),
      pt([3, 2], "(3, 2)", "ne"),
      pt([3, -2], "(3, −2)", "se", "action"),
      pt([-3, -2], "(−3, −2)", "sw", "result"),
    ],
    "For example, (3, 2) reflects in the x-axis to (3, −2), and then in the y-axis to (−3, −2): the same as a half turn about the origin. Reflecting (3, −2) in the x-axis again would return it to (3, 2).",
    "例如，(3, 2) 关于 x 轴反射到 (3, −2)，再关于 y 轴反射到 (−3, −2)：相当于绕原点转半圈。把 (3, −2) 再关于 x 轴反射一次，又回到 (3, 2)。",
  ),
  "right-angle-rotations-as-linear-transformations#matrices-for-right-angle-rotations": drawing(
    [...turned(0, 90), ...turned(8.5, 180), ...turned(17, 270)],
    "The images of the unit vectors e₁ = (1, 0) and e₂ = (0, 1) are the columns of each matrix: (0, 1) and (−1, 0) by 90°, (−1, 0) and (0, −1) by 180°, (0, −1) and (1, 0) by 270°.",
    "单位向量 e₁ = (1, 0) 和 e₂ = (0, 1) 的像就是各矩阵的列：转 90° 时为 (0, 1) 和 (−1, 0)，转 180° 时为 (−1, 0) 和 (0, −1)，转 270° 时为 (0, −1) 和 (1, 0)。",
  ),
  "rotations-as-linear-transformations#general-rotation-matrix-formula": graphed(
    wide(-2, 2, -1, 2, 1, 1),
    [
      round(O, 1, undefined, true),
      toward(O, polar(1, 30), "result"),
      toward(O, polar(1, 120), "action"),
      arc(30, 0.45),
      arc(30, 0.45, 90),
      tag(polar(1, 30), "(cos θ, sin θ)", "e"),
      tag(polar(1, 120), "(−sin θ, cos θ)", "nw"),
      tag([0.55, 0.12], "30°", "e"),
      tag(polar(0.55, 105), "30°", "n"),
    ],
    "For example, θ = 30°: (1, 0) lands at (cos 30°, sin 30°) = (√3/2, 1/2), the first column, and (0, 1) lands at (−sin 30°, cos 30°) = (−1/2, √3/2), the second column.",
    "例如，θ = 30°：(1, 0) 落在 (cos 30°, sin 30°) = (√3/2, 1/2)，即第一列；(0, 1) 落在 (−sin 30°, cos 30°) = (−1/2, √3/2)，即第二列。",
  ),
  "equations-of-hyperbolas-centered-at-the-origin#asymptotes-of-a-hyperbola": graphed(
    wide(-10, 10, -6, 6, 2),
    [
      conic(sideways(0, 0, 2, 1)),
      ln(O, [2, 1], "action", true),
      ln(O, [2, -1], "action", true),
      pt([8, sqrt(15)], "(8, √15)", "se", "result"),
      tag([8, 4], "y = x/2", "nw"),
    ],
    "For example, x²/4 − y² = 1 approaches y = ±x/2. At x = 8 the curve is at height √15 ≈ 3.87, and the line at 4.",
    "例如，x²/4 − y² = 1 趋近 y = ±x/2。在 x = 8 处，曲线高度为 √15 ≈ 3.87，直线高度为 4。",
  ),
  "equations-of-hyperbolas-centered-at-a-general-point#standard-form-with-center-h-k-hyperbola": graphed(
    wide(-7, 14, -6, 8, 2),
    [
      trail((t) => [2 + 3 * cosh(t), 1 + 2 * sinh(t)], -2, 2),
      trail((t) => [2 - 3 * cosh(t), 1 + 2 * sinh(t)], -2, 2),
      trail((t) => [2 + 2 * sinh(t), 1 + 3 * cosh(t)], -1.9, 1.9, undefined, true),
      trail((t) => [2 + 2 * sinh(t), 1 - 3 * cosh(t)], -1.9, 1.9, undefined, true),
      pt([2, 1], "(2, 1)", "n"),
      pt([-1, 1], "(−1, 1)", "w", "result"),
      pt([5, 1], "(5, 1)", "e", "result"),
      pt([2, 4], "(2, 4)", "s", "action"),
      pt([2, -2], "(2, −2)", "n", "action"),
      tag([6.8, 3], "x-term positive", "e"),
      tag([2, -6], "y-term positive", "n"),
    ],
    "For example, center (2, 1): the solid (x − 2)²/9 − (y − 1)²/4 = 1 opens left and right, with vertices (−1, 1) and (5, 1). The dashed (y − 1)²/9 − (x − 2)²/4 = 1 opens up and down, with vertices (2, 4) and (2, −2).",
    "例如，中心 (2, 1)：实线 (x − 2)²/9 − (y − 1)²/4 = 1 向左右开口，顶点为 (−1, 1) 和 (5, 1)。虚线 (y − 1)²/9 − (x − 2)²/4 = 1 向上下开口，顶点为 (2, 4) 和 (2, −2)。",
  ),
  "asymptotes-of-hyperbolas-centered-at-a-general-point#asymptotes-of-translated-vertical-hyperbolas": graphed(
    wide(-9, 5, -7, 9, 2),
    [
      conic(upward(-2, 1, 3, 2)),
      ln([-2, 1], [-1, 2.5], "action", true),
      ln([-2, 1], [-1, -0.5], "action", true),
      pt([-2, 1], "(−2, 1)", "w", "result"),
    ],
    "For example, (y − 1)²/9 − (x + 2)²/4 = 1 has asymptotes y − 1 = ±(3/2)(x + 2), through the center (−2, 1): the slopes are ±3/2, the square root under the positive term over the other.",
    "例如，(y − 1)²/9 − (x + 2)²/4 = 1 的渐近线是 y − 1 = ±(3/2)(x + 2)，过中心 (−2, 1)：斜率 ±3/2 是正项下的平方根除以另一个。",
  ),
  "conjugate-axes-of-hyperbolas#length-of-the-conjugate-axis": graphed(
    wide(-7, 7, -5, 5),
    [
      conic(sideways(0, 0, 2, 3)),
      thick([0, -3], [0, 3]),
      thick([-2, 0], [2, 0], "action"),
      pt([0, 3], "(0, 3)", "e", "result"),
      pt([0, -3], "(0, −3)", "e", "result"),
      tag([0, 1.5], "6", "e"),
    ],
    "For example, x²/4 − y²/9 = 1 has b = 3, so its conjugate axis, perpendicular to the transverse axis at the center, runs from (0, −3) to (0, 3) and has length 2b = 6.",
    "例如，x²/4 − y²/9 = 1 的 b = 3，所以共轭轴在中心与实轴垂直，从 (0, −3) 到 (0, 3)，长为 2b = 6。",
  ),
  "foci-of-hyperbolas#foci-of-translated-hyperbolas": graphed(
    wide(-8, 10, -7, 5, 2),
    [
      conic(sideways(1, -1, 4, 3)),
      thick([1, -1], [6, -1], "action"),
      pt([1, -1], "(1, −1)", "se"),
      pt([6, -1], "(6, −1)", "se", "result"),
      pt([-4, -1], "(−4, −1)", "sw", "result"),
    ],
    "For example, (x − 1)²/16 − (y + 1)²/9 = 1 has c = √(16 + 9) = 5, so its foci are (1 ± 5, −1): (6, −1) and (−4, −1).",
    "例如，(x − 1)²/16 − (y + 1)²/9 = 1 的 c = √(16 + 9) = 5，所以焦点是 (1 ± 5, −1)，即 (6, −1) 和 (−4, −1)。",
  ),
  "parametric-equations-of-ellipses#ellipse-axes-and-eccentric-angle": graphed(
    wide(-6, 6, -6, 6),
    [
      round(O, 5, undefined, true),
      trail((t) => [5 * cos(t), 3 * sin(t)], 0, 2 * pi),
      thick(O, polar(5, 60), "action"),
      thick(O, [2.5, 3 * sin(rad(60))]),
      dash(polar(5, 60), [2.5, 0]),
      arc(60, 1.6),
      pt([2.5, 3 * sin(rad(60))], "P", "e", "result"),
      tag(polar(2, 72), "60°", "n"),
    ],
    "For example, x = 5 cos θ, y = 3 sin θ at θ = 60°: the angle 60° belongs to the point on the circle of radius 5. P = (2.5, 2.60) lies below it, and its angle from the origin is about 46.1°, not 60°.",
    "例如，x = 5 cos θ、y = 3 sin θ，θ = 60°：60° 是半径 5 的辅助圆上的点的角。P = (2.5, 2.60) 在该点正下方，它与原点连线的角约为 46.1°，而不是 60°。",
  ),
  "parametric-equations-of-parabolas#standard-vertical-parabola-parametric": graphed(
    wide(-6, 6, -1, 6, 2),
    [
      trail((t) => [2 * t, t * t], -2.3, 2.3),
      pt([0, 0], "t = 0", "se", "result"),
      pt([2, 1], "t = 1", "se", "result"),
      pt([-2, 1], "t = −1", "sw", "result"),
      pt([4, 4], "t = 2", "se", "result"),
      pt([-4, 4], "t = −2", "sw", "result"),
      pt([0, 1], "focus", "ne", "action"),
    ],
    "For example, p = 1: x = 2t, y = t² traces x² = 4y, with focus (0, 1), through (0, 0), (±2, 1) and (±4, 4).",
    "例如，p = 1：x = 2t、y = t² 描出 x² = 4y，焦点 (0, 1)，经过 (0, 0)、(±2, 1) 和 (±4, 4)。",
  ),
  "parametric-equations-of-parabolas-centered-at-hk#shifted-vertical-parabola-parametric": graphed(
    wide(-5, 7, -4, 4),
    [
      trail((t) => [1 + 2 * t, -2 + t * t], -2.3, 2.3),
      pt([1, -2], "t = 0: (1, −2)", "se", "result"),
      pt([3, -1], "t = 1", "se", "result"),
      pt([-1, -1], "t = −1", "sw", "result"),
      pt([5, 2], "t = 2", "se", "result"),
      pt([-3, 2], "t = −2", "sw", "result"),
    ],
    "For example, h = 1, k = −2, p = 1: x = 1 + 2t, y = −2 + t² traces (x − 1)² = 4(y + 2), and t = 0 gives the vertex (1, −2).",
    "例如，h = 1、k = −2、p = 1：x = 1 + 2t、y = −2 + t² 描出 (x − 1)² = 4(y + 2)，t = 0 给出顶点 (1, −2)。",
  ),
  "parametric-equations-of-parabolas-centered-at-hk#shifted-horizontal-parabola-parametric": graphed(
    wide(-4, 4, -4, 6),
    [
      trail((t) => [-2 + t * t, 1 + 2 * t], -2.3, 2.3),
      pt([-2, 1], "t = 0: (−2, 1)", "w", "result"),
      pt([-1, 3], "t = 1", "nw", "result"),
      pt([-1, -1], "t = −1", "sw", "result"),
      pt([2, 5], "t = 2", "nw", "result"),
      pt([2, -3], "t = −2", "sw", "result"),
    ],
    "For example, h = −2, k = 1, p = 1: x = −2 + t², y = 1 + 2t traces (y − 1)² = 4(x + 2), and t = 0 gives the vertex (−2, 1).",
    "例如，h = −2、k = 1、p = 1：x = −2 + t²、y = 1 + 2t 描出 (y − 1)² = 4(x + 2)，t = 0 给出顶点 (−2, 1)。",
  ),
  "converting-from-polar-coordinates-to-cartesian-coordinates#cartesian-to-polar": graphed(
    wide(-5, 3, -5, 3),
    [
      thick(O, polar(4, 240)),
      dash(polar(4, 240), [-2, 0]),
      arc(240, 0.7),
      arc(60, 1.7, 180, "result"),
      pt(polar(4, 240), "(−2, −2√3)", "w", "result"),
      tag([-1.08, -0.35], "α", "s"),
      tag([0.5, 0.6], "θ = 4π/3", "ne"),
      tag([-1.4, -2.6], "r = 4", "e"),
    ],
    "For example, (−2, −2√3): r = √(4 + 12) = 4 and α = arctan √3 = π/3. The point is in Quadrant III, so θ = π + π/3 = 4π/3.",
    "例如，(−2, −2√3)：r = √(4 + 12) = 4，α = arctan √3 = π/3。该点在第三象限，所以 θ = π + π/3 = 4π/3。",
  ),
  "polar-equations-of-circles-centered-at-the-origin#circle-at-origin-conversion": graphed(
    wide(-7, 7, -6, 6),
    [round(O, 5), thick(O, [3, 4], "action"), pt([3, 4], "(3, 4)", "ne", "result"), tag([1.5, 2], "r = 5", "nw")],
    "The polar circle r = 5 has Cartesian equation x² + y² = 25. For example, the point (3, 4) on it has 3² + 4² = 25, at distance 5 from the pole.",
    "极坐标圆 r = 5 的直角坐标方程是 x² + y² = 25。例如，圆上的点 (3, 4) 满足 3² + 4² = 25，到极点的距离为 5。",
  ),
  "polar-equations-of-radial-lines#radial-line-to-cartesian": graphed(
    wide(-4, 4, -5, 5),
    [
      ln(O, [1, sqrt(3)], "result"),
      arc(60, 0.7),
      thick(O, [2, 0], "action"),
      thick([2, 0], [2, 2 * sqrt(3)], "action"),
      pt([2, 2 * sqrt(3)], "(2, 2√3)", "e", "result"),
      tag([0.75, 0.35], "π/3", "e"),
      tag([2, 1.7], "2√3", "e"),
    ],
    "θ = π/3 is the line y = (tan π/3)x = √3 x. For example, it passes through (2, 2√3), where y/x = √3.",
    "θ = π/3 是直线 y = (tan π/3)x = √3 x。例如，它过点 (2, 2√3)，该处 y/x = √3。",
  ),
  "polar-equations-of-radial-lines#two-angles-for-one-line": graphed(
    wide(-5, 7, -4, 4),
    [
      ln(O, polar(1, 30), "result"),
      arc(30, 1.3),
      arc(210, 0.7),
      pt(polar(3, 30), "(3, 30°)", "nw", "result"),
      tag([3.2, 1.1], "= (−3, 210°)", "e"),
      tag(polar(1.5, 12), "30°", "e"),
      tag([-0.5, 0.6], "210°", "nw"),
    ],
    "For example, θ = 30° and θ = 210° describe the same line. The point at r = 3 on θ = 30° is also the point at r = −3 on θ = 210°.",
    "例如，θ = 30° 和 θ = 210° 表示同一条直线。θ = 30° 上 r = 3 的点也是 θ = 210° 上 r = −3 的点。",
  ),
  "finding-intersections-of-polar-curves#pole-as-polar-intersection": graphed(
    wide(-2, 3, -2, 3),
    [
      round([0, 1], 1, "action"),
      round([1, 0], 1),
      pt([1, 1], "(√2, π/4)", "ne", "result"),
      pt(O, "pole", "sw", "result"),
      tag([0, 2], "r = 2 sin θ", "ne"),
      tag([2, 0], "r = 2 cos θ", "se"),
    ],
    "For example, r = 2 sin θ and r = 2 cos θ: equating them finds only (√2, π/4). They also share the pole, reached at θ = 0 by the first and at θ = π/2 by the second.",
    "例如，r = 2 sin θ 和 r = 2 cos θ：令二者相等只得到 (√2, π/4)。它们还共有极点，第一条在 θ = 0 处经过，第二条在 θ = π/2 处经过。",
  ),
  "the-argument-of-a-complex-number#argument-quadrant-rules": graphed(
    complex(-7, 7, -5, 5),
    [
      toward(O, [4, 3], "result"),
      toward(O, [-4, 3], "result"),
      toward(O, [-4, -3], "result"),
      toward(O, [4, -3], "result"),
      tag([4, 3], "θ = α", "ne"),
      tag([-4, 3], "θ = 180° − α", "nw"),
      tag([-4, -3], "θ = 180° + α", "sw"),
      tag([4, -3], "θ = 360° − α", "se"),
    ],
    "For example, ±4 ± 3i all have reference angle α = arctan(3/4) ≈ 36.9°. Their arguments are about 36.9° in Quadrant I, 143.1° in II, 216.9° in III and 323.1° in IV.",
    "例如，±4 ± 3i 的参考角都是 α = arctan(3/4) ≈ 36.9°。它们的辐角约为：第一象限 36.9°，第二象限 143.1°，第三象限 216.9°，第四象限 323.1°。",
  ),
  "arithmetic-in-the-complex-plane#reading-a-sum-on-the-complex-plane": graphed(
    complex(-3, 6, -1, 6),
    [
      shape([O, [4, 1], [3, 4], [-1, 3]], "result"),
      pt([4, 1], "4 + i", "e"),
      pt([-1, 3], "−1 + 3i", "nw"),
      pt([3, 4], "3 + 4i", "ne", "result"),
    ],
    "For example, 4 + i and −1 + 3i add by parts to 3 + 4i, the fourth corner of the parallelogram with the origin.",
    "例如，4 + i 与 −1 + 3i 按实部、虚部相加得 3 + 4i，即与原点构成的平行四边形的第四个顶点。",
  ),
  "the-polar-form-of-a-complex-number#arguments-of-products-and-quotients": graphed(
    complex(-2, 2, -2, 2),
    [
      round(O, 1),
      pt(polar(1, 200), "z: 200°", "w"),
      pt(polar(1, 250), "w: 250°", "sw"),
      pt(polar(1, 90), "zw: 90°", "ne", "result"),
      pt(polar(1, 310), "z/w: 310°", "se", "action"),
    ],
    "For example, with modulus 1 and arguments 200° and 250°: zw has argument 450° − 360° = 90°, and z/w has −50° + 360° = 310°.",
    "例如，模为 1、辐角为 200° 和 250°：zw 的辐角是 450° − 360° = 90°，z/w 的辐角是 −50° + 360° = 310°。",
  ),
  "products-of-complex-numbers-expressed-in-polar-form#multiplication-rule-in-polar-form": graphed(
    complex(-3, 4, -1, 5),
    [
      toward(O, polar(2, 30), "action"),
      toward(O, polar(2, 60), "action"),
      toward(O, polar(4, 90), "result"),
      arc(30, 0.8),
      arc(60, 1.2, 30, "result"),
      tag(polar(2, 30), "2 cis 30°", "e"),
      tag(polar(2, 60), "2 cis 60°", "e"),
      tag(polar(4, 90), "4 cis 90°", "w"),
    ],
    "For example, 2 cis 30° times 2 cis 60°: the moduli multiply to 4 and the arguments add to 90°, giving 4 cis 90°.",
    "例如，2 cis 30° 乘 2 cis 60°：模相乘得 4，辐角相加得 90°，结果为 4 cis 90°。",
  ),
  "quotients-of-complex-numbers-expressed-in-polar-form#division-rule-in-polar-form": graphed(
    complex(-3, 8, -4, 4),
    [
      toward(O, polar(6, 30), "action"),
      toward(O, polar(2, 90), "action"),
      toward(O, polar(3, -60), "result"),
      arc(-60, 0.9),
      tag(polar(6, 30), "6 cis 30°", "e"),
      tag(polar(2, 90), "2 cis 90°", "e"),
      tag(polar(3, -60), "3 cis 300°", "e"),
    ],
    "For example, 6 cis 30° divided by 2 cis 90°: the moduli divide to 3 and the arguments subtract to −60°, so adding 360° gives 3 cis 300°.",
    "例如，6 cis 30° 除以 2 cis 90°：模相除得 3，辐角相减得 −60°，加 360° 得 3 cis 300°。",
  ),
  "de-moivres-theorem#powers-in-polar-form": graphed(
    complex(-5, 5, -1, 9),
    [
      toward(O, polar(2, 36), "action"),
      toward(O, polar(8, 108), "result"),
      arc(108, 1),
      tag(polar(2, 36), "2 cis π/5", "e"),
      tag(polar(8, 108), "8 cis 3π/5", "n"),
      tag(polar(1.3, 72), "3 · π/5", "ne"),
    ],
    "[2(cos π/5 + i sin π/5)]³ = 8(cos 3π/5 + i sin 3π/5): the modulus 2 is cubed to 8, and the argument π/5 is added three times to 3π/5.",
    "[2(cos π/5 + i sin π/5)]³ = 8(cos 3π/5 + i sin 3π/5)：模 2 立方得 8，辐角 π/5 加三次得 3π/5。",
  ),
  "the-roots-of-unity#counting-roots-of-unity": graphed(
    complex(-2, 2, -2, 2),
    [
      round(O, 1),
      pt([1, 0], "0°", "ne", "result"),
      pt([-1, 0], "180°", "nw", "result"),
      pt(polar(1, 45), "45°", "ne", "action"),
      pt(polar(1, 90), "90°", "ne", "action"),
      pt(polar(1, 135), "135°", "nw", "action"),
      bare(polar(1, 225)),
      bare(polar(1, 270)),
      bare(polar(1, 315)),
    ],
    "For n = 8 the roots sit every 45°: the 2 real ones at 0° and 180°, 3 with positive imaginary part at 45°, 90° and 135°, of which only 45° is strictly inside Quadrant I, and their 3 conjugates below.",
    "n = 8 时，根每隔 45° 一个：2 个实根在 0° 和 180°；3 个虚部为正的根在 45°、90° 和 135°，其中只有 45° 严格在第一象限内；另有它们的 3 个共轭在下方。",
  ),
  "square-roots-of-complex-numbers#square-roots-in-polar-form": graphed(
    complex(-7, 7, -4, 10, 2),
    [
      toward(O, polar(9, 100)),
      round(O, 3, undefined, true),
      toward(O, polar(3, 50), "result"),
      toward(O, polar(3, 230), "result"),
      tag(polar(9, 100), "w = 9 cis 100°", "w"),
      tag(polar(3, 50), "3 cis 50°", "e"),
      tag(polar(3, 230), "3 cis 230°", "w"),
    ],
    "w = 9 cis 100° has the square roots 3 cis 50° and 3 cis 230°, which are opposite each other on the circle of radius √9 = 3.",
    "w = 9 cis 100° 的平方根是 3 cis 50° 和 3 cis 230°，它们在半径 √9 = 3 的圆上彼此相对。",
  ),
  "elementary-trigonometric-equations-containing-sine#solutions-of-a-sine-equation-from-one-known-angle": graphed(
    wide(-2, 2, -2, 2),
    [
      round(O, 1),
      dash(polar(1, 40), polar(1, 140), "result"),
      dash(polar(1, 220), polar(1, 320), "action"),
      pt(polar(1, 40), "40°", "ne", "result"),
      pt(polar(1, 140), "140°", "nw", "result"),
      pt(polar(1, 220), "220°", "sw", "action"),
      pt(polar(1, 320), "320°", "se", "action"),
    ],
    "For example, with the known angle 40°: sin 140° = sin 40°, at 180° − 40°, and the opposite sine is at 180° + 40° = 220° and 360° − 40° = 320°.",
    "例如，已知角 40°：sin 140° = sin 40°，在 180° − 40° 处；相反的正弦值在 180° + 40° = 220° 和 360° − 40° = 320° 处。",
  ),
  "elementary-trigonometric-equations-containing-secant#solve-elementary-secant-equations-degrees": (() => {
    const c = chart({ x: [0, 360, 60], y: [-1, 1, 0.5], xName: "x", yName: "y", w: 8, h: 3.5 });
    return drawing(
      [
        ...c.marks,
        ...chain(Array.from({ length: 73 }, (_, i): Point => c.at(i * 5, cos(rad(i * 5))))),
        seg(c.at(0, 0.5), c.at(360, 0.5), "action", true),
        ...dotAt(c.at(60, 0.5), "60", "ne", "result"),
        ...dotAt(c.at(300, 0.5), "300", "nw", "result"),
      ],
      "sec x° = 2 means cos x° = 1/2: the cosine curve meets the line y = 1/2 at x = 60 and x = 300 on [0, 360).",
      "sec x° = 2 即 cos x° = 1/2：在 [0, 360) 上，余弦曲线与直线 y = 1/2 交于 x = 60 和 x = 300。",
    );
  })(),
  "evaluating-expressions-containing-inverse-trigonometric-functions#evaluating-arcsin-and-arccos-special": drawing(
    [
      ...range(-90, 90),
      seg(on(60, 3), [0, 3 * sin(rad(60))], "action", true),
      seg(O, on(60, 3)),
      ...dotAt(on(60, 3), "π/3", "ne", "result"),
      seg(O, [0, 3 * sin(rad(60))], "action"),
      note([0, 1.3], "√3/2", "w"),
      ...shift(
        [
          ...range(0, 180),
          seg(on(120, 3), [3 * cos(rad(120)), 0], "action", true),
          seg(O, on(120, 3)),
          ...dotAt(on(120, 3), "2π/3", "nw", "result"),
          note([3 * cos(rad(120)), 0], "−1/2", "s"),
        ],
        9,
      ),
    ],
    "arcsin(√3/2) = π/3 is the angle in the doubled right half, from −π/2 to π/2, at height √3/2. arccos(−1/2) = 2π/3 is the angle in the doubled upper half, from 0 to π, at x = −1/2.",
    "arcsin(√3/2) = π/3 是画成双线的右半圆（−π/2 到 π/2）上高度为 √3/2 的角。arccos(−1/2) = 2π/3 是画成双线的上半圆（0 到 π）上 x = −1/2 的角。",
  ),
  "evaluating-expressions-containing-inverse-trigonometric-functions#evaluating-arctan-special": graphed(
    wide(-5, 5, -3, 3, 10),
    [
      curveOf(atan),
      ln([0, pi / 2], [1, pi / 2], "action", true),
      ln([0, -pi / 2], [1, -pi / 2], "action", true),
      bare([1, pi / 4], "result"),
      tag([1.3, 0.42], "(1, π/4)", "e"),
      bare([-sqrt(3), -pi / 3], "result"),
      tag([-2, -0.55], "(−√3, −π/3)", "w"),
      tag([3.5, pi / 2], "y = π/2", "n"),
      tag([-3.5, -pi / 2], "y = −π/2", "s"),
    ],
    "y = arctan x stays between −π/2 and π/2: arctan(1) = π/4 and arctan(−√3) = −π/3.",
    "y = arctan x 始终介于 −π/2 和 π/2 之间：arctan(1) = π/4，arctan(−√3) = −π/3。",
  ),
  "further-evaluating-expressions-containing-inverse-trigonometric-functions#compositions-using-reference-triangles": drawing(
    [
      seg(O, [4, 0], "result"),
      seg([4, 0], [4, 3]),
      seg(O, [4, 3]),
      square([4, 0], O, [4, 3]),
      angle(O, [4, 0], [4, 3], "action", "θ"),
      note([2, 0], "adjacent 4", "s"),
      note([4, 1.5], "opposite 3", "e"),
      note([2, 1.5], "hypotenuse 5", "nw"),
    ],
    "With θ = arcsin(3/5), the opposite side is 3 and the hypotenuse is 5, so the adjacent side is √(5² − 3²) = 4 and cos θ = 4/5.",
    "设 θ = arcsin(3/5)，对边为 3，斜边为 5，所以邻边为 √(5² − 3²) = 4，cos θ = 4/5。",
  ),
  "further-evaluating-expressions-containing-inverse-trigonometric-functions#evaluating-inverse-trig-outside-principal-range": drawing(
    [
      ...range(-90, 90),
      seg(on(150, 3), on(30, 3), "action", true),
      seg(O, on(150, 3)),
      seg(O, on(30, 3), "result"),
      ...dotAt(on(150, 3), "5π/6", "nw"),
      ...dotAt(on(30, 3), "π/6", "ne", "result"),
    ],
    "5π/6 is outside the range of arcsin, the doubled right half. Its sine, 1/2, is shared by π/6, so arcsin(sin(5π/6)) = π/6.",
    "5π/6 不在 arcsin 的值域（画成双线的右半圆）内。它的正弦值 1/2 与 π/6 相同，所以 arcsin(sin(5π/6)) = π/6。",
  ),
  "the-empirical-rule-for-the-normal-distribution#the-empirical-rule-from-a-shaded-curve": (() => {
    const bell = (z: number): number => 3 * exp((-z * z) / 2);
    const between = (a: number, b: number): Point[] =>
      Array.from({ length: 41 }, (_, i): Point => [a + ((b - a) * i) / 40, bell(a + ((b - a) * i) / 40)]);
    const labels: readonly [number, string][] = [
      [-3, "−3σ"],
      [-2, "−2σ"],
      [-1, "−σ"],
      [0, "μ"],
      [1, "σ"],
      [2, "2σ"],
      [3, "3σ"],
    ];
    return drawing(
      [
        { kind: "shade", points: [[-1, 0], ...between(-1, 2), [2, 0]], tone: "result" },
        seg([-3.6, 0], [3.6, 0]),
        ...chain(between(-3.5, 3.5)),
        seg([0, 0], [0, bell(0)], undefined, true),
        ...labels.flatMap(([z, s]): Mark[] => [seg([z, -0.08], [z, 0.08]), note([z, -0.1], s, "s")]),
        note([-0.5, 0.9], "34%", "n"),
        note([0.85, 0.9], "47.5%", "n"),
      ],
      "For example, shading from one standard deviation below the mean to two above: half of 68% plus half of 95% is 34% + 47.5% = 81.5%.",
      "例如，阴影从均值下方一个标准差到上方两个标准差：68% 的一半加 95% 的一半，即 34% + 47.5% = 81.5%。",
    );
  })(),
  "residuals-and-residual-plots#reading-residual-plots": drawing(
    [
      ...residuals(
        0,
        [
          [1, 0.6],
          [2, -1],
          [3, -0.4],
          [4, 0.6],
          [5, 0.7],
          [6, -0.3],
          [7, 0.7],
          [8, -0.9],
        ],
        "no pattern",
      ),
      ...residuals(5.6, curved(1), "a curve"),
    ],
    "For example, residuals scattered above and below 0 with no pattern support a linear model. Residuals positive at both ends and negative in the middle form a curve, so the relationship is not linear.",
    "例如，残差在 0 上下散布、没有规律，说明线性模型合适。两端为正、中间为负的残差形成曲线，说明关系不是线性的。",
  ),
  "residuals-and-residual-plots#what-a-residual-plot-shows": drawing(
    [
      ...residuals(
        0,
        [
          [1, -0.7],
          [2, 0.9],
          [3, 0.2],
          [4, -1],
          [5, -0.4],
          [6, 0.5],
          [7, 0.8],
          [8, -0.3],
        ],
        "even",
      ),
      ...residuals(5.2, curved(-1), "curved"),
      ...residuals(
        10.4,
        xs.map((x, i): Point => [x, (i % 2 === 0 ? 1 : -1) * 0.33 * x]),
        "fans out",
      ),
    ],
    "For example, three residual plots: scattered evenly around zero, which supports the line; a curved band, so the relationship is not linear; and a band that fans out, so the spread changes with x.",
    "例如，三幅残差图：在零附近均匀散布，支持线性模型；呈弯曲的带状，说明关系不是线性的；呈扇形张开，说明离散程度随 x 变化。",
  ),
  "linear-regression#the-equation-of-a-drawn-regression-line": graphed(
    wide(-1, 8, -1, 6),
    [
      ln([0, 1], [6, 4]),
      ...(
        [
          [1, 2],
          [2, 1.2],
          [3, 2.8],
          [4, 3.3],
          [5, 2.7],
          [6, 4.5],
        ] as const
      ).map((p): PlaneMark => bare([p[0], p[1]])),
      pt([0, 1], "(0, 1)", "se", "result"),
      pt([6, 4], "(6, 4)", "se", "result"),
      tag([3, 5], "ŷ = 0.5x + 1", "n"),
    ],
    "For example, the line meets the vertical axis at (0, 1) and passes through (6, 4), so its slope is (4 − 1)/6 = 1/2 and ŷ = 0.5x + 1. The data points themselves lie off the line and are not used.",
    "例如，直线与纵轴交于 (0, 1)，并过 (6, 4)，所以斜率为 (4 − 1)/6 = 1/2，ŷ = 0.5x + 1。数据点本身不在直线上，不用于计算。",
  ),
  "quadratic-regression#predicting-with-a-quadratic-model": graphed(
    wide(-1, 9, -1, 10),
    [
      curveOf((x) => -0.5 * x * x + 4 * x + 1, undefined, -0.2, 8.2),
      dash([3, 0], [3, 8.5], "action"),
      pt([3, 8.5], "(3, 8.5)", "nw", "result"),
    ],
    "ŷ = −0.5x² + 4x + 1 at x = 3 gives −4.5 + 12 + 1 = 8.5.",
    "ŷ = −0.5x² + 4x + 1 在 x = 3 处得 −4.5 + 12 + 1 = 8.5。",
  ),
  "quadratic-regression#the-extreme-value-of-a-quadratic-model": graphed(
    wide(-1, 13, -1, 12),
    [
      curveOf((x) => -0.2 * x * x + 2.4 * x + 3, undefined, -1, 13),
      dash([6, 0], [6, 10.2], "action"),
      pt([6, 10.2], "(6, 10.2)", "n", "result"),
    ],
    "ŷ = −0.2x² + 2.4x + 3 has a < 0, so its vertex at x = −2.4/(−0.4) = 6 is a maximum, −7.2 + 14.4 + 3 = 10.2.",
    "ŷ = −0.2x² + 2.4x + 3 的 a < 0，所以顶点 x = −2.4/(−0.4) = 6 处是最大值，−7.2 + 14.4 + 3 = 10.2。",
  ),
  "semi-log-scatter-plots#transforming-data-points": graphed(
    wide(-1, 5, -1, 5, 1, 1, "x", "log y"),
    [
      dash([2, 0], [2, Math.log10(3000)], "action"),
      dash([0, Math.log10(3000)], [2, Math.log10(3000)], "action"),
      pt([2, Math.log10(3000)], "(2, 3.477)", "ne", "result"),
    ],
    "The data point (2, 3000) is plotted at (2, log 3000) ≈ (2, 3.477): x stays, and log 3000 = log 3 + 3.",
    "数据点 (2, 3000) 画在 (2, log 3000) ≈ (2, 3.477)：x 不变，log 3000 = log 3 + 3。",
  ),
};
