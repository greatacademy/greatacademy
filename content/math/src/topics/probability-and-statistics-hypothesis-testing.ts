import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { choiceProblem, numberProblem } from "../problems.ts";

/** Topics for Unit 8: Hypothesis Testing (new topics). */
export const probabilityAndStatisticsHypothesisTestingTopics: TopicDef[] = [
  // 8.28.1 Introduction to Hypothesis Testing
  {
    id: "introduction-to-hypothesis-testing",
    title: t("Introduction to Hypothesis Testing", "假设检验导论"),
    summary: t(
      "In hypothesis testing, the null hypothesis H_0 represents a default position of no effect or no difference, while the alternative hypothesis H_1 (or H_a) represents the claim to be tested.",
      "在假设检验中，原假设 H_0 代表无效应或无差异的默认立场，而备择假设 H_1（或 H_a）代表待检验的断言。",
    ),
    prerequisites: ["the-central-limit-theorem"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "formulating-null-and-alternative-hypotheses",
        title: t("Formulating null and alternative hypotheses", "建立原假设与备择假设"),
        explanation: t(
          "The null hypothesis always includes equality (H_0: μ = μ_0). The alternative hypothesis specifies the direction of the effect: two-tailed (μ ≠ μ_0), right-tailed (μ > μ_0), or left-tailed (μ < μ_0).",
          "原假设始终包含等号（H_0: μ = μ_0）。备择假设指明效应方向：双尾（μ ≠ μ_0）、右尾（μ > μ_0）或左尾（μ < μ_0）。",
        ),
        generate: (rng: Rng): Problem => {
          const mu0 = rng.int(20, 300);
          const contexts = [
            {
              item: t("battery lifespan in hours", "电池寿命（小时）"),
              claim: t("greater than", "大于"),
              dir: ">",
            },
            {
              item: t("mean tensile strength in MPa", "平均抗拉强度（MPa）"),
              claim: t("less than", "小于"),
              dir: "<",
            },
            {
              item: t("daily production yield", "日均产量"),
              claim: t("different from", "不同于"),
              dir: "\\neq",
            },
            {
              item: t("average customer wait time in seconds", "客户平均等待时间（秒）"),
              claim: t("less than", "小于"),
              dir: "<",
            },
            {
              item: t("mean volume filled per bottle in mL", "每瓶平均灌装量（mL）"),
              claim: t("different from", "不同于"),
              dir: "\\neq",
            },
            {
              item: t("average fuel efficiency in mpg", "平均燃油效率（mpg）"),
              claim: t("greater than", "大于"),
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
              `A researcher tests whether the population mean $\\mu$ of ${ctx.item} is ${ctx.claim} ${mu0}. Which pair of hypotheses correctly formulates this statistical test?`,
              `研究人员想检验${ctx.item}的总体均值 $\\mu$ 是否${ctx.claim} ${mu0}。哪一对假设正确地建立了该统计检验？`,
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
    ],
  },

  // 8.28.2 Hypothesis Tests for the Rate of a Poisson Distribution
  {
    id: "hypothesis-tests-for-the-rate-of-a-poisson-distribution",
    title: t("Hypothesis Tests for the Rate of a Poisson Distribution", "泊松分布发生率的假设检验"),
    summary: t(
      "For a sample of total events K ~ Poisson(nλ) over n intervals, testing H_0: λ = λ_0 with large nλ_0 uses the standardized test statistic Z = (K - nλ_0) / √(nλ_0).",
      "若在 n 个区间内观测到的总事件数 K ~ Poisson(nλ)，在 nλ_0 较大时检验 H_0: λ = λ_0 使用标准化检验统计量 Z = (K - nλ_0) / √(nλ_0)。",
    ),
    prerequisites: ["introduction-to-hypothesis-testing", "the-poisson-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "poisson-normal-test-statistic",
        title: t("Computing the standardized test statistic for Poisson rate", "计算泊松发生率的标准化检验统计量"),
        explanation: t(
          "Under H_0, E[K] = nλ_0 and Var(K) = nλ_0, so Z = (K - nλ_0) / √(nλ_0).",
          "在 H_0 下，E[K] = nλ_0 且 Var(K) = nλ_0，故 Z = (K - nλ_0) / √(nλ_0)。",
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
            solution: t(
              `The expected count under $H_0$ is $n\\lambda_0 = ${n} \\times ${lambda0} = ${expected}$, so $\\sqrt{n\\lambda_0} = ${m}$. The test statistic is $z = \\frac{${k} - ${expected}}{${m}} = \\frac{${d * m}}{${m}} = ${z}$.`,
              `在 $H_0$ 下的期望事件数为 $n\\lambda_0 = ${n} \\times ${lambda0} = ${expected}$，故 $\\sqrt{n\\lambda_0} = ${m}$。检验统计量为 $z = \\frac{${k} - ${expected}}{${m}} = \\frac{${d * m}}{${m}} = ${z}$。`,
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
      "In a left-tailed test with significance level α, the critical region is Z ≤ -z_α. The null hypothesis H_0 is rejected if the calculated test statistic falls in this region.",
      "在显著性水平为 α 的左尾检验中，临界区域为 Z ≤ -z_α。若计算得到的检验统计量落在此区域内，则拒绝原假设 H_0。",
    ),
    prerequisites: ["introduction-to-hypothesis-testing", "percentage-points-of-the-standard-normal-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-left-tailed-critical-region",
        title: t("Evaluating left-tailed test decisions", "评估左尾检验的决策"),
        explanation: t("If z_calc ≤ -z_α, reject H_0; otherwise fail to reject H_0.", "若 z_calc ≤ -z_α，则拒绝 H_0；否则不拒绝 H_0。"),
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
        explanation: t("If z_calc ≥ z_α, reject H_0; otherwise fail to reject H_0.", "若 z_calc ≥ z_α，则拒绝 H_0；否则不拒绝 H_0。"),
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
    ],
  },

  // 8.28.5 Two-Tailed Hypothesis Tests
  {
    id: "two-tailed-hypothesis-tests",
    title: t("Two-Tailed Hypothesis Tests", "双尾假设检验"),
    summary: t(
      "In a two-tailed test with significance level α, the significance level is split equally across both tails, giving critical region |Z| ≥ z_{α/2}.",
      "在显著性水平为 α 的双尾检验中，显著性水平均分到两个尾部，临界区域为 |Z| ≥ z_{α/2}。",
    ),
    prerequisites: ["critical-regions-for-right-tailed-hypothesis-tests"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-two-tailed-critical-region",
        title: t("Evaluating two-tailed test decisions", "评估双尾检验的决策"),
        explanation: t(
          "If |z_calc| ≥ z_{α/2}, reject H_0; otherwise fail to reject H_0.",
          "若 |z_calc| ≥ z_{α/2}，则拒绝 H_0；否则不拒绝 H_0。",
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
    ],
  },

  // 8.28.6 Type I and Type II Errors
  {
    id: "type-i-and-type-ii-errors",
    title: t("Type I and Type II Errors", "第一类与第二类错误"),
    summary: t(
      "A Type I error is rejecting H_0 when H_0 is true (probability α). A Type II error is failing to reject H_0 when H_0 is false (probability β). The power of the test is 1 - β.",
      "第一类错误是在 H_0 为真时拒绝 H_0（概率为 α）。第二类错误是在 H_0 为假时未能拒绝 H_0（概率为 β）。检验效能为 1 - β。",
    ),
    prerequisites: ["introduction-to-hypothesis-testing"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "defining-type-i-and-ii-errors",
        title: t("Distinguishing Type I and Type II errors", "区分第一类与第二类错误"),
        explanation: t(
          "Type I: False positive (reject true H_0). Type II: False negative (fail to reject false H_0).",
          "第一类错误：假阳性（拒绝了真实的 H_0）。第二类错误：假阴性（未能拒绝虚假的 H_0）。",
        ),
        generate: (rng: Rng): Problem => {
          const scenarios = [
            {
              h0: t("a new medicine has no effect", "新药没有疗效"),
              action: t(
                "the researchers conclude the medicine is effective when in reality it has no effect",
                "研究人员得出该药有效，而实际上它并没有疗效",
              ),
              isTypeI: true,
            },
            {
              h0: t("a defendant is innocent", "被告无罪"),
              action: t("the court convicts an innocent defendant", "法院判决无辜的被告有罪"),
              isTypeI: true,
            },
            {
              h0: t("a manufactured batch meets quality standards", "生产批次符合质量标准"),
              action: t(
                "the manufacturer ships a defective batch, concluding it meets standards",
                "制造商错误地认为批次达标，将不合格批次出厂",
              ),
              isTypeI: false,
            },
            {
              h0: t("a security alarm should remain silent (no intruder)", "安防警报保持静默（无入侵者）"),
              action: t("an intruder enters the facility but the alarm fails to trigger", "有入侵者进入设施，但警报未触发"),
              isTypeI: false,
            },
          ];
          const sc = rng.pick(scenarios);
          const correctErr = sc.isTypeI ? t("Type I error", "第一类错误") : t("Type II error", "第二类错误");
          const wrongErr = sc.isTypeI ? t("Type II error", "第二类错误") : t("Type I error", "第一类错误");

          const opts = [correctErr, wrongErr, t("Sampling bias error", "抽样偏倚错误"), t("Measurement precision error", "测量精度误差")];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Consider a hypothesis test where the null hypothesis states that ${sc.h0}. In a particular study, ${sc.action}. What type of statistical error was committed?`,
              `考虑一个假设检验，其中原假设为${sc.h0}。在某次具体试验中，${sc.action}。此时犯了哪一类统计错误？`,
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
    ],
  },

  // 8.28.7 Hypothesis Tests for One Mean: Known Population Variance
  {
    id: "hypothesis-tests-for-one-mean-known-population-variance",
    title: t("Hypothesis Tests for One Mean: Known Population Variance", "单总体均值的假设检验：已知总体方差"),
    summary: t(
      "When the population variance σ^2 is known, the test statistic for testing H_0: μ = μ_0 is Z = (x̄ - μ_0) / (σ / √n), which follows N(0, 1) under H_0.",
      "当总体方差 σ^2 已知时，检验 H_0: μ = μ_0 的检验统计量为 Z = (x̄ - μ_0) / (σ / √n)，在 H_0 下服从 N(0, 1)。",
    ),
    prerequisites: ["two-tailed-hypothesis-tests", "confidence-intervals-for-one-mean-known-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "one-mean-known-variance-z-statistic",
        title: t("Computing the one-sample z-test statistic", "计算单样本 z 检验统计量"),
        explanation: t("z = (x̄ - μ_0) / (σ / √n).", "z = (x̄ - μ_0) / (σ / √n)。"),
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
            solution: t(
              `The standard error is $\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${k}} = ${s}$. Thus $z = \\frac{${xBar} - ${mu0}}{${s}} = \\frac{${d * s}}{${s}} = ${z}$.`,
              `标准误差为 $\\frac{\\sigma}{\\sqrt{n}} = \\frac{${sigma}}{\\sqrt{${n}}} = \\frac{${sigma}}{${k}} = ${s}$。因此 $z = \\frac{${xBar} - ${mu0}}{${s}} = \\frac{${d * s}}{${s}} = ${z}$。`,
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
      "When the population variance σ^2 is unknown and the sample comes from a normal population, the test statistic is T = (x̄ - μ_0) / (s / √n), which follows Student's t-distribution with ν = n - 1 degrees of freedom.",
      "当总体方差 σ^2 未知且样本来自正态总体时，检验统计量为 T = (x̄ - μ_0) / (s / √n)，在 H_0 下服从自由度为 ν = n - 1 的学生 t 分布。",
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
        explanation: t("t = (x̄ - μ_0) / (s / √n) with df = n - 1.", "t = (x̄ - μ_0) / (s / √n)，自由度为 df = n - 1。"),
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
            solution: t(
              `The estimated standard error is $\\frac{s}{\\sqrt{n}} = \\frac{${s}}{\\sqrt{${n}}} = \\frac{${s}}{${k}} = ${mult}$. Thus $t = \\frac{${xBar} - ${mu0}}{${mult}} = \\frac{${d * mult}}{${mult}} = ${tVal}$ (with $\\nu = ${n} - 1 = ${n - 1}$ degrees of freedom).`,
              `估计标准误差为 $\\frac{s}{\\sqrt{n}} = \\frac{${s}}{\\sqrt{${n}}} = \\frac{${s}}{${k}} = ${mult}$。因此 $t = \\frac{${xBar} - ${mu0}}{${mult}} = \\frac{${d * mult}}{${mult}} = ${tVal}$（自由度 $\\nu = ${n} - 1 = ${n - 1}$）。`,
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
      "To test hypotheses about a single population variance H_0: σ^2 = σ_0^2 from a normal population, the test statistic is χ^2 = (n - 1)s^2 / σ_0^2, which follows χ^2(n - 1) under H_0.",
      "检验来自正态总体的单总体方差假设 H_0: σ^2 = σ_0^2 时，检验统计量为 χ^2 = (n - 1)s^2 / σ_0^2，在 H_0 下服从 χ^2(n - 1)。",
    ),
    prerequisites: ["confidence-intervals-for-one-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "one-variance-chi-square-statistic",
        title: t("Computing the chi-square statistic for one variance", "计算单方差的卡方检验统计量"),
        explanation: t("χ^2 = (n - 1)s^2 / σ_0^2.", "χ^2 = (n - 1)s^2 / σ_0^2。"),
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
            solution: t(
              `$\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2} = \\frac{(${n} - 1)(${sSq})}{${sigma0Sq}} = \\frac{${df} \\times ${sSq}}{${sigma0Sq}} = \\frac{${num}}{${den}}$.`,
              `$\\chi^2 = \\frac{(n - 1)s^2}{\\sigma_0^2} = \\frac{(${n} - 1)(${sSq})}{${sigma0Sq}} = \\frac{${df} \\times ${sSq}}{${sigma0Sq}} = \\frac{${num}}{${den}}$。`,
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
      "When comparing two independent normal populations with known variances σ_1^2 and σ_2^2, the test statistic for H_0: μ_1 - μ_2 = Δ_0 is Z = ((x̄_1 - x̄_2) - Δ_0) / √(σ_1^2/n_1 + σ_2^2/n_2).",
      "比较两个方差已知为 σ_1^2 与 σ_2^2 的独立正态总体均值时，检验 H_0: μ_1 - μ_2 = Δ_0 的统计量为 Z = ((x̄_1 - x̄_2) - Δ_0) / √(σ_1^2/n_1 + σ_2^2/n_2)。",
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
          "z = ((x̄_1 - x̄_2) - Δ_0) / SE, where SE = √(σ_1^2/n_1 + σ_2^2/n_2).",
          "z = ((x̄_1 - x̄_2) - Δ_0) / SE，其中 SE = √(σ_1^2/n_1 + σ_2^2/n_2)。",
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
            solution: t(
              `$\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2} = \\frac{${sig1Sq}}{${n1}} + \\frac{${sig2Sq}}{${n2}} = ${choice.v1} + ${choice.v2} = ${choice.se * choice.se}$, so $\\text{SE} = ${choice.se}$. The test statistic is $z = \\frac{${xBar1} - ${xBar2}}{${choice.se}} = \\frac{${diff}}{${choice.se}} = ${d}$.`,
              `$\\frac{\\sigma_1^2}{n_1} + \\frac{\\sigma_2^2}{n_2} = \\frac{${sig1Sq}}{${n1}} + \\frac{${sig2Sq}}{${n2}} = ${choice.v1} + ${choice.v2} = ${choice.se * choice.se}$，故 $\\text{SE} = ${choice.se}$。检验统计量为 $z = \\frac{${xBar1} - ${xBar2}}{${choice.se}} = \\frac{${diff}}{${choice.se}} = ${d}$。`,
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
      "When comparing two means under the assumption σ_1^2 = σ_2^2 = σ^2, the pooled variance s_p^2 = ((n_1 - 1)s_1^2 + (n_2 - 1)s_2^2) / (n_1 + n_2 - 2) is used, giving a t-statistic with ν = n_1 + n_2 - 2 degrees of freedom.",
      "在假设 σ_1^2 = σ_2^2 = σ^2 下比较两均值时，使用合并方差 s_p^2 = ((n_1 - 1)s_1^2 + (n_2 - 1)s_2^2) / (n_1 + n_2 - 2)，给出自由度为 ν = n_1 + n_2 - 2 的 t 统计量。",
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
          "s_p^2 = ((n_1 - 1)s_1^2 + (n_2 - 1)s_2^2) / (n_1 + n_2 - 2).",
          "s_p^2 = ((n_1 - 1)s_1^2 + (n_2 - 1)s_2^2) / (n_1 + n_2 - 2)。",
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
            solution: t(
              `$s_p^2 = \\frac{(${df1})(${s1Sq}) + (${df2})(${s2Sq})}{${df1} + ${df2}} = \\frac{${df1 * s1Sq} + ${df2 * s2Sq}}{${den}} = \\frac{${num}}{${den}}$.`,
              `$s_p^2 = \\frac{(${df1})(${s1Sq}) + (${df2})(${s2Sq})}{${df1} + ${df2}} = \\frac{${df1 * s1Sq} + ${df2 * s2Sq}}{${den}} = \\frac{${num}}{${den}}$。`,
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
      "When variances σ_1^2 ≠ σ_2^2 are unknown, Welch's t-test uses the test statistic T = ((x̄_1 - x̄_2) - Δ_0) / √(s_1^2/n_1 + s_2^2/n_2).",
      "当方差 σ_1^2 ≠ σ_2^2 未知时，韦尔奇 t 检验使用检验统计量 T = ((x̄_1 - x̄_2) - Δ_0) / √(s_1^2/n_1 + s_2^2/n_2)。",
    ),
    prerequisites: ["confidence-intervals-for-differences-between-two-means-unknown-unequal-population-variances"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "welch-test-standard-error",
        title: t("Computing standard error for Welch's t-test", "计算韦尔奇 t 检验的标准误差平方"),
        explanation: t("SE^2 = s_1^2 / n_1 + s_2^2 / n_2.", "SE^2 = s_1^2 / n_1 + s_2^2 / n_2。"),
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
            solution: t(
              `$\\text{SE}^2 = \\frac{${s1Sq}}{${n1}} + \\frac{${s2Sq}}{${n2}} = ${ans.toLatex()}$.`,
              `$\\text{SE}^2 = \\frac{${s1Sq}}{${n1}} + \\frac{${s2Sq}}{${n2}} = ${ans.toLatex()}$。`,
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
      "To test H_0: p_1 = p_2, the pooled proportion p̂ = (x_1 + x_2) / (n_1 + n_2) is used to calculate standard error SE = √(p̂(1 - p̂)(1/n_1 + 1/n_2)) and test statistic Z = (p̂_1 - p̂_2) / SE.",
      "检验 H_0: p_1 = p_2 时，使用合并样本比例 p̂ = (x_1 + x_2) / (n_1 + n_2) 计算标准误差 SE = √(p̂(1 - p̂)(1/n_1 + 1/n_2)) 及检验统计量 Z = (p̂_1 - p̂_2) / SE。",
    ),
    prerequisites: ["confidence-intervals-for-differences-between-two-proportions"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "pooled-sample-proportion-calculation",
        title: t("Computing the pooled sample proportion", "计算合并样本比例"),
        explanation: t("p̂ = (x_1 + x_2) / (n_1 + n_2).", "p̂ = (x_1 + x_2) / (n_1 + n_2)。"),
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
            solution: t(
              `$\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2} = \\frac{${x1} + ${x2}}{${n1} + ${n2}} = \\frac{${num}}{${den}}$.`,
              `$\\hat{p} = \\frac{x_1 + x_2}{n_1 + n_2} = \\frac{${x1} + ${x2}}{${n1} + ${n2}} = \\frac{${num}}{${den}}$。`,
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
      "When differences d_i = x_{1i} - x_{2i} have known variance σ_d^2, testing H_0: μ_d = Δ_0 uses the one-sample z-statistic Z = (d̄ - Δ_0) / (σ_d / √n).",
      "当差值 d_i = x_{1i} - x_{2i} 具有已知方差 σ_d^2 时，检验 H_0: μ_d = Δ_0 使用单样本 z 统计量 Z = (d̄ - Δ_0) / (σ_d / √n)。",
    ),
    prerequisites: [
      "paired-sample-confidence-intervals-for-the-difference-between-two-means",
      "hypothesis-tests-for-one-mean-known-population-variance",
    ],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "paired-z-test-statistic-calculation",
        title: t("Computing the paired z-test statistic", "计算配对 z 检验统计量"),
        explanation: t("z = (d̄ - Δ_0) / (σ_d / √n).", "z = (d̄ - Δ_0) / (σ_d / √n)。"),
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
            solution: t(
              `The standard error is $\\frac{\\sigma_d}{\\sqrt{n}} = \\frac{${sigmaD}}{\\sqrt{${n}}} = \\frac{${sigmaD}}{${k}} = ${s}$. The test statistic is $z = \\frac{${dBar}}{${s}} = ${d}$.`,
              `标准误差为 $\\frac{\\sigma_d}{\\sqrt{n}} = \\frac{${sigmaD}}{\\sqrt{${n}}} = \\frac{${sigmaD}}{${k}} = ${s}$。检验统计量为 $z = \\frac{${dBar}}{${s}} = ${d}$。`,
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
      "When the population variance of differences is unknown, testing H_0: μ_d = Δ_0 uses the paired t-statistic T = (d̄ - Δ_0) / (s_d / √n) with ν = n - 1 degrees of freedom.",
      "当差值总体方差未知时，检验 H_0: μ_d = Δ_0 使用配对 t 统计量 T = (d̄ - Δ_0) / (s_d / √n)，自由度为 ν = n - 1。",
    ),
    prerequisites: ["hypothesis-tests-for-two-means-paired-sample-z-test", "hypothesis-tests-for-one-mean-unknown-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "paired-t-test-statistic-calculation",
        title: t("Computing the paired t-test statistic", "计算配对 t 检验统计量"),
        explanation: t("t = (d̄ - Δ_0) / (s_d / √n) with df = n - 1.", "t = (d̄ - Δ_0) / (s_d / √n)，自由度 df = n - 1。"),
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
            solution: t(
              `The estimated standard error is $\\frac{s_d}{\\sqrt{n}} = \\frac{${sD}}{\\sqrt{${n}}} = \\frac{${sD}}{${k}} = ${s}$. The test statistic is $t = \\frac{${dBar}}{${s}} = ${d}$ (with $\\nu = ${n - 1}$ degrees of freedom).`,
              `估计标准误差为 $\\frac{s_d}{\\sqrt{n}} = \\frac{${sD}}{\\sqrt{${n}}} = \\frac{${sD}}{${k}} = ${s}$。检验统计量为 $t = \\frac{${dBar}}{${s}} = ${d}$（自由度 $\\nu = ${n - 1}$）。`,
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
      "To test H_0: σ_1^2 = σ_2^2 for two independent normal populations, the test statistic is F = s_1^2 / s_2^2, which follows an F-distribution with ν_1 = n_1 - 1 and ν_2 = n_2 - 1 degrees of freedom.",
      "检验两个独立正态总体的方差齐性 H_0: σ_1^2 = σ_2^2 时，检验统计量为 F = s_1^2 / s_2^2，在 H_0 下服从自由度为 ν_1 = n_1 - 1 与 ν_2 = n_2 - 1 的 F 分布。",
    ),
    prerequisites: ["the-f-distribution", "hypothesis-tests-for-one-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "f-test-statistic-calculation",
        title: t("Computing the F-test statistic for two variances", "计算两方差的 F 检验统计量"),
        explanation: t("F = s_1^2 / s_2^2.", "F = s_1^2 / s_2^2。"),
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
            solution: t(
              `$F = \\frac{s_1^2}{s_2^2} = \\frac{${s1Sq}}{${s2Sq}} = ${Q.of(s1Sq, s2Sq).toLatex()}$ (with numerator $\\nu_1 = ${n1 - 1}$ and denominator $\\nu_2 = ${n2 - 1}$ degrees of freedom).`,
              `$F = \\frac{s_1^2}{s_2^2} = \\frac{${s1Sq}}{${s2Sq}} = ${Q.of(s1Sq, s2Sq).toLatex()}$（分子自由度 $\\nu_1 = ${n1 - 1}$，分母自由度 $\\nu_2 = ${n2 - 1}$）。`,
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
          const contexts = [
            {
              desc: t(
                "testing whether different fertilizer types result in different crop yields",
                "检验不同肥料类型是否导致不同的作物产量",
              ),
              factor: t("fertilizer type", "肥料类型"),
            },
            {
              desc: t(
                "testing whether different teaching methods result in different exam scores",
                "检验不同教学方法是否导致不同的考试成绩",
              ),
              factor: t("teaching method", "教学方法"),
            },
            {
              desc: t(
                "testing whether different drug dosages result in different blood pressure reductions",
                "检验不同药物剂量是否导致不同的降压效果",
              ),
              factor: t("drug dosage", "药物剂量"),
            },
          ];
          const ctx = rng.pick(contexts);

          const opts = [
            t("Random error variation among individual observations within the same group.", "同一组内各观测值之间的随机误差变异。"),
            t(`Differences between the average yields caused by the ${ctx.factor}.`, `由${ctx.factor}引起的组均值之间的系统差异。`),
            t("The total variation of all observations around the overall grand mean.", "所有观测值相对于总体总均值的全部总变异。"),
            t("The ratio of the treatment variance to the error variance.", "处理方差与误差方差的比值。"),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `In a one-way ANOVA with $k = ${k}$ groups ${ctx.desc}, what does the within-groups sum of squares ($SSW$, or sum of squares for error $SSE$) measure?`,
              `在包含 $k = ${k}$ 个组别的单因素方差分析中，${ctx.desc}，组内平方和（$SSW$，或误差平方和 $SSE$）测量的是什么？`,
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
    ],
  },

  // 8.30.2 The Relationship Between SSW, SSB, SST
  {
    id: "the-relationship-between-ssw-ssb-sst",
    title: t("The Relationship Between SSW, SSB, SST", "SSW、SSB 与 SST 之间的关系"),
    summary: t(
      "The total sum of squares partitions as SST = SSB + SSW. The corresponding degrees of freedom partition as df_T = df_B + df_W, where df_B = k - 1, df_W = N - k, and df_T = N - 1.",
      "总平方和分解为 SST = SSB + SSW。相应的自由度分解为 df_T = df_B + df_W，其中 df_B = k - 1，df_W = N - k，且 df_T = N - 1。",
    ),
    prerequisites: ["one-factor-within-groups-and-between-groups-variation"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "anova-sum-of-squares-identity-calc",
        title: t("Computing missing sums of squares in ANOVA", "计算方差分析中缺失的平方和"),
        explanation: t("SST = SSB + SSW.", "SST = SSB + SSW。"),
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
              solution: t(`$SSB = SST - SSW = ${sst} - ${ssw} = ${ssb}$.`, `$SSB = SST - SSW = ${sst} - ${ssw} = ${ssb}$。`),
            });
          } else {
            return numberProblem({
              prompt: t(
                `In a one-way ANOVA study, the total sum of squares is $SST = ${sst}$ and the between-groups sum of squares is $SSB = ${ssb}$. Find the within-groups sum of squares $SSW$.`,
                `在单因素方差分析研究中，总平方和为 $SST = ${sst}$，组间平方和为 $SSB = ${ssb}$. 求组内平方和 $SSW$。`,
              ),
              answer: ssw,
              solution: t(`$SSW = SST - SSB = ${sst} - ${ssb} = ${ssw}$.`, `$SSW = SST - SSB = ${sst} - ${ssb} = ${ssw}$。`),
            });
          }
        },
      },
    ],
  },

  // 8.30.3 One-Factor Analysis of Variance
  {
    id: "one-factor-analysis-of-variance",
    title: t("One-Factor Analysis of Variance", "单因素方差分析"),
    summary: t(
      "To test equality of k treatment means H_0: μ_1 = μ_2 = ... = μ_k, the ANOVA F-statistic is F = MSB / MSW = (SSB / (k - 1)) / (SSW / (N - k)), which follows F(k - 1, N - k) under H_0.",
      "检验 k 个处理均值是否相等 H_0: μ_1 = μ_2 = ... = μ_k 时，方差分析 F 统计量为 F = MSB / MSW = (SSB / (k - 1)) / (SSW / (N - k))，在 H_0 下服从 F(k - 1, N - k)。",
    ),
    prerequisites: ["the-relationship-between-ssw-ssb-sst", "the-f-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "one-way-anova-f-statistic-calc",
        title: t("Computing the one-way ANOVA F-statistic", "计算单因素方差分析的 F 检验统计量"),
        explanation: t(
          "F = MSB / MSW, where MSB = SSB / (k - 1) and MSW = SSW / (N - k).",
          "F = MSB / MSW，其中 MSB = SSB / (k - 1) 且 MSW = SSW / (N - k)。",
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
            solution: t(
              `The mean squares are $MSB = \\frac{SSB}{k - 1} = \\frac{${ssb}}{${dfB}} = ${msB}$ and $MSW = \\frac{SSW}{N - k} = \\frac{${ssw}}{${dfW}} = ${msW}$. Thus $F = \\frac{MSB}{MSW} = \\frac{${msB}}{${msW}} = ${Q.of(msB, msW).toLatex()}$.`,
              `均方分别为 $MSB = \\frac{SSB}{k - 1} = \\frac{${ssb}}{${dfB}} = ${msB}$ 以及 $MSW = \\frac{SSW}{N - k} = \\frac{${ssw}}{${dfW}} = ${msW}$。因此 $F = \\frac{MSB}{MSW} = \\frac{${msB}}{${msW}} = ${Q.of(msB, msW).toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },
];
