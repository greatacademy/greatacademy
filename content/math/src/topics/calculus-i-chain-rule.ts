import type { Figure, Rng, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type PlaneMark, plane, poly, Q } from "@ga/subject-math";

import { choiceProblem, functionProblem, numberProblem } from "../problems.ts";
import { cdot, fracL, oneOf, type Poly, pAt, par, pDer, pLatex, power, sumLatex, table } from "./calculus-common.ts";

// Calculus I unit 5: Advanced Differentiation, module 5.11.

/** Inner is an inner function g with its derivative. */
interface Inner {
  readonly g: string;
  readonly dg: string;
  /** coef is g' when it is a constant, which then multiplies in front. */
  readonly coef?: number;
  /** at evaluates g. */
  readonly at: (x: number) => number;
}

/** linearInner is ax + b with a ≠ 0, ±1 most of the time. */
function linearInner(rng: Rng, positive = false): Inner {
  const a = positive ? rng.int(2, 5) : rng.pick([2, 3, 4, 5, -2, -3, -1]);
  const b = positive ? rng.int(1, 9) : rng.int(-9, 9);
  return { g: poly([a, "x"], [b, ""]), dg: String(a), coef: a, at: (x) => a * x + b };
}

/** quadraticInner is x² + c or ax² + c. */
function quadraticInner(rng: Rng, positive = false): Inner {
  const a = rng.pick([1, 1, 2, 3]);
  const c = positive ? rng.int(1, 9) : rng.nonZero(-9, 9);
  return { g: poly([a, "x^{2}"], [c, ""]), dg: poly([2 * a, "x"]), at: (x) => a * x * x + c };
}

/** times writes k·g'·rest, putting a constant g' in front: "6(2x + 1)^{2}", "4x(x^{2} + 1)". */
function times(k: number, inner: Inner, rest: string): string {
  if (inner.coef !== undefined) return poly([k * inner.coef, rest]);
  const [m, v] = splitMonomial(inner.dg);
  return poly([k * m, `${v}${rest}`]);
}

/** splitMonomial splits "6x" into [6, "x"], "-x" into [-1, "x"]. */
function splitMonomial(s: string): [number, string] {
  const m = /^(-?\d*)(.*)$/.exec(s)!;
  const c = m[1] === "" ? 1 : m[1] === "-" ? -1 : Number(m[1]);
  return [c, m[2]!];
}

/** theChainRuleForDifferentiation differentiates composite functions. */
export const theChainRuleForDifferentiation: TopicDef = {
  id: "the-chain-rule-for-differentiation",
  title: t("The Chain Rule for Differentiation", "求导的链式法则"),
  summary: t(
    "Differentiate powers and roots of inner functions, and composite functions at a point, with the chain rule.",
    "用链式法则对内层函数的幂和根式求导，并计算复合函数在某点处的导数。",
  ),
  prerequisites: ["the-quotient-rule-for-differentiation", "function-composition"],
  encompasses: [
    { topic: "the-power-rule-for-differentiation", weight: 0.3 },
    { topic: "function-composition", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "powers-of-inner-functions",
      title: t("Powers of inner functions", "内层函数的幂"),
      explanation: t(
        "**Chain rule.** If $y = f(g(x))$, then\n\n$$\\frac{dy}{dx} = f'(g(x)) \\cdot g'(x):$$\n\ndifferentiate the outer function, keep the inner function inside it, and multiply by the derivative of the inner function. For a power,\n\n$$\\frac{d}{dx}\\left(x^{2} + 1\\right)^{5} = 5\\left(x^{2} + 1\\right)^{4} \\cdot 2x = 10x\\left(x^{2} + 1\\right)^{4}.$$",
        "**链式法则** 若 $y = f(g(x))$，则\n\n$$\\frac{dy}{dx} = f'(g(x)) \\cdot g'(x)$$\n\n即先对外层函数求导（内层函数保持不变），再乘以内层函数的导数。对幂函数，\n\n$$\\frac{d}{dx}\\left(x^{2} + 1\\right)^{5} = 5\\left(x^{2} + 1\\right)^{4} \\cdot 2x = 10x\\left(x^{2} + 1\\right)^{4}.$$",
      ),
      generate(rng) {
        const inner = rng.bool() ? linearInner(rng) : quadraticInner(rng);
        const n = rng.int(2, 7);
        const k = rng.pick([1, 1, 1, 2, 3, -1, -2]);
        const f = poly([k, `(${inner.g})^{${n}}`]);
        const answer = times(k * n, inner, `(${inner.g})${n === 2 ? "" : `^{${n - 1}}`}`);
        const lower = `(${inner.g})${n === 2 ? "" : `^{${n - 1}}`}`;
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [poly([k * n, lower]), times(k * n, inner, `(${inner.g})^{${n}}`), poly([k * n, `(${inner.dg})^{${n - 1}}`])],
          solution: t(
            `The outer function is $${poly([k, `u^{${n}}`])}$ with $u = ${inner.g}$, and $u' = ${inner.dg}$. So$$f'(x) = ${poly([k * n, lower])} \\cdot ${inner.coef !== undefined && inner.coef < 0 ? `(${inner.dg})` : inner.dg} = ${answer}.$$`,
            `外层函数为 $${poly([k, `u^{${n}}`])}$，其中 $u = ${inner.g}$，$u' = ${inner.dg}$。所以$$f'(x) = ${poly([k * n, lower])} \\cdot ${inner.coef !== undefined && inner.coef < 0 ? `(${inner.dg})` : inner.dg} = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "roots-and-reciprocals-of-inner-functions",
      title: t("Roots and reciprocals of inner functions", "内层函数的根式与倒数"),
      explanation: t(
        "Writing roots and reciprocals as powers lets you use the power rule together with the chain rule, multiplying by the derivative of the inside. Write roots and reciprocals as powers first: $\\sqrt{u} = u^{\\frac{1}{2}}$ and $\\frac{k}{u} = ku^{-1}$. Then\n\n$$\\frac{d}{dx}\\sqrt{u} = \\frac{u'}{2\\sqrt{u}}, \\qquad \\frac{d}{dx}\\frac{k}{u} = -\\frac{ku'}{u^{2}}.$$",
        "把根式和倒数写成幂的形式，就可以把幂法则与链式法则结合起来，再乘以内层函数的导数。先把根式和倒数写成幂：$\\sqrt{u} = u^{\\frac{1}{2}}$，$\\frac{k}{u} = ku^{-1}$。于是\n\n$$\\frac{d}{dx}\\sqrt{u} = \\frac{u'}{2\\sqrt{u}}, \\qquad \\frac{d}{dx}\\frac{k}{u} = -\\frac{ku'}{u^{2}}.$$",
      ),
      generate(rng) {
        const inner = rng.bool() ? linearInner(rng, true) : quadraticInner(rng, true);
        const root = rng.bool();
        const k = rng.pick([1, 2, 3, 4, 6, -1, -2]);
        if (root) {
          const f = poly([k, `\\sqrt{${inner.g}}`]);
          const top = inner.coef !== undefined ? String(k * inner.coef) : poly([k * splitMonomial(inner.dg)[0], "x"]);
          const answer = `\\frac{${top}}{2\\sqrt{${inner.g}}}`;
          return functionProblem({
            prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
            answer,
            prefix: "f'(x) =",
            wrong: [fracL(k, `2\\sqrt{${inner.g}}`), `\\frac{${top}}{\\sqrt{${inner.g}}}`, `${top === "1" ? "" : top}\\sqrt{${inner.g}}`],
            solution: t(
              `$f(x) = ${poly([k, `(${inner.g})^{\\frac{1}{2}}`])}$, so$$f'(x) = ${poly([Q.of(k, 2), `(${inner.g})^{-\\frac{1}{2}}`])} \\cdot ${inner.dg} = ${answer}.$$`,
              `$f(x) = ${poly([k, `(${inner.g})^{\\frac{1}{2}}`])}$，所以$$f'(x) = ${poly([Q.of(k, 2), `(${inner.g})^{-\\frac{1}{2}}`])} \\cdot ${inner.dg} = ${answer}.$$`,
            ),
          });
        }
        const f = `\\frac{${k}}{${inner.g}}`;
        const top = inner.coef !== undefined ? -k * inner.coef : -k * splitMonomial(inner.dg)[0];
        const v = inner.coef !== undefined ? "" : "x";
        const answer = `${top < 0 ? "-" : ""}\\frac{${Math.abs(top)}${v}}{(${inner.g})^{2}}`;
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [
            fracL(-k, `(${inner.g})^{2}`),
            `${top < 0 ? "" : "-"}\\frac{${Math.abs(top)}${v}}{(${inner.g})^{2}}`,
            `\\frac{${k}}{${inner.dg}}`,
          ],
          solution: t(
            `$f(x) = ${k}(${inner.g})^{-1}$, so$$f'(x) = ${-k}(${inner.g})^{-2} \\cdot ${inner.dg} = ${answer}.$$`,
            `$f(x) = ${k}(${inner.g})^{-1}$，所以$$f'(x) = ${-k}(${inner.g})^{-2} \\cdot ${inner.dg} = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "derivatives-of-composite-functions-at-a-point",
      title: t("Derivatives of composite functions at a point", "复合函数在某点处的导数"),
      explanation: t(
        "The chain rule works from the inside out: find where the inner function sends the point, then use the slopes of both functions at the right places. For $h(x) = f(g(x))$, $h'(a) = f'(g(a)) \\cdot g'(a)$: evaluate $g(a)$ first, then $f'$ at that value, then multiply by $g'(a)$.",
        "链式法则由内向外进行：先求内层函数把该点送到哪里，再在相应的位置用两个函数的斜率。对 $h(x) = f(g(x))$，$h'(a) = f'(g(a)) \\cdot g'(a)$：先求 $g(a)$，再求 $f'$ 在该值处的值，最后乘以 $g'(a)$。",
      ),
      generate(rng) {
        const f: Poly = [rng.int(-5, 5), rng.int(-4, 4), rng.nonZero(-3, 3)];
        const g: Poly = rng.bool() ? [rng.int(-4, 4), rng.nonZero(-3, 3)] : [rng.int(-4, 4), rng.int(-3, 3), rng.nonZero(-2, 2)];
        const a = rng.int(-2, 2);
        const ga = pAt(g, a);
        const dfga = pAt(pDer(f), ga);
        const dga = pAt(pDer(g), a);
        const answer = dfga * dga;
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(f)}$ and $g(x) = ${pLatex(g)}$, and let $h(x) = f(g(x))$. Find $h'(${a})$.`,
            `设 $f(x) = ${pLatex(f)}$，$g(x) = ${pLatex(g)}$，$h(x) = f(g(x))$。求 $h'(${a})$。`,
          ),
          answer,
          wrong: [dfga, pAt(pDer(f), a) * dga, pAt(pDer(f), dga)],
          solution: t(
            `$g(${a}) = ${ga}$, $g'(x) = ${pLatex(pDer(g))}$ and $f'(x) = ${pLatex(pDer(f))}$. So$$h'(${a}) = f'(${ga}) \\cdot g'(${a}) = ${par(dfga)} \\cdot ${par(dga)} = ${answer}.$$`,
            `$g(${a}) = ${ga}$，$g'(x) = ${pLatex(pDer(g))}$，$f'(x) = ${pLatex(pDer(f))}$。所以$$h'(${a}) = f'(${ga}) \\cdot g'(${a}) = ${par(dfga)} \\cdot ${par(dga)} = ${answer}.$$`,
          ),
        });
      },
    },
  ],
};

/** theChainRuleWithExponentialFunctions differentiates e^{g(x)} and b^{g(x)}. */
export const theChainRuleWithExponentialFunctions: TopicDef = {
  id: "the-chain-rule-with-exponential-functions",
  title: t("The Chain Rule With Exponential Functions", "指数函数的链式法则"),
  summary: t("Differentiate exponentials of inner functions.", "对以内层函数为指数的指数函数求导。"),
  prerequisites: ["the-chain-rule-for-differentiation"],
  encompasses: [
    { topic: "the-chain-rule-for-differentiation", weight: 0.4 },
    { topic: "differentiating-exponential-functions", weight: 0.4 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "e-to-an-inner-function",
      title: t("e to an inner function", "e 的内层函数次幂"),
      explanation: t(
        "The exponential function is its own derivative, so by the chain rule only the derivative of the exponent is added as a factor. $$\\frac{d}{dx} e^{g(x)} = g'(x)e^{g(x)}.$$\n\nThe exponent stays the same; multiply by its derivative. For example, $\\frac{d}{dx} e^{x^{2} - 3x} = (2x - 3)e^{x^{2} - 3x}$.",
        "指数函数的导数就是它自己，所以根据链式法则，只需多乘一个指数的导数。$$\\frac{d}{dx} e^{g(x)} = g'(x)e^{g(x)}.$$\n\n指数保持不变，再乘以指数的导数。例如 $\\frac{d}{dx} e^{x^{2} - 3x} = (2x - 3)e^{x^{2} - 3x}$。",
      ),
      generate(rng) {
        const linear = rng.bool();
        const g: Poly = linear ? [rng.int(-5, 5), rng.pick([2, 3, 4, 5, -1, -2, -3])] : [0, rng.int(-4, 4), rng.pick([1, 1, 2, -1])];
        const k = rng.pick([1, 1, 2, 3, -1, 4]);
        const e = `e^{${pLatex(g)}}`;
        const dg = pDer(g);
        const answer = linear ? poly([k * dg[0]!, e]) : k === 1 ? `(${pLatex(dg)})${e}` : `${k}(${pLatex(dg)})${e}`;
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${poly([k, e])}$.`, `设 $f(x) = ${poly([k, e])}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [
            poly([k, e]),
            linear ? poly([k * dg[0]!, `e^{${pLatex(dg)}}`]) : `${k === 1 ? "" : k}(${pLatex(g)})e^{${pLatex(dg)}}`,
            poly([k, `(${pLatex(g)})e^{${pLatex([g[0]! - 1, ...g.slice(1)])}}`]),
          ],
          solution: t(
            `The exponent $${pLatex(g)}$ has derivative $${pLatex(dg)}$, so $f'(x) = ${answer}$.`,
            `指数 $${pLatex(g)}$ 的导数为 $${pLatex(dg)}$，所以 $f'(x) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "other-bases-to-an-inner-function",
      title: t("Other bases to an inner function", "其他底数的内层函数次幂"),
      explanation: t(
        "Any base can be written as $e$ raised to its natural logarithm, which is why the derivative of a power of another base carries that extra logarithm factor. $$\\frac{d}{dx} b^{g(x)} = g'(x)\\,b^{g(x)}\\ln b.$$\n\nFor example, $\\frac{d}{dx} 2^{3x} = 3 \\cdot 2^{3x}\\ln 2$.",
        "任何底数都可以写成 $e$ 的其自然对数次幂，所以其他底数的指数函数的导数会多一个对数因子。$$\\frac{d}{dx} b^{g(x)} = g'(x)\\,b^{g(x)}\\ln b.$$\n\n例如 $\\frac{d}{dx} 2^{3x} = 3 \\cdot 2^{3x}\\ln 2$。",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 5, 10]);
        const a = rng.pick([2, 3, 4, 5, -1, -2]);
        const c = rng.int(-4, 4);
        const g = poly([a, "x"], [c, ""]);
        const answer = cdot(a, `${b}^{${g}}\\ln ${b}`);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${b}^{${g}}$.`, `设 $f(x) = ${b}^{${g}}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [`${b}^{${g}}\\ln ${b}`, cdot(a, `${b}^{${g}}`), `(${g}) \\cdot ${b}^{${poly([a, "x"], [c - 1, ""])}}`],
          solution: t(
            `With $g(x) = ${g}$ and $g'(x) = ${a}$, $f'(x) = ${answer}$.`,
            `取 $g(x) = ${g}$，$g'(x) = ${a}$，得 $f'(x) = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** theChainRuleWithLogarithmicFunctions differentiates ln(g(x)). */
export const theChainRuleWithLogarithmicFunctions: TopicDef = {
  id: "the-chain-rule-with-logarithmic-functions",
  title: t("The Chain Rule With Logarithmic Functions", "对数函数的链式法则"),
  summary: t("Differentiate logarithms of inner functions.", "对内层函数的对数求导。"),
  prerequisites: ["the-chain-rule-for-differentiation"],
  encompasses: [
    { topic: "the-chain-rule-for-differentiation", weight: 0.4 },
    { topic: "differentiating-logarithmic-functions", weight: 0.4 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "ln-of-an-inner-function",
      title: t("ln of an inner function", "内层函数的自然对数"),
      explanation: t(
        "The derivative of the natural logarithm of a function is the derivative of the function divided by the function itself. $$\\frac{d}{dx} \\ln g(x) = \\frac{g'(x)}{g(x)}.$$\n\nFor example, $\\frac{d}{dx} \\ln\\left(x^{2} + 4\\right) = \\frac{2x}{x^{2} + 4}$.",
        "函数的自然对数的导数，等于这个函数的导数除以函数本身。$$\\frac{d}{dx} \\ln g(x) = \\frac{g'(x)}{g(x)}.$$\n\n例如 $\\frac{d}{dx} \\ln\\left(x^{2} + 4\\right) = \\frac{2x}{x^{2} + 4}$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const g: Poly =
          kind === 0
            ? [rng.int(1, 9), rng.int(2, 6)]
            : kind === 1
              ? [rng.int(1, 9), 0, rng.pick([1, 1, 2, 3])]
              : [rng.int(1, 6), rng.int(1, 4), 0, 1];
        const k = rng.pick([1, 1, 2, 3, -1]);
        const dg = pDer(g);
        const top = pLatex(dg.map((c) => c * Math.abs(k)));
        const answer = `${k < 0 ? "-" : ""}\\frac{${top}}{${pLatex(g)}}`;
        const scale = k === 1 ? "" : k === -1 ? "-" : `${k} \\cdot `;
        return functionProblem({
          prompt: t(
            `Find $f'(x)$ for $f(x) = ${poly([k, `\\ln\\left(${pLatex(g)}\\right)`])}$, where $x > 0$.`,
            `设 $f(x) = ${poly([k, `\\ln\\left(${pLatex(g)}\\right)`])}$，其中 $x > 0$。求 $f'(x)$。`,
          ),
          answer,
          prefix: "f'(x) =",
          positive: true,
          wrong: [fracL(k, pLatex(g)), `\\frac{${k}}{${pLatex(dg)}}`, poly([k, `\\frac{1}{${pLatex(dg)}}`])],
          solution: t(
            `With $g(x) = ${pLatex(g)}$, $g'(x) = ${pLatex(dg)}$, so$$f'(x) = ${scale}\\frac{${pLatex(dg)}}{${pLatex(g)}} = ${answer}.$$`,
            `取 $g(x) = ${pLatex(g)}$，$g'(x) = ${pLatex(dg)}$，所以$$f'(x) = ${scale}\\frac{${pLatex(dg)}}{${pLatex(g)}} = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "logarithms-of-powers-and-products",
      title: t("Logarithms of powers and products", "幂与乘积的对数"),
      explanation: t(
        "Using the laws of logarithms to break apart powers and products first leaves simpler pieces that are much easier to differentiate. Simplify with the laws of logarithms before differentiating:\n\n$$\\frac{d}{dx} \\ln\\left((2x + 1)^{3}\\right) = \\frac{d}{dx} 3\\ln(2x + 1) = \\frac{6}{2x + 1}.$$",
        "先用对数运算法则把幂和积拆开，得到的部分要简单得多，也更容易求导。求导前先用对数运算法则化简：\n\n$$\\frac{d}{dx} \\ln\\left((2x + 1)^{3}\\right) = \\frac{d}{dx} 3\\ln(2x + 1) = \\frac{6}{2x + 1}.$$",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const b = rng.int(1, 9);
        const n = rng.int(2, 6);
        const g = poly([a, "x"], [b, ""]);
        const product = rng.bool();
        const f = product ? `\\ln\\left(x^{${n}}(${g})\\right)` : `\\ln\\left((${g})^{${n}}\\right)`;
        const answer = product ? `\\frac{${n}}{x} + \\frac{${a}}{${g}}` : `\\frac{${n * a}}{${g}}`;
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$, where $x > 0$.`, `设 $f(x) = ${f}$，其中 $x > 0$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          positive: true,
          wrong: product
            ? [`\\frac{${n}}{x} \\cdot \\frac{${a}}{${g}}`, `\\frac{${n}}{x} + \\frac{1}{${g}}`, `\\frac{1}{x^{${n}}(${g})}`]
            : [`\\frac{${n}}{${g}}`, `\\frac{${a}}{${g}}`, `\\frac{${n * a}(${g})^{${n - 1}}}{${g}}`],
          solution: product
            ? t(`$f(x) = ${n}\\ln x + \\ln(${g})$, so $f'(x) = ${answer}$.`, `$f(x) = ${n}\\ln x + \\ln(${g})$，所以 $f'(x) = ${answer}$。`)
            : t(
                `$f(x) = ${n}\\ln(${g})$, so $f'(x) = ${n} \\cdot \\frac{${a}}{${g}} = ${answer}$.`,
                `$f(x) = ${n}\\ln(${g})$，所以 $f'(x) = ${n} \\cdot \\frac{${a}}{${g}} = ${answer}$。`,
              ),
        });
      },
    },
  ],
};

/** TrigOuter is a trigonometric function with its derivative, as a coefficient sign and a function name. */
interface TrigOuter {
  readonly f: string;
  readonly d: readonly [number, string];
}

/** trigOuters are sin, cos and tan as outer functions. */
const trigOuters: readonly TrigOuter[] = [
  { f: "\\sin", d: [1, "\\cos"] },
  { f: "\\cos", d: [-1, "\\sin"] },
  { f: "\\tan", d: [1, "\\sec^{2}"] },
];

/** theChainRuleWithTrigonometricFunctions differentiates trigonometric functions of inner functions. */
export const theChainRuleWithTrigonometricFunctions: TopicDef = {
  id: "the-chain-rule-with-trigonometric-functions",
  title: t("The Chain Rule With Trigonometric Functions", "三角函数的链式法则"),
  summary: t(
    "Differentiate trigonometric functions of inner functions and powers of trigonometric functions.",
    "对内层函数的三角函数以及三角函数的幂求导。",
  ),
  prerequisites: ["the-chain-rule-for-differentiation", "differentiating-reciprocal-trigonometric-functions"],
  encompasses: [
    { topic: "the-chain-rule-for-differentiation", weight: 0.4 },
    { topic: "differentiating-trigonometric-functions", weight: 0.4 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "trigonometric-functions-of-inner-functions",
      title: t("Trigonometric functions of inner functions", "内层函数的三角函数"),
      explanation: t(
        "Differentiate the outer trigonometric function as usual, keeping the inner function unchanged inside it, then multiply by the derivative of the inner function. $$\\frac{d}{dx} \\sin g(x) = g'(x)\\cos g(x), \\quad \\frac{d}{dx} \\cos g(x) = -g'(x)\\sin g(x), \\quad \\frac{d}{dx} \\tan g(x) = g'(x)\\sec^{2} g(x).$$\n\nFor example, $\\frac{d}{dx} \\cos\\left(x^{2}\\right) = -2x\\sin\\left(x^{2}\\right)$.",
        "像平常一样对外层三角函数求导，里面的内层函数保持不变，再乘以内层函数的导数。$$\\frac{d}{dx} \\sin g(x) = g'(x)\\cos g(x), \\quad \\frac{d}{dx} \\cos g(x) = -g'(x)\\sin g(x), \\quad \\frac{d}{dx} \\tan g(x) = g'(x)\\sec^{2} g(x).$$\n\n例如 $\\frac{d}{dx} \\cos\\left(x^{2}\\right) = -2x\\sin\\left(x^{2}\\right)$。",
      ),
      generate(rng) {
        const o = rng.pick(trigOuters);
        const inner = rng.bool() ? linearInner(rng) : quadraticInner(rng);
        const k = rng.pick([1, 1, 2, 3, -1, -2, 5]);
        const f = poly([k, `${o.f}(${inner.g})`]);
        const answer = times(k * o.d[0], inner, `${o.d[1]}(${inner.g})`);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [
            poly([k * o.d[0], `${o.d[1]}(${inner.g})`]),
            times(-k * o.d[0], inner, `${o.d[1]}(${inner.g})`),
            poly([k * o.d[0], `${o.d[1]}(${inner.dg})`]),
          ],
          solution: t(
            `The inner function $${inner.g}$ has derivative $${inner.dg}$, and $\\frac{d}{du} ${o.f} u = ${poly([o.d[0], `${o.d[1]} u`])}$. So $f'(x) = ${answer}$.`,
            `内层函数 $${inner.g}$ 的导数为 $${inner.dg}$，且 $\\frac{d}{du} ${o.f} u = ${poly([o.d[0], `${o.d[1]} u`])}$。所以 $f'(x) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "powers-of-trigonometric-functions",
      title: t("Powers of trigonometric functions", "三角函数的幂"),
      explanation: t(
        "A power of a trigonometric function has the power on the outside, so use the power rule first and then multiply by the derivative of the trigonometric function. $\\sin^{n}x$ means $(\\sin x)^{n}$: the outer function is the power. So\n\n$$\\frac{d}{dx} \\sin^{3}x = 3\\sin^{2}x\\cos x, \\qquad \\frac{d}{dx} \\cos^{4}x = -4\\cos^{3}x\\sin x.$$",
        "三角函数的幂中，幂在外层，所以先用幂法则，再乘以三角函数的导数。$\\sin^{n}x$ 表示 $(\\sin x)^{n}$：外层函数是幂函数。所以\n\n$$\\frac{d}{dx} \\sin^{3}x = 3\\sin^{2}x\\cos x, \\qquad \\frac{d}{dx} \\cos^{4}x = -4\\cos^{3}x\\sin x.$$",
      ),
      generate(rng) {
        const o = rng.pick(trigOuters);
        const n = rng.int(2, 6);
        const k = rng.pick([1, 1, 2, 3, -1, -2]);
        const pow = (m: number) => (m === 1 ? `${o.f} x` : `${o.f}^{${m}}x`);
        const dPart = o.f === "\\tan" ? "\\sec^{2}x" : `${o.d[1]} x`;
        const answer = poly([k * n * o.d[0], `${pow(n - 1)}${dPart}`]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${poly([k, pow(n)])}$.`, `设 $f(x) = ${poly([k, pow(n)])}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [
            poly([k * n, pow(n - 1)]),
            poly([k * n * o.d[0], `${o.d[1]}^{${n - 1}}x`]),
            poly([-k * n * o.d[0], `${pow(n - 1)}${dPart}`]),
          ],
          solution: t(
            `$f(x) = ${poly([k, `(${o.f} x)^{${n}}`])}$; the outer function is a power and the inner function is $${o.f} x$, so$$f'(x) = ${poly([k * n, `(${o.f} x)^{${n - 1}}`])} \\cdot ${poly([o.d[0], dPart])} = ${answer}.$$`,
            `$f(x) = ${poly([k, `(${o.f} x)^{${n}}`])}$；外层函数是幂函数，内层函数是 $${o.f} x$，所以$$f'(x) = ${poly([k * n, `(${o.f} x)^{${n - 1}}`])} \\cdot ${poly([o.d[0], dPart])} = ${answer}.$$`,
          ),
        });
      },
    },
  ],
};

/** calculatingDerivativesFromDataUsingTheChainRule uses tables with the chain rule. */
export const calculatingDerivativesFromDataUsingTheChainRule: TopicDef = {
  id: "calculating-derivatives-from-data-using-the-chain-rule",
  title: t("Calculating Derivatives From Data Using the Chain Rule", "用链式法则由数据计算导数"),
  summary: t(
    "Use tables of function and derivative values to differentiate compositions and powers.",
    "利用函数值和导数值的表格对复合函数和幂求导。",
  ),
  prerequisites: ["the-chain-rule-for-differentiation", "calculating-derivatives-from-data-and-tables"],
  encompasses: [
    { topic: "the-chain-rule-for-differentiation", weight: 0.3 },
    { topic: "calculating-derivatives-from-data-and-tables", weight: 0.4 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "compositions-from-a-table",
      title: t("Compositions from a table", "由表格求复合函数的导数"),
      explanation: t(
        "For $h(x) = f(g(x))$, $h'(a) = f'(g(a))\\,g'(a)$. Read $g(a)$ from the table, then look up $f'$ at that value, which is usually in a different row.",
        "对 $h(x) = f(g(x))$，$h'(a) = f'(g(a))\\,g'(a)$。先从表中读出 $g(a)$，再查 $f'$ 在该值处的值，它通常在另一行。",
      ),
      generate(rng) {
        const xs = [1, 2, 3, 4];
        const rows = xs.map(() => [rng.int(1, 4), rng.nonZero(-5, 5), rng.int(1, 4), rng.nonZero(-5, 5)] as const);
        const i = rng.int(0, 3);
        const a = xs[i]!;
        const fOfG = rng.bool();
        const [inner, dInner] = fOfG ? [rows[i]![2], rows[i]![3]] : [rows[i]![0], rows[i]![1]];
        const dOuter = fOfG ? rows[inner - 1]![1] : rows[inner - 1]![3];
        const answer = dOuter * dInner;
        const [F, G] = fOfG ? ["f", "g"] : ["g", "f"];
        const sameRow = fOfG ? rows[i]![1] : rows[i]![3];
        const tab = table(
          ["$x$", "$f(x)$", "$f'(x)$", "$g(x)$", "$g'(x)$"],
          ...xs.map((x, j) => [`$${x}$`, ...rows[j]!.map((v) => `$${v}$`)]),
        );
        return numberProblem({
          prompt: t(
            `The table gives values of $f$, $g$ and their derivatives.\n\n${tab}\n\nLet $h(x) = ${F}(${G}(x))$. Find $h'(${a})$.`,
            `下表给出 $f$、$g$ 及其导数的值。\n\n${tab}\n\n设 $h(x) = ${F}(${G}(x))$。求 $h'(${a})$。`,
          ),
          answer,
          wrong: [sameRow * dInner, dOuter, dOuter * inner],
          solution: t(
            `$${G}(${a}) = ${inner}$ and $${G}'(${a}) = ${dInner}$, so$$h'(${a}) = ${F}'(${G}(${a})) \\cdot ${G}'(${a}) = ${F}'(${inner}) \\cdot ${par(dInner)} = ${par(dOuter)} \\cdot ${par(dInner)} = ${answer}.$$`,
            `$${G}(${a}) = ${inner}$，$${G}'(${a}) = ${dInner}$，所以$$h'(${a}) = ${F}'(${G}(${a})) \\cdot ${G}'(${a}) = ${F}'(${inner}) \\cdot ${par(dInner)} = ${par(dOuter)} \\cdot ${par(dInner)} = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "powers-and-roots-from-a-table",
      title: t("Powers and roots from a table", "由表格求幂与根式的导数"),
      explanation: t(
        "Use the chain rule at the point with the tabulated values, putting the value of the inner function into the derivative of the power or root. For $h(x) = [f(x)]^{n}$, $h'(a) = n[f(a)]^{n - 1}f'(a)$. For $h(x) = \\sqrt{f(x)}$, $h'(a) = \\frac{f'(a)}{2\\sqrt{f(a)}}$.",
        "在该点用表中的值套用链式法则，把内层函数的值代入幂或根式的导数中。对 $h(x) = [f(x)]^{n}$，$h'(a) = n[f(a)]^{n - 1}f'(a)$。对 $h(x) = \\sqrt{f(x)}$，$h'(a) = \\frac{f'(a)}{2\\sqrt{f(a)}}$。",
      ),
      generate(rng) {
        const xs = [0, 1, 2, 3];
        const root = rng.bool();
        const rows = xs.map(() => [root ? rng.pick([1, 4, 9, 16]) : rng.nonZero(-4, 4), rng.nonZero(-6, 6)] as const);
        const i = rng.int(0, 3);
        const a = xs[i]!;
        const [f, df] = rows[i]!;
        const n = rng.int(2, 4);
        const tab = table(
          ["$x$", ...xs.map((x) => `$${x}$`)],
          ["$f(x)$", ...rows.map((r) => `$${r[0]}$`)],
          ["$f'(x)$", ...rows.map((r) => `$${r[1]}$`)],
        );
        const h = root ? "\\sqrt{f(x)}" : `[f(x)]^{${n}}`;
        const answer = root ? Q.of(df, 2 * Math.sqrt(f)) : Q.of(n * f ** (n - 1) * df);
        const wrong = root
          ? [Q.of(df, 2), Q.of(df, Math.sqrt(f)), Q.of(1, 2 * Math.sqrt(f))]
          : [Q.of(n * f ** (n - 1)), Q.of(n * df ** (n - 1)), Q.of(f ** n)];
        return numberProblem({
          prompt: t(
            `The table gives values of $f$ and $f'$.\n\n${tab}\n\nLet $h(x) = ${h}$. Find $h'(${a})$.`,
            `下表给出 $f$ 和 $f'$ 的值。\n\n${tab}\n\n设 $h(x) = ${h}$。求 $h'(${a})$。`,
          ),
          answer,
          wrong,
          solution: root
            ? t(
                `$$h'(${a}) = \\frac{f'(${a})}{2\\sqrt{f(${a})}} = \\frac{${df}}{2\\sqrt{${f}}} = ${answer.toLatex()}.$$`,
                `$$h'(${a}) = \\frac{f'(${a})}{2\\sqrt{f(${a})}} = \\frac{${df}}{2\\sqrt{${f}}} = ${answer.toLatex()}.$$`,
              )
            : t(
                `$$h'(${a}) = ${n}[f(${a})]^{${n - 1}}f'(${a}) = ${n} \\cdot ${par(f)}^{${n - 1}} \\cdot ${par(df)} = ${answer.toLatex()}.$$`,
                `$$h'(${a}) = ${n}[f(${a})]^{${n - 1}}f'(${a}) = ${n} \\cdot ${par(f)}^{${n - 1}} \\cdot ${par(df)} = ${answer.toLatex()}.$$`,
              ),
        });
      },
    },
  ],
};

/** polyXs are the x-coordinates of a polyline's vertices. */
const polyXs = [-6, -4, -2, 0, 2, 4, 6];

/** polyline chooses a piecewise linear graph through integer points at x = −6, −4, …, 6. */
function polyline(rng: Rng): readonly number[] {
  const ys = [rng.int(-4, 4)];
  for (let i = 1; i < polyXs.length; i++) {
    let y = ys[i - 1]! + rng.pick([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
    if (y > 6 || y < -6) y = ys[i - 1]! - Math.sign(y) * 2;
    ys.push(y);
  }
  return ys;
}

/** polylineFigure draws a polyline. */
function polylineFigure(ys: readonly number[]): Figure {
  const marks: PlaneMark[] = ys.slice(1).map((y, i) => ({
    kind: "segment" as const,
    a: [polyXs[i]!, ys[i]!] as const,
    b: [polyXs[i + 1]!, y] as const,
    accent: true,
  }));
  return {
    svg: plane({ xMin: -7, xMax: 7, yMin: -7, yMax: 7 }, marks),
    alt: t(
      `A piecewise linear graph through ${ys.map((y, i) => `(${polyXs[i]}, ${y})`).join(", ")}.`,
      `经过 ${ys.map((y, i) => `(${polyXs[i]}, ${y})`).join("、")} 的折线图。`,
    ),
  };
}

/** polyAt is the value and slope of a polyline at an odd x, inside a segment. */
function polyAt(ys: readonly number[], x: number) {
  const i = (x + 6 - 1) / 2;
  return { value: Q.of(ys[i]! + ys[i + 1]!, 2), slope: Q.of(ys[i + 1]! - ys[i]!, 2) };
}

/** calculatingDerivativesFromGraphsUsingTheChainRule reads graphs with the chain rule. */
export const calculatingDerivativesFromGraphsUsingTheChainRule: TopicDef = {
  id: "calculating-derivatives-from-graphs-using-the-chain-rule",
  title: t("Calculating Derivatives From Graphs Using the Chain Rule", "用链式法则由图像计算导数"),
  summary: t(
    "Read values and slopes from a graph and combine them with the chain rule.",
    "从图像读出函数值和斜率，并结合链式法则计算导数。",
  ),
  prerequisites: ["calculating-derivatives-from-data-using-the-chain-rule", "calculating-derivatives-from-graphs"],
  encompasses: [
    { topic: "calculating-derivatives-from-data-using-the-chain-rule", weight: 0.4 },
    { topic: "calculating-derivatives-from-graphs", weight: 0.4 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "inner-linear-functions-from-a-graph",
      title: t("Inner linear functions from a graph", "由图像求内层为一次函数的导数"),
      explanation: t(
        "For $h(x) = f(kx + b)$, $h'(a) = k \\cdot f'(ka + b)$: find the input $ka + b$, read the slope of the graph of $f$ there, and multiply by $k$.",
        "对 $h(x) = f(kx + b)$，$h'(a) = k \\cdot f'(ka + b)$：先求出输入值 $ka + b$，读出 $f$ 的图像在该处的斜率，再乘以 $k$。",
      ),
      generate(rng) {
        const ys = polyline(rng);
        const k = rng.pick([2, 3, -1, -2, -3]);
        const u = rng.pick([-5, -3, -1, 1, 3, 5]);
        const a = rng.int(-3, 3);
        const b = u - k * a;
        const s = polyAt(ys, u);
        const answer = s.slope.mul(Q.of(k));
        const inner = poly([k, "x"], [b, ""]);
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ is made of line segments. Let $h(x) = f(${inner})$. Find $h'(${a})$.`,
              `$y = f(x)$ 的图像由若干线段组成。设 $h(x) = f(${inner})$。求 $h'(${a})$。`,
            ),
            answer,
            wrong: [s.slope, s.value.mul(Q.of(k)), polyAt(ys, a % 2 === 0 ? u : a).slope.mul(Q.of(k))].filter((w) => !w.eq(answer)),
            solution: t(
              `At $x = ${a}$ the input is $${inner.replace("x", `(${a})`)} = ${u}$, and the slope of the graph at $x = ${u}$ is $${s.slope.toLatex()}$. So $h'(${a}) = ${k} \\cdot f'(${u}) = ${answer.toLatex()}$.`,
              `在 $x = ${a}$ 处输入值为 $${inner.replace("x", `(${a})`)} = ${u}$，图像在 $x = ${u}$ 处的斜率为 $${s.slope.toLatex()}$。所以 $h'(${a}) = ${k} \\cdot f'(${u}) = ${answer.toLatex()}$。`,
            ),
          }),
          figure: polylineFigure(ys),
        };
      },
    },
    {
      id: "outer-functions-of-a-graphed-function",
      title: t("Outer functions of a graphed function", "以图中函数为内层的导数"),
      explanation: t(
        "When the graphed function is inside another function, the chain rule needs both its height and its slope at the point, both of which you read from the graph. When the graphed function is the inner one, read both $f(a)$ and $f'(a)$. For $h(x) = [f(x)]^{2}$, $h'(a) = 2f(a)f'(a)$; for $h(x) = e^{f(x)}$, $h'(a) = f'(a)e^{f(a)}$.",
        "当图像给出的函数位于另一个函数内部时，链式法则既要用到它在该点的高度，也要用到斜率，两者都从图像读出。当图中的函数是内层函数时，要读出 $f(a)$ 和 $f'(a)$。对 $h(x) = [f(x)]^{2}$，$h'(a) = 2f(a)f'(a)$；对 $h(x) = e^{f(x)}$，$h'(a) = f'(a)e^{f(a)}$。",
      ),
      generate(rng) {
        const ys = polyline(rng);
        const a = rng.pick([-5, -3, -1, 1, 3, 5]);
        const s = polyAt(ys, a);
        const n = rng.int(2, 3);
        const answer = Q.of(n)
          .mul(s.value.pow(n - 1))
          .mul(s.slope);
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ is made of line segments. Let $h(x) = [f(x)]^{${n}}$. Find $h'(${a})$.`,
              `$y = f(x)$ 的图像由若干线段组成。设 $h(x) = [f(x)]^{${n}}$。求 $h'(${a})$。`,
            ),
            answer,
            wrong: [Q.of(n).mul(s.slope.pow(n - 1)), Q.of(n).mul(s.value.pow(n - 1)), s.value.pow(n)].filter((w) => !w.eq(answer)),
            solution: t(
              `From the graph, $f(${a}) = ${s.value.toLatex()}$ and $f'(${a}) = ${s.slope.toLatex()}$. So$$h'(${a}) = ${n}[f(${a})]^{${n - 1}}f'(${a}) = ${n} \\cdot ${par(s.value)}^{${n - 1}} \\cdot ${par(s.slope)} = ${answer.toLatex()}.$$`,
              `由图像，$f(${a}) = ${s.value.toLatex()}$，$f'(${a}) = ${s.slope.toLatex()}$。所以$$h'(${a}) = ${n}[f(${a})]^{${n - 1}}f'(${a}) = ${n} \\cdot ${par(s.value)}^{${n - 1}} \\cdot ${par(s.slope)} = ${answer.toLatex()}.$$`,
            ),
          }),
          figure: polylineFigure(ys),
        };
      },
    },
  ],
};

/** Procedure is the rule to apply first. */
type Procedure = "product" | "quotient" | "chain" | "basic";

/** selectingProceduresForCalculatingDerivatives chooses and combines rules. */
export const selectingProceduresForCalculatingDerivatives: TopicDef = {
  id: "selecting-procedures-for-calculating-derivatives",
  title: t("Selecting Procedures for Calculating Derivatives", "选择求导方法"),
  summary: t(
    "Decide which differentiation rule an expression needs, and combine the product, quotient and chain rules.",
    "判断一个式子需要用哪条求导法则，并综合运用乘积、商和链式法则。",
  ),
  prerequisites: [
    "the-chain-rule-with-exponential-functions",
    "the-chain-rule-with-logarithmic-functions",
    "the-chain-rule-with-trigonometric-functions",
  ],
  encompasses: [
    { topic: "the-chain-rule-with-exponential-functions", weight: 0.2 },
    { topic: "the-chain-rule-with-trigonometric-functions", weight: 0.2 },
    { topic: "the-product-rule-for-differentiation", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "identifying-the-outermost-operation",
      title: t("Identifying the outermost operation", "识别最外层的运算"),
      explanation: t(
        "The rule to use first is set by the **last** operation you would do to evaluate the expression:\n\n- a product of two functions of $x$: the product rule, as in $x^{2}\\sin x$;\n- a quotient of two functions of $x$: the quotient rule, as in $\\frac{e^{x}}{x}$;\n- a function applied to an inner function: the chain rule, as in $\\sin\\left(x^{2}\\right)$;\n- a constant times a basic function: the constant multiple rule only, as in $5e^{x}$.",
        "首先使用的法则由求值时**最后**进行的运算决定：\n\n- 两个关于 $x$ 的函数之积：乘积法则，如 $x^{2}\\sin x$；\n- 两个关于 $x$ 的函数之商：商法则，如 $\\frac{e^{x}}{x}$；\n- 函数作用于内层函数：链式法则，如 $\\sin\\left(x^{2}\\right)$；\n- 常数乘以基本函数：只需常数倍法则，如 $5e^{x}$。",
      ),
      generate(rng) {
        const fs = ["\\sin x", "\\cos x", "e^{x}", "\\ln x", "\\tan x"];
        const [u, v] = rng.sample(fs, 2) as [string, string];
        const n = rng.int(2, 5);
        const kind = rng.pick<Procedure>(["product", "quotient", "chain", "basic"]);
        const strip = (f: string) => f.replace(" x", "").replace("^{x}", "");
        const expr =
          kind === "product"
            ? `x^{${n}}${u}`
            : kind === "quotient"
              ? `\\frac{${u}}{${rng.bool() ? `x^{${n}}` : v}}`
              : kind === "chain"
                ? u === "e^{x}"
                  ? `e^{x^{${n}}}`
                  : `${strip(u)}\\left(x^{${n}}\\right)`
                : `${n}${u}`;
        const options = [
          t("The product rule", "乘积法则"),
          t("The quotient rule", "商法则"),
          t("The chain rule", "链式法则"),
          t("Only the constant multiple rule", "只需常数倍法则"),
        ];
        const index = ["product", "quotient", "chain", "basic"].indexOf(kind);
        const why: Record<Procedure, ReturnType<typeof t>> = {
          product: t(`$${expr}$ is a product of $x^{${n}}$ and $${u}$.`, `$${expr}$ 是 $x^{${n}}$ 与 $${u}$ 之积。`),
          quotient: t(`$${expr}$ is a quotient of two functions of $x$.`, `$${expr}$ 是两个关于 $x$ 的函数之商。`),
          chain: t(`$${expr}$ applies a function to the inner function $x^{${n}}$.`, `$${expr}$ 是把一个函数作用于内层函数 $x^{${n}}$。`),
          basic: t(`$${expr}$ is a constant times $${u}$.`, `$${expr}$ 是常数乘以 $${u}$。`),
        };
        return choiceProblem({
          prompt: t(`Which rule is needed first to differentiate $${expr}$?`, `对 $${expr}$ 求导时，首先需要哪条法则？`),
          options,
          correct: index,
          solution: why[kind],
        });
      },
    },
    {
      id: "combining-the-product-and-chain-rules",
      title: t("Combining the product and chain rules", "综合运用乘积法则与链式法则"),
      explanation: t(
        "Apply the outer rule first, using the chain rule for each factor that needs it:\n\n$$\\frac{d}{dx}\\left(x^{2}e^{3x}\\right) = 2xe^{3x} + x^{2} \\cdot 3e^{3x}.$$",
        "先用最外层的法则，再对需要的因式使用链式法则：\n\n$$\\frac{d}{dx}\\left(x^{2}e^{3x}\\right) = 2xe^{3x} + x^{2} \\cdot 3e^{3x}.$$",
      ),
      generate(rng) {
        const n = rng.int(1, 4);
        const k = rng.pick([2, 3, 4, 5, -1, -2, -3]);
        const kind = rng.int(0, 2);
        const kx = poly([k, "x"]);
        const [g, dg] =
          kind === 0
            ? [`e^{${kx}}`, [k, `e^{${kx}}`] as const]
            : kind === 1
              ? [`\\sin(${kx})`, [k, `\\cos(${kx})`] as const]
              : [`\\cos(${kx})`, [-k, `\\sin(${kx})`] as const];
        const f = `${power(n)}${g}`;
        const first = poly([n, `${power(n - 1)}${g}`]);
        const second = poly([dg[0], `${power(n)}${dg[1]}`]);
        const answer = sumLatex([first, second]);
        const flip = (x: string) => (x.startsWith("-") ? x.slice(1) : `-${x}`);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [
            sumLatex([first, poly([dg[0] / k, `${power(n)}${dg[1]}`])]),
            poly([n * dg[0], `${power(n - 1)}${dg[1]}`]),
            sumLatex([first, flip(second)]),
          ],
          solution: t(
            `By the product rule with $u = ${power(n)}$ and $v = ${g}$, where $v' = ${poly(dg)}$ by the chain rule:$$f'(x) = ${answer}.$$`,
            `用乘积法则，取 $u = ${power(n)}$，$v = ${g}$，由链式法则 $v' = ${poly(dg)}$：$$f'(x) = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "choosing-the-correct-derivative",
      title: t("Choosing the correct derivative", "选出正确的导数"),
      explanation: t(
        "Common mistakes are forgetting the inner derivative, multiplying derivatives instead of using the product rule, and reversing the order in the quotient rule. Check each step against the rule it uses.",
        "常见错误有：漏乘内层函数的导数、把导数直接相乘而不用乘积法则、商法则分子顺序颠倒。逐步对照所用的法则检查。",
      ),
      generate(rng) {
        const k = rng.pick([2, 3, 4, 5, 6]);
        const n = rng.int(2, 5);
        const c = rng.int(1, 6);
        const f = `\\left(x^{${n}} + ${c}\\right)e^{${k}x}`;
        const correct = `$${poly([n, power(n - 1)])}e^{${k}x} + ${k}\\left(x^{${n}} + ${c}\\right)e^{${k}x}$`;
        const wrong = [
          `$${poly([n, power(n - 1)])}e^{${k}x} + \\left(x^{${n}} + ${c}\\right)e^{${k}x}$`,
          `$${poly([n * k, power(n - 1)])}e^{${k}x}$`,
          `$${poly([n, power(n - 1)])}e^{${k}x} - ${k}\\left(x^{${n}} + ${c}\\right)e^{${k}x}$`,
        ];
        return oneOf(
          rng,
          t(`Which is the derivative of $${f}$?`, `$${f}$ 的导数是哪一个？`),
          same(correct),
          wrong.map(same),
          t(
            `By the product rule, with $\\frac{d}{dx} e^{${k}x} = ${k}e^{${k}x}$ from the chain rule, the derivative is ${correct}.`,
            `由乘积法则，并由链式法则得 $\\frac{d}{dx} e^{${k}x} = ${k}e^{${k}x}$，导数为 ${correct}。`,
          ),
        );
      },
    },
  ],
};

/** calculusIChainRuleTopics are the topics of Calculus I module 5.11. */
export const calculusIChainRuleTopics: readonly TopicDef[] = [
  theChainRuleForDifferentiation,
  theChainRuleWithExponentialFunctions,
  theChainRuleWithLogarithmicFunctions,
  theChainRuleWithTrigonometricFunctions,
  calculatingDerivativesFromDataUsingTheChainRule,
  calculatingDerivativesFromGraphsUsingTheChainRule,
  selectingProceduresForCalculatingDerivatives,
];
