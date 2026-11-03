import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type PlaneMark, plane, poly, Q } from "@ga/subject-math";

import { functionProblem, numberProblem } from "../problems.ts";
import { cdot, fracL, lim, oneOf, type Poly, pAt, par, pDer, pLatex, power, range, sumLatex, table } from "./calculus-common.ts";

// Calculus I unit 4: Introduction to Differentiation, module 4.10.

/** Rule is a function with its derivative, as coefficient and LaTeX, and a typical wrong derivative. */
interface Rule {
  readonly f: string;
  readonly d: readonly [number, string];
  readonly bad: readonly [number, string];
}

/** applyRules differentiates a sum of k·f terms. */
function applyRules(terms: readonly (readonly [number, Rule])[]) {
  return {
    f: poly(...terms.map(([k, r]) => [k, r.f] as const)),
    d: poly(...terms.map(([k, r]) => [k * r.d[0], r.d[1]] as const)),
    bad: poly(...terms.map(([k, r]) => [k * r.bad[0], r.bad[1]] as const)),
  };
}

/** differentiatingExponentialFunctions differentiates e^x and b^x. */
export const differentiatingExponentialFunctions: TopicDef = {
  id: "differentiating-exponential-functions",
  title: t("Differentiating Exponential Functions", "指数函数求导"),
  summary: t("Differentiate $e^x$ and exponential functions with other bases.", "对 $e^x$ 以及其他底数的指数函数求导。"),
  prerequisites: ["the-sum-and-constant-multiple-rules-for-differentiation", "limits-involving-the-exponential-function"],
  encompasses: [
    { topic: "the-sum-and-constant-multiple-rules-for-differentiation", weight: 0.4 },
    { topic: "limits-involving-the-exponential-function", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-derivative-of-e-to-the-x",
      title: t("The derivative of e^x", "e^x 的导数"),
      explanation: t(
        "The exponential function is its own derivative:\n\n$$\\frac{d}{dx} e^{x} = e^{x}.$$\n\nThis follows from the definition, since $\\frac{e^{x + h} - e^{x}}{h} = e^{x} \\cdot \\frac{e^{h} - 1}{h}$ and $\\lim_{h \\to 0} \\frac{e^{h} - 1}{h} = 1$. With the sum and constant multiple rules, $\\frac{d}{dx}\\left(4e^{x} - x^{3}\\right) = 4e^{x} - 3x^{2}$. Note that $e^{x}$ is not a power of $x$: the power rule does not apply.",
        "指数函数的导数就是它自身：\n\n$$\\frac{d}{dx} e^{x} = e^{x}.$$\n\n这由定义得到：$\\frac{e^{x + h} - e^{x}}{h} = e^{x} \\cdot \\frac{e^{h} - 1}{h}$，且 $\\lim_{h \\to 0} \\frac{e^{h} - 1}{h} = 1$。结合和法则与常数倍法则，$\\frac{d}{dx}\\left(4e^{x} - x^{3}\\right) = 4e^{x} - 3x^{2}$。注意 $e^{x}$ 不是 $x$ 的幂，不能用幂法则。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const k = rng.nonZero(-5, 5);
        const n = rng.int(2, 5);
        const c = rng.int(-9, 9);
        const f = poly([a, "e^{x}"], [k, power(n)], [c, ""]);
        const answer = poly([a, "e^{x}"], [k * n, power(n - 1)]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [
            poly([a, "xe^{x - 1}"], [k * n, power(n - 1)]),
            poly([a, "e^{x}"], [k * n, power(n - 1)], [c, ""]),
            poly([k * n, power(n - 1)]),
          ],
          solution: t(
            `$\\frac{d}{dx} e^{x} = e^{x}$ and $\\frac{d}{dx} ${power(n)} = ${n}${power(n - 1)}$, so$$f'(x) = ${answer}.$$`,
            `$\\frac{d}{dx} e^{x} = e^{x}$，$\\frac{d}{dx} ${power(n)} = ${n}${power(n - 1)}$，所以$$f'(x) = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "the-derivative-of-b-to-the-x",
      title: t("The derivative of b^x", "b^x 的导数"),
      explanation: t(
        "For a base $b > 0$, write $b^{x} = e^{x\\ln b}$; its derivative is\n\n$$\\frac{d}{dx} b^{x} = b^{x}\\ln b.$$\n\nFor $b = e$, $\\ln e = 1$ and this is the rule for $e^{x}$. For example, $\\frac{d}{dx} 5 \\cdot 2^{x} = 5 \\cdot 2^{x}\\ln 2$.",
        "对底数 $b > 0$，有 $b^{x} = e^{x\\ln b}$，其导数为\n\n$$\\frac{d}{dx} b^{x} = b^{x}\\ln b.$$\n\n当 $b = e$ 时 $\\ln e = 1$，就是 $e^{x}$ 的求导法则。例如 $\\frac{d}{dx} 5 \\cdot 2^{x} = 5 \\cdot 2^{x}\\ln 2$。",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 4, 5, 7, 10]);
        const k = rng.pick([1, 1, 2, 3, 4, -1, -2, -3]);
        const a = rng.int(-4, 4);
        const f = sumLatex([cdot(k, `${b}^{x}`), poly([a, "e^{x}"])]);
        const answer = sumLatex([cdot(k, `${b}^{x}\\ln ${b}`), poly([a, "e^{x}"])]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [
            sumLatex([cdot(k, `${b}^{x}`), poly([a, "e^{x}"])]),
            sumLatex([`${k < 0 ? "-" : ""}\\frac{${cdot(Math.abs(k), `${b}^{x}`)}}{\\ln ${b}}`, poly([a, "e^{x}"])]),
            sumLatex([cdot(k, `x \\cdot ${b}^{x - 1}`), poly([a, "e^{x}"])]),
          ],
          solution: t(
            `$\\frac{d}{dx} ${b}^{x} = ${b}^{x}\\ln ${b}$${a === 0 ? "" : " and $\\frac{d}{dx} e^{x} = e^{x}$"}, so$$f'(x) = ${answer}.$$`,
            `$\\frac{d}{dx} ${b}^{x} = ${b}^{x}\\ln ${b}$${a === 0 ? "" : "，$\\frac{d}{dx} e^{x} = e^{x}$"}，所以$$f'(x) = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "slopes-of-exponential-curves",
      title: t("Slopes of exponential curves", "指数曲线的斜率"),
      explanation: t(
        "Since $e^{0} = 1$, the curve $y = e^{x}$ has slope $1$ where it crosses the $y$-axis. To find a slope, differentiate and substitute.",
        "因为 $e^{0} = 1$，曲线 $y = e^{x}$ 在与 $y$ 轴的交点处斜率为 $1$。求斜率时，先求导再代入。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const p: Poly = [rng.int(-5, 5), rng.int(-6, 6), rng.int(-3, 3)];
        const d = pDer(p);
        const answer = a + pAt(d, 0);
        const f = sumLatex([poly([a, "e^{x}"]), pLatex(p)]);
        return numberProblem({
          prompt: t(`Find the slope of the tangent line to $y = ${f}$ at $x = 0$.`, `求曲线 $y = ${f}$ 在 $x = 0$ 处的切线斜率。`),
          answer,
          wrong: [pAt(d, 0), a + p[0]!, a],
          solution: t(
            `$y' = ${sumLatex([poly([a, "e^{x}"]), pLatex(d)])}$, so at $x = 0$ the slope is $${a} \\cdot e^{0} ${pAt(d, 0) < 0 ? "-" : "+"} ${Math.abs(pAt(d, 0))} = ${answer}$.`,
            `$y' = ${sumLatex([poly([a, "e^{x}"]), pLatex(d)])}$，所以 $x = 0$ 处的斜率为 $${a} \\cdot e^{0} ${pAt(d, 0) < 0 ? "-" : "+"} ${Math.abs(pAt(d, 0))} = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** differentiatingLogarithmicFunctions differentiates ln x and log_b x. */
export const differentiatingLogarithmicFunctions: TopicDef = {
  id: "differentiating-logarithmic-functions",
  title: t("Differentiating Logarithmic Functions", "对数函数求导"),
  summary: t(
    "Differentiate ln x and logarithms to other bases, simplifying with the laws of logarithms first.",
    "对 ln x 和其他底数的对数求导，必要时先用对数运算法则化简。",
  ),
  prerequisites: ["differentiating-exponential-functions"],
  encompasses: [
    { topic: "differentiating-exponential-functions", weight: 0.2 },
    { topic: "change-of-base-formula", weight: 0.2 },
    { topic: "combining-laws-of-logarithms", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "the-derivative-of-ln-x",
      title: t("The derivative of ln x", "ln x 的导数"),
      explanation: t(
        "For $x > 0$,\n\n$$\\frac{d}{dx} \\ln x = \\frac{1}{x}.$$\n\nSo $\\frac{d}{dx}\\left(3\\ln x + x^{2}\\right) = \\frac{3}{x} + 2x$.",
        "当 $x > 0$ 时，\n\n$$\\frac{d}{dx} \\ln x = \\frac{1}{x}.$$\n\n所以 $\\frac{d}{dx}\\left(3\\ln x + x^{2}\\right) = \\frac{3}{x} + 2x$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-7, 7);
        const k = rng.int(-4, 4);
        const n = rng.int(2, 4);
        const f = sumLatex([poly([a, "\\ln x"]), poly([k, power(n)])]);
        const kn = poly([k * n, power(n - 1)]);
        const answer = sumLatex([fracL(a, "x"), kn]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$, where $x > 0$.`, `设 $f(x) = ${f}$，其中 $x > 0$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          positive: true,
          wrong: [sumLatex([fracL(a, "x^{2}"), kn]), sumLatex([poly([a, "x"]), kn]), sumLatex([poly([a, "\\ln x"]), kn])],
          solution: t(
            `$\\frac{d}{dx} \\ln x = \\frac{1}{x}$, so$$f'(x) = ${answer}.$$`,
            `$\\frac{d}{dx} \\ln x = \\frac{1}{x}$，所以$$f'(x) = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "the-derivative-of-log-base-b-of-x",
      title: t("The derivative of a logarithm to base b", "以 b 为底的对数的导数"),
      explanation: t(
        "By the change of base formula, $\\log_{b} x = \\frac{\\ln x}{\\ln b}$, and $\\ln b$ is a constant. So\n\n$$\\frac{d}{dx} \\log_{b} x = \\frac{1}{x\\ln b}.$$",
        "由换底公式，$\\log_{b} x = \\frac{\\ln x}{\\ln b}$，而 $\\ln b$ 是常数。所以\n\n$$\\frac{d}{dx} \\log_{b} x = \\frac{1}{x\\ln b}.$$",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 4, 5, 7, 10]);
        const k = rng.pick([1, 1, 2, 3, 5, -1, -2, -4]);
        const f = poly([k, `\\log_{${b}} x`]);
        const answer = fracL(k, `x\\ln ${b}`);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$, where $x > 0$.`, `设 $f(x) = ${f}$，其中 $x > 0$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          positive: true,
          wrong: [fracL(k, "x"), `${k < 0 ? "-" : ""}\\frac{${poly([Math.abs(k), `\\ln ${b}`])}}{x}`, fracL(k, `${b}x`)],
          solution: t(
            `$${f} = ${`${k < 0 ? "-" : ""}\\frac{${poly([Math.abs(k), "\\ln x"])}}{\\ln ${b}}`}$, and $\\ln ${b}$ is a constant, so $f'(x) = ${answer}$.`,
            `$${f} = ${`${k < 0 ? "-" : ""}\\frac{${poly([Math.abs(k), "\\ln x"])}}{\\ln ${b}}`}$，而 $\\ln ${b}$ 是常数，所以 $f'(x) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "simplifying-logarithms-before-differentiating",
      title: t("Simplifying logarithms before differentiating", "求导前先化简对数"),
      explanation: t(
        "Use the laws of logarithms to split a logarithm into simple terms first:\n\n$$\\ln\\left(5x^{3}\\right) = \\ln 5 + 3\\ln x, \\quad\\text{so}\\quad \\frac{d}{dx} \\ln\\left(5x^{3}\\right) = \\frac{3}{x}.$$\n\nThe constant $\\ln 5$ has derivative $0$.",
        "先用对数运算法则把对数拆成简单的项：\n\n$$\\ln\\left(5x^{3}\\right) = \\ln 5 + 3\\ln x, \\quad\\text{所以}\\quad \\frac{d}{dx} \\ln\\left(5x^{3}\\right) = \\frac{3}{x}.$$\n\n常数 $\\ln 5$ 的导数为 $0$。",
      ),
      generate(rng) {
        const c = rng.int(2, 9);
        const n = rng.int(2, 6);
        const quotient = rng.bool();
        const inside = quotient ? `\\frac{x^{${n}}}{${c}}` : `${c}x^{${n}}`;
        const split = quotient ? `${n}\\ln x - \\ln ${c}` : `\\ln ${c} + ${n}\\ln x`;
        const answer = `\\frac{${n}}{x}`;
        return functionProblem({
          prompt: t(
            `Find $f'(x)$ for $f(x) = \\ln\\left(${inside}\\right)$, where $x > 0$.`,
            `设 $f(x) = \\ln\\left(${inside}\\right)$，其中 $x > 0$。求 $f'(x)$。`,
          ),
          answer,
          prefix: "f'(x) =",
          positive: true,
          wrong: [`\\frac{1}{${inside}}`, `\\frac{${quotient ? n : n * c}}{${quotient ? `${c}x` : "x"}}`, "\\frac{1}{x}"],
          solution: t(`$f(x) = ${split}$, so $f'(x) = ${answer}$.`, `$f(x) = ${split}$，所以 $f'(x) = ${answer}$。`),
        });
      },
    },
  ],
};

/** trigRules are the derivatives of sine, cosine and tangent. */
const trigRules: readonly Rule[] = [
  { f: "\\sin x", d: [1, "\\cos x"], bad: [-1, "\\cos x"] },
  { f: "\\cos x", d: [-1, "\\sin x"], bad: [1, "\\sin x"] },
  { f: "\\tan x", d: [1, "\\sec^{2}x"], bad: [1, "\\sec x\\tan x"] },
];

/** QuadrantalAngle is an angle with its LaTeX, sine and cosine. */
type QuadrantalAngle = readonly [string, number, number];

/** quadrantalAngles are angles whose sine and cosine are integers. */
const quadrantalAngles: readonly QuadrantalAngle[] = [
  ["0", 0, 1],
  ["\\frac{\\pi}{2}", 1, 0],
  ["\\pi", 0, -1],
  ["\\frac{3\\pi}{2}", -1, 0],
];

/** differentiatingTrigonometricFunctions differentiates sin, cos and tan. */
export const differentiatingTrigonometricFunctions: TopicDef = {
  id: "differentiating-trigonometric-functions",
  title: t("Differentiating Trigonometric Functions", "三角函数求导"),
  summary: t(
    "Differentiate sine, cosine and tangent, and find slopes of trigonometric curves.",
    "对正弦、余弦、正切求导，并求三角函数曲线的斜率。",
  ),
  prerequisites: ["the-sum-and-constant-multiple-rules-for-differentiation", "special-limits-involving-cosine"],
  encompasses: [
    { topic: "the-sum-and-constant-multiple-rules-for-differentiation", weight: 0.3 },
    { topic: "special-limits-involving-sine", weight: 0.2 },
    { topic: "special-limits-involving-cosine", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "derivatives-of-sine-cosine-and-tangent",
      title: t("Derivatives of sine, cosine and tangent", "正弦、余弦、正切的导数"),
      explanation: t(
        "With $x$ in radians,\n\n$$\\frac{d}{dx} \\sin x = \\cos x, \\qquad \\frac{d}{dx} \\cos x = -\\sin x, \\qquad \\frac{d}{dx} \\tan x = \\sec^{2}x.$$\n\nThe first two follow from the definition and the special limits $\\frac{\\sin h}{h} \\to 1$ and $\\frac{\\cos h - 1}{h} \\to 0$. Mind the minus sign in the derivative of cosine.",
        "当 $x$ 以弧度为单位时，\n\n$$\\frac{d}{dx} \\sin x = \\cos x, \\qquad \\frac{d}{dx} \\cos x = -\\sin x, \\qquad \\frac{d}{dx} \\tan x = \\sec^{2}x.$$\n\n前两个由定义及特殊极限 $\\frac{\\sin h}{h} \\to 1$、$\\frac{\\cos h - 1}{h} \\to 0$ 得到。注意余弦的导数带负号。",
      ),
      generate(rng) {
        const rules = rng.sample(trigRules, 2);
        const terms = rules.map((r) => [rng.nonZero(-6, 6), r] as const);
        const k = rng.int(-4, 4);
        const g = applyRules(terms);
        const f = sumLatex([g.f, poly([k, "x^{2}"])]);
        const answer = sumLatex([g.d, poly([2 * k, "x"])]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [sumLatex([g.bad, poly([2 * k, "x"])]), sumLatex([g.d, poly([k, "x^{2}"])])],
          solution: t(
            `Differentiate term by term, using ${rules.map((r) => `$\\frac{d}{dx} ${r.f} = ${poly(r.d)}$`).join(" and ")}:$$f'(x) = ${answer}.$$`,
            `逐项求导，用到 ${rules.map((r) => `$\\frac{d}{dx} ${r.f} = ${poly(r.d)}$`).join(" 和 ")}：$$f'(x) = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "slopes-of-trigonometric-curves",
      title: t("Slopes of trigonometric curves", "三角函数曲线的斜率"),
      explanation: t(
        "Differentiate, then substitute the angle. For $y = 3\\sin x - 2\\cos x$ at $x = \\pi$: $y' = 3\\cos x + 2\\sin x$, so the slope is $3(-1) + 2(0) = -3$.",
        "先求导，再代入角度。对 $y = 3\\sin x - 2\\cos x$ 在 $x = \\pi$ 处：$y' = 3\\cos x + 2\\sin x$，所以斜率为 $3(-1) + 2(0) = -3$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-6, 6);
        const [x0, s, c] = rng.pick(quadrantalAngles);
        const answer = a * c - b * s;
        return numberProblem({
          prompt: t(
            `Find the slope of the tangent line to $y = ${poly([a, "\\sin x"], [b, "\\cos x"])}$ at $x = ${x0}$.`,
            `求曲线 $y = ${poly([a, "\\sin x"], [b, "\\cos x"])}$ 在 $x = ${x0}$ 处的切线斜率。`,
          ),
          answer,
          wrong: [a * s + b * c, a * c + b * s, -answer === answer ? a : -answer],
          solution: t(
            `$y' = ${poly([a, "\\cos x"], [-b, "\\sin x"])}$. At $x = ${x0}$, $\\sin x = ${s}$ and $\\cos x = ${c}$, so the slope is $${a}(${c}) ${b > 0 ? "-" : "+"} ${Math.abs(b)}(${s}) = ${answer}$.`,
            `$y' = ${poly([a, "\\cos x"], [-b, "\\sin x"])}$。在 $x = ${x0}$ 处 $\\sin x = ${s}$，$\\cos x = ${c}$，所以斜率为 $${a}(${c}) ${b > 0 ? "-" : "+"} ${Math.abs(b)}(${s}) = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** hyperbolicRules are the derivatives of sinh, cosh and tanh. */
const hyperbolicRules: readonly Rule[] = [
  { f: "\\sinh x", d: [1, "\\cosh x"], bad: [-1, "\\cosh x"] },
  { f: "\\cosh x", d: [1, "\\sinh x"], bad: [-1, "\\sinh x"] },
  { f: "\\tanh x", d: [1, "\\operatorname{sech}^{2}x"], bad: [1, "\\sec^{2}x"] },
];

/** differentiatingHyperbolicFunctions differentiates sinh, cosh and tanh. */
export const differentiatingHyperbolicFunctions: TopicDef = {
  id: "differentiating-hyperbolic-functions",
  title: t("Differentiating Hyperbolic Functions", "双曲函数求导"),
  summary: t("Differentiate sinh, cosh and tanh, and evaluate their derivatives.", "对 sinh、cosh、tanh 求导，并计算导数值。"),
  prerequisites: ["differentiating-exponential-functions", "the-hyperbolic-functions"],
  encompasses: [
    { topic: "differentiating-exponential-functions", weight: 0.2 },
    { topic: "the-hyperbolic-functions", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "derivatives-of-sinh-cosh-and-tanh",
      title: t("Derivatives of sinh, cosh and tanh", "sinh、cosh、tanh 的导数"),
      explanation: t(
        "Differentiating $\\sinh x = \\frac{e^{x} - e^{-x}}{2}$ and $\\cosh x = \\frac{e^{x} + e^{-x}}{2}$ gives\n\n$$\\frac{d}{dx} \\sinh x = \\cosh x, \\qquad \\frac{d}{dx} \\cosh x = \\sinh x, \\qquad \\frac{d}{dx} \\tanh x = \\operatorname{sech}^{2}x.$$\n\nUnlike cosine, the derivative of $\\cosh x$ has **no** minus sign.",
        "对 $\\sinh x = \\frac{e^{x} - e^{-x}}{2}$ 和 $\\cosh x = \\frac{e^{x} + e^{-x}}{2}$ 求导，得\n\n$$\\frac{d}{dx} \\sinh x = \\cosh x, \\qquad \\frac{d}{dx} \\cosh x = \\sinh x, \\qquad \\frac{d}{dx} \\tanh x = \\operatorname{sech}^{2}x.$$\n\n与余弦不同，$\\cosh x$ 的导数**没有**负号。",
      ),
      generate(rng) {
        const rules = rng.sample(hyperbolicRules, 2);
        const g = applyRules(rules.map((r) => [rng.nonZero(-6, 6), r] as const));
        const a = rng.int(-3, 3);
        const f = sumLatex([g.f, poly([a, "e^{x}"])]);
        const answer = sumLatex([g.d, poly([a, "e^{x}"])]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [sumLatex([g.bad, poly([a, "e^{x}"])])],
          solution: t(
            `Differentiate term by term, using ${rules.map((r) => `$\\frac{d}{dx} ${r.f} = ${poly(r.d)}$`).join(" and ")}:$$f'(x) = ${answer}.$$`,
            `逐项求导，用到 ${rules.map((r) => `$\\frac{d}{dx} ${r.f} = ${poly(r.d)}$`).join(" 和 ")}：$$f'(x) = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "evaluating-derivatives-of-hyperbolic-functions",
      title: t("Evaluating derivatives of hyperbolic functions", "计算双曲函数的导数值"),
      explanation: t(
        "At $x = 0$: $\\sinh 0 = 0$ and $\\cosh 0 = 1$. At $x = \\ln 2$: $\\sinh(\\ln 2) = \\frac{2 - \\frac{1}{2}}{2} = \\frac{3}{4}$ and $\\cosh(\\ln 2) = \\frac{2 + \\frac{1}{2}}{2} = \\frac{5}{4}$.",
        "在 $x = 0$ 处：$\\sinh 0 = 0$，$\\cosh 0 = 1$。在 $x = \\ln 2$ 处：$\\sinh(\\ln 2) = \\frac{2 - \\frac{1}{2}}{2} = \\frac{3}{4}$，$\\cosh(\\ln 2) = \\frac{2 + \\frac{1}{2}}{2} = \\frac{5}{4}$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-8, 8);
        const b = rng.nonZero(-8, 8);
        const atLn2 = rng.bool();
        const [x0, s, c] = atLn2 ? ["\\ln 2", Q.of(3, 4), Q.of(5, 4)] : ["0", Q.zero, Q.one];
        const answer = Q.of(a).mul(c).add(Q.of(b).mul(s));
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${poly([a, "\\sinh x"], [b, "\\cosh x"])}$. Find $f'(${x0})$.`,
            `设 $f(x) = ${poly([a, "\\sinh x"], [b, "\\cosh x"])}$。求 $f'(${x0})$。`,
          ),
          answer,
          wrong: [Q.of(a).mul(s).add(Q.of(b).mul(c)), Q.of(a).mul(c).sub(Q.of(b).mul(s)), Q.of(a + b)],
          solution: t(
            `$f'(x) = ${poly([a, "\\cosh x"], [b, "\\sinh x"])}$. At $x = ${x0}$, $\\cosh x = ${c.toLatex()}$ and $\\sinh x = ${s.toLatex()}$, so $f'(${x0}) = ${a} \\cdot ${c.toLatex()} + ${par(b)} \\cdot ${s.toLatex()} = ${answer.toLatex()}$.`,
            `$f'(x) = ${poly([a, "\\cosh x"], [b, "\\sinh x"])}$。在 $x = ${x0}$ 处 $\\cosh x = ${c.toLatex()}$，$\\sinh x = ${s.toLatex()}$，所以 $f'(${x0}) = ${a} \\cdot ${c.toLatex()} + ${par(b)} \\cdot ${s.toLatex()} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** reciprocalHyperbolicRules are the derivatives of sech, csch and coth. */
const reciprocalHyperbolicRules: readonly Rule[] = [
  {
    f: "\\operatorname{sech} x",
    d: [-1, "\\operatorname{sech} x\\tanh x"],
    bad: [1, "\\operatorname{sech} x\\tanh x"],
  },
  {
    f: "\\operatorname{csch} x",
    d: [-1, "\\operatorname{csch} x\\coth x"],
    bad: [1, "\\operatorname{csch} x\\coth x"],
  },
  { f: "\\coth x", d: [-1, "\\operatorname{csch}^{2}x"], bad: [-1, "\\operatorname{sech}^{2}x"] },
];

/** differentiatingReciprocalHyperbolicFunctions differentiates sech, csch and coth. */
export const differentiatingReciprocalHyperbolicFunctions: TopicDef = {
  id: "differentiating-reciprocal-hyperbolic-functions",
  title: t("Differentiating Reciprocal Hyperbolic Functions", "倒数双曲函数求导"),
  summary: t("Differentiate sech, csch and coth.", "对 sech、csch、coth 求导。"),
  prerequisites: ["differentiating-hyperbolic-functions", "the-reciprocal-hyperbolic-functions"],
  encompasses: [
    { topic: "differentiating-hyperbolic-functions", weight: 0.4 },
    { topic: "the-reciprocal-hyperbolic-functions", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "derivatives-of-sech-csch-and-coth",
      title: t("Derivatives of sech, csch and coth", "sech、csch、coth 的导数"),
      explanation: t(
        "$$\\frac{d}{dx} \\operatorname{sech} x = -\\operatorname{sech} x\\tanh x, \\qquad \\frac{d}{dx} \\operatorname{csch} x = -\\operatorname{csch} x\\coth x, \\qquad \\frac{d}{dx} \\coth x = -\\operatorname{csch}^{2}x.$$\n\nCompare $\\frac{d}{dx} \\sec x = \\sec x\\tan x$: the hyperbolic secant's derivative carries a minus sign.",
        "$$\\frac{d}{dx} \\operatorname{sech} x = -\\operatorname{sech} x\\tanh x, \\qquad \\frac{d}{dx} \\operatorname{csch} x = -\\operatorname{csch} x\\coth x, \\qquad \\frac{d}{dx} \\coth x = -\\operatorname{csch}^{2}x.$$\n\n对比 $\\frac{d}{dx} \\sec x = \\sec x\\tan x$：双曲正割的导数带负号。",
      ),
      generate(rng) {
        const r = rng.pick(reciprocalHyperbolicRules);
        const k = rng.pick([1, 1, 2, 3, 4, 5, 6, 7, 8, 9, -1, -2, -3, -4, -5, -6]);
        const g = applyRules([[k, r]]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${g.f}$.`, `设 $f(x) = ${g.f}$。求 $f'(x)$。`),
          answer: g.d,
          prefix: "f'(x) =",
          wrong: [g.bad, poly([-k, r.f])],
          solution: t(
            `$\\frac{d}{dx} ${r.f} = ${poly(r.d)}$, so $f'(x) = ${g.d}$.`,
            `$\\frac{d}{dx} ${r.f} = ${poly(r.d)}$，所以 $f'(x) = ${g.d}$。`,
          ),
        });
      },
    },
    {
      id: "sums-of-hyperbolic-functions",
      title: t("Sums of hyperbolic functions", "双曲函数之和"),
      explanation: t(
        "Differentiate a sum term by term with the rules for all six hyperbolic functions:\n\n$$\\frac{d}{dx}\\left(2\\cosh x - \\coth x\\right) = 2\\sinh x + \\operatorname{csch}^{2}x.$$",
        "用六个双曲函数的求导法则对和式逐项求导：\n\n$$\\frac{d}{dx}\\left(2\\cosh x - \\coth x\\right) = 2\\sinh x + \\operatorname{csch}^{2}x.$$",
      ),
      generate(rng) {
        const r1 = rng.pick(reciprocalHyperbolicRules);
        const r2 = rng.pick(hyperbolicRules);
        const terms = [
          [rng.nonZero(-5, 5), r2],
          [rng.nonZero(-5, 5), r1],
        ] as const;
        const g = applyRules(terms);
        const half = applyRules([terms[0], [terms[1][0], { ...r1, d: r1.bad }]]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${g.f}$.`, `设 $f(x) = ${g.f}$。求 $f'(x)$。`),
          answer: g.d,
          prefix: "f'(x) =",
          wrong: [g.bad, half.d],
          solution: t(
            `Using $\\frac{d}{dx} ${r2.f} = ${poly(r2.d)}$ and $\\frac{d}{dx} ${r1.f} = ${poly(r1.d)}$,$$f'(x) = ${g.d}.$$`,
            `由 $\\frac{d}{dx} ${r2.f} = ${poly(r2.d)}$ 和 $\\frac{d}{dx} ${r1.f} = ${poly(r1.d)}$，$$f'(x) = ${g.d}.$$`,
          ),
        });
      },
    },
  ],
};

/** primes writes the derivative notation f', f'', f''' or f^{(n)}. */
const primes = (n: number, f = "f") => (n <= 3 ? `${f}${"'".repeat(n)}` : `${f}^{(${n})}`);

/** cycles are functions whose derivatives repeat, as signed LaTeX terms. */
const cycles: readonly (readonly (readonly [number, string])[])[] = [
  [
    [1, "\\sin x"],
    [1, "\\cos x"],
    [-1, "\\sin x"],
    [-1, "\\cos x"],
  ],
  [
    [1, "\\cos x"],
    [-1, "\\sin x"],
    [-1, "\\cos x"],
    [1, "\\sin x"],
  ],
  [
    [1, "\\sinh x"],
    [1, "\\cosh x"],
  ],
  [[1, "e^{x}"]],
];

/** secondAndHigherOrderDerivatives differentiates repeatedly. */
export const secondAndHigherOrderDerivatives: TopicDef = {
  id: "second-and-higher-order-derivatives",
  title: t("Second and Higher-Order Derivatives", "二阶及高阶导数"),
  summary: t(
    "Differentiate repeatedly to find second and higher derivatives, including acceleration.",
    "反复求导得到二阶及更高阶导数，包括加速度。",
  ),
  prerequisites: ["differentiating-trigonometric-functions", "differentiating-hyperbolic-functions"],
  encompasses: [
    { topic: "the-sum-and-constant-multiple-rules-for-differentiation", weight: 0.4 },
    { topic: "differentiating-trigonometric-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "second-derivatives-of-polynomials",
      title: t("Second derivatives of polynomials", "多项式的二阶导数"),
      explanation: t(
        "The **second derivative** $f''$ is the derivative of $f'$, also written $\\frac{d^{2}y}{dx^{2}}$. For $f(x) = x^{4} - 3x^{2}$: $f'(x) = 4x^{3} - 6x$ and $f''(x) = 12x^{2} - 6$.",
        "**二阶导数** $f''$ 是 $f'$ 的导数，也记作 $\\frac{d^{2}y}{dx^{2}}$。对 $f(x) = x^{4} - 3x^{2}$：$f'(x) = 4x^{3} - 6x$，$f''(x) = 12x^{2} - 6$。",
      ),
      generate(rng) {
        const deg = rng.int(3, 5);
        const p: number[] = range(0, deg).map((i) => (i === deg ? rng.nonZero(-4, 4) : rng.int(-7, 7)));
        const d1 = pDer(p);
        const d2 = pDer(d1);
        return functionProblem({
          prompt: t(`Find $f''(x)$ for $f(x) = ${pLatex(p)}$.`, `设 $f(x) = ${pLatex(p)}$。求 $f''(x)$。`),
          answer: pLatex(d2),
          prefix: "f''(x) =",
          wrong: [pLatex(d1), pLatex(d2.map((c, i) => c / (i + 2))), pLatex(pDer(d2))],
          solution: t(`$f'(x) = ${pLatex(d1)}$, so $f''(x) = ${pLatex(d2)}$.`, `$f'(x) = ${pLatex(d1)}$，所以 $f''(x) = ${pLatex(d2)}$。`),
        });
      },
    },
    {
      id: "higher-order-derivatives-that-repeat",
      title: t("Higher-order derivatives that repeat", "循环出现的高阶导数"),
      explanation: t(
        "Some derivatives repeat in a cycle. For sine:\n\n$$\\sin x \\to \\cos x \\to -\\sin x \\to -\\cos x \\to \\sin x,$$\n\nwith period $4$, so $f^{(n)}$ depends only on the remainder of $n$ divided by $4$. $\\sinh x$ and $\\cosh x$ alternate with period $2$, and $e^{x}$ never changes. A polynomial of degree $n$ has $(n + 1)$th derivative $0$.",
        "有些导数会循环出现。对正弦：\n\n$$\\sin x \\to \\cos x \\to -\\sin x \\to -\\cos x \\to \\sin x,$$\n\n周期为 $4$，所以 $f^{(n)}$ 只取决于 $n$ 除以 $4$ 的余数。$\\sinh x$ 与 $\\cosh x$ 以周期 $2$ 交替出现，$e^{x}$ 则始终不变。$n$ 次多项式的 $n + 1$ 阶导数为 $0$。",
      ),
      generate(rng) {
        const cycle = rng.pick(cycles);
        const n = rng.int(4, 30);
        const k = rng.pick([1, 1, 2, 3, -1, -2, 5]);
        const at = (i: number) => {
          const [s, f] = cycle[i % cycle.length]!;
          return poly([k * s, f]);
        };
        const answer = at(n);
        const wrong = [at(n + 1), at(n + 2), at(n + 3)].filter((w) => w !== answer);
        return functionProblem({
          prompt: t(`Let $f(x) = ${at(0)}$. Find $${primes(n)}(x)$.`, `设 $f(x) = ${at(0)}$。求 $${primes(n)}(x)$。`),
          answer,
          prefix: `${primes(n)}(x) =`,
          wrong,
          solution: t(
            cycle.length === 1
              ? `Every derivative of $e^{x}$ is $e^{x}$, so $${primes(n)}(x) = ${answer}$.`
              : `The derivatives repeat every $${cycle.length}$ steps: ${range(0, cycle.length)
                  .map((i) => `$${at(i)}$`)
                  .join(
                    ", ",
                  )}. Since $${n} = ${cycle.length} \\cdot ${Math.floor(n / cycle.length)} + ${n % cycle.length}$, $${primes(n)}(x) = ${answer}$.`,
            cycle.length === 1
              ? `$e^{x}$ 的每一阶导数都是 $e^{x}$，所以 $${primes(n)}(x) = ${answer}$。`
              : `导数每 $${cycle.length}$ 次循环一次：${range(0, cycle.length)
                  .map((i) => `$${at(i)}$`)
                  .join(
                    "，",
                  )}。因为 $${n} = ${cycle.length} \\cdot ${Math.floor(n / cycle.length)} + ${n % cycle.length}$，所以 $${primes(n)}(x) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "acceleration-as-a-second-derivative",
      title: t("Acceleration as a second derivative", "加速度作为二阶导数"),
      explanation: t(
        "For a position $s(t)$, the velocity is $v(t) = s'(t)$ and the **acceleration** is $a(t) = v'(t) = s''(t)$.",
        "对位置函数 $s(t)$，速度为 $v(t) = s'(t)$，**加速度**为 $a(t) = v'(t) = s''(t)$。",
      ),
      generate(rng) {
        const p: Poly = [rng.int(0, 9), rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-2, 2)];
        const t0 = rng.int(0, 5);
        const d1 = pDer(p);
        const d2 = pDer(d1);
        const answer = pAt(d2, t0);
        return numberProblem({
          prompt: t(
            `A particle moves along a line so that its position at time $t$ seconds is $s(t) = ${pLatex(p, "t")}$ meters. Find its acceleration, in m/s², at $t = ${t0}$.`,
            `一个质点沿直线运动，$t$ 秒时的位置为 $s(t) = ${pLatex(p, "t")}$ 米。求它在 $t = ${t0}$ 时的加速度（单位 m/s²）。`,
          ),
          answer,
          wrong: [pAt(d1, t0), pAt(p, t0), pAt(pDer(d2), t0)],
          solution: t(
            `$v(t) = s'(t) = ${pLatex(d1, "t")}$ and $a(t) = s''(t) = ${pLatex(d2, "t")}$, so $a(${t0}) = ${answer}$ m/s².`,
            `$v(t) = s'(t) = ${pLatex(d1, "t")}$，$a(t) = s''(t) = ${pLatex(d2, "t")}$，所以 $a(${t0}) = ${answer}$ m/s²。`,
          ),
        });
      },
    },
  ],
};

/** Factor is a transcendental factor with its derivative as signed terms in LaTeX. */
interface Factor {
  readonly f: string;
  readonly d: readonly [number, string];
  readonly positive?: boolean;
}

/** factors are functions to multiply and divide by powers of x. */
const factors: readonly Factor[] = [
  { f: "e^{x}", d: [1, "e^{x}"] },
  { f: "\\sin x", d: [1, "\\cos x"] },
  { f: "\\cos x", d: [-1, "\\sin x"] },
  { f: "\\ln x", d: [1, "\\frac{1}{x}"], positive: true },
];

/** times writes the product of x^n and a function: "x^{2}\\sin x", "e^{x}", "x". */
const times = (n: number, f: string) => (f === "" ? power(n) || "1" : `${power(n)}${f}`);

/** theProductRuleForDifferentiation differentiates products. */
export const theProductRuleForDifferentiation: TopicDef = {
  id: "the-product-rule-for-differentiation",
  title: t("The Product Rule for Differentiation", "求导的乘积法则"),
  summary: t("Differentiate products of functions with the product rule.", "用乘积法则对函数之积求导。"),
  prerequisites: ["differentiating-logarithmic-functions", "differentiating-trigonometric-functions"],
  encompasses: [
    { topic: "differentiating-exponential-functions", weight: 0.2 },
    { topic: "differentiating-logarithmic-functions", weight: 0.2 },
    { topic: "differentiating-trigonometric-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "the-product-rule",
      title: t("The product rule", "乘积法则"),
      explanation: t(
        "**Product rule.** $(uv)' = u'v + uv'$. The derivative of a product is **not** the product of the derivatives. For $x^{2}e^{x}$, with $u = x^{2}$ and $v = e^{x}$:\n\n$$\\frac{d}{dx}\\left(x^{2}e^{x}\\right) = 2xe^{x} + x^{2}e^{x}.$$",
        "**乘积法则** $(uv)' = u'v + uv'$。乘积的导数**不是**导数的乘积。对 $x^{2}e^{x}$，取 $u = x^{2}$，$v = e^{x}$：\n\n$$\\frac{d}{dx}\\left(x^{2}e^{x}\\right) = 2xe^{x} + x^{2}e^{x}.$$",
      ),
      generate(rng) {
        const v = rng.pick(factors);
        const n = rng.int(1, 5);
        const k = rng.pick([1, 1, 2, 3, 4, -1, -2, 5]);
        const f = poly([k, times(n, v.f)]);
        const first = poly([k * n, times(n - 1, v.f)]);
        const second = v.f === "\\ln x" ? poly([k, power(n - 1)]) : poly([k * v.d[0], times(n, v.d[1])]);
        const answer = sumLatex([first, second]);
        const both =
          v.f === "\\ln x" ? (n === 1 ? fracL(k, "x") : poly([k * n, power(n - 2)])) : poly([k * n * v.d[0], times(n - 1, v.d[1])]);
        return functionProblem({
          prompt: t(
            `Find $f'(x)$ for $f(x) = ${f}$${v.positive ? ", where $x > 0$" : ""}.`,
            `设 $f(x) = ${f}$${v.positive ? "，其中 $x > 0$" : ""}。求 $f'(x)$。`,
          ),
          answer,
          prefix: "f'(x) =",
          ...(v.positive && { positive: true }),
          wrong: [both, sumLatex([first, second.startsWith("-") ? second.slice(1) : `-${second}`]), first],
          solution: t(
            `With $u = ${poly([k, power(n)])}$ and $v = ${v.f}$: $u' = ${poly([k * n, power(n - 1)])}$ and $v' = ${poly(v.d)}$. By the product rule,$$f'(x) = u'v + uv' = ${answer}.$$`,
            `取 $u = ${poly([k, power(n)])}$，$v = ${v.f}$：$u' = ${poly([k * n, power(n - 1)])}$，$v' = ${poly(v.d)}$。由乘积法则，$$f'(x) = u'v + uv' = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "the-product-rule-at-a-point",
      title: t("The product rule at a point", "某点处的乘积法则"),
      explanation: t(
        "To find $(uv)'(a)$, evaluate $u(a)$, $u'(a)$, $v(a)$ and $v'(a)$, then combine: $(uv)'(a) = u'(a)v(a) + u(a)v'(a)$. There is no need to expand the product.",
        "求 $(uv)'(a)$ 时，先求 $u(a)$、$u'(a)$、$v(a)$、$v'(a)$，再组合：$(uv)'(a) = u'(a)v(a) + u(a)v'(a)$。不必把乘积展开。",
      ),
      generate(rng) {
        const u: Poly = [rng.int(-6, 6), rng.nonZero(-4, 4)];
        const v: Poly = [rng.int(-6, 6), rng.int(-3, 3), rng.nonZero(-3, 3)];
        const a = rng.int(-3, 3);
        const [ua, va, dua, dva] = [pAt(u, a), pAt(v, a), pAt(pDer(u), a), pAt(pDer(v), a)];
        const answer = dua * va + ua * dva;
        return numberProblem({
          prompt: t(
            `Let $f(x) = (${pLatex(u)})(${pLatex(v)})$. Find $f'(${a})$.`,
            `设 $f(x) = (${pLatex(u)})(${pLatex(v)})$。求 $f'(${a})$。`,
          ),
          answer,
          wrong: [dua * dva, ua * va, dua * va - ua * dva],
          solution: t(
            `With $u = ${pLatex(u)}$ and $v = ${pLatex(v)}$: $u(${a}) = ${ua}$, $u'(${a}) = ${dua}$, $v(${a}) = ${va}$, $v'(${a}) = ${dva}$. So$$f'(${a}) = ${par(dua)} \\cdot ${par(va)} + ${par(ua)} \\cdot ${par(dva)} = ${answer}.$$`,
            `取 $u = ${pLatex(u)}$，$v = ${pLatex(v)}$：$u(${a}) = ${ua}$，$u'(${a}) = ${dua}$，$v(${a}) = ${va}$，$v'(${a}) = ${dva}$。所以$$f'(${a}) = ${par(dua)} \\cdot ${par(va)} + ${par(ua)} \\cdot ${par(dva)} = ${answer}.$$`,
          ),
        });
      },
    },
  ],
};

/** theQuotientRuleForDifferentiation differentiates quotients. */
export const theQuotientRuleForDifferentiation: TopicDef = {
  id: "the-quotient-rule-for-differentiation",
  title: t("The Quotient Rule for Differentiation", "求导的商法则"),
  summary: t("Differentiate quotients of functions with the quotient rule.", "用商法则对函数之商求导。"),
  prerequisites: ["the-product-rule-for-differentiation"],
  encompasses: [{ topic: "the-product-rule-for-differentiation", weight: 0.5 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "the-quotient-rule-for-rational-functions",
      title: t("The quotient rule for rational functions", "有理函数的商法则"),
      explanation: t(
        "**Quotient rule.**\n\n$$\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^{2}}.$$\n\nThe order in the numerator matters. For $\\frac{2x + 1}{x - 3}$: $\\frac{2(x - 3) - (2x + 1)(1)}{(x - 3)^{2}} = \\frac{-7}{(x - 3)^{2}}$.",
        "**商法则**\n\n$$\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^{2}}.$$\n\n分子中的顺序很重要。对 $\\frac{2x + 1}{x - 3}$：$\\frac{2(x - 3) - (2x + 1)(1)}{(x - 3)^{2}} = \\frac{-7}{(x - 3)^{2}}$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.int(-6, 6);
        const c = rng.pick([1, 1, 2, 3, -1]);
        let d = rng.int(-6, 6);
        while (a * d - b * c === 0) d = rng.int(-6, 6);
        const num = poly([a, "x"], [b, ""]);
        const den = poly([c, "x"], [d, ""]);
        const sq = d === 0 ? (c === 1 ? "x^{2}" : `${c * c}x^{2}`) : `(${den})^{2}`;
        const det = a * d - b * c;
        const answer = fracL(det, sq);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = \\frac{${num}}{${den}}$.`, `设 $f(x) = \\frac{${num}}{${den}}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [fracL(-det, sq), Q.of(a, c).toLatex(), fracL(det, d === 0 ? poly([c, "x"]) : den)],
          solution: t(
            `With $u = ${num}$ and $v = ${den}$, $u' = ${a}$ and $v' = ${c}$:$$f'(x) = \\frac{${a}(${den}) - ${par(c)}(${num})}{${sq}} = ${answer}.$$`,
            `取 $u = ${num}$，$v = ${den}$，则 $u' = ${a}$，$v' = ${c}$：$$f'(x) = \\frac{${a}(${den}) - ${par(c)}(${num})}{${sq}} = ${answer}.$$`,
          ),
        });
      },
    },
    {
      id: "the-quotient-rule-with-other-functions",
      title: t("The quotient rule with other functions", "含其他函数的商法则"),
      explanation: t(
        "For $\\frac{e^{x}}{x^{2}}$: $\\frac{e^{x} \\cdot x^{2} - e^{x} \\cdot 2x}{x^{4}} = \\frac{xe^{x} - 2e^{x}}{x^{3}}$, after cancelling a factor $x$. Simplify by cancelling common powers of $x$.",
        "对 $\\frac{e^{x}}{x^{2}}$：$\\frac{e^{x} \\cdot x^{2} - e^{x} \\cdot 2x}{x^{4}} = \\frac{xe^{x} - 2e^{x}}{x^{3}}$（约去一个因子 $x$）。化简时约去公共的 $x$ 的幂。",
      ),
      generate(rng) {
        const g = rng.pick(factors);
        const n = rng.int(1, 3);
        const k = rng.pick([1, 1, 2, 3, 4, 5, -1, -2, -3]);
        const neg = (x: string) => (x.startsWith("-") ? x.slice(1) : `-${x}`);
        const top = poly([k, g.f]);
        const du = poly([k * g.d[0], g.d[1]]);
        const xd = g.f === "\\ln x" ? String(k) : poly([k * g.d[0], `x${g.d[1]}`]);
        const numerator = sumLatex([xd, poly([-k * n, g.f])]);
        const answer = `\\frac{${numerator}}{${power(n + 1)}}`;
        const quotient = `\\frac{${du} \\cdot ${power(n)} - ${k < 0 ? `(${top})` : top} \\cdot ${poly([n, power(n - 1)])}}{${power(2 * n)}}`;
        return functionProblem({
          prompt: t(
            `Find $f'(x)$ for $f(x) = \\frac{${top}}{${power(n)}}$${g.positive ? ", where $x > 0$" : ""}.`,
            `设 $f(x) = \\frac{${top}}{${power(n)}}$${g.positive ? "，其中 $x > 0$" : ""}。求 $f'(x)$。`,
          ),
          answer,
          prefix: "f'(x) =",
          ...(g.positive && { positive: true }),
          wrong: [
            `\\frac{${sumLatex([poly([k * n, g.f]), neg(xd)])}}{${power(n + 1)}}`,
            `\\frac{${du}}{${n === 1 ? "1" : poly([n, power(n - 1)])}}`,
          ],
          solution: t(
            `With $u = ${top}$ and $v = ${power(n)}$:$$f'(x) = ${quotient} = ${answer}.$$`,
            `取 $u = ${top}$，$v = ${power(n)}$：$$f'(x) = ${quotient} = ${answer}.$$`,
          ),
        });
      },
    },
  ],
};

/** reciprocalTrigRules are the derivatives of sec, csc and cot. */
const reciprocalTrigRules: readonly Rule[] = [
  { f: "\\sec x", d: [1, "\\sec x\\tan x"], bad: [-1, "\\sec x\\tan x"] },
  { f: "\\csc x", d: [-1, "\\csc x\\cot x"], bad: [1, "\\csc x\\cot x"] },
  { f: "\\cot x", d: [-1, "\\csc^{2}x"], bad: [1, "\\csc^{2}x"] },
];

/** differentiatingReciprocalTrigonometricFunctions differentiates sec, csc and cot. */
export const differentiatingReciprocalTrigonometricFunctions: TopicDef = {
  id: "differentiating-reciprocal-trigonometric-functions",
  title: t("Differentiating Reciprocal Trigonometric Functions", "倒数三角函数求导"),
  summary: t(
    "Differentiate secant, cosecant and cotangent, and quotients of trigonometric functions.",
    "对正割、余割、余切以及三角函数之商求导。",
  ),
  prerequisites: ["the-quotient-rule-for-differentiation"],
  encompasses: [
    { topic: "the-quotient-rule-for-differentiation", weight: 0.3 },
    { topic: "differentiating-trigonometric-functions", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "derivatives-of-secant-cosecant-and-cotangent",
      title: t("Derivatives of secant, cosecant and cotangent", "正割、余割、余切的导数"),
      explanation: t(
        'Applying the quotient rule to $\\frac{1}{\\cos x}$, $\\frac{1}{\\sin x}$ and $\\frac{\\cos x}{\\sin x}$ gives\n\n$$\\frac{d}{dx} \\sec x = \\sec x\\tan x, \\qquad \\frac{d}{dx} \\csc x = -\\csc x\\cot x, \\qquad \\frac{d}{dx} \\cot x = -\\csc^{2}x.$$\n\nThe "co" functions have minus signs.',
        "对 $\\frac{1}{\\cos x}$、$\\frac{1}{\\sin x}$、$\\frac{\\cos x}{\\sin x}$ 用商法则，得\n\n$$\\frac{d}{dx} \\sec x = \\sec x\\tan x, \\qquad \\frac{d}{dx} \\csc x = -\\csc x\\cot x, \\qquad \\frac{d}{dx} \\cot x = -\\csc^{2}x.$$\n\n带“余”字的函数，导数带负号。",
      ),
      generate(rng) {
        const r1 = rng.pick(reciprocalTrigRules);
        const r2 = rng.pick(trigRules);
        const terms = [
          [rng.nonZero(-5, 5), r1],
          [rng.int(-5, 5), r2],
        ] as const;
        const g = applyRules(terms.filter(([k]) => k !== 0));
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${g.f}$.`, `设 $f(x) = ${g.f}$。求 $f'(x)$。`),
          answer: g.d,
          prefix: "f'(x) =",
          wrong: [g.bad, applyRules(terms.filter(([k]) => k !== 0).map(([k, r]) => [k, r === r1 ? { ...r, d: r.bad } : r])).d],
          solution: t(`Differentiate term by term:$$f'(x) = ${g.d}.$$`, `逐项求导：$$f'(x) = ${g.d}.$$`),
        });
      },
    },
    {
      id: "quotients-of-trigonometric-functions",
      title: t("Quotients of trigonometric functions", "三角函数之商"),
      explanation: t(
        "Use the quotient rule, then simplify with $\\sin^{2}x + \\cos^{2}x = 1$. For $\\frac{2 + \\sin x}{\\cos x}$:\n\n$$\\frac{\\cos x \\cdot \\cos x - (2 + \\sin x)(-\\sin x)}{\\cos^{2}x} = \\frac{1 + 2\\sin x}{\\cos^{2}x}.$$",
        "先用商法则，再用 $\\sin^{2}x + \\cos^{2}x = 1$ 化简。对 $\\frac{2 + \\sin x}{\\cos x}$：\n\n$$\\frac{\\cos x \\cdot \\cos x - (2 + \\sin x)(-\\sin x)}{\\cos^{2}x} = \\frac{1 + 2\\sin x}{\\cos^{2}x}.$$",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.pick([1, 1, 2, 3, -1, -2]);
        const overCos = rng.bool();
        const [top, bottom] = overCos ? ["\\sin x", "\\cos x"] : ["\\cos x", "\\sin x"];
        const num = poly([a, ""], [b, top]);
        const sq = `${bottom.replace(" x", "")}^{2}x`;
        // (a + b sin x)/cos x has derivative (b + a sin x)/cos²x; (a + b cos x)/sin x has −(b + a cos x)/sin²x.
        const over = (c: number, d: number, sign: boolean) => `${sign ? "-" : ""}\\frac{${poly([c, ""], [d, top])}}{${sq}}`;
        const answer = over(b, a, !overCos);
        const expanded = overCos
          ? `\\frac{${poly([b, "\\cos x"])} \\cdot \\cos x - (${num})(-\\sin x)}{\\cos^{2}x}`
          : `\\frac{${poly([-b, "\\sin x"])} \\cdot \\sin x - (${num})\\cos x}{\\sin^{2}x}`;
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = \\frac{${num}}{${bottom}}$.`, `设 $f(x) = \\frac{${num}}{${bottom}}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [over(b, a, overCos), over(b, -a, !overCos), over(a, b, !overCos)],
          solution: t(
            `By the quotient rule and $\\sin^{2}x + \\cos^{2}x = 1$,$$f'(x) = ${expanded} = ${answer}.$$`,
            `由商法则及 $\\sin^{2}x + \\cos^{2}x = 1$，$$f'(x) = ${expanded} = ${answer}.$$`,
          ),
        });
      },
    },
  ],
};

/** Combination is how h is built from f and g. */
type Combination = "product" | "quotient" | "sum";

/** calculatingDerivativesFromDataAndTables uses tables of values. */
export const calculatingDerivativesFromDataAndTables: TopicDef = {
  id: "calculating-derivatives-from-data-and-tables",
  title: t("Calculating Derivatives From Data and Tables", "由数据和表格计算导数"),
  summary: t(
    "Use tables of function and derivative values with the differentiation rules, and estimate derivatives from data.",
    "利用函数值和导数值的表格及求导法则计算导数，并由数据估计导数。",
  ),
  prerequisites: ["the-quotient-rule-for-differentiation"],
  encompasses: [{ topic: "the-quotient-rule-for-differentiation", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "combining-derivatives-from-a-table",
      title: t("Combining derivatives from a table", "由表格组合导数"),
      explanation: t(
        "When only values of $f$, $f'$, $g$ and $g'$ are known, apply the rules at the point:\n\n$$(fg)'(a) = f'(a)g(a) + f(a)g'(a), \\qquad \\left(\\frac{f}{g}\\right)'(a) = \\frac{f'(a)g(a) - f(a)g'(a)}{g(a)^{2}}.$$",
        "当只知道 $f$、$f'$、$g$、$g'$ 的值时，在该点处应用求导法则：\n\n$$(fg)'(a) = f'(a)g(a) + f(a)g'(a), \\qquad \\left(\\frac{f}{g}\\right)'(a) = \\frac{f'(a)g(a) - f(a)g'(a)}{g(a)^{2}}.$$",
      ),
      generate(rng) {
        const xs = [1, 2, 3];
        const nz = () => rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const rows = xs.map(() => [rng.int(-5, 5), rng.int(-5, 5), nz(), rng.int(-5, 5)] as const);
        const i = rng.int(0, 2);
        const [f, df, g, dg] = rows[i]!;
        const a = xs[i]!;
        const kind = rng.pick<Combination>(["product", "quotient", "sum"]);
        const k = rng.nonZero(-4, 4);
        const tab = table(
          ["$x$", "$f(x)$", "$f'(x)$", "$g(x)$", "$g'(x)$"],
          ...xs.map((x, j) => [`$${x}$`, ...rows[j]!.map((v) => `$${v}$`)]),
        );
        let h: string;
        let answer: Q;
        let wrong: Q[];
        let work: string;
        if (kind === "product") {
          h = "f(x)g(x)";
          answer = Q.of(df * g + f * dg);
          wrong = [Q.of(df * dg), Q.of(df * g - f * dg), Q.of(f * g)];
          work = `f'(${a})g(${a}) + f(${a})g'(${a}) = ${par(df)} \\cdot ${par(g)} + ${par(f)} \\cdot ${par(dg)}`;
        } else if (kind === "quotient") {
          h = "\\frac{f(x)}{g(x)}";
          answer = Q.of(df * g - f * dg, g * g);
          wrong = [Q.of(f * dg - df * g, g * g), ...(dg === 0 ? [] : [Q.of(df, dg)]), Q.of(df * g - f * dg, g)];
          work = `\\frac{f'(${a})g(${a}) - f(${a})g'(${a})}{g(${a})^{2}} = \\frac{${par(df)} \\cdot ${par(g)} - ${par(f)} \\cdot ${par(dg)}}{${par(g)}^{2}}`;
        } else {
          h = poly([k, "f(x)"], [-x2(k), "g(x)"]);
          answer = Q.of(k * df - x2(k) * dg);
          wrong = [Q.of(k * f - x2(k) * g), Q.of(df - dg), Q.of(k * df + x2(k) * dg)];
          work = `${k} \\cdot ${par(df)} - ${x2(k)} \\cdot ${par(dg)}`;
        }
        return numberProblem({
          prompt: t(
            `The table gives values of $f$, $g$ and their derivatives.\n\n${tab}\n\nLet $h(x) = ${h}$. Find $h'(${a})$.`,
            `下表给出 $f$、$g$ 及其导数的值。\n\n${tab}\n\n设 $h(x) = ${h}$。求 $h'(${a})$。`,
          ),
          answer,
          wrong,
          solution: t(`$$h'(${a}) = ${work} = ${answer.toLatex()}.$$`, `$$h'(${a}) = ${work} = ${answer.toLatex()}.$$`),
        });
      },
    },
    {
      id: "estimating-a-derivative-from-data",
      title: t("Estimating a derivative from data", "由数据估计导数"),
      explanation: t(
        "From measured values, estimate $f'(a)$ by the slope between the nearest data points on either side of $a$:\n\n$$f'(a) \\approx \\frac{f(b) - f(c)}{b - c}, \\qquad c < a < b.$$",
        "由测量数据估计 $f'(a)$ 时，用 $a$ 两侧最近的两个数据点之间的斜率：\n\n$$f'(a) \\approx \\frac{f(b) - f(c)}{b - c}, \\qquad c < a < b.$$",
      ),
      generate(rng) {
        const steps = [rng.int(1, 3), rng.int(1, 3), rng.int(1, 3), rng.int(1, 3)];
        const ts = [0];
        for (const s of steps) ts.push(ts[ts.length - 1]! + s);
        const temps = ts.map(() => 0);
        temps[0] = rng.int(20, 60);
        for (let j = 1; j < ts.length; j++) temps[j] = temps[j - 1]! + rng.int(-9, 9);
        const j = rng.int(1, 3);
        const [c, a, b] = [ts[j - 1]!, ts[j]!, ts[j + 1]!];
        const [fc, fb] = [temps[j - 1]!, temps[j + 1]!];
        const answer = Q.of(fb - fc, b - c);
        const tab = table(["$t$ (min)", ...ts.map((x) => `$${x}$`)], ["$T(t)$ (°C)", ...temps.map((x) => `$${x}$`)]);
        return numberProblem({
          prompt: t(
            `The temperature $T$ of a liquid was measured at several times $t$.\n\n${tab}\n\nEstimate $T'(${a})$, in °C per minute, using the data points on either side of $t = ${a}$.`,
            `在若干时刻 $t$ 测量了某液体的温度 $T$。\n\n${tab}\n\n用 $t = ${a}$ 两侧的数据点估计 $T'(${a})$（单位：°C/分钟）。`,
          ),
          answer,
          wrong: [Q.of(fb - temps[j]!, b - a), Q.of(temps[j]! - fc, a - c), Q.of(fb - fc)].filter((w) => !w.eq(answer)),
          solution: t(
            `$$T'(${a}) \\approx \\frac{T(${b}) - T(${c})}{${b} - ${c}} = \\frac{${fb} - ${par(fc)}}{${b - c}} = ${answer.toLatex()}.$$`,
            `$$T'(${a}) \\approx \\frac{T(${b}) - T(${c})}{${b} - ${c}} = \\frac{${fb} - ${par(fc)}}{${b - c}} = ${answer.toLatex()}.$$`,
          ),
        });
      },
    },
  ],
};

/** x2 is the coefficient of g in a sum kf − x2(k)g: a second small number derived from k. */
function x2(k: number): number {
  return Math.abs(k) === 1 ? 2 : Math.abs(k) - 1;
}

/** Polyline is a piecewise linear graph through integer points at x = −6, −4, …, 6. */
type Polyline = readonly number[];

/** polyXs are the x-coordinates of a polyline's vertices. */
const polyXs = [-6, -4, -2, 0, 2, 4, 6];

/** polyline chooses a piecewise linear graph through integer points. */
function polyline(rng: Rng): Polyline {
  const ys = [rng.int(-4, 4)];
  for (let i = 1; i < polyXs.length; i++) {
    let y = ys[i - 1]! + rng.pick([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
    if (y > 6 || y < -6) y = ys[i - 1]! - Math.sign(y) * 2;
    ys.push(y);
  }
  return ys;
}

/** polylineFigure draws a polyline. */
function polylineFigure(ys: Polyline): Figure {
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

/** onSegment picks an odd x inside a segment, with f and f' there. */
function onSegment(rng: Rng, ys: Polyline) {
  const i = rng.int(0, polyXs.length - 2);
  const x = polyXs[i]! + 1;
  const slope = Q.of(ys[i + 1]! - ys[i]!, 2);
  const value = Q.of(ys[i]! + ys[i + 1]!, 2);
  return { x, slope, value, from: [polyXs[i]!, ys[i]!] as const, to: [polyXs[i + 1]!, ys[i + 1]!] as const };
}

/** calculatingDerivativesFromGraphs reads derivatives from graphs. */
export const calculatingDerivativesFromGraphs: TopicDef = {
  id: "calculating-derivatives-from-graphs",
  title: t("Calculating Derivatives From Graphs", "由图像计算导数"),
  summary: t(
    "Read derivatives from graphs of piecewise linear functions and combine them with the differentiation rules.",
    "由折线函数的图像读出导数，并与求导法则结合使用。",
  ),
  prerequisites: ["calculating-derivatives-from-data-and-tables"],
  encompasses: [
    { topic: "calculating-derivatives-from-data-and-tables", weight: 0.4 },
    { topic: "slope-of-a-line", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "derivatives-from-a-piecewise-linear-graph",
      title: t("Derivatives from a piecewise linear graph", "由折线图求导数"),
      explanation: t(
        "On a straight segment of a graph the tangent line is the segment itself, so $f'(a)$ is the slope of the segment containing $a$: rise over run between its endpoints.",
        "在图像的直线段上，切线就是这条线段本身，所以 $f'(a)$ 等于包含 $a$ 的那条线段的斜率：两端点间的纵向变化量除以横向变化量。",
      ),
      generate(rng) {
        const ys = polyline(rng);
        const s = onSegment(rng, ys);
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ is made of line segments. Find $f'(${s.x})$.`,
              `$y = f(x)$ 的图像由若干线段组成。求 $f'(${s.x})$。`,
            ),
            answer: s.slope,
            wrong: [s.value, s.slope.neg(), Q.of(s.to[1] - s.from[1])],
            solution: t(
              `$x = ${s.x}$ lies on the segment from $(${s.from[0]}, ${s.from[1]})$ to $(${s.to[0]}, ${s.to[1]})$, whose slope is $\\frac{${s.to[1]} - ${par(s.from[1])}}{2} = ${s.slope.toLatex()}$.`,
              `$x = ${s.x}$ 位于从 $(${s.from[0]}, ${s.from[1]})$ 到 $(${s.to[0]}, ${s.to[1]})$ 的线段上，其斜率为 $\\frac{${s.to[1]} - ${par(s.from[1])}}{2} = ${s.slope.toLatex()}$。`,
            ),
          }),
          figure: polylineFigure(ys),
        };
      },
    },
    {
      id: "derivatives-of-products-from-a-graph",
      title: t("Derivatives of products from a graph", "由图像求乘积的导数"),
      explanation: t(
        "Read $f(a)$ and $f'(a)$ from the graph, then apply the rules. For $h(x) = x^{2}f(x)$:\n\n$$h'(a) = 2af(a) + a^{2}f'(a).$$",
        "从图像读出 $f(a)$ 和 $f'(a)$，再应用求导法则。对 $h(x) = x^{2}f(x)$：\n\n$$h'(a) = 2af(a) + a^{2}f'(a).$$",
      ),
      generate(rng) {
        const ys = polyline(rng);
        const s = onSegment(rng, ys);
        const a = s.x;
        const n = rng.pick([1, 2]);
        const xa = Q.of(a ** n);
        const dxa = Q.of(n * a ** (n - 1));
        const answer = dxa.mul(s.value).add(xa.mul(s.slope));
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ is made of line segments. Let $h(x) = ${power(n)}f(x)$. Find $h'(${a})$.`,
              `$y = f(x)$ 的图像由若干线段组成。设 $h(x) = ${power(n)}f(x)$。求 $h'(${a})$。`,
            ),
            answer,
            wrong: [dxa.mul(s.slope), xa.mul(s.slope), dxa.mul(s.value).sub(xa.mul(s.slope))],
            solution: t(
              `From the graph, $f(${a}) = ${s.value.toLatex()}$ and $f'(${a}) = ${s.slope.toLatex()}$. By the product rule, $h'(x) = ${n === 1 ? "f(x)" : "2xf(x)"} + ${power(n)}f'(x)$, so$$h'(${a}) = ${dxa.toLatex()} \\cdot ${par(s.value)} + ${par(xa)} \\cdot ${par(s.slope)} = ${answer.toLatex()}.$$`,
              `由图像，$f(${a}) = ${s.value.toLatex()}$，$f'(${a}) = ${s.slope.toLatex()}$。由乘积法则，$h'(x) = ${n === 1 ? "f(x)" : "2xf(x)"} + ${power(n)}f'(x)$，所以$$h'(${a}) = ${dxa.toLatex()} \\cdot ${par(s.value)} + ${par(xa)} \\cdot ${par(s.slope)} = ${answer.toLatex()}.$$`,
            ),
          }),
          figure: polylineFigure(ys),
        };
      },
    },
  ],
};

/** LimitDerivative is a limit that is the derivative of a function at a point. */
interface LimitDerivative {
  readonly f: Text;
  readonly limit: string;
  readonly value: string;
  readonly wrong: readonly string[];
}

/** limitDerivative chooses a function and a point and writes the difference quotient. */
function limitDerivative(rng: Rng): LimitDerivative {
  const kind = rng.int(0, 4);
  if (kind === 0) {
    const a = rng.int(1, 4);
    return {
      f: t(`$f(x) = e^{x}$ at $a = ${a}$`, `$f(x) = e^{x}$，$a = ${a}$`),
      limit: `${lim(0, undefined, "h")} \\frac{e^{${a} + h} - e^{${a}}}{h}`,
      value: `e^{${a}}`,
      wrong: ["1", "0", a === 1 ? "e^{0}" : a === 2 ? "2e" : `${a}e^{${a - 1}}`],
    };
  }
  if (kind === 1) {
    const [x0, sin, cos] = rng.pick([
      ["\\frac{\\pi}{6}", "\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}"],
      ["\\frac{\\pi}{3}", "\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}"],
      ["\\frac{\\pi}{4}", "\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}"],
      ["\\pi", "0", "-1"],
    ] as const);
    const cosine = rng.bool();
    return {
      f: t(`$f(x) = ${cosine ? "\\cos" : "\\sin"} x$ at $a = ${x0}$`, `$f(x) = ${cosine ? "\\cos" : "\\sin"} x$，$a = ${x0}$`),
      limit: `${lim(0, undefined, "h")} \\frac{${cosine ? "\\cos" : "\\sin"}\\left(${x0} + h\\right) - ${cosine ? "\\cos" : "\\sin"}${x0}}{h}`,
      value: cosine ? (sin === "0" ? "0" : `-${sin}`) : cos,
      wrong: cosine ? [cos, sin] : [sin, cos === "-1" ? "1" : `-${cos}`],
    };
  }
  if (kind === 2) {
    const a = rng.int(2, 9);
    return {
      f: t(`$f(x) = \\ln x$ at $a = ${a}$`, `$f(x) = \\ln x$，$a = ${a}$`),
      limit: `${lim(0, undefined, "h")} \\frac{\\ln(${a} + h) - \\ln ${a}}{h}`,
      value: `\\frac{1}{${a}}`,
      wrong: [`\\ln ${a}`, String(a), "1"],
    };
  }
  if (kind === 3) {
    const n = rng.int(2, 6);
    return {
      f: t(`$f(x) = \\sqrt{x}$ at $a = ${n * n}$`, `$f(x) = \\sqrt{x}$，$a = ${n * n}$`),
      limit: `${lim(n * n)} \\frac{\\sqrt{x} - ${n}}{x - ${n * n}}`,
      value: `\\frac{1}{${2 * n}}`,
      wrong: [String(n), `\\frac{1}{${n}}`, `${2 * n}`],
    };
  }
  const a = rng.pick([2, 3, 4, 5]);
  return {
    f: t(`$f(x) = \\frac{1}{x}$ at $a = ${a}$`, `$f(x) = \\frac{1}{x}$，$a = ${a}$`),
    limit: `${lim(a)} \\frac{\\frac{1}{x} - \\frac{1}{${a}}}{x - ${a}}`,
    value: `-\\frac{1}{${a * a}}`,
    wrong: [`\\frac{1}{${a * a}}`, `\\frac{1}{${a}}`, `-\\frac{1}{${a}}`],
  };
}

/** recognizingDerivativesInLimits evaluates limits that are derivatives. */
export const recognizingDerivativesInLimits: TopicDef = {
  id: "recognizing-derivatives-in-limits",
  title: t("Recognizing Derivatives in Limits", "识别极限中的导数"),
  summary: t(
    "Recognize a limit as the derivative of a function at a point, and evaluate it by differentiating.",
    "把极限识别为某函数在某点处的导数，并通过求导计算极限。",
  ),
  prerequisites: ["differentiating-logarithmic-functions", "differentiating-trigonometric-functions"],
  encompasses: [
    { topic: "defining-the-derivative-using-derivative-notation", weight: 0.4 },
    { topic: "differentiating-trigonometric-functions", weight: 0.1 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-that-are-derivatives-of-powers",
      title: t("Limits that are derivatives of powers", "幂函数导数形式的极限"),
      explanation: t(
        "Both\n\n$$\\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h} \\quad\\text{and}\\quad \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}$$\n\nequal $f'(a)$. So $\\lim_{h \\to 0} \\frac{(2 + h)^{5} - 32}{h}$ is the derivative of $x^{5}$ at $2$: $5 \\cdot 2^{4} = 80$, with no expanding needed.",
        "下面两个极限\n\n$$\\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h} \\quad\\text{和}\\quad \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}$$\n\n都等于 $f'(a)$。所以 $\\lim_{h \\to 0} \\frac{(2 + h)^{5} - 32}{h}$ 就是 $x^{5}$ 在 $2$ 处的导数：$5 \\cdot 2^{4} = 80$，不必展开。",
      ),
      generate(rng) {
        const n = rng.int(3, 8);
        const a = rng.pick(n <= 5 ? [-3, -2, -1, 1, 2, 3] : [-2, -1, 1, 2]);
        const an = a ** n;
        const answer = n * a ** (n - 1);
        const hForm = rng.bool();
        const limit = hForm
          ? `${lim(0, undefined, "h")} \\frac{(${a} + h)^{${n}} ${an < 0 ? "+" : "-"} ${Math.abs(an)}}{h}`
          : `${lim(a)} \\frac{x^{${n}} ${an < 0 ? "+" : "-"} ${Math.abs(an)}}{x ${a < 0 ? "+" : "-"} ${Math.abs(a)}}`;
        return numberProblem({
          prompt: t(`Evaluate $${limit}$.`, `求 $${limit}$。`),
          answer,
          wrong: [an, n * an, 0, (n - 1) * a ** n],
          solution: t(
            `This is the definition of $f'(${a})$ for $f(x) = x^{${n}}$. Since $f'(x) = ${n}x^{${n - 1}}$, the limit is $${n} \\cdot ${par(a)}^{${n - 1}} = ${answer}$.`,
            `这正是 $f(x) = x^{${n}}$ 在 $${a}$ 处导数 $f'(${a})$ 的定义。因为 $f'(x) = ${n}x^{${n - 1}}$，所以极限为 $${n} \\cdot ${par(a)}^{${n - 1}} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "identifying-the-function-and-the-point",
      title: t("Identifying the function and the point", "识别函数与点"),
      explanation: t(
        "To evaluate a limit of a difference quotient, match it to $\\frac{f(a + h) - f(a)}{h}$ or $\\frac{f(x) - f(a)}{x - a}$ to find $f$ and $a$, then compute $f'(a)$. For example, $\\lim_{h \\to 0} \\frac{\\ln(3 + h) - \\ln 3}{h}$ is $f'(3)$ for $f(x) = \\ln x$, which is $\\frac{1}{3}$.",
        "计算差商的极限时，把它与 $\\frac{f(a + h) - f(a)}{h}$ 或 $\\frac{f(x) - f(a)}{x - a}$ 对照，找出 $f$ 和 $a$，再计算 $f'(a)$。例如 $\\lim_{h \\to 0} \\frac{\\ln(3 + h) - \\ln 3}{h}$ 是 $f(x) = \\ln x$ 的 $f'(3)$，等于 $\\frac{1}{3}$。",
      ),
      generate(rng) {
        const d = limitDerivative(rng);
        return functionProblem({
          prompt: t(`Evaluate $${d.limit}$.`, `求 $${d.limit}$。`),
          answer: d.value,
          wrong: [...d.wrong],
          solution: t(
            `The limit is $f'(a)$ for ${d.f.en}, so it equals $${d.value}$.`,
            `这个极限是 $f'(a)$，其中 ${d.f["zh-CN"]}，所以它等于 $${d.value}$。`,
          ),
        });
      },
    },
    {
      id: "naming-the-function-and-the-point",
      title: t("Naming the function and the point", "指出函数与点"),
      explanation: t(
        "A limit of a difference quotient names a function $f$ and a point $a$. In $\\lim_{h \\to 0} \\frac{e^{2 + h} - e^{2}}{h}$, the function is $e^{x}$ and the point is $2$.",
        "差商的极限对应一个函数 $f$ 和一个点 $a$。在 $\\lim_{h \\to 0} \\frac{e^{2 + h} - e^{2}}{h}$ 中，函数是 $e^{x}$，点是 $2$。",
      ),
      generate(rng) {
        const d = limitDerivative(rng);
        const others: Text[] = [];
        for (let i = 0; others.length < 3 && i < 50; i++) {
          const o = limitDerivative(rng).f;
          if (o.en !== d.f.en && !others.some((x) => x.en === o.en)) others.push(o);
        }
        return oneOf(
          rng,
          t(
            `The limit $${d.limit}$ is the derivative $f'(a)$ for which function and point?`,
            `极限 $${d.limit}$ 是哪个函数在哪一点处的导数 $f'(a)$？`,
          ),
          d.f,
          others,
          t(`Matching the limit to the definition of the derivative gives ${d.f.en}.`, `把极限与导数的定义对照，得 ${d.f["zh-CN"]}。`),
        );
      },
    },
  ],
};

/** calculusIDerivativeRuleTopics are the topics of Calculus I module 4.10. */
export const calculusIDerivativeRuleTopics: readonly TopicDef[] = [
  differentiatingExponentialFunctions,
  differentiatingLogarithmicFunctions,
  differentiatingTrigonometricFunctions,
  differentiatingHyperbolicFunctions,
  differentiatingReciprocalHyperbolicFunctions,
  secondAndHigherOrderDerivatives,
  theProductRuleForDifferentiation,
  theQuotientRuleForDifferentiation,
  differentiatingReciprocalTrigonometricFunctions,
  calculatingDerivativesFromDataAndTables,
  calculatingDerivativesFromGraphs,
  recognizingDerivativesInLimits,
];
