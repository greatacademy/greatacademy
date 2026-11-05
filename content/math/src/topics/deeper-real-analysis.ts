// Further knowledge points for topics of Real Analysis, each a skill the topic's own points
// leave out. See `deeperRealAnalysisPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { ask, point } from "../university-kit.ts";

/** frac builds a rational number with a positive denominator. */
const frac = (n: number, d: number) => (d < 0 ? Q.of(-n, -d) : Q.of(n, d));

/** coef writes a coefficient before a symbol, leaving out 1. */
const coef = (c: number, symbol: string) => (c === 1 ? symbol : c === -1 ? `-${symbol}` : `${c}${symbol}`);

/** signed writes a term with its sign, for use after another term. */
const signed = (c: number, symbol = "") => `${c < 0 ? "-" : "+"} ${symbol === "" ? Math.abs(c) : coef(Math.abs(c), symbol)}`;

const supremumOfSums = point(
  "the-supremum-of-a-sum-of-sets",
  ["The supremum of a sum of sets", "集合之和的上确界"],
  [
    "The sum set $A + B$ holds every $a + b$ with $a$ in $A$ and $b$ in $B$. Its supremum is $\\sup A + \\sup B$, whether or not those values are attained. The proof is an approximation: take elements of $A$ and $B$ within $\\frac{\\varepsilon}{2}$ of their suprema.",
    "和集 $A + B$ 包含所有 $a + b$，其中 $a$ 属于 $A$，$b$ 属于 $B$。它的上确界是 $\\sup A + \\sup B$，不管这些值是否取到。证明用的是逼近：在 $A$ 和 $B$ 中取距各自上确界不超过 $\\frac{\\varepsilon}{2}$ 的元素。",
  ],
  (rng) => {
    const [a, b] = [rng.int(-9, 5), rng.int(1, 8)];
    const [c, d] = [rng.int(-9, 5), rng.int(1, 8)];
    const [top1, top2] = [a + b, c + d];
    const inf = rng.bool();
    const answer = inf ? a + c : top1 + top2;
    return ask(
      [
        `$A$ is the open interval $(${a}, ${top1})$ and $B$ is the open interval $(${c}, ${top2})$. What is the ${inf ? "infimum" : "supremum"} of $A + B$?`,
        `$A$ 是开区间 $(${a}, ${top1})$，$B$ 是开区间 $(${c}, ${top2})$。$A + B$ 的${inf ? "下确界" : "上确界"}是多少？`,
      ],
      answer,
      [inf ? top1 + top2 : a + c, top1 + c, a + top2, answer + 1].filter((v) => v !== answer),
      [
        inf ? `Infimums add: $(${a}) + (${c}) = ${answer}$.` : `Suprema add: $(${top1}) + (${top2}) = ${answer}$.`,
        inf ? `下确界相加：$(${a}) + (${c}) = ${answer}$。` : `上确界相加：$(${top1}) + (${top2}) = ${answer}$。`,
      ],
    );
  },
);

const fractionsBetween = point(
  "counting-fractions-in-an-interval",
  ["Counting fractions in an interval", "数区间中的分数"],
  [
    "The Archimedean property shows that for large $n$ the multiples of $\\frac{1}{n}$ have spacing small enough to land in any interval. Counting them makes this concrete: between two whole numbers $a < b$, the multiples of $\\frac{1}{n}$ strictly inside number $n (b - a) - 1$, which grows without limit.",
    "阿基米德性质说明：当 $n$ 很大时，$\\frac{1}{n}$ 的倍数间隔足够小，能落在任何区间内。数一数就更具体：在两个整数 $a < b$ 之间，严格在内部的 $\\frac{1}{n}$ 的倍数有 $n (b - a) - 1$ 个，它无限增长。",
  ],
  (rng) => {
    const a = rng.int(-5, 5);
    const b = a + rng.int(1, 4);
    const n = rng.int(2, 12);
    const answer = n * (b - a) - 1;
    return ask(
      [
        `How many multiples of $\\frac{1}{${n}}$ lie strictly between ${a} and ${b}?`,
        `严格在 ${a} 和 ${b} 之间的 $\\frac{1}{${n}}$ 的倍数有多少个？`,
      ],
      answer,
      [answer + 1, answer + 2, n, n * b - 1].filter((v) => v !== answer),
      [
        `Including both ends there are $${n} \\cdot ${b - a} + 1$ multiples, and removing the 2 ends leaves ${answer}.`,
        `算上两端共有 $${n} \\cdot ${b - a} + 1$ 个倍数，去掉两端后剩 ${answer} 个。`,
      ],
    );
  },
);

const leadingCoefficients = point(
  "the-limit-of-a-rational-sequence",
  ["The limit of a rational sequence", "有理式数列的极限"],
  [
    "For a quotient of polynomials in $n$ of the same degree, divide the top and bottom by the highest power of $n$. Every other term then tends to 0 by the algebra of limits. So the limit is the ratio of the leading coefficients, and the lower terms have no effect.",
    "对于 $n$ 的同次多项式之商，分子分母同除以 $n$ 的最高次幂。由极限的代数性质，其余各项都趋于 0。所以极限是首项系数之比，低次项没有影响。",
  ],
  (rng) => {
    const [a, c] = [rng.int(1, 9), rng.int(2, 9)];
    const [b, d] = [rng.pick([-7, -4, -2, -1, 1, 3, 5, 8]), rng.pick([-6, -3, -1, 1, 2, 4, 9])];
    const answer = frac(a, c);
    return ask(
      [
        `What is the limit of $\\frac{${coef(a, "n^2")} ${signed(b, "n")}}{${coef(c, "n^2")} ${signed(d)}}$ as $n \\to \\infty$?`,
        `当 $n \\to \\infty$ 时，$\\frac{${coef(a, "n^2")} ${signed(b, "n")}}{${coef(c, "n^2")} ${signed(d)}}$ 的极限是多少？`,
      ],
      answer,
      [frac(c, a), frac(b, d), frac(a + b, c + d === 0 ? 1 : c + d), Q.of(0, 1)],
      [
        `Dividing by $n^2$ gives $\\frac{${a} + \\cdots}{${c} + \\cdots}$, where the other terms tend to 0. So the limit is $${answer.toLatex()}$.`,
        `除以 $n^2$ 得 $\\frac{${a} + \\cdots}{${c} + \\cdots}$，其余各项趋于 0。所以极限是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const limsup = point(
  "limit-superior-and-inferior",
  ["Limit superior and inferior", "上极限与下极限"],
  [
    "A bounded sequence may have no limit, yet it always has a largest and a smallest limit of subsequences. These are the limit superior and the limit inferior. The sequence converges exactly when the two are equal. For $a + b (-1)^n + \\frac{c}{n}$, the last term dies away and the first two leave two limit points.",
    "有界数列可能没有极限，但子数列的极限总有最大值和最小值，分别称为上极限和下极限。数列收敛当且仅当两者相等。对 $a + b (-1)^n + \\frac{c}{n}$，最后一项趋于零，前两项留下两个极限点。",
  ],
  (rng) => {
    const a = rng.nonZero(-6, 6);
    const b = rng.int(1, 6);
    const c = rng.int(1, 9);
    const sup = rng.bool();
    const answer = sup ? a + b : a - b;
    return ask(
      [
        `What is the limit ${sup ? "superior" : "inferior"} of $x_n = ${a} + ${coef(b, "(-1)^n")} + \\frac{${c}}{n}$?`,
        `$x_n = ${a} + ${coef(b, "(-1)^n")} + \\frac{${c}}{n}$ 的${sup ? "上" : "下"}极限是多少？`,
      ],
      answer,
      [sup ? a - b : a + b, a, answer + c, b].filter((v) => v !== answer),
      [
        `The term $\\frac{${c}}{n}$ tends to 0, so the subsequences tend to $${a} + ${b}$ and $${a} - ${b}$. The ${sup ? "larger" : "smaller"} is ${answer}.`,
        `$\\frac{${c}}{n}$ 趋于 0，所以子数列分别趋于 $${a} + ${b}$ 和 $${a} - ${b}$。较${sup ? "大" : "小"}的是 ${answer}。`,
      ],
    );
  },
);

const tailBound = point(
  "bounding-the-tail-of-a-p-series",
  ["Bounding the tail of a p-series", "估计 p 级数的尾部"],
  [
    "Comparing with an integral bounds what remains of a convergent $p$-series. The sum of $\\frac{1}{k^p}$ over $k > n$ is less than $\\int_n^\\infty x^{-p} \\, dx = \\frac{1}{(p - 1) n^{p - 1}}$. So the partial sum to $n$ is known with an explicit error, and the bound shows how slowly small $p$ converges.",
    "与积分比较可以估计收敛 $p$ 级数的余项。$k > n$ 时 $\\frac{1}{k^p}$ 之和小于 $\\int_n^\\infty x^{-p} \\, dx = \\frac{1}{(p - 1) n^{p - 1}}$。所以到 $n$ 的部分和有明确的误差，这个界也说明了 $p$ 较小时收敛有多慢。",
  ],
  (rng) => {
    const p = rng.int(2, 5);
    const n = rng.int(2, 10);
    const answer = Q.of(1, (p - 1) * n ** (p - 1));
    return ask(
      [
        `What does the integral bound $\\frac{1}{(p - 1) n^{p - 1}}$ give for $\\sum_{k > ${n}} \\frac{1}{k^{${p}}}$?`,
        `积分界 $\\frac{1}{(p - 1) n^{p - 1}}$ 对 $\\sum_{k > ${n}} \\frac{1}{k^{${p}}}$ 给出什么结果？`,
      ],
      answer,
      [Q.of(1, n ** (p - 1)), Q.of(1, p * n ** p), Q.of(1, (p - 1) * n ** p), Q.of(1, p * n ** (p - 1))],
      [
        `Here $p = ${p}$ and $n = ${n}$, so the bound is $\\frac{1}{${p - 1} \\cdot ${n}^{${p - 1}}} = ${answer.toLatex()}$.`,
        `这里 $p = ${p}$，$n = ${n}$，所以界是 $\\frac{1}{${p - 1} \\cdot ${n}^{${p - 1}}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const discreteBall = point(
  "balls-in-the-discrete-metric",
  ["Balls in the discrete metric", "离散度量中的球"],
  [
    "The discrete metric sets the distance between two different points to 1. So an open ball of radius at most 1 contains only its center, and a ball of larger radius contains the whole space. Every subset is therefore open, which shows how strongly topology depends on the metric.",
    "离散度量把两个不同点的距离定为 1。所以半径不超过 1 的开球只含球心，半径更大的开球含整个空间。因此每个子集都是开集，这说明拓扑多么依赖度量。",
  ],
  (rng) => {
    const size = rng.int(3, 20);
    const small = rng.bool();
    const r = small ? frac(rng.int(1, 9), 10) : frac(rng.int(11, 40), 10);
    const answer = small ? 1 : size;
    return ask(
      [
        `A set with ${size} points has the discrete metric. How many points lie in an open ball of radius $${r.toLatex()}$?`,
        `有 ${size} 个点的集合带离散度量。半径为 $${r.toLatex()}$ 的开球中有多少个点？`,
      ],
      answer,
      [small ? size : 1, size - 1, 2, 0].filter((v) => v !== answer),
      [
        small
          ? "Other points are at distance 1, which is too far, so only the center is inside."
          : "Every other point is at distance 1, which is less than the radius, so the whole set is inside.",
        small ? "其他点的距离是 1，太远了，所以只有球心在内。" : "其他每个点的距离都是 1，小于半径，所以整个集合都在球内。",
      ],
    );
  },
);

const boundaryPoints = point(
  "counting-boundary-points",
  ["Counting boundary points", "数边界点"],
  [
    "A boundary point has both points of the set and points of its complement in every neighborhood. For a finite union of separated intervals and single points, the boundary consists of the endpoints of the intervals and the isolated points. Whether an endpoint belongs to the set makes no difference.",
    "边界点的每个邻域中都既有集合中的点，也有补集中的点。对若干分离的区间和单点的有限并，边界由各区间的端点和孤立点组成。端点是否属于这个集合没有影响。",
  ],
  (rng) => {
    const [a, b, c, d, e] = [rng.int(-9, -5), rng.int(-4, -2), rng.int(0, 3), rng.int(4, 7), rng.int(8, 12)];
    const kind = rng.int(0, 3);
    const texts = [
      `(${a}, ${b}) \\cup \\{${c}\\}`,
      `[${a}, ${b}) \\cup (${c}, ${d}]`,
      `(${a}, ${b}] \\cup [${c}, ${d}) \\cup \\{${e}\\}`,
      `\\{${a}, ${c}\\} \\cup (${d}, ${e})`,
    ];
    const answer = [3, 4, 5, 4][kind] as number;
    const text = texts[kind] as string;
    return ask(
      [`How many boundary points does the set $${text}$ have?`, `集合 $${text}$ 有多少个边界点？`],
      answer,
      [answer - 1, answer + 1, 2, 0, 6].filter((v) => v !== answer),
      [
        "Count the two endpoints of each interval, and add each isolated point. These are the points whose neighborhoods meet both the set and its complement.",
        "数出每个区间的两个端点，再加上每个孤立点。这些点的邻域既与集合相交，也与补集相交。",
      ],
    );
  },
);

const oddSquare = point(
  "the-derivative-of-x-times-its-absolute-value",
  ["The derivative of x times its absolute value", "x 乘其绝对值的导数"],
  [
    "The function $x |x|$ equals $x^2$ for positive $x$ and $-x^2$ for negative $x$. Both one-sided derivatives at 0 are 0, so it is differentiable there, and its derivative is $2 |x|$. That derivative has a corner at 0, so this is a differentiable function whose derivative is not differentiable.",
    "函数 $x |x|$ 在 $x$ 为正时等于 $x^2$，为负时等于 $-x^2$。在 0 处两个单侧导数都是 0，所以它在那里可导，导数是 $2 |x|$。这个导数在 0 处有尖点，所以这是一个可导但导数不可导的函数。",
  ],
  (rng) => {
    const c = rng.int(1, 9);
    const a = rng.pick([-7, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]);
    const answer = 2 * c * Math.abs(a);
    return ask(
      [`If $f(x) = ${coef(c, "x |x|")}$, what is $f'(${a})$?`, `若 $f(x) = ${coef(c, "x |x|")}$，$f'(${a})$ 是多少？`],
      answer,
      [2 * c * a, c * Math.abs(a), c * a * Math.abs(a), answer + 2].filter((v) => v !== answer),
      [
        `The derivative is $${2 * c} |x|$, including at 0 where both sides agree. At $x = ${a}$ this is ${answer}.`,
        `导数是 $${2 * c} |x|$，在 0 处两侧也一致。在 $x = ${a}$ 处它等于 ${answer}。`,
      ],
    );
  },
);

const taylorCoefficient = point(
  "a-taylor-coefficient-from-a-derivative",
  ["A Taylor coefficient from a derivative", "由导数求泰勒系数"],
  [
    "The Taylor polynomial of $f$ at 0 has the coefficient $\\frac{f^{(n)}(0)}{n!}$ on $x^n$. The reason is that the $n$th derivative of $x^n$ is $n!$ and it is the only term that survives at 0. So derivatives at a point determine the polynomial, and conversely.",
    "$f$ 在 0 处的泰勒多项式中 $x^n$ 的系数是 $\\frac{f^{(n)}(0)}{n!}$。原因是 $x^n$ 的 $n$ 阶导数是 $n!$，而且在 0 处只有这一项留下来。所以某点的导数决定多项式，反之亦然。",
  ],
  (rng) => {
    const n = rng.int(2, 6);
    const m = rng.int(2, 60);
    let factorial = 1;
    for (let i = 2; i <= n; i++) factorial *= i;
    const answer = frac(m, factorial);
    return ask(
      [
        `If the derivative of order ${n} of $f$ at 0 is ${m}, what is the coefficient of $x^{${n}}$ in its Taylor polynomial at 0?`,
        `若 $f$ 在 0 处的 ${n} 阶导数是 ${m}，它在 0 处的泰勒多项式中 $x^{${n}}$ 的系数是多少？`,
      ],
      answer,
      [frac(m, n), Q.of(m, 1), frac(factorial, m), frac(m, factorial * n)].filter((v) => !v.eq(answer)),
      [`Divide by the factorial: $\\frac{${m}}{${n}!} = ${answer.toLatex()}$.`, `除以阶乘：$\\frac{${m}}{${n}!} = ${answer.toLatex()}$。`],
    );
  },
);

const lowerSum = point(
  "upper-and-lower-sums-of-the-identity",
  ["Upper and lower sums of the identity", "恒等函数的上和与下和"],
  [
    "For $f(x) = x$ on $[0, 1]$ with $n$ equal parts, each lower sum uses left endpoints and each upper sum right endpoints. They come to $\\frac{n - 1}{2 n}$ and $\\frac{n + 1}{2 n}$. Their difference $\\frac{1}{n}$ tends to 0, so the integral exists and equals $\\frac{1}{2}$.",
    "对 $[0, 1]$ 上的 $f(x) = x$ 作 $n$ 等分，下和用左端点，上和用右端点。它们分别是 $\\frac{n - 1}{2 n}$ 和 $\\frac{n + 1}{2 n}$。它们的差 $\\frac{1}{n}$ 趋于 0，所以积分存在且等于 $\\frac{1}{2}$。",
  ],
  (rng) => {
    const n = rng.int(2, 30);
    const lower = rng.bool();
    const answer = lower ? frac(n - 1, 2 * n) : frac(n + 1, 2 * n);
    return ask(
      [
        `What is the ${lower ? "lower" : "upper"} sum of $f(x) = x$ on $[0, 1]$ with ${n} equal parts?`,
        `$[0, 1]$ 上的 $f(x) = x$ 作 ${n} 等分，${lower ? "下" : "上"}和是多少？`,
      ],
      answer,
      [lower ? frac(n + 1, 2 * n) : frac(n - 1, 2 * n), Q.of(1, 2), Q.of(1, n), frac(n - 1, n)],
      [
        `The ${lower ? "left" : "right"} endpoints give $\\frac{1}{${n}} \\cdot \\frac{${lower ? n - 1 : n + 1} \\cdot ${n}}{2 \\cdot ${n}} = ${answer.toLatex()}$.`,
        `${lower ? "左" : "右"}端点给出 $\\frac{1}{${n}} \\cdot \\frac{${lower ? n - 1 : n + 1} \\cdot ${n}}{2 \\cdot ${n}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const variableLimit = point(
  "an-accumulation-function-with-a-moving-limit",
  ["An accumulation function with a moving limit", "变上限的积分函数"],
  [
    "When the upper limit of an integral is itself a function, combine the fundamental theorem with the chain rule. The derivative of $\\int_0^{x^2} g(t) \\, dt$ is $g(x^2) \\cdot 2 x$. This holds wherever $g$ is continuous, because then the inner accumulation function is differentiable.",
    "当积分上限本身是函数时，把微积分基本定理和链式法则结合起来。$\\int_0^{x^2} g(t) \\, dt$ 的导数是 $g(x^2) \\cdot 2 x$。只要 $g$ 连续这就成立，因为这时内层的积分函数可导。",
  ],
  (rng) => {
    const [c, a, m] = [rng.int(1, 9), rng.int(1, 5), rng.int(1, 4)];
    const answer = (m * a * a + c) * 2 * a;
    return ask(
      [
        `If $F(x) = \\int_0^{x^2} (${coef(m, "t")} + ${c}) \\, dt$, what is $F'(${a})$?`,
        `若 $F(x) = \\int_0^{x^2} (${coef(m, "t")} + ${c}) \\, dt$，$F'(${a})$ 是多少？`,
      ],
      answer,
      [m * a * a + c, m * a + c, (m * a + c) * 2 * a, answer + 2 * a].filter((v) => v !== answer),
      [
        `$F'(x) = (${coef(m, "x^2")} + ${c}) \\cdot 2 x$, which at $x = ${a}$ is $${m * a * a + c} \\cdot ${2 * a} = ${answer}$.`,
        `$F'(x) = (${coef(m, "x^2")} + ${c}) \\cdot 2 x$，在 $x = ${a}$ 处等于 $${m * a * a + c} \\cdot ${2 * a} = ${answer}$。`,
      ],
    );
  },
);

const coverLength = point(
  "the-total-length-of-a-shrinking-cover",
  ["The total length of a shrinking cover", "收缩覆盖的总长度"],
  [
    "To cover a countable list of points by intervals of small total length, give the $k$th point an interval of length $\\frac{\\varepsilon}{2^k}$. The lengths form a geometric series with sum $\\varepsilon$. This is the standard proof that every countable set has measure zero, however dense it may be.",
    "要用总长度很小的区间覆盖可数个点，就给第 $k$ 个点一个长度为 $\\frac{\\varepsilon}{2^k}$ 的区间。这些长度构成和为 $\\varepsilon$ 的几何级数。这是每个可数集（不管多稠密）测度为零的标准证明。",
  ],
  (rng) => {
    const e = rng.pick([1, 2, 3, 5, 7]);
    const d = rng.pick([10, 100, 1000]);
    const n = rng.int(2, 6);
    const answer = frac(e * (2 ** n - 1), d * 2 ** n);
    const eps = frac(e, d);
    return ask(
      [
        `The $k$th of ${n} points gets an interval of length $\\frac{\\varepsilon}{2^k}$, with $\\varepsilon = ${eps.toLatex()}$. What is the total length of the ${n} intervals?`,
        `${n} 个点中第 $k$ 个点得到长度为 $\\frac{\\varepsilon}{2^k}$ 的区间，$\\varepsilon = ${eps.toLatex()}$。这 ${n} 个区间的总长度是多少？`,
      ],
      answer,
      [eps, frac(e, d * 2 ** n), frac(e * n, d * 2 ** n), frac(e * (2 ** n - 1), d)],
      [
        `The sum of $\\frac{1}{2^k}$ for $k$ up to ${n} is $1 - \\frac{1}{2^{${n}}}$. Multiplying by $\\varepsilon$ gives $${answer.toLatex()}$.`,
        `$k$ 到 ${n} 的 $\\frac{1}{2^k}$ 之和是 $1 - \\frac{1}{2^{${n}}}$。乘 $\\varepsilon$ 得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const iterationsNeeded = point(
  "how-many-iterations-are-enough",
  ["How many iterations are enough", "迭代多少次才够"],
  [
    "For a contraction with constant $L$, the error after $n$ steps is at most $\\frac{L^n}{1 - L} |x_1 - x_0|$. Since this bound uses only the first step, it can tell in advance how many iterations will reach a desired accuracy. Choose the smallest $n$ that brings it below the tolerance.",
    "对常数为 $L$ 的压缩映射，$n$ 步后的误差不超过 $\\frac{L^n}{1 - L} |x_1 - x_0|$。这个界只用到第一步，所以能预先知道多少次迭代才能达到所需精度。选择使它低于容差的最小 $n$。",
  ],
  (rng) => {
    const denominator = rng.pick([2, 3, 4, 5]);
    const d = rng.int(1, 6);
    const k = rng.pick([10, 20, 50, 100, 200, 500, 1000]);
    let n = 1;
    while ((d * denominator) / (denominator - 1) >= denominator ** n / k) n++;
    return ask(
      [
        `A contraction has constant $L = \\frac{1}{${denominator}}$ and $|x_1 - x_0| = ${d}$. What is the smallest $n$ for which the bound $\\frac{L^n}{1 - L} |x_1 - x_0|$ falls below $\\frac{1}{${k}}$?`,
        `压缩映射的常数 $L = \\frac{1}{${denominator}}$，$|x_1 - x_0| = ${d}$。使界 $\\frac{L^n}{1 - L} |x_1 - x_0|$ 低于 $\\frac{1}{${k}}$ 的最小 $n$ 是多少？`,
      ],
      n,
      [n + 1, n - 1 > 0 ? n - 1 : n + 2, n + 2 === k ? n + 3 : n + 3, k].filter((v) => v !== n),
      [
        `The bound is $${frac(d * denominator, denominator - 1).toLatex()} \\cdot \\frac{1}{${denominator}^n}$. It first falls below $\\frac{1}{${k}}$ at $n = ${n}$.`,
        `这个界是 $${frac(d * denominator, denominator - 1).toLatex()} \\cdot \\frac{1}{${denominator}^n}$。它第一次低于 $\\frac{1}{${k}}$ 是在 $n = ${n}$。`,
      ],
    );
  },
);

/** deeperRealAnalysisPoints maps topics of Real Analysis to their further knowledge points. */
export const deeperRealAnalysisPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "supremum-and-infimum": [supremumOfSums],
  "the-archimedean-property": [fractionsBetween],
  "the-algebra-of-limits": [leadingCoefficients],
  "subsequences-and-the-bolzano-weierstrass-theorem": [limsup],
  "harmonic-series-and-p-series": [tailBound],
  "distances-in-metric-spaces": [discreteBall],
  "open-and-closed-sets-of-reals": [boundaryPoints],
  "differentiability-in-analysis": [oddSquare],
  "taylors-theorem-with-remainder": [taylorCoefficient],
  "bounds-and-means-of-integrals": [lowerSum],
  "the-fundamental-theorem-in-analysis": [variableLimit],
  "sets-of-measure-zero": [coverLength],
  "the-contraction-mapping-principle": [iterationsNeeded],
};
