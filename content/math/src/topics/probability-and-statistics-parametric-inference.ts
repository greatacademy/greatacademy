import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, dec, Q } from "@ga/subject-math";
import { choiceProblem, explainedChoice, isTerminating, lowestTerms, numberProblem, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** apart keeps the explained mistakes that differ from the answer and from each other. */
const apart = <T extends { readonly value: Coefficient }>(answer: Coefficient, list: readonly T[]): T[] => {
  const asQ = (v: Coefficient) => (typeof v === "number" ? Q.of(v) : v);
  return list.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && list.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
};

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
    intro: t(
      "A sample of $4$ bags weighs $4, 7, 9, 12$ kilograms. The total is $4 + 7 + 9 + 12 = 32$, and sharing it equally among the $4$ bags gives the sample mean $\\bar{x} = \\frac{32}{4} = 8$ kilograms. If weights came as a table instead, say $7$ twice and $9$ three times, each value would count as often as it occurs: $\\frac{2 \\cdot 7 + 3 \\cdot 9}{5} = \\frac{41}{5} = 8.2$.\n\nCheck: the deviations from $8$ are $-4, -1, 1, 4$, and they add up to $0$, as deviations from the mean always do.\n\nIn this lesson we compute the sample mean from raw data and from a frequency table, correct it after an observation was recorded wrongly, and read it from a drawn frequency chart.",
      "抽取 $4$ 袋货物，重量为 $4, 7, 9, 12$ 千克。总重为 $4 + 7 + 9 + 12 = 32$，平均分给 $4$ 袋，得样本均值 $\\bar{x} = \\frac{32}{4} = 8$ 千克。若数据以表格给出，例如 $7$ 出现两次、$9$ 出现三次，则每个值出现几次就计几次：$\\frac{2 \\cdot 7 + 3 \\cdot 9}{5} = \\frac{41}{5} = 8.2$。\n\n检验：到 $8$ 的离差为 $-4, -1, 1, 4$，和为 $0$，到均值的离差之和总是如此。\n\n本课我们由原始数据和频数表计算样本均值，在某个观测值记错后修正均值，并从画出的频数图中读出均值。",
    ),
    prerequisites: ["properties-of-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "sample-mean-calculation",
        title: t("Calculating the sample mean from raw data", "根据原始数据计算样本均值"),
        explanation: t(
          "The sample mean is the balance point of the data, the single value that the observations are spread around. Sum all observations and divide by the sample size $n$: $\\bar{x} = \\frac{1}{n} \\sum_i x_i$.\n\nFor the sample $3, 8, 10$: the sum is $21$ and $n = 3$, so $\\bar{x} = \\frac{21}{3} = 7$.\n\nCheck: $n\\bar{x} = 3 \\cdot 7 = 21$ gives back the total.\n\n> **Watch out.** Divide by $n$, the number of observations, not by $n - 1$: dividing $21$ by $2$ gives $10.5$, larger than every observation. The $n - 1$ belongs to the sample variance.",
          "样本均值是数据的平衡点，是观测值围绕分布的那个单一数值。将所有观测值相加并除以样本容量 $n$：$\\bar{x} = \\frac{1}{n} \\sum_i x_i$。\n\n对样本 $3, 8, 10$：总和为 $21$，$n = 3$，所以 $\\bar{x} = \\frac{21}{3} = 7$。\n\n检验：$n\\bar{x} = 3 \\cdot 7 = 21$，正好还原总和。\n\n> **注意。** 要除以观测个数 $n$，而不是 $n - 1$：$21$ 除以 $2$ 得 $10.5$，比每个观测值都大。$n - 1$ 属于样本方差。",
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
          const mean = Q.of(sum, n);
          const sorted = [...values].sort((a, b) => a - b);
          const median =
            n % 2 === 1 ? Q.of(sorted[(n - 1) / 2] as number) : Q.of((sorted[n / 2 - 1] as number) + (sorted[n / 2] as number), 2);
          return numberProblem({
            prompt: t(
              `Given the sample observations: $${listStr}$, calculate the sample mean $\\bar{x}$.`,
              `已知样本观测值数据：$${listStr}$，计算样本均值 $\\bar{x}$。`,
            ),
            answer: mean,
            wrong: [Q.of(sum, n + 1)],
            mistakes: apart(mean, [
              why(
                Q.of(sum, n - 1),
                `This divides by $n - 1 = ${n - 1}$; the mean divides the total by $n = ${n}$.`,
                `这除以了 $n - 1 = ${n - 1}$；均值要把总和除以 $n = ${n}$。`,
              ),
              why(sum, "This is the total of the observations, not yet divided by $n$.", "这是观测值的总和，还没有除以 $n$。"),
              why(
                median,
                "This is the median, the middle value of the sorted data, not the mean.",
                "这是中位数，即排序后居中的值，不是均值。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Add the observations", "把观测值相加"],
                  t(`$\\sum x_i = ${values.join(" + ")} = ${sum}$.`, `$\\sum x_i = ${values.join(" + ")} = ${sum}$。`),
                ],
                [
                  ["Divide by the sample size", "除以样本容量"],
                  t(
                    `There are $n = ${n}$ observations, so $\\bar{x} = \\frac{${sum}}{${n}}${lowestTerms(sum, n)}$.`,
                    `共有 $n = ${n}$ 个观测值，所以 $\\bar{x} = \\frac{${sum}}{${n}}${lowestTerms(sum, n)}$。`,
                  ),
                ],
              ],
              t(
                `$n\\bar{x} = ${n} \\cdot ${mean.toLatex()} = ${sum}$ gives back the total, and $${mean.toLatex()}$ lies between the smallest observation $${sorted[0]}$ and the largest $${sorted[n - 1]}$.`,
                `$n\\bar{x} = ${n} \\cdot ${mean.toLatex()} = ${sum}$ 还原了总和，且 $${mean.toLatex()}$ 介于最小观测值 $${sorted[0]}$ 与最大观测值 $${sorted[n - 1]}$ 之间。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-mean-from-a-frequency-table",
        title: t("The mean from a frequency table", "由频数表求均值"),
        explanation: t(
          "When a sample is summarized by distinct values $x_j$ with frequencies $f_j$, each value counts as many times as it occurs:\n\n$$\\bar{x} = \\frac{\\sum f_j x_j}{\\sum f_j}.$$\n\nThe denominator is the total number of observations $n = \\sum f_j$, not the number of distinct values. For values $1, 2, 3$ with frequencies $5, 3, 2$: $\\bar{x} = \\frac{5 + 6 + 6}{10} = 1.7$.\n\nCheck: $1.7$ lies between $1$ and $2$, nearer $1$, which occurs most often.\n\n> **Watch out.** Averaging the distinct values ignores the frequencies: $\\frac{1 + 2 + 3}{3} = 2$ would be right only if every value occurred equally often. Dividing $17$ by the $3$ distinct values instead of the $10$ observations is wrong too.",
          "当样本以不同取值 $x_j$ 及其频数 $f_j$ 概括时，每个值出现几次就计几次：\n\n$$\\bar{x} = \\frac{\\sum f_j x_j}{\\sum f_j}.$$\n\n分母是观测总数 $n = \\sum f_j$，而不是不同取值的个数。例如取值 $1, 2, 3$ 的频数为 $5, 3, 2$：$\\bar{x} = \\frac{5 + 6 + 6}{10} = 1.7$。\n\n检验：$1.7$ 介于 $1$ 与 $2$ 之间，且更靠近出现最多的 $1$。\n\n> **注意。** 直接平均不同的取值会忽略频数：$\\frac{1 + 2 + 3}{3} = 2$ 只在每个值出现次数相同时才对。把 $17$ 除以 $3$ 个不同取值而不是 $10$ 个观测，同样是错的。",
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
            mistakes: apart(ans, [
              why(
                plain,
                "This averages the four distinct values and ignores how often each occurs.",
                "这把四个不同取值直接平均，忽略了各自出现的次数。",
              ),
              why(
                Q.of(total, 4),
                `This divides $\\sum f_j x_j = ${total}$ by the $4$ distinct values instead of the $n = ${n}$ observations.`,
                `这把 $\\sum f_j x_j = ${total}$ 除以 $4$ 个不同取值，而不是 $n = ${n}$ 个观测。`,
              ),
              why(Q.of(n, 4), "This is the average frequency, not the average value.", "这是平均频数，不是平均取值。"),
            ]),
            solution: walked(
              [
                [
                  ["Weight each value by its frequency", "按频数加权"],
                  t(
                    `$\\sum f_j x_j = ${xs.map((x, i) => `${fs[i]} \\cdot ${x}`).join(" + ")} = ${total}$.`,
                    `$\\sum f_j x_j = ${xs.map((x, i) => `${fs[i]} \\cdot ${x}`).join(" + ")} = ${total}$。`,
                  ),
                ],
                [
                  ["Count the observations", "数观测个数"],
                  t(`$n = \\sum f_j = ${fs.join(" + ")} = ${n}$.`, `$n = \\sum f_j = ${fs.join(" + ")} = ${n}$。`),
                ],
                [
                  ["Divide", "相除"],
                  t(
                    `$\\bar{x} = \\frac{${total}}{${n}}${lowestTerms(total, n)}$.`,
                    `$\\bar{x} = \\frac{${total}}{${n}}${lowestTerms(total, n)}$。`,
                  ),
                ],
              ],
              t(
                `$${n} \\cdot ${ans.toLatex()} = ${total}$ gives back the weighted total, and the mean lies between the smallest value $${start}$ and the largest $${start + 3}$.`,
                `$${n} \\cdot ${ans.toLatex()} = ${total}$ 还原了加权总和，且均值介于最小取值 $${start}$ 与最大取值 $${start + 3}$ 之间。`,
              ),
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
    intro: t(
      "A population holds the values $1$ and $3$, equally likely. Drawing $2$ values with replacement gives $4$ equally likely ordered samples, $(1, 1), (1, 3), (3, 1), (3, 3)$, with means $1, 2, 2, 3$. So the sample mean $\\bar{X}$ has its own distribution: $P(\\bar{X} = 1) = \\frac{1}{4}$, $P(\\bar{X} = 2) = \\frac{1}{2}$ and $P(\\bar{X} = 3) = \\frac{1}{4}$.\n\nCheck: the probabilities add up to $\\frac{1}{4} + \\frac{1}{2} + \\frac{1}{4} = 1$, and the average of the four means, $\\frac{1 + 2 + 2 + 3}{4} = 2$, equals the population mean.\n\nIn this lesson we list the sampling distribution of a statistic from every possible sample, find the expected value of the sample mean, and find the distribution of the largest value in a sample.",
      "某总体由等可能的值 $1$ 和 $3$ 组成。有放回地抽取 $2$ 个值，共有 $4$ 个等可能的有序样本 $(1, 1), (1, 3), (3, 1), (3, 3)$，均值为 $1, 2, 2, 3$。所以样本均值 $\\bar{X}$ 有自己的分布：$P(\\bar{X} = 1) = \\frac{1}{4}$，$P(\\bar{X} = 2) = \\frac{1}{2}$，$P(\\bar{X} = 3) = \\frac{1}{4}$。\n\n检验：概率之和为 $\\frac{1}{4} + \\frac{1}{2} + \\frac{1}{4} = 1$，四个均值的平均 $\\frac{1 + 2 + 2 + 3}{4} = 2$ 等于总体均值。\n\n本课我们通过列出所有可能的样本得到统计量的抽样分布，求样本均值的期望，并求样本中最大值的分布。",
    ),
    prerequisites: ["the-sample-mean"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "sampling-distribution-unbiased-expectation",
        title: t("Expected value of the sample mean statistic", "样本均值统计量的数学期望"),
        explanation: t(
          "The sample mean varies from sample to sample, but on average it hits the population mean exactly, which is what unbiased means. For any population with mean $\\mu$, the expected value of the sample mean is $E[\\bar{X}] = \\mu$ (unbiasedness).\n\nFor samples of size $25$ from a population with mean $50$: $E[\\bar{X}] = \\frac{1}{25}(25 \\cdot 50) = 50$.\n\nCheck: each of the $25$ draws has mean $50$, so their total has mean $25 \\cdot 50 = 1250$, and dividing by $25$ gives $50$ again.\n\n> **Watch out.** The sample size changes the spread of $\\bar{X}$, not its center: $E[\\bar{X}]$ is $50$, not $\\frac{50}{25} = 2$. The $n$ that divides the total cancels the $n$ that multiplies $\\mu$.",
          "样本均值随样本不同而变化，但平均来说它恰好等于总体均值，这就是无偏的含义。对任意均值为 $\\mu$ 的总体，样本均值的期望值满足 $E[\\bar{X}] = \\mu$（无偏性）。\n\n从均值为 $50$ 的总体中抽取容量为 $25$ 的样本：$E[\\bar{X}] = \\frac{1}{25}(25 \\cdot 50) = 50$。\n\n检验：$25$ 次抽取每次的均值都是 $50$，所以总和的均值为 $25 \\cdot 50 = 1250$，再除以 $25$ 又得 $50$。\n\n> **注意。** 样本量改变的是 $\\bar{X}$ 的离散程度，而不是中心：$E[\\bar{X}]$ 是 $50$，不是 $\\frac{50}{25} = 2$。除总和的 $n$ 与乘 $\\mu$ 的 $n$ 相互抵消。",
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
            wrong: [Q.of(8, n)],
            mistakes: apart(mu, [
              why(
                Q.of(mu, n),
                `This divides $\\mu$ by $n$; the $n$ in $\\bar{X} = \\frac{1}{n}\\sum X_i$ cancels the $n$ terms of the sum.`,
                `这把 $\\mu$ 除以了 $n$；$\\bar{X} = \\frac{1}{n}\\sum X_i$ 中的 $n$ 与求和的 $n$ 项相互抵消。`,
              ),
              why(
                mu * n,
                `This is the expected total of the $${n}$ draws, $n\\mu$, before dividing by $n$.`,
                `这是 $${n}$ 次抽取的总和的期望 $n\\mu$，还没有除以 $n$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Use linearity of expectation", "用期望的线性"],
                  t(
                    `$E[\\bar{X}] = \\frac{1}{n}\\sum_{i=1}^{n} E[X_i] = \\frac{1}{${n}} \\cdot ${n} \\cdot ${mu}$.`,
                    `$E[\\bar{X}] = \\frac{1}{n}\\sum_{i=1}^{n} E[X_i] = \\frac{1}{${n}} \\cdot ${n} \\cdot ${mu}$。`,
                  ),
                ],
                [
                  ["Cancel", "约去"],
                  t(`The factors $${n}$ cancel, so $E[\\bar{X}] = \\mu = ${mu}$.`, `两个 $${n}$ 约去，所以 $E[\\bar{X}] = \\mu = ${mu}$。`),
                ],
              ],
              t(
                `Neither $n = ${n}$ nor $\\sigma = 8$ is left in the answer: $\\sigma$ and $n$ only set the spread $\\frac{\\sigma}{\\sqrt{n}}$ of the sample means around $${mu}$.`,
                `答案中既没有 $n = ${n}$，也没有 $\\sigma = 8$：$\\sigma$ 和 $n$ 只决定样本均值围绕 $${mu}$ 的离散程度 $\\frac{\\sigma}{\\sqrt{n}}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "listing-a-sampling-distribution",
        title: t("Listing a sampling distribution", "列出抽样分布"),
        explanation: t(
          "For a small population the sampling distribution can be built by listing every possible sample. With a population of three equally likely values and samples of size $2$ drawn **with replacement**, there are $3^{2} = 9$ equally likely ordered samples; compute $\\bar{x}$ for each and count.\n\nFor the population $\\{2, 4, 6\\}$, the means are $2$ once, $3$ twice, $4$ three times, $5$ twice and $6$ once, so $P(\\bar{X} = 4) = \\frac{3}{9}$. The distribution of $\\bar{X}$ is more concentrated in the middle than the population is.\n\nCheck: the counts $1 + 2 + 3 + 2 + 1 = 9$ use up every sample exactly once.\n\n> **Watch out.** Order matters: $(2, 4)$ and $(4, 2)$ are two different samples. Counting unordered pairs gives $P(\\bar{X} = 3) = \\frac{1}{6}$, but the six unordered pairs are not equally likely; the right value is $\\frac{2}{9}$.",
          "对于小总体，可以列出所有可能的样本来构造抽样分布。若总体有三个等可能的值，**有放回**地抽取容量为 $2$ 的样本，则共有 $3^{2} = 9$ 个等可能的有序样本；算出每个样本的 $\\bar{x}$ 再计数。\n\n例如总体 $\\{2, 4, 6\\}$，均值为 $2$ 的一次、$3$ 的两次、$4$ 的三次、$5$ 的两次、$6$ 的一次，所以 $P(\\bar{X} = 4) = \\frac{3}{9}$。$\\bar{X}$ 的分布比总体更集中于中部。\n\n检验：计数 $1 + 2 + 3 + 2 + 1 = 9$，每个样本恰好用了一次。\n\n> **注意。** 顺序有区别：$(2, 4)$ 和 $(4, 2)$ 是两个不同的样本。若按无序对计数，会得到 $P(\\bar{X} = 3) = \\frac{1}{6}$，但六个无序对并不等可能；正确值是 $\\frac{2}{9}$。",
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
          const unordered = pop.flatMap((x, i) => pop.slice(i).map((y) => Q.of(x + y, 2))).filter((m) => m.eq(target)).length;
          const distinct = means.filter((m, i) => means.findIndex((x) => x.eq(m)) === i).sort((u, v) => u.toNumber() - v.toNumber());
          const tally = distinct.map((m) => means.filter((x) => x.eq(m)).length);
          return numberProblem({
            prompt: t(
              `A population consists of the values $${pop.join(", ")}$, equally likely. Samples of size $2$ are drawn with replacement. Find $P(\\bar{X} = ${dec(target)})$.`,
              `某总体由等可能的值 $${pop.join(", ")}$ 组成。有放回地抽取容量为 $2$ 的样本。求 $P(\\bar{X} = ${dec(target)})$。`,
            ),
            answer: ans,
            wrong: [Q.of(1, 3)],
            mistakes: apart(ans, [
              why(
                Q.of(unordered, 6),
                "This counts the $6$ unordered samples, but they are not equally likely: a pair of different values occurs in two orders.",
                "这按 $6$ 个无序样本计数，但它们并不等可能：两个不同值组成的样本有两种顺序。",
              ),
              count === 1
                ? why(
                    Q.of(2, 9),
                    "This counts the sample twice, but a repeated value such as this one occurs in only one order.",
                    "这把样本计了两次，但像这样两次取同一值的样本只有一种顺序。",
                  )
                : why(
                    Q.of(1, 9),
                    "This counts only one ordered sample; the other order gives the same mean too.",
                    "这只计了一个有序样本；另一种顺序也给出同一均值。",
                  ),
            ]),
            solution: walked(
              [
                [
                  ["List the samples", "列出样本"],
                  t(
                    `There are $3^{2} = 9$ equally likely ordered samples, with means ${pop.map((x) => pop.map((y) => `$${dec(Q.of(x + y, 2))}$`).join(", ")).join("; ")}.`,
                    `共有 $3^{2} = 9$ 个等可能的有序样本，均值为 ${pop.map((x) => pop.map((y) => `$${dec(Q.of(x + y, 2))}$`).join("，")).join("；")}。`,
                  ),
                ],
                [
                  ["Count the matches", "计数"],
                  t(
                    `Exactly $${count}$ of them equal $${dec(target)}$, so the probability is $\\frac{${count}}{9}${lowestTerms(count, 9)}$.`,
                    `恰有 $${count}$ 个等于 $${dec(target)}$，所以概率为 $\\frac{${count}}{9}${lowestTerms(count, 9)}$。`,
                  ),
                ],
              ],
              t(
                `The means ${distinct.map((m) => `$${dec(m)}$`).join(", ")} occur $${tally.join(" + ")} = 9$ times in all, so every sample was counted exactly once.`,
                `均值 ${distinct.map((m) => `$${dec(m)}$`).join("，")} 共出现 $${tally.join(" + ")} = 9$ 次，每个样本恰好计了一次。`,
              ),
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
    intro: t(
      "The sample $4, 6, 8$ has mean $6$ and deviations $-2, 0, 2$. The squared deviations add up to $4 + 0 + 4 = 8$, and dividing by $n - 1 = 2$ gives the sample variance $s^{2} = 4$.\n\nCheck: the shortcut gives the same value, since $\\sum x^{2} = 16 + 36 + 64 = 116$ and $\\frac{116 - \\frac{18^{2}}{3}}{2} = \\frac{116 - 108}{2} = 4$.\n\nIn this lesson we compute the sample variance with the divisor $n - 1$, from raw data and from the sums $\\sum x$ and $\\sum x^{2}$, and see how it changes when a value is added to the sample.",
      "样本 $4, 6, 8$ 的均值为 $6$，离均差为 $-2, 0, 2$。离差平方和为 $4 + 0 + 4 = 8$，除以 $n - 1 = 2$ 得样本方差 $s^{2} = 4$。\n\n检验：简便公式给出同样的值，因为 $\\sum x^{2} = 16 + 36 + 64 = 116$，且 $\\frac{116 - \\frac{18^{2}}{3}}{2} = \\frac{116 - 108}{2} = 4$。\n\n本课我们用除数 $n - 1$ 计算样本方差，分别由原始数据和由 $\\sum x$、$\\sum x^{2}$ 计算，并看样本中加入一个值后方差如何变化。",
    ),
    prerequisites: ["the-sample-mean", "properties-of-variance-for-discrete-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "sample-variance-calculation-small-n",
        title: t("Calculating sample variance with n - 1 divisor", "用除数 n - 1 计算样本方差"),
        explanation: t(
          "Dividing by one less than the sample size corrects for measuring spread around the sample mean instead of the unknown true mean. $S^2 = \\frac{1}{n - 1} \\left[\\sum_i x_i^2 - n\\bar{x}^2\\right]$, or, from the deviations, $S^2 = \\frac{1}{n - 1}\\sum_i (x_i - \\bar{x})^2$.\n\nFor the sample $7, 10, 13$: the mean is $10$, the deviations are $-3, 0, 3$, and $s^{2} = \\frac{9 + 0 + 9}{2} = 9$.\n\nCheck: the deviations add up to $-3 + 0 + 3 = 0$, as deviations from the mean always do, so the mean was right.\n\n> **Watch out.** Divide by $n - 1 = 2$, not by $n = 3$: $\\frac{18}{3} = 6$ is the biased version, which measures spread around $\\bar{x}$ and so comes out too small on average.",
          "除以样本量减 1，是为了修正用样本均值而不是未知真实均值来衡量分散程度所带来的偏差。$S^2 = \\frac{1}{n - 1} \\left[\\sum_i x_i^2 - n\\bar{x}^2\\right]$，或由离均差得 $S^2 = \\frac{1}{n - 1}\\sum_i (x_i - \\bar{x})^2$。\n\n例如样本 $7, 10, 13$：均值为 $10$，离均差为 $-3, 0, 3$，$s^{2} = \\frac{9 + 0 + 9}{2} = 9$。\n\n检验：离均差之和 $-3 + 0 + 3 = 0$，离均差之和总是为零，说明均值算对了。\n\n> **注意。** 除以 $n - 1 = 2$，不是 $n = 3$：$\\frac{18}{3} = 6$ 是有偏的版本，它以 $\\bar{x}$ 为中心衡量分散程度，平均来说偏小。",
        ),
        generate: (rng: Rng): Problem => {
          // Choose a mean and deviations so calculations are clean
          const mean = rng.int(5, 20);
          const d1 = rng.int(-4, -1);
          const d2 = rng.int(1, 4);
          const d3 = -d1 - d2; // sum of deviations is 0
          const values = [mean + d1, mean + d2, mean + d3];
          const ss = d1 * d1 + d2 * d2 + d3 * d3;
          const ans = Q.of(ss, 2);
          // n = 3, n - 1 = 2
          const listStr = values.join(", ");
          const sq = (v: number) => (v < 0 ? `(${v})^{2}` : `${v}^{2}`);

          return numberProblem({
            prompt: t(
              `Calculate the unbiased sample variance $s^2$ for the sample dataset: $${listStr}$.`,
              `计算样本数据集 $${listStr}$ 的无偏样本方差 $s^2$。`,
            ),
            answer: ans,
            wrong: [Q.of(ss, 3), ss, Q.of(ss, 4)],
            mistakes: apart(ans, [
              why(
                Q.of(ss, 3),
                "This divides by $n = 3$; the unbiased sample variance divides by $n - 1 = 2$.",
                "这除以了 $n = 3$；无偏样本方差应除以 $n - 1 = 2$。",
              ),
              why(ss, "This is the sum of the squared deviations, not yet divided by $n - 1$.", "这是离差平方和，还没有除以 $n - 1$。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the mean", "求均值"],
                  t(
                    `$\\bar{x} = \\frac{${values.join(" + ")}}{3} = ${mean}$.`,
                    `$\\bar{x} = \\frac{${values.join(" + ")}}{3} = ${mean}$。`,
                  ),
                ],
                [
                  ["Square the deviations", "离均差平方"],
                  t(
                    `The deviations are $${d1}, ${d2}, ${d3}$, and $${[d1, d2, d3].map(sq).join(" + ")} = ${ss}$.`,
                    `离均差为 $${d1}, ${d2}, ${d3}$，$${[d1, d2, d3].map(sq).join(" + ")} = ${ss}$。`,
                  ),
                ],
                [
                  ["Divide by n − 1", "除以 n − 1"],
                  t(`$s^{2} = \\frac{${ss}}{2}${lowestTerms(ss, 2)}$.`, `$s^{2} = \\frac{${ss}}{2}${lowestTerms(ss, 2)}$。`),
                ],
              ],
              t(
                `The deviations add up to $${d1} + ${d2} + ${d3 < 0 ? `(${d3})` : d3} = 0$, as deviations from the mean must, so the mean $${mean}$ is right.`,
                `离均差之和 $${d1} + ${d2} + ${d3 < 0 ? `(${d3})` : d3} = 0$，离均差之和必为零，所以均值 $${mean}$ 正确。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-variance-from-summary-sums",
        title: t("The variance from summary sums", "由汇总和求方差"),
        explanation: t(
          "Expanding the squares gives a shortcut that needs only $n$, $\\sum x$ and $\\sum x^{2}$:\n\n$$s^{2} = \\frac{1}{n - 1}\\left(\\sum x^{2} - \\frac{\\left(\\sum x\\right)^{2}}{n}\\right).$$\n\nThis is how calculators and summary tables work. For $n = 5$, $\\sum x = 20$ and $\\sum x^{2} = 100$: $s^{2} = \\frac{100 - 80}{4} = 5$. Dividing by $n$ instead of $n - 1$ gives the biased version.\n\nCheck: the data $1, 3, 4, 5, 7$ have exactly these sums, $\\sum x = 20$ and $\\sum x^{2} = 1 + 9 + 16 + 25 + 49 = 100$, and their deviations $-3, -1, 0, 1, 3$ give $\\frac{9 + 1 + 0 + 1 + 9}{4} = 5$.\n\n> **Watch out.** Subtract $\\frac{(\\sum x)^{2}}{n} = \\frac{400}{5} = 80$, not $(\\sum x)^{2} = 400$, and do not skip this step: $\\frac{100}{4} = 25$ is far too large.",
          "把平方展开得到一个只需 $n$、$\\sum x$ 和 $\\sum x^{2}$ 的简便公式：\n\n$$s^{2} = \\frac{1}{n - 1}\\left(\\sum x^{2} - \\frac{\\left(\\sum x\\right)^{2}}{n}\\right).$$\n\n计算器和汇总表正是这样计算的。若 $n = 5$，$\\sum x = 20$，$\\sum x^{2} = 100$：$s^{2} = \\frac{100 - 80}{4} = 5$。若除以 $n$ 而不是 $n - 1$，得到的是有偏的版本。\n\n检验：数据 $1, 3, 4, 5, 7$ 恰有这些和，$\\sum x = 20$，$\\sum x^{2} = 1 + 9 + 16 + 25 + 49 = 100$，离均差 $-3, -1, 0, 1, 3$ 给出 $\\frac{9 + 1 + 0 + 1 + 9}{4} = 5$。\n\n> **注意。** 要减去 $\\frac{(\\sum x)^{2}}{n} = \\frac{400}{5} = 80$，而不是 $(\\sum x)^{2} = 400$；也不能漏掉这一步：直接用 $\\frac{100}{4} = 25$ 远远偏大。",
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
            mistakes: apart(ans, [
              why(
                ss.div(Q.of(n)),
                `This divides by $n = ${n}$; the sample variance divides by $n - 1 = ${n - 1}$.`,
                `这除以了 $n = ${n}$；样本方差应除以 $n - 1 = ${n - 1}$。`,
              ),
              why(ss, "This is the sum of squared deviations, not yet divided by $n - 1$.", "这是离差平方和，还没有除以 $n - 1$。"),
              why(
                Q.of(sxxInt, n - 1),
                "This skips subtracting $\\frac{(\\sum x)^{2}}{n}$, so it measures spread around $0$ instead of around the mean.",
                "这漏减了 $\\frac{(\\sum x)^{2}}{n}$，相当于以 $0$ 而不是均值为中心衡量分散程度。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Sum of squared deviations", "离差平方和"],
                  t(
                    `$\\sum x^{2} - \\frac{(\\sum x)^{2}}{n} = ${sxxInt} - \\frac{${sx * sx}}{${n}} = ${ss.toLatex()}$.`,
                    `$\\sum x^{2} - \\frac{(\\sum x)^{2}}{n} = ${sxxInt} - \\frac{${sx * sx}}{${n}} = ${ss.toLatex()}$。`,
                  ),
                ],
                [
                  ["Divide by n − 1", "除以 n − 1"],
                  t(
                    `$s^{2} = \\frac{1}{${n - 1}} \\cdot ${ss.toLatex()} = ${ans.toLatex()}$.`,
                    `$s^{2} = \\frac{1}{${n - 1}} \\cdot ${ss.toLatex()} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The sum of squared deviations $${ss.toLatex()}$ is positive and smaller than $\\sum x^{2} = ${sxxInt}$, as it must be, since measuring from the mean always gives less than measuring from $0$.`,
                `离差平方和 $${ss.toLatex()}$ 为正且小于 $\\sum x^{2} = ${sxxInt}$，这是必然的：以均值为中心总比以 $0$ 为中心得到的平方和小。`,
              ),
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
    intro: t(
      "Two samples come from populations with the same variance: $n_1 = 5$ with $s_1^2 = 10$, and $n_2 = 7$ with $s_2^2 = 15$. Weight each variance by its degrees of freedom, $4$ and $6$: $s_p^2 = \\frac{4 \\cdot 10 + 6 \\cdot 15}{4 + 6} = \\frac{130}{10} = 13$.\n\nCheck: $13$ lies between $10$ and $15$, and closer to $15$, because the second sample is larger and carries more weight.\n\nIn this lesson we combine two sample variances into one pooled variance, from summary values and from raw data, and see why the divisor is $n_1 + n_2 - 2$.",
      "两个样本来自方差相同的总体：$n_1 = 5$，$s_1^2 = 10$；$n_2 = 7$，$s_2^2 = 15$。用各自的自由度 $4$ 和 $6$ 加权：$s_p^2 = \\frac{4 \\cdot 10 + 6 \\cdot 15}{4 + 6} = \\frac{130}{10} = 13$。\n\n检验：$13$ 介于 $10$ 与 $15$ 之间，且更靠近 $15$，因为第二个样本更大，权重更大。\n\n本课我们把两个样本方差合并为一个合并方差，分别由汇总值和原始数据计算，并说明分母为何是 $n_1 + n_2 - 2$。",
    ),
    prerequisites: ["the-sample-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "pooled-variance-evaluation",
        title: t("Computing pooled variance from two independent samples", "根据两个独立样本计算合并方差"),
        explanation: t(
          "When two populations share a variance, combine the samples by weighting each sample variance by its degrees of freedom. The pooled variance is $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$.\n\nWith $n_1 = 9$, $s_1^2 = 6$ and $n_2 = 5$, $s_2^2 = 12$: $s_p^2 = \\frac{8 \\cdot 6 + 4 \\cdot 12}{8 + 4} = \\frac{96}{12} = 8$.\n\nCheck: the pooled variance is a weighted average of $6$ and $12$, so it must lie between them; $8$ does, nearer $6$, the variance of the larger sample.\n\n> **Watch out.** The weights are the degrees of freedom, not the sizes, and the divisor is $n_1 + n_2 - 2$, not $n_1 + n_2$. Dividing $96$ by $14$ gives $\\frac{48}{7}$, which is too small; the plain average $\\frac{6 + 12}{2} = 9$ ignores that the first sample is larger.",
          "当两个总体方差相同时，用各自的自由度对样本方差加权来合并两个样本。合并方差为 $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$。\n\n例如 $n_1 = 9$，$s_1^2 = 6$；$n_2 = 5$，$s_2^2 = 12$：$s_p^2 = \\frac{8 \\cdot 6 + 4 \\cdot 12}{8 + 4} = \\frac{96}{12} = 8$。\n\n检验：合并方差是 $6$ 与 $12$ 的加权平均，必定介于两者之间；$8$ 正是如此，且更靠近较大样本的方差 $6$。\n\n> **注意。** 权重是自由度而不是样本量，分母是 $n_1 + n_2 - 2$ 而不是 $n_1 + n_2$。用 $96$ 除以 $14$ 得 $\\frac{48}{7}$，偏小；简单平均 $\\frac{6 + 12}{2} = 9$ 则忽略了第一个样本更大。",
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
          const ans = Q.of(num, den);

          return numberProblem({
            prompt: t(
              `Two independent samples drawn from populations with equal variance have sample sizes $n_1 = ${n1}$, $n_2 = ${n2}$ and sample variances $s_1^2 = ${s1Sq}$, $s_2^2 = ${s2Sq}$. Compute the pooled sample variance $s_p^2$.`,
              `从具有相同方差的总体中抽取的两个独立样本，样本容量分别为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$，样本方差分别为 $s_1^2 = ${s1Sq}$ 与 $s_2^2 = ${s2Sq}$。计算合并样本方差 $s_p^2$。`,
            ),
            answer: ans,
            wrong: [Q.of(s1Sq + s2Sq, 2), Q.of(n1 * s1Sq + n2 * s2Sq, n1 + n2), Q.of(num, den + 2)],
            mistakes: apart(ans, [
              why(
                Q.of(num, den + 2),
                "This divides by $n_1 + n_2$; two degrees of freedom are used up by the two sample means, so the divisor is $n_1 + n_2 - 2$.",
                "这除以了 $n_1 + n_2$；两个样本均值用掉了两个自由度，分母应为 $n_1 + n_2 - 2$。",
              ),
              why(
                Q.of(s1Sq + s2Sq, 2),
                "This is the plain average of the two variances; each must be weighted by its degrees of freedom.",
                "这是两个方差的简单平均；每个方差应按其自由度加权。",
              ),
              why(
                Q.of(n1 * s1Sq + n2 * s2Sq, n1 + n2),
                "This weights by the sample sizes $n_1$ and $n_2$; the weights are $n_1 - 1$ and $n_2 - 1$.",
                "这按样本量 $n_1$ 和 $n_2$ 加权；权重应为 $n_1 - 1$ 和 $n_2 - 1$。",
              ),
              why(
                s1Sq + s2Sq,
                "This adds the two variances; pooling averages them, so the result must lie between them.",
                "这把两个方差相加了；合并是取平均，结果必定介于两者之间。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Weight by degrees of freedom", "按自由度加权"],
                  t(
                    `The degrees of freedom are $${df1}$ and $${df2}$, so the numerator is $${df1} \\cdot ${s1Sq} + ${df2} \\cdot ${s2Sq} = ${num}$.`,
                    `自由度为 $${df1}$ 和 $${df2}$，所以分子为 $${df1} \\cdot ${s1Sq} + ${df2} \\cdot ${s2Sq} = ${num}$。`,
                  ),
                ],
                [
                  ["Divide by the total degrees of freedom", "除以总自由度"],
                  t(
                    `$s_p^2 = \\frac{${num}}{${df1} + ${df2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `$s_p^2 = \\frac{${num}}{${df1} + ${df2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              t(
                `As a weighted average of $${s1Sq}$ and $${s2Sq}$, the value $${ans.toLatex()}$ must lie between them${s1Sq === s2Sq ? ", and here both are equal" : ""}; it does.`,
                `作为 $${s1Sq}$ 与 $${s2Sq}$ 的加权平均，$${ans.toLatex()}$ 必定介于两者之间${s1Sq === s2Sq ? "，这里两者相等" : ""}；确实如此。`,
              ),
            ),
          });
        },
      },
      {
        id: "pooled-variance-from-raw-samples",
        title: t("Pooled variance from raw samples", "由原始样本求合并方差"),
        explanation: t(
          "From raw data, the pooled variance is the total of the squared deviations, each sample measured from **its own** mean, divided by the combined degrees of freedom:\n\n$$s_p^{2} = \\frac{\\sum_i (x_{1,i} - \\bar{x}_1)^{2} + \\sum_j (x_{2,j} - \\bar{x}_2)^{2}}{n_1 + n_2 - 2}.$$\n\nThis equals the weighted formula with $(n_1 - 1)s_1^{2}$ and $(n_2 - 1)s_2^{2}$, since each of those is a sum of squared deviations.\n\nFor the samples $3, 5, 7$ and $10, 10, 12, 12$: the means are $5$ and $11$, the squared deviations sum to $4 + 0 + 4 = 8$ and $1 + 1 + 1 + 1 = 4$, so $s_p^{2} = \\frac{8 + 4}{3 + 4 - 2} = \\frac{12}{5}$.\n\nCheck: from the weighted formula, $s_1^{2} = \\frac{8}{2} = 4$ and $s_2^{2} = \\frac{4}{3}$, and $\\frac{2 \\cdot 4 + 3 \\cdot \\frac{4}{3}}{5} = \\frac{12}{5}$ again.\n\n> **Watch out.** Measure each sample from its own mean, never from the mean of all seven values, and divide by $n_1 + n_2 - 2 = 5$, not by $7$: $\\frac{12}{7}$ is too small.",
          "由原始数据计算时，合并方差等于离差平方的总和（每个样本以**各自**的均值为基准），再除以合并后的自由度：\n\n$$s_p^{2} = \\frac{\\sum_i (x_{1,i} - \\bar{x}_1)^{2} + \\sum_j (x_{2,j} - \\bar{x}_2)^{2}}{n_1 + n_2 - 2}.$$\n\n这与用 $(n_1 - 1)s_1^{2}$ 和 $(n_2 - 1)s_2^{2}$ 的加权公式相同，因为它们各自就是离差平方和。\n\n例如样本 $3, 5, 7$ 和 $10, 10, 12, 12$：均值为 $5$ 和 $11$，离差平方和为 $4 + 0 + 4 = 8$ 和 $1 + 1 + 1 + 1 = 4$，所以 $s_p^{2} = \\frac{8 + 4}{3 + 4 - 2} = \\frac{12}{5}$。\n\n检验：用加权公式，$s_1^{2} = \\frac{8}{2} = 4$，$s_2^{2} = \\frac{4}{3}$，$\\frac{2 \\cdot 4 + 3 \\cdot \\frac{4}{3}}{5} = \\frac{12}{5}$，结果相同。\n\n> **注意。** 每个样本都以自己的均值为基准，而不是七个值的总均值；分母是 $n_1 + n_2 - 2 = 5$，不是 $7$：$\\frac{12}{7}$ 偏小。",
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
          const sq = (v: number) => (v < 0 ? `(${v})^{2}` : `${v}^{2}`);
          return numberProblem({
            prompt: t(
              `Two independent samples from populations with a common variance are: sample 1: $${xs.join(", ")}$; sample 2: $${ys.join(", ")}$. Find the pooled variance $s_p^{2}$.`,
              `来自方差相同总体的两个独立样本为：样本 1：$${xs.join(", ")}$；样本 2：$${ys.join(", ")}$。求合并方差 $s_p^{2}$。`,
            ),
            answer: ans,
            wrong: [Q.of(ss1 + ss2, df + 2), avg, Q.of(ss1 + ss2)].filter((w) => !w.eq(ans)),
            mistakes: apart(ans, [
              why(
                Q.of(ss1 + ss2, df + 2),
                `This divides by $n_1 + n_2 = ${df + 2}$; each sample mean uses up one degree of freedom, so the divisor is $${df}$.`,
                `这除以了 $n_1 + n_2 = ${df + 2}$；每个样本均值用掉一个自由度，分母应为 $${df}$。`,
              ),
              why(
                Q.of(ss1 + ss2),
                "This is the total of the squared deviations, not yet divided by the degrees of freedom.",
                "这是离差平方的总和，还没有除以自由度。",
              ),
              why(
                avg,
                "This averages the two sample variances equally; pooling weights each by its degrees of freedom.",
                "这把两个样本方差等权平均；合并时应按各自的自由度加权。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find each mean", "求各样本均值"],
                  t(
                    `The sample means are $\\bar{x}_1 = ${m1}$ and $\\bar{x}_2 = ${m2}$.`,
                    `两样本均值为 $\\bar{x}_1 = ${m1}$ 和 $\\bar{x}_2 = ${m2}$。`,
                  ),
                ],
                [
                  ["Sum the squared deviations", "求离差平方和"],
                  t(
                    `Sample 1 gives $${d1.map(sq).join(" + ")} = ${ss1}$ and sample 2 gives $${d2.map(sq).join(" + ")} = ${ss2}$.`,
                    `样本 1 得 $${d1.map(sq).join(" + ")} = ${ss1}$，样本 2 得 $${d2.map(sq).join(" + ")} = ${ss2}$。`,
                  ),
                ],
                [
                  ["Divide by the degrees of freedom", "除以自由度"],
                  t(
                    `$s_p^{2} = \\frac{${ss1} + ${ss2}}{${xs.length} + ${ys.length} - 2} = \\frac{${ss1 + ss2}}{${df}}${lowestTerms(ss1 + ss2, df)}$.`,
                    `$s_p^{2} = \\frac{${ss1} + ${ss2}}{${xs.length} + ${ys.length} - 2} = \\frac{${ss1 + ss2}}{${df}}${lowestTerms(ss1 + ss2, df)}$。`,
                  ),
                ],
              ],
              t(
                `The weighted formula agrees: $(n_1 - 1)s_1^{2} = ${ss1}$ and $(n_2 - 1)s_2^{2} = ${ss2}$ are exactly these sums of squared deviations, and the degrees of freedom are $${xs.length - 1} + ${ys.length - 1} = ${df}$.`,
                `加权公式给出同样结果：$(n_1 - 1)s_1^{2} = ${ss1}$ 与 $(n_2 - 1)s_2^{2} = ${ss2}$ 正是这两个离差平方和，自由度为 $${xs.length - 1} + ${ys.length - 1} = ${df}$。`,
              ),
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
    intro: t(
      "A population has standard deviation $\\sigma = 12$. For samples of $n = 36$, the sample mean has variance $\\frac{12^{2}}{36} = \\frac{144}{36} = 4$ and standard error $\\frac{12}{\\sqrt{36}} = \\frac{12}{6} = 2$.\n\nCheck: the standard error squared is the variance, $2^{2} = 4$.\n\nIn this lesson we find the variance and the standard error of a sample mean, and work backwards from a target standard error to the sample size that gives it.",
      "某总体的标准差为 $\\sigma = 12$。容量 $n = 36$ 的样本，其样本均值的方差为 $\\frac{12^{2}}{36} = \\frac{144}{36} = 4$，标准误为 $\\frac{12}{\\sqrt{36}} = \\frac{12}{6} = 2$。\n\n检验：标准误的平方就是方差，$2^{2} = 4$。\n\n本课我们求样本均值的方差和标准误，并由目标标准误反推所需的样本量。",
    ),
    prerequisites: ["the-sample-variance"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "standard-error-of-the-mean",
        title: t("Evaluating the standard error of the sample mean", "计算样本均值的标准误差"),
        explanation: t(
          "The standard error measures how much the sample mean typically varies, and quadrupling the sample size only halves it. $SE(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}$ decreases in inverse proportion to the square root of the sample size.\n\nWith $\\sigma = 30$ and $n = 25$: $SE(\\bar{X}) = \\frac{30}{\\sqrt{25}} = \\frac{30}{5} = 6$.\n\nCheck: the variance of $\\bar{X}$ is $\\frac{30^{2}}{25} = 36$, and $\\sqrt{36} = 6$.\n\n> **Watch out.** Divide by $\\sqrt{n} = 5$, not by $n = 25$: $\\frac{30}{25} = \\frac{6}{5}$ is far too small. And $\\frac{\\sigma^{2}}{n} = 36$ is the variance, not the standard error.",
          "标准误衡量样本均值通常的波动程度，把样本量增加到四倍只能使它减半。$SE(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}$ 与样本容量的平方根成反比。\n\n若 $\\sigma = 30$，$n = 25$：$SE(\\bar{X}) = \\frac{30}{\\sqrt{25}} = \\frac{30}{5} = 6$。\n\n检验：$\\bar{X}$ 的方差为 $\\frac{30^{2}}{25} = 36$，$\\sqrt{36} = 6$。\n\n> **注意。** 要除以 $\\sqrt{n} = 5$，不是 $n = 25$：$\\frac{30}{25} = \\frac{6}{5}$ 太小了。而 $\\frac{\\sigma^{2}}{n} = 36$ 是方差，不是标准误。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 12);
          const sigma = rng.int(10, 60);
          const n = k * k; // perfect square
          const ans = Q.of(sigma, k);

          return numberProblem({
            prompt: t(
              `A sample of size $n = ${n}$ is randomly selected from a population with standard deviation $\\sigma = ${sigma}$. Find the standard error of the sample mean.`,
              `从标准差为 $\\sigma = ${sigma}$ 的总体中随机抽取容量为 $n = ${n}$ 的样本。求样本均值的标准误差。`,
            ),
            answer: ans,
            wrong: [Q.of(sigma, n), sigma * k, Q.of(sigma * sigma, n)],
            mistakes: apart(ans, [
              why(
                Q.of(sigma, n),
                `This divides by $n = ${n}$; the standard error divides by $\\sqrt{n} = ${k}$.`,
                `这除以了 $n = ${n}$；标准误应除以 $\\sqrt{n} = ${k}$。`,
              ),
              why(
                sigma * k,
                `This multiplies by $\\sqrt{n}$; a larger sample makes the mean less variable, so divide by $${k}$.`,
                `这乘以了 $\\sqrt{n}$；样本越大，均值越稳定，应除以 $${k}$。`,
              ),
              why(
                Q.of(sigma * sigma, n),
                "This is the variance $\\frac{\\sigma^{2}}{n}$ of the sample mean; the standard error is its square root.",
                "这是样本均值的方差 $\\frac{\\sigma^{2}}{n}$；标准误是它的平方根。",
              ),
            ]),
            solution: walked(
              [
                [["Take the square root of n", "求 n 的平方根"], t(`$\\sqrt{${n}} = ${k}$.`, `$\\sqrt{${n}} = ${k}$。`)],
                [
                  ["Divide", "相除"],
                  t(
                    `$\\text{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{${k}}${lowestTerms(sigma, k)}$.`,
                    `$\\text{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{${k}}${lowestTerms(sigma, k)}$。`,
                  ),
                ],
              ],
              t(
                `Squaring gives $${ans.mul(ans).toLatex()}$, which equals the variance $\\frac{${sigma}^{2}}{${n}} = \\frac{${sigma * sigma}}{${n}}$.`,
                `平方得 $${ans.mul(ans).toLatex()}$，等于方差 $\\frac{${sigma}^{2}}{${n}} = \\frac{${sigma * sigma}}{${n}}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-sample-size-for-a-target-standard-error",
        title: t("The sample size for a target standard error", "达到目标标准误所需的样本容量"),
        explanation: t(
          "Solving $\\frac{\\sigma}{\\sqrt{n}} = \\text{SE}$ for $n$ gives\n\n$$n = \\left(\\frac{\\sigma}{\\text{SE}}\\right)^{2}.$$\n\nBecause $n$ sits under a square root, halving the standard error needs **four** times as many observations, and dividing it by $3$ needs nine times as many. Precision is expensive.\n\nWith $\\sigma = 4.5$ and a target standard error of $0.5$: $\\frac{4.5}{0.5} = 9$, so $n = 9^{2} = 81$.\n\nCheck: $\\frac{4.5}{\\sqrt{81}} = \\frac{4.5}{9} = 0.5$, the target.\n\n> **Watch out.** The ratio $\\frac{\\sigma}{\\text{SE}} = 9$ is $\\sqrt{n}$, not $n$: a sample of $9$ gives a standard error of $1.5$, three times the target.",
          "由 $\\frac{\\sigma}{\\sqrt{n}} = \\text{SE}$ 解出 $n$：\n\n$$n = \\left(\\frac{\\sigma}{\\text{SE}}\\right)^{2}.$$\n\n由于 $n$ 在平方根之下，标准误减半需要**四倍**的观测，缩小为三分之一需要九倍。精度代价高昂。\n\n若 $\\sigma = 4.5$，目标标准误为 $0.5$：$\\frac{4.5}{0.5} = 9$，所以 $n = 9^{2} = 81$。\n\n检验：$\\frac{4.5}{\\sqrt{81}} = \\frac{4.5}{9} = 0.5$，正是目标。\n\n> **注意。** 比值 $\\frac{\\sigma}{\\text{SE}} = 9$ 是 $\\sqrt{n}$，不是 $n$：容量为 $9$ 的样本标准误为 $1.5$，是目标的三倍。",
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
            mistakes: apart(k * k, [
              why(
                k,
                `This stops at $\\frac{\\sigma}{\\text{SE}} = ${k}$, which is $\\sqrt{n}$; square it to get $n$.`,
                `这停在 $\\frac{\\sigma}{\\text{SE}} = ${k}$，它是 $\\sqrt{n}$；平方后才是 $n$。`,
              ),
              why(2 * k, `This doubles the ratio $${k}$ instead of squaring it.`, `这把比值 $${k}$ 乘以 $2$，而不是平方。`),
            ]),
            solution: walked(
              [
                [
                  ["Find the square root of n", "求 n 的平方根"],
                  t(
                    `From $\\frac{\\sigma}{\\sqrt{n}} = \\text{SE}$, $\\sqrt{n} = ${dec(sigma)} \\div ${dec(se)} = ${k}$.`,
                    `由 $\\frac{\\sigma}{\\sqrt{n}} = \\text{SE}$ 得 $\\sqrt{n} = ${dec(sigma)} \\div ${dec(se)} = ${k}$。`,
                  ),
                ],
                [["Square", "平方"], t(`$n = ${k}^{2} = ${k * k}$.`, `$n = ${k}^{2} = ${k * k}$。`)],
              ],
              t(
                `With $n = ${k * k}$, $\\frac{${dec(sigma)}}{\\sqrt{${k * k}}} = ${dec(sigma)} \\div ${k} = ${dec(se)}$, the target standard error.`,
                `取 $n = ${k * k}$，$\\frac{${dec(sigma)}}{\\sqrt{${k * k}}} = ${dec(sigma)} \\div ${k} = ${dec(se)}$，正是目标标准误。`,
              ),
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
    intro: t(
      "Samples of $n = 25$ are drawn from $N(50, 100)$. The sample mean is exactly $N\\left(50, \\frac{100}{25}\\right) = N(50, 4)$, with standard error $2$, so $P(\\bar{X} > 54) = 1 - \\Phi\\left(\\frac{54 - 50}{2}\\right) = 1 - \\Phi(2) = 1 - 0.9772 = 0.0228$.\n\nCheck: $54$ is $2$ standard errors above $50$, since $50 + 2 \\cdot 2 = 54$, and a normal variable is more than $2$ standard deviations above its mean about $2\\%$ of the time.\n\nIn this lesson we use the exact normal distribution of the mean of a normal sample, and find probabilities for the sample mean by standardizing with the standard error.",
      "从 $N(50, 100)$ 中抽取容量 $n = 25$ 的样本。样本均值恰好服从 $N\\left(50, \\frac{100}{25}\\right) = N(50, 4)$，标准误为 $2$，所以 $P(\\bar{X} > 54) = 1 - \\Phi\\left(\\frac{54 - 50}{2}\\right) = 1 - \\Phi(2) = 1 - 0.9772 = 0.0228$。\n\n检验：$54$ 比 $50$ 高 $2$ 个标准误，因为 $50 + 2 \\cdot 2 = 54$；正态变量比均值高出 $2$ 个标准差以上的概率约为 $2\\%$。\n\n本课我们利用正态样本均值的精确正态分布，并用标准误标准化来求样本均值的概率。",
    ),
    prerequisites: ["variance-of-sample-means", "the-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "exact-normality-of-sample-mean",
        title: t("Exact normality of $\\bar{X}$ from normal populations", "正态总体下样本均值的严格正态性"),
        explanation: t(
          "When the population itself is normal, the sample mean is exactly normal for every sample size, not only approximately for large samples. For a normal population and any $n \\ge 1$, $\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$ holds exactly, without requiring a large $n$.\n\nFor samples of $n = 9$ from $N(100, 36)$: $\\bar{X} \\sim N\\left(100, \\frac{36}{9}\\right) = N(100, 4)$.\n\nCheck: the standard deviation of the mean is $\\frac{6}{\\sqrt{9}} = 2$, and $2^{2} = 4$ is the variance in $N(100, 4)$.\n\n> **Watch out.** The second parameter of $N$ is a variance, so divide $\\sigma^{2} = 36$ by $n$, giving $4$; dividing the standard deviation, $\\frac{6}{9}$, or keeping $36$ unchanged are both wrong. And the result is exact here, even though $9$ is a small sample.",
          "当总体本身是正态分布时，样本均值对任何样本量都恰好服从正态分布，而不仅仅在大样本时近似成立。对正态总体与任意样本容量 $n \\ge 1$，$\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$ 均精确成立，无需大样本条件。\n\n从 $N(100, 36)$ 中抽取容量 $n = 9$ 的样本：$\\bar{X} \\sim N\\left(100, \\frac{36}{9}\\right) = N(100, 4)$。\n\n检验：均值的标准差为 $\\frac{6}{\\sqrt{9}} = 2$，$2^{2} = 4$ 正是 $N(100, 4)$ 中的方差。\n\n> **注意。** $N$ 的第二个参数是方差，所以用 $\\sigma^{2} = 36$ 除以 $n$ 得 $4$；用标准差去除得 $\\frac{6}{9}$，或保持 $36$ 不变，都是错的。并且这里的结论是精确的，尽管 $9$ 是小样本。",
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
              solution: walked(
                [
                  [
                    ["Name the family", "确定分布族"],
                    t(
                      "The mean is a linear combination of independent normal variables, so it is exactly normal for any sample size.",
                      "样本均值是独立正态变量的线性组合，所以对任何样本量都恰好服从正态分布。",
                    ),
                  ],
                  [
                    ["Find the parameters", "求参数"],
                    t(
                      `Its mean is $\\mu = ${mu}$ and its variance is $\\frac{\\sigma^2}{n} = \\frac{${sigmaSq}}{${n}}$, so $\\bar{X} \\sim N\\left(${mu}, \\frac{${sigmaSq}}{${n}}\\right)$.`,
                      `其均值为 $\\mu = ${mu}$，方差为 $\\frac{\\sigma^2}{n} = \\frac{${sigmaSq}}{${n}}$，所以 $\\bar{X} \\sim N\\left(${mu}, \\frac{${sigmaSq}}{${n}}\\right)$。`,
                    ),
                  ],
                ],
                t(
                  `The variance $\\frac{${sigmaSq}}{${n}}$ is smaller than $${sigmaSq}$, as it must be: a mean of $${n}$ values varies less than one value.`,
                  `方差 $\\frac{${sigmaSq}}{${n}}$ 小于 $${sigmaSq}$，这是必然的：$${n}$ 个值的均值比单个值波动小。`,
                ),
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
          "Since $\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^{2}}{n}\\right)$, standardize with the **standard error**, not with $\\sigma$:\n\n$$P(\\bar{X} > c) = 1 - \\Phi\\left(\\frac{c - \\mu}{\\sigma/\\sqrt{n}}\\right).$$\n\nA value that is unremarkable for a single observation can be very unlikely for a mean: with $\\mu = 50$, $\\sigma = 10$, $P(X > 55) \\approx 0.31$, but for $n = 16$, $P(\\bar{X} > 55) = 1 - \\Phi(2) \\approx 0.023$.\n\nCheck: the standard error is $\\frac{10}{\\sqrt{16}} = 2.5$, and $\\frac{55 - 50}{2.5} = 2$, so $55$ is $2$ standard errors above the mean.\n\n> **Watch out.** Standardizing with $\\sigma = 10$ gives $z = 0.5$ and $0.31$, the answer for a single observation. And for $P(\\bar{X} > c)$ take $1 - \\Phi(z)$, not $\\Phi(z)$, which is the other tail.",
          "由于 $\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^{2}}{n}\\right)$，要用**标准误**而不是 $\\sigma$ 来标准化：\n\n$$P(\\bar{X} > c) = 1 - \\Phi\\left(\\frac{c - \\mu}{\\sigma/\\sqrt{n}}\\right).$$\n\n对单个观测来说平常的值，对均值而言可能极不寻常：$\\mu = 50$，$\\sigma = 10$ 时 $P(X > 55) \\approx 0.31$，但 $n = 16$ 时 $P(\\bar{X} > 55) = 1 - \\Phi(2) \\approx 0.023$。\n\n检验：标准误为 $\\frac{10}{\\sqrt{16}} = 2.5$，$\\frac{55 - 50}{2.5} = 2$，所以 $55$ 比均值高 $2$ 个标准误。\n\n> **注意。** 用 $\\sigma = 10$ 标准化得 $z = 0.5$ 和 $0.31$，那是单个观测的答案。并且 $P(\\bar{X} > c)$ 要取 $1 - \\Phi(z)$，而不是另一侧的 $\\Phi(z)$。",
        ),
        generate: (rng: Rng): Problem => {
          const zv = rng.pick([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5]);
          const k = rng.int(2, 8);
          const se = rng.int(1, 5);
          const mu = rng.int(20, 150);
          const c = Q.of(mu).add(Q.parse(String(zv)).mul(Q.of(se)));
          const above = rng.bool();
          const ans = above ? Q.one.sub(phi(zv)) : phi(zv);
          const tail = ans.cmp(Q.of(1, 2)) < 0 ? ans : Q.one.sub(ans);
          const zLine = se === 1 ? `z = ${dec(c)} - ${mu} = ${zv}` : `z = \\frac{${dec(c)} - ${mu}}{${se}} = ${zv}`;
          return numberProblem({
            prompt: t(
              `A random sample of $n = ${k * k}$ is taken from $N(${mu}, ${(se * k) ** 2})$. Find $P(\\bar{X} ${above ? ">" : "<"} ${dec(c)})$. Use ${PHI_TABLE.en}.`,
              `从 $N(${mu}, ${(se * k) ** 2})$ 中抽取容量 $n = ${k * k}$ 的随机样本。求 $P(\\bar{X} ${above ? ">" : "<"} ${dec(c)})$。利用${PHI_TABLE["zh-CN"]}。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [Q.one.sub(ans), Q.of(2).mul(tail)].filter((w) => !w.eq(ans)),
            mistakes: apart(ans, [
              why(
                Q.one.sub(ans),
                `This is the other tail; $P(\\bar{X} ${above ? ">" : "<"} c)$ is $${above ? "1 - \\Phi(z)" : "\\Phi(z)"}$.`,
                `这是另一侧的尾部；$P(\\bar{X} ${above ? ">" : "<"} c)$ 是 $${above ? "1 - \\Phi(z)" : "\\Phi(z)"}$。`,
              ),
              why(
                Q.of(2).mul(tail),
                "This doubles the tail, as for a two-sided probability; only one side is asked for.",
                "这把尾部概率加倍，像双侧概率那样；题目只问一侧。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `$\\sigma = \\sqrt{${(se * k) ** 2}} = ${se * k}$ and $\\sqrt{n} = ${k}$, so the standard error is $${se * k} \\div ${k} = ${se}$.`,
                    `$\\sigma = \\sqrt{${(se * k) ** 2}} = ${se * k}$，$\\sqrt{n} = ${k}$，所以标准误为 $${se * k} \\div ${k} = ${se}$。`,
                  ),
                ],
                [["Standardize", "标准化"], t(`$${zLine}$.`, `$${zLine}$。`)],
                [
                  ["Read the table", "查表"],
                  t(
                    `$P = ${above ? `1 - \\Phi(${zv})` : `\\Phi(${zv})`} = ${dec(ans)}$${zv < 0 ? `, using $\\Phi(${zv}) = 1 - \\Phi(${-zv})$` : ""}.`,
                    `$P = ${above ? `1 - \\Phi(${zv})` : `\\Phi(${zv})`} = ${dec(ans)}$${zv < 0 ? `，其中 $\\Phi(${zv}) = 1 - \\Phi(${-zv})$` : ""}。`,
                  ),
                ],
              ],
              t(
                `$${dec(c)}$ is ${zv > 0 ? "above" : "below"} the mean $${mu}$, so $P(\\bar{X} ${above ? ">" : "<"} ${dec(c)})$ should be ${(zv > 0) === above ? "less" : "more"} than $\\frac{1}{2}$; $${dec(ans)}$ is.`,
                `$${dec(c)}$ 在均值 $${mu}$ 的${zv > 0 ? "上方" : "下方"}，所以 $P(\\bar{X} ${above ? ">" : "<"} ${dec(c)})$ 应${(zv > 0) === above ? "小于" : "大于"} $\\frac{1}{2}$；$${dec(ans)}$ 正是如此。`,
              ),
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
    intro: t(
      "A population of $N = 21$ has a proportion $p = 0.4$ of successes, and $n = 5$ are drawn without replacement. Then $E[\\hat{p}] = 0.4$, and $\\operatorname{Var}(\\hat{p}) = \\frac{0.4 \\cdot 0.6}{5} \\cdot \\frac{21 - 5}{21 - 1} = 0.048 \\cdot 0.8 = 0.0384$.\n\nCheck: the factor $\\frac{16}{20} = 0.8$ is less than $1$, so the variance is below the with-replacement value $0.048$, as drawing without replacement should make it.\n\nIn this lesson we find the expected value of a sample proportion and its variance when a finite population is sampled without replacement.",
      "容量 $N = 21$ 的总体中成功的比例为 $p = 0.4$，不放回地抽取 $n = 5$ 个。则 $E[\\hat{p}] = 0.4$，$\\operatorname{Var}(\\hat{p}) = \\frac{0.4 \\cdot 0.6}{5} \\cdot \\frac{21 - 5}{21 - 1} = 0.048 \\cdot 0.8 = 0.0384$。\n\n检验：因子 $\\frac{16}{20} = 0.8$ 小于 $1$，所以方差低于有放回时的 $0.048$，不放回抽样理应如此。\n\n本课我们求不放回地从有限总体抽样时样本比例的期望和方差。",
    ),
    prerequisites: ["sampling-distributions", "the-binomial-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "sample-proportion-unbiasedness",
        title: t("Expectation of sample proportion estimator", "样本比例估计量的数学期望"),
        explanation: t(
          "Each sampled item is equally likely to be any member of the population, so on average the sample proportion equals the population proportion. The estimate is unbiased, $E[\\hat{p}] = p$, whatever the population size $N$.\n\nIn a population of $N = 1000$ with $p = 0.3$, a sample of $n = 50$ has $E[\\hat{p}] = 0.3$.\n\nCheck: the expected number of successes is $E[X] = np = 50 \\cdot 0.3 = 15$, and $\\frac{15}{50} = 0.3$.\n\n> **Watch out.** Neither $n$ nor $N$ changes the expected value: the sampling fraction $\\frac{50}{1000} = 0.05$ and $\\frac{np}{N} = 0.015$ are not $E[\\hat{p}]$. The sizes only affect the spread.",
          "每个抽到的个体都同样可能是总体中的任何成员，所以平均来说样本比例等于总体比例。无论总体容量 $N$ 为何值，样本比例均满足无偏性 $E[\\hat{p}] = p$。\n\n在 $N = 1000$、$p = 0.3$ 的总体中，容量 $n = 50$ 的样本有 $E[\\hat{p}] = 0.3$。\n\n检验：成功次数的期望为 $E[X] = np = 50 \\cdot 0.3 = 15$，$\\frac{15}{50} = 0.3$。\n\n> **注意。** $n$ 和 $N$ 都不改变期望：抽样比 $\\frac{50}{1000} = 0.05$ 和 $\\frac{np}{N} = 0.015$ 都不是 $E[\\hat{p}]$。样本量只影响离散程度。",
        ),
        generate: (rng: Rng): Problem => {
          const num = rng.int(1, 9);
          const den = 10;
          const n = rng.int(20, 100);
          const popSize = rng.int(500, 2000);
          const ans = Q.of(num, den);

          return numberProblem({
            prompt: t(
              `In a finite population of size $N = ${popSize}$, the true population proportion of voters supporting a policy is $p = \\frac{${num}}{${den}}$. A random sample of size $n = ${n}$ is selected without replacement. Find the expected value of the sample proportion $E[\\hat{p}]$.`,
              `在容量为 $N = ${popSize}$ 的有限总体中，支持某项政策的真实总体选民比例为 $p = \\frac{${num}}{${den}}$。现不放回抽取容量为 $n = ${n}$ 的随机样本。求样本比例的数学期望 $E[\\hat{p}]$。`,
            ),
            answer: ans,
            wrong: [Q.of(num * n, den * popSize), Q.of(n, popSize), Q.of(den - num, den)],
            mistakes: apart(ans, [
              why(
                Q.of(num * n, den * popSize),
                "This divides the expected count $np$ by $N$; the sample proportion divides the count by $n$.",
                "这用 $N$ 去除期望计数 $np$；样本比例是计数除以 $n$。",
              ),
              why(
                Q.of(n, popSize),
                "This is the sampling fraction $\\frac{n}{N}$, which says how much of the population is sampled, not the share of successes.",
                "这是抽样比 $\\frac{n}{N}$，表示抽取了总体的多少，而不是成功的比例。",
              ),
              why(Q.of(den - num, den), "This is $1 - p$, the expected share of failures.", "这是 $1 - p$，即失败的期望比例。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the expected count", "求期望计数"],
                  t(
                    `Each of the $${n}$ draws is a success with probability $p$, so $E[X] = np = ${n} \\cdot \\frac{${num}}{${den}} = ${Q.of(num * n, den).toLatex()}$.`,
                    `$${n}$ 次抽取中每次成功的概率都是 $p$，所以 $E[X] = np = ${n} \\cdot \\frac{${num}}{${den}} = ${Q.of(num * n, den).toLatex()}$。`,
                  ),
                ],
                [
                  ["Divide by n", "除以 n"],
                  t(
                    `$E[\\hat{p}] = \\frac{E[X]}{n} = p = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `$E[\\hat{p}] = \\frac{E[X]}{n} = p = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              t(
                `Neither $n = ${n}$ nor $N = ${popSize}$ is left in the answer, as unbiasedness requires: $E[\\hat{p}] = p$ for every sample size.`,
                `答案中既没有 $n = ${n}$ 也没有 $N = ${popSize}$，这正是无偏性的要求：对任何样本量都有 $E[\\hat{p}] = p$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-variance-of-a-sample-proportion-without-replacement",
        title: t("The variance of a sample proportion without replacement", "不放回抽样时样本比例的方差"),
        explanation: t(
          "Without replacement, successive draws are slightly negatively correlated, and the variance of $\\hat{p}$ shrinks by the finite population factor:\n\n$$\\operatorname{Var}(\\hat{p}) = \\frac{p(1 - p)}{n} \\cdot \\frac{N - n}{N - 1}.$$\n\nIf the whole population is sampled, $n = N$ and the variance is $0$: the sample proportion is then the population proportion.\n\nWith $N = 11$, $n = 3$ and $p = 0.5$: $\\frac{0.25}{3} = \\frac{1}{12}$ and $\\frac{11 - 3}{11 - 1} = \\frac{4}{5}$, so $\\operatorname{Var}(\\hat{p}) = \\frac{1}{12} \\cdot \\frac{4}{5} = \\frac{1}{15}$.\n\nCheck: $\\frac{1}{15}$ is less than the with-replacement value $\\frac{1}{12}$, and putting $n = N = 11$ in the factor would give $0$.\n\n> **Watch out.** The factor's denominator is $N - 1 = 10$, not $N = 11$: $\\frac{8}{11} \\cdot \\frac{1}{12} = \\frac{2}{33}$ is slightly too small. And do not forget the division by $n$ in $\\frac{p(1 - p)}{n}$.",
          "不放回抽样时，相继的抽取略呈负相关，$\\hat{p}$ 的方差要乘以有限总体因子而缩小：\n\n$$\\operatorname{Var}(\\hat{p}) = \\frac{p(1 - p)}{n} \\cdot \\frac{N - n}{N - 1}.$$\n\n若抽取整个总体，$n = N$，方差为 $0$：此时样本比例就是总体比例。\n\n若 $N = 11$，$n = 3$，$p = 0.5$：$\\frac{0.25}{3} = \\frac{1}{12}$，$\\frac{11 - 3}{11 - 1} = \\frac{4}{5}$，所以 $\\operatorname{Var}(\\hat{p}) = \\frac{1}{12} \\cdot \\frac{4}{5} = \\frac{1}{15}$。\n\n检验：$\\frac{1}{15}$ 小于有放回时的 $\\frac{1}{12}$；若在因子中代入 $n = N = 11$，结果为 $0$。\n\n> **注意。** 因子的分母是 $N - 1 = 10$，不是 $N = 11$：$\\frac{8}{11} \\cdot \\frac{1}{12} = \\frac{2}{33}$ 略小。也不要忘记 $\\frac{p(1 - p)}{n}$ 中除以 $n$。",
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
            mistakes: apart(ans, [
              why(
                base,
                "This is the variance with replacement; drawing without replacement multiplies it by $\\frac{N - n}{N - 1}$.",
                "这是有放回时的方差；不放回抽样还要乘以 $\\frac{N - n}{N - 1}$。",
              ),
              why(
                base.mul(Q.of(N - n, N)),
                `This uses $\\frac{N - n}{N}$; the factor's denominator is $N - 1 = ${N - 1}$.`,
                `这用了 $\\frac{N - n}{N}$；因子的分母应为 $N - 1 = ${N - 1}$。`,
              ),
              why(
                p.mul(Q.one.sub(p)).mul(fpc),
                `This forgets to divide $p(1 - p)$ by $n = ${n}$.`,
                `这忘了用 $n = ${n}$ 去除 $p(1 - p)$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["The with-replacement variance", "有放回时的方差"],
                  t(
                    `$\\frac{p(1 - p)}{n} = \\frac{${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${n}} = ${base.toLatex()}$.`,
                    `$\\frac{p(1 - p)}{n} = \\frac{${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${n}} = ${base.toLatex()}$。`,
                  ),
                ],
                [
                  ["Apply the correction", "乘以修正因子"],
                  t(
                    `$\\frac{N - n}{N - 1} = \\frac{${N - n}}{${N - 1}}${lowestTerms(N - n, N - 1)}$, so $\\operatorname{Var}(\\hat{p}) = ${base.toLatex()} \\cdot ${fpc.toLatex()} = ${ans.toLatex()}$.`,
                    `$\\frac{N - n}{N - 1} = \\frac{${N - n}}{${N - 1}}${lowestTerms(N - n, N - 1)}$，所以 $\\operatorname{Var}(\\hat{p}) = ${base.toLatex()} \\cdot ${fpc.toLatex()} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `Since $n = ${n}$ is less than $N = ${N}$, the factor $${fpc.toLatex()}$ lies between $0$ and $1$, so the answer $${ans.toLatex()}$ is below the with-replacement value $${base.toLatex()}$.`,
                `由于 $n = ${n}$ 小于 $N = ${N}$，因子 $${fpc.toLatex()}$ 介于 $0$ 与 $1$ 之间，所以答案 $${ans.toLatex()}$ 低于有放回时的 $${base.toLatex()}$。`,
              ),
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
    intro: t(
      "Counts of $3$, $5$ and $4$ come from a Poisson distribution, whose mean is $\\lambda$. The sample mean is $\\frac{3 + 5 + 4}{3} = 4$, and setting $E[X] = \\lambda$ equal to it gives the estimate $\\hat{\\lambda} = 4$.\n\nCheck: a Poisson distribution with $\\lambda = 4$ has mean $4$, the same as the sample, which is exactly what the method asks for.\n\nIn this lesson we estimate a parameter by setting the mean of the model equal to the sample mean, for the Poisson, geometric and other one-parameter models.",
      "计数 $3$、$5$、$4$ 来自泊松分布，其均值为 $\\lambda$。样本均值为 $\\frac{3 + 5 + 4}{3} = 4$，令 $E[X] = \\lambda$ 等于它，得估计 $\\hat{\\lambda} = 4$。\n\n检验：$\\lambda = 4$ 的泊松分布均值为 $4$，与样本相同，这正是矩估计法的要求。\n\n本课我们令模型的均值等于样本均值来估计参数，用于泊松、几何等单参数模型。",
    ),
    prerequisites: ["sampling-distributions", "moments-of-discrete-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "method-of-moments-poisson-or-exp",
        title: t("Estimating parameter using the first sample moment", "利用一阶样本矩估计未知参数"),
        explanation: t(
          "The method of moments sets the sample mean equal to the theoretical mean and solves for the parameter. For $X \\sim \\text{Poisson}(\\lambda)$, $E[X] = \\lambda$, so the method of moments estimator is $\\hat{\\lambda} = \\bar{x}$.\n\nFor $n = 20$ counts with sum $70$: $\\bar{x} = \\frac{70}{20} = 3.5$, so $\\hat{\\lambda} = 3.5$.\n\nCheck: $20$ counts averaging $3.5$ add up to $20 \\cdot 3.5 = 70$, the given sum.\n\n> **Watch out.** The sample mean divides by $n = 20$, not by $n - 1 = 19$; and since $E[X] = \\lambda$ itself, the estimate is $\\bar{x}$, not its reciprocal $\\frac{20}{70}$.",
          "矩估计法令样本均值等于理论均值，再解出参数。对于 $X \\sim \\text{Poisson}(\\lambda)$，$E[X] = \\lambda$，故矩估计量为 $\\hat{\\lambda} = \\bar{x}$。\n\n若 $n = 20$ 个计数之和为 $70$：$\\bar{x} = \\frac{70}{20} = 3.5$，所以 $\\hat{\\lambda} = 3.5$。\n\n检验：$20$ 个平均为 $3.5$ 的计数之和为 $20 \\cdot 3.5 = 70$，正是给出的总和。\n\n> **注意。** 样本均值除以 $n = 20$，不是 $n - 1 = 19$；并且因为 $E[X]$ 就是 $\\lambda$，估计是 $\\bar{x}$ 本身，而不是其倒数 $\\frac{20}{70}$。",
        ),
        generate: (rng: Rng): Problem => {
          const sum = rng.int(40, 200);
          const n = rng.int(10, 50);
          const ans = Q.of(sum, n);

          return numberProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ from a Poisson distribution $\\text{Poisson}(\\lambda)$ has sample sum $\\sum_{i=1}^{${n}} x_i = ${sum}$. Find the method-of-moments estimate $\\hat{\\lambda}$.`,
              `从泊松分布 $\\text{Poisson}(\\lambda)$ 中抽取容量为 $n = ${n}$ 的随机样本，其观测值总和为 $\\sum_{i=1}^{${n}} x_i = ${sum}$。求比率参数 $\\lambda$ 的矩估计值 $\\hat{\\lambda}$。`,
            ),
            answer: ans,
            wrong: [Q.of(n, sum), Q.of(sum, n - 1), sum],
            mistakes: apart(ans, [
              why(
                Q.of(n, sum),
                "This is the reciprocal of the sample mean; the Poisson mean is $\\lambda$ itself, so $\\hat{\\lambda} = \\bar{x}$.",
                "这是样本均值的倒数；泊松分布的均值就是 $\\lambda$，所以 $\\hat{\\lambda} = \\bar{x}$。",
              ),
              why(
                Q.of(sum, n - 1),
                `This divides by $n - 1 = ${n - 1}$; the first sample moment divides by $n = ${n}$.`,
                `这除以了 $n - 1 = ${n - 1}$；一阶样本矩应除以 $n = ${n}$。`,
              ),
              why(sum, "This is the sum of the sample, not its mean.", "这是样本总和，不是样本均值。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the sample mean", "求样本均值"],
                  t(
                    `$\\bar{x} = \\frac{\\sum x_i}{n} = \\frac{${sum}}{${n}}${lowestTerms(sum, n)}$.`,
                    `$\\bar{x} = \\frac{\\sum x_i}{n} = \\frac{${sum}}{${n}}${lowestTerms(sum, n)}$。`,
                  ),
                ],
                [
                  ["Match the first moment", "令一阶矩相等"],
                  t(
                    `Setting $E[X] = \\lambda$ equal to $\\bar{x}$ gives $\\hat{\\lambda} = ${ans.toLatex()}$.`,
                    `令 $E[X] = \\lambda$ 等于 $\\bar{x}$，得 $\\hat{\\lambda} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$${n}$ values with mean $${ans.toLatex()}$ add up to $${n} \\cdot ${ans.toLatex()} = ${sum}$, the given sum.`,
                `$${n}$ 个均值为 $${ans.toLatex()}$ 的值之和为 $${n} \\cdot ${ans.toLatex()} = ${sum}$，正是给出的总和。`,
              ),
            ),
          });
        },
      },
      {
        id: "method-of-moments-for-the-geometric-distribution",
        title: t("The method of moments for the geometric distribution", "几何分布的矩估计"),
        explanation: t(
          "If $X$ counts the trials up to and including the first success, $E[X] = \\frac{1}{p}$. Setting this equal to the sample mean and solving gives\n\n$$\\hat{p} = \\frac{1}{\\bar{x}} = \\frac{n}{\\sum x_i}.$$\n\nA long average wait means a small success probability. If $8$ customers needed $40$ calls in total to make a sale, $\\bar{x} = 5$ and $\\hat{p} = 0.2$.\n\nCheck: with $p = 0.2$ the expected wait is $\\frac{1}{0.2} = 5$ calls, the sample mean.\n\n> **Watch out.** The estimate is $\\frac{1}{\\bar{x}} = 0.2$, not $\\bar{x} = 5$, which is not even a probability. And $\\frac{8}{40 - 8} = 0.25$ counts only the failures in the denominator; here each count includes the success.",
          "若 $X$ 表示直到首次成功（含该次）所需的试验次数，则 $E[X] = \\frac{1}{p}$。令它等于样本均值并求解：\n\n$$\\hat{p} = \\frac{1}{\\bar{x}} = \\frac{n}{\\sum x_i}.$$\n\n平均等待越长，成功概率越小。若 $8$ 名推销员总共打了 $40$ 次电话才各成交一次，$\\bar{x} = 5$，$\\hat{p} = 0.2$。\n\n检验：$p = 0.2$ 时期望等待 $\\frac{1}{0.2} = 5$ 次电话，正是样本均值。\n\n> **注意。** 估计是 $\\frac{1}{\\bar{x}} = 0.2$，不是 $\\bar{x} = 5$，后者甚至不是概率。而 $\\frac{8}{40 - 8} = 0.25$ 的分母只算了失败次数；这里每个计数都包含那次成功。",
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
            mistakes: apart(ans, [
              why(
                Q.of(sum, n),
                "This is the sample mean $\\bar{x}$; the estimate of $p$ is its reciprocal.",
                "这是样本均值 $\\bar{x}$；$p$ 的估计是它的倒数。",
              ),
              why(
                Q.of(n, sum - n),
                "This divides by the failures only; each recorded count includes its success, so divide by the total $\\sum x_i$.",
                "这只除以失败次数；每个记录的次数都包含那次成功，应除以总和 $\\sum x_i$。",
              ),
              why(
                Q.one.sub(ans),
                "This is $1 - \\hat{p}$, the estimated probability of a failure.",
                "这是 $1 - \\hat{p}$，即失败概率的估计。",
              ),
            ]),
            solution: walked(
              [
                [["Find the sample mean", "求样本均值"], t(`$\\bar{x} = \\frac{${sum}}{${n}}$.`, `$\\bar{x} = \\frac{${sum}}{${n}}$。`)],
                [
                  ["Match the first moment", "令一阶矩相等"],
                  t(
                    `$\\frac{1}{\\hat{p}} = \\bar{x}$ gives $\\hat{p} = \\frac{${n}}{${sum}}${lowestTerms(n, sum)}$.`,
                    `由 $\\frac{1}{\\hat{p}} = \\bar{x}$ 得 $\\hat{p} = \\frac{${n}}{${sum}}${lowestTerms(n, sum)}$。`,
                  ),
                ],
              ],
              t(
                `With $p = ${ans.toLatex()}$, the expected wait $\\frac{1}{p} = \\frac{${sum}}{${n}}$ equals the sample mean, and $${ans.toLatex()}$ lies between $0$ and $1$ as a probability must.`,
                `取 $p = ${ans.toLatex()}$，期望等待 $\\frac{1}{p} = \\frac{${sum}}{${n}}$ 等于样本均值，且 $${ans.toLatex()}$ 在 $0$ 与 $1$ 之间，符合概率的要求。`,
              ),
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
    intro: t(
      "The sample $1, 5$ from a normal distribution has $m_1 = \\frac{1 + 5}{2} = 3$ and $m_2 = \\frac{1 + 25}{2} = 13$. Matching $E[X] = \\mu$ and $E[X^{2}] = \\sigma^{2} + \\mu^{2}$ gives $\\hat{\\mu} = 3$ and $\\hat{\\sigma}^{2} = 13 - 3^{2} = 4$.\n\nCheck: the two values lie $2$ either side of $3$, and the mean of the squared deviations is $\\frac{4 + 4}{2} = 4$.\n\nIn this lesson we match the first two moments of a model to the sample moments, estimating a normal mean and variance, and the endpoints of a uniform distribution.",
      "来自正态分布的样本 $1, 5$ 有 $m_1 = \\frac{1 + 5}{2} = 3$，$m_2 = \\frac{1 + 25}{2} = 13$。令 $E[X] = \\mu$，$E[X^{2}] = \\sigma^{2} + \\mu^{2}$ 与之相等，得 $\\hat{\\mu} = 3$，$\\hat{\\sigma}^{2} = 13 - 3^{2} = 4$。\n\n检验：两个值分别在 $3$ 的两侧相距 $2$，离差平方的平均为 $\\frac{4 + 4}{2} = 4$。\n\n本课我们令模型的前两阶矩等于样本矩，估计正态分布的均值和方差，以及均匀分布的端点。",
    ),
    prerequisites: ["the-method-of-moments"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "method-of-moments-uniform-zero-theta",
        title: t("Method of moments for the continuous uniform $U(0, \\theta)$", "连续均匀分布 $U(0, \\theta)$ 的矩估计"),
        explanation: t(
          "The mean of a uniform distribution starting at zero is half its upper endpoint, so doubling the sample mean estimates that endpoint. For $X \\sim U(0, \\theta)$, $E[X] = \\theta/2$, so $\\hat{\\theta} = 2\\bar{x}$.\n\nA sample with $\\bar{x} = 7$ gives $\\hat{\\theta} = 2 \\cdot 7 = 14$.\n\nCheck: $U(0, 14)$ has mean $\\frac{0 + 14}{2} = 7$, the sample mean.\n\n> **Watch out.** The sample mean sits in the middle of $[0, \\theta]$, so $\\theta$ is twice it, not equal to it, and not half of it: $\\frac{7}{2}$ would put the endpoint below the mean.",
          "从零开始的均匀分布的均值是上端点的一半，所以把样本均值加倍就能估计这个端点。对于 $X \\sim U(0, \\theta)$，理论均值为 $E[X] = \\theta/2$，因此矩估计量为 $\\hat{\\theta} = 2\\bar{x}$。\n\n样本均值 $\\bar{x} = 7$ 时，$\\hat{\\theta} = 2 \\cdot 7 = 14$。\n\n检验：$U(0, 14)$ 的均值为 $\\frac{0 + 14}{2} = 7$，正是样本均值。\n\n> **注意。** 样本均值位于 $[0, \\theta]$ 的中间，所以 $\\theta$ 是它的两倍，而不是等于它或它的一半：$\\frac{7}{2}$ 会使端点低于均值。",
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
            mistakes: apart(2 * mean, [
              why(
                mean,
                "This sets $\\theta$ equal to the mean; the mean of $U(0, \\theta)$ is $\\frac{\\theta}{2}$, so $\\theta$ is twice the mean.",
                "这令 $\\theta$ 等于均值；$U(0, \\theta)$ 的均值是 $\\frac{\\theta}{2}$，所以 $\\theta$ 是均值的两倍。",
              ),
              why(
                Q.of(mean, 2),
                "This halves the mean instead of doubling it; the endpoint must lie above the mean.",
                "这把均值减半而不是加倍；端点必须在均值之上。",
              ),
              why(
                mean * mean,
                "This squares the mean; the first moment is matched by doubling, not squaring.",
                "这把均值平方了；匹配一阶矩只需加倍，不需要平方。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Write the model mean", "写出模型均值"],
                  t(
                    "For $X \\sim U(0, \\theta)$, $E[X] = \\frac{\\theta}{2}$.",
                    "对于 $X \\sim U(0, \\theta)$，$E[X] = \\frac{\\theta}{2}$。",
                  ),
                ],
                [
                  ["Match and solve", "令其相等并求解"],
                  t(
                    `$\\frac{\\hat{\\theta}}{2} = ${mean}$, so $\\hat{\\theta} = 2 \\cdot ${mean} = ${2 * mean}$.`,
                    `$\\frac{\\hat{\\theta}}{2} = ${mean}$，所以 $\\hat{\\theta} = 2 \\cdot ${mean} = ${2 * mean}$。`,
                  ),
                ],
              ],
              t(
                `$U(0, ${2 * mean})$ has mean $\\frac{0 + ${2 * mean}}{2} = ${mean}$, the sample mean.`,
                `$U(0, ${2 * mean})$ 的均值为 $\\frac{0 + ${2 * mean}}{2} = ${mean}$，正是样本均值。`,
              ),
            ),
          });
        },
      },
      {
        id: "method-of-moments-for-the-normal-variance",
        title: t("The method of moments for a normal variance", "正态方差的矩估计"),
        explanation: t(
          "For $N(\\mu, \\sigma^{2})$, $E[X] = \\mu$ and $E[X^{2}] = \\sigma^{2} + \\mu^{2}$. Matching these with $m_1 = \\bar{x}$ and $m_2 = \\frac{1}{n}\\sum x_i^{2}$ gives\n\n$$\\hat{\\mu} = m_1, \\qquad \\hat{\\sigma}^{2} = m_2 - m_1^{2}.$$\n\nThe moment estimator divides by $n$, not $n - 1$, so it is slightly smaller than the sample variance $s^{2}$: $\\hat{\\sigma}^{2} = \\frac{n - 1}{n}s^{2}$.\n\nWith $m_1 = 2$ and $m_2 = 7$: $\\hat{\\sigma}^{2} = 7 - 2^{2} = 3$.\n\nCheck: the sample $-1, 3, 3, 3$ has $m_1 = 2$ and $m_2 = \\frac{1 + 9 + 9 + 9}{4} = 7$, and its deviations $-3, 1, 1, 1$ have mean square $\\frac{9 + 1 + 1 + 1}{4} = 3$.\n\n> **Watch out.** Subtract the square of $m_1$, not $m_1$ itself: $7 - 2 = 5$ is wrong. And the estimate keeps the divisor $n$; multiplying by $\\frac{n}{n - 1}$ turns it into $s^{2}$.",
          "对于 $N(\\mu, \\sigma^{2})$，$E[X] = \\mu$，$E[X^{2}] = \\sigma^{2} + \\mu^{2}$。令它们等于 $m_1 = \\bar{x}$ 与 $m_2 = \\frac{1}{n}\\sum x_i^{2}$，得\n\n$$\\hat{\\mu} = m_1, \\qquad \\hat{\\sigma}^{2} = m_2 - m_1^{2}.$$\n\n矩估计量除以 $n$ 而不是 $n - 1$，所以比样本方差 $s^{2}$ 略小：$\\hat{\\sigma}^{2} = \\frac{n - 1}{n}s^{2}$。\n\n若 $m_1 = 2$，$m_2 = 7$：$\\hat{\\sigma}^{2} = 7 - 2^{2} = 3$。\n\n检验：样本 $-1, 3, 3, 3$ 有 $m_1 = 2$，$m_2 = \\frac{1 + 9 + 9 + 9}{4} = 7$，其离均差 $-3, 1, 1, 1$ 的平方平均为 $\\frac{9 + 1 + 1 + 1}{4} = 3$。\n\n> **注意。** 要减去 $m_1$ 的平方，而不是 $m_1$ 本身：$7 - 2 = 5$ 是错的。并且估计保留除数 $n$；乘以 $\\frac{n}{n - 1}$ 就变成了 $s^{2}$。",
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
            mistakes: apart(v, [
              why(
                m2.sub(m1),
                "This subtracts $m_1$ itself; the second moment is $\\sigma^{2} + \\mu^{2}$, so subtract $m_1^{2}$.",
                "这减去的是 $m_1$ 本身；二阶矩是 $\\sigma^{2} + \\mu^{2}$，应减去 $m_1^{2}$。",
              ),
              why(
                v.mul(Q.of(n, n - 1)),
                `This multiplies by $\\frac{n}{n - 1} = \\frac{${n}}{${n - 1}}$, giving $s^{2}$; the moment estimate keeps the divisor $n$.`,
                `这乘以了 $\\frac{n}{n - 1} = \\frac{${n}}{${n - 1}}$，得到的是 $s^{2}$；矩估计保留除数 $n$。`,
              ),
              why(
                m2,
                "This is the second moment $m_2$ itself, which still contains $\\mu^{2}$.",
                "这是二阶矩 $m_2$ 本身，其中还含有 $\\mu^{2}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Match the moments", "令矩相等"],
                  t(
                    `$\\hat{\\mu} = m_1 = ${dec(m1)}$ and $\\hat{\\sigma}^{2} + \\hat{\\mu}^{2} = m_2 = ${dec(m2)}$.`,
                    `$\\hat{\\mu} = m_1 = ${dec(m1)}$，$\\hat{\\sigma}^{2} + \\hat{\\mu}^{2} = m_2 = ${dec(m2)}$。`,
                  ),
                ],
                [
                  ["Solve for the variance", "解出方差"],
                  t(
                    `$\\hat{\\sigma}^{2} = ${dec(m2)} - ${dec(m1)}^{2} = ${dec(m2)} - ${dec(m1.pow(2))} = ${dec(v)}$.`,
                    `$\\hat{\\sigma}^{2} = ${dec(m2)} - ${dec(m1)}^{2} = ${dec(m2)} - ${dec(m1.pow(2))} = ${dec(v)}$。`,
                  ),
                ],
              ],
              t(
                `Adding back: $${dec(v)} + ${dec(m1.pow(2))} = ${dec(m2)}$, the given second moment, and the estimate $${dec(v)}$ is positive, as a variance must be.`,
                `加回去：$${dec(v)} + ${dec(m1.pow(2))} = ${dec(m2)}$，正是给出的二阶矩；估计值 $${dec(v)}$ 为正，符合方差的要求。`,
              ),
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
    intro: t(
      "Waiting times have mean $10$ minutes and standard deviation $6$, and are far from normal. For $n = 36$ waits, the CLT says $\\bar{X}$ is approximately normal with mean $10$ and standard error $\\frac{6}{\\sqrt{36}} = 1$, so $P(\\bar{X} > 12) \\approx 1 - \\Phi(2) = 0.0228$.\n\nCheck: $12$ is $12 - 10 = 2$ standard errors above the mean, and about $2\\%$ of a normal distribution lies beyond $2$ standard deviations on one side.\n\nIn this lesson we use the central limit theorem: the standardized mean of a large sample is approximately $N(0, 1)$ whatever the population, and the sum of $n$ values has standard deviation $\\sigma\\sqrt{n}$.",
      "等待时间的均值为 $10$ 分钟，标准差为 $6$，分布远非正态。对 $n = 36$ 次等待，中心极限定理说明 $\\bar{X}$ 近似服从均值 $10$、标准误 $\\frac{6}{\\sqrt{36}} = 1$ 的正态分布，所以 $P(\\bar{X} > 12) \\approx 1 - \\Phi(2) = 0.0228$。\n\n检验：$12$ 比均值高 $12 - 10 = 2$ 个标准误，而正态分布单侧超过 $2$ 个标准差的部分约占 $2\\%$。\n\n本课我们运用中心极限定理：无论总体如何，大样本的标准化均值近似服从 $N(0, 1)$；$n$ 个值之和的标准差为 $\\sigma\\sqrt{n}$。",
    ),
    prerequisites: ["sample-means-from-normal-populations"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "clt-convergence-distribution",
        title: t("Asymptotic distribution of the standardized mean under CLT", "中心极限定理下标准化均值的渐近分布"),
        explanation: t(
          "The central limit theorem says that for large samples the standardized mean is approximately standard normal, whatever the shape of the population. As $n \\to \\infty$, $\\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$ converges in distribution to $N(0, 1)$ for any population with finite variance $\\sigma^2$.\n\nFor $64$ exponential waiting times with mean $4$ and standard deviation $4$, $Z = \\frac{\\bar{X} - 4}{4/\\sqrt{64}} = \\frac{\\bar{X} - 4}{0.5}$ is approximately $N(0, 1)$, even though each wait is strongly skewed.\n\nCheck: by construction $Z$ has mean $0$ and standard deviation $1$ for every $n$; what the theorem adds is that its shape becomes normal.\n\n> **Watch out.** The theorem is about the mean, not the data: the $64$ waits themselves stay skewed. And the $t$ distribution appears only when $\\sigma$ is replaced by the sample standard deviation $s$.",
          "中心极限定理说明，无论总体的形状如何，大样本时标准化的均值近似服从标准正态分布。当 $n \\to \\infty$ 时，对任意方差 $\\sigma^2$ 有限的总体，$\\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$ 依分布收敛至 $N(0, 1)$。\n\n对 $64$ 个均值为 $4$、标准差为 $4$ 的指数等待时间，$Z = \\frac{\\bar{X} - 4}{4/\\sqrt{64}} = \\frac{\\bar{X} - 4}{0.5}$ 近似服从 $N(0, 1)$，尽管每个等待时间都严重偏斜。\n\n检验：按构造，对任何 $n$，$Z$ 的均值都是 $0$、标准差都是 $1$；定理补充的是它的形状趋于正态。\n\n> **注意。** 定理说的是均值而不是数据：这 $64$ 个等待时间本身仍然偏斜。只有用样本标准差 $s$ 代替 $\\sigma$ 时才会出现 $t$ 分布。",
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

          return reasoned(
            choiceProblem({
              prompt: t(
                `A random sample of size $n = ${n}$ is drawn from a highly skewed population with mean $\\mu$ and finite variance $\\sigma^2$. By the Central Limit Theorem, what distribution does the standardized statistic $Z_n = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$ approximately follow?`,
                `从一个高度偏斜、均值为 $\\mu$ 且具有有限方差 $\\sigma^2$ 的总体中抽取容量为 $n = ${n}$ 的样本。根据中心极限定理，标准化统计量 $Z_n = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$ 近似服从什么分布？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Check the conditions", "检查条件"],
                    t(
                      `The population has finite variance and the sample is large, $n = ${n}$, so the central limit theorem applies whatever the skew.`,
                      `总体方差有限，样本量较大（$n = ${n}$），所以无论偏斜程度如何，中心极限定理都适用。`,
                    ),
                  ],
                  [
                    ["Apply the theorem", "应用定理"],
                    t(
                      "The mean is standardized with the known $\\sigma$, so $Z_n$ is approximately $N(0, 1)$.",
                      "均值用已知的 $\\sigma$ 标准化，所以 $Z_n$ 近似服从 $N(0, 1)$。",
                    ),
                  ],
                ],
                t(
                  "Whatever $n$ is, $Z_n$ has mean $0$ and standard deviation $1$, which matches $N(0, 1)$; of the options, only it has both.",
                  "无论 $n$ 为何值，$Z_n$ 的均值都是 $0$、标准差都是 $1$，与 $N(0, 1)$ 一致；选项中只有它同时满足这两点。",
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "The $t$ distribution arises when $\\sigma$ is replaced by the sample standard deviation $s$; here $\\sigma$ is used.",
                "只有用样本标准差 $s$ 代替 $\\sigma$ 时才出现 $t$ 分布；这里用的是 $\\sigma$。",
              ],
              [
                opts[2]!.en,
                `A chi-square variable is never negative and has mean $${n}$, but $Z_n$ has mean $0$.`,
                `卡方变量不取负值且均值为 $${n}$，而 $Z_n$ 的均值为 $0$。`,
              ],
              [
                opts[3]!.en,
                "A $U(-1, 1)$ variable has standard deviation $\\frac{1}{\\sqrt{3}}$, not $1$, and cannot go beyond $\\pm 1$.",
                "$U(-1, 1)$ 变量的标准差为 $\\frac{1}{\\sqrt{3}}$ 而不是 $1$，且不会超出 $\\pm 1$。",
              ],
            ],
          );
        },
      },
      {
        id: "the-spread-of-a-sample-sum",
        title: t("The spread of a sample sum", "样本和的离散程度"),
        explanation: t(
          "The CLT applies to the sum $S_n = X_1 + \\cdots + X_n$ as well as to the mean, with\n\n$$E[S_n] = n\\mu, \\qquad \\operatorname{SD}(S_n) = \\sigma\\sqrt{n}.$$\n\nThe sum's spread **grows** like $\\sqrt{n}$, while the mean's spread $\\frac{\\sigma}{\\sqrt{n}}$ shrinks. The sum's standard deviation is not $n\\sigma$: independent errors partly cancel.\n\nFor $25$ items, each with standard deviation $2$ g, the total has standard deviation $2\\sqrt{25} = 10$ g.\n\nCheck: the variances add, $25 \\cdot 2^{2} = 100$, and $\\sqrt{100} = 10$.\n\n> **Watch out.** Variances add, not standard deviations: $25 \\cdot 2 = 50$ g is too large. And $\\frac{2}{\\sqrt{25}} = 0.4$ g is the standard error of the mean weight, not the spread of the total.",
          "中心极限定理不仅适用于均值，也适用于和 $S_n = X_1 + \\cdots + X_n$，且\n\n$$E[S_n] = n\\mu, \\qquad \\operatorname{SD}(S_n) = \\sigma\\sqrt{n}.$$\n\n和的离散程度按 $\\sqrt{n}$ **增大**，而均值的离散程度 $\\frac{\\sigma}{\\sqrt{n}}$ 减小。和的标准差不是 $n\\sigma$：独立的误差会部分抵消。\n\n$25$ 件物品，每件标准差为 $2$ 克，总重量的标准差为 $2\\sqrt{25} = 10$ 克。\n\n检验：方差相加，$25 \\cdot 2^{2} = 100$，$\\sqrt{100} = 10$。\n\n> **注意。** 相加的是方差而不是标准差：$25 \\cdot 2 = 50$ 克太大了。而 $\\frac{2}{\\sqrt{25}} = 0.4$ 克是平均重量的标准误，不是总重量的离散程度。",
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
            mistakes: apart(ans, [
              why(
                sigma.mul(Q.of(k * k)),
                `This adds the standard deviations, $n\\sigma$; variances add, so the standard deviation grows only like $\\sqrt{n} = ${k}$.`,
                `这把标准差相加得 $n\\sigma$；相加的是方差，所以标准差只按 $\\sqrt{n} = ${k}$ 增大。`,
              ),
              why(
                sigma.pow(2).mul(Q.of(k * k)),
                "This is the variance of the total, $n\\sigma^{2}$; take its square root.",
                "这是总重量的方差 $n\\sigma^{2}$；还要开平方。",
              ),
              ...(isTerminating(sigma.div(Q.of(k)))
                ? [
                    why(
                      sigma.div(Q.of(k)),
                      "This is the standard error of the mean weight, $\\frac{\\sigma}{\\sqrt{n}}$, not the spread of the total.",
                      "这是平均重量的标准误 $\\frac{\\sigma}{\\sqrt{n}}$，不是总重量的离散程度。",
                    ),
                  ]
                : []),
            ]),
            unit: "g",
            solution: walked(
              [
                [
                  ["Add the variances", "方差相加"],
                  t(
                    `$\\operatorname{Var}(S_n) = n\\sigma^{2} = ${k * k} \\cdot ${dec(sigma)}^{2} = ${dec(sigma.pow(2).mul(Q.of(k * k)))}$.`,
                    `$\\operatorname{Var}(S_n) = n\\sigma^{2} = ${k * k} \\cdot ${dec(sigma)}^{2} = ${dec(sigma.pow(2).mul(Q.of(k * k)))}$。`,
                  ),
                ],
                [
                  ["Take the square root", "开平方"],
                  t(
                    `$\\operatorname{SD}(S_n) = \\sigma\\sqrt{n} = ${dec(sigma)} \\cdot ${k} = ${dec(ans)}$ g.`,
                    `$\\operatorname{SD}(S_n) = \\sigma\\sqrt{n} = ${dec(sigma)} \\cdot ${k} = ${dec(ans)}$ 克。`,
                  ),
                ],
              ],
              t(
                `$${dec(ans)}^{2} = ${dec(ans.pow(2))}$, the variance of the total, and $${dec(ans)}$ g lies between one item's $${dec(sigma)}$ g and the $${dec(sigma.mul(Q.of(k * k)))}$ g that adding standard deviations would give.`,
                `$${dec(ans)}^{2} = ${dec(ans.pow(2))}$，正是总重量的方差；$${dec(ans)}$ 克介于单件的 $${dec(sigma)}$ 克与标准差直接相加所得的 $${dec(sigma.mul(Q.of(k * k)))}$ 克之间。`,
              ),
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
    intro: t(
      "Each of $100$ independent values has mean $5$ and standard deviation $2$. Their sum has mean $100 \\cdot 5 = 500$ and standard deviation $2\\sqrt{100} = 20$, so by the CLT $P(S > 540) \\approx 1 - \\Phi\\left(\\frac{540 - 500}{20}\\right) = 1 - \\Phi(2) = 0.0228$.\n\nCheck: $500 + 2 \\cdot 20 = 540$, so $540$ is exactly $2$ standard deviations above the mean of the sum.\n\nIn this lesson we standardize a sample mean or a sample sum with its own standard deviation and use the normal table to find approximate probabilities.",
      "$100$ 个相互独立的值，每个均值为 $5$、标准差为 $2$。它们的和均值为 $100 \\cdot 5 = 500$，标准差为 $2\\sqrt{100} = 20$，所以由中心极限定理 $P(S > 540) \\approx 1 - \\Phi\\left(\\frac{540 - 500}{20}\\right) = 1 - \\Phi(2) = 0.0228$。\n\n检验：$500 + 2 \\cdot 20 = 540$，所以 $540$ 恰好比和的均值高 $2$ 个标准差。\n\n本课我们用样本均值或样本和各自的标准差进行标准化，并用正态表求近似概率。",
    ),
    prerequisites: ["the-central-limit-theorem"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "clt-standardized-z-score",
        title: t("Computing the z-score for a sample mean under CLT", "利用 CLT 计算样本均值的标准化 z 分数"),
        explanation: t(
          "Standardizing measures how many standard errors the sample mean lies from the population mean, which the central limit theorem treats as standard normal.\n\n$$z = \\frac{\\bar{x} - \\mu}{\\sigma / \\sqrt{n}}$$\n\nWith $\\mu = 50$, $\\sigma = 12$ and $n = 36$, the standard error is $\\frac{12}{6} = 2$, and a sample mean of $55$ has $z = \\frac{55 - 50}{2} = 2.5$.\n\nCheck: $50 + 2.5 \\cdot 2 = 55$, so $55$ is indeed $2.5$ standard errors above the mean.\n\n> **Watch out.** Divide by the standard error $2$, not by $\\sigma = 12$: $\\frac{5}{12}$ is the $z$-score of a single observation of $55$, not of a mean.",
          "标准化衡量样本均值离总体均值有多少个标准误，中心极限定理把它视为标准正态分布。\n\n$$z = \\frac{\\bar{x} - \\mu}{\\sigma / \\sqrt{n}}$$\n\n若 $\\mu = 50$，$\\sigma = 12$，$n = 36$，标准误为 $\\frac{12}{6} = 2$，样本均值 $55$ 对应 $z = \\frac{55 - 50}{2} = 2.5$。\n\n检验：$50 + 2.5 \\cdot 2 = 55$，所以 $55$ 确实比均值高 $2.5$ 个标准误。\n\n> **注意。** 要除以标准误 $2$，不是 $\\sigma = 12$：$\\frac{5}{12}$ 是单个观测值 $55$ 的 $z$ 分数，而不是均值的。",
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
            mistakes: apart(z, [
              why(
                Q.of(diff, sigma),
                `This divides by $\\sigma = ${sigma}$, as for one observation; a mean is standardized with the standard error $${se}$.`,
                `这除以了 $\\sigma = ${sigma}$，像单个观测那样；均值要用标准误 $${se}$ 标准化。`,
              ),
              why(
                diff,
                "This is the raw distance $\\bar{x} - \\mu$, not yet divided by the standard error.",
                "这是原始距离 $\\bar{x} - \\mu$，还没有除以标准误。",
              ),
              why(
                z * k,
                `This divides by $\\frac{\\sigma}{n}$; the standard error is $\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{${k}}$.`,
                `这除以了 $\\frac{\\sigma}{n}$；标准误是 $\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{${k}}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `$\\text{SE} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{${k}} = ${se}$.`,
                    `$\\text{SE} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{${k}} = ${se}$。`,
                  ),
                ],
                [
                  ["Standardize", "标准化"],
                  t(
                    `$z = \\frac{${xBar} - ${mu}}{${se}} = \\frac{${diff}}{${se}} = ${z}$.`,
                    `$z = \\frac{${xBar} - ${mu}}{${se}} = \\frac{${diff}}{${se}} = ${z}$。`,
                  ),
                ],
              ],
              t(
                `$${mu} + ${z} \\cdot ${se} = ${xBar}$, the given sample mean.`,
                `$${mu} + ${z} \\cdot ${se} = ${xBar}$，正是给出的样本均值。`,
              ),
            ),
          });
        },
      },
      {
        id: "probabilities-for-a-sample-sum",
        title: t("Probabilities for a sample sum", "样本和的概率"),
        explanation: t(
          "For a large sample, $S_n$ is approximately $N(n\\mu, n\\sigma^{2})$, so\n\n$$P(S_n > c) \\approx 1 - \\Phi\\left(\\frac{c - n\\mu}{\\sigma\\sqrt{n}}\\right).$$\n\nThis answers capacity questions: whether $36$ suitcases with mean $20$ kg and standard deviation $5$ kg exceed a $750$ kg limit. Here $n\\mu = 720$, $\\sigma\\sqrt{n} = 30$, $z = 1$ and the probability is about $1 - 0.8413 = 0.1587$.\n\nCheck: $720 + 1 \\cdot 30 = 750$, so the limit is one standard deviation above the expected total.\n\n> **Watch out.** The standard deviation of the total is $\\sigma\\sqrt{n} = 30$, not $n\\sigma = 180$; with $180$ the limit would look almost certain to be reached. And $P(S_n > c)$ is the upper tail, $1 - \\Phi(z)$.",
          "对于大样本，$S_n$ 近似服从 $N(n\\mu, n\\sigma^{2})$，所以\n\n$$P(S_n > c) \\approx 1 - \\Phi\\left(\\frac{c - n\\mu}{\\sigma\\sqrt{n}}\\right).$$\n\n这可以回答容量问题：均值 $20$ 千克、标准差 $5$ 千克的 $36$ 件行李是否超过 $750$ 千克的限额。此时 $n\\mu = 720$，$\\sigma\\sqrt{n} = 30$，$z = 1$，概率约为 $1 - 0.8413 = 0.1587$。\n\n检验：$720 + 1 \\cdot 30 = 750$，所以限额比期望总重高一个标准差。\n\n> **注意。** 总重量的标准差是 $\\sigma\\sqrt{n} = 30$，不是 $n\\sigma = 180$；若用 $180$，会显得几乎肯定达到限额。并且 $P(S_n > c)$ 是上尾，即 $1 - \\Phi(z)$。",
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
          const tail = ans.cmp(Q.of(1, 2)) < 0 ? ans : Q.one.sub(ans);
          return numberProblem({
            prompt: t(
              `Each of $${n}$ independent parcels has mean weight $${mu}$ kg and standard deviation $${sigma}$ kg. Using the central limit theorem, find the probability that the total weight exceeds $${dec(c)}$ kg. Use ${PHI_TABLE.en}.`,
              `$${n}$ 件相互独立的包裹，每件重量均值 $${mu}$ 千克、标准差 $${sigma}$ 千克。利用中心极限定理，求总重量超过 $${dec(c)}$ 千克的概率。利用${PHI_TABLE["zh-CN"]}。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [phi(zv), Q.one.sub(phi(Math.min(2.5, Math.abs(zv) * 2) * Math.sign(zv)))].filter((w) => !w.eq(ans)),
            mistakes: apart(ans, [
              why(
                phi(zv),
                "This is $\\Phi(z)$, the chance that the total is below the limit; the question asks for the upper tail.",
                "这是 $\\Phi(z)$，即总重低于该值的概率；题目问的是上尾。",
              ),
              why(
                Q.of(2).mul(tail),
                "This doubles the tail, as for a two-sided probability; only exceeding the limit is asked for.",
                "这把尾部概率加倍，像双侧概率那样；题目只问超过的情形。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the mean and spread of the total", "求总和的均值与标准差"],
                  t(
                    `$E[S] = ${n} \\cdot ${mu} = ${n * mu}$ and $\\operatorname{SD}(S) = ${sigma}\\sqrt{${n}} = ${sigma} \\cdot ${k} = ${sd}$.`,
                    `$E[S] = ${n} \\cdot ${mu} = ${n * mu}$，$\\operatorname{SD}(S) = ${sigma}\\sqrt{${n}} = ${sigma} \\cdot ${k} = ${sd}$。`,
                  ),
                ],
                [
                  ["Standardize", "标准化"],
                  t(`$z = \\frac{${dec(c)} - ${n * mu}}{${sd}} = ${zv}$.`, `$z = \\frac{${dec(c)} - ${n * mu}}{${sd}} = ${zv}$。`),
                ],
                [
                  ["Take the upper tail", "取上尾"],
                  t(
                    `$P(S > ${dec(c)}) \\approx 1 - \\Phi(${zv}) = ${dec(ans)}$${zv < 0 ? `, since $\\Phi(${zv}) = 1 - \\Phi(${-zv})$` : ""}.`,
                    `$P(S > ${dec(c)}) \\approx 1 - \\Phi(${zv}) = ${dec(ans)}$${zv < 0 ? `，因为 $\\Phi(${zv}) = 1 - \\Phi(${-zv})$` : ""}。`,
                  ),
                ],
              ],
              t(
                `The limit $${dec(c)}$ is ${zv > 0 ? "above" : "below"} the expected total $${n * mu}$, so the chance of exceeding it should be ${zv > 0 ? "less" : "more"} than $\\frac{1}{2}$; $${dec(ans)}$ is.`,
                `限额 $${dec(c)}$ 在期望总重 $${n * mu}$ 的${zv > 0 ? "上方" : "下方"}，所以超过它的概率应${zv > 0 ? "小于" : "大于"} $\\frac{1}{2}$；$${dec(ans)}$ 正是如此。`,
              ),
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
    intro: t(
      "A class of $N = 101$ students is surveyed by drawing $n = 20$ of them without replacement, and without any correction $\\frac{\\sigma}{\\sqrt{n}} = 3$. The correction factor is $\\frac{N - n}{N - 1} = \\frac{81}{100}$, its square root is $0.9$, and the corrected standard error of $\\bar{X}$ is $3 \\cdot 0.9 = 2.7$.\n\nCheck: squaring gives the variances, $2.7^{2} = 7.29$ and $3^{2} \\cdot \\frac{81}{100} = 9 \\cdot 0.81 = 7.29$, so the variance was multiplied by the factor itself.\n\nIn this lesson we compute the finite population correction factor and use its square root to correct the standard error of a sample mean drawn without replacement.",
      "从 $N = 101$ 名学生中不放回地抽取 $n = 20$ 名进行调查，未校正时 $\\frac{\\sigma}{\\sqrt{n}} = 3$。校正因子为 $\\frac{N - n}{N - 1} = \\frac{81}{100}$，其平方根为 $0.9$，所以 $\\bar{X}$ 的修正标准误为 $3 \\cdot 0.9 = 2.7$。\n\n检验：平方后得到方差，$2.7^{2} = 7.29$，而 $3^{2} \\cdot \\frac{81}{100} = 9 \\cdot 0.81 = 7.29$，可见方差乘的正是校正因子本身。\n\n本课我们计算有限总体校正因子，并用它的平方根修正不放回抽样时样本均值的标准误。",
    ),
    prerequisites: ["applications-of-the-central-limit-theorem"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-fpc-factor-squared",
        title: t("Evaluating the squared finite population correction factor", "计算有限总体校正因子的平方值"),
        explanation: t(
          "When sampling without replacement from a small population, each draw tells you more, so the variance is multiplied by this correction factor below one. The squared FPC factor is $\\frac{N - n}{N - 1}$.\n\nFor $n = 10$ drawn from $N = 50$: $\\frac{50 - 10}{50 - 1} = \\frac{40}{49}$.\n\nCheck: the factor is below $1$ because $N - n = 40$ is smaller than $N - 1 = 49$, and it equals $1$ only when $n = 1$, when a single draw cannot repeat anyone.\n\n> **Watch out.** The denominator is $N - 1$, not $N$: $\\frac{40}{50} = 0.8$ is the fraction of the population left out, which is close to the factor but not equal to it.",
          "从小总体中不放回抽样时，每次抽取提供的信息更多，所以方差要乘以这个小于 1 的修正因子。有限总体校正因子的平方为 $\\frac{N - n}{N - 1}$。\n\n从 $N = 50$ 中抽取 $n = 10$：$\\frac{50 - 10}{50 - 1} = \\frac{40}{49}$。\n\n检验：因为 $N - n = 40$ 小于 $N - 1 = 49$，因子小于 $1$；只有 $n = 1$ 时它才等于 $1$，那时一次抽取不会重复任何人。\n\n> **注意。** 分母是 $N - 1$，不是 $N$：$\\frac{40}{50} = 0.8$ 是未被抽到的总体比例，与因子接近但并不相等。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(100, 500);
          const n = rng.int(10, 80);
          const num = N - n;
          const den = N - 1;
          const ans = Q.of(num, den);

          return numberProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ is sampled without replacement from a finite population of size $N = ${N}$. What is the rational value of the squared finite population correction factor, $\\frac{N - n}{N - 1}$?`,
              `从容量为 $N = ${N}$ 的有限总体中不放回抽取容量为 $n = ${n}$ 的随机样本。求有限总体校正因子平方 $\\frac{N - n}{N - 1}$ 的有理数值。`,
            ),
            answer: ans,
            wrong: [Q.of(n, N), Q.of(num, N), Q.of(N - n - 1, N - 1)],
            mistakes: apart(ans, [
              why(
                Q.of(num, N),
                `This divides by $N = ${N}$; the factor divides by $N - 1 = ${den}$.`,
                `这除以了 $N = ${N}$；因子要除以 $N - 1 = ${den}$。`,
              ),
              why(
                Q.of(n, N),
                "This is the sampling fraction $\\frac{n}{N}$, the share of the population that was drawn, not the correction factor.",
                "这是抽样比 $\\frac{n}{N}$，即被抽中的总体比例，不是校正因子。",
              ),
              why(
                Q.of(N - n - 1, N - 1),
                `This subtracts $1$ in the numerator as well; the numerator is $N - n = ${num}$.`,
                `这在分子中也减了 $1$；分子是 $N - n = ${num}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Count the numerator and denominator", "算出分子和分母"],
                  t(`$N - n = ${N} - ${n} = ${num}$ and $N - 1 = ${den}$.`, `$N - n = ${N} - ${n} = ${num}$，$N - 1 = ${den}$。`),
                ],
                [
                  ["Form the factor", "写出因子"],
                  t(
                    `$\\frac{N - n}{N - 1} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `$\\frac{N - n}{N - 1} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              t(
                `The factor is below $1$, as it must be for $n = ${n} > 1$, and $${num} + ${n - 1} = ${den}$.`,
                `因子小于 $1$，这对 $n = ${n} > 1$ 必然成立；并且 $${num} + ${n - 1} = ${den}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-corrected-standard-error-of-the-mean",
        title: t("The corrected standard error of the mean", "均值的修正标准误"),
        explanation: t(
          "Multiply the usual standard error by the square root of the correction factor:\n\n$$\\operatorname{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}\\sqrt{\\frac{N - n}{N - 1}}.$$\n\nThe factor itself is a ratio of counts; the standard error uses its **square root**, while the variance uses the factor as it is. For $N = 101$, $n = 37$: $\\frac{64}{100}$ for the variance, $0.8$ for the standard error. With an uncorrected standard error of $5$, the corrected one is $5 \\cdot 0.8 = 4$.\n\nCheck: $4^{2} = 16$ and $5^{2} \\cdot \\frac{64}{100} = 16$, so the variance was multiplied by the factor itself.\n\n> **Watch out.** Do not multiply the standard error by the factor $0.64$: that gives $5 \\cdot 0.64 = 3.2$, which corrects twice. The factor multiplies the variance; its square root multiplies the standard error.",
          "把通常的标准误乘以校正因子的平方根：\n\n$$\\operatorname{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}\\sqrt{\\frac{N - n}{N - 1}}.$$\n\n校正因子本身是计数之比；标准误用它的**平方根**，而方差直接用它。例如 $N = 101$，$n = 37$：方差乘 $\\frac{64}{100}$，标准误乘 $0.8$。若未校正的标准误为 $5$，修正后为 $5 \\cdot 0.8 = 4$。\n\n检验：$4^{2} = 16$，而 $5^{2} \\cdot \\frac{64}{100} = 16$，可见方差乘的正是因子本身。\n\n> **注意。** 不要把标准误乘以因子 $0.64$：那样得 $5 \\cdot 0.64 = 3.2$，等于校正了两次。因子乘方差，它的平方根才乘标准误。",
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
            mistakes: apart(ans, [
              why(
                se.mul(r).mul(r),
                `This multiplies by the factor $${dec(r.mul(r))}$ itself; the standard error takes its square root $${dec(r)}$.`,
                `这乘的是因子本身 $${dec(r.mul(r))}$；标准误要乘它的平方根 $${dec(r)}$。`,
              ),
              why(se, "This leaves out the correction, as if the sample were drawn with replacement.", "这没有做校正，好像是有放回抽样。"),
              why(
                se.mul(Q.one.sub(r)),
                `This multiplies by $1 - ${dec(r)}$, the amount removed, instead of by $${dec(r)}$.`,
                `这乘的是被减掉的部分 $1 - ${dec(r)}$，而不是 $${dec(r)}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the correction", "求校正量"],
                  t(
                    `$\\sqrt{\\frac{${N} - ${n}}{${N} - 1}} = \\sqrt{\\frac{${N - n}}{${N - 1}}} = ${dec(r)}$.`,
                    `$\\sqrt{\\frac{${N} - ${n}}{${N} - 1}} = \\sqrt{\\frac{${N - n}}{${N - 1}}} = ${dec(r)}$。`,
                  ),
                ],
                [
                  ["Correct the standard error", "修正标准误"],
                  t(`$${dec(se)} \\cdot ${dec(r)} = ${dec(ans)}$.`, `$${dec(se)} \\cdot ${dec(r)} = ${dec(ans)}$。`),
                ],
              ],
              t(
                `$${dec(r)}^{2} \\cdot ${N - 1} = ${N - n}$, so the square root is right, and $${dec(ans)}$ is below $${dec(se)}$.`,
                `$${dec(r)}^{2} \\cdot ${N - 1} = ${N - n}$，平方根正确，且 $${dec(ans)}$ 小于 $${dec(se)}$。`,
              ),
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
    intro: t(
      "A poll asks $400$ randomly chosen voters, and $80$ of them support a new park. The point estimate of the proportion of supporters is $\\hat{p} = \\frac{80}{400} = 0.2$, and its estimated standard error is $\\sqrt{\\frac{0.2 \\cdot 0.8}{400}} = \\frac{0.4}{20} = 0.02$.\n\nCheck: $400 \\cdot 0.2 = 80$ gives back the count of supporters, and $0.02^{2} \\cdot 400 = 0.16 = 0.2 \\cdot 0.8$.\n\nIn this lesson we estimate a population proportion by the sample proportion and state how precise that estimate is with its estimated standard error.",
      "随机询问 $400$ 名选民，其中 $80$ 人支持新建公园。支持者比例的点估计为 $\\hat{p} = \\frac{80}{400} = 0.2$，其估计标准误为 $\\sqrt{\\frac{0.2 \\cdot 0.8}{400}} = \\frac{0.4}{20} = 0.02$。\n\n检验：$400 \\cdot 0.2 = 80$，还原了支持人数；并且 $0.02^{2} \\cdot 400 = 0.16 = 0.2 \\cdot 0.8$。\n\n本课我们用样本比例估计总体比例，并用估计标准误说明这个估计有多精确。",
    ),
    prerequisites: ["sampling-proportions-from-finite-populations"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-sample-proportion-point-estimate",
        title: t("Calculating the point estimate of a proportion", "计算总体比例的点估计值"),
        explanation: t(
          "The natural estimate of a population proportion is the fraction of the sample that has the property: $\\hat{p} = x/n$, where $x$ counts the sample members with it and $n$ is the sample size.\n\nIf $18$ of $60$ sampled seedlings flower, $\\hat{p} = \\frac{18}{60} = \\frac{3}{10} = 0.3$.\n\nCheck: $60 \\cdot 0.3 = 18$, the number that flowered, and $\\hat{p}$ lies between $0$ and $1$.\n\n> **Watch out.** Divide by the whole sample $n = 60$, not by the $42$ that did not flower: $\\frac{18}{42}$ compares successes with failures, which is the odds, not the proportion.",
          "总体比例的自然估计是样本中具有该性质的个体所占的比例：$\\hat{p} = x/n$，其中 $x$ 是样本中具有该性质的个数，$n$ 是样本容量。\n\n若抽取的 $60$ 株幼苗中有 $18$ 株开花，则 $\\hat{p} = \\frac{18}{60} = \\frac{3}{10} = 0.3$。\n\n检验：$60 \\cdot 0.3 = 18$，正是开花的株数，且 $\\hat{p}$ 在 $0$ 与 $1$ 之间。\n\n> **注意。** 要除以整个样本 $n = 60$，而不是未开花的 $42$ 株：$\\frac{18}{42}$ 是成功数与失败数之比，即优势比，不是比例。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(50, 400);
          const x = rng.int(10, n - 10);
          const ans = Q.of(x, n);

          return numberProblem({
            prompt: t(
              `In a sample of $n = ${n}$ tested components, exactly $x = ${x}$ met all quality specifications. Find the point estimate of the population proportion.`,
              `在抽检的 $n = ${n}$ 个零部件中，恰好有 $x = ${x}$ 个符合全部质量规范。求总体合格比例的点估计值。`,
            ),
            answer: ans,
            wrong: [Q.of(n - x, n), Q.of(x, n - x), Q.of(n, x)],
            mistakes: apart(ans, [
              why(
                Q.of(n - x, n),
                "This is the proportion that failed the specifications, not the proportion that met them.",
                "这是不合格的比例，而不是合格的比例。",
              ),
              why(
                Q.of(x, n - x),
                `This divides by the $${n - x}$ failures; a proportion divides by the whole sample $n = ${n}$.`,
                `这除以了 $${n - x}$ 个不合格品；比例要除以整个样本 $n = ${n}$。`,
              ),
              why(Q.of(n, x), "This turns the ratio upside down; a proportion cannot exceed $1$.", "这把比值颠倒了；比例不可能大于 $1$。"),
            ]),
            solution: walked(
              [
                [
                  ["Identify the count and the sample size", "找出个数与样本容量"],
                  t(`$x = ${x}$ components met the specifications out of $n = ${n}$.`, `$n = ${n}$ 个中有 $x = ${x}$ 个合格。`),
                ],
                [
                  ["Divide", "相除"],
                  t(
                    `$\\hat{p} = \\frac{x}{n} = \\frac{${x}}{${n}}${lowestTerms(x, n)}$.`,
                    `$\\hat{p} = \\frac{x}{n} = \\frac{${x}}{${n}}${lowestTerms(x, n)}$。`,
                  ),
                ],
              ],
              t(
                `$${n} \\cdot ${ans.toLatex()} = ${x}$, the number that met the specifications, and the estimate lies between $0$ and $1$.`,
                `$${n} \\cdot ${ans.toLatex()} = ${x}$，正是合格的个数，且估计值在 $0$ 与 $1$ 之间。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-estimated-standard-error-of-a-proportion",
        title: t("The estimated standard error of a proportion", "比例的估计标准误"),
        explanation: t(
          "A point estimate should come with its precision. The standard error of $\\hat{p}$ is estimated by plugging in $\\hat{p}$ for the unknown $p$:\n\n$$\\widehat{\\operatorname{SE}}(\\hat{p}) = \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}.$$\n\nIf $90$ of $900$ parts are defective, $\\hat{p} = 0.1$ and $\\widehat{\\operatorname{SE}} = \\sqrt{\\frac{0.09}{900}} = \\frac{0.3}{30} = 0.01$: the estimate is typically off by about one percentage point.\n\nCheck: $0.01^{2} \\cdot 900 = 0.09 = 0.1 \\cdot 0.9$, so squaring the standard error and multiplying by $n$ gives back $\\hat{p}(1 - \\hat{p})$.\n\n> **Watch out.** Take the square root of the whole fraction: $\\frac{0.09}{900} = 0.0001$ is the variance, and $\\frac{\\sqrt{0.09}}{900} = \\frac{0.3}{900}$ leaves $n$ outside the root. Only $\\frac{0.3}{\\sqrt{900}} = 0.01$ is the standard error.",
          "点估计应附带它的精度。用 $\\hat{p}$ 代替未知的 $p$ 来估计 $\\hat{p}$ 的标准误：\n\n$$\\widehat{\\operatorname{SE}}(\\hat{p}) = \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}.$$\n\n若 $900$ 个零件中有 $90$ 个次品，$\\hat{p} = 0.1$，$\\widehat{\\operatorname{SE}} = \\sqrt{\\frac{0.09}{900}} = \\frac{0.3}{30} = 0.01$：估计值通常偏离约一个百分点。\n\n检验：$0.01^{2} \\cdot 900 = 0.09 = 0.1 \\cdot 0.9$，把标准误平方再乘以 $n$，还原了 $\\hat{p}(1 - \\hat{p})$。\n\n> **注意。** 要对整个分式开方：$\\frac{0.09}{900} = 0.0001$ 是方差，而 $\\frac{\\sqrt{0.09}}{900} = \\frac{0.3}{900}$ 把 $n$ 留在了根号外。只有 $\\frac{0.3}{\\sqrt{900}} = 0.01$ 才是标准误。",
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
            mistakes: apart(ans, [
              why(
                sd.pow(2).div(Q.of(n)),
                "This is the estimated variance; the standard error is its square root.",
                "这是估计方差；标准误是它的平方根。",
              ),
              why(
                sd.div(Q.of(n)),
                `This takes the root of the numerator only and divides by $n = ${n}$; divide by $\\sqrt{n} = ${root}$.`,
                `这只对分子开方，再除以 $n = ${n}$；应除以 $\\sqrt{n} = ${root}$。`,
              ),
              why(
                p.div(Q.of(root)),
                `This uses $\\hat{p} = ${dec(p)}$ in place of $\\sqrt{\\hat{p}(1 - \\hat{p})} = ${dec(sd)}$.`,
                `这用 $\\hat{p} = ${dec(p)}$ 代替了 $\\sqrt{\\hat{p}(1 - \\hat{p})} = ${dec(sd)}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Estimate the proportion", "估计比例"],
                  t(`$\\hat{p} = \\frac{${x.toString()}}{${n}} = ${dec(p)}$.`, `$\\hat{p} = \\frac{${x.toString()}}{${n}} = ${dec(p)}$。`),
                ],
                [
                  ["Take the root of the variance", "对方差开方"],
                  t(
                    `$\\widehat{\\operatorname{SE}} = \\sqrt{\\frac{${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${n}}} = \\frac{${dec(sd)}}{${root}} = ${dec(ans)}$.`,
                    `$\\widehat{\\operatorname{SE}} = \\sqrt{\\frac{${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${n}}} = \\frac{${dec(sd)}}{${root}} = ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `$${dec(ans)}^{2} \\cdot ${n} = ${dec(sd.pow(2))} = ${dec(p)} \\cdot ${dec(Q.one.sub(p))}$.`,
                `$${dec(ans)}^{2} \\cdot ${n} = ${dec(sd.pow(2))} = ${dec(p)} \\cdot ${dec(Q.one.sub(p))}$。`,
              ),
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
    intro: t(
      "A club of $N = 101$ members is surveyed by asking $n = 20$ of them, and half say yes, so $\\hat{p} = 0.5$. The sampling fraction $\\frac{20}{101} \\approx 0.2$ is well above $5\\%$, so the correction is needed: $\\frac{0.5 \\cdot 0.5}{20} \\cdot \\frac{81}{100} = 0.0125 \\cdot 0.81 = 0.010125$.\n\nCheck: the corrected variance is smaller than the uncorrected $0.0125$, and $\\frac{0.010125}{0.0125} = 0.81$ is exactly the factor $\\frac{81}{100}$.\n\nIn this lesson we decide with the five percent guideline whether a sample proportion needs the finite population correction, and apply it to the estimated variance of $\\hat{p}$.",
      "一个有 $N = 101$ 名成员的俱乐部，询问其中 $n = 20$ 人，一半人回答“是”，所以 $\\hat{p} = 0.5$。抽样比 $\\frac{20}{101} \\approx 0.2$ 远超过 $5\\%$，需要校正：$\\frac{0.5 \\cdot 0.5}{20} \\cdot \\frac{81}{100} = 0.0125 \\cdot 0.81 = 0.010125$。\n\n检验：修正后的方差小于未修正的 $0.0125$，并且 $\\frac{0.010125}{0.0125} = 0.81$ 恰好是因子 $\\frac{81}{100}$。\n\n本课我们用百分之五准则判断样本比例是否需要有限总体校正，并把校正用于 $\\hat{p}$ 的估计方差。",
    ),
    prerequisites: ["point-estimates-of-population-proportions", "finite-population-corrections-for-sample-means"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "fpc-guideline-five-percent-rule",
        title: t("Understanding when FPC is necessary (the 5% rule)", "理解何时需要使用有限总体校正（5% 法则）"),
        explanation: t(
          "The finite population correction is typically applied when the sample size exceeds 5% of the population: n / N > 0.05.\n\nA sample of $30$ from $400$ has $\\frac{30}{400} = 0.075 > 0.05$, so the correction is applied; a sample of $30$ from $3000$ has $\\frac{30}{3000} = 0.01$, so it is left out.\n\nCheck: for $30$ from $3000$ the factor is $\\frac{2970}{2999} \\approx 0.99$, which barely changes the variance, while for $30$ from $400$ it is $\\frac{370}{399} \\approx 0.93$.\n\n> **Watch out.** The rule looks at the fraction $\\frac{n}{N}$, not at $n$ or $N$ alone: $30$ from $400$ needs the correction, while $300$ from $10000$ does not, although $300$ is the larger sample.",
          "当样本容量超过总体容量的 5%（即抽样比 n / N > 0.05）时，通常需要应用有限总体校正。\n\n从 $400$ 中抽 $30$：$\\frac{30}{400} = 0.075 > 0.05$，需要校正；从 $3000$ 中抽 $30$：$\\frac{30}{3000} = 0.01$，可以不校正。\n\n检验：从 $3000$ 中抽 $30$ 时因子为 $\\frac{2970}{2999} \\approx 0.99$，几乎不改变方差；而从 $400$ 中抽 $30$ 时因子为 $\\frac{370}{399} \\approx 0.93$。\n\n> **注意。** 该准则看的是比值 $\\frac{n}{N}$，而不是单看 $n$ 或 $N$：从 $400$ 中抽 $30$ 需要校正，而从 $10000$ 中抽 $300$ 不需要，尽管 $300$ 是更大的样本。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(200, 1000);
          const isLarge = rng.int(0, 1) === 0;
          const n = isLarge ? Math.floor(N * 0.1) : Math.floor(N * 0.02);
          const prompt = t(
            `A researcher draws a simple random sample of size $n = ${n}$ without replacement from a population of size $N = ${N}$. According to standard statistical convention, is it necessary to apply the finite population correction (FPC)?`,
            `研究人员从容量为 $N = ${N}$ 的总体中不放回抽取容量为 $n = ${n}$ 的简单随机样本。根据常规统计学准则，是否需要应用有限总体校正因子（FPC）？`,
          );
          const solution = walked(
            [
              [
                ["Find the sampling fraction", "求抽样比"],
                t(
                  `$\\frac{n}{N} = \\frac{${n}}{${N}} \\approx ${(n / N).toFixed(3)}$.`,
                  `$\\frac{n}{N} = \\frac{${n}}{${N}} \\approx ${(n / N).toFixed(3)}$。`,
                ),
              ],
              [
                ["Compare with five percent", "与百分之五比较"],
                isLarge
                  ? t("The fraction exceeds $0.05$, so the FPC should be used.", "该比值超过 $0.05$，应当使用有限总体校正。")
                  : t(
                      "The fraction is at most $0.05$, so the FPC is close to $1$ and can be omitted.",
                      "该比值不超过 $0.05$，FPC 接近 $1$，可以忽略。",
                    ),
              ],
            ],
            t(
              `$0.05 \\cdot ${N} = ${dec(Q.of(N, 20))}$, and the sample of $${n}$ is ${isLarge ? "above" : "below"} that size.`,
              `$0.05 \\cdot ${N} = ${dec(Q.of(N, 20))}$，而样本容量 $${n}$ ${isLarge ? "超过" : "低于"}这个数。`,
            ),
          );
          return isLarge
            ? explainedChoice(rng, {
                prompt,
                correct: t(
                  `Yes, because the sampling fraction $\\frac{n}{N} = \\frac{${n}}{${N}} \\approx ${(n / N).toFixed(2)}$ exceeds $5\\%$.`,
                  `是，因为抽样比 $\\frac{n}{N} = \\frac{${n}}{${N}} \\approx ${(n / N).toFixed(2)}$ 超过了 $5\\%$。`,
                ),
                wrong: [
                  {
                    option: t(`No, FPC is only used when $n > 300$.`, `否，FPC 仅在 $n > 300$ 时使用。`),
                    why: t(
                      "The guideline depends on the fraction $\\frac{n}{N}$, not on a fixed sample size.",
                      "准则取决于比值 $\\frac{n}{N}$，而不是某个固定的样本容量。",
                    ),
                  },
                  {
                    option: t(`No, FPC is never needed for sample proportions.`, `否，样本比例从不需要使用 FPC。`),
                    why: t(
                      "Sampling without replacement shrinks the variance of $\\hat{p}$ just as it does for $\\bar{X}$.",
                      "不放回抽样会缩小 $\\hat{p}$ 的方差，与 $\\bar{X}$ 的情形一样。",
                    ),
                  },
                  {
                    option: t(
                      `Yes, because the population is finite, regardless of the sampling fraction.`,
                      `是，因为总体有限，与抽样比大小无关。`,
                    ),
                    why: t(
                      "Every real population is finite; when the fraction is tiny the factor is so close to $1$ that it is dropped.",
                      "现实中的总体都是有限的；抽样比很小时，因子非常接近 $1$，可以略去。",
                    ),
                  },
                ],
                solution,
              })
            : explainedChoice(rng, {
                prompt,
                correct: t(
                  `No, because the sampling fraction $\\frac{n}{N} = \\frac{${n}}{${N}} \\approx ${(n / N).toFixed(3)}$ is at most $5\\%$, making FPC negligible.`,
                  `否，因为抽样比 $\\frac{n}{N} = \\frac{${n}}{${N}} \\approx ${(n / N).toFixed(3)}$ 不超过 $5\\%$，FPC 的修正效果可以忽略。`,
                ),
                wrong: [
                  {
                    option: t(`Yes, FPC must always be applied whenever $N < 10000$.`, `是，只要 $N < 10000$ 就必须应用 FPC。`),
                    why: t(
                      "The guideline depends on the fraction $\\frac{n}{N}$, not on the population size alone.",
                      "准则取决于比值 $\\frac{n}{N}$，而不是单看总体容量。",
                    ),
                  },
                  {
                    option: t(`Yes, because sample proportions always require finite corrections.`, `是，因为样本比例总是需要有限校正。`),
                    why: t(
                      "With so small a fraction the factor is almost $1$, so the correction changes nothing that matters.",
                      "抽样比这么小，因子几乎等于 $1$，校正不会带来实质变化。",
                    ),
                  },
                  {
                    option: t(`Cannot be determined without knowing the sample variance.`, `在未知样本方差的情况下无法确定。`),
                    why: t(
                      "The decision uses only $n$ and $N$; the variance does not enter it.",
                      "这一判断只用到 $n$ 和 $N$；方差并不参与。",
                    ),
                  },
                ],
                solution,
              });
        },
      },
      {
        id: "the-corrected-variance-of-a-sample-proportion",
        title: t("The corrected variance of a sample proportion", "样本比例的修正方差"),
        explanation: t(
          "When the five percent guideline says the correction is needed, multiply the binomial variance by $\\frac{N - n}{N - 1}$:\n\n$$\\operatorname{Var}(\\hat{p}) = \\frac{\\hat{p}(1 - \\hat{p})}{n} \\cdot \\frac{N - n}{N - 1}.$$\n\nWith $\\hat{p}$ in place of $p$ this is the estimated variance used in practice. Surveying $40$ of $121$ residents with $\\hat{p} = 0.25$: $\\frac{0.1875}{40} \\cdot \\frac{81}{120} \\approx 0.00316$.\n\nCheck: the uncorrected variance is $\\frac{0.1875}{40} \\approx 0.00469$, and the corrected one is smaller by the factor $\\frac{81}{120} = 0.675$.\n\n> **Watch out.** Multiply by $\\frac{N - n}{N - 1}$, not by its reciprocal $\\frac{120}{81}$: the reciprocal would make the variance larger, about $0.00694$, although sampling a large share of the population makes $\\hat{p}$ more precise.",
          "当百分之五准则表明需要校正时，把二项方差乘以 $\\frac{N - n}{N - 1}$：\n\n$$\\operatorname{Var}(\\hat{p}) = \\frac{\\hat{p}(1 - \\hat{p})}{n} \\cdot \\frac{N - n}{N - 1}.$$\n\n用 $\\hat{p}$ 代替 $p$，就是实际使用的估计方差。例如调查 $121$ 名居民中的 $40$ 人，$\\hat{p} = 0.25$：$\\frac{0.1875}{40} \\cdot \\frac{81}{120} \\approx 0.00316$。\n\n检验：未校正的方差为 $\\frac{0.1875}{40} \\approx 0.00469$，校正后按因子 $\\frac{81}{120} = 0.675$ 变小。\n\n> **注意。** 要乘 $\\frac{N - n}{N - 1}$，而不是它的倒数 $\\frac{120}{81}$：倒数会让方差变大，约为 $0.00694$，而抽取总体的大部分本应使 $\\hat{p}$ 更精确。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.pick([41, 61, 81, 121, 161, 201]);
          const n = rng.pick([10, 20, 40].filter((v) => v < N / 2 && v * 20 > N));
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
            mistakes: apart(ans, [
              why(
                base,
                "This is the variance without the correction, as if the households were drawn with replacement.",
                "这是未校正的方差，好像各户是有放回地抽取的。",
              ),
              why(
                base.mul(Q.of(N - 1, N - n)),
                `This multiplies by the reciprocal $\\frac{${N - 1}}{${N - n}}$, which makes the variance larger instead of smaller.`,
                `这乘的是倒数 $\\frac{${N - 1}}{${N - n}}$，方差反而变大了。`,
              ),
              why(
                p.mul(Q.one.sub(p)).mul(Q.of(N - n, N - 1)),
                `This forgets to divide $\\hat{p}(1 - \\hat{p})$ by $n = ${n}$.`,
                `这忘了把 $\\hat{p}(1 - \\hat{p})$ 除以 $n = ${n}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Estimate the proportion", "估计比例"],
                  t(`$\\hat{p} = \\frac{${x}}{${n}}${lowestTerms(x, n)}$.`, `$\\hat{p} = \\frac{${x}}{${n}}${lowestTerms(x, n)}$。`),
                ],
                [
                  ["Find the uncorrected variance", "求未校正的方差"],
                  t(
                    `$\\frac{\\hat{p}(1 - \\hat{p})}{n} = ${base.toLatex()}$.`,
                    `$\\frac{\\hat{p}(1 - \\hat{p})}{n} = ${base.toLatex()}$。`,
                  ),
                ],
                [
                  ["Apply the correction", "进行校正"],
                  t(
                    `$${base.toLatex()} \\cdot \\frac{${N - n}}{${N - 1}} = ${ans.toLatex()}$.`,
                    `$${base.toLatex()} \\cdot \\frac{${N - n}}{${N - 1}} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The sampling fraction $\\frac{${n}}{${N}}$ is above $5\\%$, so the correction belongs here, and $${ans.toLatex()}$ is smaller than $${base.toLatex()}$.`,
                `抽样比 $\\frac{${n}}{${N}}$ 超过 $5\\%$，所以这里应当校正，并且 $${ans.toLatex()}$ 小于 $${base.toLatex()}$。`,
              ),
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
    intro: t(
      "The product $\\prod_{i=1}^{4} 2i$ multiplies the factor $2i$ for $i = 1, 2, 3, 4$: $2 \\cdot 4 \\cdot 6 \\cdot 8 = 384$. Each factor carries a $2$, so the constant comes out once per factor: $\\prod_{i=1}^{4} 2i = 2^{4} \\cdot (1 \\cdot 2 \\cdot 3 \\cdot 4) = 16 \\cdot 24$.\n\nCheck: $16 \\cdot 24 = 384$, the same as multiplying the four factors directly.\n\nIn this lesson we read and evaluate products written with $\\prod$, pull constants out as powers, add exponents and cancel telescoping factors, which is how likelihoods of independent observations are written and simplified.",
      "连乘 $\\prod_{i=1}^{4} 2i$ 表示把 $i = 1, 2, 3, 4$ 时的因子 $2i$ 相乘：$2 \\cdot 4 \\cdot 6 \\cdot 8 = 384$。每个因子都带一个 $2$，所以常数每个因子提出一次：$\\prod_{i=1}^{4} 2i = 2^{4} \\cdot (1 \\cdot 2 \\cdot 3 \\cdot 4) = 16 \\cdot 24$。\n\n检验：$16 \\cdot 24 = 384$，与直接把四个因子相乘的结果相同。\n\n本课我们阅读并计算用 $\\prod$ 写出的乘积，把常数作为幂提出，合并指数并约去逐项相消的因子；独立观测值的似然函数正是这样写出和化简的。",
    ),
    prerequisites: ["the-sample-mean"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-product-constant-powers",
        title: t("Evaluating products of powers and constants", "计算常数与幂次的连乘式"),
        explanation: t(
          "In a product over many terms, a constant factor appears once in each term, so it comes out raised to the number of terms. A constant factor comes out of a product as a power: $\\prod_{i=1}^n (c x_i) = c^n \\prod_{i=1}^n x_i$.\n\nWith $x_1, x_2, x_3 = 1, 3, 4$: $\\prod_{i=1}^{3} (2x_i) = 2 \\cdot 6 \\cdot 8 = 96$, and $2^{3} \\cdot (1 \\cdot 3 \\cdot 4) = 8 \\cdot 12 = 96$. A product of the constant alone is a power: $\\prod_{i=1}^{3} 5 = 5 \\cdot 5 \\cdot 5 = 125$.\n\nCheck: the index runs over $i = 1, 2, 3$, three values, so there are three factors and the exponent is $3$.\n\n> **Watch out.** A product of $n$ copies of $c$ is $c^{n}$, not $c \\cdot n$: $\\prod_{i=1}^{3} 5 = 125$, while $5 \\cdot 3 = 15$ is the sum $\\sum_{i=1}^{3} 5$.",
          "在多项的乘积中，常数因子在每一项中都出现一次，所以提出来时要取项数次幂。常数因子以幂的形式提出连乘：$\\prod_{i=1}^n (c x_i) = c^n \\prod_{i=1}^n x_i$。\n\n取 $x_1, x_2, x_3 = 1, 3, 4$：$\\prod_{i=1}^{3} (2x_i) = 2 \\cdot 6 \\cdot 8 = 96$，而 $2^{3} \\cdot (1 \\cdot 3 \\cdot 4) = 8 \\cdot 12 = 96$。常数自身的连乘是幂：$\\prod_{i=1}^{3} 5 = 5 \\cdot 5 \\cdot 5 = 125$。\n\n检验：下标取 $i = 1, 2, 3$ 共三个值，所以有三个因子，指数为 $3$。\n\n> **注意。** $n$ 个 $c$ 的乘积是 $c^{n}$，不是 $c \\cdot n$：$\\prod_{i=1}^{3} 5 = 125$，而 $5 \\cdot 3 = 15$ 是求和 $\\sum_{i=1}^{3} 5$。",
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
            mistakes: apart(ans, [
              why(
                c * n,
                `This adds $${c}$ to itself $${n}$ times, which is the sum $\\sum_{i=1}^{${n}} ${c}$, not the product.`,
                `这是把 $${c}$ 加了 $${n}$ 次，即求和 $\\sum_{i=1}^{${n}} ${c}$，不是乘积。`,
              ),
              why(
                c ** (n - 1),
                `This uses $${n - 1}$ factors; the index runs over $i = 1, \\dots, ${n}$, which is $${n}$ factors.`,
                `这只用了 $${n - 1}$ 个因子；下标取 $i = 1, \\dots, ${n}$，共 $${n}$ 个因子。`,
              ),
              why(
                c ** (n + 1),
                `This uses $${n + 1}$ factors, as if the index started at $i = 0$.`,
                `这用了 $${n + 1}$ 个因子，好像下标从 $i = 0$ 开始。`,
              ),
              why(
                n ** c,
                `This exchanges base and exponent; the base is the factor $${c}$ and the exponent is the number of factors $${n}$.`,
                `这把底数和指数交换了；底数是因子 $${c}$，指数是因子个数 $${n}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Count the factors", "数因子个数"],
                  t(
                    `The index runs over $i = 1, \\dots, ${n}$, so there are $${n}$ factors, each equal to $${c}$.`,
                    `下标取 $i = 1, \\dots, ${n}$，共 $${n}$ 个因子，每个都等于 $${c}$。`,
                  ),
                ],
                [
                  ["Write the power", "写成幂"],
                  t(`$\\prod_{i=1}^{${n}} ${c} = ${c}^{${n}} = ${ans}$.`, `$\\prod_{i=1}^{${n}} ${c} = ${c}^{${n}} = ${ans}$。`),
                ],
              ],
              t(
                `Dividing $${ans}$ by $${c}$ repeatedly reaches $1$ after exactly $${n}$ divisions.`,
                `把 $${ans}$ 连续除以 $${c}$，恰好 $${n}$ 次后得到 $1$。`,
              ),
            ),
          });
        },
      },
      {
        id: "products-that-depend-on-the-index",
        title: t("Products that depend on the index", "依赖下标的乘积"),
        explanation: t(
          "When the factor depends on $i$, write out the first few factors to see the pattern. Two patterns are common:\n\n- powers add in the exponent: $\\prod_{i=1}^{n} a^{i} = a^{1 + 2 + \\cdots + n} = a^{n(n+1)/2}$;\n- ratios telescope: $\\prod_{i=1}^{n} \\frac{i + 1}{i} = 2 \\cdot \\frac{3}{2} \\cdots \\frac{n + 1}{n} = n + 1$.\n\nThe first pattern is why likelihoods turn into sums in the exponent; taking logarithms does the same thing in general.\n\nFor example, $\\prod_{i=1}^{4} 2^{i} = 2^{1 + 2 + 3 + 4} = 2^{10} = 1024$, and $\\prod_{i=1}^{5} \\frac{i + 1}{i} = 6$.\n\nCheck: $2 \\cdot 4 \\cdot 8 \\cdot 16 = 1024$, and in $2 \\cdot \\frac{3}{2} \\cdot \\frac{4}{3} \\cdot \\frac{5}{4} \\cdot \\frac{6}{5}$ every numerator cancels the next denominator, leaving the last numerator $6$.\n\n> **Watch out.** In $\\prod_{i=1}^{4} 2^{i}$ the exponents add to $10$; they do not multiply to $1 \\cdot 2 \\cdot 3 \\cdot 4 = 24$, and the answer is not $2^{4} = 16$, which would treat every factor as $2$.",
          "当因子依赖于 $i$ 时，写出前几个因子来看规律。常见的两种：\n\n- 指数相加：$\\prod_{i=1}^{n} a^{i} = a^{1 + 2 + \\cdots + n} = a^{n(n+1)/2}$；\n- 比值相消：$\\prod_{i=1}^{n} \\frac{i + 1}{i} = 2 \\cdot \\frac{3}{2} \\cdots \\frac{n + 1}{n} = n + 1$。\n\n第一种正是似然函数变成指数中求和的原因；一般地，取对数也起同样的作用。\n\n例如 $\\prod_{i=1}^{4} 2^{i} = 2^{1 + 2 + 3 + 4} = 2^{10} = 1024$，$\\prod_{i=1}^{5} \\frac{i + 1}{i} = 6$。\n\n检验：$2 \\cdot 4 \\cdot 8 \\cdot 16 = 1024$；而在 $2 \\cdot \\frac{3}{2} \\cdot \\frac{4}{3} \\cdot \\frac{5}{4} \\cdot \\frac{6}{5}$ 中，每个分子与下一个分母约去，只剩下最后一个分子 $6$。\n\n> **注意。** 在 $\\prod_{i=1}^{4} 2^{i}$ 中指数相加得 $10$，而不是相乘得 $1 \\cdot 2 \\cdot 3 \\cdot 4 = 24$；答案也不是 $2^{4} = 16$，那是把每个因子都当成 $2$。",
        ),
        generate: (rng: Rng): Problem => {
          const kind = rng.int(0, 2);
          if (kind === 0) {
            const a = rng.pick([2, 3]);
            const n = rng.int(2, a === 2 ? 4 : 3);
            const e = (n * (n + 1)) / 2;
            const ans = a ** e;
            return numberProblem({
              prompt: t(`Evaluate $\\prod_{i=1}^{${n}} ${a}^{i}$.`, `计算 $\\prod_{i=1}^{${n}} ${a}^{i}$。`),
              answer: ans,
              wrong: [a ** n, a * n, a ** (n * n)].filter((w) => w !== ans),
              mistakes: apart(ans, [
                why(
                  a ** n,
                  `This treats every factor as $${a}$; the factors are $${a}, \\dots, ${a}^{${n}}$ and their exponents add.`,
                  `这把每个因子都当成了 $${a}$；因子是 $${a}, \\dots, ${a}^{${n}}$，指数要相加。`,
                ),
                why(
                  a * n,
                  `This multiplies $${a}$ by the number of factors instead of multiplying the factors.`,
                  `这把 $${a}$ 乘以因子个数，而不是把各因子相乘。`,
                ),
                why(
                  a ** (n * n),
                  `This uses the exponent $${n} \\cdot ${n}$; the exponents add to $1 + \\cdots + ${n} = ${e}$.`,
                  `这用了指数 $${n} \\cdot ${n}$；指数应相加为 $1 + \\cdots + ${n} = ${e}$。`,
                ),
              ]),
              solution: walked(
                [
                  [
                    ["Add the exponents", "指数相加"],
                    t(
                      `$\\prod_{i=1}^{${n}} ${a}^{i} = ${a}^{1 + \\cdots + ${n}} = ${a}^{${e}}$.`,
                      `$\\prod_{i=1}^{${n}} ${a}^{i} = ${a}^{1 + \\cdots + ${n}} = ${a}^{${e}}$。`,
                    ),
                  ],
                  [["Evaluate the power", "计算幂"], t(`$${a}^{${e}} = ${ans}$.`, `$${a}^{${e}} = ${ans}$。`)],
                ],
                t(
                  `Multiplying the factors directly: $${Array.from({ length: n }, (_, i) => a ** (i + 1)).join(" \\cdot ")} = ${ans}$.`,
                  `直接把因子相乘：$${Array.from({ length: n }, (_, i) => a ** (i + 1)).join(" \\cdot ")} = ${ans}$。`,
                ),
              ),
            });
          }
          const a = rng.int(1, 5);
          const n = rng.int(3, 30);
          const ans = kind === 1 ? Q.of(n + a, a) : Q.of(a, n + a);
          const early = kind === 1 ? Q.of(n + a - 1, a) : Q.of(a, n + a - 1);
          const factor = (kind === 1 ? `\\frac{i + ${a}}{i + ${a - 1}}` : `\\frac{i + ${a - 1}}{i + ${a}}`).replace("i + 0", "i");
          const first = kind === 1 ? (a === 1 ? "2" : `\\frac{${1 + a}}{${a}}`) : `\\frac{${a}}{${1 + a}}`;
          const last = kind === 1 ? `\\frac{${n + a}}{${n + a - 1}}` : `\\frac{${n + a - 1}}{${n + a}}`;
          return numberProblem({
            prompt: t(`Evaluate $\\prod_{i=1}^{${n}} ${factor}$.`, `计算 $\\prod_{i=1}^{${n}} ${factor}$。`),
            answer: ans,
            wrong: [Q.one.div(ans), ans.add(Q.one), Q.of(n)].filter((w) => !w.eq(ans)),
            mistakes: apart(ans, [
              why(
                Q.one.div(ans),
                "This turns the result upside down; keep the last numerator and the first denominator in their places.",
                "这把结果颠倒了；最后一个分子和第一个分母要保持原位。",
              ),
              why(
                early,
                `This stops one factor early, at $i = ${n - 1}$; the last factor is $${last}$.`,
                `这提前一个因子停止，停在 $i = ${n - 1}$；最后一个因子是 $${last}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Write out the first and last factors", "写出首尾因子"],
                  t(`$${first} \\cdot \\cdots \\cdot ${last}$.`, `$${first} \\cdot \\cdots \\cdot ${last}$。`),
                ],
                [
                  ["Cancel", "约去"],
                  t(
                    `Each numerator cancels the next denominator, leaving ${kind === 1 ? "the last numerator over the first denominator" : "the first numerator over the last denominator"}: $${ans.toLatex()}$.`,
                    `每个分子与下一个分母约去，剩下${kind === 1 ? "最后一个分子除以第一个分母" : "第一个分子除以最后一个分母"}：$${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `${kind === 1 ? "Every factor is above $1$, so the product is above $1$" : "Every factor is below $1$, so the product is below $1$"}, as $${ans.toLatex()}$ is.`,
                `${kind === 1 ? "每个因子都大于 $1$，所以乘积大于 $1$" : "每个因子都小于 $1$，所以乘积小于 $1$"}，$${ans.toLatex()}$ 正是如此。`,
              ),
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
    intro: t(
      "A coin with unknown chance $p$ of heads lands $H, H, T, H, T$. The trials are independent, so the probability of this exact sequence is $p \\cdot p \\cdot (1 - p) \\cdot p \\cdot (1 - p) = p^{3}(1 - p)^{2}$, and read as a function of $p$ this is the likelihood $L(p)$. At $p = \\frac{1}{2}$ it is $\\frac{1}{32} = 0.03125$; at $p = 0.6$ it is $0.216 \\cdot 0.16 = 0.03456$.\n\nCheck: $0.03456 > 0.03125$, so $p = 0.6$ makes the observed flips more probable than a fair coin, which fits $3$ heads in $5$ flips.\n\nIn this lesson we write the likelihood of independent discrete observations as a product, and evaluate and compare it at candidate parameter values.",
      "一枚正面概率 $p$ 未知的硬币掷出 $H, H, T, H, T$。各次相互独立，所以恰好出现这个序列的概率为 $p \\cdot p \\cdot (1 - p) \\cdot p \\cdot (1 - p) = p^{3}(1 - p)^{2}$，把它看作 $p$ 的函数就是似然函数 $L(p)$。在 $p = \\frac{1}{2}$ 处其值为 $\\frac{1}{32} = 0.03125$；在 $p = 0.6$ 处为 $0.216 \\cdot 0.16 = 0.03456$。\n\n检验：$0.03456 > 0.03125$，所以 $p = 0.6$ 比均匀硬币更能使观测结果出现，这与 $5$ 次中 $3$ 次正面相符。\n\n本课我们把独立离散观测值的似然函数写成乘积，并在候选参数值处计算和比较它。",
    ),
    prerequisites: ["product-notation"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "bernoulli-likelihood-formulation",
        title: t("Formulating the Bernoulli likelihood function", "构建伯努利似然函数"),
        explanation: t(
          "The likelihood is the probability of the observed data viewed as a function of the parameter, and independent trials multiply. For $n$ independent Bernoulli trials with $k$ successes, $L(p) = p^k (1 - p)^{n - k}$.\n\nFour trials give success, failure, success, success. Each success contributes a factor $p$ and the failure a factor $1 - p$, so $L(p) = p \\cdot (1 - p) \\cdot p \\cdot p = p^{3}(1 - p)$.\n\nCheck: the exponents $3 + 1 = 4$ add up to the number of trials, and at $p = \\frac{1}{2}$ the likelihood is $\\frac{1}{16}$, the chance of any one sequence of four fair flips.\n\n> **Watch out.** The exponent of $p$ is the number of successes, not the number of trials: $p^{4}(1 - p)$ would describe five trials. And the factors multiply; $3p + (1 - p)$ is not a probability of the sequence at all.",
          "似然函数是把观测数据的概率看作参数的函数，独立试验的概率要相乘。对含有 $k$ 次成功的 $n$ 次独立伯努利试验，似然函数为 $L(p) = p^k (1 - p)^{n - k}$。\n\n四次试验结果为成功、失败、成功、成功。每次成功贡献因子 $p$，失败贡献因子 $1 - p$，所以 $L(p) = p \\cdot (1 - p) \\cdot p \\cdot p = p^{3}(1 - p)$。\n\n检验：指数之和 $3 + 1 = 4$ 等于试验次数；在 $p = \\frac{1}{2}$ 处似然为 $\\frac{1}{16}$，正是四次均匀抛掷中任一特定序列的概率。\n\n> **注意。** $p$ 的指数是成功次数，不是试验次数：$p^{4}(1 - p)$ 描述的是五次试验。并且各因子相乘；$3p + (1 - p)$ 根本不是该序列的概率。",
        ),
        generate: (rng: Rng): Problem => {
          const n = 2 * rng.int(3, 15) + 1; // odd n guarantees k !== n - k
          const k = rng.int(1, n - 1);
          const diff = n - k;
          const pw = (base: string, e: number) => (e === 1 ? base : `${base}^{${e}}`);
          const lik = (a: number, b: number) => `${pw("p", a)} ${pw("(1 - p)", b)}`;
          const math = (s: string) => t(`$${s}$`, `$${s}$`);

          return explainedChoice(rng, {
            prompt: t(
              `In a sample of $n = ${n}$ independent Bernoulli trials with parameter $p$, exactly $k = ${k}$ ${k === 1 ? "success" : "successes"} and $${diff}$ ${diff === 1 ? "failure" : "failures"} are observed. What is the likelihood function $L(p)$ (omitting constant combinatorial factor)?`,
              `在参数为 $p$ 的 $n = ${n}$ 次独立伯努利试验中，观测到恰好 $k = ${k}$ 次成功与 $${diff}$ 次失败。其似然函数 $L(p)$ 是什么（忽略常数组合数因子）？`,
            ),
            correct: math(lik(k, diff)),
            wrong: [
              {
                option: math(lik(n, k)),
                why: t(
                  `The exponent of $p$ is the number of successes, $${k}$, not the number of trials.`,
                  `$p$ 的指数是成功次数 $${k}$，不是试验次数。`,
                ),
              },
              {
                option: math(lik(diff, k)),
                why: t(
                  "The exponents are exchanged: $p$ goes with the successes and $1 - p$ with the failures.",
                  "指数弄反了：$p$ 对应成功，$1 - p$ 对应失败。",
                ),
              },
              {
                option: math(`${k === 1 ? "" : k}p + ${diff === 1 ? "" : diff}(1 - p)`),
                why: t(
                  "This adds the outcomes, but independent trials multiply their probabilities.",
                  "这里把结果相加了，而独立试验的概率要相乘。",
                ),
              },
            ],
            solution: walked(
              [
                [
                  ["Give each trial its factor", "写出每次试验的因子"],
                  t(
                    `Each of the $${k}$ ${k === 1 ? "success contributes" : "successes contributes"} $p$ and each of the $${diff}$ ${diff === 1 ? "failure contributes" : "failures contributes"} $1 - p$.`,
                    `$${k}$ 次成功各贡献 $p$，$${diff}$ 次失败各贡献 $1 - p$。`,
                  ),
                ],
                [
                  ["Multiply the independent factors", "把独立的因子相乘"],
                  t(`$L(p) = p^k (1 - p)^{n - k} = ${lik(k, diff)}$.`, `$L(p) = p^k (1 - p)^{n - k} = ${lik(k, diff)}$。`),
                ],
              ],
              t(
                `The exponents add up to $${k} + ${diff} = ${n}$, the number of trials.`,
                `指数之和 $${k} + ${diff} = ${n}$，等于试验次数。`,
              ),
            ),
          });
        },
      },
      {
        id: "evaluating-a-likelihood-and-comparing-values",
        title: t("Evaluating a likelihood and comparing values", "计算并比较似然值"),
        explanation: t(
          "A likelihood can be evaluated at any candidate parameter value; the larger value is the one that makes the observed data more probable. For $k$ successes in $n$ Bernoulli trials, $L(p) = p^{k}(1 - p)^{n-k}$.\n\nWith $3$ successes in $4$ trials, $L\\left(\\tfrac{1}{2}\\right) = \\tfrac{1}{16}$ and $L\\left(\\tfrac{3}{4}\\right) = \\tfrac{27}{256} \\approx 0.105$, so $p = \\tfrac{3}{4}$ is better supported. The **likelihood ratio** $\\frac{L(p_1)}{L(p_2)}$ measures by how much: here $\\frac{27}{256} \\div \\frac{1}{16} = \\frac{27}{16} \\approx 1.69$.\n\nCheck: $\\frac{27}{16} \\cdot \\frac{1}{16} = \\frac{27}{256}$, and the ratio is above $1$ exactly because $L\\left(\\tfrac{3}{4}\\right)$ is the larger likelihood.\n\n> **Watch out.** Keep the order of the ratio: $\\frac{L(p_1)}{L(p_2)}$ puts $p_1$ on top. The upside-down $\\frac{16}{27} \\approx 0.59$ would seem to favour $p = \\tfrac{1}{2}$, the opposite conclusion.",
          "似然函数可以在任一候选参数值处计算；值越大，说明该参数使观测数据越可能出现。对于 $n$ 次伯努利试验中 $k$ 次成功，$L(p) = p^{k}(1 - p)^{n-k}$。\n\n若 $4$ 次试验中成功 $3$ 次，$L\\left(\\tfrac{1}{2}\\right) = \\tfrac{1}{16}$，$L\\left(\\tfrac{3}{4}\\right) = \\tfrac{27}{256} \\approx 0.105$，所以 $p = \\tfrac{3}{4}$ 更受支持。**似然比** $\\frac{L(p_1)}{L(p_2)}$ 衡量支持的程度：这里 $\\frac{27}{256} \\div \\frac{1}{16} = \\frac{27}{16} \\approx 1.69$。\n\n检验：$\\frac{27}{16} \\cdot \\frac{1}{16} = \\frac{27}{256}$；比值大于 $1$，正是因为 $L\\left(\\tfrac{3}{4}\\right)$ 是较大的似然。\n\n> **注意。** 保持比值的顺序：$\\frac{L(p_1)}{L(p_2)}$ 把 $p_1$ 放在分子上。颠倒后的 $\\frac{16}{27} \\approx 0.59$ 会显得支持 $p = \\tfrac{1}{2}$，结论恰好相反。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(3, 7);
          const k = rng.int(1, n - 1);
          const p1 = rng.pick([Q.of(1, 3), Q.of(2, 3), Q.of(1, 4), Q.of(3, 4)]);
          const p2 = Q.of(1, 2);
          const L = (p: Q): Q => p.pow(k).mul(Q.one.sub(p).pow(n - k));
          const ans = L(p1).div(L(p2));
          const form = `${k === 1 ? "p" : `p^{${k}}`}${n - k === 1 ? "(1 - p)" : `(1 - p)^{${n - k}}`}`;
          return numberProblem({
            prompt: t(
              `In $n = ${n}$ independent Bernoulli trials there ${k === 1 ? "is" : "are"} $k = ${k}$ ${k === 1 ? "success" : "successes"}, so $L(p) = ${form}$. Find the likelihood ratio $\\frac{L(${p1.toLatex()})}{L(\\frac{1}{2})}$.`,
              `$n = ${n}$ 次独立伯努利试验中成功 $k = ${k}$ 次，所以 $L(p) = ${form}$。求似然比 $\\frac{L(${p1.toLatex()})}{L(\\frac{1}{2})}$。`,
            ),
            answer: ans,
            wrong: [Q.one.div(ans), L(p1), L(p2)].filter((w) => !w.eq(ans)),
            mistakes: apart(ans, [
              why(
                Q.one.div(ans),
                `This is $\\frac{L(\\frac{1}{2})}{L(${p1.toLatex()})}$, the ratio upside down.`,
                `这是 $\\frac{L(\\frac{1}{2})}{L(${p1.toLatex()})}$，比值颠倒了。`,
              ),
              why(
                L(p1),
                `This is $L(${p1.toLatex()})$ alone; it still has to be divided by $L(\\frac{1}{2})$.`,
                `这只是 $L(${p1.toLatex()})$；还要除以 $L(\\frac{1}{2})$。`,
              ),
              why(L(p2), "This is $L(\\frac{1}{2})$ alone, the denominator of the ratio.", "这只是 $L(\\frac{1}{2})$，即比值的分母。"),
            ]),
            solution: walked(
              [
                [
                  [`Evaluate at $${p1.toLatex()}$`, `在 $${p1.toLatex()}$ 处求值`],
                  t(`$L(${p1.toLatex()}) = ${L(p1).toLatex()}$.`, `$L(${p1.toLatex()}) = ${L(p1).toLatex()}$。`),
                ],
                [
                  ["Evaluate at one half", "在二分之一处求值"],
                  t(
                    `$L(\\frac{1}{2}) = \\frac{1}{2^{${n}}} = ${L(p2).toLatex()}$.`,
                    `$L(\\frac{1}{2}) = \\frac{1}{2^{${n}}} = ${L(p2).toLatex()}$。`,
                  ),
                ],
                [
                  ["Divide", "相除"],
                  t(
                    `$\\frac{L(${p1.toLatex()})}{L(\\frac{1}{2})} = ${L(p1).toLatex()} \\cdot 2^{${n}} = ${ans.toLatex()}$.`,
                    `$\\frac{L(${p1.toLatex()})}{L(\\frac{1}{2})} = ${L(p1).toLatex()} \\cdot 2^{${n}} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$${ans.toLatex()} \\cdot ${L(p2).toLatex()} = ${L(p1).toLatex()}$, and the ratio is ${ans.cmp(Q.one) > 0 ? "above" : "below"} $1$ because $${p1.toLatex()}$ ${ans.cmp(Q.one) > 0 ? "explains the data better" : "explains the data less well"} than $\\frac{1}{2}$.`,
                `$${ans.toLatex()} \\cdot ${L(p2).toLatex()} = ${L(p1).toLatex()}$；比值${ans.cmp(Q.one) > 0 ? "大于" : "小于"} $1$，因为 $${p1.toLatex()}$ 对数据的解释${ans.cmp(Q.one) > 0 ? "优于" : "不如"} $\\frac{1}{2}$。`,
              ),
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
    intro: t(
      "Five flips $H, H, T, H, T$ have likelihood $L(p) = p^{3}(1 - p)^{2}$. The logarithm of a product is the sum of the logarithms, and the logarithm of a power brings the exponent down, so $\\ln L(p) = 3\\ln p + 2\\ln(1 - p)$. At $p = 0.6$ this is $3(-0.511) + 2(-0.916) \\approx -3.365$.\n\nCheck: $L(0.6) = 0.216 \\cdot 0.16 = 0.03456$, and $\\ln 0.03456 \\approx -3.365$, the same value.\n\nIn this lesson we take the logarithm of a discrete likelihood, turning its product into a sum, for Bernoulli and Poisson samples.",
      "五次抛掷 $H, H, T, H, T$ 的似然函数为 $L(p) = p^{3}(1 - p)^{2}$。乘积的对数等于对数之和，幂的对数把指数提到前面，所以 $\\ln L(p) = 3\\ln p + 2\\ln(1 - p)$。在 $p = 0.6$ 处其值为 $3(-0.511) + 2(-0.916) \\approx -3.365$。\n\n检验：$L(0.6) = 0.216 \\cdot 0.16 = 0.03456$，而 $\\ln 0.03456 \\approx -3.365$，数值相同。\n\n本课我们对离散型似然函数取对数，把乘积变成和，用于伯努利样本和泊松样本。",
    ),
    prerequisites: ["likelihood-functions-for-discrete-probability-distributions", "logarithmic-differentiation"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "bernoulli-log-likelihood-expression",
        title: t("Expressing the log-likelihood of a Bernoulli sample", "表示伯努利样本的对数似然函数"),
        explanation: t(
          "Taking logarithms turns the product into a sum, which is easier to differentiate and has its maximum at the same parameter value. $\\ln L(p) = k \\ln p + (n - k) \\ln(1 - p)$.\n\nWith $3$ successes and $1$ failure, $L(p) = p^{3}(1 - p)$, so $\\ln L(p) = 3\\ln p + \\ln(1 - p)$.\n\nCheck: at $p = \\frac{1}{2}$ this gives $3\\ln\\frac{1}{2} + \\ln\\frac{1}{2} = 4\\ln\\frac{1}{2} = \\ln\\frac{1}{16}$, the logarithm of $L\\left(\\frac{1}{2}\\right) = \\frac{1}{16}$.\n\n> **Watch out.** $\\ln(p^{3}) = 3\\ln p$, not $(\\ln p)^{3}$: the exponent comes down as a coefficient. And the logarithm of a product is a sum of logarithms, not the sum $p^{3} + (1 - p)$ of the factors.",
          "取对数把乘积变成和，更容易求导，而且最大值出现在相同的参数值处。$\\ln L(p) = k \\ln p + (n - k) \\ln(1 - p)$。\n\n若成功 $3$ 次、失败 $1$ 次，$L(p) = p^{3}(1 - p)$，所以 $\\ln L(p) = 3\\ln p + \\ln(1 - p)$。\n\n检验：在 $p = \\frac{1}{2}$ 处得 $3\\ln\\frac{1}{2} + \\ln\\frac{1}{2} = 4\\ln\\frac{1}{2} = \\ln\\frac{1}{16}$，正是 $L\\left(\\frac{1}{2}\\right) = \\frac{1}{16}$ 的对数。\n\n> **注意。** $\\ln(p^{3}) = 3\\ln p$，不是 $(\\ln p)^{3}$：指数变成系数。并且乘积的对数是各对数之和，而不是各因子之和 $p^{3} + (1 - p)$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = 2 * rng.int(3, 20) + 1; // odd n guarantees k !== n - k
          const k = rng.int(2, n - 2);
          const diff = n - k;
          const math = (s: string) => t(`$${s}$`, `$${s}$`);

          return explainedChoice(rng, {
            prompt: t(
              `For $n = ${n}$ independent Bernoulli trials resulting in $k = ${k}$ successes and $${diff}$ failures, what is the log-likelihood function $\\ln L(p)$?`,
              `对于取得 $k = ${k}$ 次成功与 $${diff}$ 次失败的 $n = ${n}$ 次独立伯努利试验，其对数似然函数 $\\ln L(p)$ 是什么？`,
            ),
            correct: math(`${k} \\ln(p) + ${diff} \\ln(1 - p)`),
            wrong: [
              {
                option: math(`${diff} \\ln(p) + ${k} \\ln(1 - p)`),
                why: t(
                  "The coefficients are exchanged: the number of successes goes with $\\ln(p)$.",
                  "系数弄反了：成功次数对应 $\\ln(p)$。",
                ),
              },
              {
                option: math(`p^{${k}} + (1 - p)^{${diff}}`),
                why: t("No logarithm has been taken, and the product has become a sum.", "这里没有取对数，乘积还变成了和。"),
              },
              {
                option: math(`${n} \\ln(p (1 - p))`),
                why: t("This counts every trial as both a success and a failure.", "这把每次试验既算作成功又算作失败。"),
              },
            ],
            solution: walked(
              [
                [
                  ["Write the likelihood", "写出似然函数"],
                  t(`$L(p) = p^{${k}}(1 - p)^{${diff}}$.`, `$L(p) = p^{${k}}(1 - p)^{${diff}}$。`),
                ],
                [
                  ["Take logarithms", "取对数"],
                  t(
                    `The log of a product is a sum and exponents come down: $\\ln L(p) = ${k} \\ln(p) + ${diff} \\ln(1 - p)$.`,
                    `乘积的对数是和，指数提到前面：$\\ln L(p) = ${k} \\ln(p) + ${diff} \\ln(1 - p)$。`,
                  ),
                ],
              ],
              t(
                `At $p = \\frac{1}{2}$ the expression is $${n} \\ln\\frac{1}{2}$, the log of $L\\left(\\frac{1}{2}\\right) = \\frac{1}{2^{${n}}}$, and the coefficients add up to $${n}$ trials.`,
                `在 $p = \\frac{1}{2}$ 处该式为 $${n} \\ln\\frac{1}{2}$，正是 $L\\left(\\frac{1}{2}\\right) = \\frac{1}{2^{${n}}}$ 的对数，系数之和为试验次数 $${n}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-poisson-log-likelihood",
        title: t("The Poisson log-likelihood", "泊松分布的对数似然"),
        explanation: t(
          "For a Poisson sample, $p(x; \\lambda) = \\frac{e^{-\\lambda}\\lambda^{x}}{x!}$, and the log turns each factor into a sum:\n\n$$\\ln L(\\lambda) = -n\\lambda + \\left(\\sum x_i\\right)\\ln\\lambda - \\sum \\ln(x_i!).$$\n\nThe last term does not involve $\\lambda$, so it does not affect where the maximum is. The data enter only through $n$ and $\\sum x_i$, which is why the sum is a sufficient statistic.\n\nFor the counts $2, 0, 3$: $n = 3$ and $\\sum x_i = 5$, so $\\ln L(\\lambda) = -3\\lambda + 5\\ln\\lambda - \\ln(2! \\cdot 0! \\cdot 3!) = -3\\lambda + 5\\ln\\lambda - \\ln 12$.\n\nCheck: at $\\lambda = 1$ this is $-3 - \\ln 12$, and directly $L(1) = \\frac{e^{-1}}{2} \\cdot e^{-1} \\cdot \\frac{e^{-1}}{6} = \\frac{e^{-3}}{12}$, whose logarithm is the same.\n\n> **Watch out.** Each observation brings its own factor $e^{-\\lambda}$, so the first term is $-n\\lambda = -3\\lambda$, not $-\\lambda$. The coefficient of $\\ln\\lambda$ is the total count $5$, not the number of observations $3$.",
          "对于泊松样本，$p(x; \\lambda) = \\frac{e^{-\\lambda}\\lambda^{x}}{x!}$，取对数把每个因子变成和：\n\n$$\\ln L(\\lambda) = -n\\lambda + \\left(\\sum x_i\\right)\\ln\\lambda - \\sum \\ln(x_i!).$$\n\n最后一项不含 $\\lambda$，因此不影响最大值的位置。数据只通过 $n$ 和 $\\sum x_i$ 进入，这正是和为充分统计量的原因。\n\n对计数 $2, 0, 3$：$n = 3$，$\\sum x_i = 5$，所以 $\\ln L(\\lambda) = -3\\lambda + 5\\ln\\lambda - \\ln(2! \\cdot 0! \\cdot 3!) = -3\\lambda + 5\\ln\\lambda - \\ln 12$。\n\n检验：在 $\\lambda = 1$ 处其值为 $-3 - \\ln 12$；直接计算 $L(1) = \\frac{e^{-1}}{2} \\cdot e^{-1} \\cdot \\frac{e^{-1}}{6} = \\frac{e^{-3}}{12}$，其对数相同。\n\n> **注意。** 每个观测都带一个因子 $e^{-\\lambda}$，所以第一项是 $-n\\lambda = -3\\lambda$，而不是 $-\\lambda$。$\\ln\\lambda$ 的系数是总计数 $5$，而不是观测个数 $3$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 30);
          const s = rng.int(n + 1, 6 * n);
          const math = (x: string) => t(`$${x}$`, `$${x}$`);
          return explainedChoice(rng, {
            prompt: t(
              `A sample of $n = ${n}$ counts from $\\text{Poisson}(\\lambda)$ has $\\sum x_i = ${s}$. Which is the log-likelihood $\\ln L(\\lambda)$, where $C = \\sum \\ln(x_i!)$ does not depend on $\\lambda$?`,
              `来自 $\\text{Poisson}(\\lambda)$ 的 $n = ${n}$ 个计数满足 $\\sum x_i = ${s}$。对数似然 $\\ln L(\\lambda)$ 是哪一个？其中 $C = \\sum \\ln(x_i!)$ 与 $\\lambda$ 无关。`,
            ),
            correct: math(`-${n}\\lambda + ${s}\\ln\\lambda - C`),
            wrong: [
              {
                option: math(`-\\lambda + ${s}\\ln\\lambda - C`),
                why: t(
                  `This keeps the factor $e^{-\\lambda}$ only once; each of the $${n}$ observations brings one.`,
                  `这里只保留了一个因子 $e^{-\\lambda}$；$${n}$ 个观测各带一个。`,
                ),
              },
              {
                option: math(`-${n}\\lambda + ${n}\\ln\\lambda - C`),
                why: t(
                  `The exponents of $\\lambda$ add up to the total count $\\sum x_i = ${s}$, not to the number of observations.`,
                  `$\\lambda$ 的指数之和是总计数 $\\sum x_i = ${s}$，不是观测个数。`,
                ),
              },
              {
                option: math(`-${s}\\lambda + ${n}\\ln\\lambda - C`),
                why: t(
                  "The two coefficients are exchanged: $n$ goes with $-\\lambda$ and $\\sum x_i$ with $\\ln\\lambda$.",
                  "两个系数弄反了：$n$ 对应 $-\\lambda$，$\\sum x_i$ 对应 $\\ln\\lambda$。",
                ),
              },
            ],
            solution: walked(
              [
                [
                  ["Take the log of one factor", "对一个因子取对数"],
                  t(
                    "Each observation contributes $\\ln\\frac{e^{-\\lambda}\\lambda^{x_i}}{x_i!} = -\\lambda + x_i\\ln\\lambda - \\ln(x_i!)$.",
                    "每个观测贡献 $\\ln\\frac{e^{-\\lambda}\\lambda^{x_i}}{x_i!} = -\\lambda + x_i\\ln\\lambda - \\ln(x_i!)$。",
                  ),
                ],
                [
                  ["Sum over the sample", "对样本求和"],
                  t(
                    `Summing over $${n}$ observations gives $-${n}\\lambda + ${s}\\ln\\lambda - C$.`,
                    `对 $${n}$ 个观测求和得 $-${n}\\lambda + ${s}\\ln\\lambda - C$。`,
                  ),
                ],
              ],
              t(
                `Setting the derivative $-${n} + \\frac{${s}}{\\lambda}$ to zero gives $\\lambda = \\frac{${s}}{${n}}$, the sample mean, as a Poisson estimate should.`,
                `令导数 $-${n} + \\frac{${s}}{\\lambda}$ 为零得 $\\lambda = \\frac{${s}}{${n}}$，即样本均值，这正符合泊松估计。`,
              ),
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
    intro: t(
      "Two waiting times $0.5$ and $1.5$ minutes come from an exponential density $f(x; \\lambda) = \\lambda e^{-\\lambda x}$. Their likelihood is the product of the two density values, $L(\\lambda) = \\lambda e^{-0.5\\lambda} \\cdot \\lambda e^{-1.5\\lambda} = \\lambda^{2} e^{-2\\lambda}$. At $\\lambda = 1$ this is $e^{-2} \\approx 0.135$, and at $\\lambda = 0.5$ it is $0.25 e^{-1} \\approx 0.092$.\n\nCheck: the exponents $-0.5\\lambda - 1.5\\lambda = -2\\lambda$ add up to $-\\lambda$ times the total $0.5 + 1.5 = 2$.\n\nIn this lesson we write the likelihood of independent continuous observations as a product of density values, including densities like the uniform whose support depends on the parameter.",
      "两个等待时间 $0.5$ 与 $1.5$ 分钟来自指数密度 $f(x; \\lambda) = \\lambda e^{-\\lambda x}$。其似然是两个密度值的乘积：$L(\\lambda) = \\lambda e^{-0.5\\lambda} \\cdot \\lambda e^{-1.5\\lambda} = \\lambda^{2} e^{-2\\lambda}$。在 $\\lambda = 1$ 处为 $e^{-2} \\approx 0.135$，在 $\\lambda = 0.5$ 处为 $0.25 e^{-1} \\approx 0.092$。\n\n检验：指数 $-0.5\\lambda - 1.5\\lambda = -2\\lambda$，等于 $-\\lambda$ 乘以总和 $0.5 + 1.5 = 2$。\n\n本课我们把独立连续观测值的似然写成密度值的乘积，也包括像均匀分布这样支撑集依赖于参数的密度。",
    ),
    prerequisites: ["product-notation", "probability-density-functions-of-continuous-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "exponential-likelihood-formulation",
        title: t("Formulating the likelihood function for an exponential sample", "构建指数分布样本的似然函数"),
        explanation: t(
          "Multiplying the densities of independent observations collects the rate into a power and the exponents into a single sum. For $X_i \\sim \\text{Exp}(\\lambda)$, $L(\\lambda) = \\prod_i \\lambda e^{-\\lambda x_i} = \\lambda^n e^{-\\lambda \\sum_i x_i}$.\n\nFor the sample $1, 2, 3$: $L(\\lambda) = \\lambda e^{-\\lambda} \\cdot \\lambda e^{-2\\lambda} \\cdot \\lambda e^{-3\\lambda} = \\lambda^{3} e^{-6\\lambda}$.\n\nCheck: at $\\lambda = 1$ the three densities are $e^{-1}, e^{-2}, e^{-3}$, whose product $e^{-6}$ matches $1^{3} e^{-6}$.\n\n> **Watch out.** The rate multiplies once per observation, giving $\\lambda^{3}$, not $3\\lambda$; and the exponent keeps its $\\lambda$: $e^{-6}$ alone would make the likelihood forget how fast the waiting times decay.",
          "把独立观测的密度相乘，速率汇集成一个幂，指数汇集成一个和。对于 $X_i \\sim \\text{Exp}(\\lambda)$，似然函数为 $L(\\lambda) = \\prod_i \\lambda e^{-\\lambda x_i} = \\lambda^n e^{-\\lambda \\sum_i x_i}$。\n\n对样本 $1, 2, 3$：$L(\\lambda) = \\lambda e^{-\\lambda} \\cdot \\lambda e^{-2\\lambda} \\cdot \\lambda e^{-3\\lambda} = \\lambda^{3} e^{-6\\lambda}$。\n\n检验：在 $\\lambda = 1$ 处三个密度为 $e^{-1}, e^{-2}, e^{-3}$，乘积 $e^{-6}$ 与 $1^{3} e^{-6}$ 一致。\n\n> **注意。** 速率每个观测乘一次，得 $\\lambda^{3}$，而不是 $3\\lambda$；指数中的 $\\lambda$ 也要保留：只写 $e^{-6}$ 会让似然丢掉衰减快慢的信息。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(3, 50);
          const math = (s: string) => t(`$${s}$`, `$${s}$`);
          return explainedChoice(rng, {
            prompt: t(
              `Let $x_1, x_2, \\dots, x_{${n}}$ be an independent random sample from an exponential distribution $f(x; \\lambda) = \\lambda e^{-\\lambda x}$ ($x \\ge 0$). What is the sample likelihood function $L(\\lambda)$?`,
              `设 $x_1, x_2, \\dots, x_{${n}}$ 为来自指数分布 $f(x; \\lambda) = \\lambda e^{-\\lambda x}$（$x \\ge 0$）的独立随机样本。样本的似然函数 $L(\\lambda)$ 是什么？`,
            ),
            correct: math(`\\lambda^{${n}} e^{-\\lambda \\sum_{i=1}^{${n}} x_i}`),
            wrong: [
              {
                option: math(`\\lambda e^{-${n} \\lambda \\sum_{i=1}^{${n}} x_i}`),
                why: t(
                  `The product of $${n}$ factors gives $\\lambda^{${n}}$, and the sum in the exponent already counts every observation.`,
                  `$${n}$ 个因子相乘得到 $\\lambda^{${n}}$，而指数中的和已经计入了每个观测值。`,
                ),
              },
              {
                option: math(`\\lambda^{${n}} e^{-\\sum_{i=1}^{${n}} x_i}`),
                why: t(
                  "The $\\lambda$ in the exponent is lost: each factor has $e^{-\\lambda x_i}$.",
                  "指数中的 $\\lambda$ 丢了：每个因子都含 $e^{-\\lambda x_i}$。",
                ),
              },
              {
                option: math(`(${n} \\lambda) e^{-\\lambda \\bar{x}}`),
                why: t(
                  `The likelihood is a product of densities, so $\\lambda$ appears to the power $${n}$ rather than multiplied by $${n}$.`,
                  `似然是密度的乘积，所以是 $\\lambda$ 的 $${n}$ 次方，而不是乘以 $${n}$。`,
                ),
              },
            ],
            solution: walked(
              [
                [
                  ["Multiply the densities", "把密度相乘"],
                  t(
                    `$L(\\lambda) = \\prod_{i=1}^{${n}} (\\lambda e^{-\\lambda x_i})$.`,
                    `$L(\\lambda) = \\prod_{i=1}^{${n}} (\\lambda e^{-\\lambda x_i})$。`,
                  ),
                ],
                [
                  ["Collect the rate and the exponents", "合并速率与指数"],
                  t(
                    `The $${n}$ rates give $\\lambda^{${n}}$ and the exponents add: $L(\\lambda) = \\lambda^{${n}} e^{-\\lambda \\sum_{i=1}^{${n}} x_i}$.`,
                    `$${n}$ 个速率得 $\\lambda^{${n}}$，指数相加：$L(\\lambda) = \\lambda^{${n}} e^{-\\lambda \\sum_{i=1}^{${n}} x_i}$。`,
                  ),
                ],
              ],
              t(
                `With a single observation, $n = 1$, the same pattern gives back the density $\\lambda e^{-\\lambda x_1}$.`,
                `只有一个观测时（$n = 1$），同样的规律还原出密度 $\\lambda e^{-\\lambda x_1}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-likelihood-of-a-uniform-sample",
        title: t("The likelihood of a uniform sample", "均匀分布样本的似然"),
        explanation: t(
          "For $X \\sim U(0, \\theta)$ the density is $\\frac{1}{\\theta}$ on $[0, \\theta]$ and $0$ outside, so\n\n$$L(\\theta) = \\begin{cases} \\theta^{-n}, & \\theta \\ge \\max x_i, \\\\ 0, & \\theta < \\max x_i. \\end{cases}$$\n\nA value of $\\theta$ smaller than some observation is impossible, since that observation could not have occurred; its likelihood is $0$. Above the maximum, $L$ decreases as $\\theta$ grows.\n\nFor the sample $0.4, 1.7, 1.2$: $L(2) = 2^{-3} = \\frac{1}{8}$, while $L(1.5) = 0$ because $1.7 > 1.5$.\n\nCheck: under $U(0, 2)$ each of the three density values is $\\frac{1}{2}$, and $\\frac{1}{2} \\cdot \\frac{1}{2} \\cdot \\frac{1}{2} = \\frac{1}{8}$.\n\n> **Watch out.** Do not use $\\theta^{-n}$ below the maximum: $1.5^{-3} \\approx 0.30$ looks larger than $\\frac{1}{8}$, but under $U(0, 1.5)$ the observation $1.7$ has density $0$, so the whole product is $0$.",
          "对于 $X \\sim U(0, \\theta)$，密度在 $[0, \\theta]$ 上为 $\\frac{1}{\\theta}$，在外为 $0$，所以\n\n$$L(\\theta) = \\begin{cases} \\theta^{-n}, & \\theta \\ge \\max x_i, \\\\ 0, & \\theta < \\max x_i. \\end{cases}$$\n\n若 $\\theta$ 小于某个观测值，则不可能，因为该观测不可能出现；其似然为 $0$。在最大值之上，$L$ 随 $\\theta$ 增大而减小。\n\n对样本 $0.4, 1.7, 1.2$：$L(2) = 2^{-3} = \\frac{1}{8}$，而 $L(1.5) = 0$，因为 $1.7 > 1.5$。\n\n检验：在 $U(0, 2)$ 下三个密度值都是 $\\frac{1}{2}$，$\\frac{1}{2} \\cdot \\frac{1}{2} \\cdot \\frac{1}{2} = \\frac{1}{8}$。\n\n> **注意。** 在最大值以下不能用 $\\theta^{-n}$：$1.5^{-3} \\approx 0.30$ 看起来比 $\\frac{1}{8}$ 大，但在 $U(0, 1.5)$ 下观测值 $1.7$ 的密度为 $0$，所以整个乘积为 $0$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(2, 4);
          const xs = Array.from({ length: n }, () => Q.of(rng.int(10, 49), 10));
          const max = xs.reduce((m, x) => (x.cmp(m) > 0 ? x : m), Q.zero);
          const theta = rng.bool(0.3) ? max.sub(Q.of(rng.int(1, 5), 10)) : Q.of(Math.max(2, Math.ceil(max.toNumber()) + rng.int(0, 2)));
          const ok = theta.cmp(max) >= 0;
          const val = Q.one.div(theta.pow(n));
          const ans = ok ? val : Q.zero;
          const wrong = [val, Q.one.div(theta), Q.one].filter((w) => !w.eq(ans));
          const shown = `${dec(theta)}`;
          return numberProblem({
            prompt: t(
              `A sample from $U(0, \\theta)$ is $${xs.map((x) => dec(x)).join(", ")}$. Find the likelihood $L(${shown})$.`,
              `来自 $U(0, \\theta)$ 的样本为 $${xs.map((x) => dec(x)).join(", ")}$。求似然 $L(${shown})$。`,
            ),
            answer: ans,
            wrong,
            mistakes: apart(
              ans,
              ok
                ? [
                    why(
                      Q.one.div(theta),
                      `This is one density value $\\frac{1}{${shown}}$; the likelihood multiplies all $${n}$ of them.`,
                      `这只是一个密度值 $\\frac{1}{${shown}}$；似然要把 $${n}$ 个都乘起来。`,
                    ),
                    why(
                      Q.of(n).div(theta),
                      `This adds the $${n}$ density values; independent observations multiply.`,
                      `这把 $${n}$ 个密度值相加了；独立观测要相乘。`,
                    ),
                    why(
                      Q.zero,
                      `Every observation is at most $${shown}$, so none of them is impossible and the likelihood is not $0$.`,
                      `每个观测都不超过 $${shown}$，没有不可能出现的观测，似然不为 $0$。`,
                    ),
                  ]
                : [
                    why(
                      val,
                      `This uses $\\theta^{-${n}}$, but the observation $${dec(max)}$ lies outside $[0, ${shown}]$ and has density $0$.`,
                      `这用了 $\\theta^{-${n}}$，但观测值 $${dec(max)}$ 在 $[0, ${shown}]$ 之外，密度为 $0$。`,
                    ),
                    why(
                      Q.one.div(theta),
                      `This is one density value; besides, the observation $${dec(max)}$ makes the product $0$.`,
                      `这只是一个密度值；况且观测值 $${dec(max)}$ 使乘积为 $0$。`,
                    ),
                    why(
                      Q.of(n).div(theta),
                      `This adds density values and ignores that $${dec(max)} > ${shown}$ is impossible under $U(0, ${shown})$.`,
                      `这把密度值相加了，并且忽略了在 $U(0, ${shown})$ 下 $${dec(max)} > ${shown}$ 不可能出现。`,
                    ),
                  ],
            ),
            solution: walked(
              [
                [
                  ["Compare the largest observation with $\\theta$", "比较最大观测值与 $\\theta$"],
                  ok
                    ? t(
                        `The largest observation is $${dec(max)} \\le ${shown}$, so every density value is $\\frac{1}{${shown}}$.`,
                        `最大观测值 $${dec(max)} \\le ${shown}$，所以每个密度值都是 $\\frac{1}{${shown}}$。`,
                      )
                    : t(
                        `The largest observation is $${dec(max)} > ${shown}$, so its density under $U(0, ${shown})$ is $0$.`,
                        `最大观测值 $${dec(max)} > ${shown}$，它在 $U(0, ${shown})$ 下的密度为 $0$。`,
                      ),
                ],
                [
                  ["Multiply the density values", "把密度值相乘"],
                  ok
                    ? t(`$L(${shown}) = ${shown}^{-${n}} = ${ans.toLatex()}$.`, `$L(${shown}) = ${shown}^{-${n}} = ${ans.toLatex()}$。`)
                    : t(`One factor is $0$, so $L(${shown}) = 0$.`, `有一个因子为 $0$，所以 $L(${shown}) = 0$。`),
                ],
              ],
              ok
                ? t(
                    `$${ans.toLatex()} \\cdot ${shown}^{${n}} = 1$, and a larger $\\theta$ would give a smaller likelihood.`,
                    `$${ans.toLatex()} \\cdot ${shown}^{${n}} = 1$；更大的 $\\theta$ 会给出更小的似然。`,
                  )
                : t(
                    `$U(0, ${shown})$ only produces values up to $${shown}$, and $${dec(max)}$ is beyond that, so the data rule this $\\theta$ out.`,
                    `$U(0, ${shown})$ 只产生不超过 $${shown}$ 的值，而 $${dec(max)}$ 超出了这个范围，所以数据排除了这个 $\\theta$。`,
                  ),
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
    intro: t(
      "The waiting times $0.5$ and $1.5$ from an exponential density have likelihood $L(\\lambda) = \\lambda^{2} e^{-2\\lambda}$. Its logarithm splits into two simple terms: $\\ln L(\\lambda) = 2\\ln\\lambda - 2\\lambda$. Its derivative $\\frac{2}{\\lambda} - 2$ is zero at $\\lambda = 1$.\n\nCheck: at $\\lambda = 1$ the log-likelihood is $2\\ln 1 - 2 = -2$, and $\\ln L(1) = \\ln e^{-2} = -2$ as well.\n\nIn this lesson we take logarithms of continuous likelihoods, for exponential and normal samples, and read what each term contributes.",
      "来自指数密度的等待时间 $0.5$ 与 $1.5$ 的似然函数为 $L(\\lambda) = \\lambda^{2} e^{-2\\lambda}$。取对数后分成两个简单的项：$\\ln L(\\lambda) = 2\\ln\\lambda - 2\\lambda$。其导数 $\\frac{2}{\\lambda} - 2$ 在 $\\lambda = 1$ 处为零。\n\n检验：在 $\\lambda = 1$ 处对数似然为 $2\\ln 1 - 2 = -2$，而 $\\ln L(1) = \\ln e^{-2} = -2$，两者一致。\n\n本课我们对指数样本和正态样本的连续型似然取对数，并看清每一项的来源。",
    ),
    prerequisites: ["likelihood-functions-for-continuous-probability-distributions", "logarithmic-differentiation"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "exponential-log-likelihood-expression",
        title: t("Deriving the log-likelihood function of an exponential sample", "推导指数分布样本的对数似然函数"),
        explanation: t(
          "The logarithm of the likelihood separates into a term from the powers of the rate and a term from the exponent. Taking logarithms, $\\ln L(\\lambda) = n \\ln \\lambda - \\lambda \\sum_i x_i$.\n\nFor the sample $1, 2, 3$: $L(\\lambda) = \\lambda^{3} e^{-6\\lambda}$, so $\\ln L(\\lambda) = 3\\ln\\lambda - 6\\lambda$.\n\nCheck: at $\\lambda = 1$ this gives $3\\ln 1 - 6 = -6$, and $\\ln L(1) = \\ln e^{-6} = -6$.\n\n> **Watch out.** $\\ln(\\lambda^{3}) = 3\\ln\\lambda$, not $\\lambda^{3}$; and $\\ln e^{-6\\lambda} = -6\\lambda$ comes down as it is, with no logarithm of the sum $6$.",
          "似然函数的对数分成两部分：一部分来自速率的幂，另一部分来自指数。取对数得 $\\ln L(\\lambda) = n \\ln \\lambda - \\lambda \\sum_i x_i$。\n\n对样本 $1, 2, 3$：$L(\\lambda) = \\lambda^{3} e^{-6\\lambda}$，所以 $\\ln L(\\lambda) = 3\\ln\\lambda - 6\\lambda$。\n\n检验：在 $\\lambda = 1$ 处得 $3\\ln 1 - 6 = -6$，而 $\\ln L(1) = \\ln e^{-6} = -6$。\n\n> **注意。** $\\ln(\\lambda^{3}) = 3\\ln\\lambda$，不是 $\\lambda^{3}$；$\\ln e^{-6\\lambda} = -6\\lambda$ 原样落下，不出现和 $6$ 的对数。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 50);
          const math = (s: string) => t(`$${s}$`, `$${s}$`);
          return explainedChoice(rng, {
            prompt: t(
              `For an independent sample of size $n = ${n}$ from $X \\sim \\text{Exp}(\\lambda)$, what is the log-likelihood function $\\ln L(\\lambda)$?`,
              `对于来自 $X \\sim \\text{Exp}(\\lambda)$ 的容量为 $n = ${n}$ 的独立样本，其对数似然函数 $\\ln L(\\lambda)$ 是什么？`,
            ),
            correct: math(`${n} \\ln(\\lambda) - \\lambda \\sum_{i=1}^{${n}} x_i`),
            wrong: [
              {
                option: math(`\\ln(\\lambda) - ${n} \\lambda \\sum_{i=1}^{${n}} x_i`),
                why: t(
                  `The logarithm of $\\lambda^{${n}}$ is $${n} \\ln(\\lambda)$, and the second term has no extra factor of $${n}$.`,
                  `$\\lambda^{${n}}$ 的对数是 $${n} \\ln(\\lambda)$，第二项也没有多余的因子 $${n}$。`,
                ),
              },
              {
                option: math(`${n} \\lambda - \\ln\\left(\\sum_{i=1}^{${n}} x_i\\right)`),
                why: t(
                  "The logarithm applies to $\\lambda$, not to the sum: the sum comes out of the exponent as it is.",
                  "取对数的是 $\\lambda$，不是那个和：和从指数上下来时保持原样。",
                ),
              },
              {
                option: math(`\\lambda^{${n}} - \\lambda \\sum_{i=1}^{${n}} x_i`),
                why: t(
                  `The first term has not been turned into a logarithm: $\\ln \\lambda^{${n}} = ${n} \\ln(\\lambda)$.`,
                  `第一项没有取对数：$\\ln \\lambda^{${n}} = ${n} \\ln(\\lambda)$。`,
                ),
              },
            ],
            solution: walked(
              [
                [
                  ["Write the likelihood", "写出似然函数"],
                  t(
                    `$L(\\lambda) = \\lambda^{${n}} e^{-\\lambda \\sum x_i}$.`,
                    `$L(\\lambda) = \\lambda^{${n}} e^{-\\lambda \\sum x_i}$。`,
                  ),
                ],
                [
                  ["Take logarithms term by term", "逐项取对数"],
                  t(
                    `$\\ln \\lambda^{${n}} = ${n} \\ln(\\lambda)$ and $\\ln e^{-\\lambda \\sum x_i} = -\\lambda \\sum x_i$, so $\\ln L(\\lambda) = ${n} \\ln(\\lambda) - \\lambda \\sum_{i=1}^{${n}} x_i$.`,
                    `$\\ln \\lambda^{${n}} = ${n} \\ln(\\lambda)$，$\\ln e^{-\\lambda \\sum x_i} = -\\lambda \\sum x_i$，所以 $\\ln L(\\lambda) = ${n} \\ln(\\lambda) - \\lambda \\sum_{i=1}^{${n}} x_i$。`,
                  ),
                ],
              ],
              t(
                `The derivative $\\frac{${n}}{\\lambda} - \\sum x_i$ is zero at $\\lambda = \\frac{${n}}{\\sum x_i} = \\frac{1}{\\bar{x}}$, the familiar exponential estimate.`,
                `导数 $\\frac{${n}}{\\lambda} - \\sum x_i$ 在 $\\lambda = \\frac{${n}}{\\sum x_i} = \\frac{1}{\\bar{x}}$ 处为零，正是熟悉的指数分布估计。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-normal-log-likelihood-for-the-mean",
        title: t("The normal log-likelihood for the mean", "正态分布均值的对数似然"),
        explanation: t(
          "For a sample from $N(\\mu, \\sigma^{2})$ with $\\sigma^{2}$ known,\n\n$$\\ln L(\\mu) = -\\frac{n}{2}\\ln(2\\pi\\sigma^{2}) - \\frac{1}{2\\sigma^{2}}\\sum (x_i - \\mu)^{2}.$$\n\nThe first term is a constant. Maximizing $\\ln L$ is the same as **minimizing** $\\sum (x_i - \\mu)^{2}$, so the maximum likelihood estimate of a normal mean is the least-squares estimate, $\\bar{x}$.\n\nFor the sample $1, 3$ from $N(\\mu, 1)$: $\\ln L(\\mu) = -\\ln(2\\pi) - \\frac{1}{2}\\left[(1 - \\mu)^{2} + (3 - \\mu)^{2}\\right]$. At $\\mu = 2$ the bracket is $2$; at $\\mu = 1$ it is $4$.\n\nCheck: the smaller bracket gives the larger log-likelihood, $-\\ln(2\\pi) - 1$ against $-\\ln(2\\pi) - 2$, and $\\mu = 2$ is the sample mean.\n\n> **Watch out.** The constant uses the variance: for $N(\\mu, 4)$ it is $-\\frac{n}{2}\\ln(8\\pi)$, with $2\\pi\\sigma^{2} = 8\\pi$, not $\\ln(4\\pi)$. And the square is on each deviation, $\\sum (x_i - \\mu)^{2}$, not on the sum.",
          "对于方差 $\\sigma^{2}$ 已知的 $N(\\mu, \\sigma^{2})$ 样本，\n\n$$\\ln L(\\mu) = -\\frac{n}{2}\\ln(2\\pi\\sigma^{2}) - \\frac{1}{2\\sigma^{2}}\\sum (x_i - \\mu)^{2}.$$\n\n第一项是常数。使 $\\ln L$ 最大等价于使 $\\sum (x_i - \\mu)^{2}$ **最小**，所以正态均值的极大似然估计就是最小二乘估计 $\\bar{x}$。\n\n对来自 $N(\\mu, 1)$ 的样本 $1, 3$：$\\ln L(\\mu) = -\\ln(2\\pi) - \\frac{1}{2}\\left[(1 - \\mu)^{2} + (3 - \\mu)^{2}\\right]$。在 $\\mu = 2$ 处方括号为 $2$；在 $\\mu = 1$ 处为 $4$。\n\n检验：方括号越小，对数似然越大：$-\\ln(2\\pi) - 1$ 大于 $-\\ln(2\\pi) - 2$，而 $\\mu = 2$ 正是样本均值。\n\n> **注意。** 常数项用的是方差：对 $N(\\mu, 4)$，它是 $-\\frac{n}{2}\\ln(8\\pi)$，因为 $2\\pi\\sigma^{2} = 8\\pi$，而不是 $\\ln(4\\pi)$。并且平方作用在每个离差上，即 $\\sum (x_i - \\mu)^{2}$，而不是作用在和上。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(3, 40);
          const v = rng.int(1, 9);
          const math = (s: string) => t(`$${s}$`, `$${s}$`);
          const right = `-\\frac{${n}}{2}\\ln(${2 * v}\\pi) - \\frac{1}{${2 * v}}\\sum (x_i - \\mu)^{2}`;
          return explainedChoice(rng, {
            prompt: t(
              `$x_1, \\dots, x_{${n}}$ is a sample from $N(\\mu, ${v})$. Which expression is the log-likelihood $\\ln L(\\mu)$?`,
              `$x_1, \\dots, x_{${n}}$ 是来自 $N(\\mu, ${v})$ 的样本。哪个表达式是对数似然 $\\ln L(\\mu)$？`,
            ),
            correct: math(right),
            wrong: [
              {
                option: math(`-\\frac{${n}}{2}\\ln(${2 * v}\\pi) + \\frac{1}{${2 * v}}\\sum (x_i - \\mu)^{2}`),
                why: t(
                  "The exponent of the normal density is negative, so the squared deviations enter with a minus sign.",
                  "正态密度的指数为负，所以平方离差前是减号。",
                ),
              },
              {
                option: math(`-\\frac{${n}}{2}\\ln(${2 * v}\\pi) - \\frac{1}{${2 * v}}\\left(\\sum x_i - \\mu\\right)^{2}`),
                why: t(
                  "Each observation contributes its own square $(x_i - \\mu)^{2}$; squaring after summing is a different quantity.",
                  "每个观测贡献自己的平方 $(x_i - \\mu)^{2}$；先求和再平方是另一个量。",
                ),
              },
              {
                option: math(`-${n}\\ln(${2 * v}\\pi) - \\frac{${n}}{${2 * v}}\\sum (x_i - \\mu)^{2}`),
                why: t(
                  `Each density has $\\frac{1}{\\sqrt{${2 * v}\\pi}}$, whose log is half of $\\ln(${2 * v}\\pi)$; and the sum already has all $${n}$ terms, so there is no extra factor $${n}$.`,
                  `每个密度含 $\\frac{1}{\\sqrt{${2 * v}\\pi}}$，其对数是 $\\ln(${2 * v}\\pi)$ 的一半；而且和已经包含全部 $${n}$ 项，不再多乘 $${n}$。`,
                ),
              },
            ],
            solution: walked(
              [
                [
                  ["Take the log of one density", "对一个密度取对数"],
                  t(
                    `Each density is $\\frac{1}{\\sqrt{${2 * v}\\pi}}e^{-(x_i - \\mu)^{2}/${2 * v}}$; its log is $-\\frac{1}{2}\\ln(${2 * v}\\pi) - \\frac{(x_i - \\mu)^{2}}{${2 * v}}$.`,
                    `每个密度为 $\\frac{1}{\\sqrt{${2 * v}\\pi}}e^{-(x_i - \\mu)^{2}/${2 * v}}$，其对数为 $-\\frac{1}{2}\\ln(${2 * v}\\pi) - \\frac{(x_i - \\mu)^{2}}{${2 * v}}$。`,
                  ),
                ],
                [
                  [`Sum the $${n}$ terms`, `对 $${n}$ 项求和`],
                  t(`$\\ln L(\\mu) = ${right}$, with the squares inside the sum.`, `$\\ln L(\\mu) = ${right}$，平方在求和号之内。`),
                ],
              ],
              t(
                `With $\\sigma^{2} = ${v}$, $2\\pi\\sigma^{2} = ${2 * v}\\pi$ and $\\frac{1}{2\\sigma^{2}} = \\frac{1}{${2 * v}}$, matching both terms.`,
                `由 $\\sigma^{2} = ${v}$ 得 $2\\pi\\sigma^{2} = ${2 * v}\\pi$，$\\frac{1}{2\\sigma^{2}} = \\frac{1}{${2 * v}}$，与两项都相符。`,
              ),
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
    intro: t(
      "Three bulbs from an exponential lifetime distribution last $2$, $3$ and $5$ years. The log-likelihood is $\\ln L(\\lambda) = 3\\ln\\lambda - 10\\lambda$, its derivative is $\\frac{3}{\\lambda} - 10$, and setting this to zero gives $\\hat{\\lambda} = \\frac{3}{10} = 0.3$ failures per year.\n\nCheck: the second derivative $-\\frac{3}{\\lambda^{2}}$ is negative, so this is a maximum, and $\\hat{\\lambda} = 0.3$ is the reciprocal of the mean lifetime $\\bar{x} = \\frac{10}{3}$.\n\nIn this lesson we find maximum likelihood estimates by solving the score equation, and by looking at the shape of the likelihood when the derivative cannot be zero, as for a uniform endpoint.",
      "三只灯泡的寿命服从指数分布，分别为 $2$、$3$、$5$ 年。对数似然为 $\\ln L(\\lambda) = 3\\ln\\lambda - 10\\lambda$，导数为 $\\frac{3}{\\lambda} - 10$，令其为零得 $\\hat{\\lambda} = \\frac{3}{10} = 0.3$（每年失效次数）。\n\n检验：二阶导数 $-\\frac{3}{\\lambda^{2}}$ 为负，所以这是极大值；并且 $\\hat{\\lambda} = 0.3$ 正是平均寿命 $\\bar{x} = \\frac{10}{3}$ 的倒数。\n\n本课我们通过求解得分方程求极大似然估计；当导数不可能为零时（如均匀分布的端点），则观察似然函数的形状来求。",
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
          "Setting the derivative of the log likelihood to zero shows that the best estimate of the rate is the reciprocal of the sample mean. Setting $\\frac{d}{d\\lambda}\\left[n \\ln \\lambda - \\lambda \\sum_i x_i\\right] = \\frac{n}{\\lambda} - \\sum_i x_i = 0$ yields $\\hat{\\lambda} = \\frac{n}{\\sum_i x_i} = \\frac{1}{\\bar{x}}$.\n\nFour lifetimes adding up to $20$ hours give $\\hat{\\lambda} = \\frac{4}{20} = 0.2$ per hour.\n\nCheck: the mean lifetime is $\\bar{x} = 5$ hours, and $\\frac{1}{5} = 0.2$.\n\n> **Watch out.** The rate is $\\frac{n}{\\sum x_i}$, not $\\frac{\\sum x_i}{n} = 5$: the sample mean estimates the mean lifetime $\\frac{1}{\\lambda}$, and its reciprocal estimates the rate.",
          "令对数似然的导数为零，可以看出速率的最佳估计是样本均值的倒数。令 $\\frac{d}{d\\lambda}\\left[n \\ln \\lambda - \\lambda \\sum_i x_i\\right] = \\frac{n}{\\lambda} - \\sum_i x_i = 0$，解得 $\\hat{\\lambda} = \\frac{n}{\\sum_i x_i} = \\frac{1}{\\bar{x}}$。\n\n四个寿命之和为 $20$ 小时，则 $\\hat{\\lambda} = \\frac{4}{20} = 0.2$（每小时）。\n\n检验：平均寿命 $\\bar{x} = 5$ 小时，而 $\\frac{1}{5} = 0.2$。\n\n> **注意。** 速率是 $\\frac{n}{\\sum x_i}$，而不是 $\\frac{\\sum x_i}{n} = 5$：样本均值估计的是平均寿命 $\\frac{1}{\\lambda}$，它的倒数才估计速率。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(5, 50);
          const sum = rng.int(20, 200);
          const ans = Q.of(n, sum);

          return numberProblem({
            prompt: t(
              `A sample of $n = ${n}$ items tested to failure follows an exponential distribution $\\text{Exp}(\\lambda)$. The total observed lifetime is $\\sum_{i=1}^{${n}} x_i = ${sum}$. Find the maximum likelihood estimate $\\hat{\\lambda}$.`,
              `对 $n = ${n}$ 个失效元件的寿命观测服从指数分布 $\\text{Exp}(\\lambda)$。观测到的总寿命为 $\\sum_{i=1}^{${n}} x_i = ${sum}$。求比率参数的极大似然估计值 $\\hat{\\lambda}$。`,
            ),
            answer: ans,
            wrong: [Q.of(sum, n), Q.of(n - 1, sum), Q.of(1, sum)],
            mistakes: apart(ans, [
              why(
                Q.of(sum, n),
                "This is the sample mean $\\bar{x}$, which estimates the mean lifetime $\\frac{1}{\\lambda}$; the rate is its reciprocal.",
                "这是样本均值 $\\bar{x}$，它估计的是平均寿命 $\\frac{1}{\\lambda}$；速率是它的倒数。",
              ),
              why(
                Q.of(n - 1, sum),
                `This uses $n - 1 = ${n - 1}$; the derivative of $${n}\\ln\\lambda$ is $\\frac{${n}}{\\lambda}$.`,
                `这用了 $n - 1 = ${n - 1}$；$${n}\\ln\\lambda$ 的导数是 $\\frac{${n}}{\\lambda}$。`,
              ),
              why(
                Q.of(1, sum),
                `This drops the coefficient $n = ${n}$ of $\\ln\\lambda$, as if there were one observation.`,
                `这丢掉了 $\\ln\\lambda$ 的系数 $n = ${n}$，好像只有一个观测。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate the log-likelihood", "对对数似然求导"],
                  t(
                    `$\\ln L(\\lambda) = ${n}\\ln\\lambda - ${sum}\\lambda$, so $\\frac{d}{d\\lambda}\\ln L = \\frac{${n}}{\\lambda} - ${sum}$.`,
                    `$\\ln L(\\lambda) = ${n}\\ln\\lambda - ${sum}\\lambda$，所以 $\\frac{d}{d\\lambda}\\ln L = \\frac{${n}}{\\lambda} - ${sum}$。`,
                  ),
                ],
                [
                  ["Solve the score equation", "解得分方程"],
                  t(
                    `$\\frac{${n}}{\\lambda} = ${sum}$ gives $\\hat{\\lambda} = \\frac{${n}}{${sum}}${lowestTerms(n, sum)}$.`,
                    `由 $\\frac{${n}}{\\lambda} = ${sum}$ 得 $\\hat{\\lambda} = \\frac{${n}}{${sum}}${lowestTerms(n, sum)}$。`,
                  ),
                ],
              ],
              t(
                `$\\hat{\\lambda}$ is the reciprocal of $\\bar{x} = \\frac{${sum}}{${n}}$, and the second derivative $-\\frac{${n}}{\\lambda^{2}}$ is negative, so it is a maximum.`,
                `$\\hat{\\lambda}$ 是 $\\bar{x} = \\frac{${sum}}{${n}}$ 的倒数，二阶导数 $-\\frac{${n}}{\\lambda^{2}}$ 为负，所以是极大值。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-mle-of-a-uniform-endpoint",
        title: t("The MLE of a uniform endpoint", "均匀分布端点的极大似然估计"),
        explanation: t(
          "Not every MLE comes from setting a derivative to $0$. For $U(0, \\theta)$, $L(\\theta) = \\theta^{-n}$ for $\\theta \\ge \\max x_i$ and $0$ below it. This function is largest at the smallest allowed value, so\n\n$$\\hat{\\theta}_{\\text{MLE}} = \\max x_i.$$\n\nThe method of moments gives $2\\bar{x}$ instead, which can even be smaller than an observed value. The MLE is never below the data, but it is biased low: the true endpoint is at least as large as the largest observation.\n\nFor the sample $1.2, 3.5, 2.8$: $\\hat{\\theta} = 3.5$, while the method of moments gives $2 \\cdot 2.5 = 5$.\n\nCheck: $L(3.5) = 3.5^{-3}$; every $\\theta < 3.5$ has likelihood $0$, and every $\\theta > 3.5$ has the smaller $\\theta^{-3}$.\n\n> **Watch out.** Do not take $2\\bar{x}$ as the MLE: for the sample $0.5, 0.5, 3.5$ it is $2 \\cdot 1.5 = 3$, below the observation $3.5$, a value of $\\theta$ the data have already ruled out.",
          "并非每个极大似然估计都来自令导数为 $0$。对于 $U(0, \\theta)$，当 $\\theta \\ge \\max x_i$ 时 $L(\\theta) = \\theta^{-n}$，小于它时为 $0$。该函数在允许的最小值处最大，所以\n\n$$\\hat{\\theta}_{\\text{MLE}} = \\max x_i.$$\n\n矩估计给出 $2\\bar{x}$，它甚至可能小于某个观测值。极大似然估计永远不低于数据，但偏低：真实端点至少和最大观测值一样大。\n\n对样本 $1.2, 3.5, 2.8$：$\\hat{\\theta} = 3.5$，而矩估计给出 $2 \\cdot 2.5 = 5$。\n\n检验：$L(3.5) = 3.5^{-3}$；任何 $\\theta < 3.5$ 的似然都为 $0$，任何 $\\theta > 3.5$ 的似然 $\\theta^{-3}$ 都更小。\n\n> **注意。** 不要把 $2\\bar{x}$ 当成极大似然估计：对样本 $0.5, 0.5, 3.5$，它等于 $2 \\cdot 1.5 = 3$，小于观测值 $3.5$，是数据已经排除的 $\\theta$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 5);
          const xs = Array.from({ length: n }, () => Q.of(rng.int(5, 99), 10));
          const max = xs.reduce((m, x) => (x.cmp(m) > 0 ? x : m), Q.zero);
          const min = xs.reduce((m, x) => (x.cmp(m) < 0 ? x : m), max);
          const sum = xs.reduce((s, x) => s.add(x), Q.zero);
          const mean = sum.div(Q.of(n));
          const mom = Q.of(2).mul(mean);
          const wrong = [mom, mean, Q.of(n + 1, n).mul(max)].filter((w) => !w.eq(max));
          return numberProblem({
            prompt: t(
              `A sample from $U(0, \\theta)$ is $${xs.map((x) => dec(x)).join(", ")}$. Find the maximum likelihood estimate $\\hat{\\theta}$.`,
              `来自 $U(0, \\theta)$ 的样本为 $${xs.map((x) => dec(x)).join(", ")}$。求 $\\theta$ 的极大似然估计 $\\hat{\\theta}$。`,
            ),
            answer: max,
            form: "decimal",
            wrong,
            mistakes: apart(
              max,
              [
                why(
                  mom,
                  "This is the method of moments estimate $2\\bar{x}$; the likelihood is largest at the largest observation.",
                  "这是矩估计 $2\\bar{x}$；似然在最大观测值处最大。",
                ),
                why(
                  mean,
                  "This is the sample mean, which estimates the centre $\\frac{\\theta}{2}$, not the endpoint.",
                  "这是样本均值，它估计的是中心 $\\frac{\\theta}{2}$，而不是端点。",
                ),
                why(
                  Q.of(n + 1, n).mul(max),
                  `This applies the unbiasing factor $\\frac{${n + 1}}{${n}}$; the MLE itself is the maximum, without the factor.`,
                  `这乘了无偏校正因子 $\\frac{${n + 1}}{${n}}$；极大似然估计本身就是最大值，不乘因子。`,
                ),
                why(
                  min,
                  "This is the smallest observation; any $\\theta$ below the largest observation has likelihood $0$.",
                  "这是最小观测值；任何小于最大观测值的 $\\theta$ 似然都为 $0$。",
                ),
              ].filter((m) => isTerminating(m.value)),
            ),
            solution: walked(
              [
                [
                  ["Find where the likelihood is positive", "找出似然为正的范围"],
                  t(
                    `$L(\\theta) = \\theta^{-${n}}$ for $\\theta \\ge ${dec(max)}$, the largest observation, and $0$ below it.`,
                    `当 $\\theta \\ge ${dec(max)}$（最大观测值）时 $L(\\theta) = \\theta^{-${n}}$，小于它时为 $0$。`,
                  ),
                ],
                [
                  ["Take the smallest allowed value", "取允许的最小值"],
                  t(
                    `$\\theta^{-${n}}$ decreases as $\\theta$ grows, so $\\hat{\\theta} = \\max x_i = ${dec(max)}$.`,
                    `$\\theta^{-${n}}$ 随 $\\theta$ 增大而减小，所以 $\\hat{\\theta} = \\max x_i = ${dec(max)}$。`,
                  ),
                ],
              ],
              t(
                `Every observation is at most $${dec(max)}$, so $U(0, ${dec(max)})$ can produce the whole sample.`,
                `每个观测都不超过 $${dec(max)}$，所以 $U(0, ${dec(max)})$ 能产生整个样本。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
