import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly } from "@ga/subject-math";
import { numberProblem, steps } from "../problems.ts";

// ---------------------------------------------------------------------------
// 3.8 Theory of Solutions to Linear ODEs
// ---------------------------------------------------------------------------

/** differentialOperators introduces polynomial operators P(D). */
export const differentialOperators: TopicDef = {
  id: "differential-operators",
  title: t("Differential Operators", "微分算子"),
  summary: t(
    "Differential operators represent differentiation as an algebraic symbol D = d/dx, with polynomial operator P(D) satisfying P(D) e^{rx} = P(r) e^{rx}.",
    "微分算子将求导运算记为代数符号 D = d/dx，多项式微分算子 P(D) 作用于指数函数满足 P(D) e^{rx} = P(r) e^{rx}。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "action-of-differential-operators",
      title: t("Action of polynomial differential operators on exponentials", "多项式微分算子作用于指数函数"),
      explanation: t(
        "For a differential operator $P(D) = D^2 + b D + c$, applying it to $y = e^{rx}$ yields $P(D)e^{rx} = P(r)e^{rx} = (r^2 + br + c)e^{rx}$.",
        "对于二次微分算子 $P(D) = D^2 + b D + c$，作用于指数函数 $y = e^{rx}$ 得到 $P(D)e^{rx} = P(r)e^{rx} = (r^2 + br + c)e^{rx}$。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.int(1, 8);
        const c = rng.int(1, 15);
        const r = rng.int(2, 6);
        const ans = r * r + b * r + c;

        const prompt = t(
          `Let $D = \\frac{d}{dx}$ denote the differential operator. Evaluate the constant $\\lambda$ such that $(D^2 + ${b}D + ${c})(e^{${r}x}) = \\lambda e^{${r}x}$.`,
          `记 $D = \\frac{d}{dx}$ 为微分算子。求常数 $\\lambda$，使得 $(D^2 + ${b}D + ${c})(e^{${r}x}) = \\lambda e^{${r}x}$ 成立。`,
        );
        const solution = t(
          steps(
            `Apply the derivative operator to $e^{${r}x}$: $D(e^{${r}x}) = ${r}e^{${r}x}$ and $D^2(e^{${r}x}) = ${r * r}e^{${r}x}$.`,
            `Substitute into the operator: $(D^2 + ${b}D + ${c})e^{${r}x} = (${r * r} + ${b}(${r}) + ${c})e^{${r}x}$.`,
            `Evaluate the polynomial: $P(${r}) = ${r * r} + ${b * r} + ${c} = ${ans}$.`,
            `Therefore, $\\lambda = ${ans}$.`,
          ),
          steps(
            `对 $e^{${r}x}$ 作用求导算子：$D(e^{${r}x}) = ${r}e^{${r}x}$，并且 $D^2(e^{${r}x}) = ${r * r}e^{${r}x}$。`,
            `代入微分算子多项式：$(D^2 + ${b}D + ${c})e^{${r}x} = (${r * r} + ${b}(${r}) + ${c})e^{${r}x}$。`,
            `计算特征多项式在 $r = ${r}$ 处的数值：$P(${r}) = ${r * r} + ${b * r} + ${c} = ${ans}$。`,
            `因此，$\\lambda = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + b, r * r + c, ans * 2],
        });
      },
    },
  ],
};

/** linearDifferentialOperators explores linearity and factoring of constant coefficient operators. */
export const linearDifferentialOperators: TopicDef = {
  id: "linear-differential-operators",
  title: t("Linear Differential Operators", "线性微分算子"),
  summary: t(
    "Linear differential operators commute when coefficients are constant, factoring as (D - r_1)(D - r_2) = D^2 - (r_1 + r_2)D + r_1 r_2.",
    "常系数线性微分算子满足可交换律与可因式分解性：(D - r_1)(D - r_2) = D^2 - (r_1 + r_2)D + r_1 r_2。",
  ),
  prerequisites: ["differential-operators"],
  encompasses: [{ topic: "differential-operators", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "linearity-and-composition-of-operators",
      title: t("Factoring constant-coefficient differential operators", "常系数微分算子的因式分解"),
      explanation: t(
        "Factoring the operator $(D - r_1)(D - r_2)$ gives $D^2 - (r_1 + r_2)D + r_1 r_2$. The constant term is $r_1 r_2$.",
        "展开微分算子乘积 $(D - r_1)(D - r_2)$ 可得 $D^2 - (r_1 + r_2)D + r_1 r_2$，其常数项为两根乘积 $r_1 r_2$。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.int(2, 12);
        const r2 = rng.int(r1 + 1, r1 + 10);
        const ans = r1 * r2;
        const b = r1 + r2;

        const prompt = t(
          `Expand the composition of linear differential operators $(D - ${r1})(D - ${r2})$ into standard form $D^2 - b D + c$. Find the constant coefficient $c$.`,
          `将线性微分算子的复合运算 $(D - ${r1})(D - ${r2})$ 展开为标准形式 $D^2 - b D + c$。求常数项系数 $c$ 的值。`,
        );
        const solution = t(
          steps(
            `Since the coefficients are constants, the operators commute: $(D - ${r1})(D - ${r2}) = D^2 - (${r1} + ${r2})D + (${r1})(${r2})$.`,
            `Compute the middle coefficient: $b = ${r1} + ${r2} = ${b}$.`,
            `Compute the constant term: $c = ${r1} \\times ${r2} = ${ans}$.`,
          ),
          steps(
            `因为微分算子均为常系数，运算满足乘法交换律与分配律：$(D - ${r1})(D - ${r2}) = D^2 - (${r1} + ${r2})D + (${r1})(${r2})$。`,
            `计算一次项系数：$b = ${r1} + ${r2} = ${b}$。`,
            `计算常数项系数：$c = ${r1} \\times ${r2} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [b, ans + r1, ans - r2],
        });
      },
    },
  ],
};

/** introductionToSecondOrderLinearOdes sets up the initial acceleration in second-order ODEs. */
export const introductionToSecondOrderLinearOdes: TopicDef = {
  id: "introduction-to-second-order-linear-odes",
  title: t("Introduction to Second-Order Linear ODEs", "二阶线性微分方程简介"),
  summary: t(
    "A second-order linear ODE y'' + P(x)y' + Q(x)y = g(x) uniquely determines the initial acceleration y''(x_0) from initial values y(x_0) and y'(x_0).",
    "二阶线性常微分方程 y'' + P(x)y' + Q(x)y = g(x) 由初值 y(x_0) 和 y'(x_0) 唯一确定初始二阶导数加速度 y''(x_0)。",
  ),
  prerequisites: ["linear-differential-operators"],
  encompasses: [{ topic: "linear-differential-operators", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "standard-form-of-second-order-linear-odes",
      title: t("Initial acceleration in second-order homogeneous ODEs", "二阶齐次微分方程的初始二阶导数值"),
      explanation: t(
        "From $y'' + p y' + q y = 0$, evaluating at $x = 0$ gives $y''(0) = -p y'(0) - q y(0)$.",
        "由方程 $y'' + p y' + q y = 0$ 在 $x = 0$ 处求值，可得初始二阶导数为 $y''(0) = -p y'(0) - q y(0)$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(1, 6);
        const q = rng.int(1, 6);
        const y0 = rng.int(1, 5);
        const y1 = rng.int(1, 5);
        const ans = -p * y1 - q * y0;

        const prompt = t(
          `Consider the second-order homogeneous differential equation $y'' + ${poly([p, "y'"])} + ${poly([q, "y"])} = 0$ subject to initial conditions $y(0) = ${y0}$ and $y'(0) = ${y1}$. Find the initial second derivative $y''(0)$.`,
          `考虑二阶齐次微分方程 $y'' + ${poly([p, "y'"])} + ${poly([q, "y"])} = 0$，初始条件为 $y(0) = ${y0}$ 和 $y'(0) = ${y1}$。求初始二阶导数值 $y''(0)$。`,
        );
        const solution = t(
          steps(
            `Rearrange the differential equation to isolate $y''$: $y'' = -${poly([p, "y'"])} - ${poly([q, "y"])}$.`,
            `Substitute the initial values $y(0) = ${y0}$ and $y'(0) = ${y1}$: $y''(0) = -${p}(${y1}) - ${q}(${y0})$.`,
            `Calculate: $y''(0) = -${p * y1} - ${q * y0} = ${ans}$.`,
          ),
          steps(
            `将微分方程移项解出最高阶导数 $y''$：$y'' = -${poly([p, "y'"])} - ${poly([q, "y"])}$。`,
            `代入初始条件 $y(0) = ${y0}$ 与 $y'(0) = ${y1}$：$y''(0) = -${p}(${y1}) - ${q}(${y0})$。`,
            `计算得出：$y''(0) = -${p * y1} - ${q * y0} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [-ans, ans + p, -p * y1 + q * y0],
        });
      },
    },
  ],
};

/** theSuperpositionPrinciple combines fundamental solutions to satisfy initial conditions. */
export const theSuperpositionPrinciple: TopicDef = {
  id: "the-superposition-principle",
  title: t("The Superposition Principle", "叠加原理"),
  summary: t(
    "If y_1 and y_2 solve the homogeneous linear ODE L[y] = 0, then any linear combination c_1 y_1 + c_2 y_2 is also a solution.",
    "若 y_1 与 y_2 是齐次线性微分方程 L[y] = 0 的解，则其任意线性组合 c_1 y_1 + c_2 y_2 仍是该方程的解。",
  ),
  prerequisites: ["introduction-to-second-order-linear-odes"],
  encompasses: [{ topic: "introduction-to-second-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "linear-superposition-of-homogeneous-solutions",
      title: t("Superposition of normalized initial value solutions", "规范化初值解的线性叠加"),
      explanation: t(
        "If $y_1$ satisfies $y_1(0) = 1, y_1'(0) = 0$ and $y_2$ satisfies $y_2(0) = 0, y_2'(0) = 1$, then the solution with $y(0) = A$ and $y'(0) = B$ is $y = A y_1 + B y_2$.",
        "若 $y_1$ 满足 $y_1(0) = 1, y_1'(0) = 0$ 且 $y_2$ 满足 $y_2(0) = 0, y_2'(0) = 1$，则满足初值 $y(0) = A, y'(0) = B$ 的特解为 $y = A y_1 + B y_2$。",
      ),
      generate(rng: Rng): Problem {
        const A = rng.int(2, 9);
        const B = rng.int(2, 9);
        const ans = A + B;

        const prompt = t(
          `Suppose $y_1(x)$ and $y_2(x)$ are two solutions to a linear homogeneous ODE $L[y] = 0$ satisfying $y_1(0) = 1, y_1'(0) = 0$ and $y_2(0) = 0, y_2'(0) = 1$. The solution satisfying $y(0) = ${A}$ and $y'(0) = ${B}$ is given by $y(x) = c_1 y_1(x) + c_2 y_2(x)$. Find the sum $c_1 + c_2$.`,
          `设 $y_1(x)$ 与 $y_2(x)$ 是齐次线性微分方程 $L[y] = 0$ 的两个解，且分别满足 $y_1(0) = 1, y_1'(0) = 0$ 和 $y_2(0) = 0, y_2'(0) = 1$。满足初始条件 $y(0) = ${A}$ 与 $y'(0) = ${B}$ 的解表示为 $y(x) = c_1 y_1(x) + c_2 y_2(x)$。求系数和 $c_1 + c_2$。`,
        );
        const solution = t(
          steps(
            `Evaluate $y(0) = c_1 y_1(0) + c_2 y_2(0) = c_1(1) + c_2(0) = c_1$. Setting $y(0) = ${A}$ gives $c_1 = ${A}$.`,
            `Differentiate and evaluate at $x = 0$: $y'(0) = c_1 y_1'(0) + c_2 y_2'(0) = c_1(0) + c_2(1) = c_2$. Setting $y'(0) = ${B}$ gives $c_2 = ${B}$.`,
            `Sum the coefficients: $c_1 + c_2 = ${A} + ${B} = ${ans}$.`,
          ),
          steps(
            `代入 $x = 0$ 处的值：$y(0) = c_1 y_1(0) + c_2 y_2(0) = c_1(1) + c_2(0) = c_1$。由 $y(0) = ${A}$ 得 $c_1 = ${A}$。`,
            `求导并在 $x = 0$ 处求值：$y'(0) = c_1 y_1'(0) + c_2 y_2'(0) = c_1(0) + c_2(1) = c_2$。由 $y'(0) = ${B}$ 得 $c_2 = ${B}$。`,
            `计算系数之和：$c_1 + c_2 = ${A} + ${B} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [A * B, ans + 1, Math.abs(A - B)],
        });
      },
    },
  ],
};

/** reductionOfOrder derives a second solution given one known solution. */
export const reductionOfOrder: TopicDef = {
  id: "reduction-of-order",
  title: t("Reduction of Order", "降阶法"),
  summary: t(
    "Given one solution y_1 to y'' + P(x)y' + Q(x)y = 0, setting y_2 = u(x) y_1 reduces the ODE to a first-order equation for v = u'.",
    "已知齐次方程 y'' + P(x)y' + Q(x)y = 0 的一个非零特解 y_1 时，设 y_2 = u(x) y_1 可将方程降阶为关于 v = u' 的一阶微分方程。",
  ),
  prerequisites: ["the-superposition-principle"],
  encompasses: [{ topic: "the-superposition-principle", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-a-second-solution-via-reduction-of-order",
      title: t("Finding a second solution via reduction of order", "利用降阶法求二阶齐次方程的第二个特解"),
      explanation: t(
        "For $y'' - 2a y' + a^2 y = 0$ with known solution $y_1 = e^{ax}$, the substitution $y = u e^{ax}$ yields $u'' = 0 \\implies u(x) = x$, giving the second independent solution $y_2 = x e^{ax}$.",
        "对于微分方程 $y'' - 2a y' + a^2 y = 0$，已知特解为 $y_1 = e^{ax}$。代换 $y = u e^{ax}$ 可降阶得 $u'' = 0 \\implies u(x) = x$，从而得到第二个线性无关解 $y_2 = x e^{ax}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 35);
        const ans = a;

        const prompt = t(
          `Given that $y_1 = e^{${a}x}$ is a solution to $y'' - ${2 * a}y' + ${a * a}y = 0$, the method of reduction of order with $y = u(x) e^{${a}x}$ yields a second linearly independent solution $y_2 = x e^{K x}$. Find the constant $K$.`,
          `已知 $y_1 = e^{${a}x}$ 是方程 $y'' - ${2 * a}y' + ${a * a}y = 0$ 的一个特解。通过降阶法设 $y = u(x) e^{${a}x}$，求得第二个线性无关特解形式为 $y_2 = x e^{K x}$。求常数 $K$ 的值。`,
        );
        const solution = t(
          steps(
            `Substitute $y = u(x) e^{${a}x}$ into the ODE: $y' = u' e^{${a}x} + ${a}u e^{${a}x}$ and $y'' = u'' e^{${a}x} + ${2 * a}u' e^{${a}x} + ${a * a}u e^{${a}x}$.`,
            `Plug into $y'' - ${2 * a}y' + ${a * a}y = 0$: $e^{${a}x}[u'' + (${2 * a} - ${2 * a})u' + (${a * a} - ${2 * a * a} + ${a * a})u] = 0$.`,
            `The equation simplifies to $u'' = 0$, which integrates to $u(x) = c_1 x + c_2$.`,
            `Choosing $u(x) = x$ gives the second solution $y_2 = x e^{${a}x}$, so $K = ${ans}$.`,
          ),
          steps(
            `将 $y = u(x) e^{${a}x}$ 代入微分方程：$y' = u' e^{${a}x} + ${a}u e^{${a}x}$，$y'' = u'' e^{${a}x} + ${2 * a}u' e^{${a}x} + ${a * a}u e^{${a}x}$。`,
            `代入方程 $y'' - ${2 * a}y' + ${a * a}y = 0$：$e^{${a}x}[u'' + (${2 * a} - ${2 * a})u' + (${a * a} - ${2 * a * a} + ${a * a})u] = 0$。`,
            `方程简化为 $u'' = 0$，积分得到 $u(x) = c_1 x + c_2$。`,
            `选取最简特解 $u(x) = x$，得第二个解为 $y_2 = x e^{${a}x}$，因此 $K = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [2 * a, a * a, a + 1],
        });
      },
    },
  ],
};

/** linearIndependenceOfSolutionsToHomogeneousOdes uses the Wronskian determinant. */
export const linearIndependenceOfSolutionsToHomogeneousOdes: TopicDef = {
  id: "linear-independence-of-solutions-to-homogeneous-odes",
  title: t("Linear Independence of Solutions to Homogeneous ODEs", "齐次常微分方程解的线性相关性与无关性"),
  summary: t(
    "Solutions y_1, y_2 are linearly independent on an interval if and only if their Wronskian W(y_1, y_2) = y_1 y_2' - y_1' y_2 is non-zero.",
    "区间上的解 y_1, y_2 线性无关当且仅当朗斯基行列式 W(y_1, y_2) = y_1 y_2' - y_1' y_2 处处不为零。",
  ),
  prerequisites: ["the-superposition-principle"],
  encompasses: [{ topic: "the-superposition-principle", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "the-wronskian-determinant",
      title: t("The Wronskian determinant", "朗斯基行列式"),
      explanation: t(
        "For $y_1 = \\cos(\\omega x)$ and $y_2 = \\sin(\\omega x)$, the Wronskian is $W(y_1, y_2) = (\\cos \\omega x)(\\omega \\cos \\omega x) - (-\\omega \\sin \\omega x)(\\sin \\omega x) = \\omega(\\cos^2 \\omega x + \\sin^2 \\omega x) = \\omega$.",
        "对于 $y_1 = \\cos(\\omega x)$ 和 $y_2 = \\sin(\\omega x)$，朗斯基行列式为 $W(y_1, y_2) = (\\cos \\omega x)(\\omega \\cos \\omega x) - (-\\omega \\sin \\omega x)(\\sin \\omega x) = \\omega(\\cos^2 \\omega x + \\sin^2 \\omega x) = \\omega$。",
      ),
      generate(rng: Rng): Problem {
        const omega = rng.int(2, 40);
        const ans = omega;

        const prompt = t(
          `Calculate the value of the Wronskian $W(y_1, y_2)(x)$ for the functions $y_1(x) = \\cos(${omega}x)$ and $y_2(x) = \\sin(${omega}x)$.`,
          `计算函数 $y_1(x) = \\cos(${omega}x)$ 与 $y_2(x) = \\sin(${omega}x)$ 的朗斯基行列式 $W(y_1, y_2)(x)$ 的值。`,
        );
        const solution = t(
          steps(
            `The Wronskian is defined by $W(y_1, y_2) = y_1 y_2' - y_1' y_2$.`,
            `Differentiate both functions: $y_1'(x) = -${omega}\\sin(${omega}x)$ and $y_2'(x) = ${omega}\\cos(${omega}x)$.`,
            `Substitute into the determinant: $W = [\\cos(${omega}x)][${omega}\\cos(${omega}x)] - [-${omega}\\sin(${omega}x)][\\sin(${omega}x)]$.`,
            `Factor: $W = ${omega}[\\cos^2(${omega}x) + \\sin^2(${omega}x)] = ${omega}(1) = ${ans}$.`,
          ),
          steps(
            `朗斯基行列式定义为 $W(y_1, y_2) = y_1 y_2' - y_1' y_2$。`,
            `求两函数的导数：$y_1'(x) = -${omega}\\sin(${omega}x)$，$y_2'(x) = ${omega}\\cos(${omega}x)$。`,
            `代入行列式展开式：$W = [\\cos(${omega}x)][${omega}\\cos(${omega}x)] - [-${omega}\\sin(${omega}x)][\\sin(${omega}x)]$.`,
            `提取公因式并利用三角恒等式：$W = ${omega}[\\cos^2(${omega}x) + \\sin^2(${omega}x)] = ${omega}(1) = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [omega * omega, 1, 0],
        });
      },
    },
  ],
};

/** generalSolutionsOfLinearOdes establishes y = y_h + y_p. */
export const generalSolutionsOfLinearOdes: TopicDef = {
  id: "general-solutions-of-linear-odes",
  title: t("General Solutions of Linear ODEs", "线性微分方程的通解结构"),
  summary: t(
    "The general solution of an inhomogeneous linear ODE is y(x) = c_1 y_1(x) + c_2 y_2(x) + y_p(x), where y_h is the homogeneous general solution and y_p is any particular solution.",
    "非齐次线性常微分方程的通解表示为齐次通解与一个非齐次特解之和：y(x) = c_1 y_1(x) + c_2 y_2(x) + y_p(x)。",
  ),
  prerequisites: ["linear-independence-of-solutions-to-homogeneous-odes"],
  encompasses: [
    {
      topic: "linear-independence-of-solutions-to-homogeneous-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "structure-of-general-solutions-homogeneous-and-particular",
      title: t("Particular and homogeneous solution structure", "通解结构与特解初值问题"),
      explanation: t(
        "For an inhomogeneous equation with known particular constant solution $y_p = C_0$ and homogeneous solutions $y_1 = e^x, y_2 = e^{-x}$, the general solution is $y(x) = c_1 e^x + c_2 e^{-x} + C_0$.",
        "对于已知常数特解 $y_p = C_0$ 且对应齐次通解为 $c_1 e^x + c_2 e^{-x}$ 的方程，全通解为 $y(x) = c_1 e^x + c_2 e^{-x} + C_0$。",
      ),
      generate(rng: Rng): Problem {
        const C0 = rng.int(2, 15);
        const c1 = rng.int(1, 6);
        const c2 = rng.int(1, 6);
        const y0 = c1 + c2 + C0;
        const ans = c1;

        const prompt = t(
          `An inhomogeneous second-order linear ODE has general solution $y(x) = c_1 e^x + c_2 e^{-x} + ${C0}$. If $y(0) = ${y0}$ and $y'(0) = ${c1 - c2}$, find the value of $c_1$.`,
          `某非齐次二阶线性微分方程的通解为 $y(x) = c_1 e^x + c_2 e^{-x} + ${C0}$。已知初值 $y(0) = ${y0}$ 且 $y'(0) = ${c1 - c2}$。求常数 $c_1$ 的值。`,
        );
        const solution = t(
          steps(
            `Apply the condition $y(0) = ${y0}$: $c_1 e^0 + c_2 e^0 + ${C0} = ${y0} \\implies c_1 + c_2 = ${y0 - C0}$.`,
            `Differentiate $y(x)$: $y'(x) = c_1 e^x - c_2 e^{-x}$.`,
            `Apply $y'(0) = ${c1 - c2}$: $c_1 - c_2 = ${c1 - c2}$.`,
            `Add the two linear equations: $2c_1 = (${y0 - C0}) + (${c1 - c2}) = ${2 * c1} \\implies c_1 = ${ans}$.`,
          ),
          steps(
            `代入初值 $y(0) = ${y0}$：$c_1 e^0 + c_2 e^0 + ${C0} = ${y0} \\implies c_1 + c_2 = ${y0 - C0}$。`,
            `对 $y(x)$ 求导：$y'(x) = c_1 e^x - c_2 e^{-x}$。`,
            `代入初值 $y'(0) = ${c1 - c2}$：$c_1 - c_2 = ${c1 - c2}$。`,
            `两式相加消去 $c_2$：$2c_1 = (${y0 - C0}) + (${c1 - c2}) = ${2 * c1} \\implies c_1 = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [c2, ans + C0, c1 + c2],
        });
      },
    },
  ],
};

/** abelsIdentity calculates Wronskian evolution W'(x) + P(x)W(x) = 0. */
export const abelsIdentity: TopicDef = {
  id: "abels-identity",
  title: t("Abel's Identity", "阿贝尔恒等式"),
  summary: t(
    "Abel's identity states that the Wronskian of two solutions to y'' + P(x)y' + Q(x)y = 0 satisfies W(x) = W(x_0) exp(-∫_{x_0}^x P(t) dt).",
    "阿贝尔恒等式指出齐次方程 y'' + P(x)y' + Q(x)y = 0 的解的朗斯基行列式满足 W(x) = W(x_0) exp(-∫_{x_0}^x P(t) dt)。",
  ),
  prerequisites: ["linear-independence-of-solutions-to-homogeneous-odes"],
  encompasses: [
    {
      topic: "linear-independence-of-solutions-to-homogeneous-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "abels-formula-for-the-wronskian",
      title: t("Abel's formula for the Wronskian", "阿贝尔微分公式与朗斯基行列式"),
      explanation: t(
        "For $y'' + a y' + b y = 0$ with constant coefficient $a$, the Wronskian satisfies $\\frac{dW}{dx} = -a W$. Thus $\\frac{W'(0)}{W(0)} = -a$.",
        "对于常系数齐次方程 $y'' + a y' + b y = 0$，朗斯基行列式满足微分方程 $\\frac{dW}{dx} = -a W$，因此导数相对变化率为 $\\frac{W'(0)}{W(0)} = -a$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 30);
        const ans = -a;

        const prompt = t(
          `Let $y_1$ and $y_2$ be two solutions of the differential equation $y'' + ${a}y' + 12y = 0$ with non-zero Wronskian $W(x)$. Using Abel's identity, calculate the ratio $\\frac{W'(0)}{W(0)}$.`,
          `设 $y_1$ 与 $y_2$ 是常微分方程 $y'' + ${a}y' + 12y = 0$ 的两个解，其朗斯基行列式 $W(x) \\neq 0$。利用阿贝尔恒等式，计算比值 $\\frac{W'(0)}{W(0)}$。`,
        );
        const solution = t(
          steps(
            `According to Abel's identity, the Wronskian satisfies the differential equation $W'(x) + P(x)W(x) = 0$.`,
            `Here $P(x) = ${a}$, so $W'(x) + ${a}W(x) = 0$.`,
            `Rearranging yields $\\frac{W'(x)}{W(x)} = -${a}$.`,
            `Evaluating at $x = 0$, the ratio is $\\frac{W'(0)}{W(0)} = ${ans}$.`,
          ),
          steps(
            `根据阿贝尔恒等式，朗斯基行列式满足一阶微分方程 $W'(x) + P(x)W(x) = 0$。`,
            `在此方程中 $P(x) = ${a}$，故有 $W'(x) + ${a}W(x) = 0$。`,
            `移项两端除以 $W(x)$ 可得 $\\frac{W'(x)}{W(x)} = -${a}$。`,
            `在 $x = 0$ 处求值，得到比值为 $\\frac{W'(0)}{W(0)} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a, -12, 12],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3.9 Second-Order Linear ODEs With Constant Coefficients
// ---------------------------------------------------------------------------

/** secondOrderHomogeneousOdesCharacteristicEquationsWithDistinctRealRoots solves distinct roots. */
export const secondOrderHomogeneousOdesCharacteristicEquationsWithDistinctRealRoots: TopicDef = {
  id: "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots",
  title: t(
    "Second-Order Homogeneous ODEs: Characteristic Equations With Distinct Real Roots",
    "二阶齐次常微分方程：具有不同实根的特征方程",
  ),
  summary: t(
    "When the characteristic equation r^2 + br + c = 0 has distinct real roots r_1 ≠ r_2, the general solution is y = c_1 e^{r_1 x} + c_2 e^{r_2 x}.",
    "当特征方程 r^2 + br + c = 0 具有两个不同实根 r_1 ≠ r_2 时，齐次通解为 y = c_1 e^{r_1 x} + c_2 e^{r_2 x}。",
  ),
  prerequisites: ["general-solutions-of-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "distinct-real-characteristic-roots",
      title: t("Distinct real characteristic roots", "互异实特征根与指数通解"),
      explanation: t(
        "If the characteristic polynomial factors as $(r - r_1)(r - r_2) = 0$ with $r_1 \\ne r_2$, the characteristic roots are $r_1$ and $r_2$.",
        "若特征多项式分解为 $(r - r_1)(r - r_2) = 0$（$r_1 \\ne r_2$），则特征根为 $r_1$ 和 $r_2$。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.int(1, 8);
        const r2 = rng.int(r1 + 1, r1 + 10);
        const b = -(r1 + r2);
        const c = r1 * r2;
        const ans = r2; // larger root

        const prompt = t(
          `Find the larger characteristic root $r$ of the differential equation $y'' ${b}y' + ${c}y = 0$.`,
          `求微分方程 $y'' ${b}y' + ${c}y = 0$ 中较大的特征根 $r$。`,
        );
        const solution = t(
          steps(
            `Write the characteristic equation: $r^2 ${b}r + ${c} = 0$.`,
            `Factor the quadratic: $(r - ${r1})(r - ${r2}) = 0$.`,
            `The roots are $r = ${r1}$ and $r = ${r2}$.`,
            `The larger characteristic root is $r = ${ans}$.`,
          ),
          steps(
            `写出对应的特征方程：$r^2 ${b}r + ${c} = 0$。`,
            `因式分解一元二次方程：$(r - ${r1})(r - ${r2}) = 0$。`,
            `解得两特征根为 $r = ${r1}$ 和 $r = ${r2}$。`,
            `其中较大的特征根为 $r = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [r1, -(r1 + r2), r1 * r2],
        });
      },
    },
  ],
};

/** secondOrderHomogeneousOdesCharacteristicEquationsWithRepeatedRoots solves double root. */
export const secondOrderHomogeneousOdesCharacteristicEquationsWithRepeatedRoots: TopicDef = {
  id: "second-order-homogeneous-odes-characteristic-equations-with-repeated-roots",
  title: t("Second-Order Homogeneous ODEs: Characteristic Equations With Repeated Roots", "二阶齐次常微分方程：具有重根的特征方程"),
  summary: t(
    "When the characteristic equation has a repeated root r, the general solution is y = (c_1 + c_2 x) e^{rx}.",
    "当特征方程具有二重实根 r 时，齐次通解为 y = (c_1 + c_2 x) e^{rx}。",
  ),
  prerequisites: ["second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots"],
  encompasses: [
    {
      topic: "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "repeated-characteristic-roots",
      title: t("Repeated characteristic roots", "二重实特征根与通解构造"),
      explanation: t(
        "For $(r - a)^2 = 0$, the repeated root is $r = a$. The general solution is $y(x) = (c_1 + c_2 x)e^{ax}$.",
        "对于 $(r - a)^2 = 0$，二重特征根为 $r = a$。通解为 $y(x) = (c_1 + c_2 x)e^{ax}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 30);
        const b = 2 * a;
        const c = a * a;
        const ans = a;

        const prompt = t(
          `Find the repeated characteristic root $r$ of the differential equation $y'' - ${b}y' + ${c}y = 0$.`,
          `求微分方程 $y'' - ${b}y' + ${c}y = 0$ 的二重特征根 $r$。`,
        );
        const solution = t(
          steps(
            `Write the characteristic equation: $r^2 - ${b}r + ${c} = 0$.`,
            `Recognize the perfect square: $(r - ${a})^2 = 0$.`,
            `The repeated characteristic root is $r = ${ans}$.`,
          ),
          steps(`列出特征方程：$r^2 - ${b}r + ${c} = 0$。`, `观察为完全平方式：$(r - ${a})^2 = 0$。`, `解得二重特征根为 $r = ${ans}$。`),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [b, c, -a],
        });
      },
    },
  ],
};

/** secondOrderHomogeneousOdesCharacteristicEquationsWithComplexRoots solves complex roots. */
export const secondOrderHomogeneousOdesCharacteristicEquationsWithComplexRoots: TopicDef = {
  id: "second-order-homogeneous-odes-characteristic-equations-with-complex-roots",
  title: t("Second-Order Homogeneous ODEs: Characteristic Equations With Complex Roots", "二阶齐次常微分方程：具有复数根的特征方程"),
  summary: t(
    "When characteristic roots are complex conjugates α ± iβ, the general solution oscillates with exponential envelope: y = e^{αx}(c_1 cos(βx) + c_2 sin(βx)).",
    "当特征方程具有共轭复根 α ± iβ 时，通解为带指数包络的振荡形式：y = e^{αx}(c_1 cos(βx) + c_2 sin(βx))。",
  ),
  prerequisites: ["second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots"],
  encompasses: [
    {
      topic: "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "complex-conjugate-characteristic-roots",
      title: t("Complex conjugate characteristic roots", "共轭复特征根与振荡角频率"),
      explanation: t(
        "For $r = \\alpha \\pm i \\beta$, the angular frequency in the trigonometric arguments is $\\beta = \\sqrt{c - \\alpha^2}$.",
        "特征根为 $r = \\alpha \\pm i \\beta$ 时，三角函数中的振荡角频率为虚部 $\\beta = \\sqrt{c - \\alpha^2}$。",
      ),
      generate(rng: Rng): Problem {
        const alpha = rng.int(1, 6);
        const beta = rng.int(2, 10);
        const b = 2 * alpha;
        const c = alpha * alpha + beta * beta;
        const ans = beta;

        const prompt = t(
          `The characteristic equation of $y'' - ${b}y' + ${c}y = 0$ has complex conjugate roots $\\alpha \\pm i\\beta$ with $\\beta > 0$. Find the imaginary part $\\beta$.`,
          `微分方程 $y'' - ${b}y' + ${c}y = 0$ 的特征方程具有共轭复根 $\\alpha \\pm i\\beta$（$\\beta > 0$）。求其虚部 $\\beta$ 的值。`,
        );
        const solution = t(
          steps(
            `The characteristic equation is $r^2 - ${b}r + ${c} = 0$.`,
            `Complete the square: $(r - ${alpha})^2 + ${beta * beta} = 0$.`,
            `Solve for $r$: $(r - ${alpha})^2 = -${beta * beta} \\implies r = ${alpha} \\pm ${beta}i$.`,
            `The imaginary part is $\\beta = ${ans}$.`,
          ),
          steps(
            `特征方程为 $r^2 - ${b}r + ${c} = 0$。`,
            `配方化简：$(r - ${alpha})^2 + ${beta * beta} = 0$。`,
            `解出根：$(r - ${alpha})^2 = -${beta * beta} \\implies r = ${alpha} \\pm ${beta}i$。`,
            `因此虚部为 $\\beta = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [alpha, beta * beta, alpha + beta],
        });
      },
    },
  ],
};

/** secondOrderHomogeneousInitialValueProblems solves constant-coefficient IVPs. */
export const secondOrderHomogeneousInitialValueProblems: TopicDef = {
  id: "second-order-homogeneous-initial-value-problems",
  title: t("Second-Order Homogeneous Initial Value Problems", "二阶齐次常微分方程的初值问题"),
  summary: t(
    "Solving an IVP y'' + by' + cy = 0 with y(0) = y_0 and y'(0) = y_1 uniquely determines arbitrary constants c_1 and c_2.",
    "求解初值条件为 y(0) = y_0 与 y'(0) = y_1 的二阶齐次初值问题可唯一确定通解中的待定任意常数 c_1 与 c_2。",
  ),
  prerequisites: ["second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots"],
  encompasses: [
    {
      topic: "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "solving-second-order-homogeneous-ivp",
      title: t("Solving second-order homogeneous initial value problems", "求解二阶齐次线性初值问题"),
      explanation: t(
        "For $y'' + \\omega^2 y = 0$ with $y(0) = y_0$ and $y'(0) = y_1$, the solution is $y(x) = y_0 \\cos(\\omega x) + \\frac{y_1}{\\omega} \\sin(\\omega x)$.",
        "对于简谐振动方程 $y'' + \\omega^2 y = 0$（初值 $y(0) = y_0, y'(0) = y_1$），特解为 $y(x) = y_0 \\cos(\\omega x) + \\frac{y_1}{\\omega} \\sin(\\omega x)$。",
      ),
      generate(rng: Rng): Problem {
        const omega = rng.int(2, 10);
        const y0 = rng.int(1, 8);
        const coeffSin = rng.int(1, 8);
        const y1 = coeffSin * omega; // integer initial slope
        const ans = coeffSin;

        const prompt = t(
          `Solve the initial value problem $y'' + ${omega * omega}y = 0$ with $y(0) = ${y0}$ and $y'(0) = ${y1}$. The solution has the form $y(x) = A\\cos(${omega}x) + B\\sin(${omega}x)$. Find the coefficient $B$.`,
          `求解初值问题 $y'' + ${omega * omega}y = 0$，初值为 $y(0) = ${y0}$ 和 $y'(0) = ${y1}$。解具有形式 $y(x) = A\\cos(${omega}x) + B\\sin(${omega}x)$。求系数 $B$ 的值。`,
        );
        const solution = t(
          steps(
            `The general solution to $y'' + ${omega * omega}y = 0$ is $y(x) = A\\cos(${omega}x) + B\\sin(${omega}x)$.`,
            `Differentiate: $y'(x) = -${omega}A\\sin(${omega}x) + ${omega}B\\cos(${omega}x)$.`,
            `Apply $y'(0) = ${y1}$: $y'(0) = ${omega}B = ${y1}$.`,
            `Solve for $B$: $B = \\frac{${y1}}{${omega}} = ${ans}$.`,
          ),
          steps(
            `方程 $y'' + ${omega * omega}y = 0$ 的通解为 $y(x) = A\\cos(${omega}x) + B\\sin(${omega}x)$。`,
            `求导：$y'(x) = -${omega}A\\sin(${omega}x) + ${omega}B\\cos(${omega}x)$。`,
            `代入初值 $y'(0) = ${y1}$：$y'(0) = ${omega}B = ${y1}$。`,
            `解得系数 $B$：$B = \\frac{${y1}}{${omega}} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [y0, ans * omega, y1],
        });
      },
    },
  ],
};

/** secondOrderInhomogeneousOdesWithPolynomialForcing finds polynomial yp. */
export const secondOrderInhomogeneousOdesWithPolynomialForcing: TopicDef = {
  id: "second-order-inhomogeneous-odes-with-polynomial-forcing",
  title: t("Second-Order Inhomogeneous ODEs With Polynomial Forcing", "多项式激励下的二阶非齐次常微分方程"),
  summary: t(
    "For y'' + by' + cy = P(x) with c ≠ 0, the method of undetermined coefficients seeks a particular solution of matching degree: y_p(x) = A_n x^n + ... + A_0.",
    "当 c ≠ 0 时，对于多项式右端项 y'' + by' + cy = P(x)，待定系数法设同次多项式特解 y_p(x) = A_n x^n + ... + A_0 进行求解。",
  ),
  prerequisites: ["second-order-homogeneous-initial-value-problems"],
  encompasses: [
    {
      topic: "second-order-homogeneous-initial-value-problems",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "undetermined-coefficients-polynomial",
      title: t("Undetermined coefficients for polynomial forcing", "多项式右端项的待定系数法"),
      explanation: t(
        "For $y'' + b y' + c y = K x$ with $c \\ne 0$, setting $y_p = A x + B$ gives $c A = K \\implies A = K / c$.",
        "对于 $y'' + b y' + c y = K x$（$c \\ne 0$），设 $y_p = A x + B$ 代入可得最高次项系数满足 $c A = K \\implies A = K / c$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 10);
        const A = rng.int(2, 12);
        const K = A * c;
        const b = rng.int(1, 6);
        const ans = A;

        const prompt = t(
          `Find the coefficient $A$ of the linear term in the particular solution $y_p(x) = A x + B$ to the inhomogeneous ODE $y'' + ${poly([b, "y'"])} + ${poly([c, "y"])} = ${poly([K, "x"])}$.`,
          `对于非齐次微分方程 $y'' + ${poly([b, "y'"])} + ${poly([c, "y"])} = ${poly([K, "x"])}$，设其一次多项式特解为 $y_p(x) = A x + B$。求线性项系数 $A$ 的值。`,
        );
        const solution = t(
          steps(
            `Compute derivatives: $y_p' = A$ and $y_p'' = 0$.`,
            `Substitute into the ODE: $0 + ${b}(A) + ${c}(Ax + B) = ${poly([K, "x"])}$.`,
            `Equate coefficients of $x$: $${c}A = ${K} \\implies A = \\frac{${K}}{${c}} = ${ans}$.`,
          ),
          steps(
            `求导：$y_p' = A$，$y_p'' = 0$。`,
            `代入原方程：$0 + ${b}(A) + ${c}(Ax + B) = ${poly([K, "x"])}$。`,
            `对比一次项系数：$${c}A = ${K} \\implies A = \\frac{${K}}{${c}} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [K, c, ans + b],
        });
      },
    },
  ],
};

/** secondOrderInhomogeneousOdesWithExponentialForcing finds exponential yp. */
export const secondOrderInhomogeneousOdesWithExponentialForcing: TopicDef = {
  id: "second-order-inhomogeneous-odes-with-exponential-forcing",
  title: t("Second-Order Inhomogeneous ODEs With Exponential Forcing", "指数激励下的二阶非齐次常微分方程"),
  summary: t(
    "For y'' + by' + cy = K e^{mx} where m is not a characteristic root, the particular solution is y_p = A e^{mx} with A = K / P(m).",
    "对于指数激励 y'' + by' + cy = K e^{mx}，当 m 不是特征根时，特解具有形式 y_p = A e^{mx}，其中 A = K / P(m)。",
  ),
  prerequisites: ["second-order-inhomogeneous-odes-with-polynomial-forcing"],
  encompasses: [
    {
      topic: "second-order-inhomogeneous-odes-with-polynomial-forcing",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "undetermined-coefficients-exponential",
      title: t("Undetermined coefficients for exponential forcing", "指数右端项的待定系数法"),
      explanation: t(
        "Applying $P(D)$ to $A e^{mx}$ gives $A P(m) e^{mx} = K e^{mx} \\implies A = \\frac{K}{P(m)}$.",
        "将特征算子 $P(D)$ 作用于 $A e^{mx}$ 得 $A P(m) e^{mx} = K e^{mx} \\implies A = \\frac{K}{P(m)}$。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(1, 4);
        const b = rng.int(1, 5);
        const c = rng.int(1, 6);
        const Pm = m * m + b * m + c; // strictly positive
        const A = rng.int(2, 10);
        const K = A * Pm;
        const ans = A;

        const prompt = t(
          `Find the amplitude $A$ of the particular solution $y_p(x) = A e^{${poly([m, "x"])}}$ to the differential equation $y'' + ${poly([b, "y'"])} + ${poly([c, "y"])} = ${K}e^{${poly([m, "x"])}}$.`,
          `求微分方程 $y'' + ${poly([b, "y'"])} + ${poly([c, "y"])} = ${K}e^{${poly([m, "x"])}}$ 的特解 $y_p(x) = A e^{${poly([m, "x"])}}$ 的振幅系数 $A$。`,
        );
        const solution = t(
          steps(
            `Compute derivatives of $y_p = A e^{${poly([m, "x"])}}$: $y_p' = ${m}A e^{${poly([m, "x"])}}$ and $y_p'' = ${m * m}A e^{${poly([m, "x"])}}$.`,
            `Substitute into the differential equation: $(${m * m} + ${b}(${m}) + ${c}) A e^{${poly([m, "x"])}} = ${K}e^{${poly([m, "x"])}}$.`,
            `Evaluate $P(${m}) = ${m * m} + ${b * m} + ${c} = ${Pm}$.`,
            `Solve for $A$: $A = \\frac{${K}}{${Pm}} = ${ans}$.`,
          ),
          steps(
            `对特解 $y_p = A e^{${poly([m, "x"])}}$ 求导：$y_p' = ${m}A e^{${poly([m, "x"])}}$，$y_p'' = ${m * m}A e^{${poly([m, "x"])}}$。`,
            `代入微分方程：$(${m * m} + ${b}(${m}) + ${c}) A e^{${poly([m, "x"])}} = ${K}e^{${poly([m, "x"])}}$。`,
            `计算特征多项式的值：$P(${m}) = ${m * m} + ${b * m} + ${c} = ${Pm}$。`,
            `解出待定系数 $A$：$A = \\frac{${K}}{${Pm}} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [K, Pm, ans + m],
        });
      },
    },
  ],
};

/** secondOrderInhomogeneousOdesWithSinusoidalForcing finds sinusoidal yp. */
export const secondOrderInhomogeneousOdesWithSinusoidalForcing: TopicDef = {
  id: "second-order-inhomogeneous-odes-with-sinusoidal-forcing",
  title: t("Second-Order Inhomogeneous ODEs With Sinusoidal Forcing", "正弦激励下的二阶非齐次常微分方程"),
  summary: t(
    "For y'' + ω_0^2 y = F_0 cos(ω x) with ω ≠ ω_0, the particular solution is y_p(x) = [F_0 / (ω_0^2 - ω^2)] cos(ω x).",
    "对于简谐受迫振动 y'' + ω_0^2 y = F_0 cos(ω x)（ω ≠ ω_0），特解为 y_p(x) = [F_0 / (ω_0^2 - ω^2)] cos(ω x)。",
  ),
  prerequisites: ["second-order-inhomogeneous-odes-with-exponential-forcing"],
  encompasses: [
    {
      topic: "second-order-inhomogeneous-odes-with-exponential-forcing",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "undetermined-coefficients-sinusoidal",
      title: t("Undetermined coefficients for sinusoidal forcing", "正弦三角函数右端项的待定系数法"),
      explanation: t(
        "For $y'' + \\omega_0^2 y = F_0 \\cos(\\omega x)$, substituting $y_p = A \\cos(\\omega x)$ yields $(-\\omega^2 + \\omega_0^2) A = F_0 \\implies A = \\frac{F_0}{\\omega_0^2 - \\omega^2}$.",
        "对于 $y'' + \\omega_0^2 y = F_0 \\cos(\\omega x)$，代入 $y_p = A \\cos(\\omega x)$ 得 $(-\\omega^2 + \\omega_0^2) A = F_0 \\implies A = \\frac{F_0}{\\omega_0^2 - \\omega^2}$。",
      ),
      generate(rng: Rng): Problem {
        const omega = rng.int(1, 4);
        const omega0 = rng.int(omega + 1, omega + 5);
        const denom = omega0 * omega0 - omega * omega;
        const A = rng.int(2, 10);
        const F0 = A * denom;
        const ans = A;

        const prompt = t(
          `Find the amplitude $A$ of the particular solution $y_p(x) = A \\cos(${poly([omega, "x"])})$ to the differential equation $y'' + ${poly([omega0 * omega0, "y"])} = ${F0}\\cos(${poly([omega, "x"])})$.`,
          `求微分方程 $y'' + ${poly([omega0 * omega0, "y"])} = ${F0}\\cos(${poly([omega, "x"])})$ 的特解 $y_p(x) = A \\cos(${poly([omega, "x"])})$ 的振幅系数 $A$。`,
        );
        const solution = t(
          steps(
            `Substitute $y_p = A\\cos(${poly([omega, "x"])})$: $y_p'' = -${omega * omega}A\\cos(${poly([omega, "x"])})$.`,
            `Plug into the equation: $[-${omega * omega} + ${omega0 * omega0}] A\\cos(${poly([omega, "x"])}) = ${F0}\\cos(${poly([omega, "x"])})$.`,
            `Evaluate the coefficient difference: $${omega0 * omega0} - ${omega * omega} = ${denom}$.`,
            `Solve for $A$: $A = \\frac{${F0}}{${denom}} = ${ans}$.`,
          ),
          steps(
            `将特解 $y_p = A\\cos(${poly([omega, "x"])})$ 求二阶导：$y_p'' = -${omega * omega}A\\cos(${poly([omega, "x"])})$。`,
            `代入原方程：$[-${omega * omega} + ${omega0 * omega0}] A\\cos(${poly([omega, "x"])}) = ${F0}\\cos(${poly([omega, "x"])})$。`,
            `计算系数差：$${omega0 * omega0} - ${omega * omega} = ${denom}$。`,
            `解出待定振幅 $A$：$A = \\frac{${F0}}{${denom}} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [F0, denom, ans * 2],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3.10 The Cauchy-Euler Equations
// ---------------------------------------------------------------------------

/** cauchyEulerEquationsCharacteristicEquationsWithDistinctRealRoots solves distinct m. */
export const cauchyEulerEquationsCharacteristicEquationsWithDistinctRealRoots: TopicDef = {
  id: "cauchy-euler-equations-characteristic-equations-with-distinct-real-roots",
  title: t("Cauchy-Euler Equations: Characteristic Equations With Distinct Real Roots", "柯西-欧拉方程：具有不同实根的特征方程"),
  summary: t(
    "Substituting y = x^m into x^2 y'' + a x y' + b y = 0 yields m(m-1) + a m + b = 0, giving power solutions y = c_1 x^{m_1} + c_2 x^{m_2}.",
    "将 y = x^m 代入柯西-欧拉方程 x^2 y'' + a x y' + b y = 0 得到特征方程 m(m-1) + a m + b = 0，从而得到幂函数通解 y = c_1 x^{m_1} + c_2 x^{m_2}。",
  ),
  prerequisites: ["second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots"],
  encompasses: [
    {
      topic: "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "cauchy-euler-distinct-real-roots",
      title: t("Indicial equation with distinct real roots", "柯西-欧拉方程的互异实指标根"),
      explanation: t(
        "For $x^2 y'' + a x y' + b y = 0$, the indicial equation is $m^2 + (a - 1)m + b = 0$.",
        "对于柯西-欧拉方程 $x^2 y'' + a x y' + b y = 0$，指标特征方程为 $m^2 + (a - 1)m + b = 0$。",
      ),
      generate(rng: Rng): Problem {
        const m1 = rng.int(1, 6);
        const m2 = rng.int(m1 + 1, m1 + 8);
        // m^2 + (a - 1)m + b = (m - m1)(m - m2) = m^2 - (m1 + m2)m + m1*m2
        // so a - 1 = -(m1 + m2) => a = 1 - (m1 + m2)
        // or pick roots of m^2 + A m + B with positive coefficients
        // Let m1, m2 be positive, let indicial eq be (m - m1)(m - m2) = m^2 - (m1+m2)m + m1*m2
        // Then a = 1 - (m1 + m2), b = m1 * m2
        const aCoeff = 1 - (m1 + m2);
        const bCoeff = m1 * m2;
        const ans = m2; // larger root

        const prompt = t(
          `Find the larger power exponent $m$ in the fundamental solutions $y = x^m$ to the Cauchy-Euler differential equation $x^2 y'' ${aCoeff < 0 ? `- ${-aCoeff}` : `+ ${aCoeff}`}x y' + ${bCoeff}y = 0$ (for $x > 0$).`,
          `求柯西-欧拉微分方程 $x^2 y'' ${aCoeff < 0 ? `- ${-aCoeff}` : `+ ${aCoeff}`}x y' + ${bCoeff}y = 0$（$x > 0$）的基本解 $y = x^m$ 中较大的幂指数 $m$。`,
        );
        const solution = t(
          steps(
            `Substitute $y = x^m$: $y' = m x^{m-1}$ and $y'' = m(m-1)x^{m-2}$.`,
            `Plug into the equation: $x^2 [m(m-1)x^{m-2}] + (${aCoeff})x [m x^{m-1}] + ${bCoeff}x^m = 0$.`,
            `Divide by $x^m$: $m(m-1) + (${aCoeff})m + ${bCoeff} = 0 \\implies m^2 - ${m1 + m2}m + ${bCoeff} = 0$.`,
            `Factor: $(m - ${m1})(m - ${m2}) = 0$, giving roots $m = ${m1}$ and $m = ${m2}$.`,
            `The larger exponent is $m = ${ans}$.`,
          ),
          steps(
            `代入解的形式 $y = x^m$：$y' = m x^{m-1}$，$y'' = m(m-1)x^{m-2}$。`,
            `代入方程：$x^2 [m(m-1)x^{m-2}] + (${aCoeff})x [m x^{m-1}] + ${bCoeff}x^m = 0$。`,
            `同除以 $x^m$：$m(m-1) + (${aCoeff})m + ${bCoeff} = 0 \\implies m^2 - ${m1 + m2}m + ${bCoeff} = 0$。`,
            `因式分解：$(m - ${m1})(m - ${m2}) = 0$，解得指标根 $m = ${m1}$ 与 $m = ${m2}$。`,
            `其中较大的幂指数为 $m = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [m1, m1 + m2, bCoeff],
        });
      },
    },
  ],
};

/** cauchyEulerEquationsCharacteristicEquationsWithRepeatedRoots solves double m. */
export const cauchyEulerEquationsCharacteristicEquationsWithRepeatedRoots: TopicDef = {
  id: "cauchy-euler-equations-characteristic-equations-with-repeated-roots",
  title: t("Cauchy-Euler Equations: Characteristic Equations With Repeated Roots", "柯西-欧拉方程：具有重根的特征方程"),
  summary: t(
    "When the indicial equation has a repeated root m, the general solution is y = (c_1 + c_2 ln x) x^m.",
    "当指标特征方程具有二重实根 m 时，柯西-欧拉方程的通解为 y = (c_1 + c_2 ln x) x^m。",
  ),
  prerequisites: ["cauchy-euler-equations-characteristic-equations-with-distinct-real-roots"],
  encompasses: [
    {
      topic: "cauchy-euler-equations-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "cauchy-euler-repeated-roots",
      title: t("Indicial equation with repeated roots", "柯西-欧拉方程的二重指标根"),
      explanation: t(
        "For $(m - k)^2 = 0$, the repeated root is $m = k$. The second independent solution incorporates a logarithmic factor: $y_2 = x^k \\ln x$.",
        "对于 $(m - k)^2 = 0$，二重指标根为 $m = k$。第二个线性无关解引入对数因子：$y_2 = x^k \\ln x$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 35);
        // (m - k)^2 = m^2 - 2k m + k^2
        // a - 1 = -2k => a = 1 - 2k
        const aCoeff = 1 - 2 * k;
        const bCoeff = k * k;
        const ans = k;

        const prompt = t(
          `Find the repeated power root $m$ of the indicial equation for $x^2 y'' ${aCoeff < 0 ? `- ${-aCoeff}` : `+ ${aCoeff}`}x y' + ${bCoeff}y = 0$.`,
          `求柯西-欧拉微分方程 $x^2 y'' ${aCoeff < 0 ? `- ${-aCoeff}` : `+ ${aCoeff}`}x y' + ${bCoeff}y = 0$ 的指标特征方程二重根 $m$。`,
        );
        const solution = t(
          steps(
            `The indicial equation is $m(m-1) + (${aCoeff})m + ${bCoeff} = 0$.`,
            `Simplify: $m^2 - ${2 * k}m + ${bCoeff} = (m - ${k})^2 = 0$.`,
            `The repeated root is $m = ${ans}$.`,
          ),
          steps(
            `写出指标特征方程：$m(m-1) + (${aCoeff})m + ${bCoeff} = 0$。`,
            `整理化简：$m^2 - ${2 * k}m + ${bCoeff} = (m - ${k})^2 = 0$。`,
            `求得二重指标根为 $m = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [2 * k, bCoeff, ans + 1],
        });
      },
    },
  ],
};

/** cauchyEulerEquationsCharacteristicEquationsWithComplexRoots solves complex m. */
export const cauchyEulerEquationsCharacteristicEquationsWithComplexRoots: TopicDef = {
  id: "cauchy-euler-equations-characteristic-equations-with-complex-roots",
  title: t("Cauchy-Euler Equations: Characteristic Equations With Complex Roots", "柯西-欧拉方程：具有复数根的特征方程"),
  summary: t(
    "When indicial roots are α ± iβ, the general solution is y = x^α [c_1 cos(β ln x) + c_2 sin(β ln x)].",
    "当指标方程具有共轭复根 α ± iβ 时，柯西-欧拉方程的通解为 y = x^α [c_1 cos(β ln x) + c_2 sin(β ln x)]。",
  ),
  prerequisites: ["cauchy-euler-equations-characteristic-equations-with-distinct-real-roots"],
  encompasses: [
    {
      topic: "cauchy-euler-equations-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "cauchy-euler-complex-roots",
      title: t("Indicial equation with complex roots", "柯西-欧拉方程的复数指标根"),
      explanation: t(
        "For $x^2 y'' + x y' + \\beta^2 y = 0$, the indicial equation is $m^2 + \\beta^2 = 0 \\implies m = \\pm i\\beta$, giving solutions $\\cos(\\beta \\ln x)$ and $\\sin(\\beta \\ln x)$.",
        "对于 $x^2 y'' + x y' + \\beta^2 y = 0$，指标特征方程为 $m(m-1) + m + \\beta^2 = m^2 + \\beta^2 = 0 \\implies m = \\pm i\\beta$，对应解为 $\\cos(\\beta \\ln x)$ 和 $\\sin(\\beta \\ln x)$。",
      ),
      generate(rng: Rng): Problem {
        const beta = rng.int(2, 35);
        const betaSq = beta * beta;
        const ans = beta;

        const prompt = t(
          `Find the frequency parameter $\\beta > 0$ in the trigonometric arguments $\\cos(\\beta \\ln x)$ of the general solution to $x^2 y'' + x y' + ${betaSq}y = 0$ (for $x > 0$).`,
          `求柯西-欧拉微分方程 $x^2 y'' + x y' + ${betaSq}y = 0$（$x > 0$）的通解三角函数部分 $\\cos(\\beta \\ln x)$ 中的频率参数 $\\beta > 0$。`,
        );
        const solution = t(
          steps(
            `The indicial equation is $m(m-1) + 1\\cdot m + ${betaSq} = 0$.`,
            `Simplify: $m^2 - m + m + ${betaSq} = 0 \\implies m^2 + ${betaSq} = 0$.`,
            `Solve for $m$: $m = \\pm ${beta}i$.`,
            `The frequency parameter in the logarithmic argument is $\\beta = ${ans}$.`,
          ),
          steps(
            `写出指标特征方程：$m(m-1) + 1\\cdot m + ${betaSq} = 0$。`,
            `化简展开：$m^2 - m + m + ${betaSq} = 0 \\implies m^2 + ${betaSq} = 0$。`,
            `解得共轭纯虚根：$m = \\pm ${beta}i$。`,
            `因此对数自变量的频率系数为 $\\beta = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [betaSq, Math.round(betaSq / 2), ans + 1],
        });
      },
    },
  ],
};

/** cauchyEulerEquationsWithForcing transforms via x = e^t. */
export const cauchyEulerEquationsWithForcing: TopicDef = {
  id: "cauchy-euler-equations-with-forcing",
  title: t("Cauchy-Euler Equations With Forcing", "带外力激励的柯西-欧拉方程"),
  summary: t(
    "The substitution x = e^t transforms Cauchy-Euler equations into constant-coefficient ODEs in t, solving inhomogeneous equations with forcing.",
    "通过变量代换 x = e^t 可将非齐次柯西-欧拉方程转化为自变量为 t 的常系数非齐次线性常微分方程进行求解。",
  ),
  prerequisites: [
    "cauchy-euler-equations-characteristic-equations-with-distinct-real-roots",
    "second-order-inhomogeneous-odes-with-polynomial-forcing",
  ],
  encompasses: [
    {
      topic: "cauchy-euler-equations-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "transformation-to-constant-coefficients",
      title: t("Transformation to constant coefficients via logarithmic substitution", "对数代换化柯西-欧拉方程为常系数微分方程"),
      explanation: t(
        "Under $x = e^t$, $x \\frac{dy}{dx} = \\frac{dy}{dt}$ and $x^2 \\frac{d^2y}{dx^2} = \\frac{d^2y}{dt^2} - \\frac{dy}{dt}$. Thus $x^2 y'' + a x y' + b y = f(e^t)$ becomes $\\frac{d^2y}{dt^2} + (a - 1)\\frac{dy}{dt} + b y = f(e^t)$.",
        "在变量代换 $x = e^t$ 下，$x \\frac{dy}{dx} = \\frac{dy}{dt}$，且 $x^2 \\frac{d^2y}{dx^2} = \\frac{d^2y}{dt^2} - \\frac{dy}{dt}$。方程 $x^2 y'' + a x y' + b y = f(e^t)$ 转化为 $\\frac{d^2y}{dt^2} + (a - 1)\\frac{dy}{dt} + b y = f(e^t)$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 20);
        const b = rng.int(2, 15);
        const ans = a - 1;

        const prompt = t(
          `Under the substitution $x = e^t$, the Cauchy-Euler equation $x^2 y'' + ${a}x y' + ${b}y = x$ transforms into a constant-coefficient equation $\\frac{d^2y}{dt^2} + P \\frac{dy}{dt} + ${b}y = e^t$. Find the coefficient $P$.`,
          `通过变量代换 $x = e^t$，柯西-欧拉微分方程 $x^2 y'' + ${a}x y' + ${b}y = x$ 转化为关于 $t$ 的常系数微分方程 $\\frac{d^2y}{dt^2} + P \\frac{dy}{dt} + ${b}y = e^t$。求一次导数系数 $P$ 的值。`,
        );
        const solution = t(
          steps(
            `With $t = \\ln x$, the chain rule gives $x y' = \\frac{dy}{dt}$ and $x^2 y'' = \\frac{d^2y}{dt^2} - \\frac{dy}{dt}$.`,
            `Substitute these expressions: $\\left(\\frac{d^2y}{dt^2} - \\frac{dy}{dt}\\right) + ${a}\\frac{dy}{dt} + ${b}y = e^t$.`,
            `Combine the first-derivative terms: $\\frac{d^2y}{dt^2} + (${a} - 1)\\frac{dy}{dt} + ${b}y = e^t$.`,
            `Therefore, $P = ${a} - 1 = ${ans}$.`,
          ),
          steps(
            `令 $t = \\ln x$，由复合求导链式法则知 $x y' = \\frac{dy}{dt}$，且 $x^2 y'' = \\frac{d^2y}{dt^2} - \\frac{dy}{dt}$。`,
            `代入原方程：$\\left(\\frac{d^2y}{dt^2} - \\frac{dy}{dt}\\right) + ${a}\\frac{dy}{dt} + ${b}y = e^t$。`,
            `合并一阶导数项：$\\frac{d^2y}{dt^2} + (${a} - 1)\\frac{dy}{dt} + ${b}y = e^t$。`,
            `因此，系数 $P = ${a} - 1 = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a, a + 1, b],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3.11 Variation of Parameters
// ---------------------------------------------------------------------------

/** variationOfParametersForFirstOrderLinearOdes derives v(x). */
export const variationOfParametersForFirstOrderLinearOdes: TopicDef = {
  id: "variation-of-parameters-for-first-order-linear-odes",
  title: t("Variation of Parameters for First-Order Linear ODEs", "一阶线性常微分方程的常数变易法"),
  summary: t(
    "Setting y = u(x) y_h(x) in y' + P(x)y = f(x) yields u'(x) = f(x)/y_h(x), directly producing the particular solution.",
    "设 y = u(x) y_h(x) 代入一阶线性方程 y' + P(x)y = f(x) 可解得 u'(x) = f(x)/y_h(x)，直接导出非齐次方程的特解。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "variation-of-parameters-first-order",
      title: t("Variation of parameters derivative formula for first-order ODEs", "一阶微分方程常数变易法的导数公式"),
      explanation: t(
        "For $y' + a y = K e^{-a x}$, homogeneous solution is $y_h = e^{-a x}$. Setting $y = u(x) e^{-a x}$ gives $u'(x) = K$.",
        "对于 $y' + a y = K e^{-a x}$，对应齐次解为 $y_h = e^{-a x}$。设 $y = u(x) e^{-a x}$ 代入可得 $u'(x) = K$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 8);
        const K = rng.int(2, 35);
        const ans = K;

        const prompt = t(
          `Apply variation of parameters to $y' + ${poly([a, "y"])} = ${K}e^{-${poly([a, "x"])}}$ by setting $y(x) = u(x) e^{-${poly([a, "x"])}}$. Find the derivative $u'(x)$.`,
          `利用常数变易法求解 $y' + ${poly([a, "y"])} = ${K}e^{-${poly([a, "x"])}}$，设 $y(x) = u(x) e^{-${poly([a, "x"])}}$。求导函数 $u'(x)$ 的常数值。`,
        );
        const solution = t(
          steps(
            `Compute $y'(x) = u'(x)e^{-${poly([a, "x"])}} - ${a}u(x)e^{-${poly([a, "x"])}}$.`,
            `Substitute into $y' + ${poly([a, "y"])}$: $[u'e^{-${poly([a, "x"])}} - ${a}ue^{-${poly([a, "x"])}}] + ${a}[ue^{-${poly([a, "x"])}}] = ${K}e^{-${poly([a, "x"])}}$.`,
            `The terms in $u$ cancel: $u'(x)e^{-${poly([a, "x"])}} = ${K}e^{-${poly([a, "x"])}}$.`,
            `Multiply by $e^{${poly([a, "x"])}}$: $u'(x) = ${ans}$.`,
          ),
          steps(
            `求导：$y'(x) = u'(x)e^{-${poly([a, "x"])}} - ${a}u(x)e^{-${poly([a, "x"])}}$。`,
            `代入方程 $y' + ${poly([a, "y"])}$：$[u'e^{-${poly([a, "x"])}} - ${a}ue^{-${poly([a, "x"])}}] + ${a}[ue^{-${poly([a, "x"])}}] = ${K}e^{-${poly([a, "x"])}}$。`,
            `关于 $u$ 的项相互抵消：$u'(x)e^{-${poly([a, "x"])}} = ${K}e^{-${poly([a, "x"])}}$。`,
            `两端乘以 $e^{${poly([a, "x"])}}$：$u'(x) = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a * K, ans + a, Math.round(K / a)],
        });
      },
    },
  ],
};

/** variationOfParametersForSecondOrderOdes sets up u1' and u2' formulas. */
export const variationOfParametersForSecondOrderOdes: TopicDef = {
  id: "variation-of-parameters-for-second-order-odes",
  title: t("Variation of Parameters for Second-Order ODEs", "二阶常微分方程的常数变易法原理"),
  summary: t(
    "For y'' + P(x)y' + Q(x)y = g(x), setting y_p = u_1 y_1 + u_2 y_2 with auxiliary condition u_1' y_1 + u_2' y_2 = 0 yields u_1' = -y_2 g / W and u_2' = y_1 g / W.",
    "对于二阶非齐次方程，设特解 y_p = u_1 y_1 + u_2 y_2 并附加辅助条件 u_1' y_1 + u_2' y_2 = 0，可解得 u_1' = -y_2 g / W 与 u_2' = y_1 g / W。",
  ),
  prerequisites: ["variation-of-parameters-for-first-order-linear-odes", "linear-independence-of-solutions-to-homogeneous-odes"],
  encompasses: [
    {
      topic: "variation-of-parameters-for-first-order-linear-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "second-order-variation-of-parameters-system",
      title: t("Linear system for parameter derivatives", "待定变易参数导数的代数线性方程组"),
      explanation: t(
        "The variation of parameters system is $u_1' y_1 + u_2' y_2 = 0$ and $u_1' y_1' + u_2' y_2' = g(x)$. By Cramer's rule, $u_2' = \\frac{y_1 g}{W}$.",
        "常数变易法联立代数方程组为 $u_1' y_1 + u_2' y_2 = 0$ 与 $u_1' y_1' + u_2' y_2' = g(x)$。由克莱姆法则解得 $u_2' = \\frac{y_1 g}{W}$。",
      ),
      generate(rng: Rng): Problem {
        const factor = rng.int(2, 25);
        const W = rng.int(2, 8);
        const y1Val = factor * W;
        const ans = factor;

        const prompt = t(
          `In solving a second-order ODE $y'' + P(x)y' + Q(x)y = g(x)$ by variation of parameters, the homogeneous solutions have Wronskian $W(0) = ${W}$, with $y_1(0) = ${y1Val}$ and forcing $g(0) = 1$. Evaluate the parameter derivative $u_2'(0) = \\frac{y_1(0) g(0)}{W(0)}$.`,
          `用常数变易法求解二阶微分方程 $y'' + P(x)y' + Q(x)y = g(x)$。已知齐次解的朗斯基行列式在 $x = 0$ 处为 $W(0) = ${W}$，且 $y_1(0) = ${y1Val}$，激励函数 $g(0) = 1$。计算变易参数导数值 $u_2'(0) = \\frac{y_1(0) g(0)}{W(0)}$。`,
        );
        const solution = t(
          steps(
            `From Cramer's rule applied to the variation of parameters system, $u_2'(x) = \\frac{y_1(x) g(x)}{W(x)}$.`,
            `Substitute the given values at $x = 0$: $u_2'(0) = \\frac{${y1Val} \\times 1}{${W}}$.`,
            `Calculate the quotient: $u_2'(0) = \\frac{${y1Val}}{${W}} = ${ans}$.`,
          ),
          steps(
            `应用克莱姆法则求解常数变易导数方程组：$u_2'(x) = \\frac{y_1(x) g(x)}{W(x)}$。`,
            `代入 $x = 0$ 处的各已知值：$u_2'(0) = \\frac{${y1Val} \\times 1}{${W}}$。`,
            `计算得出结果：$u_2'(0) = \\frac{${y1Val}}{${W}} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans * W, ans + 1, W],
        });
      },
    },
  ],
};

/** solvingSecondOrderOdesUsingVariationOfParameters applies the full method to sec x. */
export const solvingSecondOrderOdesUsingVariationOfParameters: TopicDef = {
  id: "solving-second-order-odes-using-variation-of-parameters",
  title: t("Solving Second-Order ODEs Using Variation of Parameters", "应用常数变易法求解二阶常微分方程"),
  summary: t(
    "Variation of parameters solves y'' + y = tan x or sec x where undetermined coefficients fails, integrating u_1 = -∫ y_2 g / W dx and u_2 = ∫ y_1 g / W dx.",
    "常数变易法能够求解待定系数法失效的方程（如 y'' + y = tan x 或 sec x），通过积分计算 u_1 = -∫ y_2 g / W dx 与 u_2 = ∫ y_1 g / W dx 获得通解。",
  ),
  prerequisites: ["variation-of-parameters-for-second-order-odes"],
  encompasses: [{ topic: "variation-of-parameters-for-second-order-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "variation-of-parameters-secant-forcing",
      title: t("Particular solution with secant forcing", "正割函数右端项的常数变易法特解"),
      explanation: t(
        "For $y'' + y = \\sec x$, fundamental solutions are $y_1 = \\cos x, y_2 = \\sin x$ with $W = 1$. Then $u_2' = \\cos x \\sec x = 1 \\implies u_2(x) = x$.",
        "对于 $y'' + y = \\sec x$，基本齐次解为 $y_1 = \\cos x, y_2 = \\sin x$（$W = 1$）。由公式得 $u_2' = \\cos x \\sec x = 1 \\implies u_2(x) = x$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 30);
        const ans = k;

        const prompt = t(
          `When solving $y'' + y = ${k}\\sec x$ using variation of parameters with $y_1 = \\cos x$ and $y_2 = \\sin x$, the second parameter derivative is $u_2'(x) = C$. Find the constant $C$.`,
          `利用常数变易法求解 $y'' + y = ${k}\\sec x$（其中 $y_1 = \\cos x, y_2 = \\sin x$），求得第二个变易参数的导数为常数 $u_2'(x) = C$。求常数 $C$ 的值。`,
        );
        const solution = t(
          steps(
            `The Wronskian of $y_1 = \\cos x$ and $y_2 = \\sin x$ is $W = (\\cos x)(\\cos x) - (-\\sin x)(\\sin x) = 1$.`,
            `The formula for $u_2'(x)$ is $u_2'(x) = \\frac{y_1(x) g(x)}{W(x)} = \\frac{(\\cos x)(${k}\\sec x)}{1}$.`,
            `Since $\\cos x \\sec x = 1$, we obtain $u_2'(x) = ${k}(1) = ${ans}$.`,
          ),
          steps(
            `齐次解 $y_1 = \\cos x$ 与 $y_2 = \\sin x$ 的朗斯基行列式为 $W = (\\cos x)(\\cos x) - (-\\sin x)(\\sin x) = 1$。`,
            `应用参数导数公式：$u_2'(x) = \\frac{y_1(x) g(x)}{W(x)} = \\frac{(\\cos x)(${k}\\sec x)}{1}$。`,
            `根据恒等式 $\\cos x \\sec x = 1$，可得 $u_2'(x) = ${k}(1) = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [k * k, 1, 0],
        });
      },
    },
  ],
};

/** variationOfParametersWithHigherOrderOdes generalizes to order n. */
export const variationOfParametersWithHigherOrderOdes: TopicDef = {
  id: "variation-of-parameters-with-higher-order-odes",
  title: t("Variation of Parameters With Higher-Order ODEs", "高阶常微分方程的常数变易法"),
  summary: t(
    "For an n-th order linear ODE, variation of parameters yields u_k'(x) = [W_k(x) / W(x)] g(x), where W_k is obtained by replacing column k with (0, ..., 1)^T.",
    "对于 n 阶非齐次线性常微分方程，常数变易法通过克莱姆法则给出 u_k'(x) = [W_k(x) / W(x)] g(x)，其中 W_k 由朗斯基行列式第 k 列替换为 (0, ..., 1)^T 得到。",
  ),
  prerequisites: ["solving-second-order-odes-using-variation-of-parameters"],
  encompasses: [
    {
      topic: "solving-second-order-odes-using-variation-of-parameters",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "higher-order-variation-of-parameters",
      title: t("Cramer's rule for n-th order variation of parameters", "高阶常数变易法的克莱姆法则"),
      explanation: t(
        "In an $n$-th order ODE, the parameter derivatives satisfy Cramer's rule $u_k'(x) = \\frac{W_k(x) g(x)}{W(x)}$. For fundamental solutions $1, x, x^k$, the Wronskian at $x = 1$ is $W(1, x, x^k)(1) = k(k-1)$.",
        "在 $n$ 阶线性方程中，参数导数由克莱姆法则确定为 $u_k'(x) = \\frac{W_k(x) g(x)}{W(x)}$。对于基本解组 $1, x, x^k$，在 $x = 1$ 处的朗斯基行列式为 $W(1, x, x^k)(1) = k(k-1)$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 35);
        const ans = k * (k - 1);

        const prompt = t(
          `Calculate the value of the Wronskian determinant $W(1, x, x^{${k}})$ at $x = 1$, which arises when applying variation of parameters to a third-order differential equation.`,
          `计算对三阶微分方程应用常数变易法时在 $x = 1$ 处的朗斯基行列式 $W(1, x, x^{${k}})(1)$ 的值。`,
        );
        const solution = t(
          steps(
            `The Wronskian of $y_1 = 1, y_2 = x, y_3 = x^{${k}}$ is the determinant of the functions and their first two derivatives: $\\begin{pmatrix} 1 & x & x^{${k}} \\\\ 0 & 1 & ${k}x^{${k}-1} \\\\ 0 & 0 & ${k * (k - 1)}x^{${k}-2} \\end{pmatrix}$.`,
            `Evaluating at $x = 1$, the matrix is upper triangular: $\\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & ${k} \\\\ 0 & 0 & ${k * (k - 1)} \\end{pmatrix}$.`,
            `The determinant is the product of diagonal elements: $1 \\times 1 \\times ${k * (k - 1)} = ${ans}$.`,
          ),
          steps(
            `函数组 $y_1 = 1, y_2 = x, y_3 = x^{${k}}$ 的朗斯基行列式由函数及一、二阶导数构成：$\\begin{pmatrix} 1 & x & x^{${k}} \\\\ 0 & 1 & ${k}x^{${k}-1} \\\\ 0 & 0 & ${k * (k - 1)}x^{${k}-2} \\end{pmatrix}$。`,
            `在 $x = 1$ 处求值得到上三角矩阵：$\\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & ${k} \\\\ 0 & 0 & ${k * (k - 1)} \\end{pmatrix}$。`,
            `上三角行列式等于对角线元素之积：$1 \\times 1 \\times ${k * (k - 1)} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [k, k * k, ans + 2],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3.12 Modeling With Second-Order ODEs
// ---------------------------------------------------------------------------

/** simpleHarmonicOscillators models m y'' + k y = 0. */
export const simpleHarmonicOscillators: TopicDef = {
  id: "simple-harmonic-oscillators",
  title: t("Simple Harmonic Oscillators", "简谐振动模型"),
  summary: t(
    "A mass-spring system without damping satisfies m y'' + k y = 0, oscillating with natural angular frequency ω_0 = √(k/m).",
    "无阻尼弹簧振子系统满足 m y'' + k y = 0，以固有圆频率 ω_0 = √(k/m) 作简谐振动。",
  ),
  prerequisites: ["second-order-homogeneous-initial-value-problems"],
  encompasses: [
    {
      topic: "second-order-homogeneous-initial-value-problems",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "natural-frequency-of-harmonic-oscillator",
      title: t("Natural angular frequency of a harmonic oscillator", "简谐振子的固有角频率"),
      explanation: t(
        "The natural angular frequency of a mass $m$ attached to a spring with stiffness constant $k$ is $\\omega_0 = \\sqrt{\\frac{k}{m}}$.",
        "质量为 $m$、劲度系数为 $k$ 的弹簧振子的固有角频率为 $\\omega_0 = \\sqrt{\\frac{k}{m}}$。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(1, 8);
        const omega0 = rng.int(2, 15);
        const k = m * omega0 * omega0;
        const ans = omega0;

        const prompt = t(
          `A mass of $m = ${m}\\text{ kg}$ is attached to a spring with spring constant $k = ${k}\\text{ N/m}$. Find the natural angular frequency $\\omega_0$ in $\\text{rad/s}$.`,
          `一个质量为 $m = ${m}\\text{ 千克}$ 的物体连接在劲度系数为 $k = ${k}\\text{ 牛/米}$ 的弹簧上。求系统的固有角频率 $\\omega_0$（单位：$\\text{弧度/秒}$）。`,
        );
        const solution = t(
          steps(
            `The equation of motion is $m y'' + k y = 0 \\implies y'' + \\frac{k}{m}y = 0$.`,
            `The natural frequency squared is $\\omega_0^2 = \\frac{k}{m} = \\frac{${k}}{${m}} = ${omega0 * omega0}$.`,
            `Take the square root: $\\omega_0 = \\sqrt{${omega0 * omega0}} = ${ans}\\text{ rad/s}$.`,
          ),
          steps(
            `运动微分方程为 $m y'' + k y = 0 \\implies y'' + \\frac{k}{m}y = 0$。`,
            `固有角频率平方为 $\\omega_0^2 = \\frac{k}{m} = \\frac{${k}}{${m}} = ${omega0 * omega0}$。`,
            `开平方计算：$\\omega_0 = \\sqrt{${omega0 * omega0}} = ${ans}\\text{ 弧度/秒}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [omega0 * omega0, Math.round(k / m), ans * 2],
        });
      },
    },
  ],
};

/** dampedOscillators determines critical damping c_crit = 2 √(mk). */
export const dampedOscillators: TopicDef = {
  id: "damped-oscillators",
  title: t("Damped Oscillators", "阻尼振动模型"),
  summary: t(
    "In m y'' + c y' + k y = 0, the discriminant c^2 - 4mk classifies motion as overdamped (> 0), critically damped (= 0), or underdamped (< 0), with c_crit = 2 √(mk).",
    "在阻尼振动方程 m y'' + c y' + k y = 0 中，判别式 c^2 - 4mk 将运动分为过阻尼、临界阻尼与欠阻尼，临界阻尼系数为 c_crit = 2 √(mk)。",
  ),
  prerequisites: ["simple-harmonic-oscillators"],
  encompasses: [{ topic: "simple-harmonic-oscillators", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "critical-damping-coefficient",
      title: t("Critical damping coefficient", "临界阻尼系数计算"),
      explanation: t(
        "Critical damping occurs when the characteristic discriminant vanishes: $c_{\\text{crit}}^2 - 4mk = 0 \\implies c_{\\text{crit}} = 2\\sqrt{mk}$.",
        "当特征方程判别式为零时系统处于临界阻尼状态：$c_{\\text{crit}}^2 - 4mk = 0 \\implies c_{\\text{crit}} = 2\\sqrt{mk}$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(2, 35);
        const mass = 1;
        const springK = p * p;
        const ans = 2 * p;

        const prompt = t(
          `A mass-spring-damper system has mass $m = ${mass}\\text{ kg}$ and spring stiffness $k = ${springK}\\text{ N/m}$. Find the critical damping coefficient $c_{\\text{crit}}$ in $\\text{N}\\cdot\\text{s/m}$.`,
          `质量-弹簧-阻尼系统具有质量 $m = ${mass}\\text{ 千克}$ 和弹簧劲度系数 $k = ${springK}\\text{ 牛/米}$。求系统的临界阻尼系数 $c_{\\text{crit}}$（单位：$\\text{牛}\\cdot\\text{秒/米}$）。`,
        );
        const solution = t(
          steps(
            `The characteristic equation for $m y'' + c y' + k y = 0$ is $m r^2 + c r + k = 0$.`,
            `The discriminant is $\\Delta = c^2 - 4mk$. Critical damping occurs when $\\Delta = 0 \\implies c = 2\\sqrt{mk}$.`,
            `Substitute $m = ${mass}$ and $k = ${springK}$: $c_{\\text{crit}} = 2\\sqrt{${mass} \\times ${springK}} = 2\\sqrt{${springK}} = 2(${p}) = ${ans}\\text{ N}\\cdot\\text{s/m}$.`,
          ),
          steps(
            `阻尼振动方程 $m y'' + c y' + k y = 0$ 的特征方程为 $m r^2 + c r + k = 0$。`,
            `特征方程判别式为 $\\Delta = c^2 - 4mk$。发生临界阻尼时判别式为零：$c = 2\\sqrt{mk}$。`,
            `代入 $m = ${mass}$ 与 $k = ${springK}$：$c_{\\text{crit}} = 2\\sqrt{${mass} \\times ${springK}} = 2\\sqrt{${springK}} = 2(${p}) = ${ans}\\text{ 牛}\\cdot\\text{秒/米}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [p, 4 * p, springK],
        });
      },
    },
  ],
};

/** forcedOscillators analyzes steady-state sinusoidal response. */
export const forcedOscillators: TopicDef = {
  id: "forced-oscillators",
  title: t("Forced Oscillators", "受迫振动模型"),
  summary: t(
    "In m y'' + c y' + k y = F_0 cos(ω t), damping dissipates the transient homogeneous response, leaving the steady-state periodic response.",
    "在受迫振动方程 m y'' + c y' + k y = F_0 cos(ω t) 中，阻尼使得齐次瞬态解随时间衰减消失，最终仅保留周期稳态解。",
  ),
  prerequisites: ["damped-oscillators"],
  encompasses: [{ topic: "damped-oscillators", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "steady-state-forced-oscillation",
      title: t("Steady-state forced oscillation response", "受迫振动的稳态响应与衰减"),
      explanation: t(
        "For an underdamped oscillator with $c > 0$, the roots of $m r^2 + c r + k = 0$ have negative real part $-\\frac{c}{2m}$, so the homogeneous transient solution decays exponentially to zero as $t \\to \\infty$.",
        "对于阻尼系数 $c > 0$ 的欠阻尼系统，特征根具有负实部 $-\\frac{c}{2m}$，因此当 $t \\to \\infty$ 时齐次瞬态解按指数规律衰减趋于零。",
      ),
      generate(rng: Rng): Problem {
        const decayRate = rng.int(1, 30);
        const c = 2 * decayRate;
        const ans = decayRate;

        const prompt = t(
          `In a damped forced oscillator $y'' + ${c}y' + 25y = 10\\cos(3t)$, the transient homogeneous solution decays proportional to $e^{-\\gamma t}$. Find the decay coefficient $\\gamma$.`,
          `在阻尼受迫振子系统 $y'' + ${c}y' + 25y = 10\\cos(3t)$ 中，齐次瞬态响应解按 $e^{-\\gamma t}$ 规律衰减。求衰减系数 $\\gamma$ 的值。`,
        );
        const solution = t(
          steps(
            `The characteristic equation of the homogeneous system is $r^2 + ${c}r + 25 = 0$.`,
            `The roots are $r = -\\frac{${c}}{2} \\pm \\sqrt{\\left(\\frac{${c}}{2}\\right)^2 - 25} = -${decayRate} \\pm i\\beta$.`,
            `The homogeneous solution has exponential factor $e^{-${decayRate}t}$.`,
            `Therefore, the decay coefficient is $\\gamma = ${ans}$.`,
          ),
          steps(
            `齐次部分的特征方程为 $r^2 + ${c}r + 25 = 0$。`,
            `求根公式：$r = -\\frac{${c}}{2} \\pm \\sqrt{\\left(\\frac{${c}}{2}\\right)^2 - 25} = -${decayRate} \\pm i\\beta$。`,
            `齐次解包含指数包络因子 $e^{-${decayRate}t}$。`,
            `因此，衰减系数为 $\\gamma = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [c, c * 2, 25],
        });
      },
    },
  ],
};

/** resonanceInVibratingSystems models pure resonance. */
export const resonanceInVibratingSystems: TopicDef = {
  id: "resonance-in-vibrating-systems",
  title: t("Resonance in Vibrating Systems", "振动系统中的共振现象"),
  summary: t(
    "When an undamped system is driven at its natural frequency (ω = ω_0), pure resonance occurs with particular solution y_p(t) = [F_0 / (2 m ω_0)] t sin(ω_0 t), with linearly growing amplitude.",
    "当无阻尼系统在外力频率等于固有频率（ω = ω_0）下激励时发生纯共振，特解振幅随时间线性无限发散：y_p(t) = [F_0 / (2 m ω_0)] t sin(ω_0 t)。",
  ),
  prerequisites: ["forced-oscillators"],
  encompasses: [{ topic: "forced-oscillators", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "pure-resonance-amplitude-growth",
      title: t("Linear amplitude growth rate in pure resonance", "纯共振下的线性振幅增长速率"),
      explanation: t(
        "For $y'' + \\omega_0^2 y = F_0 \\cos(\\omega_0 t)$, the particular solution is $y_p(t) = \\frac{F_0}{2\\omega_0} t \\sin(\\omega_0 t)$, where the amplitude envelope grows at rate $\\frac{F_0}{2\\omega_0}$.",
        "对于纯共振方程 $y'' + \\omega_0^2 y = F_0 \\cos(\\omega_0 t)$，特解为 $y_p(t) = \\frac{F_0}{2\\omega_0} t \\sin(\\omega_0 t)$，振幅包络按速率 $\\frac{F_0}{2\\omega_0}$ 随时间线性发散。",
      ),
      generate(rng: Rng): Problem {
        const omega0 = rng.int(2, 8);
        const rate = rng.int(2, 10);
        const F0 = rate * 2 * omega0;
        const ans = rate;

        const prompt = t(
          `An undamped vibrating system satisfies $y'' + ${omega0 * omega0}y = ${F0}\\cos(${omega0}t)$. The resonating particular solution has the form $y_p(t) = K t \\sin(${omega0}t)$. Find the constant $K$.`,
          `一个无阻尼振动系统满足 $y'' + ${omega0 * omega0}y = ${F0}\\cos(${omega0}t)$。共振特解具有形式 $y_p(t) = K t \\sin(${omega0}t)$。求常数 $K$ 的值。`,
        );
        const solution = t(
          steps(
            `Since the driving frequency matches the natural frequency $\\omega_0 = ${omega0}$, resonance occurs.`,
            `The particular solution has the form $y_p(t) = K t \\sin(${omega0}t)$.`,
            `Differentiate and substitute into $y'' + ${omega0 * omega0}y$: $2(${omega0}) K \\cos(${omega0}t) = ${F0}\\cos(${omega0}t)$.`,
            `Solve for $K$: $K = \\frac{${F0}}{2(${omega0})} = \\frac{${F0}}{${2 * omega0}} = ${ans}$.`,
          ),
          steps(
            `由于激励频率与固有频率 $\\omega_0 = ${omega0}$ 一致，系统发生共振。`,
            `共振特解形式为 $y_p(t) = K t \\sin(${omega0}t)$。`,
            `求导并代入微分方程化简得：$2(${omega0}) K \\cos(${omega0}t) = ${F0}\\cos(${omega0}t)$。`,
            `解出系数 $K$：$K = \\frac{${F0}}{2(${omega0})} = \\frac{${F0}}{${2 * omega0}} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [F0, ans * 2, omega0],
        });
      },
    },
  ],
};

/** modelingCapacitorChargeInRclCircuitsWithSecondOrderOdes models L q'' + R q' + q/C = E(t). */
export const modelingCapacitorChargeInRclCircuitsWithSecondOrderOdes: TopicDef = {
  id: "modeling-capacitor-charge-in-rcl-circuits-with-second-order-odes",
  title: t("Modeling Capacitor Charge in RCL Circuits With Second-Order ODEs", "二阶常微分方程建模 RCL 电路中的电容器电荷"),
  summary: t(
    "Kirchhoff's law for a series RCL circuit governs capacitor charge: L q'' + R q' + (1/C) q = E(t), with resonant frequency ω_0 = 1/√(LC).",
    "串联 RCL 回路的基尔霍夫电压定律给出电容器电荷方程：L q'' + R q' + (1/C) q = E(t)，其固有共振频率为 ω_0 = 1/√(LC)。",
  ),
  prerequisites: ["simple-harmonic-oscillators"],
  encompasses: [{ topic: "simple-harmonic-oscillators", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "rcl-natural-frequency",
      title: t("Resonant natural frequency of an LC circuit", "LC 谐振回路的固有振荡频率"),
      explanation: t(
        "In an ideal LC circuit ($R = 0$), charge satisfies $L q'' + \\frac{1}{C} q = 0$, oscillating at natural frequency $\\omega_0 = \\frac{1}{\\sqrt{LC}}$.",
        "在理想无阻尼 LC 电路（$R = 0$）中，电荷满足 $L q'' + \\frac{1}{C} q = 0$，固有自由振荡角频率为 $\\omega_0 = \\frac{1}{\\sqrt{LC}}$。",
      ),
      generate(rng: Rng): Problem {
        const omega0 = rng.int(2, 40);
        const omega0Sq = omega0 * omega0;
        const ans = omega0;

        const prompt = t(
          `An LC circuit contains an inductor and capacitor with parameter ratio $\\frac{1}{LC} = ${omega0Sq}\\text{ s}^{-2}$. Find the undamped natural frequency $\\omega_0$ in $\\text{rad/s}$.`,
          `一个 LC 回路中电感与电容参数满足 $\\frac{1}{LC} = ${omega0Sq}\\text{ 秒}^{-2}$。求其无阻尼固有角频率 $\\omega_0$（单位：$\\text{弧度/秒}$）。`,
        );
        const solution = t(
          steps(
            `The differential equation for the charge is $L q'' + \\frac{1}{C}q = 0 \\implies q'' + \\frac{1}{LC}q = 0$.`,
            `The natural frequency satisfies $\\omega_0^2 = \\frac{1}{LC} = ${omega0Sq}$.`,
            `Take the square root: $\\omega_0 = \\sqrt{${omega0Sq}} = ${ans}\\text{ rad/s}$.`,
          ),
          steps(
            `电荷量的微分方程为 $L q'' + \\frac{1}{C}q = 0 \\implies q'' + \\frac{1}{LC}q = 0$。`,
            `固有振荡角频率满足 $\\omega_0^2 = \\frac{1}{LC} = ${omega0Sq}$。`,
            `开平方求得：$\\omega_0 = \\sqrt{${omega0Sq}} = ${ans}\\text{ 弧度/秒}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [omega0Sq, ans * 2, Math.round(omega0 / 2)],
        });
      },
    },
  ],
};

/** modelingCurrentInRclCircuitsWithSecondOrderOdes models L i'' + R i' + (1/C) i = E'(t). */
export const modelingCurrentInRclCircuitsWithSecondOrderOdes: TopicDef = {
  id: "modeling-current-in-rcl-circuits-with-second-order-odes",
  title: t("Modeling Current in RCL Circuits With Second-Order ODEs", "二阶常微分方程建模 RCL 电路中的电流"),
  summary: t(
    "Differentiating the charge equation with i = dq/dt yields the current equation: L i'' + R i' + (1/C) i = E'(t).",
    "利用电流定义 i = dq/dt 对电荷方程逐项求导，得到回路电流满足的二阶微分方程：L i'' + R i' + (1/C) i = E'(t)。",
  ),
  prerequisites: ["modeling-capacitor-charge-in-rcl-circuits-with-second-order-odes"],
  encompasses: [
    {
      topic: "modeling-capacitor-charge-in-rcl-circuits-with-second-order-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "rcl-current-differential-equation",
      title: t("Forcing term in the current differential equation", "电流微分方程中的激励导数项"),
      explanation: t(
        "Differentiating $L q'' + R q' + \\frac{1}{C} q = E(t)$ with $i = q'$ yields $L i'' + R i' + \\frac{1}{C} i = E'(t)$. For $E(t) = E_0 \\sin(\\omega t)$, the forcing term is $E'(t) = \\omega E_0 \\cos(\\omega t)$.",
        "对回路方程 $L q'' + R q' + \\frac{1}{C} q = E(t)$ 求导，得 $L i'' + R i' + \\frac{1}{C} i = E'(t)$。当电源为正弦交流电 $E(t) = E_0 \\sin(\\omega t)$ 时，电流方程的激励项为 $E'(t) = \\omega E_0 \\cos(\\omega t)$。",
      ),
      generate(rng: Rng): Problem {
        const E0 = rng.int(5, 50);
        const omega = rng.int(2, 10);
        const ans = omega * E0;

        const prompt = t(
          `In an RCL circuit driven by an alternating voltage $E(t) = ${E0}\\sin(${omega}t)\\text{ V}$, the current $i(t)$ satisfies $L i'' + R i' + \\frac{1}{C}i = E'(t)$. Find the amplitude of the forcing term $E'(t)$ in $\\text{V/s}$.`,
          `在由交流电源 $E(t) = ${E0}\\sin(${omega}t)\\text{ 伏}$ 驱动的 RCL 电路中，电流 $i(t)$ 满足方程 $L i'' + R i' + \\frac{1}{C}i = E'(t)$。求激励源导数项 $E'(t)$ 的幅值大小（单位：$\\text{伏/秒}$）。`,
        );
        const solution = t(
          steps(
            `Differentiate $E(t) = ${E0}\\sin(${omega}t)$ with respect to $t$: $E'(t) = ${E0} \\times ${omega} \\cos(${omega}t) = ${ans}\\cos(${omega}t)$.`,
            `The amplitude of $E'(t)$ is $\\omega E_0 = ${ans}\\text{ V/s}$.`,
          ),
          steps(
            `对电源电压 $E(t) = ${E0}\\sin(${omega}t)$ 关于时间 $t$ 求导：$E'(t) = ${E0} \\times ${omega} \\cos(${omega}t) = ${ans}\\cos(${omega}t)$。`,
            `激励项的幅值为 $\\omega E_0 = ${ans}\\text{ 伏/秒}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [E0, omega, ans * 2],
        });
      },
    },
  ],
};

/** differentialEquationsLinearTopics gathers all 29 Unit 3 topics. */
export const differentialEquationsLinearTopics: TopicDef[] = [
  differentialOperators,
  linearDifferentialOperators,
  introductionToSecondOrderLinearOdes,
  theSuperpositionPrinciple,
  reductionOfOrder,
  linearIndependenceOfSolutionsToHomogeneousOdes,
  generalSolutionsOfLinearOdes,
  abelsIdentity,
  secondOrderHomogeneousOdesCharacteristicEquationsWithDistinctRealRoots,
  secondOrderHomogeneousOdesCharacteristicEquationsWithRepeatedRoots,
  secondOrderHomogeneousOdesCharacteristicEquationsWithComplexRoots,
  secondOrderHomogeneousInitialValueProblems,
  secondOrderInhomogeneousOdesWithPolynomialForcing,
  secondOrderInhomogeneousOdesWithExponentialForcing,
  secondOrderInhomogeneousOdesWithSinusoidalForcing,
  cauchyEulerEquationsCharacteristicEquationsWithDistinctRealRoots,
  cauchyEulerEquationsCharacteristicEquationsWithRepeatedRoots,
  cauchyEulerEquationsCharacteristicEquationsWithComplexRoots,
  cauchyEulerEquationsWithForcing,
  variationOfParametersForFirstOrderLinearOdes,
  variationOfParametersForSecondOrderOdes,
  solvingSecondOrderOdesUsingVariationOfParameters,
  variationOfParametersWithHigherOrderOdes,
  simpleHarmonicOscillators,
  dampedOscillators,
  forcedOscillators,
  resonanceInVibratingSystems,
  modelingCapacitorChargeInRclCircuitsWithSecondOrderOdes,
  modelingCurrentInRclCircuitsWithSecondOrderOdes,
];
