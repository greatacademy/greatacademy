import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem } from "../problems.ts";

/** Topics for Unit 2: Expectation (new topics). */
export const probabilityAndStatisticsExpectationTopics: TopicDef[] = [
  // 2.5.6 Moments of Continuous Random Variables
  {
    id: "moments-of-continuous-random-variables",
    title: t("Moments of Continuous Random Variables", "连续型随机变量的原点矩与中心矩"),
    summary: t(
      "The n-th raw moment of a continuous random variable X is E[X^n] = ∫_{-∞}^∞ x^n f(x) dx. The n-th central moment is E[(X - μ)^n].",
      "连续型随机变量 X 的 n 阶原点矩为 E[X^n] = ∫_{-∞}^∞ x^n f(x) dx。n 阶中心矩为 E[(X - μ)^n]。",
    ),
    prerequisites: ["probability-density-functions-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "raw-moments-of-continuous-random-variables",
        title: t("Calculating the n-th raw moment", "计算连续型随机变量的 n 阶原点矩"),
        explanation: t(
          "For $f(x) = \\frac{(k+1)x^k}{b^{k+1}}$ on $[0, b]$, the $n$-th moment is $E[X^n] = \\int_0^b x^n \\frac{(k+1)x^k}{b^{k+1}} \\, dx = \\frac{(k+1)b^n}{k+n+1}$.",
          "对于在 $[0, b]$ 上密度为 $f(x) = \\frac{(k+1)x^k}{b^{k+1}}$ 的分布，其 $n$ 阶原点矩为 $E[X^n] = \\int_0^b x^n \\frac{(k+1)x^k}{b^{k+1}} \\, dx = \\frac{(k+1)b^n}{k+n+1}$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(2, 35);
          const n = rng.pick([1, 2, 3]);
          // f(x) = 2x / b^2 on [0, b], so k = 1.
          // E[X^n] = 2 b^n / (n + 2)
          let bPow = 1;
          for (let i = 0; i < n; i++) bPow *= b;
          const num = 2 * bPow;
          const den = n + 2;

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ has PDF $f(x) = \\frac{2x}{${b * b}}$ for $0 \\le x \\le ${b}$, and $0$ otherwise. Find the $n = ${n}$ raw moment $E[X^{${n}}]$.`,
              `设连续型随机变量 $X$ 的概率密度函数为 $f(x) = \\frac{2x}{${b * b}}$（$0 \\le x \\le ${b}$），其他位置为 $0$。求 $n = ${n}$ 阶原点矩 $E[X^{${n}}]$。`,
            ),
            answer: Q.of(num, den),
            solution: t(
              `Compute by definition: $E[X^{${n}}] = \\int_0^{${b}} x^{${n}} \\left(\\frac{2x}{${b * b}}\\right) dx = \\frac{2}{${b * b}} \\left[ \\frac{x^{${n + 2}}}{${n + 2}} \\right]_0^{${b}} = \\frac{2 \\cdot ${b}^{${n}}}{${n + 2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `按定义积分：$E[X^{${n}}] = \\int_0^{${b}} x^{${n}} \\left(\\frac{2x}{${b * b}}\\right) dx = \\frac{2}{${b * b}} \\left[ \\frac{x^{${n + 2}}}{${n + 2}} \\right]_0^{${b}} = \\frac{2 \\cdot ${b}^{${n}}}{${n + 2}} = \\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
          });
        },
      },
      {
        id: "central-moments-of-continuous-random-variables",
        title: t("Central moments of symmetric distributions", "对称分布的中心矩"),
        explanation: t(
          "For a continuous distribution symmetric about $\\mu$, every odd central moment is zero: $E[(X - \\mu)^{2k+1}] = 0$. The second central moment is the variance.",
          "对于关于 $\\mu$ 对称的连续型分布，所有奇数阶中心矩均为零：$E[(X - \\mu)^{2k+1}] = 0$。二阶中心矩即为方差。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(2, 40);
          const isOdd = rng.bool();
          const power = isOdd ? rng.pick([3, 5, 7]) : 2;

          if (isOdd) {
            return numberProblem({
              prompt: t(
                `A continuous random variable $X$ is uniformly distributed on $[0, ${b}]$, so its mean is $\\mu = ${b}/2$. Find the central moment $E[(X - \\mu)^{${power}}]$.`,
                `设连续型随机变量 $X$ 服从区间 $[0, ${b}]$ 上的均匀分布，其均值为 $\\mu = ${b}/2$。求其中心矩 $E[(X - \\mu)^{${power}}]$。`,
              ),
              answer: 0,
              solution: t(
                `Since the uniform distribution is symmetric about its mean $\\mu = ${b}/2$, all odd central moments are zero. Thus $E[(X - \\mu)^{${power}}] = 0$.`,
                `由于均匀分布关于其均值 $\\mu = ${b}/2$ 对称，所有奇数阶中心矩均为零。因此 $E[(X - \\mu)^{${power}}] = 0$。`,
              ),
            });
          }

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ is uniformly distributed on $[0, ${b}]$. Find its second central moment $E[(X - \\mu)^2]$ (the variance).`,
              `设连续型随机变量 $X$ 服从区间 $[0, ${b}]$ 上的均匀分布。求其二阶中心矩 $E[(X - \\mu)^2]$（即方差）。`,
            ),
            answer: Q.of(b * b, 12),
            solution: t(
              `For a continuous uniform distribution on $[0, ${b}]$, the variance is $\\text{Var}(X) = \\frac{b^2}{12} = \\frac{${b * b}}{12}${lowestTerms(b * b, 12)}$.`,
              `对于区间 $[0, ${b}]$ 上的连续型均匀分布，其方差为 $\\text{Var}(X) = \\frac{b^2}{12} = \\frac{${b * b}}{12}${lowestTerms(b * b, 12)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 2.5.7 Expected Values of Continuous Random Variables
  {
    id: "expected-values-of-continuous-random-variables",
    title: t("Expected Values of Continuous Random Variables", "连续型随机变量的期望值"),
    summary: t(
      "The expected value (or mean) of a continuous random variable X with density f(x) is defined by the improper integral E[X] = ∫_{-∞}^∞ x f(x) dx.",
      "具有概率密度 f(x) 的连续型随机变量 X 的期望值（或均值）定义为反常积分 E[X] = ∫_{-∞}^∞ x f(x) dx。",
    ),
    prerequisites: ["moments-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "expected-value-of-polynomial-pdf",
        title: t("Evaluating the expectation of a polynomial density", "求解多项式型密度的期望值"),
        explanation: t(
          "For $f(x) = \\frac{(k+1)x^k}{b^{k+1}}$ on $[0, b]$, $E[X] = \\frac{(k+1)b}{k+2}$. For $f(x) = \\frac{2x}{b^2}$, $E[X] = \\frac{2b}{3}$.",
          "对于在 $[0, b]$ 上密度为 $f(x) = \\frac{(k+1)x^k}{b^{k+1}}$ 的随机变量，$E[X] = \\frac{(k+1)b}{k+2}$。对 $f(x) = \\frac{2x}{b^2}$，$E[X] = \\frac{2b}{3}$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(3, 45);

          return numberProblem({
            prompt: t(
              `A continuous random variable $X$ has PDF $f(x) = \\frac{2x}{${b * b}}$ for $0 \\le x \\le ${b}$, and $0$ otherwise. Find the expected value $E[X]$.`,
              `设连续型随机变量 $X$ 的概率密度函数为 $f(x) = \\frac{2x}{${b * b}}$（$0 \\le x \\le ${b}$），其他位置为 $0$。求其期望值 $E[X]$。`,
            ),
            answer: Q.of(2 * b, 3),
            solution: t(
              `$E[X] = \\int_0^{${b}} x \\left(\\frac{2x}{${b * b}}\\right) dx = \\frac{2}{${b * b}} \\left[ \\frac{x^3}{3} \\right]_0^{${b}} = \\frac{2 \\cdot ${b}}{3} = \\frac{${2 * b}}{3}${lowestTerms(2 * b, 3)}$.`,
              `$E[X] = \\int_0^{${b}} x \\left(\\frac{2x}{${b * b}}\\right) dx = \\frac{2}{${b * b}} \\left[ \\frac{x^3}{3} \\right]_0^{${b}} = \\frac{2 \\cdot ${b}}{3} = \\frac{${2 * b}}{3}${lowestTerms(2 * b, 3)}$。`,
            ),
          });
        },
      },
      {
        id: "expected-value-of-exponential-pdf",
        title: t("Expected value of an exponential distribution", "指数分布的期望值"),
        explanation: t(
          "For an exponential distribution with rate $\\lambda$ (density $f(x) = \\lambda e^{-\\lambda x}$ for $x \\ge 0$), the expected value is $E[X] = \\frac{1}{\\lambda}$.",
          "对于速率参数为 $\\lambda$ 的指数分布（在 $x \\ge 0$ 上密度为 $f(x) = \\lambda e^{-\\lambda x}$），期望值为 $E[X] = \\frac{1}{\\lambda}$。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 40);

          return numberProblem({
            prompt: t(
              `The lifetime of an electronic component is exponentially distributed with rate parameter $\\lambda = ${lambda}$ (PDF $f(x) = ${lambda} e^{-${lambda} x}$ for $x \\ge 0$). Find the expected lifetime $E[X]$.`,
              `某电子元件的寿命服从速率参数为 $\\lambda = ${lambda}$ 的指数分布（$x \\ge 0$ 时 $f(x) = ${lambda} e^{-${lambda} x}$）。求其期望寿命 $E[X]$。`,
            ),
            answer: Q.of(1, lambda),
            solution: t(
              `Using integration by parts, $E[X] = \\int_0^\\infty x (${lambda} e^{-${lambda} x}) dx = \\frac{1}{${lambda}}${lowestTerms(1, lambda)}$.`,
              `通过分部积分求得：$E[X] = \\int_0^\\infty x (${lambda} e^{-${lambda} x}) dx = \\frac{1}{${lambda}}${lowestTerms(1, lambda)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 2.5.8 Variance of Continuous Random Variables
  {
    id: "variance-of-continuous-random-variables",
    title: t("Variance of Continuous Random Variables", "连续型随机变量的方差"),
    summary: t(
      "The variance of a continuous random variable X is Var(X) = E[(X - μ)^2] = E[X^2] - (E[X])^2, measuring the dispersion of X about its mean.",
      "连续型随机变量 X 的方差为 Var(X) = E[(X - μ)^2] = E[X^2] - (E[X])^2，用于度量 X 围绕均值的离散程度。",
    ),
    prerequisites: ["expected-values-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "variance-calculation-via-moments",
        title: t("Computing variance using the shortcut formula", "利用矩的简化公式计算方差"),
        explanation: t(
          "$\\operatorname{Var}(X) = E[X^2] - (E[X])^2$. For $f(x) = \\frac{2x}{b^2}$ on $[0, b]$, $E[X] = \\frac{2b}{3}$ and $E[X^2] = \\frac{b^2}{2}$, so $\\operatorname{Var}(X) = \\frac{b^2}{2} - \\frac{4b^2}{9} = \\frac{b^2}{18}$.",
          "$\\operatorname{Var}(X) = E[X^2] - (E[X])^2$。对 $[0, b]$ 上的 $f(x) = \\frac{2x}{b^2}$，$E[X] = \\frac{2b}{3}$，$E[X^2] = \\frac{b^2}{2}$，故 $\\operatorname{Var}(X) = \\frac{b^2}{2} - \\frac{4b^2}{9} = \\frac{b^2}{18}$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(3, 35);
          const varNum = b * b;

          return numberProblem({
            prompt: t(
              `Let $X$ have PDF $f(x) = \\frac{2x}{${b * b}}$ for $0 \\le x \\le ${b}$, and $0$ elsewhere. Calculate the variance $\\text{Var}(X)$.`,
              `设 $X$ 的概率密度函数为 $f(x) = \\frac{2x}{${b * b}}$（$0 \\le x \\le ${b}$），其他位置为 $0$。计算方差 $\\text{Var}(X)$。`,
            ),
            answer: Q.of(varNum, 18),
            solution: t(
              `First compute $E[X] = \\frac{2 \\cdot ${b}}{3} = \\frac{${2 * b}}{3}$ and $E[X^2] = \\int_0^{${b}} \\frac{2x^3}{${b * b}} dx = \\frac{${b}^2}{2} = \\frac{${b * b}}{2}$. Then $\\text{Var}(X) = E[X^2] - (E[X])^2 = \\frac{${b * b}}{2} - \\frac{${4 * b * b}}{9} = \\frac{${varNum}}{18}${lowestTerms(varNum, 18)}$.`,
              `先求 $E[X] = \\frac{2 \\cdot ${b}}{3} = \\frac{${2 * b}}{3}$ 及 $E[X^2] = \\int_0^{${b}} \\frac{2x^3}{${b * b}} dx = \\frac{${b * b}}{2}$。则 $\\text{Var}(X) = E[X^2] - (E[X])^2 = \\frac{${b * b}}{2} - \\frac{${4 * b * b}}{9} = \\frac{${varNum}}{18}${lowestTerms(varNum, 18)}$。`,
            ),
          });
        },
      },
      {
        id: "variance-of-exponential-random-variables",
        title: t("Variance of an exponential distribution", "指数分布的方差"),
        explanation: t(
          "For an exponential distribution with rate $\\lambda$, $E[X] = \\frac{1}{\\lambda}$ and $E[X^2] = \\frac{2}{\\lambda^2}$. Hence $\\operatorname{Var}(X) = \\frac{2}{\\lambda^2} - \\left(\\frac{1}{\\lambda}\\right)^2 = \\frac{1}{\\lambda^2}$.",
          "对于速率参数为 $\\lambda$ 的指数分布，$E[X] = \\frac{1}{\\lambda}$ 且 $E[X^2] = \\frac{2}{\\lambda^2}$。因此 $\\operatorname{Var}(X) = \\frac{2}{\\lambda^2} - \\left(\\frac{1}{\\lambda}\\right)^2 = \\frac{1}{\\lambda^2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 30);

          return numberProblem({
            prompt: t(
              `A random variable $X$ has exponential distribution with parameter $\\lambda = ${lambda}$ ($f(x) = ${lambda} e^{-${lambda} x}$ for $x \\ge 0$). Find $\\text{Var}(X)$.`,
              `随机变量 $X$ 服从参数为 $\\lambda = ${lambda}$ 的指数分布（$x \\ge 0$ 时 $f(x) = ${lambda} e^{-${lambda} x}$）。求 $\\text{Var}(X)$。`,
            ),
            answer: Q.of(1, lambda * lambda),
            solution: t(
              `For an exponential random variable with parameter $\\lambda = ${lambda}$, the variance is $\\text{Var}(X) = \\frac{1}{\\lambda^2} = \\frac{1}{${lambda * lambda}}${lowestTerms(1, lambda * lambda)}$.`,
              `对于参数为 $\\lambda = ${lambda}$ 的指数随机变量，其方差为 $\\text{Var}(X) = \\frac{1}{\\lambda^2} = \\frac{1}{${lambda * lambda}}${lowestTerms(1, lambda * lambda)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 2.5.9 The Rule of the Lazy Statistician
  {
    id: "the-rule-of-the-lazy-statistician",
    title: t("The Rule of the Lazy Statistician", "无意识统计学家法则 (LOTUS)"),
    summary: t(
      "The Law of the Unconscious Statistician (LOTUS) computes E[g(X)] directly as ∫_{-∞}^∞ g(x) f(x) dx without first determining the distribution of g(X).",
      "无意识统计学家法则（LOTUS）直接通过公式 E[g(X)] = ∫_{-∞}^∞ g(x) f(x) dx 计算期望，无需预先求出 g(X) 的概率分布。",
    ),
    prerequisites: ["expected-values-of-continuous-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "lotus-for-polynomial-functions",
        title: t("Applying LOTUS to powers of uniform variables", "对均匀分布的幂函数应用 LOTUS 法则"),
        explanation: t(
          "For $X \\sim \\text{Uniform}(0, b)$ with density $\\frac{1}{b}$, LOTUS gives $E[cX^2] = \\int_0^b c x^2 \\cdot \\frac{1}{b} \\, dx = \\frac{cb^2}{3}$.",
          "对于在 $[0, b]$ 上密度为 $\\frac{1}{b}$ 的均匀分布 $X$，由 LOTUS 法则可得 $E[cX^2] = \\int_0^b c x^2 \\cdot \\frac{1}{b} \\, dx = \\frac{cb^2}{3}$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(2, 25);
          const c = rng.int(2, 12);
          const num = c * b * b;

          return numberProblem({
            prompt: t(
              `Let $X$ be uniformly distributed on $[0, ${b}]$, so $f(x) = \\frac{1}{${b}}$ for $0 \\le x \\le ${b}$. Using LOTUS, evaluate $E[${c} X^2]$.`,
              `设 $X$ 服从区间 $[0, ${b}]$ 上的均匀分布，密度为 $f(x) = \\frac{1}{${b}}$（$0 \\le x \\le ${b}$）。应用 LOTUS 法则，求 $E[${c} X^2]$。`,
            ),
            answer: Q.of(num, 3),
            solution: t(
              `Apply LOTUS: $E[${c} X^2] = \\int_0^{${b}} ${c} x^2 \\left(\\frac{1}{${b}}\\right) dx = \\frac{${c}}{${b}} \\left[ \\frac{x^3}{3} \\right]_0^{${b}} = \\frac{${c} \\cdot ${b}^2}{3} = \\frac{${num}}{3}${lowestTerms(num, 3)}$.`,
              `应用 LOTUS 法则：$E[${c} X^2] = \\int_0^{${b}} ${c} x^2 \\left(\\frac{1}{${b}}\\right) dx = \\frac{${c}}{${b}} \\left[ \\frac{x^3}{3} \\right]_0^{${b}} = \\frac{${c} \\cdot ${b}^2}{3} = \\frac{${num}}{3}${lowestTerms(num, 3)}$。`,
            ),
          });
        },
      },
      {
        id: "lotus-for-inverse-powers",
        title: t("Applying LOTUS on unbounded supports", "在无界支撑集上应用 LOTUS 法则"),
        explanation: t(
          "For $f(x) = \\frac{2}{x^3}$ ($x \\ge 1$), $E[kX] = \\int_1^\\infty kx \\cdot \\frac{2}{x^3} \\, dx = \\int_1^\\infty \\frac{2k}{x^2} \\, dx = 2k$.",
          "对于 $f(x) = \\frac{2}{x^3}$（$x \\ge 1$），$E[kX] = \\int_1^\\infty kx \\cdot \\frac{2}{x^3} \\, dx = \\int_1^\\infty \\frac{2k}{x^2} \\, dx = 2k$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 35);

          return numberProblem({
            prompt: t(
              `A random variable $X$ has PDF $f(x) = \\frac{2}{x^3}$ for $x \\ge 1$, and $0$ otherwise. Using LOTUS, compute the expected value $E[${k} X]$.`,
              `随机变量 $X$ 的概率密度函数为 $f(x) = \\frac{2}{x^3}$（$x \\ge 1$），其他位置为 $0$。应用 LOTUS 法则，计算期望值 $E[${k} X]$。`,
            ),
            answer: 2 * k,
            solution: t(
              `$E[${k} X] = \\int_1^\\infty (${k} x) \\frac{2}{x^3} dx = \\int_1^\\infty \\frac{${2 * k}}{x^2} dx = \\left[ -\\frac{${2 * k}}{x} \\right]_1^\\infty = 0 - (-${2 * k}) = ${2 * k}$.`,
              `$E[${k} X] = \\int_1^\\infty (${k} x) \\frac{2}{x^3} dx = \\int_1^\\infty \\frac{${2 * k}}{x^2} dx = \\left[ -\\frac{${2 * k}}{x} \\right]_1^\\infty = 0 - (-${2 * k}) = ${2 * k}$。`,
            ),
          });
        },
      },
    ],
  },

  // 2.6.1 Moment-Generating Functions
  {
    id: "moment-generating-functions",
    title: t("Moment-Generating Functions", "矩母函数"),
    summary: t(
      "The moment-generating function (MGF) of a random variable X is defined by M_X(t) = E[e^{tX}], provided the expectation exists for t in a neighborhood of zero.",
      "随机变量 X 的矩母函数（MGF）定义为 M_X(t) = E[e^{tX}]，前提是该期望在包含零的一个开邻域内存在。",
    ),
    prerequisites: ["expected-values-of-continuous-random-variables", "variance-of-discrete-random-variables"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-mgf-at-zero",
        title: t("Evaluating the MGF at t = 0", "计算矩母函数在 t = 0 处的值"),
        explanation: t(
          "For any random variable $X$ whose MGF exists, $M_X(0) = E[e^0] = E[1] = 1$.",
          "对任意矩母函数存在的随机变量 $X$，均有 $M_X(0) = E[e^0] = E[1] = 1$。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(2, 20);
          const b = rng.int(2, 20);

          return numberProblem({
            prompt: t(
              `A random variable $X$ has moment-generating function $M_X(t) = \\left( \\frac{${a}}{${a} - t} \\right)^{${b}}$ for $t < ${a}$. What is the value of $M_X(0)$?`,
              `随机变量 $X$ 的矩母函数为 $M_X(t) = \\left( \\frac{${a}}{${a} - t} \\right)^{${b}}$（$t < ${a}$）。求 $M_X(0)$ 的值。`,
            ),
            answer: 1,
            solution: t(
              `For any valid moment-generating function, $M_X(0) = E[e^{0 \\cdot X}] = E[1] = 1$. Substituting $t = 0$ gives $\\left( \\frac{${a}}{${a}} \\right)^{${b}} = 1^{${b}} = 1$.`,
              `对于任何合法的矩母函数，必有 $M_X(0) = E[e^{0 \\cdot X}] = E[1] = 1$。代入 $t = 0$ 亦得 $\\left( \\frac{${a}}{${a}} \\right)^{${b}} = 1$。`,
            ),
          });
        },
      },
      {
        id: "mgf-of-finite-discrete-variable",
        title: t("MGF of a two-point discrete distribution", "两点离散分布的矩母函数"),
        explanation: t(
          "For $X$ taking the values $0$ and $k$ with $P(X = 0) = 1 - p$ and $P(X = k) = p$, $M_X(t) = E[e^{tX}] = (1 - p) + pe^{kt}$.",
          "若 $X$ 取值 $0$ 与 $k$，概率分别为 $1 - p$ 与 $p$，则 $M_X(t) = E[e^{tX}] = (1 - p) + pe^{kt}$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 30);
          const pNum = rng.pick([1, 2, 3, 4, 6, 7, 8, 9]);
          const qNum = 10 - pNum;
          const pFrac = `0.${pNum}`;
          const qFrac = `0.${qNum}`;

          const opts = [
            t(`$${qFrac} + ${pFrac} e^{${k}t}$`, `$${qFrac} + ${pFrac} e^{${k}t}$`),
            t(`$${pFrac} + ${qFrac} e^{${k}t}$`, `$${pFrac} + ${qFrac} e^{${k}t}$`),
            t(`$(${qFrac} + ${pFrac} e^t)^{${k}}$`, `$(${qFrac} + ${pFrac} e^t)^{${k}}$`),
            t(`$${qFrac} e^{-${k}t} + ${pFrac}$`, `$${qFrac} e^{-${k}t} + ${pFrac}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `A discrete random variable $X$ takes value $0$ with probability $${qFrac}$ and value $${k}$ with probability $${pFrac}$. What is the moment-generating function $M_X(t)$?`,
              `离散型随机变量 $X$ 取值 $0$ 的概率为 $${qFrac}$，取值 $${k}$ 的概率为 $${pFrac}$。其矩母函数 $M_X(t)$ 是什么？`,
            ),
            options,
            correct,
            solution: t(
              `By definition, $M_X(t) = E[e^{tX}] = P(X = 0) e^{0 \\cdot t} + P(X = ${k}) e^{${k}t} = ${qFrac} \\cdot 1 + ${pFrac} e^{${k}t} = ${qFrac} + ${pFrac} e^{${k}t}$.`,
              `按定义求期望：$M_X(t) = E[e^{tX}] = P(X = 0) e^{0 \\cdot t} + P(X = ${k}) e^{${k}t} = ${qFrac} + ${pFrac} e^{${k}t}$。`,
            ),
          });
        },
      },
    ],
  },

  // 2.6.2 Calculating Moments Using Moment-Generating Functions
  {
    id: "calculating-moments-using-moment-generating-functions",
    title: t("Calculating Moments Using Moment-Generating Functions", "利用矩母函数计算矩"),
    summary: t(
      "The n-th moment of X equals the n-th derivative of its MGF evaluated at zero: E[X^n] = M_X^{(n)}(0).",
      "随机变量 X 的 n 阶原点矩等于其矩母函数的 n 阶导数在零点处的值：E[X^n] = M_X^{(n)}(0)。",
    ),
    prerequisites: ["moment-generating-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "first-moment-via-mgf-derivative",
        title: t("Finding E[X] via the first derivative of the MGF", "利用矩母函数一阶导数求期望 E[X]"),
        explanation: t(
          "Differentiating $M_X(t)$ once and evaluating at $t = 0$ yields the first moment: $E[X] = M_X'(0)$.",
          "对矩母函数 $M_X(t)$ 求一阶导数并在 $t = 0$ 处取值，即得一阶原点矩：$E[X] = M_X'(0)$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 10);
          const theta = rng.int(2, 10);
          // M(t) = (1 - theta t)^(-k) => M'(t) = k theta (1 - theta t)^(-k-1) => M'(0) = k theta
          const mean = k * theta;

          return numberProblem({
            prompt: t(
              `The moment-generating function of a continuous random variable $X$ is $M_X(t) = (1 - ${theta} t)^{-${k}}$ for $t < \\frac{1}{${theta}}$. Find $E[X] = M_X'(0)$.`,
              `连续型随机变量 $X$ 的矩母函数为 $M_X(t) = (1 - ${theta} t)^{-${k}}$（$t < \\frac{1}{${theta}}$）。求 $E[X] = M_X'(0)$。`,
            ),
            answer: mean,
            solution: t(
              `Differentiate with respect to $t$: $M_X'(t) = -${k} (1 - ${theta} t)^{-${k + 1}} (-${theta}) = ${k * theta} (1 - ${theta} t)^{-${k + 1}}$. Evaluating at $t = 0$ gives $M_X'(0) = ${mean}$.`,
              `对 $t$ 求导：$M_X'(t) = -${k} (1 - ${theta} t)^{-${k + 1}} (-${theta}) = ${k * theta} (1 - ${theta} t)^{-${k + 1}}$。在 $t = 0$ 处求值得到 $M_X'(0) = ${mean}$。`,
            ),
          });
        },
      },
      {
        id: "second-moment-via-mgf-derivative",
        title: t("Finding E[X^2] via the second derivative of the MGF", "利用矩母函数二阶导数求二阶矩 E[X^2]"),
        explanation: t(
          "Differentiating $M_X(t)$ twice and evaluating at $t = 0$ yields the second moment: $E[X^2] = M_X''(0)$.",
          "对矩母函数 $M_X(t)$ 求二阶导数并在 $t = 0$ 处取值，即得二阶原点矩：$E[X^2] = M_X''(0)$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 8);
          const theta = rng.int(2, 6);
          // M''(t) = k(k+1) theta^2 (1 - theta t)^(-k-2) => M''(0) = k(k+1) theta^2
          const secondMoment = k * (k + 1) * theta * theta;

          return numberProblem({
            prompt: t(
              `The moment-generating function of $X$ is $M_X(t) = (1 - ${theta} t)^{-${k}}$ for $t < \\frac{1}{${theta}}$. Find the second moment $E[X^2] = M_X''(0)$.`,
              `随机变量 $X$ 的矩母函数为 $M_X(t) = (1 - ${theta} t)^{-${k}}$（$t < \\frac{1}{${theta}}$）。求二阶原点矩 $E[X^2] = M_X''(0)$。`,
            ),
            answer: secondMoment,
            solution: t(
              `Since $M_X'(t) = ${k * theta}(1 - ${theta} t)^{-${k + 1}}$, the second derivative is $M_X''(t) = ${k * (k + 1) * theta * theta}(1 - ${theta} t)^{-${k + 2}}$. At $t = 0$, $E[X^2] = M_X''(0) = ${secondMoment}$.`,
              `由 $M_X'(t) = ${k * theta}(1 - ${theta} t)^{-${k + 1}}$ 求导得 $M_X''(t) = ${k * (k + 1) * theta * theta}(1 - ${theta} t)^{-${k + 2}}$。在 $t = 0$ 处求得 $E[X^2] = M_X''(0) = ${secondMoment}$。`,
            ),
          });
        },
      },
    ],
  },

  // 2.6.3 Calculating Variance and Standard Deviation Using Moment-Generating Functions
  {
    id: "calculating-variance-and-standard-deviation-using-moment-generating-functions",
    title: t("Calculating Variance and Standard Deviation Using Moment-Generating Functions", "利用矩母函数计算方差与标准差"),
    summary: t(
      "The variance and standard deviation of X are computed from the derivatives of its MGF: Var(X) = M_X''(0) - (M_X'(0))^2 and σ = √Var(X).",
      "随机变量 X 的方差和标准差可通过其矩母函数的各阶导数计算：Var(X) = M_X''(0) - (M_X'(0))^2，标准差 σ = √Var(X)。",
    ),
    prerequisites: ["calculating-moments-using-moment-generating-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "variance-from-mgf-derivatives",
        title: t("Evaluating variance from MGF derivatives", "由矩母函数导数计算方差"),
        explanation: t(
          "For $M_X(t) = (1 - \\theta t)^{-k}$, $E[X] = k\\theta$ and $E[X^2] = k(k+1)\\theta^2$. Hence $\\operatorname{Var}(X) = k(k+1)\\theta^2 - (k\\theta)^2 = k\\theta^2$.",
          "对于 $M_X(t) = (1 - \\theta t)^{-k}$，$E[X] = k\\theta$，$E[X^2] = k(k+1)\\theta^2$。因此 $\\operatorname{Var}(X) = k(k+1)\\theta^2 - (k\\theta)^2 = k\\theta^2$。",
        ),
        generate: (rng: Rng): Problem => {
          const k = rng.int(2, 10);
          const theta = rng.int(2, 8);
          const variance = k * theta * theta;

          return numberProblem({
            prompt: t(
              `The moment-generating function of $X$ is $M_X(t) = (1 - ${theta} t)^{-${k}}$. Find $\\text{Var}(X) = M_X''(0) - (M_X'(0))^2$.`,
              `设 $X$ 的矩母函数为 $M_X(t) = (1 - ${theta} t)^{-${k}}$。计算方差 $\\text{Var}(X) = M_X''(0) - (M_X'(0))^2$。`,
            ),
            answer: variance,
            solution: t(
              `$E[X] = M_X'(0) = ${k * theta}$ and $E[X^2] = M_X''(0) = ${k * (k + 1) * theta * theta}$. Thus $\\text{Var}(X) = ${k * (k + 1) * theta * theta} - (${k * theta})^2 = ${variance}$.`,
              `$E[X] = M_X'(0) = ${k * theta}$，且 $E[X^2] = M_X''(0) = ${k * (k + 1) * theta * theta}$。因此 $\\text{Var}(X) = ${k * (k + 1) * theta * theta} - (${k * theta})^2 = ${variance}$。`,
            ),
          });
        },
      },
      {
        id: "standard-deviation-from-poisson-mgf",
        title: t("Standard deviation from an exponential-type or Poisson MGF", "由泊松型矩母函数计算标准差"),
        explanation: t(
          "For a Poisson random variable with MGF $M_X(t) = e^{\\lambda(e^t - 1)}$, $\\operatorname{Var}(X) = \\lambda$, so the standard deviation is $\\sigma = \\sqrt{\\lambda}$.",
          "对于矩母函数为 $M_X(t) = e^{\\lambda(e^t - 1)}$ 的泊松随机变量，$\\operatorname{Var}(X) = \\lambda$，标准差为 $\\sigma = \\sqrt{\\lambda}$。",
        ),
        generate: (rng: Rng): Problem => {
          const sigma = rng.int(2, 45);
          const lambda = sigma * sigma;

          return numberProblem({
            prompt: t(
              `A random variable $X$ has moment-generating function $M_X(t) = e^{${lambda}(e^t - 1)}$. Find the standard deviation $\\sigma = \\sqrt{\\text{Var}(X)}$.`,
              `随机变量 $X$ 的矩母函数为 $M_X(t) = e^{${lambda}(e^t - 1)}$。求其标准差 $\\sigma = \\sqrt{\\text{Var}(X)}$。`,
            ),
            answer: sigma,
            solution: t(
              `For $M_X(t) = e^{\\lambda(e^t - 1)}$, $M_X'(0) = \\lambda = ${lambda}$ and $M_X''(0) = \\lambda^2 + \\lambda$. Thus $\\text{Var}(X) = \\lambda = ${lambda}$, and the standard deviation is $\\sigma = \\sqrt{${lambda}} = ${sigma}$.`,
              `对于 $M_X(t) = e^{\\lambda(e^t - 1)}$，有 $M_X'(0) = \\lambda = ${lambda}$ 且 $M_X''(0) = \\lambda^2 + \\lambda$。故 $\\text{Var}(X) = \\lambda = ${lambda}$，标准差为 $\\sigma = \\sqrt{${lambda}} = ${sigma}$。`,
            ),
          });
        },
      },
    ],
  },

  // 2.6.4 Constructing Moment-Generating Functions for Discrete Probability Distributions
  {
    id: "constructing-moment-generating-functions-for-discrete-probability-distributions",
    title: t("Constructing Moment-Generating Functions for Discrete Probability Distributions", "构造离散型概率分布的矩母函数"),
    summary: t(
      "Deriving the MGF for classic discrete distributions: Binomial M(t) = (1 - p + p e^t)^n, Poisson M(t) = e^{λ(e^t - 1)}, and Geometric M(t) = p e^t / (1 - (1 - p)e^t).",
      "推导经典离散分布的矩母函数：二项分布 M(t) = (1 - p + p e^t)^n、泊松分布 M(t) = e^{λ(e^t - 1)} 及几何分布 M(t) = p e^t / (1 - (1 - p)e^t)。",
    ),
    prerequisites: ["moment-generating-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "mgf-of-binomial-distribution",
        title: t("Identifying the MGF of a Binomial distribution", "识别二项分布的矩母函数"),
        explanation: t(
          "For $X \\sim \\text{Binomial}(n, p)$, each trial has MGF $1 - p + pe^t$. By the independence of the trials, $M_X(t) = (1 - p + pe^t)^n$.",
          "对于 $X \\sim \\text{Binomial}(n, p)$，每次试验的矩母函数为 $1 - p + pe^t$，由试验的独立性得 $M_X(t) = (1 - p + pe^t)^n$。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(5, 30);
          const pPercent = rng.pick([10, 20, 25, 30, 40, 60, 70, 75, 80]);
          const p = pPercent / 100;
          const q = Number((1 - p).toFixed(2));

          const opts = [
            t(`$(${q} + ${p} e^t)^{${n}}$`, `$(${q} + ${p} e^t)^{${n}}$`),
            t(`$(${p} + ${q} e^t)^{${n}}$`, `$(${p} + ${q} e^t)^{${n}}$`),
            t(`$${q} + ${p} e^{${n}t}$`, `$${q} + ${p} e^{${n}t}$`),
            t(`$e^{${n} \\cdot ${p} (e^t - 1)}$`, `$e^{${n} \\cdot ${p} (e^t - 1)}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `A random variable $X$ has binomial distribution with $n = ${n}$ trials and success probability $p = ${p}$. Which formula gives its moment-generating function $M_X(t)$?`,
              `随机变量 $X$ 服从试验次数为 $n = ${n}$、成功概率为 $p = ${p}$ 的二项分布。下列哪个公式是其矩母函数 $M_X(t)$？`,
            ),
            options,
            correct,
            solution: t(
              `For $X \\sim \\text{Binomial}(${n}, ${p})$, $M_X(t) = (q + p e^t)^n = (${q} + ${p} e^t)^{${n}}$.`,
              `对于 $X \\sim \\text{Binomial}(${n}, ${p})$，矩母函数为 $M_X(t) = (q + p e^t)^n = (${q} + ${p} e^t)^{${n}}$。`,
            ),
          });
        },
      },
      {
        id: "mgf-of-poisson-distribution",
        title: t("Deriving the MGF of a Poisson distribution", "推导泊松分布的矩母函数"),
        explanation: t(
          "For $X \\sim \\text{Poisson}(\\lambda)$, $M_X(t) = \\sum_{k=0}^\\infty e^{tk} \\frac{e^{-\\lambda} \\lambda^k}{k!} = e^{-\\lambda} \\sum_{k=0}^\\infty \\frac{(\\lambda e^t)^k}{k!} = e^{-\\lambda} e^{\\lambda e^t} = e^{\\lambda(e^t - 1)}$.",
          "对于 $X \\sim \\text{Poisson}(\\lambda)$，$M_X(t) = \\sum_{k=0}^\\infty e^{tk} \\frac{e^{-\\lambda} \\lambda^k}{k!} = e^{-\\lambda} \\sum_{k=0}^\\infty \\frac{(\\lambda e^t)^k}{k!} = e^{-\\lambda} e^{\\lambda e^t} = e^{\\lambda(e^t - 1)}$。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 50);
          const opts = [
            t(`$e^{${lambda}(e^t - 1)}$`, `$e^{${lambda}(e^t - 1)}$`),
            t(`$e^{${lambda}(1 - e^t)}$`, `$e^{${lambda}(1 - e^t)}$`),
            t(`$(1 - ${lambda} t)^{-1}$`, `$(1 - ${lambda} t)^{-1}$`),
            t(`$\\frac{${lambda}}{${lambda} - t}$`, `$\\frac{${lambda}}{${lambda} - t}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Let $X$ have Poisson distribution with parameter $\\lambda = ${lambda}$. Which expression is the moment-generating function $M_X(t)$?`,
              `设 $X$ 服从参数为 $\\lambda = ${lambda}$ 的泊松分布。下列哪个表达式是其矩母函数 $M_X(t)$？`,
            ),
            options,
            correct,
            solution: t(
              `By summing the Poisson series: $M_X(t) = \\sum_{k=0}^\\infty e^{tk} \\frac{e^{-${lambda}} ${lambda}^k}{k!} = e^{-${lambda}} e^{${lambda} e^t} = e^{${lambda}(e^t - 1)}$.`,
              `由级数求和得：$M_X(t) = \\sum_{k=0}^\\infty e^{tk} \\frac{e^{-${lambda}} ${lambda}^k}{k!} = e^{-${lambda}} e^{${lambda} e^t} = e^{${lambda}(e^t - 1)}$。`,
            ),
          });
        },
      },
    ],
  },

  // 2.6.5 Constructing Moment-Generating Functions for Continuous Probability Distributions
  {
    id: "constructing-moment-generating-functions-for-continuous-probability-distributions",
    title: t("Constructing Moment-Generating Functions for Continuous Probability Distributions", "构造连续型概率分布的矩母函数"),
    summary: t(
      "Deriving the MGF for classic continuous distributions: Exponential M(t) = λ / (λ - t), Uniform M(t) = (e^{bt} - e^{at}) / (t(b - a)), and Normal M(t) = e^{μ t + σ^2 t^2 / 2}.",
      "推导经典连续分布的矩母函数：指数分布 M(t) = λ / (λ - t)、均匀分布 M(t) = (e^{bt} - e^{at}) / (t(b - a)) 及正态分布 M(t) = e^{μ t + σ^2 t^2 / 2}。",
    ),
    prerequisites: ["moment-generating-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "mgf-of-exponential-distribution",
        title: t("Deriving the MGF of an exponential distribution", "推导指数分布的矩母函数"),
        explanation: t(
          "For $X \\sim \\text{Exp}(\\lambda)$ and $t < \\lambda$, $M_X(t) = \\int_0^\\infty e^{tx} \\lambda e^{-\\lambda x} \\, dx = \\lambda \\int_0^\\infty e^{-(\\lambda - t)x} \\, dx = \\frac{\\lambda}{\\lambda - t}$.",
          "对于 $X \\sim \\text{Exp}(\\lambda)$，在 $t < \\lambda$ 时，$M_X(t) = \\int_0^\\infty e^{tx} \\lambda e^{-\\lambda x} \\, dx = \\lambda \\int_0^\\infty e^{-(\\lambda - t)x} \\, dx = \\frac{\\lambda}{\\lambda - t}$。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda = rng.int(2, 50);
          const opts = [
            t(`$\\frac{${lambda}}{${lambda} - t}$`, `$\\frac{${lambda}}{${lambda} - t}$`),
            t(`$\\frac{${lambda}}{${lambda} + t}$`, `$\\frac{${lambda}}{${lambda} + t}$`),
            t(`$\\frac{1}{1 - ${lambda} t^2}$`, `$\\frac{1}{1 - ${lambda} t^2}$`),
            t(`$e^{${lambda} t}$`, `$e^{${lambda} t}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Let $X$ be an exponentially distributed random variable with rate $\\lambda = ${lambda}$ ($f(x) = ${lambda} e^{-${lambda} x}$ for $x > 0$). What is its moment-generating function $M_X(t)$ for $t < ${lambda}$?`,
              `设 $X$ 服从速率参数为 $\\lambda = ${lambda}$ 的指数分布（$x > 0$ 时 $f(x) = ${lambda} e^{-${lambda} x}$）。在 $t < ${lambda}$ 时其矩母函数 $M_X(t)$ 是什么？`,
            ),
            options,
            correct,
            solution: t(
              `$M_X(t) = \\int_0^\\infty e^{tx} (${lambda} e^{-${lambda} x}) dx = ${lambda} \\int_0^\\infty e^{-(${lambda} - t)x} dx = \\frac{${lambda}}{${lambda} - t}$.`,
              `积分计算得：$M_X(t) = \\int_0^\\infty e^{tx} (${lambda} e^{-${lambda} x}) dx = \\frac{${lambda}}{${lambda} - t}$。`,
            ),
          });
        },
      },
      {
        id: "mgf-of-continuous-uniform-distribution",
        title: t("Deriving the MGF of a uniform distribution", "推导均匀分布的矩母函数"),
        explanation: t(
          "For $X \\sim \\text{Uniform}(0, b)$, $M_X(t) = \\int_0^b e^{tx} \\cdot \\frac{1}{b} \\, dx = \\frac{e^{bt} - 1}{bt}$.",
          "对于 $X \\sim \\text{Uniform}(0, b)$，$M_X(t) = \\int_0^b e^{tx} \\cdot \\frac{1}{b} \\, dx = \\frac{e^{bt} - 1}{bt}$。",
        ),
        generate: (rng: Rng): Problem => {
          const b = rng.int(2, 50);
          const opts = [
            t(`$\\frac{e^{${b}t} - 1}{${b}t}$`, `$\\frac{e^{${b}t} - 1}{${b}t}$`),
            t(`$\\frac{e^{${b}t} + 1}{${b}t}$`, `$\\frac{e^{${b}t} + 1}{${b}t}$`),
            t(`$\\frac{e^{${b}t} - 1}{t}$`, `$\\frac{e^{${b}t} - 1}{t}$`),
            t(`$e^{\\frac{${b}t}{2}}$`, `$e^{\\frac{${b}t}{2}}$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Let $X$ be uniformly distributed on $[0, ${b}]$. What is its moment-generating function $M_X(t)$ (for $t \\ne 0$)?`,
              `设 $X$ 服从区间 $[0, ${b}]$ 上的均匀分布。当 $t \\ne 0$ 时，其矩母函数 $M_X(t)$ 是什么？`,
            ),
            options,
            correct,
            solution: t(
              `$M_X(t) = \\int_0^{${b}} e^{tx} \\frac{1}{${b}} dx = \\frac{1}{${b}} \\left[ \\frac{e^{tx}}{t} \\right]_0^{${b}} = \\frac{e^{${b}t} - 1}{${b}t}$.`,
              `积分计算得：$M_X(t) = \\int_0^{${b}} e^{tx} \\frac{1}{${b}} dx = \\frac{e^{${b}t} - 1}{${b}t}$。`,
            ),
          });
        },
      },
    ],
  },

  // 2.6.6 Properties of Moment-Generating Functions
  {
    id: "properties-of-moment-generating-functions",
    title: t("Properties of Moment-Generating Functions", "矩母函数的性质"),
    summary: t(
      "Linear transformations scale MGFs via M_{aX + b}(t) = e^{bt} M_X(at). The MGF of a sum of independent random variables is the product of their MGFs.",
      "线性变换满足 M_{aX + b}(t) = e^{bt} M_X(at)。相互独立随机变量和的矩母函数等于各矩母函数的乘积。",
    ),
    prerequisites: [
      "constructing-moment-generating-functions-for-discrete-probability-distributions",
      "constructing-moment-generating-functions-for-continuous-probability-distributions",
    ],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "mgf-of-linear-transformation",
        title: t("MGF of a linear transformation Y = aX + b", "线性变换 Y = aX + b 的矩母函数"),
        explanation: t(
          "For $Y = aX + b$, $M_Y(t) = E[e^{t(aX + b)}] = E[e^{bt} e^{(at)X}] = e^{bt} M_X(at)$.",
          "对于 $Y = aX + b$，有 $M_Y(t) = E[e^{t(aX + b)}] = E[e^{bt} e^{(at)X}] = e^{bt} M_X(at)$。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(2, 12);
          let b = rng.int(2, 15);
          if (b === a) b++;
          const opts = [
            t(`$e^{${b}t} M_X(${a}t)$`, `$e^{${b}t} M_X(${a}t)$`),
            t(`$e^{${a}t} M_X(${b}t)$`, `$e^{${a}t} M_X(${b}t)$`),
            t(`$${b} e^{${a}t} M_X(t)$`, `$${b} e^{${a}t} M_X(t)$`),
            t(`$M_X(${a}t + ${b})$`, `$M_X(${a}t + ${b})$`),
          ];
          const perm = rng.shuffle([0, 1, 2, 3]);
          const options = perm.map((i) => opts[i]!);
          const correct = perm.indexOf(0);

          return choiceProblem({
            prompt: t(
              `Let $X$ have moment-generating function $M_X(t)$. Define $Y = ${a} X + ${b}$. What is the moment-generating function $M_Y(t)$ in terms of $M_X$?`,
              `设 $X$ 的矩母函数为 $M_X(t)$。定义 $Y = ${a} X + ${b}$。用 $M_X$ 表示的矩母函数 $M_Y(t)$ 是什么？`,
            ),
            options,
            correct,
            solution: t(
              `$M_Y(t) = E[e^{t(${a} X + ${b})}] = E[e^{${b}t} e^{(${a}t)X}] = e^{${b}t} E[e^{(${a}t)X}] = e^{${b}t} M_X(${a}t)$.`,
              `由定义推导：$M_Y(t) = E[e^{t(${a} X + ${b})}] = e^{${b}t} E[e^{(${a}t)X}] = e^{${b}t} M_X(${a}t)$。`,
            ),
          });
        },
      },
      {
        id: "mgf-of-sum-of-independent-variables",
        title: t("MGF of a sum of independent random variables", "独立随机变量和的矩母函数"),
        explanation: t(
          "If $X_1$ and $X_2$ are independent, $M_{X_1 + X_2}(t) = E[e^{t(X_1 + X_2)}] = E[e^{tX_1}] \\, E[e^{tX_2}] = M_{X_1}(t) \\, M_{X_2}(t)$.",
          "若 $X_1$ 与 $X_2$ 相互独立，则 $M_{X_1 + X_2}(t) = E[e^{t(X_1 + X_2)}] = E[e^{tX_1}] \\, E[e^{tX_2}] = M_{X_1}(t) \\, M_{X_2}(t)$。",
        ),
        generate: (rng: Rng): Problem => {
          const lambda1 = rng.int(2, 15);
          const lambda2 = rng.int(2, 15);
          const sumLambda = lambda1 + lambda2;

          return numberProblem({
            prompt: t(
              `Let $X_1$ and $X_2$ be independent Poisson random variables with MGFs $M_{X_1}(t) = e^{${lambda1}(e^t - 1)}$ and $M_{X_2}(t) = e^{${lambda2}(e^t - 1)}$. The MGF of their sum $S = X_1 + X_2$ is $M_S(t) = e^{\\lambda_S(e^t - 1)}$. Find $\\lambda_S$.`,
              `设 $X_1$ 与 $X_2$ 为相互独立的泊松随机变量，其矩母函数分别为 $M_{X_1}(t) = e^{${lambda1}(e^t - 1)}$ 与 $M_{X_2}(t) = e^{${lambda2}(e^t - 1)}$。两者的和 $S = X_1 + X_2$ 的矩母函数为 $M_S(t) = e^{\\lambda_S(e^t - 1)}$。求 $\\lambda_S$。`,
            ),
            answer: sumLambda,
            solution: t(
              `By independence, $M_S(t) = M_{X_1}(t) M_{X_2}(t) = e^{${lambda1}(e^t - 1)} e^{${lambda2}(e^t - 1)} = e^{(${lambda1} + ${lambda2})(e^t - 1)} = e^{${sumLambda}(e^t - 1)}$. Thus $\\lambda_S = ${sumLambda}$.`,
              `由独立性可知 $M_S(t) = M_{X_1}(t) M_{X_2}(t) = e^{${lambda1}(e^t - 1)} e^{${lambda2}(e^t - 1)} = e^{${sumLambda}(e^t - 1)}$，故 $\\lambda_S = ${sumLambda}$。`,
            ),
          });
        },
      },
    ],
  },

  // 2.6.7 The Uniqueness Property of MGFs
  {
    id: "the-uniqueness-property-of-mgfs",
    title: t("The Uniqueness Property of MGFs", "矩母函数的唯一性定理"),
    summary: t(
      "The uniqueness theorem guarantees that if two random variables have matching MGFs on an open interval around 0, they have the identical probability distribution.",
      "唯一性定理保证：若两个随机变量的矩母函数在包含 0 的开区间内处处相等，则它们具有完全相同的概率分布。",
    ),
    prerequisites: ["properties-of-moment-generating-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "recognizing-distribution-from-mgf",
        title: t("Identifying a distribution from its MGF", "根据矩母函数识别概率分布"),
        explanation: t(
          "By the uniqueness property, an MGF of the form $(q + pe^t)^n$ identifies the $\\text{Binomial}(n, p)$ distribution, and $e^{\\lambda(e^t - 1)}$ identifies $\\text{Poisson}(\\lambda)$.",
          "由唯一性定理，形如 $(q + pe^t)^n$ 的矩母函数唯一确定 $\\text{Binomial}(n, p)$ 分布，而 $e^{\\lambda(e^t - 1)}$ 唯一确定 $\\text{Poisson}(\\lambda)$ 分布。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(4, 30);
          const p = rng.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
          const q = Number((1 - p).toFixed(2));
          const mean = Number((n * p).toFixed(2));

          return numberProblem({
            prompt: t(
              `A random variable $X$ has moment-generating function $M_X(t) = (${q} + ${p} e^t)^{${n}}$. By the uniqueness theorem, identify the mean $E[X] = n p$.`,
              `随机变量 $X$ 的矩母函数为 $M_X(t) = (${q} + ${p} e^t)^{${n}}$。由唯一性定理识别该分布并计算其均值 $E[X] = n p$。`,
            ),
            answer: Q.parse(String(mean)),
            solution: t(
              `The MGF matches the form $(q + p e^t)^n$ of a $\\text{Binomial}(${n}, ${p})$ distribution. Its expected value is $E[X] = n p = ${n} \\cdot ${p} = ${mean}$.`,
              `该矩母函数符合二项分布 $\\text{Binomial}(${n}, ${p})$ 的标准形式 $(q + p e^t)^n$。其期望值为 $E[X] = n p = ${n} \\cdot ${p} = ${mean}$。`,
            ),
          });
        },
      },
      {
        id: "sum-of-independent-distributions-via-mgf",
        title: t("Deriving distribution of sums via MGF uniqueness", "应用矩母函数唯一性确定和的分布"),
        explanation: t(
          "If the $X_i \\sim \\text{Exp}(\\lambda)$ are independent, the sum $S_n = \\sum_{i=1}^n X_i$ has MGF $\\left(\\frac{\\lambda}{\\lambda - t}\\right)^n$, which identifies the $\\text{Gamma}(n, \\lambda)$ distribution.",
          "若独立随机变量 $X_i \\sim \\text{Exp}(\\lambda)$，则和 $S_n = \\sum_{i=1}^n X_i$ 的矩母函数为 $\\left(\\frac{\\lambda}{\\lambda - t}\\right)^n$，唯一对应 $\\text{Gamma}(n, \\lambda)$ 分布。",
        ),
        generate: (rng: Rng): Problem => {
          const n = rng.int(2, 10);
          const lambda = rng.int(2, 15);
          // E[S] = n / lambda
          const num = n;
          const den = lambda;

          return numberProblem({
            prompt: t(
              `Let $X_1, \\dots, X_{${n}}$ be independent, identically distributed exponential random variables each with MGF $M(t) = \\frac{${lambda}}{${lambda} - t}$. By the uniqueness property of MGFs, their sum $S = \\sum_{i=1}^{${n}} X_i$ has MGF $M_S(t) = \\left( \\frac{${lambda}}{${lambda} - t} \\right)^{${n}}$. Find the mean $E[S]$.`,
              `设 $X_1, \\dots, X_{${n}}$ 为独立同分布的指数随机变量，各自的矩母函数为 $M(t) = \\frac{${lambda}}{${lambda} - t}$。由矩母函数唯一性定理，和 $S = \\sum_{i=1}^{${n}} X_i$ 的矩母函数为 $M_S(t) = \\left( \\frac{${lambda}}{${lambda} - t} \\right)^{${n}}$。求和的均值 $E[S]$。`,
            ),
            answer: Q.of(num, den),
            solution: t(
              `The MGF uniquely identifies $S$ as a $\\text{Gamma}(${n}, ${lambda})$ random variable. Its expected value is $E[S] = \\frac{n}{\\lambda} = \\frac{${n}}{${lambda}}${lowestTerms(n, lambda)}$.`,
              `该矩母函数唯一对应伽马分布 $\\text{Gamma}(${n}, ${lambda})$。其期望值为 $E[S] = \\frac{n}{\\lambda} = \\frac{${n}}{${lambda}}${lowestTerms(n, lambda)}$。`,
            ),
          });
        },
      },
    ],
  },
];
