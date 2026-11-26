import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, dec, Q } from "@ga/subject-math";
import { choiceProblem, explainedChoice, isTerminating, lowestTerms, numberProblem, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** SIMPLE_PROPORTIONS lists sample proportions that keep the arithmetic exact. */
const SIMPLE_PROPORTIONS = [Q.of(1, 2), Q.of(1, 4), Q.of(3, 4), Q.of(1, 5), Q.of(2, 5), Q.of(3, 5), Q.of(4, 5)];

/** pickLevel picks a common confidence level and its two-sided $z$ critical value. */
const pickLevel = (rng: Rng): [number, Q] =>
  rng.pick([
    [90, Q.parse("1.645")],
    [95, Q.parse("1.96")],
    [99, Q.parse("2.576")],
  ] as [number, Q][]);

/** pickFpc picks a population size, a sample size and the exact finite population correction, the square root of (N - n) / (N - 1). */
const pickFpc = (rng: Rng): [number, number, Q] =>
  rng.pick([
    [101, 37, Q.of(4, 5)],
    [101, 20, Q.of(9, 10)],
    [101, 65, Q.of(3, 5)],
    [101, 52, Q.of(7, 10)],
    [401, 77, Q.of(9, 10)],
    [401, 257, Q.of(3, 5)],
    [401, 176, Q.of(3, 4)],
    [626, 226, Q.of(4, 5)],
    [626, 401, Q.of(3, 5)],
  ] as [number, number, Q][]);

/** apart keeps the explained mistakes that differ from the answer and from each other. */
const apart = <T extends { readonly value: Coefficient }>(answer: Coefficient, list: readonly T[]): T[] => {
  const asQ = (v: Coefficient) => (typeof v === "number" ? Q.of(v) : v);
  return list.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && list.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
};

/** round2 rounds a measured value to two decimal places. */
const round2 = (x: number): Q => Q.of(Math.round(x * 100), 100);

/** par writes a value in parentheses when it is negative. */
const par = (v: Q): string => (v.sign() < 0 ? `(${dec(v)})` : dec(v));

/** Topics for Unit 7: Confidence Intervals (new topics). */
export const probabilityAndStatisticsConfidenceIntervalTopics: TopicDef[] = [
  // 7.25.1 Confidence Intervals for One Mean: Known Population Variance
  {
    id: "confidence-intervals-for-one-mean-known-population-variance",
    title: t("Confidence Intervals for One Mean: Known Population Variance", "单总体均值的置信区间：已知总体方差"),
    summary: t(
      "When the population variance $\\sigma^2$ is known, a $100(1 - \\alpha)\\%$ confidence interval for the population mean $\\mu$ is $\\bar{x} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$.",
      "当总体方差 $\\sigma^2$ 已知时，总体均值 $\\mu$ 的 $100(1 - \\alpha)\\%$ 置信区间为 $\\bar{x} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$。",
    ),
    intro: t(
      "Twenty-five bolts are measured from a machine whose lengths have known standard deviation $\\sigma = 10$ millimetres, and their mean is $\\bar{x} = 80$. The sample mean varies with standard error $\\frac{\\sigma}{\\sqrt{n}} = \\frac{10}{5} = 2$, and $95\\%$ of a normal distribution lies within $1.96$ standard deviations of its centre. So the margin of error is $1.96 \\cdot 2 = 3.92$, and the $95\\%$ confidence interval for the machine's mean length $\\mu$ is $80 \\pm 3.92$, from $76.08$ to $83.92$.\n\nCheck: the interval is centred at $\\frac{76.08 + 83.92}{2} = 80$ and its width $83.92 - 76.08 = 7.84$ is twice the margin.\n\nIn this lesson we compute the margin of error $z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}$ and the endpoints of a confidence interval for a mean when $\\sigma$ is known.",
      "从一台机器上抽取 $25$ 个螺栓测量，长度的标准差已知为 $\\sigma = 10$ 毫米，样本均值为 $\\bar{x} = 80$。样本均值的标准误为 $\\frac{\\sigma}{\\sqrt{n}} = \\frac{10}{5} = 2$，而正态分布有 $95\\%$ 落在中心两侧 $1.96$ 个标准差以内。所以误差范围是 $1.96 \\cdot 2 = 3.92$，机器平均长度 $\\mu$ 的 $95\\%$ 置信区间为 $80 \\pm 3.92$，即从 $76.08$ 到 $83.92$。\n\n检验：区间中心为 $\\frac{76.08 + 83.92}{2} = 80$，宽度 $83.92 - 76.08 = 7.84$ 正好是误差范围的两倍。\n\n本课我们在 $\\sigma$ 已知时计算误差范围 $z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}$ 以及均值置信区间的端点。",
    ),
    prerequisites: ["the-central-limit-theorem", "percentage-points-of-the-standard-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "margin-of-error-known-variance",
        title: t("Calculating the margin of error with known variance", "计算已知总体方差下的误差范围"),
        explanation: t(
          "The margin of error is a critical value times the standard error, so it shrinks with larger samples and grows with higher confidence. The margin of error is $E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$.\n\nWith $n = 36$, $\\sigma = 12$ and $z_{\\alpha/2} = 2$: the standard error is $\\frac{12}{\\sqrt{36}} = \\frac{12}{6} = 2$, so $E = 2 \\cdot 2 = 4$.\n\nCheck: quadrupling the sample to $144$ halves the margin, $2 \\cdot \\frac{12}{12} = 2$, as the $\\sqrt{n}$ in the denominator predicts.\n\n> **Watch out.** Divide $\\sigma$ by $\\sqrt{n}$, not by $n$: $\\frac{2 \\cdot 12}{36} = \\frac{2}{3}$ makes the margin far too small.",
          "误差范围等于临界值乘以标准误，所以样本越大它越小，置信水平越高它越大。误差范围为 $E = z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}$。\n\n若 $n = 36$，$\\sigma = 12$，$z_{\\alpha/2} = 2$：标准误为 $\\frac{12}{\\sqrt{36}} = \\frac{12}{6} = 2$，所以 $E = 2 \\cdot 2 = 4$。\n\n检验：样本扩大四倍到 $144$，误差范围减半为 $2 \\cdot \\frac{12}{12} = 2$，与分母中的 $\\sqrt{n}$ 相符。\n\n> **注意。** $\\sigma$ 要除以 $\\sqrt{n}$ 而不是 $n$：$\\frac{2 \\cdot 12}{36} = \\frac{2}{3}$ 会让误差范围小得多。",
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
              `A random sample of size $n = ${n}$ is drawn from a normal population with standard deviation $\\sigma = ${sigma}$. For a critical value $z_{\\alpha/2} = ${z}$, calculate the margin of error $E$.`,
              `从标准差为 $\\sigma = ${sigma}$ 的正态总体中抽取容量为 $n = ${n}$ 的随机样本。取临界值 $z_{\\alpha/2} = ${z}$，计算误差范围 $E$。`,
            ),
            answer: margin,
            mistakes: apart(margin, [
              why(
                Q.of(z * sigma, n),
                `This divides by $n = ${n}$ instead of $\\sqrt{n} = ${k}$.`,
                `这除以了 $n = ${n}$，而不是 $\\sqrt{n} = ${k}$。`,
              ),
              why(z * sigma, "This leaves out the division by $\\sqrt{n}$.", "这漏掉了除以 $\\sqrt{n}$。"),
              why(
                Q.of(sigma, k),
                `This is the standard error alone, not yet multiplied by $z_{\\alpha/2} = ${z}$.`,
                `这只是标准误，还没有乘以 $z_{\\alpha/2} = ${z}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `$\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${k}} = ${sigma / k}$.`,
                    `$\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${k}} = ${sigma / k}$。`,
                  ),
                ],
                [
                  ["Multiply by the critical value", "乘以临界值"],
                  t(`$E = ${z} \\cdot ${sigma / k} = ${margin}$.`, `$E = ${z} \\cdot ${sigma / k} = ${margin}$。`),
                ],
              ],
              t(
                `$\\frac{${margin}}{${z}} = ${sigma / k}$, and $${sigma / k} \\cdot ${k} = ${sigma}$ gives back $\\sigma$.`,
                `$\\frac{${margin}}{${z}} = ${sigma / k}$，且 $${sigma / k} \\cdot ${k} = ${sigma}$ 还原了 $\\sigma$。`,
              ),
            ),
          });
        },
      },
      {
        id: "endpoints-of-a-z-interval",
        title: t("Endpoints of a $z$-interval", "$z$ 区间的端点"),
        explanation: t(
          "The interval is centered at the sample mean and reaches one margin of error to each side:\n\n$$\\bar{x} - z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}} \\quad\\text{to}\\quad \\bar{x} + z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}.$$\n\nThe usual critical values are $z_{0.05} = 1.645$ for $90\\%$, $z_{0.025} = 1.96$ for $95\\%$ and $z_{0.005} = 2.576$ for $99\\%$. With $\\bar{x} = 50$, $\\sigma = 8$, $n = 16$ at $95\\%$: the standard error is $2$, the margin is $3.92$, and the interval is $(46.08, 53.92)$.\n\nCheck: $53.92 - 46.08 = 7.84 = 2 \\cdot 3.92$, and the midpoint is $50$.\n\n> **Watch out.** The margin uses the standard error $\\frac{\\sigma}{\\sqrt{n}} = 2$, not $\\sigma = 8$ itself: $50 + 1.96 \\cdot 8 = 65.68$ is the width of the population, not of the uncertainty in $\\bar{x}$.",
          "置信区间以样本均值为中心，向两侧各延伸一个误差界：\n\n$$\\bar{x} - z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}} \\quad\\text{到}\\quad \\bar{x} + z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}.$$\n\n常用临界值：$90\\%$ 为 $z_{0.05} = 1.645$，$95\\%$ 为 $z_{0.025} = 1.96$，$99\\%$ 为 $z_{0.005} = 2.576$。若 $\\bar{x} = 50$，$\\sigma = 8$，$n = 16$，置信水平 $95\\%$：标准误为 $2$，误差界为 $3.92$，区间为 $(46.08, 53.92)$。\n\n检验：$53.92 - 46.08 = 7.84 = 2 \\cdot 3.92$，中点为 $50$。\n\n> **注意。** 误差界用的是标准误 $\\frac{\\sigma}{\\sqrt{n}} = 2$，而不是 $\\sigma = 8$ 本身：$50 + 1.96 \\cdot 8 = 65.68$ 反映的是总体的离散程度，而不是 $\\bar{x}$ 的不确定性。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const k = rng.int(3, 12);
          const se = Q.of(rng.int(1, 6));
          const sigma = se.mul(Q.of(k));
          const xbar = Q.of(rng.int(200, 1200), 10);
          const margin = z.mul(se);
          const upper = rng.bool();
          const ans = upper ? xbar.add(margin) : xbar.sub(margin);
          return numberProblem({
            prompt: t(
              `A sample of $n = ${k * k}$ from a normal population with $\\sigma = ${dec(sigma)}$ has mean $\\bar{x} = ${dec(xbar)}$. Find the ${upper ? "upper" : "lower"} endpoint of the $${pct}\\%$ confidence interval for $\\mu$ (use $z = ${dec(z)}$).`,
              `从 $\\sigma = ${dec(sigma)}$ 的正态总体中抽取容量 $n = ${k * k}$ 的样本，均值 $\\bar{x} = ${dec(xbar)}$。求 $\\mu$ 的 $${pct}\\%$ 置信区间的${upper ? "上" : "下"}端点（取 $z = ${dec(z)}$）。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: apart(
              ans,
              [
                why(
                  upper ? xbar.sub(margin) : xbar.add(margin),
                  `This is the ${upper ? "lower" : "upper"} endpoint; the ${upper ? "upper" : "lower"} one ${upper ? "adds" : "subtracts"} the margin.`,
                  `这是${upper ? "下" : "上"}端点；${upper ? "上" : "下"}端点要${upper ? "加上" : "减去"}误差界。`,
                ),
                why(
                  upper ? xbar.add(z.mul(sigma)) : xbar.sub(z.mul(sigma)),
                  `This uses $\\sigma = ${dec(sigma)}$ in place of the standard error $\\frac{\\sigma}{\\sqrt{n}} = ${dec(se)}$.`,
                  `这用 $\\sigma = ${dec(sigma)}$ 代替了标准误 $\\frac{\\sigma}{\\sqrt{n}} = ${dec(se)}$。`,
                ),
                why(
                  upper ? xbar.add(z.mul(sigma).div(Q.of(k * k))) : xbar.sub(z.mul(sigma).div(Q.of(k * k))),
                  `This divides $\\sigma$ by $n = ${k * k}$ instead of $\\sqrt{n} = ${k}$.`,
                  `这把 $\\sigma$ 除以 $n = ${k * k}$，而不是 $\\sqrt{n} = ${k}$。`,
                ),
              ].filter((m) => isTerminating(m.value)),
            ),
            solution: walked(
              [
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `$\\frac{${dec(sigma)}}{\\sqrt{${k * k}}} = \\frac{${dec(sigma)}}{${k}} = ${dec(se)}$.`,
                    `$\\frac{${dec(sigma)}}{\\sqrt{${k * k}}} = \\frac{${dec(sigma)}}{${k}} = ${dec(se)}$。`,
                  ),
                ],
                [
                  ["Find the margin", "求误差界"],
                  t(`$${dec(z)} \\cdot ${dec(se)} = ${dec(margin)}$.`, `$${dec(z)} \\cdot ${dec(se)} = ${dec(margin)}$。`),
                ],
                [
                  [upper ? "Add it to the mean" : "Subtract it from the mean", upper ? "加到均值上" : "从均值中减去"],
                  t(
                    `$${dec(xbar)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$.`,
                    `$${dec(xbar)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `The distance from $\\bar{x} = ${dec(xbar)}$ to $${dec(ans)}$ is $${dec(margin)}$, which is $${dec(z)}$ standard errors of $${dec(se)}$.`,
                `从 $\\bar{x} = ${dec(xbar)}$ 到 $${dec(ans)}$ 的距离为 $${dec(margin)}$，正是 $${dec(z)}$ 个标准误 $${dec(se)}$。`,
              ),
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
      "When $\\sigma$ is unknown and the population is normal, Student's $t$-distribution with $\\nu = n - 1$ degrees of freedom is used: $\\bar{x} \\pm t_{\\alpha/2, n-1} \\frac{s}{\\sqrt{n}}$.",
      "当总体标准差 $\\sigma$ 未知且总体服从正态分布时，采用自由度为 $\\nu = n - 1$ 的学生 $t$ 分布：$\\bar{x} \\pm t_{\\alpha/2, n-1} \\frac{s}{\\sqrt{n}}$。",
    ),
    intro: t(
      "Nine loaves from a bakery have mean weight $\\bar{x} = 400$ grams and sample standard deviation $s = 6$ grams, and nobody knows the true $\\sigma$. The estimated standard error is $\\frac{s}{\\sqrt{n}} = \\frac{6}{3} = 2$. Because $s$ itself varies from sample to sample, the critical value comes from the $t$-distribution with $n - 1 = 8$ degrees of freedom: $t_{0.025, 8} = 2.306$. The margin is $2.306 \\cdot 2 = 4.612$, so the $95\\%$ interval is $400 \\pm 4.612$, from $395.388$ to $404.612$.\n\nCheck: with $z = 1.96$ the margin would be only $3.92$; the $t$ interval is wider, as it must be when $\\sigma$ is estimated.\n\nIn this lesson we find the degrees of freedom $n - 1$ and the endpoints $\\bar{x} \\pm t_{\\alpha/2, n-1}\\frac{s}{\\sqrt{n}}$ of a one-sample $t$ interval.",
      "从一家面包房抽取 $9$ 个面包，平均重量 $\\bar{x} = 400$ 克，样本标准差 $s = 6$ 克，真实的 $\\sigma$ 未知。估计的标准误为 $\\frac{s}{\\sqrt{n}} = \\frac{6}{3} = 2$。由于 $s$ 本身随样本而变，临界值取自自由度为 $n - 1 = 8$ 的 $t$ 分布：$t_{0.025, 8} = 2.306$。误差界为 $2.306 \\cdot 2 = 4.612$，所以 $95\\%$ 置信区间为 $400 \\pm 4.612$，即从 $395.388$ 到 $404.612$。\n\n检验：若用 $z = 1.96$，误差界只有 $3.92$；估计 $\\sigma$ 时 $t$ 区间更宽，理应如此。\n\n本课我们求单样本 $t$ 区间的自由度 $n - 1$ 以及端点 $\\bar{x} \\pm t_{\\alpha/2, n-1}\\frac{s}{\\sqrt{n}}$。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance", "the-students-t-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "t-confidence-interval-degrees-of-freedom",
        title: t("Identifying degrees of freedom for one-sample t confidence interval", "确定单样本 t 置信区间的自由度"),
        explanation: t(
          "For a single sample of size $n$ with unknown variance, the $t$ critical value uses degrees of freedom $\\nu = n - 1$, because estimating the mean from the sample uses up one degree of freedom.\n\nA sample of $n = 20$ gives $\\nu = 19$, and the $95\\%$ critical value is read from the row $t_{0.025, 19} = 2.093$.\n\nCheck: the $n$ deviations $x_i - \\bar{x}$ always sum to $0$, so once $19$ of them are known the last one is fixed; only $19$ are free.\n\n> **Watch out.** The degrees of freedom do not depend on the confidence level, and they are not $n$: a $90\\%$ and a $99\\%$ interval from the same $20$ values both use $\\nu = 19$.",
          "对于未知方差的容量为 $n$ 的单样本，$t$ 临界值采用自由度 $\\nu = n - 1$，因为用样本估计均值用掉了一个自由度。\n\n容量 $n = 20$ 的样本给出 $\\nu = 19$，$95\\%$ 临界值从 $t_{0.025, 19} = 2.093$ 这一行读出。\n\n检验：$n$ 个离差 $x_i - \\bar{x}$ 之和恒为 $0$，所以知道其中 $19$ 个后最后一个就确定了；只有 $19$ 个是自由的。\n\n> **注意。** 自由度与置信水平无关，也不是 $n$：同样 $20$ 个数据的 $90\\%$ 和 $99\\%$ 区间都用 $\\nu = 19$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(5, 60);

          return numberProblem({
            prompt: t(
              `A researcher constructs a $95\\%$ confidence interval for the mean of a normal population with unknown variance based on a sample of size $n = ${n}$. What are the degrees of freedom $\\nu$ of the Student's $t$ distribution used?`,
              `研究人员根据容量为 $n = ${n}$ 的样本，为方差未知的正态总体均值构建 $95\\%$ 置信区间。所使用的学生 $t$ 分布的自由度 $\\nu$ 是多少？`,
            ),
            answer: n - 1,
            wrong: [n + 1],
            mistakes: [
              why(
                n,
                "This is the sample size; estimating the mean uses up one degree of freedom.",
                "这是样本容量；估计均值用掉了一个自由度。",
              ),
              why(
                n - 2,
                "This subtracts $2$, the rule for a pooled two-sample interval, not for one sample.",
                "这减去了 $2$，那是两样本合并区间的规则，不适用于单样本。",
              ),
            ],
            solution: walked(
              [
                [
                  ["Count the estimated means", "数出估计的均值个数"],
                  t(
                    "One sample estimates one mean $\\bar{x}$, which uses up one degree of freedom.",
                    "一个样本估计一个均值 $\\bar{x}$，用掉一个自由度。",
                  ),
                ],
                [["Subtract", "相减"], t(`$\\nu = n - 1 = ${n} - 1 = ${n - 1}$.`, `$\\nu = n - 1 = ${n} - 1 = ${n - 1}$。`)],
              ],
              t(`$${n - 1} + 1 = ${n}$ gives back the sample size.`, `$${n - 1} + 1 = ${n}$ 还原了样本容量。`),
            ),
          });
        },
      },
      {
        id: "endpoints-of-a-t-interval",
        title: t("Endpoints of a $t$-interval", "$t$ 区间的端点"),
        explanation: t(
          "With $\\sigma$ unknown, the sample standard deviation $s$ takes its place and the critical value comes from the $t$-distribution with $n - 1$ degrees of freedom:\n\n$$\\bar{x} \\pm t_{\\alpha/2, n-1}\\frac{s}{\\sqrt{n}}.$$\n\nThe $t$ critical value is larger than the matching $z$ value, which widens the interval to allow for the extra uncertainty in $s$; the difference fades as $n$ grows. For $n = 16$, $s = 8$, $\\bar{x} = 30$ and $t_{0.025, 15} = 2.131$: the margin is $2.131 \\cdot 2 = 4.262$, so the interval is $(25.738, 34.262)$.\n\nCheck: $34.262 - 25.738 = 8.524 = 2 \\cdot 4.262$, centred at $30$.\n\n> **Watch out.** Do not use $z = 1.96$ when $\\sigma$ is unknown and $n$ is small: $1.96 \\cdot 2 = 3.92$ gives an interval that is too narrow to reach $95\\%$ coverage.",
          "当 $\\sigma$ 未知时，用样本标准差 $s$ 代替，临界值取自自由度为 $n - 1$ 的 $t$ 分布：\n\n$$\\bar{x} \\pm t_{\\alpha/2, n-1}\\frac{s}{\\sqrt{n}}.$$\n\n$t$ 临界值比相应的 $z$ 值大，使区间变宽，以反映 $s$ 带来的额外不确定性；$n$ 增大时差别逐渐消失。若 $n = 16$，$s = 8$，$\\bar{x} = 30$，$t_{0.025, 15} = 2.131$：误差界为 $2.131 \\cdot 2 = 4.262$，所以区间为 $(25.738, 34.262)$。\n\n检验：$34.262 - 25.738 = 8.524 = 2 \\cdot 4.262$，中心为 $30$。\n\n> **注意。** $\\sigma$ 未知且 $n$ 较小时不要用 $z = 1.96$：$1.96 \\cdot 2 = 3.92$ 得到的区间太窄，达不到 $95\\%$ 的覆盖率。",
        ),
        generate: (rng: Rng): Problem => {
          const [k, t025, t05] = rng.pick([
            [3, "2.306", "1.860"],
            [4, "2.131", "1.753"],
            [5, "2.064", "1.711"],
            [6, "2.030", "1.690"],
          ] as const);
          const ninety = rng.bool(0.4);
          const tc = Q.parse(ninety ? t05 : t025);
          const n = k * k;
          const se = Q.of(rng.int(1, 5));
          const s = se.mul(Q.of(k));
          const xbar = Q.of(rng.int(100, 900), 10);
          const margin = tc.mul(se);
          const upper = rng.bool();
          const ans = upper ? xbar.add(margin) : xbar.sub(margin);
          const tName = `t_{${ninety ? "0.05" : "0.025"}, ${n - 1}}`;
          return numberProblem({
            prompt: t(
              `A sample of $n = ${n}$ from a normal population has $\\bar{x} = ${dec(xbar)}$ and $s = ${dec(s)}$. Using $${tName} = ${dec(tc)}$, find the ${upper ? "upper" : "lower"} endpoint of the $${ninety ? 90 : 95}\\%$ confidence interval for $\\mu$.`,
              `从正态总体中抽取容量 $n = ${n}$ 的样本，$\\bar{x} = ${dec(xbar)}$，$s = ${dec(s)}$。取 $${tName} = ${dec(tc)}$，求 $\\mu$ 的 $${ninety ? 90 : 95}\\%$ 置信区间的${upper ? "上" : "下"}端点。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: apart(ans, [
              why(
                upper ? xbar.sub(margin) : xbar.add(margin),
                `This is the ${upper ? "lower" : "upper"} endpoint; the ${upper ? "upper" : "lower"} one ${upper ? "adds" : "subtracts"} the margin.`,
                `这是${upper ? "下" : "上"}端点；${upper ? "上" : "下"}端点要${upper ? "加上" : "减去"}误差界。`,
              ),
              why(
                upper ? xbar.add(tc.mul(s)) : xbar.sub(tc.mul(s)),
                `This multiplies $s = ${dec(s)}$ instead of the standard error $\\frac{s}{\\sqrt{n}} = ${dec(se)}$.`,
                `这乘的是 $s = ${dec(s)}$，而不是标准误 $\\frac{s}{\\sqrt{n}} = ${dec(se)}$。`,
              ),
              why(
                upper ? xbar.add(Q.parse("1.96").mul(se)) : xbar.sub(Q.parse("1.96").mul(se)),
                "This uses the normal value $1.96$; with $\\sigma$ unknown the critical value comes from the $t$ table.",
                "这用了正态值 $1.96$；$\\sigma$ 未知时临界值应取自 $t$ 分布表。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `$\\frac{s}{\\sqrt{n}} = \\frac{${dec(s)}}{${k}} = ${dec(se)}$.`,
                    `$\\frac{s}{\\sqrt{n}} = \\frac{${dec(s)}}{${k}} = ${dec(se)}$。`,
                  ),
                ],
                [
                  ["Find the margin", "求误差界"],
                  t(
                    `$${tName} \\cdot ${dec(se)} = ${dec(tc)} \\cdot ${dec(se)} = ${dec(margin)}$.`,
                    `$${tName} \\cdot ${dec(se)} = ${dec(tc)} \\cdot ${dec(se)} = ${dec(margin)}$。`,
                  ),
                ],
                [
                  [upper ? "Add it to the mean" : "Subtract it from the mean", upper ? "加到均值上" : "从均值中减去"],
                  t(
                    `$${dec(xbar)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$.`,
                    `$${dec(xbar)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `The distance from $\\bar{x} = ${dec(xbar)}$ to $${dec(ans)}$ is $${dec(margin)} = ${dec(tc)} \\cdot ${dec(se)}$.`,
                `从 $\\bar{x} = ${dec(xbar)}$ 到 $${dec(ans)}$ 的距离为 $${dec(margin)} = ${dec(tc)} \\cdot ${dec(se)}$。`,
              ),
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
      "When sampling without replacement from a finite population of size $N$, the confidence interval is adjusted by the FPC factor: $\\bar{x} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}} \\sqrt{\\frac{N - n}{N - 1}}$.",
      "当不放回地从容量为 $N$ 的有限总体中抽样时，置信区间通过 FPC 因子进行修正：$\\bar{x} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}} \\sqrt{\\frac{N - n}{N - 1}}$。",
    ),
    intro: t(
      "A school has $N = 101$ pupils and $n = 37$ of them are timed on a run, with known $\\sigma = 30$ seconds and mean $\\bar{x} = 300$. The usual standard error is $\\frac{30}{\\sqrt{37}}$, but a third of the whole school has been measured, so there is less left to be uncertain about. The correction factor is $\\sqrt{\\frac{N - n}{N - 1}} = \\sqrt{\\frac{64}{100}} = 0.8$, and every margin computed for this sample is multiplied by $0.8$. If the uncorrected $95\\%$ margin is $9.67$, the corrected one is $0.8 \\cdot 9.67 = 7.736$.\n\nCheck: if all $101$ pupils were timed, the factor would be $\\sqrt{\\frac{0}{100}} = 0$ and the mean would be known exactly, with no margin at all.\n\nIn this lesson we see why the finite population correction narrows an interval and compute the corrected margin $z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}\\sqrt{\\frac{N - n}{N - 1}}$.",
      "一所学校有 $N = 101$ 名学生，对其中 $n = 37$ 人测跑步时间，已知 $\\sigma = 30$ 秒，样本均值 $\\bar{x} = 300$。通常的标准误为 $\\frac{30}{\\sqrt{37}}$，但全校三分之一已被测量，剩下的不确定性更少。校正因子为 $\\sqrt{\\frac{N - n}{N - 1}} = \\sqrt{\\frac{64}{100}} = 0.8$，这个样本算出的每个误差界都要乘以 $0.8$。若未校正的 $95\\%$ 误差界为 $9.67$，校正后为 $0.8 \\cdot 9.67 = 7.736$。\n\n检验：若全部 $101$ 名学生都被测量，因子为 $\\sqrt{\\frac{0}{100}} = 0$，均值就确切已知，误差界为零。\n\n本课我们理解有限总体校正为何使区间变窄，并计算校正后的误差界 $z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}\\sqrt{\\frac{N - n}{N - 1}}$。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance", "finite-population-corrections-for-sample-means"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "fpc-confidence-interval-margin-reduction",
        title: t("Understanding the narrowing effect of FPC on confidence intervals", "理解 FPC 对置信区间的收窄效应"),
        explanation: t(
          "Because the correction factor is less than one, sampling a large fraction of the population gives a narrower interval than the usual formula. Because $\\sqrt{\\dfrac{N - n}{N - 1}} < 1$, the FPC narrows the margin of error and yields a more precise interval.\n\nFor $N = 401$ and $n = 77$, the factor is $\\sqrt{\\frac{324}{400}} = 0.9$, so a margin of $5$ becomes $4.5$; the centre $\\bar{x}$ does not move.\n\nCheck: $0.9^{2} \\cdot 400 = 324 = 401 - 77$, so the factor is right, and it is below $1$ because $N - n < N - 1$ whenever $n > 1$.\n\n> **Watch out.** The correction changes only the width. It multiplies the margin, never the sample mean, so the interval stays centred at $\\bar{x}$.",
          "由于修正因子小于 1，抽取总体中很大一部分时，得到的区间比通常公式给出的更窄。因为 $\\sqrt{\\dfrac{N - n}{N - 1}} < 1$，有限总体校正使误差范围变窄，从而得到更精确的置信区间。\n\n当 $N = 401$，$n = 77$ 时，因子为 $\\sqrt{\\frac{324}{400}} = 0.9$，误差界 $5$ 变为 $4.5$；中心 $\\bar{x}$ 不动。\n\n检验：$0.9^{2} \\cdot 400 = 324 = 401 - 77$，因子正确；只要 $n > 1$ 就有 $N - n < N - 1$，所以它小于 $1$。\n\n> **注意。** 校正只改变宽度。它乘在误差界上，从不乘在样本均值上，所以区间仍以 $\\bar{x}$ 为中心。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(200, 1000);
          const n = rng.int(20, 100);
          return explainedChoice(rng, {
            prompt: t(
              `When constructing a confidence interval for the mean from a sample of size $n = ${n}$ drawn without replacement from a finite population of size $N = ${N}$, how does including the Finite Population Correction (FPC) affect the width of the confidence interval compared to assuming an infinite population?`,
              `当根据从容量为 $N = ${N}$ 的有限总体中不放回抽取的 $n = ${n}$ 个样本构建均值置信区间时，与假定无限总体相比，引入有限总体校正（FPC）对置信区间宽度有何影响？`,
            ),
            correct: t(
              "It becomes narrower (smaller margin of error) because the FPC factor is strictly less than 1.",
              "置信区间变得更窄（误差范围更小），因为 FPC 因子严格小于 1。",
            ),
            wrong: [
              {
                option: t(
                  "It becomes wider (larger margin of error) because finite populations introduce extra variance.",
                  "置信区间变得更宽（误差范围更大），因为有限总体引入了额外方差。",
                ),
                why: t(
                  `Sampling without replacement removes variance: $\\frac{${N} - ${n}}{${N} - 1} < 1$, so the factor shrinks the margin.`,
                  `不放回抽样减少了方差：$\\frac{${N} - ${n}}{${N} - 1} < 1$，所以因子使误差界缩小。`,
                ),
              },
              {
                option: t(
                  "The width remains unchanged because the sample size $n$ is unchanged.",
                  "区间宽度保持不变，因为样本容量 $n$ 未发生变化。",
                ),
                why: t(
                  "The margin depends on $N$ through the factor as well as on $n$, so with the same $n$ it still changes.",
                  "误差界除了依赖 $n$，还通过校正因子依赖 $N$，所以 $n$ 不变时它仍会改变。",
                ),
              },
              {
                option: t("It shifts the center of the interval away from the sample mean.", "它会使置信区间的中心偏离样本均值。"),
                why: t(
                  "The factor multiplies only the margin; the interval stays centred at $\\bar{x}$.",
                  "因子只乘在误差界上；区间仍以 $\\bar{x}$ 为中心。",
                ),
              },
            ],
            solution: walked(
              [
                [
                  ["Compare the factor with one", "把因子与 1 比较"],
                  t(
                    `$${N} - ${n} = ${N - n}$ is less than $${N} - 1 = ${N - 1}$, so $\\sqrt{\\frac{${N - n}}{${N - 1}}} < 1$.`,
                    `$${N} - ${n} = ${N - n}$ 小于 $${N} - 1 = ${N - 1}$，所以 $\\sqrt{\\frac{${N - n}}{${N - 1}}} < 1$。`,
                  ),
                ],
                [
                  ["Apply it to the margin", "作用于误差界"],
                  t(
                    "Multiplying the margin by a number below $1$ makes it smaller, so the interval is narrower with the same centre.",
                    "把误差界乘以小于 $1$ 的数会使它变小，所以区间变窄，中心不变。",
                  ),
                ],
              ],
              t(
                "If $n$ grew to $N$, the factor would reach $0$ and the interval would shrink to the single point $\\bar{x}$, the exact population mean.",
                "若 $n$ 增大到 $N$，因子变为 $0$，区间缩成单点 $\\bar{x}$，即确切的总体均值。",
              ),
            ),
          });
        },
      },
      {
        id: "the-corrected-margin-of-error",
        title: t("The corrected margin of error", "修正后的误差界"),
        explanation: t(
          "Sampling a large share of a finite population leaves less uncertainty, and the margin of error is multiplied by the **finite population correction**:\n\n$$E = z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}\\sqrt{\\frac{N - n}{N - 1}}.$$\n\nThe factor is below $1$ and matters once $n$ is more than about $5\\%$ of $N$. For $N = 101$ and $n = 37$, $\\sqrt{\\frac{64}{100}} = 0.8$, so the margin shrinks by a fifth: with $z = 2$ and $\\frac{\\sigma}{\\sqrt{n}} = 3$, $E = 2 \\cdot 3 \\cdot 0.8 = 4.8$.\n\nCheck: $\\frac{4.8}{6} = 0.8$, the ratio of the corrected margin to the uncorrected $2 \\cdot 3 = 6$.\n\n> **Watch out.** The factor is the square root of $\\frac{N - n}{N - 1}$: multiplying by $\\frac{64}{100} = 0.64$ itself gives $3.84$, which over-corrects.",
          "从有限总体中抽取较大比例的样本时，不确定性减小，误差界要乘以**有限总体校正因子**：\n\n$$E = z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}\\sqrt{\\frac{N - n}{N - 1}}.$$\n\n该因子小于 $1$，当 $n$ 超过 $N$ 的约 $5\\%$ 时就不可忽略。例如 $N = 101$，$n = 37$，$\\sqrt{\\frac{64}{100}} = 0.8$，误差界缩小五分之一：若 $z = 2$，$\\frac{\\sigma}{\\sqrt{n}} = 3$，则 $E = 2 \\cdot 3 \\cdot 0.8 = 4.8$。\n\n检验：$\\frac{4.8}{6} = 0.8$，正是校正后误差界与未校正的 $2 \\cdot 3 = 6$ 之比。\n\n> **注意。** 因子是 $\\frac{N - n}{N - 1}$ 的平方根：直接乘以 $\\frac{64}{100} = 0.64$ 得 $3.84$，校正过度了。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const [N, n, r] = pickFpc(rng);
          const se = Q.of(rng.int(2, 40), 10);
          const ans = z.mul(se).mul(r);
          return numberProblem({
            prompt: t(
              `A sample of $n = ${n}$ is drawn without replacement from a population of $N = ${N}$, and $\\frac{\\sigma}{\\sqrt{n}} = ${dec(se)}$. Find the margin of error of the $${pct}\\%$ confidence interval for $\\mu$ with the finite population correction (use $z = ${dec(z)}$).`,
              `从容量 $N = ${N}$ 的总体中不放回地抽取 $n = ${n}$ 个个体，$\\frac{\\sigma}{\\sqrt{n}} = ${dec(se)}$。求带有限总体校正的 $\\mu$ 的 $${pct}\\%$ 置信区间的误差界（取 $z = ${dec(z)}$）。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [z.mul(se).mul(Q.one.sub(r))],
            mistakes: apart(ans, [
              why(z.mul(se), "This leaves out the finite population correction.", "这漏掉了有限总体校正。"),
              why(
                z.mul(se).mul(r).mul(r),
                `This multiplies by $\\frac{${N - n}}{${N - 1}} = ${dec(r.mul(r))}$ without taking its square root.`,
                `这乘以了 $\\frac{${N - n}}{${N - 1}} = ${dec(r.mul(r))}$，没有开平方。`,
              ),
              why(
                se.mul(r),
                `This corrects the standard error but forgets the critical value $z = ${dec(z)}$.`,
                `这校正了标准误，却忘了临界值 $z = ${dec(z)}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the correction factor", "求校正因子"],
                  t(
                    `$\\sqrt{\\frac{${N} - ${n}}{${N} - 1}} = \\sqrt{\\frac{${N - n}}{${N - 1}}} = ${dec(r)}$.`,
                    `$\\sqrt{\\frac{${N} - ${n}}{${N} - 1}} = \\sqrt{\\frac{${N - n}}{${N - 1}}} = ${dec(r)}$。`,
                  ),
                ],
                [
                  ["Multiply", "相乘"],
                  t(
                    `$E = ${dec(z)} \\cdot ${dec(se)} \\cdot ${dec(r)} = ${dec(ans)}$.`,
                    `$E = ${dec(z)} \\cdot ${dec(se)} \\cdot ${dec(r)} = ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `$${dec(r)}^{2} \\cdot ${N - 1} = ${N - n}$, and $${dec(ans)}$ is less than the uncorrected $${dec(z.mul(se))}$.`,
                `$${dec(r)}^{2} \\cdot ${N - 1} = ${N - n}$，且 $${dec(ans)}$ 小于未校正的 $${dec(z.mul(se))}$。`,
              ),
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
      "The large-sample Wald confidence interval for a population proportion $p$ is $\\hat{p} \\pm z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}$, valid when $n\\hat{p} \\ge 10$ and $n(1 - \\hat{p}) \\ge 10$.",
      "单总体比例 $p$ 的大样本瓦尔德（Wald）置信区间为 $\\hat{p} \\pm z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}$，在 $n\\hat{p} \\ge 10$ 且 $n(1 - \\hat{p}) \\ge 10$ 时适用。",
    ),
    intro: t(
      "In a poll of $n = 100$ customers, $60$ prefer the new packaging, so $\\hat{p} = 0.6$. The true standard error $\\sqrt{\\frac{p(1 - p)}{n}}$ needs the unknown $p$, so we plug in $\\hat{p}$: $\\sqrt{\\frac{0.6 \\cdot 0.4}{100}} = \\sqrt{0.0024} \\approx 0.049$. The $95\\%$ Wald interval is then $0.6 \\pm 1.96 \\cdot 0.049 \\approx 0.6 \\pm 0.096$, roughly from $0.504$ to $0.696$.\n\nCheck: there are $60$ successes and $40$ failures, both at least $10$, so the normal approximation behind the interval is reasonable.\n\nIn this lesson we compute the estimated variance $\\frac{\\hat{p}(1 - \\hat{p})}{n}$ of a sample proportion and the endpoints of a Wald interval for a population proportion.",
      "在 $n = 100$ 名顾客的调查中，有 $60$ 人更喜欢新包装，所以 $\\hat{p} = 0.6$。真实标准误 $\\sqrt{\\frac{p(1 - p)}{n}}$ 需要未知的 $p$，于是代入 $\\hat{p}$：$\\sqrt{\\frac{0.6 \\cdot 0.4}{100}} = \\sqrt{0.0024} \\approx 0.049$。于是 $95\\%$ 沃尔德区间为 $0.6 \\pm 1.96 \\cdot 0.049 \\approx 0.6 \\pm 0.096$，约从 $0.504$ 到 $0.696$。\n\n检验：成功 $60$ 次、失败 $40$ 次，都至少为 $10$，所以区间背后的正态近似是合理的。\n\n本课我们计算样本比例的估计方差 $\\frac{\\hat{p}(1 - \\hat{p})}{n}$，以及总体比例沃尔德区间的端点。",
    ),
    prerequisites: ["point-estimates-of-population-proportions", "confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "wald-proportion-variance-evaluation",
        title: t("Evaluating the estimated variance of the sample proportion", "计算样本比例的估计方差"),
        explanation: t(
          "The true variance of a sample proportion depends on the unknown proportion, so the estimate substitutes the sample proportion for it. The estimated variance of $\\hat{p}$ is $\\dfrac{\\hat{p}(1 - \\hat{p})}{n}$.\n\nWith $\\hat{p} = \\frac{3}{10}$ and $n = 50$: $\\frac{0.3 \\cdot 0.7}{50} = \\frac{0.21}{50} = \\frac{21}{5000} = 0.0042$.\n\nCheck: the variance is at most $\\frac{0.25}{50} = 0.005$, the value at $\\hat{p} = \\frac{1}{2}$, and $0.0042$ is below it.\n\n> **Watch out.** Divide by $n$: $0.3 \\cdot 0.7 = 0.21$ is the variance of one yes-or-no answer, not of the proportion of $50$ of them.",
          "样本比例的真实方差依赖于未知的比例，所以估计时用样本比例代替它。样本比例 $\\hat{p}$ 的估计方差为 $\\dfrac{\\hat{p}(1 - \\hat{p})}{n}$。\n\n若 $\\hat{p} = \\frac{3}{10}$，$n = 50$：$\\frac{0.3 \\cdot 0.7}{50} = \\frac{0.21}{50} = \\frac{21}{5000} = 0.0042$。\n\n检验：方差至多为 $\\hat{p} = \\frac{1}{2}$ 时的 $\\frac{0.25}{50} = 0.005$，而 $0.0042$ 低于它。\n\n> **注意。** 要除以 $n$：$0.3 \\cdot 0.7 = 0.21$ 是单个“是或否”回答的方差，而不是 $50$ 个回答所占比例的方差。",
        ),
        generate: (rng: Rng): Problem => {
          const numP = rng.int(1, 9);
          const denP = 10;
          const n = rng.int(20, 100);
          // var = p(1-p)/n = (numP * (10 - numP)) / (100 * n)
          const num = numP * (denP - numP);
          const den = 100 * n;

          return numberProblem({
            prompt: t(
              `In a sample of size $n = ${n}$, the sample proportion is $\\hat{p} = \\frac{${numP}}{${denP}}$. Find the estimated variance of the sample proportion.`,
              `在容量为 $n = ${n}$ 的样本中，样本比例为 $\\hat{p} = \\frac{${numP}}{${denP}}$。求样本比例的估计方差。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(num * n, 100)],
            mistakes: apart(Q.of(num, den), [
              why(
                Q.of(num, 100),
                `This is $\\hat{p}(1 - \\hat{p})$, not yet divided by $n = ${n}$.`,
                `这是 $\\hat{p}(1 - \\hat{p})$，还没有除以 $n = ${n}$。`,
              ),
              why(
                Q.of(numP, denP * n),
                "This is $\\frac{\\hat{p}}{n}$; it leaves out the factor $1 - \\hat{p}$.",
                "这是 $\\frac{\\hat{p}}{n}$；漏掉了因子 $1 - \\hat{p}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Multiply the two proportions", "两个比例相乘"],
                  t(
                    `$\\hat{p}(1 - \\hat{p}) = \\frac{${numP}}{${denP}} \\cdot \\frac{${denP - numP}}{${denP}} = \\frac{${num}}{100}$.`,
                    `$\\hat{p}(1 - \\hat{p}) = \\frac{${numP}}{${denP}} \\cdot \\frac{${denP - numP}}{${denP}} = \\frac{${num}}{100}$。`,
                  ),
                ],
                [
                  ["Divide by the sample size", "除以样本容量"],
                  t(
                    `$\\frac{${num}}{100 \\cdot ${n}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `$\\frac{${num}}{100 \\cdot ${n}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              t(
                `$${n} \\cdot ${Q.of(num, den).toLatex()} = \\frac{${num}}{100}$, and the result is at most $\\frac{1}{4 \\cdot ${n}}$, the largest possible value.`,
                `$${n} \\cdot ${Q.of(num, den).toLatex()} = \\frac{${num}}{100}$，且结果不超过最大可能值 $\\frac{1}{4 \\cdot ${n}}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "endpoints-of-a-proportion-interval",
        title: t("Endpoints of a proportion interval", "比例区间的端点"),
        explanation: t(
          "The Wald interval puts the sample proportion in the middle and estimates the standard error from it:\n\n$$\\hat{p} \\pm z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}.$$\n\nIf $80$ of $400$ voters support a measure, $\\hat{p} = 0.2$, the standard error is $\\sqrt{\\frac{0.16}{400}} = 0.02$, and the $95\\%$ interval is $0.2 \\pm 0.0392$, from $0.1608$ to $0.2392$. Check first that there are at least $10$ successes and $10$ failures.\n\nCheck: $80$ successes and $320$ failures pass that condition, and $0.2392 - 0.1608 = 0.0784 = 2 \\cdot 0.0392$.\n\n> **Watch out.** Take the square root: $1.96 \\cdot \\frac{0.16}{400} = 0.000784$ uses the variance instead of the standard error and gives an interval hundreds of times too narrow.",
          "沃尔德区间以样本比例为中心，并由它估计标准误：\n\n$$\\hat{p} \\pm z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}.$$\n\n若 $400$ 名选民中有 $80$ 人支持某项提案，$\\hat{p} = 0.2$，标准误为 $\\sqrt{\\frac{0.16}{400}} = 0.02$，$95\\%$ 区间为 $0.2 \\pm 0.0392$，即从 $0.1608$ 到 $0.2392$。先检查成功和失败次数都至少为 $10$。\n\n检验：成功 $80$ 次、失败 $320$ 次，满足条件，且 $0.2392 - 0.1608 = 0.0784 = 2 \\cdot 0.0392$。\n\n> **注意。** 要开平方：$1.96 \\cdot \\frac{0.16}{400} = 0.000784$ 用了方差而不是标准误，区间窄了几百倍。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
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
          const se = sd.div(Q.of(root));
          const margin = z.mul(se);
          const upper = rng.bool();
          const ans = upper ? p.add(margin) : p.sub(margin);
          return numberProblem({
            prompt: t(
              `In a random sample of $${n}$ people, $${x.toString()}$ answer yes. Find the ${upper ? "upper" : "lower"} endpoint of the $${pct}\\%$ Wald confidence interval for the population proportion (use $z = ${dec(z)}$).`,
              `在 $${n}$ 人的随机样本中，有 $${x.toString()}$ 人回答“是”。求总体比例的 $${pct}\\%$ 沃尔德置信区间的${upper ? "上" : "下"}端点（取 $z = ${dec(z)}$）。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: apart(ans, [
              why(
                upper ? p.sub(margin) : p.add(margin),
                `This is the ${upper ? "lower" : "upper"} endpoint; the ${upper ? "upper" : "lower"} one ${upper ? "adds" : "subtracts"} the margin.`,
                `这是${upper ? "下" : "上"}端点；${upper ? "上" : "下"}端点要${upper ? "加上" : "减去"}误差界。`,
              ),
              why(
                upper ? p.add(z.mul(sd.pow(2)).div(Q.of(n))) : p.sub(z.mul(sd.pow(2)).div(Q.of(n))),
                "This multiplies $z$ by the variance $\\frac{\\hat{p}(1 - \\hat{p})}{n}$ without taking its square root.",
                "这把 $z$ 乘以方差 $\\frac{\\hat{p}(1 - \\hat{p})}{n}$，没有开平方。",
              ),
              why(
                upper ? p.add(se) : p.sub(se),
                `This moves one standard error $${dec(se)}$ without multiplying by $z = ${dec(z)}$.`,
                `这只移动了一个标准误 $${dec(se)}$，没有乘以 $z = ${dec(z)}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the sample proportion", "求样本比例"],
                  t(`$\\hat{p} = \\frac{${x.toString()}}{${n}} = ${dec(p)}$.`, `$\\hat{p} = \\frac{${x.toString()}}{${n}} = ${dec(p)}$。`),
                ],
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `$\\sqrt{\\frac{${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${n}}} = \\frac{${dec(sd)}}{${root}} = ${dec(se)}$.`,
                    `$\\sqrt{\\frac{${dec(p)} \\cdot ${dec(Q.one.sub(p))}}{${n}}} = \\frac{${dec(sd)}}{${root}} = ${dec(se)}$。`,
                  ),
                ],
                [
                  ["Apply the margin", "加减误差界"],
                  t(
                    `The margin is $${dec(z)} \\cdot ${dec(se)} = ${dec(margin)}$, so the endpoint is $${dec(p)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$.`,
                    `误差界为 $${dec(z)} \\cdot ${dec(se)} = ${dec(margin)}$，所以端点为 $${dec(p)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `There are $${x.toString()}$ successes and $${Q.of(n).sub(x).toString()}$ failures, both at least $10$, and $${dec(ans)}$ lies $${dec(margin)}$ from $${dec(p)}$.`,
                `成功 $${x.toString()}$ 次、失败 $${Q.of(n).sub(x).toString()}$ 次，都至少为 $10$，且 $${dec(ans)}$ 与 $${dec(p)}$ 相距 $${dec(margin)}$。`,
              ),
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
      "For finite populations sampled without replacement, the margin of error for proportions includes the FPC: $E = z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}} \\sqrt{\\frac{N - n}{N - 1}}$.",
      "对于不放回抽样的有限总体，比例的误差范围包含 FPC 校正因子：$E = z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}} \\sqrt{\\frac{N - n}{N - 1}}$。",
    ),
    intro: t(
      "A firm of $N = 401$ staff surveys $n = 77$ of them without replacement, and $\\hat{p} = 0.5$ want flexible hours. The uncorrected standard error is $\\sqrt{\\frac{0.25}{77}} \\approx 0.057$. A fifth of the staff has answered, so the finite population correction applies: $\\sqrt{\\frac{401 - 77}{401 - 1}} = \\sqrt{\\frac{324}{400}} = 0.9$. The corrected standard error is about $0.9 \\cdot 0.057 \\approx 0.051$, and the $95\\%$ margin is about $1.96 \\cdot 0.051 \\approx 0.1$.\n\nCheck: $0.9^{2} = 0.81 = \\frac{324}{400}$, and the corrected margin is smaller than the uncorrected $1.96 \\cdot 0.057 \\approx 0.112$.\n\nIn this lesson we write the corrected standard error $\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n} \\cdot \\frac{N - n}{N - 1}}$ of a sample proportion and compute the corrected margin of error.",
      "一家有 $N = 401$ 名员工的公司不放回地调查其中 $n = 77$ 人，$\\hat{p} = 0.5$ 希望弹性工时。未校正的标准误为 $\\sqrt{\\frac{0.25}{77}} \\approx 0.057$。五分之一的员工已作答，所以要用有限总体校正：$\\sqrt{\\frac{401 - 77}{401 - 1}} = \\sqrt{\\frac{324}{400}} = 0.9$。校正后的标准误约为 $0.9 \\cdot 0.057 \\approx 0.051$，$95\\%$ 误差界约为 $1.96 \\cdot 0.051 \\approx 0.1$。\n\n检验：$0.9^{2} = 0.81 = \\frac{324}{400}$，且校正后的误差界小于未校正的 $1.96 \\cdot 0.057 \\approx 0.112$。\n\n本课我们写出样本比例经校正的标准误 $\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n} \\cdot \\frac{N - n}{N - 1}}$，并计算校正后的误差界。",
    ),
    prerequisites: ["confidence-intervals-for-one-proportion", "finite-population-corrections-for-sample-proportions"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "fpc-proportion-standard-error-formula",
        title: t("Formulating the standard error with FPC for proportions", "构建含 FPC 的样本比例标准误差表达式"),
        explanation: t(
          "The standard error of a proportion is corrected in the same way as for a mean, by multiplying the variance by the finite population factor. $SE(\\hat{p}) = \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n} \\cdot \\frac{N - n}{N - 1}}$.\n\nWith $\\hat{p} = 0.5$, $n = 25$ and $N = 101$: $\\frac{0.25}{25} \\cdot \\frac{76}{100} = 0.01 \\cdot 0.76 = 0.0076$, so $SE = \\sqrt{0.0076} \\approx 0.087$, below the uncorrected $\\sqrt{0.01} = 0.1$.\n\nCheck: the corrected value is the uncorrected $0.1$ times $\\sqrt{0.76} \\approx 0.87$, a factor below $1$.\n\n> **Watch out.** The factor is $\\frac{N - n}{N - 1}$, not its reciprocal: $\\frac{100}{76} > 1$ would make the standard error larger, the opposite of what sampling a big share of the population does.",
          "比例的标准误与均值的修正方法相同，都是把方差乘以有限总体修正因子。$SE(\\hat{p}) = \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n} \\cdot \\frac{N - n}{N - 1}}$。\n\n若 $\\hat{p} = 0.5$，$n = 25$，$N = 101$：$\\frac{0.25}{25} \\cdot \\frac{76}{100} = 0.01 \\cdot 0.76 = 0.0076$，所以 $SE = \\sqrt{0.0076} \\approx 0.087$，小于未校正的 $\\sqrt{0.01} = 0.1$。\n\n检验：校正值等于未校正的 $0.1$ 乘以 $\\sqrt{0.76} \\approx 0.87$，这个因子小于 $1$。\n\n> **注意。** 因子是 $\\frac{N - n}{N - 1}$，不是它的倒数：$\\frac{100}{76} > 1$ 会让标准误变大，与抽取总体很大一部分的效果相反。",
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
          return reasoned(
            choiceProblem({
              prompt: t(
                `When drawing a sample of size $n = ${n}$ without replacement from a population of size $N = ${N}$, what is the formula for the finite-population-corrected standard error of the sample proportion $\\hat{p}$?`,
                `当从容量为 $N = ${N}$ 的总体中不放回抽取容量为 $n = ${n}$ 的样本时，样本比例 $\\hat{p}$ 经有限总体校正后的标准误差公式是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Start from the uncorrected variance", "从未校正的方差出发"],
                    t(
                      `$\\frac{\\hat{p}(1 - \\hat{p})}{${n}}$ is the variance of $\\hat{p}$ when sampling with replacement.`,
                      `$\\frac{\\hat{p}(1 - \\hat{p})}{${n}}$ 是有放回抽样时 $\\hat{p}$ 的方差。`,
                    ),
                  ],
                  [
                    ["Multiply by the correction and take the root", "乘以校正因子再开平方"],
                    t(
                      `Multiplying by $\\frac{${N} - ${n}}{${N} - 1}$ and taking the square root gives $${correctStr}$.`,
                      `乘以 $\\frac{${N} - ${n}}{${N} - 1}$ 再开平方，得 $${correctStr}$。`,
                    ),
                  ],
                ],
                t(
                  `$\\frac{${N - n}}{${N - 1}} < 1$, so this standard error is smaller than the uncorrected $${alt2}$, as it should be.`,
                  `$\\frac{${N - n}}{${N - 1}} < 1$，所以这个标准误小于未校正的 $${alt2}$，理应如此。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "The correction factor is upside down: it must be less than $1$, and this one is greater.",
                "修正因子颠倒了：它应小于 $1$，而这个大于 $1$。",
              ],
              [
                opts[2]!.en,
                "This leaves out the correction factor, which is needed when sampling without replacement from a finite population.",
                "这里漏掉了修正因子，而从有限总体不放回抽样时需要它。",
              ],
              [
                opts[3]!.en,
                "The square root is missing, so this is not in the units of a standard error, and the factor's denominator is $N - 1$.",
                "这里缺了平方根，所以不是标准误的形式，修正因子的分母也应是 $N - 1$。",
              ],
            ],
          );
        },
      },
      {
        id: "the-corrected-margin-for-a-proportion",
        title: t("The corrected margin for a proportion", "比例的修正误差界"),
        explanation: t(
          "For a proportion estimated from a sample drawn without replacement, the standard error is multiplied by the same correction as for a mean:\n\n$$E = z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}\\sqrt{\\frac{N - n}{N - 1}}.$$\n\nCompute the uncorrected standard error, the correction factor and the critical value separately, then multiply. Surveying $100$ of the $226$ members of a club, the factor is $\\sqrt{\\frac{126}{225}} \\approx 0.75$, so the margin is about a quarter smaller than the textbook formula gives. If $50$ of the $100$ agree, the uncorrected $95\\%$ margin is $1.96 \\cdot 0.05 = 0.098$ and the corrected one is about $0.098 \\cdot 0.75 = 0.0735$.\n\nCheck: $0.75^{2} = 0.5625$, close to $\\frac{126}{225} = 0.56$, so the factor is right.\n\n> **Watch out.** Multiply the standard error by the root of the factor, not by the factor: $0.098 \\cdot 0.56 \\approx 0.055$ shrinks the margin too much.",
          "对于不放回抽样估计的比例，标准误要乘以与均值相同的校正因子：\n\n$$E = z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}\\sqrt{\\frac{N - n}{N - 1}}.$$\n\n分别算出未校正的标准误、校正因子和临界值，再相乘。例如调查某俱乐部 $226$ 名成员中的 $100$ 人，校正因子为 $\\sqrt{\\frac{126}{225}} \\approx 0.75$，误差界比教科书公式给出的约小四分之一。若 $100$ 人中有 $50$ 人赞成，未校正的 $95\\%$ 误差界为 $1.96 \\cdot 0.05 = 0.098$，校正后约为 $0.098 \\cdot 0.75 = 0.0735$。\n\n检验：$0.75^{2} = 0.5625$，接近 $\\frac{126}{225} = 0.56$，所以因子正确。\n\n> **注意。** 标准误要乘以因子的平方根，而不是因子本身：$0.098 \\cdot 0.56 \\approx 0.055$ 把误差界缩得太多了。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const [N, n, r] = pickFpc(rng);
          const x = rng.int(Math.ceil(n * 0.2), Math.floor(n * 0.8));
          const p = x / n;
          const se = Math.sqrt((p * (1 - p)) / n);
          const zn = z.toNumber();
          const rn = r.toNumber();
          const r4 = (v: number): Q => Q.of(Math.round(v * 10000), 10000);
          const ans = r4(zn * se * rn);
          return numberProblem({
            prompt: t(
              `A club has $N = ${N}$ members. A sample of $n = ${n}$ members is chosen without replacement, and $${x}$ of them favor a proposal. Find the finite-population-corrected margin of error for the proportion at $${pct}\\%$ confidence (use $z = ${dec(z)}$). Round to four decimal places.`,
              `某俱乐部有 $N = ${N}$ 名成员。不放回地抽取 $n = ${n}$ 名成员，其中 $${x}$ 人赞成一项提案。求置信水平 $${pct}\\%$ 下比例的经有限总体校正的误差界（取 $z = ${dec(z)}$），精确到四位小数。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: apart(ans, [
              why(r4(zn * se), "This leaves out the finite population correction.", "这漏掉了有限总体校正。"),
              why(
                r4(zn * se * rn * rn),
                `This multiplies by $\\frac{${N - n}}{${N - 1}}$ instead of its square root $${dec(r)}$.`,
                `这乘以了 $\\frac{${N - n}}{${N - 1}}$，而不是它的平方根 $${dec(r)}$。`,
              ),
              why(
                r4(zn * ((p * (1 - p)) / n) * rn),
                "This uses the variance $\\frac{\\hat{p}(1 - \\hat{p})}{n}$ without taking its square root.",
                "这用了方差 $\\frac{\\hat{p}(1 - \\hat{p})}{n}$，没有开平方。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the uncorrected standard error", "求未校正的标准误"],
                  t(
                    `$\\hat{p} = \\frac{${x}}{${n}} \\approx ${p.toFixed(4)}$, so $\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}} \\approx ${se.toFixed(5)}$.`,
                    `$\\hat{p} = \\frac{${x}}{${n}} \\approx ${p.toFixed(4)}$，所以 $\\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}} \\approx ${se.toFixed(5)}$。`,
                  ),
                ],
                [
                  ["Find the correction factor", "求校正因子"],
                  t(`$\\sqrt{\\frac{${N - n}}{${N - 1}}} = ${dec(r)}$.`, `$\\sqrt{\\frac{${N - n}}{${N - 1}}} = ${dec(r)}$。`),
                ],
                [
                  ["Multiply", "相乘"],
                  t(
                    `$E \\approx ${dec(z)} \\cdot ${se.toFixed(5)} \\cdot ${dec(r)} \\approx ${dec(ans)}$.`,
                    `$E \\approx ${dec(z)} \\cdot ${se.toFixed(5)} \\cdot ${dec(r)} \\approx ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `$${dec(ans)}$ is about $${dec(r)}$ of the uncorrected margin $${dec(r4(zn * se))}$.`,
                `$${dec(ans)}$ 约为未校正误差界 $${dec(r4(zn * se))}$ 的 $${dec(r)}$ 倍。`,
              ),
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
      "A $100(1 - \\alpha)\\%$ confidence interval for the variance $\\sigma^2$ of a normal population is $\\left(\\frac{(n - 1)s^2}{\\chi^2_{\\alpha/2, n-1}}, \\frac{(n - 1)s^2}{\\chi^2_{1 - \\alpha/2, n-1}}\\right)$.",
      "正态总体方差 $\\sigma^2$ 的 $100(1 - \\alpha)\\%$ 置信区间为 $\\left(\\frac{(n - 1)s^2}{\\chi^2_{\\alpha/2, n-1}}, \\frac{(n - 1)s^2}{\\chi^2_{1 - \\alpha/2, n-1}}\\right)$。",
    ),
    intro: t(
      "Ten bottles from a filling line have sample variance $s^{2} = 4$ square millilitres. For a normal population, $\\frac{(n - 1)s^{2}}{\\sigma^{2}}$ follows a chi-square distribution with $9$ degrees of freedom, and the middle $95\\%$ of that distribution runs from $\\chi^{2}_{0.975, 9} = 2.7$ to $\\chi^{2}_{0.025, 9} = 19.023$. Solving $2.7 \\le \\frac{36}{\\sigma^{2}} \\le 19.023$ for $\\sigma^{2}$ gives $\\frac{36}{19.023} \\le \\sigma^{2} \\le \\frac{36}{2.7}$, from about $1.89$ to $13.33$.\n\nCheck: $s^{2} = 4$ lies inside, but much nearer the lower end, because the chi-square distribution is skewed to the right.\n\nIn this lesson we set up the confidence interval $\\left[\\frac{(n - 1)s^{2}}{\\chi^{2}_{\\alpha/2}}, \\frac{(n - 1)s^{2}}{\\chi^{2}_{1 - \\alpha/2}}\\right]$ for a variance and compute its endpoints.",
      "从一条灌装线上抽取 $10$ 瓶，样本方差 $s^{2} = 4$ 平方毫升。对于正态总体，$\\frac{(n - 1)s^{2}}{\\sigma^{2}}$ 服从自由度为 $9$ 的卡方分布，其中间 $95\\%$ 从 $\\chi^{2}_{0.975, 9} = 2.7$ 到 $\\chi^{2}_{0.025, 9} = 19.023$。由 $2.7 \\le \\frac{36}{\\sigma^{2}} \\le 19.023$ 解出 $\\sigma^{2}$，得 $\\frac{36}{19.023} \\le \\sigma^{2} \\le \\frac{36}{2.7}$，约从 $1.89$ 到 $13.33$。\n\n检验：$s^{2} = 4$ 在区间内，但离下端近得多，因为卡方分布向右偏斜。\n\n本课我们建立方差的置信区间 $\\left[\\frac{(n - 1)s^{2}}{\\chi^{2}_{\\alpha/2}}, \\frac{(n - 1)s^{2}}{\\chi^{2}_{1 - \\alpha/2}}\\right]$ 并计算它的端点。",
    ),
    prerequisites: ["the-sample-variance", "the-chi-square-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "chi-square-variance-confidence-bounds",
        title: t("Identifying endpoints for variance confidence intervals", "确定方差置信区间的上下限构造"),
        explanation: t(
          "Dividing by the larger chi square value gives the lower bound and by the smaller value gives the upper bound, because the statistic is inverted. The interval is $\\left[\\frac{(n-1)s^2}{\\chi^2_{\\text{upper}}}, \\frac{(n-1)s^2}{\\chi^2_{\\text{lower}}}\\right]$. Note that the larger critical value produces the lower bound.\n\nFor $n = 15$ and $s^{2} = 10$, $(n - 1)s^{2} = 140$, and with $\\chi^{2}_{0.025, 14} = 26.119$ and $\\chi^{2}_{0.975, 14} = 5.629$ the interval is $\\left[\\frac{140}{26.119}, \\frac{140}{5.629}\\right] \\approx [5.36, 24.87]$.\n\nCheck: the left end $5.36$ is below the right end $24.87$, and $s^{2} = 10$ lies between them.\n\n> **Watch out.** Putting the smaller critical value first gives $[24.87, 5.36]$, an interval whose left end is above its right end.",
          "除以较大的卡方值得到下限，除以较小的卡方值得到上限，因为统计量被倒了过来。区间为 $\\left[\\frac{(n-1)s^2}{\\chi^2_{\\text{upper}}}, \\frac{(n-1)s^2}{\\chi^2_{\\text{lower}}}\\right]$。注意较大的卡方临界值对应置信下限。\n\n若 $n = 15$，$s^{2} = 10$，则 $(n - 1)s^{2} = 140$，取 $\\chi^{2}_{0.025, 14} = 26.119$ 和 $\\chi^{2}_{0.975, 14} = 5.629$，区间为 $\\left[\\frac{140}{26.119}, \\frac{140}{5.629}\\right] \\approx [5.36, 24.87]$。\n\n检验：左端 $5.36$ 小于右端 $24.87$，且 $s^{2} = 10$ 在两者之间。\n\n> **注意。** 把较小的临界值放在前面会得到 $[24.87, 5.36]$，左端反而大于右端。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(6, 40);
          const sSq = rng.int(5, 30);
          const ss = (n - 1) * sSq;
          return explainedChoice(rng, {
            prompt: t(
              `A random sample of size $n = ${n}$ from a normal distribution yields sample variance $s^2 = ${sSq}$. Write $\\chi^2_{p, \\nu}$ for the value that cuts off upper-tail area $p$. What is the correct formula for the $100(1 - \\alpha)\\%$ confidence interval for the population variance $\\sigma^2$?`,
              `从正态分布中抽取容量为 $n = ${n}$ 的随机样本，测得样本方差为 $s^2 = ${sSq}$。记 $\\chi^2_{p, \\nu}$ 为右侧尾部面积为 $p$ 的临界值。求总体方差 $\\sigma^2$ 的 $100(1 - \\alpha)\\%$ 置信区间的正确公式。`,
            ),
            correct: t(
              `$\\left[ \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}}, \\; \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}} \\right]$`,
              `$\\left[ \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}}, \\; \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}} \\right]$`,
            ),
            wrong: [
              {
                option: t(
                  `$\\left[ \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}}, \\; \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}} \\right]$`,
                  `$\\left[ \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}}, \\; \\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}} \\right]$`,
                ),
                why: t(
                  "The ends are swapped: dividing by the smaller value $\\chi^2_{1 - \\alpha/2}$ gives the larger number, so it must be the upper end.",
                  "两端颠倒了：除以较小的 $\\chi^2_{1 - \\alpha/2}$ 得到较大的数，所以它应是上端。",
                ),
              },
              {
                option: t(
                  `$\\left[ \\frac{${sSq}}{\\chi^2_{\\alpha/2, ${n}}}, \\; \\frac{${sSq}}{\\chi^2_{1 - \\alpha/2, ${n}}} \\right]$`,
                  `$\\left[ \\frac{${sSq}}{\\chi^2_{\\alpha/2, ${n}}}, \\; \\frac{${sSq}}{\\chi^2_{1 - \\alpha/2, ${n}}} \\right]$`,
                ),
                why: t(
                  `The numerator must be $(n - 1)s^2 = ${ss}$, not $s^2$, and the degrees of freedom are $n - 1 = ${n - 1}$, not $${n}$.`,
                  `分子应是 $(n - 1)s^2 = ${ss}$，不是 $s^2$；自由度是 $n - 1 = ${n - 1}$，不是 $${n}$。`,
                ),
              },
              {
                option: t(
                  `$${sSq} \\pm z_{\\alpha/2} \\frac{${sSq}}{\\sqrt{${n}}}$`,
                  `$${sSq} \\pm z_{\\alpha/2} \\frac{${sSq}}{\\sqrt{${n}}}$`,
                ),
                why: t(
                  "A variance interval comes from the chi-square pivot, not from a normal margin, and it is not symmetric about $s^2$.",
                  "方差区间来自卡方枢轴量，而不是正态误差界，它也不以 $s^2$ 为中心对称。",
                ),
              },
            ],
            solution: walked(
              [
                [
                  ["Write the pivot", "写出枢轴量"],
                  t(
                    `$\\frac{(n - 1)s^2}{\\sigma^2} = \\frac{${ss}}{\\sigma^2}$ has a $\\chi^2$ distribution with $${n - 1}$ degrees of freedom.`,
                    `$\\frac{(n - 1)s^2}{\\sigma^2} = \\frac{${ss}}{\\sigma^2}$ 服从自由度为 $${n - 1}$ 的 $\\chi^2$ 分布。`,
                  ),
                ],
                [
                  ["Invert the inequality", "反解不等式"],
                  t(
                    `From $\\chi^2_{1 - \\alpha/2, ${n - 1}} \\le \\frac{${ss}}{\\sigma^2} \\le \\chi^2_{\\alpha/2, ${n - 1}}$, taking reciprocals reverses the order: $\\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}} \\le \\sigma^2 \\le \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}}$.`,
                    `由 $\\chi^2_{1 - \\alpha/2, ${n - 1}} \\le \\frac{${ss}}{\\sigma^2} \\le \\chi^2_{\\alpha/2, ${n - 1}}$，取倒数后次序反转：$\\frac{${ss}}{\\chi^2_{\\alpha/2, ${n - 1}}} \\le \\sigma^2 \\le \\frac{${ss}}{\\chi^2_{1 - \\alpha/2, ${n - 1}}}$。`,
                  ),
                ],
              ],
              t(
                "The larger critical value $\\chi^2_{\\alpha/2}$ sits under the left end, so the left end is the smaller number.",
                "较大的临界值 $\\chi^2_{\\alpha/2}$ 在左端的分母上，所以左端是较小的数。",
              ),
            ),
          });
        },
      },
      {
        id: "endpoints-of-a-variance-interval",
        title: t("Endpoints of a variance interval", "方差区间的端点"),
        explanation: t(
          "Since $\\frac{(n - 1)s^{2}}{\\sigma^{2}}$ has a $\\chi^{2}_{n-1}$ distribution, the interval for $\\sigma^{2}$ divides $(n - 1)s^{2}$ by the two chi-square critical values. The **larger** critical value gives the **lower** endpoint:\n\n$$\\frac{(n - 1)s^{2}}{\\chi^{2}_{\\alpha/2}} \\le \\sigma^{2} \\le \\frac{(n - 1)s^{2}}{\\chi^{2}_{1 - \\alpha/2}},$$\n\nwhere $\\chi^{2}_{\\alpha/2}$ cuts off the upper tail. The interval is not symmetric about $s^{2}$, because the chi-square distribution is skewed.\n\nFor $n = 20$ and $s^{2} = 10$: $(n - 1)s^{2} = 190$, the lower endpoint is $\\frac{190}{32.852} \\approx 5.78$ and the upper is $\\frac{190}{8.907} \\approx 21.33$.\n\nCheck: $5.78 < 10 < 21.33$, and $21.33 - 10$ is much larger than $10 - 5.78$, as the skew predicts.\n\n> **Watch out.** Multiply $s^{2}$ by $n - 1 = 19$, not by $n = 20$: $\\frac{200}{8.907} \\approx 22.45$ is too large.",
          "因为 $\\frac{(n - 1)s^{2}}{\\sigma^{2}}$ 服从 $\\chi^{2}_{n-1}$ 分布，$\\sigma^{2}$ 的区间是用两个卡方临界值去除 $(n - 1)s^{2}$。**较大**的临界值给出**下**端点：\n\n$$\\frac{(n - 1)s^{2}}{\\chi^{2}_{\\alpha/2}} \\le \\sigma^{2} \\le \\frac{(n - 1)s^{2}}{\\chi^{2}_{1 - \\alpha/2}},$$\n\n其中 $\\chi^{2}_{\\alpha/2}$ 截去上尾。由于卡方分布是偏斜的，区间不以 $s^{2}$ 为中心对称。\n\n若 $n = 20$，$s^{2} = 10$：$(n - 1)s^{2} = 190$，下端点为 $\\frac{190}{32.852} \\approx 5.78$，上端点为 $\\frac{190}{8.907} \\approx 21.33$。\n\n检验：$5.78 < 10 < 21.33$，且 $21.33 - 10$ 远大于 $10 - 5.78$，与偏斜相符。\n\n> **注意。** $s^{2}$ 要乘以 $n - 1 = 19$，而不是 $n = 20$：$\\frac{200}{8.907} \\approx 22.45$ 太大了。",
        ),
        generate: (rng: Rng): Problem => {
          const [n, hi, lo] = rng.pick([
            [10, 19.023, 2.7],
            [15, 26.119, 5.629],
            [20, 32.852, 8.907],
            [25, 39.364, 12.401],
          ] as const);
          const s2 = rng.int(4, 120);
          const upper = rng.bool();
          const ans = round2(((n - 1) * s2) / (upper ? lo : hi));
          return numberProblem({
            prompt: t(
              `A sample of $n = ${n}$ from a normal population has variance $s^{2} = ${s2}$. With $\\chi^{2}_{0.025, ${n - 1}} = ${hi}$ and $\\chi^{2}_{0.975, ${n - 1}} = ${lo}$, find the ${upper ? "upper" : "lower"} endpoint of the $95\\%$ confidence interval for $\\sigma^{2}$. Round to two decimal places.`,
              `从正态总体中抽取容量 $n = ${n}$ 的样本，方差 $s^{2} = ${s2}$。已知 $\\chi^{2}_{0.025, ${n - 1}} = ${hi}$，$\\chi^{2}_{0.975, ${n - 1}} = ${lo}$，求 $\\sigma^{2}$ 的 $95\\%$ 置信区间的${upper ? "上" : "下"}端点，精确到两位小数。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: apart(ans, [
              why(
                round2(((n - 1) * s2) / (upper ? hi : lo)),
                `This divides by the ${upper ? "larger" : "smaller"} critical value, which gives the ${upper ? "lower" : "upper"} endpoint.`,
                `这除以了${upper ? "较大" : "较小"}的临界值，得到的是${upper ? "下" : "上"}端点。`,
              ),
              why(
                round2((n * s2) / (upper ? lo : hi)),
                `This multiplies $s^{2}$ by $n = ${n}$ instead of $n - 1 = ${n - 1}$.`,
                `这把 $s^{2}$ 乘以 $n = ${n}$，而不是 $n - 1 = ${n - 1}$。`,
              ),
              why(
                round2(s2 / (upper ? lo : hi)),
                `This divides $s^{2}$ alone, without the factor $n - 1 = ${n - 1}$.`,
                `这只用 $s^{2}$ 去除，漏掉了因子 $n - 1 = ${n - 1}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the numerator", "求分子"],
                  t(
                    `$(n - 1)s^{2} = ${n - 1} \\cdot ${s2} = ${(n - 1) * s2}$.`,
                    `$(n - 1)s^{2} = ${n - 1} \\cdot ${s2} = ${(n - 1) * s2}$。`,
                  ),
                ],
                [
                  ["Choose the critical value", "选取临界值"],
                  t(
                    `The ${upper ? "upper endpoint uses the smaller" : "lower endpoint uses the larger"} critical value, $${upper ? lo : hi}$.`,
                    `${upper ? "上端点用较小的" : "下端点用较大的"}临界值 $${upper ? lo : hi}$。`,
                  ),
                ],
                [
                  ["Divide", "相除"],
                  t(
                    `$\\frac{${(n - 1) * s2}}{${upper ? lo : hi}} \\approx ${dec(ans)}$.`,
                    `$\\frac{${(n - 1) * s2}}{${upper ? lo : hi}} \\approx ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `The endpoint $${dec(ans)}$ is ${upper ? "above" : "below"} $s^{2} = ${s2}$, as the ${upper ? "upper" : "lower"} end must be.`,
                `端点 $${dec(ans)}$ ${upper ? "大于" : "小于"} $s^{2} = ${s2}$，${upper ? "上" : "下"}端点理应如此。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.26.1 Confidence Intervals for Two Means: Known and Unequal Population Variances
  {
    id: "confidence-intervals-for-differences-between-two-means-known-population-variances",
    title: t("Confidence Intervals for Two Means: Known and Unequal Population Variances", "两个均值之差的置信区间：已知且不等的总体方差"),
    summary: t(
      "When independent samples are drawn from populations with known variances $\\sigma_1^2$ and $\\sigma_2^2$, the confidence interval for $\\mu_1 - \\mu_2$ is $(\\bar{x}_1 - \\bar{x}_2) \\pm z_{\\alpha/2} \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$.",
      "当从已知方差分别为 $\\sigma_1^2$ 与 $\\sigma_2^2$ 的两个总体中抽取独立样本时，$\\mu_1 - \\mu_2$ 的置信区间为 $(\\bar{x}_1 - \\bar{x}_2) \\pm z_{\\alpha/2} \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$。",
    ),
    intro: t(
      "Two fertilisers are tried on separate plots. Plot A gives $n_1 = 16$ plants with mean height $\\bar{x}_1 = 50$ and known $\\sigma_1 = 12$; plot B gives $n_2 = 9$ plants with $\\bar{x}_2 = 42$ and $\\sigma_2 = 6$. The variances of the two means add: $\\frac{144}{16} + \\frac{36}{9} = 9 + 4 = 13$, so the standard error of $\\bar{x}_1 - \\bar{x}_2$ is $\\sqrt{13} \\approx 3.61$. The $95\\%$ interval for $\\mu_1 - \\mu_2$ is $8 \\pm 1.96 \\cdot 3.61 \\approx 8 \\pm 7.07$, from about $0.93$ to $15.07$.\n\nCheck: both endpoints are positive, so the interval does not contain $0$, and the data point to taller plants with fertiliser A.\n\nIn this lesson we compute the squared standard error $\\frac{\\sigma_1^{2}}{n_1} + \\frac{\\sigma_2^{2}}{n_2}$ of a difference of independent means and the endpoints of the interval for $\\mu_1 - \\mu_2$.",
      "两种肥料分别施在不同地块上。地块 A 有 $n_1 = 16$ 株，平均株高 $\\bar{x}_1 = 50$，已知 $\\sigma_1 = 12$；地块 B 有 $n_2 = 9$ 株，$\\bar{x}_2 = 42$，$\\sigma_2 = 6$。两个均值的方差相加：$\\frac{144}{16} + \\frac{36}{9} = 9 + 4 = 13$，所以 $\\bar{x}_1 - \\bar{x}_2$ 的标准误为 $\\sqrt{13} \\approx 3.61$。$\\mu_1 - \\mu_2$ 的 $95\\%$ 区间为 $8 \\pm 1.96 \\cdot 3.61 \\approx 8 \\pm 7.07$，约从 $0.93$ 到 $15.07$。\n\n检验：两个端点都为正，区间不含 $0$，数据表明施肥料 A 的植株更高。\n\n本课我们计算独立均值之差的标准误平方 $\\frac{\\sigma_1^{2}}{n_1} + \\frac{\\sigma_2^{2}}{n_2}$，以及 $\\mu_1 - \\mu_2$ 区间的端点。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "two-mean-known-variance-se",
        title: t("Evaluating the standard error of difference between two independent means", "计算两个独立均值之差的标准误差"),
        explanation: t(
          "The variances of independent sample means add, even for a difference, so the standard error is the square root of their sum. The standard error is $SE = \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$.\n\nWith $\\sigma_1^{2} = 40$, $n_1 = 10$, $\\sigma_2^{2} = 30$ and $n_2 = 15$: $SE^{2} = 4 + 2 = 6$, so $SE = \\sqrt{6} \\approx 2.45$.\n\nCheck: $SE^{2} = 6$ is larger than each part, $4$ and $2$; a difference of two noisy means is noisier than either.\n\n> **Watch out.** Do not subtract the variances because the means are subtracted: $4 - 2 = 2$ understates the spread. Pooling as $\\frac{40 + 30}{10 + 15} = 2.8$ is wrong too.",
          "独立样本均值的方差即使相减也要相加，所以标准误是它们之和的平方根。标准误差为 $SE = \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$。\n\n若 $\\sigma_1^{2} = 40$，$n_1 = 10$，$\\sigma_2^{2} = 30$，$n_2 = 15$：$SE^{2} = 4 + 2 = 6$，所以 $SE = \\sqrt{6} \\approx 2.45$。\n\n检验：$SE^{2} = 6$ 比每一部分 $4$ 和 $2$ 都大；两个有波动的均值之差比任一个波动更大。\n\n> **注意。** 不要因为均值相减就把方差相减：$4 - 2 = 2$ 低估了离散程度。按 $\\frac{40 + 30}{10 + 15} = 2.8$ 合并也是错的。",
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
              `Independent samples from two populations have sizes $n_1 = ${n1}$, $n_2 = ${n2}$ and known population variances $\\sigma_1^2 = ${v1}$, $\\sigma_2^2 = ${v2}$. Find the squared standard error of the difference between sample means.`,
              `来自两个总体的独立样本容量分别为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$，已知总体方差分别为 $\\sigma_1^2 = ${v1}$ 与 $\\sigma_2^2 = ${v2}$。求样本均值之差的标准误差平方。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(v1 * v2, n1 * n2)],
            mistakes: apart(Q.of(num, den), [
              why(
                Q.of(v1 + v2, n1 + n2),
                "This adds the variances and the sizes before dividing; each variance is divided by its own sample size.",
                "这先把方差相加、容量相加再相除；每个方差应除以各自的样本容量。",
              ),
              why(
                Q.of(v1, n1).sub(Q.of(v2, n2)),
                "This subtracts the two parts; the variances of independent means add even for a difference.",
                "这把两部分相减了；即使是差，独立均值的方差也要相加。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Divide each variance by its sample size", "每个方差除以各自的样本容量"],
                  t(`$\\frac{${v1}}{${n1}}$ and $\\frac{${v2}}{${n2}}$.`, `$\\frac{${v1}}{${n1}}$ 和 $\\frac{${v2}}{${n2}}$。`),
                ],
                [
                  ["Add", "相加"],
                  t(
                    `$\\text{SE}^2 = \\frac{${v1}}{${n1}} + \\frac{${v2}}{${n2}} = \\frac{${v1 * n2} + ${v2 * n1}}{${den}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `$\\text{SE}^2 = \\frac{${v1}}{${n1}} + \\frac{${v2}}{${n2}} = \\frac{${v1 * n2} + ${v2 * n1}}{${den}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              t(
                `$${Q.of(num, den).toLatex()}$ is larger than each part, $${Q.of(v1, n1).toLatex()}$ and $${Q.of(v2, n2).toLatex()}$.`,
                `$${Q.of(num, den).toLatex()}$ 比每一部分 $${Q.of(v1, n1).toLatex()}$ 和 $${Q.of(v2, n2).toLatex()}$ 都大。`,
              ),
            ),
          });
        },
      },
      {
        id: "endpoints-of-an-interval-for-a-difference-of-means",
        title: t("Endpoints of an interval for $\\mu_1 - \\mu_2$", "$\\mu_1 - \\mu_2$ 区间的端点"),
        explanation: t(
          "The interval for $\\mu_1 - \\mu_2$ is centered at the observed difference $\\bar{x}_1 - \\bar{x}_2$ and reaches $z_{\\alpha/2}$ standard errors to each side. If the interval contains $0$, the data are consistent with equal means; if both endpoints have the same sign, they point to a real difference in that direction.\n\nWith $\\bar{x}_1 = 72$, $\\bar{x}_2 = 68$, $\\frac{\\sigma_1^{2}}{n_1} = 1.44$ and $\\frac{\\sigma_2^{2}}{n_2} = 1.06$, the standard error is $\\sqrt{2.5} \\approx 1.58$; using a squared standard error that is a perfect square keeps the arithmetic exact. The $95\\%$ interval is $4 \\pm 1.96 \\cdot 1.58 \\approx 4 \\pm 3.10$, from $0.90$ to $7.10$.\n\nCheck: both endpoints are positive, so the interval excludes $0$ and points to $\\mu_1 > \\mu_2$.\n\n> **Watch out.** Add the variances, not the standard deviations: $\\sqrt{1.44} + \\sqrt{1.06} \\approx 2.23$ is larger than the true standard error $1.58$.",
          "$\\mu_1 - \\mu_2$ 的区间以观测差 $\\bar{x}_1 - \\bar{x}_2$ 为中心，向两侧各延伸 $z_{\\alpha/2}$ 个标准误。若区间包含 $0$，数据与均值相等相容；若两端点同号，则表明在该方向上存在真实差异。\n\n例如 $\\bar{x}_1 = 72$，$\\bar{x}_2 = 68$，$\\frac{\\sigma_1^{2}}{n_1} = 1.44$，$\\frac{\\sigma_2^{2}}{n_2} = 1.06$，标准误为 $\\sqrt{2.5} \\approx 1.58$；若方差和恰为完全平方数，计算就是精确的。$95\\%$ 区间为 $4 \\pm 1.96 \\cdot 1.58 \\approx 4 \\pm 3.10$，即从 $0.90$ 到 $7.10$。\n\n检验：两个端点都为正，区间不含 $0$，表明 $\\mu_1 > \\mu_2$。\n\n> **注意。** 要把方差相加，而不是把标准差相加：$\\sqrt{1.44} + \\sqrt{1.06} \\approx 2.23$ 比真正的标准误 $1.58$ 大。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const [a, b, c] = rng.pick([
            [3, 4, 5],
            [6, 8, 10],
            [5, 12, 13],
            [8, 6, 10],
            [12, 5, 13],
          ] as const);
          const scale = rng.pick([1, 2]);
          const sd1 = a * scale;
          const sd2 = b * scale;
          const n = rng.pick([4, 9, 16, 25]);
          const root = Math.sqrt(n);
          const s1 = sd1 * root;
          const s2 = sd2 * root;
          const se = Q.of(c * scale);
          const x1 = rng.int(40, 90);
          const x2 = rng.int(40, 90);
          const diff = Q.of(x1 - x2);
          const margin = z.mul(se);
          const upper = rng.bool();
          const ans = upper ? diff.add(margin) : diff.sub(margin);
          const wrongSe = Q.of(sd1 + sd2);
          return numberProblem({
            prompt: t(
              `Independent samples of size $n_1 = n_2 = ${n}$ come from normal populations with $\\sigma_1 = ${s1}$ and $\\sigma_2 = ${s2}$. The sample means are $\\bar{x}_1 = ${x1}$ and $\\bar{x}_2 = ${x2}$. Find the ${upper ? "upper" : "lower"} endpoint of the $${pct}\\%$ confidence interval for $\\mu_1 - \\mu_2$ (use $z = ${dec(z)}$).`,
              `从 $\\sigma_1 = ${s1}$ 和 $\\sigma_2 = ${s2}$ 的两个正态总体中各抽取容量 $n_1 = n_2 = ${n}$ 的独立样本，样本均值为 $\\bar{x}_1 = ${x1}$，$\\bar{x}_2 = ${x2}$。求 $\\mu_1 - \\mu_2$ 的 $${pct}\\%$ 置信区间的${upper ? "上" : "下"}端点（取 $z = ${dec(z)}$）。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: apart(ans, [
              why(
                upper ? diff.sub(margin) : diff.add(margin),
                `This is the ${upper ? "lower" : "upper"} endpoint; the ${upper ? "upper" : "lower"} one ${upper ? "adds" : "subtracts"} the margin.`,
                `这是${upper ? "下" : "上"}端点；${upper ? "上" : "下"}端点要${upper ? "加上" : "减去"}误差界。`,
              ),
              why(
                upper ? diff.add(z.mul(wrongSe)) : diff.sub(z.mul(wrongSe)),
                `This adds the standard deviations $${sd1} + ${sd2} = ${sd1 + sd2}$; the variances add, and their sum's root is $${c * scale}$.`,
                `这把标准差相加 $${sd1} + ${sd2} = ${sd1 + sd2}$；应把方差相加，和的平方根为 $${c * scale}$。`,
              ),
              why(
                upper ? diff.add(se) : diff.sub(se),
                `This moves one standard error $${c * scale}$ without multiplying by $z = ${dec(z)}$.`,
                `这只移动了一个标准误 $${c * scale}$，没有乘以 $z = ${dec(z)}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Add the variances of the means", "把均值的方差相加"],
                  t(
                    `$\\frac{\\sigma_1^{2}}{n_1} + \\frac{\\sigma_2^{2}}{n_2} = \\frac{${s1 * s1}}{${n}} + \\frac{${s2 * s2}}{${n}} = ${sd1 * sd1} + ${sd2 * sd2} = ${(c * scale) ** 2}$, so the standard error is $${c * scale}$.`,
                    `$\\frac{\\sigma_1^{2}}{n_1} + \\frac{\\sigma_2^{2}}{n_2} = \\frac{${s1 * s1}}{${n}} + \\frac{${s2 * s2}}{${n}} = ${sd1 * sd1} + ${sd2 * sd2} = ${(c * scale) ** 2}$，所以标准误为 $${c * scale}$。`,
                  ),
                ],
                [
                  ["Find the margin", "求误差界"],
                  t(`$${dec(z)} \\cdot ${c * scale} = ${dec(margin)}$.`, `$${dec(z)} \\cdot ${c * scale} = ${dec(margin)}$。`),
                ],
                [
                  ["Apply it to the observed difference", "加减到观测差上"],
                  t(
                    `$\\bar{x}_1 - \\bar{x}_2 = ${x1} - ${x2} = ${dec(diff)}$, so the endpoint is $${par(diff)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$.`,
                    `$\\bar{x}_1 - \\bar{x}_2 = ${x1} - ${x2} = ${dec(diff)}$，所以端点为 $${par(diff)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `$${c * scale}^{2} = ${(c * scale) ** 2} = ${sd1 * sd1} + ${sd2 * sd2}$, and $${dec(ans)}$ lies $${dec(margin)}$ from the observed difference $${dec(diff)}$.`,
                `$${c * scale}^{2} = ${(c * scale) ** 2} = ${sd1 * sd1} + ${sd2 * sd2}$，且 $${dec(ans)}$ 与观测差 $${dec(diff)}$ 相距 $${dec(margin)}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.26.2 Confidence Intervals for Two Means: Equal and Unknown Population Variance
  {
    id: "confidence-intervals-for-differences-between-two-means-unknown-equal-population-variances",
    title: t("Confidence Intervals for Two Means: Equal and Unknown Population Variance", "两个均值之差的置信区间：未知但相等的总体方差"),
    summary: t(
      "Assuming equal unknown variances $\\sigma_1^2 = \\sigma_2^2$, the confidence interval is $(\\bar{x}_1 - \\bar{x}_2) \\pm t_{\\alpha/2, n_1+n_2-2}\\, s_p \\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}$.",
      "在假定总体方差未知但相等（$\\sigma_1^2 = \\sigma_2^2$）的条件下，置信区间为 $(\\bar{x}_1 - \\bar{x}_2) \\pm t_{\\alpha/2, n_1+n_2-2}\\, s_p \\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}$。",
    ),
    intro: t(
      "Two classes sit the same test. Class A has $n_1 = 10$ pupils with $\\bar{x}_1 = 70$ and $s_1^{2} = 20$; class B has $n_2 = 12$ with $\\bar{x}_2 = 64$ and $s_2^{2} = 30$. If both classes share one unknown variance, the two sample variances are combined by their degrees of freedom: $s_p^{2} = \\frac{9 \\cdot 20 + 11 \\cdot 30}{10 + 12 - 2} = \\frac{510}{20} = 25.5$. The standard error of $\\bar{x}_1 - \\bar{x}_2$ is $\\sqrt{25.5}\\sqrt{\\frac{1}{10} + \\frac{1}{12}} \\approx 2.16$, and the critical value comes from the $t$-distribution with $20$ degrees of freedom.\n\nCheck: $25.5$ lies between $20$ and $30$, a little nearer $30$, which comes from the larger class.\n\nIn this lesson we find the degrees of freedom $n_1 + n_2 - 2$ of the pooled two-sample interval and compute the pooled variance $s_p^{2}$.",
      "两个班参加同一测验。A 班 $n_1 = 10$ 人，$\\bar{x}_1 = 70$，$s_1^{2} = 20$；B 班 $n_2 = 12$ 人，$\\bar{x}_2 = 64$，$s_2^{2} = 30$。若两班有同一个未知方差，就按自由度合并两个样本方差：$s_p^{2} = \\frac{9 \\cdot 20 + 11 \\cdot 30}{10 + 12 - 2} = \\frac{510}{20} = 25.5$。$\\bar{x}_1 - \\bar{x}_2$ 的标准误为 $\\sqrt{25.5}\\sqrt{\\frac{1}{10} + \\frac{1}{12}} \\approx 2.16$，临界值取自自由度为 $20$ 的 $t$ 分布。\n\n检验：$25.5$ 在 $20$ 与 $30$ 之间，稍靠近来自人数较多班级的 $30$。\n\n本课我们求合并双样本区间的自由度 $n_1 + n_2 - 2$，并计算合并方差 $s_p^{2}$。",
    ),
    prerequisites: ["pooled-variance", "confidence-intervals-for-differences-between-two-means-known-population-variances"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "pooled-t-degrees-of-freedom",
        title: t("Degrees of freedom for pooled two-sample t interval", "合并双样本 t 置信区间的自由度"),
        explanation: t(
          "Each sample loses one degree of freedom for its own mean, so the pooled degrees of freedom are the total sample size minus two. The degrees of freedom for the pooled two-sample $t$ is $\\nu = n_1 + n_2 - 2$.\n\nWith $n_1 = 12$ and $n_2 = 15$: $\\nu = 12 + 15 - 2 = 25$.\n\nCheck: the two samples alone have $11$ and $14$ degrees of freedom, and $11 + 14 = 25$.\n\n> **Watch out.** Two means are estimated, so subtract $2$, not $1$: $n_1 + n_2 - 1 = 26$ counts as if the samples were one.",
          "每个样本因估计自己的均值而失去一个自由度，所以合并后的自由度是总样本量减 2。合并双样本 $t$ 检验或置信区间的自由度为 $\\nu = n_1 + n_2 - 2$。\n\n若 $n_1 = 12$，$n_2 = 15$：$\\nu = 12 + 15 - 2 = 25$。\n\n检验：两个样本各自的自由度为 $11$ 和 $14$，$11 + 14 = 25$。\n\n> **注意。** 要估计两个均值，所以减 $2$ 而不是 $1$：$n_1 + n_2 - 1 = 26$ 相当于把两个样本当成一个。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(8, 35);
          const n2 = rng.int(8, 35);

          return numberProblem({
            prompt: t(
              `Two independent samples of sizes $n_1 = ${n1}$ and $n_2 = ${n2}$ are drawn from normal populations with unknown but equal variances. How many degrees of freedom are associated with the pooled $t$ statistic?`,
              `从方差未知但假定相等的正态总体中分别抽取容量为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$ 的独立样本。合并 $t$ 统计量的自由度 是多少？`,
            ),
            answer: n1 + n2 - 2,
            mistakes: apart(n1 + n2 - 2, [
              why(
                n1 + n2 - 1,
                "This subtracts only $1$; each of the two samples estimates its own mean.",
                "这只减了 $1$；两个样本各自估计一个均值。",
              ),
              why(
                n1 + n2,
                "This is the total sample size; two degrees of freedom go to the two means.",
                "这是样本总量；两个自由度用于两个均值。",
              ),
              why(
                Math.min(n1, n2) - 1,
                "This is the conservative rule for unequal variances, not the pooled count.",
                "这是方差不等时的保守规则，不是合并时的自由度。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Count each sample's degrees of freedom", "数出每个样本的自由度"],
                  t(`$n_1 - 1 = ${n1 - 1}$ and $n_2 - 1 = ${n2 - 1}$.`, `$n_1 - 1 = ${n1 - 1}$，$n_2 - 1 = ${n2 - 1}$。`),
                ],
                [
                  ["Add them", "相加"],
                  t(`$\\nu = ${n1 - 1} + ${n2 - 1} = ${n1 + n2 - 2}$.`, `$\\nu = ${n1 - 1} + ${n2 - 1} = ${n1 + n2 - 2}$。`),
                ],
              ],
              t(`$${n1} + ${n2} - 2 = ${n1 + n2 - 2}$ gives the same count.`, `$${n1} + ${n2} - 2 = ${n1 + n2 - 2}$，结果相同。`),
            ),
          });
        },
      },
      {
        id: "the-pooled-variance",
        title: t("The pooled variance", "合并方差"),
        explanation: t(
          "When the two populations share a variance, both samples estimate it, and the **pooled variance** combines them, weighting each sample variance by its degrees of freedom:\n\n$$s_p^{2} = \\frac{(n_1 - 1)s_1^{2} + (n_2 - 1)s_2^{2}}{n_1 + n_2 - 2}.$$\n\nIt always lies between $s_1^{2}$ and $s_2^{2}$, closer to the one from the larger sample. The interval then uses $s_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}$ as its standard error.\n\nWith $n_1 = 6$, $s_1^{2} = 10$, $n_2 = 11$ and $s_2^{2} = 25$: $s_p^{2} = \\frac{5 \\cdot 10 + 10 \\cdot 25}{15} = \\frac{300}{15} = 20$.\n\nCheck: $20$ lies between $10$ and $25$, nearer $25$, the variance of the larger sample.\n\n> **Watch out.** The simple average $\\frac{10 + 25}{2} = 17.5$ ignores the sample sizes, and dividing $300$ by $n_1 + n_2 = 17$ forgets the two degrees of freedom used by the means.",
          "当两个总体方差相同时，两个样本都在估计它，**合并方差**把两者结合起来，以自由度为权重：\n\n$$s_p^{2} = \\frac{(n_1 - 1)s_1^{2} + (n_2 - 1)s_2^{2}}{n_1 + n_2 - 2}.$$\n\n它总在 $s_1^{2}$ 与 $s_2^{2}$ 之间，并更靠近样本较大的那一个。区间的标准误为 $s_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}$。\n\n若 $n_1 = 6$，$s_1^{2} = 10$，$n_2 = 11$，$s_2^{2} = 25$：$s_p^{2} = \\frac{5 \\cdot 10 + 10 \\cdot 25}{15} = \\frac{300}{15} = 20$。\n\n检验：$20$ 在 $10$ 与 $25$ 之间，更靠近样本较大者的方差 $25$。\n\n> **注意。** 简单平均 $\\frac{10 + 25}{2} = 17.5$ 忽略了样本容量；把 $300$ 除以 $n_1 + n_2 = 17$ 则忘了两个均值用掉的两个自由度。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(5, 20);
          let n2 = rng.int(5, 20);
          if (n2 === n1) n2 += 3;
          const v1 = rng.int(4, 60);
          let v2 = rng.int(4, 60);
          if (v2 === v1) v2 += 7;
          const num = (n1 - 1) * v1 + (n2 - 1) * v2;
          const df = n1 + n2 - 2;
          const ans = Q.of(num, df);
          return numberProblem({
            prompt: t(
              `Two independent samples from populations with a common variance have $n_1 = ${n1}$, $s_1^{2} = ${v1}$ and $n_2 = ${n2}$, $s_2^{2} = ${v2}$. Find the pooled variance $s_p^{2}$.`,
              `来自方差相同的两个总体的独立样本满足 $n_1 = ${n1}$，$s_1^{2} = ${v1}$；$n_2 = ${n2}$，$s_2^{2} = ${v2}$。求合并方差 $s_p^{2}$。`,
            ),
            answer: ans,
            wrong: [Q.of(v1, n1).add(Q.of(v2, n2))],
            mistakes: apart(ans, [
              why(
                Q.of(v1 + v2, 2),
                "This is the simple average of the two variances; it ignores the sample sizes.",
                "这是两个方差的简单平均，忽略了样本容量。",
              ),
              why(
                Q.of(n1 * v1 + n2 * v2, n1 + n2),
                "This weights by $n_1$ and $n_2$ and divides by $n_1 + n_2$; the weights are the degrees of freedom.",
                "这以 $n_1$、$n_2$ 为权重并除以 $n_1 + n_2$；权重应是自由度。",
              ),
              why(
                Q.of(num, n1 + n2),
                `This divides by $n_1 + n_2 = ${n1 + n2}$ instead of $n_1 + n_2 - 2 = ${df}$.`,
                `这除以了 $n_1 + n_2 = ${n1 + n2}$，而不是 $n_1 + n_2 - 2 = ${df}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Weight each variance by its degrees of freedom", "以自由度为权重"],
                  t(
                    `$${n1 - 1} \\cdot ${v1} + ${n2 - 1} \\cdot ${v2} = ${(n1 - 1) * v1} + ${(n2 - 1) * v2} = ${num}$.`,
                    `$${n1 - 1} \\cdot ${v1} + ${n2 - 1} \\cdot ${v2} = ${(n1 - 1) * v1} + ${(n2 - 1) * v2} = ${num}$。`,
                  ),
                ],
                [
                  ["Divide by the total degrees of freedom", "除以总自由度"],
                  t(
                    `$s_p^{2} = \\frac{${num}}{${n1} + ${n2} - 2} = \\frac{${num}}{${df}}${lowestTerms(num, df)}$.`,
                    `$s_p^{2} = \\frac{${num}}{${n1} + ${n2} - 2} = \\frac{${num}}{${df}}${lowestTerms(num, df)}$。`,
                  ),
                ],
              ],
              t(
                `$${ans.toLatex()}$ lies between $${Math.min(v1, v2)}$ and $${Math.max(v1, v2)}$, nearer the variance of the larger sample.`,
                `$${ans.toLatex()}$ 在 $${Math.min(v1, v2)}$ 与 $${Math.max(v1, v2)}$ 之间，更靠近样本较大者的方差。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.26.3 Confidence Intervals for Two Means: Unequal and Unknown Population Variance
  {
    id: "confidence-intervals-for-differences-between-two-means-unknown-unequal-population-variances",
    title: t("Confidence Intervals for Two Means: Unequal and Unknown Population Variance", "两个均值之差的置信区间：未知且不等的总体方差"),
    summary: t(
      "When population variances are unequal and unknown, Welch's $t$-interval uses $\\text{SE} = \\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}$ with degrees of freedom computed via the Welch–Satterthwaite approximation.",
      "当总体方差未知且不相等时，韦尔奇（Welch）$t$ 区间采用标准误差 $\\text{SE} = \\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}$，并通过韦尔奇–萨特思韦特公式计算自由度。",
    ),
    intro: t(
      "A new and an old battery are each tested. The new type gives $n_1 = 10$ lifetimes with $s_1^{2} = 40$, the old type $n_2 = 13$ with $s_2^{2} = 13$, and there is no reason to think the variances are equal. Each sample mean keeps its own variance: $a = \\frac{40}{10} = 4$ and $b = \\frac{13}{13} = 1$, so the squared standard error of $\\bar{x}_1 - \\bar{x}_2$ is $4 + 1 = 5$. The $t$ critical value uses the Welch–Satterthwaite degrees of freedom $\\frac{(4 + 1)^{2}}{\\frac{16}{9} + \\frac{1}{12}} = \\frac{25}{\\frac{67}{36}} = \\frac{900}{67} \\approx 13.43$, rounded down to $13$.\n\nCheck: $13$ lies between $\\min(10, 13) - 1 = 9$ and $10 + 13 - 2 = 21$, as the Welch value always does.\n\nIn this lesson we compute Welch's squared standard error $\\frac{s_1^{2}}{n_1} + \\frac{s_2^{2}}{n_2}$ and the Welch–Satterthwaite degrees of freedom.",
      "分别测试新、旧两种电池。新电池 $n_1 = 10$ 个寿命，$s_1^{2} = 40$；旧电池 $n_2 = 13$ 个，$s_2^{2} = 13$，没有理由认为方差相等。每个样本均值保留自己的方差：$a = \\frac{40}{10} = 4$，$b = \\frac{13}{13} = 1$，所以 $\\bar{x}_1 - \\bar{x}_2$ 的标准误平方为 $4 + 1 = 5$。$t$ 临界值用韦尔奇–萨特思韦特自由度 $\\frac{(4 + 1)^{2}}{\\frac{16}{9} + \\frac{1}{12}} = \\frac{25}{\\frac{67}{36}} = \\frac{900}{67} \\approx 13.43$，向下取整为 $13$。\n\n检验：$13$ 介于 $\\min(10, 13) - 1 = 9$ 与 $10 + 13 - 2 = 21$ 之间，韦尔奇自由度总是如此。\n\n本课我们计算韦尔奇标准误平方 $\\frac{s_1^{2}}{n_1} + \\frac{s_2^{2}}{n_2}$ 以及韦尔奇–萨特思韦特自由度。",
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
          "When the variances may differ, the standard error of the difference simply adds the two estimated variances of the sample means. Welch's standard error is $SE = \\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}$.\n\nWith $s_1^{2} = 18$, $n_1 = 6$, $s_2^{2} = 20$ and $n_2 = 10$: $SE^{2} = 3 + 2 = 5$, and $SE = \\sqrt{5} \\approx 2.24$.\n\nCheck: unlike the pooled method, nothing is averaged; each sample variance is divided by its own size, $\\frac{18}{6} = 3$ and $\\frac{20}{10} = 2$.\n\n> **Watch out.** Do not cross the sizes: $\\frac{18 \\cdot 6 + 20 \\cdot 10}{60} \\approx 5.13$ multiplies each variance by its own $n$ instead of dividing by it.",
          "当方差可能不同时，差的标准误只需把两个样本均值的估计方差相加。韦尔奇标准误差为 $SE = \\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}$。\n\n若 $s_1^{2} = 18$，$n_1 = 6$，$s_2^{2} = 20$，$n_2 = 10$：$SE^{2} = 3 + 2 = 5$，$SE = \\sqrt{5} \\approx 2.24$。\n\n检验：与合并方法不同，这里不做平均；每个样本方差除以各自的容量，$\\frac{18}{6} = 3$，$\\frac{20}{10} = 2$。\n\n> **注意。** 不要把容量交叉：$\\frac{18 \\cdot 6 + 20 \\cdot 10}{60} \\approx 5.13$ 是把每个方差乘以自己的 $n$，而不是除以它。",
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
              `Two independent samples have sizes $n_1 = ${n1}$, $n_2 = ${n2}$ and sample variances $s_1^2 = ${s1Sq}$, $s_2^2 = ${s2Sq}$. For Welch's $t$ procedure with unequal variances, calculate the squared standard error.`,
              `两个独立样本的容量分别为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$，样本方差分别为 $s_1^2 = ${s1Sq}$ 与 $s_2^2 = ${s2Sq}$。在不等方差的韦尔奇 $t$ 程序下，计算标准误差的平方。`,
            ),
            answer: Q.of(num, den),
            mistakes: apart(Q.of(num, den), [
              why(
                Q.of(s1Sq + s2Sq, n1 + n2),
                "This adds the variances and the sizes before dividing; each variance is divided by its own size.",
                "这先把方差相加、容量相加再相除；每个方差应除以各自的容量。",
              ),
              why(
                Q.of(s1Sq * n1 + s2Sq * n2, den),
                "This crosses the sizes, so each variance is in effect multiplied by its own $n$ rather than divided by it.",
                "这把容量交叉了，相当于每个方差乘以自己的 $n$，而不是除以它。",
              ),
              why(
                Q.of(s1Sq + s2Sq, den),
                "This divides the sum of the variances by $n_1 n_2$; the fractions need a common denominator first.",
                "这把方差之和除以 $n_1 n_2$；两个分数要先通分。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Divide each variance by its sample size", "每个方差除以各自的样本容量"],
                  t(
                    `$\\frac{s_1^2}{n_1} = \\frac{${s1Sq}}{${n1}}$ and $\\frac{s_2^2}{n_2} = \\frac{${s2Sq}}{${n2}}$.`,
                    `$\\frac{s_1^2}{n_1} = \\frac{${s1Sq}}{${n1}}$，$\\frac{s_2^2}{n_2} = \\frac{${s2Sq}}{${n2}}$。`,
                  ),
                ],
                [
                  ["Add over a common denominator", "通分相加"],
                  t(
                    `$\\frac{${s1Sq * n2} + ${s2Sq * n1}}{${den}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `$\\frac{${s1Sq * n2} + ${s2Sq * n1}}{${den}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              t(
                `$${Q.of(num, den).toLatex()}$ is larger than each part, $${Q.of(s1Sq, n1).toLatex()}$ and $${Q.of(s2Sq, n2).toLatex()}$.`,
                `$${Q.of(num, den).toLatex()}$ 比每一部分 $${Q.of(s1Sq, n1).toLatex()}$ 和 $${Q.of(s2Sq, n2).toLatex()}$ 都大。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-welch-degrees-of-freedom",
        title: t("The Welch degrees of freedom", "韦尔奇自由度"),
        explanation: t(
          "Without equal variances the statistic is only approximately $t$-distributed, with the **Welch–Satterthwaite** degrees of freedom. Writing $a = \\frac{s_1^{2}}{n_1}$ and $b = \\frac{s_2^{2}}{n_2}$,\n\n$$\\nu = \\frac{(a + b)^{2}}{\\frac{a^{2}}{n_1 - 1} + \\frac{b^{2}}{n_2 - 1}}.$$\n\nThe result is usually not a whole number; tables are entered with $\\nu$ rounded **down**, which errs on the side of a wider interval. It always lies between $\\min(n_1, n_2) - 1$ and $n_1 + n_2 - 2$.\n\nWith $n_1 = 9$, $a = 2$, $n_2 = 11$, $b = 2$: $\\nu = \\frac{16}{\\frac{4}{8} + \\frac{4}{10}} = \\frac{16}{0.9} \\approx 17.78$, which is entered as $17$.\n\nCheck: $8 \\le 17.78 \\le 18$, inside the bounds $\\min(9, 11) - 1$ and $9 + 11 - 2$.\n\n> **Watch out.** Round down, not to the nearest: $18$ would claim more degrees of freedom than the data support and give a slightly too narrow interval.",
          "方差不相等时，统计量只近似服从 $t$ 分布，自由度由 **韦尔奇–萨特思韦特** 公式给出。记 $a = \\frac{s_1^{2}}{n_1}$，$b = \\frac{s_2^{2}}{n_2}$，\n\n$$\\nu = \\frac{(a + b)^{2}}{\\frac{a^{2}}{n_1 - 1} + \\frac{b^{2}}{n_2 - 1}}.$$\n\n结果通常不是整数；查表时把 $\\nu$ **向下**取整，使区间偏宽、更稳妥。它总介于 $\\min(n_1, n_2) - 1$ 与 $n_1 + n_2 - 2$ 之间。\n\n若 $n_1 = 9$，$a = 2$，$n_2 = 11$，$b = 2$：$\\nu = \\frac{16}{\\frac{4}{8} + \\frac{4}{10}} = \\frac{16}{0.9} \\approx 17.78$，查表时用 $17$。\n\n检验：$8 \\le 17.78 \\le 18$，在界限 $\\min(9, 11) - 1$ 与 $9 + 11 - 2$ 之内。\n\n> **注意。** 要向下取整，而不是四舍五入：$18$ 会声称比数据所能支持的更多的自由度，使区间略窄。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(6, 16);
          let n2 = rng.int(6, 16);
          if (n2 === n1) n2 += 4;
          const a = Q.of(rng.int(1, 9));
          let b = Q.of(rng.int(1, 9));
          if (b.eq(a)) b = b.add(Q.of(3));
          const nu = a
            .add(b)
            .pow(2)
            .div(
              a
                .pow(2)
                .div(Q.of(n1 - 1))
                .add(b.pow(2).div(Q.of(n2 - 1))),
            );
          const fl = Math.floor(nu.toNumber());
          return numberProblem({
            prompt: t(
              `For two independent samples, $n_1 = ${n1}$ with $\\frac{s_1^{2}}{n_1} = ${a.toString()}$, and $n_2 = ${n2}$ with $\\frac{s_2^{2}}{n_2} = ${b.toString()}$. Compute the Welch–Satterthwaite degrees of freedom and round down to a whole number.`,
              `两个独立样本满足 $n_1 = ${n1}$，$\\frac{s_1^{2}}{n_1} = ${a.toString()}$；$n_2 = ${n2}$，$\\frac{s_2^{2}}{n_2} = ${b.toString()}$。计算韦尔奇–萨特思韦特自由度，并向下取整。`,
            ),
            answer: fl,
            mistakes: apart(fl, [
              why(
                n1 + n2 - 2,
                "This is the pooled count $n_1 + n_2 - 2$, which assumes equal variances.",
                "这是合并方法的自由度 $n_1 + n_2 - 2$，它假定方差相等。",
              ),
              why(
                Math.min(n1, n2) - 1,
                "This is the conservative bound $\\min(n_1, n_2) - 1$, not the Welch–Satterthwaite value.",
                "这是保守下界 $\\min(n_1, n_2) - 1$，不是韦尔奇–萨特思韦特值。",
              ),
              ...(nu.eq(Q.of(fl))
                ? []
                : [why(fl + 1, "This rounds up; the degrees of freedom are rounded down.", "这是向上取整；自由度应向下取整。")]),
            ]),
            solution: walked(
              [
                [
                  ["Square the total", "总和平方"],
                  t(
                    `$(${a.toString()} + ${b.toString()})^{2} = ${a.add(b).pow(2).toLatex()}$.`,
                    `$(${a.toString()} + ${b.toString()})^{2} = ${a.add(b).pow(2).toLatex()}$。`,
                  ),
                ],
                [
                  ["Find the denominator", "求分母"],
                  t(
                    `$\\frac{${a.toString()}^{2}}{${n1 - 1}} + \\frac{${b.toString()}^{2}}{${n2 - 1}} = ${a
                      .pow(2)
                      .div(Q.of(n1 - 1))
                      .add(b.pow(2).div(Q.of(n2 - 1)))
                      .toLatex()}$.`,
                    `$\\frac{${a.toString()}^{2}}{${n1 - 1}} + \\frac{${b.toString()}^{2}}{${n2 - 1}} = ${a
                      .pow(2)
                      .div(Q.of(n1 - 1))
                      .add(b.pow(2).div(Q.of(n2 - 1)))
                      .toLatex()}$。`,
                  ),
                ],
                [
                  ["Divide and round down", "相除并向下取整"],
                  t(
                    `$\\nu = ${nu.toLatex()} \\approx ${nu.toNumber().toFixed(2)}$, which rounds down to $${fl}$.`,
                    `$\\nu = ${nu.toLatex()} \\approx ${nu.toNumber().toFixed(2)}$，向下取整得 $${fl}$。`,
                  ),
                ],
              ],
              t(
                `$${fl}$ lies between $\\min(${n1}, ${n2}) - 1 = ${Math.min(n1, n2) - 1}$ and $${n1} + ${n2} - 2 = ${n1 + n2 - 2}$.`,
                `$${fl}$ 介于 $\\min(${n1}, ${n2}) - 1 = ${Math.min(n1, n2) - 1}$ 与 $${n1} + ${n2} - 2 = ${n1 + n2 - 2}$ 之间。`,
              ),
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
      "When the population variance of differences $\\sigma_d^2$ is known, a $100(1 - \\alpha)\\%$ confidence interval for the mean difference $\\mu_d$ is $\\bar{d} \\pm z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}}$.",
      "当差值总体方差 $\\sigma_d^2$ 已知时，平均差值 $\\mu_d$ 的 $100(1 - \\alpha)\\%$ 置信区间为 $\\bar{d} \\pm z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}}$。",
    ),
    intro: t(
      "Sixteen runners are timed before and after a training plan, and for each runner the difference $d = \\text{before} - \\text{after}$ is recorded. The differences average $\\bar{d} = 5$ seconds, and from long experience their standard deviation is $\\sigma_d = 8$. The two columns of times are now one sample of $16$ differences, so the standard error is $\\frac{8}{\\sqrt{16}} = 2$ and the $95\\%$ interval for the mean improvement is $5 \\pm 1.96 \\cdot 2 = 5 \\pm 3.92$, from $1.08$ to $8.92$.\n\nCheck: the interval lies wholly above $0$, so the plan appears to shorten times; its centre is $\\frac{1.08 + 8.92}{2} = 5 = \\bar{d}$.\n\nIn this lesson we compute the margin of error $z_{\\alpha/2}\\frac{\\sigma_d}{\\sqrt{n}}$ for paired data and the endpoints of the interval for the mean difference.",
      "对 $16$ 名跑者在训练计划前后各计时一次，记录每人的差值 $d = \\text{前} - \\text{后}$。差值的均值为 $\\bar{d} = 5$ 秒，根据长期经验其标准差为 $\\sigma_d = 8$。两列时间现在成为一个含 $16$ 个差值的样本，所以标准误为 $\\frac{8}{\\sqrt{16}} = 2$，平均改进量的 $95\\%$ 区间为 $5 \\pm 1.96 \\cdot 2 = 5 \\pm 3.92$，即从 $1.08$ 到 $8.92$。\n\n检验：区间全部在 $0$ 之上，所以计划看来缩短了时间；区间中心为 $\\frac{1.08 + 8.92}{2} = 5 = \\bar{d}$。\n\n本课我们计算配对数据的误差范围 $z_{\\alpha/2}\\frac{\\sigma_d}{\\sqrt{n}}$，以及均值差区间的端点。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "paired-known-variance-margin-of-error",
        title: t("Computing the margin of error for paired samples with known variance", "计算已知方差下配对样本的误差范围"),
        explanation: t(
          "Pairing turns the two samples into a single sample of differences, so the margin of error uses the standard deviation of those differences. The margin of error is $E = z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}}$.\n\nWith $n = 25$ pairs, $\\sigma_d = 15$ and $z_{\\alpha/2} = 2$: $E = 2 \\cdot \\frac{15}{5} = 6$.\n\nCheck: $\\frac{6}{2} = 3$ is the standard error, and $3 \\cdot \\sqrt{25} = 15$ gives back $\\sigma_d$.\n\n> **Watch out.** $n$ counts pairs, and the root is taken: $\\frac{2 \\cdot 15}{25} = 1.2$ divides by $n$ instead of $\\sqrt{n}$.",
          "配对把两个样本变成一个差值样本，所以误差范围使用这些差值的标准差。误差范围为 $E = z_{\\alpha/2} \\frac{\\sigma_d}{\\sqrt{n}}$。\n\n若有 $n = 25$ 对，$\\sigma_d = 15$，$z_{\\alpha/2} = 2$：$E = 2 \\cdot \\frac{15}{5} = 6$。\n\n检验：$\\frac{6}{2} = 3$ 是标准误，$3 \\cdot \\sqrt{25} = 15$ 还原了 $\\sigma_d$。\n\n> **注意。** $n$ 是配对数，并且要开平方：$\\frac{2 \\cdot 15}{25} = 1.2$ 除以的是 $n$ 而不是 $\\sqrt{n}$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 8);
          const n = k * k;
          const z = rng.pick([2, 3]);
          const sigmaD = k * rng.int(2, 10);
          const margin = z * (sigmaD / k);

          return numberProblem({
            prompt: t(
              `A paired sample of size $n = ${n}$ is drawn where the difference population has known standard deviation $\\sigma_d = ${sigmaD}$. For critical value $z_{\\alpha/2} = ${z}$, calculate the margin of error $E$.`,
              `抽取容量为 $n = ${n}$ 的配对样本，已知差值总体的标准差为 $\\sigma_d = ${sigmaD}$。取临界值 $z_{\\alpha/2} = ${z}$，计算误差范围 $E$。`,
            ),
            answer: margin,
            mistakes: apart(margin, [
              why(
                Q.of(z * sigmaD, n),
                `This divides by $n = ${n}$ instead of $\\sqrt{n} = ${k}$.`,
                `这除以了 $n = ${n}$，而不是 $\\sqrt{n} = ${k}$。`,
              ),
              why(z * sigmaD, "This leaves out the division by $\\sqrt{n}$.", "这漏掉了除以 $\\sqrt{n}$。"),
              why(
                Q.of(sigmaD, k),
                `This is the standard error alone, not yet multiplied by $z_{\\alpha/2} = ${z}$.`,
                `这只是标准误，还没有乘以 $z_{\\alpha/2} = ${z}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the standard error of the mean difference", "求平均差的标准误"],
                  t(
                    `$\\frac{\\sigma_d}{\\sqrt{n}} = \\frac{${sigmaD}}{\\sqrt{${n}}} = \\frac{${sigmaD}}{${k}} = ${sigmaD / k}$.`,
                    `$\\frac{\\sigma_d}{\\sqrt{n}} = \\frac{${sigmaD}}{\\sqrt{${n}}} = \\frac{${sigmaD}}{${k}} = ${sigmaD / k}$。`,
                  ),
                ],
                [
                  ["Multiply by the critical value", "乘以临界值"],
                  t(`$E = ${z} \\cdot ${sigmaD / k} = ${margin}$.`, `$E = ${z} \\cdot ${sigmaD / k} = ${margin}$。`),
                ],
              ],
              t(
                `$\\frac{${margin}}{${z}} = ${sigmaD / k}$, and $${sigmaD / k} \\cdot ${k} = ${sigmaD}$ gives back $\\sigma_d$.`,
                `$\\frac{${margin}}{${z}} = ${sigmaD / k}$，且 $${sigmaD / k} \\cdot ${k} = ${sigmaD}$ 还原了 $\\sigma_d$。`,
              ),
            ),
          });
        },
      },
      {
        id: "endpoints-of-a-paired-interval",
        title: t("Endpoints of a paired interval", "配对区间的端点"),
        explanation: t(
          "Pairing turns two samples into one sample of differences $d_i = x_i - y_i$. With the standard deviation $\\sigma_d$ of the differences known, the interval for the mean difference is\n\n$$\\bar{d} \\pm z_{\\alpha/2}\\frac{\\sigma_d}{\\sqrt{n}},$$\n\nwhere $n$ is the number of **pairs**. Pairing helps because $\\sigma_d$ removes the variation between subjects and is often far smaller than either population's standard deviation.\n\nFor $25$ pairs with $\\bar{d} = 3$ and $\\sigma_d = 10$ at $95\\%$: the standard error is $\\frac{10}{5} = 2$, the margin is $1.96 \\cdot 2 = 3.92$, and the interval is $(-0.92, 6.92)$.\n\nCheck: the interval contains $0$, so these data cannot rule out no change; its width $7.84$ is twice the margin.\n\n> **Watch out.** Use $\\sigma_d$ divided by $\\sqrt{n}$: $3 + 1.96 \\cdot 10 = 22.6$ uses the spread of single differences, not of their mean.",
          "配对把两个样本变成一个差值样本 $d_i = x_i - y_i$。若差值的标准差 $\\sigma_d$ 已知，均值差的区间为\n\n$$\\bar{d} \\pm z_{\\alpha/2}\\frac{\\sigma_d}{\\sqrt{n}},$$\n\n其中 $n$ 是**配对数**。配对之所以有效，是因为 $\\sigma_d$ 去掉了个体之间的差异，往往远小于任一总体的标准差。\n\n若有 $25$ 对，$\\bar{d} = 3$，$\\sigma_d = 10$，置信水平 $95\\%$：标准误为 $\\frac{10}{5} = 2$，误差界为 $1.96 \\cdot 2 = 3.92$，区间为 $(-0.92, 6.92)$。\n\n检验：区间包含 $0$，所以这些数据不能排除没有变化；宽度 $7.84$ 是误差界的两倍。\n\n> **注意。** 要用 $\\sigma_d$ 除以 $\\sqrt{n}$：$3 + 1.96 \\cdot 10 = 22.6$ 用的是单个差值的离散程度，而不是它们均值的离散程度。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const k = rng.int(3, 9);
          const se = Q.of(rng.int(1, 8), 2);
          const sd = se.mul(Q.of(k));
          const dbar = Q.of(rng.int(-30, 90), 10);
          const margin = z.mul(se);
          const upper = rng.bool();
          const ans = upper ? dbar.add(margin) : dbar.sub(margin);
          return numberProblem({
            prompt: t(
              `For $${k * k}$ subjects measured before and after a treatment, the mean of the differences (before minus after) is $\\bar{d} = ${dec(dbar)}$, and the differences have known standard deviation $\\sigma_d = ${dec(sd)}$. Find the ${upper ? "upper" : "lower"} endpoint of the $${pct}\\%$ confidence interval for the mean difference (use $z = ${dec(z)}$).`,
              `对 $${k * k}$ 名受试者在处理前后各测一次，差值（处理前减处理后）的均值为 $\\bar{d} = ${dec(dbar)}$，差值的标准差已知为 $\\sigma_d = ${dec(sd)}$。求均值差的 $${pct}\\%$ 置信区间的${upper ? "上" : "下"}端点（取 $z = ${dec(z)}$）。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: apart(
              ans,
              [
                why(
                  upper ? dbar.sub(margin) : dbar.add(margin),
                  `This is the ${upper ? "lower" : "upper"} endpoint; the ${upper ? "upper" : "lower"} one ${upper ? "adds" : "subtracts"} the margin.`,
                  `这是${upper ? "下" : "上"}端点；${upper ? "上" : "下"}端点要${upper ? "加上" : "减去"}误差界。`,
                ),
                why(
                  upper ? dbar.add(z.mul(sd)) : dbar.sub(z.mul(sd)),
                  `This uses $\\sigma_d = ${dec(sd)}$ in place of the standard error $\\frac{\\sigma_d}{\\sqrt{n}} = ${dec(se)}$.`,
                  `这用 $\\sigma_d = ${dec(sd)}$ 代替了标准误 $\\frac{\\sigma_d}{\\sqrt{n}} = ${dec(se)}$。`,
                ),
                why(
                  upper ? dbar.add(z.mul(sd).div(Q.of(k * k))) : dbar.sub(z.mul(sd).div(Q.of(k * k))),
                  `This divides $\\sigma_d$ by the number of pairs $${k * k}$ instead of its square root $${k}$.`,
                  `这把 $\\sigma_d$ 除以配对数 $${k * k}$，而不是它的平方根 $${k}$。`,
                ),
              ].filter((m) => isTerminating(m.value)),
            ),
            solution: walked(
              [
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `$\\frac{${dec(sd)}}{\\sqrt{${k * k}}} = \\frac{${dec(sd)}}{${k}} = ${dec(se)}$.`,
                    `$\\frac{${dec(sd)}}{\\sqrt{${k * k}}} = \\frac{${dec(sd)}}{${k}} = ${dec(se)}$。`,
                  ),
                ],
                [
                  ["Find the margin", "求误差界"],
                  t(`$${dec(z)} \\cdot ${dec(se)} = ${dec(margin)}$.`, `$${dec(z)} \\cdot ${dec(se)} = ${dec(margin)}$。`),
                ],
                [
                  [
                    upper ? "Add it to the mean difference" : "Subtract it from the mean difference",
                    upper ? "加到平均差上" : "从平均差中减去",
                  ],
                  t(
                    `$${par(dbar)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$.`,
                    `$${par(dbar)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `The endpoint $${dec(ans)}$ is $${dec(margin)}$ from $\\bar{d} = ${dec(dbar)}$, that is $${dec(z)}$ standard errors of $${dec(se)}$.`,
                `端点 $${dec(ans)}$ 与 $\\bar{d} = ${dec(dbar)}$ 相距 $${dec(margin)}$，即 $${dec(z)}$ 个标准误 $${dec(se)}$。`,
              ),
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
      "For paired observations $(x_{1i}, x_{2i})$ with unknown variance, analyzing the differences $d_i = x_{1i} - x_{2i}$ gives the confidence interval $\\bar{d} \\pm t_{\\alpha/2, n-1} \\frac{s_d}{\\sqrt{n}}$.",
      "对于方差未知的配对观测值 $(x_{1i}, x_{2i})$，分析差值 $d_i = x_{1i} - x_{2i}$ 给出置信区间 $\\bar{d} \\pm t_{\\alpha/2, n-1} \\frac{s_d}{\\sqrt{n}}$。",
    ),
    intro: t(
      "Four patients have their blood pressure measured before and after a drug: $(150, 144)$, $(138, 136)$, $(160, 151)$ and $(142, 141)$. Subtracting within each pair gives the differences $6, 2, 9, 1$, with mean $\\bar{d} = \\frac{18}{4} = 4.5$. Their deviations from $4.5$ are $1.5, -2.5, 4.5, -3.5$, whose squares sum to $2.25 + 6.25 + 20.25 + 12.25 = 41$, so $s_d^{2} = \\frac{41}{3} \\approx 13.67$. With $\\sigma_d$ unknown, the interval is $\\bar{d} \\pm t_{\\alpha/2, 3}\\frac{s_d}{\\sqrt{4}}$.\n\nCheck: the deviations $1.5 - 2.5 + 4.5 - 3.5 = 0$ sum to zero, as deviations from a mean must.\n\nIn this lesson we compute the mean $\\bar{d}$ and the variance $s_d^{2}$ of paired differences, the two numbers a paired $t$ interval is built from.",
      "四名病人在服药前后各测一次血压：$(150, 144)$，$(138, 136)$，$(160, 151)$，$(142, 141)$。每对内部相减得差值 $6, 2, 9, 1$，均值 $\\bar{d} = \\frac{18}{4} = 4.5$。它们到 $4.5$ 的离差为 $1.5, -2.5, 4.5, -3.5$，平方和为 $2.25 + 6.25 + 20.25 + 12.25 = 41$，所以 $s_d^{2} = \\frac{41}{3} \\approx 13.67$。$\\sigma_d$ 未知时，区间为 $\\bar{d} \\pm t_{\\alpha/2, 3}\\frac{s_d}{\\sqrt{4}}$。\n\n检验：离差之和 $1.5 - 2.5 + 4.5 - 3.5 = 0$，到均值的离差之和必然为零。\n\n本课我们计算配对差值的均值 $\\bar{d}$ 和方差 $s_d^{2}$，配对 $t$ 区间正是由这两个数构成的。",
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
        title: t("Computing the mean difference $\\bar{d}$ from paired observations", "根据配对观测值计算平均差值 $\\bar{d}$"),
        explanation: t(
          "Subtract within each pair first, then average the differences; this removes the variation between subjects. The mean difference is $\\bar{d} = \\frac{1}{n} \\sum_i (x_{1,i} - x_{2,i})$.\n\nFor the differences $4, -2, 7, 3, 3$: the sum is $15$ and $n = 5$, so $\\bar{d} = 3$.\n\nCheck: $5 \\cdot 3 = 15$ gives back the total, and $3$ lies between the smallest difference $-2$ and the largest $7$.\n\n> **Watch out.** Keep the signs: a negative difference means the second measurement was larger, and dropping its sign gives $\\frac{19}{5} = 3.8$. Divide by $n$, not $n - 1$.",
          "先在每一对内部相减，再对差值求平均；这样就消除了个体之间的差异。差值的均值为 $\\bar{d} = \\frac{1}{n} \\sum_i (x_{1,i} - x_{2,i})$。\n\n对差值 $4, -2, 7, 3, 3$：总和为 $15$，$n = 5$，所以 $\\bar{d} = 3$。\n\n检验：$5 \\cdot 3 = 15$ 还原了总和，且 $3$ 介于最小差值 $-2$ 与最大差值 $7$ 之间。\n\n> **注意。** 要保留符号：负的差值表示第二次测量更大，去掉符号会得到 $\\frac{19}{5} = 3.8$。要除以 $n$，不是 $n - 1$。",
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
              `In a paired-sample study with $n = ${n}$ subject pairs, the individual differences $d_i = x_{1,i} - x_{2,i}$ are: $${diffStr}$. Calculate the sample mean difference $\\bar{d}$.`,
              `在包含 $n = ${n}$ 对受试对象的配对样本研究中，各对差值 $d_i = x_{1,i} - x_{2,i}$ 分别为：$${diffStr}$。计算样本平均差值 $\\bar{d}$。`,
            ),
            answer: Q.of(sumD, n),
            wrong: [Q.of(sumD, n + 1)],
            mistakes: apart(Q.of(sumD, n), [
              why(
                Q.of(sumD, n - 1),
                `This divides by $n - 1 = ${n - 1}$; the mean divides by $n = ${n}$.`,
                `这除以了 $n - 1 = ${n - 1}$；均值要除以 $n = ${n}$。`,
              ),
              why(
                sumD,
                `This is the total $\\sum d_i = ${sumD}$, not yet divided by $n$.`,
                `这是总和 $\\sum d_i = ${sumD}$，还没有除以 $n$。`,
              ),
              why(
                Q.of(
                  diffs.reduce((s, d) => s + Math.abs(d), 0),
                  n,
                ),
                "This drops the minus signs of the negative differences.",
                "这去掉了负差值的负号。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Add the differences", "把差值相加"],
                  t(
                    `$\\sum d_i = ${diffs.map((d) => (d < 0 ? `(${d})` : `${d}`)).join(" + ")} = ${sumD}$.`,
                    `$\\sum d_i = ${diffs.map((d) => (d < 0 ? `(${d})` : `${d}`)).join(" + ")} = ${sumD}$。`,
                  ),
                ],
                [
                  ["Divide by the number of pairs", "除以配对数"],
                  t(
                    `$\\bar{d} = \\frac{${sumD}}{${n}}${lowestTerms(sumD, n)}$.`,
                    `$\\bar{d} = \\frac{${sumD}}{${n}}${lowestTerms(sumD, n)}$。`,
                  ),
                ],
              ],
              t(
                `$${n} \\cdot ${sumD < 0 ? `\\left(${Q.of(sumD, n).toLatex()}\\right)` : Q.of(sumD, n).toLatex()} = ${sumD}$ gives back the total.`,
                `$${n} \\cdot ${sumD < 0 ? `\\left(${Q.of(sumD, n).toLatex()}\\right)` : Q.of(sumD, n).toLatex()} = ${sumD}$ 还原了总和。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-variance-of-the-differences",
        title: t("The variance of the differences", "差值的方差"),
        explanation: t(
          "With $\\sigma_d$ unknown, estimate it from the differences themselves. Subtract within each pair, find the mean $\\bar{d}$, then\n\n$$s_d^{2} = \\frac{\\sum (d_i - \\bar{d})^{2}}{n - 1}.$$\n\nWork with the differences, not with the two columns separately: $s_d^{2}$ is not $s_x^{2} + s_y^{2}$, because the paired values are correlated. The interval is then $\\bar{d} \\pm t_{\\alpha/2, n-1}\\frac{s_d}{\\sqrt{n}}$.\n\nFor the differences $3, 5, 4, 8$: $\\bar{d} = 5$, the deviations are $-2, 0, -1, 3$, their squares sum to $14$, and $s_d^{2} = \\frac{14}{3}$.\n\nCheck: the deviations $-2 + 0 - 1 + 3 = 0$ sum to zero.\n\n> **Watch out.** Divide by $n - 1 = 3$, not by $n = 4$: $\\frac{14}{4} = 3.5$ underestimates the variance, because the deviations are measured from $\\bar{d}$, which was fitted to these same data.",
          "当 $\\sigma_d$ 未知时，用差值本身来估计。先在每对内相减，求出均值 $\\bar{d}$，再算\n\n$$s_d^{2} = \\frac{\\sum (d_i - \\bar{d})^{2}}{n - 1}.$$\n\n要用差值计算，而不是分别处理两列：由于配对数据相关，$s_d^{2}$ 并不等于 $s_x^{2} + s_y^{2}$。区间为 $\\bar{d} \\pm t_{\\alpha/2, n-1}\\frac{s_d}{\\sqrt{n}}$。\n\n对差值 $3, 5, 4, 8$：$\\bar{d} = 5$，离差为 $-2, 0, -1, 3$，平方和为 $14$，$s_d^{2} = \\frac{14}{3}$。\n\n检验：离差之和 $-2 + 0 - 1 + 3 = 0$。\n\n> **注意。** 要除以 $n - 1 = 3$ 而不是 $n = 4$：$\\frac{14}{4} = 3.5$ 低估了方差，因为离差是相对于由同一组数据拟合出的 $\\bar{d}$ 计算的。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.pick([4, 5]);
          const dbar = rng.int(-3, 6);
          const devs = rng.pick(
            n === 4
              ? [
                  [-2, -1, 1, 2],
                  [-3, 0, 1, 2],
                  [-4, 1, 1, 2],
                  [-3, -1, 1, 3],
                ]
              : [
                  [-2, -1, 0, 1, 2],
                  [-3, -1, 0, 2, 2],
                  [-4, 0, 1, 1, 2],
                  [-2, -2, 0, 1, 3],
                ],
          );
          const order = rng.shuffle([...devs]);
          const ds = order.map((e) => dbar + e);
          const after = ds.map(() => rng.int(20, 60));
          const before = after.map((y, i) => y + (ds[i] ?? 0));
          const ss = devs.reduce((s, e) => s + e * e, 0);
          const ans = Q.of(ss, n - 1);
          return numberProblem({
            prompt: t(
              `Paired measurements (before, after) are ${before.map((x, i) => `$(${x}, ${after[i]})$`).join(", ")}. Using the differences before minus after, find the sample variance $s_d^{2}$ of the differences.`,
              `配对测量值（处理前，处理后）为 ${before.map((x, i) => `$(${x}, ${after[i]})$`).join("，")}。用差值“处理前减处理后”，求差值的样本方差 $s_d^{2}$。`,
            ),
            answer: ans,
            wrong: [Q.of(ss, n - 1).add(Q.of(dbar * dbar))],
            mistakes: apart(ans, [
              why(
                Q.of(ss, n),
                `This divides by $n = ${n}$ instead of $n - 1 = ${n - 1}$.`,
                `这除以了 $n = ${n}$，而不是 $n - 1 = ${n - 1}$。`,
              ),
              why(
                Q.of(ss),
                `This is the sum of squared deviations $${ss}$, not yet divided by $n - 1$.`,
                `这是离差平方和 $${ss}$，还没有除以 $n - 1$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Subtract within each pair", "每对内部相减"],
                  t(`The differences are $${ds.join(", ")}$.`, `差值为 $${ds.join(", ")}$。`),
                ],
                [
                  ["Find the mean difference", "求平均差"],
                  t(`$\\bar{d} = \\frac{${n * dbar}}{${n}} = ${dbar}$.`, `$\\bar{d} = \\frac{${n * dbar}}{${n}} = ${dbar}$。`),
                ],
                [
                  ["Square the deviations and divide", "离差平方后相除"],
                  t(
                    `The deviations $${order.join(", ")}$ have squares summing to $${ss}$, so $s_d^{2} = \\frac{${ss}}{${n - 1}}${lowestTerms(ss, n - 1)}$.`,
                    `离差 $${order.join(", ")}$ 的平方和为 $${ss}$，所以 $s_d^{2} = \\frac{${ss}}{${n - 1}}${lowestTerms(ss, n - 1)}$。`,
                  ),
                ],
              ],
              t(
                `The deviations $${order.join(", ")}$ sum to $0$, as deviations from $\\bar{d}$ must.`,
                `离差 $${order.join(", ")}$ 之和为 $0$，到 $\\bar{d}$ 的离差必然如此。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.26.4 Confidence Intervals for Two Proportions
  {
    id: "confidence-intervals-for-differences-between-two-proportions",
    title: t("Confidence Intervals for Two Proportions", "两个比例之差的置信区间"),
    summary: t(
      "A large-sample confidence interval for $p_1 - p_2$ is $(\\hat{p}_1 - \\hat{p}_2) \\pm z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}}$.",
      "两个总体比例之差 $p_1 - p_2$ 的大样本置信区间为 $(\\hat{p}_1 - \\hat{p}_2) \\pm z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}}$。",
    ),
    intro: t(
      "In town A, $120$ of $200$ adults cycle to work, $\\hat{p}_1 = 0.6$; in town B, $90$ of $300$ do, $\\hat{p}_2 = 0.3$. Each proportion carries its own estimated variance, $\\frac{0.6 \\cdot 0.4}{200} = 0.0012$ and $\\frac{0.3 \\cdot 0.7}{300} = 0.0007$, and for independent samples they add: $0.0019$. The standard error of $\\hat{p}_1 - \\hat{p}_2$ is $\\sqrt{0.0019} \\approx 0.0436$, so the $95\\%$ interval for $p_1 - p_2$ is $0.3 \\pm 1.96 \\cdot 0.0436 \\approx 0.3 \\pm 0.085$, from about $0.215$ to $0.385$.\n\nCheck: the whole interval is above $0$, so cycling appears more common in town A.\n\nIn this lesson we compute the estimated variance of a difference of two proportions and the endpoints of the interval for $p_1 - p_2$.",
      "A 镇 $200$ 名成年人中有 $120$ 人骑车上班，$\\hat{p}_1 = 0.6$；B 镇 $300$ 人中有 $90$ 人，$\\hat{p}_2 = 0.3$。每个比例各有估计方差 $\\frac{0.6 \\cdot 0.4}{200} = 0.0012$ 与 $\\frac{0.3 \\cdot 0.7}{300} = 0.0007$，独立样本时两者相加：$0.0019$。$\\hat{p}_1 - \\hat{p}_2$ 的标准误为 $\\sqrt{0.0019} \\approx 0.0436$，所以 $p_1 - p_2$ 的 $95\\%$ 区间为 $0.3 \\pm 1.96 \\cdot 0.0436 \\approx 0.3 \\pm 0.085$，约从 $0.215$ 到 $0.385$。\n\n检验：整个区间都在 $0$ 之上，所以 A 镇骑车上班看来更普遍。\n\n本课我们计算两个比例之差的估计方差，以及 $p_1 - p_2$ 区间的端点。",
    ),
    prerequisites: ["confidence-intervals-for-one-proportion"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "two-proportion-variance-evaluation",
        title: t("Evaluating the estimated variance of difference between two proportions", "计算两个比例之差的估计方差"),
        explanation: t(
          "The two sample proportions are independent, so the variance of their difference is the sum of their estimated variances. $\\operatorname{Var}(\\hat{p}_1 - \\hat{p}_2) = \\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}$.\n\nWith $\\hat{p}_1 = \\frac{1}{2}$, $n_1 = 50$, $\\hat{p}_2 = \\frac{1}{5}$ and $n_2 = 80$: $\\frac{0.25}{50} + \\frac{0.16}{80} = 0.005 + 0.002 = 0.007$.\n\nCheck: $0.007$ is larger than either term, as a sum of two positive variances must be.\n\n> **Watch out.** The variances add even though the proportions are subtracted: $0.005 - 0.002 = 0.003$ is not a variance of the difference.",
          "两个样本比例相互独立，所以它们之差的方差是各自估计方差之和。$\\operatorname{Var}(\\hat{p}_1 - \\hat{p}_2) = \\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}$。\n\n若 $\\hat{p}_1 = \\frac{1}{2}$，$n_1 = 50$，$\\hat{p}_2 = \\frac{1}{5}$，$n_2 = 80$：$\\frac{0.25}{50} + \\frac{0.16}{80} = 0.005 + 0.002 = 0.007$。\n\n检验：$0.007$ 比任一项都大，两个正方差之和理应如此。\n\n> **注意。** 虽然比例相减，方差却要相加：$0.005 - 0.002 = 0.003$ 不是差的方差。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = 10 * rng.int(5, 20);
          const n2 = 10 * rng.int(5, 20);
          const [p1, p2] = [rng.pick(SIMPLE_PROPORTIONS), rng.pick(SIMPLE_PROPORTIONS)];
          const v1 = p1.mul(Q.of(1).sub(p1));
          const v2 = p2.mul(Q.of(1).sub(p2));
          const answer = v1.div(Q.of(n1)).add(v2.div(Q.of(n2)));

          return numberProblem({
            prompt: t(
              `Two independent samples of sizes $n_1 = ${n1}$ and $n_2 = ${n2}$ have sample proportions $\\hat{p}_1 = ${p1.toLatex()}$ and $\\hat{p}_2 = ${p2.toLatex()}$. Find the estimated variance of their difference.`,
              `容量分别为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$ 的两个独立样本，样本比例分别为 $\\hat{p}_1 = ${p1.toLatex()}$ 与 $\\hat{p}_2 = ${p2.toLatex()}$。求两者之差的估计方差。`,
            ),
            answer,
            mistakes: apart(answer, [
              why(
                v1.div(Q.of(n1)).sub(v2.div(Q.of(n2))),
                "This subtracts the two terms; the variances of independent proportions add.",
                "这把两项相减了；独立比例的方差要相加。",
              ),
              why(
                v1.add(v2),
                "This adds $\\hat{p}(1 - \\hat{p})$ for each sample without dividing by its sample size.",
                "这把每个样本的 $\\hat{p}(1 - \\hat{p})$ 相加，却没有除以各自的样本容量。",
              ),
              why(
                v1.div(Q.of(n1)),
                "This is the first sample's term only; the second sample adds its own.",
                "这只是第一个样本的项；第二个样本还要加上它自己的项。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find each sample's term", "求每个样本的项"],
                  t(
                    `$\\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} = \\frac{${v1.toLatex()}}{${n1}} = ${v1.div(Q.of(n1)).toLatex()}$ and $\\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2} = \\frac{${v2.toLatex()}}{${n2}} = ${v2.div(Q.of(n2)).toLatex()}$.`,
                    `$\\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} = \\frac{${v1.toLatex()}}{${n1}} = ${v1.div(Q.of(n1)).toLatex()}$，$\\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2} = \\frac{${v2.toLatex()}}{${n2}} = ${v2.div(Q.of(n2)).toLatex()}$。`,
                  ),
                ],
                [
                  ["Add them", "相加"],
                  t(
                    `$${v1.div(Q.of(n1)).toLatex()} + ${v2.div(Q.of(n2)).toLatex()} = ${answer.toLatex()}$.`,
                    `$${v1.div(Q.of(n1)).toLatex()} + ${v2.div(Q.of(n2)).toLatex()} = ${answer.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$${answer.toLatex()}$ is larger than each term, and the variances add even though the proportions are subtracted.`,
                `$${answer.toLatex()}$ 比每一项都大；虽然比例相减，方差却相加。`,
              ),
            ),
          });
        },
      },
      {
        id: "endpoints-of-an-interval-for-a-difference-of-proportions",
        title: t("Endpoints of an interval for $p_1 - p_2$", "$p_1 - p_2$ 区间的端点"),
        explanation: t(
          "Each sample proportion estimates its own variance, and the variances add:\n\n$$(\\hat{p}_1 - \\hat{p}_2) \\pm z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}}.$$\n\nCompute the two proportions, the two variance terms, the standard error, and then the margin; keep several decimal places until the final step. An interval that excludes $0$ suggests the two proportions differ.\n\nWith $60$ of $100$ and $40$ of $100$: the difference is $0.2$, the variance terms are $0.0024$ each, the standard error is $\\sqrt{0.0048} \\approx 0.0693$, and the $95\\%$ interval is $0.2 \\pm 0.136$, from $0.064$ to $0.336$.\n\nCheck: the interval excludes $0$, and its midpoint $\\frac{0.064 + 0.336}{2} = 0.2$ is the observed difference.\n\n> **Watch out.** Add the variances before taking the root: $\\sqrt{0.0024} + \\sqrt{0.0024} \\approx 0.098$ is larger than the true standard error $0.0693$.",
          "每个样本比例各自估计自己的方差，方差相加：\n\n$$(\\hat{p}_1 - \\hat{p}_2) \\pm z_{\\alpha/2}\\sqrt{\\frac{\\hat{p}_1(1 - \\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1 - \\hat{p}_2)}{n_2}}.$$\n\n依次算出两个比例、两项方差、标准误和误差界；最后一步之前保留足够的小数位。若区间不含 $0$，说明两个比例可能不同。\n\n若 $100$ 人中 $60$ 人与 $100$ 人中 $40$ 人：差为 $0.2$，两项方差各为 $0.0024$，标准误为 $\\sqrt{0.0048} \\approx 0.0693$，$95\\%$ 区间为 $0.2 \\pm 0.136$，即从 $0.064$ 到 $0.336$。\n\n检验：区间不含 $0$，其中点 $\\frac{0.064 + 0.336}{2} = 0.2$ 正是观测差。\n\n> **注意。** 要先把方差相加再开平方：$\\sqrt{0.0024} + \\sqrt{0.0024} \\approx 0.098$ 比真正的标准误 $0.0693$ 大。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const n1 = rng.pick([100, 200, 250, 400, 500]);
          const n2 = rng.pick([100, 200, 250, 400, 500]);
          const x1 = rng.int(Math.floor(n1 * 0.2), Math.floor(n1 * 0.8));
          const x2 = rng.int(Math.floor(n2 * 0.2), Math.floor(n2 * 0.8));
          const p1 = x1 / n1;
          const p2 = x2 / n2;
          const v = (p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2;
          const se = Math.sqrt(v);
          const zn = z.toNumber();
          const upper = rng.bool();
          const r3 = (x: number): Q => Q.of(Math.round(x * 1000), 1000);
          const ans = r3(p1 - p2 + (upper ? 1 : -1) * zn * se);
          const sign = upper ? 1 : -1;
          return numberProblem({
            prompt: t(
              `In one group, $${x1}$ of $${n1}$ people respond; in an independent group, $${x2}$ of $${n2}$ respond. Find the ${upper ? "upper" : "lower"} endpoint of the $${pct}\\%$ confidence interval for $p_1 - p_2$ (use $z = ${dec(z)}$). Round to three decimal places.`,
              `第一组 $${n1}$ 人中有 $${x1}$ 人响应；另一独立组 $${n2}$ 人中有 $${x2}$ 人响应。求 $p_1 - p_2$ 的 $${pct}\\%$ 置信区间的${upper ? "上" : "下"}端点（取 $z = ${dec(z)}$），精确到三位小数。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: apart(ans, [
              why(
                r3(p1 - p2 - sign * zn * se),
                `This is the ${upper ? "lower" : "upper"} endpoint; the ${upper ? "upper" : "lower"} one ${upper ? "adds" : "subtracts"} the margin.`,
                `这是${upper ? "下" : "上"}端点；${upper ? "上" : "下"}端点要${upper ? "加上" : "减去"}误差界。`,
              ),
              why(
                r3(p1 - p2 + sign * zn * v),
                "This multiplies $z$ by the variance without taking its square root.",
                "这把 $z$ 乘以方差，没有开平方。",
              ),
              why(
                r3(p1 - p2 + sign * zn * (Math.sqrt((p1 * (1 - p1)) / n1) + Math.sqrt((p2 * (1 - p2)) / n2))),
                "This adds the two standard errors; the variances add, and the root is taken of their sum.",
                "这把两个标准误相加了；应把方差相加，再对和开平方。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the two proportions", "求两个比例"],
                  t(
                    `$\\hat{p}_1 = \\frac{${x1}}{${n1}} = ${dec(Q.of(x1, n1))}$ and $\\hat{p}_2 = \\frac{${x2}}{${n2}} = ${dec(Q.of(x2, n2))}$, so $\\hat{p}_1 - \\hat{p}_2 \\approx ${(p1 - p2).toFixed(4)}$.`,
                    `$\\hat{p}_1 = \\frac{${x1}}{${n1}} = ${dec(Q.of(x1, n1))}$，$\\hat{p}_2 = \\frac{${x2}}{${n2}} = ${dec(Q.of(x2, n2))}$，所以 $\\hat{p}_1 - \\hat{p}_2 \\approx ${(p1 - p2).toFixed(4)}$。`,
                  ),
                ],
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `The variance terms sum to $${v.toFixed(6)}$, so the standard error is $\\sqrt{${v.toFixed(6)}} \\approx ${se.toFixed(4)}$.`,
                    `两项方差之和为 $${v.toFixed(6)}$，标准误为 $\\sqrt{${v.toFixed(6)}} \\approx ${se.toFixed(4)}$。`,
                  ),
                ],
                [
                  ["Apply the margin", "加减误差界"],
                  t(
                    `The margin is $${dec(z)} \\cdot ${se.toFixed(4)} \\approx ${(zn * se).toFixed(4)}$, so the endpoint is $${(p1 - p2).toFixed(4)} ${upper ? "+" : "-"} ${(zn * se).toFixed(4)} \\approx ${dec(ans)}$.`,
                    `误差界为 $${dec(z)} \\cdot ${se.toFixed(4)} \\approx ${(zn * se).toFixed(4)}$，所以端点为 $${(p1 - p2).toFixed(4)} ${upper ? "+" : "-"} ${(zn * se).toFixed(4)} \\approx ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `$${dec(ans)}$ lies about $${(zn * se).toFixed(3)}$ from the observed difference $${(p1 - p2).toFixed(3)}$, which is $${dec(z)}$ standard errors.`,
                `$${dec(ans)}$ 与观测差 $${(p1 - p2).toFixed(3)}$ 相距约 $${(zn * se).toFixed(3)}$，即 $${dec(z)}$ 个标准误。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.27.1 Estimating Sample Sizes for Means
  {
    id: "sample-size-determination-for-estimating-means",
    title: t("Estimating Sample Sizes for Means", "估计均值所需的样本容量"),
    summary: t(
      "To estimate a population mean $\\mu$ within a margin of error $E$ at $100(1 - \\alpha)\\%$ confidence, the minimum sample size is $n = \\left\\lceil \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^2 \\right\\rceil$.",
      "为了在 $100(1 - \\alpha)\\%$ 置信水平下将总体均值 $\\mu$ 的估计误差控制在 $E$ 之内，所需的最小样本容量为 $n = \\left\\lceil \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^2 \\right\\rceil$。",
    ),
    intro: t(
      "A dietitian wants the mean daily calorie intake of a group to within $E = 50$ calories at $95\\%$ confidence, and past studies give $\\sigma = 300$. The margin with $n$ people is $1.96 \\cdot \\frac{300}{\\sqrt{n}}$, and setting it equal to $50$ gives $\\sqrt{n} = \\frac{1.96 \\cdot 300}{50} = 11.76$, so $n = 11.76^{2} = 138.2976$. A sample of $138$ would leave the margin just above $50$, so the dietitian needs $n = 139$.\n\nCheck: $1.96 \\cdot \\frac{300}{\\sqrt{139}} \\approx 1.96 \\cdot 25.45 \\approx 49.9$, just inside the target.\n\nIn this lesson we solve $E = z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}$ for the sample size $n = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^{2}$ and round it up.",
      "一位营养师希望在 $95\\%$ 置信水平下把某群体平均每日热量摄入估计到误差 $E = 50$ 卡以内，以往研究给出 $\\sigma = 300$。$n$ 人时误差范围为 $1.96 \\cdot \\frac{300}{\\sqrt{n}}$，令其等于 $50$ 得 $\\sqrt{n} = \\frac{1.96 \\cdot 300}{50} = 11.76$，所以 $n = 11.76^{2} = 138.2976$。$138$ 人会使误差范围略超过 $50$，所以需要 $n = 139$。\n\n检验：$1.96 \\cdot \\frac{300}{\\sqrt{139}} \\approx 1.96 \\cdot 25.45 \\approx 49.9$，刚好在目标以内。\n\n本课我们由 $E = z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}$ 解出样本量 $n = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^{2}$ 并向上取整。",
    ),
    prerequisites: ["confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-required-sample-size-mean",
        title: t("Calculating required sample size for mean estimation", "计算均值估计所需的样本容量"),
        explanation: t(
          "Solving the margin of error formula for the sample size shows how many observations are needed, and you round up so the target is met. $n = \\left(\\frac{z \\sigma}{E}\\right)^2$. Always round up to the next integer if the result is not exact.\n\nWith $z = 2$, $\\sigma = 15$ and $E = 3$: $\\frac{2 \\cdot 15}{3} = 10$, so $n = 10^{2} = 100$.\n\nCheck: with $100$ observations the margin is $2 \\cdot \\frac{15}{\\sqrt{100}} = 3$, exactly the target.\n\n> **Watch out.** Square the whole ratio: stopping at $10$ gives a margin of $2 \\cdot \\frac{15}{\\sqrt{10}} \\approx 9.5$, more than three times the target.",
          "从误差范围公式中解出样本量，就知道需要多少个观测值；要向上取整，以保证达到目标。$n = \\left(\\frac{z \\sigma}{E}\\right)^2$。若计算结果不是整数，总是向上取整。\n\n若 $z = 2$，$\\sigma = 15$，$E = 3$：$\\frac{2 \\cdot 15}{3} = 10$，所以 $n = 10^{2} = 100$。\n\n检验：$100$ 个观测时误差范围为 $2 \\cdot \\frac{15}{\\sqrt{100}} = 3$，正好是目标。\n\n> **注意。** 要把整个比值平方：停在 $10$ 会得到误差范围 $2 \\cdot \\frac{15}{\\sqrt{10}} \\approx 9.5$，超过目标三倍。",
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
              `To estimate a population mean with standard deviation $\\sigma = ${sigma}$ within a desired margin of error $E = ${E}$ using critical value $z_{\\alpha/2} = ${z}$, calculate the required sample size.`,
              `已知总体标准差 $\\sigma = ${sigma}$，取临界值 $z_{\\alpha/2} = ${z}$，若期望将总体均值的误差范围控制在 $E = ${E}$ 之内，计算所需的样本容量。`,
            ),
            answer: requiredN,
            mistakes: apart(requiredN, [
              why(
                base,
                `This is $\\frac{z\\sigma}{E} = ${base}$, which is $\\sqrt{n}$; it still has to be squared.`,
                `这是 $\\frac{z\\sigma}{E} = ${base}$，即 $\\sqrt{n}$；还要平方。`,
              ),
              why(
                z * mult * mult,
                `This squares $\\frac{\\sigma}{E} = ${mult}$ but not the critical value $z = ${z}$.`,
                `这把 $\\frac{\\sigma}{E} = ${mult}$ 平方了，却没有把临界值 $z = ${z}$ 平方。`,
              ),
              why(
                z * z * sigma * mult,
                `This squares $z\\sigma$ but divides by $E = ${E}$ instead of $E^{2} = ${E * E}$.`,
                `这把 $z\\sigma$ 平方了，却除以 $E = ${E}$ 而不是 $E^{2} = ${E * E}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the ratio", "求比值"],
                  t(
                    E === 1
                      ? `$\\frac{z\\sigma}{E} = ${z} \\cdot ${sigma} = ${base}$.`
                      : `$\\frac{z\\sigma}{E} = \\frac{${z} \\cdot ${sigma}}{${E}} = ${base}$.`,
                    E === 1
                      ? `$\\frac{z\\sigma}{E} = ${z} \\cdot ${sigma} = ${base}$。`
                      : `$\\frac{z\\sigma}{E} = \\frac{${z} \\cdot ${sigma}}{${E}} = ${base}$。`,
                  ),
                ],
                [["Square it", "平方"], t(`$n = ${base}^{2} = ${requiredN}$.`, `$n = ${base}^{2} = ${requiredN}$。`)],
              ],
              t(
                `With $n = ${requiredN}$, $\\sqrt{n} = ${base}$ and the margin is $${z} \\cdot \\frac{${sigma}}{${base}} = ${E}$, exactly the target.`,
                `当 $n = ${requiredN}$ 时，$\\sqrt{n} = ${base}$，误差范围为 $${z} \\cdot \\frac{${sigma}}{${base}} = ${E}$，正好是目标。`,
              ),
            ),
          });
        },
      },
      {
        id: "rounding-a-sample-size-up",
        title: t("Rounding a sample size up", "样本容量向上取整"),
        explanation: t(
          "With real critical values the formula $n = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^{2}$ rarely gives a whole number. Always round **up**, even when the decimal part is tiny: rounding down would give a margin slightly larger than $E$.\n\nFor $95\\%$ confidence, $\\sigma = 12$ and $E = 2$: $\\left(\\frac{1.96 \\cdot 12}{2}\\right)^{2} = 11.76^{2} = 138.2976$, so $n = 139$.\n\nCheck: $1.96 \\cdot \\frac{12}{\\sqrt{139}} \\approx 1.995$ meets the target $2$, while $1.96 \\cdot \\frac{12}{\\sqrt{138}} \\approx 2.002$ just misses it.\n\n> **Watch out.** Round up even from $138.2976$: the usual rule of rounding to the nearest whole number would give $138$, a sample that is one short.",
          "使用真实临界值时，公式 $n = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^{2}$ 很少得到整数。总是**向上**取整，即使小数部分很小：向下取整会使误差界略大于 $E$。\n\n例如 $95\\%$ 置信，$\\sigma = 12$，$E = 2$：$\\left(\\frac{1.96 \\cdot 12}{2}\\right)^{2} = 11.76^{2} = 138.2976$，所以 $n = 139$。\n\n检验：$1.96 \\cdot \\frac{12}{\\sqrt{139}} \\approx 1.995$ 达到目标 $2$，而 $1.96 \\cdot \\frac{12}{\\sqrt{138}} \\approx 2.002$ 恰好没达到。\n\n> **注意。** 即使是 $138.2976$ 也要向上取整：按四舍五入的习惯会得到 $138$，样本少了一个。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const sigma = rng.int(3, 30);
          const E = Q.of(rng.pick([5, 10, 15, 20, 25, 30, 40, 50].filter((e) => z.toNumber() * sigma * 10 >= 4 * e)), 10);
          const base = z.mul(Q.of(sigma)).div(E);
          const n0 = base.pow(2);
          const ceil = Math.ceil(n0.toNumber());
          const fl = Math.floor(n0.toNumber());
          const bVal = isTerminating(base) ? dec(base) : base.toNumber().toFixed(4);
          const bStr = isTerminating(base) ? `= ${bVal}` : `\\approx ${bVal}`;
          const nVal = n0.toNumber().toFixed(4);
          const nStr = `\\approx ${nVal}`;
          return numberProblem({
            prompt: t(
              `How large a sample is needed to estimate a mean to within $E = ${dec(E)}$ with $${pct}\\%$ confidence, if $\\sigma = ${sigma}$? Use $z = ${dec(z)}$.`,
              `已知 $\\sigma = ${sigma}$，要在 $${pct}\\%$ 置信水平下把均值的估计误差控制在 $E = ${dec(E)}$ 以内，需要多大的样本？取 $z = ${dec(z)}$。`,
            ),
            answer: ceil,
            wrong: [
              Math.ceil(
                z
                  .mul(Q.of(sigma * sigma))
                  .div(E)
                  .toNumber(),
              ),
            ].filter((w) => w !== ceil),
            mistakes: apart(ceil, [
              ...(n0.eq(Q.of(ceil))
                ? []
                : [why(fl, "This rounds down, which leaves the margin slightly larger than $E$.", "这是向下取整，误差界会略大于 $E$。")]),
              why(
                Math.ceil(base.toNumber()),
                "This rounds up $\\frac{z\\sigma}{E}$, which is $\\sqrt{n}$, without squaring it.",
                "这把 $\\frac{z\\sigma}{E}$ 即 $\\sqrt{n}$ 向上取整，却没有平方。",
              ),
              why(
                Math.ceil(
                  z
                    .mul(Q.of(sigma * sigma))
                    .div(E.pow(2))
                    .toNumber(),
                ),
                `This squares $\\sigma$ and $E$ but not the critical value $z = ${dec(z)}$.`,
                `这把 $\\sigma$ 和 $E$ 平方了，却没有把临界值 $z = ${dec(z)}$ 平方。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the ratio", "求比值"],
                  t(
                    E.eq(Q.one)
                      ? `$\\frac{z\\sigma}{E} = ${dec(z)} \\cdot ${sigma} ${bStr}$.`
                      : `$\\frac{z\\sigma}{E} = \\frac{${dec(z)} \\cdot ${sigma}}{${dec(E)}} ${bStr}$.`,
                    E.eq(Q.one)
                      ? `$\\frac{z\\sigma}{E} = ${dec(z)} \\cdot ${sigma} ${bStr}$。`
                      : `$\\frac{z\\sigma}{E} = \\frac{${dec(z)} \\cdot ${sigma}}{${dec(E)}} ${bStr}$。`,
                  ),
                ],
                [["Square it", "平方"], t(`$${bVal}^{2} ${nStr}$.`, `$${bVal}^{2} ${nStr}$。`)],
                [
                  ["Round up", "向上取整"],
                  t(`The smallest whole number at least $${nVal}$ is $n = ${ceil}$.`, `不小于 $${nVal}$ 的最小整数为 $n = ${ceil}$。`),
                ],
              ],
              t(
                `$${ceil - 1} < ${nVal} \\le ${ceil}$, so $${ceil}$ is the smallest sample that reaches the target.`,
                `$${ceil - 1} < ${nVal} \\le ${ceil}$，所以 $${ceil}$ 是达到目标的最小样本。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // Estimating Sample Sizes for Means: Finite Population Correction
  {
    id: "sample-size-determination-for-estimating-means-finite-populations",
    title: t("Estimating Sample Sizes for Means: Finite Population Correction", "估计均值所需的样本容量：有限总体校正"),
    summary: t(
      "For a finite population of size $N$, the required sample size adjusted for FPC is $n = \\frac{N n_0}{n_0 + N - 1}$, where $n_0 = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^2$.",
      "对于容量为 $N$ 的有限总体，经 FPC 校正后的必要样本容量为 $n = \\frac{N n_0}{n_0 + N - 1}$，其中 $n_0 = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^2$。",
    ),
    intro: t(
      "A village has only $N = 401$ households, and estimating their mean water use to within $E = 5$ litres with $z = 2$ and $\\sigma = 25$ would need $n_0 = \\left(\\frac{2 \\cdot 25}{5}\\right)^{2} = 100$ households from an endless population. Sampling a quarter of the village without replacement already removes much of the uncertainty, so the size can be corrected: $n = \\frac{401 \\cdot 100}{100 + 401 - 1} = \\frac{40100}{500} = 80.2$, rounded up to $81$.\n\nCheck: $81$ is less than $n_0 = 100$, and the saving is large only because $100$ is a quarter of $401$; with $N = 40001$ the formula would give about $99.75$, still $100$ households.\n\nIn this lesson we apply the correction $n = \\frac{Nn_{0}}{n_{0} + N - 1}$ to an infinite-population size and carry out the whole calculation from $\\sigma$ and $E$.",
      "一个村庄只有 $N = 401$ 户，若要在 $z = 2$、$\\sigma = 25$ 下把平均用水量估计到误差 $E = 5$ 升以内，对无限总体需要 $n_0 = \\left(\\frac{2 \\cdot 25}{5}\\right)^{2} = 100$ 户。不放回地抽取全村四分之一已经消除了大部分不确定性，所以样本量可以校正：$n = \\frac{401 \\cdot 100}{100 + 401 - 1} = \\frac{40100}{500} = 80.2$，向上取整为 $81$。\n\n检验：$81$ 小于 $n_0 = 100$；节省之所以多，是因为 $100$ 占 $401$ 的四分之一；若 $N = 40001$，公式给出约 $99.75$，仍需 $100$ 户。\n\n本课我们对无限总体的样本量作校正 $n = \\frac{Nn_{0}}{n_{0} + N - 1}$，并从 $\\sigma$ 和 $E$ 出发完成整个计算。",
    ),
    prerequisites: ["sample-size-determination-for-estimating-means", "finite-population-corrections-for-sample-means"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-finite-sample-size-means",
        title: t("Computing adjusted sample size for finite populations", "计算有限总体的校正样本容量"),
        explanation: t(
          "Start from the sample size for an infinite population, then reduce it, since a small population needs fewer observations for the same precision. With the finite population correction, $n = \\frac{N n_0}{n_0 + N - 1}$.\n\nWith $n_0 = 150$ and $N = 451$: $n = \\frac{451 \\cdot 150}{150 + 451 - 1} = \\frac{67650}{600} = 112.75$.\n\nCheck: $112.75$ is below both $n_0 = 150$ and $N = 451$, as a corrected size must be.\n\n> **Watch out.** Keep the $-1$ in the denominator: $\\frac{67650}{601} \\approx 112.56$ uses $n_0 + N$ instead.",
          "先从无限总体所需的样本量出发，再把它缩小，因为小总体达到同样精度所需的观测更少。经有限总体校正，$n = \\frac{N n_0}{n_0 + N - 1}$。\n\n若 $n_0 = 150$，$N = 451$：$n = \\frac{451 \\cdot 150}{150 + 451 - 1} = \\frac{67650}{600} = 112.75$。\n\n检验：$112.75$ 既小于 $n_0 = 150$ 也小于 $N = 451$，校正后的容量理应如此。\n\n> **注意。** 分母中的 $-1$ 不能丢：$\\frac{67650}{601} \\approx 112.56$ 用的是 $n_0 + N$。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(200, 1000);
          const n0 = rng.int(50, 200);
          const num = N * n0;
          const den = n0 + N - 1;

          return numberProblem({
            prompt: t(
              `A researcher finds that an infinite-population sample size calculation gives $n_0 = ${n0}$. The actual finite population has size $N = ${N}$. Calculate the exact rational value of the adjusted sample size $n$.`,
              `研究人员计算得到假定无限总体下的样本容量为 $n_0 = ${n0}$。实际有限总体容量为 $N = ${N}$。计算经校正后的必要样本容量 $n$ 的精确有理数值。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(n0 * (N - 1), N)],
            mistakes: apart(Q.of(num, den), [
              why(Q.of(num, n0 + N), "This drops the $-1$ and divides by $n_0 + N$.", "这丢掉了 $-1$，除以了 $n_0 + N$。"),
              why(n0, "This is the uncorrected size $n_0$; the correction makes it smaller.", "这是未校正的容量 $n_0$；校正会使它变小。"),
            ]),
            solution: walked(
              [
                [["Multiply the sizes", "容量相乘"], t(`$N n_0 = ${N} \\cdot ${n0} = ${num}$.`, `$N n_0 = ${N} \\cdot ${n0} = ${num}$。`)],
                [
                  ["Divide by the corrected total", "除以校正后的总数"],
                  t(
                    `$n_0 + N - 1 = ${den}$, so $n = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `$n_0 + N - 1 = ${den}$，所以 $n = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              t(
                `$n \\approx ${(num / den).toFixed(2)}$ is smaller than both $n_0 = ${n0}$ and $N = ${N}$.`,
                `$n \\approx ${(num / den).toFixed(2)}$ 既小于 $n_0 = ${n0}$，也小于 $N = ${N}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "a-finite-population-sample-size-from-the-start",
        title: t("A finite-population sample size from the start", "从头计算有限总体的样本容量"),
        explanation: t(
          "The full calculation has two stages. First find the infinite-population size $n_0 = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^{2}$, without rounding. Then correct it and round up:\n\n$$n = \\left\\lceil \\frac{N n_0}{n_0 + N - 1} \\right\\rceil.$$\n\nThe correction matters most when $n_0$ is a sizable fraction of $N$; when $N$ is huge it changes almost nothing.\n\nFor $N = 300$, $\\sigma = 20$, $E = 2$ and $z = 2$: $n_0 = 20^{2} = 400$, and $\\frac{300 \\cdot 400}{699} \\approx 171.67$, so $n = 172$.\n\nCheck: $172$ is below both $n_0 = 400$ and $N = 300$.\n\n> **Watch out.** Round up only at the end: $172$ comes from $171.67$, and rounding down to $171$ would leave the margin just above $E$.",
          "完整计算分两步。先求无限总体下的样本量 $n_0 = \\left(\\frac{z_{\\alpha/2}\\sigma}{E}\\right)^{2}$，不取整。再作校正并向上取整：\n\n$$n = \\left\\lceil \\frac{N n_0}{n_0 + N - 1} \\right\\rceil.$$\n\n当 $n_0$ 占 $N$ 的比例较大时，校正最为重要；$N$ 很大时它几乎不改变结果。\n\n若 $N = 300$，$\\sigma = 20$，$E = 2$，$z = 2$：$n_0 = 20^{2} = 400$，$\\frac{300 \\cdot 400}{699} \\approx 171.67$，所以 $n = 172$。\n\n检验：$172$ 既小于 $n_0 = 400$ 也小于 $N = 300$。\n\n> **注意。** 只在最后向上取整：$172$ 来自 $171.67$，若向下取为 $171$，误差界会略超过 $E$。",
        ),
        generate: (rng: Rng): Problem => {
          const E = rng.int(1, 4);
          const sigma = E * rng.int(4, 12);
          const base = (2 * sigma) / E;
          const n0 = base * base;
          const N = rng.int(Math.max(150, n0), 3000);
          const exact = Q.of(N * n0, n0 + N - 1);
          const ans = Math.ceil(exact.toNumber());
          return numberProblem({
            prompt: t(
              `A population has $N = ${N}$ members and standard deviation $\\sigma = ${sigma}$. Using $z = 2$, find the smallest sample, drawn without replacement, that estimates the mean to within $E = ${E}$.`,
              `某总体有 $N = ${N}$ 个成员，标准差 $\\sigma = ${sigma}$。取 $z = 2$，求不放回抽样时，使均值估计误差不超过 $E = ${E}$ 的最小样本容量。`,
            ),
            answer: ans,
            wrong: [Math.ceil((N * n0) / (n0 + N))].filter((w) => w !== ans),
            mistakes: apart(ans, [
              why(
                n0,
                `This is the infinite-population size $n_0 = ${n0}$, without the correction.`,
                `这是无限总体下的容量 $n_0 = ${n0}$，没有校正。`,
              ),
              ...(exact.eq(Q.of(ans))
                ? []
                : [
                    why(
                      Math.floor(exact.toNumber()),
                      "This rounds down; a sample size is always rounded up.",
                      "这是向下取整；样本容量总是向上取整。",
                    ),
                  ]),
              why(N, `This samples the whole population $N = ${N}$, far more than needed.`, `这抽取了整个总体 $N = ${N}$，远多于所需。`),
            ]),
            solution: walked(
              [
                [
                  ["Find the infinite-population size", "求无限总体下的容量"],
                  t(
                    E === 1
                      ? `$n_0 = (2 \\cdot ${sigma})^{2} = ${n0}$.`
                      : `$n_0 = \\left(\\frac{2 \\cdot ${sigma}}{${E}}\\right)^{2} = ${base}^{2} = ${n0}$.`,
                    E === 1
                      ? `$n_0 = (2 \\cdot ${sigma})^{2} = ${n0}$。`
                      : `$n_0 = \\left(\\frac{2 \\cdot ${sigma}}{${E}}\\right)^{2} = ${base}^{2} = ${n0}$。`,
                  ),
                ],
                [
                  ["Apply the correction", "进行校正"],
                  t(
                    `$\\frac{${N} \\cdot ${n0}}{${n0} + ${N} - 1} = \\frac{${N * n0}}{${n0 + N - 1}} \\approx ${exact.toNumber().toFixed(3)}$.`,
                    `$\\frac{${N} \\cdot ${n0}}{${n0} + ${N} - 1} = \\frac{${N * n0}}{${n0 + N - 1}} \\approx ${exact.toNumber().toFixed(3)}$。`,
                  ),
                ],
                [["Round up", "向上取整"], t(`The sample needs $${ans}$ members.`, `样本需要 $${ans}$ 个成员。`)],
              ],
              t(
                `$${ans}$ is at least $${exact.toNumber().toFixed(3)}$ and no more than $n_0 = ${n0}$ and $N = ${N}$.`,
                `$${ans}$ 不小于 $${exact.toNumber().toFixed(3)}$，且不超过 $n_0 = ${n0}$ 与 $N = ${N}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.27.2 Estimating Sample Sizes for Proportions
  {
    id: "sample-size-determination-for-estimating-proportions",
    title: t("Estimating Sample Sizes for Proportions", "估计比例所需的样本容量"),
    summary: t(
      "The sample size required to estimate a population proportion $p$ within margin $E$ is $n = \\frac{z_{\\alpha/2}^2\\, p(1 - p)}{E^2}$. Using $p = 0.5$ gives the most conservative (largest) sample size.",
      "为了在允许误差 $E$ 内估计总体比例 $p$，所需样本容量为 $n = \\frac{z_{\\alpha/2}^2\\, p(1 - p)}{E^2}$。取 $p = 0.5$ 可获得最保守（最大）的样本容量。",
    ),
    intro: t(
      "A newspaper wants the share of voters backing a candidate to within $E = 0.03$ at $95\\%$ confidence. The margin with $n$ voters is $1.96\\sqrt{\\frac{p(1 - p)}{n}}$, which needs a value of $p$ before the poll is taken. Without one, the safe choice is $p = 0.5$, where $p(1 - p) = 0.25$ is as large as it can be: $n = \\frac{1.96^{2} \\cdot 0.25}{0.03^{2}} = \\frac{0.9604}{0.0009} \\approx 1067.1$, so $1068$ voters. If an earlier poll suggests $p \\approx 0.2$, then $p(1 - p) = 0.16$ and only $\\frac{3.8416 \\cdot 0.16}{0.0009} \\approx 682.9$, that is $683$, are needed.\n\nCheck: $0.2 \\cdot 0.8 = 0.16 < 0.25$, so the planning value always gives the smaller sample.\n\nIn this lesson we compute the sample size $n = \\frac{z_{\\alpha/2}^{2}\\,p(1 - p)}{E^{2}}$ for a proportion, first with the conservative $p = 0.5$ and then with a planning value.",
      "一家报社希望在 $95\\%$ 置信水平下把支持某候选人的选民比例估计到误差 $E = 0.03$ 以内。$n$ 名选民时误差范围为 $1.96\\sqrt{\\frac{p(1 - p)}{n}}$，需要在调查前给出 $p$ 的值。没有的话，稳妥的选择是 $p = 0.5$，此时 $p(1 - p) = 0.25$ 最大：$n = \\frac{1.96^{2} \\cdot 0.25}{0.03^{2}} = \\frac{0.9604}{0.0009} \\approx 1067.1$，所以要 $1068$ 名选民。若以往的调查显示 $p \\approx 0.2$，则 $p(1 - p) = 0.16$，只需 $\\frac{3.8416 \\cdot 0.16}{0.0009} \\approx 682.9$，即 $683$ 名。\n\n检验：$0.2 \\cdot 0.8 = 0.16 < 0.25$，所以用规划值得到的样本总是更小。\n\n本课我们计算比例估计所需的样本量 $n = \\frac{z_{\\alpha/2}^{2}\\,p(1 - p)}{E^{2}}$，先用保守值 $p = 0.5$，再用规划值。",
    ),
    prerequisites: ["confidence-intervals-for-one-proportion", "sample-size-determination-for-estimating-means"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "conservative-sample-size-proportion",
        title: t("Conservative sample size calculation with p = 0.5", "采用 p = 0.5 的保守样本容量计算"),
        explanation: t(
          "Without a prior estimate of the proportion, using one half gives the largest possible variance, so the sample size is large enough whatever the true proportion. $p(1 - p)$ is maximized at $p = 0.5$, where $p(1 - p) = 0.25 = \\frac{1}{4}$, giving $n = \\frac{z^2}{4E^2}$.\n\nWith $z = 2$ and $E = \\frac{1}{20}$: $n = \\frac{4}{4 \\cdot \\frac{1}{400}} = 400$.\n\nCheck: with $400$ responses the margin is $2\\sqrt{\\frac{0.25}{400}} = 2 \\cdot \\frac{1}{40} = \\frac{1}{20}$, exactly the target.\n\n> **Watch out.** Keep the factor $p(1 - p) = \\frac{1}{4}$: $\\frac{z^{2}}{E^{2}} = 1600$ is four times too many.",
          "在没有比例的先验估计时，取二分之一会给出最大的方差，所以无论真实比例是多少，样本量都足够。$p(1 - p)$ 在 $p = 0.5$ 处取得最大值 $0.25 = \\frac{1}{4}$，因此最保守的样本容量为 $n = \\frac{z^2}{4E^2}$。\n\n若 $z = 2$，$E = \\frac{1}{20}$：$n = \\frac{4}{4 \\cdot \\frac{1}{400}} = 400$。\n\n检验：$400$ 份回复时误差范围为 $2\\sqrt{\\frac{0.25}{400}} = 2 \\cdot \\frac{1}{40} = \\frac{1}{20}$，正好是目标。\n\n> **注意。** 不要丢掉因子 $p(1 - p) = \\frac{1}{4}$：$\\frac{z^{2}}{E^{2}} = 1600$ 多了三倍。",
        ),
        generate: (rng: Rng): Problem => {
          // E = 1/k where k in [10, 50]
          const k = rng.int(10, 50);
          // z = 2
          // n = (z^2 * 0.25) / E^2 = (4 * 0.25) * k^2 = k^2
          const n = k * k;

          return numberProblem({
            prompt: t(
              `Using $z_{\\alpha/2} = 2$ and the conservative planning value $p = 0.5$, calculate the required sample size to estimate a population proportion within a margin of error $E = \\frac{1}{${k}}${lowestTerms(1, k)}$.`,
              `取临界值 $z_{\\alpha/2} = 2$ 并采用最保守的规划值 $p = 0.5$，若要将总体比例的误差范围控制在 $E = \\frac{1}{${k}}$ 之内，计算所需的样本容量。`,
            ),
            answer: n,
            wrong: [2 * n],
            mistakes: [
              why(4 * n, "This leaves out the factor $p(1 - p) = \\frac{1}{4}$.", "这漏掉了因子 $p(1 - p) = \\frac{1}{4}$。"),
              why(
                k,
                `This is $\\frac{1}{E} = ${k}$; the sample size grows with $\\frac{1}{E^{2}}$.`,
                `这是 $\\frac{1}{E} = ${k}$；样本量随 $\\frac{1}{E^{2}}$ 增长。`,
              ),
            ],
            solution: walked(
              [
                [
                  ["Use the conservative value", "代入保守值"],
                  t(
                    "With $p = 0.5$, $z^{2}p(1 - p) = 4 \\cdot \\frac{1}{4} = 1$.",
                    "取 $p = 0.5$，$z^{2}p(1 - p) = 4 \\cdot \\frac{1}{4} = 1$。",
                  ),
                ],
                [
                  ["Divide by the squared margin", "除以误差的平方"],
                  t(
                    `$E^{2} = \\frac{1}{${k * k}}$, so $n = 1 \\div \\frac{1}{${k * k}} = ${n}$.`,
                    `$E^{2} = \\frac{1}{${k * k}}$，所以 $n = 1 \\div \\frac{1}{${k * k}} = ${n}$。`,
                  ),
                ],
              ],
              t(
                `With $n = ${n}$, the margin is $2\\sqrt{\\frac{0.25}{${n}}} = \\frac{2 \\cdot 0.5}{${k}} = \\frac{1}{${k}}$, exactly the target.`,
                `当 $n = ${n}$ 时，误差范围为 $2\\sqrt{\\frac{0.25}{${n}}} = \\frac{2 \\cdot 0.5}{${k}} = \\frac{1}{${k}}$，正好是目标。`,
              ),
            ),
          });
        },
      },
      {
        id: "sample-size-with-a-planning-value",
        title: t("Sample size with a planning value", "使用规划值的样本容量"),
        explanation: t(
          "When a pilot study or earlier survey gives a planning value $\\tilde{p}$, use it instead of $0.5$:\n\n$$n = \\left\\lceil \\frac{z_{\\alpha/2}^{2}\\,\\tilde{p}(1 - \\tilde{p})}{E^{2}} \\right\\rceil.$$\n\nThe further $\\tilde{p}$ is from $0.5$, the smaller $\\tilde{p}(1 - \\tilde{p})$ and the smaller the sample. For $\\tilde{p} = 0.2$, $E = 0.04$ and $z = 1.96$: $\\frac{3.8416 \\cdot 0.16}{0.0016} = 384.16$, so $n = 385$, against $601$ with $0.5$.\n\nCheck: $\\frac{0.16}{0.25} = 0.64$, and $0.64 \\cdot 600.25 = 384.16$, so the planning value scales the conservative size by $0.64$.\n\n> **Watch out.** Square the critical value: $\\frac{1.96 \\cdot 0.16}{0.0016} = 196$ uses $z$ in place of $z^{2}$ and is far too small.",
          "当预调查或以往调查给出规划值 $\\tilde{p}$ 时，用它代替 $0.5$：\n\n$$n = \\left\\lceil \\frac{z_{\\alpha/2}^{2}\\,\\tilde{p}(1 - \\tilde{p})}{E^{2}} \\right\\rceil.$$\n\n$\\tilde{p}$ 离 $0.5$ 越远，$\\tilde{p}(1 - \\tilde{p})$ 越小，所需样本也越小。例如 $\\tilde{p} = 0.2$，$E = 0.04$，$z = 1.96$：$\\frac{3.8416 \\cdot 0.16}{0.0016} = 384.16$，所以 $n = 385$，而用 $0.5$ 则需 $601$。\n\n检验：$\\frac{0.16}{0.25} = 0.64$，且 $0.64 \\cdot 600.25 = 384.16$，所以规划值把保守样本量缩小为 $0.64$ 倍。\n\n> **注意。** 临界值要平方：$\\frac{1.96 \\cdot 0.16}{0.0016} = 196$ 用 $z$ 代替了 $z^{2}$，小得多。",
        ),
        generate: (rng: Rng): Problem => {
          const [pct, z] = pickLevel(rng);
          const p = Q.of(rng.pick([1, 2, 3, 4, 6, 7, 8, 9]), 10);
          const E = Q.of(rng.pick([2, 3, 4, 5, 6]), 100);
          const n0 = z.pow(2).mul(p).mul(Q.one.sub(p)).div(E.pow(2));
          const ans = Math.ceil(n0.toNumber());
          const half = Math.ceil(z.pow(2).div(Q.of(4)).div(E.pow(2)).toNumber());
          return numberProblem({
            prompt: t(
              `A pilot survey suggests a proportion near $${dec(p)}$. How large a sample is needed to estimate the proportion to within $E = ${dec(E)}$ with $${pct}\\%$ confidence? Use $z = ${dec(z)}$.`,
              `预调查显示比例约为 $${dec(p)}$。要在 $${pct}\\%$ 置信水平下把比例的估计误差控制在 $E = ${dec(E)}$ 以内，需要多大的样本？取 $z = ${dec(z)}$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                half,
                `This uses the conservative $p = 0.5$ instead of the planning value $${dec(p)}$.`,
                `这用了保守值 $p = 0.5$，而不是规划值 $${dec(p)}$。`,
              ),
              ...(n0.eq(Q.of(ans))
                ? []
                : [
                    why(
                      Math.floor(n0.toNumber()),
                      "This rounds down, which leaves the margin slightly larger than $E$.",
                      "这是向下取整，误差界会略大于 $E$。",
                    ),
                  ]),
              why(
                Math.ceil(z.mul(p).mul(Q.one.sub(p)).div(E.pow(2)).toNumber()),
                `This uses $z = ${dec(z)}$ in place of $z^{2}$.`,
                `这用 $z = ${dec(z)}$ 代替了 $z^{2}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the numerator", "求分子"],
                  t(
                    `$z^{2}\\tilde{p}(1 - \\tilde{p}) = ${dec(z)}^{2} \\cdot ${dec(p)} \\cdot ${dec(Q.one.sub(p))} = ${dec(z.pow(2).mul(p).mul(Q.one.sub(p)))}$.`,
                    `$z^{2}\\tilde{p}(1 - \\tilde{p}) = ${dec(z)}^{2} \\cdot ${dec(p)} \\cdot ${dec(Q.one.sub(p))} = ${dec(z.pow(2).mul(p).mul(Q.one.sub(p)))}$。`,
                  ),
                ],
                [
                  ["Divide by the squared margin", "除以误差的平方"],
                  t(
                    `$${dec(E)}^{2} = ${dec(E.pow(2))}$, so $\\frac{${dec(z.pow(2).mul(p).mul(Q.one.sub(p)))}}{${dec(E.pow(2))}} \\approx ${n0.toNumber().toFixed(3)}$.`,
                    `$${dec(E)}^{2} = ${dec(E.pow(2))}$，所以 $\\frac{${dec(z.pow(2).mul(p).mul(Q.one.sub(p)))}}{${dec(E.pow(2))}} \\approx ${n0.toNumber().toFixed(3)}$。`,
                  ),
                ],
                [["Round up", "向上取整"], t(`$n = ${ans}$.`, `$n = ${ans}$。`)],
              ],
              t(
                `$${ans}$ is no more than the conservative size $${half}$, since $${dec(p.mul(Q.one.sub(p)))} \\le 0.25$.`,
                `$${ans}$ 不超过保守样本量 $${half}$，因为 $${dec(p.mul(Q.one.sub(p)))} \\le 0.25$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 7.27.3 Estimating Sample Sizes for Proportions: Finite Population Correction
  {
    id: "sample-size-determination-for-estimating-proportions-finite-populations",
    title: t("Estimating Sample Sizes for Proportions: Finite Population Correction", "估计比例所需的样本容量：有限总体校正"),
    summary: t(
      "For a finite population of size $N$, the FPC-adjusted sample size for estimating proportions is $n = \\frac{N n_0}{n_0 + N - 1}$, where $n_0$ is the uncorrected sample size.",
      "对于容量为 $N$ 的有限总体，估计比例时经 FPC 校正的必要样本容量为 $n = \\frac{N n_0}{n_0 + N - 1}$，其中 $n_0$ 为未校正的样本容量。",
    ),
    intro: t(
      "A sports club with $N = 1000$ members wants the share who would use a new court to within $E = 0.05$, with $z = 2$ and no earlier estimate. For an endless population that needs $n_0 = \\frac{2^{2} \\cdot 0.25}{0.05^{2}} = \\frac{1}{0.0025} = 400$ responses. But $400$ is two fifths of the club, so the finite population correction reduces it: $n = \\frac{1000 \\cdot 400}{400 + 1000 - 1} = \\frac{400000}{1399} \\approx 285.9$, so $286$ members are enough.\n\nCheck: $286$ is less than $n_0 = 400$ and less than $N = 1000$, and the club saves $400 - 286 = 114$ interviews.\n\nIn this lesson we correct a proportion's sample size with $n = \\frac{Nn_{0}}{n_{0} + N - 1}$ and carry out the whole calculation from $E$.",
      "一个有 $N = 1000$ 名会员的体育俱乐部想把会使用新球场的会员比例估计到误差 $E = 0.05$ 以内，取 $z = 2$，没有先前的估计。对无限总体需要 $n_0 = \\frac{2^{2} \\cdot 0.25}{0.05^{2}} = \\frac{1}{0.0025} = 400$ 份回复。但 $400$ 是俱乐部的五分之二，所以有限总体校正会把它减小：$n = \\frac{1000 \\cdot 400}{400 + 1000 - 1} = \\frac{400000}{1399} \\approx 285.9$，所以 $286$ 名会员就够了。\n\n检验：$286$ 小于 $n_0 = 400$，也小于 $N = 1000$，俱乐部省下 $400 - 286 = 114$ 次访谈。\n\n本课我们用 $n = \\frac{Nn_{0}}{n_{0} + N - 1}$ 校正比例的样本量，并从 $E$ 出发完成整个计算。",
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
          "The same adjustment applies to proportions: compute the usual sample size first and then correct it for the population size. With the finite population correction, $n = \\frac{N n_0}{n_0 + N - 1}$.\n\nWith $n_0 = 200$ and $N = 601$: $n = \\frac{601 \\cdot 200}{200 + 601 - 1} = \\frac{120200}{800} = 150.25$.\n\nCheck: $150.25$ is less than $n_0 = 200$, and the share $\\frac{200}{601}$ is large enough for the correction to matter.\n\n> **Watch out.** The correction divides by $n_0 + N - 1$, not $n_0 + N$: $\\frac{120200}{801} \\approx 150.06$ is a different number.",
          "同样的调整也适用于比例：先算出通常的样本量，再根据总体大小修正它。经有限总体校正，$n = \\frac{N n_0}{n_0 + N - 1}$。\n\n若 $n_0 = 200$，$N = 601$：$n = \\frac{601 \\cdot 200}{200 + 601 - 1} = \\frac{120200}{800} = 150.25$。\n\n检验：$150.25$ 小于 $n_0 = 200$，且比例 $\\frac{200}{601}$ 足够大，校正有明显作用。\n\n> **注意。** 校正要除以 $n_0 + N - 1$，不是 $n_0 + N$：$\\frac{120200}{801} \\approx 150.06$ 是另一个数。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(300, 2000);
          const n0 = rng.int(100, 400);
          const num = N * n0;
          const den = n0 + N - 1;

          return numberProblem({
            prompt: t(
              `An initial proportion sample size calculation yields $n_0 = ${n0}$. The finite population contains $N = ${N}$ items. Find the exact rational value of the adjusted sample size $n$.`,
              `初始比例样本容量计算结果为 $n_0 = ${n0}$。实际有限总体包含 $N = ${N}$ 个个体。求经有限校正后的样本容量 $n$ 的精确有理数值。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(n0 * (N - 1), N)],
            mistakes: apart(Q.of(num, den), [
              why(Q.of(num, n0 + N), "This drops the $-1$ and divides by $n_0 + N$.", "这丢掉了 $-1$，除以了 $n_0 + N$。"),
              why(n0, "This is the uncorrected size $n_0$; the correction makes it smaller.", "这是未校正的容量 $n_0$；校正会使它变小。"),
            ]),
            solution: walked(
              [
                [["Multiply the sizes", "容量相乘"], t(`$N n_0 = ${N} \\cdot ${n0} = ${num}$.`, `$N n_0 = ${N} \\cdot ${n0} = ${num}$。`)],
                [
                  ["Divide by the corrected total", "除以校正后的总数"],
                  t(
                    `$n_0 + N - 1 = ${den}$, so $n = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `$n_0 + N - 1 = ${den}$，所以 $n = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              t(
                `$n \\approx ${(num / den).toFixed(2)}$ is smaller than both $n_0 = ${n0}$ and $N = ${N}$.`,
                `$n \\approx ${(num / den).toFixed(2)}$ 既小于 $n_0 = ${n0}$，也小于 $N = ${N}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "a-finite-population-sample-size-for-a-proportion",
        title: t("A finite-population sample size for a proportion", "有限总体下比例的样本容量"),
        explanation: t(
          "Combine the two steps: compute $n_0 = \\frac{z_{\\alpha/2}^{2}\\,p(1 - p)}{E^{2}}$ with $p = 0.5$ unless a planning value is available, then apply the correction and round up:\n\n$$n = \\left\\lceil \\frac{N n_0}{n_0 + N - 1} \\right\\rceil.$$\n\nFor a school of $N = 800$ students, $z = 2$ and $E = 0.05$: $n_0 = 400$ and $n = \\left\\lceil \\frac{320000}{1199} \\right\\rceil = 267$, a third fewer than without the correction.\n\nCheck: $\\frac{320000}{1199} \\approx 266.9$, so $267$ is the first whole number at or above it, and $267 < 400$.\n\n> **Watch out.** Correct the unrounded $n_0$ and round only once at the end; rounding down to $266$ would leave the margin just above $E$.",
          "把两步合起来：除非有规划值，否则取 $p = 0.5$ 计算 $n_0 = \\frac{z_{\\alpha/2}^{2}\\,p(1 - p)}{E^{2}}$，再作校正并向上取整：\n\n$$n = \\left\\lceil \\frac{N n_0}{n_0 + N - 1} \\right\\rceil.$$\n\n例如一所有 $N = 800$ 名学生的学校，$z = 2$，$E = 0.05$：$n_0 = 400$，$n = \\left\\lceil \\frac{320000}{1199} \\right\\rceil = 267$，比不校正少三分之一。\n\n检验：$\\frac{320000}{1199} \\approx 266.9$，所以 $267$ 是不小于它的第一个整数，且 $267 < 400$。\n\n> **注意。** 要对未取整的 $n_0$ 作校正，只在最后取整一次；向下取为 $266$ 会使误差界略超过 $E$。",
        ),
        generate: (rng: Rng): Problem => {
          const E = Q.of(rng.pick([2, 3, 4, 5, 6, 8, 10]), 100);
          const n0q = Q.of(4).mul(Q.of(1, 4)).div(E.pow(2));
          const n0 = Math.ceil(n0q.toNumber());
          const N = rng.int(200, 5000);
          const exact = n0q.mul(Q.of(N)).div(n0q.add(Q.of(N - 1)));
          const ans = Math.ceil(exact.toNumber());
          return numberProblem({
            prompt: t(
              `An organization has $N = ${N}$ members. With no prior estimate of the proportion and $z = 2$, how many members must be surveyed, without replacement, to estimate a proportion to within $E = ${dec(E)}$?`,
              `某组织有 $N = ${N}$ 名成员。没有比例的先验估计，取 $z = 2$，不放回地调查多少名成员才能把比例的估计误差控制在 $E = ${dec(E)}$ 以内？`,
            ),
            answer: ans,
            wrong: [
              Math.ceil(
                n0q
                  .mul(Q.of(N))
                  .div(n0q.add(Q.of(N)))
                  .toNumber(),
              ),
            ].filter((w) => w !== ans && w !== 0),
            mistakes: apart(ans, [
              why(
                n0,
                `This is the uncorrected size $${n0}$; the finite population makes it smaller.`,
                `这是未校正的容量 $${n0}$；有限总体会使它变小。`,
              ),
              ...(exact.eq(Q.of(ans))
                ? []
                : [
                    why(
                      Math.floor(exact.toNumber()),
                      "This rounds down; a sample size is always rounded up.",
                      "这是向下取整；样本容量总是向上取整。",
                    ),
                  ]),
              why(N, `This surveys all $N = ${N}$ members, far more than needed.`, `这调查了全部 $N = ${N}$ 名成员，远多于所需。`),
            ]),
            solution: walked(
              [
                [
                  ["Find the uncorrected size", "求未校正的容量"],
                  t(
                    `With $p = 0.5$, $n_0 = \\frac{2^{2} \\cdot 0.25}{${dec(E)}^{2}} = \\frac{1}{${dec(E.pow(2))}} = ${n0q.toLatex()}$.`,
                    `取 $p = 0.5$，$n_0 = \\frac{2^{2} \\cdot 0.25}{${dec(E)}^{2}} = \\frac{1}{${dec(E.pow(2))}} = ${n0q.toLatex()}$。`,
                  ),
                ],
                [
                  ["Apply the correction", "进行校正"],
                  t(
                    `$\\frac{${N} \\cdot ${n0q.toLatex()}}{${n0q.toLatex()} + ${N - 1}} \\approx ${exact.toNumber().toFixed(3)}$.`,
                    `$\\frac{${N} \\cdot ${n0q.toLatex()}}{${n0q.toLatex()} + ${N - 1}} \\approx ${exact.toNumber().toFixed(3)}$。`,
                  ),
                ],
                [["Round up", "向上取整"], t(`The survey needs $${ans}$ members.`, `调查需要 $${ans}$ 名成员。`)],
              ],
              t(
                `$${ans}$ is at least $${exact.toNumber().toFixed(3)}$ and no more than $n_0 \\approx ${n0q.toNumber().toFixed(1)}$ and $N = ${N}$.`,
                `$${ans}$ 不小于 $${exact.toNumber().toFixed(3)}$，且不超过 $n_0 \\approx ${n0q.toNumber().toFixed(1)}$ 与 $N = ${N}$。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
