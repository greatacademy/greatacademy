// Drawings in the explanations of Calculus I about limits and continuity. Each coordinate is computed from the function in the alt text.

import type { Figure } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { broken, pane } from "./explanation-drawings-calculus-kit.ts";
import { curveOf, openPt, tag, toward } from "./explanation-drawings-charts.ts";
import { across, bare, branches, upright, wide } from "./explanation-drawings-curves.ts";
import { pt } from "./explanation-drawings-geometry-2.ts";
import { drawing, graphed } from "./explanation-drawings-kit.ts";

const { PI: pi, acos, atan, cos, cosh, exp, log, sin, sinh, sqrt, tan, tanh } = Math;
const sech = (x: number): number => 1 / cosh(x);
const csch = (x: number): number => 1 / sinh(x);
const coth = (x: number): number => 1 / tanh(x);
const dash = (a: Point, b: Point): PlaneMark => ({ kind: "path", points: [a, b], dashed: true });

/** calculusDrawings1 are the drawings in the explanations of limits and continuity in Calculus I, by topic and knowledge point. */
export const calculusDrawings1: Readonly<Record<string, Figure>> = {
  "graphs-of-the-hyperbolic-functions#recognizing-hyperbolic-graphs": graphed(
    wide(-4, 4, -3, 4),
    [
      curveOf(sinh, "action"),
      curveOf(cosh, "result"),
      curveOf(tanh),
      across(1),
      across(-1),
      tag([1.75, 2.9], "cosh x", "w"),
      tag([1.9, 3.3], "sinh x", "se"),
      tag([3, tanh(3)], "tanh x", "s"),
      pt([0, 1], "(0, 1)", "nw", "result"),
    ],
    "sinh x rises through the origin without bound, cosh x is a U with minimum 1 at x = 0, and tanh x rises through the origin between the asymptotes y = −1 and y = 1.",
    "sinh x 经过原点无界上升，cosh x 呈 U 形，在 x = 0 处有最小值 1，tanh x 经过原点上升，夹在渐近线 y = −1 与 y = 1 之间。",
  ),
  "graphs-of-the-hyperbolic-functions#extremes-and-asymptotes-of-hyperbolic-graphs": graphed(
    wide(-7, 5, -6, 2),
    [
      curveOf((x) => 3 * tanh(x + 1) - 2),
      across(1, "result"),
      across(-5, "result"),
      pt([-1, -2], "(−1, −2)", "nw", "action"),
      tag([3, 1], "y = 1", "n"),
      tag([-4, -5], "y = −5", "n"),
    ],
    "y = 3 tanh(x + 1) − 2 rises from the asymptote y = −5 to the asymptote y = 1, the lines k ∓ |a| for k = −2 and a = 3, and passes through (−1, −2) halfway.",
    "y = 3 tanh(x + 1) − 2 从渐近线 y = −5 上升到渐近线 y = 1，即 k = −2、a = 3 时的 k ∓ |a|，并在正中间经过 (−1, −2)。",
  ),
  "graphs-of-the-hyperbolic-functions#how-many-times-a-level-line-meets-a-hyperbolic-graph": drawing(
    [
      ...pane(0, [-3, 3, 3], [-2, 4, 2], 5, 5)
        .f(cosh)
        .level(2, "action")
        .dot(-1.317, 2, undefined, "n", "result")
        .dot(1.317, 2, undefined, "n", "result")
        .say(0, -2.4, "cosh: 2", "s")
        .marks(),
      ...pane(7.5, [-3, 3, 3], [-2, 4, 2], 5, 5)
        .f(sinh)
        .level(2, "action")
        .dot(1.444, 2, undefined, "n", "result")
        .say(0, -2.4, "sinh: 1", "s")
        .marks(),
      ...pane(15, [-3, 3, 3], [-2, 4, 2], 5, 5).f(tanh).level(2, "action").say(0, -2.4, "tanh: 0", "s").marks(),
    ],
    "For example, the level y = 2 meets cosh x twice, at x ≈ ±1.32, meets sinh x once, at x ≈ 1.44, and never meets tanh x, which stays between −1 and 1.",
    "例如，水平线 y = 2 与 cosh x 相交两次（x ≈ ±1.32），与 sinh x 相交一次（x ≈ 1.44），与 tanh x 不相交，因为 tanh x 始终在 −1 和 1 之间。",
  ),
  "graphs-of-the-reciprocal-hyperbolic-functions#recognizing-reciprocal-hyperbolic-graphs": drawing(
    [
      ...pane(0, [-3, 3, 3], [-3, 3, 3], 5, 5).f(sech).dot(0, 1, "(0, 1)", "ne", "result").say(0, -3.3, "sech x", "s").marks(),
      ...pane(7.5, [-3, 3, 3], [-3, 3, 3], 5, 5).f(csch, -3, -0.02).f(csch, 0.02, 3).say(0, -3.3, "csch x", "s").marks(),
      ...pane(15, [-3, 3, 3], [-3, 3, 3], 5, 5)
        .f(coth, -3, -0.02)
        .f(coth, 0.02, 3)
        .level(1, "action")
        .level(-1, "action")
        .say(0, -3.3, "coth x", "s")
        .marks(),
    ],
    "sech x is an even bell with maximum 1 at x = 0 and asymptote y = 0. csch x is odd, with asymptotes x = 0 and y = 0. coth x is odd, with asymptotes x = 0 and y = ±1, and its values lie outside −1 to 1.",
    "sech x 是偶函数，呈钟形，在 x = 0 处有最大值 1，渐近线为 y = 0。csch x 是奇函数，渐近线为 x = 0 和 y = 0。coth x 是奇函数，渐近线为 x = 0 和 y = ±1，取值都在 −1 到 1 之外。",
  ),
  "graphs-of-the-reciprocal-hyperbolic-functions#asymptotes-of-reciprocal-hyperbolic-graphs": graphed(
    wide(-5, 7, -5, 7),
    [
      ...branches((x) => 2 * coth(x - 1) + 1, 1, -5, 7),
      upright(1, "action"),
      across(3, "result"),
      across(-1, "result"),
      tag([5, 3], "y = 3", "n"),
      tag([-3, -1], "y = −1", "s"),
      tag([1, 6], "x = 1", "e"),
    ],
    "For example, y = 2 coth(x − 1) + 1 has the vertical asymptote x = 1 and the horizontal asymptotes y = 1 + 2 = 3 and y = 1 − 2 = −1.",
    "例如，y = 2 coth(x − 1) + 1 的竖直渐近线为 x = 1，水平渐近线为 y = 1 + 2 = 3 和 y = 1 − 2 = −1。",
  ),
  "graphs-of-the-reciprocal-hyperbolic-functions#how-many-times-a-level-line-meets-a-reciprocal-hyperbolic-graph": drawing(
    [
      ...pane(0, [-3, 3, 3], [-3, 3, 3], 5, 5)
        .f(sech)
        .level(0.5, "action")
        .say(-2.2, 0.5, "1/2", "n")
        .dot(-1.317, 0.5, undefined, "n", "result")
        .dot(1.317, 0.5, undefined, "n", "result")
        .say(0, -3.3, "sech: 2", "s")
        .marks(),
      ...pane(7.5, [-3, 3, 3], [-3, 3, 3], 5, 5)
        .f(csch, -3, -0.02)
        .f(csch, 0.02, 3)
        .level(0.5, "action")
        .say(-2.2, 0.5, "1/2", "n")
        .dot(1.444, 0.5, undefined, "n", "result")
        .say(0, -3.3, "csch: 1", "s")
        .marks(),
      ...pane(15, [-3, 3, 3], [-3, 3, 3], 5, 5)
        .f(coth, -3, -0.02)
        .f(coth, 0.02, 3)
        .level(0.5, "action")
        .say(-2.2, 0.5, "1/2", "n")
        .say(0, -3.3, "coth: 0", "s")
        .marks(),
    ],
    "For example, the level y = 1/2 meets sech x twice, since 1/2 is in (0, 1], meets csch x once, and never meets coth x, whose values have absolute value above 1.",
    "例如，水平线 y = 1/2 与 sech x 相交两次，因为 1/2 在 (0, 1] 内；与 csch x 相交一次；与 coth x 不相交，因为 coth x 的绝对值都大于 1。",
  ),
  "the-finite-limit-of-a-function#reading-a-limit-from-a-graph": graphed(
    wide(-2, 5, -1, 6),
    [...broken((x) => x + 1, 2, -2, 5), openPt([2, 3], "(2, 3)", "nw"), bare([2, 1], "action"), tag([2, 1], "f(2) = 1", "e")],
    "For example, the curve approaches height 3 from both sides of x = 2, so the limit there is 3, even though the point of the graph at x = 2 is at height 1.",
    "例如，曲线从 x = 2 的两侧都趋近高度 3，所以极限是 3，尽管图象在 x = 2 处的点高度为 1。",
  ),
  "the-left-and-right-sided-limits-of-a-function#one-sided-limits-from-a-graph": graphed(
    wide(-2, 6, -2, 5),
    [
      curveOf((x) => x + 1, undefined, -2, 2),
      curveOf((x) => 2 - x / 2, undefined, 2, 6),
      openPt([2, 3], "x → a⁻: 3", "nw"),
      openPt([2, 1]),
      tag([2.3, 1.2], "x → a⁺: 1", "e"),
      pt([2, 2], "f(2) = 2", "e", "action"),
    ],
    "For example, at x = 2 the left piece ends at height 3 and the right piece starts at height 1, so the left limit is 3 and the right limit is 1, whatever f(2) is; here f(2) = 2.",
    "例如，在 x = 2 处，左段终止于高度 3，右段从高度 1 开始，所以左极限是 3，右极限是 1，与 f(2) 无关；这里 f(2) = 2。",
  ),
  "finding-the-existence-of-a-limit-using-one-sided-limits#existence-of-a-limit-from-a-graph": drawing(
    [
      ...pane(0, [0, 4, 2], [0, 5, 1], 6, 5)
        .f((x) => x + 1, 0, 1.97)
        .f((x) => x + 1, 2.03, 4)
        .open(2, 3, "3", "nw")
        .say(2, -1, "lim = 3", "s")
        .marks(),
      ...pane(9, [0, 4, 2], [0, 5, 1], 6, 5)
        .f((x) => x + 1, 0, 1.97)
        .f((x) => x - 1, 2.03, 4)
        .open(2, 3, "3", "nw")
        .open(2, 1, "1", "se")
        .say(2, -1, "∄ lim", "s")
        .marks(),
    ],
    "For example, at x = 2: on the left graph both sides approach 3, so the limit is 3. On the right graph the left side approaches 3 and the right side 1, so the limit does not exist.",
    "例如，在 x = 2 处：左图两侧都趋近 3，所以极限是 3。右图左侧趋近 3，右侧趋近 1，所以极限不存在。",
  ),
  "limits-at-infinity-from-graphs#limits-at-infinity-from-a-graph": graphed(
    wide(-7, 7, -1, 4),
    [curveOf((x) => 2 + tanh(x)), across(3, "result"), across(1, "action"), tag([4.5, 3], "y = 3", "n"), tag([-4.5, 1], "y = 1", "s")],
    "For example, this graph levels off towards y = 3 at the far right and towards y = 1 at the far left: the limit as x → ∞ is 3 and the limit as x → −∞ is 1.",
    "例如，这个图象在最右端趋平于 y = 3，在最左端趋平于 y = 1：x → ∞ 时极限为 3，x → −∞ 时极限为 1。",
  ),
  "limits-at-infinity-from-graphs#a-graph-may-cross-its-horizontal-asymptote": graphed(
    wide(-16, 16, -2, 4, 4),
    [curveOf((x) => (x === 0 ? 3 : 1 + (2 * sin(x)) / x)), across(1, "result"), tag([12, 1.6], "y = 1", "n")],
    "For example, y = 1 + (2 sin x)/x crosses its horizontal asymptote y = 1 infinitely often, at every nonzero multiple of π, and its swings around the line shrink to zero.",
    "例如，y = 1 + (2 sin x)/x 无穷多次穿过水平渐近线 y = 1（在 π 的每个非零整数倍处），它围绕这条直线的摆动缩小到零。",
  ),
  "infinite-limits-from-graphs#infinite-limits-from-a-graph": drawing(
    [
      ...pane(0, [-2, 4, 2], [-6, 6, 6], 6, 5)
        .f((x) => 1 / (x - 1))
        .wall(1)
        .say(1, -7, "∄ lim", "s")
        .marks(),
      ...pane(9, [-2, 4, 2], [-6, 6, 6], 6, 5)
        .f((x) => 1 / (x - 1) ** 2)
        .wall(1)
        .say(1, -7, "lim = ∞", "s")
        .marks(),
    ],
    "For example, at the asymptote x = 1: y = 1/(x − 1) falls on the left and rises on the right, so the two-sided limit does not exist. y = 1/(x − 1)² rises on both sides, so the two-sided limit is ∞.",
    "例如，在渐近线 x = 1 处：y = 1/(x − 1) 左侧下降、右侧上升，所以双侧极限不存在。y = 1/(x − 1)² 两侧都上升，所以双侧极限是 ∞。",
  ),
  "infinite-limits-from-graphs#graphs-with-two-vertical-asymptotes": graphed(
    wide(-6, 6, -6, 6),
    [
      curveOf((x) => 8 / ((x + 2) ** 2 * (x - 2)), undefined, -6, -2.001),
      curveOf((x) => 8 / ((x + 2) ** 2 * (x - 2)), undefined, -1.999, 1.999),
      curveOf((x) => 8 / ((x + 2) ** 2 * (x - 2)), undefined, 2.001, 6),
      upright(-2, "action"),
      upright(2, "action"),
      tag([-2, 5], "x = −2", "w"),
      tag([2, 5], "x = 2", "e"),
    ],
    "For example, y = 8/((x + 2)²(x − 2)): at x = −2 both sides shoot down, so the limit is −∞. At x = 2 the left side shoots down and the right side up, so the two-sided limit does not exist.",
    "例如，y = 8/((x + 2)²(x − 2))：在 x = −2 处两侧都向下，极限为 −∞。在 x = 2 处左侧向下、右侧向上，双侧极限不存在。",
  ),
  "infinite-limits-from-graphs#the-formula-from-the-behavior-at-an-asymptote": drawing(
    [
      ...pane(0, [0, 4, 4], [-6, 6, 6], 5, 5)
        .f((x) => 1 / (x - 2))
        .wall(2)
        .say(2, -7, "1/(x − 2)", "s")
        .marks(),
      ...pane(7.5, [0, 4, 4], [-6, 6, 6], 5, 5)
        .f((x) => 1 / (x - 2) ** 2)
        .wall(2)
        .say(2, -7, "1/(x − 2)²", "s")
        .marks(),
      ...pane(15, [0, 4, 4], [-6, 6, 6], 5, 5)
        .f((x) => -1 / (x - 2) ** 2)
        .wall(2)
        .say(2, -7, "−1/(x − 2)²", "s")
        .marks(),
    ],
    "For example, at x = 2: the odd power in 1/(x − 2) sends the sides to opposite infinities. The even power in 1/(x − 2)² sends both up, and the negative numerator in −1/(x − 2)² sends both down.",
    "例如，在 x = 2 处：1/(x − 2) 的奇次幂使两侧趋向相反的无穷。1/(x − 2)² 的偶次幂使两侧都向上，−1/(x − 2)² 的负分子使两侧都向下。",
  ),
  "limits-of-reciprocal-functions#reciprocal-limits-at-the-asymptote": drawing(
    [
      ...pane(0, [-2, 4, 2], [-6, 6, 6], 6, 5)
        .f((x) => 2 / (x - 1) ** 2)
        .wall(1)
        .say(1, -7, "n = 2: ∞, ∞", "s")
        .marks(),
      ...pane(9, [-2, 4, 2], [-6, 6, 6], 6, 5)
        .f((x) => 2 / (x - 1))
        .wall(1)
        .say(1, -7, "n = 1: −∞, ∞", "s")
        .marks(),
    ],
    "For example, k = 2 and h = 1: for even n = 2 both sides of x = 1 go to ∞, the sign of k. For odd n = 1 the left side goes to −∞ and the right side to ∞, so the two-sided limit does not exist.",
    "例如，k = 2、h = 1：偶数 n = 2 时，x = 1 两侧都趋于 ∞，与 k 同号。奇数 n = 1 时，左侧趋于 −∞，右侧趋于 ∞，所以双侧极限不存在。",
  ),
  "limits-of-reciprocal-functions#reciprocal-limits-at-infinity": graphed(
    wide(-9, 11, -3, 9, 2),
    [...branches((x) => 2 / (x - 1) + 3, 1, -9, 11), across(3, "result"), upright(1), tag([-5, 3], "y = 3", "n")],
    "For example, y = 2/(x − 1) + 3: as x → ±∞ the fraction shrinks to 0, so the graph approaches the horizontal asymptote y = 3, the added constant.",
    "例如，y = 2/(x − 1) + 3：当 x → ±∞ 时分式趋于 0，所以图象趋近水平渐近线 y = 3，即所加的常数。",
  ),
  "limits-of-reciprocal-functions#two-sided-limits-at-an-asymptote": drawing(
    [
      ...pane(0, [-2, 4, 2], [-6, 6, 6], 6, 5)
        .f((x) => 1 / (x - 1) ** 2)
        .wall(1)
        .say(1, -7, "lim = ∞", "s")
        .marks(),
      ...pane(9, [-2, 4, 2], [-6, 6, 6], 6, 5)
        .f((x) => 1 / (x - 1) ** 3)
        .wall(1)
        .say(1, -7, "∄ lim", "s")
        .marks(),
    ],
    "For example, at x = 1: both sides of 1/(x − 1)² go up, so the two-sided limit is ∞. The sides of 1/(x − 1)³ go to −∞ and ∞, so the two-sided limit does not exist, even as an infinite limit.",
    "例如，在 x = 1 处：1/(x − 1)² 两侧都向上，所以双侧极限为 ∞。1/(x − 1)³ 两侧分别趋于 −∞ 和 ∞，所以双侧极限不存在，也不算无穷极限。",
  ),
  "limits-of-exponential-functions#exponential-limits-at-infinity": drawing(
    [
      ...pane(0, [-8, 4, 4], [0, 12, 4], 6, 5)
        .f((x) => 3 * 2 ** x + 5)
        .level(5, "result")
        .say(-4, 5, "y = 5", "n")
        .say(-2, -1.4, "3 · 2ˣ + 5", "s")
        .marks(),
      ...pane(9, [-6, 3, 3], [-10, 3, 5], 6, 5)
        .f((x) => 1 - exp(x))
        .level(1, "action")
        .say(-3, 1, "y = 1", "n")
        .say(0, -11, "−eˣ + 1", "s")
        .marks(),
    ],
    "3 · 2ˣ + 5 approaches 5 as x → −∞, because 2ˣ shrinks to 0. −eˣ + 1 falls to −∞ as x → ∞, because eˣ grows without bound.",
    "当 x → −∞ 时，3 · 2ˣ + 5 趋于 5，因为 2ˣ 缩小到 0。当 x → ∞ 时，−eˣ + 1 降到 −∞，因为 eˣ 无界增长。",
  ),
  "limits-of-exponential-functions#exponential-limits-at-a-point": drawing(
    pane(0, [-1, 2, 1], [-10, 50, 10], 8, 5)
      .f((x) => 2 * exp(3 * x) - 4)
      .dot(1, 2 * exp(3) - 4, "(1, 2e³ − 4)", "w", "result")
      .marks(),
    "y = 2e³ˣ − 4 has no breaks, so its limit at x = 1 is its value there, 2e³ − 4 ≈ 36.2.",
    "y = 2e³ˣ − 4 没有间断，所以它在 x = 1 处的极限就是该处的函数值 2e³ − 4 ≈ 36.2。",
  ),
  "limits-of-logarithmic-functions#logarithmic-limits-at-the-asymptote-and-infinity": graphed(
    wide(-1, 9, -5, 6),
    [
      curveOf(log, undefined, 0.001, 9),
      curveOf((x) => -2 * log(x), "action", 0.001, 9),
      tag([7, log(7)], "ln x", "n"),
      tag([4, -4], "−2 ln x", "s"),
    ],
    "As x → 0⁺, ln x drops to −∞, while −2 ln x, with its negative multiplier, rises to ∞. As x grows, ln x rises without bound, slowly.",
    "当 x → 0⁺ 时，ln x 降到 −∞，而带负系数的 −2 ln x 升到 ∞。随着 x 增大，ln x 缓慢地无界上升。",
  ),
  "limits-of-trigonometric-functions#trigonometric-limits-at-special-angles": drawing(
    [
      ...pane(0, [0, 4, 2], [-2, 2, 2], 6, 5)
        .f(cos, 0, 4)
        .dot(pi / 3, 0.5, "(π/3, 1/2)", "ne", "result")
        .say(2, -2.6, "cos x", "s")
        .marks(),
      ...pane(9, [0, 4, 2], [-4, 4, 4], 6, 5)
        .f(tan, 0, 4)
        .wall(pi / 2)
        .dot((3 * pi) / 4, -1, "(3π/4, −1)", "se", "result")
        .say(2, -5.2, "tan x", "s")
        .marks(),
    ],
    "Cosine and, away from its asymptote, tangent have no breaks, so their limits are their values: cos x → 1/2 at π/3, and tan x → −1 at 3π/4.",
    "余弦没有间断，正切在渐近线之外也没有间断，所以极限就是函数值：在 π/3 处 cos x → 1/2，在 3π/4 处 tan x → −1。",
  ),
  "limits-of-trigonometric-functions#infinite-and-nonexistent-trigonometric-limits": drawing(
    [
      ...pane(0, [0, 3, 3], [-6, 6, 6], 6, 5)
        .f(tan, 0, 3)
        .wall(pi / 2)
        .say(pi / 2, -7, "tan x, x → π/2", "s")
        .marks(),
      ...pane(9, [-12, 12, 12], [-2, 2, 2], 8, 5).f(sin).say(0, -2.3, "sin x", "s").marks(),
    ],
    "Just left of π/2, tan x → ∞, and just right, tan x → −∞, so the limit at π/2 does not exist. As x → ±∞, sin x keeps oscillating between −1 and 1, so it has no limit.",
    "在 π/2 左侧附近 tan x → ∞，右侧附近 tan x → −∞，所以 π/2 处极限不存在。当 x → ±∞ 时，sin x 一直在 −1 和 1 之间振荡，所以没有极限。",
  ),
  "limits-of-reciprocal-trigonometric-functions#reciprocal-trigonometric-limits-at-special-angles": graphed(
    wide(-2, 2, -1, 4),
    [
      curveOf((x) => 1 / cos(x), undefined, -1.55, 1.55),
      upright(pi / 2),
      upright(-pi / 2),
      dash([pi / 6, 0], [pi / 6, 2 / sqrt(3)]),
      pt([pi / 6, 2 / sqrt(3)], "2√3/3", "e", "result"),
      tag([pi / 6, 0], "π/6", "s"),
    ],
    "cos(π/6) = √3/2 is not zero, so sec x has no break there and its limit at π/6 is 1/(√3/2) = 2√3/3 ≈ 1.15.",
    "cos(π/6) = √3/2 不为零，所以 sec x 在该处没有间断，它在 π/6 处的极限是 1/(√3/2) = 2√3/3 ≈ 1.15。",
  ),
  "limits-of-reciprocal-trigonometric-functions#reciprocal-trigonometric-limits-at-asymptotes": drawing(
    [
      ...pane(0, [-3, 3, 3], [-6, 6, 6], 6, 5)
        .f((x) => 1 / sin(x))
        .wall(0)
        .say(0, -7, "csc x, x → 0", "s")
        .marks(),
      ...pane(9, [0, 3, 3], [-6, 6, 6], 6, 5)
        .f((x) => 1 / cos(x), 0, 3)
        .wall(pi / 2)
        .say(pi / 2, -7, "sec x, x → π/2", "s")
        .marks(),
    ],
    "Just right of 0, csc x → ∞, and just left, csc x → −∞. Just left of π/2, sec x → ∞, and just right, sec x → −∞.",
    "在 0 右侧附近 csc x → ∞，左侧附近 csc x → −∞。在 π/2 左侧附近 sec x → ∞，右侧附近 sec x → −∞。",
  ),
  "limits-of-reciprocal-trigonometric-functions#reciprocal-trigonometric-limits-away-from-the-first-period": graphed(
    wide(-1, 7, -4, 4),
    [
      curveOf((x) => 1 / cos(x), undefined, -1, pi / 2 - 0.01),
      curveOf((x) => 1 / cos(x), undefined, pi / 2 + 0.01, (3 * pi) / 2 - 0.01),
      curveOf((x) => 1 / cos(x), undefined, (3 * pi) / 2 + 0.01, 7),
      upright(pi / 2),
      upright((3 * pi) / 2),
      pt([0, 1], "k = 0", "sw", "result"),
      pt([pi, -1], "k = 1", "s", "result"),
      pt([2 * pi, 1], "k = 2", "s", "result"),
    ],
    "sec kπ = (−1)ᵏ: away from its asymptotes sec x is continuous, so for k = 0, 1, 2 its limits at kπ are its values 1, −1 and 1.",
    "sec kπ = (−1)ᵏ：在渐近线之外 sec x 连续，所以 k = 0、1、2 时，它在 kπ 处的极限就是函数值 1、−1、1。",
  ),
  "limits-of-inverse-trigonometric-functions#inverse-trigonometric-limits-at-a-point": graphed(
    wide(-4, 4, -2, 4),
    [
      curveOf(acos, undefined, -1, 1),
      curveOf(atan, "action"),
      pt([0.5, pi / 3], "(1/2, π/3)", "ne", "result"),
      pt([-1, -pi / 4], "(−1, −π/4)", "w", "result"),
      tag([-1, pi], "arccos x", "w"),
      tag([3, atan(3)], "arctan x", "n"),
    ],
    "Inside their domains these have no breaks, so their limits are their values: arccos x → π/3 at x = 1/2, and arctan x → −π/4 at x = −1.",
    "在定义域内它们没有间断，所以极限就是函数值：在 x = 1/2 处 arccos x → π/3，在 x = −1 处 arctan x → −π/4。",
  ),
  "limits-of-inverse-trigonometric-functions#arctangent-limits-at-infinity": graphed(
    wide(-10, 10, -3, 3, 5),
    [
      curveOf(atan),
      curveOf((x) => atan(3 * x), "action"),
      across(pi / 2, "result"),
      across(-pi / 2, "result"),
      tag([6, pi / 2], "y = π/2", "n"),
      tag([-6, -pi / 2], "y = −π/2", "s"),
    ],
    "arctan x approaches π/2 at the far right and −π/2 at the far left. arctan 3x climbs faster near 0, but its limits are the same.",
    "arctan x 在最右端趋近 π/2，在最左端趋近 −π/2。arctan 3x 在 0 附近上升更快，但极限相同。",
  ),
  "calculating-limits-using-trigonometric-identities#trigonometric-limits-with-double-angle-formulas": graphed(
    wide(-2, 4, -2, 3),
    [...broken((x) => cos(x) + sin(x), pi / 4, -2, 4), openPt([pi / 4, sqrt(2)], "(π/4, √2)", "n")],
    "cos 2x/(cos x − sin x) equals cos x + sin x except at x = π/4, where it is 0/0. Its graph is that curve with a hole at (π/4, √2), so the limit is √2.",
    "cos 2x/(cos x − sin x) 除 x = π/4 处（0/0）外都等于 cos x + sin x。它的图象就是这条曲线在 (π/4, √2) 处有一个空心点，所以极限是 √2。",
  ),
  "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions#rational-limits-at-infinity-with-equal-degrees": drawing(
    pane(0, [-20, 20, 10], [0, 3, 1], 10, 5)
      .f((x) => (6 * x * x - x) / (3 * x * x + 4))
      .level(2, "result")
      .say(14, 2.2, "y = 2", "n")
      .marks(),
    "y = (6x² − x)/(3x² + 4) levels off towards the horizontal asymptote y = 2, the ratio 6/3 of the leading coefficients.",
    "y = (6x² − x)/(3x² + 4) 趋平于水平渐近线 y = 2，即首项系数之比 6/3。",
  ),
  "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions#where-a-graph-crosses-its-horizontal-asymptote": drawing(
    pane(0, [-8, 12, 4], [0, 3, 1], 10, 5)
      .f((x) => (2 * x * x + x) / (x * x + 1))
      .level(2, "action")
      .dot(2, 2, "(2, 2)", "n", "result")
      .say(-5, 2, "y = 2", "n")
      .marks(),
    "For example, y = (2x² + x)/(x² + 1) has the horizontal asymptote y = 2. Setting it equal to 2 gives 2x² + x = 2x² + 2, so x = 2: the graph crosses the asymptote at (2, 2).",
    "例如，y = (2x² + x)/(x² + 1) 的水平渐近线为 y = 2。令其等于 2 得 2x² + x = 2x² + 2，所以 x = 2：图象在 (2, 2) 处穿过渐近线。",
  ),
  "special-limits-involving-cosine#limits-of-one-minus-cosine": drawing(
    [
      ...pane(0, [-8, 8, 4], [-1, 1, 1], 6, 5)
        .f((x) => (1 - cos(x)) / x, -8, -0.02)
        .f((x) => (1 - cos(x)) / x, 0.02, 8)
        .open(0, 0, "(0, 0)", "nw")
        .say(0, -1.3, "(1 − cos x)/x", "s")
        .marks(),
      ...pane(9, [-8, 8, 4], [-1, 1, 1], 6, 5)
        .f((x) => (1 - cos(x)) / (x * x), -8, -0.02)
        .f((x) => (1 - cos(x)) / (x * x), 0.02, 8)
        .open(0, 0.5, "(0, 1/2)", "ne")
        .say(0, -1.3, "(1 − cos x)/x²", "s")
        .marks(),
    ],
    "(1 − cos x)/x has a hole at (0, 0), so its limit at 0 is 0. (1 − cos x)/x² has a hole at (0, 1/2), so its limit at 0 is 1/2.",
    "(1 − cos x)/x 在 (0, 0) 处有空心点，所以在 0 处的极限是 0。(1 − cos x)/x² 在 (0, 1/2) 处有空心点，所以在 0 处的极限是 1/2。",
  ),
  "determining-continuity-from-graphs#continuity-at-a-point-from-a-graph": drawing(
    [
      ...pane(0, [0, 4, 2], [0, 5, 5], 5, 5)
        .f((x) => x / 2 + 1, 0, 1.97)
        .f((x) => x / 2 + 1, 2.03, 4)
        .open(2, 2)
        .marks(),
      ...pane(7.5, [0, 4, 2], [0, 5, 5], 5, 5)
        .f((x) => x / 2 + 1, 0, 1.97)
        .f((x) => x / 2 + 1, 2.03, 4)
        .open(2, 2)
        .dot(2, 4, undefined, "n", "result")
        .marks(),
      ...pane(15, [0, 4, 2], [0, 5, 5], 5, 5)
        .f((x) => x / 2 + 1, 0, 1.97)
        .f((x) => x / 2 + 3, 2, 4)
        .open(2, 2)
        .dot(2, 4, undefined, "n", "result")
        .marks(),
    ],
    "For example, three graphs not continuous at x = 2: one with a hole, one with a filled point at height 4 away from the curve, and one with a jump. Each must be drawn by lifting the pen.",
    "例如，三个在 x = 2 处不连续的图象：一个有空心点，一个的实心点在高度 4，偏离曲线，一个有跳跃。每一个都必须抬笔才能画出。",
  ),
  "determining-continuity-from-graphs#locating-discontinuities-on-a-graph": graphed(
    wide(-5, 6, -2, 6),
    [
      ...broken((x) => x / 2 + 2, -2, -5, 1),
      curveOf((x) => x, undefined, 1, 5.5),
      openPt([-2, 1], "", "nw"),
      openPt([1, 2.5], "", "n"),
      bare([1, 1]),
      pt([3, 3], "", "se", "result"),
    ],
    "For example, this graph is not continuous at x = −2, where it has a hole, or at x = 1, where it jumps from height 2.5 to height 1. It is continuous at x = 3, where the curve arrives at the same height from both sides.",
    "例如，这个图象在 x = −2 处有空心点，在 x = 1 处从高度 2.5 跳到高度 1，都不连续。在 x = 3 处曲线从两侧到达同一高度，是连续的。",
  ),
  "defining-continuity-at-a-point#the-value-that-repairs-a-hole": graphed(
    wide(-2, 6, -1, 6),
    [...broken((x) => x + 1, 2, -2, 5), openPt([2, 3], "y = 3", "e"), pt([2, 1], "f(2) = 1", "e"), toward([2, 1], [2, 2.85], "action")],
    "For example, the hole is at (2, 3) and the dot at (2, 1). The limit is 3, the height of the hole, so moving the value to f(2) = 3 repairs the discontinuity.",
    "例如，空心点在 (2, 3)，实心点在 (2, 1)。极限是空心点的高度 3，所以把函数值改为 f(2) = 3 就能修复间断。",
  ),
  "left-and-right-continuity#one-sided-continuity-from-a-graph": graphed(
    wide(-2, 6, -2, 5),
    [
      curveOf((x) => x + 1, undefined, -2, 2),
      curveOf((x) => x - 1, undefined, 2, 6),
      openPt([2, 3], "(2, 3)", "nw"),
      pt([2, 1], "f(2) = 1", "se", "result"),
    ],
    "For example, the filled point (2, 1) sits at the start of the right piece, so f is continuous from the right at x = 2, not from the left, where the curve approaches height 3.",
    "例如，实心点 (2, 1) 在右段的起点，所以 f 在 x = 2 处右连续，而不左连续，左侧曲线趋近高度 3。",
  ),
  "point-discontinuities#point-discontinuities-from-a-graph": graphed(
    wide(-4, 4, -1, 6),
    [
      curveOf((x) => (x * x) / 2, undefined, -3.4, -2.001),
      curveOf((x) => (x * x) / 2, undefined, -1.999, 1.999),
      curveOf((x) => (x * x) / 2, undefined, 2.001, 3.4),
      openPt([-2, 2], "", "w"),
      openPt([2, 2], undefined),
      pt([2, 4], "", "nw", "result"),
    ],
    "For example, on y = x²/2 the limit at x = −2 and at x = 2 is 2. f(−2) is not defined, and f(2) = 4 is misplaced. Putting each point at height 2 would make f continuous.",
    "例如，在 y = x²/2 上，x = −2 和 x = 2 处的极限都是 2。f(−2) 没有定义，f(2) = 4 位置不对。把这两点都放到高度 2 就能使 f 连续。",
  ),
  "point-discontinuities#the-hole-of-a-rational-function": graphed(
    wide(-3, 6, -1, 7),
    [...broken((x) => x + 2, 3, -3, 5), openPt([3, 5], "(3, 5)", "nw")],
    "(x² − x − 6)/(x − 3) equals x + 2 except at x = 3, so its graph is that line with a hole at (3, 5).",
    "(x² − x − 6)/(x − 3) 除 x = 3 外都等于 x + 2，所以它的图象就是这条直线，在 (3, 5) 处有空心点。",
  ),
  "jump-discontinuities#the-size-of-a-jump": graphed(
    wide(-1, 6, -2, 8),
    [
      curveOf((x) => x - 1, undefined, -1, 2),
      curveOf((x) => x + 2, undefined, 2, 5.5),
      openPt([2, 1], "x → a⁻: 1", "e"),
      pt([2, 4], "x → a⁺: 4", "e", "result"),
      toward([2, 1.2], [2, 3.8], "action"),
    ],
    "For example, the left limit is 1 and the right limit is 4, so the jump at x = 2 is 4 − 1 = 3, positive because the graph jumps up.",
    "例如，左极限是 1，右极限是 4，所以 x = 2 处的跳跃是 4 − 1 = 3，为正是因为图象向上跳。",
  ),
  "jump-discontinuities#the-number-of-jumps-of-a-floor-function": graphed(
    wide(-1, 3, -1, 5),
    [
      ...[0, 1, 2, 3].flatMap((i): PlaneMark[] => [
        { kind: "segment", a: [i / 2, i], b: [(i + 1) / 2, i] },
        bare([i / 2, i]),
        openPt([(i + 1) / 2, i]),
      ]),
      bare([2, 4], "action"),
      tag([0.5, 1.1], "⌊2x⌋", "nw"),
    ],
    "For example, ⌊2x⌋ on [0, 2] jumps by 1 at each multiple of 1/2: inside the interval at x = 0.5, 1 and 1.5, which is 3 interior jumps. The jump at x = 2 is at the end, so it does not count.",
    "例如，⌊2x⌋ 在 [0, 2] 上每到 1/2 的整数倍就跳 1：区间内部在 x = 0.5、1、1.5 处，共 3 个内部跳跃。x = 2 处的跳跃在端点，不计入。",
  ),
  "discontinuities-due-to-vertical-asymptotes#classifying-discontinuities-from-graphs": drawing(
    [
      ...pane(0, [0, 4, 2], [-4, 6, 10], 5, 5)
        .f((x) => x + 1, 0, 1.97)
        .f((x) => x + 1, 2.03, 4)
        .open(2, 3)
        .marks(),
      ...pane(7.5, [0, 4, 2], [-4, 6, 10], 5, 5)
        .f((x) => x + 1, 0, 1.97)
        .f((x) => x - 1, 2.03, 4)
        .open(2, 3)
        .open(2, 1)
        .marks(),
      ...pane(15, [0, 4, 2], [-4, 6, 10], 5, 5)
        .f((x) => 1 / (x - 2))
        .wall(2)
        .say(2, -4.6, "∞", "s")
        .marks(),
    ],
    "For example, at x = 2: a point discontinuity, where the limit 3 exists and the value is missing; a jump, with one-sided limits 3 and 1; and an infinite discontinuity, at a vertical asymptote.",
    "例如，在 x = 2 处：可去间断，极限 3 存在而函数值缺失；跳跃间断，单侧极限为 3 和 1；无穷间断，在竖直渐近线处。",
  ),
  "discontinuities-due-to-vertical-asymptotes#classifying-discontinuities-of-rational-functions": graphed(
    wide(-7, 5, -5, 5),
    [
      curveOf((x) => 1 / (x + 2), undefined, -7, -2.01),
      curveOf((x) => 1 / (x + 2), undefined, -1.99, 0.999),
      curveOf((x) => 1 / (x + 2), undefined, 1.001, 5),
      upright(-2, "action"),
      openPt([1, 1 / 3], "(1, 1/3)", "ne"),
      tag([-2, 4], "x = −2", "w"),
    ],
    "For example, (x − 1)/((x − 1)(x + 2)): the factor x − 1 cancels, so x = 1 is a point discontinuity, a hole at (1, 1/3). The factor x + 2 remains, so x = −2 is an infinite discontinuity.",
    "例如，(x − 1)/((x − 1)(x + 2))：因式 x − 1 约去，所以 x = 1 是可去间断，在 (1, 1/3) 处有空心点。因式 x + 2 留下，所以 x = −2 是无穷间断。",
  ),
  "discontinuities-due-to-vertical-asymptotes#counting-vertical-asymptotes-after-cancelling": graphed(
    wide(-5, 6, -5, 5),
    [
      curveOf((x) => 1 / (x - 1), undefined, -5, -1.001),
      curveOf((x) => 1 / (x - 1), undefined, -0.999, 0.99),
      curveOf((x) => 1 / (x - 1), undefined, 1.01, 6),
      upright(1, "action"),
      openPt([-1, -0.5], "(−1, −1/2)", "sw"),
      tag([1, 4], "x = 1", "e"),
    ],
    "For example, (x − 1)(x + 1)/((x − 1)²(x + 1)) has zeros of the denominator at 1 and −1. At x = 1 the bottom has the higher power, which gives one asymptote. At x = −1 the powers match, which gives a hole.",
    "例如，(x − 1)(x + 1)/((x − 1)²(x + 1)) 的分母零点是 1 和 −1。在 x = 1 处分母次数更高，得到一条渐近线。在 x = −1 处次数相同，得到一个空心点。",
  ),
  "the-intermediate-value-theorem#intermediate-values-at-a-drawn-level": graphed(
    wide(-3, 3, -2, 5),
    [
      curveOf((x) => x ** 3 - 3 * x + 1, undefined, -2.3, 2.3),
      across(1, "action"),
      bare([-sqrt(3), 1], "result"),
      bare([0, 1], "result"),
      bare([sqrt(3), 1], "result"),
      pt([-2, -1], "(−2, −1)", "w"),
      pt([-1, 3], "(−1, 3)", "n"),
      pt([1, -1], "(1, −1)", "s"),
      pt([2, 3], "(2, 3)", "e"),
    ],
    "For example, y = x³ − 3x + 1 at the level y = 1: it is below at x = −2, above at −1, below at 1 and above at 2. These 3 changes of side force 3 solutions, x = −√3, 0 and √3.",
    "例如，y = x³ − 3x + 1 与水平线 y = 1：在 x = −2 处在下方，在 −1 处在上方，在 1 处在下方，在 2 处在上方。这 3 次换边保证有 3 个解：x = −√3、0、√3。",
  ),
  "removing-point-discontinuities#not-every-gap-can-be-removed": drawing(
    [
      ...pane(0, [-2, 5, 7], [-4, 8, 4], 6, 5)
        .f((x) => x + 2, -2, 1.97)
        .f((x) => x + 2, 2.03, 5)
        .open(2, 4, "(2, 4)", "nw")
        .say(1.5, -5, "(x² − 4)/(x − 2)", "s")
        .marks(),
      ...pane(9, [-2, 5, 7], [-4, 8, 4], 6, 5)
        .f((x) => (x + 2) / (x - 2))
        .wall(2)
        .say(1.5, -5, "(x + 2)/(x − 2)", "s")
        .marks(),
    ],
    "For example, at x = 2: (x² − 4)/(x − 2) has numerator 0, and cancelling gives the limit 4, so f(2) = 4 repairs the hole. (x + 2)/(x − 2) has numerator 4, so x = 2 is a vertical asymptote and no value helps.",
    "例如，在 x = 2 处：(x² − 4)/(x − 2) 分子为 0，约分得极限 4，所以令 f(2) = 4 可修复空心点。(x + 2)/(x − 2) 分子为 4，所以 x = 2 是竖直渐近线，任何函数值都没用。",
  ),
  "removing-discontinuities-from-rational-functions#which-discontinuities-are-removable": graphed(
    wide(-7, 9, -6, 8),
    [
      curveOf((x) => (x + 2) / (x - 3), undefined, -7, 0.999),
      curveOf((x) => (x + 2) / (x - 3), undefined, 1.001, 2.99),
      curveOf((x) => (x + 2) / (x - 3), undefined, 3.01, 9),
      upright(3, "action"),
      openPt([1, -1.5]),
      dash([1, -1.5], [-1, -2.5]),
      tag([-1, -2.5], "(1, −3/2)", "w"),
      tag([3, 7], "x = 3", "e"),
    ],
    "For example, (x − 1)(x + 2)/((x − 1)(x − 3)): the factor x − 1 cancels, so x = 1 is removable, a hole at (1, −3/2). The factor x − 3 remains, so x = 3 is a vertical asymptote and cannot be removed.",
    "例如，(x − 1)(x + 2)/((x − 1)(x − 3))：因式 x − 1 约去，所以 x = 1 可去，在 (1, −3/2) 处有空心点。因式 x − 3 留下，所以 x = 3 是竖直渐近线，不可去。",
  ),
};
