import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { calculusDrawings4 } from "../explanation-drawings-calculus-4.ts";
import { say, steps } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { oneOf, power } from "./calculus-common.ts";
import { functionWith, type Said, type Step, walked } from "./calculus-i-differentiation.ts";
import { coef, fracWith, plusC, xPow } from "./calculus-ii-substitution.ts";

// Calculus II unit 1: Integration Techniques, modules 1.3–1.5.

/** fn writes a function of ax: "\sin x", "\cos(3x)". */
export const fn = (f: string, a: number) => (a === 1 ? `${f} x` : `${f}(${a}x)`);

/** fracTerm writes c·top/den with the sign in front: "\frac{x}{4}", "-\frac{3\ln x}{2x^{2}}". */
export const fracTerm = (c: Q, top: string, den: string) =>
  `${c.sign() < 0 ? "-" : ""}\\frac{${c.abs().n === 1n ? top || "1" : `${c.abs().n}${top}`}}{${c.d === 1n ? "" : c.d}${den}}`;

/** joinTerms joins signed terms into a sum: ["x", "-2y"] gives "x - 2y". */
export const joinTerms = (terms: readonly string[]) =>
  terms.filter((s) => s !== "").reduce((out, s, i) => (i === 0 ? s : s.startsWith("-") ? `${out} - ${s.slice(1)}` : `${out} + ${s}`), "");

/** withC ends a sum of terms in "+ C". */
export const withC = (...terms: readonly string[]) => `${joinTerms(terms) || "0"} + C`;

/** Case is one integral worked in labelled steps, with a check by differentiating and the typical mistakes, each with what to say about it. */
interface Case {
  readonly integrand: string;
  readonly answer: string;
  readonly steps: readonly Step[];
  readonly check: Text;
  readonly mistakes: readonly Said[];
  /** positive says that the prompt restricts x to x > 0. */
  readonly positive?: boolean;
}

/** fromCase builds an integration problem from a case. */
function fromCase(c: Case): Problem {
  return functionWith(
    {
      prompt: t(
        `Find $\\int ${c.integrand} \\, dx$${c.positive ? " for $x > 0$" : ""}.`,
        `${c.positive ? "当 $x > 0$ 时，" : ""}求 $\\int ${c.integrand} \\, dx$。`,
      ),
      answer: c.answer,
      antiderivative: true,
      solution: walked(c.steps, c.check),
    },
    c.mistakes,
  );
}

/** noC drops the constant of integration from an antiderivative. */
const noC = (answer: string) => answer.replace(/ \+ C$/, "");

/** differentiated checks an antiderivative by differentiating it back to the integrand, naming the rule it uses. */
const differentiated = (lines: readonly string[], using?: readonly [string, string]) =>
  t(
    `Differentiate the answer${using ? `, using ${using[0]}` : ""}:${steps(...lines)}This is the integrand.`,
    `${using ? `利用${using[1]}，` : ""}对答案求导：${steps(...lines)}这正是被积函数。`,
  );

/** derivativeOf writes the line that opens a check: "\frac{d}{dx}\left(F\right) = …". */
const derivativeOf = (answer: string, rest: string) => `\\frac{d}{dx}\\left(${noC(answer)}\\right) = ${rest}`;

/** scaledBy is the step that multiplies a worked integral by k, left out when k is 1. */
const scaledBy = (k: number, integrand: string, answer: string): Step[] =>
  k === 1
    ? []
    : [[["Multiply by the constant", "乘以常数"], t(`Multiply by $${k}$:`, `乘以 $${k}$：`), [`\\int ${integrand} \\, dx = ${answer}`]]];

/** byFactors is the reason for integrating a product factor by factor. */
const byFactors = (response: string) =>
  say(
    response,
    "This integrates each factor separately and multiplies the results, but a product cannot be integrated factor by factor.",
    "这是把各个因子分别积分再相乘，但乘积不能逐个因子积分。",
  );

/** integrationUsingBasicTrigonometricIdentities rewrites integrands with the quotient and reciprocal identities. */
export const integrationUsingBasicTrigonometricIdentities: TopicDef = {
  id: "integration-using-basic-trigonometric-identities",
  title: t("Integration Using Basic Trigonometric Identities", "用基本三角恒等式积分"),
  summary: t(
    "Rewrite integrands with the quotient and reciprocal identities to reach standard integrals.",
    "用商数关系与倒数关系改写被积函数，化为标准积分。",
  ),
  intro: t(
    "The integrand $\\frac{\\sin x}{\\cos^{2} x}$ matches no rule as written. Split it as $\\frac{1}{\\cos x} \\cdot \\frac{\\sin x}{\\cos x} = \\sec x\\tan x$, which is the derivative of $\\sec x$:\n\n$$\\int \\frac{\\sin x}{\\cos^{2} x} \\, dx = \\sec x + C.$$\n\nCheck: at $x = 0$ the integrand is $0$, and $\\sec x$ has its lowest point at $x = 0$, so its slope there is $0$ too.\n\nIn this lesson we rewrite integrands with the reciprocal and quotient identities, and expand products and split quotients, until every term is a derivative we know.",
    "被积函数 $\\frac{\\sin x}{\\cos^{2} x}$ 原样看不出用哪条公式。把它拆成 $\\frac{1}{\\cos x} \\cdot \\frac{\\sin x}{\\cos x} = \\sec x\\tan x$，这正是 $\\sec x$ 的导数：\n\n$$\\int \\frac{\\sin x}{\\cos^{2} x} \\, dx = \\sec x + C$$\n\n检验：在 $x = 0$ 处被积函数为 $0$，而 $\\sec x$ 在 $x = 0$ 处取最小值，所以那里的斜率也是 $0$。\n\n本课我们用倒数关系与商数关系改写被积函数，并展开乘积、拆开商，直到每一项都是已知的导数。",
  ),
  prerequisites: ["integrating-trigonometric-functions-using-substitution"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rewriting-with-reciprocal-and-quotient-identities",
      title: t("Rewriting with reciprocal and quotient identities", "用倒数关系与商数关系改写"),
      explanation: t(
        "Rewriting the integrand in sine and cosine, or the other way round, often reveals a derivative you already know. Use $\\sec x = \\frac{1}{\\cos x}$, $\\csc x = \\frac{1}{\\sin x}$, $\\tan x = \\frac{\\sin x}{\\cos x}$ and $\\cot x = \\frac{\\cos x}{\\sin x}$. For example,\n\n$$\\int \\frac{1}{\\sin^{2} x} \\, dx = \\int \\csc^{2} x \\, dx = -\\cot x + C.$$\n\nCheck: the derivative of $-\\cot x$ is $\\csc^{2} x$, which is $\\frac{1}{\\sin^{2} x}$.\n\n> **Watch out.** The cofunctions carry minus signs: $\\frac{d}{dx}\\cot x = -\\csc^{2} x$ and $\\frac{d}{dx}\\csc x = -\\csc x\\cot x$, so their integrals come out negative.",
        "把被积函数改写成正弦和余弦，或者反过来，常常会出现已经认识的导数。利用 $\\sec x = \\frac{1}{\\cos x}$、$\\csc x = \\frac{1}{\\sin x}$、$\\tan x = \\frac{\\sin x}{\\cos x}$、$\\cot x = \\frac{\\cos x}{\\sin x}$。例如\n\n$$\\int \\frac{1}{\\sin^{2} x} \\, dx = \\int \\csc^{2} x \\, dx = -\\cot x + C$$\n\n检验：$-\\cot x$ 的导数是 $\\csc^{2} x$，即 $\\frac{1}{\\sin^{2} x}$。\n\n> **注意。** 余函数带负号：$\\frac{d}{dx}\\cot x = -\\csc^{2} x$，$\\frac{d}{dx}\\csc x = -\\csc x\\cot x$，所以它们对应的积分是负的。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const K = coef(Q.of(k));
        const one = (den: string) => fracWith(k, "", den).replace("\\frac{}", "\\frac{1}");
        const make = (
          integrand: string,
          answer: string,
          rewrite: readonly [string, string],
          lines: readonly string[],
          rule: readonly [string, string],
          derivative: string,
          mistakes: readonly Said[],
        ): Case => ({
          integrand,
          answer,
          steps: [
            [["Rewrite with the identities", "用恒等式改写"], t(rewrite[0], rewrite[1]), lines],
            [["Integrate", "积分"], t(rule[0], rule[1]), [`\\int ${integrand} \\, dx = ${answer}`]],
          ],
          check: differentiated([derivativeOf(answer, `${derivative} = ${integrand}`)]),
          mistakes,
        });
        const cases: Case[] = [
          make(
            fracWith(k, "\\sin x", "\\cos^{2} x"),
            plusC([k, "\\sec x"]),
            ["Split off one cosine:", "拆出一个余弦："],
            ["\\frac{\\sin x}{\\cos^{2} x} = \\frac{1}{\\cos x} \\cdot \\frac{\\sin x}{\\cos x} = \\sec x\\tan x"],
            ["$\\sec x\\tan x$ is the derivative of $\\sec x$:", "$\\sec x\\tan x$ 是 $\\sec x$ 的导数："],
            `${K}\\sec x\\tan x`,
            [
              say(
                plusC([-k, "\\sec x"]),
                "The derivative of $\\sec x$ is $+\\sec x\\tan x$; there is no minus sign here, unlike for $\\csc x$.",
                "$\\sec x$ 的导数是 $+\\sec x\\tan x$，这里没有负号，与 $\\csc x$ 不同。",
              ),
              say(
                plusC([k, "\\tan x"]),
                "$\\tan x$ has derivative $\\sec^{2} x = \\frac{1}{\\cos^{2} x}$, which lacks the factor $\\sin x$ on top.",
                "$\\tan x$ 的导数是 $\\sec^{2} x = \\frac{1}{\\cos^{2} x}$，分子上少了因子 $\\sin x$。",
              ),
              say(
                plusC([-k, "\\ln|\\cos x|"]),
                "That integrates $\\tan x = \\frac{\\sin x}{\\cos x}$; the denominator here is $\\cos^{2} x$, not $\\cos x$.",
                "这是 $\\tan x = \\frac{\\sin x}{\\cos x}$ 的积分；这里的分母是 $\\cos^{2} x$，不是 $\\cos x$。",
              ),
            ],
          ),
          make(
            fracWith(k, "\\cos x", "\\sin^{2} x"),
            plusC([-k, "\\csc x"]),
            ["Split off one sine:", "拆出一个正弦："],
            ["\\frac{\\cos x}{\\sin^{2} x} = \\frac{1}{\\sin x} \\cdot \\frac{\\cos x}{\\sin x} = \\csc x\\cot x"],
            [
              "Since $\\frac{d}{dx}\\csc x = -\\csc x\\cot x$, the integral of $\\csc x\\cot x$ is $-\\csc x$:",
              "由于 $\\frac{d}{dx}\\csc x = -\\csc x\\cot x$，$\\csc x\\cot x$ 的积分是 $-\\csc x$：",
            ],
            `${K}\\csc x\\cot x`,
            [
              say(
                plusC([k, "\\csc x"]),
                "The derivative of $\\csc x$ is $-\\csc x\\cot x$, so integrating $\\csc x\\cot x$ gives $-\\csc x$; the minus sign is missing.",
                "$\\csc x$ 的导数是 $-\\csc x\\cot x$，所以 $\\csc x\\cot x$ 的积分是 $-\\csc x$；这里漏了负号。",
              ),
              say(
                plusC([-k, "\\cot x"]),
                "$-\\cot x$ has derivative $\\csc^{2} x = \\frac{1}{\\sin^{2} x}$, which lacks the factor $\\cos x$ on top.",
                "$-\\cot x$ 的导数是 $\\csc^{2} x = \\frac{1}{\\sin^{2} x}$，分子上少了因子 $\\cos x$。",
              ),
              say(
                plusC([k, "\\cot x"]),
                "$\\cot x = \\frac{\\cos x}{\\sin x}$ resembles the integrand, but its derivative is $-\\csc^{2} x$, not $\\csc x\\cot x$.",
                "$\\cot x = \\frac{\\cos x}{\\sin x}$ 看起来像被积函数，但它的导数是 $-\\csc^{2} x$，不是 $\\csc x\\cot x$。",
              ),
            ],
          ),
          make(
            one("\\cos^{2} x"),
            plusC([k, "\\tan x"]),
            ["Write the reciprocal as a secant:", "把倒数写成正割："],
            ["\\frac{1}{\\cos^{2} x} = \\sec^{2} x"],
            ["$\\sec^{2} x$ is the derivative of $\\tan x$:", "$\\sec^{2} x$ 是 $\\tan x$ 的导数："],
            `${K}\\sec^{2} x`,
            [
              say(
                plusC([-k, "\\tan x"]),
                "The derivative of $\\tan x$ is $+\\sec^{2} x$, so no minus sign appears.",
                "$\\tan x$ 的导数是 $+\\sec^{2} x$，所以不出现负号。",
              ),
              say(
                plusC([k, "\\sec x"]),
                "The derivative of $\\sec x$ is $\\sec x\\tan x$, not $\\sec^{2} x$.",
                "$\\sec x$ 的导数是 $\\sec x\\tan x$，不是 $\\sec^{2} x$。",
              ),
              say(
                plusC([-k, "\\cot x"]),
                "$-\\cot x$ integrates $\\csc^{2} x = \\frac{1}{\\sin^{2} x}$; the denominator here is a cosine.",
                "$-\\cot x$ 是 $\\csc^{2} x = \\frac{1}{\\sin^{2} x}$ 的积分；这里的分母是余弦。",
              ),
            ],
          ),
          make(
            one("\\sin^{2} x"),
            plusC([-k, "\\cot x"]),
            ["Write the reciprocal as a cosecant:", "把倒数写成余割："],
            ["\\frac{1}{\\sin^{2} x} = \\csc^{2} x"],
            [
              "Since $\\frac{d}{dx}\\cot x = -\\csc^{2} x$, the integral of $\\csc^{2} x$ is $-\\cot x$:",
              "由于 $\\frac{d}{dx}\\cot x = -\\csc^{2} x$，$\\csc^{2} x$ 的积分是 $-\\cot x$：",
            ],
            `${K}\\csc^{2} x`,
            [
              say(
                plusC([k, "\\cot x"]),
                "The derivative of $\\cot x$ is $-\\csc^{2} x$, so the integral of $\\csc^{2} x$ is $-\\cot x$; the minus sign is missing.",
                "$\\cot x$ 的导数是 $-\\csc^{2} x$，所以 $\\csc^{2} x$ 的积分是 $-\\cot x$；这里漏了负号。",
              ),
              say(
                plusC([-k, "\\csc x"]),
                "The derivative of $-\\csc x$ is $\\csc x\\cot x$, not $\\csc^{2} x$.",
                "$-\\csc x$ 的导数是 $\\csc x\\cot x$，不是 $\\csc^{2} x$。",
              ),
              say(
                plusC([k, "\\tan x"]),
                "$\\tan x$ integrates $\\sec^{2} x = \\frac{1}{\\cos^{2} x}$; the denominator here is a sine.",
                "$\\tan x$ 是 $\\sec^{2} x = \\frac{1}{\\cos^{2} x}$ 的积分；这里的分母是正弦。",
              ),
            ],
          ),
          make(
            `${K}\\tan x\\cos x`,
            plusC([-k, "\\cos x"]),
            ["Write the tangent as a quotient:", "把正切写成商："],
            ["\\tan x\\cos x = \\frac{\\sin x}{\\cos x} \\cdot \\cos x = \\sin x"],
            ["The integral of $\\sin x$ is $-\\cos x$:", "$\\sin x$ 的积分是 $-\\cos x$："],
            `${K}\\sin x`,
            [
              say(
                plusC([k, "\\cos x"]),
                "The derivative of $\\cos x$ is $-\\sin x$, so the integral of $\\sin x$ is $-\\cos x$.",
                "$\\cos x$ 的导数是 $-\\sin x$，所以 $\\sin x$ 的积分是 $-\\cos x$。",
              ),
              say(
                plusC([k, "\\sec x"]),
                "$\\sec x$ has derivative $\\sec x\\tan x = \\frac{\\sin x}{\\cos^{2} x}$, not $\\sin x$; simplify $\\tan x\\cos x$ first.",
                "$\\sec x$ 的导数是 $\\sec x\\tan x = \\frac{\\sin x}{\\cos^{2} x}$，不是 $\\sin x$；应先化简 $\\tan x\\cos x$。",
              ),
              byFactors(plusC([k, "\\tan x\\sin x"])),
            ],
          ),
          make(
            `${K}\\cot x\\sin x`,
            plusC([k, "\\sin x"]),
            ["Write the cotangent as a quotient:", "把余切写成商："],
            ["\\cot x\\sin x = \\frac{\\cos x}{\\sin x} \\cdot \\sin x = \\cos x"],
            ["The integral of $\\cos x$ is $\\sin x$:", "$\\cos x$ 的积分是 $\\sin x$："],
            `${K}\\cos x`,
            [
              say(
                plusC([-k, "\\sin x"]),
                "The integral of $\\cos x$ is $+\\sin x$; the minus sign belongs to the integral of $\\sin x$.",
                "$\\cos x$ 的积分是 $+\\sin x$；负号属于 $\\sin x$ 的积分。",
              ),
              say(
                plusC([-k, "\\csc x"]),
                "$-\\csc x$ has derivative $\\csc x\\cot x = \\frac{\\cos x}{\\sin^{2} x}$, not $\\cos x$; simplify $\\cot x\\sin x$ first.",
                "$-\\csc x$ 的导数是 $\\csc x\\cot x = \\frac{\\cos x}{\\sin^{2} x}$，不是 $\\cos x$；应先化简 $\\cot x\\sin x$。",
              ),
              byFactors(plusC([k, "\\cot x\\cos x"])),
            ],
          ),
        ];
        return fromCase(rng.pick(cases));
      },
    },
    {
      id: "expanding-products-with-reciprocal-functions",
      title: t("Expanding products with reciprocal functions", "展开含倒数函数的乘积"),
      explanation: t(
        "After expanding a product or splitting a quotient over its denominator, each term should be a derivative you know, such as $\\sec^{2} x$ or $\\sec x\\tan x$. For example,\n\n$$\\int \\sec x(\\sec x + \\tan x) \\, dx = \\int (\\sec^{2} x + \\sec x\\tan x) \\, dx = \\tan x + \\sec x + C.$$\n\nA quotient splits the same way: $\\frac{\\sin x + \\cos x}{\\cos x} = \\tan x + 1$, which integrates to $-\\ln|\\cos x| + x + C$.\n\nCheck: the derivative of $\\tan x + \\sec x$ is $\\sec^{2} x + \\sec x\\tan x$, which factors back into $\\sec x(\\sec x + \\tan x)$.\n\n> **Watch out.** Do not integrate a product factor by factor: $\\int \\sec x(\\sec x + \\tan x) \\, dx$ is not $\\int \\sec x \\, dx$ times $\\int (\\sec x + \\tan x) \\, dx$. Expand first.",
        "把乘积展开或把商按分母拆开之后，每一项都应是已知的导数，例如 $\\sec^{2} x$ 或 $\\sec x\\tan x$。例如\n\n$$\\int \\sec x(\\sec x + \\tan x) \\, dx = \\int (\\sec^{2} x + \\sec x\\tan x) \\, dx = \\tan x + \\sec x + C$$\n\n商也可以这样拆：$\\frac{\\sin x + \\cos x}{\\cos x} = \\tan x + 1$，积分得 $-\\ln|\\cos x| + x + C$。\n\n检验：$\\tan x + \\sec x$ 的导数是 $\\sec^{2} x + \\sec x\\tan x$，提取公因式又回到 $\\sec x(\\sec x + \\tan x)$。\n\n> **注意。** 不要逐个因子积分：$\\int \\sec x(\\sec x + \\tan x) \\, dx$ 不等于 $\\int \\sec x \\, dx$ 乘以 $\\int (\\sec x + \\tan x) \\, dx$。要先展开。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const K = coef(Q.of(k));
        const make = (
          integrand: string,
          answer: string,
          first: readonly [string, string, string, string],
          expanded: string,
          rule: readonly [string, string],
          derivative: string,
          using: readonly [string, string] | undefined,
          mistakes: readonly Said[],
        ): Case => ({
          integrand,
          answer,
          steps: [
            [[first[0], first[1]], t(first[2], first[3]), [`${integrand} = ${expanded}`]],
            [["Integrate term by term", "逐项积分"], t(rule[0], rule[1]), [`\\int ${integrand} \\, dx = ${answer}`]],
          ],
          check: differentiated([derivativeOf(answer, `${derivative} = ${expanded}`)], using),
          mistakes,
        });
        const cases: Case[] = [
          make(
            `${K}\\sec x(\\sec x + \\tan x)`,
            plusC([k, "\\tan x"], [k, "\\sec x"]),
            ["Expand the product", "展开乘积", "Multiply out the bracket:", "把括号乘开："],
            poly([k, "\\sec^{2} x"], [k, "\\sec x\\tan x"]),
            [
              "$\\sec^{2} x$ is the derivative of $\\tan x$, and $\\sec x\\tan x$ is the derivative of $\\sec x$:",
              "$\\sec^{2} x$ 是 $\\tan x$ 的导数，$\\sec x\\tan x$ 是 $\\sec x$ 的导数：",
            ],
            poly([k, "\\sec^{2} x"], [k, "\\sec x\\tan x"]),
            undefined,
            [
              say(
                plusC([k, "\\tan x"], [-k, "\\sec x"]),
                "The derivative of $\\sec x$ is $+\\sec x\\tan x$, so the second term keeps the sign of the first.",
                "$\\sec x$ 的导数是 $+\\sec x\\tan x$，所以第二项与第一项同号。",
              ),
              say(
                plusC([k, "\\sec^{2} x"]),
                "$\\sec^{2} x$ is a term of the expanded integrand, not an antiderivative; its derivative is $2\\sec^{2} x\\tan x$.",
                "$\\sec^{2} x$ 是展开后被积函数中的一项，不是原函数；它的导数是 $2\\sec^{2} x\\tan x$。",
              ),
              say(
                plusC([k, "\\tan x"]),
                "This integrates only the $\\sec^{2} x$ term; the term $\\sec x\\tan x$ contributes $\\sec x$ as well.",
                "这里只积分了 $\\sec^{2} x$ 一项；$\\sec x\\tan x$ 一项还要贡献 $\\sec x$。",
              ),
            ],
          ),
          make(
            `${K}\\csc x(\\csc x - \\cot x)`,
            plusC([-k, "\\cot x"], [k, "\\csc x"]),
            ["Expand the product", "展开乘积", "Multiply out the bracket:", "把括号乘开："],
            poly([k, "\\csc^{2} x"], [-k, "\\csc x\\cot x"]),
            [
              "$\\int \\csc^{2} x \\, dx = -\\cot x$ and $\\int \\csc x\\cot x \\, dx = -\\csc x$, so the second term, which carries a minus sign, gives $+\\csc x$:",
              "$\\int \\csc^{2} x \\, dx = -\\cot x$，$\\int \\csc x\\cot x \\, dx = -\\csc x$，所以带负号的第二项积分得 $+\\csc x$：",
            ],
            poly([k, "\\csc^{2} x"], [-k, "\\csc x\\cot x"]),
            undefined,
            [
              say(
                plusC([k, "\\cot x"], [-k, "\\csc x"]),
                "Both signs are flipped: the derivatives of $\\cot x$ and $\\csc x$ are negative, so $\\int \\csc^{2} x \\, dx = -\\cot x$ and $-\\int \\csc x\\cot x \\, dx = +\\csc x$.",
                "两个符号都反了：$\\cot x$ 与 $\\csc x$ 的导数都是负的，所以 $\\int \\csc^{2} x \\, dx = -\\cot x$，$-\\int \\csc x\\cot x \\, dx = +\\csc x$。",
              ),
              say(
                plusC([-k, "\\cot x"], [-k, "\\csc x"]),
                "The second term is $-\\csc x\\cot x$, and $\\int \\csc x\\cot x \\, dx = -\\csc x$, so the two minus signs make $+\\csc x$.",
                "第二项是 $-\\csc x\\cot x$，而 $\\int \\csc x\\cot x \\, dx = -\\csc x$，两个负号相乘得 $+\\csc x$。",
              ),
              say(
                plusC([k, "\\csc^{2} x"]),
                "$\\csc^{2} x$ is a term of the expanded integrand, not an antiderivative; its derivative is $-2\\csc^{2} x\\cot x$.",
                "$\\csc^{2} x$ 是展开后被积函数中的一项，不是原函数；它的导数是 $-2\\csc^{2} x\\cot x$。",
              ),
            ],
          ),
          make(
            fracWith(k, "(\\sin x + \\cos x)", "\\cos x"),
            plusC([-k, "\\ln|\\cos x|"], [k, "x"]),
            ["Split the quotient", "拆开商", "Divide each term of the top by $\\cos x$:", "把分子的每一项分别除以 $\\cos x$："],
            poly([k, "\\tan x"], [k, ""]),
            [
              "$\\int \\tan x \\, dx = -\\ln|\\cos x|$ and $\\int 1 \\, dx = x$:",
              "$\\int \\tan x \\, dx = -\\ln|\\cos x|$，$\\int 1 \\, dx = x$：",
            ],
            poly([k, "\\tan x"], [k, ""]),
            [
              "$\\frac{d}{dx}\\ln|\\cos x| = \\frac{-\\sin x}{\\cos x} = -\\tan x$",
              "$\\frac{d}{dx}\\ln|\\cos x| = \\frac{-\\sin x}{\\cos x} = -\\tan x$",
            ],
            [
              say(
                plusC([k, "\\ln|\\cos x|"], [k, "x"]),
                "$\\int \\tan x \\, dx$ is $-\\ln|\\cos x|$, because the derivative of $\\ln|\\cos x|$ is $-\\tan x$; the minus sign is missing.",
                "$\\int \\tan x \\, dx$ 是 $-\\ln|\\cos x|$，因为 $\\ln|\\cos x|$ 的导数是 $-\\tan x$；这里漏了负号。",
              ),
              say(
                plusC([-k, "\\ln|\\cos x|"]),
                "This integrates only the $\\tan x$ term; the $1$ from $\\frac{\\cos x}{\\cos x}$ adds $x$.",
                "这里只积分了 $\\tan x$ 一项；$\\frac{\\cos x}{\\cos x}$ 得到的 $1$ 还要积分出 $x$。",
              ),
              say(
                plusC([k, "\\sec^{2} x"], [k, "x"]),
                "$\\sec^{2} x$ is the derivative of $\\tan x$, not its integral; the integral of $\\tan x$ is $-\\ln|\\cos x|$.",
                "$\\sec^{2} x$ 是 $\\tan x$ 的导数，不是它的积分；$\\tan x$ 的积分是 $-\\ln|\\cos x|$。",
              ),
            ],
          ),
          make(
            fracWith(k, "(\\cos x + \\sin x)", "\\sin x"),
            plusC([k, "\\ln|\\sin x|"], [k, "x"]),
            ["Split the quotient", "拆开商", "Divide each term of the top by $\\sin x$:", "把分子的每一项分别除以 $\\sin x$："],
            poly([k, "\\cot x"], [k, ""]),
            [
              "$\\int \\cot x \\, dx = \\ln|\\sin x|$ and $\\int 1 \\, dx = x$:",
              "$\\int \\cot x \\, dx = \\ln|\\sin x|$，$\\int 1 \\, dx = x$：",
            ],
            poly([k, "\\cot x"], [k, ""]),
            [
              "$\\frac{d}{dx}\\ln|\\sin x| = \\frac{\\cos x}{\\sin x} = \\cot x$",
              "$\\frac{d}{dx}\\ln|\\sin x| = \\frac{\\cos x}{\\sin x} = \\cot x$",
            ],
            [
              say(
                plusC([-k, "\\ln|\\sin x|"], [k, "x"]),
                "$\\int \\cot x \\, dx$ is $+\\ln|\\sin x|$, because the derivative of $\\ln|\\sin x|$ is $\\frac{\\cos x}{\\sin x}$; there is no minus sign.",
                "$\\int \\cot x \\, dx$ 是 $+\\ln|\\sin x|$，因为 $\\ln|\\sin x|$ 的导数是 $\\frac{\\cos x}{\\sin x}$；没有负号。",
              ),
              say(
                plusC([k, "\\ln|\\sin x|"]),
                "This integrates only the $\\cot x$ term; the $1$ from $\\frac{\\sin x}{\\sin x}$ adds $x$.",
                "这里只积分了 $\\cot x$ 一项；$\\frac{\\sin x}{\\sin x}$ 得到的 $1$ 还要积分出 $x$。",
              ),
              say(
                plusC([-k, "\\csc^{2} x"], [k, "x"]),
                "$-\\csc^{2} x$ is the derivative of $\\cot x$, not its integral; the integral of $\\cot x$ is $\\ln|\\sin x|$.",
                "$-\\csc^{2} x$ 是 $\\cot x$ 的导数，不是它的积分；$\\cot x$ 的积分是 $\\ln|\\sin x|$。",
              ),
            ],
          ),
        ];
        return fromCase(rng.pick(cases));
      },
    },
  ],
};

/** powerRule is the reason for applying the power rule to a function of x as if it were x. */
const powerRule = (response: string, f: string, extra: string) =>
  say(
    response,
    `This treats $${f}$ like $x$ in the power rule; differentiating it back brings out an extra factor $${extra}$ by the chain rule.`,
    `这是把 $${f}$ 当作 $x$ 用幂法则；求导验证时，链式法则会多出因子 $${extra}$。`,
  );

/** substituted works an odd power: save one factor, convert the rest, substitute, and return to x. */
function substituted(
  integrand: string,
  answer: string,
  save: readonly [string, string, string],
  sub: readonly [string, string, string],
  derivative: readonly string[],
  mistakes: readonly Said[],
): Case {
  return {
    integrand,
    answer,
    steps: [
      [["Save one factor", "留出一个因子"], t(save[0], save[1]), [`${integrand} = ${save[2]}`]],
      [["Substitute", "换元"], t(sub[0], sub[1]), [`\\int ${integrand} \\, dx = ${sub[2]}`]],
      [
        ["Return to x", "换回 x"],
        t("Put the function of $x$ back for $u$:", "把 $u$ 换回 $x$ 的函数："),
        [`\\int ${integrand} \\, dx = ${answer}`],
      ],
    ],
    check: differentiated([derivativeOf(answer, derivative.join(" = "))], ["the chain rule", "链式法则"]),
    mistakes,
  };
}

/** integrationUsingThePythagoreanIdentities uses sin² + cos² = 1 and 1 + tan² = sec². */
export const integrationUsingThePythagoreanIdentities: TopicDef = {
  id: "integration-using-the-pythagorean-identities",
  title: t("Integration Using the Pythagorean Identities", "用毕达哥拉斯恒等式积分"),
  summary: t(
    "Integrate tan², cot² and odd powers of sine and cosine with the Pythagorean identities.",
    "用毕达哥拉斯恒等式求 tan²、cot² 及正弦、余弦奇次幂的积分。",
  ),
  intro: t(
    "$\\tan^{2} x$ is not the derivative of anything familiar, but $\\tan^{2} x = \\sec^{2} x - 1$ is:\n\n$$\\int \\tan^{2} x \\, dx = \\int (\\sec^{2} x - 1) \\, dx = \\tan x - x + C.$$\n\nCheck: at $x = \\frac{\\pi}{4}$ the integrand is $\\tan^{2} \\frac{\\pi}{4} = 1$, and the slope of $\\tan x - x$ there is $\\sec^{2} \\frac{\\pi}{4} - 1 = 2 - 1 = 1$.\n\nIn this lesson we use $\\sin^{2} x + \\cos^{2} x = 1$ and its forms with tangent and cotangent to integrate $\\tan^{2} x$, $\\cot^{2} x$ and odd powers of sine and cosine.",
    "$\\tan^{2} x$ 不是哪个熟悉函数的导数，但 $\\tan^{2} x = \\sec^{2} x - 1$ 是：\n\n$$\\int \\tan^{2} x \\, dx = \\int (\\sec^{2} x - 1) \\, dx = \\tan x - x + C$$\n\n检验：在 $x = \\frac{\\pi}{4}$ 处被积函数为 $\\tan^{2} \\frac{\\pi}{4} = 1$，而 $\\tan x - x$ 在那里的斜率是 $\\sec^{2} \\frac{\\pi}{4} - 1 = 2 - 1 = 1$。\n\n本课我们用 $\\sin^{2} x + \\cos^{2} x = 1$ 及其含正切、余切的形式，求 $\\tan^{2} x$、$\\cot^{2} x$ 以及正弦、余弦奇次幂的积分。",
  ),
  prerequisites: ["integration-using-basic-trigonometric-identities"],
  encompasses: [
    { topic: "integration-using-basic-trigonometric-identities", weight: 0.4 },
    { topic: "alternate-forms-of-the-pythagorean-identity", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-squares-of-tangent-and-cotangent",
      title: t("Integrating squares of tangent and cotangent", "正切与余切平方的积分"),
      explanation: t(
        "The square of tangent has no direct antiderivative, but the Pythagorean identity rewrites it as the square of secant minus one, which does. From $\\sin^{2} x + \\cos^{2} x = 1$ come $\\tan^{2} x = \\sec^{2} x - 1$ and $\\cot^{2} x = \\csc^{2} x - 1$. So\n\n$$\\int \\tan^{2} x \\, dx = \\tan x - x + C, \\qquad \\int \\cot^{2} x \\, dx = -\\cot x - x + C.$$\n\nThe identity also simplifies quotients: $\\frac{1 - \\sin^{2} x}{\\cos x} = \\frac{\\cos^{2} x}{\\cos x} = \\cos x$.\n\nCheck: differentiating $-\\cot x - x$ gives $\\csc^{2} x - 1$, which is $\\cot^{2} x$.\n\n> **Watch out.** $\\tan^{2} x$ is not a power of $x$: $\\int \\tan^{2} x \\, dx$ is not $\\frac{\\tan^{3} x}{3}$, because differentiating that brings out a factor $\\sec^{2} x$ by the chain rule.",
        "正切的平方没有直接的原函数，但勾股恒等式把它改写成正割的平方减 1，这个就能积分了。由 $\\sin^{2} x + \\cos^{2} x = 1$ 得 $\\tan^{2} x = \\sec^{2} x - 1$，$\\cot^{2} x = \\csc^{2} x - 1$。所以\n\n$$\\int \\tan^{2} x \\, dx = \\tan x - x + C, \\qquad \\int \\cot^{2} x \\, dx = -\\cot x - x + C$$\n\n这个恒等式也能化简商：$\\frac{1 - \\sin^{2} x}{\\cos x} = \\frac{\\cos^{2} x}{\\cos x} = \\cos x$。\n\n检验：对 $-\\cot x - x$ 求导得 $\\csc^{2} x - 1$，即 $\\cot^{2} x$。\n\n> **注意。** $\\tan^{2} x$ 不是 $x$ 的幂：$\\int \\tan^{2} x \\, dx$ 不是 $\\frac{\\tan^{3} x}{3}$，因为对它求导时链式法则会多出因子 $\\sec^{2} x$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const K = coef(Q.of(k));
        const make = (
          integrand: string,
          answer: string,
          rewrite: readonly [string, string],
          rewritten: string,
          rule: readonly [string, string],
          mistakes: readonly Said[],
        ): Case => ({
          integrand,
          answer,
          steps: [
            [["Use the identity", "用恒等式"], t(rewrite[0], rewrite[1]), [`${integrand} = ${rewritten}`]],
            [["Integrate", "积分"], t(rule[0], rule[1]), [`\\int ${integrand} \\, dx = ${answer}`]],
          ],
          check: differentiated([derivativeOf(answer, rewritten)]),
          mistakes,
        });
        const cases: Case[] = [
          make(
            `${K}\\tan^{2} x`,
            plusC([k, "\\tan x"], [-k, "x"]),
            ["Use $\\tan^{2} x = \\sec^{2} x - 1$:", "用 $\\tan^{2} x = \\sec^{2} x - 1$："],
            poly([k, "\\sec^{2} x"], [-k, ""]),
            [
              "$\\sec^{2} x$ integrates to $\\tan x$, and the constant to a multiple of $x$:",
              "$\\sec^{2} x$ 积分得 $\\tan x$，常数积分得 $x$ 的倍数：",
            ],
            [
              powerRule(plusC([Q.of(k, 3), "\\tan^{3} x"]), "\\tan x", "\\sec^{2} x"),
              say(
                plusC([k, "\\tan x"], [k, "x"]),
                "The identity is $\\tan^{2} x = \\sec^{2} x - 1$, so the $x$ term is subtracted.",
                "恒等式是 $\\tan^{2} x = \\sec^{2} x - 1$，所以 $x$ 项要减去。",
              ),
              say(
                plusC([k, "\\sec^{2} x"], [-k, "x"]),
                "$\\sec^{2} x$ was copied from the identity without integrating it; its integral is $\\tan x$.",
                "$\\sec^{2} x$ 是从恒等式照抄的，没有积分；它的积分是 $\\tan x$。",
              ),
            ],
          ),
          make(
            `${K}\\cot^{2} x`,
            plusC([-k, "\\cot x"], [-k, "x"]),
            ["Use $\\cot^{2} x = \\csc^{2} x - 1$:", "用 $\\cot^{2} x = \\csc^{2} x - 1$："],
            poly([k, "\\csc^{2} x"], [-k, ""]),
            [
              "$\\csc^{2} x$ integrates to $-\\cot x$, and the constant to a multiple of $x$:",
              "$\\csc^{2} x$ 积分得 $-\\cot x$，常数积分得 $x$ 的倍数：",
            ],
            [
              powerRule(plusC([Q.of(k, 3), "\\cot^{3} x"]), "\\cot x", "-\\csc^{2} x"),
              say(
                plusC([k, "\\cot x"], [-k, "x"]),
                "$\\int \\csc^{2} x \\, dx$ is $-\\cot x$, because the derivative of $\\cot x$ is $-\\csc^{2} x$.",
                "$\\int \\csc^{2} x \\, dx$ 是 $-\\cot x$，因为 $\\cot x$ 的导数是 $-\\csc^{2} x$。",
              ),
              say(
                plusC([-k, "\\cot x"], [k, "x"]),
                "The identity is $\\cot^{2} x = \\csc^{2} x - 1$, so the $x$ term is subtracted.",
                "恒等式是 $\\cot^{2} x = \\csc^{2} x - 1$，所以 $x$ 项要减去。",
              ),
            ],
          ),
          make(
            fracWith(k, "(1 - \\sin^{2} x)", "\\cos x"),
            plusC([k, "\\sin x"]),
            ["Use $1 - \\sin^{2} x = \\cos^{2} x$ and cancel:", "用 $1 - \\sin^{2} x = \\cos^{2} x$ 再约分："],
            `${K}\\cos x`,
            ["The integral of $\\cos x$ is $\\sin x$:", "$\\cos x$ 的积分是 $\\sin x$："],
            [
              say(
                plusC([-k, "\\sin x"]),
                "The integral of $\\cos x$ is $+\\sin x$; the minus sign belongs to the integral of $\\sin x$.",
                "$\\cos x$ 的积分是 $+\\sin x$；负号属于 $\\sin x$ 的积分。",
              ),
              say(
                plusC([k, "\\ln|\\cos x|"]),
                "A logarithm comes from a quotient whose top is the derivative of its bottom, which is not the case here; the top $1 - \\sin^{2} x$ is $\\cos^{2} x$, so the quotient is just $\\cos x$.",
                "对数来自分子恰为分母导数的商，这里不是这样；分子 $1 - \\sin^{2} x$ 等于 $\\cos^{2} x$，所以这个商就是 $\\cos x$。",
              ),
              say(
                plusC([k, "\\cos x"]),
                "The derivative of $\\cos x$ is $-\\sin x$, not $\\cos x$; the integral of $\\cos x$ is $\\sin x$.",
                "$\\cos x$ 的导数是 $-\\sin x$，不是 $\\cos x$；$\\cos x$ 的积分是 $\\sin x$。",
              ),
            ],
          ),
          make(
            fracWith(k, "(1 - \\cos^{2} x)", "\\sin x"),
            plusC([-k, "\\cos x"]),
            ["Use $1 - \\cos^{2} x = \\sin^{2} x$ and cancel:", "用 $1 - \\cos^{2} x = \\sin^{2} x$ 再约分："],
            `${K}\\sin x`,
            ["The integral of $\\sin x$ is $-\\cos x$:", "$\\sin x$ 的积分是 $-\\cos x$："],
            [
              say(
                plusC([k, "\\cos x"]),
                "The integral of $\\sin x$ is $-\\cos x$, because the derivative of $\\cos x$ is $-\\sin x$.",
                "$\\sin x$ 的积分是 $-\\cos x$，因为 $\\cos x$ 的导数是 $-\\sin x$。",
              ),
              say(
                plusC([k, "\\ln|\\sin x|"]),
                "A logarithm comes from a quotient whose top is the derivative of its bottom, which is not the case here; the top $1 - \\cos^{2} x$ is $\\sin^{2} x$, so the quotient is just $\\sin x$.",
                "对数来自分子恰为分母导数的商，这里不是这样；分子 $1 - \\cos^{2} x$ 等于 $\\sin^{2} x$，所以这个商就是 $\\sin x$。",
              ),
              say(
                plusC([k, "\\sin x"]),
                "The derivative of $\\sin x$ is $\\cos x$, not $\\sin x$; the integral of $\\sin x$ is $-\\cos x$.",
                "$\\sin x$ 的导数是 $\\cos x$，不是 $\\sin x$；$\\sin x$ 的积分是 $-\\cos x$。",
              ),
            ],
          ),
        ];
        return fromCase(rng.pick(cases));
      },
    },
    {
      id: "integrating-odd-powers-of-sine-and-cosine",
      title: t("Integrating odd powers of sine and cosine", "正弦与余弦奇次幂的积分"),
      explanation: t(
        "With an odd power of sine, keep one $\\sin x$ for $du$ and turn the rest into cosines, then let $u = \\cos x$:\n\n$$\\int \\sin^{3} x \\, dx = \\int (1 - \\cos^{2} x)\\sin x \\, dx = -\\cos x + \\frac{\\cos^{3} x}{3} + C.$$\n\nWith an odd power of cosine, keep one $\\cos x$ and let $u = \\sin x$: $\\int \\cos^{3} x \\, dx = \\sin x - \\frac{\\sin^{3} x}{3} + C$.\n\nCheck: differentiating $-\\cos x + \\frac{\\cos^{3} x}{3}$ gives $\\sin x - \\cos^{2} x\\sin x = \\sin x(1 - \\cos^{2} x)$, which is $\\sin^{3} x$.\n\n> **Watch out.** With $u = \\cos x$ the differential is $du = -\\sin x \\, dx$, so a minus sign comes out in front. And $\\int \\sin^{3} x \\, dx$ is not $\\frac{\\sin^{4} x}{4}$: there is no factor $\\cos x$ to make that work.",
        "正弦为奇次幂时，留一个 $\\sin x$ 作 $du$，其余化为余弦，再令 $u = \\cos x$：\n\n$$\\int \\sin^{3} x \\, dx = \\int (1 - \\cos^{2} x)\\sin x \\, dx = -\\cos x + \\frac{\\cos^{3} x}{3} + C$$\n\n余弦为奇次幂时，留一个 $\\cos x$，令 $u = \\sin x$：$\\int \\cos^{3} x \\, dx = \\sin x - \\frac{\\sin^{3} x}{3} + C$。\n\n检验：对 $-\\cos x + \\frac{\\cos^{3} x}{3}$ 求导得 $\\sin x - \\cos^{2} x\\sin x = \\sin x(1 - \\cos^{2} x)$，即 $\\sin^{3} x$。\n\n> **注意。** 令 $u = \\cos x$ 时 $du = -\\sin x \\, dx$，前面要多出一个负号。另外 $\\int \\sin^{3} x \\, dx$ 不是 $\\frac{\\sin^{4} x}{4}$：没有因子 $\\cos x$，这样做不成立。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const K = coef(Q.of(k));
        const byCos: readonly [string, string] = [
          "Let $u = \\cos x$, so $\\sin x \\, dx = -du$:",
          "令 $u = \\cos x$，则 $\\sin x \\, dx = -du$：",
        ];
        const bySin: readonly [string, string] = [
          "Let $u = \\sin x$, so $\\cos x \\, dx = du$:",
          "令 $u = \\sin x$，则 $\\cos x \\, dx = du$：",
        ];
        const cases: Case[] = [
          substituted(
            `${K}\\sin^{3} x`,
            plusC([-k, "\\cos x"], [Q.of(k, 3), "\\cos^{3} x"]),
            ["Keep one $\\sin x$ and turn the rest into cosines:", "留一个 $\\sin x$，其余化为余弦：", `${K}(1 - \\cos^{2} x)\\sin x`],
            [...byCos, `${coef(Q.of(-k))}\\int (1 - u^{2}) \\, du = ${poly([-k, "u"], [Q.of(k, 3), "u^{3}"])} + C`],
            [poly([k, "\\sin x"], [-k, "\\cos^{2} x\\sin x"]), `${K}\\sin x(1 - \\cos^{2} x)`, `${K}\\sin^{3} x`],
            [
              powerRule(plusC([Q.of(k, 4), "\\sin^{4} x"]), "\\sin x", "\\cos x"),
              say(
                plusC([k, "\\cos x"], [Q.of(-k, 3), "\\cos^{3} x"]),
                "Both signs are flipped: with $u = \\cos x$, $\\sin x \\, dx = -du$, which puts a minus sign in front of the integral.",
                "两个符号都反了：令 $u = \\cos x$ 时 $\\sin x \\, dx = -du$，积分前面要有一个负号。",
              ),
              say(
                plusC([-k, "\\cos x"], [Q.of(-k, 3), "\\cos^{3} x"]),
                "$1 - u^{2}$ integrates to $u - \\frac{u^{3}}{3}$, and the minus sign in front then makes the cube term positive.",
                "$1 - u^{2}$ 积分得 $u - \\frac{u^{3}}{3}$，前面的负号再使立方项变为正。",
              ),
            ],
          ),
          substituted(
            `${K}\\cos^{3} x`,
            plusC([k, "\\sin x"], [Q.of(-k, 3), "\\sin^{3} x"]),
            ["Keep one $\\cos x$ and turn the rest into sines:", "留一个 $\\cos x$，其余化为正弦：", `${K}(1 - \\sin^{2} x)\\cos x`],
            [...bySin, `${K}\\int (1 - u^{2}) \\, du = ${poly([k, "u"], [Q.of(-k, 3), "u^{3}"])} + C`],
            [poly([k, "\\cos x"], [-k, "\\sin^{2} x\\cos x"]), `${K}\\cos x(1 - \\sin^{2} x)`, `${K}\\cos^{3} x`],
            [
              powerRule(plusC([Q.of(k, 4), "\\cos^{4} x"]), "\\cos x", "-\\sin x"),
              say(
                plusC([k, "\\sin x"], [Q.of(k, 3), "\\sin^{3} x"]),
                "The identity is $\\cos^{2} x = 1 - \\sin^{2} x$, so the cube term is subtracted.",
                "恒等式是 $\\cos^{2} x = 1 - \\sin^{2} x$，所以立方项要减去。",
              ),
              say(
                plusC([-k, "\\sin x"], [Q.of(k, 3), "\\sin^{3} x"]),
                "With $u = \\sin x$, $du = \\cos x \\, dx$ carries no minus sign, so no sign changes.",
                "令 $u = \\sin x$ 时 $du = \\cos x \\, dx$ 不带负号，所以符号不变。",
              ),
            ],
          ),
          substituted(
            `${K}\\sin^{3} x\\cos^{2} x`,
            plusC([Q.of(-k, 3), "\\cos^{3} x"], [Q.of(k, 5), "\\cos^{5} x"]),
            [
              "Keep one $\\sin x$ and turn the rest into cosines:",
              "留一个 $\\sin x$，其余化为余弦：",
              `${K}(1 - \\cos^{2} x)\\cos^{2} x\\sin x`,
            ],
            [...byCos, `${coef(Q.of(-k))}\\int (u^{2} - u^{4}) \\, du = ${poly([Q.of(-k, 3), "u^{3}"], [Q.of(k, 5), "u^{5}"])} + C`],
            [
              poly([k, "\\cos^{2} x\\sin x"], [-k, "\\cos^{4} x\\sin x"]),
              `${K}\\cos^{2} x\\sin x(1 - \\cos^{2} x)`,
              `${K}\\sin^{3} x\\cos^{2} x`,
            ],
            [
              say(
                plusC([Q.of(k, 3), "\\cos^{3} x"], [Q.of(-k, 5), "\\cos^{5} x"]),
                "With $u = \\cos x$, $\\sin x \\, dx = -du$; the minus sign in front was dropped, which flips both terms.",
                "令 $u = \\cos x$ 时 $\\sin x \\, dx = -du$；前面的负号漏掉了，两项都变了号。",
              ),
              byFactors(plusC([Q.of(k, 12), "\\sin^{4} x\\cos^{3} x"])),
              say(
                plusC([Q.of(-k, 3), "\\cos^{3} x"], [Q.of(-k, 5), "\\cos^{5} x"]),
                "$(1 - u^{2})u^{2} = u^{2} - u^{4}$, so the $u^{5}$ term has the opposite sign to the $u^{3}$ term.",
                "$(1 - u^{2})u^{2} = u^{2} - u^{4}$，所以 $u^{5}$ 项与 $u^{3}$ 项异号。",
              ),
            ],
          ),
          substituted(
            `${K}\\cos^{3} x\\sin^{2} x`,
            plusC([Q.of(k, 3), "\\sin^{3} x"], [Q.of(-k, 5), "\\sin^{5} x"]),
            [
              "Keep one $\\cos x$ and turn the rest into sines:",
              "留一个 $\\cos x$，其余化为正弦：",
              `${K}(1 - \\sin^{2} x)\\sin^{2} x\\cos x`,
            ],
            [...bySin, `${K}\\int (u^{2} - u^{4}) \\, du = ${poly([Q.of(k, 3), "u^{3}"], [Q.of(-k, 5), "u^{5}"])} + C`],
            [
              poly([k, "\\sin^{2} x\\cos x"], [-k, "\\sin^{4} x\\cos x"]),
              `${K}\\sin^{2} x\\cos x(1 - \\sin^{2} x)`,
              `${K}\\cos^{3} x\\sin^{2} x`,
            ],
            [
              say(
                plusC([Q.of(k, 3), "\\sin^{3} x"], [Q.of(k, 5), "\\sin^{5} x"]),
                "$(1 - u^{2})u^{2} = u^{2} - u^{4}$, so the $u^{5}$ term is subtracted.",
                "$(1 - u^{2})u^{2} = u^{2} - u^{4}$，所以 $u^{5}$ 项要减去。",
              ),
              byFactors(plusC([Q.of(k, 12), "\\cos^{4} x\\sin^{3} x"])),
              say(
                plusC([Q.of(-k, 3), "\\sin^{3} x"], [Q.of(k, 5), "\\sin^{5} x"]),
                "With $u = \\sin x$, $du = \\cos x \\, dx$ has no minus sign, so the signs stay as they are.",
                "令 $u = \\sin x$ 时 $du = \\cos x \\, dx$ 没有负号，所以符号保持不变。",
              ),
            ],
          ),
        ];
        return fromCase(rng.pick(cases));
      },
    },
  ],
};

/** integrationUsingTheDoubleAngleFormulas integrates sin², cos² and sin·cos with the double-angle formulas. */
export const integrationUsingTheDoubleAngleFormulas: TopicDef = {
  id: "integration-using-the-double-angle-formulas",
  title: t("Integration Using the Double-Angle Formulas", "用二倍角公式积分"),
  summary: t(
    "Integrate even powers and products of sine and cosine with the double-angle formulas.",
    "用二倍角公式求正弦、余弦的偶次幂与乘积的积分。",
  ),
  intro: t(
    "$\\sin^{2} x$ has no substitution: there is no spare $\\cos x$ to make $du$. The double angle formula lowers the power instead, since $\\sin^{2} x = \\frac{1 - \\cos 2x}{2}$:\n\n$$\\int \\sin^{2} x \\, dx = \\frac{x}{2} - \\frac{\\sin 2x}{4} + C.$$\n\nCheck: $\\sin^{2} x$ lies between $0$ and $1$ and averages $\\frac{1}{2}$ over a period, and the answer grows like $\\frac{x}{2}$ with only a small wobble added.\n\nIn this lesson we integrate squares of sine and cosine, and products of the sine and cosine of one angle, with the double angle formulas.",
    "$\\sin^{2} x$ 没法换元：没有多余的 $\\cos x$ 来构成 $du$。改用二倍角公式降幂，因为 $\\sin^{2} x = \\frac{1 - \\cos 2x}{2}$：\n\n$$\\int \\sin^{2} x \\, dx = \\frac{x}{2} - \\frac{\\sin 2x}{4} + C$$\n\n检验：$\\sin^{2} x$ 介于 $0$ 与 $1$ 之间，一个周期内的平均值是 $\\frac{1}{2}$；而答案像 $\\frac{x}{2}$ 那样增长，只多了一个小小的波动。\n\n本课我们用二倍角公式，求正弦、余弦平方以及同角正弦与余弦之积的积分。",
  ),
  prerequisites: ["integration-using-the-pythagorean-identities", "the-power-reducing-formulas-for-sine-and-cosine"],
  encompasses: [{ topic: "the-power-reducing-formulas-for-sine-and-cosine", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-squares-of-sine-and-cosine",
      figure: calculusDrawings4["integration-using-the-double-angle-formulas#integrating-squares-of-sine-and-cosine"],
      title: t("Integrating squares of sine and cosine", "正弦与余弦平方的积分"),
      explanation: t(
        "The power reduction formulas turn a square into a constant plus a cosine of the doubled angle, both of which are easy to integrate. Even powers do not yield to substitution. Lower the power with $\\sin^{2} \\theta = \\frac{1 - \\cos 2\\theta}{2}$ and $\\cos^{2} \\theta = \\frac{1 + \\cos 2\\theta}{2}$:\n\n$$\\int \\sin^{2}(ax) \\, dx = \\frac{x}{2} - \\frac{\\sin(2ax)}{4a} + C, \\qquad \\int \\cos^{2}(ax) \\, dx = \\frac{x}{2} + \\frac{\\sin(2ax)}{4a} + C.$$\n\nFor example, $\\int \\cos^{2}(3x) \\, dx = \\frac{x}{2} + \\frac{\\sin(6x)}{12} + C$.\n\nCheck: differentiating gives $\\frac{1}{2} + \\frac{\\cos(6x)}{2}$, which is $\\cos^{2}(3x)$ by the same formula.\n\n> **Watch out.** The factor $\\frac{1}{2}$ from the formula and the $\\frac{1}{2a}$ from integrating $\\cos(2ax)$ multiply to $\\frac{1}{4a}$; keep both. And $\\sin^{2} x$ is not a power of $x$, so $\\frac{\\sin^{3} x}{3}$ is wrong.",
        "降幂公式把平方变成一个常数加上二倍角的余弦，这两部分都容易积分。偶次幂不能直接换元。用 $\\sin^{2} \\theta = \\frac{1 - \\cos 2\\theta}{2}$ 和 $\\cos^{2} \\theta = \\frac{1 + \\cos 2\\theta}{2}$ 降幂：\n\n$$\\int \\sin^{2}(ax) \\, dx = \\frac{x}{2} - \\frac{\\sin(2ax)}{4a} + C, \\qquad \\int \\cos^{2}(ax) \\, dx = \\frac{x}{2} + \\frac{\\sin(2ax)}{4a} + C$$\n\n例如，$\\int \\cos^{2}(3x) \\, dx = \\frac{x}{2} + \\frac{\\sin(6x)}{12} + C$。\n\n检验：求导得 $\\frac{1}{2} + \\frac{\\cos(6x)}{2}$，由同一个公式，它就是 $\\cos^{2}(3x)$。\n\n> **注意。** 公式中的因子 $\\frac{1}{2}$ 与积分 $\\cos(2ax)$ 产生的 $\\frac{1}{2a}$ 相乘得 $\\frac{1}{4a}$，两个都要保留。另外 $\\sin^{2} x$ 不是 $x$ 的幂，所以 $\\frac{\\sin^{3} x}{3}$ 是错的。",
      ),
      generate(rng) {
        const k = rng.nonZero(-8, 8);
        const a = rng.int(1, 4);
        const sine = rng.bool();
        const s = sine ? -1 : 1;
        const f = sine ? "\\sin" : "\\cos";
        const arg = a === 1 ? "x" : `${a}x`;
        const integrand = `${coef(Q.of(k))}${a === 1 ? `${f}^{2} x` : `${f}^{2}(${a}x)`}`;
        const answer = plusC([Q.of(k, 2), "x"], [Q.of(s * k, 4 * a), fn("\\sin", 2 * a)]);
        const lowered = poly([Q.of(k, 2), ""], [Q.of(s * k, 2), fn("\\cos", 2 * a)]);
        return fromCase({
          integrand,
          answer,
          steps: [
            [
              ["Lower the power", "降幂"],
              t(
                `Use $${f}^{2} \\theta = \\frac{1 ${sine ? "-" : "+"} \\cos 2\\theta}{2}$ with $\\theta = ${arg}$:`,
                `用 $${f}^{2} \\theta = \\frac{1 ${sine ? "-" : "+"} \\cos 2\\theta}{2}$，其中 $\\theta = ${arg}$：`,
              ),
              [`${integrand} = ${lowered}`],
            ],
            [
              ["Integrate each term", "逐项积分"],
              t(
                `The constant gives a multiple of $x$, and $\\int ${fn("\\cos", 2 * a)} \\, dx = \\frac{${fn("\\sin", 2 * a)}}{${2 * a}}$:`,
                `常数积分得 $x$ 的倍数，而 $\\int ${fn("\\cos", 2 * a)} \\, dx = \\frac{${fn("\\sin", 2 * a)}}{${2 * a}}$：`,
              ),
              [`\\int ${integrand} \\, dx = ${answer}`],
            ],
          ],
          check: differentiated([derivativeOf(answer, lowered)], ["the chain rule", "链式法则"]),
          mistakes: [
            say(
              plusC([Q.of(k, 3 * a), a === 1 ? `${f}^{3} x` : `${f}^{3}(${a}x)`]),
              `This treats $${f}^{2}$ like $x^{2}$ in the power rule; differentiating $${f}^{3}$ would bring out an extra factor by the chain rule, so lower the power first.`,
              `这是把 $${f}^{2}$ 当作 $x^{2}$ 用幂法则；对 $${f}^{3}$ 求导时链式法则会多出因子，所以要先降幂。`,
            ),
            say(
              plusC([Q.of(k, 2), "x"], [Q.of(-s * k, 4 * a), fn("\\sin", 2 * a)]),
              `The formula for $${f}^{2}$ has $1 ${sine ? "-" : "+"} \\cos 2\\theta$, so the sine term is ${sine ? "subtracted" : "added"}.`,
              `$${f}^{2}$ 的公式中是 $1 ${sine ? "-" : "+"} \\cos 2\\theta$，所以正弦项要${sine ? "减去" : "加上"}。`,
            ),
            say(
              plusC([Q.of(k, 2), "x"], [Q.of(s * k, 2 * a), fn("\\sin", 2 * a)]),
              `The formula's factor $\\frac{1}{2}$ and the $\\frac{1}{${2 * a}}$ from integrating $${fn("\\cos", 2 * a)}$ multiply to $\\frac{1}{${4 * a}}$; one of them was left out.`,
              `公式中的因子 $\\frac{1}{2}$ 与积分 $${fn("\\cos", 2 * a)}$ 产生的 $\\frac{1}{${2 * a}}$ 相乘得 $\\frac{1}{${4 * a}}$；漏掉了其中一个。`,
            ),
          ],
        });
      },
    },
    {
      id: "integrating-products-of-sine-and-cosine-of-the-same-angle",
      title: t("Integrating sin·cos of the same angle", "同角正弦与余弦之积的积分"),
      explanation: t(
        "The product of sine and cosine of one angle is half the sine of the doubled angle, which integrates to a cosine. Use $\\sin \\theta\\cos \\theta = \\frac{1}{2}\\sin 2\\theta$: $\\int \\sin(ax)\\cos(ax) \\, dx = -\\frac{\\cos(2ax)}{4a} + C$. For example, $\\int \\sin(3x)\\cos(3x) \\, dx = -\\frac{\\cos(6x)}{12} + C$. Squaring the identity, $\\sin^{2} x\\cos^{2} x = \\frac{1}{4}\\sin^{2} 2x = \\frac{1 - \\cos 4x}{8}$.\n\nCheck: differentiating $-\\frac{\\cos(6x)}{12}$ gives $\\frac{\\sin(6x)}{2}$, which is $\\sin(3x)\\cos(3x)$.\n\n> **Watch out.** A right answer can look different: substituting $u = \\sin(ax)$ gives $\\frac{\\sin^{2}(ax)}{2a} + C$, which differs from $-\\frac{\\cos(2ax)}{4a}$ only by a constant. But dividing by $2a$ instead of $4a$ in the double angle route is a real error.",
        "同一个角的正弦与余弦之积等于二倍角正弦的一半，它的积分是一个余弦。利用 $\\sin \\theta\\cos \\theta = \\frac{1}{2}\\sin 2\\theta$：$\\int \\sin(ax)\\cos(ax) \\, dx = -\\frac{\\cos(2ax)}{4a} + C$。例如，$\\int \\sin(3x)\\cos(3x) \\, dx = -\\frac{\\cos(6x)}{12} + C$。把恒等式平方，$\\sin^{2} x\\cos^{2} x = \\frac{1}{4}\\sin^{2} 2x = \\frac{1 - \\cos 4x}{8}$。\n\n检验：对 $-\\frac{\\cos(6x)}{12}$ 求导得 $\\frac{\\sin(6x)}{2}$，即 $\\sin(3x)\\cos(3x)$。\n\n> **注意。** 正确答案可能长得不一样：代换 $u = \\sin(ax)$ 得 $\\frac{\\sin^{2}(ax)}{2a} + C$，它与 $-\\frac{\\cos(2ax)}{4a}$ 只差一个常数。但用二倍角公式时除以 $2a$ 而不是 $4a$，就是真正的错误。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const K = coef(Q.of(k));
        if (rng.bool(0.3)) {
          const integrand = `${K}\\sin^{2} x\\cos^{2} x`;
          const answer = plusC([Q.of(k, 8), "x"], [Q.of(-k, 32), "\\sin(4x)"]);
          return fromCase({
            integrand,
            answer,
            steps: [
              [
                ["Use the double angle formula twice", "两次用二倍角公式"],
                t(
                  "$\\sin x\\cos x = \\frac{1}{2}\\sin(2x)$; square it and lower the power again:",
                  "$\\sin x\\cos x = \\frac{1}{2}\\sin(2x)$；平方后再降幂一次：",
                ),
                ["\\sin^{2} x\\cos^{2} x = \\frac{1}{4}\\sin^{2}(2x) = \\frac{1 - \\cos(4x)}{8}"],
              ],
              [
                ["Integrate", "积分"],
                t(`Integrate each term${k === 1 ? "" : ` and multiply by $${k}$`}:`, `逐项积分${k === 1 ? "" : `，再乘以 $${k}$`}：`),
                [`\\int ${integrand} \\, dx = ${answer}`],
              ],
            ],
            check: differentiated(
              [derivativeOf(answer, poly([Q.of(k, 8), ""], [Q.of(-k, 8), "\\cos(4x)"]))],
              ["the chain rule", "链式法则"],
            ),
            mistakes: [
              byFactors(plusC([Q.of(k, 9), "\\sin^{3} x\\cos^{3} x"])),
              say(
                plusC([Q.of(k, 8), "x"], [Q.of(k, 32), "\\sin(4x)"]),
                "$\\sin^{2}(2x) = \\frac{1 - \\cos(4x)}{2}$, so the cosine is subtracted, and its integral keeps that minus sign.",
                "$\\sin^{2}(2x) = \\frac{1 - \\cos(4x)}{2}$，余弦项是减去的，积分后仍带这个负号。",
              ),
              say(
                plusC([Q.of(k, 4), "x"], [Q.of(-k, 16), "\\sin(4x)"]),
                "Squaring $\\frac{1}{2}\\sin(2x)$ gives $\\frac{1}{4}\\sin^{2}(2x)$, not $\\frac{1}{2}\\sin^{2}(2x)$; this result is twice the integral.",
                "$\\frac{1}{2}\\sin(2x)$ 平方得 $\\frac{1}{4}\\sin^{2}(2x)$，不是 $\\frac{1}{2}\\sin^{2}(2x)$；这个结果是积分的两倍。",
              ),
            ],
          });
        }
        const a = rng.int(1, 5);
        const integrand = `${K}${fn("\\sin", a)}${fn("\\cos", a)}`.replace(/ x\\cos/, " x \\cos");
        const answer = plusC([Q.of(-k, 4 * a), fn("\\cos", 2 * a)]);
        const half = poly([Q.of(k, 2), fn("\\sin", 2 * a)]);
        return fromCase({
          integrand,
          answer,
          steps: [
            [
              ["Use the double angle formula", "用二倍角公式"],
              t(
                "$\\sin \\theta\\cos \\theta = \\frac{1}{2}\\sin 2\\theta$:",
                "$\\sin \\theta\\cos \\theta = \\frac{1}{2}\\sin 2\\theta$：",
              ),
              [`${integrand} = ${half}`],
            ],
            [
              ["Integrate", "积分"],
              t(
                `$\\int ${fn("\\sin", 2 * a)} \\, dx = -\\frac{${fn("\\cos", 2 * a)}}{${2 * a}}$, and the factor $${Q.of(k, 2).toLatex()}$ multiplies it:`,
                `$\\int ${fn("\\sin", 2 * a)} \\, dx = -\\frac{${fn("\\cos", 2 * a)}}{${2 * a}}$，再乘以因子 $${Q.of(k, 2).toLatex()}$：`,
              ),
              [`\\int ${integrand} \\, dx = ${answer}`],
            ],
          ],
          check: differentiated([derivativeOf(answer, half)], ["the chain rule", "链式法则"]),
          mistakes: [
            say(
              plusC([Q.of(k, 4 * a), fn("\\cos", 2 * a)]),
              "The integral of $\\sin$ is $-\\cos$, so the answer has the opposite sign.",
              "$\\sin$ 的积分是 $-\\cos$，所以答案应变号。",
            ),
            say(
              plusC([Q.of(-k, 2 * a), fn("\\cos", 2 * a)]),
              `The factor $\\frac{1}{2}$ from $\\sin \\theta\\cos \\theta = \\frac{1}{2}\\sin 2\\theta$ is missing: integrating gives $\\frac{1}{2} \\cdot \\frac{1}{${2 * a}} = \\frac{1}{${4 * a}}$.`,
              `漏掉了 $\\sin \\theta\\cos \\theta = \\frac{1}{2}\\sin 2\\theta$ 中的因子 $\\frac{1}{2}$：积分得 $\\frac{1}{2} \\cdot \\frac{1}{${2 * a}} = \\frac{1}{${4 * a}}$。`,
            ),
            byFactors(plusC([Q.of(-k, a * a), `${fn("\\cos", a)}${fn("\\sin", a)}`.replace(/ x\\sin/, " x \\sin")])),
          ],
        });
      },
    },
  ],
};

/** productPair chooses frequencies a > b ≥ 1 for a product of two trigonometric functions. */
function productPair(rng: Rng): readonly [number, number] {
  const a = rng.int(2, 6);
  return [a, rng.int(1, a - 1)];
}

/** integratingProductsOfTrigonometricFunctions integrates sin(ax)cos(bx), sin(ax)sin(bx) and cos(ax)cos(bx). */
export const integratingProductsOfTrigonometricFunctions: TopicDef = {
  id: "integrating-products-of-trigonometric-functions",
  title: t("Integrating Products of Trigonometric Functions", "三角函数乘积的积分"),
  summary: t(
    "Integrate products of sines and cosines of different angles with the product-to-sum formulas.",
    "用积化和差公式求不同角的正弦、余弦乘积的积分。",
  ),
  intro: t(
    "To integrate $\\sin 3x\\cos x$, turn the product into a sum. Adding $\\sin(A + B)$ and $\\sin(A - B)$ gives $2\\sin A\\cos B$, so $\\sin 3x\\cos x = \\frac{1}{2}(\\sin 4x + \\sin 2x)$ and\n\n$$\\int \\sin 3x\\cos x \\, dx = -\\frac{\\cos 4x}{8} - \\frac{\\cos 2x}{4} + C.$$\n\nCheck: at $x = \\frac{\\pi}{6}$ the integrand is $\\sin\\frac{\\pi}{2}\\cos\\frac{\\pi}{6} = \\frac{\\sqrt{3}}{2}$, and the derivative of the answer, $\\frac{\\sin 4x}{2} + \\frac{\\sin 2x}{2}$, is $\\frac{\\sqrt{3}}{4} + \\frac{\\sqrt{3}}{4} = \\frac{\\sqrt{3}}{2}$ there.\n\nIn this lesson we integrate products of sines and cosines of different angles with the product to sum formulas.",
    "要积分 $\\sin 3x\\cos x$，先把积化成和。把 $\\sin(A + B)$ 与 $\\sin(A - B)$ 相加得 $2\\sin A\\cos B$，所以 $\\sin 3x\\cos x = \\frac{1}{2}(\\sin 4x + \\sin 2x)$，于是\n\n$$\\int \\sin 3x\\cos x \\, dx = -\\frac{\\cos 4x}{8} - \\frac{\\cos 2x}{4} + C$$\n\n检验：在 $x = \\frac{\\pi}{6}$ 处被积函数为 $\\sin\\frac{\\pi}{2}\\cos\\frac{\\pi}{6} = \\frac{\\sqrt{3}}{2}$，而答案的导数 $\\frac{\\sin 4x}{2} + \\frac{\\sin 2x}{2}$ 在那里等于 $\\frac{\\sqrt{3}}{4} + \\frac{\\sqrt{3}}{4} = \\frac{\\sqrt{3}}{2}$。\n\n本课我们用积化和差公式，求不同角的正弦、余弦乘积的积分。",
  ),
  prerequisites: ["integration-using-the-double-angle-formulas"],
  encompasses: [{ topic: "the-sum-and-difference-formulas-for-sine", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-sine-times-cosine",
      title: t("Integrating sine times cosine", "正弦乘余弦的积分"),
      explanation: t(
        "Adding the sum and difference formulas for sine gives the product-to-sum formula\n\n$$\\sin A\\cos B = \\frac{1}{2}\\left[\\sin(A + B) + \\sin(A - B)\\right].$$\n\nSo $\\int \\sin 3x\\cos x \\, dx = \\frac{1}{2}\\int (\\sin 4x + \\sin 2x) \\, dx = -\\frac{\\cos 4x}{8} - \\frac{\\cos 2x}{4} + C$.\n\nCheck: differentiating $-\\frac{\\cos 4x}{8} - \\frac{\\cos 2x}{4}$ gives $\\frac{\\sin 4x}{2} + \\frac{\\sin 2x}{2}$, which is $\\sin 3x\\cos x$ by the formula.\n\n> **Watch out.** Order matters: $\\cos A\\sin B = \\frac{1}{2}\\left[\\sin(A + B) - \\sin(A - B)\\right]$, with a minus sign. And each sine must be divided by its own new frequency, $A + B$ or $A - B$.",
        "把正弦的和角公式与差角公式相加，得积化和差公式\n\n$$\\sin A\\cos B = \\frac{1}{2}\\left[\\sin(A + B) + \\sin(A - B)\\right]$$\n\n所以 $\\int \\sin 3x\\cos x \\, dx = \\frac{1}{2}\\int (\\sin 4x + \\sin 2x) \\, dx = -\\frac{\\cos 4x}{8} - \\frac{\\cos 2x}{4} + C$。\n\n检验：对 $-\\frac{\\cos 4x}{8} - \\frac{\\cos 2x}{4}$ 求导得 $\\frac{\\sin 4x}{2} + \\frac{\\sin 2x}{2}$，由公式它就是 $\\sin 3x\\cos x$。\n\n> **注意。** 顺序有关系：$\\cos A\\sin B = \\frac{1}{2}\\left[\\sin(A + B) - \\sin(A - B)\\right]$，中间是减号。并且每个正弦都要除以它自己的新频率 $A + B$ 或 $A - B$。",
      ),
      generate(rng) {
        const [a, b] = productPair(rng);
        const k = rng.nonZero(-6, 6);
        const sinFirst = rng.bool();
        // sin(ax)cos(bx) = ½[sin((a+b)x) + sin((a−b)x)]; cos(ax)sin(bx) = ½[sin((a+b)x) − sin((a−b)x)].
        const s = sinFirst ? 1 : -1;
        const bx = b === 1 ? "x" : `${b}x`;
        const answer = plusC([Q.of(-k, 2 * (a + b)), fn("\\cos", a + b)], [Q.of(-s * k, 2 * (a - b)), fn("\\cos", a - b)]);
        const product = sinFirst ? `${fn("\\sin", a)}${fn("\\cos", b)}` : `${fn("\\cos", a)}${fn("\\sin", b)}`;
        const integrand = `${coef(Q.of(k))}${product}`;
        const formula = sinFirst
          ? "\\sin A\\cos B = \\frac{1}{2}\\left[\\sin(A + B) + \\sin(A - B)\\right]"
          : "\\cos A\\sin B = \\frac{1}{2}\\left[\\sin(A + B) - \\sin(A - B)\\right]";
        return fromCase({
          integrand,
          answer,
          steps: [
            [
              ["Turn the product into a sum", "积化和差"],
              t(`Use $${formula}$ with $A = ${a}x$ and $B = ${bx}$:`, `用 $${formula}$，其中 $A = ${a}x$，$B = ${bx}$：`),
              [`${product} = \\frac{1}{2}\\left[${fn("\\sin", a + b)} ${sinFirst ? "+" : "-"} ${fn("\\sin", a - b)}\\right]`],
            ],
            [
              ["Integrate each sine", "逐项积分"],
              t(
                `Each $\\int \\sin(mx) \\, dx = -\\frac{\\cos(mx)}{m}$${k === 1 ? "" : `; then multiply by $${k}$`}:`,
                `每个 $\\int \\sin(mx) \\, dx = -\\frac{\\cos(mx)}{m}$${k === 1 ? "" : `；再乘以 $${k}$`}：`,
              ),
              [`\\int ${integrand} \\, dx = ${answer}`],
            ],
          ],
          check: differentiated(
            [derivativeOf(answer, poly([Q.of(k, 2), fn("\\sin", a + b)], [Q.of(s * k, 2), fn("\\sin", a - b)]))],
            ["the chain rule", "链式法则"],
          ),
          mistakes: [
            say(
              plusC([Q.of(k, 2 * (a + b)), fn("\\cos", a + b)], [Q.of(s * k, 2 * (a - b)), fn("\\cos", a - b)]),
              "Both signs are flipped: $\\int \\sin(mx) \\, dx = -\\frac{\\cos(mx)}{m}$, with a minus sign.",
              "两个符号都反了：$\\int \\sin(mx) \\, dx = -\\frac{\\cos(mx)}{m}$，带负号。",
            ),
            say(
              plusC([Q.of(-k, 2 * (a + b)), fn("\\cos", a + b)], [Q.of(s * k, 2 * (a - b)), fn("\\cos", a - b)]),
              sinFirst
                ? "In $\\sin A\\cos B$ both sines are added, so after integrating both cosine terms carry the same sign."
                : "In $\\cos A\\sin B$ the second sine is subtracted, so after integrating its cosine term has the opposite sign to the first.",
              sinFirst
                ? "$\\sin A\\cos B$ 中两个正弦相加，所以积分后两个余弦项同号。"
                : "$\\cos A\\sin B$ 中第二个正弦是减去的，所以积分后它的余弦项与第一项异号。",
            ),
            byFactors(plusC([Q.of(-k, a * b), sinFirst ? `${fn("\\cos", a)}${fn("\\sin", b)}` : `${fn("\\sin", a)}${fn("\\cos", b)}`])),
          ],
        });
      },
    },
    {
      id: "integrating-sine-times-sine-and-cosine-times-cosine",
      title: t("Integrating sine times sine and cosine times cosine", "正弦乘正弦与余弦乘余弦的积分"),
      explanation: t(
        "The product to sum formulas turn a product of two trigonometric functions into a sum, and each term then integrates on its own. From the sum and difference formulas for cosine:\n\n$$\\sin A\\sin B = \\frac{1}{2}\\left[\\cos(A - B) - \\cos(A + B)\\right], \\qquad \\cos A\\cos B = \\frac{1}{2}\\left[\\cos(A - B) + \\cos(A + B)\\right].$$\n\nSo $\\int \\cos 3x\\cos x \\, dx = \\frac{\\sin 2x}{4} + \\frac{\\sin 4x}{8} + C$.\n\nCheck: differentiating $\\frac{\\sin 2x}{4} + \\frac{\\sin 4x}{8}$ gives $\\frac{\\cos 2x}{2} + \\frac{\\cos 4x}{2}$, which is $\\cos 3x\\cos x$ by the formula.\n\n> **Watch out.** In $\\sin A\\sin B$ the difference angle comes first and the sum angle is subtracted. Mixing up this sign is the usual mistake.",
        "积化和差公式把两个三角函数的积化成和，然后每一项都可以单独积分。由余弦的和角与差角公式：\n\n$$\\sin A\\sin B = \\frac{1}{2}\\left[\\cos(A - B) - \\cos(A + B)\\right], \\qquad \\cos A\\cos B = \\frac{1}{2}\\left[\\cos(A - B) + \\cos(A + B)\\right]$$\n\n所以 $\\int \\cos 3x\\cos x \\, dx = \\frac{\\sin 2x}{4} + \\frac{\\sin 4x}{8} + C$。\n\n检验：对 $\\frac{\\sin 2x}{4} + \\frac{\\sin 4x}{8}$ 求导得 $\\frac{\\cos 2x}{2} + \\frac{\\cos 4x}{2}$，由公式它就是 $\\cos 3x\\cos x$。\n\n> **注意。** 在 $\\sin A\\sin B$ 中，差角在前，和角是减去的。把这个符号弄混是常见的错误。",
      ),
      generate(rng) {
        const [a, b] = productPair(rng);
        const k = rng.nonZero(-6, 6);
        const sines = rng.bool();
        const s = sines ? -1 : 1;
        const f = sines ? "\\sin" : "\\cos";
        const bx = b === 1 ? "x" : `${b}x`;
        const answer = plusC([Q.of(k, 2 * (a - b)), fn("\\sin", a - b)], [Q.of(s * k, 2 * (a + b)), fn("\\sin", a + b)]);
        const product = `${fn(f, a)}${fn(f, b)}`;
        const integrand = `${coef(Q.of(k))}${product}`;
        const formula = sines
          ? "\\sin A\\sin B = \\frac{1}{2}\\left[\\cos(A - B) - \\cos(A + B)\\right]"
          : "\\cos A\\cos B = \\frac{1}{2}\\left[\\cos(A - B) + \\cos(A + B)\\right]";
        return fromCase({
          integrand,
          answer,
          steps: [
            [
              ["Turn the product into a sum", "积化和差"],
              t(`Use $${formula}$ with $A = ${a}x$ and $B = ${bx}$:`, `用 $${formula}$，其中 $A = ${a}x$，$B = ${bx}$：`),
              [`${product} = \\frac{1}{2}\\left[${fn("\\cos", a - b)} ${sines ? "-" : "+"} ${fn("\\cos", a + b)}\\right]`],
            ],
            [
              ["Integrate each cosine", "逐项积分"],
              t(
                `Each $\\int \\cos(mx) \\, dx = \\frac{\\sin(mx)}{m}$${k === 1 ? "" : `; then multiply by $${k}$`}:`,
                `每个 $\\int \\cos(mx) \\, dx = \\frac{\\sin(mx)}{m}$${k === 1 ? "" : `；再乘以 $${k}$`}：`,
              ),
              [`\\int ${integrand} \\, dx = ${answer}`],
            ],
          ],
          check: differentiated(
            [derivativeOf(answer, poly([Q.of(k, 2), fn("\\cos", a - b)], [Q.of(s * k, 2), fn("\\cos", a + b)]))],
            ["the chain rule", "链式法则"],
          ),
          mistakes: [
            say(
              plusC([Q.of(k, 2 * (a - b)), fn("\\sin", a - b)], [Q.of(-s * k, 2 * (a + b)), fn("\\sin", a + b)]),
              sines
                ? "In $\\sin A\\sin B$ the sum angle is subtracted: $\\frac{1}{2}\\left[\\cos(A - B) - \\cos(A + B)\\right]$."
                : "In $\\cos A\\cos B$ both cosines are added: $\\frac{1}{2}\\left[\\cos(A - B) + \\cos(A + B)\\right]$.",
              sines
                ? "在 $\\sin A\\sin B$ 中和角是减去的：$\\frac{1}{2}\\left[\\cos(A - B) - \\cos(A + B)\\right]$。"
                : "在 $\\cos A\\cos B$ 中两个余弦相加：$\\frac{1}{2}\\left[\\cos(A - B) + \\cos(A + B)\\right]$。",
            ),
            say(
              plusC([Q.of(-k, 2 * (a - b)), fn("\\cos", a - b)], [Q.of(-s * k, 2 * (a + b)), fn("\\cos", a + b)]),
              "This integrates the cosines as if they were sines: $\\int \\cos(mx) \\, dx = \\frac{\\sin(mx)}{m}$, not $-\\frac{\\cos(mx)}{m}$.",
              "这是把余弦当作正弦来积分：$\\int \\cos(mx) \\, dx = \\frac{\\sin(mx)}{m}$，不是 $-\\frac{\\cos(mx)}{m}$。",
            ),
            say(
              plusC([Q.of(k, 2 * (a - b)), fn("\\sin", a - b)]),
              "This keeps only the difference angle; the term with $\\cos(A + B)$ has to be integrated too.",
              "这里只保留了差角一项；含 $\\cos(A + B)$ 的项也要积分。",
            ),
          ],
        });
      },
    },
  ],
};

/** integrationUsingBasicHyperbolicIdentities rewrites hyperbolic integrands by quotients and exponential definitions. */
export const integrationUsingBasicHyperbolicIdentities: TopicDef = {
  id: "integration-using-basic-hyperbolic-identities",
  title: t("Integration Using Basic Hyperbolic Identities", "用基本双曲恒等式积分"),
  summary: t(
    "Rewrite hyperbolic integrands with the quotient and reciprocal identities and the exponential definitions.",
    "用商数关系、倒数关系与指数定义改写双曲型被积函数。",
  ),
  intro: t(
    "$\\frac{\\sinh x}{\\cosh^{2} x}$ looks unfamiliar, but it splits as $\\frac{1}{\\cosh x} \\cdot \\frac{\\sinh x}{\\cosh x} = \\operatorname{sech} x\\tanh x$, which is minus the derivative of $\\operatorname{sech} x$:\n\n$$\\int \\frac{\\sinh x}{\\cosh^{2} x} \\, dx = -\\operatorname{sech} x + C.$$\n\nCheck: the integrand is positive for $x > 0$, and $-\\operatorname{sech} x = -\\frac{1}{\\cosh x}$ rises there, since $\\cosh x$ grows.\n\nIn this lesson we rewrite hyperbolic integrands with the quotient and reciprocal identities, and turn products with exponentials into sums of exponentials.",
    "$\\frac{\\sinh x}{\\cosh^{2} x}$ 看起来陌生，但它可以拆成 $\\frac{1}{\\cosh x} \\cdot \\frac{\\sinh x}{\\cosh x} = \\operatorname{sech} x\\tanh x$，这正是 $\\operatorname{sech} x$ 的导数的相反数：\n\n$$\\int \\frac{\\sinh x}{\\cosh^{2} x} \\, dx = -\\operatorname{sech} x + C$$\n\n检验：当 $x > 0$ 时被积函数为正，而 $-\\operatorname{sech} x = -\\frac{1}{\\cosh x}$ 在那里上升，因为 $\\cosh x$ 在增大。\n\n本课我们用商数关系与倒数关系改写双曲型被积函数，并把与指数函数的乘积化成几个指数式的和。",
  ),
  prerequisites: ["integrating-hyperbolic-functions-using-substitution"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rewriting-with-hyperbolic-quotient-identities",
      title: t("Rewriting with hyperbolic quotient identities", "用双曲函数的商数关系改写"),
      explanation: t(
        "Writing hyperbolic functions in terms of hyperbolic sine and cosine can reveal a quotient in which the top is the derivative of the bottom. As with trigonometric functions, $\\tanh x = \\frac{\\sinh x}{\\cosh x}$, $\\operatorname{sech} x = \\frac{1}{\\cosh x}$, and so on. Recall $\\frac{d}{dx}\\operatorname{sech} x = -\\operatorname{sech} x\\tanh x$, $\\frac{d}{dx}\\tanh x = \\operatorname{sech}^{2} x$ and $\\frac{d}{dx}\\coth x = -\\operatorname{csch}^{2} x$. For example,\n\n$$\\int \\frac{\\sinh x}{\\cosh^{2} x} \\, dx = \\int \\operatorname{sech} x\\tanh x \\, dx = -\\operatorname{sech} x + C.$$\n\nCheck: differentiating $-\\operatorname{sech} x = -(\\cosh x)^{-1}$ gives $(\\cosh x)^{-2}\\sinh x$, which is $\\frac{\\sinh x}{\\cosh^{2} x}$.\n\n> **Watch out.** The signs follow their own pattern: $\\frac{d}{dx}\\cosh x = +\\sinh x$, unlike cosine, but $\\frac{d}{dx}\\operatorname{sech} x$ and $\\frac{d}{dx}\\coth x$ are negative. Check each sign by differentiating.",
        "把双曲函数写成双曲正弦和双曲余弦的形式，可能会出现分子是分母导数的商。与三角函数类似，$\\tanh x = \\frac{\\sinh x}{\\cosh x}$，$\\operatorname{sech} x = \\frac{1}{\\cosh x}$，等等。回忆 $\\frac{d}{dx}\\operatorname{sech} x = -\\operatorname{sech} x\\tanh x$，$\\frac{d}{dx}\\tanh x = \\operatorname{sech}^{2} x$，$\\frac{d}{dx}\\coth x = -\\operatorname{csch}^{2} x$。例如\n\n$$\\int \\frac{\\sinh x}{\\cosh^{2} x} \\, dx = \\int \\operatorname{sech} x\\tanh x \\, dx = -\\operatorname{sech} x + C$$\n\n检验：对 $-\\operatorname{sech} x = -(\\cosh x)^{-1}$ 求导得 $(\\cosh x)^{-2}\\sinh x$，即 $\\frac{\\sinh x}{\\cosh^{2} x}$。\n\n> **注意。** 符号有自己的规律：$\\frac{d}{dx}\\cosh x = +\\sinh x$，与余弦不同；但 $\\frac{d}{dx}\\operatorname{sech} x$ 和 $\\frac{d}{dx}\\coth x$ 是负的。每个符号都要求导核对。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const K = coef(Q.of(k));
        const one = (den: string) => fracWith(k, "", den).replace("\\frac{}", "\\frac{1}");
        const make = (
          integrand: string,
          answer: string,
          lines: readonly string[],
          rule: readonly [string, string],
          derivative: string,
          mistakes: readonly Said[],
        ): Case => ({
          integrand,
          answer,
          steps: [
            [
              ["Rewrite with the identities", "用恒等式改写"],
              t("Write the integrand with the hyperbolic identities:", "用双曲恒等式改写被积函数："),
              lines,
            ],
            [["Integrate", "积分"], t(rule[0], rule[1]), [`\\int ${integrand} \\, dx = ${answer}`]],
          ],
          check: differentiated([derivativeOf(answer, `${derivative} = ${integrand}`)]),
          mistakes,
        });
        const cases: Case[] = [
          make(
            fracWith(k, "\\sinh x", "\\cosh^{2} x"),
            plusC([-k, "\\operatorname{sech} x"]),
            ["\\frac{\\sinh x}{\\cosh^{2} x} = \\frac{1}{\\cosh x} \\cdot \\frac{\\sinh x}{\\cosh x} = \\operatorname{sech} x\\tanh x"],
            [
              "Since $\\frac{d}{dx}\\operatorname{sech} x = -\\operatorname{sech} x\\tanh x$:",
              "由于 $\\frac{d}{dx}\\operatorname{sech} x = -\\operatorname{sech} x\\tanh x$：",
            ],
            `${K}\\operatorname{sech} x\\tanh x`,
            [
              say(
                plusC([k, "\\operatorname{sech} x"]),
                "The derivative of $\\operatorname{sech} x$ is $-\\operatorname{sech} x\\tanh x$, so integrating $\\operatorname{sech} x\\tanh x$ gives $-\\operatorname{sech} x$.",
                "$\\operatorname{sech} x$ 的导数是 $-\\operatorname{sech} x\\tanh x$，所以 $\\operatorname{sech} x\\tanh x$ 的积分是 $-\\operatorname{sech} x$。",
              ),
              say(
                plusC([k, "\\tanh x"]),
                "$\\tanh x$ has derivative $\\operatorname{sech}^{2} x = \\frac{1}{\\cosh^{2} x}$, which lacks the factor $\\sinh x$ on top.",
                "$\\tanh x$ 的导数是 $\\operatorname{sech}^{2} x = \\frac{1}{\\cosh^{2} x}$，分子上少了因子 $\\sinh x$。",
              ),
              say(
                plusC([-k, "\\operatorname{csch} x"]),
                "$-\\operatorname{csch} x$ integrates $\\frac{\\cosh x}{\\sinh^{2} x}$; here $\\sinh$ and $\\cosh$ are the other way round.",
                "$-\\operatorname{csch} x$ 是 $\\frac{\\cosh x}{\\sinh^{2} x}$ 的积分；这里 $\\sinh$ 与 $\\cosh$ 的位置正好相反。",
              ),
            ],
          ),
          make(
            fracWith(k, "\\cosh x", "\\sinh^{2} x"),
            plusC([-k, "\\operatorname{csch} x"]),
            ["\\frac{\\cosh x}{\\sinh^{2} x} = \\frac{1}{\\sinh x} \\cdot \\frac{\\cosh x}{\\sinh x} = \\operatorname{csch} x\\coth x"],
            [
              "Since $\\frac{d}{dx}\\operatorname{csch} x = -\\operatorname{csch} x\\coth x$:",
              "由于 $\\frac{d}{dx}\\operatorname{csch} x = -\\operatorname{csch} x\\coth x$：",
            ],
            `${K}\\operatorname{csch} x\\coth x`,
            [
              say(
                plusC([k, "\\operatorname{csch} x"]),
                "The derivative of $\\operatorname{csch} x$ is $-\\operatorname{csch} x\\coth x$, so the integral needs a minus sign.",
                "$\\operatorname{csch} x$ 的导数是 $-\\operatorname{csch} x\\coth x$，所以积分要带负号。",
              ),
              say(
                plusC([-k, "\\coth x"]),
                "$-\\coth x$ has derivative $\\operatorname{csch}^{2} x = \\frac{1}{\\sinh^{2} x}$, which lacks the factor $\\cosh x$ on top.",
                "$-\\coth x$ 的导数是 $\\operatorname{csch}^{2} x = \\frac{1}{\\sinh^{2} x}$，分子上少了因子 $\\cosh x$。",
              ),
              say(
                plusC([k, "\\coth x"]),
                "$\\coth x = \\frac{\\cosh x}{\\sinh x}$ resembles the integrand, but its derivative is $-\\operatorname{csch}^{2} x$, not $\\operatorname{csch} x\\coth x$.",
                "$\\coth x = \\frac{\\cosh x}{\\sinh x}$ 看起来像被积函数，但它的导数是 $-\\operatorname{csch}^{2} x$，不是 $\\operatorname{csch} x\\coth x$。",
              ),
            ],
          ),
          make(
            one("\\cosh^{2} x"),
            plusC([k, "\\tanh x"]),
            ["\\frac{1}{\\cosh^{2} x} = \\operatorname{sech}^{2} x"],
            ["$\\operatorname{sech}^{2} x$ is the derivative of $\\tanh x$:", "$\\operatorname{sech}^{2} x$ 是 $\\tanh x$ 的导数："],
            `${K}\\operatorname{sech}^{2} x`,
            [
              say(
                plusC([-k, "\\tanh x"]),
                "The derivative of $\\tanh x$ is $+\\operatorname{sech}^{2} x$, so no minus sign appears.",
                "$\\tanh x$ 的导数是 $+\\operatorname{sech}^{2} x$，所以不出现负号。",
              ),
              say(
                plusC([k, "\\operatorname{sech} x"]),
                "The derivative of $\\operatorname{sech} x$ is $-\\operatorname{sech} x\\tanh x$, not $\\operatorname{sech}^{2} x$.",
                "$\\operatorname{sech} x$ 的导数是 $-\\operatorname{sech} x\\tanh x$，不是 $\\operatorname{sech}^{2} x$。",
              ),
              say(
                plusC([-k, "\\coth x"]),
                "$-\\coth x$ integrates $\\operatorname{csch}^{2} x = \\frac{1}{\\sinh^{2} x}$; the denominator here is $\\cosh^{2} x$.",
                "$-\\coth x$ 是 $\\operatorname{csch}^{2} x = \\frac{1}{\\sinh^{2} x}$ 的积分；这里的分母是 $\\cosh^{2} x$。",
              ),
            ],
          ),
          make(
            one("\\sinh^{2} x"),
            plusC([-k, "\\coth x"]),
            ["\\frac{1}{\\sinh^{2} x} = \\operatorname{csch}^{2} x"],
            [
              "Since $\\frac{d}{dx}\\coth x = -\\operatorname{csch}^{2} x$, the integral of $\\operatorname{csch}^{2} x$ is $-\\coth x$:",
              "由于 $\\frac{d}{dx}\\coth x = -\\operatorname{csch}^{2} x$，$\\operatorname{csch}^{2} x$ 的积分是 $-\\coth x$：",
            ],
            `${K}\\operatorname{csch}^{2} x`,
            [
              say(
                plusC([k, "\\coth x"]),
                "The derivative of $\\coth x$ is $-\\operatorname{csch}^{2} x$, so the integral of $\\operatorname{csch}^{2} x$ is $-\\coth x$.",
                "$\\coth x$ 的导数是 $-\\operatorname{csch}^{2} x$，所以 $\\operatorname{csch}^{2} x$ 的积分是 $-\\coth x$。",
              ),
              say(
                plusC([-k, "\\operatorname{csch} x"]),
                "The derivative of $-\\operatorname{csch} x$ is $\\operatorname{csch} x\\coth x$, not $\\operatorname{csch}^{2} x$.",
                "$-\\operatorname{csch} x$ 的导数是 $\\operatorname{csch} x\\coth x$，不是 $\\operatorname{csch}^{2} x$。",
              ),
              say(
                plusC([k, "\\tanh x"]),
                "$\\tanh x$ integrates $\\operatorname{sech}^{2} x = \\frac{1}{\\cosh^{2} x}$; the denominator here is $\\sinh^{2} x$.",
                "$\\tanh x$ 是 $\\operatorname{sech}^{2} x = \\frac{1}{\\cosh^{2} x}$ 的积分；这里的分母是 $\\sinh^{2} x$。",
              ),
            ],
          ),
          make(
            `${K}\\tanh x\\cosh x`,
            plusC([k, "\\cosh x"]),
            ["\\tanh x\\cosh x = \\frac{\\sinh x}{\\cosh x} \\cdot \\cosh x = \\sinh x"],
            ["The integral of $\\sinh x$ is $\\cosh x$:", "$\\sinh x$ 的积分是 $\\cosh x$："],
            `${K}\\sinh x`,
            [
              say(
                plusC([-k, "\\cosh x"]),
                "The derivative of $\\cosh x$ is $+\\sinh x$; unlike $\\cos x$, no minus sign appears.",
                "$\\cosh x$ 的导数是 $+\\sinh x$；与 $\\cos x$ 不同，没有负号。",
              ),
              say(
                plusC([k, "\\sinh x"]),
                "The derivative of $\\sinh x$ is $\\cosh x$, not $\\sinh x$; the integral of $\\sinh x$ is $\\cosh x$.",
                "$\\sinh x$ 的导数是 $\\cosh x$，不是 $\\sinh x$；$\\sinh x$ 的积分是 $\\cosh x$。",
              ),
              say(
                plusC([k, "\\ln(\\cosh x)"]),
                "$\\ln(\\cosh x)$ integrates $\\tanh x$ alone; with the factor $\\cosh x$ the integrand simplifies to $\\sinh x$.",
                "$\\ln(\\cosh x)$ 是单独 $\\tanh x$ 的积分；乘上因子 $\\cosh x$ 后被积函数化简为 $\\sinh x$。",
              ),
            ],
          ),
          make(
            `${K}\\coth x\\sinh x`,
            plusC([k, "\\sinh x"]),
            ["\\coth x\\sinh x = \\frac{\\cosh x}{\\sinh x} \\cdot \\sinh x = \\cosh x"],
            ["The integral of $\\cosh x$ is $\\sinh x$:", "$\\cosh x$ 的积分是 $\\sinh x$："],
            `${K}\\cosh x`,
            [
              say(
                plusC([-k, "\\sinh x"]),
                "The integral of $\\cosh x$ is $+\\sinh x$, with no minus sign.",
                "$\\cosh x$ 的积分是 $+\\sinh x$，没有负号。",
              ),
              say(
                plusC([k, "\\cosh x"]),
                "The derivative of $\\cosh x$ is $\\sinh x$, not $\\cosh x$; the integral of $\\cosh x$ is $\\sinh x$.",
                "$\\cosh x$ 的导数是 $\\sinh x$，不是 $\\cosh x$；$\\cosh x$ 的积分是 $\\sinh x$。",
              ),
              say(
                plusC([k, "\\ln|\\sinh x|"]),
                "$\\ln|\\sinh x|$ integrates $\\coth x$ alone; with the factor $\\sinh x$ the integrand simplifies to $\\cosh x$.",
                "$\\ln|\\sinh x|$ 是单独 $\\coth x$ 的积分；乘上因子 $\\sinh x$ 后被积函数化简为 $\\cosh x$。",
              ),
            ],
          ),
        ];
        return fromCase(rng.pick(cases));
      },
    },
    {
      id: "integrating-with-exponential-definitions",
      title: t("Integrating with the exponential definitions", "用指数定义积分"),
      explanation: t(
        "When a hyperbolic function is multiplied by an exponential, the exponential definitions $\\sinh x = \\frac{e^{x} - e^{-x}}{2}$ and $\\cosh x = \\frac{e^{x} + e^{-x}}{2}$ turn the product into a sum of simple exponentials:\n\n$$\\int e^{x}\\cosh x \\, dx = \\int \\frac{e^{2x} + 1}{2} \\, dx = \\frac{e^{2x}}{4} + \\frac{x}{2} + C.$$\n\nCheck: differentiating gives $\\frac{e^{2x}}{2} + \\frac{1}{2}$, and $e^{x}\\cosh x = \\frac{e^{2x} + e^{0}}{2}$ is the same.\n\n> **Watch out.** $e^{x} \\cdot e^{-x} = e^{0} = 1$, so one term becomes a constant and integrates to a multiple of $x$. And $\\int e^{2x} \\, dx = \\frac{e^{2x}}{2}$: divide by the $2$.",
        "当双曲函数乘以指数函数时，用指数定义 $\\sinh x = \\frac{e^{x} - e^{-x}}{2}$、$\\cosh x = \\frac{e^{x} + e^{-x}}{2}$，可以把这个积变成几个简单指数式的和：\n\n$$\\int e^{x}\\cosh x \\, dx = \\int \\frac{e^{2x} + 1}{2} \\, dx = \\frac{e^{2x}}{4} + \\frac{x}{2} + C$$\n\n检验：求导得 $\\frac{e^{2x}}{2} + \\frac{1}{2}$，而 $e^{x}\\cosh x = \\frac{e^{2x} + e^{0}}{2}$，两者相同。\n\n> **注意。** $e^{x} \\cdot e^{-x} = e^{0} = 1$，所以有一项变成常数，积分得 $x$ 的倍数。另外 $\\int e^{2x} \\, dx = \\frac{e^{2x}}{2}$：要除以 $2$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const up = rng.bool();
        const sinh = rng.bool();
        // e^{x}·sinh/cosh = (e^{2x} ∓ 1)/2; e^{−x}·sinh/cosh = (1 ∓ e^{−2x})/2.
        const [e, e2, sx, s2] = up ? ["e^{x}", "e^{2x}", sinh ? -1 : 1, 1] : ["e^{-x}", "e^{-2x}", 1, sinh ? 1 : -1];
        const f = sinh ? "\\sinh x" : "\\cosh x";
        const other = sinh ? "\\cosh x" : "\\sinh x";
        const integrand = `${coef(Q.of(k))}${e}${f}`;
        const answer = plusC([Q.of(s2 * k, 4), e2], [Q.of(sx * k, 2), "x"]);
        const expanded = up ? `\\frac{e^{2x} ${sinh ? "-" : "+"} 1}{2}` : `\\frac{1 ${sinh ? "-" : "+"} e^{-2x}}{2}`;
        const derivative = poly([Q.of(s2 * k * (up ? 1 : -1), 2), e2], [Q.of(sx * k, 2), ""]);
        return fromCase({
          integrand,
          answer,
          steps: [
            [
              ["Use the exponential definition", "用指数定义"],
              t(`Write $${f}$ with exponentials and multiply by $${e}$:`, `把 $${f}$ 写成指数形式，再乘以 $${e}$：`),
              [`${e}${f} = ${e} \\cdot \\frac{e^{x} ${sinh ? "-" : "+"} e^{-x}}{2} = ${expanded}`],
            ],
            [
              ["Integrate each term", "逐项积分"],
              t(
                `$\\int ${e2} \\, dx = ${up ? "\\frac{e^{2x}}{2}" : "-\\frac{e^{-2x}}{2}"}$, and the constant gives a multiple of $x$${k === 1 ? "" : `; then multiply by $${k}$`}:`,
                `$\\int ${e2} \\, dx = ${up ? "\\frac{e^{2x}}{2}" : "-\\frac{e^{-2x}}{2}"}$，常数积分得 $x$ 的倍数${k === 1 ? "" : `；再乘以 $${k}$`}：`,
              ),
              [`\\int ${integrand} \\, dx = ${answer}`],
            ],
          ],
          check: differentiated([derivativeOf(answer, derivative), `= ${coef(Q.of(k))}${expanded}`], ["the chain rule", "链式法则"]),
          mistakes: [
            say(
              plusC([Q.of(-s2 * k, 4), e2], [Q.of(sx * k, 2), "x"]),
              `Integrating $${e2}$ gives $${up ? "+\\frac{e^{2x}}{2}" : "-\\frac{e^{-2x}}{2}"}$; the exponential term has the wrong sign.`,
              `$${e2}$ 的积分是 $${up ? "+\\frac{e^{2x}}{2}" : "-\\frac{e^{-2x}}{2}"}$；指数项的符号错了。`,
            ),
            say(
              plusC([Q.of(s2 * k, 2), e2], [Q.of(sx * k, 2), "x"]),
              `Integrating $${e2}$ brings a factor of size $\\frac{1}{2}$ from the $2$ in the exponent; without it this term is twice too large.`,
              `积分 $${e2}$ 时，指数中的 $2$ 会带来大小为 $\\frac{1}{2}$ 的因子；漏掉它，这一项就大了一倍。`,
            ),
            say(
              plusC([k, `${e}${other}`]),
              `This integrates $${f}$ to $${other}$ and keeps $${e}$ as it is, but a product cannot be integrated factor by factor; expand it first.`,
              `这是把 $${f}$ 积分成 $${other}$，而 $${e}$ 保持不变，但乘积不能逐个因子积分；要先展开。`,
            ),
          ],
        });
      },
    },
  ],
};

/** integrationUsingTheHyperbolicPythagoreanIdentities uses cosh² − sinh² = 1 and 1 − tanh² = sech². */
export const integrationUsingTheHyperbolicPythagoreanIdentities: TopicDef = {
  id: "integration-using-the-hyperbolic-pythagorean-identities",
  title: t("Integration Using the Hyperbolic Pythagorean Identities", "用双曲毕达哥拉斯恒等式积分"),
  summary: t(
    "Integrate tanh², coth² and odd powers of sinh and cosh with the identity cosh² − sinh² = 1.",
    "用恒等式 cosh² − sinh² = 1 求 tanh²、coth² 及 sinh、cosh 奇次幂的积分。",
  ),
  intro: t(
    "Dividing $\\cosh^{2} x - \\sinh^{2} x = 1$ by $\\cosh^{2} x$ gives $1 - \\tanh^{2} x = \\operatorname{sech}^{2} x$, so $\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$ and\n\n$$\\int \\tanh^{2} x \\, dx = x - \\tanh x + C.$$\n\nCheck: $\\tanh^{2} x$ lies between $0$ and $1$, so its integral from $0$ grows, but more slowly than $x$; indeed $x - \\tanh x$ is $x$ minus an amount between $0$ and $1$ for $x > 0$.\n\nIn this lesson we use $\\cosh^{2} x - \\sinh^{2} x = 1$ to integrate $\\tanh^{2} x$, $\\coth^{2} x$ and odd powers of $\\sinh x$ and $\\cosh x$.",
    "把 $\\cosh^{2} x - \\sinh^{2} x = 1$ 两边除以 $\\cosh^{2} x$，得 $1 - \\tanh^{2} x = \\operatorname{sech}^{2} x$，所以 $\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$，于是\n\n$$\\int \\tanh^{2} x \\, dx = x - \\tanh x + C$$\n\n检验：$\\tanh^{2} x$ 介于 $0$ 与 $1$ 之间，所以从 $0$ 开始的积分在增长，但比 $x$ 慢；确实，当 $x > 0$ 时 $x - \\tanh x$ 等于 $x$ 减去一个介于 $0$ 与 $1$ 之间的量。\n\n本课我们用 $\\cosh^{2} x - \\sinh^{2} x = 1$ 求 $\\tanh^{2} x$、$\\coth^{2} x$ 以及 $\\sinh x$、$\\cosh x$ 奇次幂的积分。",
  ),
  prerequisites: ["integration-using-basic-hyperbolic-identities"],
  encompasses: [{ topic: "integration-using-basic-hyperbolic-identities", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-squares-of-tanh-and-coth",
      title: t("Integrating squares of tanh and coth", "tanh 与 coth 平方的积分"),
      explanation: t(
        "The hyperbolic identity rewrites these squares in terms of the squares of the reciprocal functions, whose antiderivatives are known. Dividing $\\cosh^{2} x - \\sinh^{2} x = 1$ by $\\cosh^{2} x$ or $\\sinh^{2} x$ gives $\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$ and $\\coth^{2} x = 1 + \\operatorname{csch}^{2} x$. So\n\n$$\\int \\tanh^{2} x \\, dx = x - \\tanh x + C, \\qquad \\int \\coth^{2} x \\, dx = x - \\coth x + C.$$\n\nCheck: differentiating $x - \\coth x$ gives $1 + \\operatorname{csch}^{2} x$, which is $\\coth^{2} x$.\n\n> **Watch out.** The signs differ from the trigonometric case: $\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$, while $\\tan^{2} x = \\sec^{2} x - 1$. So $\\int \\tanh^{2} x \\, dx$ is $x - \\tanh x$, not $\\tanh x - x$.",
        "双曲恒等式把这些平方改写成倒数双曲函数的平方，而后者的原函数是已知的。把 $\\cosh^{2} x - \\sinh^{2} x = 1$ 两边除以 $\\cosh^{2} x$ 或 $\\sinh^{2} x$，得 $\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$，$\\coth^{2} x = 1 + \\operatorname{csch}^{2} x$。所以\n\n$$\\int \\tanh^{2} x \\, dx = x - \\tanh x + C, \\qquad \\int \\coth^{2} x \\, dx = x - \\coth x + C$$\n\n检验：对 $x - \\coth x$ 求导得 $1 + \\operatorname{csch}^{2} x$，即 $\\coth^{2} x$。\n\n> **注意。** 符号与三角函数的情形不同：$\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$，而 $\\tan^{2} x = \\sec^{2} x - 1$。所以 $\\int \\tanh^{2} x \\, dx$ 是 $x - \\tanh x$，不是 $\\tanh x - x$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const K = coef(Q.of(k));
        const make = (
          integrand: string,
          answer: string,
          rewrite: readonly [string, string],
          rewritten: string,
          rule: readonly [string, string],
          mistakes: readonly Said[],
        ): Case => ({
          integrand,
          answer,
          steps: [
            [["Use the identity", "用恒等式"], t(rewrite[0], rewrite[1]), [`${integrand} = ${rewritten}`]],
            [["Integrate", "积分"], t(rule[0], rule[1]), [`\\int ${integrand} \\, dx = ${answer}`]],
          ],
          check: differentiated([derivativeOf(answer, rewritten)]),
          mistakes,
        });
        const cases: Case[] = [
          make(
            `${K}\\tanh^{2} x`,
            plusC([k, "x"], [-k, "\\tanh x"]),
            ["Use $\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$:", "用 $\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$："],
            poly([k, ""], [-k, "\\operatorname{sech}^{2} x"]),
            [
              "The constant gives a multiple of $x$, and $\\operatorname{sech}^{2} x$ integrates to $\\tanh x$:",
              "常数积分得 $x$ 的倍数，$\\operatorname{sech}^{2} x$ 积分得 $\\tanh x$：",
            ],
            [
              say(
                plusC([k, "\\tanh x"], [-k, "x"]),
                "That is the trigonometric pattern; for hyperbolic functions $\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$, so both signs are reversed.",
                "这是三角函数的形式；对双曲函数，$\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$，两个符号都要反过来。",
              ),
              powerRule(plusC([Q.of(k, 3), "\\tanh^{3} x"]), "\\tanh x", "\\operatorname{sech}^{2} x"),
              say(
                plusC([k, "x"], [k, "\\tanh x"]),
                "The identity is $\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$, so the $\\tanh x$ term is subtracted.",
                "恒等式是 $\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$，所以 $\\tanh x$ 项要减去。",
              ),
            ],
          ),
          make(
            `${K}\\coth^{2} x`,
            plusC([k, "x"], [-k, "\\coth x"]),
            ["Use $\\coth^{2} x = 1 + \\operatorname{csch}^{2} x$:", "用 $\\coth^{2} x = 1 + \\operatorname{csch}^{2} x$："],
            poly([k, ""], [k, "\\operatorname{csch}^{2} x"]),
            [
              "The constant gives a multiple of $x$, and $\\int \\operatorname{csch}^{2} x \\, dx = -\\coth x$:",
              "常数积分得 $x$ 的倍数，而 $\\int \\operatorname{csch}^{2} x \\, dx = -\\coth x$：",
            ],
            [
              say(
                plusC([k, "x"], [k, "\\coth x"]),
                "$\\int \\operatorname{csch}^{2} x \\, dx$ is $-\\coth x$, because the derivative of $\\coth x$ is $-\\operatorname{csch}^{2} x$.",
                "$\\int \\operatorname{csch}^{2} x \\, dx$ 是 $-\\coth x$，因为 $\\coth x$ 的导数是 $-\\operatorname{csch}^{2} x$。",
              ),
              powerRule(plusC([Q.of(k, 3), "\\coth^{3} x"]), "\\coth x", "-\\operatorname{csch}^{2} x"),
              say(
                plusC([-k, "x"], [-k, "\\coth x"]),
                "The identity is $\\coth^{2} x = 1 + \\operatorname{csch}^{2} x$, so the constant is $+1$ and gives $+x$.",
                "恒等式是 $\\coth^{2} x = 1 + \\operatorname{csch}^{2} x$，常数是 $+1$，积分得 $+x$。",
              ),
            ],
          ),
          make(
            fracWith(k, "(\\cosh^{2} x - 1)", "\\sinh x"),
            plusC([k, "\\cosh x"]),
            ["Use $\\cosh^{2} x - 1 = \\sinh^{2} x$ and cancel:", "用 $\\cosh^{2} x - 1 = \\sinh^{2} x$ 再约分："],
            `${K}\\sinh x`,
            ["The integral of $\\sinh x$ is $\\cosh x$:", "$\\sinh x$ 的积分是 $\\cosh x$："],
            [
              say(
                plusC([-k, "\\cosh x"]),
                "The derivative of $\\cosh x$ is $+\\sinh x$, so the integral of $\\sinh x$ is $+\\cosh x$.",
                "$\\cosh x$ 的导数是 $+\\sinh x$，所以 $\\sinh x$ 的积分是 $+\\cosh x$。",
              ),
              say(
                plusC([k, "\\sinh x"]),
                "The derivative of $\\sinh x$ is $\\cosh x$, not $\\sinh x$.",
                "$\\sinh x$ 的导数是 $\\cosh x$，不是 $\\sinh x$。",
              ),
              say(
                plusC([k, "\\ln|\\sinh x|"]),
                "A logarithm needs a top that is the derivative of the bottom; here $\\cosh^{2} x - 1 = \\sinh^{2} x$, so the quotient is just $\\sinh x$.",
                "对数要求分子是分母的导数；这里 $\\cosh^{2} x - 1 = \\sinh^{2} x$，所以这个商就是 $\\sinh x$。",
              ),
            ],
          ),
        ];
        return fromCase(rng.pick(cases));
      },
    },
    {
      id: "integrating-odd-powers-of-sinh-and-cosh",
      title: t("Integrating odd powers of sinh and cosh", "sinh 与 cosh 奇次幂的积分"),
      explanation: t(
        "Save one factor to pair with the differential, and convert the remaining even power with the hyperbolic identity so the substitution works. Keep one factor for $du$ and convert the rest with $\\sinh^{2} x = \\cosh^{2} x - 1$ or $\\cosh^{2} x = 1 + \\sinh^{2} x$:\n\n$$\\int \\sinh^{3} x \\, dx = \\int (\\cosh^{2} x - 1)\\sinh x \\, dx = \\frac{\\cosh^{3} x}{3} - \\cosh x + C.$$\n\nCheck: differentiating $\\frac{\\cosh^{3} x}{3} - \\cosh x$ gives $\\cosh^{2} x\\sinh x - \\sinh x = (\\cosh^{2} x - 1)\\sinh x$, which is $\\sinh^{3} x$.\n\n> **Watch out.** For $u = \\cosh x$, $du = \\sinh x \\, dx$ has no minus sign, unlike $u = \\cos x$. And the identity is $\\sinh^{2} x = \\cosh^{2} x - 1$, not $1 - \\cosh^{2} x$.",
        "留出一个因子与微分配对，再用双曲恒等式转化剩下的偶次幂，这样就可以换元了。留一个因子作 $du$，其余用 $\\sinh^{2} x = \\cosh^{2} x - 1$ 或 $\\cosh^{2} x = 1 + \\sinh^{2} x$ 转化：\n\n$$\\int \\sinh^{3} x \\, dx = \\int (\\cosh^{2} x - 1)\\sinh x \\, dx = \\frac{\\cosh^{3} x}{3} - \\cosh x + C$$\n\n检验：对 $\\frac{\\cosh^{3} x}{3} - \\cosh x$ 求导得 $\\cosh^{2} x\\sinh x - \\sinh x = (\\cosh^{2} x - 1)\\sinh x$，即 $\\sinh^{3} x$。\n\n> **注意。** 令 $u = \\cosh x$ 时 $du = \\sinh x \\, dx$ 没有负号，与 $u = \\cos x$ 不同。另外恒等式是 $\\sinh^{2} x = \\cosh^{2} x - 1$，不是 $1 - \\cosh^{2} x$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const K = coef(Q.of(k));
        const byCosh: readonly [string, string] = [
          "Let $u = \\cosh x$, so $\\sinh x \\, dx = du$:",
          "令 $u = \\cosh x$，则 $\\sinh x \\, dx = du$：",
        ];
        const bySinh: readonly [string, string] = [
          "Let $u = \\sinh x$, so $\\cosh x \\, dx = du$:",
          "令 $u = \\sinh x$，则 $\\cosh x \\, dx = du$：",
        ];
        const trigSign = (response: string) =>
          say(
            response,
            "That uses the trigonometric sign; the hyperbolic identity is $\\cosh^{2} x - \\sinh^{2} x = 1$, so $\\sinh^{2} x = \\cosh^{2} x - 1$ and $\\cosh^{2} x = 1 + \\sinh^{2} x$.",
            "这是三角恒等式的符号；双曲恒等式是 $\\cosh^{2} x - \\sinh^{2} x = 1$，所以 $\\sinh^{2} x = \\cosh^{2} x - 1$，$\\cosh^{2} x = 1 + \\sinh^{2} x$。",
          );
        const cases: Case[] = [
          substituted(
            `${K}\\sinh^{3} x`,
            plusC([Q.of(k, 3), "\\cosh^{3} x"], [-k, "\\cosh x"]),
            [
              "Keep one $\\sinh x$ and turn the rest into $\\cosh x$:",
              "留一个 $\\sinh x$，其余化为 $\\cosh x$：",
              `${K}(\\cosh^{2} x - 1)\\sinh x`,
            ],
            [...byCosh, `${K}\\int (u^{2} - 1) \\, du = ${poly([Q.of(k, 3), "u^{3}"], [-k, "u"])} + C`],
            [poly([k, "\\cosh^{2} x\\sinh x"], [-k, "\\sinh x"]), `${K}(\\cosh^{2} x - 1)\\sinh x`, `${K}\\sinh^{3} x`],
            [
              powerRule(plusC([Q.of(k, 4), "\\sinh^{4} x"]), "\\sinh x", "\\cosh x"),
              trigSign(plusC([Q.of(-k, 3), "\\cosh^{3} x"], [k, "\\cosh x"])),
              say(
                plusC([Q.of(k, 3), "\\cosh^{3} x"], [k, "\\cosh x"]),
                "$u^{2} - 1$ integrates to $\\frac{u^{3}}{3} - u$; the second term is subtracted.",
                "$u^{2} - 1$ 积分得 $\\frac{u^{3}}{3} - u$；第二项要减去。",
              ),
            ],
          ),
          substituted(
            `${K}\\cosh^{3} x`,
            plusC([k, "\\sinh x"], [Q.of(k, 3), "\\sinh^{3} x"]),
            [
              "Keep one $\\cosh x$ and turn the rest into $\\sinh x$:",
              "留一个 $\\cosh x$，其余化为 $\\sinh x$：",
              `${K}(1 + \\sinh^{2} x)\\cosh x`,
            ],
            [...bySinh, `${K}\\int (1 + u^{2}) \\, du = ${poly([k, "u"], [Q.of(k, 3), "u^{3}"])} + C`],
            [poly([k, "\\cosh x"], [k, "\\sinh^{2} x\\cosh x"]), `${K}(1 + \\sinh^{2} x)\\cosh x`, `${K}\\cosh^{3} x`],
            [
              powerRule(plusC([Q.of(k, 4), "\\cosh^{4} x"]), "\\cosh x", "\\sinh x"),
              trigSign(plusC([k, "\\sinh x"], [Q.of(-k, 3), "\\sinh^{3} x"])),
              say(
                plusC([Q.of(k, 3), "\\sinh^{3} x"]),
                "This keeps only the $u^{2}$ part of $1 + u^{2}$; the $1$ gives $\\sinh x$ as well.",
                "这里只保留了 $1 + u^{2}$ 中的 $u^{2}$；其中的 $1$ 还要积分出 $\\sinh x$。",
              ),
            ],
          ),
          substituted(
            `${K}\\sinh^{3} x\\cosh^{2} x`,
            plusC([Q.of(k, 5), "\\cosh^{5} x"], [Q.of(-k, 3), "\\cosh^{3} x"]),
            [
              "Keep one $\\sinh x$ and turn the rest into $\\cosh x$:",
              "留一个 $\\sinh x$，其余化为 $\\cosh x$：",
              `${K}(\\cosh^{2} x - 1)\\cosh^{2} x\\sinh x`,
            ],
            [...byCosh, `${K}\\int (u^{4} - u^{2}) \\, du = ${poly([Q.of(k, 5), "u^{5}"], [Q.of(-k, 3), "u^{3}"])} + C`],
            [
              poly([k, "\\cosh^{4} x\\sinh x"], [-k, "\\cosh^{2} x\\sinh x"]),
              `${K}\\cosh^{2} x\\sinh x(\\cosh^{2} x - 1)`,
              `${K}\\sinh^{3} x\\cosh^{2} x`,
            ],
            [
              say(
                plusC([Q.of(k, 5), "\\cosh^{5} x"], [Q.of(k, 3), "\\cosh^{3} x"]),
                "$(u^{2} - 1)u^{2} = u^{4} - u^{2}$, so the $u^{3}$ term is subtracted.",
                "$(u^{2} - 1)u^{2} = u^{4} - u^{2}$，所以 $u^{3}$ 项要减去。",
              ),
              byFactors(plusC([Q.of(k, 12), "\\sinh^{4} x\\cosh^{3} x"])),
              trigSign(plusC([Q.of(-k, 5), "\\cosh^{5} x"], [Q.of(k, 3), "\\cosh^{3} x"])),
            ],
          ),
          substituted(
            `${K}\\cosh^{3} x\\sinh^{2} x`,
            plusC([Q.of(k, 3), "\\sinh^{3} x"], [Q.of(k, 5), "\\sinh^{5} x"]),
            [
              "Keep one $\\cosh x$ and turn the rest into $\\sinh x$:",
              "留一个 $\\cosh x$，其余化为 $\\sinh x$：",
              `${K}(1 + \\sinh^{2} x)\\sinh^{2} x\\cosh x`,
            ],
            [...bySinh, `${K}\\int (u^{2} + u^{4}) \\, du = ${poly([Q.of(k, 3), "u^{3}"], [Q.of(k, 5), "u^{5}"])} + C`],
            [
              poly([k, "\\sinh^{2} x\\cosh x"], [k, "\\sinh^{4} x\\cosh x"]),
              `${K}\\sinh^{2} x\\cosh x(1 + \\sinh^{2} x)`,
              `${K}\\cosh^{3} x\\sinh^{2} x`,
            ],
            [
              trigSign(plusC([Q.of(k, 3), "\\sinh^{3} x"], [Q.of(-k, 5), "\\sinh^{5} x"])),
              byFactors(plusC([Q.of(k, 12), "\\cosh^{4} x\\sinh^{3} x"])),
              say(
                plusC([Q.of(k, 5), "\\sinh^{5} x"]),
                "This keeps only the $u^{4}$ part of $u^{2} + u^{4}$; the $u^{2}$ part gives $\\frac{\\sinh^{3} x}{3}$ as well.",
                "这里只保留了 $u^{2} + u^{4}$ 中的 $u^{4}$；$u^{2}$ 部分还要积分出 $\\frac{\\sinh^{3} x}{3}$。",
              ),
            ],
          ),
        ];
        return fromCase(rng.pick(cases));
      },
    },
  ],
};

/** integrationUsingTheHyperbolicDoubleAngleFormulas integrates sinh², cosh² and sinh·cosh. */
export const integrationUsingTheHyperbolicDoubleAngleFormulas: TopicDef = {
  id: "integration-using-the-hyperbolic-double-angle-formulas",
  title: t("Integration Using the Hyperbolic Double-Angle Formulas", "用双曲二倍角公式积分"),
  summary: t(
    "Integrate even powers and products of sinh and cosh with the hyperbolic double-angle formulas.",
    "用双曲二倍角公式求 sinh、cosh 的偶次幂与乘积的积分。",
  ),
  intro: t(
    "From $\\cosh 2x = \\cosh^{2} x + \\sinh^{2} x$ and $\\cosh^{2} x - \\sinh^{2} x = 1$ comes $\\cosh^{2} x = \\frac{\\cosh 2x + 1}{2}$. So\n\n$$\\int \\cosh^{2} x \\, dx = \\frac{\\sinh 2x}{4} + \\frac{x}{2} + C.$$\n\nCheck: at $x = 0$ the integrand is $\\cosh^{2} 0 = 1$, and the slope of the answer there is $\\frac{\\cosh 0}{2} + \\frac{1}{2} = 1$.\n\nIn this lesson we integrate squares of $\\sinh$ and $\\cosh$, and products of $\\sinh$ and $\\cosh$ of one angle, with the hyperbolic double angle formulas.",
    "由 $\\cosh 2x = \\cosh^{2} x + \\sinh^{2} x$ 与 $\\cosh^{2} x - \\sinh^{2} x = 1$ 得 $\\cosh^{2} x = \\frac{\\cosh 2x + 1}{2}$。所以\n\n$$\\int \\cosh^{2} x \\, dx = \\frac{\\sinh 2x}{4} + \\frac{x}{2} + C$$\n\n检验：在 $x = 0$ 处被积函数为 $\\cosh^{2} 0 = 1$，而答案在那里的斜率是 $\\frac{\\cosh 0}{2} + \\frac{1}{2} = 1$。\n\n本课我们用双曲二倍角公式，求 $\\sinh$、$\\cosh$ 的平方以及同角 $\\sinh$ 与 $\\cosh$ 之积的积分。",
  ),
  prerequisites: ["integration-using-the-hyperbolic-pythagorean-identities"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-squares-of-sinh-and-cosh",
      title: t("Integrating squares of sinh and cosh", "sinh 与 cosh 平方的积分"),
      explanation: t(
        "Just as with sine and cosine, the double angle formula lowers the power, so the square becomes a constant plus a hyperbolic cosine of the doubled angle. From $\\cosh 2\\theta = \\cosh^{2} \\theta + \\sinh^{2} \\theta$ and $\\cosh^{2} \\theta - \\sinh^{2} \\theta = 1$: $\\cosh^{2} \\theta = \\frac{\\cosh 2\\theta + 1}{2}$ and $\\sinh^{2} \\theta = \\frac{\\cosh 2\\theta - 1}{2}$. So\n\n$$\\int \\sinh^{2}(ax) \\, dx = \\frac{\\sinh(2ax)}{4a} - \\frac{x}{2} + C, \\qquad \\int \\cosh^{2}(ax) \\, dx = \\frac{\\sinh(2ax)}{4a} + \\frac{x}{2} + C.$$\n\nFor example, $\\int \\sinh^{2}(2x) \\, dx = \\frac{\\sinh(4x)}{8} - \\frac{x}{2} + C$.\n\nCheck: differentiating gives $\\frac{\\cosh(4x)}{2} - \\frac{1}{2}$, which is $\\sinh^{2}(2x)$ by the formula.\n\n> **Watch out.** The signs are not those of the trigonometric formulas: $\\sinh^{2} \\theta = \\frac{\\cosh 2\\theta - 1}{2}$ has the $-1$ at the end, and $\\cosh 2\\theta$ integrates to $+\\frac{\\sinh 2\\theta}{2}$, with no minus sign.",
        "与正弦和余弦一样，二倍角公式可以降幂，平方变成一个常数加上二倍角的双曲余弦。由 $\\cosh 2\\theta = \\cosh^{2} \\theta + \\sinh^{2} \\theta$ 与 $\\cosh^{2} \\theta - \\sinh^{2} \\theta = 1$ 得 $\\cosh^{2} \\theta = \\frac{\\cosh 2\\theta + 1}{2}$，$\\sinh^{2} \\theta = \\frac{\\cosh 2\\theta - 1}{2}$。所以\n\n$$\\int \\sinh^{2}(ax) \\, dx = \\frac{\\sinh(2ax)}{4a} - \\frac{x}{2} + C, \\qquad \\int \\cosh^{2}(ax) \\, dx = \\frac{\\sinh(2ax)}{4a} + \\frac{x}{2} + C$$\n\n例如，$\\int \\sinh^{2}(2x) \\, dx = \\frac{\\sinh(4x)}{8} - \\frac{x}{2} + C$。\n\n检验：求导得 $\\frac{\\cosh(4x)}{2} - \\frac{1}{2}$，由公式它就是 $\\sinh^{2}(2x)$。\n\n> **注意。** 符号与三角公式不同：$\\sinh^{2} \\theta = \\frac{\\cosh 2\\theta - 1}{2}$ 的 $-1$ 在后面，而 $\\cosh 2\\theta$ 积分得 $+\\frac{\\sinh 2\\theta}{2}$，没有负号。",
      ),
      generate(rng) {
        const k = rng.nonZero(-8, 8);
        const a = rng.int(1, 4);
        const sinh = rng.bool();
        const s = sinh ? -1 : 1;
        const f = sinh ? "\\sinh" : "\\cosh";
        const arg = a === 1 ? "x" : `${a}x`;
        const integrand = `${coef(Q.of(k))}${a === 1 ? `${f}^{2} x` : `${f}^{2}(${a}x)`}`;
        const answer = plusC([Q.of(k, 4 * a), fn("\\sinh", 2 * a)], [Q.of(s * k, 2), "x"]);
        const lowered = poly([Q.of(k, 2), fn("\\cosh", 2 * a)], [Q.of(s * k, 2), ""]);
        return fromCase({
          integrand,
          answer,
          steps: [
            [
              ["Lower the power", "降幂"],
              t(
                `Use $${f}^{2} \\theta = \\frac{\\cosh 2\\theta ${sinh ? "-" : "+"} 1}{2}$ with $\\theta = ${arg}$:`,
                `用 $${f}^{2} \\theta = \\frac{\\cosh 2\\theta ${sinh ? "-" : "+"} 1}{2}$，其中 $\\theta = ${arg}$：`,
              ),
              [`${integrand} = ${lowered}`],
            ],
            [
              ["Integrate each term", "逐项积分"],
              t(
                `$\\int ${fn("\\cosh", 2 * a)} \\, dx = \\frac{${fn("\\sinh", 2 * a)}}{${2 * a}}$, and the constant gives a multiple of $x$:`,
                `$\\int ${fn("\\cosh", 2 * a)} \\, dx = \\frac{${fn("\\sinh", 2 * a)}}{${2 * a}}$，常数积分得 $x$ 的倍数：`,
              ),
              [`\\int ${integrand} \\, dx = ${answer}`],
            ],
          ],
          check: differentiated([derivativeOf(answer, lowered)], ["the chain rule", "链式法则"]),
          mistakes: [
            say(
              plusC([Q.of(k, 4 * a), fn("\\sinh", 2 * a)], [Q.of(-s * k, 2), "x"]),
              sinh
                ? "$\\sinh^{2} \\theta = \\frac{\\cosh 2\\theta - 1}{2}$, so the $x$ term is subtracted."
                : "$\\cosh^{2} \\theta = \\frac{\\cosh 2\\theta + 1}{2}$, so the $x$ term is added.",
              sinh
                ? "$\\sinh^{2} \\theta = \\frac{\\cosh 2\\theta - 1}{2}$，所以 $x$ 项要减去。"
                : "$\\cosh^{2} \\theta = \\frac{\\cosh 2\\theta + 1}{2}$，所以 $x$ 项要加上。",
            ),
            say(
              plusC([Q.of(k, 3 * a), a === 1 ? `${f}^{3} x` : `${f}^{3}(${a}x)`]),
              `This treats $${f}^{2}$ like $x^{2}$ in the power rule; differentiating $${f}^{3}$ would bring out an extra factor by the chain rule, so lower the power first.`,
              `这是把 $${f}^{2}$ 当作 $x^{2}$ 用幂法则；对 $${f}^{3}$ 求导时链式法则会多出因子，所以要先降幂。`,
            ),
            say(
              plusC([Q.of(k, 2 * a), fn("\\sinh", 2 * a)], [Q.of(s * k, 2), "x"]),
              `The formula's factor $\\frac{1}{2}$ and the $\\frac{1}{${2 * a}}$ from integrating $${fn("\\cosh", 2 * a)}$ multiply to $\\frac{1}{${4 * a}}$; one of them was left out.`,
              `公式中的因子 $\\frac{1}{2}$ 与积分 $${fn("\\cosh", 2 * a)}$ 产生的 $\\frac{1}{${2 * a}}$ 相乘得 $\\frac{1}{${4 * a}}$；漏掉了其中一个。`,
            ),
          ],
        });
      },
    },
    {
      id: "integrating-products-of-sinh-and-cosh",
      title: t("Integrating products of sinh and cosh", "sinh 与 cosh 之积的积分"),
      explanation: t(
        "The product of hyperbolic sine and cosine of one angle is half the hyperbolic sine of the doubled angle, which integrates directly. Use $\\sinh 2\\theta = 2\\sinh \\theta\\cosh \\theta$: $\\int \\sinh(ax)\\cosh(ax) \\, dx = \\frac{\\cosh(2ax)}{4a} + C$. Squaring, $\\sinh^{2} x\\cosh^{2} x = \\frac{1}{4}\\sinh^{2} 2x = \\frac{\\cosh 4x - 1}{8}$, so $\\int \\sinh^{2} x\\cosh^{2} x \\, dx = \\frac{\\sinh 4x}{32} - \\frac{x}{8} + C$.\n\nCheck: differentiating $\\frac{\\cosh(2ax)}{4a}$ gives $\\frac{\\sinh(2ax)}{2}$, which is $\\sinh(ax)\\cosh(ax)$.\n\n> **Watch out.** Integrating $\\sinh$ gives $+\\cosh$, with no minus sign, unlike $\\int \\sin = -\\cos$. Substituting $u = \\sinh(ax)$ gives $\\frac{\\sinh^{2}(ax)}{2a} + C$ instead, which differs only by a constant and is also right.",
        "同一个角的双曲正弦与双曲余弦之积等于二倍角双曲正弦的一半，可以直接积分。利用 $\\sinh 2\\theta = 2\\sinh \\theta\\cosh \\theta$：$\\int \\sinh(ax)\\cosh(ax) \\, dx = \\frac{\\cosh(2ax)}{4a} + C$。平方得 $\\sinh^{2} x\\cosh^{2} x = \\frac{1}{4}\\sinh^{2} 2x = \\frac{\\cosh 4x - 1}{8}$，所以 $\\int \\sinh^{2} x\\cosh^{2} x \\, dx = \\frac{\\sinh 4x}{32} - \\frac{x}{8} + C$。\n\n检验：对 $\\frac{\\cosh(2ax)}{4a}$ 求导得 $\\frac{\\sinh(2ax)}{2}$，即 $\\sinh(ax)\\cosh(ax)$。\n\n> **注意。** 积分 $\\sinh$ 得 $+\\cosh$，没有负号，与 $\\int \\sin = -\\cos$ 不同。若代换 $u = \\sinh(ax)$，会得到 $\\frac{\\sinh^{2}(ax)}{2a} + C$，它只差一个常数，同样正确。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const K = coef(Q.of(k));
        if (rng.bool(0.3)) {
          const integrand = `${K}\\sinh^{2} x\\cosh^{2} x`;
          const answer = plusC([Q.of(k, 32), "\\sinh(4x)"], [Q.of(-k, 8), "x"]);
          return fromCase({
            integrand,
            answer,
            steps: [
              [
                ["Use the double angle formula twice", "两次用二倍角公式"],
                t(
                  "$\\sinh x\\cosh x = \\frac{1}{2}\\sinh(2x)$; square it and lower the power again:",
                  "$\\sinh x\\cosh x = \\frac{1}{2}\\sinh(2x)$；平方后再降幂一次：",
                ),
                ["\\sinh^{2} x\\cosh^{2} x = \\frac{1}{4}\\sinh^{2}(2x) = \\frac{\\cosh(4x) - 1}{8}"],
              ],
              [
                ["Integrate", "积分"],
                t(`Integrate each term${k === 1 ? "" : ` and multiply by $${k}$`}:`, `逐项积分${k === 1 ? "" : `，再乘以 $${k}$`}：`),
                [`\\int ${integrand} \\, dx = ${answer}`],
              ],
            ],
            check: differentiated(
              [derivativeOf(answer, poly([Q.of(k, 8), "\\cosh(4x)"], [Q.of(-k, 8), ""]))],
              ["the chain rule", "链式法则"],
            ),
            mistakes: [
              say(
                plusC([Q.of(k, 32), "\\sinh(4x)"], [Q.of(k, 8), "x"]),
                "$\\sinh^{2} \\theta = \\frac{\\cosh 2\\theta - 1}{2}$, so the $x$ term is subtracted.",
                "$\\sinh^{2} \\theta = \\frac{\\cosh 2\\theta - 1}{2}$，所以 $x$ 项要减去。",
              ),
              byFactors(plusC([Q.of(k, 9), "\\sinh^{3} x\\cosh^{3} x"])),
              say(
                plusC([Q.of(k, 16), "\\sinh(4x)"], [Q.of(-k, 4), "x"]),
                "Squaring $\\frac{1}{2}\\sinh(2x)$ gives $\\frac{1}{4}\\sinh^{2}(2x)$, not $\\frac{1}{2}\\sinh^{2}(2x)$; this result is twice the integral.",
                "$\\frac{1}{2}\\sinh(2x)$ 平方得 $\\frac{1}{4}\\sinh^{2}(2x)$，不是 $\\frac{1}{2}\\sinh^{2}(2x)$；这个结果是积分的两倍。",
              ),
            ],
          });
        }
        const a = rng.int(1, 5);
        const integrand = `${K}${fn("\\sinh", a)} ${fn("\\cosh", a)}`;
        const answer = plusC([Q.of(k, 4 * a), fn("\\cosh", 2 * a)]);
        const half = poly([Q.of(k, 2), fn("\\sinh", 2 * a)]);
        return fromCase({
          integrand,
          answer,
          steps: [
            [
              ["Use the double angle formula", "用二倍角公式"],
              t(
                "$\\sinh \\theta\\cosh \\theta = \\frac{1}{2}\\sinh 2\\theta$:",
                "$\\sinh \\theta\\cosh \\theta = \\frac{1}{2}\\sinh 2\\theta$：",
              ),
              [`${integrand} = ${half}`],
            ],
            [
              ["Integrate", "积分"],
              t(
                `$\\int ${fn("\\sinh", 2 * a)} \\, dx = \\frac{${fn("\\cosh", 2 * a)}}{${2 * a}}$, and the factor $${Q.of(k, 2).toLatex()}$ multiplies it:`,
                `$\\int ${fn("\\sinh", 2 * a)} \\, dx = \\frac{${fn("\\cosh", 2 * a)}}{${2 * a}}$，再乘以因子 $${Q.of(k, 2).toLatex()}$：`,
              ),
              [`\\int ${integrand} \\, dx = ${answer}`],
            ],
          ],
          check: differentiated([derivativeOf(answer, half)], ["the chain rule", "链式法则"]),
          mistakes: [
            say(
              plusC([Q.of(-k, 4 * a), fn("\\cosh", 2 * a)]),
              "Integrating $\\sinh$ gives $+\\cosh$; the minus sign belongs to $\\int \\sin = -\\cos$.",
              "积分 $\\sinh$ 得 $+\\cosh$；负号属于 $\\int \\sin = -\\cos$。",
            ),
            say(
              plusC([Q.of(k, 2 * a), fn("\\cosh", 2 * a)]),
              "The factor $\\frac{1}{2}$ from $\\sinh \\theta\\cosh \\theta = \\frac{1}{2}\\sinh 2\\theta$ is missing.",
              "漏掉了 $\\sinh \\theta\\cosh \\theta = \\frac{1}{2}\\sinh 2\\theta$ 中的因子 $\\frac{1}{2}$。",
            ),
            say(
              plusC([Q.of(k, 4 * a), fn("\\sinh", 2 * a)]),
              "The derivative of $\\cosh$ is $\\sinh$, so integrating $\\sinh 2\\theta$ gives a hyperbolic cosine, not a hyperbolic sine.",
              "$\\cosh$ 的导数是 $\\sinh$，所以 $\\sinh 2\\theta$ 积分得双曲余弦，不是双曲正弦。",
            ),
          ],
        });
      },
    },
  ],
};

/** ax writes a·x: "x", "3x", "-2x". */
const ax = (a: number) => poly([a, "x"]);

/** minusInt writes "− ∫ c·body dx" with the sign of c folded in: "- \int \frac{1}{2}e^{2x} \, dx", "+ \int \cos x \, dx". */
const minusInt = (c: Q, body: string) => `${c.sign() < 0 ? "+" : "-"} \\int ${coef(c.abs())}${body} \\, dx`;

/** over writes top / m, leaving the denominator 1 out. */
const over = (top: string, m: number) => (m === 1 ? top : `\\frac{${top}}{${m}}`);

/** onlyUv is the reason for stopping at uv without subtracting ∫v du. */
const onlyUv = (response: string) =>
  say(
    response,
    "This is only $uv$; the integral $\\int v \\, du$ still has to be subtracted.",
    "这只是 $uv$；还要减去积分 $\\int v \\, du$。",
  );

/** introductionToIntegrationByParts integrates x·e^(ax), x·sin(ax) and x·cos(ax) and chooses u and dv. */
export const introductionToIntegrationByParts: TopicDef = {
  id: "introduction-to-integration-by-parts",
  title: t("Introduction to Integration by Parts", "分部积分法入门"),
  summary: t(
    "Integrate products with ∫u dv = uv − ∫v du, choosing u to become simpler when differentiated.",
    "用 ∫u dv = uv − ∫v du 求乘积的积分，选取求导后变简单的因子为 u。",
  ),
  intro: t(
    "No rule integrates $xe^{x}$ directly, but the product rule run backwards does. Take $u = x$, which becomes $1$ when differentiated, and $dv = e^{x} \\, dx$, so $v = e^{x}$:\n\n$$\\int xe^{x} \\, dx = xe^{x} - \\int e^{x} \\, dx = xe^{x} - e^{x} + C.$$\n\nCheck: by the product rule, $\\frac{d}{dx}(xe^{x} - e^{x}) = e^{x} + xe^{x} - e^{x} = xe^{x}$.\n\nIn this lesson we use $\\int u \\, dv = uv - \\int v \\, du$ to integrate $x$ times an exponential, a sine or a cosine, and learn how to choose $u$ and $dv$.",
    "没有哪条法则能直接积分 $xe^{x}$，但把乘积法则反过来用就可以。取 $u = x$，求导后变成 $1$；取 $dv = e^{x} \\, dx$，则 $v = e^{x}$：\n\n$$\\int xe^{x} \\, dx = xe^{x} - \\int e^{x} \\, dx = xe^{x} - e^{x} + C$$\n\n检验：由乘积法则，$\\frac{d}{dx}(xe^{x} - e^{x}) = e^{x} + xe^{x} - e^{x} = xe^{x}$。\n\n本课我们用 $\\int u \\, dv = uv - \\int v \\, du$ 求 $x$ 乘指数函数、正弦或余弦的积分，并学习如何选择 $u$ 与 $dv$。",
  ),
  prerequisites: ["integrating-exponential-functions-using-linear-substitution"],
  encompasses: [{ topic: "integrating-exponential-functions-using-linear-substitution", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-x-times-exponential-or-trigonometric-functions",
      title: t("Integrating x times exponential or trigonometric functions", "x 乘指数或三角函数的积分"),
      explanation: t(
        "Choose the factor that gets simpler when differentiated, here the power of the variable, and integrate the other factor. Integrating the product rule $(uv)' = u'v + uv'$ gives\n\n$$\\int u \\, dv = uv - \\int v \\, du.$$\n\nFor $\\int xe^{2x} \\, dx$ take $u = x$ and $dv = e^{2x} \\, dx$, so $du = dx$ and $v = \\frac{1}{2}e^{2x}$:\n\n$$\\int xe^{2x} \\, dx = \\frac{1}{2}xe^{2x} - \\int \\frac{1}{2}e^{2x} \\, dx = \\frac{1}{2}xe^{2x} - \\frac{1}{4}e^{2x} + C.$$\n\nCheck: by the product rule, the derivative is $\\frac{1}{2}e^{2x} + xe^{2x} - \\frac{1}{2}e^{2x} = xe^{2x}$.\n\n> **Watch out.** The formula subtracts $\\int v \\, du$; do not stop at $uv$, and do not add. And $v$ must be a true antiderivative of $dv$: $\\int e^{2x} \\, dx = \\frac{1}{2}e^{2x}$, $\\int \\sin(ax) \\, dx = -\\frac{1}{a}\\cos(ax)$.",
        "选择求导后变简单的因子，这里是变量的幂，再对另一个因子积分。对乘积法则 $(uv)' = u'v + uv'$ 积分，得\n\n$$\\int u \\, dv = uv - \\int v \\, du$$\n\n对 $\\int xe^{2x} \\, dx$，取 $u = x$，$dv = e^{2x} \\, dx$，则 $du = dx$，$v = \\frac{1}{2}e^{2x}$：\n\n$$\\int xe^{2x} \\, dx = \\frac{1}{2}xe^{2x} - \\int \\frac{1}{2}e^{2x} \\, dx = \\frac{1}{2}xe^{2x} - \\frac{1}{4}e^{2x} + C$$\n\n检验：由乘积法则，导数为 $\\frac{1}{2}e^{2x} + xe^{2x} - \\frac{1}{2}e^{2x} = xe^{2x}$。\n\n> **注意。** 公式是减去 $\\int v \\, du$；不能停在 $uv$，也不能加上。而且 $v$ 必须真是 $dv$ 的原函数：$\\int e^{2x} \\, dx = \\frac{1}{2}e^{2x}$，$\\int \\sin(ax) \\, dx = -\\frac{1}{a}\\cos(ax)$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-6, 6);
        const kind = rng.int(0, 2);
        const choose = (dv: string, v: string): Step => [
          ["Choose u and dv", "选择 u 与 dv"],
          t(
            `Take $u = x$, which becomes $1$ when differentiated, and $dv = ${dv} \\, dx$, so $du = dx$ and $v = ${v}$.`,
            `取 $u = x$，求导后变成 $1$；取 $dv = ${dv} \\, dx$，则 $du = dx$，$v = ${v}$。`,
          ),
        ];
        const apply = (line: string): Step => [
          ["Apply the formula", "套用公式"],
          t("Use $\\int u \\, dv = uv - \\int v \\, du$:", "用 $\\int u \\, dv = uv - \\int v \\, du$："),
          [line],
        ];
        const productRule: readonly [string, string] = ["the product rule", "乘积法则"];
        if (kind === 0) {
          const a = rng.pick([1, 2, 3, 4, -1, -2, -3]);
          const e = `e^{${ax(a)}}`;
          const integrand = `${poly([k, "x"])}${e}`;
          const answer = plusC([Q.of(k, a), `x${e}`], [Q.of(-k, a * a), e]);
          const base = plusC([Q.of(1, a), `x${e}`], [Q.of(-1, a * a), e]);
          return fromCase({
            integrand,
            answer,
            steps: [
              choose(e, `${coef(Q.of(1, a))}${e}`),
              apply(`\\int x${e} \\, dx = ${coef(Q.of(1, a))}x${e} ${minusInt(Q.of(1, a), e)} = ${base}`),
              ...scaledBy(k, integrand, answer),
            ],
            check: differentiated(
              [derivativeOf(answer, poly([Q.of(k, a), e], [k, `x${e}`], [Q.of(-k, a), e])), `= ${integrand}`],
              productRule,
            ),
            mistakes: [
              say(
                plusC([Q.of(k, a), `x${e}`], [Q.of(k, a * a), e]),
                "The formula is $uv - \\int v \\, du$: the second integral is subtracted, so the $e$ term has the wrong sign.",
                "公式是 $uv - \\int v \\, du$：第二个积分要减去，所以 $e$ 项的符号错了。",
              ),
              byFactors(plusC([Q.of(k, 2 * a), `x^{2}${e}`])),
              onlyUv(plusC([Q.of(k, a), `x${e}`])),
            ],
          });
        }
        const a = rng.int(1, 4);
        const sine = kind === 1;
        const [sin, cos] = [fn("\\sin", a), fn("\\cos", a)];
        const integrand = `${poly([k, "x"])}${sine ? sin : cos}`;
        // ∫x sin(ax) = −x cos(ax)/a + sin(ax)/a²; ∫x cos(ax) = x sin(ax)/a + cos(ax)/a².
        const answer = sine
          ? plusC([Q.of(-k, a), `x${cos}`], [Q.of(k, a * a), sin])
          : plusC([Q.of(k, a), `x${sin}`], [Q.of(k, a * a), cos]);
        const base = sine ? plusC([Q.of(-1, a), `x${cos}`], [Q.of(1, a * a), sin]) : plusC([Q.of(1, a), `x${sin}`], [Q.of(1, a * a), cos]);
        const v = sine ? `${coef(Q.of(-1, a))}${cos}` : `${coef(Q.of(1, a))}${sin}`;
        const line = sine
          ? `\\int x${sin} \\, dx = ${poly([Q.of(-1, a), `x${cos}`])} ${minusInt(Q.of(-1, a), cos)} = ${base}`
          : `\\int x${cos} \\, dx = ${poly([Q.of(1, a), `x${sin}`])} ${minusInt(Q.of(1, a), sin)} = ${base}`;
        const raw = sine
          ? poly([Q.of(-k, a), cos], [k, `x${sin}`], [Q.of(k, a), cos])
          : poly([Q.of(k, a), sin], [k, `x${cos}`], [Q.of(-k, a), sin]);
        return fromCase({
          integrand,
          answer,
          steps: [choose(sine ? sin : cos, v), apply(line), ...scaledBy(k, integrand, answer)],
          check: differentiated([derivativeOf(answer, raw), `= ${integrand}`], productRule),
          mistakes: sine
            ? [
                say(
                  plusC([Q.of(-k, a), `x${cos}`], [Q.of(-k, a * a), sin]),
                  "Here $v = -\\frac{1}{a}\\cos(ax)$, so subtracting $\\int v \\, du$ adds $\\int \\frac{1}{a}\\cos(ax) \\, dx$: the sine term is positive.",
                  "这里 $v = -\\frac{1}{a}\\cos(ax)$，减去 $\\int v \\, du$ 等于加上 $\\int \\frac{1}{a}\\cos(ax) \\, dx$：正弦项为正。",
                ),
                say(
                  plusC([Q.of(k, a), `x${cos}`], [Q.of(k, a * a), sin]),
                  "The antiderivative of $\\sin(ax)$ is $-\\frac{1}{a}\\cos(ax)$, so $uv$ carries a minus sign.",
                  "$\\sin(ax)$ 的原函数是 $-\\frac{1}{a}\\cos(ax)$，所以 $uv$ 带负号。",
                ),
                byFactors(plusC([Q.of(-k, 2 * a), `x^{2}${cos}`])),
              ]
            : [
                say(
                  plusC([Q.of(k, a), `x${sin}`], [Q.of(-k, a * a), cos]),
                  "$\\int \\frac{1}{a}\\sin(ax) \\, dx = -\\frac{1}{a^{2}}\\cos(ax)$, and subtracting it makes the cosine term positive.",
                  "$\\int \\frac{1}{a}\\sin(ax) \\, dx = -\\frac{1}{a^{2}}\\cos(ax)$，减去它后余弦项为正。",
                ),
                say(
                  plusC([Q.of(-k, a), `x${sin}`], [Q.of(k, a * a), cos]),
                  "The antiderivative of $\\cos(ax)$ is $+\\frac{1}{a}\\sin(ax)$, so $uv$ has no minus sign.",
                  "$\\cos(ax)$ 的原函数是 $+\\frac{1}{a}\\sin(ax)$，所以 $uv$ 没有负号。",
                ),
                byFactors(plusC([Q.of(k, 2 * a), `x^{2}${sin}`])),
              ],
        });
      },
    },
    {
      id: "choosing-u-and-dv",
      title: t("Choosing u and dv", "选择 u 与 dv"),
      explanation: t(
        "Choose $u$ to be the factor that becomes simpler when differentiated, and $dv$ a factor you can integrate. A common order of preference for $u$ is LIATE: Logarithmic, Inverse trigonometric, Algebraic (powers of $x$), Trigonometric, Exponential. In $\\int x\\ln x \\, dx$ take $u = \\ln x$, since $\\ln x$ is hard to integrate but its derivative $\\frac{1}{x}$ is simple.\n\nCheck: with $u = \\ln x$ and $dv = x \\, dx$, $\\int x\\ln x \\, dx = \\frac{x^{2}\\ln x}{2} - \\int \\frac{x}{2} \\, dx$, and the new integral is a plain power of $x$.\n\n> **Watch out.** LIATE is only a guide. What matters is that $\\int v \\, du$ is simpler than the integral you started with; if it is not, swap the choice.",
        "选求导后变简单的因子作 $u$，选能积分的因子作 $dv$。选 $u$ 的常用优先顺序是“对反幂三指”：对数函数、反三角函数、幂函数（$x$ 的幂）、三角函数、指数函数。对 $\\int x\\ln x \\, dx$ 取 $u = \\ln x$，因为 $\\ln x$ 不易积分，而它的导数 $\\frac{1}{x}$ 很简单。\n\n检验：取 $u = \\ln x$，$dv = x \\, dx$，则 $\\int x\\ln x \\, dx = \\frac{x^{2}\\ln x}{2} - \\int \\frac{x}{2} \\, dx$，新积分只是 $x$ 的幂。\n\n> **注意。** “对反幂三指”只是参考。关键是 $\\int v \\, du$ 要比原来的积分简单；如果不是，就把选择换过来。",
      ),
      generate(rng) {
        const a = rng.int(2, 6);
        const n = rng.int(1, 4);
        const pair = (u: string, dv: string) => t(`$u = ${u}$, $dv = ${dv} \\, dx$`, `$u = ${u}$，$dv = ${dv} \\, dx$`);
        const down = n === 1 ? "1" : poly([n, xPow(n - 1)]);
        const swappedPower = (u: string, dv: string, integral: string) =>
          t(
            `With the parts swapped, $u = ${u}$ and $dv = ${dv} \\, dx$ give the new integral $\\int ${integral} \\, dx$: the power of $x$ goes up from $${n}$ to $${n + 1}$, so it is harder than before.`,
            `如果两部分对调，$u = ${u}$，$dv = ${dv} \\, dx$，新积分是 $\\int ${integral} \\, dx$：$x$ 的次数从 $${n}$ 升到 $${n + 1}$，比原来更难。`,
          );
        const cases = [
          {
            f: `${xPow(n)}e^{${a}x}`,
            u: xPow(n),
            dv: `e^{${a}x}`,
            du: down,
            v: `\\frac{1}{${a}}e^{${a}x}`,
            line: `\\int ${xPow(n)}e^{${a}x} \\, dx = \\frac{1}{${a}}${xPow(n)}e^{${a}x} - \\int ${coef(Q.of(n, a))}${xPow(n - 1)}e^{${a}x} \\, dx`,
            check: swappedPower(`e^{${a}x}`, xPow(n), `${coef(Q.of(a, n + 1))}${xPow(n + 1)}e^{${a}x}`),
          },
          {
            f: `${xPow(n)}\\ln x`,
            u: "\\ln x",
            dv: xPow(n),
            du: "\\frac{1}{x}",
            v: `\\frac{${xPow(n + 1)}}{${n + 1}}`,
            line: `\\int ${xPow(n)}\\ln x \\, dx = \\frac{${xPow(n + 1)}\\ln x}{${n + 1}} - \\int \\frac{${xPow(n)}}{${n + 1}} \\, dx`,
            check: t(
              `With the parts swapped, $dv = \\ln x \\, dx$ needs $v = x\\ln x - x$, and the new integral $\\int ${n === 1 ? "" : down}(x\\ln x - x) \\, dx$ still contains $\\ln x$, now with a higher power of $x$.`,
              `如果两部分对调，$dv = \\ln x \\, dx$ 需要 $v = x\\ln x - x$，新积分 $\\int ${n === 1 ? "" : down}(x\\ln x - x) \\, dx$ 仍含 $\\ln x$，而且 $x$ 的次数更高。`,
            ),
          },
          {
            f: `${xPow(n)}\\sin(${a}x)`,
            u: xPow(n),
            dv: `\\sin(${a}x)`,
            du: down,
            v: `-\\frac{1}{${a}}\\cos(${a}x)`,
            line: `\\int ${xPow(n)}\\sin(${a}x) \\, dx = -\\frac{1}{${a}}${xPow(n)}\\cos(${a}x) + \\int ${coef(Q.of(n, a))}${xPow(n - 1)}\\cos(${a}x) \\, dx`,
            check: swappedPower(`\\sin(${a}x)`, xPow(n), `${coef(Q.of(a, n + 1))}${xPow(n + 1)}\\cos(${a}x)`),
          },
          {
            f: `${xPow(n)}\\arctan x`,
            u: "\\arctan x",
            dv: xPow(n),
            du: "\\frac{1}{1 + x^{2}}",
            v: `\\frac{${xPow(n + 1)}}{${n + 1}}`,
            line: `\\int ${xPow(n)}\\arctan x \\, dx = \\frac{${xPow(n + 1)}\\arctan x}{${n + 1}} - \\int \\frac{${xPow(n + 1)}}{${n + 1}(1 + x^{2})} \\, dx`,
            check: t(
              "With the parts swapped, $dv = \\arctan x \\, dx$ needs an antiderivative of $\\arctan x$, which itself takes integration by parts, so the swap only makes the work longer.",
              "如果两部分对调，$dv = \\arctan x \\, dx$ 需要 $\\arctan x$ 的原函数，而它本身就要用分部积分求，对调只会让计算更长。",
            ),
          },
          {
            f: `${xPow(n)}\\cos(${a}x)`,
            u: xPow(n),
            dv: `\\cos(${a}x)`,
            du: down,
            v: `\\frac{1}{${a}}\\sin(${a}x)`,
            line: `\\int ${xPow(n)}\\cos(${a}x) \\, dx = \\frac{1}{${a}}${xPow(n)}\\sin(${a}x) - \\int ${coef(Q.of(n, a))}${xPow(n - 1)}\\sin(${a}x) \\, dx`,
            check: swappedPower(`\\cos(${a}x)`, xPow(n), `${coef(Q.of(-a, n + 1))}${xPow(n + 1)}\\sin(${a}x)`),
          },
        ];
        const c = rng.pick(cases);
        return reasoned(
          oneOf(
            rng,
            t(
              `Which choice of $u$ and $dv$ makes $\\int ${c.f} \\, dx$ simpler by integration by parts?`,
              `用分部积分求 $\\int ${c.f} \\, dx$ 时，哪种 $u$ 与 $dv$ 的选择能使积分变简单？`,
            ),
            pair(c.u, c.dv),
            [pair(c.dv, c.u), pair(c.f, "1"), pair("1", c.f)],
            walked(
              [
                [
                  ["Look at what differentiation does", "看求导的效果"],
                  t(
                    `Differentiating $${c.u}$ gives $${c.du}$, which is simpler, and $${c.dv} \\, dx$ integrates to $v = ${c.v}$. So take $u = ${c.u}$ and $dv = ${c.dv} \\, dx$.`,
                    `对 $${c.u}$ 求导得 $${c.du}$，更简单；而 $${c.dv} \\, dx$ 积分得 $v = ${c.v}$。所以取 $u = ${c.u}$，$dv = ${c.dv} \\, dx$。`,
                  ),
                ],
                [
                  ["Write the new integral", "写出新积分"],
                  t(
                    "By $\\int u \\, dv = uv - \\int v \\, du$, the remaining integral is simpler:",
                    "由 $\\int u \\, dv = uv - \\int v \\, du$，剩下的积分更简单：",
                  ),
                  [c.line],
                ],
              ],
              c.check,
            ),
          ),
          [
            [
              pair(c.dv, c.u).en,
              "These are the right parts in the wrong places: the new integral gets no simpler this way round.",
              "两部分放反了：这样得到的新积分不会更简单。",
            ],
            [
              pair(c.f, "1").en,
              "Taking the whole integrand as $u$ makes the new integral harder, not simpler.",
              "把整个被积函数取作 $u$，新积分会更难，而不是更简单。",
            ],
            [
              pair("1", c.f).en,
              "To use this you would have to integrate the whole integrand, which is the original problem.",
              "这样就得先积出整个被积函数，而这正是原来的问题。",
            ],
          ],
        );
      },
    },
  ],
};

/** usingIntegrationByPartsToCalculateIntegralsWithLogarithms integrates x^n·ln x, (ln x)² and ln x / x^n. */
export const usingIntegrationByPartsToCalculateIntegralsWithLogarithms: TopicDef = {
  id: "using-integration-by-parts-to-calculate-integrals-with-logarithms",
  title: t("Using Integration by Parts to Calculate Integrals With Logarithms", "用分部积分法求含对数的积分"),
  summary: t("Take u = ln x to integrate products of powers of x and logarithms.", "取 u = ln x，求 x 的幂与对数之积的积分。"),
  intro: t(
    "$\\ln x$ has no obvious antiderivative, but it is easy to differentiate. Write it as $\\ln x \\cdot 1$ and take $u = \\ln x$, $dv = dx$, so $du = \\frac{1}{x} \\, dx$ and $v = x$:\n\n$$\\int \\ln x \\, dx = x\\ln x - \\int x \\cdot \\frac{1}{x} \\, dx = x\\ln x - x + C.$$\n\nCheck: by the product rule, $\\frac{d}{dx}(x\\ln x - x) = \\ln x + 1 - 1 = \\ln x$.\n\nIn this lesson we take $u = \\ln x$ to integrate powers of $x$ times $\\ln x$, and go on to $(\\ln x)^{2}$ and $\\ln x$ over a power of $x$.",
    "$\\ln x$ 没有明显的原函数，但它容易求导。把它写成 $\\ln x \\cdot 1$，取 $u = \\ln x$，$dv = dx$，则 $du = \\frac{1}{x} \\, dx$，$v = x$：\n\n$$\\int \\ln x \\, dx = x\\ln x - \\int x \\cdot \\frac{1}{x} \\, dx = x\\ln x - x + C$$\n\n检验：由乘积法则，$\\frac{d}{dx}(x\\ln x - x) = \\ln x + 1 - 1 = \\ln x$。\n\n本课我们取 $u = \\ln x$，求 $x$ 的幂乘 $\\ln x$ 的积分，再求 $(\\ln x)^{2}$ 以及 $\\ln x$ 除以 $x$ 的幂的积分。",
  ),
  prerequisites: ["introduction-to-integration-by-parts", "integrating-logarithmic-functions-using-substitution"],
  encompasses: [{ topic: "introduction-to-integration-by-parts", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-powers-of-x-times-ln-x",
      title: t("Integrating powers of x times ln x", "x 的幂乘 ln x 的积分"),
      explanation: t(
        "The logarithm is hard to integrate but easy to differentiate, so let it be the part you differentiate and integrate the power instead. Take $u = \\ln x$ and $dv = x^{n} \\, dx$, so $du = \\frac{1}{x} \\, dx$ and $v = \\frac{x^{n + 1}}{n + 1}$:\n\n$$\\int x^{n}\\ln x \\, dx = \\frac{x^{n + 1}\\ln x}{n + 1} - \\frac{x^{n + 1}}{(n + 1)^{2}} + C.$$\n\nWith $n = 0$ this gives $\\int \\ln x \\, dx = x\\ln x - x + C$.\n\nCheck: differentiating $\\frac{x^{n + 1}\\ln x}{n + 1}$ gives $x^{n}\\ln x + \\frac{x^{n}}{n + 1}$, and the second term cancels the derivative of $-\\frac{x^{n + 1}}{(n + 1)^{2}}$.\n\n> **Watch out.** $v \\, du = \\frac{x^{n + 1}}{n + 1} \\cdot \\frac{1}{x} = \\frac{x^{n}}{n + 1}$, and integrating it divides by $n + 1$ a second time, so the last term is over $(n + 1)^{2}$.",
        "对数难以积分但容易求导，所以让它作为求导的部分，而对幂积分。取 $u = \\ln x$，$dv = x^{n} \\, dx$，则 $du = \\frac{1}{x} \\, dx$，$v = \\frac{x^{n + 1}}{n + 1}$：\n\n$$\\int x^{n}\\ln x \\, dx = \\frac{x^{n + 1}\\ln x}{n + 1} - \\frac{x^{n + 1}}{(n + 1)^{2}} + C$$\n\n取 $n = 0$ 得 $\\int \\ln x \\, dx = x\\ln x - x + C$。\n\n检验：对 $\\frac{x^{n + 1}\\ln x}{n + 1}$ 求导得 $x^{n}\\ln x + \\frac{x^{n}}{n + 1}$，其中第二项与 $-\\frac{x^{n + 1}}{(n + 1)^{2}}$ 的导数相消。\n\n> **注意。** $v \\, du = \\frac{x^{n + 1}}{n + 1} \\cdot \\frac{1}{x} = \\frac{x^{n}}{n + 1}$，对它积分时还要再除以一次 $n + 1$，所以最后一项的分母是 $(n + 1)^{2}$。",
      ),
      generate(rng) {
        const n = rng.int(0, 4);
        const k = rng.nonZero(-9, 9);
        const m = n + 1;
        const integrand = `${poly([k, xPow(n)]) || coef(Q.of(k))}\\ln x`.replace(/^1\\ln/, "\\ln").replace(/^-1\\ln/, "-\\ln");
        const answer = plusC([Q.of(k, m), `${xPow(m)}\\ln x`], [Q.of(-k, m * m), xPow(m)]);
        const base = plusC([Q.of(1, m), `${xPow(m)}\\ln x`], [Q.of(-1, m * m), xPow(m)]);
        const vdu = over(xPow(n) || "1", m);
        return fromCase({
          integrand,
          answer,
          positive: true,
          steps: [
            [
              ["Choose u and dv", "选择 u 与 dv"],
              t(
                `Take $u = \\ln x$ and $dv = ${n === 0 ? "dx" : `${xPow(n)} \\, dx`}$, so $du = \\frac{1}{x} \\, dx$ and $v = ${over(xPow(m), m)}$.`,
                `取 $u = \\ln x$，$dv = ${n === 0 ? "dx" : `${xPow(n)} \\, dx`}$，则 $du = \\frac{1}{x} \\, dx$，$v = ${over(xPow(m), m)}$。`,
              ),
            ],
            [
              ["Apply the formula", "套用公式"],
              t(
                `Use $\\int u \\, dv = uv - \\int v \\, du$, where $v \\, du = ${vdu} \\, dx$:`,
                `用 $\\int u \\, dv = uv - \\int v \\, du$，其中 $v \\, du = ${vdu} \\, dx$：`,
              ),
              [`\\int ${xPow(n)}\\ln x \\, dx = ${over(`${xPow(m)}\\ln x`, m)} - \\int ${vdu} \\, dx = ${base}`],
            ],
            ...scaledBy(k, integrand, answer),
          ],
          check: differentiated(
            [derivativeOf(answer, poly([k, `${xPow(n)}\\ln x`], [Q.of(k, m), xPow(n)], [Q.of(-k, m), xPow(n)])), `= ${integrand}`],
            ["the product rule", "乘积法则"],
          ),
          mistakes: [
            onlyUv(plusC([Q.of(k, m), `${xPow(m)}\\ln x`])),
            say(
              plusC([Q.of(k, m), `${xPow(m)}\\ln x`], [Q.of(-k, m), xPow(m)]),
              `Integrating $${vdu}$ divides by $${m}$ once more, so the last term is over $${m * m}$.`,
              `对 $${vdu}$ 积分时还要再除以一次 $${m}$，所以最后一项的分母是 $${m * m}$。`,
            ),
            say(
              plusC([Q.of(k, m), `${xPow(m)}\\ln x`], [Q.of(k, m * m), xPow(m)]),
              "The formula is $uv - \\int v \\, du$: the second term is subtracted.",
              "公式是 $uv - \\int v \\, du$：第二项要减去。",
            ),
          ],
        });
      },
    },
    {
      id: "further-integrals-with-logarithms",
      title: t("Further integrals with logarithms", "含对数的进一步积分"),
      explanation: t(
        "The same choice $u = \\ln x$ works when the power is negative:\n\n$$\\int \\frac{\\ln x}{x^{2}} \\, dx = -\\frac{\\ln x}{x} + \\int \\frac{1}{x^{2}} \\, dx = -\\frac{\\ln x}{x} - \\frac{1}{x} + C.$$\n\nFor $\\int (\\ln x)^{2} \\, dx$ take $u = (\\ln x)^{2}$ and $dv = dx$, then use $\\int \\ln x \\, dx = x\\ln x - x$: the result is $x(\\ln x)^{2} - 2x\\ln x + 2x + C$.\n\nCheck: differentiating $-\\frac{\\ln x}{x} - \\frac{1}{x}$ gives $-\\frac{1}{x^{2}} + \\frac{\\ln x}{x^{2}} + \\frac{1}{x^{2}} = \\frac{\\ln x}{x^{2}}$.\n\n> **Watch out.** For a negative power, $v = \\frac{x^{1 - n}}{1 - n}$ is negative, so both terms of the answer are negative. For $(\\ln x)^{2}$, $du = \\frac{2\\ln x}{x} \\, dx$ by the chain rule, which leaves a second integration by parts.",
        "幂为负数时同样取 $u = \\ln x$：\n\n$$\\int \\frac{\\ln x}{x^{2}} \\, dx = -\\frac{\\ln x}{x} + \\int \\frac{1}{x^{2}} \\, dx = -\\frac{\\ln x}{x} - \\frac{1}{x} + C$$\n\n对 $\\int (\\ln x)^{2} \\, dx$，取 $u = (\\ln x)^{2}$，$dv = dx$，再利用 $\\int \\ln x \\, dx = x\\ln x - x$，结果为 $x(\\ln x)^{2} - 2x\\ln x + 2x + C$。\n\n检验：对 $-\\frac{\\ln x}{x} - \\frac{1}{x}$ 求导得 $-\\frac{1}{x^{2}} + \\frac{\\ln x}{x^{2}} + \\frac{1}{x^{2}} = \\frac{\\ln x}{x^{2}}$。\n\n> **注意。** 幂为负数时，$v = \\frac{x^{1 - n}}{1 - n}$ 是负的，所以答案的两项都是负的。对 $(\\ln x)^{2}$，由链式法则 $du = \\frac{2\\ln x}{x} \\, dx$，还要再做一次分部积分。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        if (rng.bool(0.35)) {
          const integrand = `${coef(Q.of(k))}(\\ln x)^{2}`;
          const answer = plusC([k, "x(\\ln x)^{2}"], [-2 * k, "x\\ln x"], [2 * k, "x"]);
          return fromCase({
            integrand,
            answer,
            positive: true,
            steps: [
              [
                ["First round", "第一次分部积分"],
                t(
                  "Take $u = (\\ln x)^{2}$ and $dv = dx$, so $du = \\frac{2\\ln x}{x} \\, dx$ and $v = x$:",
                  "取 $u = (\\ln x)^{2}$，$dv = dx$，则 $du = \\frac{2\\ln x}{x} \\, dx$，$v = x$：",
                ),
                ["\\int (\\ln x)^{2} \\, dx = x(\\ln x)^{2} - \\int 2\\ln x \\, dx"],
              ],
              [
                ["Second round", "第二次分部积分"],
                t(
                  "Integrating $\\ln x$ by parts with $u = \\ln x$ and $dv = dx$ gives $x\\ln x - x$, so",
                  "取 $u = \\ln x$，$dv = dx$ 对 $\\ln x$ 分部积分，得 $x\\ln x - x$，所以",
                ),
                ["\\int (\\ln x)^{2} \\, dx = x(\\ln x)^{2} - 2x\\ln x + 2x + C"],
              ],
              ...scaledBy(k, integrand, answer),
            ],
            check: differentiated(
              [
                derivativeOf(answer, poly([k, "(\\ln x)^{2}"], [2 * k, "\\ln x"], [-2 * k, "\\ln x"], [-2 * k, ""], [2 * k, ""])),
                `= ${integrand}`,
              ],
              ["the product rule", "乘积法则"],
            ),
            mistakes: [
              powerRule(plusC([Q.of(k, 3), "(\\ln x)^{3}"]), "\\ln x", "\\frac{1}{x}"),
              say(
                plusC([k, "x(\\ln x)^{2}"], [-2 * k, "x\\ln x"]),
                "$\\int \\ln x \\, dx = x\\ln x - x$; its $-x$, times $-2$, gives the term $+2x$, which is missing.",
                "$\\int \\ln x \\, dx = x\\ln x - x$；其中的 $-x$ 乘以 $-2$ 得 $+2x$，这一项漏掉了。",
              ),
              say(
                plusC([k, "x(\\ln x)^{2}"], [2 * k, "x\\ln x"], [2 * k, "x"]),
                "$uv - \\int v \\, du$ subtracts $2\\int \\ln x \\, dx$, so the $x\\ln x$ term is negative.",
                "$uv - \\int v \\, du$ 要减去 $2\\int \\ln x \\, dx$，所以 $x\\ln x$ 项是负的。",
              ),
            ],
          });
        }
        const n = rng.int(2, 3);
        const p = n - 1;
        const den = p === 1 ? "x" : `x^{${p}}`;
        const integrand = fracWith(k, "\\ln x", `x^{${n}}`);
        // ∫ ln x · x^(−n) = −ln x/((n−1)x^(n−1)) − 1/((n−1)² x^(n−1)).
        const answer = withC(fracTerm(Q.of(-k, p), "\\ln x", den), fracTerm(Q.of(-k, p * p), "", den));
        const base = withC(fracTerm(Q.of(-1, p), "\\ln x", den), fracTerm(Q.of(-1, p * p), "", den));
        return fromCase({
          integrand,
          answer,
          positive: true,
          steps: [
            [
              ["Choose u and dv", "选择 u 与 dv"],
              t(
                `Take $u = \\ln x$ and $dv = x^{${-n}} \\, dx$, so $du = \\frac{1}{x} \\, dx$ and $v = ${fracTerm(Q.of(-1, p), "", den)}$.`,
                `取 $u = \\ln x$，$dv = x^{${-n}} \\, dx$，则 $du = \\frac{1}{x} \\, dx$，$v = ${fracTerm(Q.of(-1, p), "", den)}$。`,
              ),
            ],
            [
              ["Apply the formula", "套用公式"],
              t(
                "Since $v$ is negative, subtracting $\\int v \\, du$ adds an integral:",
                "由于 $v$ 是负的，减去 $\\int v \\, du$ 就是加上一个积分：",
              ),
              [
                `\\int \\frac{\\ln x}{x^{${n}}} \\, dx = ${fracTerm(Q.of(-1, p), "\\ln x", den)} + ${p === 1 ? "" : `\\frac{1}{${p}}`}\\int \\frac{1}{x^{${n}}} \\, dx = ${base}`,
              ],
            ],
            ...scaledBy(k, integrand, answer),
          ],
          check: differentiated(
            [
              derivativeOf(
                answer,
                joinTerms([fracTerm(Q.of(-k, p), "", `x^{${n}}`), fracWith(k, "\\ln x", `x^{${n}}`), fracTerm(Q.of(k, p), "", `x^{${n}}`)]),
              ),
              `= ${integrand}`,
            ],
            ["the product rule", "乘积法则"],
          ),
          mistakes: [
            say(
              withC(fracTerm(Q.of(-k, p), "\\ln x", den), fracTerm(Q.of(k, p * p), "", den)),
              `$\\int x^{${-n}} \\, dx = ${fracTerm(Q.of(-1, p), "", den)}$ is negative, so the last term has the wrong sign.`,
              `$\\int x^{${-n}} \\, dx = ${fracTerm(Q.of(-1, p), "", den)}$ 是负的，所以最后一项的符号错了。`,
            ),
            onlyUv(withC(fracTerm(Q.of(-k, p), "\\ln x", den))),
            say(
              withC(fracTerm(Q.of(k, 2), "(\\ln x)^{2}", den)),
              "This integrates $\\ln x$ to $\\frac{(\\ln x)^{2}}{2}$, which only works with exactly one factor $\\frac{1}{x}$; the remaining power of $x$ cannot be kept aside like a constant.",
              "这是把 $\\ln x$ 积分成 $\\frac{(\\ln x)^{2}}{2}$，但这只在恰好有一个因子 $\\frac{1}{x}$ 时成立；剩下的 $x$ 的幂不能像常数一样放在一边。",
            ),
          ],
        });
      },
    },
  ],
};

/** QPoly is a polynomial with rational coefficients, lowest degree first. */
type QPoly = readonly Q[];

/** qLatex writes a rational polynomial in x, highest degree first. */
const qLatex = (p: QPoly) => poly(...p.map((c, i) => [c, power(i)] as const).reverse());

/** qDer differentiates a rational polynomial. */
const qDer = (p: QPoly): QPoly => p.slice(1).map((c, i) => c.mul(Q.of(i + 1)));

/** qAdd adds two rational polynomials, scaling the second by s. */
const qAdd = (p: QPoly, r: QPoly, s = Q.one): QPoly =>
  Array.from({ length: Math.max(p.length, r.length) }, (_, i) => (p[i] ?? Q.zero).add((r[i] ?? Q.zero).mul(s)));

/** scale multiplies a rational polynomial by c. */
const scale = (p: QPoly, c: Q): QPoly => p.map((q) => q.mul(c));

/** isZero tells whether a rational polynomial is zero. */
const isZero = (p: QPoly) => p.every((c) => c.isZero());

/** times writes p(x) multiplied by a function: "x^{2}e^{x}", "(x^{2} - 2)\cos x", "-2x\sin x". */
function times(p: QPoly, f: string): string {
  if (isZero(p)) return "";
  const terms = p.filter((c) => !c.isZero()).length;
  if (terms > 1) return `(${qLatex(p)})${f}`;
  const i = p.findIndex((c) => !c.isZero());
  return poly([p[i]!, `${power(i)}${f}`]);
}

/** exponentialParts returns ∫p(x)e^(ax) dx as the polynomial multiplying e^(ax): Σ (−1)^i p^(i) / a^(i+1), over at most rows rows of the table. */
function exponentialParts(p: QPoly, a: number, signs = true, rows = Number.POSITIVE_INFINITY): QPoly {
  let out: QPoly = [];
  let d = p;
  for (let i = 0; i < rows && !isZero(d) && d.length > 0; i++) {
    out = qAdd(out, d, Q.of(signs && i % 2 === 1 ? -1 : 1, a ** (i + 1)));
    d = qDer(d);
  }
  return out;
}

/** trigParts returns the polynomials multiplying sin(ax) and cos(ax) in ∫p(x)·f(ax) dx for f = sin or cos. */
function trigParts(p: QPoly, a: number, sine: boolean): readonly [QPoly, QPoly] {
  // ∫p cos(ax) = sin·(p/a − p''/a³ + …) + cos·(p'/a² − p'''/a⁴ + …); ∫p sin(ax) = cos·(−p/a + p''/a³ − …) + sin·(p'/a² − p'''/a⁴ + …).
  let even: QPoly = [];
  let odd: QPoly = [];
  let d = p;
  for (let i = 0; d.length > 0 && !isZero(d); i++) {
    const s = Q.of(Math.floor(i / 2) % 2 === 0 ? 1 : -1, a ** (i + 1));
    if (i % 2 === 0) even = qAdd(even, d, s);
    else odd = qAdd(odd, d, s);
    d = qDer(d);
  }
  return sine ? [odd, even.map((c) => c.neg())] : [even, odd];
}

/** expCheck differentiates q(x)e^(ax) back to the integrand by the product rule. */
const expCheck = (q: QPoly, a: number, e: string, integrand: string) =>
  differentiated(
    [`\\frac{d}{dx}\\left(${times(q, e)}\\right) = ${joinTerms([times(qDer(q), e), times(scale(q, Q.of(a)), e)])}`, `= ${integrand}`],
    ["the product rule", "乘积法则"],
  );

/** trigCheck differentiates s(x)sin(ax) + c(x)cos(ax) back to the integrand by the product rule. */
function trigCheck(s: QPoly, c: QPoly, a: number, integrand: string): Text {
  const [sin, cos] = [fn("\\sin", a), fn("\\cos", a)];
  return differentiated(
    [
      derivativeOf(
        withC(times(s, sin), times(c, cos)),
        joinTerms([times(qDer(s), sin), times(scale(s, Q.of(a)), cos), times(qDer(c), cos), times(scale(c, Q.of(-a)), sin)]),
      ),
      `= ${integrand}`,
    ],
    ["the product rule", "乘积法则"],
  );
}

/** applyingTheIntegrationByPartsTwice integrates x² times exponential and trigonometric functions. */
export const applyingTheIntegrationByPartsTwice: TopicDef = {
  id: "applying-the-integration-by-parts-twice",
  title: t("Applying the Integration by Parts Twice", "两次分部积分"),
  summary: t(
    "Integrate x² times an exponential or trigonometric function by integrating by parts twice.",
    "两次分部积分，求 x² 乘指数函数或三角函数的积分。",
  ),
  intro: t(
    "One round of parts turns $\\int x^{2}\\sin x \\, dx$ into $-x^{2}\\cos x + \\int 2x\\cos x \\, dx$, which still has an $x$. A second round with $u = 2x$ finishes it:\n\n$$\\int x^{2}\\sin x \\, dx = -x^{2}\\cos x + 2x\\sin x + 2\\cos x + C.$$\n\nCheck: differentiating gives $-2x\\cos x + x^{2}\\sin x + 2\\sin x + 2x\\cos x - 2\\sin x = x^{2}\\sin x$.\n\nIn this lesson we integrate $x^{2}$ times an exponential, a sine or a cosine by integrating by parts twice.",
    "一次分部积分把 $\\int x^{2}\\sin x \\, dx$ 变成 $-x^{2}\\cos x + \\int 2x\\cos x \\, dx$，其中仍有 $x$。取 $u = 2x$ 再做一次就完成了：\n\n$$\\int x^{2}\\sin x \\, dx = -x^{2}\\cos x + 2x\\sin x + 2\\cos x + C$$\n\n检验：求导得 $-2x\\cos x + x^{2}\\sin x + 2\\sin x + 2x\\cos x - 2\\sin x = x^{2}\\sin x$。\n\n本课我们通过两次分部积分，求 $x^{2}$ 乘指数函数、正弦或余弦的积分。",
  ),
  prerequisites: ["introduction-to-integration-by-parts"],
  encompasses: [{ topic: "introduction-to-integration-by-parts", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "x-squared-times-an-exponential",
      title: t("$x^2$ times an exponential", "$x^2$ 乘指数函数"),
      explanation: t(
        "Each integration by parts lowers the power of $x$ by one. For $\\int x^{2}e^{x} \\, dx$, take $u = x^{2}$: $\\int x^{2}e^{x} \\, dx = x^{2}e^{x} - 2\\int xe^{x} \\, dx$. Integrating by parts again,\n\n$$\\int x^{2}e^{x} \\, dx = x^{2}e^{x} - 2xe^{x} + 2e^{x} + C = (x^{2} - 2x + 2)e^{x} + C.$$\n\nCheck: by the product rule, $\\frac{d}{dx}\\left((x^{2} - 2x + 2)e^{x}\\right) = (2x - 2)e^{x} + (x^{2} - 2x + 2)e^{x} = x^{2}e^{x}$.\n\n> **Watch out.** Each round subtracts, so the terms alternate in sign: $-2\\int xe^{x} \\, dx$ becomes $-2xe^{x} + 2e^{x}$. And for $e^{ax}$ every round divides by $a$ once more.",
        "每做一次分部积分，$x$ 的次数降低一。对 $\\int x^{2}e^{x} \\, dx$，取 $u = x^{2}$：$\\int x^{2}e^{x} \\, dx = x^{2}e^{x} - 2\\int xe^{x} \\, dx$。再分部积分一次，\n\n$$\\int x^{2}e^{x} \\, dx = x^{2}e^{x} - 2xe^{x} + 2e^{x} + C = (x^{2} - 2x + 2)e^{x} + C$$\n\n检验：由乘积法则，$\\frac{d}{dx}\\left((x^{2} - 2x + 2)e^{x}\\right) = (2x - 2)e^{x} + (x^{2} - 2x + 2)e^{x} = x^{2}e^{x}$。\n\n> **注意。** 每一次都是减，所以各项符号交替：$-2\\int xe^{x} \\, dx$ 变成 $-2xe^{x} + 2e^{x}$。对 $e^{ax}$，每做一次还要再除以一次 $a$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, -1, -2]);
        const k = rng.nonZero(-6, 6);
        const p: QPoly = [Q.zero, Q.zero, Q.of(k)];
        const e = `e^{${ax(a)}}`;
        const right = exponentialParts(p, a);
        const integrand = `${poly([k, "x^{2}"])}${e}`;
        const answer = `${times(right, e)} + C`;
        return fromCase({
          integrand,
          answer,
          steps: [
            [
              ["First round", "第一次分部积分"],
              t(
                `Take $u = ${poly([k, "x^{2}"])}$ and $dv = ${e} \\, dx$, so $du = ${poly([2 * k, "x"])} \\, dx$ and $v = ${coef(Q.of(1, a))}${e}$:`,
                `取 $u = ${poly([k, "x^{2}"])}$，$dv = ${e} \\, dx$，则 $du = ${poly([2 * k, "x"])} \\, dx$，$v = ${coef(Q.of(1, a))}${e}$：`,
              ),
              [`\\int ${integrand} \\, dx = ${poly([Q.of(k, a), `x^{2}${e}`])} ${minusInt(Q.of(2 * k, a), `x${e}`)}`],
            ],
            [
              ["Second round", "第二次分部积分"],
              t(
                `With $u = x$ again, $\\int x${e} \\, dx = ${poly([Q.of(1, a), `x${e}`], [Q.of(-1, a * a), e])}$. Substitute and factor out $${e}$:`,
                `再取 $u = x$，$\\int x${e} \\, dx = ${poly([Q.of(1, a), `x${e}`], [Q.of(-1, a * a), e])}$。代入并提出 $${e}$：`,
              ),
              [`\\int ${integrand} \\, dx = ${answer}`],
            ],
          ],
          check: expCheck(right, a, e, integrand),
          mistakes: [
            say(
              `${times(exponentialParts(p, a, false), e)} + C`,
              "Each round of parts subtracts the new integral, so the terms alternate in sign; here the subtractions were dropped.",
              "每次分部积分都要减去新积分，所以各项符号交替；这里漏掉了减号。",
            ),
            say(
              `${times(exponentialParts(p, 1), e)} + C`,
              `Integrating $${e}$ divides by $${a}$ in every round; this result treats $${a}$ as $1$.`,
              `每次积分 $${e}$ 都要除以 $${a}$；这个结果把 $${a}$ 当成了 $1$。`,
            ),
            onlyUv(`${times([Q.zero, Q.zero, Q.of(k, a)], e)} + C`),
          ],
        });
      },
    },
    {
      id: "x-squared-times-sine-or-cosine",
      title: t("$x^2$ times sine or cosine", "$x^2$ 乘正弦或余弦"),
      explanation: t(
        "Each round of integration by parts lowers the power of the variable by one, so a square needs two rounds before only a trigonometric integral remains. Take $u = x^{2}$, then $u = x$. For example,\n\n$$\\int x^{2}\\cos x \\, dx = x^{2}\\sin x - 2\\int x\\sin x \\, dx = x^{2}\\sin x + 2x\\cos x - 2\\sin x + C.$$\n\nCheck: differentiating gives $2x\\sin x + x^{2}\\cos x + 2\\cos x - 2x\\sin x - 2\\cos x = x^{2}\\cos x$.\n\n> **Watch out.** $\\int \\sin x \\, dx = -\\cos x$ introduces a minus each time a sine is integrated, on top of the minus in $uv - \\int v \\, du$. Track both signs.",
        "每做一次分部积分，变量的幂就降低一次，所以平方需要做两次，最后只剩一个三角函数的积分。先取 $u = x^{2}$，再取 $u = x$。例如\n\n$$\\int x^{2}\\cos x \\, dx = x^{2}\\sin x - 2\\int x\\sin x \\, dx = x^{2}\\sin x + 2x\\cos x - 2\\sin x + C$$\n\n检验：求导得 $2x\\sin x + x^{2}\\cos x + 2\\cos x - 2x\\sin x - 2\\cos x = x^{2}\\cos x$。\n\n> **注意。** 每次对正弦积分，$\\int \\sin x \\, dx = -\\cos x$ 都会带来一个负号，此外 $uv - \\int v \\, du$ 中还有一个负号。两个符号都要留意。",
      ),
      generate(rng) {
        const a = rng.int(1, 3);
        const k = rng.nonZero(-6, 6);
        const sine = rng.bool();
        const p: QPoly = [Q.zero, Q.zero, Q.of(k)];
        const [s, c] = trigParts(p, a, sine);
        const sin = fn("\\sin", a);
        const cos = fn("\\cos", a);
        const f = sine ? sin : cos;
        const other = sine ? cos : sin;
        const integrand = `${poly([k, "x^{2}"])}${f}`;
        const answer = withC(times(s, sin), times(c, cos));
        const [ws, wc] = trigParts(p, a, !sine);
        const first = sine
          ? `${poly([Q.of(-k, a), `x^{2}${cos}`])} ${minusInt(Q.of(-2 * k, a), `x${cos}`)}`
          : `${poly([Q.of(k, a), `x^{2}${sin}`])} ${minusInt(Q.of(2 * k, a), `x${sin}`)}`;
        const known = sine
          ? `\\int x${cos} \\, dx = ${poly([Q.of(1, a), `x${sin}`], [Q.of(1, a * a), cos])}`
          : `\\int x${sin} \\, dx = ${poly([Q.of(-1, a), `x${cos}`], [Q.of(1, a * a), sin])}`;
        return fromCase({
          integrand,
          answer,
          steps: [
            [
              ["First round", "第一次分部积分"],
              t(
                `Take $u = ${poly([k, "x^{2}"])}$ and $dv = ${f} \\, dx$, so $du = ${poly([2 * k, "x"])} \\, dx$ and $v = ${coef(Q.of(sine ? -1 : 1, a))}${other}$:`,
                `取 $u = ${poly([k, "x^{2}"])}$，$dv = ${f} \\, dx$，则 $du = ${poly([2 * k, "x"])} \\, dx$，$v = ${coef(Q.of(sine ? -1 : 1, a))}${other}$：`,
              ),
              [`\\int ${integrand} \\, dx = ${first}`],
            ],
            [
              ["Second round", "第二次分部积分"],
              t(`With $u = x$ again, $${known}$. Substitute and collect the terms:`, `再取 $u = x$，$${known}$。代入并合并同类项：`),
              [`\\int ${integrand} \\, dx = ${answer}`],
            ],
          ],
          check: trigCheck(s, c, a, integrand),
          mistakes: [
            say(
              withC(times(ws, sin), times(wc, cos)),
              `This is the antiderivative of $x^{2}${other}$, not of $x^{2}${f}$: the first $v$ must be an antiderivative of $${f}$.`,
              `这是 $x^{2}${other}$ 的原函数，不是 $x^{2}${f}$ 的：第一次的 $v$ 必须是 $${f}$ 的原函数。`,
            ),
            say(
              withC(
                times(s, sin),
                times(
                  c.map((q) => q.neg()),
                  cos,
                ),
              ),
              "The cosine terms have the wrong sign: integrating a sine gives $-\\cos$, and this minus combines with the minus of $uv - \\int v \\, du$.",
              "余弦项的符号错了：对正弦积分得 $-\\cos$，这个负号还要与 $uv - \\int v \\, du$ 中的负号结合。",
            ),
            onlyUv(sine ? withC(times([Q.zero, Q.zero, Q.of(-k, a)], cos)) : withC(times([Q.zero, Q.zero, Q.of(k, a)], sin))),
          ],
        });
      },
    },
  ],
};

/** randomPoly chooses a polynomial of degree 2 or 3 with small integer coefficients. */
function randomPoly(rng: Rng): QPoly {
  const deg = rng.int(2, 3);
  return Array.from({ length: deg + 1 }, (_, i) => Q.of(i === deg ? rng.nonZero(-3, 3) : rng.int(-4, 4)));
}

/** derivatives lists p, p', p'', … down to the last nonzero derivative. */
function derivatives(p: QPoly): QPoly[] {
  const out: QPoly[] = [];
  for (let d = p; d.length > 0 && !isZero(d); d = qDer(d)) out.push(d);
  return out;
}

/** firstDiagonal is the reason for keeping only u times the first integral. */
const firstDiagonal = (response: string) =>
  say(
    response,
    "This is only the first diagonal, $u$ times the first integral; the products of the other rows are missing.",
    "这只是第一条对角线，即 $u$ 乘第一个积分；其他各行的乘积都漏掉了。",
  );

/** theTabularMethodOfIntegrationByParts integrates polynomials times e^(ax), sin x or cos x with the tabular method. */
export const theTabularMethodOfIntegrationByParts: TopicDef = {
  id: "the-tabular-method-of-integration-by-parts",
  title: t("The Tabular Method of Integration by Parts", "分部积分的表格法"),
  summary: t(
    "Integrate a polynomial times an exponential or trigonometric function with a table of derivatives and integrals.",
    "用导数与积分表，求多项式乘指数函数或三角函数的积分。",
  ),
  intro: t(
    "Repeated integration by parts can be written as a table. For $\\int (x^{2} + 1)e^{x} \\, dx$, differentiate $x^{2} + 1$ down to $0$: $x^{2} + 1, 2x, 2, 0$; integrate $e^{x}$ alongside: $e^{x}, e^{x}, e^{x}$. Multiplying along the diagonals with signs $+, -, +$:\n\n$$\\int (x^{2} + 1)e^{x} \\, dx = (x^{2} + 1)e^{x} - 2xe^{x} + 2e^{x} + C = (x^{2} - 2x + 3)e^{x} + C.$$\n\nCheck: $\\frac{d}{dx}\\left((x^{2} - 2x + 3)e^{x}\\right) = (2x - 2)e^{x} + (x^{2} - 2x + 3)e^{x} = (x^{2} + 1)e^{x}$.\n\nIn this lesson we use the table to integrate a polynomial times an exponential, a sine or a cosine.",
    "多次分部积分可以写成一张表。对 $\\int (x^{2} + 1)e^{x} \\, dx$，把 $x^{2} + 1$ 逐次求导到 $0$：$x^{2} + 1, 2x, 2, 0$；旁边对 $e^{x}$ 逐次积分：$e^{x}, e^{x}, e^{x}$。沿对角线相乘，符号依次为 $+, -, +$：\n\n$$\\int (x^{2} + 1)e^{x} \\, dx = (x^{2} + 1)e^{x} - 2xe^{x} + 2e^{x} + C = (x^{2} - 2x + 3)e^{x} + C$$\n\n检验：$\\frac{d}{dx}\\left((x^{2} - 2x + 3)e^{x}\\right) = (2x - 2)e^{x} + (x^{2} - 2x + 3)e^{x} = (x^{2} + 1)e^{x}$。\n\n本课我们用表格求多项式乘指数函数、正弦或余弦的积分。",
  ),
  prerequisites: ["applying-the-integration-by-parts-twice"],
  encompasses: [{ topic: "applying-the-integration-by-parts-twice", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "tabular-method-with-exponentials",
      title: t("The tabular method with exponentials", "表格法与指数函数"),
      explanation: t(
        "When $u$ is a polynomial, list its derivatives down to $0$ in one column and repeated integrals of $dv$ in another. Multiply diagonally with alternating signs $+, -, +, \\dots$ and add:\n\n$$\\int x^{3}e^{x} \\, dx = x^{3}e^{x} - 3x^{2}e^{x} + 6xe^{x} - 6e^{x} + C.$$\n\nFor $e^{ax}$ the integrals are $\\frac{1}{a}e^{ax}, \\frac{1}{a^{2}}e^{ax}, \\dots$\n\nCheck: $\\frac{d}{dx}\\left((x^{3} - 3x^{2} + 6x - 6)e^{x}\\right) = (3x^{2} - 6x + 6)e^{x} + (x^{3} - 3x^{2} + 6x - 6)e^{x} = x^{3}e^{x}$.\n\n> **Watch out.** Keep going until the derivative column reaches $0$: a cubic needs four diagonals. The signs alternate starting with $+$, whatever the signs of the entries.",
        "当 $u$ 是多项式时，一列写它的各阶导数直到 $0$，另一列写 $dv$ 的逐次积分。沿对角线相乘，符号交替为 $+, -, +, \\dots$，再相加：\n\n$$\\int x^{3}e^{x} \\, dx = x^{3}e^{x} - 3x^{2}e^{x} + 6xe^{x} - 6e^{x} + C$$\n\n对 $e^{ax}$，逐次积分为 $\\frac{1}{a}e^{ax}, \\frac{1}{a^{2}}e^{ax}, \\dots$\n\n检验：$\\frac{d}{dx}\\left((x^{3} - 3x^{2} + 6x - 6)e^{x}\\right) = (3x^{2} - 6x + 6)e^{x} + (x^{3} - 3x^{2} + 6x - 6)e^{x} = x^{3}e^{x}$。\n\n> **注意。** 要一直做到导数列为 $0$：三次多项式需要四条对角线。符号从 $+$ 开始交替，与表中各项本身的符号无关。",
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, -1]);
        const p = randomPoly(rng);
        const e = `e^{${ax(a)}}`;
        const right = exponentialParts(p, a);
        const integrand = times(p, e);
        const answer = `${times(right, e)} + C`;
        const ds = derivatives(p);
        const ints = ds.map((_, i) => `${coef(Q.of(1, a ** (i + 1)))}${e}`);
        return fromCase({
          integrand,
          answer,
          steps: [
            [
              ["Build the table", "列表"],
              t(
                `Differentiate down to $0$: $${ds.map(qLatex).join(", ")}, 0$. Integrate $${e}$ as many times: $${ints.join(", ")}$.`,
                `逐次求导直到 $0$：$${ds.map(qLatex).join(", ")}, 0$。对 $${e}$ 积分同样多次：$${ints.join(", ")}$。`,
              ),
            ],
            [
              ["Add the diagonals", "对角线相加"],
              t(
                `Multiply each derivative by the integral in its row, with signs $+, -, +, \\dots$, add, and factor out $${e}$:`,
                `把每个导数与同行的积分相乘，符号依次为 $+, -, +, \\dots$，相加后提出 $${e}$：`,
              ),
              [`\\int ${integrand} \\, dx = ${answer}`],
            ],
          ],
          check: expCheck(right, a, e, integrand),
          mistakes: [
            say(
              `${times(exponentialParts(p, a, false), e)} + C`,
              "The diagonal products must alternate in sign, $+, -, +, \\dots$; here they were all added.",
              "对角线乘积的符号必须交替为 $+, -, +, \\dots$；这里全部相加了。",
            ),
            say(
              `${times(exponentialParts(p, a, true, ds.length - 1), e)} + C`,
              "The table stopped one row early: the last diagonal, from the constant derivative, is missing.",
              "表格少做了一行：漏掉了来自常数导数的最后一条对角线。",
            ),
            firstDiagonal(`${times(scale(p, Q.of(1, a)), e)} + C`),
          ],
        });
      },
    },
    {
      id: "tabular-method-with-sine-and-cosine",
      title: t("The tabular method with sine and cosine", "表格法与正弦、余弦"),
      explanation: t(
        "With $dv = \\cos x \\, dx$ the integral column cycles $\\sin x, -\\cos x, -\\sin x, \\cos x, \\dots$. For example,\n\n$$\\int x^{3}\\cos x \\, dx = x^{3}\\sin x + 3x^{2}\\cos x - 6x\\sin x - 6\\cos x + C.$$\n\nGroup the terms by $\\sin x$ and $\\cos x$ at the end.\n\nCheck: differentiating gives $3x^{2}\\sin x + x^{3}\\cos x + 6x\\cos x - 3x^{2}\\sin x - 6\\sin x - 6x\\cos x + 6\\sin x = x^{3}\\cos x$.\n\n> **Watch out.** Two kinds of sign meet in each product: the alternating $+, -, +, \\dots$ and the signs in the integral column. Multiply both in before grouping.",
        "当 $dv = \\cos x \\, dx$ 时，积分列依次为 $\\sin x, -\\cos x, -\\sin x, \\cos x, \\dots$。例如\n\n$$\\int x^{3}\\cos x \\, dx = x^{3}\\sin x + 3x^{2}\\cos x - 6x\\sin x - 6\\cos x + C$$\n\n最后按 $\\sin x$ 与 $\\cos x$ 合并同类项。\n\n检验：求导得 $3x^{2}\\sin x + x^{3}\\cos x + 6x\\cos x - 3x^{2}\\sin x - 6\\sin x - 6x\\cos x + 6\\sin x = x^{3}\\cos x$。\n\n> **注意。** 每个乘积中有两种符号：交替的 $+, -, +, \\dots$ 与积分列里的符号。两者都乘进去后再合并。",
      ),
      generate(rng) {
        const p = randomPoly(rng);
        const sine = rng.bool();
        const [s, c] = trigParts(p, 1, sine);
        const [ws, wc] = trigParts(p, 1, !sine);
        const f = sine ? "\\sin x" : "\\cos x";
        const integrand = times(p, f);
        const answer = withC(times(s, "\\sin x"), times(c, "\\cos x"));
        const ds = derivatives(p);
        const cycle = sine ? ["-\\cos x", "-\\sin x", "\\cos x", "\\sin x"] : ["\\sin x", "-\\cos x", "-\\sin x", "\\cos x"];
        const ints = ds.map((_, i) => cycle[i % 4]);
        return fromCase({
          integrand,
          answer,
          steps: [
            [
              ["Build the table", "列表"],
              t(
                `Differentiate down to $0$: $${ds.map(qLatex).join(", ")}, 0$. Integrate $${f}$ as many times: $${ints.join(", ")}$.`,
                `逐次求导直到 $0$：$${ds.map(qLatex).join(", ")}, 0$。对 $${f}$ 积分同样多次：$${ints.join(", ")}$。`,
              ),
            ],
            [
              ["Add the diagonals", "对角线相加"],
              t(
                "Multiply each derivative by the integral in its row, with signs $+, -, +, \\dots$, add, and group by $\\sin x$ and $\\cos x$:",
                "把每个导数与同行的积分相乘，符号依次为 $+, -, +, \\dots$，相加后按 $\\sin x$ 与 $\\cos x$ 合并：",
              ),
              [`\\int ${integrand} \\, dx = ${answer}`],
            ],
          ],
          check: trigCheck(s, c, 1, integrand),
          mistakes: [
            say(
              withC(times(ws, "\\sin x"), times(wc, "\\cos x")),
              `The integral column belongs to $${sine ? "\\cos x" : "\\sin x"}$; it must start from an antiderivative of $${f}$.`,
              `这个积分列属于 $${sine ? "\\cos x" : "\\sin x"}$；它必须从 $${f}$ 的原函数开始。`,
            ),
            say(
              withC(
                times(s, "\\sin x"),
                times(
                  c.map((q) => q.neg()),
                  "\\cos x",
                ),
              ),
              "The $\\cos x$ terms have the wrong sign: combine the alternating signs with the signs in the integral column.",
              "$\\cos x$ 项的符号错了：要把交替符号与积分列中的符号结合起来。",
            ),
            firstDiagonal(sine ? withC(times(scale(p, Q.of(-1)), "\\cos x")) : withC(times(p, "\\sin x"))),
          ],
        });
      },
    },
  ],
};

/** integrationByPartsInCyclicCases integrates e^(ax)·sin/cos(bx), sec³x, sin(ln x) and cos(ln x). */
export const integrationByPartsInCyclicCases: TopicDef = {
  id: "integration-by-parts-in-cyclic-cases",
  title: t("Integration by Parts in Cyclic Cases", "循环型分部积分"),
  summary: t("Integrate by parts until the original integral reappears, then solve for it.", "分部积分直到原积分再次出现，然后解出它。"),
  intro: t(
    "In $I = \\int e^{x}\\sin x \\, dx$ neither factor gets simpler. Take $u = \\sin x$, $dv = e^{x} \\, dx$ twice: $I = e^{x}\\sin x - \\int e^{x}\\cos x \\, dx = e^{x}\\sin x - e^{x}\\cos x - I$. The integral came back, so solve for it:\n\n$$\\int e^{x}\\sin x \\, dx = \\frac{e^{x}}{2}(\\sin x - \\cos x) + C.$$\n\nCheck: by the product rule, the derivative is $\\frac{e^{x}}{2}(\\sin x - \\cos x) + \\frac{e^{x}}{2}(\\cos x + \\sin x) = e^{x}\\sin x$.\n\nIn this lesson we integrate by parts until the original integral returns, then solve the equation for it.",
    "在 $I = \\int e^{x}\\sin x \\, dx$ 中，两个因子都不会变简单。两次取 $u = \\sin x$（第二次为 $\\cos x$），$dv = e^{x} \\, dx$：$I = e^{x}\\sin x - \\int e^{x}\\cos x \\, dx = e^{x}\\sin x - e^{x}\\cos x - I$。原积分又出现了，于是解出它：\n\n$$\\int e^{x}\\sin x \\, dx = \\frac{e^{x}}{2}(\\sin x - \\cos x) + C$$\n\n检验：由乘积法则，导数为 $\\frac{e^{x}}{2}(\\sin x - \\cos x) + \\frac{e^{x}}{2}(\\cos x + \\sin x) = e^{x}\\sin x$。\n\n本课我们分部积分直到原积分再次出现，然后解方程求出它。",
  ),
  prerequisites: ["applying-the-integration-by-parts-twice", "integrating-trigonometric-functions-using-substitution"],
  encompasses: [{ topic: "applying-the-integration-by-parts-twice", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "exponential-times-sine-or-cosine",
      title: t("Exponential times sine or cosine", "指数函数乘正弦或余弦"),
      explanation: t(
        "Neither factor simplifies, but integrating by parts twice brings back the original integral, and solving the resulting equation for it gives the answer. Integrating $I = \\int e^{ax}\\sin(bx) \\, dx$ by parts twice returns $I$ itself:\n\n$$I = \\frac{1}{a}e^{ax}\\sin(bx) - \\frac{b}{a^{2}}e^{ax}\\cos(bx) - \\frac{b^{2}}{a^{2}}I.$$\n\nSolving for $I$,\n\n$$\\int e^{ax}\\sin(bx) \\, dx = \\frac{e^{ax}}{a^{2} + b^{2}}\\left(a\\sin(bx) - b\\cos(bx)\\right) + C, \\qquad \\int e^{ax}\\cos(bx) \\, dx = \\frac{e^{ax}}{a^{2} + b^{2}}\\left(a\\cos(bx) + b\\sin(bx)\\right) + C.$$\n\nCheck: differentiating the first gives $\\frac{e^{ax}}{a^{2} + b^{2}}\\left(a^{2}\\sin(bx) - ab\\cos(bx) + ab\\cos(bx) + b^{2}\\sin(bx)\\right) = e^{ax}\\sin(bx)$.\n\n> **Watch out.** Make the same kind of choice in both rounds: if $u$ is the trigonometric factor the first time, it must be the trigonometric factor again. Switching undoes the first round and gives $I = I$.",
        "两个因子都不会变简单，但分部积分两次后会回到原来的积分，解这个方程就得到答案。对 $I = \\int e^{ax}\\sin(bx) \\, dx$ 两次分部积分后，又回到 $I$：\n\n$$I = \\frac{1}{a}e^{ax}\\sin(bx) - \\frac{b}{a^{2}}e^{ax}\\cos(bx) - \\frac{b^{2}}{a^{2}}I$$\n\n解出 $I$：\n\n$$\\int e^{ax}\\sin(bx) \\, dx = \\frac{e^{ax}}{a^{2} + b^{2}}\\left(a\\sin(bx) - b\\cos(bx)\\right) + C, \\qquad \\int e^{ax}\\cos(bx) \\, dx = \\frac{e^{ax}}{a^{2} + b^{2}}\\left(a\\cos(bx) + b\\sin(bx)\\right) + C$$\n\n检验：对第一个求导得 $\\frac{e^{ax}}{a^{2} + b^{2}}\\left(a^{2}\\sin(bx) - ab\\cos(bx) + ab\\cos(bx) + b^{2}\\sin(bx)\\right) = e^{ax}\\sin(bx)$。\n\n> **注意。** 两次要做同一类选择：第一次取三角函数因子作 $u$，第二次也必须取三角函数因子。换过来就会抵消第一次，得到 $I = I$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, -1, -2]);
        const b = rng.int(1, 3);
        const k = rng.nonZero(-6, 6);
        const sine = rng.bool();
        const e = `e^{${ax(a)}}`;
        const [sin, cos] = [fn("\\sin", b), fn("\\cos", b)];
        const [trig, other] = sine ? [sin, cos] : [cos, sin];
        const inner = (p: number, q: number) => (sine ? poly([p, sin], [q, cos]) : poly([p, cos], [q, sin]));
        const n = a * a + b * b;
        const integrand = `${coef(Q.of(k))}${e}${trig}`;
        const answer = `${coef(Q.of(k, n))}${e}\\left(${inner(a, sine ? -b : b)}\\right) + C`;
        const K = coef(Q.of(k, n));
        const absK = coef(Q.of(Math.abs(k), n));
        return fromCase({
          integrand,
          answer,
          steps: [
            [
              ["Integrate by parts twice", "两次分部积分"],
              t(
                `Take $u$ to be the trigonometric factor and $dv = ${e} \\, dx$ in both rounds. The original integral $I = \\int ${e}${trig} \\, dx$ comes back:`,
                `两次都取三角函数因子作 $u$，$dv = ${e} \\, dx$。原积分 $I = \\int ${e}${trig} \\, dx$ 又出现了：`,
              ),
              [`I = ${poly([Q.of(1, a), `${e}${trig}`], [Q.of(sine ? -b : b, a * a), `${e}${other}`], [Q.of(-b * b, a * a), "I"])}`],
            ],
            [
              ["Solve for I", "解出 I"],
              t(
                `Add $${Q.of(b * b, a * a).toLatex()}I$ to both sides; the coefficient of $I$ becomes $${Q.of(n, a * a).toLatex()}$. Divide by it:`,
                `两边加上 $${Q.of(b * b, a * a).toLatex()}I$，$I$ 的系数变成 $${Q.of(n, a * a).toLatex()}$。两边除以它：`,
              ),
              [`I = \\frac{${e}}{${n}}\\left(${inner(a, sine ? -b : b)}\\right) + C`],
            ],
            ...scaledBy(k, integrand, answer),
          ],
          check: differentiated(
            [
              derivativeOf(
                answer,
                `${K}${e}\\left(${inner(a * a, sine ? -a * b : a * b)}\\right) ${k < 0 ? "-" : "+"} ${absK}${e}\\left(${inner(b * b, sine ? a * b : -a * b)}\\right)`,
              ),
              `= ${K}${e} \\cdot ${n}${trig}`,
              `= ${integrand}`,
            ],
            ["the product rule", "乘积法则"],
          ),
          mistakes: [
            say(
              `${coef(Q.of(k, n))}${e}\\left(${inner(a, sine ? b : -b)}\\right) + C`,
              sine
                ? "Differentiating $\\sin(bx)$ gives $+b\\cos(bx)$, so subtracting $\\int v \\, du$ makes the cosine term negative."
                : "Differentiating $\\cos(bx)$ gives $-b\\sin(bx)$, so subtracting $\\int v \\, du$ makes the sine term positive.",
              sine
                ? "$\\sin(bx)$ 的导数是 $+b\\cos(bx)$，减去 $\\int v \\, du$ 后余弦项为负。"
                : "$\\cos(bx)$ 的导数是 $-b\\sin(bx)$，减去 $\\int v \\, du$ 后正弦项为正。",
            ),
            say(
              `${coef(Q.of(k))}${e}\\left(${inner(a, sine ? -b : b)}\\right) + C`,
              `Solving for $I$ divides by $1 + \\frac{b^{2}}{a^{2}}$, which leaves the factor $\\frac{1}{${n}}$; it is missing here.`,
              `解出 $I$ 时要除以 $1 + \\frac{b^{2}}{a^{2}}$，从而留下因子 $\\frac{1}{${n}}$；这里漏掉了。`,
            ),
            byFactors(`${coef(Q.of(sine ? -k : k, a * b))}${e}${other} + C`),
          ],
        });
      },
    },
    {
      id: "further-cyclic-integrals",
      title: t("Further cyclic integrals", "其他循环型积分"),
      explanation: t(
        "The same trick works elsewhere. For $\\int \\sec^{3} x \\, dx$ take $u = \\sec x$, $dv = \\sec^{2} x \\, dx$ and use $\\tan^{2} x = \\sec^{2} x - 1$ and $\\int \\sec x \\, dx = \\ln|\\sec x + \\tan x| + C$:\n\n$$\\int \\sec^{3} x \\, dx = \\frac{1}{2}\\left(\\sec x\\tan x + \\ln|\\sec x + \\tan x|\\right) + C.$$\n\nFor $\\int \\sin(\\ln x) \\, dx$ take $u = \\sin(\\ln x)$, $dv = dx$ twice: $\\int \\sin(\\ln x) \\, dx = \\frac{x}{2}\\left(\\sin(\\ln x) - \\cos(\\ln x)\\right) + C$, and likewise $\\int \\cos(\\ln x) \\, dx = \\frac{x}{2}\\left(\\sin(\\ln x) + \\cos(\\ln x)\\right) + C$.\n\nCheck: differentiating $\\frac{1}{2}\\left(\\sec x\\tan x + \\ln|\\sec x + \\tan x|\\right)$ gives $\\frac{1}{2}\\left(\\sec x\\tan^{2} x + \\sec^{3} x + \\sec x\\right) = \\frac{1}{2}\\left(\\sec x(\\sec^{2} x - 1) + \\sec^{3} x + \\sec x\\right) = \\sec^{3} x$.\n\n> **Watch out.** The original integral returns with a minus sign, so it is added to both sides and gives $2I$: remember to halve at the end.",
        "这一技巧在别处同样适用。对 $\\int \\sec^{3} x \\, dx$，取 $u = \\sec x$，$dv = \\sec^{2} x \\, dx$，并利用 $\\tan^{2} x = \\sec^{2} x - 1$ 和 $\\int \\sec x \\, dx = \\ln|\\sec x + \\tan x| + C$：\n\n$$\\int \\sec^{3} x \\, dx = \\frac{1}{2}\\left(\\sec x\\tan x + \\ln|\\sec x + \\tan x|\\right) + C$$\n\n对 $\\int \\sin(\\ln x) \\, dx$，两次取 $u$ 为三角函数部分、$dv = dx$：$\\int \\sin(\\ln x) \\, dx = \\frac{x}{2}\\left(\\sin(\\ln x) - \\cos(\\ln x)\\right) + C$；同理 $\\int \\cos(\\ln x) \\, dx = \\frac{x}{2}\\left(\\sin(\\ln x) + \\cos(\\ln x)\\right) + C$。\n\n检验：对 $\\frac{1}{2}\\left(\\sec x\\tan x + \\ln|\\sec x + \\tan x|\\right)$ 求导得 $\\frac{1}{2}\\left(\\sec x\\tan^{2} x + \\sec^{3} x + \\sec x\\right) = \\frac{1}{2}\\left(\\sec x(\\sec^{2} x - 1) + \\sec^{3} x + \\sec x\\right) = \\sec^{3} x$。\n\n> **注意。** 原积分以负号再次出现，移到左边得 $2I$：最后别忘了除以 $2$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const kind = rng.int(0, 2);
        const solve = (integrand: string, answer: string): Step => [
          ["Solve for I", "解出 I"],
          t(
            `Add $I$ to both sides and divide by $2$${k === 1 ? "" : `, then multiply by $${k}$`}:`,
            `两边加上 $I$ 再除以 $2$${k === 1 ? "" : `，然后乘以 $${k}$`}：`,
          ),
          [`\\int ${integrand} \\, dx = ${answer}`],
        ];
        if (kind === 0) {
          const integrand = `${coef(Q.of(k))}\\sec^{3} x`;
          const answer = `${coef(Q.of(k, 2))}\\left(\\sec x\\tan x + \\ln|\\sec x + \\tan x|\\right) + C`;
          return fromCase({
            integrand,
            answer,
            steps: [
              [
                ["Integrate by parts", "分部积分"],
                t(
                  "For $I = \\int \\sec^{3} x \\, dx$ take $u = \\sec x$ and $dv = \\sec^{2} x \\, dx$, so $du = \\sec x\\tan x \\, dx$ and $v = \\tan x$:",
                  "对 $I = \\int \\sec^{3} x \\, dx$，取 $u = \\sec x$，$dv = \\sec^{2} x \\, dx$，则 $du = \\sec x\\tan x \\, dx$，$v = \\tan x$：",
                ),
                ["I = \\sec x\\tan x - \\int \\sec x\\tan^{2} x \\, dx"],
              ],
              [
                ["Use the identity", "用恒等式"],
                t(
                  "Write $\\tan^{2} x = \\sec^{2} x - 1$; the original integral returns:",
                  "把 $\\tan^{2} x$ 写成 $\\sec^{2} x - 1$，原积分又出现了：",
                ),
                ["I = \\sec x\\tan x - \\int \\sec^{3} x \\, dx + \\int \\sec x \\, dx", "= \\sec x\\tan x - I + \\ln|\\sec x + \\tan x|"],
              ],
              solve(integrand, answer),
            ],
            check: differentiated(
              [
                derivativeOf(answer, `${coef(Q.of(k, 2))}\\left(\\sec x\\tan^{2} x + \\sec^{3} x + \\sec x\\right)`),
                `= ${coef(Q.of(k, 2))}\\left(\\sec x(\\sec^{2} x - 1) + \\sec^{3} x + \\sec x\\right)`,
                `= ${integrand}`,
              ],
              [
                "the product rule and $\\frac{d}{dx}\\ln|\\sec x + \\tan x| = \\sec x$",
                "乘积法则与 $\\frac{d}{dx}\\ln|\\sec x + \\tan x| = \\sec x$",
              ],
            ),
            mistakes: [
              say(
                `${coef(Q.of(k, 2))}\\left(\\sec x\\tan x - \\ln|\\sec x + \\tan x|\\right) + C`,
                "The $\\int \\sec x \\, dx$ term comes from $-\\int \\sec x(\\sec^{2} x - 1) \\, dx$, so it is added: $+\\ln|\\sec x + \\tan x|$.",
                "$\\int \\sec x \\, dx$ 这一项来自 $-\\int \\sec x(\\sec^{2} x - 1) \\, dx$，所以是加上：$+\\ln|\\sec x + \\tan x|$。",
              ),
              say(
                `${coef(Q.of(k))}\\left(\\sec x\\tan x + \\ln|\\sec x + \\tan x|\\right) + C`,
                "The original integral returns with a minus sign, so the equation gives $2I$; the result must be halved.",
                "原积分以负号再次出现，方程给出的是 $2I$；结果要除以 $2$。",
              ),
              powerRule(`${coef(Q.of(k, 4))}\\sec^{4} x + C`, "\\sec x", "\\sec x\\tan x"),
            ],
          });
        }
        const sine = kind === 1;
        const f = sine ? "\\sin(\\ln x)" : "\\cos(\\ln x)";
        const integrand = `${coef(Q.of(k))}${f}`;
        const answer = `${coef(Q.of(k, 2))}x\\left(\\sin(\\ln x) ${sine ? "-" : "+"} \\cos(\\ln x)\\right) + C`;
        return fromCase({
          integrand,
          answer,
          positive: true,
          steps: [
            [
              ["First round", "第一次分部积分"],
              sine
                ? t(
                    "For $I = \\int \\sin(\\ln x) \\, dx$ take $u = \\sin(\\ln x)$ and $dv = dx$, so $du = \\frac{\\cos(\\ln x)}{x} \\, dx$ and $v = x$:",
                    "对 $I = \\int \\sin(\\ln x) \\, dx$，取 $u = \\sin(\\ln x)$，$dv = dx$，则 $du = \\frac{\\cos(\\ln x)}{x} \\, dx$，$v = x$：",
                  )
                : t(
                    "For $I = \\int \\cos(\\ln x) \\, dx$ take $u = \\cos(\\ln x)$ and $dv = dx$, so $du = -\\frac{\\sin(\\ln x)}{x} \\, dx$ and $v = x$:",
                    "对 $I = \\int \\cos(\\ln x) \\, dx$，取 $u = \\cos(\\ln x)$，$dv = dx$，则 $du = -\\frac{\\sin(\\ln x)}{x} \\, dx$，$v = x$：",
                  ),
              [sine ? "I = x\\sin(\\ln x) - \\int \\cos(\\ln x) \\, dx" : "I = x\\cos(\\ln x) + \\int \\sin(\\ln x) \\, dx"],
            ],
            [
              ["Second round", "第二次分部积分"],
              t(
                `Integrate $${sine ? "\\cos(\\ln x)" : "\\sin(\\ln x)"}$ the same way, with $dv = dx$; the original integral returns:`,
                `用同样的方法（$dv = dx$）对 $${sine ? "\\cos(\\ln x)" : "\\sin(\\ln x)"}$ 积分，原积分又出现了：`,
              ),
              [sine ? "I = x\\sin(\\ln x) - x\\cos(\\ln x) - I" : "I = x\\cos(\\ln x) + x\\sin(\\ln x) - I"],
            ],
            solve(integrand, answer),
          ],
          check: differentiated(
            [
              derivativeOf(
                answer,
                `${coef(Q.of(k, 2))}\\left(\\sin(\\ln x) ${sine ? "-" : "+"} \\cos(\\ln x) + \\cos(\\ln x) ${sine ? "+" : "-"} \\sin(\\ln x)\\right)`,
              ),
              `= ${integrand}`,
            ],
            ["the product rule and the chain rule", "乘积法则与链式法则"],
          ),
          mistakes: [
            say(
              `${coef(Q.of(k, 2))}x\\left(\\sin(\\ln x) ${sine ? "+" : "-"} \\cos(\\ln x)\\right) + C`,
              sine
                ? "In $I = x\\sin(\\ln x) - x\\cos(\\ln x) - I$ the cosine term is subtracted."
                : "In $I = x\\cos(\\ln x) + x\\sin(\\ln x) - I$ both terms are added, so the bracket is $\\sin(\\ln x) + \\cos(\\ln x)$.",
              sine
                ? "在 $I = x\\sin(\\ln x) - x\\cos(\\ln x) - I$ 中，余弦项是减去的。"
                : "在 $I = x\\cos(\\ln x) + x\\sin(\\ln x) - I$ 中两项都是加的，所以括号里是 $\\sin(\\ln x) + \\cos(\\ln x)$。",
            ),
            say(
              `${coef(Q.of(sine ? -k : k))}x${sine ? "\\cos" : "\\sin"}(\\ln x) + C`,
              sine
                ? "Differentiating $-x\\cos(\\ln x)$ gives $\\sin(\\ln x) - \\cos(\\ln x)$; the extra $-\\cos(\\ln x)$ shows that a term is missing and the integral never came back to be solved for."
                : "Differentiating $x\\sin(\\ln x)$ gives $\\sin(\\ln x) + \\cos(\\ln x)$; the extra $\\sin(\\ln x)$ shows that a term is missing and the integral never came back to be solved for.",
              sine
                ? "对 $-x\\cos(\\ln x)$ 求导得 $\\sin(\\ln x) - \\cos(\\ln x)$；多出的 $-\\cos(\\ln x)$ 说明漏了一项，也没有让原积分再次出现并解出它。"
                : "对 $x\\sin(\\ln x)$ 求导得 $\\sin(\\ln x) + \\cos(\\ln x)$；多出的 $\\sin(\\ln x)$ 说明漏了一项，也没有让原积分再次出现并解出它。",
            ),
            say(
              `${coef(Q.of(k, 2))}\\left(\\sin(\\ln x) ${sine ? "-" : "+"} \\cos(\\ln x)\\right) + C`,
              "With $dv = dx$, $v = x$, so every term carries the factor $x$.",
              "取 $dv = dx$ 时 $v = x$，所以每一项都带因子 $x$。",
            ),
          ],
        });
      },
    },
  ],
};

/** calculusIIIdentityPartsTopics are the topics of Calculus II modules 1.3–1.5. */
export const calculusIIIdentityPartsTopics: readonly TopicDef[] = [
  integrationUsingBasicTrigonometricIdentities,
  integrationUsingThePythagoreanIdentities,
  integrationUsingTheDoubleAngleFormulas,
  integratingProductsOfTrigonometricFunctions,
  integrationUsingBasicHyperbolicIdentities,
  integrationUsingTheHyperbolicPythagoreanIdentities,
  integrationUsingTheHyperbolicDoubleAngleFormulas,
  introductionToIntegrationByParts,
  usingIntegrationByPartsToCalculateIntegralsWithLogarithms,
  applyingTheIntegrationByPartsTwice,
  theTabularMethodOfIntegrationByParts,
  integrationByPartsInCyclicCases,
];
