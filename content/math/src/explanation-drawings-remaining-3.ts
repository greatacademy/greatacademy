// Drawings of the remaining explanations in the algebra shard: motions on a grid, graphs of systems, and graphs to tell apart by their key points.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { crossing, dash, vee } from "./explanation-drawings-exam-kit.ts";
import { ln, pt, shift } from "./explanation-drawings-geometry-2.ts";
import { angle, drawing, graphed, on, seg, square } from "./explanation-drawings-kit.ts";
import { circleOn, dot, outlineOn } from "./explanation-drawings-remaining-kit.ts";

/** framed draws a square panel of a drawing around the origin. */
const framed = (r: number): Mark[] => [seg([-r, -r], [r, -r]), seg([r, -r], [r, r]), seg([r, r], [-r, r]), seg([-r, r], [-r, -r])];

/** dashedOn draws the closed dashed outline through the points of a coordinate plane. */
const dashedOn = (points: readonly Point[], tone?: "action" | "result"): PlaneMark[] =>
  points.map((p, i) => dash(p, points[(i + 1) % points.length] as Point, tone));

/** linearPair draws a line and a ray with the angle deg on the right in one color, and its supplement in the other. */
const linearPair = (deg: number): Mark[] => [
  seg([-3, 0], [3, 0]),
  seg([0, 0], on(deg, 3)),
  angle([0, 0], on(0, 1), on(deg, 1), "action"),
  angle([0, 0], on(deg, 1), on(180, 1), "result"),
];

/** rightSplit draws a right angle split by a ray, with the part deg next to the horizontal in one color, and its complement in the other. */
const rightSplit = (deg: number): Mark[] => [
  seg([0, 0], [3, 0]),
  seg([0, 0], [0, 3]),
  seg([0, 0], on(deg, 3)),
  angle([0, 0], on(0, 1), on(deg, 1), "action"),
  angle([0, 0], on(deg, 1), on(90, 1), "result"),
];

const start: Point[] = [
  [1, 1],
  [3, 1],
  [1, 3],
];

/** remainingDrawings3 draws the explanations of the algebra shard that earlier tables leave out: motions on a grid, graphs of systems, and graphs to tell apart by their key points. */
export const remainingDrawings3: Readonly<Record<string, Figure>> = {
  "analyzing-graphs-of-linear-models#model-from-a-graph": drawing(
    pane(0, [0, 30, 10], [0, 500, 100], 6, 5, "t", "V")
      .f((t) => 400 - 15 * t, 0, 26.6)
      .dot(0, 400, "", "e", "result")
      .say(1.5, 440, "(0, 400)", "e")
      .dot(20, 100, "(20, 100)", "ne")
      .marks(),
    "The tank line through (0, 400) and (20, 100). It meets the vertical axis at the colored starting value 400 and falls 300 in 20 units, so V = −15t + 400.",
    "水箱的直线过 (0, 400) 和 (20, 100)。它与纵轴交于标色的起始值 400，20 个单位下降 300，所以 V = −15t + 400。",
  ),
  "translations-of-geometric-figures#choosing-the-drawing-of-a-translation": graphed(
    wide(-1, 8, -1, 6),
    [
      ...outlineOn(start),
      ...outlineOn(
        [
          [5, 2],
          [7, 2],
          [5, 4],
        ],
        "result",
      ),
      toward([1, 1], [5, 2], "action"),
      toward([3, 1], [7, 2], "action"),
      toward([1, 3], [5, 4], "action"),
    ],
    "For example, every vertex moves 4 right and 1 up, along equal arrows. The colored image has the same size and faces the same way.",
    "例如，每个顶点都向右移 4、向上移 1，箭头都相同。标色的像大小相同，朝向也相同。",
  ),
  "translations-of-geometric-figures#marking-the-image-of-a-vertex": graphed(
    wide(-1, 8, -1, 6),
    [
      ...outlineOn(start),
      ...dashedOn([
        [5, 3],
        [7, 3],
        [5, 5],
      ]),
      toward([3, 1], [7, 1], "action"),
      toward([7, 1], [7, 3], "action"),
      tag([5, 1], "4", "s"),
      tag([7, 2], "2", "e"),
      pt([3, 1], "", "n"),
      pt([7, 3], "(7, 3)", "ne", "result"),
    ],
    "For example, a move of 4 right and 2 up. Count across from the vertex (3, 1), then up, to reach the colored image (7, 3). The other vertices move the same way, as dashed.",
    "例如，向右移 4、向上移 2。从顶点 (3, 1) 先横着数，再向上数，到达标色的像 (7, 3)。其他顶点同样移动，如虚线所示。",
  ),
  "rotations-of-geometric-figures#choosing-the-drawing-of-a-rotation": graphed(
    wide(-5, 5, -5, 5, 99),
    [
      ...outlineOn([
        [1, 1],
        [4, 1],
        [1, 3],
      ]),
      ...outlineOn(
        [
          [-1, 1],
          [-1, 4],
          [-3, 1],
        ],
        "result",
      ),
      ...outlineOn(
        [
          [1, -1],
          [1, -4],
          [3, -1],
        ],
        "action",
      ),
    ],
    "A triangle in the first quadrant. A quarter turn counterclockwise about the origin carries it into the second quadrant, in one color, and a quarter turn clockwise into the fourth, in the other.",
    "第一象限内的三角形。绕原点逆时针旋转 90° 把它带到第二象限（一种颜色），顺时针旋转 90° 带到第四象限（另一种颜色）。",
  ),
  "reflections-in-the-coordinate-plane#choosing-the-drawing-of-a-reflection": graphed(
    wide(-1, 7, -1, 7, 99),
    [
      ln([0, 0], [1, 1], undefined, true),
      ...outlineOn([
        [1, 3],
        [1, 6],
        [3, 4],
      ]),
      ...outlineOn(
        [
          [3, 1],
          [6, 1],
          [4, 3],
        ],
        "result",
      ),
      tag([1, 3], "A", "w"),
      tag([1, 6], "B", "w"),
      tag([3, 4], "C", "ne"),
      tag([3, 1], "A′", "s"),
      tag([6, 1], "B′", "s"),
      tag([4, 3], "C′", "ne"),
    ],
    "For example, a reflection across the dashed line y = x. The coordinates swap, each point and its image are the same distance from the line, and going A, B, C turns the opposite way in the colored image.",
    "例如，关于虚线 y = x 反射。坐标互换，每个点和它的像到直线的距离相等，而按 A、B、C 的顺序，标色的像转向相反。",
  ),
  "reflections-in-the-coordinate-plane#marking-a-point-reflected-in-a-line": graphed(
    wide(-6, 6, -6, 6, 99),
    [
      ln([0, 0], [1, 1], undefined, true),
      ln([0, 0], [1, -1], undefined, true),
      dash([4, 1], [1, 4], "result"),
      dash([4, 1], [-1, -4], "action"),
      pt([4, 1], "(4, 1)", "e"),
      pt([1, 4], "(1, 4)", "ne", "result"),
      pt([-1, -4], "(−1, −4)", "w", "action"),
    ],
    "For example, (4, 1). Across y = x it goes to (1, 4), and across y = −x to (−1, −4). Each mirror, dashed, is halfway along the segment to the image and perpendicular to it.",
    "例如，(4, 1)。关于 y = x 反射到 (1, 4)，关于 y = −x 反射到 (−1, −4)。每条镜线（虚线）都在到像的线段的中点，并与它垂直。",
  ),
  "consistency-and-dependency#classifying-from-graphs": drawing(
    [
      ...framed(3),
      seg([-3, -2], [3, 1]),
      seg([-3, 2], [3, -1]),
      dot([1, 0], "result"),
      ...shift([...framed(3), seg([-3, -2], [3, 1]), seg([-3, 0], [3, 3])], 7),
      ...shift([...framed(3), seg([-3, -2], [3, 2], "result"), seg([-3, -2], [3, 2], undefined, true)], 14),
    ],
    "Left: lines that cross once, consistent and independent. Middle: parallel lines, inconsistent. Right: lines on top of each other, in color and dashed, consistent and dependent.",
    "左图：相交一次的直线，相容且独立。中图：平行线，不相容。右图：重合的直线（彩色和虚线），相容且相关。",
  ),
  "approximating-solutions-to-systems-of-nonlinear-equations#locating-a-solution-in-a-table": graphed(
    wide(-3, 4, -2, 7, 1),
    [
      curveOf((x) => x * x, undefined, -2.4, 2.5),
      ln([0, 1], [1, 2]),
      pt([1, 1], "", "n", "action"),
      pt([1, 2], "", "n", "action"),
      pt([2, 4], "", "n", "action"),
      pt([2, 3], "", "n", "action"),
      pt([(1 + Math.sqrt(5)) / 2, (3 + Math.sqrt(5)) / 2], "", "n", "result"),
      pt([(1 - Math.sqrt(5)) / 2, (3 - Math.sqrt(5)) / 2], "", "n", "result"),
    ],
    "For example, y = x² and y = x + 1. At x = 1 the parabola is below the line, at 1 and 2. At x = 2 it is above, at 4 and 3. So a solution, in color, lies in between. A second switch, between x = −1 and x = 0, gives the other one.",
    "例如，y = x² 和 y = x + 1。在 x = 1 时抛物线在直线下方（1 和 2）。在 x = 2 时在上方（4 和 3）。所以有一个解（标色）在两者之间。在 x = −1 和 x = 0 之间的另一次转换给出另一个解。",
  ),
  "absolute-value-graphs#choosing-the-drawing-of-an-absolute-value": graphed(
    wide(-3, 7, -4, 6, 99),
    [
      vee(2, 1, -2, 6),
      {
        kind: "path",
        points: [
          [-2, -3],
          [2, 1],
          [6, -3],
        ],
        tone: "action",
      },
      pt([2, 1], "(2, 1)", "e", "result"),
    ],
    "For example, y = |x − 2| + 1 is a V with its colored tip at (2, 1). A minus sign in front of the bars turns it upside down, as in the other color.",
    "例如，y = |x − 2| + 1 是一个 V 形，标色的尖点在 (2, 1)。绝对值符号前的负号把它倒过来，如另一种颜色所示。",
  ),
  "absolute-value-graphs#marking-the-corner-of-an-absolute-value-graph": graphed(
    wide(-6, 4, -1, 8, 99),
    [vee(-1, 3, -5.5, 3.5), pt([-1, 3], "(−1, 3)", "s", "result")],
    "For example, y = |x + 1| + 3. The inside is 0 at x = −1, and there y = 3, so the colored lowest point is (−1, 3).",
    "例如，y = |x + 1| + 3。当 x = −1 时绝对值内为 0，此时 y = 3，所以标色的最低点是 (−1, 3)。",
  ),
  "graphing-exponential-growth-functions#choosing-the-drawing-of-exponential-growth": graphed(
    wide(-5, 4, -1, 10, 99),
    [
      curveOf((x) => 2 * 2 ** x + 1, undefined, -5, 2),
      ln([0, 1], [1, 1], undefined, true),
      pt([0, 3], "(0, 3)", "se", "result"),
      pt([1, 5], "(1, 5)", "e"),
      tag([3, 1], "y = 1", "n"),
    ],
    "For example, y = 2 · 2ˣ + 1. It crosses the y-axis at the colored (0, 3), passes through (1, 5) and rises faster and faster. To the left it comes close to y = 1, dashed.",
    "例如，y = 2 · 2ˣ + 1。它与 y 轴交于标色的 (0, 3)，过 (1, 5)，向右上升越来越快。向左趋近虚线 y = 1。",
  ),
  "graphing-exponential-decay-functions#choosing-the-drawing-of-exponential-decay": graphed(
    wide(-3, 6, -1, 10, 99),
    [
      curveOf((x) => 3 * 0.5 ** x + 1, undefined, -1.5, 6),
      ln([0, 1], [1, 1], undefined, true),
      pt([0, 4], "(0, 4)", "ne", "result"),
      tag([5, 1], "y = 1", "s"),
    ],
    "For example, y = 3 · (1/2)ˣ + 1. It crosses the y-axis at the colored (0, 4) and falls to the right, coming close to y = 1, dashed. To the left it climbs steeply.",
    "例如，y = 3 · (1/2)ˣ + 1。它与 y 轴交于标色的 (0, 4)，向右下降，趋近虚线 y = 1。向左急剧上升。",
  ),
  "graphing-elementary-quadratic-functions#choosing-the-drawing-of-a-parabola": graphed(
    wide(-4, 4, -2, 7, 99),
    [curveOf((x) => 2 * x * x - 1, undefined, -1.9, 1.9), pt([0, -1], "(0, −1)", "se", "result"), pt([1, 1], "(1, 1)", "e", "action")],
    "For example, y = 2x² − 1. The vertex (0, c) is (0, −1), and at x = 1 the height a + c is 1. A positive a opens it upward.",
    "例如，y = 2x² − 1。顶点 (0, c) 是 (0, −1)，在 x = 1 处的高度 a + c 是 1。a 为正，所以开口向上。",
  ),
  "graphing-elementary-quadratic-functions#marking-a-pair-of-mirror-points": graphed(
    wide(-4, 4, -1, 7, 99),
    [
      curveOf((x) => x * x + 1, undefined, -2.3, 2.3),
      dash([-1, 2], [1, 2], "action"),
      pt([0, 1], "(0, 1)", "se"),
      pt([1, 2], "(1, 2)", "e", "result"),
      pt([-1, 2], "(−1, 2)", "w", "result"),
    ],
    "For example, y = x² + 1. The inputs 1 and −1 have the same square, so the colored points are at the same height, 2, on either side of the y-axis.",
    "例如，y = x² + 1。输入 1 和 −1 的平方相同，所以标色的点在 y 轴两侧，高度都是 2。",
  ),
  "graphs-of-general-quadratic-functions#choosing-a-parabola-by-its-vertex": graphed(
    wide(-3, 7, -3, 6, 99),
    [
      curveOf((x) => x * x, undefined, -2.3, 2.3, true),
      curveOf((x) => (x - 3) ** 2 - 2, "result", 0.2, 5.8),
      toward([0, 0], [3, -2], "action"),
      pt([3, -2], "(3, −2)", "e", "result"),
    ],
    "For example, y = (x − 3)² − 2 is the dashed parabola y = x² with its vertex moved to the colored point (3, −2).",
    "例如，y = (x − 3)² − 2 是虚线抛物线 y = x² 把顶点移到标色的点 (3, −2)。",
  ),
  "graphs-of-general-quadratic-functions#marking-the-vertex-from-the-equation": graphed(
    wide(-6, 3, -3, 6, 99),
    [curveOf((x) => (x + 2) ** 2 - 1, undefined, -4.6, 0.6), pt([-2, -1], "(−2, −1)", "s", "result")],
    "For example, y = (x + 2)² − 1. The square is 0 at x = −2, where y = −1, so the colored vertex is (−2, −1). Mind the sign: x + 2 has h = −2.",
    "例如，y = (x + 2)² − 1。当 x = −2 时平方为 0，此时 y = −1，所以标色的顶点是 (−2, −1)。注意符号：x + 2 对应 h = −2。",
  ),
  "graphs-of-general-quadratic-functions#marking-the-roots-from-factors": graphed(
    wide(-6, 4, -5, 5, 99),
    [curveOf((x) => (x - 1) * (x + 3), undefined, -4.2, 2.2), pt([1, 0], "(1, 0)", "se", "result"), pt([-3, 0], "(−3, 0)", "sw", "result")],
    "For example, y = (x − 1)(x + 3). A factor is 0 where x = 1 or x = −3, so the graph meets the x-axis at the colored points (1, 0) and (−3, 0).",
    "例如，y = (x − 1)(x + 3)。当 x = 1 或 x = −3 时有一个因式为 0，所以图象与 x 轴交于标色的点 (1, 0) 和 (−3, 0)。",
  ),
  "identifying-angle-theorems#naming-angle-theorems": drawing(
    [
      ...shift(crossing(60, ["", undefined, ""], ["result", undefined, "result"], 3), 3, 9),
      ...shift(linearPair(60), 11, 8),
      ...shift(linearPair(60), 18, 8),
      ...shift(rightSplit(30), 0, 0),
      ...shift(rightSplit(30), 5, 0),
      seg([11, 0], [14, 0]),
      seg([11, 0], [11, 3]),
      square([11, 0], [14, 0], [11, 3]),
      seg([17, 0], [20, 0]),
      seg([17, 0], [17, 3]),
      square([17, 0], [20, 0], [17, 3]),
    ],
    "Top left: vertical angles, in color, are congruent. Top right: the two angles supplementary to congruent angles in the other color are congruent. Bottom left: the same for complements. Bottom right: two right angles are congruent.",
    "左上：标色的对顶角全等。右上：与另一种颜色的全等角互补的两个角全等。左下：互余时同样成立。右下：两个直角全等。",
  ),
  "rotation-rules-in-the-coordinate-plane#choosing-a-rotation-by-its-rule": graphed(
    wide(-5, 5, -5, 5, 99),
    [
      ...outlineOn([
        [1, 1],
        [4, 1],
        [1, 3],
      ]),
      ...outlineOn(
        [
          [-1, -1],
          [-4, -1],
          [-1, -3],
        ],
        "result",
      ),
      ...outlineOn(
        [
          [1, -1],
          [1, -4],
          [3, -1],
        ],
        "action",
      ),
    ],
    "For a half turn, (x, y) goes to (−x, −y), in one color. A turn of 270° counterclockwise, a quarter turn clockwise, sends (x, y) to (y, −x), in the other. Every vertex of an image follows its rule.",
    "半周旋转把 (x, y) 变到 (−x, −y)（一种颜色）。逆时针旋转 270°，即顺时针旋转 90°，把 (x, y) 变到 (y, −x)（另一种颜色）。像的每个顶点都遵循这一规则。",
  ),
  "rotation-rules-in-the-coordinate-plane#marking-a-rotated-point": graphed(
    wide(-5, 5, -5, 5, 99),
    [
      circleOn([0, 0], Math.sqrt(10), undefined, true),
      pt([3, 1], "(3, 1)", "e"),
      pt([-1, 3], "(−1, 3)", "nw", "result"),
      pt([1, -3], "(1, −3)", "se", "action"),
      pt([-3, -1], "(−3, −1)", "w"),
    ],
    "For example, (3, 1). A quarter turn counterclockwise gives (−1, 3), a quarter turn clockwise gives (1, −3), and a half turn gives (−3, −1). All stay at the same distance from the origin, on the dashed circle.",
    "例如，(3, 1)。逆时针 90° 得 (−1, 3)，顺时针 90° 得 (1, −3)，半周得 (−3, −1)。它们到原点的距离不变，都在虚线圆上。",
  ),
};
