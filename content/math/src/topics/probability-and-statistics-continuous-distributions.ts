import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { choiceProblem, numberProblem } from "../problems.ts";

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
          "For discrete X, P(X ≤ k) is approximated by P(Y ≤ k + 0.5) and P(X ≥ k) by P(Y ≥ k - 0.5) for continuous normal Y.",
          "对于离散随机变量 X，P(X ≤ k) 用连续正态变量 Y 的 P(Y ≤ k + 0.5) 近似，P(X ≥ k) 用 P(Y ≥ k - 0.5) 近似。",
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
          "For X ~ Binomial(n, p), the approximating normal distribution has mean μ = np and variance σ^2 = np(1-p).",
          "对于 X ~ Binomial(n, p)，近似正态分布的均值为 μ = np，方差为 σ^2 = np(1-p)。",
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
          "For X ~ Poisson(λ), both the mean and variance are λ, so the standard deviation is σ = √λ.",
          "对于 X ~ Poisson(λ)，其均值和方差均为 λ，因此标准差为 σ = √λ。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(4, 25);
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
          "To approximate P(X ≤ c) for Poisson(λ), the continuity correction gives z = (c + 0.5 - λ) / √λ.",
          "为近似 Poisson(λ) 的 P(X ≤ c)，应用连续性校正得到标准化变量 z = (c + 0.5 - λ) / √λ。",
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
          "For X ~ U(a, b), the probability density function is f(x) = 1 / (b - a) for a ≤ x ≤ b and 0 elsewhere.",
          "对于 X ~ U(a, b)，在 a ≤ x ≤ b 时概率密度函数为 f(x) = 1 / (b - a)，在其他区间为 0。",
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
              `The density is $f(x) = \\frac{1}{b - a} = \\frac{1}{${b} - ${a}} = \\frac{1}{${width}}$.`,
              `概率密度函数为 $f(x) = \\frac{1}{b - a} = \\frac{1}{${b} - ${a}} = \\frac{1}{${width}}$。`,
            ),
          });
        },
      },
      {
        id: "continuous-uniform-interval-probability",
        title: t("Computing subinterval probabilities for uniform distributions", "计算均匀分布子区间上的概率"),
        explanation: t(
          "For X ~ U(a, b) and a ≤ c < d ≤ b, P(c ≤ X ≤ d) = (d - c) / (b - a).",
          "对于 X ~ U(a, b) 且 a ≤ c < d ≤ b，概率为 P(c ≤ X ≤ d) = (d - c) / (b - a)。",
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
              `$P(${c} \\le X \\le ${d}) = \\frac{d - c}{b - a} = \\frac{${d} - ${c}}{${b} - ${a}} = \\frac{${subWidth}}{${width}}$.`,
              `$P(${c} \\le X \\le ${d}) = \\frac{d - c}{b - a} = \\frac{${d} - ${c}}{${b} - ${a}} = \\frac{${subWidth}}{${width}}$。`,
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
      "For X ~ U(a, b), the expected value is E[X] = (a + b)/2 and the variance is Var(X) = (b - a)^2 / 12.",
      "对于 X ~ U(a, b)，其数学期望为 E[X] = (a + b)/2，方差为 Var(X) = (b - a)^2 / 12。",
    ),
    prerequisites: ["the-continuous-uniform-distribution", "variance-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "continuous-uniform-expectation",
        title: t("Expected value of a continuous uniform distribution", "连续均匀分布的期望值"),
        explanation: t(
          "For X ~ U(a, b), the expected value is the midpoint E[X] = (a + b) / 2.",
          "对于 X ~ U(a, b)，期望值为区间中点 E[X] = (a + b) / 2。",
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
              `The mean of $U(a, b)$ is the midpoint $E[X] = \\frac{a + b}{2} = \\frac{${a} + ${b}}{2} = \\frac{${a + b}}{2}$.`,
              `$U(a, b)$ 的均值为区间中点 $E[X] = \\frac{a + b}{2} = \\frac{${a} + ${b}}{2} = \\frac{${a + b}}{2}$。`,
            ),
          });
        },
      },
      {
        id: "continuous-uniform-variance",
        title: t("Variance of a continuous uniform distribution", "连续均匀分布的方差"),
        explanation: t("For X ~ U(a, b), the variance is Var(X) = (b - a)^2 / 12.", "对于 X ~ U(a, b)，方差为 Var(X) = (b - a)^2 / 12。"),
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
              `The variance of a continuous uniform variable on $[a, b]$ is $\\text{Var}(X) = \\frac{(b - a)^2}{12} = \\frac{(${b} - ${a})^2}{12} = \\frac{${numerator}}{12}$.`,
              `区间 $[a, b]$ 上连续均匀变量的方差为 $\\text{Var}(X) = \\frac{(b - a)^2}{12} = \\frac{(${b} - ${a})^2}{12} = \\frac{${numerator}}{12}$。`,
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
          "For X ~ U(a, b) and a ≤ c < d ≤ b, P(X > d | X > c) = (b - d) / (b - c).",
          "对于 X ~ U(a, b) 且 a ≤ c < d ≤ b，条件概率为 P(X > d | X > c) = (b - d) / (b - c)。",
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
              `Let $X \\sim U(0, ${maxWait})$. The conditional probability is $P(X > ${d} \\mid X > ${c}) = \\frac{P(X > ${d})}{P(X > ${c})} = \\frac{${maxWait} - ${d}}{${maxWait} - ${c}} = \\frac{${remainingExceed}}{${remainingTotal}}$.`,
              `设 $X \\sim U(0, ${maxWait})$。所求条件概率为 $P(X > ${d} \\mid X > ${c}) = \\frac{P(X > ${d})}{P(X > ${c})} = \\frac{${maxWait} - ${d}}{${maxWait} - ${c}} = \\frac{${remainingExceed}}{${remainingTotal}}$。`,
            ),
          });
        },
      },
      {
        id: "uniform-quantile-cutoff",
        title: t("Finding quantiles for continuous uniform distributions", "求解连续均匀分布的分位数阈值"),
        explanation: t(
          "For X ~ U(a, b), the value x_p satisfying P(X ≤ x_p) = p is x_p = a + p(b - a).",
          "对于 X ~ U(a, b)，满足 P(X ≤ x_p) = p 的值由分位数公式给出：x_p = a + p(b - a)。",
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
      "The exponential distribution Exp(λ) models the time between Poisson events, with PDF f(x) = λ e^{-λ x} and CDF F(x) = 1 - e^{-λ x} for x ≥ 0.",
      "指数分布 Exp(λ) 用于对泊松过程事件发生的时间间隔进行建模，当 x ≥ 0 时，其概率密度函数为 f(x) = λ e^{-λ x}，累积分布函数为 F(x) = 1 - e^{-λ x}。",
    ),
    prerequisites: ["cumulative-distribution-functions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "exponential-cdf-evaluation",
        title: t("Evaluating survival and cumulative probabilities of exponential distribution", "计算指数分布的生存概率与累积概率"),
        explanation: t(
          "For X ~ Exp(λ), the survival probability is P(X > x) = e^{-λ x} and the CDF is P(X ≤ x) = 1 - e^{-λ x}.",
          "对于 X ~ Exp(λ)，其生存概率为 P(X > x) = e^{-λ x}，累积分布函数为 P(X ≤ x) = 1 - e^{-λ x}。",
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
          "The exponential distribution satisfies the memoryless property: P(X > s + t | X > s) = P(X > t).",
          "指数分布满足无记忆性：P(X > s + t | X > s) = P(X > t)。",
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
          "If the average time between events is μ, the rate parameter is λ = 1 / μ.",
          "若事件发生的平均间隔时间为 μ，则比率参数为 λ = 1 / μ。",
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
              `The mean of an exponential distribution is $E[X] = \\frac{1}{\\lambda}$. Therefore, $\\lambda = \\frac{1}{E[X]} = \\frac{1}{${mean}}$.`,
              `指数分布的数学期望为 $E[X] = \\frac{1}{\\lambda}$。因此，$\\lambda = \\frac{1}{E[X]} = \\frac{1}{${mean}}$。`,
            ),
          });
        },
      },
      {
        id: "exponential-median-formula",
        title: t("Identifying the median of an exponential distribution", "确定指数分布的中位数表达式"),
        explanation: t(
          "For X ~ Exp(λ), the median m satisfies 1 - e^{-λ m} = 0.5, so m = ln(2) / λ.",
          "对于 X ~ Exp(λ)，中位数 m 满足 1 - e^{-λ m} = 0.5，因此 m = ln(2) / λ。",
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
      "For X ~ Exp(λ), the expected value is E[X] = 1/λ and the variance is Var(X) = 1/λ^2.",
      "对于 X ~ Exp(λ)，其期望为 E[X] = 1/λ，方差为 Var(X) = 1/λ^2。",
    ),
    prerequisites: ["modeling-with-the-exponential-distribution", "variance-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "exponential-mean-and-sd-equality",
        title: t("Standard deviation of an exponential random variable", "指数随机变量的标准差"),
        explanation: t(
          "For X ~ Exp(λ), Var(X) = 1/λ^2, so the standard deviation is SD(X) = 1/λ, equal to its mean.",
          "对于 X ~ Exp(λ)，方差为 Var(X) = 1/λ^2，因此标准差为 SD(X) = 1/λ，恰好等于其期望值。",
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
              `For an exponential random variable with rate $\\lambda = ${lambda}$, the variance is $\\text{Var}(X) = \\frac{1}{\\lambda^2} = \\frac{1}{${lambda * lambda}}$. Taking the square root gives $\\text{SD}(X) = \\frac{1}{\\lambda} = \\frac{1}{${lambda}}$.`,
              `对于比率为 $\\lambda = ${lambda}$ 的指数随机变量，方差为 $\\text{Var}(X) = \\frac{1}{\\lambda^2} = \\frac{1}{${lambda * lambda}}$。开平方得标准差 $\\text{SD}(X) = \\frac{1}{\\lambda} = \\frac{1}{${lambda}}$。`,
            ),
          });
        },
      },
      {
        id: "exponential-second-moment",
        title: t("Calculating the second raw moment of an exponential distribution", "计算指数分布的二阶原点矩"),
        explanation: t(
          "For X ~ Exp(λ), E[X^2] = Var(X) + (E[X])^2 = 1/λ^2 + 1/λ^2 = 2/λ^2.",
          "对于 X ~ Exp(λ)，E[X^2] = Var(X) + (E[X])^2 = 1/λ^2 + 1/λ^2 = 2/λ^2。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(1, 20);
          const den = lambda * lambda;

          return numberProblem({
            prompt: t(
              `For $X \\sim \\text{Exp}(${lambda})$, evaluate the second moment $E[X^2]$.`,
              `对于 $X \\sim \\text{Exp}(${lambda})$，计算二阶原点矩 $E[X^2]$。`,
            ),
            answer: Q.of(2, den),
            solution: t(
              `$E[X^2] = \\text{Var}(X) + (E[X])^2 = \\frac{1}{\\lambda^2} + \\frac{1}{\\lambda^2} = \\frac{2}{\\lambda^2} = \\frac{2}{${lambda}^2} = \\frac{2}{${den}}$.`,
              `$E[X^2] = \\text{Var}(X) + (E[X])^2 = \\frac{1}{\\lambda^2} + \\frac{1}{\\lambda^2} = \\frac{2}{\\lambda^2} = \\frac{2}{${lambda}^2} = \\frac{2}{${den}}$。`,
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
      "The Gamma function extends the factorial: Γ(α) = ∫_0^∞ x^{α-1} e^{-x} dx, satisfying Γ(α+1) = α Γ(α) and Γ(n) = (n-1)! for positive integers.",
      "伽马函数是阶乘向实数和复数的推广：Γ(α) = ∫_0^∞ x^{α-1} e^{-x} dx，满足递推关系 Γ(α+1) = α Γ(α) 以及对正整数满足 Γ(n) = (n-1)!。",
    ),
    prerequisites: ["improper-integrals-involving-exponential-functions"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "gamma-function-integer-values",
        title: t("Evaluating Gamma function ratios for positive integers", "计算正整数伽马函数的比值"),
        explanation: t(
          "For positive integers, Γ(n) = (n - 1)!, so Γ(n) / Γ(m) = (n - 1)! / (m - 1)!.",
          "对正整数，Γ(n) = (n - 1)!，因此 Γ(n) / Γ(m) = (n - 1)! / (m - 1)!。",
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
          "Using Γ(α+1) = α Γ(α), Γ(a + 1/2) / Γ(b + 1/2) = ∏_{k=b}^{a-1} (k + 1/2).",
          "利用 Γ(α+1) = α Γ(α)，可得 Γ(a + 1/2) / Γ(b + 1/2) = ∏_{k=b}^{a-1} (k + 1/2)。",
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
              `Repeatedly applying $\\Gamma(\\alpha + 1) = \\alpha \\Gamma(\\alpha)$ gives $\\frac{\\Gamma\\left(\\frac{${numA}}{2}\\right)}{\\Gamma\\left(\\frac{${numB}}{2}\\right)} = \\frac{${num}}{${den}}$.`,
              `反复应用 $\\Gamma(\\alpha + 1) = \\alpha \\Gamma(\\alpha)$ 得 $\\frac{\\Gamma\\left(\\frac{${numA}}{2}\\right)}{\\Gamma\\left(\\frac{${numB}}{2}\\right)} = \\frac{${num}}{${den}}$。`,
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
      "The Gamma distribution Gamma(α, β) generalizes the exponential distribution, with PDF f(x) = (β^α / Γ(α)) x^{α-1} e^{-β x}, mean α/β, and variance α/β^2.",
      "伽马分布 Gamma(α, β) 推广了指数分布，其概率密度函数为 f(x) = (β^α / Γ(α)) x^{α-1} e^{-β x}，均值为 α/β，方差为 α/β^2。",
    ),
    prerequisites: ["the-gamma-function", "the-exponential-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "gamma-distribution-mean-variance",
        title: t("Computing the mean and variance of a Gamma distribution", "计算伽马分布的期望与方差"),
        explanation: t(
          "For X ~ Gamma(α, β) with shape α and rate β, E[X] = α / β and Var(X) = α / β^2.",
          "对于形状参数为 α、比率参数为 β 的伽马分布 X ~ Gamma(α, β)，其均值为 E[X] = α / β，方差为 Var(X) = α / β^2。",
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
              `The variance of $\\text{Gamma}(\\alpha, \\beta)$ is $\\text{Var}(X) = \\frac{\\alpha}{\\beta^2} = \\frac{${alpha}}{${beta}^2} = \\frac{${alpha}}{${varDen}}$.`,
              `$\\text{Gamma}(\\alpha, \\beta)$ 的方差为 $\\text{Var}(X) = \\frac{\\alpha}{\\beta^2} = \\frac{${alpha}}{${beta}^2} = \\frac{${alpha}}{${varDen}}$。`,
            ),
          });
        },
      },
      {
        id: "gamma-sum-of-exponentials",
        title: t("Gamma distribution as a sum of independent exponentials", "伽马分布作为独立指数变量之和"),
        explanation: t(
          "The sum of n independent and identically distributed Exp(λ) variables follows Gamma(n, λ).",
          "n 个独立同分布的 Exp(λ) 随机变量之和服从伽马分布 Gamma(n, λ)。",
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
      "The Chi-square distribution χ^2(k) is the distribution of the sum of squares of k independent standard normal variables: E[X] = k, Var(X) = 2k.",
      "自由度为 k 的卡方分布 χ^2(k) 是 k 个独立标准正态随机变量的平方和分布，满足期望 E[X] = k，方差 Var(X) = 2k。",
    ),
    prerequisites: ["the-gamma-distribution", "the-standard-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "chi-square-sum-of-normals",
        title: t("Definition of Chi-square as sum of squared standard normals", "卡方分布作为标准正态变量平方和的定义"),
        explanation: t(
          "If Z_1, ..., Z_k are independent N(0, 1) variables, then ∑_{i=1}^k Z_i^2 ~ χ^2(k).",
          "若 Z_1, ..., Z_k 相互独立且服从 N(0, 1)，则 ∑_{i=1}^k Z_i^2 ~ χ^2(k)。",
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
        explanation: t("For X ~ χ^2(k), E[X] = k and Var(X) = 2k.", "对于 X ~ χ^2(k)，期望为 E[X] = k，方差为 Var(X) = 2k。"),
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
      "Student's t-distribution with ν degrees of freedom is defined as T = Z / √(V / ν), where Z ~ N(0, 1) and V ~ χ^2(ν) are independent. It has heavier tails than N(0, 1) and approaches N(0, 1) as ν → ∞.",
      "自由度为 ν 的学生 t 分布定义为 T = Z / √(V / ν)，其中 Z ~ N(0, 1) 与 V ~ χ^2(ν) 相互独立。它比标准正态分布具有更厚的尾部，且当 ν → ∞ 时渐近收敛于 N(0, 1)。",
    ),
    prerequisites: ["the-chi-square-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "t-distribution-ratio-definition",
        title: t("Formulation of the Student's t ratio", "学生 t 分布的比值构造形式"),
        explanation: t(
          "T = Z / √(V / ν) where Z ~ N(0, 1) and V ~ χ^2(ν) are independent.",
          "T = Z / √(V / ν)，其中 Z ~ N(0, 1) 与 V ~ χ^2(ν) 相互独立。",
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
        explanation: t("For T ~ t(ν) with ν > 2, Var(T) = ν / (ν - 2).", "对于自由度 ν > 2 的 T ~ t(ν)，方差为 Var(T) = ν / (ν - 2)。"),
        generate: (rng: Rng): Problem => {
          const nu = rng.int(3, 40);

          return numberProblem({
            prompt: t(
              `Find the variance $\\text{Var}(T)$ of a random variable $T$ following Student's $t$-distribution with $\\nu = ${nu}$ degrees of freedom.`,
              `求服从自由度为 $\\nu = ${nu}$ 的学生 $t$ 分布的随机变量 $T$ 的方差 $\\text{Var}(T)$。`,
            ),
            answer: Q.of(nu, nu - 2),
            solution: t(
              `For a $t$-distribution with $\\nu > 2$ degrees of freedom, the variance is $\\text{Var}(T) = \\frac{\\nu}{\\nu - 2} = \\frac{${nu}}{${nu} - 2} = \\frac{${nu}}{${nu - 2}}$.`,
              `对于自由度 $\\nu > 2$ 的 $t$ 分布，方差为 $\\text{Var}(T) = \\frac{\\nu}{\\nu - 2} = \\frac{${nu}}{${nu} - 2} = \\frac{${nu}}{${nu - 2}}$。`,
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
      "The F-distribution F(d1, d2) is the distribution of the ratio of two scaled independent Chi-square variables: F = (U / d1) / (V / d2), where U ~ χ^2(d1) and V ~ χ^2(d2).",
      "自由度为 (d1, d2) 的 F 分布定义为两个相互独立的标度卡方随机变量之比：F = (U / d1) / (V / d2)，其中 U ~ χ^2(d1) 且 V ~ χ^2(d2)。",
    ),
    prerequisites: ["the-chi-square-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "f-distribution-ratio-definition",
        title: t("Defining the F-ratio from independent Chi-squares", "由独立卡方变量定义 F 比值"),
        explanation: t(
          "F = (U / d1) / (V / d2) where U ~ χ^2(d1) and V ~ χ^2(d2) are independent.",
          "F = (U / d1) / (V / d2)，其中 U ~ χ^2(d1) 与 V ~ χ^2(d2) 相互独立。",
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
          "For X ~ F(d1, d2) with d2 > 2, E[X] = d2 / (d2 - 2), depending only on denominator degrees of freedom.",
          "对于 d2 > 2 的 X ~ F(d1, d2)，其均值仅由分母自由度决定：E[X] = d2 / (d2 - 2)。",
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
              `For an $F$-distribution with degrees of freedom $(d_1, d_2)$ where $d_2 > 2$, the expected value depends only on $d_2$: $E[X] = \\frac{d_2}{d_2 - 2} = \\frac{${d2}}{${d2} - 2} = \\frac{${d2}}{${d2 - 2}}$.`,
              `对于自由度为 $(d_1, d_2)$ 且 $d_2 > 2$ 的 $F$ 分布，其期望值仅取决于 $d_2$：$E[X] = \\frac{d_2}{d_2 - 2} = \\frac{${d2}}{${d2} - 2} = \\frac{${d2}}{${d2 - 2}}$。`,
            ),
          });
        },
      },
    ],
  },
];
