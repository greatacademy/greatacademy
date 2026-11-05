// Third knowledge points for thin topics of Probability and Statistics, from sampling
// distributions to sample sizes: the reverse question, a harder case or a common trap.
// See `deeperProbabilityAndStatisticsThird2Points`.

import type { KnowledgePointDef } from "@ga/content";
import { dec, poly, Q } from "@ga/subject-math";

import { ask, choose, type Pair, point } from "../university-kit.ts";
import { askDecimal, given, nz, phi, zText } from "./deeper-probability-and-statistics-third.ts";

const combinationVariance = point(
  "the-variance-of-a-combination-from-the-covariance-matrix",
  ["The variance of a combination from the covariance matrix", "由协方差矩阵求组合的方差"],
  [
    "The sample covariance matrix $S$ gives the sample variance of every linear combination, not only of the original variables. For a combination with coefficient vector $\\mathbf{a}$, the variance is $\\mathbf{a}^{T}S\\mathbf{a}$, and the covariance term appears twice.",
    "样本协方差矩阵 $S$ 给出每个线性组合的样本方差，而不只是原变量的方差。对系数向量为 $\\mathbf{a}$ 的组合，方差是 $\\mathbf{a}^{T}S\\mathbf{a}$，其中协方差项出现两次。",
  ],
  (rng) => {
    const a = rng.int(1, 25);
    const b = rng.int(1, 25);
    const limit = Math.floor(Math.sqrt(a * b));
    const c = limit === 0 ? 0 : rng.int(-limit, limit);
    const p = nz(rng, 3);
    const q = nz(rng, 3);
    const answer = p * p * a + 2 * p * q * c + q * q * b;
    const S = `\\begin{pmatrix} ${a} & ${c} \\\\ ${c} & ${b} \\end{pmatrix}`;
    return ask(
      [
        `Data on $(x, y)$ have sample covariance matrix $S = ${S}$. Find the sample variance of $${poly([p, "x"], [q, "y"])}$.`,
        `$(x, y)$ 的样本协方差矩阵是 $S = ${S}$。求 $${poly([p, "x"], [q, "y"])}$ 的样本方差。`,
      ],
      answer,
      [p * p * a + p * q * c + q * q * b, p * a + q * b, p * p * a + q * q * b - 2 * p * q * c],
      [
        `The variance is $${p * p} \\cdot ${a} + 2(${p})(${q})(${c}) + ${q * q} \\cdot ${b} = ${answer}$, with the covariance counted twice.`,
        `方差是 $${p * p} \\cdot ${a} + 2(${p})(${q})(${c}) + ${q * q} \\cdot ${b} = ${answer}$，其中协方差计了两次。`,
      ],
    );
  },
);

const expectedMaximum = point(
  "the-sampling-distribution-of-the-maximum",
  ["The sampling distribution of the maximum", "最大值的抽样分布"],
  [
    "Any statistic has a sampling distribution, not only the mean. Listing the equally likely samples gives the distribution of the sample maximum, and its expected value lies below the population maximum, so this statistic is a biased estimator of that maximum.",
    "任何统计量都有抽样分布，不只是均值。列出等可能的样本就得到样本最大值的分布，它的期望值低于总体最大值，所以这个统计量是总体最大值的有偏估计。",
  ],
  (rng) => {
    const [a, b, c] = rng
      .sample(
        [...Array(20).keys()].map((i) => i + 1),
        3,
      )
      .slice()
      .sort((x, y) => x - y) as [number, number, number];
    const answer = Q.of(a + 3 * b + 5 * c, 9);
    return ask(
      [
        `A population consists of $${a}, ${b}, ${c}$, equally likely. Samples of size $2$ are drawn with replacement. Find the expected value of the sample maximum.`,
        `总体由等可能的 $${a}, ${b}, ${c}$ 组成。有放回地抽取容量为 $2$ 的样本。求样本最大值的期望。`,
      ],
      answer,
      [c, Q.of(a + b + c, 3), Q.of(a + 2 * b + 3 * c, 6)],
      [
        `Of the $9$ samples, $1$ has maximum $${a}$, $3$ have maximum $${b}$ and $5$ have maximum $${c}$. So the expected value is $\\frac{${a} + 3 \\cdot ${b} + 5 \\cdot ${c}}{9} = ${answer.toLatex()}$.`,
        `$9$ 个样本中，$1$ 个最大值为 $${a}$，$3$ 个最大值为 $${b}$，$5$ 个最大值为 $${c}$。所以期望是 $\\frac{${a} + 3 \\cdot ${b} + 5 \\cdot ${c}}{9} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const pooledReverse = point(
  "a-missing-sample-variance-from-the-pooled-variance",
  ["A missing sample variance from the pooled variance", "由合并方差求缺失的样本方差"],
  [
    "The pooled variance is a weighted average of the sample variances, with weights equal to the degrees of freedom. So it can be run backward: multiply it by the total degrees of freedom and subtract the part from the known sample.",
    "合并方差是各样本方差的加权平均，权重等于自由度。所以可以反过来计算：把它乘以总自由度，再减去已知样本的部分。",
  ],
  (rng) => {
    const n1 = rng.int(5, 20);
    let n2 = rng.int(5, 20);
    if (n2 === n1) n2 = n1 + 1;
    const s1 = rng.int(10, 60);
    let s2 = rng.int(10, 60);
    if (s2 === s1) s2 = s1 + 1;
    const df = n1 + n2 - 2;
    const top = (n1 - 1) * s1 + (n2 - 1) * s2;
    const pooled = Q.of(top, df);
    return ask(
      [
        `Two samples have $n_{1} = ${n1}$, $s_{1}^{2} = ${s1}$ and $n_{2} = ${n2}$. Their pooled variance is $${pooled.toLatex()}$. Find $s_{2}^{2}$.`,
        `两个样本满足 $n_{1} = ${n1}$，$s_{1}^{2} = ${s1}$，$n_{2} = ${n2}$。它们的合并方差是 $${pooled.toLatex()}$。求 $s_{2}^{2}$。`,
      ],
      s2,
      [pooled.mul(Q.of(2, 1)).sub(Q.of(s1, 1)), s1, pooled],
      [
        `The weighted total is $${df} \\cdot ${pooled.toLatex()} = ${top}$. Removing $${n1 - 1} \\cdot ${s1} = ${(n1 - 1) * s1}$ leaves $${(n2 - 1) * s2}$, and dividing by $${n2 - 1}$ gives $${s2}$.`,
        `加权总和是 $${df} \\cdot ${pooled.toLatex()} = ${top}$。减去 $${n1 - 1} \\cdot ${s1} = ${(n1 - 1) * s1}$，剩下 $${(n2 - 1) * s2}$，再除以 $${n2 - 1}$，得 $${s2}$。`,
      ],
    );
  },
);

const seScaling = point(
  "the-cost-of-shrinking-the-standard-error",
  ["The cost of shrinking the standard error", "缩小标准误的代价"],
  [
    "The standard error of the mean is $\\frac{\\sigma}{\\sqrt{n}}$, so it falls only with the square root of the sample size. Dividing it by $k$ therefore needs $k^{2}$ times as many observations, and doubling the precision costs four times the data.",
    "均值的标准误是 $\\frac{\\sigma}{\\sqrt{n}}$，所以它只随样本量的平方根下降。把它除以 $k$ 需要 $k^{2}$ 倍的观测，精度提高一倍要花四倍的数据。",
  ],
  (rng) => {
    const n = rng.int(5, 100);
    const k = rng.int(2, 5);
    const answer = n * k * k;
    return ask(
      [
        `A sample of $${n}$ gives a certain standard error of the mean. What sample size makes the standard error $${k}$ times smaller?`,
        `容量为 $${n}$ 的样本给出某个均值标准误。多大的样本量能使标准误缩小为原来的 $\\frac{1}{${k}}$？`,
      ],
      answer,
      [n * k, 2 * n * k, n + k * k],
      [
        `The standard error depends on $\\sqrt{n}$, so $\\sqrt{n}$ must grow by the factor $${k}$. That multiplies $n$ by $${k * k}$, which gives $${answer}$.`,
        `标准误取决于 $\\sqrt{n}$，所以 $\\sqrt{n}$ 必须增大到 $${k}$ 倍。这使 $n$ 乘以 $${k * k}$，得 $${answer}$。`,
      ],
    );
  },
);

const meanCutoff = point(
  "a-cutoff-for-the-sample-mean-from-a-probability",
  ["A cutoff for the sample mean from a probability", "由概率求样本均值的分界点"],
  [
    "A probability for the sample mean can be read backward. The table turns the probability into a value of $z$, and the cutoff is then $\\mu$ plus $z$ standard errors. The standard error, $\\frac{\\sigma}{\\sqrt{n}}$, is the scale to use, not $\\sigma$ itself.",
    "样本均值的概率可以反过来读。分布表把概率转换成 $z$ 值，分界点就是 $\\mu$ 加上 $z$ 个标准误。要用的尺度是标准误 $\\frac{\\sigma}{\\sqrt{n}}$，而不是 $\\sigma$ 本身。",
  ],
  (rng) => {
    const k = rng.int(2, 10);
    const se = rng.int(1, 8);
    const sigma = k * se;
    const mu = rng.int(50, 150);
    const z = rng.pick([50, 100, 150, 200]);
    const below = rng.bool();
    const shift = Q.of(z * se, 100);
    const answer = below ? Q.of(mu, 1).add(shift) : Q.of(mu, 1).sub(shift);
    const sign = below ? "+" : "-";
    const event = below ? "\\bar{X} \\le c" : "\\bar{X} > c";
    const p = dec(phi(z));
    return askDecimal(
      [
        `A sample of $n = ${k * k}$ is taken from $N(${mu}, ${sigma * sigma})$. Find $c$ with $P(${event}) = ${p}$. Use $${given(z)}$.`,
        `从 $N(${mu}, ${sigma * sigma})$ 中抽取容量为 $n = ${k * k}$ 的样本。求 $c$，使 $P(${event}) = ${p}$。利用 $${given(z)}$。`,
      ],
      answer,
      [
        below ? Q.of(mu, 1).sub(shift) : Q.of(mu, 1).add(shift),
        below ? Q.of(mu, 1).add(Q.of(z * sigma, 100)) : Q.of(mu, 1).sub(Q.of(z * sigma, 100)),
        Q.of(mu, 1),
      ],
      [
        `The standard error is $\\frac{${sigma}}{${k}} = ${se}$. A probability above one half puts ${below ? "the cutoff above the mean" : "the cutoff below the mean"}, so $c = ${mu} ${sign} ${zText(z)} \\cdot ${se} = ${dec(answer)}$.`,
        `标准误是 $\\frac{${sigma}}{${k}} = ${se}$。概率大于二分之一说明${below ? "分界点在均值之上" : "分界点在均值之下"}，所以 $c = ${mu} ${sign} ${zText(z)} \\cdot ${se} = ${dec(answer)}$。`,
      ],
    );
  },
);

const allSuccesses = point(
  "the-chance-of-a-sample-proportion-of-one",
  ["The chance of a sample proportion of one", "样本比例为一的概率"],
  [
    "Drawing without replacement from a finite population changes the proportion after each draw, so the draws are dependent. The probability that every draw is a success is a product of falling fractions, and squaring the population proportion would overstate it.",
    "从有限总体中不放回抽样时，每次抽取后比例都会改变，所以各次抽取相依。每次都成功的概率是递减分数之积，而把总体比例平方会高估它。",
  ],
  (rng) => {
    const N = rng.int(10, 60);
    const K = rng.int(3, N - 2);
    const answer = Q.of(K * (K - 1), N * (N - 1));
    return ask(
      [
        `A population of $${N}$ has $${K}$ successes. A sample of $2$ is drawn without replacement. Find $P(\\hat{p} = 1)$.`,
        `总体共 $${N}$ 个，其中 $${K}$ 个成功。不放回地抽取容量为 $2$ 的样本。求 $P(\\hat{p} = 1)$。`,
      ],
      answer,
      [Q.of(K * K, N * N), Q.of(K, N), Q.of(K * (K - 1), N * N)],
      [
        `The first draw succeeds with probability $\\frac{${K}}{${N}}$, and then the second with $\\frac{${K - 1}}{${N - 1}}$. Their product is $${answer.toLatex()}$.`,
        `第一次成功的概率是 $\\frac{${K}}{${N}}$，第二次成功的概率是 $\\frac{${K - 1}}{${N - 1}}$。它们的积是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const cltTwoValues = point(
  "the-clt-for-a-two-valued-population",
  ["The CLT for a two-valued population", "两值总体的中心极限定理"],
  [
    "The population need not look normal for the central limit theorem to apply: even a population with two values gives an approximately normal sample mean. The population variance has to be computed first, and then it is divided by the sample size.",
    "应用中心极限定理时，总体不必看起来像正态分布：即使总体只有两个值，样本均值也近似服从正态分布。要先算出总体方差，再除以样本量。",
  ],
  (rng) => {
    const a = rng.int(-9, 9);
    const b = a + nz(rng, 8);
    const n = rng.int(30, 100);
    const gap = (a - b) ** 2;
    const answer = Q.of(gap, 4 * n);
    return ask(
      [
        `A population takes the values $${a}$ and $${b}$, each with probability $\\frac{1}{2}$. For a sample of $n = ${n}$, find the variance of the approximate normal distribution of $\\bar{X}$.`,
        `总体取值 $${a}$ 和 $${b}$，概率都是 $\\frac{1}{2}$。对容量为 $n = ${n}$ 的样本，求 $\\bar{X}$ 的近似正态分布的方差。`,
      ],
      answer,
      [Q.of(gap, 4), Q.of(Math.abs(a - b), 2 * n), Q.of(gap, n)],
      [
        `Each value is half the gap from the mean, so the population variance is $\\frac{${gap}}{4}$. Dividing by $${n}$ gives $${answer.toLatex()}$.`,
        `每个值与均值的距离都是差的一半，所以总体方差是 $\\frac{${gap}}{4}$。除以 $${n}$，得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const cltSampleSize = point(
  "the-sample-size-that-pins-down-the-mean",
  ["The sample size that pins down the mean", "确定均值所需的样本量"],
  [
    "The central limit theorem can be turned around to plan a sample. Requiring $z\\frac{\\sigma}{\\sqrt{n}} \\le E$ gives $n \\ge \\left(\\frac{z\\sigma}{E}\\right)^{2}$. Since this is a lower bound and $n$ is a whole number, any fractional result must be rounded up.",
    "中心极限定理可以反过来用于规划样本。要求 $z\\frac{\\sigma}{\\sqrt{n}} \\le E$，得 $n \\ge \\left(\\frac{z\\sigma}{E}\\right)^{2}$。由于这是下界而 $n$ 是整数，所以小数结果必须向上取整。",
  ],
  (rng) => {
    const sigma = rng.int(3, 30);
    const E = rng.int(1, 6);
    const bound = Q.of(4 * sigma * sigma, E * E);
    const answer = Math.ceil((4 * sigma * sigma) / (E * E));
    const low = answer - 1;
    return ask(
      [
        `A population has $\\sigma = ${sigma}$. Using $z = 2$ for $95\\%$, find the smallest $n$ so that $\\bar{X}$ lies within $${E}$ of $\\mu$ with this probability.`,
        `总体的 $\\sigma = ${sigma}$。对 $95\\%$ 取 $z = 2$，求最小的 $n$，使 $\\bar{X}$ 以这个概率落在 $\\mu$ 的 $${E}$ 范围内。`,
      ],
      answer,
      [low, Math.ceil((2 * sigma) / E), Math.ceil((sigma * sigma) / (E * E))],
      [
        `We need $n \\ge \\left(\\frac{2 \\cdot ${sigma}}{${E}}\\right)^{2} = ${bound.toLatex()}$. The smallest whole number meeting this is $${answer}$.`,
        `需要 $n \\ge \\left(\\frac{2 \\cdot ${sigma}}{${E}}\\right)^{2} = ${bound.toLatex()}$。满足条件的最小整数是 $${answer}$。`,
      ],
    );
  },
);

const populationFromFactor = point(
  "the-population-size-from-the-correction-factor",
  ["The population size from the correction factor", "由校正因子求总体大小"],
  [
    "The variance correction $\\frac{N - n}{N - 1}$ can be solved for $N$. Setting it equal to a known factor $r$ gives a linear equation, with solution $N = \\frac{n - r}{1 - r}$, so an observed reduction reveals how large the population is.",
    "方差校正 $\\frac{N - n}{N - 1}$ 可以解出 $N$。令它等于已知因子 $r$，得到一个线性方程，解为 $N = \\frac{n - r}{1 - r}$，所以观察到的缩小幅度能说明总体有多大。",
  ],
  (rng) => {
    const n = rng.int(5, 40);
    const N = n + rng.int(2, 150);
    const r = Q.of(N - n, N - 1);
    return ask(
      [
        `A sample of $n = ${n}$ is drawn without replacement, and $\\frac{N - n}{N - 1} = ${r.toLatex()}$. Find the population size $N$.`,
        `不放回地抽取容量为 $n = ${n}$ 的样本，且 $\\frac{N - n}{N - 1} = ${r.toLatex()}$。求总体大小 $N$。`,
      ],
      N,
      [Q.of(n, 1).div(Q.of(1, 1).sub(r)), N + 1, N - 1],
      [
        `Clearing the fraction gives a linear equation with solution $N = \\frac{n - r}{1 - r}$. Here that is $\\frac{${Q.of(n, 1).sub(r).toLatex()}}{${Q.of(1, 1).sub(r).toLatex()}} = ${N}$.`,
        `去分母得到一个线性方程，解为 $N = \\frac{n - r}{1 - r}$。这里等于 $\\frac{${Q.of(n, 1).sub(r).toLatex()}}{${Q.of(1, 1).sub(r).toLatex()}} = ${N}$。`,
      ],
    );
  },
);

const shareRemoved = point(
  "the-share-of-variance-the-correction-removes",
  ["The share of variance the correction removes", "校正去掉的方差份额"],
  [
    "The correction multiplies the variance by $\\frac{N - n}{N - 1}$, so the share removed is one minus this factor, which is $\\frac{n - 1}{N - 1}$. It is close to the sampling fraction, and it grows to the whole variance when the sample is the entire population.",
    "校正把方差乘以 $\\frac{N - n}{N - 1}$，所以去掉的份额是一减去这个因子，即 $\\frac{n - 1}{N - 1}$。它接近抽样比，当样本就是整个总体时，它增大到全部方差。",
  ],
  (rng) => {
    const n = rng.int(5, 80);
    const N = n + rng.int(5, 400);
    const answer = Q.of(n - 1, N - 1);
    return ask(
      [
        `A sample of $n = ${n}$ is drawn without replacement from $N = ${N}$. What fraction of the variance of $\\hat{p}$ does the finite population correction remove?`,
        `从 $N = ${N}$ 中不放回地抽取容量为 $n = ${n}$ 的样本。有限总体校正去掉了 $\\hat{p}$ 方差的多大比例？`,
      ],
      answer,
      [Q.of(N - n, N - 1), Q.of(n, N), Q.of(n, N - 1)],
      [
        `The variance is multiplied by $\\frac{${N - n}}{${N - 1}}$. The share removed is one minus this, which is $${answer.toLatex()}$.`,
        `方差乘以 $\\frac{${N - n}}{${N - 1}}$。去掉的份额是一减去它，即 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const uniformMle = point(
  "maximizing-the-likelihood-of-a-uniform-sample",
  ["Maximizing the likelihood of a uniform sample", "最大化均匀样本的似然"],
  [
    "For a sample from $U(0, \\theta)$, the likelihood is $\\theta^{-n}$ when $\\theta$ covers every observation and zero otherwise. It decreases in $\\theta$, so its maximum is at the smallest allowed value, the sample maximum. Setting a derivative to zero does not find this.",
    "对来自 $U(0, \\theta)$ 的样本，当 $\\theta$ 覆盖所有观测时，似然是 $\\theta^{-n}$，否则为零。它关于 $\\theta$ 递减，所以最大值在允许的最小值处，即样本最大值。令导数为零找不到这一点。",
  ],
  (rng) => {
    const xs = rng.sample(
      [...Array(30).keys()].map((i) => i + 1),
      4,
    );
    const sum = xs.reduce((a, b) => a + b, 0);
    const max = Math.max(...xs);
    return ask(
      [
        `A sample from $U(0, \\theta)$ is $${xs.join(", ")}$. Find the value of $\\theta$ that maximizes the likelihood.`,
        `来自 $U(0, \\theta)$ 的样本是 $${xs.join(", ")}$。求使似然最大的 $\\theta$。`,
      ],
      max,
      [Q.of(sum, 2), Q.of(sum, 4), Math.min(...xs)],
      [
        `The likelihood is zero unless $\\theta \\ge ${max}$, and above that $\\theta^{-4}$ decreases. So the maximum is at $\\theta = ${max}$, the sample maximum.`,
        `除非 $\\theta \\ge ${max}$，否则似然为零，而在此之上 $\\theta^{-4}$ 递减。所以最大值在 $\\theta = ${max}$ 处，即样本最大值。`,
      ],
    );
  },
);

const sFromInterval = point(
  "the-sample-standard-deviation-behind-a-t-interval",
  ["The sample standard deviation behind a t interval", "由 t 区间反求样本标准差"],
  [
    "A confidence interval can be taken apart: its center is the sample mean and half its width is the margin of error. Since the margin is $t\\frac{s}{\\sqrt{n}}$, the sample standard deviation can be recovered from the published interval and the sample size.",
    "置信区间可以拆开来看：中心是样本均值，宽度的一半是误差幅度。由于误差幅度是 $t\\frac{s}{\\sqrt{n}}$，所以可以由公布的区间和样本量求出样本标准差。",
  ],
  (rng) => {
    const [k, tv] = rng.pick([
      [3, 2306],
      [4, 2131],
      [5, 2064],
      [6, 2030],
      [7, 2011],
      [8, 1998],
      [9, 1990],
      [10, 1984],
    ] as const);
    const s = k * rng.int(1, 6);
    const center = rng.int(40, 120);
    const halfWidth = Q.of(tv * s, 1000 * k);
    const t2 = dec(Q.of(tv, 1000));
    const lowText = dec(Q.of(center, 1).sub(halfWidth));
    const highText = dec(Q.of(center, 1).add(halfWidth));
    return ask(
      [
        `A $95\\%$ $t$ interval from a sample of $n = ${k * k}$ is $(${lowText}, ${highText})$. With $t = ${t2}$, find $s$.`,
        `由容量为 $n = ${k * k}$ 的样本得到的 $95\\%$ $t$ 区间是 $(${lowText}, ${highText})$。取 $t = ${t2}$，求 $s$。`,
      ],
      s,
      [halfWidth, Q.of(tv * s, 1000), s * k],
      [
        `Half the width is the margin, $${dec(halfWidth)}$. Since the margin equals $${t2} \\cdot \\frac{s}{${k}}$, solving gives $s = ${s}$.`,
        `宽度的一半是误差幅度 $${dec(halfWidth)}$。由于误差幅度等于 $${t2} \\cdot \\frac{s}{${k}}$，解得 $s = ${s}$。`,
      ],
    );
  },
);

const halfMargin = point(
  "the-sample-that-halves-the-margin",
  ["The sample that halves the margin", "使误差幅度减半的样本"],
  [
    "The finite population correction multiplies the margin of error by $\\sqrt{\\frac{N - n}{N - 1}}$. So halving the margin requires this fraction under the root to equal one quarter, which means sampling about three quarters of the population, not half of it.",
    "有限总体校正把误差幅度乘以 $\\sqrt{\\frac{N - n}{N - 1}}$。所以要使误差幅度减半，根号下的分数必须等于四分之一，这意味着要抽取约四分之三的总体，而不是一半。",
  ],
  (rng) => {
    const j = rng.int(5, 60);
    const N = 4 * j + 1;
    const answer = 3 * j + 1;
    return ask(
      [
        `A sample is drawn without replacement from $N = ${N}$. For which $n$ does the finite population correction exactly halve the margin of error?`,
        `从 $N = ${N}$ 中不放回地抽取样本。当 $n$ 为何值时，有限总体校正恰好使误差幅度减半？`,
      ],
      answer,
      [2 * j + 1, 3 * j, j + 1],
      [
        `We need $\\frac{${N} - n}{${N - 1}} = \\frac{1}{4}$, since the square root of this is one half. So $${N} - n = ${j}$ and $n = ${answer}$.`,
        `需要 $\\frac{${N} - n}{${N - 1}} = \\frac{1}{4}$，因为它的平方根是二分之一。所以 $${N} - n = ${j}$，$n = ${answer}$。`,
      ],
    );
  },
);

const countFromInterval = point(
  "the-count-behind-a-proportion-interval",
  ["The count behind a proportion interval", "比例区间背后的计数"],
  [
    "A Wald interval is centered at the sample proportion. So the midpoint of a published interval gives $\\hat{p}$, and multiplying by the sample size recovers the count. An endpoint is not the sample proportion, and using one would give a wrong count.",
    "沃尔德区间以样本比例为中心。所以公布区间的中点给出 $\\hat{p}$，乘以样本量就得到计数。端点不是样本比例，用它会得到错误的计数。",
  ],
  (rng) => {
    const m = rng.int(1, 10);
    const c = rng.int(10, 90);
    const h = rng.int(1, 9);
    const n = 100 * m;
    const answer = m * c;
    const low = dec(Q.of(c - h, 100));
    const high = dec(Q.of(c + h, 100));
    return ask(
      [
        `A Wald confidence interval from a sample of $${n}$ is $(${low}, ${high})$. How many in the sample answered yes?`,
        `由容量为 $${n}$ 的样本得到的沃尔德置信区间是 $(${low}, ${high})$。样本中有多少人回答是？`,
      ],
      answer,
      [m * (c - h), m * (c + h), c],
      [
        `The midpoint of the interval is $\\hat{p} = ${dec(Q.of(c, 100))}$. Multiplying by $${n}$ gives $${answer}$.`,
        `区间的中点是 $\\hat{p} = ${dec(Q.of(c, 100))}$。乘以 $${n}$，得 $${answer}$。`,
      ],
    );
  },
);

const totalMargin = point(
  "the-margin-for-a-population-total",
  ["The margin for a population total", "总体总数的误差幅度"],
  [
    "To estimate how many in a finite population have a property, multiply the proportion and its margin by $N$. The margin uses the corrected standard error, so it combines the sample size, the correction factor and the population size in a single calculation.",
    "估计有限总体中有多少个体具有某一性质时，要把比例及其误差幅度都乘以 $N$。误差幅度用校正后的标准误，所以在一次计算中结合了样本量、校正因子和总体大小。",
  ],
  (rng) => {
    const [n, N, k] = rng.pick([
      [100, 133, 10],
      [400, 533, 20],
    ] as const);
    const [pn, pd, rn, rd] = rng.pick([
      [1, 2, 1, 2],
      [1, 5, 2, 5],
      [4, 5, 2, 5],
      [1, 10, 3, 10],
      [9, 10, 3, 10],
    ] as const);
    const z = rng.pick([1645, 1960, 2576]);
    const x = (n * pn) / pd;
    const zq = Q.of(z, 1000);
    const root = Q.of(rn, rd);
    const se = root.mul(Q.of(1, k)).mul(Q.of(1, 2));
    const answer = zq.mul(se).mul(Q.of(N, 1));
    return askDecimal(
      [
        `A population has $N = ${N}$ members. In a sample of $n = ${n}$ drawn without replacement, $${x}$ have a property. With $z = ${dec(zq)}$, find the margin of error for the number of members in the population having the property, using the finite population correction.`,
        `总体共有 $N = ${N}$ 个成员。不放回地抽取 $n = ${n}$ 个，其中 $${x}$ 个具有某一性质。取 $z = ${dec(zq)}$，用有限总体校正求总体中具有该性质的成员数的误差幅度。`,
      ],
      answer,
      [answer.mul(Q.of(2, 1)), zq.mul(se), Q.of(N * pn, pd)],
      [
        `The correction is $\\frac{${N - n}}{${N - 1}} = \\frac{1}{4}$, and $\\sqrt{\\hat{p}(1 - \\hat{p})} = ${root.toLatex()}$. So the standard error of $\\hat{p}$ is $${root.toLatex()} \\cdot \\frac{1}{${k}} \\cdot \\frac{1}{2} = ${dec(se)}$, and the margin is $${N} \\cdot ${dec(zq)} \\cdot ${dec(se)} = ${dec(answer)}$.`,
        `校正因子是 $\\frac{${N - n}}{${N - 1}} = \\frac{1}{4}$，$\\sqrt{\\hat{p}(1 - \\hat{p})} = ${root.toLatex()}$。所以 $\\hat{p}$ 的标准误是 $${root.toLatex()} \\cdot \\frac{1}{${k}} \\cdot \\frac{1}{2} = ${dec(se)}$，误差幅度是 $${N} \\cdot ${dec(zq)} \\cdot ${dec(se)} = ${dec(answer)}$。`,
      ],
    );
  },
);

const varianceVerdict = point(
  "whether-a-value-is-inside-a-variance-interval",
  ["Whether a value is inside a variance interval", "判断某值是否在方差区间内"],
  [
    "The interval for a variance is not centered at $s^{2}$, because the chi-square distribution is skewed. The lower endpoint divides by the larger critical value and the upper endpoint by the smaller, and a hypothesized value should be compared with both of them.",
    "方差的区间并不以 $s^{2}$ 为中心，因为卡方分布是偏斜的。下端点除以较大的临界值，上端点除以较小的临界值，假设值要与这两个端点比较。",
  ],
  (rng) => {
    const [df, hi, lo] = rng.pick([
      [9, 19.023, 2.7],
      [14, 26.119, 5.629],
      [19, 32.852, 8.907],
      [24, 39.364, 12.401],
    ] as const);
    const s2 = rng.int(20, 80);
    const L = (df * s2) / hi;
    const U = (df * s2) / lo;
    const kind = rng.int(0, 2);
    const value = kind === 0 ? rng.int(Math.ceil(L), Math.floor(U)) : kind === 1 ? Math.max(1, Math.floor(L * 0.6)) : Math.ceil(U * 1.3);
    const inside: Pair = ["It is inside the interval", "它在区间内"];
    const below: Pair = ["It is below the lower endpoint", "它低于下端点"];
    const above: Pair = ["It is above the upper endpoint", "它高于上端点"];
    const option = [inside, below, above][kind] as Pair;
    const others = [inside, below, above].filter((o) => o !== option);
    const lText = L.toFixed(2);
    const uText = U.toFixed(2);
    return choose(
      rng,
      [
        `A sample of $n = ${df + 1}$ from a normal population has $s^{2} = ${s2}$. With $\\chi^{2}_{0.025, ${df}} = ${hi}$ and $\\chi^{2}_{0.975, ${df}} = ${lo}$, where is $\\sigma^{2} = ${value}$ relative to the $95\\%$ confidence interval?`,
        `来自正态总体的容量为 $n = ${df + 1}$ 的样本满足 $s^{2} = ${s2}$。取 $\\chi^{2}_{0.025, ${df}} = ${hi}$，$\\chi^{2}_{0.975, ${df}} = ${lo}$，$\\sigma^{2} = ${value}$ 相对于 $95\\%$ 置信区间的位置如何？`,
      ],
      option,
      [...others, ["It equals the center of the interval", "它等于区间的中心"]],
      [
        `The endpoints are $\\frac{${df} \\cdot ${s2}}{${hi}} \\approx ${lText}$ and $\\frac{${df} \\cdot ${s2}}{${lo}} \\approx ${uText}$. So $${value}$ is ${["inside the interval", "below the lower endpoint", "above the upper endpoint"][kind]}.`,
        `端点是 $\\frac{${df} \\cdot ${s2}}{${hi}} \\approx ${lText}$ 和 $\\frac{${df} \\cdot ${s2}}{${lo}} \\approx ${uText}$。所以 $${value}$ ${["在区间内", "低于下端点", "高于上端点"][kind]}。`,
      ],
    );
  },
);

const zeroInInterval = point(
  "reading-a-difference-of-means-from-its-interval",
  ["Reading a difference of means from its interval", "由区间判断均值之差"],
  [
    "A confidence interval for a difference of means is read by its position relative to zero. If zero is inside, the data do not separate the means. If both endpoints are positive or both are negative, the interval also shows which mean is larger.",
    "均值之差的置信区间要看它相对于零的位置。如果零在区间内，数据不能区分两个均值。如果两个端点都为正或都为负，区间还能说明哪个均值更大。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const kind = rng.int(0, 2);
    const d = kind === 0 ? rng.int(-k, k) : (kind === 1 ? 1 : -1) * (2 * k + rng.int(1, 8));
    const n = 25;
    const contains: Pair = ["The data do not separate the two means", "数据不能区分两个均值"];
    const first: Pair = ["The first mean is larger", "第一个均值更大"];
    const second: Pair = ["The second mean is larger", "第二个均值更大"];
    const option = [contains, first, second][kind] as Pair;
    const others = [contains, first, second].filter((o) => o !== option);
    const low = Q.of(d, 1).sub(Q.of(196 * k, 100));
    const high = Q.of(d, 1).add(Q.of(196 * k, 100));
    return choose(
      rng,
      [
        `Samples of size $${n}$ each come from populations with $\\sigma_{1} = ${3 * k}$ and $\\sigma_{2} = ${4 * k}$, and $\\bar{x}_{1} - \\bar{x}_{2} = ${d}$. Using $z = 1.96$, what does the $95\\%$ interval for $\\mu_{1} - \\mu_{2}$ show?`,
        `容量都是 $${n}$ 的样本来自 $\\sigma_{1} = ${3 * k}$，$\\sigma_{2} = ${4 * k}$ 的总体，$\\bar{x}_{1} - \\bar{x}_{2} = ${d}$。取 $z = 1.96$，$\\mu_{1} - \\mu_{2}$ 的 $95\\%$ 区间说明了什么？`,
      ],
      option,
      [...others, ["The two population variances are equal", "两个总体方差相等"]],
      [
        `The standard error is $\\sqrt{\\frac{${9 * k * k}}{${n}} + \\frac{${16 * k * k}}{${n}}} = ${k}$, so the interval is $(${dec(low)}, ${dec(high)})$. ${["It contains zero, so the means are not separated", "It lies above zero, so the first mean is larger", "It lies below zero, so the second mean is larger"][kind]}.`,
        `标准误是 $\\sqrt{\\frac{${9 * k * k}}{${n}} + \\frac{${16 * k * k}}{${n}}} = ${k}$，所以区间是 $(${dec(low)}, ${dec(high)})$。${["它包含零，所以两个均值不能区分", "它全在零的上方，所以第一个均值更大", "它全在零的下方，所以第二个均值更大"][kind]}。`,
      ],
    );
  },
);

const pooledMargin = point(
  "the-margin-from-the-pooled-standard-deviation",
  ["The margin from the pooled standard deviation", "由合并标准差求误差幅度"],
  [
    "With a pooled standard deviation, the margin for a difference of means is $t \\cdot s_{p}\\sqrt{\\frac{1}{n_{1}} + \\frac{1}{n_{2}}}$. The pooled value replaces both standard deviations, and the sizes appear only inside this square root as a sum of reciprocals.",
    "使用合并标准差时，均值之差的误差幅度是 $t \\cdot s_{p}\\sqrt{\\frac{1}{n_{1}} + \\frac{1}{n_{2}}}$。合并值取代了两个标准差，样本量只以倒数之和的形式出现在这个根号内。",
  ],
  (rng) => {
    const [n1, n2, a] = rng.pick([
      [20, 5, 2],
      [12, 6, 2],
      [8, 8, 2],
      [36, 12, 3],
      [18, 18, 3],
      [90, 10, 3],
      [32, 32, 4],
      [48, 24, 4],
      [80, 20, 4],
    ] as const);
    const sp = rng.int(2, 20);
    const answer = Q.of(2 * sp, a);
    return ask(
      [
        `Two samples have $n_{1} = ${n1}$, $n_{2} = ${n2}$ and pooled standard deviation $s_{p} = ${sp}$. Using $t = 2$, find the margin of error for $\\mu_{1} - \\mu_{2}$.`,
        `两个样本满足 $n_{1} = ${n1}$，$n_{2} = ${n2}$，合并标准差 $s_{p} = ${sp}$。取 $t = 2$，求 $\\mu_{1} - \\mu_{2}$ 的误差幅度。`,
      ],
      answer,
      [2 * sp, Q.of(2 * sp, a * a), Q.of(sp, a)],
      [
        `$\\frac{1}{${n1}} + \\frac{1}{${n2}} = \\frac{1}{${a * a}}$, whose square root is $\\frac{1}{${a}}$. So the margin is $2 \\cdot ${sp} \\cdot \\frac{1}{${a}} = ${answer.toLatex()}$.`,
        `$\\frac{1}{${n1}} + \\frac{1}{${n2}} = \\frac{1}{${a * a}}$，它的平方根是 $\\frac{1}{${a}}$。所以误差幅度是 $2 \\cdot ${sp} \\cdot \\frac{1}{${a}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const welchEndpoint = point(
  "an-endpoint-of-a-welch-interval",
  ["An endpoint of a Welch interval", "韦尔奇区间的端点"],
  [
    "In a Welch interval, the variances of the two sample means are added under the square root before anything else. The standard errors of the two means themselves do not add, so this margin is smaller than the sum of the two separate margins.",
    "在韦尔奇区间中，两个样本均值的方差要先在根号下相加。两个均值各自的标准误不能相加，所以这个误差幅度小于两个单独误差幅度之和。",
  ],
  (rng) => {
    const n1 = rng.int(8, 30);
    const n2 = rng.int(8, 30);
    const k = rng.int(1, 5);
    const d = rng.int(-30, 30);
    const tv = rng.pick([20, 21, 22]);
    const s1 = 9 * k * k * n1;
    const s2 = 16 * k * k * n2;
    const se = 5 * k;
    const tq = Q.of(tv, 10);
    const answer = Q.of(d, 1).sub(tq.mul(Q.of(se, 1)));
    return askDecimal(
      [
        `Two samples have $n_{1} = ${n1}$, $s_{1}^{2} = ${s1}$, $n_{2} = ${n2}$, $s_{2}^{2} = ${s2}$ and $\\bar{x}_{1} - \\bar{x}_{2} = ${d}$. Using $t = ${dec(tq)}$, find the lower endpoint of the Welch interval.`,
        `两个样本满足 $n_{1} = ${n1}$，$s_{1}^{2} = ${s1}$，$n_{2} = ${n2}$，$s_{2}^{2} = ${s2}$，$\\bar{x}_{1} - \\bar{x}_{2} = ${d}$。取 $t = ${dec(tq)}$，求韦尔奇区间的下端点。`,
      ],
      answer,
      [Q.of(d, 1).sub(tq.mul(Q.of(7 * k, 1))), Q.of(d, 1).add(tq.mul(Q.of(se, 1))), Q.of(d, 1).sub(tq.mul(Q.of(25 * k * k, 1)))],
      [
        `$\\frac{s_{1}^{2}}{n_{1}} + \\frac{s_{2}^{2}}{n_{2}} = ${9 * k * k} + ${16 * k * k} = ${25 * k * k}$, so the standard error is $${se}$. The lower endpoint is $${d} - ${dec(tq)} \\cdot ${se} = ${dec(answer)}$.`,
        `$\\frac{s_{1}^{2}}{n_{1}} + \\frac{s_{2}^{2}}{n_{2}} = ${9 * k * k} + ${16 * k * k} = ${25 * k * k}$，所以标准误是 $${se}$。下端点是 $${d} - ${dec(tq)} \\cdot ${se} = ${dec(answer)}$。`,
      ],
    );
  },
);

const twoProportionPlan = point(
  "planning-equal-groups-for-a-difference-of-proportions",
  ["Planning equal groups for a difference of proportions", "为比例之差规划等量分组"],
  [
    "With no prior estimates, the safe planning value for each proportion is $\\frac{1}{2}$. For two equal groups, the variance of the difference is $\\frac{1}{2n}$, which is twice that for a single proportion, so each group needs twice the single-sample size.",
    "没有先验估计时，每个比例的稳妥规划值是 $\\frac{1}{2}$。对两个等量分组，差的方差是 $\\frac{1}{2n}$，是单个比例的两倍，所以每组需要单样本容量的两倍。",
  ],
  (rng) => {
    const z = rng.pick([1645, 1960, 2000, 2576]);
    const e = rng.int(1, 8);
    const top = z * z;
    const bottom = 2 * (10 * e) ** 2;
    const answer = Math.ceil(top / bottom);
    const E = dec(Q.of(e, 100));
    const zText2 = dec(Q.of(z, 1000));
    const bound = Q.of(top, bottom);
    return ask(
      [
        `Two groups of equal size $n$ are planned, to estimate $p_{1} - p_{2}$ within $${E}$ using $z = ${zText2}$ and planning values $\\frac{1}{2}$. Find the smallest $n$.`,
        `计划两个容量相等为 $n$ 的组，用 $z = ${zText2}$ 和规划值 $\\frac{1}{2}$，把 $p_{1} - p_{2}$ 估计到 $${E}$ 以内。求最小的 $n$。`,
      ],
      answer,
      [Math.ceil(top / (2 * bottom)), 2 * answer, answer + 1],
      [
        `The margin is $z\\sqrt{\\frac{1}{2n}}$, so $n \\ge \\frac{z^{2}}{2E^{2}} = ${bound.toLatex()}$. Rounding up gives $${answer}$.`,
        `误差幅度是 $z\\sqrt{\\frac{1}{2n}}$，所以 $n \\ge \\frac{z^{2}}{2E^{2}} = ${bound.toLatex()}$。向上取整，得 $${answer}$。`,
      ],
    );
  },
);

const pairedVariance = point(
  "why-pairing-shrinks-the-variance-of-the-difference",
  ["Why pairing shrinks the variance of the difference", "配对为何能缩小差的方差"],
  [
    "Measurements on the same subject are correlated, so $\\sigma_{d}^{2} = \\sigma_{1}^{2} + \\sigma_{2}^{2} - 2\\operatorname{Cov}(X_{1}, X_{2})$. A positive covariance reduces the variance of the differences, which is why a paired design can give a narrower interval.",
    "同一对象的测量相关，所以 $\\sigma_{d}^{2} = \\sigma_{1}^{2} + \\sigma_{2}^{2} - 2\\operatorname{Cov}(X_{1}, X_{2})$。正的协方差使差的方差减小，这就是配对设计能给出更窄区间的原因。",
  ],
  (rng) => {
    const s1 = rng.int(2, 12);
    const s2 = rng.int(2, 12);
    const c = rng.int(1, Math.floor(0.9 * s1 * s2));
    const answer = s1 * s1 + s2 * s2 - 2 * c;
    return ask(
      [
        `Before and after measurements have $\\sigma_{1} = ${s1}$, $\\sigma_{2} = ${s2}$ and covariance $${c}$. Find the variance of the differences.`,
        `前后测量满足 $\\sigma_{1} = ${s1}$，$\\sigma_{2} = ${s2}$，协方差为 $${c}$。求差的方差。`,
      ],
      answer,
      [s1 * s1 + s2 * s2, s1 * s1 + s2 * s2 + 2 * c, s1 * s1 + s2 * s2 - c],
      [
        `The variance of a difference adds the variances and subtracts twice the covariance: $${s1 * s1} + ${s2 * s2} - 2 \\cdot ${c} = ${answer}$.`,
        `差的方差等于方差之和减去协方差的两倍：$${s1 * s1} + ${s2 * s2} - 2 \\cdot ${c} = ${answer}$。`,
      ],
    );
  },
);

const pairedEndpoint = point(
  "a-paired-t-interval-from-raw-differences",
  ["A paired t interval from raw differences", "由原始差值求配对 t 区间"],
  [
    "A paired interval treats the differences as one sample, so its degrees of freedom are the number of pairs minus one. From the raw differences, compute the mean and standard deviation, and then use the critical value for that number of degrees of freedom.",
    "配对区间把差值当作一个样本，所以自由度是对数减一。由原始差值算出均值和标准差，再使用这个自由度对应的临界值。",
  ],
  (rng) => {
    const a = rng.int(1, 4);
    const m = nz(rng, 12);
    const diffs = rng.shuffle([m + 3 * a, m - a, m - a, m - a]);
    const s = 2 * a;
    const answer = Q.of(m, 1).add(Q.of(3182 * a, 1000));
    return askDecimal(
      [
        `The differences of $4$ pairs are $${diffs.join(", ")}$. Using $t_{0.025, 3} = 3.182$ and $t_{0.025, 4} = 2.776$, find the upper endpoint of the $95\\%$ interval for the mean difference.`,
        `$4$ 对数据的差值是 $${diffs.join(", ")}$。利用 $t_{0.025, 3} = 3.182$ 和 $t_{0.025, 4} = 2.776$，求平均差的 $95\\%$ 区间的上端点。`,
      ],
      answer,
      [Q.of(m, 1).add(Q.of(2776 * a, 1000)), Q.of(m, 1).sub(Q.of(3182 * a, 1000)), Q.of(m, 1).add(Q.of(3182 * s, 1000))],
      [
        `$\\bar{d} = ${m}$ and $s_{d} = ${s}$, so the standard error is $\\frac{${s}}{2} = ${a}$. With $3$ degrees of freedom, the upper endpoint is $${m} + 3.182 \\cdot ${a} = ${dec(answer)}$.`,
        `$\\bar{d} = ${m}$，$s_{d} = ${s}$，所以标准误是 $\\frac{${s}}{2} = ${a}$。自由度为 $3$，上端点是 $${m} + 3.182 \\cdot ${a} = ${dec(answer)}$。`,
      ],
    );
  },
);

const marginFromSize = point(
  "the-margin-that-a-sample-size-can-guarantee",
  ["The margin that a sample size can guarantee", "样本量能保证的误差幅度"],
  [
    "The conservative formula can be read in reverse. With $p = \\frac{1}{2}$, the margin is $\\frac{z}{2\\sqrt{n}}$, so a planned sample size guarantees this margin whatever the true proportion is, since $p(1 - p)$ is largest at one half.",
    "保守公式可以反过来读。取 $p = \\frac{1}{2}$ 时，误差幅度是 $\\frac{z}{2\\sqrt{n}}$，所以无论真实比例是多少，计划的样本量都能保证这个误差幅度，因为 $p(1 - p)$ 在二分之一处最大。",
  ],
  (rng) => {
    const k = rng.pick([10, 20, 25, 40, 50, 80, 100]);
    const z = rng.pick([200, 196, 240, 160]);
    const zq = Q.of(z, 100);
    const answer = zq.mul(Q.of(1, 2 * k));
    return askDecimal(
      [
        `A survey of $n = ${k * k}$ uses $z = ${dec(zq)}$ and the conservative value $p = \\frac{1}{2}$. Find the margin of error it guarantees.`,
        `一项样本量为 $n = ${k * k}$ 的调查使用 $z = ${dec(zq)}$ 和保守值 $p = \\frac{1}{2}$。求它能保证的误差幅度。`,
      ],
      answer,
      [zq.mul(Q.of(1, k)), zq.mul(Q.of(1, 4 * k)), zq.mul(Q.of(1, k * k))],
      [
        `The margin is $z\\sqrt{\\frac{1}{4n}} = \\frac{${dec(zq)}}{2 \\cdot ${k}} = ${dec(answer)}$, since $\\sqrt{${k * k}} = ${k}$.`,
        `误差幅度是 $z\\sqrt{\\frac{1}{4n}} = \\frac{${dec(zq)}}{2 \\cdot ${k}} = ${dec(answer)}$，因为 $\\sqrt{${k * k}} = ${k}$。`,
      ],
    );
  },
);

const populationFromSample = point(
  "the-population-behind-a-corrected-sample-size",
  ["The population behind a corrected sample size", "校正样本量背后的总体"],
  [
    "The formula $n = \\frac{Nn_{0}}{n_{0} + N - 1}$ can be solved for the population size. Clearing the fraction and collecting the terms in $N$ gives $N = \\frac{n(n_{0} - 1)}{n_{0} - n}$, which shows how small the population must be to produce a given reduction.",
    "公式 $n = \\frac{Nn_{0}}{n_{0} + N - 1}$ 可以解出总体大小。去分母并合并含 $N$ 的项，得 $N = \\frac{n(n_{0} - 1)}{n_{0} - n}$，这说明要产生给定的缩小幅度，总体必须有多小。",
  ],
  (rng) => {
    const c = rng.int(1, 9);
    const m = rng.int(5, 30);
    const n0 = (c + 1) * m;
    const N = (n0 - 1) * c;
    const n = m * c;
    return ask(
      [
        `Using $n = \\frac{Nn_{0}}{n_{0} + N - 1}$, a planned size $n_{0} = ${n0}$ is reduced to $n = ${n}$. Find the population size $N$.`,
        `根据 $n = \\frac{Nn_{0}}{n_{0} + N - 1}$，计划容量 $n_{0} = ${n0}$ 缩小为 $n = ${n}$。求总体大小 $N$。`,
      ],
      N,
      [n0 * c, n0 + n, N + 1],
      [
        `Solving gives $N = \\frac{n(n_{0} - 1)}{n_{0} - n} = \\frac{${n} \\cdot ${n0 - 1}}{${n0 - n}} = ${N}$.`,
        `解得 $N = \\frac{n(n_{0} - 1)}{n_{0} - n} = \\frac{${n} \\cdot ${n0 - 1}}{${n0 - n}} = ${N}$。`,
      ],
    );
  },
);

const surveySaving = point(
  "how-many-responses-the-correction-saves",
  ["How many responses the correction saves", "校正能节省多少回复"],
  [
    "The finite population correction lowers the sample size needed to estimate a proportion, and the saving is the difference between the two sizes. It is large only when the initial size is an appreciable part of the population, and it is negligible for a huge population.",
    "有限总体校正降低了估计比例所需的样本量，节省的量是两个容量之差。只有当初始容量占总体相当大的部分时才明显，总体极大时可以忽略。",
  ],
  (rng) => {
    const [E, n0, divisors] = rng.pick([
      ["0.1", 100, [2, 4, 5, 10, 20, 25]],
      ["0.05", 400, [2, 4, 5, 8, 10, 16, 20, 25, 40, 50]],
      ["0.04", 625, [5, 25, 125]],
      ["0.02", 2500, [2, 4, 5, 10, 20, 25, 50]],
    ] as const);
    const divisor = rng.pick(divisors);
    const c = divisor - 1;
    const N = (n0 - 1) * c;
    const n = (n0 * c) / divisor;
    const answer = n0 - n;
    return ask(
      [
        `A proportion is estimated within $${E}$ with $z = 2$ and $p = \\frac{1}{2}$, from a population of $N = ${N}$. How many fewer responses are needed with $n = \\frac{Nn_{0}}{n_{0} + N - 1}$ than with $n_{0}$?`,
        `在 $N = ${N}$ 的总体中，用 $z = 2$，$p = \\frac{1}{2}$ 把比例估计到 $${E}$ 以内。用 $n = \\frac{Nn_{0}}{n_{0} + N - 1}$ 比用 $n_{0}$ 少需要多少份回复？`,
      ],
      answer,
      [n, n0, N - n],
      [
        `$n_{0} = \\frac{2^{2} \\cdot \\frac{1}{4}}{${E}^{2}} = ${n0}$, and the formula gives $n = ${n}$. So the saving is $${n0} - ${n} = ${answer}$.`,
        `$n_{0} = \\frac{2^{2} \\cdot \\frac{1}{4}}{${E}^{2}} = ${n0}$，公式给出 $n = ${n}$。所以节省了 $${n0} - ${n} = ${answer}$。`,
      ],
    );
  },
);

/** deeperProbabilityAndStatisticsThird2Points maps topics of Probability and Statistics, from sampling distributions to sample sizes, to a third knowledge point. */
export const deeperProbabilityAndStatisticsThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-sample-covariance-matrix": [combinationVariance],
  "sampling-distributions": [expectedMaximum],
  "pooled-variance": [pooledReverse],
  "variance-of-sample-means": [seScaling],
  "sample-means-from-normal-populations": [meanCutoff],
  "sampling-proportions-from-finite-populations": [allSuccesses],
  "the-central-limit-theorem": [cltTwoValues],
  "applications-of-the-central-limit-theorem": [cltSampleSize],
  "finite-population-corrections-for-sample-means": [populationFromFactor],
  "finite-population-corrections-for-sample-proportions": [shareRemoved],
  "likelihood-functions-for-continuous-probability-distributions": [uniformMle],
  "confidence-intervals-for-one-mean-unknown-population-variance": [sFromInterval],
  "confidence-intervals-for-one-mean-finite-population-correction": [halfMargin],
  "confidence-intervals-for-one-proportion": [countFromInterval],
  "confidence-intervals-for-one-proportion-finite-population-corrections": [totalMargin],
  "confidence-intervals-for-one-variance": [varianceVerdict],
  "confidence-intervals-for-differences-between-two-means-known-population-variances": [zeroInInterval],
  "confidence-intervals-for-differences-between-two-means-unknown-equal-population-variances": [pooledMargin],
  "confidence-intervals-for-differences-between-two-means-unknown-unequal-population-variances": [welchEndpoint],
  "confidence-intervals-for-differences-between-two-proportions": [twoProportionPlan],
  "confidence-intervals-for-paired-samples-known-variances": [pairedVariance],
  "confidence-intervals-for-paired-samples-unknown-variances": [pairedEndpoint],
  "sample-size-determination-for-estimating-proportions": [marginFromSize],
  "sample-size-determination-for-estimating-means-finite-populations": [populationFromSample],
  "sample-size-determination-for-estimating-proportions-finite-populations": [surveySaving],
};
