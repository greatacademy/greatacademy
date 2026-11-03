import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly } from "@ga/subject-math";
import { numberProblem, steps } from "../problems.ts";

// ---------------------------------------------------------------------------
// 4.13 Systems of ODEs
// ---------------------------------------------------------------------------

/** introductionToSystemsOfLinearOdes introduces the matrix form x' = A x. */
export const introductionToSystemsOfLinearOdes: TopicDef = {
  id: "introduction-to-systems-of-linear-odes",
  title: t("Introduction to Systems of Linear ODEs", "线性微分方程组简介"),
  summary: t(
    "A first-order linear system x_1' = a x_1 + b x_2, x_2' = c x_1 + d x_2 is written in matrix form as x' = A x, characterized by trace and determinant.",
    "一阶线性常微分方程组 x_1' = a x_1 + b x_2, x_2' = c x_1 + d x_2 表示为矩阵形式 x' = A x，由矩阵的迹与行列式所刻画。",
  ),
  prerequisites: ["general-solutions-of-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "matrix-form-of-first-order-linear-systems",
      title: t("Trace of the coefficient matrix in a linear system", "线性系统系数矩阵的迹"),
      explanation: t(
        "For a $2 \\times 2$ system $\\mathbf{x}' = A \\mathbf{x}$ where $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, the trace is $\\operatorname{tr}(A) = a + d$.",
        "对于二阶线性常微分方程组 $\\mathbf{x}' = A \\mathbf{x}$（系数矩阵 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$），其主对角线元素之和称为迹：$\\operatorname{tr}(A) = a + d$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 15);
        const d = rng.int(1, 15);
        const b = rng.int(1, 8);
        const c = rng.int(1, 8);
        const ans = a + d;

        const prompt = t(
          `Consider the linear system of differential equations $x_1' = ${a}x_1 + ${b}x_2$ and $x_2' = ${c}x_1 + ${d}x_2$. Find the trace $\\operatorname{tr}(A)$ of the coefficient matrix $A$.`,
          `考虑线性微分方程组 $x_1' = ${a}x_1 + ${b}x_2$ 与 $x_2' = ${c}x_1 + ${d}x_2$。求其系数矩阵 $A$ 的迹 $\\operatorname{tr}(A)$。`,
        );
        const solution = t(
          steps(
            `Write the system in matrix form $\\mathbf{x}' = A\\mathbf{x}$: $\\begin{pmatrix} x_1' \\\\ x_2' \\end{pmatrix} = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix} \\begin{pmatrix} x_1 \\\\ x_2 \\end{pmatrix}$.`,
            `The trace of a matrix is the sum of its diagonal entries: $\\operatorname{tr}(A) = A_{11} + A_{22}$.`,
            `Calculate: $\\operatorname{tr}(A) = ${a} + ${d} = ${ans}$.`,
          ),
          steps(
            `将方程组写为矩阵形式 $\\mathbf{x}' = A\\mathbf{x}$：$\\begin{pmatrix} x_1' \\\\ x_2' \\end{pmatrix} = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix} \\begin{pmatrix} x_1 \\\\ x_2 \\end{pmatrix}$。`,
            `矩阵的迹等于主对角线元素之和：$\\operatorname{tr}(A) = A_{11} + A_{22}$。`,
            `计算得出：$\\operatorname{tr}(A) = ${a} + ${d} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a * d - b * c, a * d, ans + 1],
        });
      },
    },
  ],
};

/** expressingHomogeneousOdesAsFirstOrderSystems constructs the companion matrix. */
export const expressingHomogeneousOdesAsFirstOrderSystems: TopicDef = {
  id: "expressing-homogeneous-odes-as-first-order-systems",
  title: t("Expressing Homogeneous ODEs as First-Order Systems", "将高阶齐次常微分方程转化为一阶微分方程组"),
  summary: t(
    "By defining state variables x_1 = y, x_2 = y', the second-order ODE y'' + py' + qy = 0 transforms into the first-order system x' = A x with companion matrix.",
    "通过定义状态变量 x_1 = y, x_2 = y'，二阶常微分方程 y'' + py' + qy = 0 可转化为具有友矩阵形式的一阶系统 x' = A x。",
  ),
  prerequisites: ["introduction-to-systems-of-linear-odes"],
  encompasses: [{ topic: "introduction-to-systems-of-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "companion-matrix-of-scalar-homogeneous-odes",
      title: t("Companion matrix representation of a second-order ODE", "二阶常微分方程的友矩阵表示"),
      explanation: t(
        "Setting $x_1 = y, x_2 = y'$ for $y'' + p y' + q y = 0$ yields $x_1' = x_2$ and $x_2' = -q x_1 - p x_2$. The determinant of the companion matrix is $\\det(A) = q$.",
        "对于方程 $y'' + p y' + q y = 0$，设 $x_1 = y, x_2 = y'$，得 $x_1' = x_2$ 且 $x_2' = -q x_1 - p x_2$。友矩阵 $\\begin{pmatrix} 0 & 1 \\\\ -q & -p \\end{pmatrix}$ 的行列式为 $\\det(A) = q$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(1, 10);
        const q = rng.int(2, 35);
        const ans = q;

        const prompt = t(
          `Convert the second-order linear ODE $y'' + ${poly([p, "y'"])} + ${poly([q, "y"])} = 0$ into a first-order system $\\mathbf{x}' = A \\mathbf{x}$ using $x_1 = y$ and $x_2 = y'$. Find the determinant $\\det(A)$ of the resulting companion matrix $A$.`,
          `通过令 $x_1 = y$ 与 $x_2 = y'$，将二阶线性微分方程 $y'' + ${poly([p, "y'"])} + ${poly([q, "y"])} = 0$ 转化为一阶微分方程组 $\\mathbf{x}' = A \\mathbf{x}$。求友矩阵 $A$ 的行列式 $\\det(A)$。`,
        );
        const solution = t(
          steps(
            `Define $x_1 = y$ and $x_2 = y'$. Then $x_1' = x_2$.`,
            `From the ODE, $y'' = -${poly([q, "y"])} - ${poly([p, "y'"])} \\implies x_2' = -${poly([q, "x"])}_1 - ${poly([p, "x"])}_2$.`,
            `The companion matrix is $A = \\begin{pmatrix} 0 & 1 \\\\ -${q} & -${p} \\end{pmatrix}$.`,
            `Compute the determinant: $\\det(A) = (0)(-${p}) - (1)(-${q}) = ${ans}$.`,
          ),
          steps(
            `设状态变量 $x_1 = y$，$x_2 = y'$。则第一状态方程为 $x_1' = x_2$。`,
            `由原微分方程移项得 $y'' = -${poly([q, "y"])} - ${poly([p, "y'"])} \\implies x_2' = -${poly([q, "x"])}_1 - ${poly([p, "x"])}_2$。`,
            `对应的友矩阵为 $A = \\begin{pmatrix} 0 & 1 \\\\ -${q} & -${p} \\end{pmatrix}$。`,
            `计算行列式：$\\det(A) = (0)(-${p}) - (1)(-${q}) = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [-q, p, -p],
        });
      },
    },
  ],
};

/** expressingInhomogeneousOdesAsFirstOrderSystems adds the forcing vector g(t). */
export const expressingInhomogeneousOdesAsFirstOrderSystems: TopicDef = {
  id: "expressing-inhomogeneous-odes-as-first-order-systems",
  title: t("Expressing Inhomogeneous ODEs as First-Order Systems", "将高阶非齐次常微分方程转化为一阶微分方程组"),
  summary: t(
    "An inhomogeneous ODE y'' + py' + qy = f(t) converts into x' = A x + g(t), where g(t) = (0, f(t))^T incorporates the external forcing.",
    "非齐次微分方程 y'' + py' + qy = f(t) 转化为一阶系统 x' = A x + g(t)，其中外部激励项集中在向量 g(t) = (0, f(t))^T 的第二分量中。",
  ),
  prerequisites: ["expressing-homogeneous-odes-as-first-order-systems"],
  encompasses: [
    {
      topic: "expressing-homogeneous-odes-as-first-order-systems",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "forcing-vector-in-first-order-companion-systems",
      title: t("Forcing vector in first-order companion systems", "一阶伴随系统中的外力激励向量"),
      explanation: t(
        "For $y'' + p y' + q y = K t^2$, state variables $x_1 = y, x_2 = y'$ yield $\\mathbf{x}' = A \\mathbf{x} + \\begin{pmatrix} 0 \\\\ K t^2 \\end{pmatrix}$. At $t = 2$, the second component is $4K$.",
        "对于 $y'' + p y' + q y = K t^2$，转化为状态空间形式后外力激励向量为 $\\mathbf{g}(t) = \\begin{pmatrix} 0 \\\\ K t^2 \\end{pmatrix}$。在 $t = 2$ 处第二分量为 $4K$。",
      ),
      generate(rng: Rng): Problem {
        const K = rng.int(2, 40);
        const ans = 4 * K;

        const prompt = t(
          `When the inhomogeneous differential equation $y'' + 3y' + 2y = ${K}t^2$ is expressed as a first-order system $\\mathbf{x}' = A \\mathbf{x} + \\mathbf{g}(t)$ with $\\mathbf{x} = \\begin{pmatrix} y \\\\ y' \\end{pmatrix}$, evaluate the second component $g_2(2)$ at $t = 2$.`,
          `将非齐次常微分方程 $y'' + 3y' + 2y = ${K}t^2$ 化为一阶微分方程组 $\\mathbf{x}' = A \\mathbf{x} + \\mathbf{g}(t)$（其中状态向量 $\\mathbf{x} = \\begin{pmatrix} y \\\\ y' \\end{pmatrix}$）。求激励向量第二分量在 $t = 2$ 处的值 $g_2(2)$。`,
        );
        const solution = t(
          steps(
            `With $x_1 = y$ and $x_2 = y'$, we have $x_1' = x_2$ and $x_2' = -2x_1 - 3x_2 + ${K}t^2$.`,
            `The forcing vector is $\\mathbf{g}(t) = \\begin{pmatrix} 0 \\\\ ${K}t^2 \\end{pmatrix}$.`,
            `Evaluate at $t = 2$: $g_2(2) = ${K}(2)^2 = ${K} \\times 4 = ${ans}$.`,
          ),
          steps(
            `设状态变量 $x_1 = y$，$x_2 = y'$，得到方程 $x_1' = x_2$ 与 $x_2' = -2x_1 - 3x_2 + ${K}t^2$。`,
            `对应的外部激励向量为 $\\mathbf{g}(t) = \\begin{pmatrix} 0 \\\\ ${K}t^2 \\end{pmatrix}$。`,
            `在 $t = 2$ 处求值：$g_2(2) = ${K}(2)^2 = ${K} \\times 4 = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [K, 2 * K, ans + 2],
        });
      },
    },
  ],
};

/** linearIndependenceForHomogeneousSystemsOfOdes tests Wronskian of vector solutions. */
export const linearIndependenceForHomogeneousSystemsOfOdes: TopicDef = {
  id: "linear-independence-for-homogeneous-systems-of-odes",
  title: t("Linear Independence for Homogeneous Systems of ODEs", "齐次线性微分方程组解向量的线性相关性与无关性"),
  summary: t(
    "Vector solutions x_1(t), x_2(t) are linearly independent if and only if their matrix determinant W(t) = det(x_1(t), x_2(t)) is non-zero.",
    "向量解 x_1(t), x_2(t) 线性无关当且仅当其构成的矩阵行列式（朗斯基行列式）W(t) = det(x_1(t), x_2(t)) 处处不为零。",
  ),
  prerequisites: ["expressing-homogeneous-odes-as-first-order-systems"],
  encompasses: [
    {
      topic: "expressing-homogeneous-odes-as-first-order-systems",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "wronskian-of-vector-solutions",
      title: t("Wronskian determinant of vector solutions", "向量解组的朗斯基行列式"),
      explanation: t(
        "For $\\mathbf{x}_1(t) = \\begin{pmatrix} 1 \\\\ a \\end{pmatrix}e^{\\lambda_1 t}$ and $\\mathbf{x}_2(t) = \\begin{pmatrix} 1 \\\\ b \\end{pmatrix}e^{\\lambda_2 t}$, the Wronskian at $t = 0$ is $\\det \\begin{pmatrix} 1 & 1 \\\\ a & b \\end{pmatrix} = b - a$.",
        "对于向量解 $\\mathbf{x}_1(t) = \\begin{pmatrix} 1 \\\\ a \\end{pmatrix}e^{\\lambda_1 t}$ 与 $\\mathbf{x}_2(t) = \\begin{pmatrix} 1 \\\\ b \\end{pmatrix}e^{\\lambda_2 t}$，在 $t = 0$ 处的朗斯基行列式为 $\\det \\begin{pmatrix} 1 & 1 \\\\ a & b \\end{pmatrix} = b - a$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 10);
        const diff = rng.int(2, 25);
        const b = a + diff;
        const ans = diff;

        const prompt = t(
          `Calculate the initial Wronskian $W(0) = \\det(\\mathbf{x}_1(0), \\mathbf{x}_2(0))$ for the two vector solutions $\\mathbf{x}_1(t) = \\begin{pmatrix} 1 \\\\ ${a} \\end{pmatrix}e^{2t}$ and $\\mathbf{x}_2(t) = \\begin{pmatrix} 1 \\\\ ${b} \\end{pmatrix}e^{-3t}$.`,
          `计算两个向量解 $\\mathbf{x}_1(t) = \\begin{pmatrix} 1 \\\\ ${a} \\end{pmatrix}e^{2t}$ 与 $\\mathbf{x}_2(t) = \\begin{pmatrix} 1 \\\\ ${b} \\end{pmatrix}e^{-3t}$ 在 $t = 0$ 处的初始朗斯基行列式 $W(0) = \\det(\\mathbf{x}_1(0), \\mathbf{x}_2(0))$。`,
        );
        const solution = t(
          steps(
            `At $t = 0$, the vector solutions are $\\mathbf{x}_1(0) = \\begin{pmatrix} 1 \\\\ ${a} \\end{pmatrix}$ and $\\mathbf{x}_2(0) = \\begin{pmatrix} 1 \\\\ ${b} \\end{pmatrix}$.`,
            `Form the fundamental matrix at $t = 0$: $X(0) = \\begin{pmatrix} 1 & 1 \\\\ ${a} & ${b} \\end{pmatrix}$.`,
            `Calculate the determinant: $W(0) = (1)(${b}) - (1)(${a}) = ${b} - ${a} = ${ans}$.`,
          ),
          steps(
            `在 $t = 0$ 时，两向量解分别为 $\\mathbf{x}_1(0) = \\begin{pmatrix} 1 \\\\ ${a} \\end{pmatrix}$ 与 $\\mathbf{x}_2(0) = \\begin{pmatrix} 1 \\\\ ${b} \\end{pmatrix}$。`,
            `构成 $t = 0$ 处的基本矩阵：$X(0) = \\begin{pmatrix} 1 & 1 \\\\ ${a} & ${b} \\end{pmatrix}$。`,
            `计算行列式：$W(0) = (1)(${b}) - (1)(${a}) = ${b} - ${a} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a + b, a * b, -ans],
        });
      },
    },
  ],
};

/** generalSolutionsOfFirstOrderLinearSystemsOfOdes superposes fundamental solutions. */
export const generalSolutionsOfFirstOrderLinearSystemsOfOdes: TopicDef = {
  id: "general-solutions-of-first-order-linear-systems-of-odes",
  title: t("General Solutions of First-Order Linear Systems of ODEs", "一阶线性微分方程组的通解结构"),
  summary: t(
    "The general solution of a homogeneous system x' = A x is x(t) = c_1 x_1(t) + c_2 x_2(t), uniquely satisfying initial conditions x(0) = x_0.",
    "齐次线性微分方程组 x' = A x 的通解为基本解组的线性组合 x(t) = c_1 x_1(t) + c_2 x_2(t)，由初值条件 x(0) = x_0 唯一确定常数系数。",
  ),
  prerequisites: ["linear-independence-for-homogeneous-systems-of-odes"],
  encompasses: [
    {
      topic: "linear-independence-for-homogeneous-systems-of-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "fundamental-set-and-superposition-of-vector-solutions",
      title: t("Superposition and initial condition coefficients", "基本解组线性组合与初值系数确定"),
      explanation: t(
        "If $\\mathbf{x}_1(0) = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ and $\\mathbf{x}_2(0) = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$, then $\\mathbf{x}(0) = \\begin{pmatrix} c_1 \\\\ c_2 \\end{pmatrix}$. For initial vector $\\begin{pmatrix} u_0 \\\\ v_0 \\end{pmatrix}$, the coefficients are $c_1 = u_0$ and $c_2 = v_0$.",
        "若规范化基本解在初值处满足 $\\mathbf{x}_1(0) = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ 且 $\\mathbf{x}_2(0) = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$，则任意初值 $\\begin{pmatrix} u_0 \\\\ v_0 \\end{pmatrix}$ 的组合系数直接为 $c_1 = u_0$ 与 $c_2 = v_0$。",
      ),
      generate(rng: Rng): Problem {
        const u0 = rng.int(2, 20);
        const v0 = rng.int(2, 20);
        const ans = u0 + v0;

        const prompt = t(
          `Suppose a fundamental set of solutions satisfies $\\mathbf{x}_1(0) = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ and $\\mathbf{x}_2(0) = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$. The general solution $\\mathbf{x}(t) = c_1 \\mathbf{x}_1(t) + c_2 \\mathbf{x}_2(t)$ satisfies the initial condition $\\mathbf{x}(0) = \\begin{pmatrix} ${u0} \\\\ ${v0} \\end{pmatrix}$. Find the sum of coefficients $c_1 + c_2$.`,
          `设某齐次系统的基本解组满足规范化初值 $\\mathbf{x}_1(0) = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ 与 $\\mathbf{x}_2(0) = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$。通解 $\\mathbf{x}(t) = c_1 \\mathbf{x}_1(t) + c_2 \\mathbf{x}_2(t)$ 满足初始条件 $\\mathbf{x}(0) = \\begin{pmatrix} ${u0} \\\\ ${v0} \\end{pmatrix}$。求系数之和 $c_1 + c_2$。`,
        );
        const solution = t(
          steps(
            `Evaluate at $t = 0$: $\\mathbf{x}(0) = c_1 \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} + c_2 \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} c_1 \\\\ c_2 \\end{pmatrix}$.`,
            `Equate to the given initial vector: $\\begin{pmatrix} c_1 \\\\ c_2 \\end{pmatrix} = \\begin{pmatrix} ${u0} \\\\ ${v0} \\end{pmatrix} \\implies c_1 = ${u0},\\ c_2 = ${v0}$.`,
            `Sum the coefficients: $c_1 + c_2 = ${u0} + ${v0} = ${ans}$.`,
          ),
          steps(
            `代入 $t = 0$ 处的值：$\\mathbf{x}(0) = c_1 \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} + c_2 \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} c_1 \\\\ c_2 \\end{pmatrix}$。`,
            `与已知初始向量对比：$\\begin{pmatrix} c_1 \\\\ c_2 \\end{pmatrix} = \\begin{pmatrix} ${u0} \\\\ ${v0} \\end{pmatrix} \\implies c_1 = ${u0},\\ c_2 = ${v0}$。`,
            `求系数之和：$c_1 + c_2 = ${u0} + ${v0} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [u0 * v0, Math.abs(u0 - v0), ans + 2],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.14 Solving Systems of Linear ODEs
// ---------------------------------------------------------------------------

/** solvingDecoupledHomogeneousSystemsOfOdes solves diagonal systems. */
export const solvingDecoupledHomogeneousSystemsOfOdes: TopicDef = {
  id: "solving-decoupled-homogeneous-systems-of-odes",
  title: t("Solving Decoupled Homogeneous Systems of ODEs", "求解解耦的齐次线性微分方程组"),
  summary: t(
    "A decoupled system x_1' = λ_1 x_1, x_2' = λ_2 x_2 consists of independent first-order equations with solutions x_1(t) = c_1 e^{λ_1 t}, x_2(t) = c_2 e^{λ_2 t}.",
    "解耦微分方程组 x_1' = λ_1 x_1, x_2' = λ_2 x_2 由两个相互独立的单变量一阶常微分方程组成，通解为独立的单指数函数。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-systems-of-odes"],
  encompasses: [
    {
      topic: "general-solutions-of-first-order-linear-systems-of-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "independent-exponential-solutions-of-diagonal-systems",
      title: t("Initial velocity in decoupled linear systems", "解耦系统的初始演化导数值"),
      explanation: t(
        "For decoupled equations $x_1' = \\lambda_1 x_1$, the initial derivative is $x_1'(0) = \\lambda_1 x_1(0)$.",
        "在解耦系统 $x_1' = \\lambda_1 x_1$ 中，初始演化速度直接由 $x_1'(0) = \\lambda_1 x_1(0)$ 计算得到。",
      ),
      generate(rng: Rng): Problem {
        const lambda = rng.int(2, 12);
        const x0 = rng.int(2, 15);
        const ans = lambda * x0;

        const prompt = t(
          `Consider the decoupled linear system $x_1' = ${lambda}x_1$ and $x_2' = -5x_2$ with initial values $x_1(0) = ${x0}$ and $x_2(0) = 4$. Find the initial derivative $x_1'(0)$.`,
          `考虑解耦线性微分方程组 $x_1' = ${lambda}x_1$ 与 $x_2' = -5x_2$，初值为 $x_1(0) = ${x0}$ 和 $x_2(0) = 4$。求导数值 $x_1'(0)$。`,
        );
        const solution = t(
          steps(
            `Substitute the initial condition $x_1(0) = ${x0}$ directly into the first decoupled differential equation: $x_1'(0) = ${lambda} x_1(0)$.`,
            `Calculate the product: $x_1'(0) = ${lambda} \\times ${x0} = ${ans}$.`,
          ),
          steps(
            `直接将初值 $x_1(0) = ${x0}$ 代入第一个解耦微分方程：$x_1'(0) = ${lambda} x_1(0)$。`,
            `计算乘积：$x_1'(0) = ${lambda} \\times ${x0} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [ans + lambda, x0, lambda],
        });
      },
    },
  ],
};

/** solvingHomogeneousSystemsOfOdesWithDistinctEigenvalues finds eigenvalues. */
export const solvingHomogeneousSystemsOfOdesWithDistinctEigenvalues: TopicDef = {
  id: "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues",
  title: t("Solving Homogeneous Systems of ODEs With Distinct Eigenvalues", "具有互异实特征值的齐次线性微分方程组求解"),
  summary: t(
    "When A has real distinct eigenvalues λ_1 ≠ λ_2 with eigenvectors v_1, v_2, the general solution is x(t) = c_1 e^{λ_1 t} v_1 + c_2 e^{λ_2 t} v_2.",
    "当系数矩阵 A 具有互异实特征值 λ_1 ≠ λ_2 及其特征向量 v_1, v_2 时，齐次微分方程组的通解为 x(t) = c_1 e^{λ_1 t} v_1 + c_2 e^{λ_2 t} v_2。",
  ),
  prerequisites: ["solving-decoupled-homogeneous-systems-of-odes"],
  encompasses: [
    {
      topic: "solving-decoupled-homogeneous-systems-of-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "eigenvalue-eigenvector-method-for-linear-systems",
      title: t("Eigenvalues of a triangular coefficient matrix", "三角系数矩阵的特征值"),
      explanation: t(
        "For a triangular matrix $A = \\begin{pmatrix} a & 0 \\\\ c & d \\end{pmatrix}$, the eigenvalues are the diagonal entries $\\lambda = a$ and $\\lambda = d$.",
        "对于下三角矩阵 $A = \\begin{pmatrix} a & 0 \\\\ c & d \\end{pmatrix}$，特征值即为其主对角线上的元素 $\\lambda = a$ 与 $\\lambda = d$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 10);
        const diff = rng.int(2, 20);
        const d = a + diff;
        const c = rng.int(1, 8);
        const ans = d; // larger eigenvalue

        const prompt = t(
          `Find the larger eigenvalue $\\lambda$ of the system coefficient matrix $A = \\begin{pmatrix} ${a} & 0 \\\\ ${c} & ${d} \\end{pmatrix}$.`,
          `求系统系数矩阵 $A = \\begin{pmatrix} ${a} & 0 \\\\ ${c} & ${d} \\end{pmatrix}$ 中较大的特征值 $\\lambda$。`,
        );
        const solution = t(
          steps(
            `The characteristic polynomial is $\\det(A - \\lambda I) = (${a} - \\lambda)(${d} - \\lambda) - (0)(${c}) = (${a} - \\lambda)(${d} - \\lambda) = 0$.`,
            `The eigenvalues are the diagonal elements: $\\lambda_1 = ${a}$ and $\\lambda_2 = ${d}$.`,
            `The larger eigenvalue is $\\lambda = ${ans}$.`,
          ),
          steps(
            `计算特征多项式：$\\det(A - \\lambda I) = (${a} - \\lambda)(${d} - \\lambda) - (0)(${c}) = (${a} - \\lambda)(${d} - \\lambda) = 0$。`,
            `由于是三角矩阵，特征值即为主对角线元素：$\\lambda_1 = ${a}$ 与 $\\lambda_2 = ${d}$。`,
            `较大的特征值为 $\\lambda = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a, a + d, a * d],
        });
      },
    },
  ],
};

/** solvingHomogeneousSystemsOfOdesWithDistinctEigenvaluesAndInitialConditions solves IVP. */
export const solvingHomogeneousSystemsOfOdesWithDistinctEigenvaluesAndInitialConditions: TopicDef = {
  id: "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues-and-initial-conditions",
  title: t("Solving Homogeneous Systems of ODEs With Distinct Eigenvalues and Initial Conditions", "带初值条件的互异特征值齐次系统求解"),
  summary: t(
    "Solving an IVP x' = A x with x(0) = x_0 determines constants c_1, c_2 by solving the linear algebraic system c_1 v_1 + c_2 v_2 = x_0.",
    "求解带初值条件 x(0) = x_0 的线性微分方程组通过解线性代数方程组 c_1 v_1 + c_2 v_2 = x_0 确定常数系数。",
  ),
  prerequisites: ["solving-homogeneous-systems-of-odes-with-distinct-eigenvalues"],
  encompasses: [
    {
      topic: "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "initial-value-problems-for-diagonalizable-systems",
      title: t("Initial rate of change in diagonalized systems", "对角化系统中的初始变化率"),
      explanation: t(
        "For $\\mathbf{x}' = A \\mathbf{x}$, the initial derivative vector is $\\mathbf{x}'(0) = A \\mathbf{x}(0)$.",
        "对于系统 $\\mathbf{x}' = A \\mathbf{x}$，初值处的演化导数向量为 $\\mathbf{x}'(0) = A \\mathbf{x}(0)$。",
      ),
      generate(rng: Rng): Problem {
        const lambda1 = rng.int(2, 10);
        const lambda2 = rng.int(2, 10);
        const x0 = rng.int(2, 15);
        const y0 = rng.int(2, 15);
        const ans = lambda1 * x0; // x1'(0)

        const prompt = t(
          `A diagonal linear system satisfies $\\mathbf{x}' = \\begin{pmatrix} ${lambda1} & 0 \\\\ 0 & ${lambda2} \\end{pmatrix} \\mathbf{x}$ with initial state $\\mathbf{x}(0) = \\begin{pmatrix} ${x0} \\\\ ${y0} \\end{pmatrix}$. Find the initial rate of change $x_1'(0)$ of the first state variable.`,
          `对角线性微分方程组满足 $\\mathbf{x}' = \\begin{pmatrix} ${lambda1} & 0 \\\\ 0 & ${lambda2} \\end{pmatrix} \\mathbf{x}$，初始状态为 $\\mathbf{x}(0) = \\begin{pmatrix} ${x0} \\\\ ${y0} \\end{pmatrix}$。求第一状态变量的初始变化率 $x_1'(0)$。`,
        );
        const solution = t(
          steps(
            `The first row of the matrix equation reads $x_1'(t) = ${lambda1} x_1(t)$.`,
            `Evaluate at $t = 0$: $x_1'(0) = ${lambda1} x_1(0) = ${lambda1} \\times ${x0} = ${ans}$.`,
          ),
          steps(
            `矩阵方程的第一行展开为标量方程：$x_1'(t) = ${lambda1} x_1(t)$。`,
            `在 $t = 0$ 处求值：$x_1'(0) = ${lambda1} x_1(0) = ${lambda1} \\times ${x0} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [lambda2 * y0, x0 + y0, ans + lambda1],
        });
      },
    },
  ],
};

/** solvingHomogeneousSystemsOfOdesWithRepeatedEigenvalues finds generalized eigenvectors. */
export const solvingHomogeneousSystemsOfOdesWithRepeatedEigenvalues: TopicDef = {
  id: "solving-homogeneous-systems-of-odes-with-repeated-eigenvalues",
  title: t("Solving Homogeneous Systems of ODEs With Repeated Eigenvalues", "具有重特征值的齐次线性微分方程组求解"),
  summary: t(
    "When A has a defective repeated eigenvalue λ with one eigenvector v, a generalized eigenvector w satisfying (A - λ I) w = v produces the solution x(t) = e^{λ t}(c_1 v + c_2 (t v + w)).",
    "当矩阵 A 具有二重亏损特征值 λ 与单一特征向量 v 时，引入满足 (A - λ I) w = v 的广义特征向量 w，构成通解 x(t) = e^{λ t}(c_1 v + c_2 (t v + w))。",
  ),
  prerequisites: ["solving-homogeneous-systems-of-odes-with-distinct-eigenvalues"],
  encompasses: [
    {
      topic: "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "generalized-eigenvectors-for-defective-systems",
      title: t("Generalized eigenvectors for defective systems", "亏损矩阵的广义特征向量"),
      explanation: t(
        "For a Jordan block $A = \\begin{pmatrix} \\lambda & k \\\\ 0 & \\lambda \\end{pmatrix}$, $(A - \\lambda I) = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$. If the eigenvector is $\\mathbf{v} = \\begin{pmatrix} k \\\\ 0 \\end{pmatrix}$, then $\\mathbf{w} = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$ satisfies $(A - \\lambda I)\\mathbf{w} = \\mathbf{v}$.",
        "对于约当块矩阵 $A = \\begin{pmatrix} \\lambda & k \\\\ 0 & \\lambda \\end{pmatrix}$，有 $(A - \\lambda I) = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$。若特征向量为 $\\mathbf{v} = \\begin{pmatrix} k \\\\ 0 \\end{pmatrix}$，则广义特征向量 $\\mathbf{w} = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$ 满足 $(A - \\lambda I)\\mathbf{w} = \\mathbf{v}$。",
      ),
      generate(rng: Rng): Problem {
        const lambda = rng.int(2, 35);
        const ans = lambda;

        const prompt = t(
          `Find the repeated eigenvalue $\\lambda$ of the defective system matrix $A = \\begin{pmatrix} ${lambda} & 1 \\\\ 0 & ${lambda} \\end{pmatrix}$.`,
          `求亏损系统矩阵 $A = \\begin{pmatrix} ${lambda} & 1 \\\\ 0 & ${lambda} \\end{pmatrix}$ 的二重特征值 $\\lambda$。`,
        );
        const solution = t(
          steps(
            `The matrix is upper triangular with diagonal entries $A_{11} = ${lambda}$ and $A_{22} = ${lambda}$.`,
            `The characteristic polynomial is $\\det(A - \\lambda I) = (${lambda} - \\lambda)^2 = (r - ${lambda})^2 = 0$.`,
            `The repeated eigenvalue is $\\lambda = ${ans}$.`,
          ),
          steps(
            `该矩阵为上三角矩阵，对角线元素分别为 $A_{11} = ${lambda}$ 与 $A_{22} = ${lambda}$。`,
            `特征多项式为 $\\det(A - r I) = (${lambda} - r)^2 = 0$。`,
            `解得二重特征值为 $\\lambda = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [2 * lambda, lambda * lambda, ans + 1],
        });
      },
    },
  ],
};

/** solvingHomogeneousSystemsOfOdesWithComplexEigenvalues converts to real solutions. */
export const solvingHomogeneousSystemsOfOdesWithComplexEigenvalues: TopicDef = {
  id: "solving-homogeneous-systems-of-odes-with-complex-eigenvalues",
  title: t("Solving Homogeneous Systems of ODEs With Complex Eigenvalues", "具有复特征值的齐次线性微分方程组求解"),
  summary: t(
    "Complex conjugate eigenvalues α ± iβ produce oscillating spiral solutions with angular frequency β, wrapped in exponential envelope e^{α t}.",
    "共轭复特征值 α ± iβ 产生角频率为 β 的旋转振荡轨迹，并带有指数包络 e^{α t}。",
  ),
  prerequisites: ["solving-homogeneous-systems-of-odes-with-distinct-eigenvalues"],
  encompasses: [
    {
      topic: "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "real-solutions-from-complex-eigenvalues",
      title: t("Angular frequency from complex eigenvalues", "复特征值的旋转角频率"),
      explanation: t(
        "For $A = \\begin{pmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{pmatrix}$, the characteristic roots are $\\lambda = \\alpha \\pm i\\beta$, producing trajectories oscillating with angular speed $\\beta$.",
        "对于标准旋转伸缩矩阵 $A = \\begin{pmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{pmatrix}$，其特征值为 $\\lambda = \\alpha \\pm i\\beta$，轨迹具有旋转角频率 $\\beta$。",
      ),
      generate(rng: Rng): Problem {
        const alpha = rng.int(1, 10);
        const beta = rng.int(2, 35);
        const ans = beta;

        const prompt = t(
          `Find the angular frequency $\\beta > 0$ of the oscillating solution components for the linear system $\\mathbf{x}' = \\begin{pmatrix} ${alpha} & -${beta} \\\\ ${beta} & ${alpha} \\end{pmatrix} \\mathbf{x}$.`,
          `求线性微分方程组 $\\mathbf{x}' = \\begin{pmatrix} ${alpha} & -${beta} \\\\ ${beta} & ${alpha} \\end{pmatrix} \\mathbf{x}$ 的解向量振荡角频率 $\\beta > 0$。`,
        );
        const solution = t(
          steps(
            `The characteristic equation is $\\det(A - \\lambda I) = (${alpha} - \\lambda)^2 + ${beta * beta} = 0$.`,
            `Solve for $\\lambda$: $(\\lambda - ${alpha})^2 = -${beta * beta} \\implies \\lambda = ${alpha} \\pm ${beta}i$.`,
            `The imaginary part gives the angular frequency $\\beta = ${ans}\\text{ rad/s}$.`,
          ),
          steps(
            `计算特征方程：$\\det(A - \\lambda I) = (${alpha} - \\lambda)^2 + ${beta * beta} = 0$。`,
            `解得共轭复根：$(\\lambda - ${alpha})^2 = -${beta * beta} \\implies \\lambda = ${alpha} \\pm ${beta}i$。`,
            `虚部即为解的角频率 $\\beta = ${ans}\\text{ 弧度/秒}$。`,
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

/** solvingInhomogeneousSystemsOfOdes finds steady-state particular vectors. */
export const solvingInhomogeneousSystemsOfOdes: TopicDef = {
  id: "solving-inhomogeneous-systems-of-odes",
  title: t("Solving Inhomogeneous Systems of ODEs", "非齐次线性微分方程组求解"),
  summary: t(
    "For x' = A x + b with constant vector b and non-singular A, the constant particular solution is x_p = -A^{-1} b.",
    "对于具有常向量激励 x' = A x + b 且系数矩阵 A 可逆的系统，常数特解向量由稳态代数方程给出：x_p = -A^{-1} b。",
  ),
  prerequisites: ["solving-homogeneous-systems-of-odes-with-distinct-eigenvalues"],
  encompasses: [
    {
      topic: "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "undetermined-coefficients-for-constant-forcing-vectors",
      title: t("Steady-state particular solution for constant forcing", "常数激励下的稳态特解向量"),
      explanation: t(
        "For $\\mathbf{x}' = A \\mathbf{x} + \\mathbf{b}$ where $A = \\operatorname{diag}(a, d)$, setting $\\mathbf{x}_p = \\mathbf{c}$ gives $A \\mathbf{c} + \\mathbf{b} = \\mathbf{0} \\implies c_1 = -b_1 / a$.",
        "对于对角系统 $\\mathbf{x}' = A \\mathbf{x} + \\mathbf{b}$，设常数特解 $\\mathbf{x}_p = \\mathbf{c}$，代入平衡条件 $A \\mathbf{c} + \\mathbf{b} = \\mathbf{0}$，得第一分量为 $c_1 = -b_1 / a$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const c1 = rng.int(2, 25);
        const b1 = a * c1; // so -b1 / a = -c1
        const ans = c1;

        const prompt = t(
          `Find the magnitude of the steady-state value $|x_1|$ for the decoupled inhomogeneous system $x_1' = -${a}x_1 + ${b1}$.`,
          `求非齐次一阶常微分方程 $x_1' = -${a}x_1 + ${b1}$ 的稳态平衡值 $|x_1|$ 的大小。`,
        );
        const solution = t(
          steps(
            `At steady state, the derivative vanishes: $x_1' = 0$.`,
            `Set the right-hand side to zero: $-${a}x_1 + ${b1} = 0$.`,
            `Solve for $x_1$: $x_1 = \\frac{${b1}}{${a}} = ${ans}$.`,
          ),
          steps(
            `在稳态平衡点处，状态变化率为零：$x_1' = 0$。`,
            `令导数项为零：$-${a}x_1 + ${b1} = 0$。`,
            `解得稳态值：$x_1 = \\frac{${b1}}{${a}} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [b1, a, ans + a],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.15 Phase Portraits for Systems of Linear ODEs
// ---------------------------------------------------------------------------

/** phasePlanesAndPhasePortraits analyzes trajectory slopes dy/dx. */
export const phasePlanesAndPhasePortraits: TopicDef = {
  id: "phase-planes-and-phase-portraits",
  title: t("Phase Planes and Phase Portraits", "相平面与相图"),
  summary: t(
    "In the phase plane (x, y), trajectories follow the vector field (x', y'), with trajectory slope dy/dx = y'/x' defining phase curves.",
    "在相平面 (x, y) 中，状态轨迹沿向量场 (x', y') 演化流动，其相曲线的切线斜率由 dy/dx = y'/x' 确定。",
  ),
  prerequisites: ["solving-decoupled-homogeneous-systems-of-odes"],
  encompasses: [
    {
      topic: "solving-decoupled-homogeneous-systems-of-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "direction-fields-and-trajectories-in-the-phase-plane",
      title: t("Trajectory slope in the phase plane", "相平面上状态轨迹的切线斜率"),
      explanation: t(
        "The slope of a phase trajectory is $\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}$. For $x' = a x$ and $y' = b y$, $\\frac{dy}{dx} = \\frac{b y}{a x}$.",
        "相轨迹的斜率由链式法则给出：$\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}$。对于系统 $x' = a x, y' = b y$，切线斜率为 $\\frac{dy}{dx} = \\frac{b y}{a x}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const b = rng.int(2, 35);
        const ans = b;

        const prompt = t(
          `For the linear autonomous system $x' = ${poly([a, "x"])}$ and $y' = ${poly([b, "y"])}$, evaluate the trajectory slope $\\frac{dy}{dx}$ at the point $(x, y) = (1, ${a})$ in the phase plane.`,
          `对于线性自自治方程组 $x' = ${poly([a, "x"])}$ 与 $y' = ${poly([b, "y"])}$，计算相平面上在点 $(x, y) = (1, ${a})$ 处的轨迹切线斜率 $\\frac{dy}{dx}$。`,
        );
        const solution = t(
          steps(
            `Apply the chain rule for the parametric trajectory: $\\frac{dy}{dx} = \\frac{y'}{x'} = \\frac{${poly([b, "y"])}}{${poly([a, "x"])}}$.`,
            `Substitute $(x, y) = (1, ${a})$: $\\frac{dy}{dx} = \\frac{${b}(${a})}{${a}(1)} = \\frac{${b * a}}{${a}} = ${ans}$.`,
          ),
          steps(
            `由参数曲线求导法则：$\\frac{dy}{dx} = \\frac{y'}{x'} = \\frac{${poly([b, "y"])}}{${poly([a, "x"])}}$。`,
            `代入点 $(x, y) = (1, ${a})$：$\\frac{dy}{dx} = \\frac{${b}(${a})}{${a}(1)} = \\frac{${b * a}}{${a}} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a, b * a, ans + 1],
        });
      },
    },
  ],
};

/** equilibriumPointsAndStabilityForSystemsOfOdes checks critical points. */
export const equilibriumPointsAndStabilityForSystemsOfOdes: TopicDef = {
  id: "equilibrium-points-and-stability-for-systems-of-odes",
  title: t("Equilibrium Points and Stability for Systems of ODEs", "微分方程组的平衡点与稳定性"),
  summary: t(
    "Equilibrium points satisfy A x_0 = 0. When det(A) ≠ 0, the origin is the unique isolated equilibrium, classified by trace and determinant.",
    "平衡点满足 A x_0 = 0。当 det(A) ≠ 0 时，原点是唯一的孤立平衡点，其稳定性由矩阵的迹与行列式完全确定。",
  ),
  prerequisites: ["phase-planes-and-phase-portraits"],
  encompasses: [{ topic: "phase-planes-and-phase-portraits", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "classification-of-isolated-critical-points",
      title: t("Determinant test for isolated critical points", "孤立平衡点的行列式判定准则"),
      explanation: t(
        "A linear system $A \\mathbf{x} = \\mathbf{0}$ has an isolated critical point at the origin if and only if $\\det(A) \\ne 0$.",
        "线性系统 $A \\mathbf{x} = \\mathbf{0}$ 在原点具有孤立平衡点当且仅当系数矩阵行列式 $\\det(A) \\ne 0$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const d = rng.int(2, 8);
        const b = rng.int(1, 4);
        const c = rng.int(1, 4);
        const detA = a * d - b * c;
        const ans = detA;

        const prompt = t(
          `Calculate the determinant $\\det(A)$ for $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$ to verify that the origin is an isolated equilibrium point.`,
          `计算矩阵 $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$ 的行列式 $\\det(A)$，以判定原点是否为孤立平衡点。`,
        );
        const solution = t(
          steps(
            `The determinant of a $2 \\times 2$ matrix is $\\det(A) = ad - bc$.`,
            `Substitute entries: $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${a * d} - ${b * c} = ${ans}$.`,
            `Since $\\det(A) \\ne 0$, the origin is the unique isolated equilibrium point.`,
          ),
          steps(
            `二阶方阵的行列式公式为 $\\det(A) = ad - bc$。`,
            `代入元素计算：$\\det(A) = (${a})(${d}) - (${b})(${c}) = ${a * d} - ${b * c} = ${ans}$。`,
            `因为 $\\det(A) \\ne 0$，所以原点是系统唯一的孤立平衡点。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a + d, a * d, detA + 2],
        });
      },
    },
  ],
};

/** phasePortraitsForDecoupledLinearSystems connects powers in trajectory equations. */
export const phasePortraitsForDecoupledLinearSystems: TopicDef = {
  id: "phase-portraits-for-decoupled-linear-systems",
  title: t("Phase Portraits for Decoupled Linear Systems", "解耦线性系统的相图"),
  summary: t(
    "For x' = λ_1 x and y' = λ_2 y, integrating dy/dx = (λ_2/λ_1)(y/x) yields trajectory curves y = C x^{λ_2/λ_1}.",
    "对于解耦系统 x' = λ_1 x 与 y' = λ_2 y，积分分离变量方程 dy/dx = (λ_2/λ_1)(y/x) 得到相轨迹曲线族方程 y = C x^{λ_2/λ_1}。",
  ),
  prerequisites: ["phase-planes-and-phase-portraits"],
  encompasses: [{ topic: "phase-planes-and-phase-portraits", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "trajectories-of-decoupled-systems",
      title: t("Power exponent of decoupled phase trajectories", "解耦系统相曲线的幂指数"),
      explanation: t(
        "For $\\frac{dy}{dx} = \\frac{\\lambda_2 y}{\\lambda_1 x}$, separation of variables yields $\\ln|y| = \\frac{\\lambda_2}{\\lambda_1}\\ln|x| + C \\implies y = K x^p$ where $p = \\frac{\\lambda_2}{\\lambda_1}$.",
        "对于 $\\frac{dy}{dx} = \\frac{\\lambda_2 y}{\\lambda_1 x}$，分离变量积分可得 $\\ln|y| = \\frac{\\lambda_2}{\\lambda_1}\\ln|x| + C \\implies y = K x^p$，其中幂指数 $p = \\frac{\\lambda_2}{\\lambda_1}$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(2, 35);
        const ans = p;

        const prompt = t(
          `In the phase plane for $x' = x$ and $y' = ${p}y$, trajectories follow power curves $y = C x^p$ (for $x > 0$). Find the power exponent $p$.`,
          `在相平面上，微分方程组 $x' = x$ 与 $y' = ${p}y$ 的状态轨迹服从幂函数曲线 $y = C x^p$（$x > 0$）。求幂指数 $p$ 的值。`,
        );
        const solution = t(
          steps(
            `Divide the equations: $\\frac{dy}{dx} = \\frac{y'}{x'} = \\frac{${p}y}{x}$.`,
            `Separate variables: $\\frac{dy}{y} = ${p} \\frac{dx}{x}$.`,
            `Integrate both sides: $\\ln y = ${p}\\ln x + \\ln C \\implies y = C x^{${p}}$.`,
            `Therefore, the power exponent is $p = ${ans}$.`,
          ),
          steps(
            `两式相比：$\\frac{dy}{dx} = \\frac{y'}{x'} = \\frac{${p}y}{x}$。`,
            `分离变量：$\\frac{dy}{y} = ${p} \\frac{dx}{x}$。`,
            `两边积分：$\\ln y = ${p}\\ln x + \\ln C \\implies y = C x^{${p}}$。`,
            `因此，幂指数为 $p = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [p + 1, 2 * p, p * p],
        });
      },
    },
  ],
};

/** phasePortraitsForLinearSystemsWithRealDistinctEigenvalues classifies nodes and saddles. */
export const phasePortraitsForLinearSystemsWithRealDistinctEigenvalues: TopicDef = {
  id: "phase-portraits-for-linear-systems-with-real-distinct-eigenvalues",
  title: t("Phase Portraits for Linear Systems With Real Distinct Eigenvalues", "具有互异实特征值的线性系统相图"),
  summary: t(
    "When eigenvalues have opposite signs (λ_1 < 0 < λ_2), the origin is an unstable saddle point; when same signs, it is a stable or unstable node.",
    "当特征值异号（λ_1 < 0 < λ_2）时原点为不稳定的鞍点；当特征值同号时原点为稳定或不稳定的结点。",
  ),
  prerequisites: ["phase-portraits-for-decoupled-linear-systems"],
  encompasses: [
    {
      topic: "phase-portraits-for-decoupled-linear-systems",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "saddle-points-and-nodes-classification",
      title: t("Determinant condition for a saddle point", "鞍点的行列式负判定条件"),
      explanation: t(
        "A saddle point occurs when the eigenvalues have opposite signs, which is equivalent to $\\det(A) = \\lambda_1 \\lambda_2 < 0$.",
        "当特征值异号时系统在原点形成鞍点，其等价充要代数条件为行列式 $\\det(A) = \\lambda_1 \\lambda_2 < 0$。",
      ),
      generate(rng: Rng): Problem {
        const lambda1 = rng.int(2, 10);
        const lambda2 = rng.int(2, 10);
        const detA = -lambda1 * lambda2;
        const ans = detA;

        const prompt = t(
          `A $2 \\times 2$ system matrix has real eigenvalues $\\lambda_1 = -${lambda1}$ and $\\lambda_2 = ${lambda2}$. Compute the determinant $\\det(A) = \\lambda_1 \\lambda_2$ characterizing this saddle point.`,
          `某二阶系统矩阵具有实特征值 $\\lambda_1 = -${lambda1}$ 与 $\\lambda_2 = ${lambda2}$。计算刻画该鞍点的行列式 $\\det(A) = \\lambda_1 \\lambda_2$。`,
        );
        const solution = t(
          steps(
            `The determinant of a matrix equals the product of its eigenvalues: $\\det(A) = \\lambda_1 \\lambda_2$.`,
            `Substitute the eigenvalues: $\\det(A) = (-${lambda1})(${lambda2}) = ${ans}$.`,
            `Since $\\det(A) < 0$, the critical point is a saddle point.`,
          ),
          steps(
            `矩阵的行列式等于其特征值的乘积：$\\det(A) = \\lambda_1 \\lambda_2$。`,
            `代入两特征值：$\\det(A) = (-${lambda1})(${lambda2}) = ${ans}$。`,
            `因 $\\det(A) < 0$，该临界平衡点为鞍点。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [-detA, lambda2 - lambda1, lambda1 + lambda2],
        });
      },
    },
  ],
};

/** phasePortraitsForLinearSystemsWithRepeatedEigenvalues examines star and degenerate nodes. */
export const phasePortraitsForLinearSystemsWithRepeatedEigenvalues: TopicDef = {
  id: "phase-portraits-for-linear-systems-with-repeated-eigenvalues",
  title: t("Phase Portraits for Linear Systems With Repeated Eigenvalues", "具有重特征值的线性系统相图"),
  summary: t(
    "Repeated eigenvalues produce a star node when two eigenvectors exist (A = λ I), or a degenerate node when only one independent eigenvector exists.",
    "重特征值在具有两个独立特征向量（A = λ I）时形成星形对称结点；在仅有一个独立特征向量时形成退化结点。",
  ),
  prerequisites: ["phase-portraits-for-linear-systems-with-real-distinct-eigenvalues"],
  encompasses: [
    {
      topic: "phase-portraits-for-linear-systems-with-real-distinct-eigenvalues",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "degenerate-nodes-and-proper-nodes",
      title: t("Radial ray trajectories of star nodes", "星形结点的径向射线轨迹"),
      explanation: t(
        "For $A = -k I$ with $k > 0$, every vector is an eigenvector, so every trajectory is a straight line ray entering the origin as $t \\to \\infty$.",
        "对于数量矩阵 $A = -k I$（$k > 0$），平面上任意向量均为特征向量，所有相轨迹均为当 $t \\to \\infty$ 时直线趋向原点的径向射线。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 35);
        const ans = k;

        const prompt = t(
          `Find the decay rate $k$ for the star node system $\\mathbf{x}' = \\begin{pmatrix} -${k} & 0 \\\\ 0 & -${k} \\end{pmatrix} \\mathbf{x}$.`,
          `求星形稳定结点系统 $\\mathbf{x}' = \\begin{pmatrix} -${k} & 0 \\\\ 0 & -${k} \\end{pmatrix} \\mathbf{x}$ 的径向衰减速率 $k$。`,
        );
        const solution = t(
          steps(
            `The system is $x' = -${k}x$ and $y' = -${k}y$.`,
            `Both state variables decay as $e^{-${k}t}$, so the decay rate is $k = ${ans}$.`,
          ),
          steps(`系统展开为 $x' = -${k}x$ 与 $y' = -${k}y$。`, `两个状态变量均按 $e^{-${k}t}$ 衰减，因此径向衰减速率为 $k = ${ans}$。`),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [2 * k, k * k, ans + 1],
        });
      },
    },
  ],
};

/** phasePortraitsForLinearSystemsWithZeroEigenvalues examines lines of equilibria. */
export const phasePortraitsForLinearSystemsWithZeroEigenvalues: TopicDef = {
  id: "phase-portraits-for-linear-systems-with-zero-eigenvalues",
  title: t("Phase Portraits for Linear Systems With Zero Eigenvalues", "具有零特征值的线性系统相图"),
  summary: t(
    "When det(A) = 0, λ = 0 is an eigenvalue, and the nullspace ker(A) forms an entire continuous line of non-isolated equilibrium points.",
    "当 det(A) = 0 时，λ = 0 是特征值，零空间 ker(A) 形成一整条非孤立平衡点构成的平衡线。",
  ),
  prerequisites: ["phase-portraits-for-linear-systems-with-real-distinct-eigenvalues"],
  encompasses: [
    {
      topic: "phase-portraits-for-linear-systems-with-real-distinct-eigenvalues",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "lines-of-equilibria-when-determinant-is-zero",
      title: t("Lines of equilibria when determinant is zero", "零特征值系统的平衡线方程"),
      explanation: t(
        "For $A = \\begin{pmatrix} a & b \\\\ 2a & 2b \\end{pmatrix}$, $\\det(A) = 0$. The equilibrium points satisfy $a x + b y = 0$.",
        "对于秩为 1 的矩阵 $A = \\begin{pmatrix} a & b \\\\ 2a & 2b \\end{pmatrix}$，$\\det(A) = 0$。其平衡点轨迹构成直线 $a x + b y = 0$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 35);
        const ans = a;

        const prompt = t(
          `For the linear system $\\mathbf{x}' = \\begin{pmatrix} ${a} & 1 \\\\ ${2 * a} & 2 \\end{pmatrix} \\mathbf{x}$, the equilibrium points form a line $${a}x + y = 0$. Find the coefficient of $x$ in this line equation.`,
          `对于线性系统 $\\mathbf{x}' = \\begin{pmatrix} ${a} & 1 \\\\ ${2 * a} & 2 \\end{pmatrix} \\mathbf{x}$，其平衡点构成直线 $${a}x + y = 0$。求该平衡线方程中 $x$ 的系数。`,
        );
        const solution = t(
          steps(
            `Equilibrium points satisfy $A \\mathbf{x} = \\mathbf{0}$, which gives ${a}x + y = 0$ and ${2 * a}x + 2y = 0$.`,
            `Both equations are identical to $${a}x + y = 0$.`,
            `The coefficient of $x$ is $a = ${ans}$.`,
          ),
          steps(
            `平衡点满足 $A \\mathbf{x} = \\mathbf{0}$，展开得 ${a}x + y = 0$ 与 ${2 * a}x + 2y = 0$。`,
            `两方程线性相关，化简均为 $${a}x + y = 0$。`,
            `因此 $x$ 的系数为 $a = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [2 * a, a + 1, 1],
        });
      },
    },
  ],
};

/** phasePortraitsForLinearSystemsWithComplexEigenvalues classifies centers and spirals. */
export const phasePortraitsForLinearSystemsWithComplexEigenvalues: TopicDef = {
  id: "phase-portraits-for-linear-systems-with-complex-eigenvalues",
  title: t("Phase Portraits for Linear Systems With Complex Eigenvalues", "具有复特征值的线性系统相图"),
  summary: t(
    "When eigenvalues are purely imaginary (α = 0), the origin is a center surrounded by closed concentric elliptical orbits; when α ≠ 0, trajectories spiral.",
    "当特征值为纯虚数（α = 0）时，原点为被封闭同心椭圆轨道包围的中心点；当实部 α ≠ 0 时，相轨迹向内或向外螺旋发散。",
  ),
  prerequisites: ["phase-portraits-for-linear-systems-with-real-distinct-eigenvalues"],
  encompasses: [
    {
      topic: "phase-portraits-for-linear-systems-with-real-distinct-eigenvalues",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "centers-and-spiral-points",
      title: t("Frequency of closed orbits around a center", "中心点周围封闭轨道的循环频率"),
      explanation: t(
        "For $A = \\begin{pmatrix} 0 & -\\omega \\\\ \\omega & 0 \\end{pmatrix}$, eigenvalues are $\\pm i\\omega$, producing a center with angular frequency $\\omega$.",
        "对于系统 $A = \\begin{pmatrix} 0 & -\\omega \\\\ \\omega & 0 \\end{pmatrix}$，特征值为纯虚根 $\\pm i\\omega$，原点为中心点，闭轨道的角频率为 $\\omega$。",
      ),
      generate(rng: Rng): Problem {
        const omega = rng.int(2, 35);
        const ans = omega;

        const prompt = t(
          `A linear system has phase portrait consisting of closed circular orbits governed by $\\mathbf{x}' = \\begin{pmatrix} 0 & -${omega} \\\\ ${omega} & 0 \\end{pmatrix} \\mathbf{x}$. Find the natural angular frequency $\\omega$ in $\\text{rad/s}$.`,
          `某线性系统的相图由同心圆封闭轨道组成，满足 $\\mathbf{x}' = \\begin{pmatrix} 0 & -${omega} \\\\ ${omega} & 0 \\end{pmatrix} \\mathbf{x}$。求中心点封闭轨道的固有角频率 $\\omega$（单位：$\\text{弧度/秒}$）。`,
        );
        const solution = t(
          steps(
            `Compute the characteristic equation: $\\det(A - \\lambda I) = \\lambda^2 + ${omega * omega} = 0$.`,
            `The roots are $\\lambda = \\pm ${omega}i$.`,
            `The angular frequency is $\\omega = ${ans}\\text{ rad/s}$.`,
          ),
          steps(
            `计算特征方程：$\\det(A - \\lambda I) = \\lambda^2 + ${omega * omega} = 0$。`,
            `解得纯虚根：$\\lambda = \\pm ${omega}i$。`,
            `因此角频率为 $\\omega = ${ans}\\text{ 弧度/秒}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [omega * omega, 2 * omega, ans + 1],
        });
      },
    },
  ],
};

/** shiftedSystemsOfOdes translates equilibria away from the origin. */
export const shiftedSystemsOfOdes: TopicDef = {
  id: "shifted-systems-of-odes",
  title: t("Shifted Systems of ODEs", "平移线性微分方程组"),
  summary: t(
    "A shifted system x' = A(x - x_*) translates the phase portrait to an equilibrium point x_*, transforming back to standard origin form under u = x - x_*.",
    "平移线性微分方程组 x' = A(x - x_*) 将相图几何结构整体平移至非零平衡点 x_*，通过坐标变换 u = x - x_* 可化回标准原点形式。",
  ),
  prerequisites: ["equilibrium-points-and-stability-for-systems-of-odes"],
  encompasses: [
    {
      topic: "equilibrium-points-and-stability-for-systems-of-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "translation-of-equilibrium-to-the-origin",
      title: t("Coordinates of a shifted equilibrium point", "平移平衡点的空间坐标"),
      explanation: t(
        "For $x' = -a(x - x_*)$, the equilibrium point is located at $x = x_*$.",
        "对于方程 $x' = -a(x - x_*)$，系统的稳定平衡点位于 $x = x_*$。",
      ),
      generate(rng: Rng): Problem {
        const xStar = rng.int(2, 35);
        const a = rng.int(2, 8);
        const ans = xStar;

        const prompt = t(
          `Find the equilibrium coordinate $x_*$ for the system $x' = -${a}(x - ${xStar})$.`,
          `求微分方程 $x' = -${a}(x - ${xStar})$ 的平衡点坐标 $x_*$。`,
        );
        const solution = t(
          steps(
            `At the equilibrium point, the rate of change is zero: $x' = 0$.`,
            `Set the equation to zero: $-${a}(x_* - ${xStar}) = 0$.`,
            `Solve for $x_*$: $x_* = ${ans}$.`,
          ),
          steps(
            `在平衡点处，状态变化率为零：$x' = 0$。`,
            `令方程右端为零：$-${a}(x_* - ${xStar}) = 0$。`,
            `解得平衡点坐标：$x_* = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a * xStar, a, ans + 2],
        });
      },
    },
  ],
};

/** linearApproximationsNearEquilibria uses the Jacobian matrix. */
export const linearApproximationsNearEquilibria: TopicDef = {
  id: "linear-approximations-near-equilibria",
  title: t("Linear Approximations Near Equilibria", "平衡点附近的线性化近似"),
  summary: t(
    "Near an equilibrium point x_*, a nonlinear system x' = F(x) is approximated by the linear system u' = J(x_*) u, where J is the Jacobian matrix.",
    "在平衡点 x_* 附近，非线性系统 x' = F(x) 可用一阶雅可比矩阵 J(x_*) 进行局部线性化近似：u' = J(x_*) u。",
  ),
  prerequisites: ["shifted-systems-of-odes"],
  encompasses: [{ topic: "shifted-systems-of-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "jacobian-matrix-and-local-linearization",
      title: t("Jacobian entry of a nonlinear system", "非线性系统在平衡点处的雅可比矩阵元素"),
      explanation: t(
        "For $x' = f(x, y) = a x - x^2$, the partial derivative $\\frac{\\partial f}{\\partial x} = a - 2x$. At the origin $(0, 0)$, $J_{11} = a$.",
        "对于 $x' = f(x, y) = a x - x^2$，偏导数为 $\\frac{\\partial f}{\\partial x} = a - 2x$。在原点平衡点 $(0, 0)$ 处，雅可比元素为 $J_{11} = a$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 35);
        const ans = a;

        const prompt = t(
          `Consider the nonlinear system $x' = ${a}x - x^2$ and $y' = -y$. Evaluate the entry $J_{11} = \\frac{\\partial f_1}{\\partial x}$ of the Jacobian matrix evaluated at the equilibrium $(x, y) = (0, 0)$.`,
          `考虑非线性动力系统 $x' = ${a}x - x^2$ 与 $y' = -y$。计算在平衡点 $(x, y) = (0, 0)$ 处雅可比矩阵的元素 $J_{11} = \\frac{\\partial f_1}{\\partial x}$。`,
        );
        const solution = t(
          steps(
            `Compute the partial derivative: $\\frac{\\partial f_1}{\\partial x} = \\frac{\\partial}{\\partial x}(${a}x - x^2) = ${a} - 2x$.`,
            `Evaluate at $x = 0$: $J_{11} = ${a} - 2(0) = ${ans}$.`,
          ),
          steps(
            `计算关于 $x$ 的偏导数：$\\frac{\\partial f_1}{\\partial x} = \\frac{\\partial}{\\partial x}(${a}x - x^2) = ${a} - 2x$。`,
            `在平衡点 $x = 0$ 处求值：$J_{11} = ${a} - 2(0) = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [-a, 2 * a, ans + 1],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.16 Solving Systems of ODEs Using Matrix Methods
// ---------------------------------------------------------------------------

/** matrixExponentials computes e^{At} for nilpotent matrices. */
export const matrixExponentials: TopicDef = {
  id: "matrix-exponentials",
  title: t("Matrix Exponentials", "矩阵指数"),
  summary: t(
    "The matrix exponential e^{At} = ∑ (At)^k / k! solves x' = A x, terminating into a finite sum I + At for nilpotent matrices with A^2 = 0.",
    "矩阵指数 e^{At} = ∑ (At)^k / k! 用于表示系统 x' = A x 的解；对于幂零矩阵（A^2 = 0），泰勒级数截断为有限项 I + At。",
  ),
  prerequisites: ["solving-homogeneous-systems-of-odes-with-distinct-eigenvalues"],
  encompasses: [
    {
      topic: "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "definition-and-properties-of-matrix-exponentials",
      title: t("Matrix exponential of a nilpotent shear matrix", "幂零剪切矩阵的矩阵指数"),
      explanation: t(
        "For $A = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$, $A^2 = 0$. Thus $e^{At} = I + At = \\begin{pmatrix} 1 & kt \\\\ 0 & 1 \\end{pmatrix}$. At $t = 1$, the upper right entry is $k$.",
        "对于矩阵 $A = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$，有 $A^2 = 0$。因此 $e^{At} = I + At = \\begin{pmatrix} 1 & kt \\\\ 0 & 1 \\end{pmatrix}$。在 $t = 1$ 处右上角元素即为 $k$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 35);
        const ans = k;

        const prompt = t(
          `For the nilpotent matrix $A = \\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix}$, calculate the upper right entry $(e^A)_{12}$ of the matrix exponential $e^A$ (evaluated at $t = 1$).`,
          `对于幂零矩阵 $A = \\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix}$，计算矩阵指数 $e^A$（即 $t = 1$ 时）的右上角元素 $(e^A)_{12}$。`,
        );
        const solution = t(
          steps(
            `Compute $A^2$: $A^2 = \\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$.`,
            `The power series for $e^A$ terminates after two terms: $e^A = I + A$.`,
            `Substitute: $e^A = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} + \\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 1 & ${k} \\\\ 0 & 1 \\end{pmatrix}$.`,
            `The upper right entry is $(e^A)_{12} = ${ans}$.`,
          ),
          steps(
            `计算矩阵平方：$A^2 = \\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$。`,
            `矩阵指数幂级数展开截断为前两项：$e^A = I + A$。`,
            `代入矩阵相加：$e^A = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} + \\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 1 & ${k} \\\\ 0 & 1 \\end{pmatrix}$。`,
            `右上角元素为 $(e^A)_{12} = ${ans}$。`,
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

/** fundamentalMatrices constructs Φ(t) satisfying Φ' = A Φ. */
export const fundamentalMatrices: TopicDef = {
  id: "fundamental-matrices",
  title: t("Fundamental Matrices", "基本解矩阵"),
  summary: t(
    "A fundamental matrix Φ(t) has columns consisting of linearly independent vector solutions, satisfying Φ'(t) = A Φ(t) and normalized by e^{At} = Φ(t) Φ(0)^{-1}.",
    "基本解矩阵 Φ(t) 的各列由线性无关的解向量组成，满足 Φ'(t) = A Φ(t)，且与矩阵指数的关系为 e^{At} = Φ(t) Φ(0)^{-1}。",
  ),
  prerequisites: ["matrix-exponentials"],
  encompasses: [{ topic: "matrix-exponentials", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "the-fundamental-matrix-solution",
      title: t("Initial determinant of a fundamental matrix", "基本解矩阵的初值行列式"),
      explanation: t(
        "For $\\Phi(t) = \\begin{pmatrix} e^{a t} & 0 \\\\ 0 & e^{b t} \\end{pmatrix}$, evaluating at $t = 0$ gives $\\Phi(0) = I$, with determinant $\\det(\\Phi(0)) = 1$. For scaled columns, $\\det(\\Phi(0)) = u v$.",
        "对于基本解矩阵 $\\Phi(t)$，在 $t = 0$ 处的行列式等于各初始解向量构成的方阵行列式。",
      ),
      generate(rng: Rng): Problem {
        const u = rng.int(2, 10);
        const v = rng.int(2, 15);
        const ans = u * v;

        const prompt = t(
          `A fundamental matrix for a $2 \\times 2$ system has initial columns $\\mathbf{x}_1(0) = \\begin{pmatrix} ${u} \\\\ 0 \\end{pmatrix}$ and $\\mathbf{x}_2(0) = \\begin{pmatrix} 0 \\\\ ${v} \\end{pmatrix}$. Evaluate the determinant $\\det(\\Phi(0))$.`,
          `某二阶系统的基本解矩阵在初值处的两列向量分别为 $\\mathbf{x}_1(0) = \\begin{pmatrix} ${u} \\\\ 0 \\end{pmatrix}$ 与 $\\mathbf{x}_2(0) = \\begin{pmatrix} 0 \\\\ ${v} \\end{pmatrix}$。计算行列式 $\\det(\\Phi(0))$ 的值。`,
        );
        const solution = t(
          steps(
            `Assemble the fundamental matrix at $t = 0$: $\\Phi(0) = \\begin{pmatrix} ${u} & 0 \\\\ 0 & ${v} \\end{pmatrix}$.`,
            `The determinant is $\\det(\\Phi(0)) = (${u})(${v}) - (0)(0) = ${ans}$.`,
          ),
          steps(
            `构成 $t = 0$ 处的基本解矩阵：$\\Phi(0) = \\begin{pmatrix} ${u} & 0 \\\\ 0 & ${v} \\end{pmatrix}$。`,
            `计算行列式：$\\det(\\Phi(0)) = (${u})(${v}) - (0)(0) = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [u + v, u, v],
        });
      },
    },
  ],
};

/** solvingHomogeneousSystemsOfOdesUsingMatrixMethods evaluates x(t) = e^{At} x0. */
export const solvingHomogeneousSystemsOfOdesUsingMatrixMethods: TopicDef = {
  id: "solving-homogeneous-systems-of-odes-using-matrix-methods",
  title: t("Solving Homogeneous Systems of ODEs Using Matrix Methods", "应用矩阵方法求解齐次微分方程组"),
  summary: t(
    "Using the matrix exponential, the unique solution to the IVP x' = A x, x(0) = x_0 is expressed compactly as x(t) = e^{At} x_0.",
    "利用矩阵指数，初值问题 x' = A x, x(0) = x_0 的唯一解可紧凑表示为 x(t) = e^{At} x_0。",
  ),
  prerequisites: ["fundamental-matrices"],
  encompasses: [{ topic: "fundamental-matrices", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "solution-via-matrix-exponential",
      title: t("Initial state evaluation via matrix exponential", "矩阵指数解在初始状态下的验证"),
      explanation: t(
        "Since $e^{A \\cdot 0} = I$, the solution $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0$ satisfies $\\mathbf{x}(0) = I \\mathbf{x}_0 = \\mathbf{x}_0$.",
        "因为 $e^{A \\cdot 0} = I$，解向量 $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0$ 在 $t = 0$ 处满足 $\\mathbf{x}(0) = I \\mathbf{x}_0 = \\mathbf{x}_0$。",
      ),
      generate(rng: Rng): Problem {
        const x0 = rng.int(2, 20);
        const y0 = rng.int(2, 20);
        const ans = x0 + y0;

        const prompt = t(
          `Given the solution $\\mathbf{x}(t) = e^{At}\\begin{pmatrix} ${x0} \\\\ ${y0} \\end{pmatrix}$ to a homogeneous system, find the sum of coordinates $x_1(0) + x_2(0)$ at $t = 0$.`,
          `已知齐次系统的解向量为 $\\mathbf{x}(t) = e^{At}\\begin{pmatrix} ${x0} \\\\ ${y0} \\end{pmatrix}$。求在 $t = 0$ 时状态坐标之和 $x_1(0) + x_2(0)$。`,
        );
        const solution = t(
          steps(
            `At $t = 0$, the matrix exponential is the identity matrix: $e^{A \\cdot 0} = I$.`,
            `Therefore, $\\mathbf{x}(0) = I \\begin{pmatrix} ${x0} \\\\ ${y0} \\end{pmatrix} = \\begin{pmatrix} ${x0} \\\\ ${y0} \\end{pmatrix}$.`,
            `The sum is $x_1(0) + x_2(0) = ${x0} + ${y0} = ${ans}$.`,
          ),
          steps(
            `在 $t = 0$ 时，矩阵指数退化为单位矩阵：$e^{A \\cdot 0} = I$。`,
            `因此，$\\mathbf{x}(0) = I \\begin{pmatrix} ${x0} \\\\ ${y0} \\end{pmatrix} = \\begin{pmatrix} ${x0} \\\\ ${y0} \\end{pmatrix}$。`,
            `坐标之和为 $x_1(0) + x_2(0) = ${x0} + ${y0} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [x0 * y0, Math.abs(x0 - y0), ans + 1],
        });
      },
    },
  ],
};

/** solvingInhomogeneousSystemsOfOdesUsingMatrixMethods evaluates convolution integral. */
export const solvingInhomogeneousSystemsOfOdesUsingMatrixMethods: TopicDef = {
  id: "solving-inhomogeneous-systems-of-odes-using-matrix-methods",
  title: t("Solving Inhomogeneous Systems of ODEs Using Matrix Methods", "应用矩阵方法求解非齐次微分方程组"),
  summary: t(
    "The variation of parameters integral formula x(t) = e^{At} x_0 + ∫_0^t e^{A(t-s)} g(s) ds solves inhomogeneous linear systems.",
    "常数变易积分公式 x(t) = e^{At} x_0 + ∫_0^t e^{A(t-s)} g(s) ds 给出非齐次线性常微分方程组的通解表达式。",
  ),
  prerequisites: ["solving-homogeneous-systems-of-odes-using-matrix-methods"],
  encompasses: [
    {
      topic: "solving-homogeneous-systems-of-odes-using-matrix-methods",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "matrix-variation-of-parameters-formula",
      title: t("Initial rate of change of the convolution integral", "卷积特解在初始时刻的变化率"),
      explanation: t(
        "For $\\mathbf{x}_p(t) = \\int_0^t e^{A(t-s)}\\mathbf{g}(s)\\,ds$, differentiating by Leibniz's rule yields $\\mathbf{x}_p'(0) = \\mathbf{g}(0)$.",
        "对于卷积特解 $\\mathbf{x}_p(t) = \\int_0^t e^{A(t-s)}\\mathbf{g}(s)\\,ds$，根据含参变限积分莱布尼茨求导法则，在 $t = 0$ 处满足 $\\mathbf{x}_p'(0) = \\mathbf{g}(0)$。",
      ),
      generate(rng: Rng): Problem {
        const g1 = rng.int(2, 35);
        const ans = g1;

        const prompt = t(
          `Let $\\mathbf{x}_p(t) = \\int_0^t e^{A(t-s)} \\mathbf{g}(s)\\,ds$ be the particular solution to an inhomogeneous system with forcing $\\mathbf{g}(t) = \\begin{pmatrix} ${g1} \\\\ 4t \\end{pmatrix}$. Find the initial derivative $x_{p,1}'(0)$ of the first component.`,
          `设 $\\mathbf{x}_p(t) = \\int_0^t e^{A(t-s)} \\mathbf{g}(s)\\,ds$ 是外力激励为 $\\mathbf{g}(t) = \\begin{pmatrix} ${g1} \\\\ 4t \\end{pmatrix}$ 的非齐次系统的特解。求第一分量的初始导数值 $x_{p,1}'(0)$。`,
        );
        const solution = t(
          steps(
            `By Leibniz's integral rule, $\\frac{d}{dt}\\left[ \\int_0^t e^{A(t-s)}\\mathbf{g}(s)\\,ds \\right] = A \\mathbf{x}_p(t) + \\mathbf{g}(t)$.`,
            `Evaluate at $t = 0$: since $\\mathbf{x}_p(0) = \\mathbf{0}$, we have $\\mathbf{x}_p'(0) = \\mathbf{g}(0)$.`,
            `Substitute $t = 0$ into $\\mathbf{g}(t)$: $\\mathbf{g}(0) = \\begin{pmatrix} ${g1} \\\\ 0 \\end{pmatrix}$.`,
            `The first component is $x_{p,1}'(0) = ${ans}$.`,
          ),
          steps(
            `由变上限积分求导公式（莱布尼茨法则）：$\\frac{d}{dt}\\left[ \\int_0^t e^{A(t-s)}\\mathbf{g}(s)\\,ds \\right] = A \\mathbf{x}_p(t) + \\mathbf{g}(t)$。`,
            `在 $t = 0$ 处求值：因为 $\\mathbf{x}_p(0) = \\mathbf{0}$，所以 $\\mathbf{x}_p'(0) = \\mathbf{g}(0)$。`,
            `将 $t = 0$ 代入激励项：$\\mathbf{g}(0) = \\begin{pmatrix} ${g1} \\\\ 0 \\end{pmatrix}$。`,
            `因此第一分量导数为 $x_{p,1}'(0) = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [0, 4, 2 * g1],
        });
      },
    },
  ],
};

/** solvingSystemsOfOdesUsingVariationOfParameters solves Φ u' = g. */
export const solvingSystemsOfOdesUsingVariationOfParameters: TopicDef = {
  id: "solving-systems-of-odes-using-variation-of-parameters",
  title: t("Solving Systems of ODEs Using Variation of Parameters", "利用常数变易法求解微分方程组"),
  summary: t(
    "Setting x(t) = Φ(t) u(t) transforms the inhomogeneous system into Φ(t) u'(t) = g(t), solved algebraically for parameter derivatives u'(t) = Φ(t)^{-1} g(t).",
    "设 x(t) = Φ(t) u(t) 将非齐次方程组转化为代数线性方程组 Φ(t) u'(t) = g(t)，从而解出变易参数导数 u'(t) = Φ(t)^{-1} g(t)。",
  ),
  prerequisites: ["solving-inhomogeneous-systems-of-odes-using-matrix-methods"],
  encompasses: [
    {
      topic: "solving-inhomogeneous-systems-of-odes-using-matrix-methods",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "vector-variation-of-parameters-system",
      title: t("Parameter derivative vector in variation of parameters", "常数变易法中的参数导数向量"),
      explanation: t(
        "For $\\Phi(0) = I$, the parameter derivative at $t = 0$ is $\\mathbf{u}'(0) = \\Phi(0)^{-1}\\mathbf{g}(0) = \\mathbf{g}(0)$.",
        "当规范化基本解矩阵满足 $\\Phi(0) = I$ 时，在 $t = 0$ 处的参数导数向量为 $\\mathbf{u}'(0) = \\Phi(0)^{-1}\\mathbf{g}(0) = \\mathbf{g}(0)$。",
      ),
      generate(rng: Rng): Problem {
        const g2 = rng.int(2, 35);
        const ans = g2;

        const prompt = t(
          `In solving a system by variation of parameters $\\mathbf{x} = \\Phi(t)\\mathbf{u}$, the fundamental matrix satisfies $\\Phi(0) = I$ and the forcing vector is $\\mathbf{g}(t) = \\begin{pmatrix} 3e^t \\\\ ${g2} \\end{pmatrix}$. Find the second parameter derivative component $u_2'(0)$.`,
          `用常数变易法 $\\mathbf{x} = \\Phi(t)\\mathbf{u}$ 求解系统，已知基本矩阵满足 $\\Phi(0) = I$，激励向量为 $\\mathbf{g}(t) = \\begin{pmatrix} 3e^t \\\\ ${g2} \\end{pmatrix}$。求参数导数第二分量在 $t = 0$ 处的值 $u_2'(0)$。`,
        );
        const solution = t(
          steps(
            `The parameter derivative satisfies $\\Phi(t)\\mathbf{u}'(t) = \\mathbf{g}(t)$.`,
            `Evaluating at $t = 0$ with $\\Phi(0) = I$: $\\mathbf{u}'(0) = I^{-1}\\mathbf{g}(0) = \\mathbf{g}(0)$.`,
            `The second component of $\\mathbf{g}(0)$ is $g_2(0) = ${ans}$.`,
            `Therefore, $u_2'(0) = ${ans}$.`,
          ),
          steps(
            `常数变易参数导数满足线性代数方程组：$\\Phi(t)\\mathbf{u}'(t) = \\mathbf{g}(t)$。`,
            `代入 $t = 0$ 处的已知条件 $\\Phi(0) = I$：$\\mathbf{u}'(0) = I^{-1}\\mathbf{g}(0) = \\mathbf{g}(0)$。`,
            `激励向量第二分量为 $g_2(0) = ${ans}$。`,
            `因此，求得 $u_2'(0) = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [3, ans + 1, 0],
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.17 Modeling With Systems of Linear ODEs
// ---------------------------------------------------------------------------

/** theLotkaVolterraPredatorPreyModel finds coexistence equilibrium. */
export const theLotkaVolterraPredatorPreyModel: TopicDef = {
  id: "the-lotka-volterra-predator-prey-model",
  title: t("The Lotka-Volterra Predator-Prey Model", "洛特卡-沃尔泰拉捕食者-猎物模型"),
  summary: t(
    "The Lotka-Volterra model x' = α x - β x y, y' = -γ y + δ x y models interacting populations, having coexistence equilibrium (x_*, y_*) = (γ/δ, α/β).",
    "洛特卡-沃尔泰拉模型 x' = α x - β x y, y' = -γ y + δ x y 描述物种竞争捕食关系，其共存平衡点为 (x_*, y_*) = (γ/δ, α/β)。",
  ),
  prerequisites: ["linear-approximations-near-equilibria"],
  encompasses: [{ topic: "linear-approximations-near-equilibria", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "coexistence-equilibrium-in-predator-prey-systems",
      title: t("Prey equilibrium population in the Lotka-Volterra model", "洛特卡-沃尔泰拉模型中的猎物平衡种群数量"),
      explanation: t(
        "Setting predator growth rate to zero: $-\\gamma y + \\delta x y = 0 \\implies y(-\\gamma + \\delta x) = 0$. For non-zero predator population $y \\ne 0$, the equilibrium prey population is $x_* = \\frac{\\gamma}{\\delta}$.",
        "令捕食者变化率为零：$-\\gamma y + \\delta x y = 0 \\implies y(-\\gamma + \\delta x) = 0$。在两物种共存非零平衡态下，猎物平衡种群数量为 $x_* = \\frac{\\gamma}{\\delta}$。",
      ),
      generate(rng: Rng): Problem {
        const delta = rng.int(2, 6);
        const xStar = rng.int(10, 50);
        const gamma = delta * xStar;
        const ans = xStar;

        const prompt = t(
          `In a Lotka-Volterra predator-prey ecosystem, the predator population $y(t)$ satisfies $\\frac{dy}{dt} = -${gamma}y + ${delta}xy$, where $x(t)$ is the prey population. Find the equilibrium prey population $x_*$ required for the predator population to remain in dynamic balance.`,
          `在洛特卡-沃尔泰拉捕食者-猎物生态系统中，捕食者种群数量 $y(t)$ 满足方程 $\\frac{dy}{dt} = -${gamma}y + ${delta}xy$（$x(t)$ 为猎物数量）。求使得捕食者种群维持动态平衡的共存猎物种群数量 $x_*$。`,
        );
        const solution = t(
          steps(
            `For the predator population to be in equilibrium, set $\\frac{dy}{dt} = 0$.`,
            `Factor the differential equation: $y(-${gamma} + ${delta}x) = 0$.`,
            `Since the predator population is non-zero ($y \\ne 0$), we have $-${gamma} + ${delta}x = 0$.`,
            `Solve for $x$: $x_* = \\frac{${gamma}}{${delta}} = ${ans}$.`,
          ),
          steps(
            `要使捕食者种群处于平衡状态，令变化率 $\\frac{dy}{dt} = 0$。`,
            `对微分方程因式分解：$y(-${gamma} + ${delta}x) = 0$。`,
            `在两物种共存非灭绝情况下（$y \\ne 0$），有 $-${gamma} + ${delta}x = 0$。`,
            `解得猎物平衡数量：$x_* = \\frac{${gamma}}{${delta}} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [gamma, delta, ans + 5],
        });
      },
    },
  ],
};

/** theLotkaVolterraModelWithCarryingCapacity adds logistic prey limits. */
export const theLotkaVolterraModelWithCarryingCapacity: TopicDef = {
  id: "the-lotka-volterra-model-with-carrying-capacity",
  title: t("The Lotka-Volterra Model With Carrying Capacity", "带环境容纳量的洛特卡-沃尔泰拉模型"),
  summary: t(
    "Incorporating carrying capacity K into prey dynamics dx/dt = r x (1 - x/K) - β x y stabilizes the predator-prey system against unbounded growth.",
    "在猎物动力学中引入环境容纳量 K：dx/dt = r x (1 - x/K) - β x y，防止由于无限制指数增长带来的生态崩溃并增强系统稳定性。",
  ),
  prerequisites: ["the-lotka-volterra-predator-prey-model"],
  encompasses: [{ topic: "the-lotka-volterra-predator-prey-model", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "predator-prey-dynamics-with-logistic-prey-growth",
      title: t("Carrying capacity of prey in predator-prey systems", "捕食系统中猎物的环境容纳量"),
      explanation: t(
        "In the absence of predators ($y = 0$), prey dynamics reduce to logistic growth $\\frac{dx}{dt} = r x \\left(1 - \\frac{x}{K}\\right)$, converging to carrying capacity $x = K$.",
        "在没有捕食者（$y = 0$）的情况下，猎物种群演化退化为逻辑斯谛增长 $\\frac{dx}{dt} = r x \\left(1 - \\frac{x}{K}\\right)$，其极限稳态即为环境容纳量 $x = K$。",
      ),
      generate(rng: Rng): Problem {
        const K = rng.int(10, 80) * 10; // 100 to 800
        const r = rng.int(2, 8);
        const ans = K;

        const prompt = t(
          `In an ecosystem with logistic prey dynamics, prey population $x(t)$ in the absence of predators follows $\\frac{dx}{dt} = ${r}x \\left(1 - \\frac{x}{${K}}\\right)$. What is the carrying capacity $K$ of the prey population?`,
          `在具有逻辑斯谛猎物增长的生态系统中，当无捕食者存在时猎物种群满足 $\\frac{dx}{dt} = ${r}x \\left(1 - \\frac{x}{${K}}\\right)$。求猎物种群的环境容纳量 $K$。`,
        );
        const solution = t(
          steps(
            `In the logistic equation $\\frac{dx}{dt} = r x \\left(1 - \\frac{x}{K}\\right)$, the non-zero equilibrium occurs where $1 - \\frac{x}{K} = 0$.`,
            `Here $K = ${K}$, so the carrying capacity is $K = ${ans}$.`,
          ),
          steps(
            `在逻辑斯谛微分方程 $\\frac{dx}{dt} = r x \\left(1 - \\frac{x}{K}\\right)$ 中，非零稳态平衡点由 $1 - \\frac{x}{K} = 0$ 确定。`,
            `对比参数可知 $K = ${K}$，因此环境容纳量为 $K = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [K / 2, r * 100, ans + 50],
        });
      },
    },
  ],
};

/** differentialEquationsSystemsTopics gathers all 27 Unit 4 topics. */
export const differentialEquationsSystemsTopics: TopicDef[] = [
  introductionToSystemsOfLinearOdes,
  expressingHomogeneousOdesAsFirstOrderSystems,
  expressingInhomogeneousOdesAsFirstOrderSystems,
  linearIndependenceForHomogeneousSystemsOfOdes,
  generalSolutionsOfFirstOrderLinearSystemsOfOdes,
  solvingDecoupledHomogeneousSystemsOfOdes,
  solvingHomogeneousSystemsOfOdesWithDistinctEigenvalues,
  solvingHomogeneousSystemsOfOdesWithDistinctEigenvaluesAndInitialConditions,
  solvingHomogeneousSystemsOfOdesWithRepeatedEigenvalues,
  solvingHomogeneousSystemsOfOdesWithComplexEigenvalues,
  solvingInhomogeneousSystemsOfOdes,
  phasePlanesAndPhasePortraits,
  equilibriumPointsAndStabilityForSystemsOfOdes,
  phasePortraitsForDecoupledLinearSystems,
  phasePortraitsForLinearSystemsWithRealDistinctEigenvalues,
  phasePortraitsForLinearSystemsWithRepeatedEigenvalues,
  phasePortraitsForLinearSystemsWithZeroEigenvalues,
  phasePortraitsForLinearSystemsWithComplexEigenvalues,
  shiftedSystemsOfOdes,
  linearApproximationsNearEquilibria,
  matrixExponentials,
  fundamentalMatrices,
  solvingHomogeneousSystemsOfOdesUsingMatrixMethods,
  solvingInhomogeneousSystemsOfOdesUsingMatrixMethods,
  solvingSystemsOfOdesUsingVariationOfParameters,
  theLotkaVolterraPredatorPreyModel,
  theLotkaVolterraModelWithCarryingCapacity,
];
