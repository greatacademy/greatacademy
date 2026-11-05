// Drawings in the explanations of the parabolas of Algebra II: every curve, vertex, focus and directrix
// is recomputed from the equation in the text.

import type { Figure } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { curveOf, tag } from "./explanation-drawings-charts.ts";
import { across, bare, conic, upright, wide } from "./explanation-drawings-curves.ts";
import { ln, pt } from "./explanation-drawings-geometry-2.ts";
import { graphed } from "./explanation-drawings-kit.ts";

const up = (h: number, k: number, p: number): PlaneMark => conic((x, y) => (x - h) ** 2 - 4 * p * (y - k));
const sideways = (h: number, k: number, p: number): PlaneMark => conic((x, y) => (y - k) ** 2 - 4 * p * (x - h));
const dashTo = (a: Point, b: Point): PlaneMark => ({ kind: "segment", a, b, tone: "action", dashed: true });

/** conicDrawings are drawings in the explanations of the parabolas of Algebra II, by topic and knowledge point. */
export const conicDrawings: Readonly<Record<string, Figure>> = {
  "upward-and-downward-opening-parabolas#opening-up-or-down": graphed(
    wide(-6, 6, -6, 6),
    [
      up(0, 0, 1.5),
      curveOf((x) => (-x * x) / 6, undefined, undefined, undefined, true),
      tag([4.2, 3], "x² = 6y", "w"),
      tag([4.2, -3], "x² = −6y", "w"),
    ],
    "x² = 6y opens up. x² = −6y, dashed, has a negative coefficient and opens down.",
    "x² = 6y 开口向上。x² = −6y（虚线）的系数为负，开口向下。",
  ),
  "upward-and-downward-opening-parabolas#equation-from-a-graph": graphed(
    wide(-4, 6, -3, 6),
    [up(1, -2, 0.5), pt([1, -2], "(1, −2)", "s", "result"), pt([3, 0], "(3, 0)", "e", "result")],
    "With vertex (1, −2) and the point (3, 0): 2² = 4p · 2, so the parabola is (x − 1)² = 2(y + 2).",
    "顶点为 (1, −2)，并过点 (3, 0)：2² = 4p · 2，所以抛物线是 (x − 1)² = 2(y + 2)。",
  ),
  "left-and-right-opening-parabolas#points-on-a-horizontal-parabola": graphed(
    wide(-1, 9, -3, 4),
    [sideways(2, 1, 0.25), pt([2, 1], "(2, 1)", "w", "result"), pt([6, -1], "(6, −1)", "se")],
    "x = y² − 2y + 3 opens to the right from (2, 1). At y = −1 it gives x = 1 + 2 + 3 = 6.",
    "x = y² − 2y + 3 从 (2, 1) 向右开口。y = −1 时，x = 1 + 2 + 3 = 6。",
  ),
  "left-and-right-opening-parabolas#horizontal-equation-from-a-graph": graphed(
    wide(-3, 6, -2, 7),
    [sideways(-1, 2, 0.5), pt([-1, 2], "(−1, 2)", "w", "result"), pt([1, 4], "(1, 4)", "e", "result")],
    "With vertex (−1, 2) and the point (1, 4): 2² = 4p · 2, so the parabola is (y − 2)² = 2(x + 1).",
    "顶点为 (−1, 2)，并过点 (1, 4)：2² = 4p · 2，所以抛物线是 (y − 2)² = 2(x + 1)。",
  ),
  "the-vertex-of-a-parabola#vertex-of-a-vertical-parabola": graphed(
    wide(-10, 4, -1, 10),
    [up(-3, 5, 2), pt([-3, 5], "(−3, 5)", "s", "result")],
    "(x + 3)² = 8(y − 5) has its vertex at (−3, 5) and opens up.",
    "(x + 3)² = 8(y − 5) 的顶点在 (−3, 5)，开口向上。",
  ),
  "the-vertex-of-a-parabola#vertex-of-a-horizontal-parabola": graphed(
    wide(-6, 6, -4, 6),
    [conic((x, y) => x - 2 * (y - 1) ** 2 + 4), pt([-4, 1], "(−4, 1)", "w", "result")],
    "x = 2(y − 1)² − 4 has its vertex at (−4, 1) and opens to the right.",
    "x = 2(y − 1)² − 4 的顶点在 (−4, 1)，向右开口。",
  ),
  "the-vertex-of-a-parabola#the-axis-of-symmetry": graphed(
    wide(-8, 4, -8, 4),
    [sideways(1, -2, -1.5), across(-2, "action"), pt([1, -2], "(1, −2)", "ne", "result"), tag([-6, -2], "y = −2", "n")],
    "(y + 2)² = −6(x − 1) opens to the left from (1, −2). Its axis of symmetry is the horizontal line y = −2.",
    "(y + 2)² = −6(x − 1) 从 (1, −2) 向左开口。对称轴是水平直线 y = −2。",
  ),
  "calculating-the-vertex-of-a-parabola-by-completing-the-square#completing-the-square-in-y": graphed(
    wide(-5, 6, -3, 7),
    [conic((x, y) => x - (y - 2) ** 2 + 3), pt([-3, 2], "(−3, 2)", "w", "result")],
    "Completing the square gives x = (y − 2)² − 3, with vertex (−3, 2).",
    "配方得 x = (y − 2)² − 3，顶点为 (−3, 2)。",
  ),
  "calculating-the-vertex-of-a-parabola-by-completing-the-square#with-a-leading-coefficient": graphed(
    wide(-7, 5, -7, 1),
    [conic((x, y) => x - 2 * (y + 3) ** 2 + 5), pt([-5, -3], "(−5, −3)", "w", "result")],
    "Taking out the coefficient 2 first gives x = 2(y + 3)² − 5, with vertex (−5, −3).",
    "先提出系数 2，得 x = 2(y + 3)² − 5，顶点为 (−5, −3)。",
  ),
  "calculating-the-vertex-of-a-parabola-by-completing-the-square#from-the-general-form": graphed(
    wide(-4, 10, -4, 8),
    [up(3, -2, 1), pt([3, -2], "(3, −2)", "s", "result")],
    "The general form rewrites as (x − 3)² = 4(y + 2), with vertex (3, −2).",
    "一般式可改写为 (x − 3)² = 4(y + 2)，顶点为 (3, −2)。",
  ),
  "the-focus-directrix-property-of-a-parabola#is-the-point-on-the-parabola": graphed(
    wide(-6, 8, -3, 7),
    [
      up(1, 0, 2),
      across(-2, "action"),
      tag([-4, -2], "y = −2", "s"),
      pt([1, 2], "F(1, 2)", "s", "result"),
      pt([5, 3], "P(5, 3)", "nw"),
      dashTo([1, 2], [5, 3]),
      dashTo([5, 3], [5, -2]),
    ],
    "P(5, 3) is √17 from the focus F(1, 2) but 5 from the line y = −2, so it is not on the parabola (x − 1)² = 8y.",
    "P(5, 3) 到焦点 F(1, 2) 的距离是 √17，到直线 y = −2 的距离是 5，所以它不在抛物线 (x − 1)² = 8y 上。",
  ),
  "the-focus-directrix-property-of-a-parabola#equation-from-the-focus-and-directrix": graphed(
    wide(-6, 10, -4, 6),
    [up(2, -1, 2), across(-3, "action"), tag([-3, -3], "y = −3", "s"), pt([2, 1], "F(2, 1)", "e", "result"), pt([2, -1], "V(2, −1)", "se")],
    "The vertex (2, −1) is halfway between the focus (2, 1) and the directrix y = −3, with p = 2: (x − 2)² = 8(y + 1).",
    "顶点 (2, −1) 位于焦点 (2, 1) 和准线 y = −3 的正中间，p = 2：(x − 2)² = 8(y + 1)。",
  ),
  "calculating-the-focus-of-a-parabola#focus-from-the-conic-form": graphed(
    wide(-9, 7, -8, 6),
    [up(-1, 4, -3), pt([-1, 4], "(−1, 4)", "nw"), pt([-1, 1], "F(−1, 1)", "w", "result")],
    "(x + 1)² = −12(y − 4) opens down with p = −3, so the focus is 3 below the vertex (−1, 4), at (−1, 1).",
    "(x + 1)² = −12(y − 4) 开口向下，p = −3，所以焦点在顶点 (−1, 4) 下方 3 个单位，即 (−1, 1)。",
  ),
  "calculating-the-focus-of-a-parabola#focus-from-the-vertex-form": graphed(
    wide(1, 5, 0, 4),
    [conic((x, y) => y - 2 * (x - 3) ** 2 - 1), pt([3, 1], "(3, 1)", "s"), bare([3, 9 / 8], "result"), tag([3.25, 1.25], "F(3, 9/8)", "e")],
    "y = 2(x − 3)² + 1 has vertex (3, 1) and p = 1/8, so the focus (3, 9/8) is just above the vertex.",
    "y = 2(x − 3)² + 1 的顶点是 (3, 1)，p = 1/8，所以焦点 (3, 9/8) 就在顶点上方不远处。",
  ),
  "calculating-the-focus-of-a-parabola#focus-from-the-general-form": graphed(
    wide(-1, 9, -8, 4),
    [sideways(2, -2, 2), pt([2, -2], "(2, −2)", "sw"), pt([4, -2], "F(4, −2)", "e", "result")],
    "(y + 2)² = 8(x − 2) opens to the right with p = 2: the focus is 2 to the right of the vertex (2, −2), at (4, −2).",
    "(y + 2)² = 8(x − 2) 向右开口，p = 2：焦点在顶点 (2, −2) 右方 2 个单位，即 (4, −2)。",
  ),
  "calculating-the-directrix-of-a-parabola#directrix-from-the-conic-form": graphed(
    wide(-5, 5, -5, 7),
    [sideways(-2, 1, 1.5), upright(-3.5, "action"), tag([-3.5, 6], "x = −7/2", "w"), pt([-2, 1], "(−2, 1)", "e", "result")],
    "(y − 1)² = 6(x + 2) has p = 3/2, so its directrix is 3/2 to the left of the vertex (−2, 1): x = −7/2.",
    "(y − 1)² = 6(x + 2) 的 p = 3/2，所以准线在顶点 (−2, 1) 左方 3/2 个单位：x = −7/2。",
  ),
  "calculating-the-directrix-of-a-parabola#directrix-from-the-vertex-form": graphed(
    wide(-8, 6, -4, 7),
    [
      conic((x, y) => y + (x + 1) ** 2 / 8 - 3),
      across(5, "action"),
      tag([4, 5], "y = 5", "n"),
      pt([-1, 3], "(−1, 3)", "nw"),
      pt([-1, 1], "F(−1, 1)", "w", "result"),
    ],
    "y = −⅛(x + 1)² + 3 opens down with p = −2: the focus is at (−1, 1), and the directrix y = 5 is 2 above the vertex (−1, 3).",
    "y = −⅛(x + 1)² + 3 开口向下，p = −2：焦点在 (−1, 1)，准线 y = 5 在顶点 (−1, 3) 上方 2 个单位。",
  ),
  "calculating-the-directrix-of-a-parabola#directrix-from-the-vertex-and-focus": graphed(
    wide(-7, 11, -3, 9),
    [up(2, 1, 3), across(-2, "action"), tag([-5, -2], "y = −2", "s"), pt([2, 1], "V(2, 1)", "e"), pt([2, 4], "F(2, 4)", "e", "result")],
    "The focus (2, 4) is 3 above the vertex (2, 1), so the directrix is 3 below it, y = −2, and the parabola is (x − 2)² = 12(y − 1).",
    "焦点 (2, 4) 在顶点 (2, 1) 上方 3 个单位，所以准线在顶点下方 3 个单位，即 y = −2，抛物线是 (x − 2)² = 12(y − 1)。",
  ),
  "calculating-intercepts-of-parabolas#the-x-intercept-of-a-horizontal-parabola": graphed(
    wide(-6, 3, -2, 6),
    [conic((x, y) => x + (y - 2) ** 2 - 1), pt([-3, 0], "(−3, 0)", "nw", "result"), pt([1, 2], "(1, 2)", "e")],
    "x = −(y − 2)² + 1 crosses the x-axis, where y = 0, once: at x = −4 + 1 = −3.",
    "x = −(y − 2)² + 1 在 y = 0 处与 x 轴相交一次：x = −4 + 1 = −3。",
  ),
  "calculating-intercepts-of-parabolas#the-y-intercepts-of-a-horizontal-parabola": graphed(
    wide(-8, 4, -5, 5),
    [conic((x, y) => x - y * y + y + 6), pt([0, 3], "(0, 3)", "ne", "result"), pt([0, -2], "(0, −2)", "se", "result")],
    "x = y² − y − 6 meets the y-axis, where x = 0, at the two points (0, 3) and (0, −2).",
    "x = y² − y − 6 与 y 轴（x = 0）交于两点 (0, 3) 和 (0, −2)。",
  ),
  "calculating-intercepts-of-parabolas#x-intercepts-from-the-conic-form": graphed(
    wide(-5, 7, -4, 5),
    [
      up(1, -3, 1),
      pt([1, -3], "(1, −3)", "s"),
      pt([1 - 2 * Math.sqrt(3), 0], "1 − 2√3", "ne", "result"),
      pt([1 + 2 * Math.sqrt(3), 0], "1 + 2√3", "nw", "result"),
    ],
    "(x − 1)² = 4(y + 3) crosses the x-axis where (x − 1)² = 12: at x = 1 ± 2√3, about −2.46 and 4.46.",
    "(x − 1)² = 4(y + 3) 在 (x − 1)² = 12 处穿过 x 轴：x = 1 ± 2√3，约为 −2.46 和 4.46。",
  ),
  "intersections-of-parabolas-with-lines#vertical-lines": graphed(
    wide(-5, 9, -4, 6),
    [
      conic((x, y) => x - (y - 1) ** 2 + 3),
      upright(6, "action"),
      tag([6, 5.4], "x = 6", "e"),
      pt([6, 4], "(6, 4)", "w", "result"),
      pt([6, -2], "(6, −2)", "w", "result"),
    ],
    "The vertical line x = 6 meets the horizontal parabola x = (y − 1)² − 3 at two points: (6, 4) and (6, −2).",
    "竖直线 x = 6 与水平开口的抛物线 x = (y − 1)² − 3 交于两点：(6, 4) 和 (6, −2)。",
  ),
  "intersections-of-parabolas-with-lines#counting-intersection-points": graphed(
    wide(-3, 9, -4, 4),
    [conic((x, y) => x - y * y - 3), ln([1, 0], [3, 1], "action"), tag([6.5, 3.2], "x − 2y = 1", "nw"), tag([5, -3], "x = y² + 3", "e")],
    "The line x − 2y = 1 misses the parabola x = y² + 3: the discriminant is negative.",
    "直线 x − 2y = 1 与抛物线 x = y² + 3 没有交点：判别式为负。",
  ),
};
