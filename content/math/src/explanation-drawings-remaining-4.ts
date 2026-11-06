// Drawings of the remaining explanations in the algebra shard: curves to tell apart by their key points, the unit circle, the number line and the area of triangles.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, toward } from "./explanation-drawings-charts.ts";
import { circleAxes, spoke, sweep, wide } from "./explanation-drawings-curves.ts";
import { dash, hop, numberLine } from "./explanation-drawings-exam-kit.ts";
import { ln, pt, shift } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note, seg, square } from "./explanation-drawings-kit.ts";
import { dot } from "./explanation-drawings-remaining-kit.ts";

/** turn draws the unit circle with the turn of an angle and the spoke it ends on. */
const turn = (degrees: number): Mark[] => [...circleAxes(3, false), spoke(degrees, 3, "result"), ...sweep(degrees)];

const between = numberLine(2, 5);
const sameSigns = numberLine(-15, 0, 3);
const differentSigns = numberLine(-11, 1, 4);
const minusPositive = numberLine(-5, 3);
const minusNegative = numberLine(-9, 0, 3);
const across = numberLine(-3, 4);

const base: Point = [0, 0];
const baseEnd: Point = [10, 0];
const apex: Point = [3, 7];

/** remainingDrawings4 draws more of the explanations of the algebra shard that earlier tables leave out: curves to tell apart by their key points, the unit circle, the number line and the area of triangles. */
export const remainingDrawings4: Readonly<Record<string, Figure>> = {
  "graphing-elementary-cubic-functions#choosing-the-drawing-of-a-cubic": graphed(
    wide(-3, 5, -4, 7, 99),
    [
      curveOf((x) => x ** 3, undefined, -1.55, 1.9, true),
      curveOf((x) => (x - 1) ** 3 + 2, "result", -0.8, 2.7),
      toward([0, 0], [1, 2], "action"),
      pt([1, 2], "(1, 2)", "e", "result"),
    ],
    "For example, y = (x − 1)³ + 2 is the dashed curve y = x³ with its center moved to the colored point (1, 2). It rises from left to right.",
    "例如，y = (x − 1)³ + 2 是虚线曲线 y = x³ 把中心移到标色的点 (1, 2)。它从左到右上升。",
  ),
  "one-to-one-functions#one-to-one-from-a-formula": drawing(
    [
      ...pane(0, [-2, 2, 99], [-4, 4, 99], 4, 4, "x", "y")
        .f((x) => x ** 3, -1.58, 1.58)
        .level(1, "action")
        .dot(1, 1, "", "e", "result")
        .marks(),
      ...pane(6, [0, 5, 99], [0, 6, 99], 4, 4, "x", "y")
        .f((x) => (x - 2) ** 2 + 1, 0, 4)
        .level(2, "action")
        .dot(1, 2, "", "w", "result")
        .dot(3, 2, "", "e", "result")
        .marks(),
    ],
    "For example, y = x³ on the left always rises, so a level line meets it at one colored point. The parabola y = (x − 2)² + 1 on the right has f(1) = f(3), so a level line can meet it at two.",
    "例如，左图的 y = x³ 一直上升，所以水平线与它只交于一个标色的点。右图的抛物线 y = (x − 2)² + 1 有 f(1) = f(3)，所以水平线可以与它交于两点。",
  ),
  "graphs-of-inverse-functions#choosing-the-graph-of-an-inverse": graphed(
    wide(-3, 7, -3, 7, 99),
    [
      ln([0, 0], [1, 1], undefined, true),
      curveOf((x) => 2 ** x, undefined, -3, 2.75),
      curveOf((x) => Math.log2(x), "result", 0.13, 6.8),
      pt([2, 4], "(2, 4)", "nw"),
      pt([4, 2], "(4, 2)", "se", "result"),
    ],
    "For example, y = 2ˣ and, in color, its inverse y = log₂ x. Swapping the coordinates of (2, 4) gives (4, 2), and the whole graph is reflected across the dashed line y = x.",
    "例如，y = 2ˣ 和标色的反函数 y = log₂ x。交换 (2, 4) 的坐标得到 (4, 2)，整个图象关于虚线 y = x 反射。",
  ),
  "graphs-of-inverse-functions#marking-a-point-of-the-inverse": graphed(
    wide(-2, 6, -2, 6, 99),
    [
      ln([0, 0], [1, 1], undefined, true),
      ln([0, 1], [1, 3]),
      ln([1, 0], [3, 1], "result"),
      dash([1, 3], [3, 1], "action"),
      pt([1, 3], "(1, 3)", "nw"),
      pt([3, 1], "(3, 1)", "se", "result"),
    ],
    "For example, f(x) = 2x + 1 has f(1) = 3, so its inverse, in color, has the point (3, 1). The two points are mirror images across the dashed line y = x.",
    "例如，f(x) = 2x + 1 有 f(1) = 3，所以标色的反函数过点 (3, 1)。这两点关于虚线 y = x 互为镜像。",
  ),
  "graphing-logarithmic-functions#choosing-the-drawing-of-a-logarithm": graphed(
    wide(-1, 8, -4, 6, 99),
    [
      ln([1, 0], [1, 1], undefined, true),
      curveOf((x) => Math.log2(x - 1) + 2, undefined, 1.02, 8),
      pt([2, 2], "(2, 2)", "se", "result"),
      pt([3, 3], "(3, 3)", "nw", "result"),
    ],
    "For example, y = log₂(x − 1) + 2, with h = 1, k = 2 and b = 2. It never touches the dashed line x = 1 and passes through the colored points (2, 2) and (3, 3).",
    "例如，y = log₂(x − 1) + 2，其中 h = 1，k = 2，b = 2。它不与虚线 x = 1 相交，并过标色的点 (2, 2) 和 (3, 3)。",
  ),
  "graphing-the-square-root-function#choosing-the-drawing-of-a-square-root": graphed(
    wide(-1, 8, -3, 6, 99),
    [
      curveOf((x) => Math.sqrt(x - 2) + 1, undefined, 2, 8),
      curveOf((x) => 1 - Math.sqrt(x - 2), "action", 2, 8),
      pt([2, 1], "(2, 1)", "w", "result"),
      pt([3, 2], "(3, 2)", "nw"),
      pt([6, 3], "(6, 3)", "nw"),
    ],
    "For example, y = √(x − 2) + 1 starts at the colored point (2, 1) and bends to the right through (3, 2) and (6, 3). The other color has a minus sign in front of the root and goes down from the same point.",
    "例如，y = √(x − 2) + 1 从标色的点 (2, 1) 开始，向右弯曲，经过 (3, 2) 和 (6, 3)。另一种颜色的曲线在根号前有负号，从同一点向下。",
  ),
  "finding-trigonometric-ratios-of-quadrantal-angles#tangent-and-reciprocal-ratios-of-quadrantal-angles": drawing(
    [...turn(90), note([0, 3.3], "(0, 1)", "e")],
    "A turn of 90° ends at the point (0, 1) of the unit circle. There x = 0, so tan 90° and sec 90° divide by 0 and are undefined.",
    "旋转 90° 终止于单位圆上的点 (0, 1)。此处 x = 0，所以 tan 90° 和 sec 90° 的分母为 0，无定义。",
  ),
  "finding-trigonometric-ratios-of-quadrantal-angles#expressions-with-quadrantal-angles": drawing(
    [...turn(270), note([0, -3], "(0, −1)", "se"), ...shift([...turn(180), note([-3, 0], "(−1, 0)", "nw")], 11)],
    "Left: a turn of 270° ends at (0, −1), so sin 270° = −1. Right: a turn of 180° ends at (−1, 0), so cos 180° = −1.",
    "左图：旋转 270° 终止于 (0, −1)，所以 sin 270° = −1。右图：旋转 180° 终止于 (−1, 0)，所以 cos 180° = −1。",
  ),
  "trigonometric-ratios-of-quadrantal-angles-outside-the-standard-range#a-combination-at-a-quadrantal-angle": drawing(
    [...turn(450), note([0, 3.3], "(0, 1)", "e")],
    "For example, 450° is a full turn and 90° more, so it ends at the same point (0, 1) as 90°.",
    "例如，450° 是一整周再加 90°，所以它和 90° 一样终止于点 (0, 1)。",
  ),
  "graphing-sine-and-cosine#choosing-the-drawing-of-a-wave": drawing(
    [
      ...pane(0, [0, 7, 99], [-2, 4, 1], 4.4, 4, "x", "y")
        .f((x) => 2 * Math.sin(x) + 1, 0, 6.6)
        .level(1)
        .dot(0, 1, "", "e", "result")
        .marks(),
      ...pane(6, [0, 7, 99], [-2, 4, 1], 4.4, 4, "x", "y")
        .f((x) => 2 * Math.cos(x) + 1, 0, 6.6)
        .level(1)
        .dot(0, 3, "", "e", "result")
        .marks(),
    ],
    "For example, A = 2 and k = 1. Both waves swing 2 above and below the line y = 1, between 3 and −1. At x = 0 the sine on the left is at the colored point on the middle line, and the cosine on the right at a colored peak.",
    "例如，A = 2，k = 1。两条波都在直线 y = 1 上下摆动 2，介于 3 和 −1 之间。在 x = 0 处，左图的正弦在中线上标色的点，右图的余弦在标色的波峰。",
  ),
  "mixed-numbers#whole-numbers-between-two-improper-fractions": drawing(
    [
      ...between.marks,
      dot(between.at(7 / 3)),
      note(between.at(7 / 3), "7/3", "n"),
      dot(between.at(17 / 4)),
      note(between.at(17 / 4), "17/4", "n"),
      dot(between.at(3), "result"),
      dot(between.at(4), "result"),
    ],
    "For example, 7/3 is 2 and 1/3, and 17/4 is 4 and 1/4. The whole numbers between them are the colored 3 and 4. The whole part 2 is below 7/3, so it does not count.",
    "例如，7/3 是 2 又 1/3，17/4 是 4 又 1/4。它们之间的整数是标色的 3 和 4。整数部分 2 小于 7/3，所以不算。",
  ),
  "adding-integers#same-signs": drawing(
    [...sameSigns.marks, ...hop(sameSigns, -6, -15, 0.45, "9", "action"), dot(sameSigns.at(-6)), dot(sameSigns.at(-15), "result")],
    "(−6) + (−9): start at −6 and move 9 units to the left, to land on the colored −15.",
    "(−6) + (−9)：从 −6 开始，向左移动 9 个单位，到达标色的 −15。",
  ),
  "adding-integers#different-signs": drawing(
    [
      ...differentSigns.marks,
      ...hop(differentSigns, -11, -7, 0.45, "4", "action"),
      dot(differentSigns.at(-11)),
      dot(differentSigns.at(-7), "result"),
    ],
    "(−11) + 4: start at −11 and move 4 units to the right, to land on the colored −7.",
    "(−11) + 4：从 −11 开始，向右移动 4 个单位，到达标色的 −7。",
  ),
  "subtracting-integers#subtracting-a-positive": drawing(
    [
      ...minusPositive.marks,
      ...hop(minusPositive, 3, -5, 0.45, "8", "action"),
      dot(minusPositive.at(3)),
      dot(minusPositive.at(-5), "result"),
    ],
    "3 − 8: start at 3 and move 8 units to the left, past 0, to land on the colored −5.",
    "3 − 8：从 3 开始，向左移动 8 个单位，越过 0，到达标色的 −5。",
  ),
  "subtracting-integers#subtracting-a-negative": drawing(
    [
      ...minusNegative.marks,
      ...hop(minusNegative, -9, -5, 0.45, "4", "action"),
      dot(minusNegative.at(-9)),
      dot(minusNegative.at(-5), "result"),
    ],
    "−9 − (−4): start at −9 and move 4 units to the right, to land on the colored −5.",
    "−9 − (−4)：从 −9 开始，向右移动 4 个单位，到达标色的 −5。",
  ),
  "subtracting-integers#the-distance-between-two-numbers": drawing(
    [
      ...across.marks,
      ...hop(across, -3, 0, 0.45, "3", "action"),
      ...hop(across, 0, 4, 0.45, "4", "action"),
      ...hop(across, -3, 4, 1.5, "7", "result"),
      dot(across.at(-3)),
      dot(across.at(4)),
    ],
    "For example, −3 and 4. Across zero the distance is the sum of their sizes, 3 + 4 = 7, in color.",
    "例如，−3 和 4。跨过零时，距离是它们大小之和，3 + 4 = 7，如彩色所示。",
  ),
  "area-of-triangles#half-base-times-height": drawing(
    [
      seg(base, baseEnd),
      seg(baseEnd, apex),
      seg(apex, base),
      seg([3, 0], apex, "action", true),
      square([3, 0], baseEnd, apex),
      seg(apex, [13, 7], undefined, true),
      seg([13, 7], baseEnd, undefined, true),
      note([6.5, 0], "10", "s"),
      note([3, 3], "7", "e"),
    ],
    "The triangle with base 10 and height 7, and a second copy, dashed, that completes a parallelogram with the same base and height. The triangle has half its area, 35.",
    "底为 10、高为 7 的三角形，以及一个虚线的副本，它们拼成底和高都相同的平行四边形。三角形的面积是它的一半，为 35。",
  ),
  "area-of-triangles#missing-base-or-height-of-a-triangle": drawing(
    [
      seg([0, 0], [12, 0]),
      seg([12, 0], [4, 5]),
      seg([4, 5], [0, 0]),
      seg([4, 0], [4, 5], "result", true),
      square([4, 0], [12, 0], [4, 5]),
      note([6, 0], "12", "s"),
      note([4, 2.5], "5", "w"),
      note([6.7, 1.4], "30", "n"),
    ],
    "A triangle with area 30 and base 12. The colored height is 5, since 12h = 60.",
    "面积为 30、底为 12 的三角形。标色的高是 5，因为 12h = 60。",
  ),
};
