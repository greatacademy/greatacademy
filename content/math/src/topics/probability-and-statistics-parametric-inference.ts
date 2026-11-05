import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { choiceProblem, isTerminating, lowestTerms, numberProblem } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";

/** PHI holds the standard normal cumulative probabilities the problems quote. */
const PHI = new Map<number, string>([
  [0, "0.5"],
  [0.5, "0.6915"],
  [1, "0.8413"],
  [1.5, "0.9332"],
  [2, "0.9772"],
  [2.5, "0.9938"],
]);

/** phi is the standard normal cumulative probability at a tabulated z. */
const phi = (z: number): Q => (z < 0 ? Q.one.sub(phi(-z)) : Q.parse(PHI.get(z) ?? "0.5"));

/** PHI_TABLE quotes the tabulated values for a prompt. */
const PHI_TABLE: Text = t(
  "$\\Phi(0.5) = 0.6915$, $\\Phi(1) = 0.8413$, $\\Phi(1.5) = 0.9332$, $\\Phi(2) = 0.9772$, $\\Phi(2.5) = 0.9938$",
  " $\\Phi(0.5) = 0.6915$，$\\Phi(1) = 0.8413$，$\\Phi(1.5) = 0.9332$，$\\Phi(2) = 0.9772$，$\\Phi(2.5) = 0.9938$",
);

/** Topics for Unit 6: Parametric Inference (new topics). */
export const probabilityAndStatisticsParametricInferenceTopics: TopicDef[] = [
  // 6.22.1 The Sample Mean
  {
    id: "the-sample-mean",
    title: t("The Sample Mean", "样本均值"),
    summary: t(
      "The sample mean $\\bar{X} = \\frac{1}{n}\\sum_{i=1}^n X_i$ is the arithmetic average of a sample and the standard point estimator of the population mean $\\mu$.",
      "样本均值 $\\bar{X} = \\frac{1}{n}\\sum_{i=1}^n X_i$ 是样本观测值的算术平均数，是总体均值 $\\mu$ 的标准点估计量。",
    ),
    prerequisites: ["properties-of-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "sample-mean-calculation",
        title: t("Calculating the sample mean from raw data", "根据原始数据计算样本均值"),
        explanation: t(
          "The sample mean is the balance point of the data, the single value that the observations are spread around. Sum all observations and divide by the sample size $n$: $\\bar{x} = \\frac{1}{n} \\sum_i x_i$.",
          "样本均值是数据的平衡点，是观测值围绕分布的那个单一数值。将所有观测值相加并除以样本容量 $n$：$\\bar{x} = \\frac{1}{n} \\sum_i x_i$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 7);
          const values: number[] = [];
          let sum = 0;
          for (let i = 0; i < n; i++) {
            const v = rng.int(5, 35);
            values.push(v);
            sum += v;
          }
          const listStr = values.join(", ");

          return numberProblem({
            prompt: t(
              `Given the sample observations: $${listStr}$, calculate the sample mean $\\bar{x}$.`,
              `已知样本观测值数据：$${listStr}$，计算样本均值 $\\bar{x}$。`,
            ),
            answer: Q.of(sum, n),
            wrong: [Q.of(sum, n - 1), sum, Q.of(sum, n + 1)],
            solution: t(
              `The sample size is $n = ${n}$ and the sum is $\\sum x_i = ${sum}$. Thus $\\bar{x} = \\frac{${sum}}{${n}}${lowestTerms(sum, n)}$.`,
              `样本容量为 $n = ${n}$，观测值总和为 $\\sum x_i = ${sum}$。因此 $\\bar{x} = \\frac{${sum}}{${n}}${lowestTerms(sum, n)}$。`,
            ),
          });
        },
      },
      {
        id: "the-mean-from-a-frequency-table",
        title: t("The mean from a frequency table", "由频数表求均值"),
        explanation: t(
          "When a sample is summarized by distinct values $x_j$ with frequencies $f_j$, each value counts as many times as it occurs:\n\n$$\\bar{x} = \\frac{\\sum f_j x_j}{\\sum f_j}.$$\n\nThe denominator is the total number of observations $n = \\sum f_j$, not the number of distinct values. For values $1, 2, 3$ with frequencies $5, 3, 2$: $\\bar{x} = \\frac{5 + 6 + 6}{10} = 1.7$.",
          "当样本以不同取值 $x_j$ 及其频数 $f_j$ 概括时，每个值出现几次就计几次：\n\n$$\\bar{x} = \\frac{\\sum f_j x_j}{\\sum f_j}.$$\n\n分母是观测总数 $n = \\sum f_j$，而不是不同取值的个数。例如取值 $1, 2, 3$ 的频数为 $5, 3, 2$：$\\bar{x} = \\frac{5 + 6 + 6}{10} = 1.7$。",
        ),
        generate: (rng: Rng): Problem => {
          const start = rng.int(0, 5);
          const xs = [start, start + 1, start + 2, start + 3];
          const fs = xs.map(() => rng.int(1, 9));
          const n = fs.reduce((s, f) => s + f, 0);
          const total = xs.reduce((s, x, i) => s + x * (fs[i] ?? 0), 0);
          const ans = Q.of(total, n);
          const plain = Q.of(
            xs.reduce((s, x) => s + x, 0),
            4,
          );
          return numberProblem({
            prompt: t(
              `A sample is summarized as: value $${xs.join(", ")}$ with frequencies $${fs.join(", ")}$ respectively. Find the sample mean.`,
              `某样本的汇总为：取值 $${xs.join(", ")}$，频数依次为 $${fs.join(", ")}$。求样本均值。`,
            ),
            answer: ans,
            wrong: [plain, Q.of(total, 4), Q.of(n, 4)].filter((w) => !w.eq(ans)),
            solution: t(
              `$\\sum f_j x_j = ${xs.map((x, i) => `${fs[i]} \\cdot ${x}`).join(" + ")} = ${total}$ and $n = ${n}$, so $\\bar{x} = \\frac{${total}}{${n}}${lowestTerms(total, n)}$.`,
              `$\\sum f_j x_j = ${xs.map((x, i) => `${fs[i]} \\cdot ${x}`).join(" + ")} = ${total}$，$n = ${n}$，所以 $\\bar{x} = \\frac{${total}}{${n}}${lowestTerms(total, n)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.22.2 Sampling Distributions
  {
    id: "sampling-distributions",
    title: t("Sampling Distributions", "抽样分布"),
    summary: t(
      "A sampling distribution is the probability distribution of a sample statistic across repeated random samples of size n drawn from the same population.",
      "抽样分布指从同一总体中重复抽取容量为 n 的随机样本时，某一特定样本统计量的概率分布。",
    ),
    prerequisites: ["the-sample-mean"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "sampling-distribution-unbiased-expectation",
        title: t("Expected value of the sample mean statistic", "样本均值统计量的数学期望"),
        explanation: t(
          "The sample mean varies from sample to sample, but on average it hits the population mean exactly, which is what unbiased means. For any population with mean $\\mu$, the expected value of the sample mean is $E[\\bar{X}] = \\mu$ (unbiasedness).",
          "样本均值随样本不同而变化，但平均来说它恰好等于总体均值，这就是无偏的含义。对任意均值为 $\\mu$ 的总体，样本均值的期望值满足 $E[\\bar{X}] = \\mu$（无偏性）。",
        ),
        generate: (rng: Rng): Problem => {
          const mu = rng.int(10, 90);
          const n = rng.int(5, 50);

          return numberProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ is drawn from a population with mean $\\mu = ${mu}$ and standard deviation $\\sigma = 8$. What is the expected value of the sample mean, $E[\\bar{X}]$?`,
              `从均值 $\\mu = ${mu}$、标准差 $\\sigma = 8$ 的总体中抽取容量为 $n = ${n}$ 的随机样本。样本均值的数学期望 $E[\\bar{X}]$ 是多少？`,
            ),
            answer: mu,
            wrong: [Q.of(mu, n), mu * n, Q.of(8, n)],
            solution: t(
              `The sample mean is an unbiased estimator of the population mean: $E[\\bar{X}] = \\mu = ${mu}$, regardless of sample size $n$.`,
              `样本均值是总体均值的无偏估计量：无论样本容量 $n$ 为何值，均有 $E[\\bar{X}] = \\mu = ${mu}$。`,
            ),
          });
        },
      },
      {
        id: "listing-a-sampling-distribution",
        title: t("Listing a sampling distribution", "列出抽样分布"),
        explanation: t(
          "For a small population the sampling distribution can be built by listing every possible sample. With a population of three equally likely values and samples of size $2$ drawn **with replacement**, there are $3^{2} = 9$ equally likely ordered samples; compute $\\bar{x}$ for each and count.\n\nFor the population $\\{2, 4, 6\\}$, the means are $2$ once, $3$ twice, $4$ three times, $5$ twice and $6$ once, so $P(\\bar{X} = 4) = \\frac{3}{9}$. The distribution of $\\bar{X}$ is more concentrated in the middle than the population is.",
          "对于小总体，可以列出所有可能的样本来构造抽样分布。若总体有三个等可能的值，**有放回**地抽取容量为 $2$ 的样本，则共有 $3^{2} = 9$ 个等可能的有序样本；算出每个样本的 $\\bar{x}$ 再计数。\n\n例如总体 $\\{2, 4, 6\\}$，均值为 $2$ 的一次、$3$ 的两次、$4$ 的三次、$5$ 的两次、$6$ 的一次，所以 $P(\\bar{X} = 4) = \\frac{3}{9}$。$\\bar{X}$ 的分布比总体更集中于中部。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(1, 6);
          const b = a + rng.int(1, 4);
          let c = b + rng.int(1, 4);
          if (c - b === b - a) c += 1;
          const pop = [a, b, c];
          const means = pop.flatMap((x) => pop.map((y) => Q.of(x + y, 2)));
          const target = rng.pick(means);
          const count = means.filter((m) => m.eq(target)).length;
          const ans = Q.of(count, 9);
          return numberProblem({
            prompt: t(
              `A population consists of the values $${pop.join(", ")}$, equally likely. Samples of size $2$ are drawn with replacement. Find $P(\\bar{X} = ${dec(target)})$.`,
              `某总体由等可能的值 $${pop.join(", ")}$ 组成。有放回地抽取容量为 $2$ 的样本。求 $P(\\bar{X} = ${dec(target)})$。`,
            ),
            answer: ans,
            wrong: [Q.of(count, 6), Q.of(1, 3), Q.of(count === 1 ? 2 : 1, 9)].filter((w) => !w.eq(ans)),
            solution: t(
              `There are $9$ equally likely ordered samples, with means ${pop.map((x) => pop.map((y) => `$${dec(Q.of(x + y, 2))}$`).join(", ")).join("; ")}. Exactly $${count}$ of them equal $${dec(target)}$, so the probability is $\\frac{${count}}{9}${lowestTerms(count, 9)}$.`,
              `共有 $9$ 个等可能的有序样本，均值为 ${pop.map((x) => pop.map((y) => `$${dec(Q.of(x + y, 2))}$`).join("，")).join("；")}。恰有 $${count}$ 个等于 $${dec(target)}$，所以概率为 $\\frac{${count}}{9}${lowestTerms(count, 9)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.22.3 The Sample Variance
  {
    id: "the-sample-variance",
    title: t("The Sample Variance", "样本方差"),
    summary: t(
      "The sample variance $S^2 = \\frac{1}{n - 1}\\sum_{i=1}^n (X_i - \\bar{X})^2$ divides by $n - 1$ so that it is an unbiased estimator of the population variance $\\sigma^2$.",
      "样本方差 $S^2 = \\frac{1}{n - 1}\\sum_{i=1}^n (X_i - \\bar{X})^2$ 除以 $n - 1$，从而成为总体方差 $\\sigma^2$ 的无偏估计。",
    ),
    prerequisites: ["the-sample-mean", "properties-of-variance-for-discrete-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "sample-variance-calculation-small-n",
        title: t("Calculating sample variance with n - 1 divisor", "用除数 n - 1 计算样本方差"),
        explanation: t(
          "Dividing by one less than the sample size corrects for measuring spread around the sample mean instead of the unknown true mean. $S^2 = \\frac{1}{n - 1} \\left[\\sum_i x_i^2 - n\\bar{x}^2\\right]$.",
          "除以样本量减 1，是为了修正用样本均值而不是未知真实均值来衡量分散程度所带来的偏差。$S^2 = \\frac{1}{n - 1} \\left[\\sum_i x_i^2 - n\\bar{x}^2\\right]$。",
        ),
        generate: (rng: Rng): Problem => {
          // Choose a mean and deviations so calculations are clean
          const mean = rng.int(5, 20);
          const d1 = rng.int(-4, -1);
          const d2 = rng.int(1, 4);
          const d3 = -d1 - d2; // sum of deviations is 0
          const values = [mean + d1, mean + d2, mean + d3];
          const ss = d1 * d1 + d2 * d2 + d3 * d3;
          // n = 3, n - 1 = 2
          const listStr = values.join(", ");

          return numberProblem({
            prompt: t(
              `Calculate the unbiased sample variance $s^2$ for the sample dataset: $${listStr}$.`,
              `计算样本数据集 $${listStr}$ 的无偏样本方差 $s^2$。`,
            ),
            answer: Q.of(ss, 2),
            wrong: [Q.of(ss, 3), ss, Q.of(ss, 4)],
            solution: t(
              `The sample mean is $\\bar{x} = ${mean}$. The deviations from the mean are $${d1}, ${d2}, ${d3}$, with sum of squared deviations $\\sum (x_i - \\bar{x})^2 = (${d1})^2 + (${d2})^2 + (${d3})^2 = ${ss}$. Dividing by $n - 1 = 2$ yields $s^2 = \\frac{${ss}}{2}${lowestTerms(ss, 2)}$.`,
              `样本均值为 $\\bar{x} = ${mean}$。各离均差分别为 $${d1}, ${d2}, ${d3}$，离均差平方和为 $\\sum (x_i - \\bar{x})^2 = (${d1})^2 + (${d2})^2 + (${d3})^2 = ${ss}$。除以 $n - 1 = 2$ 得到 $s^2 = \\frac{${ss}}{2}${lowestTerms(ss, 2)}$。`,
            ),
          });
        },
      },
      {
        id: "the-variance-from-summary-sums",
        title: t("The variance from summary sums", "由汇总和求方差"),
        explanation: t(
          "Expanding the squares gives a shortcut that needs only $n$, $\\sum x$ and $\\sum x^{2}$:\n\n$$s^{2} = \\frac{1}{n - 1}\\left(\\sum x^{2} - \\frac{\\left(\\sum x\\right)^{2}}{n}\\right).$$\n\nThis is how calculators and summary tables work. For $n = 5$, $\\sum x = 20$ and $\\sum x^{2} = 100$: $s^{2} = \\frac{100 - 80}{4} = 5$. Dividing by $n$ instead of $n - 1$ gives the biased version.",
          "把平方展开得到一个只需 $n$、$\\sum x$ 和 $\\sum x^{2}$ 的简便公式：\n\n$$s^{2} = \\frac{1}{n - 1}\\left(\\sum x^{2} - \\frac{\\left(\\sum x\\right)^{2}}{n}\\right).$$\n\n计算器和汇总表正是这样计算的。若 $n = 5$，$\\sum x = 20$，$\\sum x^{2} = 100$：$s^{2} = \\frac{100 - 80}{4} = 5$。若除以 $n$ 而不是 $n - 1$，得到的是有偏的版本。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(5, 20);
          const sx = rng.int(10, 120);
          const sxx = Q.of(sx * sx, n).add(Q.of(rng.int(5, 200)));
          const sxxInt = Math.ceil(sxx.toNumber());
          const ss = Q.of(sxxInt).sub(Q.of(sx * sx, n));
          const ans = ss.div(Q.of(n - 1));
          return numberProblem({
            prompt: t(
              `A sample of $n = ${n}$ observations has $\\sum x = ${sx}$ and $\\sum x^{2} = ${sxxInt}$. Find the sample variance $s^{2}$.`,
              `某样本有 $n = ${n}$ 个观测，$\\sum x = ${sx}$，$\\sum x^{2} = ${sxxInt}$。求样本方差 $s^{2}$。`,
            ),
            answer: ans,
            wrong: [ss.div(Q.of(n)), ss, Q.of(sxxInt, n - 1)].filter((w) => !w.eq(ans)),
            solution: t(
              `$\\sum x^{2} - \\frac{(\\sum x)^{2}}{n} = ${sxxInt} - \\frac{${sx * sx}}{${n}} = ${ss.toLatex()}$, so $s^{2} = \\frac{1}{${n - 1}} \\cdot ${ss.toLatex()} = ${ans.toLatex()}$.`,
              `$\\sum x^{2} - \\frac{(\\sum x)^{2}}{n} = ${sxxInt} - \\frac{${sx * sx}}{${n}} = ${ss.toLatex()}$，所以 $s^{2} = \\frac{1}{${n - 1}} \\cdot ${ss.toLatex()} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.22.4 Pooled Variance
  {
    id: "pooled-variance",
    title: t("Pooled Variance", "合并方差"),
    summary: t(
      "When two independent samples share a common variance $\\sigma^2$, the pooled sample variance $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$ combines them with $n_1 + n_2 - 2$ degrees of freedom.",
      "当两个独立样本被假定具有相同的总体方差 $\\sigma^2$ 时，合并样本方差 $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$ 结合两组信息，具有 $n_1 + n_2 - 2$ 个自由度。",
    ),
    prerequisites: ["the-sample-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "pooled-variance-evaluation",
        title: t("Computing pooled variance from two independent samples", "根据两个独立样本计算合并方差"),
        explanation: t(
          "When two populations share a variance, combine the samples by weighting each sample variance by its degrees of freedom. The pooled variance is $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$.",
          "当两个总体方差相同时，用各自的自由度对样本方差加权来合并两个样本。合并方差为 $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(5, 20);
          const n2 = rng.int(5, 20);
          const s1Sq = rng.int(4, 25);
          const s2Sq = rng.int(4, 25);
          const df1 = n1 - 1;
          const df2 = n2 - 1;
          const num = df1 * s1Sq + df2 * s2Sq;
          const den = df1 + df2;

          return numberProblem({
            prompt: t(
              `Two independent samples drawn from populations with equal variance have sample sizes $n_1 = ${n1}$, $n_2 = ${n2}$ and sample variances $s_1^2 = ${s1Sq}$, $s_2^2 = ${s2Sq}$. Compute the pooled sample variance $s_p^2$.`,
              `从具有相同方差的总体中抽取的两个独立样本，样本容量分别为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$，样本方差分别为 $s_1^2 = ${s1Sq}$ 与 $s_2^2 = ${s2Sq}$。计算合并样本方差 $s_p^2$。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(s1Sq + s2Sq, 2), Q.of(n1 * s1Sq + n2 * s2Sq, n1 + n2), Q.of(num, den + 2)],
            solution: t(
              `$s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2} = \\frac{(${df1})(${s1Sq}) + (${df2})(${s2Sq})}{${df1} + ${df2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2} = \\frac{(${df1})(${s1Sq}) + (${df2})(${s2Sq})}{${df1} + ${df2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "pooled-variance-from-raw-samples",
        title: t("Pooled variance from raw samples", "由原始样本求合并方差"),
        explanation: t(
          "From raw data, the pooled variance is the total of the squared deviations, each sample measured from **its own** mean, divided by the combined degrees of freedom:\n\n$$s_p^{2} = \\frac{\\sum (x_{1i} - \\bar{x}_1)^{2} + \\sum (x_{2j} - \\bar{x}_2)^{2}}{n_1 + n_2 - 2}.$$\n\nThis equals the weighted formula with $(n_1 - 1)s_1^{2}$ and $(n_2 - 1)s_2^{2}$, since each of those is a sum of squared deviations.",
          "由原始数据计算时，合并方差等于离差平方的总和（每个样本以**各自**的均值为基准），再除以合并后的自由度：\n\n$$s_p^{2} = \\frac{\\sum (x_{1i} - \\bar{x}_1)^{2} + \\sum (x_{2j} - \\bar{x}_2)^{2}}{n_1 + n_2 - 2}.$$\n\n这与用 $(n_1 - 1)s_1^{2}$ 和 $(n_2 - 1)s_2^{2}$ 的加权公式相同，因为它们各自就是离差平方和。",
        ),
        generate: (rng: Rng): Problem => {
          const sets = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-2, 1, 1],
            [-1, -1, 2],
            [-3, 1, 2],
            [-2, -1, 0, 3],
            [-1, -1, 1, 1],
            [-3, 0, 1, 2],
          ];
          const m1 = rng.int(5, 30);
          const m2 = rng.int(5, 30);
          const d1 = rng.pick(sets);
          const d2 = rng.pick(sets);
          const xs = rng.shuffle(d1.map((e) => m1 + e));
          const ys = rng.shuffle(d2.map((e) => m2 + e));
          const ss1 = d1.reduce((s, e) => s + e * e, 0);
          const ss2 = d2.reduce((s, e) => s + e * e, 0);
          const df = xs.length + ys.length - 2;
          const ans = Q.of(ss1 + ss2, df);
          const avg = Q.of(ss1, xs.length - 1)
            .add(Q.of(ss2, ys.length - 1))
            .div(Q.of(2));
          return numberProblem({
            prompt: t(
              `Two independent samples from populations with a common variance are: sample 1: $${xs.join(", ")}$; sample 2: $${ys.join(", ")}$. Find the pooled variance $s_p^{2}$.`,
              `来自方差相同总体的两个独立样本为：样本 1：$${xs.join(", ")}$；样本 2：$${ys.join(", ")}$。求合并方差 $s_p^{2}$。`,
            ),
            answer: ans,
            wrong: [Q.of(ss1 + ss2, df + 2), avg, Q.of(ss1 + ss2)].filter((w) => !w.eq(ans)),
            solution: t(
              `The means are $${m1}$ and $${m2}$. The squared deviations sum to $${ss1}$ and $${ss2}$, so $s_p^{2} = \\frac{${ss1} + ${ss2}}{${xs.length} + ${ys.length} - 2} = \\frac{${ss1 + ss2}}{${df}}${lowestTerms(ss1 + ss2, df)}$.`,
              `两样本均值为 $${m1}$ 和 $${m2}$。离差平方和分别为 $${ss1}$ 和 $${ss2}$，所以 $s_p^{2} = \\frac{${ss1} + ${ss2}}{${xs.length} + ${ys.length} - 2} = \\frac{${ss1 + ss2}}{${df}}${lowestTerms(ss1 + ss2, df)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.22.5 Variance of Sample Means
  {
    id: "variance-of-sample-means",
    title: t("Variance of Sample Means", "样本均值的方差"),
    summary: t(
      "For independent observations from a population with variance $\\sigma^2$, $\\operatorname{Var}(\\bar{X}) = \\frac{\\sigma^2}{n}$, and the standard error of the mean is $\\operatorname{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}$.",
      "对来自方差为 $\\sigma^2$ 总体的独立观测值，$\\operatorname{Var}(\\bar{X}) = \\frac{\\sigma^2}{n}$，均值的标准误为 $\\operatorname{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}$。",
    ),
    prerequisites: ["the-sample-variance"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "standard-error-of-the-mean",
        title: t("Evaluating the standard error of the sample mean", "计算样本均值的标准误差"),
        explanation: t(
          "The standard error measures how much the sample mean typically varies, and quadrupling the sample size only halves it. $SE(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}$ decreases in inverse proportion to the square root of the sample size.",
          "标准误衡量样本均值通常的波动程度，把样本量增加到四倍只能使它减半。$SE(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}$ 与样本容量的平方根成反比。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 12);
          const sigma = rng.int(10, 60);
          const n = k * k; // perfect square

          return numberProblem({
            prompt: t(
              `A sample of size $n = ${n}$ is randomly selected from a population with standard deviation $\\sigma = ${sigma}$. Find the standard error of the sample mean.`,
              `从标准差为 $\\sigma = ${sigma}$ 的总体中随机抽取容量为 $n = ${n}$ 的样本。求样本均值的标准误差。`,
            ),
            answer: Q.of(sigma, k),
            wrong: [Q.of(sigma, n), sigma * k, Q.of(sigma * sigma, n)],
            solution: t(
              `$\\text{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${k}}${lowestTerms(sigma, k)}$.`,
              `$\\text{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${k}}${lowestTerms(sigma, k)}$。`,
            ),
          });
        },
      },
      {
        id: "the-sample-size-for-a-target-standard-error",
        title: t("The sample size for a target standard error", "达到目标标准误所需的样本容量"),
        explanation: t(
          "Solving $\\frac{\\sigma}{\\sqrt{n}} = \\text{SE}$ for $n$ gives\n\n$$n = \\left(\\frac{\\sigma}{\\text{SE}}\\right)^{2}.$$\n\nBecause $n$ sits under a square root, halving the standard error needs **four** times as many observations, and dividing it by $3$ needs nine times as many. Precision is expensive.",
          "由 $\\frac{\\sigma}{\\sqrt{n}} = \\text{SE}$ 解出 $n$：\n\n$$n = \\left(\\frac{\\sigma}{\\text{SE}}\\right)^{2}.$$\n\n由于 $n$ 在平方根之下，标准误减半需要**四倍**的观测，缩小为三分之一需要九倍。精度代价高昂。",
        ),
        generate: (rng: Rng): Problem => {
          const se = Q.of(rng.pick([1, 2, 4, 5, 10, 15, 20, 25]), 10);
          const k = rng.int(3, 20);
          const sigma = se.mul(Q.of(k));
          return numberProblem({
            prompt: t(
              `A population has standard deviation $\\sigma = ${dec(sigma)}$. How many observations are needed for the standard error of the sample mean to be $${dec(se)}$?`,
              `某总体的标准差为 $\\sigma = ${dec(sigma)}$。要使样本均值的标准误为 $${dec(se)}$，需要多少个观测？`,
            ),
            answer: k * k,
            wrong: [k, 2 * k, k * k * 2],
            solution: t(
              `$n = \\left(\\frac{${dec(sigma)}}{${dec(se)}}\\right)^{2} = ${k}^{2} = ${k * k}$.`,
              `$n = \\left(\\frac{${dec(sigma)}}{${dec(se)}}\\right)^{2} = ${k}^{2} = ${k * k}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.22.6 Sample Means From Normal Populations
  {
    id: "sample-means-from-normal-populations",
    title: t("Sample Means From Normal Populations", "正态总体的样本均值分布"),
    summary: t(
      "If a sample is drawn from a normal population $N(\\mu, \\sigma^2)$, the sample mean $\\bar{X}$ is exactly $N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$ for any sample size $n$.",
      "若样本抽取自正态总体 $N(\\mu, \\sigma^2)$，则无论样本容量 $n$ 为何值，样本均值 $\\bar{X}$ 均严格服从 $N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$。",
    ),
    prerequisites: ["variance-of-sample-means", "the-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "exact-normality-of-sample-mean",
        title: t("Exact normality of $\\bar{X}$ from normal populations", "正态总体下样本均值的严格正态性"),
        explanation: t(
          "When the population itself is normal, the sample mean is exactly normal for every sample size, not only approximately for large samples. For a normal population and any $n \\ge 1$, $\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$ holds exactly, without requiring a large $n$.",
          "当总体本身是正态分布时，样本均值对任何样本量都恰好服从正态分布，而不仅仅在大样本时近似成立。对正态总体与任意样本容量 $n \\ge 1$，$\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$ 均精确成立，无需大样本条件。",
        ),
        generate: (rng: Rng): Problem => {
          const mu = rng.int(50, 150);
          const sigmaSq = rng.int(10, 60);
          const n = rng.int(4, 25);

          const opts = [
            t(`$N\\left(${mu}, \\frac{${sigmaSq}}{${n}}\\right)$`, `$N\\left(${mu}, \\frac{${sigmaSq}}{${n}}\\right)$`),
            t(`$N(${mu}, ${sigmaSq})$`, `$N(${mu}, ${sigmaSq})$`),
            t(`$t(${n - 1})$`, `$t(${n - 1})$`),
            t(`$\\chi^2(${n})$`, `$\\chi^2(${n})$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `A random sample of size $n = ${n}$ is selected from a normal population $X \\sim N(${mu}, ${sigmaSq})$. What is the exact sampling distribution of the sample mean $\\bar{X}$?`,
                `从正态总体 $X \\sim N(${mu}, ${sigmaSq})$ 中随机抽取容量为 $n = ${n}$ 的样本。样本均值 $\\bar{X}$ 的精确抽样分布是什么？`,
              ),
              options,
              correct,
              solution: t(
                `Linear combinations of normal variables are strictly normal. Thus $\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right) = N\\left(${mu}, \\frac{${sigmaSq}}{${n}}\\right)$.`,
                `正态变量的线性组合仍严格服从正态分布。因此 $\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right) = N\\left(${mu}, \\frac{${sigmaSq}}{${n}}\\right)$。`,
              ),
            }),
            [
              [
                opts[1]!.en,
                `This is the distribution of one observation: the variance of the mean is divided by $${n}$.`,
                `这是单个观测值的分布：均值的方差要除以 $${n}$。`,
              ],
              [
                opts[2]!.en,
                "The $t$ distribution describes the mean standardized with the sample standard deviation, not the mean itself.",
                "$t$ 分布描述的是用样本标准差标准化后的均值，不是均值本身。",
              ],
              [
                opts[3]!.en,
                "A chi-square variable is a sum of squared standard normals and is never negative, unlike this mean.",
                "卡方变量是标准正态变量的平方和，不会取负值，与这个均值不同。",
              ],
            ],
          );
        },
      },
      {
        id: "probabilities-for-the-sample-mean",
        title: t("Probabilities for the sample mean", "样本均值的概率"),
        explanation: t(
          "Since $\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^{2}}{n}\\right)$, standardize with the **standard error**, not with $\\sigma$:\n\n$$P(\\bar{X} > c) = 1 - \\Phi\\left(\\frac{c - \\mu}{\\sigma/\\sqrt{n}}\\right).$$\n\nA value that is unremarkable for a single observation can be very unlikely for a mean: with $\\mu = 50$, $\\sigma = 10$, $P(X > 55) \\approx 0.31$, but for $n = 16$, $P(\\bar{X} > 55) = 1 - \\Phi(2) \\approx 0.023$.",
          "由于 $\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^{2}}{n}\\right)$，要用**标准误**而不是 $\\sigma$ 来标准化：\n\n$$P(\\bar{X} > c) = 1 - \\Phi\\left(\\frac{c - \\mu}{\\sigma/\\sqrt{n}}\\right).$$\n\n对单个观测来说平常的值，对均值而言可能极不寻常：$\\mu = 50$，$\\sigma = 10$ 时 $P(X > 55) \\approx 0.31$，但 $n = 16$ 时 $P(\\bar{X} > 55) = 1 - \\Phi(2) \\approx 0.023$。",
        ),
        generate: (rng: Rng): Problem => {
          const zv = rng.pick([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5]);
          const k = rng.int(2, 8);
          const se = rng.int(1, 5);
          const mu = rng.int(20, 150);
          const c = Q.of(mu).add(Q.parse(String(zv)).mul(Q.of(se)));
          const above = rng.bool();
          const ans = above ? Q.one.sub(phi(zv)) : phi(zv);
          return numberProblem({
            prompt: t(
              `A random sample of $n = ${k * k}$ is taken from $N(${mu}, ${(se * k) ** 2})$. Find $P(\\bar{X} ${above ? ">" : "<"} ${dec(c)})$. Use ${PHI_TABLE.en}.`,
              `从 $N(${mu}, ${(se * k) ** 2})$ 中抽取容量 $n = ${k * k}$ 的随机样本。求 $P(\\bar{X} ${above ? ">" : "<"} ${dec(c)})$。利用${PHI_TABLE["zh-CN"]}。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [Q.one.sub(ans), Q.of(2).mul(ans.cmp(Q.of(1, 2)) < 0 ? ans : Q.one.sub(ans))].filter((w) => !w.eq(ans)),
            solution: t(
              `The standard error is $\\frac{${se * k}}{${k}} = ${se}$, so $z = \\frac{${dec(c)} - ${mu}}{${se}} = ${zv}$ and the probability is $${above ? `1 - \\Phi(${zv})` : `\\Phi(${zv})`} = ${dec(ans)}$.`,
              `标准误为 $\\frac{${se * k}}{${k}} = ${se}$，所以 $z = \\frac{${dec(c)} - ${mu}}{${se}} = ${zv}$，概率为 $${above ? `1 - \\Phi(${zv})` : `\\Phi(${zv})`} = ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.22.7 Sampling Proportions From Finite Populations
  {
    id: "sampling-proportions-from-finite-populations",
    title: t("Sampling Proportions From Finite Populations", "有限总体的样本比例抽样"),
    summary: t(
      "The sample proportion p̂ = X / n has expectation E[p̂] = p and variance Var(p̂) = (p(1-p)/n) ((N-n)/(N-1)) when sampling without replacement from a finite population of size N.",
      "当不放回地从容量为 N 的有限总体中抽样时，样本比例 p̂ = X / n 的期望为 E[p̂] = p，方差为 Var(p̂) = (p(1-p)/n) ((N-n)/(N-1))。",
    ),
    prerequisites: ["sampling-distributions", "the-binomial-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "sample-proportion-unbiasedness",
        title: t("Expectation of sample proportion estimator", "样本比例估计量的数学期望"),
        explanation: t(
          "Each sampled item is equally likely to be any member of the population, so on average the sample proportion equals the population proportion. The estimate is unbiased, $E[\\hat{p}] = p$, whatever the population size $N$.",
          "每个抽到的个体都同样可能是总体中的任何成员，所以平均来说样本比例等于总体比例。无论总体容量 $N$ 为何值，样本比例均满足无偏性 $E[\\hat{p}] = p$。",
        ),
        generate: (rng: Rng): Problem => {
          const num = rng.int(1, 9);
          const den = 10;
          const n = rng.int(20, 100);
          const popSize = rng.int(500, 2000);

          return numberProblem({
            prompt: t(
              `In a finite population of size $N = ${popSize}$, the true population proportion of voters supporting a policy is $p = \\frac{${num}}{${den}}$. A random sample of size $n = ${n}$ is selected without replacement. Find the expected value of the sample proportion $E[\\hat{p}]$.`,
              `在容量为 $N = ${popSize}$ 的有限总体中，支持某项政策的真实总体选民比例为 $p = \\frac{${num}}{${den}}$。现不放回抽取容量为 $n = ${n}$ 的随机样本。求样本比例的数学期望 $E[\\hat{p}]$。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(num * n, den * popSize), Q.of(n, popSize), Q.of(den - num, den)],
            solution: t(
              `The sample proportion $\\hat{p} = \\frac{X}{n}$ is an unbiased estimator of $p$: $E[\\hat{p}] = p = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `样本比例 $\\hat{p} = \\frac{X}{n}$ 是 $p$ 的无偏估计量：$E[\\hat{p}] = p = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "the-variance-of-a-sample-proportion-without-replacement",
        title: t("The variance of a sample proportion without replacement", "不放回抽样时样本比例的方差"),
        explanation: t(
          "Without replacement, successive draws are slightly negatively correlated, and the variance of $\\hat{p}$ shrinks by the finite population factor:\n\n$$\\operatorname{Var}(\\hat{p}) = \\frac{p(1 - p)}{n} \\cdot \\frac{N - n}{N - 1}.$$\n\nIf the whole population is sampled, $n = N$ and the variance is $0$: the sample proportion is then the population proportion.",
          "不放回抽样时，相继的抽取略呈负相关，$\\hat{p}$ 的方差要乘以有限总体因子而缩小：\n\n$$\\operatorname{Var}(\\hat{p}) = \\frac{p(1 - p)}{n} \\cdot \\frac{N - n}{N - 1}.$$\n\n若抽取整个总体，$n = N$，方差为 $0$：此时样本比例就是总体比例。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.pick([21, 31, 41, 51, 61, 101]);
          const n = rng.int(3, Math.floor(N / 2));
          const num = rng.int(1, 4);
          const p = Q.of(num, 5);
          const base = p.mul(Q.one.sub(p)).div(Q.of(n));
          const fpc = Q.of(N - n, N - 1);
          const ans = base.mul(fpc);
          return numberProblem({
            prompt: t(
              `A population of $N = ${N}$ has proportion $p = ${dec(p)}$ of successes. A sample of $n = ${n}$ is drawn without replacement. Find $\\operatorname{Var}(\\hat{p})$.`,
              `容量 $N = ${N}$ 的总体中成功的比例为 $p = ${dec(p)}$。不放回地抽取 $n = ${n}$ 个。求 $\\operatorname{Var}(\\hat{p})$。`,
            ),
            answer: ans,
            wrong: [base, base.mul(Q.of(N - n, N)), p.mul(Q.one.sub(p)).mul(fpc)].filter((w) => !w.eq(ans)),
            solution: t(
              `$\\frac{p(1 - p)}{n} = \\frac{${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${n}} = ${base.toLatex()}$ and $\\frac{N - n}{N - 1} = \\frac{${N - n}}{${N - 1}}$, so $\\operatorname{Var}(\\hat{p}) = ${ans.toLatex()}$.`,
              `$\\frac{p(1 - p)}{n} = \\frac{${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${n}} = ${base.toLatex()}$，$\\frac{N - n}{N - 1} = \\frac{${N - n}}{${N - 1}}$，所以 $\\operatorname{Var}(\\hat{p}) = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.22.8 The Method of Moments
  {
    id: "the-method-of-moments",
    title: t("The Method of Moments", "矩估计法"),
    summary: t(
      "The method of moments equates the population moments $\\mu_k = E[X^k]$ to the sample moments $m_k = \\frac{1}{n}\\sum X_i^k$ and solves for the parameters.",
      "矩估计法令总体矩 $\\mu_k = E[X^k]$ 等于样本矩 $m_k = \\frac{1}{n}\\sum X_i^k$，联立求解未知参数的估计量。",
    ),
    prerequisites: ["sampling-distributions", "moments-of-discrete-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "method-of-moments-poisson-or-exp",
        title: t("Estimating parameter using the first sample moment", "利用一阶样本矩估计未知参数"),
        explanation: t(
          "The method of moments sets the sample mean equal to the theoretical mean and solves for the parameter. For $X \\sim \\text{Poisson}(\\lambda)$, $E[X] = \\lambda$, so the method of moments estimator is $\\hat{\\lambda} = \\bar{x}$.",
          "矩估计法令样本均值等于理论均值，再解出参数。对于 $X \\sim \\text{Poisson}(\\lambda)$，$E[X] = \\lambda$，故矩估计量为 $\\hat{\\lambda} = \\bar{x}$。",
        ),
        generate: (rng: Rng): Problem => {
          const sum = rng.int(40, 200);
          const n = rng.int(10, 50);

          return numberProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ from a Poisson distribution $\\text{Poisson}(\\lambda)$ has sample sum $\\sum_{i=1}^{${n}} x_i = ${sum}$. Find the method-of-moments estimate $\\hat{\\lambda}$.`,
              `从泊松分布 $\\text{Poisson}(\\lambda)$ 中抽取容量为 $n = ${n}$ 的随机样本，其观测值总和为 $\\sum_{i=1}^{${n}} x_i = ${sum}$。求比率参数 $\\lambda$ 的矩估计值 $\\hat{\\lambda}$。`,
            ),
            answer: Q.of(sum, n),
            wrong: [Q.of(n, sum), Q.of(sum, n - 1), sum],
            solution: t(
              `Setting the population first moment equal to the sample first moment: $E[X] = \\lambda = \\bar{x} = \\frac{\\sum x_i}{n} = \\frac{${sum}}{${n}}$. Thus $\\hat{\\lambda} = \\frac{${sum}}{${n}}${lowestTerms(sum, n)}$.`,
              `令总体一阶原点矩等于样本一阶原点矩：$E[X] = \\lambda = \\bar{x} = \\frac{\\sum x_i}{n} = \\frac{${sum}}{${n}}$。因此 $\\hat{\\lambda} = \\frac{${sum}}{${n}}${lowestTerms(sum, n)}$。`,
            ),
          });
        },
      },
      {
        id: "method-of-moments-for-the-geometric-distribution",
        title: t("The method of moments for the geometric distribution", "几何分布的矩估计"),
        explanation: t(
          "If $X$ counts the trials up to and including the first success, $E[X] = \\frac{1}{p}$. Setting this equal to the sample mean and solving gives\n\n$$\\hat{p} = \\frac{1}{\\bar{x}} = \\frac{n}{\\sum x_i}.$$\n\nA long average wait means a small success probability. If $8$ customers needed $40$ calls in total to make a sale, $\\bar{x} = 5$ and $\\hat{p} = 0.2$.",
          "若 $X$ 表示直到首次成功（含该次）所需的试验次数，则 $E[X] = \\frac{1}{p}$。令它等于样本均值并求解：\n\n$$\\hat{p} = \\frac{1}{\\bar{x}} = \\frac{n}{\\sum x_i}.$$\n\n平均等待越长，成功概率越小。若 $8$ 名推销员总共打了 $40$ 次电话才各成交一次，$\\bar{x} = 5$，$\\hat{p} = 0.2$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(5, 30);
          const sum = n + rng.int(n, 8 * n);
          const ans = Q.of(n, sum);
          return numberProblem({
            prompt: t(
              `The number of trials up to and including the first success is recorded $n = ${n}$ times, with total $\\sum x_i = ${sum}$. Assuming a geometric distribution with $E[X] = \\frac{1}{p}$, find the method-of-moments estimate $\\hat{p}$.`,
              `记录了 $n = ${n}$ 次“直到首次成功（含该次）的试验次数”，总和 $\\sum x_i = ${sum}$。假定服从 $E[X] = \\frac{1}{p}$ 的几何分布，求 $p$ 的矩估计 $\\hat{p}$。`,
            ),
            answer: ans,
            wrong: [Q.of(sum, n), Q.of(n, sum - n), Q.one.sub(ans)],
            solution: t(
              `$\\bar{x} = \\frac{${sum}}{${n}}$, and $\\frac{1}{\\hat{p}} = \\bar{x}$ gives $\\hat{p} = \\frac{${n}}{${sum}}${lowestTerms(n, sum)}$.`,
              `$\\bar{x} = \\frac{${sum}}{${n}}$，由 $\\frac{1}{\\hat{p}} = \\bar{x}$ 得 $\\hat{p} = \\frac{${n}}{${sum}}${lowestTerms(n, sum)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.22.9 The Method of Moments: Two-Parameter Distributions
  {
    id: "the-method-of-moments-two-parameter-distributions",
    title: t("The Method of Moments: Two-Parameter Distributions", "两参数分布的矩估计法"),
    summary: t(
      "For two-parameter families, the first two population moments $E[X]$ and $E[X^2]$ are matched to the sample moments $m_1 = \\bar{x}$ and $m_2 = \\frac{1}{n}\\sum X_i^2$ to estimate both parameters at once.",
      "对于含两个未知参数的分布族，令前两阶总体矩 $E[X]$ 与 $E[X^2]$ 分别等于样本矩 $m_1 = \\bar{x}$ 与 $m_2 = \\frac{1}{n}\\sum X_i^2$，同时估计两个参数。",
    ),
    prerequisites: ["the-method-of-moments"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "method-of-moments-uniform-zero-theta",
        title: t("Method of moments for the continuous uniform $U(0, \\theta)$", "连续均匀分布 $U(0, \\theta)$ 的矩估计"),
        explanation: t(
          "The mean of a uniform distribution starting at zero is half its upper endpoint, so doubling the sample mean estimates that endpoint. For $X \\sim U(0, \\theta)$, $E[X] = \\theta/2$, so $\\hat{\\theta} = 2\\bar{x}$.",
          "从零开始的均匀分布的均值是上端点的一半，所以把样本均值加倍就能估计这个端点。对于 $X \\sim U(0, \\theta)$，理论均值为 $E[X] = \\theta/2$，因此矩估计量为 $\\hat{\\theta} = 2\\bar{x}$。",
        ),
        generate: (rng: Rng): Problem => {
          const mean = rng.int(10, 60);

          return numberProblem({
            prompt: t(
              `A random sample is taken from a uniform distribution $X \\sim U(0, \\theta)$. The sample mean is calculated to be $\\bar{x} = ${mean}$. Using the method of moments, find the estimate $\\hat{\\theta}$.`,
              `从均匀分布 $X \\sim U(0, \\theta)$ 中抽取随机样本，计算得到样本均值为 $\\bar{x} = ${mean}$。利用矩估计法求未知参数 $\\theta$ 的估计值 $\\hat{\\theta}$。`,
            ),
            answer: 2 * mean,
            wrong: [mean, Q.of(mean, 2), mean * mean],
            solution: t(
              `For $X \\sim U(0, \\theta)$, the theoretical mean is $E[X] = \\frac{\\theta}{2}$. Equating $E[X] = \\bar{x}$ gives $\\frac{\\hat{\\theta}}{2} = ${mean} \\implies \\hat{\\theta} = 2(${mean}) = ${2 * mean}$.`,
              `对于 $X \\sim U(0, \\theta)$，理论均值为 $E[X] = \\frac{\\theta}{2}$。令 $E[X] = \\bar{x}$ 得 $\\frac{\\hat{\\theta}}{2} = ${mean} \\implies \\hat{\\theta} = 2(${mean}) = ${2 * mean}$。`,
            ),
          });
        },
      },
      {
        id: "method-of-moments-for-the-normal-variance",
        title: t("The method of moments for a normal variance", "正态方差的矩估计"),
        explanation: t(
          "For $N(\\mu, \\sigma^{2})$, $E[X] = \\mu$ and $E[X^{2}] = \\sigma^{2} + \\mu^{2}$. Matching these with $m_1 = \\bar{x}$ and $m_2 = \\frac{1}{n}\\sum x_i^{2}$ gives\n\n$$\\hat{\\mu} = m_1, \\qquad \\hat{\\sigma}^{2} = m_2 - m_1^{2}.$$\n\nThe moment estimator divides by $n$, not $n - 1$, so it is slightly smaller than the sample variance $s^{2}$: $\\hat{\\sigma}^{2} = \\frac{n - 1}{n}s^{2}$.",
          "对于 $N(\\mu, \\sigma^{2})$，$E[X] = \\mu$，$E[X^{2}] = \\sigma^{2} + \\mu^{2}$。令它们等于 $m_1 = \\bar{x}$ 与 $m_2 = \\frac{1}{n}\\sum x_i^{2}$，得\n\n$$\\hat{\\mu} = m_1, \\qquad \\hat{\\sigma}^{2} = m_2 - m_1^{2}.$$\n\n矩估计量除以 $n$ 而不是 $n - 1$，所以比样本方差 $s^{2}$ 略小：$\\hat{\\sigma}^{2} = \\frac{n - 1}{n}s^{2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.pick([4, 5, 8, 10, 20, 25]);
          const m1 = Q.of(rng.int(10, 120), 10);
          const v = Q.of(rng.int(5, 90), 10);
          const m2 = v.add(m1.pow(2));
          return numberProblem({
            prompt: t(
              `A sample of $n = ${n}$ from $N(\\mu, \\sigma^{2})$ has $\\frac{1}{n}\\sum x_i = ${dec(m1)}$ and $\\frac{1}{n}\\sum x_i^{2} = ${dec(m2)}$. Find the method-of-moments estimate $\\hat{\\sigma}^{2}$.`,
              `来自 $N(\\mu, \\sigma^{2})$、容量 $n = ${n}$ 的样本有 $\\frac{1}{n}\\sum x_i = ${dec(m1)}$，$\\frac{1}{n}\\sum x_i^{2} = ${dec(m2)}$。求 $\\sigma^{2}$ 的矩估计 $\\hat{\\sigma}^{2}$。`,
            ),
            answer: v,
            form: "decimal",
            wrong: [m2.sub(m1), v.mul(Q.of(n, n - 1)), m2],
            solution: t(
              `$\\hat{\\sigma}^{2} = m_2 - m_1^{2} = ${dec(m2)} - ${dec(m1)}^{2} = ${dec(m2)} - ${dec(m1.pow(2))} = ${dec(v)}$.`,
              `$\\hat{\\sigma}^{2} = m_2 - m_1^{2} = ${dec(m2)} - ${dec(m1)}^{2} = ${dec(m2)} - ${dec(m1.pow(2))} = ${dec(v)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.23.1 The Central Limit Theorem
  {
    id: "the-central-limit-theorem",
    title: t("The Central Limit Theorem", "中心极限定理"),
    summary: t(
      "The Central Limit Theorem (CLT) states that the standardized sample mean Z = (X̄ - μ)/(σ/√n) converges in distribution to standard normal N(0, 1) as n → ∞, regardless of population shape.",
      "中心极限定理（CLT）指出：当样本容量 n → ∞ 时，无论总体分布形状为何，标准化样本均值 Z = (X̄ - μ)/(σ/√n) 均依分布收敛于标准正态分布 N(0, 1)。",
    ),
    prerequisites: ["sample-means-from-normal-populations"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "clt-convergence-distribution",
        title: t("Asymptotic distribution of the standardized mean under CLT", "中心极限定理下标准化均值的渐近分布"),
        explanation: t(
          "The central limit theorem says that for large samples the standardized mean is approximately standard normal, whatever the shape of the population. As $n \\to \\infty$, $\\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$ converges in distribution to $N(0, 1)$ for any population with finite variance $\\sigma^2$.",
          "中心极限定理说明，无论总体的形状如何，大样本时标准化的均值近似服从标准正态分布。当 $n \\to \\infty$ 时，对任意方差 $\\sigma^2$ 有限的总体，$\\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$ 依分布收敛至 $N(0, 1)$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(30, 200);

          const opts = [
            t(`Standard normal distribution $N(0, 1)$`, `标准正态分布 $N(0, 1)$`),
            t(`Student's $t$-distribution with $n - 1$ degrees of freedom`, `自由度为 $n - 1$ 的学生 $t$ 分布`),
            t(`Chi-square distribution $\\chi^2(${n})$`, `卡方分布 $\\chi^2(${n})$`),
            t(`Uniform distribution $U(-1, 1)$`, `均匀分布 $U(-1, 1)$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ is drawn from a highly skewed population with mean $\\mu$ and finite variance $\\sigma^2$. By the Central Limit Theorem, what distribution does the standardized statistic $Z_n = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$ approximately follow?`,
              `从一个高度偏斜、均值为 $\\mu$ 且具有有限方差 $\\sigma^2$ 的总体中抽取容量为 $n = ${n}$ 的样本。根据中心极限定理，标准化统计量 $Z_n = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$ 近似服从什么分布？`,
            ),
            options,
            correct,
            solution: t(
              `By the Lindeberg-Lévy Central Limit Theorem, as $n$ becomes large, the distribution of $Z_n = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$ approaches the standard normal distribution $N(0, 1)$.`,
              `由林德伯格-列维中心极限定理，当 $n$ 充分大时，$Z_n = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$ 的分布渐近收敛于标准正态分布 $N(0, 1)$。`,
            ),
          });
        },
      },
      {
        id: "the-spread-of-a-sample-sum",
        title: t("The spread of a sample sum", "样本和的离散程度"),
        explanation: t(
          "The CLT applies to the sum $S_n = X_1 + \\cdots + X_n$ as well as to the mean, with\n\n$$E[S_n] = n\\mu, \\qquad \\operatorname{SD}(S_n) = \\sigma\\sqrt{n}.$$\n\nThe sum's spread **grows** like $\\sqrt{n}$, while the mean's spread $\\frac{\\sigma}{\\sqrt{n}}$ shrinks. The sum's standard deviation is not $n\\sigma$: independent errors partly cancel.",
          "中心极限定理不仅适用于均值，也适用于和 $S_n = X_1 + \\cdots + X_n$，且\n\n$$E[S_n] = n\\mu, \\qquad \\operatorname{SD}(S_n) = \\sigma\\sqrt{n}.$$\n\n和的离散程度按 $\\sqrt{n}$ **增大**，而均值的离散程度 $\\frac{\\sigma}{\\sqrt{n}}$ 减小。和的标准差不是 $n\\sigma$：独立的误差会部分抵消。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(3, 15);
          const sigma = Q.of(rng.int(5, 60), 10);
          const ans = sigma.mul(Q.of(k));
          return numberProblem({
            prompt: t(
              `Each of $n = ${k * k}$ independent items has a weight with standard deviation $\\sigma = ${dec(sigma)}$ g. Find the standard deviation of the total weight.`,
              `$n = ${k * k}$ 件相互独立的物品，每件重量的标准差为 $\\sigma = ${dec(sigma)}$ 克。求总重量的标准差。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [sigma.mul(Q.of(k * k)), sigma.pow(2).mul(Q.of(k * k))],
            unit: "g",
            solution: t(
              `$\\operatorname{SD}(S_n) = \\sigma\\sqrt{n} = ${dec(sigma)} \\cdot \\sqrt{${k * k}} = ${dec(sigma)} \\cdot ${k} = ${dec(ans)}$ g.`,
              `$\\operatorname{SD}(S_n) = \\sigma\\sqrt{n} = ${dec(sigma)} \\cdot \\sqrt{${k * k}} = ${dec(sigma)} \\cdot ${k} = ${dec(ans)}$ 克。`,
            ),
          });
        },
      },
    ],
  },

  // 6.23.2 Applications of the Central Limit Theorem
  {
    id: "applications-of-the-central-limit-theorem",
    title: t("Applications of the Central Limit Theorem", "中心极限定理的应用"),
    summary: t(
      "The CLT allows calculating approximate probabilities for sample sums and sample means using the standard normal distribution.",
      "中心极限定理使人们能够利用标准正态分布对大样本下的样本和与样本均值计算近似概率。",
    ),
    prerequisites: ["the-central-limit-theorem"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "clt-standardized-z-score",
        title: t("Computing the z-score for a sample mean under CLT", "利用 CLT 计算样本均值的标准化 z 分数"),
        explanation: t(
          "Standardizing measures how many standard errors the sample mean lies from the population mean, which the central limit theorem treats as standard normal.\n\n$$z = \\frac{\\bar{x} - \\mu}{\\sigma / \\sqrt{n}}$$",
          "标准化衡量样本均值离总体均值有多少个标准误，中心极限定理把它视为标准正态分布。\n\n$$z = \\frac{\\bar{x} - \\mu}{\\sigma / \\sqrt{n}}$$",
        ),
        generate: (rng: Rng): Problem => {
          const mu = rng.int(40, 100);
          const k = rng.int(2, 8);
          const n = k * k; // sqrt(n) = k
          const sigma = k * rng.int(2, 6); // sigma / sqrt(n) is integer SE
          const se = sigma / k;
          const diff = rng.int(1, 4) * se;
          const xBar = mu + diff;
          const z = diff / se;

          return numberProblem({
            prompt: t(
              `A sample of size $n = ${n}$ is drawn from a population with mean $\\mu = ${mu}$ and standard deviation $\\sigma = ${sigma}$. Find the standardized $z$-score corresponding to a sample mean of $\\bar{x} = ${xBar}$.`,
              `从均值 $\\mu = ${mu}$、标准差 $\\sigma = ${sigma}$ 的总体中抽取容量为 $n = ${n}$ 的样本。求样本均值 $\\bar{x} = ${xBar}$ 所对应的标准化 $z$ 分数。`,
            ),
            answer: z,
            wrong: [Q.of(diff, sigma), diff, z * k],
            solution: t(
              `The standard error is $\\text{SE} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{${k}} = ${se}$. The $z$-score is $z = \\frac{\\bar{x} - \\mu}{\\text{SE}} = \\frac{${xBar} - ${mu}}{${se}} = \\frac{${diff}}{${se}} = ${z}$.`,
              `标准误差为 $\\text{SE} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{${k}} = ${se}$。标准化 $z$ 分数为 $z = \\frac{\\bar{x} - \\mu}{\\text{SE}} = \\frac{${xBar} - ${mu}}{${se}} = \\frac{${diff}}{${se}} = ${z}$。`,
            ),
          });
        },
      },
      {
        id: "probabilities-for-a-sample-sum",
        title: t("Probabilities for a sample sum", "样本和的概率"),
        explanation: t(
          "For a large sample, $S_n$ is approximately $N(n\\mu, n\\sigma^{2})$, so\n\n$$P(S_n > c) \\approx 1 - \\Phi\\left(\\frac{c - n\\mu}{\\sigma\\sqrt{n}}\\right).$$\n\nThis answers capacity questions: whether $36$ suitcases with mean $20$ kg and standard deviation $5$ kg exceed a $750$ kg limit. Here $n\\mu = 720$, $\\sigma\\sqrt{n} = 30$, $z = 1$ and the probability is about $1 - 0.8413 = 0.1587$.",
          "对于大样本，$S_n$ 近似服从 $N(n\\mu, n\\sigma^{2})$，所以\n\n$$P(S_n > c) \\approx 1 - \\Phi\\left(\\frac{c - n\\mu}{\\sigma\\sqrt{n}}\\right).$$\n\n这可以回答容量问题：均值 $20$ 千克、标准差 $5$ 千克的 $36$ 件行李是否超过 $750$ 千克的限额。此时 $n\\mu = 720$，$\\sigma\\sqrt{n} = 30$，$z = 1$，概率约为 $1 - 0.8413 = 0.1587$。",
        ),
        generate: (rng: Rng): Problem => {
          const zv = rng.pick([-1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5]);
          const k = rng.pick([6, 7, 8, 9, 10]);
          const n = k * k;
          const sigma = rng.int(2, 8);
          const mu = rng.int(10, 40);
          const sd = sigma * k;
          const c = Q.of(n * mu).add(Q.parse(String(zv)).mul(Q.of(sd)));
          const ans = Q.one.sub(phi(zv));
          return numberProblem({
            prompt: t(
              `Each of $${n}$ independent parcels has mean weight $${mu}$ kg and standard deviation $${sigma}$ kg. Using the central limit theorem, find the probability that the total weight exceeds $${dec(c)}$ kg. Use ${PHI_TABLE.en}.`,
              `$${n}$ 件相互独立的包裹，每件重量均值 $${mu}$ 千克、标准差 $${sigma}$ 千克。利用中心极限定理，求总重量超过 $${dec(c)}$ 千克的概率。利用${PHI_TABLE["zh-CN"]}。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [phi(zv), Q.one.sub(phi(Math.min(2.5, Math.abs(zv) * 2) * Math.sign(zv)))].filter((w) => !w.eq(ans)),
            solution: t(
              `$E[S] = ${n} \\cdot ${mu} = ${n * mu}$ and $\\operatorname{SD}(S) = ${sigma}\\sqrt{${n}} = ${sd}$, so $z = \\frac{${dec(c)} - ${n * mu}}{${sd}} = ${zv}$ and $P(S > ${dec(c)}) \\approx 1 - \\Phi(${zv}) = ${dec(ans)}$.`,
              `$E[S] = ${n} \\cdot ${mu} = ${n * mu}$，$\\operatorname{SD}(S) = ${sigma}\\sqrt{${n}} = ${sd}$，所以 $z = \\frac{${dec(c)} - ${n * mu}}{${sd}} = ${zv}$，$P(S > ${dec(c)}) \\approx 1 - \\Phi(${zv}) = ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.23.3 Finite Population Corrections for Sample Means
  {
    id: "finite-population-corrections-for-sample-means",
    title: t("Finite Population Corrections for Sample Means", "样本均值的有限总体校正"),
    summary: t(
      "When sampling without replacement from a finite population of size N, the finite population correction (FPC) reduces the standard error: SE(X̄) = (σ / √n) √((N - n) / (N - 1)).",
      "当不放回地从容量为 N 的有限总体中抽样时，有限总体校正因子（FPC）使标准误差减小：SE(X̄) = (σ / √n) √((N - n) / (N - 1))。",
    ),
    prerequisites: ["applications-of-the-central-limit-theorem"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-fpc-factor-squared",
        title: t("Evaluating the squared finite population correction factor", "计算有限总体校正因子的平方值"),
        explanation: t(
          "When sampling without replacement from a small population, each draw tells you more, so the variance is multiplied by this correction factor below one. The squared FPC factor is $\\frac{N - n}{N - 1}$.",
          "从小总体中不放回抽样时，每次抽取提供的信息更多，所以方差要乘以这个小于 1 的修正因子。有限总体校正因子的平方为 $\\frac{N - n}{N - 1}$。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(100, 500);
          const n = rng.int(10, 80);
          const num = N - n;
          const den = N - 1;

          return numberProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ is sampled without replacement from a finite population of size $N = ${N}$. What is the rational value of the squared finite population correction factor, $\\frac{N - n}{N - 1}$?`,
              `从容量为 $N = ${N}$ 的有限总体中不放回抽取容量为 $n = ${n}$ 的随机样本。求有限总体校正因子平方 $\\frac{N - n}{N - 1}$ 的有理数值。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(n, N), Q.of(num, N), Q.of(N - n - 1, N - 1)],
            solution: t(
              `$\\text{FPC}^2 = \\frac{N - n}{N - 1} = \\frac{${N} - ${n}}{${N} - 1} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$\\text{FPC}^2 = \\frac{N - n}{N - 1} = \\frac{${N} - ${n}}{${N} - 1} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "the-corrected-standard-error-of-the-mean",
        title: t("The corrected standard error of the mean", "均值的修正标准误"),
        explanation: t(
          "Multiply the usual standard error by the square root of the correction factor:\n\n$$\\operatorname{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}\\sqrt{\\frac{N - n}{N - 1}}.$$\n\nThe factor itself is a ratio of counts; the standard error uses its **square root**, while the variance uses the factor as it is. For $N = 101$, $n = 37$: $\\frac{64}{100}$ for the variance, $0.8$ for the standard error.",
          "把通常的标准误乘以校正因子的平方根：\n\n$$\\operatorname{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}\\sqrt{\\frac{N - n}{N - 1}}.$$\n\n校正因子本身是计数之比；标准误用它的**平方根**，而方差直接用它。例如 $N = 101$，$n = 37$：方差乘 $\\frac{64}{100}$，标准误乘 $0.8$。",
        ),
        generate: (rng: Rng): Problem => {
          const [N, n, r] = rng.pick([
            [101, 37, Q.of(4, 5)],
            [101, 20, Q.of(9, 10)],
            [101, 65, Q.of(3, 5)],
            [401, 176, Q.of(3, 4)],
            [626, 226, Q.of(4, 5)],
            [626, 401, Q.of(3, 5)],
          ] as [number, number, Q][]);
          const se = Q.of(rng.int(5, 80), 10);
          const ans = se.mul(r);
          return numberProblem({
            prompt: t(
              `A sample of $n = ${n}$ is drawn without replacement from a population of $N = ${N}$. Without the correction, $\\frac{\\sigma}{\\sqrt{n}} = ${dec(se)}$. Find the corrected standard error of $\\bar{X}$.`,
              `从 $N = ${N}$ 的总体中不放回地抽取 $n = ${n}$ 个。未校正时 $\\frac{\\sigma}{\\sqrt{n}} = ${dec(se)}$。求 $\\bar{X}$ 的修正标准误。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [se.mul(r).mul(r), se, se.mul(Q.one.sub(r))],
            solution: t(
              `$\\sqrt{\\frac{${N} - ${n}}{${N} - 1}} = \\sqrt{\\frac{${N - n}}{${N - 1}}} = ${dec(r)}$, so the corrected standard error is $${dec(se)} \\cdot ${dec(r)} = ${dec(ans)}$.`,
              `$\\sqrt{\\frac{${N} - ${n}}{${N} - 1}} = \\sqrt{\\frac{${N - n}}{${N - 1}}} = ${dec(r)}$，所以修正标准误为 $${dec(se)} \\cdot ${dec(r)} = ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.23.4 Point Estimates of Population Proportions
  {
    id: "point-estimates-of-population-proportions",
    title: t("Point Estimates of Population Proportions", "总体比例的点估计"),
    summary: t(
      "The sample proportion p̂ = X / n is the maximum likelihood and unbiased point estimator of the population success proportion p.",
      "样本比例 p̂ = X / n 是总体成功概率 p 的极大似然且无偏的点估计量。",
    ),
    prerequisites: ["sampling-proportions-from-finite-populations"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-sample-proportion-point-estimate",
        title: t("Calculating the point estimate of a proportion", "计算总体比例的点估计值"),
        explanation: t(
          "The natural estimate of a population proportion is the fraction of the sample that has the property: $\\hat{p} = x/n$, where $x$ counts the sample members with it and $n$ is the sample size.",
          "总体比例的自然估计是样本中具有该性质的个体所占的比例：$\\hat{p} = x/n$，其中 $x$ 是样本中具有该性质的个数，$n$ 是样本容量。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(50, 400);
          const x = rng.int(10, n - 10);

          return numberProblem({
            prompt: t(
              `In a sample of $n = ${n}$ tested components, exactly $x = ${x}$ met all quality specifications. Find the point estimate of the population proportion.`,
              `在抽检的 $n = ${n}$ 个零部件中，恰好有 $x = ${x}$ 个符合全部质量规范。求总体合格比例的点估计值。`,
            ),
            answer: Q.of(x, n),
            wrong: [Q.of(n - x, n), Q.of(x, n - x), Q.of(n, x)],
            solution: t(
              `The point estimate is the ratio of successes to trials: $\\hat{p} = \\frac{x}{n} = \\frac{${x}}{${n}}${lowestTerms(x, n)}$.`,
              `点估计值为成功频数与试验次数之比：$\\hat{p} = \\frac{x}{n} = \\frac{${x}}{${n}}${lowestTerms(x, n)}$。`,
            ),
          });
        },
      },
      {
        id: "the-estimated-standard-error-of-a-proportion",
        title: t("The estimated standard error of a proportion", "比例的估计标准误"),
        explanation: t(
          "A point estimate should come with its precision. The standard error of $\\hat{p}$ is estimated by plugging in $\\hat{p}$ for the unknown $p$:\n\n$$\\widehat{\\operatorname{SE}}(\\hat{p}) = \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}.$$\n\nIf $90$ of $900$ parts are defective, $\\hat{p} = 0.1$ and $\\widehat{\\operatorname{SE}} = \\sqrt{\\frac{0.09}{900}} = 0.01$: the estimate is typically off by about one percentage point.",
          "点估计应附带它的精度。用 $\\hat{p}$ 代替未知的 $p$ 来估计 $\\hat{p}$ 的标准误：\n\n$$\\widehat{\\operatorname{SE}}(\\hat{p}) = \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}.$$\n\n若 $900$ 个零件中有 $90$ 个次品，$\\hat{p} = 0.1$，$\\widehat{\\operatorname{SE}} = \\sqrt{\\frac{0.09}{900}} = 0.01$：估计值通常偏离约一个百分点。",
        ),
        generate: (rng: Rng): Problem => {
          const [p, sd] = rng.pick([
            [Q.of(1, 2), Q.of(1, 2)],
            [Q.of(1, 5), Q.of(2, 5)],
            [Q.of(4, 5), Q.of(2, 5)],
            [Q.of(1, 10), Q.of(3, 10)],
            [Q.of(9, 10), Q.of(3, 10)],
          ] as const);
          const root = rng.pick([10, 20, 25, 40, 50]);
          const n = root * root;
          const x = p.mul(Q.of(n));
          const ans = sd.div(Q.of(root));
          return numberProblem({
            prompt: t(
              `In a sample of $${n}$ items, $${x.toString()}$ have a certain property. Find the estimated standard error of the sample proportion.`,
              `在 $${n}$ 件物品的样本中，有 $${x.toString()}$ 件具有某种性质。求样本比例的估计标准误。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [sd.pow(2).div(Q.of(n)), sd.div(Q.of(n)), p.div(Q.of(root))].filter((w) => !w.eq(ans) && isTerminating(w)),
            solution: t(
              `$\\hat{p} = \\frac{${x.toString()}}{${n}} = ${dec(p)}$, so $\\widehat{\\operatorname{SE}} = \\sqrt{\\frac{${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${n}}} = \\frac{${dec(sd)}}{${root}} = ${dec(ans)}$.`,
              `$\\hat{p} = \\frac{${x.toString()}}{${n}} = ${dec(p)}$，所以 $\\widehat{\\operatorname{SE}} = \\sqrt{\\frac{${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${n}}} = \\frac{${dec(sd)}}{${root}} = ${dec(ans)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.23.5 Finite Population Corrections for Sample Proportions
  {
    id: "finite-population-corrections-for-sample-proportions",
    title: t("Finite Population Corrections for Sample Proportions", "样本比例的有限总体校正"),
    summary: t(
      "When sampling without replacement from a finite population of size N, the variance of the sample proportion is Var(p̂) = (p(1-p)/n) ((N-n)/(N-1)).",
      "当不放回地从容量为 N 的有限总体中抽样时，样本比例的方差由有限总体校正因子修正为 Var(p̂) = (p(1-p)/n) ((N-n)/(N-1))。",
    ),
    prerequisites: ["point-estimates-of-population-proportions", "finite-population-corrections-for-sample-means"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "fpc-guideline-five-percent-rule",
        title: t("Understanding when FPC is necessary (the 5% rule)", "理解何时需要使用有限总体校正（5% 法则）"),
        explanation: t(
          "The finite population correction is typically applied when the sample size exceeds 5% of the population: n / N > 0.05.",
          "当样本容量超过总体容量的 5%（即抽样比 n / N > 0.05）时，通常需要应用有限总体校正。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(200, 1000);
          const isLarge = rng.int(0, 1) === 0;
          const n = isLarge ? Math.floor(N * 0.1) : Math.floor(N * 0.02);

          const opts = isLarge
            ? [
                t(
                  `Yes, because the sampling fraction $\\frac{n}{N} = \\frac{${n}}{${N}} \\approx ${(n / N).toFixed(2)}$ exceeds $5\\%$.`,
                  `是，因为抽样比 $\\frac{n}{N} = \\frac{${n}}{${N}} \\approx ${(n / N).toFixed(2)}$ 超过了 $5\\%$。`,
                ),
                t(`No, FPC is only used when $n > 300$.`, `否，FPC 仅在 $n > 300$ 时使用。`),
                t(`No, FPC is never needed for sample proportions.`, `否，样本比例从不需要使用 FPC。`),
                t(`Yes, because the population is finite, regardless of the sampling fraction.`, `是，因为总体有限，与抽样比大小无关。`),
              ]
            : [
                t(
                  `No, because the sampling fraction $\\frac{n}{N} = \\frac{${n}}{${N}} \\approx ${(n / N).toFixed(3)}$ is at most $5\\%$, making FPC negligible.`,
                  `否，因为抽样比 $\\frac{n}{N} = \\frac{${n}}{${N}} \\approx ${(n / N).toFixed(3)}$ 不超过 $5\\%$，FPC 的修正效果可以忽略。`,
                ),
                t(`Yes, FPC must always be applied whenever $N < 10000$.`, `是，只要 $N < 10000$ 就必须应用 FPC。`),
                t(`Yes, because sample proportions always require finite corrections.`, `是，因为样本比例总是需要有限校正。`),
                t(`Cannot be determined without knowing the sample variance.`, `在未知样本方差的情况下无法确定。`),
              ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `A researcher draws a simple random sample of size $n = ${n}$ without replacement from a population of size $N = ${N}$. According to standard statistical convention, is it necessary to apply the finite population correction (FPC)?`,
              `研究人员从容量为 $N = ${N}$ 的总体中不放回抽取容量为 $n = ${n}$ 的简单随机样本。根据常规统计学准则，是否需要应用有限总体校正因子（FPC）？`,
            ),
            options,
            correct,
            solution: t(
              isLarge
                ? `The sampling fraction is $\\frac{n}{N} = \\frac{${n}}{${N}} > 0.05$. When the sample exceeds 5% of the population, the FPC should be used.`
                : `The sampling fraction is $\\frac{n}{N} = \\frac{${n}}{${N}} \\le 0.05$. When the sample is at most 5% of the population, the FPC is close to 1 and can be safely omitted.`,
              isLarge
                ? `抽样比为 $\\frac{n}{N} = \\frac{${n}}{${N}} > 0.05$。当样本容量超过总体的 5% 时，应当使用有限总体校正。`
                : `抽样比为 $\\frac{n}{N} = \\frac{${n}}{${N}} \\le 0.05$。当样本容量不超过总体的 5% 时，FPC 接近于 1，可予以安全忽略。`,
            ),
          });
        },
      },
      {
        id: "the-corrected-variance-of-a-sample-proportion",
        title: t("The corrected variance of a sample proportion", "样本比例的修正方差"),
        explanation: t(
          "When the five percent guideline says the correction is needed, multiply the binomial variance by $\\frac{N - n}{N - 1}$:\n\n$$\\operatorname{Var}(\\hat{p}) = \\frac{\\hat{p}(1 - \\hat{p})}{n} \\cdot \\frac{N - n}{N - 1}.$$\n\nWith $\\hat{p}$ in place of $p$ this is the estimated variance used in practice. Surveying $40$ of $121$ residents with $\\hat{p} = 0.25$: $\\frac{0.1875}{40} \\cdot \\frac{81}{120} \\approx 0.00316$.",
          "当百分之五准则表明需要校正时，把二项方差乘以 $\\frac{N - n}{N - 1}$：\n\n$$\\operatorname{Var}(\\hat{p}) = \\frac{\\hat{p}(1 - \\hat{p})}{n} \\cdot \\frac{N - n}{N - 1}.$$\n\n用 $\\hat{p}$ 代替 $p$，就是实际使用的估计方差。例如调查 $121$ 名居民中的 $40$ 人，$\\hat{p} = 0.25$：$\\frac{0.1875}{40} \\cdot \\frac{81}{120} \\approx 0.00316$。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.pick([41, 61, 81, 121, 161, 201]);
          const n = rng.pick([10, 20, 40].filter((v) => v < N / 2));
          const x = rng.int(2, n - 2);
          const p = Q.of(x, n);
          const base = p.mul(Q.one.sub(p)).div(Q.of(n));
          const ans = base.mul(Q.of(N - n, N - 1));
          return numberProblem({
            prompt: t(
              `In a sample of $n = ${n}$ drawn without replacement from $N = ${N}$ households, $${x}$ own a pet. Find the estimated variance of $\\hat{p}$ with the finite population correction.`,
              `从 $N = ${N}$ 户中不放回地抽取 $n = ${n}$ 户，其中 $${x}$ 户养宠物。求带有限总体校正的 $\\hat{p}$ 的估计方差。`,
            ),
            answer: ans,
            wrong: [base, base.mul(Q.of(N - 1, N - n)), p.mul(Q.one.sub(p)).mul(Q.of(N - n, N - 1))].filter((w) => !w.eq(ans)),
            solution: t(
              `$\\hat{p} = \\frac{${x}}{${n}}$, $\\frac{\\hat{p}(1 - \\hat{p})}{n} = ${base.toLatex()}$, and $\\frac{N - n}{N - 1} = \\frac{${N - n}}{${N - 1}}$, so the variance is $${ans.toLatex()}$.`,
              `$\\hat{p} = \\frac{${x}}{${n}}$，$\\frac{\\hat{p}(1 - \\hat{p})}{n} = ${base.toLatex()}$，$\\frac{N - n}{N - 1} = \\frac{${N - n}}{${N - 1}}$，所以方差为 $${ans.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.24.1 Product Notation
  {
    id: "product-notation",
    title: t("Product Notation", "连乘符号"),
    summary: t(
      "Capital pi notation $\\prod_{i=1}^n a_i$ denotes the product $a_1 \\cdot a_2 \\cdots a_n$; it is the basic tool for writing the joint likelihood of independent observations.",
      "连乘符号 $\\prod_{i=1}^n a_i$ 表示乘积 $a_1 \\cdot a_2 \\cdots a_n$，是写出独立观测值联合似然函数的基本工具。",
    ),
    prerequisites: ["the-sample-mean"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-product-constant-powers",
        title: t("Evaluating products of powers and constants", "计算常数与幂次的连乘式"),
        explanation: t(
          "In a product over many terms, a constant factor appears once in each term, so it comes out raised to the number of terms. A constant factor comes out of a product as a power: $\\prod_{i=1}^n (c x_i) = c^n \\prod_{i=1}^n x_i$.",
          "在多项的乘积中，常数因子在每一项中都出现一次，所以提出来时要取项数次幂。常数因子以幂的形式提出连乘：$\\prod_{i=1}^n (c x_i) = c^n \\prod_{i=1}^n x_i$。",
        ),
        generate: (rng: Rng): Problem => {
          const c = rng.int(2, 15);
          const n = rng.int(2, 6);
          let ans = 1;
          for (let i = 0; i < n; i++) ans *= c;

          return numberProblem({
            prompt: t(`Evaluate the product expression $\\prod_{i=1}^{${n}} ${c}$.`, `计算连乘表达式 $\\prod_{i=1}^{${n}} ${c}$ 的值。`),
            answer: ans,
            wrong: [c * n, c ** (n - 1), n ** c],
            solution: t(
              `Multiplying the constant $c = ${c}$ across $n = ${n}$ factors yields $c^n = ${c}^{${n}} = ${ans}$.`,
              `将常数 $c = ${c}$ 进行 $n = ${n}$ 次连乘得到 $c^n = ${c}^{${n}} = ${ans}$。`,
            ),
          });
        },
      },
      {
        id: "products-that-depend-on-the-index",
        title: t("Products that depend on the index", "依赖下标的乘积"),
        explanation: t(
          "When the factor depends on $i$, write out the first few factors to see the pattern. Two patterns are common:\n\n- powers add in the exponent: $\\prod_{i=1}^{n} a^{i} = a^{1 + 2 + \\cdots + n} = a^{n(n+1)/2}$;\n- ratios telescope: $\\prod_{i=1}^{n} \\frac{i + 1}{i} = \\frac{2}{1} \\cdot \\frac{3}{2} \\cdots \\frac{n + 1}{n} = n + 1$.\n\nThe first pattern is why likelihoods turn into sums in the exponent; taking logarithms does the same thing in general.",
          "当因子依赖于 $i$ 时，写出前几个因子来看规律。常见的两种：\n\n- 指数相加：$\\prod_{i=1}^{n} a^{i} = a^{1 + 2 + \\cdots + n} = a^{n(n+1)/2}$；\n- 比值相消：$\\prod_{i=1}^{n} \\frac{i + 1}{i} = \\frac{2}{1} \\cdot \\frac{3}{2} \\cdots \\frac{n + 1}{n} = n + 1$。\n\n第一种正是似然函数变成指数中求和的原因；一般地，取对数也起同样的作用。",
        ),
        generate: (rng: Rng): Problem => {
          const kind = rng.int(0, 2);
          if (kind === 0) {
            const a = rng.pick([2, 3]);
            const n = rng.int(2, a === 2 ? 4 : 3);
            const e = (n * (n + 1)) / 2;
            return numberProblem({
              prompt: t(`Evaluate $\\prod_{i=1}^{${n}} ${a}^{i}$.`, `计算 $\\prod_{i=1}^{${n}} ${a}^{i}$。`),
              answer: a ** e,
              wrong: [a ** n, a * n, a ** (n * n)].filter((w) => w !== a ** e),
              solution: t(
                `The exponents add: $1 + \\cdots + ${n} = ${e}$, so the product is $${a}^{${e}} = ${a ** e}$.`,
                `指数相加：$1 + \\cdots + ${n} = ${e}$，所以乘积为 $${a}^{${e}} = ${a ** e}$。`,
              ),
            });
          }
          const a = rng.int(1, 5);
          const n = rng.int(3, 30);
          const ans = kind === 1 ? Q.of(n + a, a) : Q.of(a, n + a);
          const factor = kind === 1 ? `\\frac{i + ${a}}{i + ${a - 1}}` : `\\frac{i + ${a - 1}}{i + ${a}}`;
          return numberProblem({
            prompt: t(
              `Evaluate $\\prod_{i=1}^{${n}} ${factor.replace("i + 0", "i")}$.`,
              `计算 $\\prod_{i=1}^{${n}} ${factor.replace("i + 0", "i")}$。`,
            ),
            answer: ans,
            wrong: [Q.one.div(ans), ans.add(Q.one), Q.of(n)].filter((w) => !w.eq(ans)),
            solution: t(
              `The product telescopes: each numerator cancels the next denominator, leaving $${ans.toLatex()}$.`,
              `乘积逐项相消：每个分子与下一个分母约去，剩下 $${ans.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.24.3 Likelihood Functions for Discrete Probability Distributions
  {
    id: "likelihood-functions-for-discrete-probability-distributions",
    title: t("Likelihood Functions for Discrete Probability Distributions", "离散型概率分布的似然函数"),
    summary: t(
      "For independent observations $x_1, \\dots, x_n$ from a discrete PMF $p(x; \\theta)$, the likelihood is the joint probability viewed as a function of the parameter: $L(\\theta) = \\prod_{i=1}^n p(x_i; \\theta)$.",
      "对于来自离散分布律 $p(x; \\theta)$ 的独立观测值 $x_1, \\dots, x_n$，似然函数是把联合概率看作参数的函数：$L(\\theta) = \\prod_{i=1}^n p(x_i; \\theta)$。",
    ),
    prerequisites: ["product-notation"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "bernoulli-likelihood-formulation",
        title: t("Formulating the Bernoulli likelihood function", "构建伯努利似然函数"),
        explanation: t(
          "The likelihood is the probability of the observed data viewed as a function of the parameter, and independent trials multiply. For $n$ independent Bernoulli trials with $k$ successes, $L(p) = p^k (1 - p)^{n - k}$.",
          "似然函数是把观测数据的概率看作参数的函数，独立试验的概率要相乘。对含有 $k$ 次成功的 $n$ 次独立伯努利试验，似然函数为 $L(p) = p^k (1 - p)^{n - k}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = 2 * rng.int(3, 15) + 1; // odd n guarantees k !== n - k
          const k = rng.int(1, n - 1);
          const diff = n - k;

          const opts = [
            t(`$p^{${k}} (1 - p)^{${diff}}$`, `$p^{${k}} (1 - p)^{${diff}}$`),
            t(`$p^{${n}} (1 - p)^{${k}}$`, `$p^{${n}} (1 - p)^{${k}}$`),
            t(`$p^{${diff}} (1 - p)^{${k}}$`, `$p^{${diff}} (1 - p)^{${k}}$`),
            t(`$k p + (${diff})(1 - p)$`, `$k p + (${diff})(1 - p)$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `In a sample of $n = ${n}$ independent Bernoulli trials with parameter $p$, exactly $k = ${k}$ successes and $${diff}$ failures are observed. What is the likelihood function $L(p)$ (omitting constant combinatorial factor)?`,
                `在参数为 $p$ 的 $n = ${n}$ 次独立伯努利试验中，观测到恰好 $k = ${k}$ 次成功与 $${diff}$ 次失败。其似然函数 $L(p)$ 是什么（忽略常数组合数因子）？`,
              ),
              options,
              correct,
              solution: t(
                `The joint probability of $k$ successes and $n - k = ${diff}$ failures is proportional to $L(p) = p^k (1 - p)^{n - k} = p^{${k}} (1 - p)^{${diff}}$.`,
                `$k$ 次成功与 $n - k = ${diff}$ 次失败的联合概率与参数的函数关系为 $L(p) = p^k (1 - p)^{n - k} = p^{${k}} (1 - p)^{${diff}}$。`,
              ),
            }),
            [
              [
                opts[1]!.en,
                `The exponent of $p$ is the number of successes, $${k}$, not the number of trials.`,
                `$p$ 的指数是成功次数 $${k}$，不是试验次数。`,
              ],
              [
                opts[2]!.en,
                "The exponents are exchanged: $p$ goes with the successes and $1 - p$ with the failures.",
                "指数弄反了：$p$ 对应成功，$1 - p$ 对应失败。",
              ],
              [
                opts[3]!.en,
                "This adds the outcomes, but independent trials multiply their probabilities.",
                "这里把结果相加了，而独立试验的概率要相乘。",
              ],
            ],
          );
        },
      },
      {
        id: "evaluating-a-likelihood-and-comparing-values",
        title: t("Evaluating a likelihood and comparing values", "计算并比较似然值"),
        explanation: t(
          "A likelihood can be evaluated at any candidate parameter value; the larger value is the one that makes the observed data more probable. For $k$ successes in $n$ Bernoulli trials, $L(p) = p^{k}(1 - p)^{n-k}$.\n\nWith $3$ successes in $4$ trials, $L\\left(\\tfrac{1}{2}\\right) = \\tfrac{1}{16}$ and $L\\left(\\tfrac{3}{4}\\right) = \\tfrac{27}{256} \\approx 0.105$, so $p = \\tfrac{3}{4}$ is better supported. The **likelihood ratio** $\\frac{L(p_1)}{L(p_2)}$ measures by how much.",
          "似然函数可以在任一候选参数值处计算；值越大，说明该参数使观测数据越可能出现。对于 $n$ 次伯努利试验中 $k$ 次成功，$L(p) = p^{k}(1 - p)^{n-k}$。\n\n若 $4$ 次试验中成功 $3$ 次，$L\\left(\\tfrac{1}{2}\\right) = \\tfrac{1}{16}$，$L\\left(\\tfrac{3}{4}\\right) = \\tfrac{27}{256} \\approx 0.105$，所以 $p = \\tfrac{3}{4}$ 更受支持。**似然比** $\\frac{L(p_1)}{L(p_2)}$ 衡量支持的程度。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(3, 7);
          const k = rng.int(1, n - 1);
          const p1 = rng.pick([Q.of(1, 3), Q.of(2, 3), Q.of(1, 4), Q.of(3, 4)]);
          const p2 = Q.of(1, 2);
          const L = (p: Q): Q => p.pow(k).mul(Q.one.sub(p).pow(n - k));
          const ans = L(p1).div(L(p2));
          return numberProblem({
            prompt: t(
              `In $n = ${n}$ independent Bernoulli trials there are $k = ${k}$ successes, so $L(p) = p^{${k}}${n - k === 1 ? "(1 - p)" : `(1 - p)^{${n - k}}`}$. Find the likelihood ratio $\\frac{L(${p1.toLatex()})}{L(\\frac{1}{2})}$.`,
              `$n = ${n}$ 次独立伯努利试验中成功 $k = ${k}$ 次，所以 $L(p) = p^{${k}}${n - k === 1 ? "(1 - p)" : `(1 - p)^{${n - k}}`}$。求似然比 $\\frac{L(${p1.toLatex()})}{L(\\frac{1}{2})}$。`,
            ),
            answer: ans,
            wrong: [Q.one.div(ans), L(p1), L(p2)].filter((w) => !w.eq(ans)),
            solution: t(
              `$L(${p1.toLatex()}) = ${L(p1).toLatex()}$ and $L(\\frac{1}{2}) = \\frac{1}{2^{${n}}} = ${L(p2).toLatex()}$, so the ratio is $${ans.toLatex()}$.`,
              `$L(${p1.toLatex()}) = ${L(p1).toLatex()}$，$L(\\frac{1}{2}) = \\frac{1}{2^{${n}}} = ${L(p2).toLatex()}$，所以似然比为 $${ans.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.24.4 Log-Likelihood Functions for Discrete Probability Distributions
  {
    id: "log-likelihood-functions-for-discrete-probability-distributions",
    title: t("Log-Likelihood Functions for Discrete Probability Distributions", "离散型概率分布的对数似然函数"),
    summary: t(
      "The log-likelihood $\\ln L(\\theta) = \\sum_{i=1}^n \\ln p(x_i; \\theta)$ turns products into sums, which simplifies differentiation while keeping the same maximizing parameter value.",
      "对数似然函数 $\\ln L(\\theta) = \\sum_{i=1}^n \\ln p(x_i; \\theta)$ 把连乘转化为求和，在保持最大值点不变的同时简化求导。",
    ),
    prerequisites: ["likelihood-functions-for-discrete-probability-distributions", "logarithmic-differentiation"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "bernoulli-log-likelihood-expression",
        title: t("Expressing the log-likelihood of a Bernoulli sample", "表示伯努利样本的对数似然函数"),
        explanation: t(
          "Taking logarithms turns the product into a sum, which is easier to differentiate and has its maximum at the same parameter value. $\\ln L(p) = k \\ln p + (n - k) \\ln(1 - p)$.",
          "取对数把乘积变成和，更容易求导，而且最大值出现在相同的参数值处。$\\ln L(p) = k \\ln p + (n - k) \\ln(1 - p)$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = 2 * rng.int(3, 20) + 1; // odd n guarantees k !== n - k
          const k = rng.int(2, n - 2);
          const diff = n - k;

          const opts = [
            t(`$${k} \\ln(p) + ${diff} \\ln(1 - p)$`, `$${k} \\ln(p) + ${diff} \\ln(1 - p)$`),
            t(`$${diff} \\ln(p) + ${k} \\ln(1 - p)$`, `$${diff} \\ln(p) + ${k} \\ln(1 - p)$`),
            t(`$p^{${k}} + (1 - p)^{${diff}}$`, `$p^{${k}} + (1 - p)^{${diff}}$`),
            t(`$${n} \\ln(p (1 - p))$`, `$${n} \\ln(p (1 - p))$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `For $n = ${n}$ independent Bernoulli trials resulting in $k = ${k}$ successes and $${diff}$ failures, what is the log-likelihood function $\\ln L(p)$?`,
                `对于取得 $k = ${k}$ 次成功与 $${diff}$ 次失败的 $n = ${n}$ 次独立伯努利试验，其对数似然函数 $\\ln L(p)$ 是什么？`,
              ),
              options,
              correct,
              solution: t(
                `Taking the natural log of $L(p) = p^k (1 - p)^{n - k}$ yields $\\ln L(p) = k \\ln(p) + (n - k) \\ln(1 - p) = ${k} \\ln(p) + ${diff} \\ln(1 - p)$.`,
                `对似然函数 $L(p) = p^k (1 - p)^{n - k}$ 取自然对数得到 $\\ln L(p) = k \\ln(p) + (n - k) \\ln(1 - p) = ${k} \\ln(p) + ${diff} \\ln(1 - p)$。`,
              ),
            }),
            [
              [
                opts[1]!.en,
                "The coefficients are exchanged: the number of successes goes with $\\ln(p)$.",
                "系数弄反了：成功次数对应 $\\ln(p)$。",
              ],
              [opts[2]!.en, "No logarithm has been taken, and the product has become a sum.", "这里没有取对数，乘积还变成了和。"],
              [opts[3]!.en, "This counts every trial as both a success and a failure.", "这把每次试验既算作成功又算作失败。"],
            ],
          );
        },
      },
      {
        id: "the-poisson-log-likelihood",
        title: t("The Poisson log-likelihood", "泊松分布的对数似然"),
        explanation: t(
          "For a Poisson sample, $p(x; \\lambda) = \\frac{e^{-\\lambda}\\lambda^{x}}{x!}$, and the log turns each factor into a sum:\n\n$$\\ln L(\\lambda) = -n\\lambda + \\left(\\sum x_i\\right)\\ln\\lambda - \\sum \\ln(x_i!).$$\n\nThe last term does not involve $\\lambda$, so it does not affect where the maximum is. The data enter only through $n$ and $\\sum x_i$, which is why the sum is a sufficient statistic.",
          "对于泊松样本，$p(x; \\lambda) = \\frac{e^{-\\lambda}\\lambda^{x}}{x!}$，取对数把每个因子变成和：\n\n$$\\ln L(\\lambda) = -n\\lambda + \\left(\\sum x_i\\right)\\ln\\lambda - \\sum \\ln(x_i!).$$\n\n最后一项不含 $\\lambda$，因此不影响最大值的位置。数据只通过 $n$ 和 $\\sum x_i$ 进入，这正是和为充分统计量的原因。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 30);
          const s = rng.int(n + 1, 6 * n);
          const right = rng.int(0, 3);
          const opts = [
            `$-${n}\\lambda + ${s}\\ln\\lambda - C$`,
            `$-\\lambda + ${s}\\ln\\lambda - C$`,
            `$-${n}\\lambda + ${n}\\ln\\lambda - C$`,
            `$-${s}\\lambda + ${n}\\ln\\lambda - C$`,
          ];
          const order = [0, 1, 2, 3].map((i) => (i + right) % 4);
          const options = order.map((i) => t(opts[i] ?? "", opts[i] ?? ""));
          return choiceProblem({
            prompt: t(
              `A sample of $n = ${n}$ counts from $\\text{Poisson}(\\lambda)$ has $\\sum x_i = ${s}$. Which is the log-likelihood $\\ln L(\\lambda)$, where $C = \\sum \\ln(x_i!)$ does not depend on $\\lambda$?`,
              `来自 $\\text{Poisson}(\\lambda)$ 的 $n = ${n}$ 个计数满足 $\\sum x_i = ${s}$。对数似然 $\\ln L(\\lambda)$ 是哪一个？其中 $C = \\sum \\ln(x_i!)$ 与 $\\lambda$ 无关。`,
            ),
            options,
            correct: order.indexOf(0),
            solution: t(
              `Each observation contributes $-\\lambda + x_i\\ln\\lambda - \\ln(x_i!)$. Summing over $${n}$ observations gives $-${n}\\lambda + ${s}\\ln\\lambda - C$.`,
              `每个观测贡献 $-\\lambda + x_i\\ln\\lambda - \\ln(x_i!)$。对 $${n}$ 个观测求和得 $-${n}\\lambda + ${s}\\ln\\lambda - C$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.24.5 Likelihood Functions for Continuous Probability Distributions
  {
    id: "likelihood-functions-for-continuous-probability-distributions",
    title: t("Likelihood Functions for Continuous Probability Distributions", "连续型概率分布的似然函数"),
    summary: t(
      "For continuous random variables with PDF $f(x; \\theta)$, the likelihood of a sample is the product of density values: $L(\\theta) = \\prod_{i=1}^n f(x_i; \\theta)$.",
      "对于概率密度为 $f(x; \\theta)$ 的连续型随机变量，样本的似然函数是密度值的连乘积：$L(\\theta) = \\prod_{i=1}^n f(x_i; \\theta)$。",
    ),
    prerequisites: ["product-notation", "probability-density-functions-of-continuous-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "exponential-likelihood-formulation",
        title: t("Formulating the likelihood function for an exponential sample", "构建指数分布样本的似然函数"),
        explanation: t(
          "Multiplying the densities of independent observations collects the rate into a power and the exponents into a single sum. For $X_i \\sim \\text{Exp}(\\lambda)$, $L(\\lambda) = \\prod_i \\lambda e^{-\\lambda x_i} = \\lambda^n e^{-\\lambda \\sum_i x_i}$.",
          "把独立观测的密度相乘，速率汇集成一个幂，指数汇集成一个和。对于 $X_i \\sim \\text{Exp}(\\lambda)$，似然函数为 $L(\\lambda) = \\prod_i \\lambda e^{-\\lambda x_i} = \\lambda^n e^{-\\lambda \\sum_i x_i}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(3, 50);

          const opts = [
            t(`$\\lambda^{${n}} e^{-\\lambda \\sum_{i=1}^{${n}} x_i}$`, `$\\lambda^{${n}} e^{-\\lambda \\sum_{i=1}^{${n}} x_i}$`),
            t(`$\\lambda e^{-${n} \\lambda \\sum_{i=1}^{${n}} x_i}$`, `$\\lambda e^{-${n} \\lambda \\sum_{i=1}^{${n}} x_i}$`),
            t(`$\\lambda^{${n}} e^{-\\sum_{i=1}^{${n}} x_i}$`, `$\\lambda^{${n}} e^{-\\sum_{i=1}^{${n}} x_i}$`),
            t(`$(${n} \\lambda) e^{-\\lambda \\bar{x}}$`, `$(${n} \\lambda) e^{-\\lambda \\bar{x}}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $x_1, x_2, \\dots, x_{${n}}$ be an independent random sample from an exponential distribution $f(x; \\lambda) = \\lambda e^{-\\lambda x}$ ($x \\ge 0$). What is the sample likelihood function $L(\\lambda)$?`,
                `设 $x_1, x_2, \\dots, x_{${n}}$ 为来自指数分布 $f(x; \\lambda) = \\lambda e^{-\\lambda x}$（$x \\ge 0$）的独立随机样本。样本的似然函数 $L(\\lambda)$ 是什么？`,
              ),
              options,
              correct,
              solution: t(
                `$L(\\lambda) = \\prod_{i=1}^{${n}} (\\lambda e^{-\\lambda x_i}) = \\lambda^{${n}} e^{-\\lambda \\sum_{i=1}^{${n}} x_i}$.`,
                `$L(\\lambda) = \\prod_{i=1}^{${n}} (\\lambda e^{-\\lambda x_i}) = \\lambda^{${n}} e^{-\\lambda \\sum_{i=1}^{${n}} x_i}$。`,
              ),
            }),
            [
              [
                opts[1]!.en,
                `The product of $${n}$ factors gives $\\lambda^{${n}}$, and the sum in the exponent already counts every observation.`,
                `$${n}$ 个因子相乘得到 $\\lambda^{${n}}$，而指数中的和已经计入了每个观测值。`,
              ],
              [
                opts[2]!.en,
                "The $\\lambda$ in the exponent is lost: each factor has $e^{-\\lambda x_i}$.",
                "指数中的 $\\lambda$ 丢了：每个因子都含 $e^{-\\lambda x_i}$。",
              ],
              [
                opts[3]!.en,
                `The likelihood is a product of densities, so $\\lambda$ appears to the power $${n}$ rather than multiplied by $${n}$.`,
                `似然是密度的乘积，所以是 $\\lambda$ 的 $${n}$ 次方，而不是乘以 $${n}$。`,
              ],
            ],
          );
        },
      },
      {
        id: "the-likelihood-of-a-uniform-sample",
        title: t("The likelihood of a uniform sample", "均匀分布样本的似然"),
        explanation: t(
          "For $X \\sim U(0, \\theta)$ the density is $\\frac{1}{\\theta}$ on $[0, \\theta]$ and $0$ outside, so\n\n$$L(\\theta) = \\begin{cases} \\theta^{-n}, & \\theta \\ge \\max x_i, \\\\ 0, & \\theta < \\max x_i. \\end{cases}$$\n\nA value of $\\theta$ smaller than some observation is impossible, since that observation could not have occurred; its likelihood is $0$. Above the maximum, $L$ decreases as $\\theta$ grows.",
          "对于 $X \\sim U(0, \\theta)$，密度在 $[0, \\theta]$ 上为 $\\frac{1}{\\theta}$，在外为 $0$，所以\n\n$$L(\\theta) = \\begin{cases} \\theta^{-n}, & \\theta \\ge \\max x_i, \\\\ 0, & \\theta < \\max x_i. \\end{cases}$$\n\n若 $\\theta$ 小于某个观测值，则不可能，因为该观测不可能出现；其似然为 $0$。在最大值之上，$L$ 随 $\\theta$ 增大而减小。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(2, 4);
          const xs = Array.from({ length: n }, () => Q.of(rng.int(1, 49), 10));
          const max = xs.reduce((m, x) => (x.cmp(m) > 0 ? x : m), Q.zero);
          const theta = rng.bool(0.3) ? max.sub(Q.of(rng.int(1, 5), 10)) : Q.of(Math.ceil(max.toNumber()) + rng.int(0, 2));
          const ok = theta.cmp(max) >= 0 && theta.sign() > 0;
          const val = theta.sign() > 0 ? Q.one.div(theta.pow(n)) : Q.zero;
          const ans = ok ? val : Q.zero;
          const wrong = [val, Q.one.div(theta.sign() > 0 ? theta : Q.one), Q.one].filter((w) => !w.eq(ans));
          return numberProblem({
            prompt: t(
              `A sample from $U(0, \\theta)$ is $${xs.map((x) => dec(x)).join(", ")}$. Find the likelihood $L(${dec(theta)})$.`,
              `来自 $U(0, \\theta)$ 的样本为 $${xs.map((x) => dec(x)).join(", ")}$。求似然 $L(${dec(theta)})$。`,
            ),
            answer: ans,
            wrong,
            solution: ok
              ? t(
                  `Every observation is at most $${dec(theta)}$, so $L(${dec(theta)}) = ${dec(theta)}^{-${n}} = ${ans.toLatex()}$.`,
                  `每个观测都不超过 $${dec(theta)}$，所以 $L(${dec(theta)}) = ${dec(theta)}^{-${n}} = ${ans.toLatex()}$。`,
                )
              : t(
                  `The observation $${dec(max)}$ exceeds $${dec(theta)}$, which is impossible under $U(0, ${dec(theta)})$, so $L(${dec(theta)}) = 0$.`,
                  `观测值 $${dec(max)}$ 大于 $${dec(theta)}$，在 $U(0, ${dec(theta)})$ 下不可能出现，所以 $L(${dec(theta)}) = 0$。`,
                ),
          });
        },
      },
    ],
  },

  // 6.24.6 Log-Likelihood Functions for Continuous Probability Distributions
  {
    id: "log-likelihood-functions-for-continuous-probability-distributions",
    title: t("Log-Likelihood Functions for Continuous Probability Distributions", "连续型概率分布的对数似然函数"),
    summary: t(
      "For continuous distributions, $\\ln L(\\theta) = \\sum_{i=1}^n \\ln f(x_i; \\theta)$ turns exponential densities into sums of linear and logarithmic terms.",
      "对于连续分布，对数似然函数 $\\ln L(\\theta) = \\sum_{i=1}^n \\ln f(x_i; \\theta)$ 把指数形式的密度化为线性项与对数项之和。",
    ),
    prerequisites: ["likelihood-functions-for-continuous-probability-distributions", "logarithmic-differentiation"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "exponential-log-likelihood-expression",
        title: t("Deriving the log-likelihood function of an exponential sample", "推导指数分布样本的对数似然函数"),
        explanation: t(
          "The logarithm of the likelihood separates into a term from the powers of the rate and a term from the exponent. Taking logarithms, $\\ln L(\\lambda) = n \\ln \\lambda - \\lambda \\sum_i x_i$.",
          "似然函数的对数分成两部分：一部分来自速率的幂，另一部分来自指数。取对数得 $\\ln L(\\lambda) = n \\ln \\lambda - \\lambda \\sum_i x_i$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 50);

          const opts = [
            t(`$${n} \\ln(\\lambda) - \\lambda \\sum_{i=1}^{${n}} x_i$`, `$${n} \\ln(\\lambda) - \\lambda \\sum_{i=1}^{${n}} x_i$`),
            t(`$\\ln(\\lambda) - ${n} \\lambda \\sum_{i=1}^{${n}} x_i$`, `$\\ln(\\lambda) - ${n} \\lambda \\sum_{i=1}^{${n}} x_i$`),
            t(`$${n} \\lambda - \\ln\\left(\\sum_{i=1}^{${n}} x_i\\right)$`, `$${n} \\lambda - \\ln\\left(\\sum_{i=1}^{${n}} x_i\\right)$`),
            t(`$\\lambda^{${n}} - \\lambda \\sum_{i=1}^{${n}} x_i$`, `$\\lambda^{${n}} - \\lambda \\sum_{i=1}^{${n}} x_i$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `For an independent sample of size $n = ${n}$ from $X \\sim \\text{Exp}(\\lambda)$, what is the log-likelihood function $\\ln L(\\lambda)$?`,
                `对于来自 $X \\sim \\text{Exp}(\\lambda)$ 的容量为 $n = ${n}$ 的独立样本，其对数似然函数 $\\ln L(\\lambda)$ 是什么？`,
              ),
              options,
              correct,
              solution: t(
                `Taking the logarithm of $L(\\lambda) = \\lambda^{${n}} e^{-\\lambda \\sum x_i}$ gives $\\ln L(\\lambda) = ${n} \\ln(\\lambda) - \\lambda \\sum_{i=1}^{${n}} x_i$.`,
                `对似然函数 $L(\\lambda) = \\lambda^{${n}} e^{-\\lambda \\sum x_i}$ 取对数得 $\\ln L(\\lambda) = ${n} \\ln(\\lambda) - \\lambda \\sum_{i=1}^{${n}} x_i$。`,
              ),
            }),
            [
              [
                opts[1]!.en,
                `The logarithm of $\\lambda^{${n}}$ is $${n} \\ln(\\lambda)$, and the second term has no extra factor of $${n}$.`,
                `$\\lambda^{${n}}$ 的对数是 $${n} \\ln(\\lambda)$，第二项也没有多余的因子 $${n}$。`,
              ],
              [
                opts[2]!.en,
                "The logarithm applies to $\\lambda$, not to the sum: the sum comes out of the exponent as it is.",
                "取对数的是 $\\lambda$，不是那个和：和从指数上下来时保持原样。",
              ],
              [
                opts[3]!.en,
                `The first term has not been turned into a logarithm: $\\ln \\lambda^{${n}} = ${n} \\ln(\\lambda)$.`,
                `第一项没有取对数：$\\ln \\lambda^{${n}} = ${n} \\ln(\\lambda)$。`,
              ],
            ],
          );
        },
      },
      {
        id: "the-normal-log-likelihood-for-the-mean",
        title: t("The normal log-likelihood for the mean", "正态分布均值的对数似然"),
        explanation: t(
          "For a sample from $N(\\mu, \\sigma^{2})$ with $\\sigma^{2}$ known,\n\n$$\\ln L(\\mu) = -\\frac{n}{2}\\ln(2\\pi\\sigma^{2}) - \\frac{1}{2\\sigma^{2}}\\sum (x_i - \\mu)^{2}.$$\n\nThe first term is a constant. Maximizing $\\ln L$ is the same as **minimizing** $\\sum (x_i - \\mu)^{2}$, so the maximum likelihood estimate of a normal mean is the least-squares estimate, $\\bar{x}$.",
          "对于方差 $\\sigma^{2}$ 已知的 $N(\\mu, \\sigma^{2})$ 样本，\n\n$$\\ln L(\\mu) = -\\frac{n}{2}\\ln(2\\pi\\sigma^{2}) - \\frac{1}{2\\sigma^{2}}\\sum (x_i - \\mu)^{2}.$$\n\n第一项是常数。使 $\\ln L$ 最大等价于使 $\\sum (x_i - \\mu)^{2}$ **最小**，所以正态均值的极大似然估计就是最小二乘估计 $\\bar{x}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(3, 40);
          const v = rng.int(1, 9);
          const right = rng.int(0, 3);
          const opts = [
            `$-\\frac{${n}}{2}\\ln(${2 * v}\\pi) - \\frac{1}{${2 * v}}\\sum (x_i - \\mu)^{2}$`,
            `$-\\frac{${n}}{2}\\ln(${2 * v}\\pi) + \\frac{1}{${2 * v}}\\sum (x_i - \\mu)^{2}$`,
            `$-\\frac{${n}}{2}\\ln(${2 * v}\\pi) - \\frac{1}{${2 * v}}\\left(\\sum x_i - \\mu\\right)^{2}$`,
            `$-${n}\\ln(${2 * v}\\pi) - \\frac{${n}}{${2 * v}}\\sum (x_i - \\mu)^{2}$`,
          ];
          const order = [0, 1, 2, 3].map((i) => (i + right) % 4);
          return choiceProblem({
            prompt: t(
              `$x_1, \\dots, x_{${n}}$ is a sample from $N(\\mu, ${v})$. Which expression is the log-likelihood $\\ln L(\\mu)$?`,
              `$x_1, \\dots, x_{${n}}$ 是来自 $N(\\mu, ${v})$ 的样本。哪个表达式是对数似然 $\\ln L(\\mu)$？`,
            ),
            options: order.map((i) => t(opts[i] ?? "", opts[i] ?? "")),
            correct: order.indexOf(0),
            solution: t(
              `Each density is $\\frac{1}{\\sqrt{${2 * v}\\pi}}e^{-(x_i - \\mu)^{2}/${2 * v}}$; its log is $-\\frac{1}{2}\\ln(${2 * v}\\pi) - \\frac{(x_i - \\mu)^{2}}{${2 * v}}$. Summing $${n}$ of them gives ${opts[0]}, with the squares inside the sum.`,
              `每个密度为 $\\frac{1}{\\sqrt{${2 * v}\\pi}}e^{-(x_i - \\mu)^{2}/${2 * v}}$，其对数为 $-\\frac{1}{2}\\ln(${2 * v}\\pi) - \\frac{(x_i - \\mu)^{2}}{${2 * v}}$。对 $${n}$ 个求和得到 ${opts[0]}，平方在求和号之内。`,
            ),
          });
        },
      },
    ],
  },

  // 6.24.7 Maximum Likelihood Estimation
  {
    id: "maximum-likelihood-estimation",
    title: t("Maximum Likelihood Estimation", "极大似然估计"),
    summary: t(
      "The maximum likelihood estimator (MLE) θ̂ maximizes L(θ) (or equivalently ln L(θ)), found by solving the score equation (d/dθ) ln L(θ) = 0.",
      "极大似然估计量（MLE）θ̂ 使似然函数 L(θ)（或等价地对数似然函数 ln L(θ)）达到最大，通常通过求解得分方程 (d/dθ) ln L(θ) = 0 求得。",
    ),
    prerequisites: [
      "log-likelihood-functions-for-discrete-probability-distributions",
      "log-likelihood-functions-for-continuous-probability-distributions",
    ],
    encompasses: [],
    xp: 15,
    knowledgePoints: [
      {
        id: "mle-of-exponential-distribution",
        title: t("Evaluating the MLE of the rate parameter for exponential data", "计算指数分布比率参数的极大似然估计"),
        explanation: t(
          "Setting the derivative of the log likelihood to zero shows that the best estimate of the rate is the reciprocal of the sample mean. Setting $\\frac{d}{d\\lambda}\\left[n \\ln \\lambda - \\lambda \\sum_i x_i\\right] = \\frac{n}{\\lambda} - \\sum_i x_i = 0$ yields $\\hat{\\lambda} = \\frac{n}{\\sum_i x_i} = \\frac{1}{\\bar{x}}$.",
          "令对数似然的导数为零，可以看出速率的最佳估计是样本均值的倒数。令 $\\frac{d}{d\\lambda}\\left[n \\ln \\lambda - \\lambda \\sum_i x_i\\right] = \\frac{n}{\\lambda} - \\sum_i x_i = 0$，解得 $\\hat{\\lambda} = \\frac{n}{\\sum_i x_i} = \\frac{1}{\\bar{x}}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(5, 50);
          const sum = rng.int(20, 200);

          return numberProblem({
            prompt: t(
              `A sample of $n = ${n}$ items tested to failure follows an exponential distribution $\\text{Exp}(\\lambda)$. The total observed lifetime is $\\sum_{i=1}^{${n}} x_i = ${sum}$. Find the maximum likelihood estimate $\\hat{\\lambda}$.`,
              `对 $n = ${n}$ 个失效元件的寿命观测服从指数分布 $\\text{Exp}(\\lambda)$。观测到的总寿命为 $\\sum_{i=1}^{${n}} x_i = ${sum}$。求比率参数的极大似然估计值 $\\hat{\\lambda}$。`,
            ),
            answer: Q.of(n, sum),
            wrong: [Q.of(sum, n), Q.of(n - 1, sum), Q.of(1, sum)],
            solution: t(
              `Solving the score equation $\\frac{d}{d\\lambda} \\ln L(\\lambda) = \\frac{n}{\\lambda} - \\sum x_i = 0$ yields $\\hat{\\lambda} = \\frac{n}{\\sum x_i} = \\frac{${n}}{${sum}}${lowestTerms(n, sum)}$.`,
              `求解得分方程 $\\frac{d}{d\\lambda} \\ln L(\\lambda) = \\frac{n}{\\lambda} - \\sum x_i = 0$ 得 $\\hat{\\lambda} = \\frac{n}{\\sum x_i} = \\frac{${n}}{${sum}}${lowestTerms(n, sum)}$。`,
            ),
          });
        },
      },
      {
        id: "the-mle-of-a-uniform-endpoint",
        title: t("The MLE of a uniform endpoint", "均匀分布端点的极大似然估计"),
        explanation: t(
          "Not every MLE comes from setting a derivative to $0$. For $U(0, \\theta)$, $L(\\theta) = \\theta^{-n}$ for $\\theta \\ge \\max x_i$ and $0$ below it. This function is largest at the smallest allowed value, so\n\n$$\\hat{\\theta}_{\\text{MLE}} = \\max x_i.$$\n\nThe method of moments gives $2\\bar{x}$ instead, which can even be smaller than an observed value. The MLE is never below the data, but it is biased low: the true endpoint is at least as large as the largest observation.",
          "并非每个极大似然估计都来自令导数为 $0$。对于 $U(0, \\theta)$，当 $\\theta \\ge \\max x_i$ 时 $L(\\theta) = \\theta^{-n}$，小于它时为 $0$。该函数在允许的最小值处最大，所以\n\n$$\\hat{\\theta}_{\\text{MLE}} = \\max x_i.$$\n\n矩估计给出 $2\\bar{x}$，它甚至可能小于某个观测值。极大似然估计永远不低于数据，但偏低：真实端点至少和最大观测值一样大。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 6);
          const xs = Array.from({ length: n }, () => Q.of(rng.int(5, 99), 10));
          const max = xs.reduce((m, x) => (x.cmp(m) > 0 ? x : m), Q.zero);
          const sum = xs.reduce((s, x) => s.add(x), Q.zero);
          const mom = Q.of(2).mul(sum).div(Q.of(n));
          const wrong = [mom, sum.div(Q.of(n)), Q.of(n + 1, n).mul(max)].filter((w) => !w.eq(max));
          return numberProblem({
            prompt: t(
              `A sample from $U(0, \\theta)$ is $${xs.map((x) => dec(x)).join(", ")}$. Find the maximum likelihood estimate $\\hat{\\theta}$.`,
              `来自 $U(0, \\theta)$ 的样本为 $${xs.map((x) => dec(x)).join(", ")}$。求 $\\theta$ 的极大似然估计 $\\hat{\\theta}$。`,
            ),
            answer: max,
            form: "decimal",
            wrong,
            solution: t(
              `$L(\\theta) = \\theta^{-${n}}$ is decreasing, and $\\theta$ cannot be below the largest observation, so $\\hat{\\theta} = \\max x_i = ${dec(max)}$.`,
              `$L(\\theta) = \\theta^{-${n}}$ 单调递减，而 $\\theta$ 不能小于最大观测值，所以 $\\hat{\\theta} = \\max x_i = ${dec(max)}$。`,
            ),
          });
        },
      },
    ],
  },
];
