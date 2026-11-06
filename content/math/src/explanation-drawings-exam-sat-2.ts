// Drawings of the SAT explanations: tables and graphs of quadratics, polynomials, absolute values, lines, systems and data displays.

import type { Figure } from "@ga/content";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { chart, curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { wide } from "./explanation-drawings-curves.ts";
import { bars, box, cornerMark, dash, fill, solid, vee, whisker } from "./explanation-drawings-exam-kit.ts";
import { ln, pt } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, note, seg } from "./explanation-drawings-kit.ts";
import { table } from "./explanation-drawings-structures-kit.ts";

const ineq = chart({ x: [0, 30, 5], y: [0, 60, 10], xName: "x", yName: "y", w: 6, h: 5 });
const fuel = () => pane(0, [0, 6, 1], [0, 60, 10], 6, 5, "t", "F").f((t) => 50 - 10 * t, 0, 5);

/** examSatDrawings2 draws the explanations of SAT Math Prep, by knowledge point: tables, graphs, lines, systems and data. */
export const examSatDrawings2: Readonly<Record<string, Figure>> = {
  "sat-exam-identifying-quadratic-functions-from-tabular-data#exam-question": drawing(
    [
      ...table(
        [
          ["−1", "0", "1", "2", "3"],
          ["7", "4", "3", "4", "7"],
        ],
        {
          at: [0, 3.4],
          rows: ["x", "f"],
          shade: [
            [0, 2],
            [1, 2],
          ],
        },
      ),
      ...pane(6, [-2, 4, 1], [0, 8, 2], 5, 5)
        .f((x) => (x - 1) ** 2 + 3, -1.6, 3.6)
        .dot(-1, 7)
        .dot(0, 4)
        .dot(1, 3, undefined, "s", "result")
        .dot(2, 4)
        .dot(3, 7)
        .marks(),
    ],
    "The outputs 7, 4, 3, 4, 7 mirror each other about x = 1, the colored column and point. One step from the vertex the output changes by 1, so a = 1 and f(x) = (x − 1)² + 3.",
    "输出 7、4、3、4、7 关于 x = 1 对称，即标色的一列和标色的点。离顶点一步输出变化 1，所以 a = 1，f(x) = (x − 1)² + 3。",
  ),
  "sat-exam-identifying-quadratic-functions-from-tabular-data#harder-exam-question": drawing(
    pane(0, [-1, 6, 1], [0, 21, 3], 6, 5)
      .f((x) => (x - 1) ** 2 + 3, -1, 5.3)
      .path(
        [
          [1, 3],
          [5, 3],
        ],
        "action",
      )
      .path(
        [
          [5, 3],
          [5, 19],
        ],
        "action",
        true,
      )
      .dot(1, 3, "(1, 3)", "s")
      .dot(5, 19, "(5, 19)", "w", "result")
      .say(3, 3, "4", "n")
      .marks(),
    "From the vertex (1, 3), the input 5 is four steps away. The output rises by 1 · 4², which gives 19, so the curve climbs faster than any straight extension of the table.",
    "从顶点 (1, 3) 到输入 5 有四步。输出增加 1 · 4²，得 19，所以曲线比按表格直线延伸上升得更快。",
  ),
  "sat-exam-solving-border-problems-with-quadratic-equations#exam-question": drawing(
    [
      ...box(0, 0, 7, 5, { bottom: "5 + 2x", right: "3 + 2x", shade: "action" }),
      fill([
        [1, 1],
        [6, 1],
        [6, 4],
        [1, 4],
      ]),
      ...box(1, 1, 5, 3, { inside: "5 × 3" }),
      seg([0, 2.5], [1, 2.5], "action"),
      seg([6, 2.5], [7, 2.5], "action"),
      note([0.5, 2.5], "x", "n"),
      note([6.5, 2.5], "x", "n"),
    ],
    "A 5 by 3 picture with a border of width x. The border lies on both sides, so the outer rectangle is 5 + 2x by 3 + 2x, and its area is the total of 35.",
    "5 乘 3 的图片外有宽 x 的边框。边框在两侧都有，所以外框是 5 + 2x 乘 3 + 2x，其面积就是总面积 35。",
  ),
  "sat-exam-interpreting-graphs-of-quadratic-functions-in-modeling-contexts#exam-question": drawing(
    pane(0, [0, 4, 1], [0, 6, 1], 6, 5, "t", "h")
      .f((t) => 5 - 1.25 * (t - 2) ** 2, 0, 4)
      .path(
        [
          [2, 0],
          [2, 5],
        ],
        undefined,
        true,
      )
      .path(
        [
          [0, 5],
          [2, 5],
        ],
        "action",
        true,
      )
      .dot(2, 5, "(2, 5)", "ne", "result")
      .marks(),
    "A height curve with time t across and height h up. The top point (2, 5) means the object reaches its greatest height, 5, after 2 seconds.",
    "高度曲线，横轴是时间 t，纵轴是高度 h。最高点 (2, 5) 表示物体在 2 秒后达到最大高度 5。",
  ),
  "sat-exam-modeling-planar-motion-using-quadratic-functions#exam-question": drawing(
    pane(0, [0, 2.5, 0.5], [0, 20, 4], 6, 5, "t", "h")
      .f((t) => -16 * t * t + 32 * t, 0, 2)
      .path(
        [
          [1, 0],
          [1, 16],
        ],
        "action",
        true,
      )
      .dot(1, 16, "t = 1", "ne", "result")
      .dot(2, 0, undefined, "n")
      .marks(),
    "The graph of h(t) = −16t² + 32t peaks at its vertex, t = 1 second. The plain dot at t = 2 is the landing, which is twice as far along.",
    "h(t) = −16t² + 32t 的图象在顶点 t = 1 秒处达到顶峰。t = 2 处的普通点是落地时刻，时间恰好是两倍。",
  ),
  "sat-exam-graphs-of-higher-degree-polynomials#exam-question": graphed(
    wide(-5, 4, -4, 5),
    [
      curveOf((x) => 0.3 * x * (x + 3) * (x - 2)),
      pt([-3, 0], "x + 3", "nw", "result"),
      pt([0, 0], "", "n"),
      pt([2, 0], "", "n", "result"),
      tag([2.2, -1], "x − 2", "e"),
    ],
    "For example, a cubic that crosses the x-axis at −3, 0 and 2. The crossing at −3 gives the factor x + 3 and the crossing at 2 gives the factor x − 2, so the sign flips.",
    "例如，与 x 轴交于 −3、0、2 的三次曲线。−3 处的交点给出因式 x + 3，2 处的交点给出因式 x − 2，符号相反。",
  ),
  "sat-exam-graphs-of-higher-degree-polynomials#harder-exam-question": graphed(
    wide(-5, 6, -5, 6),
    [
      curveOf((x) => 0.2 * (x + 3) * (x - 1) * (x - 4)),
      pt([-3, 0], "", "n", "result"),
      pt([1, 0], "", "n", "result"),
      pt([4, 0], "", "n", "result"),
      tag([2.6, 4.6], "−3 + 1 + 4 = 2", "n"),
    ],
    "A curve that meets the x-axis at −3, 1 and 4, the colored points, so its zeros add to 2. The turning points are not zeros, and their heights do not count.",
    "曲线与 x 轴交于 −3、1、4（标色的点），所以零点之和为 2。转折点不是零点，它们的高度不计入。",
  ),
  "sat-exam-absolute-value-functions#exam-question": graphed(
    wide(-7, 2, -1, 8),
    [vee(-3, 1, -7, 2), pt([-3, 1], "(−3, 1)", "s", "result"), tag([-3, 4.5], "|x + 3| + 1", "n")],
    "A V with its corner at (−3, 1) has the equation y = |x + 3| + 1. The corner is at x = −3, while the equation shows x + 3.",
    "拐点在 (−3, 1) 的 V 形图象，方程为 y = |x + 3| + 1。拐点在 x = −3，方程中却写作 x + 3。",
  ),
  "sat-exam-absolute-value-functions#harder-exam-question": graphed(
    wide(-4, 6, -1, 9),
    [
      vee(1, 2, -4, 6, undefined, true),
      vee(1, 5, -4, 6, "result"),
      toward([1, 2], [1, 5], "action"),
      tag([1, 3.5], "+3", "e"),
      pt([1, 2], "(1, 2)", "s"),
      pt([1, 5], "", "n", "result"),
      tag([1, 6.6], "(1, 5)", "n"),
    ],
    "Adding 3 moves the dashed graph of f(x) = |x − 1| + 2 up 3. The minimum rises from 2 to 5, while the input of the corner stays at 1.",
    "加 3 把虚线所示的 f(x) = |x − 1| + 2 向上平移 3。最小值从 2 升到 5，拐点的输入仍是 1。",
  ),
  "sat-exam-identifying-intercepts-of-functions-from-graphs#exam-question": graphed(
    wide(-4, 6, -5, 5, 2),
    [curveOf((x) => 0.5 * x * x - x - 3), pt([0, -3], "(0, −3)", "w", "result")],
    "The curve crosses the vertical axis at height −3, where x = 0. So the y-intercept is the point (0, −3).",
    "曲线在高度 −3 处穿过纵轴，那里 x = 0。所以 y 轴截距点是 (0, −3)。",
  ),
  "sat-exam-identifying-intercepts-of-functions-from-graphs#harder-exam-question": graphed(
    wide(-5, 5, -5, 5),
    [curveOf((x) => 0.25 * (x + 3) * (x + 1) * (x - 3)), pt([-3, 0], "", "n"), pt([-1, 0], "", "n"), pt([3, 0], "", "n", "result")],
    "For example, a curve that meets the horizontal axis at −3, −1 and 3. Only the colored point at 3 lies to the right of the origin, and the places where the curve turns do not count.",
    "例如，与横轴交于 −3、−1、3 的曲线。只有 3 处标色的点在原点右侧，曲线转折的地方不算。",
  ),
  "sat-exam-interpreting-graph-properties-in-modeling-contexts#exam-question": drawing(
    fuel().dot(0, 50, "(0, 50)", "e", "result").marks(),
    "For example, fuel F left in a truck after t hours of driving. The y-intercept, 50, is the fuel at the moment driving begins.",
    "例如，卡车行驶 t 小时后剩余的燃油 F。y 轴截距 50 是开始行驶时的燃油量。",
  ),
  "sat-exam-interpreting-graph-properties-in-modeling-contexts#harder-exam-question": drawing(
    fuel().dot(5, 0, "(5, 0)", "ne", "result").marks(),
    "For example, fuel F left in a truck after t hours of driving. The x-intercept, 5, is the driving time at which the tank is empty, measured in hours.",
    "例如，卡车行驶 t 小时后剩余的燃油 F。x 轴截距 5 是油箱耗尽时的行驶时间，单位是小时。",
  ),
  "sat-exam-linear-quadratic-systems-with-one-solution#exam-question": graphed(
    wide(-3, 5, -1, 7),
    [
      curveOf((x) => x * x + 2),
      ln([0, 1], [1, 3], "action"),
      pt([1, 3], "(1, 3)", "se", "result"),
      tag([-1.5, 4], "y = x² + 2", "w"),
      tag([3, 7], "y = 2x + 1", "se"),
    ],
    "With c = 1, the line y = 2x + 1 touches the parabola y = x² + 2 at one point, (1, 3), so the combined quadratic has exactly one solution.",
    "当 c = 1 时，直线 y = 2x + 1 与抛物线 y = x² + 2 只在 (1, 3) 一点相碰，所以合并后的二次方程恰有一个解。",
  ),
  "sat-exam-linear-quadratic-systems-with-zero-or-two-solutions#exam-question": graphed(
    wide(-4, 5, -1, 9, 2),
    [
      ln([0, 3], [1, 5], "action"),
      curveOf((x) => x * x + 4, undefined, -2.2, 2.2, true),
      curveOf((x) => x * x + 6, "result", -1.2, 1.2),
      pt([1, 5], "", "n"),
      tag([1.05, 7.44], "c = 6", "n"),
      tag([-2.2, 8.84], "c = 4", "w"),
      tag([3.1, 7.5], "y = 2x + 3", "se"),
    ],
    "The line y = 2x + 3 just touches the dashed parabola with c = 4. For c > 4, as for c = 6, the parabola sits higher and the line misses it, so there is no solution.",
    "直线 y = 2x + 3 恰好碰到 c = 4 的虚线抛物线。c > 4 时，比如 c = 6，抛物线更高，直线与它不相交，所以无解。",
  ),
  "sat-exam-properties-of-lines-given-in-standard-or-general-form#harder-exam-question": drawing(
    pane(0, [0, 8, 2], [0, 18, 3], 6, 5)
      .under((x) => 15 - 2.5 * x, 0, 6)
      .f((x) => 15 - 2.5 * x, 0, 6)
      .dot(6, 0)
      .dot(0, 15)
      .say(1.8, 4, "45", "n")
      .say(4.2, 8, "5x + 2y = 30", "e")
      .marks(),
    "The line 5x + 2y = 30 crosses the axes at 6 and 15. These are the legs of a right triangle, and the shaded area is ½ · 6 · 15 = 45.",
    "直线 5x + 2y = 30 与坐标轴交于 6 和 15。它们是直角三角形的两条直角边，阴影面积为 ½ · 6 · 15 = 45。",
  ),
  "sat-exam-analyzing-linear-equations-in-general-form#exam-question": graphed(
    wide(-3, 7, -3, 4),
    [
      ln([0, 1.4], [5, -0.6]),
      ln([0, 1.4], [5, -0.6], "action", true),
      ln([0, 0.9], [5, -1.1], "result"),
      tag([2, 2.8], "2x + 5y = 7", "e"),
      tag([2, 1.9], "4x + 10y = 14", "e"),
      tag([1.5, -2.2], "4x + 10y = 9", "e"),
    ],
    "The line 4x + 10y = 9 is parallel to 2x + 5y = 7, with the same slope and a new position. The dashed 4x + 10y = 14 lies exactly on 2x + 5y = 7, since its constant scaled too.",
    "直线 4x + 10y = 9 与 2x + 5y = 7 平行，斜率相同而位置不同。虚线 4x + 10y = 14 恰好落在 2x + 5y = 7 上，因为它的常数也同倍放大了。",
  ),
  "sat-exam-parallel-lines#exam-question": graphed(
    wide(-2, 9, -3, 6),
    [
      ln([0, 3], [7, -1], "result"),
      ln([0, 0], [7, -4]),
      solid([0, 3], [7, 3], "action"),
      solid([7, 3], [7, -1], "action"),
      tag([3.5, 3], "7", "n"),
      tag([7, 1], "−4", "e"),
      tag([0.4, 4.6], "4x + 7y = 21", "e"),
    ],
    "The line 4x + 7y = 21 falls 4 for every 7 across, so its slope is −4/7. Any parallel line, like the plain one, has the same slope.",
    "直线 4x + 7y = 21 每向右 7 就下降 4，所以斜率为 −4/7。任何平行线（如图中普通的那条）斜率都相同。",
  ),
  "sat-exam-parallel-lines#harder-exam-question": graphed(
    wide(-2, 8, -3, 5),
    [
      ln([0, 2.5], [5, 0]),
      ln([0, 3], [4, 1], "result"),
      pt([4, 1], "(4, 1)", "ne"),
      pt([0, 3], "", "n", "result"),
      tag([0.4, 3.7], "(0, 3)", "e"),
      pt([0, 2.5], "", "w"),
      tag([2.8, -2], "x + 2y = 5", "e"),
    ],
    "The line through (4, 1) parallel to x + 2y = 5 has slope −1/2 and its own intercept, 3. The original line's intercept, 2.5, does not carry over.",
    "过 (4, 1) 且与 x + 2y = 5 平行的直线斜率为 −1/2，有自己的截距 3。原直线的截距 2.5 不会沿用。",
  ),
  "sat-exam-slopes-of-perpendicular-lines#exam-question": graphed(
    wide(-6, 6, -6, 6, 2),
    [
      ln([0, 0], [4, 5]),
      ln([0, 0], [5, -4], "result"),
      cornerMark([0, 0], [4, 5], [5, -4]),
      solid([0, 0], [4, 0], "action"),
      solid([4, 0], [4, 5], "action"),
      tag([4, 2.5], "5", "e"),
      tag([2.8, 0], "4", "n"),
      tag([4, 5.2], "5/4", "w"),
      tag([5, -4], "−4/5", "s"),
    ],
    "Lines with slopes 5/4 and −4/5 meet at a right angle. Turning the rise and run by a quarter turn swaps them and changes one sign, which is why the fraction flips and the sign changes.",
    "斜率为 5/4 和 −4/5 的直线相交成直角。把竖直变化和水平变化转四分之一圈，两者互换且一个变号，所以分数要颠倒并变号。",
  ),
  "sat-exam-slopes-of-perpendicular-lines#harder-exam-question": graphed(
    wide(-3, 7, -3, 7),
    [
      ln([2, 2], [5, 7]),
      ln([2, 2], [7, -1], "result"),
      cornerMark([2, 2], [3, 5], [5, -3]),
      tag([3.4, 5.5], "5x − 3y = 4", "w"),
      tag([-1.3, 4.8], "−3/5", "n"),
    ],
    "The line 5x − 3y = 4 solves to a slope of 5/3. The perpendicular line, colored, has slope −3/5.",
    "直线 5x − 3y = 4 解出斜率为 5/3。标色的垂线斜率为 −3/5。",
  ),
  "sat-exam-perpendicular-lines#exam-question": graphed(
    wide(-5, 8, -3, 10, 2),
    [
      ln([0, 7], [1, 9]),
      ln([0, 4], [6, 1], "result"),
      cornerMark([-1.2, 4.6], [1, 2], [2, -1]),
      pt([6, 1], "(6, 1)", "ne"),
      pt([0, 7], "", "e"),
      pt([0, 4], "", "n", "result"),
      tag([0.6, 8.2], "y = 2x + 7", "e"),
      tag([3.4, 2.3], "y = −½x + 4", "ne"),
    ],
    "The colored line is perpendicular to y = 2x + 7 and passes through (6, 1). Its slope is −1/2 and its intercept is 4; the old intercept, 7, plays no part.",
    "标色直线垂直于 y = 2x + 7 且过 (6, 1)。它的斜率是 −1/2，截距是 4；原来的截距 7 不起作用。",
  ),
  "sat-exam-perpendicular-lines#harder-exam-question": graphed(
    wide(-2, 8, -2, 6),
    [
      ln([0, 4], [6, 1]),
      solid([6, 1], [0, 1], "action"),
      solid([0, 1], [0, 4], "action"),
      pt([6, 1], "(6, 1)", "e"),
      pt([0, 4], "(0, c)", "ne", "result"),
      tag([3, 1], "−6", "s"),
      tag([0, 2.5], "+3", "e"),
    ],
    "Starting from (6, 1) on a line of slope −1/2, a run of −6 adds 3 to y. The line reaches x = 0 at (0, c) with c = 4.",
    "从斜率为 −1/2 的直线上的 (6, 1) 出发，水平变化 −6 使 y 增加 3。直线在 x = 0 处到达 (0, c)，其中 c = 4。",
  ),
  "sat-exam-the-relationship-between-systems-of-linear-equations-and-graphs#exam-question": graphed(
    wide(-5, 5, -5, 5, 2),
    [ln([0, -1], [1, 2], "result"), ln([0, 4], [1, 7], "result"), tag([-1.5, 0.8], "y = 3x + 4", "w"), tag([1.4, 2.2], "y = 3x − 1", "e")],
    "The lines y = 3x − 1 and y = 3x + 4 have the same slope and different intercepts, so they are parallel and never meet.",
    "直线 y = 3x − 1 和 y = 3x + 4 斜率相同、截距不同，所以平行，永不相交。",
  ),
  "sat-exam-the-relationship-between-systems-of-linear-equations-and-graphs#harder-exam-question": graphed(
    wide(-1, 6, -3, 5),
    [
      ln([0, 2], [1, 2]),
      ln([2, -1], [3, 2]),
      dash([3, 2], [3, 0], "action"),
      pt([3, 2], "(3, 2)", "se", "result"),
      tag([0.9, 2], "y = 2", "n"),
      tag([3.7, 4.2], "y = 3x − 7", "w"),
    ],
    "The horizontal line y = 2 and the line y = 3x − 7 cross at the solution of the system, (3, 2). The dashed drop reads off x = 3.",
    "水平线 y = 2 与直线 y = 3x − 7 相交于方程组的解 (3, 2)。虚线向下读出 x = 3。",
  ),
  "sat-exam-linear-systems-with-infinitely-many-solutions#exam-question": graphed(
    wide(-3, 7, -2, 4),
    [
      ln([1, 1], [6, -1]),
      ln([1, 1], [6, -1], "result", true),
      ln([0, 2.4], [6, 0]),
      tag([3.5, 0], "2x + 5y = 7", "sw"),
      tag([3, 1.2], "6x + 15y = 36", "ne"),
    ],
    "With q = 21, the equation 6x + 15y = 21 is 3 times 2x + 5y = 7 and lies on the same line, drawn dashed over it. Another value, such as 36, gives a parallel line instead.",
    "当 q = 21 时，6x + 15y = 21 是 2x + 5y = 7 的 3 倍，落在同一条直线上，图中以虚线重合。其他值（如 36）则得到一条平行线。",
  ),
  "sat-exam-linear-systems-with-no-solution#exam-question": drawing(
    pane(0, [0, 4, 1], [0, 3, 1], 6, 4.5)
      .f((x) => (7 - 2 * x) / 3, 0, 3.5)
      .f((x) => (30 - 8 * x) / 12, 0, 3.75, "result")
      .say(3.2, 1.55, "8x + 12y = 30", "n")
      .say(0.2, 0.6, "2x + 3y = 7", "e")
      .marks(),
    "With p = 8, the lines 2x + 3y = 7 and 8x + 12y = 30 have the same slope, −2/3. Their intercepts differ, since 30 ≠ 28, so they stay a small distance apart and never meet.",
    "当 p = 8 时，直线 2x + 3y = 7 与 8x + 12y = 30 斜率相同，都是 −2/3。因为 30 ≠ 28，截距不同，所以它们隔着一小段距离，永不相交。",
  ),
  "sat-exam-linear-systems-with-no-solution#harder-exam-question": graphed(
    wide(-3, 7, -2, 5),
    [
      ln([2, 1], [5, -1]),
      ln([2, 1], [5, -1], "action", true),
      ln([0, 10 / 3], [5, 0], "result"),
      tag([-2, 2.4], "n = 21", "s"),
      tag([3, 1.3], "n = 30", "ne"),
    ],
    "Every n except 21 gives a line parallel to 2x + 3y = 7, as n = 30 does here. At n = 21, shown dashed, the two equations are one line, which is the trap.",
    "除 21 外，每个 n 都给出与 2x + 3y = 7 平行的直线，如图中的 n = 30。n = 21（虚线）时两个方程是同一条直线，这是陷阱。",
  ),
  "sat-exam-modeling-with-systems-of-inequalities#exam-question": drawing(
    [
      ...ineq.marks,
      fill([ineq.at(0, 25), ineq.at(0, 50), ineq.at(12.5, 12.5)], "result"),
      seg(ineq.at(0, 50), ineq.at(50 / 3, 0)),
      seg(ineq.at(0, 25), ineq.at(25, 0)),
      note(ineq.at(9, 23), "9x + 3y = 150", "e"),
      note(ineq.at(19, 6), "x + y = 25", "ne"),
    ],
    "The money line 9x + 3y = 150 and the count line x + y = 25. The shaded region lies on or below the money line and on or above the count line, where both conditions hold.",
    "金额线 9x + 3y = 150 与数量线 x + y = 25。阴影区域在金额线上或其下方、在数量线上或其上方，两个条件同时成立。",
  ),
  "sat-exam-box-plots#exam-question": drawing(
    whisker([2, 4, 6, 12, 16], 0, 16, 2, { median: "result" }),
    "For example, a box plot of 2, 4, 6, 12 and 16. The colored line inside the box marks the median, 6, which is not the middle of the box or of the whiskers.",
    "例如，2、4、6、12、16 的箱线图。箱内标色的线表示中位数 6，它既不在箱子的正中，也不在两须的正中。",
  ),
  "sat-exam-identifying-best-fit-lines#exam-question": (() => {
    const p = pane(0, [0, 6, 1], [0, 16, 4], 6, 5).f((x) => 2 * x + 3, 0, 6, "result");
    for (const [x, y] of [
      [0.5, 4.6],
      [1, 4.2],
      [1.5, 6.9],
      [2, 6.3],
      [2.5, 8.8],
      [3, 8.2],
      [3.5, 10.8],
      [4, 10.3],
      [4.5, 12.7],
      [5, 12.4],
      [5.5, 14.8],
    ] as const)
      p.dot(x, y);
    return drawing(
      p.say(3.6, 13, "y = 2x + 3", "w").marks(),
      "For example, a cloud of points that rises about 2 per unit from near 3. The colored line y = 2x + 3 follows it, with a positive slope.",
      "例如，从 3 附近开始、每单位约上升 2 的点云。标色的直线 y = 2x + 3 贴合它，斜率为正。",
    );
  })(),
  "sat-exam-interpreting-time-series-graphs#exam-question": drawing(
    pane(0, [0, 10, 2], [0, 10, 2], 6, 5)
      .path([
        [0, 2],
        [2, 3],
        [4, 6],
        [6, 9],
        [8, 5],
        [10, 3],
      ])
      .path(
        [
          [6, 0],
          [6, 9],
        ],
        "action",
        true,
      )
      .dot(6, 9, undefined, "n", "result")
      .marks(),
    "For example, a graph of an amount over time. The highest point lies over x = 6, read straight down the dashed line, so the peak happens 6 hours in.",
    "例如，某个量随时间变化的图象。最高点位于 x = 6 上方，沿虚线向下读出，所以峰值出现在第 6 小时。",
  ),
  "sat-exam-applying-successive-percentage-changes#exam-question": drawing(
    bars([500, 600, 450], { top: 600, step: 200, hi: [2], over: true }),
    "The value 500 raised 20% becomes 600, and cutting 25% of 600 leaves 450. The cut is larger than 20% of the start because it is taken from the larger value.",
    "500 增加 20% 变成 600，再减去 600 的 25% 剩 450。这次减少是从更大的值上算的。",
  ),
};
