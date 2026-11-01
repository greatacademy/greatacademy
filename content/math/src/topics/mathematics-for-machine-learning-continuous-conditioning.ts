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
      "For continuous random variables (X, Y) with joint PDF f(x, y) and marginal PDF f_Y(y) > 0, the conditional expectation is E[X | Y = y] = ∫_{-∞}^∞ x f_{X|Y}(x | y) dx, where f_{X|Y}(x | y) = f(x, y) / f_Y(y).",
      "对于具有联合概率密度函数 f(x, y) 且边际密度 f_Y(y) > 0 的连续随机变量 (X, Y)，条件期望为 E[X | Y = y] = ∫_{-∞}^∞ x f_{X|Y}(x | y) dx，其中条件密度为 f_{X|Y}(x | y) = f(x, y) / f_Y(y)。",
    ),
    prerequisites: ["conditional-expectation-for-discrete-random-variables", "joint-distributions-for-continuous-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-continuous-conditional-expectation",
        title: t("Evaluating conditional expectation for continuous distributions", "计算连续分布的条件期望"),
        explanation: t(
          "f_{X|Y}(x | y) = f(x, y) / f_Y(y). Then E[X | Y = y] = ∫ x f_{X|Y}(x | y) dx. If X | Y = y ~ Uniform(0, y), E[X | Y = y] = y / 2.",
          "f_{X|Y}(x | y) = f(x, y) / f_Y(y)。从而 E[X | Y = y] = ∫ x f_{X|Y}(x | y) dx。若 X | Y = y ~ Uniform(0, y)，则 E[X | Y = y] = y / 2。",
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
            solution: t(
              `The marginal density is $f_Y(y) = \\int_0^1 \\frac{2}{3}(x + 2y)\\,dx = \\frac{1}{3}(1 + 4y)$. The conditional density is $f_{X|Y}(x \\mid y) = \\frac{2(x + 2y)}{1 + 4y}$. Integrating gives $E[X \\mid Y = y] = \\int_0^1 x f_{X|Y}(x \\mid y)\\,dx = \\frac{2 + 6y}{3(1 + 4y)}$. Substituting $y = ${yVal.toLatex()}$ yields $E[X \\mid Y = ${yVal.toLatex()}] = ${ans.toLatex()}$.`,
              `边际密度为 $f_Y(y) = \\int_0^1 \\frac{2}{3}(x + 2y)\\,dx = \\frac{1}{3}(1 + 4y)$。条件密度为 $f_{X|Y}(x \\mid y) = \\frac{2(x + 2y)}{1 + 4y}$。积分得 $E[X \\mid Y = y] = \\int_0^1 x f_{X|Y}(x \\mid y)\\,dx = \\frac{2 + 6y}{3(1 + 4y)}$。代入 $y = ${yVal.toLatex()}$ 计算得 $E[X \\mid Y = ${yVal.toLatex()}] = ${ans.toLatex()}$。`,
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
      "The conditional variance of a continuous random variable X given Y = y is Var(X | Y = y) = E[X^2 | Y = y] - (E[X | Y = y])^2 = ∫_{-∞}^∞ (x - E[X | Y = y])^2 f_{X|Y}(x | y) dx.",
      "连续随机变量 X 在给定 Y = y 下的条件方差为 Var(X | Y = y) = E[X^2 | Y = y] - (E[X | Y = y])^2 = ∫_{-∞}^∞ (x - E[X | Y = y])^2 f_{X|Y}(x | y) dx。",
    ),
    prerequisites: ["conditional-expectation-for-continuous-random-variables"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-continuous-conditional-variance",
        title: t("Evaluating conditional variance for continuous distributions", "计算连续分布的条件方差"),
        explanation: t(
          "For X | Y = y ~ Uniform(0, y), the conditional variance is Var(X | Y = y) = y^2 / 12.",
          "若 X | Y = y ~ Uniform(0, y)，则条件方差为 Var(X | Y = y) = y^2 / 12。",
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
            solution: t(
              `For a uniform random variable on $(0, ${upperLimitStr})$, the variance is $\\frac{(${upperLimitStr} - 0)^2}{12} = \\frac{${upperFormula}}{12}$. Evaluating at $y = ${y0.toLatex()}$ yields $\\operatorname{Var}\\left(X \\mid Y = ${y0.toLatex()}\\right) = \\frac{${cSq} \\left(${y0.toLatex()}\\right)^2}{12} = ${ans.toLatex()}$.`,
              `对于区间 $(0, ${upperLimitStr})$ 上的均匀分布随机变量，其方差为 $\\frac{(${upperLimitStr} - 0)^2}{12} = \\frac{${upperFormula}}{12}$。在 $y = ${y0.toLatex()}$ 处求值得 $\\operatorname{Var}\\left(X \\mid Y = ${y0.toLatex()}\\right) = \\frac{${cSq} \\left(${y0.toLatex()}\\right)^2}{12} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },
];
