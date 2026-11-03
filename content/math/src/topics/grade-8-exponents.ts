import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { expressionProblem, numberProblem, steps } from "../problems.ts";
import { base, mono } from "./exponents.ts";

// 8th Grade Math, exponents: the zeroth power, powers of -1, negative exponents, evaluating expressions with
// integer exponents, and the product, quotient, power, power-of-a-product and power-of-a-quotient rules.

/** ccss is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

/** Factors are the variables of a monomial with their exponents, which may be negative or zero. */
type Factors = readonly (readonly [string, number])[];

/** positive writes c times the factors with positive exponents only: positive(Q.of(-3, 2), [["x", 2], ["y", -3]]) is "-\frac{3x^{2}}{2y^{3}}". */
export function positive(c: Q, factors: Factors): string {
  const top = mono(
    Number(c.abs().n),
    factors.filter(([, e]) => e > 0),
  );
  const bottom = mono(
    Number(c.d),
    factors.filter(([, e]) => e < 0).map(([v, e]) => [v, -e] as const),
  );
  const sign = c.sign() < 0 ? "-" : "";
  return bottom === "1" ? `${sign}${top}` : `${sign}\\frac{${top}}{${bottom}}`;
}

/** power writes b^e, with a negative or fractional base in parentheses. */
const power = (b: Q | number, e: number) => `${base(b instanceof Q ? b : Q.of(b))}^{${e}}`;

/** exponentProblem asks for the exponent k when expr is written as a single power b^k. */
function exponentProblem(b: number, expr: string, k: number, work: Text, wrong: readonly number[]): Problem {
  return numberProblem({
    prompt: t(
      `Write $${expr}$ as a single power of $${b}$, in the form $${b}^{n}$. What is $n$?`,
      `把 $${expr}$ 写成以 $${b}$ 为底的一个幂 $${b}^{n}$。$n$ 是多少？`,
    ),
    answer: k,
    form: "integer",
    solveFor: "n",
    wrong,
    solution: work,
  });
}

/** signed writes an integer for use after an operator: "(-3)" or "3". */
const signed = (n: number) => (n < 0 ? `(${n})` : String(n));

/** smallBases are integer bases whose small powers stay readable. */
const smallBases = [2, 3, 4, 5, 6, 7, 10];

/** fractionBases are fractional bases for powers. */
const fractionBases = [Q.of(1, 2), Q.of(2, 3), Q.of(3, 4), Q.of(1, 3), Q.of(3, 2), Q.of(2, 5), Q.of(5, 2), Q.of(4, 3)];

// ---------------------------------------------------------------------------
// Integer exponents

/** theZerothPower evaluates zeroth powers, alone and in expressions. */
export const theZerothPower = topic(
  "the-zeroth-power",
  t("The Zeroth Power", "零次幂"),
  t(
    "Any nonzero number to the power 0 is 1. Going down the powers of a number divides by the number each time, so one step below the first power gives 1. A minus sign in front of a power is not part of the base: −5⁰ = −1, while (−5)⁰ = 1.",
    "任何非零数的零次幂都等于 1。幂的指数每减少 1，就要除以一次底数，所以比一次幂再低一步就得到 1。幂前面的负号不属于底数：−5⁰ = −1，而 (−5)⁰ = 1。",
  ),
  ["exponents-with-rational-bases"],
  ["8.EE.A.1"],
  [
    {
      id: "zeroth-powers-of-numbers",
      title: t("Zeroth powers of numbers", "数的零次幂"),
      explanation: t(
        "Look at the pattern $2^{3} = 8$, $2^{2} = 4$, $2^{1} = 2$: each step down divides by $2$, so $2^{0} = 2 \\div 2 = 1$. The same holds for any nonzero base, including negatives and fractions: $(-7)^{0} = 1$ and $\\left(\\frac{3}{4}\\right)^{0} = 1$. In $-7^{0}$ the exponent belongs to the $7$ only, so $-7^{0} = -(7^{0}) = -1$.",
        "看这组规律：$2^{3} = 8$，$2^{2} = 4$，$2^{1} = 2$：每往下一步都除以 $2$，所以 $2^{0} = 2 \\div 2 = 1$。对任何非零底数都一样，包括负数和分数：$(-7)^{0} = 1$，$\\left(\\frac{3}{4}\\right)^{0} = 1$。在 $-7^{0}$ 中，指数只作用于 $7$，所以 $-7^{0} = -(7^{0}) = -1$。",
      ),
      generate(rng) {
        const n = rng.int(2, 99);
        const kind = rng.pick(["plain", "negative-base", "minus", "fraction", "decimal"] as const);
        const f = rng.pick(fractionBases);
        const d = Q.of(rng.int(11, 99), 10);
        const forms: Record<typeof kind, readonly [string, number]> = {
          plain: [`${n}^{0}`, 1],
          "negative-base": [`(-${n})^{0}`, 1],
          minus: [`-${n}^{0}`, -1],
          fraction: [power(rng.bool() ? f.neg() : f, 0), 1],
          decimal: [power(d, 0), 1],
        };
        const [expr, answer] = forms[kind];
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer,
          form: "integer",
          // Zero, the base itself, and the other sign.
          wrong: [0, kind === "plain" ? n : -answer, -answer],
          solution: t(
            kind === "minus"
              ? `The exponent applies to $${n}$ only, and $${n}^{0} = 1$:${steps(`-${n}^{0} = -(${n}^{0}) = -1`)}`
              : `Any nonzero number to the power $0$ is $1$, whatever the base looks like:${steps(`${expr} = 1`)}`,
            kind === "minus"
              ? `指数只作用于 $${n}$，而 $${n}^{0} = 1$：${steps(`-${n}^{0} = -(${n}^{0}) = -1`)}`
              : `任何非零数的零次幂都等于 $1$，与底数是什么样的数无关：${steps(`${expr} = 1`)}`,
          ),
        });
      },
    },
    {
      id: "zeroth-powers-in-expressions",
      title: t("Zeroth powers in expressions", "式子中的零次幂"),
      explanation: t(
        "Replace each zeroth power by $1$ before doing anything else. In $4 \\cdot 7^{0} + 3^{0} = 4 \\cdot 1 + 1 = 5$. With a variable, check what the exponent applies to: $5x^{0} = 5 \\cdot 1 = 5$, but $(5x)^{0} = 1$, for any nonzero $x$.",
        "先把每个零次幂换成 $1$，再做其他运算。$4 \\cdot 7^{0} + 3^{0} = 4 \\cdot 1 + 1 = 5$。有字母时，要看指数作用于什么：对任何非零的 $x$，$5x^{0} = 5 \\cdot 1 = 5$，而 $(5x)^{0} = 1$。",
      ),
      generate(rng) {
        const x = rng.pick([-4, -3, -2, 2, 3, 5, 6]);
        // Each term: [LaTeX, value, value if a zeroth power were 0, value if c x^0 were read as (c x)^0].
        const term = (): readonly [string, number, number, number] => {
          const c = rng.int(2, 9);
          const b = rng.int(2, 12);
          return rng.pick([
            [`${c} \\cdot ${b}^{0}`, c, 0, c],
            [`${b}^{0}`, 1, 0, 1],
            [`(${c}x)^{0}`, 1, 0, 1],
            [`${c}x^{0}`, c, 0, 1],
            [`${c}x`, c * x, c * x, c * x],
          ] as const);
        };
        for (;;) {
          const ts = [term(), term(), term()].slice(0, rng.int(2, 3));
          if (!ts.some(([s]) => s.includes("x^{0}") || s.includes("x)^{0}"))) continue;
          const ops = ts.map((_, i) => (i === 0 ? 1 : rng.pick([1, -1])));
          const expr = ts.map(([s], i) => (i === 0 ? s : `${ops[i]! > 0 ? "+" : "-"} ${s}`)).join(" ");
          const total = (k: 1 | 2 | 3) => ts.reduce((acc, tm, i) => acc + ops[i]! * tm[k], 0);
          const ones = ts.map(([s, v]) => (s.includes("^{0}") ? String(v) : `${s.replace("x", "")} \\cdot ${signed(x)}`));
          const work = ones.map((s, i) => (i === 0 ? s : `${ops[i]! > 0 ? "+" : "-"} ${s}`)).join(" ");
          return numberProblem({
            prompt: t(`Evaluate $${expr}$ for $x = ${x}$.`, `当 $x = ${x}$ 时，求 $${expr}$ 的值。`),
            answer: total(1),
            form: "integer",
            // Zeroth powers taken as 0, and c x^0 read as (c x)^0.
            wrong: [total(2), total(3)],
            solution: t(
              `Replace each zeroth power by $1$; in $cx^{0}$ only $x$ is raised to the power $0$:${steps(`${expr} = ${work} = ${total(1)}`)}`,
              `把每个零次幂换成 $1$；在 $cx^{0}$ 中只有 $x$ 是零次幂：${steps(`${expr} = ${work} = ${total(1)}`)}`,
            ),
          });
        }
      },
    },
  ],
);

/** powersOfNegativeOne evaluates powers of -1 by the parity of the exponent. */
export const powersOfNegativeOne = topic(
  "powers-of-negative-one",
  t("Powers of Negative One", "−1 的乘方"),
  t(
    "Multiplying by −1 flips the sign, so the powers of −1 alternate between −1 and 1: an even power of −1 is 1 and an odd power is −1. Without parentheses, −1ⁿ means −(1ⁿ), which is −1 for every n.",
    "乘以 −1 会改变符号，所以 −1 的乘方在 −1 和 1 之间交替：−1 的偶数次幂是 1，奇数次幂是 −1。没有括号时，−1ⁿ 表示 −(1ⁿ)，对任何 n 都等于 −1。",
  ),
  ["exponents-with-rational-bases"],
  ["8.EE.A.1"],
  [
    {
      id: "even-and-odd-powers-of-negative-one",
      title: t("Even and odd powers", "偶数次幂与奇数次幂"),
      explanation: t(
        "$(-1)^{2} = 1$, $(-1)^{3} = -1$, $(-1)^{4} = 1$, and so on: the factors pair up into $(-1)(-1) = 1$, and an odd exponent leaves one $-1$ over. So $(-1)^{58} = 1$ because $58$ is even, and $(-1)^{77} = -1$ because $77$ is odd.",
        "$(-1)^{2} = 1$，$(-1)^{3} = -1$，$(-1)^{4} = 1$，依此类推：因数两两配成 $(-1)(-1) = 1$，指数为奇数时会剩下一个 $-1$。所以 $(-1)^{58} = 1$，因为 $58$ 是偶数；$(-1)^{77} = -1$，因为 $77$ 是奇数。",
      ),
      generate(rng) {
        const n = rng.bool(0.3) ? rng.int(5, 12) : rng.int(13, 250);
        const answer = n % 2 === 0 ? 1 : -1;
        return numberProblem({
          prompt: t(`Evaluate $(-1)^{${n}}$.`, `计算 $(-1)^{${n}}$。`),
          answer,
          form: "integer",
          // The other sign, and multiplying -1 by the exponent.
          wrong: [-answer, -n],
          solution: t(
            `$${n}$ is ${n % 2 === 0 ? "even, so the factors of $-1$ pair up into $1$s" : "odd, so after pairing the factors one $-1$ is left over"}:${steps(`(-1)^{${n}} = ${answer}`)}`,
            `$${n}$ 是${n % 2 === 0 ? "偶数，所以 $-1$ 这些因数两两配成 $1$" : "奇数，所以因数两两配对后还剩一个 $-1$"}：${steps(`(-1)^{${n}} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "negative-signs-and-powers-of-one",
      title: t("Negative signs and powers", "负号与乘方"),
      explanation: t(
        "In $(-1)^{n}$ the base is $-1$; in $-1^{n}$ the base is $1$, and the minus sign is applied afterward, so $-1^{n} = -1$ for every $n$. For example, $-1^{4} + (-1)^{6} = -1 + 1 = 0$ and $(-1)^{3} \\cdot (-1)^{5} = (-1)(-1) = 1$.",
        "在 $(-1)^{n}$ 中，底数是 $-1$；在 $-1^{n}$ 中，底数是 $1$，负号是算完乘方后再加上的，所以对任何 $n$ 都有 $-1^{n} = -1$。例如 $-1^{4} + (-1)^{6} = -1 + 1 = 0$，$(-1)^{3} \\cdot (-1)^{5} = (-1)(-1) = 1$。",
      ),
      generate(rng) {
        // A term is a power of -1 with or without parentheses: [LaTeX, value, value with the parentheses misread].
        const term = (): readonly [string, number, number] => {
          const n = rng.int(2, 60);
          const v = n % 2 === 0 ? 1 : -1;
          return rng.bool() ? [`(-1)^{${n}}`, v, v] : [`-1^{${n}}`, -1, v];
        };
        for (;;) {
          const [a, b] = [term(), term()];
          if (!a[0].startsWith("-1") && !b[0].startsWith("-1")) continue;
          const op = rng.pick(["+", "-", "\\cdot"] as const);
          const f = (x: number, y: number) => (op === "+" ? x + y : op === "-" ? x - y : x * y);
          const expr = `${a[0]} ${op} ${b[0].startsWith("-") && op !== "\\cdot" ? `(${b[0]})` : op === "\\cdot" && b[0].startsWith("-") ? `(${b[0]})` : b[0]}`;
          const answer = f(a[1], b[1]);
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
            answer,
            form: "integer",
            // Reading -1^n as (-1)^n, and flipping the sign.
            wrong: [f(a[2], b[2]), -answer, f(a[1], -b[1])],
            solution: t(
              `Without parentheses the exponent applies to $1$ only, so $-1^{n} = -1$; with them, an even power of $-1$ is $1$ and an odd power is $-1$:${steps(`${expr} = ${signed(a[1])} ${op} ${signed(b[1])} = ${answer}`)}`,
              `没有括号时，指数只作用于 $1$，所以 $-1^{n} = -1$；有括号时，$-1$ 的偶数次幂为 $1$，奇数次幂为 $-1$：${steps(`${expr} = ${signed(a[1])} ${op} ${signed(b[1])} = ${answer}`)}`,
            ),
          });
        }
      },
    },
  ],
);

/** negativeExponents evaluates negative powers and rewrites them with positive exponents. */
export const negativeExponents = topic(
  "negative-exponents",
  t("Negative Exponents", "负整数指数"),
  t(
    "A negative exponent means the reciprocal of the positive power: b⁻ⁿ = 1/bⁿ for any nonzero b. It does not make the number negative: 2⁻³ = 1/8. For a fraction, (a/b)⁻ⁿ = (b/a)ⁿ.",
    "负整数指数表示正整数次幂的倒数：对任何非零的 b，b⁻ⁿ = 1/bⁿ。它并不会使数变成负数：2⁻³ = 1/8。对于分数，(a/b)⁻ⁿ = (b/a)ⁿ。",
  ),
  ["the-zeroth-power"],
  ["8.EE.A.1"],
  [
    {
      id: "evaluating-negative-powers",
      title: t("Evaluating negative powers", "计算负整数指数幂"),
      explanation: t(
        "Continue the pattern below the zeroth power, dividing by $2$ each time: $2^{0} = 1$, $2^{-1} = \\frac{1}{2}$, $2^{-2} = \\frac{1}{4}$, $2^{-3} = \\frac{1}{8}$. So $b^{-n} = \\frac{1}{b^{n}}$. For a fraction, take the reciprocal and then the power: $\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^{2} = \\frac{9}{4}$.",
        "在零次幂之下继续这个规律，每次除以 $2$：$2^{0} = 1$，$2^{-1} = \\frac{1}{2}$，$2^{-2} = \\frac{1}{4}$，$2^{-3} = \\frac{1}{8}$。所以 $b^{-n} = \\frac{1}{b^{n}}$。对于分数，先取倒数再乘方：$\\left(\\frac{2}{3}\\right)^{-2} = \\left(\\frac{3}{2}\\right)^{2} = \\frac{9}{4}$。",
      ),
      generate(rng) {
        const kind = rng.pick(["integer", "negative", "fraction"] as const);
        const b = kind === "fraction" ? rng.pick(fractionBases) : Q.of(kind === "negative" ? -rng.int(2, 5) : rng.pick(smallBases));
        const n = b.abs().cmp(Q.of(5)) > 0 || !b.isInteger() ? rng.int(1, 3) : rng.int(1, 4);
        const answer = Q.one.div(b.pow(n));
        return numberProblem({
          prompt: t(`Evaluate $${power(b, -n)}$.`, `计算 $${power(b, -n)}$。`),
          answer,
          // A negative number instead of a reciprocal, multiplying base and exponent, and the positive power.
          wrong: [b.pow(n).neg(), Q.one.div(b.mul(Q.of(n))), b.pow(n), b.mul(Q.of(-n))],
          solution: t(
            `A negative exponent means the reciprocal of the positive power:${steps(`${power(b, -n)} = \\frac{1}{${power(b, n)}} = ${b.isInteger() ? "" : `\\frac{1}{${b.pow(n).toLatex()}} = `}${answer.toLatex()}`)}`,
            `负整数指数表示正整数次幂的倒数：${steps(`${power(b, -n)} = \\frac{1}{${power(b, n)}} = ${b.isInteger() ? "" : `\\frac{1}{${b.pow(n).toLatex()}} = `}${answer.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "writing-with-positive-exponents",
      title: t("Writing with positive exponents", "写成正整数指数"),
      explanation: t(
        "A factor with a negative exponent moves to the other side of the fraction bar with a positive exponent. Only that factor moves: $3x^{-2} = \\frac{3}{x^{2}}$, not $\\frac{1}{3x^{2}}$, because the exponent belongs to $x$ alone. A negative power in a denominator moves up: $\\frac{1}{y^{-4}} = y^{4}$.",
        "带负整数指数的因数移到分数线的另一边，指数变为正数。只有这个因数移动：$3x^{-2} = \\frac{3}{x^{2}}$，而不是 $\\frac{1}{3x^{2}}$，因为指数只作用于 $x$。分母中的负整数指数幂移到分子：$\\frac{1}{y^{-4}} = y^{4}$。",
      ),
      generate(rng) {
        const c = rng.pick([1, 2, 3, 4, 5, 7, -2, -3]);
        const [m, n] = [rng.int(1, 6), rng.int(1, 5)];
        const kind = rng.pick(["one", "two", "below"] as const);
        if (kind === "below") {
          const expr = `\\frac{${c}}{x^{-${m}}}`;
          const xm = mono(1, [["x", m]]);
          return expressionProblem({
            prompt: t(`Write $${expr}$ using only positive exponents.`, `只用正整数指数写出 $${expr}$。`),
            answer: mono(c, [["x", m]]),
            simplified: true,
            // Leaving the power in the denominator, and moving the coefficient as well.
            wrong: [`\\frac{${c}}{${xm}}`, `\\frac{${xm}}{${c}}`],
            solution: t(
              `The factor $x^{-${m}}$ in the denominator moves up as $${xm}$:${steps(`${expr} = ${mono(c, [["x", m]])}`)}`,
              `分母中的因数 $x^{-${m}}$ 移到分子，变为 $${xm}$：${steps(`${expr} = ${mono(c, [["x", m]])}`)}`,
            ),
          });
        }
        const fs: Factors =
          kind === "one"
            ? [["x", -m]]
            : [
                ["x", m],
                ["y", -n],
              ];
        const expr = mono(c, fs);
        const answer = positive(Q.of(c), fs);
        return expressionProblem({
          prompt: t(`Write $${expr}$ using only positive exponents.`, `只用正整数指数写出 $${expr}$。`),
          answer,
          simplified: true,
          // Moving the coefficient too, and making the coefficient negative instead.
          wrong: [
            kind === "one" ? `\\frac{1}{${mono(c, [["x", m]])}}` : `\\frac{x^{${m}}}{${mono(c, [["y", n]])}}`,
            mono(
              -c,
              fs.map(([v, e]) => [v, Math.abs(e)] as const),
            ),
          ],
          solution: t(
            `Only the factor with the negative exponent moves below the fraction bar:${steps(`${expr} = ${answer}`)}`,
            `只有带负整数指数的因数移到分数线下方：${steps(`${expr} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

/** evaluatingExpressionsWithIntegerExponents evaluates numerical and algebraic expressions with zero and negative exponents. */
export const evaluatingExpressionsWithIntegerExponents = topic(
  "evaluating-expressions-with-integer-exponents",
  t("Evaluating Expressions With Integer Exponents", "计算含整数指数的式子"),
  t(
    "Evaluate zero and negative powers first, following the order of operations: b⁰ = 1 and b⁻ⁿ = 1/bⁿ. A coefficient in front of a power multiplies the power after it is evaluated: 3 · 2⁻² = 3/4.",
    "按照运算顺序，先算零次幂和负整数指数幂：b⁰ = 1，b⁻ⁿ = 1/bⁿ。幂前面的系数要在算出幂之后再相乘：3 · 2⁻² = 3/4。",
  ),
  ["negative-exponents", "evaluating-expressions-with-positive-integer-exponents"],
  ["8.EE.A.1"],
  [
    {
      id: "numerical-expressions-with-integer-exponents",
      title: t("Numerical expressions", "数的式子"),
      explanation: t(
        "A negative exponent means the reciprocal of the positive power, $a^{-n} = \\frac{1}{a^{n}}$, and any nonzero number to the power zero is $1$. Evaluate every power first, then multiply, divide, add and subtract in the usual order.\n\nIn $3 \\cdot 2^{-2} + 5^{0}$, evaluate the powers first: $2^{-2} = \\frac{1}{4}$ and $5^{0} = 1$. Then $3 \\cdot \\frac{1}{4} + 1 = \\frac{7}{4}$. A negative exponent never makes the value negative.",
        "负整数指数表示正整数次幂的倒数，$a^{-n} = \\frac{1}{a^{n}}$；任何非零数的零次幂都等于 $1$。先算出每个乘方，再按通常的顺序进行乘除和加减。\n\n在 $3 \\cdot 2^{-2} + 5^{0}$ 中先算乘方：$2^{-2} = \\frac{1}{4}$，$5^{0} = 1$。于是 $3 \\cdot \\frac{1}{4} + 1 = \\frac{7}{4}$。负整数指数不会使值变成负数。",
      ),
      generate(rng) {
        const [b, k] = [rng.pick([2, 3, 4, 5, 10]), rng.int(1, 3)];
        const c = rng.int(2, 9);
        const [d, j] = [rng.pick([2, 3, 4, 6]), rng.int(1, 2)];
        const third = rng.pick(["zero", "negative"] as const);
        const op = rng.pick([1, -1]);
        const p = Q.of(b).pow(k);
        const q = third === "zero" ? Q.one : Q.one.div(Q.of(d).pow(j));
        const second = third === "zero" ? `${d}^{0}` : `${d}^{-${j}}`;
        const expr = `${c} \\cdot ${b}^{-${k}} ${op > 0 ? "+" : "-"} ${second}`;
        const value = (first: Q, other: Q) =>
          Q.of(c)
            .mul(first)
            .add(other.mul(Q.of(op)));
        const answer = value(Q.one.div(p), q);
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer,
          // Negative powers taken as negative numbers, the zeroth power taken as 0, and the coefficient raised to the power too.
          wrong: [
            value(p.neg(), third === "zero" ? Q.one : Q.of(d).pow(j).neg()),
            value(Q.one.div(p), third === "zero" ? Q.zero : q),
            Q.one.div(Q.of(c * b).pow(k)).add(q.mul(Q.of(op))),
          ],
          solution: t(
            `Evaluate the powers first: $${b}^{-${k}} = \\frac{1}{${p.toLatex()}}$ and $${second} = ${q.toLatex()}$.${steps(`${c} \\cdot \\frac{1}{${p.toLatex()}} ${op > 0 ? "+" : "-"} ${q.toLatex()} = ${answer.toLatex()}`)}`,
            `先算乘方：$${b}^{-${k}} = \\frac{1}{${p.toLatex()}}$，$${second} = ${q.toLatex()}$。${steps(`${c} \\cdot \\frac{1}{${p.toLatex()}} ${op > 0 ? "+" : "-"} ${q.toLatex()} = ${answer.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "substituting-into-negative-powers",
      title: t("Substituting into negative powers", "代入负整数指数幂"),
      explanation: t(
        "To evaluate $3x^{-2} - x^{0}$ for $x = -2$, substitute in parentheses: $3(-2)^{-2} - (-2)^{0} = 3 \\cdot \\frac{1}{4} - 1 = -\\frac{1}{4}$. The exponent applies to $x$, not to $3x$, and $(-2)^{-2}$ is positive because the power $(-2)^{2}$ is.",
        "求 $x = -2$ 时 $3x^{-2} - x^{0}$ 的值，代入时加上括号：$3(-2)^{-2} - (-2)^{0} = 3 \\cdot \\frac{1}{4} - 1 = -\\frac{1}{4}$。指数作用于 $x$ 而不是 $3x$；$(-2)^{-2}$ 是正数，因为 $(-2)^{2}$ 是正数。",
      ),
      generate(rng) {
        const x = rng.pick([-3, -2, 2, 3, 4, 5]);
        const c = rng.int(2, 8);
        const k = rng.int(1, Math.abs(x) > 3 ? 1 : 2);
        const d = rng.pick([0, 1, 2, 3, 5]);
        const op = rng.pick([1, -1]);
        const last = d === 0 ? "x^{0}" : String(d);
        const lastValue = d === 0 ? Q.one : Q.of(d);
        const expr = `${c}x^{-${k}} ${op > 0 ? "+" : "-"} ${last}`;
        const px = Q.of(x).pow(k);
        const answer = Q.of(c)
          .div(px)
          .add(lastValue.mul(Q.of(op)));
        return numberProblem({
          prompt: t(`Evaluate $${expr}$ for $x = ${x}$.`, `当 $x = ${x}$ 时，求 $${expr}$ 的值。`),
          answer,
          // The power read as a negative number, the coefficient raised to the power too, and the zeroth power taken as 0.
          wrong: [
            Q.of(c)
              .mul(px.neg())
              .add(lastValue.mul(Q.of(op))),
            Q.one.div(Q.of(c * x).pow(k)).add(lastValue.mul(Q.of(op))),
            ...(d === 0 ? [Q.of(c).div(px)] : []),
          ],
          solution: t(
            `Substitute $x = ${x}$ in parentheses and evaluate the powers first:${steps(`${c}(${x})^{-${k}} ${op > 0 ? "+" : "-"} ${d === 0 ? `(${x})^{0}` : d} = ${c} \\cdot \\frac{1}{${px.toLatex()}} ${op > 0 ? "+" : "-"} ${lastValue.toLatex()} = ${answer.toLatex()}`)}`,
            `把 $x = ${x}$ 加括号代入，先算乘方：${steps(`${c}(${x})^{-${k}} ${op > 0 ? "+" : "-"} ${d === 0 ? `(${x})^{0}` : d} = ${c} \\cdot \\frac{1}{${px.toLatex()}} ${op > 0 ? "+" : "-"} ${lastValue.toLatex()} = ${answer.toLatex()}`)}`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// The rules of exponents

/** exps draws a nonzero exponent, negative with the given probability. */
function exps(rng: Rng, negative = 0.35): number {
  const e = rng.int(1, 9);
  return rng.bool(negative) ? -e : e;
}

/** theProductRuleForExponents multiplies powers of the same base by adding exponents. */
export const theProductRuleForExponents = topic(
  "the-product-rule-for-exponents",
  t("The Product Rule for Exponents", "同底数幂的乘法"),
  t(
    "To multiply powers of the same base, keep the base and add the exponents: bᵐ · bⁿ = bᵐ⁺ⁿ. The rule holds for negative exponents too. The exponents are added, not multiplied, and the bases must be the same.",
    "同底数幂相乘，底数不变，指数相加：bᵐ · bⁿ = bᵐ⁺ⁿ。指数为负数时法则同样成立。指数是相加而不是相乘，而且底数必须相同。",
  ),
  ["negative-exponents"],
  ["8.EE.A.1"],
  [
    {
      id: "multiplying-powers-of-a-number",
      title: t("Multiplying powers of a number", "同底数的数的幂相乘"),
      explanation: t(
        "$5^{3} \\cdot 5^{4}$ is three factors of $5$ followed by four more, $5^{7}$ in all. With a negative exponent the factors cancel: $5^{3} \\cdot 5^{-7} = \\frac{5 \\cdot 5 \\cdot 5}{5 \\cdot 5 \\cdot 5 \\cdot 5 \\cdot 5 \\cdot 5 \\cdot 5} = 5^{-4}$, and $3 + (-7) = -4$.",
        "$5^{3} \\cdot 5^{4}$ 是三个 $5$ 再乘四个 $5$，共 $5^{7}$。指数为负数时因数会约去：$5^{3} \\cdot 5^{-7} = \\frac{5 \\cdot 5 \\cdot 5}{5 \\cdot 5 \\cdot 5 \\cdot 5 \\cdot 5 \\cdot 5 \\cdot 5} = 5^{-4}$，而 $3 + (-7) = -4$。",
      ),
      generate(rng) {
        const b = rng.int(2, 9);
        const es = Array.from({ length: rng.bool(0.3) ? 3 : 2 }, () => exps(rng));
        const k = es.reduce((a, e) => a + e, 0);
        const expr = es.map((e) => `${b}^{${e}}`).join(" \\cdot ");
        return exponentProblem(
          b,
          expr,
          k,
          t(
            `The bases are the same, so add the exponents:${steps(`${expr} = ${b}^{${es.map(signed).join(" + ")}} = ${b}^{${k}}`)}`,
            `底数相同，指数相加：${steps(`${expr} = ${b}^{${es.map(signed).join(" + ")}} = ${b}^{${k}}`)}`,
          ),
          // Multiplying the exponents, and ignoring the signs.
          [es.reduce((a, e) => a * e, 1), es.reduce((a, e) => a + Math.abs(e), 0)],
        );
      },
    },
    {
      id: "multiplying-monomials",
      title: t("Multiplying monomials", "单项式相乘"),
      explanation: t(
        "To multiply monomials, multiply the coefficients and add the exponents of each variable: $(2x^{3}y)(-4x^{5}y^{2}) = -8x^{8}y^{3}$. Remember that $y$ means $y^{1}$. If an exponent comes out negative, move that factor below the fraction bar: $x^{2} \\cdot x^{-5} = x^{-3} = \\frac{1}{x^{3}}$.",
        "单项式相乘时，系数相乘，同一个字母的指数相加：$(2x^{3}y)(-4x^{5}y^{2}) = -8x^{8}y^{3}$。注意 $y$ 就是 $y^{1}$。如果指数算出来是负数，就把这个因数移到分数线下方：$x^{2} \\cdot x^{-5} = x^{-3} = \\frac{1}{x^{3}}$。",
      ),
      generate(rng) {
        const [a, b] = [rng.pick([1, 2, 3, 4, 5, -2, -3]), rng.pick([2, 3, 4, 5, 6, -1, -4])];
        const [m, n] = [rng.int(1, 7), rng.bool(0.3) ? -rng.int(1, 9) : rng.int(1, 6)];
        const [p, q] = rng.bool(0.5) ? [rng.int(1, 4), rng.int(1, 4)] : [0, 0];
        const left: Factors = [
          ["x", m],
          ["y", p],
        ];
        const right: Factors = [
          ["x", n],
          ["y", q],
        ];
        const sumF: Factors = [
          ["x", m + n],
          ["y", p + q],
        ];
        const answer = positive(Q.of(a * b), sumF);
        return expressionProblem({
          prompt: t(
            `Simplify $(${mono(a, left)})(${mono(b, right)})$. Use only positive exponents.`,
            `化简 $(${mono(a, left)})(${mono(b, right)})$，结果只用正整数指数。`,
          ),
          answer,
          simplified: true,
          // Multiplying the exponents, adding the coefficients, and leaving the variables' exponents unchanged on one factor.
          wrong: [
            positive(Q.of(a * b), [
              ["x", m * n],
              ["y", p * q],
            ]),
            positive(Q.of(a + b), sumF),
          ],
          solution: t(
            `Multiply the coefficients and add the exponents of each variable:${steps(`${a * b === 1 ? "" : a * b === -1 ? "-" : a * b}x^{${m} + ${signed(n)}}${p + q ? `y^{${p} + ${q}}` : ""} = ${answer}`)}`,
            `系数相乘，同一个字母的指数相加：${steps(`${a * b === 1 ? "" : a * b === -1 ? "-" : a * b}x^{${m} + ${signed(n)}}${p + q ? `y^{${p} + ${q}}` : ""} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

/** theQuotientRuleForExponents divides powers of the same base by subtracting exponents. */
export const theQuotientRuleForExponents = topic(
  "the-quotient-rule-for-exponents",
  t("The Quotient Rule for Exponents", "同底数幂的除法"),
  t(
    "To divide powers of the same nonzero base, keep the base and subtract the exponent of the denominator from that of the numerator: bᵐ ÷ bⁿ = bᵐ⁻ⁿ. If the denominator has the larger exponent, the result has a negative exponent.",
    "同底数（非零）幂相除，底数不变，用分子的指数减去分母的指数：bᵐ ÷ bⁿ = bᵐ⁻ⁿ。如果分母的指数较大，结果的指数为负数。",
  ),
  ["the-product-rule-for-exponents"],
  ["8.EE.A.1"],
  [
    {
      id: "dividing-powers-of-a-number",
      title: t("Dividing powers of a number", "同底数的数的幂相除"),
      explanation: t(
        "In $\\frac{7^{9}}{7^{4}}$, four factors of $7$ cancel, leaving $7^{9 - 4} = 7^{5}$. Subtract in order, numerator minus denominator: $\\frac{7^{2}}{7^{6}} = 7^{2 - 6} = 7^{-4}$. With negative exponents, subtracting a negative adds: $\\frac{7^{3}}{7^{-2}} = 7^{3 - (-2)} = 7^{5}$.",
        "在 $\\frac{7^{9}}{7^{4}}$ 中，约去四个 $7$，剩下 $7^{9 - 4} = 7^{5}$。要按顺序相减，分子的指数减分母的指数：$\\frac{7^{2}}{7^{6}} = 7^{2 - 6} = 7^{-4}$。有负指数时，减去负数就是加：$\\frac{7^{3}}{7^{-2}} = 7^{3 - (-2)} = 7^{5}$。",
      ),
      generate(rng) {
        const b = rng.int(2, 9);
        const [m, n] = [exps(rng, 0.3), exps(rng, 0.3)];
        if (m === n) return this.generate(rng);
        const k = m - n;
        const expr = rng.bool(0.7) ? `\\frac{${b}^{${m}}}{${b}^{${n}}}` : `${b}^{${m}} \\div ${b}^{${n}}`;
        return exponentProblem(
          b,
          expr,
          k,
          t(
            `The bases are the same, so subtract the exponents, numerator minus denominator:${steps(`${expr} = ${b}^{${m} - ${signed(n)}} = ${b}^{${k}}`)}`,
            `底数相同，指数相减，用分子的指数减分母的指数：${steps(`${expr} = ${b}^{${m} - ${signed(n)}} = ${b}^{${k}}`)}`,
          ),
          // Subtracting the other way, adding, and dividing the exponents.
          [n - m, m + n, ...(n !== 0 && m % n === 0 ? [m / n] : [])],
        );
      },
    },
    {
      id: "dividing-monomials",
      title: t("Dividing monomials", "单项式相除"),
      explanation: t(
        "Divide the coefficients and subtract the exponents of each variable: $\\frac{12x^{7}y^{2}}{4x^{2}y^{5}} = 3x^{5}y^{-3} = \\frac{3x^{5}}{y^{3}}$. A variable whose exponent comes out negative ends up in the denominator.",
        "系数相除，同一个字母的指数相减：$\\frac{12x^{7}y^{2}}{4x^{2}y^{5}} = 3x^{5}y^{-3} = \\frac{3x^{5}}{y^{3}}$。指数算出来为负数的字母最后在分母中。",
      ),
      generate(rng) {
        const d = rng.int(2, 6);
        const k = rng.pick([1, 2, 3, 4, 5, -2, -3]);
        const [m, n] = [rng.int(2, 9), rng.int(1, 6)];
        const [p, q] = [rng.int(1, 5), rng.int(1, 6)];
        if (m === n && p === q) return this.generate(rng);
        const top: Factors = [
          ["x", m],
          ["y", p],
        ];
        const bottom: Factors = [
          ["x", n],
          ["y", q],
        ];
        const diff: Factors = [
          ["x", m - n],
          ["y", p - q],
        ];
        const expr = `\\frac{${mono(d * k, top)}}{${mono(d, bottom)}}`;
        const answer = positive(Q.of(k), diff);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Use only positive exponents.`, `化简 $${expr}$，结果只用正整数指数。`),
          answer,
          simplified: true,
          // Subtracting the coefficients, dividing the exponents, and subtracting the wrong way round.
          wrong: [
            ...(k === 1 ? [] : [positive(Q.of(d * k - d), diff)]),
            positive(Q.of(k), [
              ["x", n - m],
              ["y", q - p],
            ]),
            positive(Q.of(k), [
              ["x", m + n],
              ["y", p + q],
            ]),
          ],
          solution: t(
            `Divide the coefficients and subtract the exponents of each variable:${steps(`${expr} = ${k === 1 ? "" : k === -1 ? "-" : k}x^{${m} - ${n}}y^{${p} - ${q}} = ${answer}`)}`,
            `系数相除，同一个字母的指数相减：${steps(`${expr} = ${k === 1 ? "" : k === -1 ? "-" : k}x^{${m} - ${n}}y^{${p} - ${q}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

/** thePowerRuleForExponents raises a power to a power by multiplying exponents. */
export const thePowerRuleForExponents = topic(
  "the-power-rule-for-exponents",
  t("The Power Rule for Exponents", "幂的乘方"),
  t(
    "To raise a power to a power, keep the base and multiply the exponents: (bᵐ)ⁿ = bᵐⁿ. The signs of the exponents multiply like any numbers, so (b⁻²)³ = b⁻⁶ and (b⁻²)⁻³ = b⁶.",
    "幂的乘方，底数不变，指数相乘：(bᵐ)ⁿ = bᵐⁿ。指数的符号按普通乘法相乘，所以 (b⁻²)³ = b⁻⁶，(b⁻²)⁻³ = b⁶。",
  ),
  ["the-product-rule-for-exponents"],
  ["8.EE.A.1"],
  [
    {
      id: "powers-of-powers-of-a-number",
      title: t("Powers of powers of a number", "数的幂的乘方"),
      explanation: t(
        "$(3^{2})^{4} = 3^{2} \\cdot 3^{2} \\cdot 3^{2} \\cdot 3^{2} = 3^{2 + 2 + 2 + 2} = 3^{8}$: four copies of the exponent $2$ add to $2 \\times 4$. So multiply the exponents; adding them, to get $3^{6}$, is a common mistake.",
        "$(3^{2})^{4} = 3^{2} \\cdot 3^{2} \\cdot 3^{2} \\cdot 3^{2} = 3^{2 + 2 + 2 + 2} = 3^{8}$：四个指数 $2$ 相加，等于 $2 \\times 4$。所以指数相乘；把它们相加得到 $3^{6}$ 是常见错误。",
      ),
      generate(rng) {
        const b = rng.int(2, 9);
        const [m, n] = [exps(rng, 0.35), rng.bool(0.3) ? -rng.int(2, 5) : rng.int(2, 6)];
        const two = rng.bool(0.3);
        const p = two ? rng.int(1, 6) : 0;
        const expr = two ? `(${b}^{${m}})^{${n}} \\cdot ${b}^{${p}}` : `(${b}^{${m}})^{${n}}`;
        const k = m * n + p;
        return exponentProblem(
          b,
          expr,
          k,
          t(
            `Multiply the exponents to raise a power to a power${two ? ", then add the exponents to multiply" : ""}:${steps(two ? `${expr} = ${b}^{${m * n}} \\cdot ${b}^{${p}} = ${b}^{${k}}` : `${expr} = ${b}^{${m} \\cdot ${signed(n)}} = ${b}^{${k}}`)}`,
            `幂的乘方指数相乘${two ? "，再按同底数幂相乘把指数相加" : ""}：${steps(two ? `${expr} = ${b}^{${m * n}} \\cdot ${b}^{${p}} = ${b}^{${k}}` : `${expr} = ${b}^{${m} \\cdot ${signed(n)}} = ${b}^{${k}}`)}`,
          ),
          // Adding the exponents, and multiplying all of them.
          [m + n + p, two ? m * n * p : -k],
        );
      },
    },
    {
      id: "powers-of-powers-of-variables",
      title: t("Powers of powers of variables", "字母的幂的乘方"),
      explanation: t(
        "When a power is raised to another power, keep the base and multiply the exponents: $(x^{m})^{n} = x^{mn}$. This works for negative exponents too. After that, combine powers of the same base by adding their exponents.\n\n$(x^{3})^{-2} = x^{3 \\cdot (-2)} = x^{-6} = \\frac{1}{x^{6}}$, and $(x^{4})^{2} \\cdot x^{-3} = x^{8} \\cdot x^{-3} = x^{5}$. Apply the power rule first, then combine with the product rule.",
        "幂的乘方，底数不变，指数相乘：$(x^{m})^{n} = x^{mn}$。指数是负数时也成立。之后，同底数的幂相乘时把指数相加。\n\n$(x^{3})^{-2} = x^{3 \\cdot (-2)} = x^{-6} = \\frac{1}{x^{6}}$，$(x^{4})^{2} \\cdot x^{-3} = x^{8} \\cdot x^{-3} = x^{5}$。先用幂的乘方法则，再用同底数幂的乘法合并。",
      ),
      generate(rng) {
        const [m, n] = [rng.bool(0.3) ? -rng.int(1, 5) : rng.int(2, 6), rng.bool(0.4) ? -rng.int(2, 4) : rng.int(2, 5)];
        const p = rng.bool(0.5) ? exps(rng, 0.5) : 0;
        const expr = p ? `(x^{${m}})^{${n}} \\cdot x^{${p}}` : `(x^{${m}})^{${n}}`;
        const k = m * n + p;
        if (k === 0) return this.generate(rng);
        const answer = positive(Q.one, [["x", k]]);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Use only positive exponents.`, `化简 $${expr}$，结果只用正整数指数。`),
          answer,
          simplified: true,
          // Adding instead of multiplying, and dropping the sign of the result.
          wrong: [positive(Q.one, [["x", m + n + p]]), positive(Q.one, [["x", Math.abs(k)]]), positive(Q.one, [["x", -k]])],
          solution: t(
            `Multiply the exponents${p ? ", then add the exponent of the last factor" : ""}:${steps(`${expr} = x^{${k}} = ${answer}`)}`,
            `指数相乘${p ? "，再加上最后一个因数的指数" : ""}：${steps(`${expr} = x^{${k}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

/** thePowerOfProductRuleForExponents raises a product to a power factor by factor. */
export const thePowerOfProductRuleForExponents = topic(
  "the-power-of-product-rule-for-exponents",
  t("The Power-of-a-Product Rule for Exponents", "积的乘方"),
  t(
    "A power of a product is the product of the powers of its factors: (ab)ⁿ = aⁿbⁿ. Every factor inside the parentheses is raised to the power, including the coefficient and its sign: (−2x³)² = 4x⁶.",
    "积的乘方等于各因数乘方的积：(ab)ⁿ = aⁿbⁿ。括号里的每个因数都要乘方，包括系数和它的符号：(−2x³)² = 4x⁶。",
  ),
  ["the-power-rule-for-exponents"],
  ["8.EE.A.1"],
  [
    {
      id: "powers-of-monomials",
      title: t("Powers of monomials", "单项式的乘方"),
      explanation: t(
        "$(3x^{4})^{2} = 3^{2}(x^{4})^{2} = 9x^{8}$. Raise the coefficient to the power, not multiply it by the exponent: $3^{2} = 9$, not $6$. A negative coefficient keeps its sign for an odd power: $(-2x^{2})^{3} = -8x^{6}$.",
        "$(3x^{4})^{2} = 3^{2}(x^{4})^{2} = 9x^{8}$。系数要乘方，而不是乘以指数：$3^{2} = 9$，不是 $6$。系数为负数时，奇数次幂仍为负：$(-2x^{2})^{3} = -8x^{6}$。",
      ),
      generate(rng) {
        const c = rng.pick([2, 3, 4, 5, -2, -3]);
        const n = rng.int(2, Math.abs(c) > 3 ? 2 : 4);
        const [m, p] = [rng.int(1, 6), rng.bool(0.4) ? rng.int(1, 4) : 0];
        const inside: Factors = [
          ["x", m],
          ["y", p],
        ];
        const out: Factors = [
          ["x", m * n],
          ["y", p * n],
        ];
        const cn = c ** n;
        const expr = `(${mono(c, inside)})^{${n}}`;
        const answer = mono(cn, out);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          // Multiplying the coefficient by the exponent, leaving the coefficient alone, adding exponents, and losing the sign.
          wrong: [
            mono(c * n, out),
            mono(c, out),
            mono(
              cn,
              inside.map(([v, e]) => [v, e ? e + n : 0] as const),
            ),
            mono(-cn, out),
          ],
          solution: t(
            `Raise every factor to the power $${n}$:${steps(`${expr} = ${c < 0 ? `(${c})` : c}^{${n}}${m ? `(x^{${m}})^{${n}}` : ""}${p ? `(${p === 1 ? "y" : `y^{${p}}`})^{${n}}` : ""} = ${answer}`)}`,
            `括号里的每个因数都乘 $${n}$ 次方：${steps(`${expr} = ${c < 0 ? `(${c})` : c}^{${n}}${m ? `(x^{${m}})^{${n}}` : ""}${p ? `(${p === 1 ? "y" : `y^{${p}}`})^{${n}}` : ""} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "powers-of-products-with-negative-exponents",
      title: t("Negative exponents in powers of products", "积的乘方中的负整数指数"),
      explanation: t(
        "$(2x^{3}y^{-1})^{-2} = 2^{-2}x^{-6}y^{2} = \\frac{y^{2}}{4x^{6}}$. Multiply each exponent by the outer one, signs included, then move the factors with negative exponents below the fraction bar. The coefficient $2^{-2}$ becomes $\\frac{1}{4}$.",
        "$(2x^{3}y^{-1})^{-2} = 2^{-2}x^{-6}y^{2} = \\frac{y^{2}}{4x^{6}}$。每个指数都乘以外面的指数（连同符号），再把带负整数指数的因数移到分数线下方。系数 $2^{-2}$ 变成 $\\frac{1}{4}$。",
      ),
      generate(rng) {
        const c = rng.pick([1, 2, 3, 5]);
        const n = rng.pick([-1, -2, -3, 2, 3]);
        const [m, p] = [rng.int(1, 4), -rng.int(1, 3)];
        if (n > 0 && c === 1) return this.generate(rng);
        if (Math.abs(n) === 3 && c > 3) return this.generate(rng);
        const inside: Factors = [
          ["x", m],
          ["y", p],
        ];
        const out: Factors = [
          ["x", m * n],
          ["y", p * n],
        ];
        const coef = Q.of(c).pow(n);
        const expr = `(${mono(c, inside)})^{${n}}`;
        const answer = positive(coef, out);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Use only positive exponents.`, `化简 $${expr}$，结果只用正整数指数。`),
          answer,
          simplified: true,
          // Not raising the coefficient, multiplying it by the exponent, and adding the exponents.
          wrong: [
            positive(Q.of(c), out),
            positive(Q.of(Math.abs(c * n)), out),
            positive(
              coef,
              inside.map(([v, e]) => [v, e + n] as const),
            ),
          ],
          solution: t(
            `Multiply each exponent by $${n}$, then write the factors with negative exponents below the fraction bar:${steps(`${expr} = ${c}^{${n}}x^{${m * n}}y^{${p * n}} = ${answer}`)}`,
            `每个指数都乘以 $${n}$，再把带负整数指数的因数写到分数线下方：${steps(`${expr} = ${c}^{${n}}x^{${m * n}}y^{${p * n}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

/** thePowerOfQuotientRuleForExponents raises a quotient to a power, numerator and denominator alike. */
export const thePowerOfQuotientRuleForExponents = topic(
  "the-power-of-quotient-rule-for-exponents",
  t("The Power-of-a-Quotient Rule for Exponents", "商的乘方"),
  t(
    "A power of a quotient is the quotient of the powers: (a/b)ⁿ = aⁿ/bⁿ. Both the numerator and the denominator are raised to the power. A negative exponent flips the fraction first: (a/b)⁻ⁿ = (b/a)ⁿ.",
    "商的乘方等于分子、分母分别乘方的商：(a/b)ⁿ = aⁿ/bⁿ。分子和分母都要乘方。负整数指数先把分数颠倒：(a/b)⁻ⁿ = (b/a)ⁿ。",
  ),
  ["the-power-of-product-rule-for-exponents"],
  ["8.EE.A.1"],
  [
    {
      id: "powers-of-fractions",
      title: t("Powers of fractions", "分数的乘方"),
      explanation: t(
        "To raise a fraction to a power, raise both the numerator and the denominator to that power: $\\left(\\frac{a}{b}\\right)^{n} = \\frac{a^{n}}{b^{n}}$. A negative exponent flips the fraction, so $\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^{n}$.\n\n$\\left(\\frac{2}{3}\\right)^{4} = \\frac{2^{4}}{3^{4}} = \\frac{16}{81}$: raise the denominator as well as the numerator. With a negative exponent, flip first: $\\left(\\frac{2}{5}\\right)^{-2} = \\left(\\frac{5}{2}\\right)^{2} = \\frac{25}{4}$.",
        "分数的乘方，把分子和分母分别乘方：$\\left(\\frac{a}{b}\\right)^{n} = \\frac{a^{n}}{b^{n}}$。负整数指数会把分数颠倒，所以 $\\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^{n}$。\n\n$\\left(\\frac{2}{3}\\right)^{4} = \\frac{2^{4}}{3^{4}} = \\frac{16}{81}$：分母和分子一样都要乘方。指数为负数时先颠倒：$\\left(\\frac{2}{5}\\right)^{-2} = \\left(\\frac{5}{2}\\right)^{2} = \\frac{25}{4}$。",
      ),
      generate(rng) {
        const f0 = rng.pick([Q.of(1, 2), Q.of(2, 3), Q.of(3, 4), Q.of(1, 3), Q.of(2, 5), Q.of(3, 5), Q.of(4, 5), Q.of(5, 3), Q.of(3, 2)]);
        const f = rng.bool(0.3) ? f0.neg() : f0;
        const negative = rng.bool(0.45);
        const n = rng.int(2, f0.n > 3n || f0.d > 3n ? 3 : 4) * (negative ? -1 : 1);
        const k = Math.abs(n);
        const answer = f.pow(k);
        const result = negative ? Q.one.div(answer) : answer;
        const [a, b] = negative ? [Number(f.d), Number(f.n)] : [Number(f.n), Number(f.d)];
        return numberProblem({
          prompt: t(`Evaluate $${power(f, n)}$.`, `计算 $${power(f, n)}$。`),
          answer: result,
          // Raising only the numerator, multiplying by the exponent, and not flipping for a negative exponent.
          wrong: [Q.of(a ** k, b), Q.of(a * k, b), ...(negative ? [answer] : [])],
          solution: t(
            `${negative ? `Flip the fraction to make the exponent positive, then raise` : "Raise"} the numerator and the denominator to the power:${steps(`${power(f, n)} = ${negative ? `${power(Q.one.div(f), -n)} = ` : ""}${result.toLatex()}`)}`,
            `${negative ? "先把分数颠倒，使指数变为正数，再把" : "把"}分子和分母分别乘方：${steps(`${power(f, n)} = ${negative ? `${power(Q.one.div(f), -n)} = ` : ""}${result.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "powers-of-algebraic-fractions",
      title: t("Powers of algebraic fractions", "字母分式的乘方"),
      explanation: t(
        "A fraction with variables is raised to a power the same way as a numerical one. Each factor on top and each factor on the bottom gets the exponent, and a factor that is already a power has its exponents multiplied.\n\n$\\left(\\frac{x^{2}}{3y}\\right)^{3} = \\frac{(x^{2})^{3}}{3^{3}y^{3}} = \\frac{x^{6}}{27y^{3}}$. Raise every factor of the numerator and of the denominator, including the number $3$.",
        "含字母的分式乘方与数的分数乘方方法相同：分子的每个因数和分母的每个因数都要乘方，本身已经是幂的因数则把指数相乘。\n\n$\\left(\\frac{x^{2}}{3y}\\right)^{3} = \\frac{(x^{2})^{3}}{3^{3}y^{3}} = \\frac{x^{6}}{27y^{3}}$。分子和分母的每个因数都要乘方，包括数 $3$。",
      ),
      generate(rng) {
        const [a, c] = [rng.pick([1, 2, 3]), rng.pick([2, 3, 5])];
        if (a === c) return this.generate(rng);
        const n = rng.int(2, a > 2 || c > 3 ? 2 : 3);
        const [m, p] = [rng.int(1, 5), rng.int(1, 4)];
        const top = mono(a, [["x", m]]);
        const bottom = mono(c, [["y", p]]);
        const expr = `\\left(\\frac{${top}}{${bottom}}\\right)^{${n}}`;
        const answer = `\\frac{${mono(a ** n, [["x", m * n]])}}{${mono(c ** n, [["y", p * n]])}}`;
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          // Not raising the number in the denominator, raising only the numerator, and adding exponents.
          wrong: [
            `\\frac{${mono(a ** n, [["x", m * n]])}}{${mono(c, [["y", p * n]])}}`,
            `\\frac{${mono(a ** n, [["x", m * n]])}}{${bottom}}`,
            `\\frac{${mono(a ** n, [["x", m + n]])}}{${mono(c ** n, [["y", p + n]])}}`,
          ],
          solution: t(
            `Raise every factor of the numerator and the denominator to the power $${n}$:${steps(`${expr} = \\frac{${a === 1 ? "" : `${a}^{${n}}`}(x^{${m}})^{${n}}}{${c}^{${n}}(${p === 1 ? "y" : `y^{${p}}`})^{${n}}} = ${answer}`)}`,
            `分子和分母的每个因数都乘 $${n}$ 次方：${steps(`${expr} = \\frac{${a === 1 ? "" : `${a}^{${n}}`}(x^{${m}})^{${n}}}{${c}^{${n}}(${p === 1 ? "y" : `y^{${p}}`})^{${n}}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

/** combiningTheRulesOfExponents uses several rules of exponents in one simplification. */
export const combiningTheRulesOfExponents = topic(
  "combining-the-rules-of-exponents",
  t("Combining the Rules of Exponents", "综合运用幂的运算法则"),
  t(
    "To simplify an expression with several powers, apply the power rules to anything in parentheses first, then combine powers of the same base by adding exponents for products and subtracting them for quotients. Write the final answer with positive exponents.",
    "化简含有多个幂的式子时，先对括号里的部分用乘方法则，再把同底数的幂合并：相乘时指数相加，相除时指数相减。最后的结果用正整数指数表示。",
  ),
  ["the-quotient-rule-for-exponents", "the-power-of-quotient-rule-for-exponents"],
  ["8.EE.A.1"],
  [
    {
      id: "combining-rules-with-numbers",
      title: t("Combining rules with numbers", "数的幂的综合运算"),
      explanation: t(
        "$\\frac{2^{5} \\cdot 2^{-2}}{(2^{2})^{3}}$: the numerator is $2^{5 + (-2)} = 2^{3}$ and the denominator is $2^{2 \\cdot 3} = 2^{6}$, so the quotient is $2^{3 - 6} = 2^{-3}$. Work out the exponent step by step before evaluating anything.",
        "$\\frac{2^{5} \\cdot 2^{-2}}{(2^{2})^{3}}$：分子是 $2^{5 + (-2)} = 2^{3}$，分母是 $2^{2 \\cdot 3} = 2^{6}$，所以商是 $2^{3 - 6} = 2^{-3}$。先一步步算出指数，再考虑求值。",
      ),
      generate(rng) {
        const b = rng.int(2, 9);
        const [m, n] = [exps(rng, 0.3), exps(rng, 0.3)];
        const [p, q] = [rng.bool(0.3) ? -rng.int(1, 4) : rng.int(2, 4), rng.int(2, 4)];
        const powerOnTop = rng.bool();
        const top = powerOnTop ? m + p * q : m + n;
        const bottom = powerOnTop ? n : p * q;
        const expr = powerOnTop
          ? `\\frac{${b}^{${m}} \\cdot (${b}^{${p}})^{${q}}}{${b}^{${n}}}`
          : `\\frac{${b}^{${m}} \\cdot ${b}^{${n}}}{(${b}^{${p}})^{${q}}}`;
        const k = top - bottom;
        return exponentProblem(
          b,
          expr,
          k,
          t(
            `Simplify the numerator and the denominator, then subtract the exponents:${steps(`${expr} = \\frac{${b}^{${top}}}{${b}^{${bottom}}} = ${b}^{${top} - ${signed(bottom)}} = ${b}^{${k}}`)}`,
            `先化简分子和分母，再把指数相减：${steps(`${expr} = \\frac{${b}^{${top}}}{${b}^{${bottom}}} = ${b}^{${top} - ${signed(bottom)}} = ${b}^{${k}}`)}`,
          ),
          // Adding the power instead of multiplying, and subtracting the wrong way round.
          [powerOnTop ? m + p + q - n : m + n - (p + q), bottom - top],
        );
      },
    },
    {
      id: "combining-rules-with-monomials",
      title: t("Combining rules with monomials", "单项式的综合运算"),
      explanation: t(
        "$\\frac{(2x^{3})^{2} \\cdot x^{-4}}{8x} = \\frac{4x^{6} \\cdot x^{-4}}{8x} = \\frac{4x^{2}}{8x} = \\frac{x}{2}$. Expand the power first, combine the numerator, then divide the coefficients and subtract the exponents.",
        "$\\frac{(2x^{3})^{2} \\cdot x^{-4}}{8x} = \\frac{4x^{6} \\cdot x^{-4}}{8x} = \\frac{4x^{2}}{8x} = \\frac{x}{2}$。先展开乘方，再合并分子，最后系数相除、指数相减。",
      ),
      generate(rng) {
        const c = rng.pick([2, 3]);
        const n = rng.pick([2, 3]);
        const m = rng.int(1, 4);
        const p = exps(rng, 0.6);
        const d = rng.pick([1, 2, 3, 4, 6, 8, 9, 12]);
        const e = rng.int(1, 6);
        const k = m * n + p - e;
        const coef = Q.of(c ** n, d);
        if (k === 0 && coef.isInteger() && coef.eq(Q.one)) return this.generate(rng);
        const expr = `\\frac{(${mono(c, [["x", m]])})^{${n}} \\cdot x^{${p}}}{${mono(d, [["x", e]])}}`;
        const answer = positive(coef, [["x", k]]);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Use only positive exponents.`, `化简 $${expr}$，结果只用正整数指数。`),
          answer,
          simplified: true,
          // Not raising the coefficient, adding the power's exponents, and dividing exponents' signs wrongly.
          wrong: [positive(Q.of(c, d), [["x", k]]), positive(coef, [["x", m + n + p - e]]), positive(coef, [["x", m * n + p + e]])],
          solution: t(
            `Expand the power, combine the numerator, then divide:${steps(`${expr} = \\frac{${mono(c ** n, [["x", m * n]])} \\cdot x^{${p}}}{${mono(d, [["x", e]])}} = \\frac{${mono(c ** n, [["x", m * n + p]])}}{${mono(d, [["x", e]])}} = ${answer}`)}`,
            `先展开乘方，合并分子，再相除：${steps(`${expr} = \\frac{${mono(c ** n, [["x", m * n]])} \\cdot x^{${p}}}{${mono(d, [["x", e]])}} = \\frac{${mono(c ** n, [["x", m * n + p]])}}{${mono(d, [["x", e]])}} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
);

/** grade8ExponentTopics lists the 8th grade topics on integer exponents and the rules of exponents. */
export const grade8ExponentTopics: readonly TopicDef[] = [
  theZerothPower,
  powersOfNegativeOne,
  negativeExponents,
  evaluatingExpressionsWithIntegerExponents,
  theProductRuleForExponents,
  theQuotientRuleForExponents,
  thePowerRuleForExponents,
  thePowerOfProductRuleForExponents,
  thePowerOfQuotientRuleForExponents,
  combiningTheRulesOfExponents,
];
