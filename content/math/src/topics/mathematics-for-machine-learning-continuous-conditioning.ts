import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** distinct drops the mistakes whose value repeats an earlier one. */
const distinct = <M extends { readonly value: unknown }>(ms: readonly M[]): M[] =>
  ms.filter((m, i) => ms.findIndex((o) => String(o.value) === String(m.value)) === i);

export const mathematicsForMachineLearningContinuousConditioningTopics: TopicDef[] = [
  // 11.42.6 Conditional Expectation for Continuous Random Variables
  {
    id: "conditional-expectation-for-continuous-random-variables",
    title: t("Conditional Expectation for Continuous Random Variables", "连续随机变量的条件期望"),
    summary: t(
      "For continuous random variables $(X, Y)$ with joint density $f(x, y)$ and $f_Y(y) > 0$, the conditional expectation is $E[X \\mid Y = y] = \\int_{-\\infty}^{\\infty} x\\,f_{X \\mid Y}(x \\mid y)\\,dx$, where $f_{X \\mid Y}(x \\mid y) = \\frac{f(x, y)}{f_Y(y)}$.",
      "对于联合密度为 $f(x, y)$ 且 $f_Y(y) > 0$ 的连续随机变量 $(X, Y)$，条件期望为 $E[X \\mid Y = y] = \\int_{-\\infty}^{\\infty} x\\,f_{X \\mid Y}(x \\mid y)\\,dx$，其中 $f_{X \\mid Y}(x \\mid y) = \\frac{f(x, y)}{f_Y(y)}$。",
    ),
    prerequisites: ["conditional-expectation-for-discrete-random-variables", "joint-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 12,
    intro: t(
      "A sensor reports a reading $Y$, and the true signal $X$ is spread evenly between $0$ and the reading. When the sensor shows $Y = 6$, the best guess for $X$ in the squared-error sense is the conditional mean $E[X \\mid Y = 6] = 3$, the middle of $[0, 6]$.\n\nCheck: given $Y = 6$ the conditional density is $\\frac{1}{6}$ on $[0, 6]$, and $\\int_0^6 \\frac{x}{6}\\,dx = \\frac{36}{12} = 3$.\n\nIn this lesson we compute conditional expectations from joint densities and average them over $Y$ with the law of total expectation.",
      "传感器给出读数 $Y$，真实信号 $X$ 均匀分布在 $0$ 和读数之间。当传感器显示 $Y = 6$ 时，在平方误差意义下对 $X$ 的最佳猜测是条件均值 $E[X \\mid Y = 6] = 3$，即 $[0, 6]$ 的中点。\n\n检验：给定 $Y = 6$ 时条件密度在 $[0, 6]$ 上为 $\\frac{1}{6}$，且 $\\int_0^6 \\frac{x}{6}\\,dx = \\frac{36}{12} = 3$。\n\n本课我们由联合密度计算条件期望，并用全期望公式对 $Y$ 求平均。",
    ),
    knowledgePoints: [
      {
        id: "evaluating-continuous-conditional-expectation",
        title: t("Evaluating conditional expectation for continuous distributions", "计算连续分布的条件期望"),
        explanation: t(
          "Find the conditional density by dividing the joint density by the marginal, then compute an ordinary mean with that density. $f_{X \\mid Y}(x \\mid y) = \\frac{f(x, y)}{f_Y(y)}$, and then $E[X \\mid Y = y] = \\int x \\, f_{X \\mid Y}(x \\mid y) \\, dx$. If $X \\mid Y = y \\sim \\text{Uniform}(0, y)$, then $E[X \\mid Y = y] = \\frac{y}{2}$.\n\nFor example, $f(x, y) = 2$ on $0 \\le x \\le y \\le 1$ has $f_Y(y) = 2y$, so $f_{X \\mid Y}(x \\mid y) = \\frac{1}{y}$ on $[0, y]$, and $E[X \\mid Y = \\frac{1}{3}] = \\frac{1}{6}$.\n\nCheck: the conditional density $3$ on $[0, \\frac{1}{3}]$ integrates to $3 \\times \\frac{1}{3} = 1$, and the mean $\\frac{1}{6}$ lies inside $[0, \\frac{1}{3}]$.\n\n> **Watch out.** Divide by $f_Y(y)$ before integrating: $\\int_0^{1/3} 2x\\,dx = \\frac{1}{9}$ is not a mean, because $f(x, \\frac{1}{3}) = 2$ alone integrates to $\\frac{2}{3}$, not to $1$.",
          "把联合密度除以边缘密度得到条件密度，再用这个密度计算普通的均值。$f_{X \\mid Y}(x \\mid y) = \\frac{f(x, y)}{f_Y(y)}$，从而 $E[X \\mid Y = y] = \\int x \\, f_{X \\mid Y}(x \\mid y) \\, dx$。若 $X \\mid Y = y \\sim \\text{Uniform}(0, y)$，则 $E[X \\mid Y = y] = \\frac{y}{2}$。\n\n例如，$0 \\le x \\le y \\le 1$ 上的 $f(x, y) = 2$ 有 $f_Y(y) = 2y$，所以在 $[0, y]$ 上 $f_{X \\mid Y}(x \\mid y) = \\frac{1}{y}$，且 $E[X \\mid Y = \\frac{1}{3}] = \\frac{1}{6}$。\n\n检验：$[0, \\frac{1}{3}]$ 上的条件密度 $3$ 积分为 $3 \\times \\frac{1}{3} = 1$，均值 $\\frac{1}{6}$ 落在 $[0, \\frac{1}{3}]$ 内。\n\n> **注意。** 积分前要先除以 $f_Y(y)$：$\\int_0^{1/3} 2x\\,dx = \\frac{1}{9}$ 不是均值，因为单独的 $f(x, \\frac{1}{3}) = 2$ 积分为 $\\frac{2}{3}$，而不是 $1$。",
        ),
        generate: (rng: Rng): Problem => {
          const kind = rng.int(0, 1);
          if (kind === 0) {
            // Triangular domain: f(x, y) = 2 on 0 <= x <= y <= 1
            // X | Y = y is Uniform(0, y), so E[X | Y = y] = y / 2
            const denom = rng.pick([2, 3, 4, 5, 8, 10]);
            const num = rng.int(1, denom - 1);
            const y0 = Q.of(num, denom);
            const ans = y0.div(Q.of(2));
            const y = y0.toLatex();

            return numberProblem({
              prompt: t(
                `Continuous random variables $(X, Y)$ have joint probability density function $f(x, y) = 2$ for $0 \\le x \\le y \\le 1$ (and $0$ elsewhere). Find the exact value of the conditional expectation $E[X \\mid Y = ${y}]$.`,
                `连续型随机变量 $(X, Y)$ 的联合概率密度函数在 $0 \\le x \\le y \\le 1$ 上为 $f(x, y) = 2$（其余区域为 $0$）。求条件期望 $E[X \\mid Y = ${y}]$ 的精确值。`,
              ),
              answer: ans,
              mistakes: distinct([
                why(
                  y0,
                  `That is the value $y = ${y}$ itself, the right end of the range of $X$; the mean of $\\operatorname{Uniform}(0, y)$ is halfway, $\\frac{y}{2}$.`,
                  `这是 $y = ${y}$ 本身，即 $X$ 取值范围的右端点；$\\operatorname{Uniform}(0, y)$ 的均值在正中间，为 $\\frac{y}{2}$。`,
                ),
                why(
                  Q.of(1, 2),
                  "That is the middle of $[0, 1]$, which ignores the condition; given $Y = y$, $X$ only ranges over $[0, y]$.",
                  "这是 $[0, 1]$ 的中点，忽略了条件；给定 $Y = y$ 时，$X$ 只在 $[0, y]$ 上取值。",
                ),
                why(
                  y0.mul(y0).div(Q.of(2)),
                  `That is $\\int_0^{${y}} x\\,dx$, which drops the conditional density $\\frac{1}{y}$; the integrand must be $x \\cdot \\frac{1}{y}$.`,
                  `这是 $\\int_0^{${y}} x\\,dx$，漏掉了条件密度 $\\frac{1}{y}$；被积函数应为 $x \\cdot \\frac{1}{y}$。`,
                ),
              ]),
              solution: walked(
                [
                  [
                    ["Find the conditional density", "求条件密度"],
                    t(
                      "The marginal density of $Y$ for $0 \\le y \\le 1$ is $f_Y(y) = \\int_0^y 2\\,dx = 2y$. Thus $f_{X|Y}(x \\mid y) = \\frac{f(x, y)}{f_Y(y)} = \\frac{2}{2y} = \\frac{1}{y}$ for $0 \\le x \\le y$, so $X \\mid Y = y \\sim \\operatorname{Uniform}(0, y)$.",
                      "对于 $0 \\le y \\le 1$，$Y$ 的边际密度为 $f_Y(y) = \\int_0^y 2\\,dx = 2y$。因此当 $0 \\le x \\le y$ 时 $f_{X|Y}(x \\mid y) = \\frac{f(x, y)}{f_Y(y)} = \\frac{2}{2y} = \\frac{1}{y}$，即 $X \\mid Y = y \\sim \\operatorname{Uniform}(0, y)$。",
                    ),
                  ],
                  [
                    ["Take the mean at the given value", "在给定值处求均值"],
                    t(
                      `$E[X \\mid Y = y] = \\frac{y}{2}$, so $E[X \\mid Y = ${y}] = \\frac{1}{2} \\left(${y}\\right) = ${ans.toLatex()}$.`,
                      `$E[X \\mid Y = y] = \\frac{y}{2}$，所以 $E[X \\mid Y = ${y}] = \\frac{1}{2} \\left(${y}\\right) = ${ans.toLatex()}$。`,
                    ),
                  ],
                ],
                t(
                  `The mean $${ans.toLatex()}$ lies inside $[0, ${y}]$, the range of $X$ given $Y = ${y}$, exactly at its middle.`,
                  `均值 $${ans.toLatex()}$ 落在给定 $Y = ${y}$ 时 $X$ 的取值范围 $[0, ${y}]$ 内，正好在中点。`,
                ),
              ),
            });
          }

          // Domain: f(x, y) = (2/3)(x + 2y) on [0, 1] x [0, 1]
          // f_Y(y) = int_0^1 (2/3)(x + 2y) dx = (2/3)(1/2 + 2y) = (1/3)(1 + 4y)
          // f_{X|Y}(x | y) = (2/3)(x + 2y) / ((1/3)(1 + 4y)) = 2(x + 2y) / (1 + 4y)
          // E[X | Y = y] = int_0^1 x * 2(x + 2y) / (1 + 4y) dx = (2/(1 + 4y)) int_0^1 (x^2 + 2xy) dx
          //              = (2/(1 + 4y)) (1/3 + y) = (2/3 + 2y) / (1 + 4y) = (2 + 6y) / (3(1 + 4y))
          const denomY = rng.pick([2, 3, 4, 5]);
          const numY = rng.int(1, denomY - 1);
          const yVal = Q.of(numY, denomY);
          const y = yVal.toLatex();

          // ans = (2 + 6*y) / (3*(1 + 4*y))
          const top = Q.of(2).add(Q.of(6).mul(yVal));
          const bot = Q.of(3).mul(Q.of(1).add(Q.of(4).mul(yVal)));
          const ans = top.div(bot);

          return numberProblem({
            prompt: t(
              `The continuous random variables $(X, Y)$ have joint density $f(x, y) = \\frac{2}{3}(x + 2y)$ on the unit square $[0, 1] \\times [0, 1]$. Calculate the exact conditional expectation $E[X \\mid Y = ${y}]$.`,
              `连续型随机变量 $(X, Y)$ 在单位正方形 $[0, 1] \\times [0, 1]$ 上的联合密度为 $f(x, y) = \\frac{2}{3}(x + 2y)$。计算条件期望 $E[X \\mid Y = ${y}]$ 的精确值。`,
            ),
            answer: ans,
            mistakes: distinct([
              why(
                Q.of(1, 2),
                "That is the middle of $[0, 1]$, the mean of a uniform $X$; here the conditional density $\\frac{2(x + 2y)}{1 + 4y}$ is not flat.",
                "这是 $[0, 1]$ 的中点，即均匀分布的 $X$ 的均值；这里的条件密度 $\\frac{2(x + 2y)}{1 + 4y}$ 不是常数。",
              ),
              why(
                top.div(Q.of(3)),
                "That is $\\frac{2 + 6y}{3}$, which drops the factor $1 + 4y$ of the denominator; it comes from dividing by the marginal $f_Y(y)$.",
                "这是 $\\frac{2 + 6y}{3}$，漏掉了分母中的因子 $1 + 4y$；它来自除以边际密度 $f_Y(y)$。",
              ),
              why(
                top.div(Q.of(1).add(Q.of(4).mul(yVal))),
                "That is $\\frac{2 + 6y}{1 + 4y}$, which drops the factor $3$ of the denominator: $\\int_0^1 x^2\\,dx = \\frac{1}{3}$ and $\\int_0^1 2xy\\,dx = y$.",
                "这是 $\\frac{2 + 6y}{1 + 4y}$，漏掉了分母中的因子 $3$：$\\int_0^1 x^2\\,dx = \\frac{1}{3}$，$\\int_0^1 2xy\\,dx = y$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the conditional density", "求条件密度"],
                  t(
                    "The marginal density is $f_Y(y) = \\int_0^1 \\frac{2}{3}(x + 2y)\\,dx = \\frac{1}{3}(1 + 4y)$, so the conditional density is $f_{X|Y}(x \\mid y) = \\frac{2(x + 2y)}{1 + 4y}$.",
                    "边际密度为 $f_Y(y) = \\int_0^1 \\frac{2}{3}(x + 2y)\\,dx = \\frac{1}{3}(1 + 4y)$，所以条件密度为 $f_{X|Y}(x \\mid y) = \\frac{2(x + 2y)}{1 + 4y}$。",
                  ),
                ],
                [
                  ["Integrate and substitute", "积分并代入"],
                  t(
                    `$E[X \\mid Y = y] = \\int_0^1 x f_{X|Y}(x \\mid y)\\,dx = \\frac{2}{1 + 4y}\\left(\\frac{1}{3} + y\\right) = \\frac{2 + 6y}{3(1 + 4y)}$. At $y = ${y}$ the numerator is $${top.toLatex()}$ and the denominator is $${bot.toLatex()}$, so $E[X \\mid Y = ${y}] = ${ans.toLatex()}$.`,
                    `$E[X \\mid Y = y] = \\int_0^1 x f_{X|Y}(x \\mid y)\\,dx = \\frac{2}{1 + 4y}\\left(\\frac{1}{3} + y\\right) = \\frac{2 + 6y}{3(1 + 4y)}$。在 $y = ${y}$ 处分子为 $${top.toLatex()}$，分母为 $${bot.toLatex()}$，所以 $E[X \\mid Y = ${y}] = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$X$ takes values in $[0, 1]$, so its conditional mean must lie there too, and $${ans.toLatex()}$ does.`,
                `$X$ 在 $[0, 1]$ 中取值，所以它的条件均值也必须在其中，$${ans.toLatex()}$ 正是如此。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-law-of-total-expectation",
        title: t("Averaging a conditional expectation", "对条件期望再求平均"),
        explanation: t(
          "The conditional expectation $E[X \\mid Y]$ is itself a random variable, a function of $Y$. Averaging it over $Y$ recovers the plain mean:\n$$E[X] = E\\big[E[X \\mid Y]\\big] = \\int E[X \\mid Y = y]\\, f_Y(y)\\, dy.$$\nThis is often easier than finding the marginal density of $X$. If $Y \\sim \\operatorname{Uniform}(0, 4)$ and $X \\mid Y = y \\sim \\operatorname{Uniform}(0, y)$, then $E[X \\mid Y] = \\frac{Y}{2}$, so $E[X] = \\frac{E[Y]}{2} = \\frac{2}{2} = 1$.\n\nFor example, if $Y \\sim \\operatorname{Uniform}(1, 5)$ and $X \\mid Y = y \\sim \\mathcal{N}(3y - 2,\\ 1)$, then $E[X \\mid Y] = 3Y - 2$ and $E[X] = 3 \\times 3 - 2 = 7$.\n\nCheck: as $Y$ runs over $[1, 5]$, $E[X \\mid Y]$ runs over $[1, 13]$, and a linear function averages to its value at the mean $y = 3$, which is $7$.\n\n> **Watch out.** Average $E[X \\mid Y]$, not $Y$ itself: the answer $E[Y] = 3$ forgets that, given $Y = y$, $X$ has mean $3y - 2$; and keep the constant $-2$.",
          "条件期望 $E[X \\mid Y]$ 本身是一个随机变量，是 $Y$ 的函数。对 $Y$ 求它的平均就得到普通的均值：\n$$E[X] = E\\big[E[X \\mid Y]\\big] = \\int E[X \\mid Y = y]\\, f_Y(y)\\, dy.$$\n这通常比求 $X$ 的边缘密度更容易。若 $Y \\sim \\operatorname{Uniform}(0, 4)$，$X \\mid Y = y \\sim \\operatorname{Uniform}(0, y)$，则 $E[X \\mid Y] = \\frac{Y}{2}$，所以 $E[X] = \\frac{E[Y]}{2} = \\frac{2}{2} = 1$。\n\n例如，若 $Y \\sim \\operatorname{Uniform}(1, 5)$，$X \\mid Y = y \\sim \\mathcal{N}(3y - 2,\\ 1)$，则 $E[X \\mid Y] = 3Y - 2$，$E[X] = 3 \\times 3 - 2 = 7$。\n\n检验：当 $Y$ 取遍 $[1, 5]$ 时，$E[X \\mid Y]$ 取遍 $[1, 13]$，而线性函数的平均等于它在均值 $y = 3$ 处的值，即 $7$。\n\n> **注意。** 要对 $E[X \\mid Y]$ 求平均，而不是对 $Y$ 本身：答案 $E[Y] = 3$ 忘了给定 $Y = y$ 时 $X$ 的均值是 $3y - 2$；常数 $-2$ 也不能丢。",
        ),
        generate: (rng: Rng): Problem => {
          const lo = rng.int(0, 4);
          const hi = lo + rng.int(1, 6);
          const k = rng.pick([1, 2, 3]);
          const shift = rng.int(-3, 5);
          const uniform = rng.bool();
          // E[X | Y] = (k Y) / 2 + shift for X | Y ~ Uniform(shift, k Y + shift), or k Y + shift for a normal.
          const slope = uniform ? Q.of(k, 2) : Q.of(k);
          const meanY = Q.of(lo + hi, 2);
          const ans = slope.mul(meanY).add(Q.of(shift));
          const top = shift === 0 ? (k === 1 ? "y" : `${k}y`) : `${k === 1 ? "y" : `${k}y`} ${shift < 0 ? "-" : "+"} ${Math.abs(shift)}`;
          const cond = uniform ? `\\operatorname{Uniform}(${shift}, ${top})` : `\\mathcal{N}(${top},\\ 1)`;
          const condMean = uniform ? `\\frac{${shift} + (${top})}{2}` : top;
          const tail = shift === 0 ? "" : ` ${shift < 0 ? "-" : "+"} ${Math.abs(shift)}`;
          const times = slope.eq(Q.of(1)) ? meanY.toLatex() : `${slope.toLatex()} \\times ${meanY.toLatex()}`;
          return numberProblem({
            prompt: t(
              `Let $Y \\sim \\operatorname{Uniform}(${lo}, ${hi})$ and, given $Y = y$, let $X \\mid Y = y \\sim ${cond}$. Find $E[X]$.`,
              `设 $Y \\sim \\operatorname{Uniform}(${lo}, ${hi})$，且在 $Y = y$ 的条件下 $X \\mid Y = y \\sim ${cond}$。求 $E[X]$。`,
            ),
            answer: ans,
            form: "fraction",
            mistakes: distinct([
              why(
                meanY,
                `That is $E[Y]$; the law of total expectation averages $E[X \\mid Y = y] = ${condMean}$, not $y$ itself.`,
                `这是 $E[Y]$；全期望公式要平均的是 $E[X \\mid Y = y] = ${condMean}$，而不是 $y$ 本身。`,
              ),
              why(
                slope.mul(Q.of(hi)).add(Q.of(shift)),
                `That puts the upper end $y = ${hi}$ into $E[X \\mid Y = y]$; the average over $Y$ uses its mean $E[Y] = ${meanY.toLatex()}$.`,
                `这是把上端点 $y = ${hi}$ 代入了 $E[X \\mid Y = y]$；对 $Y$ 求平均应代入其均值 $E[Y] = ${meanY.toLatex()}$。`,
              ),
              why(
                slope.mul(meanY),
                `That keeps only the slope times $E[Y]$ and drops the constant $${shift}$ in $E[X \\mid Y = y]$.`,
                `这只保留了斜率乘 $E[Y]$，漏掉了 $E[X \\mid Y = y]$ 中的常数 $${shift}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Write the conditional mean", "写出条件均值"],
                  t(
                    `$E[X \\mid Y = y] = ${condMean}$, which is linear in $y$ with slope $${slope.toLatex()}$, and $E[Y] = \\frac{${lo} + ${hi}}{2} = ${meanY.toLatex()}$.`,
                    `$E[X \\mid Y = y] = ${condMean}$，它是 $y$ 的线性函数，斜率为 $${slope.toLatex()}$，且 $E[Y] = \\frac{${lo} + ${hi}}{2} = ${meanY.toLatex()}$。`,
                  ),
                ],
                [
                  ["Average over the condition", "对条件求平均"],
                  t(
                    `A linear function averages to its value at the mean, so $E[X] = E\\big[E[X \\mid Y]\\big] = ${times}${tail} = ${ans.toLatex()}$.`,
                    `线性函数的平均等于它在均值处的值，所以 $E[X] = E\\big[E[X \\mid Y]\\big] = ${times}${tail} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$E[X]$ lies between the conditional means at the ends, $${slope.mul(Q.of(lo)).add(Q.of(shift)).toLatex()}$ at $y = ${lo}$ and $${slope.mul(Q.of(hi)).add(Q.of(shift)).toLatex()}$ at $y = ${hi}$, exactly halfway.`,
                `$E[X]$ 位于两端的条件均值之间：$y = ${lo}$ 处为 $${slope.mul(Q.of(lo)).add(Q.of(shift)).toLatex()}$，$y = ${hi}$ 处为 $${slope.mul(Q.of(hi)).add(Q.of(shift)).toLatex()}$，且正好在中点。`,
              ),
            ),
          });
        },
      },
    ],
  },

  // 11.42.7 Conditional Variance for Continuous Random Variables
  {
    id: "conditional-variance-for-continuous-random-variables",
    title: t("Conditional Variance for Continuous Random Variables", "连续随机变量的条件方差"),
    summary: t(
      "The conditional variance of $X$ given $Y = y$ is $\\operatorname{Var}(X \\mid Y = y) = E[X^2 \\mid Y = y] - (E[X \\mid Y = y])^2 = \\int_{-\\infty}^{\\infty} (x - E[X \\mid Y = y])^2 f_{X \\mid Y}(x \\mid y)\\,dx$.",
      "$X$ 在 $Y = y$ 条件下的条件方差为 $\\operatorname{Var}(X \\mid Y = y) = E[X^2 \\mid Y = y] - (E[X \\mid Y = y])^2 = \\int_{-\\infty}^{\\infty} (x - E[X \\mid Y = y])^2 f_{X \\mid Y}(x \\mid y)\\,dx$。",
    ),
    prerequisites: ["conditional-expectation-for-continuous-random-variables"],
    encompasses: [],
    xp: 12,
    intro: t(
      "A sensor shows $Y = 6$, and the true signal $X$ is spread evenly over $[0, 6]$. The best guess is $3$, but $X$ still varies around it: the conditional variance $\\operatorname{Var}(X \\mid Y = 6) = \\frac{6^2}{12} = 3$ measures how far off that guess typically is.\n\nCheck: $E[X^2 \\mid Y = 6] = \\frac{6^2}{3} = 12$, and $12 - 3^2 = 3$.\n\nIn this lesson we compute conditional variances and combine them with the law of total variance.",
      "传感器显示 $Y = 6$，真实信号 $X$ 均匀分布在 $[0, 6]$ 上。最佳猜测是 $3$，但 $X$ 仍围绕它波动：条件方差 $\\operatorname{Var}(X \\mid Y = 6) = \\frac{6^2}{12} = 3$ 衡量了这个猜测通常偏差多大。\n\n检验：$E[X^2 \\mid Y = 6] = \\frac{6^2}{3} = 12$，且 $12 - 3^2 = 3$。\n\n本课我们计算条件方差，并用全方差公式把它们合成起来。",
    ),
    knowledgePoints: [
      {
        id: "evaluating-continuous-conditional-variance",
        title: t("Evaluating conditional variance for continuous distributions", "计算连续分布的条件方差"),
        explanation: t(
          "Once the conditional distribution is recognized as a familiar one, its variance follows from the known formula with the condition plugged in. For $X \\mid Y = y \\sim \\text{Uniform}(0, y)$, the conditional variance is $\\operatorname{Var}(X \\mid Y = y) = \\frac{y^2}{12}$.\n\nFor example, $X \\mid Y = y \\sim \\text{Uniform}(0, 2y)$ has variance $\\frac{(2y)^2}{12} = \\frac{y^2}{3}$, so at $y = \\frac{1}{2}$ it is $\\frac{1}{12}$.\n\nCheck: at $y = \\frac{1}{2}$, $X$ is uniform on $[0, 1]$, with $E[X^2 \\mid Y = \\frac{1}{2}] = \\frac{1}{3}$ and $E[X \\mid Y = \\frac{1}{2}] = \\frac{1}{2}$, and $\\frac{1}{3} - \\frac{1}{4} = \\frac{1}{12}$.\n\n> **Watch out.** Square the whole width: $\\frac{(2y)^2}{12}$, not $\\frac{2y}{12}$ or $\\frac{2y^2}{12}$; and divide by $12$, not by $4$, since $\\frac{(2y)^2}{4}$ is the square of the conditional mean.",
          "一旦认出条件分布是一个熟悉的分布，就可以把条件代入已知公式求出它的方差。若 $X \\mid Y = y \\sim \\text{Uniform}(0, y)$，则条件方差为 $\\operatorname{Var}(X \\mid Y = y) = \\frac{y^2}{12}$。\n\n例如，$X \\mid Y = y \\sim \\text{Uniform}(0, 2y)$ 的方差为 $\\frac{(2y)^2}{12} = \\frac{y^2}{3}$，所以在 $y = \\frac{1}{2}$ 处为 $\\frac{1}{12}$。\n\n检验：在 $y = \\frac{1}{2}$ 时 $X$ 在 $[0, 1]$ 上均匀分布，$E[X^2 \\mid Y = \\frac{1}{2}] = \\frac{1}{3}$，$E[X \\mid Y = \\frac{1}{2}] = \\frac{1}{2}$，而 $\\frac{1}{3} - \\frac{1}{4} = \\frac{1}{12}$。\n\n> **注意。** 要把整个区间长度平方：是 $\\frac{(2y)^2}{12}$，不是 $\\frac{2y}{12}$ 或 $\\frac{2y^2}{12}$；并且要除以 $12$ 而不是 $4$，因为 $\\frac{(2y)^2}{4}$ 是条件均值的平方。",
        ),
        generate: (rng: Rng): Problem => {
          // X | Y = y is Uniform(0, c * y) for c in {1, 2, 3}
          const c = rng.int(1, 3);
          const denom = rng.int(3, 16);
          const num = rng.int(1, denom - 1);
          const y0 = Q.of(num, denom);
          // Var(X | Y = y) = (c * y)^2 / 12 = c^2 * y^2 / 12
          const cSq = c * c;
          const ans = y0.mul(y0).mul(Q.of(cSq)).div(Q.of(12));
          const y = y0.toLatex();

          const upperLimitStr = c === 1 ? "y" : `${c}y`;
          const upperFormula = c === 1 ? "y^2" : `${cSq}y^2`;
          const atY = c === 1 ? `\\left(${y}\\right)^2` : `${cSq} \\left(${y}\\right)^2`;
          const sqWidth = y0.mul(y0).mul(Q.of(cSq));

          return numberProblem({
            prompt: t(
              `Given continuous random variables $(X, Y)$ where the conditional distribution of $X$ given $Y = y$ is $X \\mid Y = y \\sim \\operatorname{Uniform}(0, ${upperLimitStr})$ for $0 < y < 1$, calculate the exact conditional variance $\\operatorname{Var}\\left(X \\mid Y = ${y}\\right)$.`,
              `已知连续随机变量 $(X, Y)$ 满足在给定 $Y = y$ 时 $X$ 的条件分布为 $X \\mid Y = y \\sim \\operatorname{Uniform}(0, ${upperLimitStr})$（其中 $0 < y < 1$）。计算条件方差 $\\operatorname{Var}\\left(X \\mid Y = ${y}\\right)$ 的精确值。`,
            ),
            answer: ans,
            mistakes: distinct([
              why(
                y0.mul(Q.of(c)).div(Q.of(12)),
                `That divides the width $${upperLimitStr}$ by $12$ without squaring it; the variance of a uniform is the squared width over $12$.`,
                `这是把区间长度 $${upperLimitStr}$ 直接除以 $12$，没有平方；均匀分布的方差是区间长度的平方除以 $12$。`,
              ),
              why(
                y0.mul(y0).mul(Q.of(cSq)).div(Q.of(4)),
                `That is $\\frac{(${upperLimitStr})^2}{4}$, the square of the conditional mean $\\frac{${upperLimitStr}}{2}$, not the variance; divide the squared width by $12$.`,
                `这是 $\\frac{(${upperLimitStr})^2}{4}$，即条件均值 $\\frac{${upperLimitStr}}{2}$ 的平方，而不是方差；应把区间长度的平方除以 $12$。`,
              ),
              why(
                y0.mul(y0).mul(Q.of(cSq)).div(Q.of(3)),
                `That is $E[X^2 \\mid Y = ${y}]$, the second moment; subtract the square of the conditional mean to get the variance.`,
                `这是二阶矩 $E[X^2 \\mid Y = ${y}]$；还要减去条件均值的平方才得到方差。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Recall the uniform variance", "回顾均匀分布的方差"],
                  t(
                    `For a uniform random variable on $(0, ${upperLimitStr})$, the variance is $\\frac{(${upperLimitStr} - 0)^2}{12} = \\frac{${upperFormula}}{12}$.`,
                    `对于区间 $(0, ${upperLimitStr})$ 上的均匀分布随机变量，其方差为 $\\frac{(${upperLimitStr} - 0)^2}{12} = \\frac{${upperFormula}}{12}$。`,
                  ),
                ],
                [
                  ["Substitute the given value", "代入给定值"],
                  t(
                    `At $y = ${y}$, $\\operatorname{Var}\\left(X \\mid Y = ${y}\\right) = \\frac{${atY}}{12} = ${ans.toLatex()}$.`,
                    `在 $y = ${y}$ 处，$\\operatorname{Var}\\left(X \\mid Y = ${y}\\right) = \\frac{${atY}}{12} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `Twelve times the variance gives back the squared width: $12 \\times ${ans.toLatex()} = ${sqWidth.toLatex()}$, which is $\\left(${y0.mul(Q.of(c)).toLatex()}\\right)^2$.`,
                `方差乘 $12$ 应还原为区间长度的平方：$12 \\times ${ans.toLatex()} = ${sqWidth.toLatex()}$，即 $\\left(${y0.mul(Q.of(c)).toLatex()}\\right)^2$。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-law-of-total-variance",
        title: t("Combining conditional variances with the law of total variance", "用全方差公式合成条件方差"),
        explanation: t(
          "The overall variance of $X$ has two sources: the spread of $X$ around its conditional mean, and the spread of that conditional mean as $Y$ varies:\n$$\\operatorname{Var}(X) = E\\big[\\operatorname{Var}(X \\mid Y)\\big] + \\operatorname{Var}\\big(E[X \\mid Y]\\big).$$\nIf $Y \\sim \\operatorname{Uniform}(0, 6)$ and $X \\mid Y = y \\sim \\mathcal{N}(2y,\\ 5)$, the first term is $5$ and the second is $\\operatorname{Var}(2Y) = 4 \\times \\frac{6^2}{12} = 12$, so $\\operatorname{Var}(X) = 17$. Leaving out either term gives too small an answer.\n\nFor example, if $Y \\sim \\operatorname{Uniform}(2, 5)$ and $X \\mid Y = y \\sim \\mathcal{N}(y,\\ 4)$, the first term is $4$ and the second is $\\operatorname{Var}(Y) = \\frac{3^2}{12} = \\frac{3}{4}$, so $\\operatorname{Var}(X) = \\frac{19}{4}$.\n\nCheck: the total is at least each part, $\\frac{19}{4} \\ge 4$ and $\\frac{19}{4} \\ge \\frac{3}{4}$, as two nonnegative terms must give.\n\n> **Watch out.** Scaling a variable scales its variance by the square: $\\operatorname{Var}(2Y) = 4\\operatorname{Var}(Y)$, not $2\\operatorname{Var}(Y)$.",
          "$X$ 的总方差有两个来源：$X$ 围绕条件均值的分散程度，以及条件均值随 $Y$ 变化时的分散程度：\n$$\\operatorname{Var}(X) = E\\big[\\operatorname{Var}(X \\mid Y)\\big] + \\operatorname{Var}\\big(E[X \\mid Y]\\big).$$\n若 $Y \\sim \\operatorname{Uniform}(0, 6)$，$X \\mid Y = y \\sim \\mathcal{N}(2y,\\ 5)$，则第一项为 $5$，第二项为 $\\operatorname{Var}(2Y) = 4 \\times \\frac{6^2}{12} = 12$，所以 $\\operatorname{Var}(X) = 17$。漏掉任何一项都会使答案偏小。\n\n例如，若 $Y \\sim \\operatorname{Uniform}(2, 5)$，$X \\mid Y = y \\sim \\mathcal{N}(y,\\ 4)$，则第一项为 $4$，第二项为 $\\operatorname{Var}(Y) = \\frac{3^2}{12} = \\frac{3}{4}$，所以 $\\operatorname{Var}(X) = \\frac{19}{4}$。\n\n检验：总方差不小于其中每一项，$\\frac{19}{4} \\ge 4$ 且 $\\frac{19}{4} \\ge \\frac{3}{4}$，两个非负项相加必然如此。\n\n> **注意。** 把变量放大若干倍，方差要乘以倍数的平方：$\\operatorname{Var}(2Y) = 4\\operatorname{Var}(Y)$，而不是 $2\\operatorname{Var}(Y)$。",
        ),
        generate: (rng: Rng): Problem => {
          const width = rng.int(1, 8);
          const lo = rng.int(0, 3);
          const hi = lo + width;
          const a = rng.pick([1, 2, 3, 4]);
          const s2 = rng.int(1, 9);
          const varY = Q.of(width * width, 12);
          const between = varY.mul(Q.of(a * a));
          const ans = between.add(Q.of(s2));
          const mean = a === 1 ? "y" : `${a}y`;
          const scaled = a === 1 ? `\\frac{${width}^2}{12}` : `${a * a} \\times \\frac{${width}^2}{12}`;
          return numberProblem({
            prompt: t(
              `Let $Y \\sim \\operatorname{Uniform}(${lo}, ${hi})$ and $X \\mid Y = y \\sim \\mathcal{N}(${mean},\\ ${s2})$, where the second parameter is the variance. Find $\\operatorname{Var}(X)$.`,
              `设 $Y \\sim \\operatorname{Uniform}(${lo}, ${hi})$，$X \\mid Y = y \\sim \\mathcal{N}(${mean},\\ ${s2})$，其中第二个参数为方差。求 $\\operatorname{Var}(X)$。`,
            ),
            answer: ans,
            form: "fraction",
            mistakes: distinct([
              why(
                Q.of(s2),
                `That is only $E[\\operatorname{Var}(X \\mid Y)] = ${s2}$; the conditional mean $${mean}$ also varies with $Y$ and adds $\\operatorname{Var}(E[X \\mid Y])$.`,
                `这只是 $E[\\operatorname{Var}(X \\mid Y)] = ${s2}$；条件均值 $${mean}$ 也随 $Y$ 变化，还要加上 $\\operatorname{Var}(E[X \\mid Y])$。`,
              ),
              why(
                between,
                `That is only $\\operatorname{Var}(E[X \\mid Y])$; the spread $${s2}$ of $X$ around its conditional mean must be added.`,
                `这只是 $\\operatorname{Var}(E[X \\mid Y])$；还要加上 $X$ 围绕条件均值的方差 $${s2}$。`,
              ),
              why(
                varY.mul(Q.of(a)).add(Q.of(s2)),
                `That multiplies $\\operatorname{Var}(Y)$ by $${a}$; scaling $Y$ by $${a}$ multiplies its variance by $${a}^2 = ${a * a}$.`,
                `这是把 $\\operatorname{Var}(Y)$ 乘以 $${a}$；把 $Y$ 放大 $${a}$ 倍，方差要乘以 $${a}^2 = ${a * a}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the two parts", "求出两部分"],
                  t(
                    `$E[\\operatorname{Var}(X \\mid Y)] = ${s2}$. $E[X \\mid Y] = ${mean}$, so $\\operatorname{Var}(E[X \\mid Y]) = ${scaled} = ${between.toLatex()}$.`,
                    `$E[\\operatorname{Var}(X \\mid Y)] = ${s2}$。$E[X \\mid Y] = ${mean}$，所以 $\\operatorname{Var}(E[X \\mid Y]) = ${scaled} = ${between.toLatex()}$。`,
                  ),
                ],
                [
                  ["Add them", "相加"],
                  t(
                    `$\\operatorname{Var}(X) = ${s2} + ${between.toLatex()} = ${ans.toLatex()}$.`,
                    `$\\operatorname{Var}(X) = ${s2} + ${between.toLatex()} = ${ans.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The total $${ans.toLatex()}$ is larger than each part, $${s2}$ and $${between.toLatex()}$, as a sum of two positive terms must be.`,
                `总方差 $${ans.toLatex()}$ 大于每一部分 $${s2}$ 和 $${between.toLatex()}$，两个正数之和必然如此。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
