// Third knowledge points for thin topics of Calculus II, from infinite series to
// first differential equations: the reverse question, a harder case or a common
// trap. See `deeperCalculusIIThird2Points`.

import type { KnowledgePointDef, Problem, Rng } from "@ga/content";
import { t } from "@ga/content";
import { dec, linear, paren, poly, Q } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";
import { explainedChoice, numberProblem } from "../problems.ts";

import { type Pair, point } from "../university-kit.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** same2 writes one formula as a pair for both languages. */
const same2 = (latex: string): Pair => [`$${latex}$`, `$${latex}$`];
/** ratio picks a nonzero fraction of size less than 1. */
const ratio = (rng: Rng) => {
  const q = rng.int(2, 9);
  const p = rng.pick([...Array(2 * q - 1).keys()].map((i) => i - q + 1).filter((i) => i !== 0));
  return Q.of(p, q);
};

const sumFromPartialSums = point(
  "the-sum-from-a-formula-for-partial-sums",
  ["The sum from a formula for partial sums", "由部分和公式求和"],
  [
    "The sum of a series is by definition the limit of its partial sums, not of its terms. So a formula for $S_{N}$ gives the sum by taking $N \\to \\infty$. The first partial sum $S_{1}$ is only the first term, and the terms themselves tend to $0$. For $S_{N} = \\frac{3N + 1}{N + 2}$, dividing by $N$ gives the sum $3$.\n\nCheck: $S_{N} - 3 = \\frac{-5}{N + 2}$, which tends to $0$.\n\n> **Watch out.** $S_{1} = \\frac{4}{3}$ is only the first term, and the terms tend to $0$; neither is the sum.",
    "级数的和按定义是部分和的极限，而不是通项的极限。所以知道 $S_{N}$ 的公式，令 $N \\to \\infty$ 就得到和。第一个部分和 $S_{1}$ 只是第一项，而通项本身趋于 $0$。对 $S_{N} = \\frac{3N + 1}{N + 2}$，分子分母同除以 $N$ 得和为 $3$。\n\n检验：$S_{N} - 3 = \\frac{-5}{N + 2}$，它趋于 $0$。\n\n> **注意。** $S_{1} = \\frac{4}{3}$ 只是第一项，而通项趋于 $0$；两者都不是级数的和。",
  ],
  (rng) => {
    const p = nz(rng, 9);
    let q = nz(rng, 9);
    const r = rng.int(1, 9);
    const s = rng.int(1, 9);
    if (p * s === q * r) q = q === 9 ? 8 : q + 1;
    const answer = Q.of(p, r);
    const S = `\\frac{${poly([p, "N"], [q, ""])}}{${poly([r, "N"], [s, ""])}}`;
    const gap = q * r - p * s;
    const below = r === 1 ? poly([r, "N"], [s, ""]) : `${r}(${poly([r, "N"], [s, ""])})`;
    const parts: Step[] = [
      [
        ["Use the definition", "用定义"],
        t("The sum of a series is the limit of its partial sums:", "级数的和是部分和的极限："),
        [`\\sum a_{n} = \\lim_{N \\to \\infty} ${S}`],
      ],
      [
        ["Divide by N", "同除以 N"],
        t("Divide the numerator and the denominator by $N$ and let $N$ grow:", "分子分母同除以 $N$，再令 $N$ 增大："),
        [`\\lim_{N \\to \\infty} \\frac{${p} + \\frac{${q}}{N}}{${r} + \\frac{${s}}{N}} = ${answer.toLatex()}`],
      ],
    ];
    const wrong: readonly (readonly [Q, string, string])[] = [
      [Q.of(p + q, r + s), "This is $S_{1}$, the first term alone", "这是 $S_{1}$，只是第一项"],
      [Q.of(0), "This is the limit of the terms; the sum is the limit of the partial sums", "这是通项的极限；和是部分和的极限"],
      [
        Q.of(q, s),
        "This puts $N = 0$ into the formula; the sum needs $N \\to \\infty$",
        "这里把 $N = 0$ 代入了公式；求和需要 $N \\to \\infty$",
      ],
    ];
    return numberProblem({
      prompt: t(
        `The partial sums of a series are $S_{N} = ${S}$. Find the sum of the series.`,
        `一个级数的部分和是 $S_{N} = ${S}$。求这个级数的和。`,
      ),
      answer,
      mistakes: wrong.filter((w, i) => wrong.findIndex((x) => x[0].eq(w[0])) === i).map(([value, en, zh]) => ({ value, why: t(en, zh) })),
      solution: walked(
        parts,
        t(
          `Subtract the answer from $S_{N}$: $S_{N} - ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} = \\frac{${gap}}{${below}}$, which tends to $0$ as $N$ grows.`,
          `用 $S_{N}$ 减去答案：$S_{N} - ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} = \\frac{${gap}}{${below}}$，当 $N$ 增大时它趋于 $0$。`,
        ),
      ),
    });
  },
);

const noTermwiseProduct = point(
  "series-do-not-multiply-term-by-term",
  ["Series do not multiply term by term", "级数不能逐项相乘"],
  [
    "Sums and constant multiples of convergent series behave as expected, but products do not. The series of products $a_{n}b_{n}$ need not sum to the product of the sums, and it need not even converge, as $a_{n} = b_{n} = \\frac{(-1)^{n}}{\\sqrt{n}}$ shows: both series converge, but the products are $\\frac{1}{n}$.\n\nCheck: with $a_{n} = b_{n} = \\left(\\frac{1}{2}\\right)^{n}$ from $n = 1$, both sums are $1$, but $\\sum \\left(\\frac{1}{4}\\right)^{n} = \\frac{1}{3}$, not $1 \\cdot 1$.\n\n> **Watch out.** Adding works term by term, $\\sum (a_{n} + b_{n}) = A + B$; multiplying does not.",
    "收敛级数的和与常数倍符合预期，但积并非如此。由 $a_{n}b_{n}$ 组成的级数，其和不一定等于两个和的积，甚至不一定收敛，$a_{n} = b_{n} = \\frac{(-1)^{n}}{\\sqrt{n}}$ 就是一个例子：两个级数都收敛，但积是 $\\frac{1}{n}$。\n\n检验：取 $a_{n} = b_{n} = \\left(\\frac{1}{2}\\right)^{n}$（从 $n = 1$ 开始），两个和都是 $1$，但 $\\sum \\left(\\frac{1}{4}\\right)^{n} = \\frac{1}{3}$，不是 $1 \\cdot 1$。\n\n> **注意。** 加法可以逐项进行，$\\sum (a_{n} + b_{n}) = A + B$；乘法不行。",
  ],
  (rng) => {
    const A = nz(rng, 9);
    const B = nz(rng, 9);
    const parts: Step[] = [
      [
        ["Compare with a product of sums", "与和的积比较"],
        t(
          "A product of two sums has cross terms, which the series of products leaves out:",
          "两个和的积含有交叉项，而逐项积组成的级数没有这些项：",
        ),
        ["(a_{1} + a_{2})(b_{1} + b_{2}) = a_{1}b_{1} + a_{2}b_{2} + a_{1}b_{2} + a_{2}b_{1}"],
      ],
      [
        ["Find a pair whose products diverge", "找出逐项积发散的例子"],
        t(
          "With $a_{n} = b_{n} = \\frac{(-1)^{n}}{\\sqrt{n}}$ both series converge, by the alternating series test, but the products form the harmonic series:",
          "取 $a_{n} = b_{n} = \\frac{(-1)^{n}}{\\sqrt{n}}$，由交错级数判别法两个级数都收敛，但逐项积构成调和级数：",
        ),
        ["a_{n}b_{n} = \\frac{1}{n}, \\quad \\sum \\frac{1}{n} \\text{ diverges}"],
      ],
    ];
    return explainedChoice(rng, {
      prompt: t(
        `$\\sum_{n=1}^{\\infty} a_{n} = ${A}$ and $\\sum_{n=1}^{\\infty} b_{n} = ${B}$. What can be said about $\\sum_{n=1}^{\\infty} a_{n}b_{n}$?`,
        `$\\sum_{n=1}^{\\infty} a_{n} = ${A}$，$\\sum_{n=1}^{\\infty} b_{n} = ${B}$。关于 $\\sum_{n=1}^{\\infty} a_{n}b_{n}$ 能得出什么结论？`,
      ),
      correct: t("Nothing definite: it need not converge at all", "没有确定的结论：它甚至不一定收敛"),
      wrong: [
        {
          option: t(`It converges to $${A * B}$`, `它收敛到 $${A * B}$`),
          why: t(
            "Products of sums have cross terms: $a_{n} = b_{n} = \\left(\\frac{1}{2}\\right)^{n}$ have sums $1$ and $1$, but their products sum to $\\frac{1}{3}$",
            "和的积有交叉项：$a_{n} = b_{n} = \\left(\\frac{1}{2}\\right)^{n}$ 的和都是 $1$，但逐项积之和是 $\\frac{1}{3}$",
          ),
        },
        {
          option: t(`It converges, but not necessarily to $${A * B}$`, `它收敛，但不一定收敛到 $${A * B}$`),
          why: t(
            "It need not converge: for $a_{n} = b_{n} = \\frac{(-1)^{n}}{\\sqrt{n}}$ the products are $\\frac{1}{n}$",
            "它不一定收敛：对 $a_{n} = b_{n} = \\frac{(-1)^{n}}{\\sqrt{n}}$，逐项积是 $\\frac{1}{n}$",
          ),
        },
        {
          option: t("It must diverge", "它一定发散"),
          why: t(
            "It can converge: for $a_{n} = b_{n} = \\left(\\frac{1}{2}\\right)^{n}$ the products sum to $\\frac{1}{3}$",
            "它可以收敛：对 $a_{n} = b_{n} = \\left(\\frac{1}{2}\\right)^{n}$，逐项积之和是 $\\frac{1}{3}$",
          ),
        },
      ],
      solution: walked(
        parts,
        t(
          "A second pair shows the other side: $a_{n} = b_{n} = \\left(\\frac{1}{2}\\right)^{n}$ from $n = 1$ have sums $1$ and $1$, and their products $\\left(\\frac{1}{4}\\right)^{n}$ converge, to $\\frac{1}{3}$. So the products can converge or diverge, and even when they converge the sum need not be the product of the sums.",
          "另一组例子说明另一面：$a_{n} = b_{n} = \\left(\\frac{1}{2}\\right)^{n}$（从 $n = 1$ 开始）的和都是 $1$，而逐项积 $\\left(\\frac{1}{4}\\right)^{n}$ 收敛于 $\\frac{1}{3}$。所以逐项积可能收敛也可能发散，即使收敛，和也不一定等于两个和的积。",
        ),
      ),
    });
  },
);

const sumFromAStartIndex = point(
  "geometric-series-that-start-at-a-later-index",
  ["Geometric series that start at a later index", "从较后下标开始的几何级数"],
  [
    "The formula $\\frac{a}{1 - r}$ needs the actual first term of the series, which is the term at the lower limit. For $\\sum_{n=k}^{\\infty} cr^{n}$ that is $cr^{k}$, not $c$, so the sum is $\\frac{cr^{k}}{1 - r}$. For $\\sum_{n=2}^{\\infty} 3\\left(\\frac{1}{2}\\right)^{n}$, the first term is $\\frac{3}{4}$ and the sum is $\\frac{3/4}{1/2} = \\frac{3}{2}$.\n\nCheck: from $n = 0$ the sum would be $6$; taking away $3$ and $\\frac{3}{2}$ leaves $\\frac{3}{2}$.\n\n> **Watch out.** Using $c = 3$ as the first term gives $6$, the sum from $n = 0$.",
    "公式 $\\frac{a}{1 - r}$ 要用级数真正的第一项，也就是下限处的项。对 $\\sum_{n=k}^{\\infty} cr^{n}$，第一项是 $cr^{k}$，而不是 $c$，所以和是 $\\frac{cr^{k}}{1 - r}$。对 $\\sum_{n=2}^{\\infty} 3\\left(\\frac{1}{2}\\right)^{n}$，第一项是 $\\frac{3}{4}$，和为 $\\frac{3/4}{1/2} = \\frac{3}{2}$。\n\n检验：若从 $n = 0$ 开始，和为 $6$；减去 $3$ 和 $\\frac{3}{2}$ 后得 $\\frac{3}{2}$。\n\n> **注意。** 把 $c = 3$ 当作第一项会得到 $6$，那是从 $n = 0$ 开始的和。",
  ],
  (rng) => {
    const r = ratio(rng);
    const c = nz(rng, 12);
    const k = rng.int(1, 3);
    const first = Q.of(c).mul(r.pow(k));
    const denom = Q.one.sub(r);
    const answer = first.div(denom);
    const term = poly([c, `\\left(${r.toLatex()}\\right)^{n}`]);
    const whole = Q.of(c).div(denom);
    const skipped = [...Array(k).keys()].map((j) => Q.of(c).mul(r.pow(j)));
    const par = (x: Q) => (x.sign() < 0 ? `\\left(${x.toLatex()}\\right)` : x.toLatex());
    const parts: Step[] = [
      [
        ["Find the first term", "求第一项"],
        t(`The first term is the one at the lower limit, $n = ${k}$:`, `第一项是下限 $n = ${k}$ 处的项：`),
        [`${c} \\cdot \\left(${r.toLatex()}\\right)^{${k}} = ${first.toLatex()}`],
      ],
      [
        ["Apply the formula", "代入公式"],
        t(`The ratio is $${r.toLatex()}$, which is less than $1$ in size:`, `公比 $${r.toLatex()}$ 的绝对值小于 $1$：`),
        [`\\frac{${first.toLatex()}}{1 - ${par(r)}} = ${answer.toLatex()}`],
      ],
    ];
    const wrong: readonly (readonly [Q, string, string])[] = [
      [
        whole,
        `This uses $${c}$ as the first term, which gives the sum from $n = 0$`,
        `这里把 $${c}$ 当作第一项，得到的是从 $n = 0$ 开始的和`,
      ],
      [
        Q.of(c)
          .mul(r.pow(k - 1))
          .div(denom),
        `This starts one term early, at $n = ${k - 1}$`,
        `这里早了一项，从 $n = ${k - 1}$ 开始`,
      ],
      [
        first.div(Q.one.add(r)),
        "This divides by $1 + r$; the formula is $\\frac{a}{1 - r}$",
        "这里除以了 $1 + r$；公式是 $\\frac{a}{1 - r}$",
      ],
    ];
    return numberProblem({
      prompt: t(`Find $\\sum_{n=${k}}^{\\infty} ${term}$.`, `求 $\\sum_{n=${k}}^{\\infty} ${term}$。`),
      answer,
      mistakes: wrong.filter((w, i) => wrong.findIndex((x) => x[0].eq(w[0])) === i).map(([value, en, zh]) => ({ value, why: t(en, zh) })),
      solution: walked(
        parts,
        t(
          `Taking away the skipped ${k === 1 ? "term" : "terms"} $${skipped.map((x) => x.toLatex()).join(", ")}$ from the sum from $n = 0$ leaves the answer: $${whole.toLatex()} - ${skipped.map(par).join(" - ")} = ${answer.toLatex()}$.`,
          `从 $n = 0$ 开始的和减去被跳过的项 $${skipped.map((x) => x.toLatex()).join(", ")}$，正好得到答案：$${whole.toLatex()} - ${skipped.map(par).join(" - ")} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

const repeatingNines = point(
  "decimals-that-end-in-repeating-nines",
  ["Decimals that end in repeating nines", "以循环 9 结尾的小数"],
  [
    "A repeating $9$ is not slightly less than the next decimal; it equals it. As a geometric series, $0.\\overline{9} = \\frac{9/10}{1 - 1/10} = 1$. So a decimal ending in repeating nines is a terminating decimal in disguise. For example, $2.3\\overline{9} = 2.3 + \\frac{9/100}{1 - 1/10} = 2.3 + 0.1 = 2.4 = \\frac{12}{5}$.\n\nCheck: if $x = 2.3\\overline{9}$, then $100x - 10x = 239.\\overline{9} - 23.\\overline{9} = 216$, so $x = \\frac{216}{90} = \\frac{12}{5}$.\n\n> **Watch out.** $2.3\\overline{9}$ is not a little less than $2.4$: no number fits between them, so they are equal.",
    "循环的 $9$ 并不是比下一个小数略小，而是恰好相等。作为几何级数，$0.\\overline{9} = \\frac{9/10}{1 - 1/10} = 1$。所以以循环 $9$ 结尾的小数其实是有限小数。例如 $2.3\\overline{9} = 2.3 + \\frac{9/100}{1 - 1/10} = 2.3 + 0.1 = 2.4 = \\frac{12}{5}$。\n\n检验：设 $x = 2.3\\overline{9}$，则 $100x - 10x = 239.\\overline{9} - 23.\\overline{9} = 216$，所以 $x = \\frac{216}{90} = \\frac{12}{5}$。\n\n> **注意。** $2.3\\overline{9}$ 并不比 $2.4$ 小一点：两者之间放不下任何数，所以它们相等。",
  ],
  (rng) => {
    const a = rng.int(0, 9);
    const b = rng.int(0, 8);
    const answer = Q.of(10 * a + b + 1, 10);
    const whole = 100 * a + 10 * b + 9;
    const tenth = 10 * a + b;
    const parts: Step[] = [
      [
        ["Split off the nines", "分出循环的 9"],
        t("Write the repeating part as a geometric series:", "把循环部分写成几何级数："),
        [`${a}.${b}\\overline{9} = ${a}.${b} + \\frac{9}{100} + \\frac{9}{1000} + \\cdots`],
      ],
      [
        ["Sum the series", "求级数的和"],
        t("Its first term is $\\frac{9}{100}$ and its ratio is $\\frac{1}{10}$:", "首项是 $\\frac{9}{100}$，公比是 $\\frac{1}{10}$："),
        [`\\frac{9/100}{1 - 1/10} = \\frac{1}{10}`],
      ],
      [["Add", "相加"], t("", ""), [`${a}.${b} + \\frac{1}{10} = ${dec(answer)} = ${answer.toLatex()}`]],
    ];
    const wrong: readonly (readonly [Q, string, string])[] = [
      [
        Q.of(whole, 100),
        `This keeps only one $9$, $${a}.${b}9$; the nines go on forever`,
        `这里只保留了一个 $9$，即 $${a}.${b}9$；9 是无限循环的`,
      ],
      [Q.of(tenth, 10), "This drops the nines; together they add $\\frac{1}{10}$", "这里把 9 都丢掉了；它们合起来是 $\\frac{1}{10}$"],
      [
        Q.of(tenth + 9, 10),
        "This adds $0.9$; the first $9$ is in the hundredths place, so the nines add $\\frac{1}{10}$",
        "这里加了 $0.9$；第一个 $9$ 在百分位，所以这些 9 合起来是 $\\frac{1}{10}$",
      ],
    ];
    return numberProblem({
      prompt: t(`Write $${a}.${b}\\overline{9}$ as a fraction in lowest terms.`, `把 $${a}.${b}\\overline{9}$ 写成最简分数。`),
      answer,
      mistakes: wrong.map(([value, en, zh]) => ({ value, why: t(en, zh) })),
      solution: walked(
        parts,
        t(
          `Shift the digits instead: if $x = ${a}.${b}\\overline{9}$, then $100x - 10x = ${whole}.\\overline{9} - ${tenth}.\\overline{9} = ${whole - tenth}$, so $x = \\frac{${whole - tenth}}{90} = ${answer.toLatex()}$.`,
          `改用移位相减：设 $x = ${a}.${b}\\overline{9}$，则 $100x - 10x = ${whole}.\\overline{9} - ${tenth}.\\overline{9} = ${whole - tenth}$，所以 $x = \\frac{${whole - tenth}}{90} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

/** SeriesSlip is a wrong number of a series question with its reason in English and Chinese. */
type SeriesSlip = readonly [value: number | Q, en: string, zh: string];

/** SeriesOption is a wrong option of a series question with its reason in English and Chinese. */
type SeriesOption = readonly [option: Pair, en: string, zh: string];

/** seriesQ turns a whole number into a rational and leaves a rational as it is. */
const seriesQ = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);

/** seriesSolved asks for a number, explains it in labelled steps with a check, and keeps the first reason for each wrong value. */
function seriesSolved(prompt: Pair, answer: number | Q, parts: readonly Step[], check: Pair, mistakes: readonly SeriesSlip[]): Problem {
  const right = seriesQ(answer);
  const kept = mistakes.filter((m, i) => !seriesQ(m[0]).eq(right) && mistakes.findIndex((n) => seriesQ(n[0]).eq(seriesQ(m[0]))) === i);
  return numberProblem({
    prompt: t(...prompt),
    answer: right,
    mistakes: kept.map(([value, en, zh]) => ({ value: seriesQ(value), why: t(en, zh) })),
    solution: walked(parts, t(...check)),
  });
}

/** seriesPicked asks a choice whose wrong options each have a reason, explained in labelled steps with a check. */
function seriesPicked(rng: Rng, prompt: Pair, correct: Pair, wrong: readonly SeriesOption[], parts: readonly Step[], check: Pair): Problem {
  return explainedChoice(rng, {
    prompt: t(...prompt),
    correct: t(...correct),
    wrong: wrong.map(([option, en, zh]) => ({ option: t(...option), why: t(en, zh) })),
    solution: walked(parts, t(...check)),
  });
}

/** pSeries lists terms of the form c over a power of n, with the same term in x and the power p. */
const pSeries = [
  { term: (c: number) => `\\frac{${c}}{n}`, x: (c: number) => `\\frac{${c}}{x}`, p: Q.of(1) },
  { term: (c: number) => `\\frac{${c}}{\\sqrt{n}}`, x: (c: number) => `\\frac{${c}}{\\sqrt{x}}`, p: Q.of(1, 2) },
  { term: (c: number) => `\\frac{${c}}{n^{2}}`, x: (c: number) => `\\frac{${c}}{x^{2}}`, p: Q.of(2) },
  { term: (c: number) => `\\frac{${c}}{n\\sqrt{n}}`, x: (c: number) => `\\frac{${c}}{x\\sqrt{x}}`, p: Q.of(3, 2) },
  { term: (c: number) => `\\frac{${c}}{n^{3}}`, x: (c: number) => `\\frac{${c}}{x^{3}}`, p: Q.of(3) },
] as const;

const converseTrap = point(
  "terms-tending-to-zero-prove-nothing",
  ["Terms tending to zero prove nothing", "通项趋于零不能证明收敛"],
  [
    "The $n$th term test can only prove divergence: if the terms do not tend to $0$, the series diverges. When the terms do tend to $0$ it says nothing, and another test must decide. The harmonic series is the standard warning. Its terms tend to $0$, yet it diverges by the $p$-series test with $p = 1$, and its partial sums grow without bound: $\\sum_{n=1}^{N} \\frac{1}{n} \\ge \\int_{1}^{N+1} \\frac{dx}{x} = \\ln(N + 1)$.\n\nCheck: group the terms. $\\frac{1}{3} + \\frac{1}{4} > \\frac{1}{2}$ and $\\frac{1}{5} + \\frac{1}{6} + \\frac{1}{7} + \\frac{1}{8} > \\frac{1}{2}$, and each later block of doubled length adds more than $\\frac{1}{2}$ again, so the partial sums pass every bound.\n\n> **Watch out.** A limit of $0$ is necessary for convergence, not sufficient: $\\frac{1}{n} \\to 0$, but $\\sum \\frac{1}{n}$ diverges.",
    "第 $n$ 项检验只能证明发散：通项不趋于 $0$ 时级数发散。通项趋于 $0$ 时它不提供任何信息，必须用别的检验来判断。调和级数就是典型的警示。它的通项趋于 $0$，但由 $p = 1$ 的 $p$ 级数检验它发散，部分和无限增大：$\\sum_{n=1}^{N} \\frac{1}{n} \\ge \\int_{1}^{N+1} \\frac{dx}{x} = \\ln(N + 1)$。\n\n检验：把各项分组。$\\frac{1}{3} + \\frac{1}{4} > \\frac{1}{2}$，$\\frac{1}{5} + \\frac{1}{6} + \\frac{1}{7} + \\frac{1}{8} > \\frac{1}{2}$，以后每一组长度加倍，又加上超过 $\\frac{1}{2}$ 的量，所以部分和超过任何界。\n\n> **注意。** 极限为 $0$ 是收敛的必要条件，不是充分条件：$\\frac{1}{n} \\to 0$，但 $\\sum \\frac{1}{n}$ 发散。",
  ],
  (rng) => {
    const s = rng.pick(pSeries);
    const c = rng.int(1, 20);
    const conv = s.p.sub(Q.one).sign() > 0;
    const p = s.p.toLatex();
    const yes: Pair = ["The test says nothing; the $p$-series test shows that it converges", "该检验不提供信息；$p$ 级数检验说明它收敛"];
    const no: Pair = ["The test says nothing; the $p$-series test shows that it diverges", "该检验不提供信息；$p$ 级数检验说明它发散"];
    const parts: Step[] = [
      [
        ["Apply the nth term test", "用第 n 项检验"],
        t("The terms tend to $0$, so the $n$th term test gives no information:", "通项趋于 $0$，所以第 $n$ 项检验不提供信息："),
        [`\\lim_{n \\to \\infty} ${s.term(c)} = 0`],
      ],
      [
        ["Use the p-series test", "用 p 级数检验"],
        t(
          `The terms are a constant multiple of $\\frac{1}{n^{p}}$, and a $p$-series converges exactly when $p > 1$. Here ${conv ? "it does" : "it does not"}:`,
          `通项是 $\\frac{1}{n^{p}}$ 的常数倍，而 $p$ 级数恰好在 $p > 1$ 时收敛。这里${conv ? "满足" : "不满足"}：`,
        ),
        [`p = ${p} ${conv ? ">" : "\\le"} 1`],
      ],
    ];
    const growth = s.p.eq(Q.one) ? `${c === 1 ? "" : c}\\ln N` : `${2 * c}\\left(\\sqrt{N} - 1\\right)`;
    const check: Pair = conv
      ? [
          `The integral test agrees, because the area under $${s.x(c)}$ from $1$ is finite: $\\int_{1}^{\\infty} ${s.x(c)} \\, dx = ${Q.of(c).div(s.p.sub(Q.one)).toLatex()}$. A finite area bounds the partial sums, so the series converges.`,
          `积分检验给出同样的结论，因为 $${s.x(c)}$ 从 $1$ 起的面积有限：$\\int_{1}^{\\infty} ${s.x(c)} \\, dx = ${Q.of(c).div(s.p.sub(Q.one)).toLatex()}$。面积有限，部分和就有上界，所以级数收敛。`,
        ]
      : [
          `The integral test agrees, because the area under $${s.x(c)}$ from $1$ grows without bound: $\\int_{1}^{N} ${s.x(c)} \\, dx = ${growth}$. The partial sums are at least this area, so the series diverges.`,
          `积分检验给出同样的结论，因为 $${s.x(c)}$ 从 $1$ 起的面积无限增大：$\\int_{1}^{N} ${s.x(c)} \\, dx = ${growth}$。部分和不小于这个面积，所以级数发散。`,
        ];
    return seriesPicked(
      rng,
      [
        `The terms of $\\sum_{n=1}^{\\infty} ${s.term(c)}$ tend to $0$. Which conclusion is correct?`,
        `$\\sum_{n=1}^{\\infty} ${s.term(c)}$ 的通项趋于 $0$。哪个结论是正确的？`,
      ],
      conv ? yes : no,
      [
        [
          conv ? no : yes,
          conv
            ? `Here $p = ${p} > 1$, and a $p$-series with $p > 1$ converges`
            : `Here $p = ${p} \\le 1$, and a $p$-series with $p \\le 1$ diverges`,
          conv ? `这里 $p = ${p} > 1$，$p > 1$ 的 $p$ 级数收敛` : `这里 $p = ${p} \\le 1$，$p \\le 1$ 的 $p$ 级数发散`,
        ],
        [
          ["The test shows that it converges, because the terms tend to $0$", "该检验说明它收敛，因为通项趋于 $0$"],
          "Terms tending to $0$ do not prove convergence: $\\frac{1}{n} \\to 0$, but the harmonic series diverges",
          "通项趋于 $0$ 不能证明收敛：$\\frac{1}{n} \\to 0$，但调和级数发散",
        ],
        [
          ["The test shows that it diverges, because the limit of the terms is $0$", "该检验说明它发散，因为通项的极限是 $0$"],
          "The $n$th term test proves divergence only when the limit of the terms is not $0$",
          "第 $n$ 项检验只有在通项极限不为 $0$ 时才能证明发散",
        ],
      ],
      parts,
      check,
    );
  },
);

const integralTailBound = {
  ...point(
    "bounding-the-tail-with-an-integral",
    ["Bounding the tail with an integral", "用积分估计余项"],
    [
      "The integral test also estimates the error. For positive decreasing $f$, the tail after $N$ terms is at most the area from $N$, $\\sum_{n=N+1}^{\\infty} f(n) \\le \\int_{N}^{\\infty} f(x) \\, dx$. The lower limit is $N$, the last term included in the partial sum, because the rectangle of height $f(n)$ stands on $[n - 1, n]$, under the curve. For $\\sum \\frac{1}{n^{2}}$ after $N = 10$ terms, the bound is $\\int_{10}^{\\infty} \\frac{dx}{x^{2}} = \\frac{1}{10}$.\n\nCheck: the true tail is $\\frac{\\pi^{2}}{6} - S_{10}$, about $0.0952$, which is indeed below $0.1$.\n\n> **Watch out.** Starting the integral at $N + 1$ gives $\\frac{1}{11}$, about $0.0909$, which is below the true tail: it is a lower bound, not an upper one.",
      "积分检验也能估计误差。对正的递减函数 $f$，前 $N$ 项之后的余项不超过从 $N$ 起的面积，即 $\\sum_{n=N+1}^{\\infty} f(n) \\le \\int_{N}^{\\infty} f(x) \\, dx$。下限是 $N$，即部分和所含的最后一项，因为高为 $f(n)$ 的矩形立在 $[n - 1, n]$ 上，位于曲线下方。对 $\\sum \\frac{1}{n^{2}}$ 取前 $N = 10$ 项，上界是 $\\int_{10}^{\\infty} \\frac{dx}{x^{2}} = \\frac{1}{10}$。\n\n检验：真实的余项是 $\\frac{\\pi^{2}}{6} - S_{10}$，约为 $0.0952$，确实小于 $0.1$。\n\n> **注意。** 从 $N + 1$ 开始积分得到 $\\frac{1}{11}$，约为 $0.0909$，比真实余项小：它是下界，不是上界。",
    ],
    (rng) => {
      const p = rng.int(2, 4);
      const c = rng.int(1, 20);
      const N = rng.int(2, p === 2 ? 15 : p === 3 ? 9 : 5);
      const answer = Q.of(c, (p - 1) * N ** (p - 1));
      const anti = p === 2 ? `-\\frac{${c}}{x}` : `-\\frac{${c}}{${p - 1}x^{${p - 1}}}`;
      const below = p === 2 ? `${N}` : `${p - 1} \\cdot ${N}^{${p - 1}}`;
      const parts: Step[] = [
        [
          ["Choose the integral", "选择积分"],
          t(
            `The tail starts at $n = ${N + 1}$. Its rectangles stand on $[${N}, ${N + 1}]$, $[${N + 1}, ${N + 2}]$, and so on, under the curve, so the integral starts at $${N}$:`,
            `余项从 $n = ${N + 1}$ 开始。它的矩形立在 $[${N}, ${N + 1}]$、$[${N + 1}, ${N + 2}]$ 等区间上，位于曲线下方，所以积分从 $${N}$ 开始：`,
          ),
          [`\\sum_{n=${N + 1}}^{\\infty} \\frac{${c}}{n^{${p}}} \\le \\int_{${N}}^{\\infty} \\frac{${c}}{x^{${p}}} \\, dx`],
        ],
        [
          ["Integrate", "积分"],
          t(
            `An antiderivative is $${anti}$, which tends to $0$ as $x \\to \\infty$:`,
            `一个原函数是 $${anti}$，当 $x \\to \\infty$ 时它趋于 $0$：`,
          ),
          [`\\int_{${N}}^{\\infty} \\frac{${c}}{x^{${p}}} \\, dx = \\frac{${c}}{${below}} = ${answer.toLatex()}`],
        ],
      ];
      return seriesSolved(
        [
          `Use the integral $\\int_{${N}}^{\\infty}$ to find an upper bound for $\\sum_{n=${N + 1}}^{\\infty} \\frac{${c}}{n^{${p}}}$.`,
          `用积分 $\\int_{${N}}^{\\infty}$ 求 $\\sum_{n=${N + 1}}^{\\infty} \\frac{${c}}{n^{${p}}}$ 的一个上界。`,
        ],
        answer,
        parts,
        [
          `Differentiate the antiderivative back: the derivative of $${anti}$ is $\\frac{${c}}{x^{${p}}}$. Its value at $x = ${N}$ is $-${answer.toLatex()}$, so the area from $${N}$ is $${answer.toLatex()}$. The bound is also larger than the first term of the tail, $\\frac{${c}}{${N + 1}^{${p}}}$, as it must be.`,
          `把原函数求导回去：$${anti}$ 的导数是 $\\frac{${c}}{x^{${p}}}$。它在 $x = ${N}$ 处的值是 $-${answer.toLatex()}$，所以从 $${N}$ 起的面积是 $${answer.toLatex()}$。这个上界也大于余项的第一项 $\\frac{${c}}{${N + 1}^{${p}}}$，这是应当的。`,
        ],
        [
          [
            Q.of(c, N ** p),
            `This is the single term at $n = ${N}$; the bound is the area over $[${N}, \\infty)$`,
            `这是 $n = ${N}$ 处的单独一项；上界是 $[${N}, \\infty)$ 上的面积`,
          ],
          [
            Q.of(c, N ** (p - 1)),
            `This forgets to divide by $${p - 1}$ when integrating $x^{-${p}}$`,
            `积分 $x^{-${p}}$ 时忘了除以 $${p - 1}$`,
          ],
          [
            Q.of(c, (p - 1) * (N + 1) ** (p - 1)),
            `This integral starts at $${N + 1}$; it is a lower bound for the tail, not an upper one`,
            `这个积分从 $${N + 1}$ 开始；它是余项的下界，不是上界`,
          ],
        ],
      );
    },
  ),
  figure: calculusDrawings5["the-integral-test#bounding-the-tail-with-an-integral"],
};

const comparisonDirections = point(
  "comparisons-in-the-wrong-direction",
  ["Comparisons in the wrong direction", "方向错误的比较"],
  [
    "Comparison works in only two directions: below a convergent series gives convergence, and above a divergent series gives divergence. Being below a divergent series, or above a convergent one, proves nothing, however natural the comparison looks. For example, $\\frac{1}{n^{2}} \\le \\frac{1}{n}$, and $\\sum \\frac{1}{n}$ diverges, but this says nothing about the smaller series, which in fact converges: $\\sum_{n=1}^{\\infty} \\frac{1}{n^{2}} = \\frac{\\pi^{2}}{6}$.\n\nCheck: $\\frac{1}{n} \\le 1$ too, and $\\sum 1$ diverges. Here the smaller series also diverges, so a series below a divergent one can go either way.\n\n> **Watch out.** Only two pairings decide anything: smaller than a convergent series, or larger than a divergent one.",
    "比较只在两个方向上有效：小于收敛级数则收敛，大于发散级数则发散。小于发散级数或大于收敛级数都证明不了什么，不管这个比较看起来多么自然。例如 $\\frac{1}{n^{2}} \\le \\frac{1}{n}$，而 $\\sum \\frac{1}{n}$ 发散，但这对较小的级数说明不了什么，事实上它收敛：$\\sum_{n=1}^{\\infty} \\frac{1}{n^{2}} = \\frac{\\pi^{2}}{6}$。\n\n检验：同样有 $\\frac{1}{n} \\le 1$，而 $\\sum 1$ 发散。这里较小的级数也发散，所以小于发散级数的级数可能收敛也可能发散。\n\n> **注意。** 只有两种搭配能得出结论：小于收敛级数，或大于发散级数。",
  ],
  (rng) => {
    const big = rng.bool();
    const conv = rng.bool();
    const c = rng.int(1, 12);
    const p = rng.int(2, 6);
    const [b, bp] = conv
      ? [`\\frac{${c}}{n^{${p}}}`, `${p}`]
      : rng.pick([
          [`\\frac{${c}}{n}`, "1"],
          [`\\frac{${c}}{\\sqrt{n}}`, "\\frac{1}{2}"],
        ] as const);
    const ineq = big ? `a_{n} \\ge ${b} > 0` : `0 \\le a_{n} \\le ${b}`;
    const yes: Pair = ["$\\sum a_{n}$ converges", "$\\sum a_{n}$ 收敛"];
    const no: Pair = ["$\\sum a_{n}$ diverges", "$\\sum a_{n}$ 发散"];
    const none: Pair = ["Nothing can be concluded from this", "由此得不出任何结论"];
    const eq: Pair = ["$\\sum a_{n}$ equals the other sum", "$\\sum a_{n}$ 等于另一个和"];
    const correct = !big && conv ? yes : big && !conv ? no : none;
    const side = big ? (conv ? "above a convergent" : "above a divergent") : conv ? "below a convergent" : "below a divergent";
    const sideZh = big ? (conv ? "大于一个收敛" : "大于一个发散") : conv ? "小于一个收敛" : "小于一个发散";
    const parts: Step[] = [
      [
        ["Classify the comparison series", "判断比较级数"],
        t(
          `$\\sum ${b}$ is a constant multiple of a $p$-series, and it ${conv ? "converges" : "diverges"}:`,
          `$\\sum ${b}$ 是 $p$ 级数的常数倍，它${conv ? "收敛" : "发散"}：`,
        ),
        [`p = ${bp} ${conv ? ">" : "\\le"} 1`],
      ],
      [
        ["Check the direction", "检查方向"],
        t(
          `So $a_{n}$ lies ${side} series. ${correct === none ? "That direction proves nothing." : "That is a direction the comparison test uses."}`,
          `所以 $a_{n}$ ${sideZh}级数。${correct === none ? "这个方向证明不了什么。" : "这正是比较检验所用的方向。"}`,
        ),
      ],
    ];
    const smaller = `\\frac{${c}}{n^{2}}`;
    const check: Pair =
      correct === yes
        ? [
            `Argue with partial sums instead: they increase, because $a_{n} \\ge 0$, and each is at most the matching partial sum of $\\sum ${b}$, which stays below its finite sum. An increasing sequence that is bounded above converges.`,
            `改用部分和论证：因为 $a_{n} \\ge 0$，部分和递增，并且每个都不超过 $\\sum ${b}$ 对应的部分和，后者小于它有限的和。有上界的递增数列收敛。`,
          ]
        : correct === no
          ? [
              `Argue with partial sums instead: each is at least the matching partial sum of $\\sum ${b}$, and those grow without bound. So the partial sums of $\\sum a_{n}$ grow without bound too.`,
              `改用部分和论证：每个部分和都不小于 $\\sum ${b}$ 对应的部分和，而后者无限增大。所以 $\\sum a_{n}$ 的部分和也无限增大。`,
            ]
          : big
            ? [
                `Two examples fit the condition and disagree: $a_{n} = ${b}$ gives a convergent series, while $a_{n} = \\frac{${c}}{n}$, which is at least $${b}$, gives a divergent one.`,
                `两个满足条件的例子结论不同：$a_{n} = ${b}$ 给出收敛级数，而不小于 $${b}$ 的 $a_{n} = \\frac{${c}}{n}$ 给出发散级数。`,
              ]
            : [
                `Two examples fit the condition and disagree: $a_{n} = ${b}$ gives a divergent series, while $a_{n} = ${smaller}$, which is at most $${b}$, gives a convergent one.`,
                `两个满足条件的例子结论不同：$a_{n} = ${b}$ 给出发散级数，而不超过 $${b}$ 的 $a_{n} = ${smaller}$ 给出收敛级数。`,
              ];
    const why = (o: Pair): readonly [string, string] => {
      if (o === yes)
        return correct === no
          ? [
              "Its partial sums are at least those of a divergent series of positive terms, so they grow without bound",
              "它的部分和不小于一个正项发散级数的部分和，所以无限增大",
            ]
          : [
              `That needs $a_{n}$ below a convergent series, but here it lies ${side} one`,
              `这需要 $a_{n}$ 小于收敛级数，但这里它${sideZh}级数`,
            ];
      if (o === no)
        return correct === yes
          ? [
              "Its partial sums are at most those of a convergent series, so they stay bounded",
              "它的部分和不超过一个收敛级数的部分和，所以有界",
            ]
          : [
              `That needs $a_{n}$ above a divergent series, but here it lies ${side} one`,
              `这需要 $a_{n}$ 大于发散级数，但这里它${sideZh}级数`,
            ];
      if (o === none)
        return correct === yes
          ? ["This direction does decide: below a convergent series means convergence", "这个方向能得出结论：小于收敛级数就收敛"]
          : ["This direction does decide: above a divergent series means divergence", "这个方向能得出结论：大于发散级数就发散"];
      return [
        "A comparison gives at most an inequality between the sums, never their equality",
        "比较最多给出两个和之间的不等式，不会给出相等",
      ];
    };
    return seriesPicked(
      rng,
      [
        `For every $n \\ge 1$, $${ineq}$. What follows about $\\sum_{n=1}^{\\infty} a_{n}$?`,
        `对每个 $n \\ge 1$，都有 $${ineq}$。关于 $\\sum_{n=1}^{\\infty} a_{n}$ 能得出什么？`,
      ],
      correct,
      [yes, no, none, eq].filter((o) => o !== correct).map((o) => [o, ...why(o)] as const),
      parts,
      check,
    );
  },
);

const pForComparison = point(
  "choosing-the-power-to-compare-with",
  ["Choosing the power to compare with", "选择用于比较的幂"],
  [
    "The limit comparison test needs a good comparison series. Keep only the dominant term of the numerator and of the denominator. A root halves the exponent, so $\\sqrt{n^{m}}$ behaves like $n^{m/2}$, and the power to compare with is the degree of the denominator minus the degree of the numerator. For $\\frac{2n + 1}{\\sqrt{n^{5} + 3}}$ the degrees are $1$ and $\\frac{5}{2}$, so $p = \\frac{3}{2}$ and the series converges.\n\nCheck: the ratio of the terms to $\\frac{1}{n^{3/2}}$ has a finite nonzero limit, $\\lim_{n \\to \\infty} \\frac{2n + 1}{\\sqrt{n^{5} + 3}} \\cdot n^{3/2} = 2$.\n\n> **Watch out.** Under a root the degree is halved: $\\sqrt{n^{5}}$ behaves like $n^{5/2}$, not $n^{5}$.",
    "极限比较检验需要一个合适的比较级数。分子和分母都只保留主导项。根号使指数减半，所以 $\\sqrt{n^{m}}$ 的行为像 $n^{m/2}$，用于比较的幂就是分母的次数减去分子的次数。对 $\\frac{2n + 1}{\\sqrt{n^{5} + 3}}$，次数分别是 $1$ 和 $\\frac{5}{2}$，所以 $p = \\frac{3}{2}$，级数收敛。\n\n检验：通项与 $\\frac{1}{n^{3/2}}$ 之比的极限有限且不为零，$\\lim_{n \\to \\infty} \\frac{2n + 1}{\\sqrt{n^{5} + 3}} \\cdot n^{3/2} = 2$。\n\n> **注意。** 根号下的次数要减半：$\\sqrt{n^{5}}$ 的行为像 $n^{5/2}$，而不是 $n^{5}$。",
  ],
  (rng) => {
    const i = rng.int(1, 2);
    const m = rng.int(2 * i + 1, 9);
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    const d = rng.int(1, 9);
    const answer = Q.of(m - 2 * i, 2);
    const half = Q.of(m, 2).toLatex();
    const lead = i === 1 ? "n" : `n^{${i}}`;
    const top = poly([a, lead], [b, ""]);
    const nP = answer.eq(Q.one) ? "n" : `n^{${answer.toLatex()}}`;
    const parts: Step[] = [
      [
        ["Keep the dominant terms", "保留主导项"],
        t(
          `The numerator behaves like $${a === 1 ? "" : a}${lead}$, and under the root $n^{${m}}$ dominates, so the denominator behaves like $n^{${half}}$:`,
          `分子的行为像 $${a === 1 ? "" : a}${lead}$；根号下 $n^{${m}}$ 占主导，所以分母的行为像 $n^{${half}}$：`,
        ),
        [`\\frac{${top}}{\\sqrt{n^{${m}} + ${d}}} \\sim \\frac{${a === 1 ? "" : a}${lead}}{n^{${half}}}`],
      ],
      [
        ["Subtract the degrees", "次数相减"],
        t(
          "The power to compare with is the degree of the denominator minus that of the numerator:",
          "用于比较的幂是分母的次数减去分子的次数：",
        ),
        [`p = ${half} - ${i} = ${answer.toLatex()}`],
      ],
    ];
    return seriesSolved(
      [
        `To test $\\sum_{n=1}^{\\infty} \\frac{${top}}{\\sqrt{n^{${m}} + ${d}}}$, it is compared with $\\sum_{n=1}^{\\infty} \\frac{1}{n^{p}}$, so that the limit of the ratio of terms is finite and not zero. Find $p$.`,
        `为了检验 $\\sum_{n=1}^{\\infty} \\frac{${top}}{\\sqrt{n^{${m}} + ${d}}}$，把它与 $\\sum_{n=1}^{\\infty} \\frac{1}{n^{p}}$ 比较，使通项之比的极限有限且不为零。求 $p$。`,
      ],
      answer,
      parts,
      [
        `Compute the limit the test needs, with $p = ${answer.toLatex()}$. Dividing the numerator by $${lead}$ and the denominator by $n^{${half}}$ gives $${a}$ over $1$: $\\lim_{n \\to \\infty} \\frac{${top}}{\\sqrt{n^{${m}} + ${d}}} \\cdot ${nP} = ${a}$. The limit is finite and not zero, as required.`,
        `用 $p = ${answer.toLatex()}$ 计算检验所需的极限。分子除以 $${lead}$，分母除以 $n^{${half}}$，得到 $${a}$ 比 $1$：$\\lim_{n \\to \\infty} \\frac{${top}}{\\sqrt{n^{${m}} + ${d}}} \\cdot ${nP} = ${a}$。极限有限且不为零，符合要求。`,
      ],
      [
        [
          m - i,
          `This forgets the root: $\\sqrt{n^{${m}}}$ behaves like $n^{${half}}$, not $n^{${m}}$`,
          `这里忘了根号：$\\sqrt{n^{${m}}}$ 的行为像 $n^{${half}}$，而不是 $n^{${m}}$`,
        ],
        [Q.of(m + 2 * i, 2), "This adds the degrees; the degree of the numerator is subtracted", "这里把次数相加了；分子的次数应当减去"],
        [Q.of(m, 2), `This ignores the numerator, which grows like $${lead}$`, `这里忽略了分子，它像 $${lead}$ 一样增长`],
      ],
    );
  },
);

const betweenPartialSums = point(
  "the-sum-lies-between-consecutive-partial-sums",
  ["The sum lies between consecutive partial sums", "和位于相邻部分和之间"],
  [
    "For an alternating series with decreasing terms and positive first term, the partial sums go up and down around the sum. Odd partial sums are too high and even ones too low, so the sum always lies between two consecutive partial sums. The alternating harmonic series has the sum $\\ln 2$, and its partial sums $S_{3} = \\frac{5}{6}$ and $S_{4}$ lie on either side of it. Indeed, $S_{4} = 1 - \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{4} = \\frac{7}{12}$.\n\nCheck: $\\ln 2 \\approx 0.693$ lies between $\\frac{7}{12} \\approx 0.583$ and $\\frac{5}{6} \\approx 0.833$.\n\n> **Watch out.** The next partial sum is on the other side of $S$, so step from $S_{N}$ in the direction of the sign of the next term.",
    "对通项递减、首项为正的交错级数，部分和在和的上下交替。奇数项部分和偏高，偶数项部分和偏低，所以和总是在两个相邻的部分和之间。交错调和级数的和是 $\\ln 2$，它的部分和 $S_{3} = \\frac{5}{6}$ 和 $S_{4}$ 分别在和的两侧。事实上 $S_{4} = 1 - \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{4} = \\frac{7}{12}$。\n\n检验：$\\ln 2 \\approx 0.693$ 在 $\\frac{7}{12} \\approx 0.583$ 与 $\\frac{5}{6} \\approx 0.833$ 之间。\n\n> **注意。** 下一个部分和在 $S$ 的另一侧，所以要从 $S_{N}$ 出发，朝下一项符号的方向走。",
  ],
  (rng) => {
    const N = rng.int(3, 14);
    const S = Q.of(rng.int(50, 500), 100);
    const b = Q.of(rng.int(1, 40), 100);
    const even = N % 2 === 0;
    const low = S.sub(b);
    const high = S.add(b);
    const next = even ? high : low;
    const interval = (p: Q, q: Q): Pair => same2(`${dec(p)} < S < ${dec(q)}`);
    const parts: Step[] = [
      [
        ["Find the sign of the next term", "确定下一项的符号"],
        t(
          `Term $n = ${N + 1}$ carries the sign of $(-1)^{${N + 2}}$, so it is ${even ? "added" : "subtracted"}:`,
          `第 $n = ${N + 1}$ 项带有 $(-1)^{${N + 2}}$ 的符号，所以要${even ? "加上" : "减去"}：`,
        ),
        [`S_{${N + 1}} = ${dec(S)} ${even ? "+" : "-"} ${dec(b)} = ${dec(next)}`],
      ],
      [
        ["Place the sum", "确定和的位置"],
        t(
          `The sum lies between the consecutive partial sums $S_{${N}}$ and $S_{${N + 1}}$:`,
          `和位于相邻的部分和 $S_{${N}}$ 与 $S_{${N + 1}}$ 之间：`,
        ),
        [even ? `${dec(S)} < S < ${dec(high)}` : `${dec(low)} < S < ${dec(S)}`],
      ],
    ];
    const outside: readonly [string, string] = [
      `$S$ cannot be farther than $${dec(b)}$ from $S_{${N}}$, because it lies between $S_{${N}}$ and $S_{${N + 1}}$`,
      `$S$ 与 $S_{${N}}$ 的距离不超过 $${dec(b)}$，因为它在 $S_{${N}}$ 与 $S_{${N + 1}}$ 之间`,
    ];
    return seriesPicked(
      rng,
      [
        `$S = \\sum_{n=1}^{\\infty} (-1)^{n+1} b_{n}$, where the positive terms $b_{n}$ decrease to $0$. If $S_{${N}} = ${dec(S)}$ and $b_{${N + 1}} = ${dec(b)}$, which is true?`,
        `$S = \\sum_{n=1}^{\\infty} (-1)^{n+1} b_{n}$，其中正项 $b_{n}$ 递减趋于 $0$。如果 $S_{${N}} = ${dec(S)}$，$b_{${N + 1}} = ${dec(b)}$，哪项正确？`,
      ],
      even ? interval(S, high) : interval(low, S),
      [
        [
          even ? interval(low, S) : interval(S, high),
          `This is on the wrong side of $S_{${N}}$: the next term is ${even ? "added, so $S$ is above" : "subtracted, so $S$ is below"} $S_{${N}}$`,
          `这在 $S_{${N}}$ 错误的一侧：下一项要${even ? "加上，所以 $S$ 大于" : "减去，所以 $S$ 小于"} $S_{${N}}$`,
        ],
        [interval(high, high.add(b)), ...outside],
        [interval(low.sub(b), low), ...outside],
      ],
      parts,
      [
        `Look one step further: $S_{${N + 2}}$ is $S_{${N + 1}}$ ${even ? "minus" : "plus"} a term no larger than $${dec(b)}$, so it lands between $S_{${N}}$ and $S_{${N + 1}}$ again, and so does every later partial sum. Their limit $S$ is therefore in the same interval.`,
        `再往后看一步：$S_{${N + 2}}$ 是 $S_{${N + 1}}$ ${even ? "减去" : "加上"}一个不超过 $${dec(b)}$ 的项，所以它又落在 $S_{${N}}$ 与 $S_{${N + 1}}$ 之间，以后的每个部分和也都如此。因此它们的极限 $S$ 也在这个区间内。`,
      ],
    );
  },
);

const ratioWithNN = point(
  "the-ratio-test-with-n-to-the-n",
  ["The ratio test with n to the n", "含 n 的 n 次幂的比值检验"],
  [
    "When $n^{n}$ appears, the ratio simplifies to a power whose limit involves $e$. For $a_{n} = \\frac{n!}{n^{n}}$, the ratio is $\\frac{(n + 1)!}{(n + 1)^{n+1}} \\cdot \\frac{n^{n}}{n!} = \\left(\\frac{n}{n + 1}\\right)^{n}$. This tends to $\\frac{1}{e}$, so a factor $c^{n}$ in the numerator gives $L = \\frac{c}{e}$, and the decision depends on how $c$ compares with $e$.\n\nCheck: with $c = 2$, $L = \\frac{2}{e} \\approx 0.74$, and at $n = 10$ the ratio is already $2\\left(\\frac{10}{11}\\right)^{10} \\approx 0.77$, below $1$.\n\n> **Watch out.** $\\left(\\frac{n}{n + 1}\\right)^{n}$ tends to $\\frac{1}{e}$, not to $1$: the base tends to $1$, but the exponent grows.",
    "出现 $n^{n}$ 时，比值化简后是一个幂，其极限涉及 $e$。对 $a_{n} = \\frac{n!}{n^{n}}$，比值是 $\\frac{(n + 1)!}{(n + 1)^{n+1}} \\cdot \\frac{n^{n}}{n!} = \\left(\\frac{n}{n + 1}\\right)^{n}$。它趋于 $\\frac{1}{e}$，所以分子中的因子 $c^{n}$ 给出 $L = \\frac{c}{e}$，结论取决于 $c$ 与 $e$ 的大小。\n\n检验：取 $c = 2$，$L = \\frac{2}{e} \\approx 0.74$，而在 $n = 10$ 时比值已经是 $2\\left(\\frac{10}{11}\\right)^{10} \\approx 0.77$，小于 $1$。\n\n> **注意。** $\\left(\\frac{n}{n + 1}\\right)^{n}$ 趋于 $\\frac{1}{e}$，而不是 $1$：底数趋于 $1$，但指数在增大。",
  ],
  (rng) => {
    const c = rng.int(1, 6);
    const d = rng.int(1, 9);
    const conv = c <= 2;
    const cc = c === 1 ? "" : `${c}`;
    const num = `${d === 1 ? "" : `${d} \\cdot `}${c === 1 ? "" : `${c}^{n} \\cdot `}n!`;
    const L = `L = \\frac{${c}}{e}`;
    const say = (l: string, yes: boolean): Pair => [
      `$${l}$, so it ${yes ? "converges" : "diverges"}`,
      `$${l}$，所以它${yes ? "收敛" : "发散"}`,
    ];
    const parts: Step[] = [
      [
        ["Form the ratio", "写出比值"],
        t(
          `Going from $n$ to $n + 1$ multiplies the numerator by $${cc}(n + 1)$ and changes $n^{n}$ to $(n + 1)^{n+1}$${d === 1 ? "" : `; the factor $${d}$ cancels`}:`,
          `从 $n$ 到 $n + 1$，分子乘以 $${cc}(n + 1)$，$n^{n}$ 变为 $(n + 1)^{n+1}$${d === 1 ? "" : `；因子 $${d}$ 约去`}：`,
        ),
        [`\\frac{a_{n+1}}{a_{n}} = \\frac{${cc}(n + 1) \\, n^{n}}{(n + 1)^{n+1}} = ${cc}\\left(\\frac{n}{n + 1}\\right)^{n}`],
      ],
      [
        ["Take the limit", "求极限"],
        t(
          "Since $\\left(1 + \\frac{1}{n}\\right)^{n}$ tends to $e$, its reciprocal $\\left(\\frac{n}{n + 1}\\right)^{n}$ tends to $\\frac{1}{e}$:",
          "因为 $\\left(1 + \\frac{1}{n}\\right)^{n}$ 趋于 $e$，它的倒数 $\\left(\\frac{n}{n + 1}\\right)^{n}$ 趋于 $\\frac{1}{e}$：",
        ),
        [`L = \\frac{${c}}{e} \\approx ${(c / Math.E).toFixed(3)} ${conv ? "<" : ">"} 1`],
      ],
    ];
    const at10 = (c * (10 / 11) ** 10).toFixed(3);
    return seriesPicked(
      rng,
      [
        `What does the ratio test say about $\\sum_{n=1}^{\\infty} \\frac{${num}}{n^{n}}$?`,
        `比值检验对 $\\sum_{n=1}^{\\infty} \\frac{${num}}{n^{n}}$ 给出什么结论？`,
      ],
      say(L, conv),
      [
        [
          say(L, !conv),
          `$e \\approx 2.718$, so $\\frac{${c}}{e}$ is ${conv ? "less" : "greater"} than $1$`,
          `$e \\approx 2.718$，所以 $\\frac{${c}}{e}$ ${conv ? "小于" : "大于"} $1$`,
        ],
        [
          say(`L = ${c}`, c < 1),
          "This drops the factor $\\left(\\frac{n}{n + 1}\\right)^{n}$, which tends to $\\frac{1}{e}$, not to $1$",
          "这里丢掉了因子 $\\left(\\frac{n}{n + 1}\\right)^{n}$，它趋于 $\\frac{1}{e}$，而不是 $1$",
        ],
        [
          say("L = 0", true),
          `The factorial grows almost as fast as $n^{n}$ here: the ratio tends to $\\frac{${c}}{e}$, not to $0$`,
          `这里阶乘的增长几乎和 $n^{n}$ 一样快：比值趋于 $\\frac{${c}}{e}$，而不是 $0$`,
        ],
      ],
      parts,
      conv
        ? [
            `Look at actual ratios: $\\left(\\frac{n}{n + 1}\\right)^{n}$ decreases toward $\\frac{1}{e}$, and at $n = 10$ the ratio is $${cc}\\left(\\frac{10}{11}\\right)^{10} \\approx ${at10}$. From there on every ratio is at most this, below $1$, so the terms shrink at least as fast as a convergent geometric series.`,
            `看实际的比值：$\\left(\\frac{n}{n + 1}\\right)^{n}$ 递减趋于 $\\frac{1}{e}$，在 $n = 10$ 时比值是 $${cc}\\left(\\frac{10}{11}\\right)^{10} \\approx ${at10}$。此后每个比值都不超过它，小于 $1$，所以通项至少像一个收敛的几何级数那样快地减小。`,
          ]
        : [
            `Look at the terms instead: $\\left(\\frac{n}{n + 1}\\right)^{n}$ decreases toward $\\frac{1}{e}$, so every ratio is above $\\frac{${c}}{e}$, which is above $1$. The terms keep growing, so they do not tend to $0$, and the $n$th term test confirms that the series diverges.`,
            `改看通项：$\\left(\\frac{n}{n + 1}\\right)^{n}$ 递减趋于 $\\frac{1}{e}$，所以每个比值都大于 $\\frac{${c}}{e}$，而它大于 $1$。通项不断增大，不趋于 $0$，第 $n$ 项检验也说明级数发散。`,
          ],
    );
  },
);

const rootWithE = point(
  "the-root-test-with-a-limit-equal-to-a-power-of-e",
  ["The root test with a power of e", "极限为 e 的幂的根值检验"],
  [
    "The $n$th root of $\\left(1 + \\frac{k}{n}\\right)^{n^{2}}$ is $\\left(1 + \\frac{k}{n}\\right)^{n}$, which tends to $e^{k}$, not to $1$. With a factor $\\frac{1}{c^{n}}$ the root test gives $L = \\frac{e^{k}}{c}$, so the series converges exactly when $c > e^{k}$. For $k = 1$ and $c = 3$ the limit is $\\lim_{n \\to \\infty} \\frac{1}{3}\\left(1 + \\frac{1}{n}\\right)^{n} = \\frac{e}{3}$.\n\nCheck: $\\frac{e}{3} \\approx 0.906 < 1$, and at $n = 100$ the root is already $\\frac{1}{3}(1.01)^{100} \\approx 0.902$.\n\n> **Watch out.** The base tends to $1$, but the exponent $n^{2}$ grows, so saying that a power of something near $1$ is near $1$ is not a valid argument here.",
    "$\\left(1 + \\frac{k}{n}\\right)^{n^{2}}$ 的 $n$ 次方根是 $\\left(1 + \\frac{k}{n}\\right)^{n}$，它趋于 $e^{k}$，而不是 $1$。带有因子 $\\frac{1}{c^{n}}$ 时，根值检验给出 $L = \\frac{e^{k}}{c}$，所以级数恰好在 $c > e^{k}$ 时收敛。取 $k = 1$，$c = 3$，极限是 $\\lim_{n \\to \\infty} \\frac{1}{3}\\left(1 + \\frac{1}{n}\\right)^{n} = \\frac{e}{3}$。\n\n检验：$\\frac{e}{3} \\approx 0.906 < 1$，而在 $n = 100$ 时根已经是 $\\frac{1}{3}(1.01)^{100} \\approx 0.902$。\n\n> **注意。** 底数趋于 $1$，但指数 $n^{2}$ 在增大，所以说接近 $1$ 的数的幂也接近 $1$，在这里是不成立的论证。",
  ],
  (rng) => {
    const k = rng.int(1, 3);
    const c = rng.int(2, 25);
    const power = k === 1 ? "e" : `e^{${k}}`;
    const size = Math.E ** k;
    const conv = c > size;
    const L = `L = \\frac{${power}}{${c}}`;
    const say = (l: string, yes: boolean): Pair => [
      `$${l}$, so it ${yes ? "converges" : "diverges"}`,
      `$${l}$，所以它${yes ? "收敛" : "发散"}`,
    ];
    const term = `\\frac{1}{${c}^{n}}\\left(1 + \\frac{${k}}{n}\\right)^{n^{2}}`;
    const parts: Step[] = [
      [
        ["Take the nth root", "开 n 次方"],
        t("The root divides each exponent by $n$:", "开方使每个指数除以 $n$："),
        [`\\sqrt[n]{a_{n}} = \\frac{1}{${c}}\\left(1 + \\frac{${k}}{n}\\right)^{n}`],
      ],
      [
        ["Take the limit", "求极限"],
        t(
          `Since $\\left(1 + \\frac{${k}}{n}\\right)^{n}$ tends to $${power}$, about $${size.toFixed(2)}$:`,
          `因为 $\\left(1 + \\frac{${k}}{n}\\right)^{n}$ 趋于 $${power}$，约为 $${size.toFixed(2)}$：`,
        ),
        [`L = \\frac{${power}}{${c}} \\approx ${(size / c).toFixed(3)} ${conv ? "<" : ">"} 1`],
      ],
    ];
    return seriesPicked(
      rng,
      [`What does the root test say about $\\sum_{n=1}^{\\infty} ${term}$?`, `根值检验对 $\\sum_{n=1}^{\\infty} ${term}$ 给出什么结论？`],
      say(L, conv),
      [
        [
          say(L, !conv),
          `$${power} \\approx ${size.toFixed(2)}$, which is ${conv ? "less" : "greater"} than $${c}$`,
          `$${power} \\approx ${size.toFixed(2)}$，它${conv ? "小于" : "大于"} $${c}$`,
        ],
        [
          say(`L = \\frac{1}{${c}}`, true),
          `This treats $\\left(1 + \\frac{${k}}{n}\\right)^{n}$ as tending to $1$; it tends to $${power}$`,
          `这里把 $\\left(1 + \\frac{${k}}{n}\\right)^{n}$ 当作趋于 $1$；它趋于 $${power}$`,
        ],
        [
          ["$L = 1$, so the test says nothing", "$L = 1$，所以该检验不提供信息"],
          `The root is $\\frac{1}{${c}}$ times a quantity tending to $${power}$, so $L$ is not $1$`,
          `根是 $\\frac{1}{${c}}$ 乘以一个趋于 $${power}$ 的量，所以 $L$ 不是 $1$`,
        ],
      ],
      parts,
      conv
        ? [
            `Compare with a geometric series instead: $\\left(1 + \\frac{${k}}{n}\\right)^{n}$ increases toward $${power}$, so every root is below $L$, and $a_{n} < L^{n}$ for every $n$. The geometric series $\\sum L^{n}$ converges because $L < 1$, so the given series converges as well.`,
            `改与几何级数比较：$\\left(1 + \\frac{${k}}{n}\\right)^{n}$ 递增趋于 $${power}$，所以每个根都小于 $L$，对每个 $n$ 都有 $a_{n} < L^{n}$。因为 $L < 1$，几何级数 $\\sum L^{n}$ 收敛，所以原级数也收敛。`,
          ]
        : [
            "Look at the terms instead: once the root is above $1$, the term $a_{n}$, its $n$th power, is above $1$ too. The terms do not tend to $0$, so the $n$th term test confirms that the series diverges.",
            "改看通项：一旦根大于 $1$，通项 $a_{n}$ 作为它的 $n$ 次方也大于 $1$。通项不趋于 $0$，第 $n$ 项检验也说明级数发散。",
          ],
    );
  },
);

const conditionalParameter = point(
  "where-conditional-convergence-happens",
  ["Where conditional convergence happens", "条件收敛发生的范围"],
  [
    "For $\\sum \\frac{(-1)^{n}}{n^{s}}$, the series converges absolutely for $s > 1$, conditionally for $0 < s \\le 1$, and diverges for $s \\le 0$. The boundary $s = 1$ belongs to the conditional case, because it gives the alternating harmonic series, $\\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n} = \\ln 2$.\n\nCheck: at $s = 1$ the absolute values form the harmonic series, which diverges, while the alternating series test still applies. At $s = 0$ the terms are $\\pm 1$ and do not tend to $0$.\n\n> **Watch out.** If the exponent is $3p$, solve $0 < 3p \\le 1$ for $p$: the answer is $0 < p \\le \\frac{1}{3}$, not $0 < p \\le 1$.",
    "对 $\\sum \\frac{(-1)^{n}}{n^{s}}$，当 $s > 1$ 时绝对收敛，当 $0 < s \\le 1$ 时条件收敛，当 $s \\le 0$ 时发散。边界 $s = 1$ 属于条件收敛，因为此时是交错调和级数，$\\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n} = \\ln 2$。\n\n检验：$s = 1$ 时绝对值构成调和级数，它发散，而交错级数检验仍然适用。$s = 0$ 时通项是 $\\pm 1$，不趋于 $0$。\n\n> **注意。** 如果指数是 $3p$，要对 $p$ 解 $0 < 3p \\le 1$：答案是 $0 < p \\le \\frac{1}{3}$，而不是 $0 < p \\le 1$。",
  ],
  (rng) => {
    const k = rng.int(2, 9);
    const c = rng.int(1, 9);
    const v = `\\frac{1}{${k}}`;
    const top = c === 1 ? "(-1)^{n}" : `${c}(-1)^{n}`;
    const parts: Step[] = [
      [
        ["Find where it converges absolutely", "确定绝对收敛的范围"],
        t(
          `The absolute values form a $p$-series with exponent $${k}p$, which diverges when the exponent is at most $1$:`,
          `绝对值构成指数为 $${k}p$ 的 $p$ 级数，指数不超过 $1$ 时发散：`,
        ),
        [`${k}p \\le 1 \\iff p \\le ${v}`],
      ],
      [
        ["Find where it still converges", "确定仍然收敛的范围"],
        t(
          "The alternating series test needs the sizes of the terms to decrease to $0$, which happens when the exponent is positive. Together:",
          "交错级数检验要求通项的大小递减趋于 $0$，这在指数为正时成立。合起来：",
        ),
        [`${k}p > 0 \\iff p > 0`, `0 < p \\le ${v}`],
      ],
    ];
    return seriesPicked(
      rng,
      [
        `For which $p$ does $\\sum_{n=1}^{\\infty} \\frac{${top}}{n^{${k}p}}$ converge conditionally?`,
        `当 $p$ 取何值时，$\\sum_{n=1}^{\\infty} \\frac{${top}}{n^{${k}p}}$ 条件收敛？`,
      ],
      same2(`0 < p \\le ${v}`),
      [
        [
          same2(`p > ${v}`),
          "For these $p$ the exponent is above $1$, so the series converges absolutely, not conditionally",
          "对这些 $p$，指数大于 $1$，级数绝对收敛，而不是条件收敛",
        ],
        [
          same2(`0 < p < ${v}`),
          `This leaves out $p = ${v}$, where the series is a multiple of the alternating harmonic series, which converges conditionally`,
          `这里漏掉了 $p = ${v}$，此时级数是交错调和级数的倍数，条件收敛`,
        ],
        [
          same2(`p \\le ${v}`),
          "This includes $p \\le 0$, where the terms do not tend to $0$ and the series diverges",
          "这里包含了 $p \\le 0$，此时通项不趋于 $0$，级数发散",
        ],
      ],
      parts,
      [
        `Test the two ends. At $p = ${v}$ the exponent is $1$, and the series is ${c === 1 ? "" : `$${c}$ times `}the alternating series $\\sum \\frac{(-1)^{n}}{n}$, which converges, while $\\sum \\frac{${c}}{n}$ diverges: conditional. At $p = 0$ the terms are $\\pm ${c}$, which do not tend to $0$, so the series diverges there.`,
        `检验两个端点。$p = ${v}$ 时指数为 $1$，级数是交错级数 $\\sum \\frac{(-1)^{n}}{n}$${c === 1 ? "" : `的 $${c}$ 倍`}，它收敛，而 $\\sum \\frac{${c}}{n}$ 发散：条件收敛。$p = 0$ 时通项是 $\\pm ${c}$，不趋于 $0$，所以级数在那里发散。`,
      ],
    );
  },
);

const overOrUnderPartial = point(
  "whether-a-partial-sum-is-too-high-or-too-low",
  ["Whether a partial sum is too high or too low", "部分和偏高还是偏低"],
  [
    "The alternating series error bound gives more than a size. The first omitted term also gives the sign of the error. With a positive first term, stopping after an odd number of terms overestimates the sum, because the next term is subtracted, and stopping after an even number underestimates it. Take the alternating harmonic series, $S = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n} = 1 - \\frac{1}{2} + \\frac{1}{3} - \\cdots$. Its partial sum $S_{3} = \\frac{5}{6}$ is too high, by at most $\\frac{1}{4}$.\n\nCheck: $S = \\ln 2 \\approx 0.693$, and $\\frac{5}{6} - 0.693 \\approx 0.140$, which is positive and less than $\\frac{1}{4}$.\n\n> **Watch out.** The bound is the first omitted term $b_{N+1}$, not the last included term $b_{N}$.",
    "交错级数的误差界不只给出大小。第一个被舍去的项还给出误差的符号。首项为正时，取奇数项后停止会高估和，因为下一项要减去；取偶数项后停止会低估和。以交错调和级数为例，$S = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n} = 1 - \\frac{1}{2} + \\frac{1}{3} - \\cdots$。它的部分和 $S_{3} = \\frac{5}{6}$ 偏高，误差不超过 $\\frac{1}{4}$。\n\n检验：$S = \\ln 2 \\approx 0.693$，而 $\\frac{5}{6} - 0.693 \\approx 0.140$，为正且小于 $\\frac{1}{4}$。\n\n> **注意。** 误差界是第一个被舍去的项 $b_{N+1}$，而不是最后一个保留的项 $b_{N}$。",
  ],
  (rng) => {
    const p = rng.int(1, 3);
    const N = rng.int(3, p === 3 ? 8 : 20);
    const c = rng.int(1, 9);
    const odd = N % 2 === 1;
    const nextQ = Q.of(c, (N + 1) ** p);
    const thisQ = Q.of(c, N ** p);
    const claim = (over: boolean, v: Q): Pair => [
      `It is an ${over ? "overestimate" : "underestimate"}, by at most $${v.toLatex()}$`,
      `它${over ? "偏高" : "偏低"}，误差不超过 $${v.toLatex()}$`,
    ];
    const power = p === 1 ? "n" : `n^{${p}}`;
    const nextPower = p === 1 ? `${N + 1}` : `${N + 1}^{${p}}`;
    const parts: Step[] = [
      [
        ["Find the first omitted term", "找出第一个被舍去的项"],
        t(
          `$S_{${N}}$ stops at $n = ${N}$, so the first omitted term is $n = ${N + 1}$, with the sign of $(-1)^{${N + 2}}$:`,
          `$S_{${N}}$ 在 $n = ${N}$ 处停止，所以第一个被舍去的项是 $n = ${N + 1}$，符号是 $(-1)^{${N + 2}}$ 的符号：`,
        ),
        [`${odd ? "-" : "+"}\\frac{${c}}{${nextPower}} = ${odd ? "-" : ""}${nextQ.toLatex()}`],
      ],
      [
        ["Read the sign and the size", "读出符号和大小"],
        t(
          odd
            ? `The next term is subtracted, so the sum is below $S_{${N}}$: the partial sum is too high, by less than the size of that term:`
            : `The next term is added, so the sum is above $S_{${N}}$: the partial sum is too low, by less than the size of that term:`,
          odd
            ? `下一项要减去，所以和小于 $S_{${N}}$：部分和偏高，误差小于这一项的大小：`
            : `下一项要加上，所以和大于 $S_{${N}}$：部分和偏低，误差小于这一项的大小：`,
        ),
        [`0 < ${odd ? `S_{${N}} - S` : `S - S_{${N}}`} < ${nextQ.toLatex()}`],
      ],
    ];
    return seriesPicked(
      rng,
      [
        `Let $S = \\sum_{n=1}^{\\infty} (-1)^{n+1} \\frac{${c}}{${power}}$. How does $S_{${N}}$ compare with $S$?`,
        `设 $S = \\sum_{n=1}^{\\infty} (-1)^{n+1} \\frac{${c}}{${power}}$。$S_{${N}}$ 与 $S$ 相比如何？`,
      ],
      claim(odd, nextQ),
      [
        [
          claim(!odd, nextQ),
          `The term after $S_{${N}}$ is ${odd ? "subtracted, so $S$ is below" : "added, so $S$ is above"} $S_{${N}}$`,
          `$S_{${N}}$ 之后的项要${odd ? "减去，所以 $S$ 小于" : "加上，所以 $S$ 大于"} $S_{${N}}$`,
        ],
        [
          claim(odd, thisQ),
          `$${thisQ.toLatex()}$ is the last term included; the bound is the first term omitted, $${nextQ.toLatex()}$`,
          `$${thisQ.toLatex()}$ 是最后一个保留的项；误差界是第一个被舍去的项 $${nextQ.toLatex()}$`,
        ],
        [
          claim(!odd, thisQ),
          `Both parts are wrong: the next term is ${odd ? "subtracted" : "added"}, and the bound is the first omitted term, $${nextQ.toLatex()}$`,
          `两部分都错了：下一项要${odd ? "减去" : "加上"}，误差界是第一个被舍去的项 $${nextQ.toLatex()}$`,
        ],
      ],
      parts,
      [
        `Add one more term: $S_{${N + 1}}$ is $S_{${N}}$ ${odd ? "minus" : "plus"} $${nextQ.toLatex()}$, and it overshoots to the other side of $S$, so $S$ lies between $S_{${N + 1}}$ and $S_{${N}}$. Its distance from $S_{${N}}$ is therefore less than $${nextQ.toLatex()}$, and $S_{${N}}$ is on the ${odd ? "high" : "low"} side.`,
        `再加一项：$S_{${N + 1}}$ 是 $S_{${N}}$ ${odd ? "减去" : "加上"} $${nextQ.toLatex()}$，它越过 $S$ 到了另一侧，所以 $S$ 在 $S_{${N + 1}}$ 与 $S_{${N}}$ 之间。因此它与 $S_{${N}}$ 的距离小于 $${nextQ.toLatex()}$，而 $S_{${N}}$ 在${odd ? "偏高" : "偏低"}的一侧。`,
      ],
    );
  },
);

const logParameter = point(
  "a-parameter-in-a-logarithmic-series",
  ["A parameter in a logarithmic series", "对数级数中的参数"],
  [
    "By the integral test with $u = \\ln x$, $\\sum_{n=2}^{\\infty} \\frac{1}{n(\\ln n)^{s}}$ converges exactly when $s > 1$. Indeed, for $s > 1$ the integral is finite, $\\int_{2}^{\\infty} \\frac{dx}{x(\\ln x)^{s}} = \\frac{(\\ln 2)^{1-s}}{s - 1}$. When $s$ depends on a parameter, solve the strict inequality $s > 1$: for $s = 2p - 3$ this gives $p > 2$.\n\nCheck: at $p = 2$ the exponent is $1$, and the integral grows without bound, so $p = 2$ is rightly left out: $\\int_{2}^{N} \\frac{dx}{x \\ln x} = \\ln(\\ln N) - \\ln(\\ln 2)$.\n\n> **Watch out.** Dividing by a negative coefficient reverses the inequality: $-2p + 5 > 1$ gives $p < 2$.",
    "由积分检验，令 $u = \\ln x$，$\\sum_{n=2}^{\\infty} \\frac{1}{n(\\ln n)^{s}}$ 恰好在 $s > 1$ 时收敛。事实上，$s > 1$ 时积分有限，$\\int_{2}^{\\infty} \\frac{dx}{x(\\ln x)^{s}} = \\frac{(\\ln 2)^{1-s}}{s - 1}$。当 $s$ 依赖于参数时，解严格不等式 $s > 1$：对 $s = 2p - 3$，得到 $p > 2$。\n\n检验：$p = 2$ 时指数为 $1$，积分无限增大，所以去掉 $p = 2$ 是对的：$\\int_{2}^{N} \\frac{dx}{x \\ln x} = \\ln(\\ln N) - \\ln(\\ln 2)$。\n\n> **注意。** 除以负系数时不等号要改变方向：$-2p + 5 > 1$ 得到 $p < 2$。",
  ],
  (rng) => {
    const a = rng.int(2, 6) * rng.pick([-1, 1]);
    const b = rng.int(-5, 5);
    const v = Q.of(1 - b, a);
    const exp = poly([a, "p"], [b, ""]);
    const form = (sym: string) => same2(`p ${sym} ${v.toLatex()}`);
    const up = a > 0;
    const vNum = (1 - b) / a;
    const p0 = up ? Math.floor(vNum) + 1 : Math.ceil(vNum) - 1;
    const e0 = a * p0 + b;
    const parts: Step[] = [
      [
        ["Use the integral test", "用积分检验"],
        t(
          "With $u = \\ln x$, the integral of $\\frac{1}{x(\\ln x)^{s}}$ is finite exactly when $s > 1$, so the exponent must satisfy a strict inequality:",
          "令 $u = \\ln x$，$\\frac{1}{x(\\ln x)^{s}}$ 的积分恰好在 $s > 1$ 时有限，所以指数要满足严格不等式：",
        ),
        [`${exp} > 1`],
      ],
      [
        ["Solve for p", "解出 p"],
        t(
          up
            ? `Divide by the positive coefficient $${a}$, keeping the direction:`
            : `Divide by the negative coefficient $${a}$, reversing the direction:`,
          up ? `除以正系数 $${a}$，方向不变：` : `除以负系数 $${a}$，方向改变：`,
        ),
        [`${a}p > ${1 - b}`, `p ${up ? ">" : "<"} ${v.toLatex()}`],
      ],
    ];
    return seriesPicked(
      rng,
      [
        `For which $p$ does $\\sum_{n=2}^{\\infty} \\frac{1}{n(\\ln n)^{${exp}}}$ converge?`,
        `当 $p$ 取何值时，$\\sum_{n=2}^{\\infty} \\frac{1}{n(\\ln n)^{${exp}}}$ 收敛？`,
      ],
      form(up ? ">" : "<"),
      [
        [
          form(up ? "<" : ">"),
          up
            ? "Dividing by a positive coefficient keeps the direction of the inequality"
            : "Dividing by a negative coefficient reverses the direction of the inequality",
          up ? "除以正系数时不等号方向不变" : "除以负系数时不等号方向要改变",
        ],
        [
          form(up ? "\\ge" : "\\le"),
          `At $p = ${v.toLatex()}$ the exponent is $1$, and $\\sum \\frac{1}{n \\ln n}$ diverges, so the boundary is left out`,
          `$p = ${v.toLatex()}$ 时指数为 $1$，而 $\\sum \\frac{1}{n \\ln n}$ 发散，所以边界不包含在内`,
        ],
        [
          form(up ? "\\le" : "\\ge"),
          "This has the wrong direction, and it also includes the boundary, where the series diverges",
          "这个方向错了，而且还包含了级数发散的边界",
        ],
      ],
      parts,
      [
        `Try a value. At $p = ${p0}$, on the side of the answer, the exponent is $${e0}$, which is greater than $1$, so the series converges there. At $p = ${v.toLatex()}$ itself the exponent is $1$, and $\\sum \\frac{1}{n \\ln n}$ diverges, so the inequality is strict.`,
        `代入一个值。在答案一侧取 $p = ${p0}$，指数是 $${e0}$，大于 $1$，所以级数在那里收敛。在 $p = ${v.toLatex()}$ 处指数为 $1$，而 $\\sum \\frac{1}{n \\ln n}$ 发散，所以不等式是严格的。`,
      ],
    );
  },
);

const testThatFails = point(
  "tests-that-are-certain-to-say-nothing",
  ["Tests that are certain to say nothing", "肯定不提供信息的检验"],
  [
    "Good selection also rules tests out. On any rational function of $n$, the ratio test and the root test both give $L = 1$, so they say nothing, whether the series converges or not. For $a_{n} = \\frac{n + 1}{n^{3}}$ the ratio test gives $\\lim_{n \\to \\infty} \\frac{(n + 2)n^{3}}{(n + 1)^{3}(n + 1)} = 1$. Comparing with a $p$-series is the method that works: here $a_{n}$ behaves like $\\frac{1}{n^{2}}$, so the series converges.\n\nCheck: the ratio test also gives $1$ on $\\sum \\frac{1}{n}$, which diverges, and on $\\sum \\frac{1}{n^{2}}$, which converges, so $L = 1$ cannot tell them apart.\n\n> **Watch out.** $L = 1$ is not a verdict of convergence or divergence; it means the test has failed.",
    "好的选择也包括排除检验。对 $n$ 的任何有理函数，比值检验和根值检验都给出 $L = 1$，所以不提供信息，无论级数是否收敛。对 $a_{n} = \\frac{n + 1}{n^{3}}$，比值检验给出 $\\lim_{n \\to \\infty} \\frac{(n + 2)n^{3}}{(n + 1)^{3}(n + 1)} = 1$。与 $p$ 级数比较才是有效的方法：这里 $a_{n}$ 的行为像 $\\frac{1}{n^{2}}$，所以级数收敛。\n\n检验：比值检验对发散的 $\\sum \\frac{1}{n}$ 和收敛的 $\\sum \\frac{1}{n^{2}}$ 也都给出 $1$，所以 $L = 1$ 无法区分它们。\n\n> **注意。** $L = 1$ 不是收敛或发散的结论；它表示该检验失效了。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    const p = rng.int(2, 6);
    const tests: readonly Pair[] = [
      ["The ratio test", "比值检验"],
      ["The root test", "根值检验"],
    ];
    const test = rng.pick(tests);
    const ratioTest = test === tests[0];
    const other = p === 2 ? "\\frac{1}{n}" : `\\frac{1}{n^{${p - 1}}}`;
    const nPow = p === 2 ? "n" : `n^{${p - 1}}`;
    const term = `\\frac{n + ${a}}{n^{${p}} + ${b}}`;
    const f = (n: number) => (n + a) / (n ** p + b);
    const at100 = ratioTest ? (f(101) / f(100)).toFixed(4) : (f(1000) ** (1 / 1000)).toFixed(4);
    const verdict = p === 2 ? "diverges" : "converges";
    const verdictZh = p === 2 ? "发散" : "收敛";
    const parts: Step[] = [
      [
        ["Try the test", "试用该检验"],
        t(
          `The terms are a rational function of $n$, so ${ratioTest ? "the ratio of consecutive terms" : "the $n$th root of the terms"} tends to $1$:`,
          `通项是 $n$ 的有理函数，所以${ratioTest ? "相邻两项之比" : "通项的 $n$ 次方根"}趋于 $1$：`,
        ),
        [ratioTest ? `\\lim_{n \\to \\infty} \\frac{a_{n+1}}{a_{n}} = 1` : `\\lim_{n \\to \\infty} \\sqrt[n]{a_{n}} = 1`],
      ],
      [
        ["Find a test that decides", "找出能判断的检验"],
        t(
          `With $L = 1$ the test says nothing. The terms behave like $${other}$, and the limit comparison gives a finite nonzero limit, so the series ${verdict}:`,
          `$L = 1$ 时该检验不提供信息。通项的行为像 $${other}$，极限比较得到有限非零的极限，所以级数${verdictZh}：`,
        ),
        [`\\lim_{n \\to \\infty} ${term} \\cdot ${nPow} = 1`],
      ],
    ];
    return seriesPicked(
      rng,
      [
        `Which test is certain to give no conclusion for $\\sum_{n=1}^{\\infty} ${term}$?`,
        `对 $\\sum_{n=1}^{\\infty} ${term}$，哪个检验肯定得不出结论？`,
      ],
      test,
      [
        [
          [`The limit comparison test with $${other}$`, `与 $${other}$ 的极限比较检验`],
          `It gives the limit $1$, finite and not zero, so it decides: the series ${verdict}`,
          `它给出极限 $1$，有限且不为零，所以能作出判断：级数${verdictZh}`,
        ],
        [
          ["The integral test", "积分检验"],
          "For large $x$ the function is positive and decreasing, so the integral test applies, and its integral behaves like that of the comparison term",
          "当 $x$ 较大时函数为正且递减，所以积分检验适用，其积分的行为与比较项的积分相同",
        ],
        [
          ["The comparison test", "比较检验"],
          `For large $n$ the terms lie between constant multiples of $${other}$, so a direct comparison decides`,
          `当 $n$ 较大时，通项介于 $${other}$ 的两个常数倍之间，所以直接比较就能判断`,
        ],
      ],
      parts,
      [
        `Compute a value: at $n = ${ratioTest ? 100 : 1000}$, ${ratioTest ? "$\\frac{a_{101}}{a_{100}}$" : "$\\sqrt[1000]{a_{1000}}$"} is about $${at100}$, already close to $1$, as the limit says. A test whose limit is $1$ cannot decide, while the comparison with $${other}$ shows that the series ${verdict}.`,
        `算一个值：在 $n = ${ratioTest ? 100 : 1000}$ 时，${ratioTest ? "$\\frac{a_{101}}{a_{100}}$" : "$\\sqrt[1000]{a_{1000}}$"} 约为 $${at100}$，已经接近 $1$，与极限一致。极限为 $1$ 的检验无法判断，而与 $${other}$ 比较说明级数${verdictZh}。`,
      ],
    );
  },
);

const derivativeFromCoefficient = point(
  "a-derivative-from-a-taylor-coefficient",
  ["A derivative from a Taylor coefficient", "由泰勒系数求导数"],
  [
    "A Taylor polynomial stores derivatives. The coefficient of $(x - a)^{k}$ is $\\frac{f^{(k)}(a)}{k!}$, so the derivative is that coefficient times $k!$. If the polynomial centered at $1$ has the term $4(x - 1)^{3}$, the third derivative follows: $\\frac{f'''(1)}{3!} = 4, \\quad f'''(1) = 3! \\cdot 4 = 24$.\n\nCheck: differentiating $4(x - 1)^{3}$ three times gives $4 \\cdot 3 \\cdot 2 = 24$, and the lower terms vanish.\n\n> **Watch out.** Reading the coefficient directly as the derivative forgets the factorial: $f'''(1)$ is $24$, not $4$.",
    "泰勒多项式储存了导数的信息。$(x - a)^{k}$ 的系数是 $\\frac{f^{(k)}(a)}{k!}$，所以导数等于这个系数乘以 $k!$。如果以 $1$ 为中心的多项式含有 $4(x - 1)^{3}$ 这一项，就可得三阶导数：$\\frac{f'''(1)}{3!} = 4, \\quad f'''(1) = 3! \\cdot 4 = 24$。\n\n检验：把 $4(x - 1)^{3}$ 求导三次得 $4 \\cdot 3 \\cdot 2 = 24$，较低次的项都消失了。\n\n> **注意。** 把系数直接当作导数就忘了阶乘：$f'''(1)$ 是 $24$，而不是 $4$。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const c0 = rng.int(-9, 9);
    const c1 = nz(rng, 9);
    const c2 = nz(rng, 9);
    const c3 = nz(rng, 9);
    const third = rng.bool();
    const k = third ? 3 : 2;
    const base = linear(1, -a);
    const T = poly([c0, ""], [c1, `(${base})`], [c2, `(${base})^{2}`], [c3, `(${base})^{3}`]);
    const answer = third ? 6 * c3 : 2 * c2;
    const c = third ? c3 : c2;
    const name = third ? "f'''" : "f''";
    const times = c === 1 ? `${k}!` : `${k}! \\cdot ${paren(c)}`;
    const chain = [...(third ? ["3", "2"] : ["2"]), ...(c === 1 ? [] : [paren(c)])].join(" \\cdot ");
    const termTex = `${c === 1 ? "" : c === -1 ? "-" : c}(${base})^{${k}}`;
    const parts: Step[] = [
      [
        ["Match the coefficient", "对应系数"],
        t(
          `The coefficient of $(${base})^{${k}}$ in the polynomial is $${c}$, and Taylor's formula says it is $\\frac{${name}(${a})}{${k}!}$:`,
          `多项式中 $(${base})^{${k}}$ 的系数是 $${c}$，而泰勒公式说它等于 $\\frac{${name}(${a})}{${k}!}$：`,
        ),
        [`\\frac{${name}(${a})}{${k}!} = ${c}`],
      ],
      [
        ["Multiply by the factorial", "乘以阶乘"],
        t(`Multiply both sides by $${k}! = ${k === 3 ? 6 : 2}$:`, `两边乘以 $${k}! = ${k === 3 ? 6 : 2}$：`),
        [`${name}(${a}) = ${times} = ${answer}`],
      ],
    ];
    return seriesSolved(
      [
        `The Taylor polynomial of degree 3 for $f$ centered at $x = ${a}$ is $${T}$. Find $${name}(${a})$.`,
        `$f$ 在 $x = ${a}$ 处的 3 次泰勒多项式是 $${T}$。求 $${name}(${a})$。`,
      ],
      answer,
      parts,
      [
        `Differentiate the polynomial ${third ? "three" : "two"} times instead. The term $${termTex}$ becomes $${chain}$, which is $${answer}$; the lower terms vanish${third ? "" : `, and the cubic term leaves a multiple of $(${base})$, which is $0$ at $x = ${a}$`}. So $${name}(${a}) = ${answer}$.`,
        `改为把多项式求导${third ? "三" : "两"}次。$${termTex}$ 这一项变为 $${chain}$，即 $${answer}$；较低次的项都消失${third ? "" : `，三次项留下 $(${base})$ 的倍数，它在 $x = ${a}$ 处为 $0$`}。所以 $${name}(${a}) = ${answer}$。`,
      ],
      [
        [
          c,
          `This reads the coefficient as the derivative; the coefficient is the derivative divided by $${k}!$`,
          `这里把系数当作导数；系数是导数除以 $${k}!$`,
        ],
        third
          ? [3 * c3, "This multiplies by $3$; the factor is $3! = 6$", "这里乘以 $3$；因子应是 $3! = 6$"]
          : [Q.of(c2, 2), "This divides by $2!$; the derivative is the coefficient times $2!$", "这里除以了 $2!$；导数是系数乘以 $2!$"],
        third
          ? [Q.of(c3, 6), "This divides by $3!$; the derivative is the coefficient times $3!$", "这里除以了 $3!$；导数是系数乘以 $3!$"]
          : [4 * c2, "This multiplies by $2^{2}$; the factor is $2! = 2$", "这里乘以 $2^{2}$；因子应是 $2! = 2$"],
      ],
    );
  },
);

const radiusWithCoefficient = point(
  "the-radius-when-x-has-a-coefficient",
  ["The radius when x has a coefficient", "x 带系数时的收敛半径"],
  [
    "The radius belongs to $x$, not to the expression in brackets. Take $\\sum \\frac{(2x + 1)^{n}}{6^{n}}$, a geometric series with ratio $\\frac{2x + 1}{6}$. The ratio test gives $\\lim_{n \\to \\infty} \\left|\\frac{(2x + 1)^{n+1}}{6^{n+1}} \\cdot \\frac{6^{n}}{(2x + 1)^{n}}\\right| = \\frac{|2x + 1|}{6}$. So the series converges when $|2x + 1| < 6$, that is, when $\\left|x + \\frac{1}{2}\\right| < 3$, and the radius is $3$. In general, for powers of $kx + d$ over $c^{n}$, the radius is $\\frac{c}{k}$.\n\nCheck: the interval runs from $-\\frac{7}{2}$ to $\\frac{5}{2}$, where $2x + 1 = \\pm 6$, and its length $6$ is twice the radius.\n\n> **Watch out.** $6$ is the bound on $|2x + 1|$, not on the distance of $x$ from the center: divide by the coefficient $2$.",
    "收敛半径是对 $x$ 而言的，不是对括号内的式子而言的。以 $\\sum \\frac{(2x + 1)^{n}}{6^{n}}$ 为例，它是公比为 $\\frac{2x + 1}{6}$ 的几何级数。比值检验给出 $\\lim_{n \\to \\infty} \\left|\\frac{(2x + 1)^{n+1}}{6^{n+1}} \\cdot \\frac{6^{n}}{(2x + 1)^{n}}\\right| = \\frac{|2x + 1|}{6}$。所以当 $|2x + 1| < 6$，即 $\\left|x + \\frac{1}{2}\\right| < 3$ 时级数收敛，收敛半径是 $3$。一般地，对 $kx + d$ 的幂除以 $c^{n}$，收敛半径是 $\\frac{c}{k}$。\n\n检验：区间从 $-\\frac{7}{2}$ 到 $\\frac{5}{2}$，两端满足 $2x + 1 = \\pm 6$，长度 $6$ 是半径的两倍。\n\n> **注意。** $6$ 是 $|2x + 1|$ 的界，而不是 $x$ 到中心距离的界：要除以系数 $2$。",
  ],
  (rng) => {
    const k = rng.int(2, 6);
    const c = rng.int(2, 12);
    const d = nz(rng, 9);
    const inner = linear(k, d);
    const answer = Q.of(c, k);
    const lo = Q.of(-c - d, k);
    const hi = Q.of(c - d, k);
    const parts: Step[] = [
      [
        ["Find when the ratio is small", "确定公比何时足够小"],
        t(
          `The series is geometric with ratio $\\frac{${inner}}{${c}}$, so it converges exactly when the ratio has size less than $1$:`,
          `级数是公比为 $\\frac{${inner}}{${c}}$ 的几何级数，所以恰好在公比的绝对值小于 $1$ 时收敛：`,
        ),
        [`\\left|\\frac{${inner}}{${c}}\\right| < 1 \\iff |${inner}| < ${c}`],
      ],
      [
        ["Divide by the coefficient", "除以系数"],
        t(`Divide by $${k}$ to see how far $x$ may be from its center:`, `除以 $${k}$，看 $x$ 离中心能有多远：`),
        [`\\left|${poly([1, "x"], [Q.of(d, k), ""])}\\right| < ${answer.toLatex()}`],
      ],
    ];
    return seriesSolved(
      [
        `Find the radius of convergence of $\\sum_{n=0}^{\\infty} \\frac{(${inner})^{n}}{${c}^{n}}$.`,
        `求 $\\sum_{n=0}^{\\infty} \\frac{(${inner})^{n}}{${c}^{n}}$ 的收敛半径。`,
      ],
      answer,
      parts,
      [
        `Find the ends of the interval instead, where $${inner} = \\pm ${c}$: they are $x = ${lo.toLatex()}$ and $x = ${hi.toLatex()}$. The length of the interval is $${hi.sub(lo).toLatex()}$, and half of it is $${answer.toLatex()}$, the radius.`,
        `改求区间的端点，即 $${inner} = \\pm ${c}$ 处：它们是 $x = ${lo.toLatex()}$ 和 $x = ${hi.toLatex()}$。区间长度是 $${hi.sub(lo).toLatex()}$，它的一半 $${answer.toLatex()}$ 就是收敛半径。`,
      ],
      [
        [
          c,
          `This is the bound on $|${inner}|$; divide by $${k}$ to get the bound on the distance of $x$ from the center`,
          `这是 $|${inner}|$ 的界；除以 $${k}$ 才得到 $x$ 到中心距离的界`,
        ],
        [
          Q.of(k, c),
          `This turns the fraction upside down; the radius is $\\frac{${c}}{${k}}$`,
          `这里把分数颠倒了；收敛半径是 $\\frac{${c}}{${k}}$`,
        ],
        [c * k, `This multiplies by $${k}$; divide by it instead`, `这里乘以了 $${k}$；应当除以它`],
      ],
    );
  },
);

/** derivativeMarks writes the mth derivative of y in the usual notation. */
const derivativeMarks = (m: number) => (m === 1 ? "y'" : m === 2 ? "y''" : m === 3 ? "y'''" : `y^{(${m})}`);

/** asQ turns a whole number into a rational and leaves a rational as it is. */
const asQ = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);

/** DeMistake is a wrong number of a differential-equation question with its reason in English and Chinese. */
type DeMistake = readonly [value: number | Q, en: string, zh: string];

/** DeOption is a wrong option of a differential-equation question with its reason in English and Chinese. */
type DeOption = readonly [option: Pair, en: string, zh: string];

/** deStep is a labelled step with what it says and its displayed lines. */
const deStep = (title: Pair, said: Pair, ...lines: string[]): Step => [title, t(...said), lines];

/** solvedDe asks for a number, explains it in labelled steps with a check, and keeps the first reason for each wrong value. */
function solvedDe(prompt: Pair, answer: number | Q, parts: readonly Step[], check: Pair, mistakes: readonly DeMistake[]): Problem {
  const right = asQ(answer);
  const kept = mistakes.filter((m, i) => !asQ(m[0]).eq(right) && mistakes.findIndex((n) => asQ(n[0]).eq(asQ(m[0]))) === i);
  return numberProblem({
    prompt: t(...prompt),
    answer: right,
    mistakes: kept.map(([value, en, zh]) => ({ value: asQ(value), why: t(en, zh) })),
    solution: walked(parts, t(...check)),
  });
}

/** pickedDe asks a choice whose wrong options each have a reason, explained in labelled steps with a check. */
function pickedDe(rng: Rng, prompt: Pair, correct: Pair, wrong: readonly DeOption[], parts: readonly Step[], check: Pair): Problem {
  return explainedChoice(rng, {
    prompt: t(...prompt),
    correct: t(...correct),
    wrong: wrong.map(([option, en, zh]) => ({ option: t(...option), why: t(en, zh) })),
    solution: walked(parts, t(...check)),
  });
}

/** generalFamily writes the general solution of y⁽ᵐ⁾ = 0, a polynomial with m constants. */
const generalFamily = (m: number) =>
  Array.from({ length: m }, (_, i) => `C_{${i + 1}}${i === 0 ? "" : i === 1 ? "x" : `x^{${i}}`}`).join(" + ");

const constantsFromOrder = point(
  "the-number-of-constants-follows-the-order",
  ["The number of constants follows the order", "常数的个数由阶决定"],
  [
    "Solving an equation of order $m$ takes $m$ integrations in effect, so a general solution normally has $m$ arbitrary constants. The order is the highest derivative that appears, and the power to which a derivative is raised does not count. For example, $(y'')^{3} + y = x$ has order $2$, so its general solution has $2$ constants.\n\nCheck: the simplest equation of order $2$, $y'' = 0$, integrates twice to $y = C_{1} + C_{2}x$, with two constants.\n\n> **Watch out.** The power $3$ on $y''$ does not give three constants: count the order of the highest derivative, not the exponent.",
    "解 $m$ 阶方程实质上要积分 $m$ 次，所以通解一般有 $m$ 个任意常数。阶是出现的最高阶导数，导数的乘方次数不算在内。例如 $(y'')^{3} + y = x$ 是 $2$ 阶的，所以通解有 $2$ 个常数。\n\n检验：最简单的 $2$ 阶方程 $y'' = 0$ 积分两次得 $y = C_{1} + C_{2}x$，正好两个常数。\n\n> **注意。** $y''$ 上的指数 $3$ 不会带来三个常数：要数最高阶导数的阶，而不是指数。",
  ],
  (rng) => {
    const m = rng.int(1, 4);
    const d = rng.int(2, 5);
    const c = nz(rng, 9);
    const rhs = rng.pick(["x", "e^{x}", "\\sin x", "x^{2}"]);
    const eq = `(${derivativeMarks(m)})^{${d}} ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}y = ${rhs}`;
    return solvedDe(
      [`How many arbitrary constants do you expect in the general solution of $${eq}$?`, `$${eq}$ 的通解中预计有几个任意常数？`],
      m,
      [
        deStep(
          ["Find the order", "找出阶"],
          [
            `The highest derivative is $${derivativeMarks(m)}$, so the order is $${m}$; the power $${d}$ only multiplies that derivative by itself.`,
            `最高阶导数是 $${derivativeMarks(m)}$，所以阶是 $${m}$；指数 $${d}$ 只是让这个导数自乘。`,
          ],
        ),
        deStep(
          ["Count the integrations", "数积分的次数"],
          [
            `Undoing $${m}$ derivative${m === 1 ? "" : "s"} takes $${m}$ integration${m === 1 ? "" : "s"}, each with its own constant, so expect $${m}$.`,
            `去掉 $${m}$ 次求导要积分 $${m}$ 次，每次带一个常数，所以预计有 $${m}$ 个。`,
          ],
        ),
      ],
      [
        `The simplest equation of order $${m}$, $${derivativeMarks(m)} = 0$, has general solution $y = ${generalFamily(m)}$, with $${m}$ constant${m === 1 ? "" : "s"}.`,
        `最简单的 $${m}$ 阶方程 $${derivativeMarks(m)} = 0$ 的通解是 $y = ${generalFamily(m)}$，有 $${m}$ 个常数。`,
      ],
      [
        [
          d,
          `$${d}$ is the power on the derivative; the order, and so the number of constants, comes from the derivative itself`,
          `$${d}$ 是导数上的指数；阶以及常数的个数由导数本身决定`,
        ],
        [m + d, "The power does not add to the order: only the highest derivative counts", "指数不会加到阶上：只看最高阶导数"],
        [
          m + 1,
          `One too many: an equation of order $${m}$ needs $${m}$ condition${m === 1 ? "" : "s"} to fix its solution`,
          `多了一个：$${m}$ 阶方程需要 $${m}$ 个条件才能确定解`,
        ],
      ],
    );
  },
);

const constantThatMakesASolution = point(
  "the-constant-that-makes-it-a-solution",
  ["The constant that makes it a solution", "使其成为解的常数"],
  [
    "Verifying can also determine an unknown. Substitute the proposed solution into the equation and compare both sides. The part with the arbitrary constant $C$ cancels when the form is right, and what remains is an equation for the unknown number. For $y = Ce^{2x} + p$ in $y' = 2y - 6$: the left side is $2Ce^{2x}$ and the right side is $2Ce^{2x} + 2p - 6$, so $2p - 6 = 0$ and $p = 3$.\n\nCheck: with $C = 0$ the solution is the constant $y = 3$, whose derivative $0$ equals $2 \\cdot 3 - 6$.\n\n> **Watch out.** Keep the coefficient: $kp + m = 0$ gives $p = -\\frac{m}{k}$, not $-m$.",
    "验证也能确定未知数。把候选解代入方程，比较两边。形式正确时，含任意常数 $C$ 的部分会抵消，剩下的就是关于未知数的方程。把 $y = Ce^{2x} + p$ 代入 $y' = 2y - 6$：左边是 $2Ce^{2x}$，右边是 $2Ce^{2x} + 2p - 6$，所以 $2p - 6 = 0$，$p = 3$。\n\n检验：取 $C = 0$，解是常数 $y = 3$，它的导数 $0$ 等于 $2 \\cdot 3 - 6$。\n\n> **注意。** 别丢掉系数：由 $kp + m = 0$ 得 $p = -\\frac{m}{k}$，而不是 $-m$。",
  ],
  (rng) => {
    const k = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
    const m = nz(rng, 12);
    const answer = Q.of(-m, k);
    const eq = poly([k, "y"], [m, ""]);
    const rest = poly([k, "p"], [m, ""]);
    return solvedDe(
      [
        `For every constant $C$, $y = Ce^{${k}x} + p$ is a solution of $y' = ${eq}$. Find $p$.`,
        `对每个常数 $C$，$y = Ce^{${k}x} + p$ 都是 $y' = ${eq}$ 的解。求 $p$。`,
      ],
      answer,
      [
        deStep(
          ["Substitute", "代入"],
          [`The left side is $y' = ${k}Ce^{${k}x}$. The right side is`, `左边是 $y' = ${k}Ce^{${k}x}$。右边是`],
          `${paren(k)}\\left(Ce^{${k}x} + p\\right) ${m < 0 ? "-" : "+"} ${Math.abs(m)} = ${poly([k, `Ce^{${k}x}`], [k, "p"], [m, ""])}`,
        ),
        deStep(
          ["Compare the sides", "比较两边"],
          ["The terms with $C$ cancel, and what is left must be $0$:", "含 $C$ 的项抵消，剩下的必须为 $0$："],
          `${rest} = 0 \\quad\\Rightarrow\\quad p = ${answer.toLatex()}`,
        ),
      ],
      [
        `With $C = 0$ the solution is the constant $y = ${answer.toLatex()}$. Its derivative is $0$, and the right side is $${paren(k)} \\cdot ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} ${m < 0 ? "-" : "+"} ${Math.abs(m)} = 0$ too.`,
        `取 $C = 0$，解是常数 $y = ${answer.toLatex()}$。它的导数为 $0$，右边 $${paren(k)} \\cdot ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} ${m < 0 ? "-" : "+"} ${Math.abs(m)}$ 也等于 $0$。`,
      ],
      [
        [Q.of(m, k), "A sign slipped: moving the constant across gives $kp = -m$", "符号错了：把常数移过去得 $kp = -m$"],
        [-m, `This drops the coefficient $${k}$: divide by it`, `这里丢掉了系数 $${k}$：还要除以它`],
        [Q.of(-k, m), "This is upside down: $p$ is the constant over the coefficient of $y$", "颠倒了：$p$ 是常数除以 $y$ 的系数"],
      ],
    );
  },
);

const constantIsNotTheInitialValue = point(
  "the-constant-is-not-always-the-initial-value",
  ["The constant is not always the initial value", "常数不一定是初值"],
  [
    "After integrating, $C$ equals $y(0)$ only if the antiderivative is $0$ at $x = 0$. An exponential antiderivative is not, so substitute the initial condition into the whole expression and solve for $C$ rather than copying the initial value. For $\\frac{dy}{dx} = 6e^{3x}$ with $y(0) = 5$: $y = 2e^{3x} + C$, so $5 = 2 + C$ and $C = 3$.\n\nCheck: $y = 2e^{3x} + 3$ has $y' = 6e^{3x}$, the equation, and $y(0) = 2 + 3 = 5$.\n\n> **Watch out.** $e^{0} = 1$, not $0$, so the exponential term does not vanish at $x = 0$.",
    "积分后，只有原函数在 $x = 0$ 处为 $0$ 时，$C$ 才等于 $y(0)$。指数函数的原函数在那里不为 $0$，所以要把初始条件代入整个式子再解出 $C$，而不是照抄初值。对 $\\frac{dy}{dx} = 6e^{3x}$，$y(0) = 5$：$y = 2e^{3x} + C$，所以 $5 = 2 + C$，$C = 3$。\n\n检验：$y = 2e^{3x} + 3$ 满足 $y' = 6e^{3x}$，正是原方程，且 $y(0) = 2 + 3 = 5$。\n\n> **注意。** $e^{0} = 1$ 而不是 $0$，所以指数项在 $x = 0$ 处不会消失。",
  ],
  (rng) => {
    const a = nz(rng, 12);
    const k = rng.int(2, 9);
    const b = rng.int(-9, 9);
    const co = Q.of(a, k);
    const answer = Q.of(b).sub(co);
    const anti = poly([co, `e^{${k}x}`]);
    const pq = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());
    return solvedDe(
      [
        `The solution of $\\frac{dy}{dx} = ${poly([a, `e^{${k}x}`])}$ with $y(0) = ${b}$ is $y = ${anti} + C$. Find $C$.`,
        `$\\frac{dy}{dx} = ${poly([a, `e^{${k}x}`])}$ 满足 $y(0) = ${b}$ 的解是 $y = ${anti} + C$。求 $C$。`,
      ],
      answer,
      [
        deStep(
          ["Put in the initial condition", "代入初始条件"],
          [`At $x = 0$ the exponential is $e^{0} = 1$:`, `在 $x = 0$ 处指数函数为 $e^{0} = 1$：`],
          `${b} = ${co.toLatex()} + C`,
        ),
        deStep(["Solve for C", "解出 C"], ["", ""], `C = ${b} - ${pq(co)} = ${answer.toLatex()}`),
      ],
      [
        `Substitute back: $y = ${anti} + ${pq(answer)}$ has $y' = ${poly([a, `e^{${k}x}`])}$, the equation, and $y(0) = ${co.toLatex()} + ${pq(answer)} = ${b}$.`,
        `代回检验：$y = ${anti} + ${pq(answer)}$ 满足 $y' = ${poly([a, `e^{${k}x}`])}$，正是原方程，且 $y(0) = ${co.toLatex()} + ${pq(answer)} = ${b}$。`,
      ],
      [
        [
          b,
          `This copies the initial value, but at $x = 0$ the exponential term is $${co.toLatex()}$, not $0$`,
          `这是照抄初值，但在 $x = 0$ 处指数项等于 $${co.toLatex()}$，不是 $0$`,
        ],
        [Q.of(b).add(co), "The exponential term was added instead of subtracted", "指数项应当减去，这里却加上了"],
        [
          b - a,
          `This uses $${a}$, the coefficient of the derivative; the antiderivative's coefficient is $${co.toLatex()}$`,
          `这里用了导数的系数 $${a}$；原函数的系数是 $${co.toLatex()}$`,
        ],
      ],
    );
  },
);

const longTermValue = point(
  "the-long-term-value-of-a-model",
  ["The long-term value of a model", "模型的长期值"],
  [
    "Many models settle at the value where the rate is zero. Setting $\\frac{dy}{dt} = 0$ gives this value without solving the equation. It is the room temperature for cooling, the carrying capacity for logistic growth and the ratio of inflow to removal rate for a drip. For $\\frac{dT}{dt} = -\\frac{1}{10}(T - 20)$ the rate is zero at $T = 20$, so the temperature approaches $20$.\n\nCheck: at $T = 80$ the rate is $-\\frac{1}{10} \\cdot 60 = -6 < 0$, so the temperature falls toward $20$, and at $T = 20$ it stops changing.\n\n> **Watch out.** The long-term value depends neither on the starting value nor on the constant $k$: different starts all settle at the same value.",
    "很多模型最终稳定在变化率为零的值。令 $\\frac{dy}{dt} = 0$，不解方程也能得到这个值。对冷却问题是室温，对逻辑斯谛增长是环境容纳量，对输液问题是输入速率与清除率之比。对 $\\frac{dT}{dt} = -\\frac{1}{10}(T - 20)$，变化率在 $T = 20$ 时为零，所以温度趋于 $20$。\n\n检验：在 $T = 80$ 时变化率为 $-\\frac{1}{10} \\cdot 60 = -6 < 0$，所以温度降向 $20$，到 $T = 20$ 时不再变化。\n\n> **注意。** 长期值既不取决于初始值，也不取决于常数 $k$：不同的起点都会稳定到同一个值。",
  ],
  (rng) => {
    const kind = rng.pick(["cool", "drip", "logistic"] as const);
    const j = rng.int(2, 10);
    const k = Q.of(1, j);
    const fall: Pair = ["Find the rest value", "求静止值"];
    const way: Pair = ["Check the direction", "看变化方向"];
    if (kind === "cool") {
      const A = rng.int(15, 30);
      const start = A + rng.int(20, 60);
      const rate = Q.of(-(start - A), j);
      return solvedDe(
        [
          `A cup of tea at $${start}$ degrees cools according to $\\frac{dT}{dt} = -\\frac{1}{${j}}(T - ${A})$. What temperature does it approach in the long term?`,
          `一杯 $${start}$ 度的茶按 $\\frac{dT}{dt} = -\\frac{1}{${j}}(T - ${A})$ 冷却。长期来看，它的温度趋于多少？`,
        ],
        A,
        [
          deStep(fall, ["The rate is zero when", "变化率为零时"], `-\\frac{1}{${j}}(T - ${A}) = 0 \\quad\\Rightarrow\\quad T = ${A}`),
          deStep(way, [
            `At the start the rate is $-\\frac{1}{${j}}(${start} - ${A}) = ${rate.toLatex()} < 0$, so the temperature falls toward $${A}$.`,
            `开始时变化率为 $-\\frac{1}{${j}}(${start} - ${A}) = ${rate.toLatex()} < 0$，所以温度降向 $${A}$。`,
          ]),
        ],
        [
          `Substitute the constant $T = ${A}$: its derivative is $0$ and the right side is $-\\frac{1}{${j}}(${A} - ${A}) = 0$, so it is a solution, and the tea's temperature, above it and falling, approaches it.`,
          `代入常数 $T = ${A}$：它的导数为 $0$，右边为 $-\\frac{1}{${j}}(${A} - ${A}) = 0$，所以它是解；茶温在它上方并不断下降，趋于它。`,
        ],
        [
          [
            0,
            `The tea does not cool to $0$: it approaches the room temperature $${A}$, where the rate is zero`,
            `茶不会冷却到 $0$ 度：它趋于室温 $${A}$，那里变化率为零`,
          ],
          [
            start,
            "This is the starting temperature; the rate is negative there, so the temperature changes",
            "这是初始温度；那里的变化率为负，所以温度会变化",
          ],
          [
            A + j,
            `$${j}$ is a time scale, $\\frac{1}{k}$, not a temperature; leave it out`,
            `$${j}$ 是时间尺度 $\\frac{1}{k}$，不是温度；不应加上它`,
          ],
        ],
      );
    }
    if (kind === "drip") {
      const r = rng.int(2, 40);
      const answer = Q.of(r * j);
      return solvedDe(
        [
          `A drug enters the blood and is removed so that the amount $y$ in milligrams satisfies $\\frac{dy}{dt} = ${r} - \\frac{1}{${j}}y$, with $y(0) = 0$. What amount does it approach in the long term?`,
          `药物进入血液并被清除，血液中的药量 $y$（毫克）满足 $\\frac{dy}{dt} = ${r} - \\frac{1}{${j}}y$，$y(0) = 0$。长期来看，药量趋于多少？`,
        ],
        answer,
        [
          deStep(
            fall,
            ["The rate is zero when", "变化率为零时"],
            `${r} - \\frac{1}{${j}}y = 0 \\quad\\Rightarrow\\quad y = ${r} \\cdot ${j} = ${answer.toLatex()}`,
          ),
          deStep(way, [
            `At the start the rate is $${r} - 0 = ${r} > 0$, so the amount rises toward $${answer.toLatex()}$.`,
            `开始时变化率为 $${r} - 0 = ${r} > 0$，所以药量升向 $${answer.toLatex()}$。`,
          ]),
        ],
        [
          `Substitute the constant $y = ${answer.toLatex()}$: its derivative is $0$ and the right side is $${r} - \\frac{${answer.toLatex()}}{${j}} = 0$. Inflow and removal then balance.`,
          `代入常数 $y = ${answer.toLatex()}$：它的导数为 $0$，右边为 $${r} - \\frac{${answer.toLatex()}}{${j}} = 0$。这时输入与清除正好平衡。`,
        ],
        [
          [r, `$${r}$ mg per unit time is the inflow rate, not an amount`, `每单位时间 $${r}$ 毫克是输入速率，不是药量`],
          [
            Q.of(r).mul(k),
            `This multiplies by $\\frac{1}{${j}}$; solving $\\frac{1}{${j}}y = ${r}$ multiplies by $${j}$`,
            `这里乘了 $\\frac{1}{${j}}$；解 $\\frac{1}{${j}}y = ${r}$ 应当乘以 $${j}$`,
          ],
          [
            0,
            `This is the starting amount; the rate there is $${r} > 0$, so the amount grows`,
            `这是初始药量；那里的变化率为 $${r} > 0$，所以药量会增加`,
          ],
        ],
      );
    }
    const M = rng.int(5, 90) * 10;
    const start = rng.int(1, 4) * 10;
    const rate = Q.of(start * (M - start), j * M);
    return solvedDe(
      [
        `A population with $P(0) = ${start}$ satisfies $\\frac{dP}{dt} = \\frac{1}{${j}}P\\left(1 - \\frac{P}{${M}}\\right)$. What size does it approach in the long term?`,
        `一个种群满足 $P(0) = ${start}$，$\\frac{dP}{dt} = \\frac{1}{${j}}P\\left(1 - \\frac{P}{${M}}\\right)$。长期来看，它的规模趋于多少？`,
      ],
      M,
      [
        deStep(
          fall,
          ["The rate is zero when", "变化率为零时"],
          `\\frac{1}{${j}}P\\left(1 - \\frac{P}{${M}}\\right) = 0 \\quad\\Rightarrow\\quad P = 0, \\quad P = ${M}`,
        ),
        deStep(way, [
          `At the start the rate is $${rate.toLatex()} > 0$, so the population grows from $${start}$ toward $${M}$.`,
          `开始时变化率为 $${rate.toLatex()} > 0$，所以种群从 $${start}$ 增长趋于 $${M}$。`,
        ]),
      ],
      [
        `Substitute the constant $P = ${M}$: its derivative is $0$ and the right side is $\\frac{1}{${j}} \\cdot ${M}\\left(1 - \\frac{${M}}{${M}}\\right) = 0$, so the population stops changing there.`,
        `代入常数 $P = ${M}$：它的导数为 $0$，右边为 $\\frac{1}{${j}} \\cdot ${M}\\left(1 - \\frac{${M}}{${M}}\\right) = 0$，所以种群在那里不再变化。`,
      ],
      [
        [
          start,
          "This is the starting size; the rate is positive there, so the population grows",
          "这是初始规模；那里的变化率为正，所以种群会增长",
        ],
        [M / 2, "This is where growth is fastest, not where it settles", "这是增长最快的位置，而不是最终稳定的位置"],
        [0, "$P = 0$ is an equilibrium too, but a positive population moves away from it", "$P = 0$ 也是平衡解，但正的种群会远离它"],
      ],
    );
  },
);

const extremumOfSolution = point(
  "extrema-of-solutions-without-solving",
  ["Extrema of solutions without solving", "不解方程判断解的极值"],
  [
    "The equation gives both derivatives at a point. Where $\\frac{dy}{dx} = 0$, differentiating $\\frac{dy}{dx} = ax + by + c$ gives $\\frac{d^{2}y}{dx^{2}} = a + b \\cdot 0 = a$. So the sign of $a$ decides between a local maximum and a local minimum. For $\\frac{dy}{dx} = 2x - y + 1$ through $(1, 3)$: $y' = 2 - 3 + 1 = 0$ and $y'' = 2 - y' = 2 > 0$, a local minimum.\n\nCheck: near $(1, 3)$, $y$ hardly changes, so $\\frac{dy}{dx} \\approx 2(x - 1)$: negative just to the left and positive just to the right, as at a minimum.\n\n> **Watch out.** Differentiate the $y$ term too: the derivative of $by$ is $b\\frac{dy}{dx}$, which is $0$ at this point, not $b$.",
    "方程给出了某点处的两阶导数。在 $\\frac{dy}{dx} = 0$ 的地方，对 $\\frac{dy}{dx} = ax + by + c$ 求导得 $\\frac{d^{2}y}{dx^{2}} = a + b \\cdot 0 = a$。所以 $a$ 的符号决定是局部极大值还是局部极小值。对 $\\frac{dy}{dx} = 2x - y + 1$，过 $(1, 3)$：$y' = 2 - 3 + 1 = 0$，$y'' = 2 - y' = 2 > 0$，是局部极小值。\n\n检验：在 $(1, 3)$ 附近 $y$ 几乎不变，所以 $\\frac{dy}{dx} \\approx 2(x - 1)$：左侧略为负，右侧略为正，正是极小值的样子。\n\n> **注意。** $y$ 项也要求导：$by$ 的导数是 $b\\frac{dy}{dx}$，在这一点为 $0$，而不是 $b$。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const b = rng.pick([-1, 1]);
    const c = rng.int(-9, 9);
    const x0 = rng.int(-5, 5);
    const y0 = -(a * x0 + c) * b;
    const eq = poly([a, "x"], [b, "y"], [c, ""]);
    const max: Pair = ["A local maximum", "局部极大值"];
    const min: Pair = ["A local minimum", "局部极小值"];
    const flat: Pair = ["A point of inflection, with no extremum", "拐点，没有极值"];
    const none: Pair = ["It cannot be decided without solving the equation", "不解方程无法判断"];
    const up = a > 0;
    const wrong: DeOption[] = [
      up
        ? [
            max,
            `$\\frac{d^{2}y}{dx^{2}} = ${a} > 0$ means concave up, which is a minimum`,
            `$\\frac{d^{2}y}{dx^{2}} = ${a} > 0$ 表示上凹，是极小值`,
          ]
        : [
            min,
            `$\\frac{d^{2}y}{dx^{2}} = ${a} < 0$ means concave down, which is a maximum`,
            `$\\frac{d^{2}y}{dx^{2}} = ${a} < 0$ 表示下凹，是极大值`,
          ],
      [
        flat,
        `An inflection point would need $\\frac{d^{2}y}{dx^{2}} = 0$, but it is $${a}$ there`,
        `拐点要求 $\\frac{d^{2}y}{dx^{2}} = 0$，而这里它等于 $${a}$`,
      ],
      [
        none,
        "The equation itself gives both derivatives at the point, so no solving is needed",
        "方程本身就给出了该点的两阶导数，不必求解",
      ],
    ];
    return pickedDe(
      rng,
      [
        `The solution of $\\frac{dy}{dx} = ${eq}$ passes through $(${x0}, ${y0})$. What does it have at that point?`,
        `$\\frac{dy}{dx} = ${eq}$ 的解经过 $(${x0}, ${y0})$。它在该点处有什么？`,
      ],
      up ? min : max,
      wrong,
      [
        deStep(
          ["Find the slope", "求斜率"],
          ["Substitute the point into the equation:", "把该点代入方程："],
          `\\frac{dy}{dx} = ${a} \\cdot ${paren(x0)} ${b < 0 ? "-" : "+"} ${paren(y0)} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = 0`,
        ),
        deStep(
          ["Find the second derivative", "求二阶导数"],
          [
            `Differentiate the equation; the slope is $0$ here, so ${up ? "the solution is concave up: a local minimum" : "the solution is concave down: a local maximum"}.`,
            `对方程求导；这里斜率为 $0$，所以${up ? "解是上凹的：局部极小值" : "解是下凹的：局部极大值"}。`,
          ],
          `\\frac{d^{2}y}{dx^{2}} = ${a} ${b < 0 ? "-" : "+"} \\frac{dy}{dx} = ${a} ${b < 0 ? "-" : "+"} 0 = ${a}`,
        ),
      ],
      [
        `Near the point $y$ hardly changes, so $\\frac{dy}{dx} \\approx ${a}(${linear(1, -x0)})$, which is ${up ? "negative just to the left and positive just to the right" : "positive just to the left and negative just to the right"}, as at a ${up ? "minimum" : "maximum"}.`,
        `在该点附近 $y$ 几乎不变，所以 $\\frac{dy}{dx} \\approx ${a}(${linear(1, -x0)})$，它${up ? "左侧略为负、右侧略为正" : "左侧略为正、右侧略为负"}，正是极${up ? "小" : "大"}值的样子。`,
      ],
    );
  },
);

const halfLifeFromAmounts = point(
  "a-half-life-from-two-amounts",
  ["A half-life from two amounts", "由两个量求半衰期"],
  [
    "Exponential decay halves in equal times. When the ratio of two amounts is a power of $2$, count the halvings: if the amount falls to $\\frac{1}{2^{m}}$ of its value in time $t$, the half-life is $\\frac{t}{m}$, not $\\frac{t}{2^{m}}$. For example, $80$ g falls to $10$ g in $12$ hours: $\\frac{80}{10} = 8 = 2^{3}$, three halvings, so the half-life is $4$ hours.\n\nCheck: $80 \\to 40 \\to 20 \\to 10$ takes three steps of $4$ hours, $12$ hours in all.\n\n> **Watch out.** Divide the time by the number of halvings, $3$, not by the factor $8$.",
    "指数衰减在相等的时间内减半。当两个量的比是 $2$ 的幂时，数一数减半的次数：如果在时间 $t$ 内减少到原来的 $\\frac{1}{2^{m}}$，半衰期就是 $\\frac{t}{m}$，而不是 $\\frac{t}{2^{m}}$。例如 $80$ 克在 $12$ 小时内降到 $10$ 克：$\\frac{80}{10} = 8 = 2^{3}$，减半三次，所以半衰期是 $4$ 小时。\n\n检验：$80 \\to 40 \\to 20 \\to 10$ 分三步，每步 $4$ 小时，共 $12$ 小时。\n\n> **注意。** 要用时间除以减半的次数 $3$，而不是除以倍数 $8$。",
  ],
  (rng) => {
    const m = rng.int(2, 5);
    const h = rng.int(1, 12);
    const u = rng.int(1, 9) * 5;
    const t0 = m * h;
    const start = u * 2 ** m;
    return solvedDe(
      [
        `A substance decays according to $\\frac{dy}{dt} = -ky$. It falls from $${start}$ grams to $${u}$ grams in $${t0}$ hours. Find its half-life, in hours.`,
        `一种物质按 $\\frac{dy}{dt} = -ky$ 衰减，在 $${t0}$ 小时内从 $${start}$ 克降到 $${u}$ 克。求它的半衰期，单位是小时。`,
      ],
      h,
      [
        deStep(["Count the halvings", "数减半的次数"], ["", ""], `\\frac{${start}}{${u}} = ${2 ** m} = 2^{${m}}`),
        deStep(
          ["Share out the time", "平分时间"],
          [`The $${m}$ halvings take equal times:`, `$${m}$ 次减半所用时间相等：`],
          `${t0} \\div ${m} = ${h}`,
        ),
      ],
      [
        `Run the decay forward: $${start}\\left(\\frac{1}{2}\\right)^{${t0}/${h}} = \\frac{${start}}{${2 ** m}} = ${u}$ grams after $${t0}$ hours.`,
        `向前推算：$${start}\\left(\\frac{1}{2}\\right)^{${t0}/${h}} = \\frac{${start}}{${2 ** m}} = ${u}$ 克，正是 $${t0}$ 小时后的量。`,
      ],
      [
        [
          Q.of(t0, 2 ** m),
          `This divides by the factor $${2 ** m}$; divide by the number of halvings, $${m}$`,
          `这里除以了倍数 $${2 ** m}$；应当除以减半的次数 $${m}$`,
        ],
        [
          Q.of(t0, 2),
          `Half the time is not the half-life: the amount halved $${m}$ times, not twice`,
          `一半的时间不是半衰期：这个量减半了 $${m}$ 次，而不是两次`,
        ],
        [t0, `This is the whole time, in which the amount halved $${m}$ times`, `这是全部时间，在这段时间里减半了 $${m}$ 次`],
      ],
    );
  },
);

const flatColumns = {
  ...point(
    "where-a-field-of-a-function-of-x-is-flat",
    ["Where a field of a function of x is flat", "x 的函数的斜率场的水平处"],
    [
      "In the field of $\\frac{dy}{dx} = f(x)$, the slope depends on the column only, so all segments in a column are parallel. Horizontal segments therefore fill whole vertical lines at the zeros of $f$, not horizontal rows. For $\\frac{dy}{dx} = x^{2} - 4$ they fill the lines $x = -2$ and $x = 2$.\n\nCheck: at $(2, 5)$ and at $(2, -1)$ the slope is $4 - 4 = 0$, whatever the height.\n\n> **Watch out.** The zeros of $f$ are values of $x$, so they give vertical lines, not horizontal ones.",
      "在 $\\frac{dy}{dx} = f(x)$ 的斜率场中，斜率只取决于所在的列，所以同一列的线段都平行。因此水平线段布满 $f$ 的零点处的整条竖直线，而不是水平的行。对 $\\frac{dy}{dx} = x^{2} - 4$，它们布满直线 $x = -2$ 和 $x = 2$。\n\n检验：在 $(2, 5)$ 和 $(2, -1)$ 处斜率都是 $4 - 4 = 0$，与高度无关。\n\n> **注意。** $f$ 的零点是 $x$ 的值，所以对应竖直线，而不是水平线。",
    ],
    (rng) => {
      const a = rng.int(-6, 5);
      const b = a + rng.int(1, 6);
      const f = poly([1, "x^{2}"], [-(a + b), "x"], [a * b, ""]);
      const factors = a === 0 ? `x(${linear(1, -b)})` : b === 0 ? `x(${linear(1, -a)})` : `(${linear(1, -a)})(${linear(1, -b)})`;
      const mid = Q.of(a + b, 2);
      const low = Q.of(-((b - a) ** 2), 4);
      return pickedDe(
        rng,
        [
          `Where are the segments horizontal in the slope field of $\\frac{dy}{dx} = ${f}$?`,
          `在 $\\frac{dy}{dx} = ${f}$ 的斜率场中，哪里的线段是水平的？`,
        ],
        [`On the vertical lines $x = ${a}$ and $x = ${b}$`, `在竖直线 $x = ${a}$ 和 $x = ${b}$ 上`],
        [
          [
            [`On the horizontal lines $y = ${a}$ and $y = ${b}$`, `在水平线 $y = ${a}$ 和 $y = ${b}$ 上`],
            "The slope depends only on $x$, so its zeros are columns; flat rows would need a slope that depends on $y$",
            "斜率只依赖于 $x$，所以它的零点是整列；整行水平需要斜率依赖于 $y$",
          ],
          [
            [`Only at the point $(${a}, ${b})$`, `只在点 $(${a}, ${b})$ 处`],
            `The height does not matter, so the slope is $0$ at every point of the column $x = ${a}$, not just one`,
            `高度不起作用，所以列 $x = ${a}$ 上每一点的斜率都是 $0$，而不只是一个点`,
          ],
          [
            [`On the vertical line $x = ${mid.toLatex()}$`, `在竖直线 $x = ${mid.toLatex()}$ 上`],
            `There the slope is at its lowest, $${low.toLatex()}$, not $0$`,
            `那里斜率最小，等于 $${low.toLatex()}$，不是 $0$`,
          ],
        ],
        [
          deStep(
            ["See what the slope depends on", "看斜率依赖什么"],
            [
              `The right side has no $y$, so every column of segments is parallel. Factor it:`,
              `右边不含 $y$，所以每一列线段都互相平行。把它因式分解：`,
            ],
            `${f} = ${factors}`,
          ),
          deStep(
            ["Find the zeros", "求零点"],
            [
              `It is zero for $x = ${a}$ and $x = ${b}$, so every segment in those two columns is horizontal.`,
              `当 $x = ${a}$ 和 $x = ${b}$ 时它为零，所以这两列的线段都是水平的。`,
            ],
          ),
        ],
        [
          `At any point $(${a}, y)$ the factor $${a === 0 ? "x" : `(${linear(1, -a)})`}$ is $0$, so the slope is $0$ whatever $y$ is; the same holds at $(${b}, y)$.`,
          `在任意点 $(${a}, y)$ 处因子 $${a === 0 ? "x" : `(${linear(1, -a)})`}$ 为 $0$，所以无论 $y$ 是多少斜率都是 $0$；在 $(${b}, y)$ 处也一样。`,
        ],
      );
    },
  ),
  figure: calculusDrawings5["slope-fields-for-directly-integrable-differential-equations#where-a-field-of-a-function-of-x-is-flat"],
};

const steepestRow = {
  ...point(
    "the-steepest-row-of-an-autonomous-field",
    ["The steepest row of an autonomous field", "自治方程斜率场中最陡的行"],
    [
      "In an autonomous field the slope depends only on the row. For a quadratic in $y$ with positive leading coefficient, the slopes between the two equilibria are negative, and they are most negative on the row halfway between, where the parabola has its vertex. For $\\frac{dy}{dx} = y^{2} - 4y + 3 = (y - 1)(y - 3)$ that row is $y = 2$, with slope $-1$.\n\nCheck: the derivative of the slope with respect to $y$ is $2y - 4$, which is $0$ at $y = 2$.\n\n> **Watch out.** The rows $y = 1$ and $y = 3$ are the flat ones; the steepest row lies between them.",
      "在自治方程的斜率场中，斜率只取决于所在的行。对首项系数为正的 $y$ 的二次式，两个平衡解之间的斜率为负，在正中间的那一行最负，那里是抛物线的顶点。对 $\\frac{dy}{dx} = y^{2} - 4y + 3 = (y - 1)(y - 3)$，这一行是 $y = 2$，斜率为 $-1$。\n\n检验：斜率关于 $y$ 的导数是 $2y - 4$，在 $y = 2$ 处为 $0$。\n\n> **注意。** $y = 1$ 和 $y = 3$ 两行是水平的；最陡的行在它们之间。",
    ],
    (rng) => {
      const k = rng.int(1, 4);
      const a = rng.int(-6, 5);
      const b = a + rng.int(1, 7);
      const f = poly([k, "y^{2}"], [-k * (a + b), "y"], [k * a * b, ""]);
      const answer = Q.of(a + b, 2);
      const lowest = Q.of(-k * (b - a) ** 2, 4);
      const factor = (r: number) => (r === 0 ? "y" : `(${linear(1, -r, "y")})`);
      return solvedDe(
        [
          `In the slope field of $\\frac{dy}{dx} = ${f}$, on which row $y = c$ is the slope the most negative? Give $c$.`,
          `在 $\\frac{dy}{dx} = ${f}$ 的斜率场中，哪一行 $y = c$ 上的斜率最负？求 $c$。`,
        ],
        answer,
        [
          deStep(
            ["Factor the slope", "把斜率因式分解"],
            [
              `The slope depends on $y$ alone; it is $0$ at the equilibria and negative between them:`,
              `斜率只依赖于 $y$；它在平衡解处为 $0$，在它们之间为负：`,
            ],
            `${f} = ${k === 1 ? "" : k}${factor(a)}${factor(b)}`,
          ),
          deStep(
            ["Take the vertex", "取顶点"],
            [
              "As a function of $y$ the slope is a parabola opening upward, lowest halfway between its zeros:",
              "作为 $y$ 的函数，斜率是开口向上的抛物线，在两个零点的正中间最低：",
            ],
            `c = \\frac{${a} + ${paren(b)}}{2} = ${answer.toLatex()}`,
          ),
        ],
        [
          `Differentiate the slope with respect to $y$: $${poly([2 * k, "y"], [-k * (a + b), ""])}$ is $0$ at $y = ${answer.toLatex()}$, where the slope is $${lowest.toLatex()}$.`,
          `把斜率对 $y$ 求导：$${poly([2 * k, "y"], [-k * (a + b), ""])}$ 在 $y = ${answer.toLatex()}$ 处为 $0$，那里的斜率为 $${lowest.toLatex()}$。`,
        ],
        [
          [
            a,
            `The row $y = ${a}$ is an equilibrium, where the slope is $0$, not most negative`,
            `行 $y = ${a}$ 是平衡解，那里斜率为 $0$，并不是最负`,
          ],
          [
            b,
            `The row $y = ${b}$ is an equilibrium, where the slope is $0$, not most negative`,
            `行 $y = ${b}$ 是平衡解，那里斜率为 $0$，并不是最负`,
          ],
          [
            a + b,
            "This is the sum of the equilibria; the vertex is halfway between them, at half the sum",
            "这是两个平衡解之和；顶点在它们正中间，是和的一半",
          ],
        ],
      );
    },
  ),
  figure: calculusDrawings5["slope-fields-for-autonomous-differential-equations#the-steepest-row-of-an-autonomous-field"],
};

const isoclineIntercept = {
  ...point(
    "the-line-of-equal-slopes",
    ["The line of equal slopes", "等斜率的直线"],
    [
      "Setting $\\frac{dy}{dx}$ equal to a constant $s$ gives the isocline for that slope, where all segments are parallel. For a linear right side the isoclines are parallel lines, and each one can be found by solving for $y$. For $\\frac{dy}{dx} = x + y - 2$ and slope $3$: $x + y - 2 = 3$, so $y = -x + 5$, with $y$-intercept $5$.\n\nCheck: at $(0, 5)$ the slope is $0 + 5 - 2 = 3$.\n\n> **Watch out.** Set the right side equal to $s$, not to $0$; setting it to $0$ gives the isocline of horizontal segments.",
      "令 $\\frac{dy}{dx}$ 等于常数 $s$，就得到这个斜率的等斜线，其上所有线段都平行。当右边是一次式时，等斜线是一组平行直线，解出 $y$ 就能得到每一条。对 $\\frac{dy}{dx} = x + y - 2$，斜率 $3$：$x + y - 2 = 3$，所以 $y = -x + 5$，$y$ 轴截距为 $5$。\n\n检验：在 $(0, 5)$ 处斜率为 $0 + 5 - 2 = 3$。\n\n> **注意。** 要令右边等于 $s$，而不是 $0$；令它等于 $0$ 得到的是水平线段的等斜线。",
    ],
    (rng) => {
      const a = nz(rng, 6);
      const b = rng.pick([-1, 1]);
      const c = rng.int(-9, 9);
      const s = rng.int(-6, 6);
      const answer = (s - c) * b;
      const eq = poly([a, "x"], [b, "y"], [c, ""]);
      const line = poly([-a * b, "x"], [answer, ""]);
      return solvedDe(
        [
          `In the slope field of $\\frac{dy}{dx} = ${eq}$, all the segments with slope $${s}$ lie on one line. Find its $y$-intercept.`,
          `在 $\\frac{dy}{dx} = ${eq}$ 的斜率场中，斜率为 $${s}$ 的线段都在同一条直线上。求它在 $y$ 轴上的截距。`,
        ],
        answer,
        [
          deStep(["Set the slope", "令斜率为给定值"], ["The segments with this slope are where", "具有这个斜率的线段满足"], `${eq} = ${s}`),
          deStep(["Solve for y", "解出 y"], ["", ""], `y = ${line}`),
        ],
        [
          `At the intercept $(0, ${answer})$ the slope is $${a} \\cdot 0 ${b < 0 ? "-" : "+"} ${paren(answer)} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${s}$, as required.`,
          `在截距点 $(0, ${answer})$ 处斜率为 $${a} \\cdot 0 ${b < 0 ? "-" : "+"} ${paren(answer)} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${s}$，符合要求。`,
        ],
        [
          [-answer, "A sign slipped when solving for $y$", "解出 $y$ 时符号出错了"],
          [
            s,
            `$${s}$ is the slope of the segments, not the intercept of the line they lie on`,
            `$${s}$ 是线段的斜率，不是它们所在直线的截距`,
          ],
          [c, "This is the constant of the right side; solve the equation for $y$", "这是右边的常数；要把方程解出 $y$"],
          [
            -c * b,
            `This is the intercept of the line of horizontal segments: set the right side equal to $${s}$, not $0$`,
            `这是水平线段所在直线的截距：右边应当等于 $${s}$，而不是 $0$`,
          ],
        ],
      );
    },
  ),
  figure: calculusDrawings5["slope-fields-for-nonautonomous-differential-equations#the-line-of-equal-slopes"],
};

const solutionAtZeroOfF = point(
  "a-zero-of-f-need-not-be-an-extremum",
  ["A zero of f need not be an extremum", "f 的零点不一定是极值点"],
  [
    "All solutions of $\\frac{dy}{dx} = f(x)$ are vertical shifts of one another, so they behave alike at a zero of $f$. They have an extremum only where $f$ changes sign. At a double zero the segments flatten and then continue in the same direction. For $\\frac{dy}{dx} = (x - 1)^{2}$ the slope is $0$ at $x = 1$ but positive on both sides, so no solution has an extremum there.\n\nCheck: the solutions $y = \\frac{(x - 1)^{3}}{3} + C$ are cubics, increasing through $x = 1$.\n\n> **Watch out.** A zero of $f$ is an extremum only if $f$ changes sign there; an even power keeps the sign.",
    "$\\frac{dy}{dx} = f(x)$ 的所有解互为竖直平移，所以在 $f$ 的零点处行为相同。只有在 $f$ 变号的地方才有极值。在二重零点处，线段变平后继续沿原方向。对 $\\frac{dy}{dx} = (x - 1)^{2}$，斜率在 $x = 1$ 处为 $0$，但两侧都为正，所以没有解在那里有极值。\n\n检验：解 $y = \\frac{(x - 1)^{3}}{3} + C$ 是三次函数，经过 $x = 1$ 时一直递增。\n\n> **注意。** 只有 $f$ 在零点处变号，那里才是极值点；偶次幂不改变符号。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const k = nz(rng, 5);
    const n = rng.int(1, 3);
    const base = linear(1, -a);
    const f = n === 1 && k === 1 ? base : poly([k, n === 1 ? `(${base})` : `(${base})^{${n}}`]);
    const oddEn = n === 1 ? `The factor $${base}$ changes sign there` : `The power $${n}$ is odd`;
    const oddZh = n === 1 ? `因子 $${base}$ 在那里变号` : `指数 $${n}$ 是奇数`;
    const even = n === 2;
    const max: Pair = ["Every solution has a local maximum", "每个解都有局部极大值"];
    const min: Pair = ["Every solution has a local minimum", "每个解都有局部极小值"];
    const flat: Pair = ["No solution has an extremum there", "没有解在那里有极值"];
    const some: Pair = ["It depends on the initial value of the solution", "取决于解的初值"];
    const correct = even ? flat : k > 0 ? min : max;
    const shifts: DeOption = [
      some,
      "All solutions are vertical shifts of one another, so they all behave the same way at this $x$",
      "所有解互为竖直平移，所以它们在这个 $x$ 处的行为都相同",
    ];
    const keeps = (o: Pair): DeOption => [
      o,
      "The power $2$ is even, so the slope has the same sign on both sides and the solutions do not turn",
      "指数 $2$ 是偶数，所以两侧斜率同号，解不会掉头",
    ];
    const wrong: DeOption[] = even
      ? [keeps(max), keeps(min), shifts]
      : [
          k > 0
            ? [max, "The slopes go from negative to positive, which makes a minimum, not a maximum", "斜率由负变正，这是极小值而不是极大值"]
            : [
                min,
                "The slopes go from positive to negative, which makes a maximum, not a minimum",
                "斜率由正变负，这是极大值而不是极小值",
              ],
          [flat, `${oddEn}, so the slope changes sign and the solutions turn`, `${oddZh}，所以斜率变号，解会掉头`],
          shifts,
        ];
    const antiCo = Q.of(k, n + 1);
    return pickedDe(
      rng,
      [
        `What happens at $x = ${a}$ to the solutions of $\\frac{dy}{dx} = ${f}$?`,
        `$\\frac{dy}{dx} = ${f}$ 的解在 $x = ${a}$ 处有什么情况？`,
      ],
      correct,
      wrong,
      [
        deStep(
          ["Read the sign on each side", "看两侧的符号"],
          even
            ? [
                `The power $2$ is even, so $(${base})^{2} > 0$ on both sides of $x = ${a}$, and $\\frac{dy}{dx}$ has the sign of $${k}$ on both sides.`,
                `指数 $2$ 是偶数，所以在 $x = ${a}$ 两侧 $(${base})^{2} > 0$，$\\frac{dy}{dx}$ 在两侧都与 $${k}$ 同号。`,
              ]
            : [
                `${oddEn}, so $\\frac{dy}{dx}$ changes from ${k > 0 ? "negative to positive" : "positive to negative"} at $x = ${a}$.`,
                `${oddZh}，所以 $\\frac{dy}{dx}$ 在 $x = ${a}$ 处${k > 0 ? "由负变正" : "由正变负"}。`,
              ],
        ),
        deStep(
          ["Conclude for every solution", "对所有解下结论"],
          even
            ? [
                "The solutions flatten there but keep going in the same direction, so none has an extremum.",
                "解在那里变平，但继续沿原方向走，所以都没有极值。",
              ]
            : [
                `Every solution turns there, so each has a local ${k > 0 ? "minimum" : "maximum"}.`,
                `每个解都在那里掉头，所以都有局部${k > 0 ? "极小值" : "极大值"}。`,
              ],
        ),
      ],
      [
        `Integrate: $y = ${poly([antiCo, `(${base})^{${n + 1}}`])} + C$. The power $${n + 1}$ is ${even ? "odd, so this is a cubic that keeps going the same way through" : `even, so the graph has its ${k > 0 ? "lowest" : "highest"} point at`} $x = ${a}$, for every $C$.`,
        `积分得 $y = ${poly([antiCo, `(${base})^{${n + 1}}`])} + C$。指数 $${n + 1}$ 是${even ? "奇数，所以这是三次曲线，经过" : "偶数，所以图像在"} $x = ${a}$ ${even ? "时一直沿同一方向" : `处取得${k > 0 ? "最低" : "最高"}点`}，对每个 $C$ 都如此。`,
      ],
    );
  },
);

const stayingAtUnstable = point(
  "a-solution-that-starts-at-an-unstable-equilibrium",
  ["A solution that starts at an unstable equilibrium", "从不稳定平衡解出发的解"],
  [
    "An unstable equilibrium repels nearby solutions, but a solution that starts exactly there stays there forever, because its slope is zero and it is a constant solution. Saying it moves to the stable equilibrium confuses it with solutions that start near it. For $\\frac{dy}{dx} = (y - 1)(y - 4)$ with $y(0) = 4$ the solution is $y = 4$ for all $x$, although the one with $y(0) = 4.1$ runs away.\n\nCheck: $y = 4$ has $y' = 0$, and the right side is $(4 - 1)(4 - 4) = 0$.\n\n> **Watch out.** Unstable does not mean the solution leaves: only solutions that start near the equilibrium, not on it, move away.",
    "不稳定平衡解会排斥附近的解，但恰好从那里出发的解会永远停留在那里，因为它的斜率为零，它是常数解。说它会移向稳定平衡解，是把它和附近出发的解混淆了。对 $\\frac{dy}{dx} = (y - 1)(y - 4)$，$y(0) = 4$，解对所有 $x$ 都是 $y = 4$，尽管 $y(0) = 4.1$ 的解会跑开。\n\n检验：$y = 4$ 满足 $y' = 0$，右边 $(4 - 1)(4 - 4) = 0$。\n\n> **注意。** 不稳定并不意味着解会离开：只有从平衡解附近而不是恰好从它出发的解才会远离。",
  ],
  (rng) => {
    const k = rng.pick([-3, -2, -1, 1, 2, 3]);
    const a = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4]);
    const b = a + rng.int(1, 6);
    const r = b === 0 ? a - 1 : b;
    const low = Math.min(a, r);
    const high = Math.max(a, r);
    const unstable = k > 0 ? high : low;
    const stable = k > 0 ? low : high;
    const fl = linear(1, -low).replace(/x/g, "y");
    const fh = linear(1, -high).replace(/x/g, "y");
    const f = poly([k, `(${fl})(${fh})`]);
    const at = `${k === 1 ? "" : k === -1 ? "-" : k}(${unstable} - ${paren(low)})(${unstable} - ${paren(high)})`;
    return solvedDe(
      [
        `For the differential equation $\\frac{dy}{dx} = ${f}$, find $\\lim_{x \\to \\infty} y(x)$ for the solution with $y(0) = ${unstable}$.`,
        `对微分方程 $\\frac{dy}{dx} = ${f}$，求满足 $y(0) = ${unstable}$ 的解的 $\\lim_{x \\to \\infty} y(x)$。`,
      ],
      unstable,
      [
        deStep(["Find the slope at the start", "求起点处的斜率"], ["", ""], `\\frac{dy}{dx}\\Big|_{y = ${unstable}} = ${at} = 0`),
        deStep(
          ["Read the solution", "读出解"],
          [
            `The slope is $0$, so the constant $y = ${unstable}$ is the solution: it never moves, and the limit is $${unstable}$.`,
            `斜率为 $0$，所以常数 $y = ${unstable}$ 就是这个解：它永远不动，极限是 $${unstable}$。`,
          ],
        ),
      ],
      [
        `Substitute $y = ${unstable}$: the left side is $y' = 0$ and the right side is $${at} = 0$, and $y(0) = ${unstable}$ holds. Solutions are unique here, so this is the one.`,
        `代入 $y = ${unstable}$：左边 $y' = 0$，右边 $${at} = 0$，且 $y(0) = ${unstable}$ 成立。这里解是唯一的，所以就是它。`,
      ],
      [
        [
          stable,
          `Solutions that start near $${unstable}$ head there, but this one starts exactly on the equilibrium and stays`,
          `从 $${unstable}$ 附近出发的解会去那里，但这个解恰好从平衡解出发，会一直停留`,
        ],
        [
          0,
          `The slope is $0$ at the start, so $y$ keeps its starting value $${unstable}$`,
          `起点处斜率为 $0$，所以 $y$ 保持初值 $${unstable}$`,
        ],
        [low + high, "This adds the two equilibria; the solution stays at its start", "这是两个平衡解之和；解会停留在起点"],
      ],
    );
  },
);

const eulerBias = point(
  "whether-eulers-method-runs-high-or-low",
  ["Whether Euler's method runs high or low", "欧拉法偏高还是偏低"],
  [
    "Each Euler step follows a tangent line. On a concave-up solution the tangent lies below the curve, so the estimate is too low, and on a concave-down solution it is too high. When the solution is a straight line, Euler's method is exact. For $\\frac{dy}{dx} = 2x$ from $y(0) = 0$ with $h = \\frac{1}{2}$: $y_1 = 0$ and $y_2 = 0 + \\frac{1}{2} \\cdot 1 = \\frac{1}{2}$, while the true value is $y(1) = 1$; here $y'' = 2 > 0$.\n\nCheck: the true solution $y = x^{2}$ is concave up and lies above each of its tangent lines, so every step falls short.\n\n> **Watch out.** The sign of $y''$ along the path decides it, not the sign of $y'$: a falling solution can still be concave up.",
    "欧拉法的每一步都沿切线走。在上凹的解上，切线位于曲线下方，所以估计偏低；在下凹的解上则偏高。当解是直线时，欧拉法是精确的。对 $\\frac{dy}{dx} = 2x$，$y(0) = 0$，$h = \\frac{1}{2}$：$y_1 = 0$，$y_2 = 0 + \\frac{1}{2} \\cdot 1 = \\frac{1}{2}$，而真实值 $y(1) = 1$；这里 $y'' = 2 > 0$。\n\n检验：真实解 $y = x^{2}$ 是上凹的，位于它的每条切线上方，所以每一步都走不够。\n\n> **注意。** 决定偏高偏低的是沿途 $y''$ 的符号，而不是 $y'$ 的符号：下降的解也可以是上凹的。",
  ],
  (rng) => {
    const kind = rng.pick(["linear", "exp", "const"] as const);
    const m = nz(rng, 9);
    const x0 = rng.int(1, 6);
    const y0 = rng.int(1, 9);
    const hq = rng.pick([Q.of(1, 2), Q.of(1, 4), Q.of(1, 10)]);
    const h = dec(hq);
    const right = kind === "linear" ? poly([m, "x"]) : kind === "exp" ? poly([m, "y"]) : `${m}`;
    const start = kind === "exp" ? 0 : x0;
    const second = kind === "linear" ? m : kind === "exp" ? 1 : 0;
    const low: Pair = ["Too low", "偏低"];
    const high: Pair = ["Too high", "偏高"];
    const exact: Pair = ["Exactly right", "完全准确"];
    const depends: Pair = ["It cannot be told without computing the steps", "不计算各步就无法判断"];
    const correct = second > 0 ? low : second < 0 ? high : exact;
    const whyEn =
      kind === "linear"
        ? `$\\frac{d^{2}y}{dx^{2}} = ${m}$`
        : kind === "exp"
          ? `$\\frac{d^{2}y}{dx^{2}} = ${m * m}y$, which is positive because $y$ stays positive`
          : "$\\frac{d^{2}y}{dx^{2}} = 0$";
    const whyZh =
      kind === "linear"
        ? `$\\frac{d^{2}y}{dx^{2}} = ${m}$`
        : kind === "exp"
          ? `$\\frac{d^{2}y}{dx^{2}} = ${m * m}y$，因为 $y$ 始终为正，所以它为正`
          : "$\\frac{d^{2}y}{dx^{2}} = 0$";
    const noSteps: DeOption = [
      depends,
      "The sign of $y''$ decides it without computing any step",
      "$y''$ 的符号就能决定，不必计算任何一步",
    ];
    const wrong: DeOption[] =
      second > 0
        ? [
            [
              high,
              "The solution is concave up, so its tangent lines lie below it, not above",
              "解是上凹的，所以切线位于它下方，而不是上方",
            ],
            [exact, "Only a straight-line solution is followed exactly, and this one bends", "只有直线解才会被精确跟随，而这个解是弯的"],
            noSteps,
          ]
        : second < 0
          ? [
              [
                low,
                "The solution is concave down, so its tangent lines lie above it, not below",
                "解是下凹的，所以切线位于它上方，而不是下方",
              ],
              [exact, "Only a straight-line solution is followed exactly, and this one bends", "只有直线解才会被精确跟随，而这个解是弯的"],
              noSteps,
            ]
          : [
              [
                low,
                "With $y'' = 0$ the solution is a straight line, and each step follows it exactly",
                "$y'' = 0$ 时解是直线，每一步都恰好沿着它",
              ],
              [
                high,
                "With $y'' = 0$ the solution is a straight line, and each step follows it exactly",
                "$y'' = 0$ 时解是直线，每一步都恰好沿着它",
              ],
              noSteps,
            ];
    const gap = Q.of(m, 2).mul(hq).mul(hq);
    const check: Pair =
      kind === "linear"
        ? [
            `Compare one step with the true solution $y = ${poly([Q.of(m, 2), "x^{2}"])} + C$: from $x = ${x0}$ the true rise is the Euler rise $${h} \\cdot ${m * x0}$ plus $\\frac{${m}}{2}h^{2} = ${gap.toLatex()}$, which is ${m > 0 ? "positive, so Euler falls short" : "negative, so Euler overshoots"}.`,
            `把一步与真实解 $y = ${poly([Q.of(m, 2), "x^{2}"])} + C$ 比较：从 $x = ${x0}$ 出发，真实的升高等于欧拉法的升高 $${h} \\cdot ${m * x0}$ 再加上 $\\frac{${m}}{2}h^{2} = ${gap.toLatex()}$，它${m > 0 ? "为正，所以欧拉法偏低" : "为负，所以欧拉法偏高"}。`,
          ]
        : kind === "exp"
          ? [
              `The true solution is $y = ${y0}e^{${m}x}$, and one step gives $${y0}(1 + ${paren(m)} \\cdot ${h})$. Since $e^{u} > 1 + u$ for every $u \\ne 0$, the true value is larger: the estimate is low.`,
              `真实解是 $y = ${y0}e^{${m}x}$，一步得 $${y0}(1 + ${paren(m)} \\cdot ${h})$。由于对每个 $u \\ne 0$ 都有 $e^{u} > 1 + u$，真实值更大：估计偏低。`,
            ]
          : [
              `The true solution is the line $y = ${y0} + ${paren(m)}(${linear(1, -x0)})$, and each step adds $${h} \\cdot ${paren(m)}$, exactly the line's rise over the step.`,
              `真实解是直线 $y = ${y0} + ${paren(m)}(${linear(1, -x0)})$，每一步加上 $${h} \\cdot ${paren(m)}$，正好是直线在这一步上的升高。`,
            ];
    return pickedDe(
      rng,
      [
        `Euler's method with step $${h}$ is used for $\\frac{dy}{dx} = ${right}$ from $y(${start}) = ${y0}$, moving to the right. How do its estimates compare with the true solution?`,
        `用步长 $${h}$ 的欧拉法求解 $\\frac{dy}{dx} = ${right}$，从 $y(${start}) = ${y0}$ 出发向右计算。它的估计值与真实解相比如何？`,
      ],
      correct,
      wrong,
      [
        deStep(["Find the second derivative", "求二阶导数"], [`Differentiate the equation: ${whyEn}.`, `对方程求导：${whyZh}。`]),
        deStep(
          ["Compare tangent and curve", "比较切线与曲线"],
          second > 0
            ? [
                "The solution is concave up, so the tangent steps stay below it: the estimates are too low.",
                "解是上凹的，所以沿切线的各步都在它下方：估计偏低。",
              ]
            : second < 0
              ? [
                  "The solution is concave down, so the tangent steps stay above it: the estimates are too high.",
                  "解是下凹的，所以沿切线的各步都在它上方：估计偏高。",
                ]
              : ["The solution is a straight line, so the steps follow it exactly.", "解是直线，所以各步恰好沿着它。"],
        ),
      ],
      check,
    );
  },
);

/** deeperCalculusIIThird2Points maps topics of Calculus II, from infinite series to first differential equations, to a third knowledge point. */
export const deeperCalculusIIThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "properties-of-infinite-series": [sumFromPartialSums],
  "further-properties-of-infinite-series": [noTermwiseProduct],
  "writing-an-infinite-geometric-series-in-sigma-notation": [sumFromAStartIndex],
  "repeating-decimals-as-infinite-geometric-series": [repeatingNines],
  "the-nth-term-test-for-divergence": [converseTrap],
  "the-integral-test": [integralTailBound],
  "the-comparison-test": [comparisonDirections],
  "the-limit-comparison-test": [pForComparison],
  "the-alternating-series-test": [betweenPartialSums],
  "the-ratio-test": [ratioWithNN],
  "the-root-test": [rootWithE],
  "absolute-and-conditional-convergence": [conditionalParameter],
  "the-alternating-series-error-bound": [overOrUnderPartial],
  "determining-convergence-parameters-for-infinite-series": [logParameter],
  "selecting-procedures-for-analyzing-infinite-series": [testThatFails],
  "third-degree-taylor-polynomials": [derivativeFromCoefficient],
  "radius-of-convergence-of-power-series": [radiusWithCoefficient],
  "introduction-to-differential-equations": [constantsFromOrder],
  "verifying-solutions-of-differential-equations": [constantThatMakesASolution],
  "solving-first-order-odes-using-direct-integration": [constantIsNotTheInitialValue],
  "modeling-with-first-order-odes": [longTermValue],
  "qualitative-analysis-of-first-order-odes": [extremumOfSolution],
  "exponential-growth-and-decay-models-with-first-order-odes": [halfLifeFromAmounts],
  "slope-fields-for-directly-integrable-differential-equations": [flatColumns],
  "slope-fields-for-autonomous-differential-equations": [steepestRow],
  "slope-fields-for-nonautonomous-differential-equations": [isoclineIntercept],
  "analyzing-slope-fields-for-directly-integrable-differential-equations": [solutionAtZeroOfF],
  "analyzing-slope-fields-for-autonomous-differential-equations": [stayingAtUnstable],
  "eulers-method-calculating-multiple-steps": [eulerBias],
};
