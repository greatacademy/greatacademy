import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { choiceProblem, numberProblem } from "../problems.ts";

/** Topics for Unit 6: Parametric Inference (new topics). */
export const probabilityAndStatisticsParametricInferenceTopics: TopicDef[] = [
  // 6.22.1 The Sample Mean
  {
    id: "the-sample-mean",
    title: t("The Sample Mean", "样本均值"),
    summary: t(
      "The sample mean X̄ = (1/n) ∑_{i=1}^n X_i is the arithmetic average of a sample, serving as the standard point estimator for the population mean μ.",
      "样本均值 X̄ = (1/n) ∑_{i=1}^n X_i 是样本观测值的算术平均数，是总体均值 μ 的标准点估计量。",
    ),
    prerequisites: ["properties-of-expectation-for-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "sample-mean-calculation",
        title: t("Calculating the sample mean from raw data", "根据原始数据计算样本均值"),
        explanation: t(
          "Sum all observations and divide by sample size n: x̄ = (∑ x_i) / n.",
          "将所有观测值相加并除以样本容量 n：x̄ = (∑ x_i) / n。",
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
              `Given the sample observations: $${listStr}$, calculate the sample mean $\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i$.`,
              `已知样本观测值数据：$${listStr}$，计算样本均值 $\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i$。`,
            ),
            answer: Q.of(sum, n),
            solution: t(
              `The sample size is $n = ${n}$ and the sum is $\\sum x_i = ${sum}$. Thus $\\bar{x} = \\frac{${sum}}{${n}}$.`,
              `样本容量为 $n = ${n}$，观测值总和为 $\\sum x_i = ${sum}$。因此 $\\bar{x} = \\frac{${sum}}{${n}}$。`,
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
          "For any population with mean μ, the expected value of the sample mean is E[X̄] = μ (unbiasedness).",
          "对任意均值为 μ 的总体，样本均值的期望值满足 E[X̄] = μ（无偏性）。",
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
            solution: t(
              `The sample mean is an unbiased estimator of the population mean: $E[\\bar{X}] = \\mu = ${mu}$, regardless of sample size $n$.`,
              `样本均值是总体均值的无偏估计量：无论样本容量 $n$ 为何值，均有 $E[\\bar{X}] = \\mu = ${mu}$。`,
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
      "The sample variance S^2 = (1/(n-1)) ∑_{i=1}^n (X_i - X̄)^2 uses n - 1 degrees of freedom to ensure unbiased estimation of the population variance σ^2.",
      "样本方差 S^2 = (1/(n-1)) ∑_{i=1}^n (X_i - X̄)^2 采用 n - 1 个自由度以确保对总体方差 σ^2 的无偏估计。",
    ),
    prerequisites: ["the-sample-mean", "properties-of-variance-for-discrete-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "sample-variance-calculation-small-n",
        title: t("Calculating sample variance with n - 1 divisor", "用除数 n - 1 计算样本方差"),
        explanation: t("S^2 = (1/(n-1)) [∑ x_i^2 - n x̄^2].", "S^2 = (1/(n-1)) [∑ x_i^2 - n x̄^2]。"),
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
              `Calculate the unbiased sample variance $s^2 = \\frac{1}{n - 1} \\sum_{i=1}^n (x_i - \\bar{x})^2$ for the sample dataset: $${listStr}$.`,
              `计算样本数据集 $${listStr}$ 的无偏样本方差 $s^2 = \\frac{1}{n - 1} \\sum_{i=1}^n (x_i - \\bar{x})^2$。`,
            ),
            answer: Q.of(ss, 2),
            solution: t(
              `The sample mean is $\\bar{x} = ${mean}$. The deviations from the mean are $${d1}, ${d2}, ${d3}$, with sum of squared deviations $\\sum (x_i - \\bar{x})^2 = ${d1}^2 + ${d2}^2 + ${d3}^2 = ${ss}$. Dividing by $n - 1 = 2$ yields $s^2 = \\frac{${ss}}{2}$.`,
              `样本均值为 $\\bar{x} = ${mean}$。各离均差分别为 $${d1}, ${d2}, ${d3}$，离均差平方和为 $\\sum (x_i - \\bar{x})^2 = ${d1}^2 + ${d2}^2 + ${d3}^2 = ${ss}$。除以 $n - 1 = 2$ 得到 $s^2 = \\frac{${ss}}{2}$。`,
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
      "When two independent samples share an assumed common variance σ^2, the pooled sample variance s_p^2 = ((n1-1)s1^2 + (n2-1)s2^2) / (n1+n2-2) combines them with degrees of freedom n1+n2-2.",
      "当两个独立样本被假定具有相同的总体方差 σ^2 时，合并样本方差 s_p^2 = ((n1-1)s1^2 + (n2-1)s2^2) / (n1+n2-2) 结合了两组信息，具有 n1+n2-2 个自由度。",
    ),
    prerequisites: ["the-sample-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "pooled-variance-evaluation",
        title: t("Computing pooled variance from two independent samples", "根据两个独立样本计算合并方差"),
        explanation: t("s_p^2 = ((n1 - 1)s1^2 + (n2 - 1)s2^2) / (n1 + n2 - 2).", "s_p^2 = ((n1 - 1)s1^2 + (n2 - 1)s2^2) / (n1 + n2 - 2)。"),
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
            solution: t(
              `$s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2} = \\frac{(${df1})(${s1Sq}) + (${df2})(${s2Sq})}{${df1} + ${df2}} = \\frac{${num}}{${den}}$.`,
              `$s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2} = \\frac{(${df1})(${s1Sq}) + (${df2})(${s2Sq})}{${df1} + ${df2}} = \\frac{${num}}{${den}}$。`,
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
      "For independent observations from a population with variance σ^2, Var(X̄) = σ^2 / n, and the standard error of the mean is SE(X̄) = σ / √n.",
      "对来自方差为 σ^2 总体的独立样本观测值，Var(X̄) = σ^2 / n，均值的标准误为 SE(X̄) = σ / √n。",
    ),
    prerequisites: ["the-sample-variance"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "standard-error-of-the-mean",
        title: t("Evaluating the standard error of the sample mean", "计算样本均值的标准误差"),
        explanation: t(
          "SE(X̄) = σ / √n decreases inversely with the square root of sample size.",
          "SE(X̄) = σ / √n 与样本容量的平方根成反比递减。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 12);
          const sigma = rng.int(10, 60);
          const n = k * k; // perfect square

          return numberProblem({
            prompt: t(
              `A sample of size $n = ${n}$ is randomly selected from a population with standard deviation $\\sigma = ${sigma}$. Find the standard error of the sample mean, $\\text{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}$.`,
              `从标准差为 $\\sigma = ${sigma}$ 的总体中随机抽取容量为 $n = ${n}$ 的样本。求样本均值的标准误差 $\\text{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}$。`,
            ),
            answer: Q.of(sigma, k),
            solution: t(
              `$\\text{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${k}}$.`,
              `$\\text{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${k}}$。`,
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
      "If a sample is drawn from a normal population N(μ, σ^2), the sample mean X̄ is exactly normally distributed as N(μ, σ^2 / n) for any sample size n.",
      "若样本抽取自正态总体 N(μ, σ^2)，则无论样本容量 n 为何值，样本均值 X̄ 均严格服从正态分布 N(μ, σ^2 / n)。",
    ),
    prerequisites: ["variance-of-sample-means", "the-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "exact-normality-of-sample-mean",
        title: t("Exact normality of X̄ from normal populations", "正态总体下样本均值的严格正态性"),
        explanation: t(
          "For any n ≥ 1, X̄ ~ N(μ, σ^2/n) holds exactly without requiring large n.",
          "对任意样本容量 n ≥ 1，X̄ ~ N(μ, σ^2/n) 均精确成立，无需大样本条件。",
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

          return choiceProblem({
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
        explanation: t("E[p̂] = p is unbiased regardless of population size N.", "无论总体容量 N 为何值，样本比例均满足无偏性 E[p̂] = p。"),
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
            solution: t(
              `The sample proportion $\\hat{p} = \\frac{X}{n}$ is an unbiased estimator of $p$: $E[\\hat{p}] = p = \\frac{${num}}{${den}}$.`,
              `样本比例 $\\hat{p} = \\frac{X}{n}$ 是 $p$ 的无偏估计量：$E[\\hat{p}] = p = \\frac{${num}}{${den}}$。`,
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
      "The method of moments equates theoretical population moments μ_k = E[X^k] to sample moments m_k = (1/n) ∑ X_i^k to solve for parameter estimators.",
      "矩估计法通过将总体理论矩 μ_k = E[X^k] 与样本原点矩 m_k = (1/n) ∑ X_i^k 联立求解，以获得未知参数的估计量。",
    ),
    prerequisites: ["sampling-distributions", "moments-of-discrete-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "method-of-moments-poisson-or-exp",
        title: t("Estimating parameter using the first sample moment", "利用一阶样本矩估计未知参数"),
        explanation: t(
          "For X ~ Poisson(λ), E[X] = λ, so the method of moments estimator is λ̂ = x̄.",
          "对于 X ~ Poisson(λ)，理论均值为 E[X] = λ，故矩估计量为 λ̂ = x̄。",
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
            solution: t(
              `Setting the population first moment equal to the sample first moment: $E[X] = \\lambda = \\bar{x} = \\frac{\\sum x_i}{n} = \\frac{${sum}}{${n}}$. Thus $\\hat{\\lambda} = \\frac{${sum}}{${n}}$.`,
              `令总体一阶原点矩等于样本一阶原点矩：$E[X] = \\lambda = \\bar{x} = \\frac{\\sum x_i}{n} = \\frac{${sum}}{${n}}$。因此 $\\hat{\\lambda} = \\frac{${sum}}{${n}}$。`,
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
      "For two-parameter families, the first two population moments E[X] and E[X^2] are matched to sample moments m1 = x̄ and m2 = (1/n) ∑ X_i^2 to estimate both parameters simultaneously.",
      "对于含两个未知参数的分布族，通过将前两阶总体矩 E[X] 与 E[X^2] 分别与样本矩 m1 = x̄ 及 m2 = (1/n) ∑ X_i^2 联立，同时估计两个参数。",
    ),
    prerequisites: ["the-method-of-moments"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "method-of-moments-uniform-zero-theta",
        title: t("Method of moments for continuous uniform U(0, θ)", "连续均匀分布 U(0, θ) 的矩估计"),
        explanation: t("For X ~ U(0, θ), E[X] = θ / 2, so θ̂ = 2 x̄.", "对于 X ~ U(0, θ)，理论均值为 E[X] = θ / 2，因此矩估计量为 θ̂ = 2 x̄。"),
        generate: (rng: Rng): Problem => {
          const mean = rng.int(10, 60);

          return numberProblem({
            prompt: t(
              `A random sample is taken from a uniform distribution $X \\sim U(0, \\theta)$. The sample mean is calculated to be $\\bar{x} = ${mean}$. Using the method of moments, find the estimate $\\hat{\\theta}$.`,
              `从均匀分布 $X \\sim U(0, \\theta)$ 中抽取随机样本，计算得到样本均值为 $\\bar{x} = ${mean}$。利用矩估计法求未知参数 $\\theta$ 的估计值 $\\hat{\\theta}$。`,
            ),
            answer: 2 * mean,
            solution: t(
              `For $X \\sim U(0, \\theta)$, the theoretical mean is $E[X] = \\frac{\\theta}{2}$. Equating $E[X] = \\bar{x}$ gives $\\frac{\\hat{\\theta}}{2} = ${mean} \\implies \\hat{\\theta} = 2(${mean}) = ${2 * mean}$.`,
              `对于 $X \\sim U(0, \\theta)$，理论均值为 $E[X] = \\frac{\\theta}{2}$。令 $E[X] = \\bar{x}$ 得 $\\frac{\\hat{\\theta}}{2} = ${mean} \\implies \\hat{\\theta} = 2(${mean}) = ${2 * mean}$。`,
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
          "As n → ∞, (X̄ - μ) / (σ / √n) ➔ N(0, 1) for any population with finite variance σ^2.",
          "当 n → ∞ 时，对任意方差 σ^2 有限的总体，(X̄ - μ) / (σ / √n) 依分布收敛至 N(0, 1)。",
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
        explanation: t("z = (x̄ - μ) / (σ / √n).", "z = (x̄ - μ) / (σ / √n)。"),
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
            solution: t(
              `The standard error is $\\text{SE} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{${k}} = ${se}$. The $z$-score is $z = \\frac{\\bar{x} - \\mu}{\\text{SE}} = \\frac{${xBar} - ${mu}}{${se}} = \\frac{${diff}}{${se}} = ${z}$.`,
              `标准误差为 $\\text{SE} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{${k}} = ${se}$。标准化 $z$ 分数为 $z = \\frac{\\bar{x} - \\mu}{\\text{SE}} = \\frac{${xBar} - ${mu}}{${se}} = \\frac{${diff}}{${se}} = ${z}$。`,
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
        explanation: t("The squared FPC factor is (N - n) / (N - 1).", "有限总体校正因子的平方为 (N - n) / (N - 1)。"),
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
            solution: t(
              `$\\text{FPC}^2 = \\frac{N - n}{N - 1} = \\frac{${N} - ${n}}{${N} - 1} = \\frac{${num}}{${den}}$.`,
              `$\\text{FPC}^2 = \\frac{N - n}{N - 1} = \\frac{${N} - ${n}}{${N} - 1} = \\frac{${num}}{${den}}$。`,
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
        explanation: t("p̂ = x / n.", "p̂ = x / n。"),
        generate: (rng: Rng): Problem => {
          const n = rng.int(50, 400);
          const x = rng.int(10, n - 10);

          return numberProblem({
            prompt: t(
              `In a sample of $n = ${n}$ tested components, exactly $x = ${x}$ met all quality specifications. Find the point estimate of the population proportion $\\hat{p} = \\frac{x}{n}$.`,
              `在抽检的 $n = ${n}$ 个零部件中，恰好有 $x = ${x}$ 个符合全部质量规范。求总体合格比例的点估计值 $\\hat{p} = \\frac{x}{n}$。`,
            ),
            answer: Q.of(x, n),
            solution: t(
              `The point estimate is the ratio of successes to trials: $\\hat{p} = \\frac{x}{n} = \\frac{${x}}{${n}}$.`,
              `点估计值为成功频数与试验次数之比：$\\hat{p} = \\frac{x}{n} = \\frac{${x}}{${n}}$。`,
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
    ],
  },

  // 6.24.1 Product Notation
  {
    id: "product-notation",
    title: t("Product Notation", "连乘符号"),
    summary: t(
      "Capital Pi notation ∏_{i=1}^n a_i represents the product of terms a_1 · a_2 · ... · a_n, fundamental for constructing joint likelihood functions of independent observations.",
      "连乘符号 ∏_{i=1}^n a_i 表示项的乘积 a_1 · a_2 · ... · a_n，是构建独立观测值联合似然函数的基础工具。",
    ),
    prerequisites: ["the-sample-mean"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-product-constant-powers",
        title: t("Evaluating products of powers and constants", "计算常数与幂次的连乘式"),
        explanation: t("∏_{i=1}^n (c x_i) = c^n ∏_{i=1}^n x_i.", "∏_{i=1}^n (c x_i) = c^n ∏_{i=1}^n x_i。"),
        generate: (rng: Rng): Problem => {
          const c = rng.int(2, 6);
          const n = rng.int(2, 5);
          let ans = 1;
          for (let i = 0; i < n; i++) ans *= c;

          return numberProblem({
            prompt: t(`Evaluate the product expression $\\prod_{i=1}^{${n}} ${c}$.`, `计算连乘表达式 $\\prod_{i=1}^{${n}} ${c}$ 的值。`),
            answer: ans,
            solution: t(
              `Multiplying the constant $c = ${c}$ across $n = ${n}$ factors yields $c^n = ${c}^{${n}} = ${ans}$.`,
              `将常数 $c = ${c}$ 进行 $n = ${n}$ 次连乘得到 $c^n = ${c}^{${n}} = ${ans}$。`,
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
      "For independent observations x_1, ..., x_n from a discrete PMF p(x; θ), the likelihood function is the joint probability viewed as a function of the parameter: L(θ) = ∏_{i=1}^n p(x_i; θ).",
      "对于来自离散分布律 p(x; θ) 的独立观测值 x_1, ..., x_n，似然函数是将联合概率视为未知参数的函数：L(θ) = ∏_{i=1}^n p(x_i; θ)。",
    ),
    prerequisites: ["product-notation"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "bernoulli-likelihood-formulation",
        title: t("Formulating the Bernoulli likelihood function", "构建伯努利似然函数"),
        explanation: t(
          "For n independent Bernoulli trials with k successes, L(p) = p^k (1 - p)^{n - k}.",
          "对含有 k 次成功的 n 次独立伯努利试验，似然函数为 L(p) = p^k (1 - p)^{n - k}。",
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

          return choiceProblem({
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
      "The log-likelihood function ln L(θ) = ∑_{i=1}^n ln p(x_i; θ) transforms products into sums, simplifying differentiation and optimization while preserving the maximizing parameter value.",
      "对数似然函数 ln L(θ) = ∑_{i=1}^n ln p(x_i; θ) 将连乘转化为求和，在保持极值点不变的同时极大简化了求导与最优化计算。",
    ),
    prerequisites: ["likelihood-functions-for-discrete-probability-distributions", "logarithmic-differentiation"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "bernoulli-log-likelihood-expression",
        title: t("Expressing the log-likelihood of a Bernoulli sample", "表示伯努利样本的对数似然函数"),
        explanation: t("ln L(p) = k ln(p) + (n - k) ln(1 - p).", "ln L(p) = k ln(p) + (n - k) ln(1 - p)。"),
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

          return choiceProblem({
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
      "For continuous random variables with PDF f(x; θ), the likelihood of a sample is the product of density values: L(θ) = ∏_{i=1}^n f(x_i; θ).",
      "对于概率密度为 f(x; θ) 的连续型随机变量，样本似然函数为概率密度取值的连乘积：L(θ) = ∏_{i=1}^n f(x_i; θ)。",
    ),
    prerequisites: ["product-notation", "probability-density-functions-of-continuous-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "exponential-likelihood-formulation",
        title: t("Formulating the likelihood function for an exponential sample", "构建指数分布样本的似然函数"),
        explanation: t(
          "For X_i ~ Exp(λ), L(λ) = ∏ λ e^{-λ x_i} = λ^n e^{-λ ∑ x_i}.",
          "对于 X_i ~ Exp(λ)，似然函数为 L(λ) = ∏ λ e^{-λ x_i} = λ^n e^{-λ ∑ x_i}。",
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

          return choiceProblem({
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
      "For continuous distributions, ln L(θ) = ∑_{i=1}^n ln f(x_i; θ) simplifies exponentiated densities into linear and logarithmic terms.",
      "对于连续分布，对数似然函数 ln L(θ) = ∑_{i=1}^n ln f(x_i; θ) 将指数族概率密度简化为对数项与线性项的和。",
    ),
    prerequisites: ["likelihood-functions-for-continuous-probability-distributions", "logarithmic-differentiation"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "exponential-log-likelihood-expression",
        title: t("Deriving the log-likelihood function of an exponential sample", "推导指数分布样本的对数似然函数"),
        explanation: t("ln L(λ) = n ln(λ) - λ ∑ x_i.", "ln L(λ) = n ln(λ) - λ ∑ x_i。"),
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

          return choiceProblem({
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
          "Setting d/dλ [n ln λ - λ ∑ x_i] = n/λ - ∑ x_i = 0 yields λ̂ = n / ∑ x_i = 1 / x̄.",
          "令 d/dλ [n ln λ - λ ∑ x_i] = n/λ - ∑ x_i = 0，解得 λ̂ = n / ∑ x_i = 1 / x̄。",
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
            solution: t(
              `Solving the score equation $\\frac{d}{d\\lambda} \\ln L(\\lambda) = \\frac{n}{\\lambda} - \\sum x_i = 0$ yields $\\hat{\\lambda} = \\frac{n}{\\sum x_i} = \\frac{${n}}{${sum}}$.`,
              `求解得分方程 $\\frac{d}{d\\lambda} \\ln L(\\lambda) = \\frac{n}{\\lambda} - \\sum x_i = 0$ 得 $\\hat{\\lambda} = \\frac{n}{\\sum x_i} = \\frac{${n}}{${sum}}$。`,
            ),
          });
        },
      },
    ],
  },
];
