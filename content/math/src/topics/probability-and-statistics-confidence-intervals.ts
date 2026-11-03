import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem } from "../problems.ts";

/** Topics for Unit 7: Confidence Intervals (new topics). */
export const probabilityAndStatisticsConfidenceIntervalTopics: TopicDef[] = [
  // 7.25.1 Confidence Intervals for One Mean: Known Population Variance
  {
    id: "confidence-intervals-for-one-mean-known-population-variance",
    title: t("Confidence Intervals for One Mean: Known Population Variance", "单总体均值的置信区间：已知总体方差"),
    summary: t(
      "When the population variance σ^2 is known, a 100(1 - α)% confidence interval for the population mean μ is x̄ ± z_{α/2} (σ / √n).",
      "当总体方差 σ^2 已知时，总体均值 μ 的 100(1 - α)% 置信区间为 x̄ ± z_{α/2} (σ / √n)。",
    ),
    prerequisites: ["the-central-limit-theorem", "percentage-points-of-the-standard-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "margin-of-error-known-variance",
        title: t("Calculating the margin of error with known variance", "计算已知总体方差下的误差范围"),
        explanation: t(
          "The margin of error is $E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$.",
          "误差范围为 $E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$。",
        ),
        generate: (rng: Rng): Problem => {
          // Choose clean values: n = k^2, z = 2 (approx 95%) or z = 3 (approx 99.7%)
          const k = rng.int(2, 10);
          const n = k * k;
          const z = rng.pick([2, 3]);
          const sigma = k * rng.int(2, 12);
          const margin = z * (sigma / k);

          return numberProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ is drawn from a normal population with standard deviation $\\sigma = ${sigma}$. For a critical value $z_{\\alpha/2} = ${z}$, calculate the margin of error $E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$.`,
              `从标准差为 $\\sigma = ${sigma}$ 的正态总体中抽取容量为 $n = ${n}$ 的随机样本。取临界值 $z_{\\alpha/2} = ${z}$，计算误差范围 $E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$。`,
            ),
            answer: margin,
            solution: t(
              `$E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}} = ${z} \\times \\frac{${sigma}}{\\sqrt{${n}}} = ${z} \\times \\frac{${sigma}}{${k}} = ${margin}$.`,
              `$E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}} = ${z} \\times \\frac{${sigma}}{\\sqrt{${n}}} = ${z} \\times \\frac{${sigma}}{${k}} = ${margin}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.25.2 Confidence Intervals for One Mean: Unknown Population Variance
  {
    id: "confidence-intervals-for-one-mean-unknown-population-variance",
    title: t("Confidence Intervals for One Mean: Unknown Population Variance", "单总体均值的置信区间：未知总体方差"),
    summary: t(
      "When σ is unknown and the population is normal, Student's t-distribution with ν = n - 1 degrees of freedom is used: x̄ ± t_{α/2, n-1} (s / √n).",
      "当总体方差 σ 未知且总体服从正态分布时，采用自由度为 ν = n - 1 的学生 t 分布：x̄ ± t_{α/2, n-1} (s / √n)。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance", "the-students-t-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "t-confidence-interval-degrees-of-freedom",
        title: t("Identifying degrees of freedom for one-sample t confidence interval", "确定单样本 t 置信区间的自由度"),
        explanation: t(
          "For a single sample of size n with unknown variance, the t critical value uses degrees of freedom ν = n - 1.",
          "对于未知方差的容量为 n 的单样本，t 临界值采用自由度 ν = n - 1。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(5, 60);

          return numberProblem({
            prompt: t(
              `A researcher constructs a $95\\%$ confidence interval for the mean of a normal population with unknown variance based on a sample of size $n = ${n}$. What are the degrees of freedom $\\nu$ of the Student's $t$ distribution used?`,
              `研究人员根据容量为 $n = ${n}$ 的样本，为方差未知的正态总体均值构建 $95\\%$ 置信区间。所使用的学生 $t$ 分布的自由度 $\\nu$ 是多少？`,
            ),
            answer: n - 1,
            solution: t(
              `The degrees of freedom for a one-sample $t$-interval is $\\nu = n - 1 = ${n} - 1 = ${n - 1}$.`,
              `单样本 $t$ 置信区间的自由度为 $\\nu = n - 1 = ${n} - 1 = ${n - 1}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.25.3 Confidence Intervals for One Means: Finite Population Correction
  {
    id: "confidence-intervals-for-one-mean-finite-population-correction",
    title: t("Confidence Intervals for One Mean: Finite Population Correction", "单总体均值的置信区间：有限总体校正"),
    summary: t(
      "When sampling without replacement from a finite population of size N, the confidence interval is adjusted by the FPC factor: x̄ ± z_{α/2} (σ / √n) √((N - n) / (N - 1)).",
      "当不放回地从容量为 N 的有限总体中抽样时，置信区间通过 FPC 因子进行修正：x̄ ± z_{α/2} (σ / √n) √((N - n) / (N - 1))。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance", "finite-population-corrections-for-sample-means"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "fpc-confidence-interval-margin-reduction",
        title: t("Understanding the narrowing effect of FPC on confidence intervals", "理解 FPC 对置信区间的收窄效应"),
        explanation: t(
          "Because √((N - n) / (N - 1)) < 1, the FPC narrows the margin of error and yields a more precise interval.",
          "因为 √((N - n) / (N - 1)) < 1，有限总体校正使误差范围变窄，从而得到更精确的置信区间。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(200, 1000);
          const n = rng.int(20, 100);

          const opts = [
            t(
              "It becomes narrower (smaller margin of error) because the FPC factor is strictly less than 1.",
              "置信区间变得更窄（误差范围更小），因为 FPC 因子严格小于 1。",
            ),
            t(
              "It becomes wider (larger margin of error) because finite populations introduce extra variance.",
              "置信区间变得更宽（误差范围更大），因为有限总体引入了额外方差。",
            ),
            t("The width remains unchanged because sample size n is unchanged.", "区间宽度保持不变，因为样本容量 n 未发生变化。"),
            t("It shifts the center of the interval away from the sample mean.", "它会使置信区间的中心偏离样本均值。"),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `When constructing a confidence interval for the mean from a sample of size $n = ${n}$ drawn without replacement from a finite population of size $N = ${N}$, how does including the Finite Population Correction (FPC) affect the width of the confidence interval compared to assuming an infinite population?`,
              `当根据从容量为 $N = ${N}$ 的有限总体中不放回抽取的 $n = ${n}$ 个样本构建均值置信区间时，与假定无限总体相比，引入有限总体校正（FPC）对置信区间宽度有何影响？`,
            ),
            options,
            correct,
            solution: t(
              `The FPC factor $\\sqrt{\\frac{N - n}{N - 1}} < 1$ scales down the standard error, thereby reducing the margin of error and narrowing the confidence interval.`,
              `FPC 因子 $\\sqrt{\\frac{N - n}{N - 1}} < 1$ 缩小了标准误差，从而减小了误差范围并收窄了置信区间。`,
            ),
          });
        },
      },
    ],
  },

  // 7.25.4 Confidence Intervals for One Proportion
  {
    id: "confidence-intervals-for-one-proportion",
    title: t("Confidence Intervals for One Proportion", "单总体比例的置信区间"),
    summary: t(
      "The large-sample Wald confidence interval for a population proportion p is p̂ ± z_{α/2} √((p̂(1 - p̂)) / n), valid when np̂ ≥ 10 and n(1 - p̂) ≥ 10.",
      "单总体比例 p 的大样本瓦尔德（Wald）置信区间为 p̂ ± z_{α/2} √((p̂(1 - p̂)) / n)，在 np̂ ≥ 10 且 n(1 - p̂) ≥ 10 时适用。",
    ),
    prerequisites: ["point-estimates-of-population-proportions", "confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "wald-proportion-variance-evaluation",
        title: t("Evaluating the estimated variance of the sample proportion", "计算样本比例的估计方差"),
        explanation: t("The estimated variance of p̂ is p̂(1 - p̂) / n.", "样本比例 p̂ 的估计方差为 p̂(1 - p̂) / n。"),
        generate: (rng: Rng): Problem => {
          const numP = rng.int(1, 9);
          const denP = 10;
          const n = rng.int(20, 100);
          // var = p(1-p)/n = (numP * (10 - numP)) / (100 * n)
          const num = numP * (denP - numP);
          const den = 100 * n;

          return numberProblem({
            prompt: t(
              `In a sample of size $n = ${n}$, the sample proportion is $\\hat{p} = \\frac{${numP}}{${denP}}$. Find the estimated variance of the sample proportion, $\\widehat{\\text{Var}}(\\hat{p}) = \\frac{\\hat{p}(1 - \\hat{p})}{n}$.`,
              `在容量为 $n = ${n}$ 的样本中，样本比例为 $\\hat{p} = \\frac{${numP}}{${denP}}$。求样本比例的估计方差 $\\widehat{\\text{Var}}(\\hat{p}) = \\frac{\\hat{p}(1 - \\hat{p})}{n}$。`,
            ),
            answer: Q.of(num, den),
            solution: t(
              `$\\widehat{\\text{Var}}(\\hat{p}) = \\frac{\\frac{${numP}}{${denP}} \\left(1 - \\frac{${numP}}{${denP}}\\right)}{${n}} = \\frac{${numP} \\times ${denP - numP}}{100 \\times ${n}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$\\widehat{\\text{Var}}(\\hat{p}) = \\frac{\\frac{${numP}}{${denP}} \\left(1 - \\frac{${numP}}{${denP}}\\right)}{${n}} = \\frac{${numP} \\times ${denP - numP}}{100 \\times ${n}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.25.5 Confidence Intervals for One Proportion: Finite Population Corrections
  {
    id: "confidence-intervals-for-one-proportion-finite-population-corrections",
    title: t("Confidence Intervals for One Proportion: Finite Population Corrections", "单总体比例的置信区间：有限总体校正"),
    summary: t(
      "For finite populations sampled without replacement, the margin of error for proportions includes the FPC: E = z_{α/2} √((p̂(1 - p̂)) / n) √((N - n) / (N - 1)).",
      "对于不放回抽样的有限总体，比例的误差范围包含 FPC 校正因子：E = z_{α/2} √((p̂(1 - p̂)) / n) √((N - n) / (N - 1))。",
    ),
    prerequisites: ["confidence-intervals-for-one-proportion", "finite-population-corrections-for-sample-proportions"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "fpc-proportion-standard-error-formula",
        title: t("Formulating the standard error with FPC for proportions", "构建含 FPC 的样本比例标准误差表达式"),
        explanation: t(
          "$SE(\\hat{p}) = \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n} \\cdot \\frac{N - n}{N - 1}}$.",
          "$SE(\\hat{p}) = \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n} \\cdot \\frac{N - n}{N - 1}}$。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(300, 1500);
          const n = rng.int(30, 150);

          const correctStr = `\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{${n}} \\left(\\frac{${N} - ${n}}{${N} - 1}\\right)}`;
          const alt1 = `\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{${n}} \\left(\\frac{${N} - 1}{${N} - ${n}}\\right)}`;
          const alt2 = `\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{${n}}}`;
          const alt3 = `\\frac{\\hat{p}(1 - \\hat{p})}{${n}} \\left(\\frac{${N} - ${n}}{${N}}\\right)`;

          const opts = [
            t(`$${correctStr}$`, `$${correctStr}$`),
            t(`$${alt1}$`, `$${alt1}$`),
            t(`$${alt2}$`, `$${alt2}$`),
            t(`$${alt3}$`, `$${alt3}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `When drawing a sample of size $n = ${n}$ without replacement from a population of size $N = ${N}$, what is the formula for the finite-population-corrected standard error of the sample proportion $\\hat{p}$?`,
              `当从容量为 $N = ${N}$ 的总体中不放回抽取容量为 $n = ${n}$ 的样本时，样本比例 $\\hat{p}$ 经有限总体校正后的标准误差公式是什么？`,
            ),
            options,
            correct,
            solution: t(
              `The finite-population-corrected standard error multiplies the uncorrected standard error by the FPC factor $\\sqrt{\\frac{N - n}{N - 1}}$, giving $\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{${n}} \\left(\\frac{${N} - ${n}}{${N} - 1}\\right)}$.`,
              `经有限总体校正的标准误差将未校正的标准误差乘以 FPC 因子 $\\sqrt{\\frac{N - n}{N - 1}}$，得到 $\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{${n}} \\left(\\frac{${N} - ${n}}{${N} - 1}\\right)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.25.6 Confidence Intervals for One Variance
  {
    id: "confidence-intervals-for-one-variance",
    title: t("Confidence Intervals for One Variance", "单总体方差的置信区间"),
    summary: t(
      "A 100(1 - α)% confidence interval for the variance σ^2 of a normal population is ((n - 1)s^2 / χ^2_{α/2, n-1}, (n - 1)s^2 / χ^2_{1 - α/2, n-1}).",
      "正态总体方差 σ^2 的 100(1 - α)% 置信区间为 ((n - 1)s^2 / χ^2_{α/2, n-1}, (n - 1)s^2 / χ^2_{1 - α/2, n-1})。",
    ),
    prerequisites: ["the-sample-variance", "the-chi-square-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "chi-square-variance-confidence-bounds",
        title: t("Identifying endpoints for variance confidence intervals", "确定方差置信区间的上下限构造"),
        explanation: t(
          "The interval is $\\left[\\frac{(n-1)s^2}{\\chi^2_{\\text{upper}}}, \\frac{(n-1)s^2}{\\chi^2_{\\text{lower}}}\\right]$. Note that the larger critical value produces the lower bound.",
          "区间为 $\\left[\\frac{(n-1)s^2}{\\chi^2_{\\text{upper}}}, \\frac{(n-1)s^2}{\\chi^2_{\\text{lower}}}\\right]$。注意较大的卡方临界值对应置信下限。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(6, 40);
          const sSq = rng.int(5, 30);
          const ss = (n - 1) * sSq;

          const opts = [
            t(
              `$\\left[ \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}}, \\; \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}} \\right]$`,
              `$\\left[ \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}}, \\; \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}} \\right]$`,
            ),
            t(
              `$\\left[ \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}}, \\; \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}} \\right]$`,
              `$\\left[ \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}}, \\; \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}} \\right]$`,
            ),
            t(
              `$\\left[ \\frac{${sSq}}{\\chi^2_{\\alpha/2, ${n}}}, \\; \\frac{${sSq}}{\\chi^2_{1 - \\alpha/2, ${n}}} \\right]$`,
              `$\\left[ \\frac{${sSq}}{\\chi^2_{\\alpha/2, ${n}}}, \\; \\frac{${sSq}}{\\chi^2_{1 - \\alpha/2, ${n}}} \\right]$`,
            ),
            t(`$${sSq} \\pm z_{\\alpha/2} \\frac{${sSq}}{\\sqrt{${n}}}$`, `$${sSq} \\pm z_{\\alpha/2} \\frac{${sSq}}{\\sqrt{${n}}}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ from a normal distribution yields sample variance $s^2 = ${sSq}$. What is the correct formula for the $100(1 - \\alpha)\\%$ confidence interval for the population variance $\\sigma^2$?`,
              `从正态分布中抽取容量为 $n = ${n}$ 的随机样本，测得样本方差为 $s^2 = ${sSq}$。求总体方差 $\\sigma^2$ 的 $100(1 - \\alpha)\\%$ 置信区间的正确公式。`,
            ),
            options,
            correct,
            solution: t(
              `Using the pivotal quantity $\\frac{(n - 1)s^2}{\\sigma^2} \\sim \\chi^2(${n - 1})$, inverting yields the bounds $\\left[ \\frac{(n - 1)s^2}{\\chi^2_{\\alpha/2, n-1}}, \\frac{(n - 1)s^2}{\\chi^2_{1 - \\alpha/2, n-1}} \\right] = \\left[ \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}}, \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}} \\right]$.`,
              `利用枢轴量 $\\frac{(n - 1)s^2}{\\sigma^2} \\sim \\chi^2(${n - 1})$ 反解不等式，得到置信区间为 $\\left[ \\frac{(n - 1)s^2}{\\chi^2_{\\alpha/2, n-1}}, \\frac{(n - 1)s^2}{\\chi^2_{1 - \\alpha/2, n-1}} \\right] = \\left[ \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}}, \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}} \\right]$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.26.1 Confidence Intervals for Differences Between Two Means: Known Population Variances
  {
    id: "confidence-intervals-for-differences-between-two-means-known-population-variances",
    title: t("Confidence Intervals for Differences Between Two Means: Known Population Variances", "两个均值之差的置信区间：已知总体方差"),
    summary: t(
      "When independent samples are drawn from populations with known variances σ1^2 and σ2^2, the confidence interval for μ1 - μ2 is (x̄1 - x̄2) ± z_{α/2} √(σ1^2 / n1 + σ2^2 / n2).",
      "当从已知方差分别为 σ1^2 与 σ2^2 的两个总体中抽取独立样本时，μ1 - μ2 的置信区间为 (x̄1 - x̄2) ± z_{α/2} √(σ1^2 / n1 + σ2^2 / n2)。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "two-mean-known-variance-se",
        title: t("Evaluating the standard error of difference between two independent means", "计算两个独立均值之差的标准误差"),
        explanation: t(
          "The standard error is $SE = \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$.",
          "标准误差为 $SE = \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$。",
        ),
        generate: (rng: Rng): Problem => {
          const v1 = rng.int(10, 80);
          const n1 = rng.int(5, 40);
          const v2 = rng.int(10, 80);
          const n2 = rng.int(5, 40);
          // SE^2 = v1/n1 + v2/n2 = (v1*n2 + v2*n1) / (n1*n2)
          const num = v1 * n2 + v2 * n1;
          const den = n1 * n2;

          return numberProblem({
            prompt: t(
              `Independent samples from two populations have sizes $n_1 = ${n1}$, $n_2 = ${n2}$ and known population variances $\\sigma_1^2 = ${v1}$, $\\sigma_2^2 = ${v2}$. Find the squared standard error of the difference between sample means, $\\text{SE}^2 = \\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}$.`,
              `来自两个总体的独立样本容量分别为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$，已知总体方差分别为 $\\sigma_1^2 = ${v1}$ 与 $\\sigma_2^2 = ${v2}$。求样本均值之差的标准误差平方 $\\text{SE}^2 = \\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}$。`,
            ),
            answer: Q.of(num, den),
            solution: t(
              `$\\text{SE}^2 = \\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2} = \\frac{${v1}}{${n1}} + \\frac{${v2}}{${n2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$\\text{SE}^2 = \\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2} = \\frac{${v1}}{${n1}} + \\frac{${v2}}{${n2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.26.2 Confidence Intervals for Differences Between Two Means: Unknown Equal Population Variances
  {
    id: "confidence-intervals-for-differences-between-two-means-unknown-equal-population-variances",
    title: t(
      "Confidence Intervals for Differences Between Two Means: Unknown Equal Population Variances",
      "两个均值之差的置信区间：未知且相等总体方差",
    ),
    summary: t(
      "Assuming equal unknown variances σ1^2 = σ2^2, the confidence interval is (x̄1 - x̄2) ± t_{α/2, n1+n2-2} s_p √(1/n1 + 1/n2).",
      "在假定总体方差未知但相等的条件下，置信区间为 (x̄1 - x̄2) ± t_{α/2, n1+n2-2} s_p √(1/n1 + 1/n2)。",
    ),
    prerequisites: ["pooled-variance", "confidence-intervals-for-differences-between-two-means-known-population-variances"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "pooled-t-degrees-of-freedom",
        title: t("Degrees of freedom for pooled two-sample t interval", "合并双样本 t 置信区间的自由度"),
        explanation: t(
          "The degrees of freedom for pooled two-sample t is ν = n1 + n2 - 2.",
          "合并双样本 t 检验/置信区间的自由度为 ν = n1 + n2 - 2。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(8, 35);
          const n2 = rng.int(8, 35);

          return numberProblem({
            prompt: t(
              `Two independent samples of sizes $n_1 = ${n1}$ and $n_2 = ${n2}$ are drawn from normal populations with unknown but equal variances. How many degrees of freedom $\\nu = n_1 + n_2 - 2$ are associated with the pooled $t$ statistic?`,
              `从方差未知但假定相等的正态总体中分别抽取容量为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$ 的独立样本。合并 $t$ 统计量的自由度 $\\nu = n_1 + n_2 - 2$ 是多少？`,
            ),
            answer: n1 + n2 - 2,
            solution: t(
              `$\\nu = n_1 + n_2 - 2 = ${n1} + ${n2} - 2 = ${n1 + n2 - 2}$.`,
              `$\\nu = n_1 + n_2 - 2 = ${n1} + ${n2} - 2 = ${n1 + n2 - 2}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.26.3 Confidence Intervals for Differences Between Two Means: Unknown Unequal Population Variances
  {
    id: "confidence-intervals-for-differences-between-two-means-unknown-unequal-population-variances",
    title: t(
      "Confidence Intervals for Differences Between Two Means: Unknown Unequal Population Variances",
      "两个均值之差的置信区间：未知且不等总体方差",
    ),
    summary: t(
      "When population variances are unequal and unknown, Welch's t-interval uses SE = √(s1^2 / n1 + s2^2 / n2) with degrees of freedom computed via Welch-Satterthwaite approximation.",
      "当总体方差未知且不相等时，韦尔奇（Welch）t 区间采用标准误差 SE = √(s1^2 / n1 + s2^2 / n2)，并通过韦尔奇-萨特思韦特公式计算自由度。",
    ),
    prerequisites: [
      "confidence-intervals-for-differences-between-two-means-known-population-variances",
      "confidence-intervals-for-one-mean-unknown-population-variance",
    ],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "welch-standard-error-formula",
        title: t("Formulating the standard error for Welch's t interval", "构建韦尔奇 t 区间的标准误差公式"),
        explanation: t(
          "Welch's standard error is $SE = \\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}$.",
          "韦尔奇标准误差为 $SE = \\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}$。",
        ),
        generate: (rng: Rng): Problem => {
          const s1Sq = rng.int(10, 50);
          const n1 = rng.int(5, 30);
          const s2Sq = rng.int(10, 50);
          const n2 = rng.int(5, 30);
          const num = s1Sq * n2 + s2Sq * n1;
          const den = n1 * n2;

          return numberProblem({
            prompt: t(
              `Two independent samples have sizes $n_1 = ${n1}$, $n_2 = ${n2}$ and sample variances $s_1^2 = ${s1Sq}$, $s_2^2 = ${s2Sq}$. For Welch's $t$ procedure with unequal variances, calculate the squared standard error $\\text{SE}^2 = \\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}$.`,
              `两个独立样本的容量分别为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$，样本方差分别为 $s_1^2 = ${s1Sq}$ 与 $s_2^2 = ${s2Sq}$。在不等方差的韦尔奇 $t$ 程序下，计算标准误差的平方 $\\text{SE}^2 = \\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}$。`,
            ),
            answer: Q.of(num, den),
            solution: t(
              `$\\text{SE}^2 = \\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2} = \\frac{${s1Sq}}{${n1}} + \\frac{${s2Sq}}{${n2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$\\text{SE}^2 = \\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2} = \\frac{${s1Sq}}{${n1}} + \\frac{${s2Sq}}{${n2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.26.5 Confidence Intervals for Paired Samples: Known Variances
  {
    id: "confidence-intervals-for-paired-samples-known-variances",
    title: t("Confidence Intervals for Paired Samples: Known Variances", "配对样本的置信区间：已知方差"),
    summary: t(
      "When the population variance of differences σ_d^2 is known, a 100(1 - α)% confidence interval for the mean difference μ_d is d̄ ± z_{α/2} (σ_d / √n).",
      "当差值总体方差 σ_d^2 已知时，平均差值 μ_d 的 100(1 - α)% 置信区间为 d̄ ± z_{α/2} (σ_d / √n)。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "paired-known-variance-margin-of-error",
        title: t("Computing the margin of error for paired samples with known variance", "计算已知方差下配对样本的误差范围"),
        explanation: t(
          "The margin of error is $E = z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}}$.",
          "误差范围为 $E = z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}}$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 8);
          const n = k * k;
          const z = rng.pick([2, 3]);
          const sigmaD = k * rng.int(2, 10);
          const margin = z * (sigmaD / k);

          return numberProblem({
            prompt: t(
              `A paired sample of size $n = ${n}$ is drawn where the difference population has known standard deviation $\\sigma_d = ${sigmaD}$. For critical value $z_{\\alpha/2} = ${z}$, calculate the margin of error $E = z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}}$.`,
              `抽取容量为 $n = ${n}$ 的配对样本，已知差值总体的标准差为 $\\sigma_d = ${sigmaD}$。取临界值 $z_{\\alpha/2} = ${z}$，计算误差范围 $E = z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}}$。`,
            ),
            answer: margin,
            solution: t(
              `$E = z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}} = ${z} \\times \\frac{${sigmaD}}{\\sqrt{${n}}} = ${z} \\times \\frac{${sigmaD}}{${k}} = ${margin}$.`,
              `$E = z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}} = ${z} \\times \\frac{${sigmaD}}{\\sqrt{${n}}} = ${z} \\times \\frac{${sigmaD}}{${k}} = ${margin}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.26.6 Confidence Intervals for Paired Samples: Unknown Variances
  {
    id: "confidence-intervals-for-paired-samples-unknown-variances",
    title: t("Confidence Intervals for Paired Samples: Unknown Variances", "配对样本的置信区间：未知方差"),
    summary: t(
      "For paired observations (x_1i, x_2i) with unknown variance, analyzing univariate differences d_i = x_1i - x_2i gives the confidence interval d̄ ± t_{α/2, n-1} (s_d / √n).",
      "对于方差未知的配对观测值 (x_1i, x_2i)，分析一元差值 d_i = x_1i - x_2i 给出置信区间 d̄ ± t_{α/2, n-1} (s_d / √n)。",
    ),
    prerequisites: [
      "confidence-intervals-for-paired-samples-known-variances",
      "confidence-intervals-for-one-mean-unknown-population-variance",
    ],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "paired-differences-mean-calculation",
        title: t("Computing the mean difference d̄ from paired observations", "根据配对观测值计算平均差值 d̄"),
        explanation: t(
          "The mean difference is $\\bar{d} = \\frac{1}{n} \\sum_i (x_{1i} - x_{2i})$.",
          "差值的均值为 $\\bar{d} = \\frac{1}{n} \\sum_i (x_{1i} - x_{2i})$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 8);
          const diffs: number[] = [];
          let sumD = 0;
          for (let i = 0; i < n; i++) {
            const d = rng.int(-5, 15);
            diffs.push(d);
            sumD += d;
          }
          const diffStr = diffs.join(", ");

          return numberProblem({
            prompt: t(
              `In a paired-sample study with $n = ${n}$ subject pairs, the individual differences $d_i = x_{1i} - x_{2i}$ are: $${diffStr}$. Calculate the sample mean difference $\\bar{d} = \\frac{1}{n} \\sum_{i=1}^n d_i$.`,
              `在包含 $n = ${n}$ 对受试对象的配对样本研究中，各对差值 $d_i = x_{1i} - x_{2i}$ 分别为：$${diffStr}$。计算样本平均差值 $\\bar{d} = \\frac{1}{n} \\sum_{i=1}^n d_i$。`,
            ),
            answer: Q.of(sumD, n),
            solution: t(
              `The sum of paired differences is $\\sum d_i = ${sumD}$. Thus $\\bar{d} = \\frac{${sumD}}{${n}}${lowestTerms(sumD, n)}$.`,
              `配对差值之和为 $\\sum d_i = ${sumD}$。因此 $\\bar{d} = \\frac{${sumD}}{${n}}${lowestTerms(sumD, n)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.26.5 Confidence Intervals for Differences Between Two Proportions
  {
    id: "confidence-intervals-for-differences-between-two-proportions",
    title: t("Confidence Intervals for Differences Between Two Proportions", "两个比例之差的置信区间"),
    summary: t(
      "A large-sample confidence interval for p1 - p2 is (p̂1 - p̂2) ± z_{α/2} √( (p̂1(1 - p̂1) / n1) + (p̂2(1 - p̂2) / n2) ).",
      "两个总体比例之差 p1 - p2 的大样本置信区间为 (p̂1 - p̂2) ± z_{α/2} √( (p̂1(1 - p̂1) / n1) + (p̂2(1 - p̂2) / n2) )。",
    ),
    prerequisites: ["confidence-intervals-for-one-proportion"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "two-proportion-variance-evaluation",
        title: t("Evaluating the estimated variance of difference between two proportions", "计算两个比例之差的估计方差"),
        explanation: t(
          "$\\operatorname{Var}(\\hat{p}_1 - \\hat{p}_2) = \\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}$.",
          "$\\operatorname{Var}(\\hat{p}_1 - \\hat{p}_2) = \\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(50, 200);
          const n2 = rng.int(50, 200);
          // Let p1 = 0.5, p2 = 0.5 for clean product 1/4
          // Var = (1/4)/n1 + (1/4)/n2 = (n1 + n2) / (4 * n1 * n2)
          const num = n1 + n2;
          const den = 4 * n1 * n2;

          return numberProblem({
            prompt: t(
              `Two independent samples of sizes $n_1 = ${n1}$ and $n_2 = ${n2}$ have sample proportions $\\hat{p}_1 = \\frac{1}{2}$ and $\\hat{p}_2 = \\frac{1}{2}$. Find the estimated variance of their difference, $\\widehat{\\text{Var}}(\\hat{p}_1 - \\hat{p}_2) = \\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}$.`,
              `容量分别为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$ 的两个独立样本，样本比例分别为 $\\hat{p}_1 = \\frac{1}{2}$ 与 $\\hat{p}_2 = \\frac{1}{2}$。求两者之差的估计方差 $\\widehat{\\text{Var}}(\\hat{p}_1 - \\hat{p}_2) = \\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}$。`,
            ),
            answer: Q.of(num, den),
            solution: t(
              `Since $\\hat{p}_1(1 - \\hat{p}_1) = \\frac{1}{4}$ and $\\hat{p}_2(1 - \\hat{p}_2) = \\frac{1}{4}$, $\\widehat{\\text{Var}}(\\hat{p}_1 - \\hat{p}_2) = \\frac{1}{4(${n1})} + \\frac{1}{4(${n2})} = \\frac{${n1} + ${n2}}{4(${n1})(${n2})} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `由于 $\\hat{p}_1(1 - \\hat{p}_1) = \\frac{1}{4}$ 且 $\\hat{p}_2(1 - \\hat{p}_2) = \\frac{1}{4}$，故 $\\widehat{\\text{Var}}(\\hat{p}_1 - \\hat{p}_2) = \\frac{1}{4(${n1})} + \\frac{1}{4(${n2})} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.27.1 Sample Size Determination for Estimating Means
  {
    id: "sample-size-determination-for-estimating-means",
    title: t("Sample Size Determination for Estimating Means", "估计均值的样本容量确定"),
    summary: t(
      "To estimate a population mean μ within desired margin of error E at 100(1 - α)% confidence, the required minimum sample size is n = ⌈(z_{α/2} σ / E)^2⌉.",
      "为了在 100(1 - α)% 置信水平下将总体均值 μ 的估计误差控制在允许范围 E 之内，所需的最小样本容量为 n = ⌈(z_{α/2} σ / E)^2⌉。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-required-sample-size-mean",
        title: t("Calculating required sample size for mean estimation", "计算均值估计所需的样本容量"),
        explanation: t(
          "$n = \\left(\\frac{z \\sigma}{E}\\right)^2$. Always round up to the next integer if the result is not exact.",
          "$n = \\left(\\frac{z \\sigma}{E}\\right)^2$。若计算结果不是整数，总是向上取整。",
        ),
        generate: (rng: Rng): Problem => {
          const z = rng.pick([2, 3]);
          const E = rng.int(1, 5);
          const mult = rng.int(2, 8);
          const sigma = mult * E; // so z * sigma / E is an integer
          const base = (z * sigma) / E;
          const requiredN = base * base;

          return numberProblem({
            prompt: t(
              `To estimate a population mean with standard deviation $\\sigma = ${sigma}$ within a desired margin of error $E = ${E}$ using critical value $z_{\\alpha/2} = ${z}$, calculate the required sample size $n = \\left(\\frac{z_{\\alpha/2} \\sigma}{E}\\right)^2$.`,
              `已知总体标准差 $\\sigma = ${sigma}$，取临界值 $z_{\\alpha/2} = ${z}$，若期望将总体均值的误差范围控制在 $E = ${E}$ 之内，计算所需的样本容量 $n = \\left(\\frac{z_{\\alpha/2} \\sigma}{E}\\right)^2$。`,
            ),
            answer: requiredN,
            solution: t(
              `$n = \\left(\\frac{${z} \\times ${sigma}}{${E}}\\right)^2 = (${base})^2 = ${requiredN}$.`,
              `$n = \\left(\\frac{${z} \\times ${sigma}}{${E}}\\right)^2 = (${base})^2 = ${requiredN}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.27.2 Sample Size Determination for Estimating Means: Finite Populations
  {
    id: "sample-size-determination-for-estimating-means-finite-populations",
    title: t("Sample Size Determination for Estimating Means: Finite Populations", "估计均值的样本容量确定：有限总体"),
    summary: t(
      "For a finite population of size N, the required sample size adjusted for FPC is n = (N n_0) / (n_0 + N - 1), where n_0 = (z_{α/2} σ / E)^2.",
      "对于容量为 N 的有限总体，经 FPC 校正后的必要样本容量为 n = (N n_0) / (n_0 + N - 1)，其中 n_0 = (z_{α/2} σ / E)^2。",
    ),
    prerequisites: ["sample-size-determination-for-estimating-means", "finite-population-corrections-for-sample-means"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-finite-sample-size-means",
        title: t("Computing adjusted sample size for finite populations", "计算有限总体的校正样本容量"),
        explanation: t(
          "With the finite population correction, $n = \\frac{N n_0}{n_0 + N - 1}$.",
          "经有限总体校正，$n = \\frac{N n_0}{n_0 + N - 1}$。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(200, 1000);
          const n0 = rng.int(50, 200);
          const num = N * n0;
          const den = n0 + N - 1;

          return numberProblem({
            prompt: t(
              `A researcher finds that an infinite-population sample size calculation gives $n_0 = ${n0}$. The actual finite population has size $N = ${N}$. Calculate the exact rational value of the adjusted sample size $n = \\frac{N n_0}{n_0 + N - 1}$.`,
              `研究人员计算得到假定无限总体下的样本容量为 $n_0 = ${n0}$。实际有限总体容量为 $N = ${N}$。计算经校正后的必要样本容量 $n = \\frac{N n_0}{n_0 + N - 1}$ 的精确有理数值。`,
            ),
            answer: Q.of(num, den),
            solution: t(
              `$n = \\frac{N n_0}{n_0 + N - 1} = \\frac{(${N})(${n0})}{${n0} + ${N} - 1} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$n = \\frac{N n_0}{n_0 + N - 1} = \\frac{(${N})(${n0})}{${n0} + ${N} - 1} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.27.3 Sample Size Determination for Estimating Proportions
  {
    id: "sample-size-determination-for-estimating-proportions",
    title: t("Sample Size Determination for Estimating Proportions", "估计比例的样本容量确定"),
    summary: t(
      "The sample size required to estimate a population proportion p within margin E is n = (z_{α/2}^2 p(1 - p)) / E^2. Using p = 0.5 provides the most conservative maximum sample size.",
      "为了在允许误差 E 内估计总体比例 p，所需样本容量为 n = (z_{α/2}^2 p(1 - p)) / E^2。取 p = 0.5 可获得最保守的最大样本容量。",
    ),
    prerequisites: ["confidence-intervals-for-one-proportion", "sample-size-determination-for-estimating-means"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "conservative-sample-size-proportion",
        title: t("Conservative sample size calculation with p = 0.5", "采用 p = 0.5 的保守样本容量计算"),
        explanation: t(
          "$p(1 - p)$ is maximized at $p = 0.5$, where $p(1 - p) = 0.25 = \\frac{1}{4}$, giving $n = \\frac{z^2}{4E^2}$.",
          "$p(1 - p)$ 在 $p = 0.5$ 处取得最大值 $0.25 = \\frac{1}{4}$，因此最保守的样本容量为 $n = \\frac{z^2}{4E^2}$。",
        ),
        generate: (rng: Rng): Problem => {
          // E = 1/k where k in [10, 50]
          const k = rng.int(10, 50);
          // z = 2
          // n = (z^2 * 0.25) / E^2 = (4 * 0.25) * k^2 = k^2
          const n = k * k;

          return numberProblem({
            prompt: t(
              `Using $z_{\\alpha/2} = 2$ and the conservative planning value $p = 0.5$, calculate the required sample size $n = \\frac{z_{\\alpha/2}^2 p(1 - p)}{E^2}$ to estimate a population proportion within a margin of error $E = \\frac{1}{${k}}${lowestTerms(1, k)}$.`,
              `取临界值 $z_{\\alpha/2} = 2$ 并采用最保守的规划值 $p = 0.5$，若要将总体比例的误差范围控制在 $E = \\frac{1}{${k}}$ 之内，计算所需的样本容量 $n = \\frac{z_{\\alpha/2}^2 p(1 - p)}{E^2}$。`,
            ),
            answer: n,
            solution: t(
              `With $p = 0.5$, $p(1 - p) = \\frac{1}{4}$. Thus $n = \\frac{2^2 \\left(\\frac{1}{4}\\right)}{(1/${k})^2} = \\frac{1}{1/${k * k}} = ${n}$.`,
              `取 $p = 0.5$ 时，$p(1 - p) = \\frac{1}{4}$。因此 $n = \\frac{2^2 \\left(\\frac{1}{4}\\right)}{(1/${k})^2} = \\frac{1}{1/${k * k}} = ${n}$。`,
            ),
          });
        },
      },
    ],
  },

  // 7.27.4 Sample Size Determination for Estimating Proportions: Finite Populations
  {
    id: "sample-size-determination-for-estimating-proportions-finite-populations",
    title: t("Sample Size Determination for Estimating Proportions: Finite Populations", "估计比例的样本容量确定：有限总体"),
    summary: t(
      "For a finite population of size N, the FPC-adjusted sample size for estimating proportions is n = (N n_0) / (n_0 + N - 1), where n_0 is the uncorrected sample size.",
      "对于容量为 N 的有限总体，估计比例时经 FPC 校正的必要样本容量为 n = (N n_0) / (n_0 + N - 1)，其中 n_0 为未校正的样本容量。",
    ),
    prerequisites: [
      "sample-size-determination-for-estimating-proportions",
      "sample-size-determination-for-estimating-means-finite-populations",
    ],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-finite-sample-size-proportions",
        title: t("Computing FPC-adjusted sample size for proportions", "计算比例估计的有限总体校正样本容量"),
        explanation: t(
          "With the finite population correction, $n = \\frac{N n_0}{n_0 + N - 1}$.",
          "经有限总体校正，$n = \\frac{N n_0}{n_0 + N - 1}$。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(300, 2000);
          const n0 = rng.int(100, 400);
          const num = N * n0;
          const den = n0 + N - 1;

          return numberProblem({
            prompt: t(
              `An initial proportion sample size calculation yields $n_0 = ${n0}$. The finite population contains $N = ${N}$ items. Find the exact rational value of the adjusted sample size $n = \\frac{N n_0}{n_0 + N - 1}$.`,
              `初始比例样本容量计算结果为 $n_0 = ${n0}$。实际有限总体包含 $N = ${N}$ 个个体。求经有限校正后的样本容量 $n = \\frac{N n_0}{n_0 + N - 1}$ 的精确有理数值。`,
            ),
            answer: Q.of(num, den),
            solution: t(
              `$n = \\frac{N n_0}{n_0 + N - 1} = \\frac{(${N})(${n0})}{${n0} + ${N} - 1} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$n = \\frac{N n_0}{n_0 + N - 1} = \\frac{(${N})(${n0})}{${n0} + ${N} - 1} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
    ],
  },
];
