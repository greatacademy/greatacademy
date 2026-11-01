import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { choiceProblem, numberProblem } from "../problems.ts";

/** Topics for Unit 3: Discrete Probability Distributions (new topics). */
export const probabilityAndStatisticsDiscreteDistributionTopics: TopicDef[] = [
  // 3.9.4 The CDF of the Binomial Distribution
  {
    id: "the-cdf-of-the-binomial-distribution",
    title: t("The CDF of the Binomial Distribution", "二项分布的累积分布函数"),
    summary: t(
      "The cumulative distribution function (CDF) of X ~ Binomial(n, p) gives the probability of at most k successes: F(k) = P(X ≤ k) = ∑_{j=0}^k C(n, j) p^j (1-p)^{n-j}.",
      "二项分布 X ~ Binomial(n, p) 的累积分布函数（CDF）表示至多获得 k 次成功的概率：F(k) = P(X ≤ k) = ∑_{j=0}^k C(n, j) p^j (1-p)^{n-j}。",
    ),
    prerequisites: ["the-binomial-distribution"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-binomial-cdf-small-n",
        title: t("Evaluating the CDF for a symmetric Binomial variable", "计算对称二项分布的累积分布函数值"),
        explanation: t(
          "For X ~ Binomial(n, 1/2), each outcome has probability (1/2)^n, so F(k) = (1/2^n) ∑_{j=0}^k C(n, j).",
          "对于 X ~ Binomial(n, 1/2)，每个可能结果的基本概率为 (1/2)^n，故 F(k) = (1/2^n) ∑_{j=0}^k C(n, j)。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(3, 12);
          const k = rng.int(0, n - 1);

          // Compute combinations C(n, j)
          const comb = (n: number, r: number): number => {
            if (r < 0 || r > n) return 0;
            let res = 1;
            for (let i = 1; i <= r; i++) {
              res = (res * (n - i + 1)) / i;
            }
            return res;
          };

          let sumComb = 0;
          for (let j = 0; j <= k; j++) {
            sumComb += comb(n, j);
          }
          const totalOutcomes = 1 << n; // 2^n

          return numberProblem({
            prompt: t(
              `A fair coin is tossed $n = ${n}$ times. Let $X$ be the number of heads obtained, so $X \\sim \\text{Binomial}\\left(${n}, \\frac{1}{2}\\right)$. Find the probability of getting at most $${k}$ heads, $P(X \\le ${k}) = F(${k})$.`,
              `一枚质地均匀的硬币抛掷 $n = ${n}$ 次。设得到正面朝上的次数为 $X$，则 $X \\sim \\text{Binomial}\\left(${n}, \\frac{1}{2}\\right)$。求至多获得 $${k}$ 次正面朝上的概率 $P(X \\le ${k}) = F(${k})$。`,
            ),
            answer: Q.of(sumComb, totalOutcomes),
            solution: t(
              `The probability is $P(X \\le ${k}) = \\sum_{j=0}^{${k}} \\binom{${n}}{j} \\left(\\frac{1}{2}\\right)^{${n}} = \\frac{1}{${totalOutcomes}} \\sum_{j=0}^{${k}} \\binom{${n}}{j}$. The sum of binomial coefficients is $${sumComb}$, so $F(${k}) = \\frac{${sumComb}}{${totalOutcomes}}$.`,
              `该概率为 $P(X \\le ${k}) = \\sum_{j=0}^{${k}} \\binom{${n}}{j} \\left(\\frac{1}{2}\\right)^{${n}} = \\frac{1}{${totalOutcomes}} \\sum_{j=0}^{${k}} \\binom{${n}}{j}$。二项式系数之和为 $${sumComb}$，因此 $F(${k}) = \\frac{${sumComb}}{${totalOutcomes}}$。`,
            ),
          });
        },
      },
      {
        id: "binomial-tail-probability-via-cdf",
        title: t("Computing tail probabilities using the CDF complement", "利用累积分布函数余概率计算右尾概率"),
        explanation: t(
          "For any integer random variable X, the probability of exceeding k is P(X > k) = 1 - P(X ≤ k) = 1 - F(k).",
          "对任意整值随机变量 X，严格大于 k 的概率由余事件给出：P(X > k) = 1 - P(X ≤ k) = 1 - F(k)。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 12);
          const k = rng.int(1, n - 2);

          const comb = (n: number, r: number): number => {
            if (r < 0 || r > n) return 0;
            let res = 1;
            for (let i = 1; i <= r; i++) {
              res = (res * (n - i + 1)) / i;
            }
            return res;
          };

          let sumComb = 0;
          for (let j = 0; j <= k; j++) {
            sumComb += comb(n, j);
          }
          const totalOutcomes = 1 << n;
          const tailComb = totalOutcomes - sumComb;

          return numberProblem({
            prompt: t(
              `For $X \\sim \\text{Binomial}\\left(${n}, \\frac{1}{2}\\right)$, the cumulative probability is $F(${k}) = P(X \\le ${k}) = \\frac{${sumComb}}{${totalOutcomes}}$. Find the tail probability $P(X > ${k})$.`,
              `设 $X \\sim \\text{Binomial}\\left(${n}, \\frac{1}{2}\\right)$，其累积概率为 $F(${k}) = P(X \\le ${k}) = \\frac{${sumComb}}{${totalOutcomes}}$。求右尾概率 $P(X > ${k})$。`,
            ),
            answer: Q.of(tailComb, totalOutcomes),
            solution: t(
              `Using the complement rule: $P(X > ${k}) = 1 - P(X \\le ${k}) = 1 - \\frac{${sumComb}}{${totalOutcomes}} = \\frac{${tailComb}}{${totalOutcomes}}$.`,
              `利用对立事件概率法则：$P(X > ${k}) = 1 - P(X \\le ${k}) = 1 - \\frac{${sumComb}}{${totalOutcomes}} = \\frac{${tailComb}}{${totalOutcomes}}$。`,
            ),
          });
        },
      },
    ],
  },

  // 3.10.4 The CDF of the Poisson Distribution
  {
    id: "the-cdf-of-the-poisson-distribution",
    title: t("The CDF of the Poisson Distribution", "泊松分布的累积分布函数"),
    summary: t(
      "The CDF of a Poisson random variable X ~ Poisson(λ) gives the probability of observing at most k events: F(k) = P(X ≤ k) = e^{-λ} ∑_{j=0}^k λ^j / j!.",
      "泊松分布 X ~ Poisson(λ) 的累积分布函数（CDF）表示至多观测到 k 次事件的概率：F(k) = P(X ≤ k) = e^{-λ} ∑_{j=0}^k λ^j / j!。",
    ),
    prerequisites: ["the-poisson-distribution"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-poisson-cdf-sum",
        title: t("Evaluating the polynomial factor of a Poisson CDF", "计算泊松累积分布函数的多项式因子"),
        explanation: t(
          "For X ~ Poisson(λ), P(X ≤ 2) = e^{-λ} (1 + λ + λ^2 / 2).",
          "对于 X ~ Poisson(λ)，P(X ≤ 2) = e^{-λ} (1 + λ + λ^2 / 2)。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(1, 30);
          // P(X <= 2) = e^(-lambda) * C where C = 1 + lambda + lambda^2 / 2
          const num = 2 + 2 * lambda + lambda * lambda;
          const den = 2;

          return numberProblem({
            prompt: t(
              `Let $X \\sim \\text{Poisson}(${lambda})$. The cumulative probability $P(X \\le 2)$ can be written in the form $C e^{-${lambda}}$. Find the rational value of the coefficient $C = 1 + \\lambda + \\frac{\\lambda^2}{2}$.`,
              `设 $X \\sim \\text{Poisson}(${lambda})$。累积概率 $P(X \\le 2)$ 可表示为 $C e^{-${lambda}}$ 的形式。求系数 $C = 1 + \\lambda + \\frac{\\lambda^2}{2}$ 的有理数值。`,
            ),
            answer: Q.of(num, den),
            solution: t(
              `$P(X \\le 2) = P(X = 0) + P(X = 1) + P(X = 2) = e^{-${lambda}} \\left(1 + ${lambda} + \\frac{${lambda}^2}{2}\\right) = e^{-${lambda}} \\left( \\frac{2 + ${2 * lambda} + ${lambda * lambda}}{2} \\right) = \\frac{${num}}{2} e^{-${lambda}}$.`,
              `$P(X \\le 2) = P(X = 0) + P(X = 1) + P(X = 2) = e^{-${lambda}} \\left(1 + ${lambda} + \\frac{${lambda}^2}{2}\\right) = \\frac{${num}}{2} e^{-${lambda}}$。`,
            ),
          });
        },
      },
      {
        id: "poisson-at-least-one-event",
        title: t("Calculating the probability of at least one event", "计算至少发生一次事件的概率表达式"),
        explanation: t(
          "For X ~ Poisson(λ), the probability of at least one occurrence is P(X ≥ 1) = 1 - P(X = 0) = 1 - e^{-λ}.",
          "对于 X ~ Poisson(λ)，至少发生一次的概率为 P(X ≥ 1) = 1 - P(X = 0) = 1 - e^{-λ}。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 40);
          const opts = [
            t(`$1 - e^{-${lambda}}$`, `$1 - e^{-${lambda}}$`),
            t(`$e^{-${lambda}}$`, `$e^{-${lambda}}$`),
            t(`$1 - (${lambda} + 1) e^{-${lambda}}$`, `$1 - (${lambda} + 1) e^{-${lambda}}$`),
            t(`$${lambda} e^{-${lambda}}$`, `$${lambda} e^{-${lambda}}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Let $X$ denote the number of requests arriving at a server per minute, modeled as $X \\sim \\text{Poisson}(${lambda})$. What is the probability that at least one request arrives in a given minute, $P(X \\ge 1)$?`,
              `设每分钟到达服务器的请求次数 $X$ 服从泊松分布 $X \\sim \\text{Poisson}(${lambda})$。在给定的一分钟内至少有一个请求到达的概率 $P(X \\ge 1)$ 是什么？`,
            ),
            options,
            correct,
            solution: t(
              `By the complement rule, $P(X \\ge 1) = 1 - P(X = 0) = 1 - \\frac{e^{-${lambda}} ${lambda}^0}{0!} = 1 - e^{-${lambda}}$.`,
              `由对立事件概率公式得：$P(X \\ge 1) = 1 - P(X = 0) = 1 - \\frac{e^{-${lambda}} ${lambda}^0}{0!} = 1 - e^{-${lambda}}$。`,
            ),
          });
        },
      },
    ],
  },

  // 3.12.3 Mean and Variance of the Negative Binomial Distribution
  {
    id: "mean-and-variance-of-the-negative-binomial-distribution",
    title: t("Mean and Variance of the Negative Binomial Distribution", "负二项分布的均值与方差"),
    summary: t(
      "For a negative binomial random variable X ~ NegativeBinomial(r, p) representing the number of trials to achieve r successes, the expected value is E[X] = r / p and the variance is Var(X) = r(1 - p) / p^2.",
      "对于表示获得 r 次成功所需试验次数的负二项分布 X ~ NegativeBinomial(r, p)，其数学期望为 E[X] = r / p，方差为 Var(X) = r(1 - p) / p^2。",
    ),
    prerequisites: ["the-negative-binomial-distribution"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-negative-binomial-mean-and-variance",
        title: t("Evaluating the mean and variance of a negative binomial variable", "计算负二项分布的均值与方差"),
        explanation: t("E[X] = r / p and Var(X) = r(1 - p) / p^2.", "E[X] = r / p 且 Var(X) = r(1 - p) / p^2。"),
        generate: (rng: Rng): Problem => {
          const r = rng.int(2, 10);
          const pDenom = rng.pick([2, 3, 4, 5, 10]);
          const pNum = rng.int(1, pDenom - 1);
          const p = Q.of(pNum, pDenom);
          const askVar = rng.bool();

          const mean = Q.of(r).div(p);
          const variance = Q.of(r).mul(Q.one.sub(p)).div(p.mul(p));
          const ans = askVar ? variance : mean;

          return numberProblem({
            prompt: t(
              `Let $X$ denote the number of independent Bernoulli trials needed to achieve $r = ${r}$ successes, where each trial succeeds with probability $p = ${p.toLatex()}$, so $X \\sim \\text{NegativeBinomial}(${r}, ${p.toLatex()})$. Find the exact rational value of $${askVar ? "\\operatorname{Var}(X)" : "E[X]"}$.`,
              `设 $X$ 表示为了获得 $r = ${r}$ 次成功所需的独立伯努利试验次数，其中每次试验成功的概率为 $p = ${p.toLatex()}$，即 $X \\sim \\text{NegativeBinomial}(${r}, ${p.toLatex()})$。求 $${askVar ? "\\operatorname{Var}(X)" : "E[X]"}$ 的精确有理数值。`,
            ),
            answer: ans,
            solution: t(
              askVar
                ? `$\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2} = \\frac{${r} \\left(1 - ${p.toLatex()}\\right)}{\\left(${p.toLatex()}\\right)^2} = ${ans.toLatex()}$.`
                : `$E[X] = \\frac{r}{p} = \\frac{${r}}{${p.toLatex()}} = ${ans.toLatex()}$.`,
              askVar
                ? `$\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2} = \\frac{${r} \\left(1 - ${p.toLatex()}\\right)}{\\left(${p.toLatex()}\\right)^2} = ${ans.toLatex()}$。`
                : `$E[X] = \\frac{r}{p} = \\frac{${r}}{${p.toLatex()}} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },
];
