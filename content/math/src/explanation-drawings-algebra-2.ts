// Drawings in the explanations of Algebra II: graphs recomputed from the equations in the text,
// or an example with numbers of its own when the text has none.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { type Chart, chart, curveOf, openPt, tag, toward, traced } from "./explanation-drawings-charts.ts";
import { ln, pt, shift, view } from "./explanation-drawings-geometry-2.ts";
import { edge, mini } from "./explanation-drawings-grades-3.ts";
import { dotAt, drawing, graphed, note, seg } from "./explanation-drawings-kit.ts";

type Fn = (x: number) => number;
type Tone = "action" | "result";

/** bare is a point with no label on a plane. */
const bare = (at: Point, tone?: Tone): PlaneMark => ({ kind: "point", at, ...(tone && { tone }) });

/** sideways is the graph of x = g(y) on a plane, drawn in short segments. */
const sideways = (g: Fn, from: number, to: number, tone?: Tone): PlaneMark[] => {
  const marks: PlaneMark[] = [];
  const steps = 60;
  for (let i = 0; i < steps; i++) {
    const a = from + ((to - from) * i) / steps;
    const b = from + ((to - from) * (i + 1)) / steps;
    marks.push(edge([g(a), a], [g(b), b], tone));
  }
  return marks;
};

/** branches is y = f(x) on both sides of the vertical asymptote x = h, inside a view. */
const branches = (f: Fn, h: number, lo: number, hi: number, tone?: Tone): PlaneMark[] => [
  curveOf(f, tone, lo, h - 0.02),
  curveOf(f, tone, h + 0.02, hi),
];

/** mirrorLine is the dashed line y = x between two values. */
const mirrorLine = (lo: number, hi: number): PlaneMark => ln([lo, lo], [hi, hi], undefined, true);

/** across is a dashed horizontal line. */
const across = (y: number, lo: number, hi: number, tone?: Tone): PlaneMark => ln([lo, y], [hi, y], tone, true);

/** upright is a dashed vertical line. */
const upright = (x: number, lo: number, hi: number, tone?: Tone): PlaneMark => ln([x, lo], [x, hi], tone, true);

/** curveInMini is y = f(x) inside a mini panel, in short segments kept inside its axes. */
const curveInMini = (f: Fn, s: "accent" | "action" | "result" = "accent"): Mark[] => {
  const marks: Mark[] = [];
  for (let i = 0; i < 48; i++) {
    const a = -2 + (i * 4) / 48;
    const b = a + 4 / 48;
    if (Math.abs(f(a)) <= 2 && Math.abs(f(b)) <= 2) marks.push(seg([a, f(a)], [b, f(b)], s));
  }
  return marks;
};

/** on is a curve across a chart, kept inside its y scale. */
const on = (c: Chart, f: Fn, from: number, to: number, y: readonly [number, number], tone?: "accent" | "action" | "result"): Mark[] =>
  traced(c.at, f, from, to, y[0], y[1], tone);

const localCubic: Fn = (x) => (14 / 9) * (x ** 3 / 3 - x ** 2 / 2 - 2 * x) + 59 / 27;
const turning: Fn = (x) => 0.15 * (x ** 3 / 3 - x ** 2 / 2 - 6 * x) + 0.5;
const log = (b: number, x: number): number => Math.log(x) / Math.log(b);
const wave =
  (mid: number, size: number, period: number, peak: number): Fn =>
  (x) =>
    mid + size * Math.cos((2 * Math.PI * (x - peak)) / period);

/** algebraDrawings2 are drawings in the explanations of Algebra II, by topic and knowledge point. */
export const algebraDrawings2: Readonly<Record<string, Figure>> = {
  "local-extrema#local-extrema-from-a-graph": graphed(
    view(-3, 4, 1, -5, 6),
    [curveOf(localCubic), pt([-1, 4], "local maximum (−1, 4)", "n", "result"), pt([2, -3], "local minimum (2, −3)", "s", "action")],
    "A graph rising to (−1, 4), falling to (2, −3) and rising again: a local maximum at x = −1, and a local minimum at x = 2.",
    "上升到 (−1, 4)、下降到 (2, −3)、再上升的图像：x = −1 处局部最大，x = 2 处局部最小。",
  ),
  "local-extrema#local-and-global-extrema": graphed(
    view(-5, 5, 1, -4, 8),
    [
      edge([-4, 2], [-2, 6]),
      edge([-2, 6], [-0.5, 2]),
      edge([-0.5, 2], [1.5, 4]),
      edge([1.5, 4], [3, -2]),
      edge([3, -2], [4, 1]),
      bare([-4, 2]),
      bare([4, 1]),
      pt([-2, 6], "local and global maximum", "n", "result"),
      pt([1.5, 4], "local maximum only", "n"),
      pt([-0.5, 2], "local minimum only", "s"),
      pt([3, -2], "local and global minimum", "s", "action"),
    ],
    "For example, the higher hilltop is both a local and the global maximum, and the lower hilltop only a local maximum. The lower valley floor is lower than the endpoints too, so it is the global minimum.",
    "例如，较高的山顶既是局部最大也是全局最大，较低的山顶只是局部最大。较低的谷底也低于端点，所以是全局最小。",
  ),
  "one-to-one-functions#the-horizontal-line-test": drawing(
    [
      ...mini(
        0,
        [...curveInMini((x) => x ** 3 / 4), seg([-2, 0.432], [2, 0.432], "action", true), { kind: "dot", at: [1.2, 0.432] }],
        "always rises: passes",
      ),
      ...mini(
        7,
        [
          ...curveInMini((x) => 1.5 - 0.7 * x * x),
          seg([-2, 0.8], [2, 0.8], "action", true),
          { kind: "dot", at: [-1, 0.8] },
          { kind: "dot", at: [1, 0.8] },
        ],
        "rises, then falls: fails",
      ),
    ],
    "A graph that always rises meets a horizontal line once. A graph that rises and then falls meets a line just below its top twice.",
    "一直上升的图像与水平线只交一次。先升后降的图像与略低于顶点的水平线交两次。",
  ),
  "one-to-one-functions#inputs-with-equal-outputs": graphed(
    view(-1, 7, 1, -1, 7),
    [
      curveOf((x) => (x - 3) ** 2 + 1),
      upright(3, -1, 7, "action"),
      edge([1, 5], [5, 5], undefined, true),
      pt([1, 5], "(1, 5)", "ne", "result"),
      pt([5, 5], "(5, 5)", "nw", "result"),
      tag([2, 5], "2", "s"),
      tag([4, 5], "2", "s"),
    ],
    "f(x) = (x − 3)² + 1 is symmetric about x = 3: the inputs 1 and 5 are both 2 away from 3, and f(1) = f(5) = 5.",
    "f(x) = (x − 3)² + 1 关于 x = 3 对称：输入 1 和 5 都距 3 为 2，f(1) = f(5) = 5。",
  ),
  "graphs-of-inverse-functions#points-on-the-inverse": graphed(
    view(-1, 9, 1, -1, 9),
    [
      mirrorLine(-1, 9),
      edge([2, 7], [7, 2], "action", true),
      pt([2, 7], "(2, 7)", "n"),
      pt([7, 2], "(7, 2)", "e", "result"),
      tag([8, 8], "y = x", "w"),
    ],
    "(2, 7) on f and (7, 2) on the inverse have swapped coordinates, and are mirror images in the line y = x.",
    "f 上的 (2, 7) 和反函数上的 (7, 2) 坐标互换，关于直线 y = x 对称。",
  ),
  "graphs-of-inverse-functions#inverse-values-from-a-graph": graphed(
    view(-5, 4, 1, -2, 7),
    [
      curveOf((x) => 0.5 * x + 4),
      edge([0, 3], [-2, 3], "action", true),
      edge([-2, 3], [-2, 0], "result", true),
      pt([-2, 3], "(−2, 3)", "nw"),
      tag([0, 3], "3", "e"),
      tag([-2, -0.7], "f⁻¹(3) = −2", "s"),
    ],
    "For f⁻¹(3), go across from the height 3 to the graph at (−2, 3), and read x = −2.",
    "求 f⁻¹(3)：从高度 3 水平走到图像上的 (−2, 3)，读出 x = −2。",
  ),
  "graphs-of-inverse-functions#inverses-of-lines": graphed(
    view(-5, 8, 1, -5, 8),
    [
      mirrorLine(-5, 8),
      curveOf((x) => 2 * x + 6),
      curveOf((x) => (x - 6) / 2, "result"),
      pt([0, 6], "(0, 6)", "e"),
      pt([6, 0], "(6, 0)", "n", "result"),
      pt([-3, 0], "(−3, 0)", "nw"),
      pt([0, -3], "(0, −3)", "se", "result"),
    ],
    "f(x) = 2x + 6 and its inverse, with slope ½: (0, 6) becomes (6, 0), and (−3, 0) becomes (0, −3).",
    "f(x) = 2x + 6 和它的反函数（斜率 ½）：(0, 6) 变为 (6, 0)，(−3, 0) 变为 (0, −3)。",
  ),
  "domain-and-range-of-inverse-functions#domain-and-range-from-a-graph": graphed(
    view(-6, 5, 1, -3, 6),
    [
      edge([-4, 5], [3, -1]),
      pt([-4, 5], "(−4, 5)", "n"),
      openPt([3, -1], "(3, −1)", "e"),
      edge([-4, 0], [3, 0], "action"),
      edge([0, -1], [0, 5], "result"),
    ],
    "From the filled dot at (−4, 5) to the open dot at (3, −1): the domain [−4, 3) on the x-axis and the range (−1, 5] on the y-axis.",
    "从 (−4, 5) 处实心点到 (3, −1) 处空心点：x 轴上的定义域 [−4, 3) 和 y 轴上的值域 (−1, 5]。",
  ),
  "invertible-functions#restricting-parabolas-and-v-shapes": graphed(
    view(-2, 7, 1, -1, 10),
    [
      curveOf((x) => (x - 2) ** 2, "result", 2, 6),
      curveOf((x) => (x - 2) ** 2, undefined, -2, 2, true),
      bare([2, 0]),
      pt([5, 9], "(5, 9)", "e", "result"),
    ],
    "f(x) = (x − 2)² always increases on [2, ∞), the solid half containing x = 5, and is one-to-one there.",
    "f(x) = (x − 2)² 在含 x = 5 的实线半边 [2, ∞) 上一直增加，在那里是一一对应的。",
  ),
  "invertible-functions#restricting-a-graph": graphed(
    view(-6, 6, 1, -4, 4),
    [
      curveOf(turning, undefined, -5, 5),
      curveOf(turning, "result", -2, 3),
      bare([-5, turning(-5)]),
      bare([5, turning(5)]),
      pt([-2, turning(-2)], "x = −2", "n", "result"),
      pt([3, turning(3)], "x = 3", "s", "result"),
      pt([1, turning(1)], "x = 1", "ne", "action"),
    ],
    "For example, a graph on [−5, 5] that turns at x = −2 and x = 3: the largest one-to-one interval containing x = 1 is [−2, 3], the part it only falls on.",
    "例如，[−5, 5] 上在 x = −2 和 x = 3 转折的图像：含 x = 1 的最大一一对应区间是 [−2, 3]，图像在此一直下降。",
  ),
  "calculating-the-inverse-of-a-function#inverses-of-square-root-functions": graphed(
    view(-5, 7, 1, -5, 7),
    [
      mirrorLine(-5, 7),
      curveOf((x) => 2 * Math.sqrt(x + 1) - 3, undefined, -1, 7),
      curveOf((x) => (x + 3) ** 2 / 4 - 1, "result", -3, 3),
      pt([-1, -3], "(−1, −3)", "e"),
      pt([-3, -1], "(−3, −1)", "w", "result"),
    ],
    "f(x) = 2√(x + 1) − 3 and its inverse: only the right half of the parabola, starting at x = −3, as the mirror image in y = x.",
    "f(x) = 2√(x + 1) − 3 和它的反函数：只是抛物线的右半边，从 x = −3 开始，是关于 y = x 的对称图形。",
  ),
  "inverses-of-quadratic-functions#inverses-of-shifted-squares": graphed(
    view(-1, 9, 1, -1, 9),
    [
      mirrorLine(-1, 9),
      curveOf((x) => (x - 3) ** 2 + 1, undefined, 3, 5.8),
      curveOf((x) => Math.sqrt(x - 1) + 3, "result", 1, 9),
      pt([3, 1], "(3, 1)", "se"),
      pt([1, 3], "(1, 3)", "nw", "result"),
    ],
    "f(x) = (x − 3)² + 1 for x ≥ 3 and its inverse √(x − 1) + 3, with outputs y ≥ 3: the positive root.",
    "x ≥ 3 时的 f(x) = (x − 3)² + 1 和它的反函数 √(x − 1) + 3，输出 y ≥ 3：取正根。",
  ),
  "plotting-x-as-a-function-of-y#points-on-x-as-a-function-of-y": graphed(
    view(-2, 7, 1, -3, 5),
    [...sideways((y) => y * y - 2 * y, -1.6, 3.6), pt([3, 3], "(3, 3)", "se", "result"), pt([3, -1], "(3, −1)", "se", "result")],
    "x = y² − 2y: y = 3 gives the point (3, 3), and y = −1 gives (3, −1).",
    "x = y² − 2y：y = 3 得点 (3, 3)，y = −1 得点 (3, −1)。",
  ),
  "plotting-x-as-a-function-of-y#sideways-parabolas": graphed(
    view(-4, 6, 1, -6, 2),
    [
      ...sideways((y) => -((y + 2) ** 2) + 4, -4.8, 0.8),
      across(-2, -4, 6, "action"),
      pt([4, -2], "(4, −2)", "ne", "result"),
      tag([-3, -2], "y = −2", "n"),
    ],
    "x = −(y + 2)² + 4 opens to the left from the vertex (4, −2), with the horizontal axis y = −2.",
    "x = −(y + 2)² + 4 从顶点 (4, −2) 向左开口，对称轴是水平线 y = −2。",
  ),
  "plotting-x-as-a-function-of-y#matching-sideways-graphs": graphed(
    view(-6, 3, 1, -1, 5),
    [...sideways((y) => -2 * (y - 2) ** 2 + 1, 0.2, 3.8), pt([1, 2], "(1, 2)", "e", "result"), pt([-1, 3], "(−1, 3)", "nw")],
    "Vertex (1, 2) and the point (−1, 3): the graph opens to the left, and x = −2(y − 2)² + 1.",
    "顶点 (1, 2) 和点 (−1, 3)：图像向左开口，x = −2(y − 2)² + 1。",
  ),
  "periodic-functions#the-period-from-a-graph": graphed(
    view(-5, 7, 1, -2, 6),
    [
      curveOf(wave(1, 2, 4, 1)),
      bare([-3, 3]),
      bare([1, 3]),
      bare([5, 3]),
      edge([1, 4], [5, 4], "result"),
      edge([1, 3], [1, 4], undefined, true),
      edge([5, 3], [5, 4], undefined, true),
      tag([3, 4], "period 4", "n"),
    ],
    "For example, a wave with peaks at x = −3, 1 and 5: the distance from one peak to the next is the period, 4.",
    "例如，波峰在 x = −3、1、5 的波：相邻波峰的距离就是周期 4。",
  ),
  "periodic-functions#periodic-values-from-a-graph": graphed(
    view(-1, 8, 1, -1, 5),
    [curveOf(wave(2.5, 1.5, 3, 1)), pt([1, 4], "(1, 4)", "n", "result"), pt([4, 4], "(4, 4)", "n"), pt([7, 4], "(7, 4)", "n")],
    "For example, a graph with period 3 through (1, 4) repeats at (4, 4), (7, 4), and so on: 31 = 1 + 10 · 3, so f(31) = 4.",
    "例如，周期 3、过 (1, 4) 的图像在 (4, 4)、(7, 4) 等处重复：31 = 1 + 10 · 3，所以 f(31) = 4。",
  ),
  "even-and-odd-functions#even-and-odd-from-a-graph": drawing(
    (() => {
      const c = chart({ x: [-3, 3, 3], y: [-4, 4, 4], xName: "x", yName: "y", w: 5, h: 5 });
      return [
        ...c.marks,
        ...on(c, (x) => 0.75 * x * x, -2.3, 2.3, [-4, 4]),
        ...dotAt(c.at(2, 3), "(2, 3)", "e"),
        ...dotAt(c.at(-2, 3), "(−2, 3)", "w", "result"),
        note(c.at(0, -4.2), "even", "s"),
        ...shift(
          [
            ...c.marks,
            ...on(c, (x) => 0.375 * x ** 3, -2.2, 2.2, [-4, 4]),
            ...dotAt(c.at(2, 3), "(2, 3)", "w"),
            ...dotAt(c.at(-2, -3), "(−2, −3)", "e", "result"),
            note(c.at(0, -4.2), "odd", "s"),
          ],
          7.5,
        ),
      ];
    })(),
    "If (2, 3) is on the graph, an even function also passes through (−2, 3), and an odd one through (−2, −3). These curves are examples.",
    "若 (2, 3) 在图像上，偶函数也过 (−2, 3)，奇函数也过 (−2, −3)。这些曲线只是示例。",
  ),
  "unbounded-behavior-of-functions-near-a-point#vertical-asymptotes": graphed(
    view(-6, 4, 1, -4, 4),
    [
      ...branches((x) => 1 / (x + 2), -2, -6, 4),
      upright(-2, -4, 4, "action"),
      openPt([1, 1 / 3], "hole at x = 1", "n"),
      tag([-2, 3.4], "x = −2", "e"),
    ],
    "The graph of (x − 1)/(x² + x − 2) has an asymptote at x = −2. The factor x − 1 cancels, leaving only a hole at x = 1.",
    "(x − 1)/(x² + x − 2) 的图像在 x = −2 处有渐近线。因式 x − 1 约去，在 x = 1 处只留下一个洞。",
  ),
  "unbounded-behavior-of-functions-near-a-point#unbounded-behavior-from-a-graph": graphed(
    view(-4, 6, 1, -5, 5),
    [
      ...branches((x) => 1 / (x - 1), 1, -4, 6),
      upright(1, -5, 5, "action"),
      toward([1.4, 2.5], [1.22, 4.5], "result"),
      toward([0.6, -2.5], [0.78, -4.5], "result"),
      tag([1.5, 3.4], "right side: ∞", "e"),
      tag([0.5, -3.4], "left side: −∞", "w"),
    ],
    "For example, near the dashed asymptote x = 1, the left branch plunges to −∞ and the right branch shoots up to ∞.",
    "例如，在虚线渐近线 x = 1 附近，左支下落到 −∞，右支上升到 ∞。",
  ),
  "the-average-rate-of-change-of-a-function#average-rate-of-change-from-a-graph": graphed(
    view(-1, 5, 1, -1, 11),
    [
      curveOf((x) => x * x),
      edge([1, 1], [3, 9], "result"),
      edge([1, 1], [3, 1], "action", true),
      edge([3, 1], [3, 9], "action", true),
      pt([1, 1], "(1, 1)", "nw"),
      pt([3, 9], "(3, 9)", "e"),
      tag([2, 1], "run 2", "s"),
      tag([3, 5], "rise 8", "e"),
    ],
    "For example, the secant line of y = x² from (1, 1) to (3, 9) has slope 8/2 = 4, the average rate of change.",
    "例如，y = x² 从 (1, 1) 到 (3, 9) 的割线斜率是 8/2 = 4，这就是平均变化率。",
  ),
  "vertical-translations-of-functions#points-under-a-vertical-translation": graphed(
    view(-4, 4, 1, -3, 7),
    [
      curveOf((x) => x * x + 1),
      curveOf((x) => x * x - 2, "result"),
      toward([2, 5], [2, 2], "action"),
      pt([2, 5], "(2, 5)", "e"),
      pt([2, 2], "(2, 2)", "e", "result"),
    ],
    "For example, with f(x) = x² + 1, the point (2, 5) moves straight down 3 to (2, 2) on y = f(x) − 3.",
    "例如，f(x) = x² + 1 时，点 (2, 5) 竖直向下 3 移到 y = f(x) − 3 上的 (2, 2)。",
  ),
  "vertical-translations-of-functions#equations-of-vertical-translations": graphed(
    view(-3, 7, 1, -9, 5),
    [
      curveOf((x) => x * x - 4 * x + 1),
      curveOf((x) => x * x - 4 * x - 4, "result"),
      toward([2, -3], [2, -8], "action"),
      pt([2, -3], "(2, −3)", "ne"),
      pt([2, -8], "(2, −8)", "e", "result"),
    ],
    "f(x) = x² − 4x + 1 shifted down 5 is x² − 4x − 4: the vertex moves from (2, −3) to (2, −8).",
    "f(x) = x² − 4x + 1 向下 5 得 x² − 4x − 4：顶点从 (2, −3) 移到 (2, −8)。",
  ),
  "vertical-translations-of-functions#vertical-translations-from-graphs": graphed(
    view(-4, 4, 1, -4, 6),
    [
      curveOf((x) => x * x - 3),
      curveOf((x) => x * x + 1, "result"),
      toward([1, -2], [1, 2], "action"),
      pt([1, -2], "(1, −2)", "e"),
      pt([1, 2], "(1, 2)", "e", "result"),
      tag([1, 0], "4", "w"),
    ],
    "For example, (1, −2) on f and (1, 2) on g: every point moved up 4, so g(x) = f(x) + 4.",
    "例如，f 上的 (1, −2) 和 g 上的 (1, 2)：每个点上移 4，所以 g(x) = f(x) + 4。",
  ),
  "horizontal-translations-of-functions#points-under-a-horizontal-translation": graphed(
    view(-6, 4, 1, -1, 7),
    [
      curveOf((x) => x * x + 1),
      curveOf((x) => (x + 3) ** 2 + 1, "result"),
      toward([2, 5], [-1, 5], "action"),
      pt([2, 5], "(2, 5)", "e"),
      pt([-1, 5], "(−1, 5)", "nw", "result"),
    ],
    "For example, with f(x) = x² + 1, the graph of y = f(x + 3) is shifted 3 to the left: (2, 5) moves to (−1, 5).",
    "例如，f(x) = x² + 1 时，y = f(x + 3) 的图像向左 3：(2, 5) 移到 (−1, 5)。",
  ),
  "horizontal-translations-of-functions#equations-of-horizontal-translations": graphed(
    view(-7, 3, 1, -4, 6),
    [
      curveOf((x) => x * x + 3 * x),
      curveOf((x) => x * x + 7 * x + 10, "result"),
      toward([-1.5, -2.25], [-3.5, -2.25], "action"),
      pt([-1.5, -2.25], "f", "e"),
      pt([-3.5, -2.25], "g", "w", "result"),
    ],
    "f(x) = x² + 3x shifted left 2 is x² + 7x + 10: the vertex moves 2 to the left, at the same height.",
    "f(x) = x² + 3x 向左 2 得 x² + 7x + 10：顶点向左 2，高度不变。",
  ),
  "horizontal-translations-of-functions#horizontal-translations-from-graphs": graphed(
    view(-4, 6, 1, -1, 5),
    [
      edge([-3, 1], [-1, 4]),
      edge([-1, 4], [0, 2]),
      edge([2, 1], [4, 4], "result"),
      edge([4, 4], [5, 2], "result"),
      edge([-3, 1], [2, 1], "action", true),
      pt([-3, 1], "(−3, 1)", "s"),
      pt([2, 1], "(2, 1)", "s", "result"),
      tag([-0.5, 1], "5", "s"),
    ],
    "For example, left endpoints (−3, 1) on f and (2, 1) on g: the graph moved 5 to the right, so g(x) = f(x − 5).",
    "例如，f 的左端点 (−3, 1) 和 g 的左端点 (2, 1)：图像右移 5，所以 g(x) = f(x − 5)。",
  ),
  "vertical-stretches-of-functions#points-under-a-vertical-stretch": graphed(
    view(-5, 5, 1, -7, 1),
    [
      curveOf((x) => (-3 / 8) * x * x),
      curveOf((x) => (-1 / 8) * x * x, "result"),
      toward([4, -6], [4, -2], "action"),
      pt([4, -6], "(4, −6)", "e"),
      pt([4, -2], "(4, −2)", "e", "result"),
      pt([0, 0], "stays", "n"),
    ],
    "For example, (4, −6) on f moves to (4, −2) on y = ⅓f(x), while the point on the x-axis stays.",
    "例如，f 上的 (4, −6) 移到 y = ⅓f(x) 上的 (4, −2)，而 x 轴上的点不动。",
  ),
  "vertical-stretches-of-functions#vertical-stretches-from-graphs": graphed(
    view(-4, 4, 1, -1, 6),
    [
      curveOf((x) => x * x),
      curveOf((x) => 0.5 * x * x, "result"),
      edge([2, 0], [2, 4], undefined, true),
      pt([2, 4], "f(2) = 4", "e"),
      pt([2, 2], "g(2) = 2", "e", "result"),
    ],
    "For example, f(2) = 4 and g(2) = 2 at the same x: a = 2/4 = ½.",
    "例如，同一个 x 处 f(2) = 4、g(2) = 2：a = 2/4 = ½。",
  ),
  "horizontal-stretches-of-functions#points-under-a-horizontal-stretch": graphed(
    view(-1, 14, 1, -1, 3),
    [
      curveOf((x) => Math.sqrt(x / 6), undefined, 0, 14),
      curveOf((x) => Math.sqrt(x / 3), "result", 0, 14),
      curveOf((x) => Math.sqrt(x / 12), "action", 0, 14),
      across(1, 0, 14),
      pt([3, 1], "(3, 1)", "n", "result"),
      pt([6, 1], "(6, 1)", "n"),
      pt([12, 1], "(12, 1)", "s", "action"),
    ],
    "For example, (6, 1) on f moves to (3, 1) on y = f(2x) and to (12, 1) on y = f(½x), at the same height.",
    "例如，f 上的 (6, 1) 移到 y = f(2x) 上的 (3, 1)，以及 y = f(½x) 上的 (12, 1)，高度不变。",
  ),
  "horizontal-stretches-of-functions#horizontal-stretches-from-graphs": graphed(
    view(-1, 5, 1, -1, 3),
    [
      edge([0, 0], [4, 2]),
      edge([0, 0], [2, 2], "result"),
      pt([4, 2], "(4, 2)", "e"),
      pt([2, 2], "(2, 2)", "n", "result"),
      edge([2, 2], [4, 2], "action", true),
    ],
    "For example, the right endpoint (4, 2) of f and (2, 2) of g: b = 4/2 = 2.",
    "例如，f 的右端点 (4, 2) 和 g 的右端点 (2, 2)：b = 4/2 = 2。",
  ),
  "constructing-functions-using-transformations#equations-of-transformed-graphs": graphed(
    view(-4, 5, 1, -1, 7),
    [
      curveOf((x) => 2 * Math.sqrt(x + 2) + 1, undefined, -2, 5),
      pt([-2, 1], "(−2, 1)", "w", "result"),
      pt([-1, 3], "(−1, 3)", "nw"),
      edge([-2, 1], [-1, 1], "action", true),
      edge([-1, 1], [-1, 3], "action", true),
    ],
    "y = 2√(x + 2) + 1 starts at (−2, 1). One unit to the right, at (−1, 3), it has risen 2, so a = 2.",
    "y = 2√(x + 2) + 1 从 (−2, 1) 开始。向右一个单位到 (−1, 3)，升高 2，所以 a = 2。",
  ),
  "vertical-reflections-of-functions#points-under-a-vertical-reflection": graphed(
    view(-6, 6, 1, -6, 6),
    [
      curveOf((x) => -x - 2),
      curveOf((x) => x + 2, "result"),
      edge([3, -5], [3, 5], "action", true),
      pt([3, -5], "(3, −5)", "e"),
      pt([3, 5], "(3, 5)", "e", "result"),
      pt([-2, 0], "root", "n"),
    ],
    "For example, (3, −5) on f moves to (3, 5) on y = −f(x), while the root on the x-axis stays.",
    "例如，f 上的 (3, −5) 移到 y = −f(x) 上的 (3, 5)，而 x 轴上的根不动。",
  ),
  "vertical-reflections-of-functions#equations-of-vertical-reflections": graphed(
    view(-2, 5, 1, -4, 4),
    [
      curveOf((x) => x * x - 3 * x + 2),
      curveOf((x) => -x * x + 3 * x - 2, "result"),
      bare([1, 0]),
      bare([2, 0]),
      tag([-0.6, 3.5], "f", "e"),
      tag([-0.6, -3.5], "−f", "e"),
    ],
    "f(x) = x² − 3x + 2 and −f(x) = −x² + 3x − 2 are mirror images in the x-axis, with the same roots.",
    "f(x) = x² − 3x + 2 和 −f(x) = −x² + 3x − 2 关于 x 轴对称，根相同。",
  ),
  "horizontal-reflections-of-functions#points-under-a-horizontal-reflection": graphed(
    view(-6, 6, 1, -4, 4),
    [
      curveOf((x) => x / 2 - 1),
      curveOf((x) => -x / 2 - 1, "result"),
      edge([4, 1], [-4, 1], "action", true),
      pt([4, 1], "(4, 1)", "n"),
      pt([-4, 1], "(−4, 1)", "n", "result"),
      pt([0, -1], "stays", "s"),
    ],
    "For example, (4, 1) on f moves to (−4, 1) on y = f(−x), while the y-intercept stays.",
    "例如，f 上的 (4, 1) 移到 y = f(−x) 上的 (−4, 1)，而 y 截距不动。",
  ),
  "horizontal-reflections-of-functions#equations-of-horizontal-reflections": graphed(
    view(-5, 5, 1, -6, 6),
    [
      curveOf((x) => 2 * x * x + 5 * x - 1),
      curveOf((x) => 2 * x * x - 5 * x - 1, "result"),
      pt([0, -1], "(0, −1)", "s"),
      tag([-3.3, 4], "f(x)", "w"),
      tag([3.3, 4], "f(−x)", "e"),
    ],
    "f(x) = 2x² + 5x − 1 and f(−x) = 2x² − 5x − 1 are mirror images in the y-axis, with the same y-intercept.",
    "f(x) = 2x² + 5x − 1 和 f(−x) = 2x² − 5x − 1 关于 y 轴对称，y 截距相同。",
  ),
  "horizontal-reflections-of-functions#recognizing-reflections": graphed(
    view(-7, 7, 1, -4, 4),
    [
      curveOf((x) => Math.sqrt(x), undefined, 0, 7),
      curveOf((x) => -Math.sqrt(x), "action", 0, 7),
      curveOf((x) => Math.sqrt(-x), "result", -7, 0),
      curveOf((x) => -Math.sqrt(-x), undefined, -7, 0, true),
      pt([4, 2], "f: (4, 2)", "n"),
      pt([4, -2], "−f(x): (4, −2)", "s", "action"),
      pt([-4, 2], "f(−x): (−4, 2)", "n", "result"),
      pt([-4, -2], "−f(−x): (−4, −2)", "s"),
    ],
    "For example, with f(x) = √x: −f(x) keeps the x-coordinate, f(−x) keeps the y-coordinate, and −f(−x), dashed, sends (x, y) to (−x, −y).",
    "例如，f(x) = √x 时：−f(x) 保持 x 坐标，f(−x) 保持 y 坐标，−f(−x)（虚线）把 (x, y) 变为 (−x, −y)。",
  ),
  "combining-reflections-with-other-graph-transformations#the-order-of-reflections-and-shifts": graphed(
    view(-4, 4, 1, -7, 5),
    [
      curveOf((x) => x * x, undefined, -2, 2, true),
      curveOf((x) => -x * x + 3, "result"),
      curveOf((x) => -x * x - 3, "action"),
      bare([0, 3], "result"),
      bare([0, -3], "action"),
      tag([1.2, 2.2], "−f(x) + 3", "e"),
      tag([1.2, -4.2], "−f(x) − 3", "e"),
    ],
    "For example, with f(x) = x², dashed: reflecting and then shifting up 3 gives −f(x) + 3, while shifting up 3 first and then reflecting gives −f(x) − 3.",
    "例如，f(x) = x²（虚线）：先反射再上移 3 得 −f(x) + 3，先上移 3 再反射得 −f(x) − 3。",
  ),
  "absolute-value-graph-transformations#absolute-value-transformations-from-graphs": drawing(
    (() => {
      const c = chart({ x: [-6, 6, 6], y: [-6, 6, 6], xName: "x", yName: "y", w: 6, h: 6 });
      return [
        ...c.marks,
        seg(c.at(0, -5), c.at(6, 1), undefined, true),
        seg(c.at(0, 5), c.at(5, 0), "result"),
        seg(c.at(5, 0), c.at(6, 1), "result"),
        ...dotAt(c.at(3, -2), "(3, −2)", "e"),
        ...dotAt(c.at(3, 2), "(3, 2)", "e", "result"),
        note(c.at(-3.5, 4), "y = |f(x)|", "n"),
        ...shift(
          [
            ...c.marks,
            seg(c.at(0, -5), c.at(6, 1)),
            seg(c.at(0, -5), c.at(-6, 1), "result"),
            ...dotAt(c.at(3, -2), "(3, −2)", "e"),
            ...dotAt(c.at(-3, -2), "(−3, −2)", "w", "result"),
            note(c.at(3, 4), "y = f(|x|)", "n"),
          ],
          11,
        ),
      ];
    })(),
    "For example, f(x) = x − 5 through (3, −2): y = |f(x)| reflects the part below the x-axis up, and y = f(|x|) replaces the left half with the mirror image of the right half.",
    "例如，f(x) = x − 5 过 (3, −2)：y = |f(x)| 把 x 轴下方的部分翻上去，y = f(|x|) 用右半边的对称图形替换左半边。",
  ),
  "graphing-elementary-cubic-functions#the-center-of-a-cubic-curve": graphed(
    view(-4, 2, 1, -8, 2),
    [curveOf((x) => 2 * (x + 1) ** 3 - 4), pt([-1, -4], "(−1, −4)", "e", "result")],
    "y = 2(x + 1)³ − 4 is symmetric about its center (−1, −4).",
    "y = 2(x + 1)³ − 4 关于中心 (−1, −4) 对称。",
  ),
  "graphing-cubic-curves-containing-three-distinct-real-roots#the-y-intercept-of-a-factored-cubic": drawing(
    (() => {
      const c = chart({ x: [-4, 5, 1], y: [-40, 60, 20], xName: "x", yName: "y", h: 6 });
      return [
        ...c.marks,
        ...on(c, (x) => 2 * (x - 1) * (x + 3) * (x - 4), -3.5, 4.6, [-40, 60]),
        ...dotAt(c.at(-3, 0), "−3", "nw", "action"),
        ...dotAt(c.at(1, 0), "1", "ne", "action"),
        ...dotAt(c.at(4, 0), "4", "nw", "action"),
        ...dotAt(c.at(0, 24), "(0, 24)", "e", "result"),
      ];
    })(),
    "f(x) = 2(x − 1)(x + 3)(x − 4) crosses the x-axis at 1, −3 and 4, and the y-axis at (0, 24).",
    "f(x) = 2(x − 1)(x + 3)(x − 4) 与 x 轴交于 1、−3、4，与 y 轴交于 (0, 24)。",
  ),
  "graphing-cubic-curves-containing-three-distinct-real-roots#a-cubic-from-its-graph": graphed(
    view(-2, 5, 1, -3, 5),
    [
      curveOf((x) => 0.5 * (x + 1) * (x - 2) * (x - 3)),
      pt([-1, 0], "−1", "nw", "action"),
      pt([2, 0], "2", "n", "action"),
      pt([3, 0], "3", "se", "action"),
      pt([0, 3], "(0, 3)", "ne", "result"),
    ],
    "f(x) = ½(x + 1)(x − 2)(x − 3) crosses at −1, 2 and 3, passes through (0, 3), and rises at the right.",
    "f(x) = ½(x + 1)(x − 2)(x − 3) 穿过 −1、2、3，过 (0, 3)，右端上升。",
  ),
  "graphing-cubic-curves-containing-a-double-root#a-cubic-with-a-double-root-from-its-graph": graphed(
    view(-3, 5, 1, -4, 4),
    [
      curveOf((x) => -0.5 * (x - 2) ** 2 * (x + 1)),
      pt([2, 0], "touches at 2", "n", "action"),
      pt([-1, 0], "crosses at −1", "nw", "action"),
      pt([0, -2], "(0, −2)", "se", "result"),
    ],
    "f(x) = −½(x − 2)²(x + 1) touches the x-axis at 2, crosses it at −1, and passes through (0, −2).",
    "f(x) = −½(x − 2)²(x + 1) 在 2 处与 x 轴相切，在 −1 处穿过，并过 (0, −2)。",
  ),
  "graphing-cubic-curves-containing-one-distinct-real-root#the-real-roots": drawing(
    (() => {
      const c = chart({ x: [-3, 4, 1], y: [-20, 20, 10], xName: "x", yName: "y", h: 6 });
      return [
        ...c.marks,
        ...on(c, (x) => (x - 2) * (x * x + 2 * x + 5), -1.8, 3, [-20, 20]),
        ...dotAt(c.at(2, 0), "x = 2", "nw", "result"),
      ];
    })(),
    "f(x) = (x − 2)(x² + 2x + 5) crosses the x-axis just once, at x = 2.",
    "f(x) = (x − 2)(x² + 2x + 5) 只与 x 轴交一次，在 x = 2。",
  ),
  "graphing-cubic-curves-containing-one-distinct-real-root#a-triple-root-from-the-graph": graphed(
    view(-2, 4, 1, -4, 5),
    [curveOf((x) => 0.5 * (x - 1) ** 3), pt([1, 0], "1", "n", "action"), pt([3, 4], "(3, 4)", "e", "result")],
    "f(x) = ½(x − 1)³ flattens out as it crosses at 1, and passes through (3, 4).",
    "f(x) = ½(x − 1)³ 在 1 处变平并穿过 x 轴，且过 (3, 4)。",
  ),
  "graphing-general-polynomials#behavior-at-a-root": drawing(
    [
      ...mini(
        0,
        curveInMini((x) => x),
        "m = 1: crosses",
      ),
      ...mini(
        8,
        curveInMini((x) => x * x),
        "m even: touches",
      ),
      ...mini(
        16,
        curveInMini((x) => x ** 3),
        "m odd ≥ 3: flattens",
      ),
    ],
    "At a root of multiplicity 1 the graph crosses like a line, at an even one it touches like a parabola, and at an odd one of at least 3 it flattens out as it crosses.",
    "重数为 1 的根处，图像像直线一样穿过；偶数重根处像抛物线一样相切；至少 3 的奇数重根处变平并穿过。",
  ),
  "vertical-translations-of-exponential-growth-functions#translating-growth-graphs": graphed(
    view(-5, 4, 1, -4, 6),
    [
      curveOf((x) => 2 ** x, undefined, undefined, undefined, true),
      curveOf((x) => 2 ** x - 3, "result"),
      across(-3, -5, 4, "action"),
      toward([0, 1], [0, -2]),
      tag([-3.5, -3], "y = −3", "s"),
    ],
    "y = 2^x, dashed, moved 3 units down is y = 2^x − 3, and the asymptote becomes y = −3.",
    "y = 2^x（虚线）向下 3 得 y = 2^x − 3，渐近线变为 y = −3。",
  ),
  "vertical-translations-of-exponential-growth-functions#translated-growth-graph-equations": graphed(
    view(-5, 3, 1, -3, 7),
    [curveOf((x) => 3 ** x - 2), across(-2, -5, 3, "action"), pt([1, 1], "(1, 1)", "e", "result"), tag([-3.5, -2], "y = −2", "s")],
    "With asymptote y = −2 and the point (1, 1): b − 2 = 1, so b = 3 and y = 3^x − 2.",
    "渐近线 y = −2 且过点 (1, 1)：b − 2 = 1，所以 b = 3，y = 3^x − 2。",
  ),
  "vertical-translations-of-exponential-decay-functions#translating-decay-graphs": graphed(
    view(-2, 5, 1, -1, 8),
    [
      curveOf((x) => 4 * (1 / 3) ** x, undefined, undefined, undefined, true),
      curveOf((x) => 4 * (1 / 3) ** x + 2, "result"),
      across(2, -2, 5, "action"),
      pt([0, 6], "(0, 6)", "e", "result"),
      pt([0, 4], "(0, 4)", "e"),
      tag([4, 2], "y = 2", "s"),
    ],
    "y = 4(⅓)^x, dashed, moved 2 units up: the graph now falls toward the asymptote y = 2.",
    "y = 4(⅓)^x（虚线）向上 2：图像现在下降趋近渐近线 y = 2。",
  ),
  "vertical-translations-of-exponential-decay-functions#x-intercepts-of-translated-graphs": graphed(
    view(-5, 3, 1, -9, 3),
    [curveOf((x) => 0.5 ** x - 8), across(-8, -5, 3, "action"), pt([-3, 0], "(−3, 0)", "ne", "result"), tag([1.5, -8], "y = −8", "n")],
    "y = (½)^x − 8 crosses the x-axis at x = −3, to the left of the y-axis.",
    "y = (½)^x − 8 与 x 轴交于 x = −3，在 y 轴左边。",
  ),
  "interpreting-graphs-of-exponential-functions#percent-change-from-a-graph": graphed(
    view(-1, 4, 1, -1, 10),
    [
      curveOf((t) => 4 * 1.5 ** t, "result"),
      curveOf((t) => 8 * 0.75 ** t, "action"),
      pt([0, 4], "(0, 4)", "w", "result"),
      pt([0, 8], "(0, 8)", "w", "action"),
      pt([1, 6], "(1, 6)", "s"),
    ],
    "Through (0, 4) and (1, 6), b = 1.5: growth of 50% per unit. Through (0, 8) and (1, 6), b = 0.75: a fall of 25% per unit.",
    "过 (0, 4) 和 (1, 6)，b = 1.5：每单位增长 50%。过 (0, 8) 和 (1, 6)，b = 0.75：每单位下降 25%。",
  ),
  "interpreting-graphs-of-exponential-functions#the-long-run-level": graphed(
    view(-2, 8, 1, -1, 10),
    [
      curveOf((t) => 7 * 0.5 ** t + 2, undefined, 0, 8),
      across(2, 0, 8, "action"),
      pt([0, 9], "start 9", "e", "result"),
      edge([-0.8, 2], [-0.8, 9], "result"),
      tag([-0.8, 5.5], "7", "w"),
      tag([6.5, 2], "level 2", "n"),
    ],
    "A drink starting at 9 and leveling off at 2 falls by 7 in all. The curve is an example with b = ½.",
    "从 9 开始、稳定在 2 的饮料总共下降 7。曲线是 b = ½ 的示例。",
  ),
  "vertical-reflections-of-exponential-functions#reflecting-across-the-x-axis": graphed(
    view(-4, 3, 1, -8, 8),
    [
      curveOf((x) => 2 * 3 ** x + 1),
      curveOf((x) => -2 * 3 ** x - 1, "result"),
      across(1, -4, 3, "action"),
      across(-1, -4, 3, "action"),
      tag([-3, 1], "y = 1", "n"),
      tag([-3, -1], "y = −1", "s"),
    ],
    "f(x) = 2(3)^x + 1 and −f(x) = −2(3)^x − 1: the asymptote y = 1 becomes y = −1.",
    "f(x) = 2(3)^x + 1 和 −f(x) = −2(3)^x − 1：渐近线 y = 1 变为 y = −1。",
  ),
  "combining-graph-transformations-of-exponential-functions#key-points-under-transformations": graphed(
    view(-3, 5, 1, -6, 6),
    [
      curveOf((x) => 3 ** x),
      curveOf((x) => 2 * 3 ** (x - 1) - 5, "result"),
      across(-5, -3, 5, "action"),
      toward([1, 3], [2, 1], "action"),
      pt([1, 3], "(1, 3)", "nw"),
      pt([2, 1], "(2, 1)", "e", "result"),
    ],
    "Under g(x) = 2(3)^(x − 1) − 5, the point (1, 3) of y = 3^x moves to (2, 1).",
    "在 g(x) = 2(3)^(x − 1) − 5 下，y = 3^x 上的点 (1, 3) 移到 (2, 1)。",
  ),
  "graphing-logarithmic-functions#the-base-from-the-graph": graphed(
    view(-1, 10, 1, -3, 3),
    [
      curveOf((x) => log(3, x), undefined, 0.02, 10),
      pt([1, 0], "(1, 0)", "se"),
      pt([3, 1], "(3, 1)", "nw"),
      pt([9, 2], "(9, 2)", "n", "result"),
    ],
    "Through (9, 2): b² = 9, so b = 3. The graph also passes through (1, 0) and, at height 1, (3, 1).",
    "过 (9, 2)：b² = 9，所以 b = 3。图像也过 (1, 0)，以及高度 1 处的 (3, 1)。",
  ),
  "graphing-logarithmic-functions#reflecting-the-exponential-graph": graphed(
    view(-3, 9, 1, -3, 9),
    [
      mirrorLine(-3, 9),
      curveOf((x) => 2 ** x),
      curveOf((x) => log(2, x), "result", 0.02, 9),
      edge([3, 8], [8, 3], "action", true),
      pt([3, 8], "(3, 8)", "w"),
      pt([8, 3], "(8, 3)", "s", "result"),
    ],
    "y = 2^x and y = log₂ x are mirror images in the line y = x: (3, 8) on one gives (8, 3) on the other.",
    "y = 2^x 和 y = log₂ x 关于直线 y = x 对称：一条上的 (3, 8) 给出另一条上的 (8, 3)。",
  ),
  "combining-graph-transformations-of-logarithmic-functions#the-vertical-asymptote": graphed(
    view(-1, 9, 1, -5, 9),
    [curveOf((x) => 3 * log(2, 2 * x - 6) + 1, undefined, 3.01, 9), upright(3, -5, 9, "action"), tag([3, 7.5], "x = 3", "w")],
    "g(x) = 3 log₂(2x − 6) + 1 approaches the line x = 3, where 2x − 6 = 0.",
    "g(x) = 3 log₂(2x − 6) + 1 趋近直线 x = 3，此处 2x − 6 = 0。",
  ),
  "combining-graph-transformations-of-logarithmic-functions#key-points-of-logarithmic-graphs": graphed(
    view(-2, 7, 1, -7, 3),
    [
      curveOf((x) => log(3, x), undefined, 0.02, 7),
      curveOf((x) => 2 * log(3, x + 1) - 4, "result", -0.98, 7),
      upright(-1, -7, 3, "action"),
      toward([3, 1], [2, -2], "action"),
      pt([3, 1], "(3, 1)", "n"),
      pt([2, -2], "(2, −2)", "e", "result"),
    ],
    "Under g(x) = 2 log₃(x + 1) − 4, the point (3, 1) of y = log₃ x moves to (2, −2).",
    "在 g(x) = 2 log₃(x + 1) − 4 下，y = log₃ x 上的点 (3, 1) 移到 (2, −2)。",
  ),
  "graphing-reciprocal-functions#branches-and-asymptotes": graphed(
    view(-6, 6, 1, -6, 6),
    [...branches((x) => -4 / x, 0, -6, 6), tag([-3, 4], "quadrant II", "n"), tag([3, -4], "quadrant IV", "s")],
    "y = −4/x, with k < 0: its branches lie in quadrants II and IV, and the axes are its asymptotes.",
    "y = −4/x，k < 0：两支在第二、四象限，坐标轴是渐近线。",
  ),
  "graphing-reciprocal-functions#the-constant-from-a-graph": graphed(
    view(-6, 6, 1, -6, 6),
    [...branches((x) => -6 / x, 0, -6, 6), pt([-2, 3], "(−2, 3)", "sw", "result")],
    "The graph through (−2, 3) has k = −2 · 3 = −6: y = −6/x, with branches in quadrants II and IV.",
    "过 (−2, 3) 的图像 k = −2 · 3 = −6：y = −6/x，两支在第二、四象限。",
  ),
  "graph-transformations-of-reciprocal-functions#asymptotes-of-translated-reciprocals": graphed(
    view(-8, 4, 1, -9, 3),
    [
      ...branches((x) => 5 / (x + 2) - 3, -2, -8, 4),
      upright(-2, -9, 3, "action"),
      across(-3, -8, 4, "action"),
      tag([-2, 2.2], "x = −2", "e"),
      tag([-6.5, -3], "y = −3", "n"),
    ],
    "y = 5/(x + 2) − 3 has the asymptotes x = −2 and y = −3.",
    "y = 5/(x + 2) − 3 的渐近线是 x = −2 和 y = −3。",
  ),
  "graph-transformations-of-reciprocal-functions#translations-from-a-graph": graphed(
    view(-1, 7, 1, -6, 2),
    [
      ...branches((x) => 1 / (x - 3) - 2, 3, -1, 7),
      upright(3, -6, 2, "action"),
      across(-2, -1, 7, "action"),
      bare([3, -2], "action"),
      pt([4, -1], "(4, −1)", "ne", "result"),
      pt([2, -3], "(2, −3)", "sw", "result"),
    ],
    "The dashed asymptotes x = 3 and y = −2 cross at the center (3, −2) of y = 1/(x − 3) − 2. (4, −1) and (2, −3) are one unit from it in each direction.",
    "虚线渐近线 x = 3 和 y = −2 交于 y = 1/(x − 3) − 2 的中心 (3, −2)。(4, −1) 和 (2, −3) 在每个方向上距它一个单位。",
  ),
  "combining-graph-transformations-of-reciprocal-functions#functions-from-graphs": graphed(
    view(-7, 5, 1, -5, 8),
    [
      ...branches((x) => -3 / (x + 1) + 2, -1, -7, 5),
      upright(-1, -5, 8, "action"),
      across(2, -7, 5, "action"),
      pt([1, 0.5], "(1, ½)", "e", "result"),
      tag([-1, 7], "x = −1", "e"),
      tag([-5.5, 2], "y = 2", "s"),
    ],
    "Asymptotes x = −1 and y = 2 and the point (1, ½): a = (½ − 2)(1 + 1) = −3, so y = −3/(x + 1) + 2.",
    "渐近线 x = −1、y = 2 和点 (1, ½)：a = (½ − 2)(1 + 1) = −3，所以 y = −3/(x + 1) + 2。",
  ),
  "finding-intersections-of-lines-and-reciprocal-functions#intersections-with-k-over-x": graphed(
    view(-7, 7, 1, -7, 7),
    [
      ...branches((x) => 6 / x, 0, -7, 7),
      curveOf((x) => x + 1, "action"),
      pt([2, 3], "(2, 3)", "e", "result"),
      pt([-3, -2], "(−3, −2)", "w", "result"),
    ],
    "The line y = x + 1 meets y = 6/x at (2, 3) and (−3, −2).",
    "直线 y = x + 1 与 y = 6/x 交于 (2, 3) 和 (−3, −2)。",
  ),
  "graph-transformations-of-square-root-functions#the-endpoint": graphed(
    view(-6, 5, 1, -6, 3),
    [curveOf((x) => -2 * Math.sqrt(x + 4) + 1, undefined, -4, 5), pt([-4, 1], "(−4, 1)", "n", "result")],
    "y = −2√(x + 4) + 1 starts at the endpoint (−4, 1), where the root is 0.",
    "y = −2√(x + 4) + 1 从端点 (−4, 1) 开始，此处根式为 0。",
  ),
  "finding-intersections-of-lines-and-radical-functions#horizontal-lines": graphed(
    view(-2, 17, 1, -4, 7),
    [
      curveOf((x) => 2 * Math.sqrt(x + 1) - 3, undefined, -1, 17),
      across(5, -2, 17, "action"),
      pt([15, 5], "(15, 5)", "n", "result"),
      pt([-1, -3], "(−1, −3)", "e"),
      tag([2, 5], "y = 5", "n"),
    ],
    "y = 2√(x + 1) − 3 meets the line y = 5 at (15, 5).",
    "y = 2√(x + 1) − 3 与直线 y = 5 交于 (15, 5)。",
  ),
  "finding-intersections-of-lines-and-radical-functions#slanted-lines": graphed(
    view(-8, 5, 1, -4, 6),
    [
      curveOf((x) => Math.sqrt(x + 7), undefined, -7, 5),
      curveOf((x) => x + 1, "action"),
      pt([2, 3], "(2, 3)", "se", "result"),
      openPt([-3, -2], "x = −3: rejected", "w"),
    ],
    "y = √(x + 7) and y = x + 1 meet only at (2, 3). At x = −3, the line is below the x-axis while the root never is, so that root is rejected.",
    "y = √(x + 7) 和 y = x + 1 只交于 (2, 3)。x = −3 时直线在 x 轴下方，而根式永远不会，所以舍去这个根。",
  ),
};
