import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly } from "@ga/subject-math";
import { numberProblem, steps } from "../problems.ts";

/** Topics for Unit 5: Laplace Transforms in Differential Equations. */
export const differentialEquationsLaplaceTopics: TopicDef[] = [
  // 5.18.2 The Unit Step Function
  {
    id: "the-unit-step-function",
    title: t("The Unit Step Function", "单位阶跃函数"),
    summary: t(
      "The Heaviside unit step function u(t - c) equals 0 for t < c and 1 for t >= c, switching signals on at t = c.",
      "赫维赛德单位阶跃函数 u(t - c) 在 t < c 时取 0，在 t >= c 时取 1，用于在时刻 t = c 开启信号。",
    ),
    prerequisites: ["the-floor-and-ceiling-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-unit-step-functions",
        title: t("Evaluating linear combinations of unit step functions", "计算单位阶跃函数的线性组合"),
        explanation: t(
          "The unit step function is defined as $u(t - c) = 0$ for $t < c$ and $u(t - c) = 1$ for $t \\ge c$. For $f(t) = a u(t - c_1) + b u(t - c_2)$ with $c_1 < c_2 < t_0$, both step functions are active, so $f(t_0) = a + b$.",
          "单位阶跃函数定义为：当 $t < c$ 时 $u(t - c) = 0$；当 $t \\ge c$ 时 $u(t - c) = 1$。对于 $f(t) = a u(t - c_1) + b u(t - c_2)$（其中 $c_1 < c_2 < t_0$），在 $t_0$ 处两个阶跃函数均已开启，故 $f(t_0) = a + b$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 35);
          const b = rng.int(2, 35);
          const c1 = rng.int(1, 5);
          const c2 = c1 + rng.int(2, 6);
          const t0 = c2 + rng.int(1, 4);
          const ans = a + b;

          const prompt = t(
            `Given the signal $f(t) = ${a} u(t - ${c1}) + ${b} u(t - ${c2})$, where $u(t)$ is the unit step function, evaluate $f(${t0})$.`,
            `设信号 $f(t) = ${a} u(t - ${c1}) + ${b} u(t - ${c2})$，其中 $u(t)$ 为单位阶跃函数。求 $f(${t0})$ 的值。`,
          );
          const solution = t(
            steps(
              `The unit step function $u(t - c)$ is $1$ for $t \\ge c$ and $0$ for $t < c$.`,
              `Since $${t0} > ${c1}$, $u(${t0} - ${c1}) = 1$.`,
              `Since $${t0} > ${c2}$, $u(${t0} - ${c2}) = 1$.`,
              `Therefore, $f(${t0}) = ${a}(1) + ${b}(1) = ${ans}$.`,
            ),
            steps(
              `单位阶跃函数 $u(t - c)$ 在 $t \\ge c$ 时取值为 $1$，在 $t < c$ 时取值为 $0$。`,
              `因为 $${t0} > ${c1}$，所以 $u(${t0} - ${c1}) = 1$。`,
              `因为 $${t0} > ${c2}$，所以 $u(${t0} - ${c2}) = 1$。`,
              `因此，$f(${t0}) = ${a}(1) + ${b}(1) = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [a, b, Math.abs(a - b), a + b + c1, ans + 1, ans - 1],
          });
        },
      },
    ],
  },

  // 5.18.3 Piecewise Continuity and Piecewise Smoothness
  {
    id: "piecewise-continuity-and-piecewise-smoothness",
    title: t("Piecewise Continuity and Piecewise Smoothness", "分段连续性与分段光滑性"),
    summary: t(
      "A function is piecewise continuous on [0, infinity) if it is continuous except at isolated jump discontinuities where finite one-sided limits exist.",
      "如果在 [0, 无穷) 上除有限个孤立跳跃间断点外连续，且在间断点处单侧极限均存在且有限，则称该函数为分段连续函数。",
    ),
    prerequisites: ["the-unit-step-function"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "jump-discontinuity-magnitude",
        title: t("Calculating the jump magnitude of a piecewise function", "计算分段函数的跳跃幅度"),
        explanation: t(
          "At a jump discontinuity $t = c$, the jump magnitude is $\\Delta f(c) = f(c^+) - f(c^-) = \\lim_{t \\to c^+} f(t) - \\lim_{t \\to c^-} f(t)$.",
          "在跳跃间断点 $t = c$ 处，跳跃幅度定义为右极限减去左极限：$\\Delta f(c) = f(c^+) - f(c^-) = \\lim_{t \\to c^+} f(t) - \\lim_{t \\to c^-} f(t)$。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.int(2, 6);
          const k = rng.int(2, 8);
          const m = rng.int(1, 10);
          const b = rng.int(1, 15);
          const leftVal = m * c + b;
          const rightVal = k * c * c;
          const ans = rightVal - leftVal;

          const prompt = t(
            `Consider the piecewise continuous function $f(t) = \\begin{cases} ${poly([m, "t"])} + ${b}, & 0 \\le t < ${c} \\\\ ${poly([k, "t^2"])}, & t \\ge ${c} \\end{cases}$. Find the jump magnitude $\\Delta f(${c}) = \\lim_{t \\to ${c}^+} f(t) - \\lim_{t \\to ${c}^-} f(t)$.`,
            `考虑分段连续函数 $f(t) = \\begin{cases} ${poly([m, "t"])} + ${b}, & 0 \\le t < ${c} \\\\ ${poly([k, "t^2"])}, & t \\ge ${c} \\end{cases}$。计算在 $t = ${c}$ 处的跳跃量 $\\Delta f(${c}) = \\lim_{t \\to ${c}^+} f(t) - \\lim_{t \\to ${c}^-} f(t)$。`,
          );
          const solution = t(
            steps(
              `The left-hand limit is $\\lim_{t \\to ${c}^-} f(t) = ${m}(${c}) + ${b} = ${leftVal}$.`,
              `The right-hand limit is $\\lim_{t \\to ${c}^+} f(t) = ${k}(${c})^2 = ${rightVal}$.`,
              `The jump magnitude is $f(${c}^+) - f(${c}^-) = ${rightVal} - ${leftVal} = ${ans}$.`,
            ),
            steps(
              `左极限为 $\\lim_{t \\to ${c}^-} f(t) = ${m}(${c}) + ${b} = ${leftVal}$。`,
              `右极限为 $\\lim_{t \\to ${c}^+} f(t) = ${k}(${c})^2 = ${rightVal}$。`,
              `跳跃幅度为 $f(${c}^+) - f(${c}^-) = ${rightVal} - ${leftVal} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [leftVal, rightVal, leftVal - rightVal, ans + c, ans - c],
          });
        },
      },
    ],
  },

  // 5.18.4 Introduction to Laplace Transforms
  {
    id: "introduction-to-laplace-transforms",
    title: t("Introduction to Laplace Transforms", "拉普拉斯变换简介"),
    summary: t(
      "The Laplace transform $\\mathcal{L}\\{f(t)\\}(s) = \\int_0^{\\infty} e^{-st} f(t)\\,dt$ turns a function of time into an algebraic function of $s$.",
      "拉普拉斯变换 $\\mathcal{L}\\{f(t)\\}(s) = \\int_0^{\\infty} e^{-st} f(t)\\,dt$ 把时间函数变为 $s$ 的代数函数，是求解微分方程的基本工具。",
    ),
    prerequisites: ["piecewise-continuity-and-piecewise-smoothness"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "laplace-transform-integral-definition",
        title: t("Evaluating the Laplace transform integral of a constant", "计算常数函数的拉普拉斯积分"),
        explanation: t(
          "By definition, $\\mathcal{L}\\{C\\}(s) = \\int_0^\\infty C e^{-st}\\,dt = \\left[ -\\frac{C}{s} e^{-st} \\right]_0^\\infty = \\frac{C}{s}$ for $s > 0$.",
          "根据定义，$\\mathcal{L}\\{C\\}(s) = \\int_0^\\infty C e^{-st}\\,dt = \\left[ -\\frac{C}{s} e^{-st} \\right]_0^\\infty = \\frac{C}{s}$（当 $s > 0$ 时）。",
        ),
        generate(rng: Rng): Problem {
          const s = rng.int(2, 10);
          const ans = rng.int(2, 35);
          const C = ans * s;

          const prompt = t(
            `Evaluate the Laplace transform integral $\\mathcal{L}\\{${C}\\}(${s}) = \\int_0^\\infty ${C} e^{-${s}t}\\,dt$.`,
            `计算拉普拉斯变换积分 $\\mathcal{L}\\{${C}\\}(${s}) = \\int_0^\\infty ${C} e^{-${s}t}\\,dt$ 的值。`,
          );
          const solution = t(
            steps(
              `The Laplace transform of a constant $C$ is $\\mathcal{L}\\{C\\}(s) = \\frac{C}{s}$.`,
              `Substitute $C = ${C}$ and $s = ${s}$: $\\frac{${C}}{${s}} = ${ans}$.`,
            ),
            steps(
              `常数 $C$ 的拉普拉斯变换公式为 $\\mathcal{L}\\{C\\}(s) = \\frac{C}{s}$。`,
              `代入 $C = ${C}$ 和 $s = ${s}$ 得：$\\frac{${C}}{${s}} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [C, s, ans + s, ans * s, ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 5.18.5 Linearity of Laplace Transforms
  {
    id: "linearity-of-laplace-transforms",
    title: t("Linearity of Laplace Transforms", "拉普拉斯变换的线性性质"),
    summary: t(
      "Linearity allows term-by-term transformation: L{c1 f1(t) + c2 f2(t)} = c1 L{f1(t)} + c2 L{f2(t)}.",
      "线性性质允许逐项变换：L{c1 f1(t) + c2 f2(t)} = c1 L{f1(t)} + c2 L{f2(t)}。",
    ),
    prerequisites: ["introduction-to-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-linear-combinations-of-transforms",
        title: t("Transforming linear combinations of powers of t", "变换 t 的幂的线性组合"),
        explanation: t(
          "Recall $\\mathcal{L}\\{1\\} = \\frac{1}{s}$, $\\mathcal{L}\\{t\\} = \\frac{1}{s^2}$, and $\\mathcal{L}\\{t^2\\} = \\frac{2}{s^3}$. The leading high-frequency coefficient of $s^3 \\mathcal{L}\\{a t^2 + b t + c\\}$ as $s \\to 0$ is $2a$.",
          "已知 $\\mathcal{L}\\{1\\} = \\frac{1}{s}$，$\\mathcal{L}\\{t\\} = \\frac{1}{s^2}$，$\\mathcal{L}\\{t^2\\} = \\frac{2}{s^3}$。$\\mathcal{L}\\{a t^2 + b t + c\\}$ 中 $1/s^3$ 项的系数为 $2a$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 35);
          const b = rng.int(1, 20);
          const c = rng.int(1, 20);
          const ans = 2 * a;

          const prompt = t(
            `Let $F(s) = \\mathcal{L}\\{${a} t^2 + ${b} t + ${c}\\}$. Find the coefficient of $\\frac{1}{s^3}$ in the partial fraction expansion of $F(s)$.`,
            `设 $F(s) = \\mathcal{L}\\{${a} t^2 + ${b} t + ${c}\\}$。求 $F(s)$ 在部分分式展开中 $\\frac{1}{s^3}$ 项的系数。`,
          );
          const solution = t(
            steps(
              `Using linearity, $\\mathcal{L}\\{${a} t^2 + ${b} t + ${c}\\} = ${a} \\mathcal{L}\\{t^2\\} + ${b} \\mathcal{L}\\{t\\} + ${c} \\mathcal{L}\\{1\\}$.`,
              `Since $\\mathcal{L}\\{t^2\\} = \\frac{2!}{s^3} = \\frac{2}{s^3}$, the term is $\\frac{2(${a})}{s^3} = \\frac{${ans}}{s^3}$.`,
              `Thus the coefficient of $\\frac{1}{s^3}$ is ${ans}.`,
            ),
            steps(
              `利用拉普拉斯变换的线性性质：$\\mathcal{L}\\{${a} t^2 + ${b} t + ${c}\\} = ${a} \\mathcal{L}\\{t^2\\} + ${b} \\mathcal{L}\\{t\\} + ${c} \\mathcal{L}\\{1\\}$。`,
              `因为 $\\mathcal{L}\\{t^2\\} = \\frac{2!}{s^3} = \\frac{2}{s^3}$，该分项为 $\\frac{2(${a})}{s^3} = \\frac{${ans}}{s^3}$。`,
              `因此 $\\frac{1}{s^3}$ 项的系数为 $${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [a, 6 * a, a + b, 2 * b, ans + 2, ans - 2],
          });
        },
      },
    ],
  },

  // 5.18.6 Laplace Transforms of Piecewise Continuous Functions
  {
    id: "laplace-transforms-of-piecewise-continuous-functions",
    title: t("Laplace Transforms of Piecewise Continuous Functions", "分段连续函数的拉普拉斯变换"),
    summary: t(
      "A pulse of height h on [0, c) can be transformed by direct integration or using the unit step expression h[1 - u(t - c)].",
      "区间 [0, c) 上的高度为 h 的矩形脉冲可通过直接积分或改写为 h[1 - u(t - c)] 进行拉普拉斯变换。",
    ),
    prerequisites: ["linearity-of-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "transform-of-finite-pulse",
        title: t("Zero-frequency limit of a finite pulse transform", "有限脉冲变换的零频极限"),
        explanation: t(
          "For a finite pulse $f(t) = h$ on $[0, c)$ and $0$ for $t \\ge c$, $\\lim_{s \\to 0^+} F(s) = \\int_0^c h\\,dt = hc$, representing the total area under the signal.",
          "对于在 $[0, c)$ 上取值 $h$、在 $t \\ge c$ 上取值 $0$ 的脉冲信号，其变换在 $s \\to 0^+$ 时的极限为 $\\lim_{s \\to 0^+} F(s) = \\int_0^c h\\,dt = hc$，代表信号下方的总面积。",
        ),
        generate(rng: Rng): Problem {
          const h = rng.int(2, 15);
          const c = rng.int(2, 15);
          const ans = h * c;

          const prompt = t(
            `Let $f(t) = \\begin{cases} ${h}, & 0 \\le t < ${c} \\\\ 0, & t \\ge ${c} \\end{cases}$ and let $F(s) = \\mathcal{L}\\{f(t)\\}$. Compute the low-frequency limit $\\lim_{s \\to 0^+} F(s)$.`,
            `设 $f(t) = \\begin{cases} ${h}, & 0 \\le t < ${c} \\\\ 0, & t \\ge ${c} \\end{cases}$，其拉普拉斯变换为 $F(s) = \\mathcal{L}\\{f(t)\\}$。计算低频极限 $\\lim_{s \\to 0^+} F(s)$ 的值。`,
          );
          const solution = t(
            steps(
              `The Laplace transform is $F(s) = \\int_0^\\infty e^{-st} f(t)\\,dt = \\int_0^{${c}} ${h} e^{-st}\\,dt$.`,
              `Taking the limit as $s \\to 0^+$, $e^{-st} \\to 1$, so $\\lim_{s \\to 0^+} F(s) = \\int_0^{${c}} ${h}\\,dt = (${h})(${c}) = ${ans}$.`,
            ),
            steps(
              `拉普拉斯变换为 $F(s) = \\int_0^\\infty e^{-st} f(t)\\,dt = \\int_0^{${c}} ${h} e^{-st}\\,dt$。`,
              `取极限 $s \\to 0^+$，被积函数中 $e^{-st} \\to 1$，因此 $\\lim_{s \\to 0^+} F(s) = \\int_0^{${c}} ${h}\\,dt = (${h})(${c}) = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [h + c, 2 * (h + c), h * (c + 1), ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 5.18.7 The Smoothness Property of Laplace Transforms
  {
    id: "the-smoothness-property-of-laplace-transforms",
    title: t("The Smoothness Property of Laplace Transforms", "拉普拉斯变换的光滑性质"),
    summary: t(
      "Differentiating F(s) in the frequency domain corresponds to multiplication by -t in the time domain: d/ds F(s) = -L{t f(t)}.",
      "频域中的求导对应于时域中乘以 -t：d/ds F(s) = -L{t f(t)}。这体现了拉普拉斯变换在其收敛域内的无穷阶光滑性。",
    ),
    prerequisites: ["laplace-transforms-of-piecewise-continuous-functions"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "multiplication-by-t-frequency-differentiation",
        title: t("Frequency differentiation formula for t e^(at)", "t e^(at) 的频域求导公式"),
        explanation: t(
          "Since $\\mathcal{L}\\{e^{at}\\} = \\frac{1}{s - a}$, differentiation gives $\\mathcal{L}\\{t e^{at}\\} = -\\frac{d}{ds}\\left(\\frac{1}{s - a}\\right) = \\frac{1}{(s - a)^2}$. For $f(t) = c t e^{at}$, $(s - a)^2 \\mathcal{L}\\{f(t)\\} = c$.",
          "因为 $\\mathcal{L}\\{e^{at}\\} = \\frac{1}{s - a}$，求导可得 $\\mathcal{L}\\{t e^{at}\\} = -\\frac{d}{ds}\\left(\\frac{1}{s - a}\\right) = \\frac{1}{(s - a)^2}$。对于 $f(t) = c t e^{at}$，有 $(s - a)^2 \\mathcal{L}\\{f(t)\\} = c$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 10);
          const c = rng.int(2, 35);
          const ans = c;

          const prompt = t(
            `Let $f(t) = ${c} t e^{${a}t}$. Evaluate the algebraic expression $(s - ${a})^2 \\mathcal{L}\\{f(t)\\}$.`,
            `设 $f(t) = ${c} t e^{${a}t}$。求代数表达式 $(s - ${a})^2 \\mathcal{L}\\{f(t)\\}$ 的值。`,
          );
          const solution = t(
            steps(
              `The differentiation rule gives $\\mathcal{L}\\{t g(t)\\} = -G'(s)$.`,
              `For $g(t) = e^{${a}t}$, $G(s) = \\frac{1}{s - ${a}}$, so $-G'(s) = \\frac{1}{(s - ${a})^2}$.`,
              `Multiplying by the coefficient $${c}$, $\\mathcal{L}\\{f(t)\\} = \\frac{${c}}{(s - ${a})^2}$.`,
              `Therefore, $(s - ${a})^2 \\mathcal{L}\\{f(t)\\} = ${ans}$.`,
            ),
            steps(
              `频域求导法则为 $\\mathcal{L}\\{t g(t)\\} = -G'(s)$。`,
              `当 $g(t) = e^{${a}t}$ 时，$G(s) = \\frac{1}{s - ${a}}$，故 $-G'(s) = \\frac{1}{(s - ${a})^2}$。`,
              `乘以系数 $${c}$，得 $\\mathcal{L}\\{f(t)\\} = \\frac{${c}}{(s - ${a})^2}$。`,
              `因此，$(s - ${a})^2 \\mathcal{L}\\{f(t)\\} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [a * c, a, 2 * c, ans + 1, ans - 1],
          });
        },
      },
    ],
  },

  // 5.18.8 Laplace Transforms of Derivatives
  {
    id: "laplace-transforms-of-derivatives",
    title: t("Laplace Transforms of Derivatives", "导数的拉普拉斯变换"),
    summary: t(
      "Transforms of derivatives bring in the initial conditions: $\\mathcal{L}\\{y'\\} = sY(s) - y(0)$ and $\\mathcal{L}\\{y''\\} = s^2 Y(s) - sy(0) - y'(0)$.",
      "导数的拉普拉斯变换自动带入初始条件：$\\mathcal{L}\\{y'\\} = sY(s) - y(0)$，$\\mathcal{L}\\{y''\\} = s^2 Y(s) - sy(0) - y'(0)$。",
    ),
    prerequisites: ["the-smoothness-property-of-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "second-derivative-initial-value-formula",
        title: t("Initial condition polynomial from second derivative transform", "二阶导数变换中的初值多项式"),
        explanation: t(
          "For an IVP with $y(0) = y_0$ and $y'(0) = y_1$, the Laplace transform satisfies $s^2 Y(s) - \\mathcal{L}\\{y''\\} = y_0 s + y_1$. At $s = 1$, this polynomial equals $y_0 + y_1$.",
          "在初值问题 $y(0) = y_0$ 和 $y'(0) = y_1$ 中，导数变换公式为 $\\mathcal{L}\\{y''\\} = s^2 Y(s) - y_0 s - y_1$。因此 $s^2 Y(s) - \\mathcal{L}\\{y''\\} = y_0 s + y_1$，在 $s = 1$ 处该值等于 $y_0 + y_1$。",
        ),
        generate(rng: Rng): Problem {
          const y0 = rng.int(2, 25);
          const y1 = rng.int(2, 25);
          const ans = y0 + y1;

          const prompt = t(
            `Suppose $y(t)$ satisfies initial conditions $y(0) = ${y0}$ and $y'(0) = ${y1}$. Define the polynomial $P(s) = s^2 Y(s) - \\mathcal{L}\\{y''(t)\\}$. Evaluate $P(1)$.`,
            `设函数 $y(t)$ 满足初始条件 $y(0) = ${y0}$ 与 $y'(0) = ${y1}$。定义多项式 $P(s) = s^2 Y(s) - \\mathcal{L}\\{y''(t)\\}$。计算 $P(1)$ 的值。`,
          );
          const solution = t(
            steps(
              `The transform of the second derivative is $\\mathcal{L}\\{y''\\} = s^2 Y(s) - s y(0) - y'(0)$.`,
              `Rearranging gives $P(s) = s^2 Y(s) - \\mathcal{L}\\{y''\\} = s y(0) + y'(0) = ${y0}s + ${y1}$.`,
              `At $s = 1$, $P(1) = ${y0}(1) + ${y1} = ${ans}$.`,
            ),
            steps(
              `二阶导数的拉普拉斯变换公式为 $\\mathcal{L}\\{y''\\} = s^2 Y(s) - s y(0) - y'(0)$。`,
              `移项得 $P(s) = s^2 Y(s) - \\mathcal{L}\\{y''\\} = s y(0) + y'(0) = ${y0}s + ${y1}$。`,
              `代入 $s = 1$，得 $P(1) = ${y0}(1) + ${y1} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [y0, y1, Math.abs(y0 - y1), y0 * y1, ans + 1, ans - 1],
          });
        },
      },
    ],
  },

  // 5.18.9 Laplace Transforms of Integrals
  {
    id: "laplace-transforms-of-integrals",
    title: t("Laplace Transforms of Integrals", "积分的拉普拉斯变换"),
    summary: t(
      "Integrating in time corresponds to dividing by $s$: $\\mathcal{L}\\left\\{\\int_0^t f(\\tau)\\,d\\tau\\right\\} = \\frac{F(s)}{s}$.",
      "时域中的积分对应于除以 $s$：$\\mathcal{L}\\left\\{\\int_0^t f(\\tau)\\,d\\tau\\right\\} = \\frac{F(s)}{s}$。",
    ),
    prerequisites: ["laplace-transforms-of-derivatives"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "transform-of-running-integral",
        title: t("Applying the integral theorem of Laplace transforms", "应用拉普拉斯变换的积分定理"),
        explanation: t(
          "For $g(t) = \\int_0^t c e^{a\\tau}\\,d\\tau$, the integral theorem states $\\mathcal{L}\\{g(t)\\} = \\frac{1}{s} \\mathcal{L}\\{c e^{at}\\} = \\frac{c}{s(s - a)}$. Thus $s(s - a) \\mathcal{L}\\{g(t)\\} = c$.",
          "对于 $g(t) = \\int_0^t c e^{a\\tau}\\,d\\tau$，由积分定理可知 $\\mathcal{L}\\{g(t)\\} = \\frac{1}{s} \\mathcal{L}\\{c e^{at}\\} = \\frac{c}{s(s - a)}$。因此 $s(s - a) \\mathcal{L}\\{g(t)\\} = c$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 10);
          const c = rng.int(2, 35);
          const ans = c;

          const prompt = t(
            `Let $g(t) = \\int_0^t ${c} e^{${a}\\tau}\\,d\\tau$. Find the value of the product $s(s - ${a}) \\mathcal{L}\\{g(t)\\}$.`,
            `设 $g(t) = \\int_0^t ${c} e^{${a}\\tau}\\,d\\tau$。求乘积 $s(s - ${a}) \\mathcal{L}\\{g(t)\\}$ 的值。`,
          );
          const solution = t(
            steps(
              `By the integration property of Laplace transforms, $\\mathcal{L}\\left\\{\\int_0^t f(\\tau)\\,d\\tau\\right\\} = \\frac{1}{s} F(s)$.`,
              `Here $f(t) = ${c} e^{${a}t}$, so $F(s) = \\frac{${c}}{s - ${a}}$.`,
              `Thus $\\mathcal{L}\\{g(t)\\} = \\frac{${c}}{s(s - ${a})}$.`,
              `Multiplying by $s(s - ${a})$ yields $${ans}$.`,
            ),
            steps(
              `根据拉普拉斯变换的积分性质，$\\mathcal{L}\\left\\{\\int_0^t f(\\tau)\\,d\\tau\\right\\} = \\frac{1}{s} F(s)$。`,
              `此处 $f(t) = ${c} e^{${a}t}$，其变换为 $F(s) = \\frac{${c}}{s - ${a}}$。`,
              `因此 $\\mathcal{L}\\{g(t)\\} = \\frac{${c}}{s(s - ${a})}$。`,
              `两端乘以 $s(s - ${a})$ 即得 $${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [a * c, a, 2 * c, ans + a, ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 5.18.10 The First Shifting Theorem of Laplace Transforms
  {
    id: "the-first-shifting-theorem-of-laplace-transforms",
    title: t("The First Shifting Theorem of Laplace Transforms", "拉普拉斯变换的第一位移定理"),
    summary: t(
      "Multiplying by $e^{at}$ shifts the transform by $a$: $\\mathcal{L}\\{e^{at} f(t)\\} = F(s - a)$.",
      "乘以 $e^{at}$ 使变换平移 $a$：$\\mathcal{L}\\{e^{at} f(t)\\} = F(s - a)$。",
    ),
    prerequisites: ["laplace-transforms-of-integrals"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "exponential-shift-rule",
        title: t("Applying the first shifting theorem to damped sine", "对指数衰减正弦应用第一位移定理"),
        explanation: t(
          "For $f(t) = e^{at} \\sin(\\omega t)$, $\\mathcal{L}\\{f(t)\\} = \\frac{\\omega}{(s - a)^2 + \\omega^2} = \\frac{\\omega}{s^2 - 2as + (a^2 + \\omega^2)}$. The constant term in the denominator is $a^2 + \\omega^2$.",
          "对于 $f(t) = e^{at} \\sin(\\omega t)$，$\\mathcal{L}\\{f(t)\\} = \\frac{\\omega}{(s - a)^2 + \\omega^2} = \\frac{\\omega}{s^2 - 2as + (a^2 + \\omega^2)}$。分母中的常数项为 $a^2 + \\omega^2$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(1, 10);
          const omega = rng.int(2, 15);
          const ans = a * a + omega * omega;

          const prompt = t(
            `Let $F(s) = \\mathcal{L}\\{e^{${a}t} \\sin(${omega}t)\\}$. Find the constant term in the denominator polynomial of $F(s)$ when written in standard form $\\frac{N(s)}{s^2 + p s + q}$.`,
            `设 $F(s) = \\mathcal{L}\\{e^{${a}t} \\sin(${omega}t)\\}$。当将其写为标准分式 $\\frac{N(s)}{s^2 + p s + q}$ 时，求分母多项式的常数项 $q$。`,
          );
          const solution = t(
            steps(
              `The base transform is $\\mathcal{L}\\{\\sin(${omega}t)\\} = \\frac{${omega}}{s^2 + ${omega * omega}}$.`,
              `By the first shifting theorem, $\\mathcal{L}\\{e^{${a}t} \\sin(${omega}t)\\} = \\frac{${omega}}{(s - ${a})^2 + ${omega * omega}}$.`,
              `Expand the denominator: $(s - ${a})^2 + ${omega * omega} = s^2 - ${2 * a}s + (${a * a} + ${omega * omega}) = s^2 - ${2 * a}s + ${ans}$.`,
              `Thus the constant term is $q = ${ans}$.`,
            ),
            steps(
              `基本变换为 $\\mathcal{L}\\{\\sin(${omega}t)\\} = \\frac{${omega}}{s^2 + ${omega * omega}}$。`,
              `由第一位移定理，$\\mathcal{L}\\{e^{${a}t} \\sin(${omega}t)\\} = \\frac{${omega}}{(s - ${a})^2 + ${omega * omega}}$。`,
              `展开分母：$(s - ${a})^2 + ${omega * omega} = s^2 - ${2 * a}s + (${a * a} + ${omega * omega}) = s^2 - ${2 * a}s + ${ans}$。`,
              `因此常数项为 $q = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [a * a, omega * omega, Math.abs(a * a - omega * omega), ans + 2 * a, ans - 1],
          });
        },
      },
    ],
  },

  // 5.18.11 The Second Shifting Theorem of Laplace Transforms
  {
    id: "the-second-shifting-theorem-of-laplace-transforms",
    title: t("The Second Shifting Theorem of Laplace Transforms", "拉普拉斯变换的第二位移定理"),
    summary: t(
      "Delaying a signal by $c$ and switching it on with a step function multiplies the transform by $e^{-cs}$: $\\mathcal{L}\\{u(t - c)g(t - c)\\} = e^{-cs}G(s)$.",
      "把信号延迟 $c$ 并乘以阶跃函数，其变换乘以 $e^{-cs}$：$\\mathcal{L}\\{u(t - c)g(t - c)\\} = e^{-cs}G(s)$。",
    ),
    prerequisites: ["the-first-shifting-theorem-of-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "time-delayed-unit-step-transform",
        title: t("Applying the second shifting theorem to delayed linear ramp", "对延迟线性斜坡应用第二位移定理"),
        explanation: t(
          "For $f(t) = k u(t - c)(t - c)$, the second shifting theorem yields $\\mathcal{L}\\{f(t)\\} = k e^{-cs} \\mathcal{L}\\{t\\} = \\frac{k e^{-cs}}{s^2}$. Thus $s^2 e^{cs} \\mathcal{L}\\{f(t)\\} = k$.",
          "对于 $f(t) = k u(t - c)(t - c)$，应用第二位移定理得 $\\mathcal{L}\\{f(t)\\} = k e^{-cs} \\mathcal{L}\\{t\\} = \\frac{k e^{-cs}}{s^2}$。因此 $s^2 e^{cs} \\mathcal{L}\\{f(t)\\} = k$。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.int(1, 8);
          const k = rng.int(2, 35);
          const ans = k;

          const prompt = t(
            `Let $f(t) = ${k} u(t - ${c})(t - ${c})$. Evaluate the expression $s^2 e^{${c}s} \\mathcal{L}\\{f(t)\\}$.`,
            `设 $f(t) = ${k} u(t - ${c})(t - ${c})$。计算表达式 $s^2 e^{${c}s} \\mathcal{L}\\{f(t)\\}$ 的值。`,
          );
          const solution = t(
            steps(
              `The second shifting theorem states that $\\mathcal{L}\\{u(t - c) g(t - c)\\} = e^{-cs} G(s)$.`,
              `Here $g(t) = ${k}t$, so $G(s) = \\mathcal{L}\\{${k}t\\} = \\frac{${k}}{s^2}$.`,
              `Thus $\\mathcal{L}\\{f(t)\\} = \\frac{${k} e^{-${c}s}}{s^2}$.`,
              `Multiplying by $s^2 e^{${c}s}$ cancels both denominators and exponentials, leaving $${ans}$.`,
            ),
            steps(
              `第二位移定理表明 $\\mathcal{L}\\{u(t - c) g(t - c)\\} = e^{-cs} G(s)$。`,
              `此处 $g(t) = ${k}t$，故 $G(s) = \\mathcal{L}\\{${k}t\\} = \\frac{${k}}{s^2}$。`,
              `因此 $\\mathcal{L}\\{f(t)\\} = \\frac{${k} e^{-${c}s}}{s^2}$。`,
              `乘以 $s^2 e^{${c}s}$ 后消去分母与指数因子，结果为 $${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [c * k, c, 2 * k, ans + 1, ans - 1],
          });
        },
      },
    ],
  },

  // 5.18.12 Inverse Laplace Transforms
  {
    id: "inverse-laplace-transforms",
    title: t("Inverse Laplace Transforms", "拉普拉斯逆变换"),
    summary: t(
      "The inverse transform $\\mathcal{L}^{-1}\\{F(s)\\}$ recovers $f(t)$ through partial fractions and a table of known pairs.",
      "拉普拉斯逆变换 $\\mathcal{L}^{-1}\\{F(s)\\}$ 借助部分分式与基本变换表还原 $f(t)$。",
    ),
    prerequisites: ["the-second-shifting-theorem-of-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "partial-fractions-for-inverse-laplace",
        title: t("Initial value from partial fraction inverse transform", "由部分分式逆变换确定初值"),
        explanation: t(
          "For $F(s) = \\frac{A}{s - a} + \\frac{B}{s - b}$, the inverse transform is $f(t) = A e^{at} + B e^{bt}$. At $t = 0$, $f(0) = A + B$.",
          "对于 $F(s) = \\frac{A}{s - a} + \\frac{B}{s - b}$，逆变换为 $f(t) = A e^{at} + B e^{bt}$。在 $t = 0$ 处，$f(0) = A + B$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(1, 5);
          const b = a + rng.int(2, 6);
          const A = rng.int(2, 20);
          const B = rng.int(2, 20);
          const numS = A + B;
          const numConst = A * b + B * a;
          const ans = numS;

          const prompt = t(
            `Let $F(s) = \\frac{${numS}s - ${numConst}}{(s - ${a})(s - ${b})}$ be the Laplace transform of $f(t)$. Find the initial value $f(0) = \\lim_{t \\to 0} f(t)$.`,
            `设 $f(t)$ 的拉普拉斯变换为 $F(s) = \\frac{${numS}s - ${numConst}}{(s - ${a})(s - ${b})}$。求初值 $f(0) = \\lim_{t \\to 0} f(t)$。`,
          );
          const solution = t(
            steps(
              `Decompose into partial fractions: $\\frac{${numS}s - ${numConst}}{(s - ${a})(s - ${b})} = \\frac{A}{s - ${a}} + \\frac{B}{s - ${b}}$.`,
              `Using cover-up: $A = \\frac{${numS}(${a}) - ${numConst}}{${a} - ${b}} = ${A}$ and $B = \\frac{${numS}(${b}) - ${numConst}}{${b} - ${a}} = ${B}$.`,
              `The inverse Laplace transform is $f(t) = ${A} e^{${a}t} + ${B} e^{${b}t}$.`,
              `At $t = 0$, $f(0) = ${A} + ${B} = ${ans}$. (Notice this matches the initial value theorem $\\lim_{s \\to \\infty} s F(s) = ${numS}$).`,
            ),
            steps(
              `将分式化为部分分式：$\\frac{${numS}s - ${numConst}}{(s - ${a})(s - ${b})} = \\frac{A}{s - ${a}} + \\frac{B}{s - ${b}}$。`,
              `代入得：$A = ${A}$，$B = ${B}$。`,
              `对应的拉普拉斯逆变换为 $f(t) = ${A} e^{${a}t} + ${B} e^{${b}t}$。`,
              `在 $t = 0$ 处，$f(0) = ${A} + ${B} = ${ans}$（这亦可由初值定理 $\\lim_{s \\to \\infty} s F(s) = ${numS}$ 直接得出）。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [A, B, numConst, ans + 1, ans - 1],
          });
        },
      },
    ],
  },

  // 5.19.1 Solving First-Order ODEs Using Laplace Transforms
  {
    id: "solving-first-order-odes-using-laplace-transforms",
    title: t("Solving First-Order ODEs Using Laplace Transforms", "用拉普拉斯变换求解一阶常微分方程"),
    summary: t(
      "Transforming y' + ay = b converts the ODE into an algebraic equation (s + a)Y(s) - y(0) = b/s, solving initial value problems directly.",
      "对 y' + ay = b 两边取拉普拉斯变换得到代数方程 (s + a)Y(s) - y(0) = b/s，可直接解出初值问题。",
    ),
    prerequisites: ["inverse-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "first-order-ivp-via-laplace",
        title: t("Steady-state solution of a first-order ODE via Laplace", "由拉普拉斯变换求解一阶方程的稳态解"),
        explanation: t(
          "For $y' + a y = K$ with $y(0) = 0$, $Y(s) = \\frac{K}{s(s + a)} = \\frac{K/a}{s} - \\frac{K/a}{s + a}$. In the time domain, $y(t) = \\frac{K}{a}(1 - e^{-at})$, so the steady-state limit is $\\lim_{t \\to \\infty} y(t) = \\frac{K}{a}$.",
          "对于 $y' + a y = K$（满足 $y(0) = 0$），变换后 $Y(s) = \\frac{K}{s(s + a)}$。求逆变换得 $y(t) = \\frac{K}{a}(1 - e^{-at})$，其稳态极限为 $\\lim_{t \\to \\infty} y(t) = \\frac{K}{a}$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 8);
          const ans = rng.int(2, 35);
          const K = ans * a;

          const prompt = t(
            `Use Laplace transforms to solve the initial value problem $y' + ${a}y = ${K}$ with $y(0) = 0$. Determine the steady-state value $\\lim_{t \\to \\infty} y(t)$.`,
            `利用拉普拉斯变换求解初值问题 $y' + ${a}y = ${K}$（$y(0) = 0$）。求稳态解 $\\lim_{t \\to \\infty} y(t)$ 的值。`,
          );
          const solution = t(
            steps(
              `Taking the Laplace transform gives $s Y(s) - y(0) + ${a} Y(s) = \\frac{${K}}{s}$.`,
              `Since $y(0) = 0$, $(s + ${a}) Y(s) = \\frac{${K}}{s} \\implies Y(s) = \\frac{${K}}{s(s + ${a})}$.`,
              `Using partial fractions: $Y(s) = \\frac{${ans}}{s} - \\frac{${ans}}{s + ${a}}$.`,
              `Inverting yields $y(t) = ${ans}(1 - e^{-${a}t})$. As $t \\to \\infty$, $y(t) \\to ${ans}$.`,
            ),
            steps(
              `两边取拉普拉斯变换：$s Y(s) - y(0) + ${a} Y(s) = \\frac{${K}}{s}$。`,
              `因 $y(0) = 0$，得 $(s + ${a}) Y(s) = \\frac{${K}}{s} \\implies Y(s) = \\frac{${K}}{s(s + ${a})}$。`,
              `拆分为部分分式：$Y(s) = \\frac{${ans}}{s} - \\frac{${ans}}{s + ${a}}$。`,
              `求逆变换得 $y(t) = ${ans}(1 - e^{-${a}t})$。当 $t \\to \\infty$ 时，稳态极限为 $${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [K, a, ans * a, ans + a, ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 5.19.2 Solving First-Order ODEs With Time-Delayed Forcing Using Laplace Transforms
  {
    id: "solving-first-order-odes-with-time-delayed-forcing-using-laplace-transforms",
    title: t("Solving First-Order ODEs With Time-Delayed Forcing Using Laplace Transforms", "用拉普拉斯变换求解含时滞激励的一阶常微分方程"),
    summary: t(
      "Forcing by a delayed step $u(t - c)$ brings in the factor $e^{-cs}$, and the response stays zero until $t = c$.",
      "延迟阶跃 $u(t - c)$ 作为外力引入因子 $e^{-cs}$，系统的响应在 $t = c$ 之前保持为零。",
    ),
    prerequisites: ["solving-first-order-odes-using-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "delayed-step-forcing-first-order",
        title: t("Long-term limit with delayed step forcing", "含延迟阶跃激励的长期极限"),
        explanation: t(
          "For $y' + a y = K u(t - c)$ with $y(0) = 0$, $Y(s) = \\frac{K e^{-cs}}{s(s + a)}$. Inverting gives $y(t) = \\frac{K}{a}(1 - e^{-a(t - c)}) u(t - c)$. As $t \\to \\infty$, $y(t) \\to \\frac{K}{a}$.",
          "对于方程 $y' + a y = K u(t - c)$（$y(0) = 0$），变换得 $Y(s) = \\frac{K e^{-cs}}{s(s + a)}$。其解为 $y(t) = \\frac{K}{a}(1 - e^{-a(t - c)}) u(t - c)$。当 $t \\to \\infty$ 时，$y(t) \\to \\frac{K}{a}$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 6);
          const c = rng.int(1, 5);
          const ans = rng.int(2, 35);
          const K = ans * a;

          const prompt = t(
            `A dynamical system satisfies $y' + ${a}y = ${K} u(t - ${c})$ with $y(0) = 0$. Using Laplace transforms, determine the eventual steady-state value $\\lim_{t \\to \\infty} y(t)$.`,
            `动力系统满足 $y' + ${a}y = ${K} u(t - ${c})$，初始条件 $y(0) = 0$。利用拉普拉斯变换，求当 $t \\to \\infty$ 时的稳态极限值 $\\lim_{t \\to \\infty} y(t)$。`,
          );
          const solution = t(
            steps(
              `Taking Laplace transforms gives $(s + ${a}) Y(s) = \\frac{${K} e^{-${c}s}}{s}$.`,
              `Thus $Y(s) = e^{-${c}s} \\left[ \\frac{${ans}}{s} - \\frac{${ans}}{s + ${a}} \\right]$.`,
              `By the second shifting theorem, $y(t) = ${ans}(1 - e^{-${a}(t - ${c})}) u(t - ${c})$.`,
              `For $t > ${c}$, as $t \\to \\infty$, the exponential dies away and $y(t) \\to ${ans}$.`,
            ),
            steps(
              `两边取拉普拉斯变换：$(s + ${a}) Y(s) = \\frac{${K} e^{-${c}s}}{s}$。`,
              `因此 $Y(s) = e^{-${c}s} \\left[ \\frac{${ans}}{s} - \\frac{${ans}}{s + ${a}} \\right]$。`,
              `由第二位移定理，逆变换为 $y(t) = ${ans}(1 - e^{-${a}(t - ${c})}) u(t - ${c})$。`,
              `当 $t > ${c}$ 且 $t \\to \\infty$ 时，指数衰减项趋于零，故 $y(t) \\to ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [K, a, c, ans + c, ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 5.19.3 Solving Second-Order ODEs Using Laplace Transforms
  {
    id: "solving-second-order-odes-using-laplace-transforms",
    title: t("Solving Second-Order ODEs Using Laplace Transforms", "用拉普拉斯变换求解二阶常微分方程"),
    summary: t(
      "The Laplace transform turns $y'' + \\omega^2 y = 0$ into $(s^2 + \\omega^2)Y(s) - sy(0) - y'(0) = 0$, which solves second-order initial value problems directly.",
      "拉普拉斯变换把 $y'' + \\omega^2 y = 0$ 化为 $(s^2 + \\omega^2)Y(s) - sy(0) - y'(0) = 0$，从而直接解出二阶初值问题。",
    ),
    prerequisites: ["solving-first-order-odes-using-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "harmonic-oscillator-ivp-via-laplace",
        title: t("Oscillation amplitude from Laplace transform of an IVP", "由初值问题的拉普拉斯变换确定振幅"),
        explanation: t(
          "For $y'' + \\omega^2 y = 0$ with $y(0) = 0$ and $y'(0) = v_0$, $Y(s) = \\frac{v_0}{s^2 + \\omega^2} = \\frac{v_0}{\\omega} \\frac{\\omega}{s^2 + \\omega^2}$. The solution is $y(t) = \\frac{v_0}{\\omega} \\sin(\\omega t)$, with amplitude $A = \\frac{v_0}{\\omega}$.",
          "对于 $y'' + \\omega^2 y = 0$（$y(0) = 0$，$y'(0) = v_0$），变换后 $Y(s) = \\frac{v_0}{s^2 + \\omega^2}$，其逆变换为 $y(t) = \\frac{v_0}{\\omega} \\sin(\\omega t)$，振荡振幅为 $A = \\frac{v_0}{\\omega}$。",
        ),
        generate(rng: Rng): Problem {
          const omega = rng.int(2, 10);
          const ans = rng.int(2, 35);
          const v0 = ans * omega;
          const omegaSq = omega * omega;

          const prompt = t(
            `Solve the initial value problem $y'' + ${omegaSq}y = 0$ with $y(0) = 0$ and $y'(0) = ${v0}$ using Laplace transforms. Find the amplitude $A$ of the resulting sinusoidal motion $y(t) = A \\sin(${omega}t)$.`,
            `利用拉普拉斯变换求解初值问题 $y'' + ${omegaSq}y = 0$（$y(0) = 0$，$y'(0) = ${v0}$）。求简谐振动 $y(t) = A \\sin(${omega}t)$ 的振幅 $A$。`,
          );
          const solution = t(
            steps(
              `Transforming both sides: $s^2 Y(s) - s y(0) - y'(0) + ${omegaSq} Y(s) = 0$.`,
              `Substitute initial values: $(s^2 + ${omegaSq}) Y(s) - ${v0} = 0 \\implies Y(s) = \\frac{${v0}}{s^2 + ${omegaSq}}$.`,
              `Rewrite in standard sine form: $Y(s) = \\frac{${v0}}{${omega}} \\frac{${omega}}{s^2 + ${omegaSq}} = ${ans} \\frac{${omega}}{s^2 + ${omegaSq}}$.`,
              `Inverting gives $y(t) = ${ans} \\sin(${omega}t)$, so the amplitude is $A = ${ans}$.`,
            ),
            steps(
              `两端取拉普拉斯变换：$s^2 Y(s) - s y(0) - y'(0) + ${omegaSq} Y(s) = 0$。`,
              `代入初始条件：$(s^2 + ${omegaSq}) Y(s) - ${v0} = 0 \\implies Y(s) = \\frac{${v0}}{s^2 + ${omegaSq}}$。`,
              `整理为标准正弦变换形式：$Y(s) = \\frac{${v0}}{${omega}} \\frac{${omega}}{s^2 + ${omegaSq}} = ${ans} \\frac{${omega}}{s^2 + ${omegaSq}}$。`,
              `求逆变换得 $y(t) = ${ans} \\sin(${omega}t)$，因此振幅为 $A = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [v0, omega, omegaSq, ans * omega, ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 5.19.4 Solving Second-Order ODEs With Time-Delayed Forcing Using Laplace Transforms
  {
    id: "solving-second-order-odes-with-time-delayed-forcing-using-laplace-transforms",
    title: t(
      "Solving Second-Order ODEs With Time-Delayed Forcing Using Laplace Transforms",
      "用拉普拉斯变换求解含时滞激励的二阶常微分方程",
    ),
    summary: t(
      "A delayed step input $y'' + \\omega^2 y = Ku(t - c)$ makes an undamped oscillator oscillate about the new level $\\frac{K}{\\omega^2}$.",
      "对无阻尼谐振子施加延迟阶跃激励 $y'' + \\omega^2 y = Ku(t - c)$，它将围绕新平衡位置 $\\frac{K}{\\omega^2}$ 振荡。",
    ),
    prerequisites: ["solving-second-order-odes-using-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "delayed-step-forcing-second-order",
        title: t("Equilibrium offset under delayed step excitation", "延迟阶跃激励下的平衡位置偏移"),
        explanation: t(
          "For $y'' + \\omega^2 y = K u(t - c)$ with zero initial conditions, $Y(s) = \\frac{K e^{-cs}}{s(s^2 + \\omega^2)} = \\frac{K}{\\omega^2} e^{-cs} \\left[ \\frac{1}{s} - \\frac{s}{s^2 + \\omega^2} \\right]$. For $t \\ge c$, $y(t) = \\frac{K}{\\omega^2}[1 - \\cos(\\omega(t - c))]$, oscillating about the equilibrium level $\\frac{K}{\\omega^2}$.",
          "对于 $y'' + \\omega^2 y = K u(t - c)$（零初始条件），变换后 $Y(s) = \\frac{K e^{-cs}}{s(s^2 + \\omega^2)}$。当 $t \\ge c$ 时，$y(t) = \\frac{K}{\\omega^2}[1 - \\cos(\\omega(t - c))]$，围绕平衡中心 $\\frac{K}{\\omega^2}$ 振荡。",
        ),
        generate(rng: Rng): Problem {
          const omega = rng.int(2, 6);
          const c = rng.int(1, 4);
          const ans = rng.int(2, 35);
          const omegaSq = omega * omega;
          const K = ans * omegaSq;

          const prompt = t(
            `An oscillator satisfies $y'' + ${omegaSq}y = ${K} u(t - ${c})$ with $y(0) = 0$ and $y'(0) = 0$. Determine the center of oscillation (the new equilibrium position) for $t > ${c}$.`,
            `谐振子满足方程 $y'' + ${omegaSq}y = ${K} u(t - ${c})$，初始条件为零。求在 $t > ${c}$ 时系统振荡的中心位置（即新的平衡位置）。`,
          );
          const solution = t(
            steps(
              `Transforming the ODE: $(s^2 + ${omegaSq}) Y(s) = \\frac{${K} e^{-${c}s}}{s}$.`,
              `Thus $Y(s) = \\frac{${K}}{\\omega^2} e^{-${c}s} \\left[ \\frac{1}{s} - \\frac{s}{s^2 + ${omegaSq}} \\right] = ${ans} e^{-${c}s} \\left[ \\frac{1}{s} - \\frac{s}{s^2 + ${omegaSq}} \\right]$.`,
              `Inverting with the second shifting theorem gives $y(t) = ${ans}[1 - \\cos(${omega}(t - ${c}))] u(t - ${c})$.`,
              `The cosine term oscillates between $-1$ and $+1$, so $y(t)$ oscillates between $0$ and ${2 * ans}$ around the center level ${ans}$.`,
            ),
            steps(
              `对微分方程取变换：$(s^2 + ${omegaSq}) Y(s) = \\frac{${K} e^{-${c}s}}{s}$。`,
              `分解分式：$Y(s) = ${ans} e^{-${c}s} \\left[ \\frac{1}{s} - \\frac{s}{s^2 + ${omegaSq}} \\right]$。`,
              `利用第二位移定理求逆变换得 $y(t) = ${ans}[1 - \\cos(${omega}(t - ${c}))] u(t - ${c})$。`,
              `余弦项在 $-1$ 到 $+1$ 之间振动，因此 $y(t)$ 在 $0$ 到 ${2 * ans}$ 之间波动，中心平衡位置为 ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [2 * ans, K, omegaSq, ans + c, ans - 1, ans + 1],
          });
        },
      },
    ],
  },

  // 5.19.5 Solving Homogeneous Systems of ODEs Using Laplace Transforms
  {
    id: "solving-homogeneous-systems-of-odes-using-laplace-transforms",
    title: t("Solving Homogeneous Systems of ODEs Using Laplace Transforms", "用拉普拉斯变换求解齐次常微分方程组"),
    summary: t(
      "The linear system x' = A x transforms to (sI - A)X(s) = x(0), converting coupled differential equations into a matrix linear algebra problem.",
      "线性微分系统 x' = A x 变换为 (sI - A)X(s) = x(0)，将耦合微分方程组转化为矩阵代数问题求解。",
    ),
    prerequisites: ["solving-second-order-odes-using-laplace-transforms", "introduction-to-systems-of-linear-odes"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "resolvent-matrix-system-laplace",
        title: t("Evaluating the determinant of the characteristic matrix sI - A", "计算特征矩阵 sI - A 的行列式"),
        explanation: t(
          "For $\\mathbf{x}' = A \\mathbf{x}$, taking Laplace transforms yields $(sI - A)\\mathbf{X}(s) = \\mathbf{x}(0)$. The determinant $\\det(sI - A)$ is the characteristic polynomial of $A$. At $s = 0$, $\\det(0I - A) = \\det(-A) = (-1)^n \\det(A)$.",
          "对系统 $\\mathbf{x}' = A \\mathbf{x}$ 取拉普拉斯变换得到 $(sI - A)\\mathbf{X}(s) = \\mathbf{x}(0)$。行列式 $\\det(sI - A)$ 即为 $A$ 的特征多项式。在 $s = 0$ 处，$\\det(0I - A) = \\det(-A) = (-1)^n \\det(A)$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 6);
          const d = rng.int(2, 6);
          const b = rng.int(1, 3);
          const c = rng.int(1, 3);
          const detA = a * d - b * c;
          const ans = detA;

          const prompt = t(
            `Consider the system $\\mathbf{x}' = A \\mathbf{x}$ with $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$. When taking the Laplace transform $(sI - A)\\mathbf{X}(s) = \\mathbf{x}(0)$, evaluate the determinant $\\det(sI - A)$ at $s = 0$.`,
            `考虑微分系统 $\\mathbf{x}' = A \\mathbf{x}$，其中 $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$。两边取拉普拉斯变换得 $(sI - A)\\mathbf{X}(s) = \\mathbf{x}(0)$。计算特征矩阵行列式 $\\det(sI - A)$ 在 $s = 0$ 处的值。`,
          );
          const solution = t(
            steps(
              `The matrix $sI - A = \\begin{pmatrix} s - ${a} & -${b} \\\\ -${c} & s - ${d} \\end{pmatrix}$.`,
              `Its determinant is $\\det(sI - A) = (s - ${a})(s - ${d}) - (-${b})(-${c}) = s^2 - (${a + d})s + (${a * d} - ${b * c})$.`,
              `Evaluating at $s = 0$ gives $${a * d} - ${b * c} = ${ans}$.`,
            ),
            steps(
              `写出特征矩阵 $sI - A = \\begin{pmatrix} s - ${a} & -${b} \\\\ -${c} & s - ${d} \\end{pmatrix}$。`,
              `计算行列式：$\\det(sI - A) = (s - ${a})(s - ${d}) - (-${b})(-${c}) = s^2 - (${a + d})s + (${a * d} - ${b * c})$。`,
              `在 $s = 0$ 处代入得 $${a * d} - ${b * c} = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [a + d, a * d, b * c, ans + 1, ans - 1],
          });
        },
      },
    ],
  },

  // 5.19.6 Solving Inhomogeneous Systems of ODEs Using Laplace Transforms
  {
    id: "solving-inhomogeneous-systems-of-odes-using-laplace-transforms",
    title: t("Solving Inhomogeneous Systems of ODEs Using Laplace Transforms", "用拉普拉斯变换求解非齐次常微分方程组"),
    summary: t(
      "Inhomogeneous linear systems x' = A x + f(t) transform algebraically to (sI - A)X(s) = x(0) + F(s), resolved by matrix inversion.",
      "非齐次线性系统 x' = A x + f(t) 经拉普拉斯变换转化为代数方程 (sI - A)X(s) = x(0) + F(s)，通过矩阵求逆直接求解。",
    ),
    prerequisites: ["solving-homogeneous-systems-of-odes-using-laplace-transforms"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "inhomogeneous-system-transfer-function",
        title: t("Steady-state component in an uncoupled inhomogeneous system", "非齐次解耦系统中的稳态分量"),
        explanation: t(
          "For $x_1' = -a x_1 + c_1$ with $x_1(0) = 0$, transforming gives $(s + a)X_1(s) = \\frac{c_1}{s}$, so $x_1(t) = \\frac{c_1}{a}(1 - e^{-at})$. The steady-state component is $\\lim_{t \\to \\infty} x_1(t) = \\frac{c_1}{a}$.",
          "对于 $x_1' = -a x_1 + c_1$（$x_1(0) = 0$），取变换得 $(s + a)X_1(s) = \\frac{c_1}{s}$，解得 $x_1(t) = \\frac{c_1}{a}(1 - e^{-at})$。其稳态极限为 $\\lim_{t \\to \\infty} x_1(t) = \\frac{c_1}{a}$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 6);
          const ans = rng.int(2, 35);
          const c1 = ans * a;

          const prompt = t(
            `A first-order inhomogeneous system includes the component equation $x_1' = -${a}x_1 + ${c1}$ with $x_1(0) = 0$. Using the Laplace transform, determine the long-term equilibrium value $\\lim_{t \\to \\infty} x_1(t)$.`,
            `一阶非齐次系统包含分量方程 $x_1' = -${a}x_1 + ${c1}$，初值 $x_1(0) = 0$。利用拉普拉斯变换，求该分量的长期平衡值 $\\lim_{t \\to \\infty} x_1(t)$。`,
          );
          const solution = t(
            steps(
              `Taking the Laplace transform gives $s X_1(s) - x_1(0) = -${a} X_1(s) + \\frac{${c1}}{s}$.`,
              `Since $x_1(0) = 0$, $(s + ${a}) X_1(s) = \\frac{${c1}}{s} \\implies X_1(s) = \\frac{${c1}}{s(s + ${a})}$.`,
              `Decomposing: $X_1(s) = \\frac{${ans}}{s} - \\frac{${ans}}{s + ${a}}$.`,
              `Inverting yields $x_1(t) = ${ans}(1 - e^{-${a}t})$, so $\\lim_{t \\to \\infty} x_1(t) = ${ans}$.`,
            ),
            steps(
              `两边取拉普拉斯变换：$s X_1(s) - x_1(0) = -${a} X_1(s) + \\frac{${c1}}{s}$。`,
              `代入 $x_1(0) = 0$ 得 $(s + ${a}) X_1(s) = \\frac{${c1}}{s} \\implies X_1(s) = \\frac{${c1}}{s(s + ${a})}$。`,
              `部分分式分解：$X_1(s) = \\frac{${ans}}{s} - \\frac{${ans}}{s + ${a}}$。`,
              `求逆变换得 $x_1(t) = ${ans}(1 - e^{-${a}t})$，因此 $\\lim_{t \\to \\infty} x_1(t) = ${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [c1, a, ans * a, ans + a, ans - 1, ans + 1],
          });
        },
      },
    ],
  },
];
