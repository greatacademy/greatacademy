import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type PlaneMark, plane, poly, Q } from "@ga/subject-math";

import { expressionProblem, functionProblem, numberProblem, reasonChoice, solutionsProblem } from "../problems.ts";
import { bare, fac, lim, oneOf, type Poly, pAt, par, pDer, pLatex, power, range, sumLatex, table } from "./calculus-common.ts";

// Calculus I unit 4: Introduction to Differentiation, module 4.9. Topic 4.9.1
// is the existing the-average-rate-of-change-of-a-function.

/** quadratic is sx² + bx + c with small coefficients. */
const quadratic = (rng: Rng): Poly => [rng.int(-6, 6), rng.int(-5, 5), rng.nonZero(-3, 3)];

/** cubic is a cubic with small coefficients. */
const cubic = (rng: Rng): Poly => [rng.int(-6, 6), rng.int(-5, 5), rng.int(-3, 3), rng.nonZero(-2, 2)];

/** quotientSteps works out [f(a + h) − f(a)]/h for f = sx² + bx + c, with a a number or "x". */
function quotientSteps(p: Poly, a: number | "x"): string {
  const [, b, s] = p as [number, number, number];
  if (a === "x") {
    const top = poly([2 * s, "xh"], [s, "h^{2}"], [b, "h"]);
    return `\\frac{f(x + h) - f(x)}{h} = \\frac{${top}}{h} = ${poly([2 * s, "x"], [s, "h"], [b, ""])}`;
  }
  const lin = 2 * s * a + b;
  return `\\frac{f(${a} + h) - f(${a})}{h} = \\frac{${poly([lin, "h"], [s, "h^{2}"])}}{h} = ${poly([s, "h"], [lin, ""])}`;
}

/** theAverageRateOfChangeOfAFunctionOverAVaryingInterval writes the difference quotient. */
export const theAverageRateOfChangeOfAFunctionOverAVaryingInterval: TopicDef = {
  id: "the-average-rate-of-change-of-a-function-over-a-varying-interval",
  title: t("The Average Rate of Change of a Function over a Varying Interval", "函数在可变区间上的平均变化率"),
  summary: t(
    "Write and simplify the difference quotient, the average rate of change over an interval of width h.",
    "写出并化简差商，即在宽度为 h 的区间上的平均变化率。",
  ),
  prerequisites: ["the-average-rate-of-change-of-a-function"],
  encompasses: [{ topic: "the-average-rate-of-change-of-a-function", weight: 0.5 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "difference-quotient-at-a-point",
      title: t("The difference quotient at a point", "某点处的差商"),
      explanation: t(
        "The average rate of change of $f$ over $[a, a + h]$ is the **difference quotient**\n\n$$\\frac{f(a + h) - f(a)}{h}.$$\n\nFor a polynomial, expand $f(a + h)$, subtract $f(a)$ (the terms without $h$ cancel) and divide by $h$. For $f(x) = x^{2}$ at $a = 3$:\n\n$$\\frac{(3 + h)^{2} - 9}{h} = \\frac{6h + h^{2}}{h} = 6 + h.$$",
        "$f$ 在 $[a, a + h]$ 上的平均变化率是**差商**\n\n$$\\frac{f(a + h) - f(a)}{h}.$$\n\n对多项式，先展开 $f(a + h)$，再减去 $f(a)$（不含 $h$ 的项相互抵消），最后除以 $h$。对 $f(x) = x^{2}$，$a = 3$：\n\n$$\\frac{(3 + h)^{2} - 9}{h} = \\frac{6h + h^{2}}{h} = 6 + h.$$",
      ),
      generate(rng) {
        const p = quadratic(rng);
        const a = rng.int(-4, 4);
        const [, b, s] = p as [number, number, number];
        const answer = poly([s, "h"], [2 * s * a + b, ""]);
        return expressionProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(p)}$. Simplify the difference quotient $\\frac{f(${a} + h) - f(${a})}{h}$ for $h \\ne 0$.`,
            `设 $f(x) = ${pLatex(p)}$。当 $h \\ne 0$ 时，化简差商 $\\frac{f(${a} + h) - f(${a})}{h}$。`,
          ),
          answer,
          simplified: true,
          wrong: [poly([s, "h"], [s * a + b, ""]), poly([s, "h^{2}"], [2 * s * a + b, "h"]), String(2 * s * a + b)],
          solution: t(
            `$f(${a}) = ${pAt(p, a)}$. Expanding $f(${a} + h)$, the constant terms cancel:$$${quotientSteps(p, a)}.$$`,
            `$f(${a}) = ${pAt(p, a)}$。展开 $f(${a} + h)$，常数项相互抵消：$$${quotientSteps(p, a)}.$$`,
          ),
        });
      },
    },
    {
      id: "difference-quotient-at-a-general-point",
      title: t("The difference quotient at a general point", "一般点处的差商"),
      explanation: t(
        "Expand the function at the shifted input, cancel the terms without the step, and divide by the step; letting the step go to zero then gives the derivative. At a general point $x$ the difference quotient is an expression in both $x$ and $h$. For $f(x) = 3x^{2}$:\n\n$$\\frac{3(x + h)^{2} - 3x^{2}}{h} = \\frac{6xh + 3h^{2}}{h} = 6x + 3h.$$",
        "展开平移后自变量处的函数值，消去不含步长的项，再除以步长；令步长趋于零就得到导数。在一般点 $x$ 处，差商是同时含 $x$ 和 $h$ 的式子。对 $f(x) = 3x^{2}$：\n\n$$\\frac{3(x + h)^{2} - 3x^{2}}{h} = \\frac{6xh + 3h^{2}}{h} = 6x + 3h.$$",
      ),
      generate(rng) {
        const p = quadratic(rng);
        const [, b, s] = p as [number, number, number];
        return expressionProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(p)}$. Simplify $\\frac{f(x + h) - f(x)}{h}$ for $h \\ne 0$.`,
            `设 $f(x) = ${pLatex(p)}$。当 $h \\ne 0$ 时，化简 $\\frac{f(x + h) - f(x)}{h}$。`,
          ),
          answer: poly([2 * s, "x"], [s, "h"], [b, ""]),
          simplified: true,
          wrong: [poly([2 * s, "x"], [b, ""]), poly([s, "x"], [s, "h"], [b, ""]), poly([2 * s, "x"], [s, "h"])],
          solution: t(
            `The terms of $f(x)$ cancel, leaving only terms with $h$:$$${quotientSteps(p, "x")}.$$`,
            `$f(x)$ 的各项相互抵消，只剩下含 $h$ 的项：$$${quotientSteps(p, "x")}.$$`,
          ),
        });
      },
    },
  ],
};

/** theInstantaneousRateOfChangeOfAFunctionAtAPoint takes the limit of the difference quotient. */
export const theInstantaneousRateOfChangeOfAFunctionAtAPoint: TopicDef = {
  id: "the-instantaneous-rate-of-change-of-a-function-at-a-point",
  title: t("The Instantaneous Rate of Change of a Function at a Point", "函数在一点处的瞬时变化率"),
  summary: t(
    "Find the instantaneous rate of change as the limit of average rates of change, exactly and from tables.",
    "把瞬时变化率作为平均变化率的极限来求，包括精确计算和由数值表估计。",
  ),
  prerequisites: [
    "the-average-rate-of-change-of-a-function-over-a-varying-interval",
    "calculating-limits-of-rational-functions-by-factoring",
  ],
  encompasses: [
    { topic: "the-average-rate-of-change-of-a-function-over-a-varying-interval", weight: 0.6 },
    { topic: "calculating-limits-of-rational-functions-by-factoring", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "instantaneous-rate-as-a-limit",
      title: t("The instantaneous rate as a limit", "瞬时变化率作为极限"),
      explanation: t(
        "As the interval shrinks, the average rate of change approaches the **instantaneous rate of change** at $a$:\n\n$$\\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}.$$\n\nSimplify the difference quotient first, then let $h \\to 0$. For $f(x) = x^{2}$ at $a = 3$, $\\frac{f(3 + h) - f(3)}{h} = 6 + h \\to 6$.",
        "当区间缩小时，平均变化率趋近于 $a$ 处的**瞬时变化率**：\n\n$$\\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}.$$\n\n先化简差商，再令 $h \\to 0$。对 $f(x) = x^{2}$，$a = 3$，$\\frac{f(3 + h) - f(3)}{h} = 6 + h \\to 6$。",
      ),
      generate(rng) {
        const p = quadratic(rng);
        const a = rng.int(-5, 5);
        const [, b, s] = p as [number, number, number];
        const answer = 2 * s * a + b;
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(p)}$. Find the instantaneous rate of change of $f$ at $x = ${a}$ by evaluating $${lim(0, undefined, "h")} \\frac{f(${a} + h) - f(${a})}{h}$.`,
            `设 $f(x) = ${pLatex(p)}$。通过计算 $${lim(0, undefined, "h")} \\frac{f(${a} + h) - f(${a})}{h}$，求 $f$ 在 $x = ${a}$ 处的瞬时变化率。`,
          ),
          answer,
          wrong: [s * a + b, pAt(p, a), s * a * a + b, answer + s],
          solution: t(
            `$$${quotientSteps(p, a)} \\to ${answer} \\text{ as } h \\to 0.$$`,
            `$$${quotientSteps(p, a)} \\to ${answer} \\text{（当 } h \\to 0 \\text{ 时）}.$$`,
          ),
        });
      },
    },
    {
      id: "estimating-an-instantaneous-rate-from-a-table",
      title: t("Estimating an instantaneous rate from a table", "由数值表估计瞬时变化率"),
      explanation: t(
        "Compute average rates of change over smaller and smaller intervals $[a, a + h]$, with $h$ positive and negative. The values they settle towards estimate the instantaneous rate of change at $a$.",
        "计算在越来越小的区间 $[a, a + h]$ 上的平均变化率，$h$ 取正值也取负值。它们稳定趋向的值就是 $a$ 处瞬时变化率的估计值。",
      ),
      generate(rng) {
        const p = cubic(rng);
        const a = rng.int(-2, 2);
        const answer = pAt(pDer(p), a);
        const hs = [-0.1, -0.01, -0.001, 0.001, 0.01, 0.1];
        const rate = (h: number) => (pAt(p, a + h) - pAt(p, a)) / h;
        const tab = table(
          ["$h$", ...hs.map((h) => `$${h}$`)],
          [`$\\frac{f(${a} + h) - f(${a})}{h}$`, ...hs.map((h) => `$${rate(h).toFixed(4)}$`)],
        );
        return numberProblem({
          prompt: t(
            `The table shows average rates of change of a function $f$ over the intervals from $${a}$ to $${a} + h$.\n\n${tab}\n\nEstimate the instantaneous rate of change of $f$ at $x = ${a}$.`,
            `下表给出函数 $f$ 在从 $${a}$ 到 $${a} + h$ 的区间上的平均变化率。\n\n${tab}\n\n估计 $f$ 在 $x = ${a}$ 处的瞬时变化率。`,
          ),
          answer,
          wrong: [Math.round(rate(0.1)), Math.round(rate(-0.1)), 0],
          solution: t(
            `As $h \\to 0$ from both sides, the average rates settle towards $${answer}$.`,
            `当 $h$ 从两侧趋于 $0$ 时，平均变化率稳定地趋向 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "instantaneous-velocity",
      title: t("Instantaneous velocity", "瞬时速度"),
      explanation: t(
        "For a position function $s(t)$, the average rate of change is the average velocity, and the instantaneous rate of change is the **instantaneous velocity**:\n\n$$v(a) = \\lim_{h \\to 0} \\frac{s(a + h) - s(a)}{h}.$$",
        "对位置函数 $s(t)$，平均变化率是平均速度，瞬时变化率是**瞬时速度**：\n\n$$v(a) = \\lim_{h \\to 0} \\frac{s(a + h) - s(a)}{h}.$$",
      ),
      generate(rng) {
        const v0 = rng.int(10, 40);
        const h0 = rng.pick([0, 0, 2, 5, 10, 20]);
        const a = rng.int(1, 4);
        const p: Poly = [h0, v0, -5];
        const answer = v0 - 10 * a;
        return numberProblem({
          prompt: t(
            `A ball is thrown upwards, and its height after $t$ seconds is $s(t) = ${pLatex(p, "t")}$ meters. Find its instantaneous velocity at $t = ${a}$.`,
            `把一个球向上抛出，$t$ 秒后它的高度为 $s(t) = ${pLatex(p, "t")}$ 米。求它在 $t = ${a}$ 时的瞬时速度。`,
          ),
          answer,
          unit: "m/s",
          wrong: [v0 - 5 * a, pAt(p, a), Math.round(pAt(p, a) / a), -answer],
          solution: t(
            `$$\\frac{s(${a} + h) - s(${a})}{h} = \\frac{${poly([v0 - 10 * a, "h"], [-5, "h^{2}"])}}{h} = ${poly([-5, "h"], [answer, ""])} \\to ${answer}.$$The ball moves at $${answer}$ m/s${answer < 0 ? ", that is, downwards" : answer === 0 ? ": it is at the top" : ", upwards"}.`,
            `$$\\frac{s(${a} + h) - s(${a})}{h} = \\frac{${poly([v0 - 10 * a, "h"], [-5, "h^{2}"])}}{h} = ${poly([-5, "h"], [answer, ""])} \\to ${answer}.$$球的速度为 $${answer}$ m/s${answer < 0 ? "，即向下运动" : answer === 0 ? "：它在最高点" : "，向上运动"}。`,
          ),
        });
      },
    },
  ],
};

/** definingTheDerivativeUsingDerivativeNotation defines f'(x) as a limit. */
export const definingTheDerivativeUsingDerivativeNotation: TopicDef = {
  id: "defining-the-derivative-using-derivative-notation",
  title: t("Defining the Derivative Using Derivative Notation", "用导数记号定义导数"),
  summary: t(
    "Define the derivative f'(x) as the limit of the difference quotient and compute it from the definition.",
    "把导数 f'(x) 定义为差商的极限，并用定义计算导数。",
  ),
  prerequisites: ["the-instantaneous-rate-of-change-of-a-function-at-a-point"],
  encompasses: [{ topic: "the-instantaneous-rate-of-change-of-a-function-at-a-point", weight: 0.6 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "the-derivative-from-the-definition",
      title: t("The derivative from the definition", "由定义求导数"),
      explanation: t(
        "The **derivative** of $f$ is the function\n\n$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h},$$\n\nalso written $\\frac{dy}{dx}$ or $\\frac{d}{dx}f(x)$. Its value $f'(a)$ is the instantaneous rate of change at $a$. For $f(x) = 3x^{2}$, the quotient is $6x + 3h$, so $f'(x) = 6x$.",
        "$f$ 的**导数**是函数\n\n$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h},$$\n\n也记作 $\\frac{dy}{dx}$ 或 $\\frac{d}{dx}f(x)$。它的值 $f'(a)$ 就是 $a$ 处的瞬时变化率。对 $f(x) = 3x^{2}$，差商为 $6x + 3h$，所以 $f'(x) = 6x$。",
      ),
      generate(rng) {
        const p = quadratic(rng);
        const [, b, s] = p as [number, number, number];
        return expressionProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(p)}$. Use the definition of the derivative to find $f'(x)$.`,
            `设 $f(x) = ${pLatex(p)}$。用导数的定义求 $f'(x)$。`,
          ),
          answer: poly([2 * s, "x"], [b, ""]),
          prefix: "f'(x) =",
          wrong: [poly([s, "x"], [b, ""]), poly([2 * s, "x"]), poly([2 * s, "x"], [s, "h"], [b, ""])],
          solution: t(
            `$$${quotientSteps(p, "x")}.$$Letting $h \\to 0$ gives $f'(x) = ${poly([2 * s, "x"], [b, ""])}$.`,
            `$$${quotientSteps(p, "x")}.$$令 $h \\to 0$，得 $f'(x) = ${poly([2 * s, "x"], [b, ""])}$。`,
          ),
        });
      },
    },
    {
      id: "the-derivative-at-a-point-as-a-limit-as-x-approaches-a",
      title: t("The derivative at a point as a limit as x approaches a", "导数作为 x 趋于 a 的极限"),
      explanation: t(
        "Writing $x = a + h$ gives an equivalent form:\n\n$$f'(a) = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}.$$\n\nFor a polynomial, the numerator has the factor $x - a$; cancel it and substitute. For $f(x) = x^{2}$ at $a = 3$: $\\frac{x^{2} - 9}{x - 3} = x + 3 \\to 6$.",
        "令 $x = a + h$，得到等价形式：\n\n$$f'(a) = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}.$$\n\n对多项式，分子含因式 $x - a$；约去它再代入。对 $f(x) = x^{2}$，$a = 3$：$\\frac{x^{2} - 9}{x - 3} = x + 3 \\to 6$。",
      ),
      generate(rng) {
        const s = rng.nonZero(-3, 3);
        const b = rng.int(-6, 6);
        const p: Poly = [rng.int(-6, 6), b, s];
        const a = rng.nonZero(-5, 5);
        const fa = pAt(p, a);
        const answer = 2 * s * a + b;
        // f(x) − f(a) = (x − a)(s(x + a) + b).
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(p)}$. Evaluate $${lim(a)} \\frac{f(x) - f(${a})}{${bare(a)}}$.`,
            `设 $f(x) = ${pLatex(p)}$。求 $${lim(a)} \\frac{f(x) - f(${a})}{${bare(a)}}$。`,
          ),
          answer,
          wrong: [fa, s * a + b, 0, answer - b],
          solution: t(
            `$f(${a}) = ${fa}$, and $f(x) - f(${a}) = ${fac(a)}(${poly([s, "x"], [s * a + b, ""])})$. Cancelling,$$${lim(a)} (${poly([s, "x"], [s * a + b, ""])}) = ${answer},$$which is $f'(${a})$.`,
            `$f(${a}) = ${fa}$，且 $f(x) - f(${a}) = ${fac(a)}(${poly([s, "x"], [s * a + b, ""])})$。约分得$$${lim(a)} (${poly([s, "x"], [s * a + b, ""])}) = ${answer},$$这就是 $f'(${a})$。`,
          ),
        });
      },
    },
    {
      id: "the-derivative-of-a-reciprocal-from-the-definition",
      title: t("The derivative of a reciprocal from the definition", "由定义求倒数型函数的导数"),
      explanation: t(
        "For $f(x) = \\frac{k}{x + c}$, put the two fractions of the difference quotient over a common denominator; a factor $h$ then cancels:\n\n$$\\frac{1}{h}\\left(\\frac{k}{x + h + c} - \\frac{k}{x + c}\\right) = \\frac{-k}{(x + h + c)(x + c)} \\to -\\frac{k}{(x + c)^{2}}.$$",
        "对 $f(x) = \\frac{k}{x + c}$，把差商中的两个分式通分，就能约去因子 $h$：\n\n$$\\frac{1}{h}\\left(\\frac{k}{x + h + c} - \\frac{k}{x + c}\\right) = \\frac{-k}{(x + h + c)(x + c)} \\to -\\frac{k}{(x + c)^{2}}.$$",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const c = rng.int(-6, 6);
        const den = poly([1, "x"], [c, ""]);
        const sq = c === 0 ? "x^{2}" : `(${den})^{2}`;
        const answer = `${k > 0 ? "-" : ""}\\frac{${Math.abs(k)}}{${sq}}`;
        const xh = poly([1, "x"], [1, "h"], [c, ""]);
        const num = `${k}${c === 0 ? "x" : `(${den})`} - ${par(k)}(${xh})`;
        const prod = `(${xh})${c === 0 ? "x" : `(${den})`}`;
        return functionProblem({
          prompt: t(
            `Let $f(x) = \\frac{${k}}{${den}}$. Use the definition of the derivative to find $f'(x)$.`,
            `设 $f(x) = \\frac{${k}}{${den}}$。用导数的定义求 $f'(x)$。`,
          ),
          answer,
          prefix: "f'(x) =",
          wrong: [
            `${k > 0 ? "" : "-"}\\frac{${Math.abs(k)}}{${sq}}`,
            `\\frac{${k}}{${den}}`,
            `${k > 0 ? "-" : ""}\\frac{${Math.abs(k)}}{${den}}`,
          ],
          solution: t(
            `$$\\frac{f(x + h) - f(x)}{h} = \\frac{1}{h} \\cdot \\frac{${num}}{${prod}} = \\frac{${-k}}{${prod}}.$$Letting $h \\to 0$ gives $f'(x) = ${answer}$.`,
            `$$\\frac{f(x + h) - f(x)}{h} = \\frac{1}{h} \\cdot \\frac{${num}}{${prod}} = \\frac{${-k}}{${prod}}.$$令 $h \\to 0$，得 $f'(x) = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** Smoothness is how a graph behaves at a point. */
type Smoothness = "smooth" | "corner" | "cusp" | "vertical" | "jump";

/** continuityAndDifferentiabilityOfFunctions relates differentiability and continuity. */
export const continuityAndDifferentiabilityOfFunctions: TopicDef = {
  id: "continuity-and-differentiability-of-functions",
  title: t("Continuity and Differentiability of Functions", "函数的连续性与可导性"),
  summary: t(
    "Recognize where a function is not differentiable, and relate differentiability to continuity.",
    "识别函数在何处不可导，并理解可导性与连续性的关系。",
  ),
  prerequisites: ["defining-the-derivative-using-derivative-notation", "defining-continuity-at-a-point"],
  encompasses: [{ topic: "defining-continuity-at-a-point", weight: 0.3 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "differentiability-from-a-graph",
      title: t("Differentiability from a graph", "由图像判断可导性"),
      explanation: t(
        "$f$ is **differentiable** at $a$ when $f'(a)$ exists: the graph has a single, non-vertical tangent line there. A graph is not differentiable at\n\n- a **corner**, where the slopes from the two sides differ;\n- a **cusp**, where the slopes tend to $\\infty$ and $-\\infty$;\n- a **vertical tangent**;\n- a **discontinuity**.\n\nA differentiable function is continuous, but a continuous function need not be differentiable.",
        "若 $f'(a)$ 存在，即图像在该处有唯一一条非竖直的切线，就称 $f$ 在 $a$ 处**可导**。图像在以下位置不可导：\n\n- **角点**：两侧的斜率不同；\n- **尖点**：斜率分别趋于 $\\infty$ 和 $-\\infty$；\n- **竖直切线**处；\n- **间断点**处。\n\n可导函数一定连续，但连续函数不一定可导。",
      ),
      generate(rng) {
        const kind = rng.pick<Smoothness>(["smooth", "smooth", "corner", "cusp", "vertical", "jump"]);
        const a = rng.int(-3, 3);
        const d = rng.int(-3, 3);
        const k = rng.pick([-2, -1.5, 1.5, 2]);
        const view = { xMin: -6, xMax: 6, yMin: -7, yMax: 7 };
        let marks: PlaneMark[];
        if (kind === "smooth") {
          const m = rng.pick([-1, -0.5, 0, 0.5, 1]);
          const c = rng.pick([-0.3, -0.2, 0.2, 0.3]);
          marks = [
            { kind: "curve", f: (x) => d + m * (x - a) + c * (x - a) ** 2, accent: true },
            { kind: "point", at: [a, d], accent: true },
          ];
        } else if (kind === "corner") {
          const m1 = rng.pick([-2, -1, -0.5, 0.5, 1, 2]);
          const m2 = rng.pick([-2, -1, -0.5, 0.5, 1, 2].filter((m) => m !== m1));
          marks = [
            { kind: "curve", f: (x) => d + m1 * (x - a), to: a, accent: true },
            { kind: "curve", f: (x) => d + m2 * (x - a), from: a, accent: true },
            { kind: "point", at: [a, d], accent: true },
          ];
        } else if (kind === "cusp") {
          marks = [
            { kind: "curve", f: (x) => d + k * Math.cbrt((x - a) ** 2), accent: true },
            { kind: "point", at: [a, d], accent: true },
          ];
        } else if (kind === "vertical") {
          marks = [
            { kind: "curve", f: (x) => d + k * Math.cbrt(x - a), accent: true },
            { kind: "point", at: [a, d], accent: true },
          ];
        } else {
          const e = d + rng.pick([-3, -2, 2, 3]);
          marks = [
            { kind: "curve", f: (x) => d + 0.5 * (x - a), to: a, accent: true },
            { kind: "curve", f: (x) => e + 0.5 * (x - a), from: a, accent: true },
            { kind: "point", at: [a, d], accent: true },
            { kind: "point", at: [a, e], open: true, accent: true },
          ];
        }
        const why: Record<Smoothness, Text> = {
          smooth: t(
            `The graph is smooth at $x = ${a}$, with a single non-vertical tangent line, so $f$ is differentiable there.`,
            `图像在 $x = ${a}$ 处光滑，有唯一一条非竖直的切线，所以 $f$ 在该处可导。`,
          ),
          corner: t(
            `The graph has a corner at $x = ${a}$: the slopes from the left and right differ, so $f'(${a})$ does not exist.`,
            `图像在 $x = ${a}$ 处有一个角点：左右两侧的斜率不同，所以 $f'(${a})$ 不存在。`,
          ),
          cusp: t(
            `The graph has a cusp at $x = ${a}$: the slopes become infinitely steep in opposite directions, so $f'(${a})$ does not exist.`,
            `图像在 $x = ${a}$ 处有一个尖点：两侧斜率朝相反方向无限变陡，所以 $f'(${a})$ 不存在。`,
          ),
          vertical: t(
            `The tangent line at $x = ${a}$ is vertical and has no slope, so $f'(${a})$ does not exist.`,
            `$x = ${a}$ 处的切线是竖直的，斜率没有定义，所以 $f'(${a})$ 不存在。`,
          ),
          jump: t(
            `$f$ is not continuous at $x = ${a}$, so it cannot be differentiable there.`,
            `$f$ 在 $x = ${a}$ 处不连续，所以在该处不可导。`,
          ),
        };
        const figure: Figure = { svg: plane(view, marks), alt: t("The graph of y = f(x).", "y = f(x) 的图像。") };
        const reasons: Record<Smoothness, Text> = {
          smooth: t("Yes, because the graph has a single non-vertical tangent line there.", "是，因为图像在该处有唯一一条非竖直的切线。"),
          corner: t("No, because the graph has a corner there.", "否，因为图像在该处有一个角点。"),
          cusp: t("No, because the graph has a cusp there.", "否，因为图像在该处有一个尖点。"),
          vertical: t("No, because the tangent line there is vertical.", "否，因为该处的切线是竖直的。"),
          jump: t("No, because $f$ is not continuous there.", "否，因为 $f$ 在该处不连续。"),
        };
        const continuous = t("Yes, because $f$ is continuous there.", "是，因为 $f$ 在该处连续。");
        const faults = [reasons.corner, reasons.cusp, reasons.vertical, reasons.jump];
        return {
          ...reasonChoice(rng, {
            prompt: t(
              `The graph of $y = f(x)$ is shown. Is $f$ differentiable at $x = ${a}$?`,
              `图中是 $y = f(x)$ 的图像。$f$ 在 $x = ${a}$ 处可导吗？`,
            ),
            correct: reasons[kind],
            wrong: [reasons.smooth, continuous, ...rng.shuffle(faults)].filter((r) => r !== reasons[kind]).slice(0, 3),
            solution: why[kind],
          }),
          figure,
        };
      },
    },
    {
      id: "differentiability-of-piecewise-functions",
      title: t("Differentiability of piecewise functions", "分段函数的可导性"),
      explanation: t(
        "At the break point $a$ of a piecewise function made of polynomials:\n\n1. if the pieces do not meet at $a$, $f$ is not continuous, so not differentiable;\n2. if they meet, compare the slopes of the two pieces at $a$: $f$ is differentiable exactly when they are equal.",
        "在由多项式构成的分段函数的分段点 $a$ 处：\n\n1. 若两段在 $a$ 处不相接，$f$ 不连续，因此不可导；\n2. 若相接，比较两段在 $a$ 处的斜率：当且仅当它们相等时 $f$ 可导。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const left = quadratic(rng);
        const kind = rng.int(0, 2);
        const slope = pAt(pDer(left), a);
        const m = kind === 0 ? slope : rng.pick(range(-6, 6).filter((x) => x !== slope));
        const meet = pAt(left, a) - m * a;
        const d = kind === 2 ? meet + rng.pick([-3, -2, -1, 1, 2, 3]) : meet;
        const right: Poly = [d, m];
        const f = `f(x) = \\begin{cases} ${pLatex(left)} & x < ${a} \\\\ ${pLatex(right)} & x \\ge ${a} \\end{cases}`;
        const options = [
          t("Continuous and differentiable", "连续且可导"),
          t("Continuous but not differentiable", "连续但不可导"),
          t("Neither continuous nor differentiable", "既不连续也不可导"),
          t("Differentiable but not continuous", "可导但不连续"),
        ];
        const L = pAt(left, a);
        const R = pAt(right, a);
        return oneOf(
          rng,
          t(`Let $$${f}$$ Which describes $f$ at $x = ${a}$?`, `设 $$${f}$$ 下列哪一项描述了 $f$ 在 $x = ${a}$ 处的情况？`),
          options[kind]!,
          options.filter((_, i) => i !== kind),
          kind === 2
            ? t(
                `The left piece gives $${L}$ at $x = ${a}$ but the right piece gives $${R}$, so $f$ is not continuous there, and therefore not differentiable.`,
                `在 $x = ${a}$ 处左段的值为 $${L}$，右段的值为 $${R}$，所以 $f$ 在该处不连续，因而不可导。`,
              )
            : t(
                `Both pieces give $${L}$ at $x = ${a}$, so $f$ is continuous. The slope of the left piece there is $${slope}$ and of the right piece $${m}$; ${kind === 0 ? "they are equal, so $f$ is differentiable." : "they differ, so $f$ has a corner and is not differentiable."}`,
                `两段在 $x = ${a}$ 处的值都是 $${L}$，所以 $f$ 连续。左段在该处的斜率为 $${slope}$，右段为 $${m}$；${kind === 0 ? "二者相等，所以 $f$ 可导。" : "二者不等，所以 $f$ 有角点，不可导。"}`,
              ),
        );
      },
    },
  ],
};

/** powerTerm writes kx^e for a rational exponent e: "3x^{2}", "-\\frac{1}{2}x^{-\\frac{3}{2}}", "5". */
const powerTerm = (k: Q, e: Q) => (e.isZero() ? k.toLatex() : poly([k, e.eq(Q.one) ? "x" : `x^{${e.toLatex()}}`]));

/** RootForm is a power of x written with a root or a fraction, and its exponent. */
interface RootForm {
  readonly latex: (k: number) => string;
  readonly e: Q;
  readonly rewrite: string;
}

/** rootForms are powers written with roots and fractions. */
const rootForms: readonly RootForm[] = [
  { latex: (k) => `${k === 1 ? "" : k}\\sqrt{x}`, e: Q.of(1, 2), rewrite: "x^{\\frac{1}{2}}" },
  { latex: (k) => `${k === 1 ? "" : k}\\sqrt[3]{x}`, e: Q.of(1, 3), rewrite: "x^{\\frac{1}{3}}" },
  { latex: (k) => `${k === 1 ? "" : k}\\sqrt[3]{x^{2}}`, e: Q.of(2, 3), rewrite: "x^{\\frac{2}{3}}" },
  { latex: (k) => `${k === 1 ? "" : k}x\\sqrt{x}`, e: Q.of(3, 2), rewrite: "x^{\\frac{3}{2}}" },
  { latex: (k) => `${k === 1 ? "" : k}\\sqrt[4]{x^{3}}`, e: Q.of(3, 4), rewrite: "x^{\\frac{3}{4}}" },
  { latex: (k) => `\\frac{${k}}{x}`, e: Q.of(-1), rewrite: "x^{-1}" },
  { latex: (k) => `\\frac{${k}}{x^{2}}`, e: Q.of(-2), rewrite: "x^{-2}" },
  { latex: (k) => `\\frac{${k}}{x^{3}}`, e: Q.of(-3), rewrite: "x^{-3}" },
  { latex: (k) => `\\frac{${k}}{x^{5}}`, e: Q.of(-5), rewrite: "x^{-5}" },
  { latex: (k) => `\\frac{${k}}{\\sqrt{x}}`, e: Q.of(-1, 2), rewrite: "x^{-\\frac{1}{2}}" },
  { latex: (k) => `\\frac{${k}}{\\sqrt[3]{x}}`, e: Q.of(-1, 3), rewrite: "x^{-\\frac{1}{3}}" },
  { latex: (k) => `\\frac{${k}}{x\\sqrt{x}}`, e: Q.of(-3, 2), rewrite: "x^{-\\frac{3}{2}}" },
];

/** thePowerRuleForDifferentiation differentiates powers of x. */
export const thePowerRuleForDifferentiation: TopicDef = {
  id: "the-power-rule-for-differentiation",
  title: t("The Power Rule for Differentiation", "求导的幂法则"),
  summary: t(
    "Differentiate powers of x, including negative and fractional powers, with the power rule.",
    "用幂法则对 x 的幂求导，包括负指数幂和分数指数幂。",
  ),
  prerequisites: ["defining-the-derivative-using-derivative-notation", "writing-radicals-using-fractional-exponents"],
  encompasses: [{ topic: "writing-radicals-using-fractional-exponents", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-power-rule-for-positive-integer-powers",
      title: t("The power rule for positive integer powers", "正整数次幂的幂法则"),
      explanation: t(
        "**Power rule.** $\\frac{d}{dx} x^{n} = nx^{n - 1}$: bring the exponent down as a factor and lower it by one. A constant factor stays: $\\frac{d}{dx} 4x^{5} = 20x^{4}$. The derivative of a constant is $0$.",
        "**幂法则** $\\frac{d}{dx} x^{n} = nx^{n - 1}$：把指数拿下来作为因数，再把指数减一。常数因子保留：$\\frac{d}{dx} 4x^{5} = 20x^{4}$。常数的导数为 $0$。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const k = rng.pick([1, 1, -1, 2, 3, 4, 5, -2, -3, 6, 7]);
        const f = poly([k, power(n)]);
        const answer = poly([k * n, power(n - 1)]);
        return functionProblem({
          prompt: t(`Find $\\frac{d}{dx}\\left(${f}\\right)$.`, `求 $\\frac{d}{dx}\\left(${f}\\right)$。`),
          answer,
          wrong: [poly([k * n, power(n)]), poly([k, power(n - 1)]), poly([k * (n - 1), power(n - 1)]), poly([k * n, power(n + 1)])],
          solution: t(
            `By the power rule, $\\frac{d}{dx}\\left(${f}\\right) = ${k === 1 ? "" : `${par(k)} \\cdot `}${n}x^{${n - 1}} = ${answer}$.`,
            `由幂法则，$\\frac{d}{dx}\\left(${f}\\right) = ${k === 1 ? "" : `${par(k)} \\cdot `}${n}x^{${n - 1}} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "the-power-rule-for-negative-and-fractional-powers",
      title: t("The power rule for negative and fractional powers", "负指数与分数指数的幂法则"),
      explanation: t(
        "The power rule holds for every real exponent. Rewrite roots and fractions as powers first:\n\n$$\\frac{d}{dx} \\frac{6}{x^{2}} = \\frac{d}{dx} 6x^{-2} = -12x^{-3}, \\qquad \\frac{d}{dx} \\sqrt{x} = \\frac{d}{dx} x^{\\frac{1}{2}} = \\frac{1}{2}x^{-\\frac{1}{2}}.$$",
        "幂法则对任意实数指数都成立。先把根式和分式改写成幂：\n\n$$\\frac{d}{dx} \\frac{6}{x^{2}} = \\frac{d}{dx} 6x^{-2} = -12x^{-3}, \\qquad \\frac{d}{dx} \\sqrt{x} = \\frac{d}{dx} x^{\\frac{1}{2}} = \\frac{1}{2}x^{-\\frac{1}{2}}.$$",
      ),
      generate(rng) {
        const form = rng.pick(rootForms);
        const k = rng.pick([1, 2, 3, 4, 6, 8, 9, 10, 12, -2, -3, -4]);
        const f = form.latex(k);
        const e1 = form.e.sub(Q.one);
        const coef = Q.of(k).mul(form.e);
        const answer = powerTerm(coef, e1);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$, where $x > 0$.`, `设 $f(x) = ${f}$，其中 $x > 0$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          positive: true,
          wrong: [powerTerm(coef, form.e.add(Q.one)), powerTerm(Q.of(k), e1), powerTerm(coef.neg(), e1), powerTerm(coef, form.e)],
          solution: t(
            `Rewrite $f(x) = ${powerTerm(Q.of(k), form.e)}$. By the power rule, $f'(x) = ${par(k)} \\cdot ${par(form.e)}x^{${form.e.toLatex()} - 1} = ${answer}$.`,
            `改写为 $f(x) = ${powerTerm(Q.of(k), form.e)}$。由幂法则，$f'(x) = ${par(k)} \\cdot ${par(form.e)}x^{${form.e.toLatex()} - 1} = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** Term is one term kx^e of a sum. */
interface Term {
  readonly k: Q;
  readonly e: Q;
  readonly latex: string;
}

/** mixedTerm is a power written with a root or a fraction. */
function mixedTerm(rng: Rng): Term {
  const form = rng.pick(rootForms);
  const k = rng.pick([1, 2, 3, 4, 6, 8, -2, -4]);
  return { k: Q.of(k), e: form.e, latex: form.latex(k) };
}

/** theSumAndConstantMultipleRulesForDifferentiation differentiates sums. */
export const theSumAndConstantMultipleRulesForDifferentiation: TopicDef = {
  id: "the-sum-and-constant-multiple-rules-for-differentiation",
  title: t("The Sum and Constant Multiple Rules for Differentiation", "求导的和法则与常数倍法则"),
  summary: t(
    "Differentiate polynomials and other sums of powers term by term, and evaluate derivatives at points.",
    "对多项式及其他幂函数之和逐项求导，并计算导数在某点处的值。",
  ),
  prerequisites: ["the-power-rule-for-differentiation"],
  encompasses: [{ topic: "the-power-rule-for-differentiation", weight: 0.6 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "differentiating-polynomials",
      title: t("Differentiating polynomials", "多项式求导"),
      explanation: t(
        "The derivative of a sum is the sum of the derivatives and constants factor out, so a polynomial is differentiated one term at a time with the power rule. **Sum rule.** $(f + g)' = f' + g'$. **Constant multiple rule.** $(cf)' = cf'$. So a polynomial is differentiated term by term:\n\n$$\\frac{d}{dx}\\left(2x^{3} - 5x^{2} + 7x - 4\\right) = 6x^{2} - 10x + 7.$$",
        "和的导数等于导数的和，常数可以提出，所以多项式可以用幂法则逐项求导。**和法则** $(f + g)' = f' + g'$。**常数倍法则** $(cf)' = cf'$。所以多项式可以逐项求导：\n\n$$\\frac{d}{dx}\\left(2x^{3} - 5x^{2} + 7x - 4\\right) = 6x^{2} - 10x + 7.$$",
      ),
      generate(rng) {
        const deg = rng.int(3, 5);
        const p: number[] = range(0, deg).map((i) => (i === deg ? rng.nonZero(-5, 5) : rng.int(-9, 9)));
        const answer = pLatex(pDer(p));
        const d = pDer(p);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${pLatex(p)}$.`, `设 $f(x) = ${pLatex(p)}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [pLatex([p[0]!, ...d.slice(1)]), pLatex(p.slice(1)), pLatex(p.map((c, i) => c * i))],
          solution: t(
            `Differentiate term by term with the power rule: $f'(x) = ${answer}$. The constant $${p[0]}$ has derivative $0$.`,
            `用幂法则逐项求导：$f'(x) = ${answer}$。常数 $${p[0]}$ 的导数为 $0$。`,
          ),
        });
      },
    },
    {
      id: "differentiating-sums-of-powers",
      title: t("Differentiating sums of powers", "幂函数之和的求导"),
      explanation: t(
        "When a sum mixes roots, fractions and powers, rewrite every term as $kx^{n}$ and then differentiate term by term:\n\n$$\\frac{d}{dx}\\left(x^{2} + 4\\sqrt{x} - \\frac{3}{x}\\right) = \\frac{d}{dx}\\left(x^{2} + 4x^{\\frac{1}{2}} - 3x^{-1}\\right) = 2x + 2x^{-\\frac{1}{2}} + 3x^{-2}.$$",
        "当和式中混有根式、分式和幂时，把每一项改写成 $kx^{n}$，再逐项求导：\n\n$$\\frac{d}{dx}\\left(x^{2} + 4\\sqrt{x} - \\frac{3}{x}\\right) = \\frac{d}{dx}\\left(x^{2} + 4x^{\\frac{1}{2}} - 3x^{-1}\\right) = 2x + 2x^{-\\frac{1}{2}} + 3x^{-2}.$$",
      ),
      generate(rng) {
        const n = rng.int(2, 5);
        const kn = rng.nonZero(-4, 4);
        const first: Term = { k: Q.of(kn), e: Q.of(n), latex: poly([kn, power(n)]) };
        let second = mixedTerm(rng);
        while (second.e.eq(first.e)) second = mixedTerm(rng);
        const c = rng.int(-9, 9);
        const terms = [first, second];
        const f = sumLatex([first.latex, second.latex, ...(c === 0 ? [] : [String(c)])]);
        const parts = terms.map((x) => [x.k.mul(x.e), x.e.sub(Q.one)] as const);
        const answer = sumLatex(parts.map(([k, e]) => powerTerm(k, e)));
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$, where $x > 0$.`, `设 $f(x) = ${f}$，其中 $x > 0$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          positive: true,
          wrong: [
            sumLatex(terms.map((x) => powerTerm(x.k.mul(x.e), x.e.add(Q.one)))),
            sumLatex([...parts.map(([k, e]) => powerTerm(k, e)), ...(c === 0 ? [] : [String(c)])]).replace(/^$/, "0"),
            sumLatex(terms.map((x) => powerTerm(x.k, x.e.sub(Q.one)))),
          ],
          solution: t(
            `Rewrite $f(x) = ${sumLatex([...terms.map((x) => powerTerm(x.k, x.e)), ...(c === 0 ? [] : [String(c)])])}$ and differentiate term by term:$$f'(x) = ${answer}.$$`,
            `改写为 $f(x) = ${sumLatex([...terms.map((x) => powerTerm(x.k, x.e)), ...(c === 0 ? [] : [String(c)])])}$，再逐项求导：$$f'(x) = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "evaluating-a-derivative-at-a-point",
      title: t("Evaluating a derivative at a point", "求导数在某点处的值"),
      explanation: t(
        "To find $f'(a)$, first find the function $f'(x)$, then substitute $x = a$. Do not substitute into $f$ first: $f(a)$ is a constant, whose derivative is $0$.",
        "求 $f'(a)$ 时，先求出导函数 $f'(x)$，再代入 $x = a$。不要先代入 $f$：$f(a)$ 是常数，它的导数为 $0$。",
      ),
      generate(rng) {
        const p = cubic(rng);
        const a = rng.nonZero(-3, 3);
        const d = pDer(p);
        const answer = pAt(d, a);
        return numberProblem({
          prompt: t(`Let $f(x) = ${pLatex(p)}$. Find $f'(${a})$.`, `设 $f(x) = ${pLatex(p)}$。求 $f'(${a})$。`),
          answer,
          wrong: [pAt(p, a), 0, pAt(d, -a), answer - d[0]!],
          solution: t(`$f'(x) = ${pLatex(d)}$, so $f'(${a}) = ${answer}$.`, `$f'(x) = ${pLatex(d)}$，所以 $f'(${a}) = ${answer}$。`),
        });
      },
    },
  ],
};

/** calculatingTheSlopeOfATangentLineUsingDifferentiation reads tangent slopes from derivatives. */
export const calculatingTheSlopeOfATangentLineUsingDifferentiation: TopicDef = {
  id: "calculating-the-slope-of-a-tangent-line-using-differentiation",
  title: t("Calculating the Slope of a Tangent Line Using Differentiation", "用求导计算切线的斜率"),
  summary: t(
    "Find the slope of the tangent line at a point, and the points where the tangent has a given slope.",
    "求某点处切线的斜率，以及切线斜率为给定值的点。",
  ),
  prerequisites: ["the-sum-and-constant-multiple-rules-for-differentiation"],
  encompasses: [{ topic: "the-sum-and-constant-multiple-rules-for-differentiation", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-slope-of-a-tangent-line-at-a-point",
      title: t("The slope of a tangent line at a point", "某点处切线的斜率"),
      explanation: t(
        "The **tangent line** to $y = f(x)$ at $x = a$ is the line through $(a, f(a))$ that the curve hugs there. Its slope is $f'(a)$. For $y = x^{3} - 2x$ at $x = 2$: $y' = 3x^{2} - 2$, so the slope is $10$.",
        "$y = f(x)$ 在 $x = a$ 处的**切线**是经过 $(a, f(a))$、与曲线在该处紧贴的直线。它的斜率是 $f'(a)$。对 $y = x^{3} - 2x$ 在 $x = 2$ 处：$y' = 3x^{2} - 2$，所以斜率为 $10$。",
      ),
      generate(rng) {
        const p = rng.bool() ? cubic(rng) : quadratic(rng);
        const a = rng.int(-3, 3);
        const d = pDer(p);
        const answer = pAt(d, a);
        return numberProblem({
          prompt: t(
            `Find the slope of the tangent line to $y = ${pLatex(p)}$ at the point where $x = ${a}$.`,
            `求曲线 $y = ${pLatex(p)}$ 在 $x = ${a}$ 处的切线斜率。`,
          ),
          answer,
          wrong: [pAt(p, a), d[0]!, pAt(d, a + 1)],
          solution: t(
            `$y' = ${pLatex(d)}$, so the slope at $x = ${a}$ is $y'(${a}) = ${answer}$.`,
            `$y' = ${pLatex(d)}$，所以 $x = ${a}$ 处的斜率为 $y'(${a}) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "points-where-the-tangent-has-a-given-slope",
      title: t("Points where the tangent has a given slope", "切线斜率为给定值的点"),
      explanation: t(
        "To find where the tangent line has slope $m$, solve $f'(x) = m$. A horizontal tangent has slope $0$. For $f(x) = x^{3} - 3x$, $f'(x) = 3x^{2} - 3 = 0$ at $x = \\pm 1$.",
        "要求切线斜率为 $m$ 的点，就解方程 $f'(x) = m$。水平切线的斜率为 $0$。对 $f(x) = x^{3} - 3x$，$f'(x) = 3x^{2} - 3 = 0$ 的解是 $x = \\pm 1$。",
      ),
      generate(rng) {
        const r1 = rng.int(-4, 4);
        const r2 = rng.pick(range(-4, 4).filter((r) => r !== r1 && (r + r1) % 2 === 0));
        const m = rng.pick([0, 0, rng.int(-9, 9)]);
        // f'(x) = 3(x − r1)(x − r2) + m.
        const p: Poly = [rng.int(-5, 5), 3 * r1 * r2 + m, (-3 * (r1 + r2)) / 2, 1];
        const d = pDer(p);
        const what = m === 0 ? t("is horizontal", "是水平的") : t(`has slope $${m}$`, `的斜率为 $${m}$`);
        return solutionsProblem({
          prompt: t(
            `Find every $x$ at which the tangent line to $y = ${pLatex(p)}$ ${what.en}.`,
            `求曲线 $y = ${pLatex(p)}$ 的切线${what["zh-CN"]}时的所有 $x$ 值。`,
          ),
          values: [String(r1), String(r2)],
          wrong: [[String(-r1), String(-r2)], [String(r1)], [String(r1 + r2)]],
          solution: t(
            `Solve $y' = ${m}$:$$${m === 0 ? "" : `${pLatex(d)} = ${m} \\implies `}${pLatex([3 * r1 * r2, -3 * (r1 + r2), 3])} = 0 \\implies 3${fac(r1)}${fac(r2)} = 0,$$so $x = ${r1}$ or $x = ${r2}$.`,
            `解方程 $y' = ${m}$：$$${m === 0 ? "" : `${pLatex(d)} = ${m} \\implies `}${pLatex([3 * r1 * r2, -3 * (r1 + r2), 3])} = 0 \\implies 3${fac(r1)}${fac(r2)} = 0,$$所以 $x = ${r1}$ 或 $x = ${r2}$。`,
          ),
        });
      },
    },
  ],
};

/** pointSlope writes the line through (a, y0) with slope m: "y - 3 = 2(x + 1)". */
function pointSlope(a: number, y0: Q | number, m: Q | number): string {
  const q = m instanceof Q ? m : Q.of(m);
  const lhs = poly([1, "y"], [(y0 instanceof Q ? y0 : Q.of(y0)).neg(), ""]);
  const rhs = poly([q, a === 0 ? "x" : `(${bare(a)})`]).replace(/^\((.*)\)$/, "$1");
  return `${lhs} = ${rhs}`;
}

/** lineLatex writes y = mx + b with rational coefficients. */
const lineLatex = (m: Q, b: Q) => poly([m, "x"], [b, ""]);

/** PowerCurve is a curve k√x or k/x at a point where its value and slope are rational. */
interface PowerCurve {
  readonly latex: string;
  readonly a: number;
  readonly y: Q;
  readonly slope: Q;
  readonly derivative: string;
}

/** powerCurve chooses k√x at a perfect square or k/x at an integer. */
function powerCurve(rng: Rng): PowerCurve {
  const k = rng.pick([1, 2, 3, 4, 6, 8, -2, -4]);
  if (rng.bool()) {
    const n = rng.int(1, 4);
    return {
      latex: `${k === 1 ? "" : k}\\sqrt{x}`,
      a: n * n,
      y: Q.of(k * n),
      slope: Q.of(k, 2 * n),
      derivative: `\\frac{${k}}{2\\sqrt{x}}`,
    };
  }
  const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
  return {
    latex: `\\frac{${k}}{x}`,
    a,
    y: Q.of(k, a),
    slope: Q.of(-k, a * a),
    derivative: `${k > 0 ? "-" : ""}\\frac{${Math.abs(k)}}{x^{2}}`,
  };
}

/** calculatingTheEquationOfATangentLineUsingDifferentiation writes tangent lines. */
export const calculatingTheEquationOfATangentLineUsingDifferentiation: TopicDef = {
  id: "calculating-the-equation-of-a-tangent-line-using-differentiation",
  title: t("Calculating the Equation of a Tangent Line Using Differentiation", "用求导求切线方程"),
  summary: t(
    "Write the equation of the tangent line to a curve at a point from the point and the derivative.",
    "由切点和导数写出曲线在某点处的切线方程。",
  ),
  prerequisites: ["calculating-the-slope-of-a-tangent-line-using-differentiation", "point-slope-form"],
  encompasses: [
    { topic: "calculating-the-slope-of-a-tangent-line-using-differentiation", weight: 0.6 },
    { topic: "point-slope-form", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "tangent-lines-to-polynomial-curves",
      title: t("Tangent lines to polynomial curves", "多项式曲线的切线"),
      explanation: t(
        "The tangent line at $x = a$ passes through $(a, f(a))$ with slope $f'(a)$. In point-slope form,\n\n$$y - f(a) = f'(a)(x - a).$$\n\nFor $f(x) = x^{2} + 1$ at $a = 2$: $f(2) = 5$, $f'(2) = 4$, so $y - 5 = 4(x - 2)$, that is, $y = 4x - 3$.",
        "$x = a$ 处的切线经过 $(a, f(a))$，斜率为 $f'(a)$。用点斜式表示为\n\n$$y - f(a) = f'(a)(x - a).$$\n\n对 $f(x) = x^{2} + 1$ 在 $a = 2$ 处：$f(2) = 5$，$f'(2) = 4$，所以 $y - 5 = 4(x - 2)$，即 $y = 4x - 3$。",
      ),
      generate(rng) {
        const p = rng.bool() ? cubic(rng) : quadratic(rng);
        const a = rng.int(-3, 3);
        const fa = pAt(p, a);
        const m = pAt(pDer(p), a);
        const b = fa - m * a;
        const answer = lineLatex(Q.of(m), Q.of(b));
        return expressionProblem({
          prompt: t(
            `Find the equation of the tangent line to $y = ${pLatex(p)}$ at $x = ${a}$. Write it in the form $y = mx + b$.`,
            `求曲线 $y = ${pLatex(p)}$ 在 $x = ${a}$ 处的切线方程，写成 $y = mx + b$ 的形式。`,
          ),
          answer,
          prefix: "y =",
          simplified: true,
          wrong: [lineLatex(Q.of(m), Q.of(fa)), lineLatex(Q.of(fa), Q.of(b)), lineLatex(Q.of(m), Q.of(fa + m * a)), pLatex(pDer(p))],
          solution: t(
            `$f(${a}) = ${fa}$ and $f'(x) = ${pLatex(pDer(p))}$, so $f'(${a}) = ${m}$. The tangent line is$$${pointSlope(a, fa, m)} \\implies y = ${answer}.$$`,
            `$f(${a}) = ${fa}$，$f'(x) = ${pLatex(pDer(p))}$，所以 $f'(${a}) = ${m}$。切线为$$${pointSlope(a, fa, m)} \\implies y = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "tangent-lines-to-power-curves",
      title: t("Tangent lines to power curves", "幂函数曲线的切线"),
      explanation: t(
        "The same method works for any curve whose derivative we know. For $y = \\frac{4}{x}$ at $x = 2$: $y = 2$ and $y' = -\\frac{4}{x^{2}} = -1$, so the tangent line is $y - 2 = -(x - 2)$, that is, $y = -x + 4$.",
        "对任何已知导数的曲线，方法都一样。对 $y = \\frac{4}{x}$ 在 $x = 2$ 处：$y = 2$，$y' = -\\frac{4}{x^{2}} = -1$，所以切线为 $y - 2 = -(x - 2)$，即 $y = -x + 4$。",
      ),
      generate(rng) {
        const c = powerCurve(rng);
        const b = c.y.sub(c.slope.mul(Q.of(c.a)));
        const answer = lineLatex(c.slope, b);
        return expressionProblem({
          prompt: t(
            `Find the equation of the tangent line to $y = ${c.latex}$ at $x = ${c.a}$. Write it in the form $y = mx + b$.`,
            `求曲线 $y = ${c.latex}$ 在 $x = ${c.a}$ 处的切线方程，写成 $y = mx + b$ 的形式。`,
          ),
          answer,
          prefix: "y =",
          simplified: true,
          wrong: [lineLatex(c.slope, c.y), lineLatex(c.slope.neg(), c.y.add(c.slope.mul(Q.of(c.a)))), lineLatex(c.y, b)],
          solution: t(
            `At $x = ${c.a}$, $y = ${c.y.toLatex()}$, and $y' = ${c.derivative}$ gives slope $${c.slope.toLatex()}$. So$$${pointSlope(c.a, c.y, c.slope)} \\implies y = ${answer}.$$`,
            `在 $x = ${c.a}$ 处 $y = ${c.y.toLatex()}$，由 $y' = ${c.derivative}$ 得斜率 $${c.slope.toLatex()}$。所以$$${pointSlope(c.a, c.y, c.slope)} \\implies y = ${answer}.$$`,
          ),
        });
      },
    },
  ],
};

/** calculatingTheEquationOfANormalLineUsingDifferentiation writes normal lines. */
export const calculatingTheEquationOfANormalLineUsingDifferentiation: TopicDef = {
  id: "calculating-the-equation-of-a-normal-line-using-differentiation",
  title: t("Calculating the Equation of a Normal Line Using Differentiation", "用求导求法线方程"),
  summary: t(
    "Find the slope and equation of the normal line, perpendicular to the tangent line at a point.",
    "求法线（与某点处切线垂直的直线）的斜率和方程。",
  ),
  prerequisites: ["calculating-the-equation-of-a-tangent-line-using-differentiation", "perpendicular-lines-in-the-coordinate-plane"],
  encompasses: [
    { topic: "calculating-the-equation-of-a-tangent-line-using-differentiation", weight: 0.5 },
    { topic: "perpendicular-lines-in-the-coordinate-plane", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "the-slope-of-a-normal-line",
      title: t("The slope of a normal line", "法线的斜率"),
      explanation: t(
        "The **normal line** at a point is perpendicular to the tangent line there. When the tangent slope is $m \\ne 0$, the normal slope is the negative reciprocal $-\\frac{1}{m}$. (A horizontal tangent has a vertical normal.)",
        "某点处的**法线**与该点处的切线垂直。当切线斜率 $m \\ne 0$ 时，法线斜率是它的负倒数 $-\\frac{1}{m}$。（水平切线对应竖直的法线。）",
      ),
      generate(rng) {
        let p = rng.bool() ? cubic(rng) : quadratic(rng);
        const a = rng.int(-3, 3);
        while (pAt(pDer(p), a) === 0) p = quadratic(rng);
        const m = pAt(pDer(p), a);
        const answer = Q.of(-1, m);
        const raw = `-\\frac{1}{${m}}`;
        const steps = raw === answer.toLatex() ? raw : `${raw} = ${answer.toLatex()}`;
        return numberProblem({
          prompt: t(
            `Find the slope of the normal line to $y = ${pLatex(p)}$ at $x = ${a}$.`,
            `求曲线 $y = ${pLatex(p)}$ 在 $x = ${a}$ 处的法线斜率。`,
          ),
          answer,
          wrong: [Q.of(m), Q.of(-m), Q.of(1, m)],
          solution: t(
            `$y' = ${pLatex(pDer(p))}$, so the tangent slope is $${m}$ and the normal slope is $${steps}$.`,
            `$y' = ${pLatex(pDer(p))}$，所以切线斜率为 $${m}$，法线斜率为 $${steps}$。`,
          ),
        });
      },
    },
    {
      id: "the-equation-of-a-normal-line",
      title: t("The equation of a normal line", "法线方程"),
      explanation: t(
        "The normal line at $x = a$ passes through $(a, f(a))$ with slope $-\\frac{1}{f'(a)}$:\n\n$$y - f(a) = -\\frac{1}{f'(a)}(x - a).$$\n\nFor $f(x) = x^{2}$ at $a = 1$: the point is $(1, 1)$ and $f'(1) = 2$, so $y - 1 = -\\frac{1}{2}(x - 1)$, that is, $y = -\\frac{1}{2}x + \\frac{3}{2}$.",
        "$x = a$ 处的法线经过 $(a, f(a))$，斜率为 $-\\frac{1}{f'(a)}$：\n\n$$y - f(a) = -\\frac{1}{f'(a)}(x - a).$$\n\n对 $f(x) = x^{2}$ 在 $a = 1$ 处：点为 $(1, 1)$，$f'(1) = 2$，所以 $y - 1 = -\\frac{1}{2}(x - 1)$，即 $y = -\\frac{1}{2}x + \\frac{3}{2}$。",
      ),
      generate(rng) {
        let p = quadratic(rng);
        const a = rng.int(-3, 3);
        while (pAt(pDer(p), a) === 0) p = quadratic(rng);
        const fa = pAt(p, a);
        const m = pAt(pDer(p), a);
        const n = Q.of(-1, m);
        const b = Q.of(fa).sub(n.mul(Q.of(a)));
        const answer = lineLatex(n, b);
        return expressionProblem({
          prompt: t(
            `Find the equation of the normal line to $y = ${pLatex(p)}$ at $x = ${a}$. Write it in the form $y = mx + b$.`,
            `求曲线 $y = ${pLatex(p)}$ 在 $x = ${a}$ 处的法线方程，写成 $y = mx + b$ 的形式。`,
          ),
          answer,
          prefix: "y =",
          simplified: true,
          wrong: [lineLatex(Q.of(m), Q.of(fa - m * a)), lineLatex(Q.of(1, m), Q.of(fa).sub(Q.of(a, m))), lineLatex(n, Q.of(fa))],
          solution: t(
            `The point is $(${a}, ${fa})$ and $f'(${a}) = ${m}$, so the normal slope is $${n.toLatex()}$:$$${pointSlope(a, fa, n)} \\implies y = ${answer}.$$`,
            `切点为 $(${a}, ${fa})$，$f'(${a}) = ${m}$，所以法线斜率为 $${n.toLatex()}$：$$${pointSlope(a, fa, n)} \\implies y = ${answer}.$$`,
          ),
        });
      },
    },
  ],
};

/** calculusIDifferentiationTopics are the topics of Calculus I module 4.9. */
export const calculusIDifferentiationTopics: readonly TopicDef[] = [
  theAverageRateOfChangeOfAFunctionOverAVaryingInterval,
  theInstantaneousRateOfChangeOfAFunctionAtAPoint,
  definingTheDerivativeUsingDerivativeNotation,
  continuityAndDifferentiabilityOfFunctions,
  thePowerRuleForDifferentiation,
  theSumAndConstantMultipleRulesForDifferentiation,
  calculatingTheSlopeOfATangentLineUsingDifferentiation,
  calculatingTheEquationOfATangentLineUsingDifferentiation,
  calculatingTheEquationOfANormalLineUsingDifferentiation,
];
