import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import {
  type Coefficient,
  type Compass,
  dec,
  gcd,
  linear,
  num,
  type PlaneMark,
  type PlaneView,
  type Point,
  paren,
  plane,
  poly,
  Q,
  realLine,
} from "@ga/subject-math";
import { algebraDrawings } from "../explanation-drawings-algebra.ts";
import { annotate, onAxis, plain, setText as setAlt } from "../graph-figures.ts";
import { choiceProblem, expressionProblem, intervalProblem, numberProblem, steps, why } from "../problems.ts";
import { toQ, valueTable } from "../solution-kit.ts";

/** Factors are variables with integer exponents, such as [["x", 3], ["y", -2]]. */
type Factors = readonly (readonly [string, number])[];

/** pw writes a variable to a power: "x", "x^{3}", "x^{-2}". */
const pw = (v: string, e: number) => (e === 1 ? v : `${v}^{${e}}`);

/** vars writes the factors with nonzero exponents, exponents as given: "x^{-3}y^{2}". */
const vars = (f: Factors) =>
  f
    .filter(([, e]) => e !== 0)
    .map(([v, e]) => pw(v, e))
    .join("");

/** mono writes c times the factors, negative exponents included: mono(Q.of(3, 4), [["x", -2]]) is "\frac{3}{4}x^{-2}". */
function mono(c: Coefficient, f: Factors): string {
  const v = toQ(c);
  const body = vars(f);
  if (body === "") return v.toLatex();
  return v.eq(Q.one) ? body : v.eq(Q.of(-1)) ? `-${body}` : `${v.toLatex()}${body}`;
}

/** positive writes c times the factors with positive exponents only, as one fraction: "-\frac{3y^{2}}{4x^{5}}". */
function positive(c: Coefficient, f: Factors): string {
  const v = toQ(c);
  const top = vars(f.filter(([, e]) => e > 0));
  const bottom = vars(f.filter(([, e]) => e < 0).map(([x, e]) => [x, -e] as const));
  const n = v.abs().n;
  const d = v.d;
  const numerator = top === "" ? `${n}` : n === 1n ? top : `${n}${top}`;
  const denominator = bottom === "" ? (d === 1n ? "" : `${d}`) : d === 1n ? bottom : `${d}${bottom}`;
  const body = denominator === "" ? numerator : `\\frac{${numerator}}{${denominator}}`;
  return v.sign() < 0 ? `-${body}` : body;
}

/** root writes the nth root of inner: "\sqrt{x}", "\sqrt[3]{x^{2}}". */
const root = (n: number, inner: string) => (n === 2 ? `\\sqrt{${inner}}` : `\\sqrt[${n}]{${inner}}`);

/** fracExp writes a rational exponent: "3", "\frac{2}{3}", "-\frac{1}{2}". */
const fracExp = (p: number, q: number) => Q.of(p, q).toLatex();

/** plusExp writes the sum of two exponents for a solution step: "3 + (-5)". */
const plusExp = (a: Coefficient, b: Coefficient) => `${num(a)} + ${paren(b)}`;

/** grouped writes a number in decimal notation with thin-space thousands separators when it has five digits or more. */
function grouped(c: Coefficient): string {
  const s = dec(c);
  const [whole = "", frac] = s.replace("-", "").split(".");
  const g = whole.length > 4 ? whole.replace(/\B(?=(\d{3})+$)/g, "{,}") : whole;
  return `${s.startsWith("-") ? "-" : ""}${g}${frac ? `.${frac}` : ""}`;
}

/** roundQ rounds a nonnegative number to the nearest multiple of 1/scale, halves up. */
function roundQ(v: Q, scale = 1): Q {
  const s = BigInt(scale);
  return Q.of((2n * v.n * s + v.d) / (2n * v.d), s);
}

/** pickCoprime draws a, b from the ranges with gcd(a, b) = 1. */
function pickCoprime(rng: Rng, a: [number, number], b: [number, number]): [number, number] {
  for (;;) {
    const x = rng.int(a[0], a[1]);
    const y = rng.int(b[0], b[1]);
    if (gcd(x, y) === 1) return [x, y];
  }
}

/** expo writes a·b^v with the base given in LaTeX: "3(2)^{x}", "2^{x}", "500(1.04)^{t}", "8\left(\frac{1}{2}\right)^{x}". */
function expo(a: Coefficient, base: string, v = "x"): string {
  const A = toQ(a);
  const fraction = base.startsWith("\\frac");
  const lead = A.eq(Q.one) ? "" : A.eq(Q.of(-1)) ? "-" : A.toLatex();
  if (fraction) return `${lead}\\left(${base}\\right)^{${v}}`;
  if (lead === "" && !base.includes(".")) return `${base}^{${v}}`;
  return `${lead}(${base})^{${v}}`;
}

/** cap capitalizes the first letter of an English phrase. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const posEn = "Write the answer with positive exponents only.";
const posZh = "结果只用正指数表示。";

/**
 * positiveProblem asks to simplify expr to c times the factors, written with positive exponents only; the solution
 * gives the rule, the chain of steps, the move of the negative powers, and the check.
 */
function positiveProblem(
  expr: string,
  c: Coefficient,
  f: Factors,
  work: readonly string[],
  lead: Text,
  wrong: readonly string[],
  check: Text,
): Problem {
  const answer = positive(c, f);
  const all = [...work, answer].join(" = ");
  const move = f.some(([, e]) => e < 0)
    ? t(
        "A negative exponent stands for a reciprocal, $x^{-k} = \\frac{1}{x^{k}}$, so each power with a negative exponent moves to the denominator with a positive exponent; the coefficient stays where it is.",
        "负指数表示倒数，$x^{-k} = \\frac{1}{x^{k}}$，所以每个负指数幂都移到分母，并改为正指数；系数不动。",
      )
    : t("Every exponent is already positive, so nothing has to move.", "所有指数都已经是正的，不需要移动。");
  return expressionProblem({
    prompt: t(`Simplify $${expr}$. ${posEn}`, `化简 $${expr}$。${posZh}`),
    answer,
    lowest: true,
    wrong: [mono(c, f), ...wrong],
    solution: t(
      `${lead.en}${steps(`${expr} = ${all}`)}${move.en}\n\n${check.en}`,
      `${lead["zh-CN"]}${steps(`${expr} = ${all}`)}${move["zh-CN"]}\n\n${check["zh-CN"]}`,
    ),
  });
}

/** ExponentCheck is the check of an exponent problem at v = 2: the question worked out with numbers, and the answer there. */
interface ExponentCheck {
  /** numeric is the question at v = 2 combined into one power, as "x^{5} \cdot x^{-1} = x^{4}". */
  readonly numeric: string;
  /** answerAt is the answer with v replaced by (2), as "3(2) - 2". */
  readonly answerAt: string;
  /** value is the exponent at v = 2. */
  readonly value: number;
}

/**
 * exponentProblem asks for the exponent, an expression in v, of a power of base written as a single power. The lead
 * names the rule that combines the exponents, and the check puts v = 2 into the question and into the answer.
 */
function exponentProblem(
  expr: string,
  base: string,
  v: string,
  answer: string,
  work: string,
  wrong: readonly string[],
  lead: Text,
  check: ExponentCheck,
): Problem {
  const chain = steps(`${expr} = ${work} = ${base}^{${answer}}`);
  return expressionProblem({
    prompt: t(
      `Write $${expr}$ as a single power of $${base}$. What is its exponent? Answer in terms of $${v}$.`,
      `把 $${expr}$ 写成 $${base}$ 的一个幂。它的指数是多少？用 $${v}$ 表示。`,
    ),
    answer,
    simplified: true,
    wrong,
    solution: t(
      `${lead.en}${chain}Combining like terms in the exponent leaves $${answer}$.\n\n**Check.** Put $${v} = 2$ into the question: $${check.numeric}$. The answer gives the same exponent: at $${v} = 2$ it is $${check.answerAt} = ${check.value}$.`,
      `${lead["zh-CN"]}${chain}合并指数中的同类项，得到 $${answer}$。\n\n**检验。** 在原式中令 $${v} = 2$：$${check.numeric}$。答案给出相同的指数：$${v} = 2$ 时它等于 $${check.answerAt} = ${check.value}$。`,
    ),
  });
}

/** at2 writes the exponent a·v + b with v replaced by (2), for a check: "3(2) - 1". */
const at2 = (a: number, b: number) => linear(a, b, "(2)");

/** val2 is the value of the exponent a·v + b at v = 2. */
const val2 = (a: number, b: number) => 2 * a + b;

/** combo writes the exponent k·n + r worked out for a check, as "$-2 \cdot 3 + 5 = -1$", leaving out unit factors and a zero term. */
function combo(k: number, n: number, r: number): string {
  const product = n === 1 ? `${k}` : k === 1 ? `${n}` : k === -1 ? `-${n}` : `${k} \\cdot ${n}`;
  if (r === 0) return n === 1 ? `$${k}$` : `$${product} = ${k * n}$`;
  return `$${product} + ${paren(r)} = ${k * n + r}$`;
}

/** algebraicExponent draws a linear exponent a·v + b with a ≠ 0. */
function algebraicExponent(rng: Rng, v: string): { a: number; b: number; latex: string } {
  const a = rng.pick([1, 1, 2, 3, 4, 5, -1, -2]);
  const b = rng.int(-6, 6);
  return { a, b, latex: linear(a, b, v) };
}

/** powerBase draws the base of a power with an algebraic exponent, and the letter of the exponent. */
function powerBase(rng: Rng): { base: string; v: string } {
  return { base: rng.pick(["x", "x", "y", "a", "2", "3", "5", "10"]), v: rng.pick(["n", "n", "m", "k"]) };
}

// Unit: rules of exponents with algebraic expressions.

export const writingRadicalsUsingFractionalExponents: TopicDef = {
  id: "writing-radicals-using-fractional-exponents",
  title: t("Writing Radical Expressions Using Fractional Exponents", "用分数指数表示根式"),
  summary: t(
    "Read $a^{\\frac{1}{n}}$ as an $n$th root and $a^{\\frac{m}{n}}$ as a root raised to a power, and convert between radicals and fractional exponents.",
    "把 $a^{\\frac{1}{n}}$ 理解为 $n$ 次方根，把 $a^{\\frac{m}{n}}$ 理解为方根的乘方，并在根式与分数指数之间互相转换。",
  ),
  prerequisites: ["cube-roots-of-algebraic-perfect-cubes"],
  encompasses: [{ topic: "square-roots-and-cube-roots", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSN.RN.A.1", "CCSS.HSN.RN.A.2"],
  intro: t(
    `So far an exponent has counted factors: $2^{3} = 2 \\cdot 2 \\cdot 2$, and $x^{m} \\cdot x^{n} = x^{m + n}$ because the factors of the two powers are simply put together. A fractional exponent such as $9^{\\frac{1}{2}}$ cannot count factors, since there is no "half a factor". Instead we **define** it so that the rules of exponents keep working.

Suppose $9^{\\frac{1}{2}}$ obeys the product rule. Then

$$9^{\\frac{1}{2}} \\cdot 9^{\\frac{1}{2}} = 9^{\\frac{1}{2} + \\frac{1}{2}} = 9^{1} = 9.$$

So $9^{\\frac{1}{2}}$ is a number whose square is $9$: it must be $\\sqrt{9} = 3$. In the same way three equal factors $27^{\\frac{1}{3}}$ multiply to $27^{1}$, so $27^{\\frac{1}{3}} = \\sqrt[3]{27} = 3$. An exponent $\\frac{1}{n}$ is a root of index $n$, and a numerator in the exponent is a power taken as well.

This gives two ways of writing the same number, as a radical and as a power, and we will move between them freely. Powers are often easier to work with, because all the rules of exponents apply to them.`,
    `到目前为止，指数都是在数因数的个数：$2^{3} = 2 \\cdot 2 \\cdot 2$；而 $x^{m} \\cdot x^{n} = x^{m + n}$，是因为两个幂的因数被放到了一起。像 $9^{\\frac{1}{2}}$ 这样的分数指数没法数因数，因为不存在“半个因数”。我们改为这样**规定**它：让指数法则继续成立。

假设 $9^{\\frac{1}{2}}$ 服从同底数幂的乘法法则，那么

$$9^{\\frac{1}{2}} \\cdot 9^{\\frac{1}{2}} = 9^{\\frac{1}{2} + \\frac{1}{2}} = 9^{1} = 9.$$

所以 $9^{\\frac{1}{2}}$ 是平方等于 $9$ 的数，它只能是 $\\sqrt{9} = 3$。同样，三个相同的因数 $27^{\\frac{1}{3}}$ 相乘得 $27^{1}$，所以 $27^{\\frac{1}{3}} = \\sqrt[3]{27} = 3$。指数 $\\frac{1}{n}$ 就是 $n$ 次方根，而指数的分子表示再取乘方。

这样，同一个数就有了两种写法：根式和幂。我们会在两者之间自由转换。幂往往更好算，因为所有指数法则都适用于它。`,
  ),
  knowledgePoints: [
    {
      id: "unit-fraction-exponents",
      title: t("Exponents $\\frac{1}{n}$", "指数 $\\frac{1}{n}$"),
      explanation: t(
        `The power rule $(a^{m})^{n} = a^{mn}$ should keep working for fractional exponents. Then

$$\\left(8^{\\frac{1}{3}}\\right)^{3} = 8^{\\frac{1}{3} \\cdot 3} = 8^{1} = 8,$$

so $8^{\\frac{1}{3}}$ is the number whose cube is $8$: the cube root. In general

$$a^{\\frac{1}{n}} = \\sqrt[n]{a}.$$

To evaluate $81^{\\frac{1}{4}}$, ask which number raised to the fourth power gives $81$. Since $3^{4} = 81$, $81^{\\frac{1}{4}} = 3$. A fraction works the same way, root of the top over root of the bottom: $\\left(\\frac{1}{25}\\right)^{\\frac{1}{2}} = \\frac{1}{5}$. An odd root of a negative number is negative: $(-27)^{\\frac{1}{3}} = -3$, because $(-3)^{3} = -27$.

> **Watch out.** The exponent $\\frac{1}{n}$ is a root, not a division: $8^{\\frac{1}{3}}$ is $2$, not $\\frac{8}{3}$. And it is not a negative exponent either, so it does not turn the number into its reciprocal: $25^{\\frac{1}{2}} = 5$, not $\\frac{1}{5}$.`,
        `幂的乘方法则 $(a^{m})^{n} = a^{mn}$ 对分数指数也应成立。于是

$$\\left(8^{\\frac{1}{3}}\\right)^{3} = 8^{\\frac{1}{3} \\cdot 3} = 8^{1} = 8,$$

所以 $8^{\\frac{1}{3}}$ 是立方等于 $8$ 的数，即立方根。一般地

$$a^{\\frac{1}{n}} = \\sqrt[n]{a}.$$

计算 $81^{\\frac{1}{4}}$ 时，问自己：哪个数的四次方等于 $81$？因为 $3^{4} = 81$，所以 $81^{\\frac{1}{4}} = 3$。分数也一样，分子、分母分别开方：$\\left(\\frac{1}{25}\\right)^{\\frac{1}{2}} = \\frac{1}{5}$。负数的奇次方根是负数：$(-27)^{\\frac{1}{3}} = -3$，因为 $(-3)^{3} = -27$。

> **注意。** 指数 $\\frac{1}{n}$ 表示开方，不是除法：$8^{\\frac{1}{3}}$ 等于 $2$，而不是 $\\frac{8}{3}$。它也不是负指数，不会把数变成倒数：$25^{\\frac{1}{2}} = 5$，而不是 $\\frac{1}{5}$。`,
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      generate(rng) {
        const n = rng.pick([2, 2, 3, 3, 4, 5]);
        const r = rng.int(2, ({ 2: 20, 3: 6, 4: 4, 5: 3 } as Record<number, number>)[n]!);
        const kind = n % 2 === 1 && rng.bool(0.25) ? "negative" : rng.bool(0.2) ? "reciprocal" : "plain";
        const p = r ** n;
        const base = kind === "negative" ? `(-${p})` : kind === "reciprocal" ? `\\left(\\frac{1}{${p}}\\right)` : `${p}`;
        const inside = kind === "negative" ? `-${p}` : kind === "reciprocal" ? `\\frac{1}{${p}}` : `${p}`;
        const value = kind === "negative" ? Q.of(-r) : kind === "reciprocal" ? Q.of(1, r) : Q.of(r);
        const power =
          kind === "negative"
            ? `(${value.toLatex()})^{${n}}`
            : kind === "reciprocal"
              ? `\\left(${value.toLatex()}\\right)^{${n}}`
              : `${r}^{${n}}`;
        return numberProblem({
          prompt: t(`Evaluate $${base}^{\\frac{1}{${n}}}$.`, `计算 $${base}^{\\frac{1}{${n}}}$。`),
          answer: value,
          wrong: [kind === "reciprocal" ? Q.of(1, p * n) : Q.of(kind === "negative" ? -p : p, n), value.neg(), Q.one.div(value)],
          solution: t(
            `**Step 1: read the exponent.** The exponent $\\frac{1}{${n}}$ means the root of index $${n}$, so we need the number whose ${({ 2: "square", 3: "cube", 4: "fourth power", 5: "fifth power" } as Record<number, string>)[n]} is $${inside}$:${steps(`${base}^{\\frac{1}{${n}}} = ${root(n, inside)}`)}**Step 2: find the root.** ${kind === "reciprocal" ? `Take the root of the numerator and of the denominator: $${root(n, "1")} = 1$ and $${root(n, String(p))} = ${r}$, so` : kind === "negative" ? `The index $${n}$ is odd, so the root of a negative number is negative:` : `Since $${r}^{${n}} = ${p}$,`}${steps(`${root(n, inside)} = ${value.toLatex()}`)}**Check.** $${power} = ${inside}$, the number under the root.`,
            `**第一步：读懂指数。** 指数 $\\frac{1}{${n}}$ 表示 $${n}$ 次方根，所以要找${n === 2 ? "平方" : n === 3 ? "立方" : ` $${n}$ 次方`}等于 $${inside}$ 的数：${steps(`${base}^{\\frac{1}{${n}}} = ${root(n, inside)}`)}**第二步：开方。** ${kind === "reciprocal" ? `分子、分母分别开方：$${root(n, "1")} = 1$，$${root(n, String(p))} = ${r}$，所以` : kind === "negative" ? `根指数 $${n}$ 是奇数，负数的奇次方根是负数：` : `因为 $${r}^{${n}} = ${p}$，`}${steps(`${root(n, inside)} = ${value.toLatex()}`)}**检验。** $${power} = ${inside}$，正是根号下的数。`,
          ),
        });
      },
    },
    {
      id: "rational-exponents",
      title: t("Exponents $\\frac{m}{n}$", "指数 $\\frac{m}{n}$"),
      explanation: t(
        `Since $\\frac{m}{n} = \\frac{1}{n} \\cdot m$, the power rule gives

$$a^{\\frac{m}{n}} = \\left(a^{\\frac{1}{n}}\\right)^{m} = \\left(\\sqrt[n]{a}\\right)^{m}.$$

The denominator is the root and the numerator the power. Take the root first to keep the numbers small:

$$8^{\\frac{2}{3}} = \\left(\\sqrt[3]{8}\\right)^{2} = 2^{2} = 4.$$

Taking the power first gives the same number, $\\sqrt[3]{8^{2}} = \\sqrt[3]{64} = 4$, only with larger numbers on the way. A negative exponent still means the reciprocal, so first work out the positive power and then flip it: $8^{-\\frac{2}{3}} = \\frac{1}{8^{\\frac{2}{3}}} = \\frac{1}{4}$.

> **Watch out.** Do not multiply the base by the exponent: $8^{\\frac{2}{3}}$ is not $8 \\cdot \\frac{2}{3} = \\frac{16}{3}$. And keep the minus sign of a negative exponent as a reciprocal, not as a negative answer: $8^{-\\frac{2}{3}} = \\frac{1}{4}$, not $-4$.`,
        `因为 $\\frac{m}{n} = \\frac{1}{n} \\cdot m$，由幂的乘方法则得

$$a^{\\frac{m}{n}} = \\left(a^{\\frac{1}{n}}\\right)^{m} = \\left(\\sqrt[n]{a}\\right)^{m}.$$

分母表示开方的次数，分子表示乘方的次数。先开方可以让数保持较小：

$$8^{\\frac{2}{3}} = \\left(\\sqrt[3]{8}\\right)^{2} = 2^{2} = 4.$$

先乘方也得到同一个数，$\\sqrt[3]{8^{2}} = \\sqrt[3]{64} = 4$，只是中间的数更大。负指数仍然表示倒数，所以先算出正指数幂，再取倒数：$8^{-\\frac{2}{3}} = \\frac{1}{8^{\\frac{2}{3}}} = \\frac{1}{4}$。

> **注意。** 不要用底数乘以指数：$8^{\\frac{2}{3}}$ 不是 $8 \\cdot \\frac{2}{3} = \\frac{16}{3}$。负指数的负号表示取倒数，而不是让结果变成负数：$8^{-\\frac{2}{3}} = \\frac{1}{4}$，而不是 $-4$。`,
      ),
      keyPrerequisites: ["zero-and-negative-exponents"],
      generate(rng) {
        const n = rng.pick([2, 2, 3, 3, 4, 5]);
        const r = rng.int(2, ({ 2: 10, 3: 5, 4: 3, 5: 2 } as Record<number, number>)[n]!);
        const ms = [2, 3, 4, 5].filter((m) => gcd(m, n) === 1 && r ** m <= 1000);
        const m = rng.pick(ms);
        const p = r ** n;
        const negative = rng.bool(0.3);
        const e = negative ? `-\\frac{${m}}{${n}}` : `\\frac{${m}}{${n}}`;
        const positiveValue = Q.of(r ** m);
        const value = negative ? Q.one.div(positiveValue) : positiveValue;
        const work = `(${root(n, String(p))})^{${m}} = ${r}^{${m}} = ${r ** m}`;
        return numberProblem({
          prompt: t(`Evaluate $${p}^{${e}}$.`, `计算 $${p}^{${e}}$。`),
          answer: value,
          wrong: [negative ? positiveValue : Q.one.div(positiveValue), negative ? positiveValue.neg() : Q.of(r * m)],
          mistakes: [
            why(
              Q.of(p * m, n),
              "You multiplied the base by the exponent. The denominator of the exponent is a root and the numerator is a power.",
              "你用底数乘了指数。指数的分母表示开方，分子表示乘方。",
            ),
          ],
          solution: negative
            ? t(
                `**Step 1: the minus sign.** A negative exponent means the reciprocal of the positive power:${steps(`${p}^{${e}} = \\frac{1}{${p}^{\\frac{${m}}{${n}}}}`)}**Step 2: the positive power.** The denominator $${n}$ is the root and the numerator $${m}$ the power; take the root first, since $${r}^{${n}} = ${p}$:${steps(`${p}^{\\frac{${m}}{${n}}} = ${work}`)}So $${p}^{${e}} = ${value.toLatex()}$.\n\n**Check.** Raising the answer to the power $${n}$ should undo the root: $\\left(${value.toLatex()}\\right)^{${n}} = \\frac{1}{${r}^{${m * n}}} = \\frac{1}{(${r}^{${n}})^{${m}}} = \\frac{1}{${p}^{${m}}} = ${p}^{-${m}}$, which is $\\left(${p}^{${e}}\\right)^{${n}}$.`,
                `**第一步：负号。** 负指数表示正指数幂的倒数：${steps(`${p}^{${e}} = \\frac{1}{${p}^{\\frac{${m}}{${n}}}}`)}**第二步：正指数幂。** 分母 $${n}$ 表示开方，分子 $${m}$ 表示乘方；因为 $${r}^{${n}} = ${p}$，先开方：${steps(`${p}^{\\frac{${m}}{${n}}} = ${work}`)}所以 $${p}^{${e}} = ${value.toLatex()}$。\n\n**检验。** 把答案乘 $${n}$ 次方，应当抵消开方：$\\left(${value.toLatex()}\\right)^{${n}} = \\frac{1}{${r}^{${m * n}}} = \\frac{1}{(${r}^{${n}})^{${m}}} = \\frac{1}{${p}^{${m}}} = ${p}^{-${m}}$，正是 $\\left(${p}^{${e}}\\right)^{${n}}$。`,
              )
            : t(
                `The denominator $${n}$ is the root and the numerator $${m}$ the power. Take the root first, since $${r}^{${n}} = ${p}$, then raise it to the power $${m}$:${steps(`${p}^{${e}} = ${work}`)}**Check.** Raising the answer to the power $${n}$ should undo the root: $${r ** m}^{${n}} = ${r}^{${m * n}} = (${r}^{${n}})^{${m}} = ${p}^{${m}}$, which is $\\left(${p}^{${e}}\\right)^{${n}}$.`,
                `分母 $${n}$ 表示开方，分子 $${m}$ 表示乘方。因为 $${r}^{${n}} = ${p}$，先开方，再乘 $${m}$ 次方：${steps(`${p}^{${e}} = ${work}`)}**检验。** 把答案乘 $${n}$ 次方，应当抵消开方：$${r ** m}^{${n}} = ${r}^{${m * n}} = (${r}^{${n}})^{${m}} = ${p}^{${m}}$，正是 $\\left(${p}^{${e}}\\right)^{${n}}$。`,
              ),
        });
      },
    },
    {
      id: "radicals-as-powers",
      title: t("Writing radicals as powers", "把根式写成幂"),
      explanation: t(
        `Read $a^{\\frac{m}{n}} = \\sqrt[n]{a^{m}}$ backwards: the **index** of the root becomes the **denominator** of the exponent, and the power under the root the **numerator**. A plain $\\sqrt{x}$ has index $2$ and power $1$, so it is $x^{\\frac{1}{2}}$. For $x > 0$:

$$\\sqrt[5]{x^{3}} = x^{\\frac{3}{5}} \\qquad \\left(\\sqrt[4]{x}\\right)^{7} = x^{\\frac{7}{4}} \\qquad \\frac{1}{\\sqrt[3]{x^{2}}} = x^{-\\frac{2}{3}}$$

The power may sit inside or outside the root; it is the numerator either way. A root in a denominator is a reciprocal, so its exponent is negative. Simplify the fraction in the exponent when you can: $\\sqrt[6]{x^{4}} = x^{\\frac{4}{6}} = x^{\\frac{2}{3}}$.

> **Watch out.** Do not turn the fraction upside down: $\\sqrt[5]{x^{3}}$ is $x^{\\frac{3}{5}}$, not $x^{\\frac{5}{3}}$; the root goes in the denominator. And a root is not a multiplication: the exponent is $\\frac{3}{5}$, not $3 \\cdot 5$ or just $3$.`,
        `把 $a^{\\frac{m}{n}} = \\sqrt[n]{a^{m}}$ 倒过来读：根式的**根指数**成为指数的**分母**，根号下的幂指数成为**分子**。单独的 $\\sqrt{x}$ 根指数为 $2$、幂指数为 $1$，所以它是 $x^{\\frac{1}{2}}$。当 $x > 0$ 时：

$$\\sqrt[5]{x^{3}} = x^{\\frac{3}{5}} \\qquad \\left(\\sqrt[4]{x}\\right)^{7} = x^{\\frac{7}{4}} \\qquad \\frac{1}{\\sqrt[3]{x^{2}}} = x^{-\\frac{2}{3}}$$

幂指数写在根号里面或外面都一样，都是分子。根式在分母中表示倒数，所以指数为负。指数中的分数能约分就要约分：$\\sqrt[6]{x^{4}} = x^{\\frac{4}{6}} = x^{\\frac{2}{3}}$。

> **注意。** 不要把分数颠倒：$\\sqrt[5]{x^{3}}$ 是 $x^{\\frac{3}{5}}$，而不是 $x^{\\frac{5}{3}}$；根指数放在分母。开方也不是乘法：指数是 $\\frac{3}{5}$，而不是 $3 \\cdot 5$，也不只是 $3$。`,
      ),
      generate(rng) {
        const n = rng.int(2, 7);
        let m = rng.int(1, 9);
        while (m === n) m = rng.int(1, 9);
        const inverse = rng.bool(0.3);
        const shape = rng.int(0, 2);
        const radical = shape === 0 && m > 1 ? `\\left(${root(n, "x")}\\right)^{${m}}` : root(n, m === 1 ? "x" : `x^{${m}}`);
        const expr = inverse ? `\\frac{1}{${radical}}` : radical;
        const s = inverse ? -1 : 1;
        const k = Q.of(s * m, n);
        return numberProblem({
          prompt: t(
            `For $x > 0$, write $${expr}$ as a power $x^{k}$. What is $k$?`,
            `设 $x > 0$。把 $${expr}$ 写成幂 $x^{k}$ 的形式，$k$ 是多少？`,
          ),
          answer: k,
          solveFor: "k",
          wrong: [Q.of(s * n, m), Q.of(-s * m, n), Q.of(s * m * n), Q.of(s * m)],
          solution: t(
            `The index $${n}$ of the root is the denominator and the power $${m}$ the numerator${inverse ? "; the root is in a denominator, so it is a reciprocal and the exponent is negative" : ""}:${steps(`${expr} = x^{${inverse ? "-" : ""}\\frac{${m}}{${n}}}${gcd(m, n) === 1 ? "" : ` = x^{${k.toLatex()}}`}`)}${gcd(m, n) === 1 ? "" : `The fraction $\\frac{${m}}{${n}}$ reduces to $${Q.of(m, n).toLatex()}$. `}So $k = ${k.toLatex()}$.\n\n**Check.** Take $x = 2^{${n}}$. The radical is $${root(n, `2^{${n * m}}`)} = ${pw("2", m)}$${inverse ? `, in the denominator, so the expression is $2^{${-m}}$` : ""}, and the power is $x^{${k.toLatex()}} = 2^{${n} \\cdot ${paren(k)}} = ${pw("2", s * m)}$: they agree.`,
            `根指数 $${n}$ 是分母，幂指数 $${m}$ 是分子${inverse ? "；根式在分母中表示倒数，所以指数为负" : ""}：${steps(`${expr} = x^{${inverse ? "-" : ""}\\frac{${m}}{${n}}}${gcd(m, n) === 1 ? "" : ` = x^{${k.toLatex()}}`}`)}${gcd(m, n) === 1 ? "" : `分数 $\\frac{${m}}{${n}}$ 约分为 $${Q.of(m, n).toLatex()}$。`}所以 $k = ${k.toLatex()}$。\n\n**检验。** 取 $x = 2^{${n}}$。根式为 $${root(n, `2^{${n * m}}`)} = ${pw("2", m)}$${inverse ? `，它在分母中，所以整个式子是 $2^{${-m}}$` : ""}；幂为 $x^{${k.toLatex()}} = 2^{${n} \\cdot ${paren(k)}} = ${pw("2", s * m)}$：两者相同。`,
          ),
        });
      },
    },
    {
      id: "powers-as-radicals",
      title: t("Writing powers as radicals", "把幂写成根式"),
      explanation: t(
        `To write $x^{\\frac{m}{n}}$ as a radical, split the exponent as $\\frac{m}{n} = m \\cdot \\frac{1}{n}$: the power $m$ and the root of index $n$. So put $x^{m}$ under a root of index $n$:

$$x^{\\frac{m}{n}} = \\sqrt[n]{x^{m}} = \\left(\\sqrt[n]{x}\\right)^{m}$$

For $x^{\\frac{2}{5}}$ the denominator $5$ is the index and the numerator $2$ the power: $\\sqrt[5]{x^{2}}$. A negative exponent is a reciprocal, so it puts the radical in a denominator: $x^{-\\frac{3}{4}} = \\frac{1}{\\sqrt[4]{x^{3}}}$.

> **Watch out.** Do not swap the roles: $x^{\\frac{2}{3}}$ is $\\sqrt[3]{x^{2}}$, not $\\sqrt{x^{3}}$. The exponent is not a division either, so $x^{\\frac{2}{3}}$ is not $\\frac{x^{2}}{3}$. And a negative exponent gives a reciprocal, never a negative radical: $x^{-\\frac{3}{4}}$ is not $-\\sqrt[4]{x^{3}}$.`,
        `把 $x^{\\frac{m}{n}}$ 写成根式时，把指数拆成 $\\frac{m}{n} = m \\cdot \\frac{1}{n}$：乘 $m$ 次方，再开 $n$ 次方。所以把 $x^{m}$ 放在 $n$ 次根号下：

$$x^{\\frac{m}{n}} = \\sqrt[n]{x^{m}} = \\left(\\sqrt[n]{x}\\right)^{m}$$

对 $x^{\\frac{2}{5}}$，分母 $5$ 是根指数，分子 $2$ 是幂指数：$\\sqrt[5]{x^{2}}$。负指数表示倒数，所以会把根式放到分母中：$x^{-\\frac{3}{4}} = \\frac{1}{\\sqrt[4]{x^{3}}}$。

> **注意。** 不要把两者弄反：$x^{\\frac{2}{3}}$ 是 $\\sqrt[3]{x^{2}}$，而不是 $\\sqrt{x^{3}}$。指数也不是除法，$x^{\\frac{2}{3}}$ 不是 $\\frac{x^{2}}{3}$。负指数表示倒数，不会得到负的根式：$x^{-\\frac{3}{4}}$ 不是 $-\\sqrt[4]{x^{3}}$。`,
      ),
      generate(rng) {
        let m: number;
        let n: number;
        do {
          [m, n] = pickCoprime(rng, [1, 7], [2, 6]);
        } while (m === 1 && rng.bool(0.6));
        const negative = rng.bool(0.3);
        const xm = m === 1 ? "x" : `x^{${m}}`;
        const correct = root(n, xm);
        const swapped = m === 1 ? `x^{${n}}` : root(m, `x^{${n}}`);
        const options = [
          negative ? `\\frac{1}{${correct}}` : correct,
          negative ? `-${correct}` : `\\frac{1}{${correct}}`,
          negative ? `\\frac{1}{${swapped}}` : swapped,
          negative ? `-\\frac{${xm}}{${n}}` : `\\frac{${xm}}{${n}}`,
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        const e = negative ? `-\\frac{${m}}{${n}}` : `\\frac{${m}}{${n}}`;
        return choiceProblem({
          prompt: t(`For $x > 0$, which expression equals $x^{${e}}$?`, `设 $x > 0$。哪个式子等于 $x^{${e}}$？`),
          options: order.map((i) => t(`$${options[i]}$`, `$${options[i]}$`)),
          correct: order.indexOf(0),
          solution: t(
            `The denominator $${n}$ is the index of the root and the numerator $${m}$ the power under it${negative ? "; the negative sign makes it a reciprocal, so the radical goes in a denominator" : ""}:${steps(`x^{${e}} = ${options[0]}`)}**Check.** Take $x = 2^{${n}}$. Then $x^{${e}} = 2^{${n} \\cdot ${negative ? `\\left(${e}\\right)` : e}} = ${pw("2", negative ? -m : m)}$, and the chosen expression gives $${root(n, `2^{${n * m}}`)} = ${pw("2", m)}$${negative ? ` in a denominator, which is $2^{${-m}}$` : ""}: the same number.`,
            `分母 $${n}$ 是根指数，分子 $${m}$ 是根号下的幂指数${negative ? "；负号表示取倒数，所以根式放在分母中" : ""}：${steps(`x^{${e}} = ${options[0]}`)}**检验。** 取 $x = 2^{${n}}$。则 $x^{${e}} = 2^{${n} \\cdot ${negative ? `\\left(${e}\\right)` : e}} = ${pw("2", negative ? -m : m)}$；所选的式子给出 $${root(n, `2^{${n * m}}`)} = ${pw("2", m)}$${negative ? `，它在分母中，即 $2^{${-m}}$` : ""}：是同一个数。`,
          ),
        });
      },
    },
  ],
  diagnostic: "rational-exponents",
};

export const productRuleWithAlgebraicExpressions: TopicDef = {
  id: "product-rule-with-algebraic-expressions",
  title: t("The Product Rule for Exponents With Algebraic Expressions", "代数式中的同底数幂乘法"),
  summary: t(
    "Multiply powers of the same base when the exponents are negative, fractional or algebraic.",
    "当指数为负数、分数或代数式时，计算同底数幂的乘法。",
  ),
  prerequisites: ["writing-radicals-using-fractional-exponents", "combining-like-terms"],
  encompasses: [
    { topic: "product-and-quotient-rules", weight: 0.5 },
    { topic: "zero-and-negative-exponents", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSN.RN.A.2", "CCSS.8.EE.A.1"],
  intro: t(
    `The product rule $x^{m} \\cdot x^{n} = x^{m + n}$ was first a matter of counting: $x^{2} \\cdot x^{3}$ is two factors of $x$ followed by three more, five in all. Negative and fractional exponents were then defined so that the rule keeps holding, so it can now be used with **any** exponents.

A negative exponent counts factors in the denominator. For $x^{4} \\cdot x^{-3}$, write $x^{-3} = \\frac{1}{x^{3}}$:

$$x^{4} \\cdot x^{-3} = \\frac{x \\cdot x \\cdot x \\cdot x}{x \\cdot x \\cdot x} = x = x^{4 + (-3)}.$$

Three factors on top cancel the three below, and the sum of the exponents does that cancelling for us. The exponents may also be fractions, which add as fractions, or expressions such as $2n + 1$, which add by combining like terms.

In this lesson we multiply powers with negative, algebraic and fractional exponents. Throughout, no variable is $0$.`,
    `同底数幂的乘法 $x^{m} \\cdot x^{n} = x^{m + n}$ 起初只是数因数：$x^{2} \\cdot x^{3}$ 是两个 $x$ 再接三个 $x$，一共五个。后来我们规定负指数和分数指数时，正是为了让这条法则继续成立，所以现在它对**任何**指数都可以用。

负指数数的是分母中的因数。对 $x^{4} \\cdot x^{-3}$，把 $x^{-3}$ 写成 $\\frac{1}{x^{3}}$：

$$x^{4} \\cdot x^{-3} = \\frac{x \\cdot x \\cdot x \\cdot x}{x \\cdot x \\cdot x} = x = x^{4 + (-3)}.$$

分子中的三个因数与分母中的三个约去，而指数相加正好替我们完成了约分。指数也可以是分数，按分数相加；或是 $2n + 1$ 这样的代数式，相加就是合并同类项。

这节课计算指数为负数、代数式和分数的同底数幂乘法。本节中所有字母都不为 $0$。`,
  ),
  knowledgePoints: [
    {
      id: "negative-exponents-in-products",
      title: t("Products with negative exponents", "含负指数的乘积"),
      explanation: t(
        `The product rule $x^{m} \\cdot x^{n} = x^{m + n}$ holds for every integer exponent, negative ones included. A product of monomials can be regrouped, since multiplication can be done in any order: coefficients together, the powers of $x$ together, the powers of $y$ together. So multiply the coefficients, add the exponents of each variable, and finally move every negative power to the denominator:

$$(3x^{2}y^{-4})(2x^{-5}y) = 6x^{2 + (-5)}y^{-4 + 1} = 6x^{-3}y^{-3} = \\frac{6}{x^{3}y^{3}}$$

A variable whose exponents add to $0$ disappears, since $x^{0} = 1$.

> **Watch out.** The exponents are **added**, not multiplied: $x^{2} \\cdot x^{-5}$ is $x^{-3}$, not $x^{-10}$. The coefficients, on the other hand, are multiplied, not added: $3 \\cdot 2 = 6$. When a negative power moves to the denominator, only the power moves; the coefficient $6$ stays on top, so the answer is not $\\frac{1}{6x^{3}y^{3}}$.`,
        `同底数幂的乘法 $x^{m} \\cdot x^{n} = x^{m + n}$ 对所有整数指数都成立，包括负指数。单项式的乘积可以重新分组，因为乘法可以按任意顺序进行：系数放在一起，$x$ 的幂放在一起，$y$ 的幂放在一起。所以系数相乘，每个字母的指数相加，最后把负指数幂移到分母：

$$(3x^{2}y^{-4})(2x^{-5}y) = 6x^{2 + (-5)}y^{-4 + 1} = 6x^{-3}y^{-3} = \\frac{6}{x^{3}y^{3}}$$

指数之和为 $0$ 的字母会消失，因为 $x^{0} = 1$。

> **注意。** 指数是**相加**，不是相乘：$x^{2} \\cdot x^{-5}$ 是 $x^{-3}$，而不是 $x^{-10}$。系数则是相乘，不是相加：$3 \\cdot 2 = 6$。负指数幂移到分母时，移动的只是幂，系数 $6$ 仍留在分子上，所以答案不是 $\\frac{1}{6x^{3}y^{3}}$。`,
      ),
      keyPrerequisites: ["product-and-quotient-rules", "zero-and-negative-exponents"],
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4, 5, 6, -2, -3]);
        const b = rng.int(2, 9);
        const two = rng.bool(0.6);
        let p: number;
        let r: number;
        let q: number;
        let s: number;
        do {
          p = rng.nonZero(-6, 7);
          r = rng.nonZero(-6, 7);
          q = two ? rng.nonZero(-5, 5) : 0;
          s = two ? rng.nonZero(-5, 5) : 0;
        } while (!(p + r < 0 || q + s < 0) || (p + r === 0 && q + s === 0));
        const left = mono(a, [
          ["x", p],
          ["y", q],
        ]);
        const right = mono(b, [
          ["x", r],
          ["y", s],
        ]);
        const result: Factors = [
          ["x", p + r],
          ["y", q + s],
        ];
        const step = `${a * b}x^{${plusExp(p, r)}}${two ? `y^{${plusExp(q, s)}}` : ""}`;
        return positiveProblem(
          `(${left})(${right})`,
          a * b,
          result,
          [step, ...(mono(a * b, result) === positive(a * b, result) ? [] : [mono(a * b, result)])],
          t(
            "Group the coefficients and the powers of each variable. Multiply the coefficients, and add the exponents of each variable, since $x^{m} \\cdot x^{n} = x^{m + n}$:",
            "把系数、各字母的幂分别放在一起。系数相乘；每个字母的指数相加，因为 $x^{m} \\cdot x^{n} = x^{m + n}$：",
          ),
          [
            positive(a * b, [
              ["x", p * r],
              ["y", q * s],
            ]),
            positive(a + b, result),
            positive(Q.of(1, a * b), result),
          ],
          t(
            `**Check.** Dividing the product by $${right}$ must give back $${left}$. The coefficient: $${a * b} \\div ${b} = ${a}$. The exponent of $x$: $${p + r} - ${paren(r)} = ${p}$${two ? `; of $y$: $${q + s} - ${paren(s)} = ${q}$` : ""}.`,
            `**检验。** 乘积除以 $${right}$ 应当得回 $${left}$。系数：$${a * b} \\div ${b} = ${a}$。$x$ 的指数：$${p + r} - ${paren(r)} = ${p}$${two ? `；$y$ 的指数：$${q + s} - ${paren(s)} = ${q}$` : ""}。`,
          ),
        );
      },
    },
    {
      id: "algebraic-exponents-in-products",
      title: t("Algebraic exponents", "代数式指数"),
      explanation: t(
        `The exponents may themselves be expressions. Whatever number $n$ stands for, $x^{2n + 1}$ is $2n + 1$ factors of $x$ and $x^{n - 3}$ is $n - 3$ more, so the product rule still says to add the exponents, and adding them means combining like terms. Put each exponent in parentheses first, so that its signs stay with it:

$$x^{2n + 1} \\cdot x^{n - 3} = x^{(2n + 1) + (n - 3)} = x^{3n - 2}$$

The base must be the same, and it can be a number: $2^{n} \\cdot 2^{5} = 2^{n + 5}$. To test such a result, pick a value such as $n = 2$: $x^{5} \\cdot x^{-1} = x^{4}$, and $3n - 2$ is $4$ there too.

> **Watch out.** The exponents are added, not multiplied: $x^{2n} \\cdot x^{3}$ is $x^{2n + 3}$, not $x^{6n}$, and $x^{n + 1} \\cdot x^{n - 1}$ is $x^{2n}$, not $x^{n^{2} - 1}$. Add the constants with their signs as well: $(2n + 1) + (n - 3)$ ends in $-2$, not $+4$.`,
        `指数本身也可以是代数式。无论 $n$ 代表什么数，$x^{2n + 1}$ 都是 $2n + 1$ 个 $x$ 相乘，$x^{n - 3}$ 是另外 $n - 3$ 个，所以同底数幂相乘仍然是指数相加，而相加就是合并同类项。先给每个指数加上括号，让它的符号跟着它：

$$x^{2n + 1} \\cdot x^{n - 3} = x^{(2n + 1) + (n - 3)} = x^{3n - 2}$$

底数必须相同，也可以是数：$2^{n} \\cdot 2^{5} = 2^{n + 5}$。要检验这样的结果，可以取一个值，例如 $n = 2$：$x^{5} \\cdot x^{-1} = x^{4}$，而此时 $3n - 2$ 也等于 $4$。

> **注意。** 指数是相加而不是相乘：$x^{2n} \\cdot x^{3}$ 是 $x^{2n + 3}$，而不是 $x^{6n}$；$x^{n + 1} \\cdot x^{n - 1}$ 是 $x^{2n}$，而不是 $x^{n^{2} - 1}$。常数项也要连同符号相加：$(2n + 1) + (n - 3)$ 的常数项是 $-2$，不是 $+4$。`,
      ),
      keyPrerequisites: ["combining-like-terms"],
      generate(rng) {
        const { base, v } = powerBase(rng);
        let e1: ReturnType<typeof algebraicExponent>;
        let e2: { a: number; b: number; latex: string };
        do {
          e1 = algebraicExponent(rng, v);
          e2 = rng.bool(0.25) ? { a: 0, b: rng.int(2, 9), latex: "" } : algebraicExponent(rng, v);
          e2 = { ...e2, latex: linear(e2.a, e2.b, v) };
        } while (e1.a + e2.a === 0);
        const answer = linear(e1.a + e2.a, e1.b + e2.b, v);
        return exponentProblem(
          `${base}^{${e1.latex}} \\cdot ${base}^{${e2.latex}}`,
          base,
          v,
          answer,
          `${base}^{(${e1.latex}) + (${e2.latex})}`,
          [
            poly([e1.a * e2.a, `${v}^{2}`], [e1.a * e2.b + e1.b * e2.a, v], [e1.b * e2.b, ""]),
            linear(e1.a + e2.a, e1.b - e2.b, v),
            linear(e1.a - e2.a, e1.b - e2.b, v),
          ],
          t(
            "The bases are the same, so the product rule adds the exponents. Write each exponent in parentheses and add:",
            "底数相同，所以按同底数幂的乘法把指数相加。给每个指数加上括号再相加：",
          ),
          {
            numeric: `${pw(base, val2(e1.a, e1.b))} \\cdot ${pw(base, val2(e2.a, e2.b))} = ${pw(base, val2(e1.a + e2.a, e1.b + e2.b))}`,
            answerAt: at2(e1.a + e2.a, e1.b + e2.b),
            value: val2(e1.a + e2.a, e1.b + e2.b),
          },
        );
      },
    },
    {
      id: "fractional-exponents-in-products",
      title: t("Fractional exponents", "分数指数"),
      explanation: t(
        `Fractional exponents were defined so that the product rule keeps working, so they too are added, as fractions. With a common denominator this is quick: add the numerators and keep the denominator.

$$x^{\\frac{1}{3}} \\cdot x^{\\frac{5}{3}} = x^{\\frac{1}{3} + \\frac{5}{3}} = x^{\\frac{6}{3}} = x^{2}$$

In radical form this says $\\sqrt[3]{x} \\cdot \\sqrt[3]{x^{5}} = x^{2}$, which is easy to believe: under one cube root it is $\\sqrt[3]{x^{6}}$, and $x^{6} = (x^{2})^{3}$. With coefficients, multiply them as usual: $(2x^{\\frac{1}{2}})(3x^{\\frac{3}{2}}) = 6x^{2}$. Here $x > 0$.

> **Watch out.** Add the exponents; do not multiply them: $x^{\\frac{1}{3}} \\cdot x^{\\frac{5}{3}}$ is not $x^{\\frac{5}{9}}$. Add fractions by their numerators only: $\\frac{1}{3} + \\frac{5}{3} = \\frac{6}{3}$, not $\\frac{6}{6}$. And the coefficients multiply, $2 \\cdot 3 = 6$, rather than add to $5$.`,
        `分数指数的规定就是为了让同底数幂的乘法继续成立，所以分数指数同样相加，按分数相加。分母相同时很快：分子相加，分母不变。

$$x^{\\frac{1}{3}} \\cdot x^{\\frac{5}{3}} = x^{\\frac{1}{3} + \\frac{5}{3}} = x^{\\frac{6}{3}} = x^{2}$$

用根式表示，就是 $\\sqrt[3]{x} \\cdot \\sqrt[3]{x^{5}} = x^{2}$，这很好理解：合到一个立方根下是 $\\sqrt[3]{x^{6}}$，而 $x^{6} = (x^{2})^{3}$。有系数时照常相乘：$(2x^{\\frac{1}{2}})(3x^{\\frac{3}{2}}) = 6x^{2}$。这里 $x > 0$。

> **注意。** 指数相加，不要相乘：$x^{\\frac{1}{3}} \\cdot x^{\\frac{5}{3}}$ 不是 $x^{\\frac{5}{9}}$。分母相同的分数相加只加分子：$\\frac{1}{3} + \\frac{5}{3} = \\frac{6}{3}$，而不是 $\\frac{6}{6}$。系数相乘，$2 \\cdot 3 = 6$，而不是相加得 $5$。`,
      ),
      generate(rng) {
        const q = rng.pick([2, 3, 4, 5]);
        const k = rng.int(1, 5);
        let p: number;
        do p = rng.int(1, k * q - 1);
        while (gcd(p, q) !== 1 || gcd(k * q - p, q) !== 1);
        const r = k * q - p;
        const a = rng.pick([1, 1, 2, 3, 4, 5]);
        const b = rng.pick([1, 2, 3, 4, 6]);
        const left = `${a === 1 ? "" : a}x^{\\frac{${p}}{${q}}}`;
        const right = `${b === 1 ? "" : b}x^{\\frac{${r}}{${q}}}`;
        const expr = a === 1 && b === 1 ? `${left} \\cdot ${right}` : `(${left})(${right})`;
        const answer = mono(a * b, [["x", k]]);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$, where $x > 0$.`, `化简 $${expr}$，其中 $x > 0$。`),
          answer,
          simplified: true,
          wrong: [mono(a * b, [["x", p * r]]), mono(a + b, [["x", k]]), mono(a * b, [["x", p + r]]), mono(a * b, [["x", 2 * k]])],
          solution: t(
            `${a * b === 1 ? "There are no coefficients to multiply." : a === 1 || b === 1 ? `The only coefficient is $${a * b}$.` : `Multiply the coefficients, $${a} \\cdot ${b} = ${a * b}$.`} The bases are the same, so add the exponents; they have the same denominator $${q}$, so add the numerators:${steps(`${expr} = ${a * b === 1 ? "" : a * b}x^{\\frac{${p}}{${q}} + \\frac{${r}}{${q}}} = ${a * b === 1 ? "" : a * b}x^{\\frac{${p + r}}{${q}}} = ${answer}`)}The fraction $\\frac{${p + r}}{${q}}$ is the whole number $${k}$.\n\n**Check.** Take $x = 2^{${q}}$. Then $x^{\\frac{${p}}{${q}}} = ${pw("2", p)}$ and $x^{\\frac{${r}}{${q}}} = ${pw("2", r)}$, so the product is $${a * b === 1 ? "" : `${a * b} \\cdot `}2^{${p} + ${r}} = ${a * b === 1 ? "" : `${a * b} \\cdot `}2^{${k * q}}$; the answer gives $${k === 1 ? `${a * b === 1 ? "" : `${a * b} \\cdot `}2^{${q}}` : `${a * b === 1 ? "" : `${a * b} \\cdot `}(2^{${q}})^{${k}} = ${a * b === 1 ? "" : `${a * b} \\cdot `}2^{${k * q}}`}$ as well.`,
            `${a * b === 1 ? "没有需要相乘的系数。" : a === 1 || b === 1 ? `系数只有 $${a * b}$。` : `系数相乘，$${a} \\cdot ${b} = ${a * b}$。`}底数相同，所以指数相加；两个指数的分母都是 $${q}$，分子相加即可：${steps(`${expr} = ${a * b === 1 ? "" : a * b}x^{\\frac{${p}}{${q}} + \\frac{${r}}{${q}}} = ${a * b === 1 ? "" : a * b}x^{\\frac{${p + r}}{${q}}} = ${answer}`)}分数 $\\frac{${p + r}}{${q}}$ 等于整数 $${k}$。\n\n**检验。** 取 $x = 2^{${q}}$。则 $x^{\\frac{${p}}{${q}}} = ${pw("2", p)}$，$x^{\\frac{${r}}{${q}}} = ${pw("2", r)}$，所以乘积为 $${a * b === 1 ? "" : `${a * b} \\cdot `}2^{${p} + ${r}} = ${a * b === 1 ? "" : `${a * b} \\cdot `}2^{${k * q}}$；答案给出的也是 $${k === 1 ? `${a * b === 1 ? "" : `${a * b} \\cdot `}2^{${q}}` : `${a * b === 1 ? "" : `${a * b} \\cdot `}(2^{${q}})^{${k}} = ${a * b === 1 ? "" : `${a * b} \\cdot `}2^{${k * q}}`}$。`,
          ),
        });
      },
    },
  ],
};

export const quotientRuleWithAlgebraicExpressions: TopicDef = {
  id: "quotient-rule-with-algebraic-expressions",
  title: t("The Quotient Rule for Exponents With Algebraic Expressions", "代数式中的同底数幂除法"),
  summary: t(
    "Divide powers of the same base, writing the result with positive exponents, and with algebraic exponents.",
    "计算同底数幂的除法，结果用正指数表示；指数也可以是代数式。",
  ),
  prerequisites: ["product-rule-with-algebraic-expressions"],
  encompasses: [
    { topic: "product-and-quotient-rules", weight: 0.5 },
    { topic: "zero-and-negative-exponents", weight: 0.4 },
    { topic: "combining-like-terms", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.8.EE.A.1"],
  intro: t(
    `Dividing powers of the same base cancels factors. In $\\frac{x^{5}}{x^{2}}$ two factors of $x$ on the bottom cancel two of the five on top, leaving $x^{3}$: the quotient rule $\\frac{x^{m}}{x^{n}} = x^{m - n}$, numerator's exponent minus denominator's.

What if the bottom has more factors? Cancelling in $\\frac{x^{2}}{x^{5}}$ leaves three factors **below**:

$$\\frac{x^{2}}{x^{5}} = \\frac{x \\cdot x}{x \\cdot x \\cdot x \\cdot x \\cdot x} = \\frac{1}{x^{3}},$$

and the rule gives $x^{2 - 5} = x^{-3}$, which is the same thing. So the rule always works, and a negative exponent in the result simply tells us that the leftover factors sit in the denominator.

In this lesson we divide monomials and write the result with positive exponents, then subtract negative, fractional and algebraic exponents. Throughout, no variable is $0$.`,
    `同底数幂相除就是约去因数。在 $\\frac{x^{5}}{x^{2}}$ 中，分母的两个 $x$ 与分子五个 $x$ 中的两个约去，剩下 $x^{3}$：这就是同底数幂的除法 $\\frac{x^{m}}{x^{n}} = x^{m - n}$，分子的指数减分母的指数。

如果分母的因数更多呢？在 $\\frac{x^{2}}{x^{5}}$ 中约分后，**分母**里剩下三个因数：

$$\\frac{x^{2}}{x^{5}} = \\frac{x \\cdot x}{x \\cdot x \\cdot x \\cdot x \\cdot x} = \\frac{1}{x^{3}},$$

而法则给出 $x^{2 - 5} = x^{-3}$，两者相同。所以这条法则总是成立，结果中的负指数只是告诉我们：剩下的因数在分母里。

这节课先做单项式的除法，结果用正指数表示；再处理负指数、分数指数和代数式指数的相减。本节中所有字母都不为 $0$。`,
  ),
  knowledgePoints: [
    {
      id: "quotients-with-negative-results",
      title: t("Quotients with negative exponents in the result", "结果含负指数的商"),
      explanation: t(
        `Divide the coefficients and subtract the exponents of each variable, numerator minus denominator, even when the denominator has the larger exponent. The coefficients form a fraction, so reduce it:

$$\\frac{6x^{2}y^{5}}{8x^{7}y^{2}} = \\frac{3}{4}x^{2 - 7}y^{5 - 2} = \\frac{3}{4}x^{-5}y^{3} = \\frac{3y^{3}}{4x^{5}}$$

The exponent $-5$ means that five factors of $x$ are left over in the denominator, so $x^{5}$ goes below, next to the $4$. The $y^{3}$, with a positive exponent, stays on top.

> **Watch out.** Always subtract in the same order, top minus bottom: $2 - 7 = -5$, not $7 - 2 = 5$ with $x^{5}$ left on top. Dividing never adds exponents, so the answer is not $x^{9}$. And keep the coefficient fraction the right way up: $\\frac{6}{8} = \\frac{3}{4}$, not $\\frac{4}{3}$.`,
        `系数相除，每个字母的指数相减（分子的指数减分母的指数），即使分母的指数更大也一样。系数组成一个分数，要约分：

$$\\frac{6x^{2}y^{5}}{8x^{7}y^{2}} = \\frac{3}{4}x^{2 - 7}y^{5 - 2} = \\frac{3}{4}x^{-5}y^{3} = \\frac{3y^{3}}{4x^{5}}$$

指数 $-5$ 表示分母中剩下五个 $x$，所以 $x^{5}$ 写在分母，放在 $4$ 旁边。指数为正的 $y^{3}$ 留在分子。

> **注意。** 始终按同一顺序相减，分子减分母：$2 - 7 = -5$，而不是 $7 - 2 = 5$ 并把 $x^{5}$ 留在分子。除法不会让指数相加，所以答案不是 $x^{9}$。系数的分数也不要颠倒：$\\frac{6}{8} = \\frac{3}{4}$，而不是 $\\frac{4}{3}$。`,
      ),
      generate(rng) {
        const [a, b] = pickCoprime(rng, [1, 9], [1, 9]);
        const g = rng.pick([1, 2, 3, 4]);
        const two = rng.bool(0.7);
        let p: number;
        let q: number;
        let r: number;
        let s: number;
        do {
          [p, r] = [rng.int(1, 8), rng.int(1, 9)];
          [q, s] = two ? [rng.int(1, 7), rng.int(1, 7)] : [0, 0];
        } while (!(p - r < 0 || q - s < 0) || (p === r && q === s));
        const top = mono(a * g, [
          ["x", p],
          ["y", q],
        ]);
        const bottom = mono(b * g, [
          ["x", r],
          ["y", s],
        ]);
        const c = Q.of(a, b);
        const result: Factors = [
          ["x", p - r],
          ["y", q - s],
        ];
        const step = `${c.eq(Q.one) ? "" : c.toLatex()}x^{${p} - ${r}}${two ? `y^{${q} - ${s}}` : ""}`;
        return positiveProblem(
          `\\frac{${top}}{${bottom}}`,
          c,
          result,
          [step, ...(mono(c, result) === positive(c, result) ? [] : [mono(c, result)])],
          t(
            `Divide the coefficients as a fraction in lowest terms, $\\frac{${a * g}}{${b * g}} = ${c.toLatex()}$, and subtract the exponents of each variable, top minus bottom, since $\\frac{x^{m}}{x^{n}} = x^{m - n}$:`,
            `系数相除并约成最简分数，$\\frac{${a * g}}{${b * g}} = ${c.toLatex()}$；每个字母的指数相减（分子减分母），因为 $\\frac{x^{m}}{x^{n}} = x^{m - n}$：`,
          ),
          [
            positive(c, [
              ["x", r - p],
              ["y", s - q],
            ]),
            positive(c, [
              ["x", p + r],
              ["y", q + s],
            ]),
            positive(Q.of(b, a), result),
          ],
          t(
            `**Check.** Multiplying the answer by the denominator $${bottom}$ must give back the numerator $${top}$. ${c.eq(Q.one) ? `The coefficient: $${a * g}$ on both sides.` : `The coefficient: $${c.toLatex()} \\cdot ${b * g} = ${a * g}$.`} The exponent of $x$: $${p - r} + ${r} = ${p}$${two ? `; of $y$: $${q - s} + ${s} = ${q}$` : ""}.`,
            `**检验。** 答案乘以分母 $${bottom}$ 应当得回分子 $${top}$。${c.eq(Q.one) ? `系数：两边都是 $${a * g}$。` : `系数：$${c.toLatex()} \\cdot ${b * g} = ${a * g}$。`}$x$ 的指数：$${p - r} + ${r} = ${p}$${two ? `；$y$ 的指数：$${q - s} + ${s} = ${q}$` : ""}。`,
          ),
        );
      },
    },
    {
      id: "negative-and-fractional-exponents-in-quotients",
      title: t("Negative and fractional exponents in quotients", "商中的负指数与分数指数"),
      explanation: t(
        `The quotient rule subtracts the exponent of the denominator, whatever its sign. Subtracting a negative number adds its opposite, so watch the signs:

$$\\frac{x^{-3}}{x^{4}} = x^{-3 - 4} = x^{-7} = \\frac{1}{x^{7}} \\qquad \\frac{x^{2}}{x^{-5}} = x^{2 - (-5)} = x^{7}$$

The second one makes sense: $x^{-5}$ in the denominator is $\\frac{1}{x^{5}}$, and dividing by $\\frac{1}{x^{5}}$ is multiplying by $x^{5}$. Fractional exponents subtract like fractions: with the same denominator, subtract the numerators, $\\frac{x^{\\frac{7}{3}}}{x^{\\frac{1}{3}}} = x^{\\frac{6}{3}} = x^{2}$.

> **Watch out.** Write the subtraction in full before simplifying: $2 - (-5) = 7$, and treating it as $2 - 5 = -3$ gives the wrong power. Do not add the exponents, and do not subtract them the wrong way round, bottom minus top: that gives the reciprocal of the answer.`,
        `同底数幂的除法要减去分母的指数，无论它是正是负。减去一个负数等于加上它的相反数，要注意符号：

$$\\frac{x^{-3}}{x^{4}} = x^{-3 - 4} = x^{-7} = \\frac{1}{x^{7}} \\qquad \\frac{x^{2}}{x^{-5}} = x^{2 - (-5)} = x^{7}$$

第二个式子很好理解：分母中的 $x^{-5}$ 就是 $\\frac{1}{x^{5}}$，除以 $\\frac{1}{x^{5}}$ 就是乘以 $x^{5}$。分数指数按分数相减：分母相同时分子相减，$\\frac{x^{\\frac{7}{3}}}{x^{\\frac{1}{3}}} = x^{\\frac{6}{3}} = x^{2}$。

> **注意。** 先把减法完整写出来再化简：$2 - (-5) = 7$，当成 $2 - 5 = -3$ 就错了。指数不要相加，也不要倒过来用分母减分子：那样得到的是答案的倒数。`,
      ),
      generate(rng) {
        if (rng.bool(0.35)) {
          const q = rng.pick([2, 3, 4, 5]);
          const k = rng.nonZero(-3, 4);
          let p: number;
          let r: number;
          do {
            r = rng.int(1, 12) + (k < 0 ? -k * q : 0);
            p = r + k * q;
          } while (p <= 0 || gcd(p, q) !== 1 || gcd(r, q) !== 1);
          const expr = `\\frac{x^{\\frac{${p}}{${q}}}}{x^{\\frac{${r}}{${q}}}}`;
          return positiveProblem(
            expr,
            1,
            [["x", k]],
            [`x^{\\frac{${p}}{${q}} - \\frac{${r}}{${q}}}`, ...(k === 1 ? [] : [`x^{${fracExp(p - r, q)}}`])],
            t(
              `The bases are the same, so subtract the exponents, top minus bottom. They share the denominator $${q}$, so subtract the numerators:`,
              `底数相同，所以指数相减，分子的指数减分母的指数。两个指数的分母都是 $${q}$，分子相减即可：`,
            ),
            [positive(1, [["x", -k]]), mono(1, [["x", p - r]])],
            t(
              `**Check.** Multiplying the answer by the denominator must give back the numerator: $${pw("x", k)} \\cdot x^{\\frac{${r}}{${q}}} = x^{\\frac{${k * q}}{${q}} + \\frac{${r}}{${q}}} = x^{\\frac{${p}}{${q}}}$.`,
              `**检验。** 答案乘以分母应当得回分子：$${pw("x", k)} \\cdot x^{\\frac{${r}}{${q}}} = x^{\\frac{${k * q}}{${q}} + \\frac{${r}}{${q}}} = x^{\\frac{${p}}{${q}}}$。`,
            ),
          );
        }
        const a = rng.pick([1, 1, 2, 3, 4, 5, 6]);
        const g = rng.pick([1, 1, 2, 3]);
        let p: number;
        let r: number;
        do {
          p = rng.nonZero(-7, 7);
          r = rng.nonZero(-7, 7);
        } while ((p > 0 && r > 0) || p === r);
        const top = mono(a * g, [["x", p]]);
        const bottom = mono(g, [["x", r]]);
        return positiveProblem(
          `\\frac{${top}}{${bottom}}`,
          a,
          [["x", p - r]],
          [`${a === 1 ? "" : a}x^{${p} - ${paren(r)}}`],
          t(
            `${g === 1 ? (a === 1 ? "There are no coefficients to divide." : `The coefficient $${a}$ has nothing to divide by.`) : `Divide the coefficients, $${a * g} \\div ${g} = ${a}$.`} Subtract the exponents, top minus bottom; subtracting ${r < 0 ? `$${r}$ is adding $${-r}$` : `$${r}$ from $${p}$ makes the exponent more negative`}:`,
            `${g === 1 ? (a === 1 ? "没有需要相除的系数。" : `系数 $${a}$ 不需要相除。`) : `系数相除，$${a * g} \\div ${g} = ${a}$。`}指数相减，分子减分母；${r < 0 ? `减去 $${r}$ 就是加上 $${-r}$` : `从 $${p}$ 中减去 $${r}$，指数变得更小`}：`,
          ),
          [positive(a, [["x", p + r]]), positive(a, [["x", r - p]])],
          t(
            `**Check.** Multiplying the answer by the denominator $${bottom}$ must give back $${top}$: ${a * g === 1 ? "" : a === 1 || g === 1 ? `the coefficient $${a * g}$, and ` : `the coefficient $${a} \\cdot ${g} = ${a * g}$, and `}the exponent $${p - r} + ${paren(r)} = ${p}$.`,
            `**检验。** 答案乘以分母 $${bottom}$ 应当得回 $${top}$：${a * g === 1 ? "" : a === 1 || g === 1 ? `系数 $${a * g}$，` : `系数 $${a} \\cdot ${g} = ${a * g}$，`}指数 $${p - r} + ${paren(r)} = ${p}$。`,
          ),
        );
      },
    },
    {
      id: "algebraic-exponents-in-quotients",
      title: t("Algebraic exponents", "代数式指数"),
      explanation: t(
        `To divide, subtract the **whole** exponent of the denominator: it counts all the factors below, and all of them cancel. Put it in parentheses so that every term is subtracted, then distribute the minus sign, which changes the sign of each term inside:

$$\\frac{x^{5n + 2}}{x^{2n - 1}} = x^{(5n + 2) - (2n - 1)} = x^{5n + 2 - 2n + 1} = x^{3n + 3}$$

Test it with $n = 2$: the quotient is $\\frac{x^{12}}{x^{3}} = x^{9}$, and $3n + 3$ is $9$ there too.

> **Watch out.** Forgetting the parentheses subtracts only the first term: $5n + 2 - 2n - 1 = 3n + 1$ is wrong, because the $-1$ must become $+1$. Dividing never adds the exponents, and the order is top minus bottom: $(2n - 1) - (5n + 2)$ gives the reciprocal.`,
        `做除法时，要减去分母的**整个**指数：它数的是分母中的全部因数，而它们都被约去了。给它加上括号，保证每一项都被减去，再把负号分配进去，括号里每一项都要变号：

$$\\frac{x^{5n + 2}}{x^{2n - 1}} = x^{(5n + 2) - (2n - 1)} = x^{5n + 2 - 2n + 1} = x^{3n + 3}$$

用 $n = 2$ 检验：商为 $\\frac{x^{12}}{x^{3}} = x^{9}$，而此时 $3n + 3$ 也等于 $9$。

> **注意。** 忘记括号就只减了第一项：$5n + 2 - 2n - 1 = 3n + 1$ 是错的，因为 $-1$ 应当变成 $+1$。除法不会让指数相加，顺序也是分子减分母：$(2n - 1) - (5n + 2)$ 得到的是倒数。`,
      ),
      keyPrerequisites: ["combining-like-terms"],
      generate(rng) {
        const { base, v } = powerBase(rng);
        let e1: { a: number; b: number; latex: string };
        let e2: { a: number; b: number; latex: string };
        do {
          e1 = algebraicExponent(rng, v);
          e2 = algebraicExponent(rng, v);
        } while (e1.a === e2.a || e2.b === 0);
        const answer = linear(e1.a - e2.a, e1.b - e2.b, v);
        return exponentProblem(
          `\\frac{${base}^{${e1.latex}}}{${base}^{${e2.latex}}}`,
          base,
          v,
          answer,
          `${base}^{(${e1.latex}) - (${e2.latex})}`,
          [linear(e1.a + e2.a, e1.b + e2.b, v), linear(e1.a - e2.a, e1.b + e2.b, v), linear(e2.a - e1.a, e2.b - e1.b, v)],
          t(
            "The bases are the same, so the quotient rule subtracts the whole exponent of the denominator. Keep it in parentheses, and change the sign of each of its terms when the parentheses come off:",
            "底数相同，所以按同底数幂的除法减去分母的整个指数。先保留括号，去括号时括号里每一项都要变号：",
          ),
          {
            numeric: `\\frac{${pw(base, val2(e1.a, e1.b))}}{${pw(base, val2(e2.a, e2.b))}} = ${pw(base, val2(e1.a - e2.a, e1.b - e2.b))}`,
            answerAt: at2(e1.a - e2.a, e1.b - e2.b),
            value: val2(e1.a - e2.a, e1.b - e2.b),
          },
        );
      },
    },
  ],
};

export const powerRuleWithAlgebraicExpressions: TopicDef = {
  id: "power-rule-with-algebraic-expressions",
  title: t("The Power Rule for Exponents With Algebraic Expressions", "代数式中的幂的乘方"),
  summary: t(
    "Raise a power to a power when the exponents are negative, fractional or algebraic.",
    "当指数为负数、分数或代数式时，计算幂的乘方。",
  ),
  prerequisites: ["product-rule-with-algebraic-expressions"],
  encompasses: [
    { topic: "power-rules", weight: 0.4 },
    { topic: "zero-and-negative-exponents", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSN.RN.A.2", "CCSS.8.EE.A.1"],
  intro: t(
    `Raising a power to a power repeats it. $(x^{4})^{3}$ is three copies of $x^{4}$ multiplied together, and the product rule adds their exponents:

$$(x^{4})^{3} = x^{4} \\cdot x^{4} \\cdot x^{4} = x^{4 + 4 + 4} = x^{12}.$$

Adding $4$ three times is multiplying $4$ by $3$, which is the power rule $(x^{m})^{n} = x^{mn}$. A negative outside exponent first takes the reciprocal: $(x^{4})^{-3} = \\frac{1}{(x^{4})^{3}} = \\frac{1}{x^{12}} = x^{-12}$, and the rule gives $x^{4 \\cdot (-3)} = x^{-12}$ directly. Fractional exponents were defined to follow the same rule, so $(x^{6})^{\\frac{1}{3}} = x^{2}$, the cube root of $x^{6}$.

In this lesson we use the power rule with negative, algebraic and fractional exponents. Throughout, no variable is $0$.`,
    `幂的乘方就是把幂重复相乘。$(x^{4})^{3}$ 是三个 $x^{4}$ 相乘，按同底数幂的乘法把指数相加：

$$(x^{4})^{3} = x^{4} \\cdot x^{4} \\cdot x^{4} = x^{4 + 4 + 4} = x^{12}.$$

把 $4$ 加三次就是 $4$ 乘以 $3$，这就是幂的乘方法则 $(x^{m})^{n} = x^{mn}$。外面的指数为负时，先取倒数：$(x^{4})^{-3} = \\frac{1}{(x^{4})^{3}} = \\frac{1}{x^{12}} = x^{-12}$，而法则直接给出 $x^{4 \\cdot (-3)} = x^{-12}$。分数指数的规定也服从同一法则，所以 $(x^{6})^{\\frac{1}{3}} = x^{2}$，即 $x^{6}$ 的立方根。

这节课在指数为负数、代数式和分数时运用幂的乘方法则。本节中所有字母都不为 $0$。`,
  ),
  knowledgePoints: [
    {
      id: "negative-exponents-in-powers",
      title: t("Powers with negative exponents", "含负指数的幂的乘方"),
      explanation: t(
        `$(x^{m})^{n} = x^{mn}$ for all integers $m$ and $n$. When the parentheses hold several powers, the outside exponent applies to each of them, because $(x^{m}y^{k})^{n}$ is $n$ copies of the whole product. So multiply each exponent inside by the outside exponent, using the rules of signs, then move the negative powers to the denominator:

$$(x^{-3}y^{2})^{-4} = x^{(-3)(-4)}y^{2 \\cdot (-4)} = x^{12}y^{-8} = \\frac{x^{12}}{y^{8}}$$

Two negatives multiply to a positive, which is why $x$ ends up on top.

> **Watch out.** The exponents are multiplied, not added: $(x^{-3})^{-4}$ is $x^{12}$, not $x^{-7}$. Apply the outside exponent to **every** factor, not only the first: $y^{2}$ becomes $y^{-8}$, not $y^{2}$. And watch the sign of each product: $(-3)(-4) = 12$, not $-12$.`,
        `对所有整数 $m$、$n$，都有 $(x^{m})^{n} = x^{mn}$。括号里有几个幂时，外面的指数作用于每一个，因为 $(x^{m}y^{k})^{n}$ 是整个乘积重复 $n$ 次。所以把括号里的每个指数都乘以外面的指数，按符号法则确定正负，再把负指数幂移到分母：

$$(x^{-3}y^{2})^{-4} = x^{(-3)(-4)}y^{2 \\cdot (-4)} = x^{12}y^{-8} = \\frac{x^{12}}{y^{8}}$$

负负得正，所以 $x$ 最后在分子上。

> **注意。** 指数是相乘，不是相加：$(x^{-3})^{-4}$ 是 $x^{12}$，而不是 $x^{-7}$。外面的指数要作用于**每一个**因数，而不只是第一个：$y^{2}$ 变成 $y^{-8}$，而不是仍为 $y^{2}$。还要注意每个乘积的符号：$(-3)(-4) = 12$，不是 $-12$。`,
      ),
      generate(rng) {
        const two = rng.bool(0.6);
        let p: number;
        let q: number;
        let n: number;
        do {
          p = rng.nonZero(-6, 6);
          q = two ? rng.nonZero(-5, 5) : 0;
          n = rng.pick([-4, -3, -2, -1, 2, 3, 4]);
        } while (!(p * n < 0 || q * n < 0) || Math.abs(p * n) > 12 || Math.abs(q * n) > 12);
        const inner = mono(1, [
          ["x", p],
          ["y", q],
        ]);
        const result: Factors = [
          ["x", p * n],
          ["y", q * n],
        ];
        const step = `x^{${paren(p)} \\cdot ${paren(n)}}${two ? `y^{${paren(q)} \\cdot ${paren(n)}}` : ""}`;
        return positiveProblem(
          two || n < 0 ? `(${inner})^{${n}}` : `(${inner})^{${n}}`,
          1,
          result,
          [step, ...(mono(1, result) === positive(1, result) ? [] : [mono(1, result)])],
          t(
            `The power rule $(x^{m})^{n} = x^{mn}$ multiplies each exponent inside by the outside exponent $${n}$${two ? "; it applies to every factor in the parentheses" : ""}:`,
            `幂的乘方法则 $(x^{m})^{n} = x^{mn}$：括号里的每个指数都乘以外面的指数 $${n}$${two ? "，括号里的每个因数都要乘方" : ""}：`,
          ),
          [
            positive(1, [
              ["x", p + n],
              ["y", q === 0 ? 0 : q + n],
            ]),
            positive(1, [
              ["x", p * n],
              ["y", q],
            ]),
            positive(1, [
              ["x", -p * n],
              ["y", -q * n],
            ]),
          ],
          n > 0
            ? t(
                `**Check.** The power $${n}$ is $${n}$ copies of $${inner}$ multiplied, so each exponent is added $${n}$ times: for $x$, $${Array(n).fill(paren(p)).join(" + ")} = ${p * n}$${two ? `; for $y$, $${Array(n).fill(paren(q)).join(" + ")} = ${q * n}$` : ""}.`,
                `**检验。** $${n}$ 次方就是 $${n}$ 个 $${inner}$ 相乘，所以每个指数加 $${n}$ 次：$x$ 的指数 $${Array(n).fill(paren(p)).join(" + ")} = ${p * n}$${two ? `；$y$ 的指数 $${Array(n).fill(paren(q)).join(" + ")} = ${q * n}$` : ""}。`,
              )
            : t(
                `**Check.** ${
                  n === -1
                    ? `The power $-1$ is the reciprocal of $${inner}$`
                    : `Do it in two steps instead. The positive power: $(${inner})^{${-n}} = ${mono(1, [
                        ["x", -p * n],
                        ["y", -q * n],
                      ])}$. The power $-1$ then takes the reciprocal`
                }, which changes the sign of every exponent: $${mono(1, result)}$, the same as above.`,
                `**检验。** ${
                  n === -1
                    ? `$-1$ 次方就是 $${inner}$ 的倒数`
                    : `改为分两步做。先算正指数幂：$(${inner})^{${-n}} = ${mono(1, [
                        ["x", -p * n],
                        ["y", -q * n],
                      ])}$。再乘 $-1$ 次方，即取倒数`
                }，每个指数都变号：$${mono(1, result)}$，与上面相同。`,
              ),
        );
      },
    },
    {
      id: "algebraic-exponents-in-powers",
      title: t("Algebraic exponents", "代数式指数"),
      explanation: t(
        `Raising a power to a power multiplies the exponents. When the inside exponent is a sum such as $n + 2$, the product $3(n + 2)$ is worked out by the distributive property, so the outside exponent multiplies **every term**:

$$(x^{n + 2})^{3} = x^{3(n + 2)} = x^{3n + 6} \\qquad (x^{n - 1})^{n} = x^{n(n - 1)} = x^{n^{2} - n}$$

The first one is $x^{n + 2} \\cdot x^{n + 2} \\cdot x^{n + 2}$, whose exponents add to $3n + 6$. With $n = 2$: $(x^{4})^{3} = x^{12}$, and $3n + 6 = 12$.

> **Watch out.** Multiplying only the first term, $x^{3n + 2}$, is a common mistake; the constant must be multiplied too. Do not add the outside exponent instead of multiplying, as in $x^{n + 5}$, and keep the signs: $(x^{n - 1})^{-2}$ is $x^{-2n + 2}$.`,
        `幂的乘方是指数相乘。里面的指数是 $n + 2$ 这样的和时，乘积 $3(n + 2)$ 要用分配律展开，所以外面的指数要乘以里面指数的**每一项**：

$$(x^{n + 2})^{3} = x^{3(n + 2)} = x^{3n + 6} \\qquad (x^{n - 1})^{n} = x^{n(n - 1)} = x^{n^{2} - n}$$

第一个式子就是 $x^{n + 2} \\cdot x^{n + 2} \\cdot x^{n + 2}$，指数相加得 $3n + 6$。取 $n = 2$：$(x^{4})^{3} = x^{12}$，而 $3n + 6 = 12$。

> **注意。** 只乘第一项而得到 $x^{3n + 2}$ 是常见错误，常数项也要乘。不要把外面的指数加上去（如 $x^{n + 5}$），还要注意符号：$(x^{n - 1})^{-2}$ 是 $x^{-2n + 2}$。`,
      ),
      generate(rng) {
        const { base, v } = powerBase(rng);
        let e: { a: number; b: number; latex: string };
        do e = algebraicExponent(rng, v);
        while (e.b === 0);
        if (rng.bool(0.3)) {
          const answer = poly([e.a, `${v}^{2}`], [e.b, v]);
          const at = val2(e.a, e.b);
          return exponentProblem(
            `(${base}^{${e.latex}})^{${v}}`,
            base,
            v,
            answer,
            `${base}^{${v}(${e.latex})}`,
            [linear(e.a + 1, e.b, v), poly([e.a, `${v}^{2}`], [e.b, ""]), linear(e.a, e.b, v)],
            t(
              `The power rule multiplies the exponents. The outside exponent $${v}$ multiplies every term of $${e.latex}$, by the distributive property:`,
              `幂的乘方法则是指数相乘。由分配律，外面的指数 $${v}$ 要乘以 $${e.latex}$ 的每一项：`,
            ),
            {
              numeric: `(${pw(base, at)})^{2} = ${pw(base, 2 * at)}`,
              answerAt: poly([e.a, "(2)^{2}"], [e.b, "(2)"]),
              value: 2 * at,
            },
          );
        }
        const c = rng.pick([2, 3, 4, 5, -2, -3]);
        const answer = linear(c * e.a, c * e.b, v);
        const at = val2(e.a, e.b);
        return exponentProblem(
          `(${base}^{${e.latex}})^{${c}}`,
          base,
          v,
          answer,
          `${base}^{${paren(c)}(${e.latex})}`,
          [linear(c * e.a, e.b, v), linear(e.a, e.b + c, v), linear(c * e.a, -c * e.b, v)],
          t(
            `The power rule multiplies the exponents. The outside exponent $${c}$ multiplies every term of $${e.latex}$, by the distributive property${c < 0 ? ", and being negative it changes every sign" : ""}:`,
            `幂的乘方法则是指数相乘。由分配律，外面的指数 $${c}$ 要乘以 $${e.latex}$ 的每一项${c < 0 ? "；它是负数，会改变每一项的符号" : ""}：`,
          ),
          { numeric: `(${pw(base, at)})^{${c}} = ${pw(base, c * at)}`, answerAt: at2(c * e.a, c * e.b), value: c * at },
        );
      },
    },
    {
      id: "fractional-exponents-in-powers",
      title: t("Fractional exponents", "分数指数"),
      explanation: t(
        `The power rule works the same with fractions: multiply the exponents, and simplify the product of a fraction and a whole number as usual.

$$\\left(x^{\\frac{2}{3}}\\right)^{6} = x^{\\frac{2}{3} \\cdot 6} = x^{4} \\qquad \\left(x^{10}\\right)^{\\frac{1}{5}} = x^{10 \\cdot \\frac{1}{5}} = x^{2}$$

The second one says $\\sqrt[5]{x^{10}} = x^{2}$: a root divides the exponent by its index. That fits the meaning of a root, since $(x^{2})^{5} = x^{10}$. A negative exponent outside still gives a reciprocal: $\\left(x^{10}\\right)^{-\\frac{1}{5}} = x^{-2} = \\frac{1}{x^{2}}$. Here $x > 0$.

> **Watch out.** Multiply the exponents, do not add them: $\\left(x^{\\frac{2}{3}}\\right)^{6}$ is not $x^{\\frac{20}{3}}$. A root divides the exponent; it does not multiply it, so $\\left(x^{10}\\right)^{\\frac{1}{5}}$ is not $x^{50}$. And keep the sign of a negative outside exponent: the result goes in the denominator.`,
        `幂的乘方法则对分数指数同样适用：指数相乘，分数与整数的乘积照常化简。

$$\\left(x^{\\frac{2}{3}}\\right)^{6} = x^{\\frac{2}{3} \\cdot 6} = x^{4} \\qquad \\left(x^{10}\\right)^{\\frac{1}{5}} = x^{10 \\cdot \\frac{1}{5}} = x^{2}$$

第二个式子就是 $\\sqrt[5]{x^{10}} = x^{2}$：开方就是把指数除以根指数。这与开方的意义相符，因为 $(x^{2})^{5} = x^{10}$。外面的指数为负时，结果仍是倒数：$\\left(x^{10}\\right)^{-\\frac{1}{5}} = x^{-2} = \\frac{1}{x^{2}}$。这里 $x > 0$。

> **注意。** 指数相乘，不要相加：$\\left(x^{\\frac{2}{3}}\\right)^{6}$ 不是 $x^{\\frac{20}{3}}$。开方是把指数除以根指数，而不是乘，所以 $\\left(x^{10}\\right)^{\\frac{1}{5}}$ 不是 $x^{50}$。外面的负指数不能丢：结果要放到分母中。`,
      ),
      generate(rng) {
        const q = rng.pick([2, 3, 4, 5]);
        const negative = rng.bool(0.25);
        if (rng.bool(0.5)) {
          const [p] = pickCoprime(rng, [1, 7], [q, q]);
          const j = rng.int(1, Math.max(1, Math.min(3, Math.floor(12 / p))));
          const r = (negative ? -1 : 1) * q * j;
          const k = p * j * (negative ? -1 : 1);
          const expr = `\\left(x^{\\frac{${p}}{${q}}}\\right)^{${r}}`;
          return positiveProblem(
            expr,
            1,
            [["x", k]],
            [`x^{\\frac{${p}}{${q}} \\cdot ${paren(r)}}`, ...(negative ? [`x^{${k}}`] : [])],
            t(
              `The power rule multiplies the exponents; $\\frac{${p}}{${q}} \\cdot ${paren(r)}$ cancels the denominator $${q}$:`,
              `幂的乘方法则是指数相乘；$\\frac{${p}}{${q}} \\cdot ${paren(r)}$ 中分母 $${q}$ 被约去：`,
            ),
            [positive(1, [["x", p * r]]), positive(1, [["x", -k]]), positive(1, [["x", p + r]])],
            t(
              `**Check.** Take $x = 2^{${q}}$. Then $x^{\\frac{${p}}{${q}}} = ${pw("2", p)}$, and raising it to the power $${r}$ gives $2^{${p * r}}$; the answer gives $${k === 1 ? `x = 2^{${q}}` : `(2^{${q}})^{${k}} = 2^{${q * k}}`}$, the same number.`,
              `**检验。** 取 $x = 2^{${q}}$。则 $x^{\\frac{${p}}{${q}}} = ${pw("2", p)}$，再乘 $${r}$ 次方得 $2^{${p * r}}$；答案给出 $${k === 1 ? `x = 2^{${q}}` : `(2^{${q}})^{${k}} = 2^{${q * k}}`}$，是同一个数。`,
            ),
          );
        }
        const k = rng.int(1, 6);
        const m = k * q;
        const e = negative ? `-\\frac{1}{${q}}` : `\\frac{1}{${q}}`;
        const res = negative ? -k : k;
        return positiveProblem(
          `\\left(x^{${m}}\\right)^{${e}}`,
          1,
          [["x", res]],
          [`x^{${m} \\cdot \\left(${e}\\right)}`, ...(negative ? [`x^{${res}}`] : [])],
          t(
            `The power rule multiplies the exponents. Multiplying by $${e}$ divides $${m}$ by $${q}$, which is what a root of index $${q}$ does${negative ? ", and the minus sign makes the exponent negative" : ""}:`,
            `幂的乘方法则是指数相乘。乘以 $${e}$ 就是把 $${m}$ 除以 $${q}$，这正是开 $${q}$ 次方的作用${negative ? "；负号使指数变为负数" : ""}：`,
          ),
          [
            positive(1, [["x", (negative ? -1 : 1) * m * q]]),
            positive(1, [["x", (negative ? -1 : 1) * (m - q)]]),
            positive(1, [["x", -res]]),
          ],
          t(
            `**Check.** Raising the answer to the power $${q}$ should undo the root: $(${pw("x", res)})^{${q}} = x^{${res * q}}$, which is ${negative ? `$\\frac{1}{x^{${m}}}$, the reciprocal of $x^{${m}}$` : `$x^{${m}}$ itself`}.`,
            `**检验。** 把答案乘 $${q}$ 次方，应当抵消开方：$(${pw("x", res)})^{${q}} = x^{${res * q}}$，它${negative ? `是 $\\frac{1}{x^{${m}}}$，即 $x^{${m}}$ 的倒数` : `正是 $x^{${m}}$`}。`,
          ),
        );
      },
    },
  ],
};

export const powerOfProductRuleWithAlgebraicExpressions: TopicDef = {
  id: "power-of-product-rule-with-algebraic-expressions",
  title: t("The Power of Product Rule With Algebraic Expressions", "代数式中的积的乘方"),
  summary: t(
    "Raise a product of a coefficient and powers to a negative or fractional power.",
    "把由系数和幂组成的积进行负指数或分数指数的乘方。",
  ),
  prerequisites: ["power-rule-with-algebraic-expressions"],
  encompasses: [
    { topic: "power-rule-with-algebraic-expressions", weight: 0.5 },
    { topic: "power-rules", weight: 0.3 },
    { topic: "zero-and-negative-exponents", weight: 0.3 },
    { topic: "writing-radicals-using-fractional-exponents", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSN.RN.A.2", "CCSS.8.EE.A.1"],
  intro: t(
    `A power of a product repeats the whole product. Since factors can be multiplied in any order, the copies can be regrouped:

$$(3x^{2})^{3} = 3x^{2} \\cdot 3x^{2} \\cdot 3x^{2} = (3 \\cdot 3 \\cdot 3)(x^{2} \\cdot x^{2} \\cdot x^{2}) = 27x^{6}.$$

So $(ab)^{n} = a^{n}b^{n}$: **every** factor in the parentheses is raised to the power, the number in front included, and for the powers of variables the power rule multiplies the exponents. The rule keeps holding for negative and fractional exponents, which were defined to obey it: $(3x^{2})^{-1} = \\frac{1}{3x^{2}}$, and $(9x^{4})^{\\frac{1}{2}} = 3x^{2}$.

In this lesson we raise products of a coefficient and powers to negative and fractional powers. Throughout, no variable is $0$.`,
    `积的乘方是把整个乘积重复相乘。因为因数可以按任意顺序相乘，这些副本可以重新分组：

$$(3x^{2})^{3} = 3x^{2} \\cdot 3x^{2} \\cdot 3x^{2} = (3 \\cdot 3 \\cdot 3)(x^{2} \\cdot x^{2} \\cdot x^{2}) = 27x^{6}.$$

所以 $(ab)^{n} = a^{n}b^{n}$：括号里的**每一个**因数都要乘方，包括前面的数；字母的幂按幂的乘方法则把指数相乘。这条法则对负指数和分数指数仍然成立，因为它们就是按这些法则规定的：$(3x^{2})^{-1} = \\frac{1}{3x^{2}}$，$(9x^{4})^{\\frac{1}{2}} = 3x^{2}$。

这节课把由系数和幂组成的积进行负指数或分数指数的乘方。本节中所有字母都不为 $0$。`,
  ),
  knowledgePoints: [
    {
      id: "products-with-negative-exponents",
      title: t("Negative exponents inside", "括号内含负指数"),
      explanation: t(
        `$(ab)^{n} = a^{n}b^{n}$: raise every factor in the parentheses to the power, the coefficient included. For the coefficient that means computing a power of a number; for each variable, multiply its exponent by $n$, negative exponents included:

$$(-2x^{3}y^{-2})^{3} = (-2)^{3}x^{9}y^{-6} = -8x^{9}y^{-6} = -\\frac{8x^{9}}{y^{6}}$$

An odd power of a negative coefficient stays negative, $(-2)^{3} = -8$; an even power makes it positive, $(-2)^{2} = 4$. Finally $y^{-6}$ moves to the denominator as $y^{6}$.

> **Watch out.** Raise the coefficient to the power too: $(-2x^{3})^{3}$ has coefficient $-8$, not $-2$, and not $-2 \\cdot 3 = -6$. Multiply the exponents of the variables by $n$ rather than adding $n$ to them: $(x^{3})^{3} = x^{9}$, not $x^{6}$.`,
        `$(ab)^{n} = a^{n}b^{n}$：括号里的每个因数都要乘方，包括系数。对系数来说就是计算一个数的乘方；对每个字母，把它的指数乘以 $n$，负指数也一样：

$$(-2x^{3}y^{-2})^{3} = (-2)^{3}x^{9}y^{-6} = -8x^{9}y^{-6} = -\\frac{8x^{9}}{y^{6}}$$

负系数的奇数次幂仍为负，$(-2)^{3} = -8$；偶数次幂为正，$(-2)^{2} = 4$。最后把 $y^{-6}$ 移到分母，写成 $y^{6}$。

> **注意。** 系数也要乘方：$(-2x^{3})^{3}$ 的系数是 $-8$，而不是 $-2$，也不是 $-2 \\cdot 3 = -6$。字母的指数要乘以 $n$，而不是加上 $n$：$(x^{3})^{3} = x^{9}$，而不是 $x^{6}$。`,
      ),
      generate(rng) {
        const c = rng.pick([2, 3, 4, 5, -2, -3]);
        const n = Math.abs(c) >= 4 ? 2 : rng.pick([2, 3]);
        const two = rng.bool(0.7);
        let p: number;
        let q: number;
        do {
          p = rng.nonZero(-4, 5);
          q = two ? rng.nonZero(-4, 4) : 0;
        } while (!(p < 0 || q < 0));
        const inner = mono(c, [
          ["x", p],
          ["y", q],
        ]);
        const cn = c ** n;
        const result: Factors = [
          ["x", p * n],
          ["y", q * n],
        ];
        return positiveProblem(
          `(${inner})^{${n}}`,
          cn,
          result,
          [`${paren(c)}^{${n}}${mono(1, result)}`],
          t(
            `Every factor in the parentheses is raised to the power $${n}$. The coefficient gives $${paren(c)}^{${n}} = ${cn}$${c < 0 ? (n % 2 === 0 ? ", positive because the power is even" : ", negative because the power is odd") : ""}, and each exponent of a variable is multiplied by $${n}$:`,
            `括号里的每个因数都乘 $${n}$ 次方。系数得 $${paren(c)}^{${n}} = ${cn}$${c < 0 ? (n % 2 === 0 ? "，偶数次幂为正" : "，奇数次幂为负") : ""}；每个字母的指数都乘以 $${n}$：`,
          ),
          [
            positive(c, result),
            positive(c * n, result),
            positive(cn, [
              ["x", p + n],
              ["y", q === 0 ? 0 : q + n],
            ]),
          ],
          t(
            `**Check.** The power is $${n}$ copies of $${inner}$ multiplied. The coefficients multiply to $${Array(n).fill(paren(c)).join(" \\cdot ")} = ${cn}$, and the exponents of $x$ add to $${Array(n).fill(paren(p)).join(" + ")} = ${p * n}$${two ? `, those of $y$ to $${Array(n).fill(paren(q)).join(" + ")} = ${q * n}$` : ""}.`,
            `**检验。** 这个幂是 $${n}$ 个 $${inner}$ 相乘。系数相乘得 $${Array(n).fill(paren(c)).join(" \\cdot ")} = ${cn}$；$x$ 的指数相加得 $${Array(n).fill(paren(p)).join(" + ")} = ${p * n}$${two ? `，$y$ 的指数相加得 $${Array(n).fill(paren(q)).join(" + ")} = ${q * n}$` : ""}。`,
          ),
        );
      },
    },
    {
      id: "negative-powers-of-products",
      title: t("Negative powers of products", "积的负指数幂"),
      explanation: t(
        `A negative outside exponent means the reciprocal of the positive power: $(3x^{2}y)^{-2} = \\frac{1}{(3x^{2}y)^{2}} = \\frac{1}{9x^{4}y^{2}}$. The rule $(ab)^{n} = a^{n}b^{n}$ gets there in one go, raising every factor to $-2$, the coefficient included:

$$(3x^{2}y)^{-2} = 3^{-2}x^{-4}y^{-2} = \\frac{1}{9x^{4}y^{2}}$$

Because the coefficient is raised to a negative power, it ends up in the denominator as well: $3^{-2} = \\frac{1}{9}$. A negative exponent inside turns positive: $(2x^{-3})^{-2} = \\frac{x^{6}}{4}$.

> **Watch out.** A negative exponent never makes the coefficient negative: $3^{-2} = \\frac{1}{9}$, not $-9$. It is not a multiplication either, so the coefficient is not $\\frac{1}{3 \\cdot 2} = \\frac{1}{6}$. And it applies to the coefficient: leaving the $3$ as it is, or putting only $9$ on top, misses the reciprocal.`,
        `外面的负指数表示正指数幂的倒数：$(3x^{2}y)^{-2} = \\frac{1}{(3x^{2}y)^{2}} = \\frac{1}{9x^{4}y^{2}}$。用法则 $(ab)^{n} = a^{n}b^{n}$ 可以一步到位：每个因数都乘 $-2$ 次方，包括系数：

$$(3x^{2}y)^{-2} = 3^{-2}x^{-4}y^{-2} = \\frac{1}{9x^{4}y^{2}}$$

系数乘的是负指数次方，所以它也到了分母中：$3^{-2} = \\frac{1}{9}$。括号里的负指数则变为正的：$(2x^{-3})^{-2} = \\frac{x^{6}}{4}$。

> **注意。** 负指数不会让系数变成负数：$3^{-2} = \\frac{1}{9}$，而不是 $-9$。它也不是乘法，系数不是 $\\frac{1}{3 \\cdot 2} = \\frac{1}{6}$。负指数同样作用于系数：让 $3$ 保持不变，或把 $9$ 留在分子上，都漏掉了取倒数。`,
      ),
      generate(rng) {
        const c = rng.int(2, 5);
        const n = c >= 4 ? rng.pick([1, 2]) : rng.pick([1, 2, 3]);
        const two = rng.bool(0.6);
        let p: number;
        let q: number;
        do {
          p = rng.nonZero(-3, 5);
          q = two ? rng.nonZero(-3, 4) : 0;
        } while (p < 0 && q <= 0);
        const inner = mono(c, [
          ["x", p],
          ["y", q],
        ]);
        const cn = c ** n;
        const result: Factors = [
          ["x", -p * n],
          ["y", -q * n],
        ];
        return positiveProblem(
          `(${inner})^{-${n}}`,
          Q.of(1, cn),
          result,
          [`${c}^{-${n}}${mono(1, result)}`],
          t(
            `Raise every factor to the power $-${n}$, the coefficient included. The coefficient gives $${c}^{-${n}} = \\frac{1}{${cn}}$, and each exponent of a variable is multiplied by $-${n}$, which changes its sign:`,
            `每个因数都乘 $-${n}$ 次方，包括系数。系数得 $${c}^{-${n}} = \\frac{1}{${cn}}$；每个字母的指数都乘以 $-${n}$，符号随之改变：`,
          ),
          [positive(cn, result), positive(-cn, result), positive(Q.of(1, c * n), result), positive(Q.of(1, c), result)],
          t(
            `**Check.** A power $-${n}$ is the reciprocal of the power $${n}$. ${
              n === 1
                ? `Here the power $${n}$ is $${inner}$ itself`
                : `The positive power is $(${inner})^{${n}} = ${mono(cn, [
                    ["x", p * n],
                    ["y", q * n],
                  ])}$`
            }, and $1$ divided by it, with every exponent moved to make it positive, is $${positive(Q.of(1, cn), result)}$.`,
            `**检验。** $-${n}$ 次方是 $${n}$ 次方的倒数。${
              n === 1
                ? `这里 $${n}$ 次方就是 $${inner}$ 本身`
                : `正指数幂为 $(${inner})^{${n}} = ${mono(cn, [
                    ["x", p * n],
                    ["y", q * n],
                  ])}$`
            }；用 $1$ 除以它，再把指数都化为正的，得 $${positive(Q.of(1, cn), result)}$。`,
          ),
        );
      },
    },
    {
      id: "fractional-powers-of-products",
      title: t("Fractional powers of products", "积的分数指数幂"),
      explanation: t(
        `A fractional power of a product is the product of the fractional powers, since $(ab)^{n} = a^{n}b^{n}$ holds for every exponent. For the coefficient, take the root and then the power; for each variable, multiply its exponent by the fraction:

$$(8x^{6}y^{3})^{\\frac{1}{3}} = 8^{\\frac{1}{3}}x^{2}y = 2x^{2}y \\qquad (9x^{4})^{\\frac{3}{2}} = 9^{\\frac{3}{2}}x^{6} = 27x^{6}$$

In the second, $9^{\\frac{3}{2}} = (\\sqrt{9})^{3} = 3^{3} = 27$, and $4 \\cdot \\frac{3}{2} = 6$. The first can be checked by cubing: $(2x^{2}y)^{3} = 8x^{6}y^{3}$. Here the variables are positive.

> **Watch out.** The coefficient is raised to the fractional power too: $(9x^{4})^{\\frac{3}{2}}$ has coefficient $27$, not $9$, and not $9 \\cdot \\frac{3}{2}$. Multiply the exponents of the variables by the fraction, do not leave them as they are: $x^{4}$ becomes $x^{6}$, not $x^{12}$.`,
        `积的分数指数幂等于各因数分数指数幂的积，因为 $(ab)^{n} = a^{n}b^{n}$ 对任何指数都成立。系数先开方再乘方；每个字母的指数乘以这个分数：

$$(8x^{6}y^{3})^{\\frac{1}{3}} = 8^{\\frac{1}{3}}x^{2}y = 2x^{2}y \\qquad (9x^{4})^{\\frac{3}{2}} = 9^{\\frac{3}{2}}x^{6} = 27x^{6}$$

第二个式子中，$9^{\\frac{3}{2}} = (\\sqrt{9})^{3} = 3^{3} = 27$，而 $4 \\cdot \\frac{3}{2} = 6$。第一个式子可以用立方来检验：$(2x^{2}y)^{3} = 8x^{6}y^{3}$。这里的字母都是正数。

> **注意。** 系数也要取分数指数幂：$(9x^{4})^{\\frac{3}{2}}$ 的系数是 $27$，而不是 $9$，也不是 $9 \\cdot \\frac{3}{2}$。字母的指数要乘以这个分数：$x^{4}$ 变为 $x^{6}$，而不是 $x^{12}$。`,
      ),
      keyPrerequisites: ["writing-radicals-using-fractional-exponents"],
      generate(rng) {
        const n = rng.pick([2, 2, 3]);
        const r = rng.int(2, n === 2 ? 9 : 4);
        const m = rng.bool(0.3) && r <= 5 ? rng.pick(n === 2 ? [3] : [2]) : 1;
        const two = rng.bool(0.5);
        const p = rng.int(1, 4);
        const q = two ? rng.int(1, 3) : 0;
        const inner = mono(r ** n, [
          ["x", n * p],
          ["y", n * q],
        ]);
        const e = m === 1 ? `\\frac{1}{${n}}` : `\\frac{${m}}{${n}}`;
        const result: Factors = [
          ["x", p * m],
          ["y", q * m],
        ];
        const answer = mono(r ** m, result);
        return expressionProblem({
          prompt: t(`Simplify $(${inner})^{${e}}$, where the variables are positive.`, `化简 $(${inner})^{${e}}$，其中字母都是正数。`),
          answer,
          simplified: true,
          positive: true,
          wrong: [
            mono(r ** n, result),
            mono(r ** m, [
              ["x", n * p * m],
              ["y", n * q * m],
            ]),
            mono(r, [
              ["x", p],
              ["y", q],
            ]),
            mono(Q.of(r ** n * m, n), result),
          ],
          solution: t(
            `**Step 1: the coefficient.** The denominator $${n}$ of the exponent is a root${m === 1 ? "" : ` and the numerator $${m}$ a power`}; take the root first:${steps(`${r ** n}^{${e}} = ${m === 1 ? root(n, String(r ** n)) : `\\left(${root(n, String(r ** n))}\\right)^{${m}}`} = ${m === 1 ? r : `${r}^{${m}} = ${r ** m}`}`)}**Step 2: the variables.** Multiply each exponent by $${e}$: ${[
              [true, "x", n * p, p * m],
              [two, "y", n * q, q * m],
            ]
              .filter(([on]) => on)
              .map(([, l, from, to]) => `$${from} \\cdot ${e} = ${to}$ for $${l}$`)
              .join(" and ")}. Together:${steps(`(${inner})^{${e}} = ${r ** n}^{${e}}${mono(1, result)} = ${answer}`)}**Check.** ${
              m === 1
                ? `Raising the answer to the power $${n}$ should give back the inside: $(${answer})^{${n}} = ${inner}$.`
                : `Raising the answer to the power $${n}$ should give the inside raised to the power $${m}$: $(${answer})^{${n}} = ${mono(
                    r ** (m * n),
                    [
                      ["x", p * m * n],
                      ["y", q * m * n],
                    ],
                  )} = (${inner})^{${m}}$.`
            }`,
            `**第一步：系数。** 指数的分母 $${n}$ 表示开方${m === 1 ? "" : `，分子 $${m}$ 表示乘方`}；先开方：${steps(`${r ** n}^{${e}} = ${m === 1 ? root(n, String(r ** n)) : `\\left(${root(n, String(r ** n))}\\right)^{${m}}`} = ${m === 1 ? r : `${r}^{${m}} = ${r ** m}`}`)}**第二步：字母。** 每个指数乘以 $${e}$：${[
              [true, "x", n * p, p * m],
              [two, "y", n * q, q * m],
            ]
              .filter(([on]) => on)
              .map(([, l, from, to]) => `$${l}$ 的指数 $${from} \\cdot ${e} = ${to}$`)
              .join("，")}。合起来：${steps(`(${inner})^{${e}} = ${r ** n}^{${e}}${mono(1, result)} = ${answer}`)}**检验。** ${
              m === 1
                ? `把答案乘 $${n}$ 次方，应当得回括号里的式子：$(${answer})^{${n}} = ${inner}$。`
                : `把答案乘 $${n}$ 次方，应当得到括号里式子的 $${m}$ 次方：$(${answer})^{${n}} = ${mono(r ** (m * n), [
                    ["x", p * m * n],
                    ["y", q * m * n],
                  ])} = (${inner})^{${m}}$。`
            }`,
          ),
        });
      },
    },
  ],
};

export const powerOfQuotientRuleWithAlgebraicExpressions: TopicDef = {
  id: "power-of-quotient-rule-with-algebraic-expressions",
  title: t("The Power of Quotient Rule With Algebraic Expressions", "代数式中的商的乘方"),
  summary: t(
    "Raise a quotient of monomials to a power, including negative powers, by raising the numerator and the denominator.",
    "求单项式之商的乘方（包括负指数幂）：分子、分母分别乘方。",
  ),
  prerequisites: ["power-of-product-rule-with-algebraic-expressions", "quotient-rule-with-algebraic-expressions"],
  encompasses: [
    { topic: "power-of-product-rule-with-algebraic-expressions", weight: 0.5 },
    { topic: "quotient-rule-with-algebraic-expressions", weight: 0.2 },
    { topic: "zero-and-negative-exponents", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.8.EE.A.1"],
  intro: t(
    `A power of a fraction repeats the fraction, and fractions multiply top times top and bottom times bottom:

$$\\left(\\frac{2x}{y^{2}}\\right)^{3} = \\frac{2x}{y^{2}} \\cdot \\frac{2x}{y^{2}} \\cdot \\frac{2x}{y^{2}} = \\frac{(2x)^{3}}{(y^{2})^{3}} = \\frac{8x^{3}}{y^{6}}.$$

So $\\left(\\frac{a}{b}\\right)^{n} = \\frac{a^{n}}{b^{n}}$: the numerator and the denominator are each raised to the power, and inside each of them the power of a product does the rest. A negative power means the reciprocal, and the reciprocal of a fraction is the same fraction flipped, so $\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^{n}$.

In this lesson we raise quotients of monomials to positive and negative powers, simplifying inside the parentheses first when that helps. Throughout, no variable is $0$.`,
    `分数的乘方是把分数重复相乘，而分数相乘就是分子乘分子、分母乘分母：

$$\\left(\\frac{2x}{y^{2}}\\right)^{3} = \\frac{2x}{y^{2}} \\cdot \\frac{2x}{y^{2}} \\cdot \\frac{2x}{y^{2}} = \\frac{(2x)^{3}}{(y^{2})^{3}} = \\frac{8x^{3}}{y^{6}}.$$

所以 $\\left(\\frac{a}{b}\\right)^{n} = \\frac{a^{n}}{b^{n}}$：分子、分母分别乘方，各自内部再用积的乘方完成。负指数幂表示倒数，而分数的倒数就是把它颠倒，所以 $\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^{n}$。

这节课求单项式之商的正指数幂和负指数幂，必要时先化简括号内。本节中所有字母都不为 $0$。`,
  ),
  knowledgePoints: [
    {
      id: "powers-of-quotients",
      title: t("Powers of quotients", "商的乘方"),
      explanation: t(
        `$\\left(\\frac{a}{b}\\right)^{n} = \\frac{a^{n}}{b^{n}}$, because multiplying $n$ copies of a fraction multiplies $n$ copies of its numerator and $n$ copies of its denominator. So raise the whole numerator and the whole denominator to the power, coefficients included:

$$\\left(\\frac{2x^{2}}{3y}\\right)^{3} = \\frac{(2x^{2})^{3}}{(3y)^{3}} = \\frac{8x^{6}}{27y^{3}}$$

Inside each part, the power of a product raises the number and multiplies the exponents: $(2x^{2})^{3} = 2^{3}x^{6}$ and $(3y)^{3} = 3^{3}y^{3}$.

> **Watch out.** A common mistake is to leave the $3$ in the denominator unpowered, writing $\\frac{8x^{6}}{3y^{3}}$; every factor, top and bottom, is raised. Do not forget the coefficients either ($\\frac{2}{3}$ becomes $\\frac{8}{27}$), and multiply the exponents rather than add the power to them.`,
        `$\\left(\\frac{a}{b}\\right)^{n} = \\frac{a^{n}}{b^{n}}$，因为 $n$ 个相同的分数相乘，就是 $n$ 个分子相乘、$n$ 个分母相乘。所以整个分子和整个分母都要乘方，包括系数：

$$\\left(\\frac{2x^{2}}{3y}\\right)^{3} = \\frac{(2x^{2})^{3}}{(3y)^{3}} = \\frac{8x^{6}}{27y^{3}}$$

在分子、分母内部，用积的乘方：数乘方，指数相乘。$(2x^{2})^{3} = 2^{3}x^{6}$，$(3y)^{3} = 3^{3}y^{3}$。

> **注意。** 常见错误是忘记给分母中的 $3$ 乘方，写成 $\\frac{8x^{6}}{3y^{3}}$；分子分母中的每个因数都要乘方。系数也不能忘（$\\frac{2}{3}$ 变成 $\\frac{8}{27}$），指数要相乘，而不是加上乘方的次数。`,
      ),
      generate(rng) {
        const [a, b] = pickCoprime(rng, [1, 5], [2, 5]);
        const n = Math.max(a, b) >= 4 ? 2 : rng.pick([2, 3]);
        const p = rng.int(1, 5);
        const q = rng.int(1, 4);
        const top = mono(a, [["x", p]]);
        const bottom = mono(b, [["y", q]]);
        const c = Q.of(a ** n, b ** n);
        const result: Factors = [
          ["x", p * n],
          ["y", -q * n],
        ];
        return positiveProblem(
          `\\left(\\frac{${top}}{${bottom}}\\right)^{${n}}`,
          c,
          result,
          [`\\frac{(${top})^{${n}}}{(${bottom})^{${n}}}`],
          t(
            `Raise the whole numerator and the whole denominator to the power $${n}$. In each, the coefficient is raised and the exponent multiplied by $${n}$: $(${top})^{${n}} = ${mono(a ** n, [["x", p * n]])}$ and $(${bottom})^{${n}} = ${mono(b ** n, [["y", q * n]])}$.`,
            `整个分子和整个分母分别乘 $${n}$ 次方。各自的系数乘方，指数乘以 $${n}$：$(${top})^{${n}} = ${mono(a ** n, [["x", p * n]])}$，$(${bottom})^{${n}} = ${mono(b ** n, [["y", q * n]])}$。`,
          ),
          [
            `\\frac{${mono(a ** n, [["x", p * n]])}}{${mono(b, [["y", q * n]])}}`,
            positive(Q.of(a, b), result),
            positive(c, [
              ["x", p + n],
              ["y", -(q + n)],
            ]),
          ],
          t(
            `**Check.** Multiply out the $${n}$ copies of the fraction instead: the numerators give $${Array(n).fill(top).join(" \\cdot ")} = ${mono(a ** n, [["x", p * n]])}$ and the denominators $${Array(n).fill(bottom).join(" \\cdot ")} = ${mono(b ** n, [["y", q * n]])}$, the same as above.`,
            `**检验。** 改为把 $${n}$ 个分数直接相乘：分子得 $${Array(n).fill(top).join(" \\cdot ")} = ${mono(a ** n, [["x", p * n]])}$，分母得 $${Array(n).fill(bottom).join(" \\cdot ")} = ${mono(b ** n, [["y", q * n]])}$，与上面相同。`,
          ),
        );
      },
    },
    {
      id: "negative-powers-of-quotients",
      title: t("Negative powers of quotients", "商的负指数幂"),
      explanation: t(
        `A negative power is the reciprocal of the positive power: $\\left(\\frac{a}{b}\\right)^{-n} = \\frac{1}{\\left(\\frac{a}{b}\\right)^{n}}$. Dividing $1$ by a fraction flips it, so a negative power of a fraction is the positive power of its reciprocal:

$$\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^{n}$$

So flip the fraction first, which makes the exponent positive, then raise it to the power as before:

$$\\left(\\frac{2x}{y^{3}}\\right)^{-2} = \\left(\\frac{y^{3}}{2x}\\right)^{2} = \\frac{y^{6}}{4x^{2}}$$

> **Watch out.** Flipping is what the minus sign does, so do it exactly once: raising $\\frac{2x}{y^{3}}$ to the power $2$ without flipping gives the reciprocal of the answer. The minus sign never makes the result negative, and the coefficient $2$ is still raised to the power: $4$, not $2$.`,
        `负指数幂是正指数幂的倒数：$\\left(\\frac{a}{b}\\right)^{-n} = \\frac{1}{\\left(\\frac{a}{b}\\right)^{n}}$。用 $1$ 除以一个分数就是把它颠倒，所以分数的负指数幂等于其倒数的正指数幂：

$$\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^{n}$$

所以先把分数颠倒，使指数变为正的，再像之前一样乘方：

$$\\left(\\frac{2x}{y^{3}}\\right)^{-2} = \\left(\\frac{y^{3}}{2x}\\right)^{2} = \\frac{y^{6}}{4x^{2}}$$

> **注意。** 颠倒正是负号的作用，所以只颠倒一次：不颠倒就把 $\\frac{2x}{y^{3}}$ 平方，得到的是答案的倒数。负号也不会让结果变成负数，而系数 $2$ 仍要乘方：得 $4$，而不是 $2$。`,
      ),
      generate(rng) {
        const [a, b] = pickCoprime(rng, [1, 5], [1, 4]);
        const n = Math.max(a, b) >= 4 ? rng.pick([1, 2]) : rng.pick([1, 2, 3]);
        const p = rng.int(1, 5);
        const q = rng.int(1, 4);
        const top = mono(a, [["x", p]]);
        const bottom = mono(b, [["y", q]]);
        const c = Q.of(b ** n, a ** n);
        const result: Factors = [
          ["x", -p * n],
          ["y", q * n],
        ];
        const flipped = `\\left(\\frac{${bottom}}{${top}}\\right)${n === 1 ? "" : `^{${n}}`}`;
        return positiveProblem(
          `\\left(\\frac{${top}}{${bottom}}\\right)^{-${n}}`,
          c,
          result,
          [flipped],
          t(
            `A negative power of a fraction is the positive power of its reciprocal, so flip the fraction to make the exponent positive${n === 1 ? "" : `, then raise its numerator and its denominator to the power $${n}$`}:`,
            `分数的负指数幂等于其倒数的正指数幂，所以先把分数颠倒，使指数变为正的${n === 1 ? "" : `，再把分子、分母分别乘 $${n}$ 次方`}：`,
          ),
          [
            positive(Q.of(a ** n, b ** n), [
              ["x", p * n],
              ["y", -q * n],
            ]),
            positive(Q.of(b, a), result),
            positive(c.neg(), result),
          ],
          t(
            `**Check.** Go the other way: raise first, then take the reciprocal. ${
              n === 1
                ? `The fraction is $\\frac{${top}}{${bottom}}$`
                : `$\\left(\\frac{${top}}{${bottom}}\\right)^{${n}} = ${positive(Q.of(a ** n, b ** n), [
                    ["x", p * n],
                    ["y", -q * n],
                  ])}$`
            }, and $1$ divided by it is the same fraction upside down, $${positive(c, result)}$.`,
            `**检验。** 换个顺序：先乘方，再取倒数。${
              n === 1
                ? `这个分数是 $\\frac{${top}}{${bottom}}$`
                : `$\\left(\\frac{${top}}{${bottom}}\\right)^{${n}} = ${positive(Q.of(a ** n, b ** n), [
                    ["x", p * n],
                    ["y", -q * n],
                  ])}$`
            }，用 $1$ 除以它就是把它颠倒，得 $${positive(c, result)}$。`,
          ),
        );
      },
    },
    {
      id: "simplifying-inside-first",
      title: t("Simplifying inside first", "先化简括号内"),
      explanation: t(
        `When the same variable is in the numerator and the denominator, simplify inside the parentheses first: reduce the coefficients and subtract the exponents. The value inside does not change, so its power does not either, and the numbers stay smaller:

$$\\left(\\frac{6x^{5}}{9x^{2}}\\right)^{2} = \\left(\\frac{2x^{3}}{3}\\right)^{2} = \\frac{4x^{6}}{9}$$

Raising first would give $\\frac{36x^{10}}{81x^{4}}$, which reduces to the same $\\frac{4x^{6}}{9}$ with more work. If the outside exponent is negative, flip the simplified fraction before raising it.

> **Watch out.** After simplifying, the outside exponent still multiplies the exponent inside: $(x^{3})^{2} = x^{6}$, not $x^{5}$. And it applies to the coefficients as well: the $\\frac{2}{3}$ becomes $\\frac{4}{9}$, so do not leave it as $\\frac{2}{3}$.`,
        `同一个字母同时出现在分子和分母中时，先化简括号内：系数约分，指数相减。括号里的值没有变，所以它的幂也不变，而数会小一些：

$$\\left(\\frac{6x^{5}}{9x^{2}}\\right)^{2} = \\left(\\frac{2x^{3}}{3}\\right)^{2} = \\frac{4x^{6}}{9}$$

先乘方会得到 $\\frac{36x^{10}}{81x^{4}}$，约分后也是 $\\frac{4x^{6}}{9}$，只是更费事。如果外面的指数是负的，先把化简后的分数颠倒，再乘方。

> **注意。** 化简之后，外面的指数仍要乘以里面的指数：$(x^{3})^{2} = x^{6}$，而不是 $x^{5}$。它同样作用于系数：$\\frac{2}{3}$ 变成 $\\frac{4}{9}$，不能仍写 $\\frac{2}{3}$。`,
      ),
      generate(rng) {
        const [a, b] = pickCoprime(rng, [1, 4], [1, 4]);
        const g = rng.int(2, 4);
        const n = rng.pick([2, 2, 3, -2]);
        let p: number;
        let r: number;
        do {
          p = rng.int(1, 8);
          r = rng.int(1, 8);
        } while (p === r || Math.abs((p - r) * n) > 12);
        const expr = `\\left(\\frac{${mono(g * a, [["x", p]])}}{${mono(g * b, [["x", r]])}}\\right)^{${n}}`;
        const inside = positive(Q.of(a, b), [["x", p - r]]);
        const c = Q.of(a, b).pow(n);
        const result: Factors = [["x", (p - r) * n]];
        return positiveProblem(
          expr,
          c,
          result,
          [`\\left(${inside}\\right)^{${n}}`],
          t(
            `Simplify inside the parentheses first: $\\frac{${g * a}}{${g * b}} = ${Q.of(a, b).toLatex()}$, and the exponent of $x$ is $${p} - ${r} = ${p - r}$. Then raise the simplified fraction to the power $${n}$${n < 0 ? ", which flips it" : ""}:`,
            `先化简括号内：$\\frac{${g * a}}{${g * b}} = ${Q.of(a, b).toLatex()}$，$x$ 的指数为 $${p} - ${r} = ${p - r}$。再把化简后的分数乘 $${n}$ 次方${n < 0 ? "，这会把它颠倒" : ""}：`,
          ),
          [
            positive(c, [["x", p - r + n]]),
            positive(Q.of(a, b), result),
            `\\frac{${(g * a) ** Math.abs(n)}x^{${Math.abs((p - r) * n)}}}{${(g * b) ** Math.abs(n)}}`,
          ],
          t(
            `**Check.** Raising first and simplifying afterwards gives the same result. The power $${Math.abs(n)}$ of the fraction is $\\frac{${(g * a) ** Math.abs(n)}x^{${p * Math.abs(n)}}}{${(g * b) ** Math.abs(n)}x^{${r * Math.abs(n)}}}$${n < 0 ? ", to be flipped for the negative power" : ""}; its coefficient reduces to $${Q.of(a, b).pow(Math.abs(n)).toLatex()}$ and its exponent is $${p * Math.abs(n)} - ${r * Math.abs(n)} = ${(p - r) * Math.abs(n)}$, which agrees.`,
            `**检验。** 先乘方、后化简，结果相同。分数的 $${Math.abs(n)}$ 次方为 $\\frac{${(g * a) ** Math.abs(n)}x^{${p * Math.abs(n)}}}{${(g * b) ** Math.abs(n)}x^{${r * Math.abs(n)}}}$${n < 0 ? "（负指数还要把它颠倒）" : ""}；系数约分得 $${Q.of(a, b).pow(Math.abs(n)).toLatex()}$，指数为 $${p * Math.abs(n)} - ${r * Math.abs(n)} = ${(p - r) * Math.abs(n)}$，与上面一致。`,
          ),
        );
      },
    },
  ],
};

export const combiningRulesOfExponentsWithAlgebraicExpressions: TopicDef = {
  id: "combining-rules-of-exponents-with-algebraic-expressions",
  title: t("Combining the Rules of Exponents With Algebraic Expressions", "综合运用指数法则化简代数式"),
  summary: t(
    "Simplify expressions that need several rules of exponents, writing the result with positive exponents.",
    "化简需要综合运用多条指数法则的式子，结果用正指数表示。",
  ),
  prerequisites: ["power-of-quotient-rule-with-algebraic-expressions"],
  encompasses: [
    { topic: "power-of-product-rule-with-algebraic-expressions", weight: 0.5 },
    { topic: "quotient-rule-with-algebraic-expressions", weight: 0.5 },
    { topic: "product-rule-with-algebraic-expressions", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.8.EE.A.1", "CCSS.HSA.SSE.A.2"],
  intro: t(
    `Each rule of exponents so far did one job: a product adds exponents, a quotient subtracts them, a power multiplies them, and a power of a product or a quotient reaches every factor. Real expressions mix them, and the work is to apply them one at a time, in the order of operations: **powers first**, then products, then the quotient.

For instance,

$$\\frac{(x^{2})^{3} \\cdot x}{x^{4}} = \\frac{x^{6} \\cdot x}{x^{4}} = \\frac{x^{7}}{x^{4}} = x^{3}.$$

Counting factors confirms it: six and one make seven on top, four cancel, three remain. When the exponents are expressions in $n$, the same steps become algebra on the exponents. Writing each intermediate result keeps the signs under control.

In this lesson we simplify such expressions and write the result with positive exponents. Throughout, no variable is $0$.`,
    `到目前为止，每条指数法则各管一件事：乘积让指数相加，商让指数相减，乘方让指数相乘，积或商的乘方作用于每一个因数。实际的式子会把它们混在一起，做法是按运算顺序一次用一条：**先算乘方**，再算乘法，最后算除法。

例如

$$\\frac{(x^{2})^{3} \\cdot x}{x^{4}} = \\frac{x^{6} \\cdot x}{x^{4}} = \\frac{x^{7}}{x^{4}} = x^{3}.$$

数一数因数也能确认：分子有六个再加一个，共七个，约去四个，剩下三个。指数是关于 $n$ 的代数式时，同样的步骤就成了对指数的代数运算。写出每一步的中间结果，能管住符号。

这节课化简这样的式子，结果用正指数表示。本节中所有字母都不为 $0$。`,
  ),
  knowledgePoints: [
    {
      id: "products-and-quotients-of-powers",
      title: t("Powers, products and quotients", "幂、积与商"),
      explanation: t(
        `Work in the order of operations: first the power of a product, then the multiplication in the numerator (add exponents), then the division (subtract exponents), and finally move the negative powers to the denominator:

$$\\frac{(2x^{-1}y^{2})^{2} \\cdot 3x^{4}}{6xy^{5}} = \\frac{4x^{-2}y^{4} \\cdot 3x^{4}}{6xy^{5}} = \\frac{12x^{2}y^{4}}{6xy^{5}} = 2xy^{-1} = \\frac{2x}{y}$$

Step by step: squaring gives $2^{2} = 4$ and exponents $-2$ and $4$; multiplying by $3x^{4}$ gives $12$ and $x^{-2 + 4} = x^{2}$; dividing gives $\\frac{12}{6} = 2$, $x^{2 - 1}$ and $y^{4 - 5} = y^{-1}$.

> **Watch out.** Do the power before the multiplication: the square applies to $2x^{-1}y^{2}$ only, so its exponents are doubled, $-1 \\cdot 2 = -2$, not increased by $2$. Square the coefficient too: $2^{2} = 4$, not $2$. And when dividing, subtract the exponents of the denominator; adding them is a common slip.`,
        `按运算顺序进行：先算积的乘方，再算分子中的乘法（指数相加），然后做除法（指数相减），最后把负指数幂移到分母：

$$\\frac{(2x^{-1}y^{2})^{2} \\cdot 3x^{4}}{6xy^{5}} = \\frac{4x^{-2}y^{4} \\cdot 3x^{4}}{6xy^{5}} = \\frac{12x^{2}y^{4}}{6xy^{5}} = 2xy^{-1} = \\frac{2x}{y}$$

逐步来看：平方得 $2^{2} = 4$，指数为 $-2$ 和 $4$；乘以 $3x^{4}$ 得 $12$ 和 $x^{-2 + 4} = x^{2}$；相除得 $\\frac{12}{6} = 2$、$x^{2 - 1}$ 和 $y^{4 - 5} = y^{-1}$。

> **注意。** 先乘方再乘法：平方只作用于 $2x^{-1}y^{2}$，它的指数要乘以 $2$，即 $-1 \\cdot 2 = -2$，而不是加 $2$。系数也要平方，得 $4$。做除法时要减去分母的指数，把它们相加是常见的失误。`,
      ),
      generate(rng) {
        const c = rng.pick([2, 3, -2]);
        const d = rng.int(1, 6);
        const top = c * c * d;
        const g = rng.pick([1, 2, 3, 4, 6, 8, 12].filter((x) => top % x === 0 && x !== top));
        let p: number;
        let q: number;
        let r: number;
        let s: number;
        let u: number;
        let w: number;
        do {
          [p, q, r, s, u, w] = [rng.nonZero(-3, 4), rng.nonZero(-2, 3), rng.int(1, 5), rng.int(0, 3), rng.int(1, 6), rng.int(1, 6)];
        } while (2 * p + r - u === 0 || !(2 * p + r - u < 0 || 2 * q + s - w < 0) || (p > 0 && q > 0));
        const square = mono(c, [
          ["x", p],
          ["y", q],
        ]);
        const factor = mono(d, [
          ["x", r],
          ["y", s],
        ]);
        const below = mono(g, [
          ["x", u],
          ["y", w],
        ]);
        const expr = `\\frac{(${square})^{2} \\cdot ${factor}}{${below}}`;
        const numerator = mono(top, [
          ["x", 2 * p + r],
          ["y", 2 * q + s],
        ]);
        const coefficient = Q.of(top, g);
        const result: Factors = [
          ["x", 2 * p + r - u],
          ["y", 2 * q + s - w],
        ];
        return positiveProblem(
          expr,
          coefficient,
          result,
          [
            `\\frac{${mono(c * c, [
              ["x", 2 * p],
              ["y", 2 * q],
            ])} \\cdot ${factor}}{${below}}`,
            `\\frac{${numerator}}{${below}}`,
          ],
          t(
            `Follow the order of operations. **Step 1:** square $${square}$, squaring the coefficient, $${paren(c)}^{2} = ${c * c}$, and doubling each exponent. **Step 2:** multiply in the numerator, multiplying the coefficients and adding the exponents. **Step 3:** divide by $${below}$, dividing the coefficients and subtracting the exponents:`,
            `按运算顺序进行。**第一步：** 把 $${square}$ 平方，系数平方 $${paren(c)}^{2} = ${c * c}$，每个指数乘以 $2$。**第二步：** 算分子中的乘法，系数相乘，指数相加。**第三步：** 除以 $${below}$，系数相除，指数相减：`,
          ),
          [
            positive(Q.of(c * d, g), result),
            positive(coefficient, [
              ["x", p + 2 + r - u],
              ["y", q + 2 + s - w],
            ]),
            positive(coefficient, [
              ["x", 2 * p + r + u],
              ["y", 2 * q + s + w],
            ]),
          ],
          t(
            `**Check.** Count each part straight from the question in one line. The coefficient is $${paren(c)}^{2} \\cdot ${d}${g === 1 ? "" : ` \\div ${g}`} = ${coefficient.toLatex()}$. The exponent of $x$ is $2 \\cdot ${paren(p)} + ${r} - ${u} = ${2 * p + r - u}$, and that of $y$ is $2 \\cdot ${paren(q)}${s === 0 ? "" : ` + ${s}`} - ${w} = ${2 * q + s - w}$, as found.`,
            `**检验。** 直接从原式出发，各用一行算式重算。系数为 $${paren(c)}^{2} \\cdot ${d}${g === 1 ? "" : ` \\div ${g}`} = ${coefficient.toLatex()}$。$x$ 的指数为 $2 \\cdot ${paren(p)} + ${r} - ${u} = ${2 * p + r - u}$，$y$ 的指数为 $2 \\cdot ${paren(q)}${s === 0 ? "" : ` + ${s}`} - ${w} = ${2 * q + s - w}$，与所得结果一致。`,
          ),
        );
      },
    },
    {
      id: "negative-powers-in-combinations",
      title: t("Negative powers in combinations", "综合运算中的负指数幂"),
      explanation: t(
        `When several exponent rules are needed, work one step at a time and write each intermediate result. Keep the coefficients and each variable separate as you combine.

A power comes before a product, so treat the negative power of a fraction first: flip the fraction to make the exponent positive, and raise it. Then multiply:

$$\\left(\\frac{2x}{y^{2}}\\right)^{-3} \\cdot 4x^{5}y = \\frac{y^{6}}{8x^{3}} \\cdot 4x^{5}y = \\frac{4x^{5}y^{7}}{8x^{3}} = \\frac{x^{2}y^{7}}{2}$$

The coefficient is $\\frac{4}{8} = \\frac{1}{2}$, the exponent of $x$ is $5 - 3 = 2$, and that of $y$ is $6 + 1 = 7$.

> **Watch out.** The power $-3$ belongs to the whole fraction, coefficient included: $2^{3} = 8$ ends up in the denominator, not $2$, and not on top. Flip the fraction before raising it, or the powers of $x$ and $y$ land on the wrong side. Multiply the exponents by $3$; adding $3$ to them is the other common slip.`,
        `需要用到几条指数法则时，一步一步地算，并写出每个中间结果。合并时把系数和每个字母分开处理。

乘方先于乘法，所以先处理分数的负指数幂：把分数颠倒，使指数为正，再乘方。然后相乘：

$$\\left(\\frac{2x}{y^{2}}\\right)^{-3} \\cdot 4x^{5}y = \\frac{y^{6}}{8x^{3}} \\cdot 4x^{5}y = \\frac{4x^{5}y^{7}}{8x^{3}} = \\frac{x^{2}y^{7}}{2}$$

系数为 $\\frac{4}{8} = \\frac{1}{2}$，$x$ 的指数为 $5 - 3 = 2$，$y$ 的指数为 $6 + 1 = 7$。

> **注意。** 指数 $-3$ 作用于整个分数，包括系数：分母中是 $2^{3} = 8$，而不是 $2$，也不在分子上。先颠倒再乘方，否则 $x$ 和 $y$ 的幂会落在错误的一边。指数要乘以 $3$，加上 $3$ 是另一个常见失误。`,
      ),
      generate(rng) {
        const a = rng.int(1, 3);
        const n = a === 3 ? rng.pick([1, 2]) : rng.pick([1, 2, 3]);
        const b = rng.int(1, 9);
        let p: number;
        let q: number;
        let r: number;
        let s: number;
        do {
          [p, q, r, s] = [rng.int(1, 4), rng.int(1, 3), rng.int(-4, 8), rng.int(-5, 4)];
        } while (r - p * n === 0 && s + q * n === 0);
        const top = mono(a, [["x", p]]);
        const bottom = pw("y", q);
        const factor = mono(b, [
          ["x", r],
          ["y", s],
        ]);
        const expr = `\\left(\\frac{${top}}{${bottom}}\\right)^{-${n}} \\cdot ${factor}`;
        const coefficient = Q.of(b, a ** n);
        const result: Factors = [
          ["x", r - p * n],
          ["y", s + q * n],
        ];
        return positiveProblem(
          expr,
          coefficient,
          result,
          [
            `${positive(Q.of(1, a ** n), [
              ["x", -p * n],
              ["y", q * n],
            ])} \\cdot ${factor}`,
          ],
          t(
            `**Step 1:** the power comes first. Flip the fraction to make its exponent positive and raise it to the power $${n}$: $\\left(\\frac{${bottom}}{${top}}\\right)${n === 1 ? "" : `^{${n}}`} = ${positive(
              Q.of(1, a ** n),
              [
                ["x", -p * n],
                ["y", q * n],
              ],
            )}$. **Step 2:** multiply by $${factor}$, multiplying the coefficients and adding the exponents of each variable:`,
            `**第一步：** 先算乘方。把分数颠倒使指数为正，再乘 $${n}$ 次方：$\\left(\\frac{${bottom}}{${top}}\\right)${n === 1 ? "" : `^{${n}}`} = ${positive(
              Q.of(1, a ** n),
              [
                ["x", -p * n],
                ["y", q * n],
              ],
            )}$。**第二步：** 乘以 $${factor}$，系数相乘，每个字母的指数相加：`,
          ),
          [
            positive(b * a ** n, [
              ["x", r + p * n],
              ["y", s - q * n],
            ]),
            positive(Q.of(b, a), result),
            positive(coefficient, [
              ["x", r - p - n],
              ["y", s + q + n],
            ]),
          ],
          t(
            `**Check.** Count each part straight from the question. ${a === 1 ? `The coefficient stays $${b}$, since $1$ to any power is $1$.` : `The coefficient is $${b} \\div ${n === 1 ? a : `${a}^{${n}}`} = ${coefficient.toLatex()}$.`} The exponent of $x$ is ${combo(-p, n, r)}, and that of $y$ is ${combo(q, n, s)}, as found.`,
            `**检验。** 直接从原式出发重算各部分。${a === 1 ? `系数仍是 $${b}$，因为 $1$ 的任何次幂都是 $1$。` : `系数为 $${b} \\div ${n === 1 ? a : `${a}^{${n}}`} = ${coefficient.toLatex()}$。`}$x$ 的指数为 ${combo(-p, n, r)}，$y$ 的指数为 ${combo(q, n, s)}，与所得结果一致。`,
          ),
        );
      },
    },
    {
      id: "combining-algebraic-exponents",
      title: t("Algebraic exponents", "代数式指数"),
      explanation: t(
        "With algebraic exponents, the same rules turn into algebra on the exponents: a power multiplies, a product adds, a quotient subtracts. Writing each exponent in parentheses first keeps every term in its place.\n\n$$\\frac{(x^{n + 1})^{2} \\cdot x^{3n}}{x^{n - 2}} = x^{2(n + 1) + 3n - (n - 2)} = x^{2n + 2 + 3n - n + 2} = x^{4n + 4}$$\n\nA number check catches slips: at $n = 2$ the question is $\\frac{(x^{3})^{2} \\cdot x^{6}}{x^{0}} = x^{12}$, and $4(2) + 4 = 12$.\n\n> **Watch out.** The power multiplies the constant too: $2(n + 1) = 2n + 2$, not $2n + 1$. Subtracting $n - 2$ changes both signs, so $-2$ becomes $+2$; and the exponent of the denominator is subtracted, never added.",
        "指数为代数式时，同样的法则变成对指数的代数运算：乘方相乘，乘法相加，除法相减。先给每个指数加上括号，每一项就不会放错位置。\n\n$$\\frac{(x^{n + 1})^{2} \\cdot x^{3n}}{x^{n - 2}} = x^{2(n + 1) + 3n - (n - 2)} = x^{2n + 2 + 3n - n + 2} = x^{4n + 4}$$\n\n代入数值可以发现错误：$n = 2$ 时原式为 $\\frac{(x^{3})^{2} \\cdot x^{6}}{x^{0}} = x^{12}$，而 $4(2) + 4 = 12$。\n\n> **注意。** 乘方也要乘常数项：$2(n + 1) = 2n + 2$，而不是 $2n + 1$。减去 $n - 2$ 时两项都变号，$-2$ 变成 $+2$；分母的指数要减去，不能加上。",
      ),
      generate(rng) {
        const { base, v } = powerBase(rng);
        const c = rng.int(2, 4);
        let e1: { a: number; b: number; latex: string };
        let e2: { a: number; b: number; latex: string };
        let e3: { a: number; b: number; latex: string };
        do {
          e1 = algebraicExponent(rng, v);
          e2 = algebraicExponent(rng, v);
          e3 = algebraicExponent(rng, v);
        } while (c * e1.a + e2.a - e3.a === 0 || e1.b === 0 || e3.b === 0);
        const A = c * e1.a + e2.a - e3.a;
        const answer = linear(A, c * e1.b + e2.b - e3.b, v);
        return exponentProblem(
          `\\frac{(${base}^{${e1.latex}})^{${c}} \\cdot ${base}^{${e2.latex}}}{${base}^{${e3.latex}}}`,
          base,
          v,
          answer,
          `${base}^{${c}(${e1.latex}) + (${e2.latex}) - (${e3.latex})}`,
          [
            linear(A, e1.b + e2.b - e3.b, v),
            linear(A, c * e1.b + e2.b + e3.b, v),
            linear(c * e1.a + e2.a + e3.a, c * e1.b + e2.b + e3.b, v),
          ],
          t(
            `All the powers have the base $${base}$, so the rules become arithmetic on the exponents. **Step 1:** the power multiplies the exponent by $${c}$. **Step 2:** the product adds the exponent of the second factor. **Step 3:** the quotient subtracts the whole exponent of the denominator, so keep it in parentheses and change every sign inside when you remove them:`,
            `所有幂的底数都是 $${base}$，所以法则变成对指数的运算。**第一步：** 乘方把指数乘以 $${c}$。**第二步：** 乘法加上第二个因式的指数。**第三步：** 除法减去分母的整个指数，所以先给它加上括号，去括号时括号里每一项都要变号：`,
          ),
          {
            numeric: `\\frac{(${pw(base, val2(e1.a, e1.b))})^{${c}} \\cdot ${pw(base, val2(e2.a, e2.b))}}{${pw(base, val2(e3.a, e3.b))}} = ${pw(base, val2(A, c * e1.b + e2.b - e3.b))}`,
            answerAt: at2(A, c * e1.b + e2.b - e3.b),
            value: val2(A, c * e1.b + e2.b - e3.b),
          },
        );
      },
    },
  ],
};

// Unit: exponential expressions and equations.

/** maxExp is the largest exponent of each base whose power is shown as a number. */
const maxExp: Record<number, number> = { 2: 10, 3: 6, 4: 5, 5: 4, 6: 3, 7: 3, 9: 3, 10: 6 };

/** powerValue writes b^k as a number: "32", "1", "\frac{1}{8}". */
function powerValue(b: number, k: number): string {
  return k >= 0 ? grouped(b ** k) : `\\frac{1}{${grouped(b ** -k)}}`;
}

/** families are bases that are powers of a common base b: b^1, b^2, …, b^top. */
const families: readonly { readonly b: number; readonly top: number }[] = [
  { b: 2, top: 5 },
  { b: 2, top: 5 },
  { b: 3, top: 4 },
  { b: 5, top: 3 },
];

/** linearSteps writes the steps that solve p·e1 = q·e2 for x, given the exponents as [a, c] meaning a·x + c. */
function linearSteps(left: readonly [number, number], right: readonly [number, number]): string[] {
  const [a1, c1] = left;
  const [a2, c2] = right;
  const a = a1 - a2;
  const c = c2 - c1;
  const x = Q.of(c, a);
  const first = `${linear(a1, c1)} = ${linear(a2, c2)}`;
  const middle = `${linear(a, 0)} = ${c}`;
  return [first, ...(a === 1 || middle === first ? [] : [middle]), `x = ${x.toLatex()}`];
}

/** expAt writes the exponent a·x + c worked out at a value of x, for a check: "2(3) - 1 = 5". */
function expAt(a: number, c: number, x: Q): string {
  const s = x.toLatex();
  const product = x.isInteger()
    ? a === 1
      ? paren(x)
      : `${a === -1 ? "-" : a}(${s})`
    : a === 1
      ? paren(x)
      : `${a === -1 ? "-" : `${a} \\cdot `}${paren(x)}`;
  const constant = c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`;
  return `${product}${constant} = ${valueAt(a, c, x).toLatex()}`;
}

/** valueAt is the exponent a·x + c at a value of x. */
const valueAt = (a: number, c: number, x: Q) => x.mul(Q.of(a)).add(Q.of(c));

/** rewriteEquation draws (b^p)^(a1·x + c1) = (b^q)^(a2·x + c2) whose solution is an integer (whole) or not. */
function rewriteEquation(rng: Rng, whole: boolean) {
  for (;;) {
    const { b, top } = rng.pick(families);
    const [p, q] = rng.sample(
      Array.from({ length: top }, (_, i) => i + 1),
      2,
    ) as [number, number];
    const [a1, a2] = [rng.int(1, 3), rng.int(1, 3)];
    const [c1, c2] = [rng.int(-5, 5), rng.int(-5, 5)];
    const den = p * a1 - q * a2;
    if (den === 0) continue;
    const x = Q.of(q * c2 - p * c1, den);
    if (x.isInteger() !== whole || (!whole && x.d > 12n) || x.abs().cmp(Q.of(12)) > 0) continue;
    return { b, p, q, a1, a2, c1, c2, x };
  }
}

export const solvingExponentialEquations: TopicDef = {
  id: "solving-exponential-equations",
  title: t("Solving Exponential Equations", "解指数方程"),
  summary: t(
    "Solve equations such as $4^{x + 1} = 8^{x}$ by writing both sides as powers of the same base.",
    "把两边写成同底数的幂，解 $4^{x + 1} = 8^{x}$ 这样的方程。",
  ),
  prerequisites: ["power-rule-with-algebraic-expressions", "equations-with-parentheses"],
  encompasses: [
    { topic: "equations-with-variables-on-both-sides", weight: 0.4 },
    { topic: "power-rule-with-algebraic-expressions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSA.REI.B.3"],
  intro: t(
    `So far the exponents were known and we simplified powers. Now the exponent is the unknown: for which $x$ is $2^{x} = 32$? Such an **exponential equation** answers questions like "after how many doublings do we reach $32$?"

Powers of $2$ grow with every step, $2^{1} = 2$, $2^{2} = 4$, $2^{3} = 8$, $2^{4} = 16$, $2^{5} = 32$, so each value comes from exactly one exponent. That is the whole idea:

$$2^{x} = 32 \\implies 2^{x} = 2^{5} \\implies x = 5.$$

Write both sides as powers of the same base, set the exponents equal, and solve the linear equation that is left. The same holds for any base other than $0$, $1$ and $-1$. When the bases differ, as in $4^{x} = 8^{2}$, the power rule rewrites them over one base first: $4 = 2^{2}$ and $8 = 2^{3}$.

In this lesson we solve exponential equations with whole-number solutions.`,
    `之前指数是已知的，我们化简幂。现在未知数在指数上：$x$ 为多少时 $2^{x} = 32$？这样的**指数方程**回答"翻多少次倍才到 $32$"这类问题。

$2$ 的幂每一步都变大，$2^{1} = 2$，$2^{2} = 4$，$2^{3} = 8$，$2^{4} = 16$，$2^{5} = 32$，所以每个值只对应一个指数。这就是全部的思路：

$$2^{x} = 32 \\implies 2^{x} = 2^{5} \\implies x = 5.$$

把两边写成同底数的幂，令指数相等，再解剩下的一元一次方程。底数不为 $0$、$1$、$-1$ 时都成立。底数不同时，例如 $4^{x} = 8^{2}$，先用幂的乘方法则把它们改写成同一个底数：$4 = 2^{2}$，$8 = 2^{3}$。

这节课解整数解的指数方程。`,
  ),
  knowledgePoints: [
    {
      id: "equating-exponents",
      title: t("Equating exponents", "令指数相等"),
      explanation: t(
        "In an **exponential equation** the unknown is in an exponent. If two powers of the same base (other than $0$, $1$ and $-1$) are equal, their exponents are equal:\n\n$$b^{m} = b^{n} \\implies m = n$$\n\nTo solve $3^{2x - 1} = 243$, write $243$ as a power of $3$, then solve the equation of the exponents:\n\n$$3^{2x - 1} = 3^{5} \\implies 2x - 1 = 5 \\implies x = 3$$\n\nFractions are negative powers: $\\frac{1}{8} = 2^{-3}$, and $1 = b^{0}$.\n\n> **Watch out.** The $5$ is the value of the whole exponent $2x - 1$, not of $x$: solve $2x - 1 = 5$ to the end. Undo the $-1$ by adding $1$, not subtracting it, and then divide by the coefficient $2$.",
        "未知数在指数中的方程叫做**指数方程**。同底数（不为 $0$、$1$、$-1$）的两个幂相等时，它们的指数相等：\n\n$$b^{m} = b^{n} \\implies m = n$$\n\n解 $3^{2x - 1} = 243$ 时，先把 $243$ 写成 $3$ 的幂，再解关于指数的方程：\n\n$$3^{2x - 1} = 3^{5} \\implies 2x - 1 = 5 \\implies x = 3$$\n\n分数是负指数幂：$\\frac{1}{8} = 2^{-3}$，而 $1 = b^{0}$。\n\n> **注意。** $5$ 是整个指数 $2x - 1$ 的值，不是 $x$ 的值：要把 $2x - 1 = 5$ 解到底。消去 $-1$ 要加 $1$，不是减 $1$，然后再除以系数 $2$。",
      ),
      generate(rng) {
        const b = rng.pick([2, 2, 3, 3, 5, 6, 7, 10]);
        let a: number;
        let x: number;
        let k: number;
        let c: number;
        do {
          a = rng.pick([1, 1, 2, 3]);
          x = rng.int(-4, 6);
          k = rng.int(-3, maxExp[b]!);
          c = k - a * x;
        } while (Math.abs(c) > 9 || (a === 1 && c === 0));
        const e = linear(a, c);
        const v = powerValue(b, k);
        return numberProblem({
          prompt: t(`Solve $${b}^{${e}} = ${v}$.`, `解方程 $${b}^{${e}} = ${v}$。`),
          answer: x,
          solveFor: "x",
          mistakes: [
            why(
              k,
              "That is the value of the whole exponent. Set the exponent equal to it and solve for $x$.",
              "这是整个指数的值。令指数等于它，再解出 $x$。",
            ),
            why(
              Q.of(k + c, a),
              "Check the sign: undo the constant in the exponent by doing the opposite operation.",
              "注意符号：用相反的运算消去指数中的常数。",
            ),
            why(k - c, "You have not divided by the coefficient of $x$ yet.", "你还没有除以 $x$ 的系数。"),
          ],
          solution: t(
            `**Step 1:** write $${v}$ as a power of $${b}$: $${v} = ${b}^{${k}}$. **Step 2:** powers of the same base are equal only when their exponents are, so set the exponents equal and solve:${steps(`${b}^{${e}} = ${b}^{${k}}`, ...linearSteps([a, c], [0, k]))}**Check.** At $x = ${x}$ the exponent is $${expAt(a, c, Q.of(x))}$, and $${b}^{${k}} = ${v}$.`,
            `**第一步：** 把 $${v}$ 写成 $${b}$ 的幂：$${v} = ${b}^{${k}}$。**第二步：** 同底数的幂只有在指数相等时才相等，所以令指数相等并求解：${steps(`${b}^{${e}} = ${b}^{${k}}`, ...linearSteps([a, c], [0, k]))}**检验。** $x = ${x}$ 时指数为 $${expAt(a, c, Q.of(x))}$，而 $${b}^{${k}} = ${v}$。`,
          ),
        });
      },
    },
    {
      id: "same-base-on-both-sides",
      title: t("The same base on both sides", "两边底数相同"),
      explanation: t(
        "When both sides are already powers of the same base, the powers are equal exactly when the exponents are. Set the exponents equal and solve the linear equation, collecting $x$ on one side and the numbers on the other:\n\n$$5^{3x - 4} = 5^{x + 2} \\implies 3x - 4 = x + 2 \\implies 2x = 6 \\implies x = 3$$\n\nAt $x = 3$ both exponents are $5$, so both sides are $5^{5}$.\n\n> **Watch out.** Moving a term across the equals sign changes its sign: subtract $x$ from both sides and add $4$ to both sides. Adding the $x$-terms, or subtracting $4$, gives a wrong value, and so does dropping the minus sign of the answer.",
        "两边已经是同底数的幂时，幂相等当且仅当指数相等。令指数相等，再解一元一次方程，把含 $x$ 的项移到一边，数移到另一边：\n\n$$5^{3x - 4} = 5^{x + 2} \\implies 3x - 4 = x + 2 \\implies 2x = 6 \\implies x = 3$$\n\n$x = 3$ 时两个指数都是 $5$，两边都等于 $5^{5}$。\n\n> **注意。** 项移过等号要变号：两边同时减去 $x$，同时加上 $4$。把含 $x$ 的项相加，或减去 $4$，都会得到错误的值；丢掉答案的负号也一样。",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 4, 5, 6, 7, 9, 10]);
        let a1: number;
        let a2: number;
        let x: number;
        let c1: number;
        let c2: number;
        do {
          [a1, a2, x, c1] = [rng.int(1, 5), rng.int(1, 5), rng.int(-6, 6), rng.int(-9, 9)];
          c2 = (a1 - a2) * x + c1;
        } while (a1 === a2 || Math.abs(c2) > 12);
        const e1 = linear(a1, c1);
        const e2 = linear(a2, c2);
        return numberProblem({
          prompt: t(`Solve $${b}^{${e1}} = ${b}^{${e2}}$.`, `解方程 $${b}^{${e1}} = ${b}^{${e2}}$。`),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(c2 + c1, a1 - a2), ...(a1 + a2 !== 0 ? [Q.of(c2 - c1, a1 + a2)] : []), -x],
          solution: t(
            `The bases are both $${b}$, so the two powers are equal exactly when the exponents are. Set them equal, then collect $x$ on the left and the numbers on the right:${steps(...linearSteps([a1, c1], [a2, c2]))}**Check.** At $x = ${x}$ the left exponent is $${expAt(a1, c1, Q.of(x))}$ and the right one is $${expAt(a2, c2, Q.of(x))}$, so both sides are $${b}^{${a1 * x + c1}}$.`,
            `两边的底数都是 $${b}$，所以两个幂相等当且仅当指数相等。令指数相等，再把含 $x$ 的项移到左边、数移到右边：${steps(...linearSteps([a1, c1], [a2, c2]))}**检验。** $x = ${x}$ 时左边的指数为 $${expAt(a1, c1, Q.of(x))}$，右边的指数为 $${expAt(a2, c2, Q.of(x))}$，两边都等于 $${b}^{${a1 * x + c1}}$。`,
          ),
        });
      },
    },
    {
      id: "rewriting-bases",
      title: t("Rewriting the bases", "改写底数"),
      explanation: t(
        "When the bases differ, write both as powers of one base. Then the power rule multiplies out the exponents:\n\n$$4^{x + 1} = 8^{x} \\implies (2^{2})^{x + 1} = (2^{3})^{x} \\implies 2^{2x + 2} = 2^{3x} \\implies 2x + 2 = 3x \\implies x = 2$$\n\nMultiply the **whole** exponent: $(2^{2})^{x + 1}$ is $2^{2x + 2}$, not $2^{2x + 1}$. Check at $x = 2$: $4^{3} = 64$ and $8^{2} = 64$.\n\n> **Watch out.** Setting $x + 1 = x$ straight away compares exponents of different bases, which says nothing. Rewrite both bases first, and multiply every term of the exponent by the power of the base, the constant included.",
        "底数不同时，把两边都写成同一个底数的幂，再用幂的乘方法则展开指数：\n\n$$4^{x + 1} = 8^{x} \\implies (2^{2})^{x + 1} = (2^{3})^{x} \\implies 2^{2x + 2} = 2^{3x} \\implies 2x + 2 = 3x \\implies x = 2$$\n\n要乘以**整个**指数：$(2^{2})^{x + 1}$ 是 $2^{2x + 2}$，而不是 $2^{2x + 1}$。在 $x = 2$ 处检验：$4^{3} = 64$，$8^{2} = 64$。\n\n> **注意。** 直接令 $x + 1 = x$ 是在比较不同底数的指数，毫无意义。先把两个底数都改写，再用底数的幂乘以指数的每一项，常数项也不例外。",
      ),
      generate(rng) {
        if (rng.bool(0.4)) {
          for (;;) {
            const { b, top } = rng.pick(families);
            const p = rng.int(2, top);
            const a = rng.int(1, 2);
            const x = rng.int(-3, 4);
            const c = rng.int(-3, 3);
            const k = p * (a * x + c);
            if (k === 0 || k < -4 || k > maxExp[b]! || (a === 1 && c === 0)) continue;
            const B = b ** p;
            const e = linear(a, c);
            const v = powerValue(b, k);
            return numberProblem({
              prompt: t(`Solve $${B}^{${e}} = ${v}$.`, `解方程 $${B}^{${e}} = ${v}$。`),
              answer: x,
              solveFor: "x",
              wrong: [Q.of(k - c, a), Q.of(k, p), Q.of(k - p * c, a)],
              solution: t(
                `**Step 1:** write both sides as powers of $${b}$: $${B} = ${b}^{${p}}$ and $${v} = ${b}^{${k}}$. **Step 2:** the power rule multiplies the whole exponent by $${p}$. **Step 3:** set the exponents equal and solve:${steps(`(${b}^{${p}})^{${e}} = ${b}^{${k}}`, `${b}^{${linear(p * a, p * c)}} = ${b}^{${k}}`, ...linearSteps([p * a, p * c], [0, k]))}**Check.** At $x = ${x}$ the exponent is $${expAt(a, c, Q.of(x))}$, and $${B}^{${a * x + c}} = ${b}^{${k}} = ${v}$.`,
                `**第一步：** 把两边都写成 $${b}$ 的幂：$${B} = ${b}^{${p}}$，$${v} = ${b}^{${k}}$。**第二步：** 幂的乘方法则把整个指数乘以 $${p}$。**第三步：** 令指数相等并求解：${steps(`(${b}^{${p}})^{${e}} = ${b}^{${k}}`, `${b}^{${linear(p * a, p * c)}} = ${b}^{${k}}`, ...linearSteps([p * a, p * c], [0, k]))}**检验。** $x = ${x}$ 时指数为 $${expAt(a, c, Q.of(x))}$，而 $${B}^{${a * x + c}} = ${b}^{${k}} = ${v}$。`,
              ),
            });
          }
        }
        const { b, p, q, a1, a2, c1, c2, x } = rewriteEquation(rng, true);
        const [e1, e2] = [linear(a1, c1), linear(a2, c2)];
        const [B1, B2] = [b ** p, b ** q];
        return numberProblem({
          prompt: t(`Solve $${B1}^{${e1}} = ${B2}^{${e2}}$.`, `解方程 $${B1}^{${e1}} = ${B2}^{${e2}}$。`),
          answer: x,
          solveFor: "x",
          wrong: [...(a1 !== a2 ? [Q.of(c2 - c1, a1 - a2)] : []), ...(p * a1 !== q * a2 ? [Q.of(c2 - c1, p * a1 - q * a2)] : []), x.neg()],
          solution: rewriteSolution({ b, p, q, a1, a2, c1, c2, x }),
        });
      },
    },
  ],
};

/** rewriteSolution solves (b^p)^(a1·x + c1) = (b^q)^(a2·x + c2) step by step and checks the solution. */
function rewriteSolution({ b, p, q, a1, a2, c1, c2, x }: ReturnType<typeof rewriteEquation>): Text {
  const [e1, e2] = [linear(a1, c1), linear(a2, c2)];
  const lhs = p === 1 ? `${b}^{${e1}}` : `(${b}^{${p}})^{${e1}}`;
  const rhs = q === 1 ? `${b}^{${e2}}` : `(${b}^{${q}})^{${e2}}`;
  const rewrite = [p, q]
    .map((k) => (k === 1 ? "" : `$${b ** k} = ${b}^{${k}}$`))
    .filter(Boolean)
    .join(" and ");
  const rewriteZh = rewrite.replace(" and ", "，");
  const chain = steps(
    `${lhs} = ${rhs}`,
    `${b}^{${linear(p * a1, p * c1)}} = ${b}^{${linear(q * a2, q * c2)}}`,
    ...linearSteps([p * a1, p * c1], [q * a2, q * c2]),
  );
  const side = (k: number, v: Q) => (k === 1 ? `${b}^{${v.toLatex()}}` : `${b ** k}^{${v.toLatex()}} = ${b}^{${v.mul(Q.of(k)).toLatex()}}`);
  const [left, right] = [side(p, valueAt(a1, c1, x)), side(q, valueAt(a2, c2, x))];
  return t(
    `**Step 1:** write both bases as powers of $${b}$: ${rewrite}. **Step 2:** the power rule multiplies each whole exponent by the power of $${b}$. **Step 3:** with one base on both sides, set the exponents equal and solve:${chain}**Check.** At $x = ${x.toLatex()}$ the exponents are $${expAt(a1, c1, x)}$ and $${expAt(a2, c2, x)}$. The left side is $${left}$ and the right side is $${right}$, the same power.`,
    `**第一步：** 把两个底数都写成 $${b}$ 的幂：${rewriteZh}。**第二步：** 幂的乘方法则把每个整个指数乘以 $${b}$ 的幂次。**第三步：** 两边底数相同后，令指数相等并求解：${chain}**检验。** $x = ${x.toLatex()}$ 时两个指数分别为 $${expAt(a1, c1, x)}$ 和 $${expAt(a2, c2, x)}$。左边是 $${left}$，右边是 $${right}$，是同一个幂。`,
  );
}

export const solvingExponentialEquationsWithFractionalSolutions: TopicDef = {
  id: "solving-exponential-equations-with-fractional-solutions",
  title: t("Solving Exponential Equations With Fractional Solutions", "解有分数解的指数方程"),
  summary: t(
    "Solve exponential equations whose solutions are fractions, such as $4^{x} = 8$ and $9^{x} = \\frac{1}{\\sqrt{3}}$.",
    "解分数解的指数方程，例如 $4^{x} = 8$ 和 $9^{x} = \\frac{1}{\\sqrt{3}}$。",
  ),
  prerequisites: ["solving-exponential-equations"],
  encompasses: [
    { topic: "solving-exponential-equations", weight: 0.6 },
    { topic: "writing-radicals-using-fractional-exponents", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSN.RN.A.2"],
  intro: t(
    `We solved exponential equations by writing both sides over one base and setting the exponents equal. Nothing in that method needs the solution to be a whole number. Which power of $9$ is $27$? No whole number works, since $9^{1} = 9$ and $9^{2} = 81$, but fractional exponents fill the gap.

Write both as powers of $3$: $9 = 3^{2}$ and $27 = 3^{3}$. Then

$$9^{x} = 27 \\implies 3^{2x} = 3^{3} \\implies 2x = 3 \\implies x = \\frac{3}{2}.$$

And indeed $9^{\\frac{3}{2}} = (\\sqrt{9})^{3} = 3^{3} = 27$. Roots fit the same way, because a root is a fractional power: $\\sqrt{2} = 2^{\\frac{1}{2}}$ and $\\frac{1}{\\sqrt[3]{3}} = 3^{-\\frac{1}{3}}$.

In this lesson we solve exponential equations whose solutions are fractions, and leave each answer in lowest terms.`,
    `我们解指数方程的方法是：把两边写成同一底数的幂，再令指数相等。这个方法并不要求解是整数。$9$ 的几次幂等于 $27$？没有整数满足，因为 $9^{1} = 9$，$9^{2} = 81$，但分数指数正好补上了空隙。

把它们都写成 $3$ 的幂：$9 = 3^{2}$，$27 = 3^{3}$。于是

$$9^{x} = 27 \\implies 3^{2x} = 3^{3} \\implies 2x = 3 \\implies x = \\frac{3}{2}.$$

确实 $9^{\\frac{3}{2}} = (\\sqrt{9})^{3} = 3^{3} = 27$。根式也一样处理，因为根式就是分数指数幂：$\\sqrt{2} = 2^{\\frac{1}{2}}$，$\\frac{1}{\\sqrt[3]{3}} = 3^{-\\frac{1}{3}}$。

这节课解分数解的指数方程，答案写成最简分数。`,
  ),
  knowledgePoints: [
    {
      id: "fractional-solutions",
      title: t("Fractional solutions", "分数解"),
      explanation: t(
        "The method is the same as before, but the solution may be a fraction. For $4^{x} = 8$, write both sides as powers of $2$:\n\n$$(2^{2})^{x} = 2^{3} \\implies 2x = 3 \\implies x = \\frac{3}{2}$$\n\nCheck: $4^{\\frac{3}{2}} = (\\sqrt{4})^{3} = 8$. Leave the answer as a fraction in lowest terms.\n\n> **Watch out.** Divide the exponent of the right side by the coefficient of $x$, not the other way round: $x = \\frac{3}{2}$, not $\\frac{2}{3}$. A fraction on the right, such as $\\frac{1}{8} = 2^{-3}$, makes the solution negative; and $3$ is the exponent of $2$, not the solution.",
        "方法与之前相同，只是解可能是分数。解 $4^{x} = 8$ 时，把两边都写成 $2$ 的幂：\n\n$$(2^{2})^{x} = 2^{3} \\implies 2x = 3 \\implies x = \\frac{3}{2}$$\n\n检验：$4^{\\frac{3}{2}} = (\\sqrt{4})^{3} = 8$。答案写成最简分数。\n\n> **注意。** 用右边的指数除以 $x$ 的系数，不要反过来：$x = \\frac{3}{2}$，而不是 $\\frac{2}{3}$。右边是分数时，例如 $\\frac{1}{8} = 2^{-3}$，解是负数；$3$ 是 $2$ 的指数，不是方程的解。",
      ),
      generate(rng) {
        let fam: { b: number; top: number };
        let p: number;
        let q: number;
        do {
          fam = rng.pick(families);
          p = rng.int(2, fam.top);
          q = rng.nonZero(-4, maxExp[fam.b]!);
        } while (q % p === 0);
        const { b } = fam;
        const B = b ** p;
        const v = powerValue(b, q);
        const x = Q.of(q, p);
        return numberProblem({
          prompt: t(`Solve $${B}^{x} = ${v}$.`, `解方程 $${B}^{x} = ${v}$。`),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(p, q), x.neg(), q],
          solution: t(
            `**Step 1:** write both sides as powers of $${b}$: $${B} = ${b}^{${p}}$ and $${v} = ${b}^{${q}}$. **Step 2:** the power rule gives $${b}^{${p}x}$ on the left; set the exponents equal and divide by $${p}$:${steps(`(${b}^{${p}})^{x} = ${b}^{${q}}`, `${p}x = ${q}`, `x = ${x.toLatex()}`)}**Check.** $${B}^{${x.toLatex()}} = (${b}^{${p}})^{${x.toLatex()}} = ${b}^{${q}} = ${v}$, since $${p} \\cdot ${paren(x)} = ${q}$.`,
            `**第一步：** 把两边都写成 $${b}$ 的幂：$${B} = ${b}^{${p}}$，$${v} = ${b}^{${q}}$。**第二步：** 由幂的乘方法则，左边是 $${b}^{${p}x}$；令指数相等，再除以 $${p}$：${steps(`(${b}^{${p}})^{x} = ${b}^{${q}}`, `${p}x = ${q}`, `x = ${x.toLatex()}`)}**检验。** $${B}^{${x.toLatex()}} = (${b}^{${p}})^{${x.toLatex()}} = ${b}^{${q}} = ${v}$，因为 $${p} \\cdot ${paren(x)} = ${q}$。`,
          ),
        });
      },
    },
    {
      id: "fractional-solutions-with-linear-exponents",
      title: t("Linear exponents", "一次式指数"),
      explanation: t(
        "When both sides can be written as powers of the same base, the exponents must be equal. Rewrite each base as a power of a common base, then set the exponents equal.\n\nWith expressions in the exponents, rewrite the bases, multiply out the exponents, and solve:\n\n$$9^{x + 1} = 27^{x} \\implies 3^{2x + 2} = 3^{3x} \\implies 2x + 2 = 3x \\implies x = 2$$\n\n$$8^{2x} = 4^{x + 1} \\implies 2^{6x} = 2^{2x + 2} \\implies 4x = 2 \\implies x = \\frac{1}{2}$$\n\nCheck the second: at $x = \\frac{1}{2}$, $8^{1} = 8$ and $4^{\\frac{3}{2}} = 8$.\n\n> **Watch out.** Compare exponents only after both sides have the same base: from $8^{2x} = 4^{x + 1}$, setting $2x = x + 1$ is wrong. When moving terms, change their signs; a slip in the sign of a constant changes the numerator of the answer.",
        "如果两边都能写成同一底数的幂，那么指数必须相等。把每个底数改写成公共底数的幂，再令指数相等。\n\n指数中含代数式时，改写底数、展开指数，再求解：\n\n$$9^{x + 1} = 27^{x} \\implies 3^{2x + 2} = 3^{3x} \\implies 2x + 2 = 3x \\implies x = 2$$\n\n$$8^{2x} = 4^{x + 1} \\implies 2^{6x} = 2^{2x + 2} \\implies 4x = 2 \\implies x = \\frac{1}{2}$$\n\n检验第二个：$x = \\frac{1}{2}$ 时，$8^{1} = 8$，$4^{\\frac{3}{2}} = 8$。\n\n> **注意。** 只有两边底数相同后才能比较指数：由 $8^{2x} = 4^{x + 1}$ 直接令 $2x = x + 1$ 是错的。移项时要变号；常数项的符号一错，答案的分子就错了。",
      ),
      generate(rng) {
        const { b, p, q, a1, a2, c1, c2, x } = rewriteEquation(rng, false);
        const [e1, e2] = [linear(a1, c1), linear(a2, c2)];
        const [B1, B2] = [b ** p, b ** q];
        return numberProblem({
          prompt: t(`Solve $${B1}^{${e1}} = ${B2}^{${e2}}$.`, `解方程 $${B1}^{${e1}} = ${B2}^{${e2}}$。`),
          answer: x,
          solveFor: "x",
          wrong: [...(a1 !== a2 ? [Q.of(c2 - c1, a1 - a2)] : []), Q.of(q * c2 + p * c1, p * a1 - q * a2), x.neg()],
          solution: rewriteSolution({ b, p, q, a1, a2, c1, c2, x }),
        });
      },
    },
    {
      id: "equations-with-roots",
      title: t("Equations with roots", "含根式的方程"),
      explanation: t(
        "A root is a fractional power, so it can be written as a power of the base too: $\\sqrt[3]{4} = (2^{2})^{\\frac{1}{3}} = 2^{\\frac{2}{3}}$ and $\\frac{1}{\\sqrt{3}} = 3^{-\\frac{1}{2}}$. Then\n\n$$8^{x} = \\sqrt[3]{4} \\implies 2^{3x} = 2^{\\frac{2}{3}} \\implies 3x = \\frac{2}{3} \\implies x = \\frac{2}{9}$$\n\n> **Watch out.** In $\\sqrt[n]{b^{m}} = b^{\\frac{m}{n}}$ the index of the root goes in the denominator, not the numerator. Then divide by the power of the left base too: $3x = \\frac{2}{3}$ gives $\\frac{2}{9}$, not $\\frac{2}{3}$ or $2$. A root in a denominator makes the exponent negative.",
        "根式就是分数指数幂，所以它也能写成底数的幂：$\\sqrt[3]{4} = (2^{2})^{\\frac{1}{3}} = 2^{\\frac{2}{3}}$，$\\frac{1}{\\sqrt{3}} = 3^{-\\frac{1}{2}}$。于是\n\n$$8^{x} = \\sqrt[3]{4} \\implies 2^{3x} = 2^{\\frac{2}{3}} \\implies 3x = \\frac{2}{3} \\implies x = \\frac{2}{9}$$\n\n> **注意。** 在 $\\sqrt[n]{b^{m}} = b^{\\frac{m}{n}}$ 中，根指数放在分母上，不在分子上。然后还要除以左边底数的幂次：由 $3x = \\frac{2}{3}$ 得 $\\frac{2}{9}$，而不是 $\\frac{2}{3}$ 或 $2$。根式在分母上时，指数是负的。",
      ),
      keyPrerequisites: ["writing-radicals-using-fractional-exponents"],
      generate(rng) {
        let fam: { b: number; top: number };
        let n: number;
        let m: number;
        do {
          fam = rng.pick(families);
          n = rng.int(2, 4);
          m = rng.int(1, n + 2);
        } while (gcd(m, n) !== 1 || fam.b ** m > 1000);
        const { b } = fam;
        const p = rng.int(1, fam.top);
        const reciprocal = rng.bool(0.35);
        const s = reciprocal ? -1 : 1;
        const r = root(n, String(b ** m));
        const v = reciprocal ? `\\frac{1}{${r}}` : r;
        const B = b ** p;
        const x = Q.of(s * m, n * p);
        const e = fracExp(s * m, n);
        return numberProblem({
          prompt: t(`Solve $${B}^{x} = ${v}$.`, `解方程 $${B}^{x} = ${v}$。`),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(s * n, m * p), Q.of(s * m, n), x.neg(), Q.of(s * m * p, n)],
          solution: t(
            `**Step 1:** a root is a fractional power, so write both sides as powers of $${b}$: $${v} = ${b}^{${e}}$${p === 1 ? "" : ` and $${B} = ${b}^{${p}}$`}. **Step 2:** set the exponents equal${p === 1 ? "" : ` and divide by $${p}$`}:${steps(`${p === 1 ? b : `(${b}^{${p}})`}^{x} = ${b}^{${e}}`, `${p === 1 ? "" : p}x = ${e}`, ...(p === 1 ? [] : [`x = ${x.toLatex()}`]))}**Check.** $${B}^{${x.toLatex()}} = ${b}^{${p === 1 ? x.toLatex() : `${p} \\cdot ${paren(x)}`}} = ${b}^{${e}} = ${v}$.`,
            `**第一步：** 根式就是分数指数幂，所以把两边都写成 $${b}$ 的幂：$${v} = ${b}^{${e}}$${p === 1 ? "" : `，$${B} = ${b}^{${p}}$`}。**第二步：** 令指数相等${p === 1 ? "" : `，再除以 $${p}$`}：${steps(`${p === 1 ? b : `(${b}^{${p}})`}^{x} = ${b}^{${e}}`, `${p === 1 ? "" : p}x = ${e}`, ...(p === 1 ? [] : [`x = ${x.toLatex()}`]))}**检验。** $${B}^{${x.toLatex()}} = ${b}^{${p === 1 ? x.toLatex() : `${p} \\cdot ${paren(x)}`}} = ${b}^{${e}} = ${v}$。`,
          ),
        });
      },
    },
  ],
};

/** Change is a quantity that changes by a fixed percent each period. */
interface Change {
  /** name is the letter of the function that models it. */
  readonly name: string;
  /** setup states the starting amount p and the percent r, both in LaTeX. */
  readonly setup: (p: string, r: string) => Text;
  readonly noun: Text;
  /** per is the period, as in "each year" and "每年". */
  readonly per: Text;
  /** span is the period after a count, as in "3 years" and "3 年". */
  readonly span: Text;
}

const year = { per: t("year", "年"), span: t("years", "年") };
const month = { per: t("month", "月"), span: t("months", "个月") };
const hour = { per: t("hour", "小时"), span: t("hours", "小时") };

const growths: readonly Change[] = [
  {
    name: "P",
    setup: (p, r) => t(`A town has a population of $${p}$, which grows by $${r}\\%$ each year.`, `某镇人口为 $${p}$，每年增长 $${r}\\%$。`),
    noun: t("the population", "人口"),
    ...year,
  },
  {
    name: "A",
    setup: (p, r) =>
      t(
        `An account holds $${p}$ dollars and earns $${r}\\%$ interest each year, compounded yearly.`,
        `某账户存有 $${p}$ 元，年利率为 $${r}\\%$，每年复利一次。`,
      ),
    noun: t("the balance of the account", "账户余额"),
    ...year,
  },
  {
    name: "F",
    setup: (p, r) =>
      t(
        `A channel has $${p}$ followers, and the number grows by $${r}\\%$ each month.`,
        `某频道有 $${p}$ 名关注者，人数每月增长 $${r}\\%$。`,
      ),
    noun: t("the number of followers", "关注者人数"),
    ...month,
  },
  {
    name: "V",
    setup: (p, r) =>
      t(`A house is worth $${p}$ dollars, and its value rises by $${r}\\%$ each year.`, `一套房子价值 $${p}$ 元，价值每年上涨 $${r}\\%$。`),
    noun: t("the value of the house", "房子的价值"),
    ...year,
  },
];

const decays: readonly Change[] = [
  {
    name: "V",
    setup: (p, r) =>
      t(`A car is worth $${p}$ dollars, and its value drops by $${r}\\%$ each year.`, `一辆汽车价值 $${p}$ 元，价值每年下降 $${r}\\%$。`),
    noun: t("the value of the car", "汽车的价值"),
    ...year,
  },
  {
    name: "A",
    setup: (p, r) =>
      t(
        `A patient's body holds $${p}$ mg of a medicine, and the amount decreases by $${r}\\%$ each hour.`,
        `病人体内有 $${p}$ 毫克药物，药量每小时减少 $${r}\\%$。`,
      ),
    noun: t("the amount of medicine", "药量"),
    ...hour,
  },
  {
    name: "N",
    setup: (p, r) =>
      t(`A lake has $${p}$ fish, and the number falls by $${r}\\%$ each year.`, `某湖中有 $${p}$ 条鱼，鱼的数量每年减少 $${r}\\%$。`),
    noun: t("the number of fish", "鱼的数量"),
    ...year,
  },
  {
    name: "M",
    setup: (p, r) =>
      t(
        `A club has $${p}$ members, and the number falls by $${r}\\%$ each month.`,
        `某俱乐部有 $${p}$ 名会员，会员人数每月减少 $${r}\\%$。`,
      ),
    noun: t("the number of members", "会员人数"),
    ...month,
  },
];

/** Kind is exponential growth or exponential decay. */
type Kind = "growth" | "decay";

const growthRates = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 50];
const decayRates = [2, 4, 5, 8, 10, 12, 15, 20, 25, 30, 40, 60];

/** draw picks a context, a percent rate and the factor 1 ± r/100 of the given kind. */
function draw(rng: Rng, kind: Kind) {
  const c = rng.pick(kind === "growth" ? growths : decays);
  const r = rng.pick(kind === "growth" ? growthRates : decayRates);
  const s = kind === "growth" ? 1 : -1;
  return { c, r, s, f: Q.of(100 + s * r, 100) };
}

/** start draws a starting amount below 10,000. */
const start = (rng: Rng) => rng.pick([rng.int(2, 99) * 100, rng.int(12, 95) * 50, rng.int(11, 99) * 10]);

/** factorProblem asks for the growth or decay factor of a percent change. */
function factorProblem(rng: Rng, kind: Kind): Problem {
  const { c, r, s, f } = draw(rng, kind);
  const setup = c.setup(String(start(rng)), String(r));
  const word = kind === "growth" ? t("Growing", "增长") : t("Decreasing", "减少");
  return numberProblem({
    prompt: t(
      `${setup.en} By what number is ${c.noun.en} multiplied each ${c.per.en}? Give it as a decimal.`,
      `${setup["zh-CN"]}${c.noun["zh-CN"]}每${c.per["zh-CN"]}乘以多少？用小数表示。`,
    ),
    answer: f,
    form: "decimal",
    wrong: [Q.of(r, 100), Q.of(r), Q.of(100 - s * r, 100), ...(r < 10 ? [Q.of(10 + s * r, 10)] : [])],
    solution: t(
      `${word.en} by $${r}\\%$ ${s > 0 ? "keeps all of the amount, $100\\%$, and adds" : "takes away"} $${r}\\%$ of it, which leaves $100\\% ${s > 0 ? "+" : "-"} ${r}\\% = ${100 + s * r}\\%$ of the amount. As a decimal, $${100 + s * r}\\% = ${dec(f)}$, so each ${c.per.en} ${c.noun.en} is multiplied by $${dec(f)}$.\n\n**Check.** Start from $100$: one ${c.per.en} later it is $100 \\cdot ${dec(f)} = ${100 + s * r}$, which is $100 ${s > 0 ? "+" : "-"} ${r}$, a change of $${r}\\%$.`,
      `${word["zh-CN"]} $${r}\\%$，${s > 0 ? "就是保留原来的全部（$100\\%$）再加上" : "就是减去"}它的 $${r}\\%$，剩下原来的 $100\\% ${s > 0 ? "+" : "-"} ${r}\\% = ${100 + s * r}\\%$。写成小数，$${100 + s * r}\\% = ${dec(f)}$，所以${c.noun["zh-CN"]}每${c.per["zh-CN"]}乘以 $${dec(f)}$。\n\n**检验。** 从 $100$ 开始：$1$ ${c.span["zh-CN"]}后为 $100 \\cdot ${dec(f)} = ${100 + s * r}$，即 $100 ${s > 0 ? "+" : "-"} ${r}$，变化了 $${r}\\%$。`,
    ),
  });
}

/** percentExpressionProblem asks for the expression a·(1 ± r)^t of a percent change. */
function percentExpressionProblem(rng: Rng, kind: Kind): Problem {
  const { c, r, s, f } = draw(rng, kind);
  const p = start(rng);
  const setup = c.setup(String(p), String(r));
  const answer = expo(p, dec(f), "t");
  return expressionProblem({
    prompt: t(
      `${setup.en} Write an expression for ${c.noun.en} after $t$ ${c.span.en}.`,
      `${setup["zh-CN"]}写出 $t$ ${c.span["zh-CN"]}后${c.noun["zh-CN"]}的表达式。`,
    ),
    answer,
    wrong: [expo(p, dec(Q.of(r, 100)), "t"), expo(p, dec(Q.of(100 - s * r, 100)), "t"), `${dec(f.mul(Q.of(p)))}t`, `(${dec(f)})^{t}`],
    solution: t(
      `**Step 1:** the factor. ${kind === "growth" ? "Growing" : "Decreasing"} by $${r}\\%$ leaves $${100 + s * r}\\%$ of the amount, so each ${c.per.en} multiplies ${c.noun.en} by $1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$.\n\n**Step 2:** the expression. It starts at $${p}$, and after $t$ ${c.span.en} it has been multiplied by $${dec(f)}$ a total of $t$ times:${steps(`${p} \\cdot \\underbrace{${dec(f)} \\cdot ${dec(f)} \\cdots ${dec(f)}}_{t} = ${answer}`)}**Check.** At $t = 1$ the expression gives $${p}(${dec(f)}) = ${dec(f.mul(Q.of(p)))}$, and $${r}\\%$ of $${p}$ is $${dec(Q.of(p * r, 100))}$, so one ${c.per.en} ${s > 0 ? "adds" : "takes away"} exactly that: $${p} ${s > 0 ? "+" : "-"} ${dec(Q.of(p * r, 100))} = ${dec(f.mul(Q.of(p)))}$.`,
      `**第一步：** 因子。${kind === "growth" ? "增长" : "减少"} $${r}\\%$ 后剩下原来的 $${100 + s * r}\\%$，所以${c.noun["zh-CN"]}每${c.per["zh-CN"]}乘以 $1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$。\n\n**第二步：** 表达式。起始量为 $${p}$，$t$ ${c.span["zh-CN"]}后共乘了 $t$ 次 $${dec(f)}$：${steps(`${p} \\cdot \\underbrace{${dec(f)} \\cdot ${dec(f)} \\cdots ${dec(f)}}_{t} = ${answer}`)}**检验。** $t = 1$ 时表达式给出 $${p}(${dec(f)}) = ${dec(f.mul(Q.of(p)))}$，而 $${p}$ 的 $${r}\\%$ 是 $${dec(Q.of(p * r, 100))}$，$1$ ${c.span["zh-CN"]}内正好${s > 0 ? "增加" : "减少"}这么多：$${p} ${s > 0 ? "+" : "-"} ${dec(Q.of(p * r, 100))} = ${dec(f.mul(Q.of(p)))}$。`,
    ),
  });
}

/** Multiplier is a whole-number factor and the words for multiplying by it. */
const multipliers: readonly { readonly k: number; readonly words: Text }[] = [
  { k: 2, words: t("doubles", "翻一番") },
  { k: 2, words: t("doubles", "翻一番") },
  { k: 3, words: t("triples", "变为原来的 $3$ 倍") },
  { k: 4, words: t("quadruples", "变为原来的 $4$ 倍") },
  { k: 5, words: t("becomes $5$ times as large", "变为原来的 $5$ 倍") },
];

/** multiplyContexts describe a quantity multiplied by a whole number each period. */
const multiplyContexts: readonly { readonly setup: (a: number, m: Text) => Text; readonly what: Text }[] = [
  {
    setup: (a, m) =>
      t(
        `A culture starts with $${a}$ bacteria, and the number ${m.en} every hour.`,
        `某培养皿中起初有 $${a}$ 个细菌，细菌数量每小时${m["zh-CN"]}。`,
      ),
    what: t("the number of bacteria after $t$ hours", "$t$ 小时后的细菌数量"),
  },
  {
    setup: (a, m) =>
      t(`So far $${a}$ people have seen a video, and the number ${m.en} every day.`, `目前有 $${a}$ 人看过某视频，人数每天${m["zh-CN"]}。`),
    what: t("the number of people who have seen it after $t$ days", "$t$ 天后看过它的人数"),
  },
  {
    setup: (a, m) =>
      t(
        `A rumor is known to $${a}$ students, and the number ${m.en} every week.`,
        `有 $${a}$ 名学生知道一个传言，知道的人数每周${m["zh-CN"]}。`,
      ),
    what: t("the number of students who know it after $t$ weeks", "$t$ 周后知道它的学生人数"),
  },
];

export const creatingExponentialGrowthExpressions: TopicDef = {
  id: "creating-exponential-growth-expressions",
  title: t("Creating Exponential Growth Expressions", "建立指数增长的表达式"),
  summary: t(
    "Write expressions such as $500(1.04)^{t}$ for quantities that grow by a fixed percent or factor each period.",
    "为每期按固定百分率或倍数增长的量写出 $500(1.04)^{t}$ 这样的表达式。",
  ),
  prerequisites: ["percent-change", "powers-of-rational-numbers"],
  encompasses: [{ topic: "percent-change", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSA.SSE.A.1"],
  intro: t(
    `From percent change we know that increasing an amount by $5\\%$ gives $105\\%$ of it, that is, multiplies it by $1.05$. Many quantities do this again and again: a savings account earning interest, a growing town, a spreading video. Exponents let us write all those repeated multiplications at once.

Say $200$ dollars earn $5\\%$ each year. After one year there are $200(1.05)$ dollars, after two years $200(1.05)(1.05) = 200(1.05)^{2}$, and after $t$ years

$$200(1.05)^{t}.$$

The starting amount is the coefficient, the **growth factor** $1.05$ is the base, and the number of periods is the exponent. Whole-number factors work the same way: something that doubles every hour is multiplied by $2$ each hour.

In this lesson we find growth factors and write such expressions.`,
    `从百分率变化我们知道，把一个量增加 $5\\%$ 得到它的 $105\\%$，也就是乘以 $1.05$。很多量会一次又一次地这样变化：生息的存款、增长的小镇、传播的视频。用指数可以把这些重复的乘法一次写出来。

设 $200$ 元每年获得 $5\\%$ 的利息。一年后有 $200(1.05)$ 元，两年后有 $200(1.05)(1.05) = 200(1.05)^{2}$ 元，$t$ 年后有

$$200(1.05)^{t}$$

元。起始量是系数，**增长因子** $1.05$ 是底数，期数是指数。整数因子也一样：每小时翻一番的量，每小时乘以 $2$。

这节课求增长因子，并写出这样的表达式。`,
  ),
  knowledgePoints: [
    {
      id: "growth-factors",
      title: t("Growth factors", "增长因子"),
      explanation: t(
        "Increasing an amount by $6\\%$ keeps all of it, $100\\%$, and adds $6\\%$ more, so the new amount is $106\\%$ of the old one: the amount is **multiplied by** $1.06$. This number is the **growth factor**:\n\n$$\\text{growth factor} = 1 + r$$\n\nwhere $r$ is the percent written as a decimal. Increasing by $25\\%$ multiplies by $1.25$; doubling multiplies by $2$.\n\n> **Watch out.** The factor is not the rate: $0.06$ alone would shrink the amount to $6\\%$ of itself, and $6$ would multiply it sixfold. Write the percent as a decimal correctly, $6\\% = 0.06$, so the factor is $1.06$, not $1.6$; and growth adds to $1$, it does not subtract.",
        "把一个量增加 $6\\%$，就是保留原来的全部（$100\\%$）再加上 $6\\%$，新量是原量的 $106\\%$：也就是**乘以** $1.06$。这个数叫做**增长因子**：\n\n$$\\text{增长因子} = 1 + r$$\n\n其中 $r$ 是写成小数的百分率。增加 $25\\%$ 就是乘以 $1.25$；翻一番就是乘以 $2$。\n\n> **注意。** 因子不是增长率：只乘以 $0.06$ 会让量缩小到原来的 $6\\%$，乘以 $6$ 则变成原来的六倍。百分数要正确地化成小数，$6\\% = 0.06$，所以因子是 $1.06$，不是 $1.6$；增长是在 $1$ 上加，不是减。",
      ),
      keyPrerequisites: ["percent-change"],
      generate: (rng) => factorProblem(rng, "growth"),
    },
    {
      id: "percent-growth-expressions",
      title: t("Percent growth", "按百分率增长"),
      explanation: t(
        "A quantity that starts at $a$ and is multiplied by the growth factor $1 + r$ every period is $a(1 + r)$ after one period, $a(1 + r)^{2}$ after two, and after $t$ periods\n\n$$a(1 + r)^{t}$$\n\nA town of $2000$ people growing by $3\\%$ a year has $2000(1.03)^{t}$ people after $t$ years. Check at $t = 1$: $2000(1.03) = 2060$, which is $2000$ plus $3\\%$ of $2000$.\n\n> **Watch out.** This is not $2000 \\cdot 1.03t$: the factor is applied again each year, so $t$ is an exponent. The base is the factor $1.03$, not the rate $0.03$, and the starting amount stays outside the power: $(1.03)^{t}$ alone forgets the $2000$.",
        "一个量起初为 $a$，每期乘以增长因子 $1 + r$，一期后为 $a(1 + r)$，两期后为 $a(1 + r)^{2}$，$t$ 期后为\n\n$$a(1 + r)^{t}$$\n\n一个 $2000$ 人的小镇，人口每年增长 $3\\%$，$t$ 年后有 $2000(1.03)^{t}$ 人。在 $t = 1$ 处检验：$2000(1.03) = 2060$，正是 $2000$ 加上 $2000$ 的 $3\\%$。\n\n> **注意。** 这不是 $2000 \\cdot 1.03t$：每年都要再乘一次增长因子，所以 $t$ 是指数。底数是因子 $1.03$，不是增长率 $0.03$；起始量留在幂的外面，只写 $(1.03)^{t}$ 就漏掉了 $2000$。",
      ),
      generate: (rng) => percentExpressionProblem(rng, "growth"),
    },
    {
      id: "doubling-and-tripling",
      title: t("Doubling and tripling", "翻倍增长"),
      explanation: t(
        "Doubling multiplies by $2$, tripling by $3$. A quantity that starts at $a$ and doubles every period is $a \\cdot 2$ after one period, $a \\cdot 2 \\cdot 2$ after two, and after $t$ periods\n\n$$a(2)^{t}$$\n\nFor $40$ bacteria doubling every hour: $40(2)^{t}$.\n\n> **Watch out.** The starting amount is the coefficient, not the base: $2(40)^{t}$ would multiply by $40$ each hour. Do not multiply them together either, $80^{t}$ or $80t$; and the exponent is $t$, not $t - 1$, because at $t = 0$ the amount is the starting $40$.",
        "翻一番就是乘以 $2$，变为原来的 $3$ 倍就是乘以 $3$。一个量起初为 $a$，每期翻一番，一期后为 $a \\cdot 2$，两期后为 $a \\cdot 2 \\cdot 2$，$t$ 期后为\n\n$$a(2)^{t}$$\n\n$40$ 个细菌每小时翻一番：$40(2)^{t}$。\n\n> **注意。** 起始量是系数而不是底数：$2(40)^{t}$ 表示每小时乘以 $40$。也不要把两者相乘写成 $80^{t}$ 或 $80t$；指数是 $t$ 而不是 $t - 1$，因为 $t = 0$ 时数量是起始的 $40$。",
      ),
      generate(rng) {
        const ctx = rng.pick(multiplyContexts);
        const m = rng.pick(multipliers);
        const a = rng.int(2, 60);
        const answer = expo(a, String(m.k), "t");
        const setup = ctx.setup(a, m.words);
        return expressionProblem({
          prompt: t(`${setup.en} Write an expression for ${ctx.what.en}.`, `${setup["zh-CN"]}写出${ctx.what["zh-CN"]}的表达式。`),
          answer,
          wrong: [`${a * m.k}t`, expo(m.k, String(a), "t"), `${a * m.k}^{t}`, expo(a, String(m.k), "t - 1")],
          solution: t(
            `The starting amount $${a}$ is the coefficient. "${m.words.en}" means a factor of $${m.k}$ each period, which is the base, and after $t$ periods it has been multiplied by $${m.k}$ a total of $t$ times:${steps(answer)}**Check.** At $t = 0$ the expression gives $${a}$, the start. At $t = 1$ it gives $${a} \\cdot ${m.k} = ${a * m.k}$, and at $t = 2$ it gives $${a} \\cdot ${m.k}^{2} = ${a * m.k * m.k}$, which is $${a * m.k} \\cdot ${m.k}$, one more multiplication by $${m.k}$.`,
            `起始量 $${a}$ 是系数。“${m.words["zh-CN"]}”表示每期乘以 $${m.k}$，这个因子就是底数；$t$ 期后共乘了 $t$ 次 $${m.k}$：${steps(answer)}**检验。** $t = 0$ 时表达式给出 $${a}$，即起始量。$t = 1$ 时给出 $${a} \\cdot ${m.k} = ${a * m.k}$，$t = 2$ 时给出 $${a} \\cdot ${m.k}^{2} = ${a * m.k * m.k}$，即 $${a * m.k} \\cdot ${m.k}$，又乘了一次 $${m.k}$。`,
          ),
        });
      },
    },
  ],
};

export const creatingExponentialDecayExpressions: TopicDef = {
  id: "creating-exponential-decay-expressions",
  title: t("Creating Exponential Decay Expressions", "建立指数衰减的表达式"),
  summary: t(
    "Write expressions such as $1000(0.85)^{t}$ for quantities that shrink by a fixed percent or fraction each period.",
    "为每期按固定百分率或比例减少的量写出 $1000(0.85)^{t}$ 这样的表达式。",
  ),
  prerequisites: ["creating-exponential-growth-expressions"],
  encompasses: [{ topic: "percent-change", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSA.SSE.A.1"],
  intro: t(
    `Growth by a fixed percent multiplies by a factor above $1$ every period. Many quantities shrink instead: a car loses value, a medicine leaves the body, a bouncing ball rises less each time. The same idea describes them, with a factor between $0$ and $1$.

Say a car worth $10000$ dollars loses $20\\%$ of its value each year. Losing $20\\%$ leaves $80\\%$, so each year multiplies the value by $0.8$. After one year it is worth $10000(0.8) = 8000$ dollars, after two years $10000(0.8)^{2} = 6400$, and after $t$ years

$$10000(0.8)^{t}.$$

The base is the **decay factor**, the part that remains each period. Each year the value falls by less in dollars, $2000$ and then $1600$, because $20\\%$ is taken of a smaller amount.

In this lesson we find decay factors and write such expressions.`,
    `按固定百分率增长，就是每期乘以一个大于 $1$ 的因子。很多量则在减少：汽车贬值，药物排出体外，弹跳的球一次比一次弹得低。同样的思路也能描述它们，只是因子在 $0$ 与 $1$ 之间。

设一辆价值 $10000$ 元的汽车每年贬值 $20\\%$。减少 $20\\%$ 剩下 $80\\%$，所以每年价值乘以 $0.8$。一年后价值 $10000(0.8) = 8000$ 元，两年后 $10000(0.8)^{2} = 6400$ 元，$t$ 年后

$$10000(0.8)^{t}$$

元。底数是**衰减因子**，即每期剩下的部分。每年减少的钱数越来越少，先是 $2000$，再是 $1600$，因为 $20\\%$ 取自一个更小的量。

这节课求衰减因子，并写出这样的表达式。`,
  ),
  knowledgePoints: [
    {
      id: "decay-factors",
      title: t("Decay factors", "衰减因子"),
      explanation: t(
        "Decreasing an amount by $15\\%$ leaves $100\\% - 15\\% = 85\\%$ of it, so the amount is multiplied by $0.85$. This is the **decay factor**:\n\n$$\\text{decay factor} = 1 - r$$\n\nA decay factor is between $0$ and $1$.\n\n> **Watch out.** The factor is what **remains**, not what is lost: decreasing by $15\\%$ multiplies by $0.85$, not by $0.15$. Subtract from $1$, not add: $1.15$ is growth. And the percent becomes a decimal by dividing by $100$, so $15$ itself is not the factor.",
        "把一个量减少 $15\\%$，剩下 $100\\% - 15\\% = 85\\%$，也就是乘以 $0.85$。这个数叫做**衰减因子**：\n\n$$\\text{衰减因子} = 1 - r$$\n\n衰减因子在 $0$ 与 $1$ 之间。\n\n> **注意。** 因子是**剩下**的部分，而不是减少的部分：减少 $15\\%$ 是乘以 $0.85$，而不是乘以 $0.15$。要从 $1$ 中减去，不是加上：$1.15$ 表示增长。百分数除以 $100$ 才化成小数，$15$ 本身不是因子。",
      ),
      generate: (rng) => factorProblem(rng, "decay"),
    },
    {
      id: "percent-decay-expressions",
      title: t("Percent decay", "按百分率衰减"),
      explanation: t(
        "A quantity that starts at $a$ and decreases by $r$ each period is multiplied by $1 - r$ each period, so after $t$ periods it is\n\n$$a(1 - r)^{t}$$\n\nA car worth $20000$ dollars losing $15\\%$ of its value each year is worth $20000(0.85)^{t}$ dollars after $t$ years. Check at $t = 1$: $20000(0.85) = 17000$, which is $20000$ less $15\\%$ of it, $3000$.\n\n> **Watch out.** The base is the part that remains, $0.85$, not the part lost, $0.15$, and not $1.15$, which would be growth. The exponent $t$ counts the periods; $17000t$ would take away the same amount every year, which is linear, not exponential.",
        "一个量起初为 $a$，每期减少 $r$，就是每期乘以 $1 - r$，所以 $t$ 期后为\n\n$$a(1 - r)^{t}$$\n\n一辆价值 $20000$ 元的汽车，每年贬值 $15\\%$，$t$ 年后价值 $20000(0.85)^{t}$ 元。在 $t = 1$ 处检验：$20000(0.85) = 17000$，正是 $20000$ 减去它的 $15\\%$，即 $3000$。\n\n> **注意。** 底数是剩下的部分 $0.85$，不是减少的部分 $0.15$，也不是表示增长的 $1.15$。指数 $t$ 表示期数；$17000t$ 表示每年减少同样多，那是线性变化，不是指数变化。",
      ),
      generate: (rng) => percentExpressionProblem(rng, "decay"),
    },
    {
      id: "fractional-decay",
      title: t("Fractions that remain", "按比例衰减"),
      explanation: t(
        "When a fraction is lost each period, the factor is the fraction that **remains**. A tank that loses $\\frac{1}{4}$ of its water each hour keeps $\\frac{3}{4}$, so starting from $80$ liters it holds\n\n$$80\\left(\\frac{3}{4}\\right)^{t}$$\n\nliters after $t$ hours. Halving each period gives the factor $\\frac{1}{2}$.\n\n> **Watch out.** Use the fraction that remains, $\\frac{3}{4}$, not the fraction lost, $\\frac{1}{4}$, and not its reciprocal $\\frac{4}{3}$, which would make the water grow. The starting $80$ is the coefficient, never the base.",
        "每期失去一个比例时，因子是**剩下**的比例。一个水箱每小时流失其中 $\\frac{1}{4}$ 的水，剩下 $\\frac{3}{4}$，所以从 $80$ 升开始，$t$ 小时后有\n\n$$80\\left(\\frac{3}{4}\\right)^{t}$$\n\n升水。每期减半时，因子是 $\\frac{1}{2}$。\n\n> **注意。** 要用剩下的比例 $\\frac{3}{4}$，不是流失的比例 $\\frac{1}{4}$，也不是它的倒数 $\\frac{4}{3}$，那会让水越来越多。起始的 $80$ 是系数，绝不是底数。",
      ),
      generate(rng) {
        const [p, q] = rng.pick<[number, number]>([
          [1, 2],
          [1, 3],
          [2, 3],
          [1, 4],
          [3, 4],
          [2, 5],
          [3, 5],
          [4, 5],
        ]);
        const a = rng.int(2, 40) * 10;
        const lose = rng.bool(0.5);
        const kept = lose ? Q.of(q - p, q) : Q.of(p, q);
        const lost = Q.one.sub(kept);
        const setup = lose
          ? t(
              `A tank holds $${a}$ liters of water, and each hour it loses $${num(Q.of(p, q))}$ of the water in it.`,
              `水箱中有 $${a}$ 升水，每小时流失其中的 $${num(Q.of(p, q))}$。`,
            )
          : t(
              `A ball is dropped from a height of $${a}$ cm. Each bounce reaches $${num(kept)}$ of the height of the previous one.`,
              `一个球从 $${a}$ 厘米高处落下，每次弹起的高度是前一次的 $${num(kept)}$。`,
            );
        const what = lose
          ? t("the amount of water after $t$ hours", "$t$ 小时后水箱中的水量")
          : t("the height reached on bounce number $t$", "第 $t$ 次弹起的高度");
        const answer = expo(a, num(kept), "t");
        return expressionProblem({
          prompt: t(`${setup.en} Write an expression for ${what.en}.`, `${setup["zh-CN"]}写出${what["zh-CN"]}的表达式。`),
          answer,
          wrong: [expo(a, num(lost), "t"), poly([kept.mul(Q.of(a)), "t"]), expo(a, num(Q.one.div(kept)), "t"), expo(kept, String(a), "t")],
          solution: lose
            ? t(
                `Losing $${num(lost)}$ each hour leaves $1 - ${num(lost)} = ${num(kept)}$ of the water, so the factor is $${num(kept)}$. The tank starts with $${a}$ liters, and after $t$ hours it has been multiplied by $${num(kept)}$ a total of $t$ times:${steps(answer)}**Check.** At $t = 1$ the expression gives $${a} \\cdot ${num(kept)} = ${num(kept.mul(Q.of(a)))}$, and losing $${num(lost)}$ of $${a}$, that is $${num(lost.mul(Q.of(a)))}$ liters, leaves $${a} - ${num(lost.mul(Q.of(a)))} = ${num(kept.mul(Q.of(a)))}$ as well.`,
                `每小时流失 $${num(lost)}$，剩下 $1 - ${num(lost)} = ${num(kept)}$，所以因子是 $${num(kept)}$。水箱起初有 $${a}$ 升，$t$ 小时后共乘了 $t$ 次 $${num(kept)}$：${steps(answer)}**检验。** $t = 1$ 时表达式给出 $${a} \\cdot ${num(kept)} = ${num(kept.mul(Q.of(a)))}$；流失 $${a}$ 的 $${num(lost)}$，即 $${num(lost.mul(Q.of(a)))}$ 升，剩下 $${a} - ${num(lost.mul(Q.of(a)))} = ${num(kept.mul(Q.of(a)))}$，结果相同。`,
              )
            : t(
                `The starting height $${a}$ cm is the coefficient. Each bounce multiplies the height by $${num(kept)}$, which is the base, and bounce number $t$ comes after $t$ such multiplications:${steps(answer)}**Check.** At $t = 1$ the expression gives $${a} \\cdot ${num(kept)} = ${num(kept.mul(Q.of(a)))}$ cm, which is $${num(kept)}$ of the drop height, as the first bounce should be.`,
                `起始高度 $${a}$ 厘米是系数。每次弹起高度乘以 $${num(kept)}$，这个因子就是底数；第 $t$ 次弹起前共乘了 $t$ 次：${steps(answer)}**检验。** $t = 1$ 时表达式给出 $${a} \\cdot ${num(kept)} = ${num(kept.mul(Q.of(a)))}$ 厘米，正是下落高度的 $${num(kept)}$，与第一次弹起相符。`,
              ),
        });
      },
    },
  ],
};

// Unit: exponential functions.

/** bracket writes a base for a power, in parentheses when it is a fraction or negative. */
const bracket = (b: Q) => (b.isInteger() && b.sign() > 0 ? b.toLatex() : `\\left(${b.toLatex()}\\right)`);

/** modelText states that the function name(t) = expr models the quantity of a context. */
function modelText(c: Change, expr: string): Text {
  return t(
    `${cap(c.noun.en)} after $t$ ${c.span.en} is $${c.name}(t) = ${expr}$.`,
    `$t$ ${c.span["zh-CN"]}后的${c.noun["zh-CN"]}为 $${c.name}(t) = ${expr}$。`,
  );
}

/** changeWords are the verbs of growth and decay. */
const changeWords = (kind: Kind) => (kind === "growth" ? t("increase", "增加") : t("decrease", "减少"));

/** writeModelProblem asks for the function of a quantity changing by a fixed percent, given the rate or two values. */
function writeModelProblem(rng: Rng, kind: Kind): Problem {
  const { c, r, s, f } = draw(rng, kind);
  const p = rng.int(2, 90) * 100;
  const fromValues = rng.bool(0.5);
  const next = f.mul(Q.of(p));
  const setup = fromValues
    ? t(
        `${cap(c.noun.en)} is $${grouped(p)}$ at first and $${grouped(next)}$ one ${c.per.en} later, and it changes by the same percent every ${c.per.en}.`,
        `${c.noun["zh-CN"]}起初为 $${grouped(p)}$，$1$ ${c.span["zh-CN"]}后为 $${grouped(next)}$，并且每${c.per["zh-CN"]}按相同的百分率变化。`,
      )
    : c.setup(grouped(p), String(r));
  const answer = expo(p, dec(f), "t");
  const reason = fromValues
    ? t(
        `Each ${c.per.en} ${c.noun.en} is multiplied by $\\frac{${grouped(next)}}{${grouped(p)}} = ${dec(f)}$.`,
        `每${c.per["zh-CN"]}${c.noun["zh-CN"]}乘以 $\\frac{${grouped(next)}}{${grouped(p)}} = ${dec(f)}$。`,
      )
    : t(
        `Each ${c.per.en} ${c.noun.en} is multiplied by $1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$.`,
        `每${c.per["zh-CN"]}${c.noun["zh-CN"]}乘以 $1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$。`,
      );
  return expressionProblem({
    prompt: t(
      `${setup.en} Write a function $${c.name}(t)$ for ${c.noun.en} after $t$ ${c.span.en}.`,
      `${setup["zh-CN"]}写出 $t$ ${c.span["zh-CN"]}后${c.noun["zh-CN"]}的函数 $${c.name}(t)$。`,
    ),
    answer,
    prefix: `${c.name}(t) =`,
    wrong: [expo(p, dec(Q.of(r, 100)), "t"), expo(p, dec(Q.of(100 - s * r, 100)), "t"), linear((s * p * r) / 100, p, "t")],
    solution: t(
      `**Step 1:** the factor. ${reason.en}\n\n**Step 2:** the function. The starting value $${grouped(p)}$ is the coefficient and the factor is the base, with the number of ${c.span.en} $t$ as the exponent:${steps(`${c.name}(t) = ${answer}`)}**Check.** $${c.name}(0) = ${grouped(p)}$, the start, and $${c.name}(1) = ${p}(${dec(f)}) = ${grouped(next)}$, which is $${grouped(p)}$ ${s > 0 ? "increased" : "decreased"} by $${r}\\%$.`,
      `**第一步：** 因子。${reason["zh-CN"]}\n\n**第二步：** 函数。起始值 $${grouped(p)}$ 是系数，因子是底数，${c.span["zh-CN"]}数 $t$ 是指数：${steps(`${c.name}(t) = ${answer}`)}**检验。** $${c.name}(0) = ${grouped(p)}$，即起始值；$${c.name}(1) = ${p}(${dec(f)}) = ${grouped(next)}$，正是 $${grouped(p)}$ ${s > 0 ? "增加" : "减少"} $${r}\\%$ 的结果。`,
    ),
  });
}

/** evaluateModelProblem asks for the value of a percent-change model after n periods, rounded to a whole number. */
function evaluateModelProblem(rng: Rng, kind: Kind): Problem {
  const { c, r, s, f } = draw(rng, kind);
  const p = rng.int(10, 180) * 50;
  const n = rng.int(2, 5);
  const value = f.pow(n).mul(Q.of(p));
  const answer = roundQ(value);
  const expr = expo(p, dec(f), "t");
  const setup = c.setup(grouped(p), String(r));
  const model = modelText(c, expr);
  const simple = Q.of(p).mul(Q.of(100 + s * n * r, 100));
  const prev = f.pow(n - 1).mul(Q.of(p));
  const prevExpr = `${p}(${dec(f)})${n - 1 === 1 ? "" : `^{${n - 1}}`}`;
  return numberProblem({
    prompt: t(
      `${setup.en} ${model.en} Find $${c.name}(${n})$, rounded to the nearest whole number.`,
      `${setup["zh-CN"]}${model["zh-CN"]}求 $${c.name}(${n})$，结果四舍五入到整数。`,
    ),
    answer,
    wrong: [...(simple.sign() > 0 ? [roundQ(simple)] : []), roundQ(f.pow(n - 1).mul(Q.of(p))), roundQ(f.mul(Q.of(p * n)))],
    solution: t(
      `Substitute $t = ${n}$. The power comes first: $(${dec(f)})^{${n}} = ${dec(f.pow(n))}$. Then multiply by the starting value $${grouped(p)}$ and round to the nearest whole number:${steps(`${c.name}(${n}) = ${p}(${dec(f)})^{${n}} = ${value.eq(answer) ? dec(value) : `${dec(value)} \\approx ${answer.toLatex()}`}`)}**Check.** One ${c.per.en} earlier, $${c.name}(${n - 1}) = ${prevExpr} = ${dec(prev)}$, and one more ${c.per.en} ${s > 0 ? "adds" : "takes away"} $${r}\\%$: $${dec(prev)} \\cdot ${dec(f)} = ${dec(value)}$.`,
      `代入 $t = ${n}$。先算乘方：$(${dec(f)})^{${n}} = ${dec(f.pow(n))}$。再乘以起始值 $${grouped(p)}$，并四舍五入到整数：${steps(`${c.name}(${n}) = ${p}(${dec(f)})^{${n}} = ${value.eq(answer) ? dec(value) : `${dec(value)} \\approx ${answer.toLatex()}`}`)}**检验。** 前 $1$ ${c.span["zh-CN"]}，$${c.name}(${n - 1}) = ${prevExpr} = ${dec(prev)}$，再过 $1$ ${c.span["zh-CN"]}${s > 0 ? "增加" : "减少"} $${r}\\%$：$${dec(prev)} \\cdot ${dec(f)} = ${dec(value)}$。`,
    ),
  });
}

/** Periodic is a context in which a quantity is multiplied by a fixed factor every d units of time. */
interface Periodic {
  readonly unit: Text;
  readonly units: Text;
  readonly setup: (a: string, change: Text) => Text;
  readonly ask: (x: number) => Text;
  readonly when: (v: string) => Text;
}

/** every writes "every hour" or "every $3$ hours". */
function every(d: number, p: Periodic): Text {
  return d === 1 ? t(`every ${p.unit.en}`, `每${p.unit["zh-CN"]}`) : t(`every $${d}$ ${p.units.en}`, `每 $${d}$ ${p.unit["zh-CN"]}`);
}

const growthPeriodics: readonly Periodic[] = [
  {
    unit: t("hour", "小时"),
    units: t("hours", "小时"),
    setup: (a, ch) =>
      t(`A culture starts with $${a}$ bacteria, and the number ${ch.en}.`, `某培养皿中起初有 $${a}$ 个细菌，细菌数量${ch["zh-CN"]}。`),
    ask: (x) => t(`How many bacteria are there after $${x}$ hours?`, `$${x}$ 小时后有多少个细菌？`),
    when: (v) => t(`After how many hours will there be $${v}$ bacteria?`, `多少小时后细菌数量达到 $${v}$？`),
  },
  {
    unit: t("day", "天"),
    units: t("days", "天"),
    setup: (a, ch) => t(`A video has $${a}$ views, and the number of views ${ch.en}.`, `某视频有 $${a}$ 次播放，播放次数${ch["zh-CN"]}。`),
    ask: (x) => t(`How many views will it have after $${x}$ days?`, `$${x}$ 天后播放次数是多少？`),
    when: (v) => t(`After how many days will it have $${v}$ views?`, `多少天后播放次数达到 $${v}$？`),
  },
  {
    unit: t("year", "年"),
    units: t("years", "年"),
    setup: (a, ch) => t(`An investment is worth $${a}$ dollars, and its value ${ch.en}.`, `一笔投资价值 $${a}$ 元，其价值${ch["zh-CN"]}。`),
    ask: (x) => t(`What is it worth after $${x}$ years?`, `$${x}$ 年后它价值多少元？`),
    when: (v) => t(`After how many years will it be worth $${v}$ dollars?`, `多少年后它价值 $${v}$ 元？`),
  },
];

/** halfLives are contexts of decay given by a half-life of d units of time. */
const halfLives: readonly {
  readonly units: Text;
  readonly setup: (a: number, d: number) => Text;
  readonly ask: (x: number) => Text;
  readonly when: (v: string) => Text;
}[] = [
  {
    units: t("years", "年"),
    setup: (a, d) =>
      t(
        `A sample of a radioactive substance has a mass of $${a}$ g and a half-life of $${d}$ years.`,
        `某放射性物质样本的质量为 $${a}$ 克，半衰期为 $${d}$ 年。`,
      ),
    ask: (x) => t(`What mass remains after $${x}$ years?`, `$${x}$ 年后还剩多少克？`),
    when: (v) => t(`After how many years will $${v}$ g remain?`, `多少年后还剩 $${v}$ 克？`),
  },
  {
    units: t("hours", "小时"),
    setup: (a, d) =>
      t(
        `A patient takes $${a}$ mg of a medicine, which has a half-life of $${d}$ hours.`,
        `病人服用了 $${a}$ 毫克药物，该药物的半衰期为 $${d}$ 小时。`,
      ),
    ask: (x) => t(`How many milligrams remain in the body after $${x}$ hours?`, `$${x}$ 小时后体内还剩多少毫克？`),
    when: (v) => t(`After how many hours will $${v}$ mg remain?`, `多少小时后还剩 $${v}$ 毫克？`),
  },
  {
    units: t("days", "天"),
    setup: (a, d) =>
      t(
        `A medical tracer has an activity of $${a}$ units and a half-life of $${d}$ days.`,
        `某医用示踪剂的放射性活度为 $${a}$ 个单位，半衰期为 $${d}$ 天。`,
      ),
    ask: (x) => t(`What is its activity after $${x}$ days?`, `$${x}$ 天后它的活度是多少？`),
    when: (v) => t(`After how many days will its activity be $${v}$ units?`, `多少天后它的活度为 $${v}$ 个单位？`),
  },
];

const halfLifeExplanation = t(
  "The **half-life** of a substance is the time it takes for half of it to decay. After one half-life $\\frac{1}{2}$ of the amount remains, after two $\\frac{1}{4}$, and after $t$ units of time with half-life $h$ the amount is\n\n$$A(t) = a\\left(\\frac{1}{2}\\right)^{\\frac{t}{h}}$$\n\nThe exponent $\\frac{t}{h}$ counts half-lives. For $80$ g with a half-life of $5$ years, after $15$ years ($3$ half-lives) $80\\left(\\frac{1}{2}\\right)^{3} = 10$ g remain.\n\n> **Watch out.** Each half-life halves what is left, not the starting amount. After $3$ half-lives $\\frac{1}{8}$ remains: not $\\frac{1}{6}$ (dividing by $2 \\cdot 3$), and not nothing (taking away half the start twice). Count the half-lives as $\\frac{t}{h}$ before halving.",
  "物质衰变掉一半所需的时间叫做**半衰期**。经过一个半衰期剩下 $\\frac{1}{2}$，经过两个剩下 $\\frac{1}{4}$；半衰期为 $h$ 时，经过时间 $t$ 后的量为\n\n$$A(t) = a\\left(\\frac{1}{2}\\right)^{\\frac{t}{h}}$$\n\n指数 $\\frac{t}{h}$ 表示经过了几个半衰期。$80$ 克、半衰期为 $5$ 年的物质，$15$ 年（$3$ 个半衰期）后剩下 $80\\left(\\frac{1}{2}\\right)^{3} = 10$ 克。\n\n> **注意。** 每个半衰期减半的是剩下的量，不是起始量。经过 $3$ 个半衰期剩下 $\\frac{1}{8}$：不是 $\\frac{1}{6}$（除以 $2 \\cdot 3$），也不是一点不剩（两次各减去起始量的一半）。先用 $\\frac{t}{h}$ 数出半衰期的个数，再减半。",
);

/** halfLifeProblem asks for the amount left after a whole number of half-lives. */
function halfLifeProblem(rng: Rng): Problem {
  const ctx = rng.pick(halfLives);
  const k = rng.int(1, 5);
  const d = rng.int(2, 12);
  const left = rng.int(1, 25);
  const a = left * 2 ** k;
  const x = k * d;
  const setup = ctx.setup(a, d);
  const ask = ctx.ask(x);
  return numberProblem({
    prompt: t(`${setup.en} ${ask.en}`, `${setup["zh-CN"]}${ask["zh-CN"]}`),
    answer: left,
    wrong: [Q.of(a, 2 * k), Q.of(a, 2 ** (k - 1)), Q.of(a, 2 ** (k + 1)), ...(a - (k * a) / 2 > 0 ? [a - (k * a) / 2] : [])],
    solution: t(
      `**Step 1:** count the half-lives. $${x}$ ${ctx.units.en} is $\\frac{${x}}{${d}} = ${k}$ half-li${k === 1 ? "fe" : "ves"}.\n\n**Step 2:** each half-life halves the amount, so multiply by $\\frac{1}{2}$ ${k === 1 ? "once" : `$${k}$ times`}:${steps(k === 1 ? `${a} \\cdot \\frac{1}{2} = ${left}` : `${a}\\left(\\frac{1}{2}\\right)^{${k}} = \\frac{${a}}{${2 ** k}} = ${left}`)}**Check.** Doubling back ${k === 1 ? "once" : `$${k}$ times`} must give the starting amount: $${left === 1 ? "" : `${left} \\cdot `}${k === 1 ? "2" : `2^{${k}}`} = ${a}$.`,
      `**第一步：** 数半衰期。$${x}$ ${ctx.units["zh-CN"]}是 $\\frac{${x}}{${d}} = ${k}$ 个半衰期。\n\n**第二步：** 每经过一个半衰期，量减半，所以乘以 $\\frac{1}{2}$ 共 $${k}$ 次：${steps(k === 1 ? `${a} \\cdot \\frac{1}{2} = ${left}` : `${a}\\left(\\frac{1}{2}\\right)^{${k}} = \\frac{${a}}{${2 ** k}} = ${left}`)}**检验。** 往回翻倍 $${k}$ 次应当得到起始量：$${left === 1 ? "" : `${left} \\cdot `}${k === 1 ? "2" : `2^{${k}}`} = ${a}$。`,
    ),
  });
}

/** percentRateProblem asks for the percent of growth or decay per period of a model. */
function percentRateProblem(rng: Rng, kind: Kind): Problem {
  const { c, r, s, f } = draw(rng, kind);
  const p = start(rng);
  const model = modelText(c, expo(p, dec(f), "t"));
  const w = changeWords(kind);
  return numberProblem({
    prompt: t(
      `${model.en} By what percent does ${c.noun.en} ${w.en} each ${c.per.en}?`,
      `${model["zh-CN"]}${c.noun["zh-CN"]}每${c.per["zh-CN"]}${w["zh-CN"]}百分之几？`,
    ),
    answer: r,
    percent: true,
    wrong: [100 + s * r, Q.of(100 + s * r, 100), Q.of(r, 100), 100 - s * r],
    solution: t(
      `The base of the power is the factor, $${dec(f)}$. It is ${s > 0 ? "more" : "less"} than $1$, so ${c.noun.en} ${s > 0 ? "grows" : "shrinks"}, and the difference from $1$ is the rate: $${dec(f)} = 1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))}$.\n\nSo each ${c.per.en} ${c.noun.en} ${s > 0 ? "increases" : "decreases"} by $${dec(Q.of(r, 100))} = ${r}\\%$. **Check.** On $100$, one ${c.per.en} gives $100 \\cdot ${dec(f)} = ${100 + s * r}$, a change of $${r}$ out of $100$.`,
      `幂的底数就是因子 $${dec(f)}$。它${s > 0 ? "大于" : "小于"} $1$，所以${c.noun["zh-CN"]}${s > 0 ? "增长" : "减少"}，它与 $1$ 的差就是变化率：$${dec(f)} = 1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))}$。\n\n所以${c.noun["zh-CN"]}每${c.per["zh-CN"]}${w["zh-CN"]} $${dec(Q.of(r, 100))} = ${r}\\%$。**检验。** 对 $100$ 来说，$1$ ${c.span["zh-CN"]}后为 $100 \\cdot ${dec(f)} = ${100 + s * r}$，每 $100$ 变化了 $${r}$。`,
    ),
  });
}

/** statementProblem asks which statement about a percent-change model is true. */
function statementProblem(rng: Rng, kind: Kind): Problem {
  let d: ReturnType<typeof draw>;
  do d = draw(rng, kind);
  while (d.r === 50);
  const { c, r, s, f } = d;
  const p = start(rng);
  const model = modelText(c, expo(p, dec(f), "t"));
  const verb = kind === "growth" ? t("increases", "增加") : t("decreases", "减少");
  const by = (amount: string) =>
    t(`${cap(c.noun.en)} ${verb.en} by ${amount} each ${c.per.en}.`, `${c.noun["zh-CN"]}每${c.per["zh-CN"]}${verb["zh-CN"]} ${amount}。`);
  const options = [
    by(`$${r}\\%$`),
    by(`$${grouped(Q.of(p * r, 100))}$`),
    by(`$${100 + s * r}\\%$`),
    t(`${cap(c.noun.en)} is $${grouped(f.mul(Q.of(p)))}$ at the start.`, `起初${c.noun["zh-CN"]}为 $${grouped(f.mul(Q.of(p)))}$。`),
  ];
  const order = rng.shuffle([0, 1, 2, 3]);
  return choiceProblem({
    prompt: t(`${model.en} Which statement is true?`, `${model["zh-CN"]}下列哪个说法正确？`),
    options: order.map((i) => options[i]!),
    correct: order.indexOf(0),
    solution: t(
      `The coefficient $${p}$ is the starting value, and the factor $${dec(f)} = 1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))}$ means ${c.noun.en} ${verb.en} by $${r}\\%$ each ${c.per.en}. The amount of change is not the same each ${c.per.en}: it is $${r}\\%$ of the current value.\n\n**Check.** In the first ${c.per.en} the change is $${r}\\%$ of $${grouped(p)}$, that is $${grouped(Q.of(p * r, 100))}$, giving $${grouped(f.mul(Q.of(p)))}$. In the second it is $${r}\\%$ of $${grouped(f.mul(Q.of(p)))}$, that is $${grouped(f.mul(Q.of(p * r, 100)))}$: a different amount, but the same percent.`,
      `系数 $${p}$ 是起始值，因子 $${dec(f)} = 1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))}$ 表示${c.noun["zh-CN"]}每${c.per["zh-CN"]}${verb["zh-CN"]} $${r}\\%$。每${c.per["zh-CN"]}变化的数量并不相同：它是当前值的 $${r}\\%$。\n\n**检验。** 第一${c.per["zh-CN"] === "月" ? "个月" : c.per["zh-CN"]}的变化量是 $${grouped(p)}$ 的 $${r}\\%$，即 $${grouped(Q.of(p * r, 100))}$，结果为 $${grouped(f.mul(Q.of(p)))}$。第二${c.per["zh-CN"] === "月" ? "个月" : c.per["zh-CN"]}的变化量是 $${grouped(f.mul(Q.of(p)))}$ 的 $${r}\\%$，即 $${grouped(f.mul(Q.of(p * r, 100)))}$：数量不同，百分率相同。`,
    ),
  });
}

/** totalChangeProblem asks for the total percent change of a model over several periods. */
function totalChangeProblem(rng: Rng, kind: Kind): Problem {
  const n = rng.pick([2, 2, 3]);
  let d: ReturnType<typeof draw>;
  do d = draw(rng, kind);
  while (n === 3 && ![10, 20, 30, 50].includes(d.r));
  const { c, r, s, f } = d;
  const p = start(rng);
  const fn = f.pow(n);
  const total = fn.sub(Q.one).abs().mul(Q.of(100));
  const model = modelText(c, expo(p, dec(f), "t"));
  const w = changeWords(kind);
  return numberProblem({
    prompt: t(
      `${model.en} By what percent does ${c.noun.en} ${w.en} in total over $${n}$ ${c.span.en}?`,
      `${model["zh-CN"]}${n} ${c.span["zh-CN"]}内${c.noun["zh-CN"]}一共${w["zh-CN"]}百分之几？`,
    ),
    answer: total,
    percent: true,
    ...(total.isInteger() ? {} : { form: "decimal" as const }),
    wrong: [n * r, fn.mul(Q.of(100)), fn],
    solution: t(
      `Each ${c.per.en} multiplies the value by $${dec(f)}$, so over $${n}$ ${c.span.en} it is multiplied by $(${dec(f)})^{${n}} = ${dec(fn)}$.\n\nA factor of $${dec(fn)}$ leaves $${dec(fn.mul(Q.of(100)))}\\%$ of the start, which is a${s > 0 ? "n increase" : " decrease"} of $${dec(total)}\\%$. It is not $${n} \\cdot ${r}\\%$, because each ${c.per.en}'s change applies to the value already changed.\n\n**Check.** Start from $100$: ${Array.from(
        { length: n },
        (_, i) => dec(f.pow(i + 1).mul(Q.of(100))),
      )
        .map((v, i) => `after ${i + 1} ${i === 0 ? c.per.en : c.span.en} $${v}$`)
        .join(", ")}, a change of $${dec(total)}$ out of $100$.`,
      `每${c.per["zh-CN"]}数值乘以 $${dec(f)}$，所以 $${n}$ ${c.span["zh-CN"]}内乘以 $(${dec(f)})^{${n}} = ${dec(fn)}$。\n\n因子 $${dec(fn)}$ 表示剩下起始值的 $${dec(fn.mul(Q.of(100)))}\\%$，即${w["zh-CN"]}了 $${dec(total)}\\%$。它不是 $${n} \\cdot ${r}\\%$，因为每${c.per["zh-CN"]}的变化都作用在已经变化后的数值上。\n\n**检验。** 从 $100$ 开始：${Array.from(
        { length: n },
        (_, i) => dec(f.pow(i + 1).mul(Q.of(100))),
      )
        .map((v, i) => `$${i + 1}$ ${c.span["zh-CN"]}后为 $${v}$`)
        .join("，")}，每 $100$ 变化了 $${dec(total)}$。`,
    ),
  });
}

/** niceFactor draws a factor 1 ± r/100 and a starting amount p whose values after n periods are whole numbers. */
function niceFactor(rng: Rng, kind: Kind, n: number): { r: number; f: Q; p: number } {
  const r = rng.pick(
    kind === "growth" ? (n === 2 ? [5, 10, 20, 25, 50] : [10, 20, 25, 50]) : n === 2 ? [5, 10, 20, 25, 40, 50] : [10, 20, 40, 50],
  );
  const f = Q.of(100 + (kind === "growth" ? r : -r), 100);
  const unit = Number(f.d) ** n;
  const p = unit * rng.int(Math.max(1, Math.ceil(200 / unit)), Math.max(2, Math.floor(20000 / unit)));
  return { r, f, p };
}

/** initialValueProblem asks for the starting amount of a percent-change model from a later value. */
function initialValueProblem(rng: Rng, kind: Kind): Problem {
  const c = rng.pick(kind === "growth" ? growths : decays);
  const n = rng.pick([2, 2, 3]);
  const { r, f, p } = niceFactor(rng, kind, n);
  const s = kind === "growth" ? 1 : -1;
  const v = f.pow(n).mul(Q.of(p));
  const verb = kind === "growth" ? t("grows", "增长") : t("decreases", "减少");
  return numberProblem({
    prompt: t(
      `${cap(c.noun.en)} ${verb.en} by $${r}\\%$ each ${c.per.en}. After $${n}$ ${c.span.en} it is $${grouped(v)}$. What was it at the start?`,
      `${c.noun["zh-CN"]}每${c.per["zh-CN"]}${verb["zh-CN"]} $${r}\\%$，$${n}$ ${c.span["zh-CN"]}后为 $${grouped(v)}$。起初是多少？`,
    ),
    answer: p,
    wrong: [v.mul(f.pow(n)), ...(100 + s * n * r > 0 ? [v.div(Q.of(100 + s * n * r, 100))] : []), v.mul(Q.of(100 - s * r, 100).pow(n))],
    solution: t(
      `The factor is $1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$. If $a$ is the starting value, then after $${n}$ ${c.span.en} the model gives $a(${dec(f)})^{${n}} = ${grouped(v)}$. Undo the multiplication by dividing both sides by $(${dec(f)})^{${n}}$:${steps(`a = \\frac{${grouped(v)}}{(${dec(f)})^{${n}}} = \\frac{${grouped(v)}}{${dec(f.pow(n))}} = ${grouped(p)}`)}**Check.** ${Array.from(
        { length: n },
        (_, i) => grouped(f.pow(i + 1).mul(Q.of(p))),
      ).reduce(
        (acc, v) => `${acc} \\to ${v}`,
        `$${grouped(p)}`,
      )}$: ${s > 0 ? "growing" : "decreasing"} by $${r}\\%$ ${n === 2 ? "twice" : "three times"} gives back $${grouped(v)}$.`,
      `因子为 $1 ${s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$。设起始值为 $a$，则 $${n}$ ${c.span["zh-CN"]}后模型给出 $a(${dec(f)})^{${n}} = ${grouped(v)}$。两边同时除以 $(${dec(f)})^{${n}}$，消去这个乘法：${steps(`a = \\frac{${grouped(v)}}{(${dec(f)})^{${n}}} = \\frac{${grouped(v)}}{${dec(f.pow(n))}} = ${grouped(p)}`)}**检验。** ${Array.from(
        { length: n },
        (_, i) => grouped(f.pow(i + 1).mul(Q.of(p))),
      ).reduce(
        (acc, v) => `${acc} \\to ${v}`,
        `$${grouped(p)}`,
      )}$：${s > 0 ? "增长" : "减少"} $${r}\\%$ 共 $${n}$ 次，正好得回 $${grouped(v)}$。`,
    ),
  });
}

/** rateFromValuesProblem asks for the percent rate of a model from its values two periods apart. */
function rateFromValuesProblem(rng: Rng, kind: Kind): Problem {
  const c = rng.pick(kind === "growth" ? growths : decays);
  const { r, f, p } = niceFactor(rng, kind, 2);
  const v = f.pow(2).mul(Q.of(p));
  const total = f.pow(2).sub(Q.one).abs().mul(Q.of(100));
  const w = changeWords(kind);
  return numberProblem({
    prompt: t(
      `${cap(c.noun.en)} changes by the same percent every ${c.per.en}. It is $${grouped(p)}$ at first and $${grouped(v)}$ after $2$ ${c.span.en}. By what percent does it ${w.en} each ${c.per.en}?`,
      `${c.noun["zh-CN"]}每${c.per["zh-CN"]}按相同的百分率变化。起初为 $${grouped(p)}$，$2$ ${c.span["zh-CN"]}后为 $${grouped(v)}$。它每${c.per["zh-CN"]}${w["zh-CN"]}百分之几？`,
    ),
    answer: r,
    percent: true,
    wrong: [total, total.div(Q.of(2)), f.pow(2).mul(Q.of(100))],
    solution: t(
      `If $b$ is the factor, then $${grouped(p)}b^{2} = ${grouped(v)}$, so${steps(`b^{2} = \\frac{${grouped(v)}}{${grouped(p)}} = ${dec(f.pow(2))}`, `b = ${root(2, dec(f.pow(2)))} = ${dec(f)}`)}The factor $${dec(f)}$ means a${kind === "growth" ? "n increase" : " decrease"} of $${r}\\%$ each ${c.per.en}.\n\n**Check.** $${grouped(p)} \\to ${grouped(f.mul(Q.of(p)))} \\to ${grouped(v)}$: multiplying by $${dec(f)}$ twice gives the value after $2$ ${c.span.en}.`,
      `设因子为 $b$，则 $${grouped(p)}b^{2} = ${grouped(v)}$，所以${steps(`b^{2} = \\frac{${grouped(v)}}{${grouped(p)}} = ${dec(f.pow(2))}`, `b = ${root(2, dec(f.pow(2)))} = ${dec(f)}`)}因子 $${dec(f)}$ 表示每${c.per["zh-CN"]}${w["zh-CN"]} $${r}\\%$。\n\n**检验。** $${grouped(p)} \\to ${grouped(f.mul(Q.of(p)))} \\to ${grouped(v)}$：乘以 $${dec(f)}$ 两次，正好得到 $2$ ${c.span["zh-CN"]}后的值。`,
    ),
  });
}

/** evalBases are the bases of exponential functions to evaluate. */
const evalBases = [Q.of(2), Q.of(3), Q.of(4), Q.of(5), Q.of(1, 2), Q.of(1, 3), Q.of(1, 4), Q.of(2, 3), Q.of(3, 2)];

export const exponentialFunctions: TopicDef = {
  id: "exponential-functions",
  title: t("Exponential Functions", "指数函数"),
  summary: t(
    "Recognize and evaluate exponential functions $f(x) = a \\cdot b^{x}$, and find one from a table of values.",
    "识别并计算指数函数 $f(x) = a \\cdot b^{x}$ 的值，并能根据数值表求出它。",
  ),
  prerequisites: ["representations-of-functions", "zero-and-negative-exponents"],
  encompasses: [
    { topic: "powers-of-rational-numbers", weight: 0.3 },
    { topic: "introduction-to-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.IF.A.2", "CCSS.HSF.LE.A.2"],
  intro: t(
    `We have written expressions such as $200(1.05)^{t}$ for amounts that are multiplied by the same factor each period, and we know functions as rules that give one output for each input. Putting the two together gives a new family of functions, in which the input is the exponent.

Take $f(x) = 3 \\cdot 2^{x}$. Each time $x$ goes up by $1$ there is one more factor $2$, so the value doubles:

$$f(0) = 3,\\quad f(1) = 6,\\quad f(2) = 12,\\quad f(3) = 24.$$

Going down works too, since negative exponents are reciprocals: $f(-1) = 3 \\cdot \\frac{1}{2} = \\frac{3}{2}$. The number $a = f(0)$ is the starting value and $b$ is the factor of each step. A linear function adds the same amount each step; an exponential one multiplies by the same factor.

In this lesson we evaluate exponential functions $f(x) = a \\cdot b^{x}$, tell them apart from other functions, and find one from a table.`,
    `我们写过 $200(1.05)^{t}$ 这样的表达式，表示每期乘以同一个因子的量；我们也知道函数是对每个输入给出一个输出的规则。把两者结合，就得到一类新的函数，其中输入是指数。

看 $f(x) = 3 \\cdot 2^{x}$。$x$ 每增加 $1$，就多一个因数 $2$，所以函数值翻倍：

$$f(0) = 3,\\quad f(1) = 6,\\quad f(2) = 12,\\quad f(3) = 24.$$

往回走也可以，因为负指数表示倒数：$f(-1) = 3 \\cdot \\frac{1}{2} = \\frac{3}{2}$。数 $a = f(0)$ 是起始值，$b$ 是每一步的因子。一次函数每一步加上相同的量，指数函数每一步乘以相同的因子。

这节课计算指数函数 $f(x) = a \\cdot b^{x}$ 的值，把它与其他函数区分开，并由数值表求出它。`,
  ),
  knowledgePoints: [
    {
      id: "evaluating-exponential-functions",
      title: t("Evaluating exponential functions", "计算指数函数的值"),
      explanation: t(
        "An **exponential function** has the variable in the exponent:\n\n$$f(x) = a \\cdot b^{x} \\qquad (a \\ne 0,\\; b > 0,\\; b \\ne 1)$$\n\nTo evaluate it, compute the power first, then multiply by $a$: for $f(x) = 3(2)^{x}$, $f(-2) = 3 \\cdot 2^{-2} = 3 \\cdot \\frac{1}{4} = \\frac{3}{4}$. The power comes first because, in the order of operations, exponents come before multiplication.\n\n> **Watch out.** The base alone is raised to the power: $3(2)^{x}$ is not $6^{x}$. An exponent is repeated multiplication, so $2^{3}$ is $8$, not $2 \\cdot 3$. A negative exponent gives a reciprocal, not a negative number, and $x$ goes in exactly as given: $2^{-2} = \\frac{1}{4}$, not $4$.",
        "变量在指数中的函数叫做**指数函数**：\n\n$$f(x) = a \\cdot b^{x} \\qquad (a \\ne 0,\\; b > 0,\\; b \\ne 1)$$\n\n求值时先算乘方，再乘以 $a$：对 $f(x) = 3(2)^{x}$，$f(-2) = 3 \\cdot 2^{-2} = 3 \\cdot \\frac{1}{4} = \\frac{3}{4}$。先算乘方，是因为按运算顺序乘方先于乘法。\n\n> **注意。** 只有底数被乘方：$3(2)^{x}$ 不是 $6^{x}$。指数表示连乘，所以 $2^{3}$ 是 $8$，不是 $2 \\cdot 3$。负指数得到倒数，而不是负数；$x$ 要按所给的值代入：$2^{-2} = \\frac{1}{4}$，不是 $4$。",
      ),
      keyPrerequisites: ["zero-and-negative-exponents"],
      generate(rng) {
        let a: number;
        let b: Q;
        let x: number;
        do {
          a = rng.pick([1, 2, 3, 4, 5, 6, -2, -3]);
          b = rng.pick(evalBases);
          x = rng.int(-3, 4);
        } while (b.pow(x).n > 625n || b.pow(x).d > 625n || (a === 1 && x === 1));
        const name = rng.pick(["f", "g", "h"]);
        const value = b.pow(x).mul(Q.of(a));
        return numberProblem({
          prompt: t(
            `Let $${name}(x) = ${expo(a, num(b))}$. Find $${name}(${x})$.`,
            `设 $${name}(x) = ${expo(a, num(b))}$，求 $${name}(${x})$。`,
          ),
          answer: value,
          mistakes: [
            why(
              b.mul(Q.of(a)).pow(x),
              "You multiplied first and then applied the exponent. The exponent belongs only to the base, so do the power first.",
              "你先相乘再取幂。指数只作用于底数，所以要先算乘方。",
            ),
            why(
              b.mul(Q.of(a * x)),
              "You multiplied by the exponent. An exponent means repeated multiplication by the base.",
              "你乘了指数。指数表示底数的连乘。",
            ),
            why(
              b.pow(-x).mul(Q.of(a)),
              "You used the opposite exponent. Substitute $x$ as it is given.",
              "你用了相反的指数。应按所给的 $x$ 代入。",
            ),
          ],
          solution: (() => {
            const times = a === 1 ? "" : `${a} \\cdot `;
            const chain = steps(
              a === 1
                ? `${name}(${x}) = ${bracket(b)}^{${x}} = ${value.toLatex()}`
                : x === 1
                  ? `${name}(1) = ${a} \\cdot ${b.toLatex()} = ${value.toLatex()}`
                  : `${name}(${x}) = ${a} \\cdot ${bracket(b)}^{${x}} = ${a} \\cdot ${b.pow(x).toLatex()} = ${value.toLatex()}`,
            );
            const before = b.pow(x - 1).mul(Q.of(a));
            const back = `${name}(${x - 1}) = ${times}${x - 1 === 1 ? bracket(b) : `${bracket(b)}^{${x - 1}}`} = ${before.toLatex()}`;
            return t(
              `Substitute $x = ${x}$. By the order of operations the power comes first${x < 0 ? `, and the negative exponent means a reciprocal, $${bracket(b)}^{${x}} = ${x === -1 ? b.pow(-1).toLatex() : `${bracket(b.pow(-1))}^{${-x}}`}$` : ""}${a === 1 ? "" : `; then multiply by $${a}$`}:${chain}**Check.** One step back, $${back}$. Each step up multiplies by the base, and $${paren(before)}$ times $${b.toLatex()}$ is $${value.toLatex()}$.`,
              `代入 $x = ${x}$。按运算顺序先算乘方${x < 0 ? `，负指数表示倒数，$${bracket(b)}^{${x}} = ${x === -1 ? b.pow(-1).toLatex() : `${bracket(b.pow(-1))}^{${-x}}`}$` : ""}${a === 1 ? "" : `，再乘以 $${a}$`}：${chain}**检验。** 往回一步，$${back}$。每往上一步都乘以底数，而 $${paren(before)}$ 乘以 $${b.toLatex()}$ 等于 $${value.toLatex()}$。`,
            );
          })(),
        });
      },
    },
    {
      id: "recognizing-exponential-functions",
      title: t("Recognizing exponential functions", "识别指数函数"),
      explanation: t(
        "In $f(x) = a \\cdot b^{x}$ the variable is the **exponent**, and the base is a fixed number with $b > 0$ and $b \\ne 1$.\n\n- $y = 4(3)^{x}$ is exponential.\n- $y = 4x^{3}$ is not: the variable is the base.\n- $y = 3x + 4$ is linear.\n- $y = 4(1)^{x}$ is the constant $4$, and $(-3)^{x}$ is not allowed, since $(-3)^{\\frac{1}{2}}$ is not a real number.\n\nA quick test is to look at a few values: an exponential function multiplies by the same factor each time $x$ goes up by $1$.\n\n> **Watch out.** An exponent alone does not make a function exponential: in $4x^{3}$ the exponent is fixed and the variable is the base. A base of $1$ never changes the value, and a negative base gives no real value for many exponents, so neither counts.",
        "在 $f(x) = a \\cdot b^{x}$ 中，变量是**指数**，底数是固定的数，且 $b > 0$、$b \\ne 1$。\n\n- $y = 4(3)^{x}$ 是指数函数。\n- $y = 4x^{3}$ 不是：变量是底数。\n- $y = 3x + 4$ 是一次函数。\n- $y = 4(1)^{x}$ 就是常数 $4$；$(-3)^{x}$ 不允许，因为 $(-3)^{\\frac{1}{2}}$ 不是实数。\n\n一个快速的检验是看几个函数值：$x$ 每增加 $1$，指数函数都乘以同一个因子。\n\n> **注意。** 有指数不等于是指数函数：在 $4x^{3}$ 中指数是固定的，变量是底数。底数为 $1$ 时函数值从不改变，底数为负时很多指数没有实数值，所以都不算。",
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        const b = rng.pick(evalBases);
        const k = rng.int(2, 5);
        const options = [
          `y = ${expo(a, num(b))}`,
          `y = ${a}x^{${k}}`,
          `y = ${linear(k, a)}`,
          rng.bool() ? `y = ${a}(1)^{x}` : `y = ${a}(-${k})^{x}`,
        ];
        const which = rng.int(0, 3);
        const shown = options[which]!;
        const reasons = [
          t("Yes", "是"),
          t("No: the variable is the base, not the exponent", "不是：变量是底数，而不是指数"),
          t("No: it is a linear function", "不是：它是一次函数"),
          t("No: the base must be positive and not $1$", "不是：底数必须为正且不等于 $1$"),
        ];
        const explain = [
          t(
            `The variable is the exponent and the base $${b.toLatex()}$ is positive and not $1$, so it is exponential.`,
            `变量是指数，底数 $${b.toLatex()}$ 为正且不等于 $1$，所以它是指数函数。`,
          ),
          t(
            `In $${shown}$ the variable $x$ is the base and the exponent is the fixed number $${k}$.`,
            `在 $${shown}$ 中变量 $x$ 是底数，指数是固定的数 $${k}$。`,
          ),
          t(
            `$${shown}$ adds $${k}$ each time $x$ goes up by $1$: it is linear.`,
            `$x$ 每增加 $1$，$${shown}$ 就增加 $${k}$：它是一次函数。`,
          ),
          t(
            `The base ${shown.includes("(1)") ? "$1$ makes it the constant function" : "is negative, so for some exponents such as $\\frac{1}{2}$ there is no real value"}${shown.includes("(1)") ? ` $y = ${a}$` : ""}.`,
            `底数${shown.includes("(1)") ? `为 $1$，函数就是常数函数 $y = ${a}$` : "为负数，对 $\\frac{1}{2}$ 等指数没有实数值"}。`,
          ),
        ];
        const one = shown.includes("(1)");
        const checks = [
          t(
            `**Check.** Each time $x$ goes up by $1$ there is one more factor $${b.toLatex()}$: from $x = 0$ to $x = 1$ the value goes from $${a}$ to $${b.mul(Q.of(a)).toLatex()}$, and every later step multiplies by $${b.toLatex()}$ again.`,
            `**检验。** $x$ 每增加 $1$ 就多一个因数 $${b.toLatex()}$：从 $x = 0$ 到 $x = 1$，函数值由 $${a}$ 变为 $${b.mul(Q.of(a)).toLatex()}$，之后每一步都再乘以 $${b.toLatex()}$。`,
          ),
          t(
            `**Check.** At $x = 1$, $2$, $3$ the values are $${a}$, $${a * 2 ** k}$ and $${a * 3 ** k}$. The ratios $${2 ** k}$ and $${Q.of(3 ** k, 2 ** k).toLatex()}$ differ, so no fixed factor multiplies the value at each step.`,
            `**检验。** $x = 1$、$2$、$3$ 时函数值为 $${a}$、$${a * 2 ** k}$、$${a * 3 ** k}$。相邻两值之比 $${2 ** k}$ 与 $${Q.of(3 ** k, 2 ** k).toLatex()}$ 不相等，所以每一步并不乘以固定的因子。`,
          ),
          t(
            `**Check.** At $x = 0$, $1$, $2$ the values are $${a}$, $${a + k}$ and $${a + 2 * k}$: the differences are both $${k}$, while the ratios $${Q.of(a + k, a).toLatex()}$ and $${Q.of(a + 2 * k, a + k).toLatex()}$ differ.`,
            `**检验。** $x = 0$、$1$、$2$ 时函数值为 $${a}$、$${a + k}$、$${a + 2 * k}$：差都是 $${k}$，而比 $${Q.of(a + k, a).toLatex()}$ 与 $${Q.of(a + 2 * k, a + k).toLatex()}$ 不相等。`,
          ),
          one
            ? t(
                `**Check.** Every power of $1$ is $1$, so the value is $${a}$ at $x = 0$, at $x = 1$ and everywhere else: the function never grows or decays.`,
                `**检验。** $1$ 的任何次幂都是 $1$，所以 $x = 0$、$x = 1$ 以及其他任何地方函数值都是 $${a}$：它既不增长也不衰减。`,
              )
            : t(
                `**Check.** At $x = \\frac{1}{2}$ the power would be $\\sqrt{-${k}}$, and no real number squares to $-${k}$.`,
                `**检验。** $x = \\frac{1}{2}$ 时幂为 $\\sqrt{-${k}}$，而没有实数的平方等于 $-${k}$。`,
              ),
        ];
        return choiceProblem({
          prompt: t(`Is $${shown}$ an exponential function?`, `$${shown}$ 是指数函数吗？`),
          options: reasons,
          correct: which,
          solution: t(`${explain[which]!.en}\n\n${checks[which]!.en}`, `${explain[which]!["zh-CN"]}\n\n${checks[which]!["zh-CN"]}`),
        });
      },
    },
    {
      id: "exponential-functions-from-tables",
      title: t("Finding the function from a table", "由数值表求函数"),
      explanation: t(
        "In a table of an exponential function, each time $x$ goes up by $1$ the value is **multiplied** by the same number $b$. So $b$ is the ratio of consecutive values, and $a = f(0)$.\n\n$$\\begin{array}{c|cccc} x & 0 & 1 & 2 & 3 \\\\ \\hline f(x) & 5 & 15 & 45 & 135 \\end{array}$$\n\nHere $b = \\frac{15}{5} = 3$ and $a = 5$, so $f(x) = 5(3)^{x}$. If the table does not show $x = 0$, step back from a known value: $f(0) = \\frac{f(1)}{b}$.\n\n> **Watch out.** The values are multiplied, not increased by a fixed amount, so the function is not linear. The starting value $a$ is the coefficient and $b$ the base, not the other way round; take the ratio later value over earlier one, or you get $\\frac{1}{b}$; and $a$ is $f(0)$, not the first value shown.",
        "指数函数的数值表中，$x$ 每增加 $1$，函数值就**乘以**同一个数 $b$。所以 $b$ 是相邻两个函数值之比，而 $a = f(0)$。\n\n$$\\begin{array}{c|cccc} x & 0 & 1 & 2 & 3 \\\\ \\hline f(x) & 5 & 15 & 45 & 135 \\end{array}$$\n\n这里 $b = \\frac{15}{5} = 3$，$a = 5$，所以 $f(x) = 5(3)^{x}$。如果表中没有 $x = 0$，就从已知值往回推：$f(0) = \\frac{f(1)}{b}$。\n\n> **注意。** 函数值是被乘的，而不是每次加上固定的量，所以它不是一次函数。起始值 $a$ 是系数，$b$ 是底数，不要弄反；比值要用后一个值除以前一个值，否则得到 $\\frac{1}{b}$；$a$ 是 $f(0)$，不一定是表中第一个值。",
      ),
      generate(rng) {
        const b = rng.pick([Q.of(2), Q.of(2), Q.of(3), Q.of(4), Q.of(1, 2), Q.of(1, 3)]);
        const s = rng.pick([0, 0, 1, -1]);
        const xs = [s, s + 1, s + 2, s + 3];
        const den = Number(b.d) ** Math.max(0, s + 3);
        const num0 = Number(b.n) ** Math.max(0, -s);
        const a = rng.int(1, b.d > 1n ? 3 : 6) * den * num0;
        const ys = xs.map((x) => b.pow(x).mul(Q.of(a)));
        const answer = expo(a, num(b));
        const y0 = ys[0]!;
        const y1 = ys[1]!;
        return expressionProblem({
          prompt: t(
            `The table shows values of an exponential function $f(x) = a \\cdot b^{x}$. Find $f(x)$.${valueTable("f", xs, ys)}`,
            `下表给出指数函数 $f(x) = a \\cdot b^{x}$ 的一些值。求 $f(x)$。${valueTable("f", xs, ys)}`,
          ),
          answer,
          prefix: "f(x) =",
          wrong: [expo(b, String(a)), linear(y1.sub(y0), y0.sub(y1.sub(y0).mul(Q.of(s)))), expo(y0, num(b)), expo(a, num(Q.one.div(b)))],
          solution: t(
            `**Step 1:** the base. Each time $x$ goes up by $1$ the value is multiplied by $b = \\frac{${y1.toLatex()}}{${y0.toLatex()}} = ${b.toLatex()}$.\n\n**Step 2:** the coefficient. ${s <= 0 ? `The table shows $f(0) = ${a}$, so $a = ${a}$.` : `Step back from $f(1) = ${b.mul(Q.of(a)).toLatex()}$ to $x = 0$ by dividing by $${b.toLatex()}$: $a = f(0) = ${a}$.`} So${steps(`f(x) = ${answer}`)}**Check.** $f(${xs[3]}) = ${a === 1 ? "" : `${a} \\cdot `}${bracket(b)}^{${xs[3]}} = ${ys[3]!.toLatex()}$, the last value in the table.`,
            `**第一步：** 底数。$x$ 每增加 $1$，函数值乘以 $b = \\frac{${y1.toLatex()}}{${y0.toLatex()}} = ${b.toLatex()}$。\n\n**第二步：** 系数。${s <= 0 ? `表中给出 $f(0) = ${a}$，所以 $a = ${a}$。` : `从 $f(1) = ${b.mul(Q.of(a)).toLatex()}$ 往回推到 $x = 0$，除以 $${b.toLatex()}$：$a = f(0) = ${a}$。`}所以${steps(`f(x) = ${answer}`)}**检验。** $f(${xs[3]}) = ${a === 1 ? "" : `${a} \\cdot `}${bracket(b)}^{${xs[3]}} = ${ys[3]!.toLatex()}$，正是表中最后一个值。`,
          ),
        });
      },
    },
  ],
};

export const modelingExponentialGrowthWithFunctions: TopicDef = {
  id: "modeling-exponential-growth-with-functions",
  title: t("Modeling Exponential Growth With Functions", "用函数表示指数增长"),
  summary: t(
    "Write and evaluate functions $P(t) = a(1 + r)^{t}$ and doubling models for quantities that grow exponentially.",
    "为指数增长的量写出并计算函数 $P(t) = a(1 + r)^{t}$ 以及翻倍模型。",
  ),
  prerequisites: ["exponential-functions", "creating-exponential-growth-expressions"],
  encompasses: [
    { topic: "creating-exponential-growth-expressions", weight: 0.5 },
    { topic: "exponential-functions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSF.LE.A.1.C"],
  intro: t(
    `We can write expressions such as $5000(1.04)^{t}$ and evaluate exponential functions $f(x) = a \\cdot b^{x}$. A **growth model** joins the two: a function of time that tells, for every $t$, how large a growing quantity is, so that we can ask for its value at any time we like.

A town of $5000$ people growing by $4\\%$ a year has

$$P(t) = 5000(1.04)^{t}$$

people after $t$ years. Then $P(1) = 5200$, $P(2) = 5408$, and $P(10) = 5000(1.04)^{10} \\approx 7401$. The yearly increase itself grows, $200$ in the first year and $208$ in the second, because $4\\%$ is taken of a larger town each time. When a quantity doubles every few hours instead, the exponent counts the doublings.

In this lesson we write growth models from a rate or from two values, evaluate them, and work with doubling times.`,
    `我们会写 $5000(1.04)^{t}$ 这样的表达式，也会计算指数函数 $f(x) = a \\cdot b^{x}$ 的值。**增长模型**把两者结合起来：它是时间的函数，对每个 $t$ 给出增长的量有多大，于是我们可以求它在任何时刻的值。

一个 $5000$ 人的小镇，人口每年增长 $4\\%$，$t$ 年后的人口为

$$P(t) = 5000(1.04)^{t}$$

于是 $P(1) = 5200$，$P(2) = 5408$，$P(10) = 5000(1.04)^{10} \\approx 7401$。每年增加的人数本身也在增长，第一年 $200$，第二年 $208$，因为每次都是对更大的小镇取 $4\\%$。如果一个量每隔几小时翻一番，指数就数翻倍的次数。

这节课根据增长率或两个值写出增长模型，计算它的值，并处理翻倍时间。`,
  ),
  knowledgePoints: [
    {
      id: "writing-growth-functions",
      title: t("Writing growth functions", "写出增长函数"),
      explanation: t(
        "A quantity that starts at $a$ and grows by the same percent $r$ every period is modeled by\n\n$$P(t) = a(1 + r)^{t}$$\n\nwhere $t$ counts the periods. When two values one period apart are given instead of the rate, their ratio is the growth factor: from $2000$ to $2100$ the factor is $\\frac{2100}{2000} = 1.05$, so $P(t) = 2000(1.05)^{t}$.\n\n> **Watch out.** The base is the factor $1 + r$, not the rate $r$ and not $1 - r$, which would be decay. And $2000 + 100t$ adds the same amount every period: that is a linear model, not growth by a percent.",
        "一个量起初为 $a$，每期按相同的百分率 $r$ 增长，可以用\n\n$$P(t) = a(1 + r)^{t}$$\n\n表示，其中 $t$ 是期数。如果给出的是相隔一期的两个值而不是增长率，它们的比就是增长因子：从 $2000$ 到 $2100$，因子是 $\\frac{2100}{2000} = 1.05$，所以 $P(t) = 2000(1.05)^{t}$。\n\n> **注意。** 底数是因子 $1 + r$，不是增长率 $r$，也不是表示衰减的 $1 - r$。$2000 + 100t$ 每期增加相同的量，那是线性模型，不是按百分率增长。",
      ),
      generate: (rng) => writeModelProblem(rng, "growth"),
    },
    {
      id: "evaluating-growth-models",
      title: t("Evaluating growth models", "计算增长模型的值"),
      explanation: t(
        "To find the value after $n$ periods, substitute $t = n$ and compute the power before multiplying:\n\n$$P(3) = 1500(1.04)^{3} = 1500 \\cdot 1.124864 = 1687.296 \\approx 1687$$\n\nThis is more than $1500 + 3 \\cdot 60 = 1680$, which would be growth by the same amount each year: the growth itself grows.\n\n> **Watch out.** Adding $3 \\cdot 4\\% = 12\\%$ once ignores the compounding. Raise the factor to the power $n$ exactly, not $n - 1$, and do not multiply $1500 \\cdot 1.04$ by $3$ instead of raising $1.04$ to the third power.",
        "求 $n$ 期后的值，就把 $t = n$ 代入，先算乘方再相乘：\n\n$$P(3) = 1500(1.04)^{3} = 1500 \\cdot 1.124864 = 1687.296 \\approx 1687$$\n\n这比 $1500 + 3 \\cdot 60 = 1680$ 多；后者是每年增加相同数量的情形。指数增长中，增加的量本身也在增长。\n\n> **注意。** 一次加上 $3 \\cdot 4\\% = 12\\%$ 忽略了复利。因子的指数正好是 $n$，不是 $n - 1$；也不要把 $1500 \\cdot 1.04$ 乘以 $3$ 来代替 $1.04$ 的三次方。",
      ),
      generate: (rng) => evaluateModelProblem(rng, "growth"),
    },
    {
      id: "doubling-time-models",
      title: t("Doubling time", "翻倍时间"),
      explanation: t(
        "If a quantity doubles every $d$ hours, then in $t$ hours it doubles $\\frac{t}{d}$ times:\n\n$$N(t) = a(2)^{\\frac{t}{d}}$$\n\n$300$ bacteria that double every $4$ hours number $300 \\cdot 2^{\\frac{12}{4}} = 300 \\cdot 2^{3} = 2400$ after $12$ hours. Tripling works the same way with base $3$.\n\n> **Watch out.** The exponent counts doublings, not hours: $2^{12}$ would double every hour. Doubling three times multiplies by $2^{3} = 8$, not by $2 \\cdot 3 = 6$; and count the doublings exactly, $\\frac{12}{4} = 3$, not one fewer or one more.",
        "如果一个量每 $d$ 小时翻一番，那么 $t$ 小时内它翻了 $\\frac{t}{d}$ 番：\n\n$$N(t) = a(2)^{\\frac{t}{d}}$$\n\n$300$ 个细菌每 $4$ 小时翻一番，$12$ 小时后有 $300 \\cdot 2^{\\frac{12}{4}} = 300 \\cdot 2^{3} = 2400$ 个。变为原来的 $3$ 倍时同理，底数为 $3$。\n\n> **注意。** 指数数的是翻倍的次数，不是小时数：$2^{12}$ 表示每小时翻一番。翻三番是乘以 $2^{3} = 8$，不是乘以 $2 \\cdot 3 = 6$；翻倍次数要数准，$\\frac{12}{4} = 3$，不要少一次或多一次。",
      ),
      generate(rng) {
        const ctx = rng.pick(growthPeriodics);
        const m = rng.pick(multipliers.slice(0, 3));
        const d = rng.int(2, 6);
        const k = rng.int(2, m.k === 2 ? 5 : 4);
        const a = rng.int(2, 50) * 10;
        const x = k * d;
        const setup = ctx.setup(String(a), t(`${m.words.en} ${every(d, ctx).en}`, `${every(d, ctx)["zh-CN"]}${m.words["zh-CN"]}`));
        const ask = ctx.ask(x);
        const value = a * m.k ** k;
        return numberProblem({
          prompt: t(`${setup.en} ${ask.en}`, `${setup["zh-CN"]}${ask["zh-CN"]}`),
          answer: value,
          wrong: [...(x <= 12 ? [Q.of(a).mul(Q.of(m.k).pow(x))] : []), a * m.k * k, a * m.k ** (k - 1), a * m.k ** (k + 1)],
          solution: t(
            `**Step 1:** count the periods. One multiplication by $${m.k}$ happens every $${d}$ ${ctx.units.en}, so in $${x}$ ${ctx.units.en} there are $\\frac{${x}}{${d}} = ${k}$ of them.\n\n**Step 2:** multiply the start by $${m.k}$ that many times, computing the power first:${steps(`${a} \\cdot ${m.k}^{${k}} = ${a} \\cdot ${m.k ** k} = ${value}`)}**Check.** Step by step: $${Array.from({ length: k + 1 }, (_, i) => a * m.k ** i).join(" \\to ")}$, which is $${k}$ multiplications by $${m.k}$.`,
            `**第一步：** 数期数。每 $${d}$ ${ctx.units["zh-CN"]}乘一次 $${m.k}$，所以 $${x}$ ${ctx.units["zh-CN"]}内共 $\\frac{${x}}{${d}} = ${k}$ 次。\n\n**第二步：** 起始量乘以 $${m.k}$ 这么多次，先算乘方：${steps(`${a} \\cdot ${m.k}^{${k}} = ${a} \\cdot ${m.k ** k} = ${value}`)}**检验。** 逐步计算：$${Array.from({ length: k + 1 }, (_, i) => a * m.k ** i).join(" \\to ")}$，正好乘了 $${k}$ 次 $${m.k}$。`,
          ),
        });
      },
    },
  ],
};

export const interpretingExponentialGrowth: TopicDef = {
  id: "interpreting-exponential-growth",
  title: t("Interpreting Exponential Growth", "解读指数增长"),
  summary: t(
    "Read the starting value, the growth factor and the percent rate from a growth model, and find the total growth over several periods.",
    "从增长模型中读出起始值、增长因子和增长率，并求若干期内的总增长率。",
  ),
  prerequisites: ["modeling-exponential-growth-with-functions"],
  encompasses: [{ topic: "percent-change", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSF.LE.B.5", "CCSS.HSF.IF.C.8.B"],
  intro: t(
    `We can write a growth model such as $V(t) = 1200(1.08)^{t}$ and evaluate it. Reading it is the other direction: every number in the formula says something about the quantity, and a statement about the quantity can be checked against the formula.

In $V(t) = 1200(1.08)^{t}$, put $t = 0$: $V(0) = 1200 \\cdot 1 = 1200$, so the coefficient is the **starting value**. From one year to the next the value is multiplied by $1.08$, the **growth factor**, and since $1.08 = 1 + 0.08$ the value grows by $8\\%$ a year. Over $2$ years the factor is $1.08^{2} = 1.1664$, a total growth of $16.64\\%$, a little more than $2 \\cdot 8\\% = 16\\%$.

In this lesson we read the starting value, the growth factor and the percent rate from a model, judge statements about it, and find the total growth over several periods.`,
    `我们会写出 $V(t) = 1200(1.08)^{t}$ 这样的增长模型并计算它的值。解读是反方向的：公式中的每个数都说明了这个量的某件事，而关于这个量的说法也可以对照公式来检验。

在 $V(t) = 1200(1.08)^{t}$ 中令 $t = 0$：$V(0) = 1200 \\cdot 1 = 1200$，所以系数是**起始值**。每过一年，数值乘以 $1.08$，即**增长因子**；由于 $1.08 = 1 + 0.08$，数值每年增长 $8\\%$。$2$ 年内的因子是 $1.08^{2} = 1.1664$，总增长率为 $16.64\\%$，比 $2 \\cdot 8\\% = 16\\%$ 略多。

这节课从模型中读出起始值、增长因子和增长率，判断关于模型的说法，并求若干期内的总增长率。`,
  ),
  knowledgePoints: [
    {
      id: "starting-value-and-growth-factor",
      title: t("Starting value and growth factor", "起始值与增长因子"),
      explanation: t(
        "In $P(t) = a \\cdot b^{t}$:\n\n- $a = P(0)$ is the **starting value**, since $b^{0} = 1$;\n- $b$ is the **growth factor**, the number the quantity is multiplied by each period.\n\nFor $P(t) = 350(1.12)^{t}$, the quantity starts at $350$ and is multiplied by $1.12$ each period. After one period it is $350 \\cdot 1.12 = 392$, which is not the starting value.\n\n> **Watch out.** The starting value is the coefficient $a$, not the value after one period, and the growth factor is the whole base $1.12$, not the rate $0.12$ or $12$.",
        "在 $P(t) = a \\cdot b^{t}$ 中：\n\n- $a = P(0)$ 是**起始值**，因为 $b^{0} = 1$；\n- $b$ 是**增长因子**，即这个量每期所乘的数。\n\n对 $P(t) = 350(1.12)^{t}$，这个量起初为 $350$，每期乘以 $1.12$。一期后为 $350 \\cdot 1.12 = 392$，它不是起始值。\n\n> **注意。** 起始值是系数 $a$，不是一期后的值；增长因子是整个底数 $1.12$，不是增长率 $0.12$ 或 $12$。",
      ),
      generate(rng) {
        const { c, r, f } = draw(rng, "growth");
        const p = start(rng);
        const model = modelText(c, expo(p, dec(f), "t"));
        if (rng.bool()) {
          return numberProblem({
            prompt: t(`${model.en} What was ${c.noun.en} at the start?`, `${model["zh-CN"]}起初${c.noun["zh-CN"]}是多少？`),
            answer: p,
            wrong: [f, f.mul(Q.of(p)), r],
            solution: t(
              `At the start no time has passed, so $t = 0$, and any nonzero number to the power $0$ is $1$:${steps(`${c.name}(0) = ${p}(${dec(f)})^{0} = ${p} \\cdot 1 = ${p}`)}The starting value is the coefficient in front of the power.\n\n**Check.** One ${c.per.en} later the model gives $${c.name}(1) = ${p} \\cdot ${dec(f)} = ${dec(f.mul(Q.of(p)))}$, which is larger than $${p}$, as a growing quantity should be after it starts.`,
              `起初还没有经过时间，所以 $t = 0$，而任何非零数的 $0$ 次方都是 $1$：${steps(`${c.name}(0) = ${p}(${dec(f)})^{0} = ${p} \\cdot 1 = ${p}`)}起始值就是乘方前面的系数。\n\n**检验。** 一${c.per["zh-CN"]}后模型给出 $${c.name}(1) = ${p} \\cdot ${dec(f)} = ${dec(f.mul(Q.of(p)))}$，比 $${p}$ 大，正符合一个从起始值开始增长的量。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `${model.en} By what number is ${c.noun.en} multiplied each ${c.per.en}?`,
            `${model["zh-CN"]}${c.noun["zh-CN"]}每${c.per["zh-CN"]}乘以多少？`,
          ),
          answer: f,
          form: "decimal",
          wrong: [Q.of(r, 100), Q.of(r), Q.of(p)],
          solution: t(
            `Raising $t$ by $1$ adds one more factor to the power $(${dec(f)})^{t}$, so each ${c.per.en} ${c.noun.en} is multiplied by the base. The growth factor is $${dec(f)}$; the coefficient $${p}$ is only the starting value.\n\n**Check.** $${c.name}(0) = ${p}$ and $${c.name}(1) = ${p} \\cdot ${dec(f)} = ${dec(f.mul(Q.of(p)))}$, and $\\frac{${dec(f.mul(Q.of(p)))}}{${p}} = ${dec(f)}$.`,
            `$t$ 增加 $1$，乘方 $(${dec(f)})^{t}$ 就多一个因子，所以${c.noun["zh-CN"]}每${c.per["zh-CN"]}乘以底数。增长因子是 $${dec(f)}$；系数 $${p}$ 只是起始值。\n\n**检验。** $${c.name}(0) = ${p}$，$${c.name}(1) = ${p} \\cdot ${dec(f)} = ${dec(f.mul(Q.of(p)))}$，而 $\\frac{${dec(f.mul(Q.of(p)))}}{${p}} = ${dec(f)}$。`,
          ),
        });
      },
    },
    {
      id: "percent-growth-rate",
      title: t("The percent growth rate", "增长率"),
      explanation: t(
        "The growth factor is $b = 1 + r$, so the percent growth rate is $r = b - 1$, written as a percent. For $P(t) = 800(1.07)^{t}$ the rate is $0.07 = 7\\%$ per period; for $P(t) = 50(1.5)^{t}$ it is $50\\%$; for $P(t) = 9(2)^{t}$ it is $100\\%$ (doubling). The rate is not $107\\%$: that is the new amount as a percent of the old one.\n\n> **Watch out.** Subtract $1$ before writing the percent. The base $1.07$ is not a rate of $107\\%$, and the decimal $0.07$ is $7\\%$, not $0.07\\%$.",
        "增长因子 $b = 1 + r$，所以增长率 $r = b - 1$，写成百分数。对 $P(t) = 800(1.07)^{t}$，增长率为每期 $0.07 = 7\\%$；对 $P(t) = 50(1.5)^{t}$ 为 $50\\%$；对 $P(t) = 9(2)^{t}$ 为 $100\\%$（翻一番）。增长率不是 $107\\%$：那是新量占原量的百分比。\n\n> **注意。** 先减去 $1$ 再写成百分数。底数 $1.07$ 不表示增长率 $107\\%$，小数 $0.07$ 是 $7\\%$，不是 $0.07\\%$。",
      ),
      generate: (rng) => percentRateProblem(rng, "growth"),
    },
    {
      id: "interpreting-growth-statements",
      title: t("Interpreting the model", "解读模型"),
      explanation: t(
        "For $V(t) = 1200(1.08)^{t}$, where $t$ is in years:\n\n- the value starts at $1200$;\n- it grows by $8\\%$ each year.\n\nIt does **not** grow by $8$ or by $96$ dollars every year: $8\\%$ of a growing value is a growing amount. And it does not grow by $108\\%$, which would more than double it.\n\n> **Watch out.** A percent rate describes a growing amount, not a fixed one. Statements that add the same amount every year, or that use the whole base $1.08$ as the rate, are false.",
        "对 $V(t) = 1200(1.08)^{t}$（$t$ 以年为单位）：\n\n- 起始值为 $1200$；\n- 每年增长 $8\\%$。\n\n它**不是**每年增加 $8$ 元或 $96$ 元：不断增长的值的 $8\\%$ 也在不断增长。它也不是每年增长 $108\\%$，那会使它变为原来的两倍多。\n\n> **注意。** 百分率描述的是不断变化的数量，不是固定的数量。说每年增加相同数量的说法，或把整个底数 $1.08$ 当作增长率的说法，都是错的。",
      ),
      generate: (rng) => statementProblem(rng, "growth"),
    },
    {
      id: "growth-over-several-periods",
      title: t("Growth over several periods", "若干期内的增长"),
      explanation: t(
        "Over $n$ periods the quantity is multiplied by $b^{n}$. For a growth of $10\\%$ a year, in $2$ years the factor is $1.1^{2} = 1.21$: the total growth is $21\\%$, not $20\\%$, because the second year's $10\\%$ is taken of a larger amount.\n\n> **Watch out.** Do not multiply the rate by the number of periods. Raise the factor to the power $n$, then subtract $1$ to get the total growth.",
        "$n$ 期内这个量乘以 $b^{n}$。每年增长 $10\\%$，$2$ 年内的因子是 $1.1^{2} = 1.21$：总增长率是 $21\\%$ 而不是 $20\\%$，因为第二年的 $10\\%$ 是对更大的量取的。\n\n> **注意。** 不要把增长率乘以期数。应把因子取 $n$ 次方，再减去 $1$ 得到总增长率。",
      ),
      generate: (rng) => totalChangeProblem(rng, "growth"),
    },
  ],
};

export const solvingExponentialGrowthProblems: TopicDef = {
  id: "solving-exponential-growth-problems",
  title: t("Solving Exponential Growth Problems", "解指数增长问题"),
  summary: t(
    "Find the time, the starting value or the growth rate in exponential growth problems.",
    "在指数增长问题中求时间、起始值或增长率。",
  ),
  prerequisites: ["interpreting-exponential-growth", "solving-exponential-equations"],
  encompasses: [
    { topic: "modeling-exponential-growth-with-functions", weight: 0.4 },
    { topic: "solving-exponential-equations", weight: 0.3 },
    { topic: "square-roots-and-cube-roots", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSF.LE.A.2"],
  intro: t(
    `We can write a growth model $a \\cdot b^{t}$, read its starting value and factor, and solve exponential equations such as $3^{x} = 81$. Putting these together answers the questions a model is built for: when will the quantity reach a value, where did it start, and how fast is it growing.

Each question fills in all but one letter of $a \\cdot b^{t} = v$. For $300$ bacteria doubling every hour, the time to reach $4800$ comes from

$$300 \\cdot 2^{t} = 4800 \\implies 2^{t} = 16 = 2^{4} \\implies t = 4$$

If instead $v$ and $t$ are known, divide by $b^{t}$ to find $a$; if $a$, $v$ and $t$ are known, take a root to find $b$.

In this lesson we find the time, the starting value and the growth rate from the other numbers of a growth model.`,
    `我们会写出增长模型 $a \\cdot b^{t}$，读出它的起始值和因子，也会解 $3^{x} = 81$ 这样的指数方程。把它们结合起来，就能回答建立模型所要回答的问题：这个量何时达到某个值，它从多少开始，增长得有多快。

每个问题都是在 $a \\cdot b^{t} = v$ 中只留一个字母未知。$300$ 个细菌每小时翻一番，达到 $4800$ 个所需的时间由

$$300 \\cdot 2^{t} = 4800 \\implies 2^{t} = 16 = 2^{4} \\implies t = 4$$

求出。如果已知 $v$ 和 $t$，就除以 $b^{t}$ 求 $a$；如果已知 $a$、$v$ 和 $t$，就开方求 $b$。

这节课根据增长模型中的其他数，求时间、起始值和增长率。`,
  ),
  knowledgePoints: [
    {
      id: "finding-the-time",
      title: t("Finding the time", "求时间"),
      explanation: t(
        "To find when a quantity reaches a value, set the model equal to it and solve the exponential equation. $250$ bacteria doubling every $3$ hours reach $8000$ when\n\n$$250 \\cdot 2^{\\frac{t}{3}} = 8000 \\implies 2^{\\frac{t}{3}} = 32 = 2^{5} \\implies \\frac{t}{3} = 5 \\implies t = 15$$\n\nDivide by the starting value first; the number of doublings, $5$, is not yet the time.\n\n> **Watch out.** Two answers are tempting and wrong: the number of doublings itself, when each doubling takes more than one unit of time, and the quotient $\\frac{8000}{250} = 32$, which is the growth factor over the whole time. Multiply the number of doublings by the length of one doubling.",
        "求一个量何时达到某个值，就令模型等于这个值，解指数方程。$250$ 个细菌每 $3$ 小时翻一番，达到 $8000$ 个时\n\n$$250 \\cdot 2^{\\frac{t}{3}} = 8000 \\implies 2^{\\frac{t}{3}} = 32 = 2^{5} \\implies \\frac{t}{3} = 5 \\implies t = 15$$\n\n先除以起始值；翻番的次数 $5$ 还不是时间。\n\n> **注意。** 有两个诱人的错误答案：当每次翻番不止一个时间单位时，翻番的次数本身；以及商 $\\frac{8000}{250} = 32$，它是整段时间内的增长因子。要把翻番的次数乘以一次翻番所用的时间。",
      ),
      generate(rng) {
        const ctx = rng.pick(growthPeriodics);
        const m = rng.pick(multipliers.slice(0, 3));
        const d = rng.int(1, 6);
        const k = rng.int(2, m.k === 2 ? 6 : 4);
        const a = rng.int(2, 50) * 10;
        const v = a * m.k ** k;
        const setup = ctx.setup(String(a), t(`${m.words.en} ${every(d, ctx).en}`, `${every(d, ctx)["zh-CN"]}${m.words["zh-CN"]}`));
        const when = ctx.when(grouped(v));
        const ex = d === 1 ? "t" : `\\frac{t}{${d}}`;
        return numberProblem({
          prompt: t(`${setup.en} ${when.en}`, `${setup["zh-CN"]}${when["zh-CN"]}`),
          answer: k * d,
          wrong: [k, m.k ** k, (k + 1) * d, (k - 1) * d],
          solution: t(
            `The quantity is multiplied by $${m.k}$ once ${every(d, ctx).en}, so after $t$ ${ctx.units.en} it is $${a} \\cdot ${m.k}^{${ex}}$${d === 1 ? "" : `, where $\\frac{t}{${d}}$ counts the periods`}. Set this equal to $${grouped(v)}$.\n\n**Step 1:** divide both sides by the starting value $${a}$ and write the quotient as a power of $${m.k}$:${steps(`${m.k}^{${ex}} = \\frac{${grouped(v)}}{${a}} = ${m.k ** k} = ${m.k}^{${k}}`)}**Step 2:** the bases are equal, so the exponents are equal:${steps(d === 1 ? `t = ${k}` : `\\frac{t}{${d}} = ${k} \\implies t = ${k} \\cdot ${d} = ${k * d}`)}**Check.** In $${k * d}$ ${ctx.units.en} there are $${k}$ periods, and $${a} \\cdot ${m.k}^{${k}} = ${a} \\cdot ${m.k ** k} = ${grouped(v)}$.`,
            `这个量${every(d, ctx)["zh-CN"]}乘以一次 $${m.k}$，所以 $t$ ${ctx.units["zh-CN"]}后它是 $${a} \\cdot ${m.k}^{${ex}}$${d === 1 ? "" : `，其中 $\\frac{t}{${d}}$ 是期数`}。令它等于 $${grouped(v)}$。\n\n**第一步：** 两边同时除以起始值 $${a}$，并把商写成 $${m.k}$ 的幂：${steps(`${m.k}^{${ex}} = \\frac{${grouped(v)}}{${a}} = ${m.k ** k} = ${m.k}^{${k}}`)}**第二步：** 底数相同，所以指数相等：${steps(d === 1 ? `t = ${k}` : `\\frac{t}{${d}} = ${k} \\implies t = ${k} \\cdot ${d} = ${k * d}`)}**检验。** $${k * d}$ ${ctx.units["zh-CN"]}内有 $${k}$ 期，而 $${a} \\cdot ${m.k}^{${k}} = ${a} \\cdot ${m.k ** k} = ${grouped(v)}$。`,
          ),
        });
      },
    },
    {
      id: "finding-the-starting-value",
      title: t("Finding the starting value", "求起始值"),
      explanation: t(
        "If the value after $n$ periods and the rate are known, the starting value $a$ satisfies $a \\cdot b^{n} = \\text{value}$, so divide by $b^{n}$:\n\n$$a(1.1)^{3} = 1331 \\implies a = \\frac{1331}{1.331} = 1000$$\n\nDividing by $1 + 3 \\cdot 0.1 = 1.3$ instead would treat the growth as if it were the same amount each period.\n\n> **Watch out.** Divide by the factor raised to the number of periods, $b^{n}$, not by $b$ once, by $1 + nr$, or by the value itself. A starting value larger than the later value means the division went the wrong way.",
        "已知 $n$ 期后的值和增长率时，起始值 $a$ 满足 $a \\cdot b^{n} = \\text{该值}$，所以除以 $b^{n}$：\n\n$$a(1.1)^{3} = 1331 \\implies a = \\frac{1331}{1.331} = 1000$$\n\n如果改为除以 $1 + 3 \\cdot 0.1 = 1.3$，就把增长当成了每期增加相同的数量。\n\n> **注意。** 要除以因子的期数次方 $b^{n}$，不是只除以一次 $b$，不是除以 $1 + nr$，也不是除以该值本身。如果求出的起始值比后来的值还大，说明除法做反了。",
      ),
      generate: (rng) => initialValueProblem(rng, "growth"),
    },
    {
      id: "finding-the-growth-rate",
      title: t("Finding the growth rate", "求增长率"),
      explanation: t(
        "If a quantity grows from $a$ to $v$ in $2$ periods at a constant rate, its factor $b$ satisfies $a \\cdot b^{2} = v$, so $b = \\sqrt{\\frac{v}{a}}$:\n\n$$5000b^{2} = 6050 \\implies b^{2} = 1.21 \\implies b = 1.1$$\n\nThe rate is $10\\%$ per period. The total growth, $21\\%$, is not the rate per period.\n\n> **Watch out.** Take the square root of the ratio $\\frac{v}{a}$ for two periods, and subtract $1$ from the factor before writing the percent. Halving the total growth, $\\frac{21\\%}{2}$, gives a rate that is too large.",
        "如果一个量按固定增长率在 $2$ 期内从 $a$ 增长到 $v$，它的因子 $b$ 满足 $a \\cdot b^{2} = v$，所以 $b = \\sqrt{\\frac{v}{a}}$：\n\n$$5000b^{2} = 6050 \\implies b^{2} = 1.21 \\implies b = 1.1$$\n\n增长率为每期 $10\\%$。总增长率 $21\\%$ 不是每期的增长率。\n\n> **注意。** 两期时要对比值 $\\frac{v}{a}$ 开平方，并在写成百分数前从因子中减去 $1$。把总增长率减半，即 $\\frac{21\\%}{2}$，得到的增长率偏大。",
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      generate: (rng) => rateFromValuesProblem(rng, "growth"),
    },
  ],
};

export const modelingExponentialDecayWithFunctions: TopicDef = {
  id: "modeling-exponential-decay-with-functions",
  title: t("Modeling Exponential Decay With Functions", "用函数表示指数衰减"),
  summary: t(
    "Write and evaluate functions $A(t) = a(1 - r)^{t}$ and half-life models for quantities that decay exponentially.",
    "为指数衰减的量写出并计算函数 $A(t) = a(1 - r)^{t}$ 以及半衰期模型。",
  ),
  prerequisites: ["modeling-exponential-growth-with-functions", "creating-exponential-decay-expressions"],
  encompasses: [
    { topic: "creating-exponential-decay-expressions", weight: 0.5 },
    { topic: "exponential-functions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSF.LE.A.1.C"],
  intro: t(
    `We can write growth models $a(1 + r)^{t}$ and decay expressions such as $800(0.9)^{t}$. A **decay model** is the same kind of function for a quantity that shrinks by the same percent every period: the value of a car, a medicine in the blood, a radioactive substance.

A car bought for $20000$ dollars that loses $15\\%$ of its value each year keeps $85\\%$, so

$$V(t) = 20000(0.85)^{t}$$

Then $V(1) = 17000$ and $V(2) = 14450$. The yearly loss shrinks, $3000$ in the first year and $2550$ in the second, because $15\\%$ is taken of a smaller value each time. A substance that halves every few years has the factor $\\frac{1}{2}$, and the exponent counts the half-lives.

In this lesson we write decay models from a rate or from two values, evaluate them, and work with half-lives.`,
    `我们会写出增长模型 $a(1 + r)^{t}$，也会写 $800(0.9)^{t}$ 这样的衰减表达式。**衰减模型**是同一类函数，用于每期按相同百分率减少的量：汽车的价值、血液中的药物、放射性物质。

一辆 $20000$ 元买来的汽车，每年损失价值的 $15\\%$，就保留 $85\\%$，所以

$$V(t) = 20000(0.85)^{t}$$

于是 $V(1) = 17000$，$V(2) = 14450$。每年损失的价值越来越小，第一年 $3000$，第二年 $2550$，因为每次都是对更小的值取 $15\\%$。每隔几年减半的物质因子是 $\\frac{1}{2}$，指数数的是半衰期的个数。

这节课根据衰减率或两个值写出衰减模型，计算它的值，并处理半衰期。`,
  ),
  knowledgePoints: [
    {
      id: "writing-decay-functions",
      title: t("Writing decay functions", "写出衰减函数"),
      explanation: t(
        "A quantity that starts at $a$ and decreases by the same percent $r$ every period is modeled by\n\n$$A(t) = a(1 - r)^{t}$$\n\nWhen two values one period apart are given, their ratio is the decay factor: from $800$ to $720$ it is $\\frac{720}{800} = 0.9$, so $A(t) = 800(0.9)^{t}$, a decrease of $10\\%$ per period.\n\n> **Watch out.** The base is what **remains**, $1 - r$, not the rate $r$ itself: a decrease of $10\\%$ gives the base $0.9$, not $0.1$, and $1 + r$ would be growth.",
        "一个量起初为 $a$，每期按相同的百分率 $r$ 减少，可以用\n\n$$A(t) = a(1 - r)^{t}$$\n\n表示。如果给出的是相隔一期的两个值，它们的比就是衰减因子：从 $800$ 到 $720$，因子是 $\\frac{720}{800} = 0.9$，所以 $A(t) = 800(0.9)^{t}$，即每期减少 $10\\%$。\n\n> **注意。** 底数是**剩下**的部分 $1 - r$，而不是衰减率 $r$ 本身：减少 $10\\%$ 时底数是 $0.9$，不是 $0.1$；而 $1 + r$ 表示增长。",
      ),
      generate: (rng) => writeModelProblem(rng, "decay"),
    },
    {
      id: "evaluating-decay-models",
      title: t("Evaluating decay models", "计算衰减模型的值"),
      explanation: t(
        "Substitute the number of periods and compute the power first:\n\n$$V(2) = 20000(0.85)^{2} = 20000 \\cdot 0.7225 = 14450$$\n\nThis is more than $20000 - 2 \\cdot 3000 = 14000$: each year's $15\\%$ is taken of a smaller value, so the losses shrink.\n\n> **Watch out.** Compute the power before multiplying by the coefficient, and do not subtract the first period's loss every period: that treats the decay as linear.",
        "代入期数，先算乘方：\n\n$$V(2) = 20000(0.85)^{2} = 20000 \\cdot 0.7225 = 14450$$\n\n这比 $20000 - 2 \\cdot 3000 = 14000$ 多：每年的 $15\\%$ 是对更小的值取的，所以减少的量越来越小。\n\n> **注意。** 先算乘方，再乘以系数；也不要每期都减去第一期的减少量，那是把衰减当成了线性的。",
      ),
      generate: (rng) => evaluateModelProblem(rng, "decay"),
    },
    {
      id: "half-life-models",
      title: t("Half-life", "半衰期"),
      explanation: halfLifeExplanation,
      generate: halfLifeProblem,
    },
  ],
};

export const interpretingExponentialDecay: TopicDef = {
  id: "interpreting-exponential-decay",
  title: t("Interpreting Exponential Decay", "解读指数衰减"),
  summary: t(
    "Read the percent rate of a decay model, tell growth from decay, and find the total decrease over several periods.",
    "读出衰减模型的衰减率，区分增长与衰减，并求若干期内的总减少率。",
  ),
  prerequisites: ["modeling-exponential-decay-with-functions", "interpreting-exponential-growth"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSF.LE.B.5", "CCSS.HSF.IF.C.8.B"],
  intro: t(
    `We can read a growth model: the coefficient is the starting value, the base is the factor, and the base minus $1$ is the percent rate. A decay model is read the same way, with one change: the base is less than $1$, and the rate is how far it falls short of $1$.

In $N(t) = 5000(0.9)^{t}$ the number starts at $N(0) = 5000$ and is multiplied by $0.9$ each year. Since $0.9 = 1 - 0.1$, it loses $10\\%$ a year and keeps $90\\%$. Over $2$ years the factor is $0.9^{2} = 0.81$, so $81\\%$ remains, a total decrease of $19\\%$, a little less than $2 \\cdot 10\\% = 20\\%$.

In this lesson we read the decay rate, tell growth from decay by the base, judge statements about decay models, and find the total decrease over several periods.`,
    `我们会解读增长模型：系数是起始值，底数是因子，底数减去 $1$ 就是增长率。衰减模型的读法相同，只有一处不同：底数小于 $1$，衰减率是它比 $1$ 少多少。

在 $N(t) = 5000(0.9)^{t}$ 中，数量起初为 $N(0) = 5000$，每年乘以 $0.9$。由于 $0.9 = 1 - 0.1$，它每年减少 $10\\%$，保留 $90\\%$。$2$ 年内的因子是 $0.9^{2} = 0.81$，所以剩下 $81\\%$，总共减少 $19\\%$，比 $2 \\cdot 10\\% = 20\\%$ 略少。

这节课读出衰减率，根据底数区分增长与衰减，判断关于衰减模型的说法，并求若干期内的总减少率。`,
  ),
  knowledgePoints: [
    {
      id: "percent-decay-rate",
      title: t("The percent decay rate", "衰减率"),
      explanation: t(
        "The decay factor is $b = 1 - r$, so the percent decay rate is $r = 1 - b$. For $V(t) = 24000(0.85)^{t}$ the value decreases by $1 - 0.85 = 0.15 = 15\\%$ each period. It does not decrease by $85\\%$: $85\\%$ is the part that **remains**.\n\n> **Watch out.** Subtract the base from $1$ before writing the percent. Reading $0.85$ as $85\\%$ gives what is kept, not what is lost, and $0.15$ is $15\\%$, not $0.15\\%$.",
        "衰减因子 $b = 1 - r$，所以衰减率 $r = 1 - b$。对 $V(t) = 24000(0.85)^{t}$，数值每期减少 $1 - 0.85 = 0.15 = 15\\%$。它不是减少 $85\\%$：$85\\%$ 是**剩下**的部分。\n\n> **注意。** 先用 $1$ 减去底数，再写成百分数。把 $0.85$ 读成 $85\\%$ 得到的是保留的部分，不是减少的部分；$0.15$ 是 $15\\%$，不是 $0.15\\%$。",
      ),
      generate: (rng) => percentRateProblem(rng, "decay"),
    },
    {
      id: "growth-or-decay",
      title: t("Growth or decay?", "增长还是衰减？"),
      explanation: t(
        "For $f(t) = a \\cdot b^{t}$ with $a > 0$:\n\n- if $b > 1$, $f$ models **growth** by $b - 1$ per period;\n- if $0 < b < 1$, $f$ models **decay** by $1 - b$ per period.\n\nSo $1.35^{t}$ is growth by $35\\%$ and $0.65^{t}$ is decay by $35\\%$.\n\n> **Watch out.** Decide by comparing the base with $1$, not by the size of its digits, and give the rate as the distance from $1$: $0.65^{t}$ is not decay by $65\\%$, which is the part that remains.",
        "对 $f(t) = a \\cdot b^{t}$（$a > 0$）：\n\n- 若 $b > 1$，$f$ 表示每期**增长** $b - 1$；\n- 若 $0 < b < 1$，$f$ 表示每期**衰减** $1 - b$。\n\n所以 $1.35^{t}$ 表示增长 $35\\%$，$0.65^{t}$ 表示衰减 $35\\%$。\n\n> **注意。** 要把底数与 $1$ 比较来判断，而不是看数字的大小；变化率是底数与 $1$ 的差：$0.65^{t}$ 不是衰减 $65\\%$，$65\\%$ 是剩下的部分。",
      ),
      generate(rng) {
        const kind: Kind = rng.bool() ? "growth" : "decay";
        let d: ReturnType<typeof draw>;
        do d = draw(rng, kind);
        while (d.r === 50);
        const { r, f } = d;
        const p = start(rng);
        const name = rng.pick(["f", "g", "A", "P"]);
        const big = Math.round(f.toNumber() * 100);
        const options = [
          kind === "growth"
            ? t(`Growth by $${r}\\%$ per period`, `每期增长 $${r}\\%$`)
            : t(`Decay by $${r}\\%$ per period`, `每期衰减 $${r}\\%$`),
          kind === "growth"
            ? t(`Decay by $${r}\\%$ per period`, `每期衰减 $${r}\\%$`)
            : t(`Growth by $${r}\\%$ per period`, `每期增长 $${r}\\%$`),
          kind === "growth"
            ? t(`Growth by $${big}\\%$ per period`, `每期增长 $${big}\\%$`)
            : t(`Decay by $${big}\\%$ per period`, `每期衰减 $${big}\\%$`),
          kind === "growth"
            ? t(`Decay by $${big}\\%$ per period`, `每期衰减 $${big}\\%$`)
            : t(`Growth by $${big}\\%$ per period`, `每期增长 $${big}\\%$`),
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        return choiceProblem({
          prompt: t(`Which describes $${name}(t) = ${expo(p, dec(f), "t")}$?`, `哪一项描述了 $${name}(t) = ${expo(p, dec(f), "t")}$？`),
          options: order.map((i) => options[i]!),
          correct: order.indexOf(0),
          solution: (() => {
            const next = dec(f.mul(Q.of(p)));
            const change = dec(f.sub(Q.one).abs().mul(Q.of(p)));
            const check = t(
              `\n\n**Check.** From $${name}(0) = ${p}$ one period gives $${name}(1) = ${p} \\cdot ${dec(f)} = ${next}$, a${kind === "growth" ? "n increase" : " decrease"} of $${change}$, and $\\frac{${change}}{${p}} = ${dec(Q.of(r, 100))} = ${r}\\%$. The number $${big}\\%$ is the new value as a percent of the old one, not the change.`,
              `\n\n**检验。** 从 $${name}(0) = ${p}$ 经过一期得 $${name}(1) = ${p} \\cdot ${dec(f)} = ${next}$，${kind === "growth" ? "增加" : "减少"}了 $${change}$，而 $\\frac{${change}}{${p}} = ${dec(Q.of(r, 100))} = ${r}\\%$。$${big}\\%$ 是新值占原值的百分比，不是变化率。`,
            );
            const lead =
              kind === "growth"
                ? t(
                    `Compare the base with $1$. The base $${dec(f)}$ is greater than $1$, so each period multiplies the amount by more than $1$: this is growth, by $${dec(f)} - 1 = ${dec(Q.of(r, 100))} = ${r}\\%$ per period.`,
                    `把底数与 $1$ 比较。底数 $${dec(f)}$ 大于 $1$，每期把数量乘以一个大于 $1$ 的数：所以是增长，每期增长 $${dec(f)} - 1 = ${dec(Q.of(r, 100))} = ${r}\\%$。`,
                  )
                : t(
                    `Compare the base with $1$. The base $${dec(f)}$ is between $0$ and $1$, so each period keeps only part of the amount: this is decay, by $1 - ${dec(f)} = ${dec(Q.of(r, 100))} = ${r}\\%$ per period.`,
                    `把底数与 $1$ 比较。底数 $${dec(f)}$ 在 $0$ 与 $1$ 之间，每期只保留数量的一部分：所以是衰减，每期衰减 $1 - ${dec(f)} = ${dec(Q.of(r, 100))} = ${r}\\%$。`,
                  );
            return t(lead.en + check.en, lead["zh-CN"] + check["zh-CN"]);
          })(),
        });
      },
    },
    {
      id: "interpreting-decay-statements",
      title: t("Interpreting the model", "解读模型"),
      explanation: t(
        "For $N(t) = 5000(0.9)^{t}$, where $t$ is in years: the number starts at $5000$ and decreases by $10\\%$ each year. It does not decrease by $500$ every year (that happens only in the first year), and it does not decrease by $90\\%$.\n\n> **Watch out.** The percent applies to a shrinking amount, so the yearly loss shrinks too. Statements that take away the same amount each year, or that read the base $0.9$ as the rate, are false.",
        "对 $N(t) = 5000(0.9)^{t}$（$t$ 以年为单位）：数量起初为 $5000$，每年减少 $10\\%$。它不是每年减少 $500$（只有第一年减少 $500$），也不是减少 $90\\%$。\n\n> **注意。** 百分率作用在不断减少的数量上，所以每年减少的量也在减少。说每年减去相同数量的说法，或把底数 $0.9$ 当作衰减率的说法，都是错的。",
      ),
      generate: (rng) => statementProblem(rng, "decay"),
    },
    {
      id: "decay-over-several-periods",
      title: t("Decay over several periods", "若干期内的衰减"),
      explanation: t(
        "Over $n$ periods the quantity is multiplied by $b^{n}$. Decreasing by $10\\%$ a year for $2$ years multiplies by $0.9^{2} = 0.81$: $81\\%$ remains, so the total decrease is $19\\%$, not $20\\%$.\n\n> **Watch out.** Do not multiply the rate by the number of periods, and do not stop at $b^{n}$: $0.81$ is the part that remains, so subtract it from $1$ to get the decrease.",
        "$n$ 期内这个量乘以 $b^{n}$。每年减少 $10\\%$，$2$ 年内乘以 $0.9^{2} = 0.81$：剩下 $81\\%$，所以总共减少 $19\\%$ 而不是 $20\\%$。\n\n> **注意。** 不要把衰减率乘以期数，也不要停在 $b^{n}$：$0.81$ 是剩下的部分，要用 $1$ 减去它才得到减少率。",
      ),
      generate: (rng) => totalChangeProblem(rng, "decay"),
    },
  ],
};

export const solvingExponentialDecayProblems: TopicDef = {
  id: "solving-exponential-decay-problems",
  title: t("Solving Exponential Decay Problems", "解指数衰减问题"),
  summary: t(
    "Find the time, the starting value or the decay rate in exponential decay problems, including half-lives.",
    "在指数衰减问题（包括半衰期问题）中求时间、起始值或衰减率。",
  ),
  prerequisites: ["interpreting-exponential-decay", "solving-exponential-growth-problems"],
  encompasses: [
    { topic: "modeling-exponential-decay-with-functions", weight: 0.4 },
    { topic: "solving-exponential-equations", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSF.LE.A.2"],
  intro: t(
    `We can solve growth problems by filling in all but one letter of $a \\cdot b^{t} = v$, and we can read decay models and half-lives. Decay problems are solved the same way, with a base less than $1$: when will the substance fall to a value, how much was there at the start, and how fast is it decaying.

For $640$ g of a substance with a half-life of $2$ days, the time to fall to $80$ g comes from

$$640\\left(\\frac{1}{2}\\right)^{\\frac{t}{2}} = 80 \\implies \\left(\\frac{1}{2}\\right)^{\\frac{t}{2}} = \\frac{1}{8} = \\left(\\frac{1}{2}\\right)^{3} \\implies t = 6$$

Halving three times takes three half-lives, $3 \\cdot 2 = 6$ days: $640 \\to 320 \\to 160 \\to 80$.

In this lesson we find the time from a half-life, the starting value before a decay, and the decay rate from two values.`,
    `我们会在 $a \\cdot b^{t} = v$ 中只留一个字母未知来解增长问题，也会解读衰减模型和半衰期。衰减问题的解法相同，只是底数小于 $1$：物质何时减少到某个值，起初有多少，衰减得有多快。

$640$ 克半衰期为 $2$ 天的物质，减少到 $80$ 克所需的时间由

$$640\\left(\\frac{1}{2}\\right)^{\\frac{t}{2}} = 80 \\implies \\left(\\frac{1}{2}\\right)^{\\frac{t}{2}} = \\frac{1}{8} = \\left(\\frac{1}{2}\\right)^{3} \\implies t = 6$$

求出。减半三次需要三个半衰期，即 $3 \\cdot 2 = 6$ 天：$640 \\to 320 \\to 160 \\to 80$。

这节课由半衰期求时间，求衰减前的起始值，并由两个值求衰减率。`,
  ),
  knowledgePoints: [
    {
      id: "half-life-time",
      title: t("Time from a half-life", "由半衰期求时间"),
      explanation: t(
        "To find when $a$ decays to a value with half-life $h$, solve $a\\left(\\frac{1}{2}\\right)^{\\frac{t}{h}} = \\text{value}$. For $800$ g with a half-life of $3$ days decaying to $50$ g:\n\n$$\\left(\\frac{1}{2}\\right)^{\\frac{t}{3}} = \\frac{50}{800} = \\frac{1}{16} = \\left(\\frac{1}{2}\\right)^{4} \\implies \\frac{t}{3} = 4 \\implies t = 12$$\n\nThe $4$ counts half-lives; multiply by the half-life to get the time.\n\n> **Watch out.** Neither the number of half-lives, $4$, nor the ratio $16$ is the time. And the amount does not fall at a steady rate: taking away half the start each half-life would empty it after only $2$.",
        "半衰期为 $h$ 时，求 $a$ 何时衰减到某个值，就解 $a\\left(\\frac{1}{2}\\right)^{\\frac{t}{h}} = \\text{该值}$。$800$ 克、半衰期 $3$ 天的物质衰减到 $50$ 克：\n\n$$\\left(\\frac{1}{2}\\right)^{\\frac{t}{3}} = \\frac{50}{800} = \\frac{1}{16} = \\left(\\frac{1}{2}\\right)^{4} \\implies \\frac{t}{3} = 4 \\implies t = 12$$\n\n$4$ 是半衰期的个数，乘以半衰期才是时间。\n\n> **注意。** 半衰期的个数 $4$ 和比值 $16$ 都不是时间。物质的量也不是匀速减少的：如果每个半衰期都减去起始量的一半，只要 $2$ 个半衰期就减没了。",
      ),
      generate(rng) {
        const ctx = rng.pick(halfLives);
        const k = rng.int(2, 6);
        const d = rng.int(2, 12);
        const left = rng.int(1, 15);
        const a = left * 2 ** k;
        const setup = ctx.setup(a, d);
        const when = ctx.when(String(left));
        return numberProblem({
          prompt: t(`${setup.en} ${when.en}`, `${setup["zh-CN"]}${when["zh-CN"]}`),
          answer: k * d,
          wrong: [k, 2 ** k, (k + 1) * d, Q.of(2 * (a - left) * d, a)],
          solution: t(
            `After $t$ ${ctx.units.en} there have been $\\frac{t}{${d}}$ half-lives, so the amount is $${a}\\left(\\frac{1}{2}\\right)^{\\frac{t}{${d}}}$. Set it equal to $${left}$.\n\n**Step 1:** divide both sides by the starting amount and write the quotient as a power of $\\frac{1}{2}$:${steps(`\\left(\\frac{1}{2}\\right)^{\\frac{t}{${d}}} = \\frac{${left}}{${a}} = \\frac{1}{${2 ** k}} = \\left(\\frac{1}{2}\\right)^{${k}}`)}**Step 2:** the bases are equal, so the exponents are equal, and $${k}$ half-lives of $${d}$ ${ctx.units.en} each take${steps(`\\frac{t}{${d}} = ${k} \\implies t = ${k} \\cdot ${d} = ${k * d}`)}**Check.** Halving $${k}$ times: $${Array.from({ length: k + 1 }, (_, i) => a / 2 ** i).join(" \\to ")}$.`,
            `$t$ ${ctx.units["zh-CN"]}后经过了 $\\frac{t}{${d}}$ 个半衰期，所以剩下的量为 $${a}\\left(\\frac{1}{2}\\right)^{\\frac{t}{${d}}}$。令它等于 $${left}$。\n\n**第一步：** 两边同时除以起始量，并把商写成 $\\frac{1}{2}$ 的幂：${steps(`\\left(\\frac{1}{2}\\right)^{\\frac{t}{${d}}} = \\frac{${left}}{${a}} = \\frac{1}{${2 ** k}} = \\left(\\frac{1}{2}\\right)^{${k}}`)}**第二步：** 底数相同，所以指数相等；$${k}$ 个半衰期，每个 $${d}$ ${ctx.units["zh-CN"]}，共需${steps(`\\frac{t}{${d}} = ${k} \\implies t = ${k} \\cdot ${d} = ${k * d}`)}**检验。** 减半 $${k}$ 次：$${Array.from({ length: k + 1 }, (_, i) => a / 2 ** i).join(" \\to ")}$。`,
          ),
        });
      },
    },
    {
      id: "finding-the-starting-value-of-decay",
      title: t("Finding the starting value", "求起始值"),
      explanation: t(
        "If the value after $n$ periods is known, divide it by $b^{n}$ to undo the decay:\n\n$$a(0.8)^{2} = 6400 \\implies a = \\frac{6400}{0.64} = 10000$$\n\nMultiplying by $0.64$ again would apply the decay twice more instead of undoing it.\n\n> **Watch out.** The starting value of a decay is larger than the later value. If the answer came out smaller, the decay was applied instead of undone; and divide by $b^{n}$, not by $b$ once.",
        "已知 $n$ 期后的值时，把它除以 $b^{n}$，就能还原衰减前的值：\n\n$$a(0.8)^{2} = 6400 \\implies a = \\frac{6400}{0.64} = 10000$$\n\n如果再乘以 $0.64$，就是又衰减了两期，而不是还原。\n\n> **注意。** 衰减的起始值比后来的值大。如果算出的结果更小，说明是又做了一次衰减而不是还原；而且要除以 $b^{n}$，不是只除以一次 $b$。",
      ),
      generate: (rng) => initialValueProblem(rng, "decay"),
    },
    {
      id: "finding-the-decay-rate",
      title: t("Finding the decay rate", "求衰减率"),
      explanation: t(
        "If a quantity decreases from $a$ to $v$ in $2$ periods at a constant rate, the factor is $b = \\sqrt{\\frac{v}{a}}$, and the rate is $1 - b$:\n\n$$10000b^{2} = 6400 \\implies b^{2} = 0.64 \\implies b = 0.8$$\n\nThe value decreases by $20\\%$ per period, not by the total $36\\%$.\n\n> **Watch out.** The square root gives the factor $0.8$, which is what remains; the rate is $1 - 0.8 = 20\\%$, not $80\\%$, and not half of the total decrease.",
        "如果一个量按固定衰减率在 $2$ 期内从 $a$ 减少到 $v$，因子 $b = \\sqrt{\\frac{v}{a}}$，衰减率为 $1 - b$：\n\n$$10000b^{2} = 6400 \\implies b^{2} = 0.64 \\implies b = 0.8$$\n\n每期减少 $20\\%$，而不是总共的 $36\\%$。\n\n> **注意。** 开平方得到的是因子 $0.8$，即剩下的部分；衰减率是 $1 - 0.8 = 20\\%$，不是 $80\\%$，也不是总减少率的一半。",
      ),
      generate: (rng) => rateFromValuesProblem(rng, "decay"),
    },
  ],
};

/** descriptions describe a quantity by a constant change ("linear") or a constant percent ("exponential"). */
const descriptions: readonly ((a: number, k: number, r: number) => { linear: Text; exponential: Text })[] = [
  (a, k, r) => ({
    linear: t(
      `A salary starts at $${a}$ dollars and increases by $${k}$ dollars each year.`,
      `某份工作起薪 $${a}$ 元，每年增加 $${k}$ 元。`,
    ),
    exponential: t(
      `A salary starts at $${a}$ dollars and increases by $${r}\\%$ each year.`,
      `某份工作起薪 $${a}$ 元，每年增加 $${r}\\%$。`,
    ),
  }),
  (a, k, r) => ({
    linear: t(
      `A tank holds $${a}$ liters of water, and $${k}$ liters drain out each minute.`,
      `水箱中有 $${a}$ 升水，每分钟排出 $${k}$ 升。`,
    ),
    exponential: t(
      `A tank holds $${a}$ liters of water, and each minute $${r}\\%$ of the water in it drains out.`,
      `水箱中有 $${a}$ 升水，每分钟排出其中的 $${r}\\%$。`,
    ),
  }),
  (a, k, r) => ({
    linear: t(`A plant is $${a}$ mm tall and grows $${k}$ mm each week.`, `一株植物高 $${a}$ 毫米，每周长高 $${k}$ 毫米。`),
    exponential: t(
      `A plant is $${a}$ mm tall, and its height grows by $${r}\\%$ each week.`,
      `一株植物高 $${a}$ 毫米，高度每周增长 $${r}\\%$。`,
    ),
  }),
  (a, k, r) => ({
    linear: t(
      `A laptop is worth $${a}$ dollars and loses $${k}$ dollars of value each year.`,
      `一台笔记本电脑价值 $${a}$ 元，每年贬值 $${k}$ 元。`,
    ),
    exponential: t(
      `A laptop is worth $${a}$ dollars and loses $${r}\\%$ of its value each year.`,
      `一台笔记本电脑价值 $${a}$ 元，每年贬值 $${r}\\%$。`,
    ),
  }),
];

const linearOrExponential: readonly Text[] = [t("Linear", "一次函数"), t("Exponential", "指数函数")];

export const linearVsExponentialGrowthAndDecay: TopicDef = {
  id: "linear-vs-exponential-growth-and-decay",
  title: t("Linear vs. Exponential Growth and Decay", "线性变化与指数变化"),
  summary: t(
    "Tell linear from exponential change in tables and descriptions, and see that exponential growth eventually overtakes linear growth.",
    "从数值表和文字描述中区分线性变化与指数变化，并认识到指数增长终将超过线性增长。",
  ),
  prerequisites: ["modeling-exponential-decay-with-functions", "modeling-with-linear-functions"],
  encompasses: [{ topic: "exponential-functions", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.LE.A.1", "CCSS.HSF.LE.A.3"],
  intro: t(
    `We know linear functions, which change by a constant slope, and exponential functions $a \\cdot b^{x}$, which change by a constant factor. Real quantities often come as a table or a sentence, and the first question is which kind of function describes them.

The test is what happens each time $x$ goes up by $1$. In $5, 8, 11, 14$ each value is $3$ more than the last: equal differences, so the function is linear. In $2, 6, 18, 54$ each value is $3$ times the last: equal ratios, so it is exponential. In words, "adds $50$ dollars a year" is linear and "adds $5\\%$ a year" is exponential. And however the two start, a growing exponential function eventually passes a linear one: $2^{x}$ is behind $10x + 20$ until $x = 7$, then ahead for good.

In this lesson we tell linear from exponential change in tables and descriptions, and find where exponential growth overtakes linear growth.`,
    `我们学过以固定斜率变化的一次函数，也学过以固定因子变化的指数函数 $a \\cdot b^{x}$。实际的量常常以数值表或文字给出，首先要问的是哪一种函数能描述它。

检验方法是看 $x$ 每增加 $1$ 时发生了什么。在 $5, 8, 11, 14$ 中，每个值都比前一个多 $3$：差相等，所以是一次函数。在 $2, 6, 18, 54$ 中，每个值都是前一个的 $3$ 倍：比相等，所以是指数函数。用文字说，“每年增加 $50$ 元”是线性的，“每年增加 $5\\%$”是指数的。而且不论两者起初如何，增长的指数函数终将超过一次函数：$2^{x}$ 在 $x = 7$ 之前落后于 $10x + 20$，此后一直领先。

这节课从数值表和文字描述中区分线性变化与指数变化，并找出指数增长超过线性增长的位置。`,
  ),
  knowledgePoints: [
    {
      id: "linear-or-exponential-tables",
      title: t("Tables", "数值表"),
      explanation: t(
        "When $x$ goes up by $1$ each step:\n\n- a **linear** function adds the same number each step (constant differences);\n- an **exponential** function multiplies by the same number each step (constant ratios).\n\n$3, 7, 11, 15$ is linear (add $4$); $3, 6, 12, 24$ is exponential (multiply by $2$); $1, 2, 5, 10$ is neither.\n\n> **Watch out.** A table that grows faster and faster is not exponential for that reason alone: check that the ratios are really equal, since $1, 2, 5, 10$ also speeds up. And compute both differences and ratios before choosing.",
        "当 $x$ 每次增加 $1$ 时：\n\n- **一次函数**每一步加上同一个数（差相等）；\n- **指数函数**每一步乘以同一个数（比相等）。\n\n$3, 7, 11, 15$ 是一次函数（加 $4$）；$3, 6, 12, 24$ 是指数函数（乘以 $2$）；$1, 2, 5, 10$ 两者都不是。\n\n> **注意。** 一个越增越快的表不能仅凭这一点就判为指数函数：要检验比是否真的相等，因为 $1, 2, 5, 10$ 也越增越快。在作出选择之前，差和比都要算。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const xs = [0, 1, 2, 3, 4];
        let ys: Q[];
        if (kind === 0) {
          const c = rng.int(-5, 20);
          const m = rng.nonZero(-9, 9);
          ys = xs.map((x) => Q.of(c + m * x));
        } else if (kind === 1) {
          const b = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2), Q.of(1, 3)]);
          const a = b.d > 1n ? rng.int(1, 3) * Number(b.d) ** 4 : rng.int(1, 6);
          ys = xs.map((x) => b.pow(x).mul(Q.of(a)));
        } else {
          const a = rng.int(1, 3);
          const c = rng.int(-4, 6);
          ys = xs.map((x) => Q.of(a * x * x + c));
        }
        const diffs = ys.slice(1).map((y, i) => y.sub(ys[i]!));
        const ratios = ys.slice(1).map((y, i) => (ys[i]!.isZero() ? undefined : y.div(ys[i]!)));
        const list = (vs: readonly (Q | undefined)[]) => vs.map((v) => (v === undefined ? "-" : v.toLatex())).join(", ");
        const options = [t("Linear", "一次函数"), t("Exponential", "指数函数"), t("Neither", "都不是")];
        return choiceProblem({
          prompt: t(
            `Is the function in the table linear, exponential, or neither?${valueTable("f", xs, ys)}`,
            `下表中的函数是一次函数、指数函数，还是都不是？${valueTable("f", xs, ys)}`,
          ),
          options,
          correct: kind,
          solution: (() => {
            const first = ys[0]!;
            const last = ys[4]!;
            const gap = ratios.includes(undefined);
            const lead = t(
              `Each step raises $x$ by $1$, so compare consecutive values. Their differences are $${list(diffs)}$ and their ratios are $${list(ratios)}$${gap ? " (a dash marks a ratio that cannot be formed, because the value before it is $0$)" : ""}.`,
              `每一步 $x$ 增加 $1$，所以比较相邻的函数值。它们的差为 $${list(diffs)}$，比为 $${list(ratios)}$${gap ? "（短横表示无法求比，因为前一个值是 $0$）" : ""}。`,
            );
            const r0 = ratios[0];
            const close =
              kind === 0
                ? t(
                    `The differences are all $${diffs[0]!.toLatex()}$, so the same number is added each step: the function is linear.\n\n**Check.** Starting at $${first.toLatex()}$ and adding $${diffs[0]!.toLatex()}$ four times gives $${first.toLatex()} + 4 \\cdot ${paren(diffs[0]!)} = ${last.toLatex()}$, the last value in the table.`,
                    `差都是 $${diffs[0]!.toLatex()}$，每一步加上同一个数：所以是一次函数。\n\n**检验。** 从 $${first.toLatex()}$ 开始加 $4$ 次 $${diffs[0]!.toLatex()}$，得 $${first.toLatex()} + 4 \\cdot ${paren(diffs[0]!)} = ${last.toLatex()}$，正是表中最后一个值。`,
                  )
                : kind === 1 && r0
                  ? t(
                      `The ratios are all $${r0.toLatex()}$, so each step multiplies by the same number: the function is exponential.\n\n**Check.** Starting at $${first.toLatex()}$ and multiplying by $${r0.toLatex()}$ four times gives $${first.eq(Q.one) ? "" : `${first.toLatex()} \\cdot `}\\left(${r0.toLatex()}\\right)^{4} = ${last.toLatex()}$, the last value in the table.`,
                      `比都是 $${r0.toLatex()}$，每一步乘以同一个数：所以是指数函数。\n\n**检验。** 从 $${first.toLatex()}$ 开始乘 $4$ 次 $${r0.toLatex()}$，得 $${first.eq(Q.one) ? "" : `${first.toLatex()} \\cdot `}\\left(${r0.toLatex()}\\right)^{4} = ${last.toLatex()}$，正是表中最后一个值。`,
                    )
                  : t(
                      `The differences are not all equal, so no single number is added each step, and the ratios are not all equal, so no single number multiplies each step: the function is neither.\n\n**Check.** Already the first two differences, $${diffs[0]!.toLatex()}$ and $${diffs[1]!.toLatex()}$, are unequal, and the differences themselves keep growing, so the values speed up without a constant factor.`,
                      `差不全相等，所以每一步加的不是同一个数；比也不全相等，所以每一步乘的也不是同一个数：两者都不是。\n\n**检验。** 前两个差 $${diffs[0]!.toLatex()}$ 与 $${diffs[1]!.toLatex()}$ 就不相等，而且差本身在不断增大，所以函数值越增越快，却没有固定的倍数。`,
                    );
            return t(`${lead.en}\n\n${close.en}`, `${lead["zh-CN"]}\n\n${close["zh-CN"]}`);
          })(),
        });
      },
    },
    {
      id: "linear-or-exponential-descriptions",
      title: t("Descriptions", "文字描述"),
      explanation: t(
        'A quantity that changes by the same **amount** each period is linear: "increases by $50$ dollars each year". A quantity that changes by the same **percent** or factor each period is exponential: "increases by $5\\%$ each year", "doubles every hour", "loses half every day".\n\n> **Watch out.** Look for the unit of the change, not for the words "grows" or "loses": both kinds can grow or shrink. A change in dollars, liters or millimeters is linear; a change in percent or a multiple is exponential.',
        "每期变化相同**数量**的量是线性的：“每年增加 $50$ 元”。每期变化相同**百分率**或倍数的量是指数的：“每年增加 $5\\%$”“每小时翻一番”“每天减少一半”。\n\n> **注意。** 要看变化量的单位，而不是看“增长”或“减少”这样的字眼：两种变化都可能增长或减少。以元、升、毫米计的变化是线性的；以百分率或倍数计的变化是指数的。",
      ),
      generate(rng) {
        const describe = rng.pick(descriptions);
        const a = rng.int(10, 99) * 10;
        const k = rng.int(2, 60);
        const r = rng.pick([2, 3, 5, 8, 10, 12, 15, 20]);
        const d = describe(a, k, r);
        const exp = rng.bool();
        return choiceProblem({
          prompt: t(
            `${(exp ? d.exponential : d.linear).en} Is the quantity modeled by a linear or an exponential function?`,
            `${(exp ? d.exponential : d.linear)["zh-CN"]}这个量应该用一次函数还是指数函数表示？`,
          ),
          options: linearOrExponential,
          correct: exp ? 1 : 0,
          solution: exp
            ? t(
                `The change is given as a percent, $${r}\\%$ of the current amount each period. Changing by $${r}\\%$ means multiplying by the same factor every period, so the quantity is exponential.\n\n**Check.** In the first period the change is $${r}\\%$ of $${a}$, which is $${dec(Q.of(a * r, 100))}$. In the second it is $${r}\\%$ of the new amount, which is no longer $${a}$, so the change is a different number: no constant amount describes it.`,
                `变化量以百分率给出，每期是当前数量的 $${r}\\%$。变化 $${r}\\%$ 就是每期乘以同一个因子，所以这个量是指数的。\n\n**检验。** 第一期的变化是 $${a}$ 的 $${r}\\%$，即 $${dec(Q.of(a * r, 100))}$。第二期是新数量的 $${r}\\%$，而新数量已不是 $${a}$，所以变化量不同：没有固定的变化量能描述它。`,
              )
            : t(
                `The change is given as an amount, $${k}$ each period, whatever the current amount is. Adding or taking away the same amount each period is a constant difference, so the quantity is linear.\n\n**Check.** Over $3$ periods the change is $3 \\cdot ${k} = ${3 * k}$, the same $${k}$ each time. As a share of the amount, $${k}$ out of $${a}$ is different from $${k}$ out of the next amount, so no constant percent describes it.`,
                `变化量以数量给出，不论当前数量是多少，每期都是 $${k}$。每期加上或减去相同的数量就是差相等，所以这个量是线性的。\n\n**检验。** $3$ 期内的变化是 $3 \\cdot ${k} = ${3 * k}$，每次都是 $${k}$。按占数量的比例看，$${a}$ 中的 $${k}$ 与下一期数量中的 $${k}$ 比例不同，所以没有固定的百分率能描述它。`,
              ),
        });
      },
    },
    {
      id: "exponential-overtakes-linear",
      title: t("Exponential growth overtakes linear growth", "指数增长超过线性增长"),
      explanation: t(
        "An exponentially growing quantity eventually exceeds any linearly growing one, even if it starts smaller. Compare $f(x) = 20x + 50$ and $g(x) = 2^{x}$:\n\n$$\\begin{array}{c|ccccccccc} x & 0 & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 \\\\ \\hline f(x) & 50 & 70 & 90 & 110 & 130 & 150 & 170 & 190 & 210 \\\\ g(x) & 1 & 2 & 4 & 8 & 16 & 32 & 64 & 128 & 256 \\end{array}$$\n\n$g$ passes $f$ at $x = 8$ and stays ahead: from then on it adds more each step than $f$ does.\n\n> **Watch out.** The answer is the first whole number where $g$ is **greater**, so check the value just before it as well: at $x = 7$, $g$ is still behind. Stopping one step early or one step late is the usual slip.",
        "指数增长的量终将超过任何线性增长的量，即使它起初更小。比较 $f(x) = 20x + 50$ 与 $g(x) = 2^{x}$：\n\n$$\\begin{array}{c|ccccccccc} x & 0 & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 \\\\ \\hline f(x) & 50 & 70 & 90 & 110 & 130 & 150 & 170 & 190 & 210 \\\\ g(x) & 1 & 2 & 4 & 8 & 16 & 32 & 64 & 128 & 256 \\end{array}$$\n\n$g$ 在 $x = 8$ 时超过 $f$，并且一直领先：此后它每一步增加的都比 $f$ 多。\n\n> **注意。** 答案是 $g$ 首次**大于** $f$ 的整数，所以也要检验它前面的那个值：在 $x = 7$ 时 $g$ 仍然落后。早一步或晚一步停下是常见的错误。",
      ),
      generate(rng) {
        for (;;) {
          const m = rng.int(1, 8) * 5;
          const c = rng.int(2, 20) * 5;
          const a = rng.int(1, 5);
          const b = rng.pick([2, 2, 3]);
          if (a >= c) continue;
          let x = 0;
          while (a * b ** x <= m * x + c) x++;
          if (x < 2 || x > 10) continue;
          const g = expo(a, String(b));
          return numberProblem({
            prompt: t(
              `Let $f(x) = ${linear(m, c)}$ and $g(x) = ${g}$. What is the smallest whole number $x$ for which $g(x) > f(x)$?`,
              `设 $f(x) = ${linear(m, c)}$，$g(x) = ${g}$。使 $g(x) > f(x)$ 的最小整数 $x$ 是多少？`,
            ),
            answer: x,
            wrong: [x - 1, x + 1],
            solution: t(
              `Evaluate both functions at whole numbers until $g$ passes $f$. The last value where $g$ is not ahead and the first where it is:${steps(`f(${x - 1}) = ${m * (x - 1) + c},\\; g(${x - 1}) = ${a * b ** (x - 1)}`, `f(${x}) = ${m * x + c},\\; g(${x}) = ${a * b ** x}`)}So $g(x) > f(x)$ first at $x = ${x}$.\n\n**Check.** One step later $f(${x + 1}) = ${m * (x + 1) + c}$ and $g(${x + 1}) = ${a * b ** (x + 1)}$, so $g$ is still ahead. It stays ahead, because from here $g$ adds $${a * b ** (x + 1) - a * b ** x}$ in one step, more than the $${m}$ that $f$ adds.`,
              `依次计算两个函数在整数处的值，直到 $g$ 超过 $f$。$g$ 尚未领先的最后一个值和首次领先的值：${steps(`f(${x - 1}) = ${m * (x - 1) + c},\\; g(${x - 1}) = ${a * b ** (x - 1)}`, `f(${x}) = ${m * x + c},\\; g(${x}) = ${a * b ** x}`)}所以 $x = ${x}$ 时首次 $g(x) > f(x)$。\n\n**检验。** 再往后一步，$f(${x + 1}) = ${m * (x + 1) + c}$，$g(${x + 1}) = ${a * b ** (x + 1)}$，$g$ 仍然领先。它会一直领先，因为从这里起 $g$ 一步就增加 $${a * b ** (x + 1) - a * b ** x}$，比 $f$ 每步增加的 $${m}$ 多。`,
            ),
          });
        }
      },
    },
  ],
};

/** modelContexts describe a quantity by a constant change or a constant percent, with the sign of the change. */
const modelContexts: readonly {
  readonly name: string;
  readonly s: 1 | -1;
  readonly what: Text;
  readonly linear: (p: number, k: number) => Text;
  readonly percent: (p: number, r: number) => Text;
}[] = [
  {
    name: "P",
    s: 1,
    what: t("the population after $t$ years", "$t$ 年后的人口"),
    linear: (p, k) =>
      t(`A town has $${p}$ residents, and the number grows by $${k}$ each year.`, `某镇有 $${p}$ 名居民，每年增加 $${k}$ 人。`),
    percent: (p, r) =>
      t(`A town has $${p}$ residents, and the number grows by $${r}\\%$ each year.`, `某镇有 $${p}$ 名居民，居民人数每年增长 $${r}\\%$。`),
  },
  {
    name: "V",
    s: -1,
    what: t("the value of the car after $t$ years", "$t$ 年后汽车的价值"),
    linear: (p, k) =>
      t(`A car is worth $${p}$ dollars and loses $${k}$ dollars of value each year.`, `一辆汽车价值 $${p}$ 元，每年贬值 $${k}$ 元。`),
    percent: (p, r) =>
      t(`A car is worth $${p}$ dollars and loses $${r}\\%$ of its value each year.`, `一辆汽车价值 $${p}$ 元，每年贬值 $${r}\\%$。`),
  },
  {
    name: "S",
    s: 1,
    what: t("the amount saved after $t$ months", "$t$ 个月后的存款"),
    linear: (p, k) =>
      t(`A savings jar holds $${p}$ dollars, and $${k}$ dollars are added each month.`, `存钱罐里有 $${p}$ 元，每月存入 $${k}$ 元。`),
    percent: (p, r) =>
      t(
        `An account holds $${p}$ dollars and earns $${r}\\%$ interest each month, compounded monthly.`,
        `某账户存有 $${p}$ 元，月利率为 $${r}\\%$，每月复利一次。`,
      ),
  },
  {
    name: "W",
    s: -1,
    what: t("the amount of water after $t$ days", "$t$ 天后的水量"),
    linear: (p, k) =>
      t(`A pool holds $${p}$ liters of water and loses $${k}$ liters each day.`, `水池中有 $${p}$ 升水，每天减少 $${k}$ 升。`),
    percent: (p, r) =>
      t(`A pool holds $${p}$ liters of water and loses $${r}\\%$ of it each day.`, `水池中有 $${p}$ 升水，每天减少其中的 $${r}\\%$。`),
  },
];

export const linearVsExponentialModels: TopicDef = {
  id: "linear-vs-exponential-models",
  title: t("Linear vs. Exponential Growth and Decay Models", "线性模型与指数模型"),
  summary: t(
    "Choose and write a linear or an exponential model for a situation, and compare the predictions of the two kinds of model.",
    "为情境选择并写出一次函数模型或指数函数模型，并比较两类模型的预测。",
  ),
  prerequisites: ["linear-vs-exponential-growth-and-decay"],
  encompasses: [
    { topic: "linear-vs-exponential-growth-and-decay", weight: 0.3 },
    { topic: "modeling-exponential-growth-with-functions", weight: 0.3 },
    { topic: "modeling-with-linear-functions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.1", "CCSS.HSF.LE.A.2"],
  intro: t(
    `We can tell linear change from exponential change: a fixed amount each period is linear, a fixed percent or factor is exponential. Now we write the model for each and use it, because the two kinds of model can agree at the start and then predict very different things.

Two plans start with $1000$ dollars. Plan A adds $100$ a year, so $A(t) = 100t + 1000$. Plan B adds $8\\%$ a year, so the factor is $1.08$ and $B(t) = 1000(1.08)^{t}$. After $1$ year A has $1100$ and B has $1080$; after $10$ years A has $2000$ and B about $2158.92$. Plan B starts behind but its yearly gain keeps growing, while A's stays at $100$.

In this lesson we write a linear or an exponential model for a situation, build both models through two values, and compare the predictions of the two.`,
    `我们会区分线性变化与指数变化：每期变化固定数量的是线性的，每期变化固定百分率或倍数的是指数的。现在为每一种写出模型并加以运用，因为两类模型可能起初一致，之后的预测却大不相同。

两个方案都从 $1000$ 元开始。方案 A 每年增加 $100$ 元，所以 $A(t) = 100t + 1000$。方案 B 每年增加 $8\\%$，因子为 $1.08$，所以 $B(t) = 1000(1.08)^{t}$。$1$ 年后 A 有 $1100$ 元，B 有 $1080$ 元；$10$ 年后 A 有 $2000$ 元，B 约有 $2158.92$ 元。方案 B 起初落后，但它每年增加的钱越来越多，而 A 始终是 $100$ 元。

这节课为情境写出一次函数模型或指数模型，根据两个值建立两类模型，并比较它们的预测。`,
  ),
  knowledgePoints: [
    {
      id: "writing-linear-or-exponential-models",
      title: t("Writing the model", "写出模型"),
      explanation: t(
        'Decide first whether the change is by an amount or by a percent:\n\n- "grows by $40$ each year" from $500$: $f(t) = 40t + 500$;\n- "grows by $4\\%$ each year" from $500$: $f(t) = 500(1.04)^{t}$;\n- "loses $300$ each year" from $9000$: $f(t) = -300t + 9000$;\n- "loses $12\\%$ each year" from $9000$: $f(t) = 9000(0.88)^{t}$.\n\n> **Watch out.** A percent never becomes a slope, and an amount never becomes a base: $500(40)^{t}$ and $4t + 500$ are both wrong. For a loss, the slope is negative and the factor is $1 - r$; the starting value is the coefficient or the constant term, not the slope.',
        "先判断变化是按数量还是按百分率：\n\n- 从 $500$ 开始“每年增加 $40$”：$f(t) = 40t + 500$；\n- 从 $500$ 开始“每年增加 $4\\%$”：$f(t) = 500(1.04)^{t}$；\n- 从 $9000$ 开始“每年减少 $300$”：$f(t) = -300t + 9000$；\n- 从 $9000$ 开始“每年减少 $12\\%$”：$f(t) = 9000(0.88)^{t}$。\n\n> **注意。** 百分率不能当作斜率，数量也不能当作底数：$500(40)^{t}$ 和 $4t + 500$ 都是错的。减少时斜率为负，因子为 $1 - r$；起始值是系数或常数项，不是斜率。",
      ),
      generate(rng) {
        const ctx = rng.pick(modelContexts);
        const p = rng.int(5, 90) * 100;
        const r = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]);
        const k = rng.int(2, 40) * 10;
        const exp = rng.bool();
        const f = Q.of(100 + ctx.s * r, 100);
        const answer = exp ? expo(p, dec(f), "t") : linear(ctx.s * k, p, "t");
        const setup = exp ? ctx.percent(p, r) : ctx.linear(p, k);
        return expressionProblem({
          prompt: t(
            `${setup.en} Write a function $${ctx.name}(t)$ for ${ctx.what.en}.`,
            `${setup["zh-CN"]}写出${ctx.what["zh-CN"]}的函数 $${ctx.name}(t)$。`,
          ),
          answer,
          prefix: `${ctx.name}(t) =`,
          wrong: exp
            ? [linear((ctx.s * p * r) / 100, p, "t"), expo(p, dec(Q.of(r, 100)), "t"), linear(ctx.s * r, p, "t")]
            : [expo(p, String(k), "t"), linear(-ctx.s * k, p, "t"), linear(p, ctx.s * k, "t")],
          solution: exp
            ? t(
                `The change is a percent, $${r}\\%$ of the current amount each period, so the amount is multiplied by the same factor every period and the model is exponential. The factor keeps $100\\%$ and ${ctx.s > 0 ? "adds" : "takes away"} $${r}\\%$: $1 ${ctx.s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$, and the starting value $${p}$ is the coefficient:${steps(`${ctx.name}(t) = ${answer}`)}**Check.** $${ctx.name}(0) = ${p}$, and $${ctx.name}(1) = ${p} \\cdot ${dec(f)} = ${dec(f.mul(Q.of(p)))}$, which is $${p} ${ctx.s > 0 ? "+" : "-"} ${dec(Q.of(p * r, 100))}$, a change of $${r}\\%$ of $${p}$.`,
                `变化是按百分率的，每期是当前数量的 $${r}\\%$，所以数量每期乘以同一个因子，模型是指数的。因子保留 $100\\%$ 并${ctx.s > 0 ? "加上" : "减去"} $${r}\\%$：$1 ${ctx.s > 0 ? "+" : "-"} ${dec(Q.of(r, 100))} = ${dec(f)}$，起始值 $${p}$ 是系数：${steps(`${ctx.name}(t) = ${answer}`)}**检验。** $${ctx.name}(0) = ${p}$，$${ctx.name}(1) = ${p} \\cdot ${dec(f)} = ${dec(f.mul(Q.of(p)))}$，即 $${p} ${ctx.s > 0 ? "+" : "-"} ${dec(Q.of(p * r, 100))}$，变化了 $${p}$ 的 $${r}\\%$。`,
              )
            : t(
                `The change is the same amount, $${k}$, each period, so the model is linear. Its slope is the change per period, $${ctx.s * k}$${ctx.s < 0 ? ", negative because the amount goes down" : ""}, and its constant term is the starting value $${p}$:${steps(`${ctx.name}(t) = ${answer}`)}**Check.** $${ctx.name}(0) = ${p}$, and $${ctx.name}(1) = ${p + ctx.s * k}$, which is $${k}$ ${ctx.s > 0 ? "more" : "less"} than at the start.`,
                `每期变化相同的数量 $${k}$，所以是一次函数模型。斜率是每期的变化量 $${ctx.s * k}$${ctx.s < 0 ? "，因为数量在减少所以为负" : ""}，常数项是起始值 $${p}$：${steps(`${ctx.name}(t) = ${answer}`)}**检验。** $${ctx.name}(0) = ${p}$，$${ctx.name}(1) = ${p + ctx.s * k}$，比起初${ctx.s > 0 ? "多" : "少"} $${k}$。`,
              ),
        });
      },
    },
    {
      id: "models-through-two-points",
      title: t("Models through two values", "过两个值的模型"),
      explanation: t(
        "Two values $f(0) = a$ and $f(1) = b$ fit both kinds of model, but they predict differently:\n\n- linear: add $b - a$ each step, so $f(x) = a + (b - a)x$;\n- exponential: multiply by $\\frac{b}{a}$ each step, so $f(x) = a\\left(\\frac{b}{a}\\right)^{x}$.\n\nWith $f(0) = 4$ and $f(1) = 8$: the linear model gives $f(3) = 16$, the exponential one $f(3) = 32$.\n\n> **Watch out.** Use the model the question names, not the other one, and count the steps from $x = 0$: $f(3)$ takes three steps, not two or four.",
        "两个值 $f(0) = a$ 和 $f(1) = b$ 同时符合两类模型，但预测不同：\n\n- 一次函数：每步加 $b - a$，所以 $f(x) = a + (b - a)x$；\n- 指数函数：每步乘以 $\\frac{b}{a}$，所以 $f(x) = a\\left(\\frac{b}{a}\\right)^{x}$。\n\n若 $f(0) = 4$，$f(1) = 8$：一次函数模型给出 $f(3) = 16$，指数模型给出 $f(3) = 32$。\n\n> **注意。** 要用题目指定的模型，而不是另一种；并从 $x = 0$ 开始数步数：$f(3)$ 要走三步，不是两步或四步。",
      ),
      generate(rng) {
        const n = rng.int(2, 4);
        const ratio = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2)]);
        const a = ratio.d > 1n ? rng.int(1, 6) * 2 ** n : rng.int(2, 9);
        const b = ratio.mul(Q.of(a));
        const exp = rng.bool();
        const lin = (x: number) => b.sub(Q.of(a)).mul(Q.of(x)).add(Q.of(a));
        const ex = (x: number) => ratio.pow(x).mul(Q.of(a));
        const value = exp ? ex(n) : lin(n);
        const kind = exp ? t("exponential", "指数函数") : t("linear", "一次函数");
        return numberProblem({
          prompt: t(
            `A function $f$ has $f(0) = ${a}$ and $f(1) = ${b.toLatex()}$. If $f$ is ${kind.en}, what is $f(${n})$?`,
            `函数 $f$ 满足 $f(0) = ${a}$，$f(1) = ${b.toLatex()}$。若 $f$ 是${kind["zh-CN"]}，$f(${n})$ 是多少？`,
          ),
          answer: value,
          wrong: [exp ? lin(n) : ex(n), exp ? ex(n - 1) : lin(n - 1), exp ? ex(n + 1) : lin(n + 1)],
          solution: (() => {
            const chain = Array.from({ length: n + 1 }, (_, i) => (exp ? ex(i) : lin(i)).toLatex()).join(" \\to ");
            return exp
              ? t(
                  `An exponential function multiplies by the same number each time $x$ goes up by $1$. From $f(0)$ to $f(1)$ that number is $\\frac{${b.toLatex()}}{${a}} = ${ratio.toLatex()}$, and $f(${n})$ is $${n}$ steps from $f(0)$:${steps(`f(${n}) = ${a} \\cdot ${bracket(ratio)}^{${n}} = ${value.toLatex()}`)}**Check.** Step by step from $f(0)$: $${chain}$, each value $${ratio.toLatex()}$ times the one before.`,
                  `指数函数在 $x$ 每增加 $1$ 时乘以同一个数。从 $f(0)$ 到 $f(1)$，这个数是 $\\frac{${b.toLatex()}}{${a}} = ${ratio.toLatex()}$，而 $f(${n})$ 离 $f(0)$ 有 $${n}$ 步：${steps(`f(${n}) = ${a} \\cdot ${bracket(ratio)}^{${n}} = ${value.toLatex()}`)}**检验。** 从 $f(0)$ 逐步计算：$${chain}$，每个值都是前一个的 $${ratio.toLatex()}$ 倍。`,
                )
              : t(
                  `A linear function adds the same number each time $x$ goes up by $1$. From $f(0)$ to $f(1)$ that number is $${b.toLatex()} - ${a} = ${b.sub(Q.of(a)).toLatex()}$, and $f(${n})$ is $${n}$ steps from $f(0)$:${steps(`f(${n}) = ${a} + ${n} \\cdot ${paren(b.sub(Q.of(a)))} = ${value.toLatex()}`)}**Check.** Step by step from $f(0)$: $${chain}$, each value $${b.sub(Q.of(a)).abs().toLatex()}$ ${b.sub(Q.of(a)).sign() > 0 ? "more" : "less"} than the one before.`,
                  `一次函数在 $x$ 每增加 $1$ 时加上同一个数。从 $f(0)$ 到 $f(1)$，这个数是 $${b.toLatex()} - ${a} = ${b.sub(Q.of(a)).toLatex()}$，而 $f(${n})$ 离 $f(0)$ 有 $${n}$ 步：${steps(`f(${n}) = ${a} + ${n} \\cdot ${paren(b.sub(Q.of(a)))} = ${value.toLatex()}`)}**检验。** 从 $f(0)$ 逐步计算：$${chain}$，每个值都比前一个${b.sub(Q.of(a)).sign() > 0 ? "多" : "少"} $${b.sub(Q.of(a)).abs().toLatex()}$。`,
                );
          })(),
        });
      },
    },
    {
      id: "comparing-models",
      title: t("Comparing models", "比较模型"),
      explanation: t(
        "To compare two plans at a given time, evaluate both models there. A plan that grows by a percent may start behind a plan that grows by a fixed amount and still pass it later:\n\n$$A(t) = 1000 + 100t,\\qquad B(t) = 1000(1.08)^{t}$$\n\nAfter $5$ years $A = 1500$ and $B \\approx 1469.33$, but after $10$ years $A = 2000$ and $B \\approx 2158.92$.\n\n> **Watch out.** Do not decide by the first year alone, or by comparing $100$ dollars with $8\\%$: evaluate both models at the time asked, computing the power before multiplying.",
        "要比较两个方案在某一时刻的情况，就分别计算两个模型在该时刻的值。按百分率增长的方案起初可能落后于按固定数量增长的方案，但之后会反超：\n\n$$A(t) = 1000 + 100t,\\qquad B(t) = 1000(1.08)^{t}$$\n\n$5$ 年后 $A = 1500$，$B \\approx 1469.33$；但 $10$ 年后 $A = 2000$，$B \\approx 2158.92$。\n\n> **注意。** 不要只凭第一年来判断，也不要拿 $100$ 元直接和 $8\\%$ 比较：要计算两个模型在所问时刻的值，并先算乘方再乘系数。",
      ),
      generate(rng) {
        for (;;) {
          const p = rng.int(5, 50) * 100;
          const r = rng.pick([4, 5, 6, 8, 10, 12, 15]);
          const k = rng.int(2, 30) * 10;
          const n = rng.int(3, 12);
          const f = Q.of(100 + r, 100);
          const a = Q.of(p + k * n);
          const b = f.pow(n).mul(Q.of(p));
          if (a.eq(b) || a.sub(b).abs().cmp(Q.of(1)) < 0) continue;
          const bShown = roundQ(b, 100);
          return choiceProblem({
            prompt: t(
              `Two savings plans both start with $${p}$ dollars. In plan A the balance grows by $${k}$ dollars each year; in plan B it grows by $${r}\\%$ each year. Which plan has the larger balance after $${n}$ years?`,
              `两个储蓄方案都从 $${p}$ 元开始。方案 A 的余额每年增加 $${k}$ 元；方案 B 的余额每年增长 $${r}\\%$。$${n}$ 年后哪个方案的余额更多？`,
            ),
            options: [t("Plan A", "方案 A"), t("Plan B", "方案 B")],
            correct: a.cmp(b) > 0 ? 0 : 1,
            solution: t(
              `Plan A adds a fixed amount, so $A(t) = ${p} + ${k}t$; plan B grows by a percent, so its factor is $${dec(f)}$ and $B(t) = ${p}(${dec(f)})^{t}$. Evaluate both models at $t = ${n}$:${steps(`A(${n}) = ${p} + ${k} \\cdot ${n} = ${p + k * n}`, `B(${n}) = ${p}(${dec(f)})^{${n}} \\approx ${dec(bShown)}`)}So plan ${a.cmp(b) > 0 ? "A" : "B"} has more.\n\n**Check.** The balances differ by about $${dec(roundQ(a.sub(b).abs(), 100))}$, far more than the rounding of $B$, so rounding cannot change the answer. In the first year A gains $${k}$ and B gains $${dec(Q.of(p * r, 100))}$; after that B's yearly gain keeps growing, while A's stays the same.`,
              `方案 A 每年增加固定的数量，所以 $A(t) = ${p} + ${k}t$；方案 B 按百分率增长，因子为 $${dec(f)}$，所以 $B(t) = ${p}(${dec(f)})^{t}$。计算两个模型在 $t = ${n}$ 时的值：${steps(`A(${n}) = ${p} + ${k} \\cdot ${n} = ${p + k * n}`, `B(${n}) = ${p}(${dec(f)})^{${n}} \\approx ${dec(bShown)}`)}所以方案 ${a.cmp(b) > 0 ? "A" : "B"} 更多。\n\n**检验。** 两个余额相差约 $${dec(roundQ(a.sub(b).abs(), 100))}$，远大于 $B$ 的舍入误差，所以舍入不会改变结论。第一年 A 增加 $${k}$，B 增加 $${dec(Q.of(p * r, 100))}$；此后 B 每年的增加量不断增长，而 A 的保持不变。`,
            ),
          });
        }
      },
    },
  ],
};

// Graphs of exponential functions.

const graphView: PlaneView = { xMin: -5, xMax: 5, yMin: -5, yMax: 10 };

/** expFigure draws y = a·b^x + k with labeled points. */
function expFigure(a: Q, b: Q, k: number, pts: readonly Point[], dir: Compass): Figure {
  const [A, B] = [a.toNumber(), b.toNumber()];
  const marks: PlaneMark[] = [
    { kind: "curve", f: (x) => A * B ** x + k, accent: true },
    ...pts.map((at) => ({ kind: "point" as const, at, label: `(${at[0]}, ${at[1]})`, dir })),
  ];
  const rising = A > 0 === B > 1;
  const side = B > 1 ? t("left", "左") : t("right", "右");
  const through = pts.map((p) => `(${p[0]}, ${p[1]})`).join(pts.length > 1 ? " and " : "");
  const throughZh = pts.map((p) => `(${p[0]}, ${p[1]})`).join("、");
  return {
    svg: plane(graphView, marks),
    alt: t(
      `The ${rising ? "rising" : "falling"} curve of an exponential function${pts.length ? ` through ${through}` : ""}, levelling off near the line y = ${k} on the ${side.en}.`,
      `一条${rising ? "上升" : "下降"}的指数函数曲线${pts.length ? `，经过 ${throughZh}` : ""}，在${side["zh-CN"]}侧逐渐靠近直线 y = ${k}。`,
    ),
  };
}

/** graphPairs lists, for y = a·b^x, the pairs of consecutive points with whole-number coordinates between 1 and 9. */
function graphPairs(combos: readonly (readonly [Q, Q])[]): { a: Q; b: Q; x0: number }[] {
  const out: { a: Q; b: Q; x0: number }[] = [];
  for (const [a, b] of combos) {
    const ok = (x: number) => {
      const y = b.pow(x).mul(a);
      return y.isInteger() && y.cmp(Q.one) >= 0 && y.cmp(Q.of(9)) <= 0;
    };
    for (let x = -4; x <= 4; x++) if (ok(x) && ok(x + 1)) out.push({ a, b, x0: x });
  }
  return out;
}

const growthPairs = graphPairs(
  (
    [
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [1, 3],
      [2, 3],
      [3, 3],
      [1, 4],
      [2, 4],
      [1, 5],
      [Q.of(1, 2), 2],
      [Q.of(1, 3), 3],
      [Q.of(1, 4), 4],
      [Q.of(1, 2), 4],
      [2, Q.of(3, 2)],
      [4, Q.of(3, 2)],
      [6, Q.of(3, 2)],
      [2, Q.of(5, 2)],
      [3, Q.of(4, 3)],
    ] as const
  ).map(([a, b]) => [toQ(a), toQ(b)] as const),
);

const decayPairs = graphPairs(
  (
    [
      [1, Q.of(1, 2)],
      [2, Q.of(1, 2)],
      [3, Q.of(1, 2)],
      [4, Q.of(1, 2)],
      [6, Q.of(1, 2)],
      [8, Q.of(1, 2)],
      [1, Q.of(1, 3)],
      [2, Q.of(1, 3)],
      [3, Q.of(1, 3)],
      [9, Q.of(1, 3)],
      [1, Q.of(1, 4)],
      [4, Q.of(1, 4)],
      [4, Q.of(2, 3)],
      [6, Q.of(2, 3)],
      [9, Q.of(2, 3)],
      [8, Q.of(3, 4)],
    ] as const
  ).map(([a, b]) => [toQ(a), toQ(b)] as const),
);

/** equationFromGraphProblem asks for y = a·b^x from its graph through two labeled points. */
function equationFromGraphProblem(rng: Rng, pairs: readonly { a: Q; b: Q; x0: number }[], dir: Compass): Problem {
  const { a, b, x0 } = rng.pick(pairs);
  const y0 = b.pow(x0).mul(a);
  const y1 = b.pow(x0 + 1).mul(a);
  const pts: Point[] = [
    [x0, y0.toNumber()],
    [x0 + 1, y1.toNumber()],
  ];
  const answer = expo(a, num(b));
  const slope = y1.sub(y0);
  return annotate(
    {
      ...expressionProblem({
        prompt: t(
          "The graph of $y = a \\cdot b^{x}$ passes through the labeled points. Find its equation.",
          "如图，$y = a \\cdot b^{x}$ 的图象经过标出的点。求它的解析式。",
        ),
        answer,
        prefix: "y =",
        wrong: [
          ...(a.eq(Q.one) ? [] : [expo(b, num(a))]),
          linear(slope, y0.sub(slope.mul(Q.of(x0)))),
          expo(y0, num(b)),
          expo(a, num(Q.one.div(b))),
        ],
        solution: (() => {
          const e = x0 + 1;
          const at = `${a.eq(Q.one) ? "" : `${a.toLatex()} \\cdot `}${e === 1 ? b.toLatex() : `${bracket(b)}^{${e}}`}`;
          return t(
            `**Step 1:** find $b$. The points are one step apart in $x$, and each step of $1$ multiplies $y$ by $b$. The base is therefore the ratio of the heights, later over earlier:${steps(`b = \\frac{${y1.toLatex()}}{${y0.toLatex()}} = ${b.toLatex()}`)}**Step 2:** find $a$, the height where the graph crosses the $y$-axis. ${x0 === 0 ? `The point at $x = 0$ gives it directly: $a = ${a.toLatex()}$.` : `No labeled point has $x = 0$, so use $(${x0}, ${y0.toLatex()})$: $a \\cdot ${x0 === 1 ? b.toLatex() : `${bracket(b)}^{${x0}}`} = ${y0.toLatex()}$, which gives $a = ${a.toLatex()}$.`} So${steps(`y = ${answer}`)}**Check.** At $x = ${e}$ the equation gives $${at} = ${y1.toLatex()}$, the height of the second point.`,
            `**第一步：** 求 $b$。两点的 $x$ 相差 $1$，而 $x$ 每增加 $1$，$y$ 就乘以 $b$。因此底数是后一个高度与前一个高度之比：${steps(`b = \\frac{${y1.toLatex()}}{${y0.toLatex()}} = ${b.toLatex()}`)}**第二步：** 求 $a$，即图象与 $y$ 轴交点的高度。${x0 === 0 ? `$x = 0$ 处的点直接给出 $a = ${a.toLatex()}$。` : `没有标出 $x = 0$ 的点，所以用 $(${x0}, ${y0.toLatex()})$：$a \\cdot ${x0 === 1 ? b.toLatex() : `${bracket(b)}^{${x0}}`} = ${y0.toLatex()}$，得 $a = ${a.toLatex()}$。`}所以${steps(`y = ${answer}`)}**检验。** 当 $x = ${e}$ 时，解析式给出 $${at} = ${y1.toLatex()}$，正是第二个点的高度。`,
          );
        })(),
      }),
      figure: expFigure(a, b, 0, pts, dir),
    },
    graphView,
    [
      { kind: "arrow", from: pts[0]!, to: pts[1]!, tone: "action" },
      { kind: "point", at: [0, a.toNumber()], tone: "result" },
    ],
    `The graph crosses the y-axis at ${plain(a)}, and each step of 1 in x multiplies y by ${plain(b)}.`,
    `图象与 y 轴交于 ${plain(a)}，x 每增加 1，y 乘以 ${plain(b)}。`,
  );
}

/** shifted writes y = a·b^x + k. */
const shifted = (a: number, b: Q, k: number) => `${expo(a, num(b))}${k === 0 ? "" : k > 0 ? ` + ${k}` : ` - ${-k}`}`;

/** asymptoteProblem asks for the horizontal asymptote of y = a·b^x + k, from its graph or its equation. */
function asymptoteProblem(rng: Rng, bases: readonly Q[]): Problem {
  const a = rng.int(1, 3);
  const b = rng.pick(bases);
  const k = rng.int(-4, 4);
  const growth = b.cmp(Q.one) > 0;
  const fromGraph = rng.bool();
  const direction = growth ? t("decreases", "减小") : t("increases", "增大");
  const p = rng.pick(["y", "f(x)"]);
  const far = growth ? -5 : 5;
  const tiny = (growth ? Q.one.div(b) : b).pow(5);
  const near = tiny.mul(Q.of(a)).add(Q.of(k));
  const kTerm = k === 0 ? "" : k > 0 ? ` + ${k}` : ` - ${-k}`;
  const base = {
    answer: k,
    solveFor: "y",
    wrong: [a + k, -k, a, ...(k === 0 ? [] : [0])],
    solution: t(
      `As $x$ ${direction.en}, $${bracket(b)}^{x}$ gets closer and closer to $0$ without reaching it, and so does $${a === 1 ? "" : `${a} \\cdot `}${bracket(b)}^{x}$. So $y$ gets closer and closer to ${k === 0 ? "$0$" : `$0 ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${k}$`}. The asymptote is $y = ${k}$.\n\n**Check.** At $x = ${far}$, $${bracket(b)}^{${far}} = ${tiny.toLatex()}$, so $y = ${a === 1 ? "" : `${a} \\cdot `}${tiny.toLatex()}${kTerm} = ${near.toLatex()}$, already just above $${k}$. Further out $y$ comes closer still, but it never equals $${k}$, because a power of $${b.toLatex()}$ is never $0$.`,
      `当 $x$ ${direction["zh-CN"]}时，$${bracket(b)}^{x}$ 越来越接近 $0$ 但取不到 $0$，$${a === 1 ? "" : `${a} \\cdot `}${bracket(b)}^{x}$ 也是如此。所以 $y$ 越来越接近 ${k === 0 ? "$0$" : `$0 ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${k}$`}。渐近线是 $y = ${k}$。\n\n**检验。** 当 $x = ${far}$ 时，$${bracket(b)}^{${far}} = ${tiny.toLatex()}$，所以 $y = ${a === 1 ? "" : `${a} \\cdot `}${tiny.toLatex()}${kTerm} = ${near.toLatex()}$，已经略高于 $${k}$。再往外 $y$ 更接近 $${k}$，但永远不等于 $${k}$，因为 $${b.toLatex()}$ 的幂永远不是 $0$。`,
    ),
  };
  if (fromGraph) {
    return annotate(
      {
        ...numberProblem({
          ...base,
          prompt: t(
            `The graph of an exponential function $y = a \\cdot b^{x} + k$ is shown. As $x$ ${direction.en}, the graph gets closer and closer to a horizontal line. What is its equation?`,
            `如图是指数函数 $y = a \\cdot b^{x} + k$ 的图象。当 $x$ ${direction["zh-CN"]}时，图象越来越接近一条水平直线。这条直线的方程是什么？`,
          ),
        }),
        figure: expFigure(Q.of(a), b, k, [[0, a + k]], growth ? "nw" : "ne"),
      },
      graphView,
      [{ kind: "line", a: [0, k], b: [1, k], dashed: true, tone: "result" }],
      `The graph approaches the line y = ${k} without reaching it.`,
      `图象趋近直线 y = ${k}，但不与它相交。`,
    );
  }
  return numberProblem({
    ...base,
    prompt: t(
      `What is the horizontal asymptote of the graph of $${p} = ${shifted(a, b, k)}$?`,
      `$${p} = ${shifted(a, b, k)}$ 的图象的水平渐近线是什么？`,
    ),
  });
}

/** rangeProblem asks for the range of f(x) = a·b^x + k in interval notation. */
function rangeProblem(rng: Rng, bases: readonly Q[], reflect: boolean): Problem {
  const a = (reflect && rng.bool() ? -1 : 1) * rng.int(1, 3);
  const b = rng.pick(bases);
  const k = rng.int(-4, 4);
  const above = a > 0;
  const set = [above ? { lo: Q.of(k), loClosed: false, hiClosed: false } : { hi: Q.of(k), loClosed: false, hiClosed: false }];
  const closed = [above ? { lo: Q.of(k), loClosed: true, hiClosed: false } : { hi: Q.of(k), loClosed: false, hiClosed: true }];
  const other = [above ? { hi: Q.of(k), loClosed: false, hiClosed: false } : { lo: Q.of(k), loClosed: false, hiClosed: false }];
  const shiftedSet = [
    above ? { lo: Q.of(a + k), loClosed: false, hiClosed: false } : { hi: Q.of(a + k), loClosed: false, hiClosed: false },
  ];
  return annotate(
    {
      ...intervalProblem({
        prompt: t(
          `What is the range of $f(x) = ${shifted(a, b, k)}$? Write it in interval notation.`,
          `$f(x) = ${shifted(a, b, k)}$ 的值域是什么？用区间表示。`,
        ),
        set,
        form: "interval",
        wrong: [closed, other, realLine, shiftedSet],
        solution: (() => {
          const term = `${a === 1 ? "" : a === -1 ? "-" : `${a} \\cdot `}${bracket(b)}^{x}`;
          const interval = above ? `(${k}, \\infty)` : `(-\\infty, ${k})`;
          return t(
            `**Step 1:** the power. $${bracket(b)}^{x}$ takes every positive value and never $0$, so $${term}$ takes every ${above ? "positive" : "negative"} value${above ? "" : `: multiplying by the negative number $${a}$ turns each positive value negative`}.\n\n**Step 2:** the shift. ${k === 0 ? "Nothing is added, so" : `Adding $${k}$ moves every value by $${k}$, so`} $f$ takes every value ${above ? "above" : "below"} $${k}$, and the asymptote's value $${k}$ itself is never reached:${steps(`\\text{range} = ${interval}`)}**Check.** $f(0) = ${a}${k === 0 ? "" : k > 0 ? ` + ${k}` : ` - ${-k}`} = ${a + k}$ is ${above ? "above" : "below"} $${k}$, as it should be, and no $x$ gives $f(x) = ${k}$, since that would need $${bracket(b)}^{x} = 0$.`,
            `**第一步：** 看乘方。$${bracket(b)}^{x}$ 取遍所有正数且取不到 $0$，所以 $${term}$ 取遍所有${above ? "正数" : "负数"}${above ? "" : `：乘以负数 $${a}$ 把每个正数都变成负数`}。\n\n**第二步：** 看平移。${k === 0 ? "没有加上常数，所以" : `加上 $${k}$ 使每个值都移动 $${k}$，所以`} $f$ 取遍所有${above ? "大于" : "小于"} $${k}$ 的值，而渐近线的值 $${k}$ 本身取不到：${steps(`\\text{值域} = ${interval}`)}**检验。** $f(0) = ${a}${k === 0 ? "" : k > 0 ? ` + ${k}` : ` - ${-k}`} = ${a + k}$ ${above ? "大于" : "小于"} $${k}$，符合要求；而且没有 $x$ 使 $f(x) = ${k}$，因为那需要 $${bracket(b)}^{x} = 0$。`,
          );
        })(),
      }),
      figure: expFigure(Q.of(a), b, k, [], "ne"),
    },
    graphView,
    [{ kind: "line", a: [0, k], b: [1, k], dashed: true, tone: "action" }, ...onAxis("y", set, above ? 10 : 5)],
    `The graph stays ${above ? "above" : "below"} the line y = ${k}: the range is ${setAlt(set)}.`,
    `图象始终在直线 y = ${k} 的${above ? "上方" : "下方"}：值域是 ${setAlt(set)}。`,
  );
}

const growthBases = [Q.of(2), Q.of(3), Q.of(3, 2)];
const decayBases = [Q.of(1, 2), Q.of(1, 3), Q.of(2, 3)];

export const graphingExponentialGrowthFunctions: TopicDef = {
  id: "graphing-exponential-growth-functions",
  title: t("Graphing Exponential Growth Functions", "指数增长函数的图象"),
  summary: t(
    "Read exponential growth functions from their graphs, and find their horizontal asymptotes and ranges.",
    "根据图象求指数增长函数，并求它们的水平渐近线和值域。",
  ),
  prerequisites: ["exponential-functions", "range-of-a-function"],
  encompasses: [
    { topic: "exponential-functions", weight: 0.3 },
    { topic: "range-of-a-function", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7.E", "CCSS.HSF.LE.A.2"],
  intro: t(
    `We can evaluate $f(x) = a \\cdot b^{x}$ and we know how to read a graph, its intercepts and its range. Plotting an exponential function shows its whole behavior at once: where it starts, how fast it climbs, and the value it approaches but never reaches.

Take $y = 5(2)^{x}$. Its values at $x = -2, -1, 0, 1, 2$ are $\\frac{5}{4}, \\frac{5}{2}, 5, 10, 20$. The graph crosses the $y$-axis at $(0, 5)$, the coefficient, and each step of $1$ to the right multiplies the height by $2$, the base, so it climbs ever more steeply. To the left the heights shrink toward $0$ but stay positive, so the graph flattens out along the $x$-axis.

In this lesson we find the equation of a growth function from its graph, its horizontal asymptote and its range.`,
    `我们会计算 $f(x) = a \\cdot b^{x}$ 的值，也会读图象、截距和值域。画出指数函数的图象，就能一下子看清它的全部性质：从哪里开始，上升得多快，以及它趋近却永远达不到的值。

以 $y = 5(2)^{x}$ 为例。它在 $x = -2, -1, 0, 1, 2$ 处的值为 $\\frac{5}{4}, \\frac{5}{2}, 5, 10, 20$。图象与 $y$ 轴交于 $(0, 5)$，即系数；向右每走 $1$ 个单位，高度乘以底数 $2$，所以上升得越来越陡。向左高度越来越接近 $0$，但始终为正，所以图象沿 $x$ 轴逐渐变平。

这节课由图象求增长函数的解析式，并求它的水平渐近线和值域。`,
  ),
  knowledgePoints: [
    {
      id: "growth-equation-from-graph",
      figure: algebraDrawings["graphing-exponential-growth-functions#growth-equation-from-graph"],
      title: t("The equation from the graph", "由图象求解析式"),
      explanation: t(
        "The graph of $y = a \\cdot b^{x}$ with $a > 0$ and $b > 1$ rises from left to right, ever more steeply. It crosses the $y$-axis at $(0, a)$, and each step of $1$ to the right multiplies the height by $b$. From the points $(0, 2)$ and $(1, 6)$: $a = 2$ and $b = \\frac{6}{2} = 3$, so $y = 2(3)^{x}$.\n\n> **Watch out.** The base is the **ratio** of the heights, not their difference: $6 - 2 = 4$ would describe a line. Divide the later height by the earlier one, and do not swap $a$ and $b$ or take the height of a point away from $x = 0$ as $a$.",
        "$y = a \\cdot b^{x}$（$a > 0$，$b > 1$）的图象从左到右上升，而且越来越陡。它与 $y$ 轴交于 $(0, a)$，向右每走 $1$ 个单位，高度就乘以 $b$。由点 $(0, 2)$ 和 $(1, 6)$ 得 $a = 2$，$b = \\frac{6}{2} = 3$，所以 $y = 2(3)^{x}$。\n\n> **注意。** 底数是高度的**比**，不是高度的差：$6 - 2 = 4$ 描述的是直线。要用后一个高度除以前一个高度；不要把 $a$ 与 $b$ 弄反，也不要把不在 $x = 0$ 处的点的高度当作 $a$。",
      ),
      generate: (rng) => equationFromGraphProblem(rng, growthPairs, "nw"),
    },
    {
      id: "growth-horizontal-asymptote",
      figure: algebraDrawings["graphing-exponential-growth-functions#growth-horizontal-asymptote"],
      title: t("The horizontal asymptote", "水平渐近线"),
      explanation: t(
        "As $x$ decreases, $b^{x}$ (with $b > 1$) gets closer and closer to $0$ without reaching it: $2^{-10} = \\frac{1}{1024}$. So the graph of $y = a \\cdot b^{x}$ approaches the $x$-axis on the left. This line is a **horizontal asymptote**. Adding $k$ shifts the graph up by $k$, and the asymptote becomes $y = k$: for $y = 3(2)^{x} - 4$ it is $y = -4$.\n\n> **Watch out.** The asymptote is set by $k$ alone, with its sign: not by the coefficient $a$, not by $a + k$ (the $y$-intercept), and not by $-k$.",
        "当 $x$ 减小时，$b^{x}$（$b > 1$）越来越接近 $0$ 但取不到 $0$：$2^{-10} = \\frac{1}{1024}$。所以 $y = a \\cdot b^{x}$ 的图象在左侧逐渐靠近 $x$ 轴。这条直线叫做**水平渐近线**。加上 $k$ 会把图象向上平移 $k$，渐近线变为 $y = k$：$y = 3(2)^{x} - 4$ 的渐近线是 $y = -4$。\n\n> **注意。** 渐近线只由 $k$（连同它的符号）决定：与系数 $a$ 无关，不是 $a + k$（那是 $y$ 轴截距），也不是 $-k$。",
      ),
      generate: (rng) => asymptoteProblem(rng, growthBases),
    },
    {
      id: "growth-range",
      figure: algebraDrawings["graphing-exponential-growth-functions#growth-range"],
      title: t("The range", "值域"),
      explanation: t(
        "$b^{x}$ takes every positive value, so for $a > 0$ the function $y = a \\cdot b^{x} + k$ takes every value above the asymptote and none on or below it:\n\n$$\\text{range of } a \\cdot b^{x} + k = (k, \\infty)$$\n\nThe endpoint $k$ is excluded: the graph never touches its asymptote.\n\n> **Watch out.** Use a parenthesis at $k$, not a bracket, since $k$ is never reached, and do not start the range at the $y$-intercept $a + k$: values between $k$ and $a + k$ are taken to the left.",
        "$b^{x}$ 取遍所有正数，所以当 $a > 0$ 时，$y = a \\cdot b^{x} + k$ 取遍渐近线上方的所有值，而取不到渐近线上及其下方的值：\n\n$$a \\cdot b^{x} + k \\text{ 的值域} = (k, \\infty)$$\n\n端点 $k$ 不包括在内：图象永远不会碰到渐近线。\n\n> **注意。** 在 $k$ 处要用圆括号而不是方括号，因为 $k$ 永远取不到；也不要从 $y$ 轴截距 $a + k$ 开始写值域：$k$ 与 $a + k$ 之间的值在左侧都能取到。",
      ),
      generate: (rng) => rangeProblem(rng, growthBases, false),
    },
  ],
  diagnostic: "growth-equation-from-graph",
};

export const graphingExponentialDecayFunctions: TopicDef = {
  id: "graphing-exponential-decay-functions",
  title: t("Graphing Exponential Decay Functions", "指数衰减函数的图象"),
  summary: t(
    "Read exponential decay functions from their graphs, and find their asymptotes and ranges, including reflected graphs.",
    "根据图象求指数衰减函数，并求它们的渐近线和值域（包括翻折后的图象）。",
  ),
  prerequisites: ["graphing-exponential-growth-functions"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7.E", "CCSS.HSF.LE.A.2"],
  intro: t(
    `We can graph a growth function $a \\cdot b^{x}$ with $b > 1$, read its equation from two points, and find its asymptote and range. A decay function has $0 < b < 1$, and its graph is the same picture seen in a mirror: it falls from left to right instead of rising.

Take $y = 9\\left(\\frac{1}{3}\\right)^{x}$. At $x = -1, 0, 1, 2, 3$ the heights are $27, 9, 3, 1, \\frac{1}{3}$. The graph still crosses the $y$-axis at the coefficient, $(0, 9)$, and each step to the right multiplies the height by $\\frac{1}{3}$, so it falls and flattens toward the $x$-axis on the right. A negative coefficient turns the graph upside down across its asymptote: $y = -3\\left(\\frac{1}{2}\\right)^{x} + 2$ stays below $y = 2$.

In this lesson we find the equation of a decay function from its graph, its asymptote, and the range of exponential functions with reflections.`,
    `我们会画 $b > 1$ 的增长函数 $a \\cdot b^{x}$ 的图象，由两点读出它的解析式，并求它的渐近线和值域。衰减函数的 $0 < b < 1$，它的图象像是增长函数的镜像：从左到右下降而不是上升。

以 $y = 9\\left(\\frac{1}{3}\\right)^{x}$ 为例。在 $x = -1, 0, 1, 2, 3$ 处高度为 $27, 9, 3, 1, \\frac{1}{3}$。图象仍与 $y$ 轴交于系数处 $(0, 9)$；向右每走一步，高度乘以 $\\frac{1}{3}$，所以它下降，并在右侧逐渐趋于 $x$ 轴。系数为负时，图象关于渐近线上下翻折：$y = -3\\left(\\frac{1}{2}\\right)^{x} + 2$ 始终在 $y = 2$ 的下方。

这节课由图象求衰减函数的解析式，求它的渐近线，并求带翻折的指数函数的值域。`,
  ),
  knowledgePoints: [
    {
      id: "decay-equation-from-graph",
      figure: algebraDrawings["graphing-exponential-decay-functions#decay-equation-from-graph"],
      title: t("The equation from the graph", "由图象求解析式"),
      explanation: t(
        "With $0 < b < 1$ the graph of $y = a \\cdot b^{x}$ ($a > 0$) falls from left to right, levelling off toward the $x$-axis. It still crosses the $y$-axis at $(0, a)$, and each step of $1$ to the right multiplies the height by $b$, now a fraction. From $(0, 8)$ and $(1, 4)$: $a = 8$ and $b = \\frac{4}{8} = \\frac{1}{2}$, so $y = 8\\left(\\frac{1}{2}\\right)^{x}$.\n\n> **Watch out.** Divide the right-hand height by the left-hand one, $\\frac{4}{8}$, not the other way: $\\frac{8}{4} = 2$ would be a growth function. And the slope $4 - 8 = -4$ belongs to a line, not to this curve.",
        "当 $0 < b < 1$ 时，$y = a \\cdot b^{x}$（$a > 0$）的图象从左到右下降，并逐渐趋于 $x$ 轴。它仍与 $y$ 轴交于 $(0, a)$，向右每走 $1$ 个单位，高度乘以 $b$（此时 $b$ 是分数）。由 $(0, 8)$ 和 $(1, 4)$ 得 $a = 8$，$b = \\frac{4}{8} = \\frac{1}{2}$，所以 $y = 8\\left(\\frac{1}{2}\\right)^{x}$。\n\n> **注意。** 要用右边的高度除以左边的高度，即 $\\frac{4}{8}$，不能反过来：$\\frac{8}{4} = 2$ 是增长函数。而斜率 $4 - 8 = -4$ 属于直线，不属于这条曲线。",
      ),
      generate: (rng) => equationFromGraphProblem(rng, decayPairs, "ne"),
    },
    {
      id: "decay-horizontal-asymptote",
      figure: algebraDrawings["graphing-exponential-decay-functions#decay-horizontal-asymptote"],
      title: t("The horizontal asymptote", "水平渐近线"),
      explanation: t(
        "For $0 < b < 1$, $b^{x}$ gets closer and closer to $0$ as $x$ **increases**: $\\left(\\frac{1}{2}\\right)^{10} = \\frac{1}{1024}$. So the graph of a decay function approaches its asymptote on the right. As before, $y = a \\cdot b^{x} + k$ has the asymptote $y = k$.\n\n> **Watch out.** A decay graph approaches its asymptote on the **right**, not the left, but the asymptote is still $y = k$: not $a$, not $a + k$, and not $-k$.",
        "当 $0 < b < 1$ 时，$x$ **增大**，$b^{x}$ 越来越接近 $0$：$\\left(\\frac{1}{2}\\right)^{10} = \\frac{1}{1024}$。所以衰减函数的图象在右侧靠近渐近线。与之前一样，$y = a \\cdot b^{x} + k$ 的渐近线是 $y = k$。\n\n> **注意。** 衰减函数的图象在**右侧**而不是左侧靠近渐近线，但渐近线仍是 $y = k$：不是 $a$，不是 $a + k$，也不是 $-k$。",
      ),
      generate: (rng) => asymptoteProblem(rng, decayBases),
    },
    {
      id: "range-with-reflections",
      figure: algebraDrawings["graphing-exponential-decay-functions#range-with-reflections"],
      title: t("Ranges and reflections", "值域与翻折"),
      explanation: t(
        "A negative coefficient $a$ reflects the graph across its asymptote: $y = -2\\left(\\frac{1}{2}\\right)^{x} + 3$ lies entirely **below** $y = 3$. So for $y = a \\cdot b^{x} + k$:\n\n- if $a > 0$, the range is $(k, \\infty)$;\n- if $a < 0$, the range is $(-\\infty, k)$.\n\nThe asymptote's value $k$ is never taken.\n\n> **Watch out.** Look at the sign of $a$ before writing the range: a negative coefficient puts the graph below the asymptote. Whether the base is above or below $1$ does not matter for the range.",
        "系数 $a$ 为负时，图象关于渐近线翻折：$y = -2\\left(\\frac{1}{2}\\right)^{x} + 3$ 完全位于 $y = 3$ 的**下方**。所以对 $y = a \\cdot b^{x} + k$：\n\n- 若 $a > 0$，值域为 $(k, \\infty)$；\n- 若 $a < 0$，值域为 $(-\\infty, k)$。\n\n渐近线的值 $k$ 永远取不到。\n\n> **注意。** 写值域之前先看 $a$ 的符号：系数为负时图象在渐近线下方。底数大于还是小于 $1$ 对值域没有影响。",
      ),
      generate: (rng) => rangeProblem(rng, [...decayBases, ...growthBases], true),
    },
  ],
  diagnostic: "decay-equation-from-graph",
};

/** exponentialFunctionTopics are the topics of the exponential functions unit, in teaching order. */
export const exponentialFunctionTopics: readonly TopicDef[] = [
  writingRadicalsUsingFractionalExponents,
  productRuleWithAlgebraicExpressions,
  quotientRuleWithAlgebraicExpressions,
  powerRuleWithAlgebraicExpressions,
  powerOfProductRuleWithAlgebraicExpressions,
  powerOfQuotientRuleWithAlgebraicExpressions,
  combiningRulesOfExponentsWithAlgebraicExpressions,
  solvingExponentialEquations,
  solvingExponentialEquationsWithFractionalSolutions,
  creatingExponentialGrowthExpressions,
  creatingExponentialDecayExpressions,
  exponentialFunctions,
  modelingExponentialGrowthWithFunctions,
  interpretingExponentialGrowth,
  solvingExponentialGrowthProblems,
  modelingExponentialDecayWithFunctions,
  interpretingExponentialDecay,
  solvingExponentialDecayProblems,
  linearVsExponentialGrowthAndDecay,
  linearVsExponentialModels,
  graphingExponentialGrowthFunctions,
  graphingExponentialDecayFunctions,
];
