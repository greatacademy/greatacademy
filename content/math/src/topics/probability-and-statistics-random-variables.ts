import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** Mistake is a value a typical mistake produces, with what to say about it. */
type Mistake = ReturnType<typeof why>;

/** asQ reads a value as an exact number. */
const asQ = (v: Mistake["value"]) => (v instanceof Q ? v : Q.of(v));

/** distinct keeps the mistakes that differ from the answer, each value once. */
const distinct = (answer: Mistake["value"], ms: readonly Mistake[]): Mistake[] =>
  ms.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && ms.findIndex((o) => asQ(o.value).eq(asQ(m.value))) === i);

/** over writes 1 over 2b times m, leaving out a factor m of one: "\frac{1}{2 \cdot 3}" becomes "\frac{1}{6}" when m is 1. */
const overProduct = (a: number, m: number) => (m === 1 ? `\\frac{1}{${a}}` : `\\frac{1}{${a} \\cdot ${m}}`);

/** Topics for Unit 1: Probability & Random Variables (new topics). */
export const probabilityAndStatisticsRandomVariablesTopics: TopicDef[] = [
  // 1.3.4 Cumulative Distribution Functions for Continuous Random Variables
  {
    id: "cumulative-distribution-functions-for-continuous-random-variables",
    title: t("Cumulative Distribution Functions for Continuous Random Variables", "连续型随机变量的累积分布函数"),
    summary: t(
      "The cumulative distribution function $F(x) = P(X \\le x) = \\int_{-\\infty}^{x} f(t)\\,dt$ gives the probability that a continuous random variable takes a value at most $x$.",
      "累积分布函数 $F(x) = P(X \\le x) = \\int_{-\\infty}^{x} f(t)\\,dt$ 表示连续型随机变量取值不超过 $x$ 的概率。",
    ),
    intro: t(
      "A random variable $X$ has density $f(x) = \\frac{2x}{1600}$ on $[0, 40]$. The probability that $X$ is at most $10$ is the area under the density from $0$ to $10$: $F(10) = \\int_0^{10} \\frac{2t}{1600}\\,dt = \\frac{100}{1600} = \\frac{1}{16}$.\n\nCheck: the whole area is $F(40) = \\frac{40^2}{1600} = 1$, as the total probability must be.\n\nIn this lesson we find the cumulative distribution function from a density, use it for the probability of an interval, and read such probabilities from drawn graphs.",
      "随机变量 $X$ 在 $[0, 40]$ 上的密度为 $f(x) = \\frac{2x}{1600}$。$X$ 不超过 $10$ 的概率是密度曲线下从 $0$ 到 $10$ 的面积：$F(10) = \\int_0^{10} \\frac{2t}{1600}\\,dt = \\frac{100}{1600} = \\frac{1}{16}$。\n\n检验：全部面积为 $F(40) = \\frac{40^2}{1600} = 1$，正是总概率。\n\n本课我们由密度求累积分布函数，用它求区间的概率，并从画出的图像中读出这样的概率。",
    ),
    prerequisites: ["calculating-probabilities-with-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-cdf-from-pdf",
        title: t("Evaluating the CDF of a continuous random variable", "由概率密度函数计算累积分布函数值"),
        explanation: t(
          "The cumulative distribution function gives the probability of a value at most the given one, which is the area under the density up to that point. For a continuous random variable $X$ with PDF $f(x)$ on $[0, b]$, the CDF is $F(x) = \\int_0^x f(t) \\, dt$. At any point $x_0$, $F(x_0)$ is $P(X \\le x_0)$. For $f(x) = \\frac{2x}{2500}$ on $[0, 50]$, $F(x) = \\frac{x^2}{2500}$, so $F(20) = \\frac{400}{2500} = \\frac{4}{25}$.\n\n> **Watch out.** $F(x_0)$ is an area, not the height $f(x_0)$ of the density at $x_0$. And it is the area to the left of $x_0$; the area to the right is $1 - F(x_0)$.",
          "累积分布函数给出取值不超过给定值的概率，也就是密度曲线下到该点为止的面积。对于在区间 $[0, b]$ 上具有概率密度函数 $f(x)$ 的连续型随机变量 $X$，其累积分布函数为 $F(x) = \\int_0^x f(t) \\, dt$。在任意点 $x_0$ 处，$F(x_0)$ 表示 $P(X \\le x_0)$。对于 $[0, 50]$ 上的 $f(x) = \\frac{2x}{2500}$，$F(x) = \\frac{x^2}{2500}$，所以 $F(20) = \\frac{400}{2500} = \\frac{4}{25}$。\n\n> **注意。** $F(x_0)$ 是面积，不是密度在 $x_0$ 处的高度 $f(x_0)$。而且它是 $x_0$ 左侧的面积；右侧的面积是 $1 - F(x_0)$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(4, 30);
          const x0 = rng.int(1, b - 1);
          const num = x0 * x0;
          const den = b * b;
          const answer = Q.of(num, den);

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ has probability density function $f(x) = \\frac{2x}{${den}}$ for $0 \\le x \\le ${b}$, and $f(x) = 0$ elsewhere. Calculate the value of the cumulative distribution function $F(${x0}) = P(X \\le ${x0})$.`,
              `设连续型随机变量 $X$ 的概率密度函数为 $f(x) = \\frac{2x}{${den}}$（$0 \\le x \\le ${b}$），其他位置 $f(x) = 0$。求累积分布函数在 $x = ${x0}$ 处的值 $F(${x0}) = P(X \\le ${x0})$。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(2 * x0, den),
                `That is the density $f(${x0})$, a height; the probability is the area under the density up to $${x0}$.`,
                `那是密度 $f(${x0})$，是高度；概率是密度曲线下到 $${x0}$ 为止的面积。`,
              ),
              why(
                Q.of(den - num, den),
                `That is $P(X > ${x0})$, the area to the right of $${x0}$.`,
                `那是 $P(X > ${x0})$，即 $${x0}$ 右侧的面积。`,
              ),
              why(
                Q.of(x0, b),
                "That treats $X$ as uniform; this density rises, so the area grows like $x^2$.",
                "那是把 $X$ 当成均匀分布；这个密度是上升的，所以面积按 $x^2$ 增长。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Integrate the density", "对密度积分"],
                  t(
                    `For $0 \\le x \\le ${b}$, $F(x) = \\int_0^x \\frac{2t}{${den}}\\,dt = \\frac{x^2}{${den}}$.`,
                    `当 $0 \\le x \\le ${b}$ 时，$F(x) = \\int_0^x \\frac{2t}{${den}}\\,dt = \\frac{x^2}{${den}}$。`,
                  ),
                ],
                [
                  ["Evaluate", "代入求值"],
                  t(
                    `$F(${x0}) = \\frac{${x0}^2}{${den}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `$F(${x0}) = \\frac{${x0}^2}{${den}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              t(
                `At the top of the support $F(${b}) = \\frac{${b}^2}{${den}} = 1$, the total probability, and $\\frac{${num}}{${den}}$ lies between $0$ and $1$.`,
                `在支撑集的右端 $F(${b}) = \\frac{${b}^2}{${den}} = 1$，正是总概率，而 $\\frac{${num}}{${den}}$ 介于 $0$ 和 $1$ 之间。`,
              ),
            ),
          });
        },
      },
      {
        id: "calculating-probabilities-using-cdf",
        title: t("Calculating interval probabilities using the CDF", "利用累积分布函数计算区间概率"),
        explanation: t(
          "For any continuous random variable with CDF $F(x)$, the probability that $X$ falls in $[a, c]$ is given by $P(a \\le X \\le c) = F(c) - F(a)$. For $F(x) = \\frac{x^3}{27000}$ on $[0, 30]$, $P(10 \\le X \\le 20) = \\frac{8000}{27000} - \\frac{1000}{27000} = \\frac{7}{27}$.\n\n> **Watch out.** Subtract $F(a)$, the probability below the interval; do not add it, and do not stop at $F(c)$. For a continuous variable the endpoints carry no probability, so $<$ and $\\le$ give the same answer.",
          "对于具有累积分布函数 $F(x)$ 的连续型随机变量，$X$ 落在区间 $[a, c]$ 内的概率由 $P(a \\le X \\le c) = F(c) - F(a)$ 给出。对于 $[0, 30]$ 上的 $F(x) = \\frac{x^3}{27000}$，$P(10 \\le X \\le 20) = \\frac{8000}{27000} - \\frac{1000}{27000} = \\frac{7}{27}$。\n\n> **注意。** 要减去 $F(a)$，即区间下方的概率；不要加上它，也不要只算到 $F(c)$。对于连续变量，端点的概率为零，所以 $<$ 与 $\\le$ 结果相同。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(4, 25);
          const a = rng.int(0, b - 2);
          const c = rng.int(a + 1, b);
          const b3 = b * b * b;
          const num = c * c * c - a * a * a;
          const answer = Q.of(num, b3);
          const fa =
            a === 0
              ? t("$F(0) = 0$", "$F(0) = 0$")
              : t(`$F(${a}) = \\frac{${a * a * a}}{${b3}}$`, `$F(${a}) = \\frac{${a * a * a}}{${b3}}$`);

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ has cumulative distribution function $F(x) = \\frac{x^3}{${b3}}$ for $0 \\le x \\le ${b}$. Find $P(${a} \\le X \\le ${c})$.`,
              `设连续型随机变量 $X$ 的累积分布函数为 $F(x) = \\frac{x^3}{${b3}}$（$0 \\le x \\le ${b}$）。求概率 $P(${a} \\le X \\le ${c})$。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(c * c * c, b3),
                `That is $F(${c})$ alone, which also counts the values below $${a}$.`,
                `那只是 $F(${c})$，它把小于 $${a}$ 的值也算进去了。`,
              ),
              why(
                Q.of(c * c * c + a * a * a, b3),
                `That adds $F(${a})$; the probability below $${a}$ must be taken away.`,
                `那是加上了 $F(${a})$；小于 $${a}$ 的概率应当减去。`,
              ),
              why(
                Q.of(c - a, b),
                "That treats $X$ as uniform; $F$ grows like $x^3$, so equal widths do not carry equal probability.",
                "那是把 $X$ 当成均匀分布；$F$ 按 $x^3$ 增长，等宽的区间概率并不相等。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Subtract the values of the CDF", "累积分布函数值相减"],
                  t(`$P(${a} \\le X \\le ${c}) = F(${c}) - F(${a})$.`, `$P(${a} \\le X \\le ${c}) = F(${c}) - F(${a})$。`),
                ],
                [
                  ["Evaluate", "代入求值"],
                  t(
                    `$F(${c}) = \\frac{${c * c * c}}{${b3}}$ and ${fa.en}, so the probability is $\\frac{${num}}{${b3}}${lowestTerms(num, b3)}$.`,
                    `$F(${c}) = \\frac{${c * c * c}}{${b3}}$，${fa["zh-CN"]}，所以概率为 $\\frac{${num}}{${b3}}${lowestTerms(num, b3)}$。`,
                  ),
                ],
              ],
              t(
                `The three pieces below $${a}$, in the interval and above $${c}$ add to one: $\\frac{${a * a * a}}{${b3}} + \\frac{${num}}{${b3}} + \\frac{${b3 - c * c * c}}{${b3}} = 1$.`,
                `小于 $${a}$、在区间内、大于 $${c}$ 三部分之和为一：$\\frac{${a * a * a}}{${b3}} + \\frac{${num}}{${b3}} + \\frac{${b3 - c * c * c}}{${b3}} = 1$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 1.3.5 Median, Quartiles and Percentiles of Continuous Random Variables
  {
    id: "median-quartiles-and-percentiles-of-continuous-random-variables",
    title: t("Median, Quartiles and Percentiles of Continuous Random Variables", "连续型随机变量的中位数、四分位数与百分位数"),
    summary: t(
      "The $p$-th quantile $x_p$ satisfies $F(x_p) = p$. The median satisfies $F(m) = 0.5$, the first quartile $F(Q_1) = 0.25$ and the third quartile $F(Q_3) = 0.75$.",
      "$p$ 分位数 $x_p$ 满足 $F(x_p) = p$。中位数满足 $F(m) = 0.5$，第一四分位数满足 $F(Q_1) = 0.25$，第三四分位数满足 $F(Q_3) = 0.75$。",
    ),
    intro: t(
      "A random variable has $F(x) = \\frac{x^2}{10000}$ on $[0, 100]$. Its first quartile is the value with a quarter of the probability below it: $\\frac{x^2}{10000} = \\frac{1}{4}$ gives $x^2 = 2500$, so $Q_1 = 50$, halfway along the interval.\n\nCheck: $F(50) = \\frac{2500}{10000} = \\frac{1}{4}$.\n\nIn this lesson we find medians, quartiles and percentiles by setting the cumulative distribution function equal to a fraction, from formulas, step densities and drawn graphs.",
      "某随机变量在 $[0, 100]$ 上有 $F(x) = \\frac{x^2}{10000}$。它的第一四分位数是下方概率为四分之一的值：由 $\\frac{x^2}{10000} = \\frac{1}{4}$ 得 $x^2 = 2500$，所以 $Q_1 = 50$，恰在区间的中点。\n\n检验：$F(50) = \\frac{2500}{10000} = \\frac{1}{4}$。\n\n本课我们令累积分布函数等于某个比例，从公式、阶梯密度和画出的图像中求中位数、四分位数和百分位数。",
    ),
    prerequisites: ["cumulative-distribution-functions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "median-of-continuous-random-variable",
        title: t("Finding the median of a continuous distribution", "求解连续型分布的中位数"),
        explanation: t(
          "The median splits the probability in half, so it is the point where the area under the density on each side equals one half. The median $m$ of a continuous random variable $X$ satisfies $F(m) = \\frac{1}{2}$, or equivalently $\\int_{-\\infty}^m f(t) \\, dt = \\frac{1}{2}$. For $f(x) = \\frac{50}{x^2}$ on $x \\ge 50$, $F(x) = 1 - \\frac{50}{x}$, and $1 - \\frac{50}{m} = \\frac{1}{2}$ gives $m = 100$.\n\n> **Watch out.** Set the area $F(m)$ equal to one half, not the density $f(m)$. And the median is not where the support starts: there $F$ is still $0$.",
          "中位数把概率平分为两半，所以它是密度曲线下两侧面积都等于二分之一的点。连续型随机变量 $X$ 的中位数 $m$ 满足 $F(m) = \\frac{1}{2}$，或等价地 $\\int_{-\\infty}^m f(t) \\, dt = \\frac{1}{2}$。对于 $x \\ge 50$ 上的 $f(x) = \\frac{50}{x^2}$，$F(x) = 1 - \\frac{50}{x}$，由 $1 - \\frac{50}{m} = \\frac{1}{2}$ 得 $m = 100$。\n\n> **注意。** 要令面积 $F(m)$ 等于二分之一，而不是令密度 $f(m)$ 等于二分之一。中位数也不是支撑集的起点：在那里 $F$ 仍为 $0$。",
        ),
        generate: (rng: Rng): Problem => {
          const x0 = rng.int(2, 35);
          const median = 2 * x0;

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ has Pareto probability density function $f(x) = \\frac{${x0}}{x^2}$ for $x \\ge ${x0}$, and $0$ otherwise. Find the median $m$ of $X$.`,
              `连续型随机变量 $X$ 服从帕累托分布，其概率密度函数为 $f(x) = \\frac{${x0}}{x^2}$（$x \\ge ${x0}$），其他位置为 $0$。求 $X$ 的中位数 $m$。`,
            ),
            answer: median,
            mistakes: distinct(median, [
              why(x0, `That is where the support starts, where $F$ is still $0$.`, `那是支撑集的起点，在那里 $F$ 仍为 $0$。`),
              why(
                3 * x0,
                `That gives $F = 1 - \\frac{1}{3} = \\frac{2}{3}$, past the halfway point.`,
                `那给出 $F = 1 - \\frac{1}{3} = \\frac{2}{3}$，超过了一半。`,
              ),
              why(
                Q.of(3 * x0, 2),
                `That gives $F = 1 - \\frac{2}{3} = \\frac{1}{3}$, short of one half.`,
                `那给出 $F = 1 - \\frac{2}{3} = \\frac{1}{3}$，不到一半。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the CDF", "求累积分布函数"],
                  t(
                    `For $x \\ge ${x0}$, $F(x) = \\int_{${x0}}^x \\frac{${x0}}{t^2}\\,dt = 1 - \\frac{${x0}}{x}$.`,
                    `当 $x \\ge ${x0}$ 时，$F(x) = \\int_{${x0}}^x \\frac{${x0}}{t^2}\\,dt = 1 - \\frac{${x0}}{x}$。`,
                  ),
                ],
                [
                  ["Set it to one half", "令它等于二分之一"],
                  t(
                    `$1 - \\frac{${x0}}{m} = \\frac{1}{2}$ gives $\\frac{${x0}}{m} = \\frac{1}{2}$, so $m = 2 \\cdot ${x0} = ${median}$.`,
                    `由 $1 - \\frac{${x0}}{m} = \\frac{1}{2}$ 得 $\\frac{${x0}}{m} = \\frac{1}{2}$，所以 $m = 2 \\cdot ${x0} = ${median}$。`,
                  ),
                ],
              ],
              t(
                `$F(${median}) = 1 - \\frac{${x0}}{${median}} = 1 - \\frac{1}{2} = \\frac{1}{2}$.`,
                `$F(${median}) = 1 - \\frac{${x0}}{${median}} = 1 - \\frac{1}{2} = \\frac{1}{2}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "quartiles-and-percentiles-of-continuous-random-variable",
        title: t("Computing percentiles and quartiles", "计算百分位数与四分位数"),
        explanation: t(
          "A percentile is the value below which a given fraction of the probability lies, so set the cumulative distribution function equal to that fraction and solve. The $p$-th quantile $x_p$ satisfies $F(x_p) = p$. For $F(x) = \\frac{x^2}{b^2}$ on $[0, b]$, setting $\\frac{x_p^2}{b^2} = p$ yields $x_p = b\\sqrt{p}$. For $F(x) = \\frac{x^2}{10000}$ on $[0, 100]$, the $4$th percentile solves $\\frac{x^2}{10000} = \\frac{4}{100}$, so $x^2 = 400$ and $x = 20$.\n\n> **Watch out.** The answer is not $\\frac{p}{100}$ of the way along the interval: that holds only for a uniform variable. And the $p$th percentile has $p$ percent of the probability below it, so do not measure from the top.",
          "百分位数是其下方概率占给定比例的值，所以令累积分布函数等于这个比例，再求解。$p$ 分位数 $x_p$ 满足 $F(x_p) = p$。对于区间 $[0, b]$ 上的 $F(x) = \\frac{x^2}{b^2}$，令 $\\frac{x_p^2}{b^2} = p$ 可得 $x_p = b\\sqrt{p}$。对于 $[0, 100]$ 上的 $F(x) = \\frac{x^2}{10000}$，第 $4$ 百分位数满足 $\\frac{x^2}{10000} = \\frac{4}{100}$，所以 $x^2 = 400$，$x = 20$。\n\n> **注意。** 答案不是区间长度的百分之 $p$ 处：那只对均匀分布成立。而且第 $p$ 百分位数下方的概率是百分之 $p$，不要从上端量起。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.pick([3, 4, 5, 6, 7, 8, 9]);
          const multiplier = rng.int(1, 6);
          const b = 10 * multiplier;
          const p = k * k; // percentage: 9, 16, 25, 36, 49, 64, 81
          const xp = k * multiplier;

          return numberProblem({
            prompt: t(
              `The CDF of a continuous random variable $X$ is $F(x) = \\frac{x^2}{${b * b}}$ for $0 \\le x \\le ${b}$. Find the $${p}\\text{th}$ percentile of $X$.`,
              `设连续型随机变量 $X$ 的累积分布函数为 $F(x) = \\frac{x^2}{${b * b}}$（$0 \\le x \\le ${b}$）。求 $X$ 的第 $${p}$ 百分位数。`,
            ),
            answer: xp,
            mistakes: distinct(xp, [
              why(
                Q.of(p * b, 100),
                `That goes $${p}$ percent of the way along the interval, as for a uniform variable; here $F$ grows like $x^2$.`,
                `那是取区间长度的百分之 $${p}$ 处，这只对均匀分布成立；这里 $F$ 按 $x^2$ 增长。`,
              ),
              why(
                b - xp,
                `That measures from the top; the $${p}$th percentile has $${p}$ percent of the probability below it.`,
                `那是从上端量起；第 $${p}$ 百分位数下方的概率是百分之 $${p}$。`,
              ),
              why(
                k,
                `That is $\\sqrt{${p}}$ alone; the root must be taken of $x^2 = \\frac{${p}}{100} \\cdot ${b * b}$.`,
                `那只是 $\\sqrt{${p}}$；应当对 $x^2 = \\frac{${p}}{100} \\cdot ${b * b}$ 开方。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Set the CDF to the fraction", "令累积分布函数等于这个比例"],
                  t(`$\\frac{x^2}{${b * b}} = \\frac{${p}}{100}$.`, `$\\frac{x^2}{${b * b}} = \\frac{${p}}{100}$。`),
                ],
                [
                  ["Solve", "求解"],
                  t(
                    `$x^2 = \\frac{${p} \\cdot ${b * b}}{100} = ${xp * xp}$, and the root in $[0, ${b}]$ is $x = ${xp}$.`,
                    `$x^2 = \\frac{${p} \\cdot ${b * b}}{100} = ${xp * xp}$，在 $[0, ${b}]$ 内的根为 $x = ${xp}$。`,
                  ),
                ],
              ],
              t(
                `$F(${xp}) = \\frac{${xp * xp}}{${b * b}} = \\frac{${p}}{100}$, so $${p}$ percent of the probability lies below $${xp}$.`,
                `$F(${xp}) = \\frac{${xp * xp}}{${b * b}} = \\frac{${p}}{100}$，所以 $${xp}$ 下方的概率是百分之 $${p}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 1.3.6 Finding the Mode of a Continuous Random Variable
  {
    id: "finding-the-mode-of-a-continuous-random-variable",
    title: t("Finding the Mode of a Continuous Random Variable", "求解连续型随机变量的众数"),
    summary: t(
      "The mode of a continuous random variable is the value of x at which the probability density function f(x) attains its global maximum.",
      "连续型随机变量的众数是概率密度函数 f(x) 达到全局最大值时对应的自变量 x 之取值。",
    ),
    intro: t(
      "A density is $f(x) = C x^2 (150 - x)$ on $[0, 150]$. Its mode is where it is highest: the derivative of $x^2(150 - x) = 150x^2 - x^3$ is $x(300 - 3x)$, which is zero at $x = 0$ and $x = 100$, and the density is $0$ at both ends, so the mode is $100$.\n\nCheck: at $x = 100$ the derivative is $100(300 - 300) = 0$, and the density there is positive.\n\nIn this lesson we find the mode of a density by setting its derivative to zero, and compare it with the median and the mean.",
      "某密度为 $[0, 150]$ 上的 $f(x) = C x^2 (150 - x)$。它的众数是密度最高的位置：$x^2(150 - x) = 150x^2 - x^3$ 的导数为 $x(300 - 3x)$，它在 $x = 0$ 和 $x = 100$ 处为零，而密度在两端都是 $0$，所以众数是 $100$。\n\n检验：在 $x = 100$ 处导数为 $100(300 - 300) = 0$，而那里的密度为正。\n\n本课我们令密度的导数为零来求众数，并把它与中位数和均值相比较。",
    ),
    prerequisites: ["probability-density-functions-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "mode-of-polynomial-pdf",
        title: t("Finding the mode from a polynomial PDF", "由多项式型概率密度函数求解众数"),
        explanation: t(
          "For a continuous random variable with differentiable PDF $f(x)$, the mode occurs at a critical point where $f'(x) = 0$ and $f''(x) < 0$ (or at the boundary). For $f(x) = C x^2 (180 - x)$ on $[0, 180]$, the derivative of $180x^2 - x^3$ is $x(360 - 3x)$, which is zero at $x = 120$, and the mode is $120$.\n\n> **Watch out.** The constant $C$ does not move the peak, so ignore it. The critical point $x = 0$ is where the density is lowest, and the endpoint, where the density is $0$, is not the mode either.",
          "对于概率密度函数 $f(x)$ 可微的连续型随机变量，众数出现在满足 $f'(x) = 0$ 且 $f''(x) < 0$ 的驻点（或区间边界）处。对于 $[0, 180]$ 上的 $f(x) = C x^2 (180 - x)$，$180x^2 - x^3$ 的导数为 $x(360 - 3x)$，它在 $x = 120$ 处为零，众数是 $120$。\n\n> **注意。** 常数 $C$ 不改变峰值的位置，可以不管它。驻点 $x = 0$ 处密度最低，而端点处密度为 $0$，也不是众数。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 45);
          const b = 3 * k;
          const mode = 2 * k;

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ has probability density function $f(x) = C x^2 (${b} - x)$ for $0 \\le x \\le ${b}$, where $C > 0$ is a normalizing constant. Find the mode of $X$.`,
              `设连续型随机变量 $X$ 的概率密度函数为 $f(x) = C x^2 (${b} - x)$（$0 \\le x \\le ${b}$），其中 $C > 0$ 为归一化常数。求 $X$ 的众数。`,
            ),
            answer: mode,
            mistakes: distinct(mode, [
              why(
                k,
                `That is a third of the way to $${b}$; the factor $x^2$ pulls the peak to two thirds of the way.`,
                `那是到 $${b}$ 的三分之一处；因子 $x^2$ 把峰值拉到三分之二处。`,
              ),
              why(
                Q.of(3 * k, 2),
                `That is the midpoint, the mode of $x(${b} - x)$; the square on $x$ moves the peak to the right.`,
                `那是中点，是 $x(${b} - x)$ 的众数；$x$ 上的平方使峰值右移。`,
              ),
              why(b, `That is the end of the support, where the density is $0$.`, `那是支撑集的端点，那里的密度为 $0$。`),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate", "求导"],
                  t(
                    `Leave out $C$: $g(x) = x^2 (${b} - x) = ${b} x^2 - x^3$ has $g'(x) = ${2 * b} x - 3x^2 = x(${2 * b} - 3x)$.`,
                    `先不管 $C$：$g(x) = x^2 (${b} - x) = ${b} x^2 - x^3$ 的导数为 $g'(x) = ${2 * b} x - 3x^2 = x(${2 * b} - 3x)$。`,
                  ),
                ],
                [
                  ["Pick the maximum", "选出最大值点"],
                  t(
                    `$g'(x) = 0$ at $x = 0$ and $x = \\frac{${2 * b}}{3} = ${mode}$. Since $g(0) = g(${b}) = 0$ and $g(${mode}) > 0$, the mode is $${mode}$.`,
                    `$g'(x) = 0$ 的点为 $x = 0$ 和 $x = \\frac{${2 * b}}{3} = ${mode}$。因为 $g(0) = g(${b}) = 0$ 而 $g(${mode}) > 0$，众数是 $${mode}$。`,
                  ),
                ],
              ],
              t(
                `$g'(${mode}) = ${mode}(${2 * b} - 3 \\cdot ${mode}) = ${mode}(${2 * b} - ${3 * mode}) = 0$.`,
                `$g'(${mode}) = ${mode}(${2 * b} - 3 \\cdot ${mode}) = ${mode}(${2 * b} - ${3 * mode}) = 0$。`,
              ),
            ),
          });
        },
      },
      {
        id: "mode-of-exponential-weighted-pdf",
        title: t("Mode of a gamma-type or exponentially damped PDF", "伽马型或指数衰减型密度的众数"),
        explanation: t(
          "The mode is where the density is highest, so set its derivative equal to zero and check that the critical point is a maximum. For $f(x) = Cxe^{-kx}$ ($x \\ge 0$), differentiation gives $f'(x) = Ce^{-kx}(1 - kx)$. The unique maximum occurs at $x = \\frac{1}{k}$. For $f(x) = 2500 x e^{-50x}$ the mode is $\\frac{1}{50}$.\n\n> **Watch out.** Solving $1 - kx = 0$ gives $x = \\frac{1}{k}$, not $k$. The constant in front does not move the peak, and the mean of this density, $\\frac{2}{k}$, lies to the right of the mode.",
          "众数是密度最大的位置，所以令密度的导数等于零，并检验这个临界点是最大值点。对于 $f(x) = Cxe^{-kx}$（$x \\ge 0$），求导得 $f'(x) = Ce^{-kx}(1 - kx)$。唯一最大值点为 $x = \\frac{1}{k}$。对于 $f(x) = 2500 x e^{-50x}$，众数是 $\\frac{1}{50}$。\n\n> **注意。** 由 $1 - kx = 0$ 得 $x = \\frac{1}{k}$，而不是 $k$。前面的常数不改变峰值的位置，而这个密度的均值 $\\frac{2}{k}$ 在众数的右边。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 30);
          const answer = Q.of(1, k);

          return numberProblem({
            prompt: t(
              `The PDF of a continuous random variable $X$ on $[0, \\infty)$ is $f(x) = ${k * k} x e^{-${k} x}$. Find the mode of $X$.`,
              `设连续型随机变量 $X$ 在 $[0, \\infty)$ 上的概率密度函数为 $f(x) = ${k * k} x e^{-${k} x}$。求 $X$ 的众数。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                k,
                `That is upside down: $1 - ${k}x = 0$ gives $x = \\frac{1}{${k}}$.`,
                `那是颠倒了：由 $1 - ${k}x = 0$ 得 $x = \\frac{1}{${k}}$。`,
              ),
              why(
                Q.of(2, k),
                "That is the mean of this density, which lies to the right of its peak.",
                "那是这个密度的均值，它在峰值的右边。",
              ),
              why(
                Q.of(1, k * k),
                `That divides by the constant $${k * k}$, which only scales the density and does not move its peak.`,
                `那是除以了常数 $${k * k}$，它只缩放密度，不改变峰值的位置。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate with the product rule", "用乘积法则求导"],
                  t(
                    `$f'(x) = ${k * k}\\left(e^{-${k} x} - ${k} x e^{-${k} x}\\right) = ${k * k} e^{-${k} x}(1 - ${k} x)$.`,
                    `$f'(x) = ${k * k}\\left(e^{-${k} x} - ${k} x e^{-${k} x}\\right) = ${k * k} e^{-${k} x}(1 - ${k} x)$。`,
                  ),
                ],
                [
                  ["Solve", "求解"],
                  t(
                    `The exponential is never zero, so $1 - ${k} x = 0$ and $x = \\frac{1}{${k}}$.`,
                    `指数函数恒不为零，所以 $1 - ${k} x = 0$，$x = \\frac{1}{${k}}$。`,
                  ),
                ],
              ],
              t(
                `The density rises before $\\frac{1}{${k}}$ and falls after it: $f'(0) = ${k * k} > 0$ and $f'\\left(\\frac{2}{${k}}\\right) = -${k * k} e^{-2} < 0$.`,
                `密度在 $\\frac{1}{${k}}$ 之前上升、之后下降：$f'(0) = ${k * k} > 0$，$f'\\left(\\frac{2}{${k}}\\right) = -${k * k} e^{-2} < 0$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 1.3.7 Approximating Discrete Random Variables as Continuous
  {
    id: "approximating-discrete-random-variables-as-continuous",
    title: t("Approximating Discrete Random Variables as Continuous", "用连续型随机变量近似离散型随机变量"),
    summary: t(
      "Continuity correction adjusts discrete intervals to continuous ones by adding or subtracting 0.5: P(a ≤ X ≤ b) ≈ P(a - 0.5 ≤ Y ≤ b + 0.5).",
      "连续性校正通过对区间端点加减 0.5 将离散区间转换为连续区间：P(a ≤ X ≤ b) ≈ P(a - 0.5 ≤ Y ≤ b + 0.5)。",
    ),
    intro: t(
      "A whole-number variable $X$ is approximated by a continuous one $Y$. The values $60, 61, \\dots, 75$ become the strips around them, so $P(60 \\le X \\le 75)$ becomes $P(59.5 \\le Y \\le 75.5)$, an interval of width $16$.\n\nCheck: there are $75 - 60 + 1 = 16$ whole numbers from $60$ to $75$, one for each unit of width.\n\nIn this lesson we correct intervals for continuity, find their widths, and use them to approximate probabilities.",
      "用连续变量 $Y$ 近似整值变量 $X$。值 $60, 61, \\dots, 75$ 各自变成它周围的一条，所以 $P(60 \\le X \\le 75)$ 变成 $P(59.5 \\le Y \\le 75.5)$，区间宽度为 $16$。\n\n检验：从 $60$ 到 $75$ 共有 $75 - 60 + 1 = 16$ 个整数，每个整数对应一个单位宽度。\n\n本课我们对区间做连续性校正，求出它们的宽度，并用它们近似计算概率。",
    ),
    prerequisites: ["calculating-probabilities-with-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "continuity-correction-interval",
        title: t("Identifying continuity-corrected intervals", "确定连续性校正后的区间"),
        explanation: t(
          "When a continuous distribution approximates a discrete one, each whole number is spread over the interval of width one centered on it. Each discrete integer $k$ occupies the continuous interval $[k - 0.5, k + 0.5]$. Thus $P(a \\le X \\le b)$ maps to $[a - 0.5, b + 0.5]$, while $P(X \\ge a)$ maps to $[a - 0.5, \\infty)$. For example, $P(3 \\le X \\le 8)$ becomes $P(2.5 \\le Y \\le 8.5)$.\n\n> **Watch out.** Move both endpoints outward, by $0.5$ each: moving inward cuts off half of each end value, and moving by a whole unit brings in parts of the values outside.",
          "当用连续分布近似离散分布时，每个整数都被摊开到以它为中心、宽度为 1 的区间上。每个离散整数 $k$ 对应连续区间 $[k - 0.5, k + 0.5]$。因此 $P(a \\le X \\le b)$ 对应连续区间 $[a - 0.5, b + 0.5]$，而 $P(X \\ge a)$ 对应 $[a - 0.5, \\infty)$。例如 $P(3 \\le X \\le 8)$ 变成 $P(2.5 \\le Y \\le 8.5)$。\n\n> **注意。** 两个端点都向外移，各移 $0.5$：向内移会切掉两端值的一半，移一整个单位则会把范围外的值也算进一部分。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(10, 50);
          const b = rng.int(a + 5, a + 30);
          const opts = [
            t(`$[${a - 0.5}, ${b + 0.5}]$`, `$[${a - 0.5}, ${b + 0.5}]$`),
            t(`$[${a + 0.5}, ${b - 0.5}]$`, `$[${a + 0.5}, ${b - 0.5}]$`),
            t(`$[${a}, ${b}]$`, `$[${a}, ${b}]$`),
            t(`$[${a - 1}, ${b + 1}]$`, `$[${a - 1}, ${b + 1}]$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((idx) => opts[idx]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `When approximating a discrete integer random variable $X$ by a continuous random variable $Y$, which continuous interval corresponds to $P(${a} \\le X \\le ${b})$ after continuity correction?`,
                `当用连续型随机变量 $Y$ 近似离散型整值随机变量 $X$ 时，经过连续性校正后，与概率 $P(${a} \\le X \\le ${b})$ 对应的连续区间是哪个？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Spread each whole number", "把每个整数摊开"],
                    t(
                      "With continuity correction, each integer $k$ corresponds to $[k - 0.5, k + 0.5]$.",
                      "经过连续性校正，每个整数 $k$ 对应区间 $[k - 0.5, k + 0.5]$。",
                    ),
                  ],
                  [
                    ["Take the outer edges", "取最外侧的端点"],
                    t(
                      `The strip of $${a}$ starts at $${a - 0.5}$ and the strip of $${b}$ ends at $${b + 0.5}$, so $P(${a} \\le X \\le ${b}) \\approx P(${a - 0.5} \\le Y \\le ${b + 0.5})$.`,
                      `$${a}$ 的那一条从 $${a - 0.5}$ 开始，$${b}$ 的那一条到 $${b + 0.5}$ 结束，所以 $P(${a} \\le X \\le ${b}) \\approx P(${a - 0.5} \\le Y \\le ${b + 0.5})$。`,
                    ),
                  ],
                ],
                t(
                  `The width is $${b + 0.5} - ${a - 0.5} = ${b - a + 1}$, the number $${b} - ${a} + 1$ of whole numbers from $${a}$ to $${b}$.`,
                  `宽度为 $${b + 0.5} - ${a - 0.5} = ${b - a + 1}$，正是从 $${a}$ 到 $${b}$ 的整数个数 $${b} - ${a} + 1$。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "This shrinks the interval and cuts off half of each end value: the endpoints must move outward.",
                "这把区间缩小了，切掉了两端各一半：端点应向外移。",
              ],
              [opts[2]!.en, "No correction is applied, so half of each end value is left out.", "这里没有做修正，两端的值各漏掉了一半。"],
              [
                opts[3]!.en,
                "Moving by a whole unit brings in parts of the integers just outside the range: the correction is $0.5$.",
                "移动整整一个单位会把范围外的整数也算进一部分：修正量是 $0.5$。",
              ],
            ],
          );
        },
      },
      {
        id: "calculating-probability-with-continuity-correction",
        title: t("Evaluating probability with continuity correction", "利用连续性校正计算近似概率"),
        explanation: t(
          "After widening the interval by one half at each end, compute the probability of the continuous variable over the widened interval. For an approximating continuous variable $Y$ with constant density $\\frac{1}{L}$, $P(a \\le X \\le b) \\approx \\int_{a - 0.5}^{b + 0.5} \\frac{1}{L} \\, dy = \\frac{b - a + 1}{L}$. With $L = 200$, $P(30 \\le X \\le 39) \\approx \\frac{39.5 - 29.5}{200} = \\frac{10}{200} = \\frac{1}{20}$.\n\n> **Watch out.** The corrected width is $b - a + 1$, the number of whole numbers from $a$ to $b$, not $b - a$.",
          "把区间两端各扩大二分之一后，计算连续变量在扩大后区间上的概率。若近似连续型随机变量 $Y$ 具有恒定密度 $\\frac{1}{L}$，则 $P(a \\le X \\le b) \\approx \\int_{a - 0.5}^{b + 0.5} \\frac{1}{L} \\, dy = \\frac{b - a + 1}{L}$。当 $L = 200$ 时，$P(30 \\le X \\le 39) \\approx \\frac{39.5 - 29.5}{200} = \\frac{10}{200} = \\frac{1}{20}$。\n\n> **注意。** 校正后的宽度是 $b - a + 1$，即从 $a$ 到 $b$ 的整数个数，而不是 $b - a$。",
        ),
        generate: (rng: Rng): Problem => {
          const L = rng.int(40, 150);
          const a = rng.int(5, 25);
          const count = rng.int(3, 20);
          const b = a + count - 1;
          const answer = Q.of(count, L);

          return numberProblem({
            prompt: t(
              `A discrete integer random variable $X$ is approximated by a continuous variable $Y$ uniformly distributed on $[0, ${L}]$ with density $f(y) = \\frac{1}{${L}}$. Using continuity correction, calculate the approximate probability $P(${a} \\le X \\le ${b})$.`,
              `离散整值随机变量 $X$ 由区间 $[0, ${L}]$ 上均匀分布的连续型随机变量 $Y$（密度为 $f(y) = \\frac{1}{${L}}$）近似。应用连续性校正，求 $P(${a} \\le X \\le ${b})$ 的近似概率。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(count - 1, L),
                `That uses the width $${b} - ${a}$ without the correction, leaving out half of each end value.`,
                `那是用了未校正的宽度 $${b} - ${a}$，漏掉了两端值各一半。`,
              ),
              why(
                Q.of(count + 1, L),
                `That is one unit too wide: the corrected interval has width $${b} - ${a} + 1$.`,
                `那宽了一个单位：校正后的区间宽度是 $${b} - ${a} + 1$。`,
              ),
              why(Q.of(1, L), "That is the probability of a single whole number.", "那是单个整数的概率。"),
            ]),
            solution: walked(
              [
                [
                  ["Correct the interval", "校正区间"],
                  t(
                    `$P(${a} \\le X \\le ${b}) \\approx P(${a - 0.5} \\le Y \\le ${b + 0.5})$, an interval of width $${b + 0.5} - ${a - 0.5} = ${count}$.`,
                    `$P(${a} \\le X \\le ${b}) \\approx P(${a - 0.5} \\le Y \\le ${b + 0.5})$，区间宽度为 $${b + 0.5} - ${a - 0.5} = ${count}$。`,
                  ),
                ],
                [
                  ["Integrate the density", "对密度积分"],
                  t(
                    `$\\int_{${a - 0.5}}^{${b + 0.5}} \\frac{1}{${L}}\\,dy = \\frac{${count}}{${L}}${lowestTerms(count, L)}$.`,
                    `$\\int_{${a - 0.5}}^{${b + 0.5}} \\frac{1}{${L}}\\,dy = \\frac{${count}}{${L}}${lowestTerms(count, L)}$。`,
                  ),
                ],
              ],
              t(
                `There are $${b} - ${a} + 1 = ${count}$ whole numbers from $${a}$ to $${b}$, each given $\\frac{1}{${L}}$.`,
                `从 $${a}$ 到 $${b}$ 共有 $${b} - ${a} + 1 = ${count}$ 个整数，每个分得 $\\frac{1}{${L}}$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 1.3.8 Simulating Random Observations
  {
    id: "simulating-random-observations",
    title: t("Simulating Random Observations", "模拟随机观测值"),
    summary: t(
      "Inverse transform sampling generates observations from a distribution with CDF $F(x)$ by setting $x = F^{-1}(u)$, where $u$ is drawn from $\\text{Uniform}(0, 1)$.",
      "逆变换抽样令 $x = F^{-1}(u)$（$u$ 取自 $\\text{Uniform}(0, 1)$），生成服从累积分布函数 $F(x)$ 的随机观测值。",
    ),
    intro: t(
      "A random variable has $F(x) = \\frac{x^2}{10000}$ on $[0, 100]$, and a random number generator gives $u = 0.49$. Solving $F(x) = u$ turns the draw into an observation: $x^2 = 0.49 \\cdot 10000 = 4900$, so $x = 70$.\n\nCheck: $F(70) = \\frac{4900}{10000} = 0.49$, the draw we started from.\n\nIn this lesson we derive the inverse of a cumulative distribution function and use it to turn uniform draws into observations, for continuous and discrete variables.",
      "某随机变量在 $[0, 100]$ 上有 $F(x) = \\frac{x^2}{10000}$，随机数生成器给出 $u = 0.49$。解 $F(x) = u$ 就把这个抽样值变成一个观测值：$x^2 = 0.49 \\cdot 10000 = 4900$，所以 $x = 70$。\n\n检验：$F(70) = \\frac{4900}{10000} = 0.49$，正是开始时的抽样值。\n\n本课我们推导累积分布函数的反函数，并用它把均匀抽样值变成连续变量和离散变量的观测值。",
    ),
    prerequisites: ["cumulative-distribution-functions-for-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "inverse-transform-sampling-method",
        title: t("Deriving the inverse CDF transformation", "推导逆累积分布函数变换"),
        explanation: t(
          "Feeding uniform random numbers through the inverse of a cumulative distribution function produces samples that follow that distribution. If $U \\sim \\text{Uniform}(0, 1)$, then $X = F^{-1}(U)$ has cumulative distribution function $F(x)$. Solving $u = F(x)$ for $x$ yields the simulation formula. For $F(x) = 1 - e^{-100x}$, the formula is $x = -\\frac{1}{100}\\ln(1 - u)$, and $u = \\frac{1}{2}$ gives $x = \\frac{\\ln 2}{100}$.\n\n> **Watch out.** Keep the minus sign: $\\ln(1 - u)$ is negative, and an exponential variable is never negative. And apply the inverse of $F$ to $u$; putting $u$ into $F$ itself does not simulate anything.",
          "把均匀随机数代入累积分布函数的反函数，就能得到服从该分布的样本。若 $U \\sim \\text{Uniform}(0, 1)$，则 $X = F^{-1}(U)$ 的累积分布函数为 $F(x)$。由 $u = F(x)$ 解出 $x$ 即得模拟公式。对于 $F(x) = 1 - e^{-100x}$，公式为 $x = -\\frac{1}{100}\\ln(1 - u)$，$u = \\frac{1}{2}$ 时 $x = \\frac{\\ln 2}{100}$。\n\n> **注意。** 要保留负号：$\\ln(1 - u)$ 是负的，而指数变量从不取负值。还要对 $u$ 用 $F$ 的反函数；把 $u$ 代入 $F$ 本身并不能模拟。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 50);
          const opts = [
            t(`$-\\frac{1}{${lambda}} \\ln(1 - u)$`, `$-\\frac{1}{${lambda}} \\ln(1 - u)$`),
            t(`$\\frac{1}{${lambda}} \\ln(1 - u)$`, `$\\frac{1}{${lambda}} \\ln(1 - u)$`),
            t(`$1 - e^{-${lambda} u}$`, `$1 - e^{-${lambda} u}$`),
            t(`$-\\frac{1}{${lambda}} (1 - u)$`, `$-\\frac{1}{${lambda}} (1 - u)$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((idx) => opts[idx]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `An exponential random variable $X$ has CDF $F(x) = 1 - e^{-${lambda} x}$ for $x \\ge 0$. Which formula simulates an observation of $X$ from a uniform random draw $u \\in (0, 1)$?`,
                `指数型随机变量 $X$ 的累积分布函数为 $F(x) = 1 - e^{-${lambda} x}$（$x \\ge 0$）。从均匀随机数 $u \\in (0, 1)$ 模拟 $X$ 的观测值时，对应的公式是哪一个？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Set the CDF equal to the draw", "令累积分布函数等于抽样值"],
                    t(
                      `$u = 1 - e^{-${lambda} x}$, so $e^{-${lambda} x} = 1 - u$.`,
                      `$u = 1 - e^{-${lambda} x}$，所以 $e^{-${lambda} x} = 1 - u$。`,
                    ),
                  ],
                  [
                    ["Take logarithms", "取对数"],
                    t(
                      `$-${lambda} x = \\ln(1 - u)$, so $x = -\\frac{1}{${lambda}} \\ln(1 - u)$.`,
                      `$-${lambda} x = \\ln(1 - u)$，所以 $x = -\\frac{1}{${lambda}} \\ln(1 - u)$。`,
                    ),
                  ],
                ],
                t(
                  `For $0 < u < 1$, $\\ln(1 - u) < 0$, so $x > 0$; and $F(x) = 1 - e^{\\ln(1 - u)} = 1 - (1 - u) = u$.`,
                  `当 $0 < u < 1$ 时 $\\ln(1 - u) < 0$，所以 $x > 0$；而且 $F(x) = 1 - e^{\\ln(1 - u)} = 1 - (1 - u) = u$。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "The sign is wrong: $\\ln(1 - u)$ is negative, so this value would be negative, and an exponential variable is not.",
                "符号错了：$\\ln(1 - u)$ 是负的，这个值就是负的，而指数变量不取负值。",
              ],
              [
                opts[2]!.en,
                "This puts $u$ into the CDF, but the method applies the inverse of the CDF to $u$.",
                "这是把 $u$ 代入分布函数，但这种方法是对 $u$ 用分布函数的反函数。",
              ],
              [opts[3]!.en, "The logarithm is missing: undoing the exponential needs it.", "缺了对数：要解开指数函数就需要它。"],
            ],
          );
        },
      },
      {
        id: "simulating-observations-from-uniform-draws",
        title: t("Computing a simulated value from a uniform draw", "由均匀分布抽样计算模拟值"),
        explanation: t(
          "Set the cumulative distribution function equal to the uniform draw and solve for the value, which is the simulated observation. Given the CDF $F(x) = \\frac{x^2}{b^2}$ and a uniform draw $u$, the simulated observation is $x = b\\sqrt{u}$. For $F(x) = \\frac{x^2}{10000}$ on $[0, 100]$ and $u = \\frac{1}{100}$, $x^2 = 100$ and $x = 10$.\n\n> **Watch out.** The observation is not $u$ times the length of the interval; that holds only for a uniform variable. Take the square root of $u b^2$, and keep the root that lies in the support.",
          "令累积分布函数等于这个均匀抽样值，再解出相应的值，它就是模拟的观测值。给定累积分布函数 $F(x) = \\frac{x^2}{b^2}$ 及均匀抽样值 $u$，模拟观测值为 $x = b\\sqrt{u}$。对于 $[0, 100]$ 上的 $F(x) = \\frac{x^2}{10000}$ 和 $u = \\frac{1}{100}$，$x^2 = 100$，$x = 10$。\n\n> **注意。** 观测值不是 $u$ 乘以区间长度；那只对均匀分布成立。要对 $u b^2$ 开平方，并取落在支撑集内的根。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
          const mult = rng.int(1, 6);
          const b = 10 * mult;
          const uNum = k * k;
          const xSim = k * mult;

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ on $[0, ${b}]$ has CDF $F(x) = \\frac{x^2}{${b * b}}$. In a simulation experiment, a pseudo-random number generator produces $u = \\frac{${uNum}}{100}$. Find the simulated observation $x = F^{-1}(u)$.`,
              `连续型随机变量 $X$ 在 $[0, ${b}]$ 上的累积分布函数为 $F(x) = \\frac{x^2}{${b * b}}$。在一次模拟实验中，伪随机数生成器产生抽样值 $u = \\frac{${uNum}}{100}$。求模拟观测值 $x = F^{-1}(u)$。`,
            ),
            answer: xSim,
            mistakes: distinct(xSim, [
              why(
                Q.of(uNum * b, 100),
                `That is $u$ times $${b}$, which would be right for a uniform variable; here $F$ grows like $x^2$.`,
                `那是 $u$ 乘以 $${b}$，这只对均匀分布成立；这里 $F$ 按 $x^2$ 增长。`,
              ),
              why(b - xSim, "That counts down from the top of the interval.", "那是从区间的上端往下数。"),
              why(
                k,
                `That is $\\sqrt{${uNum}}$ alone; the root must be taken of $x^2 = \\frac{${uNum}}{100} \\cdot ${b * b}$.`,
                `那只是 $\\sqrt{${uNum}}$；应当对 $x^2 = \\frac{${uNum}}{100} \\cdot ${b * b}$ 开方。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Set the CDF equal to the draw", "令累积分布函数等于抽样值"],
                  t(
                    `$\\frac{x^2}{${b * b}} = \\frac{${uNum}}{100}$, so $x^2 = \\frac{${uNum} \\cdot ${b * b}}{100} = ${mult * mult * uNum}$.`,
                    `$\\frac{x^2}{${b * b}} = \\frac{${uNum}}{100}$，所以 $x^2 = \\frac{${uNum} \\cdot ${b * b}}{100} = ${mult * mult * uNum}$。`,
                  ),
                ],
                [
                  ["Take the root in the support", "取支撑集内的根"],
                  t(
                    `$x = \\sqrt{${mult * mult * uNum}} = ${xSim}$, which lies in $[0, ${b}]$.`,
                    `$x = \\sqrt{${mult * mult * uNum}} = ${xSim}$，在 $[0, ${b}]$ 内。`,
                  ),
                ],
              ],
              t(
                `$F(${xSim}) = \\frac{${xSim * xSim}}{${b * b}} = \\frac{${uNum}}{100}$, the draw we started from.`,
                `$F(${xSim}) = \\frac{${xSim * xSim}}{${b * b}} = \\frac{${uNum}}{100}$，正是开始时的抽样值。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 1.4.3 The Distribution Function Method
  {
    id: "the-distribution-function-method",
    title: t("The Distribution Function Method", "分布函数法"),
    summary: t(
      "The distribution function method finds the density of $Y = g(X)$ by first finding the CDF $F_Y(y) = P(g(X) \\le y)$ and then differentiating: $f_Y(y) = F_Y'(y)$.",
      "分布函数法先求 $Y = g(X)$ 的累积分布函数 $F_Y(y) = P(g(X) \\le y)$，再求导得到密度：$f_Y(y) = F_Y'(y)$。",
    ),
    intro: t(
      "Let $X$ be uniform on $[0, 50]$ and $Y = 4X + 10$. To find $P(Y \\le 110)$, rewrite the event in terms of $X$: $4X + 10 \\le 110$ means $X \\le 25$, so $F_Y(110) = \\frac{25}{50} = \\frac{1}{2}$.\n\nCheck: $Y$ runs from $10$ to $4 \\cdot 50 + 10 = 210$, and $110$ is the midpoint, as a uniform variable shifted and scaled should give.\n\nIn this lesson we find the cumulative distribution function of a transformed variable by rewriting events, and differentiate it to get the density.",
      "设 $X$ 在 $[0, 50]$ 上均匀分布，$Y = 4X + 10$。要求 $P(Y \\le 110)$，先把事件改写成关于 $X$ 的事件：$4X + 10 \\le 110$ 即 $X \\le 25$，所以 $F_Y(110) = \\frac{25}{50} = \\frac{1}{2}$。\n\n检验：$Y$ 的取值从 $10$ 到 $4 \\cdot 50 + 10 = 210$，而 $110$ 是中点，与均匀变量平移和缩放后的结果一致。\n\n本课我们通过改写事件求变换后变量的累积分布函数，再求导得到密度。",
    ),
    prerequisites: [
      "one-to-one-transformations-of-discrete-random-variables",
      "cumulative-distribution-functions-for-continuous-random-variables",
    ],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-cdf-of-transformed-variable",
        title: t("Evaluating the CDF of a linear transformation", "计算线性变换后随机变量的累积分布函数"),
        explanation: t(
          "Rewrite the event about the new variable as an event about the old one, then use the known distribution of the old variable. For $X \\sim \\text{Uniform}(0, b)$ and $Y = aX + c$ with $a > 0$, $F_Y(y) = P(aX + c \\le y) = P\\left(X \\le \\frac{y - c}{a}\\right) = \\frac{y - c}{ab}$. For $X$ uniform on $[0, 40]$ and $Y = 10X + 20$, $F_Y(120) = P(X \\le 10) = \\frac{10}{40} = \\frac{1}{4}$.\n\n> **Watch out.** Undo the transformation in reverse order: subtract the shift, then divide by the scale. Putting $y$ straight into $F_X$ skips both.",
          "把关于新变量的事件改写成关于旧变量的事件，再利用旧变量的已知分布。若 $X \\sim \\text{Uniform}(0, b)$ 且 $Y = aX + c$（$a > 0$），则 $F_Y(y) = P(aX + c \\le y) = P\\left(X \\le \\frac{y - c}{a}\\right) = \\frac{y - c}{ab}$。若 $X$ 在 $[0, 40]$ 上均匀分布且 $Y = 10X + 20$，则 $F_Y(120) = P(X \\le 10) = \\frac{10}{40} = \\frac{1}{4}$。\n\n> **注意。** 要按相反的顺序还原变换：先减去平移量，再除以缩放因子。把 $y$ 直接代入 $F_X$ 就把两步都跳过了。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(4, 25);
          const a = rng.int(2, 8);
          const c = rng.int(1, 15);
          const k = rng.int(1, b - 1);
          const y0 = a * k + c;
          const answer = Q.of(k, b);

          return numberProblem({
            prompt: t(
              `Let $X$ be uniformly distributed on $[0, ${b}]$, so $F_X(x) = \\frac{x}{${b}}$ for $0 \\le x \\le ${b}$. Define $Y = ${a} X + ${c}$. Find the value of $F_Y(${y0}) = P(Y \\le ${y0})$.`,
              `设 $X$ 服从区间 $[0, ${b}]$ 上的均匀分布，其 CDF 为 $F_X(x) = \\frac{x}{${b}}$（$0 \\le x \\le ${b}$）。定义 $Y = ${a} X + ${c}$。求 $F_Y(${y0}) = P(Y \\le ${y0})$ 的值。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(y0, b),
                `That is $F_X(${y0})$: it puts $${y0}$ into the CDF of $X$ without undoing the transformation.`,
                `那是 $F_X(${y0})$：把 $${y0}$ 直接代入 $X$ 的累积分布函数，没有还原变换。`,
              ),
              why(
                Q.of(y0 - c, b),
                `That subtracts the shift $${c}$ but forgets to divide by $${a}$.`,
                `那是减去了平移量 $${c}$，却忘了除以 $${a}$。`,
              ),
              why(Q.of(b - k, b), `That is $P(Y > ${y0})$, the other side.`, `那是 $P(Y > ${y0})$，是另一侧。`),
            ]),
            solution: walked(
              [
                [
                  ["Rewrite the event", "改写事件"],
                  t(
                    `$${a} X + ${c} \\le ${y0}$ means $X \\le \\frac{${y0} - ${c}}{${a}} = \\frac{${y0 - c}}{${a}} = ${k}$.`,
                    `$${a} X + ${c} \\le ${y0}$ 即 $X \\le \\frac{${y0} - ${c}}{${a}} = \\frac{${y0 - c}}{${a}} = ${k}$。`,
                  ),
                ],
                [
                  ["Use the CDF of X", "用 $X$ 的累积分布函数"],
                  t(
                    `$F_Y(${y0}) = P(X \\le ${k}) = \\frac{${k}}{${b}}${lowestTerms(k, b)}$.`,
                    `$F_Y(${y0}) = P(X \\le ${k}) = \\frac{${k}}{${b}}${lowestTerms(k, b)}$。`,
                  ),
                ],
              ],
              t(
                `$Y$ is uniform on $[${c}, ${a * b + c}]$, so $F_Y(y) = \\frac{y - ${c}}{${a * b}}$ and $F_Y(${y0}) = \\frac{${a * k}}{${a * b}}${lowestTerms(a * k, a * b)}$.`,
                `$Y$ 在 $[${c}, ${a * b + c}]$ 上均匀分布，所以 $F_Y(y) = \\frac{y - ${c}}{${a * b}}$，$F_Y(${y0}) = \\frac{${a * k}}{${a * b}}${lowestTerms(a * k, a * b)}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "pdf-via-distribution-function-method",
        title: t("Deriving the PDF by differentiating the CDF", "通过对 CDF 求导推导概率密度函数"),
        explanation: t(
          "Find the cumulative distribution function of the new variable first, then differentiate it to get the density. For $Y = X^2$ with $X \\sim \\text{Uniform}(0, b)$, $F_Y(y) = P(X \\le \\sqrt{y}) = \\frac{\\sqrt{y}}{b}$, so differentiating gives $f_Y(y) = \\frac{1}{2b\\sqrt{y}}$ for $0 < y < b^2$. For $X$ uniform on $(0, 30)$, $f_Y(100) = \\frac{1}{60 \\cdot 10} = \\frac{1}{600}$.\n\n> **Watch out.** The density of $Y$ is not the density of $X$: squaring stretches the values unevenly. And the derivative of $\\sqrt{y}$ is $\\frac{1}{2\\sqrt{y}}$, so do not lose the factor $\\frac{1}{2}$.",
          "先求出新变量的累积分布函数，再对它求导得到密度。对于 $X \\sim \\text{Uniform}(0, b)$ 且 $Y = X^2$，$F_Y(y) = P(X \\le \\sqrt{y}) = \\frac{\\sqrt{y}}{b}$，求导得 $f_Y(y) = \\frac{1}{2b\\sqrt{y}}$（$0 < y < b^2$）。若 $X$ 在 $(0, 30)$ 上均匀分布，则 $f_Y(100) = \\frac{1}{60 \\cdot 10} = \\frac{1}{600}$。\n\n> **注意。** $Y$ 的密度不是 $X$ 的密度：平方把取值不均匀地拉开了。而且 $\\sqrt{y}$ 的导数是 $\\frac{1}{2\\sqrt{y}}$，不要丢掉因子 $\\frac{1}{2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(3, 20);
          const m = rng.int(1, b - 1);
          const y0 = m * m;
          const den = 2 * b * m;
          const answer = Q.of(1, den);

          return numberProblem({
            prompt: t(
              `Let $X$ be uniformly distributed on $(0, ${b})$ with PDF $f_X(x) = \\frac{1}{${b}}$. Let $Y = X^2$. Using the distribution function method, evaluate the probability density function $f_Y(y)$ at $y = ${y0}$.`,
              `设随机变量 $X$ 服从 $(0, ${b})$ 上的均匀分布，密度为 $f_X(x) = \\frac{1}{${b}}$。令 $Y = X^2$。应用分布函数法，求 $Y$ 的概率密度函数在 $y = ${y0}$ 处的值 $f_Y(${y0})$。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(1, b),
                "That is the density of $X$; squaring stretches the values, so the density of $Y$ is different.",
                "那是 $X$ 的密度；平方把取值拉开了，所以 $Y$ 的密度不同。",
              ),
              why(
                Q.of(1, b * m),
                "That forgets the $\\frac{1}{2}$ from differentiating $\\sqrt{y}$.",
                "那是忘了 $\\sqrt{y}$ 求导时产生的 $\\frac{1}{2}$。",
              ),
              why(
                Q.of(m, b),
                `That is $F_Y(${y0})$, the probability up to $${y0}$, not the density.`,
                `那是 $F_Y(${y0})$，即到 $${y0}$ 为止的概率，不是密度。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the CDF of Y", "求 $Y$ 的累积分布函数"],
                  t(
                    `For $0 < y < ${b * b}$, $F_Y(y) = P(X^2 \\le y) = P(X \\le \\sqrt{y}) = \\frac{\\sqrt{y}}{${b}}$.`,
                    `当 $0 < y < ${b * b}$ 时，$F_Y(y) = P(X^2 \\le y) = P(X \\le \\sqrt{y}) = \\frac{\\sqrt{y}}{${b}}$。`,
                  ),
                ],
                [
                  ["Differentiate", "求导"],
                  t(
                    `$f_Y(y) = \\frac{1}{${2 * b}\\sqrt{y}}$, so $f_Y(${y0}) = ${overProduct(2 * b, m)}${m === 1 ? "" : ` = \\frac{1}{${den}}`}$.`,
                    `$f_Y(y) = \\frac{1}{${2 * b}\\sqrt{y}}$，所以 $f_Y(${y0}) = ${overProduct(2 * b, m)}${m === 1 ? "" : ` = \\frac{1}{${den}}`}$。`,
                  ),
                ],
              ],
              t(
                `Integrating the density back gives the probability: $\\int_0^${y0 < 10 ? y0 : `{${y0}}`} \\frac{dy}{${2 * b}\\sqrt{y}} = \\frac{\\sqrt{${y0}}}{${b}} = \\frac{${m}}{${b}} = F_Y(${y0})$.`,
                `把密度积分回去得到概率：$\\int_0^${y0 < 10 ? y0 : `{${y0}}`} \\frac{dy}{${2 * b}\\sqrt{y}} = \\frac{\\sqrt{${y0}}}{${b}} = \\frac{${m}}{${b}} = F_Y(${y0})$。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 1.4.4 The Change-of-Variables Method for Continuous Random Variables
  {
    id: "the-change-of-variables-method-for-continuous-random-variables",
    title: t("The Change-of-Variables Method for Continuous Random Variables", "连续型随机变量的变量代换法"),
    summary: t(
      "For a strictly monotonic transformation $Y = g(X)$, the density of $Y$ is $f_Y(y) = f_X(g^{-1}(y)) \\left|\\frac{d}{dy} g^{-1}(y)\\right|$.",
      "对于严格单调变换 $Y = g(X)$，$Y$ 的概率密度为 $f_Y(y) = f_X(g^{-1}(y)) \\left|\\frac{d}{dy} g^{-1}(y)\\right|$。",
    ),
    intro: t(
      "Let $X$ have density $30e^{-30x}$ for $x > 0$, and let $Y = 15X$. Then $x = \\frac{y}{15}$ and $\\frac{dx}{dy} = \\frac{1}{15}$, so $f_Y(y) = 30e^{-30 \\cdot y/15} \\cdot \\frac{1}{15} = 2e^{-2y}$.\n\nCheck: $\\int_0^\\infty 2e^{-2y}\\,dy = 1$, so the new density still carries total probability one.\n\nIn this lesson we find the density of a one to one transformation from the density of the original variable and the derivative of the inverse.",
      "设 $X$ 在 $x > 0$ 上的密度为 $30e^{-30x}$，令 $Y = 15X$。则 $x = \\frac{y}{15}$，$\\frac{dx}{dy} = \\frac{1}{15}$，所以 $f_Y(y) = 30e^{-30 \\cdot y/15} \\cdot \\frac{1}{15} = 2e^{-2y}$。\n\n检验：$\\int_0^\\infty 2e^{-2y}\\,dy = 1$，新密度的总概率仍为一。\n\n本课我们由原变量的密度和反函数的导数，求一一对应变换后的密度。",
    ),
    prerequisites: ["the-distribution-function-method"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "change-of-variables-scale-transformation",
        title: t("Applying the change-of-variables formula for scaling", "应用变量代换公式求解尺度变换"),
        explanation: t(
          "Scaling a variable stretches its density horizontally, so the density must be divided by the scale factor to keep the total probability one. If $Y = cX$ with $c > 0$, then $x = \\frac{y}{c}$ and $\\left|\\frac{dx}{dy}\\right| = \\frac{1}{c}$. Hence $f_Y(y) = \\frac{1}{c} f_X\\left(\\frac{y}{c}\\right)$. For $f_X(x) = 36e^{-36x}$ and $Y = 12X$, $f_Y(y) = \\frac{36}{12}e^{-36y/12} = 3e^{-3y}$.\n\n> **Watch out.** Both places change: the factor in front and the rate in the exponent are each divided by $c$. Multiplying by $c$ instead would squeeze the density rather than stretch it.",
          "对变量缩放会在水平方向拉伸它的密度，所以密度要除以缩放因子，使总概率保持为 1。若 $Y = cX$（$c > 0$），则 $x = \\frac{y}{c}$ 且 $\\left|\\frac{dx}{dy}\\right| = \\frac{1}{c}$。因此 $f_Y(y) = \\frac{1}{c} f_X\\left(\\frac{y}{c}\\right)$。对于 $f_X(x) = 36e^{-36x}$ 和 $Y = 12X$，$f_Y(y) = \\frac{36}{12}e^{-36y/12} = 3e^{-3y}$。\n\n> **注意。** 两处都要变：前面的因子和指数中的比率都要除以 $c$。改成乘以 $c$ 会把密度压缩而不是拉伸。",
        ),
        generate: (rng: Rng): Problem => {
          const c = rng.int(2, 10);
          let lambda = rng.int(2, 20);
          if (lambda === c) lambda += 2;
          const opts = [
            t(`$\\frac{${lambda}}{${c}} e^{-\\frac{${lambda}}{${c}} y}$`, `$\\frac{${lambda}}{${c}} e^{-\\frac{${lambda}}{${c}} y}$`),
            t(`$\\frac{${c}}{${lambda}} e^{-\\frac{${c}}{${lambda}} y}$`, `$\\frac{${c}}{${lambda}} e^{-\\frac{${c}}{${lambda}} y}$`),
            t(`$${lambda * c} e^{-${lambda * c} y}$`, `$${lambda * c} e^{-${lambda * c} y}$`),
            t(`$\\frac{1}{${c}} e^{-${lambda} y}$`, `$\\frac{1}{${c}} e^{-${lambda} y}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((idx) => opts[idx]!);
          const correct = perm.indexOf(0);
          return reasoned(
            choiceProblem({
              prompt: t(
                `Let $X$ have exponential density $f_X(x) = ${lambda} e^{-${lambda} x}$ for $x > 0$. Using the change-of-variables formula, what is the probability density function $f_Y(y)$ of $Y = ${c} X$ for $y > 0$?`,
                `设 $X$ 服从指数分布，密度为 $f_X(x) = ${lambda} e^{-${lambda} x}$（$x > 0$）。使用变量代换公式，变换 $Y = ${c} X$（$y > 0$）的概率密度函数 $f_Y(y)$ 是什么？`,
              ),
              options,
              correct,
              solution: walked(
                [
                  [
                    ["Invert the transformation", "求反变换"],
                    t(
                      `From $y = ${c} x$, $x = \\frac{y}{${c}}$ and $\\left|\\frac{dx}{dy}\\right| = \\frac{1}{${c}}$.`,
                      `由 $y = ${c} x$ 得 $x = \\frac{y}{${c}}$，$\\left|\\frac{dx}{dy}\\right| = \\frac{1}{${c}}$。`,
                    ),
                  ],
                  [
                    ["Substitute", "代入"],
                    t(
                      `$f_Y(y) = f_X\\left(\\frac{y}{${c}}\\right) \\cdot \\frac{1}{${c}} = \\frac{${lambda}}{${c}} e^{-\\frac{${lambda}}{${c}} y}$.`,
                      `$f_Y(y) = f_X\\left(\\frac{y}{${c}}\\right) \\cdot \\frac{1}{${c}} = \\frac{${lambda}}{${c}} e^{-\\frac{${lambda}}{${c}} y}$。`,
                    ),
                  ],
                ],
                t(
                  `This is an exponential density with rate $\\frac{${lambda}}{${c}}$, so its total is $1$ and its mean is $\\frac{${c}}{${lambda}}$, which is $${c}$ times the mean $\\frac{1}{${lambda}}$ of $X$.`,
                  `这是比率为 $\\frac{${lambda}}{${c}}$ 的指数密度，总概率为 $1$，均值为 $\\frac{${c}}{${lambda}}$，是 $X$ 的均值 $\\frac{1}{${lambda}}$ 的 $${c}$ 倍。`,
                ),
              ),
            }),
            [
              [
                opts[1]!.en,
                "The rate is upside down: multiplying the variable by a constant divides the rate by it.",
                "比率颠倒了：变量乘以常数时，比率要除以这个常数。",
              ],
              [
                opts[2]!.en,
                "Multiplying the variable by a constant divides the rate by it, rather than multiplying.",
                "变量乘以常数时，比率要除以这个常数，而不是乘以它。",
              ],
              [
                opts[3]!.en,
                "Both places must change: the exponent also has $y$ divided by the constant.",
                "两处都要变：指数中的 $y$ 也要除以这个常数。",
              ],
            ],
          );
        },
      },
      {
        id: "evaluating-transformed-density-at-a-point",
        title: t("Evaluating the transformed density at a point", "计算变换后密度函数在特定点的值"),
        explanation: t(
          "For a one to one transformation, the new density is the old density at the matching point times the absolute value of the derivative of the inverse. For $Y = \\frac{c}{X}$ with $X \\sim \\text{Uniform}(0, b)$, $x = \\frac{c}{y}$ and $\\left|\\frac{dx}{dy}\\right| = \\frac{c}{y^2}$. The density is $f_Y(y) = \\frac{c}{by^2}$ for $y > \\frac{c}{b}$. For $X$ uniform on $(0, 20)$ and $Y = \\frac{10}{X}$, $f_Y(5) = \\frac{10}{20 \\cdot 25} = \\frac{1}{50}$.\n\n> **Watch out.** The derivative of $\\frac{c}{y}$ has $y^2$ in the denominator, not $y$. And the factor $\\left|\\frac{dx}{dy}\\right|$ is needed: the density of $X$ alone is not the density of $Y$.",
          "对于一一对应的变换，新密度等于旧密度在对应点处的值乘以反函数导数的绝对值。对于 $X \\sim \\text{Uniform}(0, b)$ 且 $Y = \\frac{c}{X}$，$x = \\frac{c}{y}$ 且 $\\left|\\frac{dx}{dy}\\right| = \\frac{c}{y^2}$。密度函数为 $f_Y(y) = \\frac{c}{by^2}$（$y > \\frac{c}{b}$）。若 $X$ 在 $(0, 20)$ 上均匀分布且 $Y = \\frac{10}{X}$，则 $f_Y(5) = \\frac{10}{20 \\cdot 25} = \\frac{1}{50}$。\n\n> **注意。** $\\frac{c}{y}$ 的导数分母是 $y^2$，不是 $y$。而且因子 $\\left|\\frac{dx}{dy}\\right|$ 不能少：单是 $X$ 的密度并不是 $Y$ 的密度。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(2, 10);
          const c = rng.int(2, 8);
          const k = rng.int(2, 6);
          const num = b;
          const den = k * k * c;
          const answer = Q.of(num, den);

          return numberProblem({
            prompt: t(
              `Let $X$ be uniformly distributed on $(0, ${b})$ with density $f_X(x) = \\frac{1}{${b}}$. Let $Y = \\frac{${c}}{X}$. Find the value of the PDF $f_Y(y)$ at $y = \\frac{${k * c}}{${b}}${lowestTerms(k * c, b)}$.`,
              `设 $X$ 服从 $(0, ${b})$ 上的均匀分布，密度为 $f_X(x) = \\frac{1}{${b}}$。令 $Y = \\frac{${c}}{X}$。求概率密度函数 $f_Y(y)$ 在 $y = \\frac{${k * c}}{${b}}${lowestTerms(k * c, b)}$ 处的值。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(1, b),
                "That is the density of $X$ alone; it must be multiplied by $\\left|\\frac{dx}{dy}\\right|$.",
                "那只是 $X$ 的密度；还要乘以 $\\left|\\frac{dx}{dy}\\right|$。",
              ),
              why(
                Q.of(1, k),
                `That uses $\\frac{${c}}{y}$ for $\\left|\\frac{dx}{dy}\\right|$; the derivative of $\\frac{${c}}{y}$ is $-\\frac{${c}}{y^2}$.`,
                `那是把 $\\left|\\frac{dx}{dy}\\right|$ 写成了 $\\frac{${c}}{y}$；$\\frac{${c}}{y}$ 的导数是 $-\\frac{${c}}{y^2}$。`,
              ),
              why(
                Q.of(k * k * c, b),
                `That is upside down: $f_Y(y) = \\frac{${c}}{${b} y^2}$ has $y^2$ in the denominator.`,
                `那是颠倒了：$f_Y(y) = \\frac{${c}}{${b} y^2}$ 的分母中有 $y^2$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Invert and differentiate", "求反函数并求导"],
                  t(
                    `$x = \\frac{${c}}{y}$, so $\\left|\\frac{dx}{dy}\\right| = \\frac{${c}}{y^2}$ and $f_Y(y) = \\frac{1}{${b}} \\cdot \\frac{${c}}{y^2} = \\frac{${c}}{${b} y^2}$.`,
                    `$x = \\frac{${c}}{y}$，所以 $\\left|\\frac{dx}{dy}\\right| = \\frac{${c}}{y^2}$，$f_Y(y) = \\frac{1}{${b}} \\cdot \\frac{${c}}{y^2} = \\frac{${c}}{${b} y^2}$。`,
                  ),
                ],
                [
                  ["Evaluate", "代入求值"],
                  t(
                    `At $y = \\frac{${k * c}}{${b}}$, $y^2 = \\frac{${k * k * c * c}}{${b * b}}$, so $f_Y(y) = \\frac{${c}}{${b}} \\cdot \\frac{${b * b}}{${k * k * c * c}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
                    `在 $y = \\frac{${k * c}}{${b}}$ 处，$y^2 = \\frac{${k * k * c * c}}{${b * b}}$，所以 $f_Y(y) = \\frac{${c}}{${b}} \\cdot \\frac{${b * b}}{${k * k * c * c}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
                  ),
                ],
              ],
              t(
                `By the distribution function method, $F_Y(y) = P\\left(X \\ge \\frac{${c}}{y}\\right) = 1 - \\frac{${c}}{${b} y}$, whose derivative is $\\frac{${c}}{${b} y^2}$, the same density.`,
                `用分布函数法，$F_Y(y) = P\\left(X \\ge \\frac{${c}}{y}\\right) = 1 - \\frac{${c}}{${b} y}$，其导数为 $\\frac{${c}}{${b} y^2}$，密度相同。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 1.4.5 The Distribution Function Method With Many-to-One Transformations
  {
    id: "the-distribution-function-method-with-many-to-one-transformations",
    title: t("The Distribution Function Method With Many-to-One Transformations", "多对一变换的分布函数法"),
    summary: t(
      "When $g$ is many-to-one, the preimage of $\\{Y \\le y\\}$ consists of several pieces: for $Y = X^2$, $P(Y \\le y) = P(-\\sqrt{y} \\le X \\le \\sqrt{y}) = F_X(\\sqrt{y}) - F_X(-\\sqrt{y})$.",
      "当 $g$ 为多对一映射时，$\\{Y \\le y\\}$ 的原像由多段组成：例如对 $Y = X^2$，$P(Y \\le y) = P(-\\sqrt{y} \\le X \\le \\sqrt{y}) = F_X(\\sqrt{y}) - F_X(-\\sqrt{y})$。",
    ),
    intro: t(
      "Let $X$ be uniform on $[-30, 30]$ and $Y = X^2$. The event $Y \\le 100$ happens when $X$ is between $-10$ and $10$, both signs included, so $F_Y(100) = \\frac{20}{60} = \\frac{1}{3}$.\n\nCheck: $F_Y(900) = P(-30 \\le X \\le 30) = 1$, the whole range of $X$.\n\nIn this lesson we find the cumulative distribution function and the density of a transformation that sends two values to the same one, such as squaring.",
      "设 $X$ 在 $[-30, 30]$ 上均匀分布，$Y = X^2$。事件 $Y \\le 100$ 在 $X$ 介于 $-10$ 和 $10$ 之间时发生，正负两边都算，所以 $F_Y(100) = \\frac{20}{60} = \\frac{1}{3}$。\n\n检验：$F_Y(900) = P(-30 \\le X \\le 30) = 1$，即 $X$ 的全部范围。\n\n本课我们对把两个值变成同一个值的变换（例如平方），求累积分布函数和密度。",
    ),
    prerequisites: ["the-distribution-function-method", "many-to-one-transformations-of-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "many-to-one-cdf-formulation",
        title: t("Formulating the CDF for symmetric quadratic transformations", "求解对称二次变换的累积分布函数"),
        explanation: t(
          "When two original values map to each new value, the event about the new variable becomes an interval of original values on both sides of zero. For $X \\sim \\text{Uniform}(-a, a)$ and $Y = X^2$, the event $\\{Y \\le y\\}$ is $\\{-\\sqrt{y} \\le X \\le \\sqrt{y}\\}$. Thus $F_Y(y) = \\frac{\\sqrt{y} - (-\\sqrt{y})}{2a} = \\frac{\\sqrt{y}}{a}$ for $0 < y < a^2$. For $X$ uniform on $[-40, 40]$, $F_Y(100) = \\frac{20}{80} = \\frac{1}{4}$.\n\n> **Watch out.** Keep both branches: negative values of $X$ with $X^2 \\le y$ count too. And the interval runs to $\\sqrt{y}$, not to $y$.",
          "当两个原始值映射到同一个新值时，关于新变量的事件就变成零两侧的一个原始取值区间。若 $X \\sim \\text{Uniform}(-a, a)$ 且 $Y = X^2$，则事件 $\\{Y \\le y\\}$ 即 $\\{-\\sqrt{y} \\le X \\le \\sqrt{y}\\}$。因此在 $0 < y < a^2$ 上，$F_Y(y) = \\frac{\\sqrt{y} - (-\\sqrt{y})}{2a} = \\frac{\\sqrt{y}}{a}$。若 $X$ 在 $[-40, 40]$ 上均匀分布，则 $F_Y(100) = \\frac{20}{80} = \\frac{1}{4}$。\n\n> **注意。** 两个分支都要保留：满足 $X^2 \\le y$ 的负值也算在内。而且区间的端点是 $\\sqrt{y}$，不是 $y$。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(3, 25);
          const m = rng.int(1, a - 1);
          const y0 = m * m;
          const answer = Q.of(m, a);

          return numberProblem({
            prompt: t(
              `Let $X$ be uniformly distributed on $[-${a}, ${a}]$. Define $Y = X^2$. Find the value of the CDF $F_Y(${y0}) = P(Y \\le ${y0})$.`,
              `设 $X$ 服从区间 $[-${a}, ${a}]$ 上的均匀分布。定义 $Y = X^2$。求 $F_Y(${y0}) = P(Y \\le ${y0})$ 的值。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(m, 2 * a),
                `That keeps only $0 \\le X \\le ${m}$; the values from $-${m}$ to $0$ also have $X^2 \\le ${y0}$.`,
                `那只保留了 $0 \\le X \\le ${m}$；从 $-${m}$ 到 $0$ 的值也满足 $X^2 \\le ${y0}$。`,
              ),
              why(
                Q.of(y0, 2 * a),
                `That runs the interval to $${y0}$ instead of $\\sqrt{${y0}} = ${m}$.`,
                `那是把区间端点取成 $${y0}$，而不是 $\\sqrt{${y0}} = ${m}$。`,
              ),
              why(Q.of(a - m, a), `That is $P(Y > ${y0})$, the other side.`, `那是 $P(Y > ${y0})$，是另一侧。`),
            ]),
            solution: walked(
              [
                [
                  ["Rewrite the event", "改写事件"],
                  t(`$X^2 \\le ${y0}$ means $-${m} \\le X \\le ${m}$.`, `$X^2 \\le ${y0}$ 即 $-${m} \\le X \\le ${m}$。`),
                ],
                [
                  ["Measure the interval", "求区间所占的比例"],
                  t(
                    `It has length $${2 * m}$ out of $${2 * a}$, so $F_Y(${y0}) = \\frac{${2 * m}}{${2 * a}}${lowestTerms(2 * m, 2 * a)}$.`,
                    `它的长度为 $${2 * m}$，总长为 $${2 * a}$，所以 $F_Y(${y0}) = \\frac{${2 * m}}{${2 * a}}${lowestTerms(2 * m, 2 * a)}$。`,
                  ),
                ],
              ],
              t(
                `The formula $F_Y(y) = \\frac{\\sqrt{y}}{${a}}$ gives $\\frac{${m}}{${a}}$ at $y = ${y0}$, and $F_Y(${a * a}) = 1$ covers the whole range of $X$.`,
                `公式 $F_Y(y) = \\frac{\\sqrt{y}}{${a}}$ 在 $y = ${y0}$ 处给出 $\\frac{${m}}{${a}}$，而 $F_Y(${a * a}) = 1$ 覆盖了 $X$ 的全部范围。`,
              ),
            ),
          });
        },
      },
      {
        id: "many-to-one-pdf-derivation",
        title: t("Differentiating the CDF for a many-to-one transformation", "对多对一变换的 CDF 求导得到概率密度"),
        explanation: t(
          "Differentiating the cumulative distribution function handles both branches at once, giving the density of the new variable. Differentiating $F_Y(y) = \\frac{\\sqrt{y}}{a}$ gives $f_Y(y) = \\frac{1}{2a\\sqrt{y}}$ for $0 < y < a^2$. For $X$ uniform on $[-25, 25]$, $f_Y(100) = \\frac{1}{50 \\cdot 10} = \\frac{1}{500}$.\n\n> **Watch out.** The cumulative distribution function already includes both branches, so do not double its derivative again. Keeping only the positive branch gives half the density.",
          "对累积分布函数求导可以同时处理两个分支，从而得到新变量的密度。对 $F_Y(y) = \\frac{\\sqrt{y}}{a}$ 求导得 $f_Y(y) = \\frac{1}{2a\\sqrt{y}}$（$0 < y < a^2$）。若 $X$ 在 $[-25, 25]$ 上均匀分布，则 $f_Y(100) = \\frac{1}{50 \\cdot 10} = \\frac{1}{500}$。\n\n> **注意。** 累积分布函数已经包含了两个分支，求导后不要再加倍。只保留正的分支会得到一半的密度。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(3, 20);
          const m = rng.int(1, a - 1);
          const y0 = m * m;
          const den = 2 * a * m;
          const answer = Q.of(1, den);

          return numberProblem({
            prompt: t(
              `Let $X$ be uniformly distributed on $[-${a}, ${a}]$ and let $Y = X^2$. Find the value of the PDF $f_Y(y)$ at $y = ${y0}$.`,
              `设 $X$ 服从区间 $[-${a}, ${a}]$ 上的均匀分布，且令 $Y = X^2$。求概率密度函数 $f_Y(y)$ 在 $y = ${y0}$ 处的值。`,
            ),
            answer,
            mistakes: distinct(answer, [
              why(
                Q.of(1, a * m),
                "That doubles the two branches again; the cumulative distribution function already includes both.",
                "那是把两个分支又加倍了；累积分布函数已经包含了两个分支。",
              ),
              why(Q.of(1, 2 * a), "That is the density of $X$; squaring changes the density.", "那是 $X$ 的密度；平方会改变密度。"),
              why(
                Q.of(1, 4 * a * m),
                "That keeps only the positive branch; the negative values of $X$ add as much again.",
                "那只保留了正的分支；$X$ 的负值还要再加上同样多。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the CDF", "求累积分布函数"],
                  t(
                    `For $0 < y < ${a * a}$, $F_Y(y) = P(-\\sqrt{y} \\le X \\le \\sqrt{y}) = \\frac{2\\sqrt{y}}{${2 * a}} = \\frac{\\sqrt{y}}{${a}}$.`,
                    `当 $0 < y < ${a * a}$ 时，$F_Y(y) = P(-\\sqrt{y} \\le X \\le \\sqrt{y}) = \\frac{2\\sqrt{y}}{${2 * a}} = \\frac{\\sqrt{y}}{${a}}$。`,
                  ),
                ],
                [
                  ["Differentiate", "求导"],
                  t(
                    `$f_Y(y) = \\frac{1}{${2 * a}\\sqrt{y}}$, so $f_Y(${y0}) = ${overProduct(2 * a, m)}${m === 1 ? "" : ` = \\frac{1}{${den}}`}$.`,
                    `$f_Y(y) = \\frac{1}{${2 * a}\\sqrt{y}}$，所以 $f_Y(${y0}) = ${overProduct(2 * a, m)}${m === 1 ? "" : ` = \\frac{1}{${den}}`}$。`,
                  ),
                ],
              ],
              t(
                `Each branch $x = \\pm\\sqrt{y}$ contributes $f_X \\cdot \\frac{1}{2\\sqrt{y}} = \\frac{1}{${2 * a}} \\cdot \\frac{1}{2\\sqrt{y}}$, which is $\\frac{1}{${4 * a * m}}$ at $y = ${y0}$, and the two branches add to $\\frac{2}{${4 * a * m}} = \\frac{1}{${den}}$.`,
                `每个分支 $x = \\pm\\sqrt{y}$ 贡献 $f_X \\cdot \\frac{1}{2\\sqrt{y}} = \\frac{1}{${2 * a}} \\cdot \\frac{1}{2\\sqrt{y}}$，在 $y = ${y0}$ 处为 $\\frac{1}{${4 * a * m}}$，两个分支相加得 $\\frac{2}{${4 * a * m}} = \\frac{1}{${den}}$。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
