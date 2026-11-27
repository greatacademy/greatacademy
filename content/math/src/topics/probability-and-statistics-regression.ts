import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** Mistake is a value a typical mistake produces, with what to say about it. */
type Mistake = ReturnType<typeof why>;

/** asQ reads a value as an exact number. */
const asQ = (v: Mistake["value"]) => (v instanceof Q ? v : Q.of(v));

/** distinct keeps the mistakes that differ from the answer, each value once. */
const distinct = (answer: Mistake["value"], ms: readonly Mistake[]): Mistake[] =>
  ms.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && ms.findIndex((o) => asQ(o.value).eq(asQ(m.value))) === i);

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

/** regressionInterval builds a 95% interval problem for a regression coefficient from its estimate and standard error, in hundredths; squared says the prompt gives the squared standard error. */
function regressionInterval(
  rng: Rng,
  name: Text,
  symbol: string,
  estimate100: number,
  se100: number,
  sePrompt: Text,
  squared: boolean,
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
  const variance = dec(se.mul(se));
  const rootStep: [[string, string], Text][] = squared
    ? [
        [
          ["Take the square root", "开平方"],
          t(`$s_{b_0} = \\sqrt{${variance}} = ${dec(se)}$.`, `$s_{b_0} = \\sqrt{${variance}} = ${dec(se)}$。`),
        ],
      ]
    : [];
  return numberProblem({
    prompt: t(
      `A simple linear regression on $n = ${n}$ points gives ${name.en} $${symbol} = ${dec(est)}$ ${sePrompt.en}. Using $${table}$, find the ${end.en} endpoint of the $95\\%$ confidence interval for the population ${name.en}.`,
      `对 $n = ${n}$ 个点作简单线性回归，得到${name["zh-CN"]} $${symbol} = ${dec(est)}$，${sePrompt["zh-CN"]}。利用 $${table}$，求总体${name["zh-CN"]}的 $95\\%$ 置信区间的${end["zh-CN"]}端点。`,
    ),
    answer,
    form: "decimal",
    mistakes: distinct(answer, [
      why(
        pick(wrongT.mul(se)),
        `That uses $t_{0.025,\\,${df + 1}}$, with $n - 1$ degrees of freedom; a regression estimates two parameters, so it has $n - 2 = ${df}$.`,
        `那用的是 $t_{0.025,\\,${df + 1}}$，即 $n - 1$ 个自由度；回归估计了两个参数，所以自由度是 $n - 2 = ${df}$。`,
      ),
      why(
        pick(Q.of(196, 100).mul(se)),
        "That uses the normal value $1.96$; the standard error is estimated, so the critical value comes from the $t$ distribution.",
        "那用的是正态分布的 $1.96$；标准误差是估计出来的，所以临界值要取自 $t$ 分布。",
      ),
      why(
        pick(se),
        "That adds only one standard error; the margin is the critical value times the standard error.",
        "那只加减了一个标准误差；误差范围是临界值乘以标准误差。",
      ),
      ...(squared
        ? [
            why(
              pick(tc.mul(se.mul(se))),
              "That multiplies the squared standard error by $t^*$; take the square root first.",
              "那是用标准误差的平方乘以 $t^*$；要先开平方。",
            ),
          ]
        : []),
      why(
        upper ? est.sub(margin) : est.add(margin),
        `That is the ${upper ? "lower" : "upper"} endpoint; the question asks for the ${end.en} one.`,
        `那是${upper ? "下" : "上"}端点；题目求的是${end["zh-CN"]}端点。`,
      ),
    ]),
    solution: walked(
      [
        ...rootStep,
        [
          ["Find the critical value", "求临界值"],
          t(
            `The interval uses $n - 2 = ${df}$ degrees of freedom, so $t^* = ${dec(tc)}$.`,
            `区间使用 $n - 2 = ${df}$ 个自由度，所以 $t^* = ${dec(tc)}$。`,
          ),
        ],
        [
          ["Find the margin", "求误差范围"],
          t(`$${dec(tc)} \\times ${dec(se)} = ${dec(margin)}$.`, `$${dec(tc)} \\times ${dec(se)} = ${dec(margin)}$。`),
        ],
        [
          [`Find the ${end.en} endpoint`, `求${end["zh-CN"]}端点`],
          t(
            `$${dec(est)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(answer)}$.`,
            `$${dec(est)} ${upper ? "+" : "-"} ${dec(margin)} = ${dec(answer)}$。`,
          ),
        ],
      ],
      t(
        `$${dec(answer)} ${upper ? "-" : "+"} ${dec(margin)} = ${dec(est)}$ returns to the estimate at the center of the interval.`,
        `$${dec(answer)} ${upper ? "-" : "+"} ${dec(margin)} = ${dec(est)}$ 回到区间中心的估计值。`,
      ),
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
    intro: t(
      "Five students are ranked in mathematics and in physics, giving the rank pairs $(1, 2), (2, 1), (3, 3), (4, 5), (5, 4)$. The differences are $-1, 1, 0, -1, 1$, so $\\sum d_i^2 = 4$ and $r_s = 1 - \\frac{6(4)}{5(24)} = 1 - \\frac{24}{120} = 0.8$: the two orders almost agree.\n\nCheck: the differences $-1, 1, 0, -1, 1$ add to $0$, as rank differences must.\n\nIn this lesson we compute $r_s$ from rank pairs, rank raw data before computing it and find the squared rank differences of reversed rankings.",
      "五名学生按数学和物理分别排出等级，得到等级对 $(1, 2), (2, 1), (3, 3), (4, 5), (5, 4)$。等级差为 $-1, 1, 0, -1, 1$，所以 $\\sum d_i^2 = 4$，$r_s = 1 - \\frac{6(4)}{5(24)} = 1 - \\frac{24}{120} = 0.8$：两种顺序几乎一致。\n\n检验：等级差 $-1, 1, 0, -1, 1$ 之和为 $0$，等级差理应如此。\n\n本课我们由等级对计算 $r_s$，先对原始数据排出等级再计算它，并求完全相反的两种排序的等级差平方和。",
    ),
    prerequisites: ["the-linear-correlation-coefficient"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-spearmans-rank-correlation",
        title: t("Computing Spearman's rank correlation coefficient", "计算斯皮尔曼等级相关系数"),
        explanation: t(
          "Spearman's coefficient replaces the data by their ranks, so it measures whether the variables move in the same order rather than along a straight line. When there are no tied ranks, $r_s = 1 - \\frac{6 \\sum_i d_i^2}{n(n^2 - 1)}$. For the three pairs $(1, 2), (2, 3), (3, 1)$ the differences are $-1, -1, 2$, so $\\sum d_i^2 = 6$ and $r_s = 1 - \\frac{36}{3(8)} = 1 - \\frac{3}{2} = -\\frac{1}{2}$.\n\n> **Watch out.** Square the differences before adding them, since the plain differences always add to $0$; the denominator is $n(n^2 - 1)$, not $n^3$, and the fraction is subtracted from $1$.",
          "斯皮尔曼系数用秩代替数据，所以它衡量的是变量是否按相同的顺序变化，而不是是否沿直线变化。当没有并列秩时，$r_s = 1 - \\frac{6 \\sum_i d_i^2}{n(n^2 - 1)}$。对于三个等级对 $(1, 2), (2, 3), (3, 1)$，等级差为 $-1, -1, 2$，所以 $\\sum d_i^2 = 6$，$r_s = 1 - \\frac{36}{3(8)} = 1 - \\frac{3}{2} = -\\frac{1}{2}$。\n\n> **注意。** 要先把等级差平方再相加，因为等级差本身之和总是 $0$；分母是 $n(n^2 - 1)$ 而不是 $n^3$，并且要用 $1$ 减去这个分数。",
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
            mistakes: distinct(ans, [
              why(
                Q.of(denom + num, denom),
                "That adds the fraction to $1$; it is subtracted.",
                "那是把分数加到 $1$ 上；应当用 $1$ 减去它。",
              ),
              why(Q.of(num, denom), "That is the fraction alone; $r_s$ is $1$ minus it.", "那只是那个分数；$r_s$ 是 $1$ 减去它。"),
              why(
                Q.of(n * n * n - 6 * sumDSq, n * n * n),
                "That divides by $n^3$; the denominator is $n(n^2 - 1)$.",
                "那除以的是 $n^3$；分母应是 $n(n^2 - 1)$。",
              ),
              why(Q.of(denom - sumDSq, denom), "That leaves out the factor $6$ in the numerator.", "那漏掉了分子中的因子 $6$。"),
            ]),
            solution: walked(
              [
                [
                  ["Square the rank differences", "把等级差平方"],
                  t(
                    `The differences $d_i$ are $${diffs.join(", ")}$, so $\\sum d_i^2 = ${sumDSq}$.`,
                    `等级差 $d_i$ 为 $${diffs.join(", ")}$，所以 $\\sum d_i^2 = ${sumDSq}$。`,
                  ),
                ],
                [
                  ["Find the denominator", "求分母"],
                  t(`$n(n^2 - 1) = ${n}(${n * n - 1}) = ${denom}$.`, `$n(n^2 - 1) = ${n}(${n * n - 1}) = ${denom}$。`),
                ],
                [
                  ["Apply the formula", "代入公式"],
                  t(
                    `$r_s = 1 - \\frac{6(${sumDSq})}{${denom}} = 1 - \\frac{${num}}{${denom}} = ${ans.toLatex()}$.`,
                    `$r_s = 1 - \\frac{6(${sumDSq})}{${denom}} = 1 - \\frac{${num}}{${denom}} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The differences add to $0$, as rank differences must, and $${ans.toLatex()}$ lies between $-1$ and $1$.`,
                `等级差之和为 $0$，等级差理应如此，并且 $${ans.toLatex()}$ 介于 $-1$ 与 $1$ 之间。`,
              ),
            ),
          });
        },
      },
      {
        id: "ranking-raw-data-for-spearman",
        title: t("Ranking raw data before computing $r_s$", "先对原始数据排序再计算 $r_s$"),
        explanation: t(
          "With raw measurements, first replace each value by its rank within its own variable, giving rank $1$ to the smallest. Then subtract the ranks pair by pair and use $r_s = 1 - \\frac{6 \\sum d_i^2}{n(n^2 - 1)}$.\n\nFor the pairs $(12, 40), (30, 35), (18, 50), (25, 45)$, the $x$-ranks are $1, 4, 2, 3$ and the $y$-ranks are $2, 1, 4, 3$. The differences are $-1, 3, -2, 0$, so $\\sum d_i^2 = 14$ and $r_s = 1 - \\frac{84}{60} = -\\frac{2}{5}$. The values themselves never enter the formula, only their order. For the three pairs $(5, 9), (7, 2), (6, 4)$ the $x$-ranks are $1, 3, 2$ and the $y$-ranks are $3, 1, 2$, so the differences are $-2, 2, 0$, $\\sum d_i^2 = 8$ and $r_s = 1 - \\frac{48}{24} = -1$: the orders are exactly reversed.\n\n> **Watch out.** Rank each variable on its own, both from the smallest; ranking one of them from the largest flips the sign of $r_s$.",
          "对于原始测量值，先把每个值替换为它在本变量中的等级，最小的记为 $1$。然后逐对相减求等级差，再用 $r_s = 1 - \\frac{6 \\sum d_i^2}{n(n^2 - 1)}$。\n\n对于数对 $(12, 40), (30, 35), (18, 50), (25, 45)$，$x$ 的等级为 $1, 4, 2, 3$，$y$ 的等级为 $2, 1, 4, 3$。等级差为 $-1, 3, -2, 0$，所以 $\\sum d_i^2 = 14$，$r_s = 1 - \\frac{84}{60} = -\\frac{2}{5}$。公式中只用到数值的大小顺序，而不用数值本身。对于三个数对 $(5, 9), (7, 2), (6, 4)$，$x$ 的等级为 $1, 3, 2$，$y$ 的等级为 $3, 1, 2$，所以等级差为 $-2, 2, 0$，$\\sum d_i^2 = 8$，$r_s = 1 - \\frac{48}{24} = -1$：两种顺序恰好相反。\n\n> **注意。** 每个变量各自排等级，并且都从最小的排起；把其中一个从最大的排起会使 $r_s$ 变号。",
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
            mistakes: distinct(answer, [
              why(
                answer.neg(),
                "That has the opposite sign, as when one variable is ranked from the largest; rank both from the smallest.",
                "那符号相反，就像把一个变量从最大的排起那样；两个变量都要从最小的排起。",
              ),
              why(Q.of(6 * sumSq, denom), "That is the fraction alone; $r_s$ is $1$ minus it.", "那只是那个分数；$r_s$ 是 $1$ 减去它。"),
              why(
                Q.of(n * n * n - 6 * sumSq, n * n * n),
                "That divides by $n^3$; the denominator is $n(n^2 - 1)$.",
                "那除以的是 $n^3$；分母应是 $n(n^2 - 1)$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Rank each variable", "给每个变量排等级"],
                  t(
                    `The $x$-ranks are $${rx.join(", ")}$ and the $y$-ranks are $${ry.join(", ")}$.`,
                    `$x$ 的等级为 $${rx.join(", ")}$，$y$ 的等级为 $${ry.join(", ")}$。`,
                  ),
                ],
                [
                  ["Square the rank differences", "把等级差平方"],
                  t(`$d_i = ${d.join(", ")}$, so $\\sum d_i^2 = ${sumSq}$.`, `$d_i = ${d.join(", ")}$，所以 $\\sum d_i^2 = ${sumSq}$。`),
                ],
                [
                  ["Apply the formula", "代入公式"],
                  t(
                    `$r_s = 1 - \\frac{6(${sumSq})}{${n}(${n * n - 1})} = ${answer.toLatex()}$.`,
                    `$r_s = 1 - \\frac{6(${sumSq})}{${n}(${n * n - 1})} = ${answer.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The differences $${d.join(", ")}$ add to $0$, as rank differences must.`,
                `等级差 $${d.join(", ")}$ 之和为 $0$，等级差理应如此。`,
              ),
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
    intro: t(
      "A regression on $n = 10$ points gives $b_1 = 2.5$, $s_e = 3$ and $S_{xx} = 36$. The standard error of the slope is $s_{b_1} = \\frac{3}{6} = 0.5$, and with $t_{0.025,\\,8} = 2.306$ the margin is $2.306 \\times 0.5 = 1.153$, so the $95\\%$ interval is $(1.347,\\ 3.653)$.\n\nCheck: the midpoint $\\frac{1.347 + 3.653}{2} = 2.5$ is the estimate.\n\nIn this lesson we compute the standard error of the slope, build its confidence interval and find the slope statistic behind the interval.",
      "对 $n = 10$ 个点作回归，得到 $b_1 = 2.5$，$s_e = 3$，$S_{xx} = 36$。斜率的标准误为 $s_{b_1} = \\frac{3}{6} = 0.5$，由 $t_{0.025,\\,8} = 2.306$ 得误差范围为 $2.306 \\times 0.5 = 1.153$，所以 $95\\%$ 区间为 $(1.347,\\ 3.653)$。\n\n检验：中点 $\\frac{1.347 + 3.653}{2} = 2.5$ 正是估计值。\n\n本课我们计算斜率的标准误，构造它的置信区间，并求区间背后的斜率统计量。",
    ),
    prerequisites: ["linear-regression", "confidence-intervals-for-one-mean-unknown-population-variance"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-regression-slope-standard-error",
        title: t("Computing standard error of the regression slope", "计算回归斜率的标准误差"),
        explanation: t(
          "The slope is estimated more precisely when the residuals are small and when the inputs are spread out widely. The standard error of the slope is $s_{b_1} = \\frac{s_e}{\\sqrt{S_{xx}}}$. With $s_e = 30$ and $S_{xx} = 144$, $s_{b_1} = \\frac{30}{12} = \\frac{5}{2}$.\n\n> **Watch out.** Divide by the square root of $S_{xx}$, not by $S_{xx}$ itself, and use $s_e$, not $s_e^2$.",
          "当残差较小且自变量分布得很开时，斜率的估计更精确。斜率的标准误差为 $s_{b_1} = \\frac{s_e}{\\sqrt{S_{xx}}}$。若 $s_e = 30$，$S_{xx} = 144$，则 $s_{b_1} = \\frac{30}{12} = \\frac{5}{2}$。\n\n> **注意。** 要除以 $S_{xx}$ 的平方根，而不是 $S_{xx}$ 本身，并且用 $s_e$ 而不是 $s_e^2$。",
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
            mistakes: distinct(ans, [
              why(Q.of(se, sxx), "That divides by $S_{xx}$; divide by its square root.", "那是除以 $S_{xx}$；应当除以它的平方根。"),
              why(
                Q.of(se * se, sxx),
                "That is $\\frac{s_e^2}{S_{xx}}$, the squared standard error; take its square root.",
                "那是 $\\frac{s_e^2}{S_{xx}}$，即标准误差的平方；还要开平方。",
              ),
              why(se * k, "That multiplies by $\\sqrt{S_{xx}}$; divide by it.", "那是乘以 $\\sqrt{S_{xx}}$；应当除以它。"),
              why(Q.of(k, se), "That is upside down; $s_e$ goes on top.", "那是颠倒了；$s_e$ 应在分子上。"),
            ]),
            solution: walked(
              [
                [["Take the square root of $S_{xx}$", "求 $S_{xx}$ 的平方根"], t(`$\\sqrt{${sxx}} = ${k}$.`, `$\\sqrt{${sxx}} = ${k}$。`)],
                [
                  ["Divide", "相除"],
                  t(`$s_{b_1} = \\frac{${se}}{${k}} = ${ans.toLatex()}$.`, `$s_{b_1} = \\frac{${se}}{${k}} = ${ans.toLatex()}$。`),
                ],
              ],
              t(
                `$${k}\\left(${ans.toLatex()}\\right) = ${se}$ restores $s_e$.`,
                `$${k}\\left(${ans.toLatex()}\\right) = ${se}$ 还原出 $s_e$。`,
              ),
            ),
          });
        },
      },
      {
        id: "building-a-slope-interval",
        title: t("Building the confidence interval for the slope", "构造斜率的置信区间"),
        explanation: t(
          "The interval is the estimate plus or minus a critical value times the standard error, $b_1 \\pm t^*\\, s_{b_1}$. Two parameters, the slope and the intercept, are estimated from the data, so the critical value comes from the $t$ distribution with $n - 2$ degrees of freedom, not $n - 1$.\n\nWith $n = 12$, $b_1 = 3.4$ and $s_{b_1} = 0.5$, a $95\\%$ interval uses $t_{0.025,\\,10} = 2.228$: the margin is $2.228 \\times 0.5 = 1.114$, so the interval is $(2.286,\\ 4.514)$. With $n = 30$, $b_1 = -12$ and $s_{b_1} = 2$, it uses $t_{0.025,\\,28} = 2.048$: the margin is $4.096$ and the interval is $(-16.096,\\ -7.904)$.\n\n> **Watch out.** Use $n - 2$ degrees of freedom, not $n - 1$, and a $t$ value, not the normal $1.96$.",
          "区间是估计值加减临界值乘以标准误差，即 $b_1 \\pm t^*\\, s_{b_1}$。由于从数据中估计了斜率和截距两个参数，临界值取自自由度为 $n - 2$（而不是 $n - 1$）的 $t$ 分布。\n\n若 $n = 12$，$b_1 = 3.4$，$s_{b_1} = 0.5$，则 $95\\%$ 区间使用 $t_{0.025,\\,10} = 2.228$：误差范围为 $2.228 \\times 0.5 = 1.114$，区间为 $(2.286,\\ 4.514)$。若 $n = 30$，$b_1 = -12$，$s_{b_1} = 2$，则使用 $t_{0.025,\\,28} = 2.048$：误差范围为 $4.096$，区间为 $(-16.096,\\ -7.904)$。\n\n> **注意。** 自由度是 $n - 2$ 而不是 $n - 1$，临界值取 $t$ 值而不是正态分布的 $1.96$。",
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
            false,
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
    intro: t(
      "A regression on $n = 10$ points has $b_0 = 4$, $s_e^2 = 4$, $\\bar{x} = 3$ and $S_{xx} = 36$. Then $s_{b_0}^2 = 4\\left(\\frac{1}{10} + \\frac{9}{36}\\right) = 4(0.35) = 1.4$, so $s_{b_0} \\approx 1.183$, and with $t_{0.025,\\,8} = 2.306$ the margin is about $2.728$: the $95\\%$ interval is about $(1.272,\\ 6.728)$.\n\nCheck: $0.1 + 0.25 = 0.35$, and $1.183^2 \\approx 1.4$.\n\nIn this lesson we compute the squared standard error of the intercept, build its confidence interval and find the center of the interval from the means.",
      "对 $n = 10$ 个点作回归，有 $b_0 = 4$，$s_e^2 = 4$，$\\bar{x} = 3$，$S_{xx} = 36$。于是 $s_{b_0}^2 = 4\\left(\\frac{1}{10} + \\frac{9}{36}\\right) = 4(0.35) = 1.4$，所以 $s_{b_0} \\approx 1.183$，由 $t_{0.025,\\,8} = 2.306$ 得误差范围约为 $2.728$：$95\\%$ 区间约为 $(1.272,\\ 6.728)$。\n\n检验：$0.1 + 0.25 = 0.35$，并且 $1.183^2 \\approx 1.4$。\n\n本课我们计算截距标准误差的平方，构造它的置信区间，并由均值求区间的中心。",
    ),
    prerequisites: ["confidence-intervals-for-linear-regression-slope-parameters"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-regression-intercept-variance",
        title: t("Computing squared standard error of the regression intercept", "计算回归截距的标准误差平方"),
        explanation: t(
          "The intercept is uncertain both because of the average level and because of the slope, so its variance grows when the mean input is far from zero. The estimated variance of the intercept is $s_{b_0}^2 = s_e^2 \\left(\\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}}\\right)$. With $n = 5$, $\\bar{x} = 12$, $S_{xx} = 144$ and $s_e^2 = 10$: $\\frac{1}{5} + \\frac{144}{144} = \\frac{6}{5}$, so $s_{b_0}^2 = 10 \\times \\frac{6}{5} = 12$.\n\n> **Watch out.** Square $\\bar{x}$, keep both terms in the bracket, and multiply the bracket by $s_e^2$.",
          "截距的不确定性既来自平均水平，也来自斜率，所以当自变量的均值离零很远时，它的方差会增大。截距的方差估计为 $s_{b_0}^2 = s_e^2 \\left(\\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}}\\right)$。若 $n = 5$，$\\bar{x} = 12$，$S_{xx} = 144$，$s_e^2 = 10$：$\\frac{1}{5} + \\frac{144}{144} = \\frac{6}{5}$，所以 $s_{b_0}^2 = 10 \\times \\frac{6}{5} = 12$。\n\n> **注意。** 要把 $\\bar{x}$ 平方，括号里的两项都要保留，再用 $s_e^2$ 乘以整个括号。",
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
            mistakes: distinct(ans, [
              why(
                Q.of(seSq, n),
                "That keeps only $\\frac{1}{n}$; the term $\\frac{\\bar{x}^2}{S_{xx}}$ belongs in the bracket too.",
                "那只保留了 $\\frac{1}{n}$；括号里还有 $\\frac{\\bar{x}^2}{S_{xx}}$ 这一项。",
              ),
              why(inner, "That is the bracket alone; multiply it by $s_e^2$.", "那只是括号里的值；还要乘以 $s_e^2$。"),
              why(
                Q.of(seSq * xBar * xBar, sxx),
                "That drops the term $\\frac{1}{n}$ from the bracket.",
                "那漏掉了括号里的 $\\frac{1}{n}$ 一项。",
              ),
              why(
                Q.of(1, n).add(Q.of(xBar, sxx)).mul(Q.of(seSq)),
                "That uses $\\bar{x}$ in place of $\\bar{x}^2$.",
                "那用 $\\bar{x}$ 代替了 $\\bar{x}^2$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Add the terms in the bracket", "求括号里的和"],
                  t(
                    `$\\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}} = \\frac{1}{${n}} + \\frac{${xBar * xBar}}{${sxx}} = ${inner.toLatex()}$.`,
                    `$\\frac{1}{n} + \\frac{\\bar{x}^2}{S_{xx}} = \\frac{1}{${n}} + \\frac{${xBar * xBar}}{${sxx}} = ${inner.toLatex()}$。`,
                  ),
                ],
                [
                  ["Multiply by $s_e^2$", "乘以 $s_e^2$"],
                  t(
                    `$s_{b_0}^2 = ${seSq} \\times ${inner.toLatex()} = ${ans.toLatex()}$.`,
                    `$s_{b_0}^2 = ${seSq} \\times ${inner.toLatex()} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$${ans.toLatex()}$ is more than $\\frac{s_e^2}{n} = ${Q.of(seSq, n).toLatex()}$, since the slope term only adds to the variance.`,
                `$${ans.toLatex()}$ 大于 $\\frac{s_e^2}{n} = ${Q.of(seSq, n).toLatex()}$，因为斜率一项只会增大方差。`,
              ),
            ),
          });
        },
      },
      {
        id: "building-an-intercept-interval",
        title: t("Building the confidence interval for the intercept", "构造截距的置信区间"),
        explanation: t(
          "The interval for the intercept has the same shape as the one for the slope, $b_0 \\pm t^*\\, s_{b_0}$ with $n - 2$ degrees of freedom. The formula for the intercept gives the squared standard error $s_{b_0}^2$, so take its square root before multiplying by the critical value.\n\nWith $n = 15$, $b_0 = 12.5$ and $s_{b_0}^2 = 1.44$: $s_{b_0} = 1.2$ and $t_{0.025,\\,13} = 2.160$, so the margin is $2.592$ and the $95\\%$ interval is $(9.908,\\ 15.092)$. With $n = 40$, $b_0 = -50$ and $s_{b_0}^2 = 9$: $s_{b_0} = 3$ and $t_{0.025,\\,38} = 2.024$, so the margin is $6.072$ and the interval is $(-56.072,\\ -43.928)$.\n\n> **Watch out.** Take the square root of $s_{b_0}^2$ before multiplying by $t^*$, and use $n - 2$ degrees of freedom.",
          "截距的区间与斜率的形式相同，即 $b_0 \\pm t^*\\, s_{b_0}$，自由度为 $n - 2$。截距的公式给出的是标准误差的平方 $s_{b_0}^2$，所以要先开平方，再乘以临界值。\n\n若 $n = 15$，$b_0 = 12.5$，$s_{b_0}^2 = 1.44$：则 $s_{b_0} = 1.2$，$t_{0.025,\\,13} = 2.160$，误差范围为 $2.592$，$95\\%$ 区间为 $(9.908,\\ 15.092)$。若 $n = 40$，$b_0 = -50$，$s_{b_0}^2 = 9$：则 $s_{b_0} = 3$，$t_{0.025,\\,38} = 2.024$，误差范围为 $6.072$，区间为 $(-56.072,\\ -43.928)$。\n\n> **注意。** 要先把 $s_{b_0}^2$ 开平方再乘以 $t^*$，并且自由度用 $n - 2$。",
        ),
        generate: (rng: Rng): Problem => {
          const se10 = rng.int(3, 25);
          const variance = dec(Q.of(se10 * se10, 100));
          return regressionInterval(
            rng,
            t("intercept", "截距"),
            "b_0",
            rng.pick([-1, 1]) * rng.int(10, 400) * 10,
            se10 * 10,
            t(`with squared standard error $s_{b_0}^2 = ${variance}$`, `截距标准误差的平方为 $s_{b_0}^2 = ${variance}$`),
            true,
          );
        },
      },
    ],
  },
];
