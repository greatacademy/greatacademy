import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { isTerminating, numberProblem, steps } from "../problems.ts";

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
      {
        id: "expected-counts-from-hypothesized-proportions",
        title: t("Expected counts from hypothesized proportions", "由假设比例求期望频数"),
        explanation: t(
          "The null hypothesis states a proportion $p_i$ for each category, and the expected count is the share of the sample it predicts, $E_i = N p_i$. The category then contributes $\\frac{(O_i - E_i)^2}{E_i}$ to the statistic. If $H_0$ says $30\\%$ of $200$ customers choose a brand and $72$ do, then $E = 60$ and the contribution is $\\frac{12^2}{60} = 2.4$.",
          "原假设为每个类别给出比例 $p_i$，期望频数就是它所预测的样本份额，$E_i = N p_i$。该类别对统计量的贡献为 $\\frac{(O_i - E_i)^2}{E_i}$。若 $H_0$ 认为 $200$ 名顾客中有 $30\\%$ 选择某品牌，而实际有 $72$ 人，则 $E = 60$，贡献为 $\\frac{12^2}{60} = 2.4$。",
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
            wrong: [Q.of(d * d, o), Q.of(d * d, pct), Q.of(Math.abs(d), e), Q.of(d * d, N)],
            solution: t(
              `The expected count is $E = N p = ${N} \\cdot ${pct / 100} = ${e}$, so ${steps(`\\frac{(O - E)^2}{E} = \\frac{(${o} - ${e})^2}{${e}} = \\frac{${d * d}}{${e}} = ${ans.toLatex()}`)}`,
              `期望频数为 $E = N p = ${N} \\cdot ${pct / 100} = ${e}$，所以${steps(`\\frac{(O - E)^2}{E} = \\frac{(${o} - ${e})^2}{${e}} = \\frac{${d * d}}{${e}} = ${ans.toLatex()}`)}`,
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
              `$P(X = ${x}) = \\binom{${n}}{${x}} (0.5)^{${x}} (0.5)^{${n - x}} = \\frac{${nChooseX}}{${denProb}}$. Thus $E_{${x}} = ${N} \\times \\frac{${nChooseX}}{${denProb}} = ${expected}$.`,
              `$P(X = ${x}) = \\binom{${n}}{${x}} (0.5)^{${x}} (0.5)^{${n - x}} = \\frac{${nChooseX}}{${denProb}}$。因此 $E_{${x}} = ${N} \\times \\frac{${nChooseX}}{${denProb}} = ${expected}$。`,
            ),
          });
        },
      },
      {
        id: "estimating-the-binomial-proportion-from-counts",
        title: t("Estimating the binomial proportion from the counts", "由频数估计二项分布的比例"),
        explanation: t(
          "When $p$ is not given, estimate it from the data before computing expected counts. Each of the $N$ batches has $n$ trials, so there are $Nn$ trials in all, and the total number of successes is $\\sum x f_x$. The estimate is the overall success rate,\n\n$$\\hat{p} = \\frac{\\sum x f_x}{N n} = \\frac{\\bar{x}}{n}.$$\n\nEstimating $p$ costs one more degree of freedom: $\\nu = k - 2$ for $k$ cells.",
          "当 $p$ 未给出时，要先用数据估计它，再计算期望频数。$N$ 批中每批有 $n$ 次试验，共 $Nn$ 次试验，成功总数为 $\\sum x f_x$。估计值就是总的成功率：\n\n$$\\hat{p} = \\frac{\\sum x f_x}{N n} = \\frac{\\bar{x}}{n}.$$\n\n估计 $p$ 会再损失一个自由度：$k$ 个单元格时 $\\nu = k - 2$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.pick([2, 3, 4]);
          const fs = Array.from({ length: n + 1 }, () => rng.int(5, 60));
          const N = fs.reduce((s, f) => s + f, 0);
          const total = fs.reduce((s, f, x) => s + x * f, 0);
          const ans = Q.of(total, N * n);
          const xs = fs.map((_, x) => x);
          const table = `$$\\begin{array}{c|${"c".repeat(n + 1)}} x & ${xs.join(" & ")} \\\\ \\hline f_x & ${fs.join(" & ")} \\end{array}$$`;
          return numberProblem({
            prompt: t(
              `In each of $N = ${N}$ batches, $n = ${n}$ items are tested, and $x$ is the number of successes in a batch. The table gives how many batches $f_x$ had each $x$. Estimate $p$ for a binomial model as an exact fraction.${table}`,
              `共检验 $N = ${N}$ 批，每批 $n = ${n}$ 件，$x$ 为一批中的成功次数。表中给出成功次数为 $x$ 的批数 $f_x$。为二项模型估计 $p$，写成精确分数。${table}`,
            ),
            answer: ans,
            wrong: [Q.of(total, N), Q.of(total, n * (n + 1)), Q.of(total, N * (n + 1))],
            solution: t(
              `The total number of successes is $${fs.map((f, x) => `${x} \\cdot ${f}`).join(" + ")} = ${total}$, out of $N n = ${N} \\cdot ${n} = ${N * n}$ trials:${steps(`\\hat{p} = \\frac{${total}}{${N * n}} = ${ans.toLatex()}`)}`,
              `成功总数为 $${fs.map((f, x) => `${x} \\cdot ${f}`).join(" + ")} = ${total}$，试验总数为 $N n = ${N} \\cdot ${n} = ${N * n}$：${steps(`\\hat{p} = \\frac{${total}}{${N * n}} = ${ans.toLatex()}`)}`,
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
      {
        id: "estimating-lambda-from-a-frequency-table",
        title: t("Estimating $\\lambda$ from a frequency table", "由频数表估计 $\\lambda$"),
        explanation: t(
          "Before the expected Poisson counts can be computed, $\\lambda$ is estimated by the sample mean. From a frequency table, the mean weights each count $x$ by how often it occurred:\n\n$$\\hat{\\lambda} = \\bar{x} = \\frac{\\sum x f_x}{\\sum f_x}.$$\n\nFor counts $0, 1, 2$ seen $5, 3, 2$ times, $\\hat{\\lambda} = \\frac{0 + 3 + 4}{10} = 0.7$. This is the estimated parameter that lowers the degrees of freedom to $k - 2$.",
          "在计算泊松期望频数之前，要用样本均值估计 $\\lambda$。由频数表求均值时，每个计数 $x$ 按其出现次数加权：\n\n$$\\hat{\\lambda} = \\bar{x} = \\frac{\\sum x f_x}{\\sum f_x}.$$\n\n例如计数 $0, 1, 2$ 分别出现 $5, 3, 2$ 次，则 $\\hat{\\lambda} = \\frac{0 + 3 + 4}{10} = 0.7$。正是这个被估计的参数使自由度降为 $k - 2$。",
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
            return numberProblem({
              prompt: t(
                `The table gives the number of days $f_x$ on which a help desk received $x$ calls in an hour. Estimate $\\lambda$ for a Poisson model.${table}`,
                `表中给出某服务台一小时内接到 $x$ 个电话的天数 $f_x$。为泊松模型估计 $\\lambda$。${table}`,
              ),
              answer: ans,
              form: "decimal",
              wrong: [
                Q.of(total, k),
                Q.of(
                  xs.reduce((s, x) => s + x, 0),
                  k,
                ),
                Q.of(N, k),
              ],
              solution: t(
                `There are $N = ${N}$ days and $${fs.map((f, x) => `${x} \\cdot ${f}`).join(" + ")} = ${total}$ calls in all:${steps(`\\hat{\\lambda} = \\frac{${total}}{${N}} = ${dec(ans)}`)}`,
                `共 $N = ${N}$ 天，电话总数为 $${fs.map((f, x) => `${x} \\cdot ${f}`).join(" + ")} = ${total}$：${steps(`\\hat{\\lambda} = \\frac{${total}}{${N}} = ${dec(ans)}`)}`,
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
      {
        id: "expected-counts-for-unequal-bins",
        title: t("Expected counts for bins of unequal width", "不等宽区间的期望频数"),
        explanation: t(
          "Under $\\text{Uniform}(a, b)$, the probability of a bin is its share of the length of the interval, so bins of different widths get different expected counts:\n\n$$E = N \\cdot \\frac{d - c}{b - a} \\quad \\text{for the bin } [c, d].$$\n\nFor $N = 120$ values tested against $\\text{Uniform}(0, 60)$, the bin $[10, 25]$ has $E = 120 \\cdot \\frac{15}{60} = 30$. Every expected count should be at least $5$ for the chi-square approximation to be trusted.",
          "在 $\\text{Uniform}(a, b)$ 下，一个区间的概率等于它占整个区间长度的比例，所以宽度不同的区间期望频数也不同：\n\n$$E = N \\cdot \\frac{d - c}{b - a},$$\n\n其中 $[c, d]$ 为该区间。\n\n例如用 $N = 120$ 个数据检验 $\\text{Uniform}(0, 60)$，区间 $[10, 25]$ 的 $E = 120 \\cdot \\frac{15}{60} = 30$。为使卡方近似可信，每个期望频数都应不少于 $5$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.pick([10, 20, 30, 40, 50, 60, 100]);
          const N = rng.pick([40, 60, 80, 120, 150, 200, 240, 300]);
          const c = rng.int(0, b - 2);
          const d = rng.int(c + 1, b);
          const ans = Q.of(N * (d - c), b);
          return numberProblem({
            prompt: t(
              `$N = ${N}$ observations are tested for fit to $\\text{Uniform}(0, ${b})$, with bins of different widths. Find the expected count for the bin $[${c}, ${d}]$.`,
              `用 $N = ${N}$ 个观测值检验是否服从 $\\text{Uniform}(0, ${b})$，各区间宽度不同。求区间 $[${c}, ${d}]$ 的期望频数。`,
            ),
            answer: ans,
            wrong: [Q.of(N * d, b), Q.of(N, d - c), Q.of(d - c, b), Q.of(N * (d - c), 100)],
            solution: t(
              `The bin covers $\\frac{${d} - ${c}}{${b}} = ${Q.of(d - c, b).toLatex()}$ of the interval:${steps(`E = ${N} \\cdot ${Q.of(d - c, b).toLatex()} = ${ans.toLatex()}`)}`,
              `该区间占整个区间的 $\\frac{${d} - ${c}}{${b}} = ${Q.of(d - c, b).toLatex()}$：${steps(`E = ${N} \\cdot ${Q.of(d - c, b).toLatex()} = ${ans.toLatex()}`)}`,
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
      {
        id: "expected-counts-of-normal-classes",
        title: t("Expected counts of normal classes", "正态分布各组的期望频数"),
        explanation: t(
          "To get the expected count of a class $[c, d]$ under $N(\\mu, \\sigma^2)$, standardize both ends, $z = \\frac{x - \\mu}{\\sigma}$, find the probability between them from the standard normal table, and multiply by $N$:\n\n$$E = N\\big(\\Phi(z_d) - \\Phi(z_c)\\big).$$\n\nFor negative $z$ use $\\Phi(-z) = 1 - \\Phi(z)$. With $\\mu = 50$, $\\sigma = 10$ and $N = 200$, the class $[40, 50]$ has $E = 200(0.5 - 0.1587) = 68.26$.",
          "求 $N(\\mu, \\sigma^2)$ 下组 $[c, d]$ 的期望频数时，先把两端标准化，$z = \\frac{x - \\mu}{\\sigma}$，再由标准正态分布表求两者之间的概率，最后乘以 $N$：\n\n$$E = N\\big(\\Phi(z_d) - \\Phi(z_c)\\big).$$\n\n$z$ 为负时用 $\\Phi(-z) = 1 - \\Phi(z)$。若 $\\mu = 50$，$\\sigma = 10$，$N = 200$，组 $[40, 50]$ 的 $E = 200(0.5 - 0.1587) = 68.26$。",
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
            wrong: [Q.of(N * at(h2), 10000), Q.of(N * (at(h2) + at(h1) - 10000), 10000), Q.of(N * prob, 20000)].filter((w) => w.sign() > 0),
            solution: t(
              `Standardize the ends: $z = \\frac{${c} - ${mu}}{${sigma}} = ${z(h1)}$ and $z = \\frac{${d} - ${mu}}{${sigma}} = ${z(h2)}$, so $\\Phi(${z(h2)}) - \\Phi(${z(h1)}) = ${ph(h2)} - ${ph(h1)} = ${dec(Q.of(prob, 10000))}$:${steps(`E = ${N} \\cdot ${dec(Q.of(prob, 10000))} = ${dec(ans)}`)}`,
              `把两端标准化：$z = \\frac{${c} - ${mu}}{${sigma}} = ${z(h1)}$，$z = \\frac{${d} - ${mu}}{${sigma}} = ${z(h2)}$，所以 $\\Phi(${z(h2)}) - \\Phi(${z(h1)}) = ${ph(h2)} - ${ph(h1)} = ${dec(Q.of(prob, 10000))}$：${steps(`E = ${N} \\cdot ${dec(Q.of(prob, 10000))} = ${dec(ans)}`)}`,
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
      {
        id: "the-statistic-for-a-two-by-two-table",
        title: t("The statistic for a two-by-two table", "2×2 列联表的统计量"),
        explanation: t(
          "For a $2 \\times 2$ table with cells $a, b$ in the first row and $c, d$ in the second, every cell differs from its expected count by the same amount, $\\frac{|ad - bc|}{N}$. Adding the four terms $\\frac{(O - E)^2}{E}$ simplifies to\n\n$$\\chi^2 = \\frac{N(ad - bc)^2}{R_1 R_2 C_1 C_2},$$\n\nwith the row totals $R_1, R_2$, the column totals $C_1, C_2$ and $\\nu = (2 - 1)(2 - 1) = 1$ degree of freedom.",
          "对于第一行为 $a, b$、第二行为 $c, d$ 的 $2 \\times 2$ 列联表，每个单元格与其期望频数之差的绝对值都相同，为 $\\frac{|ad - bc|}{N}$。把四项 $\\frac{(O - E)^2}{E}$ 相加可化简为\n\n$$\\chi^2 = \\frac{N(ad - bc)^2}{R_1 R_2 C_1 C_2},$$\n\n其中 $R_1, R_2$ 为行合计，$C_1, C_2$ 为列合计，自由度为 $\\nu = (2 - 1)(2 - 1) = 1$。",
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
            const table = `$$\\begin{array}{c|cc} & \\text{Yes} & \\text{No} \\\\ \\hline \\text{Group 1} & ${a} & ${b} \\\\ \\text{Group 2} & ${c} & ${d} \\end{array}$$`;
            const tableZh = `$$\\begin{array}{c|cc} & \\text{是} & \\text{否} \\\\ \\hline \\text{第 1 组} & ${a} & ${b} \\\\ \\text{第 2 组} & ${c} & ${d} \\end{array}$$`;
            return numberProblem({
              prompt: t(
                `Find the chi-square statistic for independence in the table, rounded to two decimal places.${table}`,
                `求下表独立性检验的卡方统计量，精确到两位小数。${tableZh}`,
              ),
              answer: ans,
              form: "decimal",
              wrong: [round2(diff * diff * 4, prod), round2(N * Math.abs(diff) * 100, prod), round2(diff * diff, N * N)],
              solution: t(
                `The totals are $R_1 = ${r1}$, $R_2 = ${r2}$, $C_1 = ${c1}$, $C_2 = ${c2}$ and $N = ${N}$, and $ad - bc = ${a} \\cdot ${d} - ${b} \\cdot ${c} = ${diff}$:${steps(`\\chi^2 = \\frac{${N} \\cdot (${diff})^2}{${r1} \\cdot ${r2} \\cdot ${c1} \\cdot ${c2}} = \\frac{${N * diff * diff}}{${prod}} \\approx ${dec(ans)}`)}`,
                `合计为 $R_1 = ${r1}$，$R_2 = ${r2}$，$C_1 = ${c1}$，$C_2 = ${c2}$，$N = ${N}$，且 $ad - bc = ${a} \\cdot ${d} - ${b} \\cdot ${c} = ${diff}$：${steps(`\\chi^2 = \\frac{${N} \\cdot (${diff})^2}{${r1} \\cdot ${r2} \\cdot ${c1} \\cdot ${c2}} = \\frac{${N * diff * diff}}{${prod}} \\approx ${dec(ans)}`)}`,
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
      {
        id: "the-distribution-of-the-maximum-and-minimum",
        title: t("The distribution of the maximum and the minimum", "最大值与最小值的分布"),
        explanation: t(
          "The largest of $n$ independent values is at most $x$ exactly when every value is at most $x$, and the smallest exceeds $x$ exactly when every value exceeds $x$. With a common CDF $F$:\n\n$$P(X_{(n)} \\le x) = F(x)^{n}, \\qquad P(X_{(1)} > x) = \\big(1 - F(x)\\big)^{n}.$$\n\nFor $\\text{Uniform}(0, 1)$, $F(x) = x$: the maximum of $3$ values is at most $\\frac{1}{2}$ with probability $\\frac{1}{8}$, and the minimum is at most $\\frac{1}{2}$ with probability $1 - \\frac{1}{8} = \\frac{7}{8}$.",
          "$n$ 个独立值中的最大值不超过 $x$，当且仅当每个值都不超过 $x$；最小值大于 $x$，当且仅当每个值都大于 $x$。设共同的分布函数为 $F$：\n\n$$P(X_{(n)} \\le x) = F(x)^{n}, \\qquad P(X_{(1)} > x) = \\big(1 - F(x)\\big)^{n}.$$\n\n对 $\\text{Uniform}(0, 1)$，$F(x) = x$：$3$ 个值的最大值不超过 $\\frac{1}{2}$ 的概率为 $\\frac{1}{8}$，最小值不超过 $\\frac{1}{2}$ 的概率为 $1 - \\frac{1}{8} = \\frac{7}{8}$。",
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
          const event = `X_{(${isMax ? n : 1})} ${below ? "\\le" : ">"} ${x.toLatex()}`;
          const line = isMax
            ? `P(X_{(${n})} \\le ${x.toLatex()}) = \\left(${x.toLatex()}\\right)^{${n}} = ${up.toLatex()}`
            : `P(X_{(1)} > ${x.toLatex()}) = \\left(1 - ${x.toLatex()}\\right)^{${n}} = ${down.toLatex()}`;
          const flip = (isMax && !below) || (!isMax && below);
          return numberProblem({
            prompt: t(
              `$X_1, \\dots, X_{${n}}$ are independent $\\text{Uniform}(0, 1)$ variables. Find $P(${event})$.`,
              `$X_1, \\dots, X_{${n}}$ 是相互独立的 $\\text{Uniform}(0, 1)$ 随机变量。求 $P(${event})$。`,
            ),
            answer: ans,
            wrong: [up, down, Q.one.sub(up), Q.one.sub(down), x.mul(Q.of(n))].filter((w) => w.cmp(Q.one) <= 0),
            solution: t(
              `The ${isMax ? "maximum is at most" : "minimum exceeds"} $${x.toLatex()}$ exactly when every $X_i$ ${isMax ? "is" : "does"}:${steps(line)}${flip ? `The event asked for is the complement, so the answer is $1 - ${(isMax ? up : down).toLatex()} = ${ans.toLatex()}$.` : ""}`,
              `${isMax ? "最大值不超过" : "最小值大于"} $${x.toLatex()}$，当且仅当每个 $X_i$ 都${isMax ? "不超过" : "大于"}它：${steps(line)}${flip ? `所求事件是它的对立事件，所以答案为 $1 - ${(isMax ? up : down).toLatex()} = ${ans.toLatex()}$。` : ""}`,
            ),
          });
        },
      },
    ],
  },
];
