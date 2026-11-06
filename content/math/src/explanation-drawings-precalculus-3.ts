// Drawings in the explanations of Precalculus: ellipses, hyperbolas, parametric curves, polar coordinates and the complex plane,
// with every coordinate computed from the equation in the text, or from the example named in the alt text.

import type { Figure } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { tag, toward } from "./explanation-drawings-charts.ts";
import { bare, conic, thick, trail, upright, wide } from "./explanation-drawings-curves.ts";
import { ln, pt, shape } from "./explanation-drawings-geometry-2.ts";
import { graphed } from "./explanation-drawings-kit.ts";

const { PI: pi, cos, sin, sqrt } = Math;
const rad = (d: number): number => (d * pi) / 180;
const polar = (r: number, d: number): Point => [r * cos(rad(d)), r * sin(rad(d))];
const O: Point = [0, 0];
type F = (x: number, y: number) => number;

const ellipse = (h: number, k: number, a: number, b: number, tone?: "action" | "result"): PlaneMark =>
  trail((t) => [h + a * cos(t), k + b * sin(t)], 0, 2 * pi, tone);
/** the hyperbola opening left and right, as f(x, y) = 0 */
const sideways =
  (h: number, k: number, a: number, b: number): F =>
  (x, y) =>
    ((x - h) / a) ** 2 - ((y - k) / b) ** 2 - 1;
/** the hyperbola opening up and down, a going with y */
const upward =
  (h: number, k: number, a: number, b: number): F =>
  (x, y) =>
    ((y - k) / a) ** 2 - ((x - h) / b) ** 2 - 1;
/** the two lines through (h, k) with slopes ±m */
const pair = (h: number, k: number, m: number): PlaneMark[] => [
  ln([h, k], [h + 1, k + m], "action", true),
  ln([h, k], [h + 1, k - m], "action", true),
];
const box = (h: number, k: number, a: number, b: number): PlaneMark => ({
  kind: "path",
  points: [
    [h - a, k - b],
    [h + a, k - b],
    [h + a, k + b],
    [h - a, k + b],
    [h - a, k - b],
  ],
  dashed: true,
});
const dash = (a: Point, b: Point, tone?: "action" | "result"): PlaneMark => ({
  kind: "path",
  points: [a, b],
  dashed: true,
  ...(tone && { tone }),
});
const round = (c: Point, r: number, tone?: "action" | "result", dashed = false): PlaneMark => ({
  kind: "circle",
  center: c,
  r,
  ...(tone && { tone }),
  ...(dashed && { dashed }),
});
const arc = (deg: number, r = 1, start = 0, tone: "action" | "result" = "action", c: Point = O): PlaneMark => ({
  kind: "turn",
  center: c,
  from: [c[0] + r * cos(rad(start)), c[1] + r * sin(rad(start))],
  degrees: deg,
  tone,
});
const complex = (lo: number, hi: number, yLo: number, yHi: number): PlaneView => wide(lo, hi, yLo, yHi, 1, 1, "Re", "Im");

/** precalculusDrawings3 are drawings of conics, parametric curves, polar coordinates and complex numbers in Precalculus, by topic and knowledge point. */
export const precalculusDrawings3: Readonly<Record<string, Figure>> = {
  "introduction-to-ellipses#major-and-minor-axes": graphed(
    wide(-6, 6, -4, 4),
    [
      ellipse(0, 0, 5, 3),
      thick([-5, 0], [5, 0]),
      thick([0, -3], [0, 3], "action"),
      pt([-4, 0], "F", "n"),
      pt([4, 0], "F", "n"),
      tag([2.5, 0], "2a = 10", "n"),
      tag([0, 1.8], "2b = 6", "e"),
    ],
    "For example, with a = 5 and b = 3, the major axis through the foci has length 10 and the minor axis perpendicular to it at the center has length 6.",
    "例如，a = 5、b = 3 时，过焦点的长轴长为 10，在中心与之垂直的短轴长为 6。",
  ),
  "equations-of-ellipses-centered-at-a-general-point#standard-form-with-center-h-k": graphed(
    wide(-3, 7, -4, 2),
    [
      ellipse(2, -1, 4, 2),
      pt([2, -1], "(2, −1)", "sw", "result"),
      thick([2, -1], [6, -1]),
      thick([2, -1], [2, 1], "action"),
      tag([4, -1], "4", "n"),
      tag([2, 0.4], "2", "e"),
    ],
    "For example, (x − 2)²/16 + (y + 1)²/4 = 1 has center (2, −1), a horizontal semi-major axis of 4 and a semi-minor axis of 2.",
    "例如，(x − 2)²/16 + (y + 1)²/4 = 1 的中心是 (2, −1)，水平半长轴为 4，半短轴为 2。",
  ),
  "foci-of-ellipses#foci-of-shifted-ellipses": graphed(
    wide(-4, 6, -4, 8),
    [ellipse(1, 2, 3, 5), pt([1, 2], "(1, 2)", "e"), pt([1, 6], "(1, 6)", "e", "result"), pt([1, -2], "(1, −2)", "e", "result")],
    "For example, (x − 1)²/9 + (y − 2)²/25 = 1 has c = √(25 − 9) = 4 and a vertical major axis, so its foci are (1, 2 ± 4).",
    "例如，(x − 1)²/9 + (y − 2)²/25 = 1 的 c = √(25 − 9) = 4，长轴竖直，所以焦点是 (1, 2 ± 4)。",
  ),
  "foci-of-ellipses#the-perimeter-of-a-triangle-with-the-two-foci": graphed(
    wide(-6, 6, -5, 5),
    [
      ellipse(0, 0, 5, 4),
      shape(
        [
          [-3, 0],
          [3, 0],
          [3, 3.2],
        ],
        "result",
      ),
      pt([-3, 0], "F₁", "nw"),
      pt([3, 0], "F₂", "ne"),
      pt([3, 3.2], "P", "ne"),
    ],
    "For example, on x²/25 + y²/16 = 1, PF₁ + PF₂ = 2a = 10 for any P and F₁F₂ = 2c = 6, so the triangle's perimeter is 16.",
    "例如，在 x²/25 + y²/16 = 1 上，对任意 P 都有 PF₁ + PF₂ = 2a = 10，F₁F₂ = 2c = 6，所以三角形周长为 16。",
  ),
  "vertices-and-eccentricity-of-ellipses#geometric-meaning-of-eccentricity": graphed(
    wide(-5, 5, -5, 5),
    [
      ellipse(0, 0, 4, 4 * sqrt(1 - 0.04)),
      ellipse(0, 0, 4, 4 * sqrt(1 - 0.36), "action"),
      ellipse(0, 0, 4, 4 * sqrt(1 - 0.9025), "result"),
      tag([2.83, 2.77], "e = 0.2", "ne"),
      tag([1.5, 2.97], "e = 0.6", "s"),
      tag([2, 0.3], "e = 0.95", "n"),
    ],
    "Three ellipses with a = 4: at e = 0.2 it is nearly a circle, and at e = 0.95 it is long and narrow.",
    "三个 a = 4 的椭圆：e = 0.2 时几乎是圆，e = 0.95 时又长又窄。",
  ),
  "directrices-of-ellipses#equations-of-directrices-at-origin": graphed(
    wide(-10, 10, -5, 5, 5),
    [
      ellipse(0, 0, 5, 4),
      upright(25 / 3, "action"),
      upright(-25 / 3, "action"),
      pt([3, 0], "3", "n", "result"),
      pt([-3, 0], "−3", "n", "result"),
      tag([25 / 3, 3], "x = 25/3", "w"),
      tag([-25 / 3, 3], "x = −25/3", "e"),
    ],
    "For example, a = 5 and c = 3 give the directrices x = ±a²/c = ±25/3, outside the ellipse and perpendicular to its major axis.",
    "例如，a = 5、c = 3 得准线 x = ±a²/c = ±25/3，在椭圆外并与长轴垂直。",
  ),
  "the-area-of-an-ellipse#calculating-the-area-of-an-ellipse": graphed(
    wide(-6, 6, -4, 4),
    [
      shape(
        Array.from({ length: 72 }, (_, i): Point => [5 * cos((i * pi) / 36), 3 * sin((i * pi) / 36)]),
        "result",
      ),
      thick(O, [5, 0], "action"),
      thick(O, [0, 3], "action"),
      tag([2.5, 0], "a = 5", "n"),
      tag([0, 1.5], "b = 3", "e"),
    ],
    "For example, an ellipse with a = 5 and b = 3 has area π · 5 · 3 = 15π.",
    "例如，a = 5、b = 3 的椭圆面积是 π · 5 · 3 = 15π。",
  ),
  "asymptotes-of-hyperbolas-centered-at-the-origin#asymptotes-of-horizontal-hyperbolas": graphed(
    wide(-8, 8, -6, 6),
    [
      conic(sideways(0, 0, 4, 3)),
      ...pair(0, 0, 3 / 4),
      pt([4, 0], "(4, 0)", "ne", "result"),
      pt([-4, 0], "(−4, 0)", "nw", "result"),
      tag([6.5, 4.875], "y = ¾x", "nw"),
    ],
    "For example, x²/16 − y²/9 = 1 opens left and right, and approaches y = ±(3/4)x.",
    "例如，x²/16 − y²/9 = 1 向左右开口，并趋近 y = ±(3/4)x。",
  ),
  "asymptotes-of-hyperbolas-centered-at-the-origin#asymptotes-of-vertical-hyperbolas": graphed(
    wide(-6, 6, -7, 7),
    [
      conic(upward(0, 0, 3, 2)),
      ...pair(0, 0, 3 / 2),
      pt([0, 3], "(0, 3)", "e", "result"),
      pt([0, -3], "(0, −3)", "e", "result"),
      tag([3.5, 5.25], "y = (3/2)x", "e"),
    ],
    "For example, y²/9 − x²/4 = 1 opens up and down, and approaches y = ±(3/2)x.",
    "例如，y²/9 − x²/4 = 1 向上下开口，并趋近 y = ±(3/2)x。",
  ),
  "asymptotes-of-hyperbolas-centered-at-the-origin#asymptote-slopes-from-a-drawn-hyperbola": graphed(
    wide(-6, 6, -6, 6),
    [
      conic(sideways(0, 0, 2, 3)),
      ...pair(0, 0, 3 / 2),
      box(0, 0, 2, 3),
      thick(O, [2, 0]),
      thick([2, 0], [2, 3], "action"),
      tag([1, 0], "a = 2", "n"),
      tag([2, 1.5], "b = 3", "e"),
    ],
    "For example, vertices at distance a = 2 and a box of half-height b = 3 make the asymptotes pass through its corners, with slopes ±3/2.",
    "例如，顶点距中心 a = 2、盒子半高 b = 3，渐近线过盒子的角，斜率为 ±3/2。",
  ),
  "asymptotes-of-hyperbolas-centered-at-a-general-point#asymptotes-of-translated-horizontal-hyperbolas": graphed(
    wide(-7, 11, -7, 5, 2),
    [conic(sideways(2, -1, 3, 2)), ...pair(2, -1, 2 / 3), bare([2, -1], "result"), tag([2, -1.6], "(2, −1)", "s")],
    "For example, (x − 2)²/9 − (y + 1)²/4 = 1 has asymptotes y + 1 = ±(2/3)(x − 2), through the center (2, −1) with the same slopes as before the shift.",
    "例如，(x − 2)²/9 − (y + 1)²/4 = 1 的渐近线是 y + 1 = ±(2/3)(x − 2)，过中心 (2, −1)，斜率与平移前相同。",
  ),
  "asymptotes-of-hyperbolas-centered-at-a-general-point#the-center-of-a-hyperbola-from-its-asymptotes": graphed(
    wide(-3, 5, -3, 9),
    [
      conic(sideways(1, 3, 1, 2)),
      ln([0, 1], [1, 3], "action", true),
      ln([0, 5], [1, 3], "action", true),
      bare([1, 3], "result"),
      tag([1, 5], "(1, 3)", "n"),
      tag([3, 7], "y = 2x + 1", "e"),
      tag([-1, 7], "y = −2x + 5", "w"),
    ],
    "For example, y = 2x + 1 and y = −2x + 5 cross where 4x = 4: at x = 1, y = 3, so the center is (1, 3).",
    "例如，y = 2x + 1 与 y = −2x + 5 相交于 4x = 4：x = 1、y = 3，所以中心是 (1, 3)。",
  ),
  "finding-intercepts-and-intersections-of-hyperbolas#a-vertical-line-and-a-hyperbola": graphed(
    wide(-7, 7, -5, 5),
    [
      conic(sideways(0, 0, 3, 2)),
      upright(2, "action"),
      upright(3, "action"),
      upright(5, "action"),
      pt([3, 0], "(3, 0)", "ne", "result"),
      pt([5, 8 / 3], "(5, 8/3)", "e", "result"),
      pt([5, -8 / 3], "(5, −8/3)", "e", "result"),
      tag([2, 4], "x = 2 ✗", "w"),
    ],
    "For example, on x²/9 − y²/4 = 1, the line x = 2 misses the curve, x = 3 touches it at the vertex, and x = 5 crosses it twice, at y = ±8/3.",
    "例如，在 x²/9 − y²/4 = 1 上，直线 x = 2 与曲线不相交，x = 3 在顶点处相切，x = 5 与曲线交于两点 y = ±8/3。",
  ),
  "conjugate-axes-of-hyperbolas#central-fundamental-rectangle": graphed(
    wide(-7, 7, -5, 5),
    [
      conic(sideways(0, 0, 3, 2)),
      shape(
        [
          [-3, -2],
          [3, -2],
          [3, 2],
          [-3, 2],
        ],
        "result",
      ),
      ...pair(0, 0, 2 / 3),
      tag([1.5, 2], "2a = 6", "n"),
      tag([3, 0.6], "2b = 4", "w"),
    ],
    "For example, with a = 3 and b = 2 the central rectangle is 6 by 4, with area 24, and its extended diagonals are the asymptotes.",
    "例如，a = 3、b = 2 时中心矩形为 6 乘 4，面积 24，其对角线延长后就是渐近线。",
  ),
  "eccentricity-and-vertices-of-hyperbolas#equilateral-rectangular-hyperbolas": graphed(
    wide(-6, 6, -6, 6),
    [
      conic(sideways(0, 0, 2, 2)),
      ...pair(0, 0, 1),
      pt([2, 0], "(2, 0)", "ne", "result"),
      tag([4.5, 4.5], "y = x", "nw"),
      tag([4.5, -4.5], "y = −x", "sw"),
    ],
    "For example, x²/4 − y²/4 = 1 has a = b, so its asymptotes y = ±x are perpendicular and e = √2.",
    "例如，x²/4 − y²/4 = 1 的 a = b，所以渐近线 y = ±x 互相垂直，e = √2。",
  ),
  "parametric-equations-of-circles#circle-parametric-to-cartesian": graphed(
    wide(-4, 10, -7, 5),
    [
      round([3, -1], 5),
      pt([3, -1], "(3, −1)", "s", "result"),
      thick([3, -1], [3 + 5 * cos(rad(-40)), -1 + 5 * sin(rad(-40))], "action"),
      tag([4.9, -2.6], "5", "ne"),
    ],
    "x = 3 + 5 cos θ, y = −1 + 5 sin θ is the circle with center (3, −1) and radius 5.",
    "x = 3 + 5 cos θ、y = −1 + 5 sin θ 是圆心 (3, −1)、半径 5 的圆。",
  ),
  "parametric-equations-of-ellipses#the-point-at-a-given-parameter": graphed(
    wide(-6, 6, -4, 4),
    [
      ellipse(0, 0, 4, 2),
      pt([4, 0], "θ = 0", "ne", "result"),
      pt([0, 2], "θ = π/2", "ne", "result"),
      pt([-4, 0], "θ = π", "nw", "result"),
      pt([0, -2], "θ = 3π/2", "se", "result"),
    ],
    "For example, x = 4 cos θ, y = 2 sin θ: the quarter turns θ = 0, π/2, π, 3π/2 give the four ends of the axes.",
    "例如，x = 4 cos θ、y = 2 sin θ：θ = 0、π/2、π、3π/2 给出两条轴的四个端点。",
  ),
  "parametric-equations-of-parabolas#standard-horizontal-parabola-parametric": graphed(
    wide(-1, 6, -5, 5),
    [
      trail((t) => [t * t, 2 * t], -2.2, 2.2),
      pt([0, 0], "t = 0", "w", "result"),
      pt([1, 2], "t = 1", "nw", "result"),
      pt([1, -2], "t = −1", "sw", "result"),
      pt([4, 4], "t = 2", "nw", "result"),
      pt([4, -4], "t = −2", "sw", "result"),
      pt([1, 0], "F", "e", "action"),
    ],
    "For example, p = 1: x = t², y = 2t traces y² = 4x, with focus (1, 0), through (0, 0), (1, ±2) and (4, ±4).",
    "例如，p = 1：x = t²、y = 2t 描出 y² = 4x，焦点 (1, 0)，经过 (0, 0)、(1, ±2) 和 (4, ±4)。",
  ),
  "parametric-equations-of-vertical-hyperbolas#the-point-at-parameter-zero": graphed(
    wide(-6, 8, -7, 5),
    [
      conic(upward(1, -1, 3, 2)),
      pt([1, -1], "C(1, −1)", "e"),
      pt([1, 2], "θ = 0: (1, 2)", "se", "result"),
      dash([1, -1], [1, 2], "action"),
    ],
    "For example, x = 1 + 2 tan θ, y = −1 + 3 sec θ: θ = 0 gives (1, 2), the upper vertex directly above the center (1, −1).",
    "例如，x = 1 + 2 tan θ、y = −1 + 3 sec θ：θ = 0 给出 (1, 2)，即中心 (1, −1) 正上方的上顶点。",
  ),
  "introduction-to-polar-coordinates#plotting-polar-coordinates": graphed(
    wide(-5, 5, -5, 5),
    [
      ln(O, polar(1, 60), "action", true),
      arc(60, 1),
      thick(O, polar(4, 240)),
      pt(polar(4, 240), "(−4, π/3)", "w", "result"),
      tag(polar(1.2, 30), "π/3", "e"),
    ],
    "The point (−4, π/3) lies 4 units along the ray opposite to the angle π/3, so it is the same as (4, 4π/3).",
    "点 (−4, π/3) 在与角 π/3 相反的射线上，距极点 4 个单位，所以它与 (4, 4π/3) 是同一点。",
  ),
  "introduction-to-polar-coordinates#distance-between-polar-points": graphed(
    wide(-4, 5, -2, 5),
    [
      thick(O, polar(3, 30), "action"),
      thick(O, polar(4, 120), "action"),
      thick(polar(3, 30), polar(4, 120)),
      {
        kind: "path",
        points: [polar(0.4, 30), [polar(0.4, 30)[0] + polar(0.4, 120)[0], polar(0.4, 30)[1] + polar(0.4, 120)[1]], polar(0.4, 120)],
      },
      pt(polar(3, 30), "(3, π/6)", "e"),
      pt(polar(4, 120), "(4, 2π/3)", "n"),
      tag([0.3, 3], "5", "ne"),
    ],
    "For example, (3, π/6) and (4, 2π/3) are a quarter turn apart, so they make a right triangle with the pole and their distance is √(3² + 4²) = 5.",
    "例如，(3, π/6) 和 (4, 2π/3) 相差四分之一圈，与极点构成直角三角形，距离为 √(3² + 4²) = 5。",
  ),
  "converting-from-polar-coordinates-to-cartesian-coordinates#polar-to-cartesian": graphed(
    wide(-5, 3, -1, 7),
    [
      thick(O, polar(6, 120)),
      dash(polar(6, 120), [-3, 0], "action"),
      arc(120, 1),
      pt(polar(6, 120), "(6, 2π/3) = (−3, 3√3)", "n", "result"),
      tag([-1.5, 2.6], "6", "e"),
      tag([0.5, 0.9], "2π/3", "ne"),
      tag([-3, 2.6], "3√3", "w"),
    ],
    "(r, θ) = (6, 2π/3) has x = 6 cos(2π/3) = −3 and y = 6 sin(2π/3) = 3√3.",
    "(r, θ) = (6, 2π/3) 的 x = 6 cos(2π/3) = −3，y = 6 sin(2π/3) = 3√3。",
  ),
  "polar-equations-of-circles-centered-at-the-origin#the-area-of-a-ring": graphed(
    wide(-5, 5, -5, 5),
    [
      shape(
        [
          ...Array.from({ length: 73 }, (_, i): Point => polar(4, i * 5)),
          ...Array.from({ length: 73 }, (_, i): Point => polar(2, 360 - i * 5)),
        ],
        "result",
      ),
      thick(O, polar(2, 45), "action"),
      thick(O, polar(4, 135), "action"),
      tag(polar(2, 45), "a = 2", "e"),
      tag(polar(4, 135), "b = 4", "nw"),
    ],
    "For example, 2 ≤ r ≤ 4 is the ring between two circles, with area π(4² − 2²) = 12π, not π(4 − 2)² = 4π.",
    "例如，2 ≤ r ≤ 4 是两圆之间的圆环，面积为 π(4² − 2²) = 12π，而不是 π(4 − 2)² = 4π。",
  ),
  "polar-equations-of-radial-lines#radial-line-polar-equation": graphed(
    wide(-5, 5, -5, 5),
    [
      thick(O, polar(6, 60)),
      thick(O, polar(6, 240), "action"),
      arc(60, 1),
      pt(polar(3, 60), "r = 3", "e", "result"),
      pt(polar(3, 240), "r = −3", "e", "action"),
      tag(polar(1.2, 30), "π/3", "e"),
    ],
    "For example, θ = π/3 with r ≥ 0 is the ray in color, r < 0 gives the opposite ray in the other color, and together they make the whole line.",
    "例如，θ = π/3 在 r ≥ 0 时是一种颜色的射线，r < 0 时是另一颜色的反向射线，合起来是整条直线。",
  ),
  "finding-intersections-of-polar-curves#the-radius-where-two-circles-meet": graphed(
    wide(-2, 5, -3, 4),
    [
      round([2, 0], 2),
      round([0, 1.5], 1.5, "action"),
      thick(O, [1.44, 1.92]),
      pt([1.44, 1.92], "r = 12/5", "ne", "result"),
      bare(O, "result"),
    ],
    "For example, r = 4 cos θ and r = 3 sin θ meet where tan θ = 4/3, so cos θ = 3/5 and r = 4 · 3/5 = 12/5.",
    "例如，r = 4 cos θ 与 r = 3 sin θ 相交于 tan θ = 4/3 处，所以 cos θ = 3/5，r = 4 · 3/5 = 12/5。",
  ),
  "the-argument-of-a-complex-number#argument-of-special-complex-numbers": graphed(
    complex(-3, 3, -3, 3),
    [
      toward(O, [1, 1], "result"),
      toward(O, [-1, 1], "result"),
      toward(O, [-1, -1], "result"),
      toward(O, [1, -1], "result"),
      tag([1, 1], "1 + i: π/4", "ne"),
      tag([-1, 1], "−1 + i: 3π/4", "nw"),
      tag([-1, -1], "−1 − i: 5π/4", "sw"),
      tag([1, -1], "1 − i: 7π/4", "se"),
    ],
    "The points ±1 ± i lie on the diagonals, so their arguments in [0, 2π) are π/4, 3π/4, 5π/4 and 7π/4.",
    "点 ±1 ± i 在对角线上，所以它们在 [0, 2π) 内的辐角是 π/4、3π/4、5π/4 和 7π/4。",
  ),
  "the-argument-of-a-complex-number#the-argument-from-a-drawn-point": graphed(
    complex(-4, 3, -4, 2),
    [toward(O, [-2, -2], "result"), arc(-135, 0.9), pt([-2, -2], "−2 − 2i", "w", "result"), tag([0.5, -0.8], "−3π/4", "se")],
    "For example, −2 − 2i is in the third quadrant, so its principal argument is −3π/4, not the π/4 that the arctangent of 1 gives.",
    "例如，−2 − 2i 在第三象限，所以主辐角是 −3π/4，而不是 1 的反正切给出的 π/4。",
  ),
  "arithmetic-in-the-complex-plane#parallelogram-rule-for-complex-addition": graphed(
    complex(-3, 6, -1, 5),
    [
      toward(O, [3, 1], "action"),
      toward(O, [1, 2], "action"),
      toward(O, [4, 3], "result"),
      dash([3, 1], [4, 3]),
      dash([1, 2], [4, 3]),
      tag([3, 1], "z₁", "e"),
      tag([1, 2], "z₂", "nw"),
      tag([4, 3], "z₁ + z₂", "n"),
    ],
    "For example, z₁ = 3 + i and z₂ = 1 + 2i: 0, z₁, z₂ and the sum 4 + 3i are the four vertices of a parallelogram.",
    "例如，z₁ = 3 + i、z₂ = 1 + 2i：0、z₁、z₂ 和它们的和 4 + 3i 是平行四边形的四个顶点。",
  ),
  "geometry-in-the-complex-plane#circle-locus-in-the-complex-plane": graphed(
    complex(-3, 7, -4, 6),
    [
      round([2, 1], 3),
      pt([2, 1], "2 + i", "s", "result"),
      thick([2, 1], [2 + 3 * cos(rad(40)), 1 + 3 * sin(rad(40))], "action"),
      tag([3.1, 2], "3", "nw"),
    ],
    "For example, |z − (2 + i)| = 3 is the circle with center (2, 1) and radius 3.",
    "例如，|z − (2 + i)| = 3 是圆心 (2, 1)、半径 3 的圆。",
  ),
  "geometry-in-the-complex-plane#perpendicular-bisector-locus-in-the-complex-plane": graphed(
    complex(-1, 6, -1, 6),
    [
      thick([1, 1], [3, 3], "action"),
      ln([2, 2], [3, 1], "result"),
      pt([1, 1], "z₁ = 1 + i", "se"),
      pt([3, 3], "z₂ = 3 + 3i", "ne"),
      pt([1, 3], "z", "nw", "result"),
      dash([1, 3], [1, 1]),
      dash([1, 3], [3, 3]),
    ],
    "For example, |z − (1 + i)| = |z − (3 + 3i)| is the perpendicular bisector of the segment. The point z = 1 + 3i is at distance 2 from both.",
    "例如，|z − (1 + i)| = |z − (3 + 3i)| 是该线段的垂直平分线。点 z = 1 + 3i 到两点的距离都是 2。",
  ),
  "geometry-in-the-complex-plane#the-largest-and-smallest-modulus-on-a-circle": graphed(
    complex(-1, 7, -1, 7),
    [
      round([3, 4], 2),
      ln(O, [3, 4], "action", true),
      pt([3, 4], "3 + 4i", "e"),
      pt([1.8, 2.4], "3", "nw", "result"),
      pt([4.2, 5.6], "7", "nw", "result"),
    ],
    "For example, on |z − (3 + 4i)| = 2 the center is at distance 5 from the origin, so the smallest modulus is 5 − 2 = 3 and the largest 5 + 2 = 7, on the line through the center.",
    "例如，在 |z − (3 + 4i)| = 2 上，圆心到原点的距离是 5，所以最小模是 5 − 2 = 3，最大模是 5 + 2 = 7，都在过圆心的直线上。",
  ),
  "the-complex-conjugate#definition-and-reflection-of-conjugates": graphed(
    complex(-2, 6, -4, 4),
    [dash([3, 2], [3, -2], "action"), pt([3, 2], "z = 3 + 2i", "e", "result"), pt([3, -2], "z̄ = 3 − 2i", "e", "result")],
    "For example, 3 + 2i and its conjugate 3 − 2i are mirror images in the real axis.",
    "例如，3 + 2i 和它的共轭 3 − 2i 关于实轴对称。",
  ),
  "the-polar-form-of-a-complex-number#the-principal-argument-from-a-drawing": graphed(
    complex(-3, 4, -4, 3),
    [
      toward(O, polar(3, -60), "result"),
      arc(-60, 1),
      arc(300, 1.7, 0, "result"),
      tag([1.1, -0.5], "−π/3", "e"),
      tag([-1.8, 0.8], "5π/3", "nw"),
    ],
    "For example, this point below the real axis has principal argument −π/3, measured clockwise, even though 5π/3 names the same direction.",
    "例如，实轴下方的这个点主辐角是顺时针量的 −π/3，尽管 5π/3 表示同一方向。",
  ),
  "products-of-complex-numbers-expressed-in-polar-form#geometric-rotation-and-scaling": graphed(
    complex(-3, 5, -2, 5),
    [
      toward(O, [3, 1]),
      toward(O, [-1, 3], "result"),
      arc(90, 1.4, (Math.atan(1 / 3) * 180) / pi),
      tag([3, 1], "z = 3 + i", "e"),
      tag([-1, 3], "iz = −1 + 3i", "nw"),
    ],
    "For example, multiplying z = 3 + i by i gives −1 + 3i: the same distance from the origin, turned counterclockwise by 90°.",
    "例如，z = 3 + i 乘以 i 得 −1 + 3i：到原点的距离不变，逆时针转过 90°。",
  ),
  "the-cis-notation#the-power-that-returns-to-one": graphed(
    complex(-2, 2, -2, 2),
    [
      round(O, 1, undefined, true),
      ...[0, 1, 2, 3, 4, 5].map((k): PlaneMark => toward(polar(1, k * 60), polar(1, (k + 1) * 60), "action")),
      ...[1, 2, 3, 4, 5].map((k): PlaneMark => tag(polar(1, k * 60), `${k}`, "ne")),
      pt([1, 0], "6 → 1", "e", "result"),
    ],
    "For example, powers of cis 60° walk around the unit circle by steps of 60°, and the sixth power is the first to equal 1.",
    "例如，cis 60° 的幂沿单位圆每次走 60°，第六次幂首次等于 1。",
  ),
  "eulers-formula#rectangular-form-to-exponential-form": graphed(
    complex(-5, 2, -1, 5),
    [
      toward(O, [-3, 3], "result"),
      arc(135, 1),
      dash([-3, 3], [-3, 0]),
      tag([-3, 3], "−3 + 3i", "nw"),
      tag([-1.5, 1.5], "3√2", "ne"),
      tag([0.6, 0.8], "3π/4", "ne"),
    ],
    "z = −3 + 3i has modulus 3√2 and lies in quadrant II with reference angle π/4, so θ = 3π/4 and z = 3√2 e^(3πi/4).",
    "z = −3 + 3i 的模是 3√2，在第二象限，参考角 π/4，所以 θ = 3π/4，z = 3√2 e^(3πi/4)。",
  ),
  "the-roots-of-unity#arguments-of-roots-of-unity": graphed(
    complex(-2, 2, -2, 2),
    [
      round(O, 1),
      ...[0, 1, 2, 4, 5, 6, 7].map((k): PlaneMark => bare(polar(1, k * 45))),
      thick(O, polar(1, 135)),
      arc(135, 0.4),
      pt(polar(1, 135), "ω₃: 135°", "nw", "result"),
    ],
    "For example, the 8th roots of unity are equally spaced 45° apart on the unit circle, so ω₃ has argument 3 · 45° = 135°.",
    "例如，8 次单位根在单位圆上每隔 45° 等距分布，所以 ω₃ 的辐角是 3 · 45° = 135°。",
  ),
  "the-roots-of-unity#roots-of-unity-in-rectangular-form": graphed(
    complex(-2, 2, -2, 2),
    [
      round(O, 1),
      dash([1, 0], polar(1, 120)),
      dash(polar(1, 120), polar(1, 240)),
      dash(polar(1, 240), [1, 0]),
      pt([1, 0], "1", "e", "result"),
      pt(polar(1, 120), "−½ + (√3/2)i", "nw", "result"),
      pt(polar(1, 240), "−½ − (√3/2)i", "sw", "result"),
    ],
    "The cube roots of unity are 1 and −½ ± (√3/2)i, the corners of an equilateral triangle on the unit circle.",
    "三次单位根是 1 和 −½ ± (√3/2)i，它们是单位圆上一个等边三角形的顶点。",
  ),
  "square-roots-of-complex-numbers#square-roots-in-rectangular-form": graphed(
    wide(-10, 6, -6, 15, 2, 1, "Re", "Im"),
    [
      toward(O, polar(16, 120)),
      round(O, 4, undefined, true),
      toward(O, polar(4, 60), "result"),
      toward(O, polar(4, 240), "result"),
      tag(polar(16, 120), "w = −8 + 8i√3", "e"),
      tag(polar(4, 60), "2 + 2i√3", "e"),
      tag(polar(4, 240), "−2 − 2i√3", "w"),
    ],
    "w = −8 + 8i√3 = 16 cis(2π/3) has the square roots 2 + 2i√3 and −2 − 2i√3, opposite each other on the circle of radius 4.",
    "w = −8 + 8i√3 = 16 cis(2π/3) 的平方根是 2 + 2i√3 和 −2 − 2i√3，它们在半径 4 的圆上彼此相对。",
  ),
  "higher-roots-of-complex-numbers#the-number-from-its-roots-on-a-circle": graphed(
    complex(-4, 4, -4, 4),
    [
      round(O, 2),
      ...[45, 135, 225, 315].map((d): PlaneMark => bare(polar(2, d), "result")),
      thick(O, polar(2, 45), "action"),
      tag(polar(1, 45), "R = 2", "se"),
    ],
    "For example, 4 points evenly spaced on a circle of radius 2 are the fourth roots of a number of size 2⁴ = 16.",
    "例如，半径 2 的圆上 4 个等距的点，是一个大小为 2⁴ = 16 的数的四次方根。",
  ),
  "higher-roots-of-complex-numbers#the-equation-from-its-roots-on-a-circle": graphed(
    complex(-4, 4, -4, 4),
    [
      round(O, 2),
      ...[0, 120, 240].map((d): PlaneMark => bare(polar(2, d), "result")),
      thick(O, [2, 0], "action"),
      tag([1, 0], "R = 2", "n"),
    ],
    "For example, 3 dots on a circle of radius 2, one on the positive real axis, are the solutions of z³ = 8: n = 3, |w| = 2³ = 8 and w is positive.",
    "例如，半径 2 的圆上 3 个点，其中一个在正实轴上，是 z³ = 8 的解：n = 3，|w| = 2³ = 8，w 为正。",
  ),
};
