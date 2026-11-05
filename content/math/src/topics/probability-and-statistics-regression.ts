import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { numberProblem } from "../problems.ts";

/** tCritical975 maps degrees of freedom to t_{0.025, df} in thousandths. */
const tCritical975: Readonly<Record<number, number>> = {
  6: 2447,
  7: 2365,
  8: 2306,
  9: 2262,
  10: 2228,
  11: 2201,
  12: 2179,
  13: 2160,
  14: 2145,
  15: 2131,
  16: 2120,
  17: 2110,
  18: 2101,
  19: 2093,
  20: 2086,
};

/** regressionInterval builds a 95% interval problem for a regression coefficient from its estimate and standard error, in hundredths. */
function regressionInterval(
  rng: Rng,
  name: Text,
  symbol: string,
  estimate100: number,
  se100: number,
  sePrompt: Text,
  seStep: Text,
): Problem {
  const n = rng.int(9, 21);
  const df = n - 2;
  const tc = Q.of(tCritical975[df]!, 1000);
  const wrongT = Q.of(tCritical975[df + 1]!, 1000);
  const est = Q.of(estimate100, 100);
  const se = Q.of(se100, 100);
  const margin = tc.mul(se);
  const upper = rng.bool();
  const pick = (m: Q) => (upper ? est.add(m) : est.sub(m));
  const answer = pick(margin);
  const end = upper ? t("upper", "上") : t("lower", "下");
  const table = [df - 1, df, df + 1].map((d) => `t_{0.025,\\,${d}} = ${dec(Q.of(tCritical975[d]!, 1000))}`).join(", \\quad ");
  return numberProblem({
    prompt: t(
      `A simple linear regression on $n = ${n}$ points gives ${name.en} $${symbol} = ${dec(est)}$ ${sePrompt.en}. Using $${table}$, find the ${end.en} endpoint of the $95\\%$ confidence interval for the population ${name.en}.`,
      `对 $n = ${n}$ 个点作简单线性回归，得到${name["zh-CN"]} $${symbol} = ${dec(est)}$，${sePrompt["zh-CN"]}。利用 $${table}$，求总体${name["zh-CN"]}的 $95\\%$ 置信区间的${end["zh-CN"]}端点。`,
    ),
    answer,
    form: "decimal",
    wrong: [pick(wrongT.mul(se)), pick(Q.of(196, 100).mul(se)), pick(se), upper ? est.sub(margin) : est.add(margin)],
    solution: t(
      `${seStep.en}The interval uses $n - 2 = ${df}$ degrees of freedom, so $t^* = ${dec(tc)}$ and the margin is $${dec(tc)} \\times ${dec(se)} = ${dec(margin)}$. The ${end.en} endpoint is $${dec(est)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(answer)}$.`,
      `${seStep["zh-CN"]}区间使用 $n - 2 = ${df}$ 个自由度，所以 $t^* = ${dec(tc)}$，误差范围为 $${dec(tc)} \\times ${dec(se)} = ${dec(margin)}$。${end["zh-CN"]}端点为 $${dec(est)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(answer)}$。`,
    ),
  });
}

/** Topics for Unit 9: Regression (new topics). */
export const probabilityAndStatisticsRegressionTopics: TopicDef[] = [
  // 9.31.4 Spearman's Rank Correlation Coefficient
  {
    id: "spearmans-rank-correlation-coefficient",
    title: t("Spearman's Rank Correlation Coefficient", "斯皮尔曼等级相关系数"),
    summary: t(
      "Spearman's rank correlation coefficient $r_s$ measures monotonic association by computing Pearson's correlation on ranks: $r_s = 1 - \\frac{6\\sum d_i^2}{n(n^2 - 1)}$, where $d_i = \\operatorname{rank}(x_i) - \\operatorname{rank}(y_i)$.",
      "斯皮尔曼等级相关系数 $r_s$ 对秩计算皮尔逊相关系数，衡量两个变量的单调相关性：$r_s = 1 - \\frac{6\\sum d_i^2}{n(n^2 - 1)}$，其中 $d_i = \\operatorname{rank}(x_i) - \\operatorname{rank}(y_i)$。",
    ),
    prerequisites: ["the-linear-correlation-coefficient"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-spearmans-rank-correlation",
        title: t("Computing Spearman's rank correlation coefficient", "计算斯皮尔曼等级相关系数"),
        explanation: t(
          "Spearman's coefficient replaces the data by their ranks, so it measures whether the variables move in the same order rather than along a straight line. When there are no tied ranks, $r_s = 1 - \\frac{6 \\sum_i d_i^2}{n(n^2 - 1)}$.",
          "斯皮尔曼系数用秩代替数据，所以它衡量的是变量是否按相同的顺序变化，而不是是否沿直线变化。当没有并列秩时，$r_s = 1 - \\frac{6 \\sum_i d_i^2}{n(n^2 - 1)}$。",
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
              `A sample of $n = ${n}$ items was ranked on two criteria, producing the corresponding rank pairs $(R(X_i), R(Y_i))$: ${pairsStr}. Assuming no tied ranks, calculate the exact rational value of Spearman's rank correlation coefficient $r_s$.`,
              `对 $n = ${n}$ 个样本按两项指标进行排序，得到相应的等级配对 $(R(X_i), R(Y_i))$ 为：${pairsStr}。假设没有并列秩，计算斯皮尔曼等级相关系数 $r_s$ 的精确有理数值。`,
            ),
            answer: ans,
            wrong: [Q.of(denom + num, denom), Q.of(num, denom), Q.of(n * n * n - 6 * sumDSq, n * n * n)],
            solution: t(
              `The rank differences $d_i$ are $${diffs.join(", ")}$. The sum of squared differences is $\\sum d_i^2 = ${sumDSq}$. With $n = ${n}$, the denominator is $n(n^2 - 1) = ${n}(${n * n - 1}) = ${denom}$. Thus $r_s = 1 - \\frac{6(${sumDSq})}{${denom}} = 1 - \\frac{${num}}{${denom}} = ${ans.toLatex()}$.`,
              `等级差 $d_i$ 分别为 $${diffs.join(", ")}$。差值平方和为 $\\sum d_i^2 = ${sumDSq}$。当 $n = ${n}$ 时，分母为 $n(n^2 - 1) = ${n}(${n * n - 1}) = ${denom}$。因此 $r_s = 1 - \\frac{6(${sumDSq})}{${denom}} = 1 - \\frac{${num}}{${denom}} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
      {
        id: "ranking-raw-data-for-spearman",
        title: t("Ranking raw data before computing $r_s$", "先对原始数据排序再计算 $r_s$"),
        explanation: t(
          "With raw measurements, first replace each value by its rank within its own variable, giving rank $1$ to the smallest. Then subtract the ranks pair by pair and use $r_s = 1 - \\frac{6 \\sum d_i^2}{n(n^2 - 1)}$.\n\nFor the pairs $(12, 40), (30, 35), (18, 50), (25, 45)$, the $x$-ranks are $1, 4, 2, 3$ and the $y$-ranks are $2, 1, 4, 3$. The differences are $-1, 3, -2, 0$, so $\\sum d_i^2 = 14$ and $r_s = 1 - \\frac{84}{60} = -\\frac{2}{5}$. The values themselves never enter the formula, only their order.",
          "对于原始测量值，先把每个值替换为它在本变量中的等级，最小的记为 $1$。然后逐对相减求等级差，再用 $r_s = 1 - \\frac{6 \\sum d_i^2}{n(n^2 - 1)}$。\n\n对于数对 $(12, 40), (30, 35), (18, 50), (25, 45)$，$x$ 的等级为 $1, 4, 2, 3$，$y$ 的等级为 $2, 1, 4, 3$。等级差为 $-1, 3, -2, 0$，所以 $\\sum d_i^2 = 14$，$r_s = 1 - \\frac{84}{60} = -\\frac{2}{5}$。公式中只用到数值的大小顺序，而不用数值本身。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 6);
          const xs = rng.sample(
            Array.from({ length: 60 }, (_, i) => i + 10),
            n,
          );
          const ys = rng.sample(
            Array.from({ length: 60 }, (_, i) => i + 20),
            n,
          );
          const rank = (vs: readonly number[], v: number) => 1 + vs.filter((w) => w < v).length;
          const rx = xs.map((v) => rank(xs, v));
          const ry = ys.map((v) => rank(ys, v));
          const d = rx.map((r, i) => r - ry[i]!);
          const sumSq = d.reduce((s, v) => s + v * v, 0);
          const denom = n * (n * n - 1);
          const answer = Q.of(denom - 6 * sumSq, denom);
          const pairs = xs.map((x, i) => `(${x}, ${ys[i]})`).join(", ");
          return numberProblem({
            prompt: t(
              `The paired measurements $(x_i, y_i)$ are $${pairs}$. Rank each variable from smallest ($1$) to largest and compute Spearman's rank correlation coefficient $r_s$ exactly.`,
              `成对测量值 $(x_i, y_i)$ 为 $${pairs}$。把每个变量从小（$1$）到大排出等级，并精确计算斯皮尔曼等级相关系数 $r_s$。`,
            ),
            answer,
            wrong: [answer.neg(), Q.of(6 * sumSq, denom), Q.of(n * n * n - 6 * sumSq, n * n * n)],
            solution: t(
              `The $x$-ranks are $${rx.join(", ")}$ and the $y$-ranks are $${ry.join(", ")}$, so $d_i = ${d.join(", ")}$ and $\\sum d_i^2 = ${sumSq}$. Then $r_s = 1 - \\frac{6(${sumSq})}{${n}(${n * n - 1})} = ${answer.toLatex()}$.`,
              `$x$ 的等级为 $${rx.join(", ")}$，$y$ 的等级为 $${ry.join(", ")}$，所以 $d_i = ${d.join(", ")}$，$\\sum d_i^2 = ${sumSq}$。于是 $r_s = 1 - \\frac{6(${sumSq})}{${n}(${n * n - 1})} = ${answer.toLatex()}$。`,
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
      "A $100(1 - \\alpha)\\%$ confidence interval for the population slope $\\beta_1$ is $b_1 \\pm t_{\\alpha/2, n-2}\\, s_{b_1}$, where the standard error of the slope is $s_{b_1} = \\frac{s_e}{\\sqrt{S_{xx}}}$.",
      "总体回归斜率 $\\beta_1$ 的 $100(1 - \\alpha)\\%$ 置信区间为 $b_1 \\pm t_{\\alpha/2, n-2}\\, s_{b_1}$，其中斜率的标准误为 $s_{b_1} = \\frac{s_e}{\\sqrt{S_{xx}}}$。",
    ),
    prerequisites: ["linear-regression", "confidence-intervals-for-one-mean-unknown-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-regression-slope-standard-error",
        title: t("Computing standard error of the regression slope", "计算回归斜率的标准误差"),
        explanation: t(
          "The slope is estimated more precisely when the residuals are small and when the inputs are spread out widely. The standard error of the slope is $s_{b_1} = \\frac{s_e}{\\sqrt{S_{xx}}}$.",
          "当残差较小且自变量分布得很开时，斜率的估计更精确。斜率的标准误差为 $s_{b_1} = \\frac{s_e}{\\sqrt{S_{xx}}}$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 10);
          const sxx = k * k; // sqrt(Sxx) = k
          const se = rng.int(2, 25);
          const ans = Q.of(se, k);

          return numberProblem({
            prompt: t(
              `In a simple linear regression analysis with $n$ data points, the residual standard error is $s_e = ${se}$ and the sum of squared deviations for the predictor variable is $S_{xx} = \\sum (x_i - \\bar{x})^2 = ${sxx}$. Calculate the exact rational value of the standard error of the slope $s_{b_1}$.`,
              `在样本量为 $n$ 的一元线性回归分析中，残差标准误差为 $s_e = ${se}$，自变量的离差平方和为 $S_{xx} = \\sum (x_i - \\bar{x})^2 = ${sxx}$。计算斜率标准误差 $s_{b_1}$ 的精确有理数值。`,
            ),
            answer: ans,
            wrong: [Q.of(se, sxx), Q.of(se * se, sxx), se * k],
            solution: t(
              `$s_{b_1} = \\frac{s_e}{\\sqrt{S_{xx}}} = \\frac{${se}}{\\sqrt{${sxx}}} = \\frac{${se}}{${k}} = ${ans.toLatex()}$.`,
              `$s_{b_1} = \\frac{s_e}{\\sqrt{S_{xx}}} = \\frac{${se}}{\\sqrt{${sxx}}} = \\frac{${se}}{${k}} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
      {
        id: "building-a-slope-interval",
        title: t("Building the confidence interval for the slope", "构造斜率的置信区间"),
        explanation: t(
          "The interval is the estimate plus or minus a critical value times the standard error, $b_1 \\pm t^*\\, s_{b_1}$. Two parameters, the slope and the intercept, are estimated from the data, so the critical value comes from the $t$ distribution with $n - 2$ degrees of freedom, not $n - 1$.\n\nWith $n = 12$, $b_1 = 3.4$ and $s_{b_1} = 0.5$, a $95\\%$ interval uses $t_{0.025,\\,10} = 2.228$: the margin is $2.228 \\times 0.5 = 1.114$, so the interval is $(2.286,\\ 4.514)$.",
          "区间是估计值加减临界值乘以标准误差，即 $b_1 \\pm t^*\\, s_{b_1}$。由于从数据中估计了斜率和截距两个参数，临界值取自自由度为 $n - 2$（而不是 $n - 1$）的 $t$ 分布。\n\n若 $n = 12$，$b_1 = 3.4$，$s_{b_1} = 0.5$，则 $95\\%$ 区间使用 $t_{0.025,\\,10} = 2.228$：误差范围为 $2.228 \\times 0.5 = 1.114$，区间为 $(2.286,\\ 4.514)$。",
        ),
        generate: (rng: Rng): Problem => {
          const se100 = rng.int(5, 60);
          const se = dec(Q.of(se100, 100));
          return regressionInterval(
            rng,
            t("slope", "斜率"),
            "b_1",
            rng.pick([-1, 1]) * rng.int(5, 90) * 10,
            se100,
            t(`with standard error $s_{b_1} = ${se}$`, `斜率的标准误差为 $s_{b_1} = ${se}$`),
            t("", ""),
          );
        },
      },
    ],
  },

  // 9.31.6 Confidence Intervals for Linear Regression Intercept Parameters
  {
    id: "confidence-intervals-for-linear-regression-intercept-parameters",
    title: t("Confidence Intervals for Linear Regression Intercept Parameters", "线性回归截距参数的置信区间"),
    summary: t(
      "A $100(1 - \\alpha)\\%$ confidence interval for the intercept $\\beta_0$ is $b_0 \\pm t_{\\alpha/2, n-2}\\, s_{b_0}$, where $s_{b_0}^2 = s_e^2\\left(\\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}}\\right)$.",
      "回归截距 $\\beta_0$ 的 $100(1 - \\alpha)\\%$ 置信区间为 $b_0 \\pm t_{\\alpha/2, n-2}\\, s_{b_0}$，其中 $s_{b_0}^2 = s_e^2\\left(\\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}}\\right)$。",
    ),
    prerequisites: ["confidence-intervals-for-linear-regression-slope-parameters"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-regression-intercept-variance",
        title: t("Computing squared standard error of the regression intercept", "计算回归截距的标准误差平方"),
        explanation: t(
          "The intercept is uncertain both because of the average level and because of the slope, so its variance grows when the mean input is far from zero. The estimated variance of the intercept is $s_{b_0}^2 = s_e^2 \\left(\\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}}\\right)$.",
          "截距的不确定性既来自平均水平，也来自斜率，所以当自变量的均值离零很远时，它的方差会增大。截距的方差估计为 $s_{b_0}^2 = s_e^2 \\left(\\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}}\\right)$。",
        ),
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
              `A simple linear regression fitted to $n = ${n}$ points has sample mean $\\bar{x} = ${xBar}$, predictor sum of squares $S_{xx} = ${sxx}$, and mean square error $s_e^2 = ${seSq}$. Compute the exact rational value of the squared standard error of the intercept $s_{b_0}^2$.`,
              `对 $n = ${n}$ 个数据点拟合的一元线性回归中，自变量样本均值为 $\\bar{x} = ${xBar}$，自变量离差平方和为 $S_{xx} = ${sxx}$，残差均方为 $s_e^2 = ${seSq}$。计算截距的标准误差平方 $s_{b_0}^2$ 的精确有理数值。`,
            ),
            answer: ans,
            wrong: [Q.of(seSq, n), inner, Q.of(seSq * xBar * xBar, sxx)],
            solution: t(
              `$\\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}} = \\frac{1}{${n}} + \\frac{${xBar * xBar}}{${sxx}} = ${inner.toLatex()}$. Multiplying by $s_e^2 = ${seSq}$ gives $s_{b_0}^2 = ${seSq} \\times ${inner.toLatex()} = ${ans.toLatex()}$.`,
              `$\\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}} = \\frac{1}{${n}} + \\frac{${xBar * xBar}}{${sxx}} = ${inner.toLatex()}$。乘以 $s_e^2 = ${seSq}$ 得到 $s_{b_0}^2 = ${seSq} \\times ${inner.toLatex()} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
      {
        id: "building-an-intercept-interval",
        title: t("Building the confidence interval for the intercept", "构造截距的置信区间"),
        explanation: t(
          "The interval for the intercept has the same shape as the one for the slope, $b_0 \\pm t^*\\, s_{b_0}$ with $n - 2$ degrees of freedom. The formula for the intercept gives the squared standard error $s_{b_0}^2$, so take its square root before multiplying by the critical value.\n\nWith $n = 15$, $b_0 = 12.5$ and $s_{b_0}^2 = 1.44$: $s_{b_0} = 1.2$ and $t_{0.025,\\,13} = 2.160$, so the margin is $2.592$ and the $95\\%$ interval is $(9.908,\\ 15.092)$.",
          "截距的区间与斜率的形式相同，即 $b_0 \\pm t^*\\, s_{b_0}$，自由度为 $n - 2$。截距的公式给出的是标准误差的平方 $s_{b_0}^2$，所以要先开平方，再乘以临界值。\n\n若 $n = 15$，$b_0 = 12.5$，$s_{b_0}^2 = 1.44$：则 $s_{b_0} = 1.2$，$t_{0.025,\\,13} = 2.160$，误差范围为 $2.592$，$95\\%$ 区间为 $(9.908,\\ 15.092)$。",
        ),
        generate: (rng: Rng): Problem => {
          const se10 = rng.int(3, 25);
          const variance = dec(Q.of(se10 * se10, 100));
          const se = dec(Q.of(se10, 10));
          return regressionInterval(
            rng,
            t("intercept", "截距"),
            "b_0",
            rng.pick([-1, 1]) * rng.int(10, 400) * 10,
            se10 * 10,
            t(`with squared standard error $s_{b_0}^2 = ${variance}$`, `截距标准误差的平方为 $s_{b_0}^2 = ${variance}$`),
            t(`First $s_{b_0} = \\sqrt{${variance}} = ${se}$. `, `先求 $s_{b_0} = \\sqrt{${variance}} = ${se}$。`),
          );
        },
      },
    ],
  },
];
