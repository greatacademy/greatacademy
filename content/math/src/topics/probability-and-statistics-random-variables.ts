import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem } from "../problems.ts";

/** Topics for Unit 1: Probability & Random Variables (new topics). */
export const probabilityAndStatisticsRandomVariablesTopics: TopicDef[] = [
  // 1.3.4 Cumulative Distribution Functions for Continuous Random Variables
  {
    id: "cumulative-distribution-functions-for-continuous-random-variables",
    title: t("Cumulative Distribution Functions for Continuous Random Variables", "连续型随机变量的累积分布函数"),
    summary: t(
      "The cumulative distribution function $F(x) = P(X \\le x) = \\int_{-\\infty}^{x} f(t)\\,dt$ gives the probability that a continuous random variable takes a value at most $x$.",
      "累积分布函数 $F(x) = P(X \\le x) = \\int_{-\\infty}^{x} f(t)\\,dt$ 表示连续型随机变量取值不超过 $x$ 的概率。",
    ),
    prerequisites: ["calculating-probabilities-with-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-cdf-from-pdf",
        title: t("Evaluating the CDF of a continuous random variable", "由概率密度函数计算累积分布函数值"),
        explanation: t(
          "The cumulative distribution function gives the probability of a value at most the given one, which is the area under the density up to that point. For a continuous random variable $X$ with PDF $f(x)$ on $[0, b]$, the CDF is $F(x) = \\int_0^x f(t) \\, dt$. At any point $x_0$, $F(x_0)$ is $P(X \\le x_0)$.",
          "累积分布函数给出取值不超过给定值的概率，也就是密度曲线下到该点为止的面积。对于在区间 $[0, b]$ 上具有概率密度函数 $f(x)$ 的连续型随机变量 $X$，其累积分布函数为 $F(x) = \\int_0^x f(t) \\, dt$。在任意点 $x_0$ 处，$F(x_0)$ 表示 $P(X \\le x_0)$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(4, 30);
          const x0 = rng.int(1, b - 1);
          const num = x0 * x0;
          const den = b * b;

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ has probability density function $f(x) = \\frac{2x}{${den}}$ for $0 \\le x \\le ${b}$, and $f(x) = 0$ elsewhere. Calculate the value of the cumulative distribution function $F(${x0}) = P(X \\le ${x0})$.`,
              `设连续型随机变量 $X$ 的概率密度函数为 $f(x) = \\frac{2x}{${den}}$（$0 \\le x \\le ${b}$），其他位置 $f(x) = 0$。求累积分布函数在 $x = ${x0}$ 处的值 $F(${x0}) = P(X \\le ${x0})$。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(2 * x0, den), Q.of(den - num, den), Q.of(x0, b)],
            solution: t(
              `Integrate the PDF: $F(x) = \\int_0^x \\frac{2t}{${den}}\\,dt = \\frac{x^2}{${den}}$. At $x = ${x0}$, $F(${x0}) = \\frac{${x0}^2}{${den}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `对概率密度函数积分：$F(x) = \\int_0^x \\frac{2t}{${den}}\\,dt = \\frac{x^2}{${den}}$。在 $x = ${x0}$ 处，$F(${x0}) = \\frac{${x0}^2}{${den}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "calculating-probabilities-using-cdf",
        title: t("Calculating interval probabilities using the CDF", "利用累积分布函数计算区间概率"),
        explanation: t(
          "For any continuous random variable with CDF F(x), the probability that X falls in [a, c] is given by P(a ≤ X ≤ c) = F(c) - F(a).",
          "对于具有累积分布函数 F(x) 的连续型随机变量，X 落在区间 [a, c] 内的概率由 P(a ≤ X ≤ c) = F(c) - F(a) 给出。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(4, 25);
          const a = rng.int(0, b - 2);
          const c = rng.int(a + 1, b);
          const b3 = b * b * b;
          const num = c * c * c - a * a * a;

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ has cumulative distribution function $F(x) = \\frac{x^3}{${b3}}$ for $0 \\le x \\le ${b}$. Find $P(${a} \\le X \\le ${c})$.`,
              `设连续型随机变量 $X$ 的累积分布函数为 $F(x) = \\frac{x^3}{${b3}}$（$0 \\le x \\le ${b}$）。求概率 $P(${a} \\le X \\le ${c})$。`,
            ),
            answer: Q.of(num, b3),
            wrong: [Q.of(c * c * c, b3), Q.of(c * c * c + a * a * a, b3), Q.of(c - a, b)],
            solution: t(
              `$P(${a} \\le X \\le ${c}) = F(${c}) - F(${a}) = \\frac{${c}^3}{${b3}} - \\frac{${a}^3}{${b3}} = \\frac{${num}}{${b3}}${lowestTerms(num, b3)}$.`,
              `$P(${a} \\le X \\le ${c}) = F(${c}) - F(${a}) = \\frac{${c}^3}{${b3}} - \\frac{${a}^3}{${b3}} = \\frac{${num}}{${b3}}${lowestTerms(num, b3)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 1.3.5 Median, Quartiles and Percentiles of Continuous Random Variables
  {
    id: "median-quartiles-and-percentiles-of-continuous-random-variables",
    title: t("Median, Quartiles and Percentiles of Continuous Random Variables", "连续型随机变量的中位数、四分位数与百分位数"),
    summary: t(
      "The $p$-th quantile $x_p$ satisfies $F(x_p) = p$. The median satisfies $F(m) = 0.5$, the first quartile $F(Q_1) = 0.25$ and the third quartile $F(Q_3) = 0.75$.",
      "$p$ 分位数 $x_p$ 满足 $F(x_p) = p$。中位数满足 $F(m) = 0.5$，第一四分位数满足 $F(Q_1) = 0.25$，第三四分位数满足 $F(Q_3) = 0.75$。",
    ),
    prerequisites: ["cumulative-distribution-functions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "median-of-continuous-random-variable",
        title: t("Finding the median of a continuous distribution", "求解连续型分布的中位数"),
        explanation: t(
          "The median splits the probability in half, so it is the point where the area under the density on each side equals one half. The median $m$ of a continuous random variable $X$ satisfies $F(m) = \\frac{1}{2}$, or equivalently $\\int_{-\\infty}^m f(t) \\, dt = \\frac{1}{2}$.",
          "中位数把概率平分为两半，所以它是密度曲线下两侧面积都等于二分之一的点。连续型随机变量 $X$ 的中位数 $m$ 满足 $F(m) = \\frac{1}{2}$，或等价地 $\\int_{-\\infty}^m f(t) \\, dt = \\frac{1}{2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const x0 = rng.int(2, 35);
          const median = 2 * x0;

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ has Pareto probability density function $f(x) = \\frac{${x0}}{x^2}$ for $x \\ge ${x0}$, and $0$ otherwise. Find the median $m$ of $X$.`,
              `连续型随机变量 $X$ 服从帕累托分布，其概率密度函数为 $f(x) = \\frac{${x0}}{x^2}$（$x \\ge ${x0}$），其他位置为 $0$。求 $X$ 的中位数 $m$。`,
            ),
            answer: median,
            wrong: [x0, 3 * x0, Q.of(3 * x0, 2)],
            solution: t(
              `The CDF for $x \\ge ${x0}$ is $F(x) = \\int_{${x0}}^x \\frac{${x0}}{t^2}\\,dt = 1 - \\frac{${x0}}{x}$. Setting $F(m) = \\frac{1}{2}$ gives $1 - \\frac{${x0}}{m} = \\frac{1}{2} \\implies m = 2 \\cdot ${x0} = ${median}$.`,
              `当 $x \\ge ${x0}$ 时，累积分布函数为 $F(x) = \\int_{${x0}}^x \\frac{${x0}}{t^2}\\,dt = 1 - \\frac{${x0}}{x}$。令 $F(m) = \\frac{1}{2}$ 得 $1 - \\frac{${x0}}{m} = \\frac{1}{2} \\implies m = 2 \\cdot ${x0} = ${median}$。`,
            ),
          });
        },
      },
      {
        id: "quartiles-and-percentiles-of-continuous-random-variable",
        title: t("Computing percentiles and quartiles", "计算百分位数与四分位数"),
        explanation: t(
          "A percentile is the value below which a given fraction of the probability lies, so set the cumulative distribution function equal to that fraction and solve. The $p$-th quantile $x_p$ satisfies $F(x_p) = p$. For $F(x) = \\frac{x^2}{b^2}$ on $[0, b]$, setting $\\frac{x_p^2}{b^2} = p$ yields $x_p = b\\sqrt{p}$.",
          "百分位数是其下方概率占给定比例的值，所以令累积分布函数等于这个比例，再求解。$p$ 分位数 $x_p$ 满足 $F(x_p) = p$。对于区间 $[0, b]$ 上的 $F(x) = \\frac{x^2}{b^2}$，令 $\\frac{x_p^2}{b^2} = p$ 可得 $x_p = b\\sqrt{p}$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.pick([3, 4, 5, 6, 7, 8, 9]);
          const multiplier = rng.int(1, 6);
          const b = 10 * multiplier;
          const p = k * k; // percentage: 9, 16, 25, 36, 49, 64, 81
          const xp = k * multiplier;

          return numberProblem({
            prompt: t(
              `The CDF of a continuous random variable $X$ is $F(x) = \\frac{x^2}{${b * b}}$ for $0 \\le x \\le ${b}$. Find the $${p}\\text{th}$ percentile of $X$.`,
              `设连续型随机变量 $X$ 的累积分布函数为 $F(x) = \\frac{x^2}{${b * b}}$（$0 \\le x \\le ${b}$）。求 $X$ 的第 $${p}$ 百分位数。`,
            ),
            answer: xp,
            wrong: [Q.of(p * b, 100), b - xp, k],
            solution: t(
              `Setting $F(x) = \\frac{x^2}{${b * b}} = \\frac{${p}}{100}$ yields $x^2 = \\frac{${p} \\cdot ${b * b}}{100} = ${xp * xp} \\implies x = ${xp}$.`,
              `令 $F(x) = \\frac{x^2}{${b * b}} = \\frac{${p}}{100}$ 得 $x^2 = \\frac{${p} \\cdot ${b * b}}{100} = ${xp * xp} \\implies x = ${xp}$。`,
            ),
          });
        },
      },
    ],
  },

  // 1.3.6 Finding the Mode of a Continuous Random Variable
  {
    id: "finding-the-mode-of-a-continuous-random-variable",
    title: t("Finding the Mode of a Continuous Random Variable", "求解连续型随机变量的众数"),
    summary: t(
      "The mode of a continuous random variable is the value of x at which the probability density function f(x) attains its global maximum.",
      "连续型随机变量的众数是概率密度函数 f(x) 达到全局最大值时对应的自变量 x 之取值。",
    ),
    prerequisites: ["probability-density-functions-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "mode-of-polynomial-pdf",
        title: t("Finding the mode from a polynomial PDF", "由多项式型概率密度函数求解众数"),
        explanation: t(
          "For a continuous random variable with differentiable PDF f(x), the mode occurs at a critical point where f'(x) = 0 and f''(x) < 0 (or at the boundary).",
          "对于概率密度函数 f(x) 可微的连续型随机变量，众数出现在满足 f'(x) = 0 且 f''(x) < 0 的驻点（或区间边界）处。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 45);
          const b = 3 * k;
          const mode = 2 * k;

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ has probability density function $f(x) = C x^2 (${b} - x)$ for $0 \\le x \\le ${b}$, where $C > 0$ is a normalizing constant. Find the mode of $X$.`,
              `设连续型随机变量 $X$ 的概率密度函数为 $f(x) = C x^2 (${b} - x)$（$0 \\le x \\le ${b}$），其中 $C > 0$ 为归一化常数。求 $X$ 的众数。`,
            ),
            answer: mode,
            wrong: [k, Q.of(3 * k, 2), b],
            solution: t(
              `Maximizing $g(x) = x^2 (${b} - x) = ${b} x^2 - x^3$ gives $g'(x) = x(2 \\cdot ${b} - 3x) = 0$. On $(0, ${b})$, the maximum occurs at $x = \\frac{2 \\cdot ${b}}{3} = ${mode}$.`,
              `使 $g(x) = x^2 (${b} - x) = ${b} x^2 - x^3$ 最大的点满足 $g'(x) = x(2 \\cdot ${b} - 3x) = 0$。在 $(0, ${b})$ 内，最大值点为 $x = \\frac{2 \\cdot ${b}}{3} = ${mode}$。`,
            ),
          });
        },
      },
      {
        id: "mode-of-exponential-weighted-pdf",
        title: t("Mode of a gamma-type or exponentially damped PDF", "伽马型或指数衰减型密度的众数"),
        explanation: t(
          "The mode is where the density is highest, so set its derivative equal to zero and check that the critical point is a maximum. For $f(x) = Cxe^{-kx}$ ($x \\ge 0$), differentiation gives $f'(x) = Ce^{-kx}(1 - kx)$. The unique maximum occurs at $x = \\frac{1}{k}$.",
          "众数是密度最大的位置，所以令密度的导数等于零，并检验这个临界点是最大值点。对于 $f(x) = Cxe^{-kx}$（$x \\ge 0$），求导得 $f'(x) = Ce^{-kx}(1 - kx)$。唯一最大值点为 $x = \\frac{1}{k}$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 30);

          return numberProblem({
            prompt: t(
              `The PDF of a continuous random variable $X$ on $[0, \\infty)$ is $f(x) = ${k * k} x e^{-${k} x}$. Find the mode of $X$.`,
              `设连续型随机变量 $X$ 在 $[0, \\infty)$ 上的概率密度函数为 $f(x) = ${k * k} x e^{-${k} x}$。求 $X$ 的众数。`,
            ),
            answer: Q.of(1, k),
            wrong: [k, Q.of(2, k), Q.of(1, k * k)],
            solution: t(
              `Differentiating $f(x) = ${k * k} x e^{-${k} x}$ gives $f'(x) = ${k * k} e^{-${k} x}(1 - ${k} x) = 0 \\implies x = \\frac{1}{${k}}${lowestTerms(1, k)}$.`,
              `对 $f(x) = ${k * k} x e^{-${k} x}$ 求导得 $f'(x) = ${k * k} e^{-${k} x}(1 - ${k} x) = 0 \\implies x = \\frac{1}{${k}}${lowestTerms(1, k)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 1.3.7 Approximating Discrete Random Variables as Continuous
  {
    id: "approximating-discrete-random-variables-as-continuous",
    title: t("Approximating Discrete Random Variables as Continuous", "用连续型随机变量近似离散型随机变量"),
    summary: t(
      "Continuity correction adjusts discrete intervals to continuous ones by adding or subtracting 0.5: P(a ≤ X ≤ b) ≈ P(a - 0.5 ≤ Y ≤ b + 0.5).",
      "连续性校正通过对区间端点加减 0.5 将离散区间转换为连续区间：P(a ≤ X ≤ b) ≈ P(a - 0.5 ≤ Y ≤ b + 0.5)。",
    ),
    prerequisites: ["calculating-probabilities-with-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "continuity-correction-interval",
        title: t("Identifying continuity-corrected intervals", "确定连续性校正后的区间"),
        explanation: t(
          "When a continuous distribution approximates a discrete one, each whole number is spread over the interval of width one centered on it. Each discrete integer k occupies the continuous interval [k - 0.5, k + 0.5]. Thus P(a ≤ X ≤ b) maps to [a - 0.5, b + 0.5], while P(X ≥ a) maps to [a - 0.5, ∞).",
          "当用连续分布近似离散分布时，每个整数都被摊开到以它为中心、宽度为 1 的区间上。每个离散整数 k 对应连续区间 [k - 0.5, k + 0.5]。因此 P(a ≤ X ≤ b) 对应连续区间 [a - 0.5, b + 0.5]，而 P(X ≥ a) 对应 [a - 0.5, ∞)。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(10, 50);
          const b = rng.int(a + 5, a + 30);
          const opts = [
            t(`$[${a - 0.5}, ${b + 0.5}]$`, `$[${a - 0.5}, ${b + 0.5}]$`),
            t(`$[${a + 0.5}, ${b - 0.5}]$`, `$[${a + 0.5}, ${b - 0.5}]$`),
            t(`$[${a}, ${b}]$`, `$[${a}, ${b}]$`),
            t(`$[${a - 1}, ${b + 1}]$`, `$[${a - 1}, ${b + 1}]$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((idx) => opts[idx]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `When approximating a discrete integer random variable $X$ by a continuous random variable $Y$, which continuous interval corresponds to $P(${a} \\le X \\le ${b})$ after continuity correction?`,
              `当用连续型随机变量 $Y$ 近似离散型整值随机变量 $X$ 时，经过连续性校正后，与概率 $P(${a} \\le X \\le ${b})$ 对应的连续区间是哪个？`,
            ),
            options,
            correct,
            solution: t(
              `With continuity correction, each integer $k$ corresponds to $[k - 0.5, k + 0.5]$. Thus $P(${a} \\le X \\le ${b}) \\approx P(${a - 0.5} \\le Y \\le ${b + 0.5})$.`,
              `经过连续性校正，每个整数 $k$ 对应区间 $[k - 0.5, k + 0.5]$。因此 $P(${a} \\le X \\le ${b}) \\approx P(${a - 0.5} \\le Y \\le ${b + 0.5})$。`,
            ),
          });
        },
      },
      {
        id: "calculating-probability-with-continuity-correction",
        title: t("Evaluating probability with continuity correction", "利用连续性校正计算近似概率"),
        explanation: t(
          "After widening the interval by one half at each end, compute the probability of the continuous variable over the widened interval. For an approximating continuous variable $Y$ with constant density $\\frac{1}{L}$, $P(a \\le X \\le b) \\approx \\int_{a - 0.5}^{b + 0.5} \\frac{1}{L} \\, dy = \\frac{b - a + 1}{L}$.",
          "把区间两端各扩大二分之一后，计算连续变量在扩大后区间上的概率。若近似连续型随机变量 $Y$ 具有恒定密度 $\\frac{1}{L}$，则 $P(a \\le X \\le b) \\approx \\int_{a - 0.5}^{b + 0.5} \\frac{1}{L} \\, dy = \\frac{b - a + 1}{L}$。",
        ),
        generate: (rng: Rng): Problem => {
          const L = rng.int(40, 150);
          const a = rng.int(5, 25);
          const count = rng.int(3, 20);
          const b = a + count - 1;

          return numberProblem({
            prompt: t(
              `A discrete integer random variable $X$ is approximated by a continuous variable $Y$ uniformly distributed on $[0, ${L}]$ with density $f(y) = \\frac{1}{${L}}$. Using continuity correction, calculate the approximate probability $P(${a} \\le X \\le ${b})$.`,
              `离散整值随机变量 $X$ 由区间 $[0, ${L}]$ 上均匀分布的连续型随机变量 $Y$（密度为 $f(y) = \\frac{1}{${L}}$）近似。应用连续性校正，求 $P(${a} \\le X \\le ${b})$ 的近似概率。`,
            ),
            answer: Q.of(count, L),
            wrong: [Q.of(count - 1, L), Q.of(count + 1, L), Q.of(1, L)],
            solution: t(
              `$P(${a} \\le X \\le ${b}) \\approx \\int_{${a - 0.5}}^{${b + 0.5}} \\frac{1}{${L}}\\,dy = \\frac{(${b + 0.5}) - (${a - 0.5})}{${L}} = \\frac{${count}}{${L}}${lowestTerms(count, L)}$.`,
              `$P(${a} \\le X \\le ${b}) \\approx \\int_{${a - 0.5}}^{${b + 0.5}} \\frac{1}{${L}}\\,dy = \\frac{(${b + 0.5}) - (${a - 0.5})}{${L}} = \\frac{${count}}{${L}}${lowestTerms(count, L)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 1.3.8 Simulating Random Observations
  {
    id: "simulating-random-observations",
    title: t("Simulating Random Observations", "模拟随机观测值"),
    summary: t(
      "Inverse transform sampling generates observations from a distribution with CDF $F(x)$ by setting $x = F^{-1}(u)$, where $u$ is drawn from $\\text{Uniform}(0, 1)$.",
      "逆变换抽样令 $x = F^{-1}(u)$（$u$ 取自 $\\text{Uniform}(0, 1)$），生成服从累积分布函数 $F(x)$ 的随机观测值。",
    ),
    prerequisites: ["cumulative-distribution-functions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "inverse-transform-sampling-method",
        title: t("Deriving the inverse CDF transformation", "推导逆累积分布函数变换"),
        explanation: t(
          "Feeding uniform random numbers through the inverse of a cumulative distribution function produces samples that follow that distribution. If $U \\sim \\text{Uniform}(0, 1)$, then $X = F^{-1}(U)$ has cumulative distribution function $F(x)$. Solving $u = F(x)$ for $x$ yields the simulation formula.",
          "把均匀随机数代入累积分布函数的反函数，就能得到服从该分布的样本。若 $U \\sim \\text{Uniform}(0, 1)$，则 $X = F^{-1}(U)$ 的累积分布函数为 $F(x)$。由 $u = F(x)$ 解出 $x$ 即得模拟公式。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 50);
          const opts = [
            t(`$-\\frac{1}{${lambda}} \\ln(1 - u)$`, `$-\\frac{1}{${lambda}} \\ln(1 - u)$`),
            t(`$\\frac{1}{${lambda}} \\ln(1 - u)$`, `$\\frac{1}{${lambda}} \\ln(1 - u)$`),
            t(`$1 - e^{-${lambda} u}$`, `$1 - e^{-${lambda} u}$`),
            t(`$-\\frac{1}{${lambda}} (1 - u)$`, `$-\\frac{1}{${lambda}} (1 - u)$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((idx) => opts[idx]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `An exponential random variable $X$ has CDF $F(x) = 1 - e^{-${lambda} x}$ for $x \\ge 0$. Which formula simulates an observation of $X$ from a uniform random draw $u \\in (0, 1)$?`,
              `指数型随机变量 $X$ 的累积分布函数为 $F(x) = 1 - e^{-${lambda} x}$（$x \\ge 0$）。从均匀随机数 $u \\in (0, 1)$ 模拟 $X$ 的观测值时，对应的公式是哪一个？`,
            ),
            options,
            correct,
            solution: t(
              `Setting $u = 1 - e^{-${lambda} x} \\implies e^{-${lambda} x} = 1 - u \\implies x = -\\frac{1}{${lambda}} \\ln(1 - u)$.`,
              `令 $u = 1 - e^{-${lambda} x} \\implies e^{-${lambda} x} = 1 - u \\implies x = -\\frac{1}{${lambda}} \\ln(1 - u)$。`,
            ),
          });
        },
      },
      {
        id: "simulating-observations-from-uniform-draws",
        title: t("Computing a simulated value from a uniform draw", "由均匀分布抽样计算模拟值"),
        explanation: t(
          "Set the cumulative distribution function equal to the uniform draw and solve for the value, which is the simulated observation. Given the CDF $F(x) = \\frac{x^2}{b^2}$ and a uniform draw $u$, the simulated observation is $x = b\\sqrt{u}$.",
          "令累积分布函数等于这个均匀抽样值，再解出相应的值，它就是模拟的观测值。给定累积分布函数 $F(x) = \\frac{x^2}{b^2}$ 及均匀抽样值 $u$，模拟观测值为 $x = b\\sqrt{u}$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
          const mult = rng.int(1, 6);
          const b = 10 * mult;
          const uNum = k * k;
          const xSim = k * mult;

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ on $[0, ${b}]$ has CDF $F(x) = \\frac{x^2}{${b * b}}$. In a simulation experiment, a pseudo-random number generator produces $u = \\frac{${uNum}}{100}$. Find the simulated observation $x = F^{-1}(u)$.`,
              `连续型随机变量 $X$ 在 $[0, ${b}]$ 上的累积分布函数为 $F(x) = \\frac{x^2}{${b * b}}$。在一次模拟实验中，伪随机数生成器产生抽样值 $u = \\frac{${uNum}}{100}$。求模拟观测值 $x = F^{-1}(u)$。`,
            ),
            answer: xSim,
            wrong: [Q.of(uNum * b, 100), b - xSim, k],
            solution: t(
              `Setting $F(x) = \\frac{x^2}{${b * b}} = \\frac{${uNum}}{100} \\implies x^2 = ${mult * mult * uNum} \\implies x = ${xSim}$.`,
              `令 $F(x) = \\frac{x^2}{${b * b}} = \\frac{${uNum}}{100} \\implies x^2 = ${mult * mult * uNum} \\implies x = ${xSim}$。`,
            ),
          });
        },
      },
    ],
  },

  // 1.4.3 The Distribution Function Method
  {
    id: "the-distribution-function-method",
    title: t("The Distribution Function Method", "分布函数法"),
    summary: t(
      "The distribution function method finds the density of $Y = g(X)$ by first finding the CDF $F_Y(y) = P(g(X) \\le y)$ and then differentiating: $f_Y(y) = F_Y'(y)$.",
      "分布函数法先求 $Y = g(X)$ 的累积分布函数 $F_Y(y) = P(g(X) \\le y)$，再求导得到密度：$f_Y(y) = F_Y'(y)$。",
    ),
    prerequisites: [
      "one-to-one-transformations-of-discrete-random-variables",
      "cumulative-distribution-functions-for-continuous-random-variables",
    ],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-cdf-of-transformed-variable",
        title: t("Evaluating the CDF of a linear transformation", "计算线性变换后随机变量的累积分布函数"),
        explanation: t(
          "Rewrite the event about the new variable as an event about the old one, then use the known distribution of the old variable. For $X \\sim \\text{Uniform}(0, b)$ and $Y = aX + c$ with $a > 0$, $F_Y(y) = P(aX + c \\le y) = P\\left(X \\le \\frac{y - c}{a}\\right) = \\frac{y - c}{ab}$.",
          "把关于新变量的事件改写成关于旧变量的事件，再利用旧变量的已知分布。若 $X \\sim \\text{Uniform}(0, b)$ 且 $Y = aX + c$（$a > 0$），则 $F_Y(y) = P(aX + c \\le y) = P\\left(X \\le \\frac{y - c}{a}\\right) = \\frac{y - c}{ab}$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(4, 25);
          const a = rng.int(2, 8);
          const c = rng.int(1, 15);
          const k = rng.int(1, b - 1);
          const y0 = a * k + c;

          return numberProblem({
            prompt: t(
              `Let $X$ be uniformly distributed on $[0, ${b}]$, so $F_X(x) = \\frac{x}{${b}}$ for $0 \\le x \\le ${b}$. Define $Y = ${a} X + ${c}$. Find the value of $F_Y(${y0}) = P(Y \\le ${y0})$.`,
              `设 $X$ 服从区间 $[0, ${b}]$ 上的均匀分布，其 CDF 为 $F_X(x) = \\frac{x}{${b}}$（$0 \\le x \\le ${b}$）。定义 $Y = ${a} X + ${c}$。求 $F_Y(${y0}) = P(Y \\le ${y0})$ 的值。`,
            ),
            answer: Q.of(k, b),
            wrong: [Q.of(y0, b), Q.of(y0 - c, b), Q.of(b - k, b)],
            solution: t(
              `$P(Y \\le ${y0}) = P(${a} X + ${c} \\le ${y0}) = P\\left(X \\le \\frac{${y0 - c}}{${a}}\\right) = P(X \\le ${k}) = \\frac{${k}}{${b}}${lowestTerms(k, b)}$.`,
              `$P(Y \\le ${y0}) = P(${a} X + ${c} \\le ${y0}) = P\\left(X \\le \\frac{${y0 - c}}{${a}}\\right) = P(X \\le ${k}) = \\frac{${k}}{${b}}${lowestTerms(k, b)}$。`,
            ),
          });
        },
      },
      {
        id: "pdf-via-distribution-function-method",
        title: t("Deriving the PDF by differentiating the CDF", "通过对 CDF 求导推导概率密度函数"),
        explanation: t(
          "Find the cumulative distribution function of the new variable first, then differentiate it to get the density. For $Y = X^2$ with $X \\sim \\text{Uniform}(0, b)$, $F_Y(y) = P(X \\le \\sqrt{y}) = \\frac{\\sqrt{y}}{b}$, so differentiating gives $f_Y(y) = \\frac{1}{2b\\sqrt{y}}$ for $0 < y < b^2$.",
          "先求出新变量的累积分布函数，再对它求导得到密度。对于 $X \\sim \\text{Uniform}(0, b)$ 且 $Y = X^2$，$F_Y(y) = P(X \\le \\sqrt{y}) = \\frac{\\sqrt{y}}{b}$，求导得 $f_Y(y) = \\frac{1}{2b\\sqrt{y}}$（$0 < y < b^2$）。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(3, 20);
          const m = rng.int(1, b - 1);
          const y0 = m * m;
          const den = 2 * b * m;

          return numberProblem({
            prompt: t(
              `Let $X$ be uniformly distributed on $(0, ${b})$ with PDF $f_X(x) = \\frac{1}{${b}}$. Let $Y = X^2$. Using the distribution function method, evaluate the probability density function $f_Y(y)$ at $y = ${y0}$.`,
              `设随机变量 $X$ 服从 $(0, ${b})$ 上的均匀分布，密度为 $f_X(x) = \\frac{1}{${b}}$。令 $Y = X^2$。应用分布函数法，求 $Y$ 的概率密度函数在 $y = ${y0}$ 处的值 $f_Y(${y0})$。`,
            ),
            answer: Q.of(1, den),
            wrong: [Q.of(1, b), Q.of(1, b * m), Q.of(m, b)],
            solution: t(
              `$F_Y(y) = P(X^2 \\le y) = \\frac{\\sqrt{y}}{${b}}$. Differentiating gives $f_Y(y) = \\frac{1}{${2 * b}\\sqrt{y}}$. At $y = ${y0}$, $f_Y(${y0}) = \\frac{1}{${2 * b} \\cdot ${m}} = \\frac{1}{${den}}${lowestTerms(1, den)}$.`,
              `$F_Y(y) = P(X^2 \\le y) = \\frac{\\sqrt{y}}{${b}}$。求导得 $f_Y(y) = \\frac{1}{${2 * b}\\sqrt{y}}$。在 $y = ${y0}$ 处，$f_Y(${y0}) = \\frac{1}{${2 * b} \\cdot ${m}} = \\frac{1}{${den}}${lowestTerms(1, den)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 1.4.4 The Change-of-Variables Method for Continuous Random Variables
  {
    id: "the-change-of-variables-method-for-continuous-random-variables",
    title: t("The Change-of-Variables Method for Continuous Random Variables", "连续型随机变量的变量代换法"),
    summary: t(
      "For a strictly monotonic transformation $Y = g(X)$, the density of $Y$ is $f_Y(y) = f_X(g^{-1}(y)) \\left|\\frac{d}{dy} g^{-1}(y)\\right|$.",
      "对于严格单调变换 $Y = g(X)$，$Y$ 的概率密度为 $f_Y(y) = f_X(g^{-1}(y)) \\left|\\frac{d}{dy} g^{-1}(y)\\right|$。",
    ),
    prerequisites: ["the-distribution-function-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "change-of-variables-scale-transformation",
        title: t("Applying the change-of-variables formula for scaling", "应用变量代换公式求解尺度变换"),
        explanation: t(
          "Scaling a variable stretches its density horizontally, so the density must be divided by the scale factor to keep the total probability one. If $Y = cX$ with $c > 0$, then $x = \\frac{y}{c}$ and $\\left|\\frac{dx}{dy}\\right| = \\frac{1}{c}$. Hence $f_Y(y) = \\frac{1}{c} f_X\\left(\\frac{y}{c}\\right)$.",
          "对变量缩放会在水平方向拉伸它的密度，所以密度要除以缩放因子，使总概率保持为 1。若 $Y = cX$（$c > 0$），则 $x = \\frac{y}{c}$ 且 $\\left|\\frac{dx}{dy}\\right| = \\frac{1}{c}$。因此 $f_Y(y) = \\frac{1}{c} f_X\\left(\\frac{y}{c}\\right)$。",
        ),
        generate: (rng: Rng): Problem => {
          const c = rng.int(2, 10);
          let lambda = rng.int(2, 20);
          if (lambda === c) lambda += 2;
          const opts = [
            t(`$\\frac{${lambda}}{${c}} e^{-\\frac{${lambda}}{${c}} y}$`, `$\\frac{${lambda}}{${c}} e^{-\\frac{${lambda}}{${c}} y}$`),
            t(`$\\frac{${c}}{${lambda}} e^{-\\frac{${c}}{${lambda}} y}$`, `$\\frac{${c}}{${lambda}} e^{-\\frac{${c}}{${lambda}} y}$`),
            t(`$${lambda * c} e^{-${lambda * c} y}$`, `$${lambda * c} e^{-${lambda * c} y}$`),
            t(`$\\frac{1}{${c}} e^{-${lambda} y}$`, `$\\frac{1}{${c}} e^{-${lambda} y}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((idx) => opts[idx]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Let $X$ have exponential density $f_X(x) = ${lambda} e^{-${lambda} x}$ for $x > 0$. Using the change-of-variables formula, what is the probability density function $f_Y(y)$ of $Y = ${c} X$ for $y > 0$?`,
              `设 $X$ 服从指数分布，密度为 $f_X(x) = ${lambda} e^{-${lambda} x}$（$x > 0$）。使用变量代换公式，变换 $Y = ${c} X$（$y > 0$）的概率密度函数 $f_Y(y)$ 是什么？`,
            ),
            options,
            correct,
            solution: t(
              `With $y = ${c} x$, $x = \\frac{y}{${c}}$ and $\\left|\\frac{dx}{dy}\\right| = \\frac{1}{${c}}$. Then $f_Y(y) = f_X\\left(\\frac{y}{${c}}\\right) \\cdot \\frac{1}{${c}} = \\frac{${lambda}}{${c}} e^{-\\frac{${lambda}}{${c}} y}$.`,
              `由 $y = ${c} x$ 得 $x = \\frac{y}{${c}}$ 且 $\\left|\\frac{dx}{dy}\\right| = \\frac{1}{${c}}$。因此 $f_Y(y) = f_X\\left(\\frac{y}{${c}}\\right) \\cdot \\frac{1}{${c}} = \\frac{${lambda}}{${c}} e^{-\\frac{${lambda}}{${c}} y}$。`,
            ),
          });
        },
      },
      {
        id: "evaluating-transformed-density-at-a-point",
        title: t("Evaluating the transformed density at a point", "计算变换后密度函数在特定点的值"),
        explanation: t(
          "For a one to one transformation, the new density is the old density at the matching point times the absolute value of the derivative of the inverse. For $Y = \\frac{c}{X}$ with $X \\sim \\text{Uniform}(0, b)$, $x = \\frac{c}{y}$ and $\\left|\\frac{dx}{dy}\\right| = \\frac{c}{y^2}$. The density is $f_Y(y) = \\frac{c}{by^2}$ for $y > \\frac{c}{b}$.",
          "对于一一对应的变换，新密度等于旧密度在对应点处的值乘以反函数导数的绝对值。对于 $X \\sim \\text{Uniform}(0, b)$ 且 $Y = \\frac{c}{X}$，$x = \\frac{c}{y}$ 且 $\\left|\\frac{dx}{dy}\\right| = \\frac{c}{y^2}$。密度函数为 $f_Y(y) = \\frac{c}{by^2}$（$y > \\frac{c}{b}$）。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(2, 10);
          const c = rng.int(2, 8);
          const k = rng.int(2, 6);
          const num = b;
          const den = k * k * c;

          return numberProblem({
            prompt: t(
              `Let $X$ be uniformly distributed on $(0, ${b})$ with density $f_X(x) = \\frac{1}{${b}}$. Let $Y = \\frac{${c}}{X}$. Find the value of the PDF $f_Y(y)$ at $y = \\frac{${k * c}}{${b}}${lowestTerms(k * c, b)}$.`,
              `设 $X$ 服从 $(0, ${b})$ 上的均匀分布，密度为 $f_X(x) = \\frac{1}{${b}}$。令 $Y = \\frac{${c}}{X}$。求概率密度函数 $f_Y(y)$ 在 $y = \\frac{${k * c}}{${b}}$ 处的值。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(1, b), Q.of(1, k), Q.of(k * k * c, b)],
            solution: t(
              `With $x = \\frac{${c}}{y}$, $\\left|\\frac{dx}{dy}\\right| = \\frac{${c}}{y^2}$. So $f_Y(y) = \\frac{${c}}{${b} y^2}$. At $y = \\frac{${k * c}}{${b}}$, $f_Y(y) = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `由 $x = \\frac{${c}}{y}$ 得 $\\left|\\frac{dx}{dy}\\right| = \\frac{${c}}{y^2}$。因此 $f_Y(y) = \\frac{${c}}{${b} y^2}$。在 $y = \\frac{${k * c}}{${b}}$ 处，$f_Y(y) = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 1.4.5 The Distribution Function Method With Many-to-One Transformations
  {
    id: "the-distribution-function-method-with-many-to-one-transformations",
    title: t("The Distribution Function Method With Many-to-One Transformations", "多对一变换的分布函数法"),
    summary: t(
      "When $g$ is many-to-one, the preimage of $\\{Y \\le y\\}$ consists of several pieces: for $Y = X^2$, $P(Y \\le y) = P(-\\sqrt{y} \\le X \\le \\sqrt{y}) = F_X(\\sqrt{y}) - F_X(-\\sqrt{y})$.",
      "当 $g$ 为多对一映射时，$\\{Y \\le y\\}$ 的原像由多段组成：例如对 $Y = X^2$，$P(Y \\le y) = P(-\\sqrt{y} \\le X \\le \\sqrt{y}) = F_X(\\sqrt{y}) - F_X(-\\sqrt{y})$。",
    ),
    prerequisites: ["the-distribution-function-method", "many-to-one-transformations-of-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "many-to-one-cdf-formulation",
        title: t("Formulating the CDF for symmetric quadratic transformations", "求解对称二次变换的累积分布函数"),
        explanation: t(
          "When two original values map to each new value, the event about the new variable becomes an interval of original values on both sides of zero. For $X \\sim \\text{Uniform}(-a, a)$ and $Y = X^2$, the event $\\{Y \\le y\\}$ is $\\{-\\sqrt{y} \\le X \\le \\sqrt{y}\\}$. Thus $F_Y(y) = \\frac{\\sqrt{y} - (-\\sqrt{y})}{2a} = \\frac{\\sqrt{y}}{a}$ for $0 < y < a^2$.",
          "当两个原始值映射到同一个新值时，关于新变量的事件就变成零两侧的一个原始取值区间。若 $X \\sim \\text{Uniform}(-a, a)$ 且 $Y = X^2$，则事件 $\\{Y \\le y\\}$ 即 $\\{-\\sqrt{y} \\le X \\le \\sqrt{y}\\}$。因此在 $0 < y < a^2$ 上，$F_Y(y) = \\frac{\\sqrt{y} - (-\\sqrt{y})}{2a} = \\frac{\\sqrt{y}}{a}$。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(3, 25);
          const m = rng.int(1, a - 1);
          const y0 = m * m;

          return numberProblem({
            prompt: t(
              `Let $X$ be uniformly distributed on $[-${a}, ${a}]$. Define $Y = X^2$. Find the value of the CDF $F_Y(${y0}) = P(Y \\le ${y0})$.`,
              `设 $X$ 服从区间 $[-${a}, ${a}]$ 上的均匀分布。定义 $Y = X^2$。求 $F_Y(${y0}) = P(Y \\le ${y0})$ 的值。`,
            ),
            answer: Q.of(m, a),
            wrong: [Q.of(m, 2 * a), Q.of(y0, 2 * a), Q.of(a - m, a)],
            solution: t(
              `$P(Y \\le ${y0}) = P(-${m} \\le X \\le ${m}) = \\frac{2 \\cdot ${m}}{2 \\cdot ${a}} = \\frac{${m}}{${a}}${lowestTerms(m, a)}$.`,
              `$P(Y \\le ${y0}) = P(-${m} \\le X \\le ${m}) = \\frac{2 \\cdot ${m}}{2 \\cdot ${a}} = \\frac{${m}}{${a}}${lowestTerms(m, a)}$。`,
            ),
          });
        },
      },
      {
        id: "many-to-one-pdf-derivation",
        title: t("Differentiating the CDF for a many-to-one transformation", "对多对一变换的 CDF 求导得到概率密度"),
        explanation: t(
          "Differentiating the cumulative distribution function handles both branches at once, giving the density of the new variable. Differentiating $F_Y(y) = \\frac{\\sqrt{y}}{a}$ gives $f_Y(y) = \\frac{1}{2a\\sqrt{y}}$ for $0 < y < a^2$.",
          "对累积分布函数求导可以同时处理两个分支，从而得到新变量的密度。对 $F_Y(y) = \\frac{\\sqrt{y}}{a}$ 求导得 $f_Y(y) = \\frac{1}{2a\\sqrt{y}}$（$0 < y < a^2$）。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(3, 20);
          const m = rng.int(1, a - 1);
          const y0 = m * m;
          const den = 2 * a * m;

          return numberProblem({
            prompt: t(
              `Let $X$ be uniformly distributed on $[-${a}, ${a}]$ and let $Y = X^2$. Find the value of the PDF $f_Y(y)$ at $y = ${y0}$.`,
              `设 $X$ 服从区间 $[-${a}, ${a}]$ 上的均匀分布，且令 $Y = X^2$。求概率密度函数 $f_Y(y)$ 在 $y = ${y0}$ 处的值。`,
            ),
            answer: Q.of(1, den),
            wrong: [Q.of(1, a * m), Q.of(1, 2 * a), Q.of(1, 4 * a * m)],
            solution: t(
              `$F_Y(y) = \\frac{\\sqrt{y}}{${a}} \\implies f_Y(y) = \\frac{1}{2 \\cdot ${a} \\sqrt{y}}$. At $y = ${y0}$, $f_Y(${y0}) = \\frac{1}{${2 * a} \\cdot ${m}} = \\frac{1}{${den}}${lowestTerms(1, den)}$.`,
              `$F_Y(y) = \\frac{\\sqrt{y}}{${a}} \\implies f_Y(y) = \\frac{1}{2 \\cdot ${a} \\sqrt{y}}$。在 $y = ${y0}$ 处，$f_Y(${y0}) = \\frac{1}{${2 * a} \\cdot ${m}} = \\frac{1}{${den}}${lowestTerms(1, den)}$。`,
            ),
          });
        },
      },
    ],
  },
];
