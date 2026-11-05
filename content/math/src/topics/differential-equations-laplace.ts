import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem, steps, yesNo } from "../problems.ts";

/** signed writes a number as a signed term: "+ 3" or "- 3". */
const signed = (n: number): string => (n < 0 ? `- ${-n}` : `+ ${n}`);

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
      {
        id: "writing-a-piecewise-function-with-unit-steps",
        title: t("Writing a piecewise function with unit steps", "用单位阶跃函数表示分段函数"),
        explanation: t(
          "A unit step $u(t - c)$ switches a term on at $t = c$. To build a function that takes the value $a$, then $b$ from $t = c_1$, then $d$ from $t = c_2$, start with $a$ and add each change at the moment it happens:\n\n$$f(t) = a + (b - a)u(t - c_1) + (d - b)u(t - c_2).$$\n\nEach coefficient is the size of the jump, new value minus old value, not the new value itself.",
          "单位阶跃 $u(t - c)$ 在 $t = c$ 时接通一项。要构造一个先取值 $a$、从 $t = c_1$ 起取 $b$、从 $t = c_2$ 起取 $d$ 的函数，从 $a$ 开始，在每次变化发生时加上变化量：\n\n$$f(t) = a + (b - a)u(t - c_1) + (d - b)u(t - c_2).$$\n\n每个系数是跳跃的大小，即新值减旧值，而不是新值本身。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(-5, 9);
          let b = rng.int(-5, 9);
          if (b === a) b = a + 4;
          let d = rng.int(-5, 9);
          if (d === b) d = b - 3;
          const c1 = rng.int(1, 4);
          const c2 = c1 + rng.int(1, 5);
          const ans = d - b;
          return numberProblem({
            prompt: t(
              `$f(t) = ${a}$ for $0 \\le t < ${c1}$, $f(t) = ${b}$ for $${c1} \\le t < ${c2}$ and $f(t) = ${d}$ for $t \\ge ${c2}$. Writing $f(t) = A + Bu(t - ${c1}) + Cu(t - ${c2})$, find $C$.`,
              `$0 \\le t < ${c1}$ 时 $f(t) = ${a}$，$${c1} \\le t < ${c2}$ 时 $f(t) = ${b}$，$t \\ge ${c2}$ 时 $f(t) = ${d}$。写成 $f(t) = A + Bu(t - ${c1}) + Cu(t - ${c2})$，求 $C$。`,
            ),
            answer: ans,
            wrong: [d, d - a, b - a].filter((w) => w !== ans),
            solution: t(
              `At $t = ${c2}$ the value jumps from $${b}$ to $${d}$, so $C = ${d} - ${b < 0 ? `(${b})` : b} = ${ans}$.`,
              `在 $t = ${c2}$ 处函数值从 $${b}$ 跳到 $${d}$，所以 $C = ${d} - ${b < 0 ? `(${b})` : b} = ${ans}$。`,
            ),
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
          "The size of a jump is the difference between the limit from the right and the limit from the left at the point where the function breaks. At a jump discontinuity $t = c$, the jump magnitude is $\\Delta f(c) = f(c^+) - f(c^-) = \\lim_{t \\to c^+} f(t) - \\lim_{t \\to c^-} f(t)$.",
          "跳跃的大小是函数断开处右极限与左极限之差。在跳跃间断点 $t = c$ 处，跳跃幅度定义为右极限减去左极限：$\\Delta f(c) = f(c^+) - f(c^-) = \\lim_{t \\to c^+} f(t) - \\lim_{t \\to c^-} f(t)$。",
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
      {
        id: "recognizing-piecewise-continuous-functions",
        title: t("Recognizing piecewise continuous functions", "识别分段连续函数"),
        explanation: t(
          "A function is piecewise continuous on $[0, T]$ when it has only finitely many discontinuities there and each one is a finite jump: both one-sided limits exist and are finite. Steps, floor functions and continuous functions qualify. A vertical asymptote such as $\\frac{1}{t - 2}$ does not, because the one-sided limits are infinite; neither does $\\sin\\frac{1}{t}$ near $0$, whose limit does not exist.",
          "若函数在 $[0, T]$ 上只有有限个间断点，且每个都是有限跳跃（两侧单侧极限都存在且有限），则它在该区间上分段连续。阶跃函数、取整函数和连续函数都满足。像 $\\frac{1}{t - 2}$ 这样有铅直渐近线的函数不满足，因为单侧极限是无穷；$\\sin\\frac{1}{t}$ 在 $0$ 附近也不满足，因为其极限不存在。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.int(1, 6);
          const T = c + rng.int(2, 6);
          const k = rng.int(2, 9);
          const cases: [string, boolean, Text][] = [
            [`${k}\\lfloor t \\rfloor`, true, t("it jumps by a finite amount at each integer", "它在每个整数处有有限跳跃")],
            [
              `t^{2} + ${k}u(t - ${c})`,
              true,
              t(`its only discontinuity is a jump of $${k}$ at $t = ${c}$`, `它唯一的间断点是 $t = ${c}$ 处大小为 $${k}$ 的跳跃`),
            ],
            [
              `|t - ${c}|`,
              true,
              t("it is continuous on the whole interval, so it has no discontinuities at all", "它在整个区间上连续，根本没有间断点"),
            ],
            [`\\frac{${k}}{t - ${c}}`, false, t(`it tends to infinity at $t = ${c}$`, `它在 $t = ${c}$ 处趋于无穷`)],
            [`\\tan\\frac{\\pi t}{${2 * c}}`, false, t(`it tends to infinity at $t = ${c}$`, `它在 $t = ${c}$ 处趋于无穷`)],
            [`\\sin\\frac{${k}}{t - ${c}}`, false, t(`it has no one-sided limits at $t = ${c}$`, `它在 $t = ${c}$ 处没有单侧极限`)],
          ];
          const [f, ok, why] = rng.pick(cases);
          return choiceProblem({
            prompt: t(`Is $f(t) = ${f}$ piecewise continuous on $[0, ${T}]$?`, `$f(t) = ${f}$ 在 $[0, ${T}]$ 上分段连续吗？`),
            options: yesNo,
            correct: ok ? 0 : 1,
            solution: t(`${ok ? "Yes" : "No"}: ${why.en}.`, `${ok ? "是" : "不是"}：${why["zh-CN"]}。`),
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
          "The Laplace transform multiplies the function by a decaying exponential and integrates over all positive times, turning functions of time into functions of a new variable. By definition, $\\mathcal{L}\\{C\\}(s) = \\int_0^\\infty C e^{-st}\\,dt = \\left[ -\\frac{C}{s} e^{-st} \\right]_0^\\infty = \\frac{C}{s}$ for $s > 0$.",
          "拉普拉斯变换把函数乘以一个衰减的指数函数，再在所有正时间上积分，把时间的函数变成一个新变量的函数。根据定义，$\\mathcal{L}\\{C\\}(s) = \\int_0^\\infty C e^{-st}\\,dt = \\left[ -\\frac{C}{s} e^{-st} \\right]_0^\\infty = \\frac{C}{s}$（当 $s > 0$ 时）。",
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
      {
        id: "the-transform-of-an-exponential-from-the-definition",
        title: t("The transform of an exponential from the definition", "由定义求指数函数的变换"),
        explanation: t(
          "For $f(t) = ce^{at}$,\n\n$$\\mathcal{L}\\{ce^{at}\\}(s) = \\int_0^\\infty ce^{(a - s)t}\\,dt = \\left[\\frac{ce^{(a - s)t}}{a - s}\\right]_0^\\infty = \\frac{c}{s - a},$$\n\nprovided $s > a$, so that $e^{(a - s)t} \\to 0$. For $s \\le a$ the integral diverges and the transform does not exist at that $s$.",
          "对 $f(t) = ce^{at}$，\n\n$$\\mathcal{L}\\{ce^{at}\\}(s) = \\int_0^\\infty ce^{(a - s)t}\\,dt = \\left[\\frac{ce^{(a - s)t}}{a - s}\\right]_0^\\infty = \\frac{c}{s - a},$$\n\n前提是 $s > a$，使 $e^{(a - s)t} \\to 0$。当 $s \\le a$ 时积分发散，变换在该 $s$ 处不存在。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(-6, 6) || 2;
          const s0 = Math.max(a, 0) + rng.int(1, 6);
          const c = rng.int(2, 15);
          const ans = Q.of(c, s0 - a);
          return numberProblem({
            prompt: t(
              `Evaluate $\\int_0^\\infty ${c}e^{${a === 1 ? "" : a === -1 ? "-" : a}t}e^{-st}\\,dt$ at $s = ${s0}$.`,
              `求 $\\int_0^\\infty ${c}e^{${a === 1 ? "" : a === -1 ? "-" : a}t}e^{-st}\\,dt$ 在 $s = ${s0}$ 处的值。`,
            ),
            answer: ans,
            wrong: [Q.of(c, s0 + a || 2 * s0), Q.of(c, s0), Q.of(-c, s0 - a)].filter((v) => !v.eq(ans)),
            solution: t(
              `The integrand is $${c}e^{(${a} - s)t}$; since $s = ${s0} > ${a}$ it decays, and the integral is $\\frac{${c}}{s ${signed(-a)}} = \\frac{${c}}{${s0 - a}}${lowestTerms(c, s0 - a)}$.`,
              `被积函数为 $${c}e^{(${a} - s)t}$；由于 $s = ${s0} > ${a}$，它衰减，积分为 $\\frac{${c}}{s ${signed(-a)}} = \\frac{${c}}{${s0 - a}}${lowestTerms(c, s0 - a)}$。`,
            ),
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
          "The transform is linear, so a combination of powers of time transforms into the same combination of their known transforms. Recall $\\mathcal{L}\\{1\\} = \\frac{1}{s}$, $\\mathcal{L}\\{t\\} = \\frac{1}{s^2}$, and $\\mathcal{L}\\{t^2\\} = \\frac{2}{s^3}$. The coefficient of $1/s^3$ in $\\mathcal{L}\\{a t^2 + b t + c\\}$ is $2a$.",
          "这个变换是线性的，所以时间的幂的组合变换为它们已知变换的同样组合。已知 $\\mathcal{L}\\{1\\} = \\frac{1}{s}$，$\\mathcal{L}\\{t\\} = \\frac{1}{s^2}$，$\\mathcal{L}\\{t^2\\} = \\frac{2}{s^3}$。$\\mathcal{L}\\{a t^2 + b t + c\\}$ 中 $1/s^3$ 项的系数为 $2a$。",
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
      {
        id: "evaluating-the-transform-of-a-sinusoidal-combination",
        title: t("Evaluating the transform of a sinusoidal combination", "求正弦型组合的变换值"),
        explanation: t(
          "Linearity lets you transform term by term, using $\\mathcal{L}\\{\\sin bt\\} = \\frac{b}{s^{2} + b^{2}}$ and $\\mathcal{L}\\{\\cos bt\\} = \\frac{s}{s^{2} + b^{2}}$:\n\n$$\\mathcal{L}\\{p\\sin bt + q\\cos bt\\} = \\frac{pb + qs}{s^{2} + b^{2}}.$$\n\nNote the sine contributes $b$ in the numerator, and the cosine contributes $s$; swapping them is a common error.",
          "线性性允许逐项变换，利用 $\\mathcal{L}\\{\\sin bt\\} = \\frac{b}{s^{2} + b^{2}}$ 与 $\\mathcal{L}\\{\\cos bt\\} = \\frac{s}{s^{2} + b^{2}}$：\n\n$$\\mathcal{L}\\{p\\sin bt + q\\cos bt\\} = \\frac{pb + qs}{s^{2} + b^{2}}.$$\n\n注意正弦在分子中贡献 $b$，余弦贡献 $s$；把两者弄反是常见错误。",
        ),
        generate(rng: Rng): Problem {
          const p = rng.int(-6, 9) || 3;
          const q = rng.int(-6, 9) || -2;
          const b = rng.int(1, 5);
          const s0 = rng.int(1, 6);
          const den = s0 * s0 + b * b;
          const ans = Q.of(p * b + q * s0, den);
          const bt = b === 1 ? "t" : `${b}t`;
          return numberProblem({
            prompt: t(
              `Let $F(s) = \\mathcal{L}\\{${p}\\sin ${bt} ${signed(q)}\\cos ${bt}\\}$. Find $F(${s0})$.`,
              `设 $F(s) = \\mathcal{L}\\{${p}\\sin ${bt} ${signed(q)}\\cos ${bt}\\}$。求 $F(${s0})$。`,
            ),
            answer: ans,
            wrong: [Q.of(p * s0 + q * b, den), Q.of(p + q, den), Q.of(p * b + q * s0, s0 * s0 - b * b || 1)].filter((v) => !v.eq(ans)),
            solution: t(
              `$F(s) = \\frac{${p} \\cdot ${b} ${signed(q)}s}{s^{2} + ${b * b}}$, so $F(${s0}) = \\frac{${p * b} ${signed(q * s0)}}{${den}} = ${ans.toLatex()}$.`,
              `$F(s) = \\frac{${p} \\cdot ${b} ${signed(q)}s}{s^{2} + ${b * b}}$，所以 $F(${s0}) = \\frac{${p * b} ${signed(q * s0)}}{${den}} = ${ans.toLatex()}$。`,
            ),
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
          "As the variable approaches zero the exponential factor approaches one, so the transform approaches the total area under the pulse. For a finite pulse $f(t) = h$ on $[0, c)$ and $0$ for $t \\ge c$, $\\lim_{s \\to 0^+} F(s) = \\int_0^c h\\,dt = hc$, representing the total area under the signal.",
          "当变量趋于零时，指数因子趋于 1，所以变换趋于脉冲下方的总面积。对于在 $[0, c)$ 上取值 $h$、在 $t \\ge c$ 上取值 $0$ 的脉冲信号，其变换在 $s \\to 0^+$ 时的极限为 $\\lim_{s \\to 0^+} F(s) = \\int_0^c h\\,dt = hc$，代表信号下方的总面积。",
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
      {
        id: "the-transform-of-a-truncated-ramp",
        title: t("The transform of a truncated ramp", "截断斜坡的变换"),
        explanation: t(
          "The ramp $kt$ switched off at $t = c$ is $kt - kt\\,u(t - c)$. To use the shift rule, rewrite $t = (t - c) + c$:\n\n$$kt\\,u(t - c) = k(t - c)u(t - c) + kc\\,u(t - c),$$\n\nso $\\mathcal{L}\\{f\\} = \\frac{k}{s^{2}} - e^{-cs}\\left(\\frac{k}{s^{2}} + \\frac{kc}{s}\\right)$. The second term inside the bracket comes from the height $kc$ of the drop at $t = c$.",
          "在 $t = c$ 处关断的斜坡 $kt$ 可写为 $kt - kt\\,u(t - c)$。为使用平移法则，把 $t$ 写成 $(t - c) + c$：\n\n$$kt\\,u(t - c) = k(t - c)u(t - c) + kc\\,u(t - c),$$\n\n所以 $\\mathcal{L}\\{f\\} = \\frac{k}{s^{2}} - e^{-cs}\\left(\\frac{k}{s^{2}} + \\frac{kc}{s}\\right)$。括号中第二项来自 $t = c$ 处下降的高度 $kc$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(1, 9);
          const c = rng.int(1, 7);
          const ans = k * c;
          return numberProblem({
            prompt: t(
              `$f(t) = ${k === 1 ? "" : k}t$ for $0 \\le t < ${c}$ and $f(t) = 0$ for $t \\ge ${c}$. Its transform is $\\frac{${k}}{s^{2}} - e^{-${c === 1 ? "" : c}s}\\left(\\frac{A}{s^{2}} + \\frac{B}{s}\\right)$. Find $B$.`,
              `$0 \\le t < ${c}$ 时 $f(t) = ${k === 1 ? "" : k}t$，$t \\ge ${c}$ 时 $f(t) = 0$。它的变换为 $\\frac{${k}}{s^{2}} - e^{-${c === 1 ? "" : c}s}\\left(\\frac{A}{s^{2}} + \\frac{B}{s}\\right)$。求 $B$。`,
            ),
            answer: ans,
            wrong: [k, c, 0].filter((w) => w !== ans),
            solution: t(
              `$f = ${k}t - ${k}t\\,u(t - ${c})$ and $${k}t\\,u(t - ${c}) = ${k}(t - ${c})u(t - ${c}) + ${ans}u(t - ${c})$, so $A = ${k}$ and $B = ${ans}$.`,
              `$f = ${k}t - ${k}t\\,u(t - ${c})$，且 $${k}t\\,u(t - ${c}) = ${k}(t - ${c})u(t - ${c}) + ${ans}u(t - ${c})$，所以 $A = ${k}$，$B = ${ans}$。`,
            ),
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
          "Multiplying a function by time corresponds to differentiating its transform and changing the sign, which gives the transforms of such products quickly. Since $\\mathcal{L}\\{e^{at}\\} = \\frac{1}{s - a}$, differentiation gives $\\mathcal{L}\\{t e^{at}\\} = -\\frac{d}{ds}\\left(\\frac{1}{s - a}\\right) = \\frac{1}{(s - a)^2}$. For $f(t) = c t e^{at}$, $(s - a)^2 \\mathcal{L}\\{f(t)\\} = c$.",
          "把函数乘以时间对应于对它的变换求导并改变符号，这样可以很快得到这类乘积的变换。因为 $\\mathcal{L}\\{e^{at}\\} = \\frac{1}{s - a}$，求导可得 $\\mathcal{L}\\{t e^{at}\\} = -\\frac{d}{ds}\\left(\\frac{1}{s - a}\\right) = \\frac{1}{(s - a)^2}$。对于 $f(t) = c t e^{at}$，有 $(s - a)^2 \\mathcal{L}\\{f(t)\\} = c$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 10);
          const c = rng.int(2, 35);
          const k = rng.int(2, 6);
          const s0 = a + k;
          const ans = Q.of(c, k * k);

          const prompt = t(
            `Let $f(t) = ${c} t e^{${a}t}$ and let $F(s) = \\mathcal{L}\\{f(t)\\}$. Find $F(${s0})$.`,
            `设 $f(t) = ${c} t e^{${a}t}$，$F(s) = \\mathcal{L}\\{f(t)\\}$。求 $F(${s0})$。`,
          );
          const solution = t(
            steps(
              `The differentiation rule gives $\\mathcal{L}\\{t g(t)\\} = -G'(s)$.`,
              `For $g(t) = e^{${a}t}$, $G(s) = \\frac{1}{s - ${a}}$, so $-G'(s) = \\frac{1}{(s - ${a})^2}$.`,
              `Multiplying by the coefficient $${c}$, $F(s) = \\frac{${c}}{(s - ${a})^2}$.`,
              `Therefore, $F(${s0}) = \\frac{${c}}{${k}^2}${lowestTerms(c, k * k)}$.`,
            ),
            steps(
              `频域求导法则为 $\\mathcal{L}\\{t g(t)\\} = -G'(s)$。`,
              `当 $g(t) = e^{${a}t}$ 时，$G(s) = \\frac{1}{s - ${a}}$，故 $-G'(s) = \\frac{1}{(s - ${a})^2}$。`,
              `乘以系数 $${c}$，得 $F(s) = \\frac{${c}}{(s - ${a})^2}$。`,
              `因此，$F(${s0}) = \\frac{${c}}{${k}^2}${lowestTerms(c, k * k)}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [Q.of(c, k), Q.of(-c, k * k), Q.of(c, s0 * s0), Q.of(c)],
          });
        },
      },
      {
        id: "transforms-of-t-times-a-sinusoid",
        title: t("Transforms of $t$ times a sinusoid", "$t$ 乘正弦型函数的变换"),
        explanation: t(
          "Multiplying by $t$ corresponds to $-\\frac{d}{ds}$ of the transform. Differentiating the sine and cosine transforms gives\n\n$$\\mathcal{L}\\{t\\sin bt\\} = \\frac{2bs}{(s^{2} + b^{2})^{2}}, \\qquad \\mathcal{L}\\{t\\cos bt\\} = \\frac{s^{2} - b^{2}}{(s^{2} + b^{2})^{2}}.$$\n\nThe denominator is squared; keeping it unsquared is the usual slip.",
          "乘以 $t$ 对应于对变换取 $-\\frac{d}{ds}$。对正弦与余弦的变换求导得\n\n$$\\mathcal{L}\\{t\\sin bt\\} = \\frac{2bs}{(s^{2} + b^{2})^{2}}, \\qquad \\mathcal{L}\\{t\\cos bt\\} = \\frac{s^{2} - b^{2}}{(s^{2} + b^{2})^{2}}.$$\n\n分母是平方；忘记平方是常见错误。",
        ),
        generate(rng: Rng): Problem {
          const b = rng.int(1, 4);
          const s0 = rng.int(1, 5);
          const isSin = rng.bool(0.5);
          const den = (s0 * s0 + b * b) ** 2;
          const num = isSin ? 2 * b * s0 : s0 * s0 - b * b;
          const ans = Q.of(num, den);
          const bt = b === 1 ? "t" : `${b}t`;
          const fn = isSin ? "\\sin" : "\\cos";
          return numberProblem({
            prompt: t(
              `Find $\\mathcal{L}\\{t${fn} ${bt}\\}$ at $s = ${s0}$.`,
              `求 $\\mathcal{L}\\{t${fn} ${bt}\\}$ 在 $s = ${s0}$ 处的值。`,
            ),
            answer: ans,
            wrong: [Q.of(num, s0 * s0 + b * b), Q.of(isSin ? s0 * s0 - b * b : 2 * b * s0, den), Q.of(-num, den)].filter((v) => !v.eq(ans)),
            solution: t(
              `$\\mathcal{L}\\{t${fn} ${bt}\\} = ${isSin ? `\\frac{${2 * b}s}{(s^{2} + ${b * b})^{2}}` : `\\frac{s^{2} - ${b * b}}{(s^{2} + ${b * b})^{2}}`}$; at $s = ${s0}$ it is $\\frac{${num}}{${den}}${lowestTerms(num, den)}$.`,
              `$\\mathcal{L}\\{t${fn} ${bt}\\} = ${isSin ? `\\frac{${2 * b}s}{(s^{2} + ${b * b})^{2}}` : `\\frac{s^{2} - ${b * b}}{(s^{2} + ${b * b})^{2}}`}$；在 $s = ${s0}$ 处为 $\\frac{${num}}{${den}}${lowestTerms(num, den)}$。`,
            ),
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
          "Transforming a derivative brings in the initial values, so the initial conditions appear as a polynomial in the transformed equation. For an IVP with $y(0) = y_0$ and $y'(0) = y_1$, the Laplace transform satisfies $s^2 Y(s) - \\mathcal{L}\\{y''\\} = y_0 s + y_1$. At $s = 1$, this polynomial equals $y_0 + y_1$.",
          "对导数做变换会引入初始值，所以初始条件在变换后的方程中以多项式的形式出现。在初值问题 $y(0) = y_0$ 和 $y'(0) = y_1$ 中，导数变换公式为 $\\mathcal{L}\\{y''\\} = s^2 Y(s) - y_0 s - y_1$。因此 $s^2 Y(s) - \\mathcal{L}\\{y''\\} = y_0 s + y_1$，在 $s = 1$ 处该值等于 $y_0 + y_1$。",
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
      {
        id: "the-transform-of-a-second-derivative-at-a-point",
        title: t("The transform of a second derivative at a point", "二阶导数的变换在某点的值"),
        explanation: t(
          "Applying the derivative rule twice gives\n\n$$\\mathcal{L}\\{y''\\}(s) = s^{2}Y(s) - sy(0) - y'(0).$$\n\nThe initial position is multiplied by $s$, the initial velocity is not. For example, if $Y(2) = 3$, $y(0) = 1$ and $y'(0) = 4$, then $\\mathcal{L}\\{y''\\}(2) = 12 - 2 - 4 = 6$.",
          "两次应用导数法则得\n\n$$\\mathcal{L}\\{y''\\}(s) = s^{2}Y(s) - sy(0) - y'(0).$$\n\n初始位置乘以 $s$，初始速度不乘。例如，若 $Y(2) = 3$，$y(0) = 1$，$y'(0) = 4$，则 $\\mathcal{L}\\{y''\\}(2) = 12 - 2 - 4 = 6$。",
        ),
        generate(rng: Rng): Problem {
          const s0 = rng.int(1, 6);
          const Y = Q.of(rng.int(1, 12), rng.pick([1, 2, 4]));
          const y0 = rng.int(-5, 8);
          const v0 = rng.int(-5, 8);
          const ans = Y.mul(Q.of(s0 * s0)).sub(Q.of(s0 * y0 + v0));
          return numberProblem({
            prompt: t(
              `$Y(s) = \\mathcal{L}\\{y\\}$ satisfies $Y(${s0}) = ${Y.toLatex()}$, and $y(0) = ${y0}$, $y'(0) = ${v0}$. Find $\\mathcal{L}\\{y''\\}(${s0})$.`,
              `$Y(s) = \\mathcal{L}\\{y\\}$ 满足 $Y(${s0}) = ${Y.toLatex()}$，且 $y(0) = ${y0}$，$y'(0) = ${v0}$。求 $\\mathcal{L}\\{y''\\}(${s0})$。`,
            ),
            answer: ans,
            wrong: [
              Y.mul(Q.of(s0 * s0)).sub(Q.of(y0 + s0 * v0)),
              Y.mul(Q.of(s0 * s0)).sub(Q.of(y0 + v0)),
              Y.mul(Q.of(s0)).sub(Q.of(y0)),
            ].filter((v) => !v.eq(ans)),
            solution: t(
              `$\\mathcal{L}\\{y''\\}(${s0}) = ${s0}^{2} \\cdot ${Y.toLatex()} - ${s0} \\cdot ${y0 < 0 ? `(${y0})` : y0} - ${v0 < 0 ? `(${v0})` : v0} = ${ans.toLatex()}$.`,
              `$\\mathcal{L}\\{y''\\}(${s0}) = ${s0}^{2} \\cdot ${Y.toLatex()} - ${s0} \\cdot ${y0 < 0 ? `(${y0})` : y0} - ${v0 < 0 ? `(${v0})` : v0} = ${ans.toLatex()}$。`,
            ),
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
          "Integrating a function from zero corresponds to dividing its transform by the variable, the reverse of what differentiating does. For $g(t) = \\int_0^t c e^{a\\tau}\\,d\\tau$, the integral theorem states $\\mathcal{L}\\{g(t)\\} = \\frac{1}{s} \\mathcal{L}\\{c e^{at}\\} = \\frac{c}{s(s - a)}$. Thus $s(s - a) \\mathcal{L}\\{g(t)\\} = c$.",
          "从零开始对函数积分对应于把它的变换除以变量，这与求导的作用正好相反。对于 $g(t) = \\int_0^t c e^{a\\tau}\\,d\\tau$，由积分定理可知 $\\mathcal{L}\\{g(t)\\} = \\frac{1}{s} \\mathcal{L}\\{c e^{at}\\} = \\frac{c}{s(s - a)}$。因此 $s(s - a) \\mathcal{L}\\{g(t)\\} = c$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(2, 10);
          const c = rng.int(2, 35);
          const k = rng.int(1, 5);
          const s0 = a + k;
          const den = s0 * k;
          const ans = Q.of(c, den);

          const prompt = t(
            `Let $g(t) = \\int_0^t ${c} e^{${a}\\tau}\\,d\\tau$ and let $G(s) = \\mathcal{L}\\{g(t)\\}$. Find $G(${s0})$.`,
            `设 $g(t) = \\int_0^t ${c} e^{${a}\\tau}\\,d\\tau$，$G(s) = \\mathcal{L}\\{g(t)\\}$。求 $G(${s0})$。`,
          );
          const solution = t(
            steps(
              `By the integration property of Laplace transforms, $\\mathcal{L}\\left\\{\\int_0^t f(\\tau)\\,d\\tau\\right\\} = \\frac{1}{s} F(s)$.`,
              `Here $f(t) = ${c} e^{${a}t}$, so $F(s) = \\frac{${c}}{s - ${a}}$.`,
              `Thus $G(s) = \\frac{${c}}{s(s - ${a})}$.`,
              `At $s = ${s0}$: $G(${s0}) = \\frac{${c}}{${s0} \\cdot ${k}}${lowestTerms(c, den)}$.`,
            ),
            steps(
              `根据拉普拉斯变换的积分性质，$\\mathcal{L}\\left\\{\\int_0^t f(\\tau)\\,d\\tau\\right\\} = \\frac{1}{s} F(s)$。`,
              `此处 $f(t) = ${c} e^{${a}t}$，其变换为 $F(s) = \\frac{${c}}{s - ${a}}$。`,
              `因此 $G(s) = \\frac{${c}}{s(s - ${a})}$。`,
              `在 $s = ${s0}$ 处：$G(${s0}) = \\frac{${c}}{${s0} \\cdot ${k}}${lowestTerms(c, den)}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [Q.of(c, k), Q.of(c, s0), Q.of(c * s0, k), Q.of(c, s0 * s0)],
          });
        },
      },
      {
        id: "the-transform-of-an-accumulated-integral",
        title: t("The transform of an accumulated integral", "累积积分的变换"),
        explanation: t(
          "Integration from $0$ to $t$ divides the transform by $s$: $\\mathcal{L}\\left\\{\\int_0^t f(\\tau)\\,d\\tau\\right\\} = \\frac{F(s)}{s}$. Combined with the shift rule for $\\tau e^{a\\tau}$,\n\n$$\\mathcal{L}\\left\\{\\int_0^t \\tau e^{a\\tau}\\,d\\tau\\right\\} = \\frac{1}{s(s - a)^{2}}.$$\n\nThis avoids integrating by parts before transforming.",
          "从 $0$ 到 $t$ 的积分使变换除以 $s$：$\\mathcal{L}\\left\\{\\int_0^t f(\\tau)\\,d\\tau\\right\\} = \\frac{F(s)}{s}$。结合 $\\tau e^{a\\tau}$ 的平移法则，\n\n$$\\mathcal{L}\\left\\{\\int_0^t \\tau e^{a\\tau}\\,d\\tau\\right\\} = \\frac{1}{s(s - a)^{2}}.$$\n\n这样就不必在变换前先做分部积分。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(-4, 4) || 1;
          const s0 = Math.max(a, 0) + rng.int(1, 4);
          const c = rng.int(1, 9);
          const ans = Q.of(c, s0 * (s0 - a) ** 2);
          const ea = a === 1 ? "" : a === -1 ? "-" : `${a}`;
          return numberProblem({
            prompt: t(
              `Find $\\mathcal{L}\\left\\{\\int_0^t ${c === 1 ? "" : c}\\tau e^{${ea}\\tau}\\,d\\tau\\right\\}$ at $s = ${s0}$.`,
              `求 $\\mathcal{L}\\left\\{\\int_0^t ${c === 1 ? "" : c}\\tau e^{${ea}\\tau}\\,d\\tau\\right\\}$ 在 $s = ${s0}$ 处的值。`,
            ),
            answer: ans,
            wrong: [Q.of(c, (s0 - a) ** 2), Q.of(c, s0 * (s0 - a)), Q.of(c, s0 * s0 * (s0 - a) ** 2)].filter((v) => !v.eq(ans)),
            solution: t(
              `$\\mathcal{L}\\{${c === 1 ? "" : c}\\tau e^{${ea}\\tau}\\} = \\frac{${c}}{(s ${signed(-a)})^{2}}$; dividing by $s$ and setting $s = ${s0}$ gives $\\frac{${c}}{${s0} \\cdot ${(s0 - a) ** 2}} = ${ans.toLatex()}$.`,
              `$\\mathcal{L}\\{${c === 1 ? "" : c}\\tau e^{${ea}\\tau}\\} = \\frac{${c}}{(s ${signed(-a)})^{2}}$；除以 $s$ 并令 $s = ${s0}$ 得 $\\frac{${c}}{${s0} \\cdot ${(s0 - a) ** 2}} = ${ans.toLatex()}$。`,
            ),
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
          "Multiplying by an exponential in time shifts the transform, replacing the variable by the variable minus the rate. For $f(t) = e^{at} \\sin(\\omega t)$, $\\mathcal{L}\\{f(t)\\} = \\frac{\\omega}{(s - a)^2 + \\omega^2} = \\frac{\\omega}{s^2 - 2as + (a^2 + \\omega^2)}$. The constant term in the denominator is $a^2 + \\omega^2$.",
          "在时间上乘以一个指数函数会使变换平移，把变量换成变量减去增长率。对于 $f(t) = e^{at} \\sin(\\omega t)$，$\\mathcal{L}\\{f(t)\\} = \\frac{\\omega}{(s - a)^2 + \\omega^2} = \\frac{\\omega}{s^2 - 2as + (a^2 + \\omega^2)}$。分母中的常数项为 $a^2 + \\omega^2$。",
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
      {
        id: "inverting-by-completing-the-square",
        title: t("Inverting by completing the square", "配方后求逆变换"),
        explanation: t(
          "When the denominator $s^{2} + ps + q$ has no real roots, complete the square: $s^{2} + ps + q = (s - a)^{2} + b^{2}$ with $a = -\\frac{p}{2}$ and $b^{2} = q - a^{2}$. The first shifting theorem then gives\n\n$$\\mathcal{L}^{-1}\\left\\{\\frac{c}{(s - a)^{2} + b^{2}}\\right\\} = \\frac{c}{b}e^{at}\\sin bt.$$\n\nThe factor $\\frac{1}{b}$ is needed because $\\mathcal{L}\\{\\sin bt\\} = \\frac{b}{s^{2} + b^{2}}$ carries $b$ in its numerator.",
          "当分母 $s^{2} + ps + q$ 没有实根时，先配方：$s^{2} + ps + q = (s - a)^{2} + b^{2}$，其中 $a = -\\frac{p}{2}$，$b^{2} = q - a^{2}$。第一平移定理给出\n\n$$\\mathcal{L}^{-1}\\left\\{\\frac{c}{(s - a)^{2} + b^{2}}\\right\\} = \\frac{c}{b}e^{at}\\sin bt.$$\n\n需要因子 $\\frac{1}{b}$，因为 $\\mathcal{L}\\{\\sin bt\\} = \\frac{b}{s^{2} + b^{2}}$ 的分子中带有 $b$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(-4, 4) || -1;
          const b = rng.int(1, 5);
          const c = rng.int(1, 12);
          const p = -2 * a;
          const q = a * a + b * b;
          const ans = Q.of(c, b);
          const ea = a === 1 ? "" : a === -1 ? "-" : `${a}`;
          const bt = b === 1 ? "t" : `${b}t`;
          return numberProblem({
            prompt: t(
              `$\\mathcal{L}^{-1}\\left\\{\\frac{${c}}{s^{2} ${signed(p)}s + ${q}}\\right\\} = Ke^{${ea}t}\\sin ${bt}$. Find $K$.`,
              `$\\mathcal{L}^{-1}\\left\\{\\frac{${c}}{s^{2} ${signed(p)}s + ${q}}\\right\\} = Ke^{${ea}t}\\sin ${bt}$。求 $K$。`,
            ),
            answer: ans,
            wrong: [Q.of(c), Q.of(c, b * b), Q.of(c * b)].filter((v) => !v.eq(ans)),
            solution: t(
              `$s^{2} ${signed(p)}s + ${q} = (s ${signed(-a)})^{2} + ${b}^{2}$, so the inverse is $\\frac{${c}}{${b}}e^{${ea}t}\\sin ${bt}$ and $K = ${ans.toLatex()}$.`,
              `$s^{2} ${signed(p)}s + ${q} = (s ${signed(-a)})^{2} + ${b}^{2}$，所以逆变换为 $\\frac{${c}}{${b}}e^{${ea}t}\\sin ${bt}$，$K = ${ans.toLatex()}$。`,
            ),
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
          "Delaying a function by switching it on later multiplies its transform by a decaying exponential that records the delay. For $f(t) = k u(t - c)(t - c)$, the second shifting theorem yields $\\mathcal{L}\\{f(t)\\} = k e^{-cs} \\mathcal{L}\\{t\\} = \\frac{k e^{-cs}}{s^2}$. Thus $s^2 e^{cs} \\mathcal{L}\\{f(t)\\} = k$.",
          "把函数推迟开启会使它的变换乘以一个记录延迟的衰减指数函数。对于 $f(t) = k u(t - c)(t - c)$，应用第二位移定理得 $\\mathcal{L}\\{f(t)\\} = k e^{-cs} \\mathcal{L}\\{t\\} = \\frac{k e^{-cs}}{s^2}$。因此 $s^2 e^{cs} \\mathcal{L}\\{f(t)\\} = k$。",
        ),
        generate(rng: Rng): Problem {
          const c = rng.int(1, 8);
          const k = rng.int(2, 35);
          const ans = 2 * k;

          const prompt = t(
            `Let $f(t) = ${k} u(t - ${c})(t - ${c})^2$. Evaluate the expression $s^3 e^{${c}s} \\mathcal{L}\\{f(t)\\}$.`,
            `设 $f(t) = ${k} u(t - ${c})(t - ${c})^2$。计算表达式 $s^3 e^{${c}s} \\mathcal{L}\\{f(t)\\}$ 的值。`,
          );
          const solution = t(
            steps(
              `The second shifting theorem states that $\\mathcal{L}\\{u(t - c) g(t - c)\\} = e^{-cs} G(s)$.`,
              `Here $g(t) = ${k}t^2$, so $G(s) = ${k} \\cdot \\frac{2!}{s^3} = \\frac{${ans}}{s^3}$.`,
              `Thus $\\mathcal{L}\\{f(t)\\} = \\frac{${ans} e^{-${c}s}}{s^3}$.`,
              `Multiplying by $s^3 e^{${c}s}$ cancels both the denominator and the exponential, leaving $${ans}$.`,
            ),
            steps(
              `第二位移定理表明 $\\mathcal{L}\\{u(t - c) g(t - c)\\} = e^{-cs} G(s)$。`,
              `此处 $g(t) = ${k}t^2$，故 $G(s) = ${k} \\cdot \\frac{2!}{s^3} = \\frac{${ans}}{s^3}$。`,
              `因此 $\\mathcal{L}\\{f(t)\\} = \\frac{${ans} e^{-${c}s}}{s^3}$。`,
              `乘以 $s^3 e^{${c}s}$ 后消去分母与指数因子，结果为 $${ans}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [k, 6 * k, c * k, 2 * c * k, 3 * k],
          });
        },
      },
      {
        id: "evaluating-a-delayed-inverse-transform",
        title: t("Evaluating a delayed inverse transform", "求延迟逆变换的值"),
        explanation: t(
          "The factor $e^{-cs}$ delays a function by $c$: $\\mathcal{L}^{-1}\\{e^{-cs}F(s)\\} = f(t - c)u(t - c)$. So\n\n$$\\mathcal{L}^{-1}\\left\\{\\frac{ke^{-cs}}{s^{2}}\\right\\} = k(t - c)u(t - c),$$\n\nwhich is $0$ before $t = c$ and a ramp starting from $0$ afterwards. Forgetting to replace $t$ by $t - c$ gives $kt$ instead.",
          "因子 $e^{-cs}$ 使函数延迟 $c$：$\\mathcal{L}^{-1}\\{e^{-cs}F(s)\\} = f(t - c)u(t - c)$。所以\n\n$$\\mathcal{L}^{-1}\\left\\{\\frac{ke^{-cs}}{s^{2}}\\right\\} = k(t - c)u(t - c),$$\n\n它在 $t = c$ 之前为 $0$，之后是从 $0$ 开始的斜坡。忘记把 $t$ 换成 $t - c$ 会得到 $kt$。",
        ),
        generate(rng: Rng): Problem {
          const k = rng.int(1, 9);
          const c = rng.int(1, 6);
          const t1 = rng.bool(0.8) ? c + rng.int(1, 6) : rng.int(0, c - 1);
          const ans = t1 >= c ? k * (t1 - c) : 0;
          return numberProblem({
            prompt: t(
              `Let $f(t) = \\mathcal{L}^{-1}\\left\\{\\frac{${k}e^{-${c === 1 ? "" : c}s}}{s^{2}}\\right\\}$. Find $f(${t1})$.`,
              `设 $f(t) = \\mathcal{L}^{-1}\\left\\{\\frac{${k}e^{-${c === 1 ? "" : c}s}}{s^{2}}\\right\\}$。求 $f(${t1})$。`,
            ),
            answer: ans,
            wrong: [k * t1, k * (t1 + c), k * Math.abs(t1 - c)].filter((w) => w !== ans),
            solution: t(
              `$f(t) = ${k}(t - ${c})u(t - ${c})$. ${t1 >= c ? `At $t = ${t1} \\ge ${c}$: $f = ${k} \\cdot ${t1 - c} = ${ans}$.` : `At $t = ${t1} < ${c}$ the step is still off, so $f = 0$.`}`,
              `$f(t) = ${k}(t - ${c})u(t - ${c})$。${t1 >= c ? `在 $t = ${t1} \\ge ${c}$ 处：$f = ${k} \\cdot ${t1 - c} = ${ans}$。` : `在 $t = ${t1} < ${c}$ 处阶跃尚未接通，所以 $f = 0$。`}`,
            ),
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
          "Splitting the transform into simple fractions lets you invert each one separately, since each simple fraction is the transform of an exponential. For $F(s) = \\frac{A}{s - a} + \\frac{B}{s - b}$, the inverse transform is $f(t) = A e^{at} + B e^{bt}$. At $t = 0$, $f(0) = A + B$.",
          "把变换拆成简单分式后，可以分别对每一项求逆变换，因为每个简单分式都是某个指数函数的变换。对于 $F(s) = \\frac{A}{s - a} + \\frac{B}{s - b}$，逆变换为 $f(t) = A e^{at} + B e^{bt}$。在 $t = 0$ 处，$f(0) = A + B$。",
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
      {
        id: "a-partial-fraction-coefficient-by-the-cover-up-rule",
        title: t("A partial-fraction coefficient by the cover-up rule", "用遮盖法求部分分式系数"),
        explanation: t(
          "For $F(s) = \\frac{\\alpha s + \\beta}{(s - p)(s - q)} = \\frac{A}{s - p} + \\frac{B}{s - q}$, cover up the factor $(s - p)$ and set $s = p$ in what remains:\n\n$$A = \\frac{\\alpha p + \\beta}{p - q}.$$\n\nThen $f(t) = Ae^{pt} + Be^{qt}$, so $A$ is the coefficient of $e^{pt}$ in the inverse transform.",
          "对 $F(s) = \\frac{\\alpha s + \\beta}{(s - p)(s - q)} = \\frac{A}{s - p} + \\frac{B}{s - q}$，遮住因子 $(s - p)$，在剩余部分中令 $s = p$：\n\n$$A = \\frac{\\alpha p + \\beta}{p - q}.$$\n\n于是 $f(t) = Ae^{pt} + Be^{qt}$，所以 $A$ 是逆变换中 $e^{pt}$ 的系数。",
        ),
        generate(rng: Rng): Problem {
          const p = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
          let q = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
          if (q === p) q = -p;
          const al = rng.int(1, 9);
          const be = rng.int(-9, 9) || 4;
          const ans = Q.of(al * p + be, p - q);
          const B = Q.of(al * q + be, q - p);
          const fac = (r: number): string => (r === 0 ? "s" : `(s ${signed(-r)})`);
          return numberProblem({
            prompt: t(
              `$\\mathcal{L}^{-1}\\left\\{\\frac{${al === 1 ? "" : al}s ${signed(be)}}{${fac(p)}${fac(q)}}\\right\\} = Ae^{${p}t} + Be^{${q}t}$. Find $A$.`,
              `$\\mathcal{L}^{-1}\\left\\{\\frac{${al === 1 ? "" : al}s ${signed(be)}}{${fac(p)}${fac(q)}}\\right\\} = Ae^{${p}t} + Be^{${q}t}$。求 $A$。`,
            ),
            answer: ans,
            wrong: [B, Q.of(al * p + be, q - p), Q.of(al * q + be, p - q)].filter((v) => !v.eq(ans)),
            solution: t(
              `Cover up $${fac(p)}$ and set $s = ${p}$: $A = \\frac{${al} \\cdot ${p < 0 ? `(${p})` : p} ${signed(be)}}{${p} - ${q < 0 ? `(${q})` : q}} = ${ans.toLatex()}$.`,
              `遮住 $${fac(p)}$ 并令 $s = ${p}$：$A = \\frac{${al} \\cdot ${p < 0 ? `(${p})` : p} ${signed(be)}}{${p} - ${q < 0 ? `(${q})` : q}} = ${ans.toLatex()}$。`,
            ),
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
          "Transforming the equation turns it into algebra, and the term that does not decay in the inverse transform gives the steady state. For $y' + a y = K$ with $y(0) = 0$, $Y(s) = \\frac{K}{s(s + a)} = \\frac{K/a}{s} - \\frac{K/a}{s + a}$. In the time domain, $y(t) = \\frac{K}{a}(1 - e^{-at})$, so the steady-state limit is $\\lim_{t \\to \\infty} y(t) = \\frac{K}{a}$.",
          "对方程做变换就把它变成代数问题，逆变换中不衰减的那一项给出稳态。对于 $y' + a y = K$（满足 $y(0) = 0$），变换后 $Y(s) = \\frac{K}{s(s + a)}$。求逆变换得 $y(t) = \\frac{K}{a}(1 - e^{-at})$，其稳态极限为 $\\lim_{t \\to \\infty} y(t) = \\frac{K}{a}$。",
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
      {
        id: "the-transient-coefficient-from-partial-fractions",
        title: t("The transient coefficient from partial fractions", "由部分分式求瞬态系数"),
        explanation: t(
          "Transforming $y' + ay = b$, $y(0) = y_0$ gives $(s + a)Y = y_0 + \\frac{b}{s}$, so\n\n$$Y(s) = \\frac{y_0}{s + a} + \\frac{b}{s(s + a)} = \\frac{b/a}{s} + \\frac{y_0 - b/a}{s + a}.$$\n\nInverting, $y(t) = \\frac{b}{a} + \\left(y_0 - \\frac{b}{a}\\right)e^{-at}$: the coefficient of $e^{-at}$ is the initial value minus the steady state.",
          "对 $y' + ay = b$，$y(0) = y_0$ 取变换得 $(s + a)Y = y_0 + \\frac{b}{s}$，所以\n\n$$Y(s) = \\frac{y_0}{s + a} + \\frac{b}{s(s + a)} = \\frac{b/a}{s} + \\frac{y_0 - b/a}{s + a}.$$\n\n取逆变换得 $y(t) = \\frac{b}{a} + \\left(y_0 - \\frac{b}{a}\\right)e^{-at}$：$e^{-at}$ 的系数等于初值减去稳态值。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(1, 6);
          const b = rng.int(1, 20);
          const y0 = rng.int(-5, 10);
          const ss = Q.of(b, a);
          const ans = Q.of(y0).sub(ss);
          return numberProblem({
            prompt: t(
              `Solve $y' + ${a === 1 ? "" : a}y = ${b}$, $y(0) = ${y0}$ with Laplace transforms. The solution has the form $y = C_1 + C_2e^{-${a === 1 ? "" : a}t}$. Find $C_2$.`,
              `用拉普拉斯变换求解 $y' + ${a === 1 ? "" : a}y = ${b}$，$y(0) = ${y0}$。解的形式为 $y = C_1 + C_2e^{-${a === 1 ? "" : a}t}$。求 $C_2$。`,
            ),
            answer: ans,
            wrong: [ss, Q.of(y0), ss.sub(Q.of(y0))].filter((v) => !v.eq(ans)),
            solution: t(
              `$Y = \\frac{${y0}}{s + ${a}} + \\frac{${b}}{s(s + ${a})}$, and $\\frac{${b}}{s(s + ${a})} = \\frac{${ss.toLatex()}}{s} - \\frac{${ss.toLatex()}}{s + ${a}}$. So $C_2 = ${y0} - ${ss.toLatex()} = ${ans.toLatex()}$.`,
              `$Y = \\frac{${y0}}{s + ${a}} + \\frac{${b}}{s(s + ${a})}$，且 $\\frac{${b}}{s(s + ${a})} = \\frac{${ss.toLatex()}}{s} - \\frac{${ss.toLatex()}}{s + ${a}}$。所以 $C_2 = ${y0} - ${ss.toLatex()} = ${ans.toLatex()}$。`,
            ),
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
          "A delayed step does nothing before it switches on, and long afterward the solution settles to the same steady state as for an immediate step. For $y' + a y = K u(t - c)$ with $y(0) = 0$, $Y(s) = \\frac{K e^{-cs}}{s(s + a)}$. Inverting gives $y(t) = \\frac{K}{a}(1 - e^{-a(t - c)}) u(t - c)$. As $t \\to \\infty$, $y(t) \\to \\frac{K}{a}$.",
          "延迟的阶跃在开启之前不起作用，很久以后解会稳定到与立即阶跃相同的稳态。对于方程 $y' + a y = K u(t - c)$（$y(0) = 0$），变换得 $Y(s) = \\frac{K e^{-cs}}{s(s + a)}$。其解为 $y(t) = \\frac{K}{a}(1 - e^{-a(t - c)}) u(t - c)$。当 $t \\to \\infty$ 时，$y(t) \\to \\frac{K}{a}$。",
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
      {
        id: "the-response-to-a-delayed-step-at-a-given-time",
        title: t("The response to a delayed step at a given time", "延迟阶跃在给定时刻的响应"),
        explanation: t(
          "For $y' + ay = ku(t - c)$, $y(0) = 0$: $Y = \\frac{ke^{-cs}}{s(s + a)}$, and $\\frac{k}{s(s + a)}$ inverts to $\\frac{k}{a}\\left(1 - e^{-at}\\right)$. The factor $e^{-cs}$ delays this by $c$:\n\n$$y(t) = \\frac{k}{a}\\left(1 - e^{-a(t - c)}\\right)u(t - c).$$\n\nNothing happens before $t = c$; afterwards $y$ rises toward $\\frac{k}{a}$, reaching half of it at $t = c + \\frac{\\ln 2}{a}$.",
          "对 $y' + ay = ku(t - c)$，$y(0) = 0$：$Y = \\frac{ke^{-cs}}{s(s + a)}$，而 $\\frac{k}{s(s + a)}$ 的逆变换为 $\\frac{k}{a}\\left(1 - e^{-at}\\right)$。因子 $e^{-cs}$ 使其延迟 $c$：\n\n$$y(t) = \\frac{k}{a}\\left(1 - e^{-a(t - c)}\\right)u(t - c).$$\n\n在 $t = c$ 之前什么也不发生；之后 $y$ 向 $\\frac{k}{a}$ 上升，在 $t = c + \\frac{\\ln 2}{a}$ 时达到它的一半。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(1, 6);
          const k = rng.int(2, 30);
          const c = rng.int(1, 6);
          const m = rng.pick([2, 4]);
          const ans = Q.of(k * (m - 1), a * m);
          return numberProblem({
            prompt: t(
              `$y' + ${a === 1 ? "" : a}y = ${k}u(t - ${c})$ with $y(0) = 0$. Find $y\\left(${c} + \\frac{\\ln ${m}}{${a}}\\right)$.`,
              `$y' + ${a === 1 ? "" : a}y = ${k}u(t - ${c})$，$y(0) = 0$。求 $y\\left(${c} + \\frac{\\ln ${m}}{${a}}\\right)$。`,
            ),
            answer: ans,
            wrong: [Q.of(k, a), Q.of(k, a * m), Q.of(k * (m - 1), m)].filter((v) => !v.eq(ans)),
            solution: t(
              steps(
                `$y(t) = \\frac{${k}}{${a}}\\left(1 - e^{-${a}(t - ${c})}\\right)u(t - ${c})$.`,
                `At $t = ${c} + \\frac{\\ln ${m}}{${a}}$, $e^{-${a}(t - ${c})} = \\frac{1}{${m}}$, so $y = \\frac{${k}}{${a}} \\cdot \\frac{${m - 1}}{${m}} = ${ans.toLatex()}$.`,
              ),
              steps(
                `$y(t) = \\frac{${k}}{${a}}\\left(1 - e^{-${a}(t - ${c})}\\right)u(t - ${c})$。`,
                `当 $t = ${c} + \\frac{\\ln ${m}}{${a}}$ 时 $e^{-${a}(t - ${c})} = \\frac{1}{${m}}$，所以 $y = \\frac{${k}}{${a}} \\cdot \\frac{${m - 1}}{${m}} = ${ans.toLatex()}$。`,
              ),
            ),
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
          "The transformed solution has the form of the transform of a sine, so the inverse is a sine wave whose amplitude is read from the coefficient. For $y'' + \\omega^2 y = 0$ with $y(0) = 0$ and $y'(0) = v_0$, $Y(s) = \\frac{v_0}{s^2 + \\omega^2} = \\frac{v_0}{\\omega} \\frac{\\omega}{s^2 + \\omega^2}$. The solution is $y(t) = \\frac{v_0}{\\omega} \\sin(\\omega t)$, with amplitude $A = \\frac{v_0}{\\omega}$.",
          "变换后的解具有正弦函数变换的形式，所以逆变换是一条正弦曲线，振幅可以从系数读出。对于 $y'' + \\omega^2 y = 0$（$y(0) = 0$，$y'(0) = v_0$），变换后 $Y(s) = \\frac{v_0}{s^2 + \\omega^2}$，其逆变换为 $y(t) = \\frac{v_0}{\\omega} \\sin(\\omega t)$，振荡振幅为 $A = \\frac{v_0}{\\omega}$。",
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
      {
        id: "a-coefficient-of-an-overdamped-solution",
        title: t("A coefficient of an overdamped solution", "过阻尼解的系数"),
        explanation: t(
          "For $y'' + (p + q)y' + pqy = 0$, transforming gives\n\n$$Y(s) = \\frac{y_0s + v_0 + (p + q)y_0}{(s + p)(s + q)}, \\qquad y_0 = y(0),\\ v_0 = y'(0).$$\n\nThe cover-up rule at $s = -p$ gives the coefficient of $e^{-pt}$: $A = \\frac{qy_0 + v_0}{q - p}$. Note the $(p + q)y_0$ term in the numerator, which comes from transforming $y'$.",
          "对 $y'' + (p + q)y' + pqy = 0$ 取变换得\n\n$$Y(s) = \\frac{y_0s + v_0 + (p + q)y_0}{(s + p)(s + q)}, \\qquad y_0 = y(0),\\ v_0 = y'(0).$$\n\n在 $s = -p$ 处用遮盖法得 $e^{-pt}$ 的系数：$A = \\frac{qy_0 + v_0}{q - p}$。注意分子中的 $(p + q)y_0$ 项，它来自对 $y'$ 的变换。",
        ),
        generate(rng: Rng): Problem {
          const p = rng.int(1, 4);
          const q = p + rng.int(1, 4);
          const y0 = rng.int(-4, 6);
          const v0 = rng.int(-6, 6);
          const ans = Q.of(q * y0 + v0, q - p);
          return numberProblem({
            prompt: t(
              `Solve $y'' + ${p + q}y' + ${p * q}y = 0$, $y(0) = ${y0}$, $y'(0) = ${v0}$ with Laplace transforms. Writing $y = Ae^{-${p === 1 ? "" : p}t} + Be^{-${q}t}$, find $A$.`,
              `用拉普拉斯变换求解 $y'' + ${p + q}y' + ${p * q}y = 0$，$y(0) = ${y0}$，$y'(0) = ${v0}$。写成 $y = Ae^{-${p === 1 ? "" : p}t} + Be^{-${q}t}$，求 $A$。`,
            ),
            answer: ans,
            wrong: [Q.of(v0 - p * y0, q - p), Q.of(q * y0 + v0, p - q), Q.of(p * y0 + v0, q - p)].filter((v) => !v.eq(ans)),
            solution: t(
              `$Y = \\frac{${y0}s ${signed(v0 + (p + q) * y0)}}{(s + ${p})(s + ${q})}$. Cover up $(s + ${p})$ and set $s = -${p}$: $A = \\frac{${-p * y0 + v0 + (p + q) * y0}}{${q - p}}${lowestTerms(q * y0 + v0, q - p)}$.`,
              `$Y = \\frac{${y0}s ${signed(v0 + (p + q) * y0)}}{(s + ${p})(s + ${q})}$。遮住 $(s + ${p})$ 并令 $s = -${p}$：$A = \\frac{${-p * y0 + v0 + (p + q) * y0}}{${q - p}}${lowestTerms(q * y0 + v0, q - p)}$。`,
            ),
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
          "After the step switches on, the oscillator vibrates about a new equilibrium, shifted by the step size divided by the square of the frequency. For $y'' + \\omega^2 y = K u(t - c)$ with zero initial conditions, $Y(s) = \\frac{K e^{-cs}}{s(s^2 + \\omega^2)} = \\frac{K}{\\omega^2} e^{-cs} \\left[ \\frac{1}{s} - \\frac{s}{s^2 + \\omega^2} \\right]$. For $t \\ge c$, $y(t) = \\frac{K}{\\omega^2}[1 - \\cos(\\omega(t - c))]$, oscillating about the equilibrium level $\\frac{K}{\\omega^2}$.",
          "阶跃开启后，振子围绕一个新的平衡位置振动，偏移量等于阶跃大小除以频率的平方。对于 $y'' + \\omega^2 y = K u(t - c)$（零初始条件），变换后 $Y(s) = \\frac{K e^{-cs}}{s(s^2 + \\omega^2)}$。当 $t \\ge c$ 时，$y(t) = \\frac{K}{\\omega^2}[1 - \\cos(\\omega(t - c))]$，围绕平衡中心 $\\frac{K}{\\omega^2}$ 振荡。",
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
              `The cosine term oscillates between $-1$ and $+1$, so $y(t)$ oscillates between $0$ and $${2 * ans}$ around the center level $${ans}$.`,
            ),
            steps(
              `对微分方程取变换：$(s^2 + ${omegaSq}) Y(s) = \\frac{${K} e^{-${c}s}}{s}$。`,
              `分解分式：$Y(s) = ${ans} e^{-${c}s} \\left[ \\frac{1}{s} - \\frac{s}{s^2 + ${omegaSq}} \\right]$。`,
              `利用第二位移定理求逆变换得 $y(t) = ${ans}[1 - \\cos(${omega}(t - ${c}))] u(t - ${c})$。`,
              `余弦项在 $-1$ 到 $+1$ 之间振动，因此 $y(t)$ 在 $0$ 到 $${2 * ans}$ 之间波动，中心平衡位置为 $${ans}$。`,
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
      {
        id: "the-position-of-an-oscillator-after-a-delayed-step",
        title: t("The position of an oscillator after a delayed step", "延迟阶跃后振子的位置"),
        explanation: t(
          "For $y'' + \\omega^{2}y = ku(t - c)$ starting at rest, $Y = \\frac{ke^{-cs}}{s(s^{2} + \\omega^{2})}$ and $\\frac{1}{s(s^{2} + \\omega^{2})} = \\frac{1}{\\omega^{2}}\\left(\\frac{1}{s} - \\frac{s}{s^{2} + \\omega^{2}}\\right)$, so\n\n$$y(t) = \\frac{k}{\\omega^{2}}\\left(1 - \\cos\\omega(t - c)\\right)u(t - c).$$\n\nThe oscillator swings between $0$ and $\\frac{2k}{\\omega^{2}}$, reaching the top half a period after the step.",
          "对从静止开始的 $y'' + \\omega^{2}y = ku(t - c)$，$Y = \\frac{ke^{-cs}}{s(s^{2} + \\omega^{2})}$，且 $\\frac{1}{s(s^{2} + \\omega^{2})} = \\frac{1}{\\omega^{2}}\\left(\\frac{1}{s} - \\frac{s}{s^{2} + \\omega^{2}}\\right)$，所以\n\n$$y(t) = \\frac{k}{\\omega^{2}}\\left(1 - \\cos\\omega(t - c)\\right)u(t - c).$$\n\n振子在 $0$ 与 $\\frac{2k}{\\omega^{2}}$ 之间摆动，在阶跃后半个周期到达最高点。",
        ),
        generate(rng: Rng): Problem {
          const w = rng.int(1, 5);
          const k = rng.int(1, 12) * w;
          const c = rng.int(1, 5);
          const m = rng.pick([1, 2, 3, 1, 3]);
          const cosv = m % 2 === 1 ? -1 : 1;
          const ans = Q.of(k * (1 - cosv), w * w);
          const tw = w === 1 ? "\\pi" : `\\frac{${m === 1 ? "" : m}\\pi}{${w}}`;
          const tt = w === 1 ? `${c} + ${m === 1 ? "" : m}\\pi` : `${c} + ${tw}`;
          return numberProblem({
            prompt: t(
              `$y'' + ${w * w === 1 ? "" : w * w}y = ${k}u(t - ${c})$ with $y(0) = y'(0) = 0$. Find $y(${tt})$.`,
              `$y'' + ${w * w === 1 ? "" : w * w}y = ${k}u(t - ${c})$，$y(0) = y'(0) = 0$。求 $y(${tt})$。`,
            ),
            answer: ans,
            wrong: [Q.of(k, w * w), Q.of(k * (1 + cosv), w * w), Q.of(2 * k, w)].filter((v) => !v.eq(ans)),
            solution: t(
              `$y(t) = \\frac{${k}}{${w * w}}\\left(1 - \\cos ${w === 1 ? "" : w}(t - ${c})\\right)$ for $t \\ge ${c}$. Here $${w === 1 ? "" : w}(t - ${c}) = ${m === 1 ? "" : m}\\pi$, whose cosine is $${cosv}$, so $y = ${ans.toLatex()}$.`,
              `当 $t \\ge ${c}$ 时 $y(t) = \\frac{${k}}{${w * w}}\\left(1 - \\cos ${w === 1 ? "" : w}(t - ${c})\\right)$。此处 $${w === 1 ? "" : w}(t - ${c}) = ${m === 1 ? "" : m}\\pi$，其余弦为 $${cosv}$，所以 $y = ${ans.toLatex()}$。`,
            ),
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
          "Transforming a linear system gives a matrix equation, and the determinant of the shifted matrix is the characteristic polynomial of the system. For $\\mathbf{x}' = A \\mathbf{x}$, taking Laplace transforms yields $(sI - A)\\mathbf{X}(s) = \\mathbf{x}(0)$. The determinant $\\det(sI - A)$ is the characteristic polynomial of $A$. At $s = 0$, $\\det(0I - A) = \\det(-A) = (-1)^n \\det(A)$.",
          "对线性方程组做变换得到一个矩阵方程，平移后矩阵的行列式就是方程组的特征多项式。对系统 $\\mathbf{x}' = A \\mathbf{x}$ 取拉普拉斯变换得到 $(sI - A)\\mathbf{X}(s) = \\mathbf{x}(0)$。行列式 $\\det(sI - A)$ 即为 $A$ 的特征多项式。在 $s = 0$ 处，$\\det(0I - A) = \\det(-A) = (-1)^n \\det(A)$。",
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
      {
        id: "solving-a-triangular-system-in-the-s-domain",
        title: t("Solving a triangular system in the $s$-domain", "在 $s$ 域中求解三角方程组"),
        explanation: t(
          "For $x_1' = ax_1 + bx_2$, $x_2' = dx_2$, transforming turns the system into algebra. Solve the second equation first, then substitute:\n\n$$X_2 = \\frac{x_2(0)}{s - d}, \\qquad X_1 = \\frac{x_1(0) + bX_2}{s - a}.$$\n\nThe coupling term $bX_2$ is the only way $x_2$ influences $x_1$; leaving it out treats the equations as independent.",
          "对 $x_1' = ax_1 + bx_2$，$x_2' = dx_2$，取变换后方程组变为代数方程。先解第二个方程，再代入：\n\n$$X_2 = \\frac{x_2(0)}{s - d}, \\qquad X_1 = \\frac{x_1(0) + bX_2}{s - a}.$$\n\n耦合项 $bX_2$ 是 $x_2$ 影响 $x_1$ 的唯一途径；省略它就把两个方程当成了独立的。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.pick([-3, -2, -1, 1, 2, 3]);
          let d = rng.pick([-3, -2, -1, 1, 2, 3]);
          if (d === a) d = -a;
          const co = (n: number): string => (n === 1 ? "" : n === -1 ? "-" : `${n}`);
          const b = rng.int(-4, 5) || 2;
          const x1 = rng.int(-3, 5);
          const x2 = rng.int(1, 5);
          const s0 = Math.max(a, d) + rng.int(1, 3);
          const X2 = Q.of(x2, s0 - d);
          const ans = Q.of(x1)
            .add(Q.of(b).mul(X2))
            .div(Q.of(s0 - a));
          return numberProblem({
            prompt: t(
              `For $x_1' = ${co(a)}x_1 ${signed(b).replace(/ 1$/, " ")}x_2$, $x_2' = ${co(d)}x_2$ with $x_1(0) = ${x1}$, $x_2(0) = ${x2}$, find $X_1(${s0})$, where $X_1 = \\mathcal{L}\\{x_1\\}$.`,
              `对 $x_1' = ${co(a)}x_1 ${signed(b).replace(/ 1$/, " ")}x_2$，$x_2' = ${co(d)}x_2$，$x_1(0) = ${x1}$，$x_2(0) = ${x2}$，求 $X_1(${s0})$，其中 $X_1 = \\mathcal{L}\\{x_1\\}$。`,
            ),
            answer: ans,
            wrong: [
              Q.of(x1, s0 - a),
              X2,
              Q.of(x1)
                .add(Q.of(b * x2))
                .div(Q.of(s0 - a)),
            ].filter((v) => !v.eq(ans)),
            solution: t(
              `$X_2(${s0}) = \\frac{${x2}}{${s0} - ${d < 0 ? `(${d})` : d}} = ${X2.toLatex()}$, and $X_1(${s0}) = \\frac{${x1} + ${b < 0 ? `(${b})` : b} \\cdot ${X2.toLatex()}}{${s0 - a}} = ${ans.toLatex()}$.`,
              `$X_2(${s0}) = \\frac{${x2}}{${s0} - ${d < 0 ? `(${d})` : d}} = ${X2.toLatex()}$，$X_1(${s0}) = \\frac{${x1} + ${b < 0 ? `(${b})` : b} \\cdot ${X2.toLatex()}}{${s0 - a}} = ${ans.toLatex()}$。`,
            ),
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
          "When the equations are uncoupled, each component can be transformed and solved on its own, and its long term value is its steady state. For $x_1' = -a x_1 + c_1$ with $x_1(0) = 0$, transforming gives $(s + a)X_1(s) = \\frac{c_1}{s}$, so $x_1(t) = \\frac{c_1}{a}(1 - e^{-at})$. The steady-state component is $\\lim_{t \\to \\infty} x_1(t) = \\frac{c_1}{a}$.",
          "当方程互不耦合时，每个分量都可以单独变换和求解，它的长期值就是稳态。对于 $x_1' = -a x_1 + c_1$（$x_1(0) = 0$），取变换得 $(s + a)X_1(s) = \\frac{c_1}{s}$，解得 $x_1(t) = \\frac{c_1}{a}(1 - e^{-at})$。其稳态极限为 $\\lim_{t \\to \\infty} x_1(t) = \\frac{c_1}{a}$。",
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
      {
        id: "the-long-run-value-of-a-cascade-by-the-final-value-theorem",
        title: t("The long-run value of a cascade by the final value theorem", "用终值定理求级联系统的长期值"),
        explanation: t(
          "For the cascade $x_2' = -bx_2 + k$, $x_1' = -ax_1 + x_2$ starting at $0$, the transforms are\n\n$$X_2 = \\frac{k}{s(s + b)}, \\qquad X_1 = \\frac{X_2}{s + a} = \\frac{k}{s(s + a)(s + b)}.$$\n\nWhen the limit exists, the final value theorem gives $\\lim_{t \\to \\infty}x(t) = \\lim_{s \\to 0}sX(s)$, so $x_1 \\to \\frac{k}{ab}$ without inverting the transform.",
          "对从 $0$ 出发的级联系统 $x_2' = -bx_2 + k$，$x_1' = -ax_1 + x_2$，变换为\n\n$$X_2 = \\frac{k}{s(s + b)}, \\qquad X_1 = \\frac{X_2}{s + a} = \\frac{k}{s(s + a)(s + b)}.$$\n\n当极限存在时，终值定理给出 $\\lim_{t \\to \\infty}x(t) = \\lim_{s \\to 0}sX(s)$，所以无需求逆变换即得 $x_1 \\to \\frac{k}{ab}$。",
        ),
        generate(rng: Rng): Problem {
          const a = rng.int(1, 6);
          const b = rng.int(1, 6);
          const k = rng.int(2, 40);
          const ans = Q.of(k, a * b);
          return numberProblem({
            prompt: t(
              `$x_1' = -${a === 1 ? "" : a}x_1 + x_2$ and $x_2' = -${b === 1 ? "" : b}x_2 + ${k}$, with $x_1(0) = x_2(0) = 0$. Use the final value theorem to find $\\lim_{t \\to \\infty}x_1(t)$.`,
              `$x_1' = -${a === 1 ? "" : a}x_1 + x_2$，$x_2' = -${b === 1 ? "" : b}x_2 + ${k}$，$x_1(0) = x_2(0) = 0$。用终值定理求 $\\lim_{t \\to \\infty}x_1(t)$。`,
            ),
            answer: ans,
            wrong: [Q.of(k, b), Q.of(k, a), Q.of(k, a + b)].filter((v) => !v.eq(ans)),
            solution: t(
              `$X_1 = \\frac{${k}}{s(s + ${a})(s + ${b})}$, so $\\lim_{s \\to 0}sX_1 = \\frac{${k}}{${a} \\cdot ${b}} = ${ans.toLatex()}$.`,
              `$X_1 = \\frac{${k}}{s(s + ${a})(s + ${b})}$，所以 $\\lim_{s \\to 0}sX_1 = \\frac{${k}}{${a} \\cdot ${b}} = ${ans.toLatex()}$。`,
            ),
          });
        },
      },
    ],
  },
];
