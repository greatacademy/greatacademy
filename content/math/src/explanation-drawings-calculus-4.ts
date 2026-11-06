// Drawings in the explanations of Calculus II about applications of integrals: averages, areas, arc length and solids. Each coordinate is computed from the function in the alt text.

import type { Figure } from "@ga/content";
import type { Point } from "@ga/subject-math";
import { aboutX, aboutY, area, between, count, hoop, joined, p3, pane, sections } from "./explanation-drawings-calculus-kit.ts";
import { chain, curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { across, bare, upright, wide } from "./explanation-drawings-curves.ts";
import { pt, shape } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note, seg, square } from "./explanation-drawings-kit.ts";

const { PI: pi, atan, cos, cosh, sin, sqrt } = Math;
const sq = (w: number): Point[] => [
  [0, 0],
  [w, 0],
  [w, w],
  [0, w],
];
const wedgeBase: Point[] = [
  [0, 0],
  [2, 0],
  [0, 2],
];
const fall = (x: number): number => 2 - x;
const cuts = (xs: readonly number[]): [number, number, number][] => xs.map((x) => [x, 0, fall(x)]);
const circleOn = (w: number): Point[] =>
  count(0, 72).map((i): Point => [w / 2 + (w / 2) * cos((i * pi) / 36), (w / 2) * sin((i * pi) / 36)]);
const halfOn = (w: number): Point[] => count(0, 36).map((i): Point => [w / 2 + (w / 2) * cos((i * pi) / 36), (w / 2) * sin((i * pi) / 36)]);
const oval = (a: number, b: number, from = 0, to = 2 * pi): Point[] =>
  count(0, 72).map((i): Point => [a * cos(from + ((to - from) * i) / 72), b * sin(from + ((to - from) * i) / 72)]);

/** calculusDrawings4 are the drawings in the explanations of the applications of integrals in Calculus II, by topic and knowledge point. */
export const calculusDrawings4: Readonly<Record<string, Figure>> = {
  "integration-using-the-double-angle-formulas#integrating-squares-of-sine-and-cosine": graphed(
    wide(-1, 7, -1, 2),
    [
      curveOf((x) => sin(x) ** 2, undefined, 0, 2 * pi),
      across(0.5, "action"),
      tag([6.3, 0.5], "1/2", "n"),
      tag([pi / 2, 1], "y = sin²x", "n"),
    ],
    "For example, a = 1: sin²x = (1 − cos 2x)/2 swings about the constant 1/2 with the doubled angle. The constant integrates to x/2 and the cosine gives the −sin(2x)/4.",
    "例如，a = 1：sin²x = (1 − cos 2x)/2 以二倍角绕常数 1/2 摆动。常数积分得 x/2，余弦项给出 −sin(2x)/4。",
  ),
  "integration-using-the-double-angle-formulas#applying-a-double-angle-formula-twice": graphed(
    wide(-1, 7, -1, 2),
    [
      area((x) => sin(x) ** 4, 0, 2 * pi),
      curveOf((x) => sin(x) ** 4, undefined, 0, 2 * pi),
      across(3 / 8, "action"),
      tag([6.5, 0.375], "3/8", "n"),
      tag([pi / 2, 1], "y = sin⁴x", "n"),
    ],
    "For example, sin⁴x = 3/8 − (1/2)cos 2x + (1/8)cos 4x. Over the whole period [0, 2π] both cosines vanish and only the constant 3/8 survives, so the integral is 2π · 3/8 = 3π/4.",
    "例如，sin⁴x = 3/8 − (1/2)cos 2x + (1/8)cos 4x。在整个周期 [0, 2π] 上两个余弦都积分为零，只剩常数 3/8，所以积分为 2π · 3/8 = 3π/4。",
  ),
  "integrating-rational-functions-with-irreducible-quadratic-factors#two-quadratic-factors-over-an-infinite-interval": graphed(
    wide(-1, 9, -1, 3),
    [
      across(pi / 2, "action"),
      curveOf(atan, undefined, 0, 9),
      curveOf((x) => atan(x / 2), "result", 0, 9),
      tag([1, pi / 2], "π/2", "n"),
      tag([6.5, 1.05], "arctan(x/2)", "s"),
      tag([6, pi / 2], "arctan x", "n"),
    ],
    "For example, arctan x and arctan(x/2) both climb from 0 towards the right angle π/2 as x grows. So on [0, ∞) the integral of 1/(x² + a²) is (1/a)(π/2), which depends only on the constant a² in the quadratic.",
    "例如，arctan x 和 arctan(x/2) 都随 x 增大从 0 趋向直角 π/2。所以在 [0, ∞) 上，1/(x² + a²) 的积分为 (1/a)(π/2)，只取决于二次式中的常数 a²。",
  ),
  "improper-integrals-involving-arctangent#the-real-line-after-completing-the-square": graphed(
    wide(-6, 7, -3, 3),
    [
      across(pi / 2, "action"),
      across(-pi / 2, "action"),
      curveOf((x) => atan(x - 1), undefined, -6, 7),
      tag([-4, pi / 2], "π/2", "n"),
      tag([4, -pi / 2], "−π/2", "s"),
      bare([1, 0], "result"),
      tag([2.3, -0.55], "center 1", "s"),
    ],
    "For example, the center 1: arctan(x − 1) runs from the level −π/2 to the level π/2, a total change of π, the same as arctan x. Shifting the center moves the graph sideways but does not change this total.",
    "例如，中心为 1：arctan(x − 1) 从水平线 −π/2 升到水平线 π/2，总变化为 π，与 arctan x 相同。移动中心只是把图象左右平移，不改变这个总量。",
  ),
  "integrating-rates-of-change#finding-an-amount-from-its-rate": drawing(
    pane(0, [0, 4, 1], [0, 12, 3], 8, 5, "t", "r")
      .under((t) => 2 * t + 3, 0, 4)
      .f((t) => 2 * t + 3)
      .dot(0, 3, "3", "ne")
      .dot(4, 11, "11", "w")
      .say(2.4, 2.5, "area 28", "n")
      .marks(),
    "The rate r(t) = 2t + 3 on [0, 4] encloses a trapezoid with heights 3 and 11 and width 4, so its area is 28. The tank goes from 10 liters to 10 + 28 = 38 liters.",
    "速率 r(t) = 2t + 3 在 [0, 4] 上围成高为 3 和 11、宽为 4 的梯形，面积为 28。水箱从 10 升变为 10 + 28 = 38 升。",
  ),
  "integrating-rates-of-change#net-change-with-inflow-and-outflow": graphed(
    wide(-1, 7, -1, 7, 1, 1, "t", ""),
    [
      between(
        (t) => 6 - t,
        () => 2,
        0,
        4,
      ),
      between(
        (t) => 6 - t,
        () => 2,
        4,
        6,
        "action",
      ),
      curveOf((t) => 6 - t, undefined, 0, 6),
      curveOf(() => 2, undefined, 0, 6),
      tag([1.2, 3], "+8", "n"),
      tag([5.3, 1.4], "−2", "s"),
      tag([2, 4.1], "R(t) = 6 − t", "ne"),
      tag([3, 2], "L(t) = 2", "s"),
    ],
    "For example, R(t) = 6 − t and L(t) = 2 on [0, 6]. Where R is above L the quantity grows, by 8 on [0, 4]; where R is below L it falls, by 2 on [4, 6]. The net change is 8 − 2 = 6.",
    "例如，在 [0, 6] 上 R(t) = 6 − t，L(t) = 2。R 在 L 上方时量增加，在 [0, 4] 上增加 8；R 在 L 下方时量减少，在 [4, 6] 上减少 2。净变化为 8 − 2 = 6。",
  ),
  "the-average-value-of-a-function#average-values-of-polynomials": drawing(
    pane(0, [0, 3, 1], [0, 9, 3], 7, 5)
      .under((x) => x * x, 0, 3)
      .f((x) => x * x)
      .path(
        [
          [0, 3],
          [3, 3],
          [3, 0],
        ],
        "action",
        true,
      )
      .say(0.75, 3, "average 3", "n")
      .marks(),
    "The average of x² on [0, 3]: the region under the curve has area 9, the same as the rectangle of width 3 and height 3. So the average is 3.",
    "x² 在 [0, 3] 上的平均值：曲线下方的面积为 9，与宽 3、高 3 的矩形面积相同。所以平均值是 3。",
  ),
  "the-average-value-of-a-function#the-average-value-of-a-drawn-function": graphed(
    wide(-1, 7, -3, 3),
    [
      area(() => 2, 0, 2),
      area((x) => 4 - x, 2, 4),
      area((x) => 4 - x, 4, 6, "action"),
      joined([
        [0, 2],
        [2, 2],
        [4, 0],
        [6, -2],
      ]),
      joined(
        [
          [0, 2 / 3],
          [6, 2 / 3],
        ],
        "action",
        true,
      ),
      tag([1, 1], "+4", "n"),
      tag([2.6, 0.05], "+2", "n"),
      tag([5.2, -0.3], "−2", "s"),
      tag([6, 2 / 3], "average 2/3", "ne"),
    ],
    "For example, this graph has signed areas +4, +2 and −2 on [0, 6], so its integral is 4. Dividing by the length 6 gives the average 2/3, the height of a rectangle with the same base and area.",
    "例如，这个图象在 [0, 6] 上的有向面积为 +4、+2、−2，所以积分为 4。除以长度 6 得平均值 2/3，即底相同、面积相同的矩形的高。",
  ),
  "the-area-between-curves-expressed-as-functions-of-y#choosing-to-integrate-with-respect-to-y": graphed(
    wide(-1, 6, -3, 3),
    [
      shape(
        count(-2, 2, 0.1).map((y): Point => [y * y, y]),
        "result",
      ),
      joined(count(-2.4, 2.4, 0.1).map((y): Point => [y * y, y])),
      upright(4, "action"),
      joined(
        [
          [1, 1],
          [4, 1],
        ],
        "action",
      ),
      bare([4, 2]),
      bare([4, -2]),
      tag([2.5, 1], "4 − y²", "n"),
      tag([3, -1.2], "32/3", "n"),
      tag([2, -2], "x = y²", "s"),
      tag([4, 2.4], "x = 4", "e"),
    ],
    "The region between x = y² and x = 4 runs from y = −2 to y = 2. A horizontal strip at height y has length 4 − y², so the area is 32/3.",
    "x = y² 与 x = 4 之间的区域从 y = −2 延伸到 y = 2。高度 y 处的水平窄条长 4 − y²，所以面积为 32/3。",
  ),
  "finding-areas-between-curves-that-intersect-at-more-than-two-points#total-area-from-the-net-integral": graphed(
    wide(-1, 6, -2, 2),
    [
      area(sin, 0, pi),
      area(sin, pi, (3 * pi) / 2, "action"),
      curveOf(sin, undefined, 0, (3 * pi) / 2),
      tag([1.2, 0.2], "A = 2", "n"),
      tag([4.85, -0.5], "B = 1", "e"),
    ],
    "For example, y = sin x on [0, 3π/2] has a lobe of area A = 2 above the axis and a lobe of area B = 1 below it. The integral is A − B = 1, and the total area is A + B = 3.",
    "例如，y = sin x 在 [0, 3π/2] 上，轴上方的部分面积 A = 2，轴下方的部分面积 B = 1。积分为 A − B = 1，总面积为 A + B = 3。",
  ),
  "the-arc-length-of-a-planar-curve#arc-length-with-a-substitution": graphed(
    wide(-1, 5, -1, 4),
    [
      curveOf((x) => (2 / 3) * x ** 1.5, undefined, 0, 3),
      joined(
        [
          [1.6, (2 / 3) * 1.6 ** 1.5],
          [2.4, (2 / 3) * 1.6 ** 1.5],
          [2.4, (2 / 3) * 2.4 ** 1.5],
        ],
        "action",
      ),
      tag([2, (2 / 3) * 1.6 ** 1.5], "Δx", "s"),
      tag([2.4, 1.9], "Δy", "e"),
      bare([0, 0]),
      pt([3, 2 * sqrt(3)], "L = 14/3", "e", "result"),
    ],
    "A short piece of y = (2/3)x^(3/2) is nearly the hypotenuse of a triangle with sides Δx and Δy. Adding the pieces from x = 0 to x = 3 gives the length L = 14/3.",
    "y = (2/3)x^(3/2) 的一小段近似于直角边为 Δx、Δy 的三角形的斜边。把 x = 0 到 x = 3 的小段加起来，得长度 L = 14/3。",
  ),
  "the-arc-length-of-a-planar-curve#the-length-of-a-catenary": graphed(
    wide(-3, 3, -1, 3),
    [
      curveOf(cosh, undefined, -1.7, 1.7),
      curveOf(cosh, "action", -1, 1),
      pt([-1, cosh(1)], "x = −1", "w", "action"),
      pt([1, cosh(1)], "x = 1", "e", "action"),
    ],
    "For example, a = 1: on y = cosh x the length element is √(1 + sinh²x) dx = cosh x dx. The arc from x = −1 to x = 1 has length 2 sinh 1 ≈ 2.35.",
    "例如，a = 1：在 y = cosh x 上，长度元为 √(1 + sinh²x) dx = cosh x dx。从 x = −1 到 x = 1 的弧长为 2 sinh 1 ≈ 2.35。",
  ),
  "the-arc-length-of-a-planar-curve#arc-length-of-a-drawn-segment-by-the-integral": graphed(
    wide(-1, 6, -1, 6),
    [
      joined(
        [
          [1, 1],
          [4, 5],
        ],
        "result",
      ),
      joined(
        [
          [1, 1],
          [4, 1],
          [4, 5],
        ],
        "action",
        true,
      ),
      bare([1, 1]),
      bare([4, 5]),
      tag([2.5, 1], "run 3", "s"),
      tag([4, 3], "rise 4", "e"),
      tag([2.4, 3], "length 5", "nw"),
    ],
    "For example, a segment from (1, 1) to (4, 5) has constant slope m = 4/3, so the integral is √(1 + 16/9) · 3 = (5/3) · 3 = 5.",
    "例如，从 (1, 1) 到 (4, 5) 的线段斜率恒为 m = 4/3，所以积分为 √(1 + 16/9) · 3 = (5/3) · 3 = 5。",
  ),
  "volumes-of-solids-with-square-cross-sections#square-cross-sections-under-a-curve": drawing(
    [
      ...sections(wedgeBase, cuts([0.2, 0.8, 1.4]), sq),
      note(p3(1, 0, 0), "x", "s"),
      note(p3(1.75, 0.25, 0), "y = 2 − x", "e"),
      note(p3(0.2, 0, 0.9), "s", "w"),
    ],
    "The base under y = 2 − x on [0, 2], with square cross sections standing on it. Each side is the width s = 2 − x of the base, so A(x) = (2 − x)² and V = 8/3.",
    "底面在 [0, 2] 上 y = 2 − x 的下方，其上立着正方形截面。每条边都等于底面的宽 s = 2 − x，所以 A(x) = (2 − x)²，V = 8/3。",
  ),
  "volumes-of-solids-with-square-cross-sections#squares-over-an-elliptical-base": drawing(
    [
      ...sections(oval(3, 2), [[1, -2 * sqrt(8 / 9), 2 * sqrt(8 / 9)]], sq, 1),
      seg(p3(1, -2 * sqrt(8 / 9), 0, 1), p3(1, 2 * sqrt(8 / 9), 0, 1), "action"),
      note(p3(1.2, 0, 0, 1), "2y", "se"),
    ],
    "For example, the base x²/9 + y²/4 = 1. At x the chord is 2y, so the square has area 4y² = 16(1 − x²/9), a quadratic with no root left, and V = 64.",
    "例如，底面为 x²/9 + y²/4 = 1。在 x 处弦长为 2y，所以正方形面积为 4y² = 16(1 − x²/9)，是不含根号的二次式，V = 64。",
  ),
  "volumes-of-solids-with-rectangular-cross-sections#rectangles-with-height-proportional-to-the-base": drawing(
    [
      ...sections(wedgeBase, cuts([0.2, 0.8, 1.4]), (w) => [
        [0, 0],
        [w, 0],
        [w, w / 2],
        [0, w / 2],
      ]),
      note(p3(1.75, 0.25, 0), "s = 2 − x", "e"),
      note(p3(0.2, 0, 0.45), "s/2", "w"),
    ],
    "For example, h = 1/2 over the base under y = 2 − x: each rectangle has base s = 2 − x and height s/2, so its area is s²/2 and V = (1/2)(8/3) = 4/3.",
    "例如，h = 1/2，底面在 y = 2 − x 下方：每个矩形底为 s = 2 − x，高为 s/2，面积为 s²/2，V = (1/2)(8/3) = 4/3。",
  ),
  "volumes-of-solids-with-rectangular-cross-sections#rectangles-with-constant-height": drawing(
    [
      ...sections(wedgeBase, cuts([0.5, 1.2]), (w) => [
        [0, 0],
        [w, 0],
        [w, 1],
        [0, 1],
      ]),
      ...chain([p3(0, 0, 1), p3(2, 0, 1), p3(0, 2, 1), p3(0, 0, 1)]),
      seg(p3(0, 0, 0), p3(0, 0, 1)),
      seg(p3(2, 0, 0), p3(2, 0, 1)),
      seg(p3(0, 2, 0), p3(0, 2, 1)),
      note(p3(0, 0, 0.5), "H = 1", "w"),
    ],
    "For example, H = 1 over the triangular base under y = 2 − x, which has area 2. The solid is a slab of constant thickness, with V = 1 · 2 = 2.",
    "例如，H = 1，底面是 y = 2 − x 下方面积为 2 的三角形。立体是厚度不变的板，V = 1 · 2 = 2。",
  ),
  "volumes-of-solids-with-triangular-cross-sections#equilateral-triangle-cross-sections": drawing(
    [
      ...sections(wedgeBase, cuts([0.2, 0.8, 1.4]), (w) => [
        [0, 0],
        [w, 0],
        [w / 2, (sqrt(3) / 2) * w],
      ]),
      note(p3(1.75, 0.25, 0), "s = 2 − x", "e"),
    ],
    "For example, the base under y = 2 − x on [0, 2], with equilateral triangles of side s = 2 − x. Each has area (√3/4)s², so V = (√3/4)(8/3) = 2√3/3.",
    "例如，底面在 [0, 2] 上 y = 2 − x 的下方，截面是边长 s = 2 − x 的等边三角形。每个面积为 (√3/4)s²，所以 V = (√3/4)(8/3) = 2√3/3。",
  ),
  "volumes-of-solids-with-triangular-cross-sections#right-isosceles-triangle-cross-sections": drawing(
    [
      {
        kind: "shade",
        points: [
          [0, 0],
          [4, 0],
          [0, 4],
        ],
        tone: "result",
      },
      {
        kind: "polygon",
        points: [
          [0, 0],
          [4, 0],
          [0, 4],
        ],
        tone: "result",
      },
      square([0, 0], [1, 0], [0, 1]),
      note([2, 0], "s", "s"),
      note([0, 2], "s", "w"),
      note([1.3, 1.1], "s²/2", "n"),
      {
        kind: "shade",
        points: [
          [7, 0],
          [11, 0],
          [9, 2],
        ],
        tone: "result",
      },
      {
        kind: "polygon",
        points: [
          [7, 0],
          [11, 0],
          [9, 2],
        ],
        tone: "result",
      },
      square([9, 2], [8, 1], [10, 1]),
      note([9, 0], "s", "s"),
      note([8, 1], "s/√2", "nw"),
      note([9, 0.4], "s²/4", "n"),
    ],
    "An isosceles right triangle with a leg s in the base has area s²/2. With the hypotenuse s in the base, each leg is s/√2 and the area is s²/4.",
    "直角边 s 在底面上的等腰直角三角形面积为 s²/2。斜边 s 在底面上时，每条直角边为 s/√2，面积为 s²/4。",
  ),
  "volumes-of-solids-with-triangular-cross-sections#the-wedge-cut-from-a-cylinder": drawing(
    [
      ...sections(
        oval(3, 3, 0, pi),
        [-1.5, 0, 1.5].map((x): [number, number, number] => [x, 0, sqrt(9 - x * x)]),
        (w) => [
          [0, 0],
          [w, 0],
          [w, w],
        ],
        1,
      ),
      ...chain(count(-3, 3, 0.1).map((x) => p3(x, sqrt(Math.max(0, 9 - x * x)), sqrt(Math.max(0, 9 - x * x)), 1))),
      note(p3(0, 0, 0, 1), "diameter", "s"),
    ],
    "For example, r = 3 and a plane at 45° through the diameter. The slice at x is a right triangle with both legs √(9 − x²), so its area is (9 − x²)/2 and the wedge has V = 18.",
    "例如，r = 3，平面过直径且倾斜 45°。x 处的截面是两条直角边都为 √(9 − x²) 的直角三角形，面积为 (9 − x²)/2，楔形体积 V = 18。",
  ),
  "volumes-of-solids-with-triangular-cross-sections#triangular-cross-sections-over-a-drawn-base": drawing(
    [
      ...sections(
        [
          [0, 0],
          [3, 0],
          [3, 3],
        ],
        [1, 2, 3].map((x): [number, number, number] => [x, 0, x]),
        (w) => [
          [0, 0],
          [w, 0],
          [0, w],
        ],
        1.6,
      ),
      note(p3(2.2, 0, 0, 1.6), "x", "s"),
      note(p3(3, 1.5, 0, 1.6), "s(x) = x", "e"),
    ],
    "For example, a triangular base with width s(x) = x on [0, 3], and isosceles right triangles with one leg in the base. Each has area x²/2, so V = 27/6 = 9/2.",
    "例如，三角形底面的宽 s(x) = x，x 在 [0, 3] 上，截面是一条直角边在底面上的等腰直角三角形。每个面积为 x²/2，所以 V = 27/6 = 9/2。",
  ),
  "volumes-of-solids-with-circular-cross-sections#circular-cross-sections": drawing(
    [...sections(wedgeBase, cuts([0.3, 1.3]), (w) => circleOn(w).map((p) => [p[0], p[1]])), note(p3(1.75, 0.25, 0), "y = 2 − x", "e")],
    "For example, the base under y = 2 − x on [0, 2]. Each slice is a circle whose diameter is the chord s = 2 − x, so its area is (π/4)s² and V = (π/4)(8/3) = 2π/3.",
    "例如，底面在 [0, 2] 上 y = 2 − x 的下方。每个截面是以弦 s = 2 − x 为直径的圆，面积为 (π/4)s²，V = (π/4)(8/3) = 2π/3。",
  ),
  "volumes-of-solids-with-circular-cross-sections#cross-sections-over-a-circular-base": drawing(
    [
      ...sections(
        oval(2, 2),
        [-1, 0, 1].map((x): [number, number, number] => [x, -sqrt(4 - x * x), sqrt(4 - x * x)]),
        halfOn,
        1.5,
      ),
      note(p3(2, 0, 0, 1.5), "r = 2", "e"),
    ],
    "For example, a disc of radius 2. Semicircles on the chords 2√(4 − x²) have radius √(4 − x²) and build a hemisphere of volume 16π/3. Full circles on the same chords build a sphere of volume 32π/3.",
    "例如，半径为 2 的圆盘。以弦 2√(4 − x²) 为直径的半圆半径为 √(4 − x²)，堆成体积 16π/3 的半球。同样的弦上的整圆堆成体积 32π/3 的球。",
  ),
  "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes#discs-about-the-x-axis": graphed(
    wide(-1, 6, -3, 3),
    [...aboutX(sqrt, 0, 4, 0, 2), tag([2.6, 2], "y = √x", "n"), tag([2, 0.6], "√x", "w")],
    "Rotating the region under y = √x, 0 ≤ x ≤ 4, about the x-axis. The slice at x is a disc of radius √x and area πx, so V = π∫₀⁴ x dx = 8π.",
    "把 y = √x（0 ≤ x ≤ 4）下方的区域绕 x 轴旋转。x 处的截面是半径 √x、面积 πx 的圆盘，所以 V = π∫₀⁴ x dx = 8π。",
  ),
  "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes#discs-about-the-y-axis": graphed(
    wide(-3, 3, -1, 6),
    [...aboutY(sqrt, 0, 4, 2), tag([sqrt(3), 3], "y = x²", "e"), tag([1.5, 2], "√y", "e")],
    "Rotating the region between y = x², the y-axis and y = 4 about the y-axis. The slices are horizontal discs of radius x = √y and area πy, so V = π∫₀⁴ y dy = 8π.",
    "把 y = x²、y 轴和 y = 4 围成的区域绕 y 轴旋转。截面是水平圆盘，半径 x = √y，面积 πy，所以 V = π∫₀⁴ y dy = 8π。",
  ),
  "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes#the-disc-integral-of-a-drawn-region": graphed(
    wide(-1, 4, -4, 4),
    [...aboutX((x) => x + 1, 0, 2, 0, 1), tag([1, 1], "2", "w"), tag([1.5, 2.5], "y = x + 1", "nw")],
    "For example, the region under y = x + 1 on [0, 2]. The slice at x = 1 has radius 2 and area 4π. Adding the slices gives V = π∫₀² (x + 1)² dx = 26π/3.",
    "例如，[0, 2] 上 y = x + 1 下方的区域。x = 1 处的截面半径为 2，面积为 4π。把截面加起来得 V = π∫₀² (x + 1)² dx = 26π/3。",
  ),
  "volumes-of-revolution-using-the-disc-method-rotation-about-other-axes#discs-about-a-horizontal-line": graphed(
    wide(-1, 3, -1, 3),
    [
      across(1, "action"),
      ...aboutX((x) => x * x + 1, 0, 1, 1, 0.7),
      tag([1.35, 1.2], "π/5", "e"),
      tag([1.1, 2], "y = x² + 1", "e"),
      tag([-0.5, 1], "y = 1", "n"),
    ],
    "Rotating the region between y = x² + 1 and y = 1, 0 ≤ x ≤ 1, about y = 1. The radius is the distance to the line, x², not the height above the x-axis, so V = π∫₀¹ x⁴ dx = π/5.",
    "把 y = x² + 1 与 y = 1（0 ≤ x ≤ 1）之间的区域绕 y = 1 旋转。半径是到该直线的距离 x²，而不是到 x 轴的高度，所以 V = π∫₀¹ x⁴ dx = π/5。",
  ),
  "volumes-of-revolution-using-the-disc-method-rotation-about-other-axes#an-axis-outside-the-region-needs-washers": graphed(
    wide(-2, 4, -5, 3),
    [
      across(-1, "action"),
      area(() => 2, 0, 2),
      joined([
        [0, 0],
        [0, 2],
        [2, 2],
        [2, 0],
        [0, 0],
      ]),
      joined(
        [
          [0, -2],
          [0, -4],
          [2, -4],
          [2, -2],
          [0, -2],
        ],
        undefined,
        true,
      ),
      hoop([1, -1], 0.9, 3, "action"),
      hoop([1, -1], 0.3, 1, "action"),
      tag([-1.2, -1], "y = −1", "n"),
      toward([1, -1], [1, 2], "action"),
      toward([1, -1], [1, -2], "result"),
      tag([1, 2.05], "R = 3", "n"),
      tag([1, -2.05], "r = 1", "s"),
    ],
    "For example, the square 0 ≤ x ≤ 2, 0 ≤ y ≤ 2 rotated about y = −1, which does not touch it. Each slice is a washer with R = 3 and r = 1, of area π(9 − 1) = 8π, not π(3 − 1)² = 4π.",
    "例如，正方形 0 ≤ x ≤ 2、0 ≤ y ≤ 2 绕不与它相接的直线 y = −1 旋转。每个截面是 R = 3、r = 1 的垫圈，面积为 π(9 − 1) = 8π，不是 π(3 − 1)² = 4π。",
  ),
  "volumes-of-revolution-using-the-disc-method-rotation-about-other-axes#the-disc-method-about-a-drawn-horizontal-line": graphed(
    wide(-1, 4, -2, 4),
    [
      across(1, "action"),
      ...aboutX((x) => x + 1, 0, 2, 1, 1.2),
      tag([0.75, 1.6], "1.2", "w"),
      tag([3.4, 1], "y = 1", "n"),
      tag([1.5, 2.5], "y = x + 1", "nw"),
    ],
    "For example, y = x + 1 on [0, 2] rotated about k = 1. At x = 1.2 the radius is the distance to the line, 1.2, not the height 2.2. So V = π∫₀² x² dx = 8π/3.",
    "例如，[0, 2] 上的 y = x + 1 绕 k = 1 旋转。x = 1.2 处的半径是到直线的距离 1.2，不是高度 2.2。所以 V = π∫₀² x² dx = 8π/3。",
  ),
  "volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes#washers-about-the-x-axis": graphed(
    wide(-1, 4, -2, 2),
    [
      between(
        (x) => x,
        (x) => x * x,
        0,
        1,
      ),
      curveOf((x) => x, undefined, 0, 1),
      curveOf((x) => x * x, undefined, 0, 1),
      curveOf((x) => -x, undefined, 0, 1, true),
      curveOf((x) => -x * x, undefined, 0, 1, true),
      hoop([0.5, 0], 0.15, 0.5, "action"),
      hoop([0.5, 0], 0.075, 0.25, "action"),
      tag([1, 1], "y = x", "ne"),
      tag([0.95, 0.75], "y = x²", "e"),
      tag([1.1, -0.8], "R = 1/2, r = 1/4", "e"),
    ],
    "The region between y = x and y = x², from x = 0 to x = 1, rotated about the x-axis. At x = 1/2 the washer has R = 1/2 and r = 1/4. In all, V = π∫₀¹ (x² − x⁴) dx = 2π/15.",
    "y = x 与 y = x² 之间（x = 0 到 x = 1）的区域绕 x 轴旋转。x = 1/2 处的垫圈 R = 1/2、r = 1/4。总体积 V = π∫₀¹ (x² − x⁴) dx = 2π/15。",
  ),
  "volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes#washers-about-the-y-axis": graphed(
    wide(-2, 2, -1, 2),
    [
      between(
        (x) => x,
        (x) => x * x,
        0,
        1,
      ),
      curveOf((x) => x, undefined, 0, 1),
      curveOf((x) => x * x, undefined, 0, 1),
      curveOf((x) => -x, undefined, -1, 0, true),
      curveOf((x) => x * x, undefined, -1, 0, true),
      hoop([0, 0.5], sqrt(0.5), 0.2, "action"),
      hoop([0, 0.5], 0.5, 0.14, "action"),
      tag([1, 0.5], "R = √y, r = y", "e"),
    ],
    "The same region rotated about the y-axis. At height y the parabola is at x = √y, the farther one, and the line at x = y. So V = π∫₀¹ (y − y²) dy = π/6.",
    "同一区域绕 y 轴旋转。高度 y 处抛物线在 x = √y（较远），直线在 x = y。所以 V = π∫₀¹ (y − y²) dy = π/6。",
  ),
  "volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes#the-volume-of-a-napkin-ring": graphed(
    wide(-6, 6, -6, 6, 2),
    [
      shape([[3, -4], ...count(-4, 4, 0.1).map((y): Point => [sqrt(25 - y * y), y]), [3, 4]], "result"),
      shape([[-3, -4], ...count(-4, 4, 0.1).map((y): Point => [-sqrt(25 - y * y), y]), [-3, 4]], "result"),
      { kind: "circle", center: [0, 0], r: 5 },
      joined(
        [
          [3, -4],
          [3, 4],
        ],
        "action",
      ),
      joined(
        [
          [-3, -4],
          [-3, 4],
        ],
        "action",
      ),
      joined(
        [
          [0, 2],
          [sqrt(21), 2],
        ],
        "result",
      ),
      pt([3, 4], "(3, 4)", "ne"),
      tag([1.5, 2], "√(25 − y²)", "n"),
      tag([3, -1], "3", "e"),
    ],
    "For example, a sphere of radius 5 with a hole of radius 3: the slices stop at y = ±4, where the radii meet. At height y the outer radius is √(25 − y²) and the inner radius is 3, so a slice has area π(25 − y² − 9) = π(16 − y²). The 5 has dropped out and V = 256π/3.",
    "例如，半径 5 的球钻一个半径 3 的孔：截面到 y = ±4 为止，那里两个半径相等。高度 y 处外半径为 √(25 − y²)，内半径为 3，所以截面面积为 π(25 − y² − 9) = π(16 − y²)，球半径 5 已消去，V = 256π/3。",
  ),
  "volumes-of-revolution-using-the-washer-method-rotation-about-other-axes#washers-about-a-horizontal-line": graphed(
    wide(-1, 7, -1, 5),
    [
      between(
        () => 3,
        () => 2,
        0,
        5,
      ),
      joined([
        [0, 3],
        [5, 3],
      ]),
      joined([
        [0, 2],
        [5, 2],
      ]),
      joined(
        [
          [0, 4],
          [6, 4],
        ],
        "action",
        true,
      ),
      toward([1, 0], [1, 3], "action"),
      toward([2, 0], [2, 2], "result"),
      toward([3, 4], [3, 2], "action"),
      toward([4, 4], [4, 3], "result"),
      tag([1, 1], "R = 3", "e"),
      tag([2, 1], "r = 2", "e"),
      tag([3, 3.5], "R = 2", "e"),
      tag([4, 3.5], "r = 1", "e"),
      tag([6, 4], "y = 4", "n"),
    ],
    "For example, the band between g = 2 and f = 3. About y = 0, below it, R = 3 and r = 2. About y = 4, above it, R = 4 − 2 = 2 and r = 4 − 3 = 1: the lower curve is now the farther one.",
    "例如，g = 2 与 f = 3 之间的带形。绕下方的 y = 0：R = 3，r = 2。绕上方的 y = 4：R = 4 − 2 = 2，r = 4 − 3 = 1，此时下面的曲线较远。",
  ),
  "volumes-of-revolution-using-the-washer-method-rotation-about-other-axes#the-volume-of-a-torus-from-the-theorem-of-pappus": graphed(
    wide(-5, 5, -3, 3),
    [
      { kind: "circle", center: [3, 0], r: 1, tone: "result" },
      { kind: "circle", center: [-3, 0], r: 1, dashed: true },
      hoop([0, 0], 3, 0.9, "action", true),
      bare([3, 0]),
      joined(
        [
          [0, 0],
          [3, 0],
        ],
        "action",
      ),
      tag([1.5, 0], "R = 3", "n"),
      tag([3.7, 0.7], "r = 1", "ne"),
    ],
    "For example, a disc of radius r = 1 whose center is R = 3 from the axis. The center travels 2π · 3 = 6π, and the area is π, so the torus has volume π · 6π = 6π².",
    "例如，半径 r = 1 的圆盘，圆心到轴的距离 R = 3。圆心走过 2π · 3 = 6π，面积为 π，所以环面体积为 π · 6π = 6π²。",
  ),
  "volumes-of-revolution-using-the-washer-method-rotation-about-other-axes#washers-about-a-drawn-axis": graphed(
    wide(-1, 4, -2, 3),
    [
      between(
        () => 2,
        () => 1,
        0,
        3,
      ),
      joined([
        [0, 1],
        [3, 1],
        [3, 2],
        [0, 2],
        [0, 1],
      ]),
      joined(
        [
          [-0.5, -1],
          [3.5, -1],
        ],
        "action",
        true,
      ),
      toward([1, -1], [1, 2], "action"),
      toward([2, -1], [2, 1], "result"),
      tag([1, 0.5], "R = 3", "w"),
      tag([2, 0.2], "r = 2", "e"),
      tag([3.5, -1], "axis y = −1", "s"),
    ],
    "For example, the rectangle between y = 1 and y = 2 rotated about y = −1. The outer radius reaches the far edge, R = 3, and the inner radius reaches the near edge, r = 2, so a slice has area π(9 − 4) = 5π.",
    "例如，y = 1 与 y = 2 之间的矩形绕 y = −1 旋转。外半径到远边 R = 3，内半径到近边 r = 2，所以截面面积为 π(9 − 4) = 5π。",
  ),
  "the-shell-method-rotating-a-region-about-the-x-axis#shells-about-a-line-below-the-axis": graphed(
    wide(-1, 6, -2, 3),
    [
      shape(
        count(0, 2, 0.05)
          .map((y): Point => [y * y, y])
          .concat([[4, 0]]),
        "result",
      ),
      joined(count(0, 2, 0.05).map((y): Point => [y * y, y])),
      joined([
        [4, 0],
        [4, 2],
      ]),
      joined(
        [
          [1, 1],
          [4, 1],
        ],
        "action",
      ),
      joined(
        [
          [-0.5, -1],
          [5.5, -1],
        ],
        "action",
        true,
      ),
      toward([2.5, -1], [2.5, 1], "result"),
      tag([2.5, -0.5], "y + 1 = 2", "e"),
      tag([3.2, 1], "length 3", "n"),
      tag([5.5, -1], "y = −1", "s"),
    ],
    "For example, the region between x = y², x = 4 and the x-axis, rotated about y = −1. The strip at height y = 1 has radius y + 1 = 2, not 1, while the height of the shell is the strip length 4 − 1 = 3, which does not change.",
    "例如，x = y²、x = 4 与 x 轴围成的区域绕 y = −1 旋转。高度 y = 1 处的窄条半径为 y + 1 = 2，不是 1；壳的高是窄条长度 4 − 1 = 3，保持不变。",
  ),
  "the-shell-method-rotation-about-the-y-axis#shells-under-a-curve": graphed(
    wide(-3, 3, -1, 5),
    [
      area((x) => x * x, 0, 2),
      curveOf((x) => x * x, undefined, 0, 2),
      curveOf((x) => x * x, undefined, -2, 0, true),
      hoop([0, 0], 1, 0.25, "action"),
      hoop([0, 1], 1, 0.25, "action"),
      joined(
        [
          [1, 0],
          [1, 1],
        ],
        "action",
      ),
      joined(
        [
          [-1, 0],
          [-1, 1],
        ],
        "action",
      ),
      tag([1, 0.5], "1", "e"),
      tag([0.5, -0.3], "x = 1", "s"),
      tag([1.2, 2], "y = x²", "nw"),
    ],
    "Rotating the region under y = x² on [0, 2] about the y-axis. The strip at x = 1 has radius 1 and height 1 and sweeps out a thin shell. In all, V = 2π∫₀² x³ dx = 8π.",
    "把 [0, 2] 上 y = x² 下方的区域绕 y 轴旋转。x = 1 处的窄条半径 1、高 1，扫出一个薄壳。总体积 V = 2π∫₀² x³ dx = 8π。",
  ),
  "the-shell-method-rotation-about-the-y-axis#shells-about-a-line-other-than-the-y-axis": graphed(
    wide(-3, 3, -1, 5),
    [
      area((x) => x * x, 0, 2),
      curveOf((x) => x * x, undefined, 0, 2),
      joined(
        [
          [-1, -0.5],
          [-1, 4.5],
        ],
        "action",
        true,
      ),
      joined(
        [
          [1, 0],
          [1, 1],
        ],
        "action",
      ),
      toward([-1, 2], [1, 2], "result"),
      tag([0.3, 2], "2", "n"),
      tag([-1, 4.3], "x = −1", "w"),
      tag([1, 0.5], "1", "e"),
    ],
    "For example, h = 1 and y = x² on [0, 2], rotated about x = −1. The strip at x = 1 has radius x + 1 = 2, while its height is still 1. So V = 2π∫₀² (x + 1)x² dx = 40π/3.",
    "例如，h = 1，[0, 2] 上的 y = x² 绕 x = −1 旋转。x = 1 处的窄条半径为 x + 1 = 2，高仍为 1。所以 V = 2π∫₀² (x + 1)x² dx = 40π/3。",
  ),
  "the-shell-method-rotation-about-the-y-axis#shells-of-a-drawn-rectangle": graphed(
    wide(-4, 4, -1, 3),
    [
      area(() => 2, 1, 3),
      joined([
        [1, 0],
        [1, 2],
        [3, 2],
        [3, 0],
        [1, 0],
      ]),
      joined(
        [
          [-1, 0],
          [-1, 2],
          [-3, 2],
          [-3, 0],
          [-1, 0],
        ],
        undefined,
        true,
      ),
      joined(
        [
          [2, 0],
          [2, 2],
        ],
        "action",
      ),
      joined(
        [
          [-2, 0],
          [-2, 2],
        ],
        "action",
        true,
      ),
      hoop([0, 2], 2, 0.5, "action"),
      tag([1, 2.45], "radius x = 2", "ne"),
      tag([2, 1], "2", "e"),
    ],
    "For example, the rectangle 1 ≤ x ≤ 3, 0 ≤ y ≤ 2 rotated about the y-axis. Each strip has height 2 and radius x, which grows across the region, so V = 2π∫₁³ 2x dx = 16π.",
    "例如，矩形 1 ≤ x ≤ 3、0 ≤ y ≤ 2 绕 y 轴旋转。每个窄条高 2、半径 x，半径在区域内逐渐增大，所以 V = 2π∫₁³ 2x dx = 16π。",
  ),
  "surface-areas-of-revolution-rotation-about-the-x-axis#surfaces-from-line-segments": graphed(
    wide(-1, 3, -2, 2),
    [
      joined(
        [
          [0, 0],
          [1, 1],
        ],
        "result",
      ),
      joined(
        [
          [0, 0],
          [1, -1],
        ],
        undefined,
        true,
      ),
      hoop([1, 0], 0.3, 1),
      tag([0.5, 0.5], "√2", "nw"),
      tag([1.35, 0.5], "r = 1", "e"),
    ],
    "Rotating y = x, 0 ≤ x ≤ 1, about the x-axis gives a cone with radius 1 and slant height √2. The integral gives S = √2π, the lateral area π · 1 · √2.",
    "把 y = x（0 ≤ x ≤ 1）绕 x 轴旋转得半径 1、斜高 √2 的圆锥。积分得 S = √2π，即侧面积 π · 1 · √2。",
  ),
  "surface-areas-of-revolution-rotation-about-the-x-axis#surfaces-from-curves": graphed(
    wide(-3, 3, -3, 3),
    [
      { kind: "circle", center: [0, 0], r: 2 },
      curveOf((x) => sqrt(4 - x * x), "action", 0, 1),
      curveOf((x) => -sqrt(4 - x * x), "action", 0, 1),
      hoop([0, 0], 0.6, 2, "action", true),
      hoop([1, 0], 0.3 * sqrt(3), sqrt(3), "action"),
      tag([0.9, 2.1], "2π · 2 · 1 = 4π", "ne"),
    ],
    "For example, r = 2: the zone of the sphere between x = 0 and x = 1 has area 2πr(b − a) = 2π · 2 · 1 = 4π, because f√(1 + f′²) is the constant r.",
    "例如，r = 2：球面在 x = 0 与 x = 1 之间的球带面积为 2πr(b − a) = 2π · 2 · 1 = 4π，因为 f√(1 + f′²) 是常数 r。",
  ),
  "surface-areas-of-revolution-rotation-about-the-x-axis#the-length-of-a-segment-from-its-surface-area": graphed(
    wide(-1, 6, -4, 4),
    [
      joined(
        [
          [0, 0],
          [4, 3],
        ],
        "result",
      ),
      joined(
        [
          [0, 0],
          [4, -3],
        ],
        undefined,
        true,
      ),
      hoop([4, 0], 0.9, 3),
      tag([2, 1.5], "ℓ = 5", "nw"),
      tag([4.95, 1.5], "r = 3", "e"),
      tag([2.5, -0.7], "b = 4", "s"),
    ],
    "For example, y = (3/4)x up to x = b: S = 2π∫₀ᵇ (3/4)(5/4)x dx = 15πb²/16. If S = 15π, then b = 4, and the cone with r = 3 and ℓ = 5 checks: πrℓ = 15π.",
    "例如，y = (3/4)x 到 x = b：S = 2π∫₀ᵇ (3/4)(5/4)x dx = 15πb²/16。若 S = 15π，则 b = 4，r = 3、ℓ = 5 的圆锥验证：πrℓ = 15π。",
  ),
  "surface-areas-of-revolution-rotation-about-the-y-axis#rotating-y-as-a-function-of-x-about-the-y-axis": graphed(
    wide(-2, 2, -1, 2),
    [
      curveOf((x) => x * x, "result", 0, 1),
      curveOf((x) => x * x, undefined, -1, 0, true),
      hoop([0, 1], 1, 0.25),
      hoop([0, 0.36], 0.6, 0.15, "action"),
      joined(
        [
          [0, 0.36],
          [0.6, 0.36],
        ],
        "action",
      ),
      tag([0.3, 0.36], "x", "n"),
    ],
    "Rotating y = x², 0 ≤ x ≤ 1, about the y-axis: a piece of the curve at x is at distance x from the axis, so S = 2π∫₀¹ x√(1 + 4x²) dx = (π/6)(5√5 − 1).",
    "把 y = x²（0 ≤ x ≤ 1）绕 y 轴旋转：曲线在 x 处的一小段到轴的距离为 x，所以 S = 2π∫₀¹ x√(1 + 4x²) dx = (π/6)(5√5 − 1)。",
  ),
  "surface-areas-of-revolution-rotation-about-the-y-axis#rotating-x-as-a-function-of-y-about-the-y-axis": graphed(
    wide(-3, 3, -3, 3),
    [
      { kind: "circle", center: [0, 0], r: 2 },
      joined(
        count(0, 1, 0.05).map((y): Point => [sqrt(4 - y * y), y]),
        "action",
      ),
      hoop([0, 0], 2, 0.6, "action", true),
      hoop([0, 1], sqrt(3), 0.3 * sqrt(3), "action"),
      tag([2, 0.5], "x = √(4 − y²)", "e"),
    ],
    "For example, r = 2: the curve x = √(4 − y²) has g√(1 + g′²) = 2, the same constant as for the circle rotated about the x-axis. So the band from y = 0 to y = 1 has area 2π · 2 · 1 = 4π.",
    "例如，r = 2：曲线 x = √(4 − y²) 满足 g√(1 + g′²) = 2，与圆绕 x 轴旋转时的常数相同。所以 y = 0 到 y = 1 的带面积为 2π · 2 · 1 = 4π。",
  ),
  "surface-areas-of-revolution-rotation-about-the-y-axis#the-same-curve-about-the-other-axis": drawing(
    [
      ...pane(0, [0, 3, 1], [0, 4, 1], 5, 5)
        .path(
          [
            [0, 1],
            [2, 3],
          ],
          "result",
        )
        .path(
          [
            [1, 0],
            [1, 2],
          ],
          "action",
        )
        .dot(1, 2)
        .say(1, 1, "y = 2", "e")
        .say(1.5, -0.8, "about the x-axis", "s")
        .marks(),
      ...pane(8.5, [0, 3, 1], [0, 4, 1], 5, 5)
        .path(
          [
            [0, 1],
            [2, 3],
          ],
          "result",
        )
        .path(
          [
            [0, 2],
            [1, 2],
          ],
          "action",
        )
        .dot(1, 2)
        .say(0.5, 2, "x = 1", "n")
        .say(1.5, -0.8, "about the y-axis", "s")
        .marks(),
    ],
    "For example, the segment y = x + 1 for 0 ≤ x ≤ 2 has ds = √2 dx both ways. At (1, 2), the radius is y = 2 around the x-axis, giving S = 8√2π in all, and x = 1 around the y-axis, giving S = 4√2π.",
    "例如，线段 y = x + 1（0 ≤ x ≤ 2）两种情况都是 ds = √2 dx。在 (1, 2) 处，绕 x 轴半径为 y = 2，总面积 S = 8√2π；绕 y 轴半径为 x = 1，总面积 S = 4√2π。",
  ),
};
