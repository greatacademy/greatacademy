// More drawings in the explanations of Algebra II: functions and their transformations,
// with every graph recomputed from the equation in the text, or an example of its own when the text has none.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { chart, curveOf, openPt, tag, traced } from "./explanation-drawings-charts.ts";
import { across, branches, thick, upright, wide } from "./explanation-drawings-curves.ts";
import { ln, pt, shift } from "./explanation-drawings-geometry-2.ts";
import { mini } from "./explanation-drawings-grades-3.ts";
import { dotAt, drawing, graphed, note, seg, square } from "./explanation-drawings-kit.ts";

type Fn = (x: number) => number;

const log = (b: number, x: number): number => Math.log(x) / Math.log(b);
const mirror = ln([0, 0], [1, 1], undefined, true);
const inMini = (f: Fn, s: "accent" | "action" | "result" = "accent"): Mark[] => {
  const marks: Mark[] = [];
  for (let i = 0; i < 60; i++) {
    const a = -2 + (i * 4) / 60;
    const b = a + 4 / 60;
    if (Math.abs(f(a)) <= 2 && Math.abs(f(b)) <= 2) marks.push(seg([a, f(a)], [b, f(b)], s));
  }
  return marks;
};

/** algebraDrawings3 are further drawings in the explanations of Algebra II, by topic and knowledge point. */
export const algebraDrawings3: Readonly<Record<string, Figure>> = {
  "describing-relationships-using-polynomial-identities#pythagorean-triples": drawing(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [12, 0],
          [12, 5],
        ],
      },
      square([12, 0], [0, 0], [12, 5]),
      note([6, 0], "b = 2xy = 12", "s"),
      note([12, 2.5], "a = x² − y² = 5", "e"),
      note([6, 2.5], "c = x² + y² = 13", "nw"),
    ],
    "With x = 3 and y = 2: a right triangle with legs 5 and 12 and hypotenuse 13.",
    "取 x = 3、y = 2：直角三角形的两条直角边为 5 和 12，斜边为 13。",
  ),
  "inverses-of-quadratic-functions#inverses-in-vertex-form": graphed(
    wide(-6, 7, -6, 7),
    [
      mirror,
      curveOf((x) => -2 * (x + 1) ** 2 + 5, undefined, -3.2, -1),
      curveOf((x) => -Math.sqrt((5 - x) / 2) - 1, "result", -6, 5),
      pt([-1, 5], "(−1, 5)", "ne"),
      pt([5, -1], "(5, −1)", "se", "result"),
      tag([5.5, 5.5], "y = x", "nw"),
    ],
    "f(x) = −2(x + 1)² + 5 for x ≤ −1 and its inverse, mirror images in y = x: the vertex (−1, 5) becomes the endpoint (5, −1).",
    "f(x) = −2(x + 1)² + 5（x ≤ −1）与它的反函数关于 y = x 对称：顶点 (−1, 5) 变成端点 (5, −1)。",
  ),
  "combining-graph-transformations-two-operations#two-transformations-from-graphs": graphed(
    wide(-1, 5, -1, 5),
    [
      thick([0, 0], [2, 1], "action"),
      pt([0, 0], "(0, 0)", "nw", "action"),
      pt([2, 1], "(2, 1)", "se", "action"),
      thick([1, 1], [3, 3]),
      pt([1, 1], "(1, 1)", "nw", "result"),
      pt([3, 3], "(3, 3)", "ne", "result"),
    ],
    "For example, f from (0, 0) to (2, 1) and g from (1, 1) to (3, 3): the same width, twice the height, so g(x) = 2f(x − 1) + 1.",
    "例如，f 从 (0, 0) 到 (2, 1)，g 从 (1, 1) 到 (3, 3)：宽度相同，高度变为 2 倍，所以 g(x) = 2f(x − 1) + 1。",
  ),
  "combining-graph-transformations-three-or-more-operations#describing-several-transformations": graphed(
    wide(-3, 5, -5, 4),
    [
      curveOf((x) => Math.sqrt(x), undefined, 0, 5),
      curveOf((x) => 3 * Math.sqrt(2 * (x + 1)) - 4, "result", -1, 1.6),
      pt([0, 0], "(0, 0)", "se"),
      pt([4, 2], "(4, 2)", "s"),
      pt([-1, -4], "(−1, −4)", "w", "result"),
      pt([1, 2], "(1, 2)", "nw", "result"),
    ],
    "For example, with f(x) = √x: y = 3f(2(x + 1)) − 4 sends (0, 0) to (−1, −4) and (4, 2) to (1, 2).",
    "例如，取 f(x) = √x：y = 3f(2(x + 1)) − 4 把 (0, 0) 变到 (−1, −4)，把 (4, 2) 变到 (1, 2)。",
  ),
  "combining-graph-transformations-three-or-more-operations#several-transformations-from-graphs": graphed(
    wide(-1, 5, -2, 6),
    [
      curveOf((x) => Math.sqrt(x), undefined, 0, 4),
      curveOf((x) => 3 * Math.sqrt(2 * (x - 1)) - 1, "result", 1, 3),
      pt([0, 0], "(0, 0)", "nw"),
      pt([4, 2], "(4, 2)", "e"),
      pt([1, -1], "(1, −1)", "e", "result"),
      pt([3, 5], "(3, 5)", "e", "result"),
    ],
    "For example, f is √x from (0, 0) to (4, 2) and g runs from (1, −1) to (3, 5): half the width and three times the height, so g(x) = 3f(2(x − 1)) − 1.",
    "例如，f 是 √x，从 (0, 0) 到 (4, 2)，g 从 (1, −1) 到 (3, 5)：宽度减半，高度变为 3 倍，所以 g(x) = 3f(2(x − 1)) − 1。",
  ),
  "vertical-reflections-of-functions#vertical-reflections-from-graphs": graphed(
    wide(-2, 6, -4, 4),
    [
      ln([0, -5], [5, 0]),
      ln([0, 5], [5, 0], "result"),
      pt([2, -3], "(2, −3)", "e"),
      pt([2, 3], "g(2) = 3", "e", "result"),
      { kind: "segment", a: [2, -3], b: [2, 3], tone: "action", dashed: true },
    ],
    "For example, f(x) = x − 5 through (2, −3): g(x) = −f(x) has g(2) = −(−3) = 3 at the same input.",
    "例如，f(x) = x − 5 过 (2, −3)：g(x) = −f(x) 在同一输入处 g(2) = −(−3) = 3。",
  ),
  "combining-reflections-with-other-graph-transformations#reflections-and-shifts-from-graphs": graphed(
    wide(-1, 6, -1, 4),
    [
      curveOf((x) => Math.sqrt(x), undefined, 0, 4),
      curveOf((x) => -Math.sqrt(x - 1) + 3, "result", 1, 5),
      pt([0, 0], "(0, 0)", "se"),
      pt([4, 2], "(4, 2)", "n"),
      pt([1, 3], "(1, 3)", "n", "result"),
      pt([5, 1], "(5, 1)", "s", "result"),
    ],
    "For example, √x and a graph that is upside down: the endpoint (1, 3) gives the shift, so g(x) = −√(x − 1) + 3, and (5, 1) checks it.",
    "例如，√x 和一个上下颠倒的图象：端点 (1, 3) 给出平移，所以 g(x) = −√(x − 1) + 3，再用 (5, 1) 检验。",
  ),
  "graphing-elementary-cubic-functions#matching-a-cubic-to-its-graph": graphed(
    wide(-2, 6, -6, 4),
    [curveOf((x) => -((x - 2) ** 3) - 1), pt([2, -1], "(2, −1)", "ne", "result")],
    "y = −(x − 2)³ − 1 falls from left to right, with its center at (2, −1).",
    "y = −(x − 2)³ − 1 从左到右下降，中心在 (2, −1)。",
  ),
  "graphing-cubic-curves-containing-one-distinct-real-root#counting-x-intercepts": drawing(
    [
      ...mini(
        0,
        inMini((x) => 0.4 * x * (x * x + 1)),
        "D < 0: 1",
      ),
      ...mini(
        5.5,
        inMini((x) => 0.5 * (x + 1.4) * (x - 0.7) ** 2),
        "D = 0: 2",
      ),
      ...mini(
        11,
        inMini((x) => 0.45 * (x + 1.4) * x * (x - 1.4)),
        "D > 0: 3",
      ),
    ],
    "A negative discriminant of the quadratic leaves one x-intercept, a zero discriminant two (the curve touches at one), a positive one three.",
    "二次因式判别式为负时有一个 x 轴交点，为零时有两个（曲线在其中一点相切），为正时有三个。",
  ),
  "graphing-general-polynomials#a-polynomial-from-its-graph": graphed(
    wide(-3, 5, -6, 6),
    [
      curveOf((x) => -((x + 1) ** 2) * (x - 1) * (x - 3)),
      pt([-1, 0], "x = −1", "nw", "action"),
      pt([1, 0], "1", "ne", "action"),
      pt([3, 0], "3", "ne", "action"),
      pt([0, -3], "(0, −3)", "w", "result"),
    ],
    "f(x) = −(x + 1)²(x − 1)(x − 3) touches the x-axis at −1, crosses it at 1 and 3, and passes through (0, −3).",
    "f(x) = −(x + 1)²(x − 1)(x − 3) 在 −1 处与 x 轴相切，在 1 和 3 处穿过 x 轴，并过点 (0, −3)。",
  ),
  "vertical-translations-of-exponential-growth-functions#values-of-translated-growth-functions": graphed(
    wide(-5, 2, -1, 12),
    [
      curveOf((x) => 3 * 2 ** x + 4),
      across(4, "action"),
      tag([-3.6, 4], "y = 4", "s"),
      pt([0, 7], "(0, 7)", "e", "result"),
      pt([-1, 5.5], "(−1, 11/2)", "nw"),
    ],
    "g(x) = 3(2)ˣ + 4 has y-intercept (0, 7), passes through (−1, 11/2), and lies above y = 4.",
    "g(x) = 3(2)ˣ + 4 的 y 轴截距点是 (0, 7)，过 (−1, 11/2)，并位于 y = 4 上方。",
  ),
  "vertical-translations-of-exponential-decay-functions#translated-decay-graph-equations": graphed(
    wide(-3, 4, -1, 7),
    [curveOf((x) => (1 / 3) ** x + 1), across(1, "action"), tag([3, 1], "y = 1", "s"), pt([-1, 4], "(−1, 4)", "ne", "result")],
    "y = (1/3)ˣ + 1 falls toward y = 1. At x = −1 the height is 3 + 1 = 4.",
    "y = (1/3)ˣ + 1 下降并趋近 y = 1。在 x = −1 处，高度为 3 + 1 = 4。",
  ),
  "interpreting-graphs-of-exponential-functions#predicting-from-a-graph": graphed(
    wide(-1, 5, -1, 9),
    [
      curveOf((x) => 2 * 1.5 ** x, undefined, 0),
      pt([0, 2], "(0, 2)", "w"),
      pt([1, 3], "(1, 3)", "nw"),
      pt([3, 6.75], "(3, 6.75)", "w", "result"),
      { kind: "segment", a: [1, 3], b: [3, 5], tone: "action", dashed: true },
    ],
    "y = 2(3/2)ˣ through (0, 2) and (1, 3) reaches 6.75 at x = 3, above the dashed straight line that continues the first step, which reaches only 5.",
    "y = 2(3/2)ˣ 过 (0, 2) 和 (1, 3)，在 x = 3 处达到 6.75，高于延续第一步的虚线直线（虚线只到 5）。",
  ),
  "vertical-reflections-of-exponential-functions#reflected-graph-equations": graphed(
    wide(-4, 3, -4, 7),
    [
      curveOf((x) => -(3 ** x) + 5),
      across(5, "action"),
      tag([-2.5, 5], "y = 5", "n"),
      pt([0, 4], "(0, 4)", "e"),
      pt([1, 2], "(1, 2)", "e", "result"),
    ],
    "y = −3ˣ + 5 lies below y = 5: at x = 0 it is at 4, and at x = 1 at 5 − 3 = 2.",
    "y = −3ˣ + 5 位于 y = 5 下方：x = 0 时为 4，x = 1 时为 5 − 3 = 2。",
  ),
  "vertical-reflections-of-exponential-functions#intercepts-of-reflected-graphs": (() => {
    const c = chart({ x: [-3, 3, 1], y: [-10, 20, 5], xName: "x", yName: "y", w: 6, h: 6 });
    return drawing(
      [
        ...c.marks,
        ...traced(c.at, (x) => -2 * 3 ** x + 18, -3, 3, -10, 20),
        seg(c.at(-3, 18), c.at(3, 18), "action", true),
        note(c.at(-2, 18), "y = 18", "n"),
        ...dotAt(c.at(0, 16), "(0, 16)", "e", "result"),
        ...dotAt(c.at(2, 0), "(2, 0)", "ne", "result"),
      ],
      "g(x) = −2(3)ˣ + 18 has y-intercept 18 − 2 = 16 and crosses the x-axis at x = 2, below its asymptote y = 18.",
      "g(x) = −2(3)ˣ + 18 的 y 轴截距为 18 − 2 = 16，在 x = 2 处穿过 x 轴，位于渐近线 y = 18 下方。",
    );
  })(),
  "combining-graph-transformations-of-exponential-functions#describing-exponential-transformations": graphed(
    wide(-5, 3, -6, 6),
    [
      curveOf((x) => 3 ** x, undefined, undefined, undefined, true),
      curveOf((x) => -2 * 3 ** (x + 1) + 4, "result"),
      across(4, "action"),
      tag([-3.5, 4], "y = 4", "n"),
      pt([-1, 2], "(−1, 2)", "w", "result"),
      pt([0, 1], "(0, 1)", "se"),
    ],
    "3ˣ, dashed, shifted 1 left, stretched by 2, reflected and shifted 4 up is g(x) = −2(3)ˣ⁺¹ + 4, below y = 4 and through (−1, 2).",
    "3ˣ（虚线）左移 1、拉伸 2 倍、翻转、上移 4，得到 g(x) = −2(3)ˣ⁺¹ + 4，它在 y = 4 下方并过 (−1, 2)。",
  ),
  "combining-graph-transformations-of-exponential-functions#the-transformed-exponential-from-its-graph": graphed(
    wide(-3, 4, -4, 5),
    [
      curveOf((x) => 3 ** (x - 1) - 2),
      across(-2, "action"),
      tag([-1.8, -2], "y = −2", "s"),
      pt([1, -1], "(1, −1)", "se", "result"),
      pt([2, 1], "(2, 1)", "e", "result"),
    ],
    "A graph above y = −2 through (1, −1), 1 unit from the asymptote, and (2, 1), 3 units from it: g(x) = 3ˣ⁻¹ − 2.",
    "图象在 y = −2 上方，过距渐近线 1 个单位的 (1, −1) 和距渐近线 3 个单位的 (2, 1)：g(x) = 3ˣ⁻¹ − 2。",
  ),
  "properties-of-transformed-exponential-functions#range-of-transformed-exponentials": graphed(
    wide(-8, 1, -7, 3),
    [curveOf((x) => -3 * 2 ** (x + 4) + 1), across(1, "action"), tag([-6.5, 1], "y = 1", "n"), thick([0, -7], [0, 1]), openPt([0, 1])],
    "f(x) = −3(2)ˣ⁺⁴ + 1 lies below y = 1, so its range, marked on the y-axis, is (−∞, 1).",
    "f(x) = −3(2)ˣ⁺⁴ + 1 位于 y = 1 下方，所以它的值域（标在 y 轴上）是 (−∞, 1)。",
  ),
  "properties-of-transformed-exponential-functions#intercepts-of-transformed-exponentials": (() => {
    const c = chart({ x: [-4, 5, 1], y: [-20, 20, 5], xName: "x", yName: "y", w: 7, h: 6 });
    return drawing(
      [
        ...c.marks,
        ...traced(c.at, (x) => 2 * 3 ** (x - 1) - 18, -4, 5, -20, 20),
        seg(c.at(-4, -18), c.at(5, -18), "action", true),
        note(c.at(4, -18), "y = −18", "s"),
        ...dotAt(c.at(0, -52 / 3), undefined, "n", "result"),
        seg(c.at(0, -52 / 3), c.at(-1, -11), "action"),
        note(c.at(-1, -11), "(0, −52/3)", "w"),
        ...dotAt(c.at(3, 0), "(3, 0)", "nw", "result"),
      ],
      "f(x) = 2(3)ˣ⁻¹ − 18 has y-intercept −52/3 and x-intercept 3: its asymptote y = −18 is below the x-axis and the graph goes up.",
      "f(x) = 2(3)ˣ⁻¹ − 18 的 y 轴截距为 −52/3，x 轴截距为 3：渐近线 y = −18 在 x 轴下方，图象向上。",
    );
  })(),
  "combining-graph-transformations-of-logarithmic-functions#equations-of-transformed-logarithms": graphed(
    wide(-4, 6, -5, 4),
    [
      curveOf((x) => log(2, x), undefined, 0.02, 6, true),
      curveOf((x) => log(2, x + 3) - 2, "result", -2.98, 6),
      upright(-3, "action"),
      tag([-3, 3], "x = −3", "e"),
      pt([1, 0], "(1, 0)", "se"),
      pt([-2, -2], "(−2, −2)", "se", "result"),
    ],
    "log₂ x, dashed, moved 3 left and 2 down is g(x) = log₂(x + 3) − 2: the point (1, 0) moves to (−2, −2), and the asymptote to x = −3.",
    "log₂ x（虚线）左移 3、下移 2 得到 g(x) = log₂(x + 3) − 2：点 (1, 0) 移到 (−2, −2)，渐近线移到 x = −3。",
  ),
  "combining-graph-transformations-of-logarithmic-functions#the-transformed-logarithm-from-its-graph": graphed(
    wide(-1, 9, -3, 4),
    [
      curveOf((x) => log(3, x - 2) + 1, undefined, 2.01, 9),
      upright(2, "action"),
      tag([2, 3.4], "x = 2", "e"),
      pt([3, 1], "(3, 1)", "se", "result"),
      pt([5, 2], "(5, 2)", "n", "result"),
    ],
    "With asymptote x = 2, through (3, 1) and (5, 2): g(x) = log₃(x − 2) + 1.",
    "渐近线为 x = 2，并过 (3, 1) 和 (5, 2)：g(x) = log₃(x − 2) + 1。",
  ),
  "properties-of-transformed-logarithmic-functions#direction-of-a-transformed-logarithm": graphed(
    wide(-6, 6, -5, 6),
    [
      curveOf((x) => -2 * log(3, 4 - x), undefined, -6, 3.999),
      upright(4, "action"),
      tag([4, 5], "x = 4", "e"),
      pt([3, 0], "(3, 0)", "nw", "result"),
      pt([1, -2], "(1, −2)", "se", "result"),
    ],
    "f(x) = −2log₃(4 − x) increases as x grows: from (1, −2) to (3, 0), and on toward the asymptote x = 4.",
    "f(x) = −2log₃(4 − x) 随 x 增大而增大：从 (1, −2) 到 (3, 0)，再趋近渐近线 x = 4。",
  ),
  "inverses-of-exponential-and-logarithmic-functions#inverse-of-an-exponential-function": graphed(
    wide(-7, 6, -7, 6),
    [
      mirror,
      curveOf((x) => 3 ** (x + 2) - 5),
      curveOf((x) => log(3, x + 5) - 2, "result", -4.99, 6),
      across(-5),
      upright(-5, "result"),
      tag([3.5, -5], "y = −5", "n"),
      tag([-5, 4.5], "x = −5", "e"),
      pt([-2, -4], "(−2, −4)", "se"),
      pt([-4, -2], "(−4, −2)", "w", "result"),
    ],
    "f(x) = 3ˣ⁺² − 5 and f⁻¹(x) = log₃(x + 5) − 2 are mirror images in y = x: the asymptote y = −5 becomes x = −5, and (−2, −4) becomes (−4, −2).",
    "f(x) = 3ˣ⁺² − 5 与 f⁻¹(x) = log₃(x + 5) − 2 关于 y = x 对称：渐近线 y = −5 变成 x = −5，(−2, −4) 变成 (−4, −2)。",
  ),
  "graph-transformations-of-reciprocal-functions#equations-of-translated-reciprocals": graphed(
    wide(-9, 5, -6, 6),
    [
      ...branches((x) => 2 / x, 0, -9, 5, undefined, true),
      ...branches((x) => 2 / (x + 4) + 1, -4, -9, 5, "result"),
      upright(-4, "action"),
      across(1, "action"),
      tag([-4, 5.2], "x = −4", "w"),
      tag([3.5, 1], "y = 1", "n"),
    ],
    "2/x, dashed, moved 4 left and 1 up is g(x) = 2/(x + 4) + 1, with asymptotes x = −4 and y = 1.",
    "2/x（虚线）左移 4、上移 1 得到 g(x) = 2/(x + 4) + 1，渐近线为 x = −4 和 y = 1。",
  ),
  "combining-graph-transformations-of-reciprocal-functions#moving-points-of-the-reciprocal-graph": graphed(
    wide(-5, 6, -5, 8),
    [
      ...branches((x) => 1 / x, 0, -5, 6, undefined, true),
      ...branches((x) => -4 / (x - 1) + 2, 1, -5, 6, "result"),
      upright(1, "action"),
      across(2, "action"),
      pt([2, 0.5], "(2, ½)", "ne"),
      pt([3, 0], "(3, 0)", "se", "result"),
    ],
    "g(x) = −4/(x − 1) + 2 sends the point (2, ½) of 1/x, dashed, to (3, 0).",
    "g(x) = −4/(x − 1) + 2 把 1/x（虚线）上的点 (2, ½) 变到 (3, 0)。",
  ),
  "combining-graph-transformations-of-reciprocal-functions#functions-from-several-transformations": graphed(
    wide(-4, 8, -8, 5),
    [
      ...branches((x) => 3 / (x - 2) - 1, 2, -4, 8),
      ...branches((x) => 3 / (x - 2) - 3, 2, -4, 8, "result"),
      upright(2),
      across(-1),
      across(-3, "result"),
      tag([6.7, -1], "y = −1", "s"),
      tag([6.5, -3], "y = −3", "s"),
    ],
    "The order matters: 3/(x − 2) − 1 has asymptote y = −1, and 3/(x − 2) − 3, where the stretch comes after the shift down, has y = −3.",
    "顺序很重要：3/(x − 2) − 1 的渐近线是 y = −1；而先下移再拉伸的 3/(x − 2) − 3，渐近线是 y = −3。",
  ),
  "domain-and-range-of-transformed-reciprocal-functions#the-domain-of-a-transformed-reciprocal": graphed(
    wide(-3, 8, -5, 7),
    [
      ...branches((x) => 3 / (2 * x - 5) + 1, 2.5, -3, 8),
      upright(2.5, "action"),
      across(1),
      tag([2.5, 6], "x = 5/2", "e"),
      openPt([2.5, 0]),
    ],
    "f(x) = 3/(2x − 5) + 1 has its vertical asymptote at x = 5/2, the one input missing from the domain.",
    "f(x) = 3/(2x − 5) + 1 的竖直渐近线在 x = 5/2，这是定义域中唯一缺少的输入。",
  ),
  "domain-and-range-of-transformed-reciprocal-functions#the-range-of-a-transformed-reciprocal": graphed(
    wide(-12, 1, -10, 2),
    [...branches((x) => -2 / (x + 6) - 4, -6, -12, 1), upright(-6), across(-4, "action"), tag([-10.5, -4], "y = −4", "n"), openPt([0, -4])],
    "f(x) = −2/(x + 6) − 4 takes every value except −4, the height of its horizontal asymptote.",
    "f(x) = −2/(x + 6) − 4 取到除 −4 以外的所有值，−4 正是水平渐近线的高度。",
  ),
  "domain-and-range-of-transformed-reciprocal-functions#the-range-of-a-quotient-of-linear-expressions": graphed(
    wide(-6, 11, -7, 10),
    [
      ...branches((x) => (2 * x + 1) / (x - 3), 3, -6, 11),
      upright(3),
      across(2, "action"),
      tag([9, 2], "y = 2", "n"),
      tag([3, 9], "x = 3", "e"),
    ],
    "(2x + 1)/(x − 3) = 2 + 7/(x − 3) is 7/(x − 3) moved up 2, so its range leaves out only 2.",
    "(2x + 1)/(x − 3) = 2 + 7/(x − 3) 就是 7/(x − 3) 上移 2，所以值域只缺少 2。",
  ),
  "domain-and-range-of-transformed-reciprocal-functions#the-range-on-a-restricted-domain": graphed(
    wide(-1, 9, -1, 8),
    [
      curveOf((x) => 6 / (x - 1) + 2, undefined, 1.01, 9),
      curveOf((x) => 6 / (x - 1) + 2, "result", 3, 7),
      upright(1),
      across(2),
      pt([3, 5], "(3, 5)", "ne", "result"),
      pt([7, 3], "(7, 3)", "ne", "result"),
    ],
    "f(x) = 6/(x − 1) + 2 on 3 ≤ x ≤ 7, in color, lies on one falling branch, from (3, 5) to (7, 3): the range is [3, 5].",
    "f(x) = 6/(x − 1) + 2 在 3 ≤ x ≤ 7 上（彩色部分）位于一支下降的曲线上，从 (3, 5) 到 (7, 3)：值域为 [3, 5]。",
  ),
  "inverses-of-reciprocal-functions#inverse-formulas": graphed(
    wide(-7, 5, -7, 5),
    [
      mirror,
      ...branches((x) => 6 / (2 * x + 1) - 3, -0.5, -7, 5),
      ...branches((x) => 3 / (x + 3) - 0.5, -3, -7, 5, "result"),
      upright(-3, "result"),
      across(-0.5, "result"),
      upright(-0.5),
      across(-3),
      tag([-3, 4.4], "x = −3", "w"),
      tag([3.8, -3], "y = −3", "s"),
    ],
    "f(x) = 6/(2x + 1) − 3 has the horizontal asymptote y = −3, which is the vertical asymptote x = −3 of its inverse 3/(x + 3) − ½, its mirror image in y = x.",
    "f(x) = 6/(2x + 1) − 3 的水平渐近线 y = −3，正是其反函数 3/(x + 3) − ½ 的竖直渐近线 x = −3；两图象关于 y = x 对称。",
  ),
  "inverses-of-reciprocal-functions#functions-that-are-their-own-inverses": graphed(
    wide(-5, 5, -5, 5),
    [
      mirror,
      ...branches((x) => 1 / x, 0, -5, 5),
      tag([4, 4], "y = x", "nw"),
      pt([2, 0.5], "(2, ½)", "ne", "result"),
      pt([0.5, 2], "(½, 2)", "ne", "result"),
    ],
    "f(x) = 1/x is its own inverse: its center (0, 0) lies on y = x, and swapping the coordinates of (2, ½) gives (½, 2), also on the graph.",
    "f(x) = 1/x 是自身的反函数：中心 (0, 0) 在 y = x 上，交换 (2, ½) 的坐标得到同样在图象上的 (½, 2)。",
  ),
  "finding-intersections-of-lines-and-reciprocal-functions#counting-intersections-with-reciprocals": graphed(
    wide(-6, 6, -6, 6),
    [...branches((x) => 2 / x, 0, -6, 6), ln([0, 1], [1, 0], "action"), tag([3.5, 3], "y = 2/x", "n"), tag([-5.8, 3], "y = −x + 1", "e")],
    "The line y = −x + 1 misses y = 2/x: the discriminant is −7, which is negative.",
    "直线 y = −x + 1 与 y = 2/x 没有交点：判别式为 −7，是负数。",
  ),
  "graphing-the-square-root-function#points-on-the-square-root-graph": (() => {
    const c = chart({ x: [-4, 20, 4], y: [-8, 20, 4], xName: "x", yName: "y", w: 7, h: 7 });
    return drawing(
      [
        ...c.marks,
        ...traced(c.at, Math.sqrt, 0, 20, 0, 5),
        ...dotAt(c.at(16, 4), "(16, 4) ✓", "n", "result"),
        ...dotAt(c.at(16, -4), "(16, −4) ✗", "s", "action"),
        ...dotAt(c.at(4, 16), "(4, 16) ✗", "e", "action"),
      ],
      "y = √x lies on and above the x-axis, to the right of the y-axis: (16, 4) is on it, but (16, −4) and (4, 16) are not.",
      "y = √x 位于 x 轴上及其上方、y 轴右侧：(16, 4) 在图象上，而 (16, −4) 和 (4, 16) 不在。",
    );
  })(),
  "graph-transformations-of-square-root-functions#equations-from-transformations": graphed(
    wide(-6, 5, -2, 6),
    [
      curveOf((x) => Math.sqrt(-x), undefined, -6, 0, true),
      curveOf((x) => 2 * Math.sqrt(3 - x) - 1, "result", -6, 3),
      pt([0, 0], "(0, 0)", "se"),
      pt([3, -1], "(3, −1)", "e", "result"),
      tag([-4.5, 3.5], "y = √(−x)", "s"),
      tag([-3.5, 4.8], "y = 2√(3 − x) − 1", "n"),
    ],
    "y = √(−x), dashed, moved right 3, stretched by 2 and moved down 1 is y = 2√(3 − x) − 1: the endpoint (0, 0) goes to (3, −1).",
    "y = √(−x)（虚线）右移 3、拉伸 2 倍、下移 1 得到 y = 2√(3 − x) − 1：端点 (0, 0) 移到 (3, −1)。",
  ),
  "graph-transformations-of-square-root-functions#equations-from-graphs": graphed(
    wide(-1, 8, -3, 6),
    [
      curveOf((x) => 2 * Math.sqrt(x - 2) - 1, undefined, 2, 8),
      pt([2, -1], "(2, −1)", "w", "result"),
      pt([3, 1], "(3, 1)", "nw", "result"),
      { kind: "segment", a: [2, -1], b: [3, -1], tone: "action", dashed: true },
      { kind: "segment", a: [3, -1], b: [3, 1], tone: "action", dashed: true },
    ],
    "From the endpoint (2, −1), one unit across and 2 up reaches (3, 1): a = 2, so y = 2√(x − 2) − 1.",
    "从端点 (2, −1) 向右 1 个单位、向上 2 个单位到达 (3, 1)：a = 2，所以 y = 2√(x − 2) − 1。",
  ),
  "graph-transformations-of-square-root-functions#the-direction-of-the-graph": graphed(
    wide(-6, 4, -2, 5),
    [curveOf((x) => -Math.sqrt(4 - 2 * x) + 3, undefined, -6, 2), pt([2, 3], "(2, 3)", "ne", "result"), pt([0, 1], "(0, 1)", "se")],
    "y = −√(4 − 2x) + 3 extends from its endpoint (2, 3) to the left and downward, through (0, 1).",
    "y = −√(4 − 2x) + 3 从端点 (2, 3) 向左下方延伸，经过 (0, 1)。",
  ),
  "graphing-the-cube-root-function#points-on-the-cube-root-graph": (() => {
    const c = chart({ x: [-30, 30, 10], y: [-4, 4, 1], xName: "x", yName: "y", w: 8, h: 5 });
    return drawing(
      [
        ...c.marks,
        ...traced(c.at, Math.cbrt, -30, 30, -4, 4),
        ...dotAt(c.at(-27, -3), "(−27, −3) ✓", "s", "result"),
        ...dotAt(c.at(-27, 3), "(−27, 3) ✗", "n", "action"),
        ...dotAt(c.at(9, 3), "(9, 3) ✗", "n", "action"),
      ],
      "y = ∛x runs from the lower left through the origin to the upper right: (−27, −3) is on it, but (−27, 3) and (9, 3) are not.",
      "y = ∛x 从左下方经过原点到右上方：(−27, −3) 在图象上，而 (−27, 3) 和 (9, 3) 不在。",
    );
  })(),
  "graphing-the-cube-root-function#transformed-cube-root-graphs": graphed(
    wide(-8, 6, -2, 8),
    [curveOf((x) => -2 * Math.cbrt(x + 1) + 3), pt([-1, 3], "C(−1, 3)", "sw", "result"), pt([0, 1], "(0, 1)", "ne")],
    "y = −2∛(x + 1) + 3 has its center at (−1, 3). One unit to the right the height is 3 − 2 = 1.",
    "y = −2∛(x + 1) + 3 的中心在 (−1, 3)。向右 1 个单位处，高度为 3 − 2 = 1。",
  ),
  "properties-of-transformed-square-root-functions#the-y-intercept-of-a-square-root-function": graphed(
    wide(-8, 6, -8, 6),
    [curveOf((x) => 3 * Math.sqrt(4 - x) - 7, undefined, -8, 4), pt([0, -1], "(0, −1)", "e", "result"), pt([4, -7], "(4, −7)", "e")],
    "f(x) = 3√(4 − x) − 7 starts at (4, −7) and crosses the y-axis at (0, −1).",
    "f(x) = 3√(4 − x) − 7 从 (4, −7) 出发，在 (0, −1) 穿过 y 轴。",
  ),
  "the-range-of-a-transformed-radical-function#range-from-a-graph": graphed(
    wide(-6, 6, -5, 6),
    [curveOf((x) => -Math.sqrt(x + 4) + 2, undefined, -4, 6), pt([-4, 2], "(−4, 2)", "n", "result"), thick([0, -5], [0, 2])],
    "For example, y = −√(x + 4) + 2 goes down from the endpoint (−4, 2): its range, marked on the y-axis, is (−∞, 2].",
    "例如，y = −√(x + 4) + 2 从端点 (−4, 2) 向下：它的值域（标在 y 轴上）是 (−∞, 2]。",
  ),
  "inverses-of-radical-functions#the-domain-of-the-inverse": graphed(
    wide(-4, 8, -4, 8),
    [
      mirror,
      curveOf((x) => -Math.sqrt(x + 2) + 5, undefined, -2, 8),
      curveOf((x) => (5 - x) ** 2 - 2, "result", 1.9, 5),
      curveOf((x) => (5 - x) ** 2 - 2, undefined, 5, 7.5, true),
      pt([-2, 5], "(−2, 5)", "n"),
      pt([5, -2], "(5, −2)", "ne", "result"),
    ],
    "f(x) = −√(x + 2) + 5 has domain [−2, ∞) and range (−∞, 5]. Its inverse is only the left part of a parabola, with domain (−∞, 5]; the dashed part is not in it.",
    "f(x) = −√(x + 2) + 5 的定义域为 [−2, ∞)，值域为 (−∞, 5]。它的反函数只是抛物线的左半部分，定义域为 (−∞, 5]；虚线部分不属于它。",
  ),
  "finding-intersections-of-lines-and-radical-functions#counting-intersections": drawing(
    (() => {
      const panel = (dx: number, m: number, b: number, label: string, points: readonly Point[]): Mark[] => {
        const c = chart({ x: [-1, 5, 2], y: [-2, 4, 2], xName: "x", yName: "y", w: 3, h: 3 });
        return shift(
          [
            ...c.marks,
            ...traced(c.at, Math.sqrt, 0, 5, -2, 4),
            ...traced(c.at, (x) => m * x + b, -1, 5, -2, 4, "action"),
            ...points.flatMap((p) => dotAt(c.at(p[0], p[1]), undefined, "n", "result")),
            note(c.at(2.5, -2.8), label, "s"),
          ],
          dx,
        );
      };
      return [
        ...panel(0, 1, 1, "y = x + 1: 0", []),
        ...panel(4.6, 1, -2, "y = x − 2: 1", [[4, 2]]),
        ...panel(9.2, 1, 0, "y = x: 2", [
          [0, 0],
          [1, 1],
        ]),
      ];
    })(),
    "For example, y = √x meets y = x + 1 nowhere, y = x − 2 only at (4, 2), and y = x at (0, 0) and (1, 1).",
    "例如，y = √x 与 y = x + 1 无交点，与 y = x − 2 只交于 (4, 2)，与 y = x 交于 (0, 0) 和 (1, 1)。",
  ),
};
