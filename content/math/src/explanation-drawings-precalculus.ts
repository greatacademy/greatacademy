// Drawings in the explanations of Precalculus: rational functions, inequalities and inverse trigonometric functions,
// with every curve, asymptote and hole computed from the formula in the text, or an example of its own when the text has none.

import type { Figure } from "@ga/content";
import type { Mark, PlaneMark, Point } from "@ga/subject-math";
import { chart, curveOf, openPt, tag, traced } from "./explanation-drawings-charts.ts";
import { across, bare, piChart, plot, thick, upright, wall, wide } from "./explanation-drawings-curves.ts";
import { ln, pt, shift } from "./explanation-drawings-geometry-2.ts";
import { dotAt, drawing, graphed, note, seg } from "./explanation-drawings-kit.ts";

type Fn = (x: number) => number;
const { PI: pi, asin, acos, atan, sin, cos, tan, sqrt } = Math;

/** a function between its walls, one curve for each stretch */
const pieces = (f: Fn, walls: readonly number[], lo: number, hi: number, tone?: "action" | "result"): PlaneMark[] => {
  const cuts = [lo, ...walls, hi];
  return cuts.slice(1).map((b, i) => curveOf(f, tone, (cuts[i] as number) + 0.01, b - 0.01));
};
/** the same in a small chart of its own, with a label beneath */
const panel = (dx: number, f: Fn, walls: readonly number[], level: number | undefined, s: string): Mark[] => {
  const c = chart({ x: [-6, 6, 3], y: [-10, 10, 5], xName: "x", yName: "y", w: 3.6, h: 3.6 });
  return shift(
    [
      ...c.marks,
      ...plot(c, f, -6, 6, -10, 10),
      ...walls.map((v) => wall(c, v, -10, 10, "action")),
      ...(level === undefined ? [] : [seg(c.at(-6, level), c.at(6, level), "result", true)]),
      note(c.at(0, -11.5), s, "s"),
    ],
    dx,
  );
};
const signs = (list: readonly (readonly [number, string])[], y: number): PlaneMark[] => list.map(([x, s]) => tag([x, y], s));
/** the part of the plane above or below y = f(x), reaching the corners of a window */
const beyond = (f: Fn, x0: number, x1: number, top: number, bottom: number, above: boolean): PlaneMark => {
  const xs = Array.from({ length: 81 }, (_, i) => x0 + ((x1 - x0) * i) / 80);
  const curve: Point[] = xs.map((x) => [x, Math.min(top, Math.max(bottom, f(x)))]);
  const edge = above ? top : bottom;
  return { kind: "polygon", points: [[x0, edge], ...curve, [x1, edge]], tone: "result" };
};

/** precalculusDrawings are drawings in the explanations of Precalculus, by topic and knowledge point. */
export const precalculusDrawings: Readonly<Record<string, Figure>> = {
  "roots-of-rational-functions#intercepts-of-rational-functions": graphed(
    wide(-6, 6, -5, 5),
    [
      ...pieces((x) => (x * x - 3 * x + 6) / (2 * x * x + x - 4), [(-1 - sqrt(33)) / 4, (-1 + sqrt(33)) / 4], -6, 6),
      upright((-1 - sqrt(33)) / 4, "action"),
      upright((-1 + sqrt(33)) / 4, "action"),
      pt([0, -1.5], "(0, −3/2)", "e", "result"),
    ],
    "f(x) = (x² − 3x + 6)/(2x² + x − 4) has y-intercept (0, −3/2): the constant terms 6 over −4.",
    "f(x) = (x² − 3x + 6)/(2x² + x − 4) 的 y 轴截距点是 (0, −3/2)：常数项 6 除以 −4。",
  ),
  "vertical-asymptotes-of-rational-functions#denominators-with-leading-coefficients": graphed(
    wide(-4, 4, -6, 6),
    [
      ...pieces((x) => 5 / ((2 * x - 1) * (3 * x + 2)), [-2 / 3, 0.5], -4, 4),
      upright(-2 / 3, "action"),
      upright(0.5, "action"),
      tag([-2 / 3, 5], "x = −2/3", "w"),
      tag([0.5, 5], "x = 1/2", "e"),
    ],
    "5/((2x − 1)(3x + 2)) has asymptotes where each factor is zero: x = 1/2 and x = −2/3, not x = 1 and x = −2.",
    "5/((2x − 1)(3x + 2)) 的渐近线在每个因式为零处：x = 1/2 和 x = −2/3，而不是 x = 1 和 x = −2。",
  ),
  "vertical-asymptotes-of-rational-functions#cubic-denominators": graphed(
    wide(-6, 7, -4, 4),
    [
      ...pieces((x) => 1 / (x * (x - 3)), [0, 3], -6, 7),
      upright(0, "action"),
      upright(3, "action"),
      openPt([-3, 1 / 18]),
      tag([-3, 0.3], "hole at x = −3", "n"),
    ],
    "(x + 3)/(x³ − 9x) has a denominator that is zero at 0, 3 and −3. The factor x + 3 cancels: a hole at x = −3 and asymptotes at x = 0 and x = 3.",
    "(x + 3)/(x³ − 9x) 的分母在 0、3、−3 处为零。因式 x + 3 被约去：x = −3 处是洞，x = 0 和 x = 3 处是渐近线。",
  ),
  "locating-holes-in-rational-functions#holes-of-factored-functions": graphed(
    wide(-6, 12, -8, 10),
    [
      ...pieces((x) => (2 * (x + 1)) / (x - 5), [5], -6, 12),
      upright(5, "action"),
      across(2),
      openPt([3, -4]),
      tag([3, -4], "hole (3, −4)", "s"),
    ],
    "After canceling, 2(x + 1)/(x − 5) at x = 3 gives −4: a hole at (3, −4), with x = 5 still an asymptote.",
    "约分后 2(x + 1)/(x − 5) 在 x = 3 处的值为 −4：(3, −4) 是洞，x = 5 仍是渐近线。",
  ),
  "locating-holes-in-rational-functions#holes-after-factoring": graphed(
    wide(-5, 6, -5, 6),
    [
      ...pieces((x) => (x + 3) / (2 * x + 1), [-0.5], -5, 6),
      upright(-0.5, "action"),
      across(0.5),
      openPt([2, 1]),
      tag([2, 1], "hole (2, 1)", "ne"),
    ],
    "(x² + x − 6)/(2x² − 3x − 2) simplifies to (x + 3)/(2x + 1) for x ≠ 2, which is 1 at x = 2: a hole at (2, 1).",
    "(x² + x − 6)/(2x² − 3x − 2) 在 x ≠ 2 时化简为 (x + 3)/(2x + 1)，它在 x = 2 处为 1：(2, 1) 是洞。",
  ),
  "locating-holes-in-rational-functions#hole-or-asymptote": graphed(
    wide(-10, 6, -7, 9),
    [
      ...pieces((x) => (x - 1) / (x + 4), [-4], -10, 6),
      upright(-4, "action"),
      across(1),
      openPt([1, 0]),
      tag([1, 0], "hole (1, 0)", "se"),
      tag([-4, 8], "x = −4", "e"),
    ],
    "(x − 1)/(x + 4) with x − 1 canceled once more: a hole at (1, 0), where the factor cancels completely, and an asymptote at x = −4, where it does not.",
    "(x − 1)/(x + 4)，且 x − 1 又约去一次：在因式完全约去的 (1, 0) 处是洞，在未约去的 x = −4 处是渐近线。",
  ),
  "horizontal-asymptotes-of-rational-functions#equal-degrees": graphed(
    wide(-6, 6, -7, 5),
    [
      ...pieces((x) => (6 * x * x - x + 5) / (3 - 4 * x * x), [-sqrt(3) / 2, sqrt(3) / 2], -6, 6),
      upright(-sqrt(3) / 2),
      upright(sqrt(3) / 2),
      across(-1.5, "action"),
      tag([4.4, -1.5], "y = −3/2", "s"),
    ],
    "(6x² − x + 5)/(3 − 4x²) has equal degrees, so the graph approaches y = 6/(−4) = −3/2 at both ends.",
    "(6x² − x + 5)/(3 − 4x²) 分子分母次数相同，所以图象两端趋近 y = 6/(−4) = −3/2。",
  ),
  "horizontal-asymptotes-of-rational-functions#comparing-degrees": drawing(
    [
      ...panel(0, (x) => (5 * x + 1) / (x * x - 4), [-2, 2], 0, "y = 0"),
      ...panel(5.4, (x) => (5 * x * x + 1) / (x * x - 4), [-2, 2], 5, "y = 5"),
      ...panel(10.8, (x) => (5 * x ** 3 + 1) / (x * x - 4), [-2, 2], undefined, "none"),
    ],
    "Over x² − 4: 5x + 1 has asymptote y = 0, 5x² + 1 has y = 5, and 5x³ + 1 has no horizontal asymptote.",
    "分母为 x² − 4 时：5x + 1 的水平渐近线是 y = 0，5x² + 1 的是 y = 5，5x³ + 1 没有水平渐近线。",
  ),
  "end-behavior-of-rational-functions#limits-at-infinity": graphed(
    wide(-6, 6, -4, 8),
    [...pieces((x) => (4 * x ** 3 - 1) / (2 * x ** 3 + x), [0], -6, 6), upright(0), across(2, "action"), tag([4.5, 2], "y = 2", "s")],
    "(4x³ − 1)/(2x³ + x) approaches 4/2 = 2 as x → ∞ and as x → −∞.",
    "当 x → ∞ 和 x → −∞ 时，(4x³ − 1)/(2x³ + x) 都趋近 4/2 = 2。",
  ),
  "end-behavior-of-rational-functions#slant-asymptotes": graphed(
    wide(-6, 10, -8, 18),
    [
      ...pieces((x) => 2 * x + 1 + 6 / (x - 2), [2], -6, 10),
      upright(2),
      ln([0, 1], [1, 3], "action", true),
      tag([6.5, 14], "y = 2x + 1", "se"),
    ],
    "(2x² − 3x + 4)/(x − 2) = 2x + 1 + 6/(x − 2): the graph approaches the slant line y = 2x + 1.",
    "(2x² − 3x + 4)/(x − 2) = 2x + 1 + 6/(x − 2)：图象趋近斜线 y = 2x + 1。",
  ),
  "infinite-limits-of-rational-functions#one-sided-infinite-limits": graphed(
    wide(-3, 8, -6, 6),
    [
      ...pieces((x) => (x + 1) / ((x - 2) * (x - 4)), [2, 4], -3, 8),
      curveOf((x) => (x + 1) / ((x - 2) * (x - 4)), "result", 1.6, 1.99),
      upright(2, "action"),
      upright(4, "action"),
      tag([1.8, 5.2], "x → 2⁻", "w"),
    ],
    "Near x = 2 from the left, (x + 1)/((x − 2)(x − 4)) is about 3 over two negative factors, one of them tiny, so it rises to +∞.",
    "x 从左侧趋近 2 时，(x + 1)/((x − 2)(x − 4)) 约为 3 除以两个负因式，其中一个很小，所以趋于 +∞。",
  ),
  "the-domain-and-range-of-a-rational-function#domain-of-a-rational-function": graphed(
    wide(-8, 4, -5, 5),
    [...pieces((x) => 1 / (x + 3), [-3], -8, 4), upright(-3, "action"), openPt([1, 0.25]), tag([1, 0.25], "hole (1, ¼)", "ne")],
    "(x − 1)/(x² + 2x − 3) simplifies to 1/(x + 3), but both zeros stay out of the domain: x = 1, a hole, and x = −3, an asymptote.",
    "(x − 1)/(x² + 2x − 3) 化简为 1/(x + 3)，但两个零点都不在定义域内：x = 1 是洞，x = −3 是渐近线。",
  ),
  "the-domain-and-range-of-a-rational-function#range-of-a-linear-over-linear-function": graphed(
    wide(-8, 6, -5, 9),
    [...pieces((x) => (4 * x - 1) / (2 * x + 3), [-1.5], -8, 6), upright(-1.5), across(2, "action"), tag([4.4, 2], "y = 2", "s")],
    "(4x − 1)/(2x + 3) takes every value except its horizontal asymptote y = 4/2 = 2.",
    "(4x − 1)/(2x + 3) 取到除水平渐近线 y = 4/2 = 2 以外的所有值。",
  ),
  "the-domain-and-range-of-a-rational-function#range-with-a-hole": graphed(
    wide(-8, 6, -5, 9),
    [
      ...pieces((x) => (2 * x + 1) / (x + 2), [-2], -8, 6),
      upright(-2),
      across(2, "action"),
      openPt([1, 1]),
      tag([1.3, -0.8], "hole (1, 1)", "se"),
    ],
    "The range of (2x + 1)/(x + 2) with a hole at (1, 1) leaves out 2, the asymptote, and 1, the height of the hole.",
    "(2x + 1)/(x + 2) 在 (1, 1) 有洞，它的值域缺少渐近线的 2 和洞的高度 1。",
  ),
  "identifying-a-rational-function-from-a-graph#linear-over-linear-from-a-graph": graphed(
    wide(-5, 9, -5, 9),
    [
      ...pieces((x) => (2 * (x - 1)) / (x - 3), [3], -5, 9),
      upright(3, "action"),
      across(2, "action"),
      pt([1, 0], "(1, 0)", "ne", "result"),
      tag([3, 8], "x = 3", "e"),
      tag([7.5, 2], "y = 2", "s"),
    ],
    "For example, asymptotes x = 3 and y = 2 with x-intercept (1, 0) give f(x) = 2(x − 1)/(x − 3).",
    "例如，渐近线 x = 3、y = 2 和 x 轴截距点 (1, 0) 给出 f(x) = 2(x − 1)/(x − 3)。",
  ),
  "identifying-a-rational-function-from-a-graph#two-vertical-asymptotes-and-a-point": graphed(
    wide(-5, 7, -6, 6),
    [
      ...pieces((x) => -6 / ((x + 1) * (x - 3)), [-1, 3], -5, 7),
      upright(-1, "action"),
      upright(3, "action"),
      pt([0, 2], "(0, 2)", "ne", "result"),
    ],
    "Asymptotes x = −1 and x = 3 and the point (0, 2): 2 = k/((1)(−3)), so k = −6 and f(x) = −6/((x + 1)(x − 3)).",
    "渐近线 x = −1、x = 3，并过点 (0, 2)：2 = k/((1)(−3))，所以 k = −6，f(x) = −6/((x + 1)(x − 3))。",
  ),
  "identifying-a-rational-function-from-a-graph#even-multiplicity-asymptotes": drawing(
    [
      ...panel(0, (x) => 6 / x, [0], undefined, "k/(x − p): opposite"),
      ...panel(5.4, (x) => 12 / (x * x), [0], undefined, "k/(x − p)²: same"),
    ],
    "With k > 0, the two sides of k/(x − p) go opposite ways, while both sides of k/(x − p)² go up.",
    "k > 0 时，k/(x − p) 两侧方向相反，而 k/(x − p)² 两侧都向上。",
  ),
  "identifying-a-rational-function-from-a-graph-containing-holes#a-hole-and-a-root": graphed(
    wide(-8, 7, -6, 9),
    [
      ...pieces((x) => (2 * (x - 3)) / (x + 2), [-2], -8, 7),
      upright(-2, "action"),
      across(2, "action"),
      openPt([1, -4 / 3]),
      tag([1, -4 / 3], "hole at x = 1", "se"),
      pt([3, 0], "(3, 0)", "ne", "result"),
    ],
    "A hole at x = 1, asymptote x = −2, root x = 3 and horizontal asymptote y = 2 give f(x) = 2(x − 3)(x − 1)/((x + 2)(x − 1)).",
    "x = 1 处有洞，渐近线 x = −2，根 x = 3，水平渐近线 y = 2，得 f(x) = 2(x − 3)(x − 1)/((x + 2)(x − 1))。",
  ),
  "identifying-a-rational-function-from-a-graph-containing-holes#reading-k-from-a-hole": graphed(
    wide(-5, 7, -6, 6),
    [...pieces((x) => -4 / (x - 1), [1], -5, 7), upright(1, "action"), openPt([3, -2]), tag([3, -2], "hole (3, −2)", "se")],
    "The hole (3, −2) lies on the simplified function k/(x − 1): −2 = k/2, so k = −4.",
    "洞 (3, −2) 在化简后的函数 k/(x − 1) 上：−2 = k/2，所以 k = −4。",
  ),
  "identifying-the-graph-of-a-rational-function#sign-charts": graphed(
    wide(-5, 8, -5, 5),
    [
      ...pieces((x) => (x - 2) / ((x + 1) * (x - 4)), [-1, 4], -5, 8),
      upright(-1, "action"),
      upright(4, "action"),
      pt([2, 0], "2", "ne", "result"),
      ...signs(
        [
          [-3, "−"],
          [0.5, "+"],
          [3, "−"],
          [6, "+"],
        ],
        4.2,
      ),
    ],
    "(x − 2)/((x + 1)(x − 4)) can change sign at −1, 2 and 4: it is −, +, −, + from left to right.",
    "(x − 2)/((x + 1)(x − 4)) 可能在 −1、2、4 处变号：从左到右依次为 −、+、−、+。",
  ),
  "identifying-the-graph-of-a-rational-function#matching-graphs-with-two-vertical-asymptotes": drawing(
    [
      ...panel(0, (x) => 18 / ((x + 1) * (x - 3)), [-1, 3], undefined, "k > 0: middle below"),
      ...panel(5.4, (x) => -18 / ((x + 1) * (x - 3)), [-1, 3], undefined, "k < 0: middle above"),
    ],
    "For k/((x − p)(x − q)), the middle piece is below the x-axis when k > 0 and above it when k < 0.",
    "对 k/((x − p)(x − q))，k > 0 时中间一段在 x 轴下方，k < 0 时在上方。",
  ),
  "solving-quadratic-inequalities-from-graphs#comparing-with-a-line": graphed(
    wide(-6, 4, -3, 6),
    [
      curveOf((x) => -0.5 * (x + 3) * (x - 1) + 2),
      curveOf((x) => -0.5 * (x + 3) * (x - 1) + 2, "result", -3, 1),
      across(2, "action"),
      pt([-3, 2], "(−3, 2)", "nw", "result"),
      pt([1, 2], "(1, 2)", "ne", "result"),
      thick([-3, 0], [1, 0]),
    ],
    "A downward parabola meeting y = 2 at (−3, 2) and (1, 2) is on or above the line for x from −3 to 1.",
    "向下开口的抛物线与 y = 2 交于 (−3, 2) 和 (1, 2)，当 x 从 −3 到 1 时在直线上或上方。",
  ),
  "solving-quadratic-inequalities-from-graphs#counting-integers-below-the-axis": graphed(
    wide(-4, 6, -10, 4),
    [
      curveOf((x) => (x + 2) * (x - 4)),
      pt([-2, 0], "−2", "nw"),
      pt([4, 0], "4", "ne"),
      ...[-1, 0, 1, 2, 3].map((x) => bare([x, 0], "result")),
    ],
    "For example, with intercepts −2 and 4, a distance of 6 apart, the parabola is below the axis at the 5 integers −1, 0, 1, 2 and 3.",
    "例如，截距 −2 和 4 相距 6，抛物线在 5 个整数 −1、0、1、2、3 处位于 x 轴下方。",
  ),
  "solving-quadratic-inequalities-using-the-graphical-method#quadratic-inequalities-with-leading-coefficients": graphed(
    wide(-4, 4, -7, 6),
    [curveOf((x) => 2 * x * x + x - 6), thick([-2, 0], [1.5, 0]), pt([-2, 0], "−2", "nw", "result"), pt([1.5, 0], "3/2", "ne", "result")],
    "2x² + x − 6 ≤ 0: the upward parabola with roots −2 and 3/2 is on or below the x-axis on [−2, 3/2].",
    "2x² + x − 6 ≤ 0：开口向上、根为 −2 和 3/2 的抛物线在 [−2, 3/2] 上位于 x 轴上或下方。",
  ),
  "solving-quadratic-inequalities-using-the-sign-table-method#signs-of-a-product": graphed(
    wide(-2, 6, -5, 6),
    [
      curveOf((x) => (2 * x - 1) * (3 - x)),
      pt([0.5, 0], "½", "nw", "action"),
      pt([3, 0], "3", "ne", "action"),
      ...signs(
        [
          [-0.7, "−"],
          [1.7, "+"],
          [4.5, "−"],
        ],
        5,
      ),
    ],
    "(2x − 1)(3 − x) changes sign only at ½ and 3: it is −, then +, then − from left to right.",
    "(2x − 1)(3 − x) 只在 ½ 和 3 处变号：从左到右依次为 −、+、−。",
  ),
  "determining-unknown-parameters-in-quadratic-equations-with-no-real-solutions#quadratics-of-one-sign": graphed(
    wide(-1, 7, -2, 6),
    [
      curveOf((x) => x * x - 6 * x + 8),
      curveOf((x) => x * x - 6 * x + 9, "action"),
      curveOf((x) => x * x - 6 * x + 10, "result"),
      tag([3, 1], "k = 10", "n"),
      bare([3, 0], "action"),
      tag([5.6, 4.2], "k = 8", "e"),
    ],
    "x² − 6x + k: with k = 8 it crosses the x-axis, with k = 9 it touches it once, and with k = 10 it is above the axis everywhere.",
    "x² − 6x + k：k = 8 时穿过 x 轴，k = 9 时与 x 轴相切一次，k = 10 时处处在 x 轴上方。",
  ),
  "solving-polynomial-inequalities-using-a-graphical-method#reading-polynomial-inequalities-from-graphs": graphed(
    wide(-4, 6, -6, 6),
    [
      curveOf((x) => ((x + 2) * (x - 1) * (x - 4)) / 2),
      thick([-2, 0], [1, 0]),
      thick([4, 0], [6, 0]),
      pt([-2, 0], "−2", "nw"),
      pt([1, 0], "1", "ne"),
      pt([4, 0], "4", "se"),
    ],
    "A cubic crossing at −2, 1 and 4 and rising to the right is above the axis on (−2, 1) ∪ (4, ∞), in color, and below it elsewhere.",
    "在 −2、1、4 处穿过 x 轴并向右上升的三次曲线，在 (−2, 1) ∪ (4, ∞)（彩色）上位于 x 轴上方，其余位于下方。",
  ),
  "solving-polynomial-inequalities-using-a-graphical-method#solving-polynomial-inequalities-by-sketching": (() => {
    const c = chart({ x: [-5, 6, 1], y: [-24, 24, 8], xName: "x", yName: "y", w: 7, h: 5 });
    return drawing(
      [
        ...c.marks,
        ...traced(c.at, (x) => -(x + 3) * (x - 1) * (x - 4), -5, 6, -24, 24),
        seg(c.at(-5, 0), c.at(-3, 0), "result"),
        seg(c.at(1, 0), c.at(4, 0), "result"),
        ...dotAt(c.at(-3, 0), undefined, "n", "result"),
        ...dotAt(c.at(1, 0), undefined, "n", "result"),
        ...dotAt(c.at(4, 0), undefined, "n", "result"),
      ],
      "−(x + 3)(x − 1)(x − 4) ≥ 0: the curve comes down from the left, crossing at −3, 1 and 4, and is on or above the axis on (−∞, −3] and [1, 4], in color.",
      "−(x + 3)(x − 1)(x − 4) ≥ 0：曲线从左上方下来，在 −3、1、4 处穿过 x 轴，在 (−∞, −3] 和 [1, 4]（彩色）上位于 x 轴上或上方。",
    );
  })(),
  "solving-polynomial-inequalities-using-a-graphical-method#a-repeated-root-does-not-change-the-sign": graphed(
    wide(-3, 5, -4, 8),
    [curveOf((x) => (x + 1) * (x - 2) ** 2), pt([-1, 0], "−1: crosses", "w"), pt([2, 0], "2: touches", "s", "result")],
    "For example, (x + 1)(x − 2)² touches the axis at the squared factor's root 2 and turns back, with no change of sign there.",
    "例如，(x + 1)(x − 2)² 在平方因式的根 2 处与 x 轴相切后折返，符号不变。",
  ),
  "solving-two-variable-nonlinear-inequalities#identifying-nonlinear-inequality-regions": graphed(
    wide(-4, 4, -3, 5),
    [beyond((x) => x * x - 2, -4, 4, 5, -3, true), curveOf((x) => x * x - 2), tag([1.4, 3.6], "y ≥ x² − 2", "w")],
    "For example, y ≥ x² − 2: the boundary is solid and the shaded region is on and above the curve.",
    "例如，y ≥ x² − 2：边界是实线，阴影区域在曲线上及其上方。",
  ),
  "solving-two-variable-nonlinear-inequalities#reading-the-symbol-for-the-graph": graphed(
    wide(-4, 4, -3, 5),
    [
      beyond((x) => x * x - 2, -4, 4, 5, -3, false),
      curveOf((x) => x * x - 2, undefined, undefined, undefined, true),
      tag([3.6, -2.2], "y < x² − 2", "w"),
    ],
    "For example, y < x² − 2: the strict symbol makes the boundary dashed, and the less-than shades below the curve.",
    "例如，y < x² − 2：严格不等号使边界为虚线，小于号使阴影在曲线下方。",
  ),
  "graphing-the-inverse-sine-function#key-points-and-symmetry-of-arcsin": graphed(
    wide(-3, 3, -2, 2),
    [
      curveOf(asin, undefined, -1, 1),
      pt([-1, -pi / 2], "(−1, −π/2)", "w", "result"),
      pt([0, 0], "(0, 0)", "se", "result"),
      pt([1, pi / 2], "(1, π/2)", "e", "result"),
    ],
    "y = arcsin x passes through (−1, −π/2), (0, 0) and (1, π/2), and is symmetric about the origin.",
    "y = arcsin x 过 (−1, −π/2)、(0, 0) 和 (1, π/2)，并关于原点对称。",
  ),
  "graphing-the-inverse-sine-function#undoing-sine-outside-the-range": (() => {
    const c = piChart(-6, 18, 6, [-2, 2, 1], 8, 4, 3);
    return drawing(
      [
        ...c.marks,
        ...plot(c, (x) => asin(sin(x)), -pi, 3 * pi, -2, 2),
        ...dotAt(c.at((5 * pi) / 6, pi / 6), "(5π/6, π/6)", "ne", "result"),
      ],
      "y = arcsin(sin x) stays between −π/2 and π/2. For example, at 5π/6 it gives π/6, the angle in the range with the same sine.",
      "y = arcsin(sin x) 始终介于 −π/2 和 π/2 之间。例如，在 5π/6 处它得到 π/6，即范围内正弦相同的角。",
    );
  })(),
  "graphing-the-inverse-cosine-function#key-points-and-symmetry-of-arccos": graphed(
    wide(-3, 3, -1, 4),
    [
      curveOf(acos, undefined, -1, 1),
      pt([-1, pi], "(−1, π)", "w", "result"),
      pt([0, pi / 2], "(0, π/2)", "ne", "result"),
      pt([1, 0], "(1, 0)", "ne", "result"),
    ],
    "y = arccos x passes through (−1, π), (0, π/2) and (1, 0), and falls from left to right.",
    "y = arccos x 过 (−1, π)、(0, π/2) 和 (1, 0)，从左到右下降。",
  ),
  "graphing-the-inverse-cosine-function#undoing-cosine-outside-the-range": (() => {
    const c = piChart(-3, 12, 6, [-1, 4, 1], 8, 4, 3);
    return drawing(
      [
        ...c.marks,
        ...plot(c, (x) => acos(cos(x)), -pi / 2, 2 * pi, -1, 4),
        ...dotAt(c.at((4 * pi) / 3, (2 * pi) / 3), "(4π/3, 2π/3)", "ne", "result"),
      ],
      "y = arccos(cos x) stays between 0 and π. For example, at 4π/3, past π, it comes back reflected as 2π − 4π/3 = 2π/3.",
      "y = arccos(cos x) 始终介于 0 和 π 之间。例如，超过 π 的 4π/3 被反射回来，得到 2π − 4π/3 = 2π/3。",
    );
  })(),
  "graphing-the-inverse-tangent-function#asymptotes-and-symmetry-of-arctan": graphed(
    wide(-6, 6, -3, 3),
    [
      curveOf(atan),
      across(pi / 2, "action"),
      across(-pi / 2, "action"),
      tag([-4, pi / 2], "y = π/2", "n"),
      tag([4, -pi / 2], "y = −π/2", "s"),
    ],
    "y = arctan x approaches y = π/2 as x → ∞ and y = −π/2 as x → −∞: the vertical asymptotes of tangent have become horizontal.",
    "当 x → ∞ 时 y = arctan x 趋近 y = π/2，当 x → −∞ 时趋近 y = −π/2：正切的竖直渐近线变成了水平渐近线。",
  ),
  "graphing-the-inverse-tangent-function#undoing-tangent-outside-the-range": (() => {
    const c = piChart(-4, 12, 4, [-2, 2, 1], 8, 4, 2);
    return drawing(
      [
        ...c.marks,
        ...plot(c, (x) => atan(tan(x)), -pi, 3 * pi, -2, 2),
        ...dotAt(c.at((5 * pi) / 4, pi / 4), "(5π/4, π/4)", "nw", "result"),
      ],
      "y = arctan(tan x) stays strictly between −π/2 and π/2. For example, at 5π/4, subtracting π gives π/4.",
      "y = arctan(tan x) 严格介于 −π/2 和 π/2 之间。例如，在 5π/4 处减去 π 得 π/4。",
    );
  })(),
};
