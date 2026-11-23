// Third knowledge points for thin topics of Calculus II, from infinite series to
// first differential equations: the reverse question, a harder case or a common
// trap. See `deeperCalculusIIThird2Points`.

import type { KnowledgePointDef, Problem, Rng } from "@ga/content";
import { t } from "@ga/content";
import { dec, linear, paren, poly, Q } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";
import { explainedChoice, numberProblem } from "../problems.ts";

import { ask, choose, type Pair, point } from "../university-kit.ts";
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
    "The sum of a series is by definition the limit of its partial sums, not of its terms. So a formula for $S_{N}$ gives the sum by taking $N \\to \\infty$. The first partial sum $S_{1}$ is only the first term, and the terms themselves tend to $0$.",
    "级数的和按定义是部分和的极限，而不是通项的极限。所以知道 $S_{N}$ 的公式，令 $N \\to \\infty$ 就得到和。第一个部分和 $S_{1}$ 只是第一项，而通项本身趋于 $0$。",
  ],
  (rng) => {
    const p = nz(rng, 9);
    let q = nz(rng, 9);
    const r = rng.int(1, 9);
    const s = rng.int(1, 9);
    if (p * s === q * r) q = q === 9 ? 8 : q + 1;
    const answer = Q.of(p, r);
    const S = `\\frac{${poly([p, "N"], [q, ""])}}{${poly([r, "N"], [s, ""])}}`;
    return ask(
      [
        `The partial sums of a series are $S_{N} = ${S}$. Find the sum of the series.`,
        `一个级数的部分和是 $S_{N} = ${S}$。求这个级数的和。`,
      ],
      answer,
      [Q.of(p + q, r + s), 0, Q.of(q, s)],
      [
        `The sum is $\\lim_{N \\to \\infty} S_{N}$. Dividing the numerator and denominator by $N$ gives the ratio of the leading coefficients, $${answer.toLatex()}$.`,
        `和是 $\\lim_{N \\to \\infty} S_{N}$。分子分母同除以 $N$，得首项系数之比 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const noTermwiseProduct = point(
  "series-do-not-multiply-term-by-term",
  ["Series do not multiply term by term", "级数不能逐项相乘"],
  [
    "Sums and constant multiples of convergent series behave as expected, but products do not. The series of products $a_{n}b_{n}$ need not sum to the product of the sums, and it need not even converge, as $a_{n} = b_{n} = \\frac{(-1)^{n}}{\\sqrt{n}}$ shows.",
    "收敛级数的和与常数倍符合预期，但积并非如此。由 $a_{n}b_{n}$ 组成的级数，其和不一定等于两个和的积，甚至不一定收敛，$a_{n} = b_{n} = \\frac{(-1)^{n}}{\\sqrt{n}}$ 就是一个例子。",
  ],
  (rng) => {
    const A = nz(rng, 9);
    const B = nz(rng, 9);
    return choose(
      rng,
      [
        `$\\sum_{n=1}^{\\infty} a_{n} = ${A}$ and $\\sum_{n=1}^{\\infty} b_{n} = ${B}$. What can be said about $\\sum_{n=1}^{\\infty} a_{n}b_{n}$?`,
        `$\\sum_{n=1}^{\\infty} a_{n} = ${A}$，$\\sum_{n=1}^{\\infty} b_{n} = ${B}$。关于 $\\sum_{n=1}^{\\infty} a_{n}b_{n}$ 能得出什么结论？`,
      ],
      ["Nothing definite: it need not converge at all", "没有确定的结论：它甚至不一定收敛"],
      [
        [`It converges to $${A * B}$`, `它收敛到 $${A * B}$`],
        [`It converges, but not necessarily to $${A * B}$`, `它收敛，但不一定收敛到 $${A * B}$`],
        ["It must diverge", "它一定发散"],
      ],
      [
        `A sum is not a product of terms: $(a_{1} + a_{2})(b_{1} + b_{2})$ has cross terms. With $a_{n} = b_{n} = \\frac{(-1)^{n}}{\\sqrt{n}}$, both series converge, but the products are $\\frac{1}{n}$, whose series diverges. Other pairs do converge, so nothing is forced.`,
        `和的积不等于逐项积：$(a_{1} + a_{2})(b_{1} + b_{2})$ 有交叉项。取 $a_{n} = b_{n} = \\frac{(-1)^{n}}{\\sqrt{n}}$，两个级数都收敛，但积是 $\\frac{1}{n}$，其级数发散。另一些例子又是收敛的，所以没有确定的结论。`,
      ],
    );
  },
);

const sumFromAStartIndex = point(
  "geometric-series-that-start-at-a-later-index",
  ["Geometric series that start at a later index", "从较后下标开始的几何级数"],
  [
    "The formula $\\frac{a}{1 - r}$ needs the actual first term of the series, which is the term at the lower limit. For $\\sum_{n=k}^{\\infty} cr^{n}$ that is $cr^{k}$, not $c$, so the sum is $\\frac{cr^{k}}{1 - r}$.",
    "公式 $\\frac{a}{1 - r}$ 要用级数真正的第一项，也就是下限处的项。对 $\\sum_{n=k}^{\\infty} cr^{n}$，第一项是 $cr^{k}$，而不是 $c$，所以和是 $\\frac{cr^{k}}{1 - r}$。",
  ],
  (rng) => {
    const r = ratio(rng);
    const c = nz(rng, 12);
    const k = rng.int(1, 3);
    const first = Q.of(c).mul(r.pow(k));
    const denom = Q.one.sub(r);
    const answer = first.div(denom);
    const term = poly([c, `\\left(${r.toLatex()}\\right)^{n}`]);
    return ask(
      [`Find $\\sum_{n=${k}}^{\\infty} ${term}$.`, `求 $\\sum_{n=${k}}^{\\infty} ${term}$。`],
      answer,
      [
        Q.of(c).div(denom),
        Q.of(c)
          .mul(r.pow(k - 1))
          .div(denom),
        first.div(Q.one.add(r)),
      ],
      [
        `The first term is the one with $n = ${k}$, which is $${first.toLatex()}$, and the ratio is $${r.toLatex()}$. So the sum is $${first.toLatex()} \\div ${denom.toLatex()} = ${answer.toLatex()}$.`,
        `第一项是 $n = ${k}$ 的项，即 $${first.toLatex()}$，公比是 $${r.toLatex()}$。所以和是 $${first.toLatex()} \\div ${denom.toLatex()} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const repeatingNines = point(
  "decimals-that-end-in-repeating-nines",
  ["Decimals that end in repeating nines", "以循环 9 结尾的小数"],
  [
    "A repeating $9$ is not slightly less than the next decimal; it equals it. As a geometric series, $0.\\overline{9} = \\frac{9/10}{1 - 1/10} = 1$. So a decimal ending in repeating nines is a terminating decimal in disguise.",
    "循环的 $9$ 并不是比下一个小数略小，而是恰好相等。作为几何级数，$0.\\overline{9} = \\frac{9/10}{1 - 1/10} = 1$。所以以循环 $9$ 结尾的小数其实是有限小数。",
  ],
  (rng) => {
    const a = rng.int(0, 9);
    const b = rng.int(0, 8);
    const answer = Q.of(10 * a + b + 1, 10);
    return ask(
      [`Write $${a}.${b}\\overline{9}$ as a fraction in lowest terms.`, `把 $${a}.${b}\\overline{9}$ 写成最简分数。`],
      answer,
      [Q.of(100 * a + 10 * b + 9, 100), Q.of(10 * a + b, 10), Q.of(10 * a + b + 9, 10)],
      [
        `The repeating part is $\\frac{9}{100} + \\frac{9}{1000} + \\cdots = \\frac{9/100}{9/10} = \\frac{1}{10}$. So the number is $${a}.${b} + \\frac{1}{10} = ${answer.toLatex()}$.`,
        `循环部分是 $\\frac{9}{100} + \\frac{9}{1000} + \\cdots = \\frac{9/100}{9/10} = \\frac{1}{10}$。所以这个数是 $${a}.${b} + \\frac{1}{10} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

/** pSeries lists terms of the form c over a power of n, with whether their series converges. */
const pSeries = [
  { term: (c: number) => `\\frac{${c}}{n}`, converges: false },
  { term: (c: number) => `\\frac{${c}}{\\sqrt{n}}`, converges: false },
  { term: (c: number) => `\\frac{${c}}{n^{2}}`, converges: true },
  { term: (c: number) => `\\frac{${c}}{n\\sqrt{n}}`, converges: true },
  { term: (c: number) => `\\frac{${c}}{n^{3}}`, converges: true },
] as const;

const converseTrap = point(
  "terms-tending-to-zero-prove-nothing",
  ["Terms tending to zero prove nothing", "通项趋于零不能证明收敛"],
  [
    "The $n$th term test can only prove divergence. When the terms tend to $0$ it says nothing, and the series may converge or diverge. Another test must decide, and the harmonic series is the standard warning that small terms are not enough.",
    "第 $n$ 项检验只能证明发散。通项趋于 $0$ 时它不提供任何信息，级数可能收敛也可能发散。必须用别的检验来判断，调和级数就是通项很小也不够的典型例子。",
  ],
  (rng) => {
    const s = rng.pick(pSeries);
    const c = rng.int(1, 20);
    const yes: Pair = ["The test says nothing; the $p$-series test shows that it converges", "该检验不提供信息；$p$ 级数检验说明它收敛"];
    const no: Pair = ["The test says nothing; the $p$-series test shows that it diverges", "该检验不提供信息；$p$ 级数检验说明它发散"];
    return choose(
      rng,
      [
        `The terms of $\\sum_{n=1}^{\\infty} ${s.term(c)}$ tend to $0$. Which conclusion is correct?`,
        `$\\sum_{n=1}^{\\infty} ${s.term(c)}$ 的通项趋于 $0$。哪个结论是正确的？`,
      ],
      s.converges ? yes : no,
      [
        s.converges ? no : yes,
        ["The test shows that it converges, because the terms tend to $0$", "该检验说明它收敛，因为通项趋于 $0$"],
        ["The test shows that it diverges, because the limit of the terms is $0$", "该检验说明它发散，因为通项的极限是 $0$"],
      ],
      [
        `A limit of $0$ gives no information from the $n$th term test. The power of $n$ in the denominator is ${s.converges ? "greater than $1$, so the series converges" : "at most $1$, so the series diverges"}.`,
        `极限为 $0$ 时，第 $n$ 项检验不提供信息。分母中 $n$ 的次数${s.converges ? "大于 $1$，所以级数收敛" : "不超过 $1$，所以级数发散"}。`,
      ],
    );
  },
);

const integralTailBound = {
  ...point(
    "bounding-the-tail-with-an-integral",
    ["Bounding the tail with an integral", "用积分估计余项"],
    [
      "The integral test also estimates the error. For positive decreasing $f$, the tail after $N$ terms satisfies $\\sum_{n=N+1}^{\\infty} f(n) \\le \\int_{N}^{\\infty} f(x) \\, dx$. The lower limit is $N$, the last term included in the partial sum, because the rectangles lie under the curve.",
      "积分检验也能估计误差。对正的递减函数 $f$，前 $N$ 项之后的余项满足 $\\sum_{n=N+1}^{\\infty} f(n) \\le \\int_{N}^{\\infty} f(x) \\, dx$。下限是 $N$，即部分和所含的最后一项，因为这些矩形位于曲线下方。",
    ],
    (rng) => {
      const p = rng.int(2, 4);
      const c = rng.int(1, 20);
      const N = rng.int(2, 15);
      const answer = Q.of(c, (p - 1) * N ** (p - 1));
      return ask(
        [
          `Use the integral $\\int_{${N}}^{\\infty}$ to find an upper bound for $\\sum_{n=${N + 1}}^{\\infty} \\frac{${c}}{n^{${p}}}$.`,
          `用积分 $\\int_{${N}}^{\\infty}$ 求 $\\sum_{n=${N + 1}}^{\\infty} \\frac{${c}}{n^{${p}}}$ 的一个上界。`,
        ],
        answer,
        [Q.of(c, N ** p), Q.of(c, N ** (p - 1)), Q.of(c, (p - 1) * (N + 1) ** (p - 1))],
        [
          `$\\int_{${N}}^{\\infty} \\frac{${c}}{x^{${p}}} \\, dx = ${answer.toLatex()}$, and the sum of the rectangles to the right of $${N}$ is below this area.`,
          `$\\int_{${N}}^{\\infty} \\frac{${c}}{x^{${p}}} \\, dx = ${answer.toLatex()}$，而 $${N}$ 右侧各矩形面积之和小于这个面积。`,
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
    "Comparison works in only two directions: below a convergent series gives convergence, and above a divergent series gives divergence. Being below a divergent series, or above a convergent one, proves nothing, however natural the comparison looks.",
    "比较只在两个方向上有效：小于收敛级数则收敛，大于发散级数则发散。小于发散级数或大于收敛级数都证明不了什么，不管这个比较看起来多么自然。",
  ],
  (rng) => {
    const big = rng.bool();
    const conv = rng.bool();
    const c = rng.int(1, 12);
    const p = rng.int(2, 6);
    const b = conv ? `\\frac{${c}}{n^{${p}}}` : rng.pick([`\\frac{${c}}{n}`, `\\frac{${c}}{\\sqrt{n}}`]);
    const ineq = big ? `a_{n} \\ge ${b} > 0` : `0 \\le a_{n} \\le ${b}`;
    const yes: Pair = ["$\\sum a_{n}$ converges", "$\\sum a_{n}$ 收敛"];
    const no: Pair = ["$\\sum a_{n}$ diverges", "$\\sum a_{n}$ 发散"];
    const none: Pair = ["Nothing can be concluded from this", "由此得不出任何结论"];
    const eq: Pair = ["$\\sum a_{n}$ equals the other sum", "$\\sum a_{n}$ 等于另一个和"];
    const correct = !big && conv ? yes : big && !conv ? no : none;
    return choose(
      rng,
      [
        `For every $n \\ge 1$, $${ineq}$. What follows about $\\sum_{n=1}^{\\infty} a_{n}$?`,
        `对每个 $n \\ge 1$，都有 $${ineq}$。关于 $\\sum_{n=1}^{\\infty} a_{n}$ 能得出什么？`,
      ],
      correct,
      [yes, no, none, eq].filter((o) => o !== correct),
      [
        correct === none
          ? `The series on the right ${conv ? "converges" : "diverges"} and $a_{n}$ is ${big ? "above" : "below"} it, which is the useless direction. So nothing follows.`
          : `The series on the right ${conv ? "converges" : "diverges"} and $a_{n}$ is ${big ? "above" : "below"} it, so the comparison test applies and $\\sum a_{n}$ ${conv ? "converges" : "diverges"}.`,
        correct === none
          ? `右边的级数${conv ? "收敛" : "发散"}，而 $a_{n}$ ${big ? "大于" : "小于"}它，这是无效的方向。所以得不出结论。`
          : `右边的级数${conv ? "收敛" : "发散"}，而 $a_{n}$ ${big ? "大于" : "小于"}它，所以比较检验适用，$\\sum a_{n}$ ${conv ? "收敛" : "发散"}。`,
      ],
    );
  },
);

const pForComparison = point(
  "choosing-the-power-to-compare-with",
  ["Choosing the power to compare with", "选择用于比较的幂"],
  [
    "The limit comparison test needs a good comparison series. Keep only the dominant term of the numerator and of the denominator. A root halves the exponent, so $\\sqrt{n^{m}}$ behaves like $n^{m/2}$, and the power in the comparison is a difference of these degrees.",
    "极限比较检验需要一个合适的比较级数。分子和分母都只保留主导项。根号使指数减半，所以 $\\sqrt{n^{m}}$ 的行为像 $n^{m/2}$，比较级数的幂就是这些次数之差。",
  ],
  (rng) => {
    const i = rng.int(1, 2);
    const m = rng.int(2 * i + 1, 9);
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    const d = rng.int(1, 9);
    const answer = Q.of(m - 2 * i, 2);
    const top = poly([a, i === 1 ? "n" : `n^{${i}}`], [b, ""]);
    return ask(
      [
        `To test $\\sum_{n=1}^{\\infty} \\frac{${top}}{\\sqrt{n^{${m}} + ${d}}}$, it is compared with $\\sum_{n=1}^{\\infty} \\frac{1}{n^{p}}$, so that the limit of the ratio of terms is finite and not zero. Find $p$.`,
        `为了检验 $\\sum_{n=1}^{\\infty} \\frac{${top}}{\\sqrt{n^{${m}} + ${d}}}$，把它与 $\\sum_{n=1}^{\\infty} \\frac{1}{n^{p}}$ 比较，使通项之比的极限有限且不为零。求 $p$。`,
      ],
      answer,
      [m - i, Q.of(m + 2 * i, 2), Q.of(m, 2)],
      [
        `The numerator behaves like $${i === 1 ? "n" : `n^{${i}}`}$ and the denominator like $n^{${Q.of(m, 2).toLatex()}}$. So the terms behave like a constant over $n^{p}$ with $p = ${Q.of(m, 2).toLatex()} - ${i} = ${answer.toLatex()}$.`,
        `分子的行为像 $${i === 1 ? "n" : `n^{${i}}`}$，分母的行为像 $n^{${Q.of(m, 2).toLatex()}}$。所以通项的行为像常数除以 $n^{p}$，其中 $p = ${Q.of(m, 2).toLatex()} - ${i} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const betweenPartialSums = point(
  "the-sum-lies-between-consecutive-partial-sums",
  ["The sum lies between consecutive partial sums", "和位于相邻部分和之间"],
  [
    "For an alternating series with decreasing terms and positive first term, partial sums go up and down around the sum. Odd partial sums are too high and even ones too low. So the sum is always between two consecutive partial sums.",
    "对通项递减、首项为正的交错级数，部分和在和的上下交替。奇数项部分和偏高，偶数项部分和偏低。所以和总是在两个相邻的部分和之间。",
  ],
  (rng) => {
    const N = rng.int(3, 14);
    const S = Q.of(rng.int(50, 500), 100);
    const b = Q.of(rng.int(1, 40), 100);
    const even = N % 2 === 0;
    const low = S.sub(b);
    const high = S.add(b);
    const interval = (p: Q, q: Q): Pair => same2(`${dec(p)} < S < ${dec(q)}`);
    return choose(
      rng,
      [
        `$S = \\sum_{n=1}^{\\infty} (-1)^{n+1} b_{n}$, where the positive terms $b_{n}$ decrease to $0$. If $S_{${N}} = ${dec(S)}$ and $b_{${N + 1}} = ${dec(b)}$, which is true?`,
        `$S = \\sum_{n=1}^{\\infty} (-1)^{n+1} b_{n}$，其中正项 $b_{n}$ 递减趋于 $0$。如果 $S_{${N}} = ${dec(S)}$，$b_{${N + 1}} = ${dec(b)}$，哪项正确？`,
      ],
      even ? interval(S, high) : interval(low, S),
      [even ? interval(low, S) : interval(S, high), interval(high, high.add(b)), interval(low.sub(b), low)],
      [
        `The next term is ${even ? "added" : "subtracted"} because $${N} + 1$ is ${even ? "odd" : "even"}, so $S_{${N + 1}} = ${dec(even ? high : low)}$. The sum $S$ lies between $S_{${N}}$ and $S_{${N + 1}}$.`,
        `因为 $${N} + 1$ 是${even ? "奇数，下一项要加上" : "偶数，下一项要减去"}，所以 $S_{${N + 1}} = ${dec(even ? high : low)}$。和 $S$ 在 $S_{${N}}$ 与 $S_{${N + 1}}$ 之间。`,
      ],
    );
  },
);

const ratioWithNN = point(
  "the-ratio-test-with-n-to-the-n",
  ["The ratio test with n to the n", "含 n 的 n 次幂的比值检验"],
  [
    "When $n^{n}$ appears, the ratio simplifies to a power that gives a limit involving $e$: $\\frac{(n + 1)!}{(n + 1)^{n+1}} \\cdot \\frac{n^{n}}{n!} = \\left(\\frac{n}{n + 1}\\right)^{n} \\to \\frac{1}{e}$. So the decision depends on how a base compares with $e$, not with $1$.",
    "出现 $n^{n}$ 时，比值化简后是一个幂，其极限涉及 $e$：$\\frac{(n + 1)!}{(n + 1)^{n+1}} \\cdot \\frac{n^{n}}{n!} = \\left(\\frac{n}{n + 1}\\right)^{n} \\to \\frac{1}{e}$。所以结论取决于底数与 $e$ 的大小，而不是与 $1$ 比较。",
  ],
  (rng) => {
    const c = rng.int(1, 6);
    const d = rng.int(1, 9);
    const conv = c <= 2;
    const num = `${d === 1 ? "" : `${d} \\cdot `}${c === 1 ? "" : `${c}^{n} \\cdot `}n!`;
    const L = `L = \\frac{${c}}{e}`;
    const say = (l: string, yes: boolean): Pair => [
      `$${l}$, so it ${yes ? "converges" : "diverges"}`,
      `$${l}$，所以它${yes ? "收敛" : "发散"}`,
    ];
    return choose(
      rng,
      [
        `What does the ratio test say about $\\sum_{n=1}^{\\infty} \\frac{${num}}{n^{n}}$?`,
        `比值检验对 $\\sum_{n=1}^{\\infty} \\frac{${num}}{n^{n}}$ 给出什么结论？`,
      ],
      say(L, conv),
      [say(L, !conv), say(`L = ${c}`, c < 1), say("L = 0", true)],
      [
        `The ratio simplifies to $${c}\\left(\\frac{n}{n + 1}\\right)^{n}$, which tends to $\\frac{${c}}{e}$. Since $e$ is about $2.718$, this is ${conv ? "less than $1$, so the series converges" : "greater than $1$, so the series diverges"}.`,
        `比值化简为 $${c}\\left(\\frac{n}{n + 1}\\right)^{n}$，它趋于 $\\frac{${c}}{e}$。因为 $e$ 约为 $2.718$，所以它${conv ? "小于 $1$，级数收敛" : "大于 $1$，级数发散"}。`,
      ],
    );
  },
);

const rootWithE = point(
  "the-root-test-with-a-limit-equal-to-a-power-of-e",
  ["The root test with a power of e", "极限为 e 的幂的根值检验"],
  [
    "The root of $\\left(1 + \\frac{k}{n}\\right)^{n^{2}}$ is $\\left(1 + \\frac{k}{n}\\right)^{n}$, which tends to $e^{k}$, not to $1$. It is tempting to say the base tends to $1$, but the exponent also grows, and that argument is not valid.",
    "$\\left(1 + \\frac{k}{n}\\right)^{n^{2}}$ 的 $n$ 次方根是 $\\left(1 + \\frac{k}{n}\\right)^{n}$，它趋于 $e^{k}$，而不是 $1$。很容易认为底数趋于 $1$，但指数也在增大，这种论证是不成立的。",
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
    return choose(
      rng,
      [`What does the root test say about $\\sum_{n=1}^{\\infty} ${term}$?`, `根值检验对 $\\sum_{n=1}^{\\infty} ${term}$ 给出什么结论？`],
      say(L, conv),
      [say(L, !conv), say(`L = \\frac{1}{${c}}`, true), ["$L = 1$, so the test says nothing", "$L = 1$，所以该检验不提供信息"]],
      [
        `$\\sqrt[n]{a_{n}} = \\frac{1}{${c}}\\left(1 + \\frac{${k}}{n}\\right)^{n}$ tends to $\\frac{${power}}{${c}}$. Here $${power}$ is about $${size.toFixed(2)}$, so this is ${conv ? "less than $1$, and the series converges" : "greater than $1$, and the series diverges"}.`,
        `$\\sqrt[n]{a_{n}} = \\frac{1}{${c}}\\left(1 + \\frac{${k}}{n}\\right)^{n}$ 趋于 $\\frac{${power}}{${c}}$。这里 $${power}$ 约为 $${size.toFixed(2)}$，所以它${conv ? "小于 $1$，级数收敛" : "大于 $1$，级数发散"}。`,
      ],
    );
  },
);

const conditionalParameter = point(
  "where-conditional-convergence-happens",
  ["Where conditional convergence happens", "条件收敛发生的范围"],
  [
    "For $\\sum \\frac{(-1)^{n}}{n^{s}}$, the series converges absolutely for $s > 1$, conditionally for $0 < s \\le 1$, and diverges for $s \\le 0$. So the boundary $s = 1$ belongs to the conditional case, because it is the alternating harmonic series.",
    "对 $\\sum \\frac{(-1)^{n}}{n^{s}}$，当 $s > 1$ 时绝对收敛，当 $0 < s \\le 1$ 时条件收敛，当 $s \\le 0$ 时发散。所以边界 $s = 1$ 属于条件收敛，因为此时是交错调和级数。",
  ],
  (rng) => {
    const k = rng.int(2, 9);
    const c = rng.int(1, 9);
    const v = `\\frac{1}{${k}}`;
    const top = c === 1 ? "(-1)^{n}" : `${c}(-1)^{n}`;
    return choose(
      rng,
      [
        `For which $p$ does $\\sum_{n=1}^{\\infty} \\frac{${top}}{n^{${k}p}}$ converge conditionally?`,
        `当 $p$ 取何值时，$\\sum_{n=1}^{\\infty} \\frac{${top}}{n^{${k}p}}$ 条件收敛？`,
      ],
      same2(`0 < p \\le ${v}`),
      [same2(`p > ${v}`), same2(`0 < p < ${v}`), same2(`p \\le ${v}`)],
      [
        `The series of absolute values is a $p$-series with exponent $${k}p$, so it diverges for $${k}p \\le 1$. The alternating series test needs the terms to decrease to $0$, which means $${k}p > 0$. So the answer is $0 < p \\le ${v}$.`,
        `绝对值组成的级数是指数为 $${k}p$ 的 $p$ 级数，当 $${k}p \\le 1$ 时发散。交错级数检验要求通项递减趋于 $0$，即 $${k}p > 0$。所以答案是 $0 < p \\le ${v}$。`,
      ],
    );
  },
);

const overOrUnderPartial = point(
  "whether-a-partial-sum-is-too-high-or-too-low",
  ["Whether a partial sum is too high or too low", "部分和偏高还是偏低"],
  [
    "The error bound gives more than a size. The first omitted term also has the sign of the error: with a positive first term, stopping after an odd number of terms overestimates the sum, and stopping after an even number underestimates it.",
    "误差界不只给出大小。第一个被舍去的项还给出误差的符号：首项为正时，取奇数项后停止会高估和，取偶数项后停止会低估和。",
  ],
  (rng) => {
    const N = rng.int(3, 20);
    const c = rng.int(1, 9);
    const p = rng.int(1, 3);
    const odd = N % 2 === 1;
    const nextQ = Q.of(c, (N + 1) ** p);
    const thisQ = Q.of(c, N ** p);
    const claim = (over: boolean, v: Q): Pair => [
      `It is an ${over ? "overestimate" : "underestimate"}, by at most $${v.toLatex()}$`,
      `它${over ? "偏高" : "偏低"}，误差不超过 $${v.toLatex()}$`,
    ];
    const power = p === 1 ? "n" : `n^{${p}}`;
    return choose(
      rng,
      [
        `Let $S = \\sum_{n=1}^{\\infty} (-1)^{n+1} \\frac{${c}}{${power}}$. How does $S_{${N}}$ compare with $S$?`,
        `设 $S = \\sum_{n=1}^{\\infty} (-1)^{n+1} \\frac{${c}}{${power}}$。$S_{${N}}$ 与 $S$ 相比如何？`,
      ],
      claim(odd, nextQ),
      [claim(!odd, nextQ), claim(odd, thisQ), claim(!odd, thisQ)],
      [
        `The first omitted term is $n = ${N + 1}$, which ${odd ? "is subtracted, so the partial sum is too high" : "is added, so the partial sum is too low"}. Its size $${nextQ.toLatex()}$ bounds the error.`,
        `第一个被舍去的项是 $n = ${N + 1}$，它${odd ? "要被减去，所以部分和偏高" : "要被加上，所以部分和偏低"}。它的大小 $${nextQ.toLatex()}$ 是误差的上界。`,
      ],
    );
  },
);

const logParameter = point(
  "a-parameter-in-a-logarithmic-series",
  ["A parameter in a logarithmic series", "对数级数中的参数"],
  [
    "By the integral test, $\\sum_{n=2}^{\\infty} \\frac{1}{n(\\ln n)^{s}}$ converges exactly when $s > 1$, using $u = \\ln x$. When $s$ depends on a parameter, solve the strict inequality, and reverse its direction when dividing by a negative number.",
    "由积分检验，令 $u = \\ln x$，$\\sum_{n=2}^{\\infty} \\frac{1}{n(\\ln n)^{s}}$ 恰好在 $s > 1$ 时收敛。当 $s$ 依赖于参数时，解这个严格不等式，除以负数时要改变不等号的方向。",
  ],
  (rng) => {
    const a = rng.int(2, 6) * rng.pick([-1, 1]);
    const b = rng.int(-5, 5);
    const v = Q.of(1 - b, a);
    const exp = poly([a, "p"], [b, ""]);
    const form = (sym: string) => same2(`p ${sym} ${v.toLatex()}`);
    const up = a > 0;
    return choose(
      rng,
      [
        `For which $p$ does $\\sum_{n=2}^{\\infty} \\frac{1}{n(\\ln n)^{${exp}}}$ converge?`,
        `当 $p$ 取何值时，$\\sum_{n=2}^{\\infty} \\frac{1}{n(\\ln n)^{${exp}}}$ 收敛？`,
      ],
      form(up ? ">" : "<"),
      [form(up ? "<" : ">"), form(up ? "\\ge" : "\\le"), form(up ? "\\le" : "\\ge")],
      [
        `The integral test requires $${exp} > 1$, a strict inequality because the exponent $1$ gives $\\ln(\\ln x)$, which diverges. ${up ? "Dividing by the positive coefficient keeps the direction" : "Dividing by the negative coefficient reverses the direction"}, so $p ${up ? ">" : "<"} ${v.toLatex()}$.`,
        `积分检验要求 $${exp} > 1$，这是严格不等式，因为指数为 $1$ 时积分是 $\\ln(\\ln x)$，发散。${up ? "除以正系数时方向不变" : "除以负系数时方向改变"}，所以 $p ${up ? ">" : "<"} ${v.toLatex()}$。`,
      ],
    );
  },
);

const testThatFails = point(
  "tests-that-are-certain-to-say-nothing",
  ["Tests that are certain to say nothing", "肯定不提供信息的检验"],
  [
    "Good selection also rules tests out. On any rational function of $n$, the ratio test and the root test both give $L = 1$, so they say nothing, whether the series converges or not. Comparing with a $p$-series is the method that works.",
    "好的选择也包括排除检验。对 $n$ 的任何有理函数，比值检验和根值检验都给出 $L = 1$，所以不提供信息，无论级数是否收敛。与 $p$ 级数比较才是有效的方法。",
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
    const other = p === 2 ? "\\frac{1}{n}" : `\\frac{1}{n^{${p - 1}}}`;
    const term = `\\frac{n + ${a}}{n^{${p}} + ${b}}`;
    return choose(
      rng,
      [
        `Which test is certain to give no conclusion for $\\sum_{n=1}^{\\infty} ${term}$?`,
        `对 $\\sum_{n=1}^{\\infty} ${term}$，哪个检验肯定得不出结论？`,
      ],
      test,
      [
        [`The limit comparison test with $${other}$`, `与 $${other}$ 的极限比较检验`],
        ["The integral test", "积分检验"],
        ["The comparison test", "比较检验"],
      ],
      [
        `The terms form a rational function of $n$, so $\\frac{a_{n+1}}{a_{n}} \\to 1$ and $\\sqrt[n]{a_{n}} \\to 1$. With $L = 1$ the test says nothing. The limit comparison with $${other}$ gives a limit of $1$ and does decide it.`,
        `通项是 $n$ 的有理函数，所以 $\\frac{a_{n+1}}{a_{n}} \\to 1$，$\\sqrt[n]{a_{n}} \\to 1$。$L = 1$ 时该检验不提供信息。与 $${other}$ 的极限比较得到极限 $1$，可以作出判断。`,
      ],
    );
  },
);

const derivativeFromCoefficient = point(
  "a-derivative-from-a-taylor-coefficient",
  ["A derivative from a Taylor coefficient", "由泰勒系数求导数"],
  [
    "A Taylor polynomial stores derivatives. The coefficient of $(x - a)^{k}$ is $\\frac{f^{(k)}(a)}{k!}$, so the derivative is that coefficient times $k!$. Reading the coefficient directly as the derivative forgets the factorial.",
    "泰勒多项式储存了导数的信息。$(x - a)^{k}$ 的系数是 $\\frac{f^{(k)}(a)}{k!}$，所以导数等于这个系数乘以 $k!$。把系数直接当作导数就忘了阶乘。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const c0 = rng.int(-9, 9);
    const c1 = nz(rng, 9);
    const c2 = nz(rng, 9);
    const c3 = nz(rng, 9);
    const third = rng.bool();
    const base = linear(1, -a);
    const T = poly([c0, ""], [c1, `(${base})`], [c2, `(${base})^{2}`], [c3, `(${base})^{3}`]);
    const answer = third ? 6 * c3 : 2 * c2;
    const c = third ? c3 : c2;
    const name = third ? "f'''" : "f''";
    return ask(
      [
        `The Taylor polynomial of degree 3 for $f$ centered at $x = ${a}$ is $${T}$. Find $${name}(${a})$.`,
        `$f$ 在 $x = ${a}$ 处的 3 次泰勒多项式是 $${T}$。求 $${name}(${a})$。`,
      ],
      answer,
      [c, third ? 3 * c3 : Q.of(c2, 2), third ? Q.of(c3, 6) : 4 * c2],
      [
        `The coefficient of $(${base})^{${third ? 3 : 2}}$ is $\\frac{${name}(${a})}{${third ? 3 : 2}!}$. So $${name}(${a}) = ${third ? 6 : 2} \\cdot ${c < 0 ? `(${c})` : c} = ${answer}$.`,
        `$(${base})^{${third ? 3 : 2}}$ 的系数是 $\\frac{${name}(${a})}{${third ? 3 : 2}!}$。所以 $${name}(${a}) = ${third ? 6 : 2} \\cdot ${c < 0 ? `(${c})` : c} = ${answer}$。`,
      ],
    );
  },
);

const radiusWithCoefficient = point(
  "the-radius-when-x-has-a-coefficient",
  ["The radius when x has a coefficient", "x 带系数时的收敛半径"],
  [
    "The radius belongs to $x$, not to the expression in brackets. For powers of $kx + d$, the series converges when $|kx + d| < c$, and dividing by $k$ shows that $x$ is within $\\frac{c}{k}$ of its center. The value $c$ alone is the common wrong answer.",
    "收敛半径是对 $x$ 而言的，不是对括号内的式子而言的。对 $kx + d$ 的幂，当 $|kx + d| < c$ 时级数收敛，除以 $k$ 后可见 $x$ 到中心的距离小于 $\\frac{c}{k}$。只答 $c$ 是常见的错误。",
  ],
  (rng) => {
    const k = rng.int(2, 6);
    const c = rng.int(2, 12);
    const d = nz(rng, 9);
    const inner = linear(k, d);
    const answer = Q.of(c, k);
    return ask(
      [
        `Find the radius of convergence of $\\sum_{n=0}^{\\infty} \\frac{(${inner})^{n}}{${c}^{n}}$.`,
        `求 $\\sum_{n=0}^{\\infty} \\frac{(${inner})^{n}}{${c}^{n}}$ 的收敛半径。`,
      ],
      answer,
      [c, Q.of(k, c), c * k],
      [
        `The geometric ratio has size less than $1$ when $|${inner}| < ${c}$, that is, when $\\left|${poly([1, "x"], [Q.of(d, k), ""])}\\right| < ${answer.toLatex()}$. So the radius is $${answer.toLatex()}$.`,
        `当 $|${inner}| < ${c}$ 时，公比的绝对值小于 $1$，即 $\\left|${poly([1, "x"], [Q.of(d, k), ""])}\\right| < ${answer.toLatex()}$。所以收敛半径是 $${answer.toLatex()}$。`,
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
