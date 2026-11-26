import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, Q } from "@ga/subject-math";
import { probabilityDrawings1 } from "../explanation-drawings-probability-and-statistics-1.ts";
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
    intro: t(
      "A count $X \\sim \\text{Binomial}(400, \\frac{1}{2})$ has mean $200$ and variance $100$. To approximate $P(X \\le 210)$, include all of the bar at $210$: $P(Y \\le 210.5)$ with $Y \\sim N(200, 100)$, so $z = \\frac{210.5 - 200}{10} = 1.05$.\n\nCheck: $np = 200$ and $n(1 - p) = 200$ are both at least $5$, so the normal approximation is reasonable.\n\nIn this lesson we correct for continuity, match the mean and variance of the binomial, read probabilities from the normal table and decide where a correction cuts.",
      "计数 $X \\sim \\text{Binomial}(400, \\frac{1}{2})$ 的均值为 $200$，方差为 $100$。为近似 $P(X \\le 210)$，要包含 $210$ 处的整根柱子：用 $Y \\sim N(200, 100)$ 的 $P(Y \\le 210.5)$，所以 $z = \\frac{210.5 - 200}{10} = 1.05$。\n\n检验：$np = 200$ 与 $n(1 - p) = 200$ 都不小于 $5$，所以正态近似是合理的。\n\n本课我们做连续性校正，使正态分布与二项分布的均值和方差相同，用正态分布表求概率，并判断校正的分界点。",
    ),
    prerequisites: ["the-normal-distribution", "the-binomial-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "continuity-correction-intervals",
        title: t("Applying continuity correction to discrete events", "对离散事件应用连续性校正"),
        explanation: t(
          "When a continuous distribution approximates whole number counts, extend each boundary by one half so that every included count keeps its full interval. For discrete $X$, $P(X \\le k)$ is approximated by $P(Y \\le k + 0.5)$ and $P(X \\ge k)$ by $P(Y \\ge k - 0.5)$ for continuous normal $Y$. So $P(X \\le 150)$ becomes $P(Y \\le 150.5)$, and $P(X \\ge 150)$ becomes $P(Y \\ge 149.5)$.\n\n> **Watch out.** The correction always moves the boundary outward, away from the event, so that the integer $k$ stays inside: up by a half for $\\le$, down by a half for $\\ge$.",
          "当用连续分布近似整数计数时，把每个边界延伸二分之一，使每个被包含的计数保有完整的区间。对于离散随机变量 $X$，$P(X \\le k)$ 用连续正态变量 $Y$ 的 $P(Y \\le k + 0.5)$ 近似，$P(X \\ge k)$ 用 $P(Y \\ge k - 0.5)$ 近似。所以 $P(X \\le 150)$ 变为 $P(Y \\le 150.5)$，$P(X \\ge 150)$ 变为 $P(Y \\ge 149.5)$。\n\n> **注意。** 校正总是把边界向事件外侧移动，使整数 $k$ 仍在事件内：对 $\\le$ 向上移一半，对 $\\ge$ 向下移一半。",
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

          const sign = isAtMost ? "\\le" : "\\ge";
          return reasoned(
            choiceProblem({
              prompt: t(
                `When approximating the discrete binomial random variable $X$ with a continuous normal random variable $Y$, what is the continuity-corrected event corresponding to $P(${discreteStr})$?`,
                `当用连续正态随机变量 $Y$ 近似离散二项随机变量 $X$ 时，对应于 $P(${discreteStr})$ 的连续性校正事件是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Find the edge integer", "找到边上的整数"],
                    t(
                      `The event $${discreteStr}$ includes the integer $${k}$, whose bar covers $[${k - 1}.5, ${k}.5]$.`,
                      `事件 $${discreteStr}$ 包含整数 $${k}$，它的柱子覆盖 $[${k - 1}.5, ${k}.5]$。`,
                    ),
                  ],
                  [
                    ["Extend outward", "向外延伸"],
                    t(
                      isAtMost
                        ? `So the right endpoint extends to $k + 0.5 = ${k}.5$, and $P(X \\le ${k}) \\approx P(Y \\le ${correctBoundary})$.`
                        : `So the left endpoint extends down to $k - 0.5 = ${k - 1}.5$, and $P(X \\ge ${k}) \\approx P(Y \\ge ${correctBoundary})$.`,
                      isAtMost
                        ? `所以右端点扩展至 $k + 0.5 = ${k}.5$，$P(X \\le ${k}) \\approx P(Y \\le ${correctBoundary})$。`
                        : `所以左端点向下扩展至 $k - 0.5 = ${k - 1}.5$，$P(X \\ge ${k}) \\approx P(Y \\ge ${correctBoundary})$。`,
                    ),
                  ],
                ],
                t(
                  `The boundary $${correctBoundary}$ is half a unit from $${k}$ on the side away from the event, so the whole bar of $${k}$ is counted and no bar of $${isAtMost ? k + 1 : k - 1}$ is.`,
                  `边界 $${correctBoundary}$ 在 $${k}$ 远离事件的一侧，相距半个单位，所以 $${k}$ 的整根柱子被计入，而 $${isAtMost ? k + 1 : k - 1}$ 的柱子没有。`,
                ),
              ),
            }),
            [
              [
                `$Y ${sign} ${alt1}$`,
                `That moves the boundary inward, so the bar of $${k}$ is left out.`,
                `那是把边界向内移动，$${k}$ 的柱子被漏掉了。`,
              ],
              [
                `$Y ${sign} ${alt2}$`,
                `That makes no correction, so only half of the bar of $${k}$ is counted.`,
                `那没有做校正，$${k}$ 的柱子只算了一半。`,
              ],
              [
                `$Y ${sign} ${alt3}$`,
                `That moves the boundary a whole unit and a half, so it also takes in the bar of $${isAtMost ? k + 1 : k - 1}$.`,
                `那把边界移动了一个半单位，连 $${isAtMost ? k + 1 : k - 1}$ 的柱子也算进去了。`,
              ],
            ],
          );
        },
      },
      {
        id: "normal-approximation-parameters",
        title: t("Computing mean and variance for normal approximation of binomial", "计算二项分布正态近似的均值与方差"),
        explanation: t(
          "The approximating normal distribution is chosen to have the same mean and variance as the binomial it replaces. For $X \\sim \\text{Binomial}(n, p)$, the approximating normal distribution has mean $\\mu = np$ and variance $\\sigma^2 = np(1 - p)$. For $\\text{Binomial}(1000, \\frac{1}{10})$, $\\mu = 100$ and $\\sigma^2 = 100 \\cdot \\frac{9}{10} = 90$.\n\n> **Watch out.** The variance has the extra factor $1 - p$, so it is smaller than the mean; it is not $np$, and it is not $n$.",
          "近似的正态分布要选择与被替代的二项分布具有相同的均值和方差。对于 $X \\sim \\text{Binomial}(n, p)$，近似正态分布的均值为 $\\mu = np$，方差为 $\\sigma^2 = np(1 - p)$。对于 $\\text{Binomial}(1000, \\frac{1}{10})$，$\\mu = 100$，$\\sigma^2 = 100 \\cdot \\frac{9}{10} = 90$。\n\n> **注意。** 方差多一个因子 $1 - p$，所以比均值小；它不是 $np$，也不是 $n$。",
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
              `A random variable $X \\sim \\text{Binomial}\\left(${n}, \\frac{${pFrac.num}}{${pFrac.den}}\\right)$ is approximated by a normal distribution $N(\\mu, \\sigma^2)$. Find the variance $\\sigma^2$.`,
              `随机变量 $X \\sim \\text{Binomial}\\left(${n}, \\frac{${pFrac.num}}{${pFrac.den}}\\right)$ 用正态分布 $N(\\mu, \\sigma^2)$ 近似。求方差 $\\sigma^2$。`,
            ),
            answer: variance,
            mistakes: distinct(variance, [
              why(mean, "That is the mean $np$; the variance has the extra factor $1 - p$.", "那是均值 $np$；方差还要乘以因子 $1 - p$。"),
              why(
                variance * pFrac.den,
                `That multiplies by $${pFrac.den - pFrac.num}$ without dividing by $${pFrac.den}$, the denominator of $1 - p$.`,
                `那是乘了 $${pFrac.den - pFrac.num}$，却没有除以 $1 - p$ 的分母 $${pFrac.den}$。`,
              ),
              why(n, "That is the number of trials, not a variance.", "那是试验次数，不是方差。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the mean", "求均值"],
                  t(
                    `$\\mu = np = ${n} \\cdot \\frac{${pFrac.num}}{${pFrac.den}} = ${mean}$.`,
                    `$\\mu = np = ${n} \\cdot \\frac{${pFrac.num}}{${pFrac.den}} = ${mean}$。`,
                  ),
                ],
                [
                  ["Multiply by $1 - p$", "乘以 $1 - p$"],
                  t(
                    `$\\sigma^2 = np(1 - p) = ${mean} \\cdot \\frac{${pFrac.den - pFrac.num}}{${pFrac.den}} = ${variance}$.`,
                    `$\\sigma^2 = np(1 - p) = ${mean} \\cdot \\frac{${pFrac.den - pFrac.num}}{${pFrac.den}} = ${variance}$。`,
                  ),
                ],
              ],
              t(
                `$1 - p = \\frac{${pFrac.den - pFrac.num}}{${pFrac.den}}$ is less than $1$, so the variance $${variance}$ is less than the mean $${mean}$, as it must be for a binomial.`,
                `$1 - p = \\frac{${pFrac.den - pFrac.num}}{${pFrac.den}}$ 小于 $1$，所以方差 $${variance}$ 小于均值 $${mean}$，二项分布必然如此。`,
              ),
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
    intro: t(
      "A Poisson count with mean $\\lambda = 400$ also has variance $400$, so it is close to $N(400, 400)$ with standard deviation $20$. For $P(X \\le 430)$, correct to $430.5$ and standardize: $z = \\frac{430.5 - 400}{20} = 1.525$.\n\nCheck: the standard deviation squared is $20^2 = 400$, the variance of the Poisson count.\n\nIn this lesson we find the standard deviation of the approximating normal, build the corrected $z$-score and read a Poisson tail from the normal table.",
      "均值为 $\\lambda = 400$ 的泊松计数方差也是 $400$，所以它接近标准差为 $20$ 的 $N(400, 400)$。求 $P(X \\le 430)$ 时，校正到 $430.5$ 再标准化：$z = \\frac{430.5 - 400}{20} = 1.525$。\n\n检验：标准差的平方 $20^2 = 400$，正是泊松计数的方差。\n\n本课我们求近似正态分布的标准差，构造校正后的 $z$ 值，并用正态分布表求泊松分布的尾部概率。",
    ),
    prerequisites: ["normal-approximations-of-binomial-distributions", "the-poisson-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "poisson-normal-approx-standard-deviation",
        title: t("Standard deviation of the approximating normal distribution", "近似正态分布的标准差"),
        explanation: t(
          "A Poisson variable with a large rate looks roughly normal, with the same mean and variance, so its standard deviation is the square root of the rate. For $X \\sim \\text{Poisson}(\\lambda)$, both the mean and the variance are $\\lambda$, so the standard deviation is $\\sigma = \\sqrt{\\lambda}$. For $\\text{Poisson}(3600)$, $\\sigma = \\sqrt{3600} = 60$.\n\n> **Watch out.** The rate $\\lambda$ is the variance, not the standard deviation: take its square root, and do not halve or double it.",
          "速率很大的泊松变量大致呈正态分布，均值和方差相同，所以标准差是速率的平方根。对于 $X \\sim \\text{Poisson}(\\lambda)$，其均值和方差均为 $\\lambda$，因此标准差为 $\\sigma = \\sqrt{\\lambda}$。对于 $\\text{Poisson}(3600)$，$\\sigma = \\sqrt{3600} = 60$。\n\n> **注意。** 速率 $\\lambda$ 是方差，不是标准差：要开平方，而不是减半或加倍。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(4, 50);
          const lambda = k * k; // perfect square so sqrt(lambda) = k

          return numberProblem({
            prompt: t(
              `A Poisson random variable $X \\sim \\text{Poisson}(${lambda})$ is approximated by a normal distribution $N(\\mu, \\sigma^2)$. Find the standard deviation $\\sigma$.`,
              `泊松随机变量 $X \\sim \\text{Poisson}(${lambda})$ 用正态分布 $N(\\mu, \\sigma^2)$ 近似。求其标准差 $\\sigma$。`,
            ),
            answer: k,
            mistakes: distinct(k, [
              why(
                lambda,
                "That is the variance $\\lambda$; the standard deviation is its square root.",
                "那是方差 $\\lambda$；标准差是它的平方根。",
              ),
              why(2 * k, "That doubles the square root.", "那是把平方根加倍了。"),
              why(Q.of(lambda, 2), "That halves the rate instead of taking its square root.", "那是把速率减半，而不是开平方。"),
            ]),
            solution: walked(
              [
                [
                  ["Match the variance", "使方差相同"],
                  t(
                    `For a Poisson distribution, $\\mu = \\lambda = ${lambda}$ and $\\sigma^2 = \\lambda = ${lambda}$.`,
                    `对于泊松分布，$\\mu = \\lambda = ${lambda}$ 且 $\\sigma^2 = \\lambda = ${lambda}$。`,
                  ),
                ],
                [["Take the square root", "开平方"], t(`$\\sigma = \\sqrt{${lambda}} = ${k}$.`, `$\\sigma = \\sqrt{${lambda}} = ${k}$。`)],
              ],
              t(`$${k}^2 = ${lambda}$, the variance.`, `$${k}^2 = ${lambda}$，正是方差。`),
            ),
          });
        },
      },
      {
        id: "poisson-normal-continuity-z-score",
        title: t("Formulating the continuity-corrected z-score for Poisson", "构建泊松分布连续性校正的 z 值表达式"),
        explanation: t(
          "Add one half to the cutoff before standardizing, because the count at the cutoff occupies the interval reaching half a unit beyond it. To approximate $P(X \\le c)$ for $\\text{Poisson}(\\lambda)$, the continuity correction gives $z = \\dfrac{c + 0.5 - \\lambda}{\\sqrt{\\lambda}}$. For $\\text{Poisson}(400)$ and $P(X \\le 430)$, $z = \\frac{430.5 - 400}{\\sqrt{400}} = \\frac{30.5}{20}$.\n\n> **Watch out.** Divide by $\\sqrt{\\lambda}$, the standard deviation, not by $\\lambda$; and for $\\le$ the half is added, not subtracted.",
          "标准化之前先给分界值加上二分之一，因为分界值处的计数占据了延伸到其后半个单位的区间。为近似 $\\text{Poisson}(\\lambda)$ 的 $P(X \\le c)$，应用连续性校正得到标准化变量 $z = \\dfrac{c + 0.5 - \\lambda}{\\sqrt{\\lambda}}$。对于 $\\text{Poisson}(400)$ 与 $P(X \\le 430)$，$z = \\frac{430.5 - 400}{\\sqrt{400}} = \\frac{30.5}{20}$。\n\n> **注意。** 要除以标准差 $\\sqrt{\\lambda}$，而不是 $\\lambda$；对 $\\le$ 要加上一半，而不是减去。",
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

          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $X \\sim \\text{Poisson}(${lambda})$. Using the normal approximation with continuity correction, what is the standardized $z$-score used to evaluate $P(X \\le ${c})$?`,
                `设 $X \\sim \\text{Poisson}(${lambda})$。使用带有连续性校正的正态近似时，用于计算 $P(X \\le ${c})$ 的标准化 $z$ 分数表达式是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Correct the cutoff", "校正分界值"],
                    t(
                      `$P(X \\le ${c}) \\approx P(Y \\le ${c}.5)$, where $Y \\sim N(${lambda}, ${lambda})$.`,
                      `$P(X \\le ${c}) \\approx P(Y \\le ${c}.5)$，其中 $Y \\sim N(${lambda}, ${lambda})$。`,
                    ),
                  ],
                  [
                    ["Standardize", "标准化"],
                    t(
                      `$z = \\frac{${c}.5 - ${lambda}}{\\sqrt{${lambda}}} = \\frac{${diff}.5}{\\sqrt{${lambda}}}$.`,
                      `$z = \\frac{${c}.5 - ${lambda}}{\\sqrt{${lambda}}} = \\frac{${diff}.5}{\\sqrt{${lambda}}}$。`,
                    ),
                  ],
                ],
                t(
                  `The cutoff $${c}$ lies above the mean $${lambda}$, so $z$ is positive, and the denominator is the standard deviation $\\sqrt{${lambda}}$, not the variance.`,
                  `分界值 $${c}$ 在均值 $${lambda}$ 之上，所以 $z$ 为正；分母是标准差 $\\sqrt{${lambda}}$，不是方差。`,
                ),
              ),
            }),
            [
              [
                `$${alt1}$`,
                "That subtracts the half instead of adding it, which leaves out the count at the cutoff.",
                "那是减去一半而不是加上一半，漏掉了分界值处的计数。",
              ],
              [`$${alt2}$`, "That makes no continuity correction.", "那没有做连续性校正。"],
              [
                `$${alt3}$`,
                "That divides by the variance $\\lambda$ instead of the standard deviation $\\sqrt{\\lambda}$.",
                "那是除以方差 $\\lambda$，而不是标准差 $\\sqrt{\\lambda}$。",
              ],
            ],
          );
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
    intro: t(
      "A bus arrives at a time uniform on $[10, 60]$ minutes. The density is a rectangle of width $50$, so its height is $\\frac{1}{50}$, and the chance the bus comes between minute $20$ and minute $30$ is $\\frac{10}{50} = \\frac{1}{5}$.\n\nCheck: the whole rectangle has area $50 \\cdot \\frac{1}{50} = 1$.\n\nIn this lesson we find the height of a uniform density, compute probabilities of subintervals as ratios of lengths and read them as areas from the graph.",
      "公交车到达的时间在 $[10, 60]$ 分钟上均匀分布。密度是宽为 $50$ 的矩形，所以高为 $\\frac{1}{50}$；公交车在第 $20$ 分钟到第 $30$ 分钟之间到达的概率是 $\\frac{10}{50} = \\frac{1}{5}$。\n\n检验：整个矩形的面积为 $50 \\cdot \\frac{1}{50} = 1$。\n\n本课我们求均匀密度的高度，用长度之比计算子区间的概率，并从图像上把它读作面积。",
    ),
    prerequisites: ["cumulative-distribution-functions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "continuous-uniform-pdf-value",
        figure: probabilityDrawings1["the-continuous-uniform-distribution#continuous-uniform-pdf-value"],
        title: t("Evaluating the density of a continuous uniform distribution", "计算连续均匀分布的概率密度值"),
        explanation: t(
          "A uniform density is constant over its interval, and its height is set so that the rectangle under it has area one. For $X \\sim U(a, b)$, the probability density function is $f(x) = \\dfrac{1}{b - a}$ for $a \\le x \\le b$ and $0$ elsewhere. In the figure, $U(2, 6)$ has a rectangle of width $4$, so its height is $\\frac{1}{4}$. For $U(10, 60)$, the width is $50$ and $f(x) = \\frac{1}{50}$.\n\n> **Watch out.** Divide by the width $b - a$, not by $b$: the interval need not start at $0$. The height is the reciprocal of the width, not the width itself.",
          "均匀密度在其区间上是常数，它的高度使下方矩形的面积为 1。对于 $X \\sim U(a, b)$，在 $a \\le x \\le b$ 时概率密度函数为 $f(x) = \\dfrac{1}{b - a}$，在其他区间为 $0$。图中 $U(2, 6)$ 的矩形宽为 $4$，所以高为 $\\frac{1}{4}$。对于 $U(10, 60)$，宽为 $50$，$f(x) = \\frac{1}{50}$。\n\n> **注意。** 要除以宽度 $b - a$，而不是 $b$：区间不一定从 $0$ 开始。高度是宽度的倒数，不是宽度本身。",
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
            mistakes: distinct(Q.of(1, width), [
              why(width, "That is the width of the interval; the height is its reciprocal.", "那是区间的宽度；高度是它的倒数。"),
              why(Q.of(1, b), `That divides by $${b}$, as if the interval started at $0$.`, `那是除以 $${b}$，就像区间从 $0$ 开始一样。`),
              why(Q.of(2, width), "That doubles the height, so the area would be $2$.", "那把高度加倍了，面积会变成 $2$。"),
            ]),
            solution: walked(
              [
                [["Find the width", "求宽度"], t(`$b - a = ${b} - ${a} = ${width}$.`, `$b - a = ${b} - ${a} = ${width}$。`)],
                [["Take the reciprocal", "取倒数"], t(`$f(x) = \\frac{1}{${width}}$.`, `$f(x) = \\frac{1}{${width}}$。`)],
              ],
              t(
                `The rectangle has area $${width} \\cdot \\frac{1}{${width}} = 1$, as a density must.`,
                `矩形面积为 $${width} \\cdot \\frac{1}{${width}} = 1$，密度必须如此。`,
              ),
            ),
          });
        },
      },
      {
        id: "continuous-uniform-interval-probability",
        title: t("Computing subinterval probabilities for uniform distributions", "计算均匀分布子区间上的概率"),
        explanation: t(
          "For a uniform variable, probability is proportional to length, so the chance of a subinterval is its length divided by the whole length. For $X \\sim U(a, b)$ and $a \\le c < d \\le b$, $P(c \\le X \\le d) = \\dfrac{d - c}{b - a}$. For $U(0, 100)$, $P(20 \\le X \\le 45) = \\frac{25}{100} = \\frac{1}{4}$.\n\n> **Watch out.** Both lengths are differences: the subinterval is $d - c$ and the whole is $b - a$. Using $d$ or $b$ alone counts from $0$, which is outside the support.",
          "对于均匀变量，概率与长度成正比，所以子区间的概率等于它的长度除以整个区间的长度。对于 $X \\sim U(a, b)$ 且 $a \\le c < d \\le b$，概率为 $P(c \\le X \\le d) = \\dfrac{d - c}{b - a}$。对于 $U(0, 100)$，$P(20 \\le X \\le 45) = \\frac{25}{100} = \\frac{1}{4}$。\n\n> **注意。** 两个长度都是差：子区间长 $d - c$，整个区间长 $b - a$。只用 $d$ 或 $b$ 就是从 $0$ 算起，而 $0$ 在支撑之外。",
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
            mistakes: distinct(Q.of(subWidth, width), [
              why(Q.of(subWidth, b), `That divides by $${b}$ instead of the width $${width}$.`, `那是除以 $${b}$，而不是宽度 $${width}$。`),
              why(
                Q.of(d, b),
                "That measures both lengths from $0$, outside the support.",
                "那是两个长度都从 $0$ 量起，而 $0$ 在支撑之外。",
              ),
              why(
                Q.of(width - subWidth, width),
                "That is the probability of falling outside the subinterval.",
                "那是落在子区间之外的概率。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Measure the lengths", "量出长度"],
                  t(
                    `The subinterval has length $${d} - ${c} = ${subWidth}$, and the whole interval $${b} - ${a} = ${width}$.`,
                    `子区间长 $${d} - ${c} = ${subWidth}$，整个区间长 $${b} - ${a} = ${width}$。`,
                  ),
                ],
                [
                  ["Divide", "相除"],
                  t(
                    `$P(${c} \\le X \\le ${d}) = \\frac{${subWidth}}{${width}}${lowestTerms(subWidth, width)}$.`,
                    `$P(${c} \\le X \\le ${d}) = \\frac{${subWidth}}{${width}}${lowestTerms(subWidth, width)}$。`,
                  ),
                ],
              ],
              t(
                `The rest of the interval has length $${width - subWidth}$, and $\\frac{${subWidth}}{${width}} + \\frac{${width - subWidth}}{${width}} = 1$.`,
                `区间其余部分长 $${width - subWidth}$，且 $\\frac{${subWidth}}{${width}} + \\frac{${width - subWidth}}{${width}} = 1$。`,
              ),
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
    intro: t(
      "A reading uniform on $[100, 160]$ has mean at the midpoint, $\\frac{100 + 160}{2} = 130$, and variance $\\frac{60^2}{12} = 300$, which depends only on the width $60$.\n\nCheck: shifting the interval to $[0, 60]$ moves the mean to $30$ but keeps the variance $\\frac{3600}{12} = 300$.\n\nIn this lesson we find the mean and variance of a uniform distribution, recover its endpoints from them and read both from a drawn rectangle.",
      "在 $[100, 160]$ 上均匀分布的读数，均值在中点 $\\frac{100 + 160}{2} = 130$，方差为 $\\frac{60^2}{12} = 300$，只取决于宽度 $60$。\n\n检验：把区间平移到 $[0, 60]$，均值变为 $30$，方差仍是 $\\frac{3600}{12} = 300$。\n\n本课我们求均匀分布的均值和方差，由它们反求端点，并从画出的矩形读出两者。",
    ),
    prerequisites: ["the-continuous-uniform-distribution", "variance-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "continuous-uniform-expectation",
        title: t("Expected value of a continuous uniform distribution", "连续均匀分布的期望值"),
        explanation: t(
          "A uniform density is symmetric about the center of its interval, so the mean is the midpoint of the two endpoints. For $X \\sim U(a, b)$, the expected value is the midpoint $E[X] = \\frac{a + b}{2}$. For $U(-50, 150)$, $E[X] = \\frac{100}{2} = 50$.\n\n> **Watch out.** The mean is half the sum of the endpoints, not half the width: $\\frac{b - a}{2}$ is the distance from the mean to either end.",
          "均匀密度关于区间中点对称，所以均值是两个端点的中点。对于 $X \\sim U(a, b)$，期望值为区间中点 $E[X] = \\frac{a + b}{2}$。对于 $U(-50, 150)$，$E[X] = \\frac{100}{2} = 50$。\n\n> **注意。** 均值是两端点之和的一半，不是宽度的一半：$\\frac{b - a}{2}$ 是均值到任一端点的距离。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(-20, 20);
          const width = rng.int(1, 30);
          const b = a + width;
          const mean = Q.of(a + b, 2);

          return numberProblem({
            prompt: t(
              `Find the expected value $E[X]$ of a continuous random variable $X \\sim U(${a}, ${b})$.`,
              `求连续型随机变量 $X \\sim U(${a}, ${b})$ 的数学期望 $E[X]$。`,
            ),
            answer: mean,
            mistakes: distinct(mean, [
              why(a + b, "That is the sum of the endpoints; the midpoint divides it by $2$.", "那是两端点之和；中点还要除以 $2$。"),
              why(Q.of(width, 2), "That is half the width, the distance from the mean to an end.", "那是宽度的一半，即均值到端点的距离。"),
            ]),
            solution: walked(
              [
                [["Add the endpoints", "端点相加"], t(`$${a} + ${paren(b)} = ${a + b}$.`, `$${a} + ${paren(b)} = ${a + b}$。`)],
                [
                  ["Halve", "取一半"],
                  t(`$E[X] = \\frac{${a + b}}{2}${lowestTerms(a + b, 2)}$.`, `$E[X] = \\frac{${a + b}}{2}${lowestTerms(a + b, 2)}$。`),
                ],
              ],
              t(
                `The mean is $${mean.sub(Q.of(a)).toLatex()}$ above $${a}$ and $${Q.of(b).sub(mean).toLatex()}$ below $${b}$, so it sits in the middle.`,
                `均值比 $${a}$ 大 $${mean.sub(Q.of(a)).toLatex()}$，比 $${b}$ 小 $${Q.of(b).sub(mean).toLatex()}$，所以正好在中间。`,
              ),
            ),
          });
        },
      },
      {
        id: "continuous-uniform-variance",
        title: t("Variance of a continuous uniform distribution", "连续均匀分布的方差"),
        explanation: t(
          "The variance depends only on the length of the interval, growing with the square of that length, and not on where the interval sits. For $X \\sim U(a, b)$, the variance is $\\operatorname{Var}(X) = \\frac{(b - a)^2}{12}$. For $U(100, 160)$, $\\operatorname{Var}(X) = \\frac{60^2}{12} = 300$.\n\n> **Watch out.** Square the width before dividing, and divide by $12$, not by $2$ or $4$: $\\frac{(b - a)^2}{4}$ is the square of the half-width, which is larger than the variance.",
          "方差只取决于区间的长度，随长度的平方增大，而与区间的位置无关。对于 $X \\sim U(a, b)$，方差为 $\\operatorname{Var}(X) = \\frac{(b - a)^2}{12}$。对于 $U(100, 160)$，$\\operatorname{Var}(X) = \\frac{60^2}{12} = 300$。\n\n> **注意。** 先把宽度平方再相除，并且除以 $12$，而不是 $2$ 或 $4$：$\\frac{(b - a)^2}{4}$ 是半宽的平方，比方差大。",
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
            mistakes: distinct(Q.of(numerator, 12), [
              why(Q.of(numerator, 2), "That divides the squared width by $2$ instead of $12$.", "那是把宽度的平方除以 $2$，而不是 $12$。"),
              why(Q.of(width, 12), "That forgets to square the width.", "那忘了把宽度平方。"),
              why(Q.of(numerator, 4), "That is the square of the half-width, larger than the variance.", "那是半宽的平方，比方差大。"),
            ]),
            solution: walked(
              [
                [
                  ["Square the width", "把宽度平方"],
                  t(
                    `$(b - a)^2 = (${b} - ${a})^2 = ${width}^2 = ${numerator}$.`,
                    `$(b - a)^2 = (${b} - ${a})^2 = ${width}^2 = ${numerator}$。`,
                  ),
                ],
                [
                  ["Divide by 12", "除以 12"],
                  t(
                    `$\\text{Var}(X) = \\frac{${numerator}}{12}${lowestTerms(numerator, 12)}$.`,
                    `$\\text{Var}(X) = \\frac{${numerator}}{12}${lowestTerms(numerator, 12)}$。`,
                  ),
                ],
              ],
              t(
                `Every value lies within $\\frac{${width}}{2}$ of the mean, so the variance must be below $\\left(\\frac{${width}}{2}\\right)^2 = ${Q.of(numerator, 4).toLatex()}$, and it is.`,
                `每个值与均值的距离都不超过 $\\frac{${width}}{2}$，所以方差必须小于 $\\left(\\frac{${width}}{2}\\right)^2 = ${Q.of(numerator, 4).toLatex()}$，确实如此。`,
              ),
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
    intro: t(
      "A delivery arrives at a time uniform on $[0, 100]$ minutes. After $40$ minutes with no delivery, the arrival is uniform on the remaining $[40, 100]$, so the chance of waiting past minute $70$ is $\\frac{30}{60} = \\frac{1}{2}$, and the expected remaining wait is $\\frac{60}{2} = 30$ minutes.\n\nCheck: the chance of arriving between minute $40$ and minute $70$ is also $\\frac{30}{60}$, and the two add to $1$.\n\nIn this lesson we compute conditional probabilities in a uniform model, find quantile cutoffs and find the expected remaining wait.",
      "某快递到达的时间在 $[0, 100]$ 分钟上均匀分布。等了 $40$ 分钟仍未到达后，到达时间在剩下的 $[40, 100]$ 上均匀分布，所以等待超过第 $70$ 分钟的概率是 $\\frac{30}{60} = \\frac{1}{2}$，剩余等待时间的期望是 $\\frac{60}{2} = 30$ 分钟。\n\n检验：在第 $40$ 分钟到第 $70$ 分钟之间到达的概率也是 $\\frac{30}{60}$，两者相加为 $1$。\n\n本课我们在均匀模型中计算条件概率，求分位数阈值，并求剩余等待时间的期望。",
    ),
    prerequisites: ["mean-and-variance-of-the-continuous-uniform-distribution"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "uniform-conditional-probability",
        title: t("Conditional probability in a uniform model", "均匀分布模型中的条件概率"),
        explanation: t(
          "Given that the value exceeds a point, it is uniform on the remaining part of the interval, so the conditional probability is again a ratio of lengths. For $X \\sim U(a, b)$ and $a \\le c < d \\le b$, $P(X > d \\mid X > c) = \\dfrac{b - d}{b - c}$. For $U(0, 100)$, $P(X > 70 \\mid X > 40) = \\frac{30}{60} = \\frac{1}{2}$.\n\n> **Watch out.** Given $X > c$, the whole is the remaining length $b - c$, not $b - a$. A uniform wait is not memoryless: the extra wait is not a fresh start from $0$.",
          "在已知取值超过某点的条件下，它在区间剩下的部分上仍是均匀的，所以条件概率仍是长度之比。对于 $X \\sim U(a, b)$ 且 $a \\le c < d \\le b$，条件概率为 $P(X > d \\mid X > c) = \\dfrac{b - d}{b - c}$。对于 $U(0, 100)$，$P(X > 70 \\mid X > 40) = \\frac{30}{60} = \\frac{1}{2}$。\n\n> **注意。** 已知 $X > c$ 时，整体是剩下的长度 $b - c$，不是 $b - a$。均匀等待时间没有无记忆性：剩下的等待不是从 $0$ 重新开始。",
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
            mistakes: distinct(Q.of(remainingExceed, remainingTotal), [
              why(
                Q.of(remainingExceed, maxWait),
                `That is $P(X > ${d})$ without the condition; the $${c}$ minutes already waited shrink the whole.`,
                `那是不带条件的 $P(X > ${d})$；已经等了的 $${c}$ 分钟使整体变小了。`,
              ),
              why(
                Q.of(d - c, remainingTotal),
                `That is the chance the bus comes between minute $${c}$ and minute $${d}$.`,
                `那是公交车在第 $${c}$ 分钟到第 $${d}$ 分钟之间到达的概率。`,
              ),
              why(
                Q.of(maxWait - d + c, maxWait),
                "That restarts the wait from $0$, as if the uniform wait were memoryless.",
                "那是把等待从 $0$ 重新开始，就像均匀等待时间有无记忆性一样。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Write the ratio", "写出比值"],
                  t(
                    `Let $X \\sim U(0, ${maxWait})$. Then $P(X > ${d} \\mid X > ${c}) = \\frac{P(X > ${d})}{P(X > ${c})}$.`,
                    `设 $X \\sim U(0, ${maxWait})$。则 $P(X > ${d} \\mid X > ${c}) = \\frac{P(X > ${d})}{P(X > ${c})}$。`,
                  ),
                ],
                [
                  ["Use the lengths", "用长度计算"],
                  t(
                    `$\\frac{${maxWait} - ${d}}{${maxWait} - ${c}} = \\frac{${remainingExceed}}{${remainingTotal}}${lowestTerms(remainingExceed, remainingTotal)}$.`,
                    `$\\frac{${maxWait} - ${d}}{${maxWait} - ${c}} = \\frac{${remainingExceed}}{${remainingTotal}}${lowestTerms(remainingExceed, remainingTotal)}$。`,
                  ),
                ],
              ],
              t(
                `Given the wait so far, the bus comes either by minute $${d}$ or after it: $\\frac{${d - c}}{${remainingTotal}} + \\frac{${remainingExceed}}{${remainingTotal}} = 1$.`,
                `在已等待的条件下，公交车要么在第 $${d}$ 分钟前到达，要么在其后到达：$\\frac{${d - c}}{${remainingTotal}} + \\frac{${remainingExceed}}{${remainingTotal}} = 1$。`,
              ),
            ),
          });
        },
      },
      {
        id: "uniform-quantile-cutoff",
        title: t("Finding quantiles for continuous uniform distributions", "求解连续均匀分布的分位数阈值"),
        explanation: t(
          "A quantile of a uniform distribution lies the given fraction of the way from the left endpoint to the right endpoint. For $X \\sim U(a, b)$, the value $x_p$ satisfying $P(X \\le x_p) = p$ is $x_p = a + p(b - a)$. For $U(20, 120)$ and $p = \\frac{3}{4}$, $x_p = 20 + \\frac{3}{4} \\cdot 100 = 95$.\n\n> **Watch out.** Start from the left endpoint $a$: $p(b - a)$ alone is a distance, not a position, and measuring from $b$ gives the quantile for $1 - p$.",
          "均匀分布的分位数位于从左端点到右端点的给定比例处。对于 $X \\sim U(a, b)$，满足 $P(X \\le x_p) = p$ 的值为 $x_p = a + p(b - a)$。对于 $U(20, 120)$ 与 $p = \\frac{3}{4}$，$x_p = 20 + \\frac{3}{4} \\cdot 100 = 95$。\n\n> **注意。** 要从左端点 $a$ 起算：$p(b - a)$ 本身是距离，不是位置；从 $b$ 量起得到的是 $1 - p$ 的分位数。",
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
            mistakes: distinct(cutoff, [
              why(
                step * num,
                `That is the distance from $${a}$, not the time itself; add $${a}$.`,
                `那是从 $${a}$ 起的距离，不是时间本身；还要加上 $${a}$。`,
              ),
              why(
                b - step * num,
                `That measures from $${b}$, which gives the time exceeded by that fraction of builds.`,
                `那是从 $${b}$ 量起，得到的是该比例的构建所超过的时间。`,
              ),
              why(
                a + num,
                "That adds the numerator of the fraction instead of the fraction of the width.",
                "那是加上分数的分子，而不是宽度的相应比例。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Set the CDF equal to the fraction", "令累积分布函数等于该比例"],
                  t(
                    `$F(t) = \\frac{t - ${a}}{${width}} = \\frac{${num}}{${den}}$.`,
                    `$F(t) = \\frac{t - ${a}}{${width}} = \\frac{${num}}{${den}}$。`,
                  ),
                ],
                [
                  ["Solve for $t$", "解出 $t$"],
                  t(
                    `$t = ${a} + \\frac{${num}}{${den}} \\cdot ${width} = ${a} + ${step * num} = ${cutoff}$.`,
                    `$t = ${a} + \\frac{${num}}{${den}} \\cdot ${width} = ${a} + ${step * num} = ${cutoff}$。`,
                  ),
                ],
              ],
              t(
                `$F(${cutoff}) = \\frac{${step * num}}{${width}} = \\frac{${num}}{${den}}$.`,
                `$F(${cutoff}) = \\frac{${step * num}}{${width}} = \\frac{${num}}{${den}}$。`,
              ),
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
    intro: t(
      "Calls arrive at a rate of $\\lambda = 20$ per hour, so the wait $X$ in hours is $\\text{Exp}(20)$. The chance of waiting more than $0.1$ hours is $P(X > 0.1) = e^{-20 \\cdot 0.1} = e^{-2}$, and the chance of a call within that time is $1 - e^{-2}$.\n\nCheck: the two probabilities add to $1$, and $e^{-2}$ is about $0.135$, a small chance for a wait twice the mean of $0.05$ hours.\n\nIn this lesson we evaluate survival and cumulative probabilities, use the memoryless property, read tail areas from the density curve and read the rate from the graph.",
      "来电以每小时 $\\lambda = 20$ 次的速率到达，所以以小时计的等待时间 $X$ 服从 $\\text{Exp}(20)$。等待超过 $0.1$ 小时的概率是 $P(X > 0.1) = e^{-20 \\cdot 0.1} = e^{-2}$，在这段时间内来电的概率是 $1 - e^{-2}$。\n\n检验：两个概率之和为 $1$，而 $e^{-2}$ 约为 $0.135$，对于均值 $0.05$ 小时两倍的等待来说，这是个较小的概率。\n\n本课我们计算生存概率与累积概率，运用无记忆性，从密度曲线上读出尾部面积，并从图像读出速率。",
    ),
    prerequisites: ["cumulative-distribution-functions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "exponential-cdf-evaluation",
        title: t("Evaluating survival and cumulative probabilities of exponential distribution", "计算指数分布的生存概率与累积概率"),
        explanation: t(
          "The chance of waiting longer than a given time decays exponentially, and the cumulative probability is one minus that survival probability. For $X \\sim \\text{Exp}(\\lambda)$, the survival probability is $P(X > x) = e^{-\\lambda x}$ and the CDF is $P(X \\le x) = 1 - e^{-\\lambda x}$. For $\\text{Exp}(12)$, $P(X > 5) = e^{-60}$.\n\n> **Watch out.** The survival probability has no factor $\\lambda$ in front, which belongs to the density, and its exponent is $\\lambda x$, not $\\lambda$ alone.",
          "等待时间超过给定值的概率按指数衰减，累积概率等于 1 减去这个生存概率。对于 $X \\sim \\text{Exp}(\\lambda)$，其生存概率为 $P(X > x) = e^{-\\lambda x}$，累积分布函数为 $P(X \\le x) = 1 - e^{-\\lambda x}$。对于 $\\text{Exp}(12)$，$P(X > 5) = e^{-60}$。\n\n> **注意。** 生存概率前面没有因子 $\\lambda$，那个因子属于密度；它的指数是 $\\lambda x$，而不只是 $\\lambda$。",
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
          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $X \\sim \\text{Exp}(${lambda})$ with rate parameter $\\lambda = ${lambda}$ and PDF $f(x) = ${lambda} e^{-${lambda} x}$ for $x \\ge 0$. What is the survival probability $P(X > ${x})$?`,
                `设 $X \\sim \\text{Exp}(${lambda})$，其比率参数为 $\\lambda = ${lambda}$，当 $x \\ge 0$ 时概率密度为 $f(x) = ${lambda} e^{-${lambda} x}$。求生存概率 $P(X > ${x})$ 的表达式。`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Integrate the tail", "对尾部积分"],
                    t(
                      `$P(X > x) = \\int_{x}^{\\infty} \\lambda e^{-\\lambda u}\\,du = e^{-\\lambda x}$.`,
                      `$P(X > x) = \\int_{x}^{\\infty} \\lambda e^{-\\lambda u}\\,du = e^{-\\lambda x}$。`,
                    ),
                  ],
                  [
                    ["Substitute", "代入"],
                    t(
                      `With $\\lambda = ${lambda}$ and $x = ${x}$, $P(X > ${x}) = e^{-${lambda} \\cdot ${x}} = e^{-${exponent}}$.`,
                      `代入 $\\lambda = ${lambda}$ 与 $x = ${x}$，$P(X > ${x}) = e^{-${lambda} \\cdot ${x}} = e^{-${exponent}}$。`,
                    ),
                  ],
                ],
                t(
                  `$e^{-${exponent}}$ is between $0$ and $1$, and with the CDF $1 - e^{-${exponent}}$ it adds to $1$.`,
                  `$e^{-${exponent}}$ 在 $0$ 与 $1$ 之间，与累积分布函数 $1 - e^{-${exponent}}$ 相加为 $1$。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "This is the probability of the opposite event: it is the CDF itself.",
                "这是对立事件的概率：它就是分布函数本身。",
              ],
              [opts[2]!.en, "This is the density at that point, and a density is not a probability.", "这是该点的密度，而密度不是概率。"],
              [opts[3]!.en, "The exponent is $\\lambda x$, and this leaves out $x$.", "指数是 $\\lambda x$，这里漏掉了 $x$。"],
            ],
          );
        },
      },
      {
        id: "exponential-memoryless-property",
        title: t("Understanding the memoryless property of exponential variables", "理解指数变量的无记忆性"),
        explanation: t(
          "Having already waited some time does not change the distribution of the remaining wait, which makes the exponential the model for events that do not wear out. The exponential distribution satisfies the memoryless property: $P(X > s + t \\mid X > s) = P(X > t)$. So $P(X > 150 \\mid X > 100) = P(X > 50)$.\n\n> **Watch out.** Only the extra time $t$ matters: the answer is neither the unconditional $P(X > s + t)$ nor anything about the time $s$ already passed.",
          "已经等待了一段时间并不改变剩余等待时间的分布，这使指数分布成为不会老化的事件的模型。指数分布满足无记忆性：$P(X > s + t \\mid X > s) = P(X > t)$。所以 $P(X > 150 \\mid X > 100) = P(X > 50)$。\n\n> **注意。** 只有额外的时间 $t$ 起作用：答案既不是无条件的 $P(X > s + t)$，也与已经过去的时间 $s$ 无关。",
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

          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $X$ be an exponentially distributed random variable modeling the lifespan of a component. By the memoryless property, to which probability is the conditional probability $P(X > ${sumVal} \\mid X > ${s})$ strictly equal?`,
                `设 $X$ 为对元件寿命建模的指数随机变量。由无记忆性，条件概率 $P(X > ${sumVal} \\mid X > ${s})$ 严格等于下列哪一项？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Split the time", "拆分时间"],
                    t(
                      `$${sumVal} = ${s} + ${tVal}$, so $s = ${s}$ has passed and $t = ${tVal}$ is the extra time.`,
                      `$${sumVal} = ${s} + ${tVal}$，所以已经过去 $s = ${s}$，额外时间为 $t = ${tVal}$。`,
                    ),
                  ],
                  [
                    ["Apply the property", "运用无记忆性"],
                    t(`$P(X > ${sumVal} \\mid X > ${s}) = P(X > ${tVal})$.`, `$P(X > ${sumVal} \\mid X > ${s}) = P(X > ${tVal})$。`),
                  ],
                ],
                t(
                  `With $P(X > x) = e^{-\\lambda x}$, $\\frac{e^{-${sumVal}\\lambda}}{e^{-${s}\\lambda}} = e^{-${tVal}\\lambda}$, which is $P(X > ${tVal})$.`,
                  `由 $P(X > x) = e^{-\\lambda x}$，$\\frac{e^{-${sumVal}\\lambda}}{e^{-${s}\\lambda}} = e^{-${tVal}\\lambda}$，正是 $P(X > ${tVal})$。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "That is the unconditional probability; the condition removes the time already passed.",
                "那是无条件的概率；条件去掉了已经过去的时间。",
              ],
              [
                opts[2]!.en,
                "That is the chance of lasting the time already passed, which is given.",
                "那是撑过已经过去那段时间的概率，而这已是已知条件。",
              ],
              [
                opts[3]!.en,
                "That is the complement, the chance of failing within the extra time.",
                "那是补事件，即在额外时间内失效的概率。",
              ],
            ],
          );
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
    intro: t(
      "A machine part lasts $40$ hours on average, so its lifetime has rate $\\lambda = \\frac{1}{40}$ per hour and median $40 \\ln 2 \\approx 27.7$ hours. With a second part lasting $60$ hours on average, the first failure comes at rate $\\frac{1}{40} + \\frac{1}{60} = \\frac{1}{24}$, after $24$ hours on average.\n\nCheck: the median $27.7$ is below the mean $40$, as for every exponential, whose long right tail pulls the mean up.\n\nIn this lesson we find the rate from the mean, find the median and find the distribution of the first of two waiting times.",
      "某机器零件的平均寿命为 $40$ 小时，所以其寿命的速率为每小时 $\\lambda = \\frac{1}{40}$，中位数为 $40 \\ln 2 \\approx 27.7$ 小时。另有一个平均寿命为 $60$ 小时的零件，则首次失效的速率为 $\\frac{1}{40} + \\frac{1}{60} = \\frac{1}{24}$，平均在 $24$ 小时后发生。\n\n检验：中位数 $27.7$ 小于均值 $40$，所有指数分布都是如此，长长的右尾把均值拉高了。\n\n本课我们由均值求速率，求中位数，并求两个等待时间中较早者的分布。",
    ),
    prerequisites: ["the-exponential-distribution"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "exponential-rate-from-mean",
        title: t("Determining the rate parameter from expected duration", "根据平均持续时间确定比率参数"),
        explanation: t(
          "The rate counts how many events happen per unit of time on average, so it is the reciprocal of the average time between events. If the average time between events is $\\mu$, the rate parameter is $\\lambda = 1/\\mu$. An average of $120$ minutes between calls gives $\\lambda = \\frac{1}{120}$ calls per minute.\n\n> **Watch out.** The rate is the reciprocal of the mean, not the mean itself, and not the reciprocal of its square, which is one over the variance.",
          "速率表示单位时间内平均发生多少次事件，所以它是两次事件之间平均时间的倒数。若事件发生的平均间隔时间为 $\\mu$，则比率参数为 $\\lambda = 1/\\mu$。来电平均间隔 $120$ 分钟，则 $\\lambda = \\frac{1}{120}$ 次/分钟。\n\n> **注意。** 速率是均值的倒数，不是均值本身，也不是均值平方的倒数，后者是方差的倒数。",
        ),
        generate: (rng: Rng): Problem => {
          const mean = rng.int(2, 50);

          return numberProblem({
            prompt: t(
              `A call center receives incoming calls modeled by an exponential interarrival time with an average of $${mean}$ minutes between calls. Find the rate parameter $\\lambda$ (in calls per minute).`,
              `某呼叫中心接收来电的到达间隔时间服从指数分布，平均每次来电间隔为 $${mean}$ 分钟。求其比率参数 $\\lambda$（单位：次/分钟）。`,
            ),
            answer: Q.of(1, mean),
            mistakes: distinct(Q.of(1, mean), [
              why(mean, "That is the mean time between calls; the rate is its reciprocal.", "那是来电的平均间隔；速率是它的倒数。"),
              why(
                Q.of(1, mean * mean),
                "That divides by the square of the mean, which is one over the variance.",
                "那是除以均值的平方，即方差的倒数。",
              ),
              why(Q.of(2, mean), "That doubles the rate.", "那是把速率加倍了。"),
            ]),
            solution: walked(
              [
                [
                  ["Recall the mean", "回顾均值公式"],
                  t(
                    `For $\\text{Exp}(\\lambda)$, $E[X] = \\frac{1}{\\lambda}$, so here $\\frac{1}{\\lambda} = ${mean}$.`,
                    `对于 $\\text{Exp}(\\lambda)$，$E[X] = \\frac{1}{\\lambda}$，所以这里 $\\frac{1}{\\lambda} = ${mean}$。`,
                  ),
                ],
                [["Invert", "取倒数"], t(`$\\lambda = \\frac{1}{${mean}}$ calls per minute.`, `$\\lambda = \\frac{1}{${mean}}$ 次/分钟。`)],
              ],
              t(
                `At $\\frac{1}{${mean}}$ calls per minute, one call takes $${mean}$ minutes on average.`,
                `每分钟 $\\frac{1}{${mean}}$ 次来电，即平均 $${mean}$ 分钟一次。`,
              ),
            ),
          });
        },
      },
      {
        id: "exponential-median-formula",
        title: t("Identifying the median of an exponential distribution", "确定指数分布的中位数表达式"),
        explanation: t(
          "Setting the cumulative probability equal to one half and taking logarithms shows that the median is shorter than the mean. For $X \\sim \\text{Exp}(\\lambda)$, the median $m$ satisfies $1 - e^{-\\lambda m} = 0.5$, so $m = \\frac{\\ln 2}{\\lambda}$. For $\\text{Exp}(50)$, $m = \\frac{\\ln 2}{50}$.\n\n> **Watch out.** The median is not half the mean: $\\frac{1}{2\\lambda}$ is too small, since $\\ln 2 \\approx 0.69$, and the mean $\\frac{1}{\\lambda}$ is too large.",
          "令累积概率等于二分之一并取对数，可以看出中位数比均值短。对于 $X \\sim \\text{Exp}(\\lambda)$，中位数 $m$ 满足 $1 - e^{-\\lambda m} = 0.5$，因此 $m = \\frac{\\ln 2}{\\lambda}$。对于 $\\text{Exp}(50)$，$m = \\frac{\\ln 2}{50}$。\n\n> **注意。** 中位数不是均值的一半：由于 $\\ln 2 \\approx 0.69$，$\\frac{1}{2\\lambda}$ 太小，而均值 $\\frac{1}{\\lambda}$ 太大。",
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

          return reasoned(
            choiceProblem({
              prompt: t(
                `For an exponentially distributed random variable $X \\sim \\text{Exp}(${lambda})$, what is the exact expression for the median $m$ (such that $P(X \\le m) = 0.5$)?`,
                `对于服从指数分布的随机变量 $X \\sim \\text{Exp}(${lambda})$，其中位数 $m$（满足 $P(X \\le m) = 0.5$）的精确表达式是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Set the CDF to one half", "令累积分布函数等于二分之一"],
                    t(
                      `$1 - e^{-${lambda} m} = \\frac{1}{2}$, so $e^{-${lambda} m} = \\frac{1}{2}$.`,
                      `$1 - e^{-${lambda} m} = \\frac{1}{2}$，所以 $e^{-${lambda} m} = \\frac{1}{2}$。`,
                    ),
                  ],
                  [
                    ["Take logarithms", "取对数"],
                    t(
                      `$-${lambda} m = -\\ln 2$, so $m = \\frac{\\ln 2}{${lambda}}$.`,
                      `$-${lambda} m = -\\ln 2$，所以 $m = \\frac{\\ln 2}{${lambda}}$。`,
                    ),
                  ],
                ],
                t(
                  `$\\ln 2 \\approx 0.69 < 1$, so the median is below the mean $\\frac{1}{${lambda}}$, as the long right tail requires.`,
                  `$\\ln 2 \\approx 0.69 < 1$，所以中位数小于均值 $\\frac{1}{${lambda}}$，这正是长右尾所要求的。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "That halves the mean; the median multiplies it by $\\ln 2$, not by $\\frac{1}{2}$.",
                "那是把均值减半；中位数是均值乘以 $\\ln 2$，而不是 $\\frac{1}{2}$。",
              ],
              [opts[2]!.en, "That is the mean, which the long right tail pulls above the median.", "那是均值，长右尾把它拉到中位数之上。"],
              [opts[3]!.en, "That adds $1$ to the rate, which has no place in the formula.", "那是给速率加了 $1$，公式中没有这一项。"],
            ],
          );
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
    intro: t(
      "A wait with rate $\\frac{1}{30}$ per minute has mean $30$ minutes and standard deviation $30$ minutes, since $\\operatorname{Var}(X) = 30^2 = 900$. Its second moment is $E[X^2] = 900 + 30^2 = 1800$.\n\nCheck: $E[X^2] - (E[X])^2 = 1800 - 900 = 900$, the variance.\n\nIn this lesson we find the standard deviation and the second moment of an exponential, find the mean given that the wait exceeds a value and read the mean from the height of the curve.",
      "速率为每分钟 $\\frac{1}{30}$ 的等待时间，均值为 $30$ 分钟，标准差也是 $30$ 分钟，因为 $\\operatorname{Var}(X) = 30^2 = 900$。它的二阶矩是 $E[X^2] = 900 + 30^2 = 1800$。\n\n检验：$E[X^2] - (E[X])^2 = 1800 - 900 = 900$，正是方差。\n\n本课我们求指数分布的标准差和二阶矩，求已知等待超过某值时的均值，并从曲线的高度读出均值。",
    ),
    prerequisites: ["modeling-with-the-exponential-distribution", "variance-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "exponential-mean-and-sd-equality",
        title: t("Standard deviation of an exponential random variable", "指数随机变量的标准差"),
        explanation: t(
          "For an exponential distribution the spread is as large as the mean itself, so the standard deviation equals the mean. For $X \\sim \\text{Exp}(\\lambda)$, $\\operatorname{Var}(X) = \\frac{1}{\\lambda^2}$, so the standard deviation is $\\operatorname{SD}(X) = \\frac{1}{\\lambda}$, equal to the mean. For $\\text{Exp}(60)$, $\\operatorname{SD}(X) = \\frac{1}{60}$.\n\n> **Watch out.** $\\frac{1}{\\lambda^2}$ is the variance; the standard deviation is its square root $\\frac{1}{\\lambda}$, and the rate $\\lambda$ itself is neither.",
          "对于指数分布，分散程度与均值本身一样大，所以标准差等于均值。对于 $X \\sim \\text{Exp}(\\lambda)$，方差为 $\\operatorname{Var}(X) = \\frac{1}{\\lambda^2}$，因此标准差为 $\\operatorname{SD}(X) = \\frac{1}{\\lambda}$，恰好等于其期望值。对于 $\\text{Exp}(60)$，$\\operatorname{SD}(X) = \\frac{1}{60}$。\n\n> **注意。** $\\frac{1}{\\lambda^2}$ 是方差；标准差是它的平方根 $\\frac{1}{\\lambda}$，而速率 $\\lambda$ 本身两者都不是。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 40);

          return numberProblem({
            prompt: t(
              `Let $X \\sim \\text{Exp}(${lambda})$. Find the standard deviation $\\text{SD}(X) = \\sqrt{\\text{Var}(X)}$.`,
              `设 $X \\sim \\text{Exp}(${lambda})$。求其标准差 $\\text{SD}(X) = \\sqrt{\\text{Var}(X)}$。`,
            ),
            answer: Q.of(1, lambda),
            mistakes: distinct(Q.of(1, lambda), [
              why(lambda, "That is the rate; the standard deviation is its reciprocal.", "那是速率；标准差是它的倒数。"),
              why(Q.of(1, lambda * lambda), "That is the variance; take its square root.", "那是方差；还要开平方。"),
              why(Q.of(1, 2 * lambda), "That halves the standard deviation.", "那是把标准差减半了。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the variance", "求方差"],
                  t(
                    `$\\text{Var}(X) = \\frac{1}{\\lambda^2} = \\frac{1}{${lambda * lambda}}$.`,
                    `$\\text{Var}(X) = \\frac{1}{\\lambda^2} = \\frac{1}{${lambda * lambda}}$。`,
                  ),
                ],
                [
                  ["Take the square root", "开平方"],
                  t(`$\\text{SD}(X) = \\frac{1}{${lambda}}$.`, `$\\text{SD}(X) = \\frac{1}{${lambda}}$。`),
                ],
              ],
              t(
                `The standard deviation equals the mean $\\frac{1}{${lambda}}$, as it must for an exponential.`,
                `标准差等于均值 $\\frac{1}{${lambda}}$，指数分布必然如此。`,
              ),
            ),
          });
        },
      },
      {
        id: "exponential-second-moment",
        title: t("Calculating the second raw moment of an exponential distribution", "计算指数分布的二阶原点矩"),
        explanation: t(
          "Adding the square of the mean to the variance gives the second moment, which for an exponential is twice the square of the mean. For $X \\sim \\text{Exp}(\\lambda)$, $E[X^2] = \\operatorname{Var}(X) + (E[X])^2 = \\frac{1}{\\lambda^2} + \\frac{1}{\\lambda^2} = \\frac{2}{\\lambda^2}$. For $\\text{Exp}(60)$, $E[X^2] = \\frac{2}{3600} = \\frac{1}{1800}$.\n\n> **Watch out.** $E[X^2]$ is not the variance: it adds the square of the mean, which doubles $\\frac{1}{\\lambda^2}$. And $\\lambda$ is squared too, so $\\frac{2}{\\lambda}$ is wrong.",
          "把均值的平方加到方差上得到二阶矩，对指数分布来说它是均值平方的两倍。对于 $X \\sim \\text{Exp}(\\lambda)$，$E[X^2] = \\operatorname{Var}(X) + (E[X])^2 = \\frac{1}{\\lambda^2} + \\frac{1}{\\lambda^2} = \\frac{2}{\\lambda^2}$。对于 $\\text{Exp}(60)$，$E[X^2] = \\frac{2}{3600} = \\frac{1}{1800}$。\n\n> **注意。** $E[X^2]$ 不是方差：它还要加上均值的平方，使 $\\frac{1}{\\lambda^2}$ 加倍。$\\lambda$ 也要平方，所以 $\\frac{2}{\\lambda}$ 是错的。",
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
            mistakes: distinct(Q.of(2, den), [
              why(
                Q.of(1, den),
                "That is the variance; the second moment adds the square of the mean.",
                "那是方差；二阶矩还要加上均值的平方。",
              ),
              why(Q.of(2, lambda), "That forgets to square $\\lambda$.", "那忘了把 $\\lambda$ 平方。"),
              why(Q.of(1, lambda), "That is the mean $E[X]$, not $E[X^2]$.", "那是均值 $E[X]$，不是 $E[X^2]$。"),
            ]),
            solution: walked(
              [
                [
                  ["Recall the mean and variance", "回顾均值和方差"],
                  t(
                    `$E[X] = \\frac{1}{${lambda}}$ and $\\text{Var}(X) = \\frac{1}{${den}}$.`,
                    `$E[X] = \\frac{1}{${lambda}}$，$\\text{Var}(X) = \\frac{1}{${den}}$。`,
                  ),
                ],
                [
                  ["Add the squared mean", "加上均值的平方"],
                  t(
                    `$E[X^2] = \\frac{1}{${den}} + \\frac{1}{${den}} = \\frac{2}{${den}}${lowestTerms(2, den)}$.`,
                    `$E[X^2] = \\frac{1}{${den}} + \\frac{1}{${den}} = \\frac{2}{${den}}${lowestTerms(2, den)}$。`,
                  ),
                ],
              ],
              t(
                `$E[X^2] - (E[X])^2 = \\frac{2}{${den}} - \\frac{1}{${den}} = \\frac{1}{${den}}$, the variance.`,
                `$E[X^2] - (E[X])^2 = \\frac{2}{${den}} - \\frac{1}{${den}} = \\frac{1}{${den}}$，正是方差。`,
              ),
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
    intro: t(
      "The gamma function turns factorials into a function of a real number: $\\Gamma(6) = 5! = 120$. Its recurrence $\\Gamma(\\alpha + 1) = \\alpha\\Gamma(\\alpha)$ also handles half integers: $\\frac{\\Gamma(\\frac{7}{2})}{\\Gamma(\\frac{3}{2})} = \\frac{5}{2} \\cdot \\frac{3}{2} = \\frac{15}{4}$.\n\nCheck: $\\Gamma(6) = 5 \\cdot \\Gamma(5) = 5 \\cdot 24 = 120$ by the recurrence as well.\n\nIn this lesson we evaluate ratios of gamma values at integers and half integers, and simplify ratios of values two apart.",
      "伽马函数把阶乘变成实数的函数：$\\Gamma(6) = 5! = 120$。它的递推公式 $\\Gamma(\\alpha + 1) = \\alpha\\Gamma(\\alpha)$ 也适用于半整数：$\\frac{\\Gamma(\\frac{7}{2})}{\\Gamma(\\frac{3}{2})} = \\frac{5}{2} \\cdot \\frac{3}{2} = \\frac{15}{4}$。\n\n检验：由递推公式同样有 $\\Gamma(6) = 5 \\cdot \\Gamma(5) = 5 \\cdot 24 = 120$。\n\n本课我们计算伽马函数在整数和半整数处的值之比，并化简相差二的两个值之比。",
    ),
    prerequisites: ["improper-integrals-involving-exponential-functions"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "gamma-function-integer-values",
        title: t("Evaluating Gamma function ratios for positive integers", "计算正整数伽马函数的比值"),
        explanation: t(
          "The gamma function extends the factorial, shifted by one, so ratios of its values at integers become ratios of factorials that mostly cancel. For positive integers, $\\Gamma(n) = (n - 1)!$, so $\\dfrac{\\Gamma(n)}{\\Gamma(m)} = \\dfrac{(n - 1)!}{(m - 1)!}$. For example, $\\frac{\\Gamma(40)}{\\Gamma(37)} = \\frac{39!}{36!} = 39 \\cdot 38 \\cdot 37 = 54834$.\n\n> **Watch out.** The factors run from $m$ up to $n - 1$, not up to $n$, because $\\Gamma(n) = (n - 1)!$; and a ratio of gamma values is not the ratio or difference of the arguments.",
          "伽马函数推广了阶乘（相差一位），所以它在整数处的值之比就是阶乘之比，大部分可以约去。对正整数，$\\Gamma(n) = (n - 1)!$，因此 $\\dfrac{\\Gamma(n)}{\\Gamma(m)} = \\dfrac{(n - 1)!}{(m - 1)!}$。例如 $\\frac{\\Gamma(40)}{\\Gamma(37)} = \\frac{39!}{36!} = 39 \\cdot 38 \\cdot 37 = 54834$。\n\n> **注意。** 因子从 $m$ 一直乘到 $n - 1$，而不是到 $n$，因为 $\\Gamma(n) = (n - 1)!$；伽马函数值之比也不是自变量之比或之差。",
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
            mistakes: distinct(prod, [
              why(
                prod * n,
                `That multiplies up to $${n}$; since $\\Gamma(${n}) = ${n - 1}!$, the last factor is $${n - 1}$.`,
                `那是一直乘到 $${n}$；由于 $\\Gamma(${n}) = ${n - 1}!$，最后一个因子是 $${n - 1}$。`,
              ),
              why(n - m, "That subtracts the arguments instead of dividing the gamma values.", "那是自变量相减，而不是伽马函数值相除。"),
              why(Q.of(n, m), "That divides the arguments instead of the gamma values.", "那是自变量相除，而不是伽马函数值相除。"),
            ]),
            solution: walked(
              [
                [
                  ["Write factorials", "写成阶乘"],
                  t(
                    `$\\frac{\\Gamma(${n})}{\\Gamma(${m})} = \\frac{${n - 1}!}{${m - 1}!}$.`,
                    `$\\frac{\\Gamma(${n})}{\\Gamma(${m})} = \\frac{${n - 1}!}{${m - 1}!}$。`,
                  ),
                ],
                [
                  ["Cancel", "约分"],
                  t(
                    `What remains is $${Array.from({ length: diff }, (_, i) => n - 1 - i).join(" \\cdot ")} = ${prod}$.`,
                    `剩下 $${Array.from({ length: diff }, (_, i) => n - 1 - i).join(" \\cdot ")} = ${prod}$。`,
                  ),
                ],
              ],
              t(
                `$\\Gamma(${n}) = ${prod} \\cdot \\Gamma(${m})$ by applying $\\Gamma(\\alpha + 1) = \\alpha\\Gamma(\\alpha)$ $${diff}$ ${diff === 1 ? "time" : "times"}.`,
                `应用 $\\Gamma(\\alpha + 1) = \\alpha\\Gamma(\\alpha)$ 共 $${diff}$ 次，得 $\\Gamma(${n}) = ${prod} \\cdot \\Gamma(${m})$。`,
              ),
            ),
          });
        },
      },
      {
        id: "gamma-function-half-integer",
        title: t("Applying recurrence for half-integer Gamma values", "应用递推公式计算半整数伽马函数比值"),
        explanation: t(
          "The recurrence lowers the argument one step at a time, so a ratio of values at half integers becomes a product of a few half integer factors. Using $\\Gamma(\\alpha + 1) = \\alpha \\Gamma(\\alpha)$, $\\frac{\\Gamma(a + \\frac{1}{2})}{\\Gamma(b + \\frac{1}{2})} = \\prod_{k=b}^{a-1} \\left(k + \\frac{1}{2}\\right)$. For example, $\\frac{\\Gamma(\\frac{45}{2})}{\\Gamma(\\frac{41}{2})} = \\frac{43}{2} \\cdot \\frac{41}{2} = \\frac{1763}{4}$.\n\n> **Watch out.** Each step lowers the argument by $1$ and contributes the lowered argument as a factor: the top argument itself is not a factor, and the ratio is not the ratio of the arguments.",
          "递推关系一次把自变量降低 1，所以在半整数处的值之比就变成几个半整数因子的乘积。利用 $\\Gamma(\\alpha + 1) = \\alpha \\Gamma(\\alpha)$，可得 $\\frac{\\Gamma(a + \\frac{1}{2})}{\\Gamma(b + \\frac{1}{2})} = \\prod_{k=b}^{a-1} \\left(k + \\frac{1}{2}\\right)$。例如 $\\frac{\\Gamma(\\frac{45}{2})}{\\Gamma(\\frac{41}{2})} = \\frac{43}{2} \\cdot \\frac{41}{2} = \\frac{1763}{4}$。\n\n> **注意。** 每一步把自变量降低 $1$，并以降低后的自变量作为因子：顶上的自变量本身不是因子，比值也不是自变量之比。",
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
          const factors = Array.from({ length: diff }, (_, i) => `\\frac{${numA - 2 - 2 * i}}{2}`).join(" \\cdot ");

          return numberProblem({
            prompt: t(
              `Using the recurrence $\\Gamma(\\alpha + 1) = \\alpha \\Gamma(\\alpha)$, evaluate the ratio $\\frac{\\Gamma\\left(\\frac{${numA}}{2}\\right)}{\\Gamma\\left(\\frac{${numB}}{2}\\right)}$.`,
              `利用递推公式 $\\Gamma(\\alpha + 1) = \\alpha \\Gamma(\\alpha)$，计算比值 $\\frac{\\Gamma\\left(\\frac{${numA}}{2}\\right)}{\\Gamma\\left(\\frac{${numB}}{2}\\right)}$。`,
            ),
            answer: Q.of(num, den),
            mistakes: distinct(Q.of(num, den), [
              why(Q.of(numA, numB), "That divides the arguments instead of the gamma values.", "那是自变量相除，而不是伽马函数值相除。"),
              why(Q.of(num, den * 2), "That has an extra factor $\\frac{1}{2}$.", "那多了一个因子 $\\frac{1}{2}$。"),
              why(
                Q.of(numA - 2, 2),
                diff === 1
                  ? "That is the only factor, so it coincides with the answer."
                  : "That keeps only the first factor of the product.",
                diff === 1 ? "那是唯一的因子，所以与答案相同。" : "那只保留了乘积中的第一个因子。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Lower the argument step by step", "逐步降低自变量"],
                  t(
                    `$\\Gamma\\left(\\frac{${numA}}{2}\\right) = ${factors} \\cdot \\Gamma\\left(\\frac{${numB}}{2}\\right)$.`,
                    `$\\Gamma\\left(\\frac{${numA}}{2}\\right) = ${factors} \\cdot \\Gamma\\left(\\frac{${numB}}{2}\\right)$。`,
                  ),
                ],
                [
                  ["Divide and multiply out", "相除并乘出"],
                  t(
                    `The ratio is $${factors} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `比值为 $${factors} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              t(
                `There are $${diff}$ ${diff === 1 ? "factor" : "factors"}, one for each step from $\\frac{${numB}}{2}$ up to $\\frac{${numA}}{2}$, and the largest is $\\frac{${numA - 2}}{2}$.`,
                `共有 $${diff}$ 个因子，从 $\\frac{${numB}}{2}$ 到 $\\frac{${numA}}{2}$ 每升一步一个，最大的是 $\\frac{${numA - 2}}{2}$。`,
              ),
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
    intro: t(
      "Waiting for the $20$th event of a process with rate $5$ per hour means adding $20$ independent $\\text{Exp}(5)$ gaps, so the wait is $\\text{Gamma}(20, 5)$, with mean $\\frac{20}{5} = 4$ hours and variance $\\frac{20}{25} = \\frac{4}{5}$.\n\nCheck: each gap has mean $\\frac{1}{5}$ and variance $\\frac{1}{25}$, and $20$ of them give $4$ and $\\frac{20}{25}$.\n\nIn this lesson we find the mean and variance of a gamma distribution, recognize it as a sum of exponentials, find its mode and read the shape from the peak of its curve.",
      "等待速率为每小时 $5$ 次的过程中第 $20$ 个事件，就是把 $20$ 个独立的 $\\text{Exp}(5)$ 间隔相加，所以等待时间服从 $\\text{Gamma}(20, 5)$，均值为 $\\frac{20}{5} = 4$ 小时，方差为 $\\frac{20}{25} = \\frac{4}{5}$。\n\n检验：每个间隔的均值为 $\\frac{1}{5}$，方差为 $\\frac{1}{25}$，$20$ 个相加得 $4$ 与 $\\frac{20}{25}$。\n\n本课我们求伽马分布的均值和方差，把它看作指数变量之和，求它的众数，并从曲线的峰值读出形状参数。",
    ),
    prerequisites: ["the-gamma-function", "the-exponential-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "gamma-distribution-mean-variance",
        title: t("Computing the mean and variance of a Gamma distribution", "计算伽马分布的期望与方差"),
        explanation: t(
          "A gamma variable with whole number shape is a sum of independent exponential waits, which explains why its mean and variance grow with the shape. For $X \\sim \\text{Gamma}(\\alpha, \\beta)$ with shape $\\alpha$ and rate $\\beta$, $E[X] = \\frac{\\alpha}{\\beta}$ and $\\operatorname{Var}(X) = \\frac{\\alpha}{\\beta^2}$. For $\\text{Gamma}(30, 10)$, $\\operatorname{Var}(X) = \\frac{30}{100} = \\frac{3}{10}$.\n\n> **Watch out.** With a rate $\\beta$, divide by $\\beta^2$; multiplying by $\\beta$ or $\\beta^2$ treats it as a scale. And $\\frac{\\alpha}{\\beta}$ is the mean, not the variance.",
          "形状参数为整数的伽马变量是若干个独立指数等待之和，这解释了为什么它的均值和方差随形状参数增大。对于形状参数为 $\\alpha$、比率参数为 $\\beta$ 的伽马分布 $X \\sim \\text{Gamma}(\\alpha, \\beta)$，其均值为 $E[X] = \\frac{\\alpha}{\\beta}$，方差为 $\\operatorname{Var}(X) = \\frac{\\alpha}{\\beta^2}$。对于 $\\text{Gamma}(30, 10)$，$\\operatorname{Var}(X) = \\frac{30}{100} = \\frac{3}{10}$。\n\n> **注意。** 对比率参数 $\\beta$，要除以 $\\beta^2$；乘以 $\\beta$ 或 $\\beta^2$ 是把它当作尺度参数。$\\frac{\\alpha}{\\beta}$ 是均值，不是方差。",
        ),
        generate: (rng: Rng): Problem => {
          const alpha = rng.int(2, 12);
          const beta = rng.int(2, 8);
          const varDen = beta * beta;

          return numberProblem({
            prompt: t(
              `A random variable $X \\sim \\text{Gamma}(\\alpha = ${alpha}, \\beta = ${beta})$ has shape parameter $\\alpha = ${alpha}$ and rate parameter $\\beta = ${beta}$. Find its variance $\\text{Var}(X)$.`,
              `随机变量 $X \\sim \\text{Gamma}(\\alpha = ${alpha}, \\beta = ${beta})$ 的形状参数为 $\\alpha = ${alpha}$，比率参数为 $\\beta = ${beta}$。求其方差 $\\text{Var}(X)$。`,
            ),
            answer: Q.of(alpha, varDen),
            mistakes: distinct(Q.of(alpha, varDen), [
              why(
                Q.of(alpha, beta),
                "That is the mean $\\frac{\\alpha}{\\beta}$, not the variance.",
                "那是均值 $\\frac{\\alpha}{\\beta}$，不是方差。",
              ),
              why(
                alpha * beta,
                "That multiplies by the rate, as if $\\beta$ were a scale.",
                "那是乘以比率参数，就像 $\\beta$ 是尺度参数一样。",
              ),
              why(alpha * beta * beta, "That multiplies by $\\beta^2$ instead of dividing by it.", "那是乘以 $\\beta^2$，而不是除以它。"),
            ]),
            solution: walked(
              [
                [
                  ["Use the formula", "使用公式"],
                  t(
                    `$\\text{Var}(X) = \\frac{\\alpha}{\\beta^2} = \\frac{${alpha}}{${beta}^2}$.`,
                    `$\\text{Var}(X) = \\frac{\\alpha}{\\beta^2} = \\frac{${alpha}}{${beta}^2}$。`,
                  ),
                ],
                [
                  ["Simplify", "化简"],
                  t(
                    `$\\frac{${alpha}}{${varDen}}${lowestTerms(alpha, varDen)}$.`,
                    `$\\frac{${alpha}}{${varDen}}${lowestTerms(alpha, varDen)}$。`,
                  ),
                ],
              ],
              t(
                `As a sum of $${alpha}$ exponential gaps, each of variance $\\frac{1}{${varDen}}$, the variance is $${alpha} \\cdot \\frac{1}{${varDen}} = \\frac{${alpha}}{${varDen}}$.`,
                `作为 $${alpha}$ 个方差为 $\\frac{1}{${varDen}}$ 的指数间隔之和，方差为 $${alpha} \\cdot \\frac{1}{${varDen}} = \\frac{${alpha}}{${varDen}}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "gamma-sum-of-exponentials",
        title: t("Gamma distribution as a sum of independent exponentials", "伽马分布作为独立指数变量之和"),
        explanation: t(
          "Waiting for several events of a Poisson process means adding the independent exponential gaps between them, which gives a gamma distribution. The sum of $n$ independent and identically distributed $\\text{Exp}(\\lambda)$ variables follows $\\text{Gamma}(n, \\lambda)$. So $20$ independent $\\text{Exp}(50)$ waits add up to $\\text{Gamma}(20, 50)$.\n\n> **Watch out.** The number of terms is the shape and the common rate stays the rate; do not swap them. $\\text{Exp}(n\\lambda)$ is the first of the waits, not their sum.",
          "等待泊松过程中的若干个事件，就是把它们之间独立的指数间隔加起来，结果服从伽马分布。$n$ 个独立同分布的 $\\text{Exp}(\\lambda)$ 随机变量之和服从伽马分布 $\\text{Gamma}(n, \\lambda)$。所以 $20$ 个独立的 $\\text{Exp}(50)$ 等待时间之和服从 $\\text{Gamma}(20, 50)$。\n\n> **注意。** 项数是形状参数，共同的速率仍是比率参数，不要互换。$\\text{Exp}(n\\lambda)$ 是这些等待中最早的那个，不是它们的和。",
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

          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $X_1, X_2, \\dots, X_{${n}}$ be independent and identically distributed random variables, each with distribution $\\text{Exp}(${lambda})$. What is the exact distribution of their sum $S = \\sum_{i=1}^{${n}} X_i$?`,
                `设 $X_1, X_2, \\dots, X_{${n}}$ 为独立同分布的随机变量，各自服从指数分布 $\\text{Exp}(${lambda})$。其和 $S = \\sum_{i=1}^{${n}} X_i$ 的精确分布是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Count the terms", "数项数"],
                    t(`There are $${n}$ independent terms, so the shape is $${n}$.`, `共有 $${n}$ 个独立的项，所以形状参数为 $${n}$。`),
                  ],
                  [
                    ["Keep the rate", "保留速率"],
                    t(
                      `Each term has rate $${lambda}$, which stays the rate: $S \\sim \\text{Gamma}(${n}, ${lambda})$.`,
                      `每一项的速率为 $${lambda}$，它仍是比率参数：$S \\sim \\text{Gamma}(${n}, ${lambda})$。`,
                    ),
                  ],
                ],
                t(
                  `$E[S] = ${n} \\cdot \\frac{1}{${lambda}} = \\frac{${n}}{${lambda}}$, which is the mean $\\frac{\\alpha}{\\beta}$ of $\\text{Gamma}(${n}, ${lambda})$.`,
                  `$E[S] = ${n} \\cdot \\frac{1}{${lambda}} = \\frac{${n}}{${lambda}}$，正是 $\\text{Gamma}(${n}, ${lambda})$ 的均值 $\\frac{\\alpha}{\\beta}$。`,
                ),
              ),
            }),
            [
              [opts[1]!.en, "That swaps the shape and the rate.", "那是把形状参数与比率参数互换了。"],
              [
                opts[2]!.en,
                "That is the distribution of the smallest of the waits, not of their sum.",
                "那是这些等待中最小者的分布，不是它们之和的分布。",
              ],
              [
                opts[3]!.en,
                "A sum of a fixed number of exponentials is gamma exactly, not normal, and its mean is not this.",
                "固定个数的指数变量之和恰好服从伽马分布，不是正态分布，均值也不是这个。",
              ],
            ],
          );
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
    intro: t(
      "Adding the squares of $60$ independent standard normal variables gives $W \\sim \\chi^2(60)$. Each square has mean $1$ and variance $2$, so $E[W] = 60$ and $\\operatorname{Var}(W) = 120$.\n\nCheck: $\\chi^2(60)$ is $\\text{Gamma}(30, \\frac{1}{2})$, whose mean $\\frac{30}{1/2} = 60$ agrees.\n\nIn this lesson we define the chi-square distribution as a sum of squares, find its mean and variance, add independent chi-square variables and read the degrees of freedom from the peak of its curve.",
      "把 $60$ 个独立标准正态变量的平方相加，得到 $W \\sim \\chi^2(60)$。每个平方的均值为 $1$、方差为 $2$，所以 $E[W] = 60$，$\\operatorname{Var}(W) = 120$。\n\n检验：$\\chi^2(60)$ 就是 $\\text{Gamma}(30, \\frac{1}{2})$，其均值 $\\frac{30}{1/2} = 60$ 与之一致。\n\n本课我们把卡方分布定义为平方和，求它的均值和方差，把独立的卡方变量相加，并从曲线的峰值读出自由度。",
    ),
    prerequisites: ["the-gamma-distribution", "the-standard-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "chi-square-sum-of-normals",
        title: t("Definition of Chi-square as sum of squared standard normals", "卡方分布作为标准正态变量平方和的定义"),
        explanation: t(
          "Adding the squares of independent standard normal variables gives a chi square variable, whose degrees of freedom count the squares added. If $Z_1, \\dots, Z_k$ are independent $N(0, 1)$ variables, then $\\sum_{i=1}^k Z_i^2 \\sim \\chi^2(k)$. So the squares of $100$ independent standard normals add up to $\\chi^2(100)$.\n\n> **Watch out.** The degrees of freedom count the squared terms, one each, not two; and a sum of squares is never negative, so it cannot be normal.",
          "把独立标准正态变量的平方相加，得到卡方变量，它的自由度就是相加的平方的个数。若 $Z_1, \\dots, Z_k$ 相互独立且服从 $N(0, 1)$，则 $\\sum_{i=1}^k Z_i^2 \\sim \\chi^2(k)$。所以 $100$ 个独立标准正态变量的平方和服从 $\\chi^2(100)$。\n\n> **注意。** 自由度等于平方项的个数，每项算一个，而不是两个；平方和不会是负的，所以不可能服从正态分布。",
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
          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $Z_1, Z_2, \\dots, Z_{${k}}$ be independent standard normal random variables, $Z_i \\sim N(0, 1)$. What is the distribution of $W = \\sum_{i=1}^{${k}} Z_i^2$?`,
                `设 $Z_1, Z_2, \\dots, Z_{${k}}$ 为相互独立且均服从标准正态分布 $Z_i \\sim N(0, 1)$ 的随机变量。变量 $W = \\sum_{i=1}^{${k}} Z_i^2$ 服从什么分布？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Count the squares", "数平方项"],
                    t(`$W$ adds $${k}$ squares of independent standard normals.`, `$W$ 是 $${k}$ 个独立标准正态变量的平方之和。`),
                  ],
                  [
                    ["Name the distribution", "写出分布"],
                    t(
                      `By definition, $W \\sim \\chi^2(${k})$, with one degree of freedom per square.`,
                      `根据定义，$W \\sim \\chi^2(${k})$，每个平方项贡献一个自由度。`,
                    ),
                  ],
                ],
                t(
                  `Each $Z_i^2$ has mean $1$, so $E[W] = ${k}$, the mean of $\\chi^2(${k})$.`,
                  `每个 $Z_i^2$ 的均值为 $1$，所以 $E[W] = ${k}$，正是 $\\chi^2(${k})$ 的均值。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "A sum of squares is never negative, and a normal variable takes negative values.",
                "平方和不会是负的，而正态变量可以取负值。",
              ],
              [
                opts[2]!.en,
                "The $t$ distribution is a ratio built from a normal and a chi-square, not a sum of squares.",
                "$t$ 分布是由正态和卡方构成的比值，不是平方和。",
              ],
              [
                opts[3]!.en,
                `The degrees of freedom count the squared terms, so there are $${k}$, not twice that.`,
                `自由度等于平方项的个数，所以是 $${k}$，不是它的两倍。`,
              ],
            ],
          );
        },
      },
      {
        id: "chi-square-mean-and-variance",
        title: t("Moments of a Chi-square distribution", "卡方分布的数字特征"),
        explanation: t(
          "Each squared standard normal has mean one and variance two, so a sum of them has mean and variance proportional to the degrees of freedom. For $X \\sim \\chi^2(k)$, $E[X] = k$ and $\\operatorname{Var}(X) = 2k$. For $\\chi^2(80)$, $\\operatorname{Var}(X) = 160$.\n\n> **Watch out.** The variance is $2k$, twice the mean: it is not $k$, which is the mean, and not $k^2$.",
          "每个标准正态变量的平方均值为 1、方差为 2，所以它们的和的均值和方差都与自由度成正比。对于 $X \\sim \\chi^2(k)$，期望为 $E[X] = k$，方差为 $\\operatorname{Var}(X) = 2k$。对于 $\\chi^2(80)$，$\\operatorname{Var}(X) = 160$。\n\n> **注意。** 方差是 $2k$，等于均值的两倍：它不是均值 $k$，也不是 $k^2$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(3, 50);

          return numberProblem({
            prompt: t(
              `A random variable follows a Chi-square distribution with $k = ${k}$ degrees of freedom: $X \\sim \\chi^2(${k})$. Find the variance $\\text{Var}(X)$.`,
              `随机变量服从自由度为 $k = ${k}$ 的卡方分布：$X \\sim \\chi^2(${k})$。求其方差 $\\text{Var}(X)$。`,
            ),
            answer: 2 * k,
            mistakes: distinct(2 * k, [
              why(k, "That is the mean; the variance is twice it.", "那是均值；方差是它的两倍。"),
              why(k * k, "That squares the degrees of freedom.", "那是把自由度平方了。"),
              why(4 * k, "That doubles the variance again.", "那是把方差又加倍了。"),
            ]),
            solution: walked(
              [
                [
                  ["Write as a sum", "写成和"],
                  t(
                    `$X$ is a sum of $${k}$ independent $Z_i^2$, each with variance $2$.`,
                    `$X$ 是 $${k}$ 个独立的 $Z_i^2$ 之和，每个的方差为 $2$。`,
                  ),
                ],
                [
                  ["Add the variances", "方差相加"],
                  t(`$\\text{Var}(X) = 2 \\cdot ${k} = ${2 * k}$.`, `$\\text{Var}(X) = 2 \\cdot ${k} = ${2 * k}$。`),
                ],
              ],
              t(
                `As $\\text{Gamma}(\\frac{${k}}{2}, \\frac{1}{2})$, the variance is $\\frac{${k}/2}{1/4} = ${2 * k}$.`,
                `作为 $\\text{Gamma}(\\frac{${k}}{2}, \\frac{1}{2})$，方差为 $\\frac{${k}/2}{1/4} = ${2 * k}$。`,
              ),
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
    intro: t(
      "A $t$ variable with $52$ degrees of freedom has variance $\\frac{52}{52 - 2} = \\frac{52}{50} = \\frac{26}{25}$, a little more than the variance $1$ of $N(0, 1)$, because its tails are heavier.\n\nCheck: $\\frac{26}{25} = 1.04$, which is above $1$ and close to it, as it should be for many degrees of freedom.\n\nIn this lesson we build the $t$ ratio from a normal and a chi-square, find its variance, choose the degrees of freedom for a target variance and tell $t$ from the normal by its tails.",
      "自由度为 $52$ 的 $t$ 变量的方差为 $\\frac{52}{52 - 2} = \\frac{52}{50} = \\frac{26}{25}$，比 $N(0, 1)$ 的方差 $1$ 略大，因为它的尾部更厚。\n\n检验：$\\frac{26}{25} = 1.04$，大于 $1$ 且接近 $1$，这正是自由度较大时应有的结果。\n\n本课我们由正态变量和卡方变量构造 $t$ 比值，求它的方差，按目标方差选择自由度，并从尾部区分 $t$ 分布与正态分布。",
    ),
    prerequisites: ["the-chi-square-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "t-distribution-ratio-definition",
        title: t("Formulation of the Student's t ratio", "学生 t 分布的比值构造形式"),
        explanation: t(
          "The t distribution arises when a standard normal is divided by an estimate of its scale built from an independent chi square variable. $T = \\frac{Z}{\\sqrt{V / \\nu}}$, where $Z \\sim N(0, 1)$ and $V \\sim \\chi^2(\\nu)$ are independent. So with $V \\sim \\chi^2(60)$, $\\frac{Z}{\\sqrt{V / 60}} \\sim t(60)$.\n\n> **Watch out.** The square root and the division by $\\nu$ both matter: a normal over a chi-square is not normal, and the ratio of two chi-squares, not this one, is $F$.",
          "当一个标准正态变量除以由独立的卡方变量构造的尺度估计时，就得到 t 分布。$T = \\frac{Z}{\\sqrt{V / \\nu}}$，其中 $Z \\sim N(0, 1)$ 与 $V \\sim \\chi^2(\\nu)$ 相互独立。所以当 $V \\sim \\chi^2(60)$ 时，$\\frac{Z}{\\sqrt{V / 60}} \\sim t(60)$。\n\n> **注意。** 平方根与除以 $\\nu$ 都不能少：正态变量除以卡方变量不再服从正态分布，而服从 $F$ 分布的是两个卡方变量之比，不是这个比值。",
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

          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $Z \\sim N(0, 1)$ and $V \\sim \\chi^2(${nu})$ be independent random variables. What is the distribution of the ratio $T = \\frac{Z}{\\sqrt{V / ${nu}}}$?`,
                `设 $Z \\sim N(0, 1)$ 与 $V \\sim \\chi^2(${nu})$ 为相互独立的随机变量。比值 $T = \\frac{Z}{\\sqrt{V / ${nu}}}$ 服从什么分布？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Identify the parts", "识别各部分"],
                    t(
                      `The numerator is a standard normal; the denominator is the root of an independent $\\chi^2(${nu})$ divided by $${nu}$.`,
                      `分子是标准正态变量；分母是独立的 $\\chi^2(${nu})$ 除以 $${nu}$ 后的平方根。`,
                    ),
                  ],
                  [["Name the distribution", "写出分布"], t(`By definition, $T \\sim t(${nu})$.`, `根据定义，$T \\sim t(${nu})$。`)],
                ],
                t(
                  `$T^2 = \\frac{Z^2 / 1}{V / ${nu}}$ is a ratio of chi-squares over their degrees of freedom, so $T^2 \\sim F(1, ${nu})$, which agrees with $T \\sim t(${nu})$.`,
                  `$T^2 = \\frac{Z^2 / 1}{V / ${nu}}$ 是两个卡方变量各除以自由度之比，所以 $T^2 \\sim F(1, ${nu})$，与 $T \\sim t(${nu})$ 一致。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "Dividing by the root of a chi-square changes the shape; $T$ is not normal.",
                "除以卡方变量的平方根会改变形状；$T$ 不服从正态分布。",
              ],
              [opts[2]!.en, "That is the distribution of $T^2$, not of $T$.", "那是 $T^2$ 的分布，不是 $T$ 的分布。"],
              [opts[3]!.en, "That is the distribution of $V$ alone, and $T$ can be negative.", "那只是 $V$ 的分布，而 $T$ 可以取负值。"],
            ],
          );
        },
      },
      {
        id: "t-distribution-variance",
        title: t("Variance of the Student's t-distribution", "学生 t 分布的方差"),
        explanation: t(
          "The t distribution has heavier tails than the normal, so its variance is greater than one, approaching one as the degrees of freedom grow. For $T \\sim t(\\nu)$ with $\\nu > 2$, $\\operatorname{Var}(T) = \\frac{\\nu}{\\nu - 2}$. For $t(102)$, $\\operatorname{Var}(T) = \\frac{102}{100} = \\frac{51}{50}$.\n\n> **Watch out.** Subtract $2$ in the denominator, not $1$, and keep $\\nu$ on top: the variance is above $1$, never $1$ or below.",
          "t 分布的尾部比正态分布更厚，所以它的方差大于 1，并随着自由度增大而趋于 1。对于自由度 $\\nu > 2$ 的 $T \\sim t(\\nu)$，方差为 $\\operatorname{Var}(T) = \\frac{\\nu}{\\nu - 2}$。对于 $t(102)$，$\\operatorname{Var}(T) = \\frac{102}{100} = \\frac{51}{50}$。\n\n> **注意。** 分母减去的是 $2$，不是 $1$，并且 $\\nu$ 在分子上：方差大于 $1$，不会等于或小于 $1$。",
        ),
        generate: (rng: Rng): Problem => {
          const nu = rng.int(3, 40);

          return numberProblem({
            prompt: t(
              `Find the variance $\\text{Var}(T)$ of a random variable $T$ following Student's $t$-distribution with $\\nu = ${nu}$ degrees of freedom.`,
              `求服从自由度为 $\\nu = ${nu}$ 的学生 $t$ 分布的随机变量 $T$ 的方差 $\\text{Var}(T)$。`,
            ),
            answer: Q.of(nu, nu - 2),
            mistakes: distinct(Q.of(nu, nu - 2), [
              why(Q.of(nu, nu - 1), "That subtracts $1$ in the denominator instead of $2$.", "那是在分母中减去 $1$，而不是 $2$。"),
              why(
                Q.of(nu - 2, nu),
                "That turns the fraction upside down, giving a variance below $1$.",
                "那是把分数倒过来了，得到小于 $1$ 的方差。",
              ),
              why(
                1,
                "That is the variance of $N(0, 1)$; the heavier tails of $t$ make it larger.",
                "那是 $N(0, 1)$ 的方差；$t$ 分布的尾部更厚，方差更大。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Use the formula", "使用公式"],
                  t(
                    `$\\text{Var}(T) = \\frac{\\nu}{\\nu - 2} = \\frac{${nu}}{${nu} - 2}$.`,
                    `$\\text{Var}(T) = \\frac{\\nu}{\\nu - 2} = \\frac{${nu}}{${nu} - 2}$。`,
                  ),
                ],
                [
                  ["Simplify", "化简"],
                  t(`$\\frac{${nu}}{${nu - 2}}${lowestTerms(nu, nu - 2)}$.`, `$\\frac{${nu}}{${nu - 2}}${lowestTerms(nu, nu - 2)}$。`),
                ],
              ],
              t(
                `The numerator $${nu}$ exceeds the denominator $${nu - 2}$, so the variance is above $1$, as heavier tails require.`,
                `分子 $${nu}$ 大于分母 $${nu - 2}$，所以方差大于 $1$，符合尾部更厚的特点。`,
              ),
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
    intro: t(
      "If $U \\sim \\chi^2(4)$ and $V \\sim \\chi^2(42)$ are independent, then $\\frac{U/4}{V/42} \\sim F(4, 42)$, with mean $\\frac{42}{42 - 2} = \\frac{42}{40} = \\frac{21}{20}$.\n\nCheck: the mean uses only the denominator's $42$, and $\\frac{21}{20}$ is a little above $1$, as the ratio of two estimates of the same variance should be.\n\nIn this lesson we build the $F$ ratio from two chi-squares, find its mean and turn an upper $F$ quantile into a lower one.",
      "若 $U \\sim \\chi^2(4)$ 与 $V \\sim \\chi^2(42)$ 相互独立，则 $\\frac{U/4}{V/42} \\sim F(4, 42)$，均值为 $\\frac{42}{42 - 2} = \\frac{42}{40} = \\frac{21}{20}$。\n\n检验：均值只用到分母的 $42$，而 $\\frac{21}{20}$ 略大于 $1$，正如同一方差的两个估计之比应有的那样。\n\n本课我们由两个卡方变量构造 $F$ 比值，求它的均值，并把 $F$ 分布的上分位数转化为下分位数。",
    ),
    prerequisites: ["the-chi-square-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "f-distribution-ratio-definition",
        title: t("Defining the F-ratio from independent Chi-squares", "由独立卡方变量定义 F 比值"),
        explanation: t(
          "The F distribution compares two independent estimates of variance, each scaled by its degrees of freedom, by taking their ratio. $F = \\frac{U / d_1}{V / d_2}$, where $U \\sim \\chi^2(d_1)$ and $V \\sim \\chi^2(d_2)$ are independent. So with $U \\sim \\chi^2(30)$ and $V \\sim \\chi^2(45)$, $\\frac{U / 30}{V / 45} \\sim F(30, 45)$.\n\n> **Watch out.** The numerator's degrees of freedom come first; swapping them gives the distribution of the reciprocal. The degrees of freedom are not added, because this is a ratio, not a sum.",
          "F 分布通过取比值来比较两个独立的方差估计，每个估计都除以它的自由度。$F = \\frac{U / d_1}{V / d_2}$，其中 $U \\sim \\chi^2(d_1)$ 与 $V \\sim \\chi^2(d_2)$ 相互独立。所以当 $U \\sim \\chi^2(30)$、$V \\sim \\chi^2(45)$ 时，$\\frac{U / 30}{V / 45} \\sim F(30, 45)$。\n\n> **注意。** 分子的自由度写在前面；互换后得到的是倒数的分布。自由度不相加，因为这是比值，不是和。",
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
          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $U \\sim \\chi^2(${d1})$ and $V \\sim \\chi^2(${d2})$ be independent Chi-square random variables. What is the distribution of the ratio $W = \\frac{U / ${d1}}{V / ${d2}}$?`,
                `设 $U \\sim \\chi^2(${d1})$ 与 $V \\sim \\chi^2(${d2})$ 为相互独立的卡方随机变量。比值 $W = \\frac{U / ${d1}}{V / ${d2}}$ 服从什么分布？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Read the numerator", "读分子"],
                    t(
                      `The numerator is $\\chi^2(${d1})$ over $${d1}$, so $d_1 = ${d1}$.`,
                      `分子是 $\\chi^2(${d1})$ 除以 $${d1}$，所以 $d_1 = ${d1}$。`,
                    ),
                  ],
                  [
                    ["Read the denominator", "读分母"],
                    t(
                      `The denominator is $\\chi^2(${d2})$ over $${d2}$, so $d_2 = ${d2}$ and $W \\sim F(${d1}, ${d2})$.`,
                      `分母是 $\\chi^2(${d2})$ 除以 $${d2}$，所以 $d_2 = ${d2}$，$W \\sim F(${d1}, ${d2})$。`,
                    ),
                  ],
                ],
                t(
                  `Then $\\frac{1}{W} = \\frac{V / ${d2}}{U / ${d1}} \\sim F(${d2}, ${d1})$, the other order, which is why the order matters.`,
                  `于是 $\\frac{1}{W} = \\frac{V / ${d2}}{U / ${d1}} \\sim F(${d2}, ${d1})$，次序相反，这说明次序不能弄错。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "The degrees of freedom are in the wrong order: the numerator's come first.",
                "自由度的次序反了：分子的自由度在前。",
              ],
              [
                opts[2]!.en,
                "A $t$ variable is a normal over the root of a chi-square, and here both parts are chi-squares.",
                "$t$ 变量是正态变量除以卡方变量的平方根，而这里两部分都是卡方变量。",
              ],
              [
                opts[3]!.en,
                "Adding the degrees of freedom belongs to a sum of chi-squares, and this is a ratio.",
                "自由度相加对应卡方变量的和，而这里是比值。",
              ],
            ],
          );
        },
      },
      {
        id: "f-distribution-mean",
        title: t("Mean of the F-distribution", "F 分布的均值"),
        explanation: t(
          "The mean of an $F$ variable depends only on the denominator degrees of freedom, and it is slightly greater than one, approaching one for large samples. For $X \\sim F(d_1, d_2)$ with $d_2 > 2$, $E[X] = \\frac{d_2}{d_2 - 2}$, depending only on denominator degrees of freedom. For $F(10, 62)$, $E[X] = \\frac{62}{60} = \\frac{31}{30}$.\n\n> **Watch out.** Use $d_2$, the denominator's degrees of freedom, in both places, and subtract $2$ rather than add it: the mean is above $1$.",
          "$F$ 变量的均值只取决于分母的自由度，它略大于 1，样本很大时趋于 1。对于 $d_2 > 2$ 的 $X \\sim F(d_1, d_2)$，其均值仅由分母自由度决定：$E[X] = \\frac{d_2}{d_2 - 2}$。对于 $F(10, 62)$，$E[X] = \\frac{62}{60} = \\frac{31}{30}$。\n\n> **注意。** 两处都用分母的自由度 $d_2$，并且是减去 $2$ 而不是加上 $2$：均值大于 $1$。",
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
            mistakes: distinct(Q.of(d2, d2 - 2), [
              why(
                Q.of(d1, d2 - 2),
                "That puts the numerator's degrees of freedom on top; the mean uses only $d_2$.",
                "那是把分子的自由度放在分子上；均值只用到 $d_2$。",
              ),
              why(
                Q.of(d2, d2 + 2),
                "That adds $2$ in the denominator instead of subtracting it.",
                "那是在分母中加上 $2$，而不是减去 $2$。",
              ),
              why(
                Q.of(d2 - 2, d2),
                "That turns the fraction upside down, giving a mean below $1$.",
                "那是把分数倒过来了，得到小于 $1$ 的均值。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Pick the denominator's degrees of freedom", "取分母的自由度"],
                  t(`The mean depends only on $d_2 = ${d2}$.`, `均值只取决于 $d_2 = ${d2}$。`),
                ],
                [
                  ["Use the formula", "使用公式"],
                  t(
                    `$E[X] = \\frac{d_2}{d_2 - 2} = \\frac{${d2}}{${d2} - 2} = \\frac{${d2}}{${d2 - 2}}${lowestTerms(d2, d2 - 2)}$.`,
                    `$E[X] = \\frac{d_2}{d_2 - 2} = \\frac{${d2}}{${d2} - 2} = \\frac{${d2}}{${d2 - 2}}${lowestTerms(d2, d2 - 2)}$。`,
                  ),
                ],
              ],
              t(
                `The numerator $${d2}$ exceeds the denominator $${d2 - 2}$, so the mean is above $1$, as it should be.`,
                `分子 $${d2}$ 大于分母 $${d2 - 2}$，所以均值大于 $1$，符合预期。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
