import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, poly, Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";
import { bare, fac, oneOf, type Poly, pLatex } from "./calculus-common.ts";
import { fracTerm, withC } from "./calculus-ii-identities-parts.ts";
import { coef, exactValue, fracWith, integral } from "./calculus-ii-substitution.ts";

// Calculus II unit 1: Integration Techniques, modules 1.6–1.7.

/** pMul multiplies two integer polynomials, lowest degree first. */
export function pMul(p: Poly, r: Poly): Poly {
  const out = Array.from({ length: p.length + r.length - 1 }, () => 0);
  for (const [i, a] of p.entries()) for (const [j, b] of r.entries()) out[i + j] = (out[i + j] ?? 0) + a * b;
  return out;
}

/** pSum adds integer polynomials, lowest degree first. */
export const pSum = (...ps: readonly Poly[]): Poly =>
  Array.from({ length: Math.max(...ps.map((p) => p.length)) }, (_, i) => ps.reduce((s, p) => s + (p[i] ?? 0), 0));

/** root is the polynomial x − a. */
const root = (a: number): Poly => [-a, 1];

/** lnAbs writes ln|x − a|. */
const lnAbs = (a: number) => `\\ln|${bare(a)}|`;

/** recip writes k/(x − a)^n with the sign in front. */
const recip = (k: number, a: number, n = 1) =>
  fracTerm(Q.of(k), "", n === 1 ? bare(a) : `${fac(a)}^{${n}}`).replace("\\frac{}", "\\frac{1}");

/** distinctRoots chooses two different integers in [lo, hi], smaller first. */
function distinctRoots(rng: Rng, lo: number, hi: number): readonly [number, number] {
  const a = rng.int(lo, hi);
  let b = rng.int(lo, hi - 1);
  if (b >= a) b++;
  return a < b ? [a, b] : [b, a];
}

/** constantProblem asks for one constant of a partial-fraction decomposition. */
function constantProblem(fraction: string, form: string, letter: string, value: number, wrong: readonly number[], en: string, zh: string) {
  return numberProblem({
    prompt: t(`Write $${fraction}$ in the form $${form}$. Find $${letter}$.`, `把 $${fraction}$ 写成 $${form}$ 的形式，求 $${letter}$。`),
    answer: value,
    wrong,
    solution: t(en, zh),
    form: "integer",
  });
}

/** twoLinear writes the decomposition form A/(x − a) + B/(x − b). */
const twoLinear = (a: number, b: number) => `\\frac{A}{${bare(a)}} + \\frac{B}{${bare(b)}}`;

/** expressingRationalFunctionsAsSumsOfPartialFractions splits fractions over distinct linear factors. */
export const expressingRationalFunctionsAsSumsOfPartialFractions: TopicDef = {
  id: "expressing-rational-functions-as-sums-of-partial-fractions",
  title: t("Expressing Rational Functions as Sums of Partial Fractions", "把有理函数写成部分分式之和"),
  summary: t(
    "Split a fraction whose denominator has distinct linear factors into a sum of simpler fractions.",
    "把分母含不同一次因式的分式拆成若干简单分式之和。",
  ),
  prerequisites: ["adding-rational-expressions-with-unlike-denominators", "integrating-linear-rational-functions-using-substitution"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "partial-fractions-with-distinct-linear-factors",
      title: t("Partial fractions with distinct linear factors", "不同一次因式的部分分式"),
      explanation: t(
        "A proper fraction whose denominator is $(x - a)(x - b)$ with $a \\ne b$ can be written $\\frac{A}{x - a} + \\frac{B}{x - b}$. Multiply through by the denominator:\n\n$$N(x) = A(x - b) + B(x - a).$$\n\nSetting $x = a$ kills the $B$ term, so $A = \\frac{N(a)}{a - b}$; setting $x = b$ gives $B = \\frac{N(b)}{b - a}$. For example, $\\frac{5x - 1}{(x - 1)(x + 1)}$: at $x = 1$, $4 = 2A$, so $A = 2$; at $x = -1$, $-6 = -2B$, so $B = 3$.",
        "分母为 $(x - a)(x - b)$（$a \\ne b$）的真分式可以写成 $\\frac{A}{x - a} + \\frac{B}{x - b}$。两边同乘分母：\n\n$$N(x) = A(x - b) + B(x - a)。$$\n\n令 $x = a$，$B$ 项消失，于是 $A = \\frac{N(a)}{a - b}$；令 $x = b$ 得 $B = \\frac{N(b)}{b - a}$。例如 $\\frac{5x - 1}{(x - 1)(x + 1)}$：令 $x = 1$，$4 = 2A$，$A = 2$；令 $x = -1$，$-6 = -2B$，$B = 3$。",
      ),
      generate(rng) {
        const [a, b] = distinctRoots(rng, -5, 5);
        const A = rng.nonZero(-6, 6);
        const B = rng.nonZero(-6, 6);
        const num = linear(A + B, -(A * b + B * a));
        const fraction = `\\frac{${num}}{${fac(a)}${fac(b)}}`;
        const askA = rng.bool();
        const [value, other, at, diff] = askA ? [A, B, a, a - b] : [B, A, b, b - a];
        return constantProblem(
          fraction,
          twoLinear(a, b),
          askA ? "A" : "B",
          value,
          [other, -value, value * diff],
          `Multiply by $${fac(a)}${fac(b)}$: $${num} = A(${bare(b)}) + B(${bare(a)})$. Setting $x = ${at}$ gives $${value * diff} = ${diff}${askA ? "A" : "B"}$, so $${askA ? "A" : "B"} = ${value}$.`,
          `两边同乘 $${fac(a)}${fac(b)}$：$${num} = A(${bare(b)}) + B(${bare(a)})$。令 $x = ${at}$，得 $${value * diff} = ${diff}${askA ? "A" : "B"}$，所以 $${askA ? "A" : "B"} = ${value}$。`,
        );
      },
    },
    {
      id: "factoring-the-denominator-first",
      title: t("Factoring the denominator first", "先分解分母"),
      explanation: t(
        "When the denominator is given as a quadratic, factor it first. For $\\frac{x + 7}{x^{2} - x - 6}$, factor $x^{2} - x - 6 = (x + 2)(x - 3)$, then find the constants as before: $x + 7 = A(x - 3) + B(x + 2)$; $x = -2$ gives $A = -1$ and $x = 3$ gives $B = 2$.",
        "当分母是二次式时，先把它分解。对 $\\frac{x + 7}{x^{2} - x - 6}$，分解 $x^{2} - x - 6 = (x + 2)(x - 3)$，再照前面的方法求常数：$x + 7 = A(x - 3) + B(x + 2)$；令 $x = -2$ 得 $A = -1$，令 $x = 3$ 得 $B = 2$。",
      ),
      generate(rng) {
        const [a, b] = distinctRoots(rng, -6, 6);
        const A = rng.nonZero(-6, 6);
        const B = rng.nonZero(-6, 6);
        const num = linear(A + B, -(A * b + B * a));
        const den = pLatex(pMul(root(a), root(b)));
        const askA = rng.bool();
        const [value, other, at, diff] = askA ? [A, B, a, a - b] : [B, A, b, b - a];
        return constantProblem(
          `\\frac{${num}}{${den}}`,
          twoLinear(a, b),
          askA ? "A" : "B",
          value,
          [other, -value, value * diff],
          `Factor: $${den} = ${fac(a)}${fac(b)}$. Then $${num} = A(${bare(b)}) + B(${bare(a)})$; setting $x = ${at}$ gives $${value * diff} = ${diff}${askA ? "A" : "B"}$, so $${askA ? "A" : "B"} = ${value}$.`,
          `分解：$${den} = ${fac(a)}${fac(b)}$。于是 $${num} = A(${bare(b)}) + B(${bare(a)})$；令 $x = ${at}$，得 $${value * diff} = ${diff}${askA ? "A" : "B"}$，所以 $${askA ? "A" : "B"} = ${value}$。`,
        );
      },
    },
  ],
};

/** repeatedNumerator returns A(x − a)(x − b) + B(x − b) + C(x − a)², the numerator over (x − a)²(x − b). */
const repeatedNumerator = (a: number, b: number, A: number, B: number, C: number) =>
  pSum(pMul(pMul(root(a), root(b)), [A]), pMul(root(b), [B]), pMul(pMul(root(a), root(a)), [C]));

/** expressingRationalFunctionsWithRepeatedFactorsAsSumsOfPartialFractions handles squared linear factors. */
export const expressingRationalFunctionsWithRepeatedFactorsAsSumsOfPartialFractions: TopicDef = {
  id: "expressing-rational-functions-with-repeated-factors-as-sums-of-partial-fractions",
  title: t("Expressing Rational Functions With Repeated Factors as Sums of Partial Fractions", "含重因式的有理函数的部分分式"),
  summary: t(
    "A squared factor (x − a)² contributes two terms, A/(x − a) and B/(x − a)².",
    "平方因式 (x − a)² 对应两项：A/(x − a) 与 B/(x − a)²。",
  ),
  prerequisites: ["expressing-rational-functions-as-sums-of-partial-fractions"],
  encompasses: [{ topic: "expressing-rational-functions-as-sums-of-partial-fractions", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "a-single-repeated-factor",
      title: t("A single repeated factor", "单个重因式"),
      explanation: t(
        "A repeated factor needs one fraction for each power up to its multiplicity, because a single fraction cannot produce every possible numerator. Write $\\frac{px + q}{(x - a)^{2}} = \\frac{A}{x - a} + \\frac{B}{(x - a)^{2}}$, so $px + q = A(x - a) + B$. Setting $x = a$ gives $B$; comparing the coefficients of $x$ gives $A = p$. For example, $\\frac{3x - 4}{(x - 2)^{2}}$: $A = 3$ and $B = 3 \\cdot 2 - 4 = 2$.",
        "重复因式的每一个幂都需要一个分式，直到它的重数，因为一个分式不能产生所有可能的分子。写成 $\\frac{px + q}{(x - a)^{2}} = \\frac{A}{x - a} + \\frac{B}{(x - a)^{2}}$，则 $px + q = A(x - a) + B$。令 $x = a$ 得 $B$；比较 $x$ 的系数得 $A = p$。例如 $\\frac{3x - 4}{(x - 2)^{2}}$：$A = 3$，$B = 3 \\cdot 2 - 4 = 2$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const A = rng.nonZero(-6, 6);
        const B = rng.nonZero(-9, 9);
        const num = linear(A, B - A * a);
        const askA = rng.bool();
        const [value, other] = askA ? [A, B] : [B, A];
        return constantProblem(
          `\\frac{${num}}{${fac(a)}^{2}}`,
          `\\frac{A}{${bare(a)}} + \\frac{B}{${fac(a)}^{2}}`,
          askA ? "A" : "B",
          value,
          [other, -value, B - A * a],
          `$${num} = A(${bare(a)}) + B$. Comparing coefficients of $x$ gives $A = ${A}$; setting $x = ${a}$ gives $B = ${B}$.`,
          `$${num} = A(${bare(a)}) + B$。比较 $x$ 的系数得 $A = ${A}$；令 $x = ${a}$ 得 $B = ${B}$。`,
        );
      },
    },
    {
      id: "repeated-and-distinct-factors-together",
      title: t("Repeated and distinct factors together", "重因式与不同因式并存"),
      explanation: t(
        "Clear the denominators, then substitute the roots to find some constants quickly and compare coefficients to find the rest. For $(x - a)^{2}(x - b)$ write $\\frac{A}{x - a} + \\frac{B}{(x - a)^{2}} + \\frac{C}{x - b}$, so\n\n$$N(x) = A(x - a)(x - b) + B(x - b) + C(x - a)^{2}.$$\n\n$x = a$ gives $B$, $x = b$ gives $C$, and comparing the coefficients of $x^{2}$ gives $A + C$, hence $A$.",
        "先去分母，再代入各个根快速求出一部分常数，其余的通过比较系数求出。对 $(x - a)^{2}(x - b)$，写成 $\\frac{A}{x - a} + \\frac{B}{(x - a)^{2}} + \\frac{C}{x - b}$，则\n\n$$N(x) = A(x - a)(x - b) + B(x - b) + C(x - a)^{2}。$$\n\n令 $x = a$ 得 $B$，令 $x = b$ 得 $C$，比较 $x^{2}$ 的系数得 $A + C$，从而得 $A$。",
      ),
      generate(rng) {
        const [a, b] = rng.shuffle(distinctRoots(rng, -3, 3));
        const [A, B, C] = [rng.nonZero(-4, 4), rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
        const N = repeatedNumerator(a!, b!, A, B, C);
        const fraction = `\\frac{${pLatex(N)}}{${fac(a!)}^{2}${fac(b!)}}`;
        const letter = rng.pick(["A", "B", "C"] as const);
        const value = { A, B, C }[letter];
        return constantProblem(
          fraction,
          `\\frac{A}{${bare(a!)}} + \\frac{B}{${fac(a!)}^{2}} + \\frac{C}{${bare(b!)}}`,
          letter,
          value,
          [...[A, B, C].filter((v) => v !== value), -value, A + C],
          `$${pLatex(N)} = A${fac(a!)}${fac(b!)} + B${fac(b!)} + C${fac(a!)}^{2}$. Setting $x = ${a}$ gives $B = ${B}$; setting $x = ${b}$ gives $C = ${C}$; the $x^{2}$ coefficients give $A + C = ${A + C}$, so $A = ${A}$.`,
          `$${pLatex(N)} = A${fac(a!)}${fac(b!)} + B${fac(b!)} + C${fac(a!)}^{2}$。令 $x = ${a}$ 得 $B = ${B}$；令 $x = ${b}$ 得 $C = ${C}$；比较 $x^{2}$ 的系数得 $A + C = ${A + C}$，所以 $A = ${A}$。`,
        );
      },
    },
  ],
};

/** quadraticNumerator returns A(x² + c) + (Bx + C)(x − a), the numerator over (x − a)(x² + c). */
const quadraticNumerator = (a: number, c: number, A: number, B: number, C: number) => pSum(pMul([c, 0, 1], [A]), pMul([C, B], root(a)));

/** irreducible writes x² + c. */
const irreducible = (c: number) => poly([1, "x^{2}"], [c, ""]);

/** expressingRationalFunctionsWithIrreducibleQuadraticFactorsAsSumsOfPartialFractions handles factors x² + c. */
export const expressingRationalFunctionsWithIrreducibleQuadraticFactorsAsSumsOfPartialFractions: TopicDef = {
  id: "expressing-rational-functions-with-irreducible-quadratic-factors-as-sums-of-partial-fractions",
  title: t(
    "Expressing Rational Functions With Irreducible Quadratic Factors as Sums of Partial Fractions",
    "含不可约二次因式的有理函数的部分分式",
  ),
  summary: t(
    "An irreducible quadratic factor x² + c contributes a term (Bx + C)/(x² + c).",
    "不可约二次因式 x² + c 对应一项 (Bx + C)/(x² + c)。",
  ),
  prerequisites: ["expressing-rational-functions-as-sums-of-partial-fractions"],
  encompasses: [{ topic: "expressing-rational-functions-as-sums-of-partial-fractions", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-constant-over-the-linear-factor",
      title: t("The constant over the linear factor", "一次因式上的常数"),
      explanation: t(
        "A quadratic $x^{2} + c$ with $c > 0$ has no real roots, so it cannot be split further; its numerator must be linear. Write\n\n$$\\frac{N(x)}{(x - a)(x^{2} + c)} = \\frac{A}{x - a} + \\frac{Bx + C}{x^{2} + c}, \\qquad N(x) = A(x^{2} + c) + (Bx + C)(x - a).$$\n\nSetting $x = a$ gives $A = \\frac{N(a)}{a^{2} + c}$.",
        "$c > 0$ 时二次式 $x^{2} + c$ 没有实根，不能再分解，它上面的分子必须是一次式。写成\n\n$$\\frac{N(x)}{(x - a)(x^{2} + c)} = \\frac{A}{x - a} + \\frac{Bx + C}{x^{2} + c}, \\qquad N(x) = A(x^{2} + c) + (Bx + C)(x - a)。$$\n\n令 $x = a$ 得 $A = \\frac{N(a)}{a^{2} + c}$。",
      ),
      generate(rng) {
        const a = rng.int(-4, 4);
        const c = rng.int(1, 9);
        const [A, B, C] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        const N = quadraticNumerator(a, c, A, B, C);
        const Na = A * (a * a + c);
        return constantProblem(
          `\\frac{${pLatex(N)}}{${fac(a)}(${irreducible(c)})}`,
          `\\frac{A}{${bare(a)}} + \\frac{Bx + C}{${irreducible(c)}}`,
          "A",
          A,
          [B, C, Na, -A],
          `Setting $x = ${a}$ in $${pLatex(N)} = A(${irreducible(c)}) + (Bx + C)(${bare(a)})$ gives $${Na} = ${a * a + c}A$, so $A = ${A}$.`,
          `在 $${pLatex(N)} = A(${irreducible(c)}) + (Bx + C)(${bare(a)})$ 中令 $x = ${a}$，得 $${Na} = ${a * a + c}A$，所以 $A = ${A}$。`,
        );
      },
    },
    {
      id: "the-linear-numerator-over-the-quadratic",
      title: t("The linear numerator over the quadratic", "二次因式上的一次分子"),
      explanation: t(
        "After finding $A$, compare coefficients in $N(x) = A(x^{2} + c) + (Bx + C)(x - a)$: the $x^{2}$ terms give $A + B$, and the constant terms give $Ac - aC$. For example, $\\frac{3x^{2} + x + 4}{x(x^{2} + 2)}$: $x = 0$ gives $4 = 2A$, $A = 2$; then $A + B = 3$ gives $B = 1$, and the $x$ terms give $C = 1$.",
        "求出 $A$ 后，比较 $N(x) = A(x^{2} + c) + (Bx + C)(x - a)$ 两边的系数：$x^{2}$ 项给出 $A + B$，常数项给出 $Ac - aC$。例如 $\\frac{3x^{2} + x + 4}{x(x^{2} + 2)}$：令 $x = 0$，$4 = 2A$，$A = 2$；由 $A + B = 3$ 得 $B = 1$，由 $x$ 项得 $C = 1$。",
      ),
      generate(rng) {
        const a = rng.int(-4, 4);
        const c = rng.int(1, 9);
        const [A, B, C] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        const N = quadraticNumerator(a, c, A, B, C);
        const askB = rng.bool();
        const value = askB ? B : C;
        return constantProblem(
          `\\frac{${pLatex(N)}}{${fac(a)}(${irreducible(c)})}`,
          `\\frac{A}{${bare(a)}} + \\frac{Bx + C}{${irreducible(c)}}`,
          askB ? "B" : "C",
          value,
          [askB ? C : B, A, -value, N[2] ?? 0],
          `Setting $x = ${a}$ gives $A = ${A}$. The $x^{2}$ coefficients give $A + B = ${A + B}$, so $B = ${B}$; the $x$ coefficients give $C - ${a < 0 ? `(${a})` : a}B = ${C - a * B}$, so $C = ${C}$.`,
          `令 $x = ${a}$ 得 $A = ${A}$。比较 $x^{2}$ 的系数，$A + B = ${A + B}$，所以 $B = ${B}$；比较 $x$ 的系数，$C - ${a < 0 ? `(${a})` : a}B = ${C - a * B}$，所以 $C = ${C}$。`,
        );
      },
    },
  ],
};

/** lnRatio writes ln of a positive rational: "\ln 3", "\ln\left(\frac{5}{2}\right)". */
const lnRatio = (q: Q) => (q.isInteger() ? `\\ln ${q.toLatex()}` : `\\ln\\left(${q.toLatex()}\\right)`);

/** integratingRationalFunctionsUsingPartialFractions integrates fractions over distinct linear factors. */
export const integratingRationalFunctionsUsingPartialFractions: TopicDef = {
  id: "integrating-rational-functions-using-partial-fractions",
  title: t("Integrating Rational Functions Using Partial Fractions", "用部分分式求有理函数的积分"),
  summary: t("Split into partial fractions, then integrate each term as a logarithm.", "拆成部分分式，再把每一项积分为对数。"),
  prerequisites: ["expressing-rational-functions-as-sums-of-partial-fractions", "calculating-definite-integrals-using-substitution"],
  encompasses: [
    { topic: "expressing-rational-functions-as-sums-of-partial-fractions", weight: 0.5 },
    { topic: "integrating-linear-rational-functions-using-substitution", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "indefinite-integrals-with-distinct-linear-factors",
      title: t("Indefinite integrals with distinct linear factors", "不同一次因式的不定积分"),
      explanation: t(
        "Splitting the fraction into simpler fractions makes each term the reciprocal of a linear expression, which integrates to a logarithm. Once $\\frac{N(x)}{(x - a)(x - b)} = \\frac{A}{x - a} + \\frac{B}{x - b}$, each term integrates to a logarithm:\n\n$$\\int \\frac{5x - 1}{(x - 1)(x + 1)} \\, dx = \\int \\left(\\frac{2}{x - 1} + \\frac{3}{x + 1}\\right) dx = 2\\ln|x - 1| + 3\\ln|x + 1| + C.$$",
        "把分式拆成几个简单分式后，每一项都是一次式的倒数，它的积分是对数。一旦 $\\frac{N(x)}{(x - a)(x - b)} = \\frac{A}{x - a} + \\frac{B}{x - b}$，每一项都积分为对数：\n\n$$\\int \\frac{5x - 1}{(x - 1)(x + 1)} \\, dx = \\int \\left(\\frac{2}{x - 1} + \\frac{3}{x + 1}\\right) dx = 2\\ln|x - 1| + 3\\ln|x + 1| + C。$$",
      ),
      generate(rng) {
        const [a, b] = distinctRoots(rng, -5, 5);
        const A = rng.nonZero(-6, 6);
        const B = rng.nonZero(-6, 6);
        const num = linear(A + B, -(A * b + B * a));
        const den = rng.bool() ? `${fac(a)}${fac(b)}` : pLatex(pMul(root(a), root(b)));
        const answer = withC(poly([A, lnAbs(a)]), poly([B, lnAbs(b)]));
        return integral(
          `\\frac{${num}}{${den}}`,
          answer,
          [
            withC(poly([B, lnAbs(a)]), poly([A, lnAbs(b)])),
            withC(poly([A, lnAbs(a)]), poly([-B, lnAbs(b)])),
            withC(poly([A + B, `\\ln|${pLatex(pMul(root(a), root(b)))}|`])),
          ],
          `Partial fractions: $\\frac{${num}}{${fac(a)}${fac(b)}} = ${withC(recip(A, a), recip(B, b)).replace(" + C", "")}$. Integrating each term gives $${answer}$.`,
          `部分分式：$\\frac{${num}}{${fac(a)}${fac(b)}} = ${withC(recip(A, a), recip(B, b)).replace(" + C", "")}$。逐项积分得 $${answer}$。`,
        );
      },
    },
    {
      id: "definite-integrals-with-partial-fractions",
      title: t("Definite integrals with partial fractions", "用部分分式计算定积分"),
      explanation: t(
        "Evaluate the logarithms at both limits and combine with $\\ln p - \\ln q = \\ln \\frac{p}{q}$. The interval must avoid the zeros of the denominator. For example,\n\n$$\\int_{0}^{1} \\frac{1}{(x + 1)(x + 2)} \\, dx = \\left[\\ln|x + 1| - \\ln|x + 2|\\right]_{0}^{1} = \\ln 2 - \\ln\\frac{3}{2} = \\ln\\frac{4}{3}.$$",
        "在上下限处计算对数，并用 $\\ln p - \\ln q = \\ln \\frac{p}{q}$ 合并。积分区间必须避开分母的零点。例如\n\n$$\\int_{0}^{1} \\frac{1}{(x + 1)(x + 2)} \\, dx = \\left[\\ln|x + 1| - \\ln|x + 2|\\right]_{0}^{1} = \\ln 2 - \\ln\\frac{3}{2} = \\ln\\frac{4}{3}。$$",
      ),
      generate(rng) {
        const [a, b] = distinctRoots(rng, -5, -1);
        const A = rng.nonZero(-4, 4);
        const B = rng.nonZero(-4, 4);
        const x1 = rng.int(1, 4);
        const num = linear(A + B, -(A * b + B * a));
        const [ra, rb] = [Q.of(x1 - a, -a), Q.of(x1 - b, -b)];
        const answer = poly([A, lnRatio(ra)], [B, lnRatio(rb)]);
        return exactValue(
          `\\int_{0}^{${x1}} \\frac{${num}}{${fac(a)}${fac(b)}} \\, dx`,
          answer,
          [
            poly([B, lnRatio(ra)], [A, lnRatio(rb)]),
            poly([A, lnRatio(ra)], [-B, lnRatio(rb)]),
            poly([A, `\\ln ${x1 - a}`], [B, `\\ln ${x1 - b}`]),
          ],
          `Partial fractions give $${withC(poly([A, lnAbs(a)]), poly([B, lnAbs(b)])).replace(" + C", "")}$ as an antiderivative. Evaluating from $0$ to $${x1}$: $${answer}$.`,
          `由部分分式得原函数 $${withC(poly([A, lnAbs(a)]), poly([B, lnAbs(b)])).replace(" + C", "")}$。从 $0$ 到 $${x1}$ 计算：$${answer}$。`,
        );
      },
    },
  ],
};

/** integratingRationalFunctionsWithRepeatedFactors integrates fractions with squared linear factors. */
export const integratingRationalFunctionsWithRepeatedFactors: TopicDef = {
  id: "integrating-rational-functions-with-repeated-factors",
  title: t("Integrating Rational Functions With Repeated Factors", "含重因式的有理函数的积分"),
  summary: t("A term B/(x − a)² integrates to −B/(x − a), not to a logarithm.", "B/(x − a)² 一项积分为 −B/(x − a)，而不是对数。"),
  prerequisites: [
    "integrating-rational-functions-using-partial-fractions",
    "expressing-rational-functions-with-repeated-factors-as-sums-of-partial-fractions",
  ],
  encompasses: [
    { topic: "integrating-rational-functions-using-partial-fractions", weight: 0.4 },
    { topic: "expressing-rational-functions-with-repeated-factors-as-sums-of-partial-fractions", weight: 0.4 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-over-a-squared-linear-factor",
      title: t("Integrating over a squared linear factor", "分母为一次因式平方的积分"),
      explanation: t(
        "A squared linear factor in the denominator integrates by the power rule, not to a logarithm, giving a reciprocal of the linear expression. By the power rule, $\\int \\frac{B}{(x - a)^{2}} \\, dx = -\\frac{B}{x - a} + C$. So\n\n$$\\int \\frac{3x - 4}{(x - 2)^{2}} \\, dx = \\int \\left(\\frac{3}{x - 2} + \\frac{2}{(x - 2)^{2}}\\right) dx = 3\\ln|x - 2| - \\frac{2}{x - 2} + C.$$",
        "分母中的一次式平方要用幂法则积分，而不是得到对数，结果是一次式的倒数。由幂函数积分法则，$\\int \\frac{B}{(x - a)^{2}} \\, dx = -\\frac{B}{x - a} + C$。所以\n\n$$\\int \\frac{3x - 4}{(x - 2)^{2}} \\, dx = \\int \\left(\\frac{3}{x - 2} + \\frac{2}{(x - 2)^{2}}\\right) dx = 3\\ln|x - 2| - \\frac{2}{x - 2} + C。$$",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const A = rng.nonZero(-6, 6);
        const B = rng.nonZero(-9, 9);
        const num = linear(A, B - A * a);
        const answer = withC(poly([A, lnAbs(a)]), recip(-B, a));
        return integral(
          `\\frac{${num}}{${fac(a)}^{2}}`,
          answer,
          [
            withC(poly([A, lnAbs(a)]), recip(B, a)),
            withC(poly([A, lnAbs(a)]), poly([B, `\\ln|${bare(a)}|`])),
            withC(poly([B, lnAbs(a)]), recip(-A, a)),
          ],
          `$\\frac{${num}}{${fac(a)}^{2}} = ${withC(recip(A, a), recip(B, a, 2)).replace(" + C", "")}$. The first term gives a logarithm and the second $${recip(-B, a)}$: $${answer}$.`,
          `$\\frac{${num}}{${fac(a)}^{2}} = ${withC(recip(A, a), recip(B, a, 2)).replace(" + C", "")}$。第一项积分为对数，第二项积分为 $${recip(-B, a)}$：$${answer}$。`,
        );
      },
    },
    {
      id: "integrating-with-repeated-and-distinct-factors",
      title: t("Integrating with repeated and distinct factors", "重因式与不同因式并存时的积分"),
      explanation: t(
        "Find $A$, $B$ and $C$ in $\\frac{A}{x - a} + \\frac{B}{(x - a)^{2}} + \\frac{C}{x - b}$, then integrate:\n\n$$A\\ln|x - a| - \\frac{B}{x - a} + C\\ln|x - b| + K.$$\n\n(Here $K$ is the constant of integration, since $C$ is already in use.)",
        "求出 $\\frac{A}{x - a} + \\frac{B}{(x - a)^{2}} + \\frac{C}{x - b}$ 中的 $A$、$B$、$C$，再积分：\n\n$$A\\ln|x - a| - \\frac{B}{x - a} + C\\ln|x - b| + K。$$\n\n（这里积分常数记作 $K$，因为 $C$ 已被占用。）",
      ),
      generate(rng) {
        const [a, b] = rng.shuffle(distinctRoots(rng, -3, 3));
        const [A, B, C] = [rng.nonZero(-4, 4), rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
        const N = repeatedNumerator(a!, b!, A, B, C);
        const answer = withC(poly([A, lnAbs(a!)]), recip(-B, a!), poly([C, lnAbs(b!)]));
        return integral(
          `\\frac{${pLatex(N)}}{${fac(a!)}^{2}${fac(b!)}}`,
          answer,
          [
            withC(poly([A, lnAbs(a!)]), recip(B, a!), poly([C, lnAbs(b!)])),
            withC(poly([A + B, lnAbs(a!)]), poly([C, lnAbs(b!)])),
            withC(poly([C, lnAbs(a!)]), recip(-B, a!), poly([A, lnAbs(b!)])),
          ],
          `Partial fractions: $A = ${A}$, $B = ${B}$, $C = ${C}$ (set $x = ${a}$, $x = ${b}$, then compare $x^{2}$ coefficients). Integrating term by term gives $${answer}$.`,
          `部分分式：$A = ${A}$，$B = ${B}$，$C = ${C}$（分别令 $x = ${a}$、$x = ${b}$，再比较 $x^{2}$ 的系数）。逐项积分得 $${answer}$。`,
        );
      },
    },
  ],
};

/** arctanTerm writes k·arctan(x/m). */
const arctanTerm = (k: Q, m: number) => poly([k, m === 1 ? "\\arctan x" : `\\arctan\\left(\\frac{x}{${m}}\\right)`]);

/** integratingRationalFunctionsWithIrreducibleQuadraticFactors integrates fractions over (x − a)(x² + m²). */
export const integratingRationalFunctionsWithIrreducibleQuadraticFactors: TopicDef = {
  id: "integrating-rational-functions-with-irreducible-quadratic-factors",
  title: t("Integrating Rational Functions With Irreducible Quadratic Factors", "含不可约二次因式的有理函数的积分"),
  summary: t("Integrate (Bx + C)/(x² + m²) as a logarithm plus an arctangent.", "把 (Bx + C)/(x² + m²) 积分为对数与反正切之和。"),
  prerequisites: [
    "integrating-rational-functions-using-partial-fractions",
    "expressing-rational-functions-with-irreducible-quadratic-factors-as-sums-of-partial-fractions",
    "integration-by-substitution-with-inverse-trigonometric-functions",
  ],
  encompasses: [
    { topic: "integrating-rational-functions-using-partial-fractions", weight: 0.3 },
    { topic: "expressing-rational-functions-with-irreducible-quadratic-factors-as-sums-of-partial-fractions", weight: 0.4 },
    { topic: "integration-by-substitution-with-inverse-trigonometric-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-over-x-times-a-quadratic",
      title: t("Integrating over x times a quadratic", "分母为 x 乘二次式的积分"),
      explanation: t(
        "A quadratic factor with no real roots gets a linear numerator, which splits into a logarithm part and an arctangent part. Split the quadratic term in two:\n\n$$\\int \\frac{Bx + C}{x^{2} + m^{2}} \\, dx = \\frac{B}{2}\\ln(x^{2} + m^{2}) + \\frac{C}{m}\\arctan\\frac{x}{m} + K.$$\n\nFor example, $\\frac{3x^{2} + x + 4}{x(x^{2} + 4)} = \\frac{1}{x} + \\frac{2x + 1}{x^{2} + 4}$ integrates to $\\ln|x| + \\ln(x^{2} + 4) + \\frac{1}{2}\\arctan\\frac{x}{2} + K$.",
        "没有实根的二次因式对应一个一次分子，它可以拆成对数部分和反正切部分。把二次因式那一项拆成两部分：\n\n$$\\int \\frac{Bx + C}{x^{2} + m^{2}} \\, dx = \\frac{B}{2}\\ln(x^{2} + m^{2}) + \\frac{C}{m}\\arctan\\frac{x}{m} + K。$$\n\n例如 $\\frac{3x^{2} + x + 4}{x(x^{2} + 4)} = \\frac{1}{x} + \\frac{2x + 1}{x^{2} + 4}$，积分为 $\\ln|x| + \\ln(x^{2} + 4) + \\frac{1}{2}\\arctan\\frac{x}{2} + K$。",
      ),
      generate(rng) {
        return irreducibleIntegral(rng, 0);
      },
    },
    {
      id: "integrating-over-a-linear-factor-times-a-quadratic",
      title: t("Integrating over a linear factor times a quadratic", "分母为一次因式乘二次式的积分"),
      explanation: t(
        "The same steps work for $(x - a)(x^{2} + m^{2})$: find $A$ by setting $x = a$, find $B$ and $C$ by comparing coefficients, then integrate to $A\\ln|x - a| + \\frac{B}{2}\\ln(x^{2} + m^{2}) + \\frac{C}{m}\\arctan\\frac{x}{m} + K$.",
        "对 $(x - a)(x^{2} + m^{2})$ 步骤相同：令 $x = a$ 求 $A$，比较系数求 $B$ 和 $C$，再积分得 $A\\ln|x - a| + \\frac{B}{2}\\ln(x^{2} + m^{2}) + \\frac{C}{m}\\arctan\\frac{x}{m} + K$。",
      ),
      generate(rng) {
        return irreducibleIntegral(rng, rng.nonZero(-3, 3));
      },
    },
  ],
};

/** irreducibleIntegral builds ∫N/((x − a)(x² + m²)) dx. */
function irreducibleIntegral(rng: Rng, a: number) {
  const m = rng.int(1, 3);
  const c = m * m;
  const [A, B, C] = [rng.nonZero(-4, 4), rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
  const N = quadraticNumerator(a, c, A, B, C);
  const lnQ = `\\ln(${irreducible(c)})`;
  const answer = withC(poly([A, lnAbs(a)]), poly([Q.of(B, 2), lnQ]), arctanTerm(Q.of(C, m), m));
  return integral(
    `\\frac{${pLatex(N)}}{${fac(a)}(${irreducible(c)})}`,
    answer,
    [
      withC(poly([A, lnAbs(a)]), poly([B, lnQ]), arctanTerm(Q.of(C, m), m)),
      withC(poly([A, lnAbs(a)]), poly([Q.of(B, 2), lnQ]), arctanTerm(Q.of(C), m)),
      withC(poly([A, lnAbs(a)]), poly([Q.of(C, 2), lnQ]), arctanTerm(Q.of(B, m), m)),
    ],
    `Partial fractions: $${recip(A, a)} + \\frac{${linear(B, C)}}{${irreducible(c)}}$. Then $\\int \\frac{${linear(B, 0)}}{${irreducible(c)}} \\, dx = ${poly([Q.of(B, 2), lnQ])}$ and $\\int \\frac{${C}}{${irreducible(c)}} \\, dx = ${arctanTerm(Q.of(C, m), m)}$, so the integral is $${answer}$.`,
    `部分分式：$${recip(A, a)} + \\frac{${linear(B, C)}}{${irreducible(c)}}$。而 $\\int \\frac{${linear(B, 0)}}{${irreducible(c)}} \\, dx = ${poly([Q.of(B, 2), lnQ])}$，$\\int \\frac{${C}}{${irreducible(c)}} \\, dx = ${arctanTerm(Q.of(C, m), m)}$，所以积分为 $${answer}$。`,
  );
}

/** converges writes the choice "Converges to v". */
const converges = (v: string): Text => t(`Converges to $${v}$`, `收敛于 $${v}$`);

/** diverges is the choice "Diverges". */
const diverges = t("Diverges", "发散");

/** convergenceProblem asks whether an improper integral converges and to what. */
function convergenceProblem(rng: Rng, integralLatex: string, right: Text, wrong: readonly Text[], en: string, zh: string) {
  return oneOf(
    rng,
    t(`Does $${integralLatex}$ converge? If so, to what value?`, `$${integralLatex}$ 是否收敛？若收敛，收敛于何值？`),
    right,
    wrong,
    t(en, zh),
  );
}

/** xPower writes x^p for a positive rational p as it would appear in a denominator. */
const xPower = (p: Q) => (p.eq(Q.of(1, 2)) ? "\\sqrt{x}" : p.eq(Q.one) ? "x" : `x^{${expLatex(p)}}`);

/** expLatex writes a positive rational exponent: "2", "3/2". */
const expLatex = (q: Q) => (q.isInteger() ? q.toLatex() : `${q.n}/${q.d}`);

/** pChoices are the exponents used in p-test questions. */
const pChoices = [Q.of(1, 2), Q.of(1, 3), Q.one, Q.of(3, 2), Q.of(2), Q.of(3), Q.of(4, 3), Q.of(2, 3), Q.of(5, 2)];

/** improperIntegrals evaluates ∫ from a to ∞ of k/x^p. */
export const improperIntegrals: TopicDef = {
  id: "improper-integrals",
  title: t("Improper Integrals", "反常积分"),
  summary: t(
    "Define an integral over an infinite interval as a limit, and decide whether it converges.",
    "把无穷区间上的积分定义为极限，并判断它是否收敛。",
  ),
  prerequisites: ["the-fundamental-theorem-of-calculus"],
  encompasses: [
    { topic: "the-fundamental-theorem-of-calculus", weight: 0.3 },
    { topic: "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-integrals-over-infinite-intervals",
      title: t("Evaluating integrals over infinite intervals", "计算无穷区间上的积分"),
      explanation: t(
        "An integral with an infinite limit is defined as a limit:\n\n$$\\int_{a}^{\\infty} f(x) \\, dx = \\lim_{t \\to \\infty} \\int_{a}^{t} f(x) \\, dx.$$\n\nIt converges if the limit exists. For example, $\\int_{1}^{\\infty} \\frac{1}{x^{2}} \\, dx = \\lim_{t \\to \\infty}\\left(1 - \\frac{1}{t}\\right) = 1$.",
        "积分限为无穷时，积分定义为极限：\n\n$$\\int_{a}^{\\infty} f(x) \\, dx = \\lim_{t \\to \\infty} \\int_{a}^{t} f(x) \\, dx。$$\n\n极限存在时称积分收敛。例如 $\\int_{1}^{\\infty} \\frac{1}{x^{2}} \\, dx = \\lim_{t \\to \\infty}\\left(1 - \\frac{1}{t}\\right) = 1$。",
      ),
      generate(rng) {
        const p = rng.int(2, 4);
        const a = rng.int(1, 3);
        const k = rng.nonZero(-9, 9);
        const value = Q.of(k, (p - 1) * a ** (p - 1));
        return exactValue(
          `\\int_{${a}}^{\\infty} ${fracWith(k, "", `x^{${p}}`).replace("\\frac{}", "\\frac{1}")} \\, dx`,
          value.toLatex(),
          [Q.of(k, p - 1).toLatex(), value.neg().toLatex(), Q.of(k, p * a ** p).toLatex()],
          `An antiderivative is $${fracTerm(Q.of(-k, p - 1), "", `x^{${p - 1}}`)
            .replace("\\frac{}", "\\frac{1}")
            .replace(
              "{x^{1}}",
              "{x}",
            )}$, which tends to $0$ as $x \\to \\infty$. So the integral is $0 - \\left(${fracTerm(Q.of(-k, p - 1), "", p === 2 ? String(a) : `${a}^{${p - 1}}`).replace("\\frac{}", "\\frac{1}")}\\right) = ${value.toLatex()}$.`,
          `原函数为 $${fracTerm(Q.of(-k, p - 1), "", `x^{${p - 1}}`)
            .replace("\\frac{}", "\\frac{1}")
            .replace(
              "{x^{1}}",
              "{x}",
            )}$，当 $x \\to \\infty$ 时趋于 $0$。所以积分为 $0 - \\left(${fracTerm(Q.of(-k, p - 1), "", p === 2 ? String(a) : `${a}^{${p - 1}}`).replace("\\frac{}", "\\frac{1}")}\\right) = ${value.toLatex()}$。`,
        );
      },
    },
    {
      id: "the-p-test-for-integrals-over-infinite-intervals",
      title: t("The p-test for integrals over infinite intervals", "无穷区间积分的 p 判别法"),
      explanation: t(
        "$\\int_{1}^{\\infty} \\frac{1}{x^{p}} \\, dx$ converges to $\\frac{1}{p - 1}$ when $p > 1$ and diverges when $p \\le 1$. For $p < 1$ the antiderivative $\\frac{x^{1 - p}}{1 - p}$ grows without bound, and for $p = 1$ the antiderivative $\\ln x$ does too.",
        "当 $p > 1$ 时 $\\int_{1}^{\\infty} \\frac{1}{x^{p}} \\, dx$ 收敛于 $\\frac{1}{p - 1}$；当 $p \\le 1$ 时发散。$p < 1$ 时原函数 $\\frac{x^{1 - p}}{1 - p}$ 无界增长，$p = 1$ 时原函数 $\\ln x$ 也无界增长。",
      ),
      generate(rng) {
        const p = rng.pick(pChoices);
        const k = rng.nonZero(-9, 9);
        const integralLatex = `\\int_{1}^{\\infty} ${fracWith(k, "", xPower(p)).replace("\\frac{}", "\\frac{1}")} \\, dx`;
        if (p.cmp(Q.one) > 0) {
          const v = Q.of(k).div(p.sub(Q.one));
          return convergenceProblem(
            rng,
            integralLatex,
            converges(v.toLatex()),
            [diverges, converges(v.neg().toLatex()), converges(Q.of(k).div(p).toLatex())],
            `Here $p = ${p.toLatex()} > 1$, so the integral converges to $\\frac{${k}}{p - 1} = ${v.toLatex()}$.`,
            `这里 $p = ${p.toLatex()} > 1$，所以积分收敛于 $\\frac{${k}}{p - 1} = ${v.toLatex()}$。`,
          );
        }
        const naive = p.eq(Q.one) ? Q.zero : Q.of(k).div(Q.one.sub(p));
        return convergenceProblem(
          rng,
          integralLatex,
          diverges,
          p.eq(Q.one)
            ? [converges("0"), converges(String(k)), converges(String(-k))]
            : [converges(naive.toLatex()), converges(naive.neg().toLatex()), converges(String(k))],
          `Here $p = ${p.toLatex()} \\le 1$: the antiderivative ${p.eq(Q.one) ? "$\\ln x$" : `$${coef(Q.of(k).div(Q.one.sub(p)))}x^{${expLatex(Q.one.sub(p))}}$`} grows without bound, so the integral diverges.`,
          `这里 $p = ${p.toLatex()} \\le 1$：原函数${p.eq(Q.one) ? " $\\ln x$ " : ` $${coef(Q.of(k).div(Q.one.sub(p)))}x^{${expLatex(Q.one.sub(p))}}$ `}无界，所以积分发散。`,
        );
      },
    },
  ],
};

/** improperIntegralsInvolvingExponentialFunctions evaluates improper integrals of e^(−ax) and x^n e^(−ax). */
export const improperIntegralsInvolvingExponentialFunctions: TopicDef = {
  id: "improper-integrals-involving-exponential-functions",
  title: t("Improper Integrals Involving Exponential Functions", "含指数函数的反常积分"),
  summary: t(
    "Use $e^{-ax} \\to 0$ as $x \\to \\infty$ (for $a > 0$) to evaluate improper integrals of exponentials.",
    "利用 $x \\to \\infty$ 时 $e^{-ax} \\to 0$（$a > 0$）计算指数函数的反常积分。",
  ),
  prerequisites: [
    "improper-integrals",
    "applying-the-integration-by-parts-twice",
    "evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions",
  ],
  encompasses: [
    { topic: "improper-integrals", weight: 0.5 },
    { topic: "integrating-exponential-functions-using-linear-substitution", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "improper-integrals-of-exponentials",
      title: t("Improper integrals of exponentials", "指数函数的反常积分"),
      explanation: t(
        "An integral to infinity is the limit of integrals over longer and longer intervals, and a decaying exponential makes that limit finite. For $a > 0$, $e^{-at} \\to 0$ as $t \\to \\infty$, so\n\n$$\\int_{b}^{\\infty} e^{-ax} \\, dx = \\lim_{t \\to \\infty}\\left[-\\frac{1}{a}e^{-ax}\\right]_{b}^{t} = \\frac{1}{a}e^{-ab}.$$\n\nLikewise $\\int_{-\\infty}^{b} e^{ax} \\, dx = \\frac{1}{a}e^{ab}$.",
        "积到无穷的积分是区间越来越长时积分的极限，衰减的指数式使这个极限是有限的。当 $a > 0$ 时，$t \\to \\infty$ 时 $e^{-at} \\to 0$，所以\n\n$$\\int_{b}^{\\infty} e^{-ax} \\, dx = \\lim_{t \\to \\infty}\\left[-\\frac{1}{a}e^{-ax}\\right]_{b}^{t} = \\frac{1}{a}e^{-ab}。$$\n\n同理 $\\int_{-\\infty}^{b} e^{ax} \\, dx = \\frac{1}{a}e^{ab}$。",
      ),
      generate(rng) {
        const a = rng.int(1, 4);
        const b = rng.int(0, 3);
        const k = rng.nonZero(-9, 9);
        const right = rng.bool();
        const e = (n: number) => (n === 0 ? "" : `e^{${n}}`);
        const exp = -a * b;
        const value = b === 0 ? Q.of(k, a).toLatex() : `${coef(Q.of(k, a))}${e(exp)}`;
        const limits = right
          ? `\\int_{${b}}^{\\infty} ${coef(Q.of(k))}e^{-${a === 1 ? "" : a}x}`
          : `\\int_{-\\infty}^{${-b}} ${coef(Q.of(k))}e^{${a === 1 ? "" : a}x}`;
        return exactValue(
          `${limits} \\, dx`,
          value,
          [
            b === 0 ? String(k) : `${coef(Q.of(k))}${e(exp)}`,
            b === 0 ? Q.of(-k, a).toLatex() : `${coef(Q.of(-k, a))}${e(exp)}`,
            b === 0 ? Q.of(k * a).toLatex() : `${coef(Q.of(k, a))}${e(-exp)}`,
          ],
          `An antiderivative is $${coef(Q.of(right ? -k : k, a))}e^{${right ? "-" : ""}${a === 1 ? "" : a}x}$, which tends to $0$ at ${right ? "$\\infty$" : "$-\\infty$"}. Evaluating at $x = ${right ? b : -b}$ gives $${value}$.`,
          `原函数为 $${coef(Q.of(right ? -k : k, a))}e^{${right ? "-" : ""}${a === 1 ? "" : a}x}$，在 ${right ? "$\\infty$" : "$-\\infty$"} 处趋于 $0$。代入 $x = ${right ? b : -b}$ 得 $${value}$。`,
        );
      },
    },
    {
      id: "improper-integrals-of-powers-times-exponentials",
      title: t("Improper integrals of powers times exponentials", "幂函数乘指数函数的反常积分"),
      explanation: t(
        "Integrate by parts, then use the fact that $e^{-ax}$ beats any power: $x^{n}e^{-ax} \\to 0$ as $x \\to \\infty$. For example,\n\n$$\\int_{0}^{\\infty} xe^{-2x} \\, dx = \\left[-\\frac{x}{2}e^{-2x}\\right]_{0}^{\\infty} + \\frac{1}{2}\\int_{0}^{\\infty} e^{-2x} \\, dx = 0 + \\frac{1}{4}.$$\n\nIn general $\\int_{0}^{\\infty} x^{n}e^{-ax} \\, dx = \\frac{n!}{a^{n + 1}}$.",
        "先分部积分，再利用 $e^{-ax}$ 比任何幂都衰减得快：$x \\to \\infty$ 时 $x^{n}e^{-ax} \\to 0$。例如\n\n$$\\int_{0}^{\\infty} xe^{-2x} \\, dx = \\left[-\\frac{x}{2}e^{-2x}\\right]_{0}^{\\infty} + \\frac{1}{2}\\int_{0}^{\\infty} e^{-2x} \\, dx = 0 + \\frac{1}{4}。$$\n\n一般地，$\\int_{0}^{\\infty} x^{n}e^{-ax} \\, dx = \\frac{n!}{a^{n + 1}}$。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const n = rng.int(1, 2);
        const k = rng.nonZero(-6, 6);
        const fact = n === 1 ? 1 : 2;
        const value = Q.of(k * fact, a ** (n + 1));
        return exactValue(
          `\\int_{0}^{\\infty} ${poly([k, n === 1 ? "x" : "x^{2}"])}e^{-${a === 1 ? "" : a}x} \\, dx`,
          value.toLatex(),
          [Q.of(k, a ** (n + 1)).toLatex(), Q.of(k * fact, a ** n).toLatex(), value.neg().toLatex()],
          `Integrating by parts ${n === 1 ? "once" : "twice"}, every boundary term vanishes because $x^{n}e^{-${a === 1 ? "" : a}x} \\to 0$. The result is $${k} \\cdot \\frac{${n}!}{${a}^{${n + 1}}} = ${value.toLatex()}$.`,
          `分部积分${n === 1 ? "一" : "两"}次，由于 $x^{n}e^{-${a === 1 ? "" : a}x} \\to 0$，边界项都为零。结果为 $${k} \\cdot \\frac{${n}!}{${a}^{${n + 1}}} = ${value.toLatex()}$。`,
        );
      },
    },
  ],
};

/** piTimes writes q·π. */
const piTimes = (q: Q) => (q.isZero() ? "0" : `${coef(q)}\\pi`);

/** overSquare writes k/(x² + m²). */
const overSquare = (k: number, m: number) => fracWith(k, "", irreducible(m * m)).replace("\\frac{}", "\\frac{1}");

/** improperIntegralsInvolvingArctangent evaluates improper integrals of k/(x² + m²). */
export const improperIntegralsInvolvingArctangent: TopicDef = {
  id: "improper-integrals-involving-arctangent",
  title: t("Improper Integrals Involving Arctangent", "含反正切的反常积分"),
  summary: t(
    "Use arctan x → π/2 as x → ∞ to evaluate improper integrals of 1/(x² + m²).",
    "利用 x → ∞ 时 arctan x → π/2 计算 1/(x² + m²) 的反常积分。",
  ),
  prerequisites: ["improper-integrals", "integration-by-substitution-with-inverse-trigonometric-functions"],
  encompasses: [
    { topic: "improper-integrals", weight: 0.5 },
    { topic: "integration-by-substitution-with-inverse-trigonometric-functions", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "improper-integrals-from-zero",
      title: t("Improper integrals from zero", "从零开始的反常积分"),
      explanation: t(
        "The arctangent levels off at a quarter turn as its input grows, so the area under this curve stays finite even over an infinite interval. Since $\\int \\frac{1}{x^{2} + m^{2}} \\, dx = \\frac{1}{m}\\arctan\\frac{x}{m}$ and $\\arctan t \\to \\frac{\\pi}{2}$ as $t \\to \\infty$,\n\n$$\\int_{0}^{\\infty} \\frac{1}{x^{2} + m^{2}} \\, dx = \\frac{1}{m}\\left(\\frac{\\pi}{2} - 0\\right) = \\frac{\\pi}{2m}.$$",
        "反正切在自变量增大时趋于 π/2，所以即使在无穷区间上，这条曲线下的面积也是有限的。由于 $\\int \\frac{1}{x^{2} + m^{2}} \\, dx = \\frac{1}{m}\\arctan\\frac{x}{m}$，且 $t \\to \\infty$ 时 $\\arctan t \\to \\frac{\\pi}{2}$，\n\n$$\\int_{0}^{\\infty} \\frac{1}{x^{2} + m^{2}} \\, dx = \\frac{1}{m}\\left(\\frac{\\pi}{2} - 0\\right) = \\frac{\\pi}{2m}。$$",
      ),
      generate(rng) {
        const m = rng.int(1, 6);
        const k = rng.nonZero(-9, 9);
        const right = rng.bool();
        const value = Q.of(k, 2 * m);
        return exactValue(
          `\\int_{${right ? "0" : "-\\infty"}}^{${right ? "\\infty" : "0"}} ${overSquare(k, m)} \\, dx`,
          piTimes(value),
          [piTimes(Q.of(k, m)), piTimes(Q.of(k, 2)), piTimes(Q.of(k, 4 * m))],
          `An antiderivative is $${arctanTerm(Q.of(k, m), m)}$. As $x \\to ${right ? "" : "-"}\\infty$, $\\arctan$ tends to $${right ? "" : "-"}\\frac{\\pi}{2}$, and it is $0$ at $x = 0$. So the integral is $${piTimes(value)}$.`,
          `原函数为 $${arctanTerm(Q.of(k, m), m)}$。当 $x \\to ${right ? "" : "-"}\\infty$ 时，$\\arctan$ 趋于 $${right ? "" : "-"}\\frac{\\pi}{2}$，在 $x = 0$ 处为 $0$。所以积分为 $${piTimes(value)}$。`,
        );
      },
    },
    {
      id: "improper-integrals-from-other-limits",
      title: t("Improper integrals from other limits", "从其他下限开始的反常积分"),
      explanation: t(
        "Evaluate the antiderivative at the finite limit as usual, and use the limiting value of the arctangent for the infinite one. Evaluate the arctangent at the finite limit. For example,\n\n$$\\int_{2}^{\\infty} \\frac{1}{x^{2} + 4} \\, dx = \\frac{1}{2}\\left(\\frac{\\pi}{2} - \\arctan 1\\right) = \\frac{1}{2}\\left(\\frac{\\pi}{2} - \\frac{\\pi}{4}\\right) = \\frac{\\pi}{8}.$$",
        "像平常一样在有限的那个限处计算原函数，无穷那一端则用反正切的极限值。在有限的积分限处计算反正切。例如\n\n$$\\int_{2}^{\\infty} \\frac{1}{x^{2} + 4} \\, dx = \\frac{1}{2}\\left(\\frac{\\pi}{2} - \\arctan 1\\right) = \\frac{1}{2}\\left(\\frac{\\pi}{2} - \\frac{\\pi}{4}\\right) = \\frac{\\pi}{8}。$$",
      ),
      generate(rng) {
        const m = rng.int(1, 5);
        const k = rng.nonZero(-9, 9);
        const s = rng.pick([1, -1]);
        const right = rng.bool();
        // ∫_{sm}^{∞} = (k/m)(π/2 − sπ/4); ∫_{−∞}^{sm} = (k/m)(sπ/4 + π/2).
        const value = Q.of(k, m).mul(right ? Q.of(2 - s, 4) : Q.of(2 + s, 4));
        const limit = String(s * m);
        return exactValue(
          `\\int_{${right ? limit : "-\\infty"}}^{${right ? "\\infty" : limit}} ${overSquare(k, m)} \\, dx`,
          piTimes(value),
          [piTimes(Q.of(k, m).mul(right ? Q.of(2 + s, 4) : Q.of(2 - s, 4))), piTimes(Q.of(k, 2 * m)), piTimes(value.mul(Q.of(m)))],
          `An antiderivative is $${arctanTerm(Q.of(k, m), m)}$, and $\\arctan(${s}) = ${s < 0 ? "-" : ""}\\frac{\\pi}{4}$. So the integral is $${coef(Q.of(k, m)) || "1"}\\left(${right ? `\\frac{\\pi}{2} ${s < 0 ? "+" : "-"} \\frac{\\pi}{4}` : `${s < 0 ? "-" : ""}\\frac{\\pi}{4} + \\frac{\\pi}{2}`}\\right) = ${piTimes(value)}$.`
            .replace("$1\\left", "$\\left")
            .replace("$-\\left", "$-\\left"),
          `原函数为 $${arctanTerm(Q.of(k, m), m)}$，且 $\\arctan(${s}) = ${s < 0 ? "-" : ""}\\frac{\\pi}{4}$。所以积分为 $${coef(Q.of(k, m)) || "1"}\\left(${right ? `\\frac{\\pi}{2} ${s < 0 ? "+" : "-"} \\frac{\\pi}{4}` : `${s < 0 ? "-" : ""}\\frac{\\pi}{4} + \\frac{\\pi}{2}`}\\right) = ${piTimes(value)}$。`.replace(
            "$1\\left",
            "$\\left",
          ),
        );
      },
    },
  ],
};

/** improperIntegralsOverTheRealLine evaluates integrals from −∞ to ∞. */
export const improperIntegralsOverTheRealLine: TopicDef = {
  id: "improper-integrals-over-the-real-line",
  title: t("Improper Integrals Over the Real Line", "整个实数轴上的反常积分"),
  summary: t(
    "Split an integral from −∞ to ∞ at a point; it converges only if both halves converge.",
    "把从 −∞ 到 ∞ 的积分在某点拆开；只有两半都收敛时它才收敛。",
  ),
  prerequisites: ["improper-integrals-involving-arctangent", "integrating-functions-by-completing-the-square"],
  encompasses: [
    { topic: "improper-integrals-involving-arctangent", weight: 0.5 },
    { topic: "integrating-functions-by-completing-the-square", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "integrating-over-the-whole-real-line",
      title: t("Integrating over the whole real line", "在整个实数轴上积分"),
      explanation: t(
        "Define $\\int_{-\\infty}^{\\infty} f(x) \\, dx = \\int_{-\\infty}^{c} f(x) \\, dx + \\int_{c}^{\\infty} f(x) \\, dx$ for any $c$; it converges only if both parts converge. For example,\n\n$$\\int_{-\\infty}^{\\infty} \\frac{1}{x^{2} + m^{2}} \\, dx = \\frac{1}{m}\\left(\\frac{\\pi}{2} - \\left(-\\frac{\\pi}{2}\\right)\\right) = \\frac{\\pi}{m}.$$\n\nBut $\\int_{-\\infty}^{\\infty} x \\, dx$ diverges, even though $\\int_{-t}^{t} x \\, dx = 0$ for every $t$.",
        "对任意 $c$，定义 $\\int_{-\\infty}^{\\infty} f(x) \\, dx = \\int_{-\\infty}^{c} f(x) \\, dx + \\int_{c}^{\\infty} f(x) \\, dx$；只有两部分都收敛时它才收敛。例如\n\n$$\\int_{-\\infty}^{\\infty} \\frac{1}{x^{2} + m^{2}} \\, dx = \\frac{1}{m}\\left(\\frac{\\pi}{2} - \\left(-\\frac{\\pi}{2}\\right)\\right) = \\frac{\\pi}{m}。$$\n\n但 $\\int_{-\\infty}^{\\infty} x \\, dx$ 发散，尽管对每个 $t$ 都有 $\\int_{-t}^{t} x \\, dx = 0$。",
      ),
      generate(rng) {
        const m = rng.int(1, 9);
        const k = rng.nonZero(-9, 9);
        const value = Q.of(k, m);
        return exactValue(
          `\\int_{-\\infty}^{\\infty} ${overSquare(k, m)} \\, dx`,
          piTimes(value),
          [piTimes(Q.of(k, 2 * m)), piTimes(Q.of(k)), "0"],
          `Split at $0$: each half equals $${piTimes(Q.of(k, 2 * m))}$, since $${arctanTerm(Q.of(k, m), m)}$ runs between $${piTimes(Q.of(-k, 2 * m))}$ and $${piTimes(Q.of(k, 2 * m))}$. The total is $${piTimes(value)}$.`,
          `在 $0$ 处拆开：由于 $${arctanTerm(Q.of(k, m), m)}$ 在 $${piTimes(Q.of(-k, 2 * m))}$ 与 $${piTimes(Q.of(k, 2 * m))}$ 之间变化，每一半都等于 $${piTimes(Q.of(k, 2 * m))}$。总和为 $${piTimes(value)}$。`,
        );
      },
    },
    {
      id: "completing-the-square-over-the-real-line",
      title: t("Completing the square over the real line", "在整个实数轴上配方"),
      explanation: t(
        "A shift of the variable does not change an infinite interval in both directions, so after completing the square the limits stay the same. Complete the square, $x^{2} - 2hx + h^{2} + m^{2} = (x - h)^{2} + m^{2}$, and substitute $u = x - h$; the limits stay $-\\infty$ and $\\infty$:\n\n$$\\int_{-\\infty}^{\\infty} \\frac{1}{x^{2} + 4x + 13} \\, dx = \\int_{-\\infty}^{\\infty} \\frac{1}{u^{2} + 9} \\, du = \\frac{\\pi}{3}.$$",
        "平移变量不会改变两端都是无穷的区间，所以配方后上下限保持不变。配方 $x^{2} - 2hx + h^{2} + m^{2} = (x - h)^{2} + m^{2}$，再代换 $u = x - h$；积分限仍为 $-\\infty$ 与 $\\infty$：\n\n$$\\int_{-\\infty}^{\\infty} \\frac{1}{x^{2} + 4x + 13} \\, dx = \\int_{-\\infty}^{\\infty} \\frac{1}{u^{2} + 9} \\, du = \\frac{\\pi}{3}。$$",
      ),
      generate(rng) {
        const h = rng.nonZero(-5, 5);
        const m = rng.int(1, 4);
        const k = rng.nonZero(-6, 6);
        const den = poly([1, "x^{2}"], [-2 * h, "x"], [h * h + m * m, ""]);
        const value = Q.of(k, m);
        return exactValue(
          `\\int_{-\\infty}^{\\infty} ${fracWith(k, "", den).replace("\\frac{}", "\\frac{1}")} \\, dx`,
          piTimes(value),
          [piTimes(Q.of(k, m * m)), piTimes(Q.of(k, 2 * m)), piTimes(Q.of(k, h * h + m * m))],
          `$${den} = ${fac(h)}^{2} + ${m * m}$. With $u = ${bare(h)}$ the integral becomes $\\int_{-\\infty}^{\\infty} ${overSquare(k, m).replace(/x/g, "u")} \\, du = ${piTimes(value)}$.`,
          `$${den} = ${fac(h)}^{2} + ${m * m}$。令 $u = ${bare(h)}$，积分化为 $\\int_{-\\infty}^{\\infty} ${overSquare(k, m).replace(/x/g, "u")} \\, du = ${piTimes(value)}$。`,
        );
      },
    },
  ],
};

/** RootPower is an integrand k/x^p near 0 with an upper limit whose power is an integer. */
interface RootPower {
  readonly p: Q;
  readonly den: string;
}

/** rootPowers are the exponents p < 1 with their written denominators. */
const rootPowers: readonly RootPower[] = [
  { p: Q.of(1, 2), den: "\\sqrt{x}" },
  { p: Q.of(1, 3), den: "\\sqrt[3]{x}" },
  { p: Q.of(2, 3), den: "\\sqrt[3]{x^{2}}" },
];

/** improperIntegralsOfTheSecondKind evaluates integrals whose integrand is unbounded at an endpoint. */
export const improperIntegralsOfTheSecondKind: TopicDef = {
  id: "improper-integrals-of-the-second-kind",
  title: t("Improper Integrals of the Second Kind", "第二类反常积分"),
  summary: t(
    "Define an integral whose integrand blows up at an endpoint as a one-sided limit.",
    "把被积函数在端点处无界的积分定义为单侧极限。",
  ),
  prerequisites: ["improper-integrals"],
  encompasses: [{ topic: "improper-integrals", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-integrals-with-an-unbounded-integrand",
      title: t("Evaluating integrals with an unbounded integrand", "计算被积函数无界的积分"),
      explanation: t(
        "When the function blows up at an endpoint, integrate up to a point near it and take the limit as that point approaches the endpoint. If $f$ is unbounded at $x = a$, define\n\n$$\\int_{a}^{b} f(x) \\, dx = \\lim_{t \\to a^{+}} \\int_{t}^{b} f(x) \\, dx.$$\n\nFor example, $\\int_{0}^{9} \\frac{1}{\\sqrt{x}} \\, dx = \\lim_{t \\to 0^{+}} \\left[2\\sqrt{x}\\right]_{t}^{9} = 6$. In general $\\int_{0}^{b} x^{-p} \\, dx = \\frac{b^{1 - p}}{1 - p}$ for $p < 1$.",
        "当函数在端点处趋于无穷时，先积分到它附近的一点，再取这个点趋近端点时的极限。若 $f$ 在 $x = a$ 处无界，定义\n\n$$\\int_{a}^{b} f(x) \\, dx = \\lim_{t \\to a^{+}} \\int_{t}^{b} f(x) \\, dx。$$\n\n例如 $\\int_{0}^{9} \\frac{1}{\\sqrt{x}} \\, dx = \\lim_{t \\to 0^{+}} \\left[2\\sqrt{x}\\right]_{t}^{9} = 6$。一般地，当 $p < 1$ 时 $\\int_{0}^{b} x^{-p} \\, dx = \\frac{b^{1 - p}}{1 - p}$。",
      ),
      generate(rng) {
        const r = rng.pick(rootPowers);
        const n = rng.int(1, 4);
        const k = rng.nonZero(-6, 6);
        const b = r.p.eq(Q.of(1, 2)) ? n * n : n ** 3;
        // b^(1−p) is n for p = 1/2 and 2/3, and n² for p = 1/3.
        const bPow = r.p.eq(Q.of(1, 3)) ? n * n : n;
        const value = Q.of(k * bPow).div(Q.one.sub(r.p));
        return exactValue(
          `\\int_{0}^{${b}} ${fracWith(k, "", r.den).replace("\\frac{}", "\\frac{1}")} \\, dx`,
          value.toLatex(),
          [
            Q.of(k * bPow).toLatex(),
            Q.of(k * bPow)
              .mul(Q.one.sub(r.p))
              .toLatex(),
            value.neg().toLatex(),
          ],
          `An antiderivative is $${coef(Q.of(k).div(Q.one.sub(r.p)))}x^{${expLatex(Q.one.sub(r.p))}}$, which tends to $0$ as $x \\to 0^{+}$. At $x = ${b}$, $x^{${expLatex(Q.one.sub(r.p))}} = ${bPow}$, so the integral is $${value.toLatex()}$.`,
          `原函数为 $${coef(Q.of(k).div(Q.one.sub(r.p)))}x^{${expLatex(Q.one.sub(r.p))}}$，当 $x \\to 0^{+}$ 时趋于 $0$。在 $x = ${b}$ 处，$x^{${expLatex(Q.one.sub(r.p))}} = ${bPow}$，所以积分为 $${value.toLatex()}$。`,
        );
      },
    },
    {
      id: "the-p-test-near-zero",
      title: t("The p-test near zero", "零点附近的 p 判别法"),
      explanation: t(
        "$\\int_{0}^{1} \\frac{1}{x^{p}} \\, dx$ converges to $\\frac{1}{1 - p}$ when $p < 1$ and diverges when $p \\ge 1$ — the opposite of the test on $[1, \\infty)$. For example, $\\int_{0}^{1} \\frac{1}{x^{2}} \\, dx$ diverges because $\\left[-\\frac{1}{x}\\right]_{t}^{1} = -1 + \\frac{1}{t} \\to \\infty$.",
        "当 $p < 1$ 时 $\\int_{0}^{1} \\frac{1}{x^{p}} \\, dx$ 收敛于 $\\frac{1}{1 - p}$；当 $p \\ge 1$ 时发散——与 $[1, \\infty)$ 上的判别法正好相反。例如 $\\int_{0}^{1} \\frac{1}{x^{2}} \\, dx$ 发散，因为 $\\left[-\\frac{1}{x}\\right]_{t}^{1} = -1 + \\frac{1}{t} \\to \\infty$。",
      ),
      generate(rng) {
        const p = rng.pick(pChoices);
        const k = rng.nonZero(-9, 9);
        const integralLatex = `\\int_{0}^{1} ${fracWith(k, "", xPower(p)).replace("\\frac{}", "\\frac{1}")} \\, dx`;
        if (p.cmp(Q.one) < 0) {
          const v = Q.of(k).div(Q.one.sub(p));
          return convergenceProblem(
            rng,
            integralLatex,
            converges(v.toLatex()),
            [diverges, converges(v.neg().toLatex()), converges(String(k))],
            `Here $p = ${p.toLatex()} < 1$, so the integral converges to $\\frac{${k}}{1 - p} = ${v.toLatex()}$.`,
            `这里 $p = ${p.toLatex()} < 1$，所以积分收敛于 $\\frac{${k}}{1 - p} = ${v.toLatex()}$。`,
          );
        }
        const naive = p.eq(Q.one) ? Q.zero : Q.of(-k).div(p.sub(Q.one));
        return convergenceProblem(
          rng,
          integralLatex,
          diverges,
          p.eq(Q.one)
            ? [converges("0"), converges(String(k)), converges(String(-k))]
            : [converges(naive.toLatex()), converges(naive.neg().toLatex()), converges(String(k))],
          `Here $p = ${p.toLatex()} \\ge 1$, so the antiderivative is unbounded as $x \\to 0^{+}$ and the integral diverges.`,
          `这里 $p = ${p.toLatex()} \\ge 1$，原函数在 $x \\to 0^{+}$ 时无界，所以积分发散。`,
        );
      },
    },
  ],
};

/** improperIntegralsOfTheSecondKindDiscontinuitiesAtInteriorPoints splits integrals at an interior singularity. */
export const improperIntegralsOfTheSecondKindDiscontinuitiesAtInteriorPoints: TopicDef = {
  id: "improper-integrals-of-the-second-kind-discontinuities-at-interior-points",
  title: t("Improper Integrals of the Second Kind: Discontinuities at Interior Points", "第二类反常积分：内部间断点"),
  summary: t(
    "Split at an interior point where the integrand is unbounded; both parts must converge.",
    "在被积函数无界的内点处拆开；两部分都必须收敛。",
  ),
  prerequisites: ["improper-integrals-of-the-second-kind"],
  encompasses: [{ topic: "improper-integrals-of-the-second-kind", weight: 0.6 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "splitting-at-an-interior-discontinuity",
      title: t("Splitting at an interior discontinuity", "在内部间断点处拆开"),
      explanation: t(
        "A point inside the interval where the function blows up must be treated as an endpoint of two separate improper integrals, and both must converge. If $f$ is unbounded at $c$ inside $[a, b]$, write $\\int_{a}^{b} f = \\int_{a}^{c} f + \\int_{c}^{b} f$ and evaluate each part as a limit. For example,\n\n$$\\int_{-1}^{8} \\frac{1}{\\sqrt[3]{x}} \\, dx = \\left[\\frac{3}{2}x^{2/3}\\right]_{-1}^{0} + \\left[\\frac{3}{2}x^{2/3}\\right]_{0}^{8} = -\\frac{3}{2} + 6 = \\frac{9}{2}.$$",
        "区间内部使函数趋于无穷的点必须看作两个反常积分的端点，而且两个积分都必须收敛。若 $f$ 在 $[a, b]$ 内的点 $c$ 处无界，写成 $\\int_{a}^{b} f = \\int_{a}^{c} f + \\int_{c}^{b} f$，并把每一部分作为极限计算。例如\n\n$$\\int_{-1}^{8} \\frac{1}{\\sqrt[3]{x}} \\, dx = \\left[\\frac{3}{2}x^{2/3}\\right]_{-1}^{0} + \\left[\\frac{3}{2}x^{2/3}\\right]_{0}^{8} = -\\frac{3}{2} + 6 = \\frac{9}{2}。$$",
      ),
      generate(rng) {
        const [m, n] = [rng.int(1, 3), rng.int(1, 3)];
        const k = rng.nonZero(-6, 6);
        const square = rng.bool();
        // ∫ x^(−1/3) = (3/2)x^(2/3); ∫ x^(−2/3) = 3x^(1/3).
        const value = square ? Q.of(3 * k * (n + m)) : Q.of(3 * k * (n * n - m * m), 2);
        const den = square ? "\\sqrt[3]{x^{2}}" : "\\sqrt[3]{x}";
        const anti = square ? `${coef(Q.of(3 * k))}x^{1/3}` : `${coef(Q.of(3 * k, 2))}x^{2/3}`;
        return exactValue(
          `\\int_{${-(m ** 3)}}^{${n ** 3}} ${fracWith(k, "", den).replace("\\frac{}", "\\frac{1}")} \\, dx`,
          value.toLatex(),
          [
            square ? Q.of(3 * k * (n - m)).toLatex() : Q.of(3 * k * (n * n + m * m), 2).toLatex(),
            value.neg().toLatex(),
            square ? Q.of(3 * k * n).toLatex() : Q.of(3 * k * n * n, 2).toLatex(),
          ],
          `The integrand is unbounded at $x = 0$. An antiderivative is $${anti}$, which is continuous at $0$, so the two parts give $${value.toLatex()}$ in total.`,
          `被积函数在 $x = 0$ 处无界。原函数为 $${anti}$，它在 $0$ 处连续，所以两部分之和为 $${value.toLatex()}$。`,
        );
      },
    },
    {
      id: "spotting-a-hidden-discontinuity",
      title: t("Spotting a hidden discontinuity", "发现隐藏的间断点"),
      explanation: t(
        "Before using the fundamental theorem, check that the integrand is continuous on the interval. Naively, $\\int_{-1}^{1} \\frac{1}{x^{2}} \\, dx = \\left[-\\frac{1}{x}\\right]_{-1}^{1} = -2$, which is impossible for a positive integrand. In fact $\\frac{1}{x^{2}}$ is unbounded at $0$ and $\\int_{0}^{1} \\frac{1}{x^{2}} \\, dx$ diverges, so the whole integral diverges.",
        "使用微积分基本定理之前，先检查被积函数在区间上是否连续。若直接计算，$\\int_{-1}^{1} \\frac{1}{x^{2}} \\, dx = \\left[-\\frac{1}{x}\\right]_{-1}^{1} = -2$，而正的被积函数不可能积出负数。实际上 $\\frac{1}{x^{2}}$ 在 $0$ 处无界，$\\int_{0}^{1} \\frac{1}{x^{2}} \\, dx$ 发散，所以整个积分发散。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const c = rng.int(-3, 3);
        const [a, b] = [rng.int(1, 4), rng.int(1, 4)];
        const [lo, hi] = [c - a, c + b];
        if (rng.bool()) {
          // ∫ k/(x − c)² naively gives −k/b − k/a.
          const naive = Q.of(-k, b).sub(Q.of(k, a));
          return convergenceProblem(
            rng,
            `\\int_{${lo}}^{${hi}} ${recip(k, c, 2)} \\, dx`,
            diverges,
            [converges(naive.toLatex()), converges(naive.neg().toLatex()), converges("0")],
            `The integrand is unbounded at $x = ${c}$, inside the interval, and $\\int_{${c}}^{${hi}} ${recip(k, c, 2)} \\, dx$ diverges (the $p$-test with $p = 2$). So the integral diverges; the value $${naive.toLatex()}$ from the fundamental theorem is wrong.`,
            `被积函数在区间内的 $x = ${c}$ 处无界，且 $\\int_{${c}}^{${hi}} ${recip(k, c, 2)} \\, dx$ 发散（$p = 2$ 的 $p$ 判别法）。所以积分发散；直接用基本定理得到的 $${naive.toLatex()}$ 是错误的。`,
          );
        }
        const [m, n] = [rng.int(1, 3), rng.int(1, 3)];
        const v = Q.of(3 * k * (n + m));
        return convergenceProblem(
          rng,
          `\\int_{${-(m ** 3)}}^{${n ** 3}} ${fracWith(k, "", "\\sqrt[3]{x^{2}}").replace("\\frac{}", "\\frac{1}")} \\, dx`,
          converges(v.toLatex()),
          [diverges, converges(Q.of(3 * k * (n - m)).toLatex()), converges(v.neg().toLatex())],
          `The integrand is unbounded at $0$, but $p = \\frac{2}{3} < 1$, so both parts converge. With the antiderivative $${coef(Q.of(3 * k))}x^{1/3}$ the total is $${v.toLatex()}$.`,
          `被积函数在 $0$ 处无界，但 $p = \\frac{2}{3} < 1$，两部分都收敛。由原函数 $${coef(Q.of(3 * k))}x^{1/3}$ 得总和为 $${v.toLatex()}$。`,
        );
      },
    },
  ],
};

/** calculusIIFractionImproperTopics are the topics of Calculus II modules 1.6–1.7. */
export const calculusIIFractionImproperTopics: readonly TopicDef[] = [
  expressingRationalFunctionsAsSumsOfPartialFractions,
  expressingRationalFunctionsWithRepeatedFactorsAsSumsOfPartialFractions,
  expressingRationalFunctionsWithIrreducibleQuadraticFactorsAsSumsOfPartialFractions,
  integratingRationalFunctionsUsingPartialFractions,
  integratingRationalFunctionsWithRepeatedFactors,
  integratingRationalFunctionsWithIrreducibleQuadraticFactors,
  improperIntegrals,
  improperIntegralsInvolvingExponentialFunctions,
  improperIntegralsInvolvingArctangent,
  improperIntegralsOverTheRealLine,
  improperIntegralsOfTheSecondKind,
  improperIntegralsOfTheSecondKindDiscontinuitiesAtInteriorPoints,
];
