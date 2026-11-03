import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { numberProblem } from "../problems.ts";

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
    knowledgePoints: [
      {
        id: "evaluating-continuous-conditional-expectation",
        title: t("Evaluating conditional expectation for continuous distributions", "计算连续分布的条件期望"),
        explanation: t(
          "Find the conditional density by dividing the joint density by the marginal, then compute an ordinary mean with that density. $f_{X \\mid Y}(x \\mid y) = \\frac{f(x, y)}{f_Y(y)}$, and then $E[X \\mid Y = y] = \\int x \\, f_{X \\mid Y}(x \\mid y) \\, dx$. If $X \\mid Y = y \\sim \\text{Uniform}(0, y)$, then $E[X \\mid Y = y] = \\frac{y}{2}$.",
          "把联合密度除以边缘密度得到条件密度，再用这个密度计算普通的均值。$f_{X \\mid Y}(x \\mid y) = \\frac{f(x, y)}{f_Y(y)}$，从而 $E[X \\mid Y = y] = \\int x \\, f_{X \\mid Y}(x \\mid y) \\, dx$。若 $X \\mid Y = y \\sim \\text{Uniform}(0, y)$，则 $E[X \\mid Y = y] = \\frac{y}{2}$。",
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

            return numberProblem({
              prompt: t(
                `Continuous random variables $(X, Y)$ have joint probability density function $f(x, y) = 2$ for $0 \\le x \\le y \\le 1$ (and $0$ elsewhere). Find the exact value of the conditional expectation $E[X \\mid Y = ${y0.toLatex()}]$.`,
                `连续型随机变量 $(X, Y)$ 的联合概率密度函数在 $0 \\le x \\le y \\le 1$ 上为 $f(x, y) = 2$（其余区域为 $0$）。求条件期望 $E[X \\mid Y = ${y0.toLatex()}]$ 的精确值。`,
              ),
              answer: ans,
              wrong: [y0, Q.of(1, 2), y0.mul(y0).div(Q.of(2))],
              solution: t(
                `The marginal density of $Y$ for $0 \\le y \\le 1$ is $f_Y(y) = \\int_0^y 2\\,dx = 2y$. Thus the conditional density is $f_{X|Y}(x \\mid y) = \\frac{f(x, y)}{f_Y(y)} = \\frac{2}{2y} = \\frac{1}{y}$ for $0 \\le x \\le y$, so $X \\mid Y = y \\sim \\operatorname{Uniform}(0, y)$. Hence $E[X \\mid Y = y] = \\frac{y}{2}$. Evaluating at $y = ${y0.toLatex()}$ yields $E[X \\mid Y = ${y0.toLatex()}] = \\frac{1}{2} \\left(${y0.toLatex()}\\right) = ${ans.toLatex()}$.`,
                `对于 $0 \\le y \\le 1$，$Y$ 的边际密度为 $f_Y(y) = \\int_0^y 2\\,dx = 2y$。因此条件密度为 $f_{X|Y}(x \\mid y) = \\frac{f(x, y)}{f_Y(y)} = \\frac{2}{2y} = \\frac{1}{y}$（$0 \\le x \\le y$），即 $X \\mid Y = y \\sim \\operatorname{Uniform}(0, y)$。故 $E[X \\mid Y = y] = \\frac{y}{2}$。在 $y = ${y0.toLatex()}$ 处求值得 $E[X \\mid Y = ${y0.toLatex()}] = \\frac{1}{2} \\left(${y0.toLatex()}\\right) = ${ans.toLatex()}$。`,
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

          // ans = (2 + 6*y) / (3*(1 + 4*y))
          const top = Q.of(2).add(Q.of(6).mul(yVal));
          const bot = Q.of(3).mul(Q.of(1).add(Q.of(4).mul(yVal)));
          const ans = top.div(bot);

          return numberProblem({
            prompt: t(
              `The continuous random variables $(X, Y)$ have joint density $f(x, y) = \\frac{2}{3}(x + 2y)$ on the unit square $[0, 1] \\times [0, 1]$. Calculate the exact conditional expectation $E[X \\mid Y = ${yVal.toLatex()}]$.`,
              `连续型随机变量 $(X, Y)$ 在单位正方形 $[0, 1] \\times [0, 1]$ 上的联合密度为 $f(x, y) = \\frac{2}{3}(x + 2y)$。计算条件期望 $E[X \\mid Y = ${yVal.toLatex()}]$ 的精确值。`,
            ),
            answer: ans,
            wrong: [Q.of(1, 2), top.div(Q.of(3)), top.div(Q.of(1).add(Q.of(4).mul(yVal)))],
            solution: t(
              `The marginal density is $f_Y(y) = \\int_0^1 \\frac{2}{3}(x + 2y)\\,dx = \\frac{1}{3}(1 + 4y)$. The conditional density is $f_{X|Y}(x \\mid y) = \\frac{2(x + 2y)}{1 + 4y}$. Integrating gives $E[X \\mid Y = y] = \\int_0^1 x f_{X|Y}(x \\mid y)\\,dx = \\frac{2 + 6y}{3(1 + 4y)}$. Substituting $y = ${yVal.toLatex()}$ yields $E[X \\mid Y = ${yVal.toLatex()}] = ${ans.toLatex()}$.`,
              `边际密度为 $f_Y(y) = \\int_0^1 \\frac{2}{3}(x + 2y)\\,dx = \\frac{1}{3}(1 + 4y)$。条件密度为 $f_{X|Y}(x \\mid y) = \\frac{2(x + 2y)}{1 + 4y}$。积分得 $E[X \\mid Y = y] = \\int_0^1 x f_{X|Y}(x \\mid y)\\,dx = \\frac{2 + 6y}{3(1 + 4y)}$。代入 $y = ${yVal.toLatex()}$ 计算得 $E[X \\mid Y = ${yVal.toLatex()}] = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
      {
        id: "the-law-of-total-expectation",
        title: t("Averaging a conditional expectation", "对条件期望再求平均"),
        explanation: t(
          "The conditional expectation $E[X \\mid Y]$ is itself a random variable, a function of $Y$. Averaging it over $Y$ recovers the plain mean:\n$$E[X] = E\\big[E[X \\mid Y]\\big] = \\int E[X \\mid Y = y]\\, f_Y(y)\\, dy.$$\nThis is often easier than finding the marginal density of $X$. If $Y \\sim \\operatorname{Uniform}(0, 4)$ and $X \\mid Y = y \\sim \\operatorname{Uniform}(0, y)$, then $E[X \\mid Y] = \\frac{Y}{2}$, so $E[X] = \\frac{E[Y]}{2} = \\frac{2}{2} = 1$.",
          "条件期望 $E[X \\mid Y]$ 本身是一个随机变量，是 $Y$ 的函数。对 $Y$ 求它的平均就得到普通的均值：\n$$E[X] = E\\big[E[X \\mid Y]\\big] = \\int E[X \\mid Y = y]\\, f_Y(y)\\, dy.$$\n这通常比求 $X$ 的边缘密度更容易。若 $Y \\sim \\operatorname{Uniform}(0, 4)$，$X \\mid Y = y \\sim \\operatorname{Uniform}(0, y)$，则 $E[X \\mid Y] = \\frac{Y}{2}$，所以 $E[X] = \\frac{E[Y]}{2} = \\frac{2}{2} = 1$。",
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
          return numberProblem({
            prompt: t(
              `Let $Y \\sim \\operatorname{Uniform}(${lo}, ${hi})$ and, given $Y = y$, let $X \\mid Y = y \\sim ${cond}$. Find $E[X]$.`,
              `设 $Y \\sim \\operatorname{Uniform}(${lo}, ${hi})$，且在 $Y = y$ 的条件下 $X \\mid Y = y \\sim ${cond}$。求 $E[X]$。`,
            ),
            answer: ans,
            form: "fraction",
            wrong: [meanY, slope.mul(Q.of(hi)).add(Q.of(shift)), slope.mul(meanY)],
            solution: t(
              `$E[X \\mid Y = y] = ${condMean}$, which is linear in $y$ with slope $${slope.toLatex()}$. With $E[Y] = ${meanY.toLatex()}$, $E[X] = E\\big[E[X \\mid Y]\\big] = ${slope.toLatex()} \\cdot ${meanY.toLatex()}${shift === 0 ? "" : ` ${shift < 0 ? "-" : "+"} ${Math.abs(shift)}`} = ${ans.toLatex()}$.`,
              `$E[X \\mid Y = y] = ${condMean}$，它是 $y$ 的线性函数，斜率为 $${slope.toLatex()}$。由 $E[Y] = ${meanY.toLatex()}$，得 $E[X] = E\\big[E[X \\mid Y]\\big] = ${slope.toLatex()} \\cdot ${meanY.toLatex()}${shift === 0 ? "" : ` ${shift < 0 ? "-" : "+"} ${Math.abs(shift)}`} = ${ans.toLatex()}$。`,
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
    knowledgePoints: [
      {
        id: "evaluating-continuous-conditional-variance",
        title: t("Evaluating conditional variance for continuous distributions", "计算连续分布的条件方差"),
        explanation: t(
          "Once the conditional distribution is recognized as a familiar one, its variance follows from the known formula with the condition plugged in. For $X \\mid Y = y \\sim \\text{Uniform}(0, y)$, the conditional variance is $\\operatorname{Var}(X \\mid Y = y) = \\frac{y^2}{12}$.",
          "一旦认出条件分布是一个熟悉的分布，就可以把条件代入已知公式求出它的方差。若 $X \\mid Y = y \\sim \\text{Uniform}(0, y)$，则条件方差为 $\\operatorname{Var}(X \\mid Y = y) = \\frac{y^2}{12}$。",
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

          const upperLimitStr = c === 1 ? "y" : `${c}y`;
          const upperFormula = c === 1 ? "y^2" : `${cSq}y^2`;

          return numberProblem({
            prompt: t(
              `Given continuous random variables $(X, Y)$ where the conditional distribution of $X$ given $Y = y$ is $X \\mid Y = y \\sim \\operatorname{Uniform}(0, ${upperLimitStr})$ for $0 < y < 1$, calculate the exact conditional variance $\\operatorname{Var}\\left(X \\mid Y = ${y0.toLatex()}\\right)$.`,
              `已知连续随机变量 $(X, Y)$ 满足在给定 $Y = y$ 时 $X$ 的条件分布为 $X \\mid Y = y \\sim \\operatorname{Uniform}(0, ${upperLimitStr})$（其中 $0 < y < 1$）。计算条件方差 $\\operatorname{Var}\\left(X \\mid Y = ${y0.toLatex()}\\right)$ 的精确值。`,
            ),
            answer: ans,
            wrong: [y0.mul(Q.of(c)).div(Q.of(12)), y0.mul(y0).mul(Q.of(cSq)).div(Q.of(4)), y0.mul(y0).mul(Q.of(cSq)).div(Q.of(3))],
            solution: t(
              `For a uniform random variable on $(0, ${upperLimitStr})$, the variance is $\\frac{(${upperLimitStr} - 0)^2}{12} = \\frac{${upperFormula}}{12}$. Evaluating at $y = ${y0.toLatex()}$ yields $\\operatorname{Var}\\left(X \\mid Y = ${y0.toLatex()}\\right) = \\frac{${cSq} \\left(${y0.toLatex()}\\right)^2}{12} = ${ans.toLatex()}$.`,
              `对于区间 $(0, ${upperLimitStr})$ 上的均匀分布随机变量，其方差为 $\\frac{(${upperLimitStr} - 0)^2}{12} = \\frac{${upperFormula}}{12}$。在 $y = ${y0.toLatex()}$ 处求值得 $\\operatorname{Var}\\left(X \\mid Y = ${y0.toLatex()}\\right) = \\frac{${cSq} \\left(${y0.toLatex()}\\right)^2}{12} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
      {
        id: "the-law-of-total-variance",
        title: t("Combining conditional variances with the law of total variance", "用全方差公式合成条件方差"),
        explanation: t(
          "The overall variance of $X$ has two sources: the spread of $X$ around its conditional mean, and the spread of that conditional mean as $Y$ varies:\n$$\\operatorname{Var}(X) = E\\big[\\operatorname{Var}(X \\mid Y)\\big] + \\operatorname{Var}\\big(E[X \\mid Y]\\big).$$\nIf $Y \\sim \\operatorname{Uniform}(0, 6)$ and $X \\mid Y = y \\sim \\mathcal{N}(2y,\\ 5)$, the first term is $5$ and the second is $\\operatorname{Var}(2Y) = 4 \\cdot \\frac{6^2}{12} = 12$, so $\\operatorname{Var}(X) = 17$. Leaving out either term gives too small an answer.",
          "$X$ 的总方差有两个来源：$X$ 围绕条件均值的分散程度，以及条件均值随 $Y$ 变化时的分散程度：\n$$\\operatorname{Var}(X) = E\\big[\\operatorname{Var}(X \\mid Y)\\big] + \\operatorname{Var}\\big(E[X \\mid Y]\\big).$$\n若 $Y \\sim \\operatorname{Uniform}(0, 6)$，$X \\mid Y = y \\sim \\mathcal{N}(2y,\\ 5)$，则第一项为 $5$，第二项为 $\\operatorname{Var}(2Y) = 4 \\cdot \\frac{6^2}{12} = 12$，所以 $\\operatorname{Var}(X) = 17$。漏掉任何一项都会使答案偏小。",
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
          return numberProblem({
            prompt: t(
              `Let $Y \\sim \\operatorname{Uniform}(${lo}, ${hi})$ and $X \\mid Y = y \\sim \\mathcal{N}(${mean},\\ ${s2})$, where the second parameter is the variance. Find $\\operatorname{Var}(X)$.`,
              `设 $Y \\sim \\operatorname{Uniform}(${lo}, ${hi})$，$X \\mid Y = y \\sim \\mathcal{N}(${mean},\\ ${s2})$，其中第二个参数为方差。求 $\\operatorname{Var}(X)$。`,
            ),
            answer: ans,
            form: "fraction",
            wrong: [Q.of(s2), between, varY.mul(Q.of(a)).add(Q.of(s2))],
            solution: t(
              `$E[\\operatorname{Var}(X \\mid Y)] = ${s2}$. $E[X \\mid Y] = ${mean}$, so $\\operatorname{Var}(E[X \\mid Y]) = ${a * a} \\cdot \\frac{${width}^2}{12} = ${between.toLatex()}$. Adding, $\\operatorname{Var}(X) = ${s2} + ${between.toLatex()} = ${ans.toLatex()}$.`,
              `$E[\\operatorname{Var}(X \\mid Y)] = ${s2}$。$E[X \\mid Y] = ${mean}$，所以 $\\operatorname{Var}(E[X \\mid Y]) = ${a * a} \\cdot \\frac{${width}^2}{12} = ${between.toLatex()}$。相加得 $\\operatorname{Var}(X) = ${s2} + ${between.toLatex()} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },
];
