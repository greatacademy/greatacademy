// Third knowledge points for thin topics of Calculus II, from infinite series to
// first differential equations: the reverse question, a harder case or a common
// trap. See `deeperCalculusIIThird2Points`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { dec, linear, poly, Q } from "@ga/subject-math";

import { ask, choose, type Pair, point } from "../university-kit.ts";

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

const integralTailBound = point(
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
);

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

const constantsFromOrder = point(
  "the-number-of-constants-follows-the-order",
  ["The number of constants follows the order", "常数的个数由阶决定"],
  [
    "Solving an equation of order $m$ takes $m$ integrations in effect, so a general solution normally has $m$ arbitrary constants. The order is the highest derivative that appears, and the power to which a derivative is raised does not count.",
    "解 $m$ 阶方程实质上要积分 $m$ 次，所以通解一般有 $m$ 个任意常数。阶是出现的最高阶导数，导数的乘方次数不算在内。",
  ],
  (rng) => {
    const m = rng.int(1, 4);
    const d = rng.int(2, 5);
    const c = nz(rng, 9);
    const rhs = rng.pick(["x", "e^{x}", "\\sin x", "x^{2}"]);
    const eq = `(${derivativeMarks(m)})^{${d}} ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}y = ${rhs}`;
    return ask(
      [`How many arbitrary constants do you expect in the general solution of $${eq}$?`, `$${eq}$ 的通解中预计有几个任意常数？`],
      m,
      [d, m + d, m + 1],
      [
        `The highest derivative is $${derivativeMarks(m)}$, so the order is $${m}$. The power $${d}$ does not affect the order, so the general solution has $${m}$ arbitrary ${m === 1 ? "constant" : "constants"}.`,
        `最高阶导数是 $${derivativeMarks(m)}$，所以阶是 $${m}$。次数 $${d}$ 不影响阶，所以通解有 $${m}$ 个任意常数。`,
      ],
    );
  },
);

const constantThatMakesASolution = point(
  "the-constant-that-makes-it-a-solution",
  ["The constant that makes it a solution", "使其成为解的常数"],
  [
    "Verifying can also determine an unknown. Substitute the proposed solution into the equation and compare both sides. The part with the arbitrary constant $C$ cancels when the form is right, and what remains is an equation for the unknown number.",
    "验证也能确定未知数。把候选解代入方程，比较两边。形式正确时，含任意常数 $C$ 的部分会抵消，剩下的就是关于未知数的方程。",
  ],
  (rng) => {
    const k = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
    const m = nz(rng, 12);
    const answer = Q.of(-m, k);
    const eq = poly([k, "y"], [m, ""]);
    return ask(
      [
        `For every constant $C$, $y = Ce^{${k}x} + p$ is a solution of $y' = ${eq}$. Find $p$.`,
        `对每个常数 $C$，$y = Ce^{${k}x} + p$ 都是 $y' = ${eq}$ 的解。求 $p$。`,
      ],
      answer,
      [Q.of(m, k), m, Q.of(-k, m)],
      [
        `Substituting gives $${k}Ce^{${k}x}$ on the left and $${k}Ce^{${k}x} + ${k < 0 ? `(${k})` : k}p ${m < 0 ? "-" : "+"} ${Math.abs(m)}$ on the right. The terms with $C$ cancel, so $${k < 0 ? `(${k})` : k}p ${m < 0 ? "-" : "+"} ${Math.abs(m)} = 0$ and $p = ${answer.toLatex()}$.`,
        `代入后，左边是 $${k}Ce^{${k}x}$，右边是 $${k}Ce^{${k}x} + ${k < 0 ? `(${k})` : k}p ${m < 0 ? "-" : "+"} ${Math.abs(m)}$。含 $C$ 的项抵消，所以 $${k < 0 ? `(${k})` : k}p ${m < 0 ? "-" : "+"} ${Math.abs(m)} = 0$，$p = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const constantIsNotTheInitialValue = point(
  "the-constant-is-not-always-the-initial-value",
  ["The constant is not always the initial value", "常数不一定是初值"],
  [
    "After integrating, $C$ equals $y(0)$ only if the antiderivative is $0$ at $x = 0$. An exponential antiderivative is not, so substitute the initial condition into the whole expression and solve for $C$ rather than copying the initial value.",
    "积分后，只有原函数在 $x = 0$ 处为 $0$ 时，$C$ 才等于 $y(0)$。指数函数的原函数在那里不为 $0$，所以要把初始条件代入整个式子再解出 $C$，而不是照抄初值。",
  ],
  (rng) => {
    const a = nz(rng, 12);
    const k = rng.int(2, 9);
    const b = rng.int(-9, 9);
    const co = Q.of(a, k);
    const answer = Q.of(b).sub(co);
    const anti = poly([co, `e^{${k}x}`]);
    return ask(
      [
        `The solution of $\\frac{dy}{dx} = ${poly([a, `e^{${k}x}`])}$ with $y(0) = ${b}$ is $y = ${anti} + C$. Find $C$.`,
        `$\\frac{dy}{dx} = ${poly([a, `e^{${k}x}`])}$ 满足 $y(0) = ${b}$ 的解是 $y = ${anti} + C$。求 $C$。`,
      ],
      answer,
      [b, Q.of(b).add(co), b - a],
      [
        `At $x = 0$ the exponential is $1$, so $${b} = ${co.toLatex()} + C$. This gives $C = ${answer.toLatex()}$.`,
        `在 $x = 0$ 处指数函数等于 $1$，所以 $${b} = ${co.toLatex()} + C$。解得 $C = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const longTermValue = point(
  "the-long-term-value-of-a-model",
  ["The long-term value of a model", "模型的长期值"],
  [
    "Many models settle at the value where the rate is zero. Setting $\\frac{dy}{dt} = 0$ gives this value without solving the equation. It is the room temperature for cooling, the carrying capacity for logistic growth and the ratio of inflow to removal rate for a drip.",
    "很多模型最终稳定在变化率为零的值。令 $\\frac{dy}{dt} = 0$，不解方程也能得到这个值。对冷却问题是室温，对逻辑斯谛增长是环境容纳量，对输液问题是输入速率与清除率之比。",
  ],
  (rng) => {
    const kind = rng.pick(["cool", "drip", "logistic"] as const);
    const j = rng.int(2, 10);
    const k = Q.of(1, j);
    if (kind === "cool") {
      const A = rng.int(15, 30);
      const start = A + rng.int(20, 60);
      return ask(
        [
          `A cup of tea at $${start}$ degrees cools according to $\\frac{dT}{dt} = -\\frac{1}{${j}}(T - ${A})$. What temperature does it approach in the long term?`,
          `一杯 $${start}$ 度的茶按 $\\frac{dT}{dt} = -\\frac{1}{${j}}(T - ${A})$ 冷却。长期来看，它的温度趋于多少？`,
        ],
        A,
        [0, start, A + j],
        [
          `The rate is zero when $T = ${A}$. Above that value the rate is negative, so the temperature falls toward $${A}$.`,
          `当 $T = ${A}$ 时变化率为零。高于这个值时变化率为负，所以温度降向 $${A}$。`,
        ],
      );
    }
    if (kind === "drip") {
      const r = rng.int(2, 40);
      const answer = Q.of(r * j);
      return ask(
        [
          `A drug enters the blood and is removed so that the amount $y$ in milligrams satisfies $\\frac{dy}{dt} = ${r} - \\frac{1}{${j}}y$, with $y(0) = 0$. What amount does it approach in the long term?`,
          `药物进入血液并被清除，血液中的药量 $y$（毫克）满足 $\\frac{dy}{dt} = ${r} - \\frac{1}{${j}}y$，$y(0) = 0$。长期来看，药量趋于多少？`,
        ],
        answer,
        [r, Q.of(r).mul(k), 0],
        [
          `The rate is zero when $\\frac{1}{${j}}y = ${r}$, that is, $y = ${answer.toLatex()}$. Below that value the rate is positive, so the amount rises toward it.`,
          `当 $\\frac{1}{${j}}y = ${r}$，即 $y = ${answer.toLatex()}$ 时，变化率为零。低于这个值时变化率为正，所以药量升向它。`,
        ],
      );
    }
    const M = rng.int(5, 90) * 10;
    const start = rng.int(1, 4) * 10;
    return ask(
      [
        `A population with $P(0) = ${start}$ satisfies $\\frac{dP}{dt} = \\frac{1}{${j}}P\\left(1 - \\frac{P}{${M}}\\right)$. What size does it approach in the long term?`,
        `一个种群满足 $P(0) = ${start}$，$\\frac{dP}{dt} = \\frac{1}{${j}}P\\left(1 - \\frac{P}{${M}}\\right)$。长期来看，它的规模趋于多少？`,
      ],
      M,
      [start, M / 2, 0],
      [
        `The rate is zero at $P = 0$ and $P = ${M}$. Between them it is positive, so a positive population grows toward $${M}$.`,
        `变化率在 $P = 0$ 和 $P = ${M}$ 处为零。在它们之间变化率为正，所以正的种群规模增长趋于 $${M}$。`,
      ],
    );
  },
);

const extremumOfSolution = point(
  "extrema-of-solutions-without-solving",
  ["Extrema of solutions without solving", "不解方程判断解的极值"],
  [
    "The equation gives both derivatives at a point. Where $\\frac{dy}{dx} = 0$, differentiating $\\frac{dy}{dx} = ax + by + c$ gives $\\frac{d^{2}y}{dx^{2}} = a + b \\cdot 0 = a$. So the sign of $a$ decides between a local maximum and a local minimum.",
    "方程给出了某点处的两阶导数。在 $\\frac{dy}{dx} = 0$ 的地方，对 $\\frac{dy}{dx} = ax + by + c$ 求导得 $\\frac{d^{2}y}{dx^{2}} = a + b \\cdot 0 = a$。所以 $a$ 的符号决定是局部极大值还是局部极小值。",
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
    const correct = a < 0 ? max : min;
    return choose(
      rng,
      [
        `The solution of $\\frac{dy}{dx} = ${eq}$ passes through $(${x0}, ${y0})$. What does it have at that point?`,
        `$\\frac{dy}{dx} = ${eq}$ 的解经过 $(${x0}, ${y0})$。它在该点处有什么？`,
      ],
      correct,
      [max, min, flat, none].filter((o) => o !== correct),
      [
        `At this point $\\frac{dy}{dx} = 0$. Differentiating the equation gives $\\frac{d^{2}y}{dx^{2}} = ${a} ${b < 0 ? "-" : "+"} \\frac{dy}{dx} = ${a}$ there, which is ${a < 0 ? "negative, so it is a local maximum" : "positive, so it is a local minimum"}.`,
        `在这一点 $\\frac{dy}{dx} = 0$。对方程求导，得该点处 $\\frac{d^{2}y}{dx^{2}} = ${a} ${b < 0 ? "-" : "+"} \\frac{dy}{dx} = ${a}$，它${a < 0 ? "为负，所以是局部极大值" : "为正，所以是局部极小值"}。`,
      ],
    );
  },
);

const halfLifeFromAmounts = point(
  "a-half-life-from-two-amounts",
  ["A half-life from two amounts", "由两个量求半衰期"],
  [
    "Exponential decay halves in equal times. When the ratio of two amounts is a power of $2$, count the halvings: if the amount falls to $\\frac{1}{2^{m}}$ of its value in time $t$, the half-life is $\\frac{t}{m}$, not $\\frac{t}{2^{m}}$.",
    "指数衰减在相等的时间内减半。当两个量的比是 $2$ 的幂时，数一数减半的次数：如果在时间 $t$ 内减少到原来的 $\\frac{1}{2^{m}}$，半衰期就是 $\\frac{t}{m}$，而不是 $\\frac{t}{2^{m}}$。",
  ],
  (rng) => {
    const m = rng.int(2, 5);
    const h = rng.int(1, 12);
    const u = rng.int(1, 9) * 5;
    const t = m * h;
    const start = u * 2 ** m;
    return ask(
      [
        `A substance decays according to $\\frac{dy}{dt} = -ky$. It falls from $${start}$ grams to $${u}$ grams in $${t}$ hours. Find its half-life, in hours.`,
        `一种物质按 $\\frac{dy}{dt} = -ky$ 衰减，在 $${t}$ 小时内从 $${start}$ 克降到 $${u}$ 克。求它的半衰期，单位是小时。`,
      ],
      h,
      [Q.of(t, 2 ** m), Q.of(t, 2), t],
      [
        `The amount falls by a factor of $${2 ** m} = 2^{${m}}$, which is $${m}$ halvings. So the half-life is $${t} \\div ${m} = ${h}$ hours.`,
        `这个量缩小为原来的 $\\frac{1}{${2 ** m}}$，而 $${2 ** m} = 2^{${m}}$，即减半 $${m}$ 次。所以半衰期是 $${t} \\div ${m} = ${h}$ 小时。`,
      ],
    );
  },
);

const flatColumns = point(
  "where-a-field-of-a-function-of-x-is-flat",
  ["Where a field of a function of x is flat", "x 的函数的斜率场的水平处"],
  [
    "In the field of $\\frac{dy}{dx} = f(x)$, the slope depends on the column only, so all segments in a column are parallel. Horizontal segments therefore fill whole vertical lines at the zeros of $f$, not horizontal rows.",
    "在 $\\frac{dy}{dx} = f(x)$ 的斜率场中，斜率只取决于所在的列，所以同一列的线段都平行。因此水平线段布满 $f$ 的零点处的整条竖直线，而不是水平的行。",
  ],
  (rng) => {
    const a = rng.int(-6, 5);
    const b = a + rng.int(1, 6);
    const f = poly([1, "x^{2}"], [-(a + b), "x"], [a * b, ""]);
    const factors = a === 0 ? `x(${linear(1, -b)})` : b === 0 ? `x(${linear(1, -a)})` : `(${linear(1, -a)})(${linear(1, -b)})`;
    return choose(
      rng,
      [
        `Where are the segments horizontal in the slope field of $\\frac{dy}{dx} = ${f}$?`,
        `在 $\\frac{dy}{dx} = ${f}$ 的斜率场中，哪里的线段是水平的？`,
      ],
      [`On the vertical lines $x = ${a}$ and $x = ${b}$`, `在竖直线 $x = ${a}$ 和 $x = ${b}$ 上`],
      [
        [`On the horizontal lines $y = ${a}$ and $y = ${b}$`, `在水平线 $y = ${a}$ 和 $y = ${b}$ 上`],
        [`Only at the point $(${a}, ${b})$`, `只在点 $(${a}, ${b})$ 处`],
        [`On the vertical line $x = ${Q.of(a + b, 2).toLatex()}$`, `在竖直线 $x = ${Q.of(a + b, 2).toLatex()}$ 上`],
      ],
      [
        `The slope is $${factors}$, whatever $y$ is. It is zero for $x = ${a}$ and $x = ${b}$, so every segment in those two columns is horizontal.`,
        `斜率是 $${factors}$，与 $y$ 无关。当 $x = ${a}$ 和 $x = ${b}$ 时它为零，所以这两列的线段都是水平的。`,
      ],
    );
  },
);

const steepestRow = point(
  "the-steepest-row-of-an-autonomous-field",
  ["The steepest row of an autonomous field", "自治方程斜率场中最陡的行"],
  [
    "In an autonomous field the slope depends only on the row. For a quadratic in $y$ with positive leading coefficient, the slopes between the two equilibria are negative, and they are most negative on the row halfway between, where the parabola has its vertex.",
    "在自治方程的斜率场中，斜率只取决于所在的行。对首项系数为正的 $y$ 的二次式，两个平衡解之间的斜率为负，在正中间的那一行最负，那里是抛物线的顶点。",
  ],
  (rng) => {
    const k = rng.int(1, 4);
    const a = rng.int(-6, 5);
    const b = a + rng.int(1, 7);
    const f = poly([k, "y^{2}"], [-k * (a + b), "y"], [k * a * b, ""]);
    const answer = Q.of(a + b, 2);
    return ask(
      [
        `In the slope field of $\\frac{dy}{dx} = ${f}$, on which row $y = c$ is the slope the most negative? Give $c$.`,
        `在 $\\frac{dy}{dx} = ${f}$ 的斜率场中，哪一行 $y = c$ 上的斜率最负？求 $c$。`,
      ],
      answer,
      [a, b, a + b],
      [
        `The slope is a parabola in $y$ that opens upward, with its vertex at $y = ${answer.toLatex()}$, halfway between the equilibria $${a}$ and $${b}$. The least value of the slope is there.`,
        `斜率是关于 $y$ 的开口向上的抛物线，顶点在 $y = ${answer.toLatex()}$，位于平衡解 $${a}$ 和 $${b}$ 的正中间。斜率的最小值就在那里。`,
      ],
    );
  },
);

const isoclineIntercept = point(
  "the-line-of-equal-slopes",
  ["The line of equal slopes", "等斜率的直线"],
  [
    "Setting $\\frac{dy}{dx}$ equal to a constant $s$ gives the isocline for that slope, where all segments are parallel. For a linear right side the isoclines are parallel lines, and each one can be found by solving for $y$.",
    "令 $\\frac{dy}{dx}$ 等于常数 $s$，就得到这个斜率的等斜线，其上所有线段都平行。当右边是一次式时，等斜线是一组平行直线，解出 $y$ 就能得到每一条。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const b = rng.pick([-1, 1]);
    const c = rng.int(-9, 9);
    const s = rng.int(-6, 6);
    const answer = (s - c) * b;
    const eq = poly([a, "x"], [b, "y"], [c, ""]);
    const line = poly([-a * b, "x"], [answer, ""]);
    return ask(
      [
        `In the slope field of $\\frac{dy}{dx} = ${eq}$, all the segments with slope $${s}$ lie on one line. Find its $y$-intercept.`,
        `在 $\\frac{dy}{dx} = ${eq}$ 的斜率场中，斜率为 $${s}$ 的线段都在同一条直线上。求它在 $y$ 轴上的截距。`,
      ],
      answer,
      [-answer, s, c],
      [
        `Set $${eq} = ${s}$ and solve for $y$: this gives $y = ${line}$. Its $y$-intercept is $${answer}$.`,
        `令 $${eq} = ${s}$，解出 $y$，得 $y = ${line}$。它在 $y$ 轴上的截距是 $${answer}$。`,
      ],
    );
  },
);

const solutionAtZeroOfF = point(
  "a-zero-of-f-need-not-be-an-extremum",
  ["A zero of f need not be an extremum", "f 的零点不一定是极值点"],
  [
    "All solutions of $\\frac{dy}{dx} = f(x)$ are vertical shifts of one another, so they behave alike at a zero of $f$. They have an extremum only where $f$ changes sign. At a double zero the segments flatten and then continue in the same direction.",
    "$\\frac{dy}{dx} = f(x)$ 的所有解互为竖直平移，所以在 $f$ 的零点处行为相同。只有在 $f$ 变号的地方才有极值。在二重零点处，线段变平后继续沿原方向。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const k = nz(rng, 5);
    const n = rng.int(1, 3);
    const base = linear(1, -a);
    const f = poly([k, n === 1 ? `(${base})` : `(${base})^{${n}}`]);
    const even = n === 2;
    const max: Pair = ["Every solution has a local maximum", "每个解都有局部极大值"];
    const min: Pair = ["Every solution has a local minimum", "每个解都有局部极小值"];
    const flat: Pair = ["No solution has an extremum there", "没有解在那里有极值"];
    const some: Pair = ["It depends on the initial value of the solution", "取决于解的初值"];
    const correct = even ? flat : k > 0 ? min : max;
    return choose(
      rng,
      [
        `What happens at $x = ${a}$ to the solutions of $\\frac{dy}{dx} = ${f}$?`,
        `$\\frac{dy}{dx} = ${f}$ 的解在 $x = ${a}$ 处有什么情况？`,
      ],
      correct,
      [max, min, flat, some].filter((o) => o !== correct),
      [
        even
          ? `The power $2$ is even, so $\\frac{dy}{dx}$ has the same sign on both sides of $x = ${a}$. The solutions flatten there but keep going in the same direction, so there is no extremum.`
          : `The power $${n}$ is odd, so $\\frac{dy}{dx}$ changes from ${k > 0 ? "negative to positive" : "positive to negative"} at $x = ${a}$. So every solution has a local ${k > 0 ? "minimum" : "maximum"} there.`,
        even
          ? `指数 $2$ 是偶数，所以 $\\frac{dy}{dx}$ 在 $x = ${a}$ 两侧同号。解在那里变平，但继续沿原方向，所以没有极值。`
          : `指数 $${n}$ 是奇数，所以 $\\frac{dy}{dx}$ 在 $x = ${a}$ 处${k > 0 ? "由负变正" : "由正变负"}。所以每个解在那里都有局部${k > 0 ? "极小值" : "极大值"}。`,
      ],
    );
  },
);

const stayingAtUnstable = point(
  "a-solution-that-starts-at-an-unstable-equilibrium",
  ["A solution that starts at an unstable equilibrium", "从不稳定平衡解出发的解"],
  [
    "An unstable equilibrium repels nearby solutions, but a solution that starts exactly there stays there forever, because its slope is zero and it is a constant solution. Saying it moves to the stable equilibrium confuses it with solutions that start near it.",
    "不稳定平衡解会排斥附近的解，但恰好从那里出发的解会永远停留在那里，因为它的斜率为零，它是常数解。说它会移向稳定平衡解，是把它和附近出发的解混淆了。",
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
    const f = poly([k, `(${linear(1, -low).replace(/x/g, "y")})(${linear(1, -high).replace(/x/g, "y")})`]);
    return ask(
      [
        `For the differential equation $\\frac{dy}{dx} = ${f}$, find $\\lim_{x \\to \\infty} y(x)$ for the solution with $y(0) = ${unstable}$.`,
        `对微分方程 $\\frac{dy}{dx} = ${f}$，求满足 $y(0) = ${unstable}$ 的解的 $\\lim_{x \\to \\infty} y(x)$。`,
      ],
      unstable,
      [stable, 0, low + high],
      [
        `At $y = ${unstable}$ the slope is $0$, so $y = ${unstable}$ is a constant solution, and this solution stays there. Solutions near it move away, but this one does not move, so the limit is $${unstable}$.`,
        `当 $y = ${unstable}$ 时斜率为 $0$，所以 $y = ${unstable}$ 是常数解，这个解一直停在那里。它附近的解会远离，但这个解不动，所以极限是 $${unstable}$。`,
      ],
    );
  },
);

const eulerBias = point(
  "whether-eulers-method-runs-high-or-low",
  ["Whether Euler's method runs high or low", "欧拉法偏高还是偏低"],
  [
    "Each Euler step follows a tangent line. On a concave-up solution the tangent lies below the curve, so the estimate is too low, and on a concave-down solution it is too high. When the solution is a straight line, Euler's method is exact.",
    "欧拉法的每一步都沿切线走。在上凹的解上，切线位于曲线下方，所以估计偏低；在下凹的解上则偏高。当解是直线时，欧拉法是精确的。",
  ],
  (rng) => {
    const kind = rng.pick(["linear", "exp", "const"] as const);
    const m = nz(rng, 9);
    const x0 = rng.int(1, 6);
    const y0 = rng.int(1, 9);
    const h = rng.pick(["0.5", "0.25", "0.1"]);
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
    return choose(
      rng,
      [
        `Euler's method with step $${h}$ is used for $\\frac{dy}{dx} = ${right}$ from $y(${start}) = ${y0}$, moving to the right. How do its estimates compare with the true solution?`,
        `用步长 $${h}$ 的欧拉法求解 $\\frac{dy}{dx} = ${right}$，从 $y(${start}) = ${y0}$ 出发向右计算。它的估计值与真实解相比如何？`,
      ],
      correct,
      [low, high, exact, depends].filter((o) => o !== correct),
      [
        `${whyEn}. ${second > 0 ? "The solution is concave up, so the tangent steps stay below it." : second < 0 ? "The solution is concave down, so the tangent steps stay above it." : "The solution is a straight line, so the steps follow it exactly."}`,
        `${whyZh}。${second > 0 ? "解是上凹的，所以沿切线的各步都在它下方。" : second < 0 ? "解是下凹的，所以沿切线的各步都在它上方。" : "解是直线，所以各步恰好沿着它。"}`,
      ],
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
