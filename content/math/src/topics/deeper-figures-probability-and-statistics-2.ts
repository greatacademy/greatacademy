// More knowledge points of Probability and Statistics that ask the learner to read a drawing: bar charts of distributions,
// density curves, joint supports, confidence intervals, rejection regions and likelihoods.
// See `deeperFiguresProbability2CalculusPoints` and `deeperFiguresProbability2CollegePoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { ask, choose, point, same } from "../university-kit.ts";
import { bars, chart, curvePath, intTicks, normal, shadeUnder, tenthTicks } from "./figure-charts.ts";
import { label } from "./figure-reading-more.ts";

/** binom returns n choose k. */
const binom = (n: number, k: number): number => {
  let out = 1;
  for (let i = 1; i <= k; i++) out = (out * (n - k + i)) / i;
  return Math.round(out);
};

/** pmfBars draws the bars of a distribution on consecutive whole numbers. */
const pmfBars = (from: number, values: readonly number[], x: (v: number) => number, y: (v: number) => number) =>
  values.map((v, i) => bars([from + i - 0.4, from + i + 0.4], [v], x, y)).join("");

const binomialTail = point(
  "a-binomial-probability-from-its-bars",
  ["A binomial probability from its bars", "由条形图求二项分布概率"],
  [
    'The bars of a binomial distribution show $P(X = k)$ for each count $k$. "At least" and "at most" questions add a run of bars, and with $p = \\frac{1}{2}$ every bar is a whole number of sixteenths or thirty-seconds, since the outcomes are equally likely.',
    "二项分布的条形图给出每个次数 $k$ 的 $P(X = k)$。“至少”和“至多”的问题就是把连续几根条形相加；当 $p = \\frac{1}{2}$ 时，所有结果等可能，每根条形都是若干个十六分之一或三十二分之一。",
  ],
  (rng) => {
    const n = rng.pick([4, 5, 6]);
    const denominator = 2 ** n;
    const counts = Array.from({ length: n + 1 }, (_, k) => binom(n, k));
    const a = rng.int(0, n - 1);
    const b = rng.int(a + 1, n);
    const event = a === 0 ? `X \\le ${b}` : b === n ? `X \\ge ${a}` : `${a} \\le X \\le ${b}`;
    const sum = counts.slice(a, b + 1).reduce((u, v) => u + v, 0);
    const other = denominator - sum;
    const open = counts.slice(a + 1, b).reduce((u, v) => u + v, 0);
    const svg = chart(
      [-0.8, n + 0.8],
      [0, 0.42],
      intTicks(0, n),
      [...new Set(counts)].filter((c) => c >= denominator / 16).map((c) => [c / denominator, `${c}/${denominator}`] as [number, string]),
      (x, y) =>
        pmfBars(
          0,
          counts.map((c) => c / denominator),
          x,
          y,
        ),
    );
    return ask(
      [
        `The chart shows the distribution of the number of heads $X$ in ${n} fair coin tosses. Find $P(${event})$.`,
        `图中是抛 ${n} 次均匀硬币时正面次数 $X$ 的分布。求 $P(${event})$。`,
      ],
      Q.of(sum, denominator),
      [Q.of(other, denominator), Q.of(counts[b] as number, denominator), Q.of(open, denominator), Q.of(sum, 2 * denominator)],
      [
        `Add the heights of the bars from $${a}$ to $${b}$, both included: $\\frac{${counts.slice(a, b + 1).join(" + ")}}{${denominator}} = \\frac{${sum}}{${denominator}}$.`,
        `把从 $${a}$ 到 $${b}$（两端都包括）的条形高度相加：$\\frac{${counts.slice(a, b + 1).join(" + ")}}{${denominator}} = \\frac{${sum}}{${denominator}}$。`,
      ],
      {
        svg,
        alt: t(
          `A bar chart of the number of heads in ${n} fair coin tosses, with heights ${counts.map((c) => `${c}/${denominator}`).join(", ")} for 0 to ${n}.`,
          `抛 ${n} 次均匀硬币的正面次数的条形图，0 到 ${n} 的高度依次为 ${counts.map((c) => `${c}/${denominator}`).join("、")}。`,
        ),
      },
    );
  },
);

const binomialShape = point(
  "the-success-probability-from-the-shape-of-the-bars",
  ["The success probability from the shape of the bars", "由条形形状判断成功概率"],
  [
    "The mean of $B(n, p)$ is $np$, and the tallest bars stand near it. So a small $p$ piles the bars at the left with a long tail to the right, $p = \\frac{1}{2}$ gives a symmetric chart, and a large $p$ piles them at the right.",
    "$B(n, p)$ 的均值是 $np$，最高的条形就在它附近。所以 $p$ 较小时条形堆在左边、右边拖尾；$p = \\frac{1}{2}$ 时图形对称；$p$ 较大时条形堆在右边。",
  ],
  (rng) => {
    const n = rng.int(8, 16);
    const p = rng.pick([0.2, 0.5, 0.8]);
    const pmf = Array.from({ length: n + 1 }, (_, k) => binom(n, k) * p ** k * (1 - p) ** (n - k));
    const tallest = pmf.indexOf(Math.max(...pmf));
    const svg = chart([-0.8, n + 0.8], [0, 0.4], intTicks(0, n), tenthTicks(1, 3), (x, y) => pmfBars(0, pmf, x, y));
    const name = (v: number) => same(String(v));
    return choose(
      rng,
      [
        `The chart shows a binomial distribution with $n = ${n}$. Which value of $p$ does it have?`,
        `图中是 $n = ${n}$ 的二项分布。它的 $p$ 是多少？`,
      ],
      name(p),
      [0.2, 0.5, 0.8].filter((v) => v !== p).map(name),
      [
        `The bars pile up around $${tallest}$, and the mean $np$ must lie near them. Among the choices, only $p = ${p}$ gives that, since $${n}(${p}) = ${n * p}$.`,
        `条形集中在 $${tallest}$ 附近，均值 $np$ 必须在它们附近。选项中只有 $p = ${p}$ 符合，因为 $${n}(${p}) = ${n * p}$。`,
      ],
      {
        svg,
        alt: t(
          `A bar chart of a binomial distribution with n = ${n} whose tallest bar stands at ${tallest}.`,
          `n = ${n} 的二项分布条形图，最高的条形在 ${tallest}。`,
        ),
      },
    );
  },
);

const poissonRate = point(
  "the-rate-of-a-poisson-distribution-from-its-bars",
  ["The rate of a Poisson distribution from its bars", "由条形图判断泊松分布的参数"],
  [
    "A Poisson distribution with rate $\\lambda$ has mean $\\lambda$, and the ratio of neighboring bars is $\\frac{P(X = k)}{P(X = k - 1)} = \\frac{\\lambda}{k}$. So the bars rise while $k < \\lambda$ and fall afterward. For a whole number $\\lambda$, the bars at $\\lambda - 1$ and $\\lambda$ are exactly equal and the tallest.",
    "参数为 $\\lambda$ 的泊松分布均值为 $\\lambda$，相邻条形之比为 $\\frac{P(X = k)}{P(X = k - 1)} = \\frac{\\lambda}{k}$。所以 $k < \\lambda$ 时条形上升，之后下降。$\\lambda$ 为整数时，$\\lambda - 1$ 和 $\\lambda$ 处的两根条形恰好相等且最高。",
  ],
  (rng) => {
    const lambda = rng.int(1, 9);
    let term = Math.exp(-lambda);
    const pmf = Array.from({ length: 17 }, (_, k) => {
      if (k > 0) term = (term * lambda) / k;
      return term;
    });
    const svg = chart([-0.8, 16.8], [0, 0.42], intTicks(0, 16, 2), tenthTicks(1, 4), (x, y) => pmfBars(0, pmf, x, y));
    const figure = {
      svg,
      alt: t(
        `A bar chart of a Poisson distribution from 0 to 16 whose two tallest bars are equal, at ${lambda - 1} and ${lambda}.`,
        `0 到 16 的泊松分布条形图，最高的两根条形相等，位于 ${lambda - 1} 和 ${lambda}。`,
      ),
    };
    const ratio = rng.bool(0.7);
    if (!ratio)
      return ask(
        [
          "The chart shows a Poisson distribution whose rate $\\lambda$ is a whole number. What is $\\lambda$?",
          "图中是一个泊松分布，其参数 $\\lambda$ 是整数。$\\lambda$ 是多少？",
        ],
        lambda,
        [lambda - 1, lambda + 1, lambda + 2],
        [
          `The two tallest bars are equal and stand at $${lambda - 1}$ and $${lambda}$. Their ratio is $\\frac{\\lambda}{k}$, which is one at $k = \\lambda$, so $\\lambda = ${lambda}$.`,
          `最高的两根条形相等，位于 $${lambda - 1}$ 和 $${lambda}$。它们的比是 $\\frac{\\lambda}{k}$，在 $k = \\lambda$ 时为一，所以 $\\lambda = ${lambda}$。`,
        ],
        figure,
      );
    const k = rng.int(1, 6);
    return ask(
      [
        `The chart shows a Poisson distribution whose rate $\\lambda$ is a whole number. Find the exact ratio $\\frac{P(X = ${k})}{P(X = ${k - 1})}$.`,
        `图中是一个泊松分布，其参数 $\\lambda$ 是整数。求精确比值 $\\frac{P(X = ${k})}{P(X = ${k - 1})}$。`,
      ],
      Q.of(lambda, k),
      [Q.of(k, lambda), Q.of(lambda, k + 1), Q.of(lambda + 1, k)],
      [
        `The two tallest bars are equal at $${lambda - 1}$ and $${lambda}$, so $\\lambda = ${lambda}$. The ratio of neighboring bars is $\\frac{\\lambda}{k} = \\frac{${lambda}}{${k}}$.`,
        `最高的两根条形相等，位于 $${lambda - 1}$ 和 $${lambda}$，所以 $\\lambda = ${lambda}$。相邻条形之比为 $\\frac{\\lambda}{k} = \\frac{${lambda}}{${k}}$。`,
      ],
      figure,
    );
  },
);

const uniformBars = point(
  "mean-and-variance-from-equal-bars",
  ["Mean and variance from equal bars", "由等高条形求均值和方差"],
  [
    "Equal bars on the whole numbers from $a$ to $b$ show a discrete uniform distribution. With $n = b - a + 1$ values, its mean is $\\frac{a + b}{2}$ and its variance is $\\frac{n^{2} - 1}{12}$. Shifting the bars moves the mean and leaves the variance alone.",
    "从 $a$ 到 $b$ 的各整数上等高的条形表示离散均匀分布。共有 $n = b - a + 1$ 个值时，均值为 $\\frac{a + b}{2}$，方差为 $\\frac{n^{2} - 1}{12}$。平移条形会改变均值，但不改变方差。",
  ],
  (rng) => {
    const a = rng.int(1, 5);
    const n = rng.pick([3, 4, 5, 6, 7]);
    const b = a + n - 1;
    const wantMean = rng.bool();
    const svg = chart([0, 12.8], [0, 0.42], intTicks(0, 12), [[1 / n, `1/${n}`]], (x, y) =>
      pmfBars(
        a,
        Array.from({ length: n }, () => 1 / n),
        x,
        y,
      ),
    );
    const mean = Q.of(a + b, 2);
    const variance = Q.of(n * n - 1, 12);
    return ask(
      [
        `The chart shows the distribution of $X$. Find ${wantMean ? "$E(X)$" : "$\\operatorname{Var}(X)$"}.`,
        `图中是 $X$ 的分布。求 ${wantMean ? "$E(X)$" : "$\\operatorname{Var}(X)$"}。`,
      ],
      wantMean ? mean : variance,
      wantMean ? [Q.of(n, 2), Q.of(b - a, 2), Q.of(a + b, 1)] : [Q.of(n * n, 12), Q.of(n + 1, 12), mean],
      [
        `There are $n = ${n}$ equal bars from $${a}$ to $${b}$. ${wantMean ? `The mean is the midpoint, $\\frac{${a} + ${b}}{2} = ${mean.toLatex()}$.` : `So the variance is $\\frac{${n}^{2} - 1}{12} = ${variance.toLatex()}$.`}`,
        `从 $${a}$ 到 $${b}$ 共有 $n = ${n}$ 根等高的条形。${wantMean ? `均值是中点，$\\frac{${a} + ${b}}{2} = ${mean.toLatex()}$。` : `所以方差为 $\\frac{${n}^{2} - 1}{12} = ${variance.toLatex()}$。`}`,
      ],
      {
        svg,
        alt: t(
          `A bar chart with ${n} equal bars of height 1/${n} on the whole numbers from ${a} to ${b}.`,
          `从 ${a} 到 ${b} 的各整数上有 ${n} 根高度为 1/${n} 的等高条形。`,
        ),
      },
    );
  },
);

const bernoulliBars = point(
  "the-variance-from-two-bars",
  ["The variance from two bars", "由两根条形求方差"],
  [
    "A Bernoulli variable has a bar at $0$ of height $1 - p$ and a bar at $1$ of height $p$. Its mean is the height at $1$, and its variance is $p(1 - p)$, the product of the two heights. The variance is largest when the bars are equal.",
    "伯努利变量在 $0$ 处有高为 $1 - p$ 的条形，在 $1$ 处有高为 $p$ 的条形。均值就是 $1$ 处的高度，方差 $p(1 - p)$ 是两个高度之积。两根条形相等时方差最大。",
  ],
  (rng) => {
    const p = rng.pick([1, 2, 3, 4, 6, 7, 8, 9]);
    const c = rng.int(1, 4);
    const svg = chart([-0.8, 1.8], [0, 1.05], intTicks(0, 1), tenthTicks(0, 10, 2), (x, y) => pmfBars(0, [(10 - p) / 10, p / 10], x, y));
    const answer = Q.of(c * c * p * (10 - p), 100);
    const target = c === 1 ? "X" : `${c}X`;
    return ask(
      [
        `The chart shows the distribution of a Bernoulli variable $X$. Find $\\operatorname{Var}(${target})$.`,
        `图中是伯努利变量 $X$ 的分布。求 $\\operatorname{Var}(${target})$。`,
      ],
      answer,
      [Q.of(c * p * (10 - p), 100), Q.of(c * p, 10), Q.of(c * (10 - p), 10), Q.of(p * (10 - p), 100)],
      [
        `The bar at $1$ has height $p = ${p / 10}$ and the bar at $0$ has height $${(10 - p) / 10}$, so $\\operatorname{Var}(X) = ${p / 10} \\cdot ${(10 - p) / 10} = ${Q.of(p * (10 - p), 100).toLatex()}$.${c === 1 ? "" : ` Multiplying by $${c}$ multiplies the variance by $${c * c}$, which gives $${answer.toLatex()}$.`}`,
        `$1$ 处条形高 $p = ${p / 10}$，$0$ 处条形高 $${(10 - p) / 10}$，所以 $\\operatorname{Var}(X) = ${p / 10} \\cdot ${(10 - p) / 10} = ${Q.of(p * (10 - p), 100).toLatex()}$。${c === 1 ? "" : `乘以 $${c}$ 使方差乘以 $${c * c}$，得 $${answer.toLatex()}$。`}`,
      ],
      {
        svg,
        alt: t(
          `Two bars: height ${(10 - p) / 10} at 0 and height ${p / 10} at 1.`,
          `两根条形：0 处高 ${(10 - p) / 10}，1 处高 ${p / 10}。`,
        ),
      },
    );
  },
);

const varianceFromBars = point(
  "the-variance-from-three-bars",
  ["The variance from three bars", "由三根条形求方差"],
  [
    "To find a variance from a chart, list the values and their heights, find the mean $\\mu = \\sum x\\,p(x)$, and then add the squared distances from the mean, each weighted by its bar: $\\sigma^{2} = \\sum (x - \\mu)^{2} p(x)$.",
    "由条形图求方差时，先列出取值和对应的高度，求出均值 $\\mu = \\sum x\\,p(x)$，再把到均值距离的平方按条形高度加权求和：$\\sigma^{2} = \\sum (x - \\mu)^{2} p(x)$。",
  ],
  (rng) => {
    const mu = rng.int(3, 7);
    const d = rng.int(1, 3);
    const side = rng.pick([1, 2, 3, 4]);
    const svg = chart([0, 10.8], [0, 1.05], intTicks(0, 10), tenthTicks(0, 10, 2), (x, y) =>
      pmfBars(
        mu - d,
        Array.from({ length: 2 * d + 1 }, (_, i) => (i === 0 || i === 2 * d ? side / 10 : i === d ? (10 - 2 * side) / 10 : 0)),
        x,
        y,
      ),
    );
    const answer = Q.of(2 * side * d * d, 10);
    return ask(
      ["The chart shows the distribution of $X$. Find $\\operatorname{Var}(X)$.", "图中是 $X$ 的分布。求 $\\operatorname{Var}(X)$。"],
      answer,
      [Q.of(2 * side * d, 10), Q.of(side * d * d, 10), Q.of(d * d, 1)],
      [
        `The chart is symmetric about $\\mu = ${mu}$. The middle bar contributes nothing, and each outer bar has height $${side / 10}$ at distance $${d}$, so the variance is $2 \\cdot ${d}^{2} \\cdot ${side / 10} = ${answer.toLatex()}$.`,
        `图形关于 $\\mu = ${mu}$ 对称。中间的条形贡献为零，两侧条形高 $${side / 10}$、距离均值 $${d}$，所以方差为 $2 \\cdot ${d}^{2} \\cdot ${side / 10} = ${answer.toLatex()}$。`,
      ],
      {
        svg,
        alt: t(
          `Three bars: height ${side / 10} at ${mu - d}, height ${(10 - 2 * side) / 10} at ${mu}, and height ${side / 10} at ${mu + d}.`,
          `三根条形：${mu - d} 处高 ${side / 10}，${mu} 处高 ${(10 - 2 * side) / 10}，${mu + d} 处高 ${side / 10}。`,
        ),
      },
    );
  },
);

/** triangleDensity gives a triangular density on [a, b] with its peak at c. */
const triangleDensity = (a: number, c: number, b: number) => {
  const h = 2 / (b - a);
  return (v: number) => (v <= a || v >= b ? 0 : v <= c ? (h * (v - a)) / (c - a || 1) : (h * (b - v)) / (b - c || 1));
};

const triangleMean = point(
  "the-mean-of-a-triangular-density",
  ["The mean of a triangular density", "三角形密度的均值"],
  [
    "The mean of a density is the balance point of the region under it. For a triangle, the balance point lies above the average of the three corners' positions, so a triangular density on $[a, b]$ with its peak at $c$ has mean $\\frac{a + b + c}{3}$. A symmetric triangle balances at its peak, and a lopsided one has its mean on the side of the long tail.",
    "密度的均值是其下方区域的平衡点。三角形的平衡点在三个顶点横坐标的平均值处，所以 $[a, b]$ 上峰值在 $c$ 的三角形密度，均值为 $\\frac{a + b + c}{3}$。对称三角形在峰值处平衡；不对称时，均值偏向长尾一侧。",
  ],
  (rng) => {
    const a = rng.int(0, 2);
    const b = a + rng.pick([6, 7, 8]);
    const c = rng.int(a + 1, b - 1);
    const f = triangleDensity(a, c, b);
    const svg = chart(
      [0, 11],
      [0, (2 / (b - a)) * 1.2],
      intTicks(0, 11),
      [],
      (x, y) => curvePath(f, a, b, x, y) + shadeUnder(f, a, b, x, y),
    );
    const answer = Q.of(a + b + c, 3);
    return ask(
      ["The graph shows a triangular density of $X$. Find $E(X)$.", "图中是 $X$ 的三角形密度。求 $E(X)$。"],
      answer,
      [Q.of(c, 1), Q.of(a + b, 2), Q.of(a + b + c, 2)],
      [
        `The corners are at $${a}$, $${b}$ and the peak $${c}$, so the mean is $\\frac{${a} + ${b} + ${c}}{3} = ${answer.toLatex()}$.`,
        `三个顶点的横坐标是 $${a}$、$${b}$ 和峰值 $${c}$，所以均值为 $\\frac{${a} + ${b} + ${c}}{3} = ${answer.toLatex()}$。`,
      ],
      {
        svg,
        alt: t(`A triangular density from ${a} to ${b} with its peak at ${c}.`, `从 ${a} 到 ${b} 的三角形密度，峰值在 ${c}。`),
      },
    );
  },
);

const modeVersusMean = point(
  "where-the-mode-median-and-mean-fall",
  ["Where the mode, median and mean fall", "众数、中位数和均值的位置"],
  [
    "The mode is where a density peaks. A long right tail pulls the mean to the right of the median, and both stand to the right of the mode. A long left tail reverses the order. In a symmetric density with one peak, all three coincide.",
    "众数是密度达到峰值的位置。右侧长尾把均值拉到中位数右边，两者都在众数右边；左侧长尾则顺序相反。单峰对称的密度三者重合。",
  ],
  (rng) => {
    const right = rng.bool();
    const a = rng.int(0, 2);
    const b = a + rng.int(7, 8);
    const c = right ? a + rng.int(1, 3) : b - rng.int(1, 3);
    const f = triangleDensity(a, c, b);
    const svg = chart([0, 11], [0, (2 / (b - a)) * 1.2], intTicks(0, 11), [], (x, y) => curvePath(f, a, b, x, y));
    const correct: [string, string] = right
      ? ["mode $<$ median $<$ mean", "众数 $<$ 中位数 $<$ 均值"]
      : ["mean $<$ median $<$ mode", "均值 $<$ 中位数 $<$ 众数"];
    return choose(
      rng,
      [
        "The graph shows the density of $X$. How are its mode, median and mean ordered?",
        "图中是 $X$ 的密度。它的众数、中位数和均值如何排序？",
      ],
      correct,
      [
        right ? ["mean $<$ median $<$ mode", "均值 $<$ 中位数 $<$ 众数"] : ["mode $<$ median $<$ mean", "众数 $<$ 中位数 $<$ 均值"],
        ["mode $=$ median $=$ mean", "众数 $=$ 中位数 $=$ 均值"],
        ["median $<$ mode $<$ mean", "中位数 $<$ 众数 $<$ 均值"],
      ],
      [
        `The peak is at $${c}$ and the long tail runs to the ${right ? "right" : "left"}. The tail pulls the mean furthest, then the median, away from the mode.`,
        `峰值在 $${c}$，长尾伸向${right ? "右" : "左"}侧。长尾把均值拉得最远，其次是中位数，都离开众数。`,
      ],
      {
        svg,
        alt: t(
          `A lopsided triangular density from ${a} to ${b} with its peak at ${c}.`,
          `从 ${a} 到 ${b} 不对称的三角形密度，峰值在 ${c}。`,
        ),
      },
    );
  },
);

const uniformVariance = point(
  "mean-and-variance-from-a-rectangular-density",
  ["Mean and variance from a rectangular density", "由矩形密度求均值和方差"],
  [
    "A continuous uniform density on $[a, b]$ is a rectangle of height $\\frac{1}{b - a}$. Its mean is the midpoint $\\frac{a + b}{2}$, and its variance is $\\frac{(b - a)^{2}}{12}$, which depends only on the width of the rectangle.",
    "$[a, b]$ 上的连续均匀密度是高为 $\\frac{1}{b - a}$ 的矩形。均值是中点 $\\frac{a + b}{2}$，方差为 $\\frac{(b - a)^{2}}{12}$，只取决于矩形的宽度。",
  ],
  (rng) => {
    const a = rng.int(0, 4);
    const w = rng.pick([2, 3, 4, 5, 6]);
    const b = a + w;
    const wantMean = rng.bool();
    const svg = chart([0, 11], [0, (1 / w) * 1.3], intTicks(0, 11), [[1 / w, `1/${w}`]], (x, y) => bars([a, b], [1 / w], x, y));
    const mean = Q.of(a + b, 2);
    const variance = Q.of(w * w, 12);
    return ask(
      [
        `The graph shows the density of $X$. Find ${wantMean ? "$E(X)$" : "$\\operatorname{Var}(X)$"}.`,
        `图中是 $X$ 的密度。求 ${wantMean ? "$E(X)$" : "$\\operatorname{Var}(X)$"}。`,
      ],
      wantMean ? mean : variance,
      wantMean ? [Q.of(w, 2), Q.of(a + b, 1), Q.of(b, 1)] : [Q.of(w, 12), Q.of(w * w, 2), Q.of(b * b, 12)],
      [
        `The rectangle runs from $${a}$ to $${b}$, a width of $${w}$. ${wantMean ? `The mean is its midpoint, $${mean.toLatex()}$.` : `So the variance is $\\frac{${w}^{2}}{12} = ${variance.toLatex()}$.`}`,
        `矩形从 $${a}$ 到 $${b}$，宽度为 $${w}$。${wantMean ? `均值是它的中点 $${mean.toLatex()}$。` : `所以方差为 $\\frac{${w}^{2}}{12} = ${variance.toLatex()}$。`}`,
      ],
      {
        svg,
        alt: t(`A rectangular density from ${a} to ${b} with height 1/${w}.`, `从 ${a} 到 ${b} 的矩形密度，高度为 1/${w}。`),
      },
    );
  },
);

const exponentialMean = point(
  "the-mean-from-the-height-of-an-exponential-curve",
  ["The mean from the height of an exponential curve", "由指数曲线的高度求均值"],
  [
    "The exponential density $f(x) = \\lambda e^{-\\lambda x}$ starts at height $\\lambda$ on the vertical axis. Its mean and its standard deviation are both $\\frac{1}{\\lambda}$. So a taller start means a faster decay and a smaller mean.",
    "指数密度 $f(x) = \\lambda e^{-\\lambda x}$ 在纵轴上的起始高度是 $\\lambda$，均值和标准差都是 $\\frac{1}{\\lambda}$。所以起点越高，衰减越快，均值越小。",
  ],
  (rng) => {
    const den = rng.pick([2, 3, 4, 5, 6, 8, 10]);
    const lambda = 1 / den;
    const f = (v: number) => lambda * Math.exp(-lambda * v);
    const span = 3 * den;
    const svg = chart([0, span], [0, lambda * 1.2], intTicks(0, span, den), [[lambda, `1/${den}`]], (x, y) => curvePath(f, 0, span, x, y));
    const kind = rng.pick(["mean", "deviation", "variance", "second"] as const);
    const answer = kind === "variance" ? den * den : kind === "second" ? 2 * den * den : den;
    const asked: [string, string] =
      kind === "mean"
        ? ["the mean $E(X)$", "均值 $E(X)$"]
        : kind === "deviation"
          ? ["the standard deviation of $X$", "$X$ 的标准差"]
          : kind === "variance"
            ? ["the variance of $X$", "$X$ 的方差"]
            : ["$E(X^{2})$", "$E(X^{2})$"];
    const step: [string, string] =
      kind === "variance"
        ? [` The variance is $\\frac{1}{\\lambda^{2}} = ${answer}$.`, `方差为 $\\frac{1}{\\lambda^{2}} = ${answer}$。`]
        : kind === "second"
          ? [
              ` Then $E(X^{2}) = \\operatorname{Var}(X) + E(X)^{2} = ${den * den} + ${den * den} = ${answer}$.`,
              `于是 $E(X^{2}) = \\operatorname{Var}(X) + E(X)^{2} = ${den * den} + ${den * den} = ${answer}$。`,
            ]
          : ["", ""];
    return ask(
      [`The graph shows the exponential density of $X$. Find ${asked[0]}.`, `图中是 $X$ 的指数密度。求${asked[1]}。`],
      answer,
      [Q.of(1, den), den * den === answer ? den : den * den, 2 * den, den + 1],
      [
        `The curve starts at height $\\lambda = \\frac{1}{${den}}$, so the mean and the standard deviation are both $\\frac{1}{\\lambda} = ${den}$.${step[0]}`,
        `曲线起始高度为 $\\lambda = \\frac{1}{${den}}$，所以均值和标准差都是 $\\frac{1}{\\lambda} = ${den}$。${step[1]}`,
      ],
      {
        svg,
        alt: t(
          `A decreasing exponential density starting at height 1/${den} on the vertical axis.`,
          `递减的指数密度，在纵轴上的起始高度为 1/${den}。`,
        ),
      },
    );
  },
);

/** logGamma returns the logarithm of the gamma function at a positive half integer or whole number. */
const logGamma = (a: number): number => {
  let out = 0;
  let v = a;
  while (v > 1) {
    v -= 1;
    out += Math.log(v);
  }
  return v === 0.5 ? out + 0.5 * Math.log(Math.PI) : out;
};

/** chiSquare is the density of the chi-square distribution with k degrees of freedom. */
const chiSquare = (k: number) => (v: number) =>
  v <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(v) - v / 2 - (k / 2) * Math.log(2) - logGamma(k / 2));

const chiSquarePeak = point(
  "degrees-of-freedom-from-a-chi-square-peak",
  ["Degrees of freedom from a chi-square peak", "由卡方峰值判断自由度"],
  [
    "For $k \\ge 2$ the chi-square density with $k$ degrees of freedom peaks at $x = k - 2$, and its mean is $k$. As $k$ grows, the curve moves right and spreads out. Its variance is $2k$.",
    "当 $k \\ge 2$ 时，自由度为 $k$ 的卡方密度在 $x = k - 2$ 处达到峰值，均值为 $k$。$k$ 增大时，曲线右移并变宽，方差为 $2k$。",
  ],
  (rng) => {
    const k = rng.int(4, 12);
    const f = chiSquare(k);
    const svg = chart([0, 26], [0, f(k - 2) * 1.2], intTicks(0, 26, 2), [], (x, y) => curvePath(f, 0.01, 26, x, y));
    const peak = k - 2;
    const kind = rng.pick(["freedom", "mean", "variance"] as const);
    const answer = kind === "variance" ? 2 * k : k;
    const asked: [string, string] =
      kind === "freedom"
        ? ["How many degrees of freedom does it have?", "它的自由度是多少？"]
        : kind === "mean"
          ? ["What is its mean?", "它的均值是多少？"]
          : ["What is its variance?", "它的方差是多少？"];
    return ask(
      [
        `The graph shows a chi-square density, whose peak stands at a whole number. ${asked[0]}`,
        `图中是一个卡方密度，峰值位于横轴的某个整数处。${asked[1]}`,
      ],
      answer,
      kind === "variance" ? [k, 2 * peak, k + 2] : [peak, k - 1, k + 1, k + 2],
      [
        `The peak is at $x = ${peak}$, and the peak of a chi-square density stands at $k - 2$, so $k = ${k}$.${kind === "variance" ? ` The variance is $2k = ${answer}$.` : kind === "mean" ? ` The mean equals $k$.` : ""}`,
        `峰值在 $x = ${peak}$，而卡方密度的峰值位于 $k - 2$，所以 $k = ${k}$。${kind === "variance" ? `方差为 $2k = ${answer}$。` : kind === "mean" ? "均值等于 $k$。" : ""}`,
      ],
      {
        svg,
        alt: t(`A right-skewed chi-square density with its peak at x = ${peak}.`, `右偏的卡方密度，峰值在 x = ${peak}。`),
      },
    );
  },
);

/** student is the density of Student's t distribution with df degrees of freedom. */
const student = (df: number) => {
  const c = Math.exp(logGamma((df + 1) / 2) - logGamma(df / 2)) / Math.sqrt(df * Math.PI);
  return (v: number) => c * (1 + (v * v) / df) ** (-(df + 1) / 2);
};

const tTails = point(
  "telling-t-from-the-normal-by-its-tails",
  ["Telling t from the normal by its tails", "由尾部区分 t 分布和正态分布"],
  [
    "Student's $t$ distribution is centered at zero like the standard normal, but it has a lower peak and heavier tails, since the unknown $\\sigma$ adds uncertainty. As the degrees of freedom grow, it approaches the normal curve.",
    "学生 $t$ 分布与标准正态分布一样以零为中心，但峰值更低、尾部更厚，因为未知的 $\\sigma$ 增加了不确定性。自由度增大时，它趋近于正态曲线。",
  ],
  (rng) => {
    const against = rng.bool();
    const [low, high] = against
      ? [rng.int(1, 5), 0]
      : rng.pick<[number, number]>([
          [1, 3],
          [1, 5],
          [1, 10],
          [2, 5],
          [2, 10],
          [3, 10],
          [1, 30],
          [2, 30],
        ]);
    const heavyIsA = rng.bool();
    const heavy = student(low);
    const light = high === 0 ? normal(0, 1) : student(high);
    const [fa, fb] = heavyIsA ? [heavy, light] : [light, heavy];
    const svg = chart([-4, 4], [0, 0.46], intTicks(-4, 4), [], (x, y) => {
      const [ax, bx] = [0.5, -0.5];
      return (
        curvePath(fa, -4, 4, x, y) +
        curvePath(fb, -4, 4, x, y, 'stroke="currentColor" stroke-dasharray="5 4"') +
        label(x(ax) + 8, y(fa(ax)) - 4, "A", 'font-size="13"') +
        label(x(bx) - 18, y(fb(bx)) - 4, "B", 'font-size="13"')
      );
    });
    const right: [string, string] = heavyIsA ? ["Curve $A$", "曲线 $A$"] : ["Curve $B$", "曲线 $B$"];
    const wrong: [string, string] = heavyIsA ? ["Curve $B$", "曲线 $B$"] : ["Curve $A$", "曲线 $A$"];
    return choose(
      rng,
      high === 0
        ? [
            "One curve is the standard normal density and the other is a $t$ density. Which curve is the $t$ density?",
            "一条曲线是标准正态密度，另一条是 $t$ 密度。哪条是 $t$ 密度？",
          ]
        : [
            `The curves are the $t$ densities with $${low}$ and $${high}$ degrees of freedom. Which curve has $${low}$ degrees of freedom?`,
            `两条曲线是自由度为 $${low}$ 和 $${high}$ 的 $t$ 密度。哪条曲线的自由度是 $${low}$？`,
          ],
      right,
      [
        wrong,
        ["Either: the tails of the two curves are the same", "都可以：两条曲线的尾部相同"],
        ["Neither: a $t$ density has lighter tails than both", "都不是：$t$ 密度的尾部比两条曲线都薄"],
      ],
      [
        `Fewer degrees of freedom give a lower peak and heavier tails, which is curve $${heavyIsA ? "A" : "B"}$.`,
        `自由度越小，峰值越低、尾部越厚，也就是曲线 $${heavyIsA ? "A" : "B"}$。`,
      ],
      {
        svg,
        alt: t(
          `Two bell curves centered at zero, one solid and labeled A, one dashed and labeled B. Curve ${heavyIsA ? "A" : "B"} has the lower peak and heavier tails.`,
          `两条以零为中心的钟形曲线，实线标 A，虚线标 B。曲线 ${heavyIsA ? "A" : "B"} 峰值更低、尾部更厚。`,
        ),
      },
    );
  },
);

/** lattice draws a joint distribution as probabilities at the points of a grid. */
const lattice = (cells: readonly (readonly number[])[], denominator: number) =>
  chart(
    [0.3, (cells[0] as readonly number[]).length + 0.7],
    [0.3, cells.length + 0.7],
    (cells[0] as readonly number[]).map((_, i) => [i + 1, String(i + 1)] as [number, string]),
    cells.map((_, j) => [j + 1, String(j + 1)] as [number, string]),
    (x, y) =>
      cells
        .map((row, j) =>
          row
            .map(
              (v, i) =>
                `<circle class="accent" cx="${x(i + 1)}" cy="${y(j + 1)}" r="3" fill="currentColor" stroke="none"/>${label(x(i + 1) + 6, y(j + 1) - 6, `${v}/${denominator}`, 'font-size="12"')}`,
            )
            .join(""),
        )
        .join(""),
  );

/** jointCells builds a three by three joint distribution whose entries add to the denominator. */
function jointCells(rng: Rng): { cells: number[][]; denominator: number } {
  const cells = [0, 1, 2].map(() => [0, 1, 2].map(() => rng.int(1, 4)));
  const denominator = cells.flat().reduce((a, b) => a + b, 0);
  return { cells, denominator };
}

/** jointAlt describes a lattice in words. */
const jointAlt = (cells: readonly (readonly number[])[], denominator: number) =>
  t(
    `Probabilities at the grid points, with x and y from 1 to 3. ${cells.map((row, j) => `At y = ${j + 1}: ${row.map((v) => `${v}/${denominator}`).join(", ")}.`).join(" ")}`,
    `网格点上的概率，x、y 都从 1 到 3。${cells.map((row, j) => `y = ${j + 1} 时：${row.map((v) => `${v}/${denominator}`).join("、")}。`).join("")}`,
  );

const jointEvent = point(
  "an-event-on-a-grid-of-probabilities",
  ["An event on a grid of probabilities", "概率网格上的事件"],
  [
    "A joint distribution can be drawn as a probability at each point $(x, y)$. An event such as $X + Y \\le 3$ picks out a set of grid points, and its probability is the sum of the numbers at those points.",
    "联合分布可以画成每个点 $(x, y)$ 上的概率。像 $X + Y \\le 3$ 这样的事件选出一组网格点，它的概率就是这些点上的数之和。",
  ],
  (rng) => {
    const { cells, denominator } = jointCells(rng);
    const s = rng.int(3, 5);
    let sum = 0;
    cells.forEach((row, j) => {
      row.forEach((v, i) => {
        if (i + j + 2 <= s) sum += v;
      });
    });
    let strict = 0;
    cells.forEach((row, j) => {
      row.forEach((v, i) => {
        if (i + j + 2 < s) strict += v;
      });
    });
    return ask(
      [
        `The figure shows the joint distribution of $X$ and $Y$. Find $P(X + Y \\le ${s})$.`,
        `图中是 $X$ 和 $Y$ 的联合分布。求 $P(X + Y \\le ${s})$。`,
      ],
      Q.of(sum, denominator),
      [Q.of(strict, denominator), Q.of(denominator - sum, denominator), Q.of(sum, 9)],
      [
        `Add the probabilities at the points with $x + y \\le ${s}$, which come to $\\frac{${sum}}{${denominator}}$.`,
        `把满足 $x + y \\le ${s}$ 的点上的概率相加，得 $\\frac{${sum}}{${denominator}}$。`,
      ],
      { svg: lattice(cells, denominator), alt: jointAlt(cells, denominator) },
    );
  },
);

const jointMarginal = point(
  "a-marginal-from-a-grid-of-probabilities",
  ["A marginal from a grid of probabilities", "由概率网格求边缘分布"],
  [
    "On a grid of joint probabilities, the marginal $P(X = x)$ adds the numbers in the column above $x$, and $P(Y = y)$ adds the numbers in the row beside $y$.",
    "在联合概率网格上，边缘概率 $P(X = x)$ 是 $x$ 上方那一列的数之和，$P(Y = y)$ 是 $y$ 旁边那一行的数之和。",
  ],
  (rng) => {
    const { cells, denominator } = jointCells(rng);
    const useX = rng.bool();
    const v = rng.int(1, 3);
    const column = cells.reduce((a, row) => a + (row[v - 1] as number), 0);
    const row = (cells[v - 1] as number[]).reduce((a, b) => a + b, 0);
    const [answer, other] = useX ? [column, row] : [row, column];
    return ask(
      [
        `The figure shows the joint distribution of $X$ and $Y$. Find $P(${useX ? "X" : "Y"} = ${v})$.`,
        `图中是 $X$ 和 $Y$ 的联合分布。求 $P(${useX ? "X" : "Y"} = ${v})$。`,
      ],
      Q.of(answer, denominator),
      [Q.of(other, denominator), Q.of((cells[v - 1] as number[])[v - 1] as number, denominator), Q.of(answer, 9)],
      [
        `Add the numbers in the ${useX ? `column at $x = ${v}$` : `row at $y = ${v}$`}, which come to $\\frac{${answer}}{${denominator}}$.`,
        `把 ${useX ? `$x = ${v}$ 那一列` : `$y = ${v}$ 那一行`} 的数相加，得 $\\frac{${answer}}{${denominator}}$。`,
      ],
      { svg: lattice(cells, denominator), alt: jointAlt(cells, denominator) },
    );
  },
);

const jointConditional = point(
  "a-conditional-from-a-grid-of-probabilities",
  ["A conditional from a grid of probabilities", "由概率网格求条件概率"],
  [
    "Conditioning on $X = x$ keeps only the column above $x$. The numbers there do not add to one, so divide each by their sum: $P(Y = y \\mid X = x) = \\frac{P(X = x, Y = y)}{P(X = x)}$.",
    "以 $X = x$ 为条件时，只保留 $x$ 上方那一列。这些数之和不为一，所以每个都除以它们的和：$P(Y = y \\mid X = x) = \\frac{P(X = x, Y = y)}{P(X = x)}$。",
  ],
  (rng) => {
    const { cells, denominator } = jointCells(rng);
    const x = rng.int(1, 3);
    const y = rng.int(1, 3);
    const cell = (cells[y - 1] as number[])[x - 1] as number;
    const column = cells.reduce((a, row) => a + (row[x - 1] as number), 0);
    const row = (cells[y - 1] as number[]).reduce((a, b) => a + b, 0);
    return ask(
      [
        `The figure shows the joint distribution of $X$ and $Y$. Find $P(Y = ${y} \\mid X = ${x})$.`,
        `图中是 $X$ 和 $Y$ 的联合分布。求 $P(Y = ${y} \\mid X = ${x})$。`,
      ],
      Q.of(cell, column),
      [Q.of(cell, denominator), Q.of(cell, row), Q.of(column, denominator)],
      [
        `The column at $x = ${x}$ adds to $\\frac{${column}}{${denominator}}$, and the point $(${x}, ${y})$ holds $\\frac{${cell}}{${denominator}}$. Their ratio is $\\frac{${cell}}{${column}}$.`,
        `$x = ${x}$ 这一列之和为 $\\frac{${column}}{${denominator}}$，点 $(${x}, ${y})$ 上是 $\\frac{${cell}}{${denominator}}$。两者之比为 $\\frac{${cell}}{${column}}$。`,
      ],
      { svg: lattice(cells, denominator), alt: jointAlt(cells, denominator) },
    );
  },
);

/** support draws a shaded polygon in the plane, for the support of a joint density. */
const support = (size: number, corners: readonly (readonly [number, number])[]) =>
  chart(
    [0, size + 1],
    [0, size + 1],
    intTicks(0, size + 1),
    intTicks(0, size + 1),
    (x, y) =>
      `<polygon class="accent" fill="currentColor" fill-opacity="0.25" stroke="currentColor" points="${corners.map(([u, v]) => `${x(u)},${y(v)}`).join(" ")}"/>`,
  );

const triangleMarginal = point(
  "a-marginal-density-on-a-triangle",
  ["A marginal density on a triangle", "三角形上的边缘密度"],
  [
    "A uniform joint density on a region has height one over the area. The marginal density at $x$ is that height times the length of the vertical slice through the region at $x$, so on a triangle the marginal changes linearly, even though the joint density is constant.",
    "区域上的均匀联合密度，高度是面积的倒数。$x$ 处的边缘密度等于这个高度乘以区域在 $x$ 处竖直截线的长度，所以在三角形上，尽管联合密度是常数，边缘密度却线性变化。",
  ],
  (rng) => {
    const a = rng.int(2, 7);
    const c = rng.int(1, a - 1);
    const area = Q.of(a * a, 2);
    const useX = rng.bool();
    const length = useX ? c : a - c;
    const answer = Q.of(2 * length, a * a);
    return ask(
      [
        `$(X, Y)$ is uniformly distributed on the shaded triangle. Find the marginal density $f_${useX ? "X" : "Y"}(${c})$.`,
        `$(X, Y)$ 在阴影三角形上均匀分布。求边缘密度 $f_${useX ? "X" : "Y"}(${c})$。`,
      ],
      answer,
      [Q.of(2, a * a), Q.of(c, a), Q.of(2 * (a - length), a * a), Q.of(length, a * a)],
      useX
        ? [
            `The area is $${area.toLatex()}$, so the joint density is $\\frac{2}{${a * a}}$. The vertical slice at $x = ${c}$ runs from $y = 0$ to $y = ${c}$, of length $${c}$, which gives $${answer.toLatex()}$.`,
            `面积为 $${area.toLatex()}$，所以联合密度为 $\\frac{2}{${a * a}}$。$x = ${c}$ 处的竖直截线从 $y = 0$ 到 $y = ${c}$，长度为 $${c}$，于是得 $${answer.toLatex()}$。`,
          ]
        : [
            `The area is $${area.toLatex()}$, so the joint density is $\\frac{2}{${a * a}}$. The horizontal slice at $y = ${c}$ runs from $x = ${c}$ to $x = ${a}$, of length $${a - c}$, which gives $${answer.toLatex()}$.`,
            `面积为 $${area.toLatex()}$，所以联合密度为 $\\frac{2}{${a * a}}$。$y = ${c}$ 处的水平截线从 $x = ${c}$ 到 $x = ${a}$，长度为 $${a - c}$，于是得 $${answer.toLatex()}$。`,
          ],
      {
        svg: support(a, [
          [0, 0],
          [a, 0],
          [a, a],
        ]),
        alt: t(
          `A shaded triangle with corners (0, 0), (${a}, 0) and (${a}, ${a}).`,
          `阴影三角形，顶点为 (0, 0)、(${a}, 0) 和 (${a}, ${a})。`,
        ),
      },
    );
  },
);

const supportIndependence = point(
  "independence-from-the-shape-of-the-support",
  ["Independence from the shape of the support", "由支撑集的形状判断独立性"],
  [
    "If $X$ and $Y$ are independent, then the set where the joint density is positive is a product: every $x$ the variable $X$ can take pairs with every $y$ the variable $Y$ can take. So independent variables have a rectangular support with sides along the axes, and a triangle or a tilted shape rules independence out at a glance.",
    "若 $X$ 和 $Y$ 独立，则联合密度为正的集合是一个乘积：$X$ 能取的每个 $x$ 都能与 $Y$ 能取的每个 $y$ 配对。所以独立变量的支撑集是边与坐标轴平行的矩形；三角形或倾斜的形状一眼就能排除独立性。",
  ],
  (rng) => {
    const a = rng.int(2, 5);
    const b = rng.int(2, 5);
    const shape = rng.pick(["rectangle", "triangle", "diamond"] as const);
    const corners: (readonly [number, number])[] =
      shape === "rectangle"
        ? [
            [0, 0],
            [a, 0],
            [a, b],
            [0, b],
          ]
        : shape === "triangle"
          ? [
              [0, 0],
              [a, 0],
              [0, b],
            ]
          : [
              [a / 2, 0],
              [a, b / 2],
              [a / 2, b],
              [0, b / 2],
            ];
    const can = shape === "rectangle";
    const yes: [string, string] = [
      "Possibly independent: the support is a rectangle along the axes.",
      "可能独立：支撑集是沿坐标轴的矩形。",
    ];
    const no: [string, string] = ["Not independent: the possible $y$ values change with $x$.", "不独立：$y$ 的可能取值随 $x$ 变化。"];
    return choose(
      rng,
      [
        "A joint density of $X$ and $Y$ is positive exactly on the shaded region. What does the shape say about independence?",
        "$X$ 和 $Y$ 的联合密度恰好在阴影区域上为正。这个形状说明独立性如何？",
      ],
      can ? yes : no,
      [can ? no : yes, ["Always independent: any region can be a product.", "一定独立：任何区域都可以是乘积。"]],
      [
        can
          ? "Each $x$ pairs with the same range of $y$, so the shape does not rule independence out, though the density itself must also factor."
          : "At some $x$ the slice of possible $y$ values differs from its slice at another $x$, so learning $X$ tells you something about $Y$.",
        can
          ? "每个 $x$ 都对应相同范围的 $y$，所以形状不能排除独立性，不过密度本身还必须能分解。"
          : "不同 $x$ 处 $y$ 的可能取值范围不同，知道 $X$ 就能得到关于 $Y$ 的信息。",
      ],
      {
        svg: support(5, corners),
        alt: t(
          `A shaded ${shape === "rectangle" ? "rectangle with sides along the axes" : shape === "triangle" ? "triangle" : "tilted square"} in the plane.`,
          `平面上的阴影${shape === "rectangle" ? "矩形，边与坐标轴平行" : shape === "triangle" ? "三角形" : "倾斜四边形"}。`,
        ),
      },
    );
  },
);

const jointCdfArea = point(
  "a-joint-cdf-as-a-fraction-of-a-rectangle",
  ["A joint CDF as a fraction of a rectangle", "联合分布函数作为矩形的一部分"],
  [
    "The joint CDF $F(x, y) = P(X \\le x, Y \\le y)$ collects the probability to the lower left of the point $(x, y)$. For a uniform density on a rectangle, it is the fraction of the rectangle's area lying in that corner.",
    "联合分布函数 $F(x, y) = P(X \\le x, Y \\le y)$ 收集点 $(x, y)$ 左下方的概率。对矩形上的均匀密度，它等于这个角落占矩形面积的比例。",
  ],
  (rng) => {
    const a = rng.int(3, 6);
    const b = rng.int(3, 6);
    const u = rng.int(1, a - 1);
    const v = rng.int(1, b - 1);
    const svg = chart([0, 7], [0, 7], intTicks(0, 7), intTicks(0, 7), (x, y) => {
      const rect = (w: number, h: number, extra: string) =>
        `<rect x="${x(0)}" y="${y(h)}" width="${x(w) - x(0)}" height="${y(0) - y(h)}" ${extra}/>`;
      return `${rect(a, b, 'stroke="currentColor"')}${rect(u, v, 'class="accent" fill="currentColor" fill-opacity="0.3" stroke="currentColor"')}`;
    });
    const answer = Q.of(u * v, a * b);
    return ask(
      [
        `$(X, Y)$ is uniform on the large rectangle. Find $F(${u}, ${v}) = P(X \\le ${u}, Y \\le ${v})$, the shaded part.`,
        `$(X, Y)$ 在大矩形上均匀分布。求阴影部分对应的 $F(${u}, ${v}) = P(X \\le ${u}, Y \\le ${v})$。`,
      ],
      answer,
      [Q.of(u + v, a + b), Q.of(u * v, 49), Q.of(u, a)],
      [
        `The shaded corner has area $${u} \\cdot ${v} = ${u * v}$ and the rectangle has area $${a} \\cdot ${b} = ${a * b}$, so the probability is $${answer.toLatex()}$.`,
        `阴影角落的面积为 $${u} \\cdot ${v} = ${u * v}$，矩形面积为 $${a} \\cdot ${b} = ${a * b}$，所以概率为 $${answer.toLatex()}$。`,
      ],
      {
        svg,
        alt: t(
          `A rectangle from (0, 0) to (${a}, ${b}), with the corner from (0, 0) to (${u}, ${v}) shaded.`,
          `从 (0, 0) 到 (${a}, ${b}) 的矩形，其中从 (0, 0) 到 (${u}, ${v}) 的角落为阴影。`,
        ),
      },
    );
  },
);

/** intervalLine draws an interval above a number line. */
const intervalLine = (from: number, to: number, low: number, high: number) =>
  chart([from, to], [0, 2], intTicks(from, to, Math.ceil((to - from) / 10)), [], (x, y) => {
    const h = y(0.8);
    return `<line class="accent" stroke="currentColor" stroke-width="3" x1="${x(low)}" x2="${x(high)}" y1="${h}" y2="${h}"/><line class="accent" stroke="currentColor" x1="${x(low)}" x2="${x(low)}" y1="${h - 8}" y2="${h + 8}"/><line class="accent" stroke="currentColor" x1="${x(high)}" x2="${x(high)}" y1="${h - 8}" y2="${h + 8}"/>`;
  });

const intervalParts = point(
  "the-estimate-and-margin-from-a-drawn-interval",
  ["The estimate and margin from a drawn interval", "由图中的区间读出估计值和误差范围"],
  [
    "A confidence interval for a mean is centered on the sample mean, with the margin of error on each side. So the estimate is the midpoint of the drawn interval, and the margin is half its length.",
    "均值的置信区间以样本均值为中心，两侧各有一个误差范围。所以估计值是图中区间的中点，误差范围是其长度的一半。",
  ],
  (rng) => {
    const center = rng.int(14, 26);
    const margin = rng.int(1, 6);
    const low = center - margin;
    const high = center + margin;
    const wantMargin = rng.bool();
    return ask(
      [
        `The figure shows a confidence interval for a population mean. What is ${wantMargin ? "the margin of error" : "the sample mean"}?`,
        `图中是总体均值的一个置信区间。${wantMargin ? "误差范围" : "样本均值"}是多少？`,
      ],
      wantMargin ? margin : center,
      wantMargin ? [2 * margin, center, high] : [low, high, 2 * margin],
      [
        `The interval runs from $${low}$ to $${high}$. ${wantMargin ? `The margin is half its length, $\\frac{${high} - ${low}}{2} = ${margin}$.` : `The sample mean is its midpoint, $\\frac{${low} + ${high}}{2} = ${center}$.`}`,
        `区间从 $${low}$ 到 $${high}$。${wantMargin ? `误差范围是长度的一半，$\\frac{${high} - ${low}}{2} = ${margin}$。` : `样本均值是它的中点，$\\frac{${low} + ${high}}{2} = ${center}$。`}`,
      ],
      {
        svg: intervalLine(10, 30, low, high),
        alt: t(`An interval on a number line from ${low} to ${high}.`, `数轴上从 ${low} 到 ${high} 的区间。`),
      },
    );
  },
);

const intervalDecision = point(
  "a-test-decision-from-a-drawn-interval",
  ["A test decision from a drawn interval", "由图中的区间作检验判断"],
  [
    "A $95\\%$ confidence interval and a two-sided test at the $5\\%$ level agree: the test rejects $H_0: \\mu = \\mu_0$ exactly when $\\mu_0$ lies outside the interval.",
    "$95\\%$ 置信区间与 $5\\%$ 水平的双侧检验结论一致：当且仅当 $\\mu_0$ 落在区间之外时，检验拒绝 $H_0: \\mu = \\mu_0$。",
  ],
  (rng) => {
    const center = rng.int(16, 24);
    const margin = rng.int(2, 4);
    const inside = rng.bool();
    const mu0 = inside ? center + rng.int(-margin + 1, margin - 1) : center + rng.pick([-1, 1]) * (margin + rng.int(1, 3));
    const reject: [string, string] = ["Reject $H_0$", "拒绝 $H_0$"];
    const keep: [string, string] = ["Do not reject $H_0$", "不拒绝 $H_0$"];
    return choose(
      rng,
      [
        `The figure shows a $95\\%$ confidence interval for $\\mu$. What does a two-sided test of $H_0: \\mu = ${mu0}$ at the $5\\%$ level conclude?`,
        `图中是 $\\mu$ 的 $95\\%$ 置信区间。在 $5\\%$ 水平下对 $H_0: \\mu = ${mu0}$ 作双侧检验，结论是什么？`,
      ],
      inside ? keep : reject,
      [inside ? reject : keep, ["There is not enough information without the sample size.", "没有样本量就无法判断。"]],
      [
        `The interval runs from $${center - margin}$ to $${center + margin}$, and $${mu0}$ lies ${inside ? "inside" : "outside"} it.`,
        `区间从 $${center - margin}$ 到 $${center + margin}$，$${mu0}$ 落在区间${inside ? "之内" : "之外"}。`,
      ],
      {
        svg: intervalLine(10, 30, center - margin, center + margin),
        alt: t(
          `An interval on a number line from ${center - margin} to ${center + margin}.`,
          `数轴上从 ${center - margin} 到 ${center + margin} 的区间。`,
        ),
      },
    );
  },
);

/** tailChart draws a standard normal curve with its rejection region shaded. */
const tailChart = (left: number | null, right: number | null) => {
  const f = normal(0, 1);
  return chart([-4, 4], [0, 0.46], intTicks(-4, 4), [], (x, y) => {
    const a = left === null ? "" : shadeUnder(f, -4, left, x, y);
    const b = right === null ? "" : shadeUnder(f, right, 4, x, y);
    return curvePath(f, -4, 4, x, y) + a + b;
  });
};

const regionDecision = point(
  "a-decision-from-a-shaded-rejection-region",
  ["A decision from a shaded rejection region", "由阴影拒绝域作判断"],
  [
    "The critical region of a test is where the statistic must fall for $H_0$ to be rejected. On a picture of the null distribution it is the shaded tail: on the right for a right-tailed test, on the left for a left-tailed test, and on both sides for a two-tailed test.",
    "检验的拒绝域是统计量必须落入才能拒绝 $H_0$ 的区域。在零假设分布的图上，它是阴影尾部：右尾检验在右侧，左尾检验在左侧，双尾检验在两侧。",
  ],
  (rng) => {
    const c = rng.pick([1.5, 1.75, 2, 2.25, 2.5]);
    const kind = rng.pick(["right", "left"] as const);
    const inside = rng.bool();
    const size = inside ? c + rng.pick([0.25, 0.5]) : c - rng.pick([0.25, 0.5]);
    const z = kind === "right" ? (rng.bool(0.8) ? size : -size) : rng.bool(0.8) ? -size : size;
    const inRegion = kind === "right" ? z >= c : z <= -c;
    const cut = kind === "right" ? c : -c;
    const rejectIn: [string, string] = ["Reject $H_0$, since $z$ is in the critical region", "拒绝 $H_0$，因为 $z$ 在拒绝域内"];
    const rejectOut: [string, string] = ["Reject $H_0$, since $z$ is outside the critical region", "拒绝 $H_0$，因为 $z$ 在拒绝域外"];
    const keepIn: [string, string] = ["Do not reject $H_0$, since $z$ is in the critical region", "不拒绝 $H_0$，因为 $z$ 在拒绝域内"];
    const keepOut: [string, string] = [
      "Do not reject $H_0$, since $z$ is outside the critical region",
      "不拒绝 $H_0$，因为 $z$ 在拒绝域外",
    ];
    return choose(
      rng,
      [
        `The shaded part, beyond $z = ${cut}$, is the critical region of a test with statistic $Z$. The observed value is $z = ${z}$. What is the decision?`,
        `阴影部分（$z = ${cut}$ 之外）是统计量 $Z$ 的检验的拒绝域。观测值为 $z = ${z}$。结论是什么？`,
      ],
      inRegion ? rejectIn : keepOut,
      inRegion ? [keepIn, rejectOut, keepOut] : [rejectOut, keepIn, rejectIn],
      [
        `The critical region is ${kind === "right" ? `$z \\ge ${c}$` : `$z \\le ${-c}$`}, and $z = ${z}$ is ${inRegion ? "in" : "not in"} it.`,
        `拒绝域为 ${kind === "right" ? `$z \\ge ${c}$` : `$z \\le ${-c}$`}，$z = ${z}$ ${inRegion ? "在" : "不在"}其中。`,
      ],
      {
        svg: kind === "right" ? tailChart(null, c) : tailChart(-c, null),
        alt: t(
          `A standard normal curve with the ${kind} tail shaded beyond z = ${cut}.`,
          `标准正态曲线，${kind === "right" ? "右" : "左"}尾在 z = ${cut} 之外为阴影。`,
        ),
      },
    );
  },
);

const twoTailDecision = point(
  "the-level-of-a-shaded-two-tailed-region",
  ["The level of a shaded two-tailed region", "阴影双尾区域的显著性水平"],
  [
    "The level of a test is the total shaded area under the null distribution. A two-tailed test shares it between the tails, so each tail holds $\\frac{\\alpha}{2}$. If one tail of a drawn region has area $0.025$, the level is $0.05$.",
    "检验的显著性水平是零假设分布下阴影的总面积。双尾检验把它分给两侧，每个尾部占 $\\frac{\\alpha}{2}$。如果图中一个尾部的面积是 $0.025$，水平就是 $0.05$。",
  ],
  (rng) => {
    const [cut, thousandths] = rng.pick<[number, number]>([
      [1.282, 100],
      [1.44, 75],
      [1.645, 50],
      [1.751, 40],
      [1.881, 30],
      [1.96, 25],
      [2.054, 20],
      [2.326, 10],
      [2.576, 5],
      [3.09, 1],
    ]);
    const svg = tailChart(-cut, cut);
    const tail = thousandths / 1000;
    const alpha = (2 * thousandths) / 1000;
    const kind = rng.pick(["level", "middle", "tail"] as const);
    const figure = {
      svg,
      alt: t(`A standard normal curve with both tails shaded beyond z = ±${cut}.`, `标准正态曲线，两侧在 z = ±${cut} 之外为阴影。`),
    };
    if (kind === "tail")
      return ask(
        [
          `The shaded tails beyond $z = \\pm ${cut}$ form the critical region of a two-tailed test at level $\\alpha = ${alpha}$. What is the area of the left tail?`,
          `$z = \\pm ${cut}$ 之外的阴影尾部构成水平 $\\alpha = ${alpha}$ 的双尾检验的拒绝域。左尾面积是多少？`,
        ],
        Q.of(thousandths, 1000),
        [Q.of(2 * thousandths, 1000), Q.of(4 * thousandths, 1000), Q.of(1000 - thousandths, 1000)],
        [
          `The two tails are equal and together have area $\\alpha$, so each has area $\\frac{${alpha}}{2} = ${tail}$.`,
          `两个尾部相等，合起来面积为 $\\alpha$，所以每个面积为 $\\frac{${alpha}}{2} = ${tail}$。`,
        ],
        figure,
      );
    const middle = kind === "middle";
    return ask(
      [
        `The shaded tails beyond $z = \\pm ${cut}$ form the critical region of a two-tailed test, and the area of the right tail is $${tail}$. What is ${middle ? "the unshaded area between the tails" : "the level $\\alpha$ of the test"}?`,
        `$z = \\pm ${cut}$ 之外的阴影尾部构成双尾检验的拒绝域，右尾面积为 $${tail}$。${middle ? "两尾之间未加阴影部分的面积" : "检验的水平 $\\alpha$"}是多少？`,
      ],
      Q.of(middle ? 1000 - 2 * thousandths : 2 * thousandths, 1000),
      [Q.of(thousandths, 1000), Q.of(1000 - thousandths, 1000), Q.of(middle ? 2 * thousandths : 1000 - 2 * thousandths, 1000)],
      [
        `The two tails are equal, so the shaded area is $\\alpha = 2(${tail}) = ${alpha}$.${middle ? ` The whole area under the curve is one, which leaves $1 - ${alpha}$ between the tails.` : ""}`,
        `两个尾部相等，所以阴影面积为 $\\alpha = 2(${tail}) = ${alpha}$。${middle ? `曲线下总面积为一，两尾之间剩下 $1 - ${alpha}$。` : ""}`,
      ],
      figure,
    );
  },
);

const likelihoodPeak = point(
  "successes-from-the-peak-of-a-likelihood",
  ["Successes from the peak of a likelihood", "由似然函数的峰值求成功次数"],
  [
    "For $k$ successes in $n$ Bernoulli trials, the likelihood $L(p) = p^{k}(1 - p)^{n - k}$ peaks at the maximum likelihood estimate $\\hat{p} = \\frac{k}{n}$. So a graph of $L$ reveals the data: the position of the peak times $n$ is the number of successes.",
    "$n$ 次伯努利试验中成功 $k$ 次时，似然函数 $L(p) = p^{k}(1 - p)^{n - k}$ 在最大似然估计 $\\hat{p} = \\frac{k}{n}$ 处达到峰值。所以 $L$ 的图能反映数据：峰值位置乘以 $n$ 就是成功次数。",
  ],
  (rng) => {
    const n = rng.pick([10, 20, 30]);
    const tenths = rng.int(1, 9);
    const k = (tenths * n) / 10;
    const f = (p: number) => Math.exp(k * Math.log(p || 1e-12) + (n - k) * Math.log(1 - p || 1e-12));
    const top = f(tenths / 10);
    const svg = chart([0, 1], [0, top * 1.2], tenthTicks(0, 10), [], (x, y) => curvePath(f, 0.001, 0.999, x, y));
    return ask(
      [
        `The graph shows the likelihood $L(p)$ from $${n}$ independent trials. How many successes were observed?`,
        `图中是 $${n}$ 次独立试验的似然函数 $L(p)$。观测到了多少次成功？`,
      ],
      k,
      [n - k, k + 1, tenths],
      [
        `The peak is at $\\hat{p} = ${tenths / 10}$, and $\\hat{p} = \\frac{k}{${n}}$, so $k = ${k}$.`,
        `峰值在 $\\hat{p} = ${tenths / 10}$，而 $\\hat{p} = \\frac{k}{${n}}$，所以 $k = ${k}$。`,
      ],
      {
        svg,
        alt: t(
          `A single-peaked likelihood curve on p from 0 to 1 with its peak at ${tenths / 10}.`,
          `p 从 0 到 1 的单峰似然曲线，峰值在 ${tenths / 10}。`,
        ),
      },
    );
  },
);

const continuityCorrection = point(
  "the-cut-of-a-continuity-correction",
  ["The cut of a continuity correction", "连续性修正的分界"],
  [
    "When a normal curve approximates a binomial, each bar for $k$ covers the interval from $k - 0.5$ to $k + 0.5$. So $P(X \\le k)$ becomes the area left of $k + 0.5$, which includes the whole bar at $k$, and $P(X \\ge k)$ becomes the area right of $k - 0.5$.",
    "用正态曲线近似二项分布时，$k$ 处的条形覆盖从 $k - 0.5$ 到 $k + 0.5$ 的区间。所以 $P(X \\le k)$ 变成 $k + 0.5$ 左侧的面积，包含 $k$ 处的整根条形；$P(X \\ge k)$ 变成 $k - 0.5$ 右侧的面积。",
  ],
  (rng) => {
    const n = 20;
    const k = rng.int(7, 13);
    const atMost = rng.bool();
    const strict = rng.bool();
    const pmf = Array.from({ length: n + 1 }, (_, i) => binom(n, i) / 2 ** n);
    const cut = atMost ? (strict ? k - 0.5 : k + 0.5) : strict ? k + 0.5 : k - 0.5;
    const f = normal(10, Math.sqrt(5));
    const svg = chart([3, 17], [0, 0.22], intTicks(3, 17), [], (x, y) => pmfBars(3, pmf.slice(3, 18), x, y) + curvePath(f, 3, 17, x, y));
    const sign = atMost ? (strict ? "<" : "\\le") : strict ? ">" : "\\ge";
    const side: [string, string] = atMost ? ["left", "左"] : ["right", "右"];
    const opposite = 2 * k - cut;
    return ask(
      [
        `A normal curve approximates the bars of $X \\sim B(20, 0.5)$. With a continuity correction, $P(X ${sign} ${k})$ is the area to the ${side[0]} of which value?`,
        `正态曲线近似 $X \\sim B(20, 0.5)$ 的条形。使用连续性修正时，$P(X ${sign} ${k})$ 是哪个值${side[1]}侧的面积？`,
      ],
      Q.of(2 * cut, 2),
      [Q.of(2 * opposite, 2), k],
      [
        `Each bar spans half a unit either side of its value. ${strict ? `The bar at $${k}$ is excluded` : `The bar at $${k}$ is included`}, so the cut is at $${cut}$.`,
        `每根条形在其取值两侧各占半个单位。${strict ? `$${k}$ 处的条形不包含在内` : `$${k}$ 处的条形包含在内`}，所以分界在 $${cut}$。`,
      ],
      {
        svg,
        alt: t(
          "Bars of the binomial distribution with n = 20 and p = 0.5, from 3 to 17, with a normal curve drawn over them. Each bar is one unit wide around its value.",
          "n = 20、p = 0.5 的二项分布条形（3 到 17），上面画有一条正态曲线。每根条形以取值为中心，宽一个单位。",
        ),
      },
    );
  },
);

const sampleMeanSpread = point(
  "the-sample-size-from-two-sampling-curves",
  ["The sample size from two sampling curves", "由两条抽样分布曲线求样本量"],
  [
    "The sample mean has standard error $\\frac{\\sigma}{\\sqrt{n}}$, and a normal curve bends at one standard deviation from its center. So the bends of a sampling curve show the standard error directly, and comparing it with $\\sigma$ gives $n = \\left(\\frac{\\sigma}{\\mathrm{SE}}\\right)^{2}$.",
    "样本均值的标准误是 $\\frac{\\sigma}{\\sqrt{n}}$，而正态曲线在距中心一个标准差处拐弯。所以抽样分布曲线的拐点直接显示标准误，与 $\\sigma$ 比较可得 $n = \\left(\\frac{\\sigma}{\\mathrm{SE}}\\right)^{2}$。",
  ],
  (rng) => {
    const se = rng.int(1, 3);
    const root = rng.int(2, 6);
    const sigma = se * root;
    const n = root * root;
    const f = normal(0, se);
    const span = 3 * se + 1;
    const svg = chart([-span, span], [0, f(0) * 1.2], intTicks(-span, span), [], (x, y) => {
      const mark = (v: number) =>
        `<line class="accent" stroke="currentColor" stroke-dasharray="4 3" x1="${x(v)}" x2="${x(v)}" y1="${y(0)}" y2="${y(f(v))}"/>`;
      return curvePath(f, -span, span, x, y) + mark(-se) + mark(se);
    });
    const figure = {
      svg,
      alt: t(
        `A bell curve centered at 0 with dashed lines at its inflection points, x = −${se} and x = ${se}.`,
        `以 0 为中心的钟形曲线，虚线位于拐点 x = −${se} 和 x = ${se}。`,
      ),
    };
    if (rng.bool())
      return ask(
        [
          `A population has standard deviation $\\sigma = ${sigma}$. The curve is the sampling distribution of the deviation of the sample mean from $\\mu$, and dashed lines mark its inflection points. What is the sample size?`,
          `总体标准差 $\\sigma = ${sigma}$。曲线是样本均值与 $\\mu$ 之差的抽样分布，虚线标出它的拐点。样本量是多少？`,
        ],
        n,
        [root, sigma, n + 1, sigma * sigma],
        [
          `The inflection points are at $\\pm ${se}$, so the standard error is $${se}$. Then $\\sqrt{n} = \\frac{${sigma}}{${se}} = ${root}$, and $n = ${n}$.`,
          `拐点在 $\\pm ${se}$，所以标准误是 $${se}$。于是 $\\sqrt{n} = \\frac{${sigma}}{${se}} = ${root}$，$n = ${n}$。`,
        ],
        figure,
      );
    return ask(
      [
        `A sample of size $n = ${n}$ is taken. The curve is the sampling distribution of the deviation of the sample mean from $\\mu$, and dashed lines mark its inflection points. What is the population standard deviation $\\sigma$?`,
        `抽取样本量 $n = ${n}$ 的样本。曲线是样本均值与 $\\mu$ 之差的抽样分布，虚线标出它的拐点。总体标准差 $\\sigma$ 是多少？`,
      ],
      sigma,
      [se, n * se, root, se + root],
      [
        `The inflection points are at $\\pm ${se}$, so the standard error is $${se}$. Since it equals $\\frac{\\sigma}{\\sqrt{${n}}}$, we get $\\sigma = ${se} \\cdot ${root} = ${sigma}$.`,
        `拐点在 $\\pm ${se}$，所以标准误是 $${se}$。它等于 $\\frac{\\sigma}{\\sqrt{${n}}}$，于是 $\\sigma = ${se} \\cdot ${root} = ${sigma}$。`,
      ],
      figure,
    );
  },
);

/** gammaDensity is the gamma density with whole-number shape and rate one. */
const gammaDensity = (shape: number) => (v: number) => (v <= 0 ? 0 : Math.exp((shape - 1) * Math.log(v) - v - logGamma(shape)));

const gammaPeak = point(
  "the-shape-from-the-peak-of-a-gamma-curve",
  ["The shape from the peak of a gamma curve", "由伽马曲线的峰值求形状参数"],
  [
    "A gamma density with shape $\\alpha > 1$ and rate $\\lambda$ peaks at $x = \\frac{\\alpha - 1}{\\lambda}$, and its mean is $\\frac{\\alpha}{\\lambda}$. So the mean lies a distance $\\frac{1}{\\lambda}$ to the right of the peak.",
    "形状参数 $\\alpha > 1$、率参数 $\\lambda$ 的伽马密度在 $x = \\frac{\\alpha - 1}{\\lambda}$ 处达到峰值，均值为 $\\frac{\\alpha}{\\lambda}$。所以均值在峰值右边 $\\frac{1}{\\lambda}$ 处。",
  ],
  (rng) => {
    const shape = rng.int(2, 7);
    const rate = rng.int(1, 2);
    const base = gammaDensity(shape);
    const f = (v: number) => rate * base(rate * v);
    const peak = (shape - 1) / rate;
    const span = rate === 1 ? 14 : 7;
    const svg = chart([0, span], [0, f(peak) * 1.2], intTicks(0, span), [], (x, y) => curvePath(f, 0.01, span, x, y));
    const kind = rng.pick(["shape", "mean", "variance"] as const);
    const answer = kind === "shape" ? Q.of(shape, 1) : kind === "mean" ? Q.of(shape, rate) : Q.of(shape, rate * rate);
    const asked: [string, string] =
      kind === "shape" ? ["the shape $\\alpha$", "形状参数 $\\alpha$"] : kind === "mean" ? ["the mean", "均值"] : ["the variance", "方差"];
    return ask(
      [
        `The graph shows a gamma density with rate $\\lambda = ${rate}$, and its peak stands at a whole or half number. Find ${asked[0]}.`,
        `图中是率参数 $\\lambda = ${rate}$ 的伽马密度，峰值位于某个整数或半整数处。求${asked[1]}。`,
      ],
      answer,
      [Q.of(shape - 1, rate), Q.of(shape + 1, rate), Q.of(2 * shape, 1), Q.of(shape, rate + 1)],
      [
        `The peak is at $x = ${peak} = \\frac{\\alpha - 1}{${rate}}$, so $\\alpha = ${shape}$. The mean is $\\frac{\\alpha}{\\lambda} = ${Q.of(shape, rate).toLatex()}$ and the variance is $\\frac{\\alpha}{\\lambda^{2}} = ${Q.of(shape, rate * rate).toLatex()}$.`,
        `峰值在 $x = ${peak} = \\frac{\\alpha - 1}{${rate}}$，所以 $\\alpha = ${shape}$。均值为 $\\frac{\\alpha}{\\lambda} = ${Q.of(shape, rate).toLatex()}$，方差为 $\\frac{\\alpha}{\\lambda^{2}} = ${Q.of(shape, rate * rate).toLatex()}$。`,
      ],
      {
        svg,
        alt: t(`A right-skewed gamma density with its peak at x = ${peak}.`, `右偏的伽马密度，峰值在 x = ${peak}。`),
      },
    );
  },
);

/** deeperFiguresProbability2CalculusPoints adds more figure knowledge points of Probability and Statistics, for topics of the calculus shard. */
export const deeperFiguresProbability2CalculusPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-binomial-distribution": [binomialTail],
  "joint-distributions-for-discrete-random-variables": [jointEvent],
};

/** deeperFiguresProbability2CollegePoints adds more figure knowledge points of Probability and Statistics, for topics of the college shard. */
export const deeperFiguresProbability2CollegePoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "mean-and-variance-of-the-binomial-distribution": [binomialShape],
  "the-poisson-distribution": [poissonRate],
  "mean-and-variance-of-the-discrete-uniform-distribution": [uniformBars],
  "mean-and-variance-of-the-bernoulli-distribution": [bernoulliBars],
  "variance-of-discrete-random-variables": [varianceFromBars],
  "expected-values-of-continuous-random-variables": [triangleMean],
  "finding-the-mode-of-a-continuous-random-variable": [modeVersusMean],
  "mean-and-variance-of-the-continuous-uniform-distribution": [uniformVariance],
  "mean-and-variance-of-the-exponential-distribution": [exponentialMean],
  "the-chi-square-distribution": [chiSquarePeak],
  "the-students-t-distribution": [tTails],
  "marginal-distributions-for-discrete-random-variables": [jointMarginal],
  "conditional-distributions-for-discrete-random-variables": [jointConditional],
  "marginal-distributions-for-continuous-random-variables": [triangleMarginal],
  "independence-of-continuous-random-variables": [supportIndependence],
  "the-joint-cdf-of-two-continuous-random-variables": [jointCdfArea],
  "confidence-intervals-for-one-mean-known-population-variance": [intervalParts],
  "two-tailed-hypothesis-tests": [intervalDecision, twoTailDecision],
  "critical-regions-for-right-tailed-hypothesis-tests": [regionDecision],
  "maximum-likelihood-estimation": [likelihoodPeak],
  "normal-approximations-of-binomial-distributions": [continuityCorrection],
  "variance-of-sample-means": [sampleMeanSpread],
  "the-gamma-distribution": [gammaPeak],
};
