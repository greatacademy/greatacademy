import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem, steps, yesNo } from "../problems.ts";

/** par writes a negative number in parentheses. */
const par = (n: number): string => (n < 0 ? `(${n})` : String(n));

/** signed writes a number as a signed term: "+ 3" or "- 3". */
const signed = (n: number): string => (n < 0 ? `- ${-n}` : `+ ${n}`);

/** Pythagorean triples for clean magnitudes. */
const pythagoreanTriples = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [6, 8, 10],
  [8, 6, 10],
  [8, 15, 17],
  [15, 8, 17],
  [7, 24, 25],
  [24, 7, 25],
  [9, 12, 15],
  [12, 9, 15],
] as const;

// ---------------------------------------------------------------------------
// 1.1 Techniques for Solving First-Order ODEs
// ---------------------------------------------------------------------------

/** introductionToFirstOrderLinearOdes defines standard linear form y' + P(x)y = Q(x). */
export const introductionToFirstOrderLinearOdes: TopicDef = {
  id: "introduction-to-first-order-linear-odes",
  title: t("Introduction to First-Order Linear ODEs", "一阶线性常微分方程简介"),
  summary: t(
    "A first-order differential equation is linear if it can be written as y' + P(x)y = Q(x); it is homogeneous when Q(x) = 0.",
    "一阶常微分方程若能写成 y' + P(x)y = Q(x) 的形式则为线性方程；当 Q(x) = 0 时为齐次方程。",
  ),
  prerequisites: ["solving-first-order-odes-using-separation-of-variables"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-and-standardizing-first-order-linear-odes",
      title: t("Identifying and standardizing first-order linear ODEs", "识别一阶线性常微分方程并化为标准形式"),
      explanation: t(
        "A first order equation is linear when the unknown function and its derivative appear only to the first power, and dividing by the leading coefficient puts it in standard form. Dividing $a x y' + b y = c x^m$ by $a x$ yields standard form $y' + \\frac{b}{a x}y = \\frac{c}{a}x^{m-1}$, where the coefficient function is $P(x) = \\frac{b}{a x}$.",
        "当未知函数及其导数都只以一次幂出现时，一阶方程是线性的；除以首项系数就化为标准形式。将方程 $a x y' + b y = c x^m$ 两端同除以 $a x$ 可化为标准形式 $y' + \\frac{b}{a x}y = \\frac{c}{a}x^{m-1}$，其中系数函数为 $P(x) = \\frac{b}{a x}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(2, 9);
        const x0 = rng.int(1, 6);
        const c = rng.int(1, 8);
        const ans = Q.of(b, a * x0);

        const prompt = t(
          `Convert the differential equation $(${poly([a, "x"])})y' + ${poly([b, "y"])} = ${poly([c, "x^2"])}$ into standard form $y' + P(x)y = Q(x)$, and evaluate $P(${x0})$.`,
          `将微分方程 $(${poly([a, "x"])})y' + ${poly([b, "y"])} = ${poly([c, "x^2"])}$ 化为标准形式 $y' + P(x)y = Q(x)$，并计算 $P(${x0})$ 的值。`,
        );
        const solution = t(
          steps(
            `Divide the equation by the leading coefficient $(${poly([a, "x"])})$: $y' + \\frac{${b}}{${poly([a, "x"])}}y = \\frac{${c}}{${a}}x$.`,
            `Identify the coefficient function: $P(x) = \\frac{${b}}{${poly([a, "x"])}}$.`,
            `Evaluate at $x = ${x0}$: $P(${x0}) = \\frac{${b}}{${a}(${x0})} = \\frac{${b}}{${a * x0}}${lowestTerms(b, a * x0)}$.`,
          ),
          steps(
            `方程两边同除以首项系数 $(${poly([a, "x"])})$：$y' + \\frac{${b}}{${poly([a, "x"])}}y = \\frac{${c}}{${a}}x$。`,
            `确定系数函数：$P(x) = \\frac{${b}}{${poly([a, "x"])}}$。`,
            `代入 $x = ${x0}$ 求值：$P(${x0}) = \\frac{${b}}{${a}(${x0})} = \\frac{${b}}{${a * x0}}${lowestTerms(b, a * x0)}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(a, b * x0), Q.of(b, x0), ans.mul(Q.of(2))],
        });
      },
    },
    {
      id: "recognizing-linear-equations",
      title: t("Recognizing linear equations", "识别线性方程"),
      explanation: t(
        "An equation is linear in $y$ when $y$ and $y'$ appear only to the first power, are never multiplied together, and never sit inside another function. The coefficients may be any functions of $x$.\n\nSo $x^{2}y' + (\\sin x)y = e^{x}$ is linear, but $y' + y^{2} = x$, $yy' = x$ and $y' = \\sin y$ are not.",
        "当 $y$ 与 $y'$ 只以一次幂出现、彼此不相乘、也不出现在其他函数内部时，方程关于 $y$ 是线性的。系数可以是 $x$ 的任意函数。\n\n因此 $x^{2}y' + (\\sin x)y = e^{x}$ 是线性的，而 $y' + y^{2} = x$、$yy' = x$ 和 $y' = \\sin y$ 都不是。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 9);
        const b = rng.int(2, 5);
        const linear = [
          `x^{${b}}y' + ${a}y = \\sin x`,
          `y' = ${a}xy + e^{x}`,
          `(x^{2} + 1)y' - ${a}y = x^{${b}}`,
          `y' + (\\cos x)y = ${a}x^{${b}}`,
        ];
        const nonlinear: [string, Text][] = [
          [`y' + ${a}y^{2} = x`, t("$y$ is squared", "$y$ 被平方")],
          [`yy' + ${a}x = 0`, t("$y$ multiplies $y'$", "$y$ 与 $y'$ 相乘")],
          [`y' = \\sin(${a}y) + x`, t("$y$ sits inside the sine", "$y$ 出现在正弦函数内部")],
          [`y' + ${a}e^{y} = x^{${b}}`, t("$y$ sits inside the exponential", "$y$ 出现在指数函数内部")],
          [`(y')^{2} + ${a}y = x`, t("$y'$ is squared", "$y'$ 被平方")],
        ];
        const isLinear = rng.bool(0.5);
        const [eq, why] = isLinear ? [rng.pick(linear), undefined] : rng.pick(nonlinear);
        return choiceProblem({
          prompt: t(`Is $${eq}$ linear in $y$?`, `$${eq}$ 关于 $y$ 是线性的吗？`),
          options: yesNo,
          correct: isLinear ? 0 : 1,
          solution: why
            ? t(`No: ${why.en}, so the equation is not linear.`, `不是：${why["zh-CN"]}，所以方程不是线性的。`)
            : t(
                "Yes: $y$ and $y'$ appear only to the first power, are not multiplied together, and their coefficients depend only on $x$.",
                "是：$y$ 与 $y'$ 只以一次幂出现，彼此不相乘，且系数只依赖于 $x$。",
              ),
        });
      },
    },
  ],
};

/** generalSolutionsOfFirstOrderLinearOdes establishes solution structure y = y_h + y_p. */
export const generalSolutionsOfFirstOrderLinearOdes: TopicDef = {
  id: "general-solutions-of-first-order-linear-odes",
  title: t("General Solutions of First-Order Linear ODEs", "一阶线性微分方程的通解结构"),
  summary: t(
    "The general solution of $y' + ay = b$ is $y = \\frac{b}{a} + Ce^{-ax}$, which tends to the steady state $\\frac{b}{a}$ as $x \\to \\infty$ when $a > 0$.",
    "方程 $y' + ay = b$ 的通解为 $y = \\frac{b}{a} + Ce^{-ax}$；当 $a > 0$ 时，$x \\to \\infty$ 时趋于稳态 $\\frac{b}{a}$。",
  ),
  prerequisites: ["introduction-to-first-order-linear-odes"],
  encompasses: [{ topic: "introduction-to-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "steady-state-and-transient-solutions-of-first-order-odes",
      title: t("Steady-state and transient solutions of first-order ODEs", "一阶微分方程的稳态解与瞬态解"),
      explanation: t(
        "For $y' + a y = b$ with $a > 0$, the general solution is $y(x) = \\frac{b}{a} + C e^{-a x}$. As $x \\to \\infty$, the transient term $C e^{-a x} \\to 0$, leaving the steady-state value $y_{\\text{steady}} = \\frac{b}{a}$.",
        "对于 $a > 0$ 的常系数方程 $y' + a y = b$，通解为 $y(x) = \\frac{b}{a} + C e^{-a x}$。当 $x \\to \\infty$ 时，瞬态项 $C e^{-a x} \\to 0$，趋向稳态值 $y_{\\text{steady}} = \\frac{b}{a}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const k = rng.int(2, 9);
        const b = a * k;
        const y0 = rng.int(1, 15);
        const ans = k;

        const prompt = t(
          `Find the steady-state limit $\\lim_{x \\to \\infty} y(x)$ of the solution to the initial value problem $y' + ${a}y = ${b}$, $y(0) = ${y0}$.`,
          `求初值问题 $y' + ${a}y = ${b}$，$y(0) = ${y0}$ 的解在 $x \\to \\infty$ 时的稳态极限值 $\\lim_{x \\to \\infty} y(x)$。`,
        );
        const solution = t(
          steps(
            `The homogeneous equation $y' + ${a}y = 0$ has solution $y_h(x) = C e^{-${a}x}$.`,
            `A particular constant solution is $y_p = \\frac{${b}}{${a}} = ${k}$.`,
            `The general solution is $y(x) = ${k} + C e^{-${a}x}$. With $y(0) = ${y0}$, $C = ${y0 - k}$.`,
            `Since $a = ${a} > 0$, $\\lim_{x \\to \\infty} e^{-${a}x} = 0$, so $\\lim_{x \\to \\infty} y(x) = ${k}$.`,
          ),
          steps(
            `齐次方程 $y' + ${a}y = 0$ 的解为 $y_h(x) = C e^{-${a}x}$。`,
            `常数特解为 $y_p = \\frac{${b}}{${a}} = ${k}$。`,
            `通解为 $y(x) = ${k} + C e^{-${a}x}$。由初值条件 $y(0) = ${y0}$，得 $C = ${y0 - k}$。`,
            `因为 $a = ${a} > 0$，$\\lim_{x \\to \\infty} e^{-${a}x} = 0$，故稳态极限为 $${k}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [b, a, ans + a],
        });
      },
    },
    {
      id: "evaluating-the-solution-of-an-initial-value-problem",
      title: t("Evaluating the solution of an initial value problem", "求初值问题的解在某点的值"),
      explanation: t(
        "The initial condition fixes the constant in $y = \\frac{b}{a} + Ce^{-ax}$: at $x = 0$, $C = y(0) - \\frac{b}{a}$. The transient part $Ce^{-ax}$ halves every $\\frac{\\ln 2}{a}$, so\n\n$$y\\left(\\frac{\\ln 2}{a}\\right) = \\frac{b}{a} + \\frac{1}{2}\\left(y(0) - \\frac{b}{a}\\right),$$\n\nthe value halfway between the start and the steady state.",
        "初值条件确定 $y = \\frac{b}{a} + Ce^{-ax}$ 中的常数：令 $x = 0$，$C = y(0) - \\frac{b}{a}$。瞬态部分 $Ce^{-ax}$ 每经过 $\\frac{\\ln 2}{a}$ 减半，所以\n\n$$y\\left(\\frac{\\ln 2}{a}\\right) = \\frac{b}{a} + \\frac{1}{2}\\left(y(0) - \\frac{b}{a}\\right),$$\n\n即初值与稳态值的中点。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const k = rng.int(1, 9);
        let y0 = rng.int(-6, 15);
        if (y0 === k) y0 = k + 4;
        const ans = Q.of(k + y0, 2);
        return numberProblem({
          prompt: t(
            `Solve $y' + ${a}y = ${a * k}$ with $y(0) = ${y0}$, and find $y\\left(\\frac{\\ln 2}{${a}}\\right)$.`,
            `求解 $y' + ${a}y = ${a * k}$，$y(0) = ${y0}$，并求 $y\\left(\\frac{\\ln 2}{${a}}\\right)$。`,
          ),
          answer: ans,
          wrong: [Q.of(k), Q.of(y0, 2), Q.of(2 * y0 - k)].filter((v) => !v.eq(ans)),
          solution: t(
            steps(
              `The steady state is $\\frac{${a * k}}{${a}} = ${k}$, so $y = ${k} + Ce^{-${a}x}$ with $C = ${y0} - ${par(k)} = ${y0 - k}$.`,
              `At $x = \\frac{\\ln 2}{${a}}$, $e^{-${a}x} = \\frac{1}{2}$, so $y = ${k} ${signed(y0 - k).replace(/\d+/, (n) => `\\frac{${n}}{2}`)} = ${ans.toLatex()}$.`,
            ),
            steps(
              `稳态值为 $\\frac{${a * k}}{${a}} = ${k}$，所以 $y = ${k} + Ce^{-${a}x}$，$C = ${y0} - ${par(k)} = ${y0 - k}$。`,
              `当 $x = \\frac{\\ln 2}{${a}}$ 时 $e^{-${a}x} = \\frac{1}{2}$，所以 $y = ${k} ${signed(y0 - k).replace(/\d+/, (n) => `\\frac{${n}}{2}`)} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingFirstOrderLinearOdesWithExponentialForcing solves y' + a y = b e^{kx}. */
export const solvingFirstOrderLinearOdesWithExponentialForcing: TopicDef = {
  id: "solving-first-order-linear-odes-with-exponential-forcing",
  title: t("Solving First-Order Linear ODEs With Exponential Forcing", "指数非齐次项的一阶线性方程求解"),
  summary: t(
    "For $y' + ay = be^{kx}$ with $k \\ne -a$, undetermined coefficients gives $y_p = Ae^{kx}$ with $A = \\frac{b}{a + k}$.",
    "对 $y' + ay = be^{kx}$（$k \\ne -a$），待定系数法给出特解 $y_p = Ae^{kx}$，其中 $A = \\frac{b}{a + k}$。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "method-of-undetermined-coefficients-for-exponential-forcing",
      title: t("Method of undetermined coefficients for exponential forcing", "待定系数法求解指数激励一阶常微分方程"),
      explanation: t(
        "When the forcing term is an exponential, guess a multiple of the same exponential, substitute it, and solve for the unknown coefficient. Substituting $y_p(x) = A e^{kx}$ into $y' + ay = b e^{kx}$ gives $(k + a) A e^{kx} = b e^{kx}$, so $A = \\frac{b}{a + k}$.",
        "当强迫项是指数函数时，猜测解是同一个指数函数的倍数，代入后解出未知系数。将特解形式 $y_p(x) = A e^{kx}$ 代入方程 $y' + ay = b e^{kx}$ 得 $(k + a) A e^{kx} = b e^{kx}$，由此解得 $A = \\frac{b}{a + k}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const k = rng.int(1, 6);
        const A = rng.int(2, 8);
        const b = A * (a + k);

        const prompt = t(
          `Find the coefficient $A$ of the particular solution $y_p(x) = A e^{${poly([k, "x"])}}$ to the differential equation $y' + ${poly([a, "y"])} = ${b}e^{${poly([k, "x"])}}$.`,
          `求微分方程 $y' + ${poly([a, "y"])} = ${b}e^{${poly([k, "x"])}}$ 的特解 $y_p(x) = A e^{${poly([k, "x"])}}$ 的系数 $A$。`,
        );
        const solution = t(
          steps(
            `Assume a particular solution of the form $y_p(x) = A e^{${poly([k, "x"])}}$.`,
            `Differentiate: $y_p'(x) = ${k}A e^{${poly([k, "x"])}}$.`,
            `Substitute into the ODE: $(${k}A e^{${poly([k, "x"])}}) + ${a}(A e^{${poly([k, "x"])}}) = (${k + a})A e^{${poly([k, "x"])}} = ${b}e^{${poly([k, "x"])}}$.`,
            `Equate coefficients: $(${k + a})A = ${b} \\implies A = \\frac{${b}}{${k + a}} = ${A}$.`,
          ),
          steps(
            `设特解形式为 $y_p(x) = A e^{${poly([k, "x"])}}$。`,
            `求导：$y_p'(x) = ${k}A e^{${poly([k, "x"])}}$。`,
            `代入微分方程：$(${k}A e^{${poly([k, "x"])}}) + ${a}(A e^{${poly([k, "x"])}}) = (${k + a})A e^{${poly([k, "x"])}} = ${b}e^{${poly([k, "x"])}}$。`,
            `对比系数：$(${k + a})A = ${b} \\implies A = \\frac{${b}}{${k + a}} = ${A}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: A,
          wrong: [b, a + k, A + 1],
        });
      },
    },
    {
      id: "the-resonant-case-of-exponential-forcing",
      title: t("The resonant case of exponential forcing", "指数激励的共振情形"),
      explanation: t(
        "When $k = -a$ the guess $Ae^{-ax}$ solves the homogeneous equation and cannot produce the forcing. Multiply the guess by $x$: substituting $y_p = Bxe^{-ax}$ into $y' + ay = be^{-ax}$ gives $B = b$. With $y(0) = y_0$ the solution is\n\n$$y = (bx + y_0)e^{-ax}.$$\n\nFor $b > ay_0 > 0$ it first rises and then decays; $y' = e^{-ax}\\left(b - a(bx + y_0)\\right)$ vanishes at $x = \\frac{1}{a} - \\frac{y_0}{b}$, where $y$ is largest.",
        "当 $k = -a$ 时，猜测 $Ae^{-ax}$ 是齐次方程的解，无法产生激励项。把猜测乘以 $x$：将 $y_p = Bxe^{-ax}$ 代入 $y' + ay = be^{-ax}$ 得 $B = b$。若 $y(0) = y_0$，解为\n\n$$y = (bx + y_0)e^{-ax}.$$\n\n当 $b > ay_0 > 0$ 时，它先上升后衰减；$y' = e^{-ax}\\left(b - a(bx + y_0)\\right)$ 在 $x = \\frac{1}{a} - \\frac{y_0}{b}$ 处为零，此时 $y$ 最大。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const y0 = rng.int(1, 4);
        const b = a * y0 + rng.int(1, 8);
        const ans = Q.of(b - a * y0, a * b);
        return numberProblem({
          prompt: t(
            `Solve $y' + ${a === 1 ? "" : a}y = ${b}e^{-${a === 1 ? "" : a}x}$ with $y(0) = ${y0}$, and find the value of $x$ at which $y$ is largest.`,
            `求解 $y' + ${a === 1 ? "" : a}y = ${b}e^{-${a === 1 ? "" : a}x}$，$y(0) = ${y0}$，并求 $y$ 取最大值时 $x$ 的值。`,
          ),
          answer: ans,
          wrong: [Q.of(1, a), Q.of(y0, b), Q.of(b + a * y0, a * b)].filter((v) => !v.eq(ans)),
          solution: t(
            steps(
              `The forcing $e^{-${a}x}$ solves the homogeneous equation, so try $y_p = Bxe^{-${a}x}$; substituting gives $B = ${b}$, and $y = (${b}x + ${y0})e^{-${a}x}$.`,
              `$y' = e^{-${a}x}\\left(${b} - ${a}(${b}x + ${y0})\\right) = 0$ gives $x = \\frac{${b} - ${a * y0}}{${a * b}} = ${ans.toLatex()}$.`,
            ),
            steps(
              `激励 $e^{-${a}x}$ 是齐次方程的解，所以设 $y_p = Bxe^{-${a}x}$；代入得 $B = ${b}$，$y = (${b}x + ${y0})e^{-${a}x}$。`,
              `由 $y' = e^{-${a}x}\\left(${b} - ${a}(${b}x + ${y0})\\right) = 0$ 得 $x = \\frac{${b} - ${a * y0}}{${a * b}} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingFirstOrderLinearOdesWithSinusoidalForcing solves y' + a y = b cos(ω x). */
export const solvingFirstOrderLinearOdesWithSinusoidalForcing: TopicDef = {
  id: "solving-first-order-linear-odes-with-sinusoidal-forcing",
  title: t("Solving First-Order Linear ODEs With Sinusoidal Forcing", "正弦非齐次项的一阶线性方程求解"),
  summary: t(
    "For $y' + ay = b\\cos \\omega x$, the steady-state response has amplitude $R = \\frac{b}{\\sqrt{a^2 + \\omega^2}}$.",
    "对 $y' + ay = b\\cos \\omega x$，稳态响应的振幅为 $R = \\frac{b}{\\sqrt{a^2 + \\omega^2}}$。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "steady-state-amplitude-for-sinusoidal-forcing",
      title: t("Steady-state amplitude for sinusoidal forcing", "正弦激励下稳态振荡的振幅计算"),
      explanation: t(
        "A sinusoidal input produces a sinusoidal output at the same frequency, and the amplitude of that output is the length of the vector of its two coefficients. Substituting $y_p = A \\cos(\\omega x) + B \\sin(\\omega x)$ into $y' + a y = b \\cos(\\omega x)$ yields amplitude $R = \\sqrt{A^2 + B^2} = \\frac{b}{\\sqrt{a^2 + \\omega^2}}$.",
        "正弦输入产生同频率的正弦输出，输出的振幅等于由两个系数构成的向量的长度。设特解为 $y_p = A \\cos(\\omega x) + B \\sin(\\omega x)$，代入 $y' + a y = b \\cos(\\omega x)$ 可得稳态响应振幅为 $R = \\sqrt{A^2 + B^2} = \\frac{b}{\\sqrt{a^2 + \\omega^2}}$。",
      ),
      generate(rng: Rng): Problem {
        const triple = rng.pick(pythagoreanTriples);
        const a = triple[0];
        const w = triple[1];
        const denom = triple[2];
        const R_amp = rng.int(2, 7);
        const b = R_amp * denom;

        const prompt = t(
          `Find the amplitude $R$ of the steady-state sinusoidal solution $y_p(x)$ to the differential equation $y' + ${a}y = ${b}\\cos(${w}x)$.`,
          `求微分方程 $y' + ${a}y = ${b}\\cos(${w}x)$ 的稳态正弦特解 $y_p(x)$ 的振幅 $R$。`,
        );
        const solution = t(
          steps(
            `Assume $y_p(x) = A \\cos(${w}x) + B \\sin(${w}x)$.`,
            `The amplitude of the resulting sinusoidal steady-state oscillation is given by $R = \\frac{b}{\\sqrt{a^2 + \\omega^2}}$.`,
            `Compute the denominator: $\\sqrt{${a}^2 + ${w}^2} = \\sqrt{${a * a} + ${w * w}} = \\sqrt{${denom * denom}} = ${denom}$.`,
            `Calculate the amplitude: $R = \\frac{${b}}{${denom}} = ${R_amp}$.`,
          ),
          steps(
            `设稳态特解为 $y_p(x) = A \\cos(${w}x) + B \\sin(${w}x)$。`,
            `正弦稳态响应的振幅公式为 $R = \\frac{b}{\\sqrt{a^2 + \\omega^2}}$。`,
            `计算分母模长：$\\sqrt{${a}^2 + ${w}^2} = \\sqrt{${a * a} + ${w * w}} = \\sqrt{${denom * denom}} = ${denom}$。`,
            `计算振幅：$R = \\frac{${b}}{${denom}} = ${R_amp}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: R_amp,
          wrong: [denom, b, R_amp + 1],
        });
      },
    },
    {
      id: "the-coefficients-of-the-steady-state-response",
      title: t("The coefficients of the steady-state response", "稳态响应的系数"),
      explanation: t(
        "Write the steady state as $y_p = A\\cos\\omega x + B\\sin\\omega x$ and substitute into $y' + ay = b\\cos\\omega x$. Matching the cosine and sine terms gives $aA + \\omega B = b$ and $aB - \\omega A = 0$, so\n\n$$A = \\frac{ab}{a^{2} + \\omega^{2}}, \\qquad B = \\frac{\\omega b}{a^{2} + \\omega^{2}}.$$\n\nThe sine part appears even though the forcing has none: the response lags behind the input.",
        "把稳态写成 $y_p = A\\cos\\omega x + B\\sin\\omega x$，代入 $y' + ay = b\\cos\\omega x$。比较余弦项与正弦项得 $aA + \\omega B = b$ 与 $aB - \\omega A = 0$，所以\n\n$$A = \\frac{ab}{a^{2} + \\omega^{2}}, \\qquad B = \\frac{\\omega b}{a^{2} + \\omega^{2}}.$$\n\n尽管激励中没有正弦项，响应中仍出现正弦部分：响应滞后于输入。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const w = rng.int(1, 6);
        const b = rng.int(2, 12);
        const den = a * a + w * w;
        const askA = rng.bool(0.5);
        const ans = Q.of((askA ? a : w) * b, den);
        const other = Q.of((askA ? w : a) * b, den);
        const name = askA ? "A" : "B";
        return numberProblem({
          prompt: t(
            `The steady-state solution of $y' + ${a === 1 ? "" : a}y = ${b}\\cos ${w === 1 ? "" : w}x$ is $y_p = A\\cos ${w === 1 ? "" : w}x + B\\sin ${w === 1 ? "" : w}x$. Find $${name}$.`,
            `$y' + ${a === 1 ? "" : a}y = ${b}\\cos ${w === 1 ? "" : w}x$ 的稳态解为 $y_p = A\\cos ${w === 1 ? "" : w}x + B\\sin ${w === 1 ? "" : w}x$。求 $${name}$。`,
          ),
          answer: ans,
          wrong: [other, Q.of(b, askA ? a : w), Q.of((askA ? a : w) * b, a + w)].filter((v) => !v.eq(ans)),
          solution: t(
            steps(
              `Substituting and matching terms: $${a}A + ${w}B = ${b}$ and $${a}B - ${w}A = 0$.`,
              `So $A = \\frac{${a} \\cdot ${b}}{${a}^{2} + ${w}^{2}} = ${Q.of(a * b, den).toLatex()}$ and $B = \\frac{${w} \\cdot ${b}}{${den}} = ${Q.of(w * b, den).toLatex()}$; hence $${name} = ${ans.toLatex()}$.`,
            ),
            steps(
              `代入并比较系数：$${a}A + ${w}B = ${b}$，$${a}B - ${w}A = 0$。`,
              `所以 $A = \\frac{${a} \\cdot ${b}}{${a}^{2} + ${w}^{2}} = ${Q.of(a * b, den).toLatex()}$，$B = \\frac{${w} \\cdot ${b}}{${den}} = ${Q.of(w * b, den).toLatex()}$；因此 $${name} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingFirstOrderLinearOdesUsingIntegratingFactors multiplies by I(x) = e^{∫P dx}. */
export const solvingFirstOrderLinearOdesUsingIntegratingFactors: TopicDef = {
  id: "solving-first-order-linear-odes-using-integrating-factors",
  title: t("Solving First-Order Linear ODEs Using Integrating Factors", "用积分因子法解一阶线性常微分方程"),
  summary: t(
    "Multiplying y' + P(x)y = Q(x) by I(x) = exp(∫ P(x) dx) condenses the left side into (I(x)y)', allowing direct integration.",
    "通过乘以积分因子 I(x) = exp(∫ P(x) dx)，方程左边化为 (I(x)y)'，从而可通过直接积分求解。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "determining-the-integrating-factor",
      title: t("Determining the integrating factor", "确定一阶线性微分方程的积分因子"),
      explanation: t(
        "Multiplying by the integrating factor turns the left side into the derivative of a product, so the equation can be solved by integrating once. For $x y' + k y = Q(x)$ ($x > 0$), dividing by $x$ gives $y' + \\frac{k}{x}y = \\frac{Q(x)}{x}$. The integrating factor is $I(x) = e^{\\int \\frac{k}{x}dx} = e^{k \\ln x} = x^k$.",
        "乘以积分因子后，左边变成一个乘积的导数，所以积分一次就能解出方程。对于 $x y' + k y = Q(x)$（$x > 0$），同除以 $x$ 得 $y' + \\frac{k}{x}y = \\frac{Q(x)}{x}$。其积分因子为 $I(x) = e^{\\int \\frac{k}{x}dx} = e^{k \\ln x} = x^k$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 9);
        const c = rng.int(1, 8);

        const prompt = t(
          `Find the exponent $p$ such that $I(x) = x^p$ is an integrating factor for the differential equation $x y' + ${k}y = ${c}x^3$ (for $x > 0$).`,
          `求使 $I(x) = x^p$ 成为微分方程 $x y' + ${k}y = ${c}x^3$（$x > 0$）的积分因子的指数 $p$。`,
        );
        const solution = t(
          steps(
            `Put the equation in standard form by dividing by $x$: $y' + \\frac{${k}}{x}y = ${c}x^2$.`,
            `Identify $P(x) = \\frac{${k}}{x}$.`,
            `Compute the integrating factor: $I(x) = e^{\\int \\frac{${k}}{x}dx} = e^{${k} \\ln x} = x^{${k}}$.`,
            `Therefore, the exponent is $p = ${k}$.`,
          ),
          steps(
            `两端同除以 $x$ 化为标准形式：$y' + \\frac{${k}}{x}y = ${c}x^2$。`,
            `确定 $P(x) = \\frac{${k}}{x}$。`,
            `计算积分因子：$I(x) = e^{\\int \\frac{${k}}{x}dx} = e^{${k} \\ln x} = x^{${k}}$。`,
            `因此指数为 $p = ${k}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: k,
          wrong: [k + 1, k - 1, c],
        });
      },
    },
    {
      id: "solving-with-a-power-integrating-factor",
      title: t("Solving with a power integrating factor", "用幂函数积分因子求解"),
      explanation: t(
        "For $xy' + py = cx^{m+1}$ on $x > 0$, divide by $x$ to get $y' + \\frac{p}{x}y = cx^{m}$. The integrating factor is $e^{\\int p/x\\,dx} = x^{p}$, and\n\n$$(x^{p}y)' = cx^{m+p} \\implies x^{p}y = \\frac{c}{m + p + 1}x^{m+p+1} + C.$$\n\nDivide by $x^{p}$ and use the initial condition to find $C$.",
        "对 $x > 0$ 上的 $xy' + py = cx^{m+1}$，除以 $x$ 得 $y' + \\frac{p}{x}y = cx^{m}$。积分因子为 $e^{\\int p/x\\,dx} = x^{p}$，且\n\n$$(x^{p}y)' = cx^{m+p} \\implies x^{p}y = \\frac{c}{m + p + 1}x^{m+p+1} + C.$$\n\n两边除以 $x^{p}$，再用初值条件求 $C$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(1, 3);
        const m = rng.int(0, 2);
        const k = rng.int(1, 4);
        let y0 = rng.int(-3, 9);
        if (y0 === k) y0 = k + 2;
        const c = k * (m + p + 1);
        const big = Q.of(k * 2 ** (m + 1));
        const ans = big.add(Q.of(y0 - k, 2 ** p));
        const rhs = m === 0 ? "x" : `x^{${m + 1}}`;
        return numberProblem({
          prompt: t(
            `Solve $xy' + ${p === 1 ? "" : p}y = ${c}${rhs}$ for $x > 0$ with $y(1) = ${y0}$, and find $y(2)$.`,
            `在 $x > 0$ 上求解 $xy' + ${p === 1 ? "" : p}y = ${c}${rhs}$，$y(1) = ${y0}$，并求 $y(2)$。`,
          ),
          answer: ans,
          wrong: [big, big.add(Q.of((y0 - k) * 2 ** p)), Q.of(y0 * 2 ** (m + 1))].filter((v) => !v.eq(ans)),
          solution: t(
            steps(
              `The integrating factor is $x^{${p}}$: $(x^{${p}}y)' = ${c}x^{${m + p}}$, so $x^{${p}}y = ${k}x^{${m + p + 1}} + C$ and $y = ${k}x^{${m + 1}} + Cx^{-${p}}$.`,
              `$y(1) = ${k} + C = ${y0}$ gives $C = ${y0 - k}$, so $y(2) = ${k} \\cdot 2^{${m + 1}} ${y0 < k ? "-" : "+"} ${Q.of(Math.abs(y0 - k), 2 ** p).toLatex()} = ${ans.toLatex()}$.`,
            ),
            steps(
              `积分因子为 $x^{${p}}$：$(x^{${p}}y)' = ${c}x^{${m + p}}$，所以 $x^{${p}}y = ${k}x^{${m + p + 1}} + C$，$y = ${k}x^{${m + 1}} + Cx^{-${p}}$。`,
              `由 $y(1) = ${k} + C = ${y0}$ 得 $C = ${y0 - k}$，所以 $y(2) = ${k} \\cdot 2^{${m + 1}} ${y0 < k ? "-" : "+"} ${Q.of(Math.abs(y0 - k), 2 ** p).toLatex()} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingFirstOrderOdesBySubstitution solves y' = f(ax + by + c). */
export const solvingFirstOrderOdesBySubstitution: TopicDef = {
  id: "solving-first-order-odes-by-substitution",
  title: t("Solving First-Order ODEs by Substitution", "变量代换法解一阶常微分方程"),
  summary: t(
    "Equations of the form y' = f(ax + by + c) are transformed into separable equations using the linear substitution v = ax + by + c.",
    "形如 y' = f(ax + by + c) 的方程通过线性变量代换 v = ax + by + c 化为可分离变量的微分方程。",
  ),
  prerequisites: ["solving-first-order-odes-using-separation-of-variables"],
  encompasses: [
    {
      topic: "solving-first-order-odes-using-separation-of-variables",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "linear-substitutions-in-first-order-odes",
      title: t("Linear substitutions in first-order ODEs", "一阶微分方程中的一次式代换"),
      explanation: t(
        "When the right side depends only on a linear combination of the variables, naming that combination as a new unknown often makes the equation separable. For $y' = (ax + by)^2$, letting $v = ax + by$ gives $\\frac{dv}{dx} = a + b y' = a + b v^2$, which is separable.",
        "当右边只依赖于变量的某个线性组合时，把这个组合设为新的未知函数，方程常常变为可分离变量的。对于 $y' = (ax + by)^2$，令 $v = ax + by$ 可得 $\\frac{dv}{dx} = a + b y' = a + b v^2$，方程化为可分离变量形式。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const b = rng.int(1, 5);
        const v0 = rng.int(1, 4);
        const ans = a + b * v0 * v0;

        const prompt = t(
          `Under the substitution $v = ${poly([a, "x"])} + ${poly([b, "y"])}$, the equation $y' = (${poly([a, "x"])} + ${poly([b, "y"])})^2$ transforms into $\\frac{dv}{dx} = g(v)$. Evaluate $g(${v0})$.`,
          `通过变量代换 $v = ${poly([a, "x"])} + ${poly([b, "y"])}$，方程 $y' = (${poly([a, "x"])} + ${poly([b, "y"])})^2$ 化为 $\\frac{dv}{dx} = g(v)$。计算 $g(${v0})$ 的值。`,
        );
        const solution = t(
          steps(
            `Differentiate $v = ${poly([a, "x"])} + ${poly([b, "y"])}$ with respect to $x$: $\\frac{dv}{dx} = ${a} + ${b}\\frac{dy}{dx}$.`,
            `Substitute $y' = v^2$: $\\frac{dv}{dx} = ${a} + ${b}v^2 = g(v)$.`,
            `Evaluate at $v = ${v0}$: $g(${v0}) = ${a} + ${b}(${v0})^2 = ${a} + ${b}(${v0 * v0}) = ${ans}$.`,
          ),
          steps(
            `对 $v = ${poly([a, "x"])} + ${poly([b, "y"])}$ 关于 $x$ 求导：$\\frac{dv}{dx} = ${a} + ${b}\\frac{dy}{dx}$。`,
            `代入 $y' = v^2$：$\\frac{dv}{dx} = ${a} + ${b}v^2 = g(v)$。`,
            `代入 $v = ${v0}$ 求值：$g(${v0}) = ${a} + ${b}(${v0})^2 = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a * v0 * v0, ans + b, ans - a],
        });
      },
    },
    {
      id: "solving-an-initial-value-problem-by-a-linear-substitution",
      title: t("Solving an initial value problem by a linear substitution", "用线性代换求解初值问题"),
      explanation: t(
        "For $y' = (ax + y)^{2} - a$, let $v = ax + y$. Then $v' = a + y' = v^{2}$, which separates:\n\n$$-\\frac{1}{v} = x + C \\implies v = \\frac{v_0}{1 - v_0x}, \\qquad v_0 = v(0) = y(0).$$\n\nFinally undo the substitution, $y = v - ax$. Forgetting to subtract $ax$ at the end is the usual slip.",
        "对 $y' = (ax + y)^{2} - a$，令 $v = ax + y$。则 $v' = a + y' = v^{2}$，可分离变量：\n\n$$-\\frac{1}{v} = x + C \\implies v = \\frac{v_0}{1 - v_0x}, \\qquad v_0 = v(0) = y(0).$$\n\n最后还原代换，$y = v - ax$。最后忘记减去 $ax$ 是常见错误。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const y0 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const m = rng.int(Math.abs(y0) + 1, Math.abs(y0) + 5);
        const x1 = Q.of(1, m);
        const v = Q.of(y0).div(Q.one.sub(Q.of(y0).mul(x1)));
        const ans = v.sub(Q.of(a).mul(x1));
        const ax = a === 1 ? "x" : `${a}x`;
        return numberProblem({
          prompt: t(
            `Solve $y' = (${ax} + y)^{2} - ${a}$ with $y(0) = ${y0}$, and find $y\\left(\\frac{1}{${m}}\\right)$.`,
            `求解 $y' = (${ax} + y)^{2} - ${a}$，$y(0) = ${y0}$，并求 $y\\left(\\frac{1}{${m}}\\right)$。`,
          ),
          answer: ans,
          wrong: [
            v,
            Q.of(y0)
              .div(Q.one.add(Q.of(y0).mul(x1)))
              .sub(Q.of(a).mul(x1)),
            Q.of(y0).sub(Q.of(a).mul(x1)),
          ].filter((w) => !w.eq(ans)),
          solution: t(
            steps(
              `With $v = ${ax} + y$, $v' = v^{2}$ and $v(0) = ${y0}$, so $v = \\frac{${y0}}{1 ${y0 > 0 ? "-" : "+"} ${Math.abs(y0) === 1 ? "" : Math.abs(y0)}x}$.`,
              `At $x = \\frac{1}{${m}}$: $v = ${v.toLatex()}$, so $y = v - ${a} \\cdot \\frac{1}{${m}} = ${ans.toLatex()}$.`,
            ),
            steps(
              `令 $v = ${ax} + y$，则 $v' = v^{2}$，$v(0) = ${y0}$，所以 $v = \\frac{${y0}}{1 ${y0 > 0 ? "-" : "+"} ${Math.abs(y0) === 1 ? "" : Math.abs(y0)}x}$。`,
              `当 $x = \\frac{1}{${m}}$ 时 $v = ${v.toLatex()}$，所以 $y = v - ${a} \\cdot \\frac{1}{${m}} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** furtherSolvingFirstOrderOdesBySubstitution applies nonlinear substitutions. */
export const furtherSolvingFirstOrderOdesBySubstitution: TopicDef = {
  id: "further-solving-first-order-odes-by-substitution",
  title: t("Further Solving First-Order ODEs by Substitution", "变量代换法的深入应用"),
  summary: t(
    "Nonlinear substitutions such as $u = \\ln y$ or $u = y^2$ turn harder equations into separable or linear ones.",
    "非线性代换（如 $u = \\ln y$ 或 $u = y^2$）把较难的方程化为可分离或线性方程。",
  ),
  prerequisites: ["solving-first-order-odes-by-substitution"],
  encompasses: [{ topic: "solving-first-order-odes-by-substitution", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "logarithmic-and-power-substitutions",
      title: t("Logarithmic and power substitutions", "对数与幂次变量代换技巧"),
      explanation: t(
        "A substitution is useful when the derivative of the new unknown turns the equation into a form you already know how to solve, such as a linear equation. For $y' = y(a - b \\ln y)$, setting $u = \\ln y$ gives $u' = \\frac{y'}{y} = a - b u$, which is linear and separable.",
        "当新未知函数的导数能把方程化成已经会解的形式（例如线性方程）时，这种换元就很有用。对于方程 $y' = y(a - b \\ln y)$，令 $u = \\ln y$ 可得 $u' = \\frac{y'}{y} = a - b u$，方程转化为线性且可分离形式。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.int(2, 6);
        const k = rng.int(2, 6);
        const a = k * b;
        const u0 = rng.int(1, 5);
        const ans = a - b * u0;

        const prompt = t(
          `Let $u = \\ln y$. The equation $y' = y(${a} - ${b}\\ln y)$ transforms into $u' = h(u)$. Evaluate $h(${u0})$.`,
          `令 $u = \\ln y$。微分方程 $y' = y(${a} - ${b}\\ln y)$ 变换为 $u' = h(u)$。计算 $h(${u0})$ 的值。`,
        );
        const solution = t(
          steps(
            `Differentiate $u = \\ln y$: $u' = \\frac{y'}{y}$.`,
            `Substitute $y' = y(${a} - ${b}\\ln y)$: $u' = \\frac{y(${a} - ${b}\\ln y)}{y} = ${a} - ${b}u = h(u)$.`,
            `Evaluate at $u = ${u0}$: $h(${u0}) = ${a} - ${b}(${u0}) = ${ans}$.`,
          ),
          steps(
            `对 $u = \\ln y$ 求导：$u' = \\frac{y'}{y}$。`,
            `代入 $y'$ 的表达式：$u' = ${a} - ${b}\\ln y = ${a} - ${b}u = h(u)$。`,
            `代入 $u = ${u0}$ 求值：$h(${u0}) = ${a} - ${b}(${u0}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a + b * u0, ans + b, -ans],
        });
      },
    },
    {
      id: "the-long-run-behavior-after-a-logarithmic-substitution",
      title: t("The long-run behavior after a logarithmic substitution", "对数代换后的长期行为"),
      explanation: t(
        "For $y' = y(a - b\\ln y)$ with $y > 0$, the substitution $u = \\ln y$ gives $u' = \\frac{y'}{y} = a - bu$, a linear equation with solution $u = \\frac{a}{b} + Ce^{-bx}$.\n\nFor $b > 0$ the exponential dies out, so $\\ln y \\to \\frac{a}{b}$ and $y \\to e^{a/b}$ whatever the positive starting value. This is the Gompertz growth law.",
        "对 $y > 0$ 的 $y' = y(a - b\\ln y)$，代换 $u = \\ln y$ 得 $u' = \\frac{y'}{y} = a - bu$，这是线性方程，解为 $u = \\frac{a}{b} + Ce^{-bx}$。\n\n当 $b > 0$ 时指数项消失，所以无论正初值是多少，都有 $\\ln y \\to \\frac{a}{b}$，$y \\to e^{a/b}$。这就是冈珀茨增长律。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-6, 12) || 5;
        let b = rng.int(2, 8);
        if (Math.abs(a) === b) b += 1;
        const y0 = rng.int(1, 9);
        const ans = Q.of(a, b);
        return numberProblem({
          prompt: t(
            `$y > 0$ satisfies $y' = y(${a} - ${b}\\ln y)$ with $y(0) = ${y0}$. Find $\\lim_{x \\to \\infty} \\ln y(x)$.`,
            `$y > 0$ 满足 $y' = y(${a} - ${b}\\ln y)$，$y(0) = ${y0}$。求 $\\lim_{x \\to \\infty} \\ln y(x)$。`,
          ),
          answer: ans,
          wrong: [Q.of(a), Q.of(b, a), ans.neg()].filter((v) => !v.eq(ans)),
          solution: t(
            steps(
              `With $u = \\ln y$, $u' = ${a} - ${b}u$, so $u = ${ans.toLatex()} + Ce^{-${b}x}$.`,
              `Since $e^{-${b}x} \\to 0$, $\\ln y \\to ${ans.toLatex()}$, independent of $y(0) = ${y0}$.`,
            ),
            steps(
              `令 $u = \\ln y$，则 $u' = ${a} - ${b}u$，所以 $u = ${ans.toLatex()} + Ce^{-${b}x}$。`,
              `由于 $e^{-${b}x} \\to 0$，$\\ln y \\to ${ans.toLatex()}$，与 $y(0) = ${y0}$ 无关。`,
            ),
          ),
        });
      },
    },
  ],
};

/** reducingOdesToFirstOrderLinearBySubstitution reduces equations to linear form. */
export const reducingOdesToFirstOrderLinearBySubstitution: TopicDef = {
  id: "reducing-odes-to-first-order-linear-by-substitution",
  title: t("Reducing ODEs to First-Order Linear by Substitution", "通过代换将微分方程化为一阶线性方程"),
  summary: t(
    "Differential equations of the form f'(y) y' + P(x) f(y) = Q(x) transform directly into linear ODEs v' + P(x) v = Q(x) via v = f(y).",
    "形如 f'(y) y' + P(x) f(y) = Q(x) 的微分方程通过变量代换 v = f(y) 可直接化为一阶线性常微分方程 v' + P(x) v = Q(x)。",
  ),
  prerequisites: ["further-solving-first-order-odes-by-substitution"],
  encompasses: [
    {
      topic: "further-solving-first-order-odes-by-substitution",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "transforming-to-linear-form-via-functional-substitutions",
      title: t("Transforming to linear form via functional substitutions", "利用函数代换化为一阶线性微分方程"),
      explanation: t(
        "If one expression and its derivative both appear in the equation, letting that expression be the new unknown makes the equation linear. For $e^y y' + a e^y = b$, setting $v = e^y$ yields $v' + a v = b$. The steady-state value of $v$ as $x \\to \\infty$ is $\\frac{b}{a}$.",
        "如果某个式子及其导数都出现在方程中，把这个式子设为新的未知函数，方程就变成线性的。对于方程 $e^y y' + a e^y = b$，令 $v = e^y$ 得 $v' + a v = b$。当 $x \\to \\infty$ 时 $v$ 的稳态值为 $\\frac{b}{a}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const k = rng.int(2, 7);
        const b = a * k;
        const ans = k;

        const prompt = t(
          `Under the substitution $v = e^y$, the equation $e^y y' + ${a}e^y = ${b}$ transforms into a linear equation in $v$. Find the steady-state limit $\\lim_{x \\to \\infty} v(x)$.`,
          `通过变量代换 $v = e^y$，方程 $e^y y' + ${a}e^y = ${b}$ 化为关于 $v$ 的线性方程。求 $\\lim_{x \\to \\infty} v(x)$ 的稳态极限值。`,
        );
        const solution = t(
          steps(
            `Let $v = e^y$. Differentiating gives $v' = e^y y'$.`,
            `Substitute into the ODE: $v' + ${a}v = ${b}$.`,
            `This is a linear first-order ODE with steady-state solution $v_{\\text{steady}} = \\frac{${b}}{${a}} = ${k}$.`,
          ),
          steps(
            `设 $v = e^y$。求导得 $v' = e^y y'$。`,
            `代入原方程得：$v' + ${a}v = ${b}$。`,
            `这是一阶线性方程，其稳态常数解为 $v_{\\text{steady}} = \\frac{${b}}{${a}} = ${k}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [b, a, ans + a],
        });
      },
    },
    {
      id: "solving-with-the-substitution-v-equals-y-squared",
      title: t("Solving with the substitution $v = y^{2}$", "用代换 $v = y^{2}$ 求解"),
      explanation: t(
        "Since $(y^{2})' = 2yy'$, the equation $2yy' + ay^{2} = b$ becomes $v' + av = b$ for $v = y^{2}$. Its solution is\n\n$$v = \\frac{b}{a} + \\left(y_0^{2} - \\frac{b}{a}\\right)e^{-ax},$$\n\nand $y = \\sqrt{v}$ for a positive solution. Remember that the initial value of $v$ is $y_0^{2}$, not $y_0$.",
        "由于 $(y^{2})' = 2yy'$，令 $v = y^{2}$，方程 $2yy' + ay^{2} = b$ 化为 $v' + av = b$。其解为\n\n$$v = \\frac{b}{a} + \\left(y_0^{2} - \\frac{b}{a}\\right)e^{-ax},$$\n\n对正解有 $y = \\sqrt{v}$。注意 $v$ 的初值是 $y_0^{2}$，而不是 $y_0$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 5);
        const y0 = rng.int(2, 6);
        // k = y0^2 would be the constant solution, with no exponential term left to halve.
        const k = rng.pick([1, 2, 3, 5, 6, 7, 8, 10, 11, 12].filter((v) => v !== y0 * y0));
        const ans = Q.of(k + y0 * y0, 2);
        return numberProblem({
          prompt: t(
            `$y > 0$ satisfies $2yy' + ${a === 1 ? "" : a}y^{2} = ${a * k}$ with $y(0) = ${y0}$. Find $\\left[y\\left(\\frac{\\ln 2}{${a}}\\right)\\right]^{2}$.`,
            `$y > 0$ 满足 $2yy' + ${a === 1 ? "" : a}y^{2} = ${a * k}$，$y(0) = ${y0}$。求 $\\left[y\\left(\\frac{\\ln 2}{${a}}\\right)\\right]^{2}$。`,
          ),
          answer: ans,
          wrong: [Q.of(k + y0, 2), Q.of(k), Q.of(y0 * y0, 2)].filter((v) => !v.eq(ans)),
          solution: t(
            steps(
              `With $v = y^{2}$: $v' + ${a}v = ${a * k}$, $v(0) = ${y0 * y0}$, so $v = ${k} + ${par(y0 * y0 - k)}e^{-${a}x}$.`,
              `At $x = \\frac{\\ln 2}{${a}}$, $e^{-${a}x} = \\frac{1}{2}$, so $y^{2} = v = ${k} + \\frac{${y0 * y0 - k}}{2} = ${ans.toLatex()}$.`,
            ),
            steps(
              `令 $v = y^{2}$：$v' + ${a}v = ${a * k}$，$v(0) = ${y0 * y0}$，所以 $v = ${k} + ${par(y0 * y0 - k)}e^{-${a}x}$。`,
              `当 $x = \\frac{\\ln 2}{${a}}$ 时 $e^{-${a}x} = \\frac{1}{2}$，所以 $y^{2} = v = ${k} + \\frac{${y0 * y0 - k}}{2} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 1.2 Special First-Order Equations
// ---------------------------------------------------------------------------

/** homogeneousFunctions defines f(tx, ty) = t^n f(x, y). */
export const homogeneousFunctions: TopicDef = {
  id: "homogeneous-functions",
  title: t("Homogeneous Functions", "齐次函数"),
  summary: t(
    "A function $f(x, y)$ is homogeneous of degree $n$ if $f(tx, ty) = t^n f(x, y)$ for all $t > 0$.",
    "若对任意 $t > 0$ 都有 $f(tx, ty) = t^n f(x, y)$，则称 $f(x, y)$ 为 $n$ 次齐次函数。",
  ),
  prerequisites: ["introduction-to-first-order-linear-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "determining-the-degree-of-homogeneity",
      title: t("Determining the degree of homogeneity", "确定多项式齐次函数的齐次次数"),
      explanation: t(
        "A function is homogeneous of some degree when scaling both inputs by the same factor scales the output by a fixed power of that factor. For $f(x, y) = a x^p y^q + b x^{p+q}$, scaling by $t$ gives $f(tx, ty) = a (tx)^p (ty)^q + b (tx)^{p+q} = t^{p+q} f(x, y)$, so the degree of homogeneity is $n = p + q$.",
        "如果把两个自变量都乘以同一个因子时，函数值乘以这个因子的固定次幂，那么函数就是该次齐次的。对于 $f(x, y) = a x^p y^q + b x^{p+q}$，代入缩放系数 $t$ 得 $f(tx, ty) = t^{p+q} f(x, y)$，因此其齐次次数为 $n = p + q$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(1, 5);
        const q = rng.int(1, 5);
        const n = p + q;
        const a = rng.int(2, 7);
        const b = rng.int(2, 7);
        const monomial = `${a}x${p === 1 ? "" : `^{${p}}`}y${q === 1 ? "" : `^{${q}}`}`;

        const prompt = t(
          `Determine the degree of homogeneity $n$ of the function $f(x, y) = ${monomial} + ${poly([b, "x"])}^{${n}}$.`,
          `确定函数 $f(x, y) = ${monomial} + ${poly([b, "x"])}^{${n}}$ 的齐次次数 $n$。`,
        );
        const solution = t(
          steps(
            `Substitute $tx$ for $x$ and $ty$ for $y$: $f(tx, ty) = ${a}(tx)^{${p}}(ty)^{${q}} + ${b}(tx)^{${n}}$.`,
            `Factor out powers of $t$: $f(tx, ty) = t^{${p}+${q}}(${monomial}) + t^{${n}}(${poly([b, "x"])}^{${n}}) = t^{${n}} f(x, y)$.`,
            `By definition of homogeneity, the degree is $n = ${n}$.`,
          ),
          steps(
            `将 $x$ 替换为 $tx$，$y$ 替换为 $ty$：$f(tx, ty) = ${a}(tx)^{${p}}(ty)^{${q}} + ${b}(tx)^{${n}}$。`,
            `提取 $t$ 的公因子：$f(tx, ty) = t^{${p}+${q}}(${monomial}) + t^{${n}}(${poly([b, "x"])}^{${n}}) = t^{${n}} f(x, y)$。`,
            `根据齐次函数定义，其齐次次数为 $n = ${n}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: n,
          wrong: [p, q, n + 1],
        });
      },
    },
    {
      id: "scaling-a-homogeneous-function",
      title: t("Scaling a homogeneous function", "齐次函数的缩放"),
      explanation: t(
        "If $f$ is homogeneous of degree $n$, one value fixes $f$ along the whole ray through that point: $f(tx, ty) = t^{n}f(x, y)$. For example, if $f$ has degree $3$ and $f(1, 2) = 5$, then $f(2, 4) = 2^{3} \\cdot 5 = 40$. The degree may be negative or zero; degree $0$ means $f$ is constant along rays, which is exactly the case $f(x, y) = F\\left(\\frac{y}{x}\\right)$.",
        "若 $f$ 是 $n$ 次齐次函数，一个函数值就确定了 $f$ 在过该点的整条射线上的值：$f(tx, ty) = t^{n}f(x, y)$。例如，若 $f$ 为 $3$ 次且 $f(1, 2) = 5$，则 $f(2, 4) = 2^{3} \\cdot 5 = 40$。次数可以是负数或零；$0$ 次意味着 $f$ 沿射线为常数，这正是 $f(x, y) = F\\left(\\frac{y}{x}\\right)$ 的情形。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(-2, 4);
        const tq = rng.pick([Q.of(2), Q.of(3), Q.of(1, 2), Q.of(-2)]);
        const x0 = rng.int(1, 4);
        const y0 = rng.int(-3, 5);
        const c = rng.int(-6, 9) || 4;
        const ans = tq.pow(n).mul(Q.of(c));
        const sx = tq.mul(Q.of(x0));
        const sy = tq.mul(Q.of(y0));
        const scale = n === 1 ? "t" : `t^{${n}}`;
        const power = n === 1 ? tq.toLatex() : `\\left(${tq.toLatex()}\\right)^{${n}}`;
        return numberProblem({
          prompt: t(
            `$f(x, y)$ is homogeneous of degree $${n}$ in the sense $f(tx, ty) = ${scale}f(x, y)$ for all $t \\ne 0$, and $f(${x0}, ${y0}) = ${c}$. Find $f(${sx.toLatex()}, ${sy.toLatex()})$.`,
            `$f(x, y)$ 是 $${n}$ 次齐次函数，即对所有 $t \\ne 0$ 有 $f(tx, ty) = ${scale}f(x, y)$，且 $f(${x0}, ${y0}) = ${c}$。求 $f(${sx.toLatex()}, ${sy.toLatex()})$。`,
          ),
          answer: ans,
          wrong: [tq.mul(Q.of(c)), tq.pow(n + 1).mul(Q.of(c)), Q.of(n).mul(tq).mul(Q.of(c))].filter((v) => !v.eq(ans)),
          solution: t(
            `$(${sx.toLatex()}, ${sy.toLatex()}) = t(${x0}, ${y0})$ with $t = ${tq.toLatex()}$, so $f = ${power} \\cdot ${par(c)} = ${ans.toLatex()}$.`,
            `$(${sx.toLatex()}, ${sy.toLatex()}) = t(${x0}, ${y0})$，其中 $t = ${tq.toLatex()}$，所以 $f = ${power} \\cdot ${par(c)} = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** homogeneousFirstOrderOdes solves y' = F(y/x) using y = vx. */
export const homogeneousFirstOrderOdes: TopicDef = {
  id: "homogeneous-first-order-odes",
  title: t("Homogeneous First-Order ODEs", "一阶齐次常微分方程"),
  summary: t(
    "If dy/dx = F(y/x), the substitution y = v x converts the ODE into separable form x dv/dx = F(v) - v.",
    "若 dy/dx = F(y/x)，通过代换 y = v x 可将方程转化为可分离变量形式 x dv/dx = F(v) - v。",
  ),
  prerequisites: ["homogeneous-functions"],
  encompasses: [{ topic: "homogeneous-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "solving-homogeneous-odes-via-v-substitution",
      title: t("Solving homogeneous ODEs via v-substitution", "利用 y = vx 代换解一阶齐次方程"),
      explanation: t(
        "In a homogeneous equation the slope depends only on the ratio of the variables, so writing the unknown as that ratio times the variable makes the equation separable. For $x y' = y + k \\frac{y^2}{x}$, setting $y = v x$ gives $x v' + v = v + k v^2$, so $x \\frac{dv}{dx} = k v^2$. Separating variables yields $-\\frac{1}{v} = k \\ln|x| + C$.",
        "在齐次方程中，斜率只取决于变量之比，所以把未知函数写成这个比值乘以自变量，方程就变为可分离变量的。对于方程 $x y' = y + k \\frac{y^2}{x}$，令 $y = v x$ 得 $x v' + v = v + k v^2$，化简为 $x \\frac{dv}{dx} = k v^2$。分离变量积分得 $-\\frac{1}{v} = k \\ln|x| + C$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 7);
        const c = rng.int(2, 8);
        const ans = c;

        const prompt = t(
          `Under the substitution $y = v x$, the homogeneous equation $x y' = y + ${k}\\frac{y^2}{x}$ integrates to $-\\frac{1}{v} = ${k}\\ln x + C$ (for $x > 0$). If $y(1) = \\frac{1}{${c}}$, find the value of the constant $-C$.`,
          `通过变量代换 $y = v x$，齐次方程 $x y' = y + ${k}\\frac{y^2}{x}$ 积分得通解 $-\\frac{1}{v} = ${k}\\ln x + C$（$x > 0$）。若初始条件为 $y(1) = \\frac{1}{${c}}$，求常数 $-C$ 的值。`,
        );
        const solution = t(
          steps(
            `At $x = 1$, the substitution gives $v(1) = \\frac{y(1)}{1} = \\frac{1}{${c}}$.`,
            `Substitute $x = 1$ and $v = \\frac{1}{${c}}$ into the solution: $-\\frac{1}{1/${c}} = ${k}\\ln(1) + C$.`,
            `Since $\\ln(1) = 0$, $-${c} = 0 + C \\implies C = -${c}$.`,
            `Therefore, $-C = ${ans}$.`,
          ),
          steps(
            `当 $x = 1$ 时，由代换关系得 $v(1) = \\frac{y(1)}{1} = \\frac{1}{${c}}$。`,
            `将 $x = 1$ 与 $v = \\frac{1}{${c}}$ 代入通解：$-\\frac{1}{1/${c}} = ${k}\\ln(1) + C$。`,
            `由于 $\\ln(1) = 0$，得 $-${c} = C \\implies C = -${c}$。`,
            `因此 $-C = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [k, c + 1, k * c],
        });
      },
    },
    {
      id: "solving-a-homogeneous-initial-value-problem",
      title: t("Solving a homogeneous initial value problem", "求解齐次初值问题"),
      explanation: t(
        "Every term on the right has degree two, so the equation depends only on the ratio $\\frac{y}{x}$ and the substitution $y = vx$ separates it. For $xyy' = ax^{2} + y^{2}$ on $x > 0$, put $y = vx$, so $y' = v + xv'$. Dividing by $x^{2}$ gives $v(v + xv') = a + v^{2}$, that is $vv' = \\frac{a}{x}$. Integrating,\n\n$$\\frac{v^{2}}{2} = a\\ln x + C \\implies \\left(\\frac{y}{x}\\right)^{2} = 2a\\ln x + v_0^{2},$$\n\nwhere $v_0 = y(1)$. At $x = e^{k}$ this is $2ak + v_0^{2}$.",
        "右边每一项都是二次的，所以方程只依赖于比值 $\\frac{y}{x}$，代换 $y = vx$ 可使其分离变量。对 $x > 0$ 上的 $xyy' = ax^{2} + y^{2}$，令 $y = vx$，则 $y' = v + xv'$。两边除以 $x^{2}$ 得 $v(v + xv') = a + v^{2}$，即 $vv' = \\frac{a}{x}$。积分得\n\n$$\\frac{v^{2}}{2} = a\\ln x + C \\implies \\left(\\frac{y}{x}\\right)^{2} = 2a\\ln x + v_0^{2},$$\n\n其中 $v_0 = y(1)$。在 $x = e^{k}$ 处其值为 $2ak + v_0^{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const c = rng.int(1, 5);
        const k = rng.int(1, 4);
        const ans = 2 * a * k + c * c;
        const ek = k === 1 ? "e" : `e^{${k}}`;
        return numberProblem({
          prompt: t(
            `For $x > 0$, $y$ satisfies $xy\\,y' = ${a === 1 ? "" : a}x^{2} + y^{2}$ with $y(1) = ${c}$. Find $\\left(\\frac{y(${ek})}{${ek}}\\right)^{2}$.`,
            `在 $x > 0$ 上，$y$ 满足 $xy\\,y' = ${a === 1 ? "" : a}x^{2} + y^{2}$，$y(1) = ${c}$。求 $\\left(\\frac{y(${ek})}{${ek}}\\right)^{2}$。`,
          ),
          answer: ans,
          wrong: [a * k + c * c, 2 * a * k + c, 2 * a + c * c].filter((w) => w !== ans),
          solution: t(
            steps(
              `With $y = vx$: $vv' = \\frac{${a}}{x}$, so $v^{2} = ${2 * a}\\ln x + C$; $v(1) = ${c}$ gives $C = ${c * c}$.`,
              `At $x = ${ek}$: $v^{2} = ${2 * a} \\cdot ${k} + ${c * c} = ${ans}$.`,
            ),
            steps(
              `令 $y = vx$：$vv' = \\frac{${a}}{x}$，所以 $v^{2} = ${2 * a}\\ln x + C$；由 $v(1) = ${c}$ 得 $C = ${c * c}$。`,
              `在 $x = ${ek}$ 处：$v^{2} = ${2 * a} \\cdot ${k} + ${c * c} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** exactDifferentialEquations tests ∂M/∂y = ∂N/∂x. */
export const exactDifferentialEquations: TopicDef = {
  id: "exact-differential-equations",
  title: t("Exact Differential Equations", "恰当微分方程"),
  summary: t(
    "A differential form M(x, y) dx + N(x, y) dy = 0 is exact if and only if ∂M/∂y = ∂N/∂x, stemming from a potential function Ψ(x, y) = C.",
    "微分形式 M(x, y) dx + N(x, y) dy = 0 恰当当且仅当 ∂M/∂y = ∂N/∂x，其解由势函数 Ψ(x, y) = C 给出。",
  ),
  prerequisites: ["gradient-vector-fields"],
  encompasses: [{ topic: "gradient-vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "exactness-condition-and-mixed-partials",
      title: t("Exactness condition and mixed partials", "恰当微分方程的判别条件与混合偏导数"),
      explanation: t(
        "An equation is exact when its left side is the total differential of some function, and equal mixed partial derivatives are the test for this. For $M(x, y) dx + N(x, y) dy = 0$, exactness requires $\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$. If $M(x, y) = 2a x y + b y^2$, then $\\frac{\\partial M}{\\partial y} = 2a x + 2b y$.",
        "当方程的左边是某个函数的全微分时，方程是恰当的，检验方法是看混合偏导数是否相等。对于 $M(x, y) dx + N(x, y) dy = 0$，恰当性条件为 $\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$。若 $M(x, y) = 2a x y + b y^2$，则 $\\frac{\\partial M}{\\partial y} = 2a x + 2b y$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const x0 = rng.int(1, 5);
        const y0 = rng.int(1, 5);
        const ans = 2 * a * x0 + 2 * b * y0;

        const prompt = t(
          `For the differential equation $(${poly([2 * a, "xy"])} + ${poly([b, "y^2"])})\\,dx + (${poly([a, "x^2"])} + ${poly([2 * b, "xy"])})\\,dy = 0$, evaluate the partial derivative $\\frac{\\partial M}{\\partial y}$ at $(x, y) = (${x0}, ${y0})$.`,
          `对于微分方程 $(${poly([2 * a, "xy"])} + ${poly([b, "y^2"])})\\,dx + (${poly([a, "x^2"])} + ${poly([2 * b, "xy"])})\\,dy = 0$，计算偏导数 $\\frac{\\partial M}{\\partial y}$ 在点 $(x, y) = (${x0}, ${y0})$ 处的值。`,
        );
        const solution = t(
          steps(
            `Identify $M(x, y) = ${poly([2 * a, "xy"])} + ${poly([b, "y^2"])}$.`,
            `Differentiate with respect to $y$: $\\frac{\\partial M}{\\partial y} = ${poly([2 * a, "x"])} + ${poly([2 * b, "y"])}$.`,
            `Evaluate at $(${x0}, ${y0})$: $${2 * a}(${x0}) + ${2 * b}(${y0}) = ${2 * a * x0} + ${2 * b * y0} = ${ans}$.`,
          ),
          steps(
            `确定 $M(x, y) = ${poly([2 * a, "xy"])} + ${poly([b, "y^2"])}$。`,
            `对 $y$ 求偏导：$\\frac{\\partial M}{\\partial y} = ${poly([2 * a, "x"])} + ${poly([2 * b, "y"])}$。`,
            `代入点 $(${x0}, ${y0})$：$${2 * a}(${x0}) + ${2 * b}(${y0}) = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + 2, 2 * a * x0, 2 * b * y0],
        });
      },
    },
    {
      id: "finding-the-potential-function-of-an-exact-equation",
      title: t("Finding the potential function of an exact equation", "求恰当方程的势函数"),
      explanation: t(
        "When $M\\,dx + N\\,dy = 0$ is exact, find $\\Psi$ with $\\Psi_x = M$ and $\\Psi_y = N$: integrate $M$ in $x$, then add only the terms of $\\int N\\,dy$ that are missing. Solutions are the level curves $\\Psi(x, y) = C$, and the curve through $(x_0, y_0)$ has $C = \\Psi(x_0, y_0)$.\n\nFor $(2xy + 3)\\,dx + (x^{2} + 4y)\\,dy = 0$: $\\Psi = x^{2}y + 3x + 2y^{2}$. Adding $\\int M\\,dx$ and $\\int N\\,dy$ outright would count $x^{2}y$ twice.",
        "当 $M\\,dx + N\\,dy = 0$ 为恰当方程时，求满足 $\\Psi_x = M$、$\\Psi_y = N$ 的 $\\Psi$：先对 $x$ 积分 $M$，再只补上 $\\int N\\,dy$ 中缺少的项。解是等值线 $\\Psi(x, y) = C$，过 $(x_0, y_0)$ 的曲线有 $C = \\Psi(x_0, y_0)$。\n\n对 $(2xy + 3)\\,dx + (x^{2} + 4y)\\,dy = 0$：$\\Psi = x^{2}y + 3x + 2y^{2}$。直接把 $\\int M\\,dx$ 与 $\\int N\\,dy$ 相加会把 $x^{2}y$ 算两次。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.int(-6, 6) || 3;
        const c = rng.int(1, 3);
        const x0 = rng.int(-3, 3) || 2;
        const y0 = rng.int(-3, 3) || -1;
        const ans = a * x0 * x0 * y0 + b * x0 + c * y0 * y0;
        const ax2 = a === 1 ? "x^{2}" : `${a}x^{2}`;
        return numberProblem({
          prompt: t(
            `The equation $(${2 * a}xy ${signed(b)})\\,dx + (${ax2} + ${2 * c}y)\\,dy = 0$ is exact. Its solution through $(${x0}, ${y0})$ is $\\Psi(x, y) = C$, where $\\Psi$ has no constant term. Find $C$.`,
            `方程 $(${2 * a}xy ${signed(b)})\\,dx + (${ax2} + ${2 * c}y)\\,dy = 0$ 是恰当方程。它过 $(${x0}, ${y0})$ 的解为 $\\Psi(x, y) = C$，其中 $\\Psi$ 不含常数项。求 $C$。`,
          ),
          answer: ans,
          wrong: [ans + a * x0 * x0 * y0, ans - b * x0, a * x0 * x0 * y0 + c * y0 * y0 + 2 * b * x0].filter((w) => w !== ans),
          solution: t(
            steps(
              `$\\int M\\,dx = ${ax2}y ${signed(b)}x$; differentiating in $y$ gives $${ax2}$, so the missing part of $N$ is $${2 * c}y$, contributing $${c === 1 ? "" : c}y^{2}$.`,
              `$\\Psi = ${ax2}y ${signed(b)}x + ${c === 1 ? "" : c}y^{2}$, and $C = \\Psi(${x0}, ${y0}) = ${a * x0 * x0 * y0} ${signed(b * x0)} + ${c * y0 * y0} = ${ans}$.`,
            ),
            steps(
              `$\\int M\\,dx = ${ax2}y ${signed(b)}x$；对 $y$ 求导得 $${ax2}$，所以 $N$ 中缺少的部分是 $${2 * c}y$，贡献 $${c === 1 ? "" : c}y^{2}$。`,
              `$\\Psi = ${ax2}y ${signed(b)}x + ${c === 1 ? "" : c}y^{2}$，$C = \\Psi(${x0}, ${y0}) = ${a * x0 * x0 * y0} ${signed(b * x0)} + ${c * y0 * y0} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingExactOdesUsingIntegratingFactors finds μ(x) = exp(∫(My - Nx)/N dx). */
export const solvingExactOdesUsingIntegratingFactors: TopicDef = {
  id: "solving-exact-odes-using-integrating-factors",
  title: t("Solving Exact ODEs Using Integrating Factors", "积分因子法解非恰当方程"),
  summary: t(
    "When $\\frac{M_y - N_x}{N} = f(x)$ depends only on $x$, multiplying by $\\mu(x) = \\exp\\left(\\int f(x)\\,dx\\right)$ makes the equation exact.",
    "当 $\\frac{M_y - N_x}{N} = f(x)$ 只与 $x$ 有关时，乘以积分因子 $\\mu(x) = \\exp\\left(\\int f(x)\\,dx\\right)$ 可使方程成为恰当方程。",
  ),
  prerequisites: ["exact-differential-equations"],
  encompasses: [{ topic: "exact-differential-equations", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "integrating-factors-as-functions-of-a-single-variable",
      title: t("Integrating factors as functions of a single variable", "一元积分因子的构造准则"),
      explanation: t(
        "When the expression that measures the failure of exactness depends on one variable alone, an integrating factor depending on that variable will fix it. If $\\frac{M_y - N_x}{N} = \\frac{k}{x}$, then the integrating factor making the equation exact is $\\mu(x) = e^{\\int \\frac{k}{x}dx} = x^k$.",
        "当衡量不恰当程度的式子只依赖于一个变量时，用只依赖于该变量的积分因子就能使方程恰当。若 $\\frac{M_y - N_x}{N} = \\frac{k}{x}$，则使方程变为恰当方程的积分因子为 $\\mu(x) = e^{\\int \\frac{k}{x}dx} = x^k$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 35);

        const prompt = t(
          `For a first-order differential equation $M\\,dx + N\\,dy = 0$, suppose $\\frac{M_y - N_x}{N} = \\frac{${k}}{x}$ (for $x > 0$). Find the power $p$ in the integrating factor $\\mu(x) = x^p$.`,
          `对于一阶微分方程 $M\\,dx + N\\,dy = 0$，已知 $\\frac{M_y - N_x}{N} = \\frac{${k}}{x}$（$x > 0$）。求积分因子 $\\mu(x) = x^p$ 中的幂指数 $p$。`,
        );
        const solution = t(
          steps(
            `Since $\\frac{M_y - N_x}{N}$ depends only on $x$, an integrating factor is given by $\\mu(x) = e^{\\int \\frac{M_y - N_x}{N}\\,dx}$.`,
            `Integrate: $\\int \\frac{${k}}{x}\\,dx = ${k}\\ln x$.`,
            `Compute the exponent: $\\mu(x) = e^{${k}\\ln x} = x^{${k}}$.`,
            `Therefore, the power is $p = ${k}$.`,
          ),
          steps(
            `因为 $\\frac{M_y - N_x}{N}$ 仅依赖于 $x$，积分因子由公式 $\\mu(x) = e^{\\int \\frac{M_y - N_x}{N}\\,dx}$ 给出。`,
            `积分计算：$\\int \\frac{${k}}{x}\\,dx = ${k}\\ln x$。`,
            `化简得：$\\mu(x) = e^{${k}\\ln x} = x^{${k}}$。`,
            `因此幂指数为 $p = ${k}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: k,
          wrong: [k + 1, k - 1, 2 * k],
        });
      },
    },
    {
      id: "solving-after-making-an-equation-exact",
      title: t("Solving after making an equation exact", "化为恰当方程后求解"),
      explanation: t(
        "For $(py + qx^{j})\\,dx + x\\,dy = 0$, $\\frac{M_y - N_x}{N} = \\frac{p - 1}{x}$, so $\\mu = x^{p-1}$. Multiplying gives the exact equation $(px^{p-1}y + qx^{j+p-1})\\,dx + x^{p}\\,dy = 0$ with potential\n\n$$\\Psi = x^{p}y + \\frac{q}{j + p}x^{j+p}.$$\n\nThe solution through a point keeps $\\Psi$ at its value there; solve $\\Psi = C$ for $y$ at the new $x$.",
        "对 $(py + qx^{j})\\,dx + x\\,dy = 0$，$\\frac{M_y - N_x}{N} = \\frac{p - 1}{x}$，所以 $\\mu = x^{p-1}$。相乘得恰当方程 $(px^{p-1}y + qx^{j+p-1})\\,dx + x^{p}\\,dy = 0$，势函数为\n\n$$\\Psi = x^{p}y + \\frac{q}{j + p}x^{j+p}.$$\n\n过某点的解使 $\\Psi$ 保持该点处的值；在新的 $x$ 处由 $\\Psi = C$ 解出 $y$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(2, 3);
        const j = rng.int(1, 2);
        const s = rng.int(1, 3);
        const q = s * (j + p);
        const y0 = rng.int(-4, 6);
        const C = y0 + s;
        const ans = Q.of(C - s * 2 ** (j + p), 2 ** p);
        const xj = j === 1 ? "x" : `x^{${j}}`;
        return numberProblem({
          prompt: t(
            `Make $(${p}y + ${q}${xj})\\,dx + x\\,dy = 0$ exact with an integrating factor $\\mu(x)$, and find $y(2)$ for the solution with $y(1) = ${y0}$.`,
            `用积分因子 $\\mu(x)$ 把 $(${p}y + ${q}${xj})\\,dx + x\\,dy = 0$ 化为恰当方程，并对满足 $y(1) = ${y0}$ 的解求 $y(2)$。`,
          ),
          answer: ans,
          wrong: [Q.of(C - s * 2 ** (j + p), 2), Q.of(y0, 2 ** p), Q.of(C, 2 ** p)].filter((v) => !v.eq(ans)),
          solution: t(
            steps(
              `$\\frac{M_y - N_x}{N} = \\frac{${p} - 1}{x}$, so $\\mu = x^{${p - 1}}$ and $\\Psi = x^{${p}}y + ${s === 1 ? "" : s}x^{${j + p}}$.`,
              `$C = \\Psi(1, ${y0}) = ${C}$. At $x = 2$: $${2 ** p}y + ${s * 2 ** (j + p)} = ${C}$, so $y(2) = ${ans.toLatex()}$.`,
            ),
            steps(
              `$\\frac{M_y - N_x}{N} = \\frac{${p} - 1}{x}$，所以 $\\mu = x^{${p - 1}}$，$\\Psi = x^{${p}}y + ${s === 1 ? "" : s}x^{${j + p}}$。`,
              `$C = \\Psi(1, ${y0}) = ${C}$。在 $x = 2$ 处：$${2 ** p}y + ${s * 2 ** (j + p)} = ${C}$，所以 $y(2) = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** bernoulliDifferentialEquations solves y' + P(x)y = Q(x)y^n via v = y^{1-n}. */
export const bernoulliDifferentialEquations: TopicDef = {
  id: "bernoulli-differential-equations",
  title: t("Bernoulli Differential Equations", "伯努利微分方程"),
  summary: t(
    "The substitution $v = y^{1-n}$ turns a Bernoulli equation $y' + P(x)y = Q(x)y^n$ into the linear equation $v' + (1 - n)P(x)v = (1 - n)Q(x)$.",
    "代换 $v = y^{1-n}$ 把伯努利方程 $y' + P(x)y = Q(x)y^n$ 化为线性方程 $v' + (1 - n)P(x)v = (1 - n)Q(x)$。",
  ),
  prerequisites: ["reducing-odes-to-first-order-linear-by-substitution"],
  encompasses: [
    {
      topic: "reducing-odes-to-first-order-linear-by-substitution",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "linearizing-bernoulli-equations",
      title: t("Linearizing Bernoulli equations", "伯努利方程的线性化变量代换"),
      explanation: t(
        "A Bernoulli equation is not linear because of the power of the unknown, but a substitution with a power of the unknown removes that term and leaves a linear equation. Dividing $y' + a y = b y^n$ by $y^n$ gives $y^{-n} y' + a y^{1-n} = b$. With $v = y^{1-n}$, $\\frac{dv}{dx} = (1-n) y^{-n} y'$, leading to $v' + (1-n) a v = (1-n) b$.",
        "伯努利方程因含未知函数的幂而不是线性的，但用未知函数的幂换元可以消去这一项，得到线性方程。将方程 $y' + a y = b y^n$ 同除以 $y^n$ 得 $y^{-n} y' + a y^{1-n} = b$。令 $v = y^{1-n}$，则 $v' = (1-n)y^{-n}y'$，方程化为 $v' + (1-n) a v = (1-n) b$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const n = rng.int(2, 6);
        const factor = 1 - n;
        const coeffV = factor * a;

        const prompt = t(
          `Under the substitution $v = y^{1 - ${n}}$, the Bernoulli equation $y' + ${poly([a, "y"])} = 4y^{${n}}$ transforms into $v' + C v = D$. Find the coefficient $C$ of $v$.`,
          `通过变量代换 $v = y^{1 - ${n}}$，伯努利方程 $y' + ${poly([a, "y"])} = 4y^{${n}}$ 转化为线性方程 $v' + C v = D$。求其中 $v$ 的系数 $C$。`,
        );
        const solution = t(
          steps(
            `Multiply the Bernoulli equation by $y^{-${n}}$: $y^{-${n}}y' + ${poly([a, "y^{1"])}-${n}} = 4$.`,
            `Let $v = y^{1-${n}}$. Differentiate: $v' = (1 - ${n})y^{-${n}}y' = ${poly([factor, "y"])}^{-${n}}y'$.`,
            `Multiply the entire equation by $(1 - ${n}) = ${factor}$: $v' + (${factor})(${a})v = (${factor})(4)$.`,
            `The coefficient of $v$ is $C = ${factor} \\times ${a} = ${coeffV}$.`,
          ),
          steps(
            `方程两端同乘 $y^{-${n}}$：$y^{-${n}}y' + ${poly([a, "y^{1"])}-${n}} = 4$。`,
            `令 $v = y^{1-${n}}$，求导得 $v' = (1 - ${n})y^{-${n}}y' = ${poly([factor, "y"])}^{-${n}}y'$。`,
            `原式同乘 $(1 - ${n}) = ${factor}$ 得：$v' + (${factor})(${a})v = (${factor})(4)$。`,
            `因此 $v$ 的系数为 $C = ${factor} \\times ${a} = ${coeffV}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: coeffV,
          wrong: [-coeffV, factor, a],
        });
      },
    },
    {
      id: "solving-a-bernoulli-initial-value-problem",
      title: t("Solving a Bernoulli initial value problem", "求解伯努利初值问题"),
      explanation: t(
        "For $y' + ay = by^{2}$ take $n = 2$, so $v = y^{-1}$ and $v' - av = -b$. Then\n\n$$v = \\frac{b}{a} + \\left(\\frac{1}{y_0} - \\frac{b}{a}\\right)e^{ax}, \\qquad y = \\frac{1}{v}.$$\n\nAt $x = \\frac{\\ln 2}{a}$ the exponential equals $2$, giving $v = \\frac{2}{y_0} - \\frac{b}{a}$. The last step, inverting $v$, is easy to forget.",
        "对 $y' + ay = by^{2}$ 取 $n = 2$，所以 $v = y^{-1}$，$v' - av = -b$。于是\n\n$$v = \\frac{b}{a} + \\left(\\frac{1}{y_0} - \\frac{b}{a}\\right)e^{ax}, \\qquad y = \\frac{1}{v}.$$\n\n在 $x = \\frac{\\ln 2}{a}$ 处指数项等于 $2$，得 $v = \\frac{2}{y_0} - \\frac{b}{a}$。最后一步取 $v$ 的倒数容易被遗忘。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const y0 = rng.int(1, 2);
        const b = rng.int(1, Math.floor((2 * a - 1) / y0));
        const ans = Q.of(a * y0, 2 * a - b * y0);
        const v = Q.of(2 * a - b * y0, a * y0);
        return numberProblem({
          prompt: t(
            `Solve $y' + ${a}y = ${b === 1 ? "" : b}y^{2}$ with $y(0) = ${y0}$, and find $y\\left(\\frac{\\ln 2}{${a}}\\right)$.`,
            `求解 $y' + ${a}y = ${b === 1 ? "" : b}y^{2}$，$y(0) = ${y0}$，并求 $y\\left(\\frac{\\ln 2}{${a}}\\right)$。`,
          ),
          answer: ans,
          wrong: [v, Q.of(y0, 2), Q.of(a * y0, 2 * a + b * y0)].filter((w) => !w.eq(ans)),
          solution: t(
            steps(
              `With $v = \\frac{1}{y}$: $v' - ${a}v = -${b}$, $v(0) = \\frac{1}{${y0}}$, so $v = \\frac{${b}}{${a}} + \\left(\\frac{1}{${y0}} - \\frac{${b}}{${a}}\\right)e^{${a}x}$.`,
              `At $x = \\frac{\\ln 2}{${a}}$: $v = \\frac{2}{${y0}} - \\frac{${b}}{${a}} = ${v.toLatex()}$, so $y = ${ans.toLatex()}$.`,
            ),
            steps(
              `令 $v = \\frac{1}{y}$：$v' - ${a}v = -${b}$，$v(0) = \\frac{1}{${y0}}$，所以 $v = \\frac{${b}}{${a}} + \\left(\\frac{1}{${y0}} - \\frac{${b}}{${a}}\\right)e^{${a}x}$。`,
              `当 $x = \\frac{\\ln 2}{${a}}$ 时 $v = \\frac{2}{${y0}} - \\frac{${b}}{${a}} = ${v.toLatex()}$，所以 $y = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** riccatiDifferentialEquations reduces y' = q0 + q1 y + q2 y^2 using a known solution. */
export const riccatiDifferentialEquations: TopicDef = {
  id: "riccati-differential-equations",
  title: t("Riccati Differential Equations", "黎卡提微分方程"),
  summary: t(
    "Given a particular solution $y_1$ of a Riccati equation $y' = q_0 + q_1 y + q_2 y^2$, the substitution $y = y_1 + \\frac{1}{u}$ reduces it to a linear equation.",
    "已知黎卡提方程 $y' = q_0 + q_1 y + q_2 y^2$ 的一个特解 $y_1$，代换 $y = y_1 + \\frac{1}{u}$ 可将其化为线性方程。",
  ),
  prerequisites: ["bernoulli-differential-equations"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "transforming-riccati-equations-with-a-known-solution",
      title: t("Transforming Riccati equations with a known solution", "已知特解时黎卡提方程的线性化代换"),
      explanation: t(
        "Once one solution of a Riccati equation is known, writing the general solution as that solution plus a new unknown leads to a Bernoulli equation. For $y' = y^2 - a^2$, a particular solution is $y_1 = a$. Substituting $y = a + \\frac{1}{u}$ yields $u' + 2a u = -1$, a first-order linear equation in $u$.",
        "一旦知道里卡蒂方程的一个解，把通解写成这个解加上一个新的未知函数，就得到伯努利方程。对于方程 $y' = y^2 - a^2$，常数特解为 $y_1 = a$。代入 $y = a + \\frac{1}{u}$ 可化简得 $u' + 2a u = -1$，这是一阶线性常微分方程。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 40);
        const coeffU = 2 * a;

        const prompt = t(
          `Given that $y_1 = ${a}$ is a particular solution to $y' = y^2 - ${a * a}$, the substitution $y = ${a} + \\frac{1}{u}$ transforms the ODE into $u' + K u = -1$. Find the constant $K$.`,
          `已知 $y_1 = ${a}$ 是微分方程 $y' = y^2 - ${a * a}$ 的一个特解。通过代换 $y = ${a} + \\frac{1}{u}$，方程转化为 $u' + K u = -1$。求常数 $K$ 的值。`,
        );
        const solution = t(
          steps(
            `Substitute $y = ${a} + u^{-1}$ into $y'$: $y' = -u^{-2}u'$.`,
            `Compute $y^2 - ${a * a} = (${a} + u^{-1})^2 - ${a * a} = ${a * a} + 2(${a})u^{-1} + u^{-2} - ${a * a} = ${2 * a}u^{-1} + u^{-2}$.`,
            `Equate: $-u^{-2}u' = ${2 * a}u^{-1} + u^{-2}$.`,
            `Multiply by $-u^2$: $u' = -${2 * a}u - 1 \\implies u' + ${coeffU}u = -1$.`,
            `Thus, the coefficient is $K = ${coeffU}$.`,
          ),
          steps(
            `将 $y = ${a} + u^{-1}$ 代入导数式：$y' = -u^{-2}u'$。`,
            `计算右端项：$y^2 - ${a * a} = (${a} + u^{-1})^2 - ${a * a} = ${2 * a}u^{-1} + u^{-2}$。`,
            `两端相等：$-u^{-2}u' = ${2 * a}u^{-1} + u^{-2}$。`,
            `同乘 $-u^2$ 整理得：$u' + ${coeffU}u = -1$。`,
            `因此常数系数为 $K = ${coeffU}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: coeffU,
          wrong: [a, a * a, coeffU + 1],
        });
      },
    },
    {
      id: "solving-a-riccati-initial-value-problem",
      title: t("Solving a Riccati initial value problem", "求解里卡蒂初值问题"),
      explanation: t(
        "Knowing one solution turns the nonlinear Riccati equation into a linear one for a new unknown, which we then solve with an integrating factor. For $y' = y^{2} - k^{2}$ with known solution $y_1 = k$, set $y = k + \\frac{1}{u}$. Then $u' + 2ku = -1$, so $u = -\\frac{1}{2k} + Ce^{-2kx}$. With $y(0) = 0$, $u(0) = -\\frac{1}{k}$ and $C = -\\frac{1}{2k}$:\n\n$$u = -\\frac{1 + e^{-2kx}}{2k}, \\qquad y = k - \\frac{2k}{1 + e^{-2kx}}.$$\n\nAs $x \\to \\infty$, $y \\to -k$, the other equilibrium.",
        "知道一个解，就能把非线性的里卡蒂方程化为关于新未知函数的线性方程，再用积分因子求解。对已知解 $y_1 = k$ 的 $y' = y^{2} - k^{2}$，令 $y = k + \\frac{1}{u}$。则 $u' + 2ku = -1$，所以 $u = -\\frac{1}{2k} + Ce^{-2kx}$。若 $y(0) = 0$，则 $u(0) = -\\frac{1}{k}$，$C = -\\frac{1}{2k}$：\n\n$$u = -\\frac{1 + e^{-2kx}}{2k}, \\qquad y = k - \\frac{2k}{1 + e^{-2kx}}.$$\n\n当 $x \\to \\infty$ 时 $y \\to -k$，即另一个平衡解。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 6);
        const m = rng.int(2, 6);
        const ans = Q.of(k * (1 - m), m + 1);
        return numberProblem({
          prompt: t(
            `$y_1 = ${k}$ solves $y' = y^{2} - ${k * k}$. Use it to solve the equation with $y(0) = 0$, and find $y\\left(\\frac{\\ln ${m}}{${2 * k}}\\right)$.`,
            `$y_1 = ${k}$ 是 $y' = y^{2} - ${k * k}$ 的解。利用它求解满足 $y(0) = 0$ 的方程，并求 $y\\left(\\frac{\\ln ${m}}{${2 * k}}\\right)$。`,
          ),
          answer: ans,
          wrong: [Q.of(-k), ans.neg(), Q.of(k * (1 - m), 2 * (m + 1))].filter((v) => !v.eq(ans)),
          solution: t(
            steps(
              `With $y = ${k} + \\frac{1}{u}$: $u' + ${2 * k}u = -1$ and $u(0) = -\\frac{1}{${k}}$, so $u = -\\frac{1 + e^{-${2 * k}x}}{${2 * k}}$.`,
              `At $x = \\frac{\\ln ${m}}{${2 * k}}$, $e^{-${2 * k}x} = \\frac{1}{${m}}$, so $u = -${Q.of(m + 1, 2 * k * m).toLatex()}$ and $y = ${k} - ${Q.of(2 * k * m, m + 1).toLatex()} = ${ans.toLatex()}$.`,
            ),
            steps(
              `令 $y = ${k} + \\frac{1}{u}$：$u' + ${2 * k}u = -1$，$u(0) = -\\frac{1}{${k}}$，所以 $u = -\\frac{1 + e^{-${2 * k}x}}{${2 * k}}$。`,
              `当 $x = \\frac{\\ln ${m}}{${2 * k}}$ 时 $e^{-${2 * k}x} = \\frac{1}{${m}}$，所以 $u = -${Q.of(m + 1, 2 * k * m).toLatex()}$，$y = ${k} - ${Q.of(2 * k * m, m + 1).toLatex()} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** clairautDifferentialEquations solves y = x y' + f(y'). */
export const clairautDifferentialEquations: TopicDef = {
  id: "clairaut-differential-equations",
  title: t("Clairaut Differential Equations", "克莱罗微分方程"),
  summary: t(
    "Clairaut's equation y = x y' + f(y') admits a family of linear general solutions y = C x + f(C) alongside a singular envelope solution.",
    "克莱罗方程 y = x y' + f(y') 的通解为一直线族 y = C x + f(C)，并具有一条由包络线构成的奇解。",
  ),
  prerequisites: ["exact-differential-equations"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "general-linear-solutions-of-clairauts-equation",
      title: t("General linear solutions of Clairaut's equation", "克莱罗方程的通解直线族"),
      explanation: t(
        "Differentiating the equation gives a product equal to zero, and setting the second derivative to zero gives a family of straight line solutions. Differentiating $y = x y' + f(y')$ yields $y' = y' + x y'' + f'(y')y'' \\implies [x + f'(y')]y'' = 0$. Setting $y'' = 0$ gives $y' = C$, leading to general solution lines $y = C x + f(C)$.",
        "对方程求导得到一个等于零的乘积，令二阶导数为零就得到一族直线解。对克莱罗方程 $y = x y' + f(y')$ 求导得 $y' = y' + [x + f'(y')]y'' \\implies [x + f'(y')]y'' = 0$。令 $y'' = 0$ 可得斜率为常数 $y' = C$，从而得到通解直线族 $y = C x + f(C)$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 6);
        const C = rng.int(1, 5);
        const x0 = rng.int(1, 5);
        const ans = C * x0 + k * C * C;

        const prompt = t(
          `For the Clairaut differential equation $y = x y' + ${k}(y')^2$, find the value of $y$ on the solution line with slope $y' = ${C}$ at $x = ${x0}$.`,
          `对于克莱罗微分方程 $y = x y' + ${k}(y')^2$，求斜率 $y' = ${C}$ 的通解直线在 $x = ${x0}$ 处对应的 $y$ 值。`,
        );
        const solution = t(
          steps(
            `The general solution to Clairaut's equation $y = x y' + f(y')$ is obtained by replacing $y'$ with constant $C$: $y = C x + ${k}C^2$.`,
            `Substitute $C = ${C}$: $y(x) = ${C}x + ${k}(${C}^2) = ${C}x + ${k * C * C}$.`,
            `Evaluate at $x = ${x0}$: $y(${x0}) = ${C}(${x0}) + ${k * C * C} = ${C * x0} + ${k * C * C} = ${ans}$.`,
          ),
          steps(
            `克莱罗方程 $y = x y' + f(y')$ 的通解由常数 $C$ 替换 $y'$ 得到：$y = C x + ${k}C^2$。`,
            `代入 $C = ${C}$ 得直线方程：$y(x) = ${C}x + ${k * C * C}$。`,
            `代入 $x = ${x0}$ 计算：$y(${x0}) = ${C}(${x0}) + ${k * C * C} = ${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [C * x0, k * C * C, ans + C],
        });
      },
    },
    {
      id: "the-singular-solution-of-clairauts-equation",
      title: t("The singular solution of Clairaut's equation", "克莱罗方程的奇解"),
      explanation: t(
        "Differentiating $y = xp + f(p)$ gives $\\left(x + f'(p)\\right)p' = 0$. The factor $p' = 0$ gives the lines $y = Cx + f(C)$; the factor $x + f'(p) = 0$ gives the singular solution, the envelope of those lines.\n\nFor $f(p) = cp^{2}$: $x = -2cp$, so $p = -\\frac{x}{2c}$ and\n\n$$y = xp + cp^{2} = -\\frac{x^{2}}{4c}.$$",
        "对 $y = xp + f(p)$ 求导得 $\\left(x + f'(p)\\right)p' = 0$。因子 $p' = 0$ 给出直线族 $y = Cx + f(C)$；因子 $x + f'(p) = 0$ 给出奇解，即这些直线的包络。\n\n对 $f(p) = cp^{2}$：$x = -2cp$，所以 $p = -\\frac{x}{2c}$，\n\n$$y = xp + cp^{2} = -\\frac{x^{2}}{4c}.$$",
      ),
      generate(rng: Rng): Problem {
        const c = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const x0 = rng.int(1, 9);
        const ans = Q.of(-x0 * x0, 4 * c);
        const cp = c === 1 ? "" : c === -1 ? "-" : `${c}`;
        return numberProblem({
          prompt: t(
            `Find the value at $x = ${x0}$ of the singular solution of the Clairaut equation $y = xy' ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}(y')^{2}$.`,
            `求克莱罗方程 $y = xy' ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}(y')^{2}$ 的奇解在 $x = ${x0}$ 处的值。`,
          ),
          answer: ans,
          wrong: [ans.neg(), Q.of(-x0 * x0, 2 * c), Q.of(-c * x0 * x0)].filter((v) => !v.eq(ans)),
          solution: t(
            steps(
              `Here $f(p) = ${cp}p^{2}$, and $x + f'(p) = 0$ gives $p = -\\frac{x}{${2 * c}}$.`,
              `So $y = -\\frac{x^{2}}{${4 * c}}$, and at $x = ${x0}$, $y = ${ans.toLatex()}$.`,
            ),
            steps(
              `这里 $f(p) = ${cp}p^{2}$，由 $x + f'(p) = 0$ 得 $p = -\\frac{x}{${2 * c}}$。`,
              `所以 $y = -\\frac{x^{2}}{${4 * c}}$，在 $x = ${x0}$ 处 $y = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** dalembertDifferentialEquations solves y = x f(y') + g(y'). */
export const dalembertDifferentialEquations: TopicDef = {
  id: "dalembert-differential-equations",
  title: t("d'Alembert Differential Equations", "达朗贝尔微分方程"),
  summary: t(
    "d'Alembert's equation y = x f(y') + g(y') is solved by differentiating with respect to x, converting it into a linear equation for x(p) where p = y'.",
    "达朗贝尔方程 y = x f(y') + g(y') 通过对 x 求导，转化为关于 x(p)（其中 p = y'）的一阶线性常微分方程进行求解。",
  ),
  prerequisites: ["clairaut-differential-equations"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "reduction-of-dalembert-equations-to-linear-form",
      title: t("Reduction of d'Alembert equations to linear form", "达朗贝尔方程求导转化为线性方程"),
      explanation: t(
        "Differentiating the equation and treating the variable as a function of the slope turns the problem into a linear equation in the variable. For $y = 2x p + g(p)$, differentiating with respect to $x$ gives $p = 2p + 2x \\frac{dp}{dx} + g'(p)\\frac{dp}{dx}$, which rearranges to $\\frac{dx}{dp} + \\frac{2}{p}x = -\\frac{g'(p)}{p}$, an integrating factor $p^2$ ODE.",
        "对方程求导，并把自变量看作斜率的函数，问题就化为关于自变量的线性方程。对于方程 $y = 2x p + g(p)$，关于 $x$ 求导得 $p = 2p + [2x + g'(p)]\\frac{dp}{dx}$，变形可得 $\\frac{dx}{dp} + \\frac{2}{p}x = -\\frac{g'(p)}{p}$，该线性方程的积分因子为 $p^2$。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(2, 35);
        const ans = Q.of(m, m - 1);

        const prompt = t(
          `Differentiating the d'Alembert equation $y = ${m}x y' + (y')^2$ with $p = y'$ turns it into a linear equation $\\frac{dx}{dp} + P(p)x = G(p)$ for $x$ as a function of $p$. Its integrating factor is $p^{r}$. Find $r$.`,
          `对达朗贝尔方程 $y = ${m}x y' + (y')^2$（记 $p = y'$）两端关于 $x$ 求导，它化为关于 $x(p)$ 的线性方程 $\\frac{dx}{dp} + P(p)x = G(p)$，其积分因子为 $p^{r}$。求 $r$。`,
        );
        const solution = t(
          steps(
            `Differentiate $y = ${m}x p + p^2$ with respect to $x$: $p = ${m}p + ${m}x \\frac{dp}{dx} + 2p \\frac{dp}{dx}$.`,
            `Rearrange: $(1 - ${m})p = (${m}x + 2p)\\frac{dp}{dx} \\implies \\frac{dx}{dp} + \\frac{${m}}{(${m}-1)p}x = -\\frac{2}{${m}-1}$.`,
            `The integrating factor for this linear equation is $I(p) = e^{\\int \\frac{${m}}{(${m}-1)p}dp} = p^{\\frac{${m}}{${m}-1}}$.`,
            `So $r = \\frac{${m}}{${m - 1}}$${lowestTerms(m, m - 1)}.`,
          ),
          steps(
            `对 $y = ${m}x p + p^2$ 两边关于 $x$ 求导：$p = ${m}p + ${m}x \\frac{dp}{dx} + 2p \\frac{dp}{dx}$。`,
            `移项整理：$(1 - ${m})p = (${m}x + 2p)\\frac{dp}{dx} \\implies \\frac{dx}{dp} + \\frac{${m}}{(${m}-1)p}x = -\\frac{2}{${m}-1}$。`,
            `该方程的积分因子为 $I(p) = p^{\\frac{${m}}{${m}-1}}$。`,
            `所以 $r = \\frac{${m}}{${m - 1}}$${lowestTerms(m, m - 1)}。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(m), Q.of(m - 1, m), ans.neg()],
        });
      },
    },
    {
      id: "straight-line-solutions-of-dalembert-equations",
      title: t("Straight-line solutions of d'Alembert equations", "达朗贝尔方程的直线解"),
      explanation: t(
        "Differentiating $y = xf(p) + g(p)$ gives $p - f(p) = \\left(xf'(p) + g'(p)\\right)p'$. If $p$ is a constant $p_0$, the left side must vanish: $p_0 = f(p_0)$. Each such fixed point gives a straight-line solution\n\n$$y = p_0x + g(p_0).$$\n\nFor $y = 2xp^{2} + 3p$: $p = 2p^{2}$ gives $p_0 = 0$ or $p_0 = \\frac{1}{2}$, so $y = 0$ and $y = \\frac{x}{2} + \\frac{3}{2}$ are solutions.",
        "对 $y = xf(p) + g(p)$ 求导得 $p - f(p) = \\left(xf'(p) + g'(p)\\right)p'$。若 $p$ 是常数 $p_0$，左边必须为零：$p_0 = f(p_0)$。每个这样的不动点给出一条直线解\n\n$$y = p_0x + g(p_0).$$\n\n对 $y = 2xp^{2} + 3p$：由 $p = 2p^{2}$ 得 $p_0 = 0$ 或 $p_0 = \\frac{1}{2}$，所以 $y = 0$ 与 $y = \\frac{x}{2} + \\frac{3}{2}$ 都是解。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 6);
        const b = rng.int(-6, 8) || 5;
        const x0 = rng.int(1, 9);
        const ans = Q.of(x0 + b, a);
        return numberProblem({
          prompt: t(
            `The d'Alembert equation $y = ${a}x(y')^{2} ${signed(b)}y'$ has a straight-line solution with nonzero slope. Find its value at $x = ${x0}$.`,
            `达朗贝尔方程 $y = ${a}x(y')^{2} ${signed(b)}y'$有一条斜率不为零的直线解。求它在 $x = ${x0}$ 处的值。`,
          ),
          answer: ans,
          wrong: [Q.of(x0, a), Q.of(a * x0 + b), Q.of(x0 + b * a, a)].filter((v) => !v.eq(ans)),
          solution: t(
            steps(
              `A constant slope $p_0$ must satisfy $p_0 = ${a}p_0^{2}$, so the nonzero slope is $p_0 = \\frac{1}{${a}}$.`,
              `The line is $y = \\frac{x}{${a}} ${signed(b)} \\cdot \\frac{1}{${a}} = \\frac{x ${signed(b)}}{${a}}$; at $x = ${x0}$, $y = ${ans.toLatex()}$.`,
            ),
            steps(
              `常数斜率 $p_0$ 必须满足 $p_0 = ${a}p_0^{2}$，所以非零斜率为 $p_0 = \\frac{1}{${a}}$。`,
              `直线为 $y = \\frac{x}{${a}} ${signed(b)} \\cdot \\frac{1}{${a}} = \\frac{x ${signed(b)}}{${a}}$；在 $x = ${x0}$ 处 $y = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 1.4 Qualitative Techniques for Differential Equations
// ---------------------------------------------------------------------------

/** phaseLinesOfFirstOrderOdes visualizes 1D autonomous dynamics. */
export const phaseLinesOfFirstOrderOdes: TopicDef = {
  id: "phase-lines-of-first-order-odes",
  title: t("Phase Lines of First-Order ODEs", "一阶微分方程的相位线"),
  summary: t(
    "A phase line for an autonomous ODE y' = f(y) represents the real axis with arrows showing direction of flow and dots at equilibrium points.",
    "一阶自治方程 y' = f(y) 的相位线在实轴上标出平衡点并用箭头指示解曲线的演化流动方向。",
  ),
  prerequisites: ["equilibrium-solutions-of-first-order-odes"],
  encompasses: [{ topic: "equilibrium-solutions-of-first-order-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "constructing-and-interpreting-phase-lines",
      title: t("Constructing and interpreting phase lines", "构造与分析自治方程的相位线"),
      explanation: t(
        "A phase line marks the equilibria and shows, between them, whether solutions increase or decrease according to the sign of the right side. For $y' = (y - a)(b - y)$ with $a < b$, $f(y) > 0$ when $a < y < b$ (solutions increase, arrow points right/up), while $f(y) < 0$ when $y > b$ or $y < a$ (solutions decrease).",
        "相线标出平衡点，并在平衡点之间根据右边的符号说明解是增加还是减少。对于 $y' = (y - a)(b - y)$（$a < b$），在区间 $a < y < b$ 上 $f(y) > 0$（解单调递增，箭头指向正方向）；在 $y > b$ 或 $y < a$ 时 $f(y) < 0$（解单调递减）。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 8);
        const b = rng.int(a + 2, a + 15);
        const yTest = a + 1; // lies in (a, b)
        const ans = (yTest - a) * (b - yTest);

        const prompt = t(
          `For the autonomous differential equation $y' = (y - ${a})(${b} - y)$, evaluate the slope $y'$ on the phase line at $y = ${yTest}$.`,
          `对于自治微分方程 $y' = (y - ${a})(${b} - y)$，求相位线上在 $y = ${yTest}$ 处的导数值 $y'$。`,
        );
        const solution = t(
          steps(
            `Substitute $y = ${yTest}$ into the autonomous function $f(y) = (y - ${a})(${b} - y)$.`,
            `Calculate the factors: $(${yTest} - ${a}) = ${yTest - a}$ and $(${b} - ${yTest}) = ${b - yTest}$.`,
            `Multiply: $y' = (${yTest - a}) \\times (${b - yTest}) = ${ans}$.`,
            `Since $y' > 0$, the flow arrow points toward higher $y$ values on $( ${a}, ${b} )$.`,
          ),
          steps(
            `将 $y = ${yTest}$ 代入自治函数 $f(y) = (y - ${a})(${b} - y)$。`,
            `计算两因式：$(${yTest} - ${a}) = ${yTest - a}$，与 $(${b} - ${yTest}) = ${b - yTest}$。`,
            `相乘计算导数：$y' = (${yTest - a}) \\times (${b - yTest}) = ${ans}$。`,
            `由于导数大于零，在区间 $( ${a}, ${b} )$ 上解沿 $y$ 增加的方向流动。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [-ans, ans + 1, ans - 1],
        });
      },
    },
    {
      id: "long-run-behavior-from-a-phase-line",
      title: t("Long-run behavior from a phase line", "由相线判断长期行为"),
      explanation: t(
        "On a phase line a solution moves in the direction of the arrows and can never cross an equilibrium, so it approaches the nearest equilibrium in its direction of motion.\n\nFor $y' = (1 - y)(y - 3)(y - 5)$: the sign is $+$ below $1$, $-$ on $(1, 3)$, $+$ on $(3, 5)$ and $-$ above $5$. A solution starting at $y(0) = 4$ rises to $5$; one starting at $y(0) = 2$ falls to $1$.",
        "在相线上，解沿箭头方向移动，且不能越过平衡点，所以它趋向运动方向上最近的平衡点。\n\n对 $y' = (1 - y)(y - 3)(y - 5)$：符号在 $1$ 以下为 $+$，在 $(1, 3)$ 上为 $-$，在 $(3, 5)$ 上为 $+$，在 $5$ 以上为 $-$。从 $y(0) = 4$ 出发的解上升到 $5$；从 $y(0) = 2$ 出发的解下降到 $1$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 3);
        const b = a + rng.int(1, 3);
        const c = b + rng.int(1, 3);
        let y0 = rng.int(Math.max(0, a - 3), c + 3);
        if (y0 === b) y0 = c + 1;
        const ans = y0 < b ? a : c;
        return numberProblem({
          prompt: t(
            `For $y' = (${a} - y)(y - ${b})(y - ${c})$ with $y(0) = ${y0}$, find $\\lim_{t \\to \\infty} y(t)$.`,
            `对 $y' = (${a} - y)(y - ${b})(y - ${c})$，$y(0) = ${y0}$，求 $\\lim_{t \\to \\infty} y(t)$。`,
          ),
          answer: ans,
          wrong: [b, ans === a ? c : a, y0].filter((w) => w !== ans),
          solution: t(
            `The equilibria are $${a}$, $${b}$, $${c}$; $y'$ is $+$ below $${a}$, $-$ on $(${a}, ${b})$, $+$ on $(${b}, ${c})$ and $-$ above $${c}$. So $${a}$ and $${c}$ attract and $${b}$ repels, and from $y(0) = ${y0}$ the solution tends to $${ans}$.`,
            `平衡点为 $${a}$、$${b}$、$${c}$；$y'$ 在 $${a}$ 以下为 $+$，在 $(${a}, ${b})$ 上为 $-$，在 $(${b}, ${c})$ 上为 $+$，在 $${c}$ 以上为 $-$。所以 $${a}$ 与 $${c}$ 吸引，$${b}$ 排斥，从 $y(0) = ${y0}$ 出发的解趋于 $${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** classifyingEquilibriumSolutionsOfFirstOrderOdes classifies sinks, sources, and nodes. */
export const classifyingEquilibriumSolutionsOfFirstOrderOdes: TopicDef = {
  id: "classifying-equilibrium-solutions-of-first-order-odes",
  title: t("Classifying Equilibrium Solutions of First-Order ODEs", "一阶微分方程平衡解的稳定性分类"),
  summary: t(
    "An equilibrium $y^*$ of $y' = f(y)$ is asymptotically stable (a sink) if $f'(y^*) < 0$ and unstable (a source) if $f'(y^*) > 0$.",
    "对 $y' = f(y)$，若 $f'(y^*) < 0$，平衡点 $y^*$ 渐近稳定（汇）；若 $f'(y^*) > 0$，则不稳定（源）。",
  ),
  prerequisites: ["phase-lines-of-first-order-odes"],
  encompasses: [{ topic: "phase-lines-of-first-order-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "derivative-test-for-equilibrium-stability",
      title: t("Derivative test for equilibrium stability", "平衡点稳定性判别的导数检验法"),
      explanation: t(
        "An equilibrium is stable when the right side decreases through it, because nearby solutions are then pushed back toward the equilibrium. For $y' = k(y - a)(y - b)$ ($k > 0$, $a < b$), the derivative is $f'(y) = k(y - b) + k(y - a)$. At $y = a$, $f'(a) = k(a - b) < 0$, identifying $y = a$ as a stable equilibrium.",
        "当右边在平衡点处递减时，平衡点是稳定的，因为附近的解会被推回平衡点。对于 $y' = k(y - a)(y - b)$（$k > 0$，$a < b$），导函数为 $f'(y) = k(y - b) + k(y - a)$。在 $y = a$ 处，$f'(a) = k(a - b) < 0$，因此 $y = a$ 为渐近稳定平衡解。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 4);
        const a = rng.int(1, 4);
        const b = rng.int(a + 2, a + 7);
        const fPrimeA = k * (a - b);

        const prompt = t(
          `For the differential equation $y' = ${k === 1 ? "" : k}(y - ${a})(y - ${b})$, evaluate the derivative $f'(${a})$ to determine the stability of the equilibrium point $y = ${a}$.`,
          `对于微分方程 $y' = ${k === 1 ? "" : k}(y - ${a})(y - ${b})$，计算导数 $f'(${a})$ 的值以判定平衡点 $y = ${a}$ 的稳定性。`,
        );
        const solution = t(
          steps(
            `Let $f(y) = ${k === 1 ? "" : k}(y - ${a})(y - ${b})$.`,
            `By the product rule, $f'(y) = ${k === 1 ? "" : `${k}`}(y - ${b}) + ${k === 1 ? "" : `${k}`}(y - ${a})$.`,
            `Evaluate at $y = ${a}$: $f'(${a}) = ${k === 1 ? "" : `${k}`}(${a} - ${b}) + 0 = ${fPrimeA}$.`,
            `Because $f'(${a}) = ${fPrimeA} < 0$, the equilibrium $y = ${a}$ is asymptotically stable (a sink).`,
          ),
          steps(
            `设 $f(y) = ${k === 1 ? "" : k}(y - ${a})(y - ${b})$。`,
            `由乘积求导法则：$f'(y) = ${k === 1 ? "" : `${k}`}(y - ${b}) + ${k === 1 ? "" : `${k}`}(y - ${a})$。`,
            `代入 $y = ${a}$：$f'(${a}) = ${k === 1 ? "" : `${k}`}(${a} - ${b}) = ${fPrimeA}$。`,
            `因为 $f'(${a}) = ${fPrimeA} < 0$，平衡解 $y = ${a}$ 为渐近稳定平衡点（汇）。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: fPrimeA,
          wrong: [-fPrimeA, fPrimeA - 1, fPrimeA + 2],
        });
      },
    },
    {
      id: "classifying-equilibria-when-the-derivative-test-fails",
      title: t("Classifying equilibria when the derivative test fails", "导数判别法失效时的平衡点分类"),
      explanation: t(
        "When $f'(y^{*}) = 0$ the derivative test says nothing; look at the sign of $f$ on each side instead. At a double root such as $y^{*} = a$ in $f(y) = (y - a)^{2}(y - b)$, the factor $(y - a)^{2}$ never changes sign, so $f$ has the same sign on both sides: solutions approach from one side and leave on the other. Such an equilibrium is semi-stable (a node).\n\nAt the simple root $y = b$, $f'(b) = (b - a)^{2} > 0$, so it is a source; a minus sign in front of $f$ reverses this to a sink.",
        "当 $f'(y^{*}) = 0$ 时导数判别法失效；应改看 $f$ 在两侧的符号。在二重根处，例如 $f(y) = (y - a)^{2}(y - b)$ 中的 $y^{*} = a$，因子 $(y - a)^{2}$ 从不变号，所以 $f$ 在两侧同号：解从一侧趋近，从另一侧离开。这样的平衡点是半稳定的（结点）。\n\n在单根 $y = b$ 处，$f'(b) = (b - a)^{2} > 0$，所以它是源；在 $f$ 前加负号会使它变成汇。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-4, 6);
        let b = rng.int(-4, 6);
        if (b === a) b = a + 3;
        const s = rng.bool(0.5) ? 1 : -1;
        const askDouble = rng.bool(0.4);
        const yStar = askDouble ? a : b;
        const correct = askDouble ? 2 : s > 0 ? 1 : 0;
        const lin = (r: number): string => (r === 0 ? "y" : `y ${signed(-r)}`);
        const sq = a === 0 ? "y^{2}" : `(${lin(a)})^{2}`;
        const f = `${s < 0 ? "-" : ""}${sq}${b === 0 ? "y" : `(${lin(b)})`}`;
        return choiceProblem({
          prompt: t(`Classify the equilibrium $y = ${yStar}$ of $y' = ${f}$.`, `判断 $y' = ${f}$ 的平衡点 $y = ${yStar}$ 的类型。`),
          options: [
            t("Stable (a sink)", "稳定（汇）"),
            t("Unstable (a source)", "不稳定（源）"),
            t("Semi-stable (a node)", "半稳定（结点）"),
          ],
          correct,
          solution: askDouble
            ? t(
                `$y = ${a}$ is a double root, so $f'(${a}) = 0$ and the derivative test fails. The factor $${sq}$ keeps its sign, so $f$ has the same sign on both sides of $${a}$: the equilibrium is semi-stable.`,
                `$y = ${a}$ 是二重根，所以 $f'(${a}) = 0$，导数判别法失效。因子 $${sq}$ 不变号，所以 $f$ 在 $${a}$ 两侧同号：该平衡点是半稳定的。`,
              )
            : t(
                `$f'(${b}) = ${s < 0 ? "-" : ""}(${b} ${signed(-a)})^{2} = ${s * (b - a) ** 2}$, which is ${s > 0 ? "positive" : "negative"}, so $y = ${b}$ is a ${s > 0 ? "source" : "sink"}.`,
                `$f'(${b}) = ${s < 0 ? "-" : ""}(${b} ${signed(-a)})^{2} = ${s * (b - a) ** 2}$，${s > 0 ? "为正" : "为负"}，所以 $y = ${b}$ 是${s > 0 ? "源" : "汇"}。`,
              ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Export Array
// ---------------------------------------------------------------------------

export const differentialEquationsFirstOrderTopics: readonly TopicDef[] = [
  // 1.1 Techniques for Solving First-Order ODEs
  introductionToFirstOrderLinearOdes,
  generalSolutionsOfFirstOrderLinearOdes,
  solvingFirstOrderLinearOdesWithExponentialForcing,
  solvingFirstOrderLinearOdesWithSinusoidalForcing,
  solvingFirstOrderLinearOdesUsingIntegratingFactors,
  solvingFirstOrderOdesBySubstitution,
  furtherSolvingFirstOrderOdesBySubstitution,
  reducingOdesToFirstOrderLinearBySubstitution,

  // 1.2 Special First-Order Equations
  homogeneousFunctions,
  homogeneousFirstOrderOdes,
  exactDifferentialEquations,
  solvingExactOdesUsingIntegratingFactors,
  bernoulliDifferentialEquations,
  riccatiDifferentialEquations,
  clairautDifferentialEquations,
  dalembertDifferentialEquations,

  // 1.4 Qualitative Techniques
  phaseLinesOfFirstOrderOdes,
  classifyingEquilibriumSolutionsOfFirstOrderOdes,
];
