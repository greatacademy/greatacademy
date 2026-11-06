// Drawings of the SAT fundamentals explanations: solids, circles, parabolas with their lines, and exponential bounds.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, tag } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { belowRim, box, dash, rt, solid, tri } from "./explanation-drawings-exam-kit.ts";
import { ln, pt, shift } from "./explanation-drawings-geometry-2.ts";
import {
  bend,
  coneMarks,
  cylinderMarks,
  drawing,
  fromAngles,
  fromSides,
  graphed,
  note,
  pyramidMarks,
  ring,
  seg,
  square,
} from "./explanation-drawings-kit.ts";

/** round draws a circle on a coordinate plane. */
const round = (center: Point, r: number, tone?: "action" | "result"): PlaneMark => ({ kind: "circle", center, r, tone }) as PlaneMark;

/** domed draws a cylinder topped by a colored half sphere. */
const domed = (r: number, h: number, radius: string, height: string): Mark[] => [
  ...cylinderMarks(r, h, undefined, height),
  belowRim(r, radius),
  ...bend(0, 180, r, [0, h], "result"),
];

/** peaked draws a cylinder topped by a colored cone of the same radius. */
const peaked = (r: number, h: number, top: number, radius: string, height: string): Mark[] => [
  ...cylinderMarks(r, h, undefined, height),
  belowRim(r, radius),
  seg([-r, h], [0, h + top], "result"),
  seg([r, h], [0, h + top], "result"),
  seg([0, h], [0, h + top], "result", true),
  note([0, h + top / 2], height, "e"),
];

/** examFundamentalsDrawings2 draws the explanations of SAT Math Fundamentals, by knowledge point: solids, circles, parabolas with their lines and exponential bounds. */
export const examFundamentalsDrawings2: Readonly<Record<string, Figure>> = {
  "constructing-functions-representing-volumes-of-cylinders-cones-and-pyramids#volume-functions-with-pi": drawing(
    [...cylinderMarks(2, 4, undefined, "2r"), belowRim(2, "r"), ...shift([...coneMarks(2, 4, undefined, "2r"), belowRim(2, "r")], 6)],
    "For example, c = 2, so each height is 2r. The cylinder has volume 2πr³ and the cone (2/3)πr³, both functions of r alone.",
    "例如，c = 2，所以每个高都是 2r。圆柱的体积是 2πr³，圆锥的体积是 (2/3)πr³，都只是 r 的函数。",
  ),
  "constructing-functions-representing-volumes-of-cylinders-cones-and-pyramids#volume-function-of-a-pyramid": drawing(
    [...pyramidMarks(3, 6, "x"), seg([5, 0.525], [5, 6.525], "action"), note([5, 3.5], "x + 3", "e")],
    "A square pyramid with base side x and height x + 3, drawn for x = 3. Its volume is V(x) = (1/3)x²(x + 3).",
    "底边长 x、高 x + 3 的正四棱锥，按 x = 3 画出。它的体积是 V(x) = (1/3)x²(x + 3)。",
  ),
  "constructing-functions-representing-volumes-of-cylinders-cones-and-pyramids#height-as-a-function-of-the-radius": drawing(
    [...cylinderMarks(1, 8, undefined, "8"), belowRim(1, "1"), ...shift([...cylinderMarks(2, 2, undefined, "2"), belowRim(2, "2")], 5)],
    "For example, a fixed volume of 8π, so h = 8/r². Radius 1 needs height 8, and doubling the radius to 2 divides the height by 4.",
    "例如，体积固定为 8π，所以 h = 8/r²。半径 1 时高是 8，半径加倍到 2，高除以 4。",
  ),
  "composite-solids#joined-round-solids": drawing(
    [...domed(2, 3, "r", "h"), ...shift(peaked(2, 3, 3, "r", "h"), 6)],
    "Each solid is a cylinder with a colored piece on top. On the left, a hemisphere adds (2/3)πr³. On the right, a cone adds (1/3)πr²h, drawn with the same height as the cylinder.",
    "每个立体都是圆柱加上顶部标色的部分。左图中，半球增加 (2/3)πr³。右图中，圆锥增加 (1/3)πr²h，画成与圆柱同高。",
  ),
  "composite-solids#a-hemisphere-on-a-cylinder": drawing(
    domed(3, 5, "3", "5"),
    "For example, radius 3 and cylinder height 5. The cylinder holds 45π and the colored hemisphere 18π, so the solid has volume 63π.",
    "例如，半径 3，圆柱高 5。圆柱的体积是 45π，标色的半球是 18π，所以立体的体积是 63π。",
  ),
  "isosceles-triangles-in-circles#the-distance-from-center-to-chord": drawing(
    [
      ring(10),
      seg([-8, -6], [8, -6]),
      seg([0, 0], [-8, -6]),
      seg([0, 0], [8, -6]),
      seg([0, 0], [0, -6], "result"),
      square([0, -6], [8, -6], [0, 0]),
      note([4, -3], "10", "ne"),
      note([0, -3], "6", "w"),
      note([4, -6], "8", "s"),
    ],
    "For example, radius 10 and a chord of 16. The perpendicular halves the chord, so half of it is 8 and the colored distance is 6.",
    "例如，半径 10，弦长 16。垂线平分弦，所以弦的一半是 8，标色的距离是 6。",
  ),
  "transforming-circles#reflecting-a-circle": graphed(
    wide(-2, 6, -6, 6, 99),
    [
      round([2, 3], 2),
      round([2, -3], 2, "result"),
      dash([2, 3], [2, -3], "action"),
      pt([2, 3], "(2, 3)", "n"),
      pt([2, -3], "(2, −3)", "s", "result"),
    ],
    "For example, a circle with center (2, 3) and radius 2, reflected over the x-axis. The colored image has center (2, −3) and the same radius.",
    "例如，圆心 (2, 3)、半径 2 的圆关于 x 轴反射。标色的像圆心是 (2, −3)，半径不变。",
  ),
  "calculating-trigonometric-ratios-from-descriptions#ratios-from-named-sides": drawing(
    rt(6, 4, { names: ["A", "C", "B"], sideStyles: [undefined, "action", "result"], angles: [""] }),
    "With the right angle at C, the colored AB opposite it is the hypotenuse. For angle A, the colored BC is the opposite side and AC the adjacent one.",
    "直角在 C，它所对的标色边 AB 是斜边。对角 A 来说，标色的 BC 是对边，AC 是邻边。",
  ),
  "calculating-trigonometric-ratios-from-descriptions#ratios-of-the-other-acute-angle": drawing(
    rt(6, 4, {
      names: ["A", "C", "B"],
      sideStyles: [undefined, "result"],
      angles: ["", undefined, ""],
      angleStyles: ["action", undefined, "action"],
    }),
    "The colored side BC is opposite angle A and adjacent to angle B. Both ratios are BC over AB, so sin A = cos B.",
    "标色的边 BC 是角 A 的对边，也是角 B 的邻边。两个比都是 BC 比 AB，所以 sin A = cos B。",
  ),
  "reasoning-about-coefficients-of-quadratics-using-standard-and-factored-forms#leading-coefficient-from-intercepts": graphed(
    wide(-2, 6, -3, 8, 99),
    [
      curveOf((x) => 2 * (x - 1) * (x - 3), undefined, -0.25, 4.25),
      pt([1, 0], "1", "sw"),
      pt([3, 0], "3", "se"),
      pt([0, 6], "(0, 6)", "e", "result"),
    ],
    "For example, zeros 1 and 3 with the colored y-intercept 6. Since rs = 3, the leading coefficient is a = 6/3 = 2.",
    "例如，零点 1 和 3，标色的 y 轴截距是 6。因为 rs = 3，首项系数 a = 6/3 = 2。",
  ),
  "fitting-quadratic-functions-to-data-using-vertex-form#the-leading-coefficient-from-a-point": graphed(
    wide(-1, 7, -1, 11, 99),
    [
      curveOf((x) => 2 * (x - 2) ** 2 + 1, undefined, -0.1, 4.2),
      dash([2, 1], [4, 1], "action"),
      dash([4, 1], [4, 9], "result"),
      pt([2, 1], "(2, 1)", "s"),
      pt([4, 9], "(4, 9)", "e"),
      tag([3, 1], "2", "n"),
      tag([4, 5], "8", "e"),
    ],
    "For example, vertex (2, 1) and data point (4, 9). The point lies 8 above the vertex at a horizontal distance of 2, so a = 8/2² = 2.",
    "例如，顶点 (2, 1)，数据点 (4, 9)。这个点比顶点高 8，水平距离是 2，所以 a = 8/2² = 2。",
  ),
  "fitting-quadratic-functions-to-data-using-vertex-form#predicting-with-a-vertex-form-model": graphed(
    wide(-1, 11, -1, 11, 99),
    [
      curveOf((x) => 9 - (x - 5) ** 2, undefined, 2, 8),
      dash([3, 5], [7, 5], "action"),
      pt([5, 9], "(5, 9)", "n"),
      pt([3, 5], "(3, 5)", "nw"),
      pt([7, 5], "(7, 5)", "ne", "result"),
    ],
    "For example, y = −(x − 5)² + 9. Inputs 3 and 7 lie 2 on either side of the highest point, so they predict the same output, 5.",
    "例如，y = −(x − 5)² + 9。输入 3 和 7 分别在最高点两侧 2 处，所以预测的输出相同，都是 5。",
  ),
  "fitting-quadratic-functions-to-data-using-vertex-form#the-matching-point-by-symmetry": graphed(
    wide(-1, 11, -1, 8, 99),
    [
      curveOf((x) => (x - 5) ** 2 + 1, undefined, 2.5, 7.5),
      dash([5, 1], [5, 7.2]),
      dash([3, 5], [7, 5], "action"),
      pt([5, 1], "(5, 1)", "s"),
      pt([3, 5], "(3, 5)", "w"),
      pt([7, 5], "(7, 5)", "e", "result"),
      tag([4, 5], "2", "n"),
      tag([6, 5], "2", "n"),
    ],
    "For example, vertex (5, 1) and data point (3, 5), which lies 2 to the left of the axis. The colored matching point is 2 to the right, at the same height.",
    "例如，顶点 (5, 1)，数据点 (3, 5) 在对称轴左边 2 处。标色的对应点在右边 2 处，高度相同。",
  ),
  "reasoning-about-coefficients-of-quadratics-using-symmetry#the-axis-from-equal-outputs": graphed(
    wide(-1, 11, -1, 8, 99),
    [
      curveOf((x) => (x - 5) ** 2 + 1, undefined, 2.5, 7.5),
      dash([5, 0], [5, 7.2], "result"),
      dash([3, 5], [7, 5], "action"),
      pt([3, 5], "(p, f(p))", "w"),
      pt([7, 5], "(q, f(q))", "e"),
      tag([5, 7.2], "x = (p + q)/2", "n"),
    ],
    "Two inputs with equal outputs sit at the same height. The colored axis passes halfway between them. Drawn for p = 3 and q = 7.",
    "输出相同的两个输入在同一高度。标色的对称轴从它们正中间穿过。按 p = 3、q = 7 画出。",
  ),
  "reasoning-about-coefficients-of-quadratics-using-symmetry#b-from-the-axis": graphed(
    wide(-2, 8, -3, 8, 99),
    [
      curveOf((x) => x * x - 6 * x + 7, undefined, 0.2, 5.8),
      curveOf((x) => x * x - 6 * x + 10, "action", 0.8, 5.2),
      dash([3, -2.6], [3, 6.6], "result"),
      tag([3, 6.6], "x = 3", "n"),
    ],
    "For example, x² − 6x + 7 and x² − 6x + 10, with a = 1 and h = 3, so b = −6. Changing c lifts the graph and leaves the colored axis where it is.",
    "例如，x² − 6x + 7 和 x² − 6x + 10，a = 1，h = 3，所以 b = −6。改变 c 只抬高图象，标色的对称轴不动。",
  ),
  "reasoning-about-coefficients-of-quadratics-using-symmetry#the-other-zero-from-the-axis": graphed(
    wide(-3, 7, -6, 5, 99),
    [
      curveOf((x) => 0.5 * (x + 1) * (x - 5), undefined, -2, 6),
      dash([2, -5], [2, 4.2]),
      pt([-1, 0], "−1", "sw"),
      pt([5, 0], "5", "se", "result"),
      tag([0.5, 0], "3", "n"),
      tag([3.5, 0], "3", "n"),
      tag([2, 4.2], "x = 2", "n"),
    ],
    "For example, axis x = 2 and a zero at −1, which is 3 away. The colored zero is 3 away on the other side, at 2 · 2 − (−1) = 5.",
    "例如，对称轴 x = 2，零点 −1 距离它 3。标色的零点在另一侧距离 3 处，即 2 · 2 − (−1) = 5。",
  ),
  "determining-unknown-parameters-in-quadratic-systems-with-one-intersection-point#a-horizontal-line-through-the-vertex": graphed(
    wide(-2, 6, -1, 8, 99),
    [curveOf((x) => x * x - 4 * x + 5, undefined, -0.4, 4.4), ln([0, 1], [1, 1], "result"), pt([2, 1], "(2, 1)", "s")],
    "For example, y = x² − 4x + 5, which is (x − 2)² + 1. The colored line y = 1 touches the parabola only at the vertex, and 5 − 16/4 = 1.",
    "例如，y = x² − 4x + 5，即 (x − 2)² + 1。标色的直线 y = 1 只在顶点与抛物线相碰，而 5 − 16/4 = 1。",
  ),
  "determining-unknown-parameters-in-quadratic-systems-with-one-intersection-point#a-tangent-line": graphed(
    wide(-3, 4, -4, 7, 99),
    [curveOf((x) => x * x, undefined, -2.6, 2.6), ln([0, -1], [1, 1], "result"), pt([1, 1], "(1, 1)", "se")],
    "For example, y = x² and the colored y = 2x − 1 meet where x² − 2x + 1 = 0. The discriminant is 0, so they touch at the single point (1, 1).",
    "例如，y = x² 与标色的 y = 2x − 1 相交于 x² − 2x + 1 = 0 处。判别式为 0，所以它们只在 (1, 1) 一点相碰。",
  ),
  "determining-unknown-parameters-in-quadratic-systems-with-zero-or-two-intersection-points#counting-intersections": graphed(
    wide(-4, 5, -4, 8, 99),
    [
      curveOf((x) => x * x, undefined, -2.8, 2.8),
      ln([0, 2], [1, 3], "action"),
      ln([0, -1], [1, 1], "result"),
      ln([0, -1], [1, 0], undefined, true),
    ],
    "For example, with y = x². The line y = x + 2 has discriminant 9 and two intersections. The colored y = 2x − 1 has discriminant 0 and one. The dashed y = x − 1 has discriminant −3 and none.",
    "例如，对 y = x²。直线 y = x + 2 的判别式是 9，有两个交点。标色的 y = 2x − 1 判别式是 0，有一个。虚线 y = x − 1 判别式是 −3，没有交点。",
  ),
  "determining-unknown-parameters-in-quadratic-systems-with-zero-or-two-intersection-points#parameter-range-for-two-intersections": graphed(
    wide(-3, 6, -1, 7, 99),
    [
      curveOf((x) => (x - 1) ** 2 + 2, undefined, -1.2, 3.2),
      ln([0, 4], [1, 4], "result"),
      ln([0, 1], [1, 1], undefined, true),
      pt([1 - Math.SQRT2, 4], "", "n", "result"),
      pt([1 + Math.SQRT2, 4], "", "n", "result"),
      pt([1, 2], "(1, 2)", "s"),
      tag([4.6, 4], "y = 4", "n"),
      tag([4.6, 1], "y = 1", "n"),
    ],
    "For example, y = (x − 1)² + 2. The colored line y = 4 above the vertex meets it twice. The dashed line y = 1 below the vertex misses it.",
    "例如，y = (x − 1)² + 2。标色的直线 y = 4 在顶点上方，与它相交两次。虚线 y = 1 在顶点下方，与它不相交。",
  ),
  "modeling-using-systems-of-non-linear-equations#area-and-perimeter": drawing(
    box(0, 0, 4, 3, { bottom: "4", right: "3", inside: "12", shade: "result" }),
    "For example, area 12 and perimeter 14. The two solutions of w² − 7w + 12 = 0 are 3 and 4, which are the two sides of the colored rectangle.",
    "例如，面积 12，周长 14。w² − 7w + 12 = 0 的两个解是 3 和 4，也就是标色矩形的两条边。",
  ),
  "modeling-using-systems-of-non-linear-equations#a-right-triangle-from-area-and-hypotenuse": drawing(
    rt(4, 3, { sides: ["4", "3", "5"], sideStyles: ["result", "result"] }),
    "For example, area 6 and hypotenuse 5. The colored legs have product 12 and squares that add up to 25, so they are 3 and 4.",
    "例如，面积 6，斜边 5。标色的直角边乘积是 12，平方和是 25，所以它们是 3 和 4。",
  ),
  "identifying-valid-outputs-of-factored-polynomials#where-the-polynomial-is-negative": drawing(
    pane(0, [-4, 5, 99], [-9, 9, 99], 7, 5)
      .f((x) => (x + 2) * (x - 1) * (x - 3), -2.4, 3.6)
      .path(
        [
          [-4, 0],
          [-2, 0],
        ],
        "result",
      )
      .path(
        [
          [1, 0],
          [3, 0],
        ],
        "result",
      )
      .dot(-2, 0, "−2", "nw")
      .dot(1, 0, "1", "ne")
      .dot(3, 0, "3", "nw")
      .marks(),
    "For example, (x + 2)(x − 1)(x − 3). The zeros split the axis into intervals. The graph is below the axis on the colored intervals, left of −2 and between 1 and 3.",
    "例如，(x + 2)(x − 1)(x − 3)。零点把数轴分成若干区间。在标色的区间上，即 −2 左边以及 1 和 3 之间，图象在轴的下方。",
  ),
  "extrema-of-exponential-functions#bounds-from-the-asymptote": graphed(
    wide(-5, 3, -6, 8, 99),
    [
      curveOf((x) => 2 ** x + 1, "result", -5, 2.8),
      curveOf((x) => 1 - 2 ** x, "action", -5, 2.8),
      ln([0, 1], [1, 1], undefined, true),
      tag([2.2, 1], "y = 1", "n"),
    ],
    "For example, 2ˣ + 1 stays above the dashed line y = 1, and −2ˣ + 1 stays below it. Both approach the line to the left and never reach it.",
    "例如，2ˣ + 1 始终在虚线 y = 1 的上方，−2ˣ + 1 始终在它的下方。两者向左都趋近这条线，但永远达不到。",
  ),
  "determining-unknown-parameters-in-exponential-functions#parameters-with-an-asymptote": graphed(
    wide(-5, 3, -1, 9, 99),
    [
      curveOf((x) => 3 * 2 ** x + 1, undefined, -5, 1.4),
      ln([0, 1], [1, 1], undefined, true),
      solid([0, 1], [0, 4], "result"),
      pt([0, 4], "(0, 4)", "se"),
      tag([0, 2.5], "3", "w"),
      tag([2.2, 1], "y = 1", "n"),
    ],
    "For example, 3 · 2ˣ + 1. The dashed asymptote gives c = 1, and the y-intercept 4 lies the colored distance a = 3 above it.",
    "例如，3 · 2ˣ + 1。虚线渐近线给出 c = 1，y 轴截距 4 在它上方标色的距离 a = 3 处。",
  ),
  "modeling-geometry-problems-using-linear-equations#rectangles-with-related-sides": drawing(
    box(0, 0, 15, 6, { bottom: "2w + 3 = 15", right: "w = 6", line: "result" }),
    "The rectangle with length 3 more than twice its width and perimeter 42, drawn to scale. The colored outline is 2(6 + 15) = 42.",
    "长比宽的两倍多 3、周长 42 的矩形，按比例画出。标色的轮廓是 2(6 + 15) = 42。",
  ),
  "modeling-geometry-problems-using-linear-equations#angles-of-a-triangle-in-terms-of-x": drawing(
    tri(fromAngles(40, 60, 6), { angles: ["x°", "(x + 20)°", "2x°"], angleStyles: ["result", "result", "result"] }),
    "The triangle with angles x°, 2x° and (x + 20)°, drawn to scale. Solving 4x + 20 = 180 gives x = 40, so the colored angles are 40°, 80° and 60°.",
    "角为 x°、2x° 和 (x + 20)° 的三角形，按比例画出。解 4x + 20 = 180 得 x = 40，所以标色的角是 40°、80° 和 60°。",
  ),
  "modeling-geometry-problems-using-linear-equations#an-isosceles-triangle-from-its-perimeter": drawing(
    tri(fromSides(3, 7, 7), {
      sides: ["x", "2x + 1", "2x + 1"],
      sideStyles: [undefined, "result", "result"],
      ticks: [
        [1, 1],
        [2, 1],
      ],
    }),
    "For example, legs 2x + 1 and base x with perimeter 17. The colored leg counts twice, so 2(2x + 1) + x = 17 and x = 3. Drawn to scale, with legs of 7.",
    "例如，腰 2x + 1，底 x，周长 17。标色的腰算两次，所以 2(2x + 1) + x = 17，x = 3。按比例画出，腰长 7。",
  ),
  "sat-linear-systems-unknown-constants#sat-no-solution-constants": graphed(
    wide(-2, 7, -1, 5, 99),
    [ln([3, 0], [0, 2]), ln([6, 0], [0, 4]), pt([0, 2], "2", "w", "result"), pt([0, 4], "4", "w", "result")],
    "For example, 2x + 3y = 6 and 2x + 3y = 12. The lines have the same slope, with the different colored y-intercepts 2 and 4, so they never intersect.",
    "例如，2x + 3y = 6 和 2x + 3y = 12。两条直线斜率相同，标色的 y 轴截距不同，分别是 2 和 4，所以永不相交。",
  ),
  "sat-quadratic-vertex-and-constants#sat-vertex-extremum-value": graphed(
    wide(-2, 6, -5, 7, 99),
    [
      curveOf((x) => (x - 2) ** 2 + 1, undefined, -0.3, 4.3),
      curveOf((x) => 1 - (x - 2) ** 2, "action", -0.3, 4.3),
      pt([2, 1], "(2, 1)", "e", "result"),
    ],
    "For example, h = 2 and k = 1. With a > 0, the upward parabola has minimum 1 at x = 2. With a < 0, the colored downward one has maximum 1 there.",
    "例如，h = 2，k = 1。当 a > 0 时，开口向上的抛物线在 x = 2 处有最小值 1。当 a < 0 时，标色的开口向下的抛物线在那里有最大值 1。",
  ),
  "sat-quadratic-vertex-and-constants#sat-constant-from-the-vertex": graphed(
    wide(-3, 7, -8, 6, 99),
    [
      curveOf((x) => 3 * x * x - 12 * x + 5, undefined, -0.08, 4.08),
      dash([2, -7], [2, 5], "result"),
      tag([2, 5], "x = 2", "n"),
      pt([2, -7], "(2, −7)", "e"),
    ],
    "The parabola f(x) = 3x² − 12x + 5, with b = −12 from the minimum on the colored line x = 2. Its lowest point is (2, −7).",
    "抛物线 f(x) = 3x² − 12x + 5，由标色直线 x = 2 上的最小值得 b = −12。它的最低点是 (2, −7)。",
  ),
  "sat-quadratic-vertex-and-constants#sat-the-minimum-from-the-zeros": graphed(
    wide(-2, 8, -5, 6, 99),
    [
      curveOf((x) => (x - 1) * (x - 5), undefined, -0.1, 6.1),
      pt([1, 0], "1", "ne"),
      pt([5, 0], "5", "nw"),
      dash([3, 0], [3, -4]),
      pt([3, -4], "(3, −4)", "s", "result"),
    ],
    "For example, y = (x − 1)(x − 5), with zeros 1 and 5. Their average is 3, and substituting 3 gives the colored minimum, −4.",
    "例如，y = (x − 1)(x − 5)，零点是 1 和 5。它们的平均数是 3，代入 3 得到标色的最小值 −4。",
  ),
  "slant-asymptotes-of-rational-functions#slant-asymptote-by-division": graphed(
    wide(-12, 16, -12, 24, 99),
    [
      curveOf((x) => x + 4 + 9 / (x - 1), undefined, 1.47, 15),
      curveOf((x) => x + 4 + 9 / (x - 1), undefined, -12, 0.45),
      ln([0, 4], [1, 5], "result", true),
      ln([1, 0], [1, 1], undefined, true),
      tag([12, 16], "y = x + 4", "se"),
      tag([1, -9], "x = 1", "e"),
    ],
    "The graph of (x² + 3x + 5)/(x − 1), which is x + 4 + 9/(x − 1). As x grows large in either direction, it approaches the colored dashed line y = x + 4.",
    "(x² + 3x + 5)/(x − 1) 的图象，它等于 x + 4 + 9/(x − 1)。当 x 向任一方向增大时，它趋近标色的虚线 y = x + 4。",
  ),
};
