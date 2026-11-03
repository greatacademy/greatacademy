import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, type PlaneMark, plane, poly, Q } from "@ga/subject-math";

import { functionProblem, numberProblem } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";

// Calculus II unit 5: Differential Equations, modules 5.24–5.28.

/** neg wraps a negative number in parentheses for substitution. */
const neg = (v: number | Q) => {
  const q = v instanceof Q ? v : Q.of(v);
  return q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex();
};

/** factors writes (y − a)(y − b) for roots a < b, putting a bare y first when a root is 0. */
const factors = (a: number, b: number, v = "y") => {
  const one = (r: number) => (r === 0 ? v : `(${linear(1, -r, v)})`);
  return b === 0 ? `${one(b)}${one(a)}` : `${one(a)}${one(b)}`;
};

/** derivativeName writes y, y', y'', y''' or y⁽ⁿ⁾. */
const derivativeName = (k: number) => (k === 0 ? "y" : k <= 3 ? `y${"'".repeat(k)}` : `y^{(${k})}`);

/** rightSides are functions of x for the right side of an equation. */
const rightSides = ["x^{2}", "\\sin x", "e^{x}", "0", "3x - 1", "\\cos 2x"] as const;

/** introductionToDifferentialEquations defines differential equations and their order. */
export const introductionToDifferentialEquations: TopicDef = {
  id: "introduction-to-differential-equations",
  title: t("Introduction to Differential Equations", "微分方程简介"),
  summary: t(
    "A differential equation relates a function to its derivatives; its order is the highest derivative that appears.",
    "微分方程把函数与它的导数联系起来；方程的阶是其中出现的最高阶导数的阶数。",
  ),
  prerequisites: ["second-and-higher-order-derivatives"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-order-of-a-differential-equation",
      title: t("The order of a differential equation", "微分方程的阶"),
      explanation: t(
        "A **differential equation** is an equation involving an unknown function $y$ and its derivatives, such as $y'' + 4y = 0$. A **solution** is a function that makes it true. The **order** is the order of the highest derivative, not the highest power: $(y')^{3} + y = x$ has order $1$, and $y''' - 2(y')^{4} = 0$ has order $3$.",
        "**微分方程**是含有未知函数 $y$ 及其导数的方程，例如 $y'' + 4y = 0$。使方程成立的函数叫做它的**解**。方程的**阶**是最高阶导数的阶数，而不是最高的幂次：$(y')^{3} + y = x$ 是 $1$ 阶的，$y''' - 2(y')^{4} = 0$ 是 $3$ 阶的。",
      ),
      generate(rng) {
        const n = rng.int(1, 4);
        const low = rng.int(0, n - 1);
        const p = rng.int(2, 5);
        const c = rng.nonZero(-6, 6);
        const lowTerm = low === 0 ? `y^{${p}}` : `(${derivativeName(low)})^{${p}}`;
        const terms = rng.shuffle([derivativeName(n), poly([c, lowTerm])]);
        const left = `${terms[0]}${terms[1]!.startsWith("-") ? ` - ${terms[1]!.slice(1)}` : ` + ${terms[1]}`}`;
        const equation = `${left} = ${rng.pick(rightSides)}`;
        return numberProblem({
          prompt: t(`What is the order of the differential equation $${equation}$?`, `微分方程 $${equation}$ 的阶是多少？`),
          answer: n,
          wrong: [p, n + 1, low],
          solution: t(
            `The highest derivative is $${derivativeName(n)}$, so the order is $${n}$. The power $${p}$ on $${low === 0 ? "y" : derivativeName(low)}$ does not matter.`,
            `最高阶导数是 $${derivativeName(n)}$，所以阶为 $${n}$。$${low === 0 ? "y" : derivativeName(low)}$ 上的幂次 $${p}$ 不影响阶。`,
          ),
        });
      },
    },
    {
      id: "linear-and-nonlinear-differential-equations",
      title: t("Linear and nonlinear equations", "线性与非线性方程"),
      explanation: t(
        "A differential equation is **linear** when $y$ and its derivatives appear only to the first power, are not multiplied together and are not inside other functions; the coefficients may depend on $x$. So $x^{2}y'' + 3y' - y = \\sin x$ is linear, while $yy' = x$, $(y')^{2} = y$ and $y' = \\sin y$ are **nonlinear**.",
        "若 $y$ 及其导数都只以一次方出现、彼此不相乘、也不出现在其他函数内部，微分方程就是**线性**的；系数可以依赖于 $x$。所以 $x^{2}y'' + 3y' - y = \\sin x$ 是线性的，而 $yy' = x$、$(y')^{2} = y$、$y' = \\sin y$ 都是**非线性**的。",
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const kind = rng.int(0, 5);
        const linearForms = [`y'' + ${a}xy' - ${b}y`, `x^{${a}}y' + ${b}y`, `y''' - ${a}y' + e^{x}y`];
        const nonlinearForms = [`y'' + ${a}yy'`, `(y')^{${a}} - ${b}y`, `y' + ${b}\\sin y`];
        const isLinear = kind < 3;
        const left = isLinear ? linearForms[kind]! : nonlinearForms[kind - 3]!;
        const equation = `${left} = ${rng.pick(rightSides)}`;
        const why = [
          t("$yy'$ is a product of $y$ and its derivative", "$yy'$ 是 $y$ 与其导数的乘积"),
          t(`$y'$ is raised to the power $${a}$`, `$y'$ 被取 $${a}$ 次方`),
          t("$y$ appears inside the sine", "$y$ 出现在正弦函数内部"),
        ];
        const options = [t("Linear", "线性"), t("Nonlinear", "非线性")] as const;
        return oneOf(
          rng,
          t(`Is the differential equation $${equation}$ linear or nonlinear?`, `微分方程 $${equation}$ 是线性的还是非线性的？`),
          options[isLinear ? 0 : 1],
          [options[isLinear ? 1 : 0]],
          isLinear
            ? t(
                "$y$ and its derivatives appear only to the first power, multiplied by functions of $x$ alone, so the equation is linear.",
                "$y$ 及其导数都只以一次方出现，且只乘以关于 $x$ 的函数，所以方程是线性的。",
              )
            : t(`${why[kind - 3]!.en}, so the equation is nonlinear.`, `${why[kind - 3]!["zh-CN"]}，所以方程是非线性的。`),
        );
      },
    },
  ],
};

/** solutionAnswers are the answers to "is this a solution?". */
const solutionAnswers = [t("Yes, it is a solution.", "是，它是解。"), t("No, it is not a solution.", "不是，它不是解。")] as const;

/** verifyingSolutionsOfDifferentialEquations substitutes a function into an equation. */
export const verifyingSolutionsOfDifferentialEquations: TopicDef = {
  id: "verifying-solutions-of-differential-equations",
  title: t("Verifying Solutions of Differential Equations", "验证微分方程的解"),
  summary: t(
    "Differentiate the candidate, substitute it and its derivatives into the equation, and check that both sides agree for every x.",
    "对候选函数求导，把它及其导数代入方程，检查两边对所有 x 都相等。",
  ),
  prerequisites: ["introduction-to-differential-equations"],
  encompasses: [{ topic: "introduction-to-differential-equations", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "checking-a-proposed-solution",
      title: t("Checking a proposed solution", "检验一个候选解"),
      explanation: t(
        "To check whether $y = 3e^{-2x}$ solves $y' + 2y = 0$: $y' = -6e^{-2x}$, so $y' + 2y = -6e^{-2x} + 6e^{-2x} = 0$. It is a solution. The equation must hold for **every** $x$, not just one value.",
        "检验 $y = 3e^{-2x}$ 是否是 $y' + 2y = 0$ 的解：$y' = -6e^{-2x}$，所以 $y' + 2y = -6e^{-2x} + 6e^{-2x} = 0$。它是解。方程必须对**每一个** $x$ 都成立，而不只是某一个值。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const works = rng.bool();
        const c = rng.int(2, 9);
        const k = rng.int(2, 5);
        if (kind === 0) {
          const s = rng.pick([-1, 1]);
          const e = poly([s * k, "x"]);
          const coef = works ? -s * k : s * k;
          const equation = `y' ${coef < 0 ? "-" : "+"} ${Math.abs(coef)}y = 0`;
          return oneOf(
            rng,
            t(`Is $y = ${c}e^{${e}}$ a solution of $${equation}$?`, `$y = ${c}e^{${e}}$ 是 $${equation}$ 的解吗？`),
            solutionAnswers[works ? 0 : 1],
            [solutionAnswers[works ? 1 : 0]],
            t(
              `$y' = ${s * c * k}e^{${e}}$, so the left side is $${s * c * k}e^{${e}} ${coef < 0 ? "-" : "+"} ${Math.abs(coef * c)}e^{${e}} = ${(s * k + coef) * c === 0 ? "0" : `${(s * k + coef) * c}e^{${e}}`}$. ${works ? "It is $0$ for every $x$, so $y$ is a solution." : "This is not $0$, so $y$ is not a solution."}`,
              `$y' = ${s * c * k}e^{${e}}$，所以左边为 $${s * c * k}e^{${e}} ${coef < 0 ? "-" : "+"} ${Math.abs(coef * c)}e^{${e}} = ${(s * k + coef) * c === 0 ? "0" : `${(s * k + coef) * c}e^{${e}}`}$。${works ? "它对每个 $x$ 都等于 $0$，所以 $y$ 是解。" : "它不等于 $0$，所以 $y$ 不是解。"}`,
            ),
          );
        }
        if (kind === 1) {
          const fn = rng.bool() ? "\\sin" : "\\cos";
          const sign = works ? "+" : "-";
          const equation = `y'' ${sign} ${k * k}y = 0`;
          const y2 = `${-c * k * k}${fn} ${k}x`;
          return oneOf(
            rng,
            t(`Is $y = ${c}${fn} ${k}x$ a solution of $${equation}$?`, `$y = ${c}${fn} ${k}x$ 是 $${equation}$ 的解吗？`),
            solutionAnswers[works ? 0 : 1],
            [solutionAnswers[works ? 1 : 0]],
            t(
              `$y'' = ${y2}$, so the left side is $${y2} ${sign} ${c * k * k}${fn} ${k}x = ${works ? "0" : `${-2 * c * k * k}${fn} ${k}x`}$. ${works ? "So $y$ is a solution." : "This is not $0$ for every $x$, so $y$ is not a solution."}`,
              `$y'' = ${y2}$，所以左边为 $${y2} ${sign} ${c * k * k}${fn} ${k}x = ${works ? "0" : `${-2 * c * k * k}${fn} ${k}x`}$。${works ? "所以 $y$ 是解。" : "它不是对每个 $x$ 都等于 $0$，所以 $y$ 不是解。"}`,
            ),
          );
        }
        const m = works ? k : k + 1;
        return oneOf(
          rng,
          t(`Is $y = ${c}x^{${k}}$ a solution of $xy' = ${m}y$?`, `$y = ${c}x^{${k}}$ 是 $xy' = ${m}y$ 的解吗？`),
          solutionAnswers[works ? 0 : 1],
          [solutionAnswers[works ? 1 : 0]],
          t(
            `$xy' = x \\cdot ${c * k}x^{${k - 1}} = ${c * k}x^{${k}}$ and $${m}y = ${c * m}x^{${k}}$. ${works ? "They agree, so $y$ is a solution." : "They differ, so $y$ is not a solution."}`,
            `$xy' = x \\cdot ${c * k}x^{${k - 1}} = ${c * k}x^{${k}}$，而 $${m}y = ${c * m}x^{${k}}$。${works ? "两者相等，所以 $y$ 是解。" : "两者不等，所以 $y$ 不是解。"}`,
          ),
        );
      },
    },
    {
      id: "exponential-solutions-with-an-unknown-rate",
      title: t("Exponential solutions with an unknown rate", "求指数解中的未知常数"),
      explanation: t(
        "Substituting $y = e^{rx}$ into $y'' + by' + cy = 0$ gives $e^{rx}(r^{2} + br + c) = 0$, and $e^{rx}$ is never $0$, so $r^{2} + br + c = 0$. For $y'' - y' - 6y = 0$: $r^{2} - r - 6 = (r - 3)(r + 2) = 0$, so $r = 3$ or $r = -2$.",
        "把 $y = e^{rx}$ 代入 $y'' + by' + cy = 0$ 得 $e^{rx}(r^{2} + br + c) = 0$，而 $e^{rx}$ 永不为 $0$，所以 $r^{2} + br + c = 0$。对 $y'' - y' - 6y = 0$：$r^{2} - r - 6 = (r - 3)(r + 2) = 0$，所以 $r = 3$ 或 $r = -2$。",
      ),
      generate(rng) {
        // Nonzero roots keep both factors in the form (r − c).
        const roots = rng.shuffle([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]).slice(0, 2);
        const r1 = Math.min(...roots);
        const r2 = Math.max(...roots);
        const b = -(r1 + r2);
        const c = r1 * r2;
        const equation = `${poly([1, "y''"], [b, "y'"], [c, "y"])} = 0`;
        const characteristic = poly([1, "r^{2}"], [b, "r"], [c, ""]);
        return numberProblem({
          prompt: t(
            `$y = e^{rx}$ is a solution of $${equation}$ for two values of $r$. Find the larger one.`,
            `对 $r$ 的两个值，$y = e^{rx}$ 是 $${equation}$ 的解。求其中较大的那个。`,
          ),
          answer: r2,
          wrong: [r1, -r2, -r1],
          solution: t(
            `Substituting gives $e^{rx}(${characteristic}) = 0$, so $${characteristic} = (${linear(1, -r1, "r")})(${linear(1, -r2, "r")}) = 0$ and $r = ${r1}$ or $r = ${r2}$. The larger is $${r2}$.`,
            `代入得 $e^{rx}(${characteristic}) = 0$，所以 $${characteristic} = (${linear(1, -r1, "r")})(${linear(1, -r2, "r")}) = 0$，$r = ${r1}$ 或 $r = ${r2}$。较大的是 $${r2}$。`,
          ),
        });
      },
    },
  ],
};

/** plusC writes an antiderivative from its terms, ending in "+ C". */
const plusC = (...terms: (readonly [Q | number, string])[]) => `${poly(...terms)} + C`;

/** solvingFirstOrderOdesUsingDirectIntegration integrates dy/dx = f(x). */
export const solvingFirstOrderOdesUsingDirectIntegration: TopicDef = {
  id: "solving-first-order-odes-using-direct-integration",
  title: t("Solving First-Order ODEs Using Direct Integration", "用直接积分法解一阶常微分方程"),
  summary: t(
    "The solutions of dy/dx = f(x) are y = ∫ f(x) dx + C; an initial condition fixes C.",
    "dy/dx = f(x) 的解为 y = ∫ f(x) dx + C；初始条件确定 C。",
  ),
  prerequisites: ["introduction-to-differential-equations", "the-sum-rule-for-indefinite-integrals"],
  encompasses: [{ topic: "the-sum-rule-for-indefinite-integrals", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "general-solutions-by-integration",
      title: t("General solutions by integration", "积分求通解"),
      explanation: t(
        "If $\\frac{dy}{dx} = f(x)$, then $y$ is an antiderivative of $f$: $y = \\int f(x) \\, dx + C$. This **general solution** is a family of curves, one for each $C$. For $\\frac{dy}{dx} = 6x^{2} - 4$: $y = 2x^{3} - 4x + C$.",
        "若 $\\frac{dy}{dx} = f(x)$，则 $y$ 是 $f$ 的原函数：$y = \\int f(x) \\, dx + C$。这个**通解**是一族曲线，每个 $C$ 对应一条。对 $\\frac{dy}{dx} = 6x^{2} - 4$：$y = 2x^{3} - 4x + C$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.int(-9, 9);
        const c = rng.nonZero(-9, 9);
        const n = rng.int(2, 4);
        const rhs = poly([a, `x^{${n}}`], [b, "x"], [c, ""]);
        const terms = [
          [Q.of(a, n + 1), `x^{${n + 1}}`],
          [Q.of(b, 2), "x^{2}"],
          [Q.of(c), "x"],
        ] as const;
        const answer = plusC(...terms);
        return functionProblem({
          prompt: t(`Find the general solution of $\\frac{dy}{dx} = ${rhs}$.`, `求 $\\frac{dy}{dx} = ${rhs}$ 的通解。`),
          answer,
          antiderivative: true,
          prefix: "y =",
          wrong: [plusC([a * n, `x^{${n - 1}}`], [b, ""]), plusC([a, `x^{${n + 1}}`], [b, "x^{2}"], [c, "x"])],
          solution: t(
            `Integrate term by term: $y = \\int (${rhs}) \\, dx = ${answer}$.`,
            `逐项积分：$y = \\int (${rhs}) \\, dx = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "initial-value-problems-by-integration",
      title: t("Initial value problems by integration", "用积分解初值问题"),
      explanation: t(
        "An **initial value problem** adds a condition $y(x_0) = y_0$, which picks one curve from the family. For $\\frac{dy}{dx} = 2x + 1$ with $y(1) = 5$: $y = x^{2} + x + C$, and $5 = 1 + 1 + C$ gives $C = 3$, so $y = x^{2} + x + 3$ and $y(2) = 9$.",
        "**初值问题**附加一个条件 $y(x_0) = y_0$，从曲线族中选出一条。对 $\\frac{dy}{dx} = 2x + 1$，$y(1) = 5$：$y = x^{2} + x + C$，由 $5 = 1 + 1 + C$ 得 $C = 3$，所以 $y = x^{2} + x + 3$，$y(2) = 9$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.int(-9, 9);
        const x0 = rng.int(-3, 3);
        const y0 = rng.int(-9, 9);
        const x1 = rng.int(-4, 4);
        const F = (x: number) => Q.of(a * x * x, 2).add(Q.of(b * x));
        const C = Q.of(y0).sub(F(x0));
        const answer = F(x1).add(C);
        const y = poly([Q.of(a, 2), "x^{2}"], [b, "x"]);
        return numberProblem({
          prompt: t(
            `Solve $\\frac{dy}{dx} = ${linear(a, b)}$ with $y(${x0}) = ${y0}$, and find $y(${x1})$.`,
            `解 $\\frac{dy}{dx} = ${linear(a, b)}$，$y(${x0}) = ${y0}$，并求 $y(${x1})$。`,
          ),
          answer,
          wrong: [F(x1), F(x1).add(Q.of(y0)), Q.of(y0 + a * x1 + b)],
          solution: t(
            `$y = ${y} + C$. From $y(${x0}) = ${y0}$: $C = ${y0} - (${F(x0).toLatex()}) = ${C.toLatex()}$. So $y(${x1}) = ${F(x1).toLatex()} + ${neg(C)} = ${answer.toLatex()}$.`,
            `$y = ${y} + C$。由 $y(${x0}) = ${y0}$：$C = ${y0} - (${F(x0).toLatex()}) = ${C.toLatex()}$。所以 $y(${x1}) = ${F(x1).toLatex()} + ${neg(C)} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** factorsOfX are functions of x for separable equations, with their reciprocals. */
const factorsOfX = ["x", "x^{2}", "\\cos x", "e^{x}", "\\sqrt{x}"] as const;

/** factorsOfY are functions of y for separable equations, with their reciprocals. */
const factorsOfY: readonly (readonly [string, string])[] = [
  ["y", "\\frac{1}{y}"],
  ["y^{2}", "\\frac{1}{y^{2}}"],
  ["e^{y}", "e^{-y}"],
  ["\\sqrt{y}", "\\frac{1}{\\sqrt{y}}"],
  ["1 + y^{2}", "\\frac{1}{1 + y^{2}}"],
];

/** solvingFirstOrderOdesUsingSeparationOfVariables solves dy/dx = f(x)g(y). */
export const solvingFirstOrderOdesUsingSeparationOfVariables: TopicDef = {
  id: "solving-first-order-odes-using-separation-of-variables",
  title: t("Solving First-Order ODEs Using Separation of Variables", "用分离变量法解一阶常微分方程"),
  summary: t(
    "If dy/dx = f(x)g(y), then ∫ dy/g(y) = ∫ f(x) dx; integrate both sides and solve for y.",
    "若 dy/dx = f(x)g(y)，则 ∫ dy/g(y) = ∫ f(x) dx；两边积分后解出 y。",
  ),
  prerequisites: ["solving-first-order-odes-using-direct-integration", "verifying-solutions-of-differential-equations"],
  encompasses: [{ topic: "solving-first-order-odes-using-direct-integration", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "separating-the-variables",
      title: t("Separating the variables", "分离变量"),
      explanation: t(
        "An equation is **separable** when the right side factors as $f(x)g(y)$. Move every $y$ to the side with $dy$ and every $x$ to the side with $dx$: $\\frac{dy}{g(y)} = f(x) \\, dx$, then integrate. For $\\frac{dy}{dx} = 3x^{2}y^{2}$: $\\int \\frac{1}{y^{2}} \\, dy = \\int 3x^{2} \\, dx$.",
        "若右边能分解为 $f(x)g(y)$，方程就是**可分离变量**的。把所有 $y$ 移到含 $dy$ 的一边，所有 $x$ 移到含 $dx$ 的一边：$\\frac{dy}{g(y)} = f(x) \\, dx$，再两边积分。对 $\\frac{dy}{dx} = 3x^{2}y^{2}$：$\\int \\frac{1}{y^{2}} \\, dy = \\int 3x^{2} \\, dx$。",
      ),
      generate(rng) {
        const k = rng.int(1, 4);
        const fx = rng.pick(factorsOfX);
        const [gy, inv] = rng.pick(factorsOfY);
        const kf = `${k === 1 ? "" : k}${fx}`;
        const product = gy.includes("+") ? `${kf}(${gy})` : `${kf}${gy}`;
        const right = t(`$\\int ${inv} \\, dy = \\int ${kf} \\, dx$`, `$\\int ${inv} \\, dy = \\int ${kf} \\, dx$`);
        const wrong = [
          t(`$\\int ${gy} \\, dy = \\int ${kf} \\, dx$`, `$\\int ${gy} \\, dy = \\int ${kf} \\, dx$`),
          t(`$\\int ${inv} \\, dy = \\int \\frac{1}{${kf}} \\, dx$`, `$\\int ${inv} \\, dy = \\int \\frac{1}{${kf}} \\, dx$`),
          t(`$\\int ${kf} \\, dy = \\int ${gy} \\, dx$`, `$\\int ${kf} \\, dy = \\int ${gy} \\, dx$`),
        ];
        return oneOf(
          rng,
          t(
            `Which equation results from separating the variables in $\\frac{dy}{dx} = ${product}$?`,
            `对 $\\frac{dy}{dx} = ${product}$ 分离变量后得到哪个方程？`,
          ),
          right,
          wrong,
          t(
            `Divide both sides by $${gy}$ and multiply by $dx$: $${inv} \\, dy = ${kf} \\, dx$. Then integrate both sides.`,
            `两边除以 $${gy}$ 再乘以 $dx$：$${inv} \\, dy = ${kf} \\, dx$。然后两边积分。`,
          ),
        );
      },
    },
    {
      id: "general-solutions-by-separation",
      title: t("General solutions by separation", "分离变量求通解"),
      explanation: t(
        "For $\\frac{dy}{dx} = kx^{m}y$: $\\int \\frac{dy}{y} = \\int kx^{m} \\, dx$ gives $\\ln|y| = \\frac{k}{m + 1}x^{m+1} + C_1$, so $y = Ce^{\\frac{k}{m + 1}x^{m+1}}$ with $C = \\pm e^{C_1}$ (and $C = 0$ for the solution $y = 0$). For $\\frac{dy}{dx} = 6x^{2}y$: $y = Ce^{2x^{3}}$.",
        "对 $\\frac{dy}{dx} = kx^{m}y$：由 $\\int \\frac{dy}{y} = \\int kx^{m} \\, dx$ 得 $\\ln|y| = \\frac{k}{m + 1}x^{m+1} + C_1$，所以 $y = Ce^{\\frac{k}{m + 1}x^{m+1}}$，其中 $C = \\pm e^{C_1}$（$C = 0$ 对应解 $y = 0$）。对 $\\frac{dy}{dx} = 6x^{2}y$：$y = Ce^{2x^{3}}$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const m = rng.int(0, 4);
        const xm = m === 0 ? "" : m === 1 ? "x" : `x^{${m}}`;
        const xm1 = m === 0 ? "x" : `x^{${m + 1}}`;
        const g = poly([Q.of(k, m + 1), xm1]);
        return functionProblem({
          prompt: t(
            `The general solution of $\\frac{dy}{dx} = ${poly([k, `${xm}y`])}$ is $y = Ce^{g(x)}$. Find $g(x)$.`,
            `$\\frac{dy}{dx} = ${poly([k, `${xm}y`])}$ 的通解为 $y = Ce^{g(x)}$。求 $g(x)$。`,
          ),
          answer: g,
          prefix: "g(x) =",
          wrong: [
            poly([k, xm1]),
            m === 0 ? "0" : poly([k * m, m === 1 ? "" : m === 2 ? "x" : `x^{${m - 1}}`]),
            poly([Q.of(-k, m + 1), xm1]),
          ],
          solution: t(
            `$\\int \\frac{dy}{y} = \\int ${poly([k, xm || "1"]).replace(/^1$/, "1")} \\, dx$ gives $\\ln|y| = ${g} + C_1$, so $y = Ce^{${g}}$ and $g(x) = ${g}$.`,
            `由 $\\int \\frac{dy}{y} = \\int ${poly([k, xm || "1"]).replace(/^1$/, "1")} \\, dx$ 得 $\\ln|y| = ${g} + C_1$，所以 $y = Ce^{${g}}$，$g(x) = ${g}$。`,
          ),
        });
      },
    },
  ],
};

/** solvingFirstOrderIvpsUsingSeparationOfVariables fixes the constant with an initial condition. */
export const solvingFirstOrderIvpsUsingSeparationOfVariables: TopicDef = {
  id: "solving-first-order-ivps-using-separation-of-variables",
  title: t("Solving First-Order IVPs Using Separation of Variables", "用分离变量法解一阶初值问题"),
  summary: t(
    "Separate, integrate, then use the initial condition to find the constant before solving for y.",
    "分离变量并积分，再用初始条件求出常数，最后解出 y。",
  ),
  prerequisites: ["solving-first-order-odes-using-separation-of-variables"],
  encompasses: [{ topic: "solving-first-order-odes-using-separation-of-variables", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "exponential-ivps",
      title: t("IVPs with exponential solutions", "解为指数函数的初值问题"),
      explanation: t(
        "For $\\frac{dy}{dx} = kx^{m}y$ with $y(0) = y_0$, the general solution $y = Ce^{\\frac{k}{m + 1}x^{m+1}}$ gives $y(0) = C$, so $C = y_0$. For $\\frac{dy}{dx} = 4xy$ with $y(0) = 3$: $y = 3e^{2x^{2}}$.",
        "对 $\\frac{dy}{dx} = kx^{m}y$，$y(0) = y_0$，通解 $y = Ce^{\\frac{k}{m + 1}x^{m+1}}$ 给出 $y(0) = C$，所以 $C = y_0$。对 $\\frac{dy}{dx} = 4xy$，$y(0) = 3$：$y = 3e^{2x^{2}}$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-6, 6);
        const m = rng.int(0, 3);
        const y0 = rng.nonZero(-9, 9);
        const xm = m === 0 ? "" : m === 1 ? "x" : `x^{${m}}`;
        const g = poly([Q.of(k, m + 1), m === 0 ? "x" : `x^{${m + 1}}`]);
        const lead = y0 === 1 ? "" : y0 === -1 ? "-" : `${y0}`;
        const answer = `${lead}e^{${g}}`;
        return functionProblem({
          prompt: t(
            `Solve $\\frac{dy}{dx} = ${poly([k, `${xm}y`])}$ with $y(0) = ${y0}$.`,
            `解 $\\frac{dy}{dx} = ${poly([k, `${xm}y`])}$，$y(0) = ${y0}$。`,
          ),
          answer,
          prefix: "y =",
          wrong: [
            `e^{${g}} + ${neg(y0 - 1)}`,
            `${lead}e^{${poly([k, m === 0 ? "x" : `x^{${m + 1}}`])}}`,
            `${lead}e^{${poly([Q.of(-k, m + 1), m === 0 ? "x" : `x^{${m + 1}}`])}}`,
          ],
          solution: t(
            `Separating, $\\ln|y| = ${g} + C_1$, so $y = Ce^{${g}}$. Then $y(0) = C = ${y0}$, and $y = ${answer}$.`,
            `分离变量得 $\\ln|y| = ${g} + C_1$，所以 $y = Ce^{${g}}$。由 $y(0) = C = ${y0}$ 得 $y = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "ivps-with-reciprocal-solutions",
      title: t("IVPs with reciprocal solutions", "解为倒数形式的初值问题"),
      explanation: t(
        "For $\\frac{dy}{dx} = kxy^{2}$: $\\int y^{-2} \\, dy = \\int kx \\, dx$ gives $-\\frac{1}{y} = \\frac{k}{2}x^{2} + C$. With $y(0) = y_0$, $C = -\\frac{1}{y_0}$. For $\\frac{dy}{dx} = 2xy^{2}$, $y(0) = 1$: $-\\frac{1}{y} = x^{2} - 1$, so $y = \\frac{1}{1 - x^{2}}$ and $y\\left(\\frac{1}{2}\\right) = \\frac{4}{3}$.",
        "对 $\\frac{dy}{dx} = kxy^{2}$：由 $\\int y^{-2} \\, dy = \\int kx \\, dx$ 得 $-\\frac{1}{y} = \\frac{k}{2}x^{2} + C$。由 $y(0) = y_0$ 得 $C = -\\frac{1}{y_0}$。对 $\\frac{dy}{dx} = 2xy^{2}$，$y(0) = 1$：$-\\frac{1}{y} = x^{2} - 1$，所以 $y = \\frac{1}{1 - x^{2}}$，$y\\left(\\frac{1}{2}\\right) = \\frac{4}{3}$。",
      ),
      generate(rng) {
        for (;;) {
          const k = rng.nonZero(-4, 4);
          const y0 = rng.nonZero(-5, 5);
          const x1 = rng.pick([Q.of(1, 2), Q.of(1), Q.of(2), Q.of(-1), Q.of(1, 3), Q.of(3, 2)]);
          // 1/y = 1/y₀ − (k/2)x²
          const inv = Q.of(1, y0).sub(Q.of(k, 2).mul(x1).mul(x1));
          const flipped = Q.of(1, y0).add(Q.of(k, 2).mul(x1).mul(x1));
          if (inv.isZero() || flipped.isZero()) continue;
          const answer = Q.one.div(inv);
          return numberProblem({
            prompt: t(
              `Solve $\\frac{dy}{dx} = ${poly([k, "xy^{2}"])}$ with $y(0) = ${y0}$, and find $y\\left(${x1.toLatex()}\\right)$.`,
              `解 $\\frac{dy}{dx} = ${poly([k, "xy^{2}"])}$，$y(0) = ${y0}$，并求 $y\\left(${x1.toLatex()}\\right)$。`,
            ),
            answer,
            wrong: [inv, Q.one.div(flipped), Q.of(y0).add(Q.of(k, 2).mul(x1).mul(x1))],
            solution: t(
              `$\\int \\frac{dy}{y^{2}} = \\int ${poly([k, "x"])} \\, dx$ gives $-\\frac{1}{y} = ${poly([Q.of(k, 2), "x^{2}"])} + C$, and $y(0) = ${y0}$ gives $C = ${Q.of(-1, y0).toLatex()}$. So $\\frac{1}{y} = ${poly([Q.of(1, y0), ""], [Q.of(-k, 2), "x^{2}"])}$; at $x = ${x1.toLatex()}$ this is $${inv.toLatex()}$, so $y = ${answer.toLatex()}$.`,
              `由 $\\int \\frac{dy}{y^{2}} = \\int ${poly([k, "x"])} \\, dx$ 得 $-\\frac{1}{y} = ${poly([Q.of(k, 2), "x^{2}"])} + C$，由 $y(0) = ${y0}$ 得 $C = ${Q.of(-1, y0).toLatex()}$。所以 $\\frac{1}{y} = ${poly([Q.of(1, y0), ""], [Q.of(-k, 2), "x^{2}"])}$；在 $x = ${x1.toLatex()}$ 处它等于 $${inv.toLatex()}$，所以 $y = ${answer.toLatex()}$。`,
            ),
          });
        }
      },
    },
  ],
};

/** ModelCase is a verbal description with the matching equation and two distractors. */
interface ModelCase {
  readonly words: Text;
  readonly right: string;
  readonly wrong: readonly string[];
}

/** modelCase picks a situation described by a first-order equation. */
function modelCase(rng: Rng): ModelCase {
  const a = rng.int(2, 9) * 10;
  const kind = rng.int(0, 4);
  if (kind === 0)
    return {
      words: t("The rate of change of a population $P$ is proportional to the population.", "种群数量 $P$ 的变化率与种群数量成正比。"),
      right: "\\frac{dP}{dt} = kP",
      wrong: ["\\frac{dP}{dt} = k", "\\frac{dP}{dt} = kt", "P = kt"],
    };
  if (kind === 1)
    return {
      words: t(
        `The rate of change of the temperature $T$ of a cup of tea is proportional to the difference between $T$ and the room temperature of $${a}^{\\circ}$.`,
        `一杯茶的温度 $T$ 的变化率与 $T$ 和室温 $${a}^{\\circ}$ 之差成正比。`,
      ),
      right: `\\frac{dT}{dt} = k(T - ${a})`,
      wrong: [`\\frac{dT}{dt} = kT - ${a}`, `\\frac{dT}{dt} = k(t - ${a})`, `\\frac{dT}{dt} = \\frac{k}{T - ${a}}`],
    };
  if (kind === 2)
    return {
      words: t(
        `In a town of $${a * 100}$ people, a rumor spreads at a rate proportional to the product of the number $N$ who have heard it and the number who have not.`,
        `在一个 $${a * 100}$ 人的小镇里，谣言传播的速率与已听说的人数 $N$ 和未听说的人数之积成正比。`,
      ),
      right: `\\frac{dN}{dt} = kN(${a * 100} - N)`,
      wrong: [`\\frac{dN}{dt} = kN + (${a * 100} - N)`, `\\frac{dN}{dt} = k(${a * 100} - N)`, `\\frac{dN}{dt} = kN \\cdot ${a * 100}`],
    };
  if (kind === 3)
    return {
      words: t(
        `A student must learn $${a}$ facts. The rate at which the number $L$ of learned facts grows is proportional to the number not yet learned.`,
        `一名学生要学会 $${a}$ 个知识点。已学会的数量 $L$ 的增长速率与尚未学会的数量成正比。`,
      ),
      right: `\\frac{dL}{dt} = k(${a} - L)`,
      wrong: [`\\frac{dL}{dt} = kL`, `\\frac{dL}{dt} = kL(${a} - L)`, `\\frac{dL}{dt} = ${a} - kL`],
    };
  return {
    words: t(
      "Water drains from a tank so that the volume $V$ decreases at a rate proportional to the square root of $V$.",
      "水从水箱中流出，使体积 $V$ 以与 $V$ 的平方根成正比的速率减少。",
    ),
    right: "\\frac{dV}{dt} = -k\\sqrt{V}",
    wrong: ["\\frac{dV}{dt} = -kV^{2}", "\\frac{dV}{dt} = -\\sqrt{kt}", "\\frac{dV}{dt} = k\\sqrt{V}"],
  };
}

/** modelingWithFirstOrderOdes turns descriptions of rates into equations. */
export const modelingWithFirstOrderOdes: TopicDef = {
  id: "modeling-with-first-order-odes",
  title: t("Modeling With First-Order ODEs", "用一阶常微分方程建模"),
  summary: t('"The rate of change of Q is proportional to X" translates to dQ/dt = kX.', "“Q 的变化率与 X 成正比”可以写成 dQ/dt = kX。"),
  prerequisites: ["introduction-to-differential-equations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "writing-a-model",
      title: t("Writing the equation", "写出方程"),
      explanation: t(
        'A rate of change is a derivative with respect to time, and "proportional to" means "a constant $k$ times". So "the amount $A$ grows at a rate proportional to the square of $A$" is $\\frac{dA}{dt} = kA^{2}$, and "the temperature $T$ changes at a rate proportional to the difference between $T$ and $20^{\\circ}$" is $\\frac{dT}{dt} = k(T - 20)$.',
        "变化率就是对时间的导数，“与……成正比”就是“常数 $k$ 乘以……”。所以“数量 $A$ 以与 $A$ 的平方成正比的速率增长”就是 $\\frac{dA}{dt} = kA^{2}$；“温度 $T$ 的变化率与 $T$ 和 $20^{\\circ}$ 之差成正比”就是 $\\frac{dT}{dt} = k(T - 20)$。",
      ),
      generate(rng) {
        const m = modelCase(rng);
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        return oneOf(
          rng,
          t(
            `${m.words.en} Which differential equation models this ($k$ is a constant)?`,
            `${m.words["zh-CN"]}哪个微分方程描述了这一情形（$k$ 为常数）？`,
          ),
          opt(m.right),
          m.wrong.map(opt),
          t(
            `"Rate of change" is the derivative and "proportional to" is $k$ times, so the model is $${m.right}$.`,
            `“变化率”就是导数，“与……成正比”就是乘以 $k$，所以模型为 $${m.right}$。`,
          ),
        );
      },
    },
    {
      id: "rates-from-a-model",
      title: t("Rates from a model", "由模型求变化率"),
      explanation: t(
        "A differential equation gives the rate of change from the current state. If $\\frac{dT}{dt} = -\\frac{1}{10}(T - 20)$ and $T = 80$, then $\\frac{dT}{dt} = -\\frac{1}{10} \\cdot 60 = -6$: the temperature is falling by $6$ degrees per minute at that moment.",
        "微分方程由当前状态给出变化率。若 $\\frac{dT}{dt} = -\\frac{1}{10}(T - 20)$ 且 $T = 80$，则 $\\frac{dT}{dt} = -\\frac{1}{10} \\cdot 60 = -6$：那一刻温度每分钟下降 $6$ 度。",
      ),
      generate(rng) {
        const kind = rng.int(0, 1);
        if (kind === 0) {
          const k = Q.of(rng.int(1, 9), rng.pick([10, 20, 50, 100]));
          const P = rng.int(1, 20) * 100;
          const answer = k.mul(Q.of(P));
          return numberProblem({
            prompt: t(
              `A population satisfies $\\frac{dP}{dt} = ${k.toLatex()}P$, with $t$ in years. How fast is it growing, in individuals per year, when $P = ${P}$?`,
              `某种群满足 $\\frac{dP}{dt} = ${k.toLatex()}P$，$t$ 以年为单位。当 $P = ${P}$ 时，它每年增长多少个体？`,
            ),
            answer,
            wrong: [Q.of(P), k, answer.add(Q.of(P))],
            solution: t(
              `$\\frac{dP}{dt} = ${k.toLatex()} \\cdot ${P} = ${answer.toLatex()}$.`,
              `$\\frac{dP}{dt} = ${k.toLatex()} \\cdot ${P} = ${answer.toLatex()}$。`,
            ),
          });
        }
        const k = Q.of(1, rng.pick([2, 4, 5, 10, 20]));
        const A = rng.int(1, 5) * 5;
        const T = A + rng.int(1, 16) * 5;
        const answer = k.neg().mul(Q.of(T - A));
        return numberProblem({
          prompt: t(
            `A cooling object satisfies $\\frac{dT}{dt} = -${k.toLatex()}(T - ${A})$, with $t$ in minutes. Find $\\frac{dT}{dt}$ when $T = ${T}$.`,
            `一个冷却中的物体满足 $\\frac{dT}{dt} = -${k.toLatex()}(T - ${A})$，$t$ 以分钟为单位。求 $T = ${T}$ 时的 $\\frac{dT}{dt}$。`,
          ),
          answer,
          wrong: [answer.neg(), k.neg().mul(Q.of(T)), k.neg().mul(Q.of(T)).sub(Q.of(A))],
          solution: t(
            `$\\frac{dT}{dt} = -${k.toLatex()}(${T} - ${A}) = ${answer.toLatex()}$.`,
            `$\\frac{dT}{dt} = -${k.toLatex()}(${T} - ${A}) = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** furtherModelingWithFirstOrderOdes models mixing tanks with rate in minus rate out. */
export const furtherModelingWithFirstOrderOdes: TopicDef = {
  id: "further-modeling-with-first-order-odes",
  title: t("Further Modeling With First-Order ODEs", "用一阶常微分方程进一步建模"),
  summary: t(
    "For a quantity in a tank, dS/dt = (rate in) − (rate out), where the rate out is the outflow times the current concentration.",
    "对水箱中的某种物质，dS/dt =（流入速率）−（流出速率），流出速率等于流出量乘以当前浓度。",
  ),
  prerequisites: ["modeling-with-first-order-odes"],
  encompasses: [{ topic: "modeling-with-first-order-odes", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "mixing-tank-rates",
      title: t("Rates in a mixing tank", "混合问题中的变化率"),
      explanation: t(
        "A tank holds $V$ liters of well-mixed salt water containing $S$ kg of salt. Brine with $c$ kg of salt per liter flows in at $r$ liters per minute, and the mixture flows out at the same rate. Salt enters at $rc$ kg/min and leaves at $r \\cdot \\frac{S}{V}$ kg/min, so\n\n$$\\frac{dS}{dt} = rc - \\frac{rS}{V}.$$\n\nWith $V = 100$, $r = 5$, $c = \\frac{1}{2}$ and $S = 20$: $\\frac{dS}{dt} = \\frac{5}{2} - 1 = \\frac{3}{2}$.",
        "水箱中有 $V$ 升充分混合的盐水，含盐 $S$ 千克。每升含盐 $c$ 千克的盐水以每分钟 $r$ 升流入，混合液以相同速率流出。盐以每分钟 $rc$ 千克流入，以每分钟 $r \\cdot \\frac{S}{V}$ 千克流出，所以\n\n$$\\frac{dS}{dt} = rc - \\frac{rS}{V}。$$\n\n当 $V = 100$，$r = 5$，$c = \\frac{1}{2}$，$S = 20$ 时：$\\frac{dS}{dt} = \\frac{5}{2} - 1 = \\frac{3}{2}$。",
      ),
      generate(rng) {
        const V = rng.pick([100, 200, 400, 500, 1000]);
        const r = rng.pick([2, 4, 5, 10, 20]);
        const c = Q.of(rng.int(1, 4), rng.pick([2, 4, 5, 10]));
        const S = rng.int(1, 20) * 5;
        const into = c.mul(Q.of(r));
        const out = Q.of(r * S, V);
        const answer = into.sub(out);
        return numberProblem({
          prompt: t(
            `A tank holds $${V}$ L of salt water. Brine containing $${c.toLatex()}$ kg of salt per liter flows in at $${r}$ L/min, and the well-mixed solution drains at $${r}$ L/min. Find $\\frac{dS}{dt}$, in kg/min, at the moment the tank contains $S = ${S}$ kg of salt.`,
            `水箱中有 $${V}$ 升盐水。每升含盐 $${c.toLatex()}$ 千克的盐水以每分钟 $${r}$ 升流入，充分混合的溶液以每分钟 $${r}$ 升流出。求水箱含盐 $S = ${S}$ 千克的那一刻的 $\\frac{dS}{dt}$（千克/分钟）。`,
          ),
          answer,
          wrong: [into.add(out), into, into.sub(Q.of(S, V))],
          solution: t(
            `Rate in $= ${r} \\cdot ${c.toLatex()} = ${into.toLatex()}$; rate out $= ${r} \\cdot \\frac{${S}}{${V}} = ${out.toLatex()}$. So $\\frac{dS}{dt} = ${into.toLatex()} - ${out.toLatex()} = ${answer.toLatex()}$.`,
            `流入速率 $= ${r} \\cdot ${c.toLatex()} = ${into.toLatex()}$；流出速率 $= ${r} \\cdot \\frac{${S}}{${V}} = ${out.toLatex()}$。所以 $\\frac{dS}{dt} = ${into.toLatex()} - ${out.toLatex()} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "long-run-amount-in-a-tank",
      title: t("The long-run amount", "长期的含量"),
      explanation: t(
        "The salt stops changing when $\\frac{dS}{dt} = 0$, that is $rc = \\frac{rS}{V}$, or $S = cV$: the tank ends up with the concentration of the incoming brine. With $V = 200$ L and $c = \\frac{1}{4}$ kg/L, the amount approaches $50$ kg.",
        "当 $\\frac{dS}{dt} = 0$ 即 $rc = \\frac{rS}{V}$ 时，含盐量不再变化，此时 $S = cV$：水箱最终达到流入盐水的浓度。当 $V = 200$ 升、$c = \\frac{1}{4}$ 千克/升时，含盐量趋于 $50$ 千克。",
      ),
      generate(rng) {
        const V = rng.pick([100, 200, 400, 500, 1000]);
        const r = rng.pick([2, 4, 5, 10, 20]);
        const c = Q.of(rng.int(1, 4), rng.pick([2, 4, 5, 10]));
        const S0 = rng.int(0, 10) * 5;
        const answer = c.mul(Q.of(V));
        return numberProblem({
          prompt: t(
            `A tank holds $${V}$ L of water containing $${S0}$ kg of salt. Brine containing $${c.toLatex()}$ kg of salt per liter flows in at $${r}$ L/min, and the well-mixed solution drains at the same rate. How many kilograms of salt does the tank contain in the long run?`,
            `水箱中有 $${V}$ 升水，含盐 $${S0}$ 千克。每升含盐 $${c.toLatex()}$ 千克的盐水以每分钟 $${r}$ 升流入，充分混合的溶液以相同速率流出。长期来看水箱中含盐多少千克？`,
          ),
          answer,
          wrong: [c.mul(Q.of(r)), answer.add(Q.of(S0)), Q.of(S0)],
          solution: t(
            `$\\frac{dS}{dt} = ${r} \\cdot ${c.toLatex()} - \\frac{${r}S}{${V}}$ is $0$ when $S = ${c.toLatex()} \\cdot ${V} = ${answer.toLatex()}$, and $S$ approaches this value whatever its starting amount.`,
            `当 $S = ${c.toLatex()} \\cdot ${V} = ${answer.toLatex()}$ 时 $\\frac{dS}{dt} = ${r} \\cdot ${c.toLatex()} - \\frac{${r}S}{${V}}$ 为 $0$，无论初始含量多少，$S$ 都趋于这个值。`,
          ),
        });
      },
    },
  ],
};

/** directions are what a solution curve does at a point. */
const directions = [t("Increasing", "递增"), t("Decreasing", "递减"), t("Neither: the slope is 0 there", "都不是：该处斜率为 0")] as const;

/** qualitativeAnalysisOfFirstOrderOdes reads the shape of solutions from the equation. */
export const qualitativeAnalysisOfFirstOrderOdes: TopicDef = {
  id: "qualitative-analysis-of-first-order-odes",
  title: t("Qualitative Analysis of First-Order ODEs", "一阶常微分方程的定性分析"),
  summary: t(
    "dy/dx = f(x, y) gives the slope of the solution through each point; differentiating again gives its concavity.",
    "dy/dx = f(x, y) 给出过每一点的解曲线的斜率；再求导一次得到凹凸性。",
  ),
  prerequisites: ["introduction-to-differential-equations", "implicit-differentiation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "increasing-or-decreasing-solutions",
      title: t("Increasing or decreasing", "递增还是递减"),
      explanation: t(
        "Without solving, $\\frac{dy}{dx} = f(x, y)$ tells the slope of the solution curve through any point. For $\\frac{dy}{dx} = x - 2y$ at $(1, 3)$: $1 - 6 = -5 < 0$, so the solution through $(1, 3)$ is decreasing there.",
        "不必求解，$\\frac{dy}{dx} = f(x, y)$ 就告诉我们过任一点的解曲线的斜率。对 $\\frac{dy}{dx} = x - 2y$，在 $(1, 3)$ 处：$1 - 6 = -5 < 0$，所以过 $(1, 3)$ 的解在该处递减。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        const c = rng.int(0, 3) === 0 ? -(a * x0 + b * y0) : rng.int(-5, 5);
        const v = a * x0 + b * y0 + c;
        const rhs = poly([a, "x"], [b, "y"], [c, ""]);
        const right = v > 0 ? 0 : v < 0 ? 1 : 2;
        return oneOf(
          rng,
          t(
            `Let $y$ be the solution of $\\frac{dy}{dx} = ${rhs}$ whose graph passes through $(${x0}, ${y0})$. Is it increasing or decreasing at that point?`,
            `设 $y$ 是 $\\frac{dy}{dx} = ${rhs}$ 的图像经过 $(${x0}, ${y0})$ 的解。它在该点递增还是递减？`,
          ),
          directions[right],
          directions.filter((_, i) => i !== right),
          t(
            `At $(${x0}, ${y0})$: $\\frac{dy}{dx} = ${a} \\cdot ${neg(x0)} + ${neg(b)} \\cdot ${neg(y0)} + ${neg(c)} = ${v}$, so the solution is ${v > 0 ? "increasing" : v < 0 ? "decreasing" : "neither increasing nor decreasing"} there.`,
            `在 $(${x0}, ${y0})$ 处：$\\frac{dy}{dx} = ${a} \\cdot ${neg(x0)} + ${neg(b)} \\cdot ${neg(y0)} + ${neg(c)} = ${v}$，所以解在该处${v > 0 ? "递增" : v < 0 ? "递减" : "既不递增也不递减"}。`,
          ),
        );
      },
    },
    {
      id: "concavity-of-solutions",
      title: t("Concavity of solutions", "解的凹凸性"),
      explanation: t(
        "Differentiate the equation implicitly, remembering that $y$ depends on $x$. For $\\frac{dy}{dx} = x + y$: $\\frac{d^{2}y}{dx^{2}} = 1 + \\frac{dy}{dx} = 1 + x + y$. At $(0, 2)$ this is $3 > 0$, so the solution is concave up there.",
        "对方程作隐函数求导，记住 $y$ 依赖于 $x$。对 $\\frac{dy}{dx} = x + y$：$\\frac{d^{2}y}{dx^{2}} = 1 + \\frac{dy}{dx} = 1 + x + y$。在 $(0, 2)$ 处它等于 $3 > 0$，所以解在该处上凹。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 3);
        const rhs = poly([a, "x"], [b, "y"]);
        const slope = a * x0 + b * y0;
        const answer = a + b * slope;
        return numberProblem({
          prompt: t(
            `For the solution of $\\frac{dy}{dx} = ${rhs}$ through $(${x0}, ${y0})$, find $\\frac{d^{2}y}{dx^{2}}$ at that point.`,
            `对 $\\frac{dy}{dx} = ${rhs}$ 过 $(${x0}, ${y0})$ 的解，求它在该点的 $\\frac{d^{2}y}{dx^{2}}$。`,
          ),
          answer,
          wrong: [a + b, slope, a * x0 + b],
          solution: t(
            `$\\frac{d^{2}y}{dx^{2}} = ${poly([a, ""], [b, "\\frac{dy}{dx}"])}$. At $(${x0}, ${y0})$, $\\frac{dy}{dx} = ${slope}$, so $\\frac{d^{2}y}{dx^{2}} = ${a} + ${neg(b)} \\cdot ${neg(slope)} = ${answer}$.`,
            `$\\frac{d^{2}y}{dx^{2}} = ${poly([a, ""], [b, "\\frac{dy}{dx}"])}$。在 $(${x0}, ${y0})$ 处 $\\frac{dy}{dx} = ${slope}$，所以 $\\frac{d^{2}y}{dx^{2}} = ${a} + ${neg(b)} \\cdot ${neg(slope)} = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** stabilities classify an equilibrium. */
const stabilities = [
  t("Stable: nearby solutions approach it", "稳定：附近的解趋向它"),
  t("Unstable: nearby solutions move away from it", "不稳定：附近的解远离它"),
  t("Semi-stable: solutions approach it from one side only", "半稳定：只有一侧的解趋向它"),
] as const;

/** equilibriumSolutionsOfFirstOrderOdes finds constant solutions of autonomous equations and classifies them. */
export const equilibriumSolutionsOfFirstOrderOdes: TopicDef = {
  id: "equilibrium-solutions-of-first-order-odes",
  title: t("Equilibrium Solutions of First-Order ODEs", "一阶常微分方程的平衡解"),
  summary: t(
    "For dy/dt = f(y), each zero c of f gives a constant solution y = c, which is stable or unstable according to the sign of f on either side.",
    "对 dy/dt = f(y)，f 的每个零点 c 给出常数解 y = c；按 f 在两侧的符号判断它稳定还是不稳定。",
  ),
  prerequisites: ["qualitative-analysis-of-first-order-odes"],
  encompasses: [{ topic: "qualitative-analysis-of-first-order-odes", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-equilibrium-solutions",
      title: t("Finding equilibrium solutions", "求平衡解"),
      explanation: t(
        "An equation $\\frac{dy}{dt} = f(y)$ whose right side does not involve $t$ is **autonomous**. If $f(c) = 0$, the constant function $y = c$ is a solution, called an **equilibrium solution**. For $\\frac{dy}{dt} = y^{2} - 5y + 6 = (y - 2)(y - 3)$, the equilibria are $y = 2$ and $y = 3$.",
        "右边不含 $t$ 的方程 $\\frac{dy}{dt} = f(y)$ 叫做**自治方程**。若 $f(c) = 0$，常函数 $y = c$ 就是解，称为**平衡解**。对 $\\frac{dy}{dt} = y^{2} - 5y + 6 = (y - 2)(y - 3)$，平衡解为 $y = 2$ 和 $y = 3$。",
      ),
      generate(rng) {
        const a = rng.int(-6, 5);
        const b = rng.int(a + 1, 7);
        const k = rng.nonZero(-3, 3);
        const f = poly([k, "y^{2}"], [-k * (a + b), "y"], [k * a * b, ""]);
        const larger = rng.bool();
        return numberProblem({
          prompt: t(
            `The equation $\\frac{dy}{dt} = ${f}$ has two equilibrium solutions. Find the ${larger ? "larger" : "smaller"} one.`,
            `方程 $\\frac{dy}{dt} = ${f}$ 有两个平衡解。求${larger ? "较大" : "较小"}的那个。`,
          ),
          answer: larger ? b : a,
          wrong: [larger ? a : b, -b, -a, 0],
          solution: t(
            `$${f} = ${k === 1 ? "" : k === -1 ? "-" : k}${factors(a, b)} = 0$ when $y = ${a}$ or $y = ${b}$. The ${larger ? "larger" : "smaller"} equilibrium is $y = ${larger ? b : a}$.`,
            `当 $y = ${a}$ 或 $y = ${b}$ 时 $${f} = ${k === 1 ? "" : k === -1 ? "-" : k}${factors(a, b)} = 0$。${larger ? "较大" : "较小"}的平衡解是 $y = ${larger ? b : a}$。`,
          ),
        });
      },
    },
    {
      id: "stability-of-equilibrium-solutions",
      title: t("Stability of equilibria", "平衡解的稳定性"),
      explanation: t(
        "Look at the sign of $f(y)$ just below and just above an equilibrium $c$. If $y$ increases below $c$ and decreases above it, solutions move toward $c$: it is **stable**. If they move away on both sides, it is **unstable**. If $f$ has the same sign on both sides, as for $\\frac{dy}{dt} = (y - 1)^{2}$, solutions approach from one side only: **semi-stable**.",
        "看平衡解 $c$ 稍下方和稍上方 $f(y)$ 的符号。若在 $c$ 下方 $y$ 递增、在上方递减，解都朝 $c$ 移动：它是**稳定**的。若两侧的解都远离 $c$，它是**不稳定**的。若 $f$ 在两侧同号，例如 $\\frac{dy}{dt} = (y - 1)^{2}$，解只从一侧趋向它：**半稳定**。",
      ),
      generate(rng) {
        const a = rng.int(-6, 5);
        const b = rng.int(a + 1, 7);
        const k = rng.pick([-1, 1, -2, 2]);
        const kTex = k === 1 ? "" : k === -1 ? "-" : `${k}`;
        if (rng.int(0, 3) === 0) {
          const f = `${kTex}${a === 0 ? "y" : `(${linear(1, -a, "y")})`}^{2}`;
          return oneOf(
            rng,
            t(
              `Classify the equilibrium $y = ${a}$ of $\\frac{dy}{dt} = ${f}$.`,
              `判断 $\\frac{dy}{dt} = ${f}$ 的平衡解 $y = ${a}$ 的稳定性。`,
            ),
            stabilities[2],
            [stabilities[0], stabilities[1]],
            t(
              `$\\frac{dy}{dt}$ is ${k > 0 ? "positive" : "negative"} on both sides of $${a}$, so solutions on one side move toward it and on the other side away from it: semi-stable.`,
              `$\\frac{dy}{dt}$ 在 $${a}$ 两侧都${k > 0 ? "为正" : "为负"}，所以一侧的解趋向它，另一侧的解远离它：半稳定。`,
            ),
          );
        }
        const f = `${kTex}${factors(a, b)}`;
        const atLower = rng.bool();
        const c = atLower ? a : b;
        // Between a and b the product (y − a)(y − b) is negative.
        const between = -k > 0;
        const stable = atLower ? !between : between;
        return oneOf(
          rng,
          t(
            `Classify the equilibrium $y = ${c}$ of $\\frac{dy}{dt} = ${f}$.`,
            `判断 $\\frac{dy}{dt} = ${f}$ 的平衡解 $y = ${c}$ 的稳定性。`,
          ),
          stabilities[stable ? 0 : 1],
          [stabilities[stable ? 1 : 0], stabilities[2]],
          t(
            `For $${a} < y < ${b}$, $\\frac{dy}{dt}$ is ${between ? "positive" : "negative"}; ${atLower ? `for $y < ${a}$` : `for $y > ${b}$`} it is ${between ? "negative" : "positive"}. So solutions ${stable ? "move toward" : "move away from"} $y = ${c}$ on both sides: it is ${stable ? "stable" : "unstable"}.`,
            `当 $${a} < y < ${b}$ 时 $\\frac{dy}{dt}$ ${between ? "为正" : "为负"}；${atLower ? `当 $y < ${a}$ 时` : `当 $y > ${b}$ 时`}它${between ? "为负" : "为正"}。所以两侧的解都${stable ? "趋向" : "远离"} $y = ${c}$：它是${stable ? "稳定" : "不稳定"}的。`,
          ),
        );
      },
    },
  ],
};

/** rates are growth constants k for exponential models. */
const rates = [
  Q.of(1, 2),
  Q.of(1, 3),
  Q.of(1, 4),
  Q.of(1, 10),
  Q.of(3, 100),
  Q.of(-1, 2),
  Q.of(-1, 5),
  Q.of(-1, 10),
  Q.of(2),
  Q.of(-3),
] as const;

/** exponentialGrowthAndDecayModelsWithFirstOrderOdes solves dy/dt = ky. */
export const exponentialGrowthAndDecayModelsWithFirstOrderOdes: TopicDef = {
  id: "exponential-growth-and-decay-models-with-first-order-odes",
  title: t("Exponential Growth and Decay Models With First-Order ODEs", "用一阶常微分方程建立指数增长与衰减模型"),
  summary: t(
    "The solution of dy/dt = ky with y(0) = y₀ is y = y₀e^{kt}: growth when k > 0, decay when k < 0.",
    "dy/dt = ky，y(0) = y₀ 的解为 y = y₀e^{kt}：k > 0 时增长，k < 0 时衰减。",
  ),
  prerequisites: ["solving-first-order-ivps-using-separation-of-variables", "modeling-with-first-order-odes"],
  encompasses: [{ topic: "solving-first-order-ivps-using-separation-of-variables", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "solving-the-exponential-model",
      title: t("Solving dy/dt = ky", "解 dy/dt = ky"),
      explanation: t(
        "Separating $\\frac{dy}{dt} = ky$ gives $\\ln|y| = kt + C$, so $y = y_0e^{kt}$, where $y_0 = y(0)$. A quantity whose rate of change is proportional to itself grows exponentially when $k > 0$ and decays when $k < 0$. For $\\frac{dP}{dt} = 0.04P$ with $P(0) = 500$: $P(t) = 500e^{0.04t}$.",
        "对 $\\frac{dy}{dt} = ky$ 分离变量得 $\\ln|y| = kt + C$，所以 $y = y_0e^{kt}$，其中 $y_0 = y(0)$。变化率与自身成正比的量，在 $k > 0$ 时指数增长，在 $k < 0$ 时指数衰减。对 $\\frac{dP}{dt} = 0.04P$，$P(0) = 500$：$P(t) = 500e^{0.04t}$。",
      ),
      generate(rng) {
        const k = rng.pick(rates);
        const P0 = rng.int(1, 40) * 25;
        const kt = poly([k, "t"]);
        const answer = `${P0}e^{${kt}}`;
        return functionProblem({
          prompt: t(
            `Solve $\\frac{dP}{dt} = ${poly([k, "P"])}$ with $P(0) = ${P0}$.`,
            `解 $\\frac{dP}{dt} = ${poly([k, "P"])}$，$P(0) = ${P0}$。`,
          ),
          answer,
          variable: "t",
          prefix: "P(t) =",
          wrong: [`${P0}e^{${poly([k.neg(), "t"])}}`, `e^{${kt}} + ${P0 - 1}`, `${P0}e^{t}`],
          solution: t(
            `Separating gives $P = Ce^{${kt}}$, and $P(0) = C = ${P0}$. So $P(t) = ${answer}$.`,
            `分离变量得 $P = Ce^{${kt}}$，由 $P(0) = C = ${P0}$ 得 $P(t) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "values-from-a-doubling-time",
      title: t("Values from a doubling or tripling time", "由倍增时间求值"),
      explanation: t(
        "If $y = y_0e^{kt}$ doubles every $d$ units of time, then $e^{kd} = 2$ and $y = y_0 \\cdot 2^{t/d}$. A culture of $300$ bacteria that doubles every $4$ hours has $300 \\cdot 2^{3} = 2400$ bacteria after $12$ hours.",
        "若 $y = y_0e^{kt}$ 每隔 $d$ 个时间单位翻一倍，则 $e^{kd} = 2$，$y = y_0 \\cdot 2^{t/d}$。一个每 $4$ 小时翻倍、初始有 $300$ 个细菌的菌落，$12$ 小时后有 $300 \\cdot 2^{3} = 2400$ 个细菌。",
      ),
      generate(rng) {
        const m = rng.pick([2, 3]);
        const d = rng.int(2, 12);
        const j = rng.int(2, 5);
        const P0 = rng.int(1, 20) * 50;
        const answer = P0 * m ** j;
        const word = m === 2 ? t("doubles", "翻一倍") : t("triples", "变为原来的三倍");
        return numberProblem({
          prompt: t(
            `A culture grows according to $\\frac{dP}{dt} = kP$ and ${word.en} every $${d}$ hours. If $P(0) = ${P0}$, find $P(${j * d})$.`,
            `某菌落按 $\\frac{dP}{dt} = kP$ 增长，每 $${d}$ 小时${word["zh-CN"]}。若 $P(0) = ${P0}$，求 $P(${j * d})$。`,
          ),
          answer,
          wrong: [P0 * m * j, P0 * m ** (j - 1), P0 + m ** j],
          solution: t(
            `$${j * d}$ hours is $${j}$ periods of $${d}$ hours, so $P(${j * d}) = ${P0} \\cdot ${m}^{${j}} = ${answer}$.`,
            `$${j * d}$ 小时是 $${j}$ 个 $${d}$ 小时的周期，所以 $P(${j * d}) = ${P0} \\cdot ${m}^{${j}} = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** exponentialGrowthAndDecayModelsWithFirstOrderOdesCalculatingUnknownTimesAndInitialValues runs the model backwards. */
export const exponentialGrowthAndDecayModelsWithFirstOrderOdesCalculatingUnknownTimesAndInitialValues: TopicDef = {
  id: "exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values",
  title: t(
    "Exponential Growth and Decay Models With First-Order ODEs: Calculating Unknown Times and Initial Values",
    "用一阶常微分方程建立指数增长与衰减模型：求未知时间与初始值",
  ),
  summary: t(
    "Solve y₀ · m^{t/d} = y for t to find when a value is reached, or for y₀ to find the starting amount.",
    "解 y₀ · m^{t/d} = y 中的 t 求出何时达到某值，或解 y₀ 求出初始量。",
  ),
  prerequisites: ["exponential-growth-and-decay-models-with-first-order-odes"],
  encompasses: [{ topic: "exponential-growth-and-decay-models-with-first-order-odes", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-an-unknown-time",
      title: t("Finding an unknown time", "求未知时间"),
      explanation: t(
        "If $P$ doubles every $d$ years, then $P = P_0 \\cdot 2^{t/d}$. To reach $8P_0$ we need $2^{t/d} = 8 = 2^{3}$, so $t = 3d$. In general, solving $e^{kt} = m$ gives $t = \\frac{\\ln m}{k}$.",
        "若 $P$ 每 $d$ 年翻一倍，则 $P = P_0 \\cdot 2^{t/d}$。要达到 $8P_0$，需要 $2^{t/d} = 8 = 2^{3}$，所以 $t = 3d$。一般地，解 $e^{kt} = m$ 得 $t = \\frac{\\ln m}{k}$。",
      ),
      generate(rng) {
        const m = rng.pick([2, 3]);
        const d = rng.int(2, 15);
        const j = rng.int(2, 5);
        const P0 = rng.int(1, 20) * 100;
        const target = P0 * m ** j;
        const answer = j * d;
        const word = m === 2 ? t("doubles", "翻一倍") : t("triples", "变为原来的三倍");
        return numberProblem({
          prompt: t(
            `An investment grows according to $\\frac{dA}{dt} = kA$ and ${word.en} every $${d}$ years. It starts at $${P0}$. After how many years is it worth $${target}$?`,
            `一笔投资按 $\\frac{dA}{dt} = kA$ 增长，每 $${d}$ 年${word["zh-CN"]}。初始为 $${P0}$。多少年后它价值 $${target}$？`,
          ),
          answer,
          wrong: [Math.round((target / P0) * d), j, (j + 1) * d],
          solution: t(
            `$\\frac{${target}}{${P0}} = ${m ** j} = ${m}^{${j}}$, so it takes $${j}$ periods of $${d}$ years: $t = ${answer}$.`,
            `$\\frac{${target}}{${P0}} = ${m ** j} = ${m}^{${j}}$，所以需要 $${j}$ 个 $${d}$ 年的周期：$t = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "finding-an-initial-value",
      title: t("Finding an initial value", "求初始值"),
      explanation: t(
        "Run the model backwards. If a population that triples every $5$ years is $4050$ after $15$ years, then $P_0 \\cdot 3^{3} = 4050$, so $P_0 = \\frac{4050}{27} = 150$.",
        "把模型倒过来用。若一个每 $5$ 年变为三倍的种群在 $15$ 年后为 $4050$，则 $P_0 \\cdot 3^{3} = 4050$，所以 $P_0 = \\frac{4050}{27} = 150$。",
      ),
      generate(rng) {
        const m = rng.pick([2, 3]);
        const d = rng.int(2, 12);
        const j = rng.int(1, 4);
        const P0 = rng.int(1, 30) * 10;
        const later = P0 * m ** j;
        const word = m === 2 ? t("doubles", "翻一倍") : t("triples", "变为原来的三倍");
        return numberProblem({
          prompt: t(
            `A population grows according to $\\frac{dP}{dt} = kP$ and ${word.en} every $${d}$ years. After $${j * d}$ years it is $${later}$. What was its initial size?`,
            `某种群按 $\\frac{dP}{dt} = kP$ 增长，每 $${d}$ 年${word["zh-CN"]}。$${j * d}$ 年后为 $${later}$。初始数量是多少？`,
          ),
          answer: P0,
          wrong: [later * m ** j, Q.of(later, m * j), Q.of(later, j * d)],
          solution: t(
            `$${j * d}$ years is $${j}$ periods, so $P_0 \\cdot ${m}^{${j}} = ${later}$ and $P_0 = \\frac{${later}}{${m ** j}} = ${P0}$.`,
            `$${j * d}$ 年是 $${j}$ 个周期，所以 $P_0 \\cdot ${m}^{${j}} = ${later}$，$P_0 = \\frac{${later}}{${m ** j}} = ${P0}$。`,
          ),
        });
      },
    },
  ],
};

/** exponentialGrowthAndDecayModelsWithFirstOrderOdesHalfLifeProblems uses half-lives for decay. */
export const exponentialGrowthAndDecayModelsWithFirstOrderOdesHalfLifeProblems: TopicDef = {
  id: "exponential-growth-and-decay-models-with-first-order-odes-half-life-problems",
  title: t(
    "Exponential Growth and Decay Models With First-Order ODEs: Half-Life Problems",
    "用一阶常微分方程建立指数增长与衰减模型：半衰期问题",
  ),
  summary: t(
    "A substance with dA/dt = kA (k < 0) halves every h = ln 2/|k|, so A = A₀(1/2)^{t/h}.",
    "满足 dA/dt = kA（k < 0）的物质每经过 h = ln 2/|k| 减半，所以 A = A₀(1/2)^{t/h}。",
  ),
  prerequisites: ["exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values"],
  encompasses: [
    {
      topic: "exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values",
      weight: 0.4,
    },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "amount-remaining-after-half-lives",
      title: t("The amount remaining", "剩余的量"),
      explanation: t(
        "The **half-life** $h$ is the time for a decaying quantity to halve: $e^{kh} = \\frac{1}{2}$, so $h = \\frac{\\ln 2}{|k|}$ and $A = A_0\\left(\\frac{1}{2}\\right)^{t/h}$. With $A_0 = 80$ mg and $h = 6$ hours, after $18$ hours $A = 80 \\cdot \\frac{1}{8} = 10$ mg.",
        "**半衰期** $h$ 是衰减量减半所需的时间：$e^{kh} = \\frac{1}{2}$，所以 $h = \\frac{\\ln 2}{|k|}$，$A = A_0\\left(\\frac{1}{2}\\right)^{t/h}$。当 $A_0 = 80$ 毫克、$h = 6$ 小时时，$18$ 小时后 $A = 80 \\cdot \\frac{1}{8} = 10$ 毫克。",
      ),
      generate(rng) {
        const h = rng.int(2, 30);
        const j = rng.int(1, 5);
        const A0 = rng.int(1, 20) * 2 ** j * 5;
        const answer = A0 / 2 ** j;
        return numberProblem({
          prompt: t(
            `A radioactive sample of $${A0}$ g decays according to $\\frac{dA}{dt} = kA$ and has a half-life of $${h}$ days. How many grams remain after $${j * h}$ days?`,
            `一份 $${A0}$ 克的放射性样品按 $\\frac{dA}{dt} = kA$ 衰变，半衰期为 $${h}$ 天。$${j * h}$ 天后剩余多少克？`,
          ),
          answer,
          wrong: [A0 - answer, Q.of(A0, 2 * j), answer * 2],
          solution: t(
            `$${j * h}$ days is $${j}$ half-lives, so $A = ${A0}\\left(\\frac{1}{2}\\right)^{${j}} = ${answer}$.`,
            `$${j * h}$ 天是 $${j}$ 个半衰期，所以 $A = ${A0}\\left(\\frac{1}{2}\\right)^{${j}} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "time-to-decay",
      title: t("Time to decay", "衰减所需的时间"),
      explanation: t(
        "Count half-lives. A drug with a half-life of $4$ hours falls to $12.5\\% = \\frac{1}{8}$ of its dose after $3$ half-lives, that is $12$ hours.",
        "数半衰期的个数。半衰期为 $4$ 小时的药物，降到剂量的 $12.5\\% = \\frac{1}{8}$ 需要 $3$ 个半衰期，即 $12$ 小时。",
      ),
      generate(rng) {
        const h = rng.int(2, 30);
        const j = rng.int(1, 5);
        const A0 = rng.int(1, 20) * 2 ** j * 5;
        const end = A0 / 2 ** j;
        return numberProblem({
          prompt: t(
            `A substance decays according to $\\frac{dA}{dt} = kA$ with a half-life of $${h}$ years. How long does it take $${A0}$ g to decay to $${end}$ g?`,
            `某物质按 $\\frac{dA}{dt} = kA$ 衰变，半衰期为 $${h}$ 年。$${A0}$ 克衰变到 $${end}$ 克需要多少年？`,
          ),
          answer: j * h,
          wrong: [Q.of(A0 * h, 2 * end), j, (j + 1) * h],
          solution: t(
            `$\\frac{${end}}{${A0}} = \\frac{1}{${2 ** j}} = \\left(\\frac{1}{2}\\right)^{${j}}$, which is $${j}$ half-lives: $${j} \\cdot ${h} = ${j * h}$ years.`,
            `$\\frac{${end}}{${A0}} = \\frac{1}{${2 ** j}} = \\left(\\frac{1}{2}\\right)^{${j}}$，即 $${j}$ 个半衰期：$${j} \\cdot ${h} = ${j * h}$ 年。`,
          ),
        });
      },
    },
  ],
};

/** Logistic is dP/dt = kP(1 − P/K), written as k and K. */
interface Logistic {
  readonly k: Q;
  readonly K: number;
  readonly tex: string;
}

/** logistic picks a logistic equation, written either in standard form or as aP − bP². */
function logistic(rng: Rng): Logistic {
  const k = Q.of(1, rng.pick([2, 4, 5, 10, 20, 50]));
  const K = rng.int(2, 40) * 50;
  const tex = rng.bool() ? `${k.toLatex()}P\\left(1 - \\frac{P}{${K}}\\right)` : poly([k, "P"], [k.div(Q.of(K)).neg(), "P^{2}"]);
  return { k, K, tex };
}

/** logisticGrowthModelsWithFirstOrderOdes introduces the carrying capacity. */
export const logisticGrowthModelsWithFirstOrderOdes: TopicDef = {
  id: "logistic-growth-models-with-first-order-odes",
  title: t("Logistic Growth Models With First-Order ODEs", "用一阶常微分方程建立逻辑斯谛增长模型"),
  summary: t(
    "dP/dt = kP(1 − P/K) models growth that slows as P approaches the carrying capacity K.",
    "dP/dt = kP(1 − P/K) 描述的增长在 P 接近环境容纳量 K 时放缓。",
  ),
  prerequisites: ["exponential-growth-and-decay-models-with-first-order-odes", "equilibrium-solutions-of-first-order-odes"],
  encompasses: [{ topic: "exponential-growth-and-decay-models-with-first-order-odes", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "carrying-capacity",
      title: t("The carrying capacity", "环境容纳量"),
      explanation: t(
        "The **logistic equation** $\\frac{dP}{dt} = kP\\left(1 - \\frac{P}{K}\\right)$ behaves like $kP$ when $P$ is small, but the factor $1 - \\frac{P}{K}$ slows growth as $P$ nears $K$, the **carrying capacity**. Written as $\\frac{dP}{dt} = aP - bP^{2} = aP\\left(1 - \\frac{b}{a}P\\right)$, the carrying capacity is $K = \\frac{a}{b}$: for $\\frac{dP}{dt} = 0.2P - 0.001P^{2}$, $K = 200$.",
        "**逻辑斯谛方程** $\\frac{dP}{dt} = kP\\left(1 - \\frac{P}{K}\\right)$ 在 $P$ 较小时近似于 $kP$，但因子 $1 - \\frac{P}{K}$ 使增长在 $P$ 接近 $K$ 时放缓，$K$ 叫做**环境容纳量**。若写成 $\\frac{dP}{dt} = aP - bP^{2} = aP\\left(1 - \\frac{b}{a}P\\right)$，则环境容纳量为 $K = \\frac{a}{b}$：对 $\\frac{dP}{dt} = 0.2P - 0.001P^{2}$，$K = 200$。",
      ),
      generate(rng) {
        const L = logistic(rng);
        return numberProblem({
          prompt: t(
            `A population satisfies $\\frac{dP}{dt} = ${L.tex}$. Find its carrying capacity.`,
            `某种群满足 $\\frac{dP}{dt} = ${L.tex}$。求它的环境容纳量。`,
          ),
          answer: L.K,
          wrong: [L.k, L.K / 2, Q.one.div(L.k)],
          solution: t(
            `$\\frac{dP}{dt} = ${L.k.toLatex()}P\\left(1 - \\frac{P}{${L.K}}\\right)$, so the carrying capacity is $K = ${L.K}$.`,
            `$\\frac{dP}{dt} = ${L.k.toLatex()}P\\left(1 - \\frac{P}{${L.K}}\\right)$，所以环境容纳量为 $K = ${L.K}$。`,
          ),
        });
      },
    },
    {
      id: "logistic-growth-rates",
      title: t("Growth rates in a logistic model", "逻辑斯谛模型中的增长速率"),
      explanation: t(
        "Substitute the current population. For $\\frac{dP}{dt} = 0.1P\\left(1 - \\frac{P}{500}\\right)$ at $P = 100$: $0.1 \\cdot 100 \\cdot \\frac{4}{5} = 8$ individuals per unit of time.",
        "代入当前种群数量。对 $\\frac{dP}{dt} = 0.1P\\left(1 - \\frac{P}{500}\\right)$，在 $P = 100$ 时：$0.1 \\cdot 100 \\cdot \\frac{4}{5} = 8$，即每单位时间增加 $8$ 个个体。",
      ),
      generate(rng) {
        const L = logistic(rng);
        const P = (L.K / 50) * rng.int(1, 9) * 5;
        const answer = L.k.mul(Q.of(P)).mul(Q.one.sub(Q.of(P, L.K)));
        return numberProblem({
          prompt: t(
            `A population satisfies $\\frac{dP}{dt} = ${L.tex}$. Find $\\frac{dP}{dt}$ when $P = ${P}$.`,
            `某种群满足 $\\frac{dP}{dt} = ${L.tex}$。求 $P = ${P}$ 时的 $\\frac{dP}{dt}$。`,
          ),
          answer,
          wrong: [L.k.mul(Q.of(P)), L.k.mul(Q.of(P)).mul(Q.of(P, L.K)), answer.neg()],
          solution: t(
            `$\\frac{dP}{dt} = ${L.k.toLatex()} \\cdot ${P} \\cdot \\left(1 - \\frac{${P}}{${L.K}}\\right) = ${answer.toLatex()}$.`,
            `$\\frac{dP}{dt} = ${L.k.toLatex()} \\cdot ${P} \\cdot \\left(1 - \\frac{${P}}{${L.K}}\\right) = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** trends are what a logistic population does over time. */
const trends = [
  t("It increases and approaches the carrying capacity.", "递增并趋于环境容纳量。"),
  t("It decreases and approaches the carrying capacity.", "递减并趋于环境容纳量。"),
  t("It stays constant.", "保持不变。"),
  t("It increases without bound.", "无限递增。"),
] as const;

/** qualitativeAnalysisOfTheLogisticGrowthEquation describes logistic solutions without solving. */
export const qualitativeAnalysisOfTheLogisticGrowthEquation: TopicDef = {
  id: "qualitative-analysis-of-the-logistic-growth-equation",
  title: t("Qualitative Analysis of the Logistic Growth Equation", "逻辑斯谛增长方程的定性分析"),
  summary: t(
    "Positive solutions tend to K; they grow fastest at P = K/2, where the graph has an inflection point.",
    "正的解都趋于 K；在 P = K/2 处增长最快，图像在此处有拐点。",
  ),
  prerequisites: ["logistic-growth-models-with-first-order-odes"],
  encompasses: [{ topic: "logistic-growth-models-with-first-order-odes", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "long-run-behavior-of-logistic-solutions",
      title: t("Long-run behavior", "长期性态"),
      explanation: t(
        "The equilibria are $P = 0$ (unstable) and $P = K$ (stable). If $0 < P(0) < K$, then $\\frac{dP}{dt} > 0$ and $P$ rises toward $K$; if $P(0) > K$, then $\\frac{dP}{dt} < 0$ and $P$ falls toward $K$; if $P(0) = K$, $P$ stays at $K$.",
        "平衡解为 $P = 0$（不稳定）和 $P = K$（稳定）。若 $0 < P(0) < K$，则 $\\frac{dP}{dt} > 0$，$P$ 上升趋于 $K$；若 $P(0) > K$，则 $\\frac{dP}{dt} < 0$，$P$ 下降趋于 $K$；若 $P(0) = K$，$P$ 保持为 $K$。",
      ),
      generate(rng) {
        const L = logistic(rng);
        const kind = rng.int(0, 4);
        const P0 = kind === 4 ? L.K : kind < 2 ? (L.K / 50) * rng.int(1, 9) * 5 : L.K + rng.int(1, 10) * 50;
        const right = P0 < L.K ? 0 : P0 > L.K ? 1 : 2;
        return oneOf(
          rng,
          t(
            `A population satisfies $\\frac{dP}{dt} = ${L.tex}$ with $P(0) = ${P0}$. How does $P$ behave as $t$ increases?`,
            `某种群满足 $\\frac{dP}{dt} = ${L.tex}$，$P(0) = ${P0}$。随着 $t$ 增大，$P$ 如何变化？`,
          ),
          trends[right],
          trends.filter((_, i) => i !== right),
          t(
            `The carrying capacity is $${L.K}$. ${right === 0 ? `Since $0 < ${P0} < ${L.K}$, $\\frac{dP}{dt} > 0$ and $P$ rises toward $${L.K}$.` : right === 1 ? `Since $${P0} > ${L.K}$, $\\frac{dP}{dt} < 0$ and $P$ falls toward $${L.K}$.` : `$P(0) = ${L.K}$ is an equilibrium, so $P$ stays constant.`}`,
            `环境容纳量为 $${L.K}$。${right === 0 ? `由于 $0 < ${P0} < ${L.K}$，$\\frac{dP}{dt} > 0$，$P$ 上升趋于 $${L.K}$。` : right === 1 ? `由于 $${P0} > ${L.K}$，$\\frac{dP}{dt} < 0$，$P$ 下降趋于 $${L.K}$。` : `$P(0) = ${L.K}$ 是平衡解，所以 $P$ 保持不变。`}`,
          ),
        );
      },
    },
    {
      id: "fastest-logistic-growth",
      title: t("Where growth is fastest", "增长最快的位置"),
      explanation: t(
        "$\\frac{dP}{dt} = kP - \\frac{k}{K}P^{2}$ is a downward parabola in $P$ with zeros at $0$ and $K$, so it is largest at $P = \\frac{K}{2}$. There the graph of $P(t)$ changes from concave up to concave down: an inflection point. For $K = 800$, growth is fastest when $P = 400$.",
        "$\\frac{dP}{dt} = kP - \\frac{k}{K}P^{2}$ 是关于 $P$ 的开口向下的抛物线，零点为 $0$ 和 $K$，所以在 $P = \\frac{K}{2}$ 处最大。在那里 $P(t)$ 的图像由上凹变为下凹：是拐点。当 $K = 800$ 时，$P = 400$ 时增长最快。",
      ),
      generate(rng) {
        const L = logistic(rng);
        const P0 = (L.K / 50) * rng.int(1, 4) * 5;
        return numberProblem({
          prompt: t(
            `A population satisfies $\\frac{dP}{dt} = ${L.tex}$ with $P(0) = ${P0}$. At what population is it growing fastest?`,
            `某种群满足 $\\frac{dP}{dt} = ${L.tex}$，$P(0) = ${P0}$。种群数量为多少时增长最快？`,
          ),
          answer: L.K / 2,
          wrong: [L.K, P0, Q.of(L.K + P0, 2)],
          solution: t(
            `Growth is fastest at half the carrying capacity: $P = \\frac{${L.K}}{2} = ${L.K / 2}$.`,
            `增长在环境容纳量的一半处最快：$P = \\frac{${L.K}}{2} = ${L.K / 2}$。`,
          ),
        });
      },
    },
  ],
};

/** solvingTheLogisticGrowthEquation finds P(t) = K/(1 + Ae^{−kt}). */
export const solvingTheLogisticGrowthEquation: TopicDef = {
  id: "solving-the-logistic-growth-equation",
  title: t("Solving the Logistic Growth Equation", "解逻辑斯谛增长方程"),
  summary: t(
    "Separation and partial fractions give P(t) = K/(1 + Ae^{−kt}) with A = (K − P₀)/P₀.",
    "分离变量并用部分分式得 P(t) = K/(1 + Ae^{−kt})，其中 A = (K − P₀)/P₀。",
  ),
  prerequisites: ["qualitative-analysis-of-the-logistic-growth-equation", "integrating-rational-functions-using-partial-fractions"],
  encompasses: [{ topic: "qualitative-analysis-of-the-logistic-growth-equation", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-constant-in-the-logistic-solution",
      title: t("The constant A", "常数 A"),
      explanation: t(
        "Separating gives $\\int \\frac{K}{P(K - P)} \\, dP = \\int k \\, dt$, and partial fractions give $\\ln\\left|\\frac{P}{K - P}\\right| = kt + C$. Solving for $P$:\n\n$$P(t) = \\frac{K}{1 + Ae^{-kt}}, \\qquad A = \\frac{K - P_0}{P_0}.$$\n\nWith $K = 1000$ and $P_0 = 200$: $A = \\frac{800}{200} = 4$.",
        "分离变量得 $\\int \\frac{K}{P(K - P)} \\, dP = \\int k \\, dt$，用部分分式得 $\\ln\\left|\\frac{P}{K - P}\\right| = kt + C$。解出 $P$：\n\n$$P(t) = \\frac{K}{1 + Ae^{-kt}}, \\qquad A = \\frac{K - P_0}{P_0}。$$\n\n当 $K = 1000$，$P_0 = 200$ 时：$A = \\frac{800}{200} = 4$。",
      ),
      generate(rng) {
        const L = logistic(rng);
        const P0 = rng.bool() ? (L.K / 50) * rng.int(1, 9) * 5 : L.K + rng.int(1, 10) * 50;
        const A = Q.of(L.K - P0, P0);
        return numberProblem({
          prompt: t(
            `The solution of $\\frac{dP}{dt} = ${L.tex}$ with $P(0) = ${P0}$ has the form $P(t) = \\frac{${L.K}}{1 + Ae^{-${L.k.toLatex()}t}}$. Find $A$.`,
            `$\\frac{dP}{dt} = ${L.tex}$，$P(0) = ${P0}$ 的解形如 $P(t) = \\frac{${L.K}}{1 + Ae^{-${L.k.toLatex()}t}}$。求 $A$。`,
          ),
          answer: A,
          wrong: [Q.of(P0, L.K - P0), Q.of(L.K, P0), Q.of(L.K - P0, L.K)],
          solution: t(
            `At $t = 0$: $${P0} = \\frac{${L.K}}{1 + A}$, so $1 + A = ${Q.of(L.K, P0).toLatex()}$ and $A = ${A.toLatex()}$.`,
            `在 $t = 0$ 处：$${P0} = \\frac{${L.K}}{1 + A}$，所以 $1 + A = ${Q.of(L.K, P0).toLatex()}$，$A = ${A.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "writing-the-logistic-solution",
      title: t("Writing the solution", "写出解"),
      explanation: t(
        "Read $K$ and $k$ from the equation, compute $A$ from $P_0$, and substitute. For $\\frac{dP}{dt} = \\frac{1}{2}P\\left(1 - \\frac{P}{300}\\right)$ with $P(0) = 50$: $A = 5$, so $P(t) = \\frac{300}{1 + 5e^{-t/2}}$.",
        "从方程读出 $K$ 和 $k$，由 $P_0$ 求出 $A$，再代入。对 $\\frac{dP}{dt} = \\frac{1}{2}P\\left(1 - \\frac{P}{300}\\right)$，$P(0) = 50$：$A = 5$，所以 $P(t) = \\frac{300}{1 + 5e^{-t/2}}$。",
      ),
      generate(rng) {
        const L = logistic(rng);
        const P0 = (L.K / 50) * rng.int(1, 9) * 5;
        const A = Q.of(L.K - P0, P0);
        const kt = poly([L.k.neg(), "t"]);
        const answer = `\\frac{${L.K}}{1 + ${A.toLatex()}e^{${kt}}}`;
        return functionProblem({
          prompt: t(`Solve $\\frac{dP}{dt} = ${L.tex}$ with $P(0) = ${P0}$.`, `解 $\\frac{dP}{dt} = ${L.tex}$，$P(0) = ${P0}$。`),
          answer,
          variable: "t",
          prefix: "P(t) =",
          wrong: [
            `\\frac{${L.K}}{1 + ${Q.of(P0, L.K - P0).toLatex()}e^{${kt}}}`,
            `\\frac{${L.K}}{1 + ${A.toLatex()}e^{${poly([L.k, "t"])}}}`,
            `${P0}e^{${poly([L.k, "t"])}}`,
          ],
          solution: t(
            `$K = ${L.K}$, $k = ${L.k.toLatex()}$ and $A = \\frac{${L.K} - ${P0}}{${P0}} = ${A.toLatex()}$, so $P(t) = ${answer}$.`,
            `$K = ${L.K}$，$k = ${L.k.toLatex()}$，$A = \\frac{${L.K} - ${P0}}{${P0}} = ${A.toLatex()}$，所以 $P(t) = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** Field is a right side f(x, y) for dy/dx, with its LaTeX. */
interface Field {
  readonly tex: string;
  readonly f: (x: number, y: number) => number;
}

/** slopeField draws short segments of slope f(x, y) at the integer points of [−3, 3]². */
function slopeField(field: Field): Figure {
  const marks: PlaneMark[] = [];
  for (let x = -3; x <= 3; x++)
    for (let y = -3; y <= 3; y++) {
      const m = field.f(x, y);
      const dx = 0.32 / Math.sqrt(1 + m * m);
      marks.push({ kind: "segment", a: [x - dx, y - m * dx], b: [x + dx, y + m * dx], accent: true });
    }
  return {
    svg: plane({ xMin: -4, xMax: 4, yMin: -4, yMax: 4 }, marks),
    alt: t(
      `A slope field on the grid from −3 to 3 in each direction, drawn for dy/dx = ${field.tex}.`,
      `在两个方向上从 −3 到 3 的网格上画出的斜率场，对应 dy/dx = ${field.tex}。`,
    ),
  };
}

/** lin builds the field ax + by + c. */
const lin = (a: number, b: number, c: number): Field => ({
  tex: poly([a, "x"], [b, "y"], [c, ""]),
  f: (x, y) => a * x + b * y + c,
});

/** SlopeFamily picks a field of one kind with two plausible distractors. */
type SlopeFamily = (rng: Rng) => { readonly right: Field; readonly wrong: readonly Field[] };

/** directFamily: dy/dx = f(x). */
const directFamily: SlopeFamily = (rng) => {
  const a = rng.nonZero(-2, 2);
  const c = rng.int(-2, 2);
  if (rng.bool()) return { right: lin(a, 0, c), wrong: [lin(0, a, c), lin(-a, 0, -c)] };
  const s = rng.pick([-1, 1]);
  const sq = (v: number): Field => ({ tex: poly([s, `${v === 0 ? "x" : "y"}^{2}`], [c, ""]), f: (x, y) => s * (v === 0 ? x : y) ** 2 + c });
  return { right: sq(0), wrong: [sq(1), { tex: poly([-s, "x^{2}"], [-c, ""]), f: (x) => -s * x * x - c }] };
};

/** autonomousFamily: dy/dx = g(y). */
const autonomousFamily: SlopeFamily = (rng) => {
  const a = rng.nonZero(-2, 2);
  const c = rng.int(-2, 2);
  if (rng.bool()) return { right: lin(0, a, c), wrong: [lin(a, 0, c), lin(0, -a, -c)] };
  const r = rng.int(-2, 2);
  const s = rng.pick([-1, 1]);
  const prod = (v: "x" | "y", sign: number): Field => ({
    tex: `${sign < 0 ? "-" : ""}${v}(${linear(1, -r, v)})`,
    f: (x, y) => sign * (v === "x" ? x : y) * ((v === "x" ? x : y) - r),
  });
  if (r === 0) return { right: lin(0, a, c), wrong: [lin(a, 0, c), lin(0, -a, -c)] };
  return { right: prod("y", s), wrong: [prod("x", s), prod("y", -s)] };
};

/** mixedFamily: dy/dx = ax + by + c with a, b ≠ 0, or xy. */
const mixedFamily: SlopeFamily = (rng) => {
  const a = rng.nonZero(-2, 2);
  const b = rng.nonZero(-2, 2);
  const c = rng.int(-2, 2);
  return { right: lin(a, b, c), wrong: [lin(a, -b, c), lin(-a, -b, -c), lin(b === a ? a : b, b === a ? 0 : a, c)] };
};

/** matchingProblem shows a slope field and asks which equation it belongs to. */
function matchingProblem(rng: Rng, family: SlopeFamily, why: Text) {
  const { right, wrong } = family(rng);
  const opt = (f: Field) => t(`$\\frac{dy}{dx} = ${f.tex}$`, `$\\frac{dy}{dx} = ${f.tex}$`);
  return oneOf(
    rng,
    t("Which differential equation does this slope field belong to?", "这个斜率场属于哪个微分方程？"),
    opt(right),
    wrong.map(opt),
    t(
      `${why.en} The slopes match $\\frac{dy}{dx} = ${right.tex}$: for example, at $(1, 1)$ the slope is $${right.f(1, 1)}$ and at $(-1, 2)$ it is $${right.f(-1, 2)}$.`,
      `${why["zh-CN"]}各斜率与 $\\frac{dy}{dx} = ${right.tex}$ 相符：例如在 $(1, 1)$ 处斜率为 $${right.f(1, 1)}$，在 $(-1, 2)$ 处为 $${right.f(-1, 2)}$。`,
    ),
    slopeField(right),
  );
}

/** slopeAtPointProblem asks for the slope of the field at a grid point. */
function slopeAtPointProblem(rng: Rng, family: SlopeFamily) {
  const { right } = family(rng);
  const x0 = rng.int(-3, 3);
  const y0 = rng.int(-3, 3);
  const answer = right.f(x0, y0);
  return numberProblem({
    prompt: t(
      `In the slope field of $\\frac{dy}{dx} = ${right.tex}$, what is the slope of the segment drawn at $(${x0}, ${y0})$?`,
      `在 $\\frac{dy}{dx} = ${right.tex}$ 的斜率场中，画在 $(${x0}, ${y0})$ 处的线段斜率是多少？`,
    ),
    answer,
    wrong: [right.f(y0, x0), -answer, answer + 1],
    solution: t(
      `The segment at $(${x0}, ${y0})$ has slope $\\frac{dy}{dx}$ evaluated there: $${answer}$.`,
      `$(${x0}, ${y0})$ 处线段的斜率就是 $\\frac{dy}{dx}$ 在该点的值：$${answer}$。`,
    ),
  });
}

/** slopeFieldsForDirectlyIntegrableDifferentialEquations draws fields of dy/dx = f(x). */
export const slopeFieldsForDirectlyIntegrableDifferentialEquations: TopicDef = {
  id: "slope-fields-for-directly-integrable-differential-equations",
  title: t("Slope Fields for Directly Integrable Differential Equations", "可直接积分的微分方程的斜率场"),
  summary: t(
    "A slope field draws a short segment of slope f(x, y) at many points; for dy/dx = f(x) the slopes are equal along each vertical line.",
    "斜率场在许多点画出斜率为 f(x, y) 的短线段；对 dy/dx = f(x)，同一条竖直线上的斜率都相等。",
  ),
  prerequisites: ["solving-first-order-odes-using-direct-integration", "qualitative-analysis-of-first-order-odes"],
  encompasses: [{ topic: "qualitative-analysis-of-first-order-odes", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "slopes-in-a-field-of-a-function-of-x",
      title: t("Slopes in the field", "斜率场中的斜率"),
      explanation: t(
        "A **slope field** draws, at each grid point $(x, y)$, a short segment with slope $\\frac{dy}{dx}$ there. Solution curves run along the segments. For $\\frac{dy}{dx} = 2x - 1$, the segment at $(2, -3)$ has slope $3$, and so does every segment on the line $x = 2$.",
        "**斜率场**在每个网格点 $(x, y)$ 处画一条斜率为该点 $\\frac{dy}{dx}$ 的短线段。解曲线顺着这些线段走。对 $\\frac{dy}{dx} = 2x - 1$，$(2, -3)$ 处线段的斜率为 $3$，直线 $x = 2$ 上每条线段的斜率也都是 $3$。",
      ),
      generate: (rng) => slopeAtPointProblem(rng, directFamily),
    },
    {
      id: "matching-a-field-of-a-function-of-x",
      title: t("Matching the field", "匹配斜率场"),
      explanation: t(
        "When $\\frac{dy}{dx}$ depends only on $x$, every column of segments is parallel: moving up or down does not change the slope. Then compare the slopes in a few columns, for example where they are $0$ and where they are positive or negative.",
        "当 $\\frac{dy}{dx}$ 只依赖于 $x$ 时，每一列线段都互相平行：上下移动不改变斜率。再比较几列的斜率，例如斜率为 $0$ 的位置，以及斜率为正或为负的位置。",
      ),
      generate: (rng) =>
        matchingProblem(
          rng,
          directFamily,
          t(
            "The segments are parallel along each vertical line, so the slope depends only on $x$.",
            "每条竖直线上的线段互相平行，所以斜率只依赖于 $x$。",
          ),
        ),
    },
  ],
};

/** slopeFieldsForAutonomousDifferentialEquations draws fields of dy/dx = g(y). */
export const slopeFieldsForAutonomousDifferentialEquations: TopicDef = {
  id: "slope-fields-for-autonomous-differential-equations",
  title: t("Slope Fields for Autonomous Differential Equations", "自治微分方程的斜率场"),
  summary: t(
    "For dy/dx = g(y) the slopes are equal along each horizontal line, and rows of horizontal segments mark equilibria.",
    "对 dy/dx = g(y)，同一条水平线上的斜率都相等，整行水平线段标出平衡解。",
  ),
  prerequisites: ["slope-fields-for-directly-integrable-differential-equations", "equilibrium-solutions-of-first-order-odes"],
  encompasses: [{ topic: "slope-fields-for-directly-integrable-differential-equations", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "slopes-in-a-field-of-a-function-of-y",
      title: t("Slopes in the field", "斜率场中的斜率"),
      explanation: t(
        "For an autonomous equation $\\frac{dy}{dx} = g(y)$ the slope depends only on the height $y$. For $\\frac{dy}{dx} = y(y - 2)$, every segment on the line $y = 3$ has slope $3$, and every segment on $y = 2$ is horizontal.",
        "对自治方程 $\\frac{dy}{dx} = g(y)$，斜率只依赖于高度 $y$。对 $\\frac{dy}{dx} = y(y - 2)$，直线 $y = 3$ 上每条线段的斜率都是 $3$，直线 $y = 2$ 上的每条线段都是水平的。",
      ),
      generate: (rng) => slopeAtPointProblem(rng, autonomousFamily),
    },
    {
      id: "matching-a-field-of-a-function-of-y",
      title: t("Matching the field", "匹配斜率场"),
      explanation: t(
        "When every row of segments is parallel, the equation is autonomous. A row of horizontal segments at $y = c$ shows that $g(c) = 0$, so $y = c$ is an equilibrium solution.",
        "若每一行线段都互相平行，方程就是自治的。在 $y = c$ 处整行水平的线段说明 $g(c) = 0$，所以 $y = c$ 是平衡解。",
      ),
      generate: (rng) =>
        matchingProblem(
          rng,
          autonomousFamily,
          t(
            "The segments are parallel along each horizontal line, so the slope depends only on $y$.",
            "每条水平线上的线段互相平行，所以斜率只依赖于 $y$。",
          ),
        ),
    },
  ],
};

/** slopeFieldsForNonautonomousDifferentialEquations draws fields of dy/dx = f(x, y). */
export const slopeFieldsForNonautonomousDifferentialEquations: TopicDef = {
  id: "slope-fields-for-nonautonomous-differential-equations",
  title: t("Slope Fields for Nonautonomous Differential Equations", "非自治微分方程的斜率场"),
  summary: t(
    "When dy/dx depends on both x and y, slopes change along rows and columns; lines of equal slope (isoclines) help to read the field.",
    "当 dy/dx 同时依赖于 x 和 y 时，斜率沿行和列都会变化；等斜线有助于读懂斜率场。",
  ),
  prerequisites: ["slope-fields-for-autonomous-differential-equations"],
  encompasses: [{ topic: "slope-fields-for-autonomous-differential-equations", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "slopes-in-a-field-of-x-and-y",
      title: t("Slopes in the field", "斜率场中的斜率"),
      explanation: t(
        "Evaluate $f(x, y)$ at the point. For $\\frac{dy}{dx} = x - 2y$, the slope at $(3, 1)$ is $1$ and at $(1, 3)$ it is $-5$: swapping the coordinates changes the slope.",
        "在该点计算 $f(x, y)$。对 $\\frac{dy}{dx} = x - 2y$，$(3, 1)$ 处的斜率为 $1$，$(1, 3)$ 处为 $-5$：交换坐标会改变斜率。",
      ),
      generate: (rng) => slopeAtPointProblem(rng, mixedFamily),
    },
    {
      id: "matching-a-field-of-x-and-y",
      title: t("Matching the field", "匹配斜率场"),
      explanation: t(
        "Find where the slopes are $0$: for $\\frac{dy}{dx} = ax + by + c$ they lie on the line $ax + by + c = 0$. Then check the sign of the slope on each side of that line.",
        "先找斜率为 $0$ 的位置：对 $\\frac{dy}{dx} = ax + by + c$，它们位于直线 $ax + by + c = 0$ 上。再检查这条直线两侧斜率的正负。",
      ),
      generate: (rng) =>
        matchingProblem(
          rng,
          mixedFamily,
          t(
            "The slopes change along both rows and columns, so they depend on both $x$ and $y$.",
            "斜率沿行和列都在变化，所以它同时依赖于 $x$ 和 $y$。",
          ),
        ),
    },
  ],
};

/** analyzingSlopeFieldsForDirectlyIntegrableDifferentialEquations reads solutions of dy/dx = f(x) from a field. */
export const analyzingSlopeFieldsForDirectlyIntegrableDifferentialEquations: TopicDef = {
  id: "analyzing-slope-fields-for-directly-integrable-differential-equations",
  title: t("Analyzing Slope Fields for Directly Integrable Differential Equations", "分析可直接积分的微分方程的斜率场"),
  summary: t(
    "Solutions of dy/dx = f(x) are vertical translates of each other; their extrema lie where f(x) = 0.",
    "dy/dx = f(x) 的解彼此是竖直平移的关系；它们的极值点位于 f(x) = 0 处。",
  ),
  prerequisites: ["slope-fields-for-directly-integrable-differential-equations"],
  encompasses: [{ topic: "slope-fields-for-directly-integrable-differential-equations", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "extrema-of-solutions-from-a-field",
      title: t("Extrema of solutions", "解的极值"),
      explanation: t(
        "In the field of $\\frac{dy}{dx} = f(x)$, a column of horizontal segments at $x = c$ means $f(c) = 0$. If the slopes change from negative to positive there, every solution has a local minimum at $x = c$; from positive to negative, a local maximum.",
        "在 $\\frac{dy}{dx} = f(x)$ 的斜率场中，$x = c$ 处整列水平的线段说明 $f(c) = 0$。若斜率在该处由负变正，每个解在 $x = c$ 处都取得局部极小值；由正变负，则取得局部极大值。",
      ),
      generate(rng) {
        const a = rng.nonZero(-3, 3);
        const c = rng.int(-3, 3);
        const field = lin(a, 0, -a * c);
        const minimum = a > 0;
        return {
          ...numberProblem({
            prompt: t(
              `The slope field shows $\\frac{dy}{dx} = ${field.tex}$. At what value of $x$ does every solution have a local ${minimum ? "minimum" : "maximum"}?`,
              `斜率场对应 $\\frac{dy}{dx} = ${field.tex}$。每个解在 $x$ 取何值时取得局部${minimum ? "极小值" : "极大值"}？`,
            ),
            answer: c,
            wrong: [-c, a, c + 1],
            solution: t(
              `The segments are horizontal where $${field.tex} = 0$, that is $x = ${c}$. The slopes go from ${minimum ? "negative to positive" : "positive to negative"} there, so each solution has a local ${minimum ? "minimum" : "maximum"} at $x = ${c}$.`,
              `线段在 $${field.tex} = 0$ 即 $x = ${c}$ 处水平。斜率在该处由${minimum ? "负变正" : "正变负"}，所以每个解在 $x = ${c}$ 处取得局部${minimum ? "极小值" : "极大值"}。`,
            ),
          }),
          figure: slopeField(field),
        };
      },
    },
    {
      id: "vertical-translates-of-solutions",
      title: t("Solutions are vertical translates", "解互为竖直平移"),
      explanation: t(
        "If $y_1$ and $y_2$ both solve $\\frac{dy}{dx} = f(x)$, then $(y_2 - y_1)' = 0$, so they differ by a constant: one curve is the other shifted up or down. If the solution through $(0, 0)$ passes through $(2, 5)$, the solution through $(0, 3)$ passes through $(2, 8)$.",
        "若 $y_1$ 和 $y_2$ 都是 $\\frac{dy}{dx} = f(x)$ 的解，则 $(y_2 - y_1)' = 0$，所以它们相差一个常数：一条曲线是另一条向上或向下平移得到的。若过 $(0, 0)$ 的解经过 $(2, 5)$，则过 $(0, 3)$ 的解经过 $(2, 8)$。",
      ),
      generate(rng) {
        const x1 = rng.int(1, 4);
        const v = rng.int(-9, 9);
        const x0 = rng.int(-3, 0);
        const y0 = rng.int(-5, 5);
        const s = rng.nonZero(-6, 6);
        return numberProblem({
          prompt: t(
            `The solution of $\\frac{dy}{dx} = f(x)$ through $(${x0}, ${y0})$ passes through $(${x1}, ${v})$. The solution through $(${x0}, ${y0 + s})$ passes through $(${x1}, b)$. Find $b$.`,
            `$\\frac{dy}{dx} = f(x)$ 过 $(${x0}, ${y0})$ 的解经过 $(${x1}, ${v})$。过 $(${x0}, ${y0 + s})$ 的解经过 $(${x1}, b)$。求 $b$。`,
          ),
          answer: v + s,
          wrong: [v, v - s, y0 + s],
          solution: t(
            `Solutions differ by a constant. The second starts $${Math.abs(s)}$ ${s > 0 ? "above" : "below"} the first, so $b = ${v} + ${neg(s)} = ${v + s}$.`,
            `解之间相差一个常数。第二个解的起点比第一个${s > 0 ? "高" : "低"} $${Math.abs(s)}$，所以 $b = ${v} + ${neg(s)} = ${v + s}$。`,
          ),
        });
      },
    },
  ],
};

/** analyzingSlopeFieldsForAutonomousDifferentialEquations reads equilibria and limits from a field. */
export const analyzingSlopeFieldsForAutonomousDifferentialEquations: TopicDef = {
  id: "analyzing-slope-fields-for-autonomous-differential-equations",
  title: t("Analyzing Slope Fields for Autonomous Differential Equations", "分析自治微分方程的斜率场"),
  summary: t(
    "Rows of horizontal segments are equilibria; solutions between them move toward the stable one.",
    "整行水平线段是平衡解；位于它们之间的解朝稳定的平衡解移动。",
  ),
  prerequisites: [
    "slope-fields-for-autonomous-differential-equations",
    "analyzing-slope-fields-for-directly-integrable-differential-equations",
  ],
  encompasses: [{ topic: "slope-fields-for-autonomous-differential-equations", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-solutions-from-a-field",
      title: t("Where solutions end up", "解的最终走向"),
      explanation: t(
        "In the field of $\\frac{dy}{dx} = g(y)$, follow the segments from the starting height. Between two equilibria the solution moves toward the stable one and approaches it as $x \\to \\infty$. For $\\frac{dy}{dx} = -y(y - 2)$ with $y(0) = \\frac{1}{2}$, slopes are positive between $0$ and $2$, so $y \\to 2$.",
        "在 $\\frac{dy}{dx} = g(y)$ 的斜率场中，从初始高度出发顺着线段走。在两个平衡解之间，解朝稳定的那个移动，并在 $x \\to \\infty$ 时趋于它。对 $\\frac{dy}{dx} = -y(y - 2)$，$y(0) = \\frac{1}{2}$，在 $0$ 与 $2$ 之间斜率为正，所以 $y \\to 2$。",
      ),
      generate(rng) {
        const r = rng.nonZero(-2, 2);
        const lo = Math.min(0, r);
        const hi = Math.max(0, r);
        const s = rng.pick([-1, 1]);
        const field: Field = { tex: `${s < 0 ? "-" : ""}y(${linear(1, -r, "y")})`, f: (_, y) => s * y * (y - r) };
        // y(y − r) is negative between the roots; the stable root is hi when s < 0 and lo when s > 0.
        const stable = s < 0 ? hi : lo;
        const unstable = s < 0 ? lo : hi;
        const y0 = rng.pick(
          [lo + 0.5, hi - 0.5, stable + (stable === hi ? 1 : -1), stable + (stable === hi ? 2 : -2)].filter((v) => v !== unstable),
        );
        const start = Q.of(Math.round(y0 * 2), 2);
        return {
          ...numberProblem({
            prompt: t(
              `The slope field shows $\\frac{dy}{dx} = ${field.tex}$. Find $\\lim_{x \\to \\infty} y(x)$ for the solution with $y(0) = ${start.toLatex()}$.`,
              `斜率场对应 $\\frac{dy}{dx} = ${field.tex}$。对满足 $y(0) = ${start.toLatex()}$ 的解，求 $\\lim_{x \\to \\infty} y(x)$。`,
            ),
            answer: stable,
            wrong: [unstable, start, -stable],
            solution: t(
              `The equilibria are $y = ${lo}$ and $y = ${hi}$. Following the segments from height $${start.toLatex()}$, the solution moves toward $y = ${stable}$, the stable equilibrium, so the limit is $${stable}$.`,
              `平衡解为 $y = ${lo}$ 和 $y = ${hi}$。从高度 $${start.toLatex()}$ 出发顺着线段走，解朝稳定平衡解 $y = ${stable}$ 移动，所以极限为 $${stable}$。`,
            ),
          }),
          figure: slopeField(field),
        };
      },
    },
    {
      id: "equilibria-from-a-field",
      title: t("Equilibria from the field", "从斜率场读出平衡解"),
      explanation: t(
        "A row of horizontal segments at height $c$ is an equilibrium solution $y = c$. It is stable when the segments just above point down and those just below point up.",
        "在高度 $c$ 处整行水平的线段就是平衡解 $y = c$。若其稍上方的线段向下指、稍下方的线段向上指，它就是稳定的。",
      ),
      generate(rng) {
        const a = rng.int(-3, 2);
        const b = rng.int(a + 1, 3);
        const s = rng.pick([-1, 1]);
        const field: Field = {
          tex: `${s < 0 ? "-" : ""}${factors(a, b)}`,
          f: (_, y) => s * (y - a) * (y - b),
        };
        const stable = s > 0 ? a : b;
        return {
          ...numberProblem({
            prompt: t(
              `The slope field shows $\\frac{dy}{dx} = ${field.tex}$. Find the stable equilibrium solution $y = c$; give $c$.`,
              `斜率场对应 $\\frac{dy}{dx} = ${field.tex}$。求稳定的平衡解 $y = c$，写出 $c$。`,
            ),
            answer: stable,
            wrong: [s > 0 ? b : a, -stable, 0],
            solution: t(
              `The rows at $y = ${a}$ and $y = ${b}$ are horizontal. Between them the slopes are ${s > 0 ? "negative" : "positive"}, and outside they are ${s > 0 ? "positive" : "negative"}, so solutions move toward $y = ${stable}$: it is the stable equilibrium.`,
              `$y = ${a}$ 和 $y = ${b}$ 两行是水平的。两者之间斜率${s > 0 ? "为负" : "为正"}，外侧${s > 0 ? "为正" : "为负"}，所以解朝 $y = ${stable}$ 移动：它是稳定平衡解。`,
            ),
          }),
          figure: slopeField(field),
        };
      },
    },
  ],
};

/** analyzingSlopeFieldsForNonautonomousDifferentialEquations finds isoclines and straight-line solutions. */
export const analyzingSlopeFieldsForNonautonomousDifferentialEquations: TopicDef = {
  id: "analyzing-slope-fields-for-nonautonomous-differential-equations",
  title: t("Analyzing Slope Fields for Nonautonomous Differential Equations", "分析非自治微分方程的斜率场"),
  summary: t(
    "Isoclines f(x, y) = m collect points of equal slope; a line whose slope equals its isocline value is itself a solution.",
    "等斜线 f(x, y) = m 汇集了斜率相同的点；若一条直线的斜率等于它所在等斜线的斜率值，它本身就是解。",
  ),
  prerequisites: ["slope-fields-for-nonautonomous-differential-equations", "analyzing-slope-fields-for-autonomous-differential-equations"],
  encompasses: [{ topic: "slope-fields-for-nonautonomous-differential-equations", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-zero-slope-isocline",
      title: t("Where the slope is zero", "斜率为零的位置"),
      explanation: t(
        "An **isocline** is a curve along which $f(x, y)$ is constant, so all its segments are parallel. For $\\frac{dy}{dx} = 2x - y + 1$, the slope is $0$ along $y = 2x + 1$, where solutions have horizontal tangents.",
        "**等斜线**是 $f(x, y)$ 保持常数的曲线，其上的线段都互相平行。对 $\\frac{dy}{dx} = 2x - y + 1$，斜率在 $y = 2x + 1$ 上为 $0$，解在那里有水平切线。",
      ),
      generate(rng) {
        const a = rng.nonZero(-2, 2);
        const b = rng.pick([-1, 1]);
        const c = rng.int(-2, 2);
        const field = lin(a, b, c);
        // ax + by + c = 0 ⇔ y = −(ax + c)/b
        const m = -a / b;
        const d = -c / b;
        return {
          ...numberProblem({
            prompt: t(
              `In the slope field of $\\frac{dy}{dx} = ${field.tex}$, the segments are horizontal along a line $y = mx + d$. Find $d$.`,
              `在 $\\frac{dy}{dx} = ${field.tex}$ 的斜率场中，线段在直线 $y = mx + d$ 上是水平的。求 $d$。`,
            ),
            answer: d,
            wrong: [c, m, -d === d ? 1 : -d],
            solution: t(
              `The slope is $0$ where $${field.tex} = 0$, that is $y = ${linear(m, d)}$. So $d = ${d}$.`,
              `斜率在 $${field.tex} = 0$ 即 $y = ${linear(m, d)}$ 处为 $0$。所以 $d = ${d}$。`,
            ),
          }),
          figure: slopeField(field),
        };
      },
    },
    {
      id: "straight-line-solutions",
      title: t("Straight-line solutions", "直线解"),
      explanation: t(
        "Try $y = mx + d$ in $\\frac{dy}{dx} = ax + by + c$: the left side is $m$ and the right side is $(a + bm)x + bd + c$. They agree for every $x$ when $a + bm = 0$ and $m = bd + c$. For $\\frac{dy}{dx} = x - y$: $m = 1$ and $1 = -d$, so $y = x - 1$ is a solution.",
        "把 $y = mx + d$ 代入 $\\frac{dy}{dx} = ax + by + c$：左边为 $m$，右边为 $(a + bm)x + bd + c$。当 $a + bm = 0$ 且 $m = bd + c$ 时两边对每个 $x$ 都相等。对 $\\frac{dy}{dx} = x - y$：$m = 1$，$1 = -d$，所以 $y = x - 1$ 是解。",
      ),
      generate(rng) {
        const b = rng.pick([-1, 1]);
        const m = rng.nonZero(-2, 2);
        const a = -b * m;
        const c = rng.int(-3, 3);
        const d = (m - c) / b;
        const field = lin(a, b, c);
        return {
          ...numberProblem({
            prompt: t(
              `The differential equation $\\frac{dy}{dx} = ${field.tex}$ has a solution of the form $y = ${m === 1 ? "" : m === -1 ? "-" : m}x + d$. Find $d$.`,
              `微分方程 $\\frac{dy}{dx} = ${field.tex}$ 有形如 $y = ${m === 1 ? "" : m === -1 ? "-" : m}x + d$ 的解。求 $d$。`,
            ),
            answer: d,
            wrong: [-d === d ? d + 1 : -d, -c / b, c],
            solution: t(
              `Substituting, the left side is $${m}$ and the right side is $${poly([a, "x"])} + ${neg(b)}(${linear(m, 0)} + d) + ${neg(c)} = ${poly([b, "d"], [c, ""])}$. So $${m} = ${poly([b, "d"], [c, ""])}$ and $d = ${d}$.`,
              `代入后左边为 $${m}$，右边为 $${poly([a, "x"])} + ${neg(b)}(${linear(m, 0)} + d) + ${neg(c)} = ${poly([b, "d"], [c, ""])}$。所以 $${m} = ${poly([b, "d"], [c, ""])}$，$d = ${d}$。`,
            ),
          }),
          figure: slopeField(field),
        };
      },
    },
  ],
};

/** EulerField is a right side f(x, y) with rational arithmetic, for Euler's method. */
interface EulerField {
  readonly tex: string;
  readonly f: (x: Q, y: Q) => Q;
}

/** linearEuler builds the field ax + by + c. */
const linearEuler = (a: number, b: number, c: number): EulerField => ({
  tex: poly([a, "x"], [b, "y"], [c, ""]),
  f: (x, y) =>
    x
      .mul(Q.of(a))
      .add(y.mul(Q.of(b)))
      .add(Q.of(c)),
});

/** nonlinearEuler picks a field with a product or a square. */
function nonlinearEuler(rng: Rng): EulerField {
  const k = rng.nonZero(-2, 2);
  const kind = rng.int(0, 2);
  if (kind === 0) return { tex: poly([k, "xy"]), f: (x, y) => x.mul(y).mul(Q.of(k)) };
  if (kind === 1) return { tex: poly([1, "x^{2}"], [k, "y"]), f: (x, y) => x.mul(x).add(y.mul(Q.of(k))) };
  return { tex: poly([k, "x"], [1, "y^{2}"]), f: (x, y) => x.mul(Q.of(k)).add(y.mul(y)) };
}

/** stepSizes are the step sizes h used with Euler's method. */
const stepSizes = [Q.of(1, 2), Q.of(1, 4), Q.of(1, 10), Q.of(1, 5), Q.one] as const;

/** eulerProblem asks for the estimate after n steps and explains each step. */
function eulerProblem(rng: Rng, field: EulerField, n: number) {
  const h = rng.pick(stepSizes);
  const x0 = Q.of(rng.int(-2, 2));
  const y0 = Q.of(rng.int(-3, 3));
  const rows: { x: Q; y: Q; m: Q }[] = [];
  let x = x0;
  let y = y0;
  for (let i = 0; i < n; i++) {
    const m = field.f(x, y);
    rows.push({ x, y, m });
    y = y.add(h.mul(m));
    x = x.add(h);
  }
  const first = rows[0]!;
  const end = x;
  const lines = rows.map((r, i) => {
    const next = r.y.add(h.mul(r.m));
    return `y_{${i + 1}} = ${r.y.toLatex()} + ${h.toLatex()} \\cdot ${neg(r.m)} = ${next.toLatex()}`;
  });
  const slopes = rows.map((r) => `f\\left(${r.x.toLatex()}, ${r.y.toLatex()}\\right) = ${r.m.toLatex()}`);
  return numberProblem({
    prompt: t(
      `Use Euler's method with step size $h = ${h.toLatex()}$ to estimate $y\\left(${end.toLatex()}\\right)$, where $\\frac{dy}{dx} = ${field.tex}$ and $y\\left(${x0.toLatex()}\\right) = ${y0.toLatex()}$.`,
      `用步长 $h = ${h.toLatex()}$ 的欧拉法估计 $y\\left(${end.toLatex()}\\right)$，其中 $\\frac{dy}{dx} = ${field.tex}$，$y\\left(${x0.toLatex()}\\right) = ${y0.toLatex()}$。`,
    ),
    answer: y,
    wrong: [y0.add(Q.of(n).mul(h).mul(first.m)), y.sub(y0), y0.add(Q.of(n).mul(first.m)), y0.sub(h.mul(first.m))],
    solution: t(
      `Each step uses $y_{k+1} = y_k + h f(x_k, y_k)$. Slopes: $${slopes.join("$, $")}$. Steps: $${lines.join("$, $")}$. So $y\\left(${end.toLatex()}\\right) \\approx ${y.toLatex()}$.`,
      `每一步用 $y_{k+1} = y_k + h f(x_k, y_k)$。斜率：$${slopes.join("$，$")}$。各步：$${lines.join("$，$")}$。所以 $y\\left(${end.toLatex()}\\right) \\approx ${y.toLatex()}$。`,
    ),
  });
}

/** eulersMethodCalculatingOneStep follows the tangent line for one step. */
export const eulersMethodCalculatingOneStep: TopicDef = {
  id: "eulers-method-calculating-one-step",
  title: t("Euler's Method: Calculating One Step", "欧拉法：计算一步"),
  summary: t(
    "Euler's method follows the tangent line: y₁ = y₀ + h f(x₀, y₀) estimates y(x₀ + h).",
    "欧拉法沿切线前进：y₁ = y₀ + h f(x₀, y₀) 是 y(x₀ + h) 的估计值。",
  ),
  prerequisites: [
    "slope-fields-for-nonautonomous-differential-equations",
    "approximating-functions-using-local-linearity-and-linearization",
  ],
  encompasses: [{ topic: "approximating-functions-using-local-linearity-and-linearization", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "one-step-of-eulers-method",
      title: t("One step", "一步"),
      explanation: t(
        "Starting from the known point $(x_0, y_0)$, the solution's slope there is $f(x_0, y_0)$. Moving a small step $h$ along that tangent line gives\n\n$$y(x_0 + h) \\approx y_1 = y_0 + h f(x_0, y_0).$$\n\nFor $\\frac{dy}{dx} = x + 2y$ with $y(1) = 3$ and $h = \\frac{1}{2}$: the slope is $1 + 6 = 7$, so $y\\left(\\frac{3}{2}\\right) \\approx 3 + \\frac{1}{2} \\cdot 7 = \\frac{13}{2}$.",
        "从已知点 $(x_0, y_0)$ 出发，解在该处的斜率为 $f(x_0, y_0)$。沿这条切线前进一小步 $h$ 得\n\n$$y(x_0 + h) \\approx y_1 = y_0 + h f(x_0, y_0)。$$\n\n对 $\\frac{dy}{dx} = x + 2y$，$y(1) = 3$，$h = \\frac{1}{2}$：斜率为 $1 + 6 = 7$，所以 $y\\left(\\frac{3}{2}\\right) \\approx 3 + \\frac{1}{2} \\cdot 7 = \\frac{13}{2}$。",
      ),
      generate: (rng) => eulerProblem(rng, linearEuler(rng.nonZero(-3, 3), rng.nonZero(-3, 3), rng.int(-4, 4)), 1),
    },
    {
      id: "one-step-with-a-nonlinear-equation",
      title: t("One step with a nonlinear equation", "非线性方程的一步"),
      explanation: t(
        "The step is the same whatever $f$ is: evaluate the slope at the current point and move $h$ along it. For $\\frac{dy}{dx} = xy$ with $y(2) = 1$ and $h = \\frac{1}{10}$: the slope is $2$, so $y(2.1) \\approx 1 + \\frac{1}{10} \\cdot 2 = \\frac{6}{5}$.",
        "无论 $f$ 是什么，步骤都一样：在当前点计算斜率，再沿它前进 $h$。对 $\\frac{dy}{dx} = xy$，$y(2) = 1$，$h = \\frac{1}{10}$：斜率为 $2$，所以 $y(2.1) \\approx 1 + \\frac{1}{10} \\cdot 2 = \\frac{6}{5}$。",
      ),
      generate: (rng) => eulerProblem(rng, nonlinearEuler(rng), 1),
    },
  ],
};

/** eulersMethodCalculatingMultipleSteps repeats Euler steps to reach a farther point. */
export const eulersMethodCalculatingMultipleSteps: TopicDef = {
  id: "eulers-method-calculating-multiple-steps",
  title: t("Euler's Method: Calculating Multiple Steps", "欧拉法：计算多步"),
  summary: t(
    "Repeat yₖ₊₁ = yₖ + h f(xₖ, yₖ), recomputing the slope at each new point; smaller steps give better estimates.",
    "重复 yₖ₊₁ = yₖ + h f(xₖ, yₖ)，每到一个新点都重新计算斜率；步长越小，估计越准。",
  ),
  prerequisites: ["eulers-method-calculating-one-step"],
  encompasses: [{ topic: "eulers-method-calculating-one-step", weight: 0.6 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "two-steps-of-eulers-method",
      title: t("Two steps", "两步"),
      explanation: t(
        "After the first step, the new point $(x_1, y_1)$ has its own slope $f(x_1, y_1)$: use it, not the old slope. For $\\frac{dy}{dx} = x + y$, $y(0) = 1$, $h = \\frac{1}{2}$: $y_1 = 1 + \\frac{1}{2} \\cdot 1 = \\frac{3}{2}$; then $f\\left(\\frac{1}{2}, \\frac{3}{2}\\right) = 2$, so $y_2 = \\frac{3}{2} + \\frac{1}{2} \\cdot 2 = \\frac{5}{2} \\approx y(1)$.",
        "第一步之后，新点 $(x_1, y_1)$ 有自己的斜率 $f(x_1, y_1)$：要用它，而不是旧的斜率。对 $\\frac{dy}{dx} = x + y$，$y(0) = 1$，$h = \\frac{1}{2}$：$y_1 = 1 + \\frac{1}{2} \\cdot 1 = \\frac{3}{2}$；然后 $f\\left(\\frac{1}{2}, \\frac{3}{2}\\right) = 2$，所以 $y_2 = \\frac{3}{2} + \\frac{1}{2} \\cdot 2 = \\frac{5}{2} \\approx y(1)$。",
      ),
      generate: (rng) => eulerProblem(rng, linearEuler(rng.nonZero(-2, 2), rng.nonZero(-2, 2), rng.int(-3, 3)), 2),
    },
    {
      id: "three-steps-of-eulers-method",
      title: t("Three steps", "三步"),
      explanation: t(
        "Organize the work in a table of $x_k$, $y_k$ and the slope $f(x_k, y_k)$, filling one row per step. Each row's $y$ is the previous $y$ plus $h$ times the previous slope.",
        "把计算整理成一张表，列出 $x_k$、$y_k$ 和斜率 $f(x_k, y_k)$，每一步填一行。每行的 $y$ 等于上一行的 $y$ 加上 $h$ 乘以上一行的斜率。",
      ),
      generate: (rng) => eulerProblem(rng, linearEuler(rng.nonZero(-2, 2), rng.pick([-1, 1]), rng.int(-3, 3)), 3),
    },
  ],
};

/** calculusIIDifferentialEquationTopics are the topics of Calculus II unit 5. */
export const calculusIIDifferentialEquationTopics: readonly TopicDef[] = [
  introductionToDifferentialEquations,
  verifyingSolutionsOfDifferentialEquations,
  solvingFirstOrderOdesUsingDirectIntegration,
  solvingFirstOrderOdesUsingSeparationOfVariables,
  solvingFirstOrderIvpsUsingSeparationOfVariables,
  modelingWithFirstOrderOdes,
  furtherModelingWithFirstOrderOdes,
  qualitativeAnalysisOfFirstOrderOdes,
  equilibriumSolutionsOfFirstOrderOdes,
  exponentialGrowthAndDecayModelsWithFirstOrderOdes,
  exponentialGrowthAndDecayModelsWithFirstOrderOdesCalculatingUnknownTimesAndInitialValues,
  exponentialGrowthAndDecayModelsWithFirstOrderOdesHalfLifeProblems,
  logisticGrowthModelsWithFirstOrderOdes,
  qualitativeAnalysisOfTheLogisticGrowthEquation,
  solvingTheLogisticGrowthEquation,
  slopeFieldsForDirectlyIntegrableDifferentialEquations,
  slopeFieldsForAutonomousDifferentialEquations,
  slopeFieldsForNonautonomousDifferentialEquations,
  analyzingSlopeFieldsForDirectlyIntegrableDifferentialEquations,
  analyzingSlopeFieldsForAutonomousDifferentialEquations,
  analyzingSlopeFieldsForNonautonomousDifferentialEquations,
  eulersMethodCalculatingOneStep,
  eulersMethodCalculatingMultipleSteps,
];
