import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { dec, linear, num, poly, Q } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, steps } from "../problems.ts";

/** m writes LaTeX as a text that is the same in every locale. */
const m = (latex: string) => same(`$${latex}$`);

/** both builds a text from one English and one Chinese sentence around the same LaTeX steps. */
const both = (en: string, zh: string, ...lines: string[]) => t(`${en}${steps(...lines)}`, `${zh}${steps(...lines)}`);

/** group writes an expression in parentheses when it is a sum or difference outside its own parentheses and braces. */
function group(s: string): string {
  let top = s.replace(/\\left\(/g, "(").replace(/\\right\)/g, ")");
  for (let prev = ""; prev !== top; ) {
    prev = top;
    top = top.replace(/\([^()]*\)|\{[^{}]*\}/g, "");
  }
  return /[+-]/.test(top.slice(1)) ? `\\left(${s}\\right)` : s;
}

/** sumL writes a sum in sigma notation over k: "\sum_{k=1}^{10} (2k + 1)". */
const sumL = (lo: number | string, hi: number | string, body: string) => `\\sum_{k=${lo}}^{${hi}} ${group(body)}`;

/** add writes a term after another, with its sign as the operator: " + 3", " - \frac{1}{2}". */
const add = (v: Q) => (v.sign() < 0 ? ` - ${v.neg().toLatex()}` : ` + ${v.toLatex()}`);

/** seriesL writes a series: all terms when there are few, else the first three, "\cdots" and the last. */
function seriesL(terms: readonly Q[], shown = 3): string {
  const head = terms.length <= shown + 2 ? terms : terms.slice(0, shown);
  let s = head.map((v, i) => (i === 0 ? v.toLatex() : add(v))).join("");
  if (head.length < terms.length) s += ` + \\cdots${add(terms[terms.length - 1]!)}`;
  return s;
}

/** openL writes the first three terms of a series that goes on: "3 + 6 + 12 + \cdots". */
const openL = (terms: readonly Q[]) => `${seriesL(terms.slice(0, 3))} + \\cdots`;

/** listL writes every term of a series, negative terms in parentheses: "3 + (-1) + 5". */
const listL = (terms: readonly Q[]) => terms.map((v, i) => (i > 0 && v.sign() < 0 ? `(${v.toLatex()})` : v.toLatex())).join(" + ");

/** range lists the integers from lo to hi. */
const range = (lo: number, hi: number) => Array.from({ length: Math.max(0, hi - lo + 1) }, (_, i) => lo + i);

/** total adds rational numbers. */
const total = (vs: readonly Q[]) => vs.reduce((s, v) => s.add(v), Q.zero);

/** arithmetic is the first n terms of the arithmetic sequence with first term a1 and common difference d. */
const arithmetic = (a1: number, d: number, n: number) => range(0, n - 1).map((i) => Q.of(a1 + i * d));

/** arithmeticSum is the sum of the first n terms of the arithmetic sequence with first term a1 and common difference d. */
const arithmeticSum = (a1: number, d: number, n: number) => n * a1 + (n * (n - 1) * d) / 2;

/** arithmeticTerm writes the kth term dk + (a1 - d) of an arithmetic sequence. */
const arithmeticTerm = (a1: number, d: number) => poly([d, "k"], [a1 - d, ""]);

/** geometric is the first n terms of the geometric sequence with first term a and common ratio r. */
const geometric = (a: Q, r: Q, n: number) => range(0, n - 1).map((i) => a.mul(r.pow(i)));

/** geometricSum is the sum of the first n terms of the geometric sequence with first term a and common ratio r. */
const geometricSum = (a: Q, r: Q, n: number) => total(geometric(a, r, n));

/** base writes a ratio as the base of a power, in parentheses when it is negative or a fraction. */
const base = (r: Q) => (r.sign() < 0 || !r.isInteger() ? `\\left(${r.toLatex()}\\right)` : r.toLatex());

/** times writes c times a power: "3 \cdot 2^{k-1}", "2^{k}", "-\left(\frac{1}{2}\right)^{k}". */
function times(c: Q, power: string): string {
  if (c.eq(Q.one)) return power;
  if (c.eq(Q.one.neg())) return `-${power}`;
  return `${c.toLatex()} \\cdot ${power}`;
}

/** geometricTerm writes c · r^e for an exponent e given in LaTeX. */
const geometricTerm = (c: Q, r: Q, e: string) => times(c, `${base(r)}^{${e}}`);

/** formulaL writes the sum formula of a geometric series with the values substituted. */
const formulaL = (a: Q, r: Q, n: number) =>
  `\\frac{${a.toLatex()}\\left(1 - ${base(r)}^{${n}}\\right)}{1 - ${r.sign() < 0 ? `\\left(${r.toLatex()}\\right)` : r.toLatex()}}`;

/** choose is the binomial coefficient C(n, k). */
function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let c = 1;
  for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i;
  return Math.round(c);
}

/** binom writes a binomial coefficient: "\binom{7}{3}". */
const binom = (n: number | string, k: number | string) => `\\binom{${n}}{${k}}`;

/** pw writes a power of a variable: "", "x" or "x^{3}". */
const pw = (v: string, e: number) => (e === 0 ? "" : e === 1 ? v : `${v}^{${e}}`);

/** ordinal writes an English ordinal: "1st", "22nd", "13th". */
function ordinal(k: number): string {
  const teen = k % 100 >= 11 && k % 100 <= 13;
  const suffix = teen ? "th" : (({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[k % 10] ?? "th");
  return `${k}${suffix}`;
}

/** roundQ rounds a rational number to the given number of decimal places, halves away from zero. */
function roundQ(v: Q, places: number): Q {
  const s = 10n ** BigInt(places);
  const a = v.abs();
  const r = Q.of((2n * a.n * s + a.d) / (2n * a.d), s);
  return v.sign() < 0 ? r.neg() : r;
}

/** nearHalf tells whether v lies within 0.02 of a rounding boundary at the given number of places, where calculators may disagree. */
function nearHalf(v: Q, places: number): boolean {
  const scaled = v.abs().mul(Q.of(10n ** BigInt(places)));
  const frac = scaled.sub(Q.of(scaled.n / scaled.d));
  return frac.sub(Q.of(1, 2)).abs().cmp(Q.of(1, 50)) < 0;
}

/** money writes an amount of money with two decimal places and thousands separators: "12{,}345.60". */
function money(v: Q): string {
  const [whole = "", frac] = dec(v).split(".");
  const g = whole.replace(/\B(?=(\d{3})+$)/g, "{,}");
  return frac ? `${g}.${frac.padEnd(2, "0")}` : g;
}

/** grouped writes an integer with thousands separators: "12{,}345". */
const grouped = (v: number | Q) => num(v).replace(/\B(?=(\d{3})+$)/g, "{,}");

/** SigmaOption is a way of writing a series in sigma notation, with the kth term as a function. */
interface SigmaOption {
  readonly lo: number;
  readonly hi: number;
  readonly body: string;
  readonly f: (k: number) => Q;
}

const optionTerms = (o: SigmaOption) => range(o.lo, o.hi).map(o.f);

/** sameSeries tells whether two sums in sigma notation have the same terms. */
function sameSeries(a: SigmaOption, b: SigmaOption): boolean {
  const x = optionTerms(a);
  const y = optionTerms(b);
  return x.length === y.length && x.every((v, i) => v.eq(y[i]!));
}

/** sigmaChoice asks to pick the sum in sigma notation that represents a series, among at most three that do not. */
function sigmaChoice(rng: Rng, prompt: Text, correct: SigmaOption, distractors: readonly SigmaOption[], solution: Text): Problem {
  const kept: SigmaOption[] = [correct];
  const latex = (o: SigmaOption) => sumL(o.lo, o.hi, o.body);
  for (const o of rng.shuffle(distractors)) {
    if (kept.length < 4 && !kept.some((k) => sameSeries(k, o) || latex(k) === latex(o))) kept.push(o);
  }
  const options = rng.shuffle(kept);
  return choiceProblem({ prompt, options: options.map((o) => m(latex(o))), correct: options.indexOf(correct), solution });
}

// Arithmetic series.

/** sigmaNotation reads and evaluates sums written with the summation symbol. */
export const sigmaNotation: TopicDef = {
  id: "sigma-notation",
  title: t("Sigma Notation", "求和符号"),
  summary: t(
    "Read $\\sum_{k=m}^{n} a_k$ as the sum of the terms from $k = m$ to $k = n$, count its terms and evaluate it.",
    "把 $\\sum_{k=m}^{n} a_k$ 读作从 $k = m$ 到 $k = n$ 各项之和，数出项数并求值。",
  ),
  prerequisites: ["introduction-to-sequences"],
  encompasses: [
    { topic: "introduction-to-sequences", weight: 0.4 },
    { topic: "evaluating-expressions", weight: 0.3 },
  ],
  xp: 12,
  knowledgePoints: [
    {
      id: "evaluating-a-sum",
      title: t("Evaluating a sum", "求和式的值"),
      explanation: t(
        "A **series** is the sum of the terms of a sequence. **Sigma notation** writes it compactly with the Greek letter $\\Sigma$:\n\n$$\\sum_{k=1}^{n} a_k = a_1 + a_2 + \\cdots + a_n$$\n\nThe **index** $k$ starts at the lower limit below $\\Sigma$ and goes up by $1$ to the upper limit above it. To evaluate the sum, substitute each value of $k$ into the expression and add:\n\n$$\\sum_{k=1}^{4} (3k - 1) = 2 + 5 + 8 + 11 = 26$$",
        "**级数**是数列各项之和。**求和符号**用希腊字母 $\\Sigma$ 把它简洁地写出来：\n\n$$\\sum_{k=1}^{n} a_k = a_1 + a_2 + \\cdots + a_n$$\n\n**下标** $k$ 从 $\\Sigma$ 下方的下限开始，每次增加 $1$，直到上方的上限。求和时，把 $k$ 的每个值代入式子，再把结果相加：\n\n$$\\sum_{k=1}^{4} (3k - 1) = 2 + 5 + 8 + 11 = 26$$",
      ),
      generate(rng) {
        const n = rng.int(3, 6);
        const p = rng.nonZero(-4, 5);
        const c = rng.int(-6, 6);
        const f = (k: number) => Q.of(p * k + c);
        const body = linear(p, c, "k");
        const terms = range(1, n).map(f);
        const answer = total(terms);
        const expr = sumL(1, n, body);
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer,
          wrong: [f(n), total(terms.slice(0, -1)), Q.of((p * n * (n + 1)) / 2 + c), total(range(0, n).map(f))],
          solution: both(
            `Substitute $k = 1, 2, \\ldots, ${n}$ into $${body}$ and add the terms:`,
            `把 $k = 1, 2, \\ldots, ${n}$ 依次代入 $${body}$，再把各项相加：`,
            `${expr} = ${listL(terms)} = ${answer.toLatex()}`,
          ),
        });
      },
    },
    {
      id: "other-limits-and-terms",
      title: t("Other limits and terms", "其他上下限与通项"),
      explanation: t(
        "The lower limit need not be $1$, and the expression can be any formula in $k$. Start from the lower limit and stop at the upper limit, including both:\n\n$$\\sum_{k=2}^{5} k^{2} = 2^{2} + 3^{2} + 4^{2} + 5^{2} = 4 + 9 + 16 + 25 = 54$$\n\nWith $(-1)^{k}$ the signs alternate: $\\sum_{k=0}^{3} (-1)^{k}2^{k} = 1 - 2 + 4 - 8 = -5$.",
        "下限不一定是 $1$，式子也可以是 $k$ 的任意公式。从下限开始，到上限为止，两端都要算上：\n\n$$\\sum_{k=2}^{5} k^{2} = 2^{2} + 3^{2} + 4^{2} + 5^{2} = 4 + 9 + 16 + 25 = 54$$\n\n含 $(-1)^{k}$ 时符号正负交替：$\\sum_{k=0}^{3} (-1)^{k}2^{k} = 1 - 2 + 4 - 8 = -5$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 4);
        const c = rng.nonZero(-5, 5);
        const a = rng.pick([2, 3, -1, -2]);
        const b = rng.pick([2, 3]);
        const forms: readonly (readonly [string, (k: number) => number])[] = [
          [poly([1, "k^{2}"], [c, ""]), (k) => k * k + c],
          [poly([a, "k^{2}"]), (k) => a * k * k],
          [`${b}^{k}`, (k) => b ** k],
          [`(-1)^{k}k`, (k) => (k % 2 === 0 ? k : -k)],
          [poly([1, "k^{2}"], [c, "k"]), (k) => k * k + c * k],
        ];
        const [body, g] = forms[kind]!;
        const f = (k: number) => Q.of(g(k));
        const lo = rng.int(0, 3);
        const hi = lo + rng.int(2, 4);
        const terms = range(lo, hi).map(f);
        const answer = total(terms);
        const expr = sumL(lo, hi, body);
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer,
          wrong: [total(range(lo === 1 ? 0 : 1, hi).map(f)), total(terms.slice(0, -1)), f(hi), total(terms.slice(1))],
          solution: both(
            `The index runs from $k = ${lo}$ to $k = ${hi}$. Substitute each value and add:`,
            `下标从 $k = ${lo}$ 取到 $k = ${hi}$。依次代入每个值，再相加：`,
            `${expr} = ${listL(terms)} = ${answer.toLatex()}`,
          ),
        });
      },
    },
    {
      id: "counting-terms",
      title: t("The number of terms", "项数"),
      explanation: t(
        "A sum from $k = m$ to $k = n$ has $n - m + 1$ terms: subtracting the limits leaves out one of the two ends. For example\n\n$$\\sum_{k=4}^{20} (2k + 3)$$\n\nhas $20 - 4 + 1 = 17$ terms, while $\\sum_{k=0}^{20}$ has $21$.",
        "从 $k = m$ 到 $k = n$ 的和共有 $n - m + 1$ 项：两个限相减会漏掉一端。例如\n\n$$\\sum_{k=4}^{20} (2k + 3)$$\n\n有 $20 - 4 + 1 = 17$ 项，而 $\\sum_{k=0}^{20}$ 有 $21$ 项。",
      ),
      generate(rng) {
        const lo = rng.int(0, 15);
        const hi = lo + rng.int(5, 60);
        const body = rng.bool() ? linear(rng.nonZero(-5, 6), rng.nonZero(-9, 9), "k") : `${rng.int(2, 3)}^{k}`;
        const expr = sumL(lo, hi, body);
        return numberProblem({
          prompt: t(`How many terms does $${expr}$ have?`, `$${expr}$ 有多少项？`),
          answer: hi - lo + 1,
          wrong: [hi - lo, hi, hi - lo + 2],
          solution: t(
            `The index takes every integer value from $${lo}$ to $${hi}$, both included:${steps(`${hi} - ${lo} + 1 = ${hi - lo + 1}`)}`,
            `下标取遍从 $${lo}$ 到 $${hi}$ 的每个整数，两端都包括在内：${steps(`${hi} - ${lo} + 1 = ${hi - lo + 1}`)}`,
          ),
        });
      },
    },
  ],
};

/** propertiesOfFiniteSeries uses the constant, sum and splitting rules of finite sums. */
export const propertiesOfFiniteSeries: TopicDef = {
  id: "properties-of-finite-series",
  title: t("Properties of Finite Series", "有限级数的性质"),
  summary: t(
    "Sum a constant, take out constant factors, split a sum into two and split its range to evaluate sums from known ones.",
    "利用常数求和、提出常数因子、拆分和式以及拆分求和范围，由已知的和求出新的和。",
  ),
  prerequisites: ["sigma-notation"],
  encompasses: [{ topic: "sigma-notation", weight: 0.5 }],
  xp: 14,
  knowledgePoints: [
    {
      id: "summing-a-constant",
      title: t("Summing a constant", "常数求和"),
      explanation: t(
        "When the expression does not contain $k$, every term is the same, so the sum is the constant times the number of terms:\n\n$$\\sum_{k=1}^{n} c = nc \\qquad \\sum_{k=m}^{n} c = (n - m + 1)c$$\n\nFor example $\\sum_{k=3}^{10} 4 = 4 + 4 + \\cdots + 4 = 8 \\cdot 4 = 32$, because there are $10 - 3 + 1 = 8$ terms.",
        "当式子中不含 $k$ 时，每一项都相同，所以和等于常数乘以项数：\n\n$$\\sum_{k=1}^{n} c = nc \\qquad \\sum_{k=m}^{n} c = (n - m + 1)c$$\n\n例如 $\\sum_{k=3}^{10} 4 = 4 + 4 + \\cdots + 4 = 8 \\cdot 4 = 32$，因为共有 $10 - 3 + 1 = 8$ 项。",
      ),
      generate(rng) {
        const lo = rng.pick([1, 1, 0, 2, 3, 4, 5]);
        const hi = lo + rng.int(3, 30);
        const c = rng.nonZero(-9, 12);
        const count = hi - lo + 1;
        const expr = sumL(lo, hi, num(c));
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: count * c,
          wrong: [c, hi * c, (hi - lo) * c, count],
          solution: t(
            `Every term equals $${c}$, and there are $${hi} - ${lo} + 1 = ${count}$ terms:${steps(`${expr} = ${count} \\cdot ${num(c).startsWith("-") ? `(${c})` : c} = ${count * c}`)}`,
            `每一项都等于 $${c}$，共有 $${hi} - ${lo} + 1 = ${count}$ 项：${steps(`${expr} = ${count} \\cdot ${num(c).startsWith("-") ? `(${c})` : c} = ${count * c}`)}`,
          ),
        });
      },
    },
    {
      id: "constant-multiples-and-sums",
      title: t("Constant multiples and sums", "常数倍与和的拆分"),
      explanation: t(
        "Because addition can be regrouped and constant factors taken out, a sum of several parts splits into separate sums:\n\n$$\\sum_{k=1}^{n} (p\\,a_k + q\\,b_k) = p\\sum_{k=1}^{n} a_k + q\\sum_{k=1}^{n} b_k$$\n\nIf $\\sum_{k=1}^{12} a_k = 40$ and $\\sum_{k=1}^{12} b_k = 15$, then\n\n$$\\sum_{k=1}^{12} (2a_k - b_k + 3) = 2(40) - 15 + 12 \\cdot 3 = 101$$\n\nThe constant $3$ is added once for each of the $12$ terms.",
        "因为加法可以重新组合，常数因子可以提出，所以由几部分组成的和可以拆成几个和：\n\n$$\\sum_{k=1}^{n} (p\\,a_k + q\\,b_k) = p\\sum_{k=1}^{n} a_k + q\\sum_{k=1}^{n} b_k$$\n\n若 $\\sum_{k=1}^{12} a_k = 40$，$\\sum_{k=1}^{12} b_k = 15$，则\n\n$$\\sum_{k=1}^{12} (2a_k - b_k + 3) = 2(40) - 15 + 12 \\cdot 3 = 101$$\n\n常数 $3$ 在 $12$ 项中每项都加了一次。",
      ),
      generate(rng) {
        const n = rng.int(5, 30);
        const A = rng.int(-40, 200);
        const B = rng.int(-40, 200);
        const p = rng.nonZero(-5, 5);
        const q = rng.nonZero(-5, 5);
        const c = rng.nonZero(-6, 6);
        const body = poly([p, "a_k"], [q, "b_k"], [c, ""]);
        const expr = sumL(1, n, body);
        const answer = p * A + q * B + n * c;
        const pr = (x: number) => (x < 0 ? `(${x})` : `${x}`);
        return numberProblem({
          prompt: t(
            `Given that $${sumL(1, n, "a_k")} = ${A}$ and $${sumL(1, n, "b_k")} = ${B}$, evaluate $${expr}$.`,
            `已知 $${sumL(1, n, "a_k")} = ${A}$，$${sumL(1, n, "b_k")} = ${B}$，求 $${expr}$。`,
          ),
          answer,
          wrong: [p * A + q * B + c, p * A + q * B, A + B + n * c, p * A + q * B - n * c],
          solution: both(
            `Split the sum and take out the constant factors. The constant $${c}$ is added once for each of the $${n}$ terms:`,
            `把和拆开并提出常数因子。常数 $${c}$ 在 $${n}$ 项中每项都加了一次：`,
            `${expr} = ${p === 1 ? "" : p === -1 ? "-" : p}${sumL(1, n, "a_k")} ${q < 0 ? "-" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}${sumL(1, n, "b_k")} + ${sumL(1, n, num(c))}`,
            `= ${p} \\cdot ${pr(A)} ${q < 0 ? "-" : "+"} ${Math.abs(q)} \\cdot ${pr(B)} + ${n} \\cdot ${pr(c)} = ${answer}`,
          ),
        });
      },
    },
    {
      id: "splitting-the-range",
      title: t("Splitting the range of a sum", "拆分求和范围"),
      explanation: t(
        "A sum over a range splits into sums over consecutive parts of it:\n\n$$\\sum_{k=1}^{n} a_k = \\sum_{k=1}^{m} a_k + \\sum_{k=m+1}^{n} a_k$$\n\nSo a sum that starts later is a difference of two sums that start at $1$. If $\\sum_{k=1}^{20} a_k = 90$ and $\\sum_{k=1}^{8} a_k = 30$, then\n\n$$\\sum_{k=9}^{20} (2a_k + 1) = 2(90 - 30) + 12 \\cdot 1 = 132$$\n\nsince $k = 9, \\ldots, 20$ are $12$ terms.",
        "一个范围上的和可以拆成相邻几段上的和：\n\n$$\\sum_{k=1}^{n} a_k = \\sum_{k=1}^{m} a_k + \\sum_{k=m+1}^{n} a_k$$\n\n所以从后面开始的和等于两个从 $1$ 开始的和之差。若 $\\sum_{k=1}^{20} a_k = 90$，$\\sum_{k=1}^{8} a_k = 30$，则\n\n$$\\sum_{k=9}^{20} (2a_k + 1) = 2(90 - 30) + 12 \\cdot 1 = 132$$\n\n因为 $k = 9, \\ldots, 20$ 共 $12$ 项。",
      ),
      generate(rng) {
        const n = rng.int(10, 30);
        const s = rng.int(3, n - 3);
        const A = rng.int(20, 300);
        const B = rng.int(-30, A - 10);
        const p = rng.nonZero(-4, 4);
        const c = rng.nonZero(-5, 5);
        const body = poly([p, "a_k"], [c, ""]);
        const expr = sumL(s + 1, n, body);
        const count = n - s;
        const answer = p * (A - B) + c * count;
        const pr = (x: number) => (x < 0 ? `(${x})` : `${x}`);
        return numberProblem({
          prompt: t(
            `Given that $${sumL(1, n, "a_k")} = ${A}$ and $${sumL(1, s, "a_k")} = ${B}$, evaluate $${expr}$.`,
            `已知 $${sumL(1, n, "a_k")} = ${A}$，$${sumL(1, s, "a_k")} = ${B}$，求 $${expr}$。`,
          ),
          answer,
          wrong: [p * (A - B) + c * (count + 1), p * (A - B) + c * n, p * (A + B) + c * count, p * (A - B) + c],
          solution: both(
            `The terms from $k = ${s + 1}$ to $k = ${n}$ are the first $${n}$ terms without the first $${s}$, and there are $${n} - ${s} = ${count}$ of them:`,
            `从 $k = ${s + 1}$ 到 $k = ${n}$ 的各项，就是前 $${n}$ 项去掉前 $${s}$ 项，共 $${n} - ${s} = ${count}$ 项：`,
            `${sumL(s + 1, n, "a_k")} = ${A} - ${pr(B)} = ${A - B}`,
            `${expr} = ${p} \\cdot ${pr(A - B)} + ${count} \\cdot ${pr(c)} = ${answer}`,
          ),
        });
      },
    },
  ],
};

/** expressingAnArithmeticSeriesInSigmaNotation writes arithmetic series with a general term and limits. */
export const expressingAnArithmeticSeriesInSigmaNotation: TopicDef = {
  id: "expressing-an-arithmetic-series-in-sigma-notation",
  title: t("Expressing an Arithmetic Series in Sigma Notation", "用求和符号表示等差级数"),
  summary: t(
    "Write an arithmetic series as $\\sum_{k=1}^{N} (dk + a_1 - d)$: find the general term, the number of terms, and recognize equivalent limits.",
    "把等差级数写成 $\\sum_{k=1}^{N} (dk + a_1 - d)$：求通项和项数，并识别等价的上下限写法。",
  ),
  prerequisites: ["sigma-notation", "index-of-a-term-in-an-arithmetic-sequence"],
  encompasses: [
    { topic: "sigma-notation", weight: 0.4 },
    { topic: "index-of-a-term-in-an-arithmetic-sequence", weight: 0.5 },
    { topic: "nth-term-of-an-arithmetic-sequence", weight: 0.5 },
  ],
  xp: 14,
  knowledgePoints: [
    {
      id: "the-general-term",
      title: t("The general term", "通项"),
      explanation: t(
        "An arithmetic series with first term $a_1$ and common difference $d$ has $k$th term $a_k = a_1 + (k - 1)d$. Simplify it and put it after $\\Sigma$:\n\n$$5 + 8 + 11 + \\cdots + 62$$\n\nhas $a_1 = 5$ and $d = 3$, so $a_k = 5 + 3(k - 1) = 3k + 2$. The last term $62$ is $a_{20}$, because $3k + 2 = 62$ gives $k = 20$:\n\n$$5 + 8 + 11 + \\cdots + 62 = \\sum_{k=1}^{20} (3k + 2)$$",
        "首项为 $a_1$、公差为 $d$ 的等差级数，第 $k$ 项是 $a_k = a_1 + (k - 1)d$。化简后写在 $\\Sigma$ 后面：\n\n$$5 + 8 + 11 + \\cdots + 62$$\n\n中 $a_1 = 5$，$d = 3$，所以 $a_k = 5 + 3(k - 1) = 3k + 2$。末项 $62$ 是 $a_{20}$，因为由 $3k + 2 = 62$ 得 $k = 20$：\n\n$$5 + 8 + 11 + \\cdots + 62 = \\sum_{k=1}^{20} (3k + 2)$$",
      ),
      generate(rng) {
        const a1 = rng.nonZero(-10, 15);
        const d = rng.nonZero(-6, 8);
        const n = rng.int(8, 30);
        const series = seriesL(arithmetic(a1, d, n));
        const answer = arithmeticTerm(a1, d);
        return expressionProblem({
          prompt: t(
            `Write $${series}$ in sigma notation: find the expression for its $k$th term.`,
            `用求和符号表示 $${series}$：求它第 $k$ 项的表达式。`,
          ),
          answer,
          prefix: `\\sum_{k=1}^{${n}}`,
          wrong: [poly([d, "k"], [a1, ""]), poly([a1, "k"], [d, ""]), poly([d, "k"], [a1 + d, ""]), poly([-d, "k"], [a1 + d, ""])],
          solution: both(
            `The first term is $${a1}$ and the common difference is $${d}$, so`,
            `首项是 $${a1}$，公差是 $${d}$，所以`,
            `a_k = ${a1} + ${d < 0 ? `(${d})` : d}(k - 1) = ${answer}`,
            `${series} = ${sumL(1, n, answer)}`,
          ),
        });
      },
    },
    {
      id: "the-upper-limit",
      title: t("The upper limit", "上限"),
      explanation: t(
        "The upper limit is the index of the last term. Set the general term equal to the last term and solve for $k$:\n\n$$4 + 11 + 18 + \\cdots + 144 = \\sum_{k=1}^{N} (7k - 3)$$\n\n$$7k - 3 = 144 \\implies k = 21$$\n\nso $N = 21$.",
        "上限是末项的下标。令通项等于末项，解出 $k$：\n\n$$4 + 11 + 18 + \\cdots + 144 = \\sum_{k=1}^{N} (7k - 3)$$\n\n$$7k - 3 = 144 \\implies k = 21$$\n\n所以 $N = 21$。",
      ),
      generate(rng) {
        const a1 = rng.nonZero(-12, 20);
        const d = rng.nonZero(-7, 9);
        const n = rng.int(10, 45);
        const last = a1 + (n - 1) * d;
        const body = arithmeticTerm(a1, d);
        const series = seriesL(arithmetic(a1, d, n));
        return numberProblem({
          prompt: t(`Find $N$ such that $${series} = ${sumL(1, "N", body)}$.`, `求 $N$，使 $${series} = ${sumL(1, "N", body)}$。`),
          answer: n,
          solveFor: "N",
          wrong: [n - 1, n + 1, last],
          solution: both(
            `The last term $${last}$ is term number $N$. Set the general term equal to it:`,
            `末项 $${last}$ 是第 $N$ 项。令通项等于它：`,
            `${body} = ${last} \\implies k = ${n}`,
          ),
        });
      },
    },
    {
      id: "equivalent-limits",
      title: t("Choosing the limits", "选择上下限"),
      explanation: t(
        "The same series can be written with different limits, as long as the general term is shifted to match. Starting the index at $0$ instead of $1$ means the term must give $a_1$ at $k = 0$, and the upper limit drops by $1$:\n\n$$5 + 8 + \\cdots + 62 = \\sum_{k=1}^{20} (3k + 2) = \\sum_{k=0}^{19} (3k + 5)$$\n\nCheck a candidate by its first term, its last term and its number of terms.",
        "同一个级数可以用不同的上下限表示，只要通项相应平移。下标从 $0$ 而不是从 $1$ 开始时，通项在 $k = 0$ 时要等于 $a_1$，上限也要减 $1$：\n\n$$5 + 8 + \\cdots + 62 = \\sum_{k=1}^{20} (3k + 2) = \\sum_{k=0}^{19} (3k + 5)$$\n\n检查一个写法时，看它的首项、末项和项数。",
      ),
      generate(rng) {
        const a1 = rng.nonZero(-10, 15);
        const d = rng.nonZero(-6, 8);
        const n = rng.int(8, 30);
        const series = seriesL(arithmetic(a1, d, n));
        const fromOne = (lo: number, hi: number): SigmaOption => ({
          lo,
          hi,
          body: arithmeticTerm(a1, d),
          f: (k) => Q.of(a1 + (k - 1) * d),
        });
        const fromZero = (lo: number, hi: number): SigmaOption => ({ lo, hi, body: linear(d, a1, "k"), f: (k) => Q.of(a1 + k * d) });
        const correct = rng.bool() ? fromOne(1, n) : fromZero(0, n - 1);
        const swapped: SigmaOption = { lo: 1, hi: n, body: linear(a1, d, "k"), f: (k) => Q.of(a1 * k + d) };
        return sigmaChoice(
          rng,
          t(`Which sum equals $${series}$?`, `哪个和等于 $${series}$？`),
          correct,
          [fromZero(1, n), fromZero(0, n), fromOne(1, n - 1), fromOne(0, n - 1), swapped],
          both(
            `The series has first term $${a1}$, common difference $${d}$ and $${n}$ terms. The right sum gives $${a1}$ at its lower limit and has $${n}$ terms:`,
            `这个级数首项是 $${a1}$，公差是 $${d}$，共 $${n}$ 项。正确的和在下限处给出 $${a1}$，并且有 $${n}$ 项：`,
            `${series} = ${sumL(correct.lo, correct.hi, correct.body)}`,
          ),
        );
      },
    },
  ],
};

/** findingTheSumOfAnArithmeticSeries uses S_n = n(a_1 + a_n)/2. */
export const findingTheSumOfAnArithmeticSeries: TopicDef = {
  id: "finding-the-sum-of-an-arithmetic-series",
  title: t("Finding the Sum of an Arithmetic Series", "求等差级数的和"),
  summary: t(
    "Add an arithmetic series with $S_n = \\frac{n}{2}(a_1 + a_n) = \\frac{n}{2}(2a_1 + (n - 1)d)$, written out or in sigma notation.",
    "用 $S_n = \\frac{n}{2}(a_1 + a_n) = \\frac{n}{2}(2a_1 + (n - 1)d)$ 求等差级数的和，级数可以逐项写出或用求和符号表示。",
  ),
  prerequisites: ["expressing-an-arithmetic-series-in-sigma-notation", "properties-of-finite-series"],
  encompasses: [
    { topic: "expressing-an-arithmetic-series-in-sigma-notation", weight: 0.4 },
    { topic: "index-of-a-term-in-an-arithmetic-sequence", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.SSE.B.4"],
  knowledgePoints: [
    {
      id: "first-and-last-terms",
      title: t("From the first and last terms", "由首项和末项求和"),
      explanation: t(
        "Write the series forwards and backwards and add the two lines. Each column adds to $a_1 + a_n$, and there are $n$ columns, so twice the sum is $n(a_1 + a_n)$:\n\n$$S_n = \\frac{n}{2}(a_1 + a_n)$$\n\nAn arithmetic series of $20$ terms from $5$ to $62$ has sum $\\frac{20}{2}(5 + 62) = 10 \\cdot 67 = 670$.",
        "把级数正着写一遍、倒着写一遍，再把两行相加。每一列的和都是 $a_1 + a_n$，共 $n$ 列，所以和的两倍是 $n(a_1 + a_n)$：\n\n$$S_n = \\frac{n}{2}(a_1 + a_n)$$\n\n从 $5$ 到 $62$ 共 $20$ 项的等差级数，和为 $\\frac{20}{2}(5 + 62) = 10 \\cdot 67 = 670$。",
      ),
      generate(rng) {
        const a1 = rng.int(-20, 30);
        const d = rng.nonZero(-7, 9);
        const n = rng.int(8, 40);
        const last = a1 + (n - 1) * d;
        const answer = arithmeticSum(a1, d, n);
        return numberProblem({
          prompt: t(
            `An arithmetic series has $${n}$ terms. Its first term is $${a1}$ and its last term is $${last}$. Find the sum of the series.`,
            `一个等差级数有 $${n}$ 项，首项是 $${a1}$，末项是 $${last}$。求这个级数的和。`,
          ),
          answer,
          wrong: [n * (a1 + last), Q.of(a1 + last, 2), Q.of((n - 1) * (a1 + last), 2), Q.of(n * (last - a1), 2)],
          solution: both(
            "Use $S_n = \\frac{n}{2}(a_1 + a_n)$:",
            "用 $S_n = \\frac{n}{2}(a_1 + a_n)$：",
            `S_{${n}} = \\frac{${n}}{2}\\left(${a1} ${add(Q.of(last)).trim()}\\right) = ${answer}`,
          ),
        });
      },
    },
    {
      id: "first-term-and-common-difference",
      title: t("From the first term and common difference", "由首项和公差求和"),
      explanation: t(
        "When the last term is not given, substitute $a_n = a_1 + (n - 1)d$:\n\n$$S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$$\n\nThe sum of the first $30$ terms of $7 + 11 + 15 + \\cdots$ is $\\frac{30}{2}(2 \\cdot 7 + 29 \\cdot 4) = 15 \\cdot 130 = 1950$.",
        "没有给出末项时，代入 $a_n = a_1 + (n - 1)d$：\n\n$$S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$$\n\n$7 + 11 + 15 + \\cdots$ 前 $30$ 项的和是 $\\frac{30}{2}(2 \\cdot 7 + 29 \\cdot 4) = 15 \\cdot 130 = 1950$。",
      ),
      generate(rng) {
        const a1 = rng.nonZero(-20, 25);
        const d = rng.nonZero(-6, 9);
        const n = rng.int(10, 40);
        const answer = arithmeticSum(a1, d, n);
        const series = openL(arithmetic(a1, d, 3));
        return numberProblem({
          prompt: t(
            `Find the sum of the first $${n}$ terms of the arithmetic series $${series}$.`,
            `求等差级数 $${series}$ 前 $${n}$ 项的和。`,
          ),
          answer,
          wrong: [Q.of(n * (2 * a1 + n * d), 2), n * (a1 + (n - 1) * d), Q.of(n * (a1 + (n - 1) * d), 2), arithmeticSum(a1, d, n - 1)],
          solution: both(
            `Here $a_1 = ${a1}$, $d = ${d}$ and $n = ${n}$:`,
            `这里 $a_1 = ${a1}$，$d = ${d}$，$n = ${n}$：`,
            `S_{${n}} = \\frac{${n}}{2}\\left(2 \\cdot ${a1 < 0 ? `(${a1})` : a1} + ${n - 1} \\cdot ${d < 0 ? `(${d})` : d}\\right) = \\frac{${n}}{2} \\cdot ${2 * a1 + (n - 1) * d < 0 ? `(${2 * a1 + (n - 1) * d})` : 2 * a1 + (n - 1) * d} = ${answer}`,
          ),
        });
      },
    },
    {
      id: "a-written-out-series",
      title: t("A series written out", "逐项写出的级数"),
      explanation: t(
        "When a series is written out to its last term, first find the number of terms from $a_n = a_1 + (n - 1)d$, then add:\n\n$$3 + 7 + 11 + \\cdots + 79$$\n\n$3 + 4(n - 1) = 79$ gives $n = 20$, so the sum is $\\frac{20}{2}(3 + 79) = 820$.",
        "级数逐项写到末项时，先由 $a_n = a_1 + (n - 1)d$ 求出项数，再求和：\n\n$$3 + 7 + 11 + \\cdots + 79$$\n\n由 $3 + 4(n - 1) = 79$ 得 $n = 20$，所以和为 $\\frac{20}{2}(3 + 79) = 820$。",
      ),
      generate(rng) {
        const a1 = rng.int(-15, 25);
        const d = rng.nonZero(-6, 8);
        const n = rng.int(10, 40);
        const last = a1 + (n - 1) * d;
        const series = seriesL(arithmetic(a1, d, n));
        const answer = arithmeticSum(a1, d, n);
        return numberProblem({
          prompt: t(`Find the sum of the arithmetic series $${series}$.`, `求等差级数 $${series}$ 的和。`),
          answer,
          wrong: [Q.of((n - 1) * (a1 + last), 2), Q.of((n + 1) * (a1 + last), 2), n * (a1 + last)],
          solution: both(
            `The common difference is $${d}$. Find the number of terms, then use $S_n = \\frac{n}{2}(a_1 + a_n)$:`,
            `公差是 $${d}$。先求项数，再用 $S_n = \\frac{n}{2}(a_1 + a_n)$：`,
            `${a1} + ${d < 0 ? `(${d})` : d}(n - 1) = ${last} \\implies n = ${n}`,
            `S_{${n}} = \\frac{${n}}{2}\\left(${a1} ${add(Q.of(last)).trim()}\\right) = ${answer}`,
          ),
        });
      },
    },
    {
      id: "a-series-in-sigma-notation",
      title: t("A series in sigma notation", "用求和符号表示的级数"),
      explanation: t(
        "A sum $\\sum (pk + q)$ is an arithmetic series with common difference $p$. Find its first and last terms from the limits, and its number of terms:\n\n$$\\sum_{k=3}^{40} (2k + 1)$$\n\nhas first term $7$, last term $81$ and $40 - 3 + 1 = 38$ terms, so it equals $\\frac{38}{2}(7 + 81) = 1672$.",
        "和式 $\\sum (pk + q)$ 是公差为 $p$ 的等差级数。由上下限求出首项、末项和项数：\n\n$$\\sum_{k=3}^{40} (2k + 1)$$\n\n首项是 $7$，末项是 $81$，共 $40 - 3 + 1 = 38$ 项，所以它等于 $\\frac{38}{2}(7 + 81) = 1672$。",
      ),
      generate(rng) {
        const lo = rng.pick([1, 1, 1, 0, 2, 3, 4, 5]);
        const hi = lo + rng.int(9, 40);
        const p = rng.nonZero(-5, 6);
        const c = rng.int(-9, 9);
        const f = (k: number) => p * k + c;
        const count = hi - lo + 1;
        const answer = Q.of(count * (f(lo) + f(hi)), 2);
        const body = linear(p, c, "k");
        const expr = sumL(lo, hi, body);
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer,
          wrong: [
            Q.of((hi - lo) * (f(lo) + f(hi)), 2),
            Q.of(hi * (f(1) + f(hi)), 2),
            Q.of((p * hi * (hi + 1)) / 2 + c),
            count * (f(lo) + f(hi)),
          ],
          solution: both(
            `The terms form an arithmetic series with first term $${f(lo)}$, last term $${f(hi)}$ and $${hi} - ${lo} + 1 = ${count}$ terms:`,
            `各项构成一个等差级数，首项是 $${f(lo)}$，末项是 $${f(hi)}$，共 $${hi} - ${lo} + 1 = ${count}$ 项：`,
            `${expr} = \\frac{${count}}{2}\\left(${f(lo)} ${add(Q.of(f(hi))).trim()}\\right) = ${answer.toLatex()}`,
          ),
        });
      },
    },
  ],
};

/** findingTheFirstTermOfAnArithmeticSeries solves the sum formula for the first term or the common difference. */
export const findingTheFirstTermOfAnArithmeticSeries: TopicDef = {
  id: "finding-the-first-term-of-an-arithmetic-series",
  title: t("Finding the First Term of an Arithmetic Series", "求等差级数的首项"),
  summary: t(
    "Solve $S_n = \\frac{n}{2}(a_1 + a_n)$ or $S_n = \\frac{n}{2}(2a_1 + (n - 1)d)$ for the first term or the common difference.",
    "由 $S_n = \\frac{n}{2}(a_1 + a_n)$ 或 $S_n = \\frac{n}{2}(2a_1 + (n - 1)d)$ 解出首项或公差。",
  ),
  prerequisites: ["finding-the-sum-of-an-arithmetic-series"],
  encompasses: [
    { topic: "finding-the-sum-of-an-arithmetic-series", weight: 0.5 },
    { topic: "two-step-equations", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.SSE.B.4"],
  knowledgePoints: [
    {
      id: "from-the-sum-and-last-term",
      title: t("From the sum and the last term", "由和与末项求首项"),
      explanation: t(
        "Substitute what is known into $S_n = \\frac{n}{2}(a_1 + a_n)$ and solve for $a_1$. An arithmetic series of $16$ terms has sum $400$ and last term $40$:\n\n$$400 = \\frac{16}{2}(a_1 + 40) \\implies 50 = a_1 + 40 \\implies a_1 = 10$$",
        "把已知量代入 $S_n = \\frac{n}{2}(a_1 + a_n)$，解出 $a_1$。一个等差级数有 $16$ 项，和为 $400$，末项为 $40$：\n\n$$400 = \\frac{16}{2}(a_1 + 40) \\implies 50 = a_1 + 40 \\implies a_1 = 10$$",
      ),
      generate(rng) {
        const a1 = rng.int(-20, 30);
        const d = rng.nonZero(-6, 8);
        const n = rng.int(8, 36);
        const last = a1 + (n - 1) * d;
        const S = arithmeticSum(a1, d, n);
        const mean = Q.of(2 * S, n);
        return numberProblem({
          prompt: t(
            `An arithmetic series has $${n}$ terms and a sum of $${S}$. Its last term is $${last}$. Find its first term.`,
            `一个等差级数有 $${n}$ 项，和为 $${S}$，末项为 $${last}$。求它的首项。`,
          ),
          answer: a1,
          solveFor: "a_1",
          wrong: [Q.of(S, n).sub(Q.of(last)), mean.add(Q.of(last)), Q.of(S, n), Q.of(S - last, n - 1)],
          solution: both(
            "Substitute into $S_n = \\frac{n}{2}(a_1 + a_n)$ and solve:",
            "代入 $S_n = \\frac{n}{2}(a_1 + a_n)$ 并求解：",
            `${S} = \\frac{${n}}{2}\\left(a_1 ${add(Q.of(last)).trim()}\\right)`,
            `a_1 ${add(Q.of(last)).trim()} = ${mean.toLatex()} \\implies a_1 = ${a1}`,
          ),
        });
      },
    },
    {
      id: "from-the-sum-and-common-difference",
      title: t("From the sum and the common difference", "由和与公差求首项"),
      explanation: t(
        "When the common difference is known instead, use $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$. An arithmetic series of $10$ terms with common difference $3$ has sum $185$:\n\n$$185 = \\frac{10}{2}(2a_1 + 9 \\cdot 3) \\implies 37 = 2a_1 + 27 \\implies a_1 = 5$$",
        "已知公差时，用 $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$。一个等差级数有 $10$ 项，公差为 $3$，和为 $185$：\n\n$$185 = \\frac{10}{2}(2a_1 + 9 \\cdot 3) \\implies 37 = 2a_1 + 27 \\implies a_1 = 5$$",
      ),
      generate(rng) {
        const a1 = rng.int(-20, 30);
        const d = rng.nonZero(-6, 8);
        const n = rng.int(8, 36);
        const S = arithmeticSum(a1, d, n);
        const inner = Q.of(2 * S, n);
        return numberProblem({
          prompt: t(
            `An arithmetic series has $${n}$ terms, a common difference of $${d}$ and a sum of $${S}$. Find its first term.`,
            `一个等差级数有 $${n}$ 项，公差为 $${d}$，和为 $${S}$。求它的首项。`,
          ),
          answer: a1,
          solveFor: "a_1",
          wrong: [Q.of(S, n).sub(Q.of((n - 1) * d)), Q.of(S, n).sub(Q.of(n * d, 2)), Q.of(S, n).add(Q.of((n - 1) * d, 2)), Q.of(S, n)],
          solution: both(
            "Substitute into $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$ and solve:",
            "代入 $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$ 并求解：",
            `${S} = \\frac{${n}}{2}\\left(2a_1 + ${n - 1} \\cdot ${d < 0 ? `(${d})` : d}\\right)`,
            `2a_1 ${add(Q.of((n - 1) * d)).trim()} = ${inner.toLatex()} \\implies a_1 = ${a1}`,
          ),
        });
      },
    },
    {
      id: "the-common-difference",
      title: t("The common difference", "求公差"),
      explanation: t(
        "The same formula gives the common difference when the first term is known. An arithmetic series of $12$ terms starting at $4$ has sum $246$:\n\n$$246 = \\frac{12}{2}(2 \\cdot 4 + 11d) \\implies 41 = 8 + 11d \\implies d = 3$$",
        "已知首项时，同一个公式可以求出公差。一个等差级数有 $12$ 项，首项为 $4$，和为 $246$：\n\n$$246 = \\frac{12}{2}(2 \\cdot 4 + 11d) \\implies 41 = 8 + 11d \\implies d = 3$$",
      ),
      generate(rng) {
        const a1 = rng.int(-20, 30);
        const d = rng.nonZero(-6, 8);
        const n = rng.int(8, 30);
        const S = arithmeticSum(a1, d, n);
        const inner = Q.of(2 * S, n);
        return numberProblem({
          prompt: t(
            `An arithmetic series has $${n}$ terms, a first term of $${a1}$ and a sum of $${S}$. Find its common difference.`,
            `一个等差级数有 $${n}$ 项，首项为 $${a1}$，和为 $${S}$。求它的公差。`,
          ),
          answer: d,
          solveFor: "d",
          wrong: [Q.of(S - n * a1, n), Q.of(2 * (S - n * a1), n * n), Q.of(S - a1, n - 1), Q.of(S - n * a1, n - 1)],
          solution: both(
            "Substitute into $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$ and solve:",
            "代入 $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$ 并求解：",
            `${S} = \\frac{${n}}{2}\\left(2 \\cdot ${a1 < 0 ? `(${a1})` : a1} + ${n - 1}d\\right)`,
            `${2 * a1} + ${n - 1}d = ${inner.toLatex()} \\implies d = ${d}`,
          ),
        });
      },
    },
  ],
};

/** calculatingTheNumberOfTermsInAnArithmeticSeries solves the sum formula for n. */
export const calculatingTheNumberOfTermsInAnArithmeticSeries: TopicDef = {
  id: "calculating-the-number-of-terms-in-an-arithmetic-series",
  title: t("Calculating the Number of Terms in an Arithmetic Series", "求等差级数的项数"),
  summary: t(
    "Find how many terms an arithmetic series has from its sum, solving a quadratic equation in $n$ when the last term is unknown.",
    "由等差级数的和求项数；末项未知时，解关于 $n$ 的二次方程。",
  ),
  prerequisites: ["finding-the-sum-of-an-arithmetic-series", "the-quadratic-formula"],
  encompasses: [
    { topic: "finding-the-sum-of-an-arithmetic-series", weight: 0.5 },
    { topic: "the-quadratic-formula", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.SSE.B.4", "CCSS.HSA.REI.B.4"],
  knowledgePoints: [
    {
      id: "from-the-first-and-last-terms",
      title: t("From the first and last terms", "由首项和末项求项数"),
      explanation: t(
        "When both ends are known, solve $S_n = \\frac{n}{2}(a_1 + a_n)$ for $n$:\n\n$$n = \\frac{2S_n}{a_1 + a_n}$$\n\nAn arithmetic series from $8$ to $50$ with sum $435$ has $n = \\frac{2 \\cdot 435}{8 + 50} = \\frac{870}{58} = 15$ terms.",
        "两端都已知时，由 $S_n = \\frac{n}{2}(a_1 + a_n)$ 解出 $n$：\n\n$$n = \\frac{2S_n}{a_1 + a_n}$$\n\n从 $8$ 到 $50$、和为 $435$ 的等差级数有 $n = \\frac{2 \\cdot 435}{8 + 50} = \\frac{870}{58} = 15$ 项。",
      ),
      generate(rng) {
        for (;;) {
          const a1 = rng.int(-15, 30);
          const d = rng.nonZero(-6, 8);
          const n = rng.int(8, 40);
          const last = a1 + (n - 1) * d;
          if (a1 + last === 0) continue;
          const S = arithmeticSum(a1, d, n);
          return numberProblem({
            prompt: t(
              `An arithmetic series has first term $${a1}$, last term $${last}$ and sum $${S}$. How many terms does it have?`,
              `一个等差级数首项为 $${a1}$，末项为 $${last}$，和为 $${S}$。它有多少项？`,
            ),
            answer: n,
            solveFor: "n",
            wrong: [Q.of(S, a1 + last), n + 1, n - 1, Q.of(2 * S, last - a1)],
            solution: both(
              "Solve $S_n = \\frac{n}{2}(a_1 + a_n)$ for $n$:",
              "由 $S_n = \\frac{n}{2}(a_1 + a_n)$ 解出 $n$：",
              `${S} = \\frac{n}{2}\\left(${a1} ${add(Q.of(last)).trim()}\\right) = ${Q.of(a1 + last, 2).toLatex()}n`,
              `n = \\frac{${2 * S}}{${a1 + last}} = ${n}`,
            ),
          });
        }
      },
    },
    {
      id: "solving-a-quadratic-for-n",
      title: t("Solving a quadratic for $n$", "解关于 $n$ 的二次方程"),
      explanation: t(
        "When the last term is unknown, $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$ is a quadratic equation in $n$. The number of terms is its positive integer solution. How many terms of $3 + 7 + 11 + \\cdots$ add to $210$?\n\n$$210 = \\frac{n}{2}\\big(6 + 4(n - 1)\\big) \\implies 420 = 4n^{2} + 2n \\implies 2n^{2} + n - 210 = 0$$\n\n$$(n - 10)(2n + 21) = 0 \\implies n = 10$$\n\nThe solution $n = -\\frac{21}{2}$ is rejected: a number of terms is a positive integer.",
        "末项未知时，$S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$ 是关于 $n$ 的二次方程，项数是它的正整数解。$3 + 7 + 11 + \\cdots$ 的前多少项之和为 $210$？\n\n$$210 = \\frac{n}{2}\\big(6 + 4(n - 1)\\big) \\implies 420 = 4n^{2} + 2n \\implies 2n^{2} + n - 210 = 0$$\n\n$$(n - 10)(2n + 21) = 0 \\implies n = 10$$\n\n舍去解 $n = -\\frac{21}{2}$：项数必须是正整数。",
      ),
      generate(rng) {
        for (;;) {
          const a1 = rng.int(-10, 20);
          const d = rng.int(1, 6);
          const n = rng.int(6, 30);
          const S = arithmeticSum(a1, d, n);
          if (S <= 0) continue;
          const other = Q.of(-2 * S, d * n);
          const series = openL(arithmetic(a1, d, 3));
          const eq = `${poly([d, "n^{2}"], [2 * a1 - d, "n"], [-2 * S, ""])} = 0`;
          return numberProblem({
            prompt: t(
              `How many terms of the arithmetic series $${series}$ must be added to get a sum of $${S}$?`,
              `等差级数 $${series}$ 要加多少项，和才等于 $${S}$？`,
            ),
            answer: n,
            solveFor: "n",
            wrong: [n - 1, n + 1, other.neg(), ...(a1 > 0 ? [Q.of(S, a1)] : [])],
            solution: both(
              `Substitute $a_1 = ${a1}$ and $d = ${d}$ into $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$, multiply by $2$ and solve the quadratic:`,
              `把 $a_1 = ${a1}$、$d = ${d}$ 代入 $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$，两边乘以 $2$，再解二次方程：`,
              `${2 * S} = n\\left(${2 * a1} + ${d}(n - 1)\\right) \\implies ${eq}`,
              `n = ${n} \\quad \\text{or} \\quad n = ${other.toLatex()}`,
            ),
          });
        }
      },
    },
    {
      id: "exceeding-a-total",
      title: t("When a sum first exceeds a total", "和首次超过某个值"),
      explanation: t(
        "To find the fewest terms whose sum is greater than a total, solve the equation $S_n = $ total and round the positive solution **up**. How many terms of $5 + 8 + 11 + \\cdots$ are needed for a sum greater than $500$?\n\n$$\\frac{n}{2}\\big(10 + 3(n - 1)\\big) = 500 \\implies 3n^{2} + 7n - 1000 = 0 \\implies n = \\frac{-7 + \\sqrt{12049}}{6} \\approx 17.1$$\n\n$S_{17} = 493$ is not enough, so $18$ terms are needed ($S_{18} = 549$).",
        "要求和大于某个值所需的最少项数，先解方程 $S_n = $ 该值，再把正解**向上**取整。$5 + 8 + 11 + \\cdots$ 至少要加多少项，和才大于 $500$？\n\n$$\\frac{n}{2}\\big(10 + 3(n - 1)\\big) = 500 \\implies 3n^{2} + 7n - 1000 = 0 \\implies n = \\frac{-7 + \\sqrt{12049}}{6} \\approx 17.1$$\n\n$S_{17} = 493$ 还不够，所以需要 $18$ 项（$S_{18} = 549$）。",
      ),
      generate(rng) {
        for (;;) {
          const a1 = rng.int(1, 20);
          const d = rng.int(1, 8);
          const T = rng.int(10, 200) * 10;
          let n = 1;
          while (arithmeticSum(a1, d, n) <= T) n++;
          if (n < 6 || n > 40) continue;
          const root = (-(2 * a1 - d) + Math.sqrt((2 * a1 - d) ** 2 + 8 * d * T)) / (2 * d);
          if (Number.isInteger(root)) continue;
          const series = openL(arithmetic(a1, d, 3));
          return numberProblem({
            prompt: t(
              `What is the least number of terms of the arithmetic series $${series}$ whose sum is greater than $${T}$?`,
              `等差级数 $${series}$ 至少要加多少项，和才大于 $${T}$？`,
            ),
            answer: n,
            wrong: [n - 1, n + 1, Math.ceil(T / a1)],
            solution: both(
              `Solve $S_n = ${T}$ and round the positive solution up:`,
              `解方程 $S_n = ${T}$，再把正解向上取整：`,
              `\\frac{n}{2}\\left(${2 * a1} + ${d}(n - 1)\\right) = ${T} \\implies ${poly([d, "n^{2}"], [2 * a1 - d, "n"], [-2 * T, ""])} = 0 \\implies n \\approx ${root.toFixed(2)}`,
              `S_{${n - 1}} = ${arithmeticSum(a1, d, n - 1)} \\le ${T} \\qquad S_{${n}} = ${arithmeticSum(a1, d, n)} > ${T}`,
            ),
          });
        }
      },
    },
  ],
};

/** ArithmeticContext describes a situation in which equal increases add up: seats in rows, savings by week. */
interface ArithmeticContext {
  /** total asks for the total over n periods. */
  readonly total: (a: number, d: number, n: number) => Text;
  /** periods asks how many periods give the total. */
  readonly periods: (a: number, d: number, S: number) => Text;
  /** first asks for the first amount. */
  readonly first: (d: number, n: number, S: number) => Text;
}

const arithmeticContexts: readonly ArithmeticContext[] = [
  {
    total: (a, d, n) =>
      t(
        `A theater has $${n}$ rows of seats. The first row has $${a}$ seats, and each row has $${d}$ more seats than the row in front of it. How many seats are there in the theater?`,
        `一个剧场有 $${n}$ 排座位。第一排有 $${a}$ 个座位，之后每排都比前一排多 $${d}$ 个。剧场一共有多少个座位？`,
      ),
    periods: (a, d, S) =>
      t(
        `A theater has $${S}$ seats in all. The first row has $${a}$ seats, and each row has $${d}$ more seats than the row in front of it. How many rows does the theater have?`,
        `一个剧场共有 $${S}$ 个座位。第一排有 $${a}$ 个座位，之后每排都比前一排多 $${d}$ 个。剧场有多少排？`,
      ),
    first: (d, n, S) =>
      t(
        `A theater has $${n}$ rows and $${S}$ seats in all. Each row has $${d}$ more seats than the row in front of it. How many seats does the first row have?`,
        `一个剧场有 $${n}$ 排，共 $${S}$ 个座位。每排都比前一排多 $${d}$ 个座位。第一排有多少个座位？`,
      ),
  },
  {
    total: (a, d, n) =>
      t(
        `Mia saves $${a}$ dollars in the first week and $${d}$ dollars more each week than the week before. How many dollars has she saved in all after $${n}$ weeks?`,
        `米娅第一周存 $${a}$ 美元，之后每周比前一周多存 $${d}$ 美元。$${n}$ 周后她一共存了多少美元？`,
      ),
    periods: (a, d, S) =>
      t(
        `Mia saves $${a}$ dollars in the first week and $${d}$ dollars more each week than the week before. After how many weeks will she have saved exactly $${S}$ dollars in all?`,
        `米娅第一周存 $${a}$ 美元，之后每周比前一周多存 $${d}$ 美元。多少周后她一共恰好存了 $${S}$ 美元？`,
      ),
    first: (d, n, S) =>
      t(
        `Mia saves $${d}$ dollars more each week than the week before. After $${n}$ weeks she has saved $${S}$ dollars in all. How many dollars did she save in the first week?`,
        `米娅每周都比前一周多存 $${d}$ 美元。$${n}$ 周后她一共存了 $${S}$ 美元。她第一周存了多少美元？`,
      ),
  },
  {
    total: (a, d, n) =>
      t(
        `A runner trains for $${a}$ minutes on the first day and $${d}$ minutes longer each day than the day before. How many minutes does she train in all over the first $${n}$ days?`,
        `一名跑步者第一天训练 $${a}$ 分钟，之后每天比前一天多训练 $${d}$ 分钟。前 $${n}$ 天她一共训练了多少分钟？`,
      ),
    periods: (a, d, S) =>
      t(
        `A runner trains for $${a}$ minutes on the first day and $${d}$ minutes longer each day than the day before. After how many days will she have trained for exactly $${S}$ minutes in all?`,
        `一名跑步者第一天训练 $${a}$ 分钟，之后每天比前一天多训练 $${d}$ 分钟。多少天后她的总训练时间恰好是 $${S}$ 分钟？`,
      ),
    first: (d, n, S) =>
      t(
        `A runner trains $${d}$ minutes longer each day than the day before. Over the first $${n}$ days she trains for $${S}$ minutes in all. How many minutes did she train on the first day?`,
        `一名跑步者每天都比前一天多训练 $${d}$ 分钟。前 $${n}$ 天她一共训练了 $${S}$ 分钟。她第一天训练了多少分钟？`,
      ),
  },
];

/** modelingWithArithmeticSeries models totals of steadily increasing amounts. */
export const modelingWithArithmeticSeries: TopicDef = {
  id: "modeling-with-arithmetic-series",
  title: t("Modeling With Arithmetic Series", "用等差级数建模"),
  summary: t(
    "Model totals of amounts that grow by a fixed step with an arithmetic series, and find the total, the number of steps or the first amount.",
    "用等差级数为按固定步长增加的量的总和建模，求总和、步数或第一个量。",
  ),
  prerequisites: [
    "calculating-the-number-of-terms-in-an-arithmetic-series",
    "finding-the-first-term-of-an-arithmetic-series",
    "modeling-with-arithmetic-sequences",
  ],
  encompasses: [
    { topic: "calculating-the-number-of-terms-in-an-arithmetic-series", weight: 0.4 },
    { topic: "finding-the-first-term-of-an-arithmetic-series", weight: 0.4 },
    { topic: "modeling-with-arithmetic-sequences", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.SSE.B.4", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "totals-in-context",
      title: t("Totals in context", "实际问题中的总和"),
      explanation: t(
        "When an amount grows by the same step each time, the amounts form an arithmetic sequence and their total is an arithmetic series. A stadium section has $25$ rows; the first has $18$ seats and each row has $2$ more than the one before. Then $a_1 = 18$, $d = 2$ and $n = 25$:\n\n$$S_{25} = \\frac{25}{2}(2 \\cdot 18 + 24 \\cdot 2) = \\frac{25}{2} \\cdot 84 = 1050 \\text{ seats}$$",
        "当一个量每次都增加相同的步长时，这些量构成等差数列，它们的总和就是等差级数。体育场的一个区有 $25$ 排，第一排有 $18$ 个座位，之后每排比前一排多 $2$ 个。于是 $a_1 = 18$，$d = 2$，$n = 25$：\n\n$$S_{25} = \\frac{25}{2}(2 \\cdot 18 + 24 \\cdot 2) = \\frac{25}{2} \\cdot 84 = 1050 \\text{ 个座位}$$",
      ),
      generate(rng) {
        const context = rng.pick(arithmeticContexts);
        const a = rng.int(5, 30);
        const d = rng.int(1, 6);
        const n = rng.int(8, 30);
        const S = arithmeticSum(a, d, n);
        return numberProblem({
          prompt: context.total(a, d, n),
          answer: S,
          wrong: [n * a, n * (a + (n - 1) * d), arithmeticSum(a, d, n - 1), a + (n - 1) * d],
          solution: both(
            `The amounts form an arithmetic sequence with $a_1 = ${a}$, $d = ${d}$ and $n = ${n}$ terms. Add them:`,
            `这些量构成等差数列，$a_1 = ${a}$，$d = ${d}$，共 $n = ${n}$ 项。求它们的和：`,
            `S_{${n}} = \\frac{${n}}{2}\\left(2 \\cdot ${a} + ${n - 1} \\cdot ${d}\\right) = ${S}`,
          ),
        });
      },
    },
    {
      id: "the-number-of-steps",
      title: t("The number of steps", "步数"),
      explanation: t(
        "When the total is known, the number of steps is the positive solution of $S_n = $ total. A stadium section has $1050$ seats, with $18$ in the first row and $2$ more in each row:\n\n$$\\frac{n}{2}\\big(36 + 2(n - 1)\\big) = 1050 \\implies n^{2} + 17n - 1050 = 0 \\implies (n - 25)(n + 42) = 0$$\n\nso there are $25$ rows.",
        "已知总和时，步数是方程 $S_n = $ 总和的正解。体育场的一个区有 $1050$ 个座位，第一排 $18$ 个，之后每排多 $2$ 个：\n\n$$\\frac{n}{2}\\big(36 + 2(n - 1)\\big) = 1050 \\implies n^{2} + 17n - 1050 = 0 \\implies (n - 25)(n + 42) = 0$$\n\n所以共有 $25$ 排。",
      ),
      generate(rng) {
        const context = rng.pick(arithmeticContexts);
        const a = rng.int(5, 30);
        const d = rng.int(1, 6);
        const n = rng.int(6, 30);
        const S = arithmeticSum(a, d, n);
        const other = Q.of(-2 * S, d * n);
        return numberProblem({
          prompt: context.periods(a, d, S),
          answer: n,
          wrong: [n - 1, n + 1, Q.of(S, a), other.neg()],
          solution: both(
            `The amounts form an arithmetic sequence with $a_1 = ${a}$ and $d = ${d}$. Solve $S_n = ${S}$, multiplied by $2$:`,
            `这些量构成等差数列，$a_1 = ${a}$，$d = ${d}$。解方程 $S_n = ${S}$（两边乘以 $2$）：`,
            `n\\left(${2 * a} + ${d}(n - 1)\\right) = ${2 * S} \\implies ${poly([d, "n^{2}"], [2 * a - d, "n"], [-2 * S, ""])} = 0`,
            `n = ${n} \\quad \\text{or} \\quad n = ${other.toLatex()}`,
          ),
        });
      },
    },
    {
      id: "the-first-amount",
      title: t("The first amount", "第一个量"),
      explanation: t(
        "When the total, the step and the number of steps are known, solve the sum formula for the first amount. A section of $25$ rows with $2$ more seats in each row has $1050$ seats:\n\n$$1050 = \\frac{25}{2}(2a_1 + 24 \\cdot 2) \\implies 84 = 2a_1 + 48 \\implies a_1 = 18$$",
        "已知总和、步长和步数时，由求和公式解出第一个量。一个区有 $25$ 排，每排比前一排多 $2$ 个座位，共 $1050$ 个座位：\n\n$$1050 = \\frac{25}{2}(2a_1 + 24 \\cdot 2) \\implies 84 = 2a_1 + 48 \\implies a_1 = 18$$",
      ),
      generate(rng) {
        const context = rng.pick(arithmeticContexts);
        const a = rng.int(5, 30);
        const d = rng.int(1, 6);
        const n = rng.int(8, 30);
        const S = arithmeticSum(a, d, n);
        return numberProblem({
          prompt: context.first(d, n, S),
          answer: a,
          wrong: [Q.of(S, n).sub(Q.of((n - 1) * d)), Q.of(S, n), Q.of(S, n).sub(Q.of(n * d, 2)), a + (n - 1) * d],
          solution: both(
            `The amounts form an arithmetic sequence with $d = ${d}$ and $n = ${n}$. Solve $S_{${n}} = ${S}$ for $a_1$:`,
            `这些量构成等差数列，$d = ${d}$，$n = ${n}$。由 $S_{${n}} = ${S}$ 解出 $a_1$：`,
            `${S} = \\frac{${n}}{2}\\left(2a_1 + ${n - 1} \\cdot ${d}\\right) \\implies 2a_1 + ${(n - 1) * d} = ${Q.of(2 * S, n).toLatex()} \\implies a_1 = ${a}`,
          ),
        });
      },
    },
  ],
};

// Finite geometric series.

/** integerRatios are integer common ratios for geometric series. */
const integerRatios = [2, 3, -2, -3, 4].map((r) => Q.of(r));
/** fractionRatios are fractional common ratios with small numerators and denominators. */
const fractionRatios = [Q.of(1, 2), Q.of(-1, 2), Q.of(1, 3), Q.of(2, 3), Q.of(3, 2), Q.of(-1, 3), Q.of(3, 4)];

/** small tells whether every term and the sum of a geometric series stay at most a million in size. */
const small = (a: Q, r: Q, n: number) => [...geometric(a, r, n), geometricSum(a, r, n)].every((v) => v.abs().cmp(Q.of(1_000_000)) <= 0);

/** integerStart draws a first term that keeps the first n terms of the sequence with ratio r integers. */
const integerStart = (rng: Rng, r: Q, n: number, max = 5) => Q.of(rng.sign() * rng.int(1, max) * Number(r.d) ** (n - 1));

/** sumSteps writes the substituted sum formula of a geometric series and its value. */
const sumSteps = (a: Q, r: Q, n: number) => `S_{${n}} = ${formulaL(a, r, n)} = ${geometricSum(a, r, n).toLatex()}`;

/** theSumOfAFiniteGeometricSeries derives and uses S_n = a(1 - r^n)/(1 - r). */
export const theSumOfAFiniteGeometricSeries: TopicDef = {
  id: "the-sum-of-a-finite-geometric-series",
  title: t("The Sum of a Finite Geometric Series", "有限等比级数的和"),
  summary: t(
    "Derive $S_n = \\frac{a_1(1 - r^{n})}{1 - r}$ by subtracting $rS_n$ from $S_n$, and add geometric series written out term by term.",
    "用 $S_n$ 减去 $rS_n$ 推导出 $S_n = \\frac{a_1(1 - r^{n})}{1 - r}$，并求逐项写出的等比级数的和。",
  ),
  prerequisites: ["index-of-a-term-in-a-geometric-sequence"],
  encompasses: [
    { topic: "index-of-a-term-in-a-geometric-sequence", weight: 0.4 },
    { topic: "nth-term-of-a-geometric-sequence", weight: 0.4 },
    { topic: "powers-of-rational-numbers", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.SSE.B.4"],
  knowledgePoints: [
    {
      id: "the-sum-formula",
      title: t("The sum formula", "求和公式"),
      explanation: t(
        "Let $S_n = a_1 + a_1r + a_1r^{2} + \\cdots + a_1r^{n-1}$. Multiplying by $r$ shifts every term one place, so subtracting leaves only the two ends:\n\n$$S_n - rS_n = a_1 - a_1r^{n} \\implies S_n = \\frac{a_1(1 - r^{n})}{1 - r} \\quad (r \\ne 1)$$\n\nThe sum of the first $8$ terms of $3 + 6 + 12 + \\cdots$ is\n\n$$S_8 = \\frac{3(1 - 2^{8})}{1 - 2} = \\frac{3 \\cdot (-255)}{-1} = 765$$",
        "设 $S_n = a_1 + a_1r + a_1r^{2} + \\cdots + a_1r^{n-1}$。乘以 $r$ 后每一项都向后移一位，两式相减只剩两端：\n\n$$S_n - rS_n = a_1 - a_1r^{n} \\implies S_n = \\frac{a_1(1 - r^{n})}{1 - r} \\quad (r \\ne 1)$$\n\n$3 + 6 + 12 + \\cdots$ 前 $8$ 项的和是\n\n$$S_8 = \\frac{3(1 - 2^{8})}{1 - 2} = \\frac{3 \\cdot (-255)}{-1} = 765$$",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick(integerRatios);
          const a = Q.of(rng.sign() * rng.int(1, 6));
          const n = rng.int(5, 10);
          if (!small(a, r, n + 1)) continue;
          const series = openL(geometric(a, r, 3));
          return numberProblem({
            prompt: t(
              `Find the sum of the first $${n}$ terms of the geometric series $${series}$.`,
              `求等比级数 $${series}$ 前 $${n}$ 项的和。`,
            ),
            answer: geometricSum(a, r, n),
            wrong: [
              geometricSum(a, r, n - 1),
              geometricSum(a, r, n + 1),
              a.mul(r.pow(n - 1)),
              a.mul(Q.one.sub(r.pow(n))).div(Q.one.add(r)),
            ],
            solution: both(
              `Here $a_1 = ${a.toLatex()}$, $r = ${r.toLatex()}$ and $n = ${n}$:`,
              `这里 $a_1 = ${a.toLatex()}$，$r = ${r.toLatex()}$，$n = ${n}$：`,
              sumSteps(a, r, n),
            ),
          });
        }
      },
    },
    {
      id: "a-series-written-out",
      title: t("A series written out to its last term", "写到末项的级数"),
      explanation: t(
        "When the last term is shown, first find the number of terms from $a_n = a_1r^{n-1}$:\n\n$$2 + 6 + 18 + \\cdots + 1458$$\n\n$2 \\cdot 3^{n-1} = 1458$ gives $3^{n-1} = 729 = 3^{6}$, so $n = 7$ and\n\n$$S_7 = \\frac{2(1 - 3^{7})}{1 - 3} = \\frac{2 \\cdot (-2186)}{-2} = 2186$$",
        "给出末项时，先由 $a_n = a_1r^{n-1}$ 求出项数：\n\n$$2 + 6 + 18 + \\cdots + 1458$$\n\n由 $2 \\cdot 3^{n-1} = 1458$ 得 $3^{n-1} = 729 = 3^{6}$，所以 $n = 7$，\n\n$$S_7 = \\frac{2(1 - 3^{7})}{1 - 3} = \\frac{2 \\cdot (-2186)}{-2} = 2186$$",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick(integerRatios);
          const a = Q.of(rng.sign() * rng.int(1, 6));
          const n = rng.int(6, 10);
          if (!small(a, r, n + 1)) continue;
          const terms = geometric(a, r, n);
          const last = terms[n - 1]!;
          return numberProblem({
            prompt: t(`Find the sum of the geometric series $${seriesL(terms)}$.`, `求等比级数 $${seriesL(terms)}$ 的和。`),
            answer: geometricSum(a, r, n),
            wrong: [geometricSum(a, r, n - 1), geometricSum(a, r, n + 1), total(terms.slice(0, 3).concat([last]))],
            solution: both(
              `The common ratio is $${r.toLatex()}$. Find the number of terms, then use the sum formula:`,
              `公比是 $${r.toLatex()}$。先求项数，再用求和公式：`,
              `${geometricTerm(a, r, "n-1")} = ${last.toLatex()} \\implies ${base(r)}^{n-1} = ${r.pow(n - 1).toLatex()} \\implies n = ${n}`,
              sumSteps(a, r, n),
            ),
          });
        }
      },
    },
    {
      id: "fractional-ratios",
      title: t("Fractional ratios", "分数公比"),
      explanation: t(
        "The formula works the same way for a fractional ratio. Write the powers as fractions and simplify:\n\n$$48 + 24 + 12 + \\cdots + \\frac{3}{4}$$\n\nhas $r = \\frac{1}{2}$ and $48\\left(\\frac{1}{2}\\right)^{n-1} = \\frac{3}{4}$, so $n = 7$ and\n\n$$S_7 = \\frac{48\\left(1 - \\left(\\frac{1}{2}\\right)^{7}\\right)}{1 - \\frac{1}{2}} = 96\\left(1 - \\frac{1}{128}\\right) = \\frac{381}{4}$$",
        "公比是分数时，公式同样适用。把乘方写成分数再化简：\n\n$$48 + 24 + 12 + \\cdots + \\frac{3}{4}$$\n\n中 $r = \\frac{1}{2}$，由 $48\\left(\\frac{1}{2}\\right)^{n-1} = \\frac{3}{4}$ 得 $n = 7$，\n\n$$S_7 = \\frac{48\\left(1 - \\left(\\frac{1}{2}\\right)^{7}\\right)}{1 - \\frac{1}{2}} = 96\\left(1 - \\frac{1}{128}\\right) = \\frac{381}{4}$$",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick(fractionRatios);
          const n = rng.int(4, 7);
          const whole = rng.bool();
          const a = whole ? integerStart(rng, r, n, 3) : Q.of(rng.sign() * rng.int(1, 4) * Number(r.d) ** rng.int(1, n - 2));
          if (!small(a, r, n + 1) || a.abs().cmp(Q.of(2000)) > 0) continue;
          const terms = geometric(a, r, n);
          return numberProblem({
            prompt: t(`Find the sum of the geometric series $${seriesL(terms)}$.`, `求等比级数 $${seriesL(terms)}$ 的和。`),
            answer: geometricSum(a, r, n),
            wrong: [
              geometricSum(a, r, n - 1),
              geometricSum(a, r, n + 1),
              a.div(Q.one.sub(r)),
              a.mul(Q.one.sub(r.pow(n))).div(Q.one.add(r)),
            ],
            solution: both(
              `The common ratio is $${r.toLatex()}$ and there are $${n}$ terms:`,
              `公比是 $${r.toLatex()}$，共 $${n}$ 项：`,
              sumSteps(a, r, n),
            ),
          });
        }
      },
    },
  ],
};

/** theSumOfTheFirstNTermsOfAGeometricSeries finds S_n of a geometric sequence given by a formula or two terms. */
export const theSumOfTheFirstNTermsOfAGeometricSeries: TopicDef = {
  id: "the-sum-of-the-first-n-terms-of-a-geometric-series",
  title: t("The Sum of the First N Terms of a Geometric Series", "等比级数前 n 项的和"),
  summary: t(
    "Find $S_n$ for a geometric sequence given by an explicit formula or by two of its terms, and find the first term from a sum.",
    "对由通项公式或其中两项给出的等比数列求 $S_n$，并由和求首项。",
  ),
  prerequisites: ["the-sum-of-a-finite-geometric-series", "geometric-sequences-from-two-terms"],
  encompasses: [
    { topic: "the-sum-of-a-finite-geometric-series", weight: 0.6 },
    { topic: "geometric-sequences-from-two-terms", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.SSE.B.4"],
  knowledgePoints: [
    {
      id: "from-an-explicit-formula",
      title: t("From an explicit formula", "由通项公式求和"),
      explanation: t(
        "To add the first $n$ terms of $a_n = c \\cdot r^{n + s}$, read the common ratio $r$ from the base and find the first term by substituting $n = 1$; the coefficient $c$ is the first term only when the exponent is $n - 1$. For $a_n = 5 \\cdot 2^{n}$, $a_1 = 10$ and $r = 2$, so\n\n$$S_6 = \\frac{10(1 - 2^{6})}{1 - 2} = 630$$",
        "要把 $a_n = c \\cdot r^{n + s}$ 的前 $n$ 项相加，从底数读出公比 $r$，代入 $n = 1$ 求出首项；只有指数是 $n - 1$ 时，系数 $c$ 才是首项。对 $a_n = 5 \\cdot 2^{n}$，$a_1 = 10$，$r = 2$，所以\n\n$$S_6 = \\frac{10(1 - 2^{6})}{1 - 2} = 630$$",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick(integerRatios);
          const c = Q.of(rng.sign() * rng.int(1, 6));
          const s = rng.pick([-1, 0, 1]);
          const n = rng.int(5, 9);
          const a = c.mul(r.pow(1 + s));
          if (!small(a, r, n + 1)) continue;
          const exponent = s === 0 ? "n" : s < 0 ? "n-1" : "n+1";
          const formula = `a_n = ${geometricTerm(c, r, exponent)}`;
          return numberProblem({
            prompt: t(
              `Find the sum of the first $${n}$ terms of the geometric sequence $${formula}$.`,
              `求等比数列 $${formula}$ 前 $${n}$ 项的和。`,
            ),
            answer: geometricSum(a, r, n),
            wrong: [geometricSum(c, r, n), geometricSum(a, r, n - 1), geometricSum(a, r, n + 1), a.mul(r.pow(n - 1))],
            solution: both(
              `The common ratio is $${r.toLatex()}$ and the first term is $a_1 = ${a.toLatex()}$:`,
              `公比是 $${r.toLatex()}$，首项是 $a_1 = ${a.toLatex()}$：`,
              sumSteps(a, r, n),
            ),
          });
        }
      },
    },
    {
      id: "from-two-terms",
      title: t("From two terms", "由两项求和"),
      explanation: t(
        "When two terms are given, divide them to find the ratio, then work back to the first term. If $a_2 = 6$ and $a_5 = 162$, then $r^{3} = \\frac{162}{6} = 27$, so $r = 3$ and $a_1 = \\frac{6}{3} = 2$:\n\n$$S_6 = \\frac{2(1 - 3^{6})}{1 - 3} = 728$$",
        "给出两项时，用它们相除求出公比，再倒推出首项。若 $a_2 = 6$，$a_5 = 162$，则 $r^{3} = \\frac{162}{6} = 27$，所以 $r = 3$，$a_1 = \\frac{6}{3} = 2$：\n\n$$S_6 = \\frac{2(1 - 3^{6})}{1 - 3} = 728$$",
      ),
      generate(rng) {
        for (;;) {
          const gap = rng.int(1, 3);
          const r = gap === 2 ? rng.pick([Q.of(2), Q.of(3)]) : rng.pick(integerRatios);
          const a = Q.of(rng.sign() * rng.int(1, 5));
          const p = rng.int(2, 3);
          const q = p + gap;
          const n = rng.int(5, 8);
          if (!small(a, r, Math.max(n, q) + 1)) continue;
          const ap = a.mul(r.pow(p - 1));
          const aq = a.mul(r.pow(q - 1));
          const note = gap === 2 ? t(" The common ratio is positive.", "公比为正数。") : t("", "");
          return numberProblem({
            prompt: t(
              `In a geometric sequence, $a_{${p}} = ${ap.toLatex()}$ and $a_{${q}} = ${aq.toLatex()}$.${note.en} Find the sum of the first $${n}$ terms.`,
              `在一个等比数列中，$a_{${p}} = ${ap.toLatex()}$，$a_{${q}} = ${aq.toLatex()}$。${note["zh-CN"]}求前 $${n}$ 项的和。`,
            ),
            answer: geometricSum(a, r, n),
            wrong: [geometricSum(ap, r, n), geometricSum(a, r, n - 1), geometricSum(a, r, n + 1)],
            solution: both(
              `Divide the terms to find the ratio, then the first term:`,
              `用两项相除求出公比，再求首项：`,
              `r^{${gap}} = \\frac{${aq.toLatex()}}{${ap.toLatex()}} = ${aq.div(ap).toLatex()} \\implies r = ${r.toLatex()} \\qquad a_1 = \\frac{${ap.toLatex()}}{${r.pow(p - 1).toLatex()}} = ${a.toLatex()}`,
              sumSteps(a, r, n),
            ),
          });
        }
      },
    },
    {
      id: "the-first-term-from-the-sum",
      title: t("The first term from the sum", "由和求首项"),
      explanation: t(
        "Solve the sum formula for $a_1$ when the sum is known. A geometric series of $5$ terms with common ratio $3$ has sum $605$:\n\n$$605 = \\frac{a_1(1 - 3^{5})}{1 - 3} = 121a_1 \\implies a_1 = 5$$",
        "已知和时，由求和公式解出 $a_1$。一个等比级数有 $5$ 项，公比为 $3$，和为 $605$：\n\n$$605 = \\frac{a_1(1 - 3^{5})}{1 - 3} = 121a_1 \\implies a_1 = 5$$",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick(integerRatios);
          const a = Q.of(rng.sign() * rng.int(1, 9));
          const n = rng.int(4, 8);
          if (!small(a, r, n + 1)) continue;
          const S = geometricSum(a, r, n);
          const factor = geometricSum(Q.one, r, n);
          return numberProblem({
            prompt: t(
              `A geometric series has $${n}$ terms, a common ratio of $${r.toLatex()}$ and a sum of $${S.toLatex()}$. Find its first term.`,
              `一个等比级数有 $${n}$ 项，公比为 $${r.toLatex()}$，和为 $${S.toLatex()}$。求它的首项。`,
            ),
            answer: a,
            solveFor: "a_1",
            wrong: [S.div(Q.of(n)), S.div(r.pow(n - 1)), S.div(geometricSum(Q.one, r, n + 1)), S.div(r.pow(n))],
            solution: both(
              "Substitute into the sum formula and solve for $a_1$:",
              "代入求和公式，解出 $a_1$：",
              `${S.toLatex()} = ${formulaL(Q.one, r, n).replace("1\\left(", "a_1\\left(")} = ${factor.toLatex()}a_1 \\implies a_1 = ${a.toLatex()}`,
            ),
          });
        }
      },
    },
  ],
};

/** GeometricData is a geometric series a + ar + … with n terms. */
interface GeometricData {
  readonly a: Q;
  readonly r: Q;
  readonly n: number;
}

/** someGeometricSeries draws a geometric series of integers with 5 to 10 terms. */
function someGeometricSeries(rng: Rng): GeometricData {
  for (;;) {
    const r = rng.bool(0.7) ? rng.pick(integerRatios) : rng.pick([Q.of(1, 2), Q.of(-1, 2), Q.of(1, 3)]);
    const n = rng.int(5, 10);
    const a = r.isInteger() ? Q.of(rng.sign() * rng.int(1, 6)) : integerStart(rng, r, n, 3);
    if (small(a, r, n + 1)) return { a, r, n };
  }
}

/** writingGeometricSeriesInSigmaNotation writes geometric series as sums of a · r^(k-1). */
export const writingGeometricSeriesInSigmaNotation: TopicDef = {
  id: "writing-geometric-series-in-sigma-notation",
  title: t("Writing Geometric Series in Sigma Notation", "用求和符号表示等比级数"),
  summary: t(
    "Write a geometric series as $\\sum_{k=1}^{n} a_1r^{k-1}$: find the general term and the upper limit, and recognize equivalent limits.",
    "把等比级数写成 $\\sum_{k=1}^{n} a_1r^{k-1}$：求通项和上限，并识别等价的上下限写法。",
  ),
  prerequisites: ["the-sum-of-a-finite-geometric-series", "expressing-an-arithmetic-series-in-sigma-notation"],
  encompasses: [
    { topic: "expressing-an-arithmetic-series-in-sigma-notation", weight: 0.3 },
    { topic: "index-of-a-term-in-a-geometric-sequence", weight: 0.5 },
    { topic: "nth-term-of-a-geometric-sequence", weight: 0.5 },
  ],
  xp: 14,
  knowledgePoints: [
    {
      id: "the-general-term",
      title: t("The general term", "通项"),
      explanation: t(
        "A geometric series with first term $a_1$ and common ratio $r$ has $k$th term $a_1r^{k-1}$:\n\n$$3 + 6 + 12 + \\cdots + 384 = \\sum_{k=1}^{8} 3 \\cdot 2^{k-1}$$\n\nbecause $a_1 = 3$, $r = 2$ and $384 = 3 \\cdot 2^{7}$ is the $8$th term. A negative or fractional ratio goes in parentheses: $\\sum_{k=1}^{6} 5\\left(-\\frac{1}{2}\\right)^{k-1}$.",
        "首项为 $a_1$、公比为 $r$ 的等比级数，第 $k$ 项是 $a_1r^{k-1}$：\n\n$$3 + 6 + 12 + \\cdots + 384 = \\sum_{k=1}^{8} 3 \\cdot 2^{k-1}$$\n\n因为 $a_1 = 3$，$r = 2$，而 $384 = 3 \\cdot 2^{7}$ 是第 $8$ 项。负数或分数公比要加括号：$\\sum_{k=1}^{6} 5\\left(-\\frac{1}{2}\\right)^{k-1}$。",
      ),
      generate(rng) {
        const { a, r, n } = someGeometricSeries(rng);
        const series = seriesL(geometric(a, r, n));
        const answer = geometricTerm(a, r, "k-1");
        return expressionProblem({
          prompt: t(
            `Write $${series}$ in sigma notation: find the expression for its $k$th term.`,
            `用求和符号表示 $${series}$：求它第 $k$ 项的表达式。`,
          ),
          answer,
          prefix: `\\sum_{k=1}^{${n}}`,
          wrong: [
            geometricTerm(a, r, "k"),
            geometricTerm(r, a, "k-1"),
            geometricTerm(Q.one, a.mul(r), "k-1"),
            geometricTerm(a, r.abs(), "k-1"),
          ],
          solution: both(
            `The first term is $${a.toLatex()}$ and the common ratio is $${r.toLatex()}$, so the $k$th term is $${answer}$:`,
            `首项是 $${a.toLatex()}$，公比是 $${r.toLatex()}$，所以第 $k$ 项是 $${answer}$：`,
            `${series} = ${sumL(1, n, answer)}`,
          ),
        });
      },
    },
    {
      id: "the-upper-limit",
      title: t("The upper limit", "上限"),
      explanation: t(
        "The upper limit is the number of the last term. Set the general term equal to the last term and solve for $k$:\n\n$$2 + 10 + 50 + \\cdots + 31250 = \\sum_{k=1}^{N} 2 \\cdot 5^{k-1}$$\n\n$2 \\cdot 5^{k-1} = 31250$ gives $5^{k-1} = 15625 = 5^{6}$, so $k = 7$ and $N = 7$.",
        "上限是末项的序号。令通项等于末项，解出 $k$：\n\n$$2 + 10 + 50 + \\cdots + 31250 = \\sum_{k=1}^{N} 2 \\cdot 5^{k-1}$$\n\n由 $2 \\cdot 5^{k-1} = 31250$ 得 $5^{k-1} = 15625 = 5^{6}$，所以 $k = 7$，$N = 7$。",
      ),
      generate(rng) {
        const { a, r, n } = someGeometricSeries(rng);
        const terms = geometric(a, r, n);
        const body = geometricTerm(a, r, "k-1");
        const series = seriesL(terms);
        return numberProblem({
          prompt: t(`Find $N$ such that $${series} = ${sumL(1, "N", body)}$.`, `求 $N$，使 $${series} = ${sumL(1, "N", body)}$。`),
          answer: n,
          solveFor: "N",
          wrong: [n - 1, n + 1],
          solution: both(
            `The last term $${terms[n - 1]!.toLatex()}$ is term number $N$. Set the general term equal to it:`,
            `末项 $${terms[n - 1]!.toLatex()}$ 是第 $N$ 项。令通项等于它：`,
            `${body} = ${terms[n - 1]!.toLatex()} \\implies ${base(r)}^{k-1} = ${r.pow(n - 1).toLatex()} \\implies k = ${n}`,
          ),
        });
      },
    },
    {
      id: "equivalent-limits",
      title: t("Choosing the limits", "选择上下限"),
      explanation: t(
        "Starting the index at $0$ instead of $1$ lowers each exponent by one and the upper limit by one:\n\n$$3 + 6 + \\cdots + 384 = \\sum_{k=1}^{8} 3 \\cdot 2^{k-1} = \\sum_{k=0}^{7} 3 \\cdot 2^{k}$$\n\nCheck a candidate by its first term and its number of terms: $\\sum_{k=1}^{8} 3 \\cdot 2^{k}$ starts at $6$, so it is a different series.",
        "下标从 $0$ 而不是从 $1$ 开始时，每个指数减 $1$，上限也减 $1$：\n\n$$3 + 6 + \\cdots + 384 = \\sum_{k=1}^{8} 3 \\cdot 2^{k-1} = \\sum_{k=0}^{7} 3 \\cdot 2^{k}$$\n\n检查一个写法时，看它的首项和项数：$\\sum_{k=1}^{8} 3 \\cdot 2^{k}$ 从 $6$ 开始，所以是另一个级数。",
      ),
      generate(rng) {
        const { a, r, n } = someGeometricSeries(rng);
        const series = seriesL(geometric(a, r, n));
        const fromOne = (lo: number, hi: number): SigmaOption => ({
          lo,
          hi,
          body: geometricTerm(a, r, "k-1"),
          f: (k) => a.mul(r.pow(k - 1)),
        });
        const fromZero = (lo: number, hi: number): SigmaOption => ({ lo, hi, body: geometricTerm(a, r, "k"), f: (k) => a.mul(r.pow(k)) });
        const correct = rng.bool() ? fromOne(1, n) : fromZero(0, n - 1);
        const swapped: SigmaOption = { lo: 1, hi: n, body: geometricTerm(r, a, "k-1"), f: (k) => r.mul(a.pow(k - 1)) };
        return sigmaChoice(
          rng,
          t(`Which sum equals $${series}$?`, `哪个和等于 $${series}$？`),
          correct,
          [fromZero(1, n), fromZero(0, n), fromOne(1, n - 1), fromOne(2, n + 1), swapped],
          both(
            `The series has first term $${a.toLatex()}$, common ratio $${r.toLatex()}$ and $${n}$ terms. The right sum gives $${a.toLatex()}$ at its lower limit and has $${n}$ terms:`,
            `这个级数首项是 $${a.toLatex()}$，公比是 $${r.toLatex()}$，共 $${n}$ 项。正确的和在下限处给出 $${a.toLatex()}$，并且有 $${n}$ 项：`,
            `${series} = ${sumL(correct.lo, correct.hi, correct.body)}`,
          ),
        );
      },
    },
  ],
};

/** sumsOfFiniteGeometricSeriesGivenInSigmaNotation evaluates sums of c · r^k between limits. */
export const sumsOfFiniteGeometricSeriesGivenInSigmaNotation: TopicDef = {
  id: "sums-of-finite-geometric-series-given-in-sigma-notation",
  title: t("Sums of Finite Geometric Series Given in Sigma Notation", "用求和符号给出的有限等比级数的和"),
  summary: t(
    "Evaluate $\\sum_{k=m}^{n} c \\cdot r^{k}$ by reading off its first term, common ratio and number of terms.",
    "读出 $\\sum_{k=m}^{n} c \\cdot r^{k}$ 的首项、公比和项数，求出它的值。",
  ),
  prerequisites: ["writing-geometric-series-in-sigma-notation", "the-sum-of-the-first-n-terms-of-a-geometric-series"],
  encompasses: [
    { topic: "writing-geometric-series-in-sigma-notation", weight: 0.4 },
    { topic: "the-sum-of-the-first-n-terms-of-a-geometric-series", weight: 0.5 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.SSE.B.4"],
  knowledgePoints: [
    {
      id: "starting-at-one",
      title: t("Sums starting at $k = 1$", "从 $k = 1$ 开始的和"),
      explanation: t(
        "In $\\sum_{k=1}^{n} c \\cdot r^{k-1}$, the first term is $c$ (at $k = 1$), the ratio is the base $r$ and there are $n$ terms:\n\n$$\\sum_{k=1}^{6} 4 \\cdot 3^{k-1} = \\frac{4(1 - 3^{6})}{1 - 3} = \\frac{4 \\cdot (-728)}{-2} = 1456$$",
        "在 $\\sum_{k=1}^{n} c \\cdot r^{k-1}$ 中，首项是 $c$（$k = 1$ 时），公比是底数 $r$，共 $n$ 项：\n\n$$\\sum_{k=1}^{6} 4 \\cdot 3^{k-1} = \\frac{4(1 - 3^{6})}{1 - 3} = \\frac{4 \\cdot (-728)}{-2} = 1456$$",
      ),
      generate(rng) {
        const { a, r, n } = someGeometricSeries(rng);
        const expr = sumL(1, n, geometricTerm(a, r, "k-1"));
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: geometricSum(a, r, n),
          wrong: [geometricSum(a.mul(r), r, n), geometricSum(a, r, n - 1), geometricSum(a, r, n + 1), a.mul(r.pow(n - 1))],
          solution: both(
            `The first term is $${a.toLatex()}$, the ratio is $${r.toLatex()}$ and there are $${n}$ terms:`,
            `首项是 $${a.toLatex()}$，公比是 $${r.toLatex()}$，共 $${n}$ 项：`,
            `${expr} = ${formulaL(a, r, n)} = ${geometricSum(a, r, n).toLatex()}`,
          ),
        });
      },
    },
    {
      id: "exponent-k",
      title: t("Sums of $c \\cdot r^{k}$", "$c \\cdot r^{k}$ 的和"),
      explanation: t(
        "When the exponent is $k$, find the first term by substituting the lower limit, and count the terms with $n - m + 1$:\n\n$$\\sum_{k=1}^{5} 2 \\cdot 3^{k} \\text{ has } a_1 = 6, \\ r = 3, \\ 5 \\text{ terms}: \\quad \\frac{6(1 - 3^{5})}{1 - 3} = 726$$\n\n$$\\sum_{k=0}^{5} 2 \\cdot 3^{k} \\text{ has } a_1 = 2, \\ r = 3, \\ 6 \\text{ terms}: \\quad \\frac{2(1 - 3^{6})}{1 - 3} = 728$$",
        "指数是 $k$ 时，代入下限求出首项，用 $n - m + 1$ 数出项数：\n\n$$\\sum_{k=1}^{5} 2 \\cdot 3^{k} \\text{ 中 } a_1 = 6, \\ r = 3, \\ \\text{共 } 5 \\text{ 项}: \\quad \\frac{6(1 - 3^{5})}{1 - 3} = 726$$\n\n$$\\sum_{k=0}^{5} 2 \\cdot 3^{k} \\text{ 中 } a_1 = 2, \\ r = 3, \\ \\text{共 } 6 \\text{ 项}: \\quad \\frac{2(1 - 3^{6})}{1 - 3} = 728$$",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick(integerRatios);
          const c = Q.of(rng.sign() * rng.int(1, 5));
          const lo = rng.int(0, 1);
          const hi = rng.int(4, 8);
          const count = hi - lo + 1;
          const a = c.mul(r.pow(lo));
          if (!small(c, r, hi + 2)) continue;
          const expr = sumL(lo, hi, geometricTerm(c, r, "k"));
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
            answer: geometricSum(a, r, count),
            wrong: [geometricSum(lo === 0 ? c.mul(r) : c, r, count), geometricSum(a, r, count - 1), geometricSum(a, r, count + 1)],
            solution: both(
              `At $k = ${lo}$ the first term is $${a.toLatex()}$. The ratio is $${r.toLatex()}$ and there are $${hi} - ${lo} + 1 = ${count}$ terms:`,
              `$k = ${lo}$ 时首项是 $${a.toLatex()}$。公比是 $${r.toLatex()}$，共 $${hi} - ${lo} + 1 = ${count}$ 项：`,
              `${expr} = ${formulaL(a, r, count)} = ${geometricSum(a, r, count).toLatex()}`,
            ),
          });
        }
      },
    },
    {
      id: "later-lower-limits",
      title: t("Later lower limits", "下限较大的和"),
      explanation: t(
        "The lower limit can be any integer, and the ratio a fraction. In\n\n$$\\sum_{k=3}^{8} 64\\left(\\frac{1}{2}\\right)^{k}$$\n\nthe first term is $64\\left(\\frac{1}{2}\\right)^{3} = 8$, the ratio is $\\frac{1}{2}$ and there are $8 - 3 + 1 = 6$ terms, so the sum is $\\frac{8\\left(1 - \\left(\\frac{1}{2}\\right)^{6}\\right)}{1 - \\frac{1}{2}} = \\frac{63}{4}$.",
        "下限可以是任意整数，公比也可以是分数。在\n\n$$\\sum_{k=3}^{8} 64\\left(\\frac{1}{2}\\right)^{k}$$\n\n中，首项是 $64\\left(\\frac{1}{2}\\right)^{3} = 8$，公比是 $\\frac{1}{2}$，共 $8 - 3 + 1 = 6$ 项，所以和为 $\\frac{8\\left(1 - \\left(\\frac{1}{2}\\right)^{6}\\right)}{1 - \\frac{1}{2}} = \\frac{63}{4}$。",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.bool() ? rng.pick(integerRatios) : rng.pick(fractionRatios);
          const lo = rng.int(2, 4);
          const hi = lo + rng.int(3, 5);
          const count = hi - lo + 1;
          const c = Q.of(rng.sign() * rng.int(1, 3) * Number(r.d) ** lo);
          const a = c.mul(r.pow(lo));
          if (!small(a, r, count + 1) || c.abs().cmp(Q.of(1000)) > 0) continue;
          const expr = sumL(lo, hi, geometricTerm(c, r, "k"));
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
            answer: geometricSum(a, r, count),
            wrong: [geometricSum(c, r, count), geometricSum(a, r, count - 1), geometricSum(a, r, hi), geometricSum(a, r, count + 1)],
            solution: both(
              `At $k = ${lo}$ the first term is $${a.toLatex()}$. The ratio is $${r.toLatex()}$ and there are $${hi} - ${lo} + 1 = ${count}$ terms:`,
              `$k = ${lo}$ 时首项是 $${a.toLatex()}$。公比是 $${r.toLatex()}$，共 $${hi} - ${lo} + 1 = ${count}$ 项：`,
              `${expr} = ${formulaL(a, r, count)} = ${geometricSum(a, r, count).toLatex()}`,
            ),
          });
        }
      },
    },
  ],
};

/** growthRatios are ratios greater than 1 with terminating decimals. */
const growthRatios = [Q.of(3, 2), Q.of(6, 5), Q.of(5, 4), Q.of(2), Q.of(3), Q.of(11, 10)];

/** firstExceeding is the least n for which the sum of n terms of a + ar + … is greater than T, or undefined beyond max. */
function firstExceeding(a: Q, r: Q, T: Q, max: number): number | undefined {
  let s = Q.zero;
  for (let n = 1; n <= max; n++) {
    s = s.add(a.mul(r.pow(n - 1)));
    if (s.cmp(T) > 0) return n;
  }
  return undefined;
}

/** solvingGeometricSeriesProblemsUsingExponentialEquationsAndInequalities solves for the number of terms of a geometric series. */
export const solvingGeometricSeriesProblemsUsingExponentialEquationsAndInequalities: TopicDef = {
  id: "solving-geometric-series-problems-using-exponential-equations-and-inequalities",
  title: t("Solving Geometric Series Problems Using Exponential Equations and Inequalities", "用指数方程和不等式解等比级数问题"),
  summary: t(
    "Find the number of terms of a geometric series from its sum, and the fewest terms whose sum passes a value, by solving for $r^{n}$ and taking logarithms.",
    "解出 $r^{n}$ 并取对数，由等比级数的和求项数，以及和超过某个值所需的最少项数。",
  ),
  prerequisites: ["the-sum-of-the-first-n-terms-of-a-geometric-series", "solving-exponential-equations-using-logarithms"],
  encompasses: [
    { topic: "the-sum-of-the-first-n-terms-of-a-geometric-series", weight: 0.5 },
    { topic: "solving-exponential-equations-using-logarithms", weight: 0.5 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.SSE.B.4", "CCSS.HSF.LE.A.4"],
  knowledgePoints: [
    {
      id: "the-number-of-terms-from-the-sum",
      title: t("The number of terms from the sum", "由和求项数"),
      explanation: t(
        "Substitute the sum into the formula and isolate the power $r^{n}$. How many terms of $4 + 12 + 36 + \\cdots$ add to $4372$?\n\n$$\\frac{4(3^{n} - 1)}{3 - 1} = 4372 \\implies 3^{n} - 1 = 2186 \\implies 3^{n} = 2187 = 3^{7}$$\n\nso $n = 7$. (For $r > 1$ it is convenient to write the formula as $S_n = \\frac{a_1(r^{n} - 1)}{r - 1}$.)",
        "把和代入公式，分离出乘方 $r^{n}$。$4 + 12 + 36 + \\cdots$ 的前多少项之和为 $4372$？\n\n$$\\frac{4(3^{n} - 1)}{3 - 1} = 4372 \\implies 3^{n} - 1 = 2186 \\implies 3^{n} = 2187 = 3^{7}$$\n\n所以 $n = 7$。（$r > 1$ 时，把公式写成 $S_n = \\frac{a_1(r^{n} - 1)}{r - 1}$ 更方便。）",
      ),
      generate(rng) {
        for (;;) {
          const r = Q.of(rng.int(2, 5));
          const a = Q.of(rng.int(1, 9));
          const n = rng.int(4, 10);
          const S = geometricSum(a, r, n);
          if (S.cmp(Q.of(2_000_000)) > 0) continue;
          const series = openL(geometric(a, r, 3));
          return numberProblem({
            prompt: t(
              `How many terms of the geometric series $${series}$ add to $${grouped(S)}$?`,
              `等比级数 $${series}$ 的前多少项之和为 $${grouped(S)}$？`,
            ),
            answer: n,
            solveFor: "n",
            wrong: [n - 1, n + 1, n + 2],
            solution: both(
              `Substitute $a_1 = ${a.toLatex()}$ and $r = ${r.toLatex()}$ into $S_n = \\frac{a_1(r^{n} - 1)}{r - 1}$ and isolate $${r.toLatex()}^{n}$:`,
              `把 $a_1 = ${a.toLatex()}$、$r = ${r.toLatex()}$ 代入 $S_n = \\frac{a_1(r^{n} - 1)}{r - 1}$，分离出 $${r.toLatex()}^{n}$：`,
              `\\frac{${a.toLatex()}(${r.toLatex()}^{n} - 1)}{${r.sub(Q.one).toLatex()}} = ${S.toLatex()} \\implies ${r.toLatex()}^{n} = ${r.pow(n).toLatex()} = ${r.toLatex()}^{${n}} \\implies n = ${n}`,
            ),
          });
        }
      },
    },
    {
      id: "a-sum-exceeding-a-value",
      title: t("A sum exceeding a value", "和超过某个值"),
      explanation: t(
        "To find the fewest terms whose sum is greater than a value, write the inequality, isolate $r^{n}$ and take logarithms. Dividing by $\\ln r > 0$ keeps the direction. For $16 + 24 + 36 + \\cdots$ ($r = \\frac{3}{2}$) and a sum greater than $1000$:\n\n$$\\frac{16(1.5^{n} - 1)}{0.5} > 1000 \\implies 1.5^{n} > 32.25 \\implies n > \\frac{\\ln 32.25}{\\ln 1.5} \\approx 8.57$$\n\nso the least number of terms is $9$.",
        "要求和大于某个值所需的最少项数，列出不等式，分离出 $r^{n}$，再取对数。除以 $\\ln r > 0$ 时不等号方向不变。对 $16 + 24 + 36 + \\cdots$（$r = \\frac{3}{2}$），要使和大于 $1000$：\n\n$$\\frac{16(1.5^{n} - 1)}{0.5} > 1000 \\implies 1.5^{n} > 32.25 \\implies n > \\frac{\\ln 32.25}{\\ln 1.5} \\approx 8.57$$\n\n所以最少需要 $9$ 项。",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick(growthRatios);
          const a = Q.of(rng.int(1, 6) * Number(r.d) ** 2);
          const T = Q.of(rng.pick([500, 1000, 2000, 5000, 10000, 50000]) * rng.int(1, 4));
          const n = firstExceeding(a, r, T, 60);
          if (n === undefined || n < 4 || n > 40) continue;
          const rhs = Q.one.add(T.mul(r.sub(Q.one)).div(a));
          const x = Math.log(rhs.toNumber()) / Math.log(r.toNumber());
          if (Math.abs(x - Math.round(x)) < 0.01) continue;
          const rL = r.isInteger() ? r.toLatex() : dec(r);
          const series = openL(geometric(a, r, 3));
          return numberProblem({
            prompt: t(
              `What is the least number of terms of the geometric series $${series}$ whose sum is greater than $${grouped(T)}$?`,
              `等比级数 $${series}$ 至少要加多少项，和才大于 $${grouped(T)}$？`,
            ),
            answer: n,
            wrong: [n - 1, n + 1, Math.floor(x)],
            solution: both(
              `Here $a_1 = ${a.toLatex()}$ and $r = ${rL}$. Isolate $${rL}^{n}$ and take logarithms:`,
              `这里 $a_1 = ${a.toLatex()}$，$r = ${rL}$。分离出 $${rL}^{n}$ 再取对数：`,
              `\\frac{${a.toLatex()}(${rL}^{n} - 1)}{${dec(r.sub(Q.one))}} > ${T.toLatex()} \\implies ${rL}^{n} > ${rhs.isInteger() || terminates(rhs) ? dec(rhs) : rhs.toLatex()}`,
              `n > \\frac{\\ln ${rhs.isInteger() || terminates(rhs) ? dec(rhs) : `\\left(${rhs.toLatex()}\\right)`}}{\\ln ${rL}} \\approx ${x.toFixed(2)} \\implies n = ${n}`,
            ),
          });
        }
      },
    },
    {
      id: "sums-with-ratios-less-than-one",
      title: t("Ratios between $0$ and $1$", "公比在 $0$ 与 $1$ 之间"),
      explanation: t(
        "When $0 < r < 1$, the sums grow towards $\\frac{a_1}{1 - r}$ but never reach it. To find when the sum passes a value close to that, isolate $r^{n}$ and take logarithms. Dividing by $\\ln r < 0$ **reverses** the inequality. For $50 + 25 + 12.5 + \\cdots$ and a sum greater than $99.9$:\n\n$$\\frac{50(1 - 0.5^{n})}{0.5} > 99.9 \\implies 0.5^{n} < 0.001 \\implies n > \\frac{\\ln 0.001}{\\ln 0.5} \\approx 9.97$$\n\nso $10$ terms are needed.",
        "当 $0 < r < 1$ 时，和逐渐增大，趋近于 $\\frac{a_1}{1 - r}$ 但永远达不到。要求和何时超过接近它的某个值，分离出 $r^{n}$ 再取对数。除以 $\\ln r < 0$ 时不等号要**改变方向**。对 $50 + 25 + 12.5 + \\cdots$，要使和大于 $99.9$：\n\n$$\\frac{50(1 - 0.5^{n})}{0.5} > 99.9 \\implies 0.5^{n} < 0.001 \\implies n > \\frac{\\ln 0.001}{\\ln 0.5} \\approx 9.97$$\n\n所以需要 $10$ 项。",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick([Q.of(1, 2), Q.of(1, 3), Q.of(2, 3), Q.of(3, 4), Q.of(4, 5), Q.of(9, 10)]);
          const L = Q.of(rng.int(1, 9) * Number(r.d) * rng.pick([10, 100]));
          const a = L.mul(Q.one.sub(r));
          const e = rng.pick([Q.of(1), Q.of(1, 10), Q.of(1, 100), Q.of(5), Q.of(1, 2)]);
          const T = L.sub(e);
          if (T.sign() <= 0 || !a.isInteger()) continue;
          const n = firstExceeding(a, r, T, 80);
          if (n === undefined || n < 4 || n > 50) continue;
          const bound = e.div(L);
          const x = Math.log(bound.toNumber()) / Math.log(r.toNumber());
          if (Math.abs(x - Math.round(x)) < 0.01) continue;
          const series = openL(geometric(a, r, 3));
          const TL = dec(T);
          return numberProblem({
            prompt: t(
              `What is the least number of terms of the geometric series $${series}$ whose sum is greater than $${TL}$?`,
              `等比级数 $${series}$ 至少要加多少项，和才大于 $${TL}$？`,
            ),
            answer: n,
            wrong: [n - 1, n + 1, Math.ceil(T.div(a).toNumber())],
            solution: both(
              `Here $a_1 = ${a.toLatex()}$ and $r = ${r.toLatex()}$. Isolate $r^{n}$, then take logarithms; $\\ln ${r.toLatex()} < 0$ reverses the inequality:`,
              `这里 $a_1 = ${a.toLatex()}$，$r = ${r.toLatex()}$。分离出 $r^{n}$ 再取对数；$\\ln ${r.toLatex()} < 0$，不等号改变方向：`,
              `\\frac{${a.toLatex()}\\left(1 - ${base(r)}^{n}\\right)}{1 - ${r.toLatex()}} > ${TL} \\implies ${base(r)}^{n} < ${bound.toLatex()}`,
              `n > \\frac{\\ln ${bound.toLatex()}}{\\ln ${r.toLatex()}} \\approx ${x.toFixed(2)} \\implies n = ${n}`,
            ),
          });
        }
      },
    },
  ],
};

/** terminates tells whether a rational number has a terminating decimal expansion. */
function terminates(v: Q): boolean {
  let d = v.d;
  while (d % 2n === 0n) d /= 2n;
  while (d % 5n === 0n) d /= 5n;
  return d === 1n;
}

/** modelingWithGeometricSeries models totals of amounts that grow or shrink by a fixed percentage. */
export const modelingWithGeometricSeries: TopicDef = {
  id: "modeling-with-geometric-series",
  title: t("Modeling With Geometric Series", "用等比级数建模"),
  summary: t(
    "Model totals of amounts that change by a constant factor, such as yearly salaries with raises and the bounces of a ball, with geometric series.",
    "用等比级数为按固定倍数变化的量的总和建模，例如逐年加薪的工资和小球的反弹。",
  ),
  prerequisites: [
    "solving-geometric-series-problems-using-exponential-equations-and-inequalities",
    "modeling-exponential-growth-with-functions",
  ],
  encompasses: [
    { topic: "solving-geometric-series-problems-using-exponential-equations-and-inequalities", weight: 0.4 },
    { topic: "modeling-exponential-growth-with-functions", weight: 0.3 },
    { topic: "the-sum-of-the-first-n-terms-of-a-geometric-series", weight: 0.5 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.SSE.B.4", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "growing-totals",
      title: t("Totals of growing amounts", "增长量的总和"),
      explanation: t(
        "An amount that grows by $p\\%$ each period is multiplied by $1 + \\frac{p}{100}$, so the amounts form a geometric sequence. A salary of $\\$40{,}000$ with a $3\\%$ raise each year pays $40000 \\cdot 1.03^{k-1}$ in year $k$, and over $10$ years\n\n$$S_{10} = \\frac{40000(1.03^{10} - 1)}{1.03 - 1} \\approx 458{,}555.17 \\text{ dollars}$$",
        "每期增长 $p\\%$ 的量每期乘以 $1 + \\frac{p}{100}$，所以这些量构成等比数列。年薪 $40{,}000$ 美元、每年加薪 $3\\%$，第 $k$ 年的工资是 $40000 \\cdot 1.03^{k-1}$，$10$ 年合计\n\n$$S_{10} = \\frac{40000(1.03^{10} - 1)}{1.03 - 1} \\approx 458{,}555.17 \\text{ 美元}$$",
      ),
      generate(rng) {
        for (;;) {
          const salary = rng.bool();
          const S = salary ? rng.int(30, 70) * 1000 : rng.int(2, 20) * 500;
          const R = rng.int(2, 8);
          const n = rng.int(5, 15);
          const g = Q.of(100 + R, 100);
          const exact = geometricSum(Q.of(S), g, n);
          if (nearHalf(exact, 0)) continue;
          const answer = roundQ(exact, 0);
          const gL = dec(g);
          const prompt = salary
            ? t(
                `A job pays $${grouped(S)}$ dollars in the first year, and the salary rises by $${R}\\%$ each year. Find the total pay over the first $${n}$ years, to the nearest dollar.`,
                `一份工作第一年的工资是 $${grouped(S)}$ 美元，之后工资每年增长 $${R}\\%$。求前 $${n}$ 年的工资总额（精确到美元）。`,
              )
            : t(
                `A factory makes $${grouped(S)}$ units in its first year, and its output grows by $${R}\\%$ each year. Find the total number of units made in the first $${n}$ years, to the nearest unit.`,
                `一家工厂第一年生产 $${grouped(S)}$ 件产品，之后产量每年增长 $${R}\\%$。求前 $${n}$ 年的总产量（精确到件）。`,
              );
          return numberProblem({
            prompt,
            answer,
            form: "integer",
            wrong: [
              Q.of(n * S),
              roundQ(Q.of(S).mul(g.pow(n - 1)), 0),
              roundQ(geometricSum(Q.of(S), g, n - 1), 0),
              roundQ(Q.of(n * S + (S * R * n * (n - 1)) / 200), 0),
            ],
            solution: both(
              `The yearly amounts form a geometric sequence with $a_1 = ${S}$ and $r = ${gL}$. Add $${n}$ terms:`,
              `每年的量构成等比数列，$a_1 = ${S}$，$r = ${gL}$。求 $${n}$ 项之和：`,
              `S_{${n}} = \\frac{${S}(${gL}^{${n}} - 1)}{${gL} - 1} \\approx ${grouped(answer)}`,
            ),
          });
        }
      },
    },
    {
      id: "bouncing-balls",
      title: t("Bouncing balls", "弹跳的小球"),
      explanation: t(
        "A ball dropped from height $h$ rebounds to a fraction $r$ of its previous height each time. Until it hits the ground for the $n$th time it falls $h$ once, and then rises and falls again for each of the $n - 1$ bounces:\n\n$$D = h + 2\\left(hr + hr^{2} + \\cdots + hr^{n-1}\\right)$$\n\nDropped from $16$ m with $r = \\frac{1}{2}$, by the $4$th hit it has traveled $16 + 2(8 + 4 + 2) = 44$ m.",
        "从高度 $h$ 落下的小球，每次反弹到前一次高度的 $r$ 倍。到第 $n$ 次落地为止，它先下落 $h$ 一次，之后 $n - 1$ 次反弹每次都上升再下落：\n\n$$D = h + 2\\left(hr + hr^{2} + \\cdots + hr^{n-1}\\right)$$\n\n从 $16$ 米高处落下、$r = \\frac{1}{2}$ 时，到第 $4$ 次落地共经过 $16 + 2(8 + 4 + 2) = 44$ 米。",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick([Q.of(1, 2), Q.of(3, 4), Q.of(2, 3), Q.of(3, 5), Q.of(4, 5), Q.of(1, 3)]);
          const n = rng.int(3, 7);
          const h = rng.int(1, 6) * Number(r.d) ** (n - 1);
          if (h > 500) continue;
          const H = Q.of(h);
          const up = geometricSum(H.mul(r), r, n - 1);
          const D = H.add(up.mul(Q.of(2)));
          const pct = r.toLatex();
          return numberProblem({
            prompt: t(
              `A ball is dropped from a height of $${h}$ m. Each time it hits the ground it bounces back up to $${pct}$ of the height it fell from. How far has it traveled, in meters, when it hits the ground for the $${n}$th time?`,
              `一个小球从 $${h}$ 米高处落下。每次落地后，它都反弹到下落高度的 $${pct}$。到第 $${n}$ 次落地时，它一共经过了多少米？`,
            ),
            answer: D,
            unit: "m",
            wrong: [
              H.add(up),
              up.mul(Q.of(2)).add(H.mul(Q.of(2))),
              H.add(geometricSum(H.mul(r), r, n).mul(Q.of(2))),
              geometricSum(H, r, n),
            ],
            solution: both(
              `The ball falls $${h}$ m once, then rises and falls the same distance on each of the $${n - 1}$ bounces:`,
              `小球先下落 $${h}$ 米一次，之后 $${n - 1}$ 次反弹每次都上升再下落相同的距离：`,
              `D = ${h} + 2\\left(${seriesL(geometric(H.mul(r), r, n - 1), 6)}\\right) = ${h} + 2 \\cdot ${up.toLatex()} = ${D.toLatex()}`,
            ),
          });
        }
      },
    },
    {
      id: "when-a-total-is-reached",
      title: t("When a total is reached", "总和何时达到目标"),
      explanation: t(
        "To find when a growing total first passes a target, solve the inequality $S_n > $ target with logarithms. A website has $500$ visitors on its first day and $20\\%$ more each day. When does the total first pass $20{,}000$?\n\n$$\\frac{500(1.2^{n} - 1)}{0.2} > 20000 \\implies 1.2^{n} > 9 \\implies n > \\frac{\\ln 9}{\\ln 1.2} \\approx 12.05$$\n\nso on day $13$.",
        "要求增长的总和何时首次超过目标，用对数解不等式 $S_n > $ 目标。一个网站第一天有 $500$ 位访客，之后每天比前一天多 $20\\%$。总访客数何时首次超过 $20{,}000$？\n\n$$\\frac{500(1.2^{n} - 1)}{0.2} > 20000 \\implies 1.2^{n} > 9 \\implies n > \\frac{\\ln 9}{\\ln 1.2} \\approx 12.05$$\n\n所以是第 $13$ 天。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.pick([100, 200, 250, 400, 500, 1000]);
          const R = rng.pick([5, 10, 15, 20, 25, 50]);
          const T = rng.pick([5000, 10000, 20000, 50000, 100000]) * rng.int(1, 3);
          const g = Q.of(100 + R, 100);
          const n = firstExceeding(Q.of(a), g, Q.of(T), 80);
          if (n === undefined || n < 4 || n > 40) continue;
          const rhs = Q.one.add(Q.of(T).mul(g.sub(Q.one)).div(Q.of(a)));
          const x = Math.log(rhs.toNumber()) / Math.log(g.toNumber());
          if (Math.abs(x - Math.round(x)) < 0.01) continue;
          const gL = dec(g);
          const daily = range(1, 200).find(
            (k) =>
              Q.of(a)
                .mul(g.pow(k - 1))
                .cmp(Q.of(T)) > 0,
          );
          const rhsL = terminates(rhs) ? dec(rhs) : rhs.toLatex();
          return numberProblem({
            prompt: t(
              `A website has $${a}$ visitors on its first day, and each day it has $${R}\\%$ more visitors than the day before. On which day does the total number of visitors first exceed $${grouped(T)}$?`,
              `一个网站第一天有 $${a}$ 位访客，之后每天的访客都比前一天多 $${R}\\%$。总访客数在第几天首次超过 $${grouped(T)}$？`,
            ),
            answer: n,
            wrong: [n - 1, n + 1, ...(daily === undefined ? [] : [daily])],
            solution: both(
              `The daily visitors form a geometric sequence with $a_1 = ${a}$ and $r = ${gL}$. Solve $S_n > ${T}$:`,
              `每天的访客数构成等比数列，$a_1 = ${a}$，$r = ${gL}$。解不等式 $S_n > ${T}$：`,
              `\\frac{${a}(${gL}^{n} - 1)}{${dec(g.sub(Q.one))}} > ${T} \\implies ${gL}^{n} > ${rhsL} \\implies n > \\frac{\\ln ${rhsL}}{\\ln ${gL}} \\approx ${x.toFixed(2)}`,
              `n = ${n}`,
            ),
          });
        }
      },
    },
  ],
};

/** modelingFinancialProblemsUsingGeometricSeries finds the value of regular deposits that earn compound interest. */
export const modelingFinancialProblemsUsingGeometricSeries: TopicDef = {
  id: "modeling-financial-problems-using-geometric-series",
  title: t("Modeling Financial Problems Using Geometric Series", "用等比级数为金融问题建模"),
  summary: t(
    "Add regular deposits that each earn compound interest with a geometric series, at the end or the start of each year, and find the deposit that reaches a goal.",
    "用等比级数把每笔都按复利计息的定期存款加起来（年末或年初存入），并求达到目标所需的每期存款。",
  ),
  prerequisites: ["modeling-with-geometric-series", "modeling-with-compound-interest"],
  encompasses: [
    { topic: "modeling-with-geometric-series", weight: 0.5 },
    { topic: "modeling-with-compound-interest", weight: 0.5 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.SSE.B.4"],
  knowledgePoints: [
    {
      id: "deposits-at-the-end-of-each-year",
      title: t("Deposits at the end of each year", "每年年末存款"),
      explanation: t(
        "Deposit $P$ at the end of each year into an account that pays $i$ interest a year, compounded annually. Right after the $n$th deposit, the last deposit has earned nothing, the one before it one year of interest, and the first $n - 1$ years:\n\n$$A = P + P(1 + i) + \\cdots + P(1 + i)^{n-1} = \\frac{P\\big((1 + i)^{n} - 1\\big)}{i}$$\n\nDepositing $\\$1000$ a year at $5\\%$ for $10$ years gives $\\frac{1000(1.05^{10} - 1)}{0.05} \\approx \\$12{,}577.89$.",
        "每年年末向年利率为 $i$、按年复利计息的账户存入 $P$。第 $n$ 次存款刚存入时，最后一笔还没有利息，倒数第二笔有一年的利息，第一笔有 $n - 1$ 年的利息：\n\n$$A = P + P(1 + i) + \\cdots + P(1 + i)^{n-1} = \\frac{P\\big((1 + i)^{n} - 1\\big)}{i}$$\n\n每年存 $1000$ 美元、年利率 $5\\%$、存 $10$ 年，得到 $\\frac{1000(1.05^{10} - 1)}{0.05} \\approx 12{,}577.89$ 美元。",
      ),
      generate(rng) {
        for (;;) {
          const P = rng.pick([500, 800, 1000, 1200, 1500, 2000, 2500, 3000, 5000]);
          const R = rng.int(2, 8);
          const n = rng.int(5, 20);
          const g = Q.of(100 + R, 100);
          const exact = geometricSum(Q.of(P), g, n);
          if (nearHalf(exact, 2)) continue;
          const answer = roundQ(exact, 2);
          const gL = dec(g);
          return numberProblem({
            prompt: t(
              `At the end of each year, $${grouped(P)}$ dollars is deposited into an account that pays $${R}\\%$ interest per year, compounded annually. Find the balance right after the $${n}$th deposit, in dollars, to the nearest cent.`,
              `每年年末向一个年利率为 $${R}\\%$、按年复利计息的账户存入 $${grouped(P)}$ 美元。求第 $${n}$ 次存款刚存入后的余额（单位：美元，精确到分）。`,
            ),
            answer,
            form: "decimal",
            wrong: [Q.of(n * P), roundQ(exact.mul(g), 2), roundQ(Q.of(n * P).mul(g.pow(n)), 2), roundQ(geometricSum(Q.of(P), g, n - 1), 2)],
            solution: both(
              `The deposits have grown for $0, 1, \\ldots, ${n - 1}$ years, so the balance is a geometric series with $a_1 = ${P}$, $r = ${gL}$ and $${n}$ terms:`,
              `各笔存款分别计息 $0, 1, \\ldots, ${n - 1}$ 年，所以余额是一个等比级数，$a_1 = ${P}$，$r = ${gL}$，共 $${n}$ 项：`,
              `A = \\frac{${P}(${gL}^{${n}} - 1)}{${dec(Q.of(R, 100))}} \\approx ${money(answer)}`,
            ),
          });
        }
      },
    },
    {
      id: "deposits-at-the-start-of-each-year",
      title: t("Deposits at the start of each year", "每年年初存款"),
      explanation: t(
        "When each deposit is made at the start of the year, every deposit earns one more year of interest by the end of year $n$, so the balance is multiplied by $1 + i$:\n\n$$A = P(1 + i) + P(1 + i)^{2} + \\cdots + P(1 + i)^{n} = \\frac{P(1 + i)\\big((1 + i)^{n} - 1\\big)}{i}$$\n\nDepositing $\\$1000$ at the start of each year at $5\\%$ gives $\\frac{1000 \\cdot 1.05(1.05^{10} - 1)}{0.05} \\approx \\$13{,}206.79$ at the end of $10$ years.",
        "如果每笔存款都在年初存入，到第 $n$ 年年末时每笔存款都多计一年利息，所以余额要乘以 $1 + i$：\n\n$$A = P(1 + i) + P(1 + i)^{2} + \\cdots + P(1 + i)^{n} = \\frac{P(1 + i)\\big((1 + i)^{n} - 1\\big)}{i}$$\n\n每年年初存 $1000$ 美元、年利率 $5\\%$，$10$ 年后年末的余额为 $\\frac{1000 \\cdot 1.05(1.05^{10} - 1)}{0.05} \\approx 13{,}206.79$ 美元。",
      ),
      generate(rng) {
        for (;;) {
          const P = rng.pick([500, 800, 1000, 1200, 1500, 2000, 2500, 3000, 5000]);
          const R = rng.int(2, 8);
          const n = rng.int(5, 20);
          const g = Q.of(100 + R, 100);
          const exact = geometricSum(Q.of(P).mul(g), g, n);
          if (nearHalf(exact, 2)) continue;
          const answer = roundQ(exact, 2);
          const gL = dec(g);
          return numberProblem({
            prompt: t(
              `At the start of each year, $${grouped(P)}$ dollars is deposited into an account that pays $${R}\\%$ interest per year, compounded annually. Find the balance at the end of the $${n}$th year, in dollars, to the nearest cent.`,
              `每年年初向一个年利率为 $${R}\\%$、按年复利计息的账户存入 $${grouped(P)}$ 美元。求第 $${n}$ 年年末的余额（单位：美元，精确到分）。`,
            ),
            answer,
            form: "decimal",
            wrong: [
              roundQ(geometricSum(Q.of(P), g, n), 2),
              Q.of(n * P),
              roundQ(Q.of(n * P).mul(g.pow(n)), 2),
              roundQ(geometricSum(Q.of(P).mul(g), g, n + 1), 2),
            ],
            solution: both(
              `The deposits have grown for $${n}, ${n - 1}, \\ldots, 1$ years, so the balance is a geometric series with $a_1 = ${P} \\cdot ${gL}$, $r = ${gL}$ and $${n}$ terms:`,
              `各笔存款分别计息 $${n}, ${n - 1}, \\ldots, 1$ 年，所以余额是一个等比级数，$a_1 = ${P} \\cdot ${gL}$，$r = ${gL}$，共 $${n}$ 项：`,
              `A = \\frac{${P} \\cdot ${gL}(${gL}^{${n}} - 1)}{${dec(Q.of(R, 100))}} \\approx ${money(answer)}`,
            ),
          });
        }
      },
    },
    {
      id: "the-deposit-needed",
      title: t("The deposit needed for a goal", "达到目标所需的存款"),
      explanation: t(
        "To reach a goal $A$ with equal deposits at the end of each year, solve the balance formula for $P$:\n\n$$P = \\frac{A \\cdot i}{(1 + i)^{n} - 1}$$\n\nTo have $\\$20{,}000$ after $10$ yearly deposits at $5\\%$, deposit $\\frac{20000 \\cdot 0.05}{1.05^{10} - 1} \\approx \\$1590.09$ a year. Round only at the end.",
        "要用每年年末等额存款达到目标 $A$，由余额公式解出 $P$：\n\n$$P = \\frac{A \\cdot i}{(1 + i)^{n} - 1}$$\n\n年利率 $5\\%$、存 $10$ 年后要有 $20{,}000$ 美元，每年应存 $\\frac{20000 \\cdot 0.05}{1.05^{10} - 1} \\approx 1590.09$ 美元。只在最后取近似值。",
      ),
      generate(rng) {
        for (;;) {
          const A = rng.pick([10000, 15000, 20000, 25000, 40000, 50000, 100000]);
          const R = rng.int(2, 8);
          const n = rng.int(5, 20);
          const g = Q.of(100 + R, 100);
          const exact = Q.of(A).div(geometricSum(Q.one, g, n));
          if (nearHalf(exact, 2)) continue;
          const answer = roundQ(exact, 2);
          const gL = dec(g);
          return numberProblem({
            prompt: t(
              `How much must be deposited at the end of each year into an account paying $${R}\\%$ interest per year, compounded annually, to have $${grouped(A)}$ dollars right after the $${n}$th deposit? Give the deposit in dollars, to the nearest cent.`,
              `年利率为 $${R}\\%$、按年复利计息，每年年末应存入多少钱，才能在第 $${n}$ 次存款刚存入后得到 $${grouped(A)}$ 美元？答案以美元为单位，精确到分。`,
            ),
            answer,
            form: "decimal",
            wrong: [
              roundQ(Q.of(A, n), 2),
              roundQ(Q.of(A).div(g.pow(n)), 2),
              roundQ(Q.of(A).div(geometricSum(g, g, n)), 2),
              roundQ(Q.of(A).div(geometricSum(Q.one, g, n + 1)), 2),
            ],
            solution: both(
              "Solve the balance formula for the deposit:",
              "由余额公式解出每期存款：",
              `${A} = \\frac{P(${gL}^{${n}} - 1)}{${dec(Q.of(R, 100))}} \\implies P = \\frac{${A} \\cdot ${dec(Q.of(R, 100))}}{${gL}^{${n}} - 1} \\approx ${money(answer)}`,
            ),
          });
        }
      },
    },
  ],
};

// The binomial theorem.

/** pascalsTriangleAndTheBinomialCoefficients connects the entries of Pascal's triangle to binomial coefficients. */
export const pascalsTriangleAndTheBinomialCoefficients: TopicDef = {
  id: "pascals-triangle-and-the-binomial-coefficients",
  title: t("Pascal's Triangle and the Binomial Coefficients", "杨辉三角与二项式系数"),
  summary: t(
    "Read the entries of Pascal's triangle as $\\binom{n}{k}$, and use Pascal's rule $\\binom{n}{k} + \\binom{n}{k+1} = \\binom{n+1}{k+1}$ and the symmetry $\\binom{n}{k} = \\binom{n}{n-k}$.",
    "把杨辉三角中的数读作 $\\binom{n}{k}$，并运用帕斯卡法则 $\\binom{n}{k} + \\binom{n}{k+1} = \\binom{n+1}{k+1}$ 和对称性 $\\binom{n}{k} = \\binom{n}{n-k}$。",
  ),
  prerequisites: ["combinations", "expanding-binomials-using-pascals-triangle"],
  encompasses: [
    { topic: "combinations", weight: 0.4 },
    { topic: "expanding-binomials-using-pascals-triangle", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.C.5"],
  knowledgePoints: [
    {
      id: "entries-as-binomial-coefficients",
      title: t("Entries as binomial coefficients", "杨辉三角中的数是二项式系数"),
      explanation: t(
        "Number the rows of Pascal's triangle from $0$, so that row $n$ starts $1, n$. The entries of row $n$ are the **binomial coefficients**\n\n$$\\binom{n}{0}, \\binom{n}{1}, \\binom{n}{2}, \\ldots, \\binom{n}{n}$$\n\nso the $j$th number in row $n$ is $\\binom{n}{j - 1}$. For example row $5$ is $1, 5, 10, 10, 5, 1$, and its $3$rd number is $\\binom{5}{2} = 10$. This lets you find any entry without writing the rows above it: the $4$th number in row $12$ is $\\binom{12}{3} = 220$.",
        "杨辉三角的行从 $0$ 开始编号，第 $n$ 行以 $1, n$ 开头。第 $n$ 行的数就是**二项式系数**\n\n$$\\binom{n}{0}, \\binom{n}{1}, \\binom{n}{2}, \\ldots, \\binom{n}{n}$$\n\n所以第 $n$ 行的第 $j$ 个数是 $\\binom{n}{j - 1}$。例如第 $5$ 行是 $1, 5, 10, 10, 5, 1$，其中第 $3$ 个数是 $\\binom{5}{2} = 10$。这样不必写出上面各行就能求出任意一个数：第 $12$ 行的第 $4$ 个数是 $\\binom{12}{3} = 220$。",
      ),
      generate(rng) {
        const n = rng.int(7, 16);
        const j = rng.int(3, Math.min(6, n - 1));
        const answer = choose(n, j - 1);
        return numberProblem({
          prompt: t(
            `The rows of Pascal's triangle are numbered from $0$, so that row $${n}$ starts $1, ${n}, \\ldots$. What is the ${ordinal(j)} number in row $${n}$?`,
            `杨辉三角的行从 $0$ 开始编号，第 $${n}$ 行以 $1, ${n}, \\ldots$ 开头。第 $${n}$ 行的第 $${j}$ 个数是多少？`,
          ),
          answer,
          wrong: [choose(n, j), choose(n - 1, j - 1), choose(n + 1, j - 1), choose(n, j - 2)],
          solution: both(
            `The ${ordinal(j)} number in row $${n}$ is $${binom(n, j - 1)}$:`,
            `第 $${n}$ 行的第 $${j}$ 个数是 $${binom(n, j - 1)}$：`,
            `${binom(n, j - 1)} = \\frac{${n}!}{${j - 1}!\\,${n - j + 1}!} = ${answer}`,
          ),
        });
      },
    },
    {
      id: "pascals-rule",
      title: t("Pascal's rule", "帕斯卡法则"),
      explanation: t(
        "Each entry of Pascal's triangle is the sum of the two entries above it. In binomial coefficients this is **Pascal's rule**:\n\n$$\\binom{n}{k} + \\binom{n}{k+1} = \\binom{n+1}{k+1}$$\n\nFor example $\\binom{9}{3} + \\binom{9}{4} = 84 + 126 = 210 = \\binom{10}{4}$. The rule also gives one of the two upper entries from the lower one: $\\binom{9}{4} = \\binom{10}{4} - \\binom{9}{3}$.",
        "杨辉三角中每个数都等于它上方两个数之和。用二项式系数表示，就是**帕斯卡法则**：\n\n$$\\binom{n}{k} + \\binom{n}{k+1} = \\binom{n+1}{k+1}$$\n\n例如 $\\binom{9}{3} + \\binom{9}{4} = 84 + 126 = 210 = \\binom{10}{4}$。这个法则也可以由下面的数求出上面两个数中的一个：$\\binom{9}{4} = \\binom{10}{4} - \\binom{9}{3}$。",
      ),
      generate(rng) {
        const n = rng.int(10, 20);
        const k = rng.int(2, 6);
        const A = choose(n, k);
        const B = choose(n, k + 1);
        const X = A + B;
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `Given that $${binom(n, k)} = ${grouped(A)}$ and $${binom(n, k + 1)} = ${grouped(B)}$, find $${binom(n + 1, k + 1)}$.`,
              `已知 $${binom(n, k)} = ${grouped(A)}$，$${binom(n, k + 1)} = ${grouped(B)}$，求 $${binom(n + 1, k + 1)}$。`,
            ),
            answer: X,
            wrong: [B - A, 2 * B, choose(n + 1, k), B],
            solution: both(
              "By Pascal's rule, the entry below two neighbors is their sum:",
              "由帕斯卡法则，两个相邻数下方的数等于它们的和：",
              `${binom(n + 1, k + 1)} = ${binom(n, k)} + ${binom(n, k + 1)} = ${A} + ${B} = ${X}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `Given that $${binom(n + 1, k + 1)} = ${grouped(X)}$ and $${binom(n, k)} = ${grouped(A)}$, find $${binom(n, k + 1)}$.`,
            `已知 $${binom(n + 1, k + 1)} = ${grouped(X)}$，$${binom(n, k)} = ${grouped(A)}$，求 $${binom(n, k + 1)}$。`,
          ),
          answer: B,
          wrong: [X + A, A, X - choose(n, k - 1), Q.of(X, 2)],
          solution: both(
            "By Pascal's rule, the lower entry is the sum of the two above it, so subtract:",
            "由帕斯卡法则，下面的数等于上方两数之和，所以相减：",
            `${binom(n, k + 1)} = ${binom(n + 1, k + 1)} - ${binom(n, k)} = ${X} - ${A} = ${B}`,
          ),
        });
      },
    },
    {
      id: "symmetry",
      title: t("Symmetry", "对称性"),
      explanation: t(
        "Each row of Pascal's triangle reads the same from both ends, because choosing $k$ objects from $n$ is the same as choosing the $n - k$ to leave out:\n\n$$\\binom{n}{k} = \\binom{n}{n - k}$$\n\nSo if $\\binom{n}{3} = \\binom{n}{8}$ with $3 \\ne 8$, the two lower numbers add to $n$: $n = 3 + 8 = 11$.",
        "杨辉三角的每一行从两端读起都一样，因为从 $n$ 个物体中选出 $k$ 个，等同于选出不要的 $n - k$ 个：\n\n$$\\binom{n}{k} = \\binom{n}{n - k}$$\n\n所以若 $\\binom{n}{3} = \\binom{n}{8}$ 且 $3 \\ne 8$，则下面的两个数之和是 $n$：$n = 3 + 8 = 11$。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = a + rng.int(1, 9);
        if (rng.bool()) {
          return numberProblem({
            prompt: t(`Find $n$ such that $${binom("n", a)} = ${binom("n", b)}$.`, `求 $n$，使 $${binom("n", a)} = ${binom("n", b)}$。`),
            answer: a + b,
            solveFor: "n",
            wrong: [b - a, a + b - 1, a + b + 1, a * b],
            solution: both(
              `Since $${a} \\ne ${b}$, the two coefficients are symmetric in row $n$, so $${a} = n - ${b}$:`,
              `因为 $${a} \\ne ${b}$，这两个系数在第 $n$ 行中对称，所以 $${a} = n - ${b}$：`,
              `n = ${a} + ${b} = ${a + b}`,
            ),
          });
        }
        const n = a + b;
        return numberProblem({
          prompt: t(
            `Find the value of $m$, other than $${a}$, for which $${binom(n, a)} = ${binom(n, "m")}$.`,
            `求 $m$ 的值（$m \\ne ${a}$），使 $${binom(n, a)} = ${binom(n, "m")}$。`,
          ),
          answer: b,
          solveFor: "m",
          wrong: [b - 1, b + 1, n],
          solution: both(
            "By symmetry, $\\binom{n}{k} = \\binom{n}{n - k}$:",
            "由对称性，$\\binom{n}{k} = \\binom{n}{n - k}$：",
            `m = ${n} - ${a} = ${b}`,
          ),
        });
      },
    },
  ],
};

/** monomial writes c times a power of a variable: "6x^{2}", "-x", "5". */
const monomial = (c: number, v: string, e: number) => poly([c, pw(v, e)]);

/** expansion writes (p v + q)^n expanded in decreasing powers of v, with coefficients from coef. */
function expansion(p: number, q: number, n: number, v: string, coef = (j: number) => choose(n, j) * p ** j * q ** (n - j)): string {
  return poly(...range(0, n).map((i) => [coef(n - i), pw(v, n - i)] as const));
}

/** binomialL writes the binomial p v + q, or q + p v. */
const binomialL = (p: number, q: number, v: string, constantFirst: boolean) => (constantFirst ? poly([q, ""], [p, v]) : linear(p, q, v));

/** expandingABinomialUsingBinomialCoefficients expands (a + b)^n with binomial coefficients and finds single terms. */
export const expandingABinomialUsingBinomialCoefficients: TopicDef = {
  id: "expanding-a-binomial-using-binomial-coefficients",
  title: t("Expanding a Binomial Using Binomial Coefficients", "用二项式系数展开二项式"),
  summary: t(
    "Expand $(a + b)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}a^{n-k}b^{k}$, and find one coefficient or the constant term without the full expansion.",
    "按 $(a + b)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}a^{n-k}b^{k}$ 展开，并在不完全展开的情况下求某一项的系数或常数项。",
  ),
  prerequisites: ["pascals-triangle-and-the-binomial-coefficients"],
  encompasses: [
    { topic: "pascals-triangle-and-the-binomial-coefficients", weight: 0.5 },
    { topic: "expanding-binomials-using-pascals-triangle", weight: 0.6 },
    { topic: "power-rules", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.APR.C.5"],
  knowledgePoints: [
    {
      id: "the-binomial-theorem",
      title: t("The binomial theorem", "二项式定理"),
      explanation: t(
        "The **binomial theorem** gives the expansion of any power of a binomial:\n\n$$(a + b)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}a^{n-k}b^{k} = a^{n} + \\binom{n}{1}a^{n-1}b + \\binom{n}{2}a^{n-2}b^{2} + \\cdots + b^{n}$$\n\nSubstitute the two terms of the binomial, with their coefficients and signs, in parentheses:\n\n$$(2x - 3)^{4} = (2x)^{4} + 4(2x)^{3}(-3) + 6(2x)^{2}(-3)^{2} + 4(2x)(-3)^{3} + (-3)^{4}$$\n\n$$= 16x^{4} - 96x^{3} + 216x^{2} - 216x + 81$$",
        "**二项式定理**给出二项式任意次幂的展开式：\n\n$$(a + b)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}a^{n-k}b^{k} = a^{n} + \\binom{n}{1}a^{n-1}b + \\binom{n}{2}a^{n-2}b^{2} + \\cdots + b^{n}$$\n\n把二项式的两项连同系数和符号加上括号代入：\n\n$$(2x - 3)^{4} = (2x)^{4} + 4(2x)^{3}(-3) + 6(2x)^{2}(-3)^{2} + 4(2x)(-3)^{3} + (-3)^{4}$$\n\n$$= 16x^{4} - 96x^{3} + 216x^{2} - 216x + 81$$",
      ),
      generate(rng) {
        const n = rng.pick([3, 4, 4, 5, 5]);
        const p = n === 5 ? rng.pick([1, 1, 2]) : rng.pick([1, 2, 3]);
        const q = p === 1 ? rng.nonZero(-4, 4) : rng.pick([1, -1, 2, -2]);
        const v = rng.pick(["x", "x", "y", "a"]);
        const shown = binomialL(p, q, v, q > 0 && rng.bool(0.3));
        const expr = `(${shown})^{${n}}`;
        const answer = expansion(p, q, n, v);
        const pv = p === 1 ? v : `(${p}${v})`;
        const termsL = range(0, n)
          .map(
            (k) =>
              `${k === 0 || k === n ? "" : choose(n, k)}${n - k === 0 ? "" : `${pv}${n - k === 1 ? "" : `^{${n - k}}`}`}${k === 0 ? "" : `(${q})${k === 1 ? "" : `^{${k}}`}`}`,
          )
          .join(" + ");
        return expressionProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [
            expansion(p, q, n, v, (j) => choose(n, j) * p ** j * q),
            expansion(p, q, n, v, (j) => choose(n, j) * Math.sign(q) ** (n - j)),
            poly([p ** n, pw(v, n)], [q ** n, ""]),
          ],
          solution: both(
            `Use the binomial theorem with row $${range(0, n)
              .map((k) => choose(n, k))
              .join(", ")}$ of coefficients:`,
            `用二项式定理，系数是 $${range(0, n)
              .map((k) => choose(n, k))
              .join(", ")}$ 这一行：`,
            `${expr} = ${termsL}`,
            `= ${answer}`,
          ),
        });
      },
    },
    {
      id: "a-single-coefficient",
      title: t("A single coefficient", "某一项的系数"),
      explanation: t(
        "To find one term without the whole expansion, use the general term $\\binom{n}{k}a^{n-k}b^{k}$. For the coefficient of $x^{5}$ in $(2x - 1)^{8}$, the power of $2x$ must be $5$, so $k = 3$:\n\n$$\\binom{8}{3}(2x)^{5}(-1)^{3} = 56 \\cdot 32x^{5} \\cdot (-1) = -1792x^{5}$$\n\nThe coefficient is $-1792$.",
        "不完全展开而求某一项时，用通项 $\\binom{n}{k}a^{n-k}b^{k}$。求 $(2x - 1)^{8}$ 中 $x^{5}$ 的系数：$2x$ 的指数必须是 $5$，所以 $k = 3$：\n\n$$\\binom{8}{3}(2x)^{5}(-1)^{3} = 56 \\cdot 32x^{5} \\cdot (-1) = -1792x^{5}$$\n\n系数是 $-1792$。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(6, 10);
          const p = rng.pick([1, 2, 3, -1, -2]);
          const q = rng.nonZero(-3, 3);
          const j = rng.int(2, n - 2);
          const k = n - j;
          const answer = choose(n, k) * p ** j * q ** k;
          if (Math.abs(answer) > 2_000_000) continue;
          const expr = `(${linear(p, q)})^{${n}}`;
          const target = pw("x", j);
          return numberProblem({
            prompt: t(
              `What is the coefficient of $${target}$ in the expansion of $${expr}$?`,
              `$${expr}$ 的展开式中，$${target}$ 的系数是多少？`,
            ),
            answer,
            wrong: [
              choose(n, k),
              choose(n, k) * p ** j,
              Math.abs(answer),
              choose(n, k - 1) * p ** j * q ** k,
              choose(n, k) * p ** k * q ** j,
            ],
            solution: both(
              `In the general term $${binom(n, "k")}(${p === 1 ? "x" : `${p}x`})^{${n}-k}(${q})^{k}$ the power of $x$ is $${j}$ when $k = ${k}$:`,
              `通项 $${binom(n, "k")}(${p === 1 ? "x" : `${p}x`})^{${n}-k}(${q})^{k}$ 中，$k = ${k}$ 时 $x$ 的指数是 $${j}$：`,
              `${binom(n, k)}(${p === 1 ? "x" : `${p}x`})^{${j}}(${q})^{${k}} = ${choose(n, k)} \\cdot ${p ** j < 0 ? `(${p ** j})` : p ** j} \\cdot ${q ** k < 0 ? `(${q ** k})` : q ** k} \\cdot ${target} = ${monomial(answer, "x", j)}`,
            ),
          });
        }
      },
    },
    {
      id: "the-constant-term",
      title: t("The constant term", "常数项"),
      explanation: t(
        "When the binomial has a negative power of $x$, some term may not contain $x$ at all. Find the $k$ that makes the power of $x$ in the general term zero. In $\\left(x^{2} + \\frac{2}{x}\\right)^{6}$ the general term is\n\n$$\\binom{6}{k}(x^{2})^{6-k}\\left(\\frac{2}{x}\\right)^{k} = \\binom{6}{k}2^{k}x^{12 - 3k}$$\n\n$12 - 3k = 0$ gives $k = 4$, so the constant term is $\\binom{6}{4}2^{4} = 15 \\cdot 16 = 240$.",
        "当二项式中含有 $x$ 的负次幂时，可能有一项完全不含 $x$。求出使通项中 $x$ 的指数为零的 $k$。在 $\\left(x^{2} + \\frac{2}{x}\\right)^{6}$ 中，通项是\n\n$$\\binom{6}{k}(x^{2})^{6-k}\\left(\\frac{2}{x}\\right)^{k} = \\binom{6}{k}2^{k}x^{12 - 3k}$$\n\n由 $12 - 3k = 0$ 得 $k = 4$，所以常数项是 $\\binom{6}{4}2^{4} = 15 \\cdot 16 = 240$。",
      ),
      generate(rng) {
        for (;;) {
          const [p, q] = rng.pick([
            [1, 1],
            [2, 1],
            [1, 2],
          ] as const);
          const n = p === q ? rng.pick([4, 6, 8, 10]) : rng.pick([3, 6, 9]);
          const k = (p * n) / (p + q);
          const a = rng.pick([1, 1, 2, 3]);
          const b = rng.pick([1, -1, 2, -2, 3, -3]);
          const answer = choose(n, k) * a ** (n - k) * b ** k;
          if (Math.abs(answer) > 2_000_000) continue;
          const first = `${a === 1 ? "" : a}${pw("x", p)}`;
          const second = `\\frac{${Math.abs(b)}}{${pw("x", q)}}`;
          const expr = `\\left(${first} ${b < 0 ? "-" : "+"} ${second}\\right)^{${n}}`;
          const sec = `\\frac{${b}}{${pw("x", q)}}`;
          return numberProblem({
            prompt: t(`Find the constant term in the expansion of $${expr}$.`, `求 $${expr}$ 展开式中的常数项。`),
            answer,
            wrong: [
              choose(n, k),
              Math.abs(answer),
              choose(n, k + 1) * a ** (n - k - 1) * b ** (k + 1),
              choose(n, k) * a ** k * b ** (n - k),
            ],
            solution: both(
              `In the general term the power of $x$ is $${p}(${n} - k) - ${q}k$, which is zero when $k = ${k}$:`,
              `通项中 $x$ 的指数是 $${p}(${n} - k) - ${q}k$，当 $k = ${k}$ 时为零：`,
              `${binom(n, "k")}\\left(${first}\\right)^{${n}-k}\\left(${sec}\\right)^{k}, \\qquad ${p * n} - ${p + q}k = 0 \\implies k = ${k}`,
              `${binom(n, k)} \\cdot ${a}^{${n - k}} \\cdot ${b < 0 ? `(${b})` : b}^{${k}} = ${choose(n, k)} \\cdot ${a ** (n - k)} \\cdot ${b ** k < 0 ? `(${b ** k})` : b ** k} = ${answer}`,
            ),
          });
        }
      },
    },
  ],
};

/** theSpecialCaseOfTheBinomialTheorem expands (1 + x)^n and sums binomial coefficients. */
export const theSpecialCaseOfTheBinomialTheorem: TopicDef = {
  id: "the-special-case-of-the-binomial-theorem",
  title: t("The Special Case of the Binomial Theorem", "二项式定理的特殊情形"),
  summary: t(
    "Use $(1 + x)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}x^{k}$ to write the first terms of an expansion, add binomial coefficients and find $n$ from a coefficient.",
    "用 $(1 + x)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}x^{k}$ 写出展开式的前几项，求二项式系数之和，并由某项的系数求 $n$。",
  ),
  prerequisites: ["expanding-a-binomial-using-binomial-coefficients", "sigma-notation"],
  encompasses: [
    { topic: "expanding-a-binomial-using-binomial-coefficients", weight: 0.5 },
    { topic: "sigma-notation", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.C.5"],
  knowledgePoints: [
    {
      id: "expanding-one-plus-x",
      title: t("Expanding $(1 + x)^{n}$", "展开 $(1 + x)^{n}$"),
      explanation: t(
        "With $a = 1$, every power of $a$ is $1$, and the binomial theorem becomes\n\n$$(1 + x)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}x^{k} = 1 + nx + \\frac{n(n - 1)}{2}x^{2} + \\cdots + x^{n}$$\n\nwritten in **ascending** powers of $x$. Replacing $x$ by $cx$ multiplies the $x^{k}$ term by $c^{k}$:\n\n$$(1 - 2x)^{9} = 1 + 9(-2x) + 36(-2x)^{2} + \\cdots = 1 - 18x + 144x^{2} + \\cdots$$",
        "当 $a = 1$ 时，$a$ 的各次幂都是 $1$，二项式定理变为\n\n$$(1 + x)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}x^{k} = 1 + nx + \\frac{n(n - 1)}{2}x^{2} + \\cdots + x^{n}$$\n\n按 $x$ 的**升幂**排列。把 $x$ 换成 $cx$，$x^{k}$ 项就乘以 $c^{k}$：\n\n$$(1 - 2x)^{9} = 1 + 9(-2x) + 36(-2x)^{2} + \\cdots = 1 - 18x + 144x^{2} + \\cdots$$",
      ),
      generate(rng) {
        const n = rng.int(5, 15);
        const c = rng.pick([1, -1, 2, -2, 3, -3]);
        const two = choose(n, 2);
        const answer = poly([1, ""], [n * c, "x"], [two * c * c, "x^{2}"]);
        const inner = poly([1, ""], [c, "x"]);
        const cx = c === 1 ? "x" : `${c}x`;
        return expressionProblem({
          prompt: t(
            `Find the first three terms of the expansion of $(${inner})^{${n}}$ in ascending powers of $x$.`,
            `求 $(${inner})^{${n}}$ 的展开式按 $x$ 的升幂排列的前三项。`,
          ),
          answer,
          simplified: true,
          wrong: [
            poly([1, ""], [n * c, "x"], [two * c, "x^{2}"]),
            poly([1, ""], [n, "x"], [two, "x^{2}"]),
            poly([1, ""], [n * c, "x"], [n * (n - 1) * c * c, "x^{2}"]),
            poly([1, ""], [n * c, "x"], [n * c * c, "x^{2}"]),
          ],
          solution: both(
            `Use $(1 + y)^{${n}} = 1 + ${n}y + ${binom(n, 2)}y^{2} + \\cdots$ with $y = ${cx}$:`,
            `在 $(1 + y)^{${n}} = 1 + ${n}y + ${binom(n, 2)}y^{2} + \\cdots$ 中令 $y = ${cx}$：`,
            `1 + ${n}(${cx}) + ${two}(${cx})^{2} + \\cdots = ${answer} + \\cdots`,
          ),
        });
      },
    },
    {
      id: "sums-of-binomial-coefficients",
      title: t("Sums of binomial coefficients", "二项式系数之和"),
      explanation: t(
        "Substituting a number for $x$ in $(1 + x)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}x^{k}$ adds up binomial coefficients. With $x = 1$, each row of Pascal's triangle adds to a power of $2$:\n\n$$\\sum_{k=0}^{n} \\binom{n}{k} = (1 + 1)^{n} = 2^{n}$$\n\nWith $x = 2$, $\\sum_{k=0}^{n} \\binom{n}{k}2^{k} = 3^{n}$, and with $x = -1$ the alternating sum is $(1 - 1)^{n} = 0$.",
        "在 $(1 + x)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}x^{k}$ 中给 $x$ 代入一个数，就得到二项式系数的和。令 $x = 1$，杨辉三角每一行的和都是 $2$ 的幂：\n\n$$\\sum_{k=0}^{n} \\binom{n}{k} = (1 + 1)^{n} = 2^{n}$$\n\n令 $x = 2$，$\\sum_{k=0}^{n} \\binom{n}{k}2^{k} = 3^{n}$；令 $x = -1$，正负交替的和为 $(1 - 1)^{n} = 0$。",
      ),
      generate(rng) {
        const n = rng.int(4, 12);
        const c = rng.pick([1, 1, 2, 3, -1, -2, 4]);
        const answer = (1 + c) ** n;
        const term = c === 1 ? binom(n, "k") : `${binom(n, "k")}${c < 0 ? `(${c})` : c}^{k}`;
        const expr = `\\sum_{k=0}^{${n}} ${term}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer,
          wrong: [2 ** n, c ** n, (1 + c) ** n - 1, n * (1 + c), 2 ** n * c],
          solution: both(
            `This is the expansion of $(1 + x)^{${n}}$ with $x = ${c}$:`,
            `这是 $(1 + x)^{${n}}$ 在 $x = ${c}$ 时的展开式：`,
            `${expr} = (1 ${c < 0 ? "-" : "+"} ${Math.abs(c)})^{${n}} = ${answer}`,
          ),
        });
      },
    },
    {
      id: "finding-n-from-a-coefficient",
      title: t("Finding $n$ from a coefficient", "由系数求 $n$"),
      explanation: t(
        "A known coefficient gives an equation for $n$. If the coefficient of $x^{2}$ in $(1 + 3x)^{n}$ is $324$, then\n\n$$\\binom{n}{2}3^{2} = 324 \\implies \\frac{n(n - 1)}{2} = 36 \\implies n^{2} - n - 72 = 0 \\implies (n - 9)(n + 8) = 0$$\n\nso $n = 9$, the positive solution.",
        "已知某项的系数，就得到关于 $n$ 的方程。若 $(1 + 3x)^{n}$ 中 $x^{2}$ 的系数是 $324$，则\n\n$$\\binom{n}{2}3^{2} = 324 \\implies \\frac{n(n - 1)}{2} = 36 \\implies n^{2} - n - 72 = 0 \\implies (n - 9)(n + 8) = 0$$\n\n所以 $n = 9$（取正解）。",
      ),
      generate(rng) {
        const n = rng.int(4, 16);
        const c = rng.pick([1, 2, 3, -2, -3, 4]);
        const V = choose(n, 2) * c * c;
        const inner = poly([1, ""], [c, "x"]);
        const half = choose(n, 2);
        return numberProblem({
          prompt: t(
            `The coefficient of $x^{2}$ in the expansion of $(${inner})^{n}$ is $${V}$. Find $n$.`,
            `$(${inner})^{n}$ 的展开式中 $x^{2}$ 的系数是 $${V}$。求 $n$。`,
          ),
          answer: n,
          solveFor: "n",
          wrong: [n - 1, n + 1, Q.of(V, c * c), Q.of(V, Math.abs(c))],
          solution: both(
            `The $x^{2}$ term is $${binom("n", 2)}(${c === 1 ? "x" : `${c}x`})^{2}$, so`,
            `$x^{2}$ 项是 $${binom("n", 2)}(${c === 1 ? "x" : `${c}x`})^{2}$，所以`,
            `${binom("n", 2)} \\cdot ${c * c} = ${V} \\implies \\frac{n(n - 1)}{2} = ${half} \\implies n^{2} - n - ${2 * half} = 0`,
            `(n - ${n})(n + ${n - 1}) = 0 \\implies n = ${n}`,
          ),
        });
      },
    },
  ],
};

/** addDec writes a signed decimal term after another: "+ 0.16", "- 1.6". */
const addDec = (v: Q) => (v.sign() < 0 ? `- ${dec(v.neg())}` : `+ ${dec(v)}`);

/** approximatingValuesUsingTheBinomialTheorem estimates powers of numbers close to an integer with the first terms of an expansion. */
export const approximatingValuesUsingTheBinomialTheorem: TopicDef = {
  id: "approximating-values-using-the-binomial-theorem",
  title: t("Approximating Values Using the Binomial Theorem", "用二项式定理求近似值"),
  summary: t(
    "Approximate powers such as $1.02^{8}$ or $1.98^{5}$ with the first three terms of a binomial expansion.",
    "用二项式展开式的前三项求 $1.02^{8}$、$1.98^{5}$ 等乘方的近似值。",
  ),
  prerequisites: ["the-special-case-of-the-binomial-theorem"],
  encompasses: [
    { topic: "the-special-case-of-the-binomial-theorem", weight: 0.5 },
    { topic: "decimal-arithmetic", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.APR.C.5"],
  knowledgePoints: [
    {
      id: "powers-near-one",
      title: t("Powers of numbers near $1$", "接近 $1$ 的数的乘方"),
      explanation: t(
        "Write a number close to $1$ as $1 + h$ with $h$ small. The powers $h^{2}, h^{3}, \\ldots$ shrink quickly, so the first few terms of\n\n$$(1 + h)^{n} = 1 + nh + \\binom{n}{2}h^{2} + \\binom{n}{3}h^{3} + \\cdots$$\n\ngive a good approximation. With three terms:\n\n$$1.02^{8} = (1 + 0.02)^{8} \\approx 1 + 8(0.02) + 28(0.02)^{2} = 1 + 0.16 + 0.0112 = 1.1712$$\n\n(The true value is $1.17166\\ldots$.)",
        "把接近 $1$ 的数写成 $1 + h$，其中 $h$ 很小。$h^{2}, h^{3}, \\ldots$ 迅速变小，所以\n\n$$(1 + h)^{n} = 1 + nh + \\binom{n}{2}h^{2} + \\binom{n}{3}h^{3} + \\cdots$$\n\n的前几项就是很好的近似值。取前三项：\n\n$$1.02^{8} = (1 + 0.02)^{8} \\approx 1 + 8(0.02) + 28(0.02)^{2} = 1 + 0.16 + 0.0112 = 1.1712$$\n\n（真实值是 $1.17166\\ldots$。）",
      ),
      generate(rng) {
        const n = rng.int(4, 12);
        const h = Q.of(rng.nonZero(-5, 5), 100);
        const two = choose(n, 2);
        const answer = Q.one.add(Q.of(n).mul(h)).add(Q.of(two).mul(h.pow(2)));
        const x = dec(Q.one.add(h));
        const hL = `(${dec(h)})`;
        return numberProblem({
          prompt: t(
            `Use the first three terms of a binomial expansion to approximate $${x}^{${n}}$.`,
            `用二项式展开式的前三项求 $${x}^{${n}}$ 的近似值。`,
          ),
          answer,
          form: "decimal",
          wrong: [
            Q.one.add(Q.of(n).mul(h)),
            Q.one.add(Q.of(n).mul(h)).add(Q.of(n * (n - 1)).mul(h.pow(2))),
            Q.one.add(Q.of(n).mul(h)).add(Q.of(two).mul(h)),
            Q.one.add(Q.of(n).mul(h)).add(Q.of(n).mul(h.pow(2))),
          ],
          solution: both(
            `Write $${x} = 1 ${h.sign() < 0 ? "-" : "+"} ${dec(h.abs())}$ and keep the terms up to $h^{2}$:`,
            `把 $${x}$ 写成 $1 ${h.sign() < 0 ? "-" : "+"} ${dec(h.abs())}$，保留到 $h^{2}$ 项：`,
            `${x}^{${n}} \\approx 1 + ${n}${hL} + ${two}${hL}^{2} = 1 ${addDec(Q.of(n).mul(h))} ${addDec(Q.of(two).mul(h.pow(2)))} = ${dec(answer)}`,
          ),
        });
      },
    },
    {
      id: "powers-near-other-integers",
      title: t("Powers of numbers near other integers", "接近其他整数的数的乘方"),
      explanation: t(
        "For a number close to an integer $a$, write it as $a + h$ and use the first terms of $(a + h)^{n} = a^{n} + na^{n-1}h + \\binom{n}{2}a^{n-2}h^{2} + \\cdots$:\n\n$$1.98^{5} = (2 - 0.02)^{5} \\approx 2^{5} + 5 \\cdot 2^{4}(-0.02) + 10 \\cdot 2^{3}(-0.02)^{2}$$\n\n$$= 32 - 1.6 + 0.032 = 30.432$$\n\n(The true value is $30.4316\\ldots$.)",
        "对于接近整数 $a$ 的数，把它写成 $a + h$，用 $(a + h)^{n} = a^{n} + na^{n-1}h + \\binom{n}{2}a^{n-2}h^{2} + \\cdots$ 的前几项：\n\n$$1.98^{5} = (2 - 0.02)^{5} \\approx 2^{5} + 5 \\cdot 2^{4}(-0.02) + 10 \\cdot 2^{3}(-0.02)^{2}$$\n\n$$= 32 - 1.6 + 0.032 = 30.432$$\n\n（真实值是 $30.4316\\ldots$。）",
      ),
      generate(rng) {
        const a = rng.pick([2, 2, 3, 10]);
        const n = a === 10 ? rng.int(3, 4) : rng.int(3, 6);
        const h = Q.of(rng.nonZero(-3, 3), 100);
        const two = choose(n, 2);
        const t0 = Q.of(a ** n);
        const t1 = Q.of(n * a ** (n - 1)).mul(h);
        const t2 = Q.of(two * a ** (n - 2)).mul(h.pow(2));
        const answer = t0.add(t1).add(t2);
        const x = dec(Q.of(a).add(h));
        const hL = `(${dec(h)})`;
        return numberProblem({
          prompt: t(
            `Use the first three terms of a binomial expansion to approximate $${x}^{${n}}$.`,
            `用二项式展开式的前三项求 $${x}^{${n}}$ 的近似值。`,
          ),
          answer,
          form: "decimal",
          wrong: [
            t0.add(t1),
            t0.add(Q.of(n).mul(h)).add(Q.of(two).mul(h.pow(2))),
            t0.add(t1).add(Q.of(two).mul(h.pow(2))),
            t0.add(t1).add(t2.mul(Q.of(2))),
          ],
          solution: both(
            `Write $${x} = ${a} ${h.sign() < 0 ? "-" : "+"} ${dec(h.abs())}$ and keep the first three terms:`,
            `把 $${x}$ 写成 $${a} ${h.sign() < 0 ? "-" : "+"} ${dec(h.abs())}$，保留前三项：`,
            `${x}^{${n}} \\approx ${a}^{${n}} + ${n} \\cdot ${a}^{${n - 1}}${hL} + ${two} \\cdot ${a}^{${n - 2}}${hL}^{2}`,
            `= ${dec(t0)} ${addDec(t1)} ${addDec(t2)} = ${dec(answer)}`,
          ),
        });
      },
    },
  ],
};

/** precalculusSeriesTopics are the topics of Precalculus unit 1, Sequences and Series, in outline order. */
export const precalculusSeriesTopics: readonly TopicDef[] = [
  sigmaNotation,
  propertiesOfFiniteSeries,
  expressingAnArithmeticSeriesInSigmaNotation,
  findingTheSumOfAnArithmeticSeries,
  findingTheFirstTermOfAnArithmeticSeries,
  calculatingTheNumberOfTermsInAnArithmeticSeries,
  modelingWithArithmeticSeries,
  theSumOfAFiniteGeometricSeries,
  theSumOfTheFirstNTermsOfAGeometricSeries,
  writingGeometricSeriesInSigmaNotation,
  sumsOfFiniteGeometricSeriesGivenInSigmaNotation,
  solvingGeometricSeriesProblemsUsingExponentialEquationsAndInequalities,
  modelingWithGeometricSeries,
  modelingFinancialProblemsUsingGeometricSeries,
  pascalsTriangleAndTheBinomialCoefficients,
  expandingABinomialUsingBinomialCoefficients,
  theSpecialCaseOfTheBinomialTheorem,
  approximatingValuesUsingTheBinomialTheorem,
];
