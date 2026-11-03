import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem } from "../problems.ts";

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
    prerequisites: ["the-central-limit-theorem"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "formulating-null-and-alternative-hypotheses",
        title: t("Formulating null and alternative hypotheses", "建立原假设与备择假设"),
        explanation: t(
          "The null hypothesis always includes equality ($H_0: \\mu = \\mu_0$). The alternative hypothesis states the direction of the effect: two-tailed ($\\mu \\ne \\mu_0$), right-tailed ($\\mu > \\mu_0$), or left-tailed ($\\mu < \\mu_0$).",
          "原假设始终包含等号（$H_0: \\mu = \\mu_0$）。备择假设指明效应方向：双尾（$\\mu \\ne \\mu_0$）、右尾（$\\mu > \\mu_0$）或左尾（$\\mu < \\mu_0$）。",
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

          return choiceProblem({
            prompt: t(
              `A researcher tests whether the population mean $\\mu$ of ${ctx.itemEn} is ${ctx.claimEn} ${mu0}. Which pair of hypotheses correctly formulates this statistical test?`,
              `研究人员想检验${ctx.itemZh}的总体均值 $\\mu$ 是否${ctx.claimZh} ${mu0}。哪一对假设正确地建立了该统计检验？`,
            ),
            options,
            correct,
            solution: t(
              `The null hypothesis must state equality with the hypothesized value: $H_0: \\mu = ${mu0}$. The alternative hypothesis reflects the researcher's claim: $H_1: \\mu ${ctx.dir} ${mu0}$. Hypotheses are always stated in terms of population parameters ($\\mu$), never sample statistics ($\\bar{x}$).`,
              `原假设必须陈述与假设基准值相等：$H_0: \\mu = ${mu0}$。备择假设反映研究者的研究主张：$H_1: \\mu ${ctx.dir} ${mu0}$。假设始终关于总体参数（$\\mu$）陈述，绝不能用样本统计量（$\\bar{x}$）。`,
            ),
          });
        },
      },
      {
        id: "choosing-the-direction-of-the-alternative",
        title: t("Choosing the direction of the alternative", "确定备择假设的方向"),
        explanation: t(
          'The wording of the claim decides the alternative hypothesis, and with it the tail of the test:\n\n- "increased", "more than", "exceeds": right-tailed, $H_1: \\mu > \\mu_0$;\n- "decreased", "less than", "falls short": left-tailed, $H_1: \\mu < \\mu_0$;\n- "differs", "changed", "is not equal to": two-tailed, $H_1: \\mu \\neq \\mu_0$.\n\nThe null hypothesis always contains the equality $\\mu = \\mu_0$. Choose the direction before looking at the data; picking it afterwards to match the sample doubles the real chance of a false rejection.',
          "论断的措辞决定备择假设，也就决定了检验的尾部：\n\n- “增加”“多于”“超过”：右侧检验，$H_1: \\mu > \\mu_0$；\n- “减少”“少于”“不足”：左侧检验，$H_1: \\mu < \\mu_0$；\n- “不同”“改变”“不等于”：双侧检验，$H_1: \\mu \\neq \\mu_0$。\n\n原假设总是包含等号 $\\mu = \\mu_0$。方向要在看数据之前确定；看了样本再选方向，会使错误拒绝的实际概率加倍。",
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
          return choiceProblem({
            prompt: t(
              `An analyst wants to test the claim that ${item[0]} ${claim[0]} $${mu0}$. Which alternative hypothesis should the test use?`,
              `一位分析师想检验这样的论断：${item[1]}${claim[1]} $${mu0}$。检验应采用哪个备择假设？`,
            ),
            options: [
              t(`$H_1: \\mu > ${mu0}$ (right-tailed)`, `$H_1: \\mu > ${mu0}$（右侧检验）`),
              t(`$H_1: \\mu < ${mu0}$ (left-tailed)`, `$H_1: \\mu < ${mu0}$（左侧检验）`),
              t(`$H_1: \\mu \\neq ${mu0}$ (two-tailed)`, `$H_1: \\mu \\neq ${mu0}$（双侧检验）`),
              t(`$H_1: \\mu = ${mu0}$`, `$H_1: \\mu = ${mu0}$`),
            ],
            correct: claim[2],
            solution: t(
              `The claim "${claim[0]}" points ${["above", "below", "away from"][claim[2]]} $${mu0}$, so $H_0: \\mu = ${mu0}$ and $H_1: \\mu ${[">", "<", "\\neq"][claim[2]]} ${mu0}$. The equality always belongs to $H_0$.`,
              `“${claim[1]}”指向${["大于", "小于", "不等于"][claim[2]]} $${mu0}$，所以 $H_0: \\mu = ${mu0}$，$H_1: \\mu ${[">", "<", "\\neq"][claim[2]]} ${mu0}$。等号总是属于 $H_0$。`,
            ),
          });
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
    prerequisites: ["introduction-to-hypothesis-testing", "the-poisson-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "poisson-normal-test-statistic",
        title: t("Computing the standardized test statistic for Poisson rate", "计算泊松发生率的标准化检验统计量"),
        explanation: t(
          "Under the null hypothesis the total count has mean and variance both equal to the expected count, so standardize with its square root. Under $H_0$, $E[K] = n\\lambda_0$ and $\\operatorname{Var}(K) = n\\lambda_0$, so $Z = \\frac{K - n\\lambda_0}{\\sqrt{n\\lambda_0}}$.",
          "在原假设下，总计数的均值和方差都等于期望计数，所以用它的平方根来标准化。在 $H_0$ 下，$E[K] = n\\lambda_0$ 且 $\\operatorname{Var}(K) = n\\lambda_0$，故 $Z = \\frac{K - n\\lambda_0}{\\sqrt{n\\lambda_0}}$。",
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
              `Over $n = ${n}$ observation periods, a total of $K = ${k}$ events are observed. Test $H_0: \\lambda = ${lambda0}$ against $H_1: \\lambda \\neq ${lambda0}$. Compute the standardized test statistic $z = \\frac{K - n\\lambda_0}{\\sqrt{n\\lambda_0}}$.`,
              `在 $n = ${n}$ 个观测周期内，共观测到 $K = ${k}$ 次事件。检验 $H_0: \\lambda = ${lambda0}$ 对 $H_1: \\lambda \\neq ${lambda0}$。计算标准化检验统计量 $z = \\frac{K - n\\lambda_0}{\\sqrt{n\\lambda_0}}$。`,
            ),
            answer: z,
            wrong: [d * m, -d, Q.of(d, m)],
            solution: t(
              `The expected count under $H_0$ is $n\\lambda_0 = ${n} \\times ${lambda0} = ${expected}$, so $\\sqrt{n\\lambda_0} = ${m}$. The test statistic is $z = \\frac{${k} - ${expected}}{${m}} = \\frac{${d * m}}{${m}} = ${z}$.`,
              `在 $H_0$ 下的期望事件数为 $n\\lambda_0 = ${n} \\times ${lambda0} = ${expected}$，故 $\\sqrt{n\\lambda_0} = ${m}$。检验统计量为 $z = \\frac{${k} - ${expected}}{${m}} = \\frac{${d * m}}{${m}} = ${z}$。`,
            ),
          });
        },
      },
      {
        id: "an-exact-poisson-p-value",
        title: t("An exact Poisson $p$-value", "精确的泊松 $p$ 值"),
        explanation: t(
          "When $n\\lambda_0$ is small the normal approximation is poor, and the $p$-value comes straight from the Poisson distribution. For $H_1: \\lambda > \\lambda_0$ and an observed total $k$,\n\n$$p = P(K \\ge k) = 1 - \\sum_{j=0}^{k-1} e^{-n\\lambda_0}\\frac{(n\\lambda_0)^{j}}{j!}.$$\n\nInclude $k$ itself in the tail: the $p$-value is the probability of a result **at least** as extreme as the one observed. With $n\\lambda_0 = 2$ and $k = 5$: $1 - e^{-2}(1 + 2 + 2 + \\tfrac{4}{3} + \\tfrac{2}{3}) = 1 - 7e^{-2} \\approx 0.0527$.",
          "当 $n\\lambda_0$ 较小时，正态近似效果差，$p$ 值要直接由泊松分布计算。对于 $H_1: \\lambda > \\lambda_0$ 和观测总数 $k$，\n\n$$p = P(K \\ge k) = 1 - \\sum_{j=0}^{k-1} e^{-n\\lambda_0}\\frac{(n\\lambda_0)^{j}}{j!}.$$\n\n尾部要包括 $k$ 本身：$p$ 值是出现**至少**与观测结果一样极端的结果的概率。若 $n\\lambda_0 = 2$，$k = 5$：$1 - e^{-2}(1 + 2 + 2 + \\tfrac{4}{3} + \\tfrac{2}{3}) = 1 - 7e^{-2} \\approx 0.0527$。",
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
          const wrong = [r4(1 - below(k + 1)), r4(pmf(k)), r4(below(k))].filter((w) => !w.eq(ans));
          return numberProblem({
            prompt: t(
              `Events are counted over $n = ${n}$ periods. Under $H_0: \\lambda = ${dec(lambda0)}$ per period, the total $K$ is Poisson with mean $n\\lambda_0$. A total of $k = ${k}$ events is observed. Find the exact $p$-value for $H_1: \\lambda > ${dec(lambda0)}$, rounded to four decimal places.`,
              `在 $n = ${n}$ 个时段内计数事件。在 $H_0: \\lambda = ${dec(lambda0)}$（每时段）下，总数 $K$ 服从均值为 $n\\lambda_0$ 的泊松分布。观测到总数 $k = ${k}$。求对 $H_1: \\lambda > ${dec(lambda0)}$ 的精确 $p$ 值，精确到四位小数。`,
            ),
            answer: ans,
            form: "decimal",
            wrong,
            solution: t(
              `$n\\lambda_0 = ${m}$, so $p = P(K \\ge ${k}) = 1 - \\sum_{j=0}^{${k - 1}} e^{-${m}}\\frac{${m}^{j}}{j!} = 1 - ${below(k).toFixed(4)} \\approx ${dec(ans)}$.`,
              `$n\\lambda_0 = ${m}$，所以 $p = P(K \\ge ${k}) = 1 - \\sum_{j=0}^{${k - 1}} e^{-${m}}\\frac{${m}^{j}}{j!} = 1 - ${below(k).toFixed(4)} \\approx ${dec(ans)}$。`,
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
    prerequisites: ["introduction-to-hypothesis-testing", "percentage-points-of-the-standard-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-left-tailed-critical-region",
        title: t("Evaluating left-tailed test decisions", "评估左尾检验的决策"),
        explanation: t(
          "A left tailed test looks for evidence that the parameter is smaller than claimed, so only a statistic far enough to the left leads to rejection. If $z_{\\text{calc}} \\le -z_\\alpha$, reject $H_0$; otherwise fail to reject $H_0$.",
          "左尾检验寻找参数小于声称值的证据，所以只有统计量足够靠左时才拒绝原假设。若 $z_{\\text{calc}} \\le -z_\\alpha$，则拒绝 $H_0$；否则不拒绝 $H_0$。",
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

          return choiceProblem({
            prompt: t(
              `A left-tailed test of $H_0: \\mu = \\mu_0$ versus $H_1: \\mu < \\mu_0$ is conducted at significance level $\\alpha = ${lvl.alpha}$ (critical value $-z_\\alpha = ${lvl.zCrit}$). The calculated test statistic is $z = ${zCalc}$. What is the correct statistical decision?`,
              `在显著性水平 $\\alpha = ${lvl.alpha}$（临界值 $-z_\\alpha = ${lvl.zCrit}$）下进行左尾检验 $H_0: \\mu = \\mu_0$ 对 $H_1: \\mu < \\mu_0$。计算得到的检验统计量为 $z = ${zCalc}$。正确的统计决策是什么？`,
            ),
            options,
            correct,
            solution: t(
              `For a left-tailed test, the rejection region is $(-\\infty, -z_\\alpha] = (-\\infty, ${lvl.zCrit}]$. Since $z = ${zCalc}$ is ${isReject ? "less than or equal to" : "strictly greater than"} ${lvl.zCrit}, we ${isReject ? "reject" : "fail to reject"} $H_0$.`,
              `对于左尾检验，拒绝域为 $(-\\infty, -z_\\alpha] = (-\\infty, ${lvl.zCrit}]$。因为 $z = ${zCalc}$ ${isReject ? "小于等于" : "严格大于"} ${lvl.zCrit}，所以我们${isReject ? "拒绝" : "不拒绝"} $H_0$。`,
            ),
          });
        },
      },
      {
        id: "the-critical-sample-mean-for-a-left-tailed-test",
        title: t("The critical sample mean for a left-tailed test", "左侧检验的临界样本均值"),
        explanation: t(
          "The critical region can be stated for $\\bar{x}$ itself instead of for $Z$. Solving $\\frac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}} \\le -z_{\\alpha}$ for $\\bar{x}$ gives\n\n$$\\bar{x} \\le \\mu_0 - z_{\\alpha}\\frac{\\sigma}{\\sqrt{n}}.$$\n\nUse the one-tailed value $z_{\\alpha}$ (for example $1.645$ at $\\alpha = 0.05$), not $z_{\\alpha/2}$. With $\\mu_0 = 100$, $\\sigma = 15$, $n = 25$ and $\\alpha = 0.05$, the test rejects when $\\bar{x} \\le 100 - 1.645 \\cdot 3 = 95.065$.",
          "临界域可以直接用 $\\bar{x}$ 而不是 $Z$ 来表示。由 $\\frac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}} \\le -z_{\\alpha}$ 解出 $\\bar{x}$：\n\n$$\\bar{x} \\le \\mu_0 - z_{\\alpha}\\frac{\\sigma}{\\sqrt{n}}.$$\n\n要用单侧值 $z_{\\alpha}$（例如 $\\alpha = 0.05$ 时为 $1.645$），而不是 $z_{\\alpha/2}$。若 $\\mu_0 = 100$，$\\sigma = 15$，$n = 25$，$\\alpha = 0.05$，则当 $\\bar{x} \\le 100 - 1.645 \\cdot 3 = 95.065$ 时拒绝。",
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
          return numberProblem({
            prompt: t(
              `A test of $H_0: \\mu = ${mu0}$ against $H_1: \\mu < ${mu0}$ uses a sample of $n = ${k * k}$ from a normal population with $\\sigma = ${dec(sigma)}$, at $\\alpha = ${alpha}$ ($z_{\\alpha} = ${za}$). Below what sample mean is $H_0$ rejected?`,
              `用来自 $\\sigma = ${dec(sigma)}$ 的正态总体、容量 $n = ${k * k}$ 的样本，在 $\\alpha = ${alpha}$（$z_{\\alpha} = ${za}$）下检验 $H_0: \\mu = ${mu0}$ 对 $H_1: \\mu < ${mu0}$。样本均值低于多少时拒绝 $H_0$？`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [Q.of(mu0).add(z.mul(se)), Q.of(mu0).sub(z.mul(sigma)), Q.of(mu0).sub(Q.parse(zhalf).mul(se))],
            solution: t(
              `$\\frac{\\sigma}{\\sqrt{n}} = \\frac{${dec(sigma)}}{${k}} = ${dec(se)}$, so the boundary is $${mu0} - ${za} \\cdot ${dec(se)} = ${dec(ans)}$; reject when $\\bar{x} \\le ${dec(ans)}$.`,
              `$\\frac{\\sigma}{\\sqrt{n}} = \\frac{${dec(sigma)}}{${k}} = ${dec(se)}$，所以边界为 $${mu0} - ${za} \\cdot ${dec(se)} = ${dec(ans)}$；当 $\\bar{x} \\le ${dec(ans)}$ 时拒绝。`,
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
    prerequisites: ["critical-regions-for-left-tailed-hypothesis-tests"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-right-tailed-critical-region",
        title: t("Evaluating right-tailed test decisions", "评估右尾检验的决策"),
        explanation: t(
          "A right tailed test looks for evidence that the parameter is larger than claimed, so only a statistic far enough to the right leads to rejection. If $z_{\\text{calc}} \\ge z_\\alpha$, reject $H_0$; otherwise fail to reject $H_0$.",
          "右尾检验寻找参数大于声称值的证据，所以只有统计量足够靠右时才拒绝原假设。若 $z_{\\text{calc}} \\ge z_\\alpha$，则拒绝 $H_0$；否则不拒绝 $H_0$。",
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

          return choiceProblem({
            prompt: t(
              `A right-tailed test of $H_0: \\mu = \\mu_0$ versus $H_1: \\mu > \\mu_0$ is conducted at significance level $\\alpha = ${lvl.alpha}$ (critical value $z_\\alpha = ${lvl.zCrit}$). The calculated test statistic is $z = ${zCalc}$. What is the correct statistical decision?`,
              `在显著性水平 $\\alpha = ${lvl.alpha}$（临界值 $z_\\alpha = ${lvl.zCrit}$）下进行右尾检验 $H_0: \\mu = \\mu_0$ 对 $H_1: \\mu > \\mu_0$。计算得到的检验统计量为 $z = ${zCalc}$。正确的统计决策是什么？`,
            ),
            options,
            correct,
            solution: t(
              `For a right-tailed test, the rejection region is $[z_\\alpha, \\infty) = [${lvl.zCrit}, \\infty)$. Since $z = ${zCalc}$ is ${isReject ? "greater than or equal to" : "strictly less than"} ${lvl.zCrit}, we ${isReject ? "reject" : "fail to reject"} $H_0$.`,
              `对于右尾检验，拒绝域为 $[z_\\alpha, \\infty) = [${lvl.zCrit}, \\infty)$。因为 $z = ${zCalc}$ ${isReject ? "大于等于" : "严格小于"} ${lvl.zCrit}，所以我们${isReject ? "拒绝" : "不拒绝"} $H_0$。`,
            ),
          });
        },
      },
      {
        id: "deciding-a-right-tailed-test-from-the-sample-mean",
        title: t("Deciding a right-tailed test from the sample mean", "由样本均值作右侧检验的决策"),
        explanation: t(
          "From raw data, standardize first: $z = \\frac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}}$, then compare with $z_{\\alpha}$. Reject $H_0$ when $z \\ge z_{\\alpha}$; otherwise do not reject.\n\nNot rejecting is not the same as proving $H_0$: the data are merely consistent with it. A sample mean above $\\mu_0$ is not enough by itself; it has to be far enough above, measured in standard errors.",
          "面对原始数据，先标准化：$z = \\frac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}}$，再与 $z_{\\alpha}$ 比较。当 $z \\ge z_{\\alpha}$ 时拒绝 $H_0$，否则不拒绝。\n\n不拒绝并不等于证明了 $H_0$：数据只是与它相容。样本均值高于 $\\mu_0$ 本身并不够，还要以标准误衡量高出足够多。",
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
          return choiceProblem({
            prompt: t(
              `A sample of $n = ${k * k}$ from a normal population with $\\sigma = ${dec(se.mul(Q.of(k)))}$ has $\\bar{x} = ${dec(xbar)}$. Test $H_0: \\mu = ${mu0}$ against $H_1: \\mu > ${mu0}$ at $\\alpha = ${alpha}$ ($z_{\\alpha} = ${za}$). What is the conclusion?`,
              `来自 $\\sigma = ${dec(se.mul(Q.of(k)))}$ 的正态总体、容量 $n = ${k * k}$ 的样本有 $\\bar{x} = ${dec(xbar)}$。在 $\\alpha = ${alpha}$（$z_{\\alpha} = ${za}$）下检验 $H_0: \\mu = ${mu0}$ 对 $H_1: \\mu > ${mu0}$。结论是什么？`,
            ),
            options: [
              t(`Reject $H_0$: the data support $\\mu > ${mu0}$.`, `拒绝 $H_0$：数据支持 $\\mu > ${mu0}$。`),
              t(
                `Do not reject $H_0$: the evidence for $\\mu > ${mu0}$ is not strong enough.`,
                `不拒绝 $H_0$：支持 $\\mu > ${mu0}$ 的证据不够强。`,
              ),
              t(`Accept $H_0$: the data prove that $\\mu = ${mu0}$.`, `接受 $H_0$：数据证明了 $\\mu = ${mu0}$。`),
            ],
            correct: reject ? 0 : 1,
            solution: t(
              `$z = \\frac{${dec(xbar)} - ${mu0}}{${dec(se.mul(Q.of(k)))}/${k}} = \\frac{${dec(zv.mul(se))}}{${dec(se)}} = ${dec(zv)}$, which is ${reject ? "at least" : "less than"} $${za}$, so ${reject ? "reject $H_0$" : "do not reject $H_0$"}. A test never proves $H_0$.`,
              `$z = \\frac{${dec(xbar)} - ${mu0}}{${dec(se.mul(Q.of(k)))}/${k}} = \\frac{${dec(zv.mul(se))}}{${dec(se)}} = ${dec(zv)}$，${reject ? "不小于" : "小于"} $${za}$，所以${reject ? "拒绝 $H_0$" : "不拒绝 $H_0$"}。检验永远不能证明 $H_0$。`,
            ),
          });
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
    prerequisites: ["critical-regions-for-right-tailed-hypothesis-tests"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-two-tailed-critical-region",
        title: t("Evaluating two-tailed test decisions", "评估双尾检验的决策"),
        explanation: t(
          "A two tailed test splits the significance level between both tails, so a statistic far enough in either direction leads to rejection. If $|z_{\\text{calc}}| \\ge z_{\\alpha/2}$, reject $H_0$; otherwise fail to reject $H_0$.",
          "双尾检验把显著性水平平分到两个尾部，所以统计量在任一方向上足够远都会拒绝原假设。若 $|z_{\\text{calc}}| \\ge z_{\\alpha/2}$，则拒绝 $H_0$；否则不拒绝 $H_0$。",
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

          return choiceProblem({
            prompt: t(
              `A two-tailed test of $H_0: \\mu = \\mu_0$ versus $H_1: \\mu \\neq \\mu_0$ is conducted at significance level $\\alpha = ${lvl.alpha}$ (critical values $\\pm z_{\\alpha/2} = \\pm ${lvl.zHalf}$). The calculated test statistic is $z = ${zCalc}$. What is the correct statistical decision?`,
              `在显著性水平 $\\alpha = ${lvl.alpha}$（临界值 $\\pm z_{\\alpha/2} = \\pm ${lvl.zHalf}$）下进行双尾检验 $H_0: \\mu = \\mu_0$ 对 $H_1: \\mu \\neq \\mu_0$。计算得到的检验统计量为 $z = ${zCalc}$。正确的统计决策是什么？`,
            ),
            options,
            correct,
            solution: t(
              `For a two-tailed test, $H_0$ is rejected if $|z| \\ge z_{\\alpha/2}$. Here $|z| = ${Math.abs(zCalc)}$ and $z_{\\alpha/2} = ${lvl.zHalf}$. Since $|z| ${isReject ? "\\ge" : "<"} ${lvl.zHalf}$, we ${isReject ? "reject" : "fail to reject"} $H_0$.`,
              `对于双尾检验，当 $|z| \\ge z_{\\alpha/2}$ 时拒绝 $H_0$。在此 $|z| = ${Math.abs(zCalc)}$ 且 $z_{\\alpha/2} = ${lvl.zHalf}$。由于 $|z| ${isReject ? "\\ge" : "<"} ${lvl.zHalf}$，我们${isReject ? "拒绝" : "不拒绝"} $H_0$。`,
            ),
          });
        },
      },
      {
        id: "the-non-rejection-region-for-the-sample-mean",
        title: t("The non-rejection region for the sample mean", "样本均值的不拒绝域"),
        explanation: t(
          "A two-tailed test at level $\\alpha$ keeps $H_0$ when the sample mean falls within $z_{\\alpha/2}$ standard errors of $\\mu_0$:\n\n$$\\mu_0 - z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}} < \\bar{x} < \\mu_0 + z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}.$$\n\nOutside these two boundaries, in either direction, $H_0$ is rejected. This region has the same width as the confidence interval: a two-tailed test rejects exactly when $\\mu_0$ lies outside the $100(1 - \\alpha)\\%$ interval.",
          "在水平 $\\alpha$ 下的双侧检验，当样本均值落在 $\\mu_0$ 的 $z_{\\alpha/2}$ 个标准误之内时保留 $H_0$：\n\n$$\\mu_0 - z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}} < \\bar{x} < \\mu_0 + z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}.$$\n\n超出这两个边界，无论哪个方向，都拒绝 $H_0$。这个区域与置信区间同宽：双侧检验恰好在 $\\mu_0$ 落在 $100(1 - \\alpha)\\%$ 区间之外时拒绝。",
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
          return numberProblem({
            prompt: t(
              `A two-tailed test of $H_0: \\mu = ${mu0}$ at $\\alpha = ${alpha}$ ($z_{\\alpha/2} = ${zh}$) uses a sample of $n = ${k * k}$ from a normal population with $\\sigma = ${dec(se.mul(Q.of(k)))}$. Find the ${upper ? "upper" : "lower"} boundary of the region of sample means for which $H_0$ is not rejected.`,
              `在 $\\alpha = ${alpha}$（$z_{\\alpha/2} = ${zh}$）下对 $H_0: \\mu = ${mu0}$ 作双侧检验，样本来自 $\\sigma = ${dec(se.mul(Q.of(k)))}$ 的正态总体，容量 $n = ${k * k}$。求不拒绝 $H_0$ 的样本均值区域的${upper ? "上" : "下"}边界。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [
              Q.of(mu0).sub(sgn.mul(z).mul(se)),
              Q.of(mu0).add(sgn.mul(Q.parse(za)).mul(se)),
              Q.of(mu0).add(sgn.mul(z).mul(se).mul(Q.of(k))),
            ],
            solution: t(
              `The standard error is $\\frac{${dec(se.mul(Q.of(k)))}}{${k}} = ${dec(se)}$, so the boundary is $${mu0} ${upper ? "+" : "-"} ${zh} \\cdot ${dec(se)} = ${dec(ans)}$.`,
              `标准误为 $\\frac{${dec(se.mul(Q.of(k)))}}{${k}} = ${dec(se)}$，所以边界为 $${mu0} ${upper ? "+" : "-"} ${zh} \\cdot ${dec(se)} = ${dec(ans)}$。`,
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
    prerequisites: ["introduction-to-hypothesis-testing"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "defining-type-i-and-ii-errors",
        title: t("Distinguishing Type I and Type II errors", "区分第一类与第二类错误"),
        explanation: t(
          "Type I error: a false positive (rejecting a true $H_0$). Type II error: a false negative (failing to reject a false $H_0$).",
          "第一类错误：假阳性（拒绝了真实的 $H_0$）。第二类错误：假阴性（未能拒绝错误的 $H_0$）。",
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

          return choiceProblem({
            prompt: t(
              `Consider a hypothesis test on a sample of size $n = ${n}$ where the null hypothesis states that ${sc.h0En}. In a particular study, ${sc.actionEn}. What type of statistical error was committed?`,
              `考虑对容量为 $n = ${n}$ 的样本进行的假设检验，其中原假设为${sc.h0Zh}。在某次具体试验中，${sc.actionZh}。此时犯了哪一类统计错误？`,
            ),
            options,
            correct,
            solution: t(
              `${sc.isTypeI ? "Type I error" : "Type II error"} occurs when ${sc.isTypeI ? "a true null hypothesis is incorrectly rejected" : "a false null hypothesis is incorrectly retained"}.`,
              `当${sc.isTypeI ? "原假设本为真却被错误拒绝" : "原假设本为假却未能被拒绝"}时，发生${sc.isTypeI ? "第一类错误" : "第二类错误"}。`,
            ),
          });
        },
      },
      {
        id: "the-probability-of-a-type-ii-error",
        title: t("The probability of a Type II error", "第二类错误的概率"),
        explanation: t(
          "$\\beta$ depends on the true mean. For a right-tailed test that rejects when $\\bar{x} \\ge c$, a Type II error happens when $\\bar{x} < c$ although the true mean is some $\\mu_1 > \\mu_0$:\n\n$$\\beta = P(\\bar{x} < c \\mid \\mu = \\mu_1) = \\Phi\\left(\\frac{c - \\mu_1}{\\sigma/\\sqrt{n}}\\right).$$\n\nStandardize the **boundary** $c$ using the **true** mean $\\mu_1$. The further $\\mu_1$ is from $\\mu_0$, or the larger $n$, the smaller $\\beta$ and the greater the power $1 - \\beta$.",
          "$\\beta$ 依赖于真实均值。对于当 $\\bar{x} \\ge c$ 时拒绝的右侧检验，若真实均值为某个 $\\mu_1 > \\mu_0$ 却出现 $\\bar{x} < c$，就犯了第二类错误：\n\n$$\\beta = P(\\bar{x} < c \\mid \\mu = \\mu_1) = \\Phi\\left(\\frac{c - \\mu_1}{\\sigma/\\sqrt{n}}\\right).$$\n\n要用**真实**均值 $\\mu_1$ 去标准化**边界** $c$。$\\mu_1$ 离 $\\mu_0$ 越远或 $n$ 越大，$\\beta$ 越小，检验功效 $1 - \\beta$ 越大。",
        ),
        generate: (rng: Rng): Problem => {
          const zv = rng.pick([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2]);
          const k = rng.int(3, 8);
          const se = rng.int(1, 5);
          const mu0 = rng.int(20, 150);
          const c = Q.of(mu0).add(Q.parse("1.645").mul(Q.of(se)));
          const mu1 = c.sub(Q.parse(String(zv)).mul(Q.of(se)));
          const beta = phi(zv);
          const wrong = [Q.one.sub(beta), phi(-zv + (zv > 0 ? -0.5 : 0.5))].filter((w) => !w.eq(beta));
          return numberProblem({
            prompt: t(
              `A test of $H_0: \\mu = ${mu0}$ against $H_1: \\mu > ${mu0}$ uses $n = ${k * k}$ observations from a normal population with $\\sigma = ${se * k}$, and rejects $H_0$ when $\\bar{x} \\ge ${dec(c)}$. If in fact $\\mu = ${dec(mu1)}$, find the probability $\\beta$ of a Type II error. Use ${PHI_TABLE.en}.`,
              `用来自 $\\sigma = ${se * k}$ 的正态总体的 $n = ${k * k}$ 个观测检验 $H_0: \\mu = ${mu0}$ 对 $H_1: \\mu > ${mu0}$，当 $\\bar{x} \\ge ${dec(c)}$ 时拒绝 $H_0$。若实际上 $\\mu = ${dec(mu1)}$，求第二类错误的概率 $\\beta$。利用${PHI_TABLE["zh-CN"]}。`,
            ),
            answer: beta,
            form: "decimal",
            wrong,
            solution: t(
              `The standard error is $\\frac{${se * k}}{${k}} = ${se}$. $\\beta = P(\\bar{x} < ${dec(c)} \\mid \\mu = ${dec(mu1)}) = \\Phi\\left(\\frac{${dec(c)} - ${dec(mu1)}}{${se}}\\right) = \\Phi(${zv}) = ${dec(beta)}$.`,
              `标准误为 $\\frac{${se * k}}{${k}} = ${se}$。$\\beta = P(\\bar{x} < ${dec(c)} \\mid \\mu = ${dec(mu1)}) = \\Phi\\left(\\frac{${dec(c)} - ${dec(mu1)}}{${se}}\\right) = \\Phi(${zv}) = ${dec(beta)}$。`,
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
    prerequisites: ["two-tailed-hypothesis-tests", "confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "one-mean-known-variance-z-statistic",
        title: t("Computing the one-sample z-test statistic", "计算单样本 z 检验统计量"),
        explanation: t(
          "The statistic counts how many standard errors the sample mean lies from the hypothesized mean, using the known population standard deviation. The test statistic is $z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$.",
          "这个统计量用已知的总体标准差，计算样本均值离假设均值有多少个标准误。检验统计量为 $z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$。",
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
              `A random sample of size $n = ${n}$ from a normal population with known standard deviation $\\sigma = ${sigma}$ yields sample mean $\\bar{x} = ${xBar}$. To test $H_0: \\mu = ${mu0}$, compute the test statistic $z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$.`,
              `从已知标准差 $\\sigma = ${sigma}$ 的正态总体中抽取容量为 $n = ${n}$ 的随机样本，得样本均值 $\\bar{x} = ${xBar}$。为检验 $H_0: \\mu = ${mu0}$，计算检验统计量 $z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}$。`,
            ),
            answer: z,
            wrong: [Q.of(d * s, sigma), d * s, d * k],
            solution: t(
              `The standard error is $\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${k}} = ${s}$. Thus $z = \\frac{${xBar} - ${mu0}}{${s}} = \\frac{${d * s}}{${s}} = ${z}$.`,
              `标准误差为 $\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${k}} = ${s}$。因此 $z = \\frac{${xBar} - ${mu0}}{${s}} = \\frac{${d * s}}{${s}} = ${z}$。`,
            ),
          });
        },
      },
      {
        id: "the-p-value-of-a-z-test",
        title: t("The $p$-value of a $z$-test", "$z$ 检验的 $p$ 值"),
        explanation: t(
          "The $p$-value is the probability, under $H_0$, of a statistic at least as extreme as the observed $z$, measured in the direction of $H_1$:\n\n- right-tailed: $p = 1 - \\Phi(z)$;\n- left-tailed: $p = \\Phi(z)$;\n- two-tailed: $p = 2\\left(1 - \\Phi(|z|)\\right)$.\n\nReject $H_0$ when $p \\le \\alpha$. A two-tailed $p$-value is twice the one-tailed one, because results as extreme in the other direction count too.",
          "$p$ 值是在 $H_0$ 下，沿 $H_1$ 的方向出现至少与观测值 $z$ 一样极端的统计量的概率：\n\n- 右侧：$p = 1 - \\Phi(z)$；\n- 左侧：$p = \\Phi(z)$；\n- 双侧：$p = 2\\left(1 - \\Phi(|z|)\\right)$。\n\n当 $p \\le \\alpha$ 时拒绝 $H_0$。双侧 $p$ 值是单侧的两倍，因为另一方向同样极端的结果也要计入。",
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
          const wrong = [right, left, two, Q.one.sub(phi(Math.abs(zv)))].filter((w) => !w.eq(ans));
          const op = [">", "<", "\\neq"][kind];
          return numberProblem({
            prompt: t(
              `A sample of $n = ${k * k}$ from a normal population with $\\sigma = ${se * k}$ has $\\bar{x} = ${dec(xbar)}$. Find the $p$-value for testing $H_0: \\mu = ${mu0}$ against $H_1: \\mu ${op} ${mu0}$. Use ${PHI_TABLE.en}.`,
              `来自 $\\sigma = ${se * k}$ 的正态总体、容量 $n = ${k * k}$ 的样本有 $\\bar{x} = ${dec(xbar)}$。求检验 $H_0: \\mu = ${mu0}$ 对 $H_1: \\mu ${op} ${mu0}$ 的 $p$ 值。利用${PHI_TABLE["zh-CN"]}。`,
            ),
            answer: ans,
            form: "decimal",
            wrong,
            solution: t(
              `$z = \\frac{${dec(xbar)} - ${mu0}}{${se * k}/${k}} = ${zv}$. ${["For a right-tailed test, $p = 1 - \\Phi(z)$", "For a left-tailed test, $p = \\Phi(z)$", "For a two-tailed test, $p = 2(1 - \\Phi(|z|))$"][kind]} $= ${dec(ans)}$.`,
              `$z = \\frac{${dec(xbar)} - ${mu0}}{${se * k}/${k}} = ${zv}$。${["右侧检验 $p = 1 - \\Phi(z)$", "左侧检验 $p = \\Phi(z)$", "双侧检验 $p = 2(1 - \\Phi(|z|))$"][kind]} $= ${dec(ans)}$。`,
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
          "When the population standard deviation is unknown, the sample standard deviation replaces it, and the statistic follows a t distribution instead. The test statistic is $t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}$ with $df = n - 1$.",
          "当总体标准差未知时，用样本标准差代替它，统计量改为服从 t 分布。检验统计量为 $t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}$，自由度 $df = n - 1$。",
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
              `A random sample of size $n = ${n}$ drawn from a normal population produces a sample mean $\\bar{x} = ${xBar}$ and sample standard deviation $s = ${s}$. To test $H_0: \\mu = ${mu0}$, compute the value of the test statistic $t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}$.`,
              `从正态总体中抽取容量为 $n = ${n}$ 的随机样本，得样本均值 $\\bar{x} = ${xBar}$ 及样本标准差 $s = ${s}$。为检验 $H_0: \\mu = ${mu0}$，计算检验统计量 $t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}$ 的值。`,
            ),
            answer: tVal,
            wrong: [Q.of(d * mult, s), d * mult, d * k],
            solution: t(
              `The estimated standard error is $\\frac{s}{\\sqrt{n}} = \\frac{${s}}{\\sqrt{${n}}} = \\frac{${s}}{${k}} = ${mult}$. Thus $t = \\frac{${xBar} - ${mu0}}{${mult}} = \\frac{${d * mult}}{${mult}} = ${tVal}$ (with $\\nu = ${n} - 1 = ${n - 1}$ degrees of freedom).`,
              `估计标准误差为 $\\frac{s}{\\sqrt{n}} = \\frac{${s}}{\\sqrt{${n}}} = \\frac{${s}}{${k}} = ${mult}$。因此 $t = \\frac{${xBar} - ${mu0}}{${mult}} = \\frac{${d * mult}}{${mult}} = ${tVal}$（自由度 $\\nu = ${n} - 1 = ${n - 1}$）。`,
            ),
          });
        },
      },
      {
        id: "deciding-a-t-test",
        title: t("Deciding a $t$-test", "$t$ 检验的决策"),
        explanation: t(
          "Compute $t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}$ and compare it with the critical value of the $t$-distribution with $n - 1$ degrees of freedom: $t \\ge t_{\\alpha, n-1}$ for a right-tailed test, $|t| \\ge t_{\\alpha/2, n-1}$ for a two-tailed one.\n\nThe $t$ critical values are larger than the $z$ values, so a statistic that would be significant against $1.96$ may fall short against $t_{0.025, 8} = 2.306$. Using the $z$ table for a small sample rejects too often.",
          "计算 $t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}$，并与自由度为 $n - 1$ 的 $t$ 分布临界值比较：右侧检验要求 $t \\ge t_{\\alpha, n-1}$，双侧检验要求 $|t| \\ge t_{\\alpha/2, n-1}$。\n\n$t$ 临界值比 $z$ 值大，所以一个对 $1.96$ 显著的统计量，对 $t_{0.025, 8} = 2.306$ 可能并不显著。小样本用 $z$ 表会过多地拒绝。",
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
          return choiceProblem({
            prompt: t(
              `A sample of $n = ${n}$ from a normal population has $\\bar{x} = ${dec(xbar)}$ and $s = ${dec(se.mul(Q.of(k)))}$. Test $H_0: \\mu = ${mu0}$ against $H_1: \\mu ${two ? "\\neq" : ">"} ${mu0}$ at $\\alpha = 0.05$, using $${tName} = ${crit}$. What is the conclusion?`,
              `来自正态总体、容量 $n = ${n}$ 的样本有 $\\bar{x} = ${dec(xbar)}$，$s = ${dec(se.mul(Q.of(k)))}$。在 $\\alpha = 0.05$ 下检验 $H_0: \\mu = ${mu0}$ 对 $H_1: \\mu ${two ? "\\neq" : ">"} ${mu0}$，取 $${tName} = ${crit}$。结论是什么？`,
            ),
            options: [t("Reject $H_0$", "拒绝 $H_0$"), t("Do not reject $H_0$", "不拒绝 $H_0$")],
            correct: reject ? 0 : 1,
            solution: t(
              `$t = \\frac{${dec(xbar)} - ${mu0}}{${dec(se.mul(Q.of(k)))}/${k}} = ${dec(tv)}$. ${two ? `$|t| = ${dec(tv.abs())}$` : `$t = ${dec(tv)}$`} is ${reject ? "at least" : "less than"} $${crit}$, so ${reject ? "reject" : "do not reject"} $H_0$.`,
              `$t = \\frac{${dec(xbar)} - ${mu0}}{${dec(se.mul(Q.of(k)))}/${k}} = ${dec(tv)}$。${two ? `$|t| = ${dec(tv.abs())}$` : `$t = ${dec(tv)}$`}${reject ? "不小于" : "小于"} $${crit}$，所以${reject ? "拒绝" : "不拒绝"} $H_0$。`,
            ),
          });
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
    prerequisites: ["confidence-intervals-for-one-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "one-variance-chi-square-statistic",
        title: t("Computing the chi-square statistic for one variance", "计算单方差的卡方检验统计量"),
        explanation: t(
          "Scaling the sample variance by its degrees of freedom and dividing by the hypothesized variance gives a statistic with a chi square distribution. The test statistic is $\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2}$.",
          "把样本方差乘以自由度再除以假设的方差，得到一个服从卡方分布的统计量。检验统计量为 $\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(10, 50);
          const df = n - 1;
          const sigma0Sq = rng.int(10, 80);
          const sSq = rng.int(10, 80);
          const num = df * sSq;
          const den = sigma0Sq;

          return numberProblem({
            prompt: t(
              `A random sample of size $n = ${n}$ from a normal distribution has sample variance $s^2 = ${sSq}$. Test $H_0: \\sigma^2 = ${sigma0Sq}$. Find the exact rational value of the test statistic $\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2}$.`,
              `从正态分布中抽取容量为 $n = ${n}$ 的随机样本，测得样本方差 $s^2 = ${sSq}$。检验 $H_0: \\sigma^2 = ${sigma0Sq}$。求检验统计量 $\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2}$ 的精确有理数值。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(n * sSq, sigma0Sq), Q.of(sSq, sigma0Sq), Q.of(df * sigma0Sq, sSq)],
            solution: t(
              `$\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2} = \\frac{(${n} - 1)(${sSq})}{${sigma0Sq}} = \\frac{${df} \\times ${sSq}}{${sigma0Sq}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2} = \\frac{(${n} - 1)(${sSq})}{${sigma0Sq}} = \\frac{${df} \\times ${sSq}}{${sigma0Sq}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "deciding-a-chi-square-test-for-a-variance",
        title: t("Deciding a chi-square test for a variance", "方差卡方检验的决策"),
        explanation: t(
          "For a two-tailed test of $H_0: \\sigma^{2} = \\sigma_0^{2}$ at level $\\alpha$, the chi-square distribution is not symmetric, so there are two different critical values: reject when\n\n$$\\chi^{2} \\le \\chi^{2}_{1 - \\alpha/2, n-1} \\quad\\text{or}\\quad \\chi^{2} \\ge \\chi^{2}_{\\alpha/2, n-1}.$$\n\nA statistic below the lower value says the variance is smaller than claimed; one above the upper value says it is larger. Under $H_0$ the statistic averages $n - 1$.",
          "对于水平 $\\alpha$ 下 $H_0: \\sigma^{2} = \\sigma_0^{2}$ 的双侧检验，卡方分布不对称，所以有两个不同的临界值：当\n\n$$\\chi^{2} \\le \\chi^{2}_{1 - \\alpha/2, n-1} \\quad\\text{或}\\quad \\chi^{2} \\ge \\chi^{2}_{\\alpha/2, n-1}$$\n\n时拒绝。统计量低于下临界值说明方差比所称的小；高于上临界值说明方差比所称的大。在 $H_0$ 下统计量的均值为 $n - 1$。",
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
          return choiceProblem({
            prompt: t(
              `A sample of $n = ${n}$ from a normal population has $s^{2} = ${s2}$. Test $H_0: \\sigma^{2} = ${sigma0 * sigma0}$ against $H_1: \\sigma^{2} \\neq ${sigma0 * sigma0}$ at $\\alpha = 0.05$, with $\\chi^{2}_{0.975, ${n - 1}} = ${lo}$ and $\\chi^{2}_{0.025, ${n - 1}} = ${hi}$. What is the conclusion?`,
              `来自正态总体、容量 $n = ${n}$ 的样本有 $s^{2} = ${s2}$。在 $\\alpha = 0.05$ 下检验 $H_0: \\sigma^{2} = ${sigma0 * sigma0}$ 对 $H_1: \\sigma^{2} \\neq ${sigma0 * sigma0}$，已知 $\\chi^{2}_{0.975, ${n - 1}} = ${lo}$，$\\chi^{2}_{0.025, ${n - 1}} = ${hi}$。结论是什么？`,
            ),
            options: [
              t("Reject $H_0$: the variance appears smaller than claimed", "拒绝 $H_0$：方差看来比所称的小"),
              t("Reject $H_0$: the variance appears larger than claimed", "拒绝 $H_0$：方差看来比所称的大"),
              t("Do not reject $H_0$", "不拒绝 $H_0$"),
            ],
            correct: which,
            solution: t(
              `$\\chi^{2} = \\frac{${n - 1} \\cdot ${s2}}{${sigma0 * sigma0}} \\approx ${chi.toNumber().toFixed(3)}$, which is ${["below the lower critical value", "above the upper critical value", "between the two critical values"][which]}, so ${which === 2 ? "do not reject $H_0$" : "reject $H_0$"}.`,
              `$\\chi^{2} = \\frac{${n - 1} \\cdot ${s2}}{${sigma0 * sigma0}} \\approx ${chi.toNumber().toFixed(3)}$，${["低于下临界值", "高于上临界值", "介于两个临界值之间"][which]}，所以${which === 2 ? "不拒绝 $H_0$" : "拒绝 $H_0$"}。`,
            ),
          });
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
          "Compare the observed difference of means with the hypothesized difference, measured in standard errors of the difference. $z = \\frac{(\\bar{x}_1 - \\bar{x}_2) - \\Delta_0}{SE}$, where $SE = \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$.",
          "把观测到的均值之差与假设的差进行比较，用差的标准误来度量。$z = \\frac{(\\bar{x}_1 - \\bar{x}_2) - \\Delta_0}{SE}$，其中 $SE = \\sqrt{\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2}}$。",
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
              `Independent samples from two normal populations have sample means $\\bar{x}_1 = ${xBar1}$ ($n_1 = ${n1}$, $\\sigma_1^2 = ${sig1Sq}$) and $\\bar{x}_2 = ${xBar2}$ ($n_2 = ${n2}$, $\\sigma_2^2 = ${sig2Sq}$). To test $H_0: \\mu_1 - \\mu_2 = 0$, compute the test statistic $z = \\frac{\\bar{x} - \\bar{x}_2}{\\sqrt{\\sigma_1^2/n_1 + \\sigma_2^2/n_2}}$.`,
              `从两个正态总体抽取的独立样本均值分别为 $\\bar{x}_1 = ${xBar1}$（$n_1 = ${n1}$，$\\sigma_1^2 = ${sig1Sq}$）和 $\\bar{x}_2 = ${xBar2}$（$n_2 = ${n2}$，$\\sigma_2^2 = ${sig2Sq}$）。为检验 $H_0: \\mu_1 - \\mu_2 = 0$，计算检验统计量 $z = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\sigma_1^2/n_1 + \\sigma_2^2/n_2}}$。`,
            ),
            answer: d,
            wrong: [diff, -d, Q.of(diff, choice.se * choice.se)],
            solution: t(
              `$\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2} = \\frac{${sig1Sq}}{${n1}} + \\frac{${sig2Sq}}{${n2}} = ${choice.v1} + ${choice.v2} = ${choice.se * choice.se}$, so $\\text{SE} = ${choice.se}$. The test statistic is $z = \\frac{${xBar1} - ${xBar2}}{${choice.se}} = \\frac{${diff}}{${choice.se}} = ${d}$.`,
              `$\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2} = \\frac{${sig1Sq}}{${n1}} + \\frac{${sig2Sq}}{${n2}} = ${choice.v1} + ${choice.v2} = ${choice.se * choice.se}$，故 $\\text{SE} = ${choice.se}$。检验统计量为 $z = \\frac{${xBar1} - ${xBar2}}{${choice.se}} = \\frac{${diff}}{${choice.se}} = ${d}$。`,
            ),
          });
        },
      },
      {
        id: "the-p-value-of-a-two-sample-z-test",
        title: t("The $p$-value of a two-sample $z$-test", "两样本 $z$ 检验的 $p$ 值"),
        explanation: t(
          "After computing $z = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\sigma_1^{2}/n_1 + \\sigma_2^{2}/n_2}}$, find the $p$-value in the direction of $H_1$. For $H_1: \\mu_1 \\neq \\mu_2$ it is $2(1 - \\Phi(|z|))$; for $H_1: \\mu_1 > \\mu_2$ it is $1 - \\Phi(z)$.\n\nThe order of subtraction matters for a one-sided test: a large negative $z$ against $H_1: \\mu_1 > \\mu_2$ gives a $p$-value near $1$, not near $0$.",
          "算出 $z = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\sigma_1^{2}/n_1 + \\sigma_2^{2}/n_2}}$ 后，沿 $H_1$ 的方向求 $p$ 值。$H_1: \\mu_1 \\neq \\mu_2$ 时为 $2(1 - \\Phi(|z|))$；$H_1: \\mu_1 > \\mu_2$ 时为 $1 - \\Phi(z)$。\n\n单侧检验中相减的顺序很重要：对 $H_1: \\mu_1 > \\mu_2$，绝对值很大的负 $z$ 给出接近 $1$ 而不是接近 $0$ 的 $p$ 值。",
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
          const wrong = [
            two ? Q.one.sub(phi(Math.abs(zv))) : Q.of(2).mul(Q.one.sub(phi(Math.abs(zv)))),
            phi(zv),
            Q.one.sub(phi(-zv)),
          ].filter((w) => !w.eq(ans));
          return numberProblem({
            prompt: t(
              `Independent samples of size $n_1 = n_2 = ${n}$ come from normal populations with $\\sigma_1 = ${a * r}$ and $\\sigma_2 = ${b * r}$; the sample means are $\\bar{x}_1 = ${dec(x1)}$ and $\\bar{x}_2 = ${x2}$. Find the $p$-value for $H_0: \\mu_1 = \\mu_2$ against $H_1: \\mu_1 ${two ? "\\neq" : ">"} \\mu_2$. Use ${PHI_TABLE.en}.`,
              `从 $\\sigma_1 = ${a * r}$ 和 $\\sigma_2 = ${b * r}$ 的两个正态总体中各抽取容量 $n_1 = n_2 = ${n}$ 的独立样本，样本均值为 $\\bar{x}_1 = ${dec(x1)}$，$\\bar{x}_2 = ${x2}$。求 $H_0: \\mu_1 = \\mu_2$ 对 $H_1: \\mu_1 ${two ? "\\neq" : ">"} \\mu_2$ 的 $p$ 值。利用${PHI_TABLE["zh-CN"]}。`,
            ),
            answer: ans,
            form: "decimal",
            wrong,
            solution: t(
              `The standard error is $\\sqrt{${a * a} + ${b * b}} = ${c}$, so $z = \\frac{${dec(x1)} - ${x2}}{${c}} = ${zv}$ and $p = ${two ? `2(1 - \\Phi(${Math.abs(zv)}))` : `1 - \\Phi(${zv})`} = ${dec(ans)}$.`,
              `标准误为 $\\sqrt{${a * a} + ${b * b}} = ${c}$，所以 $z = \\frac{${dec(x1)} - ${x2}}{${c}} = ${zv}$，$p = ${two ? `2(1 - \\Phi(${Math.abs(zv)}))` : `1 - \\Phi(${zv})`} = ${dec(ans)}$。`,
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
          "The pooled variance is a weighted average of the two sample variances, giving more weight to the larger sample. The pooled variance is $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$.",
          "合并方差是两个样本方差的加权平均，较大的样本权重更大。合并方差为 $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$。",
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
              `Two independent samples have sizes $n_1 = ${n1}$ (variance $s_1^2 = ${s1Sq}$) and $n_2 = ${n2}$ (variance $s_2^2 = ${s2Sq}$). Under the equal variances assumption, find the exact rational value of the pooled sample variance $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$.`,
              `两个独立样本的容量分别为 $n_1 = ${n1}$（方差 $s_1^2 = ${s1Sq}$）和 $n_2 = ${n2}$（方差 $s_2^2 = ${s2Sq}$）。在方差齐性假定下，求合并样本方差 $s_p^2 = \\frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$ 的精确有理数值。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(s1Sq + s2Sq, 2), Q.of(n1 * s1Sq + n2 * s2Sq, n1 + n2), Q.of(num, den + 2)],
            solution: t(
              `$s_p^2 = \\frac{(${df1})(${s1Sq}) + (${df2})(${s2Sq})}{${df1} + ${df2}} = \\frac{${df1 * s1Sq} + ${df2 * s2Sq}}{${den}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$s_p^2 = \\frac{(${df1})(${s1Sq}) + (${df2})(${s2Sq})}{${df1} + ${df2}} = \\frac{${df1 * s1Sq} + ${df2 * s2Sq}}{${den}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "the-pooled-t-statistic",
        title: t("The pooled $t$ statistic", "合并 $t$ 统计量"),
        explanation: t(
          "With the pooled standard deviation $s_p$ in hand, the statistic for $H_0: \\mu_1 = \\mu_2$ is\n\n$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}},$$\n\nwith $n_1 + n_2 - 2$ degrees of freedom. The factor $\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}$ turns the spread of single observations into the spread of the difference of two means. For $n_1 = 5$ and $n_2 = 20$ it is $\\sqrt{0.25} = 0.5$.",
          "有了合并标准差 $s_p$，检验 $H_0: \\mu_1 = \\mu_2$ 的统计量为\n\n$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}},$$\n\n自由度为 $n_1 + n_2 - 2$。因子 $\\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}$ 把单个观测的离散程度换算成两个均值之差的离散程度。$n_1 = 5$，$n_2 = 20$ 时它等于 $\\sqrt{0.25} = 0.5$。",
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
            wrong: [Q.of(d, sp), Q.of(d * m * m, sp), Q.of(d * m, sp * sp), ans.neg()],
            solution: t(
              `$\\sqrt{\\frac{1}{${n1}} + \\frac{1}{${n2}}} = \\frac{1}{${m}}$, so $t = \\frac{${x1} - ${x2}}{${sp} \\cdot \\frac{1}{${m}}} = \\frac{${d * m}}{${sp}}${lowestTerms(d * m, sp)}$.`,
              `$\\sqrt{\\frac{1}{${n1}} + \\frac{1}{${n2}}} = \\frac{1}{${m}}$，所以 $t = \\frac{${x1} - ${x2}}{${sp} \\cdot \\frac{1}{${m}}} = \\frac{${d * m}}{${sp}}${lowestTerms(d * m, sp)}$。`,
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
    prerequisites: ["confidence-intervals-for-differences-between-two-means-unknown-unequal-population-variances"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "welch-test-standard-error",
        title: t("Computing standard error for Welch's t-test", "计算韦尔奇 t 检验的标准误差平方"),
        explanation: t(
          "Welch's test does not assume equal variances, so each sample contributes its own estimated variance of the mean. Welch's squared standard error is $SE^2 = \\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}$.",
          "韦尔奇检验不假设方差相等，所以每个样本都贡献各自的均值估计方差。韦尔奇标准误差的平方为 $SE^2 = \\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(8, 40);
          const n2 = rng.int(8, 40);
          const s1Sq = rng.int(10, 80);
          const s2Sq = rng.int(10, 80);
          const ans = Q.of(s1Sq, n1).add(Q.of(s2Sq, n2));

          return numberProblem({
            prompt: t(
              `In a Welch's $t$-test comparing two independent populations, sample 1 has $n_1 = ${n1}$, $s_1^2 = ${s1Sq}$, and sample 2 has $n_2 = ${n2}$, $s_2^2 = ${s2Sq}$. Compute the exact rational value of the squared standard error $\\text{SE}^2 = \\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}$.`,
              `在比较两个独立总体的韦尔奇 $t$ 检验中，样本 1 具有 $n_1 = ${n1}$、$s_1^2 = ${s1Sq}$，样本 2 具有 $n_2 = ${n2}$、$s_2^2 = ${s2Sq}$。计算标准误差平方 $\\text{SE}^2 = \\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}$ 的精确有理数值。`,
            ),
            answer: ans,
            wrong: [Q.of(s1Sq + s2Sq, n1 + n2), Q.of(s1Sq * n1 + s2Sq * n2, n1 * n2), Q.of(s1Sq, n1).sub(Q.of(s2Sq, n2))],
            solution: t(
              `$\\text{SE}^2 = \\frac{${s1Sq}}{${n1}} + \\frac{${s2Sq}}{${n2}} = ${ans.toLatex()}$.`,
              `$\\text{SE}^2 = \\frac{${s1Sq}}{${n1}} + \\frac{${s2Sq}}{${n2}} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
      {
        id: "the-welch-t-statistic",
        title: t("The Welch $t$ statistic", "韦尔奇 $t$ 统计量"),
        explanation: t(
          "Welch's statistic keeps the two sample variances separate:\n\n$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^{2}}{n_1} + \\frac{s_2^{2}}{n_2}}}.$$\n\nDivide each variance by its **own** sample size before adding, then take the square root of the sum, not the sum of square roots. The statistic is compared with a $t$-distribution whose degrees of freedom come from the Welch–Satterthwaite formula.",
          "韦尔奇统计量把两个样本方差分开处理：\n\n$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^{2}}{n_1} + \\frac{s_2^{2}}{n_2}}}.$$\n\n每个方差先除以**各自的**样本量再相加，然后对和开平方，而不是把平方根相加。统计量与自由度由韦尔奇–萨特思韦特公式给出的 $t$ 分布比较。",
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
            wrong: [Q.of(d, a + b), ans.neg(), Q.of(d * (n1 + n2), a * n1 + b * n2)].filter((w) => !w.eq(ans)),
            solution: t(
              `$\\frac{s_1^{2}}{n_1} + \\frac{s_2^{2}}{n_2} = \\frac{${a * n1}}{${n1}} + \\frac{${b * n2}}{${n2}} = ${a} + ${b} = ${a + b}$, so $t = \\frac{${x1} - ${x2}}{\\sqrt{${a + b}}} = ${ans.toLatex()}$.`,
              `$\\frac{s_1^{2}}{n_1} + \\frac{s_2^{2}}{n_2} = \\frac{${a * n1}}{${n1}} + \\frac{${b * n2}}{${n2}} = ${a} + ${b} = ${a + b}$，所以 $t = \\frac{${x1} - ${x2}}{\\sqrt{${a + b}}} = ${ans.toLatex()}$。`,
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
    prerequisites: ["confidence-intervals-for-differences-between-two-proportions"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "pooled-sample-proportion-calculation",
        title: t("Computing the pooled sample proportion", "计算合并样本比例"),
        explanation: t(
          "Under the null hypothesis the two proportions are equal, so the best estimate of the common value combines the successes and the sample sizes. The pooled sample proportion is $\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2}$.",
          "在原假设下两个比例相等，所以公共值的最佳估计是把成功数和样本量分别合并。合并样本比例为 $\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2}$。",
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
              `Sample 1 has $x_1 = ${x1}$ successes out of $n_1 = ${n1}$, and sample 2 has $x_2 = ${x2}$ successes out of $n_2 = ${n2}$. When testing $H_0: p_1 = p_2$, find the exact rational value of the pooled sample proportion $\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2}$.`,
              `样本 1 在 $n_1 = ${n1}$ 次试验中有 $x_1 = ${x1}$ 次成功，样本 2 在 $n_2 = ${n2}$ 次试验中有 $x_2 = ${x2}$ 次成功。检验 $H_0: p_1 = p_2$ 时，求合并样本比例 $\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2}$ 的精确有理数值。`,
            ),
            answer: Q.of(num, den),
            wrong: [Q.of(x1, n1).add(Q.of(x2, n2)), Q.of(x1 * n2 + x2 * n1, 2 * n1 * n2), Q.of(num, n1 * n2)],
            solution: t(
              `$\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2} = \\frac{${x1} + ${x2}}{${n1} + ${n2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2} = \\frac{${x1} + ${x2}}{${n1} + ${n2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "the-two-proportion-z-statistic",
        title: t("The two-proportion $z$ statistic", "两比例 $z$ 统计量"),
        explanation: t(
          "Under $H_0: p_1 = p_2$ both samples share one proportion, so the standard error uses the **pooled** $\\hat{p}$:\n\n$$z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\hat{p}(1 - \\hat{p})\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}}.$$\n\nThis differs from the confidence interval, which uses the separate proportions; the test assumes $H_0$ while computing the statistic. With $40/200$ against $60/200$: $\\hat{p} = 0.25$, $\\text{SE} = \\sqrt{0.1875 \\cdot 0.01} \\approx 0.0433$, $z \\approx -2.31$.",
          "在 $H_0: p_1 = p_2$ 下两个样本共用一个比例，所以标准误使用**合并**的 $\\hat{p}$：\n\n$$z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\hat{p}(1 - \\hat{p})\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}}.$$\n\n这与使用各自比例的置信区间不同：检验在计算统计量时假定 $H_0$ 成立。例如 $40/200$ 对 $60/200$：$\\hat{p} = 0.25$，$\\text{SE} = \\sqrt{0.1875 \\cdot 0.01} \\approx 0.0433$，$z \\approx -2.31$。",
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
          const wrong = [round2((p1 - p2) / unpooled), round2((p1 - p2) / (p * (1 - p) * (1 / n1 + 1 / n2))), ans.neg()].filter(
            (w) => !w.eq(ans),
          );
          return numberProblem({
            prompt: t(
              `In sample 1, $${x1}$ of $${n1}$ are successes; in sample 2, $${x2}$ of $${n2}$. Find the $z$ statistic for $H_0: p_1 = p_2$ using the pooled proportion. Round to two decimal places.`,
              `样本 1 的 $${n1}$ 次中有 $${x1}$ 次成功；样本 2 的 $${n2}$ 次中有 $${x2}$ 次成功。用合并比例求检验 $H_0: p_1 = p_2$ 的 $z$ 统计量，精确到两位小数。`,
            ),
            answer: ans,
            form: "decimal",
            wrong,
            solution: t(
              `$\\hat{p}_1 \\approx ${p1.toFixed(4)}$, $\\hat{p}_2 \\approx ${p2.toFixed(4)}$, $\\hat{p} = \\frac{${x1 + x2}}{${n1 + n2}} \\approx ${p.toFixed(4)}$. $\\text{SE} = \\sqrt{\\hat{p}(1 - \\hat{p})\\left(\\frac{1}{${n1}} + \\frac{1}{${n2}}\\right)} \\approx ${pooled.toFixed(4)}$, so $z \\approx \\frac{${(p1 - p2).toFixed(4)}}{${pooled.toFixed(4)}} \\approx ${dec(ans)}$.`,
              `$\\hat{p}_1 \\approx ${p1.toFixed(4)}$，$\\hat{p}_2 \\approx ${p2.toFixed(4)}$，$\\hat{p} = \\frac{${x1 + x2}}{${n1 + n2}} \\approx ${p.toFixed(4)}$。$\\text{SE} = \\sqrt{\\hat{p}(1 - \\hat{p})\\left(\\frac{1}{${n1}} + \\frac{1}{${n2}}\\right)} \\approx ${pooled.toFixed(4)}$，所以 $z \\approx \\frac{${(p1 - p2).toFixed(4)}}{${pooled.toFixed(4)}} \\approx ${dec(ans)}$。`,
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
    prerequisites: ["confidence-intervals-for-paired-samples-known-variances", "hypothesis-tests-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "paired-z-test-statistic-calculation",
        title: t("Computing the paired z-test statistic", "计算配对 z 检验统计量"),
        explanation: t(
          "With paired data the test works on the differences alone, standardizing their mean with the known standard deviation of the differences. The test statistic is $z = \\frac{\\bar{d} - \\Delta_0}{\\sigma_d / \\sqrt{n}}$.",
          "对于配对数据，检验只针对差值进行，用差值的已知标准差对其均值标准化。检验统计量为 $z = \\frac{\\bar{d} - \\Delta_0}{\\sigma_d / \\sqrt{n}}$。",
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
              `A paired sample of $n = ${n}$ differences has mean $\\bar{d} = ${dBar}$. The population standard deviation of differences is known to be $\\sigma_d = ${sigmaD}$. Test $H_0: \\mu_d = 0$. Calculate the test statistic $z = \\frac{\\bar{d}}{\\sigma_d / \\sqrt{n}}$.`,
              `容量为 $n = ${n}$ 的配对差值样本均值为 $\\bar{d} = ${dBar}$。已知差值总体的标准差为 $\\sigma_d = ${sigmaD}$。检验 $H_0: \\mu_d = 0$。计算检验统计量 $z = \\frac{\\bar{d}}{\\sigma_d / \\sqrt{n}}$。`,
            ),
            answer: d,
            wrong: [Q.of(dBar, sigmaD), dBar, d * k],
            solution: t(
              `The standard error is $\\frac{\\sigma_d}{\\sqrt{n}} = \\frac{${sigmaD}}{\\sqrt{${n}}} = \\frac{${sigmaD}}{${k}} = ${s}$. The test statistic is $z = \\frac{${dBar}}{${s}} = ${d}$.`,
              `标准误差为 $\\frac{\\sigma_d}{\\sqrt{n}} = \\frac{${sigmaD}}{\\sqrt{${n}}} = \\frac{${sigmaD}}{${k}} = ${s}$。检验统计量为 $z = \\frac{${dBar}}{${s}} = ${d}$。`,
            ),
          });
        },
      },
      {
        id: "the-paired-z-statistic-from-raw-pairs",
        title: t("The paired $z$ statistic from raw pairs", "由原始配对数据求配对 $z$ 统计量"),
        explanation: t(
          "Starting from the pairs, subtract within each pair in the order the hypothesis names, average the differences to get $\\bar{d}$, and divide by the standard error of the mean difference:\n\n$$z = \\frac{\\bar{d}}{\\sigma_d/\\sqrt{n}}.$$\n\nHere $n$ is the number of pairs and $\\sigma_d$ the known standard deviation of the differences, not of either measurement.",
          "从配对数据出发，按假设指定的顺序在每对内相减，求差值的均值 $\\bar{d}$，再除以均值差的标准误：\n\n$$z = \\frac{\\bar{d}}{\\sigma_d/\\sqrt{n}}.$$\n\n这里 $n$ 是配对数，$\\sigma_d$ 是差值（而不是某一次测量）的已知标准差。",
        ),
        generate: (rng: Rng): Problem => {
          const after = [0, 1, 2, 3].map(() => rng.int(40, 90));
          const ds = after.map(() => rng.int(-4, 9));
          const before = after.map((y, i) => y + (ds[i] ?? 0));
          const sum = ds.reduce((s, x) => s + x, 0);
          const sigma = rng.int(2, 9);
          const dbar = Q.of(sum, 4);
          const ans = dbar.mul(Q.of(2, sigma));
          const wrong = [dbar.div(Q.of(sigma)), dbar.mul(Q.of(4, sigma)), ans.neg()].filter((w) => !w.eq(ans));
          return numberProblem({
            prompt: t(
              `Four subjects are measured before and after training: ${before.map((x, i) => `$(${x}, ${after[i]})$`).join(", ")}. The differences (before minus after) have known standard deviation $\\sigma_d = ${sigma}$. Find the $z$ statistic for $H_0: \\mu_d = 0$.`,
              `四名受试者在训练前后各测一次：${before.map((x, i) => `$(${x}, ${after[i]})$`).join("，")}。差值（训练前减训练后）的标准差已知为 $\\sigma_d = ${sigma}$。求检验 $H_0: \\mu_d = 0$ 的 $z$ 统计量。`,
            ),
            answer: ans,
            wrong,
            solution: t(
              `The differences are $${ds.join(", ")}$, so $\\bar{d} = \\frac{${sum}}{4}${lowestTerms(sum, 4)}$ and $z = \\frac{${dbar.toLatex()}}{${sigma}/\\sqrt{4}} = ${ans.toLatex()}$.`,
              `差值为 $${ds.join(", ")}$，所以 $\\bar{d} = \\frac{${sum}}{4}${lowestTerms(sum, 4)}$，$z = \\frac{${dbar.toLatex()}}{${sigma}/\\sqrt{4}} = ${ans.toLatex()}$。`,
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
    prerequisites: ["hypothesis-tests-for-two-means-paired-sample-z-test", "hypothesis-tests-for-one-mean-unknown-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "paired-t-test-statistic-calculation",
        title: t("Computing the paired t-test statistic", "计算配对 t 检验统计量"),
        explanation: t(
          "When the standard deviation of the differences is estimated from the data, the statistic follows a t distribution with one less than the number of pairs. $t = \\frac{\\bar{d} - \\Delta_0}{s_d / \\sqrt{n}}$ with $df = n - 1$.",
          "当差值的标准差由数据估计时，统计量服从自由度为对数减 1 的 t 分布。$t = \\frac{\\bar{d} - \\Delta_0}{s_d / \\sqrt{n}}$，自由度 $df = n - 1$。",
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
              `A paired sample of $n = ${n}$ differences has sample mean $\\bar{d} = ${dBar}$ and sample standard deviation $s_d = ${sD}$. Test $H_0: \\mu_d = 0$. Calculate the test statistic $t = \\frac{\\bar{d}}{s_d / \\sqrt{n}}$.`,
              `容量为 $n = ${n}$ 的配对差值样本均值为 $\\bar{d} = ${dBar}$，样本标准差为 $s_d = ${sD}$。检验 $H_0: \\mu_d = 0$。计算检验统计量 $t = \\frac{\\bar{d}}{s_d / \\sqrt{n}}$。`,
            ),
            answer: d,
            wrong: [Q.of(dBar, sD), dBar, d * k],
            solution: t(
              `The estimated standard error is $\\frac{s_d}{\\sqrt{n}} = \\frac{${sD}}{\\sqrt{${n}}} = \\frac{${sD}}{${k}} = ${s}$. The test statistic is $t = \\frac{${dBar}}{${s}} = ${d}$ (with $\\nu = ${n - 1}$ degrees of freedom).`,
              `估计标准误差为 $\\frac{s_d}{\\sqrt{n}} = \\frac{${sD}}{\\sqrt{${n}}} = \\frac{${sD}}{${k}} = ${s}$。检验统计量为 $t = \\frac{${dBar}}{${s}} = ${d}$（自由度 $\\nu = ${n - 1}$）。`,
            ),
          });
        },
      },
      {
        id: "the-paired-t-statistic-from-raw-pairs",
        title: t("The paired $t$ statistic from raw pairs", "由原始配对数据求配对 $t$ 统计量"),
        explanation: t(
          "With $\\sigma_d$ unknown, the differences supply both the mean and the spread. Compute $d_i$, then $\\bar{d}$, then\n\n$$s_d = \\sqrt{\\frac{\\sum (d_i - \\bar{d})^{2}}{n - 1}}, \\qquad t = \\frac{\\bar{d}}{s_d/\\sqrt{n}},$$\n\nwith $n - 1$ degrees of freedom. Treating the two columns as independent samples instead would ignore the pairing and usually inflate the standard error.",
          "当 $\\sigma_d$ 未知时，差值同时给出均值和离散程度。先算 $d_i$，再算 $\\bar{d}$，然后\n\n$$s_d = \\sqrt{\\frac{\\sum (d_i - \\bar{d})^{2}}{n - 1}}, \\qquad t = \\frac{\\bar{d}}{s_d/\\sqrt{n}},$$\n\n自由度为 $n - 1$。若把两列当作独立样本处理，就忽略了配对，通常会夸大标准误。",
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
            wrong: [Q.of(dbar, s), Q.of(2 * dbar * s, ss), ans.neg(), Q.of(4 * dbar, s)],
            solution: t(
              `The differences are $${ds.join(", ")}$ with $\\bar{d} = ${dbar}$. The squared deviations sum to $${ss}$, so $s_d = \\sqrt{\\frac{${ss}}{3}} = ${s}$ and $t = \\frac{${dbar}}{${s}/\\sqrt{4}} = ${ans.toLatex()}$.`,
              `差值为 $${ds.join(", ")}$，$\\bar{d} = ${dbar}$。离差平方和为 $${ss}$，所以 $s_d = \\sqrt{\\frac{${ss}}{3}} = ${s}$，$t = \\frac{${dbar}}{${s}/\\sqrt{4}} = ${ans.toLatex()}$。`,
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
    prerequisites: ["the-f-distribution", "hypothesis-tests-for-one-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "f-test-statistic-calculation",
        title: t("Computing the F-test statistic for two variances", "计算两方差的 F 检验统计量"),
        explanation: t(
          "If the two population variances are equal, the ratio of the sample variances should be near one, and the F distribution says how far from one is unusual. The test statistic is $F = \\frac{s_1^2}{s_2^2}$.",
          "如果两个总体方差相等，样本方差之比应接近 1，F 分布说明偏离 1 多远才算异常。检验统计量为 $F = \\frac{s_1^2}{s_2^2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n1 = rng.int(10, 40);
          const n2 = rng.int(10, 40);
          const s1Sq = rng.int(15, 120);
          const s2Sq = rng.int(10, 80);

          return numberProblem({
            prompt: t(
              `Independent samples of sizes $n_1 = ${n1}$ and $n_2 = ${n2}$ from normal populations have sample variances $s_1^2 = ${s1Sq}$ and $s_2^2 = ${s2Sq}$. To test $H_0: \\sigma_1^2 = \\sigma_2^2$ against $H_1: \\sigma_1^2 > \\sigma_2^2$, find the exact rational value of the test statistic $F = \\frac{s_1^2}{s_2^2}$.`,
              `来自正态总体的独立样本容量分别为 $n_1 = ${n1}$ 与 $n_2 = ${n2}$，样本方差分别为 $s_1^2 = ${s1Sq}$ 与 $s_2^2 = ${s2Sq}$。为检验 $H_0: \\sigma_1^2 = \\sigma_2^2$ 对 $H_1: \\sigma_1^2 > \\sigma_2^2$，求检验统计量 $F = \\frac{s_1^2}{s_2^2}$ 的精确有理数值。`,
            ),
            answer: Q.of(s1Sq, s2Sq),
            wrong: [Q.of(s2Sq, s1Sq), Q.of((n1 - 1) * s1Sq, (n2 - 1) * s2Sq), s1Sq - s2Sq],
            solution: t(
              `$F = \\frac{s_1^2}{s_2^2} = \\frac{${s1Sq}}{${s2Sq}} = ${Q.of(s1Sq, s2Sq).toLatex()}$ (with numerator $\\nu_1 = ${n1 - 1}$ and denominator $\\nu_2 = ${n2 - 1}$ degrees of freedom).`,
              `$F = \\frac{s_1^2}{s_2^2} = \\frac{${s1Sq}}{${s2Sq}} = ${Q.of(s1Sq, s2Sq).toLatex()}$（分子自由度 $\\nu_1 = ${n1 - 1}$，分母自由度 $\\nu_2 = ${n2 - 1}$）。`,
            ),
          });
        },
      },
      {
        id: "deciding-a-two-tailed-f-test",
        title: t("Deciding a two-tailed $F$-test", "双侧 $F$ 检验的决策"),
        explanation: t(
          "For $H_1: \\sigma_1^{2} \\neq \\sigma_2^{2}$, put the **larger** sample variance in the numerator so that $F \\ge 1$, and compare it with the upper critical value $F_{\\alpha/2}$ whose first degrees of freedom belong to the numerator sample. Reject $H_0$ when $F \\ge F_{\\alpha/2}(\\nu_1, \\nu_2)$.\n\nThis shortcut uses only the upper tail table, and it counts both directions because the larger variance is always on top.",
          "对于 $H_1: \\sigma_1^{2} \\neq \\sigma_2^{2}$，把**较大**的样本方差放在分子上使 $F \\ge 1$，再与上侧临界值 $F_{\\alpha/2}$ 比较，其第一自由度属于分子对应的样本。当 $F \\ge F_{\\alpha/2}(\\nu_1, \\nu_2)$ 时拒绝 $H_0$。\n\n这种做法只用上侧表，由于较大的方差总在分子上，两个方向都已计入。",
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
          return choiceProblem({
            prompt: t(
              `Sample 1 has $n_1 = ${n1}$ and $s_1^{2} = ${s1}$; sample 2 has $n_2 = ${n2}$ and $s_2^{2} = ${s2}$. Test $H_0: \\sigma_1^{2} = \\sigma_2^{2}$ against $H_1: \\sigma_1^{2} \\neq \\sigma_2^{2}$ at $\\alpha = 0.05$. With the larger variance in the numerator, the critical value is $F_{0.025}(${na - 1}, ${nb - 1}) = ${crit}$. What is the conclusion?`,
              `样本 1：$n_1 = ${n1}$，$s_1^{2} = ${s1}$；样本 2：$n_2 = ${n2}$，$s_2^{2} = ${s2}$。在 $\\alpha = 0.05$ 下检验 $H_0: \\sigma_1^{2} = \\sigma_2^{2}$ 对 $H_1: \\sigma_1^{2} \\neq \\sigma_2^{2}$。把较大方差放在分子上，临界值为 $F_{0.025}(${na - 1}, ${nb - 1}) = ${crit}$。结论是什么？`,
            ),
            options: [t("Reject $H_0$", "拒绝 $H_0$"), t("Do not reject $H_0$", "不拒绝 $H_0$")],
            correct: reject ? 0 : 1,
            solution: t(
              `$F = \\frac{${big}}{${small}} \\approx ${F.toNumber().toFixed(3)}$, which is ${reject ? "at least" : "less than"} $${crit}$, so ${reject ? "reject" : "do not reject"} $H_0$.`,
              `$F = \\frac{${big}}{${small}} \\approx ${F.toNumber().toFixed(3)}$，${reject ? "不小于" : "小于"} $${crit}$，所以${reject ? "拒绝" : "不拒绝"} $H_0$。`,
            ),
          });
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
    prerequisites: ["hypothesis-tests-for-two-means-equal-but-unknown-population-variances"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "concept-of-ssb-and-ssw",
        title: t("Meaning of SSB and SSW in ANOVA", "方差分析中 SSB 与 SSW 的含义"),
        explanation: t(
          "SSB measures differences among the group sample means (treatment effect). SSW measures the unexplained variation within each treatment group (random error).",
          "SSB 测量各组样本均值之间的差异（处理效应）。SSW 测量每个处理组内部未解释的随机变异（随机误差）。",
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

          return choiceProblem({
            prompt: t(
              `In a one-way ANOVA with $k = ${k}$ groups and a total of $N = ${N}$ observations ${ctx.descEn}, what does the within-groups sum of squares ($SSW$, or sum of squares for error $SSE$) measure?`,
              `在包含 $k = ${k}$ 个组别、共 $N = ${N}$ 个观测值的单因素方差分析中，${ctx.descZh}，组内平方和（$SSW$，或误差平方和 $SSE$）测量的是什么？`,
            ),
            options,
            correct,
            solution: t(
              `$SSW$ (Sum of Squares Within / Error) measures the dispersion of individual data points around their respective group mean, representing random experimental error. $SSB$ measures the variation of group means around the grand mean.`,
              `$SSW$（组内平方和 / 误差平方和）测量单个数据点围绕其各自组均值的离散程度，代表随机试验误差。而 $SSB$ 则测量各组均值围绕总均值的变异。`,
            ),
          });
        },
      },
      {
        id: "computing-ssb-from-group-means",
        title: t("Computing SSB from group means", "由组均值计算 SSB"),
        explanation: t(
          "The between-groups sum of squares measures how far the group means sit from the grand mean, weighted by group size:\n\n$$\\text{SSB} = \\sum_{i=1}^{k} n_i(\\bar{x}_i - \\bar{x})^{2}, \\qquad \\bar{x} = \\frac{\\sum n_i\\bar{x}_i}{N}.$$\n\nThe grand mean is the mean of all $N$ observations, so it is the **weighted** mean of the group means, not their plain average unless the groups have equal sizes.",
          "组间平方和衡量各组均值偏离总均值的程度，并以组容量加权：\n\n$$\\text{SSB} = \\sum_{i=1}^{k} n_i(\\bar{x}_i - \\bar{x})^{2}, \\qquad \\bar{x} = \\frac{\\sum n_i\\bar{x}_i}{N}.$$\n\n总均值是全部 $N$ 个观测的均值，因此是各组均值的**加权**平均；除非各组容量相等，否则它不等于组均值的简单平均。",
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
            wrong: [unweighted, plainSsb, ssb.div(Q.of(2))].filter((w) => !w.eq(ssb)),
            solution: t(
              `The grand mean is $\\bar{x} = \\frac{${total}}{${N}} = ${grand.toLatex()}$. Then $\\text{SSB} = ${ns.map((x, i) => `${x}\\left(${ms[i]} - ${grand.toLatex()}\\right)^{2}`).join(" + ")} = ${ssb.toLatex()}$.`,
              `总均值为 $\\bar{x} = \\frac{${total}}{${N}} = ${grand.toLatex()}$。于是 $\\text{SSB} = ${ns.map((x, i) => `${x}\\left(${ms[i]} - ${grand.toLatex()}\\right)^{2}`).join(" + ")} = ${ssb.toLatex()}$。`,
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
    prerequisites: ["one-factor-within-groups-and-between-groups-variation"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "anova-sum-of-squares-identity-calc",
        title: t("Computing missing sums of squares in ANOVA", "计算方差分析中缺失的平方和"),
        explanation: t(
          "The total variation splits exactly into variation between the group means and variation within the groups, so any two give the third. SST = SSB + SSW.",
          "总变差恰好分成组间均值的变差和组内的变差，所以知道其中两个就能求出第三个。SST = SSB + SSW。",
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
              wrong: [ssb * ssw, ssw - ssb, Math.max(ssb, ssw)],
              solution: t(
                `By the ANOVA identity, $SST = SSB + SSW = ${ssb} + ${ssw} = ${sst}$.`,
                `根据方差分析恒等式，$SST = SSB + SSW = ${ssb} + ${ssw} = ${sst}$。`,
              ),
            });
          } else if (missing === "SSB") {
            return numberProblem({
              prompt: t(
                `In a one-way ANOVA study, the total sum of squares is $SST = ${sst}$ and the within-groups sum of squares is $SSW = ${ssw}$. Find the between-groups sum of squares $SSB$.`,
                `在单因素方差分析研究中，总平方和为 $SST = ${sst}$，组内平方和为 $SSW = ${ssw}$。求组间平方和 $SSB$。`,
              ),
              answer: ssb,
              wrong: [sst + ssw, ssw - sst, ssw],
              solution: t(`$SSB = SST - SSW = ${sst} - ${ssw} = ${ssb}$.`, `$SSB = SST - SSW = ${sst} - ${ssw} = ${ssb}$。`),
            });
          } else {
            return numberProblem({
              prompt: t(
                `In a one-way ANOVA study, the total sum of squares is $SST = ${sst}$ and the between-groups sum of squares is $SSB = ${ssb}$. Find the within-groups sum of squares $SSW$.`,
                `在单因素方差分析研究中，总平方和为 $SST = ${sst}$，组间平方和为 $SSB = ${ssb}$. 求组内平方和 $SSW$。`,
              ),
              answer: ssw,
              wrong: [sst + ssb, ssb - sst, ssb],
              solution: t(`$SSW = SST - SSB = ${sst} - ${ssb} = ${ssw}$.`, `$SSW = SST - SSB = ${sst} - ${ssb} = ${ssw}$。`),
            });
          }
        },
      },
      {
        id: "computing-ssw-from-group-data",
        title: t("Computing SSW from group data", "由分组数据计算 SSW"),
        explanation: t(
          "The within-groups sum of squares adds up the squared deviations of each observation from **its own group's** mean:\n\n$$\\text{SSW} = \\sum_{i=1}^{k}\\sum_{j} (x_{ij} - \\bar{x}_i)^{2}.$$\n\nCompute each group's mean, the squared deviations inside the group, and add over all groups. Measuring from the grand mean instead would give SST, which also contains the between-groups variation.",
          "组内平方和把每个观测与其**所在组**均值之差的平方加起来：\n\n$$\\text{SSW} = \\sum_{i=1}^{k}\\sum_{j} (x_{ij} - \\bar{x}_i)^{2}.$$\n\n先求每组的均值，再求组内的离差平方，最后对所有组求和。若改为以总均值为基准，得到的是 SST，其中还包含组间变异。",
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
          const wrong = [sst, Q.of(ssw, 6), Q.of(ssw, 2)].filter((w) => !w.eq(Q.of(ssw)));
          return numberProblem({
            prompt: t(
              `Three groups of observations are: group A: $${groups[0]?.xs.join(", ")}$; group B: $${groups[1]?.xs.join(", ")}$; group C: $${groups[2]?.xs.join(", ")}$. Find the within-groups sum of squares SSW.`,
              `三组观测值为：A 组 $${groups[0]?.xs.join(", ")}$；B 组 $${groups[1]?.xs.join(", ")}$；C 组 $${groups[2]?.xs.join(", ")}$。求组内平方和 SSW。`,
            ),
            answer: ssw,
            wrong,
            solution: t(
              `The group means are $${groups.map((g) => g.m).join(", ")}$. The squared deviations within the groups sum to ${groups.map((g) => `$${g.xs.reduce((a, x) => a + (x - g.m) ** 2, 0)}$`).join(", ")}, so $\\text{SSW} = ${ssw}$.`,
              `各组均值为 $${groups.map((g) => g.m).join(", ")}$。各组内离差平方和分别为 ${groups.map((g) => `$${g.xs.reduce((a, x) => a + (x - g.m) ** 2, 0)}$`).join("，")}，所以 $\\text{SSW} = ${ssw}$。`,
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
    prerequisites: ["the-relationship-between-ssw-ssb-sst", "the-f-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "one-way-anova-f-statistic-calc",
        title: t("Computing the one-way ANOVA F-statistic", "计算单因素方差分析的 F 检验统计量"),
        explanation: t(
          "Dividing each sum of squares by its degrees of freedom gives a mean square, and a large ratio of between to within suggests the group means differ. F = MSB / MSW, where MSB = SSB / (k - 1) and MSW = SSW / (N - k).",
          "把每个平方和除以其自由度得到均方，组间与组内均方之比很大时，说明各组均值存在差异。F = MSB / MSW，其中 MSB = SSB / (k - 1) 且 MSW = SSW / (N - k)。",
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
              `A one-way ANOVA compares $k = ${k}$ treatment groups with a total of $N = ${N}$ observations across all groups. The sum of squares are $SSB = ${ssb}$ and $SSW = ${ssw}$. Compute the exact rational value of the ANOVA test statistic $F = \\frac{MSB}{MSW} = \\frac{SSB / (k - 1)}{SSW / (N - k)}$.`,
              `某单因素方差分析比较 $k = ${k}$ 个处理组，全部组共计 $N = ${N}$ 个观测值。已知平方和为 $SSB = ${ssb}$ 与 $SSW = ${ssw}$。计算该方差分析检验统计量 $F = \\frac{MSB}{MSW} = \\frac{SSB / (k - 1)}{SSW / (N - k)}$ 的精确有理数值。`,
            ),
            answer: Q.of(msB, msW),
            wrong: [Q.of(ssb, ssw), Q.of(msW, msB), Q.of(ssb * dfW, ssw * (dfB + 1))],
            solution: t(
              `The mean squares are $MSB = \\frac{SSB}{k - 1} = \\frac{${ssb}}{${dfB}} = ${msB}$ and $MSW = \\frac{SSW}{N - k} = \\frac{${ssw}}{${dfW}} = ${msW}$. Thus $F = \\frac{MSB}{MSW} = \\frac{${msB}}{${msW}} = ${Q.of(msB, msW).toLatex()}$.`,
              `均方分别为 $MSB = \\frac{SSB}{k - 1} = \\frac{${ssb}}{${dfB}} = ${msB}$ 以及 $MSW = \\frac{SSW}{N - k} = \\frac{${ssw}}{${dfW}} = ${msW}$。因此 $F = \\frac{MSB}{MSW} = \\frac{${msB}}{${msW}} = ${Q.of(msB, msW).toLatex()}$。`,
            ),
          });
        },
      },
      {
        id: "the-f-statistic-from-sst-and-ssb",
        title: t("The $F$ statistic from SST and SSB", "由 SST 和 SSB 求 $F$ 统计量"),
        explanation: t(
          "An ANOVA table is often reported with SST and SSB only. Recover the within-groups part first, $\\text{SSW} = \\text{SST} - \\text{SSB}$, then divide each part by its degrees of freedom:\n\n$$F = \\frac{\\text{SSB}/(k - 1)}{(\\text{SST} - \\text{SSB})/(N - k)}.$$\n\nDividing SSB by SST instead gives the proportion of variation explained, $\\eta^{2}$, which is not a test statistic.",
          "方差分析表常常只给出 SST 和 SSB。先求出组内部分 $\\text{SSW} = \\text{SST} - \\text{SSB}$，再把各部分除以其自由度：\n\n$$F = \\frac{\\text{SSB}/(k - 1)}{(\\text{SST} - \\text{SSB})/(N - k)}.$$\n\n若改用 SSB 除以 SST，得到的是被解释变异的比例 $\\eta^{2}$，它不是检验统计量。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(3, 5);
          const N = k * rng.int(4, 9);
          const ssb = rng.int(20, 200);
          const ssw = rng.int(40, 400);
          const sst = ssb + ssw;
          const ans = Q.of(ssb * (N - k), (k - 1) * ssw);
          const wrong = [Q.of(ssb * (N - k), (k - 1) * sst), Q.of(ssb, ssw), Q.of(ssb * (N - 1), (k - 1) * ssw)].filter((w) => !w.eq(ans));
          return numberProblem({
            prompt: t(
              `A one-way ANOVA compares $k = ${k}$ groups with $N = ${N}$ observations in all. The total sum of squares is $\\text{SST} = ${sst}$ and the between-groups sum of squares is $\\text{SSB} = ${ssb}$. Find the $F$ statistic.`,
              `单因素方差分析比较 $k = ${k}$ 个组，共 $N = ${N}$ 个观测。总平方和 $\\text{SST} = ${sst}$，组间平方和 $\\text{SSB} = ${ssb}$。求 $F$ 统计量。`,
            ),
            answer: ans,
            wrong,
            solution: t(
              `$\\text{SSW} = ${sst} - ${ssb} = ${ssw}$. $F = \\frac{${ssb}/${k - 1}}{${ssw}/${N - k}} = \\frac{${ssb * (N - k)}}{${(k - 1) * ssw}}${lowestTerms(ssb * (N - k), (k - 1) * ssw)}$.`,
              `$\\text{SSW} = ${sst} - ${ssb} = ${ssw}$。$F = \\frac{${ssb}/${k - 1}}{${ssw}/${N - k}} = \\frac{${ssb * (N - k)}}{${(k - 1) * ssw}}${lowestTerms(ssb * (N - k), (k - 1) * ssw)}$。`,
            ),
          });
        },
      },
    ],
  },
];
