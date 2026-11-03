import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { oneOf, power } from "./calculus-common.ts";
import { coef, fracWith, integral, plusC, xPow } from "./calculus-ii-substitution.ts";

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

/** Case is one integrand with its antiderivative, plausible mistakes and a one-line solution. */
interface Case {
  readonly integrand: string;
  readonly answer: string;
  readonly wrong: readonly string[];
  readonly en: string;
  readonly zh: string;
}

/** fromCase builds an integration problem from a case. */
const fromCase = (c: Case) => integral(c.integrand, c.answer, c.wrong, c.en, c.zh);

/** integrationUsingBasicTrigonometricIdentities rewrites integrands with the quotient and reciprocal identities. */
export const integrationUsingBasicTrigonometricIdentities: TopicDef = {
  id: "integration-using-basic-trigonometric-identities",
  title: t("Integration Using Basic Trigonometric Identities", "用基本三角恒等式积分"),
  summary: t(
    "Rewrite integrands with the quotient and reciprocal identities to reach standard integrals.",
    "用商数关系与倒数关系改写被积函数，化为标准积分。",
  ),
  prerequisites: ["integrating-trigonometric-functions-using-substitution"],
  encompasses: [{ topic: "integrating-trigonometric-functions-using-substitution", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rewriting-with-reciprocal-and-quotient-identities",
      title: t("Rewriting with reciprocal and quotient identities", "用倒数关系与商数关系改写"),
      explanation: t(
        "Use $\\sec x = \\frac{1}{\\cos x}$, $\\csc x = \\frac{1}{\\sin x}$, $\\tan x = \\frac{\\sin x}{\\cos x}$ and $\\cot x = \\frac{\\cos x}{\\sin x}$ to turn an integrand into a known derivative:\n\n$$\\int \\frac{\\sin x}{\\cos^{2} x} \\, dx = \\int \\tan x\\sec x \\, dx = \\sec x + C, \\qquad \\int \\frac{1}{\\sin^{2} x} \\, dx = \\int \\csc^{2} x \\, dx = -\\cot x + C.$$",
        "利用 $\\sec x = \\frac{1}{\\cos x}$、$\\csc x = \\frac{1}{\\sin x}$、$\\tan x = \\frac{\\sin x}{\\cos x}$、$\\cot x = \\frac{\\cos x}{\\sin x}$，把被积函数化为已知的导数：\n\n$$\\int \\frac{\\sin x}{\\cos^{2} x} \\, dx = \\int \\tan x\\sec x \\, dx = \\sec x + C, \\qquad \\int \\frac{1}{\\sin^{2} x} \\, dx = \\int \\csc^{2} x \\, dx = -\\cot x + C。$$",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const cases: Case[] = [
          {
            integrand: fracWith(k, "\\sin x", "\\cos^{2} x"),
            answer: plusC([k, "\\sec x"]),
            wrong: [plusC([-k, "\\sec x"]), plusC([k, "\\tan x"]), plusC([-k, "\\cos^{-1} x"])],
            en: `$\\frac{\\sin x}{\\cos^{2} x} = \\tan x\\sec x$, the derivative of $\\sec x$, so the integral is $${plusC([k, "\\sec x"])}$.`,
            zh: `$\\frac{\\sin x}{\\cos^{2} x} = \\tan x\\sec x$，它是 $\\sec x$ 的导数，所以积分为 $${plusC([k, "\\sec x"])}$。`,
          },
          {
            integrand: fracWith(k, "\\cos x", "\\sin^{2} x"),
            answer: plusC([-k, "\\csc x"]),
            wrong: [plusC([k, "\\csc x"]), plusC([-k, "\\cot x"]), plusC([k, "\\cot x"])],
            en: `$\\frac{\\cos x}{\\sin^{2} x} = \\cot x\\csc x$, and $\\frac{d}{dx}\\csc x = -\\csc x\\cot x$, so the integral is $${plusC([-k, "\\csc x"])}$.`,
            zh: `$\\frac{\\cos x}{\\sin^{2} x} = \\cot x\\csc x$，而 $\\frac{d}{dx}\\csc x = -\\csc x\\cot x$，所以积分为 $${plusC([-k, "\\csc x"])}$。`,
          },
          {
            integrand: fracWith(k, "", "\\cos^{2} x").replace("\\frac{}", "\\frac{1}"),
            answer: plusC([k, "\\tan x"]),
            wrong: [plusC([-k, "\\tan x"]), plusC([k, "\\sec x"]), plusC([-k, "\\cot x"])],
            en: `$\\frac{1}{\\cos^{2} x} = \\sec^{2} x$, the derivative of $\\tan x$, so the integral is $${plusC([k, "\\tan x"])}$.`,
            zh: `$\\frac{1}{\\cos^{2} x} = \\sec^{2} x$，它是 $\\tan x$ 的导数，所以积分为 $${plusC([k, "\\tan x"])}$。`,
          },
          {
            integrand: fracWith(k, "", "\\sin^{2} x").replace("\\frac{}", "\\frac{1}"),
            answer: plusC([-k, "\\cot x"]),
            wrong: [plusC([k, "\\cot x"]), plusC([-k, "\\csc x"]), plusC([k, "\\tan x"])],
            en: `$\\frac{1}{\\sin^{2} x} = \\csc^{2} x$, and $\\frac{d}{dx}\\cot x = -\\csc^{2} x$, so the integral is $${plusC([-k, "\\cot x"])}$.`,
            zh: `$\\frac{1}{\\sin^{2} x} = \\csc^{2} x$，而 $\\frac{d}{dx}\\cot x = -\\csc^{2} x$，所以积分为 $${plusC([-k, "\\cot x"])}$。`,
          },
          {
            integrand: `${coef(Q.of(k))}\\tan x\\cos x`,
            answer: plusC([-k, "\\cos x"]),
            wrong: [plusC([k, "\\cos x"]), plusC([k, "\\sec x"]), plusC([k, "\\tan x\\sin x"])],
            en: `$\\tan x\\cos x = \\sin x$, so the integral is $${plusC([-k, "\\cos x"])}$.`,
            zh: `$\\tan x\\cos x = \\sin x$，所以积分为 $${plusC([-k, "\\cos x"])}$。`,
          },
          {
            integrand: `${coef(Q.of(k))}\\cot x\\sin x`,
            answer: plusC([k, "\\sin x"]),
            wrong: [plusC([-k, "\\sin x"]), plusC([-k, "\\csc x"]), plusC([k, "\\cot x\\cos x"])],
            en: `$\\cot x\\sin x = \\cos x$, so the integral is $${plusC([k, "\\sin x"])}$.`,
            zh: `$\\cot x\\sin x = \\cos x$，所以积分为 $${plusC([k, "\\sin x"])}$。`,
          },
        ];
        return fromCase(rng.pick(cases));
      },
    },
    {
      id: "expanding-products-with-reciprocal-functions",
      title: t("Expanding products with reciprocal functions", "展开含倒数函数的乘积"),
      explanation: t(
        "Expand a product into terms that are known derivatives, or split a quotient over its denominator:\n\n$$\\int \\sec x(\\sec x + \\tan x) \\, dx = \\int (\\sec^{2} x + \\sec x\\tan x) \\, dx = \\tan x + \\sec x + C,$$\n\n$$\\int \\frac{\\sin x + \\cos x}{\\cos x} \\, dx = \\int (\\tan x + 1) \\, dx = -\\ln|\\cos x| + x + C.$$",
        "把乘积展开成若干已知导数的项，或把商按分母拆开：\n\n$$\\int \\sec x(\\sec x + \\tan x) \\, dx = \\int (\\sec^{2} x + \\sec x\\tan x) \\, dx = \\tan x + \\sec x + C，$$\n\n$$\\int \\frac{\\sin x + \\cos x}{\\cos x} \\, dx = \\int (\\tan x + 1) \\, dx = -\\ln|\\cos x| + x + C。$$",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const cases: Case[] = [
          {
            integrand: `${coef(Q.of(k))}\\sec x(\\sec x + \\tan x)`,
            answer: plusC([k, "\\tan x"], [k, "\\sec x"]),
            wrong: [plusC([k, "\\tan x"], [-k, "\\sec x"]), plusC([k, "\\sec^{2} x"]), plusC([k, "\\tan x"])],
            en: `Expand: $${coef(Q.of(k))}(\\sec^{2} x + \\sec x\\tan x)$, whose terms are the derivatives of $\\tan x$ and $\\sec x$: $${plusC([k, "\\tan x"], [k, "\\sec x"])}$.`,
            zh: `展开：$${coef(Q.of(k))}(\\sec^{2} x + \\sec x\\tan x)$，两项分别是 $\\tan x$ 与 $\\sec x$ 的导数：$${plusC([k, "\\tan x"], [k, "\\sec x"])}$。`,
          },
          {
            integrand: `${coef(Q.of(k))}\\csc x(\\csc x - \\cot x)`,
            answer: plusC([-k, "\\cot x"], [k, "\\csc x"]),
            wrong: [plusC([k, "\\cot x"], [-k, "\\csc x"]), plusC([-k, "\\cot x"], [-k, "\\csc x"]), plusC([k, "\\csc^{2} x"])],
            en: `Expand: $${coef(Q.of(k))}(\\csc^{2} x - \\csc x\\cot x)$. Since $\\int \\csc^{2} x \\, dx = -\\cot x$ and $\\int \\csc x\\cot x \\, dx = -\\csc x$, the integral is $${plusC([-k, "\\cot x"], [k, "\\csc x"])}$.`,
            zh: `展开：$${coef(Q.of(k))}(\\csc^{2} x - \\csc x\\cot x)$。由于 $\\int \\csc^{2} x \\, dx = -\\cot x$，$\\int \\csc x\\cot x \\, dx = -\\csc x$，积分为 $${plusC([-k, "\\cot x"], [k, "\\csc x"])}$。`,
          },
          {
            integrand: fracWith(k, "(\\sin x + \\cos x)", "\\cos x"),
            answer: plusC([-k, "\\ln|\\cos x|"], [k, "x"]),
            wrong: [plusC([k, "\\ln|\\cos x|"], [k, "x"]), plusC([-k, "\\ln|\\cos x|"]), plusC([k, "\\sec^{2} x"], [k, "x"])],
            en: `Split: $\\frac{\\sin x + \\cos x}{\\cos x} = \\tan x + 1$, and $\\int \\tan x \\, dx = -\\ln|\\cos x|$, so the integral is $${plusC([-k, "\\ln|\\cos x|"], [k, "x"])}$.`,
            zh: `拆开：$\\frac{\\sin x + \\cos x}{\\cos x} = \\tan x + 1$，而 $\\int \\tan x \\, dx = -\\ln|\\cos x|$，所以积分为 $${plusC([-k, "\\ln|\\cos x|"], [k, "x"])}$。`,
          },
          {
            integrand: fracWith(k, "(\\cos x + \\sin x)", "\\sin x"),
            answer: plusC([k, "\\ln|\\sin x|"], [k, "x"]),
            wrong: [plusC([-k, "\\ln|\\sin x|"], [k, "x"]), plusC([k, "\\ln|\\sin x|"]), plusC([-k, "\\csc^{2} x"], [k, "x"])],
            en: `Split: $\\frac{\\cos x + \\sin x}{\\sin x} = \\cot x + 1$, and $\\int \\cot x \\, dx = \\ln|\\sin x|$, so the integral is $${plusC([k, "\\ln|\\sin x|"], [k, "x"])}$.`,
            zh: `拆开：$\\frac{\\cos x + \\sin x}{\\sin x} = \\cot x + 1$，而 $\\int \\cot x \\, dx = \\ln|\\sin x|$，所以积分为 $${plusC([k, "\\ln|\\sin x|"], [k, "x"])}$。`,
          },
        ];
        return fromCase(rng.pick(cases));
      },
    },
  ],
};

/** integrationUsingThePythagoreanIdentities uses sin² + cos² = 1 and 1 + tan² = sec². */
export const integrationUsingThePythagoreanIdentities: TopicDef = {
  id: "integration-using-the-pythagorean-identities",
  title: t("Integration Using the Pythagorean Identities", "用毕达哥拉斯恒等式积分"),
  summary: t(
    "Integrate tan², cot² and odd powers of sine and cosine with the Pythagorean identities.",
    "用毕达哥拉斯恒等式求 tan²、cot² 及正弦、余弦奇次幂的积分。",
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
        "From $\\sin^{2} x + \\cos^{2} x = 1$ come $\\tan^{2} x = \\sec^{2} x - 1$ and $\\cot^{2} x = \\csc^{2} x - 1$. So\n\n$$\\int \\tan^{2} x \\, dx = \\tan x - x + C, \\qquad \\int \\cot^{2} x \\, dx = -\\cot x - x + C.$$\n\nThe identity also simplifies quotients: $\\frac{1 - \\sin^{2} x}{\\cos x} = \\frac{\\cos^{2} x}{\\cos x} = \\cos x$.",
        "由 $\\sin^{2} x + \\cos^{2} x = 1$ 得 $\\tan^{2} x = \\sec^{2} x - 1$，$\\cot^{2} x = \\csc^{2} x - 1$。所以\n\n$$\\int \\tan^{2} x \\, dx = \\tan x - x + C, \\qquad \\int \\cot^{2} x \\, dx = -\\cot x - x + C。$$\n\n这个恒等式也能化简商：$\\frac{1 - \\sin^{2} x}{\\cos x} = \\frac{\\cos^{2} x}{\\cos x} = \\cos x$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const cases: Case[] = [
          {
            integrand: `${coef(Q.of(k))}\\tan^{2} x`,
            answer: plusC([k, "\\tan x"], [-k, "x"]),
            wrong: [plusC([Q.of(k, 3), "\\tan^{3} x"]), plusC([k, "\\tan x"], [k, "x"]), plusC([k, "\\sec^{2} x"], [-k, "x"])],
            en: `$\\tan^{2} x = \\sec^{2} x - 1$, so the integral is $${plusC([k, "\\tan x"], [-k, "x"])}$.`,
            zh: `$\\tan^{2} x = \\sec^{2} x - 1$，所以积分为 $${plusC([k, "\\tan x"], [-k, "x"])}$。`,
          },
          {
            integrand: `${coef(Q.of(k))}\\cot^{2} x`,
            answer: plusC([-k, "\\cot x"], [-k, "x"]),
            wrong: [plusC([Q.of(k, 3), "\\cot^{3} x"]), plusC([k, "\\cot x"], [-k, "x"]), plusC([-k, "\\cot x"], [k, "x"])],
            en: `$\\cot^{2} x = \\csc^{2} x - 1$, so the integral is $${plusC([-k, "\\cot x"], [-k, "x"])}$.`,
            zh: `$\\cot^{2} x = \\csc^{2} x - 1$，所以积分为 $${plusC([-k, "\\cot x"], [-k, "x"])}$。`,
          },
          {
            integrand: fracWith(k, "(1 - \\sin^{2} x)", "\\cos x"),
            answer: plusC([k, "\\sin x"]),
            wrong: [plusC([-k, "\\sin x"]), plusC([k, "\\ln|\\cos x|"]), plusC([k, "\\cos x"])],
            en: `$1 - \\sin^{2} x = \\cos^{2} x$, so the integrand is $${coef(Q.of(k))}\\cos x$ and the integral is $${plusC([k, "\\sin x"])}$.`,
            zh: `$1 - \\sin^{2} x = \\cos^{2} x$，所以被积函数为 $${coef(Q.of(k))}\\cos x$，积分为 $${plusC([k, "\\sin x"])}$。`,
          },
          {
            integrand: fracWith(k, "(1 - \\cos^{2} x)", "\\sin x"),
            answer: plusC([-k, "\\cos x"]),
            wrong: [plusC([k, "\\cos x"]), plusC([k, "\\ln|\\sin x|"]), plusC([k, "\\sin x"])],
            en: `$1 - \\cos^{2} x = \\sin^{2} x$, so the integrand is $${coef(Q.of(k))}\\sin x$ and the integral is $${plusC([-k, "\\cos x"])}$.`,
            zh: `$1 - \\cos^{2} x = \\sin^{2} x$，所以被积函数为 $${coef(Q.of(k))}\\sin x$，积分为 $${plusC([-k, "\\cos x"])}$。`,
          },
        ];
        return fromCase(rng.pick(cases));
      },
    },
    {
      id: "integrating-odd-powers-of-sine-and-cosine",
      title: t("Integrating odd powers of sine and cosine", "正弦与余弦奇次幂的积分"),
      explanation: t(
        "With an odd power of sine, keep one $\\sin x$ for $du$ and turn the rest into cosines, then let $u = \\cos x$:\n\n$$\\int \\sin^{3} x \\, dx = \\int (1 - \\cos^{2} x)\\sin x \\, dx = -\\cos x + \\frac{\\cos^{3} x}{3} + C.$$\n\nWith an odd power of cosine, keep one $\\cos x$ and let $u = \\sin x$: $\\int \\cos^{3} x \\, dx = \\sin x - \\frac{\\sin^{3} x}{3} + C$.",
        "正弦为奇次幂时，留一个 $\\sin x$ 作 $du$，其余化为余弦，再令 $u = \\cos x$：\n\n$$\\int \\sin^{3} x \\, dx = \\int (1 - \\cos^{2} x)\\sin x \\, dx = -\\cos x + \\frac{\\cos^{3} x}{3} + C。$$\n\n余弦为奇次幂时，留一个 $\\cos x$，令 $u = \\sin x$：$\\int \\cos^{3} x \\, dx = \\sin x - \\frac{\\sin^{3} x}{3} + C$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const cases: Case[] = [
          {
            integrand: `${coef(Q.of(k))}\\sin^{3} x`,
            answer: plusC([-k, "\\cos x"], [Q.of(k, 3), "\\cos^{3} x"]),
            wrong: [
              plusC([Q.of(k, 4), "\\sin^{4} x"]),
              plusC([k, "\\cos x"], [Q.of(-k, 3), "\\cos^{3} x"]),
              plusC([-k, "\\cos x"], [Q.of(-k, 3), "\\cos^{3} x"]),
            ],
            en: `$\\sin^{3} x = (1 - \\cos^{2} x)\\sin x$. With $u = \\cos x$, $du = -\\sin x \\, dx$: $${-k}\\int (1 - u^{2}) \\, du = ${plusC([-k, "\\cos x"], [Q.of(k, 3), "\\cos^{3} x"])}$.`,
            zh: `$\\sin^{3} x = (1 - \\cos^{2} x)\\sin x$。令 $u = \\cos x$，$du = -\\sin x \\, dx$：$${-k}\\int (1 - u^{2}) \\, du = ${plusC([-k, "\\cos x"], [Q.of(k, 3), "\\cos^{3} x"])}$。`,
          },
          {
            integrand: `${coef(Q.of(k))}\\cos^{3} x`,
            answer: plusC([k, "\\sin x"], [Q.of(-k, 3), "\\sin^{3} x"]),
            wrong: [
              plusC([Q.of(k, 4), "\\cos^{4} x"]),
              plusC([k, "\\sin x"], [Q.of(k, 3), "\\sin^{3} x"]),
              plusC([-k, "\\sin x"], [Q.of(k, 3), "\\sin^{3} x"]),
            ],
            en: `$\\cos^{3} x = (1 - \\sin^{2} x)\\cos x$. With $u = \\sin x$: $${k}\\int (1 - u^{2}) \\, du = ${plusC([k, "\\sin x"], [Q.of(-k, 3), "\\sin^{3} x"])}$.`,
            zh: `$\\cos^{3} x = (1 - \\sin^{2} x)\\cos x$。令 $u = \\sin x$：$${k}\\int (1 - u^{2}) \\, du = ${plusC([k, "\\sin x"], [Q.of(-k, 3), "\\sin^{3} x"])}$。`,
          },
          {
            integrand: `${coef(Q.of(k))}\\sin^{3} x\\cos^{2} x`,
            answer: plusC([Q.of(-k, 3), "\\cos^{3} x"], [Q.of(k, 5), "\\cos^{5} x"]),
            wrong: [
              plusC([Q.of(k, 3), "\\cos^{3} x"], [Q.of(-k, 5), "\\cos^{5} x"]),
              plusC([Q.of(k, 12), "\\sin^{4} x\\cos^{3} x"]),
              plusC([Q.of(-k, 3), "\\cos^{3} x"], [Q.of(-k, 5), "\\cos^{5} x"]),
            ],
            en: `$\\sin^{3} x\\cos^{2} x = (1 - \\cos^{2} x)\\cos^{2} x\\sin x$. With $u = \\cos x$: $${-k}\\int (u^{2} - u^{4}) \\, du = ${plusC([Q.of(-k, 3), "\\cos^{3} x"], [Q.of(k, 5), "\\cos^{5} x"])}$.`,
            zh: `$\\sin^{3} x\\cos^{2} x = (1 - \\cos^{2} x)\\cos^{2} x\\sin x$。令 $u = \\cos x$：$${-k}\\int (u^{2} - u^{4}) \\, du = ${plusC([Q.of(-k, 3), "\\cos^{3} x"], [Q.of(k, 5), "\\cos^{5} x"])}$。`,
          },
          {
            integrand: `${coef(Q.of(k))}\\cos^{3} x\\sin^{2} x`,
            answer: plusC([Q.of(k, 3), "\\sin^{3} x"], [Q.of(-k, 5), "\\sin^{5} x"]),
            wrong: [
              plusC([Q.of(k, 3), "\\sin^{3} x"], [Q.of(k, 5), "\\sin^{5} x"]),
              plusC([Q.of(k, 12), "\\cos^{4} x\\sin^{3} x"]),
              plusC([Q.of(-k, 3), "\\sin^{3} x"], [Q.of(k, 5), "\\sin^{5} x"]),
            ],
            en: `$\\cos^{3} x\\sin^{2} x = (1 - \\sin^{2} x)\\sin^{2} x\\cos x$. With $u = \\sin x$: $${k}\\int (u^{2} - u^{4}) \\, du = ${plusC([Q.of(k, 3), "\\sin^{3} x"], [Q.of(-k, 5), "\\sin^{5} x"])}$.`,
            zh: `$\\cos^{3} x\\sin^{2} x = (1 - \\sin^{2} x)\\sin^{2} x\\cos x$。令 $u = \\sin x$：$${k}\\int (u^{2} - u^{4}) \\, du = ${plusC([Q.of(k, 3), "\\sin^{3} x"], [Q.of(-k, 5), "\\sin^{5} x"])}$。`,
          },
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
  prerequisites: ["integration-using-the-pythagorean-identities", "the-power-reducing-formulas-for-sine-and-cosine"],
  encompasses: [
    { topic: "integration-using-the-pythagorean-identities", weight: 0.3 },
    { topic: "the-power-reducing-formulas-for-sine-and-cosine", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-squares-of-sine-and-cosine",
      title: t("Integrating squares of sine and cosine", "正弦与余弦平方的积分"),
      explanation: t(
        "Even powers do not yield to substitution. Lower the power with $\\sin^{2} \\theta = \\frac{1 - \\cos 2\\theta}{2}$ and $\\cos^{2} \\theta = \\frac{1 + \\cos 2\\theta}{2}$:\n\n$$\\int \\sin^{2}(ax) \\, dx = \\frac{x}{2} - \\frac{\\sin(2ax)}{4a} + C, \\qquad \\int \\cos^{2}(ax) \\, dx = \\frac{x}{2} + \\frac{\\sin(2ax)}{4a} + C.$$",
        "偶次幂不能直接换元。用 $\\sin^{2} \\theta = \\frac{1 - \\cos 2\\theta}{2}$ 和 $\\cos^{2} \\theta = \\frac{1 + \\cos 2\\theta}{2}$ 降幂：\n\n$$\\int \\sin^{2}(ax) \\, dx = \\frac{x}{2} - \\frac{\\sin(2ax)}{4a} + C, \\qquad \\int \\cos^{2}(ax) \\, dx = \\frac{x}{2} + \\frac{\\sin(2ax)}{4a} + C。$$",
      ),
      generate(rng) {
        const k = rng.nonZero(-8, 8);
        const a = rng.int(1, 4);
        const sine = rng.bool();
        const s = sine ? -1 : 1;
        const f = sine ? "\\sin" : "\\cos";
        const answer = plusC([Q.of(k, 2), "x"], [Q.of(s * k, 4 * a), fn("\\sin", 2 * a)]);
        return integral(
          `${coef(Q.of(k))}${a === 1 ? `${f}^{2} x` : `${f}^{2}(${a}x)`}`,
          answer,
          [
            plusC([Q.of(k, 3 * a), a === 1 ? `${f}^{3} x` : `${f}^{3}(${a}x)`]),
            plusC([Q.of(k, 2), "x"], [Q.of(-s * k, 4 * a), fn("\\sin", 2 * a)]),
            plusC([Q.of(k, 2), "x"], [Q.of(s * k, 2 * a), fn("\\sin", 2 * a)]),
          ],
          `$${f}^{2}(${a === 1 ? "x" : `${a}x`}) = \\frac{1 ${sine ? "-" : "+"} ${fn("\\cos", 2 * a)}}{2}$, so the integral is $${coef(Q.of(k, 2))}\\left(x ${sine ? "-" : "+"} \\frac{${fn("\\sin", 2 * a)}}{${2 * a}}\\right) + C = ${answer}$.`,
          `$${f}^{2}(${a === 1 ? "x" : `${a}x`}) = \\frac{1 ${sine ? "-" : "+"} ${fn("\\cos", 2 * a)}}{2}$，所以积分为 $${coef(Q.of(k, 2))}\\left(x ${sine ? "-" : "+"} \\frac{${fn("\\sin", 2 * a)}}{${2 * a}}\\right) + C = ${answer}$。`,
        );
      },
    },
    {
      id: "integrating-products-of-sine-and-cosine-of-the-same-angle",
      title: t("Integrating sin·cos of the same angle", "同角正弦与余弦之积的积分"),
      explanation: t(
        "Use $\\sin \\theta\\cos \\theta = \\frac{1}{2}\\sin 2\\theta$: $\\int \\sin(ax)\\cos(ax) \\, dx = -\\frac{\\cos(2ax)}{4a} + C$. (Substituting $u = \\sin(ax)$ gives $\\frac{\\sin^{2}(ax)}{2a} + C$, which differs only by a constant.) Squaring the identity, $\\sin^{2} x\\cos^{2} x = \\frac{1}{4}\\sin^{2} 2x = \\frac{1 - \\cos 4x}{8}$.",
        "利用 $\\sin \\theta\\cos \\theta = \\frac{1}{2}\\sin 2\\theta$：$\\int \\sin(ax)\\cos(ax) \\, dx = -\\frac{\\cos(2ax)}{4a} + C$。（代换 $u = \\sin(ax)$ 得 $\\frac{\\sin^{2}(ax)}{2a} + C$，两者只差一个常数。）把恒等式平方，$\\sin^{2} x\\cos^{2} x = \\frac{1}{4}\\sin^{2} 2x = \\frac{1 - \\cos 4x}{8}$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        if (rng.bool(0.3)) {
          const answer = plusC([Q.of(k, 8), "x"], [Q.of(-k, 32), "\\sin(4x)"]);
          return integral(
            `${coef(Q.of(k))}\\sin^{2} x\\cos^{2} x`,
            answer,
            [
              plusC([Q.of(k, 9), "\\sin^{3} x\\cos^{3} x"]),
              plusC([Q.of(k, 8), "x"], [Q.of(k, 32), "\\sin(4x)"]),
              plusC([Q.of(k, 4), "x"], [Q.of(-k, 16), "\\sin(4x)"]),
            ],
            `$\\sin^{2} x\\cos^{2} x = \\frac{1}{4}\\sin^{2}(2x) = \\frac{1 - \\cos(4x)}{8}$, so the integral is $${answer}$.`,
            `$\\sin^{2} x\\cos^{2} x = \\frac{1}{4}\\sin^{2}(2x) = \\frac{1 - \\cos(4x)}{8}$，所以积分为 $${answer}$。`,
          );
        }
        const a = rng.int(1, 5);
        const answer = plusC([Q.of(-k, 4 * a), fn("\\cos", 2 * a)]);
        return integral(
          `${coef(Q.of(k))}${fn("\\sin", a)}${fn("\\cos", a)}`.replace(/ x\\cos/, " x \\cos"),
          answer,
          [
            plusC([Q.of(k, 4 * a), fn("\\cos", 2 * a)]),
            plusC([Q.of(-k, 2 * a), fn("\\cos", 2 * a)]),
            plusC([Q.of(-k, a * a), `${fn("\\cos", a)}${fn("\\sin", a)}`.replace(/ x\\sin/, " x \\sin")]),
          ],
          `$${fn("\\sin", a)}${fn("\\cos", a)} = \\frac{1}{2}${fn("\\sin", 2 * a)}$, so the integral is $${coef(Q.of(k, 2))}\\left(-\\frac{${fn("\\cos", 2 * a)}}{${2 * a}}\\right) + C = ${answer}$.`,
          `$${fn("\\sin", a)}${fn("\\cos", a)} = \\frac{1}{2}${fn("\\sin", 2 * a)}$，所以积分为 $${coef(Q.of(k, 2))}\\left(-\\frac{${fn("\\cos", 2 * a)}}{${2 * a}}\\right) + C = ${answer}$。`,
        );
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
  prerequisites: ["integration-using-the-double-angle-formulas"],
  encompasses: [
    { topic: "integration-using-the-double-angle-formulas", weight: 0.3 },
    { topic: "the-sum-and-difference-formulas-for-sine", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-sine-times-cosine",
      title: t("Integrating sine times cosine", "正弦乘余弦的积分"),
      explanation: t(
        "Adding the sum and difference formulas for sine gives the product-to-sum formula\n\n$$\\sin A\\cos B = \\frac{1}{2}\\left[\\sin(A + B) + \\sin(A - B)\\right].$$\n\nSo $\\int \\sin 3x\\cos x \\, dx = \\frac{1}{2}\\int (\\sin 4x + \\sin 2x) \\, dx = -\\frac{\\cos 4x}{8} - \\frac{\\cos 2x}{4} + C$.",
        "把正弦的和角公式与差角公式相加，得积化和差公式\n\n$$\\sin A\\cos B = \\frac{1}{2}\\left[\\sin(A + B) + \\sin(A - B)\\right]。$$\n\n所以 $\\int \\sin 3x\\cos x \\, dx = \\frac{1}{2}\\int (\\sin 4x + \\sin 2x) \\, dx = -\\frac{\\cos 4x}{8} - \\frac{\\cos 2x}{4} + C$。",
      ),
      generate(rng) {
        const [a, b] = productPair(rng);
        const k = rng.nonZero(-6, 6);
        const sinFirst = rng.bool();
        // sin(ax)cos(bx) = ½[sin((a+b)x) + sin((a−b)x)]; cos(ax)sin(bx) = ½[sin((a+b)x) − sin((a−b)x)].
        const s = sinFirst ? 1 : -1;
        const answer = plusC([Q.of(-k, 2 * (a + b)), fn("\\cos", a + b)], [Q.of(-s * k, 2 * (a - b)), fn("\\cos", a - b)]);
        const integrand = sinFirst ? `${fn("\\sin", a)}${fn("\\cos", b)}` : `${fn("\\cos", a)}${fn("\\sin", b)}`;
        return integral(
          `${coef(Q.of(k))}${integrand}`,
          answer,
          [
            plusC([Q.of(k, 2 * (a + b)), fn("\\cos", a + b)], [Q.of(s * k, 2 * (a - b)), fn("\\cos", a - b)]),
            plusC([Q.of(-k, 2 * (a + b)), fn("\\cos", a + b)], [Q.of(s * k, 2 * (a - b)), fn("\\cos", a - b)]),
            plusC([
              Q.of(-k, a * b),
              `${sinFirst ? fn("\\cos", a) : fn("\\sin", a)}${sinFirst ? `${fn("\\sin", b)}` : `${fn("\\cos", b)}`}`,
            ]),
          ],
          `$${integrand} = \\frac{1}{2}\\left[${fn("\\sin", a + b)} ${sinFirst ? "+" : "-"} ${fn("\\sin", a - b)}\\right]$. Integrating each sine, the integral is $${answer}$.`,
          `$${integrand} = \\frac{1}{2}\\left[${fn("\\sin", a + b)} ${sinFirst ? "+" : "-"} ${fn("\\sin", a - b)}\\right]$。分别积分，得 $${answer}$。`,
        );
      },
    },
    {
      id: "integrating-sine-times-sine-and-cosine-times-cosine",
      title: t("Integrating sine times sine and cosine times cosine", "正弦乘正弦与余弦乘余弦的积分"),
      explanation: t(
        "From the sum and difference formulas for cosine:\n\n$$\\sin A\\sin B = \\frac{1}{2}\\left[\\cos(A - B) - \\cos(A + B)\\right], \\qquad \\cos A\\cos B = \\frac{1}{2}\\left[\\cos(A - B) + \\cos(A + B)\\right].$$\n\nSo $\\int \\cos 3x\\cos x \\, dx = \\frac{\\sin 2x}{4} + \\frac{\\sin 4x}{8} + C$.",
        "由余弦的和角与差角公式：\n\n$$\\sin A\\sin B = \\frac{1}{2}\\left[\\cos(A - B) - \\cos(A + B)\\right], \\qquad \\cos A\\cos B = \\frac{1}{2}\\left[\\cos(A - B) + \\cos(A + B)\\right]。$$\n\n所以 $\\int \\cos 3x\\cos x \\, dx = \\frac{\\sin 2x}{4} + \\frac{\\sin 4x}{8} + C$。",
      ),
      generate(rng) {
        const [a, b] = productPair(rng);
        const k = rng.nonZero(-6, 6);
        const sines = rng.bool();
        const s = sines ? -1 : 1;
        const f = sines ? "\\sin" : "\\cos";
        const answer = plusC([Q.of(k, 2 * (a - b)), fn("\\sin", a - b)], [Q.of(s * k, 2 * (a + b)), fn("\\sin", a + b)]);
        const integrand = `${fn(f, a)}${fn(f, b)}`;
        return integral(
          `${coef(Q.of(k))}${integrand}`,
          answer,
          [
            plusC([Q.of(k, 2 * (a - b)), fn("\\sin", a - b)], [Q.of(-s * k, 2 * (a + b)), fn("\\sin", a + b)]),
            plusC([Q.of(-k, 2 * (a - b)), fn("\\cos", a - b)], [Q.of(-s * k, 2 * (a + b)), fn("\\cos", a + b)]),
            plusC([Q.of(k, 2 * (a - b)), fn("\\sin", a - b)]),
          ],
          `$${integrand} = \\frac{1}{2}\\left[${fn("\\cos", a - b)} ${sines ? "-" : "+"} ${fn("\\cos", a + b)}\\right]$. Integrating each cosine, the integral is $${answer}$.`,
          `$${integrand} = \\frac{1}{2}\\left[${fn("\\cos", a - b)} ${sines ? "-" : "+"} ${fn("\\cos", a + b)}\\right]$。分别积分，得 $${answer}$。`,
        );
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
  prerequisites: ["integrating-hyperbolic-functions-using-substitution"],
  encompasses: [{ topic: "integrating-hyperbolic-functions-using-substitution", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rewriting-with-hyperbolic-quotient-identities",
      title: t("Rewriting with hyperbolic quotient identities", "用双曲函数的商数关系改写"),
      explanation: t(
        "As with trigonometric functions, $\\tanh x = \\frac{\\sinh x}{\\cosh x}$, $\\operatorname{sech} x = \\frac{1}{\\cosh x}$, and so on. Recall $\\frac{d}{dx}\\operatorname{sech} x = -\\operatorname{sech} x\\tanh x$, $\\frac{d}{dx}\\tanh x = \\operatorname{sech}^{2} x$ and $\\frac{d}{dx}\\coth x = -\\operatorname{csch}^{2} x$. For example,\n\n$$\\int \\frac{\\sinh x}{\\cosh^{2} x} \\, dx = \\int \\operatorname{sech} x\\tanh x \\, dx = -\\operatorname{sech} x + C.$$",
        "与三角函数类似，$\\tanh x = \\frac{\\sinh x}{\\cosh x}$，$\\operatorname{sech} x = \\frac{1}{\\cosh x}$，等等。回忆 $\\frac{d}{dx}\\operatorname{sech} x = -\\operatorname{sech} x\\tanh x$，$\\frac{d}{dx}\\tanh x = \\operatorname{sech}^{2} x$，$\\frac{d}{dx}\\coth x = -\\operatorname{csch}^{2} x$。例如\n\n$$\\int \\frac{\\sinh x}{\\cosh^{2} x} \\, dx = \\int \\operatorname{sech} x\\tanh x \\, dx = -\\operatorname{sech} x + C。$$",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const one = (den: string) => fracWith(k, "", den).replace("\\frac{}", "\\frac{1}");
        const cases: Case[] = [
          {
            integrand: fracWith(k, "\\sinh x", "\\cosh^{2} x"),
            answer: plusC([-k, "\\operatorname{sech} x"]),
            wrong: [plusC([k, "\\operatorname{sech} x"]), plusC([k, "\\tanh x"]), plusC([-k, "\\operatorname{csch} x"])],
            en: `$\\frac{\\sinh x}{\\cosh^{2} x} = \\operatorname{sech} x\\tanh x$, whose antiderivative is $-\\operatorname{sech} x$: $${plusC([-k, "\\operatorname{sech} x"])}$.`,
            zh: `$\\frac{\\sinh x}{\\cosh^{2} x} = \\operatorname{sech} x\\tanh x$，其原函数为 $-\\operatorname{sech} x$：$${plusC([-k, "\\operatorname{sech} x"])}$。`,
          },
          {
            integrand: fracWith(k, "\\cosh x", "\\sinh^{2} x"),
            answer: plusC([-k, "\\operatorname{csch} x"]),
            wrong: [plusC([k, "\\operatorname{csch} x"]), plusC([-k, "\\coth x"]), plusC([k, "\\coth x"])],
            en: `$\\frac{\\cosh x}{\\sinh^{2} x} = \\operatorname{csch} x\\coth x$, whose antiderivative is $-\\operatorname{csch} x$: $${plusC([-k, "\\operatorname{csch} x"])}$.`,
            zh: `$\\frac{\\cosh x}{\\sinh^{2} x} = \\operatorname{csch} x\\coth x$，其原函数为 $-\\operatorname{csch} x$：$${plusC([-k, "\\operatorname{csch} x"])}$。`,
          },
          {
            integrand: one("\\cosh^{2} x"),
            answer: plusC([k, "\\tanh x"]),
            wrong: [plusC([-k, "\\tanh x"]), plusC([k, "\\operatorname{sech} x"]), plusC([-k, "\\coth x"])],
            en: `$\\frac{1}{\\cosh^{2} x} = \\operatorname{sech}^{2} x$, the derivative of $\\tanh x$: $${plusC([k, "\\tanh x"])}$.`,
            zh: `$\\frac{1}{\\cosh^{2} x} = \\operatorname{sech}^{2} x$，它是 $\\tanh x$ 的导数：$${plusC([k, "\\tanh x"])}$。`,
          },
          {
            integrand: one("\\sinh^{2} x"),
            answer: plusC([-k, "\\coth x"]),
            wrong: [plusC([k, "\\coth x"]), plusC([-k, "\\operatorname{csch} x"]), plusC([k, "\\tanh x"])],
            en: `$\\frac{1}{\\sinh^{2} x} = \\operatorname{csch}^{2} x$, and $\\frac{d}{dx}\\coth x = -\\operatorname{csch}^{2} x$: $${plusC([-k, "\\coth x"])}$.`,
            zh: `$\\frac{1}{\\sinh^{2} x} = \\operatorname{csch}^{2} x$，而 $\\frac{d}{dx}\\coth x = -\\operatorname{csch}^{2} x$：$${plusC([-k, "\\coth x"])}$。`,
          },
          {
            integrand: `${coef(Q.of(k))}\\tanh x\\cosh x`,
            answer: plusC([k, "\\cosh x"]),
            wrong: [plusC([-k, "\\cosh x"]), plusC([k, "\\sinh x"]), plusC([k, "\\ln(\\cosh x)"])],
            en: `$\\tanh x\\cosh x = \\sinh x$, so the integral is $${plusC([k, "\\cosh x"])}$.`,
            zh: `$\\tanh x\\cosh x = \\sinh x$，所以积分为 $${plusC([k, "\\cosh x"])}$。`,
          },
          {
            integrand: `${coef(Q.of(k))}\\coth x\\sinh x`,
            answer: plusC([k, "\\sinh x"]),
            wrong: [plusC([-k, "\\sinh x"]), plusC([k, "\\cosh x"]), plusC([k, "\\ln|\\sinh x|"])],
            en: `$\\coth x\\sinh x = \\cosh x$, so the integral is $${plusC([k, "\\sinh x"])}$.`,
            zh: `$\\coth x\\sinh x = \\cosh x$，所以积分为 $${plusC([k, "\\sinh x"])}$。`,
          },
        ];
        return fromCase(rng.pick(cases));
      },
    },
    {
      id: "integrating-with-exponential-definitions",
      title: t("Integrating with the exponential definitions", "用指数定义积分"),
      explanation: t(
        "When a hyperbolic function is multiplied by an exponential, write it with $\\sinh x = \\frac{e^{x} - e^{-x}}{2}$ and $\\cosh x = \\frac{e^{x} + e^{-x}}{2}$:\n\n$$\\int e^{x}\\cosh x \\, dx = \\int \\frac{e^{2x} + 1}{2} \\, dx = \\frac{e^{2x}}{4} + \\frac{x}{2} + C.$$",
        "当双曲函数乘以指数函数时，用 $\\sinh x = \\frac{e^{x} - e^{-x}}{2}$、$\\cosh x = \\frac{e^{x} + e^{-x}}{2}$ 改写：\n\n$$\\int e^{x}\\cosh x \\, dx = \\int \\frac{e^{2x} + 1}{2} \\, dx = \\frac{e^{2x}}{4} + \\frac{x}{2} + C。$$",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const up = rng.bool();
        const sinh = rng.bool();
        // e^{x}·sinh/cosh = (e^{2x} ∓ 1)/2; e^{−x}·sinh/cosh = (1 ∓ e^{−2x})/2.
        const [e, e2, sx, s2] = up ? ["e^{x}", "e^{2x}", sinh ? -1 : 1, 1] : ["e^{-x}", "e^{-2x}", 1, sinh ? 1 : -1];
        const f = sinh ? "\\sinh x" : "\\cosh x";
        const answer = plusC([Q.of(s2 * k, 4), e2], [Q.of(sx * k, 2), "x"]);
        const expanded = up ? `\\frac{e^{2x} ${sinh ? "-" : "+"} 1}{2}` : `\\frac{1 ${sinh ? "-" : "+"} e^{-2x}}{2}`;
        return integral(
          `${coef(Q.of(k))}${e}${f}`,
          answer,
          [
            plusC([Q.of(-s2 * k, 4), e2], [Q.of(sx * k, 2), "x"]),
            plusC([Q.of(s2 * k, 2), e2], [Q.of(sx * k, 2), "x"]),
            plusC([k, `${e}${sinh ? "\\cosh x" : "\\sinh x"}`]),
          ],
          `$${e}${f} = ${expanded}$, so the integral is $${answer}$.`,
          `$${e}${f} = ${expanded}$，所以积分为 $${answer}$。`,
        );
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
  prerequisites: ["integration-using-basic-hyperbolic-identities"],
  encompasses: [{ topic: "integration-using-basic-hyperbolic-identities", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-squares-of-tanh-and-coth",
      title: t("Integrating squares of tanh and coth", "tanh 与 coth 平方的积分"),
      explanation: t(
        "Dividing $\\cosh^{2} x - \\sinh^{2} x = 1$ by $\\cosh^{2} x$ or $\\sinh^{2} x$ gives $\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$ and $\\coth^{2} x = 1 + \\operatorname{csch}^{2} x$. So\n\n$$\\int \\tanh^{2} x \\, dx = x - \\tanh x + C, \\qquad \\int \\coth^{2} x \\, dx = x - \\coth x + C.$$\n\nNote the signs differ from the trigonometric case.",
        "把 $\\cosh^{2} x - \\sinh^{2} x = 1$ 两边除以 $\\cosh^{2} x$ 或 $\\sinh^{2} x$，得 $\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$，$\\coth^{2} x = 1 + \\operatorname{csch}^{2} x$。所以\n\n$$\\int \\tanh^{2} x \\, dx = x - \\tanh x + C, \\qquad \\int \\coth^{2} x \\, dx = x - \\coth x + C。$$\n\n注意符号与三角函数的情形不同。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const cases: Case[] = [
          {
            integrand: `${coef(Q.of(k))}\\tanh^{2} x`,
            answer: plusC([k, "x"], [-k, "\\tanh x"]),
            wrong: [plusC([k, "\\tanh x"], [-k, "x"]), plusC([Q.of(k, 3), "\\tanh^{3} x"]), plusC([k, "x"], [k, "\\tanh x"])],
            en: `$\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$, so the integral is $${plusC([k, "x"], [-k, "\\tanh x"])}$.`,
            zh: `$\\tanh^{2} x = 1 - \\operatorname{sech}^{2} x$，所以积分为 $${plusC([k, "x"], [-k, "\\tanh x"])}$。`,
          },
          {
            integrand: `${coef(Q.of(k))}\\coth^{2} x`,
            answer: plusC([k, "x"], [-k, "\\coth x"]),
            wrong: [plusC([k, "x"], [k, "\\coth x"]), plusC([Q.of(k, 3), "\\coth^{3} x"]), plusC([-k, "x"], [-k, "\\coth x"])],
            en: `$\\coth^{2} x = 1 + \\operatorname{csch}^{2} x$, and $\\int \\operatorname{csch}^{2} x \\, dx = -\\coth x$, so the integral is $${plusC([k, "x"], [-k, "\\coth x"])}$.`,
            zh: `$\\coth^{2} x = 1 + \\operatorname{csch}^{2} x$，而 $\\int \\operatorname{csch}^{2} x \\, dx = -\\coth x$，所以积分为 $${plusC([k, "x"], [-k, "\\coth x"])}$。`,
          },
          {
            integrand: fracWith(k, "(\\cosh^{2} x - 1)", "\\sinh x"),
            answer: plusC([k, "\\cosh x"]),
            wrong: [plusC([-k, "\\cosh x"]), plusC([k, "\\sinh x"]), plusC([k, "\\ln|\\sinh x|"])],
            en: `$\\cosh^{2} x - 1 = \\sinh^{2} x$, so the integrand is $${coef(Q.of(k))}\\sinh x$ and the integral is $${plusC([k, "\\cosh x"])}$.`,
            zh: `$\\cosh^{2} x - 1 = \\sinh^{2} x$，所以被积函数为 $${coef(Q.of(k))}\\sinh x$，积分为 $${plusC([k, "\\cosh x"])}$。`,
          },
        ];
        return fromCase(rng.pick(cases));
      },
    },
    {
      id: "integrating-odd-powers-of-sinh-and-cosh",
      title: t("Integrating odd powers of sinh and cosh", "sinh 与 cosh 奇次幂的积分"),
      explanation: t(
        "Keep one factor for $du$ and convert the rest with $\\sinh^{2} x = \\cosh^{2} x - 1$ or $\\cosh^{2} x = 1 + \\sinh^{2} x$:\n\n$$\\int \\sinh^{3} x \\, dx = \\int (\\cosh^{2} x - 1)\\sinh x \\, dx = \\frac{\\cosh^{3} x}{3} - \\cosh x + C.$$",
        "留一个因子作 $du$，其余用 $\\sinh^{2} x = \\cosh^{2} x - 1$ 或 $\\cosh^{2} x = 1 + \\sinh^{2} x$ 转化：\n\n$$\\int \\sinh^{3} x \\, dx = \\int (\\cosh^{2} x - 1)\\sinh x \\, dx = \\frac{\\cosh^{3} x}{3} - \\cosh x + C。$$",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const cases: Case[] = [
          {
            integrand: `${coef(Q.of(k))}\\sinh^{3} x`,
            answer: plusC([Q.of(k, 3), "\\cosh^{3} x"], [-k, "\\cosh x"]),
            wrong: [
              plusC([Q.of(k, 4), "\\sinh^{4} x"]),
              plusC([Q.of(-k, 3), "\\cosh^{3} x"], [k, "\\cosh x"]),
              plusC([Q.of(k, 3), "\\cosh^{3} x"], [k, "\\cosh x"]),
            ],
            en: `$\\sinh^{3} x = (\\cosh^{2} x - 1)\\sinh x$. With $u = \\cosh x$: $${coef(Q.of(k))}\\int (u^{2} - 1) \\, du = ${plusC([Q.of(k, 3), "\\cosh^{3} x"], [-k, "\\cosh x"])}$.`,
            zh: `$\\sinh^{3} x = (\\cosh^{2} x - 1)\\sinh x$。令 $u = \\cosh x$：$${coef(Q.of(k))}\\int (u^{2} - 1) \\, du = ${plusC([Q.of(k, 3), "\\cosh^{3} x"], [-k, "\\cosh x"])}$。`,
          },
          {
            integrand: `${coef(Q.of(k))}\\cosh^{3} x`,
            answer: plusC([k, "\\sinh x"], [Q.of(k, 3), "\\sinh^{3} x"]),
            wrong: [
              plusC([Q.of(k, 4), "\\cosh^{4} x"]),
              plusC([k, "\\sinh x"], [Q.of(-k, 3), "\\sinh^{3} x"]),
              plusC([Q.of(k, 3), "\\sinh^{3} x"]),
            ],
            en: `$\\cosh^{3} x = (1 + \\sinh^{2} x)\\cosh x$. With $u = \\sinh x$: $${coef(Q.of(k))}\\int (1 + u^{2}) \\, du = ${plusC([k, "\\sinh x"], [Q.of(k, 3), "\\sinh^{3} x"])}$.`,
            zh: `$\\cosh^{3} x = (1 + \\sinh^{2} x)\\cosh x$。令 $u = \\sinh x$：$${coef(Q.of(k))}\\int (1 + u^{2}) \\, du = ${plusC([k, "\\sinh x"], [Q.of(k, 3), "\\sinh^{3} x"])}$。`,
          },
          {
            integrand: `${coef(Q.of(k))}\\sinh^{3} x\\cosh^{2} x`,
            answer: plusC([Q.of(k, 5), "\\cosh^{5} x"], [Q.of(-k, 3), "\\cosh^{3} x"]),
            wrong: [
              plusC([Q.of(k, 5), "\\cosh^{5} x"], [Q.of(k, 3), "\\cosh^{3} x"]),
              plusC([Q.of(k, 12), "\\sinh^{4} x\\cosh^{3} x"]),
              plusC([Q.of(-k, 5), "\\cosh^{5} x"], [Q.of(k, 3), "\\cosh^{3} x"]),
            ],
            en: `$\\sinh^{3} x\\cosh^{2} x = (\\cosh^{2} x - 1)\\cosh^{2} x\\sinh x$. With $u = \\cosh x$: $${coef(Q.of(k))}\\int (u^{4} - u^{2}) \\, du = ${plusC([Q.of(k, 5), "\\cosh^{5} x"], [Q.of(-k, 3), "\\cosh^{3} x"])}$.`,
            zh: `$\\sinh^{3} x\\cosh^{2} x = (\\cosh^{2} x - 1)\\cosh^{2} x\\sinh x$。令 $u = \\cosh x$：$${coef(Q.of(k))}\\int (u^{4} - u^{2}) \\, du = ${plusC([Q.of(k, 5), "\\cosh^{5} x"], [Q.of(-k, 3), "\\cosh^{3} x"])}$。`,
          },
          {
            integrand: `${coef(Q.of(k))}\\cosh^{3} x\\sinh^{2} x`,
            answer: plusC([Q.of(k, 3), "\\sinh^{3} x"], [Q.of(k, 5), "\\sinh^{5} x"]),
            wrong: [
              plusC([Q.of(k, 3), "\\sinh^{3} x"], [Q.of(-k, 5), "\\sinh^{5} x"]),
              plusC([Q.of(k, 12), "\\cosh^{4} x\\sinh^{3} x"]),
              plusC([Q.of(k, 5), "\\sinh^{5} x"]),
            ],
            en: `$\\cosh^{3} x\\sinh^{2} x = (1 + \\sinh^{2} x)\\sinh^{2} x\\cosh x$. With $u = \\sinh x$: $${coef(Q.of(k))}\\int (u^{2} + u^{4}) \\, du = ${plusC([Q.of(k, 3), "\\sinh^{3} x"], [Q.of(k, 5), "\\sinh^{5} x"])}$.`,
            zh: `$\\cosh^{3} x\\sinh^{2} x = (1 + \\sinh^{2} x)\\sinh^{2} x\\cosh x$。令 $u = \\sinh x$：$${coef(Q.of(k))}\\int (u^{2} + u^{4}) \\, du = ${plusC([Q.of(k, 3), "\\sinh^{3} x"], [Q.of(k, 5), "\\sinh^{5} x"])}$。`,
          },
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
  prerequisites: ["integration-using-the-hyperbolic-pythagorean-identities"],
  encompasses: [{ topic: "integration-using-the-hyperbolic-pythagorean-identities", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-squares-of-sinh-and-cosh",
      title: t("Integrating squares of sinh and cosh", "sinh 与 cosh 平方的积分"),
      explanation: t(
        "From $\\cosh 2\\theta = \\cosh^{2} \\theta + \\sinh^{2} \\theta$ and $\\cosh^{2} \\theta - \\sinh^{2} \\theta = 1$: $\\cosh^{2} \\theta = \\frac{\\cosh 2\\theta + 1}{2}$ and $\\sinh^{2} \\theta = \\frac{\\cosh 2\\theta - 1}{2}$. So\n\n$$\\int \\sinh^{2}(ax) \\, dx = \\frac{\\sinh(2ax)}{4a} - \\frac{x}{2} + C, \\qquad \\int \\cosh^{2}(ax) \\, dx = \\frac{\\sinh(2ax)}{4a} + \\frac{x}{2} + C.$$",
        "由 $\\cosh 2\\theta = \\cosh^{2} \\theta + \\sinh^{2} \\theta$ 与 $\\cosh^{2} \\theta - \\sinh^{2} \\theta = 1$ 得 $\\cosh^{2} \\theta = \\frac{\\cosh 2\\theta + 1}{2}$，$\\sinh^{2} \\theta = \\frac{\\cosh 2\\theta - 1}{2}$。所以\n\n$$\\int \\sinh^{2}(ax) \\, dx = \\frac{\\sinh(2ax)}{4a} - \\frac{x}{2} + C, \\qquad \\int \\cosh^{2}(ax) \\, dx = \\frac{\\sinh(2ax)}{4a} + \\frac{x}{2} + C。$$",
      ),
      generate(rng) {
        const k = rng.nonZero(-8, 8);
        const a = rng.int(1, 4);
        const sinh = rng.bool();
        const s = sinh ? -1 : 1;
        const f = sinh ? "\\sinh" : "\\cosh";
        const answer = plusC([Q.of(k, 4 * a), fn("\\sinh", 2 * a)], [Q.of(s * k, 2), "x"]);
        return integral(
          `${coef(Q.of(k))}${a === 1 ? `${f}^{2} x` : `${f}^{2}(${a}x)`}`,
          answer,
          [
            plusC([Q.of(k, 4 * a), fn("\\sinh", 2 * a)], [Q.of(-s * k, 2), "x"]),
            plusC([Q.of(k, 3 * a), a === 1 ? `${f}^{3} x` : `${f}^{3}(${a}x)`]),
            plusC([Q.of(k, 2 * a), fn("\\sinh", 2 * a)], [Q.of(s * k, 2), "x"]),
          ],
          `$${f}^{2}(${a === 1 ? "x" : `${a}x`}) = \\frac{${fn("\\cosh", 2 * a)} ${sinh ? "-" : "+"} 1}{2}$, so the integral is $${answer}$.`,
          `$${f}^{2}(${a === 1 ? "x" : `${a}x`}) = \\frac{${fn("\\cosh", 2 * a)} ${sinh ? "-" : "+"} 1}{2}$，所以积分为 $${answer}$。`,
        );
      },
    },
    {
      id: "integrating-products-of-sinh-and-cosh",
      title: t("Integrating products of sinh and cosh", "sinh 与 cosh 之积的积分"),
      explanation: t(
        "Use $\\sinh 2\\theta = 2\\sinh \\theta\\cosh \\theta$: $\\int \\sinh(ax)\\cosh(ax) \\, dx = \\frac{\\cosh(2ax)}{4a} + C$. Squaring, $\\sinh^{2} x\\cosh^{2} x = \\frac{1}{4}\\sinh^{2} 2x = \\frac{\\cosh 4x - 1}{8}$, so $\\int \\sinh^{2} x\\cosh^{2} x \\, dx = \\frac{\\sinh 4x}{32} - \\frac{x}{8} + C$.",
        "利用 $\\sinh 2\\theta = 2\\sinh \\theta\\cosh \\theta$：$\\int \\sinh(ax)\\cosh(ax) \\, dx = \\frac{\\cosh(2ax)}{4a} + C$。平方得 $\\sinh^{2} x\\cosh^{2} x = \\frac{1}{4}\\sinh^{2} 2x = \\frac{\\cosh 4x - 1}{8}$，所以 $\\int \\sinh^{2} x\\cosh^{2} x \\, dx = \\frac{\\sinh 4x}{32} - \\frac{x}{8} + C$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        if (rng.bool(0.3)) {
          const answer = plusC([Q.of(k, 32), "\\sinh(4x)"], [Q.of(-k, 8), "x"]);
          return integral(
            `${coef(Q.of(k))}\\sinh^{2} x\\cosh^{2} x`,
            answer,
            [
              plusC([Q.of(k, 32), "\\sinh(4x)"], [Q.of(k, 8), "x"]),
              plusC([Q.of(k, 9), "\\sinh^{3} x\\cosh^{3} x"]),
              plusC([Q.of(k, 16), "\\sinh(4x)"], [Q.of(-k, 4), "x"]),
            ],
            `$\\sinh^{2} x\\cosh^{2} x = \\frac{1}{4}\\sinh^{2}(2x) = \\frac{\\cosh(4x) - 1}{8}$, so the integral is $${answer}$.`,
            `$\\sinh^{2} x\\cosh^{2} x = \\frac{1}{4}\\sinh^{2}(2x) = \\frac{\\cosh(4x) - 1}{8}$，所以积分为 $${answer}$。`,
          );
        }
        const a = rng.int(1, 5);
        const answer = plusC([Q.of(k, 4 * a), fn("\\cosh", 2 * a)]);
        return integral(
          `${coef(Q.of(k))}${fn("\\sinh", a)} ${fn("\\cosh", a)}`,
          answer,
          [
            plusC([Q.of(-k, 4 * a), fn("\\cosh", 2 * a)]),
            plusC([Q.of(k, 2 * a), fn("\\cosh", 2 * a)]),
            plusC([Q.of(k, 4 * a), fn("\\sinh", 2 * a)]),
          ],
          `$${fn("\\sinh", a)}${fn("\\cosh", a)} = \\frac{1}{2}${fn("\\sinh", 2 * a)}$, so the integral is $${answer}$.`,
          `$${fn("\\sinh", a)}${fn("\\cosh", a)} = \\frac{1}{2}${fn("\\sinh", 2 * a)}$，所以积分为 $${answer}$。`,
        );
      },
    },
  ],
};

/** ax writes a·x: "x", "3x", "-2x". */
const ax = (a: number) => poly([a, "x"]);

/** introductionToIntegrationByParts integrates x·e^(ax), x·sin(ax) and x·cos(ax) and chooses u and dv. */
export const introductionToIntegrationByParts: TopicDef = {
  id: "introduction-to-integration-by-parts",
  title: t("Introduction to Integration by Parts", "分部积分法入门"),
  summary: t(
    "Integrate products with ∫u dv = uv − ∫v du, choosing u to become simpler when differentiated.",
    "用 ∫u dv = uv − ∫v du 求乘积的积分，选取求导后变简单的因子为 u。",
  ),
  prerequisites: ["integrating-exponential-functions-using-linear-substitution"],
  encompasses: [
    { topic: "the-product-rule-for-differentiation", weight: 0.2 },
    { topic: "integrating-exponential-functions-using-linear-substitution", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-x-times-exponential-or-trigonometric-functions",
      title: t("Integrating x times exponential or trigonometric functions", "x 乘指数或三角函数的积分"),
      explanation: t(
        "Integrating the product rule $(uv)' = u'v + uv'$ gives\n\n$$\\int u \\, dv = uv - \\int v \\, du.$$\n\nFor $\\int xe^{2x} \\, dx$ take $u = x$ and $dv = e^{2x} \\, dx$, so $du = dx$ and $v = \\frac{1}{2}e^{2x}$:\n\n$$\\int xe^{2x} \\, dx = \\frac{1}{2}xe^{2x} - \\int \\frac{1}{2}e^{2x} \\, dx = \\frac{1}{2}xe^{2x} - \\frac{1}{4}e^{2x} + C.$$",
        "对乘积法则 $(uv)' = u'v + uv'$ 积分，得\n\n$$\\int u \\, dv = uv - \\int v \\, du。$$\n\n对 $\\int xe^{2x} \\, dx$，取 $u = x$，$dv = e^{2x} \\, dx$，则 $du = dx$，$v = \\frac{1}{2}e^{2x}$：\n\n$$\\int xe^{2x} \\, dx = \\frac{1}{2}xe^{2x} - \\int \\frac{1}{2}e^{2x} \\, dx = \\frac{1}{2}xe^{2x} - \\frac{1}{4}e^{2x} + C。$$",
      ),
      generate(rng) {
        const k = rng.nonZero(-6, 6);
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const a = rng.pick([1, 2, 3, 4, -1, -2, -3]);
          const e = `e^{${ax(a)}}`;
          const answer = plusC([Q.of(k, a), `x${e}`], [Q.of(-k, a * a), e]);
          return integral(
            `${poly([k, "x"])}${e}`,
            answer,
            [plusC([Q.of(k, a), `x${e}`], [Q.of(k, a * a), e]), plusC([Q.of(k, 2 * a), `x^{2}${e}`]), plusC([Q.of(k, a), `x${e}`])],
            `Take $u = x$, $dv = ${e} \\, dx$, so $v = ${Q.of(1, a).toLatex()}${e}$. Then $\\int ${poly([k, "x"])}${e} \\, dx = ${coef(Q.of(k, a))}x${e} ${k * a < 0 ? "+" : "-"} ${coef(Q.of(Math.abs(k), Math.abs(a)))}\\int ${e} \\, dx = ${answer}$.`,
            `取 $u = x$，$dv = ${e} \\, dx$，则 $v = ${Q.of(1, a).toLatex()}${e}$。于是 $\\int ${poly([k, "x"])}${e} \\, dx = ${coef(Q.of(k, a))}x${e} ${k * a < 0 ? "+" : "-"} ${coef(Q.of(Math.abs(k), Math.abs(a)))}\\int ${e} \\, dx = ${answer}$。`,
          );
        }
        const a = rng.int(1, 4);
        const sine = kind === 1;
        // ∫x sin(ax) = −x cos(ax)/a + sin(ax)/a²; ∫x cos(ax) = x sin(ax)/a + cos(ax)/a².
        const answer = sine
          ? plusC([Q.of(-k, a), `x${fn("\\cos", a)}`], [Q.of(k, a * a), fn("\\sin", a)])
          : plusC([Q.of(k, a), `x${fn("\\sin", a)}`], [Q.of(k, a * a), fn("\\cos", a)]);
        return integral(
          `${poly([k, "x"])}${fn(sine ? "\\sin" : "\\cos", a)}`,
          answer,
          sine
            ? [
                plusC([Q.of(-k, a), `x${fn("\\cos", a)}`], [Q.of(-k, a * a), fn("\\sin", a)]),
                plusC([Q.of(k, a), `x${fn("\\cos", a)}`], [Q.of(k, a * a), fn("\\sin", a)]),
                plusC([Q.of(-k, 2 * a), `x^{2}${fn("\\cos", a)}`]),
              ]
            : [
                plusC([Q.of(k, a), `x${fn("\\sin", a)}`], [Q.of(-k, a * a), fn("\\cos", a)]),
                plusC([Q.of(-k, a), `x${fn("\\sin", a)}`], [Q.of(k, a * a), fn("\\cos", a)]),
                plusC([Q.of(k, 2 * a), `x^{2}${fn("\\sin", a)}`]),
              ],
          `Take $u = x$ and $dv = ${fn(sine ? "\\sin" : "\\cos", a)} \\, dx$, so $v = ${sine ? `-${fracTerm(Q.one, fn("\\cos", a), String(a)).replace("\\frac{1}{1}", "")}` : fracTerm(Q.one, fn("\\sin", a), String(a))}$. Then $uv - \\int v \\, du$ gives $${answer}$.`.replace(
            /\\frac\{(\\[a-z]+[^}]*)\}\{1\}/g,
            "$1",
          ),
          `取 $u = x$，$dv = ${fn(sine ? "\\sin" : "\\cos", a)} \\, dx$，则 $v = ${sine ? `-${fracTerm(Q.one, fn("\\cos", a), String(a))}` : fracTerm(Q.one, fn("\\sin", a), String(a))}$。由 $uv - \\int v \\, du$ 得 $${answer}$。`.replace(
            /\\frac\{(\\[a-z]+[^}]*)\}\{1\}/g,
            "$1",
          ),
        );
      },
    },
    {
      id: "choosing-u-and-dv",
      title: t("Choosing u and dv", "选择 u 与 dv"),
      explanation: t(
        "Choose $u$ to be the factor that becomes simpler when differentiated, and $dv$ a factor you can integrate. A common order of preference for $u$ is LIATE: Logarithmic, Inverse trigonometric, Algebraic (powers of $x$), Trigonometric, Exponential. In $\\int x\\ln x \\, dx$ take $u = \\ln x$, since $\\ln x$ is hard to integrate but its derivative $\\frac{1}{x}$ is simple.",
        "选求导后变简单的因子作 $u$，选能积分的因子作 $dv$。选 $u$ 的常用优先顺序是“对反幂三指”：对数函数、反三角函数、幂函数（$x$ 的幂）、三角函数、指数函数。对 $\\int x\\ln x \\, dx$ 取 $u = \\ln x$，因为 $\\ln x$ 不易积分，而它的导数 $\\frac{1}{x}$ 很简单。",
      ),
      generate(rng) {
        const a = rng.int(2, 6);
        const n = rng.int(1, 4);
        const pair = (u: string, dv: string) => t(`$u = ${u}$, $dv = ${dv} \\, dx$`, `$u = ${u}$，$dv = ${dv} \\, dx$`);
        const cases = [
          { f: `${xPow(n)}e^{${a}x}`, u: xPow(n), dv: `e^{${a}x}` },
          { f: `${xPow(n)}\\ln x`, u: "\\ln x", dv: xPow(n) },
          { f: `${xPow(n)}\\sin(${a}x)`, u: xPow(n), dv: `\\sin(${a}x)` },
          { f: `${xPow(n)}\\arctan x`, u: "\\arctan x", dv: xPow(n) },
          { f: `${xPow(n)}\\cos(${a}x)`, u: xPow(n), dv: `\\cos(${a}x)` },
        ];
        const c = rng.pick(cases);
        return oneOf(
          rng,
          t(
            `Which choice of $u$ and $dv$ makes $\\int ${c.f} \\, dx$ simpler by integration by parts?`,
            `用分部积分求 $\\int ${c.f} \\, dx$ 时，哪种 $u$ 与 $dv$ 的选择能使积分变简单？`,
          ),
          pair(c.u, c.dv),
          [pair(c.dv, c.u), pair(c.f, "1"), pair("1", c.f)],
          t(
            `Differentiating $${c.u}$ simplifies it, and $${c.dv}$ can be integrated, so take $u = ${c.u}$ and $dv = ${c.dv} \\, dx$.`,
            `对 $${c.u}$ 求导会使它变简单，而 $${c.dv}$ 可以积分，所以取 $u = ${c.u}$，$dv = ${c.dv} \\, dx$。`,
          ),
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
  prerequisites: ["introduction-to-integration-by-parts", "integrating-logarithmic-functions-using-substitution"],
  encompasses: [{ topic: "introduction-to-integration-by-parts", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-powers-of-x-times-ln-x",
      title: t("Integrating powers of x times ln x", "x 的幂乘 ln x 的积分"),
      explanation: t(
        "Take $u = \\ln x$ and $dv = x^{n} \\, dx$, so $du = \\frac{1}{x} \\, dx$ and $v = \\frac{x^{n + 1}}{n + 1}$:\n\n$$\\int x^{n}\\ln x \\, dx = \\frac{x^{n + 1}\\ln x}{n + 1} - \\frac{x^{n + 1}}{(n + 1)^{2}} + C.$$\n\nWith $n = 0$ this gives $\\int \\ln x \\, dx = x\\ln x - x + C$.",
        "取 $u = \\ln x$，$dv = x^{n} \\, dx$，则 $du = \\frac{1}{x} \\, dx$，$v = \\frac{x^{n + 1}}{n + 1}$：\n\n$$\\int x^{n}\\ln x \\, dx = \\frac{x^{n + 1}\\ln x}{n + 1} - \\frac{x^{n + 1}}{(n + 1)^{2}} + C。$$\n\n取 $n = 0$ 得 $\\int \\ln x \\, dx = x\\ln x - x + C$。",
      ),
      generate(rng) {
        const n = rng.int(0, 4);
        const k = rng.nonZero(-9, 9);
        const m = n + 1;
        const answer = plusC([Q.of(k, m), `${xPow(m)}\\ln x`], [Q.of(-k, m * m), xPow(m)]);
        return integral(
          `${poly([k, xPow(n)]) || coef(Q.of(k))}${n === 0 ? "" : ""}\\ln x`.replace(/^1\\ln/, "\\ln").replace(/^-1\\ln/, "-\\ln"),
          answer,
          [
            plusC([Q.of(k, m), `${xPow(m)}\\ln x`]),
            plusC([Q.of(k, m), `${xPow(m)}\\ln x`], [Q.of(-k, m), xPow(m)]),
            plusC([Q.of(k, m), `${xPow(m)}\\ln x`], [Q.of(k, m * m), xPow(m)]),
          ],
          `Take $u = \\ln x$ and $dv = ${n === 0 ? "1" : xPow(n)} \\, dx$, so $v = ${fracTerm(Q.of(1, m), xPow(m), "").replace("{}", "{1}")}$. Then $\\int ${n === 0 ? "" : xPow(n)}\\ln x \\, dx = ${fracTerm(Q.of(1, m), `${xPow(m)}\\ln x`, "").replace("{}", "{1}")} - \\int ${fracTerm(Q.of(1, m), xPow(n) || "1", "").replace("{}", "{1}")} \\, dx$, so the integral is $${answer}$.`.replace(
            /\\frac\{([^{}]*)\}\{1\}/g,
            "$1",
          ),
          `取 $u = \\ln x$，$dv = ${n === 0 ? "1" : xPow(n)} \\, dx$，则 $v = ${fracTerm(Q.of(1, m), xPow(m), "").replace("{}", "{1}")}$。于是 $\\int ${n === 0 ? "" : xPow(n)}\\ln x \\, dx = ${fracTerm(Q.of(1, m), `${xPow(m)}\\ln x`, "").replace("{}", "{1}")} - \\int ${fracTerm(Q.of(1, m), xPow(n) || "1", "").replace("{}", "{1}")} \\, dx$，所以积分为 $${answer}$。`.replace(
            /\\frac\{([^{}]*)\}\{1\}/g,
            "$1",
          ),
          { en: "$x > 0$", zh: "$x > 0$" },
        );
      },
    },
    {
      id: "further-integrals-with-logarithms",
      title: t("Further integrals with logarithms", "含对数的进一步积分"),
      explanation: t(
        "The same choice $u = \\ln x$ works when the power is negative:\n\n$$\\int \\frac{\\ln x}{x^{2}} \\, dx = -\\frac{\\ln x}{x} + \\int \\frac{1}{x^{2}} \\, dx = -\\frac{\\ln x}{x} - \\frac{1}{x} + C.$$\n\nFor $\\int (\\ln x)^{2} \\, dx$ take $u = (\\ln x)^{2}$ and $dv = dx$, then use $\\int \\ln x \\, dx = x\\ln x - x$: the result is $x(\\ln x)^{2} - 2x\\ln x + 2x + C$.",
        "幂为负数时同样取 $u = \\ln x$：\n\n$$\\int \\frac{\\ln x}{x^{2}} \\, dx = -\\frac{\\ln x}{x} + \\int \\frac{1}{x^{2}} \\, dx = -\\frac{\\ln x}{x} - \\frac{1}{x} + C。$$\n\n对 $\\int (\\ln x)^{2} \\, dx$，取 $u = (\\ln x)^{2}$，$dv = dx$，再利用 $\\int \\ln x \\, dx = x\\ln x - x$，结果为 $x(\\ln x)^{2} - 2x\\ln x + 2x + C$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const domain = { en: "$x > 0$", zh: "$x > 0$" };
        if (rng.bool(0.35)) {
          const answer = plusC([k, "x(\\ln x)^{2}"], [-2 * k, "x\\ln x"], [2 * k, "x"]);
          return integral(
            `${coef(Q.of(k))}(\\ln x)^{2}`,
            answer,
            [
              plusC([Q.of(k, 3), "(\\ln x)^{3}"]),
              plusC([k, "x(\\ln x)^{2}"], [-2 * k, "x\\ln x"]),
              plusC([k, "x(\\ln x)^{2}"], [2 * k, "x\\ln x"], [2 * k, "x"]),
            ],
            `Take $u = (\\ln x)^{2}$, $dv = dx$: $\\int (\\ln x)^{2} \\, dx = x(\\ln x)^{2} - 2\\int \\ln x \\, dx = x(\\ln x)^{2} - 2x\\ln x + 2x + C$. Multiplying by $${k}$ gives $${answer}$.`,
            `取 $u = (\\ln x)^{2}$，$dv = dx$：$\\int (\\ln x)^{2} \\, dx = x(\\ln x)^{2} - 2\\int \\ln x \\, dx = x(\\ln x)^{2} - 2x\\ln x + 2x + C$。乘以 $${k}$ 得 $${answer}$。`,
            domain,
          );
        }
        const n = rng.int(2, 3);
        const p = n - 1;
        const den = p === 1 ? "x" : `x^{${p}}`;
        // ∫ ln x · x^(−n) = −ln x/((n−1)x^(n−1)) − 1/((n−1)² x^(n−1)).
        const answer = withC(fracTerm(Q.of(-k, p), "\\ln x", den), fracTerm(Q.of(-k, p * p), "", den));
        return integral(
          fracWith(k, "\\ln x", `x^{${n}}`),
          answer,
          [
            withC(fracTerm(Q.of(-k, p), "\\ln x", den), fracTerm(Q.of(k, p * p), "", den)),
            withC(fracTerm(Q.of(-k, p), "\\ln x", den)),
            withC(fracTerm(Q.of(k, 2), "(\\ln x)^{2}", den)),
          ],
          `Take $u = \\ln x$ and $dv = x^{${-n}} \\, dx$, so $v = ${fracTerm(Q.of(-1, p), "", den)}$. Then $\\int \\frac{\\ln x}{x^{${n}}} \\, dx = ${fracTerm(Q.of(-1, p), "\\ln x", den)} + ${fracTerm(Q.of(1, p), "", "")}\\int x^{${-n}} \\, dx$, and multiplying by $${k}$ gives $${answer}$.`.replace(
            /\\frac\{1\}\{\}/g,
            "",
          ),
          `取 $u = \\ln x$，$dv = x^{${-n}} \\, dx$，则 $v = ${fracTerm(Q.of(-1, p), "", den)}$。于是 $\\int \\frac{\\ln x}{x^{${n}}} \\, dx = ${fracTerm(Q.of(-1, p), "\\ln x", den)} + ${fracTerm(Q.of(1, p), "", "")}\\int x^{${-n}} \\, dx$，乘以 $${k}$ 得 $${answer}$。`.replace(
            /\\frac\{1\}\{\}/g,
            "",
          ),
          domain,
        );
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

/** exponentialParts returns ∫p(x)e^(ax) dx as the polynomial multiplying e^(ax): Σ (−1)^i p^(i) / a^(i+1). */
function exponentialParts(p: QPoly, a: number, signs = true): QPoly {
  let out: QPoly = [];
  let d = p;
  for (let i = 0; !isZero(d) && d.length > 0; i++) {
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

/** applyingTheIntegrationByPartsTwice integrates x² times exponential and trigonometric functions. */
export const applyingTheIntegrationByPartsTwice: TopicDef = {
  id: "applying-the-integration-by-parts-twice",
  title: t("Applying the Integration by Parts Twice", "两次分部积分"),
  summary: t(
    "Integrate x² times an exponential or trigonometric function by integrating by parts twice.",
    "两次分部积分，求 x² 乘指数函数或三角函数的积分。",
  ),
  prerequisites: ["introduction-to-integration-by-parts"],
  encompasses: [{ topic: "introduction-to-integration-by-parts", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "x-squared-times-an-exponential",
      title: t("x² times an exponential", "x² 乘指数函数"),
      explanation: t(
        "Each integration by parts lowers the power of $x$ by one. For $\\int x^{2}e^{x} \\, dx$, take $u = x^{2}$: $\\int x^{2}e^{x} \\, dx = x^{2}e^{x} - 2\\int xe^{x} \\, dx$. Integrating by parts again,\n\n$$\\int x^{2}e^{x} \\, dx = x^{2}e^{x} - 2xe^{x} + 2e^{x} + C = (x^{2} - 2x + 2)e^{x} + C.$$",
        "每做一次分部积分，$x$ 的次数降低一。对 $\\int x^{2}e^{x} \\, dx$，取 $u = x^{2}$：$\\int x^{2}e^{x} \\, dx = x^{2}e^{x} - 2\\int xe^{x} \\, dx$。再分部积分一次，\n\n$$\\int x^{2}e^{x} \\, dx = x^{2}e^{x} - 2xe^{x} + 2e^{x} + C = (x^{2} - 2x + 2)e^{x} + C。$$",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, -1, -2]);
        const k = rng.nonZero(-6, 6);
        const p: QPoly = [Q.zero, Q.zero, Q.of(k)];
        const e = `e^{${ax(a)}}`;
        const right = exponentialParts(p, a);
        const answer = `${times(right, e)} + C`;
        return integral(
          `${poly([k, "x^{2}"])}${e}`,
          answer,
          [
            `${times(exponentialParts(p, a, false), e)} + C`,
            `${times(exponentialParts([Q.zero, Q.zero, Q.of(k)], 1), e)} + C`,
            `${times([Q.zero, Q.zero, Q.of(k, a)], e)} + C`,
          ],
          `Take $u = ${poly([k, "x^{2}"])}$ and $dv = ${e} \\, dx$, then integrate $${poly([2 * k, "x"])} \\cdot ${Q.of(1, a).toLatex()}${e}$ by parts again. The result is $${answer}$.`,
          `取 $u = ${poly([k, "x^{2}"])}$，$dv = ${e} \\, dx$，再对 $${poly([2 * k, "x"])} \\cdot ${Q.of(1, a).toLatex()}${e}$ 分部积分一次。结果为 $${answer}$。`,
        );
      },
    },
    {
      id: "x-squared-times-sine-or-cosine",
      title: t("x² times sine or cosine", "x² 乘正弦或余弦"),
      explanation: t(
        "Take $u = x^{2}$ twice. For example,\n\n$$\\int x^{2}\\cos x \\, dx = x^{2}\\sin x - 2\\int x\\sin x \\, dx = x^{2}\\sin x + 2x\\cos x - 2\\sin x + C.$$\n\nWatch the signs: $\\int \\sin x \\, dx = -\\cos x$ introduces a minus each time a sine is integrated.",
        "两次都取 $u = x^{2}$（第二次为 $x$）。例如\n\n$$\\int x^{2}\\cos x \\, dx = x^{2}\\sin x - 2\\int x\\sin x \\, dx = x^{2}\\sin x + 2x\\cos x - 2\\sin x + C。$$\n\n注意符号：每次对正弦积分，$\\int \\sin x \\, dx = -\\cos x$ 都会带来一个负号。",
      ),
      generate(rng) {
        const a = rng.int(1, 3);
        const k = rng.nonZero(-6, 6);
        const sine = rng.bool();
        const p: QPoly = [Q.zero, Q.zero, Q.of(k)];
        const [s, c] = trigParts(p, a, sine);
        const sin = fn("\\sin", a);
        const cos = fn("\\cos", a);
        const answer = withC(times(s, sin), times(c, cos));
        const [ws, wc] = trigParts(p, a, !sine);
        return integral(
          `${poly([k, "x^{2}"])}${sine ? sin : cos}`,
          answer,
          [
            withC(times(ws, sin), times(wc, cos)),
            withC(
              times(s, sin),
              times(
                c.map((q) => q.neg()),
                cos,
              ),
            ),
            withC(times(s.slice(2), sin), times(c.slice(2), cos)),
          ],
          `Integrate by parts with $u = ${poly([k, "x^{2}"])}$, then again with $u = ${poly([2 * k, "x"])}$. Collecting terms, the integral is $${answer}$.`,
          `先取 $u = ${poly([k, "x^{2}"])}$ 分部积分，再取 $u = ${poly([2 * k, "x"])}$ 分部积分一次。整理得 $${answer}$。`,
        );
      },
    },
  ],
};

/** randomPoly chooses a polynomial of degree 2 or 3 with small integer coefficients. */
function randomPoly(rng: Rng): QPoly {
  const deg = rng.int(2, 3);
  return Array.from({ length: deg + 1 }, (_, i) => Q.of(i === deg ? rng.nonZero(-3, 3) : rng.int(-4, 4)));
}

/** theTabularMethodOfIntegrationByParts integrates polynomials times e^(ax), sin x or cos x with the tabular method. */
export const theTabularMethodOfIntegrationByParts: TopicDef = {
  id: "the-tabular-method-of-integration-by-parts",
  title: t("The Tabular Method of Integration by Parts", "分部积分的表格法"),
  summary: t(
    "Integrate a polynomial times an exponential or trigonometric function with a table of derivatives and integrals.",
    "用导数与积分表，求多项式乘指数函数或三角函数的积分。",
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
        "When $u$ is a polynomial, list its derivatives down to $0$ in one column and repeated integrals of $dv$ in another. Multiply diagonally with alternating signs $+, -, +, \\dots$ and add:\n\n$$\\int x^{3}e^{x} \\, dx = x^{3}e^{x} - 3x^{2}e^{x} + 6xe^{x} - 6e^{x} + C.$$\n\nFor $e^{ax}$ the integrals are $\\frac{1}{a}e^{ax}, \\frac{1}{a^{2}}e^{ax}, \\dots$",
        "当 $u$ 是多项式时，一列写它的各阶导数直到 $0$，另一列写 $dv$ 的逐次积分。沿对角线相乘，符号交替为 $+, -, +, \\dots$，再相加：\n\n$$\\int x^{3}e^{x} \\, dx = x^{3}e^{x} - 3x^{2}e^{x} + 6xe^{x} - 6e^{x} + C。$$\n\n对 $e^{ax}$，逐次积分为 $\\frac{1}{a}e^{ax}, \\frac{1}{a^{2}}e^{ax}, \\dots$",
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, -1]);
        const p = randomPoly(rng);
        const e = `e^{${ax(a)}}`;
        const right = exponentialParts(p, a);
        const answer = `${times(right, e)} + C`;
        return integral(
          times(p, e),
          answer,
          [
            `${times(exponentialParts(p, a, false), e)} + C`,
            `${times(exponentialParts(p.slice(0, 2), a), e)} + C`,
            `${times(qDer(p), e)} + C`,
          ],
          `Differentiate $${qLatex(p)}$ until it vanishes, integrate $${e}$ repeatedly, and add the diagonal products with alternating signs. Factoring out $${e}$, the integral is $${answer}$.`,
          `对 $${qLatex(p)}$ 逐次求导直到为零，对 $${e}$ 逐次积分，沿对角线相乘并交替取正负号后相加。提出 $${e}$，积分为 $${answer}$。`,
        );
      },
    },
    {
      id: "tabular-method-with-sine-and-cosine",
      title: t("The tabular method with sine and cosine", "表格法与正弦、余弦"),
      explanation: t(
        "With $dv = \\cos x \\, dx$ the integral column cycles $\\sin x, -\\cos x, -\\sin x, \\cos x, \\dots$. For example,\n\n$$\\int x^{3}\\cos x \\, dx = x^{3}\\sin x + 3x^{2}\\cos x - 6x\\sin x - 6\\cos x + C.$$\n\nGroup the terms by $\\sin x$ and $\\cos x$ at the end.",
        "当 $dv = \\cos x \\, dx$ 时，积分列依次为 $\\sin x, -\\cos x, -\\sin x, \\cos x, \\dots$。例如\n\n$$\\int x^{3}\\cos x \\, dx = x^{3}\\sin x + 3x^{2}\\cos x - 6x\\sin x - 6\\cos x + C。$$\n\n最后按 $\\sin x$ 与 $\\cos x$ 合并同类项。",
      ),
      generate(rng) {
        const p = randomPoly(rng);
        const sine = rng.bool();
        const [s, c] = trigParts(p, 1, sine);
        const [ws, wc] = trigParts(p, 1, !sine);
        const answer = withC(times(s, "\\sin x"), times(c, "\\cos x"));
        return integral(
          times(p, sine ? "\\sin x" : "\\cos x"),
          answer,
          [
            withC(times(ws, "\\sin x"), times(wc, "\\cos x")),
            withC(
              times(s, "\\sin x"),
              times(
                c.map((q) => q.neg()),
                "\\cos x",
              ),
            ),
            withC(times(sine ? [] : p, "\\sin x"), times(sine ? p.map((q) => q.neg()) : [], "\\cos x")),
          ],
          `Differentiate $${qLatex(p)}$ until it vanishes and integrate $${sine ? "\\sin x" : "\\cos x"}$ repeatedly; add the diagonal products with alternating signs and group by $\\sin x$ and $\\cos x$: $${answer}$.`,
          `对 $${qLatex(p)}$ 逐次求导直到为零，对 $${sine ? "\\sin x" : "\\cos x"}$ 逐次积分；沿对角线相乘并交替取正负号后相加，按 $\\sin x$ 与 $\\cos x$ 合并：$${answer}$。`,
        );
      },
    },
  ],
};

/** integrationByPartsInCyclicCases integrates e^(ax)·sin/cos(bx), sec³x, sin(ln x) and cos(ln x). */
export const integrationByPartsInCyclicCases: TopicDef = {
  id: "integration-by-parts-in-cyclic-cases",
  title: t("Integration by Parts in Cyclic Cases", "循环型分部积分"),
  summary: t("Integrate by parts until the original integral reappears, then solve for it.", "分部积分直到原积分再次出现，然后解出它。"),
  prerequisites: ["applying-the-integration-by-parts-twice", "integrating-trigonometric-functions-using-substitution"],
  encompasses: [{ topic: "applying-the-integration-by-parts-twice", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "exponential-times-sine-or-cosine",
      title: t("Exponential times sine or cosine", "指数函数乘正弦或余弦"),
      explanation: t(
        "Integrating $I = \\int e^{ax}\\sin(bx) \\, dx$ by parts twice returns $I$ itself:\n\n$$I = \\frac{1}{a}e^{ax}\\sin(bx) - \\frac{b}{a^{2}}e^{ax}\\cos(bx) - \\frac{b^{2}}{a^{2}}I.$$\n\nSolving for $I$,\n\n$$\\int e^{ax}\\sin(bx) \\, dx = \\frac{e^{ax}}{a^{2} + b^{2}}\\left(a\\sin(bx) - b\\cos(bx)\\right) + C, \\qquad \\int e^{ax}\\cos(bx) \\, dx = \\frac{e^{ax}}{a^{2} + b^{2}}\\left(a\\cos(bx) + b\\sin(bx)\\right) + C.$$",
        "对 $I = \\int e^{ax}\\sin(bx) \\, dx$ 两次分部积分后，又回到 $I$：\n\n$$I = \\frac{1}{a}e^{ax}\\sin(bx) - \\frac{b}{a^{2}}e^{ax}\\cos(bx) - \\frac{b^{2}}{a^{2}}I。$$\n\n解出 $I$：\n\n$$\\int e^{ax}\\sin(bx) \\, dx = \\frac{e^{ax}}{a^{2} + b^{2}}\\left(a\\sin(bx) - b\\cos(bx)\\right) + C, \\qquad \\int e^{ax}\\cos(bx) \\, dx = \\frac{e^{ax}}{a^{2} + b^{2}}\\left(a\\cos(bx) + b\\sin(bx)\\right) + C。$$",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, -1, -2]);
        const b = rng.int(1, 3);
        const k = rng.nonZero(-6, 6);
        const sine = rng.bool();
        const e = `e^{${ax(a)}}`;
        const [sin, cos] = [fn("\\sin", b), fn("\\cos", b)];
        const inner = (p: number, q: number) => (sine ? poly([p, sin], [q, cos]) : poly([p, cos], [q, sin]));
        const n = a * a + b * b;
        const answer = `${coef(Q.of(k, n))}${e}\\left(${inner(a, sine ? -b : b)}\\right) + C`;
        return integral(
          `${coef(Q.of(k))}${e}${sine ? sin : cos}`,
          answer,
          [
            `${coef(Q.of(k, n))}${e}\\left(${inner(a, sine ? b : -b)}\\right) + C`,
            `${coef(Q.of(k))}${e}\\left(${inner(a, sine ? -b : b)}\\right) + C`,
            `${coef(Q.of(k, a * b))}${e}${sine ? cos : sin} + C`,
          ],
          `Integrating by parts twice brings back $I = \\int ${e}${sine ? sin : cos} \\, dx$ with coefficient $-${Q.of(b * b, a * a).toLatex()}$. Solving $\\left(1 + ${Q.of(b * b, a * a).toLatex()}\\right)I = \\dots$ gives $I = \\frac{${e}}{${n}}\\left(${inner(a, sine ? -b : b)}\\right) + C$; multiplying by $${k}$ gives $${answer}$.`,
          `两次分部积分后又出现 $I = \\int ${e}${sine ? sin : cos} \\, dx$，系数为 $-${Q.of(b * b, a * a).toLatex()}$。由 $\\left(1 + ${Q.of(b * b, a * a).toLatex()}\\right)I = \\dots$ 解得 $I = \\frac{${e}}{${n}}\\left(${inner(a, sine ? -b : b)}\\right) + C$；乘以 $${k}$ 得 $${answer}$。`,
        );
      },
    },
    {
      id: "further-cyclic-integrals",
      title: t("Further cyclic integrals", "其他循环型积分"),
      explanation: t(
        "The same trick works elsewhere. For $\\int \\sec^{3} x \\, dx$ take $u = \\sec x$, $dv = \\sec^{2} x \\, dx$ and use $\\tan^{2} x = \\sec^{2} x - 1$ and $\\int \\sec x \\, dx = \\ln|\\sec x + \\tan x| + C$:\n\n$$\\int \\sec^{3} x \\, dx = \\frac{1}{2}\\left(\\sec x\\tan x + \\ln|\\sec x + \\tan x|\\right) + C.$$\n\nFor $\\int \\sin(\\ln x) \\, dx$ take $u = \\sin(\\ln x)$, $dv = dx$ twice: $\\int \\sin(\\ln x) \\, dx = \\frac{x}{2}\\left(\\sin(\\ln x) - \\cos(\\ln x)\\right) + C$, and likewise $\\int \\cos(\\ln x) \\, dx = \\frac{x}{2}\\left(\\sin(\\ln x) + \\cos(\\ln x)\\right) + C$.",
        "这一技巧在别处同样适用。对 $\\int \\sec^{3} x \\, dx$，取 $u = \\sec x$，$dv = \\sec^{2} x \\, dx$，并利用 $\\tan^{2} x = \\sec^{2} x - 1$ 和 $\\int \\sec x \\, dx = \\ln|\\sec x + \\tan x| + C$：\n\n$$\\int \\sec^{3} x \\, dx = \\frac{1}{2}\\left(\\sec x\\tan x + \\ln|\\sec x + \\tan x|\\right) + C。$$\n\n对 $\\int \\sin(\\ln x) \\, dx$，两次取 $u$ 为三角函数部分、$dv = dx$：$\\int \\sin(\\ln x) \\, dx = \\frac{x}{2}\\left(\\sin(\\ln x) - \\cos(\\ln x)\\right) + C$；同理 $\\int \\cos(\\ln x) \\, dx = \\frac{x}{2}\\left(\\sin(\\ln x) + \\cos(\\ln x)\\right) + C$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-12, 12);
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const answer = `${coef(Q.of(k, 2))}\\left(\\sec x\\tan x + \\ln|\\sec x + \\tan x|\\right) + C`;
          return integral(
            `${coef(Q.of(k))}\\sec^{3} x`,
            answer,
            [
              `${coef(Q.of(k, 2))}\\left(\\sec x\\tan x - \\ln|\\sec x + \\tan x|\\right) + C`,
              `${coef(Q.of(k))}\\left(\\sec x\\tan x + \\ln|\\sec x + \\tan x|\\right) + C`,
              `${coef(Q.of(k, 4))}\\sec^{4} x + C`,
            ],
            `With $u = \\sec x$, $dv = \\sec^{2} x \\, dx$: $I = \\sec x\\tan x - \\int \\sec x\\tan^{2} x \\, dx = \\sec x\\tan x - I + \\int \\sec x \\, dx$. So $2I = \\sec x\\tan x + \\ln|\\sec x + \\tan x|$, and the answer is $${answer}$.`,
            `取 $u = \\sec x$，$dv = \\sec^{2} x \\, dx$：$I = \\sec x\\tan x - \\int \\sec x\\tan^{2} x \\, dx = \\sec x\\tan x - I + \\int \\sec x \\, dx$。所以 $2I = \\sec x\\tan x + \\ln|\\sec x + \\tan x|$，答案为 $${answer}$。`,
          );
        }
        const sine = kind === 1;
        const answer = `${coef(Q.of(k, 2))}x\\left(\\sin(\\ln x) ${sine ? "-" : "+"} \\cos(\\ln x)\\right) + C`;
        return integral(
          `${coef(Q.of(k))}${sine ? "\\sin" : "\\cos"}(\\ln x)`,
          answer,
          [
            `${coef(Q.of(k, 2))}x\\left(\\sin(\\ln x) ${sine ? "+" : "-"} \\cos(\\ln x)\\right) + C`,
            `${coef(Q.of(sine ? -k : k))}x${sine ? "\\cos" : "\\sin"}(\\ln x) + C`,
            `${coef(Q.of(k, 2))}\\left(\\sin(\\ln x) ${sine ? "-" : "+"} \\cos(\\ln x)\\right) + C`,
          ],
          `With $u = ${sine ? "\\sin" : "\\cos"}(\\ln x)$ and $dv = dx$, then again with the other function, the original integral returns with coefficient $-1$. Solving gives $${answer}$.`,
          `取 $u = ${sine ? "\\sin" : "\\cos"}(\\ln x)$，$dv = dx$，再对另一个函数分部积分一次，原积分以系数 $-1$ 再次出现。解得 $${answer}$。`,
          { en: "$x > 0$", zh: "$x > 0$" },
        );
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
