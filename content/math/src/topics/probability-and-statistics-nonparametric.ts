import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, dec, Q } from "@ga/subject-math";
import { isTerminating, numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** apart keeps the explained mistakes that differ from the answer and from each other. */
const apart = <T extends { readonly value: Coefficient }>(answer: Coefficient, list: readonly T[]): T[] => {
  const asQ = (v: Coefficient) => (typeof v === "number" ? Q.of(v) : v);
  return list.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && list.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
};

/** Topics for Unit 10: Nonparametric Inference (new topics). */
export const probabilityAndStatisticsNonparametricTopics: TopicDef[] = [
  // 10.33.1 Introduction to Chi-Square Goodness-of-Fit
  {
    id: "introduction-to-chi-square-goodness-of-fit",
    title: t("Introduction to Chi-Square Goodness-of-Fit", "卡方拟合优度检验导论"),
    summary: t(
      "Pearson's chi-square goodness-of-fit test compares observed counts $O_i$ with expected counts $E_i$ across $k$ categories: $\\chi^2 = \\sum_{i=1}^{k} \\frac{(O_i - E_i)^2}{E_i}$. When no parameters are estimated, it has $\\nu = k - 1$ degrees of freedom.",
      "皮尔逊卡方拟合优度检验比较 $k$ 个类别的观测频数 $O_i$ 与期望频数 $E_i$：$\\chi^2 = \\sum_{i=1}^{k} \\frac{(O_i - E_i)^2}{E_i}$。当没有参数需要估计时，自由度为 $\\nu = k - 1$。",
    ),
    intro: t(
      "A spinner with three equal sectors is spun $90$ times and lands on them $36$, $27$ and $27$ times. If the spinner is fair, each sector expects $90 \\cdot \\frac{1}{3} = 30$. Each sector contributes its squared gap divided by its expected count: $\\frac{6^2}{30} + \\frac{3^2}{30} + \\frac{3^2}{30} = \\frac{54}{30} = 1.8$. With $3$ categories and nothing estimated, the statistic has $\\nu = 3 - 1 = 2$ degrees of freedom, and $1.8$ is far below the $5\\%$ critical value $5.991$, so the data give no reason to doubt the spinner.\n\nCheck: the observed counts add to $36 + 27 + 27 = 90$, the same as the expected counts $30 + 30 + 30$, so the gaps $6, -3, -3$ add to zero.\n\nIn this lesson we turn hypothesized proportions into expected counts, add the terms $\\frac{(O_i - E_i)^2}{E_i}$ into the chi-square statistic and read its degrees of freedom.",
      "一个分成三个相等扇区的转盘转了 $90$ 次，分别落在各扇区 $36$、$27$、$27$ 次。若转盘公平，每个扇区的期望次数为 $90 \\cdot \\frac{1}{3} = 30$。每个扇区贡献它的差的平方除以期望次数：$\\frac{6^2}{30} + \\frac{3^2}{30} + \\frac{3^2}{30} = \\frac{54}{30} = 1.8$。有 $3$ 个类别且没有估计参数，统计量的自由度为 $\\nu = 3 - 1 = 2$，而 $1.8$ 远低于 $5\\%$ 临界值 $5.991$，所以数据没有理由怀疑转盘。\n\n检验：观测次数之和 $36 + 27 + 27 = 90$，与期望次数之和 $30 + 30 + 30$ 相同，所以差 $6, -3, -3$ 之和为零。\n\n本课我们把假设的比例化为期望频数，把各项 $\\frac{(O_i - E_i)^2}{E_i}$ 加成卡方统计量，并确定它的自由度。",
    ),
    prerequisites: ["the-chi-square-distribution", "introduction-to-hypothesis-testing"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-chi-square-goodness-of-fit-statistic",
        title: t("Computing the chi-square goodness-of-fit test statistic", "计算卡方拟合优度检验统计量"),
        explanation: t(
          "Each category contributes its squared gap between observed and expected counts, scaled by the expected count, and large totals signal a poor fit. The test statistic is $\\chi^2 = \\sum_{i=1}^k \\frac{(O_i - E_i)^2}{E_i}$.\n\nWith expected counts $40, 40, 20$ and observed counts $46, 36, 18$: the gaps are $6, -4, -2$, so $\\chi^2 = \\frac{36}{40} + \\frac{16}{40} + \\frac{4}{20} = 0.9 + 0.4 + 0.2 = 1.5$.\n\nCheck: the gaps $6 - 4 - 2 = 0$ add to zero, as they must when both sets of counts total $100$.\n\n> **Watch out.** Divide each squared gap by its own expected count, not by the observed count and not by the grand total: $\\frac{36 + 16 + 4}{100} = 0.56$ pools the categories and understates the statistic.",
          "每个类别贡献观测数与期望数之差的平方，再除以期望数，总和很大时说明拟合不好。检验统计量为 $\\chi^2 = \\sum_{i=1}^k \\frac{(O_i - E_i)^2}{E_i}$。\n\n若期望频数为 $40, 40, 20$，观测频数为 $46, 36, 18$：差为 $6, -4, -2$，所以 $\\chi^2 = \\frac{36}{40} + \\frac{16}{40} + \\frac{4}{20} = 0.9 + 0.4 + 0.2 = 1.5$。\n\n检验：差 $6 - 4 - 2 = 0$ 之和为零，两组频数的总和都是 $100$ 时必然如此。\n\n> **注意。** 每个差的平方要除以它自己的期望频数，而不是观测频数，也不是总数：$\\frac{36 + 16 + 4}{100} = 0.56$ 把各类别合在一起，低估了统计量。",
        ),
        generate: (rng: Rng): Problem => {
          // 3 categories with clean numbers
          const e1 = rng.int(20, 80);
          const e2 = rng.int(20, 80);
          const e3 = rng.int(20, 80);
          const d1 = rng.nonZero(-8, 8);
          const d2 = rng.int(-8, 8);
          const d3 = -(d1 + d2); // ensure sum(O) = sum(E)
          const o1 = e1 + d1;
          const o2 = e2 + d2;
          const o3 = e3 + d3;

          const term1 = Q.of(d1 * d1, e1);
          const term2 = Q.of(d2 * d2, e2);
          const term3 = Q.of(d3 * d3, e3);
          const ans = term1.add(term2).add(term3);

          return numberProblem({
            prompt: t(
              `An experiment with $k = 3$ categories records observed frequencies $O_1 = ${o1}$, $O_2 = ${o2}$, $O_3 = ${o3}$ against expected frequencies $E_1 = ${e1}$, $E_2 = ${e2}$, $E_3 = ${e3}$. Calculate the exact rational value of the chi-square test statistic $\\chi^2$.`,
              `一个包含 $k = 3$ 个类别的试验记录了观测频数 $O_1 = ${o1}$、$O_2 = ${o2}$、$O_3 = ${o3}$，理论期望频数分别为 $E_1 = ${e1}$、$E_2 = ${e2}$、$E_3 = ${e3}$。计算卡方检验统计量 $\\chi^2$ 的精确有理数值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(d1 * d1 + d2 * d2 + d3 * d3, e1 + e2 + e3),
                "This divides the sum of the squared gaps by the grand total; each squared gap is divided by its own expected count.",
                "这把差的平方和除以了总数；每个差的平方应除以它自己的期望频数。",
              ),
              why(
                Q.of(d1 * d1, o1)
                  .add(Q.of(d2 * d2, o2))
                  .add(Q.of(d3 * d3, o3)),
                "This divides by the observed counts; the statistic divides by the expected counts $E_i$.",
                "这除以了观测频数；统计量要除以期望频数 $E_i$。",
              ),
              why(
                term1.add(term2),
                "This leaves out the third category; every category contributes a term.",
                "这漏掉了第三个类别；每个类别都贡献一项。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the gaps", "求差"],
                  t(`$O_i - E_i$ is $${d1}$, $${d2}$ and $${d3}$.`, `$O_i - E_i$ 分别为 $${d1}$、$${d2}$ 和 $${d3}$。`),
                ],
                [
                  ["Divide each square by its expected count", "每个平方除以各自的期望频数"],
                  t(
                    `$\\frac{${d1 * d1}}{${e1}}$, $\\frac{${d2 * d2}}{${e2}}$ and $\\frac{${d3 * d3}}{${e3}}$.`,
                    `$\\frac{${d1 * d1}}{${e1}}$、$\\frac{${d2 * d2}}{${e2}}$ 和 $\\frac{${d3 * d3}}{${e3}}$。`,
                  ),
                ],
                [
                  ["Add the terms", "把各项相加"],
                  t(
                    `$\\chi^2 = ${ans.toLatex()}$, with $\\nu = 3 - 1 = 2$ degrees of freedom.`,
                    `$\\chi^2 = ${ans.toLatex()}$，自由度 $\\nu = 3 - 1 = 2$。`,
                  ),
                ],
              ],
              t(
                `The observed counts total $${o1 + o2 + o3}$, the same as the expected counts, so the gaps add to $0$.`,
                `观测频数之和为 $${o1 + o2 + o3}$，与期望频数之和相同，所以各差之和为 $0$。`,
              ),
            ),
          });
        },
      },
      {
        id: "expected-counts-from-hypothesized-proportions",
        title: t("Expected counts from hypothesized proportions", "由假设比例求期望频数"),
        explanation: t(
          "The null hypothesis states a proportion $p_i$ for each category, and the expected count is the share of the sample it predicts, $E_i = N p_i$. The category then contributes $\\frac{(O_i - E_i)^2}{E_i}$ to the statistic. If $H_0$ says $30\\%$ of $200$ customers choose a brand and $72$ do, then $E = 60$ and the contribution is $\\frac{12^2}{60} = 2.4$.\n\nCheck: $\\frac{60}{200} = 0.3$ gives back the hypothesized share, and $2.4 \\cdot 60 = 144 = 12^2$.\n\n> **Watch out.** Divide by the expected count, not the observed one: $\\frac{144}{72} = 2$ is not the contribution.",
          "原假设为每个类别给出比例 $p_i$，期望频数就是它所预测的样本份额，$E_i = N p_i$。该类别对统计量的贡献为 $\\frac{(O_i - E_i)^2}{E_i}$。若 $H_0$ 认为 $200$ 名顾客中有 $30\\%$ 选择某品牌，而实际有 $72$ 人，则 $E = 60$，贡献为 $\\frac{12^2}{60} = 2.4$。\n\n检验：$\\frac{60}{200} = 0.3$ 还原了假设的比例，且 $2.4 \\cdot 60 = 144 = 12^2$。\n\n> **注意。** 要除以期望频数，而不是观测频数：$\\frac{144}{72} = 2$ 不是这一项的贡献。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.pick([100, 200, 300, 400, 500, 600, 800, 1000]);
          const pct = rng.pick([10, 15, 20, 25, 30, 35, 40, 45, 50, 60]);
          const e = (N * pct) / 100;
          const d = rng.nonZero(-Math.min(12, e - 1), 12);
          const o = e + d;
          const ans = Q.of(d * d, e);
          return numberProblem({
            prompt: t(
              `Under $H_0$, $${pct}\\%$ of a population falls in category A. In a sample of $N = ${N}$, the observed count in category A is $O = ${o}$. Find the contribution $\\frac{(O - E)^2}{E}$ of category A to the chi-square statistic.`,
              `在 $H_0$ 下，总体中有 $${pct}\\%$ 属于类别 A。在容量为 $N = ${N}$ 的样本中，类别 A 的观测频数为 $O = ${o}$。求类别 A 对卡方统计量的贡献 $\\frac{(O - E)^2}{E}$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(d * d, o),
                `This divides by the observed count $${o}$; the term divides by the expected count $${e}$.`,
                `这除以了观测频数 $${o}$；这一项要除以期望频数 $${e}$。`,
              ),
              why(
                Q.of(d * d, N),
                `This divides by the sample size $${N}$ instead of the expected count $${e}$.`,
                `这除以了样本量 $${N}$，而不是期望频数 $${e}$。`,
              ),
              why(Q.of(Math.abs(d), e), `This forgets to square the gap $${o} - ${e}$.`, `这忘了把差 $${o} - ${e}$ 平方。`),
            ]),
            solution: walked(
              [
                [
                  ["Find the expected count", "求期望频数"],
                  t(`$E = N p = ${N} \\cdot ${pct / 100} = ${e}$.`, `$E = N p = ${N} \\cdot ${pct / 100} = ${e}$。`),
                ],
                [["Square the gap", "把差平方"], t(`$(${o} - ${e})^2 = ${d * d}$.`, `$(${o} - ${e})^2 = ${d * d}$。`)],
                [
                  ["Divide by the expected count", "除以期望频数"],
                  t(`$\\frac{${d * d}}{${e}} = ${ans.toLatex()}$.`, `$\\frac{${d * d}}{${e}} = ${ans.toLatex()}$。`),
                ],
              ],
              t(
                `$\\frac{${e}}{${N}} = ${pct / 100}$ is the hypothesized share, and $${ans.toLatex()} \\cdot ${e} = ${d * d}$.`,
                `$\\frac{${e}}{${N}} = ${pct / 100}$ 正是假设的比例，且 $${ans.toLatex()} \\cdot ${e} = ${d * d}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 10.33.2 Testing Binomial Models Using Chi-Square Goodness-of-Fit
  {
    id: "testing-binomial-models-using-chi-square-goodness-of-fit",
    title: t("Testing Binomial Models Using Chi-Square Goodness-of-Fit", "卡方拟合优度检验二项分布模型"),
    summary: t(
      "When testing whether data follow a $\\text{Binomial}(n, p)$ distribution, the expected count for $x$ successes in $N$ observations is $E_x = N\\,P(X = x) = N\\binom{n}{x} p^x (1 - p)^{n - x}$.",
      "检验数据是否服从二项分布 $\\text{Binomial}(n, p)$ 时，在 $N$ 个观测中 $x$ 次成功的期望频数为 $E_x = N\\,P(X = x) = N\\binom{n}{x} p^x (1 - p)^{n - x}$。",
    ),
    intro: t(
      "Eighty families with two children are recorded by their number of girls: $18$ have none, $44$ have one and $18$ have two. Under $\\text{Binomial}(2, \\frac{1}{2})$ the probabilities are $\\frac{1}{4}, \\frac{1}{2}, \\frac{1}{4}$, so the expected counts are $20, 40, 20$. The statistic is $\\frac{2^2}{20} + \\frac{4^2}{40} + \\frac{2^2}{20} = 0.2 + 0.4 + 0.2 = 0.8$ on $\\nu = 3 - 1 = 2$ degrees of freedom, since $p$ was given in advance.\n\nCheck: the expected counts $20 + 40 + 20 = 80$ use up all the families, just as the probabilities add to $1$.\n\nIn this lesson we compute expected counts under a binomial model, estimate $p$ from the counts when it is not given, and count the degrees of freedom after merging and estimating.",
      "记录了 $80$ 个有两个孩子的家庭中女孩的个数：$18$ 家没有，$44$ 家有一个，$18$ 家有两个。在 $\\text{Binomial}(2, \\frac{1}{2})$ 下各概率为 $\\frac{1}{4}, \\frac{1}{2}, \\frac{1}{4}$，所以期望频数为 $20, 40, 20$。统计量为 $\\frac{2^2}{20} + \\frac{4^2}{40} + \\frac{2^2}{20} = 0.2 + 0.4 + 0.2 = 0.8$，由于 $p$ 是事先给定的，自由度为 $\\nu = 3 - 1 = 2$。\n\n检验：期望频数 $20 + 40 + 20 = 80$ 正好分完所有家庭，正如各概率之和为 $1$。\n\n本课我们计算二项模型下的期望频数，在 $p$ 未给出时由频数估计它，并在合并类别与估计参数后计算自由度。",
    ),
    prerequisites: ["introduction-to-chi-square-goodness-of-fit", "the-binomial-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "binomial-expected-cell-count",
        title: t("Computing expected cell counts under a binomial model", "计算二项模型下的期望频数"),
        explanation: t(
          "The expected count for a value is the total number of observations times the model's probability of that value. The expected count for the cell $x$ is $E_x = N \\binom{n}{x} p^x (1 - p)^{n-x}$.\n\nFor $N = 64$ batches of size $n = 3$ under $\\text{Binomial}(3, 0.5)$, every outcome has probability $(0.5)^{3} = \\frac{1}{8}$, and $x = 2$ arises in $\\binom{3}{2} = 3$ ways, so $E_2 = 64 \\cdot \\frac{3}{8} = 24$.\n\nCheck: the four expected counts $8, 24, 24, 8$ add to $64$.\n\n> **Watch out.** Include the binomial coefficient: $64 \\cdot \\frac{1}{8} = 8$ counts one particular order of successes, not all the ways to get $x = 2$.",
          "某个取值的期望计数等于观测总数乘以模型给出的该值概率。取值 $x$ 对应的期望频数为 $E_x = N \\binom{n}{x} p^x (1 - p)^{n-x}$。\n\n对 $\\text{Binomial}(3, 0.5)$ 下 $N = 64$ 批容量 $n = 3$ 的数据，每种结果的概率都是 $(0.5)^{3} = \\frac{1}{8}$，而 $x = 2$ 有 $\\binom{3}{2} = 3$ 种出现方式，所以 $E_2 = 64 \\cdot \\frac{3}{8} = 24$。\n\n检验：四个期望频数 $8, 24, 24, 8$ 之和为 $64$。\n\n> **注意。** 不要漏掉二项式系数：$64 \\cdot \\frac{1}{8} = 8$ 只计了成功的一种特定顺序，而不是得到 $x = 2$ 的所有方式。",
        ),
        generate: (rng: Rng): Problem => {
          // n = 2 or 3 with p = 1/2
          const n = rng.pick([2, 3]);
          const x = rng.int(0, n);
          let nChooseX = 1;
          if (n === 2) {
            nChooseX = x === 1 ? 2 : 1;
          } else {
            nChooseX = x === 0 || x === 3 ? 1 : 3;
          }

          // With p = 1/2, P(X = x) = nChooseX / 2^n
          const denProb = 2 ** n;
          // Choose N as a multiple of 2^n
          const mult = rng.int(10, 80);
          const N = mult * denProb;
          const expected = mult * nChooseX;

          return numberProblem({
            prompt: t(
              `A total of $N = ${N}$ independent batches of size $n = ${n}$ are tested for fit to a $\\text{Binomial}(${n}, 0.5)$ model. Calculate the expected frequency $E_{${x}} = N \\cdot P(X = ${x})$.`,
              `共 $N = ${N}$ 组容量为 $n = ${n}$ 的独立批次用于检验是否符合 $\\text{Binomial}(${n}, 0.5)$ 模型。计算观测到恰好 $x = ${x}$ 次成功的期望频数 $E_{${x}} = N \\cdot P(X = ${x})$。`,
            ),
            answer: expected,
            mistakes: apart(expected, [
              why(
                mult,
                `This leaves out $\\binom{${n}}{${x}} = ${nChooseX}$, the number of orders that give $${x}$ successes.`,
                `这漏掉了 $\\binom{${n}}{${x}} = ${nChooseX}$，即得到 $${x}$ 次成功的顺序数。`,
              ),
              why(
                Q.of(N, n + 1),
                `This shares the batches equally among the $${n + 1}$ values; the binomial values are not equally likely.`,
                `这把批次平均分给 $${n + 1}$ 个取值；二项分布的各取值并不等可能。`,
              ),
              why(
                Q.of(N * x, n),
                `This multiplies $N$ by $\\frac{x}{n}$, the share of successes, which is not the probability of exactly $${x}$ successes.`,
                `这把 $N$ 乘以成功所占的比例 $\\frac{x}{n}$，它不是恰好 $${x}$ 次成功的概率。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the probability", "求概率"],
                  t(
                    `Since $p = 1 - p = 0.5$, each order has probability $(0.5)^{${n}} = \\frac{1}{${denProb}}$, and there are $\\binom{${n}}{${x}} = ${nChooseX}$ orders, so $P(X = ${x}) = \\frac{${nChooseX}}{${denProb}}$.`,
                    `由于 $p = 1 - p = 0.5$，每种顺序的概率都是 $(0.5)^{${n}} = \\frac{1}{${denProb}}$，共有 $\\binom{${n}}{${x}} = ${nChooseX}$ 种顺序，所以 $P(X = ${x}) = \\frac{${nChooseX}}{${denProb}}$。`,
                  ),
                ],
                [
                  ["Multiply by the number of batches", "乘以批数"],
                  t(
                    `$E_{${x}} = ${N} \\cdot \\frac{${nChooseX}}{${denProb}} = ${expected}$.`,
                    `$E_{${x}} = ${N} \\cdot \\frac{${nChooseX}}{${denProb}} = ${expected}$。`,
                  ),
                ],
              ],
              t(
                `$${expected} \\cdot ${denProb} = ${expected * denProb} = ${nChooseX} \\cdot ${N}$.`,
                `$${expected} \\cdot ${denProb} = ${expected * denProb} = ${nChooseX} \\cdot ${N}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "estimating-the-binomial-proportion-from-counts",
        title: t("Estimating the binomial proportion from the counts", "由频数估计二项分布的比例"),
        explanation: t(
          "When $p$ is not given, estimate it from the data before computing expected counts. Each of the $N$ batches has $n$ trials, so there are $Nn$ trials in all, and the total number of successes is $\\sum x f_x$. The estimate is the overall success rate,\n\n$$\\hat{p} = \\frac{\\sum x f_x}{N n} = \\frac{\\bar{x}}{n}.$$\n\nEstimating $p$ costs one more degree of freedom: $\\nu = k - 2$ for $k$ cells.\n\nWith $n = 2$ and $f_0, f_1, f_2 = 10, 20, 10$: there are $N = 40$ batches, $0 + 20 + 20 = 40$ successes and $80$ trials, so $\\hat{p} = \\frac{40}{80} = \\frac{1}{2}$.\n\nCheck: the mean per batch is $\\bar{x} = \\frac{40}{40} = 1$, and $\\frac{\\bar{x}}{n} = \\frac{1}{2}$ agrees.\n\n> **Watch out.** Divide by the number of trials $Nn$, not the number of batches $N$: $\\frac{40}{40} = 1$ is the mean count per batch, not a probability.",
          "当 $p$ 未给出时，要先用数据估计它，再计算期望频数。$N$ 批中每批有 $n$ 次试验，共 $Nn$ 次试验，成功总数为 $\\sum x f_x$。估计值就是总的成功率：\n\n$$\\hat{p} = \\frac{\\sum x f_x}{N n} = \\frac{\\bar{x}}{n}.$$\n\n估计 $p$ 会再损失一个自由度：$k$ 个单元格时 $\\nu = k - 2$。\n\n若 $n = 2$，$f_0, f_1, f_2 = 10, 20, 10$：共 $N = 40$ 批，成功 $0 + 20 + 20 = 40$ 次，试验 $80$ 次，所以 $\\hat{p} = \\frac{40}{80} = \\frac{1}{2}$。\n\n检验：每批的平均成功数为 $\\bar{x} = \\frac{40}{40} = 1$，$\\frac{\\bar{x}}{n} = \\frac{1}{2}$ 与之相符。\n\n> **注意。** 要除以试验总数 $Nn$，而不是批数 $N$：$\\frac{40}{40} = 1$ 是每批的平均成功数，不是概率。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.pick([2, 3, 4]);
          const fs = Array.from({ length: n + 1 }, () => rng.int(5, 60));
          const N = fs.reduce((s, f) => s + f, 0);
          const total = fs.reduce((s, f, x) => s + x * f, 0);
          const ans = Q.of(total, N * n);
          const xs = fs.map((_, x) => x);
          const table = `$$\\begin{array}{c|${"c".repeat(n + 1)}} x & ${xs.join(" & ")} \\\\ \\hline f_x & ${fs.join(" & ")} \\end{array}$$`;
          const sum = fs.map((f, x) => `${x} \\cdot ${f}`).join(" + ");
          return numberProblem({
            prompt: t(
              `In each of $N = ${N}$ batches, $n = ${n}$ items are tested, and $x$ is the number of successes in a batch. The table gives how many batches $f_x$ had each $x$. Estimate $p$ for a binomial model as an exact fraction.${table}`,
              `共检验 $N = ${N}$ 批，每批 $n = ${n}$ 件，$x$ 为一批中的成功次数。表中给出成功次数为 $x$ 的批数 $f_x$。为二项模型估计 $p$，写成精确分数。${table}`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(total, N),
                `This is the mean number of successes per batch; divide it by $n = ${n}$ to get a probability.`,
                `这是每批的平均成功数；还要除以 $n = ${n}$ 才是概率。`,
              ),
              why(
                Q.of(total, N * (n + 1)),
                `This divides by $${n + 1}$, the number of possible values of $x$, instead of the $${n}$ trials in a batch.`,
                `这除以了 $x$ 的可能取值个数 $${n + 1}$，而不是每批的试验次数 $${n}$。`,
              ),
              why(
                Q.of(total, n * (n + 1)),
                "This divides by the size of the table instead of the number of trials $Nn$.",
                "这除以了表格的大小，而不是试验总数 $Nn$。",
              ),
            ]),
            solution: walked(
              [
                [["Count the successes", "数成功次数"], t(`$${sum} = ${total}$.`, `$${sum} = ${total}$。`)],
                [["Count the trials", "数试验次数"], t(`$N n = ${N} \\cdot ${n} = ${N * n}$.`, `$N n = ${N} \\cdot ${n} = ${N * n}$。`)],
                [
                  ["Divide", "相除"],
                  t(
                    `$\\hat{p} = \\frac{${total}}{${N * n}} = ${ans.toLatex()}$.`,
                    `$\\hat{p} = \\frac{${total}}{${N * n}} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The mean per batch is $\\bar{x} = ${Q.of(total, N).toLatex()}$, and $\\frac{\\bar{x}}{${n}} = ${ans.toLatex()}$ agrees.`,
                `每批的平均成功数为 $\\bar{x} = ${Q.of(total, N).toLatex()}$，$\\frac{\\bar{x}}{${n}} = ${ans.toLatex()}$ 与之相符。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 10.33.3 Testing Poisson Models Using Chi-Square Goodness-of-Fit
  {
    id: "testing-poisson-models-using-chi-square-goodness-of-fit",
    title: t("Testing Poisson Models Using Chi-Square Goodness-of-Fit", "卡方拟合优度检验泊松分布模型"),
    summary: t(
      "When testing a Poisson(λ) model where the parameter λ is estimated from the data using x̄, 1 degree of freedom is lost, resulting in ν = k - 1 - 1 = k - 2 degrees of freedom.",
      "检验泊松分布 Poisson(λ) 模型时，若参数 λ 需通过样本均值 x̄ 从数据中估计，则损失 1 个自由度，剩余自由度为 ν = k - 1 - 1 = k - 2。",
    ),
    intro: t(
      "A help desk counts its calls in $200$ separate hours, and the mean is $\\bar{x} = 2$ calls an hour, so a Poisson model takes $\\hat{\\lambda} = 2$. With $e^{-2} = 0.1353$, the expected number of hours with no calls is $200 \\cdot 0.1353 = 27.06$, and with one call it is $200 \\cdot 0.1353 \\cdot 2 = 54.12$. If the counts are grouped into $5$ classes, the test has $\\nu = 5 - 1 - 1 = 3$ degrees of freedom: one for the fixed total and one for the estimated $\\lambda$.\n\nCheck: in a Poisson model $\\frac{P(X = 1)}{P(X = 0)} = \\lambda$, and indeed $\\frac{54.12}{27.06} = 2$.\n\nIn this lesson we estimate $\\lambda$ from a frequency table, compute expected counts under a Poisson model and find the degrees of freedom once $\\lambda$ is estimated.",
      "某服务台统计了 $200$ 个小时各自接到的电话数，均值为每小时 $\\bar{x} = 2$ 个，所以泊松模型取 $\\hat{\\lambda} = 2$。由 $e^{-2} = 0.1353$，没有电话的小时数期望为 $200 \\cdot 0.1353 = 27.06$，有一个电话的为 $200 \\cdot 0.1353 \\cdot 2 = 54.12$。若把计数分成 $5$ 类，检验的自由度为 $\\nu = 5 - 1 - 1 = 3$：一个用于固定的总数，一个用于估计的 $\\lambda$。\n\n检验：在泊松模型中 $\\frac{P(X = 1)}{P(X = 0)} = \\lambda$，而确实 $\\frac{54.12}{27.06} = 2$。\n\n本课我们由频数表估计 $\\lambda$，计算泊松模型下的期望频数，并求出估计 $\\lambda$ 后的自由度。",
    ),
    prerequisites: ["introduction-to-chi-square-goodness-of-fit", "the-poisson-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "poisson-gof-df-calculation",
        title: t("Degrees of freedom when estimating the Poisson parameter", "估计泊松参数时的自由度计算"),
        explanation: t(
          "Each parameter estimated from the data makes the expected counts fit more closely, so one degree of freedom is lost for each. With $k$ categories, $\\text{df} = k - 1 - m$, where $m$ is the number of estimated parameters ($m = 1$ for $\\lambda$).\n\nWith $k = 6$ classes and $\\lambda$ estimated by $\\bar{x}$: $\\nu = 6 - 1 - 1 = 4$.\n\nCheck: had $\\lambda$ been fixed in advance, only the total would restrict the counts, giving $6 - 1 = 5$, one more.\n\n> **Watch out.** Subtract both restrictions: $k - 1 = 5$ forgets that $\\lambda$ was estimated from the same data.",
          "每个由数据估计的参数都使期望计数拟合得更紧，所以每估计一个参数就失去一个自由度。有 $k$ 个类别时，$\\text{df} = k - 1 - m$，其中 $m$ 为估计的参数个数（对 $\\lambda$ 有 $m = 1$）。\n\n若有 $k = 6$ 类，且用 $\\bar{x}$ 估计 $\\lambda$：$\\nu = 6 - 1 - 1 = 4$。\n\n检验：若 $\\lambda$ 事先给定，只有总数限制各频数，自由度为 $6 - 1 = 5$，多一个。\n\n> **注意。** 两个限制都要减去：$k - 1 = 5$ 忘了 $\\lambda$ 是用同一组数据估计的。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(100, 1000);
          const k = rng.int(5, 40);
          const df = k - 2;

          return numberProblem({
            prompt: t(
              `A sample of $N = ${N}$ observations of count data sorted into $k = ${k}$ frequency bins is tested for fit to a Poisson distribution. The rate parameter $\\lambda$ is estimated from the sample data using the sample mean $\\bar{x}$. How many degrees of freedom $\\nu$ does the resulting chi-square goodness-of-fit statistic have?`,
              `一个包含 $N = ${N}$ 个观测值的计数数据样本被整理为 $k = ${k}$ 个频数区间，以检验是否服从泊松分布。率参数 $\\lambda$ 是通过样本均值 $\\bar{x}$ 从样本数据中估计得到的。所得卡方拟合优度检验统计量具有多少个自由度 $\\nu$？`,
            ),
            answer: df,
            mistakes: [
              why(
                k - 1,
                "This forgets the degree of freedom lost by estimating $\\lambda$ from the data.",
                "这忘了由数据估计 $\\lambda$ 所损失的自由度。",
              ),
              why(
                k - 3,
                "This subtracts two estimated parameters, as for a normal model; a Poisson model has only $\\lambda$.",
                "这像正态模型那样减去了两个估计参数；泊松模型只有 $\\lambda$ 一个参数。",
              ),
              why(
                k,
                "This subtracts nothing; the fixed total and the estimate each remove one.",
                "这什么都没减；固定的总数和估计值各去掉一个。",
              ),
            ],
            solution: walked(
              [
                [
                  ["Count the restrictions", "数限制条件"],
                  t(
                    "The counts must add to $N$, and $\\lambda$ is estimated: $1 + 1 = 2$.",
                    "各频数之和必须为 $N$，且估计了 $\\lambda$：$1 + 1 = 2$。",
                  ),
                ],
                [
                  ["Subtract from the number of classes", "从类别数中减去"],
                  t(`$\\nu = ${k} - 1 - 1 = ${df}$.`, `$\\nu = ${k} - 1 - 1 = ${df}$。`),
                ],
              ],
              t(`$${df} + 2 = ${k}$ gives back the number of classes.`, `$${df} + 2 = ${k}$ 还原了类别数。`),
            ),
          });
        },
      },
      {
        id: "estimating-lambda-from-a-frequency-table",
        title: t("Estimating $\\lambda$ from a frequency table", "由频数表估计 $\\lambda$"),
        explanation: t(
          "Before the expected Poisson counts can be computed, $\\lambda$ is estimated by the sample mean. From a frequency table, the mean weights each count $x$ by how often it occurred:\n\n$$\\hat{\\lambda} = \\bar{x} = \\frac{\\sum x f_x}{\\sum f_x}.$$\n\nFor counts $0, 1, 2$ seen $5, 3, 2$ times, $\\hat{\\lambda} = \\frac{0 + 3 + 4}{10} = 0.7$. This is the estimated parameter that lowers the degrees of freedom to $k - 2$.\n\nCheck: $0.7 \\cdot 10 = 7$ gives back the total number of events, $0 \\cdot 5 + 1 \\cdot 3 + 2 \\cdot 2 = 7$.\n\n> **Watch out.** Divide by the number of observations $\\sum f_x = 10$, not by the number of classes $3$: $\\frac{7}{3}$ is not a mean of the data.",
          "在计算泊松期望频数之前，要用样本均值估计 $\\lambda$。由频数表求均值时，每个计数 $x$ 按其出现次数加权：\n\n$$\\hat{\\lambda} = \\bar{x} = \\frac{\\sum x f_x}{\\sum f_x}.$$\n\n例如计数 $0, 1, 2$ 分别出现 $5, 3, 2$ 次，则 $\\hat{\\lambda} = \\frac{0 + 3 + 4}{10} = 0.7$。正是这个被估计的参数使自由度降为 $k - 2$。\n\n检验：$0.7 \\cdot 10 = 7$ 还原了事件总数 $0 \\cdot 5 + 1 \\cdot 3 + 2 \\cdot 2 = 7$。\n\n> **注意。** 要除以观测个数 $\\sum f_x = 10$，而不是类别数 $3$：$\\frac{7}{3}$ 不是数据的均值。",
        ),
        generate: (rng: Rng): Problem => {
          for (;;) {
            const k = rng.int(4, 6);
            const fs = Array.from({ length: k }, (_, x) => rng.int(x === 0 ? 10 : 2, x < 2 ? 60 : 30));
            const N = fs.reduce((s, f) => s + f, 0);
            const total = fs.reduce((s, f, x) => s + x * f, 0);
            const ans = Q.of(total, N);
            if (!isTerminating(ans)) continue;
            const xs = fs.map((_, x) => x);
            const table = `$$\\begin{array}{c|${"c".repeat(k)}} x & ${xs.join(" & ")} \\\\ \\hline f_x & ${fs.join(" & ")} \\end{array}$$`;
            const sum = fs.map((f, x) => `${x} \\cdot ${f}`).join(" + ");
            const mistakes = apart(
              ans,
              [
                why(
                  Q.of(total, k),
                  `This divides the calls by the $${k}$ columns of the table instead of the $${N}$ days.`,
                  `这把电话总数除以表格的 $${k}$ 列，而不是 $${N}$ 天。`,
                ),
                why(
                  Q.of(
                    xs.reduce((s, x) => s + x, 0),
                    k,
                  ),
                  "This averages the values of $x$ without weighting them by how often they occurred.",
                  "这直接平均了 $x$ 的取值，没有按出现次数加权。",
                ),
                why(
                  Q.of(N, k),
                  "This is the average height of a column of the table, a number of days, not a number of calls.",
                  "这是表中每列的平均天数，不是电话数。",
                ),
                why(
                  Q.of(total, N - (fs[0] ?? 0)),
                  "This divides by the days with at least one call; the days with no calls are observations too.",
                  "这只除以了至少有一个电话的天数；没有电话的天数也是观测值。",
                ),
              ].filter((m) => isTerminating(m.value)),
            );
            if (mistakes.length < 2) continue;
            return numberProblem({
              prompt: t(
                `The table gives the number of days $f_x$ on which a help desk received $x$ calls in an hour. Estimate $\\lambda$ for a Poisson model.${table}`,
                `表中给出某服务台一小时内接到 $x$ 个电话的天数 $f_x$。为泊松模型估计 $\\lambda$。${table}`,
              ),
              answer: ans,
              form: "decimal",
              mistakes,
              solution: walked(
                [
                  [["Count the calls", "数电话总数"], t(`$${sum} = ${total}$.`, `$${sum} = ${total}$。`)],
                  [["Count the days", "数天数"], t(`$\\sum f_x = ${N}$.`, `$\\sum f_x = ${N}$。`)],
                  [
                    ["Divide", "相除"],
                    t(
                      `$\\hat{\\lambda} = \\frac{${total}}{${N}} = ${dec(ans)}$.`,
                      `$\\hat{\\lambda} = \\frac{${total}}{${N}} = ${dec(ans)}$。`,
                    ),
                  ],
                ],
                t(
                  `$${dec(ans)} \\cdot ${N} = ${total}$ gives back the total number of calls.`,
                  `$${dec(ans)} \\cdot ${N} = ${total}$ 还原了电话总数。`,
                ),
              ),
            });
          }
        },
      },
    ],
  },

  // 10.33.4 Testing Continuous Uniform Models Using Chi-Square Goodness-of-Fit
  {
    id: "testing-continuous-uniform-models-using-chi-square-goodness-of-fit",
    title: t("Testing Continuous Uniform Models Using Chi-Square Goodness-of-Fit", "卡方拟合优度检验连续均匀分布模型"),
    summary: t(
      "To test whether continuous data follow $\\text{Uniform}(a, b)$, divide $[a, b]$ into $k$ subintervals of equal width. Under $H_0$, each has the same expected frequency $E_i = \\frac{N}{k}$.",
      "检验连续数据是否服从 $\\text{Uniform}(a, b)$ 时，把 $[a, b]$ 划分为 $k$ 个等宽子区间。在 $H_0$ 下，各子区间的期望频数都为 $E_i = \\frac{N}{k}$。",
    ),
    intro: t(
      "A random number generator should produce values spread evenly on $[0, 1]$. Of $120$ values, the four quarters $[0, 0.25]$, $[0.25, 0.5]$, $[0.5, 0.75]$ and $[0.75, 1]$ receive $25$, $35$, $28$ and $32$. Each quarter expects $\\frac{120}{4} = 30$, so $\\chi^2 = \\frac{25 + 25 + 4 + 4}{30} = \\frac{58}{30} \\approx 1.93$ on $\\nu = 4 - 1 = 3$ degrees of freedom, well below the $5\\%$ critical value $7.815$.\n\nCheck: the observed counts $25 + 35 + 28 + 32 = 120$ match the expected total $4 \\cdot 30$.\n\nIn this lesson we compute expected counts for equal and unequal bins under a uniform model, and find how many bins a sample can support.",
      "一个随机数生成器应在 $[0, 1]$ 上均匀地产生数值。$120$ 个数值落在四个四分之一区间 $[0, 0.25]$、$[0.25, 0.5]$、$[0.5, 0.75]$、$[0.75, 1]$ 中的个数分别为 $25$、$35$、$28$、$32$。每个区间期望 $\\frac{120}{4} = 30$ 个，所以 $\\chi^2 = \\frac{25 + 25 + 4 + 4}{30} = \\frac{58}{30} \\approx 1.93$，自由度 $\\nu = 4 - 1 = 3$，远低于 $5\\%$ 临界值 $7.815$。\n\n检验：观测频数 $25 + 35 + 28 + 32 = 120$ 与期望总数 $4 \\cdot 30$ 相符。\n\n本课我们计算均匀模型下等宽与不等宽区间的期望频数，并求出一个样本能支持多少个区间。",
    ),
    prerequisites: ["introduction-to-chi-square-goodness-of-fit", "the-continuous-uniform-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "continuous-uniform-equal-bins-expected",
        title: t("Computing expected bin frequencies for uniform models", "计算均匀分布模型的期望区间频数"),
        explanation: t(
          "When the bins have equal probability under the model, the observations are expected to be shared equally among them. With $k$ equal-probability bins, each expected count is $E_i = \\frac{N}{k}$.\n\nFor $N = 150$ values in $k = 5$ equal bins, each bin has probability $\\frac{1}{5}$, so $E_i = 150 \\cdot \\frac{1}{5} = 30$.\n\nCheck: $5 \\cdot 30 = 150$ uses every observation.\n\n> **Watch out.** Divide by the number of bins $k$, not by $k - 1$: $k - 1$ is the number of degrees of freedom, and $\\frac{150}{4} = 37.5$ would give a total of $187.5$.",
          "当各组在模型下的概率相等时，观测值预期会平均分配到各组中。对 $k$ 个等概率区间，每个期望频数为 $E_i = \\frac{N}{k}$。\n\n把 $N = 150$ 个数值分入 $k = 5$ 个等宽区间，每个区间的概率为 $\\frac{1}{5}$，所以 $E_i = 150 \\cdot \\frac{1}{5} = 30$。\n\n检验：$5 \\cdot 30 = 150$ 用完了所有观测值。\n\n> **注意。** 要除以区间数 $k$，而不是 $k - 1$：$k - 1$ 是自由度，$\\frac{150}{4} = 37.5$ 会使总数变成 $187.5$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(4, 10);
          const perBin = rng.int(15, 60);
          const N = k * perBin;

          return numberProblem({
            prompt: t(
              `A continuous dataset of $N = ${N}$ observations is divided into $k = ${k}$ equal subintervals to test goodness-of-fit for a continuous uniform distribution on $[0, 1]$. What is the expected frequency $E_i$ for each subinterval under $H_0$?`,
              `将包含 $N = ${N}$ 个观测值的连续数据集划分为 $k = ${k}$ 个等宽子区间，以检验其是否符合 $[0, 1]$ 上的连续均匀分布。在 $H_0$ 下，每个子区间的期望频数 $E_i$ 是多少？`,
            ),
            answer: perBin,
            mistakes: apart(perBin, [
              why(
                Q.of(N, k - 1),
                `This divides by $k - 1 = ${k - 1}$, the degrees of freedom, instead of the $${k}$ bins.`,
                `这除以了自由度 $k - 1 = ${k - 1}$，而不是 $${k}$ 个区间。`,
              ),
              why(N, "This is the whole sample; it is shared among the bins.", "这是整个样本；它要分给各个区间。"),
              why(k, "This is the number of bins, not the number of observations in each.", "这是区间个数，不是每个区间里的观测数。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the bin probability", "求区间概率"],
                  t(
                    `Equal subintervals of $[0, 1]$ each have probability $p_i = \\frac{1}{${k}}$.`,
                    `$[0, 1]$ 的每个等宽子区间的概率都是 $p_i = \\frac{1}{${k}}$。`,
                  ),
                ],
                [
                  ["Multiply by the sample size", "乘以样本量"],
                  t(`$E_i = \\frac{${N}}{${k}} = ${perBin}$.`, `$E_i = \\frac{${N}}{${k}} = ${perBin}$。`),
                ],
              ],
              t(`$${k} \\cdot ${perBin} = ${N}$ uses every observation.`, `$${k} \\cdot ${perBin} = ${N}$ 用完了所有观测值。`),
            ),
          });
        },
      },
      {
        id: "expected-counts-for-unequal-bins",
        title: t("Expected counts for bins of unequal width", "不等宽区间的期望频数"),
        explanation: t(
          "Under $\\text{Uniform}(a, b)$, the probability of a bin is its share of the length of the interval, so bins of different widths get different expected counts:\n\n$$E = N \\cdot \\frac{d - c}{b - a} \\quad \\text{for the bin } [c, d].$$\n\nFor $N = 120$ values tested against $\\text{Uniform}(0, 60)$, the bin $[10, 25]$ has $E = 120 \\cdot \\frac{15}{60} = 30$. Every expected count should be at least $5$ for the chi-square approximation to be trusted.\n\nCheck: $\\frac{30}{120} = \\frac{1}{4}$ is the share of the length, $\\frac{15}{60}$.\n\n> **Watch out.** Use the width $d - c = 15$, not the right end $d = 25$: $120 \\cdot \\frac{25}{60} = 50$ is the count for $[0, 25]$.",
          "在 $\\text{Uniform}(a, b)$ 下，一个区间的概率等于它占整个区间长度的比例，所以宽度不同的区间期望频数也不同：\n\n$$E = N \\cdot \\frac{d - c}{b - a},$$\n\n其中 $[c, d]$ 为该区间。\n\n例如用 $N = 120$ 个数据检验 $\\text{Uniform}(0, 60)$，区间 $[10, 25]$ 的 $E = 120 \\cdot \\frac{15}{60} = 30$。为使卡方近似可信，每个期望频数都应不少于 $5$。\n\n检验：$\\frac{30}{120} = \\frac{1}{4}$ 正是长度所占的比例 $\\frac{15}{60}$。\n\n> **注意。** 要用宽度 $d - c = 15$，而不是右端点 $d = 25$：$120 \\cdot \\frac{25}{60} = 50$ 是区间 $[0, 25]$ 的期望频数。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.pick([10, 20, 30, 40, 50, 60, 100]);
          const N = rng.pick([40, 60, 80, 120, 150, 200, 240, 300]);
          const c = rng.int(1, b - 2);
          const d = rng.int(c + 1, b);
          const share = Q.of(d - c, b);
          const ans = Q.of(N * (d - c), b);
          return numberProblem({
            prompt: t(
              `$N = ${N}$ observations are tested for fit to $\\text{Uniform}(0, ${b})$, with bins of different widths. Find the expected count for the bin $[${c}, ${d}]$.`,
              `用 $N = ${N}$ 个观测值检验是否服从 $\\text{Uniform}(0, ${b})$，各区间宽度不同。求区间 $[${c}, ${d}]$ 的期望频数。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(N * d, b),
                `This uses the right end $${d}$ instead of the width $${d} - ${c} = ${d - c}$; it is the count for $[0, ${d}]$.`,
                `这用了右端点 $${d}$，而不是宽度 $${d} - ${c} = ${d - c}$；它是 $[0, ${d}]$ 的期望频数。`,
              ),
              why(
                Q.of(N, d - c),
                `This divides $N$ by the width; the width is divided by the length $${b}$ of the whole interval.`,
                `这把 $N$ 除以宽度；应当把宽度除以整个区间的长度 $${b}$。`,
              ),
              why(share, "This is the probability of the bin, not yet multiplied by $N$.", "这是该区间的概率，还没有乘以 $N$。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the share of the length", "求长度所占的比例"],
                  t(`$\\frac{${d} - ${c}}{${b}} = ${share.toLatex()}$.`, `$\\frac{${d} - ${c}}{${b}} = ${share.toLatex()}$。`),
                ],
                [
                  ["Multiply by the sample size", "乘以样本量"],
                  t(
                    `$E = ${N} \\cdot ${share.toLatex()} = ${ans.toLatex()}$.`,
                    `$E = ${N} \\cdot ${share.toLatex()} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$\\frac{${ans.toLatex()}}{${N}} = ${share.toLatex()}$ is the share of the length.`,
                `$\\frac{${ans.toLatex()}}{${N}} = ${share.toLatex()}$ 正是长度所占的比例。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 10.33.5 Testing Normal Models Using Chi-Square Goodness-of-Fit
  {
    id: "testing-normal-models-using-chi-square-goodness-of-fit",
    title: t("Testing Normal Models Using Chi-Square Goodness-of-Fit", "卡方拟合优度检验正态分布模型"),
    summary: t(
      "When testing whether data follow $N(\\mu, \\sigma^2)$ with $\\mu$ and $\\sigma$ estimated from the sample by $\\bar{x}$ and $s$, $m = 2$ parameters are estimated, giving $\\nu = k - 1 - 2 = k - 3$ degrees of freedom.",
      "检验数据是否服从 $N(\\mu, \\sigma^2)$ 时，若 $\\mu$ 与 $\\sigma$ 都用样本的 $\\bar{x}$ 与 $s$ 估计，则估计了 $m = 2$ 个参数，自由度为 $\\nu = k - 1 - 2 = k - 3$。",
    ),
    intro: t(
      "The heights of $200$ students are tested against $N(170, 10^2)$. The class $[160, 170]$ runs from $z = \\frac{160 - 170}{10} = -1$ to $z = 0$, so its probability is $\\Phi(0) - \\Phi(-1) = 0.5 - 0.1587 = 0.3413$ and its expected count is $200 \\cdot 0.3413 = 68.26$. If $\\mu$ and $\\sigma$ were estimated from the same $200$ heights and $6$ classes are used, the test has $\\nu = 6 - 1 - 2 = 3$ degrees of freedom.\n\nCheck: the class $[170, 180]$ is its mirror image about the mean, and it has the same expected count, $200(\\Phi(1) - \\Phi(0)) = 200(0.8413 - 0.5) = 68.26$.\n\nIn this lesson we find the expected counts of normal classes, including the open classes in the tails, and the degrees of freedom when $\\mu$ and $\\sigma$ are estimated.",
      "用 $N(170, 10^2)$ 检验 $200$ 名学生的身高。组 $[160, 170]$ 从 $z = \\frac{160 - 170}{10} = -1$ 到 $z = 0$，所以它的概率为 $\\Phi(0) - \\Phi(-1) = 0.5 - 0.1587 = 0.3413$，期望频数为 $200 \\cdot 0.3413 = 68.26$。若 $\\mu$ 与 $\\sigma$ 用这 $200$ 个身高估计，并分成 $6$ 组，检验的自由度为 $\\nu = 6 - 1 - 2 = 3$。\n\n检验：组 $[170, 180]$ 与它关于均值对称，期望频数相同：$200(\\Phi(1) - \\Phi(0)) = 200(0.8413 - 0.5) = 68.26$。\n\n本课我们求正态分布各组的期望频数，包括尾部的开放组，并求出估计 $\\mu$ 与 $\\sigma$ 时的自由度。",
    ),
    prerequisites: ["introduction-to-chi-square-goodness-of-fit"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "normal-gof-df-calculation",
        title: t("Degrees of freedom for normal goodness-of-fit test", "正态拟合优度检验的自由度"),
        explanation: t(
          "Estimating both the mean and the standard deviation uses up two degrees of freedom, in addition to the one lost because the counts must add to the total. With $k$ categories, $\\text{df} = k - 1 - 2 = k - 3$ when $\\mu$ and $\\sigma$ are estimated from the sample.\n\nWith $k = 8$ classes and both $\\mu$ and $\\sigma$ estimated: $\\nu = 8 - 1 - 2 = 5$.\n\nCheck: the three restrictions and the five free counts make up the $8$ classes, $5 + 3 = 8$.\n\n> **Watch out.** A normal model has two parameters: $k - 2 = 6$ subtracts only one of them.",
          "估计均值和标准差会用掉两个自由度，此外计数之和必须等于总数，还要再失去一个自由度。有 $k$ 个类别且 $\\mu$ 与 $\\sigma$ 均由样本估计时，$\\text{df} = k - 1 - 2 = k - 3$。\n\n若有 $k = 8$ 组，且 $\\mu$ 与 $\\sigma$ 都被估计：$\\nu = 8 - 1 - 2 = 5$。\n\n检验：三个限制条件与五个自由频数合起来正是 $8$ 组，$5 + 3 = 8$。\n\n> **注意。** 正态模型有两个参数：$k - 2 = 6$ 只减去了其中一个。",
        ),
        generate: (rng: Rng): Problem => {
          const N = rng.int(100, 1000);
          const k = rng.int(6, 40);
          const df = k - 3;

          return numberProblem({
            prompt: t(
              `A sample of $N = ${N}$ data points is partitioned into $k = ${k}$ class intervals to test goodness-of-fit to a normal distribution. Both the mean $\\mu$ and standard deviation $\\sigma$ are estimated from the sample data using $\\bar{x}$ and $s$. Determine the degrees of freedom $\\nu$ for the chi-square test statistic.`,
              `一个包含 $N = ${N}$ 个数据点的样本被划分为 $k = ${k}$ 个组区间，以检验是否符合正态分布。总体均值 $\\mu$ 与标准差 $\\sigma$ 均通过样本统计量 $\\bar{x}$ 和 $s$ 从数据中估计。求卡方检验统计量的自由度 $\\nu$。`,
            ),
            answer: df,
            mistakes: [
              why(k - 1, "This ignores both estimated parameters.", "这忽略了两个被估计的参数。"),
              why(
                k - 2,
                "This subtracts only one estimated parameter; both $\\mu$ and $\\sigma$ were estimated.",
                "这只减去了一个估计参数；$\\mu$ 与 $\\sigma$ 都被估计了。",
              ),
              why(
                k - 4,
                "This subtracts one restriction too many; there are the total and two parameters.",
                "这多减了一个限制；只有总数和两个参数。",
              ),
            ],
            solution: walked(
              [
                [
                  ["Count the restrictions", "数限制条件"],
                  t(
                    "The counts must add to $N$, and $\\mu$ and $\\sigma$ are estimated: $1 + 2 = 3$.",
                    "各频数之和必须为 $N$，且估计了 $\\mu$ 与 $\\sigma$：$1 + 2 = 3$。",
                  ),
                ],
                [
                  ["Subtract from the number of classes", "从类别数中减去"],
                  t(`$\\nu = ${k} - 1 - 2 = ${df}$.`, `$\\nu = ${k} - 1 - 2 = ${df}$。`),
                ],
              ],
              t(`$${df} + 3 = ${k}$ gives back the number of classes.`, `$${df} + 3 = ${k}$ 还原了类别数。`),
            ),
          });
        },
      },
      {
        id: "expected-counts-of-normal-classes",
        title: t("Expected counts of normal classes", "正态分布各组的期望频数"),
        explanation: t(
          "To get the expected count of a class $[c, d]$ under $N(\\mu, \\sigma^2)$, standardize both ends, $z = \\frac{x - \\mu}{\\sigma}$, find the probability between them from the standard normal table, and multiply by $N$:\n\n$$E = N\\big(\\Phi(z_d) - \\Phi(z_c)\\big).$$\n\nFor negative $z$ use $\\Phi(-z) = 1 - \\Phi(z)$. With $\\mu = 50$, $\\sigma = 10$ and $N = 200$, the class $[40, 50]$ has $E = 200(0.5 - 0.1587) = 68.26$.\n\nCheck: by symmetry the class $[50, 60]$ has the same count, $200(0.8413 - 0.5) = 68.26$.\n\n> **Watch out.** Subtract the two table values: $200 \\cdot \\Phi(0) = 100$ is the count below $50$, all the way down, not the count of the class.",
          "求 $N(\\mu, \\sigma^2)$ 下组 $[c, d]$ 的期望频数时，先把两端标准化，$z = \\frac{x - \\mu}{\\sigma}$，再由标准正态分布表求两者之间的概率，最后乘以 $N$：\n\n$$E = N\\big(\\Phi(z_d) - \\Phi(z_c)\\big).$$\n\n$z$ 为负时用 $\\Phi(-z) = 1 - \\Phi(z)$。若 $\\mu = 50$，$\\sigma = 10$，$N = 200$，组 $[40, 50]$ 的 $E = 200(0.5 - 0.1587) = 68.26$。\n\n检验：由对称性，组 $[50, 60]$ 的期望频数相同，$200(0.8413 - 0.5) = 68.26$。\n\n> **注意。** 要把两个表值相减：$200 \\cdot \\Phi(0) = 100$ 是 $50$ 以下全部的期望频数，不是这一组的。",
        ),
        generate: (rng: Rng): Problem => {
          const phi = [5000, 6915, 8413, 9332, 9772];
          const at = (h: number) => (h >= 0 ? (phi[h] ?? 0) : 10000 - (phi[-h] ?? 0));
          const mu = rng.int(10, 90) * 2;
          const sigma = rng.pick([2, 4, 6, 8, 10, 12, 20]);
          const h1 = rng.int(-4, 3);
          const h2 = rng.int(h1 + 1, Math.min(4, h1 + 3));
          const N = rng.pick([100, 150, 200, 250, 400, 500]);
          const c = mu + (h1 * sigma) / 2;
          const d = mu + (h2 * sigma) / 2;
          const prob = at(h2) - at(h1);
          const p = Q.of(prob, 10000);
          const ans = Q.of(N * prob, 10000);
          const z = (h: number) => dec(Q.of(h, 2));
          const ph = (h: number) => dec(Q.of(at(h), 10000));
          return numberProblem({
            prompt: t(
              `$N = ${N}$ observations are tested for fit to $N(${mu}, ${sigma}^2)$. Find the expected count of the class $[${c}, ${d}]$. Use $\\Phi(0.5) = 0.6915$, $\\Phi(1) = 0.8413$, $\\Phi(1.5) = 0.9332$ and $\\Phi(2) = 0.9772$.`,
              `用 $N = ${N}$ 个观测值检验是否服从 $N(${mu}, ${sigma}^2)$。求组 $[${c}, ${d}]$ 的期望频数。取 $\\Phi(0.5) = 0.6915$，$\\Phi(1) = 0.8413$，$\\Phi(1.5) = 0.9332$，$\\Phi(2) = 0.9772$。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: apart(
              ans,
              [
                why(
                  Q.of(N * at(h2), 10000),
                  `This uses $\\Phi(${z(h2)})$ alone, the count below $${d}$; the count below $${c}$ must be subtracted.`,
                  `这只用了 $\\Phi(${z(h2)})$，即 $${d}$ 以下的期望频数；还要减去 $${c}$ 以下的部分。`,
                ),
                why(
                  Q.of(N * (at(h2) + at(h1) - 10000), 10000),
                  "This adds the two table values and subtracts $1$, instead of subtracting one value from the other.",
                  "这把两个表值相加再减 $1$，而不是用一个减去另一个。",
                ),
                why(
                  Q.of(N * prob, 20000),
                  "This halves the probability, as if the class were one tail of a symmetric pair.",
                  "这把概率减半了，好像这一组是对称两尾中的一尾。",
                ),
              ].filter((w) => Q.of(0).cmp(w.value as Q) < 0),
            ),
            solution: walked(
              [
                [
                  ["Standardize the ends", "把两端标准化"],
                  t(
                    `$z = \\frac{${c} - ${mu}}{${sigma}} = ${z(h1)}$ and $z = \\frac{${d} - ${mu}}{${sigma}} = ${z(h2)}$.`,
                    `$z = \\frac{${c} - ${mu}}{${sigma}} = ${z(h1)}$，$z = \\frac{${d} - ${mu}}{${sigma}} = ${z(h2)}$。`,
                  ),
                ],
                [
                  ["Find the probability", "求概率"],
                  t(
                    `$\\Phi(${z(h2)}) - \\Phi(${z(h1)}) = ${ph(h2)} - ${ph(h1)} = ${dec(p)}$.`,
                    `$\\Phi(${z(h2)}) - \\Phi(${z(h1)}) = ${ph(h2)} - ${ph(h1)} = ${dec(p)}$。`,
                  ),
                ],
                [
                  ["Multiply by the sample size", "乘以样本量"],
                  t(`$E = ${N} \\cdot ${dec(p)} = ${dec(ans)}$.`, `$E = ${N} \\cdot ${dec(p)} = ${dec(ans)}$。`),
                ],
              ],
              t(
                `$\\frac{${dec(ans)}}{${N}} = ${dec(p)}$, a probability between $0$ and $1$.`,
                `$\\frac{${dec(ans)}}{${N}} = ${dec(p)}$，是介于 $0$ 与 $1$ 之间的概率。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 10.33.6 Chi-Square Tests of Independence and Homogeneity
  {
    id: "chi-square-tests-of-independence-and-homogeneity",
    title: t("Chi-Square Tests of Independence and Homogeneity", "卡方独立性与齐性检验"),
    summary: t(
      "For an $r \\times c$ contingency table, the expected frequency under independence is $E_{ij} = \\frac{R_i C_j}{N}$, where $R_i$ is the row total and $C_j$ the column total. The test statistic follows a chi-square distribution with $(r - 1)(c - 1)$ degrees of freedom.",
      "对于 $r \\times c$ 列联表，在独立性假设下各单元格的期望频数为 $E_{ij} = \\frac{R_i C_j}{N}$，其中 $R_i$ 为行合计，$C_j$ 为列合计。检验统计量服从自由度为 $(r - 1)(c - 1)$ 的卡方分布。",
    ),
    intro: t(
      "A survey asks $100$ people, $60$ adults and $40$ teenagers, whether they read the news daily, and $50$ say yes. Among the adults $36$ say yes and $24$ say no; among the teenagers $14$ say yes and $26$ say no. If reading is independent of age, the adult yes cell expects $\\frac{60 \\cdot 50}{100} = 30$, and the other cells expect $30$, $20$ and $20$. Every cell is $6$ away from its expected count, so $\\chi^2 = \\frac{36}{30} + \\frac{36}{30} + \\frac{36}{20} + \\frac{36}{20} = 6$ on $(2 - 1)(2 - 1) = 1$ degree of freedom, above the $5\\%$ critical value $3.841$.\n\nCheck: the shortcut $\\frac{N(ad - bc)^2}{R_1 R_2 C_1 C_2} = \\frac{100(36 \\cdot 26 - 24 \\cdot 14)^2}{60 \\cdot 40 \\cdot 50 \\cdot 50} = \\frac{100 \\cdot 600^2}{6000000} = 6$ agrees.\n\nIn this lesson we compute expected cell counts from the row and column totals, the statistic for a two-by-two table and the degrees of freedom of a test of independence.",
      "一项调查询问了 $100$ 人（$60$ 名成人和 $40$ 名青少年）是否每天看新闻，有 $50$ 人回答是。成人中 $36$ 人是、$24$ 人否；青少年中 $14$ 人是、$26$ 人否。若看新闻与年龄无关，成人回答是的单元格期望为 $\\frac{60 \\cdot 50}{100} = 30$，其余单元格期望为 $30$、$20$、$20$。每个单元格都与期望相差 $6$，所以 $\\chi^2 = \\frac{36}{30} + \\frac{36}{30} + \\frac{36}{20} + \\frac{36}{20} = 6$，自由度为 $(2 - 1)(2 - 1) = 1$，超过 $5\\%$ 临界值 $3.841$。\n\n检验：简便公式 $\\frac{N(ad - bc)^2}{R_1 R_2 C_1 C_2} = \\frac{100(36 \\cdot 26 - 24 \\cdot 14)^2}{60 \\cdot 40 \\cdot 50 \\cdot 50} = \\frac{100 \\cdot 600^2}{6000000} = 6$ 与之相符。\n\n本课我们由行合计与列合计求期望单元格频数，计算 2×2 表的统计量，并求出独立性检验的自由度。",
    ),
    prerequisites: ["introduction-to-chi-square-goodness-of-fit"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "contingency-table-expected-cell-calc",
        title: t("Computing expected cell frequency in a contingency table", "计算列联表中的期望单元格频数"),
        explanation: t(
          "If the row and column variables are independent, each cell should receive the row share times the column share of the total. The expected count in row $i$ and column $j$ is $E_{ij} = \\frac{R_i C_j}{N}$.\n\nWith $R_1 = 40$, $C_1 = 30$ and $N = 120$: $E_{11} = \\frac{40 \\cdot 30}{120} = 10$.\n\nCheck: the cell takes the same share of its row as the column takes of the table, $\\frac{10}{40} = \\frac{1}{4} = \\frac{30}{120}$.\n\n> **Watch out.** Multiply the two totals, do not add them: $\\frac{40 + 30}{120} = \\frac{7}{12}$ is not a count.",
          "如果行变量与列变量相互独立，每个格子应得到总数中行比例与列比例的乘积。第 $i$ 行第 $j$ 列的期望频数为 $E_{ij} = \\frac{R_i C_j}{N}$。\n\n若 $R_1 = 40$，$C_1 = 30$，$N = 120$：$E_{11} = \\frac{40 \\cdot 30}{120} = 10$。\n\n检验：该格占它所在行的比例与该列占全表的比例相同，$\\frac{10}{40} = \\frac{1}{4} = \\frac{30}{120}$。\n\n> **注意。** 两个合计要相乘，不能相加：$\\frac{40 + 30}{120} = \\frac{7}{12}$ 不是频数。",
        ),
        generate: (rng: Rng): Problem => {
          const r = rng.int(2, 4);
          const c = rng.int(2, 4);
          const df = (r - 1) * (c - 1);

          const rTotal = rng.int(30, 150);
          const cTotal = rng.int(30, 150);
          const grandTotal = rng.int(200, 600);

          const ans = Q.of(rTotal * cTotal, grandTotal);

          return numberProblem({
            prompt: t(
              `In an $r \\times c = ${r} \\times ${c}$ contingency table with grand total $N = ${grandTotal}$, row 1 has marginal total $R_1 = ${rTotal}$ and column 1 has marginal total $C_1 = ${cTotal}$. Under the null hypothesis of independence, find the exact rational value of the expected cell count $E_{11}$.`,
              `在总样本量为 $N = ${grandTotal}$ 的 $r \\times c = ${r} \\times ${c}$ 列联表中，第 1 行的边际合计为 $R_1 = ${rTotal}$，第 1 列的边际合计为 $C_1 = ${cTotal}$。在变量相互独立的原假设下，求期望单元格频数 $E_{11}$ 的精确有理数值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(rTotal + cTotal, grandTotal),
                "This adds the two totals; under independence the shares multiply.",
                "这把两个合计相加了；在独立性下各比例相乘。",
              ),
              why(
                Q.of(rTotal * cTotal, r * c),
                `This divides by the number of cells $${r * c}$ instead of the grand total $${grandTotal}$.`,
                `这除以了格子数 $${r * c}$，而不是总数 $${grandTotal}$。`,
              ),
              why(
                Q.of(rTotal, grandTotal),
                "This is the row's share of the table, a proportion, not yet multiplied by the column total.",
                "这是该行占全表的比例，还没有乘以列合计。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Multiply the totals", "把合计相乘"],
                  t(
                    `$R_1 C_1 = ${rTotal} \\cdot ${cTotal} = ${rTotal * cTotal}$.`,
                    `$R_1 C_1 = ${rTotal} \\cdot ${cTotal} = ${rTotal * cTotal}$。`,
                  ),
                ],
                [
                  ["Divide by the grand total", "除以总数"],
                  t(
                    `$E_{11} = \\frac{${rTotal * cTotal}}{${grandTotal}} = ${ans.toLatex()}$, in a table with $(${r} - 1)(${c} - 1) = ${df}$ degrees of freedom.`,
                    `$E_{11} = \\frac{${rTotal * cTotal}}{${grandTotal}} = ${ans.toLatex()}$，该表的自由度为 $(${r} - 1)(${c} - 1) = ${df}$。`,
                  ),
                ],
              ],
              t(
                `$\\frac{E_{11}}{${rTotal}} = ${Q.of(cTotal, grandTotal).toLatex()} = \\frac{${cTotal}}{${grandTotal}}$, the column's share of the table.`,
                `$\\frac{E_{11}}{${rTotal}} = ${Q.of(cTotal, grandTotal).toLatex()} = \\frac{${cTotal}}{${grandTotal}}$，正是该列占全表的比例。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-statistic-for-a-two-by-two-table",
        title: t("The statistic for a two-by-two table", "2×2 列联表的统计量"),
        explanation: t(
          "For a $2 \\times 2$ table with cells $a, b$ in the first row and $c, d$ in the second, every cell differs from its expected count by the same amount, $\\frac{|ad - bc|}{N}$. Adding the four terms $\\frac{(O - E)^2}{E}$ simplifies to\n\n$$\\chi^2 = \\frac{N(ad - bc)^2}{R_1 R_2 C_1 C_2},$$\n\nwith the row totals $R_1, R_2$, the column totals $C_1, C_2$ and $\\nu = (2 - 1)(2 - 1) = 1$ degree of freedom.\n\nFor $a, b = 36, 24$ and $c, d = 14, 26$: $N = 100$, $R_1, R_2 = 60, 40$, $C_1, C_2 = 50, 50$ and $ad - bc = 936 - 336 = 600$, so $\\chi^2 = \\frac{100 \\cdot 600^2}{60 \\cdot 40 \\cdot 50 \\cdot 50} = 6$.\n\nCheck: $E_{11} = \\frac{60 \\cdot 50}{100} = 30$, and $36 - 30 = 6 = \\frac{600}{100}$, the common gap.\n\n> **Watch out.** Multiply by $N$ and square $ad - bc$: $\\frac{600^2}{6000000} = 0.06$ forgets the factor $N = 100$.",
          "对于第一行为 $a, b$、第二行为 $c, d$ 的 $2 \\times 2$ 列联表，每个单元格与其期望频数之差的绝对值都相同，为 $\\frac{|ad - bc|}{N}$。把四项 $\\frac{(O - E)^2}{E}$ 相加可化简为\n\n$$\\chi^2 = \\frac{N(ad - bc)^2}{R_1 R_2 C_1 C_2},$$\n\n其中 $R_1, R_2$ 为行合计，$C_1, C_2$ 为列合计，自由度为 $\\nu = (2 - 1)(2 - 1) = 1$。\n\n若 $a, b = 36, 24$，$c, d = 14, 26$：$N = 100$，$R_1, R_2 = 60, 40$，$C_1, C_2 = 50, 50$，$ad - bc = 936 - 336 = 600$，所以 $\\chi^2 = \\frac{100 \\cdot 600^2}{60 \\cdot 40 \\cdot 50 \\cdot 50} = 6$。\n\n检验：$E_{11} = \\frac{60 \\cdot 50}{100} = 30$，而 $36 - 30 = 6 = \\frac{600}{100}$，正是共同的差。\n\n> **注意。** 要乘以 $N$ 并把 $ad - bc$ 平方：$\\frac{600^2}{6000000} = 0.06$ 漏掉了因子 $N = 100$。",
        ),
        generate: (rng: Rng): Problem => {
          for (;;) {
            const [a, b, c, d] = [rng.int(5, 40), rng.int(5, 40), rng.int(5, 40), rng.int(5, 40)];
            if (a * d === b * c) continue;
            const N = a + b + c + d;
            const [r1, r2, c1, c2] = [a + b, c + d, a + c, b + d];
            const diff = a * d - b * c;
            const prod = r1 * r2 * c1 * c2;
            const round2 = (num: number, den: number) => Q.of(Math.round((num * 100) / den), 100);
            const ans = round2(N * diff * diff, prod);
            if (ans.cmp(Q.of(1, 2)) < 0) continue;
            const mistakes = apart(ans, [
              why(
                round2(diff * diff, prod),
                `This leaves out the factor $N = ${N}$ in the numerator.`,
                `这漏掉了分子中的因子 $N = ${N}$。`,
              ),
              why(round2(N * Math.abs(diff), prod), "This forgets to square $ad - bc$.", "这忘了把 $ad - bc$ 平方。"),
              why(round2(N * N * diff * diff, prod), `This multiplies by $N = ${N}$ twice.`, `这乘了两次 $N = ${N}$。`),
            ]);
            if (mistakes.length < 2) continue;
            const table = `$$\\begin{array}{c|cc} & \\text{Yes} & \\text{No} \\\\ \\hline \\text{Group 1} & ${a} & ${b} \\\\ \\text{Group 2} & ${c} & ${d} \\end{array}$$`;
            const tableZh = `$$\\begin{array}{c|cc} & \\text{是} & \\text{否} \\\\ \\hline \\text{第 1 组} & ${a} & ${b} \\\\ \\text{第 2 组} & ${c} & ${d} \\end{array}$$`;
            const e11 = Q.of(r1 * c1, N);
            return numberProblem({
              prompt: t(
                `Find the chi-square statistic for independence in the table, rounded to two decimal places.${table}`,
                `求下表独立性检验的卡方统计量，精确到两位小数。${tableZh}`,
              ),
              answer: ans,
              form: "decimal",
              mistakes,
              solution: walked(
                [
                  [
                    ["Find the totals", "求合计"],
                    t(
                      `$R_1 = ${r1}$, $R_2 = ${r2}$, $C_1 = ${c1}$, $C_2 = ${c2}$ and $N = ${N}$.`,
                      `$R_1 = ${r1}$，$R_2 = ${r2}$，$C_1 = ${c1}$，$C_2 = ${c2}$，$N = ${N}$。`,
                    ),
                  ],
                  [
                    ["Find $ad - bc$", "求 $ad - bc$"],
                    t(`$${a} \\cdot ${d} - ${b} \\cdot ${c} = ${diff}$.`, `$${a} \\cdot ${d} - ${b} \\cdot ${c} = ${diff}$。`),
                  ],
                  [
                    ["Apply the formula", "代入公式"],
                    t(
                      `$\\chi^2 = \\frac{${N} \\cdot (${diff})^2}{${r1} \\cdot ${r2} \\cdot ${c1} \\cdot ${c2}} = \\frac{${N * diff * diff}}{${prod}} \\approx ${dec(ans)}$.`,
                      `$\\chi^2 = \\frac{${N} \\cdot (${diff})^2}{${r1} \\cdot ${r2} \\cdot ${c1} \\cdot ${c2}} = \\frac{${N * diff * diff}}{${prod}} \\approx ${dec(ans)}$。`,
                    ),
                  ],
                ],
                t(
                  `$E_{11} = \\frac{${r1} \\cdot ${c1}}{${N}} = ${e11.toLatex()}$, and $${a} - ${e11.toLatex()} = ${Q.of(diff, N).toLatex()} = \\frac{ad - bc}{N}$, the common gap of every cell.`,
                  `$E_{11} = \\frac{${r1} \\cdot ${c1}}{${N}} = ${e11.toLatex()}$，而 $${a} - ${e11.toLatex()} = ${Q.of(diff, N).toLatex()} = \\frac{ad - bc}{N}$，正是每个单元格共同的差。`,
                ),
              ),
            });
          }
        },
      },
    ],
  },

  // 10.33.7 Introduction to Order Statistics
  {
    id: "introduction-to-order-statistics",
    title: t("Introduction to Order Statistics", "顺序统计量导论"),
    summary: t(
      "When independent continuous random variables $X_1, \\dots, X_n$ are sorted as $X_{(1)} \\le X_{(2)} \\le \\cdots \\le X_{(n)}$, $X_{(k)}$ is the $k$-th order statistic. For standard uniform variables on $(0, 1)$, $E[X_{(k)}] = \\frac{k}{n + 1}$.",
      "把独立连续随机变量 $X_1, \\dots, X_n$ 按升序排列为 $X_{(1)} \\le X_{(2)} \\le \\cdots \\le X_{(n)}$，$X_{(k)}$ 称为第 $k$ 个顺序统计量。对于 $(0, 1)$ 上的标准均匀分布，$E[X_{(k)}] = \\frac{k}{n + 1}$。",
    ),
    intro: t(
      "Three independent values are drawn from $\\text{Uniform}(0, 1)$ and sorted as $X_{(1)} \\le X_{(2)} \\le X_{(3)}$. On average the three points cut $[0, 1]$ into four gaps of length $\\frac{1}{4}$, so $E[X_{(1)}] = \\frac{1}{4}$, $E[X_{(2)}] = \\frac{1}{2}$ and $E[X_{(3)}] = \\frac{3}{4}$. The largest is at most $\\frac{1}{2}$ only when all three are, which has probability $\\left(\\frac{1}{2}\\right)^{3} = \\frac{1}{8}$.\n\nCheck: sorting does not change the total, so $\\frac{1}{4} + \\frac{1}{2} + \\frac{3}{4} = \\frac{3}{2}$ equals the sum of the three unsorted means, $3 \\cdot \\frac{1}{2}$.\n\nIn this lesson we find the expected values of uniform order statistics and the probabilities that the maximum or minimum of a sample lies above or below a value.",
      "从 $\\text{Uniform}(0, 1)$ 中独立抽取三个值，排序为 $X_{(1)} \\le X_{(2)} \\le X_{(3)}$。平均而言三个点把 $[0, 1]$ 分成长度为 $\\frac{1}{4}$ 的四段，所以 $E[X_{(1)}] = \\frac{1}{4}$，$E[X_{(2)}] = \\frac{1}{2}$，$E[X_{(3)}] = \\frac{3}{4}$。最大值不超过 $\\frac{1}{2}$ 当且仅当三个值都不超过，概率为 $\\left(\\frac{1}{2}\\right)^{3} = \\frac{1}{8}$。\n\n检验：排序不改变总和，所以 $\\frac{1}{4} + \\frac{1}{2} + \\frac{3}{4} = \\frac{3}{2}$ 等于三个未排序值的均值之和 $3 \\cdot \\frac{1}{2}$。\n\n本课我们求均匀分布顺序统计量的期望，以及样本最大值或最小值高于或低于某个值的概率。",
    ),
    prerequisites: ["joint-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "uniform-order-statistic-expectation",
        title: t("Expected value of order statistics for standard uniform distribution", "标准均匀分布顺序统计量的数学期望"),
        explanation: t(
          "Sorted uniform values tend to divide the interval into equal gaps, so the expected value of the k-th smallest is k parts out of one more than the sample size. For i.i.d. $X_i \\sim \\text{Uniform}(0, 1)$, $E[X_{(k)}] = \\frac{k}{n + 1}$.\n\nFor $n = 4$ values, the four points make five gaps, so $E[X_{(1)}] = \\frac{1}{5}$ and $E[X_{(4)}] = \\frac{4}{5}$.\n\nCheck: by symmetry the $k$-th smallest and the $k$-th largest average to $\\frac{1}{2}$: $\\frac{1}{5} + \\frac{4}{5} = 1$.\n\n> **Watch out.** The denominator is $n + 1$, not $n$: $\\frac{4}{4} = 1$ would put the expected maximum at the very end, which no sample reaches.",
          "排序后的均匀取值倾向于把区间分成相等的间隔，所以第 k 小值的期望是样本量加 1 等份中的 k 份。对于独立同分布的 $X_i \\sim \\text{Uniform}(0, 1)$，$E[X_{(k)}] = \\frac{k}{n + 1}$。\n\n对 $n = 4$ 个值，四个点形成五段，所以 $E[X_{(1)}] = \\frac{1}{5}$，$E[X_{(4)}] = \\frac{4}{5}$。\n\n检验：由对称性，第 $k$ 小值与第 $k$ 大值的平均为 $\\frac{1}{2}$：$\\frac{1}{5} + \\frac{4}{5} = 1$。\n\n> **注意。** 分母是 $n + 1$ 而不是 $n$：$\\frac{4}{4} = 1$ 会把最大值的期望放在端点上，而样本永远到不了那里。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(3, 20);
          const k = rng.int(1, n);
          const ans = Q.of(k, n + 1);
          const mirror = Q.of(n + 1 - k, n + 1);

          return numberProblem({
            prompt: t(
              `Let $X_1, X_2, \\dots, X_{${n}}$ be a random sample of size $n = ${n}$ from the continuous uniform distribution on $[0, 1]$, arranged in increasing order $X_{(1)} \\le X_{(2)} \\le \\dots \\le X_{(${n})}$. Find the exact rational value of the expected value of the $k = ${k}$-th order statistic, $E[X_{(${k})}]$.`,
              `设 $X_1, X_2, \\dots, X_{${n}}$ 为来自 $[0, 1]$ 上连续均匀分布的容量为 $n = ${n}$ 的随机样本，按升序排列为 $X_{(1)} \\le X_{(2)} \\le \\dots \\le X_{(${n})}$。求第 $k = ${k}$ 个顺序统计量的数学期望 $E[X_{(${k})}]$ 的精确有理数值。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                Q.of(k, n),
                `This divides by $n = ${n}$; the ${n} points make $n + 1 = ${n + 1}$ gaps.`,
                `这除以了 $n = ${n}$；${n} 个点形成 $n + 1 = ${n + 1}$ 段。`,
              ),
              why(
                Q.of(k - 1, n),
                `This counts the $${k - 1}$ points below $X_{(${k})}$ instead of the $${k}$ gaps up to it.`,
                `这数的是 $X_{(${k})}$ 下方的 $${k - 1}$ 个点，而不是到它为止的 $${k}$ 段。`,
              ),
              why(
                Q.of(k + 1, n + 1),
                `This counts one gap too many; $X_{(${k})}$ ends the $${k}$-th gap.`,
                `这多数了一段；$X_{(${k})}$ 位于第 $${k}$ 段的末端。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Count the gaps", "数段数"],
                  t(
                    `$${n}$ points cut $[0, 1]$ into $${n + 1}$ gaps, each of expected length $\\frac{1}{${n + 1}}$.`,
                    `$${n}$ 个点把 $[0, 1]$ 分成 $${n + 1}$ 段，每段的期望长度为 $\\frac{1}{${n + 1}}$。`,
                  ),
                ],
                [
                  ["Add the gaps up to the point", "把到该点为止的段相加"],
                  t(
                    `$X_{(${k})}$ ends the $${k}$-th gap, so $E[X_{(${k})}] = \\frac{${k}}{${n + 1}}${ans.toLatex() === `\\frac{${k}}{${n + 1}}` ? "" : ` = ${ans.toLatex()}`}$.`,
                    `$X_{(${k})}$ 位于第 $${k}$ 段的末端，所以 $E[X_{(${k})}] = \\frac{${k}}{${n + 1}}${ans.toLatex() === `\\frac{${k}}{${n + 1}}` ? "" : ` = ${ans.toLatex()}`}$。`,
                  ),
                ],
              ],
              t(
                `The $${k}$-th largest has mean $${mirror.toLatex()}$, and $${ans.toLatex()} + ${mirror.toLatex()} = 1$, as symmetry requires.`,
                `第 $${k}$ 大值的均值为 $${mirror.toLatex()}$，而 $${ans.toLatex()} + ${mirror.toLatex()} = 1$，符合对称性。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-distribution-of-the-maximum-and-minimum",
        title: t("The distribution of the maximum and the minimum", "最大值与最小值的分布"),
        explanation: t(
          "The largest of $n$ independent values is at most $x$ exactly when every value is at most $x$, and the smallest exceeds $x$ exactly when every value exceeds $x$. With a common CDF $F$:\n\n$$P(X_{(n)} \\le x) = F(x)^{n}, \\qquad P(X_{(1)} > x) = \\big(1 - F(x)\\big)^{n}.$$\n\nFor $\\text{Uniform}(0, 1)$, $F(x) = x$: the maximum of $3$ values is at most $\\frac{1}{2}$ with probability $\\frac{1}{8}$, and the minimum is at most $\\frac{1}{2}$ with probability $1 - \\frac{1}{8} = \\frac{7}{8}$.\n\nCheck: the minimum is at most $\\frac{1}{2}$ unless all three values exceed $\\frac{1}{2}$, and that has probability $\\left(\\frac{1}{2}\\right)^{3} = \\frac{1}{8}$, so the two answers add to $1$.\n\n> **Watch out.** The minimum is at most $x$ when at least one value is, which is the complement of all values exceeding $x$; it is not $x^{n}$.",
          "$n$ 个独立值中的最大值不超过 $x$，当且仅当每个值都不超过 $x$；最小值大于 $x$，当且仅当每个值都大于 $x$。设共同的分布函数为 $F$：\n\n$$P(X_{(n)} \\le x) = F(x)^{n}, \\qquad P(X_{(1)} > x) = \\big(1 - F(x)\\big)^{n}.$$\n\n对 $\\text{Uniform}(0, 1)$，$F(x) = x$：$3$ 个值的最大值不超过 $\\frac{1}{2}$ 的概率为 $\\frac{1}{8}$，最小值不超过 $\\frac{1}{2}$ 的概率为 $1 - \\frac{1}{8} = \\frac{7}{8}$。\n\n检验：除非三个值都大于 $\\frac{1}{2}$，最小值都不超过 $\\frac{1}{2}$，而前者的概率为 $\\left(\\frac{1}{2}\\right)^{3} = \\frac{1}{8}$，两者之和为 $1$。\n\n> **注意。** 最小值不超过 $x$ 只需至少一个值不超过 $x$，它是“所有值都大于 $x$”的对立事件，而不是 $x^{n}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(2, 6);
          const den = rng.pick([2, 3, 4, 5]);
          const x = Q.of(rng.int(1, den - 1), den);
          const kind = rng.pick(["max-below", "max-above", "min-below", "min-above"] as const);
          const up = x.pow(n);
          const down = Q.one.sub(x).pow(n);
          const ans = kind === "max-below" ? up : kind === "max-above" ? Q.one.sub(up) : kind === "min-below" ? Q.one.sub(down) : down;
          const isMax = kind.startsWith("max");
          const below = kind.endsWith("below");
          const xl = x.toLatex();
          const event = `X_{(${isMax ? n : 1})} ${below ? "\\le" : ">"} ${xl}`;
          const line = isMax
            ? `P(X_{(${n})} \\le ${xl}) = \\left(${xl}\\right)^{${n}} = ${up.toLatex()}`
            : `P(X_{(1)} > ${xl}) = \\left(1 - ${xl}\\right)^{${n}} = ${down.toLatex()}`;
          const flip = (isMax && !below) || (!isMax && below);
          const base = isMax ? up : down;
          const other = Q.one.sub(ans);
          return numberProblem({
            prompt: t(
              `$X_1, \\dots, X_{${n}}$ are independent $\\text{Uniform}(0, 1)$ variables. Find $P(${event})$.`,
              `$X_1, \\dots, X_{${n}}$ 是相互独立的 $\\text{Uniform}(0, 1)$ 随机变量。求 $P(${event})$。`,
            ),
            answer: ans,
            mistakes: apart(
              ans,
              [
                why(
                  up,
                  `This is $P(X_{(${n})} \\le ${xl}) = \\left(${xl}\\right)^{${n}}$, the probability that every value is at most $${xl}$.`,
                  `这是 $P(X_{(${n})} \\le ${xl}) = \\left(${xl}\\right)^{${n}}$，即每个值都不超过 $${xl}$ 的概率。`,
                ),
                why(
                  down,
                  `This is $P(X_{(1)} > ${xl}) = \\left(1 - ${xl}\\right)^{${n}}$, the probability that every value exceeds $${xl}$.`,
                  `这是 $P(X_{(1)} > ${xl}) = \\left(1 - ${xl}\\right)^{${n}}$，即每个值都大于 $${xl}$ 的概率。`,
                ),
                why(
                  Q.one.sub(up),
                  `This is $P(X_{(${n})} > ${xl})$, the chance that at least one value exceeds $${xl}$.`,
                  `这是 $P(X_{(${n})} > ${xl})$，即至少一个值大于 $${xl}$ 的概率。`,
                ),
                why(
                  Q.one.sub(down),
                  `This is $P(X_{(1)} \\le ${xl})$, the chance that at least one value is at most $${xl}$.`,
                  `这是 $P(X_{(1)} \\le ${xl})$，即至少一个值不超过 $${xl}$ 的概率。`,
                ),
                why(
                  x,
                  `This is the probability for a single value; all $${n}$ values are involved.`,
                  `这是单个值的概率；这里涉及全部 $${n}$ 个值。`,
                ),
                why(
                  x.mul(Q.of(n)),
                  `This adds $${xl}$ once for each value; the probabilities of independent events multiply.`,
                  `这对每个值都加了一次 $${xl}$；独立事件的概率应当相乘。`,
                ),
              ].filter((w) => (w.value as Q).cmp(Q.one) <= 0),
            ),
            solution: walked(
              [
                [
                  [
                    isMax ? "Require every value to be at most $x$" : "Require every value to exceed $x$",
                    isMax ? "要求每个值都不超过 $x$" : "要求每个值都大于 $x$",
                  ],
                  t(
                    `The ${isMax ? "maximum is at most" : "minimum exceeds"} $${xl}$ exactly when every $X_i$ ${isMax ? "is" : "does"}, so $${line}$.`,
                    `${isMax ? "最大值不超过" : "最小值大于"} $${xl}$，当且仅当每个 $X_i$ 都${isMax ? "不超过" : "大于"}它，所以 $${line}$。`,
                  ),
                ],
                ...(flip
                  ? [
                      [
                        ["Take the complement", "取对立事件"],
                        t(
                          `The event asked for is the complement, so $1 - ${base.toLatex()} = ${ans.toLatex()}$.`,
                          `所求事件是它的对立事件，所以 $1 - ${base.toLatex()} = ${ans.toLatex()}$。`,
                        ),
                      ] as const,
                    ]
                  : []),
              ],
              t(
                `The opposite event has probability $${other.toLatex()}$, and $${ans.toLatex()} + ${other.toLatex()} = 1$.`,
                `对立事件的概率为 $${other.toLatex()}$，而 $${ans.toLatex()} + ${other.toLatex()} = 1$。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
