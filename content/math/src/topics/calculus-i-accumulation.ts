import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, poly, Q } from "@ga/subject-math";
import { calculusDrawings3 } from "../explanation-drawings-calculus-3.ts";

import { functionProblem, numberProblem, solutionsProblem, steps } from "../problems.ts";
import { listed, stepLabel } from "../solution-kit.ts";
import { fac, type Poly, par, piLatex, pLatex, table } from "./calculus-common.ts";
import { zigzag, zigzagFigure, zigzagXs } from "./calculus-i-extrema.ts";
import { antiderivativeAt, antiderivativeLatex, qAt } from "./calculus-i-riemann.ts";

// Calculus I unit 8: Integration, modules 8.26 and 8.27.

/** Step is one labelled step of a solution: its title in both languages, what it says, and the lines it displays. */
type Step = readonly [title: readonly [string, string], say: Text, lines?: readonly string[]];

/** walked writes labelled steps, each with its displayed lines, followed by a check that takes a second route. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(
        ([[en, zh], say, lines = []], i) =>
          `${stepLabel(i + 1, en, zh)[locale]} ${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`,
      )
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** fmt writes a value rounded to three decimal places, without trailing zeros. */
const fmt = (v: number) => dec(Q.of(Math.round(v * 1000) || 0, 1000));

/** signed writes a sum of numbers with each sign tidied: "3 + 5 - 2". */
const signed = (terms: readonly (number | Q)[]) =>
  terms
    .map((v, i) => {
      const q = v instanceof Q ? v : Q.of(v);
      return i === 0 ? q.toLatex() : q.sign() < 0 ? ` - ${q.neg().toLatex()}` : ` + ${q.toLatex()}`;
    })
    .join("");

/** lead writes a leading coefficient in front of a product: "", "-", "3". */
const lead = (k: number) => (k === 1 ? "" : k === -1 ? "-" : `${k}`);

/** integral computes ∫ p(x) dx from a to b for integer limits. */
const integral = (p: Poly, a: number, b: number) => antiderivativeAt(p, b).sub(antiderivativeAt(p, a));

/** evaluation writes ∫ p from a to b as the bracketed antiderivative and the difference of its values. */
const evaluation = (p: Poly, a: number, b: number, v = "x") => {
  const [Fa, Fb] = [antiderivativeAt(p, a), antiderivativeAt(p, b)];
  const F = antiderivativeLatex(p);
  return `${int(a, b, `(${pLatex(p, v)})`, v)} = \\Big[${v === "x" ? F : F.replaceAll("x", v)}\\Big]_{${a}}^{${b}} = ${Fb.toLatex()} - ${par(Fa)} = ${Fb.sub(Fa).toLatex()}`;
};

/** rootsPoly expands k(x − r₁)(x − r₂)… into coefficients, constant first. */
function rootsPoly(k: number, roots: readonly number[]): Poly {
  let p = [k];
  for (const r of roots) p = [...p.map((c) => -r * c), 0].map((c, i) => c + (i > 0 ? p[i - 1]! : 0));
  return p;
}

/** rangeOn gives the least and greatest values on [a, b] of a polynomial of degree at most 2, from the endpoints and the vertex. */
function rangeOn(p: Poly, a: number, b: number): readonly [Q, Q] {
  const xs = [Q.of(a), Q.of(b)];
  const c2 = p[2] ?? 0;
  if (c2 !== 0) {
    const h = Q.of(-(p[1] ?? 0), 2 * c2);
    if (h.cmp(Q.of(a)) > 0 && h.cmp(Q.of(b)) < 0) xs.push(h);
  }
  const ys = xs.map((x) => qAt(p, x));
  return [ys.reduce((m, y) => (y.cmp(m) < 0 ? y : m)), ys.reduce((m, y) => (y.cmp(m) > 0 ? y : m))];
}

/** positiveCurve chooses a line or a parabola with integer coefficients that is positive on [a, b]. */
function positiveCurve(rng: Rng, a: number, b: number, line: boolean): Poly {
  if (line) {
    const m = rng.nonZero(-3, 3);
    return [rng.int(1, 5) - Math.min(m * a, m * b), m];
  }
  const k = rng.int(1, 2);
  const h = rng.int(a - 1, b + 1);
  if (rng.bool()) return [k * h * h + rng.int(1, 6), -2 * k * h, k];
  const far = Math.max((a - h) ** 2, (b - h) ** 2);
  return [-k * h * h + k * far + rng.int(1, 6), 2 * k * h, -k];
}

/** boundCheck compares an area with the rectangles below and above the region, given the least and greatest lengths across it. */
function boundCheck(across: readonly [string, string], along: readonly [string, string], lo: Q, hi: Q, w: number, answer: Q): Text {
  const [low, high] = [lo.mul(Q.of(w)), hi.mul(Q.of(w))];
  return t(
    `The ${across[0]} of the region runs from $${lo.toLatex()}$ to $${hi.toLatex()}$ over a ${along[0]} of $${w}$, so the area lies between $${lo.toLatex()} \\cdot ${w}$ and $${hi.toLatex()} \\cdot ${w}$, that is between $${low.toLatex()}$ and $${high.toLatex()}$. The answer $${answer.toLatex()}$ is in that range.`,
    `区域的${across[1]}在 $${lo.toLatex()}$ 到 $${hi.toLatex()}$ 之间，${along[1]}为 $${w}$，所以面积在 $${lo.toLatex()} \\cdot ${w}$ 与 $${hi.toLatex()} \\cdot ${w}$ 之间，即在 $${low.toLatex()}$ 与 $${high.toLatex()}$ 之间。答案 $${answer.toLatex()}$ 在这个范围内。`,
  );
}

/** zigAt evaluates ∫ f from −6 to x for the piecewise linear f through (zigzagXs, ys). */
function zigAt(ys: readonly number[], x: Q): Q {
  let s = Q.zero;
  for (let i = 0; i + 1 < zigzagXs.length; i++) {
    const x0 = Q.of(zigzagXs[i]!);
    if (x.cmp(x0) <= 0) break;
    const h = x.cmp(Q.of(zigzagXs[i + 1]!)) < 0 ? x.sub(x0) : Q.of(2);
    const slope = Q.of(ys[i + 1]! - ys[i]!, 2);
    s = s.add(Q.of(ys[i]!).mul(h)).add(slope.mul(h.mul(h)).div(Q.of(2)));
  }
  return s;
}

/** zigIntegral is ∫ f from a to b for the piecewise linear f through (zigzagXs, ys). */
const zigIntegral = (ys: readonly number[], a: Q, b: Q) => zigAt(ys, b).sub(zigAt(ys, a));

/** Zero is a point where a piecewise linear function changes sign, with the direction of the change. */
interface Zero {
  readonly x: Q;
  /** up is true where the function changes from negative to positive. */
  readonly up: boolean;
}

/** zeros finds the sign changes of the piecewise linear f through (zigzagXs, ys) inside (−6, 6). */
function zeros(ys: readonly number[]): Zero[] {
  const out: Zero[] = [];
  for (let i = 0; i + 1 < ys.length; i++) {
    const [y0, y1] = [ys[i]!, ys[i + 1]!];
    if (y0 * y1 < 0) out.push({ x: Q.of(zigzagXs[i]!).add(Q.of(2 * y0, y0 - y1)), up: y1 > 0 });
    const y2 = ys[i + 2];
    if (y1 === 0 && y2 !== undefined && y0 * y2 < 0) out.push({ x: Q.of(zigzagXs[i + 1]!), up: y2 > 0 });
  }
  return out;
}

/** zigArea is the total area between the piecewise linear f and the x-axis on [a, b]. */
function zigArea(ys: readonly number[], a: Q, b: Q): Q {
  const cuts = [
    a,
    ...zeros(ys)
      .map((z) => z.x)
      .filter((x) => x.cmp(a) > 0 && x.cmp(b) < 0),
    b,
  ];
  return cuts.slice(1).reduce((s, x, i) => s.add(zigIntegral(ys, cuts[i]!, x).abs()), Q.zero);
}

/** nodePair chooses two distinct nodes of the zigzag grid, in increasing order. */
function nodePair(rng: Rng): [number, number] {
  const i = rng.int(0, zigzagXs.length - 2);
  return [zigzagXs[i]!, zigzagXs[rng.int(i + 1, zigzagXs.length - 1)]!];
}

/** trapezoids lists, for the nodes from a to b, each interval of width 2 with its signed area, the sum of its end heights. */
function trapezoids(
  ys: readonly number[],
  a: number,
  b: number,
  name = "f",
  v = "x",
): { readonly lines: string[]; readonly areas: number[] } {
  const lines: string[] = [];
  const areas: number[] = [];
  zigzagXs.forEach((x, i) => {
    if (x < a || x >= b) return;
    const [y0, y1] = [ys[i]!, ys[i + 1]!];
    areas.push(y0 + y1);
    lines.push(`\\int_{${x}}^{${x + 2}} ${name}(${v}) \\, d${v} = \\frac{${y0} + ${par(y1)}}{2} \\cdot 2 = ${y0 + y1}`);
  });
  return { lines, areas };
}

/** aboveBelow splits the signed area of the zigzag on [a, b] into the area above the axis and the area below it. */
function aboveBelow(ys: readonly number[], a: number, b: number): readonly [Q, Q] {
  const total = zigArea(ys, Q.of(a), Q.of(b));
  const net = zigIntegral(ys, Q.of(a), Q.of(b));
  return [total.add(net).div(Q.of(2)), total.sub(net).div(Q.of(2))];
}

/** areaCheck checks a signed area of the zigzag on [a, b] as the area above the axis minus the area below it. */
function areaCheck(ys: readonly number[], a: number, b: number, reversed: boolean): Text {
  const [above, below] = aboveBelow(ys, a, b);
  const net = above.sub(below);
  const end = reversed
    ? t(`, and reversing the limits gives $${net.neg().toLatex()}$`, `，交换上下限得 $${net.neg().toLatex()}$`)
    : t("", "");
  return t(
    `Measure the two kinds of area instead. From $x = ${a}$ to $x = ${b}$ the region above the $x$-axis has area $${above.toLatex()}$ and the region below it has area $${below.toLatex()}$. The integral is $${above.toLatex()} - ${below.toLatex()}$, which is $${net.toLatex()}$${end.en}.`,
    `换一种方法，分别求两类面积。从 $x = ${a}$ 到 $x = ${b}$，$x$ 轴上方的区域面积为 $${above.toLatex()}$，下方的区域面积为 $${below.toLatex()}$。积分等于 $${above.toLatex()} - ${below.toLatex()}$，即 $${net.toLatex()}$${end["zh-CN"]}。`,
  );
}

/** xsAt lists points as separate spans, "$x = 1$, $x = 2$ and $x = 3$", so that no span holds a long list. */
const xsAt = (xs: readonly (string | number)[]) => listed(xs.map((x) => `$x = ${x}$`));

/** int writes ∫ from a to b of a body. */
const int = (a: number | string, b: number | string, body: string, v = "x") => `\\int_{${a}}^{${b}} ${body} \\, d${v}`;

/** theAreaBoundedByACurveAndTheXAxis finds areas above and below the x-axis. */
export const theAreaBoundedByACurveAndTheXAxis: TopicDef = {
  id: "the-area-bounded-by-a-curve-and-the-x-axis",
  title: t("The Area Bounded by a Curve and the X-Axis", "曲线与 x 轴围成的面积"),
  summary: t(
    "Find areas between a curve and the x-axis, including regions below the axis.",
    "求曲线与 x 轴之间的面积，包括位于 x 轴下方的区域。",
  ),
  prerequisites: ["the-fundamental-theorem-of-calculus"],
  encompasses: [{ topic: "the-fundamental-theorem-of-calculus", weight: 0.5 }],
  xp: 10,
  standards: [],
  intro: t(
    `The fundamental theorem evaluates $\\int_{0}^{2} 3x^{2} \\, dx = \\Big[x^{3}\\Big]_{0}^{2} = 8$. Since $3x^{2} \\ge 0$, this number is the area of the region between the curve $y = 3x^{2}$ and the $x$-axis from $x = 0$ to $x = 2$.

Check: the curve bends upward, so it lies below the chord from $(0, 0)$ to $(2, 12)$. The triangle under that chord has area $\\frac{1}{2} \\cdot 2 \\cdot 12$, which is $12$, and $8$ is less than $12$, as it should be.

In this lesson we find areas of regions above the $x$-axis with an integral, and areas of regions below it from the absolute value of the integral.`,
    `由基本定理，$\\int_{0}^{2} 3x^{2} \\, dx = \\Big[x^{3}\\Big]_{0}^{2} = 8$。由于 $3x^{2} \\ge 0$，这个数就是曲线 $y = 3x^{2}$ 与 $x$ 轴之间从 $x = 0$ 到 $x = 2$ 的区域面积。

检验：曲线向上弯，所以它位于从 $(0, 0)$ 到 $(2, 12)$ 的弦的下方。弦下方的三角形面积为 $\\frac{1}{2} \\cdot 2 \\cdot 12$，即 $12$，而 $8$ 小于 $12$，符合预期。

这节课我们用积分求 $x$ 轴上方区域的面积，用积分的绝对值求 $x$ 轴下方区域的面积。`,
  ),
  knowledgePoints: [
    {
      id: "areas-above-the-x-axis",
      title: t("Areas above the x-axis", "x 轴上方的面积"),
      explanation: t(
        "If $f(x) \\ge 0$ on $[a, b]$, the area of the region bounded by $y = f(x)$, the $x$-axis and the lines $x = a$ and $x = b$ is $\\int_{a}^{b} f(x) \\, dx$. For example, the area under $y = x + 1$ from $x = 0$ to $x = 2$ is $\\int_{0}^{2} (x + 1) \\, dx = \\Big[\\frac{x^{2}}{2} + x\\Big]_{0}^{2} = 4$.\n\nCheck: the region is a trapezoid with parallel sides $1$ and $3$ and width $2$, so its area is $\\frac{1 + 3}{2} \\cdot 2$, which is $4$.\n\n> **Watch out.** First check that the curve stays above the axis on the whole interval. If part of it dips below, the integral is no longer the area.",
        "若在 $[a, b]$ 上 $f(x) \\ge 0$，则由 $y = f(x)$、$x$ 轴及直线 $x = a$、$x = b$ 围成的区域面积为 $\\int_{a}^{b} f(x) \\, dx$。例如，$y = x + 1$ 下方从 $x = 0$ 到 $x = 2$ 的面积为 $\\int_{0}^{2} (x + 1) \\, dx = \\Big[\\frac{x^{2}}{2} + x\\Big]_{0}^{2} = 4$。\n\n检验：这个区域是平行边为 $1$ 和 $3$、宽为 $2$ 的梯形，面积为 $\\frac{1 + 3}{2} \\cdot 2$，即 $4$。\n\n> **注意。** 先确认曲线在整个区间上都在 $x$ 轴上方。如果有一部分落到轴下方，积分就不再是面积。",
      ),
      generate(rng) {
        const a = rng.int(-3, 2);
        const b = a + rng.int(1, 4);
        const line = rng.bool(0.4);
        const p = positiveCurve(rng, a, b, line);
        const answer = integral(p, a, b);
        const [lo, hi] = rangeOn(p, a, b);
        return numberProblem({
          prompt: t(
            `Find the area of the region bounded by $y = ${pLatex(p)}$, the $x$-axis, and the lines $x = ${a}$ and $x = ${b}$.`,
            `求由 $y = ${pLatex(p)}$、$x$ 轴及直线 $x = ${a}$、$x = ${b}$ 围成的区域面积。`,
          ),
          answer,
          wrong: [antiderivativeAt(p, b), answer.neg(), qAt(p, Q.of(b)).sub(qAt(p, Q.of(a)))],
          solution: walked(
            [
              [
                ["Check the sign of the curve", "检查曲线的符号"],
                t(
                  `On $[${a}, ${b}]$ the least value of $y = ${pLatex(p)}$, found at ${line ? "an endpoint" : "the endpoints and the vertex"}, is $${lo.toLatex()}$. It is positive, so the region lies above the $x$-axis and its area is the integral.`,
                  `在 $[${a}, ${b}]$ 上，$y = ${pLatex(p)}$ 的最小值（${line ? "在端点处取得" : "比较端点和顶点得到"}）是 $${lo.toLatex()}$。它是正数，所以区域位于 $x$ 轴上方，面积就是积分。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t("Take an antiderivative and subtract its values at the limits:", "取一个原函数，代入上下限相减："),
                [evaluation(p, a, b)],
              ],
            ],
            boundCheck(["height", "高"], ["width", "宽"], lo, hi, b - a, answer),
          ),
        });
      },
    },
    {
      id: "areas-below-the-x-axis",
      title: t("Areas below the x-axis", "x 轴下方的面积"),
      explanation: t(
        "Where $f(x) \\le 0$, the integral is negative: it is minus the area. So the area between the curve and the axis is $-\\int_{a}^{b} f(x) \\, dx = \\left|\\int_{a}^{b} f(x) \\, dx\\right|$. For a region enclosed by a curve and the axis, the limits are the $x$-intercepts. For example, $y = x^{2} - 1$ is below the axis between its roots $-1$ and $1$, and $\\int_{-1}^{1} (x^{2} - 1) \\, dx = -\\frac{4}{3}$, so the area is $\\frac{4}{3}$.\n\nCheck: Archimedes showed that the region between a parabola and a line across it is two thirds of the rectangle that holds it. Here the rectangle has width $2$ and depth $1$, and two thirds of $2$ is $\\frac{4}{3}$.\n\n> **Watch out.** An area is never negative. Do not give the negative integral as the area: take its absolute value.",
        "在 $f(x) \\le 0$ 的地方，积分为负，等于面积的相反数。所以曲线与 $x$ 轴之间的面积是 $-\\int_{a}^{b} f(x) \\, dx = \\left|\\int_{a}^{b} f(x) \\, dx\\right|$。对于曲线与 $x$ 轴围成的区域，积分限就是 $x$ 截距。例如，$y = x^{2} - 1$ 在它的两个根 $-1$ 和 $1$ 之间位于 $x$ 轴下方，且 $\\int_{-1}^{1} (x^{2} - 1) \\, dx = -\\frac{4}{3}$，所以面积为 $\\frac{4}{3}$。\n\n检验：阿基米德证明了，抛物线与一条横穿它的直线之间的区域，面积是包住它的矩形的三分之二。这里矩形宽为 $2$、深为 $1$，$2$ 的三分之二是 $\\frac{4}{3}$。\n\n> **注意。** 面积永远不是负数。不要把负的积分当作面积，要取它的绝对值。",
      ),
      generate(rng) {
        const r1 = rng.int(-4, 2);
        const d = rng.int(1, 5);
        const r2 = r1 + d;
        const k = rng.nonZero(-3, 3);
        const p = rootsPoly(k, [r1, r2]);
        const net = integral(p, r1, r2);
        const answer = net.abs();
        const depth = Q.of(Math.abs(k) * d * d, 4);
        const mid = Q.of(r1 + r2, 2);
        return numberProblem({
          prompt: t(
            `Find the area of the region enclosed by $y = ${pLatex(p)}$ and the $x$-axis.`,
            `求 $y = ${pLatex(p)}$ 与 $x$ 轴围成的区域面积。`,
          ),
          answer,
          wrong: [net.neg(), answer.mul(Q.of(2)), Q.of(d ** 3, 6), net],
          solution: walked(
            [
              [
                ["Find where the curve meets the axis", "求曲线与 x 轴的交点"],
                t(
                  `The curve is zero at $x = ${r1}$ and $x = ${r2}$, and between them it is ${k > 0 ? "below" : "above"} the axis. Factoring shows the roots:`,
                  `曲线在 $x = ${r1}$ 和 $x = ${r2}$ 处为零，在两者之间位于 $x$ 轴${k > 0 ? "下方" : "上方"}。因式分解可以看出这两个根：`,
                ),
                [`${pLatex(p)} = ${lead(k)}${fac(r1)}${fac(r2)}`],
              ],
              [
                ["Integrate between the roots", "在两根之间积分"],
                t("The intercepts are the limits:", "截距就是积分限："),
                [evaluation(p, r1, r2)],
              ],
              [
                ["Take the absolute value", "取绝对值"],
                k > 0
                  ? t(
                      `The region is below the axis, so the integral is negative. The area is its absolute value, $${answer.toLatex()}$.`,
                      `区域在 $x$ 轴下方，所以积分为负。面积是它的绝对值 $${answer.toLatex()}$。`,
                    )
                  : t(
                      `The region is above the axis, so the integral is already positive, and the area is $${answer.toLatex()}$.`,
                      `区域在 $x$ 轴上方，所以积分已经是正数，面积为 $${answer.toLatex()}$。`,
                    ),
              ],
            ],
            t(
              `The region is two thirds of the rectangle that holds it. The rectangle has width $${d}$ and depth $${depth.toLatex()}$, the distance from the axis to the vertex at $x = ${mid.toLatex()}$. Two thirds of $${d} \\cdot ${depth.toLatex()}$ is $${answer.toLatex()}$.`,
              `这个区域是包住它的矩形的三分之二。矩形宽为 $${d}$，深为 $${depth.toLatex()}$，即 $x$ 轴到顶点 $x = ${mid.toLatex()}$ 处的距离。$${d} \\cdot ${depth.toLatex()}$ 的三分之二是 $${answer.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** oddParts are odd functions whose antiderivatives the learner cannot find yet. */
const oddParts = ["x^{3}\\cos x", "\\frac{x}{1 + x^{2}}", "\\sin x", "x^{5}e^{x^{2}}", "\\frac{\\sin x}{x^{2} + 4}", "x\\cos(x^{2})"];

/** evaluatingDefiniteIntegralsUsingSymmetry uses odd and even symmetry on symmetric intervals. */
export const evaluatingDefiniteIntegralsUsingSymmetry: TopicDef = {
  id: "evaluating-definite-integrals-using-symmetry",
  title: t("Evaluating Definite Integrals Using Symmetry", "利用对称性计算定积分"),
  summary: t("Integrate odd and even functions over intervals symmetric about zero.", "在关于零对称的区间上积分奇函数和偶函数。"),
  prerequisites: ["the-area-bounded-by-a-curve-and-the-x-axis", "properties-of-definite-integrals-involving-the-limits-of-integration"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `The area under $y = x^{2}$ from $0$ to $2$ is $\\int_{0}^{2} x^{2} \\, dx = \\frac{8}{3}$. The graph of $x^{2}$ is its own mirror image across the $y$-axis, so the area from $-2$ to $0$ is also $\\frac{8}{3}$, and the integral from $-2$ to $2$ is twice as much, $\\frac{16}{3}$.

Check: with the antiderivative, $\\Big[\\frac{x^{3}}{3}\\Big]_{-2}^{2}$ is $\\frac{8}{3} - \\left(-\\frac{8}{3}\\right)$, which is $\\frac{16}{3}$.

In this lesson we use odd and even symmetry to evaluate integrals over intervals centered at $0$, including integrals of functions we cannot integrate yet.`,
    `$y = x^{2}$ 下方从 $0$ 到 $2$ 的面积为 $\\int_{0}^{2} x^{2} \\, dx = \\frac{8}{3}$。$x^{2}$ 的图像关于 $y$ 轴对称，所以从 $-2$ 到 $0$ 的面积也是 $\\frac{8}{3}$，从 $-2$ 到 $2$ 的积分是它的两倍，即 $\\frac{16}{3}$。

检验：用原函数，$\\Big[\\frac{x^{3}}{3}\\Big]_{-2}^{2}$ 等于 $\\frac{8}{3} - \\left(-\\frac{8}{3}\\right)$，即 $\\frac{16}{3}$。

这节课我们利用奇偶对称性计算关于 $0$ 对称的区间上的积分，其中包括我们还不会求原函数的函数。`,
  ),
  knowledgePoints: [
    {
      id: "odd-and-even-integrands",
      title: t("Odd and even integrands", "奇被积函数与偶被积函数"),
      explanation: t(
        "On $[-a, a]$ the areas of an odd function cancel, and those of an even function match:\n\n$$f \\text{ odd}: \\int_{-a}^{a} f(x) \\, dx = 0$$\n\n$$f \\text{ even}: \\int_{-a}^{a} f(x) \\, dx = 2\\int_{0}^{a} f(x) \\, dx$$\n\nThis evaluates the odd part of an integrand even when it has no antiderivative you can find. For example, in $\\int_{-1}^{1} (x^{3}\\cos x + 3) \\, dx$ the term $x^{3}\\cos x$ is odd and contributes $0$, and the constant contributes $2 \\cdot 3$, so the integral is $6$.\n\nCheck: replacing $x$ by $-x$ turns $x^{3}\\cos x$ into $-x^{3}\\cos x$, so that term is odd, and the constant $3$ alone integrates to $3 \\cdot 2$ over the interval of width $2$.\n\n> **Watch out.** The interval must be centered at $0$. On $[0, 2]$, for instance, an odd function's integral need not be $0$.",
        "在 $[-a, a]$ 上，奇函数的面积相互抵消，偶函数的面积左右相等：\n\n$$f \\text{ 为奇函数}: \\int_{-a}^{a} f(x) \\, dx = 0$$\n\n$$f \\text{ 为偶函数}: \\int_{-a}^{a} f(x) \\, dx = 2\\int_{0}^{a} f(x) \\, dx$$\n\n即使被积函数的奇部分没有能求出的原函数，也可以这样计算。例如，在 $\\int_{-1}^{1} (x^{3}\\cos x + 3) \\, dx$ 中，$x^{3}\\cos x$ 是奇函数，贡献 $0$，常数贡献 $2 \\cdot 3$，所以积分为 $6$。\n\n检验：把 $x$ 换成 $-x$，$x^{3}\\cos x$ 变成 $-x^{3}\\cos x$，所以这一项是奇函数；常数 $3$ 在宽为 $2$ 的区间上的积分是 $3 \\cdot 2$。\n\n> **注意。** 区间必须以 $0$ 为中心。例如在 $[0, 2]$ 上，奇函数的积分不一定是 $0$。",
      ),
      generate(rng) {
        const odd = rng.pick(oddParts);
        const k = rng.nonZero(-5, 5);
        const a = rng.int(1, 4);
        const even: Poly = rng.bool(0.25) ? [0] : [rng.int(-6, 6), 0, rng.int(-3, 3) || 1];
        const evenL = pLatex(even);
        const answer = integral(even, -a, a);
        const tail = evenL === "0" ? "" : evenL.startsWith("-") ? ` - ${evenL.slice(1)}` : ` + ${evenL}`;
        const body = `\\left(${lead(k)}${odd}${tail}\\right)`;
        const oddWhy = t(`$${odd}$ is odd: replacing $x$ by $-x$ changes its sign.`, `$${odd}$ 是奇函数：把 $x$ 换成 $-x$，它变号。`);
        const solution =
          evenL === "0"
            ? walked(
                [
                  [["Check the symmetry", "检查对称性"], oddWhy],
                  [
                    ["Use the symmetry", "利用对称性"],
                    t(
                      `An odd function integrates to $0$ over an interval centered at $0$, so $${int(-a, a, body)} = 0$.`,
                      `奇函数在以 $0$ 为中心的区间上积分为 $0$，所以 $${int(-a, a, body)} = 0$。`,
                    ),
                  ],
                ],
                t(
                  `Pair each $x$ in $(0, ${a}]$ with $-x$. The values of the integrand there are opposite, so each thin strip on the right has a strip of the same area on the left, on the other side of the axis. The strips cancel in pairs, leaving $0$.`,
                  `把 $(0, ${a}]$ 中的每个 $x$ 与 $-x$ 配对。被积函数在这两点的值互为相反数，所以右边每一条窄条在左边都有一条面积相同、位于轴另一侧的窄条。它们两两抵消，结果为 $0$。`,
                ),
              )
            : walked(
                [
                  [
                    ["Split into odd and even parts", "分成奇部分和偶部分"],
                    t(`${oddWhy.en} The rest, $${evenL}$, is even.`, `${oddWhy["zh-CN"]}其余部分 $${evenL}$ 是偶函数。`),
                  ],
                  [
                    ["Integrate each part", "分别积分"],
                    t(
                      `The odd part contributes $0$. The even part gives twice its integral over $[0, ${a}]$:`,
                      `奇部分贡献 $0$。偶部分等于它在 $[0, ${a}]$ 上积分的两倍：`,
                    ),
                    [`2${int(0, a, `(${evenL})`)} = 2\\Big[${antiderivativeLatex(even)}\\Big]_{0}^{${a}} = ${answer.toLatex()}`],
                  ],
                ],
                t(
                  `Integrate the even part over the whole interval instead:\n\n$$${evaluation(even, -a, a)}$$\n\nThe odd part adds nothing, so the integral is $${answer.toLatex()}$ again.`,
                  `改为在整个区间上积分偶部分：\n\n$$${evaluation(even, -a, a)}$$\n\n奇部分不贡献任何值，所以积分仍是 $${answer.toLatex()}$。`,
                ),
              );
        return numberProblem({
          prompt: t(`Evaluate $${int(-a, a, body)}$.`, `计算 $${int(-a, a, body)}$。`),
          answer,
          wrong: [answer.div(Q.of(2)), Q.zero, integral(even, 0, a).neg(), answer.add(Q.of(2 * k))],
          solution,
        });
      },
    },
    {
      id: "using-symmetry-with-known-integrals",
      figure: calculusDrawings3["evaluating-definite-integrals-using-symmetry#using-symmetry-with-known-integrals"],
      title: t("Using symmetry with known integrals", "结合已知积分利用对称性"),
      explanation: t(
        "An even function has a graph symmetric about the vertical axis, so both halves have equal area, while for an odd function the two halves cancel. If $\\int_{0}^{a} f(x) \\, dx = P$, then for even $f$, $\\int_{-a}^{0} f(x) \\, dx = P$ and $\\int_{-a}^{a} f(x) \\, dx = 2P$; for odd $f$, $\\int_{-a}^{0} f(x) \\, dx = -P$ and $\\int_{-a}^{a} f(x) \\, dx = 0$. For example, if $f$ is even and $\\int_{0}^{3} f(x) \\, dx = 5$, then $\\int_{-3}^{3} f(x) \\, dx = 10$.\n\nCheck: the even function $x^{2}$ has $\\int_{0}^{3} x^{2} \\, dx = 9$ and $\\int_{-3}^{3} x^{2} \\, dx = 18$, twice as much.\n\n> **Watch out.** For an odd function the half on $[-a, 0]$ is $-P$, not $P$. Its graph is turned half a revolution about the origin, which puts that half on the other side of the axis.",
        "偶函数的图像关于纵轴对称，所以两半面积相等；而奇函数的两半相互抵消。若 $\\int_{0}^{a} f(x) \\, dx = P$，则当 $f$ 为偶函数时，$\\int_{-a}^{0} f(x) \\, dx = P$，$\\int_{-a}^{a} f(x) \\, dx = 2P$；当 $f$ 为奇函数时，$\\int_{-a}^{0} f(x) \\, dx = -P$，$\\int_{-a}^{a} f(x) \\, dx = 0$。例如，若 $f$ 是偶函数且 $\\int_{0}^{3} f(x) \\, dx = 5$，则 $\\int_{-3}^{3} f(x) \\, dx = 10$。\n\n检验：偶函数 $x^{2}$ 满足 $\\int_{0}^{3} x^{2} \\, dx = 9$，$\\int_{-3}^{3} x^{2} \\, dx = 18$，正好是两倍。\n\n> **注意。** 对奇函数，$[-a, 0]$ 上的一半是 $-P$，不是 $P$。它的图像绕原点转了半圈，这一半落到了轴的另一侧。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const P = rng.nonZero(-15, 15);
        const isEven = rng.bool();
        const whole = rng.bool();
        const half = isEven ? P : -P;
        const answer = whole ? half + P : half;
        const ask = whole ? int(-a, a, "f(x)") : int(-a, 0, "f(x)");
        const upper = whole ? a : 0;
        const width = whole ? 2 * a : a;
        const c = Q.of(P, a);
        const slope = Q.of(2 * P, a * a);
        return numberProblem({
          prompt: t(
            `$f$ is an ${isEven ? "even" : "odd"} function with $${int(0, a, "f(x)")} = ${P}$. Find $${ask}$.`,
            `$f$ 是${isEven ? "偶" : "奇"}函数，且 $${int(0, a, "f(x)")} = ${P}$。求 $${ask}$。`,
          ),
          answer,
          wrong: [2 * P, 0, P, -P, -2 * P],
          solution: walked(
            [
              [
                ["Use the symmetry", "利用对称性"],
                isEven
                  ? t(
                      `The graph of an even function is symmetric about the $y$-axis, so the signed area on $[-${a}, 0]$ matches the one on $[0, ${a}]$: $${int(-a, 0, "f(x)")} = ${P}$.`,
                      `偶函数的图像关于 $y$ 轴对称，所以 $[-${a}, 0]$ 上的有向面积与 $[0, ${a}]$ 上的相等：$${int(-a, 0, "f(x)")} = ${P}$。`,
                    )
                  : t(
                      `The graph of an odd function is symmetric about the origin, so the signed area on $[-${a}, 0]$ is the negative of the one on $[0, ${a}]$: $${int(-a, 0, "f(x)")} = ${-P}$.`,
                      `奇函数的图像关于原点对称，所以 $[-${a}, 0]$ 上的有向面积是 $[0, ${a}]$ 上的相反数：$${int(-a, 0, "f(x)")} = ${-P}$。`,
                    ),
              ],
              whole
                ? [
                    ["Add the two halves", "把两半相加"],
                    t(
                      `$${ask} = ${int(-a, 0, "f(x)")} + ${int(0, a, "f(x)")} = ${signed([half, P])} = ${answer}$.`,
                      `$${ask} = ${int(-a, 0, "f(x)")} + ${int(0, a, "f(x)")} = ${signed([half, P])} = ${answer}$。`,
                    ),
                  ]
                : [
                    ["Read off the answer", "得出答案"],
                    t(
                      `The integral asked for is exactly this half, so $${ask} = ${answer}$.`,
                      `所求的积分正是这一半，所以 $${ask} = ${answer}$。`,
                    ),
                  ],
            ],
            isEven
              ? t(
                  `Try a concrete even function with the same data. The constant function $f(x) = ${c.toLatex()}$ is even, and its integral over $[0, ${a}]$ is the rectangle $${c.toLatex()} \\cdot ${a}$, which is $${P}$. Over $[-${a}, ${upper}]$ it is $${c.toLatex()} \\cdot ${width}$, which is $${answer}$.`,
                  `用一个满足同样条件的具体偶函数验证。常数函数 $f(x) = ${c.toLatex()}$ 是偶函数，它在 $[0, ${a}]$ 上的积分是矩形面积 $${c.toLatex()} \\cdot ${a}$，即 $${P}$。在 $[-${a}, ${upper}]$ 上，它的积分是 $${c.toLatex()} \\cdot ${width}$，即 $${answer}$。`,
                )
              : t(
                  `Try a concrete odd function with the same data. Under $f(x) = ${poly([slope, "x"])}$ on $[0, ${a}]$ lies a triangle of signed area $\\frac{1}{2} \\cdot ${a} \\cdot ${par(slope.mul(Q.of(a)))}$, which is $${P}$. On $[-${a}, 0]$ the triangle is on the other side of the axis, with signed area $${-P}$${whole ? `, and the two add to $0$` : ""}.`,
                  `用一个满足同样条件的具体奇函数验证。$f(x) = ${poly([slope, "x"])}$ 在 $[0, ${a}]$ 上方围成一个有向面积为 $\\frac{1}{2} \\cdot ${a} \\cdot ${par(slope.mul(Q.of(a)))}$ 的三角形，即 $${P}$。在 $[-${a}, 0]$ 上，三角形在轴的另一侧，有向面积为 $${-P}$${whole ? `，两者相加为 $0$` : ""}。`,
                ),
          ),
        });
      },
    },
  ],
};

/** findingTheAreaBetweenACurveAndTheXAxisWhenTheyIntersect splits an integral at the x-intercepts. */
export const findingTheAreaBetweenACurveAndTheXAxisWhenTheyIntersect: TopicDef = {
  id: "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect",
  title: t("Finding the Area Between a Curve and the X-Axis When They Intersect", "曲线与 x 轴相交时求两者之间的面积"),
  summary: t("Split the interval at the x-intercepts and add the areas of the pieces.", "在 x 截距处拆分区间，再把各部分的面积相加。"),
  prerequisites: ["the-area-bounded-by-a-curve-and-the-x-axis", "integrating-trigonometric-functions"],
  encompasses: [{ topic: "the-area-bounded-by-a-curve-and-the-x-axis", weight: 0.5 }],
  xp: 10,
  standards: [],
  intro: t(
    `We know that area below the $x$-axis makes an integral negative. For $y = x$ on $[-1, 2]$:

$$\\int_{-1}^{2} x \\, dx = \\Big[\\frac{x^{2}}{2}\\Big]_{-1}^{2} = \\frac{3}{2}$$

But the line crosses the axis at $0$. The triangle on $[0, 2]$ has area $2$ and the one on $[-1, 0]$ has area $\\frac{1}{2}$, so the total area is $\\frac{5}{2}$, not $\\frac{3}{2}$.

Check: the integral is the difference of the two areas, $2 - \\frac{1}{2}$, while the total area is their sum, $2 + \\frac{1}{2}$.

In this lesson we split an interval at the $x$-intercepts to find total areas, for polynomials and for sine and cosine curves.`,
    `我们知道，$x$ 轴下方的面积会让积分变成负数。对 $y = x$，在 $[-1, 2]$ 上：

$$\\int_{-1}^{2} x \\, dx = \\Big[\\frac{x^{2}}{2}\\Big]_{-1}^{2} = \\frac{3}{2}$$

但这条直线在 $0$ 处穿过 $x$ 轴。$[0, 2]$ 上的三角形面积为 $2$，$[-1, 0]$ 上的三角形面积为 $\\frac{1}{2}$，所以总面积是 $\\frac{5}{2}$，不是 $\\frac{3}{2}$。

检验：积分是两块面积之差 $2 - \\frac{1}{2}$，而总面积是它们之和 $2 + \\frac{1}{2}$。

这节课我们在 $x$ 截距处拆分区间，求多项式曲线以及正弦、余弦曲线与 $x$ 轴之间的总面积。`,
  ),
  knowledgePoints: [
    {
      id: "total-area-across-intercepts",
      title: t("Total area across intercepts", "跨越截距的总面积"),
      explanation: t(
        "The integral counts area below the axis as negative, so it can be much smaller than the total area. To find the total area, find where the curve crosses the axis, integrate on each piece, and add the absolute values. For example, $y = x^{2} - 1$ on $[0, 2]$ crosses the axis at $x = 1$. The pieces are $\\int_{0}^{1} (x^{2} - 1) \\, dx = -\\frac{2}{3}$ and $\\int_{1}^{2} (x^{2} - 1) \\, dx = \\frac{4}{3}$, so the total area is $\\frac{2}{3} + \\frac{4}{3}$, which is $2$.\n\nCheck: the signed pieces add up to $\\frac{2}{3}$, and directly $\\int_{0}^{2} (x^{2} - 1) \\, dx$ is $\\frac{8}{3} - 2$, also $\\frac{2}{3}$.\n\n> **Watch out.** Take the absolute value of each piece, not of the whole integral. The absolute value of the whole integral lets the pieces cancel first.",
        "积分把 $x$ 轴下方的面积算作负数，所以它可能比总面积小得多。求总面积时，先找出曲线与 $x$ 轴的交点，在每一段上分别积分，再把绝对值相加。例如，$y = x^{2} - 1$ 在 $[0, 2]$ 上于 $x = 1$ 处穿过 $x$ 轴。两段积分为 $\\int_{0}^{1} (x^{2} - 1) \\, dx = -\\frac{2}{3}$ 和 $\\int_{1}^{2} (x^{2} - 1) \\, dx = \\frac{4}{3}$，所以总面积为 $\\frac{2}{3} + \\frac{4}{3}$，即 $2$。\n\n检验：两段有向积分之和为 $\\frac{2}{3}$，而直接计算 $\\int_{0}^{2} (x^{2} - 1) \\, dx$ 得 $\\frac{8}{3} - 2$，也是 $\\frac{2}{3}$。\n\n> **注意。** 要对每一段取绝对值，而不是对整个积分取绝对值。对整个积分取绝对值，会让各段先相互抵消。",
      ),
      generate(rng) {
        const cubic = rng.bool(0.3);
        const r0 = cubic ? rng.int(-3, -1) : rng.int(-4, 2);
        const roots = cubic ? [r0, 0, rng.int(1, 3)] : [r0, r0 + rng.int(1, 4)];
        const k = rng.nonZero(-2, 2);
        const p = rootsPoly(k, roots);
        const a = r0 - rng.int(1, 2);
        const b = rng.int(r0 + 1, roots.at(-1)! + 2);
        const inside = roots.filter((r) => r > a && r < b);
        const cuts = [a, ...inside, b];
        const pieces = cuts.slice(1).map((x, i) => integral(p, cuts[i]!, x));
        const answer = pieces.reduce((s, q) => s.add(q.abs()), Q.zero);
        const net = integral(p, a, b);
        return numberProblem({
          prompt: t(
            `Find the total area between $y = ${pLatex(p)}$ and the $x$-axis from $x = ${a}$ to $x = ${b}$.`,
            `求 $y = ${pLatex(p)}$ 与 $x$ 轴之间从 $x = ${a}$ 到 $x = ${b}$ 的总面积。`,
          ),
          answer,
          wrong: [net, net.abs(), pieces[0]!.abs()],
          solution: walked(
            [
              [
                ["Find where the curve crosses the axis", "求曲线与 x 轴的交点"],
                t(`Factoring shows where the curve is zero:`, `因式分解可以看出曲线在哪里为零：`),
                [`${pLatex(p)} = ${lead(k)}${roots.map((r) => fac(r)).join("")}`],
              ],
              [
                ["Integrate on each piece", "在每一段上积分"],
                t(
                  `The zeros inside $(${a}, ${b})$ are ${xsAt(inside).en}. On each piece between them the curve keeps one sign:`,
                  `在 $(${a}, ${b})$ 内的零点是 ${xsAt(inside)["zh-CN"]}。在它们分出的每一段上，曲线的符号不变：`,
                ),
                pieces.map((q, i) => `${int(cuts[i]!, cuts[i + 1]!, `(${pLatex(p)})`)} = ${q.toLatex()}`),
              ],
              [
                ["Add the absolute values", "把绝对值相加"],
                t("Area counts as positive on every piece:", "每一段的面积都按正数计："),
                [`${pieces.map((q) => q.abs().toLatex()).join(" + ")} = ${answer.toLatex()}`],
              ],
            ],
            t(
              `The signed pieces add up to $${net.toLatex()}$, and the integral over the whole interval gives the same value:\n\n$$${evaluation(p, a, b)}$$`,
              `各段有向积分之和为 $${net.toLatex()}$，与整个区间上的积分相同：\n\n$$${evaluation(p, a, b)}$$`,
            ),
          ),
        });
      },
    },
    {
      id: "total-area-under-sine-and-cosine-curves",
      title: t("Total area under sine and cosine curves", "正弦、余弦曲线与 x 轴之间的总面积"),
      explanation: t(
        "Sine and cosine cross the axis again and again, so over a long interval their integral cancels: $\\int_{0}^{2\\pi} \\sin x \\, dx = 0$, although the curve encloses area. Split at the zeros, which are the multiples of $\\pi$ for $\\sin x$ and the odd multiples of $\\frac{\\pi}{2}$ for $\\cos x$, and add the absolute values of the pieces.\n\nEach arch of $\\sin x$ between consecutive zeros has area $\\int_{0}^{\\pi} \\sin x \\, dx = 2$, and each half-arch from a zero to a peak has area $1$. So $y = \\sin x$ from $0$ to $2\\pi$ encloses a total area of $2 + 2 = 4$.\n\nCheck: $\\int_{0}^{\\pi} \\sin x \\, dx$ is $\\Big[-\\cos x\\Big]_{0}^{\\pi}$, which is $1 + 1$, that is $2$. The arch on $[\\pi, 2\\pi]$ has the same shape below the axis, so its integral is $-2$, and the two cancel in $\\int_{0}^{2\\pi} \\sin x \\, dx$.\n\n> **Watch out.** The zeros of $\\cos x$ are at the odd multiples of $\\frac{\\pi}{2}$, not at the multiples of $\\pi$. Splitting at the wrong points leaves pieces that still cancel inside.",
        "正弦和余弦反复穿过 $x$ 轴，所以在较长的区间上积分会相互抵消：$\\int_{0}^{2\\pi} \\sin x \\, dx = 0$，但曲线确实围成了面积。在零点处拆分区间——$\\sin x$ 的零点是 $\\pi$ 的整数倍，$\\cos x$ 的零点是 $\\frac{\\pi}{2}$ 的奇数倍——再把各段积分的绝对值相加。\n\n$\\sin x$ 在相邻两个零点之间的每一拱的面积为 $\\int_{0}^{\\pi} \\sin x \\, dx = 2$，从零点到峰值的半拱面积为 $1$。所以 $y = \\sin x$ 从 $0$ 到 $2\\pi$ 围成的总面积为 $2 + 2 = 4$。\n\n检验：$\\int_{0}^{\\pi} \\sin x \\, dx$ 等于 $\\Big[-\\cos x\\Big]_{0}^{\\pi}$，即 $1 + 1$，也就是 $2$。$[\\pi, 2\\pi]$ 上的拱形状相同但在轴下方，积分为 $-2$，所以在 $\\int_{0}^{2\\pi} \\sin x \\, dx$ 中两者抵消。\n\n> **注意。** $\\cos x$ 的零点是 $\\frac{\\pi}{2}$ 的奇数倍，不是 $\\pi$ 的整数倍。在错误的点拆分，各段内部仍会相互抵消。",
      ),
      keyPrerequisites: ["integrating-trigonometric-functions"],
      generate(rng) {
        const sine = rng.bool();
        const m = rng.int(sine ? 3 : 2, 6);
        const a = rng.int(1, 6);
        const cosAt = (j: number) => [1, 0, -1, 0][j % 4] ?? 0;
        const sinAt = (j: number) => [0, 1, 0, -1][j % 4] ?? 0;
        const anti = (j: number) => (sine ? -a * cosAt(j) : a * sinAt(j));
        const cuts = [0];
        for (let j = 1; j < m; j++) if (sine ? j % 2 === 0 : j % 2 === 1) cuts.push(j);
        cuts.push(m);
        const pieces = cuts.slice(1).map((x, i) => anti(x) - anti(cuts[i] ?? 0));
        const total = pieces.reduce((s, v) => s + Math.abs(v), 0);
        const net = anti(m) - anti(0);
        const f = `${a === 1 ? "" : a}\\${sine ? "sin" : "cos"} x`;
        const at = (j: number) => piLatex(j, 2);
        const zerosL = cuts.slice(1, -1).map(at).join(", ");
        const integrals = pieces.map((v, i) => `\\int_{${at(cuts[i] ?? 0)}}^{${at(cuts[i + 1] ?? 0)}} ${f} \\, dx = ${v}`);
        const full = pieces.filter((v) => Math.abs(v) === 2 * a).length;
        const halves = pieces.length - full;
        const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
        const archEn = [
          full > 0 ? `${count(full, "full arch", "full arches")} of area $${2 * a}$` : "",
          halves > 0 ? `${count(halves, "half-arch", "half-arches")} of area $${a}$` : "",
        ]
          .filter(Boolean)
          .join(" and ");
        const archZh = [full > 0 ? `${full} 个面积为 $${2 * a}$ 的整拱` : "", halves > 0 ? `${halves} 个面积为 $${a}$ 的半拱` : ""]
          .filter(Boolean)
          .join("和");
        const sum = [full > 0 ? `${full} \\cdot ${2 * a}` : "", halves > 0 ? `${halves} \\cdot ${a}` : ""].filter(Boolean).join(" + ");
        return numberProblem({
          prompt: t(
            `Find the total area between $y = ${f}$ and the $x$-axis from $x = 0$ to $x = ${at(m)}$.`,
            `求 $y = ${f}$ 与 $x$ 轴之间从 $x = 0$ 到 $x = ${at(m)}$ 的总面积。`,
          ),
          answer: total,
          form: "integer",
          wrong: [net, Math.abs(net), 2 * total, total / 2, a * m * 2].filter((w) => Number.isInteger(w)),
          solution: walked(
            [
              [
                ["Find the zeros", "求零点"],
                t(
                  `The zeros of $${f}$ are the ${sine ? "multiples of $\\pi$" : "odd multiples of $\\frac{\\pi}{2}$"}. Inside the interval they are $x = ${zerosL}$.`,
                  `$${f}$ 的零点是${sine ? " $\\pi$ 的整数倍" : " $\\frac{\\pi}{2}$ 的奇数倍"}。在区间内，它们是 $x = ${zerosL}$。`,
                ),
              ],
              [
                ["Integrate on each piece", "在每一段上积分"],
                t("Between the zeros the curve keeps one sign:", "在零点之间曲线的符号不变："),
                integrals,
              ],
              [
                ["Add the absolute values", "把绝对值相加"],
                t("Area counts as positive on every piece:", "每一段的面积都按正数计："),
                [`${pieces.map((v) => Math.abs(v)).join(" + ")} = ${total}`],
              ],
            ],
            t(
              `Count arches instead. The region is made of ${archEn}, so the total is $${sum}$, which is $${total}$. The integral over the whole interval is only $${net}$, because the pieces below the axis cancel some of the others.`,
              `换一种方法，数拱的个数。这个区域由${archZh}组成，所以总面积为 $${sum}$，即 $${total}$。整个区间上的积分只有 $${net}$，因为轴下方的部分抵消了其他部分。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theAreaBoundedByACurveAndTheYAxis integrates with respect to y. */
export const theAreaBoundedByACurveAndTheYAxis: TopicDef = {
  id: "the-area-bounded-by-a-curve-and-the-y-axis",
  title: t("The Area Bounded by a Curve and the Y-Axis", "曲线与 y 轴围成的面积"),
  summary: t("Find areas between a curve and the y-axis by integrating with respect to y.", "通过对 y 积分求曲线与 y 轴之间的面积。"),
  prerequisites: ["the-area-bounded-by-a-curve-and-the-x-axis", "integrating-exponential-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `We find areas against the $x$-axis with vertical strips. Against the $y$-axis, use horizontal strips instead. For the line $x = 2y$ between $y = 0$ and $y = 3$, each strip at height $y$ has length $2y$, so the area between the line and the $y$-axis is $\\int_{0}^{3} 2y \\, dy = \\Big[y^{2}\\Big]_{0}^{3} = 9$.

Check: the region is a right triangle with legs $3$, along the $y$-axis, and $6$, the length of the top strip. Its area is $\\frac{1}{2} \\cdot 3 \\cdot 6$, which is $9$.

In this lesson we find areas between a curve and the $y$-axis by integrating with respect to $y$, first rewriting the curve as $x = g(y)$ when it is given as $y = f(x)$.`,
    `求与 $x$ 轴之间的面积时，我们用竖直的窄条。求与 $y$ 轴之间的面积时，改用水平的窄条。对直线 $x = 2y$，在 $y = 0$ 与 $y = 3$ 之间，高度 $y$ 处的窄条长为 $2y$，所以直线与 $y$ 轴之间的面积为 $\\int_{0}^{3} 2y \\, dy = \\Big[y^{2}\\Big]_{0}^{3} = 9$。

检验：这个区域是直角三角形，两条直角边分别是沿 $y$ 轴的 $3$ 和最上面窄条的长度 $6$。面积为 $\\frac{1}{2} \\cdot 3 \\cdot 6$，即 $9$。

这节课我们通过对 $y$ 积分求曲线与 $y$ 轴之间的面积；曲线以 $y = f(x)$ 给出时，先把它改写成 $x = g(y)$。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-with-respect-to-y",
      title: t("Integrating with respect to y", "对 y 积分"),
      explanation: t(
        "For a curve $x = g(y)$ with $g(y) \\ge 0$ on $[c, d]$, horizontal strips of width $g(y)$ and height $dy$ fill the region between the curve, the $y$-axis and the lines $y = c$, $y = d$. Its area is $\\int_{c}^{d} g(y) \\, dy$. For example, for $x = y^{2} + 1$ between $y = 0$ and $y = 3$, the area is $\\int_{0}^{3} (y^{2} + 1) \\, dy = 9 + 3 = 12$.\n\nCheck: differentiating $\\frac{y^{3}}{3} + y$ with respect to $y$ gives back $y^{2} + 1$, and at $y = 3$ it is $9 + 3$ while at $y = 0$ it is $0$.\n\n> **Watch out.** The limits are values of $y$, and the integrand must be written in terms of $y$. Using $x$-values as limits describes a different region.",
        "对曲线 $x = g(y)$，若在 $[c, d]$ 上 $g(y) \\ge 0$，则宽为 $g(y)$、高为 $dy$ 的水平窄条填满曲线、$y$ 轴与直线 $y = c$、$y = d$ 之间的区域。其面积为 $\\int_{c}^{d} g(y) \\, dy$。例如，对 $x = y^{2} + 1$，在 $y = 0$ 与 $y = 3$ 之间的面积为 $\\int_{0}^{3} (y^{2} + 1) \\, dy = 9 + 3 = 12$。\n\n检验：$\\frac{y^{3}}{3} + y$ 对 $y$ 求导得 $y^{2} + 1$，它在 $y = 3$ 处等于 $9 + 3$，在 $y = 0$ 处等于 $0$。\n\n> **注意。** 积分限是 $y$ 的值，被积函数也要用 $y$ 表示。用 $x$ 的值作积分限，描述的是另一个区域。",
      ),
      generate(rng) {
        const c = rng.int(-3, 2);
        const d = c + rng.int(1, 4);
        const p = positiveCurve(rng, c, d, false);
        const answer = integral(p, c, d);
        const g = pLatex(p, "y");
        const [lo, hi] = rangeOn(p, c, d);
        return numberProblem({
          prompt: t(
            `Find the area of the region bounded by $x = ${g}$, the $y$-axis, and the lines $y = ${c}$ and $y = ${d}$.`,
            `求由 $x = ${g}$、$y$ 轴及直线 $y = ${c}$、$y = ${d}$ 围成的区域面积。`,
          ),
          answer,
          wrong: [answer.neg(), antiderivativeAt(p, d), qAt(p, Q.of(d)).sub(qAt(p, Q.of(c)))],
          solution: walked(
            [
              [
                ["Check the side of the axis", "检查曲线在 y 轴的哪一侧"],
                t(
                  `For $${c} \\le y \\le ${d}$, the least value of $x = ${g}$, found at the endpoints and the vertex, is $${lo.toLatex()}$. It is positive, so the curve is to the right of the $y$-axis and the area is the integral.`,
                  `当 $${c} \\le y \\le ${d}$ 时，$x = ${g}$ 的最小值（比较端点和顶点得到）是 $${lo.toLatex()}$。它是正数，所以曲线在 $y$ 轴右侧，面积就是积分。`,
                ),
              ],
              [
                ["Integrate with respect to y", "对 y 积分"],
                t("Horizontal strips of length $x$ give:", "长为 $x$ 的水平窄条给出："),
                [evaluation(p, c, d, "y")],
              ],
            ],
            boundCheck(["width", "宽"], ["height", "高"], lo, hi, d - c, answer),
          ),
        });
      },
    },
    {
      id: "rewriting-curves-as-functions-of-y",
      title: t("Rewriting curves as functions of y", "把曲线改写成 y 的函数"),
      explanation: t(
        "To find the area between $y = f(x)$ and the $y$-axis, solve for $x$ first. For $y = \\sqrt{x}$ with $0 \\le y \\le 2$: $x = y^{2}$, and the area is $\\int_{0}^{2} y^{2} \\, dy = \\frac{8}{3}$.\n\nCheck: this region and the region under $y = \\sqrt{x}$ from $x = 0$ to $x = 4$ together fill the rectangle of width $4$ and height $2$. The second region has area $\\int_{0}^{4} \\sqrt{x} \\, dx$, which is $\\frac{16}{3}$, and $8 - \\frac{16}{3}$ is $\\frac{8}{3}$.\n\n> **Watch out.** The limits change too: they are values of $y$. For $y = \\sqrt{x}$ up to $y = 2$, the upper limit is $2$, not the $x$-value $4$.",
        "要求 $y = f(x)$ 与 $y$ 轴之间的面积，先解出 $x$。对 $y = \\sqrt{x}$，$0 \\le y \\le 2$：$x = y^{2}$，面积为 $\\int_{0}^{2} y^{2} \\, dy = \\frac{8}{3}$。\n\n检验：这个区域与 $y = \\sqrt{x}$ 下方从 $x = 0$ 到 $x = 4$ 的区域合起来，正好填满宽为 $4$、高为 $2$ 的矩形。后一个区域的面积为 $\\int_{0}^{4} \\sqrt{x} \\, dx$，即 $\\frac{16}{3}$，而 $8 - \\frac{16}{3}$ 等于 $\\frac{8}{3}$。\n\n> **注意。** 积分限也要改变：它们是 $y$ 的值。对 $y = \\sqrt{x}$ 到 $y = 2$ 为止，上限是 $2$，不是 $x$ 的值 $4$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const d = rng.int(1, 5);
        if (kind === 2) {
          const answer = `e^{${d}} - 1`;
          return functionProblem({
            prompt: t(
              `Find the area of the region bounded by $y = \\ln x$, the $y$-axis, and the lines $y = 0$ and $y = ${d}$. Give an exact answer.`,
              `求由 $y = \\ln x$、$y$ 轴及直线 $y = 0$、$y = ${d}$ 围成的区域面积，给出精确值。`,
            ),
            answer,
            wrong: [`e^{${d}}`, `${d}e^{${d}} - e^{${d}} + 1`, `\\ln ${d}`],
            solution: walked(
              [
                [
                  ["Solve for x", "解出 x"],
                  t(
                    `Solving $y = \\ln x$ for $x$ gives $x = e^{y}$, which is positive, so the curve is to the right of the $y$-axis.`,
                    `由 $y = \\ln x$ 解出 $x = e^{y}$，它是正数，所以曲线在 $y$ 轴右侧。`,
                  ),
                ],
                [
                  ["Integrate with respect to y", "对 y 积分"],
                  t(`The limits are $y = 0$ and $y = ${d}$:`, `积分限是 $y = 0$ 和 $y = ${d}$：`),
                  [`${int(0, d, "e^{y}", "y")} = \\Big[e^{y}\\Big]_{0}^{${d}} = e^{${d}} - e^{0} = ${answer}`],
                ],
              ],
              t(
                `The width $e^{y}$ grows from $1$ to $e^{${d}} \\approx ${fmt(Math.exp(d))}$ over a height of $${d}$, so the area lies between $${d}$ and about $${fmt(d * Math.exp(d))}$. The answer $${answer} \\approx ${fmt(Math.exp(d) - 1)}$ is in that range.`,
                `宽 $e^{y}$ 从 $1$ 增大到 $e^{${d}} \\approx ${fmt(Math.exp(d))}$，高为 $${d}$，所以面积在 $${d}$ 与约 $${fmt(d * Math.exp(d))}$ 之间。答案 $${answer} \\approx ${fmt(Math.exp(d) - 1)}$ 在这个范围内。`,
              ),
            ),
          });
        }
        const m = kind === 0 ? 2 : 3;
        const curve = m === 2 ? "\\sqrt{x}" : "\\sqrt[3]{x}";
        const c = rng.int(0, d - 1);
        const answer = Q.of(d ** (m + 1) - c ** (m + 1), m + 1);
        const lines =
          c === 0 ? t(`the line $y = ${d}$`, `直线 $y = ${d}$`) : t(`the lines $y = ${c}$ and $y = ${d}$`, `直线 $y = ${c}$、$y = ${d}$`);
        return numberProblem({
          prompt: t(
            `Find the area of the region bounded by $y = ${curve}$, the $y$-axis, and ${lines.en}.`,
            `求由 $y = ${curve}$、$y$ 轴及${lines["zh-CN"]}围成的区域面积。`,
          ),
          answer,
          wrong: [Q.of(d ** m - c ** m), Q.of(d ** (m + 1), m + 1), Q.of(d ** m - c ** m, m)],
          solution: walked(
            [
              [
                ["Solve for x", "解出 x"],
                t(
                  `${m === 2 ? "Squaring" : "Cubing"} both sides of $y = ${curve}$ gives $x = y^{${m}}$, and the region runs from $y = ${c}$ to $y = ${d}$.`,
                  `把 $y = ${curve}$ 两边${m === 2 ? "平方" : "立方"}，得 $x = y^{${m}}$，区域从 $y = ${c}$ 延伸到 $y = ${d}$。`,
                ),
              ],
              [
                ["Integrate with respect to y", "对 y 积分"],
                t("Horizontal strips of length $x$ give:", "长为 $x$ 的水平窄条给出："),
                [
                  `${int(c, d, `y^{${m}}`, "y")} = \\Big[\\frac{y^{${m + 1}}}{${m + 1}}\\Big]_{${c}}^{${d}} = \\frac{${d}^{${m + 1}} - ${c}^{${m + 1}}}{${m + 1}} = ${answer.toLatex()}`,
                ],
              ],
            ],
            boundCheck(["width", "宽"], ["height", "高"], Q.of(c ** m), Q.of(d ** m), d - c, answer),
          ),
        });
      },
    },
  ],
};

/** calculatingTheDefiniteIntegralOfAFunctionGivenItsGraph reads integrals as signed areas. */
export const calculatingTheDefiniteIntegralOfAFunctionGivenItsGraph: TopicDef = {
  id: "calculating-the-definite-integral-of-a-function-given-its-graph",
  title: t("Calculating the Definite Integral of a Function Given Its Graph", "由函数图像计算定积分"),
  summary: t("Evaluate definite integrals of piecewise linear graphs as signed areas.", "把分段线性图像的定积分作为有向面积计算。"),
  prerequisites: ["finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `We split $y = x$ on $[-1, 2]$ at its intercept: the triangle above the axis has area $2$ and the one below has area $\\frac{1}{2}$. The integral counts the lower one as negative, so it is $2 - \\frac{1}{2}$, which is $\\frac{3}{2}$. No antiderivative was needed, only the areas of triangles.

Check: with the antiderivative, $\\Big[\\frac{x^{2}}{2}\\Big]_{-1}^{2}$ is $2 - \\frac{1}{2}$ again.

In this lesson we read definite integrals off graphs made of line segments as signed areas, and integrate combinations such as $3f(x) - 2$.`,
    `我们在截距处拆分 $[-1, 2]$ 上的 $y = x$：轴上方三角形的面积为 $2$，下方三角形的面积为 $\\frac{1}{2}$。积分把下方的面积算作负数，所以积分是 $2 - \\frac{1}{2}$，即 $\\frac{3}{2}$。这里不需要原函数，只用了三角形的面积。

检验：用原函数，$\\Big[\\frac{x^{2}}{2}\\Big]_{-1}^{2}$ 同样等于 $2 - \\frac{1}{2}$。

这节课我们把由线段组成的图像的定积分读作有向面积，并计算 $3f(x) - 2$ 这类组合函数的积分。`,
  ),
  knowledgePoints: [
    {
      id: "signed-areas-from-a-graph",
      figure: calculusDrawings3["calculating-the-definite-integral-of-a-function-given-its-graph#signed-areas-from-a-graph"],
      title: t("Signed areas from a graph", "由图像求有向面积"),
      explanation: t(
        "The integral of $f$ is the area above the $x$-axis minus the area below it. For a graph made of line segments, split it into triangles and trapezoids. A trapezoid from $x_{1}$ to $x_{2}$ under a segment has signed area $\\frac{f(x_{1}) + f(x_{2})}{2}(x_{2} - x_{1})$, even when the segment crosses the axis. For example, a segment from $(0, 3)$ to $(2, -1)$ has signed area $\\frac{3 + (-1)}{2} \\cdot 2$, which is $2$.\n\nCheck: the segment crosses the axis at $x = \\frac{3}{2}$. The triangle above has area $\\frac{1}{2} \\cdot \\frac{3}{2} \\cdot 3$, which is $\\frac{9}{4}$, the one below has area $\\frac{1}{2} \\cdot \\frac{1}{2} \\cdot 1$, which is $\\frac{1}{4}$, and $\\frac{9}{4} - \\frac{1}{4}$ is $2$.\n\n> **Watch out.** Area below the axis counts as negative. Adding it as positive gives the total area, not the integral.",
        "$f$ 的积分等于 $x$ 轴上方的面积减去下方的面积。对由线段组成的图像，把区域分成三角形和梯形。线段下方从 $x_{1}$ 到 $x_{2}$ 的梯形，其有向面积为 $\\frac{f(x_{1}) + f(x_{2})}{2}(x_{2} - x_{1})$，即使线段穿过 $x$ 轴也成立。例如，从 $(0, 3)$ 到 $(2, -1)$ 的线段，有向面积为 $\\frac{3 + (-1)}{2} \\cdot 2$，即 $2$。\n\n检验：这条线段在 $x = \\frac{3}{2}$ 处穿过 $x$ 轴。上方三角形面积为 $\\frac{1}{2} \\cdot \\frac{3}{2} \\cdot 3$，即 $\\frac{9}{4}$；下方三角形面积为 $\\frac{1}{2} \\cdot \\frac{1}{2} \\cdot 1$，即 $\\frac{1}{4}$；而 $\\frac{9}{4} - \\frac{1}{4}$ 等于 $2$。\n\n> **注意。** $x$ 轴下方的面积按负数计。把它当作正数相加，得到的是总面积，而不是积分。",
      ),
      generate(rng) {
        const ys = zigzag(rng);
        const [a, b] = nodePair(rng);
        const reversed = rng.bool(0.2);
        const value = zigIntegral(ys, Q.of(a), Q.of(b));
        const answer = reversed ? value.neg() : value;
        const [lo, hi] = reversed ? [b, a] : [a, b];
        const { lines, areas } = trapezoids(ys, a, b);
        const sum =
          areas.length > 1 ? `${int(a, b, "f(x)")} = ${signed(areas)} = ${value.toLatex()}` : `${int(a, b, "f(x)")} = ${value.toLatex()}`;
        const parts: Step[] = [
          [
            ["Find the signed area on each interval", "求每个区间上的有向面积"],
            t(
              "The nodes are $2$ apart, and each trapezoid has signed area equal to the sum of its end heights:",
              "节点间隔为 $2$，每个梯形的有向面积等于两端高度之和：",
            ),
            lines,
          ],
          [["Add the pieces", "把各部分相加"], t(`From $x = ${a}$ to $x = ${b}$:`, `从 $x = ${a}$ 到 $x = ${b}$：`), [sum]],
        ];
        if (reversed)
          parts.push([
            ["Reverse the limits", "交换上下限"],
            t(
              `The integral asked for runs from $${lo}$ down to $${hi}$, so its sign changes: $${int(lo, hi, "f(x)")} = ${answer.toLatex()}$.`,
              `所求积分从 $${lo}$ 到 $${hi}$，方向相反，所以符号改变：$${int(lo, hi, "f(x)")} = ${answer.toLatex()}$。`,
            ),
          ]);
        return {
          ...numberProblem({
            prompt: t(`The graph of $f$ is shown. Find $${int(lo, hi, "f(x)")}$.`, `图中是 $f$ 的图像。求 $${int(lo, hi, "f(x)")}$。`),
            answer,
            wrong: [answer.neg(), zigArea(ys, Q.of(a), Q.of(b)), Q.of(ys[zigzagXs.indexOf(b)]! - ys[zigzagXs.indexOf(a)]!)],
            solution: walked(parts, areaCheck(ys, a, b, reversed)),
          }),
          figure: zigzagFigure(ys, "f"),
        };
      },
    },
    {
      id: "integrals-of-combinations-from-a-graph",
      figure: calculusDrawings3["calculating-the-definite-integral-of-a-function-given-its-graph#integrals-of-combinations-from-a-graph"],
      title: t("Integrals of combinations from a graph", "由图像求组合函数的积分"),
      explanation: t(
        "The integral is linear: constants factor out, and the integral of a constant $k$ over $[a, b]$ is the area of a rectangle, $k(b - a)$. So\n\n$$\\int_{a}^{b} \\big(c f(x) + k\\big) \\, dx = c \\int_{a}^{b} f(x) \\, dx + k(b - a)$$\n\nRead $\\int_{a}^{b} f(x) \\, dx$ off the graph as a signed area, then scale and add. If $\\int_{0}^{4} f(x) \\, dx = 6$, then $\\int_{0}^{4} \\big(3f(x) - 2\\big) \\, dx = 18 - 8 = 10$.\n\nCheck: the constant function $f(x) = \\frac{3}{2}$ has integral $6$ on $[0, 4]$. For it, $3f(x) - 2$ is the constant $\\frac{5}{2}$, and $\\frac{5}{2} \\cdot 4$ is $10$.\n\n> **Watch out.** The constant $k$ integrates to $k(b - a)$, not to $k$: it is multiplied by the width of the interval.",
        "积分是线性的：常数因子可以提出，常数 $k$ 在 $[a, b]$ 上的积分是矩形面积 $k(b - a)$。所以\n\n$$\\int_{a}^{b} \\big(c f(x) + k\\big) \\, dx = c \\int_{a}^{b} f(x) \\, dx + k(b - a)$$\n\n先从图像读出有向面积 $\\int_{a}^{b} f(x) \\, dx$，再乘以系数并相加。若 $\\int_{0}^{4} f(x) \\, dx = 6$，则 $\\int_{0}^{4} \\big(3f(x) - 2\\big) \\, dx = 18 - 8 = 10$。\n\n检验：常数函数 $f(x) = \\frac{3}{2}$ 在 $[0, 4]$ 上的积分为 $6$。对它来说，$3f(x) - 2$ 是常数 $\\frac{5}{2}$，而 $\\frac{5}{2} \\cdot 4$ 等于 $10$。\n\n> **注意。** 常数 $k$ 的积分是 $k(b - a)$，不是 $k$：它要乘以区间的宽度。",
      ),
      generate(rng) {
        const ys = zigzag(rng);
        const [a, b] = nodePair(rng);
        const c = rng.pick([-3, -2, -1, 2, 3, 4]);
        const k = rng.nonZero(-4, 4);
        const value = zigIntegral(ys, Q.of(a), Q.of(b));
        const answer = value.mul(Q.of(c)).add(Q.of(k * (b - a)));
        const body = `${c === -1 ? "-" : c}f(x) ${k < 0 ? "-" : "+"} ${Math.abs(k)}`;
        const integrand = `\\big(${body}\\big)`;
        const { areas } = trapezoids(ys, a, b);
        const nodes = zigzagXs.map((x, i) => [x, c * ys[i]! + k] as const).filter(([x]) => x >= a && x <= b);
        const gAreas = nodes.slice(1).map(([, y], i) => nodes[i]![1] + y);
        const read = `${int(a, b, "f(x)")} = ${areas.length > 1 ? `${signed(areas)} = ` : ""}${value.toLatex()}`;
        return {
          ...numberProblem({
            prompt: t(`The graph of $f$ is shown. Find $${int(a, b, integrand)}$.`, `图中是 $f$ 的图像。求 $${int(a, b, integrand)}$。`),
            answer,
            wrong: [
              value.mul(Q.of(c)),
              value.mul(Q.of(c)).add(Q.of(k)),
              value.add(Q.of(k * (b - a))),
              value.mul(Q.of(c)).sub(Q.of(k * (b - a))),
            ],
            solution: walked(
              [
                [
                  ["Read the signed area of f", "读出 f 的有向面积"],
                  t(
                    "Use trapezoids of width $2$, each with signed area the sum of its end heights:",
                    "用宽为 $2$ 的梯形，每个梯形的有向面积等于两端高度之和：",
                  ),
                  [read],
                ],
                [
                  ["Use linearity", "利用线性性"],
                  t(
                    `Scale the signed area by $${c}$ and add the rectangle of height $${k}$ and width $${b - a}$:`,
                    `把有向面积乘以 $${c}$，再加上高为 $${k}$、宽为 $${b - a}$ 的矩形：`,
                  ),
                  [`${int(a, b, integrand)} = ${c} \\cdot ${par(value)} + ${par(Q.of(k))} \\cdot ${b - a} = ${answer.toLatex()}`],
                ],
              ],
              t(
                `Integrate the new function directly. Its graph is also made of segments, and its heights at the nodes from $x = ${a}$ to $x = ${b}$ are, in order, $${nodes.map(([, y]) => y).join(", ")}$. Adding the end heights of each trapezoid of width $2$ gives\n\n$$${int(a, b, integrand)} = ${gAreas.length > 1 ? `${signed(gAreas)} = ` : ""}${answer.toLatex()}$$`,
                `直接对新函数积分。它的图像也由线段组成，从 $x = ${a}$ 到 $x = ${b}$ 各节点处的高度依次为 $${nodes.map(([, y]) => y).join(", ")}$。把每个宽为 $2$ 的梯形两端高度相加，得\n\n$$${int(a, b, integrand)} = ${gAreas.length > 1 ? `${signed(gAreas)} = ` : ""}${answer.toLatex()}$$`,
              ),
            ),
          }),
          figure: zigzagFigure(ys, "f"),
        };
      },
    },
  ],
};

/** calculatingTheDefiniteIntegralOfAFunctionsDerivativeGivenItsGraph integrates a derivative as a net change. */
export const calculatingTheDefiniteIntegralOfAFunctionsDerivativeGivenItsGraph: TopicDef = {
  id: "calculating-the-definite-integral-of-a-functions-derivative-given-its-graph",
  title: t("Calculating the Definite Integral of a Function's Derivative Given Its Graph", "由函数图像计算其导数的定积分"),
  summary: t("Integrate a derivative as the net change of the function.", "把导数的积分看作函数的净变化。"),
  prerequisites: ["calculating-the-definite-integral-of-a-function-given-its-graph"],
  encompasses: [{ topic: "the-fundamental-theorem-of-calculus", weight: 0.3 }],
  xp: 8,
  standards: [],
  intro: t(
    `We read $\\int f$ off a graph as a signed area. To integrate a derivative, the fundamental theorem is quicker: $f$ is an antiderivative of $f'$, so $\\int_{0}^{2} f'(x) \\, dx = f(2) - f(0)$. For $f(x) = x^{2}$ this is $4 - 0$, which is $4$.

Check: here $f'(x) = 2x$, and the triangle under $y = 2x$ from $0$ to $2$ has area $\\frac{1}{2} \\cdot 2 \\cdot 4$, which is $4$.

In this lesson we integrate a derivative as the net change of the function, reading the values of the function from a graph or a table.`,
    `我们会从图像上把 $\\int f$ 读作有向面积。对导数积分时，用基本定理更快：$f$ 是 $f'$ 的一个原函数，所以 $\\int_{0}^{2} f'(x) \\, dx = f(2) - f(0)$。对 $f(x) = x^{2}$，这等于 $4 - 0$，即 $4$。

检验：这里 $f'(x) = 2x$，$y = 2x$ 下方从 $0$ 到 $2$ 的三角形面积为 $\\frac{1}{2} \\cdot 2 \\cdot 4$，即 $4$。

这节课我们把导数的积分看作函数的净变化，从图像或表格中读出函数值来计算。`,
  ),
  knowledgePoints: [
    {
      id: "net-change-from-a-graph",
      figure: calculusDrawings3["calculating-the-definite-integral-of-a-functions-derivative-given-its-graph#net-change-from-a-graph"],
      title: t("Net change from a graph", "由图像求净变化"),
      explanation: t(
        "$f$ is an antiderivative of $f'$, so by the fundamental theorem\n\n$$\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)$$\n\nRead the two values of $f$ off its graph; no area is needed. For example, if the graph of $f$ passes through $(-2, 3)$ and $(4, -1)$, then $\\int_{-2}^{4} f'(x) \\, dx = -1 - 3 = -4$.\n\nCheck: if $f$ is the line through these two points, $f'$ is its slope $-\\frac{2}{3}$, and integrating this constant over a width of $6$ gives $-\\frac{2}{3} \\cdot 6$, which is $-4$.\n\n> **Watch out.** The graph shows $f$, not $f'$. The area under this graph is $\\int f$, which answers a different question.",
        "$f$ 是 $f'$ 的一个原函数，所以由基本定理\n\n$$\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)$$\n\n从图像读出 $f$ 的两个值即可，不需要求面积。例如，若 $f$ 的图像经过 $(-2, 3)$ 和 $(4, -1)$，则 $\\int_{-2}^{4} f'(x) \\, dx = -1 - 3 = -4$。\n\n检验：若 $f$ 是过这两点的直线，$f'$ 就是它的斜率 $-\\frac{2}{3}$，这个常数在宽为 $6$ 的区间上的积分是 $-\\frac{2}{3} \\cdot 6$，即 $-4$。\n\n> **注意。** 图像画的是 $f$，不是 $f'$。这个图像下方的面积是 $\\int f$，回答的是另一个问题。",
      ),
      generate(rng) {
        const ys = zigzag(rng);
        let [a, b] = nodePair(rng);
        if (rng.bool(0.25)) [a, b] = [b, a];
        const fa = ys[zigzagXs.indexOf(a)]!;
        const fb = ys[zigzagXs.indexOf(b)]!;
        const answer = fb - fa;
        const [lo, hi] = a < b ? [a, b] : [b, a];
        const area = zigIntegral(ys, Q.of(lo), Q.of(hi));
        const rises = zigzagXs.flatMap((x, i) => (x >= lo && x < hi ? [ys[i + 1]! - ys[i]!] : []));
        const total = rises.reduce((s, r) => s + r, 0);
        return {
          ...numberProblem({
            prompt: t(`The graph of $f$ is shown. Find $${int(a, b, "f'(x)")}$.`, `图中是 $f$ 的图像。求 $${int(a, b, "f'(x)")}$。`),
            answer,
            wrong: [fa - fb, a < b ? area : area.neg(), fb],
            solution: walked(
              [
                [
                  ["Use the fundamental theorem", "用基本定理"],
                  t(
                    `$f$ is an antiderivative of $f'$, so $${int(a, b, "f'(x)")} = f(${b}) - f(${a})$.`,
                    `$f$ 是 $f'$ 的一个原函数，所以 $${int(a, b, "f'(x)")} = f(${b}) - f(${a})$。`,
                  ),
                ],
                [
                  ["Read the values off the graph", "从图像读出函数值"],
                  t(`The graph passes through $(${a}, ${fa})$ and $(${b}, ${fb})$:`, `图像经过 $(${a}, ${fa})$ 和 $(${b}, ${fb})$：`),
                  [`f(${b}) - f(${a}) = ${fb} - ${par(fa)} = ${answer}`],
                ],
              ],
              t(
                `Add up the slopes instead. On each segment $f'$ is the constant slope, and the slope times the width $2$ is the rise of the segment. From $x = ${lo}$ to $x = ${hi}$ the rises are $${rises.join(", ")}$, which add up to $${total}$${a > b ? `. The limits run from right to left, which changes the sign to $${answer}$` : ""}.`,
                `换一种方法，把斜率累加起来。在每条线段上 $f'$ 是常数斜率，斜率乘以宽度 $2$ 就是这条线段的升高量。从 $x = ${lo}$ 到 $x = ${hi}$，各段升高量为 $${rises.join(", ")}$，总和为 $${total}$${a > b ? `。积分限从右到左，符号改变，得 $${answer}$` : ""}。`,
              ),
            ),
          }),
          figure: zigzagFigure(ys, "f"),
        };
      },
    },
    {
      id: "net-change-from-a-table",
      title: t("Net change from a table", "由表格求净变化"),
      explanation: t(
        "With a table of values of $f$ and $f'$, the integral of $f'$ uses only the values of $f$: $\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)$. The values of $f'$ are not needed. For example, if $f(1) = 4$ and $f(5) = 10$, then $\\int_{1}^{5} f'(x) \\, dx = 6$, whatever the values of $f'$.\n\nCheck: the line through $(1, 4)$ and $(5, 10)$ has these values and slope $\\frac{3}{2}$, and integrating that slope over a width of $4$ gives $\\frac{3}{2} \\cdot 4$, which is $6$.\n\n> **Watch out.** Use the row for $f$, not the row for $f'$. The values of $f'$ are slopes at single points, and their difference is not the integral.",
        "给出 $f$ 和 $f'$ 的数值表时，$f'$ 的积分只用 $f$ 的值：$\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)$。不需要 $f'$ 的值。例如，若 $f(1) = 4$，$f(5) = 10$，则无论 $f'$ 的值如何，$\\int_{1}^{5} f'(x) \\, dx = 6$。\n\n检验：过 $(1, 4)$ 和 $(5, 10)$ 的直线具有这两个函数值，斜率为 $\\frac{3}{2}$，这个斜率在宽为 $4$ 的区间上的积分是 $\\frac{3}{2} \\cdot 4$，即 $6$。\n\n> **注意。** 要用 $f$ 那一行，而不是 $f'$ 那一行。$f'$ 的值是单个点处的斜率，它们的差不是积分。",
      ),
      generate(rng) {
        const start = rng.int(-2, 3);
        const xs = [0, 1, 2, 3, 4, 5].map((x) => x + start);
        const f = xs.map(() => rng.int(-9, 12));
        const fp = xs.map(() => rng.int(-6, 6));
        const i = rng.int(0, 4);
        const j = rng.int(i + 1, 5);
        const k = rng.pick([1, 1, 2, 3, -2]);
        const net = f[j]! - f[i]!;
        const answer = k * net;
        const body = k === 1 ? "f'(x)" : `${k}f'(x)`;
        const pre = k === 1 ? "" : `${k}`;
        const rows = table(
          ["$x$", ...xs.map((x) => `$${x}$`)],
          ["$f(x)$", ...f.map((y) => `$${y}$`)],
          ["$f'(x)$", ...fp.map((y) => `$${y}$`)],
        );
        const diffs = f.slice(i + 1, j + 1).map((y, n) => y - f[i + n]!);
        return numberProblem({
          prompt: t(
            `The table gives values of a differentiable function $f$ and its derivative.\n\n${rows}\n\nFind $${int(xs[i]!, xs[j]!, body)}$.`,
            `下表给出可导函数 $f$ 及其导数的一些值。\n\n${rows}\n\n求 $${int(xs[i]!, xs[j]!, body)}$。`,
          ),
          answer,
          wrong: [k * (fp[j]! - fp[i]!), k * (f[i]! - f[j]!), f[j]! - f[i]!],
          solution: walked(
            [
              [
                ["Use the fundamental theorem", "用基本定理"],
                t(
                  `$${pre}f$ is an antiderivative of $${body}$, so $${int(xs[i]!, xs[j]!, body)} = ${pre}\\left[f(${xs[j]}) - f(${xs[i]})\\right]$.`,
                  `$${pre}f$ 是 $${body}$ 的一个原函数，所以 $${int(xs[i]!, xs[j]!, body)} = ${pre}\\left[f(${xs[j]}) - f(${xs[i]})\\right]$。`,
                ),
              ],
              [
                ["Read the row for f", "读出 f 那一行"],
                t(`$f(${xs[j]}) = ${f[j]}$ and $f(${xs[i]}) = ${f[i]}$:`, `$f(${xs[j]}) = ${f[j]}$，$f(${xs[i]}) = ${f[i]}$：`),
                [`${pre}\\left[${f[j]} - ${par(f[i]!)}\\right] = ${answer}`],
              ],
            ],
            t(
              `Add the changes of $f$ from one column to the next instead. From $x = ${xs[i]}$ to $x = ${xs[j]}$ they are $${diffs.join(", ")}$, with sum $${net}$${k === 1 ? "" : `, and $${k} \\cdot ${par(net)}$ is $${answer}$`}.`,
              `换一种方法，把 $f$ 相邻两列之间的变化量相加。从 $x = ${xs[i]}$ 到 $x = ${xs[j]}$，它们依次是 $${diffs.join(", ")}$，总和为 $${net}$${k === 1 ? "" : `，而 $${k} \\cdot ${par(net)}$ 等于 $${answer}$`}。`,
            ),
          ),
        });
      },
    },
  ],
};

/** definiteIntegralsOfPiecewiseFunctions splits integrals of piecewise functions and absolute values. */
export const definiteIntegralsOfPiecewiseFunctions: TopicDef = {
  id: "definite-integrals-of-piecewise-functions",
  title: t("Definite Integrals of Piecewise Functions", "分段函数的定积分"),
  summary: t("Integrate piecewise functions and absolute values by splitting the interval.", "通过拆分区间积分分段函数和绝对值函数。"),
  prerequisites: [
    "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect",
    "properties-of-definite-integrals-involving-the-limits-of-integration",
  ],
  encompasses: [{ topic: "properties-of-definite-integrals-involving-the-limits-of-integration", weight: 0.3 }],
  xp: 10,
  standards: [],
  intro: t(
    `We split an integral at a point $c$ inside the interval: $\\int_{a}^{b} = \\int_{a}^{c} + \\int_{c}^{b}$. A piecewise function is split where its rule changes. For $f(x) = 1$ when $x < 1$ and $f(x) = 2x$ when $x \\ge 1$:

$$\\int_{0}^{2} f(x) \\, dx = \\int_{0}^{1} 1 \\, dx + \\int_{1}^{2} 2x \\, dx = 1 + 3 = 4$$

Check: the region is a unit square of area $1$ next to a trapezoid with heights $2$ and $4$ and width $1$, of area $3$. Together they make $4$.

In this lesson we integrate piecewise functions by splitting at the points where the rule changes, and integrate absolute values by splitting where the inside is zero.`,
    `我们会在区间内的点 $c$ 处拆分积分：$\\int_{a}^{b} = \\int_{a}^{c} + \\int_{c}^{b}$。分段函数要在规则改变的地方拆分。对 $x < 1$ 时 $f(x) = 1$、$x \\ge 1$ 时 $f(x) = 2x$ 的函数：

$$\\int_{0}^{2} f(x) \\, dx = \\int_{0}^{1} 1 \\, dx + \\int_{1}^{2} 2x \\, dx = 1 + 3 = 4$$

检验：这个区域由面积为 $1$ 的单位正方形和一个梯形组成，梯形两底为 $2$ 和 $4$、高为 $1$，面积为 $3$。合起来是 $4$。

这节课我们在规则改变的点拆分来积分分段函数，并在绝对值里面为零的点拆分来积分绝对值函数。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-piecewise-functions",
      title: t("Integrating piecewise functions", "积分分段函数"),
      explanation: t(
        "Split the integral where the rule changes, and integrate each piece with its own formula: if the rule changes at $c$, then $\\int_{a}^{b} f(x) \\, dx = \\int_{a}^{c} f(x) \\, dx + \\int_{c}^{b} f(x) \\, dx$. For example, if $f(x) = x + 1$ for $x < 0$ and $f(x) = 3$ for $x \\ge 0$, then on $[-2, 2]$ the left piece gives $\\Big[\\frac{x^{2}}{2} + x\\Big]_{-2}^{0}$, which is $0$, and the right piece gives $3 \\cdot 2$, so the integral is $6$.\n\nCheck: the left piece is the segment from $(-2, -1)$ to $(0, 1)$. The triangles below and above the axis are equal, so its signed area is $0$, and the right piece is a rectangle of area $6$.\n\n> **Watch out.** Each formula holds only on its own part of the interval. Integrating one formula over the whole interval ignores the other piece.",
        "在规则改变处拆分积分，每一段用各自的公式积分：若规则在 $c$ 处改变，则 $\\int_{a}^{b} f(x) \\, dx = \\int_{a}^{c} f(x) \\, dx + \\int_{c}^{b} f(x) \\, dx$。例如，若 $x < 0$ 时 $f(x) = x + 1$，$x \\ge 0$ 时 $f(x) = 3$，则在 $[-2, 2]$ 上，左段给出 $\\Big[\\frac{x^{2}}{2} + x\\Big]_{-2}^{0}$，即 $0$；右段给出 $3 \\cdot 2$，所以积分为 $6$。\n\n检验：左段是从 $(-2, -1)$ 到 $(0, 1)$ 的线段。轴下方和上方的两个三角形相等，所以它的有向面积为 $0$；右段是面积为 $6$ 的矩形。\n\n> **注意。** 每个公式只在它自己那一段上成立。把一个公式用于整个区间，就忽略了另一段。",
      ),
      generate(rng) {
        const c = rng.int(-2, 2);
        const left: Poly = [rng.int(-6, 6), rng.nonZero(-4, 4)];
        const right: Poly = rng.bool() ? [rng.int(-6, 6), rng.int(-3, 3), rng.nonZero(-2, 2)] : [rng.int(-6, 6), rng.nonZero(-4, 4)];
        const a = c - rng.int(1, 3);
        const b = c + rng.int(1, 3);
        const [L, R] = [integral(left, a, c), integral(right, c, b)];
        const answer = L.add(R);
        const f = `f(x) = \\begin{cases} ${pLatex(left)} & x < ${c} \\\\ ${pLatex(right)} & x \\ge ${c} \\end{cases}`;
        const [la, lc] = [qAt(left, Q.of(a)), qAt(left, Q.of(c))];
        const linear = right.length === 2;
        const [rc, rb] = [qAt(right, Q.of(c)), qAt(right, Q.of(b))];
        const trap = (y0: Q, y1: Q, w: number) => `\\frac{${y0.toLatex()} + ${par(y1)}}{2} \\cdot ${w}`;
        return numberProblem({
          prompt: t(`Let $${f}$. Evaluate $${int(a, b, "f(x)")}$.`, `设 $${f}$。计算 $${int(a, b, "f(x)")}$。`),
          answer,
          wrong: [integral(left, a, b), integral(right, a, b), L.sub(R)],
          solution: walked(
            [
              [
                ["Split at the change of rule", "在规则改变处拆分"],
                t(
                  `The rule changes at $x = ${c}$, so the integral is $${int(a, c, "f(x)")} + ${int(c, b, "f(x)")}$.`,
                  `规则在 $x = ${c}$ 处改变，所以积分为 $${int(a, c, "f(x)")} + ${int(c, b, "f(x)")}$。`,
                ),
              ],
              [
                ["Integrate the left piece", "积分左段"],
                t(`For $x < ${c}$, $f(x) = ${pLatex(left)}$:`, `当 $x < ${c}$ 时，$f(x) = ${pLatex(left)}$：`),
                [evaluation(left, a, c)],
              ],
              [
                ["Integrate the right piece", "积分右段"],
                t(`For $x \\ge ${c}$, $f(x) = ${pLatex(right)}$:`, `当 $x \\ge ${c}$ 时，$f(x) = ${pLatex(right)}$：`),
                [evaluation(right, c, b)],
              ],
              [
                ["Add the pieces", "把两段相加"],
                t("The two pieces together give:", "两段合起来得到："),
                [`${int(a, b, "f(x)")} = ${L.toLatex()} + ${par(R)} = ${answer.toLatex()}`],
              ],
            ],
            t(
              `The left piece is a line, so its integral is the signed area of a trapezoid with heights $${la.toLatex()}$ and $${lc.toLatex()}$ and width $${c - a}$:\n\n$$${trap(la, lc, c - a)} = ${L.toLatex()}$$\n\n${
                linear
                  ? `The right piece is a line too, with heights $${rc.toLatex()}$ and $${rb.toLatex()}$ and width $${b - c}$:\n\n$$${trap(rc, rb, b - c)} = ${R.toLatex()}$$\n\nBoth pieces agree with the steps above.`
                  : `This agrees with the step above. For the right piece, differentiating $${antiderivativeLatex(right)}$ term by term gives back $${pLatex(right)}$, so the antiderivative used there is right.`
              }`,
              `左段是一条直线，所以它的积分是梯形的有向面积，两端高度为 $${la.toLatex()}$ 和 $${lc.toLatex()}$，宽为 $${c - a}$：\n\n$$${trap(la, lc, c - a)} = ${L.toLatex()}$$\n\n${
                linear
                  ? `右段也是直线，两端高度为 $${rc.toLatex()}$ 和 $${rb.toLatex()}$，宽为 $${b - c}$：\n\n$$${trap(rc, rb, b - c)} = ${R.toLatex()}$$\n\n两段都与上面的步骤一致。`
                  : `这与上面的步骤一致。对右段，把 $${antiderivativeLatex(right)}$ 逐项求导，得到 $${pLatex(right)}$，说明那里用的原函数是对的。`
              }`,
            ),
          ),
        });
      },
    },
    {
      id: "integrating-absolute-values",
      title: t("Integrating absolute values", "积分绝对值函数"),
      explanation: t(
        "Write $|g(x)|$ piecewise: it is $g(x)$ where $g(x) \\ge 0$ and $-g(x)$ where $g(x) < 0$. For $|kx - m|$ the rule changes at $x = \\frac{m}{k}$; split the integral there. For example, $|2x - 4|$ changes rule at $x = 2$, so on $[0, 3]$ the integral is $\\int_{0}^{2} (4 - 2x) \\, dx + \\int_{2}^{3} (2x - 4) \\, dx$, which is $4 + 1$, or $5$.\n\nCheck: the graph of $|2x - 4|$ on $[0, 3]$ is two triangles meeting at $x = 2$. The left one has base $2$ and height $4$, area $4$; the right one has base $1$ and height $2$, area $1$.\n\n> **Watch out.** Without splitting, $\\int_{0}^{3} (2x - 4) \\, dx$ is $-3$. An integral of an absolute value is never negative, so the split cannot be skipped.",
        "把 $|g(x)|$ 写成分段形式：$g(x) \\ge 0$ 处为 $g(x)$，$g(x) < 0$ 处为 $-g(x)$。对 $|kx - m|$，规则在 $x = \\frac{m}{k}$ 处改变，在那里拆分积分。例如，$|2x - 4|$ 在 $x = 2$ 处改变规则，所以在 $[0, 3]$ 上积分为 $\\int_{0}^{2} (4 - 2x) \\, dx + \\int_{2}^{3} (2x - 4) \\, dx$，即 $4 + 1$，等于 $5$。\n\n检验：$|2x - 4|$ 在 $[0, 3]$ 上的图像是在 $x = 2$ 处相接的两个三角形。左边的底为 $2$、高为 $4$，面积为 $4$；右边的底为 $1$、高为 $2$，面积为 $1$。\n\n> **注意。** 不拆分时，$\\int_{0}^{3} (2x - 4) \\, dx$ 等于 $-3$。绝对值函数的积分不会是负数，所以不能省去拆分这一步。",
      ),
      generate(rng) {
        const k = rng.int(1, 4);
        const r = rng.int(-3, 3);
        const g: Poly = [-k * r, k];
        const a = r - rng.int(1, 4);
        const b = r + rng.int(1, 4);
        const [A1, A2] = [integral(g, a, r).neg(), integral(g, r, b)];
        const answer = A1.add(A2);
        const inner = pLatex(g);
        const [w1, w2] = [r - a, b - r];
        return numberProblem({
          prompt: t(`Evaluate $${int(a, b, `|${inner}|`)}$.`, `计算 $${int(a, b, `|${inner}|`)}$。`),
          answer,
          wrong: [integral(g, a, b), integral(g, a, b).abs(), integral(g, r, b)],
          solution: walked(
            [
              [
                ["Find where the inside is zero", "求绝对值里面为零的点"],
                t(
                  `$${inner} = 0$ at $x = ${r}$. To the left it is negative, so there $|${inner}| = ${pLatex([k * r, -k])}$; to the right it is positive.`,
                  `$${inner} = 0$ 的解为 $x = ${r}$。在它左边为负，所以那里 $|${inner}| = ${pLatex([k * r, -k])}$；在它右边为正。`,
                ),
              ],
              [
                ["Integrate each piece", "分段积分"],
                t("Each piece with its own formula:", "每一段用各自的公式："),
                [evaluation([k * r, -k], a, r), evaluation(g, r, b)],
              ],
              [
                ["Add the pieces", "把两段相加"],
                t("The two pieces together give:", "两段合起来得到："),
                [`${int(a, b, `|${inner}|`)} = ${A1.toLatex()} + ${A2.toLatex()} = ${answer.toLatex()}`],
              ],
            ],
            t(
              `The graph of $|${inner}|$ is two triangles meeting at $x = ${r}$. The left one has base $${w1}$ and height $${k * w1}$, and the right one has base $${w2}$ and height $${k * w2}$:\n\n$$\\frac{1}{2} \\cdot ${w1} \\cdot ${k * w1} + \\frac{1}{2} \\cdot ${w2} \\cdot ${k * w2} = ${answer.toLatex()}$$`,
              `$|${inner}|$ 的图像是在 $x = ${r}$ 处相接的两个三角形。左边的底为 $${w1}$、高为 $${k * w1}$，右边的底为 $${w2}$、高为 $${k * w2}$：\n\n$$\\frac{1}{2} \\cdot ${w1} \\cdot ${k * w1} + \\frac{1}{2} \\cdot ${w2} \\cdot ${k * w2} = ${answer.toLatex()}$$`,
            ),
          ),
        });
      },
    },
  ],
};

/** theIntegralAsAnAccumulationFunction evaluates functions defined by integrals. */
export const theIntegralAsAnAccumulationFunction: TopicDef = {
  id: "the-integral-as-an-accumulation-function",
  title: t("The Integral as an Accumulation Function", "作为累积函数的积分"),
  summary: t(
    "Evaluate and find formulas for functions of the form g(x) = ∫ₐˣ f(t) dt.",
    "计算形如 g(x) = ∫ₐˣ f(t) dt 的函数的值并求其表达式。",
  ),
  prerequisites: ["calculating-the-definite-integral-of-a-function-given-its-graph"],
  encompasses: [{ topic: "calculating-the-definite-integral-of-a-function-given-its-graph", weight: 0.4 }],
  xp: 10,
  standards: [],
  intro: t(
    `We evaluate definite integrals with fixed limits. Letting the upper limit vary gives a function: $g(x) = \\int_{0}^{x} 2 \\, dt$ is the area of a rectangle of height $2$ from $0$ to $x$, so $g(x) = 2x$, and for example $g(3) = 6$.

Check: with the antiderivative, $\\Big[2t\\Big]_{0}^{x}$ is $2x - 0$, the same formula.

In this lesson we evaluate functions of the form $g(x) = \\int_{a}^{x} f(t) \\, dt$ from a graph of $f$, and find formulas for them when $f$ is given by a formula.`,
    `我们会计算上下限固定的定积分。让上限变动，就得到一个函数：$g(x) = \\int_{0}^{x} 2 \\, dt$ 是从 $0$ 到 $x$、高为 $2$ 的矩形面积，所以 $g(x) = 2x$，例如 $g(3) = 6$。

检验：用原函数，$\\Big[2t\\Big]_{0}^{x}$ 等于 $2x - 0$，是同一个式子。

这节课我们由 $f$ 的图像计算形如 $g(x) = \\int_{a}^{x} f(t) \\, dt$ 的函数的值，并在 $f$ 由公式给出时求出它的表达式。`,
  ),
  knowledgePoints: [
    {
      id: "accumulation-functions-from-a-graph",
      figure: calculusDrawings3["the-integral-as-an-accumulation-function#accumulation-functions-from-a-graph"],
      title: t("Accumulation functions from a graph", "由图像求累积函数的值"),
      explanation: t(
        "$g(x) = \\int_{a}^{x} f(t) \\, dt$ accumulates the signed area under $f$ from $a$ to $x$. So $g(a) = 0$, $g$ grows where $f > 0$ and shrinks where $f < 0$. For $x < a$, reverse the limits: $g(x) = -\\int_{x}^{a} f(t) \\, dt$. For example, if $f$ is the constant $3$ and $g(x) = \\int_{1}^{x} f(t) \\, dt$, then $g(4) = 3 \\cdot 3 = 9$ and $g(0) = -3 \\cdot 1 = -3$.\n\nCheck: here $g(x) = 3(x - 1)$, which is $9$ at $x = 4$ and $-3$ at $x = 0$.\n\n> **Watch out.** $g(x)$ is an area, not the height $f(x)$ of the graph at $x$.",
        "$g(x) = \\int_{a}^{x} f(t) \\, dt$ 累积 $f$ 从 $a$ 到 $x$ 的有向面积。所以 $g(a) = 0$，在 $f > 0$ 处 $g$ 增大，在 $f < 0$ 处 $g$ 减小。当 $x < a$ 时交换上下限：$g(x) = -\\int_{x}^{a} f(t) \\, dt$。例如，若 $f$ 是常数 $3$，$g(x) = \\int_{1}^{x} f(t) \\, dt$，则 $g(4) = 3 \\cdot 3 = 9$，$g(0) = -3 \\cdot 1 = -3$。\n\n检验：这里 $g(x) = 3(x - 1)$，它在 $x = 4$ 处为 $9$，在 $x = 0$ 处为 $-3$。\n\n> **注意。** $g(x)$ 是面积，不是图像在 $x$ 处的高度 $f(x)$。",
      ),
      generate(rng) {
        const ys = zigzag(rng);
        const base = rng.pick([-6, -6, -4, -2, 0]);
        let x = rng.pick(zigzagXs);
        if (x === base) x = 6;
        const answer = zigIntegral(ys, Q.of(base), Q.of(x));
        const back = x < base;
        const [lo, hi] = back ? [x, base] : [base, x];
        const value = zigIntegral(ys, Q.of(lo), Q.of(hi));
        const { lines, areas } = trapezoids(ys, lo, hi, "f", "t");
        const sum = `${int(lo, hi, "f(t)", "t")} = ${areas.length > 1 ? `${signed(areas)} = ` : ""}${value.toLatex()}`;
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $f$ is shown, and $g(x) = ${int(base, "x", "f(t)", "t")}$. Find $g(${x})$.`,
              `图中是 $f$ 的图像，$g(x) = ${int(base, "x", "f(t)", "t")}$。求 $g(${x})$。`,
            ),
            answer,
            wrong: [answer.neg(), Q.of(ys[zigzagXs.indexOf(x)]!), zigArea(ys, Q.of(lo), Q.of(hi))],
            solution: walked(
              [
                [
                  ["Write g as an integral", "把 g 写成积分"],
                  back
                    ? t(
                        `$g(${x}) = ${int(base, x, "f(t)", "t")}$. The upper limit is smaller, so reverse the limits: $g(${x}) = -${int(x, base, "f(t)", "t")}$.`,
                        `$g(${x}) = ${int(base, x, "f(t)", "t")}$。上限较小，所以交换上下限：$g(${x}) = -${int(x, base, "f(t)", "t")}$。`,
                      )
                    : t(
                        `$g(${x}) = ${int(base, x, "f(t)", "t")}$, the signed area from $t = ${base}$ to $t = ${x}$.`,
                        `$g(${x}) = ${int(base, x, "f(t)", "t")}$，即从 $t = ${base}$ 到 $t = ${x}$ 的有向面积。`,
                      ),
                ],
                [
                  ["Add the trapezoids", "把梯形相加"],
                  t(
                    "The nodes are $2$ apart, and each trapezoid has signed area equal to the sum of its end heights:",
                    "节点间隔为 $2$，每个梯形的有向面积等于两端高度之和：",
                  ),
                  [...lines, sum, ...(back ? [`g(${x}) = -${par(value)} = ${answer.toLatex()}`] : [])],
                ],
              ],
              areaCheck(ys, lo, hi, back),
            ),
          }),
          figure: zigzagFigure(ys, "f"),
        };
      },
    },
    {
      id: "formulas-for-accumulation-functions",
      title: t("Formulas for accumulation functions", "累积函数的表达式"),
      explanation: t(
        "With a formula for $f$, integrate and substitute the limits $a$ and $x$: $\\int_{1}^{x} 2t \\, dt = \\Big[t^{2}\\Big]_{1}^{x} = x^{2} - 1$. The result is the antiderivative of $f$ that is $0$ at $x = a$.\n\nCheck: $x^{2} - 1$ has derivative $2x$, the integrand, and at $x = 1$ it is $0$.\n\n> **Watch out.** Subtract the value at the lower limit. Here the answer is $x^{2} - 1$, not $x^{2}$.",
        "给出 $f$ 的公式时，积分并代入上下限 $a$ 和 $x$：$\\int_{1}^{x} 2t \\, dt = \\Big[t^{2}\\Big]_{1}^{x} = x^{2} - 1$。结果是 $f$ 的在 $x = a$ 处为 $0$ 的那个原函数。\n\n检验：$x^{2} - 1$ 的导数是被积函数 $2x$，且它在 $x = 1$ 处为 $0$。\n\n> **注意。** 要减去下限处的值。这里答案是 $x^{2} - 1$，不是 $x^{2}$。",
      ),
      generate(rng) {
        const deg = rng.int(1, 2);
        const p: number[] = Array.from({ length: deg + 1 }, () => rng.int(-6, 6));
        p[deg] = rng.nonZero(-3, 3) * (deg + 1);
        const a = rng.nonZero(-3, 3);
        const Fa = antiderivativeAt(p, a);
        const terms = p.map((c, i) => [Q.of(c, i + 1), i + 1 === 1 ? "x" : `x^{${i + 1}}`] as const).reverse();
        const F = poly(...terms);
        const answer = poly(...terms, [Fa.neg(), ""]);
        return functionProblem({
          prompt: t(
            `Find a formula for $g(x) = ${int(a, "x", `(${pLatex(p, "t")})`, "t")}$.`,
            `求 $g(x) = ${int(a, "x", `(${pLatex(p, "t")})`, "t")}$ 的表达式。`,
          ),
          prefix: "g(x) =",
          answer,
          wrong: [F, poly(...terms, [Fa, ""]), poly(...terms, [Fa.neg().add(Q.of(a)), ""]), pLatex(p)],
          solution: walked(
            [
              [
                ["Find an antiderivative", "求一个原函数"],
                t(
                  `Raise each power of $t$ by one and divide by the new power. An antiderivative of $${pLatex(p, "t")}$ is $${F.replaceAll("x", "t")}$.`,
                  `把 $t$ 的每个幂次加一，再除以新的幂次。$${pLatex(p, "t")}$ 的一个原函数是 $${F.replaceAll("x", "t")}$。`,
                ),
              ],
              [
                ["Substitute the limits", "代入上下限"],
                t(`Put in $t = x$ and subtract the value at $t = ${a}$:`, `代入 $t = x$，再减去 $t = ${a}$ 处的值：`),
                [`g(x) = \\Big[${F.replaceAll("x", "t")}\\Big]_{${a}}^{x} = \\left(${F}\\right) - ${par(Fa)} = ${answer}`],
              ],
            ],
            t(
              `An accumulation function from $${a}$ has the integrand as its derivative and is $0$ at $x = ${a}$, and these two facts fix it. Differentiating the formula term by term gives $${pLatex(p)}$, the integrand at $x$. At $x = ${a}$ the terms with $x$ add up to $${Fa.toLatex()}$, and the constant $${Fa.neg().toLatex()}$ cancels them, giving $0$.`,
              `从 $${a}$ 开始的累积函数，导数是被积函数，且在 $x = ${a}$ 处为 $0$，这两点确定了它。把表达式逐项求导，得 $${pLatex(p)}$，即被积函数在 $x$ 处的值。在 $x = ${a}$ 处，含 $x$ 的各项之和为 $${Fa.toLatex()}$，常数 $${Fa.neg().toLatex()}$ 正好抵消，结果为 $0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** wrap parenthesizes an argument unless it is a single letter. */
const wrap = (u: string) => (u.length === 1 ? u : `(${u})`);

/** integrands are functions of t without elementary antiderivatives, written at an argument. */
const integrands: readonly ((u: string) => string)[] = [
  (u) => `\\sqrt{1 + ${wrap(u)}^{3}}`,
  (u) => `\\sin\\left(${wrap(u)}^{2}\\right)`,
  (u) => `e^{-${wrap(u)}^{2}}`,
  (u) => `\\ln\\left(1 + ${wrap(u)}^{2}\\right)`,
  (u) => `\\frac{${u}}{1 + ${wrap(u)}^{4}}`,
  (u) => `\\cos\\left(${wrap(u)}^{3}\\right)`,
];

/** theSecondFundamentalTheoremOfCalculus differentiates accumulation functions. */
export const theSecondFundamentalTheoremOfCalculus: TopicDef = {
  id: "the-second-fundamental-theorem-of-calculus",
  title: t("The Second Fundamental Theorem of Calculus", "微积分第二基本定理"),
  summary: t(
    "Differentiate integrals with a variable limit, using the chain rule when the limit is a function of x.",
    "对变限积分求导，上限是 x 的函数时用链式法则。",
  ),
  prerequisites: ["the-integral-as-an-accumulation-function"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `We found formulas such as $\\int_{1}^{x} 2t \\, dt = x^{2} - 1$. Differentiating this formula gives $2x$, which is the integrand with $t$ replaced by $x$. That is no accident: the rate at which the area grows is the height of the graph at its moving edge.

Check: the lower limit does not change the answer. $\\int_{3}^{x} 2t \\, dt$ is $x^{2} - 9$, whose derivative is $2x$ as well.

In this lesson we differentiate integrals with a variable limit without integrating, using the chain rule when the limit is a function of $x$.`,
    `我们求过 $\\int_{1}^{x} 2t \\, dt = x^{2} - 1$ 这样的表达式。对它求导得 $2x$，正是把被积函数中的 $t$ 换成 $x$。这并非巧合：面积增长的速率就是图像在移动边界处的高度。

检验：下限不影响结果。$\\int_{3}^{x} 2t \\, dt$ 等于 $x^{2} - 9$，它的导数同样是 $2x$。

这节课我们不经积分直接对变限积分求导；上限是 $x$ 的函数时用链式法则。`,
  ),
  knowledgePoints: [
    {
      id: "differentiating-an-accumulation-function",
      title: t("Differentiating an accumulation function", "对累积函数求导"),
      explanation: t(
        "**The second fundamental theorem of calculus:** if $f$ is continuous, then\n\n$$\\frac{d}{dx}\\int_{a}^{x} f(t) \\, dt = f(x).$$\n\nThe lower limit $a$ does not matter. If $x$ is the lower limit, reverse first: $\\frac{d}{dx}\\int_{x}^{a} f(t) \\, dt = -f(x)$. The theorem works even when $f$ has no elementary antiderivative: $\\frac{d}{dx}\\int_{0}^{x} e^{-t^{2}} \\, dt = e^{-x^{2}}$.\n\nCheck: for $f(t) = 2t$, $\\int_{2}^{x} 2t \\, dt$ is $x^{2} - 4$, and its derivative $2x$ is $f(x)$.\n\n> **Watch out.** There is no term from the lower limit. The answer is $f(x)$, not $f(x) - f(a)$.",
        "**微积分第二基本定理：**若 $f$ 连续，则\n\n$$\\frac{d}{dx}\\int_{a}^{x} f(t) \\, dt = f(x)$$\n\n下限 $a$ 不影响结果。若 $x$ 是下限，先交换上下限：$\\frac{d}{dx}\\int_{x}^{a} f(t) \\, dt = -f(x)$。即使 $f$ 没有初等原函数，定理也成立：$\\frac{d}{dx}\\int_{0}^{x} e^{-t^{2}} \\, dt = e^{-x^{2}}$。\n\n检验：对 $f(t) = 2t$，$\\int_{2}^{x} 2t \\, dt$ 等于 $x^{2} - 4$，它的导数 $2x$ 正是 $f(x)$。\n\n> **注意。** 结果中没有来自下限的项。答案是 $f(x)$，不是 $f(x) - f(a)$。",
      ),
      generate(rng) {
        const h = rng.pick(integrands);
        const a = rng.int(-3, 5);
        const lower = rng.bool(0.3);
        const k = rng.pick([1, 1, 2, 3, 5]);
        const body = `${k === 1 ? "" : k}${h("t")}`;
        const answer = `${lower ? "-" : ""}${k === 1 ? "" : k}${h("x")}`;
        const integralL = lower ? int("x", a, body, "t") : int(a, "x", body, "t");
        return functionProblem({
          prompt: t(`Find $\\frac{d}{dx}${integralL}$.`, `求 $\\frac{d}{dx}${integralL}$。`),
          answer,
          wrong: [`${lower ? "" : "-"}${k === 1 ? "" : k}${h("x")}`, `${k === 1 ? "" : k}${h("x")} - ${k === 1 ? "" : k}${h(String(a))}`],
          solution: walked(
            [
              lower
                ? [
                    ["Put x in the upper limit", "把 x 放到上限"],
                    t("Reversing the limits changes the sign:", "交换上下限，符号改变："),
                    [`${int("x", a, body, "t")} = -${int(a, "x", body, "t")}`],
                  ]
                : [
                    ["Check the limits", "检查上下限"],
                    t(
                      `$x$ is the upper limit and the lower limit $${a}$ is a constant, so the theorem applies as it stands.`,
                      `$x$ 是上限，下限 $${a}$ 是常数，所以可以直接用定理。`,
                    ),
                  ],
              [
                ["Apply the theorem", "应用定理"],
                t("The derivative is the integrand with $t$ replaced by $x$:", "导数等于把被积函数中的 $t$ 换成 $x$："),
                [`\\frac{d}{dx}${integralL} = ${answer}`],
              ],
            ],
            t(
              `Let $F$ be an antiderivative of $${body}$. By the first fundamental theorem the integral is $${lower ? `F(${a}) - F(x)` : `F(x) - F(${a})`}$. The term $F(${a})$ is a constant with derivative $0$, and $F'(x)$ is the integrand at $x$, so the derivative is $${answer}$ again.`,
              `设 $F$ 是 $${body}$ 的一个原函数。由第一基本定理，积分等于 $${lower ? `F(${a}) - F(x)` : `F(x) - F(${a})`}$。$F(${a})$ 是常数，导数为 $0$；$F'(x)$ 是被积函数在 $x$ 处的值，所以导数同样是 $${answer}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "variable-limits-and-the-chain-rule",
      title: t("Variable limits and the chain rule", "变限与链式法则"),
      explanation: t(
        "By the fundamental theorem, differentiating an integral with a variable upper limit returns the integrand there, and the chain rule multiplies by the derivative of the limit. If the upper limit is a function $u(x)$, the chain rule gives\n\n$$\\frac{d}{dx}\\int_{a}^{u(x)} f(t) \\, dt = f(u(x)) \\cdot u'(x).$$\n\nFor example, $\\frac{d}{dx}\\int_{0}^{x^{2}} \\sin t \\, dt = 2x\\sin(x^{2})$.\n\nCheck: $\\int_{0}^{x^{2}} \\sin t \\, dt$ is $1 - \\cos(x^{2})$, and differentiating that with the chain rule gives $\\sin(x^{2}) \\cdot 2x$.\n\n> **Watch out.** Do not stop at $f(u(x))$: the factor $u'(x)$ from the chain rule is part of the answer.",
        "根据微积分基本定理，对变上限积分求导会得到上限处的被积函数，链式法则再乘以上限的导数。若上限是函数 $u(x)$，由链式法则\n\n$$\\frac{d}{dx}\\int_{a}^{u(x)} f(t) \\, dt = f(u(x)) \\cdot u'(x)$$\n\n例如 $\\frac{d}{dx}\\int_{0}^{x^{2}} \\sin t \\, dt = 2x\\sin(x^{2})$。\n\n检验：$\\int_{0}^{x^{2}} \\sin t \\, dt$ 等于 $1 - \\cos(x^{2})$，用链式法则对它求导得 $\\sin(x^{2}) \\cdot 2x$。\n\n> **注意。** 不要停在 $f(u(x))$：链式法则带来的因子 $u'(x)$ 也是答案的一部分。",
      ),
      generate(rng) {
        const h = rng.pick(integrands);
        const a = rng.int(-2, 4);
        const [u, du] = rng.pick([
          ["x^{2}", "2x"],
          ["x^{3}", "3x^{2}"],
          [`${rng.int(2, 5)}x`, ""],
          ["\\sin x", "\\cos x"],
          ["e^{x}", "e^{x}"],
        ] as const);
        const derivative = du === "" ? u.replace("x", "") : du;
        const answer = `${derivative} \\cdot ${h(u)}`;
        return functionProblem({
          prompt: t(`Find $\\frac{d}{dx}${int(a, u, h("t"), "t")}$.`, `求 $\\frac{d}{dx}${int(a, u, h("t"), "t")}$。`),
          answer,
          wrong: [h(u), h("x"), `${derivative} \\cdot ${h("x")}`],
          solution: walked(
            [
              [
                ["Name the inner function", "设出内层函数"],
                t(
                  `The upper limit is $u = ${u}$, with $\\frac{du}{dx} = ${derivative}$.`,
                  `上限为 $u = ${u}$，$\\frac{du}{dx} = ${derivative}$。`,
                ),
              ],
              [
                ["Apply the theorem and the chain rule", "应用定理和链式法则"],
                t("The integrand at $t = u$, times $\\frac{du}{dx}$:", "被积函数在 $t = u$ 处的值，乘以 $\\frac{du}{dx}$："),
                [`\\frac{d}{dx}${int(a, u, h("t"), "t")} = ${derivative} \\cdot ${h(u)}`],
              ],
            ],
            t(
              `Let $F$ be an antiderivative of $${h("t")}$. The integral is $F(${u}) - F(${a})$. The constant $F(${a})$ has derivative $0$, and the chain rule turns $F(${u})$ into $F'(${u}) \\cdot ${derivative}$. Since $F'$ is the integrand, this is $${answer}$ again.`,
              `设 $F$ 是 $${h("t")}$ 的一个原函数。积分等于 $F(${u}) - F(${a})$。常数 $F(${a})$ 的导数为 $0$，链式法则把 $F(${u})$ 变成 $F'(${u}) \\cdot ${derivative}$。$F'$ 就是被积函数，所以结果同样是 $${answer}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** Extremum is the absolute extremum of f on [−6, 6] given the graph of f′ and a value of f. */
interface Extremum {
  readonly ys: number[];
  /** x0 and value give the known value f(x0). */
  readonly x0: number;
  readonly value: number;
  readonly at: Q;
  readonly best: Q;
  /** others are the other candidates with their values of f. */
  readonly others: readonly (readonly [Q, Q])[];
}

/** fallbackYs is a graph of f′ used when random tries find nothing: it has sign changes at −5, −1/2 and 7/2. */
const fallbackYs = [-2, 2, 3, -1, -3, 1, 2];

/** ranked computes f at the candidates from f(x0) = value and sorts them, best first. */
function ranked(ys: readonly number[], x0: number, value: number, xs: readonly Q[], max: boolean): (readonly [Q, Q])[] {
  const f = (x: Q) => Q.of(value).add(zigIntegral(ys, Q.of(x0), x));
  return xs.map((x) => [x, f(x)] as const).sort((p, q) => (max ? q[1].cmp(p[1]) : p[1].cmp(q[1])));
}

/** extremum chooses a graph of f′ whose antiderivative has a unique absolute maximum or minimum on [−6, 6]. */
function extremum(rng: Rng, max: boolean): Extremum {
  const interior = rng.bool(0.8);
  for (let tries = 0; tries < 400; tries++) {
    const ys = zigzag(rng);
    const x0 = rng.pick([-6, -6, 0]);
    const value = rng.int(-5, 8);
    const sorted = ranked(ys, x0, value, [Q.of(-6), ...zeros(ys).map((z) => z.x), Q.of(6)], max);
    if (sorted.length < 3 || sorted[0]![1].eq(sorted[1]![1])) continue;
    // Mostly ask for an extremum inside the interval, where the sign change of f′ matters.
    if (interior && (sorted[0]![0].eq(Q.of(-6)) || sorted[0]![0].eq(Q.of(6)))) continue;
    return { ys, x0, value, at: sorted[0]![0], best: sorted[0]![1], others: sorted.slice(1) };
  }
  const sorted = ranked(fallbackYs, -6, 1, [Q.of(-6), ...zeros(fallbackYs).map((z) => z.x), Q.of(6)], max);
  return { ys: fallbackYs, x0: -6, value: 1, at: sorted[0]![0], best: sorted[0]![1], others: sorted.slice(1) };
}

/** valueLines writes f at each candidate as the known value f(x0) plus the signed area under f′ from x0. */
const valueLines = (x0: number, value: number, cands: readonly (readonly [Q, Q])[]) =>
  cands.map(([x, v]) =>
    x.eq(Q.of(x0)) ? `f(${x.toLatex()}) = ${value}` : `f(${x.toLatex()}) = ${value} + ${par(v.sub(Q.of(value)))} = ${v.toLatex()}`,
  );

/** fromWinner checks an extremum by measuring the signed area under f′ from it to each other candidate. */
function fromWinner(ys: readonly number[], at: Q, others: readonly (readonly [Q, Q])[], max: boolean): Text {
  const lines = others.map(([x]) => `\\int_{${at.toLatex()}}^{${x.toLatex()}} f'(x) \\, dx = ${zigIntegral(ys, at, x).toLatex()}`);
  return t(
    `Measure from $x = ${at.toLatex()}$ instead. The signed area under $f'$ from there to each other candidate is${steps(...lines)}Each is ${max ? "negative" : "positive"}, so $f$ is ${max ? "smaller" : "larger"} at every other candidate than at $x = ${at.toLatex()}$.`,
    `换一种方法，从 $x = ${at.toLatex()}$ 出发。$f'$ 图像下方从那里到其他每个候选点的有向面积为${steps(...lines)}每一个都是${max ? "负数" : "正数"}，所以 $f$ 在其他每个候选点的值都比在 $x = ${at.toLatex()}$ 处${max ? "小" : "大"}。`,
  );
}

/** extremumTopic builds the topic of finding an absolute maximum or minimum from the graph of f′. */
function extremumTopic(max: boolean): TopicDef {
  const [word, zh] = max ? ["maximum", "最大值"] : ["minimum", "最小值"];
  const up = max ? "positive to negative" : "negative to positive";
  const upZh = max ? "正变负" : "负变正";
  const [greatest, greatestZh] = max ? ["greatest", "最大"] : ["least", "最小"];
  const [k0, k1] = max ? [5, -8] : [-5, 8];
  const back = max ? -3 : 3;
  return {
    id: max ? "maximizing-a-function-using-the-graph-of-its-derivative" : "minimizing-a-function-using-the-graph-of-its-derivative",
    title: max
      ? t("Maximizing a Function Using the Graph of Its Derivative", "利用导数图像求函数的最大值")
      : t("Minimizing a Function Using the Graph of Its Derivative", "利用导数图像求函数的最小值"),
    summary: max
      ? t(
          "Find where a function is largest, and its greatest value, from the graph of its derivative.",
          "由导数图像求函数在何处最大以及最大值。",
        )
      : t(
          "Find where a function is smallest, and its least value, from the graph of its derivative.",
          "由导数图像求函数在何处最小以及最小值。",
        ),
    prerequisites: max
      ? ["the-integral-as-an-accumulation-function", "the-candidates-test", "interpreting-the-graph-of-a-functions-derivative"]
      : ["maximizing-a-function-using-the-graph-of-its-derivative"],
    encompasses: [
      { topic: "the-candidates-test", weight: 0.3 },
      { topic: "the-integral-as-an-accumulation-function", weight: 0.3 },
    ],
    xp: 12,
    standards: [],
    intro: max
      ? t(
          `We find an absolute maximum by comparing $f$ at the candidates. When only the graph of $f'$ and one value of $f$ are known, each value comes from a signed area: $f(b) = f(a) + \\int_{a}^{b} f'(x) \\, dx$. If $f(0) = 1$ and $f'(x) = 2$ on $[0, 3]$, then $f(3) = 1 + 2 \\cdot 3 = 7$.

Check: $f(x) = 2x + 1$ has derivative $2$ and $f(0) = 1$, and $f(3) = 7$.

In this lesson we find where a function attains its absolute maximum on a closed interval, and the maximum value, from the graph of its derivative.`,
          `我们通过比较 $f$ 在各候选点的值来求最大值。只知道 $f'$ 的图像和 $f$ 的一个值时，每个函数值都来自一块有向面积：$f(b) = f(a) + \\int_{a}^{b} f'(x) \\, dx$。若 $f(0) = 1$，且在 $[0, 3]$ 上 $f'(x) = 2$，则 $f(3) = 1 + 2 \\cdot 3 = 7$。

检验：$f(x) = 2x + 1$ 的导数为 $2$，$f(0) = 1$，且 $f(3) = 7$。

这节课我们由导数的图像求函数在闭区间上于何处取得最大值，以及最大值是多少。`,
        )
      : t(
          `Minimizing works like maximizing, with the comparison reversed. Each value of $f$ still comes from a signed area: if $f(0) = 5$ and $f'(x) = -2$ on $[0, 3]$, then $f(3) = 5 + (-2) \\cdot 3 = -1$.

Check: $f(x) = 5 - 2x$ has derivative $-2$ and $f(0) = 5$, and $f(3) = -1$.

In this lesson we find where a function attains its absolute minimum on a closed interval, and the minimum value, from the graph of its derivative.`,
          `求最小值与求最大值的做法相同，只是比较的方向相反。每个函数值仍来自一块有向面积：若 $f(0) = 5$，且在 $[0, 3]$ 上 $f'(x) = -2$，则 $f(3) = 5 + (-2) \\cdot 3 = -1$。

检验：$f(x) = 5 - 2x$ 的导数为 $-2$，$f(0) = 5$，且 $f(3) = -1$。

这节课我们由导数的图像求函数在闭区间上于何处取得最小值，以及最小值是多少。`,
        ),
    knowledgePoints: [
      {
        id: max ? "locating-the-absolute-maximum" : "locating-the-absolute-minimum",
        figure:
          calculusDrawings3[
            max
              ? "maximizing-a-function-using-the-graph-of-its-derivative#locating-the-absolute-maximum"
              : "minimizing-a-function-using-the-graph-of-its-derivative#locating-the-absolute-minimum"
          ],
        title: max ? t("Locating the absolute maximum", "确定最大值点") : t("Locating the absolute minimum", "确定最小值点"),
        explanation: t(
          `The absolute ${word} of $f$ on a closed interval is at an endpoint or where $f'$ changes from ${up}. To compare the candidates, compute $f$ at each one: $f(b) = f(a) + \\int_{a}^{b} f'(x) \\, dx$, the signed area under the graph of $f'$. For example, suppose $f(-6) = 0$ and $f'$ changes from ${up} only at $x = 1$, with signed area $${k0}$ from $-6$ to $1$ and $${k1}$ from $1$ to $6$. Then $f(1) = ${k0}$ and $f(6) = ${k0 + k1}$, so the absolute ${word} is at $x = 1$.\n\nCheck: $f$ ${max ? "rises" : "falls"} up to $x = 1$ and ${max ? "falls" : "rises"} after it, so no other point can beat $x = 1$, and $f(1)$ is ${max ? "above" : "below"} both $f(-6)$ and $f(6)$.\n\n> **Watch out.** The ${max ? "highest" : "lowest"} point of the graph of $f'$ is where $f$ ${max ? "rises" : "falls"} fastest, not where $f$ is ${max ? "largest" : "smallest"}.`,
          `$f$ 在闭区间上的${zh}出现在端点处，或 $f'$ 由${upZh}的地方。比较各候选点时，算出 $f$ 在每个点的值：$f(b) = f(a) + \\int_{a}^{b} f'(x) \\, dx$，即 $f'$ 图像下方的有向面积。例如，设 $f(-6) = 0$，$f'$ 只在 $x = 1$ 处由${upZh}，从 $-6$ 到 $1$ 的有向面积为 $${k0}$，从 $1$ 到 $6$ 的为 $${k1}$。则 $f(1) = ${k0}$，$f(6) = ${k0 + k1}$，所以${zh}在 $x = 1$ 处取得。\n\n检验：$f$ 在 $x = 1$ 之前${max ? "上升" : "下降"}，之后${max ? "下降" : "上升"}，所以其他点都比不过 $x = 1$；而且 $f(1)$ ${max ? "大于" : "小于"} $f(-6)$ 和 $f(6)$。\n\n> **注意。** $f'$ 图像的${max ? "最高点" : "最低点"}是 $f$ ${max ? "上升" : "下降"}最快的地方，不是 $f$ ${max ? "最大" : "最小"}的地方。`,
        ),
        generate(rng) {
          const e = extremum(rng, max);
          const zs = zeros(e.ys).map((z) => z.x.toLatex());
          return {
            ...numberProblem({
              prompt: t(
                `The graph of $f'$ is shown, and $f(${e.x0}) = ${e.value}$. At which value of $x$ does $f$ attain its absolute ${word} on $[-6, 6]$?`,
                `图中是 $f'$ 的图像，且 $f(${e.x0}) = ${e.value}$。$f$ 在 $[-6, 6]$ 上于哪个 $x$ 处取得${zh}？`,
              ),
              answer: e.at,
              solveFor: "x",
              wrong: e.others.map(([x]) => x),
              solution: walked(
                [
                  [
                    ["List the candidates", "列出候选点"],
                    t(
                      `The candidates are the endpoints $x = -6$ and $x = 6$ and the points where $f'$ changes sign, ${xsAt(zs).en}.`,
                      `候选点为端点 $x = -6$、$x = 6$，以及 $f'$ 变号的点 ${xsAt(zs)["zh-CN"]}。`,
                    ),
                  ],
                  [
                    ["Find f at each candidate", "求 f 在各候选点的值"],
                    t(
                      `Start from $f(${e.x0}) = ${e.value}$ and add the signed area under $f'$:`,
                      `从 $f(${e.x0}) = ${e.value}$ 出发，加上 $f'$ 图像下方的有向面积：`,
                    ),
                    valueLines(e.x0, e.value, [[e.at, e.best], ...e.others]),
                  ],
                  [
                    ["Compare", "比较"],
                    t(
                      `The ${greatest} value is $${e.best.toLatex()}$, so the absolute ${word} is at $x = ${e.at.toLatex()}$.`,
                      `${greatestZh}的值是 $${e.best.toLatex()}$，所以${zh}在 $x = ${e.at.toLatex()}$ 处取得。`,
                    ),
                  ],
                ],
                fromWinner(e.ys, e.at, e.others, max),
              ),
            }),
            figure: zigzagFigure(e.ys, "f'"),
          };
        },
      },
      {
        id: max ? "finding-the-maximum-value" : "finding-the-minimum-value",
        title: max ? t("Finding the maximum value", "求最大值") : t("Finding the minimum value", "求最小值"),
        explanation: t(
          `Once the location $c$ is known, the ${word} value is $f(c) = f(a) + \\int_{a}^{c} f'(x) \\, dx$, starting from the point $a$ where $f$ is known. Integrating backward, from $a$ to $c < a$, reverses the sign. For example, if $f(0) = 4$, the ${word} is at $c = -2$, and the signed area under $f'$ from $-2$ to $0$ is $${back}$, then $f(-2) = 4 - ${par(back)} = ${4 - back}$.\n\nCheck: going forward from $x = -2$, $f(0) = ${4 - back} + ${par(back)}$, which is the known value $4$.\n\n> **Watch out.** The value of $f'$ at $c$ is not the ${word}: it is the slope there.`,
          `确定位置 $c$ 后，${zh}为 $f(c) = f(a) + \\int_{a}^{c} f'(x) \\, dx$，从已知 $f$ 值的点 $a$ 出发。若向后积分（$c < a$），符号相反。例如，若 $f(0) = 4$，${zh}在 $c = -2$ 处取得，$f'$ 图像下方从 $-2$ 到 $0$ 的有向面积为 $${back}$，则 $f(-2) = 4 - ${par(back)} = ${4 - back}$。\n\n检验：从 $x = -2$ 向前走，$f(0) = ${4 - back} + ${par(back)}$，正是已知值 $4$。\n\n> **注意。** $f'$ 在 $c$ 处的值不是${zh}，而是那里的斜率。`,
        ),
        generate(rng) {
          const e = extremum(rng, max);
          const area = e.best.sub(Q.of(e.value));
          const at = e.at.toLatex();
          return {
            ...numberProblem({
              prompt: t(
                `The graph of $f'$ is shown, and $f(${e.x0}) = ${e.value}$. Find the absolute ${word} value of $f$ on $[-6, 6]$.`,
                `图中是 $f'$ 的图像，且 $f(${e.x0}) = ${e.value}$。求 $f$ 在 $[-6, 6]$ 上的${zh}。`,
              ),
              answer: e.best,
              wrong: [...e.others.map(([, v]) => v), area, Q.of(e.value).sub(area)],
              solution: walked(
                [
                  [
                    [`Locate the ${word}`, `确定${zh}点`],
                    t(
                      `Comparing $f$ at the endpoints and at the points where $f'$ changes sign puts the absolute ${word} at $x = ${at}$.`,
                      `比较 $f$ 在端点和 $f'$ 变号点处的值，可知${zh}在 $x = ${at}$ 处取得。`,
                    ),
                  ],
                  [
                    ["Add the signed area", "加上有向面积"],
                    t(
                      `Start from $f(${e.x0}) = ${e.value}$ and add the signed area under $f'$ up to $x = ${at}$:`,
                      `从 $f(${e.x0}) = ${e.value}$ 出发，加上 $f'$ 图像下方到 $x = ${at}$ 为止的有向面积：`,
                    ),
                    [`f(${at}) = ${e.value} + ${int(e.x0, at, "f'(x)")} = ${e.value} + ${par(area)} = ${e.best.toLatex()}`],
                  ],
                ],
                t(
                  `The other candidates give ${max ? "smaller" : "larger"} values:${steps(...valueLines(e.x0, e.value, e.others))}So $${e.best.toLatex()}$ is the ${greatest} of them.`,
                  `其他候选点给出的值都更${max ? "小" : "大"}：${steps(...valueLines(e.x0, e.value, e.others))}所以 $${e.best.toLatex()}$ 是其中${greatestZh}的。`,
                ),
              ),
            }),
            figure: zigzagFigure(e.ys, "f'"),
          };
        },
      },
    ],
  };
}

/** maximizingAFunctionUsingTheGraphOfItsDerivative finds absolute maxima from the graph of f′. */
export const maximizingAFunctionUsingTheGraphOfItsDerivative: TopicDef = extremumTopic(true);

/** minimizingAFunctionUsingTheGraphOfItsDerivative finds absolute minima from the graph of f′. */
export const minimizingAFunctionUsingTheGraphOfItsDerivative: TopicDef = extremumTopic(false);

/** furtherOptimizingFunctionsUsingGraphsOfDerivatives finds local extrema and extrema on subintervals from the graph of f′. */
export const furtherOptimizingFunctionsUsingGraphsOfDerivatives: TopicDef = {
  id: "further-optimizing-functions-using-graphs-of-derivatives",
  title: t("Further Optimizing Functions Using Graphs of Derivatives", "利用导数图像进一步求最值"),
  summary: t(
    "Find local extrema and extreme values on subintervals from the graph of a derivative.",
    "由导数图像求局部极值以及子区间上的最值。",
  ),
  prerequisites: ["minimizing-a-function-using-the-graph-of-its-derivative"],
  encompasses: [
    { topic: "maximizing-a-function-using-the-graph-of-its-derivative", weight: 0.4 },
    { topic: "minimizing-a-function-using-the-graph-of-its-derivative", weight: 0.4 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `We found absolute extrema on $[-6, 6]$ from the graph of $f'$. The same graph shows local extrema. If $f'(x) = x - 2$, then $f'$ is negative before $x = 2$ and positive after it, so $f$ falls and then rises, with a local minimum at $x = 2$.

Check: $f(x) = \\frac{x^{2}}{2} - 2x$ has this derivative, and its graph is a parabola opening upward with its vertex at $x = 2$.

In this lesson we find local extrema from the graph of $f'$, and the greatest and least values of $f$ on a smaller interval.`,
    `我们已经由 $f'$ 的图像求过 $[-6, 6]$ 上的最值。同一个图像也能给出局部极值。若 $f'(x) = x - 2$，则 $f'$ 在 $x = 2$ 之前为负、之后为正，所以 $f$ 先降后升，在 $x = 2$ 处取得局部极小值。

检验：$f(x) = \\frac{x^{2}}{2} - 2x$ 的导数正是它，其图像是开口向上的抛物线，顶点在 $x = 2$ 处。

这节课我们由 $f'$ 的图像求局部极值，以及 $f$ 在较小区间上的最大值和最小值。`,
  ),
  knowledgePoints: [
    {
      id: "local-extrema-from-the-graph-of-the-derivative",
      figure: calculusDrawings3["further-optimizing-functions-using-graphs-of-derivatives#local-extrema-from-the-graph-of-the-derivative"],
      title: t("Local extrema from the graph of the derivative", "由导数图像求局部极值"),
      explanation: t(
        "$f$ has a local maximum where $f'$ changes from positive to negative, and a local minimum where it changes from negative to positive. A point where $f'$ touches zero without changing sign is neither. Points where $f'$ itself is largest or smallest are inflection points of $f$, not extrema. For example, if $f'$ is negative on $(-6, -2)$, positive on $(-2, 3)$ and negative on $(3, 6)$, then $f$ has a local minimum at $x = -2$ and a local maximum at $x = 3$.\n\nCheck: $f$ falls, then rises, then falls. The turn from falling to rising at $x = -2$ is a low point, and the turn from rising to falling at $x = 3$ is a high point.\n\n> **Watch out.** Read where the graph of $f'$ crosses the $x$-axis, not where it peaks: a peak of $f'$ is where $f$ rises fastest.",
        "$f'$ 由正变负处，$f$ 有局部极大值；由负变正处，$f$ 有局部极小值。$f'$ 为零但不变号的点两者都不是。$f'$ 本身最大或最小的点是 $f$ 的拐点，不是极值点。例如，若 $f'$ 在 $(-6, -2)$ 上为负，在 $(-2, 3)$ 上为正，在 $(3, 6)$ 上为负，则 $f$ 在 $x = -2$ 处有局部极小值，在 $x = 3$ 处有局部极大值。\n\n检验：$f$ 先降、再升、又降。在 $x = -2$ 处由降转升，是低点；在 $x = 3$ 处由升转降，是高点。\n\n> **注意。** 要看 $f'$ 的图像在哪里穿过 $x$ 轴，而不是在哪里达到峰值：$f'$ 的峰值是 $f$ 上升最快的地方。",
      ),
      generate(rng) {
        const wantMax = rng.bool();
        let ys = fallbackYs;
        for (let tries = 0; tries < 400; tries++) {
          const candidate = zigzag(rng);
          if (zeros(candidate).some((z) => z.up !== wantMax)) {
            ys = candidate;
            break;
          }
        }
        const zs = zeros(ys);
        const hits = zs.filter((z) => z.up !== wantMax).map((z) => z.x);
        const right = hits.map((x) => x.toLatex());
        const other = zs.filter((z) => z.up === wantMax).map((z) => z.x.toLatex());
        const peaks = zigzagXs.filter((_, i) => i > 0 && i < 6 && (ys[i]! - ys[i - 1]!) * (ys[i + 1]! - ys[i]!) < 0).map(String);
        const [kind, kindZh] = wantMax ? ["maximum", "极大值"] : ["minimum", "极小值"];
        const F = (x: Q) => zigAt(ys, x);
        const around = hits.map((x) => {
          const node = x.isInteger() && x.toNumber() % 2 === 0;
          const n = Math.floor(x.toNumber() / 2) * 2;
          const [l, r] = node ? [x.sub(Q.of(2)), x.add(Q.of(2))] : [Q.of(n), Q.of(n + 2)];
          return `F(${l.toLatex()}) = ${F(l).toLatex()}, \\; F(${x.toLatex()}) = ${F(x).toLatex()}, \\; F(${r.toLatex()}) = ${F(r).toLatex()}`;
        });
        return {
          ...solutionsProblem({
            prompt: t(
              `The graph of $f'$ on $[-6, 6]$ is shown. Find every $x$ in $(-6, 6)$ at which $f$ has a local ${kind}.`,
              `图中是 $f'$ 在 $[-6, 6]$ 上的图像。求 $(-6, 6)$ 内 $f$ 取得局部${kindZh}的所有 $x$。`,
            ),
            values: right,
            wrong: [other, peaks, zs.map((z) => z.x.toLatex())],
            solution: walked(
              [
                [
                  ["Find the sign changes of f′", "找出 f′ 的变号点"],
                  t(
                    `From the graph, $f'$ changes sign at ${xsAt(zs.map((z) => z.x.toLatex())).en}.`,
                    `由图像，$f'$ 在 ${xsAt(zs.map((z) => z.x.toLatex()))["zh-CN"]} 处变号。`,
                  ),
                ],
                [
                  ["Read the direction of each change", "看清每次变号的方向"],
                  t(
                    `Where $f'$ changes from ${wantMax ? "positive to negative" : "negative to positive"}, $f$ has a local ${kind}. These points are ${xsAt(right).en}.${other.length ? ` The change is the other way at ${xsAt(other).en}.` : ""}`,
                    `$f'$ 由${wantMax ? "正变负" : "负变正"}的地方，$f$ 取得局部${kindZh}。这些点是 ${xsAt(right)["zh-CN"]}。${other.length ? `变号方向相反的点是 ${xsAt(other)["zh-CN"]}。` : ""}`,
                  ),
                ],
              ],
              t(
                `Use values of $f$ instead. Let $F(x) = \\int_{-6}^{x} f'(t) \\, dt$, which differs from $f$ by a constant. At each answer and the nodes on either side of it:${steps(...around)}Each time the middle value is ${wantMax ? "the largest" : "the smallest"} of the three, as a local ${kind} requires.`,
                `换一种方法，用 $f$ 的值。设 $F(x) = \\int_{-6}^{x} f'(t) \\, dt$，它与 $f$ 只差一个常数。在每个答案及其两侧的节点处：${steps(...around)}每一组中间的值都是三者中${wantMax ? "最大" : "最小"}的，符合局部${kindZh}的要求。`,
              ),
            ),
          }),
          figure: zigzagFigure(ys, "f'"),
        };
      },
    },
    {
      id: "extreme-values-on-a-subinterval",
      title: t("Extreme values on a subinterval", "子区间上的最值"),
      explanation: t(
        "On a smaller interval $[p, q]$, the candidates are $p$, $q$ and the sign changes of $f'$ between them. Find each value of $f$ from a known value by adding signed areas, then compare. For example, on $[-4, 2]$ with $f(-4) = 1$, if $f'$ changes sign only at $x = 0$ and the signed areas are $3$ from $-4$ to $0$ and $-5$ from $0$ to $2$, then the candidates give $f(-4) = 1$, $f(0) = 4$ and $f(2) = -1$. The greatest value is $4$ and the least is $-1$.\n\nCheck: $f$ rises by $3$ and then falls by $5$, so its top is at the turn, $1 + 3$, and its bottom is at the right end, $4 - 5$.\n\n> **Watch out.** Sign changes of $f'$ outside $[p, q]$ are not candidates, even if $f$ is larger or smaller there.",
        "在较小的区间 $[p, q]$ 上，候选点为 $p$、$q$ 以及其间 $f'$ 变号的点。从已知的函数值出发，加上有向面积求出各点的 $f$ 值，再比较。例如，在 $[-4, 2]$ 上，$f(-4) = 1$，若 $f'$ 只在 $x = 0$ 处变号，且从 $-4$ 到 $0$ 的有向面积为 $3$、从 $0$ 到 $2$ 的为 $-5$，则各候选值为 $f(-4) = 1$、$f(0) = 4$、$f(2) = -1$。最大值为 $4$，最小值为 $-1$。\n\n检验：$f$ 先上升 $3$ 再下降 $5$，所以最高点在转折处，为 $1 + 3$；最低点在右端，为 $4 - 5$。\n\n> **注意。** $[p, q]$ 之外的 $f'$ 变号点不是候选点，即使 $f$ 在那里更大或更小。",
      ),
      generate(rng) {
        const max = rng.bool();
        const interior = rng.bool(0.8);
        let pick: { ys: readonly number[]; p: number; q: number; value: number } = { ys: fallbackYs, p: -4, q: 2, value: 1 };
        for (let tries = 0; tries < 400; tries++) {
          const ys = zigzag(rng);
          const [p, q] = nodePair(rng);
          const value = rng.int(-5, 8);
          if (q - p < 4) continue;
          const inside = zeros(ys)
            .map((z) => z.x)
            .filter((x) => x.cmp(Q.of(p)) > 0 && x.cmp(Q.of(q)) < 0);
          if (inside.length === 0) continue;
          const sorted = ranked(ys, p, value, [Q.of(p), ...inside, Q.of(q)], max);
          if (sorted[0]![1].eq(sorted[1]![1])) continue;
          if (interior && (sorted[0]![0].eq(Q.of(p)) || sorted[0]![0].eq(Q.of(q)))) continue;
          pick = { ys, p, q, value };
          break;
        }
        const { ys, p, q, value } = pick;
        const inside = zeros(ys)
          .map((z) => z.x)
          .filter((x) => x.cmp(Q.of(p)) > 0 && x.cmp(Q.of(q)) < 0);
        const candidates = [Q.of(p), ...inside, Q.of(q)];
        const sorted = ranked(ys, p, value, candidates, max);
        const [at, best] = sorted[0]!;
        const f = (x: Q) => Q.of(value).add(zigIntegral(ys, Q.of(p), x));
        const whole = [Q.of(-6), ...zeros(ys).map((z) => z.x), Q.of(6)].map(f);
        const global = whole.reduce((m, v) => (max ? (v.cmp(m) > 0 ? v : m) : v.cmp(m) < 0 ? v : m));
        const [greatest, greatestZh] = max ? ["greatest", "最大值"] : ["least", "最小值"];
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $f'$ is shown, and $f(${p}) = ${value}$. Find the ${greatest} value of $f$ on $[${p}, ${q}]$.`,
              `图中是 $f'$ 的图像，且 $f(${p}) = ${value}$。求 $f$ 在 $[${p}, ${q}]$ 上的${greatestZh}。`,
            ),
            answer: best,
            wrong: [...sorted.slice(1).map(([, v]) => v), global],
            solution: walked(
              [
                [
                  ["List the candidates", "列出候选点"],
                  t(
                    `The candidates are the endpoints $x = ${p}$ and $x = ${q}$ and the sign changes of $f'$ between them, ${xsAt(inside.map((x) => x.toLatex())).en}.`,
                    `候选点为端点 $x = ${p}$、$x = ${q}$，以及其间 $f'$ 的变号点 ${xsAt(inside.map((x) => x.toLatex()))["zh-CN"]}。`,
                  ),
                ],
                [
                  ["Find f at each candidate", "求 f 在各候选点的值"],
                  t(
                    `Start from $f(${p}) = ${value}$ and add the signed area under $f'$:`,
                    `从 $f(${p}) = ${value}$ 出发，加上 $f'$ 图像下方的有向面积：`,
                  ),
                  valueLines(
                    p,
                    value,
                    candidates.map((x) => [x, f(x)] as const),
                  ),
                ],
                [
                  ["Compare", "比较"],
                  t(
                    `The ${greatest} of these is $${best.toLatex()}$, at $x = ${at.toLatex()}$.`,
                    `其中${greatestZh}为 $${best.toLatex()}$，在 $x = ${at.toLatex()}$ 处取得。`,
                  ),
                ],
              ],
              fromWinner(ys, at, sorted.slice(1), max),
            ),
          }),
          figure: zigzagFigure(ys, "f'"),
        };
      },
    },
  ],
};

/** calculusIAccumulationTopics are the topics of Calculus I modules 8.26 and 8.27. */
export const calculusIAccumulationTopics: readonly TopicDef[] = [
  theAreaBoundedByACurveAndTheXAxis,
  evaluatingDefiniteIntegralsUsingSymmetry,
  findingTheAreaBetweenACurveAndTheXAxisWhenTheyIntersect,
  theAreaBoundedByACurveAndTheYAxis,
  calculatingTheDefiniteIntegralOfAFunctionGivenItsGraph,
  calculatingTheDefiniteIntegralOfAFunctionsDerivativeGivenItsGraph,
  definiteIntegralsOfPiecewiseFunctions,
  theIntegralAsAnAccumulationFunction,
  theSecondFundamentalTheoremOfCalculus,
  maximizingAFunctionUsingTheGraphOfItsDerivative,
  minimizingAFunctionUsingTheGraphOfItsDerivative,
  furtherOptimizingFunctionsUsingGraphsOfDerivatives,
];
