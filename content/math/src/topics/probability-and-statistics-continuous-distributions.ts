import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem } from "../problems.ts";

/** Topics for Unit 4: Continuous Probability Distributions (new topics). */
export const probabilityAndStatisticsContinuousDistributionTopics: TopicDef[] = [
  // 4.13.9 Normal Approximations of Binomial Distributions
  {
    id: "normal-approximations-of-binomial-distributions",
    title: t("Normal Approximations of Binomial Distributions", "二项分布的正态近似"),
    summary: t(
      "When n is large and p is not extreme (np ≥ 5 and n(1-p) ≥ 5), Binomial(n, p) can be approximated by N(np, np(1-p)) using continuity correction.",
      "当 n 较大且 p 不极端（np ≥ 5 且 n(1-p) ≥ 5）时，二项分布 Binomial(n, p) 可用正态分布 N(np, np(1-p)) 近似，并应用连续性校正。",
    ),
    prerequisites: ["the-normal-distribution", "the-binomial-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "continuity-correction-intervals",
        title: t("Applying continuity correction to discrete events", "对离散事件应用连续性校正"),
        explanation: t(
          "When a continuous distribution approximates whole number counts, extend each boundary by one half so that every included count keeps its full interval. For discrete X, P(X ≤ k) is approximated by P(Y ≤ k + 0.5) and P(X ≥ k) by P(Y ≥ k - 0.5) for continuous normal Y.",
          "当用连续分布近似整数计数时，把每个边界延伸二分之一，使每个被包含的计数保有完整的区间。对于离散随机变量 X，P(X ≤ k) 用连续正态变量 Y 的 P(Y ≤ k + 0.5) 近似，P(X ≥ k) 用 P(Y ≥ k - 0.5) 近似。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(10, 80);
          const isAtMost = rng.int(0, 1) === 0;
          const discreteStr = isAtMost ? `X \\le ${k}` : `X \\ge ${k}`;
          const correctBoundary = isAtMost ? `${k}.5` : `${k - 1}.5`;
          const alt1 = isAtMost ? `${k - 1}.5` : `${k}.5`;
          const alt2 = `${k}`;
          const alt3 = isAtMost ? `${k + 1}.5` : `${k - 2}.5`;

          const opts = [
            t(
              isAtMost ? `$Y \\le ${correctBoundary}$` : `$Y \\ge ${correctBoundary}$`,
              isAtMost ? `$Y \\le ${correctBoundary}$` : `$Y \\ge ${correctBoundary}$`,
            ),
            t(isAtMost ? `$Y \\le ${alt1}$` : `$Y \\ge ${alt1}$`, isAtMost ? `$Y \\le ${alt1}$` : `$Y \\ge ${alt1}$`),
            t(isAtMost ? `$Y \\le ${alt2}$` : `$Y \\ge ${alt2}$`, isAtMost ? `$Y \\le ${alt2}$` : `$Y \\ge ${alt2}$`),
            t(isAtMost ? `$Y \\le ${alt3}$` : `$Y \\ge ${alt3}$`, isAtMost ? `$Y \\le ${alt3}$` : `$Y \\ge ${alt3}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `When approximating the discrete binomial random variable $X$ with a continuous normal random variable $Y$, what is the continuity-corrected event corresponding to $P(${discreteStr})$?`,
              `当用连续正态随机变量 $Y$ 近似离散二项随机变量 $X$ 时，对应于 $P(${discreteStr})$ 的连续性校正事件是什么？`,
            ),
            options,
            correct,
            solution: t(
              isAtMost
                ? `To include the integer $k = ${k}$ within the continuous interval, the right endpoint extends to $k + 0.5 = ${k}.5$. Thus, $P(X \\le ${k}) \\approx P(Y \\le ${correctBoundary})$.`
                : `To include the integer $k = ${k}$ within the continuous interval, the left endpoint extends down to $k - 0.5 = ${k - 1}.5$. Thus, $P(X \\ge ${k}) \\approx P(Y \\ge ${correctBoundary})$.`,
              isAtMost
                ? `为了在连续区间内包含整数 $k = ${k}$，右端点向右扩展至 $k + 0.5 = ${k}.5$。因此 $P(X \\le ${k}) \\approx P(Y \\le ${correctBoundary})$。`
                : `为了在连续区间内包含整数 $k = ${k}$，左端点向左扩展至 $k - 0.5 = ${k - 1}.5$。因此 $P(X \\ge ${k}) \\approx P(Y \\ge ${correctBoundary})$。`,
            ),
          });
        },
      },
      {
        id: "normal-approximation-parameters",
        title: t("Computing mean and variance for normal approximation of binomial", "计算二项分布正态近似的均值与方差"),
        explanation: t(
          "The approximating normal distribution is chosen to have the same mean and variance as the binomial it replaces. For $X \\sim \\text{Binomial}(n, p)$, the approximating normal distribution has mean $\\mu = np$ and variance $\\sigma^2 = np(1 - p)$.",
          "近似的正态分布要选择与被替代的二项分布具有相同的均值和方差。对于 $X \\sim \\text{Binomial}(n, p)$，近似正态分布的均值为 $\\mu = np$，方差为 $\\sigma^2 = np(1 - p)$。",
        ),
        generate: (rng: Rng): Problem => {
          // Choose n and p such that np and np(1-p) are clean
          // e.g. p = 1/4, 1/2, 3/4 and n multiple of 16
          const pFrac = rng.pick([
            { num: 1, den: 2 },
            { num: 1, den: 4 },
            { num: 3, den: 4 },
            { num: 1, den: 5 },
            { num: 2, den: 5 },
          ]);
          const mult = rng.int(5, 50);
          const n = mult * pFrac.den * pFrac.den; // ensures np(1-p) is an integer
          const mean = (n * pFrac.num) / pFrac.den;
          const variance = (mean * (pFrac.den - pFrac.num)) / pFrac.den;

          return numberProblem({
            prompt: t(
              `A random variable $X \\sim \\text{Binomial}\\left(${n}, \\frac{${pFrac.num}}{${pFrac.den}}\\right)$ is approximated by a normal distribution $N(\\mu, \\sigma^2)$. Find the variance $\\sigma^2 = np(1 - p)$.`,
              `随机变量 $X \\sim \\text{Binomial}\\left(${n}, \\frac{${pFrac.num}}{${pFrac.den}}\\right)$ 用正态分布 $N(\\mu, \\sigma^2)$ 近似。求方差 $\\sigma^2 = np(1 - p)$。`,
            ),
            answer: variance,
            solution: t(
              `The variance of the approximating normal distribution is $\\sigma^2 = n p (1 - p) = ${n} \\cdot \\frac{${pFrac.num}}{${pFrac.den}} \\cdot \\frac{${pFrac.den - pFrac.num}}{${pFrac.den}} = ${variance}$.`,
              `近似正态分布的方差为 $\\sigma^2 = n p (1 - p) = ${n} \\cdot \\frac{${pFrac.num}}{${pFrac.den}} \\cdot \\frac{${pFrac.den - pFrac.num}}{${pFrac.den}} = ${variance}$。`,
            ),
          });
        },
      },
    ],
  },

  // 4.13.10 The Normal Approximation of the Poisson Distribution
  {
    id: "the-normal-approximation-of-the-poisson-distribution",
    title: t("The Normal Approximation of the Poisson Distribution", "泊松分布的正态近似"),
    summary: t(
      "For large parameter λ, Poisson(λ) is well-approximated by N(λ, λ) with continuity correction.",
      "当参数 λ 较大时，泊松分布 Poisson(λ) 可用正态分布 N(λ, λ) 良好近似，并应用连续性校正。",
    ),
    prerequisites: ["normal-approximations-of-binomial-distributions", "the-poisson-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "poisson-normal-approx-standard-deviation",
        title: t("Standard deviation of the approximating normal distribution", "近似正态分布的标准差"),
        explanation: t(
          "A Poisson variable with a large rate looks roughly normal, with the same mean and variance, so its standard deviation is the square root of the rate. For $X \\sim \\text{Poisson}(\\lambda)$, both the mean and the variance are $\\lambda$, so the standard deviation is $\\sigma = \\sqrt{\\lambda}$.",
          "速率很大的泊松变量大致呈正态分布，均值和方差相同，所以标准差是速率的平方根。对于 $X \\sim \\text{Poisson}(\\lambda)$，其均值和方差均为 $\\lambda$，因此标准差为 $\\sigma = \\sqrt{\\lambda}$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(4, 50);
          const lambda = k * k; // perfect square so sqrt(lambda) = k

          return numberProblem({
            prompt: t(
              `A Poisson random variable $X \\sim \\text{Poisson}(${lambda})$ is approximated by a normal distribution $N(\\mu, \\sigma^2)$. Find the standard deviation $\\sigma = \\sqrt{\\lambda}$.`,
              `泊松随机变量 $X \\sim \\text{Poisson}(${lambda})$ 用正态分布 $N(\\mu, \\sigma^2)$ 近似。求其标准差 $\\sigma = \\sqrt{\\lambda}$。`,
            ),
            answer: k,
            solution: t(
              `For a Poisson distribution, $\\mu = \\lambda = ${lambda}$ and $\\sigma^2 = \\lambda = ${lambda}$. Thus, the standard deviation is $\\sigma = \\sqrt{${lambda}} = ${k}$.`,
              `对于泊松分布，$\\mu = \\lambda = ${lambda}$ 且 $\\sigma^2 = \\lambda = ${lambda}$。因此标准差为 $\\sigma = \\sqrt{${lambda}} = ${k}$。`,
            ),
          });
        },
      },
      {
        id: "poisson-normal-continuity-z-score",
        title: t("Formulating the continuity-corrected z-score for Poisson", "构建泊松分布连续性校正的 z 值表达式"),
        explanation: t(
          "Add one half to the cutoff before standardizing, because the count at the cutoff occupies the interval reaching half a unit beyond it. To approximate P(X ≤ c) for Poisson(λ), the continuity correction gives z = (c + 0.5 - λ) / √λ.",
          "标准化之前先给分界值加上二分之一，因为分界值处的计数占据了延伸到其后半个单位的区间。为近似 Poisson(λ) 的 P(X ≤ c)，应用连续性校正得到标准化变量 z = (c + 0.5 - λ) / √λ。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(25, 100);
          const c = lambda + rng.int(2, 15);
          const diff = c - lambda;

          const correctStr = `\\frac{${diff}.5}{\\sqrt{${lambda}}}`;
          const alt1 = `\\frac{${diff - 1}.5}{\\sqrt{${lambda}}}`;
          const alt2 = `\\frac{${diff}}{\\sqrt{${lambda}}}`;
          const alt3 = `\\frac{${diff}.5}{${lambda}}`;

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
              `Let $X \\sim \\text{Poisson}(${lambda})$. Using the normal approximation with continuity correction, what is the standardized $z$-score used to evaluate $P(X \\le ${c})$?`,
              `设 $X \\sim \\text{Poisson}(${lambda})$。使用带有连续性校正的正态近似时，用于计算 $P(X \\le ${c})$ 的标准化 $z$ 分数表达式是什么？`,
            ),
            options,
            correct,
            solution: t(
              `With continuity correction, $P(X \\le ${c}) \\approx P(Y \\le ${c}.5)$ where $Y \\sim N(${lambda}, ${lambda})$. The standardized $z$-score is $z = \\frac{${c}.5 - ${lambda}}{\\sqrt{${lambda}}} = \\frac{${diff}.5}{\\sqrt{${lambda}}}$.`,
              `应用连续性校正后，$P(X \\le ${c}) \\approx P(Y \\le ${c}.5)$，其中 $Y \\sim N(${lambda}, ${lambda})$。标准化 $z$ 分数为 $z = \\frac{${c}.5 - ${lambda}}{\\sqrt{${lambda}}} = \\frac{${diff}.5}{\\sqrt{${lambda}}}$。`,
            ),
          });
        },
      },
    ],
  },

  // 4.14.1 The Continuous Uniform Distribution
  {
    id: "the-continuous-uniform-distribution",
    title: t("The Continuous Uniform Distribution", "连续均匀分布"),
    summary: t(
      "The continuous uniform distribution U(a, b) has constant PDF f(x) = 1/(b - a) on [a, b] and CDF F(x) = (x - a)/(b - a).",
      "连续均匀分布 U(a, b) 在区间 [a, b] 上具有恒定概率密度函数 f(x) = 1/(b - a)，其累积分布函数为 F(x) = (x - a)/(b - a)。",
    ),
    prerequisites: ["cumulative-distribution-functions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "continuous-uniform-pdf-value",
        title: t("Evaluating the density of a continuous uniform distribution", "计算连续均匀分布的概率密度值"),
        explanation: t(
          "A uniform density is constant over its interval, and its height is set so that the rectangle under it has area one. For X ~ U(a, b), the probability density function is f(x) = 1 / (b - a) for a ≤ x ≤ b and 0 elsewhere.",
          "均匀密度在其区间上是常数，它的高度使下方矩形的面积为 1。对于 X ~ U(a, b)，在 a ≤ x ≤ b 时概率密度函数为 f(x) = 1 / (b - a)，在其他区间为 0。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(0, 15);
          const width = rng.int(2, 20);
          const b = a + width;

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ is uniformly distributed over the interval $[${a}, ${b}]$, denoted $X \\sim U(${a}, ${b})$. What is the constant value of the probability density function $f(x)$ on this interval?`,
              `连续随机变量 $X$ 在区间 $[${a}, ${b}]$ 上服从均匀分布，记作 $X \\sim U(${a}, ${b})$。求该区间上概率密度函数 $f(x)$ 的恒定值。`,
            ),
            answer: Q.of(1, width),
            solution: t(
              `The density is $f(x) = \\frac{1}{b - a} = \\frac{1}{${b} - ${a}} = \\frac{1}{${width}}${lowestTerms(1, width)}$.`,
              `概率密度函数为 $f(x) = \\frac{1}{b - a} = \\frac{1}{${b} - ${a}} = \\frac{1}{${width}}${lowestTerms(1, width)}$。`,
            ),
          });
        },
      },
      {
        id: "continuous-uniform-interval-probability",
        title: t("Computing subinterval probabilities for uniform distributions", "计算均匀分布子区间上的概率"),
        explanation: t(
          "For a uniform variable, probability is proportional to length, so the chance of a subinterval is its length divided by the whole length. For X ~ U(a, b) and a ≤ c < d ≤ b, P(c ≤ X ≤ d) = (d - c) / (b - a).",
          "对于均匀变量，概率与长度成正比，所以子区间的概率等于它的长度除以整个区间的长度。对于 X ~ U(a, b) 且 a ≤ c < d ≤ b，概率为 P(c ≤ X ≤ d) = (d - c) / (b - a)。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(1, 10);
          const width = rng.int(5, 20);
          const b = a + width;
          const subWidth = rng.int(1, width - 1);
          const c = a + rng.int(0, width - subWidth);
          const d = c + subWidth;

          return numberProblem({
            prompt: t(
              `Let $X \\sim U(${a}, ${b})$. Find the probability $P(${c} \\le X \\le ${d})$.`,
              `设 $X \\sim U(${a}, ${b})$。求概率 $P(${c} \\le X \\le ${d})$。`,
            ),
            answer: Q.of(subWidth, width),
            solution: t(
              `$P(${c} \\le X \\le ${d}) = \\frac{d - c}{b - a} = \\frac{${d} - ${c}}{${b} - ${a}} = \\frac{${subWidth}}{${width}}${lowestTerms(subWidth, width)}$.`,
              `$P(${c} \\le X \\le ${d}) = \\frac{d - c}{b - a} = \\frac{${d} - ${c}}{${b} - ${a}} = \\frac{${subWidth}}{${width}}${lowestTerms(subWidth, width)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 4.14.2 Mean and Variance of the Continuous Uniform Distribution
  {
    id: "mean-and-variance-of-the-continuous-uniform-distribution",
    title: t("Mean and Variance of the Continuous Uniform Distribution", "连续均匀分布的均值与方差"),
    summary: t(
      "For $X \\sim U(a, b)$, the expected value is $E[X] = \\frac{a + b}{2}$ and the variance is $\\operatorname{Var}(X) = \\frac{(b - a)^2}{12}$.",
      "对于 $X \\sim U(a, b)$，其数学期望为 $E[X] = \\frac{a + b}{2}$，方差为 $\\operatorname{Var}(X) = \\frac{(b - a)^2}{12}$。",
    ),
    prerequisites: ["the-continuous-uniform-distribution", "variance-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "continuous-uniform-expectation",
        title: t("Expected value of a continuous uniform distribution", "连续均匀分布的期望值"),
        explanation: t(
          "A uniform density is symmetric about the center of its interval, so the mean is the midpoint of the two endpoints. For X ~ U(a, b), the expected value is the midpoint E[X] = (a + b) / 2.",
          "均匀密度关于区间中点对称，所以均值是两个端点的中点。对于 X ~ U(a, b)，期望值为区间中点 E[X] = (a + b) / 2。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(-20, 20);
          const width = rng.int(1, 30);
          const b = a + width;

          return numberProblem({
            prompt: t(
              `Find the expected value $E[X]$ of a continuous random variable $X \\sim U(${a}, ${b})$.`,
              `求连续型随机变量 $X \\sim U(${a}, ${b})$ 的数学期望 $E[X]$。`,
            ),
            answer: Q.of(a + b, 2),
            solution: t(
              `The mean of $U(a, b)$ is the midpoint $E[X] = \\frac{a + b}{2} = \\frac{${a} + ${paren(b)}}{2} = \\frac{${a + b}}{2}${lowestTerms(a + b, 2)}$.`,
              `$U(a, b)$ 的均值为区间中点 $E[X] = \\frac{a + b}{2} = \\frac{${a} + ${paren(b)}}{2} = \\frac{${a + b}}{2}${lowestTerms(a + b, 2)}$。`,
            ),
          });
        },
      },
      {
        id: "continuous-uniform-variance",
        title: t("Variance of a continuous uniform distribution", "连续均匀分布的方差"),
        explanation: t(
          "The variance depends only on the length of the interval, growing with the square of that length, and not on where the interval sits. For $X \\sim U(a, b)$, the variance is $\\operatorname{Var}(X) = \\frac{(b - a)^2}{12}$.",
          "方差只取决于区间的长度，随长度的平方增大，而与区间的位置无关。对于 $X \\sim U(a, b)$，方差为 $\\operatorname{Var}(X) = \\frac{(b - a)^2}{12}$。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(0, 15);
          const width = rng.int(2, 30);
          const b = a + width;
          const numerator = width * width;

          return numberProblem({
            prompt: t(
              `Find the variance $\\text{Var}(X)$ of a continuous random variable $X \\sim U(${a}, ${b})$.`,
              `求连续型随机变量 $X \\sim U(${a}, ${b})$ 的方差 $\\text{Var}(X)$。`,
            ),
            answer: Q.of(numerator, 12),
            solution: t(
              `The variance of a continuous uniform variable on $[a, b]$ is $\\text{Var}(X) = \\frac{(b - a)^2}{12} = \\frac{(${b} - ${a})^2}{12} = \\frac{${numerator}}{12}${lowestTerms(numerator, 12)}$.`,
              `区间 $[a, b]$ 上连续均匀变量的方差为 $\\text{Var}(X) = \\frac{(b - a)^2}{12} = \\frac{(${b} - ${a})^2}{12} = \\frac{${numerator}}{12}${lowestTerms(numerator, 12)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 4.14.3 Modeling With Continuous Uniform Distributions
  {
    id: "modeling-with-continuous-uniform-distributions",
    title: t("Modeling With Continuous Uniform Distributions", "应用连续均匀分布建模"),
    summary: t(
      "Continuous uniform distributions model random variables with equal likelihood across bounded intervals, such as waiting times and rounding errors.",
      "连续均匀分布用于对在有界区间内等可能发生的随机变量进行建模，例如等车时间与四舍五入舍入误差。",
    ),
    prerequisites: ["mean-and-variance-of-the-continuous-uniform-distribution"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "uniform-conditional-probability",
        title: t("Conditional probability in a uniform model", "均匀分布模型中的条件概率"),
        explanation: t(
          "Given that the value exceeds a point, it is uniform on the remaining part of the interval, so the conditional probability is again a ratio of lengths. For X ~ U(a, b) and a ≤ c < d ≤ b, P(X > d | X > c) = (b - d) / (b - c).",
          "在已知取值超过某点的条件下，它在区间剩下的部分上仍是均匀的，所以条件概率仍是长度之比。对于 X ~ U(a, b) 且 a ≤ c < d ≤ b，条件概率为 P(X > d | X > c) = (b - d) / (b - c)。",
        ),
        generate: (rng: Rng): Problem => {
          const maxWait = rng.int(15, 60); // [0, maxWait]
          const c = rng.int(5, maxWait - 8);
          const d = c + rng.int(2, maxWait - c - 1);
          const remainingTotal = maxWait - c;
          const remainingExceed = maxWait - d;

          return numberProblem({
            prompt: t(
              `A commuter bus arrives at a stop at a uniformly distributed random time between $0$ and $${maxWait}$ minutes. Given that a passenger has already waited for $${c}$ minutes without a bus arriving, what is the probability that they will have to wait for more than $${d}$ minutes in total?`,
              `某通勤公交车在 $0$ 到 $${maxWait}$ 分钟之间的某一随机时刻到达车站，服从均匀分布。已知一名乘客已经等待了 $${c}$ 分钟而公交车仍未到达，该乘客总等待时间超过 $${d}$ 分钟的条件概率是多少？`,
            ),
            answer: Q.of(remainingExceed, remainingTotal),
            solution: t(
              `Let $X \\sim U(0, ${maxWait})$. The conditional probability is $P(X > ${d} \\mid X > ${c}) = \\frac{P(X > ${d})}{P(X > ${c})} = \\frac{${maxWait} - ${d}}{${maxWait} - ${c}} = \\frac{${remainingExceed}}{${remainingTotal}}${lowestTerms(remainingExceed, remainingTotal)}$.`,
              `设 $X \\sim U(0, ${maxWait})$。所求条件概率为 $P(X > ${d} \\mid X > ${c}) = \\frac{P(X > ${d})}{P(X > ${c})} = \\frac{${maxWait} - ${d}}{${maxWait} - ${c}} = \\frac{${remainingExceed}}{${remainingTotal}}${lowestTerms(remainingExceed, remainingTotal)}$。`,
            ),
          });
        },
      },
      {
        id: "uniform-quantile-cutoff",
        title: t("Finding quantiles for continuous uniform distributions", "求解连续均匀分布的分位数阈值"),
        explanation: t(
          "A quantile of a uniform distribution lies the given fraction of the way from the left endpoint to the right endpoint. For $X \\sim U(a, b)$, the value $x_p$ satisfying $P(X \\le x_p) = p$ is $x_p = a + p(b - a)$.",
          "均匀分布的分位数位于从左端点到右端点的给定比例处。对于 $X \\sim U(a, b)$，满足 $P(X \\le x_p) = p$ 的值为 $x_p = a + p(b - a)$。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(5, 30);
          const step = rng.int(2, 10);
          const den = rng.pick([3, 4, 5, 8, 10]);
          const num = rng.int(1, den - 1);
          const width = step * den;
          const b = a + width;
          const cutoff = a + step * num;

          return numberProblem({
            prompt: t(
              `The running time of a software build is uniformly distributed between $${a}$ and $${b}$ seconds: $T \\sim U(${a}, ${b})$. Find the threshold time $t$ such that exactly $\\frac{${num}}{${den}}$ of all builds finish in at most $t$ seconds ($P(T \\le t) = \\frac{${num}}{${den}}$).`,
              `某软件构建所需时间在 $${a}$ 到 $${b}$ 秒之间服从均匀分布：$T \\sim U(${a}, ${b})$。求时间阈值 $t$，使得恰好有 $\\frac{${num}}{${den}}$ 的构建在至多 $t$ 秒内完成（即 $P(T \\le t) = \\frac{${num}}{${den}}$）。`,
            ),
            answer: cutoff,
            solution: t(
              `Using the CDF $F(t) = \\frac{t - a}{b - a}$: $\\frac{t - ${a}}{${width}} = \\frac{${num}}{${den}} \\implies t = ${a} + \\frac{${num}}{${den}} (${width}) = ${a} + ${step * num} = ${cutoff}$.`,
              `利用累积分布函数 $F(t) = \\frac{t - a}{b - a}$：$\\frac{t - ${a}}{${width}} = \\frac{${num}}{${den}} \\implies t = ${a} + \\frac{${num}}{${den}} (${width}) = ${a} + ${step * num} = ${cutoff}$。`,
            ),
          });
        },
      },
    ],
  },

  // 4.15.1 The Exponential Distribution
  {
    id: "the-exponential-distribution",
    title: t("The Exponential Distribution", "指数分布"),
    summary: t(
      "The exponential distribution $\\text{Exp}(\\lambda)$ models the time between Poisson events, with PDF $f(x) = \\lambda e^{-\\lambda x}$ and CDF $F(x) = 1 - e^{-\\lambda x}$ for $x \\ge 0$.",
      "指数分布 $\\text{Exp}(\\lambda)$ 刻画泊松过程中相邻事件的时间间隔；当 $x \\ge 0$ 时，其概率密度函数为 $f(x) = \\lambda e^{-\\lambda x}$，累积分布函数为 $F(x) = 1 - e^{-\\lambda x}$。",
    ),
    prerequisites: ["cumulative-distribution-functions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "exponential-cdf-evaluation",
        title: t("Evaluating survival and cumulative probabilities of exponential distribution", "计算指数分布的生存概率与累积概率"),
        explanation: t(
          "The chance of waiting longer than a given time decays exponentially, and the cumulative probability is one minus that survival probability. For $X \\sim \\text{Exp}(\\lambda)$, the survival probability is $P(X > x) = e^{-\\lambda x}$ and the CDF is $P(X \\le x) = 1 - e^{-\\lambda x}$.",
          "等待时间超过给定值的概率按指数衰减，累积概率等于 1 减去这个生存概率。对于 $X \\sim \\text{Exp}(\\lambda)$，其生存概率为 $P(X > x) = e^{-\\lambda x}$，累积分布函数为 $P(X \\le x) = 1 - e^{-\\lambda x}$。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 10);
          const x = rng.int(2, 6);
          const exponent = lambda * x;

          const opts = [
            t(`$e^{-${exponent}}$`, `$e^{-${exponent}}$`),
            t(`$1 - e^{-${exponent}}$`, `$1 - e^{-${exponent}}$`),
            t(`$${lambda} e^{-${exponent}}$`, `$${lambda} e^{-${exponent}}$`),
            t(`$e^{-${lambda}}$`, `$e^{-${lambda}}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Let $X \\sim \\text{Exp}(${lambda})$ with rate parameter $\\lambda = ${lambda}$ and PDF $f(x) = ${lambda} e^{-${lambda} x}$ for $x \\ge 0$. What is the survival probability $P(X > ${x})$?`,
              `设 $X \\sim \\text{Exp}(${lambda})$，其比率参数为 $\\lambda = ${lambda}$，当 $x \\ge 0$ 时概率密度为 $f(x) = ${lambda} e^{-${lambda} x}$。求生存概率 $P(X > ${x})$ 的表达式。`,
            ),
            options,
            correct,
            solution: t(
              `The survival function of an exponential random variable is $P(X > x) = \\int_{x}^{\\infty} \\lambda e^{-\\lambda u} du = e^{-\\lambda x}$. Substituting $\\lambda = ${lambda}$ and $x = ${x}$ yields $e^{-(${lambda})(${x})} = e^{-${exponent}}$.`,
              `指数随机变量的生存函数为 $P(X > x) = \\int_{x}^{\\infty} \\lambda e^{-\\lambda u} du = e^{-\\lambda x}$。代入 $\\lambda = ${lambda}$ 与 $x = ${x}$ 得 $e^{-(${lambda})(${x})} = e^{-${exponent}}$。`,
            ),
          });
        },
      },
      {
        id: "exponential-memoryless-property",
        title: t("Understanding the memoryless property of exponential variables", "理解指数变量的无记忆性"),
        explanation: t(
          "Having already waited some time does not change the distribution of the remaining wait, which makes the exponential the model for events that do not wear out. The exponential distribution satisfies the memoryless property: P(X > s + t | X > s) = P(X > t).",
          "已经等待了一段时间并不改变剩余等待时间的分布，这使指数分布成为不会老化的事件的模型。指数分布满足无记忆性：P(X > s + t | X > s) = P(X > t)。",
        ),
        generate: (rng: Rng): Problem => {
          const s = rng.int(5, 40);
          const tVal = s + rng.int(1, 15);
          const sumVal = s + tVal;

          const opts = [
            t(`$P(X > ${tVal})$`, `$P(X > ${tVal})$`),
            t(`$P(X > ${sumVal})$`, `$P(X > ${sumVal})$`),
            t(`$P(X > ${s})$`, `$P(X > ${s})$`),
            t(`$1 - P(X > ${tVal})$`, `$1 - P(X > ${tVal})$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Let $X$ be an exponentially distributed random variable modeling the lifespan of a component. By the memoryless property, to which probability is the conditional probability $P(X > ${sumVal} \\mid X > ${s})$ strictly equal?`,
              `设 $X$ 为对元件寿命建模的指数随机变量。由无记忆性，条件概率 $P(X > ${sumVal} \\mid X > ${s})$ 严格等于下列哪一项？`,
            ),
            options,
            correct,
            solution: t(
              `By the memoryless property of the exponential distribution, $P(X > s + t \\mid X > s) = P(X > t)$. Here $s = ${s}$ and $t = ${tVal}$, so $P(X > ${sumVal} \\mid X > ${s}) = P(X > ${tVal})$.`,
              `由指数分布的无记忆性，$P(X > s + t \\mid X > s) = P(X > t)$。此处 $s = ${s}$ 且 $t = ${tVal}$，因此 $P(X > ${sumVal} \\mid X > ${s}) = P(X > ${tVal})$。`,
            ),
          });
        },
      },
    ],
  },

  // 4.15.2 Modeling With the Exponential Distribution
  {
    id: "modeling-with-the-exponential-distribution",
    title: t("Modeling With the Exponential Distribution", "应用指数分布建模"),
    summary: t(
      "The exponential distribution models lifespans, waiting times, and service times under the assumption of a constant hazard rate.",
      "在恒定风险率假定下，指数分布广泛用于对电子元件寿命、排队等待时间和服务时间建模。",
    ),
    prerequisites: ["the-exponential-distribution"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "exponential-rate-from-mean",
        title: t("Determining the rate parameter from expected duration", "根据平均持续时间确定比率参数"),
        explanation: t(
          "The rate counts how many events happen per unit of time on average, so it is the reciprocal of the average time between events. If the average time between events is μ, the rate parameter is λ = 1 / μ.",
          "速率表示单位时间内平均发生多少次事件，所以它是两次事件之间平均时间的倒数。若事件发生的平均间隔时间为 μ，则比率参数为 λ = 1 / μ。",
        ),
        generate: (rng: Rng): Problem => {
          const mean = rng.int(2, 50);

          return numberProblem({
            prompt: t(
              `A call center receives incoming calls modeled by an exponential interarrival time with an average of $${mean}$ minutes between calls. Find the rate parameter $\\lambda$ (in calls per minute).`,
              `某呼叫中心接收来电的到达间隔时间服从指数分布，平均每次来电间隔为 $${mean}$ 分钟。求其比率参数 $\\lambda$（单位：次/分钟）。`,
            ),
            answer: Q.of(1, mean),
            solution: t(
              `The mean of an exponential distribution is $E[X] = \\frac{1}{\\lambda}$. Therefore, $\\lambda = \\frac{1}{E[X]} = \\frac{1}{${mean}}${lowestTerms(1, mean)}$.`,
              `指数分布的数学期望为 $E[X] = \\frac{1}{\\lambda}$。因此，$\\lambda = \\frac{1}{E[X]} = \\frac{1}{${mean}}${lowestTerms(1, mean)}$。`,
            ),
          });
        },
      },
      {
        id: "exponential-median-formula",
        title: t("Identifying the median of an exponential distribution", "确定指数分布的中位数表达式"),
        explanation: t(
          "Setting the cumulative probability equal to one half and taking logarithms shows that the median is shorter than the mean. For $X \\sim \\text{Exp}(\\lambda)$, the median $m$ satisfies $1 - e^{-\\lambda m} = 0.5$, so $m = \\frac{\\ln 2}{\\lambda}$.",
          "令累积概率等于二分之一并取对数，可以看出中位数比均值短。对于 $X \\sim \\text{Exp}(\\lambda)$，中位数 $m$ 满足 $1 - e^{-\\lambda m} = 0.5$，因此 $m = \\frac{\\ln 2}{\\lambda}$。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(3, 30);

          const opts = [
            t(`$\\frac{\\ln 2}{${lambda}}$`, `$\\frac{\\ln 2}{${lambda}}$`),
            t(`$\\frac{1}{${2 * lambda}}$`, `$\\frac{1}{${2 * lambda}}$`),
            t(`$\\frac{1}{${lambda}}$`, `$\\frac{1}{${lambda}}$`),
            t(`$\\frac{\\ln 2}{${lambda + 1}}$`, `$\\frac{\\ln 2}{${lambda + 1}}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `For an exponentially distributed random variable $X \\sim \\text{Exp}(${lambda})$, what is the exact expression for the median $m$ (such that $P(X \\le m) = 0.5$)?`,
              `对于服从指数分布的随机变量 $X \\sim \\text{Exp}(${lambda})$，其中位数 $m$（满足 $P(X \\le m) = 0.5$）的精确表达式是什么？`,
            ),
            options,
            correct,
            solution: t(
              `The median satisfies $F(m) = 1 - e^{-\\lambda m} = \\frac{1}{2} \\implies e^{-\\lambda m} = \\frac{1}{2} \\implies -\\lambda m = -\\ln 2 \\implies m = \\frac{\\ln 2}{\\lambda} = \\frac{\\ln 2}{${lambda}}$.`,
              `中位数满足 $F(m) = 1 - e^{-\\lambda m} = \\frac{1}{2} \\implies e^{-\\lambda m} = \\frac{1}{2} \\implies -\\lambda m = -\\ln 2 \\implies m = \\frac{\\ln 2}{\\lambda} = \\frac{\\ln 2}{${lambda}}$。`,
            ),
          });
        },
      },
    ],
  },

  // 4.15.3 Mean and Variance of the Exponential Distribution
  {
    id: "mean-and-variance-of-the-exponential-distribution",
    title: t("Mean and Variance of the Exponential Distribution", "指数分布的均值与方差"),
    summary: t(
      "For $X \\sim \\text{Exp}(\\lambda)$, the expected value is $E[X] = \\frac{1}{\\lambda}$ and the variance is $\\operatorname{Var}(X) = \\frac{1}{\\lambda^2}$.",
      "对于 $X \\sim \\text{Exp}(\\lambda)$，其期望为 $E[X] = \\frac{1}{\\lambda}$，方差为 $\\operatorname{Var}(X) = \\frac{1}{\\lambda^2}$。",
    ),
    prerequisites: ["modeling-with-the-exponential-distribution", "variance-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "exponential-mean-and-sd-equality",
        title: t("Standard deviation of an exponential random variable", "指数随机变量的标准差"),
        explanation: t(
          "For an exponential distribution the spread is as large as the mean itself, so the standard deviation equals the mean. For $X \\sim \\text{Exp}(\\lambda)$, $\\operatorname{Var}(X) = \\frac{1}{\\lambda^2}$, so the standard deviation is $\\operatorname{SD}(X) = \\frac{1}{\\lambda}$, equal to the mean.",
          "对于指数分布，分散程度与均值本身一样大，所以标准差等于均值。对于 $X \\sim \\text{Exp}(\\lambda)$，方差为 $\\operatorname{Var}(X) = \\frac{1}{\\lambda^2}$，因此标准差为 $\\operatorname{SD}(X) = \\frac{1}{\\lambda}$，恰好等于其期望值。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 40);

          return numberProblem({
            prompt: t(
              `Let $X \\sim \\text{Exp}(${lambda})$. Find the standard deviation $\\text{SD}(X) = \\sqrt{\\text{Var}(X)}$.`,
              `设 $X \\sim \\text{Exp}(${lambda})$。求其标准差 $\\text{SD}(X) = \\sqrt{\\text{Var}(X)}$。`,
            ),
            answer: Q.of(1, lambda),
            solution: t(
              `For an exponential random variable with rate $\\lambda = ${lambda}$, the variance is $\\text{Var}(X) = \\frac{1}{\\lambda^2} = \\frac{1}{${lambda * lambda}}$. Taking the square root gives $\\text{SD}(X) = \\frac{1}{\\lambda} = \\frac{1}{${lambda}}${lowestTerms(1, lambda)}$.`,
              `对于比率为 $\\lambda = ${lambda}$ 的指数随机变量，方差为 $\\text{Var}(X) = \\frac{1}{\\lambda^2} = \\frac{1}{${lambda * lambda}}$。开平方得标准差 $\\text{SD}(X) = \\frac{1}{\\lambda} = \\frac{1}{${lambda}}${lowestTerms(1, lambda)}$。`,
            ),
          });
        },
      },
      {
        id: "exponential-second-moment",
        title: t("Calculating the second raw moment of an exponential distribution", "计算指数分布的二阶原点矩"),
        explanation: t(
          "Adding the square of the mean to the variance gives the second moment, which for an exponential is twice the square of the mean. For $X \\sim \\text{Exp}(\\lambda)$, $E[X^2] = \\operatorname{Var}(X) + (E[X])^2 = \\frac{1}{\\lambda^2} + \\frac{1}{\\lambda^2} = \\frac{2}{\\lambda^2}$.",
          "把均值的平方加到方差上得到二阶矩，对指数分布来说它是均值平方的两倍。对于 $X \\sim \\text{Exp}(\\lambda)$，$E[X^2] = \\operatorname{Var}(X) + (E[X])^2 = \\frac{1}{\\lambda^2} + \\frac{1}{\\lambda^2} = \\frac{2}{\\lambda^2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(1, 50);
          const den = lambda * lambda;

          return numberProblem({
            prompt: t(
              `For $X \\sim \\text{Exp}(${lambda})$, evaluate the second moment $E[X^2]$.`,
              `对于 $X \\sim \\text{Exp}(${lambda})$，计算二阶原点矩 $E[X^2]$。`,
            ),
            answer: Q.of(2, den),
            solution: t(
              `$E[X^2] = \\text{Var}(X) + (E[X])^2 = \\frac{1}{\\lambda^2} + \\frac{1}{\\lambda^2} = \\frac{2}{\\lambda^2} = \\frac{2}{${lambda}^2} = \\frac{2}{${den}}${lowestTerms(2, den)}$.`,
              `$E[X^2] = \\text{Var}(X) + (E[X])^2 = \\frac{1}{\\lambda^2} + \\frac{1}{\\lambda^2} = \\frac{2}{\\lambda^2} = \\frac{2}{${lambda}^2} = \\frac{2}{${den}}${lowestTerms(2, den)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 4.16.1 The Gamma Function
  {
    id: "the-gamma-function",
    title: t("The Gamma Function", "伽马函数"),
    summary: t(
      "The gamma function extends the factorial: $\\Gamma(\\alpha) = \\int_0^{\\infty} x^{\\alpha - 1} e^{-x}\\,dx$, with $\\Gamma(\\alpha + 1) = \\alpha\\Gamma(\\alpha)$ and $\\Gamma(n) = (n - 1)!$ for positive integers $n$.",
      "伽马函数是阶乘的推广：$\\Gamma(\\alpha) = \\int_0^{\\infty} x^{\\alpha - 1} e^{-x}\\,dx$，满足 $\\Gamma(\\alpha + 1) = \\alpha\\Gamma(\\alpha)$，且对正整数 $n$ 有 $\\Gamma(n) = (n - 1)!$。",
    ),
    prerequisites: ["improper-integrals-involving-exponential-functions"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "gamma-function-integer-values",
        title: t("Evaluating Gamma function ratios for positive integers", "计算正整数伽马函数的比值"),
        explanation: t(
          "The gamma function extends the factorial, shifted by one, so ratios of its values at integers become ratios of factorials that mostly cancel. For positive integers, Γ(n) = (n - 1)!, so Γ(n) / Γ(m) = (n - 1)! / (m - 1)!.",
          "伽马函数推广了阶乘（相差一位），所以它在整数处的值之比就是阶乘之比，大部分可以约去。对正整数，Γ(n) = (n - 1)!，因此 Γ(n) / Γ(m) = (n - 1)! / (m - 1)!。",
        ),
        generate: (rng: Rng): Problem => {
          const m = rng.int(2, 25);
          const diff = rng.int(1, 3);
          const n = m + diff;
          let prod = 1;
          for (let k = m; k < n; k++) {
            prod *= k;
          }

          return numberProblem({
            prompt: t(`Evaluate the ratio $\\frac{\\Gamma(${n})}{\\Gamma(${m})}$.`, `计算比值 $\\frac{\\Gamma(${n})}{\\Gamma(${m})}$。`),
            answer: prod,
            solution: t(
              `Since $\\Gamma(n) = (n - 1)!$, we have $\\frac{\\Gamma(${n})}{\\Gamma(${m})} = \\frac{${n - 1}!}{${m - 1}!} = ${prod}$.`,
              `因为 $\\Gamma(n) = (n - 1)!$，所以 $\\frac{\\Gamma(${n})}{\\Gamma(${m})} = \\frac{${n - 1}!}{${m - 1}!} = ${prod}$。`,
            ),
          });
        },
      },
      {
        id: "gamma-function-half-integer",
        title: t("Applying recurrence for half-integer Gamma values", "应用递推公式计算半整数伽马函数比值"),
        explanation: t(
          "The recurrence lowers the argument one step at a time, so a ratio of values at half integers becomes a product of a few half integer factors. Using $\\Gamma(\\alpha + 1) = \\alpha \\Gamma(\\alpha)$, $\\frac{\\Gamma(a + \\frac{1}{2})}{\\Gamma(b + \\frac{1}{2})} = \\prod_{k=b}^{a-1} \\left(k + \\frac{1}{2}\\right)$.",
          "递推关系一次把自变量降低 1，所以在半整数处的值之比就变成几个半整数因子的乘积。利用 $\\Gamma(\\alpha + 1) = \\alpha \\Gamma(\\alpha)$，可得 $\\frac{\\Gamma(a + \\frac{1}{2})}{\\Gamma(b + \\frac{1}{2})} = \\prod_{k=b}^{a-1} \\left(k + \\frac{1}{2}\\right)$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(1, 20);
          const diff = rng.int(1, 3);
          const a = b + diff;
          let num = 1;
          let den = 1;
          for (let i = 0; i < diff; i++) {
            num *= 2 * (b + i) + 1;
            den *= 2;
          }
          const numA = 2 * a + 1;
          const numB = 2 * b + 1;

          return numberProblem({
            prompt: t(
              `Using the recurrence $\\Gamma(\\alpha + 1) = \\alpha \\Gamma(\\alpha)$, evaluate the ratio $\\frac{\\Gamma\\left(\\frac{${numA}}{2}\\right)}{\\Gamma\\left(\\frac{${numB}}{2}\\right)}$.`,
              `利用递推公式 $\\Gamma(\\alpha + 1) = \\alpha \\Gamma(\\alpha)$，计算比值 $\\frac{\\Gamma\\left(\\frac{${numA}}{2}\\right)}{\\Gamma\\left(\\frac{${numB}}{2}\\right)}$。`,
            ),
            answer: Q.of(num, den),
            solution: t(
              `Repeatedly applying $\\Gamma(\\alpha + 1) = \\alpha \\Gamma(\\alpha)$ gives $\\frac{\\Gamma\\left(\\frac{${numA}}{2}\\right)}{\\Gamma\\left(\\frac{${numB}}{2}\\right)} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `反复应用 $\\Gamma(\\alpha + 1) = \\alpha \\Gamma(\\alpha)$ 得 $\\frac{\\Gamma\\left(\\frac{${numA}}{2}\\right)}{\\Gamma\\left(\\frac{${numB}}{2}\\right)} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 4.16.2 The Gamma Distribution
  {
    id: "the-gamma-distribution",
    title: t("The Gamma Distribution", "伽马分布"),
    summary: t(
      "The gamma distribution $\\text{Gamma}(\\alpha, \\beta)$ generalizes the exponential distribution, with PDF $f(x) = \\frac{\\beta^\\alpha}{\\Gamma(\\alpha)} x^{\\alpha - 1} e^{-\\beta x}$, mean $\\frac{\\alpha}{\\beta}$ and variance $\\frac{\\alpha}{\\beta^2}$.",
      "伽马分布 $\\text{Gamma}(\\alpha, \\beta)$ 推广了指数分布，其概率密度函数为 $f(x) = \\frac{\\beta^\\alpha}{\\Gamma(\\alpha)} x^{\\alpha - 1} e^{-\\beta x}$，均值为 $\\frac{\\alpha}{\\beta}$，方差为 $\\frac{\\alpha}{\\beta^2}$。",
    ),
    prerequisites: ["the-gamma-function", "the-exponential-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "gamma-distribution-mean-variance",
        title: t("Computing the mean and variance of a Gamma distribution", "计算伽马分布的期望与方差"),
        explanation: t(
          "A gamma variable with whole number shape is a sum of independent exponential waits, which explains why its mean and variance grow with the shape. For $X \\sim \\text{Gamma}(\\alpha, \\beta)$ with shape $\\alpha$ and rate $\\beta$, $E[X] = \\frac{\\alpha}{\\beta}$ and $\\operatorname{Var}(X) = \\frac{\\alpha}{\\beta^2}$.",
          "形状参数为整数的伽马变量是若干个独立指数等待之和，这解释了为什么它的均值和方差随形状参数增大。对于形状参数为 $\\alpha$、比率参数为 $\\beta$ 的伽马分布 $X \\sim \\text{Gamma}(\\alpha, \\beta)$，其均值为 $E[X] = \\frac{\\alpha}{\\beta}$，方差为 $\\operatorname{Var}(X) = \\frac{\\alpha}{\\beta^2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const alpha = rng.int(2, 12);
          const beta = rng.int(2, 8);
          const varDen = beta * beta;

          return numberProblem({
            prompt: t(
              `A random variable $X \\sim \\text{Gamma}(\\alpha = ${alpha}, \\beta = ${beta})$ has shape parameter $\\alpha = ${alpha}$ and rate parameter $\\beta = ${beta}$. Find its variance $\\text{Var}(X) = \\frac{\\alpha}{\\beta^2}$.`,
              `随机变量 $X \\sim \\text{Gamma}(\\alpha = ${alpha}, \\beta = ${beta})$ 的形状参数为 $\\alpha = ${alpha}$，比率参数为 $\\beta = ${beta}$。求其方差 $\\text{Var}(X) = \\frac{\\alpha}{\\beta^2}$。`,
            ),
            answer: Q.of(alpha, varDen),
            solution: t(
              `The variance of $\\text{Gamma}(\\alpha, \\beta)$ is $\\text{Var}(X) = \\frac{\\alpha}{\\beta^2} = \\frac{${alpha}}{${beta}^2} = \\frac{${alpha}}{${varDen}}${lowestTerms(alpha, varDen)}$.`,
              `$\\text{Gamma}(\\alpha, \\beta)$ 的方差为 $\\text{Var}(X) = \\frac{\\alpha}{\\beta^2} = \\frac{${alpha}}{${beta}^2} = \\frac{${alpha}}{${varDen}}${lowestTerms(alpha, varDen)}$。`,
            ),
          });
        },
      },
      {
        id: "gamma-sum-of-exponentials",
        title: t("Gamma distribution as a sum of independent exponentials", "伽马分布作为独立指数变量之和"),
        explanation: t(
          "Waiting for several events of a Poisson process means adding the independent exponential gaps between them, which gives a gamma distribution. The sum of n independent and identically distributed Exp(λ) variables follows Gamma(n, λ).",
          "等待泊松过程中的若干个事件，就是把它们之间独立的指数间隔加起来，结果服从伽马分布。n 个独立同分布的 Exp(λ) 随机变量之和服从伽马分布 Gamma(n, λ)。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(2, 15);
          let lambda = rng.int(2, 10);
          if (lambda === n) lambda++;

          const opts = [
            t(`$\\text{Gamma}(${n}, ${lambda})$`, `$\\text{Gamma}(${n}, ${lambda})$`),
            t(`$\\text{Gamma}(${lambda}, ${n})$`, `$\\text{Gamma}(${lambda}, ${n})$`),
            t(`$\\text{Exp}(${n * lambda})$`, `$\\text{Exp}(${n * lambda})$`),
            t(`$N(${n * lambda}, ${n})$`, `$N(${n * lambda}, ${n})$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Let $X_1, X_2, \\dots, X_{${n}}$ be independent and identically distributed random variables, each with distribution $\\text{Exp}(${lambda})$. What is the exact distribution of their sum $S = \\sum_{i=1}^{${n}} X_i$?`,
              `设 $X_1, X_2, \\dots, X_{${n}}$ 为独立同分布的随机变量，各自服从指数分布 $\\text{Exp}(${lambda})$。其和 $S = \\sum_{i=1}^{${n}} X_i$ 的精确分布是什么？`,
            ),
            options,
            correct,
            solution: t(
              `The sum of $n$ i.i.d. exponential random variables with rate $\\lambda$ follows an Erlang (Gamma) distribution with shape parameter $n$ and rate parameter $\\lambda$: $S \\sim \\text{Gamma}(${n}, ${lambda})$.`,
              `$n$ 个比率为 $\\lambda$ 的独立同分布指数随机变量之和服从形状参数为 $n$、比率参数为 $\\lambda$ 的爱尔朗（伽马）分布：$S \\sim \\text{Gamma}(${n}, ${lambda})$。`,
            ),
          });
        },
      },
    ],
  },

  // 4.16.3 The Chi-Square Distribution
  {
    id: "the-chi-square-distribution",
    title: t("The Chi-Square Distribution", "卡方分布"),
    summary: t(
      "The chi-square distribution $\\chi^2(k)$ is the distribution of the sum of squares of $k$ independent standard normal variables, with $E[X] = k$ and $\\operatorname{Var}(X) = 2k$.",
      "卡方分布 $\\chi^2(k)$ 是 $k$ 个独立标准正态随机变量的平方和的分布，期望 $E[X] = k$，方差 $\\operatorname{Var}(X) = 2k$。",
    ),
    prerequisites: ["the-gamma-distribution", "the-standard-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "chi-square-sum-of-normals",
        title: t("Definition of Chi-square as sum of squared standard normals", "卡方分布作为标准正态变量平方和的定义"),
        explanation: t(
          "Adding the squares of independent standard normal variables gives a chi square variable, whose degrees of freedom count the squares added. If $Z_1, \\dots, Z_k$ are independent $N(0, 1)$ variables, then $\\sum_{i=1}^k Z_i^2 \\sim \\chi^2(k)$.",
          "把独立标准正态变量的平方相加，得到卡方变量，它的自由度就是相加的平方的个数。若 $Z_1, \\dots, Z_k$ 相互独立且服从 $N(0, 1)$，则 $\\sum_{i=1}^k Z_i^2 \\sim \\chi^2(k)$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 30);

          const opts = [
            t(`$\\chi^2(${k})$`, `$\\chi^2(${k})$`),
            t(`$N(0, ${k})$`, `$N(0, ${k})$`),
            t(`$t(${k})$`, `$t(${k})$`),
            t(`$\\chi^2(${2 * k})$`, `$\\chi^2(${2 * k})$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Let $Z_1, Z_2, \\dots, Z_{${k}}$ be independent standard normal random variables, $Z_i \\sim N(0, 1)$. What is the distribution of $W = \\sum_{i=1}^{${k}} Z_i^2$?`,
              `设 $Z_1, Z_2, \\dots, Z_{${k}}$ 为相互独立且均服从标准正态分布 $Z_i \\sim N(0, 1)$ 的随机变量。变量 $W = \\sum_{i=1}^{${k}} Z_i^2$ 服从什么分布？`,
            ),
            options,
            correct,
            solution: t(
              `By definition, the sum of squares of $k$ independent standard normal random variables follows a Chi-square distribution with $k$ degrees of freedom: $W \\sim \\chi^2(${k})$.`,
              `根据定义，$k$ 个相互独立的标准正态随机变量的平方和服从自由度为 $k$ 的卡方分布：$W \\sim \\chi^2(${k})$。`,
            ),
          });
        },
      },
      {
        id: "chi-square-mean-and-variance",
        title: t("Moments of a Chi-square distribution", "卡方分布的数字特征"),
        explanation: t(
          "Each squared standard normal has mean one and variance two, so a sum of them has mean and variance proportional to the degrees of freedom. For $X \\sim \\chi^2(k)$, $E[X] = k$ and $\\operatorname{Var}(X) = 2k$.",
          "每个标准正态变量的平方均值为 1、方差为 2，所以它们的和的均值和方差都与自由度成正比。对于 $X \\sim \\chi^2(k)$，期望为 $E[X] = k$，方差为 $\\operatorname{Var}(X) = 2k$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(3, 50);

          return numberProblem({
            prompt: t(
              `A random variable follows a Chi-square distribution with $k = ${k}$ degrees of freedom: $X \\sim \\chi^2(${k})$. Find the variance $\\text{Var}(X)$.`,
              `随机变量服从自由度为 $k = ${k}$ 的卡方分布：$X \\sim \\chi^2(${k})$。求其方差 $\\text{Var}(X)$。`,
            ),
            answer: 2 * k,
            solution: t(
              `For a Chi-square distribution with $k$ degrees of freedom, the mean is $E[X] = k = ${k}$ and the variance is $\\text{Var}(X) = 2k = 2(${k}) = ${2 * k}$.`,
              `对于自由度为 $k$ 的卡方分布，均值为 $E[X] = k = ${k}$，方差为 $\\text{Var}(X) = 2k = 2(${k}) = ${2 * k}$。`,
            ),
          });
        },
      },
    ],
  },

  // 4.16.4 The Student's T-Distribution
  {
    id: "the-students-t-distribution",
    title: t("The Student's T-Distribution", "学生 t 分布"),
    summary: t(
      "Student's $t$-distribution with $\\nu$ degrees of freedom is the distribution of $T = \\frac{Z}{\\sqrt{V/\\nu}}$, where $Z \\sim N(0, 1)$ and $V \\sim \\chi^2(\\nu)$ are independent. It has heavier tails than $N(0, 1)$ and approaches $N(0, 1)$ as $\\nu \\to \\infty$.",
      "自由度为 $\\nu$ 的学生 $t$ 分布是 $T = \\frac{Z}{\\sqrt{V/\\nu}}$ 的分布，其中 $Z \\sim N(0, 1)$ 与 $V \\sim \\chi^2(\\nu)$ 相互独立。它的尾部比 $N(0, 1)$ 更厚，当 $\\nu \\to \\infty$ 时趋于 $N(0, 1)$。",
    ),
    prerequisites: ["the-chi-square-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "t-distribution-ratio-definition",
        title: t("Formulation of the Student's t ratio", "学生 t 分布的比值构造形式"),
        explanation: t(
          "The t distribution arises when a standard normal is divided by an estimate of its scale built from an independent chi square variable. $T = \\frac{Z}{\\sqrt{V / \\nu}}$, where $Z \\sim N(0, 1)$ and $V \\sim \\chi^2(\\nu)$ are independent.",
          "当一个标准正态变量除以由独立的卡方变量构造的尺度估计时，就得到 t 分布。$T = \\frac{Z}{\\sqrt{V / \\nu}}$，其中 $Z \\sim N(0, 1)$ 与 $V \\sim \\chi^2(\\nu)$ 相互独立。",
        ),
        generate: (rng: Rng): Problem => {
          const nu = rng.int(2, 35);

          const opts = [
            t(`$t(${nu})$`, `$t(${nu})$`),
            t(`$N(0, ${nu})$`, `$N(0, ${nu})$`),
            t(`$F(1, ${nu})$`, `$F(1, ${nu})$`),
            t(`$\\chi^2(${nu})$`, `$\\chi^2(${nu})$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Let $Z \\sim N(0, 1)$ and $V \\sim \\chi^2(${nu})$ be independent random variables. What is the distribution of the ratio $T = \\frac{Z}{\\sqrt{V / ${nu}}}$?`,
              `设 $Z \\sim N(0, 1)$ 与 $V \\sim \\chi^2(${nu})$ 为相互独立的随机变量。比值 $T = \\frac{Z}{\\sqrt{V / ${nu}}}$ 服从什么分布？`,
            ),
            options,
            correct,
            solution: t(
              `By definition, the ratio of a standard normal variable to the square root of an independent Chi-square variable divided by its degrees of freedom follows Student's $t$-distribution with $\\nu = ${nu}$ degrees of freedom: $T \\sim t(${nu})$.`,
              `根据定义，标准正态变量除以一个独立的卡方变量除以其自由度的算术平方根，服从自由度为 $\\nu = ${nu}$ 的学生 $t$ 分布：$T \\sim t(${nu})$。`,
            ),
          });
        },
      },
      {
        id: "t-distribution-variance",
        title: t("Variance of the Student's t-distribution", "学生 t 分布的方差"),
        explanation: t(
          "The t distribution has heavier tails than the normal, so its variance is greater than one, approaching one as the degrees of freedom grow. For $T \\sim t(\\nu)$ with $\\nu > 2$, $\\operatorname{Var}(T) = \\frac{\\nu}{\\nu - 2}$.",
          "t 分布的尾部比正态分布更厚，所以它的方差大于 1，并随着自由度增大而趋于 1。对于自由度 $\\nu > 2$ 的 $T \\sim t(\\nu)$，方差为 $\\operatorname{Var}(T) = \\frac{\\nu}{\\nu - 2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const nu = rng.int(3, 40);

          return numberProblem({
            prompt: t(
              `Find the variance $\\text{Var}(T)$ of a random variable $T$ following Student's $t$-distribution with $\\nu = ${nu}$ degrees of freedom.`,
              `求服从自由度为 $\\nu = ${nu}$ 的学生 $t$ 分布的随机变量 $T$ 的方差 $\\text{Var}(T)$。`,
            ),
            answer: Q.of(nu, nu - 2),
            solution: t(
              `For a $t$-distribution with $\\nu > 2$ degrees of freedom, the variance is $\\text{Var}(T) = \\frac{\\nu}{\\nu - 2} = \\frac{${nu}}{${nu} - 2} = \\frac{${nu}}{${nu - 2}}${lowestTerms(nu, nu - 2)}$.`,
              `对于自由度 $\\nu > 2$ 的 $t$ 分布，方差为 $\\text{Var}(T) = \\frac{\\nu}{\\nu - 2} = \\frac{${nu}}{${nu} - 2} = \\frac{${nu}}{${nu - 2}}${lowestTerms(nu, nu - 2)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 4.16.5 The F-Distribution
  {
    id: "the-f-distribution",
    title: t("The F-Distribution", "F 分布"),
    summary: t(
      "The $F$-distribution $F(d_1, d_2)$ is the distribution of the ratio of two independent scaled chi-square variables: $F = \\frac{U/d_1}{V/d_2}$, where $U \\sim \\chi^2(d_1)$ and $V \\sim \\chi^2(d_2)$.",
      "$F$ 分布 $F(d_1, d_2)$ 是两个相互独立、各除以自由度的卡方变量之比的分布：$F = \\frac{U/d_1}{V/d_2}$，其中 $U \\sim \\chi^2(d_1)$，$V \\sim \\chi^2(d_2)$。",
    ),
    prerequisites: ["the-chi-square-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "f-distribution-ratio-definition",
        title: t("Defining the F-ratio from independent Chi-squares", "由独立卡方变量定义 F 比值"),
        explanation: t(
          "The F distribution compares two independent estimates of variance, each scaled by its degrees of freedom, by taking their ratio. $F = \\frac{U / d_1}{V / d_2}$, where $U \\sim \\chi^2(d_1)$ and $V \\sim \\chi^2(d_2)$ are independent.",
          "F 分布通过取比值来比较两个独立的方差估计，每个估计都除以它的自由度。$F = \\frac{U / d_1}{V / d_2}$，其中 $U \\sim \\chi^2(d_1)$ 与 $V \\sim \\chi^2(d_2)$ 相互独立。",
        ),
        generate: (rng: Rng): Problem => {
          const d1 = rng.int(2, 20);
          let d2 = rng.int(2, 20);
          if (d2 === d1) d2++;

          const opts = [
            t(`$F(${d1}, ${d2})$`, `$F(${d1}, ${d2})$`),
            t(`$F(${d2}, ${d1})$`, `$F(${d2}, ${d1})$`),
            t(`$t(${d1 + d2})$`, `$t(${d1 + d2})$`),
            t(`$\\chi^2(${d1 + d2})$`, `$\\chi^2(${d1 + d2})$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Let $U \\sim \\chi^2(${d1})$ and $V \\sim \\chi^2(${d2})$ be independent Chi-square random variables. What is the distribution of the ratio $W = \\frac{U / ${d1}}{V / ${d2}}$?`,
              `设 $U \\sim \\chi^2(${d1})$ 与 $V \\sim \\chi^2(${d2})$ 为相互独立的卡方随机变量。比值 $W = \\frac{U / ${d1}}{V / ${d2}}$ 服从什么分布？`,
            ),
            options,
            correct,
            solution: t(
              `By definition, the ratio of two independent Chi-square variables each divided by their respective degrees of freedom follows Snedecor's $F$-distribution: $W \\sim F(${d1}, ${d2})$.`,
              `根据定义，两个独立的卡方变量各自除以其自由度后的比值服从费舍尔-斯内德克 $F$ 分布：$W \\sim F(${d1}, ${d2})$。`,
            ),
          });
        },
      },
      {
        id: "f-distribution-mean",
        title: t("Mean of the F-distribution", "F 分布的均值"),
        explanation: t(
          "The mean of an F variable depends only on the denominator degrees of freedom, and it is slightly greater than one, approaching one for large samples. For X ~ F(d1, d2) with d2 > 2, E[X] = d2 / (d2 - 2), depending only on denominator degrees of freedom.",
          "F 变量的均值只取决于分母的自由度，它略大于 1，样本很大时趋于 1。对于 d2 > 2 的 X ~ F(d1, d2)，其均值仅由分母自由度决定：E[X] = d2 / (d2 - 2)。",
        ),
        generate: (rng: Rng): Problem => {
          const d1 = rng.int(1, 20);
          const d2 = rng.int(3, 30);

          return numberProblem({
            prompt: t(
              `Find the expected value $E[X]$ of an $F$-distributed random variable $X \\sim F(d_1 = ${d1}, d_2 = ${d2})$.`,
              `求服从 $F$ 分布的随机变量 $X \\sim F(d_1 = ${d1}, d_2 = ${d2})$ 的数学期望 $E[X]$。`,
            ),
            answer: Q.of(d2, d2 - 2),
            solution: t(
              `For an $F$-distribution with degrees of freedom $(d_1, d_2)$ where $d_2 > 2$, the expected value depends only on $d_2$: $E[X] = \\frac{d_2}{d_2 - 2} = \\frac{${d2}}{${d2} - 2} = \\frac{${d2}}{${d2 - 2}}${lowestTerms(d2, d2 - 2)}$.`,
              `对于自由度为 $(d_1, d_2)$ 且 $d_2 > 2$ 的 $F$ 分布，其期望值仅取决于 $d_2$：$E[X] = \\frac{d_2}{d_2 - 2} = \\frac{${d2}}{${d2} - 2} = \\frac{${d2}}{${d2 - 2}}${lowestTerms(d2, d2 - 2)}$。`,
            ),
          });
        },
      },
    ],
  },
];
