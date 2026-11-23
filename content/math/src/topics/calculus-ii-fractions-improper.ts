import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, poly, Q } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { bare, fac, oneOf, type Poly, pLatex } from "./calculus-common.ts";
import { fracTerm, joinTerms, withC } from "./calculus-ii-identities-parts.ts";
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

/** both spreads a solution into its English and Chinese texts. */
const both = (s: Text) => [s.en, s["zh-CN"]] as const;

/** shown is a displayed line placed at the end of a sentence. */
const shown = (...lines: readonly string[]) => steps(...lines).trimEnd();

/** cf writes an integer coefficient in front of a letter: "", "-", "3". */
const cf = (k: number) => (k === 1 ? "" : k === -1 ? "-" : String(k));

/** lead writes an integer factor in front of a product: "", "-", "3 \cdot ". */
const lead = (k: number) => (k === 1 ? "" : k === -1 ? "-" : `${k} \\cdot `);

/** pn writes a number, in parentheses when it is negative. */
const pn = (n: number) => (n < 0 ? `(${n})` : String(n));

/** wrap puts a signed expression in parentheses when it starts with a minus sign. */
const wrap = (s: string) => (s.startsWith("-") ? `\\left(${s}\\right)` : s);

/** times writes k(e), or kx when e is x. */
const times = (k: number, e: string) => (e === "x" ? poly([k, "x"]) : `${cf(k)}(${e})`);

/** withLetter writes a letter times x − a: "A(x - 2)", "Ax". */
const withLetter = (letter: string, a: number) => (a === 0 ? `${letter}x` : `${letter}(${bare(a)})`);

/** solved writes the lines that solve k·letter = k·value. */
const solved = (letter: string, k: number, value: number) =>
  k === 1 ? [`${letter} = ${value}`] : [`${k * value} = ${cf(k)}${letter}`, `${letter} = ${value}`];

/** noC drops the trailing "+ C" of an antiderivative. */
const noC = (answer: string) => answer.replace(/ \+ C$/, "");

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
function constantProblem(fraction: string, form: string, letter: string, value: number, wrong: readonly number[], solution: Text) {
  return numberProblem({
    prompt: t(`Write $${fraction}$ in the form $${form}$. Find $${letter}$.`, `把 $${fraction}$ 写成 $${form}$ 的形式，求 $${letter}$。`),
    answer: value,
    wrong,
    solution,
    form: "integer",
  });
}

/** twoLinear writes the decomposition form A/(x − a) + B/(x − b). */
const twoLinear = (a: number, b: number) => `\\frac{A}{${bare(a)}} + \\frac{B}{${bare(b)}}`;

/** distinctConstant solves for A or B over (x − a)(x − b) by substituting a root, and checks by expanding the numerator back. */
function distinctConstant(a: number, b: number, A: number, B: number, num: string, askA: boolean, first?: Step): Text {
  const [letter, value, at, diff, otherLetter, other, otherAt] = askA
    ? (["A", A, a, a - b, "B", B, b] as const)
    : (["B", B, b, b - a, "A", A, a] as const);
  const expanded = `${joinTerms([times(A, bare(b)), times(B, bare(a))])} = ${num}`;
  return walked(
    [
      ...(first ? [first] : []),
      [
        ["Clear the denominators", "去分母"],
        t(`Multiply both sides by $${fac(a)}${fac(b)}$:`, `两边同乘 $${fac(a)}${fac(b)}$：`),
        [`${num} = ${withLetter("A", b)} + ${withLetter("B", a)}`],
      ],
      [
        ["Substitute a root", "代入一个根"],
        t(`Setting $x = ${at}$ makes the $${otherLetter}$ term zero:`, `令 $x = ${at}$，$${otherLetter}$ 项变为零：`),
        solved(letter, diff, value),
      ],
    ],
    t(
      `Setting $x = ${otherAt}$ in the same way gives $${otherLetter} = ${other}$. With both constants, the right side expands back to the numerator:${shown(expanded)}`,
      `同样令 $x = ${otherAt}$，得 $${otherLetter} = ${other}$。代入两个常数，右边展开后正是分子：${shown(expanded)}`,
    ),
  );
}

/** expressingRationalFunctionsAsSumsOfPartialFractions splits fractions over distinct linear factors. */
export const expressingRationalFunctionsAsSumsOfPartialFractions: TopicDef = {
  id: "expressing-rational-functions-as-sums-of-partial-fractions",
  title: t("Expressing Rational Functions as Sums of Partial Fractions", "把有理函数写成部分分式之和"),
  summary: t(
    "Split a fraction whose denominator has distinct linear factors into a sum of simpler fractions.",
    "把分母含不同一次因式的分式拆成若干简单分式之和。",
  ),
  prerequisites: ["adding-rational-expressions-with-unlike-denominators"],
  encompasses: [],
  xp: 10,
  standards: [],
  intro: t(
    `Fractions over unlike denominators add over the product of the denominators: $\\frac{2}{x - 1} + \\frac{3}{x + 1}$ has numerator $2(x + 1) + 3(x - 1)$ over $(x - 1)(x + 1)$, and that numerator is $5x - 1$.

Check: at $x = 0$ the two fractions give $-2 + 3$, which is $1$, and $\\frac{5x - 1}{(x - 1)(x + 1)}$ gives $\\frac{-1}{-1}$, which is $1$ as well.

In this lesson we run the addition backwards: given a fraction such as $\\frac{5x - 1}{(x - 1)(x + 1)}$, we find the simpler fractions that add up to it.`,
    `分母不同的分式相加时，以分母之积为公分母：$\\frac{2}{x - 1} + \\frac{3}{x + 1}$ 的分子是 $2(x + 1) + 3(x - 1)$，分母是 $(x - 1)(x + 1)$，而这个分子就是 $5x - 1$。

检验：当 $x = 0$ 时，两个分式给出 $-2 + 3$，即 $1$；$\\frac{5x - 1}{(x - 1)(x + 1)}$ 给出 $\\frac{-1}{-1}$，也是 $1$。

这节课我们把加法倒过来做：给定 $\\frac{5x - 1}{(x - 1)(x + 1)}$ 这样的分式，求出相加等于它的几个简单分式。`,
  ),
  knowledgePoints: [
    {
      id: "partial-fractions-with-distinct-linear-factors",
      title: t("Partial fractions with distinct linear factors", "不同一次因式的部分分式"),
      explanation: t(
        "A proper fraction whose denominator is $(x - a)(x - b)$ with $a \\ne b$ can be written $\\frac{A}{x - a} + \\frac{B}{x - b}$. Multiply through by the denominator:\n\n$$N(x) = A(x - b) + B(x - a)$$\n\nSetting $x = a$ kills the $B$ term, so $A = \\frac{N(a)}{a - b}$; setting $x = b$ gives $B = \\frac{N(b)}{b - a}$. For example, $\\frac{5x - 1}{(x - 1)(x + 1)}$: at $x = 1$, $4 = 2A$, so $A = 2$; at $x = -1$, $-6 = -2B$, so $B = 3$.\n\nCheck: $\\frac{2}{x - 1} + \\frac{3}{x + 1}$ has numerator $2(x + 1) + 3(x - 1)$, which is $5x - 1$.\n\n> **Watch out.** Setting $x = a$ is allowed even though the fraction itself is undefined there. The equation $N(x) = A(x - b) + B(x - a)$ is between polynomials, so it holds for every $x$.",
        "分母为 $(x - a)(x - b)$（$a \\ne b$）的真分式可以写成 $\\frac{A}{x - a} + \\frac{B}{x - b}$。两边同乘分母：\n\n$$N(x) = A(x - b) + B(x - a)$$\n\n令 $x = a$，$B$ 项消失，于是 $A = \\frac{N(a)}{a - b}$；令 $x = b$ 得 $B = \\frac{N(b)}{b - a}$。例如 $\\frac{5x - 1}{(x - 1)(x + 1)}$：令 $x = 1$，$4 = 2A$，$A = 2$；令 $x = -1$，$-6 = -2B$，$B = 3$。\n\n检验：$\\frac{2}{x - 1} + \\frac{3}{x + 1}$ 的分子是 $2(x + 1) + 3(x - 1)$，即 $5x - 1$。\n\n> **注意。** 虽然原分式在 $x = a$ 处没有定义，仍然可以令 $x = a$。等式 $N(x) = A(x - b) + B(x - a)$ 两边都是多项式，对每个 $x$ 都成立。",
      ),
      generate(rng) {
        const [a, b] = distinctRoots(rng, -5, 5);
        const A = rng.nonZero(-6, 6);
        const B = rng.nonZero(-6, 6);
        const num = linear(A + B, -(A * b + B * a));
        const fraction = `\\frac{${num}}{${fac(a)}${fac(b)}}`;
        const askA = rng.bool();
        const [value, other, diff] = askA ? [A, B, a - b] : [B, A, b - a];
        return constantProblem(
          fraction,
          twoLinear(a, b),
          askA ? "A" : "B",
          value,
          [other, -value, value * diff],
          distinctConstant(a, b, A, B, num, askA),
        );
      },
    },
    {
      id: "factoring-the-denominator-first",
      title: t("Factoring the denominator first", "先分解分母"),
      explanation: t(
        "When the denominator is given as a quadratic, factor it first. For $\\frac{x + 7}{x^{2} - x - 6}$, factor $x^{2} - x - 6 = (x + 2)(x - 3)$, then find the constants as before: $x + 7 = A(x - 3) + B(x + 2)$; $x = -2$ gives $A = -1$ and $x = 3$ gives $B = 2$.\n\nCheck: $(x + 2)(x - 3)$ expands to $x^{2} - 3x + 2x - 6$, which is $x^{2} - x - 6$; and $-(x - 3) + 2(x + 2)$ is $x + 7$.\n\n> **Watch out.** Factor completely before choosing the form. Left as $x^{2} - x - 6$, the denominator suggests a single fraction with a linear numerator, which is just the fraction we started with.",
        "当分母是二次式时，先把它分解。对 $\\frac{x + 7}{x^{2} - x - 6}$，分解 $x^{2} - x - 6 = (x + 2)(x - 3)$，再照前面的方法求常数：$x + 7 = A(x - 3) + B(x + 2)$；令 $x = -2$ 得 $A = -1$，令 $x = 3$ 得 $B = 2$。\n\n检验：$(x + 2)(x - 3)$ 展开为 $x^{2} - 3x + 2x - 6$，即 $x^{2} - x - 6$；而 $-(x - 3) + 2(x + 2)$ 正是 $x + 7$。\n\n> **注意。** 先把分母完全分解，再确定分式的形式。如果分母保留为 $x^{2} - x - 6$，就只能写出一个一次分子的分式，那正是原来的分式。",
      ),
      generate(rng) {
        const [a, b] = distinctRoots(rng, -6, 6);
        const A = rng.nonZero(-6, 6);
        const B = rng.nonZero(-6, 6);
        const num = linear(A + B, -(A * b + B * a));
        const den = pLatex(pMul(root(a), root(b)));
        const askA = rng.bool();
        const [value, other, diff] = askA ? [A, B, a - b] : [B, A, b - a];
        return constantProblem(
          `\\frac{${num}}{${den}}`,
          twoLinear(a, b),
          askA ? "A" : "B",
          value,
          [other, -value, value * diff],
          distinctConstant(a, b, A, B, num, askA, [
            ["Factor the denominator", "分解分母"],
            t(`The roots of $${den}$ are $${a}$ and $${b}$, so:`, `$${den}$ 的根是 $${a}$ 和 $${b}$，所以：`),
            [`${den} = ${fac(a)}${fac(b)}`],
          ]),
        );
      },
    },
  ],
};

/** repeatedNumerator returns A(x − a)(x − b) + B(x − b) + C(x − a)², the numerator over (x − a)²(x − b). */
const repeatedNumerator = (a: number, b: number, A: number, B: number, C: number) =>
  pSum(pMul(pMul(root(a), root(b)), [A]), pMul(root(b), [B]), pMul(pMul(root(a), root(a)), [C]));

/** repeatedConstants finds A, B and C over (x − a)²(x − b): the roots give B and C, the x² coefficients give A. */
function repeatedConstants(a: number, b: number, A: number, B: number, C: number, N: Poly): readonly Step[] {
  return [
    [
      ["Clear the denominators", "去分母"],
      t(`Multiply both sides by $${fac(a)}^{2}${fac(b)}$:`, `两边同乘 $${fac(a)}^{2}${fac(b)}$：`),
      [`${pLatex(N)} = A${fac(a)}${fac(b)} + B${fac(b)} + C${fac(a)}^{2}`],
    ],
    [
      ["Substitute the two roots", "代入两个根"],
      t(
        `Setting $x = ${a}$ leaves only the $B$ term, and setting $x = ${b}$ leaves only the $C$ term:`,
        `令 $x = ${a}$，只剩 $B$ 项；令 $x = ${b}$，只剩 $C$ 项：`,
      ),
      [...solved("B", a - b, B), ...solved("C", (b - a) ** 2, C)],
    ],
    [
      ["Compare the coefficients of x squared", "比较 x² 的系数"],
      t("Only the $A$ and $C$ terms contain $x^{2}$:", "只有 $A$ 项和 $C$ 项含 $x^{2}$："),
      [`${A + C} = A ${C < 0 ? "-" : "+"} ${Math.abs(C)}`, `A = ${A}`],
    ],
  ];
}

/** constantTerms is the check that the constant terms of A(x − a)(x − b) + B(x − b) + C(x − a)² match the numerator. */
const constantTerms = (a: number, b: number, A: number, B: number, C: number, N: Poly): Text => {
  const terms = [A * a * b, -B * b, C * a * a].filter((v) => v !== 0);
  const N0 = N[0] ?? 0;
  const intro = t(
    `Compare the constant terms, which no step above used. On the right they are $A \\cdot ab$, $B \\cdot (-b)$ and $C \\cdot a^{2}$, with $a = ${a}$ and $b = ${b}$`,
    `比较上面没有用到的常数项。右边的常数项是 $A \\cdot ab$、$B \\cdot (-b)$ 和 $C \\cdot a^{2}$，其中 $a = ${a}$，$b = ${b}$`,
  );
  if (terms.length === 0)
    return t(
      `${intro.en}. All three are zero, and so is the constant term of the numerator.`,
      `${intro["zh-CN"]}。三项都为零，分子的常数项也为零。`,
    );
  if (terms.length === 1)
    return t(
      `${intro.en}. Only one of them is not zero, and it is $${N0}$, the constant term of the numerator.`,
      `${intro["zh-CN"]}。其中只有一项不为零，它等于 $${N0}$，正是分子的常数项。`,
    );
  const line = `${joinTerms(terms.map(String))} = ${N0}`;
  return t(
    `${intro.en}; they must add up to the constant term of the numerator:${shown(line)}`,
    `${intro["zh-CN"]}；它们的和应等于分子的常数项：${shown(line)}`,
  );
};

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
  intro: t(
    `Over distinct linear factors, a fraction splits by substituting the roots. For $\\frac{x + 5}{(x - 1)(x + 2)}$, write $x + 5 = A(x + 2) + B(x - 1)$: setting $x = 1$ gives $6 = 3A$, so $A = 2$, and setting $x = -2$ gives $3 = -3B$, so $B = -1$.

Check: $2(x + 2) - (x - 1)$ is $x + 5$, the numerator.

In this lesson we split fractions whose denominator has a squared factor such as $(x - 2)^{2}$, which needs one fraction for each power of that factor.`,
    `分母是不同的一次因式时，代入各个根就能拆开分式。对 $\\frac{x + 5}{(x - 1)(x + 2)}$，写出 $x + 5 = A(x + 2) + B(x - 1)$：令 $x = 1$ 得 $6 = 3A$，$A = 2$；令 $x = -2$ 得 $3 = -3B$，$B = -1$。

检验：$2(x + 2) - (x - 1)$ 正是分子 $x + 5$。

这节课我们拆分分母含平方因式（如 $(x - 2)^{2}$）的分式，这个因式的每一个幂都需要一个分式。`,
  ),
  knowledgePoints: [
    {
      id: "a-single-repeated-factor",
      title: t("A single repeated factor", "单个重因式"),
      explanation: t(
        "A repeated factor needs one fraction for each power up to its multiplicity, because a single fraction cannot produce every possible numerator. Write\n\n$$\\frac{px + q}{(x - a)^{2}} = \\frac{A}{x - a} + \\frac{B}{(x - a)^{2}}$$\n\nThen $px + q = A(x - a) + B$. Setting $x = a$ gives $B$; comparing the coefficients of $x$ gives $A = p$. For example, for $\\frac{3x - 4}{(x - 2)^{2}}$, $A = 3$ and $B = 3 \\cdot 2 - 4$, which is $2$.\n\nCheck: $\\frac{3}{x - 2} + \\frac{2}{(x - 2)^{2}}$ has numerator $3(x - 2) + 2$, which is $3x - 4$.\n\n> **Watch out.** A single term $\\frac{B}{(x - a)^{2}}$ is not enough: its numerator is a constant, so it cannot match a numerator such as $3x - 4$.",
        "重复因式的每一个幂都需要一个分式，直到它的重数，因为一个分式不能产生所有可能的分子。写成\n\n$$\\frac{px + q}{(x - a)^{2}} = \\frac{A}{x - a} + \\frac{B}{(x - a)^{2}}$$\n\n则 $px + q = A(x - a) + B$。令 $x = a$ 得 $B$；比较 $x$ 的系数得 $A = p$。例如 $\\frac{3x - 4}{(x - 2)^{2}}$：$A = 3$，$B = 3 \\cdot 2 - 4$，即 $2$。\n\n检验：$\\frac{3}{x - 2} + \\frac{2}{(x - 2)^{2}}$ 的分子是 $3(x - 2) + 2$，即 $3x - 4$。\n\n> **注意。** 只写一项 $\\frac{B}{(x - a)^{2}}$ 是不够的：它的分子是常数，凑不出 $3x - 4$ 这样的分子。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const A = rng.nonZero(-6, 6);
        const B = rng.nonZero(-9, 9);
        const num = linear(A, B - A * a);
        const askA = rng.bool();
        const [value, other] = askA ? [A, B] : [B, A];
        const expanded = `${joinTerms([times(A, bare(a)), String(B)])} = ${num}`;
        return constantProblem(
          `\\frac{${num}}{${fac(a)}^{2}}`,
          `\\frac{A}{${bare(a)}} + \\frac{B}{${fac(a)}^{2}}`,
          askA ? "A" : "B",
          value,
          [other, -value, B - A * a],
          walked(
            [
              [
                ["Clear the denominator", "去分母"],
                t(`Multiply both sides by $${fac(a)}^{2}$:`, `两边同乘 $${fac(a)}^{2}$：`),
                [`${num} = ${withLetter("A", a)} + B`],
              ],
              [
                ["Compare coefficients and substitute the root", "比较系数并代入根"],
                t(
                  `Only $${withLetter("A", a)}$ contains $x$, so the $x$ terms give $A = ${A}$. Setting $x = ${a}$ makes the $A$ term zero and leaves $B = ${B}$.`,
                  `只有 $${withLetter("A", a)}$ 含 $x$，所以比较 $x$ 的系数得 $A = ${A}$。令 $x = ${a}$，$A$ 项变为零，剩下 $B = ${B}$。`,
                ),
              ],
            ],
            t(
              `Put both constants back; the right side expands to the numerator:${shown(expanded)}`,
              `把两个常数代回，右边展开后正是分子：${shown(expanded)}`,
            ),
          ),
        );
      },
    },
    {
      id: "repeated-and-distinct-factors-together",
      title: t("Repeated and distinct factors together", "重因式与不同因式并存"),
      explanation: t(
        "Clear the denominators, then substitute the roots to find some constants quickly and compare coefficients to find the rest. For $(x - a)^{2}(x - b)$ write $\\frac{A}{x - a} + \\frac{B}{(x - a)^{2}} + \\frac{C}{x - b}$, so\n\n$$N(x) = A(x - a)(x - b) + B(x - b) + C(x - a)^{2}$$\n\n$x = a$ gives $B$, $x = b$ gives $C$, and comparing the coefficients of $x^{2}$ gives $A + C$, hence $A$. For example, for $\\frac{2x^{2} + 2}{(x - 1)^{2}(x + 1)}$, $x = 1$ gives $4 = 2B$, so $B = 2$; $x = -1$ gives $4 = 4C$, so $C = 1$; and the $x^{2}$ terms give $A + C = 2$, so $A = 1$.\n\nCheck: the constant terms must agree too. On the right they are $A \\cdot (-1) + B \\cdot 1 + C \\cdot 1$, which is $-1 + 2 + 1$, or $2$, the constant term of $2x^{2} + 2$.\n\n> **Watch out.** No root removes both $B$ and $C$ and leaves $A$: substituting finds only $B$ and $C$, so $A$ has to come from comparing coefficients.",
        "先去分母，再代入各个根快速求出一部分常数，其余的通过比较系数求出。对 $(x - a)^{2}(x - b)$，写成 $\\frac{A}{x - a} + \\frac{B}{(x - a)^{2}} + \\frac{C}{x - b}$，则\n\n$$N(x) = A(x - a)(x - b) + B(x - b) + C(x - a)^{2}$$\n\n令 $x = a$ 得 $B$，令 $x = b$ 得 $C$，比较 $x^{2}$ 的系数得 $A + C$，从而得 $A$。例如 $\\frac{2x^{2} + 2}{(x - 1)^{2}(x + 1)}$：令 $x = 1$，$4 = 2B$，$B = 2$；令 $x = -1$，$4 = 4C$，$C = 1$；比较 $x^{2}$ 的系数，$A + C = 2$，所以 $A = 1$。\n\n检验：常数项也必须相等。右边的常数项是 $A \\cdot (-1) + B \\cdot 1 + C \\cdot 1$，即 $-1 + 2 + 1$，等于 $2$，正是 $2x^{2} + 2$ 的常数项。\n\n> **注意。** 没有哪个根能同时消去 $B$ 和 $C$ 而留下 $A$：代入根只能求出 $B$ 和 $C$，$A$ 必须靠比较系数求出。",
      ),
      generate(rng) {
        const [a, b] = rng.shuffle(distinctRoots(rng, -3, 3)) as [number, number];
        const [A, B, C] = [rng.nonZero(-4, 4), rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
        const N = repeatedNumerator(a, b, A, B, C);
        const fraction = `\\frac{${pLatex(N)}}{${fac(a)}^{2}${fac(b)}}`;
        const letter = rng.pick(["A", "B", "C"] as const);
        const value = { A, B, C }[letter];
        return constantProblem(
          fraction,
          `\\frac{A}{${bare(a)}} + \\frac{B}{${fac(a)}^{2}} + \\frac{C}{${bare(b)}}`,
          letter,
          value,
          [...[A, B, C].filter((v) => v !== value), -value, A + C],
          walked(repeatedConstants(a, b, A, B, C, N), constantTerms(a, b, A, B, C, N)),
        );
      },
    },
  ],
};

/** quadraticNumerator returns A(x² + c) + (Bx + C)(x − a), the numerator over (x − a)(x² + c). */
const quadraticNumerator = (a: number, c: number, A: number, B: number, C: number) => pSum(pMul([c, 0, 1], [A]), pMul([C, B], root(a)));

/** irreducible writes x² + c. */
const irreducible = (c: number) => poly([1, "x^{2}"], [c, ""]);

/** quadraticSteps clears the denominators of N/((x − a)(x² + c)) and finds A from the root. */
const quadraticSteps = (a: number, c: number, A: number, N: Poly): readonly Step[] => [
  [
    ["Clear the denominators", "去分母"],
    t(`Multiply both sides by $${fac(a)}(${irreducible(c)})$:`, `两边同乘 $${fac(a)}(${irreducible(c)})$：`),
    [`${pLatex(N)} = A(${irreducible(c)}) + (Bx + C)${fac(a)}`],
  ],
  [
    ["Substitute the root of the linear factor", "代入一次因式的根"],
    t(`Setting $x = ${a}$ makes the $(Bx + C)$ term zero:`, `令 $x = ${a}$，$(Bx + C)$ 项变为零：`),
    solved("A", a * a + c, A),
  ],
];

/** quadraticCheck finds B and C from the x² and x terms and checks the constant terms. */
const quadraticCheck = (a: number, c: number, A: number, B: number, C: number, N: Poly, found: boolean): Text => {
  const N0 = N[0] ?? 0;
  // C − aB is the x coefficient, so C = N₁ + aB.
  const cFrom = a * B === 0 ? `${C}` : `${joinTerms([String(N[1] ?? 0), String(a * B)])} = ${C}`;
  const tail =
    a === 0
      ? t(
          ` With $a = 0$ this is $Ac$, which is $${A * c}$, the constant term of the numerator.`,
          `$a = 0$ 时它就是 $Ac$，等于 $${A * c}$，正是分子的常数项。`,
        )
      : t(
          ` With $a = ${a}$:${shown(`${joinTerms([String(A * c), String(-a * C)])} = ${N0}`)}`,
          `其中 $a = ${a}$：${shown(`${joinTerms([String(A * c), String(-a * C)])} = ${N0}`)}`,
        );
  const en = found
    ? "The constant terms were not used above, so they test all three constants. On the right they are $Ac - aC$."
    : `The $x^{2}$ terms give $B = ${N[2] ?? 0} - ${pn(A)} = ${B}$, and the $x$ terms give $C = ${cFrom}$. With these, the constant terms $Ac - aC$ agree.`;
  const zh = found
    ? "上面没有用到常数项，所以用它检验三个常数。右边的常数项是 $Ac - aC$。"
    : `比较 $x^{2}$ 的系数得 $B = ${N[2] ?? 0} - ${pn(A)} = ${B}$，比较 $x$ 的系数得 $C = ${cFrom}$。代入后常数项 $Ac - aC$ 也相等。`;
  return t(`${en}${tail.en}`, `${zh}${tail["zh-CN"]}`);
};

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
  intro: t(
    `A fraction over distinct linear factors splits by substituting the roots. For $\\frac{3x + 1}{x(x + 1)}$, write $3x + 1 = A(x + 1) + Bx$: setting $x = 0$ gives $A = 1$, and setting $x = -1$ gives $-2 = -B$, so $B = 2$.

Check: $(x + 1) + 2x$ is $3x + 1$, the numerator.

In this lesson we meet a quadratic factor such as $x^{2} + 2$, which has no real roots and cannot be split, so the fraction over it needs a linear numerator $Bx + C$.`,
    `分母是不同的一次因式时，代入各个根就能拆开分式。对 $\\frac{3x + 1}{x(x + 1)}$，写出 $3x + 1 = A(x + 1) + Bx$：令 $x = 0$ 得 $A = 1$；令 $x = -1$ 得 $-2 = -B$，所以 $B = 2$。

检验：$(x + 1) + 2x$ 正是分子 $3x + 1$。

这节课我们遇到 $x^{2} + 2$ 这样的二次因式，它没有实根，不能再分解，所以它上面的分式需要一次分子 $Bx + C$。`,
  ),
  knowledgePoints: [
    {
      id: "the-constant-over-the-linear-factor",
      title: t("The constant over the linear factor", "一次因式上的常数"),
      explanation: t(
        "A quadratic $x^{2} + c$ with $c > 0$ has no real roots, so it cannot be split further; the fraction over it needs a linear numerator. Write\n\n$$\\frac{N(x)}{(x - a)(x^{2} + c)} = \\frac{A}{x - a} + \\frac{Bx + C}{x^{2} + c}$$\n\nClearing the denominators gives\n\n$$N(x) = A(x^{2} + c) + (Bx + C)(x - a)$$\n\nSetting $x = a$ removes the second term, so $A = \\frac{N(a)}{a^{2} + c}$. For example, for $\\frac{3x^{2} + x + 4}{x(x^{2} + 2)}$, setting $x = 0$ gives $4 = 2A$, so $A = 2$.\n\nCheck: with $A = 2$, the rest of the numerator is $3x^{2} + x + 4 - 2(x^{2} + 2)$, which is $x^{2} + x$, or $(x + 1)x$: a multiple of $x$, as the term $(Bx + C)x$ requires.\n\n> **Watch out.** Over $x^{2} + c$ the numerator is $Bx + C$, not a single constant. With a constant alone there are too few unknowns to match a numerator of degree two.",
        "$c > 0$ 时二次式 $x^{2} + c$ 没有实根，不能再分解，它上面的分式需要一次分子。写成\n\n$$\\frac{N(x)}{(x - a)(x^{2} + c)} = \\frac{A}{x - a} + \\frac{Bx + C}{x^{2} + c}$$\n\n去分母得\n\n$$N(x) = A(x^{2} + c) + (Bx + C)(x - a)$$\n\n令 $x = a$，第二项消失，所以 $A = \\frac{N(a)}{a^{2} + c}$。例如对 $\\frac{3x^{2} + x + 4}{x(x^{2} + 2)}$，令 $x = 0$ 得 $4 = 2A$，$A = 2$。\n\n检验：$A = 2$ 时，分子余下的部分是 $3x^{2} + x + 4 - 2(x^{2} + 2)$，即 $x^{2} + x$，也就是 $(x + 1)x$：它是 $x$ 的倍数，正符合 $(Bx + C)x$ 的形式。\n\n> **注意。** $x^{2} + c$ 上面的分子是 $Bx + C$，不是单个常数。只用一个常数，未知数太少，凑不出二次的分子。",
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
          walked(quadraticSteps(a, c, A, N), quadraticCheck(a, c, A, B, C, N, false)),
        );
      },
    },
    {
      id: "the-linear-numerator-over-the-quadratic",
      title: t("The linear numerator over the quadratic", "二次因式上的一次分子"),
      explanation: t(
        "After finding $A$, compare coefficients in $N(x) = A(x^{2} + c) + (Bx + C)(x - a)$: the $x^{2}$ terms give $A + B$, the $x$ terms give $C - aB$, and the constant terms give $Ac - aC$. For example, for $\\frac{3x^{2} + x + 4}{x(x^{2} + 2)}$: $x = 0$ gives $4 = 2A$, $A = 2$; then $A + B = 3$ gives $B = 1$, and the $x$ terms give $C = 1$.\n\nCheck: the constant terms were not used, and they agree: $Ac - aC$ is $2 \\cdot 2 - 0 \\cdot 1$, which is $4$.\n\n> **Watch out.** The $x^{2}$ coefficient of the numerator is $A + B$, not $B$ alone: the term $A(x^{2} + c)$ contributes $x^{2}$ as well.",
        "求出 $A$ 后，比较 $N(x) = A(x^{2} + c) + (Bx + C)(x - a)$ 两边的系数：$x^{2}$ 项给出 $A + B$，$x$ 项给出 $C - aB$，常数项给出 $Ac - aC$。例如 $\\frac{3x^{2} + x + 4}{x(x^{2} + 2)}$：令 $x = 0$，$4 = 2A$，$A = 2$；由 $A + B = 3$ 得 $B = 1$，由 $x$ 项得 $C = 1$。\n\n检验：常数项没有用到，它们也相等：$Ac - aC$ 是 $2 \\cdot 2 - 0 \\cdot 1$，即 $4$。\n\n> **注意。** 分子 $x^{2}$ 的系数是 $A + B$，而不只是 $B$：$A(x^{2} + c)$ 一项也含 $x^{2}$。",
      ),
      generate(rng) {
        const a = rng.int(-4, 4);
        const c = rng.int(1, 9);
        const [A, B, C] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        const N = quadraticNumerator(a, c, A, B, C);
        const askB = rng.bool();
        const value = askB ? B : C;
        const xLine = a === 0 ? `${N[1] ?? 0} = C` : `${N[1] ?? 0} = C ${a > 0 ? "-" : "+"} ${cf(Math.abs(a))}B`;
        return constantProblem(
          `\\frac{${pLatex(N)}}{${fac(a)}(${irreducible(c)})}`,
          `\\frac{A}{${bare(a)}} + \\frac{Bx + C}{${irreducible(c)}}`,
          askB ? "B" : "C",
          value,
          [askB ? C : B, A, -value, N[2] ?? 0],
          walked(
            [
              ...quadraticSteps(a, c, A, N),
              [
                ["Compare coefficients", "比较系数"],
                t(
                  "The $x^{2}$ terms come from $Ax^{2}$ and $Bx^{2}$, and the $x$ terms from $Cx$ and $-aBx$:",
                  "$x^{2}$ 项来自 $Ax^{2}$ 和 $Bx^{2}$，$x$ 项来自 $Cx$ 和 $-aBx$：",
                ),
                [`${N[2] ?? 0} = ${A} + B`, `B = ${B}`, xLine, `C = ${C}`],
              ],
            ],
            quadraticCheck(a, c, A, B, C, N, true),
          ),
        );
      },
    },
  ],
};

/** lnRatio writes ln of a positive rational: "\ln 3", "\ln\left(\frac{5}{2}\right)". */
const lnRatio = (q: Q) => (q.isInteger() ? `\\ln ${q.toLatex()}` : `\\ln\\left(${q.toLatex()}\\right)`);

/** lnAt writes A ln p + B ln q for positive integers, leaving out ln 1. */
const lnAt = (A: number, p: number, B: number, q: number) =>
  poly(...[[A, p] as const, [B, q] as const].filter(([, v]) => v !== 1).map(([k, v]) => [k, `\\ln ${v}`] as const)) || "0";

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
  intro: t(
    `A constant over a linear expression integrates to a logarithm: with $u = x + 2$, $\\int \\frac{3}{x + 2} \\, dx$ is $3\\ln|x + 2| + C$.

Check: the derivative of $3\\ln|x + 2|$ is $\\frac{3}{x + 2}$, the integrand.

In this lesson we split a fraction with two linear factors into partial fractions and integrate each one to a logarithm, for indefinite and for definite integrals.`,
    `常数除以一次式的积分是对数：令 $u = x + 2$，$\\int \\frac{3}{x + 2} \\, dx$ 等于 $3\\ln|x + 2| + C$。

检验：$3\\ln|x + 2|$ 的导数是 $\\frac{3}{x + 2}$，正是被积函数。

这节课我们把含两个一次因式的分式拆成部分分式，再把每一项积分为对数，不定积分和定积分都要做。`,
  ),
  knowledgePoints: [
    {
      id: "indefinite-integrals-with-distinct-linear-factors",
      title: t("Indefinite integrals with distinct linear factors", "不同一次因式的不定积分"),
      explanation: t(
        "Splitting the fraction into simpler fractions makes each term the reciprocal of a linear expression, which integrates to a logarithm: $\\int \\frac{A}{x - a} \\, dx = A\\ln|x - a| + C$. For example,\n\n$$\\int \\frac{5x - 1}{(x - 1)(x + 1)} \\, dx = \\int \\left(\\frac{2}{x - 1} + \\frac{3}{x + 1}\\right) dx = 2\\ln|x - 1| + 3\\ln|x + 1| + C$$\n\nCheck: the derivative of $2\\ln|x - 1| + 3\\ln|x + 1|$ is $\\frac{2}{x - 1} + \\frac{3}{x + 1}$, which adds up to $\\frac{5x - 1}{(x - 1)(x + 1)}$.\n\n> **Watch out.** Keep the absolute values: $\\ln|x - 1|$ is an antiderivative of $\\frac{1}{x - 1}$ for $x < 1$ as well. And do not merge $2\\ln|x - 1| + 3\\ln|x + 1|$ into $5\\ln|(x - 1)(x + 1)|$: logarithms with different coefficients do not combine that way.",
        "把分式拆成几个简单分式后，每一项都是一次式的倒数，它的积分是对数：$\\int \\frac{A}{x - a} \\, dx = A\\ln|x - a| + C$。例如\n\n$$\\int \\frac{5x - 1}{(x - 1)(x + 1)} \\, dx = \\int \\left(\\frac{2}{x - 1} + \\frac{3}{x + 1}\\right) dx = 2\\ln|x - 1| + 3\\ln|x + 1| + C$$\n\n检验：$2\\ln|x - 1| + 3\\ln|x + 1|$ 的导数是 $\\frac{2}{x - 1} + \\frac{3}{x + 1}$，相加正是 $\\frac{5x - 1}{(x - 1)(x + 1)}$。\n\n> **注意。** 绝对值不能丢：当 $x < 1$ 时，$\\ln|x - 1|$ 同样是 $\\frac{1}{x - 1}$ 的原函数。也不要把 $2\\ln|x - 1| + 3\\ln|x + 1|$ 合并成 $5\\ln|(x - 1)(x + 1)|$：系数不同的对数不能这样合并。",
      ),
      generate(rng) {
        const [a, b] = distinctRoots(rng, -5, 5);
        const A = rng.nonZero(-6, 6);
        const B = rng.nonZero(-6, 6);
        const num = linear(A + B, -(A * b + B * a));
        const expanded = rng.bool();
        const den = expanded ? pLatex(pMul(root(a), root(b))) : `${fac(a)}${fac(b)}`;
        const answer = withC(poly([A, lnAbs(a)]), poly([B, lnAbs(b)]));
        const split = joinTerms([recip(A, a), recip(B, b)]);
        const derivative = `\\frac{d}{dx}\\left[${noC(answer)}\\right] = ${split} = \\frac{${num}}{${fac(a)}${fac(b)}}`;
        return integral(
          `\\frac{${num}}{${den}}`,
          answer,
          [
            withC(poly([B, lnAbs(a)]), poly([A, lnAbs(b)])),
            withC(poly([A, lnAbs(a)]), poly([-B, lnAbs(b)])),
            withC(poly([A + B, `\\ln|${pLatex(pMul(root(a), root(b)))}|`])),
          ],
          ...both(
            walked(
              [
                [
                  ["Split into partial fractions", "拆成部分分式"],
                  t(
                    `${expanded ? `The denominator factors as $${fac(a)}${fac(b)}$. ` : ""}Setting $x = ${a}$ and then $x = ${b}$ in $${num} = ${withLetter("A", b)} + ${withLetter("B", a)}$ gives $A = ${A}$ and $B = ${B}$:`,
                    `${expanded ? `分母分解为 $${fac(a)}${fac(b)}$。` : ""}在 $${num} = ${withLetter("A", b)} + ${withLetter("B", a)}$ 中先后令 $x = ${a}$、$x = ${b}$，得 $A = ${A}$，$B = ${B}$：`,
                  ),
                  [`\\frac{${num}}{${fac(a)}${fac(b)}} = ${split}`],
                ],
                [
                  ["Integrate each term", "逐项积分"],
                  t(
                    "Each term is a constant over a linear expression, so it integrates to a logarithm:",
                    "每一项都是常数除以一次式，积分为对数：",
                  ),
                  [`\\int \\frac{${num}}{${den}} \\, dx = ${answer}`],
                ],
              ],
              t(
                `Differentiate the answer. Each logarithm gives back its fraction, and the fractions add up to the integrand:${shown(derivative)}`,
                `对答案求导。每个对数都变回它的分式，这些分式相加正是被积函数：${shown(derivative)}`,
              ),
            ),
          ),
        );
      },
    },
    {
      id: "definite-integrals-with-partial-fractions",
      title: t("Definite integrals with partial fractions", "用部分分式计算定积分"),
      explanation: t(
        "Evaluate the logarithms at both limits and combine with $\\ln p - \\ln q = \\ln \\frac{p}{q}$. The interval must avoid the zeros of the denominator. For example,\n\n$$\\int_{0}^{1} \\frac{1}{(x + 1)(x + 2)} \\, dx = \\left[\\ln|x + 1| - \\ln|x + 2|\\right]_{0}^{1} = \\ln 2 - \\ln\\frac{3}{2} = \\ln\\frac{4}{3}$$\n\nCheck: the integrand is positive on $[0, 1]$, so the integral must be positive, and $\\ln\\frac{4}{3} > 0$ since $\\frac{4}{3} > 1$.\n\n> **Watch out.** If a zero of the denominator lies between the limits, the integral is improper and the logarithms cannot simply be evaluated at the ends. Here the zeros $-1$ and $-2$ lie outside $[0, 1]$.",
        "在上下限处计算对数，并用 $\\ln p - \\ln q = \\ln \\frac{p}{q}$ 合并。积分区间必须避开分母的零点。例如\n\n$$\\int_{0}^{1} \\frac{1}{(x + 1)(x + 2)} \\, dx = \\left[\\ln|x + 1| - \\ln|x + 2|\\right]_{0}^{1} = \\ln 2 - \\ln\\frac{3}{2} = \\ln\\frac{4}{3}$$\n\n检验：被积函数在 $[0, 1]$ 上为正，积分必须为正；由于 $\\frac{4}{3} > 1$，$\\ln\\frac{4}{3} > 0$。\n\n> **注意。** 如果分母的零点落在上下限之间，积分就是反常积分，不能直接在两端代入对数。这里的零点 $-1$ 和 $-2$ 都在 $[0, 1]$ 之外。",
      ),
      generate(rng) {
        const [a, b] = distinctRoots(rng, -5, -1);
        const A = rng.nonZero(-4, 4);
        const B = rng.nonZero(-4, 4);
        const x1 = rng.int(1, 4);
        const num = linear(A + B, -(A * b + B * a));
        const [ra, rb] = [Q.of(x1 - a, -a), Q.of(x1 - b, -b)];
        const answer = poly([A, lnRatio(ra)], [B, lnRatio(rb)]);
        const F = poly([A, lnAbs(a)], [B, lnAbs(b)]);
        const fraction = `\\frac{${num}}{${fac(a)}${fac(b)}}`;
        const derivative = `\\frac{d}{dx}\\left[${F}\\right] = ${joinTerms([recip(A, a), recip(B, b)])} = ${fraction}`;
        return exactValue(
          `\\int_{0}^{${x1}} ${fraction} \\, dx`,
          answer,
          [
            poly([B, lnRatio(ra)], [A, lnRatio(rb)]),
            poly([A, lnRatio(ra)], [-B, lnRatio(rb)]),
            poly([A, `\\ln ${x1 - a}`], [B, `\\ln ${x1 - b}`]),
          ],
          ...both(
            walked(
              [
                [
                  ["Split and integrate", "拆分并积分"],
                  t(
                    `Setting $x = ${a}$ and $x = ${b}$ in $${num} = ${withLetter("A", b)} + ${withLetter("B", a)}$ gives $A = ${A}$ and $B = ${B}$. Each partial fraction integrates to a logarithm:`,
                    `在 $${num} = ${withLetter("A", b)} + ${withLetter("B", a)}$ 中令 $x = ${a}$、$x = ${b}$，得 $A = ${A}$，$B = ${B}$。每个部分分式都积分为对数：`,
                  ),
                  [`\\int ${fraction} \\, dx = ${F} + C`],
                ],
                [
                  ["Evaluate at both limits", "在上下限处计算"],
                  t(
                    `The roots $${a}$ and $${b}$ lie outside $[0, ${x1}]$, so evaluate at the limits and combine the logarithms:`,
                    `根 $${a}$ 和 $${b}$ 都在 $[0, ${x1}]$ 之外，所以直接在上下限处计算，再合并对数：`,
                  ),
                  [`\\left[${F}\\right]_{0}^{${x1}} = ${lnAt(A, x1 - a, B, x1 - b)} - \\left(${lnAt(A, -a, B, -b)}\\right)`, `= ${answer}`],
                ],
              ],
              t(
                `Differentiate the antiderivative; it should give back the integrand:${shown(derivative)}`,
                `对原函数求导，应当得到被积函数：${shown(derivative)}`,
              ),
            ),
          ),
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
  intro: t(
    `A fraction over a squared factor splits with one term for each power: $\\frac{3x - 4}{(x - 2)^{2}}$ is $\\frac{3}{x - 2} + \\frac{2}{(x - 2)^{2}}$, since $3(x - 2) + 2$ is $3x - 4$.

Check: at $x = 3$ the fraction is $\\frac{5}{1}$, which is $5$, and the two terms give $3 + 2$, which is $5$ too.

In this lesson we integrate such sums. The term over $(x - a)^{2}$ integrates by the power rule to a reciprocal, not to a logarithm.`,
    `分母含平方因式的分式，每个幂各拆出一项：$\\frac{3x - 4}{(x - 2)^{2}}$ 等于 $\\frac{3}{x - 2} + \\frac{2}{(x - 2)^{2}}$，因为 $3(x - 2) + 2$ 就是 $3x - 4$。

检验：当 $x = 3$ 时，分式是 $\\frac{5}{1}$，即 $5$；两项给出 $3 + 2$，也是 $5$。

这节课我们求这类和的积分。$(x - a)^{2}$ 上的那一项用幂法则积分，得到倒数，而不是对数。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-over-a-squared-linear-factor",
      title: t("Integrating over a squared linear factor", "分母为一次因式平方的积分"),
      explanation: t(
        "A squared linear factor in the denominator integrates by the power rule, not to a logarithm, giving a reciprocal of the linear expression:\n\n$$\\int \\frac{B}{(x - a)^{2}} \\, dx = -\\frac{B}{x - a} + C$$\n\nFor example,\n\n$$\\int \\frac{3x - 4}{(x - 2)^{2}} \\, dx = \\int \\left(\\frac{3}{x - 2} + \\frac{2}{(x - 2)^{2}}\\right) dx = 3\\ln|x - 2| - \\frac{2}{x - 2} + C$$\n\nCheck: the derivative of $-\\frac{2}{x - 2}$ is $\\frac{2}{(x - 2)^{2}}$, the second partial fraction.\n\n> **Watch out.** $\\int \\frac{2}{(x - 2)^{2}} \\, dx$ is not $2\\ln(x - 2)^{2}$. Only the first power of $x - a$ in the denominator gives a logarithm.",
        "分母中的一次式平方要用幂法则积分，而不是得到对数，结果是一次式的倒数：\n\n$$\\int \\frac{B}{(x - a)^{2}} \\, dx = -\\frac{B}{x - a} + C$$\n\n例如\n\n$$\\int \\frac{3x - 4}{(x - 2)^{2}} \\, dx = \\int \\left(\\frac{3}{x - 2} + \\frac{2}{(x - 2)^{2}}\\right) dx = 3\\ln|x - 2| - \\frac{2}{x - 2} + C$$\n\n检验：$-\\frac{2}{x - 2}$ 的导数是 $\\frac{2}{(x - 2)^{2}}$，正是第二个部分分式。\n\n> **注意。** $\\int \\frac{2}{(x - 2)^{2}} \\, dx$ 不是 $2\\ln(x - 2)^{2}$。只有分母是 $x - a$ 的一次幂时，积分才是对数。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const A = rng.nonZero(-6, 6);
        const B = rng.nonZero(-9, 9);
        const num = linear(A, B - A * a);
        const answer = withC(poly([A, lnAbs(a)]), recip(-B, a));
        const split = joinTerms([recip(A, a), recip(B, a, 2)]);
        const derivative = `\\frac{d}{dx}\\left[${noC(answer)}\\right] = ${split}`;
        return integral(
          `\\frac{${num}}{${fac(a)}^{2}}`,
          answer,
          [
            withC(poly([A, lnAbs(a)]), recip(B, a)),
            withC(poly([A, lnAbs(a)]), poly([B, `\\ln|${bare(a)}|`])),
            withC(poly([B, lnAbs(a)]), recip(-A, a)),
          ],
          ...both(
            walked(
              [
                [
                  ["Split into partial fractions", "拆成部分分式"],
                  t(
                    `Write $${num} = A(${bare(a)}) + B$. The $x$ terms give $A = ${A}$, and setting $x = ${a}$ gives $B = ${B}$:`,
                    `写出 $${num} = A(${bare(a)}) + B$。比较 $x$ 的系数得 $A = ${A}$，令 $x = ${a}$ 得 $B = ${B}$：`,
                  ),
                  [`\\frac{${num}}{${fac(a)}^{2}} = ${split}`],
                ],
                [
                  ["Integrate each term", "逐项积分"],
                  t(
                    `The first term gives a logarithm. The second is $${cf(B)}(${bare(a)})^{-2}$, which the power rule integrates to $${recip(-B, a)}$:`,
                    `第一项积分为对数。第二项是 $${cf(B)}(${bare(a)})^{-2}$，用幂法则积分得 $${recip(-B, a)}$：`,
                  ),
                  [`\\int \\frac{${num}}{${fac(a)}^{2}} \\, dx = ${answer}`],
                ],
              ],
              t(
                `Differentiate the answer; it should give back the two partial fractions:${shown(derivative)}`,
                `对答案求导，应当得到这两个部分分式：${shown(derivative)}`,
              ),
            ),
          ),
        );
      },
    },
    {
      id: "integrating-with-repeated-and-distinct-factors",
      title: t("Integrating with repeated and distinct factors", "重因式与不同因式并存时的积分"),
      explanation: t(
        "Find $A$, $B$ and $C$ in $\\frac{A}{x - a} + \\frac{B}{(x - a)^{2}} + \\frac{C}{x - b}$, then integrate:\n\n$$A\\ln|x - a| - \\frac{B}{x - a} + C\\ln|x - b| + K$$\n\n(Here $K$ is the constant of integration, since $C$ is already in use.) For example, $\\frac{2x^{2} + 2}{(x - 1)^{2}(x + 1)}$ splits with $A = 1$, $B = 2$ and $C = 1$, so its integral is $\\ln|x - 1| - \\frac{2}{x - 1} + \\ln|x + 1| + K$.\n\nCheck: the derivative of $-\\frac{2}{x - 1}$ is $\\frac{2}{(x - 1)^{2}}$, and the two logarithms give $\\frac{1}{x - 1}$ and $\\frac{1}{x + 1}$, the other two partial fractions.\n\n> **Watch out.** Only $\\frac{A}{x - a}$ and $\\frac{C}{x - b}$ give logarithms. The term $\\frac{B}{(x - a)^{2}}$ integrates by the power rule to $-\\frac{B}{x - a}$.",
        "求出 $\\frac{A}{x - a} + \\frac{B}{(x - a)^{2}} + \\frac{C}{x - b}$ 中的 $A$、$B$、$C$，再积分：\n\n$$A\\ln|x - a| - \\frac{B}{x - a} + C\\ln|x - b| + K$$\n\n（这里积分常数记作 $K$，因为 $C$ 已被占用。）例如 $\\frac{2x^{2} + 2}{(x - 1)^{2}(x + 1)}$ 拆分后 $A = 1$，$B = 2$，$C = 1$，所以它的积分是 $\\ln|x - 1| - \\frac{2}{x - 1} + \\ln|x + 1| + K$。\n\n检验：$-\\frac{2}{x - 1}$ 的导数是 $\\frac{2}{(x - 1)^{2}}$，两个对数的导数是 $\\frac{1}{x - 1}$ 和 $\\frac{1}{x + 1}$，正是另外两个部分分式。\n\n> **注意。** 只有 $\\frac{A}{x - a}$ 和 $\\frac{C}{x - b}$ 积分为对数。$\\frac{B}{(x - a)^{2}}$ 一项用幂法则积分，得 $-\\frac{B}{x - a}$。",
      ),
      generate(rng) {
        const [a, b] = rng.shuffle(distinctRoots(rng, -3, 3)) as [number, number];
        const [A, B, C] = [rng.nonZero(-4, 4), rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
        const N = repeatedNumerator(a, b, A, B, C);
        const answer = withC(poly([A, lnAbs(a)]), recip(-B, a), poly([C, lnAbs(b)]));
        const integrand = `\\frac{${pLatex(N)}}{${fac(a)}^{2}${fac(b)}}`;
        const split = joinTerms([recip(A, a), recip(B, a, 2), recip(C, b)]);
        const derivative = `\\frac{d}{dx}\\left[${noC(answer)}\\right] = ${split}`;
        return integral(
          integrand,
          answer,
          [
            withC(poly([A, lnAbs(a)]), recip(B, a), poly([C, lnAbs(b)])),
            withC(poly([A + B, lnAbs(a)]), poly([C, lnAbs(b)])),
            withC(poly([C, lnAbs(a)]), recip(-B, a), poly([A, lnAbs(b)])),
          ],
          ...both(
            walked(
              [
                ...repeatedConstants(a, b, A, B, C, N).slice(0, 1),
                [
                  ["Find the constants", "求出常数"],
                  t(
                    `Setting $x = ${a}$ gives $B = ${B}$ and setting $x = ${b}$ gives $C = ${C}$; the $x^{2}$ coefficients give $A + C = ${A + C}$, so $A = ${A}$. The partial fractions are:`,
                    `令 $x = ${a}$ 得 $B = ${B}$，令 $x = ${b}$ 得 $C = ${C}$；比较 $x^{2}$ 的系数，$A + C = ${A + C}$，所以 $A = ${A}$。部分分式为：`,
                  ),
                  [`${integrand} = ${split}`],
                ],
                [
                  ["Integrate term by term", "逐项积分"],
                  t(
                    "The two simple terms give logarithms, and the squared term gives a reciprocal:",
                    "两个一次项积分为对数，平方项积分为倒数：",
                  ),
                  [`\\int ${integrand} \\, dx = ${answer}`],
                ],
              ],
              t(
                `Differentiate the answer; it should give back the three partial fractions:${shown(derivative)}`,
                `对答案求导，应当得到这三个部分分式：${shown(derivative)}`,
              ),
            ),
          ),
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
  intro: t(
    `A constant over $x^{2} + m^{2}$ integrates to an arctangent: with $x = 3u$, $\\int \\frac{1}{x^{2} + 9} \\, dx$ is $\\frac{1}{3}\\arctan\\frac{x}{3} + C$.

Check: by the chain rule the derivative of $\\frac{1}{3}\\arctan\\frac{x}{3}$ is $\\frac{1}{3} \\cdot \\frac{1}{3} \\cdot \\frac{1}{1 + x^{2}/9}$, which simplifies to $\\frac{1}{x^{2} + 9}$.

In this lesson we integrate fractions with a factor $x^{2} + m^{2}$. Its partial fraction $\\frac{Bx + C}{x^{2} + m^{2}}$ gives a logarithm from $Bx$ and an arctangent from $C$.`,
    `常数除以 $x^{2} + m^{2}$ 的积分是反正切：令 $x = 3u$，$\\int \\frac{1}{x^{2} + 9} \\, dx$ 等于 $\\frac{1}{3}\\arctan\\frac{x}{3} + C$。

检验：由链式法则，$\\frac{1}{3}\\arctan\\frac{x}{3}$ 的导数是 $\\frac{1}{3} \\cdot \\frac{1}{3} \\cdot \\frac{1}{1 + x^{2}/9}$，化简得 $\\frac{1}{x^{2} + 9}$。

这节课我们求含因式 $x^{2} + m^{2}$ 的分式的积分。它的部分分式 $\\frac{Bx + C}{x^{2} + m^{2}}$ 中，$Bx$ 给出对数，$C$ 给出反正切。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-over-x-times-a-quadratic",
      title: t("Integrating over x times a quadratic", "分母为 x 乘二次式的积分"),
      explanation: t(
        "A quadratic factor with no real roots gets a linear numerator, which splits into a logarithm part and an arctangent part:\n\n$$\\int \\frac{Bx + C}{x^{2} + m^{2}} \\, dx = \\frac{B}{2}\\ln(x^{2} + m^{2}) + \\frac{C}{m}\\arctan\\frac{x}{m} + K$$\n\nFor example,\n\n$$\\frac{3x^{2} + x + 4}{x(x^{2} + 4)} = \\frac{1}{x} + \\frac{2x + 1}{x^{2} + 4}$$\n\nThis integrates to $\\ln|x| + \\ln(x^{2} + 4) + \\frac{1}{2}\\arctan\\frac{x}{2} + K$.\n\nCheck: the derivative of $\\ln(x^{2} + 4)$ is $\\frac{2x}{x^{2} + 4}$, and the derivative of $\\frac{1}{2}\\arctan\\frac{x}{2}$ is $\\frac{1}{x^{2} + 4}$; together they give $\\frac{2x + 1}{x^{2} + 4}$.\n\n> **Watch out.** The logarithm has coefficient $\\frac{B}{2}$, not $B$, because the derivative of $x^{2} + m^{2}$ is $2x$. The arctangent has coefficient $\\frac{C}{m}$, with $\\frac{x}{m}$ inside.",
        "没有实根的二次因式对应一个一次分子，它可以拆成对数部分和反正切部分：\n\n$$\\int \\frac{Bx + C}{x^{2} + m^{2}} \\, dx = \\frac{B}{2}\\ln(x^{2} + m^{2}) + \\frac{C}{m}\\arctan\\frac{x}{m} + K$$\n\n例如\n\n$$\\frac{3x^{2} + x + 4}{x(x^{2} + 4)} = \\frac{1}{x} + \\frac{2x + 1}{x^{2} + 4}$$\n\n它的积分是 $\\ln|x| + \\ln(x^{2} + 4) + \\frac{1}{2}\\arctan\\frac{x}{2} + K$。\n\n检验：$\\ln(x^{2} + 4)$ 的导数是 $\\frac{2x}{x^{2} + 4}$，$\\frac{1}{2}\\arctan\\frac{x}{2}$ 的导数是 $\\frac{1}{x^{2} + 4}$，两者合起来是 $\\frac{2x + 1}{x^{2} + 4}$。\n\n> **注意。** 对数前的系数是 $\\frac{B}{2}$ 而不是 $B$，因为 $x^{2} + m^{2}$ 的导数是 $2x$。反正切前的系数是 $\\frac{C}{m}$，里面是 $\\frac{x}{m}$。",
      ),
      generate(rng) {
        return irreducibleIntegral(rng, 0);
      },
    },
    {
      id: "integrating-over-a-linear-factor-times-a-quadratic",
      title: t("Integrating over a linear factor times a quadratic", "分母为一次因式乘二次式的积分"),
      explanation: t(
        "The same steps work for $(x - a)(x^{2} + m^{2})$: find $A$ by setting $x = a$, find $B$ and $C$ by comparing coefficients, then integrate to $A\\ln|x - a| + \\frac{B}{2}\\ln(x^{2} + m^{2}) + \\frac{C}{m}\\arctan\\frac{x}{m} + K$. For example, for $\\frac{2x^{2}}{(x - 1)(x^{2} + 1)}$, setting $x = 1$ gives $2 = 2A$, so $A = 1$; the $x^{2}$ terms give $A + B = 2$, so $B = 1$; and the constant terms give $A - C = 0$, so $C = 1$. The integral is $\\ln|x - 1| + \\frac{1}{2}\\ln(x^{2} + 1) + \\arctan x + K$.\n\nCheck: at $x = 0$ the fraction is $0$, and the partial fractions $\\frac{1}{x - 1} + \\frac{x + 1}{x^{2} + 1}$ give $-1 + 1$, which is $0$ too.\n\n> **Watch out.** Setting $x = a$ finds only $A$; no real $x$ makes $x^{2} + m^{2}$ zero, so $B$ and $C$ must come from comparing coefficients.",
        "对 $(x - a)(x^{2} + m^{2})$ 步骤相同：令 $x = a$ 求 $A$，比较系数求 $B$ 和 $C$，再积分得 $A\\ln|x - a| + \\frac{B}{2}\\ln(x^{2} + m^{2}) + \\frac{C}{m}\\arctan\\frac{x}{m} + K$。例如对 $\\frac{2x^{2}}{(x - 1)(x^{2} + 1)}$，令 $x = 1$ 得 $2 = 2A$，$A = 1$；比较 $x^{2}$ 的系数，$A + B = 2$，$B = 1$；比较常数项，$A - C = 0$，$C = 1$。积分为 $\\ln|x - 1| + \\frac{1}{2}\\ln(x^{2} + 1) + \\arctan x + K$。\n\n检验：当 $x = 0$ 时分式为 $0$，部分分式 $\\frac{1}{x - 1} + \\frac{x + 1}{x^{2} + 1}$ 给出 $-1 + 1$，也是 $0$。\n\n> **注意。** 令 $x = a$ 只能求出 $A$；没有实数 $x$ 能使 $x^{2} + m^{2}$ 为零，所以 $B$ 和 $C$ 必须靠比较系数求出。",
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
  const irr = irreducible(c);
  const lnQ = `\\ln(${irr})`;
  const lnPart = poly([Q.of(B, 2), lnQ]);
  const atanPart = arctanTerm(Q.of(C, m), m);
  const overB = fracWith(B, "x", irr);
  const overC = fracWith(C, "", irr).replace("\\frac{}", "\\frac{1}");
  const answer = withC(poly([A, lnAbs(a)]), lnPart, atanPart);
  const integrand = `\\frac{${pLatex(N)}}{${fac(a)}(${irr})}`;
  const derivatives = [`\\frac{d}{dx}\\left[${lnPart}\\right] = ${overB}`, `\\frac{d}{dx}\\left[${atanPart}\\right] = ${overC}`];
  return integral(
    integrand,
    answer,
    [
      withC(poly([A, lnAbs(a)]), poly([B, lnQ]), atanPart),
      withC(poly([A, lnAbs(a)]), lnPart, arctanTerm(Q.of(C), m)),
      withC(poly([A, lnAbs(a)]), poly([Q.of(C, 2), lnQ]), arctanTerm(Q.of(B, m), m)),
    ],
    ...both(
      walked(
        [
          [
            ["Split into partial fractions", "拆成部分分式"],
            t(
              `Setting $x = ${a}$ gives $A = ${A}$, and comparing the coefficients of $x^{2}$ and $x$ gives $B = ${B}$ and $C = ${C}$:`,
              `令 $x = ${a}$ 得 $A = ${A}$，比较 $x^{2}$ 和 $x$ 的系数得 $B = ${B}$，$C = ${C}$：`,
            ),
            [`${integrand} = ${joinTerms([recip(A, a), `\\frac{${linear(B, C)}}{${irr}}`])}`],
          ],
          [
            ["Split the quadratic term", "拆开二次因式那一项"],
            t(
              `The $x$ part of the numerator gives a logarithm, since $2x$ is the derivative of $${irr}$; the constant part gives an arctangent:`,
              `分子中含 $x$ 的部分积分为对数，因为 $2x$ 是 $${irr}$ 的导数；常数部分积分为反正切：`,
            ),
            [`\\int ${overB} \\, dx = ${lnPart} + C`, `\\int ${overC} \\, dx = ${atanPart} + C`],
          ],
          [
            ["Add the pieces", "把各部分相加"],
            t(`Add the logarithm from the term over $${fac(a)}$:`, `再加上 $${fac(a)}$ 那一项的对数：`),
            [`\\int ${integrand} \\, dx = ${answer}`],
          ],
        ],
        t(
          `Differentiate the two pieces from the quadratic term; they should give back its two parts:${shown(...derivatives)}`,
          `对二次因式那一项的两部分分别求导，应当得到它原来的两部分：${shown(...derivatives)}`,
        ),
      ),
    ),
  );
}

/** converges writes the choice "Converges to v". */
const converges = (v: string): Text => t(`Converges to $${v}$`, `收敛于 $${v}$`);

/** diverges is the choice "Diverges". */
const diverges = t("Diverges", "发散");

/** Option is a wrong option of a convergence question, with what is wrong with it in English and Chinese. */
type Option = readonly [option: Text, en: string, zh: string];

/** convergenceProblem asks whether an improper integral converges and to what, saying what is wrong with each wrong option. */
function convergenceProblem(rng: Rng, integralLatex: string, right: Text, wrong: readonly Option[], solution: Text) {
  const problem = oneOf(
    rng,
    t(`Does $${integralLatex}$ converge? If so, to what value?`, `$${integralLatex}$ 是否收敛？若收敛，收敛于何值？`),
    right,
    wrong.map(([o]) => o),
    solution,
  );
  return reasoned(
    problem,
    wrong.map(([o, en, zh]) => [o.en, en, zh]),
  );
}

/** xPower writes x^p for a positive rational p as it would appear in a denominator. */
const xPower = (p: Q, v = "x") => (p.eq(Q.of(1, 2)) ? `\\sqrt{${v}}` : p.eq(Q.one) ? v : `${v}^{${expLatex(p)}}`);

/** expLatex writes a positive rational exponent: "2", "3/2". */
const expLatex = (q: Q) => (q.isInteger() ? q.toLatex() : `${q.n}/${q.d}`);

/** pChoices are the exponents used in p-test questions. */
const pChoices = [Q.of(1, 2), Q.of(1, 3), Q.one, Q.of(3, 2), Q.of(2), Q.of(3), Q.of(4, 3), Q.of(2, 3), Q.of(5, 2)];

/** powOf writes v^e, leaving the exponent 1 out. */
const powOf = (v: string, e: number) => (e === 1 ? v : `${v}^{${e}}`);

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
  intro: t(
    `The fundamental theorem evaluates a definite integral from an antiderivative: $\\int_{1}^{4} \\frac{1}{x^{2}} \\, dx$ is $\\left[-\\frac{1}{x}\\right]_{1}^{4}$, which is $-\\frac{1}{4} + 1$, or $\\frac{3}{4}$.

Check: on $[1, 4]$ the integrand lies between $\\frac{1}{16}$ and $1$, and the interval has length $3$, so the value must lie between $\\frac{3}{16}$ and $3$; $\\frac{3}{4}$ does.

In this lesson we let the upper limit grow without bound, define the integral over $[a, \\infty)$ as a limit, and find which powers $\\frac{1}{x^{p}}$ leave a finite area.`,
    `微积分基本定理用原函数计算定积分：$\\int_{1}^{4} \\frac{1}{x^{2}} \\, dx$ 等于 $\\left[-\\frac{1}{x}\\right]_{1}^{4}$，即 $-\\frac{1}{4} + 1$，也就是 $\\frac{3}{4}$。

检验：在 $[1, 4]$ 上，被积函数介于 $\\frac{1}{16}$ 与 $1$ 之间，区间长度为 $3$，所以积分值应在 $\\frac{3}{16}$ 与 $3$ 之间；$\\frac{3}{4}$ 正是如此。

这节课我们让上限无限增大，把 $[a, \\infty)$ 上的积分定义为极限，并找出哪些幂 $\\frac{1}{x^{p}}$ 下的面积是有限的。`,
  ),
  knowledgePoints: [
    {
      id: "evaluating-integrals-over-infinite-intervals",
      title: t("Evaluating integrals over infinite intervals", "计算无穷区间上的积分"),
      explanation: t(
        "An integral with an infinite limit is defined as a limit:\n\n$$\\int_{a}^{\\infty} f(x) \\, dx = \\lim_{t \\to \\infty} \\int_{a}^{t} f(x) \\, dx$$\n\nIt converges if the limit exists. For example,\n\n$$\\int_{1}^{\\infty} \\frac{1}{x^{2}} \\, dx = \\lim_{t \\to \\infty}\\left(1 - \\frac{1}{t}\\right) = 1$$\n\nCheck: the integral up to $t$, $1 - \\frac{1}{t}$, stays below $1$ for every $t$ and gets as close to $1$ as we like.\n\n> **Watch out.** An integrand that tends to $0$ does not make the integral converge: $\\int_{1}^{\\infty} \\frac{1}{x} \\, dx$ diverges, although $\\frac{1}{x} \\to 0$. What matters is whether the integral up to $t$ has a limit.",
        "积分限为无穷时，积分定义为极限：\n\n$$\\int_{a}^{\\infty} f(x) \\, dx = \\lim_{t \\to \\infty} \\int_{a}^{t} f(x) \\, dx$$\n\n极限存在时称积分收敛。例如\n\n$$\\int_{1}^{\\infty} \\frac{1}{x^{2}} \\, dx = \\lim_{t \\to \\infty}\\left(1 - \\frac{1}{t}\\right) = 1$$\n\n检验：积到 $t$ 的积分 $1 - \\frac{1}{t}$ 对每个 $t$ 都小于 $1$，而且可以任意接近 $1$。\n\n> **注意。** 被积函数趋于 $0$ 并不能保证积分收敛：虽然 $\\frac{1}{x} \\to 0$，$\\int_{1}^{\\infty} \\frac{1}{x} \\, dx$ 却发散。关键在于积到 $t$ 的积分有没有极限。",
      ),
      generate(rng) {
        const p = rng.int(2, 4);
        const a = rng.int(1, 3);
        const k = rng.nonZero(-9, 9);
        const value = Q.of(k, (p - 1) * a ** (p - 1));
        const f = fracWith(k, "", `x^{${p}}`).replace("\\frac{}", "\\frac{1}");
        const anti = (v: string) => fracTerm(Q.of(-k, p - 1), "", powOf(v, p - 1)).replace("\\frac{}", "\\frac{1}");
        const upToT = joinTerms([anti("t"), value.toLatex()]);
        const I = `\\int_{${a}}^{\\infty} ${f} \\, dx`;
        const formula = `\\frac{${k}}{(${p} - 1) \\cdot ${a}^{${p - 1}}} = ${value.toLatex()}`;
        return exactValue(
          I,
          value.toLatex(),
          [Q.of(k, p - 1).toLatex(), value.neg().toLatex(), Q.of(k, p * a ** p).toLatex()],
          ...both(
            walked(
              [
                [
                  ["Write the integral as a limit", "把积分写成极限"],
                  t("Integrate up to a finite $t$ and let $t$ grow:", "先积到有限的 $t$，再让 $t$ 增大："),
                  [`${I} = \\lim_{t \\to \\infty} \\int_{${a}}^{t} ${f} \\, dx`],
                ],
                [
                  ["Integrate up to t", "积到 t"],
                  t("By the power rule:", "由幂法则："),
                  [`\\int_{${a}}^{t} ${f} \\, dx = \\left[${anti("x")}\\right]_{${a}}^{t} = ${upToT}`],
                ],
                [
                  ["Take the limit", "取极限"],
                  t(
                    `As $t \\to \\infty$, $${powOf("t", p - 1)}$ grows without bound, so the term with $t$ tends to $0$:`,
                    `当 $t \\to \\infty$ 时，$${powOf("t", p - 1)}$ 无限增大，所以含 $t$ 的项趋于 $0$：`,
                  ),
                  [`${I} = \\lim_{t \\to \\infty}\\left(${upToT}\\right) = ${value.toLatex()}`],
                ],
              ],
              t(
                `For $p > 1$, $\\int_{a}^{\\infty} \\frac{k}{x^{p}} \\, dx$ is $\\frac{k}{(p - 1)a^{p - 1}}$. With $k = ${k}$, $p = ${p}$ and $a = ${a}$:${shown(formula)}`,
                `当 $p > 1$ 时，$\\int_{a}^{\\infty} \\frac{k}{x^{p}} \\, dx$ 等于 $\\frac{k}{(p - 1)a^{p - 1}}$。代入 $k = ${k}$，$p = ${p}$，$a = ${a}$：${shown(formula)}`,
              ),
            ),
          ),
        );
      },
    },
    {
      id: "the-p-test-for-integrals-over-infinite-intervals",
      title: t("The p-test for integrals over infinite intervals", "无穷区间积分的 p 判别法"),
      explanation: t(
        "$\\int_{1}^{\\infty} \\frac{1}{x^{p}} \\, dx$ converges to $\\frac{1}{p - 1}$ when $p > 1$ and diverges when $p \\le 1$. For $p < 1$ the antiderivative $\\frac{x^{1 - p}}{1 - p}$ grows without bound, and for $p = 1$ the antiderivative $\\ln x$ does too. For example, $\\int_{1}^{\\infty} \\frac{1}{x^{3}} \\, dx$ converges to $\\frac{1}{2}$, while $\\int_{1}^{\\infty} \\frac{1}{\\sqrt{x}} \\, dx$ diverges.\n\nCheck: $\\int_{1}^{t} x^{-3} \\, dx$ is $\\frac{1}{2} - \\frac{1}{2t^{2}}$, which tends to $\\frac{1}{2}$; and $\\int_{1}^{t} x^{-1/2} \\, dx$ is $2\\sqrt{t} - 2$, which grows without bound.\n\n> **Watch out.** The boundary case $p = 1$ diverges: $\\int_{1}^{t} \\frac{1}{x} \\, dx$ is $\\ln t$. Mind the direction too: on $[1, \\infty)$ the large powers converge, while near $0$ it is the small powers that converge.",
        "当 $p > 1$ 时 $\\int_{1}^{\\infty} \\frac{1}{x^{p}} \\, dx$ 收敛于 $\\frac{1}{p - 1}$；当 $p \\le 1$ 时发散。$p < 1$ 时原函数 $\\frac{x^{1 - p}}{1 - p}$ 无界增长，$p = 1$ 时原函数 $\\ln x$ 也无界增长。例如 $\\int_{1}^{\\infty} \\frac{1}{x^{3}} \\, dx$ 收敛于 $\\frac{1}{2}$，而 $\\int_{1}^{\\infty} \\frac{1}{\\sqrt{x}} \\, dx$ 发散。\n\n检验：$\\int_{1}^{t} x^{-3} \\, dx$ 等于 $\\frac{1}{2} - \\frac{1}{2t^{2}}$，趋于 $\\frac{1}{2}$；$\\int_{1}^{t} x^{-1/2} \\, dx$ 等于 $2\\sqrt{t} - 2$，无界增长。\n\n> **注意。** 临界情形 $p = 1$ 发散：$\\int_{1}^{t} \\frac{1}{x} \\, dx$ 等于 $\\ln t$。还要注意方向：在 $[1, \\infty)$ 上幂次大的收敛，而在 $0$ 附近是幂次小的收敛。",
      ),
      generate(rng) {
        const p = rng.pick(pChoices);
        const k = rng.nonZero(-9, 9);
        const f = fracWith(k, "", xPower(p)).replace("\\frac{}", "\\frac{1}");
        const integralLatex = `\\int_{1}^{\\infty} ${f} \\, dx`;
        if (p.cmp(Q.one) > 0) {
          const v = Q.of(k).div(p.sub(Q.one));
          const r = Q.one.div(p.sub(Q.one));
          const anti = (x: string) => fracTerm(v.neg(), "", xPower(p.sub(Q.one), x)).replace("\\frac{}", "\\frac{1}");
          const upToT = joinTerms([anti("t"), v.toLatex()]);
          return convergenceProblem(
            rng,
            integralLatex,
            converges(v.toLatex()),
            [
              [
                diverges,
                `For $p > 1$ the term $${anti("t")}$ tends to $0$ as $t \\to \\infty$, so the limit exists and the integral converges.`,
                `当 $p > 1$ 时，$t \\to \\infty$ 时 $${anti("t")}$ 趋于 $0$，极限存在，积分收敛。`,
              ],
              [
                converges(v.neg().toLatex()),
                `The sign is reversed. The integrand is ${k > 0 ? "positive" : "negative"} on $[1, \\infty)$, so the value must be too.`,
                `符号反了。被积函数在 $[1, \\infty)$ 上为${k > 0 ? "正" : "负"}，积分值也应为${k > 0 ? "正" : "负"}。`,
              ],
              [
                converges(Q.of(k).div(p).toLatex()),
                "This divides by $p$. The power rule divides by the new exponent $1 - p$, and with the sign from $-\\frac{1}{x^{p - 1}}$ that gives $p - 1$.",
                "这里除以了 $p$。幂法则要除以新的指数 $1 - p$，再结合 $-\\frac{1}{x^{p - 1}}$ 中的负号，得到的是除以 $p - 1$。",
              ],
            ],
            walked(
              [
                [
                  ["Compare p with 1", "比较 p 与 1"],
                  t(
                    `The integrand is $${coef(Q.of(k))}x^{-p}$ with $p = ${p.toLatex()}$. Since $p > 1$, the integral converges.`,
                    `被积函数是 $${coef(Q.of(k))}x^{-p}$，其中 $p = ${p.toLatex()}$。由于 $p > 1$，积分收敛。`,
                  ),
                ],
                [
                  ["Find the value", "求出积分值"],
                  t(
                    "Integrate up to $t$ by the power rule, then let $t \\to \\infty$; the term with $t$ tends to $0$:",
                    "用幂法则积到 $t$，再令 $t \\to \\infty$；含 $t$ 的项趋于 $0$：",
                  ),
                  [
                    `${integralLatex} = \\lim_{t \\to \\infty}\\left[${anti("x")}\\right]_{1}^{t}`,
                    `= \\lim_{t \\to \\infty}\\left(${upToT}\\right) = ${v.toLatex()}`,
                  ],
                ],
              ],
              t(
                `The $p$-test gives $\\int_{1}^{\\infty} x^{-p} \\, dx$ as $\\frac{1}{p - 1}$. ${k === 1 ? `With $p = ${p.toLatex()}$:${shown(`\\frac{1}{${p.toLatex()} - 1} = ${r.toLatex()}`)}` : `Multiply by $${k}$:${shown(`\\frac{1}{${p.toLatex()} - 1} = ${r.toLatex()}`, `${lead(k)}${r.toLatex()} = ${v.toLatex()}`)}`}`,
                `由 $p$ 判别法，$\\int_{1}^{\\infty} x^{-p} \\, dx$ 等于 $\\frac{1}{p - 1}$。${k === 1 ? `代入 $p = ${p.toLatex()}$：${shown(`\\frac{1}{${p.toLatex()} - 1} = ${r.toLatex()}`)}` : `再乘以 $${k}$：${shown(`\\frac{1}{${p.toLatex()} - 1} = ${r.toLatex()}`, `${lead(k)}${r.toLatex()} = ${v.toLatex()}`)}`}`,
              ),
            ),
          );
        }
        const one = p.eq(Q.one);
        const c = one ? Q.of(0) : Q.of(k).div(Q.one.sub(p));
        const e = expLatex(Q.one.sub(p));
        const upToT = one ? poly([k, "\\ln t"]) : joinTerms([`${coef(c)}t^{${e}}`, c.neg().toLatex()]);
        const grows = one ? "\\ln t" : `t^{${e}}`;
        const wrong: readonly Option[] = one
          ? [
              [
                converges("0"),
                "$\\ln t$ grows without bound. The value $0$ is only $\\ln 1$, the antiderivative at the lower limit.",
                "$\\ln t$ 无界增长。$0$ 只是原函数在下限处的值 $\\ln 1$。",
              ],
              [
                converges(String(k)),
                `This is only the coefficient. The antiderivative $${poly([k, "\\ln x"])}$ has no finite limit as $x \\to \\infty$.`,
                `这只是系数。当 $x \\to \\infty$ 时，原函数 $${poly([k, "\\ln x"])}$ 没有有限的极限。`,
              ],
              [
                converges(String(-k)),
                `The antiderivative $${poly([k, "\\ln x"])}$ has no finite limit as $x \\to \\infty$, so no finite value is right.`,
                `当 $x \\to \\infty$ 时，原函数 $${poly([k, "\\ln x"])}$ 没有有限的极限，任何有限值都不对。`,
              ],
            ]
          : [
              [
                converges(c.toLatex()),
                "This is the value of the same integral from $0$ to $1$, where $p < 1$ converges. On $[1, \\infty)$ a power $p < 1$ diverges.",
                "这是同一个积分在 $0$ 到 $1$ 上的值，那里 $p < 1$ 收敛。在 $[1, \\infty)$ 上，$p < 1$ 发散。",
              ],
              [
                converges(c.neg().toLatex()),
                "This uses $\\frac{1}{p - 1}$, which holds only for $p > 1$. Here $p < 1$ and the integral diverges.",
                "这里用了 $\\frac{1}{p - 1}$，它只在 $p > 1$ 时成立。这里 $p < 1$，积分发散。",
              ],
              [
                converges(String(k)),
                `This is only the coefficient. The term $${coef(c)}t^{${e}}$ grows without bound, so the integral diverges.`,
                `这只是系数。$${coef(c)}t^{${e}}$ 一项无界增长，所以积分发散。`,
              ],
            ];
        return convergenceProblem(
          rng,
          integralLatex,
          diverges,
          wrong,
          walked(
            [
              [
                ["Compare p with 1", "比较 p 与 1"],
                t(
                  `The integrand is $${coef(Q.of(k))}x^{-p}$ with $p = ${p.toLatex()} \\le 1$, so the integral should diverge. Confirm it with the limit.`,
                  `被积函数是 $${coef(Q.of(k))}x^{-p}$，其中 $p = ${p.toLatex()} \\le 1$，积分应当发散。下面用极限来确认。`,
                ),
              ],
              [
                ["Integrate up to t", "积到 t"],
                t(
                  one ? "An antiderivative is a multiple of $\\ln x$, and $\\ln 1 = 0$:" : "By the power rule:",
                  one ? "原函数是 $\\ln x$ 的倍数，且 $\\ln 1 = 0$：" : "由幂法则：",
                ),
                [`\\int_{1}^{t} ${f} \\, dx = ${upToT}`],
              ],
              [
                ["Take the limit", "取极限"],
                t(
                  `As $t \\to \\infty$, $${grows}$ grows without bound, so the integral up to $t$ has no finite limit. The integral diverges.`,
                  `当 $t \\to \\infty$ 时，$${grows}$ 无界增长，积到 $t$ 的积分没有有限的极限。积分发散。`,
                ),
              ],
            ],
            one
              ? t(
                  `Take $t = e^{n}$: the integral up to $t$ is $${poly([k, "n"])}$, which is unbounded as $n$ grows.`,
                  `取 $t = e^{n}$：积到 $t$ 的积分是 $${poly([k, "n"])}$，随 $n$ 增大而无界。`,
                )
              : t(
                  `Compare with $\\frac{1}{x}$. For $x \\ge 1$ and $p < 1$, $x^{p} \\le x$, so $\\frac{1}{x^{p}} \\ge \\frac{1}{x}$; and the area under $\\frac{1}{x}$ from $1$ to $t$ is $\\ln t$, which already grows without bound.`,
                  `与 $\\frac{1}{x}$ 比较。当 $x \\ge 1$ 且 $p < 1$ 时，$x^{p} \\le x$，所以 $\\frac{1}{x^{p}} \\ge \\frac{1}{x}$；而 $\\frac{1}{x}$ 从 $1$ 到 $t$ 下的面积是 $\\ln t$，它已经无界增长。`,
                ),
          ),
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
  intro: t(
    `An integral over an infinite interval is a limit: $\\int_{1}^{\\infty} \\frac{1}{x^{2}} \\, dx$ is the limit of $1 - \\frac{1}{t}$ as $t \\to \\infty$, which is $1$.

Check: $\\frac{1}{x^{2}}$ is $x^{-p}$ with $p = 2 > 1$, so the $p$-test also says it converges, to $\\frac{1}{p - 1}$, which is $1$.

In this lesson we integrate decaying exponentials such as $e^{-2x}$, and powers times them such as $xe^{-2x}$, out to infinity.`,
    `无穷区间上的积分是极限：$\\int_{1}^{\\infty} \\frac{1}{x^{2}} \\, dx$ 是 $t \\to \\infty$ 时 $1 - \\frac{1}{t}$ 的极限，即 $1$。

检验：$\\frac{1}{x^{2}}$ 是 $x^{-p}$，$p = 2 > 1$，由 $p$ 判别法它也收敛，收敛于 $\\frac{1}{p - 1}$，即 $1$。

这节课我们把衰减的指数函数（如 $e^{-2x}$）以及幂与它的乘积（如 $xe^{-2x}$）一直积到无穷。`,
  ),
  knowledgePoints: [
    {
      id: "improper-integrals-of-exponentials",
      title: t("Improper integrals of exponentials", "指数函数的反常积分"),
      explanation: t(
        "An integral to infinity is the limit of integrals over longer and longer intervals, and a decaying exponential makes that limit finite. For $a > 0$, $e^{-at} \\to 0$ as $t \\to \\infty$, so\n\n$$\\int_{b}^{\\infty} e^{-ax} \\, dx = \\lim_{t \\to \\infty}\\left[-\\frac{1}{a}e^{-ax}\\right]_{b}^{t} = \\frac{1}{a}e^{-ab}$$\n\nLikewise $\\int_{-\\infty}^{b} e^{ax} \\, dx$ is $\\frac{1}{a}e^{ab}$. For example, $\\int_{1}^{\\infty} e^{-2x} \\, dx$ is $\\frac{1}{2}e^{-2}$.\n\nCheck: the derivative of $-\\frac{1}{2}e^{-2x}$ is $e^{-2x}$, so the antiderivative is right, and it tends to $0$ at infinity.\n\n> **Watch out.** The sign of the exponent decides convergence: $\\int_{0}^{\\infty} e^{ax} \\, dx$ with $a > 0$ diverges, because $e^{at}$ grows without bound.",
        "积到无穷的积分是区间越来越长时积分的极限，衰减的指数式使这个极限是有限的。当 $a > 0$ 时，$t \\to \\infty$ 时 $e^{-at} \\to 0$，所以\n\n$$\\int_{b}^{\\infty} e^{-ax} \\, dx = \\lim_{t \\to \\infty}\\left[-\\frac{1}{a}e^{-ax}\\right]_{b}^{t} = \\frac{1}{a}e^{-ab}$$\n\n同理 $\\int_{-\\infty}^{b} e^{ax} \\, dx$ 等于 $\\frac{1}{a}e^{ab}$。例如 $\\int_{1}^{\\infty} e^{-2x} \\, dx$ 等于 $\\frac{1}{2}e^{-2}$。\n\n检验：$-\\frac{1}{2}e^{-2x}$ 的导数是 $e^{-2x}$，原函数正确，而且它在无穷远处趋于 $0$。\n\n> **注意。** 指数的符号决定是否收敛：$a > 0$ 时 $\\int_{0}^{\\infty} e^{ax} \\, dx$ 发散，因为 $e^{at}$ 无界增长。",
      ),
      generate(rng) {
        const a = rng.int(1, 4);
        const b = rng.int(0, 3);
        const k = rng.nonZero(-9, 9);
        const right = rng.bool();
        const e = (n: number) => (n === 0 ? "" : `e^{${n}}`);
        const exp = -a * b;
        const value = b === 0 ? Q.of(k, a).toLatex() : `${coef(Q.of(k, a))}${e(exp)}`;
        const aa = a === 1 ? "" : String(a);
        const g = `${coef(Q.of(k))}e^{${right ? "-" : ""}${aa}x}`;
        const F = (v: string) => `${coef(Q.of(right ? -k : k, a))}e^{${right ? "-" : ""}${aa}${v}}`;
        const upToT = right ? joinTerms([F("t"), value]) : joinTerms([value, `${coef(Q.of(-k, a))}e^{${aa}t}`]);
        const I = right ? `\\int_{${b}}^{\\infty} ${g} \\, dx` : `\\int_{-\\infty}^{${-b}} ${g} \\, dx`;
        const part = right
          ? `\\int_{${b}}^{t} ${g} \\, dx = \\left[${F("x")}\\right]_{${b}}^{t} = ${upToT}`
          : `\\int_{t}^{${-b}} ${g} \\, dx = \\left[${F("x")}\\right]_{t}^{${-b}} = ${upToT}`;
        const derivative = `\\frac{d}{dx}\\left[${F("x")}\\right] = ${g}`;
        return exactValue(
          I,
          value,
          [
            b === 0 ? String(k) : `${coef(Q.of(k))}${e(exp)}`,
            b === 0 ? Q.of(-k, a).toLatex() : `${coef(Q.of(-k, a))}${e(exp)}`,
            b === 0 ? Q.of(k * a).toLatex() : `${coef(Q.of(k, a))}${e(-exp)}`,
          ],
          ...both(
            walked(
              [
                [
                  ["Integrate up to t", "积到 t"],
                  t(
                    `Replace the infinite limit by $t$. An antiderivative of $${g}$ is $${F("x")}$:`,
                    `把无穷的积分限换成 $t$。$${g}$ 的一个原函数是 $${F("x")}$：`,
                  ),
                  [part],
                ],
                [
                  ["Take the limit", "取极限"],
                  t(
                    `As $t \\to ${right ? "" : "-"}\\infty$, $e^{${right ? "-" : ""}${aa}t} \\to 0$, so only the value at $x = ${right ? b : -b}$ is left:`,
                    `当 $t \\to ${right ? "" : "-"}\\infty$ 时，$e^{${right ? "-" : ""}${aa}t} \\to 0$，只剩下 $x = ${right ? b : -b}$ 处的值：`,
                  ),
                  [`${I} = \\lim_{t \\to ${right ? "" : "-"}\\infty}\\left(${upToT}\\right) = ${value}`],
                ],
              ],
              t(
                `Differentiate the antiderivative; it should give back the integrand:${shown(derivative)}`,
                `对原函数求导，应当得到被积函数：${shown(derivative)}`,
              ),
            ),
          ),
        );
      },
    },
    {
      id: "improper-integrals-of-powers-times-exponentials",
      title: t("Improper integrals of powers times exponentials", "幂函数乘指数函数的反常积分"),
      explanation: t(
        "Integrate by parts, then use the fact that $e^{-ax}$ beats any power: $x^{n}e^{-ax} \\to 0$ as $x \\to \\infty$. For example,\n\n$$\\int_{0}^{\\infty} xe^{-2x} \\, dx = \\left[-\\frac{x}{2}e^{-2x}\\right]_{0}^{\\infty} + \\frac{1}{2}\\int_{0}^{\\infty} e^{-2x} \\, dx = 0 + \\frac{1}{4}$$\n\nIn general $\\int_{0}^{\\infty} x^{n}e^{-ax} \\, dx = \\frac{n!}{a^{n + 1}}$.\n\nCheck: the general formula with $n = 1$ and $a = 2$ gives $\\frac{1!}{2^{2}}$, which is $\\frac{1}{4}$.\n\n> **Watch out.** The boundary term vanishes at both ends, but for different reasons: at $0$ because of the factor $x$, and at infinity because the exponential shrinks faster than the power grows.",
        "先分部积分，再利用 $e^{-ax}$ 比任何幂都衰减得快：$x \\to \\infty$ 时 $x^{n}e^{-ax} \\to 0$。例如\n\n$$\\int_{0}^{\\infty} xe^{-2x} \\, dx = \\left[-\\frac{x}{2}e^{-2x}\\right]_{0}^{\\infty} + \\frac{1}{2}\\int_{0}^{\\infty} e^{-2x} \\, dx = 0 + \\frac{1}{4}$$\n\n一般地，$\\int_{0}^{\\infty} x^{n}e^{-ax} \\, dx = \\frac{n!}{a^{n + 1}}$。\n\n检验：在一般公式中取 $n = 1$，$a = 2$，得 $\\frac{1!}{2^{2}}$，即 $\\frac{1}{4}$。\n\n> **注意。** 边界项在两端都为零，但原因不同：在 $0$ 处是因为有因子 $x$，在无穷远处是因为指数函数衰减得比幂增长得快。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const n = rng.int(1, 2);
        const k = rng.nonZero(-6, 6);
        const fact = n === 1 ? 1 : 2;
        const value = Q.of(k * fact, a ** (n + 1));
        const aa = a === 1 ? "" : String(a);
        const ex = `e^{-${aa}x}`;
        const xn = n === 1 ? "x" : "x^{2}";
        const over = (top: string) => (a === 1 ? top : `\\frac{${top}}{${a}}`);
        const I = Q.of(fact, a ** (n + 1));
        const parts = `\\int_{0}^{\\infty} ${xn}${ex} \\, dx = \\left[-${over(xn)}${ex}\\right]_{0}^{\\infty} + ${coef(Q.of(n, a))}\\int_{0}^{\\infty} ${n === 1 ? "" : "x"}${ex} \\, dx`;
        const result =
          n === 1
            ? `\\int_{0}^{\\infty} x${ex} \\, dx = ${coef(Q.of(1, a))}\\int_{0}^{\\infty} ${ex} \\, dx = ${I.toLatex()}`
            : `\\int_{0}^{\\infty} x^{2}${ex} \\, dx = ${coef(Q.of(2, a))}\\int_{0}^{\\infty} x${ex} \\, dx = ${I.toLatex()}`;
        const inner =
          n === 1
            ? t(
                ` and $\\int_{0}^{\\infty} ${ex} \\, dx = ${Q.of(1, a).toLatex()}$`,
                `，并且 $\\int_{0}^{\\infty} ${ex} \\, dx = ${Q.of(1, a).toLatex()}$`,
              )
            : t(
                `, and integrating by parts once more in the same way gives $\\int_{0}^{\\infty} x${ex} \\, dx = ${Q.of(1, a * a).toLatex()}$`,
                `；同样再分部积分一次，得 $\\int_{0}^{\\infty} x${ex} \\, dx = ${Q.of(1, a * a).toLatex()}$`,
              );
        const stepsList: Step[] = [
          [
            ["Integrate by parts", "分部积分"],
            t(
              `Work with $\\int_{0}^{\\infty} ${xn}${ex} \\, dx$ first. Take $u = ${xn}$ and $dv = ${ex} \\, dx$:`,
              `先计算 $\\int_{0}^{\\infty} ${xn}${ex} \\, dx$。取 $u = ${xn}$，$dv = ${ex} \\, dx$：`,
            ),
            [parts],
          ],
          [
            ["Drop the boundary term", "去掉边界项"],
            t(
              `The bracket is $0$ at $x = 0$, and it tends to $0$ as $x \\to \\infty$ because $${ex}$ shrinks faster than any power of $x$ grows${inner.en}. So:`,
              `方括号在 $x = 0$ 处为 $0$；当 $x \\to \\infty$ 时也趋于 $0$，因为 $${ex}$ 衰减得比 $x$ 的任何幂增长得快${inner["zh-CN"]}。所以：`,
            ),
            [result],
          ],
        ];
        if (k !== 1 && `${lead(k)}${I.toLatex()}` === value.toLatex())
          stepsList.push([
            ["Multiply by the constant", "乘以常数"],
            t(
              `The integrand has the factor $${k}$ in front, so the value is $${value.toLatex()}$.`,
              `被积函数前面有因子 $${k}$，所以积分值是 $${value.toLatex()}$。`,
            ),
          ]);
        else if (k !== 1)
          stepsList.push([
            ["Multiply by the constant", "乘以常数"],
            t(`The integrand has the factor $${k}$ in front:`, `被积函数前面有因子 $${k}$：`),
            [`${lead(k)}${I.toLatex()} = ${value.toLatex()}`],
          ]);
        const formula = `${lead(k)}\\frac{${n}!}{${a}^{${n + 1}}} = ${value.toLatex()}`;
        return exactValue(
          `\\int_{0}^{\\infty} ${poly([k, xn])}${ex} \\, dx`,
          value.toLatex(),
          [Q.of(k, a ** (n + 1)).toLatex(), Q.of(k * fact, a ** n).toLatex(), value.neg().toLatex()],
          ...both(
            walked(
              stepsList,
              t(
                `The general formula $\\int_{0}^{\\infty} x^{n}e^{-ax} \\, dx = \\frac{n!}{a^{n + 1}}$, with $n = ${n}$ and $a = ${a}$, gives the same value:${shown(formula)}`,
                `一般公式 $\\int_{0}^{\\infty} x^{n}e^{-ax} \\, dx = \\frac{n!}{a^{n + 1}}$ 中取 $n = ${n}$，$a = ${a}$，得到同样的值：${shown(formula)}`,
              ),
            ),
          ),
        );
      },
    },
  ],
};

/** arctanIntro says how the antiderivative of k/(x² + m²) is found. */
const arctanIntro = (m: number) =>
  m === 1
    ? t("The antiderivative of $\\frac{1}{x^{2} + 1}$ is $\\arctan x$:", "$\\frac{1}{x^{2} + 1}$ 的原函数是 $\\arctan x$：")
    : t(`With $x = ${m}u$, the integrand gives an arctangent:`, `令 $x = ${m}u$，被积函数积分为反正切：`);

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
  intro: t(
    `A constant over $x^{2} + m^{2}$ integrates to an arctangent: with $x = 2u$, $\\int \\frac{1}{x^{2} + 4} \\, dx$ is $\\frac{1}{2}\\arctan\\frac{x}{2} + C$.

Check: by the chain rule the derivative of $\\frac{1}{2}\\arctan\\frac{x}{2}$ is $\\frac{1}{2} \\cdot \\frac{1}{2} \\cdot \\frac{1}{1 + x^{2}/4}$, which simplifies to $\\frac{1}{x^{2} + 4}$.

In this lesson we use the limit $\\arctan t \\to \\frac{\\pi}{2}$ as $t \\to \\infty$ to evaluate improper integrals of $\\frac{k}{x^{2} + m^{2}}$.`,
    `常数除以 $x^{2} + m^{2}$ 的积分是反正切：令 $x = 2u$，$\\int \\frac{1}{x^{2} + 4} \\, dx$ 等于 $\\frac{1}{2}\\arctan\\frac{x}{2} + C$。

检验：由链式法则，$\\frac{1}{2}\\arctan\\frac{x}{2}$ 的导数是 $\\frac{1}{2} \\cdot \\frac{1}{2} \\cdot \\frac{1}{1 + x^{2}/4}$，化简得 $\\frac{1}{x^{2} + 4}$。

这节课我们利用 $t \\to \\infty$ 时 $\\arctan t \\to \\frac{\\pi}{2}$，计算 $\\frac{k}{x^{2} + m^{2}}$ 的反常积分。`,
  ),
  knowledgePoints: [
    {
      id: "improper-integrals-from-zero",
      title: t("Improper integrals from zero", "从零开始的反常积分"),
      explanation: t(
        "The arctangent levels off at $\\frac{\\pi}{2}$ as its input grows, so the area under this curve stays finite even over an infinite interval. An antiderivative is\n\n$$\\int \\frac{1}{x^{2} + m^{2}} \\, dx = \\frac{1}{m}\\arctan\\frac{x}{m} + C$$\n\nSince $\\arctan t \\to \\frac{\\pi}{2}$ as $t \\to \\infty$,\n\n$$\\int_{0}^{\\infty} \\frac{1}{x^{2} + m^{2}} \\, dx = \\frac{1}{m}\\left(\\frac{\\pi}{2} - 0\\right) = \\frac{\\pi}{2m}$$\n\nFor example, $\\int_{0}^{\\infty} \\frac{1}{x^{2} + 9} \\, dx$ is $\\frac{\\pi}{6}$.\n\nCheck: substituting $x = mu$ turns the integral into $\\frac{1}{m}\\int_{0}^{\\infty} \\frac{1}{u^{2} + 1} \\, du$, which is $\\frac{1}{m} \\cdot \\frac{\\pi}{2}$.\n\n> **Watch out.** The limit of the arctangent is $\\frac{\\pi}{2}$, not $\\pi$ and not $\\infty$. With $\\frac{x}{m}$ inside, the factor in front is $\\frac{1}{m}$.",
        "反正切在自变量增大时趋于 $\\frac{\\pi}{2}$，所以即使在无穷区间上，这条曲线下的面积也是有限的。原函数为\n\n$$\\int \\frac{1}{x^{2} + m^{2}} \\, dx = \\frac{1}{m}\\arctan\\frac{x}{m} + C$$\n\n由于 $t \\to \\infty$ 时 $\\arctan t \\to \\frac{\\pi}{2}$，\n\n$$\\int_{0}^{\\infty} \\frac{1}{x^{2} + m^{2}} \\, dx = \\frac{1}{m}\\left(\\frac{\\pi}{2} - 0\\right) = \\frac{\\pi}{2m}$$\n\n例如 $\\int_{0}^{\\infty} \\frac{1}{x^{2} + 9} \\, dx$ 等于 $\\frac{\\pi}{6}$。\n\n检验：代换 $x = mu$，积分化为 $\\frac{1}{m}\\int_{0}^{\\infty} \\frac{1}{u^{2} + 1} \\, du$，即 $\\frac{1}{m} \\cdot \\frac{\\pi}{2}$。\n\n> **注意。** 反正切的极限是 $\\frac{\\pi}{2}$，不是 $\\pi$，也不是 $\\infty$。里面是 $\\frac{x}{m}$ 时，前面的因子是 $\\frac{1}{m}$。",
      ),
      generate(rng) {
        const m = rng.int(1, 6);
        const k = rng.nonZero(-9, 9);
        const right = rng.bool();
        const value = Q.of(k, 2 * m);
        const I = `\\int_{${right ? "0" : "-\\infty"}}^{${right ? "\\infty" : "0"}} ${overSquare(k, m)} \\, dx`;
        const change = right ? "\\frac{\\pi}{2} - 0" : "0 - \\left(-\\frac{\\pi}{2}\\right)";
        const half = `\\frac{1}{2}\\left(${piTimes(Q.of(k, m))}\\right) = ${piTimes(value)}`;
        return exactValue(
          I,
          piTimes(value),
          [piTimes(Q.of(k, m)), piTimes(Q.of(k, 2)), piTimes(Q.of(k, 4 * m))],
          ...both(
            walked(
              [
                [
                  ["Find an antiderivative", "求原函数"],
                  arctanIntro(m),
                  [`\\int ${overSquare(k, m)} \\, dx = ${arctanTerm(Q.of(k, m), m)} + C`],
                ],
                [
                  ["Take the limit", "取极限"],
                  t(
                    `The arctangent is $0$ at $x = 0$ and tends to $${right ? "" : "-"}\\frac{\\pi}{2}$ as $x \\to ${right ? "" : "-"}\\infty$:`,
                    `反正切在 $x = 0$ 处为 $0$，当 $x \\to ${right ? "" : "-"}\\infty$ 时趋于 $${right ? "" : "-"}\\frac{\\pi}{2}$：`,
                  ),
                  [`${I} = ${coef(Q.of(k, m))}\\left(${change}\\right) = ${piTimes(value)}`],
                ],
              ],
              t(
                `The integrand is even, so this is half of the integral over the whole line, where the arctangent changes by $\\pi$ and the integral is $${piTimes(Q.of(k, m))}$:${shown(half)}`,
                `被积函数是偶函数，所以这个积分是整个实数轴上积分的一半；在整个实数轴上反正切变化 $\\pi$，积分为 $${piTimes(Q.of(k, m))}$：${shown(half)}`,
              ),
            ),
          ),
        );
      },
    },
    {
      id: "improper-integrals-from-other-limits",
      title: t("Improper integrals from other limits", "从其他下限开始的反常积分"),
      explanation: t(
        "Evaluate the antiderivative at the finite limit as usual, and use the limiting value of the arctangent at the infinite one. For example,\n\n$$\\int_{2}^{\\infty} \\frac{1}{x^{2} + 4} \\, dx = \\frac{1}{2}\\left(\\frac{\\pi}{2} - \\arctan 1\\right) = \\frac{1}{2}\\left(\\frac{\\pi}{2} - \\frac{\\pi}{4}\\right) = \\frac{\\pi}{8}$$\n\nCheck: split at $0$. The integral from $0$ to $\\infty$ is $\\frac{\\pi}{4}$, and the integral from $0$ to $2$ is $\\frac{1}{2}\\arctan 1$, which is $\\frac{\\pi}{8}$; their difference is $\\frac{\\pi}{8}$.\n\n> **Watch out.** At the finite limit evaluate $\\arctan\\frac{x}{m}$, not $\\arctan x$: at $x = 2$ with $m = 2$ the value is $\\arctan 1$, not $\\arctan 2$.",
        "像平常一样在有限的那个限处计算原函数，无穷那一端则用反正切的极限值。例如\n\n$$\\int_{2}^{\\infty} \\frac{1}{x^{2} + 4} \\, dx = \\frac{1}{2}\\left(\\frac{\\pi}{2} - \\arctan 1\\right) = \\frac{1}{2}\\left(\\frac{\\pi}{2} - \\frac{\\pi}{4}\\right) = \\frac{\\pi}{8}$$\n\n检验：在 $0$ 处拆开。从 $0$ 到 $\\infty$ 的积分是 $\\frac{\\pi}{4}$，从 $0$ 到 $2$ 的积分是 $\\frac{1}{2}\\arctan 1$，即 $\\frac{\\pi}{8}$；两者之差为 $\\frac{\\pi}{8}$。\n\n> **注意。** 在有限的积分限处要计算 $\\arctan\\frac{x}{m}$，而不是 $\\arctan x$：$m = 2$ 时，$x = 2$ 处的值是 $\\arctan 1$，不是 $\\arctan 2$。",
      ),
      generate(rng) {
        const m = rng.int(1, 5);
        const k = rng.nonZero(-9, 9);
        const s = rng.pick([1, -1]);
        const right = rng.bool();
        // ∫_{sm}^{∞} = (k/m)(π/2 − sπ/4); ∫_{−∞}^{sm} = (k/m)(sπ/4 + π/2).
        const value = Q.of(k, m).mul(right ? Q.of(2 - s, 4) : Q.of(2 + s, 4));
        const limit = String(s * m);
        const I = `\\int_{${right ? limit : "-\\infty"}}^{${right ? "\\infty" : limit}} ${overSquare(k, m)} \\, dx`;
        const quarter = `${s < 0 ? "-" : ""}\\frac{\\pi}{4}`;
        const inside = right ? `\\frac{\\pi}{2} ${s < 0 ? "+" : "-"} \\frac{\\pi}{4}` : `${quarter} + \\frac{\\pi}{2}`;
        const halfLine = piTimes(Q.of(k, 2 * m));
        const piece = piTimes(Q.of(k * s, 4 * m));
        const split = right ? `${halfLine} - ${wrap(piece)} = ${piTimes(value)}` : `${halfLine} + ${wrap(piece)} = ${piTimes(value)}`;
        return exactValue(
          I,
          piTimes(value),
          [piTimes(Q.of(k, m).mul(right ? Q.of(2 + s, 4) : Q.of(2 - s, 4))), piTimes(Q.of(k, 2 * m)), piTimes(value.mul(Q.of(m)))],
          ...both(
            walked(
              [
                [
                  ["Find an antiderivative", "求原函数"],
                  arctanIntro(m),
                  [`\\int ${overSquare(k, m)} \\, dx = ${arctanTerm(Q.of(k, m), m)} + C`],
                ],
                [
                  ["Evaluate at the finite limit", "在有限的积分限处计算"],
                  t(
                    `At $x = ${limit}$ the arctangent is $\\arctan(${s})$, which is $${quarter}$.`,
                    `在 $x = ${limit}$ 处，反正切是 $\\arctan(${s})$，即 $${quarter}$。`,
                  ),
                ],
                [
                  ["Take the limit at infinity", "在无穷远处取极限"],
                  t(
                    `As $x \\to ${right ? "" : "-"}\\infty$ the arctangent tends to $${right ? "" : "-"}\\frac{\\pi}{2}$:`,
                    `当 $x \\to ${right ? "" : "-"}\\infty$ 时，反正切趋于 $${right ? "" : "-"}\\frac{\\pi}{2}$：`,
                  ),
                  [`${I} = ${coef(Q.of(k, m))}\\left(${inside}\\right) = ${piTimes(value)}`],
                ],
              ],
              t(
                `Split at $0$. The integral over the half line ${right ? "from $0$ to $\\infty$" : "from $-\\infty$ to $0$"} is $${halfLine}$, and the integral from $0$ to $${limit}$ is $${piece}$. ${right ? "Take" : "Add"} the second ${right ? "from" : "to"} the first:${shown(split)}`,
                `在 $0$ 处拆开。${right ? "从 $0$ 到 $\\infty$" : "从 $-\\infty$ 到 $0$"} 的积分是 $${halfLine}$，从 $0$ 到 $${limit}$ 的积分是 $${piece}$。${right ? "用前者减去后者" : "把两者相加"}：${shown(split)}`,
              ),
            ),
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
  intro: t(
    `Over a half line the arctangent gives a finite area: $\\int_{0}^{\\infty} \\frac{1}{x^{2} + 9} \\, dx$ is $\\frac{1}{3}\\left(\\frac{\\pi}{2} - 0\\right)$, which is $\\frac{\\pi}{6}$.

Check: substituting $x = 3u$ gives $\\frac{1}{3}\\int_{0}^{\\infty} \\frac{1}{u^{2} + 1} \\, du$, which is $\\frac{1}{3} \\cdot \\frac{\\pi}{2}$, the same value.

In this lesson we integrate over the whole real line by splitting it into two halves, and complete the square first in denominators such as $x^{2} + 4x + 13$.`,
    `在半条直线上，反正切给出有限的面积：$\\int_{0}^{\\infty} \\frac{1}{x^{2} + 9} \\, dx$ 等于 $\\frac{1}{3}\\left(\\frac{\\pi}{2} - 0\\right)$，即 $\\frac{\\pi}{6}$。

检验：代换 $x = 3u$，得 $\\frac{1}{3}\\int_{0}^{\\infty} \\frac{1}{u^{2} + 1} \\, du$，即 $\\frac{1}{3} \\cdot \\frac{\\pi}{2}$，结果相同。

这节课我们把整个实数轴拆成两半来积分；对 $x^{2} + 4x + 13$ 这样的分母，先配方。`,
  ),
  knowledgePoints: [
    {
      id: "integrating-over-the-whole-real-line",
      title: t("Integrating over the whole real line", "在整个实数轴上积分"),
      explanation: t(
        "Define $\\int_{-\\infty}^{\\infty} f(x) \\, dx = \\int_{-\\infty}^{c} f(x) \\, dx + \\int_{c}^{\\infty} f(x) \\, dx$ for any $c$; it converges only if both parts converge. For example,\n\n$$\\int_{-\\infty}^{\\infty} \\frac{1}{x^{2} + m^{2}} \\, dx = \\frac{1}{m}\\left(\\frac{\\pi}{2} - \\left(-\\frac{\\pi}{2}\\right)\\right) = \\frac{\\pi}{m}$$\n\nCheck: the integrand is even, so the two halves are equal, each $\\frac{\\pi}{2m}$, and they add up to $\\frac{\\pi}{m}$.\n\n> **Watch out.** Do not take $\\lim_{t \\to \\infty}\\int_{-t}^{t}$ instead. For $f(x) = x$ that limit is $0$, but each half diverges, so $\\int_{-\\infty}^{\\infty} x \\, dx$ diverges.",
        "对任意 $c$，定义 $\\int_{-\\infty}^{\\infty} f(x) \\, dx = \\int_{-\\infty}^{c} f(x) \\, dx + \\int_{c}^{\\infty} f(x) \\, dx$；只有两部分都收敛时它才收敛。例如\n\n$$\\int_{-\\infty}^{\\infty} \\frac{1}{x^{2} + m^{2}} \\, dx = \\frac{1}{m}\\left(\\frac{\\pi}{2} - \\left(-\\frac{\\pi}{2}\\right)\\right) = \\frac{\\pi}{m}$$\n\n检验：被积函数是偶函数，两半相等，各为 $\\frac{\\pi}{2m}$，相加得 $\\frac{\\pi}{m}$。\n\n> **注意。** 不能改用 $\\lim_{t \\to \\infty}\\int_{-t}^{t}$。对 $f(x) = x$，这个极限是 $0$，但每一半都发散，所以 $\\int_{-\\infty}^{\\infty} x \\, dx$ 发散。",
      ),
      generate(rng) {
        const m = rng.int(1, 9);
        const k = rng.nonZero(-9, 9);
        const value = Q.of(k, m);
        const f = overSquare(k, m);
        const I = `\\int_{-\\infty}^{\\infty} ${f} \\, dx`;
        const half = piTimes(Q.of(k, 2 * m));
        const whole = `${coef(value)}\\left(\\frac{\\pi}{2} - \\left(-\\frac{\\pi}{2}\\right)\\right) = ${piTimes(value)}`;
        return exactValue(
          I,
          piTimes(value),
          [piTimes(Q.of(k, 2 * m)), piTimes(Q.of(k)), "0"],
          ...both(
            walked(
              [
                [
                  ["Split at 0", "在 0 处拆开"],
                  t("The integral converges only if both halves do:", "只有两半都收敛，积分才收敛："),
                  [`${I} = \\int_{-\\infty}^{0} ${f} \\, dx + \\int_{0}^{\\infty} ${f} \\, dx`],
                ],
                [
                  ["Evaluate each half", "计算每一半"],
                  t(
                    `An antiderivative is $${arctanTerm(value, m)}$. It is $0$ at $x = 0$ and tends to $${half}$ as $x \\to \\infty$ and to the opposite value as $x \\to -\\infty$, so each half is $${half}$:`,
                    `原函数为 $${arctanTerm(value, m)}$。它在 $x = 0$ 处为 $0$，当 $x \\to \\infty$ 时趋于 $${half}$，当 $x \\to -\\infty$ 时趋于相反数，所以每一半都是 $${half}$：`,
                  ),
                  [`${I} = 2 \\cdot ${wrap(half)} = ${piTimes(value)}`],
                ],
              ],
              t(
                `Over the whole line the arctangent changes by $\\pi$, from $-\\frac{\\pi}{2}$ to $\\frac{\\pi}{2}$, at once:${shown(whole)}`,
                `在整个实数轴上，反正切一次从 $-\\frac{\\pi}{2}$ 变到 $\\frac{\\pi}{2}$，变化 $\\pi$：${shown(whole)}`,
              ),
            ),
          ),
        );
      },
    },
    {
      id: "completing-the-square-over-the-real-line",
      title: t("Completing the square over the real line", "在整个实数轴上配方"),
      explanation: t(
        "A shift of the variable does not change an infinite interval in both directions, so after completing the square the limits stay the same. Complete the square, $x^{2} - 2hx + h^{2} + m^{2} = (x - h)^{2} + m^{2}$, and substitute $u = x - h$; the limits stay $-\\infty$ and $\\infty$:\n\n$$\\int_{-\\infty}^{\\infty} \\frac{1}{x^{2} + 4x + 13} \\, dx = \\int_{-\\infty}^{\\infty} \\frac{1}{u^{2} + 9} \\, du = \\frac{\\pi}{3}$$\n\nCheck: $(x + 2)^{2} + 9$ expands to $x^{2} + 4x + 4 + 9$, which is $x^{2} + 4x + 13$.\n\n> **Watch out.** The limits stay put only because the interval is the whole line. On a finite or half-infinite interval, the limits shift along with $u = x - h$.",
        "平移变量不会改变两端都是无穷的区间，所以配方后上下限保持不变。配方 $x^{2} - 2hx + h^{2} + m^{2} = (x - h)^{2} + m^{2}$，再代换 $u = x - h$；积分限仍为 $-\\infty$ 与 $\\infty$：\n\n$$\\int_{-\\infty}^{\\infty} \\frac{1}{x^{2} + 4x + 13} \\, dx = \\int_{-\\infty}^{\\infty} \\frac{1}{u^{2} + 9} \\, du = \\frac{\\pi}{3}$$\n\n检验：$(x + 2)^{2} + 9$ 展开为 $x^{2} + 4x + 4 + 9$，即 $x^{2} + 4x + 13$。\n\n> **注意。** 积分限不变只是因为区间是整个实数轴。在有限区间或半无穷区间上，积分限要随 $u = x - h$ 一起平移。",
      ),
      generate(rng) {
        const h = rng.nonZero(-5, 5);
        const m = rng.int(1, 4);
        const k = rng.nonZero(-6, 6);
        const den = poly([1, "x^{2}"], [-2 * h, "x"], [h * h + m * m, ""]);
        const value = Q.of(k, m);
        const I = `\\int_{-\\infty}^{\\infty} ${fracWith(k, "", den).replace("\\frac{}", "\\frac{1}")} \\, dx`;
        const inU = `\\int_{-\\infty}^{\\infty} ${overSquare(k, m).replace(/x/g, "u")} \\, du`;
        return exactValue(
          I,
          piTimes(value),
          [piTimes(Q.of(k, m * m)), piTimes(Q.of(k, 2 * m)), piTimes(Q.of(k, h * h + m * m))],
          ...both(
            walked(
              [
                [
                  ["Complete the square", "配方"],
                  t(`Half the coefficient of $x$ is $${-h}$:`, `$x$ 的系数的一半是 $${-h}$：`),
                  [`${den} = ${fac(h)}^{2} + ${m * m}`],
                ],
                [
                  ["Substitute", "代换"],
                  t(
                    `Let $u = ${bare(h)}$. Then $du = dx$, and the limits stay $-\\infty$ and $\\infty$:`,
                    `令 $u = ${bare(h)}$，则 $du = dx$，积分限仍为 $-\\infty$ 与 $\\infty$：`,
                  ),
                  [`${I} = ${inU}`],
                ],
                [
                  ["Evaluate", "计算"],
                  t(
                    `An antiderivative is $${arctanTerm(value, m).replace(/x/g, "u")}$, and the arctangent runs from $-\\frac{\\pi}{2}$ to $\\frac{\\pi}{2}$:`,
                    `原函数为 $${arctanTerm(value, m).replace(/x/g, "u")}$，反正切从 $-\\frac{\\pi}{2}$ 变到 $\\frac{\\pi}{2}$：`,
                  ),
                  [`${inU} = ${coef(value)}\\left(\\frac{\\pi}{2} - \\left(-\\frac{\\pi}{2}\\right)\\right) = ${piTimes(value)}`],
                ],
              ],
              t(
                `The integrand is the graph of $${overSquare(k, m)}$ shifted $${Math.abs(h)}$ ${Math.abs(h) === 1 ? "unit" : "units"} to the ${h > 0 ? "right" : "left"}, and shifting a graph along the whole line does not change the area under it. The integral of $${overSquare(k, m)}$ over the whole line is $${piTimes(value)}$, the same value.`,
                `被积函数的图像是 $${overSquare(k, m)}$ 的图像向${h > 0 ? "右" : "左"}平移 $${Math.abs(h)}$ 个单位，沿整个实数轴平移图像不会改变它下方的面积。$${overSquare(k, m)}$ 在整个实数轴上的积分是 $${piTimes(value)}$，结果相同。`,
              ),
            ),
          ),
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
  intro: t(
    `Over an infinite interval, an integral is a limit: $\\int_{1}^{\\infty} \\frac{1}{x^{2}} \\, dx$ is the limit of $\\int_{1}^{t} \\frac{1}{x^{2}} \\, dx$ as $t \\to \\infty$, which is $1$.

Check: $\\int_{1}^{t} x^{-2} \\, dx$ is $1 - \\frac{1}{t}$, which tends to $1$.

In this lesson we take the limit at a finite endpoint instead, where the integrand grows without bound, as $\\frac{1}{\\sqrt{x}}$ does at $0$.`,
    `在无穷区间上，积分是极限：$\\int_{1}^{\\infty} \\frac{1}{x^{2}} \\, dx$ 是 $t \\to \\infty$ 时 $\\int_{1}^{t} \\frac{1}{x^{2}} \\, dx$ 的极限，即 $1$。

检验：$\\int_{1}^{t} x^{-2} \\, dx$ 等于 $1 - \\frac{1}{t}$，趋于 $1$。

这节课我们改在有限的端点处取极限：被积函数在那里无界增长，就像 $\\frac{1}{\\sqrt{x}}$ 在 $0$ 处那样。`,
  ),
  knowledgePoints: [
    {
      id: "evaluating-integrals-with-an-unbounded-integrand",
      title: t("Evaluating integrals with an unbounded integrand", "计算被积函数无界的积分"),
      explanation: t(
        "When the function blows up at an endpoint, integrate up to a point near it and take the limit as that point approaches the endpoint. If $f$ is unbounded at $x = a$, define\n\n$$\\int_{a}^{b} f(x) \\, dx = \\lim_{t \\to a^{+}} \\int_{t}^{b} f(x) \\, dx$$\n\nFor example, $\\int_{0}^{9} \\frac{1}{\\sqrt{x}} \\, dx = \\lim_{t \\to 0^{+}} \\left[2\\sqrt{x}\\right]_{t}^{9} = 6$. In general $\\int_{0}^{b} x^{-p} \\, dx = \\frac{b^{1 - p}}{1 - p}$ for $p < 1$.\n\nCheck: $\\left[2\\sqrt{x}\\right]_{t}^{9}$ is $6 - 2\\sqrt{t}$, which tends to $6$ as $t \\to 0^{+}$.\n\n> **Watch out.** The integrand is not defined at the endpoint, so the integral is a limit, not a plain evaluation. Plugging in works here only because the antiderivative $2\\sqrt{x}$ is continuous at $0$; for $\\frac{1}{x^{2}}$ the same shortcut gives a wrong finite answer.",
        "当函数在端点处趋于无穷时，先积分到它附近的一点，再取这个点趋近端点时的极限。若 $f$ 在 $x = a$ 处无界，定义\n\n$$\\int_{a}^{b} f(x) \\, dx = \\lim_{t \\to a^{+}} \\int_{t}^{b} f(x) \\, dx$$\n\n例如 $\\int_{0}^{9} \\frac{1}{\\sqrt{x}} \\, dx = \\lim_{t \\to 0^{+}} \\left[2\\sqrt{x}\\right]_{t}^{9} = 6$。一般地，当 $p < 1$ 时 $\\int_{0}^{b} x^{-p} \\, dx = \\frac{b^{1 - p}}{1 - p}$。\n\n检验：$\\left[2\\sqrt{x}\\right]_{t}^{9}$ 等于 $6 - 2\\sqrt{t}$，当 $t \\to 0^{+}$ 时趋于 $6$。\n\n> **注意。** 被积函数在端点处没有定义，所以积分是极限，而不是直接代入。这里直接代入碰巧可行，只是因为原函数 $2\\sqrt{x}$ 在 $0$ 处连续；对 $\\frac{1}{x^{2}}$ 同样的做法会得出错误的有限值。",
      ),
      generate(rng) {
        const r = rng.pick(rootPowers);
        const n = rng.int(1, 4);
        const k = rng.nonZero(-6, 6);
        const b = r.p.eq(Q.of(1, 2)) ? n * n : n ** 3;
        // b^(1−p) is n for p = 1/2 and 2/3, and n² for p = 1/3.
        const bPow = r.p.eq(Q.of(1, 3)) ? n * n : n;
        const value = Q.of(k * bPow).div(Q.one.sub(r.p));
        const c = Q.of(k).div(Q.one.sub(r.p));
        const e = expLatex(Q.one.sub(r.p));
        const f = fracWith(k, "", r.den).replace("\\frac{}", "\\frac{1}");
        const anti = `${coef(c)}x^{${e}}`;
        const fromT = joinTerms([value.toLatex(), `${coef(c.neg())}t^{${e}}`]);
        const I = `\\int_{0}^{${b}} ${f} \\, dx`;
        const derivative = `\\frac{d}{dx}\\left[${anti}\\right] = ${coef(Q.of(k))}x^{-${expLatex(r.p)}} = ${f}`;
        return exactValue(
          I,
          value.toLatex(),
          [
            Q.of(k * bPow).toLatex(),
            Q.of(k * bPow)
              .mul(Q.one.sub(r.p))
              .toLatex(),
            value.neg().toLatex(),
          ],
          ...both(
            walked(
              [
                [
                  ["Write the integral as a limit", "把积分写成极限"],
                  t(
                    "The integrand is unbounded at $x = 0$, so start the integral at $t > 0$ and let $t \\to 0^{+}$:",
                    "被积函数在 $x = 0$ 处无界，所以从 $t > 0$ 开始积分，再令 $t \\to 0^{+}$：",
                  ),
                  [`${I} = \\lim_{t \\to 0^{+}} \\int_{t}^{${b}} ${f} \\, dx`],
                ],
                [
                  ["Integrate from t", "从 t 开始积分"],
                  t(
                    `The integrand is $${coef(Q.of(k))}x^{-${expLatex(r.p)}}$, so by the power rule an antiderivative is $${anti}$. At $x = ${b}$, $x^{${e}} = ${bPow}$:`,
                    `被积函数是 $${coef(Q.of(k))}x^{-${expLatex(r.p)}}$，由幂法则，原函数为 $${anti}$。在 $x = ${b}$ 处，$x^{${e}} = ${bPow}$：`,
                  ),
                  [`\\int_{t}^{${b}} ${f} \\, dx = \\left[${anti}\\right]_{t}^{${b}} = ${fromT}`],
                ],
                [
                  ["Let t tend to 0", "令 t 趋于 0"],
                  t(
                    `The exponent $${e}$ is positive, so $t^{${e}} \\to 0$ as $t \\to 0^{+}$:`,
                    `指数 $${e}$ 为正，所以 $t \\to 0^{+}$ 时 $t^{${e}} \\to 0$：`,
                  ),
                  [`${I} = \\lim_{t \\to 0^{+}}\\left(${fromT}\\right) = ${value.toLatex()}`],
                ],
              ],
              t(
                `Differentiate the antiderivative; it should give back the integrand:${shown(derivative)}`,
                `对原函数求导，应当得到被积函数：${shown(derivative)}`,
              ),
            ),
          ),
        );
      },
    },
    {
      id: "the-p-test-near-zero",
      title: t("The p-test near zero", "零点附近的 p 判别法"),
      explanation: t(
        "$\\int_{0}^{1} \\frac{1}{x^{p}} \\, dx$ converges to $\\frac{1}{1 - p}$ when $p < 1$ and diverges when $p \\ge 1$ — the opposite of the test on $[1, \\infty)$. For example, $\\int_{0}^{1} \\frac{1}{x^{2}} \\, dx$ diverges, because the integral from $t$ to $1$ is $\\left[-\\frac{1}{x}\\right]_{t}^{1}$, which is $\\frac{1}{t} - 1$ and grows without bound as $t \\to 0^{+}$.\n\nCheck: for $p = \\frac{1}{2}$, $\\int_{t}^{1} x^{-1/2} \\, dx$ is $2 - 2\\sqrt{t}$, which tends to $2$, and $\\frac{1}{1 - p}$ is $2$ as well.\n\n> **Watch out.** Near $0$ the test runs the other way from the test on $[1, \\infty)$: small powers converge here and large powers diverge. The case $p = 1$ diverges in both.",
        "当 $p < 1$ 时 $\\int_{0}^{1} \\frac{1}{x^{p}} \\, dx$ 收敛于 $\\frac{1}{1 - p}$；当 $p \\ge 1$ 时发散——与 $[1, \\infty)$ 上的判别法正好相反。例如 $\\int_{0}^{1} \\frac{1}{x^{2}} \\, dx$ 发散，因为从 $t$ 到 $1$ 的积分是 $\\left[-\\frac{1}{x}\\right]_{t}^{1}$，即 $\\frac{1}{t} - 1$，当 $t \\to 0^{+}$ 时无界增长。\n\n检验：$p = \\frac{1}{2}$ 时，$\\int_{t}^{1} x^{-1/2} \\, dx$ 等于 $2 - 2\\sqrt{t}$，趋于 $2$，而 $\\frac{1}{1 - p}$ 也是 $2$。\n\n> **注意。** 在 $0$ 附近，判别法的方向与 $[1, \\infty)$ 上相反：这里幂次小的收敛，幂次大的发散。$p = 1$ 在两种情形下都发散。",
      ),
      generate(rng) {
        const p = rng.pick(pChoices);
        const k = rng.nonZero(-9, 9);
        const f = fracWith(k, "", xPower(p)).replace("\\frac{}", "\\frac{1}");
        const integralLatex = `\\int_{0}^{1} ${f} \\, dx`;
        if (p.cmp(Q.one) < 0) {
          const v = Q.of(k).div(Q.one.sub(p));
          const e = expLatex(Q.one.sub(p));
          const fromT = joinTerms([v.toLatex(), `${coef(v.neg())}t^{${e}}`]);
          const derivative = `\\frac{d}{dx}\\left[${coef(v)}x^{${e}}\\right] = ${coef(Q.of(k))}x^{-${expLatex(p)}}`;
          return convergenceProblem(
            rng,
            integralLatex,
            converges(v.toLatex()),
            [
              [
                diverges,
                `For $p < 1$ the exponent $1 - p$ is positive, so $t^{${e}} \\to 0$ as $t \\to 0^{+}$ and the limit exists.`,
                `当 $p < 1$ 时指数 $1 - p$ 为正，所以 $t \\to 0^{+}$ 时 $t^{${e}} \\to 0$，极限存在。`,
              ],
              [
                converges(v.neg().toLatex()),
                `The sign is reversed. The integrand is ${k > 0 ? "positive" : "negative"} on $(0, 1]$, so the value must be too.`,
                `符号反了。被积函数在 $(0, 1]$ 上为${k > 0 ? "正" : "负"}，积分值也应为${k > 0 ? "正" : "负"}。`,
              ],
              [
                converges(String(k)),
                "This leaves out the factor $\\frac{1}{1 - p}$ that the power rule brings in.",
                "这里漏掉了幂法则带来的因子 $\\frac{1}{1 - p}$。",
              ],
            ],
            walked(
              [
                [
                  ["Compare p with 1", "比较 p 与 1"],
                  t(
                    `The integrand is $${coef(Q.of(k))}x^{-p}$ with $p = ${p.toLatex()} < 1$, so near $0$ the integral converges.`,
                    `被积函数是 $${coef(Q.of(k))}x^{-p}$，其中 $p = ${p.toLatex()} < 1$，所以在 $0$ 附近积分收敛。`,
                  ),
                ],
                [
                  ["Find the value", "求出积分值"],
                  t(
                    `Integrate from $t$ to $1$ by the power rule; the term with $t$ tends to $0$ because its exponent $${e}$ is positive:`,
                    `用幂法则从 $t$ 积到 $1$；含 $t$ 的项趋于 $0$，因为它的指数 $${e}$ 为正：`,
                  ),
                  [
                    `${integralLatex} = \\lim_{t \\to 0^{+}}\\left[${coef(v)}x^{${e}}\\right]_{t}^{1}`,
                    `= \\lim_{t \\to 0^{+}}\\left(${fromT}\\right) = ${v.toLatex()}`,
                  ],
                ],
              ],
              t(
                `Differentiate the antiderivative; it should give back the integrand $${f}$:${shown(derivative)}`,
                `对原函数求导，应当得到被积函数 $${f}$：${shown(derivative)}`,
              ),
            ),
          );
        }
        const one = p.eq(Q.one);
        const c = one ? Q.of(0) : Q.of(k).div(Q.one.sub(p));
        const tPow = xPower(p.sub(Q.one), "t");
        const tTerm = fracTerm(c.neg(), "", tPow).replace("\\frac{}", "\\frac{1}");
        const fromT = one ? poly([-k, "\\ln t"]) : joinTerms([c.toLatex(), tTerm]);
        const wrong: readonly Option[] = one
          ? [
              [
                converges("0"),
                "$\\ln t \\to -\\infty$ as $t \\to 0^{+}$, so the integral from $t$ to $1$ grows without bound; it does not tend to $0$.",
                "当 $t \\to 0^{+}$ 时 $\\ln t \\to -\\infty$，从 $t$ 到 $1$ 的积分无界增长，并不趋于 $0$。",
              ],
              [
                converges(String(k)),
                "This is only the coefficient. $\\ln x$ has no finite limit as $x \\to 0^{+}$, so no finite value is right.",
                "这只是系数。当 $x \\to 0^{+}$ 时 $\\ln x$ 没有有限的极限，任何有限值都不对。",
              ],
              [
                converges(String(-k)),
                "$\\ln x$ has no finite limit as $x \\to 0^{+}$, so no finite value is right.",
                "当 $x \\to 0^{+}$ 时 $\\ln x$ 没有有限的极限，任何有限值都不对。",
              ],
            ]
          : [
              [
                converges(c.toLatex()),
                `This keeps only the value at the upper limit, as if the term $${tTerm}$ vanished. But that term is unbounded as $t \\to 0^{+}$.`,
                `这里只保留了上限处的值，好像 $${tTerm}$ 一项消失了。但当 $t \\to 0^{+}$ 时这一项无界。`,
              ],
              [
                converges(c.neg().toLatex()),
                "This is the value of the same integral on $[1, \\infty)$, where $p > 1$ converges. Near $0$ the test runs the other way.",
                "这是同一个积分在 $[1, \\infty)$ 上的值，那里 $p > 1$ 收敛。在 $0$ 附近判别法的方向相反。",
              ],
              [
                converges(String(k)),
                "This is only the coefficient. Near $0$ a power $p > 1$ makes the integral diverge.",
                "这只是系数。在 $0$ 附近，$p > 1$ 使积分发散。",
              ],
            ];
        return convergenceProblem(
          rng,
          integralLatex,
          diverges,
          wrong,
          walked(
            [
              [
                ["Compare p with 1", "比较 p 与 1"],
                t(
                  `The integrand is $${coef(Q.of(k))}x^{-p}$ with $p = ${p.toLatex()} \\ge 1$, so near $0$ the integral should diverge. Confirm it with the limit.`,
                  `被积函数是 $${coef(Q.of(k))}x^{-p}$，其中 $p = ${p.toLatex()} \\ge 1$，在 $0$ 附近积分应当发散。下面用极限来确认。`,
                ),
              ],
              [
                ["Integrate from t", "从 t 开始积分"],
                t(
                  one ? "An antiderivative is a multiple of $\\ln x$, and $\\ln 1 = 0$:" : "By the power rule:",
                  one ? "原函数是 $\\ln x$ 的倍数，且 $\\ln 1 = 0$：" : "由幂法则：",
                ),
                [`\\int_{t}^{1} ${f} \\, dx = ${fromT}`],
              ],
              [
                ["Let t tend to 0", "令 t 趋于 0"],
                t(
                  `As $t \\to 0^{+}$, ${one ? "$\\ln t \\to -\\infty$" : `the term $${tTerm}$ is unbounded`}. The integral from $t$ to $1$ has no finite limit, so the integral diverges.`,
                  `当 $t \\to 0^{+}$ 时，${one ? "$\\ln t \\to -\\infty$" : `$${tTerm}$ 一项无界`}。从 $t$ 到 $1$ 的积分没有有限的极限，所以积分发散。`,
                ),
              ],
            ],
            one
              ? t(
                  `Take $t = e^{-n}$: the integral from $t$ to $1$ is $${poly([k, "n"])}$, which is unbounded as $n$ grows.`,
                  `取 $t = e^{-n}$：从 $t$ 到 $1$ 的积分是 $${poly([k, "n"])}$，随 $n$ 增大而无界。`,
                )
              : t(
                  "Compare with $\\frac{1}{x}$. For $0 < x \\le 1$ and $p > 1$, $x^{p} \\le x$, so $\\frac{1}{x^{p}} \\ge \\frac{1}{x}$; and the area under $\\frac{1}{x}$ from $t$ to $1$ is $-\\ln t$, which already grows without bound.",
                  "与 $\\frac{1}{x}$ 比较。当 $0 < x \\le 1$ 且 $p > 1$ 时，$x^{p} \\le x$，所以 $\\frac{1}{x^{p}} \\ge \\frac{1}{x}$；而 $\\frac{1}{x}$ 从 $t$ 到 $1$ 下的面积是 $-\\ln t$，它已经无界增长。",
                ),
          ),
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
  intro: t(
    `An integrand that is unbounded at an endpoint gives a limit: $\\int_{0}^{4} \\frac{1}{\\sqrt{x}} \\, dx$ is the limit of $\\left[2\\sqrt{x}\\right]_{t}^{4}$ as $t \\to 0^{+}$, which is $4$.

Check: $\\frac{1}{\\sqrt{x}}$ is $x^{-p}$ with $p = \\frac{1}{2} < 1$, so the $p$-test near $0$ also says it converges.

In this lesson we handle an integrand that is unbounded at a point inside the interval, by splitting the integral there into two improper integrals.`,
    `被积函数在端点处无界时，积分是极限：$\\int_{0}^{4} \\frac{1}{\\sqrt{x}} \\, dx$ 是 $t \\to 0^{+}$ 时 $\\left[2\\sqrt{x}\\right]_{t}^{4}$ 的极限，即 $4$。

检验：$\\frac{1}{\\sqrt{x}}$ 是 $x^{-p}$，$p = \\frac{1}{2} < 1$，由零点附近的 $p$ 判别法，它也收敛。

这节课我们处理在区间内部某点无界的被积函数：在这一点把积分拆成两个反常积分。`,
  ),
  knowledgePoints: [
    {
      id: "splitting-at-an-interior-discontinuity",
      title: t("Splitting at an interior discontinuity", "在内部间断点处拆开"),
      explanation: t(
        "A point inside the interval where the function blows up must be treated as an endpoint of two separate improper integrals, and both must converge. If $f$ is unbounded at $c$ inside $[a, b]$, write $\\int_{a}^{b} f = \\int_{a}^{c} f + \\int_{c}^{b} f$ and evaluate each part as a limit. For example,\n\n$$\\int_{-1}^{8} \\frac{1}{\\sqrt[3]{x}} \\, dx = \\left[\\frac{3}{2}x^{2/3}\\right]_{-1}^{0} + \\left[\\frac{3}{2}x^{2/3}\\right]_{0}^{8} = -\\frac{3}{2} + 6 = \\frac{9}{2}$$\n\nCheck: near $0$ each part is a multiple of $\\int x^{-1/3} \\, dx$ with $p = \\frac{1}{3} < 1$, so by the $p$-test each part converges, as the finite values show.\n\n> **Watch out.** If either part diverges, the whole integral diverges. A divergent part on one side cannot be cancelled by the other side.",
        "区间内部使函数趋于无穷的点必须看作两个反常积分的端点，而且两个积分都必须收敛。若 $f$ 在 $[a, b]$ 内的点 $c$ 处无界，写成 $\\int_{a}^{b} f = \\int_{a}^{c} f + \\int_{c}^{b} f$，并把每一部分作为极限计算。例如\n\n$$\\int_{-1}^{8} \\frac{1}{\\sqrt[3]{x}} \\, dx = \\left[\\frac{3}{2}x^{2/3}\\right]_{-1}^{0} + \\left[\\frac{3}{2}x^{2/3}\\right]_{0}^{8} = -\\frac{3}{2} + 6 = \\frac{9}{2}$$\n\n检验：在 $0$ 附近，每一部分都是 $\\int x^{-1/3} \\, dx$ 的倍数，$p = \\frac{1}{3} < 1$，由 $p$ 判别法每一部分都收敛，与算出的有限值一致。\n\n> **注意。** 只要有一部分发散，整个积分就发散。一侧发散的部分不能被另一侧抵消。",
      ),
      generate(rng) {
        const [m, n] = [rng.int(1, 3), rng.int(1, 3)];
        const k = rng.nonZero(-6, 6);
        const square = rng.bool();
        // ∫ x^(−1/3) = (3/2)x^(2/3); ∫ x^(−2/3) = 3x^(1/3).
        const value = square ? Q.of(3 * k * (n + m)) : Q.of(3 * k * (n * n - m * m), 2);
        const den = square ? "\\sqrt[3]{x^{2}}" : "\\sqrt[3]{x}";
        const anti = square ? `${coef(Q.of(3 * k))}x^{1/3}` : `${coef(Q.of(3 * k, 2))}x^{2/3}`;
        // F(−m³) and F(n³) for the antiderivative F.
        const [Flo, Fhi] = square ? [Q.of(-3 * k * m), Q.of(3 * k * n)] : [Q.of(3 * k * m * m, 2), Q.of(3 * k * n * n, 2)];
        const [lo, hi] = [-(m ** 3), n ** 3];
        const f = fracWith(k, "", den).replace("\\frac{}", "\\frac{1}");
        const I = `\\int_{${lo}}^{${hi}} ${f} \\, dx`;
        const left = Flo.neg();
        const whole = `\\left[${anti}\\right]_{${lo}}^{${hi}} = ${Fhi.toLatex()} - ${wrap(Flo.toLatex())} = ${value.toLatex()}`;
        return exactValue(
          I,
          value.toLatex(),
          [
            square ? Q.of(3 * k * (n - m)).toLatex() : Q.of(3 * k * (n * n + m * m), 2).toLatex(),
            value.neg().toLatex(),
            square ? Q.of(3 * k * n).toLatex() : Q.of(3 * k * n * n, 2).toLatex(),
          ],
          ...both(
            walked(
              [
                [
                  ["Split at the discontinuity", "在间断点处拆开"],
                  t(
                    `The integrand is unbounded at $x = 0$, which lies inside $[${lo}, ${hi}]$, so split there:`,
                    `被积函数在 $x = 0$ 处无界，而 $0$ 在 $[${lo}, ${hi}]$ 内部，所以在那里拆开：`,
                  ),
                  [`${I} = \\int_{${lo}}^{0} ${f} \\, dx + \\int_{0}^{${hi}} ${f} \\, dx`],
                ],
                [
                  ["Evaluate each part as a limit", "把每一部分作为极限计算"],
                  t(
                    `An antiderivative is $${anti}$, which tends to $0$ as $x \\to 0$ from either side:`,
                    `原函数为 $${anti}$，当 $x$ 从任一侧趋于 $0$ 时它趋于 $0$：`,
                  ),
                  [
                    `\\int_{${lo}}^{0} ${f} \\, dx = 0 - ${wrap(Flo.toLatex())} = ${left.toLatex()}`,
                    `\\int_{0}^{${hi}} ${f} \\, dx = ${Fhi.toLatex()} - 0 = ${Fhi.toLatex()}`,
                  ],
                ],
                [
                  ["Add the parts", "把两部分相加"],
                  t("Both parts converge, so the integral is their sum:", "两部分都收敛，所以积分是它们的和："),
                  [`${I} = ${left.toLatex()} + ${wrap(Fhi.toLatex())} = ${value.toLatex()}`],
                ],
              ],
              t(
                `The antiderivative $${anti}$ is continuous at $0$, so evaluating it across the whole interval must give the same total:${shown(whole)}`,
                `原函数 $${anti}$ 在 $0$ 处连续，所以在整个区间上直接计算，结果应当相同：${shown(whole)}`,
              ),
            ),
          ),
        );
      },
    },
    {
      id: "spotting-a-hidden-discontinuity",
      title: t("Spotting a hidden discontinuity", "发现隐藏的间断点"),
      explanation: t(
        "Before using the fundamental theorem, check that the integrand is continuous on the interval. Applied blindly, the theorem gives\n\n$$\\int_{-1}^{1} \\frac{1}{x^{2}} \\, dx = \\left[-\\frac{1}{x}\\right]_{-1}^{1} = -2$$\n\nThat is impossible for a positive integrand. In fact $\\frac{1}{x^{2}}$ is unbounded at $0$ and $\\int_{0}^{1} \\frac{1}{x^{2}} \\, dx$ diverges, so the whole integral diverges.\n\nCheck: $\\frac{1}{x^{2}} \\ge 1$ on $[-1, 1]$, an interval of length $2$, so even a convergent value would have to be at least $2$.\n\n> **Watch out.** A discontinuity can hide inside the interval. Before you integrate, look for zeros of every denominator between the limits.",
        "使用微积分基本定理之前，先检查被积函数在区间上是否连续。若直接套用定理，会得到\n\n$$\\int_{-1}^{1} \\frac{1}{x^{2}} \\, dx = \\left[-\\frac{1}{x}\\right]_{-1}^{1} = -2$$\n\n而正的被积函数不可能积出负数。实际上 $\\frac{1}{x^{2}}$ 在 $0$ 处无界，$\\int_{0}^{1} \\frac{1}{x^{2}} \\, dx$ 发散，所以整个积分发散。\n\n检验：在 $[-1, 1]$ 上 $\\frac{1}{x^{2}} \\ge 1$，区间长度为 $2$，所以即使积分收敛，它的值也至少是 $2$。\n\n> **注意。** 间断点可能藏在区间内部。积分之前，先找出每个分母在上下限之间的零点。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const c = rng.int(-3, 3);
        const [a, b] = [rng.int(1, 4), rng.int(1, 4)];
        const [lo, hi] = [c - a, c + b];
        const sign = k > 0 ? ["positive", "正"] : ["negative", "负"];
        const opposite = k > 0 ? ["negative", "负"] : ["positive", "正"];
        if (rng.bool()) {
          // ∫ k/(x − c)² naively gives −k/b − k/a.
          const naive = Q.of(-k, b).sub(Q.of(k, a));
          const f = recip(k, c, 2);
          const I = `\\int_{${lo}}^{${hi}} ${f} \\, dx`;
          const fromT = joinTerms([fracTerm(Q.of(k), "", bare(c, "t")).replace("\\frac{}", "\\frac{1}"), Q.of(-k, b).toLatex()]);
          return convergenceProblem(
            rng,
            I,
            diverges,
            [
              [
                converges(naive.toLatex()),
                `This applies the fundamental theorem across $x = ${c}$, where the integrand is unbounded. The integrand is ${sign[0]}, yet this value is ${opposite[0]}.`,
                `这是跨过 $x = ${c}$ 直接套用基本定理得到的，而被积函数在那里无界。被积函数为${sign[1]}，这个值却为${opposite[1]}。`,
              ],
              [
                converges(naive.neg().toLatex()),
                `This has the right sign, but no finite value is right: the part from $${c}$ to $${hi}$ diverges.`,
                `这个值的符号对了，但任何有限值都不对：从 $${c}$ 到 $${hi}$ 的部分发散。`,
              ],
              [
                converges("0"),
                "The two parts do not cancel. Both have the sign of the integrand, and both diverge.",
                "两部分不会相互抵消。它们都与被积函数同号，而且都发散。",
              ],
            ],
            walked(
              [
                [
                  ["Look for a discontinuity", "寻找间断点"],
                  t(
                    `The integrand is unbounded at $x = ${c}$, which lies inside $[${lo}, ${hi}]$, so split there:`,
                    `被积函数在 $x = ${c}$ 处无界，而它在 $[${lo}, ${hi}]$ 内部，所以在那里拆开：`,
                  ),
                  [`${I} = \\int_{${lo}}^{${c}} ${f} \\, dx + \\int_{${c}}^{${hi}} ${f} \\, dx`],
                ],
                [
                  ["Test the right part", "检查右边的部分"],
                  t(
                    `An antiderivative is $${recip(-k, c)}$. Integrate from $t$, just to the right of $${c}$, to $${hi}$:`,
                    `原函数为 $${recip(-k, c)}$。从 $${c}$ 右侧附近的 $t$ 积到 $${hi}$：`,
                  ),
                  [`\\int_{t}^{${hi}} ${f} \\, dx = ${fromT}`],
                ],
                [
                  ["Conclude", "得出结论"],
                  t(
                    `As $t \\to ${c}^{+}$, the denominator $${bare(c, "t")}$ tends to $0$, so the first term is unbounded. This part diverges, and so does the whole integral.`,
                    `当 $t \\to ${c}^{+}$ 时，分母 $${bare(c, "t")}$ 趋于 $0$，第一项无界。这一部分发散，所以整个积分发散。`,
                  ),
                ],
              ],
              t(
                `The integrand is ${sign[0]} wherever it is defined, so any value would have to be ${sign[0]}. The fundamental theorem applied across $x = ${c}$ gives $${naive.toLatex()}$, which is ${opposite[0]}, so that shortcut cannot be right.`,
                `被积函数在有定义的地方都为${sign[1]}，所以任何积分值都应为${sign[1]}。跨过 $x = ${c}$ 直接套用基本定理得到 $${naive.toLatex()}$，它为${opposite[1]}，可见这种做法是错误的。`,
              ),
            ),
          );
        }
        const [m, n] = [rng.int(1, 3), rng.int(1, 3)];
        const v = Q.of(3 * k * (n + m));
        const f = fracWith(k, "", "\\sqrt[3]{x^{2}}").replace("\\frac{}", "\\frac{1}");
        const I = `\\int_{${-(m ** 3)}}^{${n ** 3}} ${f} \\, dx`;
        const anti = `${coef(Q.of(3 * k))}x^{1/3}`;
        const [Flo, Fhi] = [Q.of(-3 * k * m), Q.of(3 * k * n)];
        const parts = [
          `\\int_{${-(m ** 3)}}^{0} ${f} \\, dx = 0 - ${wrap(Flo.toLatex())} = ${Flo.neg().toLatex()}`,
          `\\int_{0}^{${n ** 3}} ${f} \\, dx = ${Fhi.toLatex()}`,
          `${Flo.neg().toLatex()} + ${wrap(Fhi.toLatex())} = ${v.toLatex()}`,
        ];
        return convergenceProblem(
          rng,
          I,
          converges(v.toLatex()),
          [
            [
              diverges,
              "Being unbounded at $0$ is not enough to diverge. Near $0$ the integrand is a multiple of $x^{-2/3}$, and $p = \\frac{2}{3} < 1$, so both parts converge.",
              "在 $0$ 处无界并不一定发散。在 $0$ 附近，被积函数是 $x^{-2/3}$ 的倍数，$p = \\frac{2}{3} < 1$，所以两部分都收敛。",
            ],
            [
              converges(Q.of(3 * k * (n - m)).toLatex()),
              `This takes the cube root of $${-(m ** 3)}$ as $${m}$. The cube root of a negative number is negative: it is $${-m}$.`,
              `这里把 $${-(m ** 3)}$ 的立方根当成了 $${m}$。负数的立方根是负数，应为 $${-m}$。`,
            ],
            [
              converges(v.neg().toLatex()),
              `The sign is reversed. The integrand is ${k > 0 ? "positive" : "negative"} on both sides of $0$, so the value must be too.`,
              `符号反了。被积函数在 $0$ 的两侧都为${k > 0 ? "正" : "负"}，积分值也应为${k > 0 ? "正" : "负"}。`,
            ],
          ],
          walked(
            [
              [
                ["Look for a discontinuity", "寻找间断点"],
                t(
                  `The integrand is unbounded at $x = 0$, inside the interval. Near $0$ it is $${coef(Q.of(k))}x^{-2/3}$, and $p = \\frac{2}{3} < 1$, so both parts converge by the $p$-test.`,
                  `被积函数在区间内部的 $x = 0$ 处无界。在 $0$ 附近，它是 $${coef(Q.of(k))}x^{-2/3}$，$p = \\frac{2}{3} < 1$，由 $p$ 判别法两部分都收敛。`,
                ),
              ],
              [
                ["Evaluate", "计算"],
                t(
                  `An antiderivative is $${anti}$, which is continuous at $0$, so it can be evaluated across the whole interval:`,
                  `原函数为 $${anti}$，它在 $0$ 处连续，所以可以在整个区间上直接计算：`,
                ),
                [`${I} = ${Fhi.toLatex()} - ${wrap(Flo.toLatex())} = ${v.toLatex()}`],
              ],
            ],
            t(`Evaluate the two parts separately and add them:${shown(...parts)}`, `分别计算两部分，再相加：${shown(...parts)}`),
          ),
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
