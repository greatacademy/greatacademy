import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { functionProblem, numberProblem, solutionsProblem, steps } from "../problems.ts";
import { fac, type Poly, par, piLatex, pLatex, table } from "./calculus-common.ts";
import { zigzag, zigzagFigure, zigzagXs } from "./calculus-i-extrema.ts";
import { antiderivativeAt, antiderivativeLatex, qAt } from "./calculus-i-riemann.ts";

// Calculus I unit 8: Integration, modules 8.26 and 8.27.

/** integral computes ∫ p(x) dx from a to b for integer limits. */
const integral = (p: Poly, a: number, b: number) => antiderivativeAt(p, b).sub(antiderivativeAt(p, a));

/** rootsPoly expands k(x − r₁)(x − r₂)… into coefficients, constant first. */
function rootsPoly(k: number, roots: readonly number[]): Poly {
  let p = [k];
  for (const r of roots) p = [...p.map((c) => -r * c), 0].map((c, i) => c + (i > 0 ? p[i - 1]! : 0));
  return p;
}

/** areaBetween computes the area between y = p(x) and the x-axis on [a, b], splitting at the integer roots inside. */
function areaBetween(p: Poly, roots: readonly number[], a: number, b: number): Q {
  const cuts = [a, ...roots.filter((r) => r > a && r < b).sort((x, y) => x - y), b];
  return cuts.slice(1).reduce((s, x, i) => s.add(integral(p, cuts[i]!, x).abs()), Q.zero);
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
  knowledgePoints: [
    {
      id: "areas-above-the-x-axis",
      title: t("Areas above the x-axis", "x 轴上方的面积"),
      explanation: t(
        "If $f(x) \\ge 0$ on $[a, b]$, the area of the region bounded by $y = f(x)$, the $x$-axis and the lines $x = a$ and $x = b$ is $\\int_{a}^{b} f(x) \\, dx$.",
        "若在 $[a, b]$ 上 $f(x) \\ge 0$，则由 $y = f(x)$、$x$ 轴及直线 $x = a$、$x = b$ 围成的区域面积为 $\\int_{a}^{b} f(x) \\, dx$。",
      ),
      generate(rng) {
        for (;;) {
          const deg = rng.int(1, 3);
          const p: number[] = Array.from({ length: deg + 1 }, () => rng.int(-5, 5));
          p[deg] = rng.nonZero(-3, 3);
          const a = rng.int(-3, 2);
          const b = a + rng.int(1, 4);
          if (!Array.from({ length: 41 }, (_, i) => qAt(p, Q.of(40 * a + i * (b - a), 40))).every((y) => y.sign() > 0)) continue;
          const answer = integral(p, a, b);
          return numberProblem({
            prompt: t(
              `Find the area of the region bounded by $y = ${pLatex(p)}$, the $x$-axis, and the lines $x = ${a}$ and $x = ${b}$.`,
              `求由 $y = ${pLatex(p)}$、$x$ 轴及直线 $x = ${a}$、$x = ${b}$ 围成的区域面积。`,
            ),
            answer,
            wrong: [antiderivativeAt(p, b), answer.neg(), qAt(p, Q.of(b)).sub(qAt(p, Q.of(a)))],
            solution: t(
              `$y > 0$ on $[${a}, ${b}]$, so the area is $${int(a, b, `(${pLatex(p)})`)} = \\Big[${antiderivativeLatex(p)}\\Big]_{${a}}^{${b}} = ${answer.toLatex()}$.`,
              `在 $[${a}, ${b}]$ 上 $y > 0$，所以面积为 $${int(a, b, `(${pLatex(p)})`)} = \\Big[${antiderivativeLatex(p)}\\Big]_{${a}}^{${b}} = ${answer.toLatex()}$。`,
            ),
          });
        }
      },
    },
    {
      id: "areas-below-the-x-axis",
      title: t("Areas below the x-axis", "x 轴下方的面积"),
      explanation: t(
        "Where $f(x) \\le 0$, the integral is negative: it is minus the area. So the area between the curve and the axis is $-\\int_{a}^{b} f(x) \\, dx = \\left|\\int_{a}^{b} f(x) \\, dx\\right|$. For a region enclosed by a curve and the axis, the limits are the $x$-intercepts.",
        "在 $f(x) \\le 0$ 的地方，积分为负，等于面积的相反数。所以曲线与 $x$ 轴之间的面积是 $-\\int_{a}^{b} f(x) \\, dx = \\left|\\int_{a}^{b} f(x) \\, dx\\right|$。对于曲线与 $x$ 轴围成的区域，积分限就是 $x$ 截距。",
      ),
      generate(rng) {
        const r1 = rng.int(-4, 2);
        const r2 = r1 + rng.int(1, 5);
        const k = rng.nonZero(-3, 3);
        const p = rootsPoly(k, [r1, r2]);
        const net = integral(p, r1, r2);
        const answer = net.abs();
        return numberProblem({
          prompt: t(
            `Find the area of the region enclosed by $y = ${pLatex(p)}$ and the $x$-axis.`,
            `求 $y = ${pLatex(p)}$ 与 $x$ 轴围成的区域面积。`,
          ),
          answer,
          wrong: [net.neg(), answer.mul(Q.of(2)), Q.of((r2 - r1) ** 3, 6), net],
          solution: t(
            `$${pLatex(p)} = ${k === 1 ? "" : k === -1 ? "-" : k}${fac(r1)}${fac(r2)}$ meets the $x$-axis at $x = ${r1}$ and $x = ${r2}$, and ${k > 0 ? "is below" : "is above"} the axis between them. $${int(r1, r2, `(${pLatex(p)})`)} = ${net.toLatex()}$, so the area is $${answer.toLatex()}$.`,
            `$${pLatex(p)} = ${k === 1 ? "" : k === -1 ? "-" : k}${fac(r1)}${fac(r2)}$ 与 $x$ 轴交于 $x = ${r1}$ 和 $x = ${r2}$，在两者之间位于 $x$ 轴${k > 0 ? "下方" : "上方"}。$${int(r1, r2, `(${pLatex(p)})`)} = ${net.toLatex()}$，所以面积为 $${answer.toLatex()}$。`,
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
  encompasses: [{ topic: "properties-of-definite-integrals-involving-the-limits-of-integration", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "odd-and-even-integrands",
      title: t("Odd and even integrands", "奇被积函数与偶被积函数"),
      explanation: t(
        "On $[-a, a]$ the areas of an odd function cancel, and those of an even function match:\n\n$$f \\text{ odd} \\Rightarrow \\int_{-a}^{a} f(x) \\, dx = 0, \\qquad f \\text{ even} \\Rightarrow \\int_{-a}^{a} f(x) \\, dx = 2\\int_{0}^{a} f(x) \\, dx.$$\n\nThis evaluates the odd part of an integrand even when it has no antiderivative you can find.",
        "在 $[-a, a]$ 上，奇函数的面积相互抵消，偶函数的面积左右相等：\n\n$$f \\text{ 为奇函数} \\Rightarrow \\int_{-a}^{a} f(x) \\, dx = 0, \\qquad f \\text{ 为偶函数} \\Rightarrow \\int_{-a}^{a} f(x) \\, dx = 2\\int_{0}^{a} f(x) \\, dx。$$\n\n即使被积函数的奇部分没有能求出的原函数，也可以这样计算。",
      ),
      generate(rng) {
        const odd = rng.pick(oddParts);
        const k = rng.nonZero(-5, 5);
        const a = rng.int(1, 4);
        const even: Poly = rng.bool(0.25) ? [0] : [rng.int(-6, 6), 0, rng.int(-3, 3) || 1];
        const evenL = pLatex(even);
        const answer = integral(even, -a, a);
        const body = `\\left(${k === 1 ? "" : k === -1 ? "-" : k}${odd}${evenL === "0" ? "" : even[2]! < 0 ? ` ${evenL}` : ` + ${evenL}`}\\right)`;
        return numberProblem({
          prompt: t(`Evaluate $${int(-a, a, body)}$.`, `计算 $${int(-a, a, body)}$。`),
          answer,
          wrong: [answer.div(Q.of(2)), Q.zero, integral(even, 0, a).neg(), answer.add(Q.of(2 * k))],
          solution: t(
            `$${odd}$ is odd, so its integral over $[-${a}, ${a}]$ is $0$.${evenL === "0" ? "" : ` The rest is even: $2${int(0, a, `(${evenL})`)} = ${answer.toLatex()}$.`} The integral is $${answer.toLatex()}$.`,
            `$${odd}$ 是奇函数，它在 $[-${a}, ${a}]$ 上的积分为 $0$。${evenL === "0" ? "" : `其余部分是偶函数：$2${int(0, a, `(${evenL})`)} = ${answer.toLatex()}$。`}积分为 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "using-symmetry-with-known-integrals",
      title: t("Using symmetry with known integrals", "结合已知积分利用对称性"),
      explanation: t(
        "An even function has a graph symmetric about the vertical axis, so both halves have equal area, while for an odd function the two halves cancel. If $\\int_{0}^{a} f(x) \\, dx = P$, then for even $f$, $\\int_{-a}^{0} f(x) \\, dx = P$ and $\\int_{-a}^{a} f(x) \\, dx = 2P$; for odd $f$, $\\int_{-a}^{0} f(x) \\, dx = -P$ and $\\int_{-a}^{a} f(x) \\, dx = 0$.",
        "偶函数的图像关于纵轴对称，所以两半面积相等；而奇函数的两半相互抵消。若 $\\int_{0}^{a} f(x) \\, dx = P$，则当 $f$ 为偶函数时，$\\int_{-a}^{0} f(x) \\, dx = P$，$\\int_{-a}^{a} f(x) \\, dx = 2P$；当 $f$ 为奇函数时，$\\int_{-a}^{0} f(x) \\, dx = -P$，$\\int_{-a}^{a} f(x) \\, dx = 0$。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const P = rng.nonZero(-15, 15);
        const isEven = rng.bool();
        const whole = rng.bool();
        const answer = whole ? (isEven ? 2 * P : 0) : isEven ? P : -P;
        const ask = whole ? int(-a, a, "f(x)") : int(-a, 0, "f(x)");
        return numberProblem({
          prompt: t(
            `$f$ is an ${isEven ? "even" : "odd"} function with $${int(0, a, "f(x)")} = ${P}$. Find $${ask}$.`,
            `$f$ 是${isEven ? "偶" : "奇"}函数，且 $${int(0, a, "f(x)")} = ${P}$。求 $${ask}$。`,
          ),
          answer,
          wrong: [2 * P, 0, P, -P, -2 * P],
          solution: t(
            `The graph of an ${isEven ? `even function is symmetric about the $y$-axis, so the area on $[-${a}, 0]$ matches that on $[0, ${a}]$` : `odd function is symmetric about the origin, so the integral on $[-${a}, 0]$ is the negative of that on $[0, ${a}]$`}. Hence $${ask} = ${answer}$.`,
            `${isEven ? `偶函数的图像关于 $y$ 轴对称，$[-${a}, 0]$ 上的积分与 $[0, ${a}]$ 上的相等` : `奇函数的图像关于原点对称，$[-${a}, 0]$ 上的积分是 $[0, ${a}]$ 上积分的相反数`}。因此 $${ask} = ${answer}$。`,
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
  knowledgePoints: [
    {
      id: "total-area-across-intercepts",
      title: t("Total area across intercepts", "跨越截距的总面积"),
      explanation: t(
        "The integral counts area below the axis as negative, so it can be much smaller than the total area. To find the total area, find where the curve crosses the axis, integrate on each piece, and add the absolute values.",
        "积分把 $x$ 轴下方的面积算作负数，所以它可能比总面积小得多。求总面积时，先找出曲线与 $x$ 轴的交点，在每一段上分别积分，再把绝对值相加。",
      ),
      generate(rng) {
        for (;;) {
          const cubic = rng.bool(0.3);
          const roots = cubic ? [rng.int(-3, -1), 0, rng.int(1, 3)] : [rng.int(-4, 1), rng.int(-1, 4)];
          const sorted = [...new Set(roots)].sort((x, y) => x - y);
          if (sorted.length < roots.length) continue;
          const k = rng.nonZero(-2, 2);
          const p = rootsPoly(k, sorted);
          const a = rng.int(sorted[0]! - 2, sorted[0]! + 1);
          const b = rng.int(Math.max(a + 1, sorted[0]! + 1), sorted.at(-1)! + 2);
          const inside = sorted.filter((r) => r > a && r < b);
          if (inside.length === 0) continue;
          const answer = areaBetween(p, sorted, a, b);
          const net = integral(p, a, b);
          if (answer.eq(net.abs())) continue;
          const cuts = [a, ...inside, b];
          const pieces = cuts.slice(1).map((x, i) => integral(p, cuts[i]!, x));
          return numberProblem({
            prompt: t(
              `Find the total area between $y = ${pLatex(p)}$ and the $x$-axis from $x = ${a}$ to $x = ${b}$.`,
              `求 $y = ${pLatex(p)}$ 与 $x$ 轴之间从 $x = ${a}$ 到 $x = ${b}$ 的总面积。`,
            ),
            answer,
            wrong: [net, net.abs(), pieces[0]!.abs()],
            solution: t(
              `The curve crosses the axis at $x = ${inside.join(", ")}$. On the pieces the integrals are $${pieces.map((q) => q.toLatex()).join(", ")}$, so the total area is $${pieces.map((q) => q.abs().toLatex()).join(" + ")} = ${answer.toLatex()}$.`,
              `曲线在 $x = ${inside.join("、")}$ 处穿过 $x$ 轴。各段上的积分为 $${pieces.map((q) => q.toLatex()).join(", ")}$，所以总面积为 $${pieces.map((q) => q.abs().toLatex()).join(" + ")} = ${answer.toLatex()}$。`,
            ),
          });
        }
      },
    },
    {
      id: "total-area-under-sine-and-cosine-curves",
      title: t("Total area under sine and cosine curves", "正弦、余弦曲线与 x 轴之间的总面积"),
      explanation: t(
        "Sine and cosine cross the axis again and again, so over a long interval their integral cancels: $\\int_{0}^{2\\pi} \\sin x \\, dx = 0$, although the curve encloses area. Split at the zeros, which are the multiples of $\\pi$ for $\\sin x$ and the odd multiples of $\\frac{\\pi}{2}$ for $\\cos x$, and add the absolute values of the pieces.\n\nEach arch of $\\sin x$ between consecutive zeros has area $\\int_{0}^{\\pi} \\sin x \\, dx = 2$, and each half-arch from a zero to a peak has area $1$. So $y = \\sin x$ from $0$ to $2\\pi$ encloses a total area of $2 + 2 = 4$.",
        "正弦和余弦反复穿过 $x$ 轴，所以在较长的区间上积分会相互抵消：$\\int_{0}^{2\\pi} \\sin x \\, dx = 0$，但曲线确实围成了面积。在零点处拆分区间——$\\sin x$ 的零点是 $\\pi$ 的整数倍，$\\cos x$ 的零点是 $\\frac{\\pi}{2}$ 的奇数倍——再把各段积分的绝对值相加。\n\n$\\sin x$ 在相邻两个零点之间的每一拱的面积为 $\\int_{0}^{\\pi} \\sin x \\, dx = 2$，从零点到峰值的半拱面积为 $1$。所以 $y = \\sin x$ 从 $0$ 到 $2\\pi$ 围成的总面积为 $2 + 2 = 4$。",
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
        const zeros = cuts.slice(1, -1).map(at).join(", ");
        const integrals = pieces.map((v, i) => `\\int_{${at(cuts[i] ?? 0)}}^{${at(cuts[i + 1] ?? 0)}} ${f} \\, dx = ${v}`);
        return numberProblem({
          prompt: t(
            `Find the total area between $y = ${f}$ and the $x$-axis from $x = 0$ to $x = ${at(m)}$.`,
            `求 $y = ${f}$ 与 $x$ 轴之间从 $x = 0$ 到 $x = ${at(m)}$ 的总面积。`,
          ),
          answer: total,
          form: "integer",
          wrong: [net, Math.abs(net), 2 * total, total / 2, a * m * 2].filter((w) => Number.isInteger(w)),
          solution: t(
            `The curve crosses the axis at $x = ${zeros}$. Integrate on each piece:${steps(...integrals)}The total area is $${pieces.map((v) => Math.abs(v)).join(" + ")} = ${total}$, while the integral over the whole interval is only $${net}$.`,
            `曲线在 $x = ${zeros}$ 处穿过 $x$ 轴。在每一段上分别积分：${steps(...integrals)}总面积为 $${pieces.map((v) => Math.abs(v)).join(" + ")} = ${total}$，而整个区间上的积分只有 $${net}$。`,
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
  knowledgePoints: [
    {
      id: "integrating-with-respect-to-y",
      title: t("Integrating with respect to y", "对 y 积分"),
      explanation: t(
        "For a curve $x = g(y)$ with $g(y) \\ge 0$ on $[c, d]$, horizontal strips of width $g(y)$ and height $dy$ fill the region between the curve, the $y$-axis and the lines $y = c$, $y = d$. Its area is $\\int_{c}^{d} g(y) \\, dy$.",
        "对曲线 $x = g(y)$，若在 $[c, d]$ 上 $g(y) \\ge 0$，则宽为 $g(y)$、高为 $dy$ 的水平窄条填满曲线、$y$ 轴与直线 $y = c$、$y = d$ 之间的区域。其面积为 $\\int_{c}^{d} g(y) \\, dy$。",
      ),
      generate(rng) {
        for (;;) {
          const p: Poly = [rng.int(-2, 8), rng.int(-4, 4), rng.nonZero(-2, 2)];
          const c = rng.int(-3, 2);
          const d = c + rng.int(1, 4);
          if (!Array.from({ length: 41 }, (_, i) => qAt(p, Q.of(40 * c + i * (d - c), 40))).every((y) => y.sign() > 0)) continue;
          const answer = integral(p, c, d);
          const g = pLatex(p, "y");
          return numberProblem({
            prompt: t(
              `Find the area of the region bounded by $x = ${g}$, the $y$-axis, and the lines $y = ${c}$ and $y = ${d}$.`,
              `求由 $x = ${g}$、$y$ 轴及直线 $y = ${c}$、$y = ${d}$ 围成的区域面积。`,
            ),
            answer,
            wrong: [answer.neg(), antiderivativeAt(p, d), qAt(p, Q.of(d)).sub(qAt(p, Q.of(c)))],
            solution: t(
              `$x = ${g} > 0$ for $${c} \\le y \\le ${d}$, so the area is $${int(c, d, `(${g})`, "y")} = \\Big[${antiderivativeLatex(p).replaceAll("x", "y")}\\Big]_{${c}}^{${d}} = ${answer.toLatex()}$.`,
              `当 $${c} \\le y \\le ${d}$ 时 $x = ${g} > 0$，所以面积为 $${int(c, d, `(${g})`, "y")} = \\Big[${antiderivativeLatex(p).replaceAll("x", "y")}\\Big]_{${c}}^{${d}} = ${answer.toLatex()}$。`,
            ),
          });
        }
      },
    },
    {
      id: "rewriting-curves-as-functions-of-y",
      title: t("Rewriting curves as functions of y", "把曲线改写成 y 的函数"),
      explanation: t(
        "To find the area between $y = f(x)$ and the $y$-axis, solve for $x$ first. For $y = \\sqrt{x}$ with $0 \\le y \\le 2$: $x = y^{2}$, and the area is $\\int_{0}^{2} y^{2} \\, dy = \\frac{8}{3}$.",
        "要求 $y = f(x)$ 与 $y$ 轴之间的面积，先解出 $x$。对 $y = \\sqrt{x}$，$0 \\le y \\le 2$：$x = y^{2}$，面积为 $\\int_{0}^{2} y^{2} \\, dy = \\frac{8}{3}$。",
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
            solution: t(
              `Solving $y = \\ln x$ for $x$ gives $x = e^{y}$. The area is $${int(0, d, "e^{y}", "y")} = e^{${d}} - e^{0} = ${answer}$.`,
              `由 $y = \\ln x$ 解出 $x = e^{y}$。面积为 $${int(0, d, "e^{y}", "y")} = e^{${d}} - e^{0} = ${answer}$。`,
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
          solution: t(
            `Solving for $x$ gives $x = y^{${m}}$, for $${c} \\le y \\le ${d}$. The area is $${int(c, d, `y^{${m}}`, "y")} = \\frac{${d}^{${m + 1}} - ${c}^{${m + 1}}}{${m + 1}} = ${answer.toLatex()}$.`,
            `解出 $x = y^{${m}}$，$${c} \\le y \\le ${d}$。面积为 $${int(c, d, `y^{${m}}`, "y")} = \\frac{${d}^{${m + 1}} - ${c}^{${m + 1}}}{${m + 1}} = ${answer.toLatex()}$。`,
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
  encompasses: [{ topic: "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "signed-areas-from-a-graph",
      title: t("Signed areas from a graph", "由图像求有向面积"),
      explanation: t(
        "The integral of $f$ is the area above the $x$-axis minus the area below it. For a graph made of line segments, split it into triangles and trapezoids. A trapezoid from $x_{1}$ to $x_{2}$ under a segment has signed area $\\frac{f(x_{1}) + f(x_{2})}{2}(x_{2} - x_{1})$, even when the segment crosses the axis.",
        "$f$ 的积分等于 $x$ 轴上方的面积减去下方的面积。对由线段组成的图像，把区域分成三角形和梯形。线段下方从 $x_{1}$ 到 $x_{2}$ 的梯形，其有向面积为 $\\frac{f(x_{1}) + f(x_{2})}{2}(x_{2} - x_{1})$，即使线段穿过 $x$ 轴也成立。",
      ),
      generate(rng) {
        const ys = zigzag(rng);
        const [a, b] = nodePair(rng);
        const reversed = rng.bool(0.2);
        const value = zigIntegral(ys, Q.of(a), Q.of(b));
        const answer = reversed ? value.neg() : value;
        const [lo, hi] = reversed ? [b, a] : [a, b];
        const pieces = zigzagXs
          .slice(0, -1)
          .map((x, i) => [x, ys[i]! + ys[i + 1]!] as const)
          .filter(([x]) => x >= a && x < b)
          .map(([, s]) => s);
        return {
          ...numberProblem({
            prompt: t(`The graph of $f$ is shown. Find $${int(lo, hi, "f(x)")}$.`, `图中是 $f$ 的图像。求 $${int(lo, hi, "f(x)")}$。`),
            answer,
            wrong: [answer.neg(), zigArea(ys, Q.of(a), Q.of(b)), Q.of(ys[zigzagXs.indexOf(b)]! - ys[zigzagXs.indexOf(a)]!)],
            solution: t(
              `On each interval of width $2$ the signed area is the sum of the end heights: $${pieces.join(" + ").replaceAll("+ -", "- ")} = ${value.toLatex()}$${reversed ? `. Reversing the limits changes the sign, giving $${answer.toLatex()}$` : ""}.`,
              `在每个宽为 $2$ 的区间上，有向面积等于两端高度之和：$${pieces.join(" + ").replaceAll("+ -", "- ")} = ${value.toLatex()}$${reversed ? `。交换上下限改变符号，得 $${answer.toLatex()}$` : ""}。`,
            ),
          }),
          figure: zigzagFigure(ys, "f"),
        };
      },
    },
    {
      id: "integrals-of-combinations-from-a-graph",
      title: t("Integrals of combinations from a graph", "由图像求组合函数的积分"),
      explanation: t(
        "The integral is linear: constants factor out, and the integral of a constant $k$ over $[a, b]$ is the area of a rectangle, $k(b - a)$. So\n\n$$\\int_{a}^{b} \\big(c f(x) + k\\big) \\, dx = c \\int_{a}^{b} f(x) \\, dx + k(b - a).$$\n\nRead $\\int_{a}^{b} f(x) \\, dx$ off the graph as a signed area, then scale and add. If $\\int_{0}^{4} f(x) \\, dx = 6$, then $\\int_{0}^{4} \\big(3f(x) - 2\\big) \\, dx = 18 - 8 = 10$.",
        "积分是线性的：常数因子可以提出，常数 $k$ 在 $[a, b]$ 上的积分是矩形面积 $k(b - a)$。所以\n\n$$\\int_{a}^{b} \\big(c f(x) + k\\big) \\, dx = c \\int_{a}^{b} f(x) \\, dx + k(b - a)。$$\n\n先从图像读出有向面积 $\\int_{a}^{b} f(x) \\, dx$，再乘以系数并相加。若 $\\int_{0}^{4} f(x) \\, dx = 6$，则 $\\int_{0}^{4} \\big(3f(x) - 2\\big) \\, dx = 18 - 8 = 10$。",
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
            solution: t(
              `As a signed area, $${int(a, b, "f(x)")} = ${value.toLatex()}$. By linearity:${steps(`${int(a, b, integrand)} = ${c} \\cdot ${par(value)} + ${par(Q.of(k))} \\cdot ${b - a} = ${answer.toLatex()}`)}`,
              `作为有向面积，$${int(a, b, "f(x)")} = ${value.toLatex()}$。由线性性：${steps(`${int(a, b, integrand)} = ${c} \\cdot ${par(value)} + ${par(Q.of(k))} \\cdot ${b - a} = ${answer.toLatex()}`)}`,
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
  knowledgePoints: [
    {
      id: "net-change-from-a-graph",
      title: t("Net change from a graph", "由图像求净变化"),
      explanation: t(
        "$f$ is an antiderivative of $f'$, so by the fundamental theorem\n\n$$\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a).$$\n\nRead the two values of $f$ off its graph; no area is needed.",
        "$f$ 是 $f'$ 的一个原函数，所以由基本定理\n\n$$\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)。$$\n\n从图像读出 $f$ 的两个值即可，不需要求面积。",
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
        return {
          ...numberProblem({
            prompt: t(`The graph of $f$ is shown. Find $${int(a, b, "f'(x)")}$.`, `图中是 $f$ 的图像。求 $${int(a, b, "f'(x)")}$。`),
            answer,
            wrong: [fa - fb, a < b ? area : area.neg(), fb],
            solution: t(
              `$${int(a, b, "f'(x)")} = f(${b}) - f(${a}) = ${fb} - ${par(Q.of(fa))} = ${answer}$.`,
              `$${int(a, b, "f'(x)")} = f(${b}) - f(${a}) = ${fb} - ${par(Q.of(fa))} = ${answer}$。`,
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
        "With a table of values of $f$ and $f'$, the integral of $f'$ uses only the values of $f$: $\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)$. The values of $f'$ are not needed.",
        "给出 $f$ 和 $f'$ 的数值表时，$f'$ 的积分只用 $f$ 的值：$\\int_{a}^{b} f'(x) \\, dx = f(b) - f(a)$。不需要 $f'$ 的值。",
      ),
      generate(rng) {
        const start = rng.int(-2, 3);
        const xs = [0, 1, 2, 3, 4, 5].map((x) => x + start);
        const f = xs.map(() => rng.int(-9, 12));
        const fp = xs.map(() => rng.int(-6, 6));
        const i = rng.int(0, 4);
        const j = rng.int(i + 1, 5);
        const k = rng.pick([1, 1, 2, 3, -2]);
        const answer = k * (f[j]! - f[i]!);
        const body = k === 1 ? "f'(x)" : `${k}f'(x)`;
        const rows = table(
          ["$x$", ...xs.map((x) => `$${x}$`)],
          ["$f(x)$", ...f.map((y) => `$${y}$`)],
          ["$f'(x)$", ...fp.map((y) => `$${y}$`)],
        );
        return numberProblem({
          prompt: t(
            `The table gives values of a differentiable function $f$ and its derivative.\n\n${rows}\n\nFind $${int(xs[i]!, xs[j]!, body)}$.`,
            `下表给出可导函数 $f$ 及其导数的一些值。\n\n${rows}\n\n求 $${int(xs[i]!, xs[j]!, body)}$。`,
          ),
          answer,
          wrong: [k * (fp[j]! - fp[i]!), k * (f[i]! - f[j]!), f[j]! - f[i]!],
          solution: t(
            `$${int(xs[i]!, xs[j]!, body)} = ${k === 1 ? "" : k}\\left[f(${xs[j]}) - f(${xs[i]})\\right] = ${k === 1 ? "" : k}\\left[${f[j]} - ${par(Q.of(f[i]!))}\\right] = ${answer}$.`,
            `$${int(xs[i]!, xs[j]!, body)} = ${k === 1 ? "" : k}\\left[f(${xs[j]}) - f(${xs[i]})\\right] = ${k === 1 ? "" : k}\\left[${f[j]} - ${par(Q.of(f[i]!))}\\right] = ${answer}$。`,
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
  knowledgePoints: [
    {
      id: "integrating-piecewise-functions",
      title: t("Integrating piecewise functions", "积分分段函数"),
      explanation: t(
        "Split the integral where the rule changes, and integrate each piece with its own formula: if the rule changes at $c$, then $\\int_{a}^{b} f(x) \\, dx = \\int_{a}^{c} f(x) \\, dx + \\int_{c}^{b} f(x) \\, dx$.",
        "在规则改变处拆分积分，每一段用各自的公式积分：若规则在 $c$ 处改变，则 $\\int_{a}^{b} f(x) \\, dx = \\int_{a}^{c} f(x) \\, dx + \\int_{c}^{b} f(x) \\, dx$。",
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
        return numberProblem({
          prompt: t(`Let $${f}$. Evaluate $${int(a, b, "f(x)")}$.`, `设 $${f}$。计算 $${int(a, b, "f(x)")}$。`),
          answer,
          wrong: [integral(left, a, b), integral(right, a, b), L.sub(R)],
          solution: t(
            `$${int(a, c, `(${pLatex(left)})`)} = ${L.toLatex()}$ and $${int(c, b, `(${pLatex(right)})`)} = ${R.toLatex()}$, so the integral is $${answer.toLatex()}$.`,
            `$${int(a, c, `(${pLatex(left)})`)} = ${L.toLatex()}$，$${int(c, b, `(${pLatex(right)})`)} = ${R.toLatex()}$，所以积分为 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "integrating-absolute-values",
      title: t("Integrating absolute values", "积分绝对值函数"),
      explanation: t(
        "Write $|g(x)|$ piecewise: it is $g(x)$ where $g(x) \\ge 0$ and $-g(x)$ where $g(x) < 0$. For $|kx - m|$ the rule changes at $x = \\frac{m}{k}$; split the integral there.",
        "把 $|g(x)|$ 写成分段形式：$g(x) \\ge 0$ 处为 $g(x)$，$g(x) < 0$ 处为 $-g(x)$。对 $|kx - m|$，规则在 $x = \\frac{m}{k}$ 处改变，在那里拆分积分。",
      ),
      generate(rng) {
        const k = rng.int(1, 4);
        const r = rng.int(-3, 3);
        const g: Poly = [-k * r, k];
        const a = r - rng.int(1, 4);
        const b = r + rng.int(1, 4);
        const answer = areaBetween(g, [r], a, b);
        const inner = pLatex(g);
        return numberProblem({
          prompt: t(`Evaluate $${int(a, b, `|${inner}|`)}$.`, `计算 $${int(a, b, `|${inner}|`)}$。`),
          answer,
          wrong: [integral(g, a, b), integral(g, a, b).abs(), integral(g, r, b)],
          solution: t(
            `$${inner} = 0$ at $x = ${r}$. Then $${int(a, r, `-(${inner})`)} = ${integral(g, a, r).neg().toLatex()}$ and $${int(r, b, `(${inner})`)} = ${integral(g, r, b).toLatex()}$, a total of $${answer.toLatex()}$. Both pieces are triangles.`,
            `$${inner} = 0$ 的解为 $x = ${r}$。$${int(a, r, `-(${inner})`)} = ${integral(g, a, r).neg().toLatex()}$，$${int(r, b, `(${inner})`)} = ${integral(g, r, b).toLatex()}$，合计 $${answer.toLatex()}$。两段都是三角形。`,
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
  knowledgePoints: [
    {
      id: "accumulation-functions-from-a-graph",
      title: t("Accumulation functions from a graph", "由图像求累积函数的值"),
      explanation: t(
        "$g(x) = \\int_{a}^{x} f(t) \\, dt$ accumulates the signed area under $f$ from $a$ to $x$. So $g(a) = 0$, $g$ grows where $f > 0$ and shrinks where $f < 0$. For $x < a$, reverse the limits: $g(x) = -\\int_{x}^{a} f(t) \\, dt$.",
        "$g(x) = \\int_{a}^{x} f(t) \\, dt$ 累积 $f$ 从 $a$ 到 $x$ 的有向面积。所以 $g(a) = 0$，在 $f > 0$ 处 $g$ 增大，在 $f < 0$ 处 $g$ 减小。当 $x < a$ 时交换上下限：$g(x) = -\\int_{x}^{a} f(t) \\, dt$。",
      ),
      generate(rng) {
        const ys = zigzag(rng);
        const base = rng.pick([-6, -6, -4, -2, 0]);
        let x = rng.pick(zigzagXs);
        if (x === base) x = 6;
        const answer = zigIntegral(ys, Q.of(base), Q.of(x));
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $f$ is shown, and $g(x) = ${int(base, "x", "f(t)", "t")}$. Find $g(${x})$.`,
              `图中是 $f$ 的图像，$g(x) = ${int(base, "x", "f(t)", "t")}$。求 $g(${x})$。`,
            ),
            answer,
            wrong: [answer.neg(), Q.of(ys[zigzagXs.indexOf(x)]!), zigArea(ys, Q.of(Math.min(base, x)), Q.of(Math.max(base, x)))],
            solution: t(
              `$g(${x}) = ${int(base, x, "f(t)", "t")}$${x < base ? ` $= -${int(x, base, "f(t)", "t")}$` : ""}. Adding the signed areas of the trapezoids of width $2$ gives $${answer.toLatex()}$.`,
              `$g(${x}) = ${int(base, x, "f(t)", "t")}$${x < base ? ` $= -${int(x, base, "f(t)", "t")}$` : ""}。把各个宽为 $2$ 的梯形的有向面积相加，得 $${answer.toLatex()}$。`,
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
        "With a formula for $f$, integrate and substitute the limits $a$ and $x$: $\\int_{1}^{x} 2t \\, dt = \\Big[t^{2}\\Big]_{1}^{x} = x^{2} - 1$. The result is the antiderivative of $f$ that is $0$ at $x = a$.",
        "给出 $f$ 的公式时，积分并代入上下限 $a$ 和 $x$：$\\int_{1}^{x} 2t \\, dt = \\Big[t^{2}\\Big]_{1}^{x} = x^{2} - 1$。结果是 $f$ 的在 $x = a$ 处为 $0$ 的那个原函数。",
      ),
      generate(rng) {
        const deg = rng.int(1, 2);
        const p: number[] = Array.from({ length: deg + 1 }, () => rng.int(-6, 6));
        p[deg] = rng.nonZero(-3, 3) * (deg + 1);
        const a = rng.nonZero(-3, 3);
        const Fa = antiderivativeAt(p, a);
        const F = poly(...p.map((c, i) => [Q.of(c, i + 1), i + 1 === 1 ? "x" : `x^{${i + 1}}`] as const).reverse());
        const answer = poly(...p.map((c, i) => [Q.of(c, i + 1), i + 1 === 1 ? "x" : `x^{${i + 1}}`] as const).reverse(), [Fa.neg(), ""]);
        return functionProblem({
          prompt: t(
            `Find a formula for $g(x) = ${int(a, "x", `(${pLatex(p, "t")})`, "t")}$.`,
            `求 $g(x) = ${int(a, "x", `(${pLatex(p, "t")})`, "t")}$ 的表达式。`,
          ),
          prefix: "g(x) =",
          answer,
          wrong: [
            F,
            poly(...p.map((c, i) => [Q.of(c, i + 1), i + 1 === 1 ? "x" : `x^{${i + 1}}`] as const).reverse(), [Fa, ""]),
            poly(...p.map((c, i) => [Q.of(c, i + 1), i + 1 === 1 ? "x" : `x^{${i + 1}}`] as const).reverse(), [Fa.neg().add(Q.of(a)), ""]),
            pLatex(p),
          ],
          solution: t(
            `$g(x) = \\Big[${F.replaceAll("x", "t")}\\Big]_{${a}}^{x} = \\left(${F}\\right) - ${par(Fa)} = ${answer}$. Check: $g(${a}) = 0$.`,
            `$g(x) = \\Big[${F.replaceAll("x", "t")}\\Big]_{${a}}^{x} = \\left(${F}\\right) - ${par(Fa)} = ${answer}$。检验：$g(${a}) = 0$。`,
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
  encompasses: [{ topic: "the-integral-as-an-accumulation-function", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "differentiating-an-accumulation-function",
      title: t("Differentiating an accumulation function", "对累积函数求导"),
      explanation: t(
        "**The second fundamental theorem of calculus:** if $f$ is continuous, then\n\n$$\\frac{d}{dx}\\int_{a}^{x} f(t) \\, dt = f(x).$$\n\nThe lower limit $a$ does not matter. If $x$ is the lower limit, reverse first: $\\frac{d}{dx}\\int_{x}^{a} f(t) \\, dt = -f(x)$.",
        "**微积分第二基本定理：**若 $f$ 连续，则\n\n$$\\frac{d}{dx}\\int_{a}^{x} f(t) \\, dt = f(x)。$$\n\n下限 $a$ 不影响结果。若 $x$ 是下限，先交换上下限：$\\frac{d}{dx}\\int_{x}^{a} f(t) \\, dt = -f(x)$。",
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
          solution: t(
            `${lower ? `Reversing the limits, the integral is $-${int(a, "x", body, "t")}$. ` : ""}By the second fundamental theorem, the derivative is the integrand at $t = x$: $${answer}$.`,
            `${lower ? `交换上下限，积分为 $-${int(a, "x", body, "t")}$。` : ""}由第二基本定理，导数等于被积函数在 $t = x$ 处的值：$${answer}$。`,
          ),
        });
      },
    },
    {
      id: "variable-limits-and-the-chain-rule",
      title: t("Variable limits and the chain rule", "变限与链式法则"),
      explanation: t(
        "By the fundamental theorem, differentiating an integral with a variable upper limit returns the integrand there, and the chain rule multiplies by the derivative of the limit. If the upper limit is a function $u(x)$, the chain rule gives\n\n$$\\frac{d}{dx}\\int_{a}^{u(x)} f(t) \\, dt = f(u(x)) \\cdot u'(x).$$\n\nFor example, $\\frac{d}{dx}\\int_{0}^{x^{2}} \\sin t \\, dt = 2x\\sin(x^{2})$.",
        "根据微积分基本定理，对变上限积分求导会得到上限处的被积函数，链式法则再乘以上限的导数。若上限是函数 $u(x)$，由链式法则\n\n$$\\frac{d}{dx}\\int_{a}^{u(x)} f(t) \\, dt = f(u(x)) \\cdot u'(x)。$$\n\n例如 $\\frac{d}{dx}\\int_{0}^{x^{2}} \\sin t \\, dt = 2x\\sin(x^{2})$。",
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
          solution: t(
            `With $u = ${u}$ and $\\frac{du}{dx} = ${derivative}$, the derivative is the integrand at $t = u$ times $\\frac{du}{dx}$: $${answer}$.`,
            `设 $u = ${u}$，$\\frac{du}{dx} = ${derivative}$，导数等于被积函数在 $t = u$ 处的值乘以 $\\frac{du}{dx}$：$${answer}$。`,
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

/** extremum chooses a graph of f′ whose antiderivative has a unique absolute maximum or minimum on [−6, 6]. */
function extremum(rng: Rng, max: boolean): Extremum {
  for (;;) {
    const ys = zigzag(rng);
    const x0 = rng.pick([-6, -6, 0]);
    const value = rng.int(-5, 8);
    const f = (x: Q) => Q.of(value).add(zigIntegral(ys, Q.of(x0), x));
    const candidates = [Q.of(-6), ...zeros(ys).map((z) => z.x), Q.of(6)].map((x) => [x, f(x)] as const);
    if (candidates.length < 3) continue;
    const sorted = [...candidates].sort((p, q) => (max ? q[1].cmp(p[1]) : p[1].cmp(q[1])));
    if (sorted[0]![1].eq(sorted[1]![1])) continue;
    // Mostly ask for an extremum inside the interval, where the sign change of f′ matters.
    if (rng.bool(0.8) && (sorted[0]![0].eq(Q.of(-6)) || sorted[0]![0].eq(Q.of(6)))) continue;
    return { ys, x0, value, at: sorted[0]![0], best: sorted[0]![1], others: sorted.slice(1) };
  }
}

/** extremumTopic builds the topic of finding an absolute maximum or minimum from the graph of f′. */
function extremumTopic(max: boolean): TopicDef {
  const [word, zh] = max ? ["maximum", "最大值"] : ["minimum", "最小值"];
  const [up, _down] = max ? ["positive to negative", "negative to positive"] : ["negative to positive", "positive to negative"];
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
    knowledgePoints: [
      {
        id: max ? "locating-the-absolute-maximum" : "locating-the-absolute-minimum",
        title: max ? t("Locating the absolute maximum", "确定最大值点") : t("Locating the absolute minimum", "确定最小值点"),
        explanation: t(
          `The absolute ${word} of $f$ on a closed interval is at an endpoint or where $f'$ changes from ${up}. To compare the candidates, compute $f$ at each one: $f(b) = f(a) + \\int_{a}^{b} f'(x) \\, dx$, the signed area under the graph of $f'$.`,
          `$f$ 在闭区间上的${zh}出现在端点处，或 $f'$ 由${max ? "正变负" : "负变正"}的地方。比较各候选点时，算出 $f$ 在每个点的值：$f(b) = f(a) + \\int_{a}^{b} f'(x) \\, dx$，即 $f'$ 图像下方的有向面积。`,
        ),
        generate(rng) {
          const e = extremum(rng, max);
          return {
            ...numberProblem({
              prompt: t(
                `The graph of $f'$ is shown, and $f(${e.x0}) = ${e.value}$. At which value of $x$ does $f$ attain its absolute ${word} on $[-6, 6]$?`,
                `图中是 $f'$ 的图像，且 $f(${e.x0}) = ${e.value}$。$f$ 在 $[-6, 6]$ 上于哪个 $x$ 处取得${zh}？`,
              ),
              answer: e.at,
              solveFor: "x",
              wrong: e.others.map(([x]) => x),
              solution: t(
                `The candidates are $x = -6$, $x = 6$ and the zeros of $f'$. Their values are ${[[e.at, e.best] as const, ...e.others].map(([x, v]) => `$f(${x.toLatex()}) = ${v.toLatex()}$`).join(", ")}, so the absolute ${word} is at $x = ${e.at.toLatex()}$.`,
                `候选点为 $x = -6$、$x = 6$ 以及 $f'$ 的零点。它们的函数值为 ${[[e.at, e.best] as const, ...e.others].map(([x, v]) => `$f(${x.toLatex()}) = ${v.toLatex()}$`).join("，")}，所以${zh}在 $x = ${e.at.toLatex()}$ 处取得。`,
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
          `Once the location $c$ is known, the ${word} value is $f(c) = f(a) + \\int_{a}^{c} f'(x) \\, dx$, starting from the point $a$ where $f$ is known. Integrating backward, from $a$ to $c < a$, reverses the sign. The value of $f'$ at $c$ is not the ${word}: it is the slope there.`,
          `确定位置 $c$ 后，${zh}为 $f(c) = f(a) + \\int_{a}^{c} f'(x) \\, dx$，从已知 $f$ 值的点 $a$ 出发。若向后积分（$c < a$），符号相反。$f'$ 在 $c$ 处的值不是${zh}，而是那里的斜率。`,
        ),
        generate(rng) {
          const e = extremum(rng, max);
          const area = e.best.sub(Q.of(e.value));
          return {
            ...numberProblem({
              prompt: t(
                `The graph of $f'$ is shown, and $f(${e.x0}) = ${e.value}$. Find the absolute ${word} value of $f$ on $[-6, 6]$.`,
                `图中是 $f'$ 的图像，且 $f(${e.x0}) = ${e.value}$。求 $f$ 在 $[-6, 6]$ 上的${zh}。`,
              ),
              answer: e.best,
              wrong: [...e.others.map(([, v]) => v), area, Q.of(e.value).sub(area)],
              solution: t(
                `The absolute ${word} is at $x = ${e.at.toLatex()}$ (the candidates are the endpoints and the points where $f'$ changes sign). Then $f(${e.at.toLatex()}) = ${e.value} + ${int(e.x0, e.at.toLatex(), "f'(x)")} = ${e.value} + ${par(area)} = ${e.best.toLatex()}$.`,
                `${zh}在 $x = ${e.at.toLatex()}$ 处取得（候选点为端点及 $f'$ 变号的点）。于是 $f(${e.at.toLatex()}) = ${e.value} + ${int(e.x0, e.at.toLatex(), "f'(x)")} = ${e.value} + ${par(area)} = ${e.best.toLatex()}$。`,
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
  knowledgePoints: [
    {
      id: "local-extrema-from-the-graph-of-the-derivative",
      title: t("Local extrema from the graph of the derivative", "由导数图像求局部极值"),
      explanation: t(
        "$f$ has a local maximum where $f'$ changes from positive to negative, and a local minimum where it changes from negative to positive. A point where $f'$ touches zero without changing sign is neither. Points where $f'$ itself is largest or smallest are inflection points of $f$, not extrema.",
        "$f'$ 由正变负处，$f$ 有局部极大值；由负变正处，$f$ 有局部极小值。$f'$ 为零但不变号的点两者都不是。$f'$ 本身最大或最小的点是 $f$ 的拐点，不是极值点。",
      ),
      generate(rng) {
        for (;;) {
          const ys = zigzag(rng);
          const zs = zeros(ys);
          const wantMax = rng.bool();
          const right = zs.filter((z) => z.up !== wantMax).map((z) => z.x.toLatex());
          if (right.length === 0) continue;
          const other = zs.filter((z) => z.up === wantMax).map((z) => z.x.toLatex());
          const peaks = zigzagXs.filter((_, i) => i > 0 && i < 6 && (ys[i]! - ys[i - 1]!) * (ys[i + 1]! - ys[i]!) < 0).map(String);
          return {
            ...solutionsProblem({
              prompt: t(
                `The graph of $f'$ on $[-6, 6]$ is shown. Find every $x$ in $(-6, 6)$ at which $f$ has a local ${wantMax ? "maximum" : "minimum"}.`,
                `图中是 $f'$ 在 $[-6, 6]$ 上的图像。求 $(-6, 6)$ 内 $f$ 取得局部${wantMax ? "极大值" : "极小值"}的所有 $x$。`,
              ),
              values: right,
              wrong: [other, peaks, zs.map((z) => z.x.toLatex())],
              solution: t(
                `$f'$ changes from ${wantMax ? "positive to negative" : "negative to positive"} at $x = ${right.join(", ")}$, so $f$ has a local ${wantMax ? "maximum" : "minimum"} there.${other.length ? ` At $x = ${other.join(", ")}$ the change is the other way.` : ""}`,
                `$f'$ 在 $x = ${right.join("、")}$ 处由${wantMax ? "正变负" : "负变正"}，所以 $f$ 在那里取得局部${wantMax ? "极大值" : "极小值"}。${other.length ? `在 $x = ${other.join("、")}$ 处变号方向相反。` : ""}`,
              ),
            }),
            figure: zigzagFigure(ys, "f'"),
          };
        }
      },
    },
    {
      id: "extreme-values-on-a-subinterval",
      title: t("Extreme values on a subinterval", "子区间上的最值"),
      explanation: t(
        "On a smaller interval $[p, q]$, the candidates are $p$, $q$ and the sign changes of $f'$ between them. Find each value of $f$ from a known value by adding signed areas, then compare.",
        "在较小的区间 $[p, q]$ 上，候选点为 $p$、$q$ 以及其间 $f'$ 变号的点。从已知的函数值出发，加上有向面积求出各点的 $f$ 值，再比较。",
      ),
      generate(rng) {
        for (;;) {
          const ys = zigzag(rng);
          const [p, q] = nodePair(rng);
          if (q - p < 4) continue;
          const max = rng.bool();
          const value = rng.int(-5, 8);
          const f = (x: Q) => Q.of(value).add(zigIntegral(ys, Q.of(p), x));
          const inside = zeros(ys)
            .map((z) => z.x)
            .filter((x) => x.cmp(Q.of(p)) > 0 && x.cmp(Q.of(q)) < 0);
          if (inside.length === 0) continue;
          const candidates = [Q.of(p), ...inside, Q.of(q)].map((x) => [x, f(x)] as const);
          const sorted = [...candidates].sort((a, b) => (max ? b[1].cmp(a[1]) : a[1].cmp(b[1])));
          if (rng.bool(0.8) && (sorted[0]![0].eq(Q.of(p)) || sorted[0]![0].eq(Q.of(q)))) continue;
          const best = sorted[0]![1];
          const whole = [Q.of(-6), ...zeros(ys).map((z) => z.x), Q.of(6)].map(f);
          const global = whole.reduce((m, v) => (max ? (v.cmp(m) > 0 ? v : m) : v.cmp(m) < 0 ? v : m));
          return {
            ...numberProblem({
              prompt: t(
                `The graph of $f'$ is shown, and $f(${p}) = ${value}$. Find the ${max ? "greatest" : "least"} value of $f$ on $[${p}, ${q}]$.`,
                `图中是 $f'$ 的图像，且 $f(${p}) = ${value}$。求 $f$ 在 $[${p}, ${q}]$ 上的${max ? "最大值" : "最小值"}。`,
              ),
              answer: best,
              wrong: [...sorted.slice(1).map(([, v]) => v), global],
              solution: t(
                `The candidates are ${candidates.map(([x, v]) => `$f(${x.toLatex()}) = ${v.toLatex()}$`).join(", ")}, each found by adding the signed area from $x = ${p}$. The ${max ? "greatest" : "least"} is $${best.toLatex()}$.`,
                `候选值为 ${candidates.map(([x, v]) => `$f(${x.toLatex()}) = ${v.toLatex()}$`).join("，")}，各由 $x = ${p}$ 起加上有向面积得到。${max ? "最大值" : "最小值"}为 $${best.toLatex()}$。`,
              ),
            }),
            figure: zigzagFigure(ys, "f'"),
          };
        }
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
