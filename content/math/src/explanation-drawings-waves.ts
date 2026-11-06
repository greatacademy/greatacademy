// Drawings in the explanations of the graphs of the trigonometric functions of Algebra II:
// every wave, asymptote and key point is computed from the equation in the text.

import type { Figure } from "@ga/content";
import type { Mark } from "@ga/subject-math";
import type { Chart } from "./explanation-drawings-charts.ts";
import { piChart, plot, wall } from "./explanation-drawings-curves.ts";
import { dotAt, drawing, note, seg } from "./explanation-drawings-kit.ts";

const { PI: pi, sin, cos, tan } = Math;
const sec = (x: number): number => 1 / cos(x);
const csc = (x: number): number => 1 / sin(x);
const cot = (x: number): number => cos(x) / sin(x);
type Dir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

/** a distance along the x-axis of a chart, marked at height y */
const span = (c: Chart, a: number, b: number, y: number, s: string): Mark[] => [
  seg(c.at(a, y), c.at(b, y), "action"),
  note(c.at((a + b) / 2, y), s, "n"),
];
const level = (c: Chart, a: number, b: number, y: number): Mark => seg(c.at(a, y), c.at(b, y), undefined, true);
const spot = (c: Chart, x: number, y: number, s?: string, dir: Dir = "n", tone: "action" | "result" = "result"): Mark[] =>
  dotAt(c.at(x, y), s, dir, tone);

const build = (c: Chart, marks: (c: Chart) => Mark[], en: string, zh: string): Figure => drawing([...c.marks, ...marks(c)], en, zh);

/** waveDrawings are drawings in the explanations of the trigonometric graphs of Algebra II, by topic and knowledge point. */
export const waveDrawings: Readonly<Record<string, Figure>> = {
  "graphing-tangent-and-cotangent#intercepts-and-asymptotes-over-an-interval": build(
    piChart(0, 6, 2, [-3, 3, 1]),
    (c) => [
      ...plot(c, tan, 0, 3 * pi, -3, 3),
      ...[0.5, 1.5, 2.5].map((k) => wall(c, k * pi, -3, 3, "action")),
      ...[0, 1, 2, 3].flatMap((k) => spot(c, k * pi, 0)),
    ],
    "y = tan x on 0 ≤ x ≤ 3π: asymptotes at π/2, 3π/2 and 5π/2, and x-intercepts at 0, π, 2π and 3π.",
    "y = tan x 在 0 ≤ x ≤ 3π 上：渐近线在 π/2、3π/2、5π/2，x 轴截距在 0、π、2π、3π。",
  ),
  "graphing-secant-and-cosecant#asymptotes-and-turning-points-over-an-interval": build(
    piChart(-2, 4, 2, [-3, 3, 1]),
    (c) => [
      ...plot(c, csc, -pi, 2 * pi, -3, 3),
      ...[-1, 0, 1, 2].map((k) => wall(c, k * pi, -3, 3, "action")),
      ...spot(c, pi / 2, 1, "(π/2, 1)", "n"),
      ...spot(c, -pi / 2, -1, undefined, "s", "action"),
      ...spot(c, (3 * pi) / 2, -1, undefined, "s", "action"),
    ],
    "y = csc x on −π ≤ x ≤ 2π: asymptotes at the multiples of π, and it reaches y = 1 only at π/2 and y = −1 at −π/2 and 3π/2.",
    "y = csc x 在 −π ≤ x ≤ 2π 上：渐近线在 π 的整数倍处，它只在 π/2 处达到 y = 1，在 −π/2 和 3π/2 处达到 y = −1。",
  ),
  "describing-properties-of-the-sine-function#period-and-symmetry-of-the-sine-function": build(
    piChart(-4, 4, 2, [-2, 2, 1]),
    (c) => [
      ...plot(c, sin, -2 * pi, 2 * pi, -2, 2),
      ...span(c, 0, 2 * pi, 1.4, "T = 2π"),
      ...spot(c, pi / 2, 1, undefined),
      ...spot(c, -pi / 2, -1, undefined),
      seg(c.at(-pi / 2, -1), c.at(pi / 2, 1), "result", true),
    ],
    "y = sin x repeats every 2π and is symmetric about the origin: the points at π/2 and −π/2 are opposite, 1 and −1.",
    "y = sin x 每 2π 重复一次，并关于原点对称：π/2 和 −π/2 处的点互为相反，分别是 1 和 −1。",
  ),
  "describing-properties-of-the-sine-function#intervals-of-increase-and-decrease-of-the-sine-function": build(
    piChart(-1, 3, 2, [-2, 2, 1]),
    (c) => [
      ...plot(c, sin, -pi / 2, pi / 2, -2, 2, "result"),
      ...plot(c, sin, pi / 2, (3 * pi) / 2, -2, 2, "action"),
      note(c.at(0.1, 1.1), "↗", "w"),
      note(c.at(pi - 0.1, 1.1), "↘", "e"),
    ],
    "y = sin x increases on (−π/2, π/2), from its minimum to its maximum, and decreases on (π/2, 3π/2).",
    "y = sin x 在 (−π/2, π/2) 上从最小值升到最大值，是增函数；在 (π/2, 3π/2) 上递减。",
  ),
  "describing-properties-of-the-cosine-function#period-and-symmetry-of-the-cosine-function": build(
    piChart(-4, 4, 2, [-2, 2, 1]),
    (c) => [
      ...plot(c, cos, -2 * pi, 2 * pi, -2, 2),
      ...span(c, 0, 2 * pi, 1.4, "T = 2π"),
      ...spot(c, pi / 3, 0.5),
      ...spot(c, -pi / 3, 0.5),
      seg(c.at(-pi / 3, 0.5), c.at(pi / 3, 0.5), "result", true),
    ],
    "y = cos x repeats every 2π and is symmetric about the y-axis: at π/3 and −π/3 it has the same height, ½.",
    "y = cos x 每 2π 重复一次，并关于 y 轴对称：在 π/3 和 −π/3 处高度相同，都是 ½。",
  ),
  "describing-properties-of-the-tangent-function#period-and-symmetry-of-the-tangent-function": build(
    piChart(-6, 6, 4, [-3, 3, 1], 8, 4, 2),
    (c) => [
      ...plot(c, tan, (-3 * pi) / 2, (3 * pi) / 2, -3, 3),
      ...[-1.5, -0.5, 0.5, 1.5].map((k) => wall(c, k * pi, -3, 3, "action")),
      ...spot(c, -(3 * pi) / 4, 1),
      ...spot(c, pi / 4, 1),
      ...span(c, -(3 * pi) / 4, pi / 4, 1, "T = π"),
    ],
    "y = tan x repeats every π, half the period of sine and cosine: at −3π/4 and π/4 it has the same height, 1.",
    "y = tan x 每 π 重复一次，周期是正弦和余弦的一半：在 −3π/4 和 π/4 处高度相同，都是 1。",
  ),
  "describing-properties-of-the-tangent-function#intervals-of-increase-and-decrease-of-the-tangent-function": build(
    piChart(-2, 6, 4, [-3, 3, 1]),
    (c) => [
      ...plot(c, tan, -pi / 2, pi / 2, -3, 3, "result"),
      ...plot(c, tan, pi / 2, pi + pi / 2, -3, 3),
      ...[-0.5, 0.5, 1.5].map((k) => wall(c, k * pi, -3, 3, "action")),
      ...spot(c, pi / 4, 1, "(π/4, 1)", "se"),
      ...spot(c, (3 * pi) / 4, -1, "(3π/4, −1)", "se", "action"),
    ],
    "y = tan x rises on every branch between asymptotes, but not across one: tan(π/4) = 1 is greater than tan(3π/4) = −1.",
    "y = tan x 在相邻渐近线之间的每一支上都上升，但跨过渐近线时不然：tan(π/4) = 1 大于 tan(3π/4) = −1。",
  ),
  "describing-properties-of-the-secant-function#period-and-symmetry-of-the-secant-function": build(
    piChart(-4, 4, 2, [-3, 3, 1]),
    (c) => [
      ...plot(c, sec, -2 * pi, 2 * pi, -3, 3),
      ...[-1.5, -0.5, 0.5, 1.5].map((k) => wall(c, k * pi, -3, 3, "action")),
      ...spot(c, pi / 3, 2),
      ...spot(c, -pi / 3, 2),
      seg(c.at(-pi / 3, 2), c.at(pi / 3, 2), "result", true),
    ],
    "y = sec x repeats every 2π and is symmetric about the y-axis: at π/3 and −π/3 it has the same height, 2.",
    "y = sec x 每 2π 重复一次，并关于 y 轴对称：在 π/3 和 −π/3 处高度相同，都是 2。",
  ),
  "describing-properties-of-the-cosecant-function#period-and-symmetry-of-the-cosecant-function": build(
    piChart(-4, 4, 2, [-3, 3, 1]),
    (c) => [
      ...plot(c, csc, -2 * pi, 2 * pi, -3, 3),
      ...[-2, -1, 0, 1, 2].map((k) => wall(c, k * pi, -3, 3, "action")),
      ...spot(c, pi / 6, 2),
      ...spot(c, -pi / 6, -2),
      seg(c.at(-pi / 6, -2), c.at(pi / 6, 2), "result", true),
    ],
    "y = csc x repeats every 2π and is symmetric about the origin: at π/6 and −π/6 its heights are opposite, 2 and −2.",
    "y = csc x 每 2π 重复一次，并关于原点对称：在 π/6 和 −π/6 处高度互为相反，分别是 2 和 −2。",
  ),
  "describing-properties-of-the-cotangent-function#intervals-of-increase-and-decrease-of-the-cotangent-function": build(
    piChart(-4, 4, 4, [-3, 3, 1]),
    (c) => [
      ...plot(c, cot, -pi, 0, -3, 3),
      ...plot(c, cot, 0, pi, -3, 3, "result"),
      ...[-1, 0, 1].map((k) => wall(c, k * pi, -3, 3, "action")),
      ...spot(c, pi / 4, 1, "(π/4, 1)", "e"),
      ...spot(c, -pi / 4, -1, "(−π/4, −1)", "w", "action"),
    ],
    "y = cot x falls on every branch between asymptotes, but not across one: cot(−π/4) = −1 is less than cot(π/4) = 1.",
    "y = cot x 在相邻渐近线之间的每一支上都下降，但跨过渐近线时不然：cot(−π/4) = −1 小于 cot(π/4) = 1。",
  ),
  "vertical-translations-of-trigonometric-functions#describing-vertical-translations": build(
    piChart(0, 4, 2, [-5, 2, 1]),
    (c) => [
      ...plot(c, cos, 0, 2 * pi, -5, 2, undefined, true),
      ...plot(c, (x) => cos(x) - 3, 0, 2 * pi, -5, 2, "result"),
      level(c, 0, 2 * pi, -3),
      seg(c.at(pi, -1), c.at(pi, -4), "action"),
      note(c.at(pi, -2.5), "3", "e"),
    ],
    "y = cos x − 3 is y = cos x, dashed, moved down 3: every point at the same x, and the midline y = −3.",
    "y = cos x − 3 就是 y = cos x（虚线）下移 3：每个点的 x 不变，中线为 y = −3。",
  ),
  "horizontal-translations-of-trigonometric-functions#describing-horizontal-translations": build(
    piChart(-2, 6, 3, [-2, 2, 1]),
    (c) => [
      ...plot(c, cos, -2 * (pi / 3), 2 * pi, -2, 2, undefined, true),
      ...plot(c, (x) => cos(x + pi / 3), -2 * (pi / 3), 2 * pi, -2, 2, "result"),
      ...spot(c, -pi / 3, 1, undefined),
      ...spot(c, 0, 1, undefined, "n", "action"),
      ...span(c, -pi / 3, 0, 1.45, "π/3"),
    ],
    "y = cos(x + π/3) is y = cos x, dashed, moved left π/3: the maximum at 0 moves to −π/3.",
    "y = cos(x + π/3) 就是 y = cos x（虚线）左移 π/3：0 处的最大值点移到 −π/3。",
  ),
  "horizontal-translations-of-trigonometric-functions#key-points-after-a-horizontal-translation": build(
    piChart(0, 12, 6, [-2, 2, 1], 8, 4, 2),
    (c) => [
      ...plot(c, sin, 0, 2 * pi, -2, 2, undefined, true),
      ...plot(c, (x) => sin(x - pi / 3), 0, 2 * pi, -2, 2, "result"),
      ...spot(c, pi / 2, 1, "π/2", "nw", "action"),
      ...spot(c, (5 * pi) / 6, 1, "5π/6", "ne"),
    ],
    "y = sin(x − π/3) is y = sin x, dashed, moved right π/3: the maximum at π/2 moves to π/2 + π/3 = 5π/6.",
    "y = sin(x − π/3) 就是 y = sin x（虚线）右移 π/3：π/2 处的最大值点移到 π/2 + π/3 = 5π/6。",
  ),
  "combining-graph-transformations-of-sine-and-cosine#the-shift-of-y-a-sin-bx-phi-d": build(
    piChart(0, 8, 6, [-2, 2, 1]),
    (c) => [
      ...plot(c, (x) => sin(3 * x), 0, (4 * pi) / 3, -2, 2, undefined, true),
      ...plot(c, (x) => sin(3 * x - pi / 2), 0, (4 * pi) / 3, -2, 2, "result"),
      ...span(c, pi / 6, (5 * pi) / 6, 1.5, "2π/3"),
      ...spot(c, pi / 6, 0, undefined),
    ],
    "y = sin(3x − π/2) is y = sin 3x, dashed, moved right π/6, not π/2: its rising zero moves from 0 to π/6, and its period stays 2π/3.",
    "y = sin(3x − π/2) 就是 y = sin 3x（虚线）右移 π/6，而不是 π/2：上升过零点从 0 移到 π/6，周期仍为 2π/3。",
  ),
  "graph-transformations-of-tangent-and-cotangent#asymptotes-after-a-translation": build(
    piChart(-2, 6, 3, [-2, 6, 2]),
    (c) => [
      ...plot(c, (x) => cot(x + pi / 3) + 2, -2 * (pi / 3), 2 * pi, -2, 6),
      ...[-1 / 3, 2 / 3, 5 / 3].map((k) => wall(c, k * pi, -2, 6, "action")),
      level(c, -2 * (pi / 3), 2 * pi, 2),
    ],
    "y = cot(x + π/3) + 2 has its asymptotes moved left π/3, to x = −π/3 + kπ: −π/3, 2π/3 and 5π/3. Moving it up 2 does not change them.",
    "y = cot(x + π/3) + 2 的渐近线左移 π/3，变为 x = −π/3 + kπ：−π/3、2π/3、5π/3。上移 2 不改变它们。",
  ),
  "combining-graph-transformations-of-tangent-and-cotangent#asymptotes-of-a-combined-tangent": build(
    piChart(-6, 18, 12, [-3, 3, 1], 8, 4, 6),
    (c) => [
      ...plot(c, (x) => tan(2 * (x - pi / 6)), -pi / 2, (3 * pi) / 2, -3, 3),
      ...[-1, 5, 11, 17].map((k) => wall(c, (k * pi) / 12, -3, 3, "action")),
      note(c.at((5 * pi) / 12, 3), "5π/12", "n"),
      note(c.at((11 * pi) / 12, 3), "11π/12", "n"),
    ],
    "y = tan(2(x − π/6)) has asymptotes where 2(x − π/6) = π/2 + kπ, that is x = 5π/12 + kπ/2, a distance π/2 apart.",
    "y = tan(2(x − π/6)) 的渐近线满足 2(x − π/6) = π/2 + kπ，即 x = 5π/12 + kπ/2，间隔 π/2。",
  ),
  "combining-graph-transformations-of-secant-and-cosecant#asymptotes-of-a-transformed-secant": build(
    piChart(-2, 12, 3, [-6, 6, 3], 8, 4, 3),
    (c) => [
      ...plot(c, (x) => 3 * csc(0.5 * (x + pi / 3)), -2 * (pi / 3), 4 * pi, -6, 6),
      ...[-1, 5, 11].map((k) => wall(c, (k * pi) / 3, -6, 6, "action")),
      note(c.at(-pi / 3, 6), "−π/3", "n"),
      note(c.at((5 * pi) / 3, 6), "5π/3", "n"),
      ...spot(c, (2 * pi) / 3, 3, "(2π/3, 3)", "n"),
    ],
    "y = 3csc(½(x + π/3)) has asymptotes where ½(x + π/3) = kπ: x = −π/3 + 2kπ, that is −π/3, 5π/3 and so on.",
    "y = 3csc(½(x + π/3)) 的渐近线满足 ½(x + π/3) = kπ：x = −π/3 + 2kπ，即 −π/3、5π/3 等。",
  ),
  "graphing-reflections-of-trigonometric-functions#reflecting-in-the-y-axis": build(
    piChart(-4, 4, 2, [-2, 2, 1]),
    (c) => [
      ...plot(c, sin, -2 * pi, 2 * pi, -2, 2, undefined, true),
      ...plot(c, (x) => sin(-x), -2 * pi, 2 * pi, -2, 2, "result"),
      ...spot(c, pi / 2, 1, "sin x", "n", "action"),
      ...spot(c, pi / 2, -1, "sin(−x)", "s"),
    ],
    "Reflecting y = sin x, dashed, in the y-axis gives y = sin(−x) = −sin x, the same as reflecting it in the x-axis.",
    "把 y = sin x（虚线）关于 y 轴翻折得 y = sin(−x) = −sin x，与关于 x 轴翻折相同。",
  ),
  "graphing-reflections-of-trigonometric-functions#extrema-of-reflected-waves": build(
    piChart(0, 4, 2, [-2, 4, 1]),
    (c) => [
      ...plot(c, (x) => -2 * cos(x) + 1, 0, 2 * pi, -2, 4),
      level(c, 0, 2 * pi, 1),
      ...spot(c, pi, 3, "(π, 3)", "n"),
      ...spot(c, 2 * pi, -1, "(2π, −1)", "s"),
    ],
    "y = −2cos x + 1 is upside down: its maximum 3 is at π, and its minimum −1 is at 0 and 2π.",
    "y = −2cos x + 1 上下颠倒：最大值 3 在 π 处，最小值 −1 在 0 和 2π 处。",
  ),
  "graphing-reflections-of-trigonometric-functions-three-or-more-transformations#values-of-reflected-combined-waves": build(
    piChart(0, 8, 4, [-3, 5, 1], 8, 4, 2),
    (c) => [
      ...plot(c, (x) => -3 * cos(2 * (x - pi / 4)) + 1, 0, 2 * pi, -3, 5),
      level(c, 0, 2 * pi, 1),
      ...spot(c, pi / 4, -2, "(π/4, −2)", "e"),
      ...spot(c, (3 * pi) / 4, 4, "(3π/4, 4)", "e"),
    ],
    "y = −3cos(2(x − π/4)) + 1 has maximum 1 + 3 = 4, minimum 1 − 3 = −2 and period π.",
    "y = −3cos(2(x − π/4)) + 1 的最大值为 1 + 3 = 4，最小值为 1 − 3 = −2，周期为 π。",
  ),
  "properties-of-transformed-sine-and-cosine-functions#evaluating-transformed-sine-and-cosine": build(
    piChart(0, 4, 2, [-4, 6, 2]),
    (c) => [...plot(c, (x) => 4 * cos(2 * x - pi / 3) + 1, 0, 2 * pi, -4, 6), ...spot(c, pi / 2, -1, "(π/2, −1)", "e")],
    "f(x) = 4cos(2x − π/3) + 1 at π/2 is 4cos(2π/3) + 1 = −2 + 1 = −1.",
    "f(x) = 4cos(2x − π/3) + 1 在 π/2 处的值是 4cos(2π/3) + 1 = −2 + 1 = −1。",
  ),
  "finding-zeros-and-extrema-of-transformed-sine-and-cosine-functions#locating-the-extrema": build(
    piChart(0, 12, 6, [-3, 3, 1], 8, 4, 2),
    (c) => [
      ...plot(c, (x) => 2 * cos(3 * x - pi / 2), 0, 2 * pi, -3, 3),
      ...spot(c, pi / 6, 2, "π/6", "n"),
      ...spot(c, (5 * pi) / 6, 2, "5π/6", "n"),
      ...span(c, pi / 6, (5 * pi) / 6, 2.75, "2π/3"),
    ],
    "y = 2cos(3x − π/2) reaches its maximum 2 where 3x − π/2 = 0, at x = π/6, and again one period 2π/3 later, at 5π/6.",
    "y = 2cos(3x − π/2) 在 3x − π/2 = 0 即 x = π/6 处达到最大值 2，过一个周期 2π/3 后，在 5π/6 处再次达到。",
  ),
  "finding-zeros-and-extrema-of-transformed-sine-and-cosine-functions#zeros-off-the-midline": build(
    piChart(0, 6, 3, [-2, 6, 2]),
    (c) => [
      ...plot(c, (x) => 4 * cos(2 * x) + 2, 0, 2 * pi, -2, 6),
      level(c, 0, 2 * pi, 2),
      note(c.at(2 * pi, 2), "y = 2", "e"),
      ...[1, 2, 4, 5].flatMap((k) => spot(c, (k * pi) / 3, 0)),
    ],
    "y = 4cos 2x + 2 has midline y = 2, and crosses the x-axis off the midline: at π/3 and 2π/3, then π later at 4π/3 and 5π/3.",
    "y = 4cos 2x + 2 的中线是 y = 2，它在中线以外穿过 x 轴：在 π/3 和 2π/3，再过 π 在 4π/3 和 5π/3。",
  ),
  "properties-of-transformed-tangent-and-cotangent-functions#period-of-transformed-tangent-and-cotangent": build(
    piChart(0, 12, 12, [0, 10, 2], 8, 4, 3),
    (c) => [
      ...plot(c, (x) => -2 * cot(4 * x - pi / 3) + 5, 0, pi, 0, 10),
      ...[1, 4, 7, 10].map((k) => wall(c, (k * pi) / 12, 0, 10, "action")),
      ...span(c, pi / 12, pi / 3, 9, "π/4"),
    ],
    "y = −2cot(4x − π/3) + 5 has period π/4, the period π of cotangent divided by 4: its asymptotes are π/4 apart.",
    "y = −2cot(4x − π/3) + 5 的周期是 π/4，即余切的周期 π 除以 4：渐近线间隔 π/4。",
  ),
  "properties-of-transformed-tangent-and-cotangent-functions#asymptotes-of-transformed-tangent-and-cotangent": build(
    piChart(-4, 8, 4, [-3, 3, 1], 8, 4, 2),
    (c) => [
      ...plot(c, (x) => cot(2 * x + pi / 2), -pi, 2 * pi, -3, 3),
      ...[-1, 1, 3, 5, 7].map((k) => wall(c, (k * pi) / 4, -3, 3, "action")),
      note(c.at(pi / 4, 3), "π/4", "n"),
      note(c.at((3 * pi) / 4, 3), "3π/4", "n"),
    ],
    "y = cot(2x + π/2) has asymptotes where 2x + π/2 = kπ, that is at x = π/4 + kπ/2.",
    "y = cot(2x + π/2) 的渐近线满足 2x + π/2 = kπ，即 x = π/4 + kπ/2。",
  ),
  "properties-of-transformed-tangent-and-cotangent-functions#zeros-of-transformed-tangent-and-cotangent": build(
    piChart(-6, 18, 12, [-6, 4, 2], 8, 4, 6),
    (c) => [
      ...plot(c, (x) => 2 * tan(x - pi / 3) - 2, -pi / 2, (3 * pi) / 2, -6, 4),
      wall(c, -pi / 6, -6, 4, "action"),
      wall(c, (5 * pi) / 6, -6, 4, "action"),
      ...spot(c, (7 * pi) / 12, 0, "7π/12", "nw"),
    ],
    "y = 2tan(x − π/3) − 2 is zero where tan(x − π/3) = 1: x − π/3 = π/4, so x = 7π/12.",
    "y = 2tan(x − π/3) − 2 在 tan(x − π/3) = 1 处为零：x − π/3 = π/4，所以 x = 7π/12。",
  ),
  "properties-of-transformed-secant-and-cosecant-functions#asymptotes-of-transformed-secant-and-cosecant": build(
    piChart(-2, 14, 12, [-4, 4, 2], 8, 4, 3),
    (c) => [
      ...plot(c, (x) => 2 * sec(3 * x - pi / 4), (-2 * pi) / 12, (14 * pi) / 12, -4, 4),
      ...[-1, 3, 7, 11].map((k) => wall(c, (k * pi) / 12, -4, 4, "action")),
      note(c.at(pi / 4, 4), "π/4", "n"),
      note(c.at((7 * pi) / 12, 4), "7π/12", "n"),
      ...spot(c, pi / 12, 2, undefined),
    ],
    "y = 2sec(3x − π/4) has asymptotes where 3x − π/4 = π/2 + kπ, that is at x = π/4 + kπ/3, π/3 apart.",
    "y = 2sec(3x − π/4) 的渐近线满足 3x − π/4 = π/2 + kπ，即 x = π/4 + kπ/3，间隔 π/3。",
  ),
};
