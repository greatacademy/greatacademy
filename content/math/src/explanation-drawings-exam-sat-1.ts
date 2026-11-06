// Drawings of the SAT explanations: shifted lines, quadratics, exponentials, geometry models, bar graphs and quadratic graphs.

import type { Figure } from "@ga/content";
import type { Point } from "@ga/subject-math";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, tag, toward } from "./explanation-drawings-charts.ts";
import { upright, wide } from "./explanation-drawings-curves.ts";
import { bars, box, dash, fill, solid } from "./explanation-drawings-exam-kit.ts";
import { ln, pt } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed, name, note, seg, square } from "./explanation-drawings-kit.ts";

const A: Point = [0, 12];
const B: Point = [-9, 0];
const C: Point = [5, 0];
const D: Point = [0, 0];
const solidH = (a: number, b: number, y: number) => solid([a, y], [b, y], "action");
const hyp = (p: number, q: number, h: number): [Point, Point, Point, Point] => [
  [0, 0],
  [p + q, 0],
  [p, h],
  [p, 0],
];

/** examSatDrawings1 draws the explanations of SAT Math Prep, by knowledge point: shifts, quadratics, exponentials, models and bar graphs. */
export const examSatDrawings1: Readonly<Record<string, Figure>> = {
  "analyzing-linear-equations-of-shifted-lines#vertical-shifts-of-lines": graphed(
    wide(-6, 6, -6, 6, 2),
    [
      ln([0, -3], [1, -1]),
      ln([0, 2], [1, 4], "result"),
      toward([1, -1], [1, 4], "action"),
      tag([1, 1.5], "+5", "e"),
      pt([0, -3], "(0, −3)", "e"),
      pt([0, 2], "(0, 2)", "nw", "result"),
      tag([2.6, 2.2], "y = 2x − 3", "se"),
      tag([-1.8, -1.6], "y = 2x + 2", "w"),
    ],
    "The line y = 2x − 3 moved up 5 units becomes y = 2x + 2. Every point rises by 5, the slope stays the same, and the y-intercept moves from −3 to 2.",
    "直线 y = 2x − 3 向上平移 5 个单位变成 y = 2x + 2。每个点都上升 5，斜率不变，y 轴截距从 −3 变为 2。",
  ),
  "determining-inputs-of-quadratic-functions-for-given-outputs#outputs-of-vertex-form-quadratics": drawing(
    pane(0, [-4, 6, 2], [0, 24, 6], 6, 5)
      .f((x) => 2 * (x - 1) ** 2 + 3, -2.2, 4.2)
      .level(21, "action")
      .path(
        [
          [1, 0],
          [1, 24],
        ],
        undefined,
        true,
      )
      .dot(-2, 21, undefined, "n", "result")
      .dot(4, 21, undefined, "n", "result")
      .dot(1, 3, "(1, 3)", "e")
      .say(5.4, 21, "21", "n")
      .marks(),
    "The graph of f(x) = 2(x − 1)² + 3 meets the height 21 at x = −2 and x = 4. Both inputs lie 3 units from the axis x = 1, shown dashed.",
    "f(x) = 2(x − 1)² + 3 的图象在 x = −2 和 x = 4 处达到高度 21。两个输入都与虚线所示的对称轴 x = 1 相距 3 个单位。",
  ),
  "finding-extreme-values-of-quadratic-functions-in-factored-form#the-vertex-is-midway-between-the-zeros": drawing(
    pane(0, [-10, 4, 2], [-30, 10, 10], 6.4, 5)
      .f((x) => (x - 2) * (x + 8), -9.4, 3.4)
      .path(
        [
          [-3, -30],
          [-3, 10],
        ],
        "action",
        true,
      )
      .dot(-8, 0, undefined, "n")
      .dot(2, 0, undefined, "n")
      .dot(-3, -25, "x = −3", "s", "result")
      .marks(),
    "The parabola f(x) = (x − 2)(x + 8) has zeros at −8 and 2. The dashed axis lies halfway between them, so the vertex is at x = −3.",
    "抛物线 f(x) = (x − 2)(x + 8) 的零点是 −8 和 2。虚线对称轴恰在两者正中，所以顶点在 x = −3。",
  ),
  "finding-extreme-values-of-quadratic-functions-in-factored-form#the-extreme-value": drawing(
    pane(0, [0, 8, 1], [-25, 15, 5], 6.4, 5)
      .f((x) => 2 * (x - 1) * (x - 7), 0, 8)
      .path(
        [
          [4, -25],
          [4, 15],
        ],
        "action",
        true,
      )
      .dot(1, 0, undefined, "n")
      .dot(7, 0, undefined, "n")
      .dot(4, -18, "(4, −18)", "s", "result")
      .marks(),
    "The parabola f(x) = 2(x − 1)(x − 7) has its vertex midway between the zeros 1 and 7. The height there, f(4) = −18, is the minimum value.",
    "抛物线 f(x) = 2(x − 1)(x − 7) 的顶点在零点 1 和 7 的正中。那里的高度 f(4) = −18 就是最小值。",
  ),
  "finding-extreme-values-of-quadratic-functions-in-standard-form#the-vertex-from-the-coefficients": drawing(
    pane(0, [-1, 5, 1], [-5, 20, 5], 6, 5)
      .f((x) => -3 * x * x + 12 * x + 5, -0.4, 4.4)
      .path(
        [
          [2, -5],
          [2, 20],
        ],
        "action",
        true,
      )
      .dot(2, 17, "(2, 17)", "e", "result")
      .dot(0, 5, undefined, "n")
      .marks(),
    "The parabola f(x) = −3x² + 12x + 5 opens down. Its axis is x = 2, shown dashed, and its maximum is at the vertex on that line.",
    "抛物线 f(x) = −3x² + 12x + 5 开口向下。对称轴是虚线 x = 2，最大值在这条线上的顶点处。",
  ),
  "finding-extreme-values-of-quadratic-functions-in-standard-form#the-extreme-value-from-standard-form": graphed(
    wide(-3, 7, -7, 5),
    [
      curveOf((x) => 2 * x * x - 8 * x + 3),
      dash([2, 0], [2, -5], "action"),
      pt([2, 0], "x = 2", "ne"),
      pt([2, -5], "(2, −5)", "e", "result"),
    ],
    "The parabola f(x) = 2x² − 8x + 3 has its vertex at x = 2. The minimum value is the height of the vertex, −5, not its x-coordinate.",
    "抛物线 f(x) = 2x² − 8x + 3 的顶点在 x = 2。最小值是顶点的高度 −5，而不是它的 x 坐标。",
  ),
  "transforming-exponential-functions#vertical-shifts-of-exponential-functions": drawing(
    pane(0, [-4, 4, 1], [-6, 15, 3], 6.4, 5)
      .f((x) => 3 * 2 ** x, -4, 2.3)
      .f((x) => 3 * 2 ** x - 5, -4, 2.3, "result")
      .level(-5, "action")
      .path(
        [
          [2, 12],
          [2, 7],
        ],
        "action",
      )
      .dot(2, 12, "(2, 12)", "e")
      .dot(2, 7, "(2, 7)", "e", "result")
      .say(-3, -5, "y = −5", "n")
      .marks(),
    "The graph of g(x) = 3(2)ˣ − 5 is the graph of f(x) = 3(2)ˣ moved down 5. Its asymptote moves from y = 0 to the dashed y = −5, and g(2) = 7.",
    "g(x) = 3(2)ˣ − 5 的图象是 f(x) = 3(2)ˣ 的图象向下平移 5。渐近线从 y = 0 移到虚线 y = −5，且 g(2) = 7。",
  ),
  "transforming-exponential-functions#horizontal-shifts-of-exponential-functions": drawing(
    pane(0, [-1, 5, 1], [0, 54, 9], 6, 5)
      .f((x) => 5 * 3 ** x, -1, 2.3)
      .f((x) => 5 * 3 ** (x - 2), 1, 4.3, "result")
      .path(
        [
          [2, 45],
          [4, 45],
        ],
        "action",
      )
      .dot(2, 45, "(2, 45)", "w")
      .dot(4, 45, "(4, 45)", "e", "result")
      .say(3, 45, "2", "n")
      .marks(),
    "The graph of g(x) = f(x − 2) is the graph of f(x) = 5(3)ˣ moved 2 to the right. So g at 4 takes the value that f takes at 2, which is 45.",
    "g(x) = f(x − 2) 的图象是 f(x) = 5(3)ˣ 的图象向右平移 2。所以 g 在 4 处的值就是 f 在 2 处的值 45。",
  ),
  "solving-constant-quadratic-systems-of-equations#counting-intersections-with-a-horizontal-line": graphed(
    wide(-4, 4, -3, 6),
    [
      curveOf((x) => x * x + 1),
      ln([0, 4], [1, 4], "result"),
      ln([0, 1], [1, 1], "action"),
      ln([0, -2], [1, -2], undefined, true),
      pt([-Math.sqrt(3), 4], "", "n", "result"),
      pt([Math.sqrt(3), 4], "", "n", "result"),
      pt([0, 1], "", "n", "action"),
      tag([3.2, 4], "k > m", "n"),
      tag([3.2, 1], "k = m", "n"),
      tag([3.2, -2], "k < m", "n"),
    ],
    "For example, the parabola y = x² + 1 has its vertex at height m = 1. A line above the vertex meets it twice, the line through the vertex once, and the dashed line below it never.",
    "例如，抛物线 y = x² + 1 的顶点高度 m = 1。顶点上方的直线与它交两次，过顶点的直线交一次，下方的虚线不相交。",
  ),
  "modeling-geometry-problems-with-quadratic-equations#rectangles-with-related-sides": drawing(
    box(0, 0, 10, 6, { bottom: "w + 4", right: "w", shade: "result", inside: "60" }),
    "A rectangle of width w and length w + 4 with area 60, drawn to scale for the width w = 6 and length 10.",
    "宽为 w、长为 w + 4、面积为 60 的长方形，按宽 w = 6、长 10 的比例绘制。",
  ),
  "modeling-geometry-problems-with-quadratic-equations#uniform-borders": drawing(
    [
      ...box(0, 0, 10, 8, { bottom: "6 + 2x", right: "4 + 2x", shade: "action" }),
      fill([
        [2, 2],
        [8, 2],
        [8, 6],
        [2, 6],
      ]),
      ...box(2, 2, 6, 4, { inside: "6 × 4" }),
      seg([0, 4], [2, 4], "action"),
      seg([8, 4], [10, 4], "action"),
      note([1, 4], "x", "n"),
      note([9, 4], "x", "n"),
    ],
    "A 6 by 4 photo inside a frame of width x. The frame adds x on each side, so the outer rectangle is 6 + 2x by 4 + 2x. It is drawn for x = 2.",
    "6 乘 4 的照片外有宽 x 的边框。边框在每侧各加 x，所以外框是 6 + 2x 乘 4 + 2x。图按 x = 2 绘制。",
  ),
  "solving-problems-with-embedded-right-triangles#two-right-triangles-sharing-a-leg": drawing(
    [
      { kind: "polygon", points: [A, B, C] },
      seg(A, D, "result"),
      square(D, C, A),
      name(A, "A", "n"),
      name(B, "B", "sw"),
      name(C, "C", "se"),
      name(D, "D", "s"),
      note([-4.5, 6], "15", "nw"),
      note([2.5, 6], "13", "ne"),
      note([0, 6], "12", "e"),
      note([-4.5, 0], "9", "s"),
      note([2.5, 0], "5", "s"),
    ],
    "The altitude AD = 12 splits triangle ABC into two right triangles that share this leg. With AB = 15 and AC = 13, the pieces of the base are BD = 9 and DC = 5.",
    "高 AD = 12 把三角形 ABC 分成共用这条直角边的两个直角三角形。由 AB = 15、AC = 13 得底边的两段 BD = 9、DC = 5。",
  ),
  "solving-problems-with-embedded-right-triangles#the-altitude-to-the-hypotenuse": (() => {
    const [P, Q, R, F] = hyp(4, 9, 6);
    return drawing(
      [
        { kind: "polygon", points: [P, Q, R] },
        square(R, P, Q),
        seg(R, F, "result"),
        square(F, Q, R),
        note([2, 0], "4", "s"),
        note([8.5, 0], "9", "s"),
        note([4, 3], "h = 6", "e"),
      ],
      "The altitude h to the hypotenuse of a right triangle divides the hypotenuse into pieces of 4 and 9. Since h² = 4 · 9, the altitude is 6.",
      "直角三角形斜边上的高 h 把斜边分成 4 和 9 两段。由 h² = 4 · 9 得高为 6。",
    );
  })(),
  "solving-problems-with-embedded-right-triangles#a-leg-from-the-hypotenuse-segments": (() => {
    const [P, Q, R, F] = hyp(4, 9, 6);
    return drawing(
      [
        { kind: "polygon", points: [P, Q, R] },
        square(R, P, Q),
        seg(R, F, undefined, true),
        square(F, Q, R),
        seg(P, R, "result"),
        seg(P, F, "action"),
        note([2, 3], "a", "nw"),
        note([2, 0], "4", "s"),
        note([8.5, 0], "9", "s"),
      ],
      "For example, an altitude that cuts the hypotenuse of 13 into segments of 4 and 9. The colored leg a has the segment of 4 next to it, so a² = 13 · 4.",
      "例如，高把长 13 的斜边分成 4 和 9 两段。标色的直角边 a 与长 4 的一段相邻，所以 a² = 13 · 4。",
    );
  })(),
  "bar-graphs#reading-a-bar-graph": drawing(
    bars([15, 20, 10], { top: 25, step: 5, hi: [1], names: ["A", "B", "C"], grid: true }),
    "For example, a bar graph with gridlines 5 apart. Bar B reaches the fourth line, so it stands for 20.",
    "例如，网格线间隔为 5 的条形图。条 B 到达第四条线，所以它代表 20。",
  ),
  "bar-graphs#percentages-from-a-bar-graph": drawing(
    bars([10, 20, 5, 10, 5], { top: 20, step: 5, hi: [0], over: true }),
    "Five bars of 10, 20, 5, 10 and 5 add up to 50. The colored first bar is 10 of those 50, which is 20% of the whole.",
    "五个条的高度 10、20、5、10、5 合计 50。标色的第一个条是 50 中的 10，占整体的 20%。",
  ),
  "best-fit-lines-with-compressed-axes#intercept-off-the-graph": drawing(
    pane(0, [0, 30, 10], [0, 120, 20], 6, 5)
      .f((x) => 90 - 2 * x, 10, 20)
      .f((x) => 90 - 2 * x, 0, 10, "action", true)
      .path(
        [
          [10, 0],
          [10, 120],
        ],
        undefined,
        true,
      )
      .dot(10, 70, "(10, 70)", "ne")
      .dot(20, 50, "(20, 50)", "ne")
      .dot(0, 90, "(0, 90)", "ne", "result")
      .marks(),
    "The line through (10, 70) and (20, 50) has slope −2. A graph that starts at x = 10 cuts it at the dashed edge, but the line continues back to its y-intercept at 90.",
    "过 (10, 70) 和 (20, 50) 的直线斜率为 −2。从 x = 10 开始的图在虚线边缘把它截断，但直线一直延伸到 y 轴截距 90。",
  ),
  "further-successive-percentage-changes#net-percentage-change": drawing(
    bars([100, 120, 96], { top: 120, step: 40, hi: [2], over: true }),
    "For example, starting at 100. An increase of 20% gives 120, and a decrease of 20% of 120 gives 96, which is 4% below the start.",
    "例如，从 100 开始。增加 20% 得 120，再减少 120 的 20% 得 96，比起始值低 4%。",
  ),
  "sat-exam-quadratic-equations-with-no-real-solutions#exam-question": graphed(
    wide(-6, 3, -2, 7),
    [
      curveOf((x) => x * x + 4 * x + 7, "result"),
      curveOf((x) => x * x + 4 * x + 4, undefined, undefined, undefined, true),
      pt([-2, 0], "", "n"),
      tag([-2, 0.5], "c = 4", "n"),
      tag([-2, 4], "c = 7", "n"),
    ],
    "For example, y = x² + 4x + c. At c = 4, shown dashed, the graph only touches the x-axis. With c > 4, as for c = 7, it never meets the axis, so there are no real solutions.",
    "例如 y = x² + 4x + c。c = 4（虚线）时图象恰好碰到 x 轴。c > 4 时，比如 c = 7，图象与 x 轴不相交，所以没有实数解。",
  ),
  "sat-exam-graphs-of-quadratic-functions#exam-question": graphed(
    wide(-3, 6, -3, 6),
    [
      curveOf((x) => (x - 2) ** 2 - 1),
      pt([2, -1], "(2, −1)", "se", "result"),
      pt([0, 3], "", "e"),
      pt([1, 0], "", "e"),
      pt([3, 0], "", "e"),
    ],
    "For example, a parabola that opens up. Its vertex, the lowest point, is colored: x = 2 first, then y = −1. The plain dots are intercepts, not the vertex.",
    "例如，开口向上的抛物线。标色的是顶点，也就是最低点：先读 x = 2，再读 y = −1。普通的点是截距，不是顶点。",
  ),
  "sat-exam-graphs-of-quadratic-functions#harder-exam-question": graphed(
    wide(-6, 3, -2, 7),
    [curveOf((x) => (x + 2) ** 2 + 1), upright(-2, "action"), pt([-2, 1], "(−2, 1)", "w", "result"), tag([0.3, 4.2], "(x + 2)² + 1", "e")],
    "For example, a parabola that opens up with vertex (−2, 1) fits f(x) = (x + 2)² + 1. The vertex lies at x = −2, yet the equation shows x + 2.",
    "例如，开口向上、顶点为 (−2, 1) 的抛物线对应 f(x) = (x + 2)² + 1。顶点在 x = −2，方程中却写作 x + 2。",
  ),
  "sat-exam-finding-extreme-values-of-quadratic-functions-in-vertex-form#harder-exam-question": graphed(
    wide(2, 10, -5, 3),
    [curveOf((x) => -2 * (x - 6) ** 2 + 1), upright(6, "action"), pt([6, 1], "x = 6", "ne", "result")],
    "The parabola −2(x − 6)² + 1 opens down, so it has a maximum, and it peaks where x − 6 = 0, at x = 6.",
    "抛物线 −2(x − 6)² + 1 开口向下，所以有最大值，在 x − 6 = 0 即 x = 6 处达到顶峰。",
  ),
  "sat-exam-using-symmetry-to-reason-about-quadratic-functions#exam-question": graphed(
    wide(-1, 9, -1, 8),
    [
      curveOf((x) => 0.5 * (x - 4) ** 2 + 1),
      upright(4, "result"),
      solidH(1, 7, 5.5),
      pt([1, 5.5], "f(1)", "ne"),
      pt([7, 5.5], "f(7)", "nw"),
      tag([2.5, 5.5], "3", "n"),
      tag([5.5, 5.5], "3", "n"),
    ],
    "Two inputs with equal outputs, 1 and 7, sit equally far from the dashed axis of the parabola. So the vertex's x-coordinate is their average, 4.",
    "两个输出相等的输入 1 和 7 与抛物线的虚线对称轴距离相等。所以顶点的 x 坐标是它们的平均值 4。",
  ),
  "sat-exam-using-symmetry-to-reason-about-quadratic-functions#harder-exam-question": graphed(
    wide(-1, 7, -1, 7),
    [
      curveOf((x) => (x - 3) ** 2 + 1),
      upright(3, "action"),
      solidH(1, 5, 5),
      pt([1, 5], "", "w"),
      pt([5, 5], "x = 5", "e", "result"),
      tag([2, 5], "2", "n"),
      tag([4, 5], "2", "n"),
      tag([3, 6.4], "x = 3", "e"),
    ],
    "A point at x = 1 lies 2 units from the axis x = 3. Its mirror image lies 2 units on the other side, at x = 5, with the same output. The parabola itself is one example.",
    "x = 1 处的点与对称轴 x = 3 相距 2。它的镜像在另一侧相距 2 处，即 x = 5，输出相同。图中的抛物线只是一个例子。",
  ),
};
