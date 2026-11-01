import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { numberProblem } from "../problems.ts";

/** Topics for Unit 9: Regression (new topics). */
export const probabilityAndStatisticsRegressionTopics: TopicDef[] = [
  // 9.31.4 Spearman's Rank Correlation Coefficient
  {
    id: "spearmans-rank-correlation-coefficient",
    title: t("Spearman's Rank Correlation Coefficient", "斯皮尔曼等级相关系数"),
    summary: t(
      "Spearman's rank correlation coefficient r_s measures monotonic association between two variables by evaluating Pearson's correlation on ranks: r_s = 1 - (6 ∑ d_i^2) / (n(n^2 - 1)), where d_i = rank(x_i) - rank(y_i).",
      "斯皮尔曼等级相关系数 r_s 通过对秩计算皮尔逊相关系数来衡量两个变量之间的单调相关性：r_s = 1 - (6 ∑ d_i^2) / (n(n^2 - 1))，其中 d_i = rank(x_i) - rank(y_i)。",
    ),
    prerequisites: ["the-linear-correlation-coefficient"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-spearmans-rank-correlation",
        title: t("Computing Spearman's rank correlation coefficient", "计算斯皮尔曼等级相关系数"),
        explanation: t(
          "When there are no tied ranks, r_s = 1 - 6 ∑ d_i^2 / (n(n^2 - 1)).",
          "当没有结线（并列秩）时，r_s = 1 - 6 ∑ d_i^2 / (n(n^2 - 1))。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 7);
          // generate ranks for x: 1..n
          const rx = Array.from({ length: n }, (_, i) => i + 1);
          // shuffle ranks for y
          const ry = rng.shuffle(rx);

          let sumDSq = 0;
          const diffs: number[] = [];
          for (let i = 0; i < n; i++) {
            const d = rx[i]! - ry[i]!;
            diffs.push(d);
            sumDSq += d * d;
          }

          const denom = n * (n * n - 1);
          const num = 6 * sumDSq;
          // r_s = 1 - (6 * sumDSq) / denom = (denom - num) / denom
          const ans = Q.of(denom - num, denom);

          const pairsStr = rx.map((x, i) => `(${x}, ${ry[i]})`).join(", ");

          return numberProblem({
            prompt: t(
              `A sample of $n = ${n}$ items was ranked on two criteria, producing the corresponding rank pairs $(R(X_i), R(Y_i))$: ${pairsStr}. Assuming no tied ranks, calculate the exact rational value of Spearman's rank correlation coefficient $r_s = 1 - \\frac{6 \\sum_{i=1}^n d_i^2}{n(n^2 - 1)}$, where $d_i = R(X_i) - R(Y_i)$.`,
              `对 $n = ${n}$ 个样本按两项指标进行排序，得到相应的等级配对 $(R(X_i), R(Y_i))$ 为：${pairsStr}。假设没有并列秩，计算斯皮尔曼等级相关系数 $r_s = 1 - \\frac{6 \\sum_{i=1}^n d_i^2}{n(n^2 - 1)}$ 的精确有理数值，其中 $d_i = R(X_i) - R(Y_i)$。`,
            ),
            answer: ans,
            solution: t(
              `The rank differences $d_i$ are $${diffs.join(", ")}$. The sum of squared differences is $\\sum d_i^2 = ${sumDSq}$. With $n = ${n}$, the denominator is $n(n^2 - 1) = ${n}(${n * n - 1}) = ${denom}$. Thus $r_s = 1 - \\frac{6(${sumDSq})}{${denom}} = 1 - \\frac{${num}}{${denom}} = ${ans.toLatex()}$.`,
              `等级差 $d_i$ 分别为 $${diffs.join(", ")}$。差值平方和为 $\\sum d_i^2 = ${sumDSq}$。当 $n = ${n}$ 时，分母为 $n(n^2 - 1) = ${n}(${n * n - 1}) = ${denom}$。因此 $r_s = 1 - \\frac{6(${sumDSq})}{${denom}} = 1 - \\frac{${num}}{${denom}} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },

  // 9.31.5 Confidence Intervals for Linear Regression Slope Parameters
  {
    id: "confidence-intervals-for-linear-regression-slope-parameters",
    title: t("Confidence Intervals for Linear Regression Slope Parameters", "线性回归斜率参数的置信区间"),
    summary: t(
      "A 100(1 - α)% confidence interval for the population regression slope β_1 is b_1 ± t_{α/2, n-2} s_{b_1}, where the standard error of the slope is s_{b_1} = s_e / √S_{xx}.",
      "总体回归斜率 β_1 的 100(1 - α)% 置信区间为 b_1 ± t_{α/2, n-2} s_{b_1}，其中斜率的标准误差为 s_{b_1} = s_e / √S_{xx}。",
    ),
    prerequisites: ["linear-regression", "confidence-intervals-for-one-mean-unknown-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-regression-slope-standard-error",
        title: t("Computing standard error of the regression slope", "计算回归斜率的标准误差"),
        explanation: t("s_{b_1} = s_e / √S_{xx}.", "s_{b_1} = s_e / √S_{xx}。"),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 10);
          const sxx = k * k; // sqrt(Sxx) = k
          const se = rng.int(2, 25);
          const ans = Q.of(se, k);

          return numberProblem({
            prompt: t(
              `In a simple linear regression analysis with $n$ data points, the residual standard error is $s_e = ${se}$ and the sum of squared deviations for the predictor variable is $S_{xx} = \\sum (x_i - \\bar{x})^2 = ${sxx}$. Calculate the exact rational value of the standard error of the slope $s_{b_1} = \\frac{s_e}{\\sqrt{S_{xx}}}$.`,
              `在样本量为 $n$ 的一元线性回归分析中，残差标准误差为 $s_e = ${se}$，自变量的离差平方和为 $S_{xx} = \\sum (x_i - \\bar{x})^2 = ${sxx}$。计算斜率标准误差 $s_{b_1} = \\frac{s_e}{\\sqrt{S_{xx}}}$ 的精确有理数值。`,
            ),
            answer: ans,
            solution: t(
              `$s_{b_1} = \\frac{s_e}{\\sqrt{S_{xx}}} = \\frac{${se}}{\\sqrt{${sxx}}} = \\frac{${se}}{${k}} = ${ans.toLatex()}$.`,
              `$s_{b_1} = \\frac{s_e}{\\sqrt{S_{xx}}} = \\frac{${se}}{\\sqrt{${sxx}}} = \\frac{${se}}{${k}} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },

  // 9.31.6 Confidence Intervals for Linear Regression Intercept Parameters
  {
    id: "confidence-intervals-for-linear-regression-intercept-parameters",
    title: t("Confidence Intervals for Linear Regression Intercept Parameters", "线性回归截距参数的置信区间"),
    summary: t(
      "A 100(1 - α)% confidence interval for the regression intercept β_0 is b_0 ± t_{α/2, n-2} s_{b_0}, where the squared standard error of the intercept is s_{b_0}^2 = s_e^2 (1/n + x̄^2 / S_{xx}).",
      "回归截距 β_0 的 100(1 - α)% 置信区间为 b_0 ± t_{α/2, n-2} s_{b_0}，其中截距的方差估计为 s_{b_0}^2 = s_e^2 (1/n + x̄^2 / S_{xx})。",
    ),
    prerequisites: ["confidence-intervals-for-linear-regression-slope-parameters"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-regression-intercept-variance",
        title: t("Computing squared standard error of the regression intercept", "计算回归截距的标准误差平方"),
        explanation: t("s_{b_0}^2 = s_e^2 (1/n + x̄^2 / S_{xx}).", "s_{b_0}^2 = s_e^2 (1/n + x̄^2 / S_{xx})。"),
        generate: (rng: Rng): Problem => {
          const n = rng.int(6, 30);
          const xBar = rng.int(1, 10);
          const sxx = rng.int(20, 100);
          const seSq = rng.int(4, 50);

          // factor = 1/n + xBar^2 / sxx
          const inner = Q.of(1, n).add(Q.of(xBar * xBar, sxx));
          const ans = inner.mul(Q.of(seSq));

          return numberProblem({
            prompt: t(
              `A simple linear regression fitted to $n = ${n}$ points has sample mean $\\bar{x} = ${xBar}$, predictor sum of squares $S_{xx} = ${sxx}$, and mean square error $s_e^2 = ${seSq}$. Compute the exact rational value of the squared standard error of the intercept $s_{b_0}^2 = s_e^2 \\left( \\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}} \\right)$.`,
              `对 $n = ${n}$ 个数据点拟合的一元线性回归中，自变量样本均值为 $\\bar{x} = ${xBar}$，自变量离差平方和为 $S_{xx} = ${sxx}$，残差均方为 $s_e^2 = ${seSq}$。计算截距的标准误差平方 $s_{b_0}^2 = s_e^2 \\left( \\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}} \\right)$ 的精确有理数值。`,
            ),
            answer: ans,
            solution: t(
              `$\\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}} = \\frac{1}{${n}} + \\frac{${xBar * xBar}}{${sxx}} = ${inner.toLatex()}$. Multiplying by $s_e^2 = ${seSq}$ gives $s_{b_0}^2 = ${seSq} \\times ${inner.toLatex()} = ${ans.toLatex()}$.`,
              `$\\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}} = \\frac{1}{${n}} + \\frac{${xBar * xBar}}{${sxx}} = ${inner.toLatex()}$。乘以 $s_e^2 = ${seSq}$ 得到 $s_{b_0}^2 = ${seSq} \\times ${inner.toLatex()} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },
];
