import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { dec, linear, num, poly, Q, svgDocument } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, steps } from "../problems.ts";
import { listed, stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";

/** m writes LaTeX as a text that is the same in every locale. */
const m = (latex: string) => same(`$${latex}$`);

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

/**
 * thousands separates the thousands of a whole number of five or more digits, "12{,}345", and leaves a four-digit number
 * as it is, "3000", as the polish step does.
 */
const thousands = (digits: string) => (digits.replace("-", "").length > 4 ? digits.replace(/\B(?=(\d{3})+$)/g, "{,}") : digits);

/** money writes an amount of money with two decimal places and thousands separators from five digits on: "12{,}345.60". */
function money(v: Q): string {
  const [whole = "", frac] = dec(v).split(".");
  const g = thousands(whole);
  return frac ? `${g}.${frac.padEnd(2, "0")}` : g;
}

/** grouped writes an integer with thousands separators from five digits on: "12{,}345", but "3000". */
const grouped = (v: number | Q) => thousands(num(v));

/** mathSpans matches a span of display or inline math, skipping an escaped dollar sign. */
const mathSpans = /\\\$|\$\$[\s\S]*?\$\$|\$(?:\\.|[^$\\])*\$/g;

/** keptTex matches TeX whose digits are names, not quantities: "\text{...}" or a subscript "_{...}". */
const keptTex = /(\\(?:text|mathrm|operatorname)\{[^{}]*\}|_\{[^{}]*\})/;

/** longWhole matches a whole number of five or more digits that does not start with 0, outside a decimal part and a subscript base. */
const longWhole = /(?<![\d.])[1-9]\d{4,}(?![\d_])/g;

/**
 * separateLong separates the thousands of every whole number of five or more digits in the math of a text, so that the
 * polish step finds no long number to group and leaves the four-digit numbers beside it as they are: "3000" and
 * "16{,}576" in one span, never "3{,}000".
 */
function separateLong(text: Text): Text {
  const fix = (s: string) =>
    s.replace(mathSpans, (span) =>
      span
        .split(keptTex)
        .map((part, i) => (i % 2 ? part : part.replace(longWhole, (digits) => thousands(digits))))
        .join(""),
    );
  return { ...text, en: fix(text.en), "zh-CN": fix(text["zh-CN"]) };
}

/** withFourDigits makes the generators of a topic write four-digit numbers without a separator, through separateLong. */
function withFourDigits(topic: TopicDef): TopicDef {
  return {
    ...topic,
    knowledgePoints: topic.knowledgePoints.map((kp) => ({
      ...kp,
      generate: (rng, difficulty) => {
        const problem = kp.generate(rng, difficulty);
        const { input } = problem.answer;
        return {
          ...problem,
          prompt: separateLong(problem.prompt),
          solution: separateLong(problem.solution),
          answer:
            input.kind === "choice" ? { ...problem.answer, input: { ...input, options: input.options.map(separateLong) } } : problem.answer,
        };
      },
    })),
  };
}

/** SigmaOption is a way of writing a series in sigma notation, with the kth term as a function. */
interface SigmaOption {
  readonly lo: number;
  readonly hi: number;
  readonly body: string;
  readonly f: (k: number) => Q;
  /** why says what is wrong with this way of writing the series when it is offered as a wrong option. */
  readonly why?: Text;
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
  const problem = choiceProblem({ prompt, options: options.map((o) => m(latex(o))), correct: options.indexOf(correct), solution });
  const whys = kept.flatMap((o) => (o !== correct && o.why ? [[`$${latex(o)}$`, o.why.en, o.why["zh-CN"]] as const] : []));
  return whys.length > 0 ? reasoned(problem, whys) : problem;
}

/** Step is one labelled step of a worked solution: its title and its text in each locale, then the math it displays. */
type Step = readonly [titleEn: string, titleZh: string, en: string, zh: string, ...math: string[]];

/** worked writes a solution as labelled steps, each closed by the math it displays, and ends it with a check by another route. */
function worked(parts: readonly Step[], checkEn: string, checkZh: string): Text {
  const write = (zh: boolean) => {
    const body = parts.map(([titleEn, titleZh, en, z, ...math], i) => {
      const label = stepLabel(i + 1, titleEn, titleZh);
      const head = zh ? `${label["zh-CN"]}${z}` : `${label.en} ${en}`;
      return math.length > 0 ? `${head}${steps(...math).trimEnd()}` : head;
    });
    return `${body.join("\n\n")}\n\n${zh ? `**检验。**${checkZh}` : `**Check.** ${checkEn}`}`;
  };
  return t(write(false), write(true));
}

/** pr writes a number in parentheses when it is negative, for use inside a sum or a product. */
const pr = (x: number | Q) => {
  const v = x instanceof Q ? x : Q.of(x);
  return v.sign() < 0 ? `(${v.toLatex()})` : v.toLatex();
};

/** inlines writes numbers as inline math joined as a list in each locale: "$2$, $5$ and $8$". */
const inlines = (vs: readonly Q[]) => listed(vs.map((v) => `$${v.toLatex()}$`));

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
  intro: t(
    "You know that a sequence is a list of terms $a_1, a_2, a_3, \\ldots$ given by a rule. Often you need the total of many terms, and writing them all out is slow. Sigma notation names the rule and the first and last values of the index, and stands for the sum of all those terms.\n\nTake $a_k = 2k + 1$. Its first five terms are $3$, $5$, $7$, $9$ and $11$, and their sum is\n\n$$\\sum_{k=1}^{5} (2k + 1) = 3 + 5 + 7 + 9 + 11 = 35$$\n\nThe symbol $\\Sigma$ is the capital Greek letter sigma, for sum.",
    "你知道数列是按规则给出的一列项 $a_1, a_2, a_3, \\ldots$。常常要求很多项的总和，而逐项写出很慢。求和符号写出规则以及下标的第一个值和最后一个值，表示所有这些项之和。\n\n取 $a_k = 2k + 1$。它的前五项是 $3$、$5$、$7$、$9$、$11$，它们的和是\n\n$$\\sum_{k=1}^{5} (2k + 1) = 3 + 5 + 7 + 9 + 11 = 35$$\n\n符号 $\\Sigma$ 是希腊大写字母西格马，表示求和。",
  ),
  knowledgePoints: [
    {
      id: "evaluating-a-sum",
      title: t("Evaluating a sum", "求和式的值"),
      explanation: t(
        "A **series** is the sum of the terms of a sequence. **Sigma notation** writes it compactly with the Greek letter $\\Sigma$:\n\n$$\\sum_{k=1}^{n} a_k = a_1 + a_2 + \\cdots + a_n$$\n\nThe **index** $k$ starts at the lower limit below $\\Sigma$ and goes up by $1$ to the upper limit above it. To evaluate the sum, substitute each value of $k$ into the expression and add:\n\n$$\\sum_{k=1}^{4} (3k - 1) = 2 + 5 + 8 + 11 = 26$$\n\n> **Watch out.** The constant in the expression belongs to every term. In $\\sum_{k=1}^{4} (3k - 1)$ the $1$ is subtracted four times, once from each term, not just once.",
        "**级数**是数列各项之和。**求和符号**用希腊字母 $\\Sigma$ 把它简洁地写出来：\n\n$$\\sum_{k=1}^{n} a_k = a_1 + a_2 + \\cdots + a_n$$\n\n**下标** $k$ 从 $\\Sigma$ 下方的下限开始，每次增加 $1$，直到上方的上限。求和时，把 $k$ 的每个值代入式子，再把结果相加：\n\n$$\\sum_{k=1}^{4} (3k - 1) = 2 + 5 + 8 + 11 = 26$$\n\n> **注意。** 式子里的常数属于每一项。$\\sum_{k=1}^{4} (3k - 1)$ 中的 $1$ 要减四次，每项减一次，而不是只减一次。",
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
        const ks = range(1, n).join(" + ");
        const T = (n * (n + 1)) / 2;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer,
          wrong: [f(n), total(terms.slice(0, -1)), Q.of((p * n * (n + 1)) / 2 + c), total(range(0, n).map(f))],
          solution: worked(
            [
              [
                "List the terms",
                "列出各项",
                `Substitute $k = 1, 2, \\ldots, ${n}$ into $${body}$. The terms are ${inlines(terms).en}.`,
                `把 $k = 1, 2, \\ldots, ${n}$ 依次代入 $${body}$，各项是 ${inlines(terms)["zh-CN"]}。`,
              ],
              ["Add them", "相加", "Add the terms:", "把各项相加：", `${expr} = ${listL(terms)} = ${answer.toLatex()}`],
            ],
            `Split the sum into its two parts. It is $${p}$ times $${ks}$, plus $${c}$ once for each of the $${n}$ terms: $${p} \\cdot ${T} + ${n} \\cdot ${pr(c)} = ${answer.toLatex()}$.`,
            `把和拆成两部分。它等于 $${p}$ 乘 $${ks}$，再加上 $${n}$ 项各一个 $${c}$：$${p} \\cdot ${T} + ${n} \\cdot ${pr(c)} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "other-limits-and-terms",
      title: t("Other limits and terms", "其他上下限与通项"),
      explanation: t(
        "The lower limit need not be $1$, and the expression can be any formula in $k$. Start from the lower limit and stop at the upper limit, including both:\n\n$$\\sum_{k=2}^{5} k^{2} = 2^{2} + 3^{2} + 4^{2} + 5^{2} = 4 + 9 + 16 + 25 = 54$$\n\nWith $(-1)^{k}$ the signs alternate: $\\sum_{k=0}^{3} (-1)^{k}2^{k} = 1 - 2 + 4 - 8 = -5$.\n\n> **Watch out.** Both limits are included. When the lower limit is $0$, the first term is the value at $k = 0$, and it is easy to leave out.",
        "下限不一定是 $1$，式子也可以是 $k$ 的任意公式。从下限开始，到上限为止，两端都要算上：\n\n$$\\sum_{k=2}^{5} k^{2} = 2^{2} + 3^{2} + 4^{2} + 5^{2} = 4 + 9 + 16 + 25 = 54$$\n\n含 $(-1)^{k}$ 时符号正负交替：$\\sum_{k=0}^{3} (-1)^{k}2^{k} = 1 - 2 + 4 - 8 = -5$。\n\n> **注意。** 两个限都包括在内。下限是 $0$ 时，第一项是 $k = 0$ 时的值，很容易漏掉。",
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
        const count = hi - lo + 1;
        const back = [...terms].reverse().map((_, i, rev) => total(rev.slice(0, i + 1)));
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer,
          wrong: [total(range(lo === 1 ? 0 : 1, hi).map(f)), total(terms.slice(0, -1)), f(hi), total(terms.slice(1))],
          solution: worked(
            [
              [
                "Read the limits",
                "读出上下限",
                `The index runs from $k = ${lo}$ to $k = ${hi}$, both included, so there are $${hi} - ${lo} + 1 = ${count}$ terms.`,
                `下标从 $k = ${lo}$ 取到 $k = ${hi}$，两端都包括在内，所以共有 $${hi} - ${lo} + 1 = ${count}$ 项。`,
              ],
              [
                "Substitute and add",
                "代入并相加",
                "Substitute each value of $k$ and add:",
                "依次代入 $k$ 的每个值，再相加：",
                `${expr} = ${listL(terms)} = ${answer.toLatex()}`,
              ],
            ],
            `Add from the last term back instead. The running totals are ${inlines(back).en}. The last one is the sum again, from $${count}$ terms.`,
            `改为从最后一项往前加。累加的结果依次是 ${inlines(back)["zh-CN"]}。最后一个仍是这个和，一共加了 $${count}$ 项。`,
          ),
        });
      },
    },
    {
      id: "counting-terms",
      title: t("The number of terms", "项数"),
      explanation: t(
        "A sum from $k = m$ to $k = n$ has $n - m + 1$ terms: subtracting the limits leaves out one of the two ends. For example, $\\sum_{k=4}^{20} (2k + 3)$ has $20 - 4 + 1 = 17$ terms, while $\\sum_{k=0}^{20} (2k + 3)$ has $21$.\n\n> **Watch out.** $n - m$ counts the steps from $m$ to $n$, not the terms. Add $1$ for the term you start from.",
        "从 $k = m$ 到 $k = n$ 的和共有 $n - m + 1$ 项：两个限相减会漏掉一端。例如，$\\sum_{k=4}^{20} (2k + 3)$ 有 $20 - 4 + 1 = 17$ 项，而 $\\sum_{k=0}^{20} (2k + 3)$ 有 $21$ 项。\n\n> **注意。** $n - m$ 数的是从 $m$ 到 $n$ 的步数，不是项数。还要加上起点那一项的 $1$。",
      ),
      generate(rng) {
        const lo = rng.int(0, 15);
        const hi = lo + rng.int(5, 60);
        const body = rng.bool() ? linear(rng.nonZero(-5, 6), rng.nonZero(-9, 9), "k") : `${rng.int(2, 3)}^{k}`;
        const expr = sumL(lo, hi, body);
        const count = hi - lo + 1;
        const shift = lo - 1;
        const values = `${lo}, ${lo + 1}, \\ldots, ${hi}`;
        const check =
          shift === 0
            ? t(
                `The values $1, 2, \\ldots, ${hi}$ already count from $1$, so there are $${hi}$ of them.`,
                `$1, 2, \\ldots, ${hi}$ 本来就是从 $1$ 数起的，所以共有 $${hi}$ 个。`,
              )
            : shift < 0
              ? t(
                  `Add $1$ to every value of $k$. The values $${values}$ become $1, 2, \\ldots, ${count}$, a list of $${count}$ numbers.`,
                  `把 $k$ 的每个值都加 $1$，$${values}$ 就变成 $1, 2, \\ldots, ${count}$，共 $${count}$ 个数。`,
                )
              : t(
                  `Subtract $${shift}$ from every value of $k$. The values $${values}$ become $1, 2, \\ldots, ${count}$, a list of $${count}$ numbers.`,
                  `把 $k$ 的每个值都减去 $${shift}$，$${values}$ 就变成 $1, 2, \\ldots, ${count}$，共 $${count}$ 个数。`,
                );
        return numberProblem({
          prompt: t(`How many terms does $${expr}$ have?`, `$${expr}$ 有多少项？`),
          answer: count,
          wrong: [hi - lo, hi, hi - lo + 2],
          solution: worked(
            [
              [
                "Read the limits",
                "读出上下限",
                `The index takes every integer value from $${lo}$ to $${hi}$, both included.`,
                `下标取遍从 $${lo}$ 到 $${hi}$ 的每个整数，两端都包括在内。`,
              ],
              [
                "Count",
                "计数",
                `Subtracting the limits counts the steps from $${lo}$ to $${hi}$. Add $1$ for the first term:`,
                `两个限相减得到从 $${lo}$ 到 $${hi}$ 的步数，再加上第一项的 $1$：`,
                `${hi} - ${lo} + 1 = ${count}`,
              ],
            ],
            check.en,
            check["zh-CN"],
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
  intro: t(
    "You can evaluate a sum in sigma notation term by term. When the sum is long, or when only some sums are known, it helps to break it into simpler pieces first. A constant can be taken out, a sum of two parts can be split into two sums, and the range can be cut into pieces. Each rule only regroups the same terms.\n\nTake\n\n$$\\sum_{k=1}^{3} (k + 5) = 6 + 7 + 8 = 21$$\n\nRegroup the same terms as $(1 + 2 + 3) + (5 + 5 + 5)$. That is $6 + 15 = 21$ again. The constant $5$ is counted once for each of the $3$ terms.",
    "你会逐项计算用求和符号表示的和。当和很长，或者只知道某些和时，先把它拆成简单的部分会更方便。常数可以提出，两部分之和可以拆成两个和，求和范围也可以切成几段。每条规则只是把同样的项重新组合。\n\n取\n\n$$\\sum_{k=1}^{3} (k + 5) = 6 + 7 + 8 = 21$$\n\n把同样的项重新组合成 $(1 + 2 + 3) + (5 + 5 + 5)$，得 $6 + 15 = 21$，结果相同。常数 $5$ 在 $3$ 项中每项都算了一次。",
  ),
  knowledgePoints: [
    {
      id: "summing-a-constant",
      title: t("Summing a constant", "常数求和"),
      explanation: t(
        "When the expression does not contain $k$, every term is the same, so the sum is the constant times the number of terms:\n\n$$\\sum_{k=1}^{n} c = nc \\qquad \\sum_{k=m}^{n} c = (n - m + 1)c$$\n\nFor example $\\sum_{k=3}^{10} 4 = 4 + 4 + \\cdots + 4 = 8 \\cdot 4 = 32$, because there are $10 - 3 + 1 = 8$ terms.\n\n> **Watch out.** Multiply by the number of terms, not by the upper limit. $\\sum_{k=3}^{10} 4$ has $8$ terms, so it is not $10 \\cdot 4$.",
        "当式子中不含 $k$ 时，每一项都相同，所以和等于常数乘以项数：\n\n$$\\sum_{k=1}^{n} c = nc \\qquad \\sum_{k=m}^{n} c = (n - m + 1)c$$\n\n例如 $\\sum_{k=3}^{10} 4 = 4 + 4 + \\cdots + 4 = 8 \\cdot 4 = 32$，因为共有 $10 - 3 + 1 = 8$ 项。\n\n> **注意。** 要乘以项数，而不是乘以上限。$\\sum_{k=3}^{10} 4$ 有 $8$ 项，所以不是 $10 \\cdot 4$。",
      ),
      generate(rng) {
        const lo = rng.pick([1, 1, 0, 2, 3, 4, 5]);
        const hi = lo + rng.int(3, 30);
        const c = rng.nonZero(-9, 12);
        const count = hi - lo + 1;
        const expr = sumL(lo, hi, num(c));
        const cut = lo + Math.floor(count / 2) - 1;
        const first = cut - lo + 1;
        const rest = hi - cut;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: count * c,
          wrong: [c, hi * c, (hi - lo) * c, count],
          solution: worked(
            [
              [
                "Count the terms",
                "数项数",
                `Every term equals $${c}$. Count the terms:`,
                `每一项都等于 $${c}$。先数项数：`,
                `${hi} - ${lo} + 1 = ${count}`,
              ],
              [
                "Multiply",
                "相乘",
                "The sum is the constant times the number of terms:",
                "和等于常数乘以项数：",
                `${expr} = ${count} \\cdot ${pr(c)} = ${count * c}`,
              ],
            ],
            `Split the range after $k = ${cut}$. The $${first}$ terms up to there add to $${first} \\cdot ${pr(c)} = ${first * c}$. The other $${rest}$ add to $${rest} \\cdot ${pr(c)} = ${rest * c}$. Together they make $${first * c} + ${pr(rest * c)} = ${count * c}$.`,
            `在 $k = ${cut}$ 之后把范围分开。到那里为止的 $${first}$ 项之和是 $${first} \\cdot ${pr(c)} = ${first * c}$，其余 $${rest}$ 项之和是 $${rest} \\cdot ${pr(c)} = ${rest * c}$。合起来是 $${first * c} + ${pr(rest * c)} = ${count * c}$。`,
          ),
        });
      },
    },
    {
      id: "constant-multiples-and-sums",
      title: t("Constant multiples and sums", "常数倍与和的拆分"),
      explanation: t(
        "Because addition can be regrouped and constant factors taken out, a sum of several parts splits into separate sums:\n\n$$\\sum_{k=1}^{n} (p\\,a_k + q\\,b_k) = p\\sum_{k=1}^{n} a_k + q\\sum_{k=1}^{n} b_k$$\n\nIf $\\sum_{k=1}^{12} a_k = 40$ and $\\sum_{k=1}^{12} b_k = 15$, then\n\n$$\\sum_{k=1}^{12} (2a_k - b_k + 3) = 2(40) - 15 + 12 \\cdot 3 = 101$$\n\nThe constant $3$ is added once for each of the $12$ terms.\n\n> **Watch out.** A constant inside the sum is added once for every term, so it contributes the number of terms times itself. Here the $3$ gives $12 \\cdot 3 = 36$, not $3$.",
        "因为加法可以重新组合，常数因子可以提出，所以由几部分组成的和可以拆成几个和：\n\n$$\\sum_{k=1}^{n} (p\\,a_k + q\\,b_k) = p\\sum_{k=1}^{n} a_k + q\\sum_{k=1}^{n} b_k$$\n\n若 $\\sum_{k=1}^{12} a_k = 40$，$\\sum_{k=1}^{12} b_k = 15$，则\n\n$$\\sum_{k=1}^{12} (2a_k - b_k + 3) = 2(40) - 15 + 12 \\cdot 3 = 101$$\n\n常数 $3$ 在 $12$ 项中每项都加了一次。\n\n> **注意。** 和式里的常数每一项都要加一次，所以它贡献的是项数乘以它本身。这里的 $3$ 贡献 $12 \\cdot 3 = 36$，而不是 $3$。",
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
        const withA = p * A + n * c;
        return numberProblem({
          prompt: t(
            `Given that $${sumL(1, n, "a_k")} = ${A}$ and $${sumL(1, n, "b_k")} = ${B}$, evaluate $${expr}$.`,
            `已知 $${sumL(1, n, "a_k")} = ${A}$，$${sumL(1, n, "b_k")} = ${B}$，求 $${expr}$。`,
          ),
          answer,
          wrong: [p * A + q * B + c, p * A + q * B, A + B + n * c, p * A + q * B - n * c],
          solution: worked(
            [
              [
                "Split the sum",
                "拆开和式",
                "Split the sum into three sums and take out the constant factors:",
                "把和拆成三个和，并提出常数因子：",
                `${expr} = ${p === 1 ? "" : p === -1 ? "-" : p}${sumL(1, n, "a_k")} ${q < 0 ? "-" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}${sumL(1, n, "b_k")} + ${sumL(1, n, num(c))}`,
              ],
              [
                "Substitute",
                "代入",
                `The constant $${c}$ is added once for each of the $${n}$ terms, so its sum is $${n} \\cdot ${pr(c)}$:`,
                `常数 $${c}$ 在 $${n}$ 项中每项都加了一次，所以它的和是 $${n} \\cdot ${pr(c)}$：`,
                `${expr} = ${p} \\cdot ${pr(A)} ${q < 0 ? "-" : "+"} ${Math.abs(q)} \\cdot ${pr(B)} + ${n} \\cdot ${pr(c)} = ${answer}`,
              ],
            ],
            `Group the constant with the $a_k$ part instead. Then $${sumL(1, n, poly([p, "a_k"], [c, ""]))} = ${p} \\cdot ${pr(A)} + ${n} \\cdot ${pr(c)} = ${withA}$. Adding $${q} \\cdot ${pr(B)} = ${q * B}$ gives $${withA} + ${pr(q * B)} = ${answer}$.`,
            `改为把常数和 $a_k$ 部分放在一起。这时 $${sumL(1, n, poly([p, "a_k"], [c, ""]))} = ${p} \\cdot ${pr(A)} + ${n} \\cdot ${pr(c)} = ${withA}$。再加上 $${q} \\cdot ${pr(B)} = ${q * B}$，得 $${withA} + ${pr(q * B)} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "splitting-the-range",
      title: t("Splitting the range of a sum", "拆分求和范围"),
      explanation: t(
        "A sum over a range splits into sums over consecutive parts of it:\n\n$$\\sum_{k=1}^{n} a_k = \\sum_{k=1}^{m} a_k + \\sum_{k=m+1}^{n} a_k$$\n\nSo a sum that starts later is a difference of two sums that start at $1$. If $\\sum_{k=1}^{20} a_k = 90$ and $\\sum_{k=1}^{8} a_k = 30$, then\n\n$$\\sum_{k=9}^{20} (2a_k + 1) = 2(90 - 30) + 12 \\cdot 1 = 132$$\n\nThe values $k = 9, \\ldots, 20$ are $12$ terms.\n\n> **Watch out.** A sum from $k = m + 1$ to $n$ leaves out the first $m$ terms. Subtract the sum up to $m$, and count $n - m$ terms, not $n - m + 1$.",
        "一个范围上的和可以拆成相邻几段上的和：\n\n$$\\sum_{k=1}^{n} a_k = \\sum_{k=1}^{m} a_k + \\sum_{k=m+1}^{n} a_k$$\n\n所以从后面开始的和等于两个从 $1$ 开始的和之差。若 $\\sum_{k=1}^{20} a_k = 90$，$\\sum_{k=1}^{8} a_k = 30$，则\n\n$$\\sum_{k=9}^{20} (2a_k + 1) = 2(90 - 30) + 12 \\cdot 1 = 132$$\n\n其中 $k = 9, \\ldots, 20$ 共 $12$ 项。\n\n> **注意。** 从 $k = m + 1$ 到 $n$ 的和去掉了前 $m$ 项。要减去到 $m$ 为止的和，项数是 $n - m$，而不是 $n - m + 1$。",
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
        const whole = p * A + c * n;
        const start = p * B + c * s;
        return numberProblem({
          prompt: t(
            `Given that $${sumL(1, n, "a_k")} = ${A}$ and $${sumL(1, s, "a_k")} = ${B}$, evaluate $${expr}$.`,
            `已知 $${sumL(1, n, "a_k")} = ${A}$，$${sumL(1, s, "a_k")} = ${B}$，求 $${expr}$。`,
          ),
          answer,
          wrong: [p * (A - B) + c * (count + 1), p * (A - B) + c * n, p * (A + B) + c * count, p * (A - B) + c],
          solution: worked(
            [
              [
                "Cut the range",
                "拆分范围",
                `The terms from $k = ${s + 1}$ to $k = ${n}$ are the first $${n}$ terms without the first $${s}$:`,
                `从 $k = ${s + 1}$ 到 $k = ${n}$ 的各项，就是前 $${n}$ 项去掉前 $${s}$ 项：`,
                `${sumL(s + 1, n, "a_k")} = ${A} - ${pr(B)} = ${A - B}`,
              ],
              [
                "Count the terms",
                "数项数",
                `Count the terms from $k = ${s + 1}$ to $k = ${n}$:`,
                `数一数从 $k = ${s + 1}$ 到 $k = ${n}$ 的项数：`,
                `${n} - ${s} = ${count}`,
              ],
              [
                "Combine",
                "合并",
                `Take out the factor $${p}$ and add the constant once for each term:`,
                `提出因子 $${p}$，常数每项加一次：`,
                `${expr} = ${p} \\cdot ${pr(A - B)} + ${count} \\cdot ${pr(c)} = ${answer}`,
              ],
            ],
            `Work out the same sum over the whole range and over the first $${s}$ terms, then subtract. Over the whole range it is $${p} \\cdot ${pr(A)} + ${n} \\cdot ${pr(c)} = ${whole}$. Over the first $${s}$ terms it is $${p} \\cdot ${pr(B)} + ${s} \\cdot ${pr(c)} = ${start}$. The difference is $${whole} - ${pr(start)} = ${answer}$.`,
            `分别算出整个范围上和前 $${s}$ 项上的同一个和，再相减。整个范围上是 $${p} \\cdot ${pr(A)} + ${n} \\cdot ${pr(c)} = ${whole}$。前 $${s}$ 项上是 $${p} \\cdot ${pr(B)} + ${s} \\cdot ${pr(c)} = ${start}$。两者之差是 $${whole} - ${pr(start)} = ${answer}$。`,
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
    { topic: "sigma-notation", weight: 0.3 },
    { topic: "index-of-a-term-in-an-arithmetic-sequence", weight: 0.5 },
    { topic: "nth-term-of-an-arithmetic-sequence", weight: 0.5 },
  ],
  xp: 14,
  intro: t(
    "You can find the $n$th term of an arithmetic sequence and the position of a given term, and you can read sigma notation. Together they let you write a long arithmetic series in a few symbols: the general term goes after $\\Sigma$, and the position of the last term goes on top.\n\nTake $10 + 12 + 14 + \\cdots + 40$. Its first term is $10$ and its common difference is $2$, so its $k$th term is $10 + 2(k - 1) = 2k + 8$. The last term comes from $2k + 8 = 40$, which gives $k = 16$. So\n\n$$10 + 12 + 14 + \\cdots + 40 = \\sum_{k=1}^{16} (2k + 8)$$",
    "你会求等差数列的第 $n$ 项和某一项的位置，也会读求和符号。把它们合起来，就能用几个符号写出很长的等差级数：通项写在 $\\Sigma$ 后面，末项的位置写在上面。\n\n取 $10 + 12 + 14 + \\cdots + 40$。它的首项是 $10$，公差是 $2$，所以第 $k$ 项是 $10 + 2(k - 1) = 2k + 8$。由 $2k + 8 = 40$ 得 $k = 16$，这就是末项的位置。所以\n\n$$10 + 12 + 14 + \\cdots + 40 = \\sum_{k=1}^{16} (2k + 8)$$",
  ),
  knowledgePoints: [
    {
      id: "the-general-term",
      title: t("The general term", "通项"),
      explanation: t(
        "An arithmetic series with first term $a_1$ and common difference $d$ has $k$th term $a_k = a_1 + (k - 1)d$. Simplify it and put it after $\\Sigma$. The series $5 + 8 + 11 + \\cdots + 62$ has $a_1 = 5$ and $d = 3$, so $a_k = 5 + 3(k - 1) = 3k + 2$. The last term $62$ is $a_{20}$, because $3k + 2 = 62$ gives $k = 20$:\n\n$$5 + 8 + 11 + \\cdots + 62 = \\sum_{k=1}^{20} (3k + 2)$$\n\n> **Watch out.** The coefficient of $k$ is the common difference, not the first term. The constant is $a_1 - d$: the term $dk + a_1$ would start the series one step too late.",
        "首项为 $a_1$、公差为 $d$ 的等差级数，第 $k$ 项是 $a_k = a_1 + (k - 1)d$。化简后写在 $\\Sigma$ 后面。级数 $5 + 8 + 11 + \\cdots + 62$ 中 $a_1 = 5$，$d = 3$，所以 $a_k = 5 + 3(k - 1) = 3k + 2$。末项 $62$ 是 $a_{20}$，因为由 $3k + 2 = 62$ 得 $k = 20$：\n\n$$5 + 8 + 11 + \\cdots + 62 = \\sum_{k=1}^{20} (3k + 2)$$\n\n> **注意。** $k$ 的系数是公差，不是首项。常数项是 $a_1 - d$：写成 $dk + a_1$ 会让级数晚开始一步。",
      ),
      generate(rng) {
        const a1 = rng.nonZero(-10, 15);
        const d = rng.nonZero(-6, 8);
        const n = rng.int(8, 30);
        const series = seriesL(arithmetic(a1, d, n));
        const answer = arithmeticTerm(a1, d);
        const last = a1 + (n - 1) * d;
        const atN = `${d} \\cdot ${n}${a1 - d === 0 ? "" : add(Q.of(a1 - d))}`;
        return expressionProblem({
          prompt: t(
            `Write $${series}$ in sigma notation: find the expression for its $k$th term.`,
            `用求和符号表示 $${series}$：求它第 $k$ 项的表达式。`,
          ),
          answer,
          prefix: `\\sum_{k=1}^{${n}}`,
          wrong: [poly([d, "k"], [a1, ""]), poly([a1, "k"], [d, ""]), poly([d, "k"], [a1 + d, ""]), poly([-d, "k"], [a1 + d, ""])],
          solution: worked(
            [
              [
                "Find the common difference",
                "求公差",
                `The first term is $${a1}$. Subtract it from the second term:`,
                `首项是 $${a1}$。用第二项减去它：`,
                `${a1 + d} - ${pr(a1)} = ${d}`,
              ],
              [
                "Write the $k$th term",
                "写出第 $k$ 项",
                "Substitute into $a_k = a_1 + (k - 1)d$ and simplify:",
                "代入 $a_k = a_1 + (k - 1)d$ 并化简：",
                `a_k = ${a1} + ${pr(d)}(k - 1) = ${answer}`,
                `${series} = ${sumL(1, n, answer)}`,
              ],
            ],
            `The expression must give the last term at the upper limit. At $k = ${n}$ it gives $${atN} = ${last}$, the last term of the series.`,
            `这个表达式在上限处必须给出末项。$k = ${n}$ 时它等于 $${atN} = ${last}$，正是级数的末项。`,
          ),
        });
      },
    },
    {
      id: "the-upper-limit",
      title: t("The upper limit", "上限"),
      explanation: t(
        "The upper limit is the index of the last term. Set the general term equal to the last term and solve for $k$. The series $4 + 11 + 18 + \\cdots + 144$ has general term $7k - 3$, and its last term gives\n\n$$7k - 3 = 144 \\implies k = 21$$\n\nSo $N = 21$, and the series is $\\sum_{k=1}^{21} (7k - 3)$.\n\n> **Watch out.** $N$ is the position of the last term, found by solving for $k$. It is not the last term itself.",
        "上限是末项的下标。令通项等于末项，解出 $k$。级数 $4 + 11 + 18 + \\cdots + 144$ 的通项是 $7k - 3$，由末项得\n\n$$7k - 3 = 144 \\implies k = 21$$\n\n所以 $N = 21$，级数是 $\\sum_{k=1}^{21} (7k - 3)$。\n\n> **注意。** $N$ 是末项的位置，由解 $k$ 得到。它不是末项本身。",
      ),
      generate(rng) {
        const a1 = rng.nonZero(-12, 20);
        const d = rng.nonZero(-7, 9);
        const n = rng.int(10, 45);
        const last = a1 + (n - 1) * d;
        const body = arithmeticTerm(a1, d);
        const series = seriesL(arithmetic(a1, d, n));
        const solve = a1 - d === 0 ? [`k = ${n}`] : [`${poly([d, "k"])} = ${last - (a1 - d)}`, `k = ${n}`];
        return numberProblem({
          prompt: t(`Find $N$ such that $${series} = ${sumL(1, "N", body)}$.`, `求 $N$，使 $${series} = ${sumL(1, "N", body)}$。`),
          answer: n,
          solveFor: "N",
          wrong: [n - 1, n + 1, last],
          solution: worked(
            [
              [
                "Set up the equation",
                "列方程",
                `The last term $${last}$ is term number $N$. Set the general term equal to it:`,
                `末项 $${last}$ 是第 $N$ 项。令通项等于它：`,
                `${body} = ${last}`,
              ],
              ["Solve for $k$", "解出 $k$", `Solve for $k$. This value is $N$:`, `解出 $k$，它就是 $N$：`, ...solve],
            ],
            `Count the steps instead. Going from $${a1}$ to $${last}$ in steps of $${d}$, the number of steps is $\\frac{${last} - ${pr(a1)}}{${d}} = ${n - 1}$. Adding $1$ for the first term gives $${n}$ terms.`,
            `改为数步数。从 $${a1}$ 到 $${last}$，每步变化 $${d}$，步数是 $\\frac{${last} - ${pr(a1)}}{${d}} = ${n - 1}$。再加上第一项的 $1$，共 $${n}$ 项。`,
          ),
        });
      },
    },
    {
      id: "equivalent-limits",
      title: t("Choosing the limits", "选择上下限"),
      explanation: t(
        "The same series can be written with different limits, as long as the general term is shifted to match. Starting the index at $0$ instead of $1$ means the term must give $a_1$ at $k = 0$, and the upper limit drops by $1$:\n\n$$5 + 8 + \\cdots + 62 = \\sum_{k=1}^{20} (3k + 2) = \\sum_{k=0}^{19} (3k + 5)$$\n\nCheck a candidate by its first term, its last term and its number of terms.\n\n> **Watch out.** Changing the lower limit alone changes the series. Shift the general term and the upper limit along with it.",
        "同一个级数可以用不同的上下限表示，只要通项相应平移。下标从 $0$ 而不是从 $1$ 开始时，通项在 $k = 0$ 时要等于 $a_1$，上限也要减 $1$：\n\n$$5 + 8 + \\cdots + 62 = \\sum_{k=1}^{20} (3k + 2) = \\sum_{k=0}^{19} (3k + 5)$$\n\n检查一个写法时，看它的首项、末项和项数。\n\n> **注意。** 只改下限会改变级数。通项和上限也要跟着平移。",
      ),
      generate(rng) {
        const a1 = rng.nonZero(-10, 15);
        const d = rng.nonZero(-6, 8);
        const n = rng.int(8, 30);
        const last = a1 + (n - 1) * d;
        const series = seriesL(arithmetic(a1, d, n));
        const fromOne = (lo: number, hi: number, why?: Text): SigmaOption => ({
          lo,
          hi,
          body: arithmeticTerm(a1, d),
          f: (k) => Q.of(a1 + (k - 1) * d),
          ...(why ? { why } : {}),
        });
        const fromZero = (lo: number, hi: number, why?: Text): SigmaOption => ({
          lo,
          hi,
          body: linear(d, a1, "k"),
          f: (k) => Q.of(a1 + k * d),
          ...(why ? { why } : {}),
        });
        const correct = rng.bool() ? fromOne(1, n) : fromZero(0, n - 1);
        const swapped: SigmaOption = {
          lo: 1,
          hi: n,
          body: linear(a1, d, "k"),
          f: (k) => Q.of(a1 * k + d),
          why: t(
            `The coefficient of $k$ must be the common difference $${d}$, not the first term.`,
            `$k$ 的系数必须是公差 $${d}$，而不是首项。`,
          ),
        };
        const top = (o: SigmaOption) => o.f(o.hi).toLatex();
        return sigmaChoice(
          rng,
          t(`Which sum equals $${series}$?`, `哪个和等于 $${series}$？`),
          correct,
          [
            fromZero(
              1,
              n,
              t(`At $k = 1$ this term is $${a1 + d}$, not the first term $${a1}$.`, `$k = 1$ 时这一项是 $${a1 + d}$，不是首项 $${a1}$。`),
            ),
            fromZero(
              0,
              n,
              t(
                `This runs over $k = 0, 1, \\ldots, ${n}$, which is $${n + 1}$ terms, one too many.`,
                `它取 $k = 0, 1, \\ldots, ${n}$，共 $${n + 1}$ 项，多了一项。`,
              ),
            ),
            fromOne(
              1,
              n - 1,
              t(`This has only $${n - 1}$ terms, so it stops before $${last}$.`, `它只有 $${n - 1}$ 项，在 $${last}$ 之前就停了。`),
            ),
            fromOne(
              0,
              n - 1,
              t(`At $k = 0$ this term is $${a1 - d}$, which is not in the series.`, `$k = 0$ 时这一项是 $${a1 - d}$，它不在级数中。`),
            ),
            swapped,
          ],
          worked(
            [
              [
                "Read the series",
                "读出级数",
                `The first term is $${a1}$ and the common difference is $${d}$. Find the number of terms from the last term $${last}$:`,
                `首项是 $${a1}$，公差是 $${d}$。由末项 $${last}$ 求项数：`,
                `${a1} + ${pr(d)}(n - 1) = ${last} \\implies n = ${n}`,
              ],
              [
                "Test the sums",
                "检验各个和",
                `The right sum gives $${a1}$ at its lower limit and has $${n}$ terms:`,
                `正确的和在下限处给出 $${a1}$，并且有 $${n}$ 项：`,
                `${series} = ${sumL(correct.lo, correct.hi, correct.body)}`,
              ],
            ],
            `At its upper limit $k = ${correct.hi}$ the expression $${correct.body}$ gives $${top(correct)}$, the last term of the series. From $k = ${correct.lo}$ to $k = ${correct.hi}$ there are $${correct.hi} - ${correct.lo} + 1 = ${n}$ terms.`,
            `在上限 $k = ${correct.hi}$ 处，表达式 $${correct.body}$ 等于 $${top(correct)}$，正是级数的末项。从 $k = ${correct.lo}$ 到 $k = ${correct.hi}$ 共有 $${correct.hi} - ${correct.lo} + 1 = ${n}$ 项。`,
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
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSA.SSE.B.4"],
  intro: t(
    "You can write an arithmetic series in sigma notation and add its terms one by one. For a long series that is slow, but the terms of an arithmetic series pair up: the first and last add to the same total as the second and the second to last, and so on.\n\nTake $1 + 2 + 3 + \\cdots + 100$. Pair $1$ with $100$, $2$ with $99$, and so on. Each pair adds to $101$, and the $100$ terms make $50$ pairs, so\n\n$$1 + 2 + 3 + \\cdots + 100 = 50 \\cdot 101 = 5050$$\n\nThe same idea gives a formula for every arithmetic series.",
    "你会用求和符号表示等差级数，也会逐项相加。级数很长时这样很慢，但等差级数的项可以配对：首项与末项之和，等于第二项与倒数第二项之和，依此类推。\n\n取 $1 + 2 + 3 + \\cdots + 100$。把 $1$ 和 $100$ 配对，$2$ 和 $99$ 配对，依此类推。每对的和都是 $101$，$100$ 项正好配成 $50$ 对，所以\n\n$$1 + 2 + 3 + \\cdots + 100 = 50 \\cdot 101 = 5050$$\n\n同样的想法给出了每个等差级数的求和公式。",
  ),
  knowledgePoints: [
    {
      id: "first-and-last-terms",
      title: t("From the first and last terms", "由首项和末项求和"),
      explanation: t(
        "Write the series forwards and backwards and add the two lines. Each column adds to $a_1 + a_n$, and there are $n$ columns, so twice the sum is $n(a_1 + a_n)$:\n\n$$S_n = \\frac{n}{2}(a_1 + a_n)$$\n\nAn arithmetic series of $20$ terms from $5$ to $62$ has sum $\\frac{20}{2}(5 + 62) = 10 \\cdot 67 = 670$.\n\n> **Watch out.** Halve the product. $n(a_1 + a_n)$ is twice the sum, because the two lines count every term twice.",
        "把级数正着写一遍、倒着写一遍，再把两行相加。每一列的和都是 $a_1 + a_n$，共 $n$ 列，所以和的两倍是 $n(a_1 + a_n)$：\n\n$$S_n = \\frac{n}{2}(a_1 + a_n)$$\n\n从 $5$ 到 $62$ 共 $20$ 项的等差级数，和为 $\\frac{20}{2}(5 + 62) = 10 \\cdot 67 = 670$。\n\n> **注意。** 乘积要减半。$n(a_1 + a_n)$ 是和的两倍，因为两行把每一项都算了两次。",
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
          solution: worked(
            [
              [
                "Add the two ends",
                "首末相加",
                "Add the first and last terms:",
                "把首项与末项相加：",
                `${a1}${add(Q.of(last))} = ${a1 + last}`,
              ],
              [
                "Use the sum formula",
                "用求和公式",
                "Every pair of terms equally far from the two ends has this total. Use $S_n = \\frac{n}{2}(a_1 + a_n)$:",
                "与两端距离相等的每一对项都有这个和。用 $S_n = \\frac{n}{2}(a_1 + a_n)$：",
                `S_{${n}} = \\frac{${n}}{2} \\cdot ${pr(a1 + last)} = ${answer}`,
              ],
            ],
            `Find the common difference and use the other formula. The difference is $\\frac{${last} - ${pr(a1)}}{${n - 1}} = ${d}$. Then $\\frac{${n}}{2}\\left(2 \\cdot ${pr(a1)} + ${n - 1} \\cdot ${pr(d)}\\right) = ${answer}$.`,
            `求出公差，再用另一个公式。公差是 $\\frac{${last} - ${pr(a1)}}{${n - 1}} = ${d}$。于是 $\\frac{${n}}{2}\\left(2 \\cdot ${pr(a1)} + ${n - 1} \\cdot ${pr(d)}\\right) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "first-term-and-common-difference",
      title: t("From the first term and common difference", "由首项和公差求和"),
      explanation: t(
        "When the last term is not given, substitute $a_n = a_1 + (n - 1)d$:\n\n$$S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$$\n\nThe sum of the first $30$ terms of $7 + 11 + 15 + \\cdots$ is $\\frac{30}{2}(2 \\cdot 7 + 29 \\cdot 4) = 15 \\cdot 130 = 1950$.\n\n> **Watch out.** The $n$th term is $a_1 + (n - 1)d$, with $n - 1$ and not $n$: the first term has no $d$ added to it.",
        "没有给出末项时，代入 $a_n = a_1 + (n - 1)d$：\n\n$$S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$$\n\n$7 + 11 + 15 + \\cdots$ 前 $30$ 项的和是 $\\frac{30}{2}(2 \\cdot 7 + 29 \\cdot 4) = 15 \\cdot 130 = 1950$。\n\n> **注意。** 第 $n$ 项是 $a_1 + (n - 1)d$，乘的是 $n - 1$ 而不是 $n$：首项上没有加 $d$。",
      ),
      generate(rng) {
        const a1 = rng.nonZero(-20, 25);
        const d = rng.nonZero(-6, 9);
        const n = rng.int(10, 40);
        const answer = arithmeticSum(a1, d, n);
        const series = openL(arithmetic(a1, d, 3));
        const inner = 2 * a1 + (n - 1) * d;
        const last = a1 + (n - 1) * d;
        return numberProblem({
          prompt: t(
            `Find the sum of the first $${n}$ terms of the arithmetic series $${series}$.`,
            `求等差级数 $${series}$ 前 $${n}$ 项的和。`,
          ),
          answer,
          wrong: [Q.of(n * (2 * a1 + n * d), 2), n * (a1 + (n - 1) * d), Q.of(n * (a1 + (n - 1) * d), 2), arithmeticSum(a1, d, n - 1)],
          solution: worked(
            [
              [
                "Find the common difference",
                "求公差",
                `The first term is $${a1}$. Subtract it from the second term:`,
                `首项是 $${a1}$。用第二项减去它：`,
                `${a1 + d} - ${pr(a1)} = ${d}`,
              ],
              [
                "Use the sum formula",
                "用求和公式",
                `Substitute $a_1 = ${a1}$, $d = ${d}$ and $n = ${n}$ into $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$:`,
                `把 $a_1 = ${a1}$，$d = ${d}$，$n = ${n}$ 代入 $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$：`,
                `S_{${n}} = \\frac{${n}}{2}\\left(2 \\cdot ${pr(a1)} + ${n - 1} \\cdot ${pr(d)}\\right) = \\frac{${n}}{2} \\cdot ${pr(inner)} = ${answer}`,
              ],
            ],
            `Find the last term and pair it with the first. Term $${n}$ is $${a1} + ${n - 1} \\cdot ${pr(d)} = ${last}$. Then $\\frac{${n}}{2}\\left(${a1}${add(Q.of(last))}\\right) = ${answer}$.`,
            `求出末项，与首项配对。第 $${n}$ 项是 $${a1} + ${n - 1} \\cdot ${pr(d)} = ${last}$。于是 $\\frac{${n}}{2}\\left(${a1}${add(Q.of(last))}\\right) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "a-written-out-series",
      title: t("A series written out", "逐项写出的级数"),
      explanation: t(
        "When a series is written out to its last term, first find the number of terms from $a_n = a_1 + (n - 1)d$, then add. In $3 + 7 + 11 + \\cdots + 79$ the equation $3 + 4(n - 1) = 79$ gives $n = 20$, so the sum is $\\frac{20}{2}(3 + 79) = 820$.\n\n> **Watch out.** Dividing the gap $79 - 3$ by $4$ counts the steps, $19$. There is one more term than there are steps.",
        "级数逐项写到末项时，先由 $a_n = a_1 + (n - 1)d$ 求出项数，再求和。在 $3 + 7 + 11 + \\cdots + 79$ 中，由 $3 + 4(n - 1) = 79$ 得 $n = 20$，所以和为 $\\frac{20}{2}(3 + 79) = 820$。\n\n> **注意。** 用 $4$ 去除差 $79 - 3$ 得到的是步数 $19$。项数比步数多一。",
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
          solution: worked(
            [
              [
                "Find the common difference",
                "求公差",
                "Subtract the first term from the second:",
                "用第二项减去首项：",
                `${a1 + d} - ${pr(a1)} = ${d}`,
              ],
              [
                "Count the terms",
                "求项数",
                `Set $a_n = a_1 + (n - 1)d$ equal to the last term $${last}$:`,
                `令 $a_n = a_1 + (n - 1)d$ 等于末项 $${last}$：`,
                `${a1} + ${pr(d)}(n - 1) = ${last} \\implies n = ${n}`,
              ],
              [
                "Add",
                "求和",
                "Use $S_n = \\frac{n}{2}(a_1 + a_n)$:",
                "用 $S_n = \\frac{n}{2}(a_1 + a_n)$：",
                `S_{${n}} = \\frac{${n}}{2}\\left(${a1}${add(Q.of(last))}\\right) = ${answer}`,
              ],
            ],
            `Use the other sum formula, which needs the common difference instead of the last term: $\\frac{${n}}{2}\\left(2 \\cdot ${pr(a1)} + ${n - 1} \\cdot ${pr(d)}\\right) = ${answer}$.`,
            `改用另一个求和公式，它用公差而不用末项：$\\frac{${n}}{2}\\left(2 \\cdot ${pr(a1)} + ${n - 1} \\cdot ${pr(d)}\\right) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "a-series-in-sigma-notation",
      title: t("A series in sigma notation", "用求和符号表示的级数"),
      explanation: t(
        "A sum $\\sum (pk + q)$ is an arithmetic series with common difference $p$. Find its first and last terms from the limits, and its number of terms. For example, in $\\sum_{k=3}^{40} (2k + 1)$ the first term is $7$, the last term is $81$ and there are $40 - 3 + 1 = 38$ terms. So it equals $\\frac{38}{2}(7 + 81) = 1672$.\n\n> **Watch out.** The first term comes from the lower limit. Here it is the value at $k = 3$, not at $k = 1$.",
        "和式 $\\sum (pk + q)$ 是公差为 $p$ 的等差级数。由上下限求出首项、末项和项数。例如，$\\sum_{k=3}^{40} (2k + 1)$ 的首项是 $7$，末项是 $81$，共 $40 - 3 + 1 = 38$ 项。所以它等于 $\\frac{38}{2}(7 + 81) = 1672$。\n\n> **注意。** 首项由下限给出。这里是 $k = 3$ 时的值，而不是 $k = 1$ 时的值。",
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
        const at = (k: number) => `${p} \\cdot ${pr(k)}${c === 0 ? "" : add(Q.of(c))} = ${f(k)}`;
        const ks = (count * (lo + hi)) / 2;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer,
          wrong: [
            Q.of((hi - lo) * (f(lo) + f(hi)), 2),
            Q.of(hi * (f(1) + f(hi)), 2),
            Q.of((p * hi * (hi + 1)) / 2 + c),
            count * (f(lo) + f(hi)),
          ],
          solution: worked(
            [
              [
                "Find the first and last terms",
                "求首项和末项",
                `Substitute the limits $k = ${lo}$ and $k = ${hi}$ into $${body}$:`,
                `把上下限 $k = ${lo}$ 和 $k = ${hi}$ 代入 $${body}$：`,
                at(lo),
                at(hi),
              ],
              ["Count the terms", "数项数", "Count the values of $k$:", "数一数 $k$ 的取值个数：", `${hi} - ${lo} + 1 = ${count}`],
              [
                "Add",
                "求和",
                `The terms form an arithmetic series with common difference $${p}$. Use $S_n = \\frac{n}{2}(a_1 + a_n)$:`,
                `各项构成公差为 $${p}$ 的等差级数。用 $S_n = \\frac{n}{2}(a_1 + a_n)$：`,
                `${expr} = \\frac{${count}}{2}\\left(${f(lo)}${add(Q.of(f(hi)))}\\right) = ${answer.toLatex()}`,
              ],
            ],
            `Split the sum instead. The values of $k$ add to $\\frac{${count}(${lo} + ${hi})}{2} = ${ks}$. So the sum is $${p} \\cdot ${ks} + ${count} \\cdot ${pr(c)} = ${answer.toLatex()}$.`,
            `改为把和拆开。$k$ 的各个值之和是 $\\frac{${count}(${lo} + ${hi})}{2} = ${ks}$。所以这个和是 $${p} \\cdot ${ks} + ${count} \\cdot ${pr(c)} = ${answer.toLatex()}$。`,
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
  intro: t(
    "You can find the sum of an arithmetic series from its number of terms and either its two ends or its first term and common difference. Each formula links the sum to the other quantities, so when the sum is known and one quantity is missing, the formula becomes an equation for it.\n\nTake an arithmetic series of $10$ terms with sum $150$ and last term $24$. Substituting into $S_n = \\frac{n}{2}(a_1 + a_n)$ gives $150 = 5(a_1 + 24)$. Dividing by $5$ gives $a_1 + 24 = 30$, so\n\n$$a_1 = 6$$\n\nThe series runs $6 + 8 + 10 + \\cdots + 24$.",
    "你会由项数以及首末两项，或者首项和公差，求出等差级数的和。每个公式都把和与其他量联系起来，所以已知和、缺少一个量时，公式就成了关于这个量的方程。\n\n取一个有 $10$ 项、和为 $150$、末项为 $24$ 的等差级数。代入 $S_n = \\frac{n}{2}(a_1 + a_n)$，得 $150 = 5(a_1 + 24)$。两边除以 $5$，得 $a_1 + 24 = 30$，所以\n\n$$a_1 = 6$$\n\n这个级数是 $6 + 8 + 10 + \\cdots + 24$。",
  ),
  knowledgePoints: [
    {
      id: "from-the-sum-and-last-term",
      title: t("From the sum and the last term", "由和与末项求首项"),
      explanation: t(
        "Substitute what is known into $S_n = \\frac{n}{2}(a_1 + a_n)$ and solve for $a_1$. An arithmetic series of $16$ terms has sum $400$ and last term $40$:\n\n$$400 = \\frac{16}{2}(a_1 + 40) \\implies 50 = a_1 + 40 \\implies a_1 = 10$$\n\n> **Watch out.** Divide the sum by $\\frac{n}{2}$, not by $n$. The value $\\frac{2S_n}{n}$ is $a_1 + a_n$, the total of the two ends.",
        "把已知量代入 $S_n = \\frac{n}{2}(a_1 + a_n)$，解出 $a_1$。一个等差级数有 $16$ 项，和为 $400$，末项为 $40$：\n\n$$400 = \\frac{16}{2}(a_1 + 40) \\implies 50 = a_1 + 40 \\implies a_1 = 10$$\n\n> **注意。** 和要除以 $\\frac{n}{2}$，而不是除以 $n$。$\\frac{2S_n}{n}$ 是 $a_1 + a_n$，即首末两项之和。",
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
          solution: worked(
            [
              [
                "Substitute",
                "代入",
                "Substitute into $S_n = \\frac{n}{2}(a_1 + a_n)$:",
                "代入 $S_n = \\frac{n}{2}(a_1 + a_n)$：",
                `${S} = \\frac{${n}}{2}\\left(a_1${add(Q.of(last))}\\right)`,
              ],
              [
                "Solve for $a_1$",
                "解出 $a_1$",
                `Multiply by $2$ and divide by $${n}$, then subtract $${last}$:`,
                `两边乘以 $2$ 再除以 $${n}$，然后减去 $${last}$：`,
                `a_1${add(Q.of(last))} = \\frac{2 \\cdot ${pr(S)}}{${n}} = ${mean.toLatex()}`,
                `a_1 = ${mean.toLatex()} - ${pr(last)} = ${a1}`,
              ],
            ],
            `With $a_1 = ${a1}$, the common difference is $\\frac{${last} - ${pr(a1)}}{${n - 1}} = ${d}$. The other sum formula gives the given sum again: $\\frac{${n}}{2}\\left(2 \\cdot ${pr(a1)} + ${n - 1} \\cdot ${pr(d)}\\right) = ${S}$.`,
            `当 $a_1 = ${a1}$ 时，公差是 $\\frac{${last} - ${pr(a1)}}{${n - 1}} = ${d}$。用另一个求和公式，仍得到已知的和：$\\frac{${n}}{2}\\left(2 \\cdot ${pr(a1)} + ${n - 1} \\cdot ${pr(d)}\\right) = ${S}$。`,
          ),
        });
      },
    },
    {
      id: "from-the-sum-and-common-difference",
      title: t("From the sum and the common difference", "由和与公差求首项"),
      explanation: t(
        "When the common difference is known instead, use $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$. An arithmetic series of $10$ terms with common difference $3$ has sum $185$:\n\n$$185 = \\frac{10}{2}(2a_1 + 9 \\cdot 3) \\implies 37 = 2a_1 + 27 \\implies a_1 = 5$$\n\n> **Watch out.** After dividing, subtract $(n - 1)d$ and then halve. The $2$ in $2a_1$ is easy to forget.",
        "已知公差时，用 $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$。一个等差级数有 $10$ 项，公差为 $3$，和为 $185$：\n\n$$185 = \\frac{10}{2}(2a_1 + 9 \\cdot 3) \\implies 37 = 2a_1 + 27 \\implies a_1 = 5$$\n\n> **注意。** 除完之后，先减去 $(n - 1)d$，再除以 $2$。$2a_1$ 里的 $2$ 很容易忘掉。",
      ),
      generate(rng) {
        const a1 = rng.int(-20, 30);
        const d = rng.nonZero(-6, 8);
        const n = rng.int(8, 36);
        const S = arithmeticSum(a1, d, n);
        const inner = Q.of(2 * S, n);
        const last = a1 + (n - 1) * d;
        return numberProblem({
          prompt: t(
            `An arithmetic series has $${n}$ terms, a common difference of $${d}$ and a sum of $${S}$. Find its first term.`,
            `一个等差级数有 $${n}$ 项，公差为 $${d}$，和为 $${S}$。求它的首项。`,
          ),
          answer: a1,
          solveFor: "a_1",
          wrong: [Q.of(S, n).sub(Q.of((n - 1) * d)), Q.of(S, n).sub(Q.of(n * d, 2)), Q.of(S, n).add(Q.of((n - 1) * d, 2)), Q.of(S, n)],
          solution: worked(
            [
              [
                "Substitute",
                "代入",
                "Substitute into $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$:",
                "代入 $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$：",
                `${S} = \\frac{${n}}{2}\\left(2a_1 + ${n - 1} \\cdot ${pr(d)}\\right)`,
              ],
              [
                "Solve for $a_1$",
                "解出 $a_1$",
                `Multiply by $2$ and divide by $${n}$, then subtract $${(n - 1) * d}$ and halve:`,
                `两边乘以 $2$ 再除以 $${n}$，然后减去 $${(n - 1) * d}$，再除以 $2$：`,
                `2a_1${add(Q.of((n - 1) * d))} = ${inner.toLatex()}`,
                `2a_1 = ${2 * a1} \\implies a_1 = ${a1}`,
              ],
            ],
            `With $a_1 = ${a1}$, the last term is $${a1} + ${n - 1} \\cdot ${pr(d)} = ${last}$. Pairing the two ends gives the given sum again: $\\frac{${n}}{2}\\left(${a1}${add(Q.of(last))}\\right) = ${S}$.`,
            `当 $a_1 = ${a1}$ 时，末项是 $${a1} + ${n - 1} \\cdot ${pr(d)} = ${last}$。把首末两项配对，仍得到已知的和：$\\frac{${n}}{2}\\left(${a1}${add(Q.of(last))}\\right) = ${S}$。`,
          ),
        });
      },
    },
    {
      id: "the-common-difference",
      title: t("The common difference", "求公差"),
      explanation: t(
        "The same formula gives the common difference when the first term is known. An arithmetic series of $12$ terms starting at $4$ has sum $246$:\n\n$$246 = \\frac{12}{2}(2 \\cdot 4 + 11d) \\implies 41 = 8 + 11d \\implies d = 3$$\n\n> **Watch out.** Subtract $2a_1$ before dividing by $n - 1$. Dividing by $n$ instead counts one difference too many.",
        "已知首项时，同一个公式可以求出公差。一个等差级数有 $12$ 项，首项为 $4$，和为 $246$：\n\n$$246 = \\frac{12}{2}(2 \\cdot 4 + 11d) \\implies 41 = 8 + 11d \\implies d = 3$$\n\n> **注意。** 先减去 $2a_1$，再除以 $n - 1$。改除以 $n$ 会多算一个公差。",
      ),
      generate(rng) {
        const a1 = rng.int(-20, 30);
        const d = rng.nonZero(-6, 8);
        const n = rng.int(8, 30);
        const S = arithmeticSum(a1, d, n);
        const inner = Q.of(2 * S, n);
        const last = a1 + (n - 1) * d;
        return numberProblem({
          prompt: t(
            `An arithmetic series has $${n}$ terms, a first term of $${a1}$ and a sum of $${S}$. Find its common difference.`,
            `一个等差级数有 $${n}$ 项，首项为 $${a1}$，和为 $${S}$。求它的公差。`,
          ),
          answer: d,
          solveFor: "d",
          wrong: [Q.of(S - n * a1, n), Q.of(2 * (S - n * a1), n * n), Q.of(S - a1, n - 1), Q.of(S - n * a1, n - 1)],
          solution: worked(
            [
              [
                "Substitute",
                "代入",
                "Substitute into $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$:",
                "代入 $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$：",
                `${S} = \\frac{${n}}{2}\\left(2 \\cdot ${pr(a1)} + ${n - 1}d\\right)`,
              ],
              [
                "Solve for $d$",
                "解出 $d$",
                `Multiply by $2$ and divide by $${n}$, then subtract $${2 * a1}$ and divide by $${n - 1}$:`,
                `两边乘以 $2$ 再除以 $${n}$，然后减去 $${2 * a1}$，再除以 $${n - 1}$：`,
                `${2 * a1} + ${n - 1}d = ${inner.toLatex()}`,
                `${n - 1}d = ${(n - 1) * d} \\implies d = ${d}`,
              ],
            ],
            `With $d = ${d}$, the last term is $${a1} + ${n - 1} \\cdot ${pr(d)} = ${last}$. Pairing the two ends gives the given sum again: $\\frac{${n}}{2}\\left(${a1}${add(Q.of(last))}\\right) = ${S}$.`,
            `当 $d = ${d}$ 时，末项是 $${a1} + ${n - 1} \\cdot ${pr(d)} = ${last}$。把首末两项配对，仍得到已知的和：$\\frac{${n}}{2}\\left(${a1}${add(Q.of(last))}\\right) = ${S}$。`,
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
  intro: t(
    "You can find the sum of an arithmetic series when you know how many terms it has, and you can solve quadratic equations. Sometimes the sum is given and the number of terms is the unknown. If the last term is known, $n$ appears once in the formula. If it is not, $n$ appears twice, in $\\frac{n}{2}$ and in $(n - 1)d$, and the equation is quadratic.\n\nHow many terms of $2 + 4 + 6 + \\cdots$ add to $30$? Here $S_n = \\frac{n}{2}\\big(4 + 2(n - 1)\\big) = n(n + 1)$, so\n\n$$n^{2} + n - 30 = 0 \\implies (n - 5)(n + 6) = 0$$\n\nA number of terms is positive, so $n = 5$. Indeed $2 + 4 + 6 + 8 + 10 = 30$.",
    "你会在已知项数时求等差级数的和，也会解二次方程。有时和是已知的，项数才是未知量。如果末项已知，$n$ 在公式中只出现一次。如果末项未知，$n$ 出现两次，分别在 $\\frac{n}{2}$ 和 $(n - 1)d$ 中，方程就是二次的。\n\n$2 + 4 + 6 + \\cdots$ 的前多少项之和是 $30$？这里 $S_n = \\frac{n}{2}\\big(4 + 2(n - 1)\\big) = n(n + 1)$，所以\n\n$$n^{2} + n - 30 = 0 \\implies (n - 5)(n + 6) = 0$$\n\n项数是正数，所以 $n = 5$。确实 $2 + 4 + 6 + 8 + 10 = 30$。",
  ),
  knowledgePoints: [
    {
      id: "from-the-first-and-last-terms",
      title: t("From the first and last terms", "由首项和末项求项数"),
      explanation: t(
        "When both ends are known, solve $S_n = \\frac{n}{2}(a_1 + a_n)$ for $n$:\n\n$$n = \\frac{2S_n}{a_1 + a_n}$$\n\nAn arithmetic series from $8$ to $50$ with sum $435$ has $n = \\frac{2 \\cdot 435}{8 + 50} = \\frac{870}{58} = 15$ terms.\n\n> **Watch out.** Multiply the sum by $2$ before dividing by $a_1 + a_n$. Dividing $S_n$ alone gives half the number of terms.",
        "两端都已知时，由 $S_n = \\frac{n}{2}(a_1 + a_n)$ 解出 $n$：\n\n$$n = \\frac{2S_n}{a_1 + a_n}$$\n\n从 $8$ 到 $50$、和为 $435$ 的等差级数有 $n = \\frac{2 \\cdot 435}{8 + 50} = \\frac{870}{58} = 15$ 项。\n\n> **注意。** 先把和乘以 $2$，再除以 $a_1 + a_n$。只用 $S_n$ 去除，得到的是项数的一半。",
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
            solution: worked(
              [
                [
                  "Substitute",
                  "代入",
                  "Substitute into $S_n = \\frac{n}{2}(a_1 + a_n)$:",
                  "代入 $S_n = \\frac{n}{2}(a_1 + a_n)$：",
                  `${S} = \\frac{n}{2}\\left(${a1}${add(Q.of(last))}\\right) = ${poly([Q.of(a1 + last, 2), "n"])}`,
                ],
                [
                  "Solve for $n$",
                  "解出 $n$",
                  "Multiply by $2$ and divide by the total of the two ends:",
                  "两边乘以 $2$，再除以首末两项之和：",
                  `n = \\frac{${2 * S}}{${a1 + last}} = ${n}`,
                ],
              ],
              `With $${n}$ terms, the common difference is $\\frac{${last} - ${pr(a1)}}{${n - 1}} = ${d}$. The other sum formula gives the given sum again: $\\frac{${n}}{2}\\left(2 \\cdot ${pr(a1)} + ${n - 1} \\cdot ${pr(d)}\\right) = ${S}$.`,
              `有 $${n}$ 项时，公差是 $\\frac{${last} - ${pr(a1)}}{${n - 1}} = ${d}$。用另一个求和公式，仍得到已知的和：$\\frac{${n}}{2}\\left(2 \\cdot ${pr(a1)} + ${n - 1} \\cdot ${pr(d)}\\right) = ${S}$。`,
            ),
          });
        }
      },
    },
    {
      id: "solving-a-quadratic-for-n",
      title: t("Solving a quadratic for $n$", "解关于 $n$ 的二次方程"),
      explanation: t(
        "When the last term is unknown, $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$ is a quadratic equation in $n$. The number of terms is its positive integer solution. How many terms of $3 + 7 + 11 + \\cdots$ add to $210$?\n\n$$210 = \\frac{n}{2}\\big(6 + 4(n - 1)\\big) \\implies 420 = 4n^{2} + 2n \\implies 2n^{2} + n - 210 = 0$$\n\n$$(n - 10)(2n + 21) = 0 \\implies n = 10$$\n\nThe solution $n = -\\frac{21}{2}$ is rejected: a number of terms is a positive integer.\n\n> **Watch out.** Multiply out $\\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$ carefully before collecting terms: the $-d$ inside changes the coefficient of $n$ to $2a_1 - d$.",
        "末项未知时，$S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$ 是关于 $n$ 的二次方程，项数是它的正整数解。$3 + 7 + 11 + \\cdots$ 的前多少项之和为 $210$？\n\n$$210 = \\frac{n}{2}\\big(6 + 4(n - 1)\\big) \\implies 420 = 4n^{2} + 2n \\implies 2n^{2} + n - 210 = 0$$\n\n$$(n - 10)(2n + 21) = 0 \\implies n = 10$$\n\n舍去解 $n = -\\frac{21}{2}$：项数必须是正整数。\n\n> **注意。** 合并同类项之前，要仔细展开 $\\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$：括号里的 $-d$ 使 $n$ 的系数变成 $2a_1 - d$。",
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
          const last = a1 + (n - 1) * d;
          return numberProblem({
            prompt: t(
              `How many terms of the arithmetic series $${series}$ must be added to get a sum of $${S}$?`,
              `等差级数 $${series}$ 要加多少项，和才等于 $${S}$？`,
            ),
            answer: n,
            solveFor: "n",
            wrong: [n - 1, n + 1, other.neg(), ...(a1 > 0 ? [Q.of(S, a1)] : [])],
            solution: worked(
              [
                [
                  "Set up the equation",
                  "列方程",
                  `Substitute $a_1 = ${a1}$ and $d = ${d}$ into $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$ and multiply by $2$:`,
                  `把 $a_1 = ${a1}$、$d = ${d}$ 代入 $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$，两边乘以 $2$：`,
                  `${2 * S} = n\\left(${2 * a1} + ${d}(n - 1)\\right)`,
                  eq,
                ],
                [
                  "Solve",
                  "解方程",
                  "The quadratic has two solutions:",
                  "这个二次方程有两个解：",
                  `n = ${n} \\quad \\text{or} \\quad n = ${other.toLatex()}`,
                ],
                [
                  "Choose the solution",
                  "取舍",
                  `A number of terms is a positive whole number, so only $n = ${n}$ fits.`,
                  `项数必须是正整数，所以只有 $n = ${n}$ 符合。`,
                ],
              ],
              `Term $${n}$ is $${a1} + ${n - 1} \\cdot ${d} = ${last}$. Pairing the two ends gives the required sum: $\\frac{${n}}{2}\\left(${a1}${add(Q.of(last))}\\right) = ${S}$.`,
              `第 $${n}$ 项是 $${a1} + ${n - 1} \\cdot ${d} = ${last}$。把首末两项配对，得到所要的和：$\\frac{${n}}{2}\\left(${a1}${add(Q.of(last))}\\right) = ${S}$。`,
            ),
          });
        }
      },
    },
    {
      id: "exceeding-a-total",
      title: t("When a sum first exceeds a total", "和首次超过某个值"),
      explanation: t(
        "To find the fewest terms whose sum is greater than a total, solve the equation $S_n = $ total and round the positive solution **up**. How many terms of $5 + 8 + 11 + \\cdots$ are needed for a sum greater than $500$?\n\n$$\\frac{n}{2}\\big(10 + 3(n - 1)\\big) = 500 \\implies 3n^{2} + 7n - 1000 = 0 \\implies n = \\frac{-7 + \\sqrt{12049}}{6} \\approx 17.1$$\n\n$S_{17} = 493$ is not enough, so $18$ terms are needed ($S_{18} = 549$).\n\n> **Watch out.** Round up, not to the nearest whole number. Even a solution just above a whole number, like $17.1$, means $17$ terms fall short.",
        "要求和大于某个值所需的最少项数，先解方程 $S_n = $ 该值，再把正解**向上**取整。$5 + 8 + 11 + \\cdots$ 至少要加多少项，和才大于 $500$？\n\n$$\\frac{n}{2}\\big(10 + 3(n - 1)\\big) = 500 \\implies 3n^{2} + 7n - 1000 = 0 \\implies n = \\frac{-7 + \\sqrt{12049}}{6} \\approx 17.1$$\n\n$S_{17} = 493$ 还不够，所以需要 $18$ 项（$S_{18} = 549$）。\n\n> **注意。** 要向上取整，而不是四舍五入。即使解只比整数大一点，比如 $17.1$，$17$ 项也不够。",
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
            solution: worked(
              [
                [
                  "Set up the equation",
                  "列方程",
                  `Find where the sum equals $${T}$. Substitute $a_1 = ${a1}$ and $d = ${d}$ into the sum formula:`,
                  `先求和恰好等于 $${T}$ 的位置。把 $a_1 = ${a1}$、$d = ${d}$ 代入求和公式：`,
                  `\\frac{n}{2}\\left(${2 * a1} + ${d}(n - 1)\\right) = ${T}`,
                  `${poly([d, "n^{2}"], [2 * a1 - d, "n"], [-2 * T, ""])} = 0`,
                ],
                [
                  "Solve",
                  "解方程",
                  "Take the positive solution of the quadratic:",
                  "取这个二次方程的正解：",
                  `n \\approx ${root.toFixed(2)}`,
                ],
                [
                  "Round up",
                  "向上取整",
                  `The sum grows as terms are added, so it first passes $${T}$ at the next whole number, $n = ${n}$.`,
                  `和随项数增加而变大，所以它在下一个整数 $n = ${n}$ 处首次超过 $${T}$。`,
                ],
              ],
              `Compare the sums on both sides. With one term fewer, $S_{${n - 1}} = ${arithmeticSum(a1, d, n - 1)}$, which is not more than $${T}$. With $${n}$ terms, $S_{${n}} = ${arithmeticSum(a1, d, n)}$, which is more.`,
              `比较两边的和。少一项时 $S_{${n - 1}} = ${arithmeticSum(a1, d, n - 1)}$，不大于 $${T}$。有 $${n}$ 项时 $S_{${n}} = ${arithmeticSum(a1, d, n)}$，大于 $${T}$。`,
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
    { topic: "finding-the-first-term-of-an-arithmetic-series", weight: 0.4 },
    { topic: "modeling-with-arithmetic-sequences", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.SSE.B.4", "CCSS.HSF.LE.A.2"],
  intro: t(
    "You can model an amount that changes by a fixed step with an arithmetic sequence, and you can find the sum, the first term or the number of terms of an arithmetic series. When a situation asks for a total over many steps, that total is an arithmetic series. Name $a_1$, $d$ and $n$ from the words, then use the formula you know.\n\nA pile of logs has $12$ logs in the bottom layer, and each layer above has one log fewer, up to a single log on top. The layers form an arithmetic sequence with $a_1 = 12$, $d = -1$ and $n = 12$, so the pile holds\n\n$$S_{12} = \\frac{12}{2}(12 + 1) = 78 \\text{ logs}$$",
    "你会用等差数列为按固定步长变化的量建模，也会求等差级数的和、首项或项数。当实际问题问的是许多步的总量时，这个总量就是等差级数。先从题目的文字中找出 $a_1$、$d$ 和 $n$，再用学过的公式。\n\n一堆圆木最下层有 $12$ 根，往上每层少一根，最上层只有一根。各层构成等差数列，$a_1 = 12$，$d = -1$，$n = 12$，所以这堆圆木共有\n\n$$S_{12} = \\frac{12}{2}(12 + 1) = 78 \\text{ 根}$$",
  ),
  knowledgePoints: [
    {
      id: "totals-in-context",
      title: t("Totals in context", "实际问题中的总和"),
      explanation: t(
        "When an amount grows by the same step each time, the amounts form an arithmetic sequence and their total is an arithmetic series. A stadium section has $25$ rows; the first has $18$ seats and each row has $2$ more than the one before. Then $a_1 = 18$, $d = 2$ and $n = 25$:\n\n$$S_{25} = \\frac{25}{2}(2 \\cdot 18 + 24 \\cdot 2) = \\frac{25}{2} \\cdot 84 = 1050 \\text{ seats}$$\n\n> **Watch out.** The question asks for the total, not the last amount. The last row has $18 + 24 \\cdot 2 = 66$ seats, but the section has $1050$.",
        "当一个量每次都增加相同的步长时，这些量构成等差数列，它们的总和就是等差级数。体育场的一个区有 $25$ 排，第一排有 $18$ 个座位，之后每排比前一排多 $2$ 个。于是 $a_1 = 18$，$d = 2$，$n = 25$：\n\n$$S_{25} = \\frac{25}{2}(2 \\cdot 18 + 24 \\cdot 2) = \\frac{25}{2} \\cdot 84 = 1050 \\text{ 个座位}$$\n\n> **注意。** 问题问的是总量，而不是最后一个量。最后一排有 $18 + 24 \\cdot 2 = 66$ 个座位，而整个区有 $1050$ 个。",
      ),
      generate(rng) {
        const context = rng.pick(arithmeticContexts);
        const a = rng.int(5, 30);
        const d = rng.int(1, 6);
        const n = rng.int(8, 30);
        const S = arithmeticSum(a, d, n);
        const last = a + (n - 1) * d;
        return numberProblem({
          prompt: context.total(a, d, n),
          answer: S,
          wrong: [n * a, n * (a + (n - 1) * d), arithmeticSum(a, d, n - 1), a + (n - 1) * d],
          solution: worked(
            [
              [
                "Model",
                "建模",
                `The amounts form an arithmetic sequence with first term $a_1 = ${a}$, common difference $d = ${d}$ and $n = ${n}$ terms. The total is its sum.`,
                `这些量构成等差数列，首项 $a_1 = ${a}$，公差 $d = ${d}$，共 $n = ${n}$ 项。总量就是它们的和。`,
              ],
              [
                "Add",
                "求和",
                "Use $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$:",
                "用 $S_n = \\frac{n}{2}\\big(2a_1 + (n - 1)d\\big)$：",
                `S_{${n}} = \\frac{${n}}{2}\\left(2 \\cdot ${a} + ${n - 1} \\cdot ${d}\\right) = ${S}`,
              ],
            ],
            `The last amount is $${a} + ${n - 1} \\cdot ${d} = ${last}$. Pairing it with the first gives the same total: $\\frac{${n}}{2}(${a} + ${last}) = ${S}$.`,
            `最后一个量是 $${a} + ${n - 1} \\cdot ${d} = ${last}$。把它与第一个量配对，得到同样的总量：$\\frac{${n}}{2}(${a} + ${last}) = ${S}$。`,
          ),
        });
      },
    },
    {
      id: "the-number-of-steps",
      title: t("The number of steps", "步数"),
      explanation: t(
        "When the total is known, the number of steps is the positive solution of $S_n = $ total. A stadium section has $1050$ seats, with $18$ in the first row and $2$ more in each row:\n\n$$\\frac{n}{2}\\big(36 + 2(n - 1)\\big) = 1050 \\implies n^{2} + 17n - 1050 = 0 \\implies (n - 25)(n + 42) = 0$$\n\nSo there are $25$ rows.\n\n> **Watch out.** Reject the negative solution of the quadratic. A number of rows, weeks or days is a positive whole number.",
        "已知总和时，步数是方程 $S_n = $ 总和的正解。体育场的一个区有 $1050$ 个座位，第一排 $18$ 个，之后每排多 $2$ 个：\n\n$$\\frac{n}{2}\\big(36 + 2(n - 1)\\big) = 1050 \\implies n^{2} + 17n - 1050 = 0 \\implies (n - 25)(n + 42) = 0$$\n\n所以共有 $25$ 排。\n\n> **注意。** 舍去二次方程的负解。排数、周数或天数都是正整数。",
      ),
      generate(rng) {
        const context = rng.pick(arithmeticContexts);
        const a = rng.int(5, 30);
        const d = rng.int(1, 6);
        const n = rng.int(6, 30);
        const S = arithmeticSum(a, d, n);
        const other = Q.of(-2 * S, d * n);
        const last = a + (n - 1) * d;
        return numberProblem({
          prompt: context.periods(a, d, S),
          answer: n,
          wrong: [n - 1, n + 1, Q.of(S, a), other.neg()],
          solution: worked(
            [
              [
                "Model",
                "建模",
                `The amounts form an arithmetic sequence with $a_1 = ${a}$ and $d = ${d}$. Set its sum equal to $${S}$ and multiply by $2$:`,
                `这些量构成等差数列，$a_1 = ${a}$，$d = ${d}$。令它的和等于 $${S}$，两边乘以 $2$：`,
                `n\\left(${2 * a} + ${d}(n - 1)\\right) = ${2 * S}`,
                `${poly([d, "n^{2}"], [2 * a - d, "n"], [-2 * S, ""])} = 0`,
              ],
              [
                "Solve",
                "解方程",
                "The quadratic has two solutions:",
                "这个二次方程有两个解：",
                `n = ${n} \\quad \\text{or} \\quad n = ${other.toLatex()}`,
              ],
              [
                "Choose the solution",
                "取舍",
                `A count of rows, weeks or days is a positive whole number, so $n = ${n}$.`,
                `排数、周数或天数都是正整数，所以 $n = ${n}$。`,
              ],
            ],
            `Amount number $${n}$ is $${a} + ${n - 1} \\cdot ${d} = ${last}$. Pairing it with the first gives the given total: $\\frac{${n}}{2}(${a} + ${last}) = ${S}$.`,
            `第 $${n}$ 个量是 $${a} + ${n - 1} \\cdot ${d} = ${last}$。把它与第一个量配对，得到已知的总量：$\\frac{${n}}{2}(${a} + ${last}) = ${S}$。`,
          ),
        });
      },
    },
    {
      id: "the-first-amount",
      title: t("The first amount", "第一个量"),
      explanation: t(
        "When the total, the step and the number of steps are known, solve the sum formula for the first amount. A section of $25$ rows with $2$ more seats in each row has $1050$ seats:\n\n$$1050 = \\frac{25}{2}(2a_1 + 24 \\cdot 2) \\implies 84 = 2a_1 + 48 \\implies a_1 = 18$$\n\n> **Watch out.** By the last period the step has been added $n - 1$ times. Subtract $(n - 1)d$, not $nd$, before halving.",
        "已知总和、步长和步数时，由求和公式解出第一个量。一个区有 $25$ 排，每排比前一排多 $2$ 个座位，共 $1050$ 个座位：\n\n$$1050 = \\frac{25}{2}(2a_1 + 24 \\cdot 2) \\implies 84 = 2a_1 + 48 \\implies a_1 = 18$$\n\n> **注意。** 到最后一期，步长加了 $n - 1$ 次。除以 $2$ 之前要减去 $(n - 1)d$，而不是 $nd$。",
      ),
      generate(rng) {
        const context = rng.pick(arithmeticContexts);
        const a = rng.int(5, 30);
        const d = rng.int(1, 6);
        const n = rng.int(8, 30);
        const S = arithmeticSum(a, d, n);
        const last = a + (n - 1) * d;
        return numberProblem({
          prompt: context.first(d, n, S),
          answer: a,
          wrong: [Q.of(S, n).sub(Q.of((n - 1) * d)), Q.of(S, n), Q.of(S, n).sub(Q.of(n * d, 2)), a + (n - 1) * d],
          solution: worked(
            [
              [
                "Model",
                "建模",
                `The amounts form an arithmetic sequence with $d = ${d}$ and $n = ${n}$, and their sum is $${S}$:`,
                `这些量构成等差数列，$d = ${d}$，$n = ${n}$，它们的和是 $${S}$：`,
                `${S} = \\frac{${n}}{2}\\left(2a_1 + ${n - 1} \\cdot ${d}\\right)`,
              ],
              [
                "Solve for $a_1$",
                "解出 $a_1$",
                `Multiply by $2$ and divide by $${n}$, then subtract $${(n - 1) * d}$ and halve:`,
                `两边乘以 $2$ 再除以 $${n}$，然后减去 $${(n - 1) * d}$，再除以 $2$：`,
                `2a_1 + ${(n - 1) * d} = ${(2 * S) / n}`,
                `2a_1 = ${2 * a} \\implies a_1 = ${a}`,
              ],
            ],
            `With $a_1 = ${a}$, the last amount is $${a} + ${n - 1} \\cdot ${d} = ${last}$. Pairing the two ends gives the given total: $\\frac{${n}}{2}(${a} + ${last}) = ${S}$.`,
            `当 $a_1 = ${a}$ 时，最后一个量是 $${a} + ${n - 1} \\cdot ${d} = ${last}$。把首末配对，得到已知的总量：$\\frac{${n}}{2}(${a} + ${last}) = ${S}$。`,
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

/**
 * workedSumL writes the sum formula of a geometric series with the values substituted, then with the power and the two
 * brackets worked out, then its value: "\\frac{-4(1 - 4^{3})}{1 - 4} = \\frac{-4(1 - 64)}{-3} = \\frac{-4 \\cdot (-63)}{-3} = -84".
 */
function workedSumL(a: Q, r: Q, n: number): string {
  const power = r.pow(n);
  const bottom = Q.one.sub(r).toLatex();
  return [
    formulaL(a, r, n),
    `\\frac{${a.toLatex()}\\left(1 - ${pr(power)}\\right)}{${bottom}}`,
    `\\frac{${a.toLatex()} \\cdot ${pr(Q.one.sub(power))}}{${bottom}}`,
    geometricSum(a, r, n).toLatex(),
  ].join(" = ");
}

/** sumSteps writes the worked sum formula of a geometric series of n terms, starting from S_n. */
const sumSteps = (a: Q, r: Q, n: number) => `S_{${n}} = ${workedSumL(a, r, n)}`;

/** ratioStep finds the common ratio of a geometric series by dividing its second term by its first. */
const ratioStep = (a: Q, r: Q): Step => [
  "Find the ratio",
  "求公比",
  `The first term is $${a.toLatex()}$. Divide the second term by it:`,
  `首项是 $${a.toLatex()}$。用第二项除以它：`,
  `r = ${a.mul(r).toLatex()} \\div ${pr(a)} = ${r.toLatex()}`,
];

/** countStep finds the number of terms of a geometric series from its last term. */
function countStep(a: Q, r: Q, n: number): Step {
  const last = a.mul(r.pow(n - 1));
  const lines = [
    `${geometricTerm(a, r, "n-1")} = ${last.toLatex()}`,
    `${base(r)}^{n-1} = ${r.pow(n - 1).toLatex()}`,
    `n - 1 = ${n - 1} \\implies n = ${n}`,
  ];
  return [
    "Count the terms",
    "求项数",
    `Set $a_1r^{n-1}$ equal to the last term $${last.toLatex()}$ and solve for $n$:`,
    `令 $a_1r^{n-1}$ 等于末项 $${last.toLatex()}$，解出 $n$：`,
    ...(a.eq(Q.one) ? lines.slice(1) : lines),
  ];
}

/** lastTermCheck checks a geometric sum with the form of the formula that uses the last term, (a_1 - r a_n)/(1 - r). */
function lastTermCheck(a: Q, r: Q, n: number): Text {
  const last = a.mul(r.pow(n - 1));
  const tex = `\\frac{${a.toLatex()} - ${pr(r)} \\cdot ${pr(last)}}{1 - ${pr(r)}} = ${geometricSum(a, r, n).toLatex()}`;
  return t(
    `Use the form of the formula with the last term, $S_n = \\frac{a_1 - ra_n}{1 - r}$. It gives $${tex}$.`,
    `改用含末项的公式，即 $S_n = \\frac{a_1 - ra_n}{1 - r}$。由它得 $${tex}$。`,
  );
}

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
    { topic: "index-of-a-term-in-a-geometric-sequence", weight: 0.3 },
    { topic: "powers-of-rational-numbers", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSA.SSE.B.4"],
  intro: t(
    "You know that a geometric sequence multiplies by the same ratio $r$ at each step, and you can find the position of a term. Adding many of its terms one by one is slow, and the terms do not pair up as in an arithmetic series. Instead, multiply the series by $r$: almost every term appears again, and subtracting cancels them.\n\nTake $S = 1 + 3 + 9 + 27$. Then $3S = 3 + 9 + 27 + 81$. Subtracting the first line from the second leaves only the two ends:\n\n$$3S - S = 81 - 1 \\implies 2S = 80 \\implies S = 40$$\n\nIndeed $1 + 3 + 9 + 27 = 40$.",
    "你知道等比数列每一步都乘以同一个公比 $r$，也会求某一项的位置。逐项相加它的很多项很慢，而且这些项不能像等差级数那样配对。办法是把级数乘以 $r$：几乎每一项都会再次出现，相减就把它们消掉了。\n\n取 $S = 1 + 3 + 9 + 27$。于是 $3S = 3 + 9 + 27 + 81$。用第二行减去第一行，只剩两端：\n\n$$3S - S = 81 - 1 \\implies 2S = 80 \\implies S = 40$$\n\n确实 $1 + 3 + 9 + 27 = 40$。",
  ),
  knowledgePoints: [
    {
      id: "the-sum-formula",
      title: t("The sum formula", "求和公式"),
      explanation: t(
        "Let $S_n = a_1 + a_1r + a_1r^{2} + \\cdots + a_1r^{n-1}$. Multiplying by $r$ shifts every term one place, so subtracting leaves only the two ends:\n\n$$S_n - rS_n = a_1 - a_1r^{n} \\implies S_n = \\frac{a_1(1 - r^{n})}{1 - r} \\quad (r \\ne 1)$$\n\nThe sum of the first $8$ terms of $3 + 6 + 12 + \\cdots$ is\n\n$$S_8 = \\frac{3(1 - 2^{8})}{1 - 2} = \\frac{3 \\cdot (-255)}{-1} = 765$$\n\n> **Watch out.** The power in the formula is $r^{n}$, with $n$ the number of terms, while the last term is $a_1r^{n-1}$. With a negative ratio keep the brackets: $(-2)^{n}$, not $-2^{n}$.",
        "设 $S_n = a_1 + a_1r + a_1r^{2} + \\cdots + a_1r^{n-1}$。乘以 $r$ 后每一项都向后移一位，两式相减只剩两端：\n\n$$S_n - rS_n = a_1 - a_1r^{n} \\implies S_n = \\frac{a_1(1 - r^{n})}{1 - r} \\quad (r \\ne 1)$$\n\n$3 + 6 + 12 + \\cdots$ 前 $8$ 项的和是\n\n$$S_8 = \\frac{3(1 - 2^{8})}{1 - 2} = \\frac{3 \\cdot (-255)}{-1} = 765$$\n\n> **注意。** 公式中的乘方是 $r^{n}$，$n$ 是项数；而末项是 $a_1r^{n-1}$。公比为负时要保留括号：是 $(-2)^{n}$，不是 $-2^{n}$。",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick(integerRatios);
          const a = Q.of(rng.sign() * rng.int(1, 6));
          const n = rng.int(5, 10);
          if (!small(a, r, n + 1)) continue;
          const series = openL(geometric(a, r, 3));
          const value = geometricSum(a, r, n);
          return numberProblem({
            prompt: t(
              `Find the sum of the first $${n}$ terms of the geometric series $${series}$.`,
              `求等比级数 $${series}$ 前 $${n}$ 项的和。`,
            ),
            answer: value,
            wrong: [
              geometricSum(a, r, n - 1),
              geometricSum(a, r, n + 1),
              a.mul(r.pow(n - 1)),
              a.mul(Q.one.sub(r.pow(n))).div(Q.one.add(r)),
            ],
            solution: worked(
              [
                ratioStep(a, r),
                [
                  "Use the sum formula",
                  "用求和公式",
                  `Substitute $a_1 = ${a.toLatex()}$, $r = ${r.toLatex()}$ and $n = ${n}$ into $S_n = \\frac{a_1(1 - r^{n})}{1 - r}$:`,
                  `把 $a_1 = ${a.toLatex()}$，$r = ${r.toLatex()}$，$n = ${n}$ 代入 $S_n = \\frac{a_1(1 - r^{n})}{1 - r}$：`,
                  sumSteps(a, r, n),
                ],
              ],
              `Add the $${n}$ terms one by one instead: $${listL(geometric(a, r, n))} = ${value.toLatex()}$.`,
              `改为把这 $${n}$ 项逐个相加：$${listL(geometric(a, r, n))} = ${value.toLatex()}$。`,
            ),
          });
        }
      },
    },
    {
      id: "a-series-written-out",
      title: t("A series written out to its last term", "写到末项的级数"),
      explanation: t(
        "When the last term is shown, first find the number of terms from $a_n = a_1r^{n-1}$. In $2 + 6 + 18 + \\cdots + 1458$ the equation $2 \\cdot 3^{n-1} = 1458$ gives $3^{n-1} = 729 = 3^{6}$. So $n = 7$, and\n\n$$S_7 = \\frac{2(1 - 3^{7})}{1 - 3} = \\frac{2 \\cdot (-2186)}{-2} = 2186$$\n\n> **Watch out.** The exponent of the last term is $n - 1$. Here $3^{6}$ means $7$ terms, not $6$.",
        "给出末项时，先由 $a_n = a_1r^{n-1}$ 求出项数。在 $2 + 6 + 18 + \\cdots + 1458$ 中，由 $2 \\cdot 3^{n-1} = 1458$ 得 $3^{n-1} = 729 = 3^{6}$。所以 $n = 7$，\n\n$$S_7 = \\frac{2(1 - 3^{7})}{1 - 3} = \\frac{2 \\cdot (-2186)}{-2} = 2186$$\n\n> **注意。** 末项的指数是 $n - 1$。这里 $3^{6}$ 表示有 $7$ 项，而不是 $6$ 项。",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick(integerRatios);
          const a = Q.of(rng.sign() * rng.int(1, 6));
          const n = rng.int(6, 10);
          if (!small(a, r, n + 1)) continue;
          const terms = geometric(a, r, n);
          const last = terms[n - 1]!;
          const value = geometricSum(a, r, n);
          return numberProblem({
            prompt: t(`Find the sum of the geometric series $${seriesL(terms)}$.`, `求等比级数 $${seriesL(terms)}$ 的和。`),
            answer: value,
            wrong: [geometricSum(a, r, n - 1), geometricSum(a, r, n + 1), total(terms.slice(0, 3).concat([last]))],
            solution: worked(
              [
                ratioStep(a, r),
                countStep(a, r, n),
                ["Use the sum formula", "用求和公式", "Substitute into the sum formula:", "代入求和公式：", sumSteps(a, r, n)],
              ],
              lastTermCheck(a, r, n).en,
              lastTermCheck(a, r, n)["zh-CN"],
            ),
          });
        }
      },
    },
    {
      id: "fractional-ratios",
      title: t("Fractional ratios", "分数公比"),
      explanation: t(
        "The formula works the same way for a fractional ratio. Write the powers as fractions and simplify. The series $48 + 24 + 12 + \\cdots + \\frac{3}{4}$ has $r = \\frac{1}{2}$, and its last term gives $48\\left(\\frac{1}{2}\\right)^{n-1} = \\frac{3}{4}$. So $n = 7$, and\n\n$$S_7 = \\frac{48\\left(1 - \\left(\\frac{1}{2}\\right)^{7}\\right)}{1 - \\frac{1}{2}} = 96\\left(1 - \\frac{1}{128}\\right) = \\frac{381}{4}$$\n\n> **Watch out.** With a fractional ratio the denominator $1 - r$ is a fraction too. Dividing by $1 - \\frac{1}{2} = \\frac{1}{2}$ doubles the numerator; it does not halve it.",
        "公比是分数时，公式同样适用。把乘方写成分数再化简。级数 $48 + 24 + 12 + \\cdots + \\frac{3}{4}$ 的公比 $r = \\frac{1}{2}$，由末项得 $48\\left(\\frac{1}{2}\\right)^{n-1} = \\frac{3}{4}$。所以 $n = 7$，\n\n$$S_7 = \\frac{48\\left(1 - \\left(\\frac{1}{2}\\right)^{7}\\right)}{1 - \\frac{1}{2}} = 96\\left(1 - \\frac{1}{128}\\right) = \\frac{381}{4}$$\n\n> **注意。** 公比是分数时，分母 $1 - r$ 也是分数。除以 $1 - \\frac{1}{2} = \\frac{1}{2}$ 是把分子乘以 $2$，而不是减半。",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick(fractionRatios);
          const n = rng.int(4, 7);
          const whole = rng.bool();
          const a = whole ? integerStart(rng, r, n, 3) : Q.of(rng.sign() * rng.int(1, 4) * Number(r.d) ** rng.int(1, n - 2));
          if (!small(a, r, n + 1) || a.abs().cmp(Q.of(2000)) > 0) continue;
          const terms = geometric(a, r, n);
          const count: Step =
            n <= 5
              ? ["Count the terms", "数项数", `All the terms are shown, and there are $${n}$ of them.`, `所有的项都已写出，共 $${n}$ 项。`]
              : countStep(a, r, n);
          return numberProblem({
            prompt: t(`Find the sum of the geometric series $${seriesL(terms)}$.`, `求等比级数 $${seriesL(terms)}$ 的和。`),
            answer: geometricSum(a, r, n),
            wrong: [
              geometricSum(a, r, n - 1),
              geometricSum(a, r, n + 1),
              a.div(Q.one.sub(r)),
              a.mul(Q.one.sub(r.pow(n))).div(Q.one.add(r)),
            ],
            solution: worked(
              [
                ratioStep(a, r),
                count,
                ["Use the sum formula", "用求和公式", "Substitute into the sum formula:", "代入求和公式：", sumSteps(a, r, n)],
              ],
              lastTermCheck(a, r, n).en,
              lastTermCheck(a, r, n)["zh-CN"],
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
  encompasses: [{ topic: "the-sum-of-a-finite-geometric-series", weight: 0.6 }],
  xp: 14,
  standards: ["CCSS.HSA.SSE.B.4"],
  intro: t(
    "You can add a geometric series once you know its first term, its ratio and its number of terms, and you can find a geometric sequence from two of its terms. Often the sequence is not written out but given by a formula for $a_n$ or by two terms. Then the first job is to find $a_1$ and $r$; the sum formula does the rest.\n\nTake $a_n = 3 \\cdot 2^{n+1}$. Substituting $n = 1$ gives $a_1 = 3 \\cdot 2^{2} = 12$, and the base gives $r = 2$. The first $4$ terms add to\n\n$$S_4 = \\frac{12(1 - 2^{4})}{1 - 2} = 180$$\n\nIndeed $12 + 24 + 48 + 96 = 180$.",
    "你会在知道首项、公比和项数时求等比级数的和，也会由两项求出等比数列。数列常常不是逐项写出的，而是由 $a_n$ 的公式或其中两项给出。这时第一步是求出 $a_1$ 和 $r$，剩下的交给求和公式。\n\n取 $a_n = 3 \\cdot 2^{n+1}$。代入 $n = 1$ 得 $a_1 = 3 \\cdot 2^{2} = 12$，由底数得 $r = 2$。前 $4$ 项之和是\n\n$$S_4 = \\frac{12(1 - 2^{4})}{1 - 2} = 180$$\n\n确实 $12 + 24 + 48 + 96 = 180$。",
  ),
  knowledgePoints: [
    {
      id: "from-an-explicit-formula",
      title: t("From an explicit formula", "由通项公式求和"),
      explanation: t(
        "To add the first $n$ terms of $a_n = c \\cdot r^{n + s}$, read the common ratio $r$ from the base and find the first term by substituting $n = 1$; the coefficient $c$ is the first term only when the exponent is $n - 1$. For $a_n = 5 \\cdot 2^{n}$, $a_1 = 10$ and $r = 2$, so\n\n$$S_6 = \\frac{10(1 - 2^{6})}{1 - 2} = 630$$\n\n> **Watch out.** Always substitute $n = 1$ to get $a_1$. For $a_n = 5 \\cdot 2^{n}$ the first term is $10$, not $5$.",
        "要把 $a_n = c \\cdot r^{n + s}$ 的前 $n$ 项相加，从底数读出公比 $r$，代入 $n = 1$ 求出首项；只有指数是 $n - 1$ 时，系数 $c$ 才是首项。对 $a_n = 5 \\cdot 2^{n}$，$a_1 = 10$，$r = 2$，所以\n\n$$S_6 = \\frac{10(1 - 2^{6})}{1 - 2} = 630$$\n\n> **注意。** 一定要代入 $n = 1$ 求 $a_1$。对 $a_n = 5 \\cdot 2^{n}$，首项是 $10$，不是 $5$。",
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
          const value = geometricSum(a, r, n);
          return numberProblem({
            prompt: t(
              `Find the sum of the first $${n}$ terms of the geometric sequence $${formula}$.`,
              `求等比数列 $${formula}$ 前 $${n}$ 项的和。`,
            ),
            answer: value,
            wrong: [geometricSum(c, r, n), geometricSum(a, r, n - 1), geometricSum(a, r, n + 1), a.mul(r.pow(n - 1))],
            solution: worked(
              [
                [
                  "Find the first term and the ratio",
                  "求首项和公比",
                  `Substitute $n = 1$ to get the first term. The common ratio is the base of the power, $${r.toLatex()}$:`,
                  `代入 $n = 1$ 得到首项。公比是幂的底数 $${r.toLatex()}$：`,
                  `a_1 = ${geometricTerm(c, r, String(1 + s))} = ${a.toLatex()}`,
                ],
                [
                  "Use the sum formula",
                  "用求和公式",
                  `Substitute $a_1 = ${a.toLatex()}$, $r = ${r.toLatex()}$ and $n = ${n}$:`,
                  `代入 $a_1 = ${a.toLatex()}$，$r = ${r.toLatex()}$，$n = ${n}$：`,
                  sumSteps(a, r, n),
                ],
              ],
              `Add the $${n}$ terms one by one instead: $${listL(geometric(a, r, n))} = ${value.toLatex()}$.`,
              `改为把这 $${n}$ 项逐个相加：$${listL(geometric(a, r, n))} = ${value.toLatex()}$。`,
            ),
          });
        }
      },
    },
    {
      id: "from-two-terms",
      title: t("From two terms", "由两项求和"),
      explanation: t(
        "When two terms are given, divide them to find the ratio, then work back to the first term. If $a_2 = 6$ and $a_5 = 162$, then $r^{3} = \\frac{162}{6} = 27$, so $r = 3$ and $a_1 = \\frac{6}{3} = 2$:\n\n$$S_6 = \\frac{2(1 - 3^{6})}{1 - 3} = 728$$\n\n> **Watch out.** Terms $a_p$ and $a_q$ are $q - p$ steps apart, so their quotient is $r^{q-p}$, not $r$. An even power has two real roots, so the sign of $r$ must be given.",
        "给出两项时，用它们相除求出公比，再倒推出首项。若 $a_2 = 6$，$a_5 = 162$，则 $r^{3} = \\frac{162}{6} = 27$，所以 $r = 3$，$a_1 = \\frac{6}{3} = 2$：\n\n$$S_6 = \\frac{2(1 - 3^{6})}{1 - 3} = 728$$\n\n> **注意。** $a_p$ 和 $a_q$ 相隔 $q - p$ 步，所以它们的商是 $r^{q-p}$，而不是 $r$。偶次方有两个实数根，所以必须给出 $r$ 的符号。",
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
          const value = geometricSum(a, r, n);
          const ratio =
            gap === 1
              ? [`r = \\frac{${aq.toLatex()}}{${ap.toLatex()}} = ${r.toLatex()}`]
              : [`r^{${gap}} = \\frac{${aq.toLatex()}}{${ap.toLatex()}} = ${aq.div(ap).toLatex()}`, `r = ${r.toLatex()}`];
          const power = p === 2 ? "a_1r" : `a_1r^{${p - 1}}`;
          return numberProblem({
            prompt: t(
              `In a geometric sequence, $a_{${p}} = ${ap.toLatex()}$ and $a_{${q}} = ${aq.toLatex()}$.${note.en} Find the sum of the first $${n}$ terms.`,
              `在一个等比数列中，$a_{${p}} = ${ap.toLatex()}$，$a_{${q}} = ${aq.toLatex()}$。${note["zh-CN"]}求前 $${n}$ 项的和。`,
            ),
            answer: value,
            wrong: [geometricSum(ap, r, n), geometricSum(a, r, n - 1), geometricSum(a, r, n + 1)],
            solution: worked(
              [
                [
                  "Find the ratio",
                  "求公比",
                  gap === 1
                    ? "The two terms are next to each other, so their quotient is $r$:"
                    : `From term $${p}$ to term $${q}$ the sequence multiplies by $r$ ${gap === 2 ? "twice" : "three times"}${gap === 2 ? ", and $r$ is positive" : ""}:`,
                  gap === 1
                    ? "这两项相邻，所以它们的商就是 $r$："
                    : `从第 $${p}$ 项到第 $${q}$ 项，乘了 $${gap}$ 次 $r$${gap === 2 ? "，并且 $r$ 为正" : ""}：`,
                  ...ratio,
                ],
                [
                  "Find the first term",
                  "求首项",
                  `Term $${p}$ is $${power}$, so divide it by $${r.pow(p - 1).toLatex()}$:`,
                  `第 $${p}$ 项是 $${power}$，所以用它除以 $${r.pow(p - 1).toLatex()}$：`,
                  `a_1 = \\frac{${ap.toLatex()}}{${r.pow(p - 1).toLatex()}} = ${a.toLatex()}`,
                ],
                ["Use the sum formula", "用求和公式", "Substitute into the sum formula:", "代入求和公式：", sumSteps(a, r, n)],
              ],
              `Add the $${n}$ terms one by one instead: $${listL(geometric(a, r, n))} = ${value.toLatex()}$.`,
              `改为把这 $${n}$ 项逐个相加：$${listL(geometric(a, r, n))} = ${value.toLatex()}$。`,
            ),
          });
        }
      },
    },
    {
      id: "the-first-term-from-the-sum",
      title: t("The first term from the sum", "由和求首项"),
      explanation: t(
        "Solve the sum formula for $a_1$ when the sum is known. A geometric series of $5$ terms with common ratio $3$ has sum $605$:\n\n$$605 = \\frac{a_1(1 - 3^{5})}{1 - 3} = 121a_1 \\implies a_1 = 5$$\n\n> **Watch out.** Work out the factor $\\frac{1 - r^{n}}{1 - r}$ first, then divide the sum by it. Dividing by $n$ would treat every term as equal.",
        "已知和时，由求和公式解出 $a_1$。一个等比级数有 $5$ 项，公比为 $3$，和为 $605$：\n\n$$605 = \\frac{a_1(1 - 3^{5})}{1 - 3} = 121a_1 \\implies a_1 = 5$$\n\n> **注意。** 先算出因子 $\\frac{1 - r^{n}}{1 - r}$，再用和除以它。除以 $n$ 相当于把每一项都当成相等的。",
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
            solution: worked(
              [
                [
                  "Substitute",
                  "代入",
                  `Substitute $r = ${r.toLatex()}$ and $n = ${n}$ into the sum formula and work out the numbers:`,
                  `把 $r = ${r.toLatex()}$、$n = ${n}$ 代入求和公式，算出其中的数：`,
                  `${S.toLatex()} = ${formulaL(Q.one, r, n).replace("1\\left(", "a_1\\left(")} = \\frac{a_1\\left(1 - ${pr(r.pow(n))}\\right)}{${Q.one.sub(r).toLatex()}} = ${factor.toLatex()}a_1`,
                ],
                [
                  "Solve for $a_1$",
                  "解出 $a_1$",
                  `Divide both sides by $${factor.toLatex()}$:`,
                  `两边除以 $${factor.toLatex()}$：`,
                  `a_1 = ${S.toLatex()} \\div ${pr(factor)} = ${a.toLatex()}`,
                ],
              ],
              `With $a_1 = ${a.toLatex()}$, adding the $${n}$ terms one by one gives the given sum: $${listL(geometric(a, r, n))} = ${S.toLatex()}$.`,
              `当 $a_1 = ${a.toLatex()}$ 时，把这 $${n}$ 项逐个相加，得到已知的和：$${listL(geometric(a, r, n))} = ${S.toLatex()}$。`,
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
    { topic: "index-of-a-term-in-a-geometric-sequence", weight: 0.5 },
    { topic: "nth-term-of-a-geometric-sequence", weight: 0.5 },
  ],
  xp: 14,
  intro: t(
    "You can write an arithmetic series in sigma notation by finding its $k$th term and its number of terms, and you can add a geometric series with the sum formula. A geometric series is written in sigma notation the same way. Only its $k$th term is a power: with first term $a_1$ and common ratio $r$, the $k$th term is $a_1r^{k-1}$.\n\nTake $5 + 15 + 45 + 135 + 405$. The first term is $5$, the ratio is $15 \\div 5 = 3$ and there are $5$ terms, so\n\n$$5 + 15 + 45 + 135 + 405 = \\sum_{k=1}^{5} 5 \\cdot 3^{k-1}$$\n\nSubstituting $k = 5$ gives back the last term: $5 \\cdot 3^{4} = 405$.",
    "你会通过求第 $k$ 项和项数，用求和符号表示等差级数，也会用求和公式求等比级数的和。等比级数也用同样的方法写成求和符号，只是它的第 $k$ 项是一个乘方：首项为 $a_1$、公比为 $r$ 时，第 $k$ 项是 $a_1r^{k-1}$。\n\n取 $5 + 15 + 45 + 135 + 405$。首项是 $5$，公比是 $15 \\div 5 = 3$，共 $5$ 项，所以\n\n$$5 + 15 + 45 + 135 + 405 = \\sum_{k=1}^{5} 5 \\cdot 3^{k-1}$$\n\n代入 $k = 5$ 又得到末项：$5 \\cdot 3^{4} = 405$。",
  ),
  knowledgePoints: [
    {
      id: "the-general-term",
      title: t("The general term", "通项"),
      explanation: t(
        "A geometric series with first term $a_1$ and common ratio $r$ has $k$th term $a_1r^{k-1}$:\n\n$$3 + 6 + 12 + \\cdots + 384 = \\sum_{k=1}^{8} 3 \\cdot 2^{k-1}$$\n\nHere $a_1 = 3$, $r = 2$, and $384 = 3 \\cdot 2^{7}$ is the $8$th term. A negative or fractional ratio goes in parentheses, as in $5\\left(-\\frac{1}{2}\\right)^{k-1}$.\n\n> **Watch out.** When the sum starts at $k = 1$, the exponent is $k - 1$, not $k$: at $k = 1$ the term must be $a_1$ itself. Written with $2^{k}$, the sum above would start at $6$. Also keep the parentheses: $(-2)^{k-1}$ alternates in sign, while $-2^{k-1}$ is always negative.",
        "首项为 $a_1$、公比为 $r$ 的等比级数，第 $k$ 项是 $a_1r^{k-1}$：\n\n$$3 + 6 + 12 + \\cdots + 384 = \\sum_{k=1}^{8} 3 \\cdot 2^{k-1}$$\n\n这里 $a_1 = 3$，$r = 2$，而 $384 = 3 \\cdot 2^{7}$ 是第 $8$ 项。负数或分数公比要加括号，例如 $5\\left(-\\frac{1}{2}\\right)^{k-1}$。\n\n> **注意。** 和从 $k = 1$ 开始时，指数是 $k - 1$，不是 $k$：$k = 1$ 时这一项必须就是 $a_1$。如果写成 $2^{k}$，上面的和就从 $6$ 开始了。还要保留括号：$(-2)^{k-1}$ 正负交替，而 $-2^{k-1}$ 总是负数。",
      ),
      generate(rng) {
        const { a, r, n } = someGeometricSeries(rng);
        const terms = geometric(a, r, n);
        const series = seriesL(terms);
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
          solution: worked(
            [
              ratioStep(a, r),
              [
                "Write the $k$th term",
                "写出第 $k$ 项",
                `The $k$th term is $a_1r^{k-1}$ with $a_1 = ${a.toLatex()}$ and $r = ${r.toLatex()}$:`,
                `第 $k$ 项是 $a_1r^{k-1}$，其中 $a_1 = ${a.toLatex()}$，$r = ${r.toLatex()}$：`,
                `${series} = ${sumL(1, n, answer)}`,
              ],
            ],
            `Substitute the upper limit $k = ${n}$ into the $k$th term to get back the last term of the series: $${geometricTerm(a, r, String(n - 1))} = ${terms[n - 1]!.toLatex()}$.`,
            `把上限 $k = ${n}$ 代入第 $k$ 项，又得到级数的末项：$${geometricTerm(a, r, String(n - 1))} = ${terms[n - 1]!.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "the-upper-limit",
      title: t("The upper limit", "上限"),
      explanation: t(
        "The upper limit is the number of the last term. Set the general term equal to the last term and solve for $k$. For\n\n$$2 + 10 + 50 + \\cdots + 31250 = \\sum_{k=1}^{N} 2 \\cdot 5^{k-1}$$\n\ndivide $2 \\cdot 5^{k-1} = 31250$ by $2$:\n\n$$5^{k-1} = 15625 = 5^{6}$$\n\nSo $k - 1 = 6$, $k = 7$ and $N = 7$.\n\n> **Watch out.** The last term has exponent $N - 1$, not $N$. Here $5^{6}$ gives $N = 7$; answering $6$ leaves out the first term, $2 \\cdot 5^{0}$.",
        "上限是末项的序号。令通项等于末项，解出 $k$。对于\n\n$$2 + 10 + 50 + \\cdots + 31250 = \\sum_{k=1}^{N} 2 \\cdot 5^{k-1}$$\n\n把 $2 \\cdot 5^{k-1} = 31250$ 两边除以 $2$：\n\n$$5^{k-1} = 15625 = 5^{6}$$\n\n所以 $k - 1 = 6$，$k = 7$，$N = 7$。\n\n> **注意。** 末项的指数是 $N - 1$，不是 $N$。这里由 $5^{6}$ 得 $N = 7$；答 $6$ 就漏掉了首项 $2 \\cdot 5^{0}$。",
      ),
      generate(rng) {
        const { a, r, n } = someGeometricSeries(rng);
        const terms = geometric(a, r, n);
        const last = terms[n - 1]!;
        const body = geometricTerm(a, r, "k-1");
        const series = seriesL(terms);
        const lines = [`${geometricTerm(a, r, "N-1")} = ${last.toLatex()}`, `${base(r)}^{N-1} = ${r.pow(n - 1).toLatex()}`];
        return numberProblem({
          prompt: t(`Find $N$ such that $${series} = ${sumL(1, "N", body)}$.`, `求 $N$，使 $${series} = ${sumL(1, "N", body)}$。`),
          answer: n,
          solveFor: "N",
          wrong: [n - 1, n + 1],
          solution: worked(
            [
              [
                "Set the last term equal to the $N$th term",
                "令末项等于第 $N$ 项",
                `The last term $${last.toLatex()}$ is term number $N$, so substitute $k = N$ into the general term:`,
                `末项 $${last.toLatex()}$ 是第 $N$ 项，所以把 $k = N$ 代入通项：`,
                ...(a.eq(Q.one) ? lines.slice(1) : lines),
              ],
              [
                "Solve for $N$",
                "解出 $N$",
                `Write $${r.pow(n - 1).toLatex()}$ as a power of $${r.toLatex()}$ and compare the exponents:`,
                `把 $${r.pow(n - 1).toLatex()}$ 写成 $${r.toLatex()}$ 的乘方，比较指数：`,
                `${base(r)}^{N-1} = ${base(r)}^{${n - 1}}`,
                `N - 1 = ${n - 1}`,
                `N = ${n}`,
              ],
            ],
            `Start from the first term and multiply by $${r.toLatex()}$ until the last term appears. The terms are ${inlines(terms).en}. That makes $${n}$ terms.`,
            `从首项开始不断乘以 $${r.toLatex()}$，直到出现末项。这些项是 ${inlines(terms)["zh-CN"]}。一共 $${n}$ 项。`,
          ),
        });
      },
    },
    {
      id: "equivalent-limits",
      title: t("Choosing the limits", "选择上下限"),
      explanation: t(
        "Starting the index at $0$ instead of $1$ lowers each exponent by one and the upper limit by one:\n\n$$3 + 6 + \\cdots + 384 = \\sum_{k=1}^{8} 3 \\cdot 2^{k-1} = \\sum_{k=0}^{7} 3 \\cdot 2^{k}$$\n\nCheck a candidate by its first term and its number of terms. The sum of $3 \\cdot 2^{k}$ from $k = 1$ to $8$ starts at $6$, so it is a different series.\n\n> **Watch out.** Changing one limit alone changes the series. Moving the lower limit from $1$ to $0$ adds a term at the front unless the upper limit goes down by one as well, and the exponent must change from $k - 1$ to $k$ so that the first term is still $3$.",
        "下标从 $0$ 而不是从 $1$ 开始时，每个指数减 $1$，上限也减 $1$：\n\n$$3 + 6 + \\cdots + 384 = \\sum_{k=1}^{8} 3 \\cdot 2^{k-1} = \\sum_{k=0}^{7} 3 \\cdot 2^{k}$$\n\n检查一个写法时，看它的首项和项数。$3 \\cdot 2^{k}$ 从 $k = 1$ 加到 $8$ 的和从 $6$ 开始，所以是另一个级数。\n\n> **注意。** 只改一个上下限就会改变级数。下限从 $1$ 改为 $0$ 时，如果上限不同时减 $1$，前面就多出一项；指数也必须从 $k - 1$ 改为 $k$，首项才仍是 $3$。",
      ),
      generate(rng) {
        const { a, r, n } = someGeometricSeries(rng);
        const terms = geometric(a, r, n);
        const series = seriesL(terms);
        const fromOne = (lo: number, hi: number, why?: Text): SigmaOption => ({
          lo,
          hi,
          body: geometricTerm(a, r, "k-1"),
          f: (k) => a.mul(r.pow(k - 1)),
          ...(why ? { why } : {}),
        });
        const fromZero = (lo: number, hi: number, why?: Text): SigmaOption => ({
          lo,
          hi,
          body: geometricTerm(a, r, "k"),
          f: (k) => a.mul(r.pow(k)),
          ...(why ? { why } : {}),
        });
        const ar = a.mul(r).toLatex();
        const correct = rng.bool() ? fromOne(1, n) : fromZero(0, n - 1);
        const swapped: SigmaOption = {
          lo: 1,
          hi: n,
          body: geometricTerm(r, a, "k-1"),
          f: (k) => r.mul(a.pow(k - 1)),
          why: t(
            `It swaps the first term and the ratio: it starts at $${r.toLatex()}$ and multiplies by $${a.toLatex()}$.`,
            `它把首项和公比对调了：从 $${r.toLatex()}$ 开始，每次乘以 $${a.toLatex()}$。`,
          ),
        };
        const distractors = [
          fromZero(
            1,
            n,
            t(
              `At $k = 1$ it gives $${ar}$, not the first term $${a.toLatex()}$: each of its terms is the matching term of the series times $${r.toLatex()}$.`,
              `$k = 1$ 时它给出 $${ar}$，而不是首项 $${a.toLatex()}$：它的每一项都是级数中对应项乘以 $${r.toLatex()}$。`,
            ),
          ),
          fromZero(
            0,
            n,
            t(
              `It runs from $k = 0$ to $k = ${n}$, which is $${n + 1}$ terms, one more than the series has.`,
              `它从 $k = 0$ 到 $k = ${n}$，共 $${n + 1}$ 项，比级数多一项。`,
            ),
          ),
          fromOne(
            1,
            n - 1,
            t(
              `It has only $${n - 1}$ terms, so it leaves out the last term $${terms[n - 1]!.toLatex()}$.`,
              `它只有 $${n - 1}$ 项，漏掉了末项 $${terms[n - 1]!.toLatex()}$。`,
            ),
          ),
          fromOne(
            2,
            n + 1,
            t(
              `At its lower limit $k = 2$ it gives $${ar}$: it starts at the second term and adds a term after the last one.`,
              `在下限 $k = 2$ 处它给出 $${ar}$：它从第二项开始，并在末项之后多加了一项。`,
            ),
          ),
          swapped,
        ];
        const exponent = correct.lo === 1 ? "k - 1" : "k";
        return sigmaChoice(
          rng,
          t(`Which sum equals $${series}$?`, `哪个和等于 $${series}$？`),
          correct,
          distractors,
          worked(
            [
              ratioStep(a, r),
              [
                "Match the first term and the number of terms",
                "核对首项和项数",
                `The series has $${n}$ terms. With exponent $${exponent}$, the lower limit $k = ${correct.lo}$ gives the first term $${a.toLatex()}$, and from $${correct.lo}$ to $${correct.hi}$ there are $${correct.hi} - ${correct.lo} + 1 = ${n}$ terms:`,
                `这个级数共 $${n}$ 项。指数为 $${exponent}$ 时，下限 $k = ${correct.lo}$ 给出首项 $${a.toLatex()}$，从 $${correct.lo}$ 到 $${correct.hi}$ 共 $${correct.hi} - ${correct.lo} + 1 = ${n}$ 项：`,
                `${series} = ${sumL(correct.lo, correct.hi, correct.body)}`,
              ],
            ],
            `Substitute the upper limit $k = ${correct.hi}$. It gives the last term of the series: $${geometricTerm(a, r, String(n - 1))} = ${terms[n - 1]!.toLatex()}$.`,
            `代入上限 $k = ${correct.hi}$，得到级数的末项：$${geometricTerm(a, r, String(n - 1))} = ${terms[n - 1]!.toLatex()}$。`,
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
  encompasses: [{ topic: "the-sum-of-the-first-n-terms-of-a-geometric-series", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSA.SSE.B.4"],
  intro: t(
    "You can write a geometric series in sigma notation, and you can add its first $n$ terms with $S_n = \\frac{a_1(1 - r^{n})}{1 - r}$. To evaluate a sum given in sigma notation, read the three numbers the formula needs from it: the first term, by substituting the lower limit; the ratio, which is the base of the power; and the number of terms.\n\nTake the sum of $5 \\cdot 2^{k-1}$ from $k = 1$ to $4$. The first term is $5 \\cdot 2^{0} = 5$, the ratio is $2$ and there are $4$ terms:\n\n$$\\sum_{k=1}^{4} 5 \\cdot 2^{k-1} = \\frac{5(1 - 2^{4})}{1 - 2} = 75$$\n\nIndeed $5 + 10 + 20 + 40 = 75$.",
    "你会用求和符号表示等比级数，也会用 $S_n = \\frac{a_1(1 - r^{n})}{1 - r}$ 求前 $n$ 项的和。要计算用求和符号给出的和，就从中读出公式需要的三个数：首项（代入下限）、公比（乘方的底数）和项数。\n\n取 $5 \\cdot 2^{k-1}$ 从 $k = 1$ 加到 $4$ 的和。首项是 $5 \\cdot 2^{0} = 5$，公比是 $2$，共 $4$ 项：\n\n$$\\sum_{k=1}^{4} 5 \\cdot 2^{k-1} = \\frac{5(1 - 2^{4})}{1 - 2} = 75$$\n\n确实 $5 + 10 + 20 + 40 = 75$。",
  ),
  knowledgePoints: [
    {
      id: "starting-at-one",
      title: t("Sums starting at $k = 1$", "从 $k = 1$ 开始的和"),
      explanation: t(
        "When the sum of $c \\cdot r^{k-1}$ runs from $k = 1$ to $n$, the first term is $c$ (at $k = 1$), the ratio is the base $r$ and there are $n$ terms:\n\n$$\\sum_{k=1}^{6} 4 \\cdot 3^{k-1} = \\frac{4(1 - 3^{6})}{1 - 3} = \\frac{4 \\cdot (-728)}{-2} = 1456$$\n\n> **Watch out.** The power in the formula is $r^{n}$, with $n$ the number of terms, even though the last term has $r^{n-1}$. Here it is $3^{6}$, not $3^{5}$.",
        "$c \\cdot r^{k-1}$ 从 $k = 1$ 加到 $n$ 时，首项是 $c$（$k = 1$ 时），公比是底数 $r$，共 $n$ 项：\n\n$$\\sum_{k=1}^{6} 4 \\cdot 3^{k-1} = \\frac{4(1 - 3^{6})}{1 - 3} = \\frac{4 \\cdot (-728)}{-2} = 1456$$\n\n> **注意。** 公式中的乘方是 $r^{n}$，$n$ 是项数，尽管末项是 $r^{n-1}$。这里是 $3^{6}$，不是 $3^{5}$。",
      ),
      generate(rng) {
        const { a, r, n } = someGeometricSeries(rng);
        const expr = sumL(1, n, geometricTerm(a, r, "k-1"));
        const check = lastTermCheck(a, r, n);
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: geometricSum(a, r, n),
          wrong: [geometricSum(a.mul(r), r, n), geometricSum(a, r, n - 1), geometricSum(a, r, n + 1), a.mul(r.pow(n - 1))],
          solution: worked(
            [
              [
                "Read the first term, the ratio and the number of terms",
                "读出首项、公比和项数",
                `Substitute $k = 1$ for the first term. The ratio is the base $${r.toLatex()}$, and $k$ runs from $1$ to $${n}$, so there are $${n}$ terms:`,
                `代入 $k = 1$ 得首项。公比是底数 $${r.toLatex()}$，$k$ 从 $1$ 到 $${n}$，共 $${n}$ 项：`,
                `a_1 = ${geometricTerm(a, r, "0")} = ${a.toLatex()}`,
              ],
              [
                "Use the sum formula",
                "用求和公式",
                "Substitute into the sum formula:",
                "代入求和公式：",
                `${expr} = ${workedSumL(a, r, n)}`,
              ],
            ],
            check.en,
            check["zh-CN"],
          ),
        });
      },
    },
    {
      id: "exponent-k",
      title: t("Sums of $c \\cdot r^{k}$", "$c \\cdot r^{k}$ 的和"),
      explanation: t(
        "When the exponent is $k$, find the first term by substituting the lower limit, and count the terms from $m$ to $n$ as $n - m + 1$:\n\n$$\\sum_{k=1}^{5} 2 \\cdot 3^{k} \\text{ has } a_1 = 6, \\ r = 3, \\ 5 \\text{ terms}: \\quad \\frac{6(1 - 3^{5})}{1 - 3} = 726$$\n\n$$\\sum_{k=0}^{5} 2 \\cdot 3^{k} \\text{ has } a_1 = 2, \\ r = 3, \\ 6 \\text{ terms}: \\quad \\frac{2(1 - 3^{6})}{1 - 3} = 728$$\n\n> **Watch out.** With exponent $k$, the coefficient $c$ is the first term only when the sum starts at $k = 0$. From $k = 1$ the first term is $cr$: here $2 \\cdot 3 = 6$, not $2$.",
        "指数是 $k$ 时，代入下限求出首项，从 $m$ 到 $n$ 的项数是 $n - m + 1$：\n\n$$\\sum_{k=1}^{5} 2 \\cdot 3^{k} \\text{ 中 } a_1 = 6, \\ r = 3, \\ \\text{共 } 5 \\text{ 项}: \\quad \\frac{6(1 - 3^{5})}{1 - 3} = 726$$\n\n$$\\sum_{k=0}^{5} 2 \\cdot 3^{k} \\text{ 中 } a_1 = 2, \\ r = 3, \\ \\text{共 } 6 \\text{ 项}: \\quad \\frac{2(1 - 3^{6})}{1 - 3} = 728$$\n\n> **注意。** 指数是 $k$ 时，只有和从 $k = 0$ 开始，系数 $c$ 才是首项。从 $k = 1$ 开始时首项是 $cr$：这里是 $2 \\cdot 3 = 6$，不是 $2$。",
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
          const check = lastTermCheck(a, r, count);
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
            answer: geometricSum(a, r, count),
            wrong: [geometricSum(lo === 0 ? c.mul(r) : c, r, count), geometricSum(a, r, count - 1), geometricSum(a, r, count + 1)],
            solution: worked(
              [
                [
                  "Find the first term",
                  "求首项",
                  `Substitute the lower limit $k = ${lo}$:`,
                  `代入下限 $k = ${lo}$：`,
                  `a_1 = ${geometricTerm(c, r, String(lo))} = ${a.toLatex()}`,
                ],
                [
                  "Count the terms",
                  "数出项数",
                  `The ratio is the base $${r.toLatex()}$, and $k$ runs from $${lo}$ to $${hi}$:`,
                  `公比是底数 $${r.toLatex()}$，$k$ 从 $${lo}$ 到 $${hi}$：`,
                  `${hi} - ${lo} + 1 = ${count}`,
                ],
                [
                  "Use the sum formula",
                  "用求和公式",
                  "Substitute into the sum formula:",
                  "代入求和公式：",
                  `${expr} = ${workedSumL(a, r, count)}`,
                ],
              ],
              check.en,
              check["zh-CN"],
            ),
          });
        }
      },
    },
    {
      id: "later-lower-limits",
      title: t("Later lower limits", "下限较大的和"),
      explanation: t(
        "The lower limit can be any integer, and the ratio a fraction. Take the sum of $64\\left(\\frac{1}{2}\\right)^{k}$ from $k = 3$ to $8$. The first term is $64\\left(\\frac{1}{2}\\right)^{3} = 8$, the ratio is $\\frac{1}{2}$ and there are $8 - 3 + 1 = 6$ terms, so\n\n$$\\sum_{k=3}^{8} 64\\left(\\frac{1}{2}\\right)^{k} = \\frac{8\\left(1 - \\left(\\frac{1}{2}\\right)^{6}\\right)}{1 - \\frac{1}{2}} = \\frac{63}{4}$$\n\n> **Watch out.** Both limits count, so there are $8 - 3 + 1 = 6$ terms, not $8 - 3 = 5$. The power in the formula is this number of terms, not the upper limit $8$.",
        "下限可以是任意整数，公比也可以是分数。取 $64\\left(\\frac{1}{2}\\right)^{k}$ 从 $k = 3$ 加到 $8$ 的和。首项是 $64\\left(\\frac{1}{2}\\right)^{3} = 8$，公比是 $\\frac{1}{2}$，共 $8 - 3 + 1 = 6$ 项，所以\n\n$$\\sum_{k=3}^{8} 64\\left(\\frac{1}{2}\\right)^{k} = \\frac{8\\left(1 - \\left(\\frac{1}{2}\\right)^{6}\\right)}{1 - \\frac{1}{2}} = \\frac{63}{4}$$\n\n> **注意。** 上下限都要算上，所以共 $8 - 3 + 1 = 6$ 项，不是 $8 - 3 = 5$ 项。公式中的乘方用的是这个项数，而不是上限 $8$。",
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
          const check = lastTermCheck(a, r, count);
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
            answer: geometricSum(a, r, count),
            wrong: [geometricSum(c, r, count), geometricSum(a, r, count - 1), geometricSum(a, r, hi), geometricSum(a, r, count + 1)],
            solution: worked(
              [
                [
                  "Find the first term",
                  "求首项",
                  `Substitute the lower limit $k = ${lo}$:`,
                  `代入下限 $k = ${lo}$：`,
                  `a_1 = ${geometricTerm(c, r, String(lo))} = ${a.toLatex()}`,
                ],
                [
                  "Count the terms",
                  "数出项数",
                  `The ratio is the base $${r.toLatex()}$, and $k$ runs from $${lo}$ to $${hi}$:`,
                  `公比是底数 $${r.toLatex()}$，$k$ 从 $${lo}$ 到 $${hi}$：`,
                  `${hi} - ${lo} + 1 = ${count}`,
                ],
                [
                  "Use the sum formula",
                  "用求和公式",
                  "Substitute into the sum formula:",
                  "代入求和公式：",
                  `${expr} = ${workedSumL(a, r, count)}`,
                ],
              ],
              check.en,
              check["zh-CN"],
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
  intro: t(
    "You can add the first $n$ terms of a geometric series, and you can solve an equation such as $3^{x} = 50$ with logarithms. Now the unknown is the number of terms $n$ itself. It sits in the exponent of the sum formula, so first isolate the power $r^{n}$, then solve for $n$: by writing both sides as powers of $r$, or by taking logarithms.\n\nHow many terms of $1 + 2 + 4 + \\cdots$ add to $255$? With $a_1 = 1$ and $r = 2$, the sum formula gives\n\n$$\\frac{2^{n} - 1}{2 - 1} = 255$$\n\n$$2^{n} = 256 = 2^{8}$$\n\nSo $n = 8$. Indeed $1 + 2 + 4 + \\cdots + 128 = 255$.",
    "你会求等比级数前 $n$ 项的和，也会用对数解 $3^{x} = 50$ 这样的方程。现在未知的是项数 $n$ 本身。它在求和公式的指数上，所以先分离出乘方 $r^{n}$，再解出 $n$：把两边写成 $r$ 的乘方，或者取对数。\n\n$1 + 2 + 4 + \\cdots$ 的前多少项之和为 $255$？$a_1 = 1$，$r = 2$，由求和公式得\n\n$$\\frac{2^{n} - 1}{2 - 1} = 255$$\n\n$$2^{n} = 256 = 2^{8}$$\n\n所以 $n = 8$。确实 $1 + 2 + 4 + \\cdots + 128 = 255$。",
  ),
  knowledgePoints: [
    {
      id: "the-number-of-terms-from-the-sum",
      title: t("The number of terms from the sum", "由和求项数"),
      explanation: t(
        "Substitute the sum into the formula and isolate the power $r^{n}$. For $r > 1$ it is convenient to write the formula as $S_n = \\frac{a_1(r^{n} - 1)}{r - 1}$, the same fraction with its top and bottom multiplied by $-1$. How many terms of $4 + 12 + 36 + \\cdots$ add to $4372$?\n\n$$\\frac{4(3^{n} - 1)}{3 - 1} = 4372$$\n\n$$3^{n} - 1 = 2186$$\n\n$$3^{n} = 2187 = 3^{7}$$\n\nSo $n = 7$.\n\n> **Watch out.** Isolate the power completely before reading off $n$. From $3^{n} - 1 = 2186$ the power is $3^{n} = 2187$, not $2186$, and $2186$ is not a power of $3$ at all.",
        "把和代入公式，分离出乘方 $r^{n}$。$r > 1$ 时，把公式写成 $S_n = \\frac{a_1(r^{n} - 1)}{r - 1}$ 更方便，它就是原来的分式分子分母同乘 $-1$。$4 + 12 + 36 + \\cdots$ 的前多少项之和为 $4372$？\n\n$$\\frac{4(3^{n} - 1)}{3 - 1} = 4372$$\n\n$$3^{n} - 1 = 2186$$\n\n$$3^{n} = 2187 = 3^{7}$$\n\n所以 $n = 7$。\n\n> **注意。** 先把乘方完全分离出来，再读出 $n$。由 $3^{n} - 1 = 2186$ 得 $3^{n} = 2187$，不是 $2186$；$2186$ 根本不是 $3$ 的乘方。",
      ),
      generate(rng) {
        for (;;) {
          const r = Q.of(rng.int(2, 5));
          const a = Q.of(rng.int(1, 9));
          const n = rng.int(4, 10);
          const S = geometricSum(a, r, n);
          if (S.cmp(Q.of(2_000_000)) > 0) continue;
          const series = openL(geometric(a, r, 3));
          const rL = r.toLatex();
          const gap = r.sub(Q.one);
          const top = a.eq(Q.one) ? `${rL}^{n} - 1` : `${a.toLatex()}(${rL}^{n} - 1)`;
          const left = gap.eq(Q.one) ? top : `\\frac{${top}}{${gap.toLatex()}}`;
          const isolate = [
            `${left} = ${S.toLatex()}`,
            `${rL}^{n} - 1 = ${r.pow(n).sub(Q.one).toLatex()}`,
            `${rL}^{n} = ${r.pow(n).toLatex()}`,
          ];
          const check = lastTermCheck(a, r, n);
          return numberProblem({
            prompt: t(
              `How many terms of the geometric series $${series}$ add to $${grouped(S)}$?`,
              `等比级数 $${series}$ 的前多少项之和为 $${grouped(S)}$？`,
            ),
            answer: n,
            solveFor: "n",
            wrong: [n - 1, n + 1, n + 2],
            solution: worked(
              [
                ratioStep(a, r),
                [
                  "Isolate the power",
                  "分离出乘方",
                  `Substitute $a_1 = ${a.toLatex()}$ and $r = ${rL}$ into $S_n = \\frac{a_1(r^{n} - 1)}{r - 1}$ and solve for $${rL}^{n}$:`,
                  `把 $a_1 = ${a.toLatex()}$、$r = ${rL}$ 代入 $S_n = \\frac{a_1(r^{n} - 1)}{r - 1}$，解出 $${rL}^{n}$：`,
                  ...isolate.filter((line, i) => i === 0 || line !== isolate[i - 1]),
                ],
                [
                  "Solve for $n$",
                  "解出 $n$",
                  `Write $${r.pow(n).toLatex()}$ as a power of $${rL}$ and compare the exponents:`,
                  `把 $${r.pow(n).toLatex()}$ 写成 $${rL}$ 的乘方，比较指数：`,
                  `${rL}^{n} = ${rL}^{${n}}`,
                  `n = ${n}`,
                ],
              ],
              `With $n = ${n}$ the last term is $a_{${n}} = ${a.mul(r.pow(n - 1)).toLatex()}$. ${check.en}`,
              `$n = ${n}$ 时末项是 $a_{${n}} = ${a.mul(r.pow(n - 1)).toLatex()}$。${check["zh-CN"]}`,
            ),
          });
        }
      },
    },
    {
      id: "a-sum-exceeding-a-value",
      title: t("A sum exceeding a value", "和超过某个值"),
      explanation: t(
        "To find the fewest terms whose sum is greater than a value, write the inequality, isolate $r^{n}$ and take logarithms. Dividing by $\\ln r > 0$ keeps the direction. For $16 + 24 + 36 + \\cdots$, with $r = 1.5$, and a sum greater than $1000$:\n\n$$\\frac{16(1.5^{n} - 1)}{0.5} > 1000$$\n\n$$1.5^{n} > 32.25$$\n\n$$n > \\frac{\\ln 32.25}{\\ln 1.5} \\approx 8.57$$\n\nThe least whole number above $8.57$ is $9$, so $9$ terms are needed.\n\n> **Watch out.** The number of terms is a whole number, so round **up** to the next integer, however small the decimal part is. Rounding to the nearest integer would turn $n > 8.2$ into $8$, and $8$ terms would not be enough.",
        "要求和大于某个值所需的最少项数，列出不等式，分离出 $r^{n}$，再取对数。除以 $\\ln r > 0$ 时不等号方向不变。对 $16 + 24 + 36 + \\cdots$（$r = 1.5$），要使和大于 $1000$：\n\n$$\\frac{16(1.5^{n} - 1)}{0.5} > 1000$$\n\n$$1.5^{n} > 32.25$$\n\n$$n > \\frac{\\ln 32.25}{\\ln 1.5} \\approx 8.57$$\n\n大于 $8.57$ 的最小整数是 $9$，所以需要 $9$ 项。\n\n> **注意。** 项数是整数，所以要**向上**取到下一个整数，不管小数部分多小。四舍五入会把 $n > 8.2$ 变成 $8$，而 $8$ 项是不够的。",
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
          const aL = a.eq(Q.one) ? "" : a.toLatex();
          const rhsL = rhs.isInteger() || terminates(rhs) ? dec(rhs) : rhs.toLatex();
          const lnL = rhs.isInteger() || terminates(rhs) ? rhsL : `\\left(${rhsL}\\right)`;
          const left = r.sub(Q.one).eq(Q.one) ? `${aL}(${rL}^{n} - 1)` : `\\frac{${aL}(${rL}^{n} - 1)}{${dec(r.sub(Q.one))}}`;
          const check = passCheck(a, r, n, T);
          const undo = undoSteps(r.sub(Q.one), a);
          return numberProblem({
            prompt: t(
              `What is the least number of terms of the geometric series $${series}$ whose sum is greater than $${grouped(T)}$?`,
              `等比级数 $${series}$ 至少要加多少项，和才大于 $${grouped(T)}$？`,
            ),
            answer: n,
            wrong: [n - 1, n + 1, Math.floor(x)],
            solution: worked(
              [
                [
                  "Write the inequality",
                  "列出不等式",
                  `Here $a_1 = ${a.toLatex()}$ and $r = ${rL}$. The sum of $n$ terms must be greater than $${grouped(T)}$:`,
                  `这里 $a_1 = ${a.toLatex()}$，$r = ${rL}$。$n$ 项之和必须大于 $${grouped(T)}$：`,
                  `${left} > ${T.toLatex()}`,
                ],
                ["Isolate the power", "分离出乘方", `${undo.en}:`, `${undo["zh-CN"]}：`, `${rL}^{n} > ${rhsL}`],
                [
                  "Take logarithms",
                  "取对数",
                  `Since $\\ln ${rL} > 0$, dividing by it keeps the direction, and $n$ is the least whole number above the result:`,
                  `因为 $\\ln ${rL} > 0$，除以它时不等号方向不变；$n$ 是大于结果的最小整数：`,
                  `n > \\frac{\\ln ${lnL}}{\\ln ${rL}} \\approx ${x.toFixed(2)}`,
                  `n = ${n}`,
                ],
              ],
              check.en,
              check["zh-CN"],
            ),
          });
        }
      },
    },
    {
      id: "sums-with-ratios-less-than-one",
      title: t("Ratios between $0$ and $1$", "公比在 $0$ 与 $1$ 之间"),
      explanation: t(
        "When $0 < r < 1$, the sums grow towards $\\frac{a_1}{1 - r}$ but never reach it. To find when the sum passes a value close to that, isolate $r^{n}$ and take logarithms. For $50 + 25 + 12.5 + \\cdots$ and a sum greater than $99.9$:\n\n$$\\frac{50(1 - 0.5^{n})}{0.5} > 99.9$$\n\n$$0.5^{n} < 0.001$$\n\n$$n > \\frac{\\ln 0.001}{\\ln 0.5} \\approx 9.97$$\n\nSo $10$ terms are needed.\n\n> **Watch out.** Here $\\ln r < 0$, so dividing by it **reverses** the inequality: $0.5^{n} < 0.001$ leads to $n > 9.97$. Keeping the sign as it was would give $n < 9.97$, as if fewer terms were better.",
        "当 $0 < r < 1$ 时，和逐渐增大，趋近于 $\\frac{a_1}{1 - r}$ 但永远达不到。要求和何时超过接近它的某个值，分离出 $r^{n}$ 再取对数。对 $50 + 25 + 12.5 + \\cdots$，要使和大于 $99.9$：\n\n$$\\frac{50(1 - 0.5^{n})}{0.5} > 99.9$$\n\n$$0.5^{n} < 0.001$$\n\n$$n > \\frac{\\ln 0.001}{\\ln 0.5} \\approx 9.97$$\n\n所以需要 $10$ 项。\n\n> **注意。** 这里 $\\ln r < 0$，所以除以它时不等号要**改变方向**：由 $0.5^{n} < 0.001$ 得 $n > 9.97$。如果不改变方向，就会得到 $n < 9.97$，好像项数越少越好。",
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
          const check = passCheck(a, r, n, T);
          return numberProblem({
            prompt: t(
              `What is the least number of terms of the geometric series $${series}$ whose sum is greater than $${TL}$?`,
              `等比级数 $${series}$ 至少要加多少项，和才大于 $${TL}$？`,
            ),
            answer: n,
            wrong: [n - 1, n + 1, Math.ceil(T.div(a).toNumber())],
            solution: worked(
              [
                [
                  "Write the inequality",
                  "列出不等式",
                  `Here $a_1 = ${a.toLatex()}$ and $r = ${r.toLatex()}$. The sum of $n$ terms must be greater than $${TL}$:`,
                  `这里 $a_1 = ${a.toLatex()}$，$r = ${r.toLatex()}$。$n$ 项之和必须大于 $${TL}$：`,
                  `\\frac{${a.toLatex()}\\left(1 - ${base(r)}^{n}\\right)}{1 - ${r.toLatex()}} > ${TL}`,
                ],
                [
                  "Isolate the power",
                  "分离出乘方",
                  `Multiply by $1 - ${r.toLatex()}$ and divide by $${a.toLatex()}$. Then subtract $1$ and multiply by $-1$, which reverses the inequality:`,
                  `乘以 $1 - ${r.toLatex()}$，除以 $${a.toLatex()}$。再减去 $1$ 并乘以 $-1$，不等号改变方向：`,
                  `1 - ${base(r)}^{n} > ${T.div(L).toLatex()}`,
                  `${base(r)}^{n} < ${bound.toLatex()}`,
                ],
                [
                  "Take logarithms",
                  "取对数",
                  `Since $\\ln ${r.toLatex()} < 0$, dividing by it reverses the inequality again, and $n$ is the least whole number above the result:`,
                  `因为 $\\ln ${r.toLatex()} < 0$，除以它时不等号再次改变方向；$n$ 是大于结果的最小整数：`,
                  `n > \\frac{\\ln ${bound.toLatex()}}{\\ln ${r.toLatex()}} \\approx ${x.toFixed(2)}`,
                  `n = ${n}`,
                ],
              ],
              check.en,
              check["zh-CN"],
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

/** approxL writes a positive value after its relation sign: exactly when it is an integer, else to two decimal places. */
const approxL = (v: Q) => (v.isInteger() ? `= ${v.toLatex()}` : `\\approx ${dec(roundQ(v, 2))}`);

/**
 * undoSteps says how to isolate r^n - 1 from (a(r^n - 1))/gap: multiply by the gap and divide by a, leaving out a factor of
 * 1, then add 1.
 */
function undoSteps(gap: Q, a: Q): Text {
  const en = [...(gap.eq(Q.one) ? [] : [`multiply by $${dec(gap)}$`]), ...(a.eq(Q.one) ? [] : [`divide by $${a.toLatex()}$`]), "add $1$"];
  const zh = [...(gap.eq(Q.one) ? [] : [`乘以 $${dec(gap)}$`]), ...(a.eq(Q.one) ? [] : [`除以 $${a.toLatex()}$`]), "再加 $1$"];
  const sentence = listed(en).en;
  return t(`${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}`, zh.join("，"));
}

/** passCheck checks the least number of terms n whose sum passes T: the sum of n - 1 terms does not, and the sum of n terms does. */
function passCheck(a: Q, r: Q, n: number, T: Q): Text {
  const [before, after] = [geometricSum(a, r, n - 1), geometricSum(a, r, n)];
  const target = T.isInteger() ? T.toLatex() : dec(T);
  return t(
    `Add $${n - 1}$ and $${n}$ terms with the sum formula. $S_{${n - 1}} ${approxL(before)}$ is not greater than $${target}$, but $S_{${n}} ${approxL(after)}$ is.`,
    `用求和公式分别求 $${n - 1}$ 项和 $${n}$ 项之和。$S_{${n - 1}} ${approxL(before)}$ 不大于 $${target}$，而 $S_{${n}} ${approxL(after)}$ 大于它。`,
  );
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
  intro: t(
    "You can model an amount that grows by a fixed percentage with an exponential function, and you can add a geometric series or solve for its number of terms. When a question asks for a **total** of such amounts, such as the pay over several years or the distance run over several weeks, the amounts are the terms of a geometric series and the total is its sum.\n\nA runner runs $10$ km in the first week and $10\\%$ more each week after that. The weekly distances $10, 11, 12.1, \\ldots$ have ratio $1.1$, so the total over $4$ weeks is\n\n$$S_4 = \\frac{10(1.1^{4} - 1)}{1.1 - 1} = 46.41 \\text{ km}$$\n\nIndeed $10 + 11 + 12.1 + 13.31 = 46.41$.",
    "你会用指数函数为按固定百分比增长的量建模，也会求等比级数的和或它的项数。当问题问的是这些量的**总和**，例如几年的工资总额或几周跑的总路程时，这些量就是等比级数的项，总和就是级数的和。\n\n一位跑步者第一周跑 $10$ 千米，之后每周比前一周多跑 $10\\%$。每周的路程 $10, 11, 12.1, \\ldots$ 的公比是 $1.1$，所以 $4$ 周的总路程是\n\n$$S_4 = \\frac{10(1.1^{4} - 1)}{1.1 - 1} = 46.41 \\text{ 千米}$$\n\n确实 $10 + 11 + 12.1 + 13.31 = 46.41$。",
  ),
  knowledgePoints: [
    {
      id: "growing-totals",
      title: t("Totals of growing amounts", "增长量的总和"),
      explanation: t(
        "An amount that grows by $p\\%$ each period is multiplied by $1 + \\frac{p}{100}$, so the amounts form a geometric sequence. A salary of $\\$40{,}000$ with a $3\\%$ raise each year pays $40000 \\cdot 1.03^{k-1}$ in year $k$, and over $10$ years\n\n$$S_{10} = \\frac{40000(1.03^{10} - 1)}{1.03 - 1} \\approx 458{,}555.17 \\text{ dollars}$$\n\n> **Watch out.** The amount in year $k$ has been raised $k - 1$ times, so year $10$ pays $40000 \\cdot 1.03^{9}$, while the sum formula uses $1.03^{10}$. Multiplying the first amount by the number of years leaves out the raises.",
        "每期增长 $p\\%$ 的量每期乘以 $1 + \\frac{p}{100}$，所以这些量构成等比数列。年薪 $40{,}000$ 美元、每年加薪 $3\\%$，第 $k$ 年的工资是 $40000 \\cdot 1.03^{k-1}$，$10$ 年合计\n\n$$S_{10} = \\frac{40000(1.03^{10} - 1)}{1.03 - 1} \\approx 458{,}555.17 \\text{ 美元}$$\n\n> **注意。** 第 $k$ 年的量已经增长了 $k - 1$ 次，所以第 $10$ 年的工资是 $40000 \\cdot 1.03^{9}$，而求和公式中用的是 $1.03^{10}$。用第一年的量乘以年数，就漏掉了加薪。",
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
          const last = Q.of(S).mul(g.pow(n - 1));
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
            solution: worked(
              [
                [
                  "Find the ratio",
                  "求公比",
                  `A rise of $${R}\\%$ multiplies each year's amount by the same number, so the yearly amounts form a geometric sequence with $a_1 = ${grouped(S)}$ and ratio`,
                  `增长 $${R}\\%$ 就是每年乘以同一个数，所以每年的量构成等比数列，$a_1 = ${grouped(S)}$，公比为`,
                  `r = 1 + ${dec(Q.of(R, 100))} = ${gL}`,
                ],
                [
                  "Add the terms",
                  "求各项之和",
                  `Add $${n}$ terms with the sum formula:`,
                  `用求和公式求 $${n}$ 项之和：`,
                  `S_{${n}} = \\frac{${S}(${gL}^{${n}} - 1)}{${gL} - 1} = \\frac{${S}(${gL}^{${n}} - 1)}{${dec(Q.of(R, 100))}} \\approx ${grouped(answer)}`,
                ],
              ],
              `The $${n}$ amounts rise from $${grouped(S)}$ to $${grouped(S)} \\cdot ${gL}^{${n - 1}} \\approx ${grouped(roundQ(last, 0))}$. So the total must lie between $${n} \\cdot ${grouped(S)} = ${grouped(n * S)}$ and $${n} \\cdot ${grouped(roundQ(last, 0))} = ${grouped(roundQ(last, 0).mul(Q.of(n)))}$, and $${grouped(answer)}$ does.`,
              `这 $${n}$ 个量从 $${grouped(S)}$ 增长到 $${grouped(S)} \\cdot ${gL}^{${n - 1}} \\approx ${grouped(roundQ(last, 0))}$。所以总和必须介于 $${n} \\cdot ${grouped(S)} = ${grouped(n * S)}$ 与 $${n} \\cdot ${grouped(roundQ(last, 0))} = ${grouped(roundQ(last, 0).mul(Q.of(n)))}$ 之间，$${grouped(answer)}$ 正是如此。`,
            ),
          });
        }
      },
    },
    {
      id: "bouncing-balls",
      title: t("Bouncing balls", "弹跳的小球"),
      explanation: t(
        "A ball dropped from height $h$ rebounds to a fraction $r$ of its previous height each time. Until it hits the ground for the $n$th time it falls $h$ once, and then rises and falls again for each of the $n - 1$ bounces:\n\n$$D = h + 2\\left(hr + hr^{2} + \\cdots + hr^{n-1}\\right)$$\n\nDropped from $16$ m with $r = \\frac{1}{2}$, by the $4$th hit it has traveled $16 + 2(8 + 4 + 2) = 44$ m.\n\n> **Watch out.** Only the first drop is counted once. Every bounce goes up and comes down again, so its height counts twice, and by the $n$th hit there have been $n - 1$ bounces, not $n$.",
        "从高度 $h$ 落下的小球，每次反弹到前一次高度的 $r$ 倍。到第 $n$ 次落地为止，它先下落 $h$ 一次，之后 $n - 1$ 次反弹每次都上升再下落：\n\n$$D = h + 2\\left(hr + hr^{2} + \\cdots + hr^{n-1}\\right)$$\n\n从 $16$ 米高处落下、$r = \\frac{1}{2}$ 时，到第 $4$ 次落地共经过 $16 + 2(8 + 4 + 2) = 44$ 米。\n\n> **注意。** 只有第一次下落算一次。每次反弹都是上去再下来，所以反弹高度要算两次；到第 $n$ 次落地时共反弹了 $n - 1$ 次，不是 $n$ 次。",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.pick([Q.of(1, 2), Q.of(3, 4), Q.of(2, 3), Q.of(3, 5), Q.of(4, 5), Q.of(1, 3)]);
          const n = rng.int(3, 7);
          const h = rng.int(1, 6) * Number(r.d) ** (n - 1);
          if (h > 500) continue;
          const H = Q.of(h);
          const heights = geometric(H.mul(r), r, n - 1);
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
            solution: worked(
              [
                [
                  "Add the bounce heights",
                  "求反弹高度之和",
                  `Before the ${ordinal(n)} hit the ball bounces $${n - 1}$ times, each time to $${pct}$ of the height before. The heights are ${inlines(heights).en}:`,
                  `第 $${n}$ 次落地前小球反弹 $${n - 1}$ 次，每次都到前一次高度的 $${pct}$。这些高度是 ${inlines(heights)["zh-CN"]}：`,
                  `${listL(heights)} = ${up.toLatex()}`,
                ],
                [
                  "Add the distances",
                  "求总路程",
                  `The ball falls $${h}$ m once, and goes up and down each bounce height:`,
                  `小球先下落 $${h}$ 米一次，每个反弹高度都上去再下来：`,
                  `D = ${h} + 2 \\cdot ${up.toLatex()} = ${D.toLatex()}`,
                ],
              ],
              `Add the bounce heights with the sum formula instead, with $a_1 = ${H.mul(r).toLatex()}$, $r = ${pct}$ and $${n - 1}$ terms: $${workedSumL(H.mul(r), r, n - 1)}$. Then $${h} + 2 \\cdot ${up.toLatex()} = ${D.toLatex()}$ again.`,
              `改用求和公式求反弹高度之和，$a_1 = ${H.mul(r).toLatex()}$，$r = ${pct}$，共 $${n - 1}$ 项：$${workedSumL(H.mul(r), r, n - 1)}$。于是又得 $${h} + 2 \\cdot ${up.toLatex()} = ${D.toLatex()}$。`,
            ),
          });
        }
      },
    },
    {
      id: "when-a-total-is-reached",
      title: t("When a total is reached", "总和何时达到目标"),
      explanation: t(
        "To find when a growing total first passes a target, solve the inequality that the sum $S_n$ is greater than the target, with logarithms. A website has $500$ visitors on its first day and $20\\%$ more each day. When does the total first pass $20{,}000$?\n\n$$\\frac{500(1.2^{n} - 1)}{0.2} > 20000$$\n\n$$1.2^{n} > 9$$\n\n$$n > \\frac{\\ln 9}{\\ln 1.2} \\approx 12.05$$\n\nThe total first passes $20{,}000$ on day $13$.\n\n> **Watch out.** The question is about the **total**, so use the sum $S_n$, not one day's amount $500 \\cdot 1.2^{n-1}$. A single day passes $20{,}000$ visitors only on day $22$.",
        "要求增长的总和何时首次超过目标，就用对数解不等式：和 $S_n$ 大于目标。一个网站第一天有 $500$ 位访客，之后每天比前一天多 $20\\%$。总访客数何时首次超过 $20{,}000$？\n\n$$\\frac{500(1.2^{n} - 1)}{0.2} > 20000$$\n\n$$1.2^{n} > 9$$\n\n$$n > \\frac{\\ln 9}{\\ln 1.2} \\approx 12.05$$\n\n总访客数在第 $13$ 天首次超过 $20{,}000$。\n\n> **注意。** 问的是**总和**，所以要用和 $S_n$，而不是某一天的人数 $500 \\cdot 1.2^{n-1}$。单日访客要到第 $22$ 天才超过 $20{,}000$。",
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
          const lnL = terminates(rhs) ? rhsL : `\\left(${rhsL}\\right)`;
          const check = passCheck(Q.of(a), g, n, Q.of(T));
          return numberProblem({
            prompt: t(
              `A website has $${a}$ visitors on its first day, and each day it has $${R}\\%$ more visitors than the day before. On which day does the total number of visitors first exceed $${grouped(T)}$?`,
              `一个网站第一天有 $${a}$ 位访客，之后每天的访客都比前一天多 $${R}\\%$。总访客数在第几天首次超过 $${grouped(T)}$？`,
            ),
            answer: n,
            wrong: [n - 1, n + 1, ...(daily === undefined ? [] : [daily])],
            solution: worked(
              [
                [
                  "Write the inequality",
                  "列出不等式",
                  `The daily visitors form a geometric sequence with $a_1 = ${a}$ and $r = ${gL}$. The total after $n$ days must be greater than $${grouped(T)}$:`,
                  `每天的访客数构成等比数列，$a_1 = ${a}$，$r = ${gL}$。$n$ 天的总数必须大于 $${grouped(T)}$：`,
                  `\\frac{${a}(${gL}^{n} - 1)}{${dec(g.sub(Q.one))}} > ${T}`,
                ],
                [
                  "Isolate the power",
                  "分离出乘方",
                  `Multiply by $${dec(g.sub(Q.one))}$, divide by $${a}$ and add $1$:`,
                  `乘以 $${dec(g.sub(Q.one))}$，除以 $${a}$，再加 $1$：`,
                  `${gL}^{n} > ${rhsL}`,
                ],
                [
                  "Take logarithms",
                  "取对数",
                  `Since $\\ln ${gL} > 0$, dividing by it keeps the direction, and the day is the least whole number above the result:`,
                  `因为 $\\ln ${gL} > 0$，除以它时不等号方向不变；所求的天数是大于结果的最小整数：`,
                  `n > \\frac{\\ln ${lnL}}{\\ln ${gL}} \\approx ${x.toFixed(2)}`,
                  `n = ${n}`,
                ],
              ],
              check.en,
              check["zh-CN"],
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
  intro: t(
    "You can find what one amount grows to with compound interest, $P(1 + i)^{t}$, and you can add a geometric series. A savings plan makes many deposits, and each one earns interest for a different number of years. The balance is the sum of what they have each grown to, and these amounts form a geometric series with ratio $1 + i$.\n\nDeposit $\\$100$ at the end of each year at $10\\%$. Right after the $3$rd deposit, the three deposits have grown for $2$, $1$ and $0$ years:\n\n$$100 \\cdot 1.1^{2} + 100 \\cdot 1.1 + 100 = 121 + 110 + 100 = 331$$\n\nThe sum formula gives the same balance: $\\frac{100(1.1^{3} - 1)}{0.1} = 331$.",
    "你会用复利公式 $P(1 + i)^{t}$ 求一笔钱增长到多少，也会求等比级数的和。储蓄计划要存很多笔钱，每笔计息的年数都不同。余额是各笔存款增长后的总和，这些量构成公比为 $1 + i$ 的等比级数。\n\n每年年末存入 $100$ 美元，年利率 $10\\%$。第 $3$ 次存款刚存入时，三笔存款分别计息 $2$ 年、$1$ 年和 $0$ 年：\n\n$$100 \\cdot 1.1^{2} + 100 \\cdot 1.1 + 100 = 121 + 110 + 100 = 331$$\n\n求和公式给出同样的余额：$\\frac{100(1.1^{3} - 1)}{0.1} = 331$。",
  ),
  knowledgePoints: [
    {
      id: "deposits-at-the-end-of-each-year",
      title: t("Deposits at the end of each year", "每年年末存款"),
      explanation: t(
        "Deposit $P$ at the end of each year into an account that pays $i$ interest a year, compounded annually. Right after the $n$th deposit, the last deposit has earned nothing, the one before it one year of interest, and the first $n - 1$ years:\n\n$$A = P + P(1 + i) + \\cdots + P(1 + i)^{n-1} = \\frac{P\\big((1 + i)^{n} - 1\\big)}{i}$$\n\nDepositing $\\$1000$ a year at $5\\%$ for $10$ years gives $\\frac{1000(1.05^{10} - 1)}{0.05} \\approx \\$12{,}577.89$.\n\n> **Watch out.** Right after the $n$th deposit the first deposit has earned interest for $n - 1$ years, not $n$, and the newest one for none. Multiplying every deposit by $(1 + i)^{n}$ counts interest that has not been paid.",
        "每年年末向年利率为 $i$、按年复利计息的账户存入 $P$。第 $n$ 次存款刚存入时，最后一笔还没有利息，倒数第二笔有一年的利息，第一笔有 $n - 1$ 年的利息：\n\n$$A = P + P(1 + i) + \\cdots + P(1 + i)^{n-1} = \\frac{P\\big((1 + i)^{n} - 1\\big)}{i}$$\n\n每年存 $1000$ 美元、年利率 $5\\%$、存 $10$ 年，得到 $\\frac{1000(1.05^{10} - 1)}{0.05} \\approx 12{,}577.89$ 美元。\n\n> **注意。** 第 $n$ 次存款刚存入时，第一笔存款计息 $n - 1$ 年，不是 $n$ 年，最新的一笔还没有利息。把每笔存款都乘以 $(1 + i)^{n}$，就多算了还没付的利息。",
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
          const iL = dec(Q.of(R, 100));
          const high = roundQ(Q.of(n * P).mul(g.pow(n - 1)), 2);
          return numberProblem({
            prompt: t(
              `At the end of each year, $${grouped(P)}$ dollars is deposited into an account that pays $${R}\\%$ interest per year, compounded annually. Find the balance right after the $${n}$th deposit, in dollars, to the nearest cent.`,
              `每年年末向一个年利率为 $${R}\\%$、按年复利计息的账户存入 $${grouped(P)}$ 美元。求第 $${n}$ 次存款刚存入后的余额（单位：美元，精确到分）。`,
            ),
            answer,
            form: "decimal",
            wrong: [Q.of(n * P), roundQ(exact.mul(g), 2), roundQ(Q.of(n * P).mul(g.pow(n)), 2), roundQ(geometricSum(Q.of(P), g, n - 1), 2)],
            solution: worked(
              [
                [
                  "Write the balance as a series",
                  "把余额写成级数",
                  `Right after deposit $${n}$, the deposits have grown for $0, 1, \\ldots, ${n - 1}$ years:`,
                  `第 $${n}$ 次存款刚存入时，各笔存款分别计息 $0, 1, \\ldots, ${n - 1}$ 年：`,
                  `A = ${P} + ${P} \\cdot ${gL} + \\cdots + ${P} \\cdot ${gL}^{${n - 1}}`,
                ],
                [
                  "Add the series",
                  "求级数的和",
                  `It is a geometric series with $a_1 = ${P}$, $r = ${gL}$ and $${n}$ terms:`,
                  `这是一个等比级数，$a_1 = ${P}$，$r = ${gL}$，共 $${n}$ 项：`,
                  `A = \\frac{${P}(${gL}^{${n}} - 1)}{${gL} - 1} = \\frac{${P}(${gL}^{${n}} - 1)}{${iL}} \\approx ${money(answer)}`,
                ],
              ],
              `The $${n}$ deposits add to $${n} \\cdot ${grouped(P)} = ${grouped(n * P)}$ without interest, and to less than $${n} \\cdot ${P} \\cdot ${gL}^{${n - 1}} \\approx ${money(high)}$ if every one had earned as long as the first. The balance $${money(answer)}$ lies between the two.`,
              `$${n}$ 笔存款不计利息共 $${n} \\cdot ${grouped(P)} = ${grouped(n * P)}$；如果每笔都和第一笔计息一样久，就是 $${n} \\cdot ${P} \\cdot ${gL}^{${n - 1}} \\approx ${money(high)}$，实际余额比它少。余额 $${money(answer)}$ 介于两者之间。`,
            ),
          });
        }
      },
    },
    {
      id: "deposits-at-the-start-of-each-year",
      title: t("Deposits at the start of each year", "每年年初存款"),
      explanation: t(
        "When each deposit is made at the start of the year, every deposit earns one more year of interest by the end of year $n$, so the balance is multiplied by $1 + i$:\n\n$$A = P(1 + i) + P(1 + i)^{2} + \\cdots + P(1 + i)^{n} = \\frac{P(1 + i)\\big((1 + i)^{n} - 1\\big)}{i}$$\n\nDepositing $\\$1000$ at the start of each year at $5\\%$ gives $\\frac{1000 \\cdot 1.05(1.05^{10} - 1)}{0.05} \\approx \\$13{,}206.79$ at the end of $10$ years.\n\n> **Watch out.** A deposit made at the start of a year earns interest for that year too, so the first term is $P(1 + i)$, not $P$. Using the end-of-year formula leaves out one year of interest on every deposit.",
        "如果每笔存款都在年初存入，到第 $n$ 年年末时每笔存款都多计一年利息，所以余额要乘以 $1 + i$：\n\n$$A = P(1 + i) + P(1 + i)^{2} + \\cdots + P(1 + i)^{n} = \\frac{P(1 + i)\\big((1 + i)^{n} - 1\\big)}{i}$$\n\n每年年初存 $1000$ 美元、年利率 $5\\%$，$10$ 年后年末的余额为 $\\frac{1000 \\cdot 1.05(1.05^{10} - 1)}{0.05} \\approx 13{,}206.79$ 美元。\n\n> **注意。** 年初存入的钱当年也计息，所以首项是 $P(1 + i)$，不是 $P$。用年末存款的公式，就让每笔存款都少算了一年利息。",
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
          const iL = dec(Q.of(R, 100));
          const end = roundQ(geometricSum(Q.of(P), g, n), 2);
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
            solution: worked(
              [
                [
                  "Write the balance as a series",
                  "把余额写成级数",
                  `At the end of year $${n}$, the deposits have grown for $${n}, ${n - 1}, \\ldots, 1$ years:`,
                  `到第 $${n}$ 年年末，各笔存款分别计息 $${n}, ${n - 1}, \\ldots, 1$ 年：`,
                  `A = ${P} \\cdot ${gL} + ${P} \\cdot ${gL}^{2} + \\cdots + ${P} \\cdot ${gL}^{${n}}`,
                ],
                [
                  "Add the series",
                  "求级数的和",
                  `It is a geometric series with $a_1 = ${P} \\cdot ${gL}$, $r = ${gL}$ and $${n}$ terms:`,
                  `这是一个等比级数，$a_1 = ${P} \\cdot ${gL}$，$r = ${gL}$，共 $${n}$ 项：`,
                  `A = \\frac{${P} \\cdot ${gL}(${gL}^{${n}} - 1)}{${gL} - 1} = \\frac{${P} \\cdot ${gL}(${gL}^{${n}} - 1)}{${iL}} \\approx ${money(answer)}`,
                ],
              ],
              `With deposits at the end of each year instead, the balance would be $\\frac{${P}(${gL}^{${n}} - 1)}{${iL}} \\approx ${money(end)}$. Each deposit here is a year earlier and earns one more year of interest, so multiply by $${gL}$: $${money(end)} \\cdot ${gL} \\approx ${money(answer)}$.`,
              `如果改为每年年末存入，余额是 $\\frac{${P}(${gL}^{${n}} - 1)}{${iL}} \\approx ${money(end)}$。这里每笔存款早存一年，多计一年利息，所以乘以 $${gL}$：$${money(end)} \\cdot ${gL} \\approx ${money(answer)}$。`,
            ),
          });
        }
      },
    },
    {
      id: "the-deposit-needed",
      title: t("The deposit needed for a goal", "达到目标所需的存款"),
      explanation: t(
        "To reach a goal $A$ with equal deposits at the end of each year, solve the balance formula for $P$:\n\n$$P = \\frac{A \\cdot i}{(1 + i)^{n} - 1}$$\n\nTo have $\\$20{,}000$ after $10$ yearly deposits at $5\\%$, deposit $\\frac{20000 \\cdot 0.05}{1.05^{10} - 1} \\approx \\$1590.09$ a year.\n\n> **Watch out.** Do not divide the goal by the number of years: interest pays part of the goal, so the deposit is less than $\\frac{A}{n}$. Round only at the end, since rounding $1.05^{10}$ early changes the cents.",
        "要用每年年末等额存款达到目标 $A$，由余额公式解出 $P$：\n\n$$P = \\frac{A \\cdot i}{(1 + i)^{n} - 1}$$\n\n年利率 $5\\%$、存 $10$ 年后要有 $20{,}000$ 美元，每年应存 $\\frac{20000 \\cdot 0.05}{1.05^{10} - 1} \\approx 1590.09$ 美元。\n\n> **注意。** 不要用目标除以年数：利息承担了目标的一部分，所以每期存款比 $\\frac{A}{n}$ 少。只在最后取近似值，过早把 $1.05^{10}$ 取近似会改变分位上的数。",
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
          const iL = dec(Q.of(R, 100));
          const back = roundQ(geometricSum(answer, g, n), 2);
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
            solution: worked(
              [
                [
                  "Write the balance with $P$ unknown",
                  "写出含未知数 $P$ 的余额",
                  `The balance right after the $${n}$th deposit must be the goal:`,
                  `第 $${n}$ 次存款刚存入后的余额必须等于目标：`,
                  `\\frac{P(${gL}^{${n}} - 1)}{${iL}} = ${A}`,
                ],
                [
                  "Solve for $P$",
                  "解出 $P$",
                  `Multiply by $${iL}$ and divide by $${gL}^{${n}} - 1$:`,
                  `乘以 $${iL}$，再除以 $${gL}^{${n}} - 1$：`,
                  `P = \\frac{${A} \\cdot ${iL}}{${gL}^{${n}} - 1} \\approx ${money(answer)}`,
                ],
              ],
              `Put the deposit back into the balance formula: $\\frac{${money(answer)}(${gL}^{${n}} - 1)}{${iL}} \\approx ${money(back)}$. This gives back the goal of $${grouped(A)}$, up to the rounding of the deposit to the nearest cent.`,
              `把每期存款代回余额公式：$\\frac{${money(answer)}(${gL}^{${n}} - 1)}{${iL}} \\approx ${money(back)}$。除去每期存款取整到分带来的差别，这就是目标 $${grouped(A)}$。`,
            ),
          });
        }
      },
    },
  ],
};

// The binomial theorem.

/** pascalFigure writes rows 0 to 6 of Pascal's triangle, with the row number n on the left; the entries listed as [row, k] in marked are highlighted, and axis draws the dashed line of symmetry. */
function pascalFigure(marked: readonly (readonly [number, number])[], alt: Text, axis = false): Figure {
  const [cx, dx, dy, top] = [175, 30, 26, 22];
  let body = axis ? `<line x1="${cx}" y1="${top - 14}" x2="${cx}" y2="${top + 6 * dy + 10}" stroke-dasharray="4 3" stroke-width="1"/>` : "";
  for (let n = 0; n <= 6; n++) {
    const y = top + n * dy;
    body += `<text x="22" y="${y + 4}" stroke="none" fill="currentColor" font-size="10" font-style="italic">n = ${n}</text>`;
    for (let k = 0; k <= n; k++) {
      const x = cx + (k - n / 2) * dx;
      const hit = marked.some(([r, c]) => r === n && c === k);
      if (hit) body += `<circle class="accent" cx="${x}" cy="${y}" r="11" stroke-width="2"/>`;
      body += `<text x="${x}" y="${y + 4}" stroke="none" fill="currentColor">${choose(n, k)}</text>`;
    }
  }
  return { svg: svgDocument(top + 6 * dy + 16, body), alt };
}

/** pascalsTriangleAndTheBinomialCoefficients connects the entries of Pascal's triangle to binomial coefficients. */
export const pascalsTriangleAndTheBinomialCoefficients: TopicDef = {
  id: "pascals-triangle-and-the-binomial-coefficients",
  title: t("Pascal's Triangle and the Binomial Coefficients", "杨辉三角与二项式系数"),
  summary: t(
    "Read the entries of Pascal's triangle as $\\binom{n}{k}$, and use Pascal's rule $\\binom{n}{k} + \\binom{n}{k+1} = \\binom{n+1}{k+1}$ and the symmetry $\\binom{n}{k} = \\binom{n}{n-k}$.",
    "把杨辉三角中的数读作 $\\binom{n}{k}$，并运用帕斯卡法则 $\\binom{n}{k} + \\binom{n}{k+1} = \\binom{n+1}{k+1}$ 和对称性 $\\binom{n}{k} = \\binom{n}{n-k}$。",
  ),
  prerequisites: ["combinations", "expanding-binomials-using-pascals-triangle"],
  encompasses: [{ topic: "combinations", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSA.APR.C.5"],
  intro: t(
    "You can count combinations with $\\binom{n}{k} = \\frac{n!}{k!\\,(n - k)!}$, and you can expand $(a + b)^{n}$ with a row of Pascal's triangle. These are the same numbers: the entries of Pascal's triangle are the binomial coefficients. So any entry can be found without building the rows above it, and facts about the triangle become facts about $\\binom{n}{k}$.\n\nRow $4$ of the triangle is $1, 4, 6, 4, 1$. Counting gives the same numbers:\n\n$$\\binom{4}{0} = 1, \\quad \\binom{4}{1} = 4, \\quad \\binom{4}{2} = 6, \\quad \\binom{4}{3} = 4, \\quad \\binom{4}{4} = 1$$\n\nFor example, there are $\\frac{4!}{2!\\,2!} = 6$ ways to choose $2$ of $4$ letters, and $6$ is the middle entry of row $4$.",
    "你会用 $\\binom{n}{k} = \\frac{n!}{k!\\,(n - k)!}$ 计算组合数，也会用杨辉三角的一行展开 $(a + b)^{n}$。它们是同一组数：杨辉三角中的数就是二项式系数。所以不必写出上面各行就能求出任意一个数，杨辉三角的性质也就成了 $\\binom{n}{k}$ 的性质。\n\n杨辉三角的第 $4$ 行是 $1, 4, 6, 4, 1$。用组合数计算得到同样的数：\n\n$$\\binom{4}{0} = 1, \\quad \\binom{4}{1} = 4, \\quad \\binom{4}{2} = 6, \\quad \\binom{4}{3} = 4, \\quad \\binom{4}{4} = 1$$\n\n例如，从 $4$ 个字母中选 $2$ 个有 $\\frac{4!}{2!\\,2!} = 6$ 种选法，而 $6$ 正是第 $4$ 行中间的数。",
  ),
  knowledgePoints: [
    {
      id: "entries-as-binomial-coefficients",
      title: t("Entries as binomial coefficients", "杨辉三角中的数是二项式系数"),
      explanation: t(
        "Number the rows of Pascal's triangle from $0$, so that row $n$ starts $1, n$. The entries of row $n$ are the **binomial coefficients**\n\n$$\\binom{n}{0}, \\binom{n}{1}, \\binom{n}{2}, \\ldots, \\binom{n}{n}$$\n\nSo the $j$th number in row $n$ is $\\binom{n}{j - 1}$. For example row $5$ is $1, 5, 10, 10, 5, 1$, and its $3$rd number is $\\binom{5}{2} = 10$. This lets you find any entry without writing the rows above it: the $4$th number in row $12$ is $\\binom{12}{3} = 220$.\n\n> **Watch out.** The places in a row are counted from $0$ as well, so the $j$th number is $\\binom{n}{j - 1}$, not $\\binom{n}{j}$. The $4$th number in row $12$ is $\\binom{12}{3} = 220$, while $\\binom{12}{4} = 495$ is the $5$th.",
        "杨辉三角的行从 $0$ 开始编号，第 $n$ 行以 $1, n$ 开头。第 $n$ 行的数就是**二项式系数**\n\n$$\\binom{n}{0}, \\binom{n}{1}, \\binom{n}{2}, \\ldots, \\binom{n}{n}$$\n\n所以第 $n$ 行的第 $j$ 个数是 $\\binom{n}{j - 1}$。例如第 $5$ 行是 $1, 5, 10, 10, 5, 1$，其中第 $3$ 个数是 $\\binom{5}{2} = 10$。这样不必写出上面各行就能求出任意一个数：第 $12$ 行的第 $4$ 个数是 $\\binom{12}{3} = 220$。\n\n> **注意。** 一行中的位置也从 $0$ 开始数，所以第 $j$ 个数是 $\\binom{n}{j - 1}$，不是 $\\binom{n}{j}$。第 $12$ 行的第 $4$ 个数是 $\\binom{12}{3} = 220$，而 $\\binom{12}{4} = 495$ 是第 $5$ 个数。",
      ),
      figure: pascalFigure(
        [[5, 2]],
        t(
          "Rows 0 to 6 of Pascal's triangle: 1; 1 1; 1 2 1; 1 3 3 1; 1 4 6 4 1; 1 5 10 10 5 1; 1 6 15 20 15 6 1. The 3rd number of row 5, 10, is circled: it is C(5, 2).",
          "杨辉三角的第 0 行到第 6 行：1；1 1；1 2 1；1 3 3 1；1 4 6 4 1；1 5 10 10 5 1；1 6 15 20 15 6 1。第 5 行的第 3 个数 10 被圈出：它是 C(5, 2)。",
        ),
      ),
      generate(rng) {
        const n = rng.int(7, 16);
        const j = rng.int(3, Math.min(6, n - 1));
        const k = j - 1;
        const answer = choose(n, k);
        const top = range(n - k + 1, n)
          .reverse()
          .join(" \\cdot ");
        const bottom = range(1, k).reverse().join(" \\cdot ");
        const [left, right] = [choose(n - 1, k - 1), choose(n - 1, k)];
        return numberProblem({
          prompt: t(
            `The rows of Pascal's triangle are numbered from $0$, so that row $${n}$ starts $1, ${n}, \\ldots$. What is the ${ordinal(j)} number in row $${n}$?`,
            `杨辉三角的行从 $0$ 开始编号，第 $${n}$ 行以 $1, ${n}, \\ldots$ 开头。第 $${n}$ 行的第 $${j}$ 个数是多少？`,
          ),
          answer,
          wrong: [choose(n, j), choose(n - 1, j - 1), choose(n + 1, j - 1), choose(n, j - 2)],
          solution: worked(
            [
              [
                "Match the place to $k$",
                "把位置对应到 $k$",
                `The places in row $${n}$ are $k = 0, 1, 2, \\ldots$, so the ${ordinal(j)} number has $k = ${j} - 1 = ${k}$. It is $${binom(n, k)}$.`,
                `第 $${n}$ 行中的位置是 $k = 0, 1, 2, \\ldots$，所以第 $${j}$ 个数的 $k = ${j} - 1 = ${k}$。它是 $${binom(n, k)}$。`,
              ],
              [
                "Work out the coefficient",
                "计算这个系数",
                `Cancel $${n - k}!$ from the top and bottom of the factorial formula:`,
                `把阶乘公式分子分母中的 $${n - k}!$ 约去：`,
                `${binom(n, k)} = \\frac{${n}!}{${k}!\\,${n - k}!} = \\frac{${top}}{${bottom}} = ${grouped(answer)}`,
              ],
            ],
            `By Pascal's rule the entry is the sum of the two entries above it in row $${n - 1}$: $${binom(n - 1, k - 1)} + ${binom(n - 1, k)} = ${grouped(left)} + ${grouped(right)} = ${grouped(answer)}$.`,
            `由帕斯卡法则，这个数等于它上方第 $${n - 1}$ 行的两个数之和：$${binom(n - 1, k - 1)} + ${binom(n - 1, k)} = ${grouped(left)} + ${grouped(right)} = ${grouped(answer)}$。`,
          ),
        });
      },
    },
    {
      id: "pascals-rule",
      title: t("Pascal's rule", "帕斯卡法则"),
      explanation: t(
        "Each entry of Pascal's triangle is the sum of the two entries above it. In binomial coefficients this is **Pascal's rule**:\n\n$$\\binom{n}{k} + \\binom{n}{k+1} = \\binom{n+1}{k+1}$$\n\nFor example $\\binom{9}{3} + \\binom{9}{4} = 84 + 126 = 210 = \\binom{10}{4}$. The rule also gives one of the two upper entries from the lower one, by subtracting the other.\n\n> **Watch out.** The two upper entries are neighbors in row $n$, and their sum sits in row $n + 1$ below the right-hand one. So the sum of $\\binom{9}{3}$ and $\\binom{9}{4}$ is $\\binom{10}{4}$, not $\\binom{10}{3}$.",
        "杨辉三角中每个数都等于它上方两个数之和。用二项式系数表示，就是**帕斯卡法则**：\n\n$$\\binom{n}{k} + \\binom{n}{k+1} = \\binom{n+1}{k+1}$$\n\n例如 $\\binom{9}{3} + \\binom{9}{4} = 84 + 126 = 210 = \\binom{10}{4}$。这个法则也可以由下面的数减去上面的一个数，求出上面的另一个数。\n\n> **注意。** 上面的两个数在第 $n$ 行中相邻，它们的和在第 $n + 1$ 行、位于右边那个数的下方。所以 $\\binom{9}{3}$ 与 $\\binom{9}{4}$ 之和是 $\\binom{10}{4}$，不是 $\\binom{10}{3}$。",
      ),
      figure: pascalFigure(
        [
          [5, 2],
          [5, 3],
          [6, 3],
        ],
        t(
          "Rows 0 to 6 of Pascal's triangle with 10 and 10 in row 5 circled together with the 20 below them in row 6: 10 + 10 = 20, so C(5, 2) + C(5, 3) = C(6, 3).",
          "杨辉三角的第 0 行到第 6 行，第 5 行的 10 和 10 与它们下方第 6 行的 20 一起被圈出：10 + 10 = 20，即 C(5, 2) + C(5, 3) = C(6, 3)。",
        ),
      ),
      generate(rng) {
        const n = rng.int(10, 20);
        const k = rng.int(2, 6);
        const A = choose(n, k);
        const B = choose(n, k + 1);
        const X = A + B;
        const rule: Step = [
          "Use Pascal's rule",
          "用帕斯卡法则",
          `The entries $${binom(n, k)}$ and $${binom(n, k + 1)}$ are neighbors in row $${n}$, and the entry below them is $${binom(n + 1, k + 1)}$:`,
          `$${binom(n, k)}$ 和 $${binom(n, k + 1)}$ 是第 $${n}$ 行中相邻的两个数，它们下方的数是 $${binom(n + 1, k + 1)}$：`,
          `${binom(n + 1, k + 1)} = ${binom(n, k)} + ${binom(n, k + 1)}`,
        ];
        /** factorialCheck works out a coefficient from the factorial formula instead of Pascal's rule. */
        const factorialCheck = (m: number, j: number) =>
          t(
            `Work out the coefficient from the factorial formula instead: $${binom(m, j)} = \\frac{${m}!}{${j}!\\,${m - j}!} = ${grouped(choose(m, j))}$.`,
            `改用阶乘公式计算这个系数：$${binom(m, j)} = \\frac{${m}!}{${j}!\\,${m - j}!} = ${grouped(choose(m, j))}$。`,
          );
        if (rng.bool()) {
          const check = factorialCheck(n + 1, k + 1);
          return numberProblem({
            prompt: t(
              `Given that $${binom(n, k)} = ${grouped(A)}$ and $${binom(n, k + 1)} = ${grouped(B)}$, find $${binom(n + 1, k + 1)}$.`,
              `已知 $${binom(n, k)} = ${grouped(A)}$，$${binom(n, k + 1)} = ${grouped(B)}$，求 $${binom(n + 1, k + 1)}$。`,
            ),
            answer: X,
            wrong: [B - A, 2 * B, choose(n + 1, k), B],
            solution: worked(
              [
                rule,
                [
                  "Add",
                  "相加",
                  "Substitute the two given values:",
                  "代入两个已知值：",
                  `${binom(n + 1, k + 1)} = ${grouped(A)} + ${grouped(B)} = ${grouped(X)}`,
                ],
              ],
              check.en,
              check["zh-CN"],
            ),
          });
        }
        const check = factorialCheck(n, k + 1);
        return numberProblem({
          prompt: t(
            `Given that $${binom(n + 1, k + 1)} = ${grouped(X)}$ and $${binom(n, k)} = ${grouped(A)}$, find $${binom(n, k + 1)}$.`,
            `已知 $${binom(n + 1, k + 1)} = ${grouped(X)}$，$${binom(n, k)} = ${grouped(A)}$，求 $${binom(n, k + 1)}$。`,
          ),
          answer: B,
          wrong: [X + A, A, X - choose(n, k - 1), Q.of(X, 2)],
          solution: worked(
            [
              rule,
              [
                "Subtract",
                "相减",
                `Subtract $${binom(n, k)}$ from both sides and substitute the given values:`,
                `两边减去 $${binom(n, k)}$，代入已知值：`,
                `${binom(n, k + 1)} = ${binom(n + 1, k + 1)} - ${binom(n, k)}`,
                `${binom(n, k + 1)} = ${grouped(X)} - ${grouped(A)} = ${grouped(B)}`,
              ],
            ],
            check.en,
            check["zh-CN"],
          ),
        });
      },
    },
    {
      id: "symmetry",
      title: t("Symmetry", "对称性"),
      explanation: t(
        "Each row of Pascal's triangle reads the same from both ends, because choosing $k$ objects from $n$ is the same as choosing the $n - k$ to leave out:\n\n$$\\binom{n}{k} = \\binom{n}{n - k}$$\n\nSo if $\\binom{n}{3} = \\binom{n}{8}$ with $3 \\ne 8$, the two lower numbers add to $n$: $n = 3 + 8 = 11$.\n\n> **Watch out.** Equal coefficients in different places are mirror images, the same distance from the two ends of the row. So their lower numbers **add** to $n$; their difference, here $8 - 3 = 5$, is not $n$.",
        "杨辉三角的每一行从两端读起都一样，因为从 $n$ 个物体中选出 $k$ 个，等同于选出不要的 $n - k$ 个：\n\n$$\\binom{n}{k} = \\binom{n}{n - k}$$\n\n所以若 $\\binom{n}{3} = \\binom{n}{8}$ 且 $3 \\ne 8$，则下面的两个数之和是 $n$：$n = 3 + 8 = 11$。\n\n> **注意。** 位置不同而相等的两个系数互为镜像，到这一行两端的距离相同。所以它们下面的数**相加**等于 $n$；它们的差，这里是 $8 - 3 = 5$，并不是 $n$。",
      ),
      figure: pascalFigure(
        [
          [6, 2],
          [6, 4],
        ],
        t(
          "Rows 0 to 6 of Pascal's triangle with a dashed vertical line of symmetry down the middle. In row 6 the two 15s, C(6, 2) and C(6, 4), are circled: they are mirror images, and 2 + 4 = 6.",
          "杨辉三角的第 0 行到第 6 行，中间有一条竖直的虚线对称轴。第 6 行的两个 15，即 C(6, 2) 和 C(6, 4)，被圈出：它们互为镜像，且 2 + 4 = 6。",
        ),
        true,
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = a + rng.int(1, 9);
        const n = a + b;
        const value = grouped(choose(n, a));
        const check = t(
          `With $n = ${n}$ both coefficients have the same factorial formula, $\\frac{${n}!}{${a}!\\,${b}!} = ${value}$, because swapping $k$ and $n - k$ only swaps the two factorials below.`,
          `$n = ${n}$ 时两个系数的阶乘公式相同，都是 $\\frac{${n}!}{${a}!\\,${b}!} = ${value}$，因为交换 $k$ 与 $n - k$ 只是交换了分母中的两个阶乘。`,
        );
        if (rng.bool()) {
          return numberProblem({
            prompt: t(`Find $n$ such that $${binom("n", a)} = ${binom("n", b)}$.`, `求 $n$，使 $${binom("n", a)} = ${binom("n", b)}$。`),
            answer: n,
            solveFor: "n",
            wrong: [b - a, a + b - 1, a + b + 1, a * b],
            solution: worked(
              [
                [
                  "Use the symmetry",
                  "用对称性",
                  `The two coefficients are equal but $${a} \\ne ${b}$, so they are mirror places in row $n$:`,
                  `两个系数相等而 $${a} \\ne ${b}$，所以它们在第 $n$ 行中位置对称：`,
                  `${b} = n - ${a}`,
                ],
                ["Solve for $n$", "解出 $n$", `Add $${a}$ to both sides:`, `两边加 $${a}$：`, `n = ${a} + ${b} = ${n}`],
              ],
              check.en,
              check["zh-CN"],
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `Find the value of $m$, other than $${a}$, for which $${binom(n, a)} = ${binom(n, "m")}$.`,
            `求 $m$ 的值（$m \\ne ${a}$），使 $${binom(n, a)} = ${binom(n, "m")}$。`,
          ),
          answer: b,
          solveFor: "m",
          wrong: [b - 1, b + 1, n],
          solution: worked(
            [
              [
                "Use the symmetry",
                "用对称性",
                `By symmetry $\\binom{n}{k} = \\binom{n}{n - k}$, so the other place in row $${n}$ with the same value is $${n} - ${a}$.`,
                `由对称性，$\\binom{n}{k} = \\binom{n}{n - k}$，所以第 $${n}$ 行中另一个值相同的位置是 $${n} - ${a}$。`,
              ],
              ["Find $m$", "求 $m$", "Subtract:", "相减：", `m = ${n} - ${a} = ${b}`],
            ],
            check.en,
            check["zh-CN"],
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
  intro: t(
    "You know that row $n$ of Pascal's triangle lists the binomial coefficients $\\binom{n}{0}, \\binom{n}{1}, \\ldots, \\binom{n}{n}$, and that these rows give the coefficients when a binomial is expanded. With the binomial coefficients there is no need to write out the rows: in $(a + b)^{n}$, the term with $b^{k}$ is $\\binom{n}{k}a^{n-k}b^{k}$, for any $n$. One term can even be found on its own.\n\nFor $(x + 2)^{3}$ the coefficients are row $3$, namely $1, 3, 3, 1$:\n\n$$(x + 2)^{3} = x^{3} + 3x^{2}(2) + 3x(2)^{2} + 2^{3} = x^{3} + 6x^{2} + 12x + 8$$\n\nSubstituting $x = 1$ checks it. The left side is $3^{3} = 27$, and the right side is $1 + 6 + 12 + 8 = 27$.",
    "你知道杨辉三角的第 $n$ 行列出二项式系数 $\\binom{n}{0}, \\binom{n}{1}, \\ldots, \\binom{n}{n}$，也知道展开二项式时这些行给出系数。有了二项式系数就不必写出这些行：在 $(a + b)^{n}$ 中，含 $b^{k}$ 的项是 $\\binom{n}{k}a^{n-k}b^{k}$，对任意 $n$ 都成立。甚至可以单独求出某一项。\n\n对 $(x + 2)^{3}$，系数是第 $3$ 行，即 $1, 3, 3, 1$：\n\n$$(x + 2)^{3} = x^{3} + 3x^{2}(2) + 3x(2)^{2} + 2^{3} = x^{3} + 6x^{2} + 12x + 8$$\n\n代入 $x = 1$ 可以检验：左边是 $3^{3} = 27$，右边是 $1 + 6 + 12 + 8 = 27$。",
  ),
  knowledgePoints: [
    {
      id: "the-binomial-theorem",
      title: t("The binomial theorem", "二项式定理"),
      explanation: t(
        "The **binomial theorem** gives the expansion of any power of a binomial:\n\n$$(a + b)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}a^{n-k}b^{k} = a^{n} + \\binom{n}{1}a^{n-1}b + \\binom{n}{2}a^{n-2}b^{2} + \\cdots + b^{n}$$\n\nSubstitute the two terms of the binomial, with their coefficients and signs, in parentheses:\n\n$$(2x - 3)^{4} = (2x)^{4} + 4(2x)^{3}(-3) + 6(2x)^{2}(-3)^{2} + 4(2x)(-3)^{3} + (-3)^{4}$$\n\n$$= 16x^{4} - 96x^{3} + 216x^{2} - 216x + 81$$\n\n> **Watch out.** Raise the whole term to the power, coefficient and sign included: $(2x)^{3} = 8x^{3}$, not $2x^{3}$, and $(-3)^{3} = -27$. Odd powers of a negative term are negative, so the signs alternate.",
        "**二项式定理**给出二项式任意次幂的展开式：\n\n$$(a + b)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}a^{n-k}b^{k} = a^{n} + \\binom{n}{1}a^{n-1}b + \\binom{n}{2}a^{n-2}b^{2} + \\cdots + b^{n}$$\n\n把二项式的两项连同系数和符号加上括号代入：\n\n$$(2x - 3)^{4} = (2x)^{4} + 4(2x)^{3}(-3) + 6(2x)^{2}(-3)^{2} + 4(2x)(-3)^{3} + (-3)^{4}$$\n\n$$= 16x^{4} - 96x^{3} + 216x^{2} - 216x + 81$$\n\n> **注意。** 要把整个项连同系数和符号一起乘方：$(2x)^{3} = 8x^{3}$，不是 $2x^{3}$；$(-3)^{3} = -27$。负项的奇次幂是负数，所以各项正负交替。",
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
        const row = range(0, n)
          .map((k) => choose(n, k))
          .join(", ");
        const coefficients = range(0, n).map((i) => Q.of(choose(n, n - i) * p ** (n - i) * q ** i));
        const at1 = (p + q) ** n;
        return expressionProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [
            expansion(p, q, n, v, (j) => choose(n, j) * p ** j * q),
            expansion(p, q, n, v, (j) => choose(n, j) * Math.sign(q) ** (n - j)),
            poly([p ** n, pw(v, n)], [q ** n, ""]),
          ],
          solution: worked(
            [
              [
                "Write the terms",
                "写出各项",
                `Use the binomial theorem with row $${row}$ of coefficients, and put both terms of the binomial in parentheses:`,
                `用二项式定理，系数是 $${row}$ 这一行，二项式的两项都加上括号：`,
                `${expr} = ${termsL}`,
              ],
              [
                "Work out each term",
                "算出每一项",
                "Raise each term to its power, signs included, and multiply:",
                "把每一项连同符号乘方，再相乘：",
                `${expr} = ${answer}`,
              ],
            ],
            `Substitute $${v} = 1$. The left side becomes $(${p} ${q < 0 ? "-" : "+"} ${Math.abs(q)})^{${n}} = ${at1}$, and the coefficients of the expansion add to the same number: $${listL(coefficients)} = ${at1}$.`,
            `代入 $${v} = 1$。左边变为 $(${p} ${q < 0 ? "-" : "+"} ${Math.abs(q)})^{${n}} = ${at1}$，展开式的系数之和也是这个数：$${listL(coefficients)} = ${at1}$。`,
          ),
        });
      },
    },
    {
      id: "a-single-coefficient",
      title: t("A single coefficient", "某一项的系数"),
      explanation: t(
        "To find one term without the whole expansion, use the general term $\\binom{n}{k}a^{n-k}b^{k}$. For the coefficient of $x^{5}$ in $(2x - 1)^{8}$, the power of $2x$ must be $5$, so $k = 3$:\n\n$$\\binom{8}{3}(2x)^{5}(-1)^{3} = 56 \\cdot 32x^{5} \\cdot (-1) = -1792x^{5}$$\n\nThe coefficient is $-1792$.\n\n> **Watch out.** Raise the numbers in the binomial to their powers too: $(2x)^{5} = 32x^{5}$ and $(-1)^{3} = -1$. Leaving them out gives just $\\binom{8}{3} = 56$, and dropping the sign gives $1792$.",
        "不完全展开而求某一项时，用通项 $\\binom{n}{k}a^{n-k}b^{k}$。求 $(2x - 1)^{8}$ 中 $x^{5}$ 的系数：$2x$ 的指数必须是 $5$，所以 $k = 3$：\n\n$$\\binom{8}{3}(2x)^{5}(-1)^{3} = 56 \\cdot 32x^{5} \\cdot (-1) = -1792x^{5}$$\n\n系数是 $-1792$。\n\n> **注意。** 二项式中的数也要乘方：$(2x)^{5} = 32x^{5}$，$(-1)^{3} = -1$。漏掉它们只会得到 $\\binom{8}{3} = 56$，丢掉符号则得到 $1792$。",
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
          const px = poly([p, "x"]);
          const product = `${choose(n, k)} \\cdot ${pr(p ** j)} \\cdot ${pr(q ** k)}`;
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
            solution: worked(
              [
                [
                  "Find $k$",
                  "求 $k$",
                  `In the general term $${binom(n, "k")}(${px})^{${n}-k}(${q})^{k}$ the power of $x$ is $${n} - k$. Set it equal to $${j}$:`,
                  `通项 $${binom(n, "k")}(${px})^{${n}-k}(${q})^{k}$ 中 $x$ 的指数是 $${n} - k$。令它等于 $${j}$：`,
                  `${n} - k = ${j}`,
                  `k = ${k}`,
                ],
                [
                  "Work out the term",
                  "算出这一项",
                  `Substitute $k = ${k}$ and raise each part to its power:`,
                  `代入 $k = ${k}$，把每个部分乘方：`,
                  `${binom(n, k)}(${px})^{${j}}(${q})^{${k}} = ${product} \\cdot ${target} = ${monomial(answer, "x", j)}`,
                ],
              ],
              `Count from the other end of the expansion instead: the term is $${binom(n, j)}(${px})^{${j}}(${q})^{${k}}$, and $${binom(n, j)} = \\frac{${n}!}{${j}!\\,${k}!} = ${choose(n, k)}$ as well. So the coefficient is again $${product} = ${answer}$.`,
              `改为从展开式的另一端数：这一项是 $${binom(n, j)}(${px})^{${j}}(${q})^{${k}}$，而 $${binom(n, j)} = \\frac{${n}!}{${j}!\\,${k}!} = ${choose(n, k)}$ 也一样。所以系数仍是 $${product} = ${answer}$。`,
            ),
          });
        }
      },
    },
    {
      id: "the-constant-term",
      title: t("The constant term", "常数项"),
      explanation: t(
        "When the binomial has a negative power of $x$, some term may not contain $x$ at all. Find the $k$ that makes the power of $x$ in the general term zero. In $\\left(x^{2} + \\frac{2}{x}\\right)^{6}$ the general term is\n\n$$\\binom{6}{k}(x^{2})^{6-k}\\left(\\frac{2}{x}\\right)^{k} = \\binom{6}{k}2^{k}x^{12 - 3k}$$\n\nSetting $12 - 3k = 0$ gives $k = 4$, so the constant term is $\\binom{6}{4}2^{4} = 15 \\cdot 16 = 240$.\n\n> **Watch out.** Combine all the powers of $x$ before solving: $(x^{2})^{6-k}$ gives $x^{12 - 2k}$ and $\\left(\\frac{2}{x}\\right)^{k}$ gives $x^{-k}$, so the exponent is $12 - 3k$. The constant term is the whole term $\\binom{6}{4}2^{4}$, not just $\\binom{6}{4}$.",
        "当二项式中含有 $x$ 的负次幂时，可能有一项完全不含 $x$。求出使通项中 $x$ 的指数为零的 $k$。在 $\\left(x^{2} + \\frac{2}{x}\\right)^{6}$ 中，通项是\n\n$$\\binom{6}{k}(x^{2})^{6-k}\\left(\\frac{2}{x}\\right)^{k} = \\binom{6}{k}2^{k}x^{12 - 3k}$$\n\n令 $12 - 3k = 0$ 得 $k = 4$，所以常数项是 $\\binom{6}{4}2^{4} = 15 \\cdot 16 = 240$。\n\n> **注意。** 解方程之前先合并 $x$ 的所有乘方：$(x^{2})^{6-k}$ 给出 $x^{12 - 2k}$，$\\left(\\frac{2}{x}\\right)^{k}$ 给出 $x^{-k}$，所以指数是 $12 - 3k$。常数项是整个 $\\binom{6}{4}2^{4}$，不只是 $\\binom{6}{4}$。",
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
          const power = p === 1 ? `${n} - k` : `${p}(${n} - k)`;
          const e = q * k;
          return numberProblem({
            prompt: t(`Find the constant term in the expansion of $${expr}$.`, `求 $${expr}$ 展开式中的常数项。`),
            answer,
            wrong: [
              choose(n, k),
              Math.abs(answer),
              choose(n, k + 1) * a ** (n - k - 1) * b ** (k + 1),
              choose(n, k) * a ** k * b ** (n - k),
            ],
            solution: worked(
              [
                [
                  "Write the general term",
                  "写出通项",
                  "The general term of the expansion is",
                  "展开式的通项是",
                  `${binom(n, "k")}\\left(${first}\\right)^{${n}-k}\\left(${sec}\\right)^{k}`,
                ],
                [
                  "Make the power of $x$ zero",
                  "令 $x$ 的指数为零",
                  `The first factor gives $x$ to the power $${power}$ and the second divides by $x$ to the power $${poly([q, "k"])}$. Set the total power to zero:`,
                  `第一个因式给出 $x$ 的 $${power}$ 次幂，第二个因式除以 $x$ 的 $${poly([q, "k"])}$ 次幂。令总指数为零：`,
                  `${power} - ${poly([q, "k"])} = 0`,
                  `${p * n} - ${p + q}k = 0`,
                  `k = ${k}`,
                ],
                [
                  "Work out the term",
                  "算出这一项",
                  `Substitute $k = ${k}$; the powers of $x$ cancel:`,
                  `代入 $k = ${k}$，$x$ 的乘方相互抵消：`,
                  `${binom(n, k)} \\cdot ${a}^{${n - k}} \\cdot ${pr(b)}^{${k}} = ${choose(n, k)} \\cdot ${a ** (n - k)} \\cdot ${pr(b ** k)} = ${answer}`,
                ],
              ],
              `At $k = ${k}$ the first factor is $\\left(${first}\\right)^{${n - k}} = ${a ** (n - k) === 1 ? "" : a ** (n - k)}${pw("x", e)}$ and the second is $\\left(${sec}\\right)^{${k}} = \\frac{${b ** k}}{${pw("x", e)}}$. The two powers of $x$ are equal and cancel, leaving $${choose(n, k)} \\cdot ${a ** (n - k)} \\cdot ${pr(b ** k)} = ${answer}$.`,
              `$k = ${k}$ 时第一个因式是 $\\left(${first}\\right)^{${n - k}} = ${a ** (n - k) === 1 ? "" : a ** (n - k)}${pw("x", e)}$，第二个是 $\\left(${sec}\\right)^{${k}} = \\frac{${b ** k}}{${pw("x", e)}}$。两个 $x$ 的乘方相同，相互抵消，剩下 $${choose(n, k)} \\cdot ${a ** (n - k)} \\cdot ${pr(b ** k)} = ${answer}$。`,
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
  encompasses: [{ topic: "expanding-a-binomial-using-binomial-coefficients", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSA.APR.C.5"],
  intro: t(
    "You can expand $(a + b)^{n}$ with the binomial theorem, and you can write sums in sigma notation. The most used case has $a = 1$. Every power of $1$ is $1$, so only the binomial coefficients and the powers of $x$ are left:\n\n$$(1 + x)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}x^{k}$$\n\nFor $n = 4$ the coefficients are row $4$ of Pascal's triangle:\n\n$$(1 + x)^{4} = 1 + 4x + 6x^{2} + 4x^{3} + x^{4}$$\n\nSubstituting $x = 1$ gives $2^{4} = 16$, and indeed $1 + 4 + 6 + 4 + 1 = 16$.",
    "你会用二项式定理展开 $(a + b)^{n}$，也会用求和符号写和。最常用的情形是 $a = 1$。$1$ 的各次幂都是 $1$，所以只剩下二项式系数和 $x$ 的乘方：\n\n$$(1 + x)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}x^{k}$$\n\n当 $n = 4$ 时，系数就是杨辉三角的第 $4$ 行：\n\n$$(1 + x)^{4} = 1 + 4x + 6x^{2} + 4x^{3} + x^{4}$$\n\n代入 $x = 1$ 得 $2^{4} = 16$，确实 $1 + 4 + 6 + 4 + 1 = 16$。",
  ),
  knowledgePoints: [
    {
      id: "expanding-one-plus-x",
      title: t("Expanding $(1 + x)^{n}$", "展开 $(1 + x)^{n}$"),
      explanation: t(
        "With $a = 1$, every power of $a$ is $1$, and the binomial theorem becomes a sum in **ascending** powers of $x$:\n\n$$(1 + x)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}x^{k} = 1 + nx + \\frac{n(n - 1)}{2}x^{2} + \\cdots + x^{n}$$\n\nReplacing $x$ by $cx$ multiplies the $x^{k}$ term by $c^{k}$:\n\n$$(1 - 2x)^{9} = 1 + 9(-2x) + 36(-2x)^{2} + \\cdots = 1 - 18x + 144x^{2} + \\cdots$$\n\n> **Watch out.** Square the whole of $cx$: the $x^{2}$ term is $36(-2x)^{2} = 144x^{2}$, not $36 \\cdot (-2)x^{2}$. And the coefficient $\\binom{n}{2}$ is $\\frac{n(n - 1)}{2}$, not $n(n - 1)$.",
        "当 $a = 1$ 时，$a$ 的各次幂都是 $1$，二项式定理变为按 $x$ 的**升幂**排列的和：\n\n$$(1 + x)^{n} = \\sum_{k=0}^{n} \\binom{n}{k}x^{k} = 1 + nx + \\frac{n(n - 1)}{2}x^{2} + \\cdots + x^{n}$$\n\n把 $x$ 换成 $cx$，$x^{k}$ 项就乘以 $c^{k}$：\n\n$$(1 - 2x)^{9} = 1 + 9(-2x) + 36(-2x)^{2} + \\cdots = 1 - 18x + 144x^{2} + \\cdots$$\n\n> **注意。** 要把整个 $cx$ 平方：$x^{2}$ 项是 $36(-2x)^{2} = 144x^{2}$，不是 $36 \\cdot (-2)x^{2}$。系数 $\\binom{n}{2}$ 是 $\\frac{n(n - 1)}{2}$，不是 $n(n - 1)$。",
      ),
      generate(rng) {
        const n = rng.int(5, 15);
        const c = rng.pick([1, -1, 2, -2, 3, -3]);
        const two = choose(n, 2);
        const answer = poly([1, ""], [n * c, "x"], [two * c * c, "x^{2}"]);
        const inner = poly([1, ""], [c, "x"]);
        const cx = poly([c, "x"]);
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
          solution: worked(
            [
              [
                `Substitute $y = ${cx}$`,
                `代入 $y = ${cx}$`,
                `The expansion of $(1 + y)^{${n}}$ starts $1 + ${n}y + ${binom(n, 2)}y^{2}$, where $${binom(n, 2)} = \\frac{${n} \\cdot ${n - 1}}{2} = ${two}$. Put $y = ${cx}$:`,
                `$(1 + y)^{${n}}$ 的展开式以 $1 + ${n}y + ${binom(n, 2)}y^{2}$ 开头，其中 $${binom(n, 2)} = \\frac{${n} \\cdot ${n - 1}}{2} = ${two}$。令 $y = ${cx}$：`,
                `(${inner})^{${n}} = 1 + ${n}(${cx}) + ${two}(${cx})^{2} + \\cdots`,
              ],
              [
                "Simplify",
                "化简",
                `Square the whole of $${cx}$ and multiply:`,
                `把整个 $${cx}$ 平方，再相乘：`,
                `(${inner})^{${n}} = ${answer} + \\cdots`,
              ],
            ],
            `Count the ways to multiply out the $${n}$ factors $(${inner})$. Taking $${cx}$ from one factor and $1$ from the rest can be done in $${n}$ ways, which gives $${monomial(n * c, "x", 1)}$. Taking $${cx}$ from two factors can be done in $${binom(n, 2)} = ${two}$ ways, each giving $${monomial(c * c, "x", 2)}$, which gives $${monomial(two * c * c, "x", 2)}$.`,
            `数一数把 $${n}$ 个因式 $(${inner})$ 乘开的方法。从一个因式取 $${cx}$、其余取 $1$，有 $${n}$ 种取法，得到 $${monomial(n * c, "x", 1)}$。从两个因式取 $${cx}$，有 $${binom(n, 2)} = ${two}$ 种取法，每种得到 $${monomial(c * c, "x", 2)}$，合起来是 $${monomial(two * c * c, "x", 2)}$。`,
          ),
        });
      },
    },
    {
      id: "sums-of-binomial-coefficients",
      title: t("Sums of binomial coefficients", "二项式系数之和"),
      explanation: t(
        "Substituting a number for $x$ in the expansion of $(1 + x)^{n}$ adds up binomial coefficients. With $x = 1$, each row of Pascal's triangle adds to a power of $2$:\n\n$$\\sum_{k=0}^{n} \\binom{n}{k} = (1 + 1)^{n} = 2^{n}$$\n\nWith $x = 2$ the same idea gives\n\n$$\\sum_{k=0}^{n} \\binom{n}{k}2^{k} = (1 + 2)^{n} = 3^{n}$$\n\nWith $x = -1$ the signs alternate, and the sum is $(1 - 1)^{n} = 0$.\n\n> **Watch out.** The sum starts at $k = 0$, so it has $n + 1$ terms and includes $\\binom{n}{0} = 1$. Leaving out that term gives $(1 + x)^{n} - 1$ instead.",
        "在 $(1 + x)^{n}$ 的展开式中给 $x$ 代入一个数，就得到二项式系数的和。令 $x = 1$，杨辉三角每一行的和都是 $2$ 的幂：\n\n$$\\sum_{k=0}^{n} \\binom{n}{k} = (1 + 1)^{n} = 2^{n}$$\n\n令 $x = 2$，同样得到\n\n$$\\sum_{k=0}^{n} \\binom{n}{k}2^{k} = (1 + 2)^{n} = 3^{n}$$\n\n令 $x = -1$，各项正负交替，和为 $(1 - 1)^{n} = 0$。\n\n> **注意。** 和从 $k = 0$ 开始，所以共有 $n + 1$ 项，并且包括 $\\binom{n}{0} = 1$。漏掉这一项就得到 $(1 + x)^{n} - 1$。",
      ),
      generate(rng) {
        const n = rng.int(4, 12);
        const c = rng.pick([1, 1, 2, 3, -1, -2, 4]);
        const answer = (1 + c) ** n;
        const term = c === 1 ? binom(n, "k") : `${binom(n, "k")}${c < 0 ? `(${c})` : c}^{k}`;
        const expr = `\\sum_{k=0}^{${n}} ${term}`;
        const terms = range(0, n).map((k) => Q.of(choose(n, k) * c ** k));
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer,
          wrong: [2 ** n, c ** n, (1 + c) ** n - 1, n * (1 + c), 2 ** n * c],
          solution: worked(
            [
              [
                "Recognize the expansion",
                "认出展开式",
                `Each term is $${binom(n, "k")}x^{k}$ with $x = ${c}$, so the sum is the expansion of $(1 + x)^{${n}}$ at $x = ${c}$:`,
                `每一项都是 $${binom(n, "k")}x^{k}$，其中 $x = ${c}$，所以这个和是 $(1 + x)^{${n}}$ 在 $x = ${c}$ 时的展开式：`,
                `${expr} = (1 ${c < 0 ? "-" : "+"} ${Math.abs(c)})^{${n}}`,
              ],
              [
                "Evaluate",
                "计算",
                "Work out the power:",
                "算出这个乘方：",
                `(1 ${c < 0 ? "-" : "+"} ${Math.abs(c)})^{${n}} = ${pr(1 + c)}^{${n}} = ${answer}`,
              ],
            ],
            `Add the $${n + 1}$ terms one by one instead: $${listL(terms)} = ${answer}$.`,
            `改为把这 $${n + 1}$ 项逐个相加：$${listL(terms)} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "finding-n-from-a-coefficient",
      title: t("Finding $n$ from a coefficient", "由系数求 $n$"),
      explanation: t(
        "A known coefficient gives an equation for $n$. If the coefficient of $x^{2}$ in $(1 + 3x)^{n}$ is $324$, then\n\n$$\\binom{n}{2}3^{2} = 324$$\n\n$$\\frac{n(n - 1)}{2} = 36$$\n\n$$n^{2} - n - 72 = 0$$\n\n$$(n - 9)(n + 8) = 0$$\n\nSo $n = 9$, the positive solution.\n\n> **Watch out.** The power $n$ is a positive whole number, so reject the negative root $n = -8$. Remember the $2$ in $\\binom{n}{2} = \\frac{n(n - 1)}{2}$; without it the quadratic would be $n^{2} - n - 36 = 0$, which has no whole-number root.",
        "已知某项的系数，就得到关于 $n$ 的方程。若 $(1 + 3x)^{n}$ 中 $x^{2}$ 的系数是 $324$，则\n\n$$\\binom{n}{2}3^{2} = 324$$\n\n$$\\frac{n(n - 1)}{2} = 36$$\n\n$$n^{2} - n - 72 = 0$$\n\n$$(n - 9)(n + 8) = 0$$\n\n所以 $n = 9$（取正解）。\n\n> **注意。** 指数 $n$ 是正整数，所以要舍去负根 $n = -8$。别忘了 $\\binom{n}{2} = \\frac{n(n - 1)}{2}$ 中的 $2$；少了它，方程就成了 $n^{2} - n - 36 = 0$，没有整数根。",
      ),
      generate(rng) {
        const n = rng.int(4, 16);
        const c = rng.pick([1, 2, 3, -2, -3, 4]);
        const V = choose(n, 2) * c * c;
        const inner = poly([1, ""], [c, "x"]);
        const half = choose(n, 2);
        const cx = c === 1 ? "x" : `${c}x`;
        return numberProblem({
          prompt: t(
            `The coefficient of $x^{2}$ in the expansion of $(${inner})^{n}$ is $${V}$. Find $n$.`,
            `$(${inner})^{n}$ 的展开式中 $x^{2}$ 的系数是 $${V}$。求 $n$。`,
          ),
          answer: n,
          solveFor: "n",
          wrong: [n - 1, n + 1, Q.of(V, c * c), Q.of(V, Math.abs(c))],
          solution: worked(
            [
              [
                "Write the coefficient",
                "写出系数",
                `The $x^{2}$ term is $${binom("n", 2)}(${cx})^{2}$, so its coefficient is $${binom("n", 2)} \\cdot ${c * c}$. Set it equal to $${V}$ and use $${binom("n", 2)} = \\frac{n(n - 1)}{2}$:`,
                `$x^{2}$ 项是 $${binom("n", 2)}(${cx})^{2}$，所以它的系数是 $${binom("n", 2)} \\cdot ${c * c}$。令它等于 $${V}$，并用 $${binom("n", 2)} = \\frac{n(n - 1)}{2}$：`,
                `${binom("n", 2)} \\cdot ${c * c} = ${V}`,
                `\\frac{n(n - 1)}{2} = ${half}`,
              ],
              [
                "Solve the quadratic",
                "解二次方程",
                `Multiply by $2$ and factor. The power $n$ must be a positive whole number:`,
                `乘以 $2$ 再因式分解。指数 $n$ 必须是正整数：`,
                `n^{2} - n - ${2 * half} = 0`,
                `(n - ${n})(n + ${n - 1}) = 0`,
                `n = ${n}`,
              ],
            ],
            `With $n = ${n}$ the $x^{2}$ coefficient is the given one: $${binom(n, 2)} \\cdot ${c * c} = ${half} \\cdot ${c * c} = ${V}$.`,
            `$n = ${n}$ 时 $x^{2}$ 的系数正是已知的值：$${binom(n, 2)} \\cdot ${c * c} = ${half} \\cdot ${c * c} = ${V}$。`,
          ),
        });
      },
    },
  ],
};

/** addDec writes a signed decimal term after another: "+ 0.16", "- 1.6". */
const addDec = (v: Q) => (v.sign() < 0 ? `- ${dec(v.neg())}` : `+ ${dec(v)}`);

/** exactCheck compares a three-term estimate of a power with its exact value, whose difference is mostly the fourth term. */
function exactCheck(x: string, n: number, exact: Q, estimate: Q, fourth: Q, fourthL: string): Text {
  const close = (v: Q) => dec(roundQ(v, 8));
  const value = `${x}^{${n}} ${roundQ(exact, 8).eq(exact) ? "=" : "\\approx"} ${close(exact)}`;
  const gap = `${close(exact.sub(estimate))}`;
  return t(
    `Multiplying out exactly gives $${value}$. The exact value minus the estimate is about $${gap}$, close to the first term left out, $${fourthL} = ${dec(fourth)}$.`,
    `精确地乘开得 $${value}$。精确值减去近似值约为 $${gap}$，与舍去的第一项 $${fourthL} = ${dec(fourth)}$ 接近。`,
  );
}

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
  intro: t(
    "You can write the first terms of $(1 + x)^{n}$ in ascending powers of $x$. When $x$ is a small number, each power of it is much smaller than the one before. So the first few terms already give the value of the whole power to several decimal places, without multiplying it out.\n\nTake $1.01^{5} = (1 + 0.01)^{5}$. The first three terms are\n\n$$1 + 5(0.01) + 10(0.01)^{2} = 1 + 0.05 + 0.001 = 1.051$$\n\nThe true value is $1.0510100501$. The terms left out add only about $0.00001$.",
    "你会写出 $(1 + x)^{n}$ 按 $x$ 升幂排列的前几项。当 $x$ 是一个很小的数时，它的每一次幂都比前一次小得多。所以不必乘开，前几项就能给出整个乘方精确到好几位小数的值。\n\n取 $1.01^{5} = (1 + 0.01)^{5}$。前三项是\n\n$$1 + 5(0.01) + 10(0.01)^{2} = 1 + 0.05 + 0.001 = 1.051$$\n\n真实值是 $1.0510100501$。舍去的各项加起来只有约 $0.00001$。",
  ),
  knowledgePoints: [
    {
      id: "powers-near-one",
      title: t("Powers of numbers near $1$", "接近 $1$ 的数的乘方"),
      explanation: t(
        "Write a number close to $1$ as $1 + h$ with $h$ small. The powers $h^{2}, h^{3}, \\ldots$ shrink quickly, so the first few terms of the expansion give a good approximation:\n\n$$(1 + h)^{n} = 1 + nh + \\binom{n}{2}h^{2} + \\binom{n}{3}h^{3} + \\cdots$$\n\nWith three terms:\n\n$$1.02^{8} = (1 + 0.02)^{8} \\approx 1 + 8(0.02) + 28(0.02)^{2} = 1 + 0.16 + 0.0112 = 1.1712$$\n\nThe true value is $1.17166\\ldots$.\n\n> **Watch out.** Square $h$ in the third term, sign included: $(-0.02)^{2} = 0.0004$ is positive. The coefficient of $h^{2}$ is $\\binom{n}{2} = \\frac{n(n - 1)}{2}$, not $n$.",
        "把接近 $1$ 的数写成 $1 + h$，其中 $h$ 很小。$h^{2}, h^{3}, \\ldots$ 迅速变小，所以展开式的前几项就是很好的近似值：\n\n$$(1 + h)^{n} = 1 + nh + \\binom{n}{2}h^{2} + \\binom{n}{3}h^{3} + \\cdots$$\n\n取前三项：\n\n$$1.02^{8} = (1 + 0.02)^{8} \\approx 1 + 8(0.02) + 28(0.02)^{2} = 1 + 0.16 + 0.0112 = 1.1712$$\n\n真实值是 $1.17166\\ldots$。\n\n> **注意。** 第三项要把 $h$ 连同符号平方：$(-0.02)^{2} = 0.0004$ 是正数。$h^{2}$ 的系数是 $\\binom{n}{2} = \\frac{n(n - 1)}{2}$，不是 $n$。",
      ),
      generate(rng) {
        const n = rng.int(4, 12);
        const h = Q.of(rng.nonZero(-5, 5), 100);
        const two = choose(n, 2);
        const answer = Q.one.add(Q.of(n).mul(h)).add(Q.of(two).mul(h.pow(2)));
        const x = dec(Q.one.add(h));
        const hL = `(${dec(h)})`;
        const check = exactCheck(x, n, Q.one.add(h).pow(n), answer, Q.of(choose(n, 3)).mul(h.pow(3)), `${binom(n, 3)}${hL}^{3}`);
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
          solution: worked(
            [
              [
                "Write the number as $1 + h$",
                "把这个数写成 $1 + h$",
                `Here $${x} = 1 ${h.sign() < 0 ? "-" : "+"} ${dec(h.abs())}$, so $h = ${dec(h)}$, and the coefficient of $h^{2}$ is $${binom(n, 2)} = ${two}$.`,
                `这里 $${x} = 1 ${h.sign() < 0 ? "-" : "+"} ${dec(h.abs())}$，所以 $h = ${dec(h)}$，$h^{2}$ 的系数是 $${binom(n, 2)} = ${two}$。`,
              ],
              [
                "Keep three terms",
                "保留三项",
                "Keep the terms up to $h^{2}$:",
                "保留到 $h^{2}$ 项：",
                `${x}^{${n}} \\approx 1 + ${n}${hL} + ${two}${hL}^{2}`,
                `${x}^{${n}} \\approx 1 ${addDec(Q.of(n).mul(h))} ${addDec(Q.of(two).mul(h.pow(2)))} = ${dec(answer)}`,
              ],
            ],
            check.en,
            check["zh-CN"],
          ),
        });
      },
    },
    {
      id: "powers-near-other-integers",
      title: t("Powers of numbers near other integers", "接近其他整数的数的乘方"),
      explanation: t(
        "For a number close to an integer $a$, write it as $a + h$ and use the first terms of $(a + h)^{n} = a^{n} + na^{n-1}h + \\binom{n}{2}a^{n-2}h^{2} + \\cdots$:\n\n$$1.98^{5} = (2 - 0.02)^{5} \\approx 2^{5} + 5 \\cdot 2^{4}(-0.02) + 10 \\cdot 2^{3}(-0.02)^{2}$$\n\n$$= 32 - 1.6 + 0.032 = 30.432$$\n\nThe true value is $30.4316\\ldots$.\n\n> **Watch out.** The powers of $a$ go down as the powers of $h$ go up, so the third term is $\\binom{n}{2}a^{n-2}h^{2}$. Leaving out the powers of $a$ treats the number as if it were close to $1$.",
        "对于接近整数 $a$ 的数，把它写成 $a + h$，用 $(a + h)^{n} = a^{n} + na^{n-1}h + \\binom{n}{2}a^{n-2}h^{2} + \\cdots$ 的前几项：\n\n$$1.98^{5} = (2 - 0.02)^{5} \\approx 2^{5} + 5 \\cdot 2^{4}(-0.02) + 10 \\cdot 2^{3}(-0.02)^{2}$$\n\n$$= 32 - 1.6 + 0.032 = 30.432$$\n\n真实值是 $30.4316\\ldots$。\n\n> **注意。** $h$ 的次数升高时 $a$ 的次数降低，所以第三项是 $\\binom{n}{2}a^{n-2}h^{2}$。漏掉 $a$ 的乘方，就把这个数当成接近 $1$ 了。",
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
        const fourth = Q.of(choose(n, 3) * a ** (n - 3)).mul(h.pow(3));
        const fourthL = `${binom(n, 3)}${n === 3 ? "" : ` \\cdot ${a}${n - 3 === 1 ? "" : `^{${n - 3}}`}`}${hL}^{3}`;
        const check = exactCheck(x, n, Q.of(a).add(h).pow(n), answer, fourth, fourthL);
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
          solution: worked(
            [
              [
                "Write the number as $a + h$",
                "把这个数写成 $a + h$",
                `Here $${x} = ${a} ${h.sign() < 0 ? "-" : "+"} ${dec(h.abs())}$, so $a = ${a}$ and $h = ${dec(h)}$.`,
                `这里 $${x} = ${a} ${h.sign() < 0 ? "-" : "+"} ${dec(h.abs())}$，所以 $a = ${a}$，$h = ${dec(h)}$。`,
              ],
              [
                "Keep three terms",
                "保留三项",
                "Keep the first three terms, with the powers of $a$ going down:",
                "保留前三项，$a$ 的次数逐项降低：",
                `${x}^{${n}} \\approx ${a}^{${n}} + ${n} \\cdot ${a}^{${n - 1}}${hL} + ${two} \\cdot ${a}^{${n - 2}}${hL}^{2}`,
                `${x}^{${n}} \\approx ${dec(t0)} ${addDec(t1)} ${addDec(t2)} = ${dec(answer)}`,
              ],
            ],
            check.en,
            check["zh-CN"],
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
].map(withFourDigits);
