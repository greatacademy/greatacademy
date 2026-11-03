import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { numberProblem } from "../problems.ts";

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
    prerequisites: ["the-chi-square-distribution", "introduction-to-hypothesis-testing"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-chi-square-goodness-of-fit-statistic",
        title: t("Computing the chi-square goodness-of-fit test statistic", "计算卡方拟合优度检验统计量"),
        explanation: t(
          "Each category contributes its squared gap between observed and expected counts, scaled by the expected count, and large totals signal a poor fit. The test statistic is $\\chi^2 = \\sum_{i=1}^k \\frac{(O_i - E_i)^2}{E_i}$.",
          "每个类别贡献观测数与期望数之差的平方，再除以期望数，总和很大时说明拟合不好。检验统计量为 $\\chi^2 = \\sum_{i=1}^k \\frac{(O_i - E_i)^2}{E_i}$。",
        ),
        generate: (rng: Rng): Problem => {
          // 3 categories with clean numbers
          const e1 = rng.int(20, 80);
          const e2 = rng.int(20, 80);
          const e3 = rng.int(20, 80);
          const d1 = rng.int(-8, 8);
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
              `An experiment with $k = 3$ categories records observed frequencies $O_1 = ${o1}$, $O_2 = ${o2}$, $O_3 = ${o3}$ against expected frequencies $E_1 = ${e1}$, $E_2 = ${e2}$, $E_3 = ${e3}$. Calculate the exact rational value of the chi-square test statistic $\\chi^2 = \\sum_{i=1}^3 \\frac{(O_i - E_i)^2}{E_i}$.`,
              `一个包含 $k = 3$ 个类别的试验记录了观测频数 $O_1 = ${o1}$、$O_2 = ${o2}$、$O_3 = ${o3}$，理论期望频数分别为 $E_1 = ${e1}$、$E_2 = ${e2}$、$E_3 = ${e3}$。计算卡方检验统计量 $\\chi^2 = \\sum_{i=1}^3 \\frac{(O_i - E_i)^2}{E_i}$ 的精确有理数值。`,
            ),
            answer: ans,
            wrong: [
              Q.of(d1 * d1 + d2 * d2 + d3 * d3, e1 + e2 + e3),
              Q.of(d1 * d1, o1)
                .add(Q.of(d2 * d2, o2))
                .add(Q.of(d3 * d3, o3)),
              term1.add(term2),
            ],
            solution: t(
              `The component terms are $\\frac{(${o1} - ${e1})^2}{${e1}} = \\frac{${d1 * d1}}{${e1}}$, $\\frac{(${o2} - ${e2})^2}{${e2}} = \\frac{${d2 * d2}}{${e2}}$, and $\\frac{(${o3} - ${e3})^2}{${e3}} = \\frac{${d3 * d3}}{${e3}}$. Their sum is $\\chi^2 = ${ans.toLatex()}$ (with $\\nu = 3 - 1 = 2$ degrees of freedom).`,
              `各分项分别为 $\\frac{(${o1} - ${e1})^2}{${e1}} = \\frac{${d1 * d1}}{${e1}}$、$\\frac{(${o2} - ${e2})^2}{${e2}} = \\frac{${d2 * d2}}{${e2}}$ 以及 $\\frac{(${o3} - ${e3})^2}{${e3}} = \\frac{${d3 * d3}}{${e3}}$。其总和为 $\\chi^2 = ${ans.toLatex()}$（自由度 $\\nu = 3 - 1 = 2$）。`,
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
    prerequisites: ["introduction-to-chi-square-goodness-of-fit", "the-binomial-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "binomial-expected-cell-count",
        title: t("Computing expected cell counts under a binomial model", "计算二项模型下的期望频数"),
        explanation: t(
          "The expected count for a value is the total number of observations times the model's probability of that value. The expected count for the cell $x$ is $E_x = N \\binom{n}{x} p^x (1 - p)^{n-x}$.",
          "某个取值的期望计数等于观测总数乘以模型给出的该值概率。取值 $x$ 对应的期望频数为 $E_x = N \\binom{n}{x} p^x (1 - p)^{n-x}$。",
        ),
        generate: (rng: Rng): Problem => {
          // n = 2 or 3, p = 1/2 or 1/4
          const n = rng.pick([2, 3]);
          const x = rng.int(0, n);
          let nChooseX = 1;
          if (n === 2) {
            nChooseX = x === 1 ? 2 : 1;
          } else {
            nChooseX = x === 0 || x === 3 ? 1 : 3;
          }

          // Let p = 1/2 so P(X=x) = nChooseX / 2^n
          const denProb = 2 ** n;
          // Choose N as multiple of denProb
          const mult = rng.int(10, 80);
          const N = mult * denProb;
          const expected = mult * nChooseX;

          return numberProblem({
            prompt: t(
              `A total of $N = ${N}$ independent batches of size $n = ${n}$ are tested for fit to a $\\text{Binomial}(${n}, 0.5)$ model. Calculate the expected frequency $E_{${x}} = N \\cdot P(X = ${x})$.`,
              `共 $N = ${N}$ 组容量为 $n = ${n}$ 的独立批次用于检验是否符合 $\\text{Binomial}(${n}, 0.5)$ 模型。计算观测到恰好 $x = ${x}$ 次成功的期望频数 $E_{${x}} = N \\cdot P(X = ${x})$。`,
            ),
            answer: expected,
            wrong: [Q.of(N, n + 1), mult, Q.of(N * x, n)],
            solution: t(
              `$P(X = ${x}) = \\binom{${n}}{${x}} (0.5)^${x} (0.5)^{${n - x}} = \\frac{${nChooseX}}{${denProb}}$. Thus $E_{${x}} = ${N} \\times \\frac{${nChooseX}}{${denProb}} = ${expected}$.`,
              `$P(X = ${x}) = \\binom{${n}}{${x}} (0.5)^${x} (0.5)^{${n - x}} = \\frac{${nChooseX}}{${denProb}}$。因此 $E_{${x}} = ${N} \\times \\frac{${nChooseX}}{${denProb}} = ${expected}$。`,
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
    prerequisites: ["introduction-to-chi-square-goodness-of-fit", "the-poisson-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "poisson-gof-df-calculation",
        title: t("Degrees of freedom when estimating the Poisson parameter", "估计泊松参数时的自由度计算"),
        explanation: t(
          "Each parameter estimated from the data makes the expected counts fit more closely, so one degree of freedom is lost for each. With $k$ categories, $\\text{df} = k - 1 - m$, where $m$ is the number of estimated parameters ($m = 1$ for $\\lambda$).",
          "每个由数据估计的参数都使期望计数拟合得更紧，所以每估计一个参数就失去一个自由度。有 $k$ 个类别时，$\\text{df} = k - 1 - m$，其中 $m$ 为估计的参数个数（对 $\\lambda$ 有 $m = 1$）。",
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
            wrong: [k - 1, k - 3, k],
            solution: t(
              `With $k = ${k}$ categories and $m = 1$ parameter ($\\lambda$) estimated from the data, the degrees of freedom are $\\nu = k - 1 - m = ${k} - 1 - 1 = ${df}$.`,
              `包含 $k = ${k}$ 个分类类别且有 $m = 1$ 个参数（$\\lambda$）从数据中估计时，自由度为 $\\nu = k - 1 - m = ${k} - 1 - 1 = ${df}$。`,
            ),
          });
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
    prerequisites: ["introduction-to-chi-square-goodness-of-fit", "the-continuous-uniform-distribution"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "continuous-uniform-equal-bins-expected",
        title: t("Computing expected bin frequencies for uniform models", "计算均匀分布模型的期望区间频数"),
        explanation: t(
          "When the bins have equal probability under the model, the observations are expected to be shared equally among them. With $k$ equal-probability bins, each expected count is $E_i = \\frac{N}{k}$.",
          "当各组在模型下的概率相等时，观测值预期会平均分配到各组中。对 $k$ 个等概率区间，每个期望频数为 $E_i = \\frac{N}{k}$。",
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
            wrong: [k, N, Q.of(N, k - 1)],
            solution: t(
              `Under the uniform distribution, every equal subinterval has probability $p_i = \\frac{1}{${k}}$. Thus each bin has expected count $E_i = N p_i = \\frac{${N}}{${k}} = ${perBin}$.`,
              `在均匀分布下，每个等宽子区间的理论概率均为 $p_i = \\frac{1}{${k}}$。因此每个区间的期望频数为 $E_i = N p_i = \\frac{${N}}{${k}} = ${perBin}$。`,
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
    prerequisites: ["introduction-to-chi-square-goodness-of-fit"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "normal-gof-df-calculation",
        title: t("Degrees of freedom for normal goodness-of-fit test", "正态拟合优度检验的自由度"),
        explanation: t(
          "Estimating both the mean and the standard deviation uses up two degrees of freedom, in addition to the one lost because the counts must add to the total. With $k$ categories, $\\text{df} = k - 1 - 2 = k - 3$ when $\\mu$ and $\\sigma$ are estimated from the sample.",
          "估计均值和标准差会用掉两个自由度，此外计数之和必须等于总数，还要再失去一个自由度。有 $k$ 个类别且 $\\mu$ 与 $\\sigma$ 均由样本估计时，$\\text{df} = k - 1 - 2 = k - 3$。",
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
            wrong: [k - 1, k - 2, k - 4],
            solution: t(
              `Since $m = 2$ parameters ($\\mu$ and $\\sigma$) are estimated from the sample, the degrees of freedom are $\\nu = k - 1 - m = ${k} - 1 - 2 = ${df}$.`,
              `由于从样本中估计了 $m = 2$ 个参数（$\\mu$ 与 $\\sigma$），自由度为 $\\nu = k - 1 - m = ${k} - 1 - 2 = ${df}$。`,
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
    prerequisites: ["introduction-to-chi-square-goodness-of-fit"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "contingency-table-expected-cell-calc",
        title: t("Computing expected cell frequency in a contingency table", "计算列联表中的期望单元格频数"),
        explanation: t(
          "If the row and column variables are independent, each cell should receive the row share times the column share of the total. The expected count in row $i$ and column $j$ is $E_{ij} = \\frac{R_i C_j}{N}$.",
          "如果行变量与列变量相互独立，每个格子应得到总数中行比例与列比例的乘积。第 $i$ 行第 $j$ 列的期望频数为 $E_{ij} = \\frac{R_i C_j}{N}$。",
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
              `In an $r \\times c = ${r} \\times ${c}$ contingency table with grand total $N = ${grandTotal}$, row 1 has marginal total $R_1 = ${rTotal}$ and column 1 has marginal total $C_1 = ${cTotal}$. Under the null hypothesis of independence, find the exact rational value of the expected cell count $E_{11} = \\frac{R_1 C_1}{N}$.`,
              `在总样本量为 $N = ${grandTotal}$ 的 $r \\times c = ${r} \\times ${c}$ 列联表中，第 1 行的边际合计为 $R_1 = ${rTotal}$，第 1 列的边际合计为 $C_1 = ${cTotal}$。在变量相互独立的原假设下，求期望单元格频数 $E_{11} = \\frac{R_1 C_1}{N}$ 的精确有理数值。`,
            ),
            answer: ans,
            wrong: [Q.of(rTotal + cTotal, grandTotal), Q.of(rTotal * cTotal, r * c), Q.of(rTotal, grandTotal)],
            solution: t(
              `$E_{11} = \\frac{R_1 C_1}{N} = \\frac{${rTotal} \\times ${cTotal}}{${grandTotal}} = \\frac{${rTotal * cTotal}}{${grandTotal}} = ${ans.toLatex()}$ (with $(r - 1)(c - 1) = (${r} - 1)(${c} - 1) = ${df}$ degrees of freedom).`,
              `$E_{11} = \\frac{R_1 C_1}{N} = \\frac{${rTotal} \\times ${cTotal}}{${grandTotal}} = \\frac{${rTotal * cTotal}}{${grandTotal}} = ${ans.toLatex()}$（自由度为 $(r - 1)(c - 1) = (${r} - 1)(${c} - 1) = ${df}$）。`,
            ),
          });
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
    prerequisites: ["joint-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "uniform-order-statistic-expectation",
        title: t("Expected value of order statistics for standard uniform distribution", "标准均匀分布顺序统计量的数学期望"),
        explanation: t(
          "Sorted uniform values tend to divide the interval into equal gaps, so the expected value of the k-th smallest is k parts out of one more than the sample size. For i.i.d. $X_i \\sim \\text{Uniform}(0, 1)$, $E[X_{(k)}] = \\frac{k}{n + 1}$.",
          "排序后的均匀取值倾向于把区间分成相等的间隔，所以第 k 小值的期望是样本量加 1 等份中的 k 份。对于独立同分布的 $X_i \\sim \\text{Uniform}(0, 1)$，$E[X_{(k)}] = \\frac{k}{n + 1}$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(3, 20);
          const k = rng.int(1, n);
          const ans = Q.of(k, n + 1);

          return numberProblem({
            prompt: t(
              `Let $X_1, X_2, \\dots, X_{${n}}$ be a random sample of size $n = ${n}$ from the continuous uniform distribution on $[0, 1]$, arranged in increasing order $X_{(1)} \\le X_{(2)} \\le \\dots \\le X_{(${n})}$. Find the exact rational value of the expected value of the $k = ${k}$-th order statistic, $E[X_{(${k})}]$.`,
              `设 $X_1, X_2, \\dots, X_{${n}}$ 为来自 $[0, 1]$ 上连续均匀分布的容量为 $n = ${n}$ 的随机样本，按升序排列为 $X_{(1)} \\le X_{(2)} \\le \\dots \\le X_{(${n})}$。求第 $k = ${k}$ 个顺序统计量的数学期望 $E[X_{(${k})}]$ 的精确有理数值。`,
            ),
            answer: ans,
            wrong: [Q.of(k, n), Q.of(k - 1, n), Q.of(k + 1, n + 1)],
            solution: t(
              `For a sample of size $n$ from $\\text{Uniform}(0, 1)$, the $k$-th order statistic follows a $\\text{Beta}(k, n - k + 1)$ distribution, giving $E[X_{(k)}] = \\frac{k}{n + 1} = \\frac{${k}}{${n} + 1} = ${ans.toLatex()}$.`,
              `对于来自 $\\text{Uniform}(0, 1)$ 的容量为 $n$ 的样本，第 $k$ 个顺序统计量服从 $\\text{Beta}(k, n - k + 1)$ 分布，其数学期望为 $E[X_{(k)}] = \\frac{k}{n + 1} = \\frac{${k}}{${n} + 1} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },
];
