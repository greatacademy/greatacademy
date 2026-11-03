import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { numberProblem, steps } from "../problems.ts";

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
  encompasses: [
    {
      topic: "solving-first-order-odes-using-separation-of-variables",
      weight: 0.3,
    },
  ],
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
            `Evaluate at $x = ${x0}$: $P(${x0}) = \\frac{${b}}{${a}(${x0})} = \\frac{${b}}{${a * x0}} = ${ans.toLatex()}$.`,
          ),
          steps(
            `方程两边同除以首项系数 $(${poly([a, "x"])})$：$y' + \\frac{${b}}{${poly([a, "x"])}}y = \\frac{${c}}{${a}}x$。`,
            `确定系数函数：$P(x) = \\frac{${b}}{${poly([a, "x"])}}$。`,
            `代入 $x = ${x0}$ 求值：$P(${x0}) = \\frac{${b}}{${a}(${x0})} = \\frac{${b}}{${a * x0}} = ${ans.toLatex()}$。`,
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
  encompasses: [{ topic: "introduction-to-first-order-linear-odes", weight: 0.3 }],
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

        const prompt = t(
          `Determine the degree of homogeneity $n$ of the function $f(x, y) = ${poly([a, "x"])}^${poly([p, "y"])}^${q} + ${poly([b, "x"])}^${n}$.`,
          `确定函数 $f(x, y) = ${poly([a, "x"])}^${poly([p, "y"])}^${q} + ${poly([b, "x"])}^${n}$ 的齐次次数 $n$。`,
        );
        const solution = t(
          steps(
            `Substitute $tx$ for $x$ and $ty$ for $y$: $f(tx, ty) = ${a}(tx)^${p}(ty)^${q} + ${b}(tx)^${n}$.`,
            `Factor out powers of $t$: $f(tx, ty) = t^{${p}+${q}}(${poly([a, "x"])}^${poly([p, "y"])}^${q}) + t^${n}(${poly([b, "x"])}^${n}) = t^${n} f(x, y)$.`,
            `By definition of homogeneity, the degree is $n = ${n}$.`,
          ),
          steps(
            `将 $x$ 替换为 $tx$，$y$ 替换为 $ty$：$f(tx, ty) = ${a}(tx)^${p}(ty)^${q} + ${b}(tx)^${n}$。`,
            `提取 $t$ 的公因子：$f(tx, ty) = t^{${p}+${q}}(${poly([a, "x"])}^${poly([p, "y"])}^${q}) + t^${n}(${poly([b, "x"])}^${n}) = t^${n} f(x, y)$。`,
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
  encompasses: [{ topic: "bernoulli-differential-equations", weight: 0.3 }],
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
  encompasses: [{ topic: "exact-differential-equations", weight: 0.3 }],
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
  encompasses: [{ topic: "clairaut-differential-equations", weight: 0.3 }],
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
        const ans = m;

        const prompt = t(
          `Differentiating the d'Alembert equation $y = ${m}x y' + (y')^2$ with $p = y'$ produces a linear differential equation for $x$ as a function of $p$: $\\frac{dx}{dp} + \\frac{${m}}{(${m}-1)p}x = G(p)$. Find the coefficient of $p$ in the product $(${m}-1) \\times \\text{integrating factor power exponent}$.`,
          `对达朗贝尔方程 $y = ${m}x y' + (y')^2$（记 $p = y'$）两端关于 $x$ 求导，得到关于 $x(p)$ 的一阶线性微分方程 $\\frac{dx}{dp} + \\frac{${m}}{(${m}-1)p}x = G(p)$。求该线性微分方程积分因子幂指数与 $(${m}-1)$ 的乘积。`,
        );
        const solution = t(
          steps(
            `Differentiate $y = ${m}x p + p^2$ with respect to $x$: $p = ${m}p + ${m}x \\frac{dp}{dx} + 2p \\frac{dp}{dx}$.`,
            `Rearrange: $(1 - ${m})p = (${m}x + 2p)\\frac{dp}{dx} \\implies \\frac{dx}{dp} + \\frac{${m}}{(${m}-1)p}x = -\\frac{2}{${m}-1}$.`,
            `The integrating factor for this linear equation is $I(p) = e^{\\int \\frac{${m}}{(${m}-1)p}dp} = p^{\\frac{${m}}{${m}-1}}$.`,
            `Multiplying the exponent $\\frac{${m}}{${m}-1}$ by $(${m}-1)$ yields $${ans}$.`,
          ),
          steps(
            `对 $y = ${m}x p + p^2$ 两边关于 $x$ 求导：$p = ${m}p + ${m}x \\frac{dp}{dx} + 2p \\frac{dp}{dx}$。`,
            `移项整理：$(1 - ${m})p = (${m}x + 2p)\\frac{dp}{dx} \\implies \\frac{dx}{dp} + \\frac{${m}}{(${m}-1)p}x = -\\frac{2}{${m}-1}$。`,
            `该方程的积分因子为 $I(p) = p^{\\frac{${m}}{${m}-1}}$。`,
            `积分因子的幂指数乘以 $(${m}-1)$ 即得 $${ans}$。`,
          ),
        );
        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [m - 1, m + 1, 2 * m],
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
    "一阶自自治方程 y' = f(y) 的相位线在实轴上标出平衡点并用箭头指示解曲线的演化流动方向。",
  ),
  prerequisites: ["equilibrium-solutions-of-first-order-odes"],
  encompasses: [{ topic: "equilibrium-solutions-of-first-order-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "constructing-and-interpreting-phase-lines",
      title: t("Constructing and interpreting phase lines", "构造与分析自自治方程的相位线"),
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
          `对于自自治微分方程 $y' = (y - ${a})(${b} - y)$，求相位线上在 $y = ${yTest}$ 处的导数值 $y'$。`,
        );
        const solution = t(
          steps(
            `Substitute $y = ${yTest}$ into the autonomous function $f(y) = (y - ${a})(${b} - y)$.`,
            `Calculate the factors: $(${yTest} - ${a}) = ${yTest - a}$ and $(${b} - ${yTest}) = ${b - yTest}$.`,
            `Multiply: $y' = (${yTest - a}) \\times (${b - yTest}) = ${ans}$.`,
            `Since $y' > 0$, the flow arrow points toward higher $y$ values on $( ${a}, ${b} )$.`,
          ),
          steps(
            `将 $y = ${yTest}$ 代入自自治函数 $f(y) = (y - ${a})(${b} - y)$。`,
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
