import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** Mistake is a value a typical mistake produces, with what to say about it. */
type Mistake = ReturnType<typeof why>;

/** asQ reads a value as an exact number. */
const asQ = (v: Mistake["value"]) => (v instanceof Q ? v : Q.of(v));

/** distinct keeps the mistakes that differ from the answer, each value once. */
const distinct = (answer: Mistake["value"], ms: readonly Mistake[]): Mistake[] =>
  ms.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && ms.findIndex((o) => asQ(o.value).eq(asQ(m.value))) === i);

/** Topics for Unit 3: Discrete Probability Distributions (new topics). */
export const probabilityAndStatisticsDiscreteDistributionTopics: TopicDef[] = [
  // 3.9.4 The CDF of the Binomial Distribution
  {
    id: "the-cdf-of-the-binomial-distribution",
    title: t("The CDF of the Binomial Distribution", "二项分布的累积分布函数"),
    summary: t(
      "The CDF of $X \\sim \\text{Binomial}(n, p)$ gives the probability of at most $k$ successes: $F(k) = P(X \\le k) = \\sum_{j=0}^{k} \\binom{n}{j} p^j (1 - p)^{n - j}$.",
      "二项分布 $X \\sim \\text{Binomial}(n, p)$ 的累积分布函数表示至多 $k$ 次成功的概率：$F(k) = P(X \\le k) = \\sum_{j=0}^{k} \\binom{n}{j} p^j (1 - p)^{n - j}$。",
    ),
    intro: t(
      "A fair coin is tossed $13$ times. The chance of at most one head adds the chances of no heads and of exactly one: $F(1) = \\frac{\\binom{13}{0} + \\binom{13}{1}}{2^{13}} = \\frac{1 + 13}{8192} = \\frac{7}{4096}$.\n\nCheck: by symmetry at most one tail has the same chance, $\\frac{\\binom{13}{13} + \\binom{13}{12}}{8192} = \\frac{14}{8192}$.\n\nIn this lesson we add binomial probabilities into the cumulative distribution function, use its complement for the probability of a tail, and find the most likely number of successes.",
      "一枚均匀硬币抛掷 $13$ 次。至多一次正面的概率等于没有正面和恰好一次正面的概率之和：$F(1) = \\frac{\\binom{13}{0} + \\binom{13}{1}}{2^{13}} = \\frac{1 + 13}{8192} = \\frac{7}{4096}$。\n\n检验：由对称性，至多一次反面的概率相同，为 $\\frac{\\binom{13}{13} + \\binom{13}{12}}{8192} = \\frac{14}{8192}$。\n\n本课我们把二项概率累加成累积分布函数，用它的补求右尾的概率，并求最可能的成功次数。",
    ),
    prerequisites: ["the-binomial-distribution"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-binomial-cdf-small-n",
        title: t("Evaluating the CDF for a symmetric Binomial variable", "计算对称二项分布的累积分布函数值"),
        explanation: t(
          'With a success probability of one half every sequence is equally likely, so cumulative probabilities are sums of binomial coefficients divided by a power of two. For $X \\sim \\text{Binomial}(n, \\frac{1}{2})$, each outcome has probability $\\left(\\frac{1}{2}\\right)^n$, so $F(k) = \\frac{1}{2^n} \\sum_{j=0}^k \\binom{n}{j}$. For $13$ tosses, $F(1) = \\frac{1 + 13}{8192} = \\frac{7}{4096}$.\n\n> **Watch out.** "At most $k$" includes $k$ itself and starts at $0$: do not stop at $k - 1$, and do not take the single term $\\binom{n}{k}$ alone.',
          "当成功概率为二分之一时，每个序列的可能性都相同，所以累积概率等于组合数之和除以 2 的幂。对于 $X \\sim \\text{Binomial}(n, \\frac{1}{2})$，每个结果的概率为 $\\left(\\frac{1}{2}\\right)^n$，故 $F(k) = \\frac{1}{2^n} \\sum_{j=0}^k \\binom{n}{j}$。抛掷 $13$ 次时，$F(1) = \\frac{1 + 13}{8192} = \\frac{7}{4096}$。\n\n> **注意。** “至多 $k$ 次”包括 $k$ 本身，并且从 $0$ 开始：不要只加到 $k - 1$，也不要只取 $\\binom{n}{k}$ 这一项。",
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
          const answer = Q.of(sumComb, totalOutcomes);
          const terms = Array.from({ length: k + 1 }, (_, j) => comb(n, j)).join(" + ");

          return numberProblem({
            prompt: t(
              `A fair coin is tossed $n = ${n}$ times. Let $X$ be the number of heads obtained, so $X \\sim \\text{Binomial}\\left(${n}, \\frac{1}{2}\\right)$. Find the probability of getting at most $${k}$ heads, $P(X \\le ${k}) = F(${k})$.`,
              `一枚质地均匀的硬币抛掷 $n = ${n}$ 次。设得到正面朝上的次数为 $X$，则 $X \\sim \\text{Binomial}\\left(${n}, \\frac{1}{2}\\right)$。求至多获得 $${k}$ 次正面朝上的概率 $P(X \\le ${k}) = F(${k})$。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(sumComb - comb(n, k), totalOutcomes),
                `That stops before $X = ${k}$; "at most $${k}$" includes $${k}$ heads.`,
                `那是加到 $X = ${k}$ 之前就停了；“至多 $${k}$ 次”包括 $${k}$ 次正面。`,
              ),
              why(
                Q.of(comb(n, k), totalOutcomes),
                `That is $P(X = ${k})$ alone; the smaller counts must be added too.`,
                `那只是 $P(X = ${k})$；更少的次数也要加上。`,
              ),
              why(Q.of(totalOutcomes - sumComb, totalOutcomes), `That is $P(X > ${k})$, the other side.`, `那是 $P(X > ${k})$，是另一侧。`),
            ]),
            solution: walked(
              [
                [
                  ["Count the outcomes", "数出结果"],
                  t(
                    `Each of the $2^{${n}} = ${totalOutcomes}$ sequences has probability $\\frac{1}{${totalOutcomes}}$, and $\\binom{${n}}{j}$ of them have $j$ heads.`,
                    `$2^{${n}} = ${totalOutcomes}$ 个序列的概率都是 $\\frac{1}{${totalOutcomes}}$，其中 $\\binom{${n}}{j}$ 个恰有 $j$ 次正面。`,
                  ),
                ],
                [
                  ["Add up to k", "加到 $k$ 为止"],
                  t(
                    `$\\sum_{0 \\le j \\le ${k}} \\binom{${n}}{j} = ${k === 0 ? "1" : `${terms} = ${sumComb}`}$, so $F(${k}) = \\frac{${sumComb}}{${totalOutcomes}}${lowestTerms(sumComb, totalOutcomes)}$.`,
                    `$\\sum_{0 \\le j \\le ${k}} \\binom{${n}}{j} = ${k === 0 ? "1" : `${terms} = ${sumComb}`}$，所以 $F(${k}) = \\frac{${sumComb}}{${totalOutcomes}}${lowestTerms(sumComb, totalOutcomes)}$。`,
                  ),
                ],
              ],
              t(
                `The remaining counts give $P(X > ${k}) = \\frac{${totalOutcomes - sumComb}}{${totalOutcomes}}$, and $${sumComb} + ${totalOutcomes - sumComb} = ${totalOutcomes}$.`,
                `其余次数给出 $P(X > ${k}) = \\frac{${totalOutcomes - sumComb}}{${totalOutcomes}}$，而 $${sumComb} + ${totalOutcomes - sumComb} = ${totalOutcomes}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "binomial-tail-probability-via-cdf",
        title: t("Computing tail probabilities using the CDF complement", "利用累积分布函数余概率计算右尾概率"),
        explanation: t(
          "The probability of exceeding a value is the complement of being at most that value, which is often easier to compute. For any integer random variable $X$, the probability of exceeding $k$ is $P(X > k) = 1 - P(X \\le k) = 1 - F(k)$. For $13$ fair tosses with $F(1) = \\frac{14}{8192}$, $P(X > 1) = \\frac{8178}{8192} = \\frac{4089}{4096}$.\n\n> **Watch out.** $1 - F(k)$ is $P(X > k)$, which leaves out $X = k$; the probability $P(X \\ge k)$ is $1 - F(k - 1)$.",
          "超过某个值的概率是不超过该值的概率的补，后者往往更容易计算。对任意整值随机变量 $X$，严格大于 $k$ 的概率由余事件给出：$P(X > k) = 1 - P(X \\le k) = 1 - F(k)$。均匀硬币抛掷 $13$ 次，$F(1) = \\frac{14}{8192}$，则 $P(X > 1) = \\frac{8178}{8192} = \\frac{4089}{4096}$。\n\n> **注意。** $1 - F(k)$ 是 $P(X > k)$，不含 $X = k$；概率 $P(X \\ge k)$ 是 $1 - F(k - 1)$。",
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
          const answer = Q.of(tailComb, totalOutcomes);

          return numberProblem({
            prompt: t(
              `For $X \\sim \\text{Binomial}\\left(${n}, \\frac{1}{2}\\right)$, the cumulative probability is $F(${k}) = P(X \\le ${k}) = \\frac{${sumComb}}{${totalOutcomes}}$. Find the tail probability $P(X > ${k})$.`,
              `设 $X \\sim \\text{Binomial}\\left(${n}, \\frac{1}{2}\\right)$，其累积概率为 $F(${k}) = P(X \\le ${k}) = \\frac{${sumComb}}{${totalOutcomes}}$。求右尾概率 $P(X > ${k})$。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(sumComb, totalOutcomes),
                `That is $F(${k})$ itself, the probability of at most $${k}$.`,
                `那是 $F(${k})$ 本身，即至多 $${k}$ 的概率。`,
              ),
              why(
                Q.of(tailComb - comb(n, k + 1), totalOutcomes),
                `That is $P(X > ${k + 1})$: it leaves out $X = ${k + 1}$.`,
                `那是 $P(X > ${k + 1})$：漏掉了 $X = ${k + 1}$。`,
              ),
              why(
                Q.of(tailComb + comb(n, k), totalOutcomes),
                `That is $P(X \\ge ${k})$, which also counts $X = ${k}$.`,
                `那是 $P(X \\ge ${k})$，把 $X = ${k}$ 也算进去了。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Use the complement", "用对立事件"],
                  t(
                    `$X > ${k}$ is the complement of $X \\le ${k}$, so $P(X > ${k}) = 1 - F(${k})$.`,
                    `$X > ${k}$ 是 $X \\le ${k}$ 的对立事件，所以 $P(X > ${k}) = 1 - F(${k})$。`,
                  ),
                ],
                [
                  ["Subtract", "相减"],
                  t(
                    `$1 - \\frac{${sumComb}}{${totalOutcomes}} = \\frac{${tailComb}}{${totalOutcomes}}${lowestTerms(tailComb, totalOutcomes)}$.`,
                    `$1 - \\frac{${sumComb}}{${totalOutcomes}} = \\frac{${tailComb}}{${totalOutcomes}}${lowestTerms(tailComb, totalOutcomes)}$。`,
                  ),
                ],
              ],
              t(
                `$\\frac{${sumComb}}{${totalOutcomes}} + \\frac{${tailComb}}{${totalOutcomes}} = 1$, and $\\binom{${n}}{${k + 1}} = ${comb(n, k + 1)}$ of the $${tailComb}$ sequences in the tail have $X = ${k + 1}$, so the tail is at least $\\frac{${comb(n, k + 1)}}{${totalOutcomes}}$.`,
                `$\\frac{${sumComb}}{${totalOutcomes}} + \\frac{${tailComb}}{${totalOutcomes}} = 1$，而右尾的 $${tailComb}$ 个序列中有 $\\binom{${n}}{${k + 1}} = ${comb(n, k + 1)}$ 个满足 $X = ${k + 1}$，所以右尾至少是 $\\frac{${comb(n, k + 1)}}{${totalOutcomes}}$。`,
              ),
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
      "The CDF of $X \\sim \\text{Poisson}(\\lambda)$ gives the probability of at most $k$ events: $F(k) = P(X \\le k) = e^{-\\lambda} \\sum_{j=0}^{k} \\frac{\\lambda^j}{j!}$.",
      "泊松分布 $X \\sim \\text{Poisson}(\\lambda)$ 的累积分布函数表示至多发生 $k$ 次事件的概率：$F(k) = P(X \\le k) = e^{-\\lambda} \\sum_{j=0}^{k} \\frac{\\lambda^j}{j!}$。",
    ),
    intro: t(
      "Calls reach a desk at a Poisson rate of $40$ an hour. The chance of at most one call in an hour is $P(X = 0) + P(X = 1) = e^{-40} + 40e^{-40} = 41e^{-40}$, which is tiny.\n\nCheck: the chance of at least two calls is $1 - 41e^{-40}$, and the two add to $1$.\n\nIn this lesson we add Poisson probabilities into the cumulative distribution function, find the chance of at least one event, and relate Poisson counts to exponential waiting times.",
      "电话以每小时 $40$ 次的泊松速率打到服务台。一小时内至多一个电话的概率为 $P(X = 0) + P(X = 1) = e^{-40} + 40e^{-40} = 41e^{-40}$，非常小。\n\n检验：至少两个电话的概率为 $1 - 41e^{-40}$，两者之和为 $1$。\n\n本课我们把泊松概率累加成累积分布函数，求至少发生一次事件的概率，并把泊松计数与指数等待时间联系起来。",
    ),
    prerequisites: ["the-poisson-distribution"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-poisson-cdf-sum",
        title: t("Evaluating the polynomial factor of a Poisson CDF", "计算泊松累积分布函数的多项式因子"),
        explanation: t(
          "Each Poisson probability shares the same exponential factor, so a cumulative probability is that factor times a short sum of powers over factorials. For $X \\sim \\text{Poisson}(\\lambda)$, $P(X \\le 2) = e^{-\\lambda}\\left(1 + \\lambda + \\frac{\\lambda^2}{2}\\right)$. For $\\lambda = 40$ the factor is $1 + 40 + \\frac{1600}{2} = 841$.\n\n> **Watch out.** Divide $\\lambda^2$ by $2! = 2$, and include the term $1$ for $X = 0$: the sum runs over $X = 0, 1, 2$.",
          "每个泊松概率都有相同的指数因子，所以累积概率是这个因子乘以几项幂除以阶乘的和。对于 $X \\sim \\text{Poisson}(\\lambda)$，$P(X \\le 2) = e^{-\\lambda}\\left(1 + \\lambda + \\frac{\\lambda^2}{2}\\right)$。当 $\\lambda = 40$ 时，这个因子为 $1 + 40 + \\frac{1600}{2} = 841$。\n\n> **注意。** $\\lambda^2$ 要除以 $2! = 2$，还要包括 $X = 0$ 对应的项 $1$：求和遍及 $X = 0, 1, 2$。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(1, 30);
          // P(X <= 2) = e^(-lambda) * C where C = 1 + lambda + lambda^2 / 2
          const num = 2 + 2 * lambda + lambda * lambda;
          const den = 2;
          const answer = Q.of(num, den);

          return numberProblem({
            prompt: t(
              `Let $X \\sim \\text{Poisson}(${lambda})$. The cumulative probability $P(X \\le 2)$ can be written in the form $C e^{-${lambda}}$. Find the rational value of the coefficient $C$.`,
              `设 $X \\sim \\text{Poisson}(${lambda})$。累积概率 $P(X \\le 2)$ 可表示为 $C e^{-${lambda}}$ 的形式。求系数 $C$ 的有理数值。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(1 + lambda + lambda * lambda, "That forgets to divide the last term by $2! = 2$.", "那是忘了把最后一项除以 $2! = 2$。"),
              why(1 + lambda, "That stops at $X = 1$ and leaves out $X = 2$.", "那是加到 $X = 1$ 就停了，漏掉了 $X = 2$。"),
              why(
                Q.of(lambda * lambda, 2),
                "That is the factor of $P(X = 2)$ alone; $X = 0$ and $X = 1$ count too.",
                "那只是 $P(X = 2)$ 的因子；$X = 0$ 和 $X = 1$ 也要算。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Write the three terms", "写出三项"],
                  t(
                    `$P(X \\le 2) = P(X = 0) + P(X = 1) + P(X = 2) = e^{-${lambda}} \\left(1 + ${lambda} + \\frac{${lambda * lambda}}{2}\\right)$.`,
                    `$P(X \\le 2) = P(X = 0) + P(X = 1) + P(X = 2) = e^{-${lambda}} \\left(1 + ${lambda} + \\frac{${lambda * lambda}}{2}\\right)$。`,
                  ),
                ],
                [
                  ["Add over a common denominator", "通分相加"],
                  t(
                    `$C = \\frac{2 + ${2 * lambda} + ${lambda * lambda}}{2} = \\frac{${num}}{2}${lowestTerms(num, 2)}$.`,
                    `$C = \\frac{2 + ${2 * lambda} + ${lambda * lambda}}{2} = \\frac{${num}}{2}${lowestTerms(num, 2)}$。`,
                  ),
                ],
              ],
              t(
                `$C$ is part of the full sum $\\sum_{j \\ge 0} \\frac{${lambda}^j}{j!} = ${lambda === 1 ? "e" : `e^{${lambda}}`}$, so $C e^{-${lambda}}$ is a probability below $1$.`,
                `$C$ 是完整和 $\\sum_{j \\ge 0} \\frac{${lambda}^j}{j!} = ${lambda === 1 ? "e" : `e^{${lambda}}`}$ 的一部分，所以 $C e^{-${lambda}}$ 是小于 $1$ 的概率。`,
              ),
            ),
          });
        },
      },
      {
        id: "poisson-at-least-one-event",
        title: t("Calculating the probability of at least one event", "计算至少发生一次事件的概率表达式"),
        explanation: t(
          "Rather than add up every positive count, subtract the probability of zero events from one. For $X \\sim \\text{Poisson}(\\lambda)$, the probability of at least one occurrence is $P(X \\ge 1) = 1 - P(X = 0) = 1 - e^{-\\lambda}$. For $\\lambda = \\frac{1}{2}$ it is $1 - e^{-1/2}$.\n\n> **Watch out.** $e^{-\\lambda}$ is the chance of no events, so it must be taken from $1$. And $\\lambda e^{-\\lambda}$ is the chance of exactly one event, not of at least one.",
          "不必把所有正次数的概率加起来，只需用 1 减去零次事件的概率。对于 $X \\sim \\text{Poisson}(\\lambda)$，至少发生一次的概率为 $P(X \\ge 1) = 1 - P(X = 0) = 1 - e^{-\\lambda}$。当 $\\lambda = \\frac{1}{2}$ 时，它是 $1 - e^{-1/2}$。\n\n> **注意。** $e^{-\\lambda}$ 是没有事件发生的概率，要用 $1$ 减去它。而 $\\lambda e^{-\\lambda}$ 是恰好发生一次的概率，不是至少一次的概率。",
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

          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $X$ denote the number of requests arriving at a server per minute, modeled as $X \\sim \\text{Poisson}(${lambda})$. What is the probability that at least one request arrives in a given minute, $P(X \\ge 1)$?`,
                `设每分钟到达服务器的请求次数 $X$ 服从泊松分布 $X \\sim \\text{Poisson}(${lambda})$。在给定的一分钟内至少有一个请求到达的概率 $P(X \\ge 1)$ 是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Use the complement", "用对立事件"],
                    t(
                      "At least one request is the complement of no requests, so $P(X \\ge 1) = 1 - P(X = 0)$.",
                      "至少一个请求是没有请求的对立事件，所以 $P(X \\ge 1) = 1 - P(X = 0)$。",
                    ),
                  ],
                  [
                    ["Find the chance of none", "求没有请求的概率"],
                    t(
                      `$P(X = 0) = \\frac{e^{-${lambda}} ${lambda}^0}{0!} = e^{-${lambda}}$, so $P(X \\ge 1) = 1 - e^{-${lambda}}$.`,
                      `$P(X = 0) = \\frac{e^{-${lambda}} ${lambda}^0}{0!} = e^{-${lambda}}$，所以 $P(X \\ge 1) = 1 - e^{-${lambda}}$。`,
                    ),
                  ],
                ],
                t(
                  `With a mean of $${lambda}$ requests a minute, a minute with none is rare, and $1 - e^{-${lambda}}$ is indeed close to $1$.`,
                  `平均每分钟有 $${lambda}$ 个请求，没有请求的一分钟很少见，而 $1 - e^{-${lambda}}$ 确实接近 $1$。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "This is the chance of no requests, $P(X = 0)$; it must be taken from $1$.",
                "这是没有请求的概率 $P(X = 0)$；要用 $1$ 减去它。",
              ],
              [
                opts[2]!.en,
                "This also takes away $P(X = 1)$, so it is the chance of at least two requests.",
                "这把 $P(X = 1)$ 也减去了，所以是至少两个请求的概率。",
              ],
              [opts[3]!.en, "This is the chance of exactly one request, $P(X = 1)$.", "这是恰好一个请求的概率 $P(X = 1)$。"],
            ],
          );
        },
      },
    ],
  },

  // 3.12.3 Mean and Variance of the Negative Binomial Distribution
  {
    id: "mean-and-variance-of-the-negative-binomial-distribution",
    title: t("Mean and Variance of the Negative Binomial Distribution", "负二项分布的均值与方差"),
    summary: t(
      "For a negative binomial random variable $X \\sim \\text{NB}(r, p)$, the number of trials needed for $r$ successes, $E[X] = \\frac{r}{p}$ and $\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2}$.",
      "对于负二项随机变量 $X \\sim \\text{NB}(r, p)$（获得 $r$ 次成功所需的试验次数），$E[X] = \\frac{r}{p}$，$\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2}$。",
    ),
    intro: t(
      "A die is rolled until $12$ sixes have come up. Each six takes $6$ rolls on average, so the expected number of rolls is $E[X] = \\frac{12}{1/6} = 72$, and the variance is $\\frac{12 \\cdot \\frac{5}{6}}{\\left(\\frac{1}{6}\\right)^2} = 360$.\n\nCheck: the variance is $\\frac{1 - p}{p} = 5$ times the mean, and $5 \\cdot 72 = 360$.\n\nIn this lesson we find the mean and variance of a negative binomial variable, recover its parameters from them, and count failures instead of trials.",
      "掷一颗骰子，直到出现 $12$ 次六点为止。每次六点平均需要掷 $6$ 次，所以掷骰次数的期望为 $E[X] = \\frac{12}{1/6} = 72$，方差为 $\\frac{12 \\cdot \\frac{5}{6}}{\\left(\\frac{1}{6}\\right)^2} = 360$。\n\n检验：方差是均值的 $\\frac{1 - p}{p} = 5$ 倍，而 $5 \\cdot 72 = 360$。\n\n本课我们求负二项变量的均值和方差，由它们反求参数，并改为计数失败次数而不是试验次数。",
    ),
    prerequisites: ["the-negative-binomial-distribution"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-negative-binomial-mean-and-variance",
        title: t("Evaluating the mean and variance of a negative binomial variable", "计算负二项分布的均值与方差"),
        explanation: t(
          "Identify the number of successes needed and the success probability, then multiply the geometric mean and variance by the number of successes. For the number of trials $X$ needed to reach $r$ successes, $E[X] = \\frac{r}{p}$ and $\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2}$. For $r = 12$ and $p = \\frac{1}{6}$, $E[X] = 72$ and $\\operatorname{Var}(X) = 360$.\n\n> **Watch out.** Divide by $p$, do not multiply: rare successes need more trials. And the variance has $p^2$ in the denominator, not $p$.",
          "确定所需的成功次数和成功概率，再把几何分布的均值和方差乘以成功次数。对于获得 $r$ 次成功所需的试验次数 $X$，$E[X] = \\frac{r}{p}$，$\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2}$。当 $r = 12$，$p = \\frac{1}{6}$ 时，$E[X] = 72$，$\\operatorname{Var}(X) = 360$。\n\n> **注意。** 要除以 $p$，而不是乘以 $p$：成功越少见，需要的试验越多。方差的分母是 $p^2$，不是 $p$。",
        ),
        generate: (rng: Rng): Problem => {
          const r = rng.int(2, 10);
          const pDenom = rng.pick([2, 3, 4, 5, 10]);
          const pNum = rng.int(1, pDenom - 1);
          const p = Q.of(pNum, pDenom);
          const askVar = rng.bool();

          const mean = Q.of(r).div(p);
          const q = Q.one.sub(p);
          const variance = Q.of(r).mul(q).div(p.mul(p));
          const ans = askVar ? variance : mean;
          const failures = Q.of(r).mul(q).div(p);
          const inv = Q.one.div(p);

          return numberProblem({
            prompt: t(
              `Let $X$ denote the number of independent Bernoulli trials needed to achieve $r = ${r}$ successes, where each trial succeeds with probability $p = ${p.toLatex()}$, so $X \\sim \\text{NegativeBinomial}(${r}, ${p.toLatex()})$. Find the exact rational value of $${askVar ? "\\operatorname{Var}(X)" : "E[X]"}$.`,
              `设 $X$ 表示为了获得 $r = ${r}$ 次成功所需的独立伯努利试验次数，其中每次试验成功的概率为 $p = ${p.toLatex()}$，即 $X \\sim \\text{NegativeBinomial}(${r}, ${p.toLatex()})$。求 $${askVar ? "\\operatorname{Var}(X)" : "E[X]"}$ 的精确有理数值。`,
            ),
            answer: ans,
            mistakes: distinct(
              ans,
              askVar
                ? [
                    why(mean, "That is the mean $\\frac{r}{p}$, not the variance.", "那是均值 $\\frac{r}{p}$，不是方差。"),
                    why(
                      failures,
                      "That divides by $p$ once; the variance has $p^2$ in the denominator.",
                      "那只除以了一次 $p$；方差的分母是 $p^2$。",
                    ),
                    why(mean.mul(mean), "That squares the mean, which is not the variance.", "那是均值的平方，不是方差。"),
                  ]
                : [
                    why(
                      Q.of(r).mul(p),
                      "That multiplies by $p$; rare successes need more trials, so divide by $p$.",
                      "那是乘以 $p$；成功越少见，需要的试验越多，所以要除以 $p$。",
                    ),
                    why(
                      failures,
                      "That is the expected number of failures, $\\frac{r(1 - p)}{p}$; the trials also include the $r$ successes.",
                      "那是失败次数的期望 $\\frac{r(1 - p)}{p}$；试验次数还包括 $r$ 次成功。",
                    ),
                    why(
                      inv,
                      "That is the mean for a single success; it must be multiplied by $r$.",
                      "那是一次成功所需的平均次数；还要乘以 $r$。",
                    ),
                  ],
            ),
            solution: walked(
              askVar
                ? [
                    [
                      ["Recall the formula", "写出公式"],
                      t(
                        `$\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2}$ with $r = ${r}$, $1 - p = ${q.toLatex()}$ and $p^2 = ${p.mul(p).toLatex()}$.`,
                        `$\\operatorname{Var}(X) = \\frac{r(1 - p)}{p^2}$，其中 $r = ${r}$，$1 - p = ${q.toLatex()}$，$p^2 = ${p.mul(p).toLatex()}$。`,
                      ),
                    ],
                    [
                      ["Compute", "计算"],
                      t(
                        `$\\operatorname{Var}(X) = \\frac{${r} \\cdot ${q.toLatex()}}{${p.mul(p).toLatex()}} = ${ans.toLatex()}$.`,
                        `$\\operatorname{Var}(X) = \\frac{${r} \\cdot ${q.toLatex()}}{${p.mul(p).toLatex()}} = ${ans.toLatex()}$。`,
                      ),
                    ],
                  ]
                : [
                    [
                      ["Recall the formula", "写出公式"],
                      t(
                        `Each success takes $\\frac{1}{p} = ${inv.toLatex()}$ trials on average, and $E[X] = \\frac{r}{p}$.`,
                        `每次成功平均需要 $\\frac{1}{p} = ${inv.toLatex()}$ 次试验，而 $E[X] = \\frac{r}{p}$。`,
                      ),
                    ],
                    [
                      ["Compute", "计算"],
                      t(
                        `$E[X] = ${r} \\cdot ${inv.toLatex()} = ${ans.toLatex()}$.`,
                        `$E[X] = ${r} \\cdot ${inv.toLatex()} = ${ans.toLatex()}$。`,
                      ),
                    ],
                  ],
              askVar
                ? t(
                    `The variance is $\\frac{1 - p}{p} = ${q.div(p).toLatex()}$ times the mean $${mean.toLatex()}$, which gives $${ans.toLatex()}$ again.`,
                    `方差是均值 $${mean.toLatex()}$ 的 $\\frac{1 - p}{p} = ${q.div(p).toLatex()}$ 倍，结果同样是 $${ans.toLatex()}$。`,
                  )
                : t(
                    `The trials are the $${r}$ successes plus $\\frac{r(1 - p)}{p} = ${failures.toLatex()}$ failures on average, and $${r} + ${failures.toLatex()} = ${ans.toLatex()}$.`,
                    `试验次数是 $${r}$ 次成功加上平均 $\\frac{r(1 - p)}{p} = ${failures.toLatex()}$ 次失败，而 $${r} + ${failures.toLatex()} = ${ans.toLatex()}$。`,
                  ),
            ),
          });
        },
      },
      {
        id: "recovering-the-parameters-from-the-mean-and-variance",
        title: t("Recovering the parameters from the mean and variance", "由均值与方差反求参数"),
        explanation: t(
          "The mean and the variance together determine a negative binomial distribution. Dividing them cancels $r$:\n\n$$\\frac{\\operatorname{Var}(X)}{E[X]} = \\frac{r(1 - p)/p^{2}}{r/p} = \\frac{1 - p}{p},$$\n\nso $\\frac{1}{p} = 1 + \\frac{\\operatorname{Var}(X)}{E[X]}$. Once $p$ is known, $r = p \\cdot E[X]$. For $E[X] = 96$ and $\\operatorname{Var}(X) = 672$: $\\frac{1}{p} = 1 + 7 = 8$, so $p = \\frac{1}{8}$ and $r = 12$.\n\n> **Watch out.** The ratio $\\frac{\\operatorname{Var}(X)}{E[X]}$ is $\\frac{1 - p}{p}$, not $p$: add $1$ and invert. And $r$ is $p$ times the mean, not the mean itself.",
          "均值和方差一起确定一个负二项分布。两者相除可以消去 $r$：\n\n$$\\frac{\\operatorname{Var}(X)}{E[X]} = \\frac{r(1 - p)/p^{2}}{r/p} = \\frac{1 - p}{p},$$\n\n所以 $\\frac{1}{p} = 1 + \\frac{\\operatorname{Var}(X)}{E[X]}$。求出 $p$ 后，$r = p \\cdot E[X]$。例如 $E[X] = 96$，$\\operatorname{Var}(X) = 672$：$\\frac{1}{p} = 1 + 7 = 8$，所以 $p = \\frac{1}{8}$，$r = 12$。\n\n> **注意。** 比值 $\\frac{\\operatorname{Var}(X)}{E[X]}$ 是 $\\frac{1 - p}{p}$，不是 $p$：要加 $1$ 再取倒数。而 $r$ 是 $p$ 乘以均值，不是均值本身。",
        ),
        generate: (rng: Rng): Problem => {
          const r = rng.int(2, 10);
          const pDenom = rng.pick([2, 3, 4, 5, 6, 10]);
          const pNum = rng.int(1, pDenom - 1);
          const p = Q.of(pNum, pDenom);
          const mean = Q.of(r).div(p);
          const variance = Q.of(r).mul(Q.one.sub(p)).div(p.mul(p));
          const ratio = variance.div(mean);
          const askR = rng.bool();
          const answer = askR ? Q.of(r) : p;
          return numberProblem({
            prompt: t(
              `$X \\sim \\text{NegativeBinomial}(r, p)$ counts the trials needed for $r$ successes, with $E[X] = ${mean.toLatex()}$ and $\\operatorname{Var}(X) = ${variance.toLatex()}$. Find $${askR ? "r" : "p"}$.`,
              `$X \\sim \\text{NegativeBinomial}(r, p)$ 表示获得 $r$ 次成功所需的试验次数，$E[X] = ${mean.toLatex()}$，$\\operatorname{Var}(X) = ${variance.toLatex()}$。求 $${askR ? "r" : "p"}$。`,
            ),
            answer: askR ? r : p,
            mistakes: distinct(
              answer,
              askR
                ? [
                    why(
                      mean.mul(Q.one.sub(p)),
                      "That multiplies the mean by $1 - p$; $r$ is $p$ times the mean.",
                      "那是用均值乘以 $1 - p$；$r$ 是 $p$ 乘以均值。",
                    ),
                    why(
                      mean,
                      "That is the mean itself, the expected number of trials, not the number of successes.",
                      "那是均值本身，即试验次数的期望，不是成功次数。",
                    ),
                    why(
                      mean.mul(p).mul(p),
                      "That multiplies the mean by $p$ twice; once is enough.",
                      "那是用均值乘了两次 $p$；乘一次就够了。",
                    ),
                    why(
                      Q.one.div(p),
                      "That is $\\frac{1}{p}$, the trials for one success, not $r$.",
                      "那是 $\\frac{1}{p}$，即一次成功所需的试验次数，不是 $r$。",
                    ),
                  ]
                : [
                    why(
                      Q.one.div(Q.one.add(mean.div(variance))),
                      "That inverts the ratio: divide the variance by the mean, not the mean by the variance.",
                      "那是把比值颠倒了：应当用方差除以均值，而不是用均值除以方差。",
                    ),
                    why(
                      ratio,
                      "That is the ratio $\\frac{1 - p}{p}$; add $1$ and invert to get $p$.",
                      "那是比值 $\\frac{1 - p}{p}$；加 $1$ 再取倒数才是 $p$。",
                    ),
                    why(Q.one.sub(p), "That is the failure probability $1 - p$.", "那是失败的概率 $1 - p$。"),
                  ],
            ),
            solution: walked(
              [
                [
                  ["Divide the variance by the mean", "用方差除以均值"],
                  t(
                    `$\\frac{\\operatorname{Var}(X)}{E[X]} = \\frac{${variance.toLatex()}}{${mean.toLatex()}} = ${ratio.toLatex()} = \\frac{1 - p}{p}$, which cancels $r$.`,
                    `$\\frac{\\operatorname{Var}(X)}{E[X]} = \\frac{${variance.toLatex()}}{${mean.toLatex()}} = ${ratio.toLatex()} = \\frac{1 - p}{p}$，这样就消去了 $r$。`,
                  ),
                ],
                [
                  ["Solve for p", "解出 $p$"],
                  t(
                    `$\\frac{1}{p} = 1 + ${ratio.toLatex()} = ${Q.one.div(p).toLatex()}$, so $p = ${p.toLatex()}$.${askR ? ` Then $r = p \\cdot E[X] = ${p.toLatex()} \\cdot ${mean.toLatex()} = ${r}$.` : ""}`,
                    `$\\frac{1}{p} = 1 + ${ratio.toLatex()} = ${Q.one.div(p).toLatex()}$，所以 $p = ${p.toLatex()}$。${askR ? `于是 $r = p \\cdot E[X] = ${p.toLatex()} \\cdot ${mean.toLatex()} = ${r}$。` : ""}`,
                  ),
                ],
              ],
              t(
                `With $r = ${r}$ and $p = ${p.toLatex()}$: $\\frac{r}{p} = ${mean.toLatex()}$ and $\\frac{r(1 - p)}{p^2} = ${variance.toLatex()}$, the given mean and variance.`,
                `取 $r = ${r}$，$p = ${p.toLatex()}$：$\\frac{r}{p} = ${mean.toLatex()}$，$\\frac{r(1 - p)}{p^2} = ${variance.toLatex()}$，正是给定的均值和方差。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
