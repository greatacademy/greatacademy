import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem, reasonChoice, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** Mistake is a value a typical mistake produces, with what to say about it. */
type Mistake = ReturnType<typeof why>;

/** asQ reads a value as an exact number. */
const asQ = (v: Mistake["value"]) => (v instanceof Q ? v : Q.of(v));

/** distinct keeps the mistakes that differ from the answer, each value once. */
const distinct = (answer: Mistake["value"], ms: readonly Mistake[]): Mistake[] =>
  ms.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && ms.findIndex((o) => asQ(o.value).eq(asQ(m.value))) === i);

/** PHI holds the standard normal cumulative probabilities the problems quote. */
const PHI = new Map<number, string>([
  [0, "0.5"],
  [0.5, "0.6915"],
  [1, "0.8413"],
  [1.5, "0.9332"],
  [2, "0.9772"],
  [2.5, "0.9938"],
]);

/** phi is the standard normal cumulative probability at a tabulated z. */
const phi = (z: number): Q => (z < 0 ? Q.one.sub(phi(-z)) : Q.parse(PHI.get(z) ?? "0.5"));

/** PHI_TABLE quotes the tabulated values for a prompt. */
const PHI_TABLE: Text = t(
  "$\\Phi(0.5) = 0.6915$, $\\Phi(1) = 0.8413$, $\\Phi(1.5) = 0.9332$, $\\Phi(2) = 0.9772$, $\\Phi(2.5) = 0.9938$",
  " $\\Phi(0.5) = 0.6915$，$\\Phi(1) = 0.8413$，$\\Phi(1.5) = 0.9332$，$\\Phi(2) = 0.9772$，$\\Phi(2.5) = 0.9938$",
);

/** round2 rounds a measured value to two decimal places. */
const round2 = (x: number): Q => Q.of(Math.round(x * 100), 100);

/** Topics for Unit 8: Hypothesis Testing (new topics). */
export const probabilityAndStatisticsHypothesisTestingTopics: TopicDef[] = [
  // 8.28.1 Introduction to Hypothesis Testing
  {
    id: "introduction-to-hypothesis-testing",
    title: t("Introduction to Hypothesis Testing", "假设检验导论"),
    summary: t(
      "In hypothesis testing, the null hypothesis $H_0$ is the default position of no effect or no difference, and the alternative hypothesis $H_1$ is the claim being tested.",
      "在假设检验中，原假设 $H_0$ 代表无效应或无差异的默认立场，备择假设 $H_1$ 代表待检验的断言。",
    ),
    intro: t(
      "A factory claims its bags of rice weigh $5$ kg on average, and an inspector suspects they weigh less. The test starts from the claim, $H_0: \\mu = 5$, and looks for evidence of the suspicion, $H_1: \\mu < 5$. Only a sample mean far enough below $5$ counts as that evidence.\n\nCheck: the equality sits in $H_0$, and the direction of the suspicion sits in $H_1$.\n\nIn this lesson we write the two hypotheses for a claim, choose the direction of the alternative and name the outcome of a test.",
      "工厂声称其大米每袋平均重 $5$ 千克，检查员怀疑它们更轻。检验从这一声称出发，$H_0: \\mu = 5$，寻找支持怀疑的证据，$H_1: \\mu < 5$。只有样本均值比 $5$ 低得足够多，才算这样的证据。\n\n检验：等号在 $H_0$ 中，怀疑的方向在 $H_1$ 中。\n\n本课我们为一个论断写出两个假设，确定备择假设的方向，并说出检验结果的名称。",
    ),
    prerequisites: ["the-central-limit-theorem"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "formulating-null-and-alternative-hypotheses",
        title: t("Formulating null and alternative hypotheses", "建立原假设与备择假设"),
        explanation: t(
          "The null hypothesis always includes equality ($H_0: \\mu = \\mu_0$). The alternative hypothesis states the direction of the effect: two-tailed ($\\mu \\ne \\mu_0$), right-tailed ($\\mu > \\mu_0$), or left-tailed ($\\mu < \\mu_0$). To test whether a mean lifetime of $10000$ hours has been exceeded, write $H_0: \\mu = 10000$ and $H_1: \\mu > 10000$.\n\n> **Watch out.** Hypotheses are about the population mean $\\mu$, never the sample mean $\\bar{x}$, and the equality always goes in $H_0$.",
          "原假设始终包含等号（$H_0: \\mu = \\mu_0$）。备择假设指明效应方向：双尾（$\\mu \\ne \\mu_0$）、右尾（$\\mu > \\mu_0$）或左尾（$\\mu < \\mu_0$）。要检验平均寿命是否超过 $10000$ 小时，写 $H_0: \\mu = 10000$，$H_1: \\mu > 10000$。\n\n> **注意。** 假设针对的是总体均值 $\\mu$，绝不是样本均值 $\\bar{x}$；等号总是放在 $H_0$ 中。",
        ),
        generate: (rng: Rng): Problem => {
          const mu0 = rng.int(20, 300);
          const contexts = [
            {
              itemEn: "battery lifespan in hours",
              itemZh: "电池寿命（小时）",
              claimEn: "greater than",
              claimZh: "大于",
              dir: ">",
            },
            {
              itemEn: "mean tensile strength in MPa",
              itemZh: "平均抗拉强度（MPa）",
              claimEn: "less than",
              claimZh: "小于",
              dir: "<",
            },
            {
              itemEn: "daily production yield",
              itemZh: "日均产量",
              claimEn: "different from",
              claimZh: "不同于",
              dir: "\\neq",
            },
            {
              itemEn: "average customer wait time in seconds",
              itemZh: "客户平均等待时间（秒）",
              claimEn: "less than",
              claimZh: "小于",
              dir: "<",
            },
            {
              itemEn: "mean volume filled per bottle in mL",
              itemZh: "每瓶平均灌装量（mL）",
              claimEn: "different from",
              claimZh: "不同于",
              dir: "\\neq",
            },
            {
              itemEn: "average fuel efficiency in mpg",
              itemZh: "平均燃油效率（mpg）",
              claimEn: "greater than",
              claimZh: "大于",
              dir: ">",
            },
          ];
          const ctx = rng.pick(contexts);

          const correctH1 = `H_1: \\mu ${ctx.dir} ${mu0}`;
          const wrongH1_opposite = ctx.dir === ">" ? `H_1: \\mu < ${mu0}` : ctx.dir === "<" ? `H_1: \\mu > ${mu0}` : `H_1: \\mu > ${mu0}`;
          const wrongH0_ineq = `H_0: \\mu ${ctx.dir} ${mu0}, \\quad H_1: \\mu = ${mu0}`;
          const wrongSample = `H_0: \\bar{x} = ${mu0}, \\quad H_1: \\bar{x} ${ctx.dir} ${mu0}`;

          const opts = [
            t(`$H_0: \\mu = ${mu0}, \\quad ${correctH1}$`, `$H_0: \\mu = ${mu0}, \\quad ${correctH1}$`),
            t(`$H_0: \\mu = ${mu0}, \\quad ${wrongH1_opposite}$`, `$H_0: \\mu = ${mu0}, \\quad ${wrongH1_opposite}$`),
            t(`$${wrongH0_ineq}$`, `$${wrongH0_ineq}$`),
            t(`$${wrongSample}$`, `$${wrongSample}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return reasoned(
            choiceProblem({
              prompt: t(
                `A researcher tests whether the population mean $\\mu$ of ${ctx.itemEn} is ${ctx.claimEn} ${mu0}. Which pair of hypotheses correctly formulates this statistical test?`,
                `研究人员想检验${ctx.itemZh}的总体均值 $\\mu$ 是否${ctx.claimZh} ${mu0}。哪一对假设正确地建立了该统计检验？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["State the equality", "写出等式"],
                    t(
                      `The null hypothesis states equality with the hypothesized value: $H_0: \\mu = ${mu0}$.`,
                      `原假设陈述与假设值相等：$H_0: \\mu = ${mu0}$。`,
                    ),
                  ],
                  [
                    ["State the claim", "写出论断"],
                    t(
                      `The claim "${ctx.claimEn} ${mu0}" becomes the alternative: $${correctH1}$.`,
                      `论断“${ctx.claimZh} ${mu0}”成为备择假设：$${correctH1}$。`,
                    ),
                  ],
                ],
                t(
                  `Both hypotheses are about the population mean $\\mu$, the equality is in $H_0$, and $H_1$ points in the direction of the claim.`,
                  `两个假设都针对总体均值 $\\mu$，等号在 $H_0$ 中，$H_1$ 指向论断的方向。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                ctx.dir === "\\neq"
                  ? `That is one-sided, but "different from" allows a difference in either direction.`
                  : "That points the alternative in the opposite direction to the claim.",
                ctx.dir === "\\neq" ? "那是单侧的，但“不同于”允许任一方向的差异。" : "那把备择假设的方向弄反了。",
              ],
              [
                opts[2]!.en,
                "That swaps the roles: the equality belongs in $H_0$, not $H_1$.",
                "那把角色弄反了：等号属于 $H_0$，不属于 $H_1$。",
              ],
              [
                opts[3]!.en,
                "That states the hypotheses about the sample mean $\\bar{x}$, which is already known; they must be about $\\mu$.",
                "那是关于样本均值 $\\bar{x}$ 的假设，而它已经知道；假设必须针对 $\\mu$。",
              ],
            ],
          );
        },
      },
      {
        id: "choosing-the-direction-of-the-alternative",
        title: t("Choosing the direction of the alternative", "确定备择假设的方向"),
        explanation: t(
          'The wording of the claim decides the alternative hypothesis, and with it the tail of the test:\n\n- "increased", "more than", "exceeds": right-tailed, $H_1: \\mu > \\mu_0$;\n- "decreased", "less than", "falls short": left-tailed, $H_1: \\mu < \\mu_0$;\n- "differs", "changed", "is not equal to": two-tailed, $H_1: \\mu \\neq \\mu_0$.\n\nThe null hypothesis always contains the equality $\\mu = \\mu_0$. Choose the direction before looking at the data; picking it afterwards to match the sample doubles the real chance of a false rejection. The claim that a mean of $2500$ calories "falls short" gives $H_1: \\mu < 2500$, a left-tailed test.\n\n> **Watch out.** $H_1: \\mu = \\mu_0$ is never an alternative: the equality is the null hypothesis. And "changed" names no direction, so it is two-tailed.',
          "论断的措辞决定备择假设，也就决定了检验的尾部：\n\n- “增加”“多于”“超过”：右侧检验，$H_1: \\mu > \\mu_0$；\n- “减少”“少于”“不足”：左侧检验，$H_1: \\mu < \\mu_0$；\n- “不同”“改变”“不等于”：双侧检验，$H_1: \\mu \\neq \\mu_0$。\n\n原假设总是包含等号 $\\mu = \\mu_0$。方向要在看数据之前确定；看了样本再选方向，会使错误拒绝的实际概率加倍。论断平均 $2500$ 卡路里“不足”，给出 $H_1: \\mu < 2500$，是左侧检验。\n\n> **注意。** $H_1: \\mu = \\mu_0$ 永远不是备择假设：等式是原假设。“改变”没有指明方向，所以是双侧检验。",
        ),
        generate: (rng: Rng): Problem => {
          const item = rng.pick([
            ["the mean delivery time (minutes)", "平均送达时间（分钟）"],
            ["the mean battery life (hours)", "电池平均续航（小时）"],
            ["the mean score on a reading test", "阅读测验的平均分"],
            ["the mean weight of a bag of rice (kg)", "一袋大米的平均重量（千克）"],
            ["the mean waiting time at a clinic (minutes)", "诊所的平均等候时间（分钟）"],
          ] as const);
          const claim = rng.pick([
            ["has increased from", "已经超过原来的", 0],
            ["is more than", "大于", 0],
            ["has decreased from", "已经低于原来的", 1],
            ["is less than", "小于", 1],
            ["has changed from", "已经不再等于原来的", 2],
            ["differs from", "不等于", 2],
          ] as const);
          const mu0 = rng.int(10, 99);
          const options = [
            t(`$H_1: \\mu > ${mu0}$ (right-tailed)`, `$H_1: \\mu > ${mu0}$（右侧检验）`),
            t(`$H_1: \\mu < ${mu0}$ (left-tailed)`, `$H_1: \\mu < ${mu0}$（左侧检验）`),
            t(`$H_1: \\mu \\neq ${mu0}$ (two-tailed)`, `$H_1: \\mu \\neq ${mu0}$（双侧检验）`),
            t(`$H_1: \\mu = ${mu0}$`, `$H_1: \\mu = ${mu0}$`),
          ];
          const pointing = [
            ["That points above the value, but the claim does not.", "那指向大于该值，但论断并非如此。"],
            ["That points below the value, but the claim does not.", "那指向小于该值，但论断并非如此。"],
            ["That allows both directions, but the claim names one.", "那允许两个方向，但论断只指明了一个方向。"],
          ] as const;
          return reasoned(
            choiceProblem({
              prompt: t(
                `An analyst wants to test the claim that ${item[0]} ${claim[0]} $${mu0}$. Which alternative hypothesis should the test use?`,
                `一位分析师想检验这样的论断：${item[1]}${claim[1]} $${mu0}$。检验应采用哪个备择假设？`,
              ),
              options,
              correct: claim[2],
              solution: walked(
                [
                  [
                    ["Read the direction", "读出方向"],
                    t(
                      `The claim "${claim[0]}" points ${["above", "below", "away from"][claim[2]]} $${mu0}$.`,
                      `“${claim[1]}”指向${["大于", "小于", "不等于"][claim[2]]} $${mu0}$。`,
                    ),
                  ],
                  [
                    ["Write the hypotheses", "写出假设"],
                    t(
                      `So $H_0: \\mu = ${mu0}$ and $H_1: \\mu ${[">", "<", "\\neq"][claim[2]]} ${mu0}$.`,
                      `所以 $H_0: \\mu = ${mu0}$，$H_1: \\mu ${[">", "<", "\\neq"][claim[2]]} ${mu0}$。`,
                    ),
                  ],
                ],
                t(
                  "The equality is in $H_0$, and $H_1$ is the claim the analyst wants evidence for.",
                  "等号在 $H_0$ 中，$H_1$ 正是分析师想找证据支持的论断。",
                ),
              ),
            }),
            [
              ...[0, 1, 2].map((i): [string, string, string] => [options[i]!.en, pointing[i]![0], pointing[i]![1]]),
              [
                options[3]!.en,
                "The equality is the null hypothesis; an alternative never states it.",
                "等式是原假设；备择假设从不写等式。",
              ],
            ],
          );
        },
      },
    ],
  },

  // 8.28.2 Hypothesis Tests for the Rate of a Poisson Distribution
  {
    id: "hypothesis-tests-for-the-rate-of-a-poisson-distribution",
    title: t("Hypothesis Tests for the Rate of a Poisson Distribution", "泊松分布发生率的假设检验"),
    summary: t(
      "For a total count $K \\sim \\text{Poisson}(n\\lambda)$ over $n$ intervals, test $H_0: \\lambda = \\lambda_0$ with large $n\\lambda_0$ using $Z = \\frac{K - n\\lambda_0}{\\sqrt{n\\lambda_0}}$.",
      "若 $n$ 个区间内的总事件数 $K \\sim \\text{Poisson}(n\\lambda)$，在 $n\\lambda_0$ 较大时用 $Z = \\frac{K - n\\lambda_0}{\\sqrt{n\\lambda_0}}$ 检验 $H_0: \\lambda = \\lambda_0$。",
    ),
    intro: t(
      "A call centre usually receives $8$ calls an hour. Over $50$ hours it receives $440$ calls, against the $50 \\cdot 8 = 400$ expected. A Poisson count has variance equal to its mean, so the standard deviation is $\\sqrt{400} = 20$, and $z = \\frac{440 - 400}{20} = 2$.\n\nCheck: $400 + 2 \\cdot 20 = 440$, the observed count.\n\nIn this lesson we standardize a Poisson count, find an exact Poisson $p$-value and find the smallest count that rejects a rate.",
      "某呼叫中心通常每小时接到 $8$ 个电话。$50$ 小时内共接到 $440$ 个，而期望为 $50 \\cdot 8 = 400$ 个。泊松计数的方差等于均值，所以标准差为 $\\sqrt{400} = 20$，$z = \\frac{440 - 400}{20} = 2$。\n\n检验：$400 + 2 \\cdot 20 = 440$，正是观测计数。\n\n本课我们把泊松计数标准化，求精确的泊松 $p$ 值，并求拒绝某个发生率的最小计数。",
    ),
    prerequisites: ["introduction-to-hypothesis-testing", "the-poisson-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "poisson-normal-test-statistic",
        title: t("Computing the standardized test statistic for Poisson rate", "计算泊松发生率的标准化检验统计量"),
        explanation: t(
          "Under the null hypothesis the total count has mean and variance both equal to the expected count, so standardize with its square root. Under $H_0$, $E[K] = n\\lambda_0$ and $\\operatorname{Var}(K) = n\\lambda_0$, so $Z = \\frac{K - n\\lambda_0}{\\sqrt{n\\lambda_0}}$. With $n = 100$ periods, $\\lambda_0 = 25$ and $K = 2450$, the expected count is $2500$ and $z = \\frac{2450 - 2500}{50} = -1$.\n\n> **Watch out.** Divide by the standard deviation $\\sqrt{n\\lambda_0}$, not by the variance $n\\lambda_0$, and keep the sign of $K - n\\lambda_0$.",
          "在原假设下，总计数的均值和方差都等于期望计数，所以用它的平方根来标准化。在 $H_0$ 下，$E[K] = n\\lambda_0$ 且 $\\operatorname{Var}(K) = n\\lambda_0$，故 $Z = \\frac{K - n\\lambda_0}{\\sqrt{n\\lambda_0}}$。若 $n = 100$ 个时段，$\\lambda_0 = 25$，$K = 2450$，则期望计数为 $2500$，$z = \\frac{2450 - 2500}{50} = -1$。\n\n> **注意。** 要除以标准差 $\\sqrt{n\\lambda_0}$，而不是方差 $n\\lambda_0$；还要保留 $K - n\\lambda_0$ 的符号。",
        ),
        generate: (rng: Rng): Problem => {
          const m = rng.int(4, 15);
          const expected = m * m;
          const possibleN = [1, 2, 4, 5, 10, 20, 25, 50].filter((div) => expected % div === 0 && expected / div >= 1);
          const n = rng.pick(possibleN.length > 0 ? possibleN : [1]);
          const lambda0 = expected / n;

          const d = rng.pick([-3, -2, -1, 1, 2, 3]);
          const k = expected + d * m;
          const z = d;

          return numberProblem({
            prompt: t(
              `Over $n = ${n}$ observation periods, a total of $K = ${k}$ events are observed. Test $H_0: \\lambda = ${lambda0}$ against $H_1: \\lambda \\neq ${lambda0}$. Compute the standardized test statistic $z$.`,
              `在 $n = ${n}$ 个观测周期内，共观测到 $K = ${k}$ 次事件。检验 $H_0: \\lambda = ${lambda0}$ 对 $H_1: \\lambda \\neq ${lambda0}$。计算标准化检验统计量 $z$。`,
            ),
            answer: z,
            mistakes: distinct(z, [
              why(
                d * m,
                "That is $K - n\\lambda_0$ before dividing by the standard deviation.",
                "那是 $K - n\\lambda_0$，还没有除以标准差。",
              ),
              why(
                -d,
                `That flips the sign; $K = ${k}$ is ${d > 0 ? "above" : "below"} the expected count.`,
                `那弄反了符号；$K = ${k}$ ${d > 0 ? "高于" : "低于"}期望计数。`,
              ),
              why(
                Q.of(d, m),
                "That divides by the variance $n\\lambda_0$ instead of its square root.",
                "那是除以了方差 $n\\lambda_0$，而不是它的平方根。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the expected count", "求期望计数"],
                  t(
                    `Under $H_0$, $n\\lambda_0 = ${n} \\times ${lambda0} = ${expected}$, which is also the variance of $K$.`,
                    `在 $H_0$ 下，$n\\lambda_0 = ${n} \\times ${lambda0} = ${expected}$，它也是 $K$ 的方差。`,
                  ),
                ],
                [
                  ["Standardize", "标准化"],
                  t(
                    `$\\sqrt{${expected}} = ${m}$, so $z = \\frac{${k} - ${expected}}{${m}} = \\frac{${d * m}}{${m}} = ${z}$.`,
                    `$\\sqrt{${expected}} = ${m}$，所以 $z = \\frac{${k} - ${expected}}{${m}} = \\frac{${d * m}}{${m}} = ${z}$。`,
                  ),
                ],
              ],
              t(
                `$${expected} ${z < 0 ? "-" : "+"} ${Math.abs(z) === 1 ? "" : `${Math.abs(z)} \\cdot `}${m} = ${k}$, the observed total.`,
                `$${expected} ${z < 0 ? "-" : "+"} ${Math.abs(z) === 1 ? "" : `${Math.abs(z)} \\cdot `}${m} = ${k}$，正是观测总数。`,
              ),
            ),
          });
        },
      },
      {
        id: "an-exact-poisson-p-value",
        title: t("An exact Poisson $p$-value", "精确的泊松 $p$ 值"),
        explanation: t(
          "When $n\\lambda_0$ is small the normal approximation is poor, and the $p$-value comes straight from the Poisson distribution. For $H_1: \\lambda > \\lambda_0$ and an observed total $k$,\n\n$$p = P(K \\ge k) = 1 - \\sum_{j=0}^{k-1} e^{-n\\lambda_0}\\frac{(n\\lambda_0)^{j}}{j!}.$$\n\nInclude $k$ itself in the tail: the $p$-value is the probability of a result **at least** as extreme as the one observed. With $n\\lambda_0 = 2$ and $k = 5$: $1 - e^{-2}(1 + 2 + 2 + \\tfrac{4}{3} + \\tfrac{2}{3}) = 1 - 7e^{-2} \\approx 0.0527$. With $n\\lambda_0 = 6$ and $k = 12$, the sum runs to $j = 11$ and $p \\approx 0.0201$.\n\n> **Watch out.** Sum only up to $k - 1$, so that $K = k$ stays in the tail; summing to $k$ gives $P(K \\ge k + 1)$, which is too small.",
          "当 $n\\lambda_0$ 较小时，正态近似效果差，$p$ 值要直接由泊松分布计算。对于 $H_1: \\lambda > \\lambda_0$ 和观测总数 $k$，\n\n$$p = P(K \\ge k) = 1 - \\sum_{j=0}^{k-1} e^{-n\\lambda_0}\\frac{(n\\lambda_0)^{j}}{j!}.$$\n\n尾部要包括 $k$ 本身：$p$ 值是出现**至少**与观测结果一样极端的结果的概率。若 $n\\lambda_0 = 2$，$k = 5$：$1 - e^{-2}(1 + 2 + 2 + \\tfrac{4}{3} + \\tfrac{2}{3}) = 1 - 7e^{-2} \\approx 0.0527$。若 $n\\lambda_0 = 6$，$k = 12$，求和到 $j = 11$，$p \\approx 0.0201$。\n\n> **注意。** 只求和到 $k - 1$，使 $K = k$ 留在尾部中；求和到 $k$ 得到的是 $P(K \\ge k + 1)$，偏小。",
        ),
        generate: (rng: Rng): Problem => {
          const m = rng.int(1, 4);
          const n = rng.pick([4, 5, 10]);
          const lambda0 = Q.of(m, n);
          const k = m + rng.int(2, 5);
          const pmf = (j: number): number => {
            let v = Math.exp(-m);
            for (let i = 1; i <= j; i++) v *= m / i;
            return v;
          };
          const below = (c: number): number => {
            let s = 0;
            for (let j = 0; j < c; j++) s += pmf(j);
            return s;
          };
          const r4 = (x: number): Q => Q.of(Math.round(x * 10000), 10000);
          const ans = r4(1 - below(k));
          return numberProblem({
            prompt: t(
              `Events are counted over $n = ${n}$ periods. Under $H_0: \\lambda = ${dec(lambda0)}$ per period, the total $K$ is Poisson with mean $n\\lambda_0$. A total of $k = ${k}$ events is observed. Find the exact $p$-value for $H_1: \\lambda > ${dec(lambda0)}$, rounded to four decimal places.`,
              `在 $n = ${n}$ 个时段内计数事件。在 $H_0: \\lambda = ${dec(lambda0)}$（每时段）下，总数 $K$ 服从均值为 $n\\lambda_0$ 的泊松分布。观测到总数 $k = ${k}$。求对 $H_1: \\lambda > ${dec(lambda0)}$ 的精确 $p$ 值，精确到四位小数。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: distinct(ans, [
              why(
                r4(1 - below(k + 1)),
                `That is $P(K \\ge ${k + 1})$; the observed $k = ${k}$ belongs in the tail.`,
                `那是 $P(K \\ge ${k + 1})$；观测值 $k = ${k}$ 应在尾部中。`,
              ),
              why(
                r4(pmf(k)),
                `That is only $P(K = ${k})$; the $p$-value takes every count from $${k}$ up.`,
                `那只是 $P(K = ${k})$；$p$ 值要包括从 $${k}$ 起的所有计数。`,
              ),
              why(r4(below(k)), `That is $P(K < ${k})$, the opposite tail.`, `那是 $P(K < ${k})$，即另一侧的尾部。`),
            ]),
            solution: walked(
              [
                [
                  ["Find the Poisson mean", "求泊松均值"],
                  t(`$n\\lambda_0 = ${n}(${dec(lambda0)}) = ${m}$.`, `$n\\lambda_0 = ${n}(${dec(lambda0)}) = ${m}$。`),
                ],
                [
                  ["Add the counts below k", "加上小于观测值的计数"],
                  t(
                    `$P(K \\le ${k - 1}) = \\sum_{j=0}^{${k - 1}} e^{-${m}}\\frac{${m}^{j}}{j!} \\approx ${below(k).toFixed(4)}$.`,
                    `$P(K \\le ${k - 1}) = \\sum_{j=0}^{${k - 1}} e^{-${m}}\\frac{${m}^{j}}{j!} \\approx ${below(k).toFixed(4)}$。`,
                  ),
                ],
                [
                  ["Take the complement", "取补"],
                  t(
                    `$p = P(K \\ge ${k}) = 1 - ${below(k).toFixed(4)} \\approx ${dec(ans)}$.`,
                    `$p = P(K \\ge ${k}) = 1 - ${below(k).toFixed(4)} \\approx ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `The tail includes $K = ${k}$ itself, so $p \\approx ${dec(ans)}$ is at least $P(K = ${k}) \\approx ${pmf(k).toFixed(4)}$.`,
                `尾部包括 $K = ${k}$ 本身，所以 $p \\approx ${dec(ans)}$ 不小于 $P(K = ${k}) \\approx ${pmf(k).toFixed(4)}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 8.28.3 Critical Regions for Left-Tailed Hypothesis Tests
  {
    id: "critical-regions-for-left-tailed-hypothesis-tests",
    title: t("Critical Regions for Left-Tailed Hypothesis Tests", "左尾假设检验的临界区域"),
    summary: t(
      "In a left-tailed test at significance level $\\alpha$, the critical region is $Z \\le -z_\\alpha$; $H_0$ is rejected if the test statistic falls in it.",
      "在显著性水平为 $\\alpha$ 的左尾检验中，临界域为 $Z \\le -z_\\alpha$；检验统计量落入其中则拒绝 $H_0$。",
    ),
    intro: t(
      "A machine is set to fill bottles with a mean of $500$ mL, with $\\sigma = 10$ mL. A sample of $n = 25$ bottles has $\\bar{x} = 496$, and the test is $H_1: \\mu < 500$ at $\\alpha = 0.05$. The standard error is $\\frac{10}{5} = 2$, so $z = \\frac{496 - 500}{2} = -2$, which is at most $-1.645$: reject $H_0$.\n\nCheck: the boundary sample mean is $500 - 1.645 \\cdot 2 = 496.71$, and $496$ lies below it.\n\nIn this lesson we decide a left-tailed test, find the sample mean below which it rejects and find the power of a left-tailed test.",
      "某机器设定每瓶平均灌装 $500$ 毫升，$\\sigma = 10$ 毫升。$n = 25$ 瓶的样本有 $\\bar{x} = 496$，在 $\\alpha = 0.05$ 下检验 $H_1: \\mu < 500$。标准误为 $\\frac{10}{5} = 2$，所以 $z = \\frac{496 - 500}{2} = -2$，不大于 $-1.645$：拒绝 $H_0$。\n\n检验：临界样本均值为 $500 - 1.645 \\cdot 2 = 496.71$，而 $496$ 在它下方。\n\n本课我们对左尾检验作出决策，求出低于何值时拒绝的样本均值，并求左尾检验的功效。",
    ),
    prerequisites: ["introduction-to-hypothesis-testing", "percentage-points-of-the-standard-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-left-tailed-critical-region",
        title: t("Evaluating left-tailed test decisions", "评估左尾检验的决策"),
        explanation: t(
          "A left tailed test looks for evidence that the parameter is smaller than claimed, so only a statistic far enough to the left leads to rejection. If $z_{\\text{calc}} \\le -z_\\alpha$, reject $H_0$; otherwise fail to reject $H_0$. At $\\alpha = 0.005$ the critical value is $-2.576$, so $z = -2.4$ does not reject: it lies to the right of $-2.576$.\n\n> **Watch out.** Compare the signed values. $-2.4$ is greater than $-2.576$, so it is outside the region, even though $2.4 < 2.576$.",
          "左尾检验寻找参数小于声称值的证据，所以只有统计量足够靠左时才拒绝原假设。若 $z_{\\text{calc}} \\le -z_\\alpha$，则拒绝 $H_0$；否则不拒绝 $H_0$。$\\alpha = 0.005$ 时临界值为 $-2.576$，所以 $z = -2.4$ 不拒绝：它在 $-2.576$ 的右侧。\n\n> **注意。** 要比较带符号的值。$-2.4$ 大于 $-2.576$，所以在拒绝域之外，尽管 $2.4 < 2.576$。",
        ),
        generate: (rng: Rng): Problem => {
          const levels = [
            { alpha: "0.05", zCrit: -1.645 },
            { alpha: "0.01", zCrit: -2.326 },
            { alpha: "0.025", zCrit: -1.96 },
            { alpha: "0.10", zCrit: -1.282 },
          ];
          const lvl = rng.pick(levels);
          const isReject = rng.bool();
          const delta = rng.int(5, 80) / 100;
          const zCalc = Number((isReject ? lvl.zCrit - delta : lvl.zCrit + delta).toFixed(3));

          const correctDecision = isReject
            ? t(`Reject $H_0$ because $z = ${zCalc} \\le ${lvl.zCrit}$.`, `拒绝 $H_0$，因为 $z = ${zCalc} \\le ${lvl.zCrit}$。`)
            : t(`Fail to reject $H_0$ because $z = ${zCalc} > ${lvl.zCrit}$.`, `不拒绝 $H_0$，因为 $z = ${zCalc} > ${lvl.zCrit}$。`);
          const wrongDecision1 = isReject
            ? t(`Fail to reject $H_0$ because $z = ${zCalc} \\le ${lvl.zCrit}$.`, `不拒绝 $H_0$，因为 $z = ${zCalc} \\le ${lvl.zCrit}$。`)
            : t(`Reject $H_0$ because $z = ${zCalc} > ${lvl.zCrit}$.`, `拒绝 $H_0$，因为 $z = ${zCalc} > ${lvl.zCrit}$。`);
          const wrongDecision2 = t(`Accept $H_1$ as proven with certainty.`, `肯定地证明并接受 $H_1$ 为绝对真理。`);
          const wrongDecision3 = t(`Reject both $H_0$ and $H_1$ because $z$ is negative.`, `由于 $z$ 为负数，同时拒绝 $H_0$ 与 $H_1$。`);

          const opts = [correctDecision, wrongDecision1, wrongDecision2, wrongDecision3];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return reasoned(
            choiceProblem({
              prompt: t(
                `A left-tailed test of $H_0: \\mu = \\mu_0$ versus $H_1: \\mu < \\mu_0$ is conducted at significance level $\\alpha = ${lvl.alpha}$ (critical value $-z_\\alpha = ${lvl.zCrit}$). The calculated test statistic is $z = ${zCalc}$. What is the correct statistical decision?`,
                `在显著性水平 $\\alpha = ${lvl.alpha}$（临界值 $-z_\\alpha = ${lvl.zCrit}$）下进行左尾检验 $H_0: \\mu = \\mu_0$ 对 $H_1: \\mu < \\mu_0$。计算得到的检验统计量为 $z = ${zCalc}$。正确的统计决策是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Write the rejection region", "写出拒绝域"],
                    t(
                      `For a left-tailed test the rejection region is $(-\\infty, -z_\\alpha] = (-\\infty, ${lvl.zCrit}]$.`,
                      `左尾检验的拒绝域为 $(-\\infty, -z_\\alpha] = (-\\infty, ${lvl.zCrit}]$。`,
                    ),
                  ],
                  [
                    ["Compare the statistic", "比较统计量"],
                    t(
                      `$z = ${zCalc}$ is ${isReject ? "less than or equal to" : "strictly greater than"} $${lvl.zCrit}$, so we ${isReject ? "reject" : "fail to reject"} $H_0$.`,
                      `$z = ${zCalc}$ ${isReject ? "小于等于" : "严格大于"} $${lvl.zCrit}$，所以我们${isReject ? "拒绝" : "不拒绝"} $H_0$。`,
                    ),
                  ],
                ],
                t(
                  `$z = ${zCalc}$ lies $${delta}$ to the ${isReject ? "left" : "right"} of $${lvl.zCrit}$, so it is ${isReject ? "inside" : "outside"} the region.`,
                  `$z = ${zCalc}$ 在 $${lvl.zCrit}$ 的${isReject ? "左" : "右"}侧 $${delta}$ 处，所以在拒绝域${isReject ? "之内" : "之外"}。`,
                ),
              ),
            }),
            [
              [
                wrongDecision1.en,
                isReject
                  ? "A statistic at or below the critical value is inside the rejection region, so $H_0$ is rejected."
                  : "A statistic to the right of the critical value is outside the rejection region, so $H_0$ stands.",
                isReject ? "不大于临界值的统计量在拒绝域之内，所以拒绝 $H_0$。" : "在临界值右侧的统计量在拒绝域之外，所以不拒绝 $H_0$。",
              ],
              [
                wrongDecision2.en,
                "A test never proves a hypothesis; it only rejects or fails to reject $H_0$.",
                "检验从不证明某个假设；它只是拒绝或不拒绝 $H_0$。",
              ],
              [
                wrongDecision3.en,
                "A negative $z$ is what a left-tailed test looks for; the decision compares $z$ with the critical value and is only about $H_0$.",
                "负的 $z$ 正是左尾检验要寻找的；决策只把 $z$ 与临界值比较，且只针对 $H_0$。",
              ],
            ],
          );
        },
      },
      {
        id: "the-critical-sample-mean-for-a-left-tailed-test",
        title: t("The critical sample mean for a left-tailed test", "左侧检验的临界样本均值"),
        explanation: t(
          "The critical region can be stated for $\\bar{x}$ itself instead of for $Z$. Solving $\\frac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}} \\le -z_{\\alpha}$ for $\\bar{x}$ gives\n\n$$\\bar{x} \\le \\mu_0 - z_{\\alpha}\\frac{\\sigma}{\\sqrt{n}}.$$\n\nUse the one-tailed value $z_{\\alpha}$ (for example $1.645$ at $\\alpha = 0.05$), not $z_{\\alpha/2}$. With $\\mu_0 = 100$, $\\sigma = 15$, $n = 25$ and $\\alpha = 0.05$, the test rejects when $\\bar{x} \\le 100 - 1.645 \\cdot 3 = 95.065$. With $\\mu_0 = 12$, $\\sigma = 0.8$, $n = 64$ and $\\alpha = 0.05$, the standard error is $0.1$ and the boundary is $12 - 0.1645 = 11.8355$.\n\n> **Watch out.** Multiply $z_{\\alpha}$ by $\\frac{\\sigma}{\\sqrt{n}}$, not by $\\sigma$, and subtract it: adding gives the boundary of a right-tailed test.",
          "临界域可以直接用 $\\bar{x}$ 而不是 $Z$ 来表示。由 $\\frac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}} \\le -z_{\\alpha}$ 解出 $\\bar{x}$：\n\n$$\\bar{x} \\le \\mu_0 - z_{\\alpha}\\frac{\\sigma}{\\sqrt{n}}.$$\n\n要用单侧值 $z_{\\alpha}$（例如 $\\alpha = 0.05$ 时为 $1.645$），而不是 $z_{\\alpha/2}$。若 $\\mu_0 = 100$，$\\sigma = 15$，$n = 25$，$\\alpha = 0.05$，则当 $\\bar{x} \\le 100 - 1.645 \\cdot 3 = 95.065$ 时拒绝。若 $\\mu_0 = 12$，$\\sigma = 0.8$，$n = 64$，$\\alpha = 0.05$，标准误为 $0.1$，边界为 $12 - 0.1645 = 11.8355$。\n\n> **注意。** $z_{\\alpha}$ 要乘以 $\\frac{\\sigma}{\\sqrt{n}}$ 而不是 $\\sigma$，并且要减去：加上得到的是右侧检验的边界。",
        ),
        generate: (rng: Rng): Problem => {
          const [alpha, za, zhalf] = rng.pick([
            ["0.10", "1.282", "1.645"],
            ["0.05", "1.645", "1.96"],
            ["0.01", "2.326", "2.576"],
          ] as const);
          const z = Q.parse(za);
          const k = rng.int(3, 10);
          const se = Q.of(rng.int(1, 6));
          const sigma = se.mul(Q.of(k));
          const mu0 = rng.int(20, 200);
          const ans = Q.of(mu0).sub(z.mul(se));
          const margin = se.eq(Q.of(1)) ? za : `${za} \\cdot ${dec(se)}`;
          return numberProblem({
            prompt: t(
              `A test of $H_0: \\mu = ${mu0}$ against $H_1: \\mu < ${mu0}$ uses a sample of $n = ${k * k}$ from a normal population with $\\sigma = ${dec(sigma)}$, at $\\alpha = ${alpha}$ ($z_{\\alpha} = ${za}$). Below what sample mean is $H_0$ rejected?`,
              `用来自 $\\sigma = ${dec(sigma)}$ 的正态总体、容量 $n = ${k * k}$ 的样本，在 $\\alpha = ${alpha}$（$z_{\\alpha} = ${za}$）下检验 $H_0: \\mu = ${mu0}$ 对 $H_1: \\mu < ${mu0}$。样本均值低于多少时拒绝 $H_0$？`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: distinct(ans, [
              why(
                Q.of(mu0).add(z.mul(se)),
                "That adds the margin, which gives the boundary of a right-tailed test.",
                "那是加上了边际，得到的是右侧检验的边界。",
              ),
              why(
                Q.of(mu0).sub(z.mul(sigma)),
                "That multiplies by $\\sigma$ instead of the standard error $\\frac{\\sigma}{\\sqrt{n}}$.",
                "那乘的是 $\\sigma$，而不是标准误 $\\frac{\\sigma}{\\sqrt{n}}$。",
              ),
              why(
                Q.of(mu0).sub(Q.parse(zhalf).mul(se)),
                `That uses the two-tailed value $${zhalf}$; a one-tailed test uses $z_{\\alpha} = ${za}$.`,
                `那用了双侧值 $${zhalf}$；单侧检验用 $z_{\\alpha} = ${za}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `$\\frac{\\sigma}{\\sqrt{n}} = \\frac{${dec(sigma)}}{${k}} = ${dec(se)}$.`,
                    `$\\frac{\\sigma}{\\sqrt{n}} = \\frac{${dec(sigma)}}{${k}} = ${dec(se)}$。`,
                  ),
                ],
                [
                  ["Step below the null mean", "从原假设均值向下移"],
                  t(
                    `The boundary is $${mu0} - ${margin} = ${dec(ans)}$; reject when $\\bar{x} \\le ${dec(ans)}$.`,
                    `边界为 $${mu0} - ${margin} = ${dec(ans)}$；当 $\\bar{x} \\le ${dec(ans)}$ 时拒绝。`,
                  ),
                ],
              ],
              t(
                `$\\frac{${dec(ans)} - ${mu0}}{${dec(se)}} = -${za}$, exactly the critical value of $Z$.`,
                `$\\frac{${dec(ans)} - ${mu0}}{${dec(se)}} = -${za}$，正是 $Z$ 的临界值。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 8.28.4 Critical Regions for Right-Tailed Hypothesis Tests
  {
    id: "critical-regions-for-right-tailed-hypothesis-tests",
    title: t("Critical Regions for Right-Tailed Hypothesis Tests", "右尾假设检验的临界区域"),
    summary: t(
      "In a right-tailed test with significance level α, the critical region is Z ≥ z_α. The null hypothesis is rejected when the test statistic is sufficiently large.",
      "在显著性水平为 α 的右尾检验中，临界区域为 Z ≥ z_α。当检验统计量足够大时拒绝原假设。",
    ),
    intro: t(
      "A school's mean score has been $70$, with $\\sigma = 12$. A sample of $36$ pupils has $\\bar{x} = 73.5$, and the test is $H_1: \\mu > 70$ at $\\alpha = 0.05$. The standard error is $\\frac{12}{6} = 2$, so $z = \\frac{3.5}{2} = 1.75$, which is at least $1.645$: reject $H_0$.\n\nCheck: the boundary sample mean is $70 + 1.645 \\cdot 2 = 73.29$, and $73.5$ lies above it.\n\nIn this lesson we decide a right-tailed test from its statistic or from the sample mean, find the probability of a Type II error and read a decision from a shaded rejection region.",
      "某校的平均分一直是 $70$，$\\sigma = 12$。$36$ 名学生的样本有 $\\bar{x} = 73.5$，在 $\\alpha = 0.05$ 下检验 $H_1: \\mu > 70$。标准误为 $\\frac{12}{6} = 2$，所以 $z = \\frac{3.5}{2} = 1.75$，不小于 $1.645$：拒绝 $H_0$。\n\n检验：临界样本均值为 $70 + 1.645 \\cdot 2 = 73.29$，而 $73.5$ 在它上方。\n\n本课我们由统计量或样本均值对右尾检验作出决策，求第二类错误的概率，并从阴影拒绝域读出决策。",
    ),
    prerequisites: ["critical-regions-for-left-tailed-hypothesis-tests"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-right-tailed-critical-region",
        title: t("Evaluating right-tailed test decisions", "评估右尾检验的决策"),
        explanation: t(
          "A right tailed test looks for evidence that the parameter is larger than claimed, so only a statistic far enough to the right leads to rejection. If $z_{\\text{calc}} \\ge z_\\alpha$, reject $H_0$; otherwise fail to reject $H_0$. At $\\alpha = 0.001$ the critical value is $3.09$, so $z = 3.2$ rejects and $z = 2.9$ does not.\n\n> **Watch out.** Only the right tail counts: a negative $z$, however large in size, never rejects $H_0$ in a right-tailed test.",
          "右尾检验寻找参数大于声称值的证据，所以只有统计量足够靠右时才拒绝原假设。若 $z_{\\text{calc}} \\ge z_\\alpha$，则拒绝 $H_0$；否则不拒绝 $H_0$。$\\alpha = 0.001$ 时临界值为 $3.09$，所以 $z = 3.2$ 拒绝，$z = 2.9$ 不拒绝。\n\n> **注意。** 只有右尾才算数：在右尾检验中，负的 $z$ 无论绝对值多大，都不会拒绝 $H_0$。",
        ),
        generate: (rng: Rng): Problem => {
          const levels = [
            { alpha: "0.05", zCrit: 1.645 },
            { alpha: "0.01", zCrit: 2.326 },
            { alpha: "0.025", zCrit: 1.96 },
            { alpha: "0.10", zCrit: 1.282 },
          ];
          const lvl = rng.pick(levels);
          const isReject = rng.bool();
          const delta = rng.int(5, 80) / 100;
          const zCalc = Number((isReject ? lvl.zCrit + delta : lvl.zCrit - delta).toFixed(3));

          const correctDecision = isReject
            ? t(`Reject $H_0$ because $z = ${zCalc} \\ge ${lvl.zCrit}$.`, `拒绝 $H_0$，因为 $z = ${zCalc} \\ge ${lvl.zCrit}$。`)
            : t(`Fail to reject $H_0$ because $z = ${zCalc} < ${lvl.zCrit}$.`, `不拒绝 $H_0$，因为 $z = ${zCalc} < ${lvl.zCrit}$。`);
          const wrongDecision1 = isReject
            ? t(`Fail to reject $H_0$ because $z = ${zCalc} \\ge ${lvl.zCrit}$.`, `不拒绝 $H_0$，因为 $z = ${zCalc} \\ge ${lvl.zCrit}$。`)
            : t(`Reject $H_0$ because $z = ${zCalc} < ${lvl.zCrit}$.`, `拒绝 $H_0$，因为 $z = ${zCalc} < ${lvl.zCrit}$。`);
          const wrongDecision2 = t(`Accept $H_0$ as proven beyond any possibility of error.`, `接受 $H_0$，并认为已排除任何出错的可能。`);
          const wrongDecision3 = t(`Reject $H_0$ only if $z < 0$.`, `仅当 $z < 0$ 时才拒绝 $H_0$。`);

          const opts = [correctDecision, wrongDecision1, wrongDecision2, wrongDecision3];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return reasoned(
            choiceProblem({
              prompt: t(
                `A right-tailed test of $H_0: \\mu = \\mu_0$ versus $H_1: \\mu > \\mu_0$ is conducted at significance level $\\alpha = ${lvl.alpha}$ (critical value $z_\\alpha = ${lvl.zCrit}$). The calculated test statistic is $z = ${zCalc}$. What is the correct statistical decision?`,
                `在显著性水平 $\\alpha = ${lvl.alpha}$（临界值 $z_\\alpha = ${lvl.zCrit}$）下进行右尾检验 $H_0: \\mu = \\mu_0$ 对 $H_1: \\mu > \\mu_0$。计算得到的检验统计量为 $z = ${zCalc}$。正确的统计决策是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Write the rejection region", "写出拒绝域"],
                    t(
                      `For a right-tailed test the rejection region is $[z_\\alpha, \\infty) = [${lvl.zCrit}, \\infty)$.`,
                      `右尾检验的拒绝域为 $[z_\\alpha, \\infty) = [${lvl.zCrit}, \\infty)$。`,
                    ),
                  ],
                  [
                    ["Compare the statistic", "比较统计量"],
                    t(
                      `$z = ${zCalc}$ is ${isReject ? "greater than or equal to" : "strictly less than"} $${lvl.zCrit}$, so we ${isReject ? "reject" : "fail to reject"} $H_0$.`,
                      `$z = ${zCalc}$ ${isReject ? "大于等于" : "严格小于"} $${lvl.zCrit}$，所以我们${isReject ? "拒绝" : "不拒绝"} $H_0$。`,
                    ),
                  ],
                ],
                t(
                  `$z = ${zCalc}$ lies $${delta}$ to the ${isReject ? "right" : "left"} of $${lvl.zCrit}$, so it is ${isReject ? "inside" : "outside"} the region.`,
                  `$z = ${zCalc}$ 在 $${lvl.zCrit}$ 的${isReject ? "右" : "左"}侧 $${delta}$ 处，所以在拒绝域${isReject ? "之内" : "之外"}。`,
                ),
              ),
            }),
            [
              [
                wrongDecision1.en,
                isReject
                  ? "A statistic at or above the critical value is inside the rejection region, so $H_0$ is rejected."
                  : "A statistic below the critical value is outside the rejection region, so $H_0$ stands.",
                isReject ? "不小于临界值的统计量在拒绝域之内，所以拒绝 $H_0$。" : "低于临界值的统计量在拒绝域之外，所以不拒绝 $H_0$。",
              ],
              [
                wrongDecision2.en,
                "A test never proves $H_0$; at most it fails to reject it, and every decision carries some chance of error.",
                "检验从不证明 $H_0$；至多是不拒绝它，而且每个决策都有出错的可能。",
              ],
              [
                wrongDecision3.en,
                "That is the rule of a left-tailed test; a right-tailed test rejects for large positive $z$.",
                "那是左尾检验的规则；右尾检验在 $z$ 足够大且为正时拒绝。",
              ],
            ],
          );
        },
      },
      {
        id: "deciding-a-right-tailed-test-from-the-sample-mean",
        title: t("Deciding a right-tailed test from the sample mean", "由样本均值作右侧检验的决策"),
        explanation: t(
          "From raw data, standardize first: $z = \\frac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}}$, then compare with $z_{\\alpha}$. Reject $H_0$ when $z \\ge z_{\\alpha}$; otherwise do not reject.\n\nNot rejecting is not the same as proving $H_0$: the data are merely consistent with it. A sample mean above $\\mu_0$ is not enough by itself; it has to be far enough above, measured in standard errors. With $\\mu_0 = 50$, $\\sigma = 3$, $n = 4$ and $\\bar{x} = 52.4$: $z = \\frac{2.4}{1.5} = 1.6$, short of $1.645$ at $\\alpha = 0.05$, so $H_0$ is not rejected although $\\bar{x} > 50$.\n\n> **Watch out.** Divide by the standard error $\\frac{\\sigma}{\\sqrt{n}}$, not by $\\sigma$; dividing by $\\sigma$ shrinks $z$ and can hide a real effect.",
          "面对原始数据，先标准化：$z = \\frac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}}$，再与 $z_{\\alpha}$ 比较。当 $z \\ge z_{\\alpha}$ 时拒绝 $H_0$，否则不拒绝。\n\n不拒绝并不等于证明了 $H_0$：数据只是与它相容。样本均值高于 $\\mu_0$ 本身并不够，还要以标准误衡量高出足够多。若 $\\mu_0 = 50$，$\\sigma = 3$，$n = 4$，$\\bar{x} = 52.4$：$z = \\frac{2.4}{1.5} = 1.6$，在 $\\alpha = 0.05$ 下未达到 $1.645$，所以尽管 $\\bar{x} > 50$，也不拒绝 $H_0$。\n\n> **注意。** 要除以标准误 $\\frac{\\sigma}{\\sqrt{n}}$，而不是 $\\sigma$；除以 $\\sigma$ 会使 $z$ 变小，可能掩盖真实的效应。",
        ),
        generate: (rng: Rng): Problem => {
          const [alpha, za] = rng.pick([
            ["0.10", "1.282"],
            ["0.05", "1.645"],
            ["0.01", "2.326"],
          ] as const);
          const k = rng.int(3, 10);
          const se = Q.of(rng.pick([1, 2, 4, 5]));
          const zv = Q.of(rng.int(2, 30), 10);
          const mu0 = rng.int(20, 200);
          const xbar = Q.of(mu0).add(zv.mul(se));
          const reject = zv.cmp(Q.parse(za)) >= 0;
          const margin = se.eq(Q.of(1)) ? za : `${za} \\cdot ${dec(se)}`;
          const boundary = Q.of(mu0).add(Q.parse(za).mul(se));
          const options = [
            t(`Reject $H_0$: the data support $\\mu > ${mu0}$.`, `拒绝 $H_0$：数据支持 $\\mu > ${mu0}$。`),
            t(
              `Do not reject $H_0$: the evidence for $\\mu > ${mu0}$ is not strong enough.`,
              `不拒绝 $H_0$：支持 $\\mu > ${mu0}$ 的证据不够强。`,
            ),
            t(`Accept $H_0$: the data prove that $\\mu = ${mu0}$.`, `接受 $H_0$：数据证明了 $\\mu = ${mu0}$。`),
          ];
          return reasoned(
            choiceProblem({
              prompt: t(
                `A sample of $n = ${k * k}$ from a normal population with $\\sigma = ${dec(se.mul(Q.of(k)))}$ has $\\bar{x} = ${dec(xbar)}$. Test $H_0: \\mu = ${mu0}$ against $H_1: \\mu > ${mu0}$ at $\\alpha = ${alpha}$ ($z_{\\alpha} = ${za}$). What is the conclusion?`,
                `来自 $\\sigma = ${dec(se.mul(Q.of(k)))}$ 的正态总体、容量 $n = ${k * k}$ 的样本有 $\\bar{x} = ${dec(xbar)}$。在 $\\alpha = ${alpha}$（$z_{\\alpha} = ${za}$）下检验 $H_0: \\mu = ${mu0}$ 对 $H_1: \\mu > ${mu0}$。结论是什么？`,
              ),
              options,
              correct: reject ? 0 : 1,
              solution: walked(
                [
                  [
                    ["Standardize the sample mean", "把样本均值标准化"],
                    t(
                      `$z = \\frac{${dec(xbar)} - ${mu0}}{${dec(se.mul(Q.of(k)))}/${k}} = \\frac{${dec(zv.mul(se))}}{${dec(se)}} = ${dec(zv)}$.`,
                      `$z = \\frac{${dec(xbar)} - ${mu0}}{${dec(se.mul(Q.of(k)))}/${k}} = \\frac{${dec(zv.mul(se))}}{${dec(se)}} = ${dec(zv)}$。`,
                    ),
                  ],
                  [
                    ["Compare with the critical value", "与临界值比较"],
                    t(
                      `$${dec(zv)}$ is ${reject ? "at least" : "less than"} $${za}$, so ${reject ? "reject $H_0$" : "do not reject $H_0$"}. A test never proves $H_0$.`,
                      `$${dec(zv)}$ ${reject ? "不小于" : "小于"} $${za}$，所以${reject ? "拒绝 $H_0$" : "不拒绝 $H_0$"}。检验永远不能证明 $H_0$。`,
                    ),
                  ],
                ],
                t(
                  `The test rejects for $\\bar{x} \\ge ${mu0} + ${margin} = ${dec(boundary)}$, and $\\bar{x} = ${dec(xbar)}$ is ${reject ? "not below" : "below"} it.`,
                  `当 $\\bar{x} \\ge ${mu0} + ${margin} = ${dec(boundary)}$ 时拒绝，而 $\\bar{x} = ${dec(xbar)}$ ${reject ? "不低于" : "低于"}它。`,
                ),
              ),
            }),
            [
              [
                options[0]!.en,
                `$z = ${dec(zv)}$ is below $${za}$, so the sample mean is not far enough above $${mu0}$.`,
                `$z = ${dec(zv)}$ 低于 $${za}$，所以样本均值比 $${mu0}$ 高得不够多。`,
              ],
              [
                options[1]!.en,
                `$z = ${dec(zv)}$ reaches $${za}$, so the evidence is strong enough to reject.`,
                `$z = ${dec(zv)}$ 达到了 $${za}$，所以证据足以拒绝。`,
              ],
              [
                options[2]!.en,
                "A test never proves $H_0$; not rejecting only means the data are consistent with it.",
                "检验永远不能证明 $H_0$；不拒绝只表示数据与它相容。",
              ],
            ],
          );
        },
      },
    ],
  },

  // 8.28.5 Two-Tailed Hypothesis Tests
  {
    id: "two-tailed-hypothesis-tests",
    title: t("Two-Tailed Hypothesis Tests", "双尾假设检验"),
    summary: t(
      "A two-tailed test splits the significance level $\\alpha$ equally between the tails, giving the critical region $|Z| \\ge z_{\\alpha/2}$.",
      "双尾检验把显著性水平 $\\alpha$ 平分到两个尾部，临界域为 $|Z| \\ge z_{\\alpha/2}$。",
    ),
    intro: t(
      "Rods should be $50$ cm long, and the cutting machine has $\\sigma = 0.4$ cm. A sample of $16$ rods has $\\bar{x} = 50.25$; test $H_1: \\mu \\neq 50$ at $\\alpha = 0.05$. The standard error is $\\frac{0.4}{4} = 0.1$, so $z = 2.5$, and $|z| \\ge 1.96$: reject $H_0$.\n\nCheck: $H_0$ is kept only for $50 \\pm 1.96 \\cdot 0.1$, from $49.804$ to $50.196$, and $50.25$ lies outside.\n\nIn this lesson we decide a two-tailed test, find the region of sample means that keeps $H_0$, decide a test from a confidence interval, and read a decision and a level from drawn intervals and shaded regions.",
      "钢条应长 $50$ 厘米，切割机的 $\\sigma = 0.4$ 厘米。$16$ 根钢条的样本有 $\\bar{x} = 50.25$；在 $\\alpha = 0.05$ 下检验 $H_1: \\mu \\neq 50$。标准误为 $\\frac{0.4}{4} = 0.1$，所以 $z = 2.5$，$|z| \\ge 1.96$：拒绝 $H_0$。\n\n检验：只有当样本均值在 $50 \\pm 1.96 \\cdot 0.1$ 之内，即 $49.804$ 到 $50.196$ 时才保留 $H_0$，而 $50.25$ 在其外。\n\n本课我们对双尾检验作出决策，求保留 $H_0$ 的样本均值区域，由置信区间作出检验决策，并从画出的区间和阴影区域读出决策与显著性水平。",
    ),
    prerequisites: ["critical-regions-for-right-tailed-hypothesis-tests"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-two-tailed-critical-region",
        title: t("Evaluating two-tailed test decisions", "评估双尾检验的决策"),
        explanation: t(
          "A two tailed test splits the significance level between both tails, so a statistic far enough in either direction leads to rejection. If $|z_{\\text{calc}}| \\ge z_{\\alpha/2}$, reject $H_0$; otherwise fail to reject $H_0$. At $\\alpha = 0.001$, $z_{\\alpha/2} = 3.291$: $z = -3.4$ rejects, because $|z| = 3.4 \\ge 3.291$, while $z = 3.1$ does not.\n\n> **Watch out.** Use $z_{\\alpha/2}$, not $z_{\\alpha}$, and compare $|z|$: a statistic far enough to the left rejects just as one far enough to the right does.",
          "双尾检验把显著性水平平分到两个尾部，所以统计量在任一方向上足够远都会拒绝原假设。若 $|z_{\\text{calc}}| \\ge z_{\\alpha/2}$，则拒绝 $H_0$；否则不拒绝 $H_0$。$\\alpha = 0.001$ 时 $z_{\\alpha/2} = 3.291$：$z = -3.4$ 拒绝，因为 $|z| = 3.4 \\ge 3.291$；$z = 3.1$ 不拒绝。\n\n> **注意。** 要用 $z_{\\alpha/2}$ 而不是 $z_{\\alpha}$，并比较 $|z|$：足够靠左的统计量与足够靠右的一样会拒绝。",
        ),
        generate: (rng: Rng): Problem => {
          const levels = [
            { alpha: "0.05", zHalf: 1.96 },
            { alpha: "0.01", zHalf: 2.576 },
            { alpha: "0.10", zHalf: 1.645 },
          ];
          const lvl = rng.pick(levels);
          const isReject = rng.bool();
          const sign = rng.pick([-1, 1]);
          const delta = rng.int(5, 75) / 100;
          const absZ = isReject ? lvl.zHalf + delta : lvl.zHalf - delta;
          const zCalc = Number((sign * absZ).toFixed(3));

          const correctDecision = isReject
            ? t(
                `Reject $H_0$ because $|z| = ${Math.abs(zCalc)} \\ge ${lvl.zHalf}$.`,
                `拒绝 $H_0$，因为 $|z| = ${Math.abs(zCalc)} \\ge ${lvl.zHalf}$。`,
              )
            : t(
                `Fail to reject $H_0$ because $|z| = ${Math.abs(zCalc)} < ${lvl.zHalf}$.`,
                `不拒绝 $H_0$，因为 $|z| = ${Math.abs(zCalc)} < ${lvl.zHalf}$。`,
              );
          const wrongDecision1 = isReject
            ? t(
                `Fail to reject $H_0$ because $|z| = ${Math.abs(zCalc)} \\ge ${lvl.zHalf}$.`,
                `不拒绝 $H_0$，因为 $|z| = ${Math.abs(zCalc)} \\ge ${lvl.zHalf}$。`,
              )
            : t(
                `Reject $H_0$ because $|z| = ${Math.abs(zCalc)} < ${lvl.zHalf}$.`,
                `拒绝 $H_0$，因为 $|z| = ${Math.abs(zCalc)} < ${lvl.zHalf}$。`,
              );
          const wrongDecision2 = t(
            `Accept $H_0$ and declare that $\\mu$ equals $\\mu_0$ with 100% certainty.`,
            `接受 $H_0$，并宣布 $\\mu$ 有 100% 确定性等于 $\\mu_0$。`,
          );
          const wrongDecision3 = t(`No decision can be made without knowing the sample size.`, `不知晓样本容量时无法做出任何检验决策。`);

          const opts = [correctDecision, wrongDecision1, wrongDecision2, wrongDecision3];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return reasoned(
            choiceProblem({
              prompt: t(
                `A two-tailed test of $H_0: \\mu = \\mu_0$ versus $H_1: \\mu \\neq \\mu_0$ is conducted at significance level $\\alpha = ${lvl.alpha}$ (critical values $\\pm z_{\\alpha/2} = \\pm ${lvl.zHalf}$). The calculated test statistic is $z = ${zCalc}$. What is the correct statistical decision?`,
                `在显著性水平 $\\alpha = ${lvl.alpha}$（临界值 $\\pm z_{\\alpha/2} = \\pm ${lvl.zHalf}$）下进行双尾检验 $H_0: \\mu = \\mu_0$ 对 $H_1: \\mu \\neq \\mu_0$。计算得到的检验统计量为 $z = ${zCalc}$。正确的统计决策是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Write the rule", "写出规则"],
                    t(
                      `For a two-tailed test, $H_0$ is rejected if $|z| \\ge z_{\\alpha/2} = ${lvl.zHalf}$.`,
                      `对于双尾检验，当 $|z| \\ge z_{\\alpha/2} = ${lvl.zHalf}$ 时拒绝 $H_0$。`,
                    ),
                  ],
                  [
                    ["Compare the size of the statistic", "比较统计量的绝对值"],
                    t(
                      `Here $|z| = ${Math.abs(zCalc)}$. Since $|z| ${isReject ? "\\ge" : "<"} ${lvl.zHalf}$, we ${isReject ? "reject" : "fail to reject"} $H_0$.`,
                      `在此 $|z| = ${Math.abs(zCalc)}$。由于 $|z| ${isReject ? "\\ge" : "<"} ${lvl.zHalf}$，我们${isReject ? "拒绝" : "不拒绝"} $H_0$。`,
                    ),
                  ],
                ],
                t(
                  `$z = ${zCalc}$ lies ${isReject ? "beyond" : "between"} the critical values $\\pm ${lvl.zHalf}$, by $${delta}$ ${isReject ? "past" : "inside"} the nearer one.`,
                  `$z = ${zCalc}$ 在临界值 $\\pm ${lvl.zHalf}$ ${isReject ? "之外" : "之间"}，距较近的临界值 $${delta}$。`,
                ),
              ),
            }),
            [
              [
                wrongDecision1.en,
                isReject
                  ? `$|z|$ reaches $${lvl.zHalf}$, so the statistic is in the rejection region and $H_0$ is rejected.`
                  : `$|z|$ is below $${lvl.zHalf}$, so the statistic is outside the rejection region and $H_0$ stands.`,
                isReject
                  ? `$|z|$ 达到了 $${lvl.zHalf}$，所以统计量在拒绝域中，拒绝 $H_0$。`
                  : `$|z|$ 低于 $${lvl.zHalf}$，所以统计量在拒绝域之外，不拒绝 $H_0$。`,
              ],
              [
                wrongDecision2.en,
                "A test never establishes $H_0$ with certainty; at most it fails to reject it.",
                "检验从不能确定地证明 $H_0$；至多是不拒绝它。",
              ],
              [
                wrongDecision3.en,
                "The sample size is already built into $z$; the decision only compares $z$ with the critical values.",
                "样本容量已经包含在 $z$ 中；决策只需把 $z$ 与临界值比较。",
              ],
            ],
          );
        },
      },
      {
        id: "the-non-rejection-region-for-the-sample-mean",
        title: t("The non-rejection region for the sample mean", "样本均值的不拒绝域"),
        explanation: t(
          "A two-tailed test at level $\\alpha$ keeps $H_0$ when the sample mean falls within $z_{\\alpha/2}$ standard errors of $\\mu_0$:\n\n$$\\mu_0 - z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}} < \\bar{x} < \\mu_0 + z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}.$$\n\nOutside these two boundaries, in either direction, $H_0$ is rejected. This region has the same width as the confidence interval: a two-tailed test rejects exactly when $\\mu_0$ lies outside the $100(1 - \\alpha)\\%$ interval. With $\\mu_0 = 8$, $\\sigma = 0.5$, $n = 100$ and $\\alpha = 0.05$, the standard error is $0.05$, so $H_0$ is kept for $7.902 < \\bar{x} < 8.098$.\n\n> **Watch out.** Use $z_{\\alpha/2}$, not $z_{\\alpha}$, and the standard error $\\frac{\\sigma}{\\sqrt{n}}$, not $\\sigma$.",
          "在水平 $\\alpha$ 下的双侧检验，当样本均值落在 $\\mu_0$ 的 $z_{\\alpha/2}$ 个标准误之内时保留 $H_0$：\n\n$$\\mu_0 - z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}} < \\bar{x} < \\mu_0 + z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}.$$\n\n超出这两个边界，无论哪个方向，都拒绝 $H_0$。这个区域与置信区间同宽：双侧检验恰好在 $\\mu_0$ 落在 $100(1 - \\alpha)\\%$ 区间之外时拒绝。若 $\\mu_0 = 8$，$\\sigma = 0.5$，$n = 100$，$\\alpha = 0.05$，标准误为 $0.05$，所以当 $7.902 < \\bar{x} < 8.098$ 时保留 $H_0$。\n\n> **注意。** 要用 $z_{\\alpha/2}$ 而不是 $z_{\\alpha}$，用标准误 $\\frac{\\sigma}{\\sqrt{n}}$ 而不是 $\\sigma$。",
        ),
        generate: (rng: Rng): Problem => {
          const [alpha, zh, za] = rng.pick([
            ["0.10", "1.645", "1.282"],
            ["0.05", "1.96", "1.645"],
            ["0.01", "2.576", "2.326"],
          ] as const);
          const z = Q.parse(zh);
          const k = rng.int(3, 10);
          const se = Q.of(rng.int(1, 6));
          const mu0 = rng.int(20, 200);
          const upper = rng.bool();
          const sgn = Q.of(upper ? 1 : -1);
          const ans = Q.of(mu0).add(sgn.mul(z).mul(se));
          const margin = se.eq(Q.of(1)) ? zh : `${zh} \\cdot ${dec(se)}`;
          return numberProblem({
            prompt: t(
              `A two-tailed test of $H_0: \\mu = ${mu0}$ at $\\alpha = ${alpha}$ ($z_{\\alpha/2} = ${zh}$) uses a sample of $n = ${k * k}$ from a normal population with $\\sigma = ${dec(se.mul(Q.of(k)))}$. Find the ${upper ? "upper" : "lower"} boundary of the region of sample means for which $H_0$ is not rejected.`,
              `在 $\\alpha = ${alpha}$（$z_{\\alpha/2} = ${zh}$）下对 $H_0: \\mu = ${mu0}$ 作双侧检验，样本来自 $\\sigma = ${dec(se.mul(Q.of(k)))}$ 的正态总体，容量 $n = ${k * k}$。求不拒绝 $H_0$ 的样本均值区域的${upper ? "上" : "下"}边界。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: distinct(ans, [
              why(
                Q.of(mu0).sub(sgn.mul(z).mul(se)),
                `That is the ${upper ? "lower" : "upper"} boundary; the question asks for the ${upper ? "upper" : "lower"} one.`,
                `那是${upper ? "下" : "上"}边界；题目问的是${upper ? "上" : "下"}边界。`,
              ),
              why(
                Q.of(mu0).add(sgn.mul(Q.parse(za)).mul(se)),
                `That uses the one-tailed value $${za}$; a two-tailed test uses $z_{\\alpha/2} = ${zh}$.`,
                `那用了单侧值 $${za}$；双侧检验用 $z_{\\alpha/2} = ${zh}$。`,
              ),
              why(
                Q.of(mu0).add(sgn.mul(z).mul(se).mul(Q.of(k))),
                "That multiplies by $\\sigma$ instead of the standard error $\\frac{\\sigma}{\\sqrt{n}}$.",
                "那乘的是 $\\sigma$，而不是标准误 $\\frac{\\sigma}{\\sqrt{n}}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `The standard error is $\\frac{${dec(se.mul(Q.of(k)))}}{${k}} = ${dec(se)}$.`,
                    `标准误为 $\\frac{${dec(se.mul(Q.of(k)))}}{${k}} = ${dec(se)}$。`,
                  ),
                ],
                [
                  ["Step out from the null mean", "从原假设均值向外移"],
                  t(
                    `The ${upper ? "upper" : "lower"} boundary is $${mu0} ${upper ? "+" : "-"} ${margin} = ${dec(ans)}$.`,
                    `${upper ? "上" : "下"}边界为 $${mu0} ${upper ? "+" : "-"} ${margin} = ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `$\\frac{${dec(ans)} - ${mu0}}{${dec(se)}} = ${upper ? "" : "-"}${zh}$, the ${upper ? "upper" : "lower"} critical value of $Z$.`,
                `$\\frac{${dec(ans)} - ${mu0}}{${dec(se)}} = ${upper ? "" : "-"}${zh}$，正是 $Z$ 的${upper ? "上" : "下"}临界值。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 8.28.6 Type I and Type II Errors
  {
    id: "type-i-and-type-ii-errors",
    title: t("Type I and Type II Errors", "第一类与第二类错误"),
    summary: t(
      "A Type I error rejects a true $H_0$ (probability $\\alpha$); a Type II error fails to reject a false $H_0$ (probability $\\beta$). The power of the test is $1 - \\beta$.",
      "第一类错误是拒绝了为真的 $H_0$（概率 $\\alpha$）；第二类错误是未拒绝为假的 $H_0$（概率 $\\beta$）。检验功效为 $1 - \\beta$。",
    ),
    intro: t(
      "A test of $H_0: \\mu = 100$ with standard error $2$ rejects when $\\bar{x} \\ge 103.29$, so a Type I error has probability $\\alpha = 0.05$. If in fact $\\mu = 105$, a Type II error happens when $\\bar{x} < 103.29$: $\\beta = \\Phi\\left(\\frac{103.29 - 105}{2}\\right) = \\Phi(-0.855) \\approx 0.196$, and the power is $0.804$.\n\nCheck: $\\beta + \\text{power} = 0.196 + 0.804 = 1$.\n\nIn this lesson we tell the two kinds of error apart, find the probability of a Type II error, find the size and power of a test on a uniform variable and name a shaded area in a test.",
      "检验 $H_0: \\mu = 100$，标准误为 $2$，当 $\\bar{x} \\ge 103.29$ 时拒绝，所以第一类错误的概率为 $\\alpha = 0.05$。若实际上 $\\mu = 105$，当 $\\bar{x} < 103.29$ 时犯第二类错误：$\\beta = \\Phi\\left(\\frac{103.29 - 105}{2}\\right) = \\Phi(-0.855) \\approx 0.196$，功效为 $0.804$。\n\n检验：$\\beta + \\text{功效} = 0.196 + 0.804 = 1$。\n\n本课我们区分两类错误，求第二类错误的概率，求均匀分布变量检验的水平与功效，并说出检验图中阴影面积的名称。",
    ),
    prerequisites: ["introduction-to-hypothesis-testing"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "defining-type-i-and-ii-errors",
        title: t("Distinguishing Type I and Type II errors", "区分第一类与第二类错误"),
        explanation: t(
          "Type I error: a false positive (rejecting a true $H_0$). Type II error: a false negative (failing to reject a false $H_0$). If $H_0$ says a room has no fire, a smoke alarm that sounds with no fire commits a Type I error, and one that stays silent during a fire commits a Type II error.\n\n> **Watch out.** First ask whether $H_0$ was actually true. Rejecting a true $H_0$ is Type I; keeping a false $H_0$ is Type II. A badly chosen sample or an imprecise measurement is a different problem, not one of these two errors.",
          "第一类错误：假阳性（拒绝了真实的 $H_0$）。第二类错误：假阴性（未能拒绝错误的 $H_0$）。若 $H_0$ 为房间里没有火情，烟雾报警器在没有火时响起，就犯了第一类错误；有火时不响，就犯了第二类错误。\n\n> **注意。** 先问 $H_0$ 实际上是否为真。拒绝为真的 $H_0$ 是第一类错误；保留为假的 $H_0$ 是第二类错误。样本选得不好或测量不精确是另一类问题，不是这两种错误。",
        ),
        generate: (rng: Rng): Problem => {
          const scenarios = [
            {
              h0En: "a new medicine has no effect",
              h0Zh: "新药没有疗效",
              actionEn: "the researchers conclude the medicine is effective when in reality it has no effect",
              actionZh: "研究人员得出该药有效，而实际上它并没有疗效",
              isTypeI: true,
            },
            {
              h0En: "a defendant is innocent",
              h0Zh: "被告无罪",
              actionEn: "the court convicts an innocent defendant",
              actionZh: "法院判决无辜的被告有罪",
              isTypeI: true,
            },
            {
              h0En: "a manufactured batch meets quality standards",
              h0Zh: "生产批次符合质量标准",
              actionEn: "the manufacturer ships a defective batch, concluding it meets standards",
              actionZh: "制造商错误地认为批次达标，将不合格批次出厂",
              isTypeI: false,
            },
            {
              h0En: "a security alarm should remain silent (no intruder)",
              h0Zh: "安防警报保持静默（无入侵者）",
              actionEn: "an intruder enters the facility but the alarm fails to trigger",
              actionZh: "有入侵者进入设施，但警报未触发",
              isTypeI: false,
            },
          ];
          const sc = rng.pick(scenarios);
          const n = rng.int(50, 500);
          const correctErr = sc.isTypeI ? t("Type I error", "第一类错误") : t("Type II error", "第二类错误");
          const wrongErr = sc.isTypeI ? t("Type II error", "第二类错误") : t("Type I error", "第一类错误");

          const opts = [correctErr, wrongErr, t("Sampling bias error", "抽样偏倚错误"), t("Measurement precision error", "测量精度误差")];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return reasoned(
            choiceProblem({
              prompt: t(
                `Consider a hypothesis test on a sample of size $n = ${n}$ where the null hypothesis states that ${sc.h0En}. In a particular study, ${sc.actionEn}. What type of statistical error was committed?`,
                `考虑对容量为 $n = ${n}$ 的样本进行的假设检验，其中原假设为${sc.h0Zh}。在某次具体试验中，${sc.actionZh}。此时犯了哪一类统计错误？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Ask whether the null hypothesis was true", "判断原假设是否为真"],
                    t(
                      sc.isTypeI
                        ? `In reality ${sc.h0En}, so $H_0$ was true, yet the decision rejected it.`
                        : `In reality it is not true that ${sc.h0En}, so $H_0$ was false, yet the decision kept it.`,
                      sc.isTypeI
                        ? `实际上${sc.h0Zh}，所以 $H_0$ 为真，但决策拒绝了它。`
                        : `实际上并非${sc.h0Zh}，所以 $H_0$ 为假，但决策保留了它。`,
                    ),
                  ],
                  [
                    ["Name the error", "说出错误类型"],
                    t(
                      `${sc.isTypeI ? "A Type I error" : "A Type II error"} occurs when ${sc.isTypeI ? "a true null hypothesis is incorrectly rejected" : "a false null hypothesis is incorrectly retained"}.`,
                      `当${sc.isTypeI ? "原假设本为真却被错误拒绝" : "原假设本为假却未能被拒绝"}时，发生${sc.isTypeI ? "第一类错误" : "第二类错误"}。`,
                    ),
                  ],
                ],
                t(
                  `A Type I error can only follow a rejection and a Type II error only a failure to reject; here $H_0$ was ${sc.isTypeI ? "rejected" : "kept"}.`,
                  `第一类错误只会出现在拒绝之后，第二类错误只会出现在不拒绝之后；这里 $H_0$ 被${sc.isTypeI ? "拒绝" : "保留"}了。`,
                ),
              ),
            }),
            [
              [
                wrongErr.en,
                sc.isTypeI
                  ? "A Type II error keeps a false $H_0$; here a true $H_0$ was rejected."
                  : "A Type I error rejects a true $H_0$; here a false $H_0$ was kept.",
                sc.isTypeI
                  ? "第二类错误是保留了为假的 $H_0$；这里是拒绝了为真的 $H_0$。"
                  : "第一类错误是拒绝了为真的 $H_0$；这里是保留了为假的 $H_0$。",
              ],
              [
                opts[2]!.en,
                "Sampling bias is about how the sample was chosen, not about a wrong decision on $H_0$.",
                "抽样偏倚关乎样本如何选取，而不是对 $H_0$ 作出了错误决策。",
              ],
              [
                opts[3]!.en,
                "Measurement precision is about the instruments, not about a wrong decision on $H_0$.",
                "测量精度关乎测量工具，而不是对 $H_0$ 作出了错误决策。",
              ],
            ],
          );
        },
      },
      {
        id: "the-probability-of-a-type-ii-error",
        title: t("The probability of a Type II error", "第二类错误的概率"),
        explanation: t(
          "$\\beta$ depends on the true mean. For a right-tailed test that rejects when $\\bar{x} \\ge c$, a Type II error happens when $\\bar{x} < c$ although the true mean is some $\\mu_1 > \\mu_0$:\n\n$$\\beta = P(\\bar{x} < c \\mid \\mu = \\mu_1) = \\Phi\\left(\\frac{c - \\mu_1}{\\sigma/\\sqrt{n}}\\right).$$\n\nStandardize the **boundary** $c$ using the **true** mean $\\mu_1$. The further $\\mu_1$ is from $\\mu_0$, or the larger $n$, the smaller $\\beta$ and the greater the power $1 - \\beta$. With $c = 53.29$, $\\mu_1 = 55$ and $\\frac{\\sigma}{\\sqrt{n}} = 1$: $\\beta = \\Phi(-1.71) \\approx 0.0436$.\n\n> **Watch out.** $\\beta$ is the area **below** $c$ under the true mean; $1 - \\Phi$ gives the power instead. And standardizing with $\\mu_0$ only gives $1 - \\alpha$.",
          "$\\beta$ 依赖于真实均值。对于当 $\\bar{x} \\ge c$ 时拒绝的右侧检验，若真实均值为某个 $\\mu_1 > \\mu_0$ 却出现 $\\bar{x} < c$，就犯了第二类错误：\n\n$$\\beta = P(\\bar{x} < c \\mid \\mu = \\mu_1) = \\Phi\\left(\\frac{c - \\mu_1}{\\sigma/\\sqrt{n}}\\right).$$\n\n要用**真实**均值 $\\mu_1$ 去标准化**边界** $c$。$\\mu_1$ 离 $\\mu_0$ 越远或 $n$ 越大，$\\beta$ 越小，检验功效 $1 - \\beta$ 越大。若 $c = 53.29$，$\\mu_1 = 55$，$\\frac{\\sigma}{\\sqrt{n}} = 1$：$\\beta = \\Phi(-1.71) \\approx 0.0436$。\n\n> **注意。** $\\beta$ 是真实均值下 $c$ **以下**的面积；$1 - \\Phi$ 得到的是功效。用 $\\mu_0$ 标准化只会得到 $1 - \\alpha$。",
        ),
        generate: (rng: Rng): Problem => {
          const zv = rng.pick([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2]);
          const k = rng.int(3, 8);
          const se = rng.int(1, 5);
          const mu0 = rng.int(20, 150);
          const c = Q.of(mu0).add(Q.parse("1.645").mul(Q.of(se)));
          const mu1 = c.sub(Q.parse(String(zv)).mul(Q.of(se)));
          const beta = phi(zv);
          return numberProblem({
            prompt: t(
              `A test of $H_0: \\mu = ${mu0}$ against $H_1: \\mu > ${mu0}$ uses $n = ${k * k}$ observations from a normal population with $\\sigma = ${se * k}$, and rejects $H_0$ when $\\bar{x} \\ge ${dec(c)}$. If in fact $\\mu = ${dec(mu1)}$, find the probability $\\beta$ of a Type II error. Use ${PHI_TABLE.en}.`,
              `用来自 $\\sigma = ${se * k}$ 的正态总体的 $n = ${k * k}$ 个观测检验 $H_0: \\mu = ${mu0}$ 对 $H_1: \\mu > ${mu0}$，当 $\\bar{x} \\ge ${dec(c)}$ 时拒绝 $H_0$。若实际上 $\\mu = ${dec(mu1)}$，求第二类错误的概率 $\\beta$。利用${PHI_TABLE["zh-CN"]}。`,
            ),
            answer: beta,
            form: "decimal",
            mistakes: distinct(beta, [
              why(Q.one.sub(beta), "That is the area above $c$, the power $1 - \\beta$.", "那是 $c$ 以上的面积，即功效 $1 - \\beta$。"),
              why(
                Q.parse("0.95"),
                "That standardizes with $\\mu_0$; under $H_0$ the chance of not rejecting is $1 - \\alpha = 0.95$.",
                "那是用 $\\mu_0$ 标准化的；在 $H_0$ 下不拒绝的概率是 $1 - \\alpha = 0.95$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the standard error", "求标准误"],
                  t(`The standard error is $\\frac{${se * k}}{${k}} = ${se}$.`, `标准误为 $\\frac{${se * k}}{${k}} = ${se}$。`),
                ],
                [
                  ["Standardize the boundary under the true mean", "在真实均值下把边界标准化"],
                  t(
                    `$\\beta = P(\\bar{x} < ${dec(c)} \\mid \\mu = ${dec(mu1)}) = \\Phi\\left(\\frac{${dec(c)} - ${dec(mu1)}}{${se}}\\right) = \\Phi(${zv}) = ${dec(beta)}$.`,
                    `$\\beta = P(\\bar{x} < ${dec(c)} \\mid \\mu = ${dec(mu1)}) = \\Phi\\left(\\frac{${dec(c)} - ${dec(mu1)}}{${se}}\\right) = \\Phi(${zv}) = ${dec(beta)}$。`,
                  ),
                ],
              ],
              t(
                `The power is $1 - ${dec(beta)} = ${dec(Q.one.sub(beta))}$, and $\\beta$ is ${zv < 0 ? "below" : "above"} $0.5$ because $\\mu_1$ is ${zv < 0 ? "above" : "below"} $c$.`,
                `功效为 $1 - ${dec(beta)} = ${dec(Q.one.sub(beta))}$；因为 $\\mu_1$ ${zv < 0 ? "高于" : "低于"} $c$，所以 $\\beta$ ${zv < 0 ? "小于" : "大于"} $0.5$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 8.28.7 Hypothesis Tests for One Mean: Known Population Variance
  {
    id: "hypothesis-tests-for-one-mean-known-population-variance",
    title: t("Hypothesis Tests for One Mean: Known Population Variance", "单总体均值的假设检验：已知总体方差"),
    summary: t(
      "With known variance $\\sigma^2$, test $H_0: \\mu = \\mu_0$ using $Z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$, which is $N(0, 1)$ under $H_0$.",
      "总体方差 $\\sigma^2$ 已知时，用 $Z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$ 检验 $H_0: \\mu = \\mu_0$，在 $H_0$ 下服从 $N(0, 1)$。",
    ),
    intro: t(
      "Bulbs are claimed to last $1000$ hours, with $\\sigma = 80$. A sample of $64$ bulbs has $\\bar{x} = 980$. The standard error is $\\frac{80}{8} = 10$, so $z = \\frac{980 - 1000}{10} = -2$, and the two-tailed $p$-value is $2(1 - 0.9772) = 0.0456$, below $0.05$: reject $H_0$.\n\nCheck: $1000 - 2 \\cdot 10 = 980$, the sample mean.\n\nIn this lesson we compute the $z$ statistic for one mean, find its $p$-value and find the sample size that makes a difference significant.",
      "灯泡声称寿命为 $1000$ 小时，$\\sigma = 80$。$64$ 只灯泡的样本有 $\\bar{x} = 980$。标准误为 $\\frac{80}{8} = 10$，所以 $z = \\frac{980 - 1000}{10} = -2$，双侧 $p$ 值为 $2(1 - 0.9772) = 0.0456$，小于 $0.05$：拒绝 $H_0$。\n\n检验：$1000 - 2 \\cdot 10 = 980$，正是样本均值。\n\n本课我们计算单个均值的 $z$ 统计量，求它的 $p$ 值，并求使差异显著所需的样本量。",
    ),
    prerequisites: ["two-tailed-hypothesis-tests", "confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "one-mean-known-variance-z-statistic",
        title: t("Computing the one-sample z-test statistic", "计算单样本 z 检验统计量"),
        explanation: t(
          "The statistic counts how many standard errors the sample mean lies from the hypothesized mean, using the known population standard deviation. The test statistic is $z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$. With $\\mu_0 = 12$, $\\sigma = 0.6$, $n = 9$ and $\\bar{x} = 11.5$: the standard error is $0.2$ and $z = \\frac{-0.5}{0.2} = -2.5$.\n\n> **Watch out.** Divide by $\\frac{\\sigma}{\\sqrt{n}}$, not by $\\sigma$ or $\\frac{\\sigma}{n}$, and keep the sign: a sample mean below $\\mu_0$ gives a negative $z$.",
          "这个统计量用已知的总体标准差，计算样本均值离假设均值有多少个标准误。检验统计量为 $z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$。若 $\\mu_0 = 12$，$\\sigma = 0.6$，$n = 9$，$\\bar{x} = 11.5$：标准误为 $0.2$，$z = \\frac{-0.5}{0.2} = -2.5$。\n\n> **注意。** 要除以 $\\frac{\\sigma}{\\sqrt{n}}$，而不是 $\\sigma$ 或 $\\frac{\\sigma}{n}$；并保留符号：样本均值低于 $\\mu_0$ 时 $z$ 为负。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(3, 12);
          const n = k * k;
          const s = rng.int(2, 8);
          const sigma = k * s;
          const mu0 = rng.int(30, 200);
          const d = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
          const xBar = mu0 + d * s;
          const z = d;

          return numberProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ from a normal population with known standard deviation $\\sigma = ${sigma}$ yields sample mean $\\bar{x} = ${xBar}$. To test $H_0: \\mu = ${mu0}$, compute the test statistic $z$.`,
              `从已知标准差 $\\sigma = ${sigma}$ 的正态总体中抽取容量为 $n = ${n}$ 的随机样本，得样本均值 $\\bar{x} = ${xBar}$。为检验 $H_0: \\mu = ${mu0}$，计算检验统计量 $z$。`,
            ),
            answer: z,
            mistakes: distinct(z, [
              why(
                Q.of(d * s, sigma),
                "That divides by $\\sigma$ instead of the standard error $\\frac{\\sigma}{\\sqrt{n}}$.",
                "那除以的是 $\\sigma$，而不是标准误 $\\frac{\\sigma}{\\sqrt{n}}$。",
              ),
              why(
                d * s,
                "That is $\\bar{x} - \\mu_0$, not yet divided by the standard error.",
                "那是 $\\bar{x} - \\mu_0$，还没有除以标准误。",
              ),
              why(
                d * k,
                "That divides by $\\frac{\\sigma}{n}$ instead of $\\frac{\\sigma}{\\sqrt{n}}$.",
                "那除以的是 $\\frac{\\sigma}{n}$，而不是 $\\frac{\\sigma}{\\sqrt{n}}$。",
              ),
              why(-d, "The sign is flipped: subtract $\\mu_0$ from $\\bar{x}$.", "符号反了：应当用 $\\bar{x}$ 减去 $\\mu_0$。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `$\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${k}} = ${s}$.`,
                    `$\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${k}} = ${s}$。`,
                  ),
                ],
                [
                  ["Standardize the sample mean", "把样本均值标准化"],
                  t(
                    `$z = \\frac{${xBar} - ${mu0}}{${s}} = \\frac{${d * s}}{${s}} = ${z}$.`,
                    `$z = \\frac{${xBar} - ${mu0}}{${s}} = \\frac{${d * s}}{${s}} = ${z}$。`,
                  ),
                ],
              ],
              t(
                `$\\bar{x} = ${xBar}$ lies $${Math.abs(d)}$ standard error${Math.abs(d) === 1 ? "" : "s"} of $${s}$ ${d > 0 ? "above" : "below"} $${mu0}$, matching the size and sign of $z$.`,
                `$\\bar{x} = ${xBar}$ 比 $${mu0}$ ${d > 0 ? "高" : "低"} $${Math.abs(d)}$ 个标准误（每个为 $${s}$），与 $z$ 的大小和符号一致。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-p-value-of-a-z-test",
        title: t("The $p$-value of a $z$-test", "$z$ 检验的 $p$ 值"),
        explanation: t(
          "The $p$-value is the probability, under $H_0$, of a statistic at least as extreme as the observed $z$, measured in the direction of $H_1$:\n\n- right-tailed: $p = 1 - \\Phi(z)$;\n- left-tailed: $p = \\Phi(z)$;\n- two-tailed: $p = 2\\left(1 - \\Phi(|z|)\\right)$.\n\nReject $H_0$ when $p \\le \\alpha$. A two-tailed $p$-value is twice the one-tailed one, because results as extreme in the other direction count too. With $z = 1.2$ and $\\Phi(1.2) = 0.8849$: the right-tailed $p$-value is $0.1151$ and the two-tailed one is $0.2302$.\n\n> **Watch out.** Take the tail that $H_1$ points to. A left-tailed test with a positive $z$ has $p > 0.5$, and a two-tailed test doubles the single tail.",
          "$p$ 值是在 $H_0$ 下，沿 $H_1$ 的方向出现至少与观测值 $z$ 一样极端的统计量的概率：\n\n- 右侧：$p = 1 - \\Phi(z)$；\n- 左侧：$p = \\Phi(z)$；\n- 双侧：$p = 2\\left(1 - \\Phi(|z|)\\right)$。\n\n当 $p \\le \\alpha$ 时拒绝 $H_0$。双侧 $p$ 值是单侧的两倍，因为另一方向同样极端的结果也要计入。若 $z = 1.2$，$\\Phi(1.2) = 0.8849$：右侧 $p$ 值为 $0.1151$，双侧 $p$ 值为 $0.2302$。\n\n> **注意。** 要取 $H_1$ 所指的那一尾。$z$ 为正的左侧检验有 $p > 0.5$；双侧检验要把单尾面积加倍。",
        ),
        generate: (rng: Rng): Problem => {
          const zv = rng.pick([-2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5]);
          const kind = rng.int(0, 2);
          const k = rng.int(3, 10);
          const se = rng.int(1, 6);
          const mu0 = rng.int(20, 200);
          const xbar = Q.of(mu0).add(Q.parse(String(zv)).mul(Q.of(se)));
          const right = Q.one.sub(phi(zv));
          const left = phi(zv);
          const two = Q.of(2).mul(Q.one.sub(phi(Math.abs(zv))));
          const ans = [right, left, two][kind] ?? two;
          const oneTail = Q.one.sub(phi(Math.abs(zv)));
          const op = [">", "<", "\\neq"][kind];
          const onSide = kind === 0 ? zv > 0 : zv < 0;
          return numberProblem({
            prompt: t(
              `A sample of $n = ${k * k}$ from a normal population with $\\sigma = ${se * k}$ has $\\bar{x} = ${dec(xbar)}$. Find the $p$-value for testing $H_0: \\mu = ${mu0}$ against $H_1: \\mu ${op} ${mu0}$. Use ${PHI_TABLE.en}.`,
              `来自 $\\sigma = ${se * k}$ 的正态总体、容量 $n = ${k * k}$ 的样本有 $\\bar{x} = ${dec(xbar)}$。求检验 $H_0: \\mu = ${mu0}$ 对 $H_1: \\mu ${op} ${mu0}$ 的 $p$ 值。利用${PHI_TABLE["zh-CN"]}。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: distinct(ans, [
              why(
                right,
                "That is $1 - \\Phi(z)$, the area to the right of $z$; it is the $p$-value only for $H_1: \\mu > \\mu_0$.",
                "那是 $1 - \\Phi(z)$，即 $z$ 右侧的面积；只有 $H_1: \\mu > \\mu_0$ 时它才是 $p$ 值。",
              ),
              why(
                left,
                "That is $\\Phi(z)$, the area to the left of $z$; it is the $p$-value only for $H_1: \\mu < \\mu_0$.",
                "那是 $\\Phi(z)$，即 $z$ 左侧的面积；只有 $H_1: \\mu < \\mu_0$ 时它才是 $p$ 值。",
              ),
              why(two, "That doubles the tail area, which only a two-tailed test does.", "那把尾部面积加倍了，只有双侧检验才这样做。"),
              why(
                oneTail,
                "That is a single tail beyond $|z|$; a two-tailed test counts both tails.",
                "那只是 $|z|$ 以外的一侧尾部；双侧检验要计入两侧。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Standardize the sample mean", "把样本均值标准化"],
                  t(
                    `$z = \\frac{${dec(xbar)} - ${mu0}}{${se * k}/${k}} = ${zv}$.`,
                    `$z = \\frac{${dec(xbar)} - ${mu0}}{${se * k}/${k}} = ${zv}$。`,
                  ),
                ],
                [
                  ["Take the tail of the alternative", "取备择假设所指的尾部"],
                  t(
                    `${["For a right-tailed test, $p = 1 - \\Phi(z)$", "For a left-tailed test, $p = \\Phi(z)$", "For a two-tailed test, $p = 2(1 - \\Phi(|z|))$"][kind]} $= ${dec(ans)}$.`,
                    `${["右侧检验 $p = 1 - \\Phi(z)$", "左侧检验 $p = \\Phi(z)$", "双侧检验 $p = 2(1 - \\Phi(|z|))$"][kind]} $= ${dec(ans)}$。`,
                  ),
                ],
              ],
              kind === 2
                ? t(
                    `$p$ is twice the single tail $1 - \\Phi(${Math.abs(zv)}) = ${dec(oneTail)}$.`,
                    `$p$ 是单侧尾部 $1 - \\Phi(${Math.abs(zv)}) = ${dec(oneTail)}$ 的两倍。`,
                  )
                : t(
                    `$z$ lies on the ${onSide ? "same side as" : "opposite side from"} $H_1$, so $p$ is ${onSide ? "below" : "above"} $0.5$.`,
                    `$z$ 与 $H_1$ 在${onSide ? "同一侧" : "相反的一侧"}，所以 $p$ ${onSide ? "小于" : "大于"} $0.5$。`,
                  ),
            ),
          });
        },
      },
    ],
  },

  // 8.28.8 Hypothesis Tests for One Mean: Unknown Population Variance
  {
    id: "hypothesis-tests-for-one-mean-unknown-population-variance",
    title: t("Hypothesis Tests for One Mean: Unknown Population Variance", "单总体均值的假设检验：未知总体方差"),
    summary: t(
      "With unknown variance and a normal population, use $T = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}$, which follows a $t$-distribution with $n - 1$ degrees of freedom under $H_0$.",
      "总体方差未知且总体为正态时，用 $T = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}$，在 $H_0$ 下服从自由度为 $n - 1$ 的 $t$ 分布。",
    ),
    intro: t(
      "A sample of $16$ has $\\bar{x} = 54.8$ and $s = 8$; test $H_0: \\mu = 50$ against $H_1: \\mu \\neq 50$. The estimated standard error is $\\frac{8}{4} = 2$, so $t = \\frac{4.8}{2} = 2.4$ with $15$ degrees of freedom. Since $t_{0.025, 15} = 2.131$, the test rejects $H_0$.\n\nCheck: $50 + 2.4 \\cdot 2 = 54.8$, the sample mean.\n\nIn this lesson we compute the $t$ statistic for one mean, decide a $t$-test and bracket a $p$-value from a $t$ table.",
      "容量为 $16$ 的样本有 $\\bar{x} = 54.8$，$s = 8$；检验 $H_0: \\mu = 50$ 对 $H_1: \\mu \\neq 50$。估计标准误为 $\\frac{8}{4} = 2$，所以 $t = \\frac{4.8}{2} = 2.4$，自由度为 $15$。由于 $t_{0.025, 15} = 2.131$，检验拒绝 $H_0$。\n\n检验：$50 + 2.4 \\cdot 2 = 54.8$，正是样本均值。\n\n本课我们计算单个均值的 $t$ 统计量，对 $t$ 检验作出决策，并由 $t$ 表确定 $p$ 值的范围。",
    ),
    prerequisites: [
      "hypothesis-tests-for-one-mean-known-population-variance",
      "confidence-intervals-for-one-mean-unknown-population-variance",
    ],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "one-mean-unknown-variance-t-statistic",
        title: t("Computing the one-sample t-test statistic", "计算单样本 t 检验统计量"),
        explanation: t(
          "When the population standard deviation is unknown, the sample standard deviation replaces it, and the statistic follows a t distribution instead. The test statistic is $t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}$ with $df = n - 1$. With $\\mu_0 = 4.2$, $n = 4$, $s = 0.6$ and $\\bar{x} = 4.8$: $\\frac{s}{\\sqrt{n}} = 0.3$, so $t = \\frac{0.6}{0.3} = 2$ with $3$ degrees of freedom.\n\n> **Watch out.** Divide by $\\frac{s}{\\sqrt{n}}$, not by $s$, and the degrees of freedom are $n - 1$, not $n$.",
          "当总体标准差未知时，用样本标准差代替它，统计量改为服从 t 分布。检验统计量为 $t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}$，自由度 $df = n - 1$。若 $\\mu_0 = 4.2$，$n = 4$，$s = 0.6$，$\\bar{x} = 4.8$：$\\frac{s}{\\sqrt{n}} = 0.3$，所以 $t = \\frac{0.6}{0.3} = 2$，自由度为 $3$。\n\n> **注意。** 要除以 $\\frac{s}{\\sqrt{n}}$ 而不是 $s$；自由度是 $n - 1$，不是 $n$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 10);
          const n = k * k;
          const mult = rng.int(2, 6);
          const s = k * mult;
          const mu0 = rng.int(40, 300);
          const d = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
          const xBar = mu0 + d * mult;
          const tVal = d;

          return numberProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ drawn from a normal population produces a sample mean $\\bar{x} = ${xBar}$ and sample standard deviation $s = ${s}$. To test $H_0: \\mu = ${mu0}$, compute the value of the test statistic $t$.`,
              `从正态总体中抽取容量为 $n = ${n}$ 的随机样本，得样本均值 $\\bar{x} = ${xBar}$ 及样本标准差 $s = ${s}$。为检验 $H_0: \\mu = ${mu0}$，计算检验统计量 $t$ 的值。`,
            ),
            answer: tVal,
            mistakes: distinct(tVal, [
              why(
                Q.of(d * mult, s),
                "That divides by $s$ instead of the standard error $\\frac{s}{\\sqrt{n}}$.",
                "那除以的是 $s$，而不是标准误 $\\frac{s}{\\sqrt{n}}$。",
              ),
              why(
                d * mult,
                "That is $\\bar{x} - \\mu_0$, not yet divided by the standard error.",
                "那是 $\\bar{x} - \\mu_0$，还没有除以标准误。",
              ),
              why(
                d * k,
                "That divides by $\\frac{s}{n}$ instead of $\\frac{s}{\\sqrt{n}}$.",
                "那除以的是 $\\frac{s}{n}$，而不是 $\\frac{s}{\\sqrt{n}}$。",
              ),
              why(-d, "The sign is flipped: subtract $\\mu_0$ from $\\bar{x}$.", "符号反了：应当用 $\\bar{x}$ 减去 $\\mu_0$。"),
            ]),
            solution: walked(
              [
                [
                  ["Estimate the standard error", "估计标准误"],
                  t(
                    `$\\frac{s}{\\sqrt{n}} = \\frac{${s}}{\\sqrt{${n}}} = \\frac{${s}}{${k}} = ${mult}$.`,
                    `$\\frac{s}{\\sqrt{n}} = \\frac{${s}}{\\sqrt{${n}}} = \\frac{${s}}{${k}} = ${mult}$。`,
                  ),
                ],
                [
                  ["Standardize the sample mean", "把样本均值标准化"],
                  t(
                    `$t = \\frac{${xBar} - ${mu0}}{${mult}} = \\frac{${d * mult}}{${mult}} = ${tVal}$, with $\\nu = ${n} - 1 = ${n - 1}$ degrees of freedom.`,
                    `$t = \\frac{${xBar} - ${mu0}}{${mult}} = \\frac{${d * mult}}{${mult}} = ${tVal}$，自由度 $\\nu = ${n} - 1 = ${n - 1}$。`,
                  ),
                ],
              ],
              t(
                `$\\bar{x} = ${xBar}$ lies $${Math.abs(d)}$ estimated standard error${Math.abs(d) === 1 ? "" : "s"} of $${mult}$ ${d > 0 ? "above" : "below"} $${mu0}$, matching the size and sign of $t$.`,
                `$\\bar{x} = ${xBar}$ 比 $${mu0}$ ${d > 0 ? "高" : "低"} $${Math.abs(d)}$ 个估计标准误（每个为 $${mult}$），与 $t$ 的大小和符号一致。`,
              ),
            ),
          });
        },
      },
      {
        id: "deciding-a-t-test",
        title: t("Deciding a $t$-test", "$t$ 检验的决策"),
        explanation: t(
          "Compute $t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}$ and compare it with the critical value of the $t$-distribution with $n - 1$ degrees of freedom: $t \\ge t_{\\alpha, n-1}$ for a right-tailed test, $|t| \\ge t_{\\alpha/2, n-1}$ for a two-tailed one.\n\nThe $t$ critical values are larger than the $z$ values, so a statistic that would be significant against $1.96$ may fall short against $t_{0.025, 8} = 2.306$. Using the $z$ table for a small sample rejects too often. With $n = 4$, $t_{0.025, 3} = 3.182$, so a two-tailed $t = 2.5$ does not reject.\n\n> **Watch out.** Read the table at $n - 1$ degrees of freedom, and in a two-tailed test compare $|t|$ with $t_{\\alpha/2, n-1}$, not $t_{\\alpha, n-1}$.",
          "计算 $t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}$，并与自由度为 $n - 1$ 的 $t$ 分布临界值比较：右侧检验要求 $t \\ge t_{\\alpha, n-1}$，双侧检验要求 $|t| \\ge t_{\\alpha/2, n-1}$。\n\n$t$ 临界值比 $z$ 值大，所以一个对 $1.96$ 显著的统计量，对 $t_{0.025, 8} = 2.306$ 可能并不显著。小样本用 $z$ 表会过多地拒绝。若 $n = 4$，$t_{0.025, 3} = 3.182$，所以双侧检验中 $t = 2.5$ 不拒绝。\n\n> **注意。** 要按自由度 $n - 1$ 查表；双侧检验要把 $|t|$ 与 $t_{\\alpha/2, n-1}$ 比较，而不是 $t_{\\alpha, n-1}$。",
        ),
        generate: (rng: Rng): Problem => {
          const [k, t05, t025] = rng.pick([
            [3, "1.860", "2.306"],
            [4, "1.753", "2.131"],
            [5, "1.711", "2.064"],
          ] as const);
          const n = k * k;
          const two = rng.bool();
          const crit = two ? t025 : t05;
          const tv = Q.of(rng.int(two ? -30 : 5, 30), 10);
          const se = Q.of(rng.int(1, 5));
          const mu0 = rng.int(20, 200);
          const xbar = Q.of(mu0).add(tv.mul(se));
          const reject = (two ? tv.abs() : tv).cmp(Q.parse(crit)) >= 0;
          const tName = `t_{${two ? "0.025" : "0.05"}, ${n - 1}}`;
          const stat = two ? `$|t| = ${dec(tv.abs())}$` : `$t = ${dec(tv)}$`;
          const options = [t("Reject $H_0$", "拒绝 $H_0$"), t("Do not reject $H_0$", "不拒绝 $H_0$")];
          const side = tv.cmp(Q.of(0));
          return reasoned(
            choiceProblem({
              prompt: t(
                `A sample of $n = ${n}$ from a normal population has $\\bar{x} = ${dec(xbar)}$ and $s = ${dec(se.mul(Q.of(k)))}$. Test $H_0: \\mu = ${mu0}$ against $H_1: \\mu ${two ? "\\neq" : ">"} ${mu0}$ at $\\alpha = 0.05$, using $${tName} = ${crit}$. What is the conclusion?`,
                `来自正态总体、容量 $n = ${n}$ 的样本有 $\\bar{x} = ${dec(xbar)}$，$s = ${dec(se.mul(Q.of(k)))}$。在 $\\alpha = 0.05$ 下检验 $H_0: \\mu = ${mu0}$ 对 $H_1: \\mu ${two ? "\\neq" : ">"} ${mu0}$，取 $${tName} = ${crit}$。结论是什么？`,
              ),
              options,
              correct: reject ? 0 : 1,
              solution: walked(
                [
                  [
                    ["Compute the statistic", "计算统计量"],
                    t(
                      `$t = \\frac{${dec(xbar)} - ${mu0}}{${dec(se.mul(Q.of(k)))}/${k}} = ${dec(tv)}$.`,
                      `$t = \\frac{${dec(xbar)} - ${mu0}}{${dec(se.mul(Q.of(k)))}/${k}} = ${dec(tv)}$。`,
                    ),
                  ],
                  [
                    ["Compare with the critical value", "与临界值比较"],
                    t(
                      `${stat} is ${reject ? "at least" : "less than"} $${crit}$, so ${reject ? "reject" : "do not reject"} $H_0$.`,
                      `${stat}${reject ? "不小于" : "小于"} $${crit}$，所以${reject ? "拒绝" : "不拒绝"} $H_0$。`,
                    ),
                  ],
                ],
                t(
                  side === 0
                    ? `$\\bar{x}$ equals $${mu0}$, so $t = 0$ and the data give no evidence against $H_0$.`
                    : `$\\bar{x}$ lies $${dec(tv.abs())}$ estimated standard errors of $${dec(se)}$ ${side > 0 ? "above" : "below"} $${mu0}$, so $t = ${dec(tv)}$.`,
                  side === 0
                    ? `$\\bar{x}$ 等于 $${mu0}$，所以 $t = 0$，数据没有提供反对 $H_0$ 的证据。`
                    : `$\\bar{x}$ 比 $${mu0}$ ${side > 0 ? "高" : "低"} $${dec(tv.abs())}$ 个估计标准误（每个为 $${dec(se)}$），所以 $t = ${dec(tv)}$。`,
                ),
              ),
            }),
            [
              [
                options[0]!.en,
                `${stat} is below $${crit}$, so the sample mean is not far enough from $${mu0}$.`,
                `${stat} 低于 $${crit}$，所以样本均值离 $${mu0}$ 不够远。`,
              ],
              [options[1]!.en, `${stat} reaches $${crit}$, so $H_0$ is rejected.`, `${stat} 达到了 $${crit}$，所以拒绝 $H_0$。`],
            ],
          );
        },
      },
    ],
  },

  // 8.28.9 Hypothesis Tests for One Variance
  {
    id: "hypothesis-tests-for-one-variance",
    title: t("Hypothesis Tests for One Variance", "单总体方差的假设检验"),
    summary: t(
      "To test $H_0: \\sigma^2 = \\sigma_0^2$ for a normal population, use $\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2}$, which follows $\\chi^2(n - 1)$ under $H_0$.",
      "检验正态总体的 $H_0: \\sigma^2 = \\sigma_0^2$ 时，用 $\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2}$，在 $H_0$ 下服从 $\\chi^2(n - 1)$。",
    ),
    intro: t(
      "A sample of $11$ has $s^2 = 18$, and the claim is $\\sigma^2 = 10$. The statistic is $\\chi^2 = \\frac{10 \\cdot 18}{10} = 18$ with $10$ degrees of freedom. For $H_1: \\sigma^2 > 10$ at $\\alpha = 0.05$ the critical value is $18.307$, so $H_0$ is not rejected, though only just.\n\nCheck: $\\chi^2 \\cdot \\frac{\\sigma_0^2}{n - 1} = 18 \\cdot \\frac{10}{10} = 18$, the sample variance.\n\nIn this lesson we compute the chi-square statistic for a variance, decide a two-tailed chi-square test and find the smallest sample variance that rejects.",
      "容量为 $11$ 的样本有 $s^2 = 18$，声称 $\\sigma^2 = 10$。统计量为 $\\chi^2 = \\frac{10 \\cdot 18}{10} = 18$，自由度为 $10$。在 $\\alpha = 0.05$ 下对 $H_1: \\sigma^2 > 10$，临界值为 $18.307$，所以不拒绝 $H_0$，但只差一点。\n\n检验：$\\chi^2 \\cdot \\frac{\\sigma_0^2}{n - 1} = 18 \\cdot \\frac{10}{10} = 18$，正是样本方差。\n\n本课我们计算方差的卡方统计量，对双侧卡方检验作出决策，并求能拒绝原假设的最小样本方差。",
    ),
    prerequisites: ["confidence-intervals-for-one-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "one-variance-chi-square-statistic",
        title: t("Computing the chi-square statistic for one variance", "计算单方差的卡方检验统计量"),
        explanation: t(
          "Scaling the sample variance by its degrees of freedom and dividing by the hypothesized variance gives a statistic with a chi square distribution. The test statistic is $\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2}$. With $n = 6$, $s^2 = 2.5$ and $\\sigma_0^2 = 5$: $\\chi^2 = \\frac{5 \\cdot 2.5}{5} = 2.5$.\n\n> **Watch out.** Multiply by $n - 1$, not $n$, and put the hypothesized variance $\\sigma_0^2$ in the denominator, not $s^2$.",
          "把样本方差乘以自由度再除以假设的方差，得到一个服从卡方分布的统计量。检验统计量为 $\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2}$。若 $n = 6$，$s^2 = 2.5$，$\\sigma_0^2 = 5$：$\\chi^2 = \\frac{5 \\cdot 2.5}{5} = 2.5$。\n\n> **注意。** 要乘以 $n - 1$ 而不是 $n$；分母是假设的方差 $\\sigma_0^2$，不是 $s^2$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(10, 50);
          const df = n - 1;
          const sigma0Sq = rng.int(10, 80);
          const sSq = rng.pick([...Array(71).keys()].map((i) => i + 10).filter((v) => v !== sigma0Sq));
          const num = df * sSq;
          const den = sigma0Sq;

          return numberProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ from a normal distribution has sample variance $s^2 = ${sSq}$. Test $H_0: \\sigma^2 = ${sigma0Sq}$. Find the exact rational value of the test statistic $\\chi^2$.`,
              `从正态分布中抽取容量为 $n = ${n}$ 的随机样本，测得样本方差 $s^2 = ${sSq}$。检验 $H_0: \\sigma^2 = ${sigma0Sq}$。求检验统计量 $\\chi^2$ 的精确有理数值。`,
            ),
            answer: Q.of(num, den),
            mistakes: distinct(Q.of(num, den), [
              why(
                Q.of(n * sSq, sigma0Sq),
                `That multiplies by $n = ${n}$; the degrees of freedom are $n - 1 = ${df}$.`,
                `那乘的是 $n = ${n}$；自由度是 $n - 1 = ${df}$。`,
              ),
              why(
                Q.of(sSq, sigma0Sq),
                "That is only $\\frac{s^2}{\\sigma_0^2}$; it still has to be multiplied by $n - 1$.",
                "那只是 $\\frac{s^2}{\\sigma_0^2}$；还要乘以 $n - 1$。",
              ),
              why(
                Q.of(df * sigma0Sq, sSq),
                "That swaps the variances: $s^2$ goes in the numerator and $\\sigma_0^2$ in the denominator.",
                "那把两个方差对调了：$s^2$ 在分子，$\\sigma_0^2$ 在分母。",
              ),
            ]),
            solution: walked(
              [
                [["Find the degrees of freedom", "求自由度"], t(`$n - 1 = ${n} - 1 = ${df}$.`, `$n - 1 = ${n} - 1 = ${df}$。`)],
                [
                  ["Scale the variance ratio", "按自由度放大方差之比"],
                  t(
                    `$\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2} = \\frac{${df} \\times ${sSq}}{${sigma0Sq}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `$\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2} = \\frac{${df} \\times ${sSq}}{${sigma0Sq}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              t(
                `Under $H_0$ the statistic averages $n - 1 = ${df}$; here $s^2 = ${sSq}$ is ${sSq > sigma0Sq ? "above" : "below"} $\\sigma_0^2 = ${sigma0Sq}$, so $\\chi^2 \\approx ${(num / den).toFixed(2)}$ is ${sSq > sigma0Sq ? "above" : "below"} $${df}$.`,
                `在 $H_0$ 下统计量的均值为 $n - 1 = ${df}$；这里 $s^2 = ${sSq}$ ${sSq > sigma0Sq ? "大于" : "小于"} $\\sigma_0^2 = ${sigma0Sq}$，所以 $\\chi^2 \\approx ${(num / den).toFixed(2)}$ ${sSq > sigma0Sq ? "大于" : "小于"} $${df}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "deciding-a-chi-square-test-for-a-variance",
        title: t("Deciding a chi-square test for a variance", "方差卡方检验的决策"),
        explanation: t(
          "For a two-tailed test of $H_0: \\sigma^{2} = \\sigma_0^{2}$ at level $\\alpha$, the chi-square distribution is not symmetric, so there are two different critical values: reject when\n\n$$\\chi^{2} \\le \\chi^{2}_{1 - \\alpha/2, n-1} \\quad\\text{or}\\quad \\chi^{2} \\ge \\chi^{2}_{\\alpha/2, n-1}.$$\n\nA statistic below the lower value says the variance is smaller than claimed; one above the upper value says it is larger. Under $H_0$ the statistic averages $n - 1$. With $n = 5$, the critical values are $\\chi^{2}_{0.975, 4} = 0.484$ and $\\chi^{2}_{0.025, 4} = 11.143$, so a statistic of $0.3$ rejects $H_0$ and says the variance is smaller.\n\n> **Watch out.** The two critical values are not the same distance from $n - 1$; compare the statistic with each one separately, never with $\\pm$ a single value.",
          "对于水平 $\\alpha$ 下 $H_0: \\sigma^{2} = \\sigma_0^{2}$ 的双侧检验，卡方分布不对称，所以有两个不同的临界值：当\n\n$$\\chi^{2} \\le \\chi^{2}_{1 - \\alpha/2, n-1} \\quad\\text{或}\\quad \\chi^{2} \\ge \\chi^{2}_{\\alpha/2, n-1}$$\n\n时拒绝。统计量低于下临界值说明方差比所称的小；高于上临界值说明方差比所称的大。在 $H_0$ 下统计量的均值为 $n - 1$。若 $n = 5$，临界值为 $\\chi^{2}_{0.975, 4} = 0.484$ 和 $\\chi^{2}_{0.025, 4} = 11.143$，所以统计量为 $0.3$ 时拒绝 $H_0$，说明方差更小。\n\n> **注意。** 两个临界值与 $n - 1$ 的距离不同；要把统计量分别与每个临界值比较，绝不能用一个值加减。",
        ),
        generate: (rng: Rng): Problem => {
          const [n, hi, lo] = rng.pick([
            [10, "19.023", "2.700"],
            [15, "26.119", "5.629"],
            [20, "32.852", "8.907"],
            [25, "39.364", "12.401"],
          ] as const);
          const sigma0 = rng.int(2, 9) * 2;
          const s2 = rng.int(Math.ceil(sigma0 * sigma0 * 0.2), sigma0 * sigma0 * 2);
          const chi = Q.of((n - 1) * s2, sigma0 * sigma0);
          const which = chi.cmp(Q.parse(lo)) <= 0 ? 0 : chi.cmp(Q.parse(hi)) >= 0 ? 1 : 2;
          const options = [
            t("Reject $H_0$: the variance appears smaller than claimed", "拒绝 $H_0$：方差看来比所称的小"),
            t("Reject $H_0$: the variance appears larger than claimed", "拒绝 $H_0$：方差看来比所称的大"),
            t("Do not reject $H_0$", "不拒绝 $H_0$"),
          ];
          const chiText = chi.toNumber().toFixed(3);
          return reasoned(
            choiceProblem({
              prompt: t(
                `A sample of $n = ${n}$ from a normal population has $s^{2} = ${s2}$. Test $H_0: \\sigma^{2} = ${sigma0 * sigma0}$ against $H_1: \\sigma^{2} \\neq ${sigma0 * sigma0}$ at $\\alpha = 0.05$, with $\\chi^{2}_{0.975, ${n - 1}} = ${lo}$ and $\\chi^{2}_{0.025, ${n - 1}} = ${hi}$. What is the conclusion?`,
                `来自正态总体、容量 $n = ${n}$ 的样本有 $s^{2} = ${s2}$。在 $\\alpha = 0.05$ 下检验 $H_0: \\sigma^{2} = ${sigma0 * sigma0}$ 对 $H_1: \\sigma^{2} \\neq ${sigma0 * sigma0}$，已知 $\\chi^{2}_{0.975, ${n - 1}} = ${lo}$，$\\chi^{2}_{0.025, ${n - 1}} = ${hi}$。结论是什么？`,
              ),
              options,
              correct: which,
              solution: walked(
                [
                  [
                    ["Compute the statistic", "计算统计量"],
                    t(
                      `$\\chi^{2} = \\frac{(${n - 1})(${s2})}{${sigma0 * sigma0}} \\approx ${chiText}$.`,
                      `$\\chi^{2} = \\frac{(${n - 1})(${s2})}{${sigma0 * sigma0}} \\approx ${chiText}$。`,
                    ),
                  ],
                  [
                    ["Compare with both critical values", "与两个临界值比较"],
                    t(
                      `$${chiText}$ is ${["below the lower critical value", "above the upper critical value", "between the two critical values"][which]}, so ${which === 2 ? "do not reject $H_0$" : "reject $H_0$"}.`,
                      `$${chiText}$ ${["低于下临界值", "高于上临界值", "介于两个临界值之间"][which]}，所以${which === 2 ? "不拒绝 $H_0$" : "拒绝 $H_0$"}。`,
                    ),
                  ],
                ],
                t(
                  `$s^{2} = ${s2}$ is ${s2 > sigma0 * sigma0 ? "above" : s2 < sigma0 * sigma0 ? "below" : "equal to"} $${sigma0 * sigma0}$, so the statistic is ${s2 > sigma0 * sigma0 ? "above" : s2 < sigma0 * sigma0 ? "below" : "equal to"} its null mean $${n - 1}$${which === 2 ? ", but not far enough to pass a critical value" : ", on the side of the conclusion"}.`,
                  `$s^{2} = ${s2}$ ${s2 > sigma0 * sigma0 ? "大于" : s2 < sigma0 * sigma0 ? "小于" : "等于"} $${sigma0 * sigma0}$，所以统计量${s2 > sigma0 * sigma0 ? "大于" : s2 < sigma0 * sigma0 ? "小于" : "等于"}其原假设下的均值 $${n - 1}$${which === 2 ? "，但还没有越过任何一个临界值" : "，与结论所说的方向一致"}。`,
                ),
              ),
            }),
            [
              [
                options[0]!.en,
                which === 1
                  ? `$${chiText}$ is above the upper critical value, so the variance appears larger, not smaller.`
                  : `$${chiText}$ is above the lower critical value $${lo}$, so it is not small enough to reject.`,
                which === 1
                  ? `$${chiText}$ 高于上临界值，所以方差看来更大而不是更小。`
                  : `$${chiText}$ 高于下临界值 $${lo}$，不够小，不能拒绝。`,
              ],
              [
                options[1]!.en,
                which === 0
                  ? `$${chiText}$ is below the lower critical value, so the variance appears smaller, not larger.`
                  : `$${chiText}$ is below the upper critical value $${hi}$, so it is not large enough to reject.`,
                which === 0
                  ? `$${chiText}$ 低于下临界值，所以方差看来更小而不是更大。`
                  : `$${chiText}$ 低于上临界值 $${hi}$，不够大，不能拒绝。`,
              ],
              [
                options[2]!.en,
                `$${chiText}$ lies outside the interval from $${lo}$ to $${hi}$, so $H_0$ is rejected.`,
                `$${chiText}$ 落在 $${lo}$ 到 $${hi}$ 的区间之外，所以拒绝 $H_0$。`,
              ],
            ],
          );
        },
      },
    ],
  },

  // 8.29.1 Hypothesis Tests for Two Means: Known Population Variances
  {
    id: "hypothesis-tests-for-two-means-known-population-variances",
    title: t("Hypothesis Tests for Two Means: Known Population Variances", "双总体均值的假设检验：已知总体方差"),
    summary: t(
      "For two independent normal populations with known variances, test $H_0: \\mu_1 - \\mu_2 = \\Delta_0$ using $Z = \\frac{(\\bar{x}_1 - \\bar{x}_2) - \\Delta_0}{\\sqrt{\\sigma_1^2/n_1 + \\sigma_2^2/n_2}}$.",
      "对方差已知的两个独立正态总体，用 $Z = \\frac{(\\bar{x}_1 - \\bar{x}_2) - \\Delta_0}{\\sqrt{\\sigma_1^2/n_1 + \\sigma_2^2/n_2}}$ 检验 $H_0: \\mu_1 - \\mu_2 = \\Delta_0$。",
    ),
    intro: t(
      "Two classes average $\\bar{x}_1 = 82$ and $\\bar{x}_2 = 78$, with $\\frac{\\sigma_1^2}{n_1} = 2.5$ and $\\frac{\\sigma_2^2}{n_2} = 1.5$. The standard error of the difference is $\\sqrt{2.5 + 1.5} = 2$, so $z = \\frac{82 - 78}{2} = 2$, and the two-tailed $p$-value is $2(1 - 0.9772) = 0.0456$.\n\nCheck: $78 + 2 \\cdot 2 = 82$.\n\nIn this lesson we compute the two-sample $z$ statistic, find its $p$-value and test a difference of means other than zero.",
      "两个班的平均分为 $\\bar{x}_1 = 82$ 和 $\\bar{x}_2 = 78$，$\\frac{\\sigma_1^2}{n_1} = 2.5$，$\\frac{\\sigma_2^2}{n_2} = 1.5$。差的标准误为 $\\sqrt{2.5 + 1.5} = 2$，所以 $z = \\frac{82 - 78}{2} = 2$，双侧 $p$ 值为 $2(1 - 0.9772) = 0.0456$。\n\n检验：$78 + 2 \\cdot 2 = 82$。\n\n本课我们计算两样本 $z$ 统计量，求它的 $p$ 值，并检验不为零的均值之差。",
    ),
    prerequisites: [
      "hypothesis-tests-for-one-mean-known-population-variance",
      "confidence-intervals-for-differences-between-two-means-known-population-variances",
    ],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "two-mean-known-variance-z-statistic",
        title: t("Computing the two-sample z-test statistic", "计算双样本 z 检验统计量"),
        explanation: t(
          "Compare the observed difference of means with the hypothesized difference, measured in standard errors of the difference. $z = \\frac{(\\bar{x}_1 - \\bar{x}_2) - \\Delta_0}{SE}$, where $SE = \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$. If $\\frac{\\sigma_1^2}{n_1} = 0.09$ and $\\frac{\\sigma_2^2}{n_2} = 0.16$, then $SE = \\sqrt{0.25} = 0.5$, and a difference of $1.2$ gives $z = 2.4$.\n\n> **Watch out.** The means are subtracted, but their variances are **added** before the square root; and divide by $SE$, not by $SE^2$.",
          "把观测到的均值之差与假设的差进行比较，用差的标准误来度量。$z = \\frac{(\\bar{x}_1 - \\bar{x}_2) - \\Delta_0}{SE}$，其中 $SE = \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$。若 $\\frac{\\sigma_1^2}{n_1} = 0.09$，$\\frac{\\sigma_2^2}{n_2} = 0.16$，则 $SE = \\sqrt{0.25} = 0.5$，差为 $1.2$ 时 $z = 2.4$。\n\n> **注意。** 均值是相减的，但它们的方差要先**相加**再开平方；并且要除以 $SE$，不是 $SE^2$。",
        ),
        generate: (rng: Rng): Problem => {
          const pairs = [
            { v1: 9, v2: 16, se: 5 },
            { v1: 4, v2: 5, se: 3 },
            { v1: 1, v2: 3, se: 2 },
            { v1: 8, v2: 8, se: 4 },
            { v1: 18, v2: 7, se: 5 },
            { v1: 25, v2: 11, se: 6 },
            { v1: 36, v2: 13, se: 7 },
          ];
          const choice = rng.pick(pairs);
          const n1 = rng.int(10, 40);
          const n2 = rng.int(10, 40);
          const sig1Sq = choice.v1 * n1;
          const sig2Sq = choice.v2 * n2;
          const d = rng.pick([-3, -2, -1, 1, 2, 3]);
          const diff = d * choice.se;
          const xBar2 = rng.int(50, 150);
          const xBar1 = xBar2 + diff;

          return numberProblem({
            prompt: t(
              `Independent samples from two normal populations have sample means $\\bar{x}_1 = ${xBar1}$ ($n_1 = ${n1}$, $\\sigma_1^2 = ${sig1Sq}$) and $\\bar{x}_2 = ${xBar2}$ ($n_2 = ${n2}$, $\\sigma_2^2 = ${sig2Sq}$). To test $H_0: \\mu_1 - \\mu_2 = 0$, compute the test statistic $z$.`,
              `从两个正态总体抽取的独立样本均值分别为 $\\bar{x}_1 = ${xBar1}$（$n_1 = ${n1}$，$\\sigma_1^2 = ${sig1Sq}$）和 $\\bar{x}_2 = ${xBar2}$（$n_2 = ${n2}$，$\\sigma_2^2 = ${sig2Sq}$）。为检验 $H_0: \\mu_1 - \\mu_2 = 0$，计算检验统计量 $z$。`,
            ),
            answer: d,
            mistakes: distinct(d, [
              why(diff, "That is the difference of the means, not yet divided by the standard error.", "那是均值之差，还没有除以标准误。"),
              why(
                -d,
                "The sign is flipped: the statistic uses $\\bar{x}_1 - \\bar{x}_2$.",
                "符号反了：统计量用的是 $\\bar{x}_1 - \\bar{x}_2$。",
              ),
              why(
                Q.of(diff, choice.se * choice.se),
                "That divides by $SE^2$ instead of its square root.",
                "那除以的是 $SE^2$，而不是它的平方根。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `$\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2} = \\frac{${sig1Sq}}{${n1}} + \\frac{${sig2Sq}}{${n2}} = ${choice.v1} + ${choice.v2} = ${choice.se * choice.se}$, so $\\text{SE} = ${choice.se}$.`,
                    `$\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2} = \\frac{${sig1Sq}}{${n1}} + \\frac{${sig2Sq}}{${n2}} = ${choice.v1} + ${choice.v2} = ${choice.se * choice.se}$，故 $\\text{SE} = ${choice.se}$。`,
                  ),
                ],
                [
                  ["Standardize the difference", "把差标准化"],
                  t(
                    `$z = \\frac{${xBar1} - ${xBar2}}{${choice.se}} = \\frac{${diff}}{${choice.se}} = ${d}$.`,
                    `$z = \\frac{${xBar1} - ${xBar2}}{${choice.se}} = \\frac{${diff}}{${choice.se}} = ${d}$。`,
                  ),
                ],
              ],
              t(
                `The difference $${diff}$ is $${Math.abs(d)}$ standard error${Math.abs(d) === 1 ? "" : "s"} of $${choice.se}$ ${d > 0 ? "above" : "below"} $0$, matching $z = ${d}$.`,
                `差 $${diff}$ 比 $0$ ${d > 0 ? "高" : "低"} $${Math.abs(d)}$ 个标准误（每个为 $${choice.se}$），与 $z = ${d}$ 一致。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-p-value-of-a-two-sample-z-test",
        title: t("The $p$-value of a two-sample $z$-test", "两样本 $z$ 检验的 $p$ 值"),
        explanation: t(
          "After computing $z = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\sigma_1^{2}/n_1 + \\sigma_2^{2}/n_2}}$, find the $p$-value in the direction of $H_1$. For $H_1: \\mu_1 \\neq \\mu_2$ it is $2(1 - \\Phi(|z|))$; for $H_1: \\mu_1 > \\mu_2$ it is $1 - \\Phi(z)$.\n\nThe order of subtraction matters for a one-sided test: a large negative $z$ against $H_1: \\mu_1 > \\mu_2$ gives a $p$-value near $1$, not near $0$. With $z = -1.2$ against $H_1: \\mu_1 > \\mu_2$: $p = 1 - \\Phi(-1.2) = \\Phi(1.2) = 0.8849$.\n\n> **Watch out.** Only the two-sided test uses $|z|$ and doubles the tail; a one-sided test keeps the sign of $z$.",
          "算出 $z = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\sigma_1^{2}/n_1 + \\sigma_2^{2}/n_2}}$ 后，沿 $H_1$ 的方向求 $p$ 值。$H_1: \\mu_1 \\neq \\mu_2$ 时为 $2(1 - \\Phi(|z|))$；$H_1: \\mu_1 > \\mu_2$ 时为 $1 - \\Phi(z)$。\n\n单侧检验中相减的顺序很重要：对 $H_1: \\mu_1 > \\mu_2$，绝对值很大的负 $z$ 给出接近 $1$ 而不是接近 $0$ 的 $p$ 值。对 $H_1: \\mu_1 > \\mu_2$，若 $z = -1.2$：$p = 1 - \\Phi(-1.2) = \\Phi(1.2) = 0.8849$。\n\n> **注意。** 只有双侧检验才用 $|z|$ 并把尾部加倍；单侧检验要保留 $z$ 的符号。",
        ),
        generate: (rng: Rng): Problem => {
          const [a, b, c] = rng.pick([
            [3, 4, 5],
            [6, 8, 10],
            [8, 6, 10],
            [4, 3, 5],
          ] as const);
          const n = rng.pick([4, 9, 16]);
          const r = Math.sqrt(n);
          const zv = rng.pick([-2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5]);
          const two = rng.bool();
          const diff = Q.parse(String(zv)).mul(Q.of(c));
          const x2 = rng.int(40, 90);
          const x1 = Q.of(x2).add(diff);
          const ans = two ? Q.of(2).mul(Q.one.sub(phi(Math.abs(zv)))) : Q.one.sub(phi(zv));
          const oneTail = Q.one.sub(phi(Math.abs(zv)));
          return numberProblem({
            prompt: t(
              `Independent samples of size $n_1 = n_2 = ${n}$ come from normal populations with $\\sigma_1 = ${a * r}$ and $\\sigma_2 = ${b * r}$; the sample means are $\\bar{x}_1 = ${dec(x1)}$ and $\\bar{x}_2 = ${x2}$. Find the $p$-value for $H_0: \\mu_1 = \\mu_2$ against $H_1: \\mu_1 ${two ? "\\neq" : ">"} \\mu_2$. Use ${PHI_TABLE.en}.`,
              `从 $\\sigma_1 = ${a * r}$ 和 $\\sigma_2 = ${b * r}$ 的两个正态总体中各抽取容量 $n_1 = n_2 = ${n}$ 的独立样本，样本均值为 $\\bar{x}_1 = ${dec(x1)}$，$\\bar{x}_2 = ${x2}$。求 $H_0: \\mu_1 = \\mu_2$ 对 $H_1: \\mu_1 ${two ? "\\neq" : ">"} \\mu_2$ 的 $p$ 值。利用${PHI_TABLE["zh-CN"]}。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: distinct(ans, [
              two
                ? why(oneTail, "That is a single tail; a two-sided test counts both tails.", "那只是一侧尾部；双侧检验要计入两侧。")
                : why(
                    Q.of(2).mul(oneTail),
                    "That doubles the tail, which only a two-sided test does.",
                    "那把尾部加倍了，只有双侧检验才这样做。",
                  ),
              two
                ? why(
                    phi(zv),
                    "That is $\\Phi(z)$, the area to the left of $z$, not the two tails beyond $|z|$.",
                    "那是 $\\Phi(z)$，即 $z$ 左侧的面积，而不是 $|z|$ 以外的两侧尾部。",
                  )
                : why(
                    phi(zv),
                    "That is $\\Phi(z)$, the area to the left of $z$; the alternative points to the right.",
                    "那是 $\\Phi(z)$，即 $z$ 左侧的面积；而备择假设指向右侧。",
                  ),
            ]),
            solution: walked(
              [
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `$\\sqrt{\\frac{${a * a * n}}{${n}} + \\frac{${b * b * n}}{${n}}} = \\sqrt{${a * a} + ${b * b}} = ${c}$.`,
                    `$\\sqrt{\\frac{${a * a * n}}{${n}} + \\frac{${b * b * n}}{${n}}} = \\sqrt{${a * a} + ${b * b}} = ${c}$。`,
                  ),
                ],
                [
                  ["Standardize the difference", "把差标准化"],
                  t(`$z = \\frac{${dec(x1)} - ${x2}}{${c}} = ${zv}$.`, `$z = \\frac{${dec(x1)} - ${x2}}{${c}} = ${zv}$。`),
                ],
                [
                  ["Take the tail of the alternative", "取备择假设所指的尾部"],
                  t(
                    `$p = ${two ? `2(1 - \\Phi(${Math.abs(zv)}))` : `1 - \\Phi(${zv})`} = ${dec(ans)}$.`,
                    `$p = ${two ? `2(1 - \\Phi(${Math.abs(zv)}))` : `1 - \\Phi(${zv})`} = ${dec(ans)}$。`,
                  ),
                ],
              ],
              two
                ? t(`$p$ is twice the single tail $${dec(oneTail)}$.`, `$p$ 是单侧尾部 $${dec(oneTail)}$ 的两倍。`)
                : t(
                    `$z$ is ${zv > 0 ? "positive, on the side of" : "negative, against"} $H_1$, so $p$ is ${zv > 0 ? "below" : "above"} $0.5$.`,
                    `$z$ 为${zv > 0 ? "正，与 $H_1$ 同向" : "负，与 $H_1$ 反向"}，所以 $p$ ${zv > 0 ? "小于" : "大于"} $0.5$。`,
                  ),
            ),
          });
        },
      },
    ],
  },

  // 8.29.2 Hypothesis Tests for Two Means: Equal But Unknown Population Variances
  {
    id: "hypothesis-tests-for-two-means-equal-but-unknown-population-variances",
    title: t("Hypothesis Tests for Two Means: Equal But Unknown Population Variances", "双总体均值的假设检验：未知但相等总体方差"),
    summary: t(
      "Assuming equal variances, use the pooled variance $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$ and a $t$-statistic with $n_1 + n_2 - 2$ degrees of freedom.",
      "假设两方差相等时，使用合并方差 $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$ 和自由度为 $n_1 + n_2 - 2$ 的 $t$ 统计量。",
    ),
    intro: t(
      "Two samples of $10$ have $s_1^2 = 20$ and $s_2^2 = 16$. Pooling gives $s_p^2 = \\frac{9(20) + 9(16)}{18} = 18$. With a difference of means of $6$, the standard error is $\\sqrt{18\\left(\\frac{1}{10} + \\frac{1}{10}\\right)} = \\sqrt{3.6} \\approx 1.897$, so $t \\approx 3.16$ with $18$ degrees of freedom.\n\nCheck: $s_p^2 = 18$ lies midway between $16$ and $20$, as it must for samples of the same size.\n\nIn this lesson we pool two sample variances, compute the pooled $t$ statistic and choose its degrees of freedom.",
      "两个容量为 $10$ 的样本有 $s_1^2 = 20$，$s_2^2 = 16$。合并得 $s_p^2 = \\frac{9(20) + 9(16)}{18} = 18$。均值之差为 $6$ 时，标准误为 $\\sqrt{18\\left(\\frac{1}{10} + \\frac{1}{10}\\right)} = \\sqrt{3.6} \\approx 1.897$，所以 $t \\approx 3.16$，自由度为 $18$。\n\n检验：$s_p^2 = 18$ 恰在 $16$ 与 $20$ 的正中，两样本同样大时理应如此。\n\n本课我们合并两个样本方差，计算合并 $t$ 统计量，并确定它的自由度。",
    ),
    prerequisites: [
      "hypothesis-tests-for-one-mean-unknown-population-variance",
      "confidence-intervals-for-differences-between-two-means-unknown-equal-population-variances",
    ],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "pooled-variance-calculation",
        title: t("Computing pooled sample variance", "计算合并样本方差"),
        explanation: t(
          "The pooled variance is a weighted average of the two sample variances, giving more weight to the larger sample. The pooled variance is $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$. With $n_1 = 3$, $s_1^2 = 2.5$, $n_2 = 5$ and $s_2^2 = 4$: $s_p^2 = \\frac{2(2.5) + 4(4)}{6} = \\frac{21}{6} = 3.5$.\n\n> **Watch out.** Weight each variance by $n - 1$, not $n$, and divide by $n_1 + n_2 - 2$; a plain average of the two variances ignores the sample sizes.",
          "合并方差是两个样本方差的加权平均，较大的样本权重更大。合并方差为 $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$。若 $n_1 = 3$，$s_1^2 = 2.5$，$n_2 = 5$，$s_2^2 = 4$：$s_p^2 = \\frac{2(2.5) + 4(4)}{6} = \\frac{21}{6} = 3.5$。\n\n> **注意。** 每个方差的权重是 $n - 1$ 而不是 $n$，再除以 $n_1 + n_2 - 2$；两个方差的简单平均忽略了样本量。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(6, 25);
          const n2 = rng.int(6, 25);
          const df1 = n1 - 1;
          const df2 = n2 - 1;
          const s1Sq = rng.int(10, 60);
          const s2Sq = rng.int(10, 60);
          const num = df1 * s1Sq + df2 * s2Sq;
          const den = df1 + df2;

          return numberProblem({
            prompt: t(
              `Two independent samples have sizes $n_1 = ${n1}$ (variance $s_1^2 = ${s1Sq}$) and $n_2 = ${n2}$ (variance $s_2^2 = ${s2Sq}$). Under the equal variances assumption, find the exact rational value of the pooled sample variance $s_p^2$.`,
              `两个独立样本的容量分别为 $n_1 = ${n1}$（方差 $s_1^2 = ${s1Sq}$）和 $n_2 = ${n2}$（方差 $s_2^2 = ${s2Sq}$）。在方差齐性假定下，求合并样本方差 $s_p^2$ 的精确有理数值。`,
            ),
            answer: Q.of(num, den),
            mistakes: distinct(Q.of(num, den), [
              why(
                Q.of(s1Sq + s2Sq, 2),
                "That is the plain average of the variances, which ignores the sample sizes.",
                "那是两个方差的简单平均，忽略了样本量。",
              ),
              why(
                Q.of(n1 * s1Sq + n2 * s2Sq, n1 + n2),
                "That weights by $n$; the weights are the degrees of freedom $n - 1$.",
                "那是按 $n$ 加权的；权重应是自由度 $n - 1$。",
              ),
              why(
                Q.of(num, den + 2),
                "That divides by $n_1 + n_2$; the denominator is $n_1 + n_2 - 2$.",
                "那除以的是 $n_1 + n_2$；分母应是 $n_1 + n_2 - 2$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Weight each variance", "给每个方差加权"],
                  t(
                    `$(${df1})(${s1Sq}) + (${df2})(${s2Sq}) = ${df1 * s1Sq} + ${df2 * s2Sq} = ${num}$.`,
                    `$(${df1})(${s1Sq}) + (${df2})(${s2Sq}) = ${df1 * s1Sq} + ${df2 * s2Sq} = ${num}$。`,
                  ),
                ],
                [
                  ["Divide by the total degrees of freedom", "除以总自由度"],
                  t(
                    `$s_p^2 = \\frac{${num}}{${df1} + ${df2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `$s_p^2 = \\frac{${num}}{${df1} + ${df2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              s1Sq === s2Sq
                ? t(
                    `Both variances are $${s1Sq}$, so the pooled variance is $${s1Sq}$ too.`,
                    `两个方差都是 $${s1Sq}$，所以合并方差也是 $${s1Sq}$。`,
                  )
                : t(
                    `$s_p^2 \\approx ${(num / den).toFixed(2)}$ lies between $${s1Sq}$ and $${s2Sq}$${n1 === n2 ? ", at their midpoint since the samples are the same size" : `, nearer the variance of the larger sample, $${n1 > n2 ? s1Sq : s2Sq}$`}.`,
                    `$s_p^2 \\approx ${(num / den).toFixed(2)}$ 介于 $${s1Sq}$ 与 $${s2Sq}$ 之间${n1 === n2 ? "，因为两样本同样大，恰在正中" : `，更靠近较大样本的方差 $${n1 > n2 ? s1Sq : s2Sq}$`}。`,
                  ),
            ),
          });
        },
      },
      {
        id: "the-pooled-t-statistic",
        title: t("The pooled $t$ statistic", "合并 $t$ 统计量"),
        explanation: t(
          "With the pooled standard deviation $s_p$ in hand, the statistic for $H_0: \\mu_1 = \\mu_2$ is\n\n$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}},$$\n\nwith $n_1 + n_2 - 2$ degrees of freedom. The factor $\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}$ turns the spread of single observations into the spread of the difference of two means. For $n_1 = 5$ and $n_2 = 20$ it is $\\sqrt{0.25} = 0.5$. For $n_1 = 3$, $n_2 = 6$, $s_p = 1.5$ and a difference of $2$, it is $\\sqrt{0.5} \\approx 0.707$ and $t \\approx \\frac{2}{1.5 \\cdot 0.707} \\approx 1.886$.\n\n> **Watch out.** Multiply $s_p$ by the factor, do not square it, and use $s_p$, not the variance $s_p^2$.",
          "有了合并标准差 $s_p$，检验 $H_0: \\mu_1 = \\mu_2$ 的统计量为\n\n$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}},$$\n\n自由度为 $n_1 + n_2 - 2$。因子 $\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}$ 把单个观测的离散程度换算成两个均值之差的离散程度。$n_1 = 5$，$n_2 = 20$ 时它等于 $\\sqrt{0.25} = 0.5$。若 $n_1 = 3$，$n_2 = 6$，$s_p = 1.5$，差为 $2$，则因子为 $\\sqrt{0.5} \\approx 0.707$，$t \\approx \\frac{2}{1.5 \\cdot 0.707} \\approx 1.886$。\n\n> **注意。** 要用 $s_p$ 乘以这个因子，不要把因子平方，也不要用方差 $s_p^2$ 代替 $s_p$。",
        ),
        generate: (rng: Rng): Problem => {
          const [n1, n2, m] = rng.pick([
            [8, 8, 2],
            [5, 20, 2],
            [6, 12, 2],
            [18, 18, 3],
            [12, 36, 3],
            [32, 32, 4],
            [50, 50, 5],
          ] as const);
          const sp = rng.int(2, 15);
          const x2 = rng.int(30, 90);
          let d = rng.int(-12, 12);
          if (d === 0) d = 5;
          const x1 = x2 + d;
          const ans = Q.of(d * m, sp);
          return numberProblem({
            prompt: t(
              `Two independent samples with $n_1 = ${n1}$ and $n_2 = ${n2}$ have means $\\bar{x}_1 = ${x1}$ and $\\bar{x}_2 = ${x2}$, and pooled standard deviation $s_p = ${sp}$. Find the pooled $t$ statistic for $H_0: \\mu_1 = \\mu_2$.`,
              `两个独立样本 $n_1 = ${n1}$，$n_2 = ${n2}$，均值 $\\bar{x}_1 = ${x1}$，$\\bar{x}_2 = ${x2}$，合并标准差 $s_p = ${sp}$。求检验 $H_0: \\mu_1 = \\mu_2$ 的合并 $t$ 统计量。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                Q.of(d, sp),
                `That leaves out the factor $\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}} = \\frac{1}{${m}}$.`,
                `那漏掉了因子 $\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}} = \\frac{1}{${m}}$。`,
              ),
              why(Q.of(d * m * m, sp), "That squares the factor; the square root is already taken.", "那把因子平方了；平方根已经开过了。"),
              why(Q.of(d * m, sp * sp), "That uses the variance $s_p^2$ instead of $s_p$.", "那用了方差 $s_p^2$，而不是 $s_p$。"),
              why(
                ans.neg(),
                "The sign is flipped: the statistic uses $\\bar{x}_1 - \\bar{x}_2$.",
                "符号反了：统计量用的是 $\\bar{x}_1 - \\bar{x}_2$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the factor", "求因子"],
                  t(
                    `$\\sqrt{\\frac{1}{${n1}} + \\frac{1}{${n2}}} = \\frac{1}{${m}}$, so the standard error is $\\frac{${sp}}{${m}}$.`,
                    `$\\sqrt{\\frac{1}{${n1}} + \\frac{1}{${n2}}} = \\frac{1}{${m}}$，所以标准误为 $\\frac{${sp}}{${m}}$。`,
                  ),
                ],
                [
                  ["Divide the difference by it", "用差除以标准误"],
                  t(
                    `$t = \\frac{${x1} - ${x2}}{${sp} \\cdot \\frac{1}{${m}}} = \\frac{${d * m}}{${sp}}${lowestTerms(d * m, sp)}$, with $${n1 + n2 - 2}$ degrees of freedom.`,
                    `$t = \\frac{${x1} - ${x2}}{${sp} \\cdot \\frac{1}{${m}}} = \\frac{${d * m}}{${sp}}${lowestTerms(d * m, sp)}$，自由度为 $${n1 + n2 - 2}$。`,
                  ),
                ],
              ],
              t(
                `$t$ times the standard error gives back the difference: $\\frac{${d * m}}{${sp}} \\cdot \\frac{${sp}}{${m}} = ${d}$.`,
                `$t$ 乘以标准误还原出差：$\\frac{${d * m}}{${sp}} \\cdot \\frac{${sp}}{${m}} = ${d}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 8.29.3 Hypothesis Tests for Two Means: Unequal and Unknown Population Variances
  {
    id: "hypothesis-tests-for-two-means-unequal-and-unknown-population-variances",
    title: t("Hypothesis Tests for Two Means: Unequal and Unknown Population Variances", "双总体均值的假设检验：未知且不等总体方差"),
    summary: t(
      "With unknown and unequal variances, Welch's test uses $T = \\frac{(\\bar{x}_1 - \\bar{x}_2) - \\Delta_0}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}$.",
      "方差未知且不相等时，韦尔奇检验使用 $T = \\frac{(\\bar{x}_1 - \\bar{x}_2) - \\Delta_0}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}$。",
    ),
    intro: t(
      "Sample 1 has $s_1^2 = 40$ with $n_1 = 10$, and sample 2 has $s_2^2 = 90$ with $n_2 = 15$. Without assuming equal variances, $SE^2 = \\frac{40}{10} + \\frac{90}{15} = 4 + 6 = 10$, so $SE \\approx 3.162$, and a difference of means of $8$ gives $t \\approx 2.53$.\n\nCheck: $3.162^2 \\approx 10 = 4 + 6$.\n\nIn this lesson we compute Welch's squared standard error, the Welch $t$ statistic and its conservative degrees of freedom.",
      "样本 1 有 $s_1^2 = 40$，$n_1 = 10$；样本 2 有 $s_2^2 = 90$，$n_2 = 15$。不假定方差相等，$SE^2 = \\frac{40}{10} + \\frac{90}{15} = 4 + 6 = 10$，所以 $SE \\approx 3.162$，均值之差为 $8$ 时 $t \\approx 2.53$。\n\n检验：$3.162^2 \\approx 10 = 4 + 6$。\n\n本课我们计算韦尔奇标准误的平方、韦尔奇 $t$ 统计量以及它的保守自由度。",
    ),
    prerequisites: ["confidence-intervals-for-differences-between-two-means-unknown-unequal-population-variances"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "welch-test-standard-error",
        title: t("Computing standard error for Welch's t-test", "计算韦尔奇 t 检验的标准误差平方"),
        explanation: t(
          "Welch's test does not assume equal variances, so each sample contributes its own estimated variance of the mean. Welch's squared standard error is $SE^2 = \\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}$. With $n_1 = 4$, $s_1^2 = 2$, $n_2 = 5$ and $s_2^2 = 3$: $SE^2 = 0.5 + 0.6 = 1.1$.\n\n> **Watch out.** Divide each variance by its **own** sample size and add the two parts; do not pool the sizes into $n_1 + n_2$, and never subtract.",
          "韦尔奇检验不假设方差相等，所以每个样本都贡献各自的均值估计方差。韦尔奇标准误差的平方为 $SE^2 = \\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}$。若 $n_1 = 4$，$s_1^2 = 2$，$n_2 = 5$，$s_2^2 = 3$：$SE^2 = 0.5 + 0.6 = 1.1$。\n\n> **注意。** 每个方差除以**各自的**样本量，再把两部分相加；不要把样本量合成 $n_1 + n_2$，也绝不能相减。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(8, 40);
          const n2 = rng.int(8, 40);
          const s1Sq = rng.int(10, 80);
          const s2Sq = rng.int(10, 80);
          const ans = Q.of(s1Sq, n1).add(Q.of(s2Sq, n2));

          return numberProblem({
            prompt: t(
              `In a Welch's $t$-test comparing two independent populations, sample 1 has $n_1 = ${n1}$, $s_1^2 = ${s1Sq}$, and sample 2 has $n_2 = ${n2}$, $s_2^2 = ${s2Sq}$. Compute the exact rational value of the squared standard error $\\text{SE}^2$.`,
              `在比较两个独立总体的韦尔奇 $t$ 检验中，样本 1 具有 $n_1 = ${n1}$、$s_1^2 = ${s1Sq}$，样本 2 具有 $n_2 = ${n2}$、$s_2^2 = ${s2Sq}$。计算标准误差平方 $\\text{SE}^2$ 的精确有理数值。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                Q.of(s1Sq + s2Sq, n1 + n2),
                "That pools the variances and the sizes; each variance is divided by its own sample size.",
                "那把方差和样本量合在一起了；每个方差应除以各自的样本量。",
              ),
              why(
                Q.of(s1Sq * n1 + s2Sq * n2, n1 * n2),
                "That divides each variance by the other sample's size.",
                "那把每个方差除以了另一个样本的样本量。",
              ),
              why(
                Q.of(s1Sq, n1).sub(Q.of(s2Sq, n2)),
                "That subtracts the parts; variances of independent means add.",
                "那把两部分相减了；独立均值的方差是相加的。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Divide each variance by its own size", "每个方差除以各自的样本量"],
                  t(
                    `$\\frac{${s1Sq}}{${n1}} \\approx ${(s1Sq / n1).toFixed(3)}$ and $\\frac{${s2Sq}}{${n2}} \\approx ${(s2Sq / n2).toFixed(3)}$.`,
                    `$\\frac{${s1Sq}}{${n1}} \\approx ${(s1Sq / n1).toFixed(3)}$，$\\frac{${s2Sq}}{${n2}} \\approx ${(s2Sq / n2).toFixed(3)}$。`,
                  ),
                ],
                [
                  ["Add the two parts", "把两部分相加"],
                  t(
                    `$\\text{SE}^2 = \\frac{${s1Sq}}{${n1}} + \\frac{${s2Sq}}{${n2}} = ${ans.toLatex()}$.`,
                    `$\\text{SE}^2 = \\frac{${s1Sq}}{${n1}} + \\frac{${s2Sq}}{${n2}} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$${ans.toLatex()} \\approx ${ans.toNumber().toFixed(3)}$, which is larger than either part, as a sum of positive parts must be.`,
                `$${ans.toLatex()} \\approx ${ans.toNumber().toFixed(3)}$，比任一部分都大，正数之和理应如此。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-welch-t-statistic",
        title: t("The Welch $t$ statistic", "韦尔奇 $t$ 统计量"),
        explanation: t(
          "Welch's statistic keeps the two sample variances separate:\n\n$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^{2}}{n_1} + \\frac{s_2^{2}}{n_2}}}.$$\n\nDivide each variance by its **own** sample size before adding, then take the square root of the sum, not the sum of square roots. The statistic is compared with a $t$-distribution whose degrees of freedom come from the Welch–Satterthwaite formula. With $\\frac{s_1^{2}}{n_1} = 0.5$, $\\frac{s_2^{2}}{n_2} = 0.75$ and a difference of $3$: $t = \\frac{3}{\\sqrt{1.25}} \\approx 2.683$.\n\n> **Watch out.** Take the square root of the sum, $\\sqrt{0.5 + 0.75}$, not $\\sqrt{0.5} + \\sqrt{0.75}$; and divide by the square root, not by the sum itself.",
          "韦尔奇统计量把两个样本方差分开处理：\n\n$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^{2}}{n_1} + \\frac{s_2^{2}}{n_2}}}.$$\n\n每个方差先除以**各自的**样本量再相加，然后对和开平方，而不是把平方根相加。统计量与自由度由韦尔奇–萨特思韦特公式给出的 $t$ 分布比较。若 $\\frac{s_1^{2}}{n_1} = 0.5$，$\\frac{s_2^{2}}{n_2} = 0.75$，差为 $3$：$t = \\frac{3}{\\sqrt{1.25}} \\approx 2.683$。\n\n> **注意。** 要对和开平方，$\\sqrt{0.5 + 0.75}$，而不是 $\\sqrt{0.5} + \\sqrt{0.75}$；并且除以平方根，而不是除以和本身。",
        ),
        generate: (rng: Rng): Problem => {
          const [a, b] = rng.pick([
            [1, 3],
            [3, 1],
            [2, 7],
            [7, 2],
            [5, 4],
            [4, 5],
            [9, 7],
            [16, 9],
            [11, 5],
          ] as const);
          const se = Math.sqrt(a + b);
          const n1 = rng.int(6, 20);
          const n2 = rng.int(6, 20);
          const x2 = rng.int(30, 90);
          let d = rng.int(-15, 15);
          if (d === 0) d = 6;
          const x1 = x2 + d;
          const ans = Q.of(d, se);
          return numberProblem({
            prompt: t(
              `Sample 1 has $n_1 = ${n1}$, $\\bar{x}_1 = ${x1}$, $s_1^{2} = ${a * n1}$; sample 2 has $n_2 = ${n2}$, $\\bar{x}_2 = ${x2}$, $s_2^{2} = ${b * n2}$. Without assuming equal variances, find the Welch $t$ statistic for $H_0: \\mu_1 = \\mu_2$.`,
              `样本 1：$n_1 = ${n1}$，$\\bar{x}_1 = ${x1}$，$s_1^{2} = ${a * n1}$；样本 2：$n_2 = ${n2}$，$\\bar{x}_2 = ${x2}$，$s_2^{2} = ${b * n2}$。不假定方差相等，求检验 $H_0: \\mu_1 = \\mu_2$ 的韦尔奇 $t$ 统计量。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(Q.of(d, a + b), "That divides by $SE^2$ instead of its square root.", "那除以的是 $SE^2$，而不是它的平方根。"),
              why(
                ans.neg(),
                "The sign is flipped: the statistic uses $\\bar{x}_1 - \\bar{x}_2$.",
                "符号反了：统计量用的是 $\\bar{x}_1 - \\bar{x}_2$。",
              ),
              why(
                Q.of(d * (n1 + n2), a * n1 + b * n2),
                "That lumps the two samples together, dividing the total variance by the total size, and drops the square root.",
                "那把两个样本混在一起，用总方差除以总样本量，还漏掉了平方根。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the squared standard error", "求标准误的平方"],
                  t(
                    `$\\frac{s_1^{2}}{n_1} + \\frac{s_2^{2}}{n_2} = \\frac{${a * n1}}{${n1}} + \\frac{${b * n2}}{${n2}} = ${a} + ${b} = ${a + b}$, so $SE = \\sqrt{${a + b}} = ${se}$.`,
                    `$\\frac{s_1^{2}}{n_1} + \\frac{s_2^{2}}{n_2} = \\frac{${a * n1}}{${n1}} + \\frac{${b * n2}}{${n2}} = ${a} + ${b} = ${a + b}$，所以 $SE = \\sqrt{${a + b}} = ${se}$。`,
                  ),
                ],
                [
                  ["Standardize the difference", "把差标准化"],
                  t(`$t = \\frac{${x1} - ${x2}}{${se}} = ${ans.toLatex()}$.`, `$t = \\frac{${x1} - ${x2}}{${se}} = ${ans.toLatex()}$。`),
                ],
              ],
              t(
                `The difference $${d}$ is $${ans.abs().toLatex()}$ standard error${ans.abs().eq(Q.of(1)) ? "" : "s"} of $${se}$ ${d > 0 ? "above" : "below"} $0$, matching $t$.`,
                `差 $${d}$ 比 $0$ ${d > 0 ? "高" : "低"} $${ans.abs().toLatex()}$ 个标准误（每个为 $${se}$），与 $t$ 一致。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 8.29.4 Hypothesis Tests for Two Proportions
  {
    id: "hypothesis-tests-for-two-proportions",
    title: t("Hypothesis Tests for Two Proportions", "双总体比例的假设检验"),
    summary: t(
      "To test $H_0: p_1 = p_2$, pool the proportion $\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2}$, then use $\\text{SE} = \\sqrt{\\hat{p}(1 - \\hat{p})\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}$ and $Z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\text{SE}}$.",
      "检验 $H_0: p_1 = p_2$ 时，先求合并比例 $\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2}$，再用 $\\text{SE} = \\sqrt{\\hat{p}(1 - \\hat{p})\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}$ 与 $Z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\text{SE}}$。",
    ),
    intro: t(
      "In one town $45$ of $100$ people support a plan, and in another $30$ of $100$. Under $H_0: p_1 = p_2$ the pooled proportion is $\\hat{p} = \\frac{75}{200} = 0.375$, the standard error is $\\sqrt{0.375 \\cdot 0.625 \\cdot 0.02} \\approx 0.0685$, and $z = \\frac{0.45 - 0.3}{0.0685} \\approx 2.19$.\n\nCheck: $\\hat{p} = 0.375$ lies midway between $0.45$ and $0.3$, as it must for samples of the same size.\n\nIn this lesson we pool two sample proportions, compute the two-proportion $z$ statistic and decide when to pool.",
      "一个镇上 $100$ 人中有 $45$ 人支持某方案，另一个镇 $100$ 人中有 $30$ 人。在 $H_0: p_1 = p_2$ 下合并比例为 $\\hat{p} = \\frac{75}{200} = 0.375$，标准误为 $\\sqrt{0.375 \\cdot 0.625 \\cdot 0.02} \\approx 0.0685$，$z = \\frac{0.45 - 0.3}{0.0685} \\approx 2.19$。\n\n检验：$\\hat{p} = 0.375$ 恰在 $0.45$ 与 $0.3$ 的正中，两样本同样大时理应如此。\n\n本课我们合并两个样本比例，计算两比例 $z$ 统计量，并判断何时应当合并。",
    ),
    prerequisites: ["confidence-intervals-for-differences-between-two-proportions"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "pooled-sample-proportion-calculation",
        title: t("Computing the pooled sample proportion", "计算合并样本比例"),
        explanation: t(
          "Under the null hypothesis the two proportions are equal, so the best estimate of the common value combines the successes and the sample sizes. The pooled sample proportion is $\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2}$. With $3$ successes out of $10$ and $9$ out of $20$: $\\hat{p} = \\frac{12}{30} = 0.4$, while the average of $0.3$ and $0.45$ would be $0.375$.\n\n> **Watch out.** Add the counts first and then divide; averaging $\\hat{p}_1$ and $\\hat{p}_2$ is right only when $n_1 = n_2$.",
          "在原假设下两个比例相等，所以公共值的最佳估计是把成功数和样本量分别合并。合并样本比例为 $\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2}$。若 $10$ 次中成功 $3$ 次，$20$ 次中成功 $9$ 次：$\\hat{p} = \\frac{12}{30} = 0.4$，而 $0.3$ 与 $0.45$ 的平均是 $0.375$。\n\n> **注意。** 先把计数相加再相除；只有 $n_1 = n_2$ 时，$\\hat{p}_1$ 与 $\\hat{p}_2$ 的平均才是对的。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(40, 200);
          const n2 = rng.int(40, 200);
          const x1 = rng.int(5, n1 - 5);
          const x2 = rng.int(5, n2 - 5);
          const num = x1 + x2;
          const den = n1 + n2;

          return numberProblem({
            prompt: t(
              `Sample 1 has $x_1 = ${x1}$ successes out of $n_1 = ${n1}$, and sample 2 has $x_2 = ${x2}$ successes out of $n_2 = ${n2}$. When testing $H_0: p_1 = p_2$, find the exact rational value of the pooled sample proportion $\\hat{p}$.`,
              `样本 1 在 $n_1 = ${n1}$ 次试验中有 $x_1 = ${x1}$ 次成功，样本 2 在 $n_2 = ${n2}$ 次试验中有 $x_2 = ${x2}$ 次成功。检验 $H_0: p_1 = p_2$ 时，求合并样本比例 $\\hat{p}$ 的精确有理数值。`,
            ),
            answer: Q.of(num, den),
            mistakes: distinct(Q.of(num, den), [
              why(
                Q.of(x1, n1).add(Q.of(x2, n2)),
                "That adds the two proportions; pool the counts instead.",
                "那把两个比例相加了；应当合并计数。",
              ),
              why(
                Q.of(x1 * n2 + x2 * n1, 2 * n1 * n2),
                "That averages the two proportions, which ignores the different sample sizes.",
                "那是两个比例的平均，忽略了样本量的不同。",
              ),
              why(
                Q.of(num, n1 * n2),
                "That divides by $n_1 n_2$; the pooled sample has $n_1 + n_2$ trials.",
                "那除以的是 $n_1 n_2$；合并后的样本共有 $n_1 + n_2$ 次试验。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Pool the counts", "合并计数"],
                  t(
                    `There are $${x1} + ${x2} = ${num}$ successes in $${n1} + ${n2} = ${den}$ trials.`,
                    `共 $${n1} + ${n2} = ${den}$ 次试验中有 $${x1} + ${x2} = ${num}$ 次成功。`,
                  ),
                ],
                [
                  ["Divide", "相除"],
                  t(
                    `$\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `$\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              x1 * n2 === x2 * n1
                ? t(
                    `Both samples have the proportion $${(x1 / n1).toFixed(3)}$, so the pooled one is the same.`,
                    `两个样本的比例都是 $${(x1 / n1).toFixed(3)}$，所以合并比例也是它。`,
                  )
                : t(
                    `$\\hat{p} \\approx ${(num / den).toFixed(3)}$ lies between $\\hat{p}_1 \\approx ${(x1 / n1).toFixed(3)}$ and $\\hat{p}_2 \\approx ${(x2 / n2).toFixed(3)}$${n1 === n2 ? ", at their midpoint since the samples are the same size" : `, nearer the proportion of the larger sample`}.`,
                    `$\\hat{p} \\approx ${(num / den).toFixed(3)}$ 介于 $\\hat{p}_1 \\approx ${(x1 / n1).toFixed(3)}$ 与 $\\hat{p}_2 \\approx ${(x2 / n2).toFixed(3)}$ 之间${n1 === n2 ? "，因为两样本同样大，恰在正中" : "，更靠近较大样本的比例"}。`,
                  ),
            ),
          });
        },
      },
      {
        id: "the-two-proportion-z-statistic",
        title: t("The two-proportion $z$ statistic", "两比例 $z$ 统计量"),
        explanation: t(
          "Under $H_0: p_1 = p_2$ both samples share one proportion, so the standard error uses the **pooled** $\\hat{p}$:\n\n$$z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\hat{p}(1 - \\hat{p})\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}}.$$\n\nThis differs from the confidence interval, which uses the separate proportions; the test assumes $H_0$ while computing the statistic. With $40/200$ against $60/200$: $\\hat{p} = 0.25$, $\\text{SE} = \\sqrt{0.1875 \\cdot 0.01} \\approx 0.0433$, $z \\approx -2.31$. With $6/20$ against $14/20$: $\\hat{p} = 0.5$, $\\text{SE} = \\sqrt{0.25 \\cdot 0.1} \\approx 0.158$, $z \\approx -2.53$.\n\n> **Watch out.** Put the pooled $\\hat{p}$ in the standard error, not $\\hat{p}_1$ and $\\hat{p}_2$ separately, and take the square root before dividing.",
          "在 $H_0: p_1 = p_2$ 下两个样本共用一个比例，所以标准误使用**合并**的 $\\hat{p}$：\n\n$$z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\hat{p}(1 - \\hat{p})\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}}.$$\n\n这与使用各自比例的置信区间不同：检验在计算统计量时假定 $H_0$ 成立。例如 $40/200$ 对 $60/200$：$\\hat{p} = 0.25$，$\\text{SE} = \\sqrt{0.1875 \\cdot 0.01} \\approx 0.0433$，$z \\approx -2.31$。又如 $6/20$ 对 $14/20$：$\\hat{p} = 0.5$，$\\text{SE} = \\sqrt{0.25 \\cdot 0.1} \\approx 0.158$，$z \\approx -2.53$。\n\n> **注意。** 标准误中要用合并的 $\\hat{p}$，而不是分别用 $\\hat{p}_1$ 和 $\\hat{p}_2$；并且先开平方再相除。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.pick([100, 150, 200, 250, 300]);
          const n2 = rng.pick([100, 150, 200, 250, 300]);
          const x1 = rng.int(Math.floor(n1 * 0.15), Math.floor(n1 * 0.6));
          let x2 = rng.int(Math.floor(n2 * 0.15), Math.floor(n2 * 0.6));
          if (x2 * n1 === x1 * n2) x2 += 7;
          const p1 = x1 / n1;
          const p2 = x2 / n2;
          const p = (x1 + x2) / (n1 + n2);
          const pooled = Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2));
          const unpooled = Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2);
          const ans = round2((p1 - p2) / pooled);
          return numberProblem({
            prompt: t(
              `In sample 1, $${x1}$ of $${n1}$ are successes; in sample 2, $${x2}$ of $${n2}$. Find the $z$ statistic for $H_0: p_1 = p_2$ using the pooled proportion. Round to two decimal places.`,
              `样本 1 的 $${n1}$ 次中有 $${x1}$ 次成功；样本 2 的 $${n2}$ 次中有 $${x2}$ 次成功。用合并比例求检验 $H_0: p_1 = p_2$ 的 $z$ 统计量，精确到两位小数。`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: distinct(ans, [
              why(
                round2((p1 - p2) / unpooled),
                "That uses the separate proportions in the standard error, as an interval does; the test uses the pooled $\\hat{p}$.",
                "那在标准误中用了各自的比例，那是置信区间的做法；检验要用合并的 $\\hat{p}$。",
              ),
              why(
                round2((p1 - p2) / (p * (1 - p) * (1 / n1 + 1 / n2))),
                "That divides by the variance; take its square root first.",
                "那除以的是方差；要先开平方。",
              ),
              why(
                ans.neg(),
                "The sign is flipped: the statistic uses $\\hat{p}_1 - \\hat{p}_2$.",
                "符号反了：统计量用的是 $\\hat{p}_1 - \\hat{p}_2$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the proportions", "求各比例"],
                  t(
                    `$\\hat{p}_1 \\approx ${p1.toFixed(4)}$, $\\hat{p}_2 \\approx ${p2.toFixed(4)}$, and the pooled $\\hat{p} = \\frac{${x1 + x2}}{${n1 + n2}} \\approx ${p.toFixed(4)}$.`,
                    `$\\hat{p}_1 \\approx ${p1.toFixed(4)}$，$\\hat{p}_2 \\approx ${p2.toFixed(4)}$，合并的 $\\hat{p} = \\frac{${x1 + x2}}{${n1 + n2}} \\approx ${p.toFixed(4)}$。`,
                  ),
                ],
                [
                  ["Find the pooled standard error", "求合并标准误"],
                  t(
                    `$\\text{SE} = \\sqrt{\\hat{p}(1 - \\hat{p})\\left(\\frac{1}{${n1}} + \\frac{1}{${n2}}\\right)} \\approx ${pooled.toFixed(4)}$.`,
                    `$\\text{SE} = \\sqrt{\\hat{p}(1 - \\hat{p})\\left(\\frac{1}{${n1}} + \\frac{1}{${n2}}\\right)} \\approx ${pooled.toFixed(4)}$。`,
                  ),
                ],
                [
                  ["Standardize the difference", "把差标准化"],
                  t(
                    `$z \\approx \\frac{${(p1 - p2).toFixed(4)}}{${pooled.toFixed(4)}} \\approx ${dec(ans)}$.`,
                    `$z \\approx \\frac{${(p1 - p2).toFixed(4)}}{${pooled.toFixed(4)}} \\approx ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `Sample ${p1 > p2 ? "1" : "2"} has the larger proportion, so $z$ is ${p1 > p2 ? "positive" : "negative"}, as found.`,
                `样本 ${p1 > p2 ? "1" : "2"} 的比例较大，所以 $z$ 为${p1 > p2 ? "正" : "负"}，与所得一致。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 8.29.5 Hypothesis Tests for Two Means: Paired-Sample Z-Test
  {
    id: "hypothesis-tests-for-two-means-paired-sample-z-test",
    title: t("Hypothesis Tests for Two Means: Paired-Sample Z-Test", "双总体均值的假设检验：配对样本 Z 检验"),
    summary: t(
      "When the differences $d_i = x_{1i} - x_{2i}$ have known variance $\\sigma_d^2$, test $H_0: \\mu_d = \\Delta_0$ using $Z = \\frac{\\bar{d} - \\Delta_0}{\\sigma_d / \\sqrt{n}}$.",
      "当差值 $d_i = x_{1i} - x_{2i}$ 的方差 $\\sigma_d^2$ 已知时，用 $Z = \\frac{\\bar{d} - \\Delta_0}{\\sigma_d / \\sqrt{n}}$ 检验 $H_0: \\mu_d = \\Delta_0$。",
    ),
    intro: t(
      "Nine patients have their blood pressure measured before and after a treatment. The differences, before minus after, have mean $\\bar{d} = 4$, and their standard deviation is known to be $\\sigma_d = 6$. The standard error is $\\frac{6}{3} = 2$, so $z = \\frac{4}{2} = 2$.\n\nCheck: $2 \\cdot 2 = 4 = \\bar{d}$.\n\nIn this lesson we compute the paired $z$ statistic from a summary and from raw pairs, and find the least mean difference that is significant.",
      "九名患者在治疗前后各测一次血压。差值（治疗前减治疗后）的均值为 $\\bar{d} = 4$，其标准差已知为 $\\sigma_d = 6$。标准误为 $\\frac{6}{3} = 2$，所以 $z = \\frac{4}{2} = 2$。\n\n检验：$2 \\cdot 2 = 4 = \\bar{d}$。\n\n本课我们由汇总数据和原始配对数据计算配对 $z$ 统计量，并求显著的最小平均差。",
    ),
    prerequisites: ["confidence-intervals-for-paired-samples-known-variances", "hypothesis-tests-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "paired-z-test-statistic-calculation",
        title: t("Computing the paired z-test statistic", "计算配对 z 检验统计量"),
        explanation: t(
          "With paired data the test works on the differences alone, standardizing their mean with the known standard deviation of the differences. The test statistic is $z = \\frac{\\bar{d} - \\Delta_0}{\\sigma_d / \\sqrt{n}}$. With $n = 4$ pairs, $\\bar{d} = 1.5$ and $\\sigma_d = 2$: the standard error is $1$, so $z = 1.5$.\n\n> **Watch out.** $n$ counts pairs, not measurements, and $\\sigma_d$ is the spread of the differences; divide by $\\frac{\\sigma_d}{\\sqrt{n}}$, not by $\\sigma_d$.",
          "对于配对数据，检验只针对差值进行，用差值的已知标准差对其均值标准化。检验统计量为 $z = \\frac{\\bar{d} - \\Delta_0}{\\sigma_d / \\sqrt{n}}$。若有 $n = 4$ 对，$\\bar{d} = 1.5$，$\\sigma_d = 2$：标准误为 $1$，所以 $z = 1.5$。\n\n> **注意。** $n$ 是配对数而不是测量次数，$\\sigma_d$ 是差值的离散程度；要除以 $\\frac{\\sigma_d}{\\sqrt{n}}$，而不是 $\\sigma_d$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(3, 10);
          const n = k * k;
          const s = rng.int(2, 6);
          const sigmaD = k * s;
          const d = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
          const dBar = d * s;

          return numberProblem({
            prompt: t(
              `A paired sample of $n = ${n}$ differences has mean $\\bar{d} = ${dBar}$. The population standard deviation of differences is known to be $\\sigma_d = ${sigmaD}$. Test $H_0: \\mu_d = 0$. Calculate the test statistic $z$.`,
              `容量为 $n = ${n}$ 的配对差值样本均值为 $\\bar{d} = ${dBar}$。已知差值总体的标准差为 $\\sigma_d = ${sigmaD}$。检验 $H_0: \\mu_d = 0$。计算检验统计量 $z$。`,
            ),
            answer: d,
            mistakes: distinct(d, [
              why(
                Q.of(dBar, sigmaD),
                "That divides by $\\sigma_d$ instead of the standard error $\\frac{\\sigma_d}{\\sqrt{n}}$.",
                "那除以的是 $\\sigma_d$，而不是标准误 $\\frac{\\sigma_d}{\\sqrt{n}}$。",
              ),
              why(dBar, "That is $\\bar{d}$ itself, not yet divided by the standard error.", "那是 $\\bar{d}$ 本身，还没有除以标准误。"),
              why(
                d * k,
                "That divides by $\\frac{\\sigma_d}{n}$ instead of $\\frac{\\sigma_d}{\\sqrt{n}}$.",
                "那除以的是 $\\frac{\\sigma_d}{n}$，而不是 $\\frac{\\sigma_d}{\\sqrt{n}}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the standard error", "求标准误"],
                  t(
                    `$\\frac{\\sigma_d}{\\sqrt{n}} = \\frac{${sigmaD}}{\\sqrt{${n}}} = \\frac{${sigmaD}}{${k}} = ${s}$.`,
                    `$\\frac{\\sigma_d}{\\sqrt{n}} = \\frac{${sigmaD}}{\\sqrt{${n}}} = \\frac{${sigmaD}}{${k}} = ${s}$。`,
                  ),
                ],
                [
                  ["Standardize the mean difference", "把平均差标准化"],
                  t(`$z = \\frac{${dBar}}{${s}} = ${d}$.`, `$z = \\frac{${dBar}}{${s}} = ${d}$。`),
                ],
              ],
              t(
                `$\\bar{d} = ${dBar}$ lies $${Math.abs(d)}$ standard error${Math.abs(d) === 1 ? "" : "s"} of $${s}$ ${d > 0 ? "above" : "below"} $0$, matching $z$.`,
                `$\\bar{d} = ${dBar}$ 比 $0$ ${d > 0 ? "高" : "低"} $${Math.abs(d)}$ 个标准误（每个为 $${s}$），与 $z$ 一致。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-paired-z-statistic-from-raw-pairs",
        title: t("The paired $z$ statistic from raw pairs", "由原始配对数据求配对 $z$ 统计量"),
        explanation: t(
          "Starting from the pairs, subtract within each pair in the order the hypothesis names, average the differences to get $\\bar{d}$, and divide by the standard error of the mean difference:\n\n$$z = \\frac{\\bar{d}}{\\sigma_d/\\sqrt{n}}.$$\n\nHere $n$ is the number of pairs and $\\sigma_d$ the known standard deviation of the differences, not of either measurement. With differences $2, 4, 3$ and $\\sigma_d = 3$: $\\bar{d} = 3$ and $z = \\frac{3}{3/\\sqrt{3}} = \\sqrt{3} \\approx 1.732$.\n\n> **Watch out.** Subtract in the order the question names, every pair the same way, and divide $\\sigma_d$ by $\\sqrt{n}$, not by $n$.",
          "从配对数据出发，按假设指定的顺序在每对内相减，求差值的均值 $\\bar{d}$，再除以均值差的标准误：\n\n$$z = \\frac{\\bar{d}}{\\sigma_d/\\sqrt{n}}.$$\n\n这里 $n$ 是配对数，$\\sigma_d$ 是差值（而不是某一次测量）的已知标准差。若差值为 $2, 4, 3$，$\\sigma_d = 3$：$\\bar{d} = 3$，$z = \\frac{3}{3/\\sqrt{3}} = \\sqrt{3} \\approx 1.732$。\n\n> **注意。** 按题目指定的顺序相减，每对都用同一顺序；$\\sigma_d$ 要除以 $\\sqrt{n}$，而不是 $n$。",
        ),
        generate: (rng: Rng): Problem => {
          const after = [0, 1, 2, 3].map(() => rng.int(40, 90));
          const ds = after.map(() => rng.int(-4, 9));
          const before = after.map((y, i) => y + (ds[i] ?? 0));
          const sum = ds.reduce((s, x) => s + x, 0);
          const sigma = rng.int(2, 9);
          const dbar = Q.of(sum, 4);
          const ans = dbar.mul(Q.of(2, sigma));
          return numberProblem({
            prompt: t(
              `Four subjects are measured before and after training: ${before.map((x, i) => `$(${x}, ${after[i]})$`).join(", ")}. The differences (before minus after) have known standard deviation $\\sigma_d = ${sigma}$. Find the $z$ statistic for $H_0: \\mu_d = 0$.`,
              `四名受试者在训练前后各测一次：${before.map((x, i) => `$(${x}, ${after[i]})$`).join("，")}。差值（训练前减训练后）的标准差已知为 $\\sigma_d = ${sigma}$。求检验 $H_0: \\mu_d = 0$ 的 $z$ 统计量。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                dbar.div(Q.of(sigma)),
                "That divides by $\\sigma_d$ and forgets the $\\sqrt{n}$ of the standard error.",
                "那除以的是 $\\sigma_d$，忘了标准误中的 $\\sqrt{n}$。",
              ),
              why(
                dbar.mul(Q.of(4, sigma)),
                "That divides $\\sigma_d$ by $n = 4$ instead of $\\sqrt{4} = 2$.",
                "那把 $\\sigma_d$ 除以了 $n = 4$，而不是 $\\sqrt{4} = 2$。",
              ),
              why(ans.neg(), "The sign is flipped: the differences are before minus after.", "符号反了：差值是训练前减训练后。"),
            ]),
            solution: walked(
              [
                [
                  ["Subtract within each pair", "在每对内相减"],
                  t(`The differences, before minus after, are $${ds.join(", ")}$.`, `差值（训练前减训练后）为 $${ds.join(", ")}$。`),
                ],
                [
                  ["Average the differences", "求差值的均值"],
                  t(`$\\bar{d} = \\frac{${sum}}{4}${lowestTerms(sum, 4)}$.`, `$\\bar{d} = \\frac{${sum}}{4}${lowestTerms(sum, 4)}$。`),
                ],
                [
                  ["Standardize", "标准化"],
                  t(
                    `$z = \\frac{${dbar.toLatex()}}{${sigma}/\\sqrt{4}} = ${ans.toLatex()}$.`,
                    `$z = \\frac{${dbar.toLatex()}}{${sigma}/\\sqrt{4}} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The standard error is $\\frac{${sigma}}{2}$, and $\\bar{d}$ is $${ans.abs().toLatex()}$ of them ${sum >= 0 ? "above" : "below"} $0$.`,
                `标准误为 $\\frac{${sigma}}{2}$，$\\bar{d}$ 比 $0$ ${sum >= 0 ? "高" : "低"}出 $${ans.abs().toLatex()}$ 个标准误。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 8.29.6 Hypothesis Tests for Two Means: Paired-Sample T-Test
  {
    id: "hypothesis-tests-for-two-means-paired-sample-t-test",
    title: t("Hypothesis Tests for Two Means: Paired-Sample T-Test", "双总体均值的假设检验：配对样本 T 检验"),
    summary: t(
      "When the variance of the differences is unknown, test $H_0: \\mu_d = \\Delta_0$ using $T = \\frac{\\bar{d} - \\Delta_0}{s_d / \\sqrt{n}}$ with $n - 1$ degrees of freedom.",
      "当差值的方差未知时，用 $T = \\frac{\\bar{d} - \\Delta_0}{s_d / \\sqrt{n}}$（自由度 $n - 1$）检验 $H_0: \\mu_d = \\Delta_0$。",
    ),
    intro: t(
      "Four runners' times improve by $3, 5, 4, 8$ seconds. The mean difference is $\\bar{d} = 5$, the deviations are $-2, 0, -1, 3$, so $s_d = \\sqrt{\\frac{14}{3}} \\approx 2.160$, the standard error is $\\frac{2.160}{2} = 1.080$, and $t \\approx 4.63$ with $3$ degrees of freedom.\n\nCheck: the deviations $-2, 0, -1, 3$ add to $0$, as deviations from a mean must.\n\nIn this lesson we compute the paired $t$ statistic from a summary and from raw pairs, and find the degrees of freedom of a paired test.",
      "四名跑步者的成绩分别提高了 $3, 5, 4, 8$ 秒。平均差为 $\\bar{d} = 5$，离差为 $-2, 0, -1, 3$，所以 $s_d = \\sqrt{\\frac{14}{3}} \\approx 2.160$，标准误为 $\\frac{2.160}{2} = 1.080$，$t \\approx 4.63$，自由度为 $3$。\n\n检验：离差 $-2, 0, -1, 3$ 之和为 $0$，与均值的离差理应如此。\n\n本课我们由汇总数据和原始配对数据计算配对 $t$ 统计量，并求配对检验的自由度。",
    ),
    prerequisites: ["hypothesis-tests-for-two-means-paired-sample-z-test", "hypothesis-tests-for-one-mean-unknown-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "paired-t-test-statistic-calculation",
        title: t("Computing the paired t-test statistic", "计算配对 t 检验统计量"),
        explanation: t(
          "When the standard deviation of the differences is estimated from the data, the statistic follows a t distribution with one less than the number of pairs. $t = \\frac{\\bar{d} - \\Delta_0}{s_d / \\sqrt{n}}$ with $df = n - 1$. With $n = 25$ pairs, $\\bar{d} = -0.8$ and $s_d = 2$: the standard error is $0.4$, so $t = -2$ with $24$ degrees of freedom.\n\n> **Watch out.** Divide by $\\frac{s_d}{\\sqrt{n}}$, not by $s_d$, and $n$ is the number of pairs.",
          "当差值的标准差由数据估计时，统计量服从自由度为对数减 1 的 t 分布。$t = \\frac{\\bar{d} - \\Delta_0}{s_d / \\sqrt{n}}$，自由度 $df = n - 1$。若有 $n = 25$ 对，$\\bar{d} = -0.8$，$s_d = 2$：标准误为 $0.4$，所以 $t = -2$，自由度为 $24$。\n\n> **注意。** 要除以 $\\frac{s_d}{\\sqrt{n}}$ 而不是 $s_d$；$n$ 是配对数。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 8);
          const n = k * k;
          const s = rng.int(2, 5);
          const sD = k * s;
          const d = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
          const dBar = d * s;

          return numberProblem({
            prompt: t(
              `A paired sample of $n = ${n}$ differences has sample mean $\\bar{d} = ${dBar}$ and sample standard deviation $s_d = ${sD}$. Test $H_0: \\mu_d = 0$. Calculate the test statistic $t$.`,
              `容量为 $n = ${n}$ 的配对差值样本均值为 $\\bar{d} = ${dBar}$，样本标准差为 $s_d = ${sD}$。检验 $H_0: \\mu_d = 0$。计算检验统计量 $t$。`,
            ),
            answer: d,
            mistakes: distinct(d, [
              why(
                Q.of(dBar, sD),
                "That divides by $s_d$ instead of the standard error $\\frac{s_d}{\\sqrt{n}}$.",
                "那除以的是 $s_d$，而不是标准误 $\\frac{s_d}{\\sqrt{n}}$。",
              ),
              why(dBar, "That is $\\bar{d}$ itself, not yet divided by the standard error.", "那是 $\\bar{d}$ 本身，还没有除以标准误。"),
              why(
                d * k,
                "That divides by $\\frac{s_d}{n}$ instead of $\\frac{s_d}{\\sqrt{n}}$.",
                "那除以的是 $\\frac{s_d}{n}$，而不是 $\\frac{s_d}{\\sqrt{n}}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Estimate the standard error", "估计标准误"],
                  t(
                    `$\\frac{s_d}{\\sqrt{n}} = \\frac{${sD}}{\\sqrt{${n}}} = \\frac{${sD}}{${k}} = ${s}$.`,
                    `$\\frac{s_d}{\\sqrt{n}} = \\frac{${sD}}{\\sqrt{${n}}} = \\frac{${sD}}{${k}} = ${s}$。`,
                  ),
                ],
                [
                  ["Standardize the mean difference", "把平均差标准化"],
                  t(
                    `$t = \\frac{${dBar}}{${s}} = ${d}$, with $\\nu = ${n - 1}$ degrees of freedom.`,
                    `$t = \\frac{${dBar}}{${s}} = ${d}$，自由度 $\\nu = ${n - 1}$。`,
                  ),
                ],
              ],
              t(
                `$\\bar{d} = ${dBar}$ lies $${Math.abs(d)}$ estimated standard error${Math.abs(d) === 1 ? "" : "s"} of $${s}$ ${d > 0 ? "above" : "below"} $0$, matching $t$.`,
                `$\\bar{d} = ${dBar}$ 比 $0$ ${d > 0 ? "高" : "低"} $${Math.abs(d)}$ 个估计标准误（每个为 $${s}$），与 $t$ 一致。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-paired-t-statistic-from-raw-pairs",
        title: t("The paired $t$ statistic from raw pairs", "由原始配对数据求配对 $t$ 统计量"),
        explanation: t(
          "With $\\sigma_d$ unknown, the differences supply both the mean and the spread. Compute $d_i$, then $\\bar{d}$, then\n\n$$s_d = \\sqrt{\\frac{\\sum (d_i - \\bar{d})^{2}}{n - 1}}, \\qquad t = \\frac{\\bar{d}}{s_d/\\sqrt{n}},$$\n\nwith $n - 1$ degrees of freedom. Treating the two columns as independent samples instead would ignore the pairing and usually inflate the standard error. With differences $1, 3, 5$: $\\bar{d} = 3$, $s_d = \\sqrt{\\frac{8}{2}} = 2$ and $t = \\frac{3}{2/\\sqrt{3}} \\approx 2.598$.\n\n> **Watch out.** Divide the squared deviations by $n - 1$, not $n$, and then divide $s_d$ by $\\sqrt{n}$, not by $n$.",
          "当 $\\sigma_d$ 未知时，差值同时给出均值和离散程度。先算 $d_i$，再算 $\\bar{d}$，然后\n\n$$s_d = \\sqrt{\\frac{\\sum (d_i - \\bar{d})^{2}}{n - 1}}, \\qquad t = \\frac{\\bar{d}}{s_d/\\sqrt{n}},$$\n\n自由度为 $n - 1$。若把两列当作独立样本处理，就忽略了配对，通常会夸大标准误。若差值为 $1, 3, 5$：$\\bar{d} = 3$，$s_d = \\sqrt{\\frac{8}{2}} = 2$，$t = \\frac{3}{2/\\sqrt{3}} \\approx 2.598$。\n\n> **注意。** 离差平方和要除以 $n - 1$ 而不是 $n$；然后 $s_d$ 要除以 $\\sqrt{n}$ 而不是 $n$。",
        ),
        generate: (rng: Rng): Problem => {
          const [devs, s] = rng.pick([
            [[-3, 1, 1, 1], 2],
            [[3, -1, -1, -1], 2],
            [[-6, 2, 2, 2], 4],
            [[6, -2, -2, -2], 4],
          ] as const);
          let dbar = rng.int(-5, 8);
          if (dbar === 0) dbar = 3;
          const ds = rng.shuffle(devs.map((e) => dbar + e));
          const after = ds.map(() => rng.int(30, 80));
          const before = after.map((y, i) => y + (ds[i] ?? 0));
          const ans = Q.of(2 * dbar, s);
          const ss = devs.reduce((acc, e) => acc + e * e, 0);
          return numberProblem({
            prompt: t(
              `Four pairs (before, after) are ${before.map((x, i) => `$(${x}, ${after[i]})$`).join(", ")}. Using differences before minus after, find the paired $t$ statistic for $H_0: \\mu_d = 0$.`,
              `四组配对数据（处理前，处理后）为 ${before.map((x, i) => `$(${x}, ${after[i]})$`).join("，")}。用差值“处理前减处理后”，求检验 $H_0: \\mu_d = 0$ 的配对 $t$ 统计量。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                Q.of(dbar, s),
                "That divides by $s_d$ and forgets the $\\sqrt{n}$ of the standard error.",
                "那除以的是 $s_d$，忘了标准误中的 $\\sqrt{n}$。",
              ),
              why(
                Q.of(2 * dbar * s, ss),
                "That uses the sum of squared deviations where the standard deviation $s_d$ belongs.",
                "那在应当用标准差 $s_d$ 的地方用了离差平方和。",
              ),
              why(ans.neg(), "The sign is flipped: the differences are before minus after.", "符号反了：差值是处理前减处理后。"),
              why(
                Q.of(4 * dbar, s),
                "That divides $s_d$ by $n = 4$ instead of $\\sqrt{4} = 2$.",
                "那把 $s_d$ 除以了 $n = 4$，而不是 $\\sqrt{4} = 2$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the differences", "求差值"],
                  t(
                    `The differences are $${ds.join(", ")}$ with $\\bar{d} = ${dbar}$.`,
                    `差值为 $${ds.join(", ")}$，$\\bar{d} = ${dbar}$。`,
                  ),
                ],
                [
                  ["Find their standard deviation", "求差值的标准差"],
                  t(
                    `The squared deviations sum to $${ss}$, so $s_d = \\sqrt{\\frac{${ss}}{3}} = ${s}$.`,
                    `离差平方和为 $${ss}$，所以 $s_d = \\sqrt{\\frac{${ss}}{3}} = ${s}$。`,
                  ),
                ],
                [
                  ["Standardize the mean difference", "把平均差标准化"],
                  t(
                    `$t = \\frac{${dbar}}{${s}/\\sqrt{4}} = ${ans.toLatex()}$, with $3$ degrees of freedom.`,
                    `$t = \\frac{${dbar}}{${s}/\\sqrt{4}} = ${ans.toLatex()}$，自由度为 $3$。`,
                  ),
                ],
              ],
              t(
                `The standard error is $\\frac{${s}}{2} = ${s / 2}$, and $\\bar{d} = ${dbar}$ is $${ans.abs().toLatex()}$ of them ${dbar > 0 ? "above" : "below"} $0$.`,
                `标准误为 $\\frac{${s}}{2} = ${s / 2}$，$\\bar{d} = ${dbar}$ 比 $0$ ${dbar > 0 ? "高" : "低"}出 $${ans.abs().toLatex()}$ 个标准误。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 8.29.7 Hypothesis Tests for Two Variances
  {
    id: "hypothesis-tests-for-two-variances",
    title: t("Hypothesis Tests for Two Variances", "双总体方差的假设检验"),
    summary: t(
      "To test $H_0: \\sigma_1^2 = \\sigma_2^2$ for two independent normal populations, use $F = \\frac{s_1^2}{s_2^2}$, which follows $F(n_1 - 1, n_2 - 1)$ under $H_0$.",
      "检验两个独立正态总体的 $H_0: \\sigma_1^2 = \\sigma_2^2$ 时，用 $F = \\frac{s_1^2}{s_2^2}$，在 $H_0$ 下服从 $F(n_1 - 1, n_2 - 1)$。",
    ),
    intro: t(
      "Sample 1 has $s_1^2 = 36$ with $n_1 = 11$, and sample 2 has $s_2^2 = 12$ with $n_2 = 9$. Then $F = \\frac{36}{12} = 3$ with $(10, 8)$ degrees of freedom. At $\\alpha = 0.05$ two-tailed, $F_{0.025}(10, 8) = 4.295$, so $H_0: \\sigma_1^2 = \\sigma_2^2$ is not rejected.\n\nCheck: $3 \\cdot 12 = 36$.\n\nIn this lesson we compute the $F$ statistic for two variances, decide a two-tailed $F$-test and find the degrees of freedom of an $F$ ratio.",
      "样本 1 有 $s_1^2 = 36$，$n_1 = 11$；样本 2 有 $s_2^2 = 12$，$n_2 = 9$。于是 $F = \\frac{36}{12} = 3$，自由度为 $(10, 8)$。在 $\\alpha = 0.05$ 的双侧检验中，$F_{0.025}(10, 8) = 4.295$，所以不拒绝 $H_0: \\sigma_1^2 = \\sigma_2^2$。\n\n检验：$3 \\cdot 12 = 36$。\n\n本课我们计算两方差的 $F$ 统计量，对双侧 $F$ 检验作出决策，并求 $F$ 比的自由度。",
    ),
    prerequisites: ["the-f-distribution", "hypothesis-tests-for-one-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "f-test-statistic-calculation",
        title: t("Computing the F-test statistic for two variances", "计算两方差的 F 检验统计量"),
        explanation: t(
          "If the two population variances are equal, the ratio of the sample variances should be near one, and the F distribution says how far from one is unusual. The test statistic is $F = \\frac{s_1^2}{s_2^2}$. With $s_1^2 = 4.8$ and $s_2^2 = 1.6$: $F = 3$.\n\n> **Watch out.** $F$ is a ratio of variances, not a difference, and it is not weighted by the degrees of freedom; for $H_1: \\sigma_1^2 > \\sigma_2^2$ put $s_1^2$ on top.",
          "如果两个总体方差相等，样本方差之比应接近 1，F 分布说明偏离 1 多远才算异常。检验统计量为 $F = \\frac{s_1^2}{s_2^2}$。若 $s_1^2 = 4.8$，$s_2^2 = 1.6$：$F = 3$。\n\n> **注意。** $F$ 是方差之比，不是差，也不按自由度加权；对于 $H_1: \\sigma_1^2 > \\sigma_2^2$，要把 $s_1^2$ 放在分子上。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(10, 40);
          const n2 = rng.int(10, 40);
          const s1Sq = rng.int(15, 120);
          const s2Sq = rng.int(10, 80);

          return numberProblem({
            prompt: t(
              `Independent samples of sizes $n_1 = ${n1}$ and $n_2 = ${n2}$ from normal populations have sample variances $s_1^2 = ${s1Sq}$ and $s_2^2 = ${s2Sq}$. To test $H_0: \\sigma_1^2 = \\sigma_2^2$ against $H_1: \\sigma_1^2 > \\sigma_2^2$, find the exact rational value of the test statistic $F$.`,
              `来自正态总体的独立样本容量分别为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$，样本方差分别为 $s_1^2 = ${s1Sq}$ 与 $s_2^2 = ${s2Sq}$。为检验 $H_0: \\sigma_1^2 = \\sigma_2^2$ 对 $H_1: \\sigma_1^2 > \\sigma_2^2$，求检验统计量 $F$ 的精确有理数值。`,
            ),
            answer: Q.of(s1Sq, s2Sq),
            mistakes: distinct(Q.of(s1Sq, s2Sq), [
              why(
                Q.of(s2Sq, s1Sq),
                "That inverts the ratio; the alternative puts $s_1^2$ on top.",
                "那把比值倒过来了；备择假设要求 $s_1^2$ 在分子上。",
              ),
              why(
                Q.of((n1 - 1) * s1Sq, (n2 - 1) * s2Sq),
                "That weights the variances by their degrees of freedom; the statistic is the plain ratio.",
                "那按自由度给方差加了权；统计量就是方差的简单之比。",
              ),
              why(s1Sq - s2Sq, "That is the difference of the variances; $F$ is their ratio.", "那是方差之差；$F$ 是它们的比。"),
            ]),
            solution: walked(
              [
                [
                  ["Write the ratio", "写出比值"],
                  t(
                    `$F = \\frac{s_1^2}{s_2^2} = \\frac{${s1Sq}}{${s2Sq}}$, with numerator $\\nu_1 = ${n1 - 1}$ and denominator $\\nu_2 = ${n2 - 1}$ degrees of freedom.`,
                    `$F = \\frac{s_1^2}{s_2^2} = \\frac{${s1Sq}}{${s2Sq}}$，分子自由度 $\\nu_1 = ${n1 - 1}$，分母自由度 $\\nu_2 = ${n2 - 1}$。`,
                  ),
                ],
                [["Simplify", "化简"], t(`$F = ${Q.of(s1Sq, s2Sq).toLatex()}$.`, `$F = ${Q.of(s1Sq, s2Sq).toLatex()}$。`)],
              ],
              s1Sq === s2Sq
                ? t("The variances are equal, so $F = 1$.", "两个方差相等，所以 $F = 1$。")
                : t(
                    `$s_1^2 = ${s1Sq}$ is ${s1Sq > s2Sq ? "larger" : "smaller"} than $s_2^2 = ${s2Sq}$, so $F \\approx ${(s1Sq / s2Sq).toFixed(3)}$ is ${s1Sq > s2Sq ? "above" : "below"} $1$.`,
                    `$s_1^2 = ${s1Sq}$ ${s1Sq > s2Sq ? "大于" : "小于"} $s_2^2 = ${s2Sq}$，所以 $F \\approx ${(s1Sq / s2Sq).toFixed(3)}$ ${s1Sq > s2Sq ? "大于" : "小于"} $1$。`,
                  ),
            ),
          });
        },
      },
      {
        id: "deciding-a-two-tailed-f-test",
        title: t("Deciding a two-tailed $F$-test", "双侧 $F$ 检验的决策"),
        explanation: t(
          "For $H_1: \\sigma_1^{2} \\neq \\sigma_2^{2}$, put the **larger** sample variance in the numerator so that $F \\ge 1$, and compare it with the upper critical value $F_{\\alpha/2}$ whose first degrees of freedom belong to the numerator sample. Reject $H_0$ when $F \\ge F_{\\alpha/2}(\\nu_1, \\nu_2)$.\n\nThis shortcut uses only the upper tail table, and it counts both directions because the larger variance is always on top. With $s_1^{2} = 50$ ($n_1 = 6$) and $s_2^{2} = 10$ ($n_2 = 8$): $F = 5$, short of $F_{0.025}(5, 7) = 5.285$, so $H_0$ is not rejected.\n\n> **Watch out.** The inverted ratio is below $1$ and can never pass the upper critical value; and that two variances differ is not by itself evidence.",
          "对于 $H_1: \\sigma_1^{2} \\neq \\sigma_2^{2}$，把**较大**的样本方差放在分子上使 $F \\ge 1$，再与上侧临界值 $F_{\\alpha/2}$ 比较，其第一自由度属于分子对应的样本。当 $F \\ge F_{\\alpha/2}(\\nu_1, \\nu_2)$ 时拒绝 $H_0$。\n\n这种做法只用上侧表，由于较大的方差总在分子上，两个方向都已计入。若 $s_1^{2} = 50$（$n_1 = 6$），$s_2^{2} = 10$（$n_2 = 8$）：$F = 5$，未达到 $F_{0.025}(5, 7) = 5.285$，所以不拒绝 $H_0$。\n\n> **注意。** 倒过来的比值小于 $1$，永远不会越过上侧临界值；两个方差数值不同本身也不是证据。",
        ),
        generate: (rng: Rng): Problem => {
          const [na, nb, crit] = rng.pick([
            [10, 10, "4.026"],
            [10, 15, "3.209"],
            [15, 10, "3.798"],
            [12, 12, "3.474"],
            [15, 15, "2.979"],
            [20, 20, "2.526"],
          ] as const);
          const small = rng.int(4, 30);
          const big = small + rng.int(Math.ceil(small * 0.5), small * 4);
          const swap = rng.bool();
          const [s1, s2, n1, n2] = swap ? [small, big, nb, na] : [big, small, na, nb];
          const F = Q.of(big, small);
          const reject = F.cmp(Q.parse(crit)) >= 0;
          const value = F.toNumber().toFixed(3);
          const rejects = t(
            `Reject $H_0$, because $F \\approx ${value}$ is at least $${crit}$`,
            `拒绝 $H_0$，因为 $F \\approx ${value}$ 不小于 $${crit}$`,
          );
          const keeps = t(
            `Do not reject $H_0$, because $F \\approx ${value}$ is less than $${crit}$`,
            `不拒绝 $H_0$，因为 $F \\approx ${value}$ 小于 $${crit}$`,
          );
          const differ = t(
            "Reject $H_0$, because the two sample variances are different numbers",
            "拒绝 $H_0$，因为两个样本方差的数值不同",
          );
          const inverted = t(
            `Do not reject $H_0$, because $F = \\frac{${small}}{${big}} \\approx ${Q.of(small, big).toNumber().toFixed(3)}$ is less than $${crit}$`,
            `不拒绝 $H_0$，因为 $F = \\frac{${small}}{${big}} \\approx ${Q.of(small, big).toNumber().toFixed(3)}$ 小于 $${crit}$`,
          );
          return reasoned(
            reasonChoice(rng, {
              prompt: t(
                `Sample 1 has $n_1 = ${n1}$ and $s_1^{2} = ${s1}$; sample 2 has $n_2 = ${n2}$ and $s_2^{2} = ${s2}$. Test $H_0: \\sigma_1^{2} = \\sigma_2^{2}$ against $H_1: \\sigma_1^{2} \\neq \\sigma_2^{2}$ at $\\alpha = 0.05$. With the larger variance in the numerator, the critical value is $F_{0.025}(${na - 1}, ${nb - 1}) = ${crit}$. What is the conclusion?`,
                `样本 1：$n_1 = ${n1}$，$s_1^{2} = ${s1}$；样本 2：$n_2 = ${n2}$，$s_2^{2} = ${s2}$。在 $\\alpha = 0.05$ 下检验 $H_0: \\sigma_1^{2} = \\sigma_2^{2}$ 对 $H_1: \\sigma_1^{2} \\neq \\sigma_2^{2}$。把较大方差放在分子上，临界值为 $F_{0.025}(${na - 1}, ${nb - 1}) = ${crit}$。结论是什么？`,
              ),
              correct: reject ? rejects : keeps,
              wrong: [reject ? keeps : rejects, differ, inverted],
              solution: walked(
                [
                  [
                    ["Put the larger variance on top", "把较大的方差放在分子上"],
                    t(
                      `$F = \\frac{${big}}{${small}} \\approx ${value}$, with the sample of variance $${big}$ giving the first degrees of freedom.`,
                      `$F = \\frac{${big}}{${small}} \\approx ${value}$，第一自由度来自方差为 $${big}$ 的样本。`,
                    ),
                  ],
                  [
                    ["Compare with the critical value", "与临界值比较"],
                    t(
                      `$${value}$ is ${reject ? "at least" : "less than"} $${crit}$, so ${reject ? "reject" : "do not reject"} $H_0$.`,
                      `$${value}$ ${reject ? "不小于" : "小于"} $${crit}$，所以${reject ? "拒绝" : "不拒绝"} $H_0$。`,
                    ),
                  ],
                ],
                t(
                  `With the larger variance on top, $F \\approx ${value}$ is above $1$, as it must be.`,
                  `较大方差在分子上，$F \\approx ${value}$ 大于 $1$，理应如此。`,
                ),
              ),
            }),
            [
              [
                keeps.en,
                `$F \\approx ${value}$ reaches $${crit}$, so the variances differ significantly.`,
                `$F \\approx ${value}$ 达到了 $${crit}$，所以两方差差异显著。`,
              ],
              [rejects.en, `$F \\approx ${value}$ falls short of $${crit}$.`, `$F \\approx ${value}$ 未达到 $${crit}$。`],
              [
                differ.en,
                "Sample variances almost always differ; the question is whether their ratio is large enough.",
                "样本方差几乎总会不同；问题在于它们的比是否足够大。",
              ],
              [
                inverted.en,
                "That puts the smaller variance on top; the ratio is then below $1$ and is not compared with the upper critical value.",
                "那把较小的方差放在了分子上；这样比值小于 $1$，不能与上侧临界值比较。",
              ],
            ],
          );
        },
      },
    ],
  },

  // 8.30.1 One-Factor Within Groups and Between Groups Variation
  {
    id: "one-factor-within-groups-and-between-groups-variation",
    title: t("One-Factor Within Groups and Between Groups Variation", "单因素组内与组间变异"),
    summary: t(
      "In one-way analysis of variance, total variation is partitioned into variation between group means (SSB) and variation within the individual groups (SSW).",
      "在单因素方差分析中，总变异被分解为组均值之间的变异（SSB，组间平方和）与各组内部的变异（SSW，组内平方和）。",
    ),
    intro: t(
      "Two groups are $2, 4$ and $6, 8$, with means $3$ and $7$ and grand mean $5$. Within the groups, $\\text{SSW} = (1 + 1) + (1 + 1) = 4$; between them, $\\text{SSB} = 2(3 - 5)^{2} + 2(7 - 5)^{2} = 16$.\n\nCheck: measured from $5$, the four values give $\\text{SST} = 9 + 1 + 1 + 9 = 20 = 16 + 4$.\n\nIn this lesson we say what SSB and SSW measure, compute SSB from group means and form the $F$ statistic from the sums of squares.",
      "两组数据为 $2, 4$ 和 $6, 8$，均值为 $3$ 和 $7$，总均值为 $5$。组内 $\\text{SSW} = (1 + 1) + (1 + 1) = 4$；组间 $\\text{SSB} = 2(3 - 5)^{2} + 2(7 - 5)^{2} = 16$。\n\n检验：以 $5$ 为基准，四个值给出 $\\text{SST} = 9 + 1 + 1 + 9 = 20 = 16 + 4$。\n\n本课我们说明 SSB 与 SSW 度量什么，由组均值计算 SSB，并由平方和构造 $F$ 统计量。",
    ),
    prerequisites: ["hypothesis-tests-for-two-means-equal-but-unknown-population-variances"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "concept-of-ssb-and-ssw",
        title: t("Meaning of SSB and SSW in ANOVA", "方差分析中 SSB 与 SSW 的含义"),
        explanation: t(
          "SSB measures differences among the group sample means (treatment effect). SSW measures the unexplained variation within each treatment group (random error). In a study of three diets, the spread of the weights inside each diet group goes into SSW, and the spread of the three diet means around the overall mean goes into SSB.\n\n> **Watch out.** The variation of every observation around the grand mean is SST, the whole; SSW is only the part left inside the groups, and the ratio of mean squares is $F$, not a sum of squares.",
          "SSB 测量各组样本均值之间的差异（处理效应）。SSW 测量每个处理组内部未解释的随机变异（随机误差）。在比较三种饮食的研究中，每种饮食组内体重的离散计入 SSW，三个饮食组均值围绕总均值的离散计入 SSB。\n\n> **注意。** 所有观测围绕总均值的变异是 SST，即总体；SSW 只是留在各组内部的那一部分；均方之比是 $F$，不是平方和。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(3, 6);
          const N = rng.int(30, 200);
          const contexts = [
            {
              descEn: "testing whether different fertilizer types result in different crop yields",
              descZh: "检验不同肥料类型是否导致不同的作物产量",
              factorEn: "fertilizer type",
              factorZh: "肥料类型",
            },
            {
              descEn: "testing whether different teaching methods result in different exam scores",
              descZh: "检验不同教学方法是否导致不同的考试成绩",
              factorEn: "teaching method",
              factorZh: "教学方法",
            },
            {
              descEn: "testing whether different drug dosages result in different blood pressure reductions",
              descZh: "检验不同药物剂量是否导致不同的降压效果",
              factorEn: "drug dosage",
              factorZh: "药物剂量",
            },
          ];
          const ctx = rng.pick(contexts);

          const opts = [
            t("Random error variation among individual observations within the same group.", "同一组内各观测值之间的随机误差变异。"),
            t(`Differences between the average yields caused by the ${ctx.factorEn}.`, `由${ctx.factorZh}引起的组均值之间的系统差异。`),
            t("The total variation of all observations around the overall grand mean.", "所有观测值相对于总体总均值的全部总变异。"),
            t("The ratio of the treatment variance to the error variance.", "处理方差与误差方差的比值。"),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return reasoned(
            choiceProblem({
              prompt: t(
                `In a one-way ANOVA with $k = ${k}$ groups and a total of $N = ${N}$ observations ${ctx.descEn}, what does the within-groups sum of squares ($SSW$, or sum of squares for error $SSE$) measure?`,
                `在包含 $k = ${k}$ 个组别、共 $N = ${N}$ 个观测值的单因素方差分析中，${ctx.descZh}，组内平方和（$SSW$，或误差平方和 $SSE$）测量的是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Say what SSW measures", "说出组内平方和度量什么"],
                    t(
                      "$SSW$ (Sum of Squares Within / Error) measures the dispersion of individual data points around their respective group mean, representing random experimental error.",
                      "$SSW$（组内平方和 / 误差平方和）测量单个数据点围绕其各自组均值的离散程度，代表随机试验误差。",
                    ),
                  ],
                  [
                    ["Set it against SSB", "与组间平方和对照"],
                    t(
                      `$SSB$ measures the variation of the ${k} group means around the grand mean, the part due to the ${ctx.factorEn}.`,
                      `$SSB$ 则测量 ${k} 个组均值围绕总均值的变异，即由${ctx.factorZh}造成的部分。`,
                    ),
                  ],
                ],
                t(
                  "$SST = SSB + SSW$, so $SSW$ is what remains of the total once the between-groups part is taken out.",
                  "$SST = SSB + SSW$，所以 $SSW$ 是从总变异中去掉组间部分后剩下的。",
                ),
              ),
            }),
            [
              [opts[1]!.en, "That is $SSB$, the variation between the group means.", "那是 $SSB$，即组均值之间的变异。"],
              [
                opts[2]!.en,
                "That is $SST$, the total; $SSW$ is only the part within the groups.",
                "那是 $SST$，即总变异；$SSW$ 只是组内的那部分。",
              ],
              [
                opts[3]!.en,
                "That ratio of mean squares is the $F$ statistic, not a sum of squares.",
                "均方之比是 $F$ 统计量，不是平方和。",
              ],
            ],
          );
        },
      },
      {
        id: "computing-ssb-from-group-means",
        title: t("Computing SSB from group means", "由组均值计算 SSB"),
        explanation: t(
          "The between-groups sum of squares measures how far the group means sit from the grand mean, weighted by group size:\n\n$$\\text{SSB} = \\sum_{i=1}^{k} n_i(\\bar{x}_i - \\bar{x})^{2}, \\qquad \\bar{x} = \\frac{\\sum n_i\\bar{x}_i}{N}.$$\n\nThe grand mean is the mean of all $N$ observations, so it is the **weighted** mean of the group means, not their plain average unless the groups have equal sizes. With two groups of sizes $2$ and $3$ and means $10$ and $15$: $\\bar{x} = \\frac{20 + 45}{5} = 13$ and $\\text{SSB} = 2(9) + 3(4) = 30$.\n\n> **Watch out.** Multiply each squared deviation by its $n_i$, and use the weighted grand mean; dividing SSB by $k - 1$ gives MSB, a different quantity.",
          "组间平方和衡量各组均值偏离总均值的程度，并以组容量加权：\n\n$$\\text{SSB} = \\sum_{i=1}^{k} n_i(\\bar{x}_i - \\bar{x})^{2}, \\qquad \\bar{x} = \\frac{\\sum n_i\\bar{x}_i}{N}.$$\n\n总均值是全部 $N$ 个观测的均值，因此是各组均值的**加权**平均；除非各组容量相等，否则它不等于组均值的简单平均。若两组容量为 $2$ 和 $3$，均值为 $10$ 和 $15$：$\\bar{x} = \\frac{20 + 45}{5} = 13$，$\\text{SSB} = 2(9) + 3(4) = 30$。\n\n> **注意。** 每个离差平方都要乘以对应的 $n_i$，并使用加权的总均值；SSB 除以 $k - 1$ 得到的是 MSB，是另一个量。",
        ),
        generate: (rng: Rng): Problem => {
          const ns = [rng.int(2, 8), rng.int(2, 8), rng.int(2, 8)];
          const ms = [rng.int(5, 20), rng.int(5, 20), rng.int(5, 20)];
          if (ms[0] === ms[1] && ms[1] === ms[2]) ms[2] = (ms[2] ?? 0) + 3;
          const N = ns.reduce((s, x) => s + x, 0);
          const total = ns.reduce((s, x, i) => s + x * (ms[i] ?? 0), 0);
          const grand = Q.of(total, N);
          const ssb = ns.reduce(
            (s, x, i) =>
              s.add(
                Q.of(x).mul(
                  Q.of(ms[i] ?? 0)
                    .sub(grand)
                    .pow(2),
                ),
              ),
            Q.zero,
          );
          const plain = Q.of(
            ms.reduce((s, x) => s + x, 0),
            3,
          );
          const unweighted = ms.reduce((s, x) => s.add(Q.of(x).sub(grand).pow(2)), Q.zero);
          const plainSsb = ns.reduce(
            (s, x, i) =>
              s.add(
                Q.of(x).mul(
                  Q.of(ms[i] ?? 0)
                    .sub(plain)
                    .pow(2),
                ),
              ),
            Q.zero,
          );
          return numberProblem({
            prompt: t(
              `Three groups have sizes $n_1 = ${ns[0]}$, $n_2 = ${ns[1]}$, $n_3 = ${ns[2]}$ and means $\\bar{x}_1 = ${ms[0]}$, $\\bar{x}_2 = ${ms[1]}$, $\\bar{x}_3 = ${ms[2]}$. Find the between-groups sum of squares SSB.`,
              `三个组的容量为 $n_1 = ${ns[0]}$，$n_2 = ${ns[1]}$，$n_3 = ${ns[2]}$，均值为 $\\bar{x}_1 = ${ms[0]}$，$\\bar{x}_2 = ${ms[1]}$，$\\bar{x}_3 = ${ms[2]}$。求组间平方和 SSB。`,
            ),
            answer: ssb,
            mistakes: distinct(ssb, [
              why(unweighted, "That leaves out the group sizes $n_i$ as weights.", "那漏掉了作为权重的组容量 $n_i$。"),
              why(
                plainSsb,
                "That measures from the plain average of the group means instead of the weighted grand mean.",
                "那以组均值的简单平均为基准，而不是加权的总均值。",
              ),
              why(
                ssb.div(Q.of(2)),
                "That divides by $k - 1 = 2$, which gives MSB rather than SSB.",
                "那除以了 $k - 1 = 2$，得到的是 MSB 而不是 SSB。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the weighted grand mean", "求加权总均值"],
                  t(
                    `$\\bar{x} = \\frac{${ns.map((x, i) => `${x}(${ms[i]})`).join(" + ")}}{${N}} = \\frac{${total}}{${N}} = ${grand.toLatex()}$.`,
                    `$\\bar{x} = \\frac{${ns.map((x, i) => `${x}(${ms[i]})`).join(" + ")}}{${N}} = \\frac{${total}}{${N}} = ${grand.toLatex()}$。`,
                  ),
                ],
                [
                  ["Add the weighted squared deviations", "把加权离差平方相加"],
                  t(
                    `$\\text{SSB} = ${ns.map((x, i) => `${x}\\left(${ms[i]} - ${grand.toLatex()}\\right)^{2}`).join(" + ")} = ${ssb.toLatex()}$.`,
                    `$\\text{SSB} = ${ns.map((x, i) => `${x}\\left(${ms[i]} - ${grand.toLatex()}\\right)^{2}`).join(" + ")} = ${ssb.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The weighted deviations cancel, $\\sum n_i(\\bar{x}_i - \\bar{x}) = ${total} - ${N}\\left(${grand.toLatex()}\\right) = 0$, which confirms the grand mean.`,
                `加权离差相互抵消，$\\sum n_i(\\bar{x}_i - \\bar{x}) = ${total} - ${N}\\left(${grand.toLatex()}\\right) = 0$，验证了总均值。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 8.30.2 The Relationship Between SSW, SSB, SST
  {
    id: "the-relationship-between-ssw-ssb-sst",
    title: t("The Relationship Between SSW, SSB, SST", "SSW、SSB 与 SST 之间的关系"),
    summary: t(
      "The total sum of squares splits as $\\text{SST} = \\text{SSB} + \\text{SSW}$, and the degrees of freedom split the same way: $N - 1 = (k - 1) + (N - k)$.",
      "总平方和分解为 $\\text{SST} = \\text{SSB} + \\text{SSW}$，自由度也同样分解：$N - 1 = (k - 1) + (N - k)$。",
    ),
    intro: t(
      "An ANOVA reports $\\text{SST} = 120$ and $\\text{SSB} = 45$. Since the total splits into the two parts, $\\text{SSW} = 120 - 45 = 75$. With $k = 3$ groups and $N = 18$ observations the degrees of freedom split the same way: $17 = 2 + 15$.\n\nCheck: $45 + 75 = 120$.\n\nIn this lesson we find a missing sum of squares, compute SSW from group data and find the $F$ statistic from the total and within sums of squares.",
      "某方差分析给出 $\\text{SST} = 120$，$\\text{SSB} = 45$。总平方和分成两部分，所以 $\\text{SSW} = 120 - 45 = 75$。有 $k = 3$ 组、$N = 18$ 个观测时，自由度也同样分解：$17 = 2 + 15$。\n\n检验：$45 + 75 = 120$。\n\n本课我们求缺失的平方和，由分组数据计算 SSW，并由总平方和与组内平方和求 $F$ 统计量。",
    ),
    prerequisites: ["one-factor-within-groups-and-between-groups-variation"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "anova-sum-of-squares-identity-calc",
        title: t("Computing missing sums of squares in ANOVA", "计算方差分析中缺失的平方和"),
        explanation: t(
          "The total variation splits exactly into variation between the group means and variation within the groups, so any two give the third. SST = SSB + SSW. If $\\text{SST} = 9.5$ and $\\text{SSW} = 7.25$, then $\\text{SSB} = 9.5 - 7.25 = 2.25$.\n\n> **Watch out.** SST is the whole: add the two parts to get it, subtract a part from it to get the other part, and never multiply.",
          "总变差恰好分成组间均值的变差和组内的变差，所以知道其中两个就能求出第三个。SST = SSB + SSW。若 $\\text{SST} = 9.5$，$\\text{SSW} = 7.25$，则 $\\text{SSB} = 9.5 - 7.25 = 2.25$。\n\n> **注意。** SST 是整体：两部分相加得到它，从它减去一部分得到另一部分，绝不相乘。",
        ),
        generate: (rng: Rng): Problem => {
          const ssb = rng.int(50, 600);
          const ssw = rng.int(80, 1200);
          const sst = ssb + ssw;

          const missing = rng.pick(["SST", "SSB", "SSW"]);
          if (missing === "SST") {
            return numberProblem({
              prompt: t(
                `In a one-way ANOVA study, the between-groups sum of squares is $SSB = ${ssb}$ and the within-groups sum of squares is $SSW = ${ssw}$. Find the total sum of squares $SST$.`,
                `在单因素方差分析研究中，组间平方和为 $SSB = ${ssb}$，组内平方和为 $SSW = ${ssw}$。求总平方和 $SST$。`,
              ),
              answer: sst,
              mistakes: distinct(sst, [
                why(ssb * ssw, "That multiplies the parts; the total is their sum.", "那把两部分相乘了；总平方和是它们的和。"),
                why(ssw - ssb, "That subtracts the parts; the total is their sum.", "那把两部分相减了；总平方和是它们的和。"),
                why(
                  Math.max(ssb, ssw),
                  "That is only the larger part; the total includes both.",
                  "那只是较大的一部分；总平方和包括两部分。",
                ),
              ]),
              solution: walked(
                [
                  [["Write the identity", "写出恒等式"], t("$SST = SSB + SSW$.", "$SST = SSB + SSW$。")],
                  [["Substitute", "代入"], t(`$SST = ${ssb} + ${ssw} = ${sst}$.`, `$SST = ${ssb} + ${ssw} = ${sst}$。`)],
                ],
                t(`$${sst} - ${ssw} = ${ssb}$ gives back SSB.`, `$${sst} - ${ssw} = ${ssb}$，还原出 SSB。`),
              ),
            });
          } else if (missing === "SSB") {
            return numberProblem({
              prompt: t(
                `In a one-way ANOVA study, the total sum of squares is $SST = ${sst}$ and the within-groups sum of squares is $SSW = ${ssw}$. Find the between-groups sum of squares $SSB$.`,
                `在单因素方差分析研究中，总平方和为 $SST = ${sst}$，组内平方和为 $SSW = ${ssw}$。求组间平方和 $SSB$。`,
              ),
              answer: ssb,
              mistakes: distinct(ssb, [
                why(sst + ssw, "That adds SSW to the total; subtract it instead.", "那把 SSW 加到了总平方和上；应当减去。"),
                why(ssw - sst, "That subtracts in the wrong order and gives a negative sum of squares.", "那减反了，得到负的平方和。"),
                why(ssw, "That is SSW itself, the other part.", "那是 SSW 本身，即另一部分。"),
              ]),
              solution: walked(
                [
                  [["Write the identity", "写出恒等式"], t("$SSB = SST - SSW$.", "$SSB = SST - SSW$。")],
                  [["Substitute", "代入"], t(`$SSB = ${sst} - ${ssw} = ${ssb}$.`, `$SSB = ${sst} - ${ssw} = ${ssb}$。`)],
                ],
                t(`$${ssb} + ${ssw} = ${sst}$, the total.`, `$${ssb} + ${ssw} = ${sst}$，正是总平方和。`),
              ),
            });
          } else {
            return numberProblem({
              prompt: t(
                `In a one-way ANOVA study, the total sum of squares is $SST = ${sst}$ and the between-groups sum of squares is $SSB = ${ssb}$. Find the within-groups sum of squares $SSW$.`,
                `在单因素方差分析研究中，总平方和为 $SST = ${sst}$，组间平方和为 $SSB = ${ssb}$. 求组内平方和 $SSW$。`,
              ),
              answer: ssw,
              mistakes: distinct(ssw, [
                why(sst + ssb, "That adds SSB to the total; subtract it instead.", "那把 SSB 加到了总平方和上；应当减去。"),
                why(ssb - sst, "That subtracts in the wrong order and gives a negative sum of squares.", "那减反了，得到负的平方和。"),
                why(ssb, "That is SSB itself, the other part.", "那是 SSB 本身，即另一部分。"),
              ]),
              solution: walked(
                [
                  [["Write the identity", "写出恒等式"], t("$SSW = SST - SSB$.", "$SSW = SST - SSB$。")],
                  [["Substitute", "代入"], t(`$SSW = ${sst} - ${ssb} = ${ssw}$.`, `$SSW = ${sst} - ${ssb} = ${ssw}$。`)],
                ],
                t(`$${ssb} + ${ssw} = ${sst}$, the total.`, `$${ssb} + ${ssw} = ${sst}$，正是总平方和。`),
              ),
            });
          }
        },
      },
      {
        id: "computing-ssw-from-group-data",
        title: t("Computing SSW from group data", "由分组数据计算 SSW"),
        explanation: t(
          "The within-groups sum of squares adds up the squared deviations of each observation from **its own group's** mean:\n\n$$\\text{SSW} = \\sum_{i=1}^{k}\\sum_{j} (x_{ij} - \\bar{x}_i)^{2}.$$\n\nCompute each group's mean, the squared deviations inside the group, and add over all groups. Measuring from the grand mean instead would give SST, which also contains the between-groups variation. With groups $1, 3$ and $4, 6, 8$: the means are $2$ and $6$, and $\\text{SSW} = (1 + 1) + (4 + 0 + 4) = 10$.\n\n> **Watch out.** Measure each observation from its own group's mean, not the grand mean, and do not divide: SSW divided by $N - k$ is MSW.",
          "组内平方和把每个观测与其**所在组**均值之差的平方加起来：\n\n$$\\text{SSW} = \\sum_{i=1}^{k}\\sum_{j} (x_{ij} - \\bar{x}_i)^{2}.$$\n\n先求每组的均值，再求组内的离差平方，最后对所有组求和。若改为以总均值为基准，得到的是 SST，其中还包含组间变异。若两组为 $1, 3$ 和 $4, 6, 8$：均值为 $2$ 和 $6$，$\\text{SSW} = (1 + 1) + (4 + 0 + 4) = 10$。\n\n> **注意。** 每个观测要以其所在组的均值为基准，而不是总均值；也不要再相除：SSW 除以 $N - k$ 是 MSW。",
        ),
        generate: (rng: Rng): Problem => {
          const sets = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-2, 1, 1],
            [-1, -1, 2],
            [-3, 1, 2],
            [1, 1, -2],
          ];
          const groups = [0, 1, 2].map(() => {
            const m = rng.int(4, 20);
            return { m, xs: rng.shuffle(rng.pick(sets)).map((e) => m + e) };
          });
          const ssw = groups.reduce((s, g) => s + g.xs.reduce((a, x) => a + (x - g.m) ** 2, 0), 0);
          const all = groups.flatMap((g) => g.xs);
          const grand = Q.of(
            all.reduce((s, x) => s + x, 0),
            all.length,
          );
          const sst = all.reduce((s, x) => s.add(Q.of(x).sub(grand).pow(2)), Q.zero);
          return numberProblem({
            prompt: t(
              `Three groups of observations are: group A: $${groups[0]?.xs.join(", ")}$; group B: $${groups[1]?.xs.join(", ")}$; group C: $${groups[2]?.xs.join(", ")}$. Find the within-groups sum of squares SSW.`,
              `三组观测值为：A 组 $${groups[0]?.xs.join(", ")}$；B 组 $${groups[1]?.xs.join(", ")}$；C 组 $${groups[2]?.xs.join(", ")}$。求组内平方和 SSW。`,
            ),
            answer: ssw,
            mistakes: distinct(ssw, [
              why(
                sst,
                "That measures every observation from the grand mean, which gives SST.",
                "那以总均值为基准衡量每个观测，得到的是 SST。",
              ),
              why(
                Q.of(ssw, 6),
                "That divides by $N - k = 6$, which gives MSW rather than SSW.",
                "那除以了 $N - k = 6$，得到的是 MSW 而不是 SSW。",
              ),
              why(
                Q.of(ssw, 2),
                "That divides by $2$; SSW is the plain sum of the squared deviations.",
                "那除以了 $2$；SSW 就是离差平方的直接求和。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find each group's mean", "求每组的均值"],
                  t(`The group means are $${groups.map((g) => g.m).join(", ")}$.`, `各组均值为 $${groups.map((g) => g.m).join(", ")}$。`),
                ],
                [
                  ["Add the squared deviations in each group", "求每组的离差平方和"],
                  t(
                    `The squared deviations within the groups sum to ${groups.map((g) => `$${g.xs.reduce((a, x) => a + (x - g.m) ** 2, 0)}$`).join(", ")}, so $\\text{SSW} = ${ssw}$.`,
                    `各组内离差平方和分别为 ${groups.map((g) => `$${g.xs.reduce((a, x) => a + (x - g.m) ** 2, 0)}$`).join("，")}，所以 $\\text{SSW} = ${ssw}$。`,
                  ),
                ],
              ],
              t(
                `$\\text{SSW} = ${ssw}$ is no more than $\\text{SST} = ${sst.toLatex()}$, because each group's own mean fits it at least as well as the grand mean does.`,
                `$\\text{SSW} = ${ssw}$ 不超过 $\\text{SST} = ${sst.toLatex()}$，因为每组自己的均值对本组的拟合至少和总均值一样好。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 8.30.3 One-Factor Analysis of Variance
  {
    id: "one-factor-analysis-of-variance",
    title: t("One-Factor Analysis of Variance", "单因素方差分析"),
    summary: t(
      "To test $H_0: \\mu_1 = \\mu_2 = \\cdots = \\mu_k$, the ANOVA statistic $F = \\frac{\\text{MSB}}{\\text{MSW}} = \\frac{\\text{SSB}/(k - 1)}{\\text{SSW}/(N - k)}$ follows $F(k - 1, N - k)$ under $H_0$.",
      "检验 $H_0: \\mu_1 = \\mu_2 = \\cdots = \\mu_k$ 时，方差分析统计量 $F = \\frac{\\text{MSB}}{\\text{MSW}} = \\frac{\\text{SSB}/(k - 1)}{\\text{SSW}/(N - k)}$ 在 $H_0$ 下服从 $F(k - 1, N - k)$。",
    ),
    intro: t(
      "Three groups with $N = 15$ observations in all have $\\text{SSB} = 40$ and $\\text{SSW} = 60$. Then $\\text{MSB} = \\frac{40}{2} = 20$, $\\text{MSW} = \\frac{60}{12} = 5$ and $F = 4$ with $(2, 12)$ degrees of freedom. Since $F_{0.05}(2, 12) = 3.885$, the test rejects equal means.\n\nCheck: the degrees of freedom add up, $2 + 12 = 14 = N - 1$.\n\nIn this lesson we compute the one-way ANOVA $F$ statistic, find it from SST and SSB, and find its degrees of freedom.",
      "三个组共 $N = 15$ 个观测，$\\text{SSB} = 40$，$\\text{SSW} = 60$。于是 $\\text{MSB} = \\frac{40}{2} = 20$，$\\text{MSW} = \\frac{60}{12} = 5$，$F = 4$，自由度为 $(2, 12)$。由于 $F_{0.05}(2, 12) = 3.885$，检验拒绝各均值相等。\n\n检验：自由度相加正好，$2 + 12 = 14 = N - 1$。\n\n本课我们计算单因素方差分析的 $F$ 统计量，由 SST 和 SSB 求它，并求它的自由度。",
    ),
    prerequisites: ["the-relationship-between-ssw-ssb-sst", "the-f-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "one-way-anova-f-statistic-calc",
        title: t("Computing the one-way ANOVA F-statistic", "计算单因素方差分析的 F 检验统计量"),
        explanation: t(
          "Dividing each sum of squares by its degrees of freedom gives a mean square, and a large ratio of between to within suggests the group means differ. F = MSB / MSW, where MSB = SSB / (k - 1) and MSW = SSW / (N - k). With $k = 2$, $N = 12$, $\\text{SSB} = 8$ and $\\text{SSW} = 20$: $\\text{MSB} = 8$, $\\text{MSW} = 2$ and $F = 4$.\n\n> **Watch out.** Divide by the degrees of freedom $k - 1$ and $N - k$, not by $k$ and $N$, and put MSB on top.",
          "把每个平方和除以其自由度得到均方，组间与组内均方之比很大时，说明各组均值存在差异。F = MSB / MSW，其中 MSB = SSB / (k - 1) 且 MSW = SSW / (N - k)。若 $k = 2$，$N = 12$，$\\text{SSB} = 8$，$\\text{SSW} = 20$：$\\text{MSB} = 8$，$\\text{MSW} = 2$，$F = 4$。\n\n> **注意。** 要除以自由度 $k - 1$ 和 $N - k$，而不是 $k$ 和 $N$；并把 MSB 放在分子上。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(3, 6);
          const dfB = k - 1;
          const dfW = rng.int(10, 40);
          const N = k + dfW;

          const msB = rng.int(20, 150);
          const msW = rng.int(5, 40);
          const ssb = msB * dfB;
          const ssw = msW * dfW;

          return numberProblem({
            prompt: t(
              `A one-way ANOVA compares $k = ${k}$ treatment groups with a total of $N = ${N}$ observations across all groups. The sum of squares are $SSB = ${ssb}$ and $SSW = ${ssw}$. Compute the exact rational value of the ANOVA test statistic $F$.`,
              `某单因素方差分析比较 $k = ${k}$ 个处理组，全部组共计 $N = ${N}$ 个观测值。已知平方和为 $SSB = ${ssb}$ 与 $SSW = ${ssw}$。计算该方差分析检验统计量 $F$ 的精确有理数值。`,
            ),
            answer: Q.of(msB, msW),
            mistakes: distinct(Q.of(msB, msW), [
              why(
                Q.of(ssb, ssw),
                "That divides the sums of squares without their degrees of freedom.",
                "那直接用平方和相除，没有除以各自的自由度。",
              ),
              why(Q.of(msW, msB), "That inverts the ratio; MSB goes on top.", "那把比值倒过来了；MSB 应在分子上。"),
              why(Q.of(ssb * dfW, ssw * (dfB + 1)), "That divides SSB by $k$ instead of $k - 1$.", "那把 SSB 除以了 $k$，而不是 $k - 1$。"),
            ]),
            solution: walked(
              [
                [
                  ["Find the between-groups mean square", "求组间均方"],
                  t(
                    `$MSB = \\frac{SSB}{k - 1} = \\frac{${ssb}}{${dfB}} = ${msB}$.`,
                    `$MSB = \\frac{SSB}{k - 1} = \\frac{${ssb}}{${dfB}} = ${msB}$。`,
                  ),
                ],
                [
                  ["Find the within-groups mean square", "求组内均方"],
                  t(
                    `$MSW = \\frac{SSW}{N - k} = \\frac{${ssw}}{${dfW}} = ${msW}$.`,
                    `$MSW = \\frac{SSW}{N - k} = \\frac{${ssw}}{${dfW}} = ${msW}$。`,
                  ),
                ],
                [
                  ["Divide", "相除"],
                  t(
                    `$F = \\frac{MSB}{MSW} = \\frac{${msB}}{${msW}} = ${Q.of(msB, msW).toLatex()}$.`,
                    `$F = \\frac{MSB}{MSW} = \\frac{${msB}}{${msW}} = ${Q.of(msB, msW).toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The degrees of freedom add up: $${dfB} + ${dfW} = ${N - 1} = N - 1$.`,
                `自由度相加正好：$${dfB} + ${dfW} = ${N - 1} = N - 1$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-f-statistic-from-sst-and-ssb",
        title: t("The $F$ statistic from SST and SSB", "由 SST 和 SSB 求 $F$ 统计量"),
        explanation: t(
          "An ANOVA table is often reported with SST and SSB only. Recover the within-groups part first, $\\text{SSW} = \\text{SST} - \\text{SSB}$, then divide each part by its degrees of freedom:\n\n$$F = \\frac{\\text{SSB}/(k - 1)}{(\\text{SST} - \\text{SSB})/(N - k)}.$$\n\nDividing SSB by SST instead gives the proportion of variation explained, $\\eta^{2}$, which is not a test statistic. With $k = 2$, $N = 10$, $\\text{SST} = 50$ and $\\text{SSB} = 10$: $\\text{SSW} = 40$ and $F = \\frac{10/1}{40/8} = 2$.\n\n> **Watch out.** Subtract SSB from SST before dividing; SST itself is never the denominator, and the within-groups degrees of freedom are $N - k$, not $N - 1$.",
          "方差分析表常常只给出 SST 和 SSB。先求出组内部分 $\\text{SSW} = \\text{SST} - \\text{SSB}$，再把各部分除以其自由度：\n\n$$F = \\frac{\\text{SSB}/(k - 1)}{(\\text{SST} - \\text{SSB})/(N - k)}.$$\n\n若改用 SSB 除以 SST，得到的是被解释变异的比例 $\\eta^{2}$，它不是检验统计量。若 $k = 2$，$N = 10$，$\\text{SST} = 50$，$\\text{SSB} = 10$：$\\text{SSW} = 40$，$F = \\frac{10/1}{40/8} = 2$。\n\n> **注意。** 先从 SST 中减去 SSB 再相除；SST 本身绝不是分母；组内自由度是 $N - k$，不是 $N - 1$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(3, 5);
          const N = k * rng.int(4, 9);
          const ssb = rng.int(20, 200);
          const ssw = rng.int(40, 400);
          const sst = ssb + ssw;
          const ans = Q.of(ssb * (N - k), (k - 1) * ssw);
          return numberProblem({
            prompt: t(
              `A one-way ANOVA compares $k = ${k}$ groups with $N = ${N}$ observations in all. The total sum of squares is $\\text{SST} = ${sst}$ and the between-groups sum of squares is $\\text{SSB} = ${ssb}$. Find the $F$ statistic.`,
              `单因素方差分析比较 $k = ${k}$ 个组，共 $N = ${N}$ 个观测。总平方和 $\\text{SST} = ${sst}$，组间平方和 $\\text{SSB} = ${ssb}$。求 $F$ 统计量。`,
            ),
            answer: ans,
            mistakes: distinct(ans, [
              why(
                Q.of(ssb * (N - k), (k - 1) * sst),
                "That uses SST as the within-groups sum of squares; subtract SSB first.",
                "那把 SST 当作组内平方和；应先减去 SSB。",
              ),
              why(
                Q.of(ssb, ssw),
                "That divides the sums of squares without their degrees of freedom.",
                "那直接用平方和相除，没有除以各自的自由度。",
              ),
              why(
                Q.of(ssb * (N - 1), (k - 1) * ssw),
                "That divides SSW by $N - 1$; its degrees of freedom are $N - k$.",
                "那把 SSW 除以了 $N - 1$；它的自由度是 $N - k$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Recover the within-groups part", "求出组内部分"],
                  t(`$\\text{SSW} = ${sst} - ${ssb} = ${ssw}$.`, `$\\text{SSW} = ${sst} - ${ssb} = ${ssw}$。`),
                ],
                [
                  ["Divide the mean squares", "用均方相除"],
                  t(
                    `$F = \\frac{${ssb}/${k - 1}}{${ssw}/${N - k}} = \\frac{${ssb * (N - k)}}{${(k - 1) * ssw}}${lowestTerms(ssb * (N - k), (k - 1) * ssw)}$.`,
                    `$F = \\frac{${ssb}/${k - 1}}{${ssw}/${N - k}} = \\frac{${ssb * (N - k)}}{${(k - 1) * ssw}}${lowestTerms(ssb * (N - k), (k - 1) * ssw)}$。`,
                  ),
                ],
              ],
              t(
                `$${ssb} + ${ssw} = ${sst}$ restores SST, and the degrees of freedom $${k - 1}$ and $${N - k}$ add to $N - 1 = ${N - 1}$.`,
                `$${ssb} + ${ssw} = ${sst}$ 还原出 SST，自由度 $${k - 1}$ 与 $${N - k}$ 之和为 $N - 1 = ${N - 1}$。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
