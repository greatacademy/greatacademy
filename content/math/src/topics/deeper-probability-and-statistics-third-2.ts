// Third knowledge points for thin topics of Probability and Statistics, from sampling
// distributions to sample sizes: the reverse question, a harder case or a common trap.
// See `deeperProbabilityAndStatisticsThird2Points`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, dec, poly, Q } from "@ga/subject-math";

import { explainedChoice, numberProblem, why } from "../problems.ts";
import { point } from "../university-kit.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { given, nz, phi, zText } from "./deeper-probability-and-statistics-third.ts";

/** unlike keeps the explained mistakes that differ from the answer and from each other. */
const unlike = <T extends { readonly value: Coefficient }>(answer: Coefficient, list: readonly T[]): T[] => {
  const asQ = (v: Coefficient) => (typeof v === "number" ? Q.of(v) : v);
  return list.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && list.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
};

const combinationVariance = point(
  "the-variance-of-a-combination-from-the-covariance-matrix",
  ["The variance of a combination from the covariance matrix", "由协方差矩阵求组合的方差"],
  [
    "The sample covariance matrix $S$ gives the sample variance of every linear combination, not only of the original variables. For a combination with coefficient vector $\\mathbf{a}$, the variance is $\\mathbf{a}^{T}S\\mathbf{a}$, and the covariance term appears twice. For two variables this is $\\operatorname{Var}(px + qy) = p^{2}s_x^{2} + 2pq\\,s_{xy} + q^{2}s_y^{2}$. With $S = \\begin{pmatrix} 100 & -30 \\\\ -30 & 50 \\end{pmatrix}$, the combination $5x - 4y$ has variance $25 \\cdot 100 + 2(5)(-4)(-30) + 16 \\cdot 50 = 2500 + 1200 + 800 = 4500$.\n\n> **Watch out.** The factor $2$ already counts both off-diagonal entries of $S$, so the covariance is not added again. Square the coefficients with their signs, $(-4)^{2} = 16$, but keep the sign of $pq$ in the cross term.",
    "样本协方差矩阵 $S$ 给出每个线性组合的样本方差，而不只是原变量的方差。对系数向量为 $\\mathbf{a}$ 的组合，方差是 $\\mathbf{a}^{T}S\\mathbf{a}$，其中协方差项出现两次。对两个变量，就是 $\\operatorname{Var}(px + qy) = p^{2}s_x^{2} + 2pq\\,s_{xy} + q^{2}s_y^{2}$。当 $S = \\begin{pmatrix} 100 & -30 \\\\ -30 & 50 \\end{pmatrix}$ 时，组合 $5x - 4y$ 的方差为 $25 \\cdot 100 + 2(5)(-4)(-30) + 16 \\cdot 50 = 2500 + 1200 + 800 = 4500$。\n\n> **注意。** 因子 $2$ 已经计入了 $S$ 的两个非对角元，协方差不要再加一次。系数连同符号一起平方，$(-4)^{2} = 16$，但交叉项要保留 $pq$ 的符号。",
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
    const times = (x: number, y: number) => (x === 1 ? `${y}` : y === 1 ? `${x}` : `${x} \\cdot ${y}`);
    const [first, cross, last] = [p * p * a, 2 * p * q * c, q * q * b];
    const sum = `${first}${cross < 0 ? ` - ${-cross}` : ` + ${cross}`} + ${last}`;
    const [u, v] = [a * p + c * q, c * p + b * q];
    const formula = `${times(p * p, a)} + 2(${p})(${q})(${c}) + ${times(q * q, b)}`;
    return numberProblem({
      prompt: t(
        `Data on $(x, y)$ have sample covariance matrix $S = ${S}$. Find the sample variance of $${poly([p, "x"], [q, "y"])}$.`,
        `$(x, y)$ 的样本协方差矩阵是 $S = ${S}$。求 $${poly([p, "x"], [q, "y"])}$ 的样本方差。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          p * p * a + p * q * c + q * q * b,
          "That counts the covariance once; the cross term is $2pq\\,s_{xy}$, one for each off-diagonal entry.",
          "那只计了一次协方差；交叉项是 $2pq\\,s_{xy}$，每个非对角元各一次。",
        ),
        why(
          p * p * a + q * q * b,
          "That leaves out the covariance, as if $x$ and $y$ were uncorrelated.",
          "那漏掉了协方差，好像 $x$ 与 $y$ 不相关。",
        ),
        why(
          p * p * a + q * q * b - 2 * p * q * c,
          "That subtracts the cross term; its sign comes from $pq\\,s_{xy}$ itself.",
          "那把交叉项减去了；它的符号已包含在 $pq\\,s_{xy}$ 中。",
        ),
        why(
          p * a + q * b,
          "That uses the coefficients without squaring them and drops the covariance.",
          "那没有把系数平方，还漏掉了协方差。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Read the matrix", "读矩阵"],
            t(
              `$S$ gives $s_x^{2} = ${a}$, $s_y^{2} = ${b}$ and $s_{xy} = ${c}$, and the coefficients are $p = ${p}$ and $q = ${q}$.`,
              `由 $S$ 得 $s_x^{2} = ${a}$，$s_y^{2} = ${b}$，$s_{xy} = ${c}$，系数为 $p = ${p}$，$q = ${q}$。`,
            ),
          ],
          [
            ["Apply the formula", "代入公式"],
            t(
              `$p^{2}s_x^{2} + 2pq\\,s_{xy} + q^{2}s_y^{2} = ${formula} = ${sum} = ${answer}$.`,
              `$p^{2}s_x^{2} + 2pq\\,s_{xy} + q^{2}s_y^{2} = ${formula} = ${sum} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `As $\\mathbf{a}^{T}S\\mathbf{a}$ with $\\mathbf{a} = (${p}, ${q})$: $S\\mathbf{a} = (${u}, ${v})$, and $(${p})(${u}) + (${q})(${v}) = ${answer}$.`,
          `按 $\\mathbf{a}^{T}S\\mathbf{a}$ 计算，$\\mathbf{a} = (${p}, ${q})$：$S\\mathbf{a} = (${u}, ${v})$，而 $(${p})(${u}) + (${q})(${v}) = ${answer}$。`,
        ),
      ),
    });
  },
);

const expectedMaximum = point(
  "the-sampling-distribution-of-the-maximum",
  ["The sampling distribution of the maximum", "最大值的抽样分布"],
  [
    "Any statistic has a sampling distribution, not only the mean. Listing the equally likely samples gives the distribution of the sample maximum, and its expected value lies below the population maximum, so this statistic is a biased estimator of that maximum.\n\nFor the population $1, 2, 3$ and samples of size $2$ with replacement, $1$ of the $9$ samples has maximum $1$, $3$ have maximum $2$ and $5$ have maximum $3$, so the expected maximum is $\\frac{1 + 3 \\cdot 2 + 5 \\cdot 3}{9} = \\frac{22}{9}$.\n\nCheck: $1 + 3 + 5 = 9$ counts every sample once, and $\\frac{22}{9}$ is below the population maximum $3$.\n\n> **Watch out.** Count ordered samples: the maximum $2$ comes from $(1, 2)$, $(2, 1)$ and $(2, 2)$, three samples, not two. Counting unordered pairs gives $\\frac{1 + 2 \\cdot 2 + 3 \\cdot 3}{6} = \\frac{7}{3}$, which is wrong because the unordered pairs are not equally likely.",
    "任何统计量都有抽样分布，不只是均值。列出等可能的样本就得到样本最大值的分布，它的期望值低于总体最大值，所以这个统计量是总体最大值的有偏估计。\n\n对总体 $1, 2, 3$ 有放回地抽取容量为 $2$ 的样本，$9$ 个样本中 $1$ 个最大值为 $1$，$3$ 个最大值为 $2$，$5$ 个最大值为 $3$，所以最大值的期望为 $\\frac{1 + 3 \\cdot 2 + 5 \\cdot 3}{9} = \\frac{22}{9}$。\n\n检验：$1 + 3 + 5 = 9$，每个样本恰好计了一次，且 $\\frac{22}{9}$ 小于总体最大值 $3$。\n\n> **注意。** 要按有序样本计数：最大值 $2$ 来自 $(1, 2)$、$(2, 1)$ 和 $(2, 2)$ 三个样本，而不是两个。按无序对计数会得到 $\\frac{1 + 2 \\cdot 2 + 3 \\cdot 3}{6} = \\frac{7}{3}$，这是错的，因为无序对并不等可能。",
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
    return numberProblem({
      prompt: t(
        `A population consists of $${a}, ${b}, ${c}$, equally likely. Samples of size $2$ are drawn with replacement. Find the expected value of the sample maximum.`,
        `总体由等可能的 $${a}, ${b}, ${c}$ 组成。有放回地抽取容量为 $2$ 的样本。求样本最大值的期望。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(c, "This is the population maximum, but many samples miss the largest value.", "这是总体最大值，但很多样本取不到最大的值。"),
        why(
          Q.of(a + b + c, 3),
          "This is the population mean, the expected value of one draw, not of the larger of two.",
          "这是总体均值，即一次抽取的期望，而不是两次中较大者的期望。",
        ),
        why(
          Q.of(a + 2 * b + 3 * c, 6),
          "This counts the $6$ unordered samples, but they are not equally likely: two different values occur in two orders.",
          "这按 $6$ 个无序样本计数，但它们并不等可能：两个不同的值有两种顺序。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Count the samples by their maximum", "按最大值给样本计数"],
            t(
              `Of the $9$ ordered samples, only $(${a}, ${a})$ has maximum $${a}$; $(${a}, ${b})$, $(${b}, ${a})$ and $(${b}, ${b})$ have maximum $${b}$; the other $5$ contain $${c}$ and have maximum $${c}$.`,
              `$9$ 个有序样本中，只有 $(${a}, ${a})$ 的最大值为 $${a}$；$(${a}, ${b})$、$(${b}, ${a})$、$(${b}, ${b})$ 的最大值为 $${b}$；其余 $5$ 个含有 $${c}$，最大值为 $${c}$。`,
            ),
          ],
          [
            ["Weight each maximum by its count", "按计数加权"],
            t(
              `$E[\\max] = \\frac{1 \\cdot ${a} + 3 \\cdot ${b} + 5 \\cdot ${c}}{9} = ${answer.toLatex()}$.`,
              `$E[\\max] = \\frac{1 \\cdot ${a} + 3 \\cdot ${b} + 5 \\cdot ${c}}{9} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The counts $1 + 3 + 5 = 9$ use up every sample, and $${answer.toLatex()}$ lies between the population mean $${Q.of(a + b + c, 3).toLatex()}$ and the maximum $${c}$.`,
          `计数 $1 + 3 + 5 = 9$ 用到了每个样本，且 $${answer.toLatex()}$ 介于总体均值 $${Q.of(a + b + c, 3).toLatex()}$ 与最大值 $${c}$ 之间。`,
        ),
      ),
    });
  },
);

const pooledReverse = point(
  "a-missing-sample-variance-from-the-pooled-variance",
  ["A missing sample variance from the pooled variance", "由合并方差求缺失的样本方差"],
  [
    "The pooled variance is a weighted average of the sample variances, with weights equal to the degrees of freedom. So it can be run backward: multiply it by the total degrees of freedom and subtract the part from the known sample.\n\nWith $n_{1} = 5$, $s_{1}^{2} = 10$, $n_{2} = 7$ and pooled variance $13$: the total is $(5 + 7 - 2) \\cdot 13 = 130$, removing $4 \\cdot 10 = 40$ leaves $90$, and $s_{2}^{2} = \\frac{90}{6} = 15$.\n\nCheck: $\\frac{4 \\cdot 10 + 6 \\cdot 15}{10} = \\frac{130}{10} = 13$, the given pooled variance.\n\n> **Watch out.** The weights are the degrees of freedom $n - 1$, not the sizes $n$, and they are unequal. Treating $13$ as the plain average of $10$ and $s_{2}^{2}$ gives $2 \\cdot 13 - 10 = 16$ instead of $15$.",
    "合并方差是各样本方差的加权平均，权重等于自由度。所以可以反过来计算：把它乘以总自由度，再减去已知样本的部分。\n\n若 $n_{1} = 5$，$s_{1}^{2} = 10$，$n_{2} = 7$，合并方差为 $13$：总和为 $(5 + 7 - 2) \\cdot 13 = 130$，减去 $4 \\cdot 10 = 40$ 剩 $90$，所以 $s_{2}^{2} = \\frac{90}{6} = 15$。\n\n检验：$\\frac{4 \\cdot 10 + 6 \\cdot 15}{10} = \\frac{130}{10} = 13$，正是给定的合并方差。\n\n> **注意。** 权重是自由度 $n - 1$，不是样本量 $n$，而且两者不相等。把 $13$ 当作 $10$ 与 $s_{2}^{2}$ 的简单平均，会得到 $2 \\cdot 13 - 10 = 16$，而不是 $15$。",
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
    return numberProblem({
      prompt: t(
        `Two samples have $n_{1} = ${n1}$, $s_{1}^{2} = ${s1}$ and $n_{2} = ${n2}$. Their pooled variance is $${pooled.toLatex()}$. Find $s_{2}^{2}$.`,
        `两个样本满足 $n_{1} = ${n1}$，$s_{1}^{2} = ${s1}$，$n_{2} = ${n2}$。它们的合并方差是 $${pooled.toLatex()}$。求 $s_{2}^{2}$。`,
      ),
      answer: s2,
      wrong: [s1],
      mistakes: unlike(s2, [
        why(
          pooled.mul(Q.of(2)).sub(Q.of(s1)),
          "This treats the pooled variance as the plain average of the two sample variances, but it weights them by their degrees of freedom.",
          "这把合并方差当作两个样本方差的简单平均，但它是按自由度加权的。",
        ),
        why(
          pooled
            .mul(Q.of(n1 + n2))
            .sub(Q.of(n1 * s1))
            .div(Q.of(n2)),
          "This weights by the sample sizes $n$; the weights are the degrees of freedom $n - 1$.",
          "这按样本量 $n$ 加权；权重应是自由度 $n - 1$。",
        ),
        why(pooled, "This is the pooled variance itself, not the missing sample variance.", "这是合并方差本身，不是缺失的样本方差。"),
      ]),
      solution: walked(
        [
          [
            ["Undo the average", "还原加权总和"],
            t(
              `The weighted total is $(n_{1} + n_{2} - 2)s_{p}^{2} = ${df} \\cdot ${pooled.toLatex()} = ${top}$.`,
              `加权总和为 $(n_{1} + n_{2} - 2)s_{p}^{2} = ${df} \\cdot ${pooled.toLatex()} = ${top}$。`,
            ),
          ],
          [
            ["Remove the known sample", "减去已知样本"],
            t(
              `$${top} - ${n1 - 1} \\cdot ${s1} = ${top} - ${(n1 - 1) * s1} = ${(n2 - 1) * s2}$, which is $(n_{2} - 1)s_{2}^{2}$.`,
              `$${top} - ${n1 - 1} \\cdot ${s1} = ${top} - ${(n1 - 1) * s1} = ${(n2 - 1) * s2}$，这就是 $(n_{2} - 1)s_{2}^{2}$。`,
            ),
          ],
          [
            ["Divide by its degrees of freedom", "除以其自由度"],
            t(`$s_{2}^{2} = \\frac{${(n2 - 1) * s2}}{${n2 - 1}} = ${s2}$.`, `$s_{2}^{2} = \\frac{${(n2 - 1) * s2}}{${n2 - 1}} = ${s2}$。`),
          ],
        ],
        t(
          `$\\frac{${n1 - 1} \\cdot ${s1} + ${n2 - 1} \\cdot ${s2}}{${df}} = \\frac{${top}}{${df}} = ${pooled.toLatex()}$, the given pooled variance.`,
          `$\\frac{${n1 - 1} \\cdot ${s1} + ${n2 - 1} \\cdot ${s2}}{${df}} = \\frac{${top}}{${df}} = ${pooled.toLatex()}$，正是给定的合并方差。`,
        ),
      ),
    });
  },
);

const seScaling = point(
  "the-cost-of-shrinking-the-standard-error",
  ["The cost of shrinking the standard error", "缩小标准误的代价"],
  [
    "The standard error of the mean is $\\frac{\\sigma}{\\sqrt{n}}$, so it falls only with the square root of the sample size. Dividing it by $k$ therefore needs $k^{2}$ times as many observations, and doubling the precision costs four times the data.\n\nA sample of $30$ whose standard error must become $3$ times smaller needs $30 \\cdot 3^{2} = 270$ observations.\n\nCheck: $\\frac{\\sigma / \\sqrt{30}}{\\sigma / \\sqrt{270}} = \\sqrt{\\frac{270}{30}} = \\sqrt{9} = 3$.\n\n> **Watch out.** Multiplying the sample size by $k$ shrinks the standard error only by $\\sqrt{k}$: $30 \\cdot 3 = 90$ observations make it $\\sqrt{3} \\approx 1.73$ times smaller, not $3$ times.",
    "均值的标准误是 $\\frac{\\sigma}{\\sqrt{n}}$，所以它只随样本量的平方根下降。把它除以 $k$ 需要 $k^{2}$ 倍的观测，精度提高一倍要花四倍的数据。\n\n容量为 $30$ 的样本，若要使标准误缩小为原来的 $\\frac{1}{3}$，需要 $30 \\cdot 3^{2} = 270$ 个观测。\n\n检验：$\\frac{\\sigma / \\sqrt{30}}{\\sigma / \\sqrt{270}} = \\sqrt{\\frac{270}{30}} = \\sqrt{9} = 3$。\n\n> **注意。** 样本量乘以 $k$，标准误只缩小为 $\\frac{1}{\\sqrt{k}}$：$30 \\cdot 3 = 90$ 个观测只使它缩小约 $1.73$ 倍，而不是 $3$ 倍。",
  ],
  (rng) => {
    const n = rng.int(5, 100);
    const k = rng.int(2, 5);
    const answer = n * k * k;
    return numberProblem({
      prompt: t(
        `A sample of $${n}$ gives a certain standard error of the mean. What sample size makes the standard error $${k}$ times smaller?`,
        `容量为 $${n}$ 的样本给出某个均值标准误。多大的样本量能使标准误缩小为原来的 $\\frac{1}{${k}}$？`,
      ),
      answer,
      wrong: [2 * n * k],
      mistakes: unlike(answer, [
        why(
          n * k,
          `This multiplies $n$ by $${k}$, which shrinks the standard error only by $\\sqrt{${k}}$.`,
          `这把 $n$ 乘以 $${k}$，标准误只缩小为原来的 $\\frac{1}{\\sqrt{${k}}}$。`,
        ),
        why(
          n + k * k,
          `This adds $${k}^{2}$ to the sample size; the factor $${k}^{2}$ multiplies it.`,
          `这把 $${k}^{2}$ 加到样本量上；应当乘以 $${k}^{2}$。`,
        ),
        why(
          Q.of(n, k * k),
          "This divides the sample size, but a smaller sample makes the standard error larger.",
          "这把样本量除小了，但样本越小标准误越大。",
        ),
      ]),
      solution: walked(
        [
          [
            ["See how the standard error scales", "看标准误如何变化"],
            t(
              `$\\frac{\\sigma}{\\sqrt{n}}$ becomes $${k}$ times smaller exactly when $\\sqrt{n}$ becomes $${k}$ times larger.`,
              `$\\frac{\\sigma}{\\sqrt{n}}$ 缩小为 $\\frac{1}{${k}}$，当且仅当 $\\sqrt{n}$ 增大到 $${k}$ 倍。`,
            ),
          ],
          [
            ["Square the factor", "把倍数平方"],
            t(
              `So $n$ grows by $${k}^{2} = ${k * k}$: $${n} \\cdot ${k * k} = ${answer}$.`,
              `所以 $n$ 增大到 $${k}^{2} = ${k * k}$ 倍：$${n} \\cdot ${k * k} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$\\frac{\\sigma / \\sqrt{${n}}}{\\sigma / \\sqrt{${answer}}} = \\sqrt{\\frac{${answer}}{${n}}} = \\sqrt{${k * k}} = ${k}$.`,
          `$\\frac{\\sigma / \\sqrt{${n}}}{\\sigma / \\sqrt{${answer}}} = \\sqrt{\\frac{${answer}}{${n}}} = \\sqrt{${k * k}} = ${k}$。`,
        ),
      ),
    });
  },
);

const meanCutoff = point(
  "a-cutoff-for-the-sample-mean-from-a-probability",
  ["A cutoff for the sample mean from a probability", "由概率求样本均值的分界点"],
  [
    "A probability for the sample mean can be read backward. The table turns the probability into a value of $z$, and the cutoff is then $\\mu$ plus $z$ standard errors. The standard error, $\\frac{\\sigma}{\\sqrt{n}}$, is the scale to use, not $\\sigma$ itself.\n\nFor $n = 16$ from $N(100, 64)$, the standard error is $\\frac{8}{4} = 2$. If $P(\\bar{X} \\le c) = 0.9772 = \\Phi(2)$, then $c = 100 + 2 \\cdot 2 = 104$.\n\nCheck: $\\frac{104 - 100}{2} = 2$, and $\\Phi(2) = 0.9772$.\n\n> **Watch out.** Scale $z$ by the standard error, not by $\\sigma$: $100 + 2 \\cdot 8 = 116$ is the cutoff for one observation, not for the mean of $16$. And a probability above one half for $\\bar{X} \\le c$ puts $c$ above the mean, not below it.",
    "样本均值的概率可以反过来读。分布表把概率转换成 $z$ 值，分界点就是 $\\mu$ 加上 $z$ 个标准误。要用的尺度是标准误 $\\frac{\\sigma}{\\sqrt{n}}$，而不是 $\\sigma$ 本身。\n\n从 $N(100, 64)$ 中抽取 $n = 16$，标准误为 $\\frac{8}{4} = 2$。若 $P(\\bar{X} \\le c) = 0.9772 = \\Phi(2)$，则 $c = 100 + 2 \\cdot 2 = 104$。\n\n检验：$\\frac{104 - 100}{2} = 2$，而 $\\Phi(2) = 0.9772$。\n\n> **注意。** $z$ 要乘以标准误，而不是 $\\sigma$：$100 + 2 \\cdot 8 = 116$ 是单个观测的分界点，不是 $16$ 个观测均值的分界点。另外，$\\bar{X} \\le c$ 的概率大于二分之一说明 $c$ 在均值之上，而不是之下。",
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
    return numberProblem({
      prompt: t(
        `A sample of $n = ${k * k}$ is taken from $N(${mu}, ${sigma * sigma})$. Find $c$ with $P(${event}) = ${p}$. Use $${given(z)}$.`,
        `从 $N(${mu}, ${sigma * sigma})$ 中抽取容量为 $n = ${k * k}$ 的样本。求 $c$，使 $P(${event}) = ${p}$。利用 $${given(z)}$。`,
      ),
      answer,
      form: "decimal",
      mistakes: unlike(answer, [
        why(
          below ? Q.of(mu).sub(shift) : Q.of(mu).add(shift),
          `This puts the cutoff on the wrong side of $${mu}$: a probability above one half for $${event}$ needs $c$ ${below ? "above" : "below"} the mean.`,
          `这把分界点放在了 $${mu}$ 的另一侧：$${event}$ 的概率大于二分之一，要求 $c$ 在均值${below ? "之上" : "之下"}。`,
        ),
        why(
          below ? Q.of(mu).add(Q.of(z * sigma, 100)) : Q.of(mu).sub(Q.of(z * sigma, 100)),
          `This scales $z$ by $\\sigma = ${sigma}$; the sample mean has standard error $\\frac{\\sigma}{\\sqrt{n}} = ${se}$.`,
          `这把 $z$ 乘以了 $\\sigma = ${sigma}$；样本均值的标准误是 $\\frac{\\sigma}{\\sqrt{n}} = ${se}$。`,
        ),
        why(Q.of(mu), "This is the mean, the cutoff for a probability of one half.", "这是均值，是概率为二分之一时的分界点。"),
      ]),
      solution: walked(
        [
          [
            ["Find the standard error", "求标准误"],
            t(
              `$\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{${k}} = ${se}$.`,
              `$\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{${k}} = ${se}$。`,
            ),
          ],
          [
            ["Read $z$ from the table", "由表读出 $z$"],
            t(
              `$${p} = \\Phi(${zText(z)})$, and a probability above one half for $${event}$ puts $c$ ${below ? "above" : "below"} the mean, at $z = ${below ? "" : "-"}${zText(z)}$.`,
              `$${p} = \\Phi(${zText(z)})$，而 $${event}$ 的概率大于二分之一，说明 $c$ 在均值${below ? "之上" : "之下"}，对应 $z = ${below ? "" : "-"}${zText(z)}$。`,
            ),
          ],
          [
            ["Convert back", "换算回去"],
            t(
              `$c = ${mu} ${sign} ${zText(z)} \\cdot ${se} = ${dec(answer)}$.`,
              `$c = ${mu} ${sign} ${zText(z)} \\cdot ${se} = ${dec(answer)}$。`,
            ),
          ],
        ],
        t(
          `$${se === 1 ? `${dec(answer)} - ${mu}` : `\\frac{${dec(answer)} - ${mu}}{${se}}`} = ${below ? "" : "-"}${zText(z)}$, and ${below ? `$P(\\bar{X} \\le c) = \\Phi(${zText(z)})` : `$P(\\bar{X} > c) = 1 - \\Phi(-${zText(z)}) = \\Phi(${zText(z)})`} = ${p}$.`,
          `$${se === 1 ? `${dec(answer)} - ${mu}` : `\\frac{${dec(answer)} - ${mu}}{${se}}`} = ${below ? "" : "-"}${zText(z)}$，而${below ? `$P(\\bar{X} \\le c) = \\Phi(${zText(z)})` : `$P(\\bar{X} > c) = 1 - \\Phi(-${zText(z)}) = \\Phi(${zText(z)})`} = ${p}$。`,
        ),
      ),
    });
  },
);

const allSuccesses = point(
  "the-chance-of-a-sample-proportion-of-one",
  ["The chance of a sample proportion of one", "样本比例为一的概率"],
  [
    "Drawing without replacement from a finite population changes the proportion after each draw, so the draws are dependent. The probability that every draw is a success is a product of falling fractions, and squaring the population proportion would overstate it.\n\nWith $4$ successes among $10$, two draws without replacement both succeed with probability $\\frac{4}{10} \\cdot \\frac{3}{9} = \\frac{12}{90} = \\frac{2}{15}$.\n\nCheck: choosing $2$ of the $4$ successes out of all pairs gives $\\frac{\\binom{4}{2}}{\\binom{10}{2}} = \\frac{6}{45} = \\frac{2}{15}$.\n\n> **Watch out.** After a success is drawn, one fewer success and one fewer member remain. Squaring $\\frac{4}{10}$ gives $\\frac{4}{25}$, the answer with replacement, which is larger than $\\frac{2}{15}$.",
    "从有限总体中不放回抽样时，每次抽取后比例都会改变，所以各次抽取相依。每次都成功的概率是递减分数之积，而把总体比例平方会高估它。\n\n$10$ 个中有 $4$ 个成功，不放回抽两次都成功的概率为 $\\frac{4}{10} \\cdot \\frac{3}{9} = \\frac{12}{90} = \\frac{2}{15}$。\n\n检验：从所有的对中选出 $4$ 个成功中的 $2$ 个，得 $\\frac{\\binom{4}{2}}{\\binom{10}{2}} = \\frac{6}{45} = \\frac{2}{15}$。\n\n> **注意。** 抽到一个成功后，剩下的成功和总数都少了一个。把 $\\frac{4}{10}$ 平方得 $\\frac{4}{25}$，那是有放回时的答案，比 $\\frac{2}{15}$ 大。",
  ],
  (rng) => {
    const N = rng.int(10, 60);
    const K = rng.int(3, N - 2);
    const answer = Q.of(K * (K - 1), N * (N - 1));
    const pairs = answer.toLatex() === `\\frac{${(K * (K - 1)) / 2}}{${(N * (N - 1)) / 2}}` ? "" : ` = ${answer.toLatex()}`;
    return numberProblem({
      prompt: t(
        `A population of $${N}$ has $${K}$ successes. A sample of $2$ is drawn without replacement. Find $P(\\hat{p} = 1)$.`,
        `总体共 $${N}$ 个，其中 $${K}$ 个成功。不放回地抽取容量为 $2$ 的样本。求 $P(\\hat{p} = 1)$。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          Q.of(K * K, N * N),
          `This squares $\\frac{${K}}{${N}}$, as if the first success were put back before the second draw.`,
          `这把 $\\frac{${K}}{${N}}$ 平方，好像第一次抽到的成功在第二次抽取前被放回了。`,
        ),
        why(Q.of(K, N), "This is the chance that one draw succeeds; both draws must succeed.", "这是一次抽取成功的概率；需要两次都成功。"),
        why(
          Q.of(K * (K - 1), N * N),
          `This lowers the successes to $${K - 1}$ but leaves $${N}$ members for the second draw; $${N - 1}$ remain.`,
          `这把成功数减为 $${K - 1}$，但第二次抽取仍按 $${N}$ 个计算；实际只剩 $${N - 1}$ 个。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["The first draw", "第一次抽取"],
            t(`It succeeds with probability $\\frac{${K}}{${N}}$.`, `成功的概率为 $\\frac{${K}}{${N}}$。`),
          ],
          [
            ["The second draw", "第二次抽取"],
            t(
              `Given a success, $${K - 1}$ successes remain among $${N - 1}$, so it succeeds with probability $\\frac{${K - 1}}{${N - 1}}$.`,
              `已抽到一个成功后，剩下 $${N - 1}$ 个中有 $${K - 1}$ 个成功，所以成功的概率为 $\\frac{${K - 1}}{${N - 1}}$。`,
            ),
          ],
          [
            ["Multiply", "相乘"],
            t(
              `$\\frac{${K}}{${N}} \\cdot \\frac{${K - 1}}{${N - 1}} = \\frac{${K * (K - 1)}}{${N * (N - 1)}} = ${answer.toLatex()}$.`,
              `$\\frac{${K}}{${N}} \\cdot \\frac{${K - 1}}{${N - 1}} = \\frac{${K * (K - 1)}}{${N * (N - 1)}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `Counting pairs instead, $\\frac{\\binom{${K}}{2}}{\\binom{${N}}{2}} = \\frac{${(K * (K - 1)) / 2}}{${(N * (N - 1)) / 2}}${pairs}$.`,
          `改为数对：$\\frac{\\binom{${K}}{2}}{\\binom{${N}}{2}} = \\frac{${(K * (K - 1)) / 2}}{${(N * (N - 1)) / 2}}${pairs}$。`,
        ),
      ),
    });
  },
);

const cltTwoValues = point(
  "the-clt-for-a-two-valued-population",
  ["The CLT for a two-valued population", "两值总体的中心极限定理"],
  [
    "The population need not look normal for the central limit theorem to apply: even a population with two values gives an approximately normal sample mean. The population variance has to be computed first, and then it is divided by the sample size.\n\nFor the values $0$ and $6$, each with probability $\\frac{1}{2}$, the mean is $3$ and each value is $3$ away from it, so $\\sigma^{2} = 3^{2} = 9$. For $n = 36$, $\\bar{X}$ is approximately normal with variance $\\frac{9}{36} = \\frac{1}{4}$.\n\nCheck: $E(X^{2}) - (EX)^{2} = \\frac{0 + 36}{2} - 3^{2} = 9$.\n\n> **Watch out.** The variance of $\\bar{X}$ is $\\frac{\\sigma^{2}}{n}$, not $\\sigma^{2}$: here $9$ would be the spread of one observation. And the distance from the mean is half the gap, so $\\sigma^{2} = \\frac{6^{2}}{4}$, not $6^{2}$.",
    "应用中心极限定理时，总体不必看起来像正态分布：即使总体只有两个值，样本均值也近似服从正态分布。要先算出总体方差，再除以样本量。\n\n取值 $0$ 和 $6$，概率各为 $\\frac{1}{2}$，均值为 $3$，每个值与它相距 $3$，所以 $\\sigma^{2} = 3^{2} = 9$。当 $n = 36$ 时，$\\bar{X}$ 近似服从方差为 $\\frac{9}{36} = \\frac{1}{4}$ 的正态分布。\n\n检验：$E(X^{2}) - (EX)^{2} = \\frac{0 + 36}{2} - 3^{2} = 9$。\n\n> **注意。** $\\bar{X}$ 的方差是 $\\frac{\\sigma^{2}}{n}$，不是 $\\sigma^{2}$：这里的 $9$ 是单个观测的离散程度。另外，与均值的距离是差的一半，所以 $\\sigma^{2} = \\frac{6^{2}}{4}$，而不是 $6^{2}$。",
  ],
  (rng) => {
    const a = rng.int(-9, 9);
    const b = a + nz(rng, 8);
    const n = rng.int(30, 100);
    const gap = (a - b) ** 2;
    const answer = Q.of(gap, 4 * n);
    const mean = Q.of(a + b, 2);
    const meanTex = mean.sign() < 0 || !mean.isInteger() ? `\\left(${mean.toLatex()}\\right)` : mean.toLatex();
    const sq = (v: number) => (v < 0 ? `(${v})^{2}` : `${v}^{2}`);
    const variance = Q.of(gap, 4);
    return numberProblem({
      prompt: t(
        `A population takes the values $${a}$ and $${b}$, each with probability $\\frac{1}{2}$. For a sample of $n = ${n}$, find the variance of the approximate normal distribution of $\\bar{X}$.`,
        `总体取值 $${a}$ 和 $${b}$，概率都是 $\\frac{1}{2}$。对容量为 $n = ${n}$ 的样本，求 $\\bar{X}$ 的近似正态分布的方差。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          variance,
          "This is the population variance, the spread of one observation; the mean of $n$ divides it by $n$.",
          "这是总体方差，即单个观测的离散程度；$n$ 个观测的均值要再除以 $n$。",
        ),
        why(
          Q.of(Math.abs(a - b), 2 * n),
          "This divides the standard deviation by $n$; it is the variance that is divided by $n$.",
          "这把标准差除以了 $n$；除以 $n$ 的应是方差。",
        ),
        why(
          Q.of(gap, n),
          `This takes the squared gap $${gap}$ as the variance, but each value is only half the gap from the mean.`,
          `这把差的平方 $${gap}$ 当作方差，但每个值与均值只相距差的一半。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the population variance", "求总体方差"],
            t(
              `The mean is $${mean.toLatex()}$, and each value is $${Q.of(Math.abs(a - b), 2).toLatex()}$ from it, so $\\sigma^{2} = \\frac{${gap}}{4}${variance.toLatex() === `\\frac{${gap}}{4}` ? "" : ` = ${variance.toLatex()}`}$.`,
              `均值为 $${mean.toLatex()}$，每个值与它相距 $${Q.of(Math.abs(a - b), 2).toLatex()}$，所以 $\\sigma^{2} = \\frac{${gap}}{4}${variance.toLatex() === `\\frac{${gap}}{4}` ? "" : ` = ${variance.toLatex()}`}$。`,
            ),
          ],
          [
            ["Divide by the sample size", "除以样本量"],
            t(
              `By the central limit theorem, $\\operatorname{Var}(\\bar{X}) \\approx \\frac{\\sigma^{2}}{n} = \\frac{${gap}}{4 \\cdot ${n}} = ${answer.toLatex()}$.`,
              `由中心极限定理，$\\operatorname{Var}(\\bar{X}) \\approx \\frac{\\sigma^{2}}{n} = \\frac{${gap}}{4 \\cdot ${n}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$E(X^{2}) - (EX)^{2} = \\frac{${sq(a)} + ${sq(b)}}{2} - ${meanTex}^{2} = ${Q.of(a * a + b * b, 2).toLatex()} - ${mean.mul(mean).toLatex()} = ${variance.toLatex()}$, the same population variance.`,
          `$E(X^{2}) - (EX)^{2} = \\frac{${sq(a)} + ${sq(b)}}{2} - ${meanTex}^{2} = ${Q.of(a * a + b * b, 2).toLatex()} - ${mean.mul(mean).toLatex()} = ${variance.toLatex()}$，与总体方差相同。`,
        ),
      ),
    });
  },
);

const cltSampleSize = point(
  "the-sample-size-that-pins-down-the-mean",
  ["The sample size that pins down the mean", "确定均值所需的样本量"],
  [
    "The central limit theorem can be turned around to plan a sample. Requiring $z\\frac{\\sigma}{\\sqrt{n}} \\le E$ gives $n \\ge \\left(\\frac{z\\sigma}{E}\\right)^{2}$. Since this is a lower bound and $n$ is a whole number, any fractional result must be rounded up.\n\nFor $\\sigma = 10$, $E = 3$ and $z = 2$: $n \\ge \\left(\\frac{2 \\cdot 10}{3}\\right)^{2} = \\frac{400}{9} \\approx 44.4$, so $n = 45$.\n\nCheck: $2 \\cdot \\frac{10}{\\sqrt{45}} \\approx 2.98 \\le 3$, while $2 \\cdot \\frac{10}{\\sqrt{44}} \\approx 3.02$ is too wide.\n\n> **Watch out.** Round up even when the decimal is small: $44$ observations leave the margin above $3$. And square the ratio: $\\frac{2 \\cdot 10}{3} \\approx 6.7$ is $\\sqrt{n}$, not $n$.",
    "中心极限定理可以反过来用于规划样本。要求 $z\\frac{\\sigma}{\\sqrt{n}} \\le E$，得 $n \\ge \\left(\\frac{z\\sigma}{E}\\right)^{2}$。由于这是下界而 $n$ 是整数，所以小数结果必须向上取整。\n\n若 $\\sigma = 10$，$E = 3$，$z = 2$：$n \\ge \\left(\\frac{2 \\cdot 10}{3}\\right)^{2} = \\frac{400}{9} \\approx 44.4$，所以 $n = 45$。\n\n检验：$2 \\cdot \\frac{10}{\\sqrt{45}} \\approx 2.98 \\le 3$，而 $2 \\cdot \\frac{10}{\\sqrt{44}} \\approx 3.02$ 偏宽。\n\n> **注意。** 即使小数部分很小也要向上取整：$44$ 个观测会使误差界超过 $3$。另外要把比值平方：$\\frac{2 \\cdot 10}{3} \\approx 6.7$ 是 $\\sqrt{n}$，不是 $n$。",
  ],
  (rng) => {
    const sigma = rng.int(3, 30);
    const E = rng.int(1, Math.min(6, sigma - 1));
    const bound = Q.of(4 * sigma * sigma, E * E);
    const answer = Math.ceil((4 * sigma * sigma) / (E * E));
    const low = answer - 1;
    const squared = (m: number) => Q.of(4 * sigma * sigma, m).toLatex();
    const ratio = E === 1 ? `2 \\cdot ${sigma}` : `\\frac{2 \\cdot ${sigma}}{${E}}`;
    return numberProblem({
      prompt: t(
        `A population has $\\sigma = ${sigma}$. Using $z = 2$ for $95\\%$, find the smallest $n$ so that $\\bar{X}$ lies within $${E}$ of $\\mu$ with this probability.`,
        `总体的 $\\sigma = ${sigma}$。对 $95\\%$ 取 $z = 2$，求最小的 $n$，使 $\\bar{X}$ 以这个概率落在 $\\mu$ 的 $${E}$ 范围内。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          low,
          `This is one short: $n$ must be at least $${bound.toLatex()}$, and $${low}$ is below that.`,
          `这少了一个：$n$ 至少为 $${bound.toLatex()}$，而 $${low}$ 小于它。`,
        ),
        why(
          Math.ceil((2 * sigma) / E),
          `This rounds $${ratio}$ without squaring it; that ratio is $\\sqrt{n}$.`,
          `这把 $${ratio}$ 取整而没有平方；这个比值是 $\\sqrt{n}$。`,
        ),
        why(
          Math.ceil((sigma * sigma) / (E * E)),
          "This leaves out $z = 2$, which allows only about $68\\%$ instead of $95\\%$.",
          "这漏掉了 $z = 2$，只对应约 $68\\%$，而不是 $95\\%$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Set the margin", "列出误差界"],
            t(
              `We need $2 \\cdot \\frac{${sigma}}{\\sqrt{n}} \\le ${E}$, that is $\\sqrt{n} \\ge ${ratio}$.`,
              `需要 $2 \\cdot \\frac{${sigma}}{\\sqrt{n}} \\le ${E}$，即 $\\sqrt{n} \\ge ${ratio}$。`,
            ),
          ],
          [
            ["Square and round up", "平方并向上取整"],
            t(
              `$n \\ge \\left(${ratio}\\right)^{2} = ${bound.toLatex()}$, and the smallest whole number meeting this is $${answer}$.`,
              `$n \\ge \\left(${ratio}\\right)^{2} = ${bound.toLatex()}$，满足条件的最小整数是 $${answer}$。`,
            ),
          ],
        ],
        t(
          `The squared margin is $\\frac{4 \\cdot ${sigma * sigma}}{n}$. For $n = ${answer}$ it is $${squared(answer)} \\le ${E * E}$, the square of $${E}$${low > 0 ? `, while for $n = ${low}$ it is $${squared(low)} > ${E * E}$` : ""}.`,
          `误差界的平方为 $\\frac{4 \\cdot ${sigma * sigma}}{n}$。$n = ${answer}$ 时它等于 $${squared(answer)} \\le ${E * E}$，即 $${E}$ 的平方${low > 0 ? `；而 $n = ${low}$ 时它等于 $${squared(low)} > ${E * E}$` : ""}。`,
        ),
      ),
    });
  },
);

const populationFromFactor = point(
  "the-population-size-from-the-correction-factor",
  ["The population size from the correction factor", "由校正因子求总体大小"],
  [
    "The variance correction $\\frac{N - n}{N - 1}$ can be solved for $N$. Setting it equal to a known factor $r$ gives a linear equation, with solution $N = \\frac{n - r}{1 - r}$, so an observed reduction reveals how large the population is.\n\nFor $n = 10$ and $r = \\frac{9}{10}$: $N - 10 = \\frac{9}{10}(N - 1)$, so $\\frac{1}{10}N = 10 - \\frac{9}{10} = \\frac{91}{10}$ and $N = 91$.\n\nCheck: $\\frac{91 - 10}{91 - 1} = \\frac{81}{90} = \\frac{9}{10}$.\n\n> **Watch out.** The denominator is $N - 1$, not $N$. Solving $\\frac{N - 10}{N} = \\frac{9}{10}$ instead gives $N = 100$, and then $\\frac{100 - 10}{99} = \\frac{10}{11}$, not $\\frac{9}{10}$.",
    "方差校正 $\\frac{N - n}{N - 1}$ 可以解出 $N$。令它等于已知因子 $r$，得到一个线性方程，解为 $N = \\frac{n - r}{1 - r}$，所以观察到的缩小幅度能说明总体有多大。\n\n若 $n = 10$，$r = \\frac{9}{10}$：$N - 10 = \\frac{9}{10}(N - 1)$，所以 $\\frac{1}{10}N = 10 - \\frac{9}{10} = \\frac{91}{10}$，$N = 91$。\n\n检验：$\\frac{91 - 10}{91 - 1} = \\frac{81}{90} = \\frac{9}{10}$。\n\n> **注意。** 分母是 $N - 1$，不是 $N$。若解 $\\frac{N - 10}{N} = \\frac{9}{10}$，会得到 $N = 100$，而 $\\frac{100 - 10}{99} = \\frac{10}{11}$，不是 $\\frac{9}{10}$。",
  ],
  (rng) => {
    const n = rng.int(5, 40);
    const N = n + rng.int(2, 150);
    const r = Q.of(N - n, N - 1);
    const rest = Q.one.sub(r);
    return numberProblem({
      prompt: t(
        `A sample of $n = ${n}$ is drawn without replacement, and $\\frac{N - n}{N - 1} = ${r.toLatex()}$. Find the population size $N$.`,
        `不放回地抽取容量为 $n = ${n}$ 的样本，且 $\\frac{N - n}{N - 1} = ${r.toLatex()}$。求总体大小 $N$。`,
      ),
      answer: N,
      wrong: [N + 1, N - 1],
      mistakes: unlike(N, [
        why(
          Q.of(n).div(rest),
          "This solves $\\frac{N - n}{N} = r$, leaving out the $-1$ in the denominator $N - 1$.",
          "这解的是 $\\frac{N - n}{N} = r$，漏掉了分母 $N - 1$ 中的 $-1$。",
        ),
        why(
          Q.of(n).div(r),
          "This treats $r$ as the sampling fraction $\\frac{n}{N}$, but $r$ is the share of the variance that remains.",
          "这把 $r$ 当作抽样比 $\\frac{n}{N}$，但 $r$ 是方差保留下来的份额。",
        ),
      ]),
      solution: walked(
        [
          [["Clear the fraction", "去分母"], t(`$N - ${n} = ${r.toLatex()}(N - 1)$.`, `$N - ${n} = ${r.toLatex()}(N - 1)$。`)],
          [
            ["Collect the terms in $N$", "合并含 $N$ 的项"],
            t(
              `$${rest.toLatex()}N = ${n} - ${r.toLatex()} = ${Q.of(n).sub(r).toLatex()}$, so $N = ${Q.of(n).sub(r).toLatex()} \\div ${rest.toLatex()} = ${N}$.`,
              `$${rest.toLatex()}N = ${n} - ${r.toLatex()} = ${Q.of(n).sub(r).toLatex()}$，所以 $N = ${Q.of(n).sub(r).toLatex()} \\div ${rest.toLatex()} = ${N}$。`,
            ),
          ],
        ],
        t(
          `$\\frac{${N} - ${n}}{${N} - 1} = \\frac{${N - n}}{${N - 1}}${Q.of(N - n, N - 1).toLatex() === `\\frac{${N - n}}{${N - 1}}` ? "" : ` = ${r.toLatex()}`}$, the given factor.`,
          `$\\frac{${N} - ${n}}{${N} - 1} = \\frac{${N - n}}{${N - 1}}${Q.of(N - n, N - 1).toLatex() === `\\frac{${N - n}}{${N - 1}}` ? "" : ` = ${r.toLatex()}`}$，正是给定的因子。`,
        ),
      ),
    });
  },
);

const shareRemoved = point(
  "the-share-of-variance-the-correction-removes",
  ["The share of variance the correction removes", "校正去掉的方差份额"],
  [
    "The correction multiplies the variance by $\\frac{N - n}{N - 1}$, so the share removed is one minus this factor, which is $\\frac{n - 1}{N - 1}$. It is close to the sampling fraction, and it grows to the whole variance when the sample is the entire population.\n\nFor $n = 21$ from $N = 201$, the variance is multiplied by $\\frac{180}{200} = \\frac{9}{10}$, so the correction removes $\\frac{20}{200} = \\frac{1}{10}$ of it.\n\nCheck: $\\frac{9}{10} + \\frac{1}{10} = 1$, the kept share and the removed share make up the whole variance.\n\n> **Watch out.** The factor $\\frac{N - n}{N - 1}$ is the share that remains, not the share removed: $\\frac{9}{10}$ above is what is kept. The removed share is close to the sampling fraction $\\frac{21}{201}$ but not equal to it.",
    "校正把方差乘以 $\\frac{N - n}{N - 1}$，所以去掉的份额是一减去这个因子，即 $\\frac{n - 1}{N - 1}$。它接近抽样比，当样本就是整个总体时，它增大到全部方差。\n\n从 $N = 201$ 中抽取 $n = 21$，方差乘以 $\\frac{180}{200} = \\frac{9}{10}$，所以校正去掉了其中的 $\\frac{20}{200} = \\frac{1}{10}$。\n\n检验：$\\frac{9}{10} + \\frac{1}{10} = 1$，保留的份额与去掉的份额合起来是全部方差。\n\n> **注意。** 因子 $\\frac{N - n}{N - 1}$ 是保留下来的份额，不是去掉的份额：上面的 $\\frac{9}{10}$ 是保留的部分。去掉的份额接近抽样比 $\\frac{21}{201}$，但并不相等。",
  ],
  (rng) => {
    const n = rng.int(5, 80);
    const N = n + rng.int(5, 400);
    const answer = Q.of(n - 1, N - 1);
    const kept = Q.of(N - n, N - 1);
    return numberProblem({
      prompt: t(
        `A sample of $n = ${n}$ is drawn without replacement from $N = ${N}$. What fraction of the variance of $\\hat{p}$ does the finite population correction remove?`,
        `从 $N = ${N}$ 中不放回地抽取容量为 $n = ${n}$ 的样本。有限总体校正去掉了 $\\hat{p}$ 方差的多大比例？`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          kept,
          "This is the share of the variance that the correction keeps, not the share it removes.",
          "这是校正保留下来的方差份额，不是去掉的份额。",
        ),
        why(
          Q.of(n, N),
          "This is the sampling fraction $\\frac{n}{N}$, close to the removed share but not equal to it.",
          "这是抽样比 $\\frac{n}{N}$，接近去掉的份额，但并不相等。",
        ),
        why(
          Q.of(n, N - 1),
          "This takes $1 - \\frac{N - n}{N - 1}$ as $\\frac{n}{N - 1}$, but the numerators differ by one: $N - 1 - (N - n) = n - 1$.",
          "这把 $1 - \\frac{N - n}{N - 1}$ 算成了 $\\frac{n}{N - 1}$，但分子相差一：$N - 1 - (N - n) = n - 1$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["The factor that is kept", "保留的因子"],
            t(
              `The correction multiplies the variance by $\\frac{N - n}{N - 1} = \\frac{${N - n}}{${N - 1}}$.`,
              `校正把方差乘以 $\\frac{N - n}{N - 1} = \\frac{${N - n}}{${N - 1}}$。`,
            ),
          ],
          [
            ["Take the rest", "取其余部分"],
            t(
              `The share removed is $1 - \\frac{${N - n}}{${N - 1}} = \\frac{${n - 1}}{${N - 1}}${answer.toLatex() === `\\frac{${n - 1}}{${N - 1}}` ? "" : ` = ${answer.toLatex()}`}$.`,
              `去掉的份额为 $1 - \\frac{${N - n}}{${N - 1}} = \\frac{${n - 1}}{${N - 1}}${answer.toLatex() === `\\frac{${n - 1}}{${N - 1}}` ? "" : ` = ${answer.toLatex()}`}$。`,
            ),
          ],
        ],
        t(
          `$\\frac{${N - n}}{${N - 1}} + \\frac{${n - 1}}{${N - 1}} = \\frac{${N - 1}}{${N - 1}} = 1$: the kept and removed shares make up the whole variance.`,
          `$\\frac{${N - n}}{${N - 1}} + \\frac{${n - 1}}{${N - 1}} = \\frac{${N - 1}}{${N - 1}} = 1$：保留与去掉的份额合起来是全部方差。`,
        ),
      ),
    });
  },
);

const uniformMle = point(
  "maximizing-the-likelihood-of-a-uniform-sample",
  ["Maximizing the likelihood of a uniform sample", "最大化均匀样本的似然"],
  [
    "For a sample from $U(0, \\theta)$, the likelihood is $\\theta^{-n}$ when $\\theta$ covers every observation and zero otherwise. It decreases in $\\theta$, so its maximum is at the smallest allowed value, the sample maximum. Setting a derivative to zero does not find this.\n\nFor the sample $3, 8, 5$: $L(\\theta) = \\theta^{-3}$ for $\\theta \\ge 8$ and $0$ below, so the likelihood is largest at $\\theta = 8$.\n\nCheck: $L(8) = \\frac{1}{512}$ is larger than $L(9) = \\frac{1}{729}$, while $L(7) = 0$ because the observation $8$ could not occur under $U(0, 7)$.\n\n> **Watch out.** The derivative $-3\\theta^{-4}$ is never zero, so the maximum is at the boundary. Do not answer with $2\\bar{x} = \\frac{32}{3}$, the method of moments estimate, or with the smallest observation $3$, which the larger observations rule out.",
    "对来自 $U(0, \\theta)$ 的样本，当 $\\theta$ 覆盖所有观测时，似然是 $\\theta^{-n}$，否则为零。它关于 $\\theta$ 递减，所以最大值在允许的最小值处，即样本最大值。令导数为零找不到这一点。\n\n对样本 $3, 8, 5$：当 $\\theta \\ge 8$ 时 $L(\\theta) = \\theta^{-3}$，小于 $8$ 时为 $0$，所以似然在 $\\theta = 8$ 处最大。\n\n检验：$L(8) = \\frac{1}{512}$ 大于 $L(9) = \\frac{1}{729}$，而 $L(7) = 0$，因为在 $U(0, 7)$ 下观测值 $8$ 不可能出现。\n\n> **注意。** 导数 $-3\\theta^{-4}$ 永远不为零，所以最大值在边界上。不要回答矩估计 $2\\bar{x} = \\frac{32}{3}$，也不要回答最小观测值 $3$，较大的观测值已经排除了它。",
  ],
  (rng) => {
    const xs = rng.sample(
      [...Array(30).keys()].map((i) => i + 1),
      4,
    );
    const sum = xs.reduce((a, b) => a + b, 0);
    const max = Math.max(...xs);
    const min = Math.min(...xs);
    return numberProblem({
      prompt: t(
        `A sample from $U(0, \\theta)$ is $${xs.join(", ")}$. Find the value of $\\theta$ that maximizes the likelihood.`,
        `来自 $U(0, \\theta)$ 的样本是 $${xs.join(", ")}$。求使似然最大的 $\\theta$。`,
      ),
      answer: max,
      mistakes: unlike(max, [
        why(
          Q.of(sum, 2),
          "This is the method of moments estimate $2\\bar{x}$; the likelihood is largest at the sample maximum.",
          "这是矩估计 $2\\bar{x}$；似然在样本最大值处最大。",
        ),
        why(
          Q.of(sum, 4),
          "This is the sample mean, which estimates the centre $\\frac{\\theta}{2}$, not the endpoint.",
          "这是样本均值，它估计的是中心 $\\frac{\\theta}{2}$，而不是端点。",
        ),
        why(
          min,
          `This is the smallest observation; any $\\theta < ${max}$ has likelihood $0$.`,
          `这是最小观测值；任何 $\\theta < ${max}$ 的似然都为 $0$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find where the likelihood is positive", "找出似然为正的范围"],
            t(
              `$L(\\theta) = \\theta^{-4}$ for $\\theta \\ge ${max}$, the largest observation, and $0$ below it.`,
              `当 $\\theta \\ge ${max}$（最大观测值）时 $L(\\theta) = \\theta^{-4}$，小于它时为 $0$。`,
            ),
          ],
          [
            ["Take the smallest allowed value", "取允许的最小值"],
            t(
              `$\\theta^{-4}$ decreases as $\\theta$ grows, so the maximum is at $\\theta = ${max}$.`,
              `$\\theta^{-4}$ 随 $\\theta$ 增大而减小，所以最大值在 $\\theta = ${max}$ 处。`,
            ),
          ],
        ],
        t(
          `$L(${max}) = ${max}^{-4}$ is larger than $L(${max + 1}) = ${max + 1}^{-4}$, and $L(${max - 1}) = 0$ because the observation $${max}$ exceeds $${max - 1}$.`,
          `$L(${max}) = ${max}^{-4}$ 大于 $L(${max + 1}) = ${max + 1}^{-4}$，而 $L(${max - 1}) = 0$，因为观测值 $${max}$ 超过了 $${max - 1}$。`,
        ),
      ),
    });
  },
);

const sFromInterval = point(
  "the-sample-standard-deviation-behind-a-t-interval",
  ["The sample standard deviation behind a t interval", "由 t 区间反求样本标准差"],
  [
    "A confidence interval can be taken apart: its center is the sample mean and half its width is the margin of error. Since the margin is $t\\frac{s}{\\sqrt{n}}$, the sample standard deviation can be recovered from the published interval and the sample size.\n\nA $95\\%$ interval from $n = 16$ with $t = 2.131$ is $(47.869, 52.131)$. Its center is $50$ and its margin is $2.131$, so $2.131 = 2.131 \\cdot \\frac{s}{4}$ and $s = 4$.\n\nCheck: $2.131 \\cdot \\frac{4}{4} = 2.131$, and $50 \\pm 2.131$ gives back both endpoints.\n\n> **Watch out.** Use half the width, not the whole width: the width $4.262$ in place of the margin would give $s = 8$, twice too large. And divide by $\\sqrt{n} = 4$, not by $n = 16$.",
    "置信区间可以拆开来看：中心是样本均值，宽度的一半是误差幅度。由于误差幅度是 $t\\frac{s}{\\sqrt{n}}$，所以可以由公布的区间和样本量求出样本标准差。\n\n由 $n = 16$、$t = 2.131$ 得到的 $95\\%$ 区间是 $(47.869, 52.131)$。中心为 $50$，误差幅度为 $2.131$，所以 $2.131 = 2.131 \\cdot \\frac{s}{4}$，$s = 4$。\n\n检验：$2.131 \\cdot \\frac{4}{4} = 2.131$，而 $50 \\pm 2.131$ 还原了两个端点。\n\n> **注意。** 要用宽度的一半，而不是整个宽度：用宽度 $4.262$ 代替误差幅度会得到 $s = 8$，大了一倍。并且要除以 $\\sqrt{n} = 4$，而不是 $n = 16$。",
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
    return numberProblem({
      prompt: t(
        `A $95\\%$ $t$ interval from a sample of $n = ${k * k}$ is $(${lowText}, ${highText})$. With $t = ${t2}$, find $s$.`,
        `由容量为 $n = ${k * k}$ 的样本得到的 $95\\%$ $t$ 区间是 $(${lowText}, ${highText})$。取 $t = ${t2}$，求 $s$。`,
      ),
      answer: s,
      mistakes: unlike(s, [
        why(
          halfWidth,
          "This is the margin of error itself; $s$ is found by undoing the factor $\\frac{t}{\\sqrt{n}}$.",
          "这是误差幅度本身；还要除去因子 $\\frac{t}{\\sqrt{n}}$ 才得到 $s$。",
        ),
        why(
          Q.of(tv * s, 1000),
          `This multiplies the margin by $\\sqrt{n} = ${k}$ but does not divide by $t = ${t2}$.`,
          `这把误差幅度乘以 $\\sqrt{n} = ${k}$，却没有除以 $t = ${t2}$。`,
        ),
        why(
          s * k,
          `This multiplies by $n = ${k * k}$ instead of $\\sqrt{n} = ${k}$.`,
          `这乘的是 $n = ${k * k}$，而不是 $\\sqrt{n} = ${k}$。`,
        ),
        why(
          2 * s,
          "This uses the whole width of the interval as the margin; the margin is half the width.",
          "这把整个区间宽度当成了误差幅度；误差幅度是宽度的一半。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Read the margin", "读出误差幅度"],
            t(
              `The center is $${center}$ and half the width is the margin, $${dec(halfWidth)}$.`,
              `中心为 $${center}$，宽度的一半是误差幅度 $${dec(halfWidth)}$。`,
            ),
          ],
          [
            ["Solve for $s$", "解出 $s$"],
            t(
              `$${dec(halfWidth)} = ${t2} \\cdot \\frac{s}{${k}}$, so $s = ${dec(halfWidth)} \\cdot ${k} \\div ${t2} = ${s}$.`,
              `$${dec(halfWidth)} = ${t2} \\cdot \\frac{s}{${k}}$，所以 $s = ${dec(halfWidth)} \\cdot ${k} \\div ${t2} = ${s}$。`,
            ),
          ],
        ],
        t(
          `$${t2} \\cdot \\frac{${s}}{${k}} = ${dec(halfWidth)}$, and $${center} \\pm ${dec(halfWidth)}$ gives back both endpoints.`,
          `$${t2} \\cdot \\frac{${s}}{${k}} = ${dec(halfWidth)}$，而 $${center} \\pm ${dec(halfWidth)}$ 还原了两个端点。`,
        ),
      ),
    });
  },
);

const halfMargin = point(
  "the-sample-that-halves-the-margin",
  ["The sample that halves the margin", "使误差幅度减半的样本"],
  [
    "The finite population correction multiplies the margin of error by $\\sqrt{\\frac{N - n}{N - 1}}$. So halving the margin requires this fraction under the root to equal one quarter, which means sampling about three quarters of the population, not half of it.\n\nFor $N = 41$: $\\frac{41 - n}{40} = \\frac{1}{4}$ gives $41 - n = 10$, so $n = 31$.\n\nCheck: $\\sqrt{\\frac{41 - 31}{40}} = \\sqrt{\\frac{1}{4}} = \\frac{1}{2}$, so the margin is exactly halved.\n\n> **Watch out.** Setting the fraction itself to $\\frac{1}{2}$ forgets the square root: it gives $n = 21$, half the population, and then the margin is only multiplied by $\\sqrt{\\frac{20}{40}} \\approx 0.71$.",
    "有限总体校正把误差幅度乘以 $\\sqrt{\\frac{N - n}{N - 1}}$。所以要使误差幅度减半，根号下的分数必须等于四分之一，这意味着要抽取约四分之三的总体，而不是一半。\n\n对 $N = 41$：由 $\\frac{41 - n}{40} = \\frac{1}{4}$ 得 $41 - n = 10$，所以 $n = 31$。\n\n检验：$\\sqrt{\\frac{41 - 31}{40}} = \\sqrt{\\frac{1}{4}} = \\frac{1}{2}$，误差幅度恰好减半。\n\n> **注意。** 令分数本身等于 $\\frac{1}{2}$ 就忘了平方根：那样得 $n = 21$，即一半的总体，而误差幅度只乘以 $\\sqrt{\\frac{20}{40}} \\approx 0.71$。",
  ],
  (rng) => {
    const j = rng.int(5, 60);
    const N = 4 * j + 1;
    const answer = 3 * j + 1;
    return numberProblem({
      prompt: t(
        `A sample is drawn without replacement from $N = ${N}$. For which $n$ does the finite population correction exactly halve the margin of error?`,
        `从 $N = ${N}$ 中不放回地抽取样本。当 $n$ 为何值时，有限总体校正恰好使误差幅度减半？`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          2 * j + 1,
          "This sets the fraction to $\\frac{1}{2}$, forgetting that the margin uses its square root.",
          "这令分数等于 $\\frac{1}{2}$，忘了误差幅度用的是它的平方根。",
        ),
        why(
          3 * j,
          `This takes three quarters of $N - 1 = ${N - 1}$; solving $${N} - n = ${j}$ gives one more.`,
          `这取了 $N - 1 = ${N - 1}$ 的四分之三；解 $${N} - n = ${j}$ 应再多一。`,
        ),
        why(
          j + 1,
          `This makes $\\frac{n - 1}{N - 1}$ equal to $\\frac{1}{4}$, the removed share instead of the kept one.`,
          `这令 $\\frac{n - 1}{N - 1}$ 等于 $\\frac{1}{4}$，用的是去掉的份额而不是保留的份额。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Set the factor to one half", "令因子等于二分之一"],
            t(
              `$\\sqrt{\\frac{${N} - n}{${N - 1}}} = \\frac{1}{2}$ means $\\frac{${N} - n}{${N - 1}} = \\frac{1}{4}$.`,
              `$\\sqrt{\\frac{${N} - n}{${N - 1}}} = \\frac{1}{2}$ 即 $\\frac{${N} - n}{${N - 1}} = \\frac{1}{4}$。`,
            ),
          ],
          [["Solve for $n$", "解出 $n$"], t(`$${N} - n = ${j}$, so $n = ${answer}$.`, `$${N} - n = ${j}$，所以 $n = ${answer}$。`)],
        ],
        t(
          `$\\sqrt{\\frac{${N} - ${answer}}{${N - 1}}} = \\sqrt{\\frac{${j}}{${4 * j}}} = \\frac{1}{2}$.`,
          `$\\sqrt{\\frac{${N} - ${answer}}{${N - 1}}} = \\sqrt{\\frac{${j}}{${4 * j}}} = \\frac{1}{2}$。`,
        ),
      ),
    });
  },
);

const countFromInterval = point(
  "the-count-behind-a-proportion-interval",
  ["The count behind a proportion interval", "比例区间背后的计数"],
  [
    "A Wald interval is centered at the sample proportion. So the midpoint of a published interval gives $\\hat{p}$, and multiplying by the sample size recovers the count. An endpoint is not the sample proportion, and using one would give a wrong count.\n\nA Wald interval from a sample of $400$ is $(0.27, 0.33)$. Its midpoint is $\\hat{p} = \\frac{0.27 + 0.33}{2} = 0.3$, so $400 \\cdot 0.3 = 120$ answered yes.\n\nCheck: $\\frac{120}{400} = 0.3$, and $0.3$ lies exactly $0.03$ from each endpoint.\n\n> **Watch out.** The lower endpoint is not the estimate: $400 \\cdot 0.27 = 108$ undercounts, and the upper endpoint $0.33$ would overcount with $132$.",
    "沃尔德区间以样本比例为中心。所以公布区间的中点给出 $\\hat{p}$，乘以样本量就得到计数。端点不是样本比例，用它会得到错误的计数。\n\n由容量为 $400$ 的样本得到的沃尔德区间是 $(0.27, 0.33)$。中点为 $\\hat{p} = \\frac{0.27 + 0.33}{2} = 0.3$，所以有 $400 \\cdot 0.3 = 120$ 人回答是。\n\n检验：$\\frac{120}{400} = 0.3$，且 $0.3$ 与两个端点的距离都恰好是 $0.03$。\n\n> **注意。** 下端点不是估计值：$400 \\cdot 0.27 = 108$ 算少了；用上端点 $0.33$ 则会多算成 $132$。",
  ],
  (rng) => {
    const m = rng.int(1, 10);
    const c = rng.int(10, 90);
    const h = rng.int(1, 9);
    const n = 100 * m;
    const answer = m * c;
    const low = dec(Q.of(c - h, 100));
    const high = dec(Q.of(c + h, 100));
    const p = dec(Q.of(c, 100));
    return numberProblem({
      prompt: t(
        `A Wald confidence interval from a sample of $${n}$ is $(${low}, ${high})$. How many in the sample answered yes?`,
        `由容量为 $${n}$ 的样本得到的沃尔德置信区间是 $(${low}, ${high})$。样本中有多少人回答是？`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          m * (c - h),
          `This uses the lower endpoint $${low}$ as $\\hat{p}$; the estimate is the midpoint.`,
          `这把下端点 $${low}$ 当成了 $\\hat{p}$；估计值是中点。`,
        ),
        why(
          m * (c + h),
          `This uses the upper endpoint $${high}$ as $\\hat{p}$; the estimate is the midpoint.`,
          `这把上端点 $${high}$ 当成了 $\\hat{p}$；估计值是中点。`,
        ),
        why(
          c,
          `This reads $\\hat{p} = ${p}$ as a percentage count; multiply the proportion by the sample size $${n}$.`,
          `这把 $\\hat{p} = ${p}$ 当成了百分比计数；要把比例乘以样本量 $${n}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the midpoint", "求中点"],
            t(`$\\hat{p} = \\frac{${low} + ${high}}{2} = ${p}$.`, `$\\hat{p} = \\frac{${low} + ${high}}{2} = ${p}$。`),
          ],
          [["Multiply by the sample size", "乘以样本量"], t(`$${n} \\cdot ${p} = ${answer}$.`, `$${n} \\cdot ${p} = ${answer}$。`)],
        ],
        t(
          `$\\frac{${answer}}{${n}} = ${p}$, which lies $${dec(Q.of(h, 100))}$ from each endpoint.`,
          `$\\frac{${answer}}{${n}} = ${p}$，它与每个端点的距离都是 $${dec(Q.of(h, 100))}$。`,
        ),
      ),
    });
  },
);

const totalMargin = point(
  "the-margin-for-a-population-total",
  ["The margin for a population total", "总体总数的误差幅度"],
  [
    "To estimate how many in a finite population have a property, multiply the proportion and its margin by $N$. The margin uses the corrected standard error, so it combines the sample size, the correction factor and the population size in a single calculation.\n\nIn a sample of $n = 100$ from $N = 133$, half have the property. The uncorrected standard error is $\\frac{0.5}{10} = 0.05$, the correction $\\sqrt{\\frac{33}{132}} = \\frac{1}{2}$ makes it $0.025$, and with $z = 2$ the margin for the proportion is $0.05$. For the number of members it is $133 \\cdot 0.05 = 6.65$.\n\nCheck: $\\frac{6.65}{133} = 0.05$, the margin for the proportion, so the total and the proportion tell the same story.\n\n> **Watch out.** Without the correction the margin would be $133 \\cdot 2 \\cdot 0.05 = 13.3$, twice too large; and the margin for the proportion, $0.05$, is not yet a number of members until it is multiplied by $N$.",
    "估计有限总体中有多少个体具有某一性质时，要把比例及其误差幅度都乘以 $N$。误差幅度用校正后的标准误，所以在一次计算中结合了样本量、校正因子和总体大小。\n\n从 $N = 133$ 中抽取 $n = 100$，其中一半具有该性质。未校正的标准误为 $\\frac{0.5}{10} = 0.05$，校正 $\\sqrt{\\frac{33}{132}} = \\frac{1}{2}$ 使它变为 $0.025$；取 $z = 2$，比例的误差幅度为 $0.05$。成员数的误差幅度为 $133 \\cdot 0.05 = 6.65$。\n\n检验：$\\frac{6.65}{133} = 0.05$，正是比例的误差幅度，总数与比例给出一致的结论。\n\n> **注意。** 不校正时误差幅度会是 $133 \\cdot 2 \\cdot 0.05 = 13.3$，大了一倍；而比例的误差幅度 $0.05$ 还要乘以 $N$ 才是成员数。",
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
    return numberProblem({
      prompt: t(
        `A population has $N = ${N}$ members. In a sample of $n = ${n}$ drawn without replacement, $${x}$ have a property. With $z = ${dec(zq)}$, find the margin of error for the number of members in the population having the property, using the finite population correction.`,
        `总体共有 $N = ${N}$ 个成员。不放回地抽取 $n = ${n}$ 个，其中 $${x}$ 个具有某一性质。取 $z = ${dec(zq)}$，用有限总体校正求总体中具有该性质的成员数的误差幅度。`,
      ),
      answer,
      form: "decimal",
      mistakes: unlike(answer, [
        why(
          answer.mul(Q.of(2, 1)),
          "This leaves out the correction factor $\\frac{1}{2}$ on the standard error.",
          "这漏掉了标准误上的校正因子 $\\frac{1}{2}$。",
        ),
        why(
          zq.mul(se),
          `This is the margin for the proportion; multiply it by $N = ${N}$ to count members.`,
          `这是比例的误差幅度；要乘以 $N = ${N}$ 才是成员数。`,
        ),
        why(
          answer.mul(Q.of(1, 2)),
          "This multiplies by the factor $\\frac{1}{4}$ itself instead of its square root $\\frac{1}{2}$.",
          "这乘的是因子 $\\frac{1}{4}$ 本身，而不是它的平方根 $\\frac{1}{2}$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the correction", "求校正量"],
            t(
              `$\\frac{${N - n}}{${N - 1}} = \\frac{1}{4}$, whose square root is $\\frac{1}{2}$.`,
              `$\\frac{${N - n}}{${N - 1}} = \\frac{1}{4}$，其平方根为 $\\frac{1}{2}$。`,
            ),
          ],
          [
            ["Find the corrected standard error", "求修正标准误"],
            t(
              `$\\sqrt{\\hat{p}(1 - \\hat{p})} = ${root.toLatex()}$, so the standard error of $\\hat{p}$ is $${root.toLatex()} \\cdot \\frac{1}{${k}} \\cdot \\frac{1}{2} = ${dec(se)}$.`,
              `$\\sqrt{\\hat{p}(1 - \\hat{p})} = ${root.toLatex()}$，所以 $\\hat{p}$ 的标准误为 $${root.toLatex()} \\cdot \\frac{1}{${k}} \\cdot \\frac{1}{2} = ${dec(se)}$。`,
            ),
          ],
          [
            ["Scale to the population", "放大到总体"],
            t(
              `The margin is $${N} \\cdot ${dec(zq)} \\cdot ${dec(se)} = ${dec(answer)}$.`,
              `误差幅度为 $${N} \\cdot ${dec(zq)} \\cdot ${dec(se)} = ${dec(answer)}$。`,
            ),
          ],
        ],
        t(
          `$${dec(answer)} \\div ${N} = ${dec(zq.mul(se))}$, the margin for the proportion, $${dec(zq)} \\cdot ${dec(se)}$.`,
          `$${dec(answer)} \\div ${N} = ${dec(zq.mul(se))}$，正是比例的误差幅度 $${dec(zq)} \\cdot ${dec(se)}$。`,
        ),
      ),
    });
  },
);

const varianceVerdict = point(
  "whether-a-value-is-inside-a-variance-interval",
  ["Whether a value is inside a variance interval", "判断某值是否在方差区间内"],
  [
    "The interval for a variance is not centered at $s^{2}$, because the chi-square distribution is skewed. The lower endpoint divides by the larger critical value and the upper endpoint by the smaller, and a hypothesized value should be compared with both of them.\n\nWith $n = 10$, $s^{2} = 40$, $\\chi^{2}_{0.025, 9} = 19.023$ and $\\chi^{2}_{0.975, 9} = 2.7$, the endpoints are $\\frac{9 \\cdot 40}{19.023} \\approx 18.92$ and $\\frac{9 \\cdot 40}{2.7} \\approx 133.33$. So $\\sigma^{2} = 100$ is inside the interval, while $\\sigma^{2} = 10$ is below it.\n\nCheck: the lower endpoint is below $s^{2} = 40$ and the upper one above it, as they must be, but $40$ is far from the middle $76.1$ of the interval.\n\n> **Watch out.** Dividing $360$ by the smaller critical value $2.7$ gives the upper endpoint, not the lower one; swapping them would give a lower endpoint above the upper one.",
    "方差的区间并不以 $s^{2}$ 为中心，因为卡方分布是偏斜的。下端点除以较大的临界值，上端点除以较小的临界值，假设值要与这两个端点比较。\n\n若 $n = 10$，$s^{2} = 40$，$\\chi^{2}_{0.025, 9} = 19.023$，$\\chi^{2}_{0.975, 9} = 2.7$，则端点为 $\\frac{9 \\cdot 40}{19.023} \\approx 18.92$ 和 $\\frac{9 \\cdot 40}{2.7} \\approx 133.33$。所以 $\\sigma^{2} = 100$ 在区间内，而 $\\sigma^{2} = 10$ 低于它。\n\n检验：下端点低于 $s^{2} = 40$，上端点高于它，这是必然的；但 $40$ 离区间的中点 $76.1$ 很远。\n\n> **注意。** $360$ 除以较小的临界值 $2.7$ 得到的是上端点，不是下端点；把两者弄反，下端点会比上端点还大。",
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
    const lText = L.toFixed(2);
    const uText = U.toFixed(2);
    const inside = t("It is inside the interval", "它在区间内");
    const below = t("It is below the lower endpoint", "它低于下端点");
    const above = t("It is above the upper endpoint", "它高于上端点");
    const reasons = [
      t(`$${value}$ is not between $${lText}$ and $${uText}$.`, `$${value}$ 不在 $${lText}$ 与 $${uText}$ 之间。`),
      t(`$${value}$ is not below the lower endpoint $${lText}$.`, `$${value}$ 并不低于下端点 $${lText}$。`),
      t(`$${value}$ is not above the upper endpoint $${uText}$.`, `$${value}$ 并不高于上端点 $${uText}$。`),
    ];
    const options = [inside, below, above];
    return explainedChoice(rng, {
      prompt: t(
        `A sample of $n = ${df + 1}$ from a normal population has $s^{2} = ${s2}$. With $\\chi^{2}_{0.025, ${df}} = ${hi}$ and $\\chi^{2}_{0.975, ${df}} = ${lo}$, where is $\\sigma^{2} = ${value}$ relative to the $95\\%$ confidence interval?`,
        `来自正态总体的容量为 $n = ${df + 1}$ 的样本满足 $s^{2} = ${s2}$。取 $\\chi^{2}_{0.025, ${df}} = ${hi}$，$\\chi^{2}_{0.975, ${df}} = ${lo}$，$\\sigma^{2} = ${value}$ 相对于 $95\\%$ 置信区间的位置如何？`,
      ),
      correct: options[kind]!,
      wrong: [
        ...[0, 1, 2].filter((i) => i !== kind).map((i) => ({ option: options[i]!, why: reasons[i]! })),
        {
          option: t("It equals the center of the interval", "它等于区间的中心"),
          why: t(
            `The interval is not symmetric about any special value; its middle is about $${((L + U) / 2).toFixed(2)}$, and the question is where $${value}$ lies relative to the endpoints.`,
            `该区间不关于某个特殊值对称；它的中点约为 $${((L + U) / 2).toFixed(2)}$，题目问的是 $${value}$ 相对于两个端点的位置。`,
          ),
        },
      ],
      solution: walked(
        [
          [
            ["Find the lower endpoint", "求下端点"],
            t(
              `Divide by the larger critical value: $\\frac{${df} \\cdot ${s2}}{${hi}} \\approx ${lText}$.`,
              `除以较大的临界值：$\\frac{${df} \\cdot ${s2}}{${hi}} \\approx ${lText}$。`,
            ),
          ],
          [
            ["Find the upper endpoint", "求上端点"],
            t(
              `Divide by the smaller critical value: $\\frac{${df} \\cdot ${s2}}{${lo}} \\approx ${uText}$.`,
              `除以较小的临界值：$\\frac{${df} \\cdot ${s2}}{${lo}} \\approx ${uText}$。`,
            ),
          ],
          [
            ["Compare", "比较"],
            t(
              `So $${value}$ is ${["inside the interval", "below the lower endpoint", "above the upper endpoint"][kind]}.`,
              `所以 $${value}$ ${["在区间内", "低于下端点", "高于上端点"][kind]}。`,
            ),
          ],
        ],
        t(
          `The sample variance $${s2}$ lies between $${lText}$ and $${uText}$, as it must.`,
          `样本方差 $${s2}$ 位于 $${lText}$ 与 $${uText}$ 之间，这是必然的。`,
        ),
      ),
    });
  },
);

const zeroInInterval = point(
  "reading-a-difference-of-means-from-its-interval",
  ["Reading a difference of means from its interval", "由区间判断均值之差"],
  [
    "A confidence interval for a difference of means is read by its position relative to zero. If zero is inside, the data do not separate the means. If both endpoints are positive or both are negative, the interval also shows which mean is larger.\n\nWith $\\sigma_{1} = 6$, $\\sigma_{2} = 8$ and samples of $25$ each, the standard error is $\\sqrt{\\frac{36}{25} + \\frac{64}{25}} = 2$. A difference $\\bar{x}_{1} - \\bar{x}_{2} = 5$ gives $5 \\pm 1.96 \\cdot 2 = (1.08, 8.92)$, entirely above zero, so the first mean is larger.\n\nCheck: $5 - 3.92 = 1.08 > 0$, so even the lower endpoint is positive.\n\n> **Watch out.** A positive estimate is not enough: with a difference of $2$ the interval is $(-1.92, 5.92)$, which contains zero, so the data do not separate the means although $\\bar{x}_{1} > \\bar{x}_{2}$.",
    "均值之差的置信区间要看它相对于零的位置。如果零在区间内，数据不能区分两个均值。如果两个端点都为正或都为负，区间还能说明哪个均值更大。\n\n若 $\\sigma_{1} = 6$，$\\sigma_{2} = 8$，两样本容量都是 $25$，则标准误为 $\\sqrt{\\frac{36}{25} + \\frac{64}{25}} = 2$。差 $\\bar{x}_{1} - \\bar{x}_{2} = 5$ 给出 $5 \\pm 1.96 \\cdot 2 = (1.08, 8.92)$，全在零的上方，所以第一个均值更大。\n\n检验：$5 - 3.92 = 1.08 > 0$，连下端点都是正的。\n\n> **注意。** 估计值为正还不够：若差为 $2$，区间为 $(-1.92, 5.92)$，包含零，所以尽管 $\\bar{x}_{1} > \\bar{x}_{2}$，数据也不能区分两个均值。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const kind = rng.int(0, 2);
    const d = kind === 0 ? rng.int(-k, k) : (kind === 1 ? 1 : -1) * (2 * k + rng.int(1, 8));
    const n = 25;
    const low = Q.of(d, 1).sub(Q.of(196 * k, 100));
    const high = Q.of(d, 1).add(Q.of(196 * k, 100));
    const range = `(${dec(low)}, ${dec(high)})`;
    const options = [
      t("The data do not separate the two means", "数据不能区分两个均值"),
      t("The first mean is larger", "第一个均值更大"),
      t("The second mean is larger", "第二个均值更大"),
    ];
    const reasons =
      kind === 0
        ? [
            t("", ""),
            t(
              `The interval $${range}$ contains zero, so a negative difference is as plausible as a positive one.`,
              `区间 $${range}$ 包含零，负的差与正的差同样可信。`,
            ),
            t(
              `The interval $${range}$ contains zero, so a positive difference is as plausible as a negative one.`,
              `区间 $${range}$ 包含零，正的差与负的差同样可信。`,
            ),
          ]
        : [
            t(
              `The interval $${range}$ lies entirely ${kind === 1 ? "above" : "below"} zero, so zero is not a plausible difference.`,
              `区间 $${range}$ 全在零的${kind === 1 ? "上方" : "下方"}，零不是可信的差。`,
            ),
            t(
              `The interval $${range}$ lies below zero, so $\\mu_{1} - \\mu_{2} < 0$.`,
              `区间 $${range}$ 在零的下方，所以 $\\mu_{1} - \\mu_{2} < 0$。`,
            ),
            t(
              `The interval $${range}$ lies above zero, so $\\mu_{1} - \\mu_{2} > 0$.`,
              `区间 $${range}$ 在零的上方，所以 $\\mu_{1} - \\mu_{2} > 0$。`,
            ),
          ];
    return explainedChoice(rng, {
      prompt: t(
        `Samples of size $${n}$ each come from populations with $\\sigma_{1} = ${3 * k}$ and $\\sigma_{2} = ${4 * k}$, and $\\bar{x}_{1} - \\bar{x}_{2} = ${d}$. Using $z = 1.96$, what does the $95\\%$ interval for $\\mu_{1} - \\mu_{2}$ show?`,
        `容量都是 $${n}$ 的样本来自 $\\sigma_{1} = ${3 * k}$，$\\sigma_{2} = ${4 * k}$ 的总体，$\\bar{x}_{1} - \\bar{x}_{2} = ${d}$。取 $z = 1.96$，$\\mu_{1} - \\mu_{2}$ 的 $95\\%$ 区间说明了什么？`,
      ),
      correct: options[kind]!,
      wrong: [
        ...[0, 1, 2].filter((i) => i !== kind).map((i) => ({ option: options[i]!, why: reasons[i]! })),
        {
          option: t("The two population variances are equal", "两个总体方差相等"),
          why: t(
            `The interval is about the difference of means; the variances were given, and they differ: $${9 * k * k}$ and $${16 * k * k}$.`,
            `该区间关于均值之差；方差是已知的，并且不同：$${9 * k * k}$ 与 $${16 * k * k}$。`,
          ),
        },
      ],
      solution: walked(
        [
          [
            ["Find the standard error", "求标准误"],
            t(
              `$\\sqrt{\\frac{${9 * k * k}}{${n}} + \\frac{${16 * k * k}}{${n}}} = \\sqrt{${k * k}} = ${k}$.`,
              `$\\sqrt{\\frac{${9 * k * k}}{${n}} + \\frac{${16 * k * k}}{${n}}} = \\sqrt{${k * k}} = ${k}$。`,
            ),
          ],
          [["Build the interval", "构造区间"], t(`$${d} \\pm 1.96 \\cdot ${k} = ${range}$.`, `$${d} \\pm 1.96 \\cdot ${k} = ${range}$。`)],
          [
            ["Read it against zero", "与零比较"],
            t(
              [
                "It contains zero, so the means are not separated.",
                "It lies above zero, so the first mean is larger.",
                "It lies below zero, so the second mean is larger.",
              ][kind] ?? "",
              ["它包含零，所以两个均值不能区分。", "它全在零的上方，所以第一个均值更大。", "它全在零的下方，所以第二个均值更大。"][kind] ??
                "",
            ),
          ],
        ],
        t(
          `Both endpoints lie $${dec(Q.of(196 * k, 100))}$ from the estimate $${d}$, so the interval is centered where it should be.`,
          `两个端点与估计值 $${d}$ 的距离都是 $${dec(Q.of(196 * k, 100))}$，区间的中心正确。`,
        ),
      ),
    });
  },
);

const pooledMargin = point(
  "the-margin-from-the-pooled-standard-deviation",
  ["The margin from the pooled standard deviation", "由合并标准差求误差幅度"],
  [
    "With a pooled standard deviation, the margin for a difference of means is $t \\cdot s_{p}\\sqrt{\\frac{1}{n_{1}} + \\frac{1}{n_{2}}}$. The pooled value replaces both standard deviations, and the sizes appear only inside this square root as a sum of reciprocals.\n\nWith $n_{1} = 12$, $n_{2} = 6$, $s_{p} = 5$ and $t = 2$: $\\frac{1}{12} + \\frac{1}{6} = \\frac{3}{12} = \\frac{1}{4}$, whose square root is $\\frac{1}{2}$, so the margin is $2 \\cdot 5 \\cdot \\frac{1}{2} = 5$.\n\nCheck: $\\left(\\frac{1}{2}\\right)^{2} = \\frac{1}{4} = \\frac{1}{12} + \\frac{2}{12}$, so the square root was taken correctly.\n\n> **Watch out.** Do not forget the square root: $2 \\cdot 5 \\cdot \\frac{1}{4} = 2.5$ is half the true margin. And $s_{p}$ is already one standard deviation for both groups; it is not added twice.",
    "使用合并标准差时，均值之差的误差幅度是 $t \\cdot s_{p}\\sqrt{\\frac{1}{n_{1}} + \\frac{1}{n_{2}}}$。合并值取代了两个标准差，样本量只以倒数之和的形式出现在这个根号内。\n\n若 $n_{1} = 12$，$n_{2} = 6$，$s_{p} = 5$，$t = 2$：$\\frac{1}{12} + \\frac{1}{6} = \\frac{3}{12} = \\frac{1}{4}$，其平方根为 $\\frac{1}{2}$，所以误差幅度为 $2 \\cdot 5 \\cdot \\frac{1}{2} = 5$。\n\n检验：$\\left(\\frac{1}{2}\\right)^{2} = \\frac{1}{4} = \\frac{1}{12} + \\frac{2}{12}$，平方根取得正确。\n\n> **注意。** 不要忘了开方：$2 \\cdot 5 \\cdot \\frac{1}{4} = 2.5$ 只有真实误差幅度的一半。并且 $s_{p}$ 已经是两组共用的一个标准差，不要加两次。",
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
    return numberProblem({
      prompt: t(
        `Two samples have $n_{1} = ${n1}$, $n_{2} = ${n2}$ and pooled standard deviation $s_{p} = ${sp}$. Using $t = 2$, find the margin of error for $\\mu_{1} - \\mu_{2}$.`,
        `两个样本满足 $n_{1} = ${n1}$，$n_{2} = ${n2}$，合并标准差 $s_{p} = ${sp}$。取 $t = 2$，求 $\\mu_{1} - \\mu_{2}$ 的误差幅度。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          2 * sp,
          `This leaves out the factor $\\sqrt{\\frac{1}{${n1}} + \\frac{1}{${n2}}}$ that comes from the sample sizes.`,
          `这漏掉了来自样本量的因子 $\\sqrt{\\frac{1}{${n1}} + \\frac{1}{${n2}}}$。`,
        ),
        why(
          Q.of(2 * sp, a * a),
          `This multiplies by $\\frac{1}{${a * a}}$ without taking its square root $\\frac{1}{${a}}$.`,
          `这乘的是 $\\frac{1}{${a * a}}$，没有取它的平方根 $\\frac{1}{${a}}$。`,
        ),
        why(Q.of(sp, a), "This is the standard error; the margin multiplies it by $t = 2$.", "这是标准误；误差幅度还要乘以 $t = 2$。"),
      ]),
      solution: walked(
        [
          [
            ["Add the reciprocals", "倒数相加"],
            t(
              `$\\frac{1}{${n1}} + \\frac{1}{${n2}} = \\frac{1}{${a * a}}$, whose square root is $\\frac{1}{${a}}$.`,
              `$\\frac{1}{${n1}} + \\frac{1}{${n2}} = \\frac{1}{${a * a}}$，它的平方根是 $\\frac{1}{${a}}$。`,
            ),
          ],
          [
            ["Multiply", "相乘"],
            t(
              `The margin is $2 \\cdot ${sp} \\cdot \\frac{1}{${a}} = ${answer.toLatex()}$.`,
              `误差幅度为 $2 \\cdot ${sp} \\cdot \\frac{1}{${a}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$\\left(\\frac{1}{${a}}\\right)^{2} = \\frac{1}{${a * a}} = \\frac{1}{${n1}} + \\frac{1}{${n2}}$, so the root is right.`,
          `$\\left(\\frac{1}{${a}}\\right)^{2} = \\frac{1}{${a * a}} = \\frac{1}{${n1}} + \\frac{1}{${n2}}$，平方根正确。`,
        ),
      ),
    });
  },
);

const welchEndpoint = point(
  "an-endpoint-of-a-welch-interval",
  ["An endpoint of a Welch interval", "韦尔奇区间的端点"],
  [
    "In a Welch interval, the variances of the two sample means are added under the square root before anything else. The standard errors of the two means themselves do not add, so this margin is smaller than the sum of the two separate margins.\n\nWith $n_{1} = 10$, $s_{1}^{2} = 90$, $n_{2} = 16$, $s_{2}^{2} = 256$: $\\frac{90}{10} + \\frac{256}{16} = 9 + 16 = 25$, so the standard error is $5$. For $\\bar{x}_{1} - \\bar{x}_{2} = 12$ and $t = 2.1$, the lower endpoint is $12 - 2.1 \\cdot 5 = 1.5$.\n\nCheck: the upper endpoint is $12 + 10.5 = 22.5$, and the midpoint of $1.5$ and $22.5$ is the estimate $12$.\n\n> **Watch out.** Adding the separate standard errors $3 + 4 = 7$ gives $12 - 2.1 \\cdot 7 = -2.7$, an interval that is too wide; only the variances add.",
    "在韦尔奇区间中，两个样本均值的方差要先在根号下相加。两个均值各自的标准误不能相加，所以这个误差幅度小于两个单独误差幅度之和。\n\n若 $n_{1} = 10$，$s_{1}^{2} = 90$，$n_{2} = 16$，$s_{2}^{2} = 256$：$\\frac{90}{10} + \\frac{256}{16} = 9 + 16 = 25$，所以标准误为 $5$。若 $\\bar{x}_{1} - \\bar{x}_{2} = 12$，$t = 2.1$，下端点为 $12 - 2.1 \\cdot 5 = 1.5$。\n\n检验：上端点为 $12 + 10.5 = 22.5$，$1.5$ 与 $22.5$ 的中点正是估计值 $12$。\n\n> **注意。** 把各自的标准误相加得 $3 + 4 = 7$，下端点 $12 - 2.1 \\cdot 7 = -2.7$，区间过宽；只有方差才能相加。",
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
    const upper = Q.of(d, 1).add(tq.mul(Q.of(se, 1)));
    return numberProblem({
      prompt: t(
        `Two samples have $n_{1} = ${n1}$, $s_{1}^{2} = ${s1}$, $n_{2} = ${n2}$, $s_{2}^{2} = ${s2}$ and $\\bar{x}_{1} - \\bar{x}_{2} = ${d}$. Using $t = ${dec(tq)}$, find the lower endpoint of the Welch interval.`,
        `两个样本满足 $n_{1} = ${n1}$，$s_{1}^{2} = ${s1}$，$n_{2} = ${n2}$，$s_{2}^{2} = ${s2}$，$\\bar{x}_{1} - \\bar{x}_{2} = ${d}$。取 $t = ${dec(tq)}$，求韦尔奇区间的下端点。`,
      ),
      answer,
      form: "decimal",
      mistakes: unlike(answer, [
        why(
          Q.of(d, 1).sub(tq.mul(Q.of(7 * k, 1))),
          `This adds the separate standard errors $${3 * k} + ${4 * k} = ${7 * k}$; the variances add, giving $\\sqrt{${25 * k * k}} = ${se}$.`,
          `这把各自的标准误相加得 $${3 * k} + ${4 * k} = ${7 * k}$；应当方差相加，得 $\\sqrt{${25 * k * k}} = ${se}$。`,
        ),
        why(upper, "This is the upper endpoint; the lower one subtracts the margin.", "这是上端点；下端点要减去误差幅度。"),
        why(
          Q.of(d, 1).sub(tq.mul(Q.of(25 * k * k, 1))),
          `This uses the variance $${25 * k * k}$ in place of the standard error $${se}$.`,
          `这用方差 $${25 * k * k}$ 代替了标准误 $${se}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Add the variances of the means", "均值的方差相加"],
            t(
              `$\\frac{s_{1}^{2}}{n_{1}} + \\frac{s_{2}^{2}}{n_{2}} = ${9 * k * k} + ${16 * k * k} = ${25 * k * k}$, so the standard error is $${se}$.`,
              `$\\frac{s_{1}^{2}}{n_{1}} + \\frac{s_{2}^{2}}{n_{2}} = ${9 * k * k} + ${16 * k * k} = ${25 * k * k}$，所以标准误为 $${se}$。`,
            ),
          ],
          [
            ["Subtract the margin", "减去误差幅度"],
            t(
              `The lower endpoint is $${d} - ${dec(tq)} \\cdot ${se} = ${dec(answer)}$.`,
              `下端点为 $${d} - ${dec(tq)} \\cdot ${se} = ${dec(answer)}$。`,
            ),
          ],
        ],
        t(
          `The upper endpoint is $${dec(upper)}$, and the two endpoints lie the same distance $${dec(tq.mul(Q.of(se, 1)))}$ from the estimate $${d}$.`,
          `上端点为 $${dec(upper)}$，两个端点与估计值 $${d}$ 的距离相同，都是 $${dec(tq.mul(Q.of(se, 1)))}$。`,
        ),
      ),
    });
  },
);

const twoProportionPlan = point(
  "planning-equal-groups-for-a-difference-of-proportions",
  ["Planning equal groups for a difference of proportions", "为比例之差规划等量分组"],
  [
    "With no prior estimates, the safe planning value for each proportion is $\\frac{1}{2}$. For two equal groups, the variance of the difference is $\\frac{1}{2n}$, which is twice that for a single proportion, so each group needs twice the single-sample size.\n\nTo estimate $p_{1} - p_{2}$ within $0.05$ with $z = 2$: $n \\ge \\frac{z^{2}}{2E^{2}} = \\frac{4}{2 \\cdot 0.0025} = 800$ in each group.\n\nCheck: with $n = 800$ the margin is $2\\sqrt{\\frac{1}{1600}} = \\frac{2}{40} = 0.05$, exactly the target.\n\n> **Watch out.** The single-proportion size $\\frac{z^{2}}{4E^{2}} = 400$ is not enough for each group: with $400$ per group the margin for the difference is $2\\sqrt{\\frac{1}{800}} \\approx 0.071$.",
    "没有先验估计时，每个比例的稳妥规划值是 $\\frac{1}{2}$。对两个等量分组，差的方差是 $\\frac{1}{2n}$，是单个比例的两倍，所以每组需要单样本容量的两倍。\n\n用 $z = 2$ 把 $p_{1} - p_{2}$ 估计到 $0.05$ 以内：每组 $n \\ge \\frac{z^{2}}{2E^{2}} = \\frac{4}{2 \\cdot 0.0025} = 800$。\n\n检验：当 $n = 800$ 时误差幅度为 $2\\sqrt{\\frac{1}{1600}} = \\frac{2}{40} = 0.05$，恰好达到目标。\n\n> **注意。** 单个比例的容量 $\\frac{z^{2}}{4E^{2}} = 400$ 对每组来说不够：每组 $400$ 时，差的误差幅度为 $2\\sqrt{\\frac{1}{800}} \\approx 0.071$。",
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
    return numberProblem({
      prompt: t(
        `Two groups of equal size $n$ are planned, to estimate $p_{1} - p_{2}$ within $${E}$ using $z = ${zText2}$ and planning values $\\frac{1}{2}$. Find the smallest $n$.`,
        `计划两个容量相等为 $n$ 的组，用 $z = ${zText2}$ 和规划值 $\\frac{1}{2}$，把 $p_{1} - p_{2}$ 估计到 $${E}$ 以内。求最小的 $n$。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          Math.ceil(top / (2 * bottom)),
          "This is the size for a single proportion, $\\frac{z^{2}}{4E^{2}}$; the difference of two proportions has twice the variance.",
          "这是单个比例的容量 $\\frac{z^{2}}{4E^{2}}$；两个比例之差的方差是它的两倍。",
        ),
        why(
          Math.ceil((2 * top) / bottom),
          "This uses $p(1 - p) = \\frac{1}{2}$ for each group; with $p = \\frac{1}{2}$ it is $\\frac{1}{4}$.",
          "这对每组都用了 $p(1 - p) = \\frac{1}{2}$；当 $p = \\frac{1}{2}$ 时它等于 $\\frac{1}{4}$。",
        ),
        why(
          Math.floor(top / bottom),
          "This rounds down; a smaller size would miss the target margin, so round up.",
          "这是向下取整；更小的容量达不到目标误差幅度，所以要向上取整。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Write the margin", "写出误差幅度"],
            t(
              `With $p_{1} = p_{2} = \\frac{1}{2}$, the variance of the difference is $\\frac{1}{4n} + \\frac{1}{4n} = \\frac{1}{2n}$, so the margin is $z\\sqrt{\\frac{1}{2n}}$.`,
              `当 $p_{1} = p_{2} = \\frac{1}{2}$ 时，差的方差为 $\\frac{1}{4n} + \\frac{1}{4n} = \\frac{1}{2n}$，所以误差幅度为 $z\\sqrt{\\frac{1}{2n}}$。`,
            ),
          ],
          [
            ["Solve and round up", "求解并向上取整"],
            t(
              `$n \\ge \\frac{z^{2}}{2E^{2}} = \\frac{${zText2}^{2}}{2 \\cdot ${E}^{2}} = ${bound.toLatex()}$, so $n = ${answer}$.`,
              `$n \\ge \\frac{z^{2}}{2E^{2}} = \\frac{${zText2}^{2}}{2 \\cdot ${E}^{2}} = ${bound.toLatex()}$，所以 $n = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$${answer - 1} < ${bound.toLatex()} \\le ${answer}$, so $${answer}$ is the smallest whole size that reaches the margin.`,
          `$${answer - 1} < ${bound.toLatex()} \\le ${answer}$，所以 $${answer}$ 是达到该误差幅度的最小整数容量。`,
        ),
      ),
    });
  },
);

const pairedVariance = point(
  "why-pairing-shrinks-the-variance-of-the-difference",
  ["Why pairing shrinks the variance of the difference", "配对为何能缩小差的方差"],
  [
    "Measurements on the same subject are correlated, so $\\sigma_{d}^{2} = \\sigma_{1}^{2} + \\sigma_{2}^{2} - 2\\operatorname{Cov}(X_{1}, X_{2})$. A positive covariance reduces the variance of the differences, which is why a paired design can give a narrower interval.\n\nWith $\\sigma_{1} = 5$, $\\sigma_{2} = 6$ and covariance $20$: $\\sigma_{d}^{2} = 25 + 36 - 2 \\cdot 20 = 21$.\n\nCheck: two independent samples would have $25 + 36 = 61$; the positive covariance brought the variance down to $21$, so a paired interval is narrower.\n\n> **Watch out.** Subtract twice the covariance, not once: $25 + 36 - 20 = 41$ would hide much of what pairing gains. And the covariance is subtracted for a difference; adding it belongs to a sum.",
    "同一对象的测量相关，所以 $\\sigma_{d}^{2} = \\sigma_{1}^{2} + \\sigma_{2}^{2} - 2\\operatorname{Cov}(X_{1}, X_{2})$。正的协方差使差的方差减小，这就是配对设计能给出更窄区间的原因。\n\n若 $\\sigma_{1} = 5$，$\\sigma_{2} = 6$，协方差为 $20$：$\\sigma_{d}^{2} = 25 + 36 - 2 \\cdot 20 = 21$。\n\n检验：两个独立样本的方差为 $25 + 36 = 61$；正的协方差把方差降到 $21$，所以配对区间更窄。\n\n> **注意。** 要减去两倍的协方差，而不是一倍：$25 + 36 - 20 = 41$ 会掩盖配对带来的大部分好处。并且差要减去协方差；加上协方差属于和的情形。",
  ],
  (rng) => {
    const s1 = rng.int(2, 12);
    const s2 = rng.int(2, 12);
    const c = rng.int(1, Math.floor(0.9 * s1 * s2));
    const answer = s1 * s1 + s2 * s2 - 2 * c;
    return numberProblem({
      prompt: t(
        `Before and after measurements have $\\sigma_{1} = ${s1}$, $\\sigma_{2} = ${s2}$ and covariance $${c}$. Find the variance of the differences.`,
        `前后测量满足 $\\sigma_{1} = ${s1}$，$\\sigma_{2} = ${s2}$，协方差为 $${c}$。求差的方差。`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          s1 * s1 + s2 * s2,
          "This ignores the covariance, as if the two measurements were independent.",
          "这忽略了协方差，好像两次测量相互独立。",
        ),
        why(
          s1 * s1 + s2 * s2 + 2 * c,
          "This adds twice the covariance, which is the rule for a sum; a difference subtracts it.",
          "这加上了两倍协方差，那是和的规则；差要减去它。",
        ),
        why(
          s1 * s1 + s2 * s2 - c,
          "This subtracts the covariance once; the variance of a difference subtracts it twice.",
          "这只减了一倍协方差；差的方差要减去两倍。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Square the standard deviations", "把标准差平方"],
            t(
              `$\\sigma_{1}^{2} = ${s1 * s1}$ and $\\sigma_{2}^{2} = ${s2 * s2}$.`,
              `$\\sigma_{1}^{2} = ${s1 * s1}$，$\\sigma_{2}^{2} = ${s2 * s2}$。`,
            ),
          ],
          [
            ["Subtract twice the covariance", "减去两倍协方差"],
            t(
              `$\\sigma_{d}^{2} = ${s1 * s1} + ${s2 * s2} - 2 \\cdot ${c} = ${answer}$.`,
              `$\\sigma_{d}^{2} = ${s1 * s1} + ${s2 * s2} - 2 \\cdot ${c} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$${answer}$ is below $${s1 * s1 + s2 * s2}$, the variance without pairing, as a positive covariance requires, and it is positive.`,
          `$${answer}$ 小于不配对时的方差 $${s1 * s1 + s2 * s2}$，这正是正协方差的效果，并且它为正。`,
        ),
      ),
    });
  },
);

const pairedEndpoint = point(
  "a-paired-t-interval-from-raw-differences",
  ["A paired t interval from raw differences", "由原始差值求配对 t 区间"],
  [
    "A paired interval treats the differences as one sample, so its degrees of freedom are the number of pairs minus one. From the raw differences, compute the mean and standard deviation, and then use the critical value for that number of degrees of freedom.\n\nThe differences $5, 1, 1, 1$ of $4$ pairs have $\\bar{d} = 2$, squared deviations $9 + 1 + 1 + 1 = 12$, $s_{d}^{2} = \\frac{12}{3} = 4$ and $s_{d} = 2$. The standard error is $\\frac{2}{\\sqrt{4}} = 1$, and with $t_{0.025, 3} = 3.182$ the upper endpoint is $2 + 3.182 = 5.182$.\n\nCheck: the lower endpoint is $2 - 3.182 = -1.182$, and the two endpoints are centered on $\\bar{d} = 2$.\n\n> **Watch out.** The degrees of freedom are $4 - 1 = 3$, the pairs minus one: $t_{0.025, 4} = 2.776$ would give $4.776$, an interval that is too narrow. And divide $s_{d}$ by $\\sqrt{4} = 2$ before multiplying by $t$.",
    "配对区间把差值当作一个样本，所以自由度是对数减一。由原始差值算出均值和标准差，再使用这个自由度对应的临界值。\n\n$4$ 对数据的差值 $5, 1, 1, 1$ 满足 $\\bar{d} = 2$，离差平方和为 $9 + 1 + 1 + 1 = 12$，$s_{d}^{2} = \\frac{12}{3} = 4$，$s_{d} = 2$。标准误为 $\\frac{2}{\\sqrt{4}} = 1$，取 $t_{0.025, 3} = 3.182$，上端点为 $2 + 3.182 = 5.182$。\n\n检验：下端点为 $2 - 3.182 = -1.182$，两个端点以 $\\bar{d} = 2$ 为中心。\n\n> **注意。** 自由度是 $4 - 1 = 3$，即对数减一：用 $t_{0.025, 4} = 2.776$ 会得到 $4.776$，区间过窄。并且要先把 $s_{d}$ 除以 $\\sqrt{4} = 2$，再乘以 $t$。",
  ],
  (rng) => {
    const a = rng.int(1, 4);
    const m = nz(rng, 12);
    const diffs = rng.shuffle([m + 3 * a, m - a, m - a, m - a]);
    const s = 2 * a;
    const answer = Q.of(m, 1).add(Q.of(3182 * a, 1000));
    return numberProblem({
      prompt: t(
        `The differences of $4$ pairs are $${diffs.join(", ")}$. Using $t_{0.025, 3} = 3.182$ and $t_{0.025, 4} = 2.776$, find the upper endpoint of the $95\\%$ interval for the mean difference.`,
        `$4$ 对数据的差值是 $${diffs.join(", ")}$。利用 $t_{0.025, 3} = 3.182$ 和 $t_{0.025, 4} = 2.776$，求平均差的 $95\\%$ 区间的上端点。`,
      ),
      answer,
      form: "decimal",
      mistakes: unlike(answer, [
        why(
          Q.of(m, 1).add(Q.of(2776 * a, 1000)),
          "This uses $4$ degrees of freedom; $4$ pairs give $4 - 1 = 3$.",
          "这用了自由度 $4$；$4$ 对数据的自由度是 $4 - 1 = 3$。",
        ),
        why(
          Q.of(m, 1).sub(Q.of(3182 * a, 1000)),
          "This is the lower endpoint; the upper one adds the margin.",
          "这是下端点；上端点要加上误差幅度。",
        ),
        why(
          Q.of(m, 1).add(Q.of(3182 * s, 1000)),
          `This multiplies $t$ by $s_{d} = ${s}$ without dividing by $\\sqrt{4} = 2$.`,
          `这把 $t$ 乘以 $s_{d} = ${s}$，没有除以 $\\sqrt{4} = 2$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the mean and standard deviation", "求均值与标准差"],
            t(
              `$\\bar{d} = ${m}$; the deviations are $${3 * a}, -${a}, -${a}, -${a}$, so $s_{d}^{2} = \\frac{${12 * a * a}}{3} = ${4 * a * a}$ and $s_{d} = ${s}$.`,
              `$\\bar{d} = ${m}$；离差为 $${3 * a}, -${a}, -${a}, -${a}$，所以 $s_{d}^{2} = \\frac{${12 * a * a}}{3} = ${4 * a * a}$，$s_{d} = ${s}$。`,
            ),
          ],
          [["Find the standard error", "求标准误"], t(`$\\frac{${s}}{\\sqrt{4}} = ${a}$.`, `$\\frac{${s}}{\\sqrt{4}} = ${a}$。`)],
          [
            ["Add the margin", "加上误差幅度"],
            t(
              `With $3$ degrees of freedom, the upper endpoint is $${m} + 3.182 \\cdot ${a} = ${dec(answer)}$.`,
              `自由度为 $3$，上端点为 $${m} + 3.182 \\cdot ${a} = ${dec(answer)}$。`,
            ),
          ],
        ],
        t(
          `The lower endpoint is $${dec(Q.of(m, 1).sub(Q.of(3182 * a, 1000)))}$, and the two endpoints are centered on $\\bar{d} = ${m}$.`,
          `下端点为 $${dec(Q.of(m, 1).sub(Q.of(3182 * a, 1000)))}$，两个端点以 $\\bar{d} = ${m}$ 为中心。`,
        ),
      ),
    });
  },
);

const marginFromSize = point(
  "the-margin-that-a-sample-size-can-guarantee",
  ["The margin that a sample size can guarantee", "样本量能保证的误差幅度"],
  [
    "The conservative formula can be read in reverse. With $p = \\frac{1}{2}$, the margin is $\\frac{z}{2\\sqrt{n}}$, so a planned sample size guarantees this margin whatever the true proportion is, since $p(1 - p)$ is largest at one half.\n\nA survey of $n = 400$ with $z = 1.96$ guarantees $\\frac{1.96}{2 \\cdot 20} = 0.049$.\n\nCheck: $1.96\\sqrt{\\frac{0.25}{400}} = 1.96 \\cdot 0.025 = 0.049$, the same margin from the original formula.\n\n> **Watch out.** $\\sqrt{\\frac{1}{4}} = \\frac{1}{2}$, so the divisor is $2\\sqrt{n} = 40$: using $\\frac{1}{4}$ without its root gives $\\frac{1.96}{4 \\cdot 20} = 0.0245$, a margin the survey cannot promise.",
    "保守公式可以反过来读。取 $p = \\frac{1}{2}$ 时，误差幅度是 $\\frac{z}{2\\sqrt{n}}$，所以无论真实比例是多少，计划的样本量都能保证这个误差幅度，因为 $p(1 - p)$ 在二分之一处最大。\n\n样本量 $n = 400$、$z = 1.96$ 的调查能保证 $\\frac{1.96}{2 \\cdot 20} = 0.049$。\n\n检验：$1.96\\sqrt{\\frac{0.25}{400}} = 1.96 \\cdot 0.025 = 0.049$，由原公式得到相同的误差幅度。\n\n> **注意。** $\\sqrt{\\frac{1}{4}} = \\frac{1}{2}$，所以除数是 $2\\sqrt{n} = 40$：用 $\\frac{1}{4}$ 而不开方会得到 $\\frac{1.96}{4 \\cdot 20} = 0.0245$，这是调查无法保证的误差幅度。",
  ],
  (rng) => {
    const k = rng.pick([10, 20, 25, 40, 50, 80, 100]);
    const z = rng.pick([200, 196, 240, 160]);
    const zq = Q.of(z, 100);
    const answer = zq.mul(Q.of(1, 2 * k));
    return numberProblem({
      prompt: t(
        `A survey of $n = ${k * k}$ uses $z = ${dec(zq)}$ and the conservative value $p = \\frac{1}{2}$. Find the margin of error it guarantees.`,
        `一项样本量为 $n = ${k * k}$ 的调查使用 $z = ${dec(zq)}$ 和保守值 $p = \\frac{1}{2}$。求它能保证的误差幅度。`,
      ),
      answer,
      form: "decimal",
      mistakes: unlike(answer, [
        why(zq.mul(Q.of(1, k)), "This leaves out $\\sqrt{p(1 - p)} = \\frac{1}{2}$.", "这漏掉了 $\\sqrt{p(1 - p)} = \\frac{1}{2}$。"),
        why(
          zq.mul(Q.of(1, 4 * k)),
          "This uses $p(1 - p) = \\frac{1}{4}$ without its square root $\\frac{1}{2}$.",
          "这用了 $p(1 - p) = \\frac{1}{4}$，没有取平方根 $\\frac{1}{2}$。",
        ),
        why(
          zq.mul(Q.of(1, k * k)),
          `This divides $z$ by $n = ${k * k}$ instead of by $\\sqrt{n} = ${k}$, and leaves out the $\\frac{1}{2}$.`,
          `这把 $z$ 除以 $n = ${k * k}$ 而不是 $\\sqrt{n} = ${k}$，还漏掉了 $\\frac{1}{2}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Use the conservative value", "代入保守值"],
            t(
              `With $p = \\frac{1}{2}$, $p(1 - p) = \\frac{1}{4}$, so the margin is $z\\sqrt{\\frac{1}{4n}} = \\frac{z}{2\\sqrt{n}}$.`,
              `取 $p = \\frac{1}{2}$，$p(1 - p) = \\frac{1}{4}$，所以误差幅度为 $z\\sqrt{\\frac{1}{4n}} = \\frac{z}{2\\sqrt{n}}$。`,
            ),
          ],
          [
            ["Substitute", "代入数值"],
            t(
              `$\\sqrt{${k * k}} = ${k}$, so the margin is $\\frac{${dec(zq)}}{2 \\cdot ${k}} = ${dec(answer)}$.`,
              `$\\sqrt{${k * k}} = ${k}$，所以误差幅度为 $\\frac{${dec(zq)}}{2 \\cdot ${k}} = ${dec(answer)}$。`,
            ),
          ],
        ],
        t(
          `$${dec(zq)}\\sqrt{\\frac{0.25}{${k * k}}} = ${dec(zq)} \\cdot ${dec(Q.of(1, 2 * k))} = ${dec(answer)}$.`,
          `$${dec(zq)}\\sqrt{\\frac{0.25}{${k * k}}} = ${dec(zq)} \\cdot ${dec(Q.of(1, 2 * k))} = ${dec(answer)}$。`,
        ),
      ),
    });
  },
);

const populationFromSample = point(
  "the-population-behind-a-corrected-sample-size",
  ["The population behind a corrected sample size", "校正样本量背后的总体"],
  [
    "The formula $n = \\frac{Nn_{0}}{n_{0} + N - 1}$ can be solved for the population size. Clearing the fraction and collecting the terms in $N$ gives $N = \\frac{n(n_{0} - 1)}{n_{0} - n}$, which shows how small the population must be to produce a given reduction.\n\nIf a planned size $n_{0} = 100$ is reduced to $n = 80$: $N = \\frac{80 \\cdot 99}{100 - 80} = \\frac{7920}{20} = 396$.\n\nCheck: $\\frac{396 \\cdot 100}{100 + 396 - 1} = \\frac{39600}{495} = 80$, the reduced size.\n\n> **Watch out.** Keep the $-1$: $\\frac{80 \\cdot 100}{20} = 400$ uses $n_{0}$ in place of $n_{0} - 1$, and with $N = 400$ the formula gives $\\frac{40000}{499} \\approx 80.16$, not $80$.",
    "公式 $n = \\frac{Nn_{0}}{n_{0} + N - 1}$ 可以解出总体大小。去分母并合并含 $N$ 的项，得 $N = \\frac{n(n_{0} - 1)}{n_{0} - n}$，这说明要产生给定的缩小幅度，总体必须有多小。\n\n若计划容量 $n_{0} = 100$ 缩小为 $n = 80$：$N = \\frac{80 \\cdot 99}{100 - 80} = \\frac{7920}{20} = 396$。\n\n检验：$\\frac{396 \\cdot 100}{100 + 396 - 1} = \\frac{39600}{495} = 80$，正是缩小后的容量。\n\n> **注意。** 不要丢掉 $-1$：$\\frac{80 \\cdot 100}{20} = 400$ 用 $n_{0}$ 代替了 $n_{0} - 1$，而当 $N = 400$ 时公式给出 $\\frac{40000}{499} \\approx 80.16$，不是 $80$。",
  ],
  (rng) => {
    const c = rng.int(1, 9);
    const m = rng.int(5, 30);
    const n0 = (c + 1) * m;
    const N = (n0 - 1) * c;
    const n = m * c;
    return numberProblem({
      prompt: t(
        `Using $n = \\frac{Nn_{0}}{n_{0} + N - 1}$, a planned size $n_{0} = ${n0}$ is reduced to $n = ${n}$. Find the population size $N$.`,
        `根据 $n = \\frac{Nn_{0}}{n_{0} + N - 1}$，计划容量 $n_{0} = ${n0}$ 缩小为 $n = ${n}$。求总体大小 $N$。`,
      ),
      answer: N,
      mistakes: unlike(N, [
        why(n0 * c, "This uses $n_{0}$ in place of $n_{0} - 1$ in the numerator.", "这在分子中用 $n_{0}$ 代替了 $n_{0} - 1$。"),
        why(
          n * (n0 - 1),
          `This clears the fraction but does not divide by $n_{0} - n = ${n0 - n}$.`,
          `这去了分母，却没有除以 $n_{0} - n = ${n0 - n}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Clear the fraction", "去分母"],
            t(
              `$${n}(${n0} + N - 1) = ${n0}N$, so $${n} \\cdot ${n0 - 1} = (${n0} - ${n})N$.`,
              `$${n}(${n0} + N - 1) = ${n0}N$，所以 $${n} \\cdot ${n0 - 1} = (${n0} - ${n})N$。`,
            ),
          ],
          [
            ["Divide", "相除"],
            t(`$N = \\frac{${n} \\cdot ${n0 - 1}}{${n0 - n}} = ${N}$.`, `$N = \\frac{${n} \\cdot ${n0 - 1}}{${n0 - n}} = ${N}$。`),
          ],
        ],
        t(
          `$\\frac{${N} \\cdot ${n0}}{${n0} + ${N} - 1} = \\frac{${N * n0}}{${n0 + N - 1}} = ${n}$, the reduced size.`,
          `$\\frac{${N} \\cdot ${n0}}{${n0} + ${N} - 1} = \\frac{${N * n0}}{${n0 + N - 1}} = ${n}$，正是缩小后的容量。`,
        ),
      ),
    });
  },
);

const surveySaving = point(
  "how-many-responses-the-correction-saves",
  ["How many responses the correction saves", "校正能节省多少回复"],
  [
    "The finite population correction lowers the sample size needed to estimate a proportion, and the saving is the difference between the two sizes. It is large only when the initial size is an appreciable part of the population, and it is negligible for a huge population.\n\nWithin $0.05$ with $z = 2$ and $p = \\frac{1}{2}$, $n_{0} = \\frac{4 \\cdot 0.25}{0.0025} = 400$. For $N = 1596$: $n = \\frac{1596 \\cdot 400}{400 + 1596 - 1} = \\frac{638400}{1995} = 320$, so the correction saves $400 - 320 = 80$ responses.\n\nCheck: $320 + 80 = 400$, and $\\frac{1596 \\cdot 400}{1995} = 320$ exactly.\n\n> **Watch out.** $320$ is the size still needed, not the saving; the saving is what is left of $n_{0}$ after the correction.",
    "有限总体校正降低了估计比例所需的样本量，节省的量是两个容量之差。只有当初始容量占总体相当大的部分时才明显，总体极大时可以忽略。\n\n用 $z = 2$、$p = \\frac{1}{2}$ 估计到 $0.05$ 以内，$n_{0} = \\frac{4 \\cdot 0.25}{0.0025} = 400$。当 $N = 1596$ 时：$n = \\frac{1596 \\cdot 400}{400 + 1596 - 1} = \\frac{638400}{1995} = 320$，所以校正节省了 $400 - 320 = 80$ 份回复。\n\n检验：$320 + 80 = 400$，且 $\\frac{1596 \\cdot 400}{1995} = 320$ 恰好成立。\n\n> **注意。** $320$ 是仍然需要的容量，不是节省的量；节省的量是 $n_{0}$ 减去校正后容量剩下的部分。",
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
    return numberProblem({
      prompt: t(
        `A proportion is estimated within $${E}$ with $z = 2$ and $p = \\frac{1}{2}$, from a population of $N = ${N}$. How many fewer responses are needed with $n = \\frac{Nn_{0}}{n_{0} + N - 1}$ than with $n_{0}$?`,
        `在 $N = ${N}$ 的总体中，用 $z = 2$，$p = \\frac{1}{2}$ 把比例估计到 $${E}$ 以内。用 $n = \\frac{Nn_{0}}{n_{0} + N - 1}$ 比用 $n_{0}$ 少需要多少份回复？`,
      ),
      answer,
      mistakes: unlike(answer, [
        why(
          n,
          `This is the corrected size $n = ${n}$ still needed, not the saving.`,
          `这是仍然需要的校正后容量 $n = ${n}$，不是节省的量。`,
        ),
        why(n0, `This is the uncorrected size $n_{0} = ${n0}$, not the saving.`, `这是未校正的容量 $n_{0} = ${n0}$，不是节省的量。`),
        why(
          N - n,
          `This subtracts $n$ from the population $N = ${N}$ instead of from $n_{0} = ${n0}$.`,
          `这用总体 $N = ${N}$ 减去 $n$，而不是用 $n_{0} = ${n0}$ 减去 $n$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the uncorrected size", "求未校正的容量"],
            t(
              `$n_{0} = \\frac{2^{2} \\cdot \\frac{1}{4}}{${E}^{2}} = ${n0}$.`,
              `$n_{0} = \\frac{2^{2} \\cdot \\frac{1}{4}}{${E}^{2}} = ${n0}$。`,
            ),
          ],
          [
            ["Apply the correction", "进行校正"],
            t(
              `$n = \\frac{${N} \\cdot ${n0}}{${n0} + ${N} - 1} = \\frac{${N * n0}}{${n0 + N - 1}} = ${n}$.`,
              `$n = \\frac{${N} \\cdot ${n0}}{${n0} + ${N} - 1} = \\frac{${N * n0}}{${n0 + N - 1}} = ${n}$。`,
            ),
          ],
          [["Subtract", "相减"], t(`The saving is $${n0} - ${n} = ${answer}$.`, `节省了 $${n0} - ${n} = ${answer}$。`)],
        ],
        t(
          `$${n} + ${answer} = ${n0}$, and $${n0 + N - 1} \\cdot ${n} = ${N * n0}$.`,
          `$${n} + ${answer} = ${n0}$，且 $${n0 + N - 1} \\cdot ${n} = ${N * n0}$。`,
        ),
      ),
    });
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
