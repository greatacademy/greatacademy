import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { choiceProblem, numberProblem, steps, yesNo } from "../problems.ts";

/** par wraps a negative number in parentheses for use as a factor. */
const par = (n: number): string => (n < 0 ? `(${n})` : String(n));

/** signed writes a number as a following term: "+ 3" or "- 3". */
const signed = (n: number): string => (n < 0 ? `- ${-n}` : `+ ${n}`);

/** mat writes a 2 by 2 matrix in LaTeX. */
const mat = (a: number | string, b: number | string, c: number | string, d: number | string): string =>
  `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;

/** vec writes a column vector with two entries in LaTeX. */
const vec = (p: number | string, q: number | string): string => `\\begin{pmatrix} ${p} \\\\ ${q} \\end{pmatrix}`;

/** ex writes the exponent kt, with "t" for k = 1 and "-t" for k = -1. */
const ex = (k: number): string => (k === 1 ? "t" : k === -1 ? "-t" : `${k}t`);

/** piLatex writes a positive rational multiple of pi: "\\frac{3\\pi}{4}". */
const piLatex = (v: Q): string => {
  const n = v.n === 1n ? "" : String(v.n);
  return v.isInteger() ? `${n}\\pi` : `\\frac{${n}\\pi}{${v.d}}`;
};

/** fromEigen builds the integer matrix with eigenvalues l1, l2 and eigenvectors (1, m1), (1, m2), where m2 - m1 is 1 or -1. */
function fromEigen(l1: number, l2: number, m1: number, m2: number): [number, number, number, number] {
  const det = m2 - m1;
  return [(l1 * m2 - l2 * m1) / det, (l2 - l1) / det, (m1 * m2 * (l1 - l2)) / det, (m2 * l2 - m1 * l1) / det];
}

// ---------------------------------------------------------------------------
// 4.13 Systems of ODEs
// ---------------------------------------------------------------------------

/** introductionToSystemsOfLinearOdes introduces the matrix form x' = A x. */
export const introductionToSystemsOfLinearOdes: TopicDef = {
  id: "introduction-to-systems-of-linear-odes",
  title: t("Introduction to Systems of Linear ODEs", "线性微分方程组简介"),
  summary: t(
    "A first-order linear system $x_1' = ax_1 + bx_2$, $x_2' = cx_1 + dx_2$ is written in matrix form as $\\mathbf{x}' = A\\mathbf{x}$ and characterized by the trace and determinant of $A$.",
    "一阶线性方程组 $x_1' = ax_1 + bx_2$，$x_2' = cx_1 + dx_2$ 可写成矩阵形式 $\\mathbf{x}' = A\\mathbf{x}$，由 $A$ 的迹与行列式刻画。",
  ),
  prerequisites: ["general-solutions-of-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "matrix-form-of-first-order-linear-systems",
      title: t("Trace of the coefficient matrix in a linear system", "线性系统系数矩阵的迹"),
      explanation: t(
        "A linear system collects the coefficients into a matrix, and the trace of that matrix equals the sum of its eigenvalues. For a $2 \\times 2$ system $\\mathbf{x}' = A \\mathbf{x}$ where $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, the trace is $\\operatorname{tr}(A) = a + d$.",
        "线性方程组把系数汇集成一个矩阵，这个矩阵的迹等于其特征值之和。对于二阶线性常微分方程组 $\\mathbf{x}' = A \\mathbf{x}$（系数矩阵 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$），其主对角线元素之和称为迹：$\\operatorname{tr}(A) = a + d$。",
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
    {
      id: "the-initial-velocity-of-a-linear-system",
      title: t("The initial velocity of a linear system", "线性方程组的初始速度"),
      explanation: t(
        "Reading the system as $\\mathbf{x}' = A\\mathbf{x}$ tells you the velocity at any state: multiply $A$ by the state vector. At $t = 0$,\n\n$$\\mathbf{x}'(0) = A\\mathbf{x}(0), \\qquad x_2'(0) = cx_1(0) + dx_2(0)$$\n\nfor $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$. Each row of $A$ gives one component, so use the second row for $x_2'$.",
        "把方程组看作 $\\mathbf{x}' = A\\mathbf{x}$，就能得到任意状态下的速度：用 $A$ 乘以状态向量。在 $t = 0$ 时，对 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$，\n\n$$\\mathbf{x}'(0) = A\\mathbf{x}(0), \\qquad x_2'(0) = cx_1(0) + dx_2(0).$$\n\n$A$ 的每一行给出一个分量，所以求 $x_2'$ 要用第二行。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c, d] = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6) || 2, rng.int(-6, 6)];
        const p = rng.int(-5, 5) || 1;
        const q = rng.int(-5, 5) || -2;
        const ans = c * p + d * q;
        return numberProblem({
          prompt: t(
            `$x_1' = ${poly([a, "x_1"], [b, "x_2"])}$, $x_2' = ${poly([c, "x_1"], [d, "x_2"])}$ with $x_1(0) = ${p}$ and $x_2(0) = ${q}$. Find $x_2'(0)$.`,
            `$x_1' = ${poly([a, "x_1"], [b, "x_2"])}$，$x_2' = ${poly([c, "x_1"], [d, "x_2"])}$，$x_1(0) = ${p}$，$x_2(0) = ${q}$。求 $x_2'(0)$。`,
          ),
          answer: ans,
          wrong: [a * p + b * q, c * q + d * p, c + d].filter((w) => w !== ans),
          solution: t(
            `$x_2'(0) = ${par(c)} \\cdot ${par(p)} + ${par(d)} \\cdot ${par(q)} = ${ans}$.`,
            `$x_2'(0) = ${par(c)} \\cdot ${par(p)} + ${par(d)} \\cdot ${par(q)} = ${ans}$。`,
          ),
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
    "With the state variables $x_1 = y$, $x_2 = y'$, the second-order ODE $y'' + py' + qy = 0$ becomes the first-order system $\\mathbf{x}' = A\\mathbf{x}$ with a companion matrix.",
    "取状态变量 $x_1 = y$，$x_2 = y'$，二阶方程 $y'' + py' + qy = 0$ 化为以友矩阵为系数的一阶系统 $\\mathbf{x}' = A\\mathbf{x}$。",
  ),
  prerequisites: ["introduction-to-systems-of-linear-odes"],
  encompasses: [{ topic: "introduction-to-systems-of-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "companion-matrix-of-scalar-homogeneous-odes",
      title: t("Companion matrix representation of a second-order ODE", "二阶常微分方程的友矩阵表示"),
      explanation: t(
        "Introducing the derivative as a second unknown turns one second order equation into a system of two first order equations. Setting $x_1 = y, x_2 = y'$ for $y'' + p y' + q y = 0$ yields $x_1' = x_2$ and $x_2' = -q x_1 - p x_2$. The determinant of the companion matrix is $\\det(A) = q$.",
        "把导数作为第二个未知函数引入，就把一个二阶方程化为两个一阶方程组成的方程组。对于方程 $y'' + p y' + q y = 0$，设 $x_1 = y, x_2 = y'$，得 $x_1' = x_2$ 且 $x_2' = -q x_1 - p x_2$。友矩阵 $\\begin{pmatrix} 0 & 1 \\\\ -q & -p \\end{pmatrix}$ 的行列式为 $\\det(A) = q$。",
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
    {
      id: "the-companion-matrix-of-a-third-order-equation",
      title: t("The companion matrix of a third-order equation", "三阶方程的伴随矩阵"),
      explanation: t(
        "For $y''' + ay'' + by' + cy = 0$, set $x_1 = y$, $x_2 = y'$, $x_3 = y''$. Then $x_1' = x_2$, $x_2' = x_3$ and $x_3' = -cx_1 - bx_2 - ax_3$, so\n\n$$A = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ -c & -b & -a \\end{pmatrix}.$$\n\nThe last row holds the coefficients with their signs changed, in the order $y, y', y''$.",
        "对 $y''' + ay'' + by' + cy = 0$，令 $x_1 = y$，$x_2 = y'$，$x_3 = y''$。则 $x_1' = x_2$，$x_2' = x_3$，$x_3' = -cx_1 - bx_2 - ax_3$，所以\n\n$$A = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ -c & -b & -a \\end{pmatrix}.$$\n\n最后一行是改变符号后的系数，按 $y, y', y''$ 的顺序排列。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-6, 9) || 2;
        const b = rng.int(-6, 9) || 3;
        const c = rng.int(-6, 9) || 5;
        const col = rng.int(1, 3);
        const ans = col === 1 ? -c : col === 2 ? -b : -a;
        return numberProblem({
          prompt: t(
            `Write $${poly([1, "y'''"], [a, "y''"], [b, "y'"], [c, "y"])} = 0$ as $\\mathbf{x}' = A\\mathbf{x}$ with $\\mathbf{x} = (y, y', y'')$. Find the entry $A_{3${col}}$.`,
            `把 $${poly([1, "y'''"], [a, "y''"], [b, "y'"], [c, "y"])} = 0$ 写成 $\\mathbf{x}' = A\\mathbf{x}$，其中 $\\mathbf{x} = (y, y', y'')$。求元素 $A_{3${col}}$。`,
          ),
          answer: ans,
          wrong: [-ans, col === 1 ? -a : -c, col === 2 ? -a : -b].filter((w) => w !== ans),
          solution: t(
            `$x_3' = y''' = ${poly([-c, "x_1"], [-b, "x_2"], [-a, "x_3"])}$, so the third row is $(${-c}, ${-b}, ${-a})$ and $A_{3${col}} = ${ans}$.`,
            `$x_3' = y''' = ${poly([-c, "x_1"], [-b, "x_2"], [-a, "x_3"])}$，所以第三行为 $(${-c}, ${-b}, ${-a})$，$A_{3${col}} = ${ans}$。`,
          ),
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
    "An inhomogeneous ODE $y'' + py' + qy = f(t)$ becomes $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}(t)$, where $\\mathbf{g}(t) = (0, f(t))^T$ carries the forcing.",
    "非齐次方程 $y'' + py' + qy = f(t)$ 化为 $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}(t)$，外力集中在 $\\mathbf{g}(t) = (0, f(t))^T$ 中。",
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
        "The forcing term of the original equation appears only in the equation for the highest derivative, so it occupies the last entry of the forcing vector. For $y'' + p y' + q y = K t^2$, state variables $x_1 = y, x_2 = y'$ yield $\\mathbf{x}' = A \\mathbf{x} + \\begin{pmatrix} 0 \\\\ K t^2 \\end{pmatrix}$. At $t = 2$, the second component is $4K$.",
        "原方程的强迫项只出现在最高阶导数的方程中，所以它位于强迫向量的最后一个分量。对于 $y'' + p y' + q y = K t^2$，转化为状态空间形式后外力激励向量为 $\\mathbf{g}(t) = \\begin{pmatrix} 0 \\\\ K t^2 \\end{pmatrix}$。在 $t = 2$ 处第二分量为 $4K$。",
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
    {
      id: "the-state-velocity-of-a-forced-equation",
      title: t("The state velocity of a forced equation", "受迫方程的状态速度"),
      explanation: t(
        "With $x_1 = y$ and $x_2 = y'$, the forced equation $y'' + py' + qy = g(t)$ becomes\n\n$$x_1' = x_2, \\qquad x_2' = -qx_1 - px_2 + g(t).$$\n\nThe forcing enters only the last equation, and it is evaluated at the same time as the state. So the velocity of $x_2$ at time $t_0$ uses $y(t_0)$, $y'(t_0)$ and $g(t_0)$ together.",
        "令 $x_1 = y$，$x_2 = y'$，受迫方程 $y'' + py' + qy = g(t)$ 化为\n\n$$x_1' = x_2, \\qquad x_2' = -qx_1 - px_2 + g(t).$$\n\n强迫项只出现在最后一个方程中，并且与状态在同一时刻取值。所以 $t_0$ 时刻 $x_2$ 的变化率要同时用到 $y(t_0)$、$y'(t_0)$ 和 $g(t_0)$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(-5, 6) || 2;
        const q = rng.int(-5, 8) || 3;
        const m = rng.int(-6, 6) || 4;
        const k = rng.int(-6, 6);
        const y1 = rng.int(-4, 4);
        const v1 = rng.int(-4, 4) || 1;
        const g = m + k;
        const ans = g - q * y1 - p * v1;
        return numberProblem({
          prompt: t(
            `Write $${poly([1, "y''"], [p, "y'"], [q, "y"])} = ${poly([m, "t"], [k, ""])}$ as a system with $x_1 = y$, $x_2 = y'$. If $y(1) = ${y1}$ and $y'(1) = ${v1}$, find $x_2'(1)$.`,
            `取 $x_1 = y$，$x_2 = y'$，把 $${poly([1, "y''"], [p, "y'"], [q, "y"])} = ${poly([m, "t"], [k, ""])}$ 写成方程组。若 $y(1) = ${y1}$，$y'(1) = ${v1}$，求 $x_2'(1)$。`,
          ),
          answer: ans,
          wrong: [-q * y1 - p * v1, g + q * y1 + p * v1, k - q * y1 - p * v1, v1],
          solution: t(
            steps(
              `The system is $x_1' = x_2$, $x_2' = ${poly([-q, "x_1"], [-p, "x_2"])} + g(t)$ with $g(t) = ${poly([m, "t"], [k, ""])}$.`,
              `At $t = 1$: $g(1) = ${g}$, so $x_2'(1) = ${-q} \\cdot ${par(y1)} ${signed(-p)} \\cdot ${par(v1)} + ${par(g)} = ${ans}$.`,
            ),
            steps(
              `方程组为 $x_1' = x_2$，$x_2' = ${poly([-q, "x_1"], [-p, "x_2"])} + g(t)$，其中 $g(t) = ${poly([m, "t"], [k, ""])}$。`,
              `在 $t = 1$ 时 $g(1) = ${g}$，所以 $x_2'(1) = ${-q} \\cdot ${par(y1)} ${signed(-p)} \\cdot ${par(v1)} + ${par(g)} = ${ans}$。`,
            ),
          ),
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
    "Vector solutions $\\mathbf{x}_1(t), \\mathbf{x}_2(t)$ are linearly independent if and only if their Wronskian $W(t) = \\det\\begin{pmatrix} \\mathbf{x}_1(t) & \\mathbf{x}_2(t) \\end{pmatrix}$ is non-zero.",
    "向量解 $\\mathbf{x}_1(t), \\mathbf{x}_2(t)$ 线性无关当且仅当其朗斯基行列式 $W(t) = \\det\\begin{pmatrix} \\mathbf{x}_1(t) & \\mathbf{x}_2(t) \\end{pmatrix}$ 不为零。",
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
        "For vector solutions the Wronskian is the determinant of the matrix whose columns are the solutions, and it tests whether they are independent. For $\\mathbf{x}_1(t) = \\begin{pmatrix} 1 \\\\ a \\end{pmatrix}e^{\\lambda_1 t}$ and $\\mathbf{x}_2(t) = \\begin{pmatrix} 1 \\\\ b \\end{pmatrix}e^{\\lambda_2 t}$, the Wronskian at $t = 0$ is $\\det \\begin{pmatrix} 1 & 1 \\\\ a & b \\end{pmatrix} = b - a$.",
        "对于向量解，朗斯基行列式是以这些解为列的矩阵的行列式，用来检验它们是否线性无关。对于向量解 $\\mathbf{x}_1(t) = \\begin{pmatrix} 1 \\\\ a \\end{pmatrix}e^{\\lambda_1 t}$ 与 $\\mathbf{x}_2(t) = \\begin{pmatrix} 1 \\\\ b \\end{pmatrix}e^{\\lambda_2 t}$，在 $t = 0$ 处的朗斯基行列式为 $\\det \\begin{pmatrix} 1 & 1 \\\\ a & b \\end{pmatrix} = b - a$。",
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
    {
      id: "the-growth-rate-of-the-wronskian",
      title: t("The growth rate of the Wronskian", "朗斯基行列式的增长率"),
      explanation: t(
        "Abel's formula says how the Wronskian of two solutions of $\\mathbf{x}' = A\\mathbf{x}$ changes in time without solving the system:\n\n$$W(t) = W(0)\\,e^{\\operatorname{tr}(A)\\,t}.$$\n\nThe exponential never vanishes, so the Wronskian is either zero for all $t$ or zero for no $t$. Solutions that are independent at one time stay independent, and the rate in the exponent is the trace, not the determinant.",
        "阿贝尔公式不用解方程组就说明了 $\\mathbf{x}' = A\\mathbf{x}$ 两个解的朗斯基行列式如何随时间变化：\n\n$$W(t) = W(0)\\,e^{\\operatorname{tr}(A)\\,t}.$$\n\n指数函数从不为零，所以朗斯基行列式要么恒为零，要么处处不为零。在某一时刻线性无关的解始终线性无关，指数中的速率是迹而不是行列式。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c, d] = [rng.int(-7, 7), rng.int(-7, 7) || 1, rng.int(-7, 7), rng.int(-7, 7)];
        const w0 = rng.int(2, 9);
        const ans = a + d;
        return numberProblem({
          prompt: t(
            `Two solutions of $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ have Wronskian $W(0) = ${w0}$. Then $W(t) = ${w0}e^{kt}$. Find $k$.`,
            `$\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ 的两个解满足 $W(0) = ${w0}$，于是 $W(t) = ${w0}e^{kt}$。求 $k$。`,
          ),
          answer: ans,
          wrong: [a * d - b * c, a - d, -ans, a * d],
          solution: t(
            `By Abel's formula the rate is the trace: $k = ${a} ${signed(d)} = ${ans}$.`,
            `由阿贝尔公式，速率等于迹：$k = ${a} ${signed(d)} = ${ans}$。`,
          ),
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
    "The general solution of $\\mathbf{x}' = A\\mathbf{x}$ is $\\mathbf{x}(t) = c_1 \\mathbf{x}_1(t) + c_2 \\mathbf{x}_2(t)$, and an initial condition $\\mathbf{x}(0) = \\mathbf{x}_0$ fixes the constants.",
    "$\\mathbf{x}' = A\\mathbf{x}$ 的通解为 $\\mathbf{x}(t) = c_1 \\mathbf{x}_1(t) + c_2 \\mathbf{x}_2(t)$，初值条件 $\\mathbf{x}(0) = \\mathbf{x}_0$ 唯一确定常数。",
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
        "When the solutions start at the standard unit vectors, the coefficients needed for any initial condition are simply the entries of the initial vector. If $\\mathbf{x}_1(0) = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ and $\\mathbf{x}_2(0) = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$, then $\\mathbf{x}(0) = \\begin{pmatrix} c_1 \\\\ c_2 \\end{pmatrix}$. For initial vector $\\begin{pmatrix} u_0 \\\\ v_0 \\end{pmatrix}$, the coefficients are $c_1 = u_0$ and $c_2 = v_0$.",
        "当各个解从标准单位向量出发时，任意初始条件所需的系数就是初始向量的各个分量。若规范化基本解在初值处满足 $\\mathbf{x}_1(0) = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ 且 $\\mathbf{x}_2(0) = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$，则任意初值 $\\begin{pmatrix} u_0 \\\\ v_0 \\end{pmatrix}$ 的组合系数直接为 $c_1 = u_0$ 与 $c_2 = v_0$。",
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
    {
      id: "fitting-the-general-solution-to-an-initial-state",
      title: t("Fitting the general solution to an initial state", "用初始状态确定通解"),
      explanation: t(
        "The general solution $\\mathbf{x}(t) = c_1 e^{\\lambda_1 t}\\mathbf{v}_1 + c_2 e^{\\lambda_2 t}\\mathbf{v}_2$ reduces at $t = 0$ to $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2 = \\mathbf{x}(0)$, because every exponential equals $1$ there. That is a linear system for the constants. With $\\mathbf{v}_1 = (1, m_1)$ and $\\mathbf{v}_2 = (1, m_2)$,\n\n$$c_1 + c_2 = x_1(0), \\qquad m_1c_1 + m_2c_2 = x_2(0).$$",
        "通解 $\\mathbf{x}(t) = c_1 e^{\\lambda_1 t}\\mathbf{v}_1 + c_2 e^{\\lambda_2 t}\\mathbf{v}_2$ 在 $t = 0$ 时化为 $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2 = \\mathbf{x}(0)$，因为那时每个指数都等于 $1$。这是关于常数的线性方程组。当 $\\mathbf{v}_1 = (1, m_1)$，$\\mathbf{v}_2 = (1, m_2)$ 时，\n\n$$c_1 + c_2 = x_1(0), \\qquad m_1c_1 + m_2c_2 = x_2(0).$$",
      ),
      generate(rng: Rng): Problem {
        const l1 = rng.int(-4, 4);
        const l2 = l1 + rng.int(1, 4);
        const m1 = rng.int(-4, 4);
        const m2 = m1 + rng.pick([-2, -1, 1, 2]);
        const c1 = rng.int(-5, 5) || 2;
        const c2 = rng.int(-5, 5) || -3;
        const p = c1 + c2;
        const q = m1 * c1 + m2 * c2;
        return numberProblem({
          prompt: t(
            `The general solution of a system is $\\mathbf{x}(t) = c_1 e^{${ex(l1)}}${vec(1, m1)} + c_2 e^{${ex(l2)}}${vec(1, m2)}$. Find $c_2$ for $\\mathbf{x}(0) = ${vec(p, q)}$.`,
            `某方程组的通解为 $\\mathbf{x}(t) = c_1 e^{${ex(l1)}}${vec(1, m1)} + c_2 e^{${ex(l2)}}${vec(1, m2)}$。当 $\\mathbf{x}(0) = ${vec(p, q)}$ 时求 $c_2$。`,
          ),
          answer: c2,
          wrong: [c1, -c2, q - p, p],
          solution: t(
            steps(
              `At $t = 0$: $c_1 + c_2 = ${p}$ and $${poly([m1, "c_1"], [m2, "c_2"])} = ${q}$.`,
              `Subtract $${par(m1)}$ times the first equation from the second: ${m2 - m1 === 1 ? `$c_2 = ${c2}$` : `$${poly([m2 - m1, "c_2"])} = ${q - m1 * p}$, so $c_2 = ${c2}$`}.`,
            ),
            steps(
              `在 $t = 0$ 时：$c_1 + c_2 = ${p}$，$${poly([m1, "c_1"], [m2, "c_2"])} = ${q}$。`,
              `用第二式减去第一式的 $${par(m1)}$ 倍：${m2 - m1 === 1 ? `$c_2 = ${c2}$` : `$${poly([m2 - m1, "c_2"])} = ${q - m1 * p}$，所以 $c_2 = ${c2}$`}。`,
            ),
          ),
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
    "A decoupled system $x_1' = \\lambda_1 x_1$, $x_2' = \\lambda_2 x_2$ is two independent equations with solutions $x_1 = c_1 e^{\\lambda_1 t}$, $x_2 = c_2 e^{\\lambda_2 t}$.",
    "解耦方程组 $x_1' = \\lambda_1 x_1$，$x_2' = \\lambda_2 x_2$ 是两个独立的方程，解为 $x_1 = c_1 e^{\\lambda_1 t}$，$x_2 = c_2 e^{\\lambda_2 t}$。",
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
        "In a decoupled system each equation involves only its own unknown, so each component grows or decays exponentially at its own rate. For decoupled equations $x_1' = \\lambda_1 x_1$, the initial derivative is $x_1'(0) = \\lambda_1 x_1(0)$.",
        "在解耦的方程组中，每个方程只含自己的未知函数，所以每个分量按各自的速率指数增长或衰减。在解耦系统 $x_1' = \\lambda_1 x_1$ 中，初始演化速度直接由 $x_1'(0) = \\lambda_1 x_1(0)$ 计算得到。",
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
    {
      id: "evaluating-a-decoupled-solution",
      title: t("Evaluating a decoupled solution", "求解耦方程组的解在某时刻的值"),
      explanation: t(
        "In a decoupled system each equation involves one unknown, so each solves on its own: $x_1' = ax_1$ gives $x_1 = x_1(0)e^{at}$ and $x_2' = bx_2$ gives $x_2 = x_2(0)e^{bt}$. At $t = \\ln 2$ the exponentials become powers of two, since\n\n$$e^{a\\ln 2} = 2^a.$$\n\nA negative rate gives a fraction such as $2^{-2} = \\tfrac{1}{4}$.",
        "在解耦方程组中，每个方程只含一个未知函数，因此可以分别求解：$x_1' = ax_1$ 得 $x_1 = x_1(0)e^{at}$，$x_2' = bx_2$ 得 $x_2 = x_2(0)e^{bt}$。在 $t = \\ln 2$ 时指数变成 $2$ 的幂，因为\n\n$$e^{a\\ln 2} = 2^a.$$\n\n负的速率给出分数，例如 $2^{-2} = \\tfrac{1}{4}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 3) || 2;
        const b = rng.int(-3, 3) || -1;
        const p = rng.int(-6, 6) || 3;
        const q = rng.int(-6, 6) || 5;
        const two = Q.of(2);
        const ans = Q.of(p)
          .mul(two.pow(a))
          .add(Q.of(q).mul(two.pow(b)));
        return numberProblem({
          prompt: t(
            `Solve $x_1' = ${poly([a, "x_1"])}$, $x_2' = ${poly([b, "x_2"])}$ with $x_1(0) = ${p}$, $x_2(0) = ${q}$, and find $x_1(\\ln 2) + x_2(\\ln 2)$.`,
            `解 $x_1' = ${poly([a, "x_1"])}$，$x_2' = ${poly([b, "x_2"])}$，$x_1(0) = ${p}$，$x_2(0) = ${q}$，并求 $x_1(\\ln 2) + x_2(\\ln 2)$。`,
          ),
          answer: ans,
          wrong: [
            Q.of(p * a + q * b),
            Q.of(p)
              .mul(two.pow(-a))
              .add(Q.of(q).mul(two.pow(-b))),
            Q.of(p + q),
            Q.of(p)
              .mul(two.pow(b))
              .add(Q.of(q).mul(two.pow(a))),
          ],
          solution: t(
            `$x_1 = ${poly([p, `e^{${ex(a)}}`])}$ and $x_2 = ${poly([q, `e^{${ex(b)}}`])}$. At $t = \\ln 2$: $${p} \\cdot 2^{${a}} + ${par(q)} \\cdot 2^{${b}} = ${ans.toLatex()}$.`,
            `$x_1 = ${poly([p, `e^{${ex(a)}}`])}$，$x_2 = ${poly([q, `e^{${ex(b)}}`])}$。在 $t = \\ln 2$ 时：$${p} \\cdot 2^{${a}} + ${par(q)} \\cdot 2^{${b}} = ${ans.toLatex()}$。`,
          ),
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
    "When $A$ has distinct real eigenvalues $\\lambda_1 \\ne \\lambda_2$ with eigenvectors $\\mathbf{v}_1, \\mathbf{v}_2$, the general solution is $\\mathbf{x}(t) = c_1 e^{\\lambda_1 t}\\mathbf{v}_1 + c_2 e^{\\lambda_2 t}\\mathbf{v}_2$.",
    "当 $A$ 有互异实特征值 $\\lambda_1 \\ne \\lambda_2$ 及特征向量 $\\mathbf{v}_1, \\mathbf{v}_2$ 时，通解为 $\\mathbf{x}(t) = c_1 e^{\\lambda_1 t}\\mathbf{v}_1 + c_2 e^{\\lambda_2 t}\\mathbf{v}_2$。",
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
        "The eigenvalues of a triangular matrix are its diagonal entries, and each eigenvalue with its eigenvector gives an exponential solution of the system. For a triangular matrix $A = \\begin{pmatrix} a & 0 \\\\ c & d \\end{pmatrix}$, the eigenvalues are the diagonal entries $\\lambda = a$ and $\\lambda = d$.",
        "三角矩阵的特征值就是它的对角元素，每个特征值及其特征向量给出方程组的一个指数解。对于下三角矩阵 $A = \\begin{pmatrix} a & 0 \\\\ c & d \\end{pmatrix}$，特征值即为其主对角线上的元素 $\\lambda = a$ 与 $\\lambda = d$。",
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
    {
      id: "finding-an-eigenvector-of-the-coefficient-matrix",
      title: t("Finding an eigenvector of the coefficient matrix", "求系数矩阵的特征向量"),
      explanation: t(
        "Each eigenvalue $\\lambda$ of $A$ gives a solution $e^{\\lambda t}\\mathbf{v}$, where $\\mathbf{v}$ solves $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$. Because $A - \\lambda I$ is singular, its two rows are proportional and one row is enough. Writing $\\mathbf{v} = (1, m)$, the first row of $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ gives\n\n$$(a - \\lambda) + bm = 0, \\qquad m = \\frac{\\lambda - a}{b}.$$",
        "$A$ 的每个特征值 $\\lambda$ 给出一个解 $e^{\\lambda t}\\mathbf{v}$，其中 $\\mathbf{v}$ 满足 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$。由于 $A - \\lambda I$ 奇异，它的两行成比例，只用一行就够了。设 $\\mathbf{v} = (1, m)$，由 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 的第一行得\n\n$$(a - \\lambda) + bm = 0, \\qquad m = \\frac{\\lambda - a}{b}.$$",
      ),
      generate(rng: Rng): Problem {
        const l1 = rng.int(-5, 5);
        const l2 = l1 + rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const m1 = rng.int(-4, 4);
        const m2 = m1 + rng.pick([-1, 1]);
        const [a, b, c, d] = fromEigen(l1, l2, m1, m2);
        return numberProblem({
          prompt: t(
            `One eigenvalue of $A = ${mat(a, b, c, d)}$ is $\\lambda = ${l1}$. Find $m$ so that $${vec(1, "m")}$ is an eigenvector for it, giving the solution $e^{${ex(l1)}}${vec(1, "m")}$ of $\\mathbf{x}' = A\\mathbf{x}$.`,
            `$A = ${mat(a, b, c, d)}$ 的一个特征值为 $\\lambda = ${l1}$。求 $m$，使 $${vec(1, "m")}$ 是对应的特征向量，从而 $e^{${ex(l1)}}${vec(1, "m")}$ 是 $\\mathbf{x}' = A\\mathbf{x}$ 的解。`,
          ),
          answer: m1,
          wrong: [m2, -m1, l1 - a, l2],
          solution: t(
            `The first row of $A - ${par(l1)}I$ is $(${a - l1}, ${b})$, so $${poly([a - l1, ""], [b, "m"])} = 0$ and $m = ${m1}$.`,
            `$A - ${par(l1)}I$ 的第一行为 $(${a - l1}, ${b})$，所以 $${poly([a - l1, ""], [b, "m"])} = 0$，$m = ${m1}$。`,
          ),
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
    "For $\\mathbf{x}' = A\\mathbf{x}$ with $\\mathbf{x}(0) = \\mathbf{x}_0$, find the constants by solving $c_1 \\mathbf{v}_1 + c_2 \\mathbf{v}_2 = \\mathbf{x}_0$.",
    "对 $\\mathbf{x}' = A\\mathbf{x}$，$\\mathbf{x}(0) = \\mathbf{x}_0$，通过解 $c_1 \\mathbf{v}_1 + c_2 \\mathbf{v}_2 = \\mathbf{x}_0$ 确定常数。",
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
        "The system itself gives the derivative at the start: multiply the coefficient matrix by the initial vector. For $\\mathbf{x}' = A \\mathbf{x}$, the initial derivative vector is $\\mathbf{x}'(0) = A \\mathbf{x}(0)$.",
        "方程组本身给出了初始时刻的导数：用系数矩阵乘以初始向量。对于系统 $\\mathbf{x}' = A \\mathbf{x}$，初值处的演化导数向量为 $\\mathbf{x}'(0) = A \\mathbf{x}(0)$。",
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
    {
      id: "the-long-run-direction-of-a-solution",
      title: t("The long-run direction of a solution", "解的长期方向"),
      explanation: t(
        "For $\\mathbf{x}(t) = c_1e^{\\lambda_1 t}\\mathbf{v}_1 + c_2e^{\\lambda_2 t}\\mathbf{v}_2$ with $\\lambda_1 > \\lambda_2$, the term with the larger eigenvalue dominates as $t \\to \\infty$ whenever $c_1 \\ne 0$. The ratio $x_2/x_1$ then tends to the slope of $\\mathbf{v}_1$. If the initial state lies on the line of $\\mathbf{v}_2$, then $c_1 = 0$ and the solution keeps the direction of $\\mathbf{v}_2$ forever. So find the constants from $\\mathbf{x}(0)$ before deciding.",
        "对 $\\mathbf{x}(t) = c_1e^{\\lambda_1 t}\\mathbf{v}_1 + c_2e^{\\lambda_2 t}\\mathbf{v}_2$（$\\lambda_1 > \\lambda_2$），只要 $c_1 \\ne 0$，当 $t \\to \\infty$ 时含较大特征值的项占主导，比值 $x_2/x_1$ 趋于 $\\mathbf{v}_1$ 的斜率。若初始状态落在 $\\mathbf{v}_2$ 所在直线上，则 $c_1 = 0$，解始终保持 $\\mathbf{v}_2$ 的方向。所以先由 $\\mathbf{x}(0)$ 求出常数再下结论。",
      ),
      generate(rng: Rng): Problem {
        const l2 = rng.int(-5, 2);
        const l1 = l2 + rng.int(1, 4);
        const m1 = rng.int(-4, 4);
        const m2 = m1 + rng.pick([-1, 1]);
        const [a, b, c, d] = fromEigen(l1, l2, m1, m2);
        const c1 = rng.pick([0, 1, 2, -1, -2, 3]);
        const c2 = rng.pick([1, 2, -1, -3]);
        const p = c1 + c2;
        const q = m1 * c1 + m2 * c2;
        const ans = c1 === 0 ? m2 : m1;
        return numberProblem({
          prompt: t(
            `Solve $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ with $\\mathbf{x}(0) = ${vec(p, q)}$. Find $\\lim_{t \\to \\infty} \\frac{x_2(t)}{x_1(t)}$.`,
            `解 $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$，$\\mathbf{x}(0) = ${vec(p, q)}$。求 $\\lim_{t \\to \\infty} \\frac{x_2(t)}{x_1(t)}$。`,
          ),
          answer: ans,
          wrong: [c1 === 0 ? m1 : m2, l1, ...(p === 0 ? [] : [Q.of(q, p)])],
          solution: t(
            steps(
              `The eigenvalues are $${l1}$ and $${l2}$ with eigenvectors $${vec(1, m1)}$ and $${vec(1, m2)}$.`,
              `From $c_1 + c_2 = ${p}$ and $${poly([m1, "c_1"], [m2, "c_2"])} = ${q}$: $c_1 = ${c1}$, $c_2 = ${c2}$.`,
              c1 === 0
                ? `Since $c_1 = 0$, the solution stays on the line of $${vec(1, m2)}$ and the ratio is $${m2}$.`
                : `Since $c_1 \\ne 0$, the term $e^{${ex(l1)}}$ dominates and the ratio tends to $${m1}$.`,
            ),
            steps(
              `特征值为 $${l1}$ 与 $${l2}$，特征向量为 $${vec(1, m1)}$ 与 $${vec(1, m2)}$。`,
              `由 $c_1 + c_2 = ${p}$ 与 $${poly([m1, "c_1"], [m2, "c_2"])} = ${q}$ 得 $c_1 = ${c1}$，$c_2 = ${c2}$。`,
              c1 === 0
                ? `因为 $c_1 = 0$，解始终在 $${vec(1, m2)}$ 所在直线上，比值为 $${m2}$。`
                : `因为 $c_1 \\ne 0$，$e^{${ex(l1)}}$ 项占主导，比值趋于 $${m1}$。`,
            ),
          ),
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
    "When $A$ has a repeated eigenvalue $\\lambda$ with only one eigenvector $\\mathbf{v}$, a generalized eigenvector $\\mathbf{w}$ with $(A - \\lambda I)\\mathbf{w} = \\mathbf{v}$ gives $\\mathbf{x}(t) = e^{\\lambda t}(c_1 \\mathbf{v} + c_2(t\\mathbf{v} + \\mathbf{w}))$.",
    "当 $A$ 有二重特征值 $\\lambda$ 且只有一个特征向量 $\\mathbf{v}$ 时，取满足 $(A - \\lambda I)\\mathbf{w} = \\mathbf{v}$ 的广义特征向量 $\\mathbf{w}$，得 $\\mathbf{x}(t) = e^{\\lambda t}(c_1 \\mathbf{v} + c_2(t\\mathbf{v} + \\mathbf{w}))$。",
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
        "When a matrix lacks enough eigenvectors, a generalized eigenvector provides a second solution that includes a factor of time. For a Jordan block $A = \\begin{pmatrix} \\lambda & k \\\\ 0 & \\lambda \\end{pmatrix}$, $(A - \\lambda I) = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$. If the eigenvector is $\\mathbf{v} = \\begin{pmatrix} k \\\\ 0 \\end{pmatrix}$, then $\\mathbf{w} = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$ satisfies $(A - \\lambda I)\\mathbf{w} = \\mathbf{v}$.",
        "当矩阵的特征向量不够时，广义特征向量提供了含有时间因子的第二个解。对于若尔当块矩阵 $A = \\begin{pmatrix} \\lambda & k \\\\ 0 & \\lambda \\end{pmatrix}$，有 $(A - \\lambda I) = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$。若特征向量为 $\\mathbf{v} = \\begin{pmatrix} k \\\\ 0 \\end{pmatrix}$，则广义特征向量 $\\mathbf{w} = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$ 满足 $(A - \\lambda I)\\mathbf{w} = \\mathbf{v}$。",
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
    {
      id: "the-secular-term-of-a-defective-system",
      title: t("The secular term of a defective system", "亏损方程组的长期项"),
      explanation: t(
        "When $A$ has a repeated eigenvalue $\\lambda = \\tfrac{1}{2}\\operatorname{tr}(A)$ but only one eigenvector, the matrix $N = A - \\lambda I$ satisfies $N^2 = 0$. Then $e^{At} = e^{\\lambda t}(I + tN)$, so\n\n$$\\mathbf{x}(t) = e^{\\lambda t}\\big(\\mathbf{x}(0) + t\\,\\mathbf{w}\\big), \\qquad \\mathbf{w} = (A - \\lambda I)\\mathbf{x}(0).$$\n\nThe vector $\\mathbf{w}$ multiplies the extra factor $t$ that appears only in the repeated case.",
        "当 $A$ 有重特征值 $\\lambda = \\tfrac{1}{2}\\operatorname{tr}(A)$ 而只有一个特征向量时，矩阵 $N = A - \\lambda I$ 满足 $N^2 = 0$。于是 $e^{At} = e^{\\lambda t}(I + tN)$，从而\n\n$$\\mathbf{x}(t) = e^{\\lambda t}\\big(\\mathbf{x}(0) + t\\,\\mathbf{w}\\big), \\qquad \\mathbf{w} = (A - \\lambda I)\\mathbf{x}(0).$$\n\n向量 $\\mathbf{w}$ 乘的是只在重根情形出现的额外因子 $t$。",
      ),
      generate(rng: Rng): Problem {
        const l = rng.int(-4, 4);
        const u = rng.int(-2, 2) || 1;
        const v = rng.pick([-2, -1, 1, 2]);
        const [n11, n12, n21, n22] = [u * v, -u * u, v * v, -u * v];
        const p = rng.int(-4, 4) || 2;
        const q = rng.int(-4, 4) || -1;
        const comp = rng.int(1, 2);
        const w1 = n11 * p + n12 * q;
        const w2 = n21 * p + n22 * q;
        const ans = comp === 1 ? w1 : w2;
        const [a, b, c, d] = [l + n11, n12, n21, l + n22];
        return numberProblem({
          prompt: t(
            `The matrix $A = ${mat(a, b, c, d)}$ has a repeated eigenvalue. The solution of $\\mathbf{x}' = A\\mathbf{x}$ with $\\mathbf{x}(0) = ${vec(p, q)}$ has the form $e^{\\lambda t}(\\mathbf{x}(0) + t\\mathbf{w})$. Find $w_${comp}$.`,
            `矩阵 $A = ${mat(a, b, c, d)}$ 有重特征值。$\\mathbf{x}' = A\\mathbf{x}$ 满足 $\\mathbf{x}(0) = ${vec(p, q)}$ 的解形如 $e^{\\lambda t}(\\mathbf{x}(0) + t\\mathbf{w})$。求 $w_${comp}$。`,
          ),
          answer: ans,
          wrong: [comp === 1 ? a * p + b * q : c * p + d * q, -ans, comp === 1 ? w2 : w1],
          solution: t(
            steps(
              `$\\lambda = \\tfrac{1}{2}\\operatorname{tr}(A) = ${l}$, so $A - ${par(l)}I = ${mat(n11, n12, n21, n22)}$.`,
              `$\\mathbf{w} = ${mat(n11, n12, n21, n22)}${vec(p, q)} = ${vec(w1, w2)}$, so $w_${comp} = ${ans}$.`,
            ),
            steps(
              `$\\lambda = \\tfrac{1}{2}\\operatorname{tr}(A) = ${l}$，所以 $A - ${par(l)}I = ${mat(n11, n12, n21, n22)}$。`,
              `$\\mathbf{w} = ${mat(n11, n12, n21, n22)}${vec(p, q)} = ${vec(w1, w2)}$，所以 $w_${comp} = ${ans}$。`,
            ),
          ),
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
    "Complex eigenvalues $\\alpha \\pm i\\beta$ give spiraling solutions with angular frequency $\\beta$ inside the envelope $e^{\\alpha t}$.",
    "共轭复特征值 $\\alpha \\pm i\\beta$ 给出角频率为 $\\beta$、包络为 $e^{\\alpha t}$ 的螺旋解。",
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
        "A pair of complex eigenvalues produces rotating solutions, with the real part controlling growth and the imaginary part setting the angular frequency. For $A = \\begin{pmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{pmatrix}$, the characteristic roots are $\\lambda = \\alpha \\pm i\\beta$, producing trajectories oscillating with angular speed $\\beta$.",
        "一对复特征值产生旋转的解，实部控制增长，虚部决定角频率。对于标准旋转伸缩矩阵 $A = \\begin{pmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{pmatrix}$，其特征值为 $\\lambda = \\alpha \\pm i\\beta$，轨迹具有旋转角频率 $\\beta$。",
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
    {
      id: "the-frequency-of-a-general-oscillating-system",
      title: t("The frequency of a general oscillating system", "一般振荡方程组的频率"),
      explanation: t(
        "The eigenvalues of a $2 \\times 2$ matrix are $\\lambda = \\alpha \\pm \\beta i$ with\n\n$$\\alpha = \\tfrac{1}{2}\\operatorname{tr}(A), \\qquad \\beta^2 = \\det(A) - \\alpha^2,$$\n\nwhenever the right side of the second formula is positive. The real solutions are then $e^{\\alpha t}$ times combinations of $\\cos \\beta t$ and $\\sin \\beta t$. The frequency comes from both the trace and the determinant, not from an off-diagonal entry alone.",
        "$2 \\times 2$ 矩阵的特征值为 $\\lambda = \\alpha \\pm \\beta i$，其中\n\n$$\\alpha = \\tfrac{1}{2}\\operatorname{tr}(A), \\qquad \\beta^2 = \\det(A) - \\alpha^2,$$\n\n前提是第二个式子右边为正。此时实解是 $e^{\\alpha t}$ 乘以 $\\cos \\beta t$ 与 $\\sin \\beta t$ 的组合。频率同时由迹和行列式决定，而不是仅由某个非对角元素决定。",
      ),
      generate(rng: Rng): Problem {
        const al = rng.int(-3, 3);
        const be = rng.int(1, 5);
        const u = rng.int(-3, 3);
        const n = u * u + be * be;
        const divs = Array.from({ length: n }, (_, i) => i + 1).filter((k) => n % k === 0);
        const v = rng.pick(divs) * rng.pick([-1, 1]);
        const w = n / v;
        const [a, b, c, d] = [al + u, -v, w, al - u];
        return numberProblem({
          prompt: t(
            `The real solutions of $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ are $e^{\\alpha t}$ times combinations of $\\cos \\beta t$ and $\\sin \\beta t$ with $\\beta > 0$. Find $\\beta$.`,
            `$\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ 的实解是 $e^{\\alpha t}$ 乘以 $\\cos \\beta t$ 与 $\\sin \\beta t$ 的组合，其中 $\\beta > 0$。求 $\\beta$。`,
          ),
          answer: be,
          wrong: [be * be, Math.abs(v), al, a * d - b * c],
          solution: t(
            steps(
              `$\\operatorname{tr}(A) = ${2 * al}$ and $\\det(A) = ${a * d - b * c}$, so $\\alpha = ${al}$.`,
              `$\\beta^2 = ${a * d - b * c} - ${par(al)}^2 = ${be * be}$, so $\\beta = ${be}$.`,
            ),
            steps(
              `$\\operatorname{tr}(A) = ${2 * al}$，$\\det(A) = ${a * d - b * c}$，所以 $\\alpha = ${al}$。`,
              `$\\beta^2 = ${a * d - b * c} - ${par(al)}^2 = ${be * be}$，所以 $\\beta = ${be}$。`,
            ),
          ),
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
    "For $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{b}$ with a constant vector $\\mathbf{b}$ and invertible $A$, the constant particular solution is $\\mathbf{x}_p = -A^{-1}\\mathbf{b}$.",
    "对常向量激励 $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{b}$ 且 $A$ 可逆，常数特解为 $\\mathbf{x}_p = -A^{-1}\\mathbf{b}$。",
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
        "With constant forcing, try a constant particular solution; setting the derivative to zero leaves a linear system for the steady state. For $\\mathbf{x}' = A \\mathbf{x} + \\mathbf{b}$ where $A = \\operatorname{diag}(a, d)$, setting $\\mathbf{x}_p = \\mathbf{c}$ gives $A \\mathbf{c} + \\mathbf{b} = \\mathbf{0} \\implies c_1 = -b_1 / a$.",
        "当强迫项是常数时，试探常数特解；令导数为零，就得到关于稳态的线性方程组。对于对角系统 $\\mathbf{x}' = A \\mathbf{x} + \\mathbf{b}$，设常数特解 $\\mathbf{x}_p = \\mathbf{c}$，代入平衡条件 $A \\mathbf{c} + \\mathbf{b} = \\mathbf{0}$，得第一分量为 $c_1 = -b_1 / a$。",
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
    {
      id: "the-equilibrium-of-a-coupled-forced-system",
      title: t("The equilibrium of a coupled forced system", "耦合受迫方程组的平衡解"),
      explanation: t(
        "For $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{b}$ with a constant vector $\\mathbf{b}$, a constant particular solution $\\mathbf{x}_p$ must have zero derivative, so\n\n$$A\\mathbf{x}_p + \\mathbf{b} = \\mathbf{0}, \\qquad \\mathbf{x}_p = -A^{-1}\\mathbf{b}.$$\n\nWhen the system is coupled this is a genuine linear system: solve both equations together rather than dividing each forcing term by a diagonal entry.",
        "对 $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{b}$（$\\mathbf{b}$ 为常向量），常数特解 $\\mathbf{x}_p$ 的导数为零，所以\n\n$$A\\mathbf{x}_p + \\mathbf{b} = \\mathbf{0}, \\qquad \\mathbf{x}_p = -A^{-1}\\mathbf{b}.$$\n\n方程组耦合时这是一个真正的线性方程组：要把两个方程联立求解，而不是把各强迫项分别除以对角元素。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c, d] = rng.pick([
          [2, 1, 1, 1],
          [-3, 1, 2, -1],
          [1, 2, 1, 3],
          [-2, 3, 1, -2],
          [3, 2, 1, 1],
          [-1, -2, 1, 1],
        ] as const);
        const x = rng.int(-5, 5);
        const y = rng.int(-5, 5) || 2;
        const b1 = -(a * x + b * y);
        const b2 = -(c * x + d * y);
        const comp = rng.int(1, 2);
        const ans = comp === 1 ? x : y;
        return numberProblem({
          prompt: t(
            `Find the constant solution of $x_1' = ${poly([a, "x_1"], [b, "x_2"], [b1, ""])}$, $x_2' = ${poly([c, "x_1"], [d, "x_2"], [b2, ""])}$ and give its component $x_${comp}$.`,
            `求 $x_1' = ${poly([a, "x_1"], [b, "x_2"], [b1, ""])}$，$x_2' = ${poly([c, "x_1"], [d, "x_2"], [b2, ""])}$ 的常数解，并给出分量 $x_${comp}$。`,
          ),
          answer: ans,
          wrong: [comp === 1 ? y : x, -ans, comp === 1 ? Q.of(-b1, a) : Q.of(-b2, d)],
          solution: t(
            `Set both right sides to zero: $${poly([a, "x_1"], [b, "x_2"])} = ${-b1}$ and $${poly([c, "x_1"], [d, "x_2"])} = ${-b2}$. Solving gives $x_1 = ${x}$, $x_2 = ${y}$.`,
            `令两个右端为零：$${poly([a, "x_1"], [b, "x_2"])} = ${-b1}$，$${poly([c, "x_1"], [d, "x_2"])} = ${-b2}$。解得 $x_1 = ${x}$，$x_2 = ${y}$。`,
          ),
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
        "A phase trajectory hides time and shows only the path, and its slope is the ratio of the vertical rate to the horizontal rate. The slope of a phase trajectory is $\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}$. For $x' = a x$ and $y' = b y$, $\\frac{dy}{dx} = \\frac{b y}{a x}$.",
        "相轨线隐去了时间，只显示路径，它的斜率是竖直变化率与水平变化率之比。相轨迹的斜率由链式法则给出：$\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}$。对于系统 $x' = a x, y' = b y$，切线斜率为 $\\frac{dy}{dx} = \\frac{b y}{a x}$。",
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
    {
      id: "the-conserved-quantity-along-a-trajectory",
      title: t("The conserved quantity along a trajectory", "沿轨线守恒的量"),
      explanation: t(
        "Dividing $y' = -kx$ by $x' = y$ removes time and gives the trajectory equation $\\frac{dy}{dx} = -\\frac{kx}{y}$. Separating, $y\\,dy = -kx\\,dx$, so\n\n$$kx^2 + y^2 = C$$\n\nstays constant along each trajectory. The trajectories are ellipses around the origin, and the starting point fixes which ellipse: substitute it to find $C$.",
        "用 $y' = -kx$ 除以 $x' = y$ 消去时间，得到轨线方程 $\\frac{dy}{dx} = -\\frac{kx}{y}$。分离变量，$y\\,dy = -kx\\,dx$，所以\n\n$$kx^2 + y^2 = C$$\n\n沿每条轨线保持不变。轨线是绕原点的椭圆，起点决定是哪一个椭圆：代入起点求出 $C$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 9);
        const p = rng.int(-5, 5) || 1;
        const q = rng.int(-5, 5);
        const ans = k * p * p + q * q;
        return numberProblem({
          prompt: t(
            `The trajectory of $x' = y$, $y' = -${k}x$ through $(${p}, ${q})$ is $${k}x^2 + y^2 = C$. Find $C$.`,
            `$x' = y$，$y' = -${k}x$ 过点 $(${p}, ${q})$ 的轨线为 $${k}x^2 + y^2 = C$。求 $C$。`,
          ),
          answer: ans,
          wrong: [p * p + q * q, k * p * p - q * q, k * p + q, p * p + k * q * q],
          solution: t(`$C = ${k} \\cdot ${par(p)}^2 + ${par(q)}^2 = ${ans}$.`, `$C = ${k} \\cdot ${par(p)}^2 + ${par(q)}^2 = ${ans}$。`),
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
    "Equilibrium points satisfy $A\\mathbf{x}_0 = \\mathbf{0}$. When $\\det A \\ne 0$, the origin is the only equilibrium, classified by the trace and determinant.",
    "平衡点满足 $A\\mathbf{x}_0 = \\mathbf{0}$。当 $\\det A \\ne 0$ 时，原点是唯一的平衡点，其类型由迹与行列式确定。",
  ),
  prerequisites: ["phase-planes-and-phase-portraits"],
  encompasses: [{ topic: "phase-planes-and-phase-portraits", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "classification-of-isolated-critical-points",
      title: t("Determinant test for isolated critical points", "孤立平衡点的行列式判定准则"),
      explanation: t(
        "The origin is the only equilibrium of a linear system exactly when the matrix is invertible, that is, when its determinant is not zero. A linear system $A \\mathbf{x} = \\mathbf{0}$ has an isolated critical point at the origin if and only if $\\det(A) \\ne 0$.",
        "线性方程组只有原点一个平衡点，当且仅当矩阵可逆，也就是行列式不为零。线性系统 $A \\mathbf{x} = \\mathbf{0}$ 在原点具有孤立平衡点当且仅当系数矩阵行列式 $\\det(A) \\ne 0$。",
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
    {
      id: "deciding-asymptotic-stability-from-trace-and-determinant",
      title: t("Deciding asymptotic stability from trace and determinant", "由迹和行列式判断渐近稳定性"),
      explanation: t(
        "The origin of $\\mathbf{x}' = A\\mathbf{x}$ is asymptotically stable exactly when both eigenvalues have negative real parts. For a $2 \\times 2$ matrix that is equivalent to\n\n$$\\operatorname{tr}(A) < 0 \\quad\\text{and}\\quad \\det(A) > 0.$$\n\nA negative determinant means a saddle, which is unstable even if the trace is negative, and a positive trace means growth.",
        "$\\mathbf{x}' = A\\mathbf{x}$ 的原点渐近稳定，当且仅当两个特征值的实部都为负。对 $2 \\times 2$ 矩阵，这等价于\n\n$$\\operatorname{tr}(A) < 0 \\quad\\text{且}\\quad \\det(A) > 0.$$\n\n行列式为负意味着鞍点，即使迹为负也不稳定；迹为正则意味着增长。",
      ),
      generate(rng: Rng): Problem {
        let [a, b, c, d] = [0, 0, 0, 0];
        do {
          [a, b, c, d] = [rng.int(-6, 4), rng.int(-5, 5), rng.int(-5, 5), rng.int(-6, 4)];
        } while (a + d === 0 || a * d - b * c === 0);
        const tr = a + d;
        const det = a * d - b * c;
        const stable = tr < 0 && det > 0;
        return choiceProblem({
          prompt: t(
            `Is the origin an asymptotically stable equilibrium of $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$?`,
            `原点是 $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ 的渐近稳定平衡点吗？`,
          ),
          options: yesNo,
          correct: stable ? 0 : 1,
          solution: t(
            `$\\operatorname{tr}(A) = ${tr}$ and $\\det(A) = ${det}$. ${stable ? "Both conditions hold, so it is asymptotically stable." : det < 0 ? "The determinant is negative, so the origin is a saddle and is unstable." : "The trace is positive, so solutions grow and the origin is unstable."}`,
            `$\\operatorname{tr}(A) = ${tr}$，$\\det(A) = ${det}$。${stable ? "两个条件都成立，所以渐近稳定。" : det < 0 ? "行列式为负，原点是鞍点，不稳定。" : "迹为正，解会增长，原点不稳定。"}`,
          ),
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
    "For $x' = \\lambda_1 x$ and $y' = \\lambda_2 y$, integrating $\\frac{dy}{dx} = \\frac{\\lambda_2 y}{\\lambda_1 x}$ gives the trajectories $y = Cx^{\\lambda_2/\\lambda_1}$.",
    "对 $x' = \\lambda_1 x$ 与 $y' = \\lambda_2 y$，积分 $\\frac{dy}{dx} = \\frac{\\lambda_2 y}{\\lambda_1 x}$ 得轨线 $y = Cx^{\\lambda_2/\\lambda_1}$。",
  ),
  prerequisites: ["phase-planes-and-phase-portraits"],
  encompasses: [{ topic: "phase-planes-and-phase-portraits", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "trajectories-of-decoupled-systems",
      title: t("Power exponent of decoupled phase trajectories", "解耦系统相曲线的幂指数"),
      explanation: t(
        "Separating the variables in the trajectory equation shows that the path is a power curve whose exponent is the ratio of the two rates. For $\\frac{dy}{dx} = \\frac{\\lambda_2 y}{\\lambda_1 x}$, separation of variables yields $\\ln|y| = \\frac{\\lambda_2}{\\lambda_1}\\ln|x| + C \\implies y = K x^p$ where $p = \\frac{\\lambda_2}{\\lambda_1}$.",
        "对轨线方程分离变量可以看出，路径是一条幂曲线，指数是两个速率之比。对于 $\\frac{dy}{dx} = \\frac{\\lambda_2 y}{\\lambda_1 x}$，分离变量积分可得 $\\ln|y| = \\frac{\\lambda_2}{\\lambda_1}\\ln|x| + C \\implies y = K x^p$，其中幂指数 $p = \\frac{\\lambda_2}{\\lambda_1}$。",
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
    {
      id: "following-a-trajectory-of-a-decoupled-system",
      title: t("Following a trajectory of a decoupled system", "沿解耦方程组的轨线追踪"),
      explanation: t(
        "For $x' = ax$, $y' = by$ with $x > 0$, eliminating time from $x = x_0e^{at}$ and $y = y_0e^{bt}$ gives\n\n$$y = y_0\\left(\\frac{x}{x_0}\\right)^{b/a}.$$\n\nThe exponent is the ratio of the rates, which can be a fraction or negative. A fractional exponent bends the curve toward one axis, and a negative one gives hyperbola-like curves of a saddle.",
        "对 $x' = ax$，$y' = by$（$x > 0$），由 $x = x_0e^{at}$ 与 $y = y_0e^{bt}$ 消去时间得\n\n$$y = y_0\\left(\\frac{x}{x_0}\\right)^{b/a}.$$\n\n指数是两个速率之比，可以是分数或负数。分数指数使曲线向某一坐标轴弯曲，负指数则给出鞍点那种类似双曲线的曲线。",
      ),
      generate(rng: Rng): Problem {
        const [a, b] = rng.pick([
          [2, 1],
          [-2, -1],
          [2, -1],
          [-2, 1],
          [2, 3],
          [-2, -3],
          [1, 2],
          [-1, -2],
          [1, -1],
          [-1, 1],
          [2, -3],
          [4, 2],
          [-4, 6],
        ] as const);
        const q = rng.int(-6, 6) || 3;
        const r = Q.of(b, a);
        const e = r.mul(Q.of(2)).toNumber();
        const ans = Q.of(q).mul(Q.of(2).pow(e));
        return numberProblem({
          prompt: t(
            `A trajectory of $x' = ${poly([a, "x"])}$, $y' = ${poly([b, "y"])}$ passes through $(1, ${q})$. Find $y$ where it reaches $x = 4$.`,
            `$x' = ${poly([a, "x"])}$，$y' = ${poly([b, "y"])}$ 的一条轨线经过 $(1, ${q})$。求它到达 $x = 4$ 时的 $y$。`,
          ),
          answer: ans,
          wrong: [Q.of(q).mul(Q.of(2).pow(-e)), Q.of(q * 4), Q.of(q).mul(Q.of(b * 4, a))],
          solution: t(
            `The trajectory is $y = ${poly([q, `x^{${r.toLatex()}}`])}$, so at $x = 4$: $y = ${q} \\cdot 4^{${r.toLatex()}} = ${ans.toLatex()}$.`,
            `轨线为 $y = ${poly([q, `x^{${r.toLatex()}}`])}$，所以在 $x = 4$ 时 $y = ${q} \\cdot 4^{${r.toLatex()}} = ${ans.toLatex()}$。`,
          ),
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
    "When the eigenvalues have opposite signs ($\\lambda_1 < 0 < \\lambda_2$), the origin is an unstable saddle; when they have the same sign, it is a stable or unstable node.",
    "当特征值异号（$\\lambda_1 < 0 < \\lambda_2$）时原点为不稳定的鞍点；同号时为稳定或不稳定的结点。",
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
        "The determinant is the product of the eigenvalues, so a negative determinant means one eigenvalue is positive and one negative, which makes a saddle. A saddle point occurs when the eigenvalues have opposite signs, which is equivalent to $\\det(A) = \\lambda_1 \\lambda_2 < 0$.",
        "行列式是特征值之积，所以行列式为负意味着一个特征值为正、一个为负，这就是鞍点。当特征值异号时系统在原点形成鞍点，其等价充要代数条件为行列式 $\\det(A) = \\lambda_1 \\lambda_2 < 0$。",
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
    {
      id: "classifying-a-node-or-saddle",
      title: t("Classifying a node or saddle", "判别结点或鞍点"),
      explanation: t(
        "With real distinct eigenvalues the signs decide the portrait. Both negative: a stable node, with every trajectory entering the origin. Both positive: an unstable node. Opposite signs: a saddle, where only the two trajectories along the stable eigenvector reach the origin. You can read the signs without the eigenvalues: $\\det(A) = \\lambda_1\\lambda_2 < 0$ means a saddle, and otherwise the sign of $\\operatorname{tr}(A) = \\lambda_1 + \\lambda_2$ decides.",
        "特征值为互异实数时，由它们的符号决定相图。都为负：稳定结点，所有轨线都进入原点。都为正：不稳定结点。符号相反：鞍点，只有沿稳定特征向量的两条轨线到达原点。不求特征值也能读出符号：$\\det(A) = \\lambda_1\\lambda_2 < 0$ 表示鞍点，否则由 $\\operatorname{tr}(A) = \\lambda_1 + \\lambda_2$ 的符号决定。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(0, 2);
        const [l1, l2] =
          kind === 0 ? [-rng.int(1, 3), -rng.int(4, 6)] : kind === 1 ? [rng.int(1, 3), rng.int(4, 6)] : [-rng.int(1, 5), rng.int(1, 5)];
        const m1 = rng.int(-3, 3);
        const m2 = m1 + rng.pick([-1, 1]);
        const [a, b, c, d] = fromEigen(l1, l2, m1, m2);
        return choiceProblem({
          prompt: t(
            `Classify the origin for $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$.`,
            `判断 $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ 的原点类型。`,
          ),
          options: [t("Stable node", "稳定结点"), t("Unstable node", "不稳定结点"), t("Saddle", "鞍点")],
          correct: kind,
          solution: t(
            `$\\det(A) = ${a * d - b * c}$ and $\\operatorname{tr}(A) = ${a + d}$, so the eigenvalues are $${l1}$ and $${l2}$. ${kind === 2 ? "They have opposite signs: a saddle." : kind === 0 ? "Both are negative: a stable node." : "Both are positive: an unstable node."}`,
            `$\\det(A) = ${a * d - b * c}$，$\\operatorname{tr}(A) = ${a + d}$，所以特征值为 $${l1}$ 与 $${l2}$。${kind === 2 ? "两者异号：鞍点。" : kind === 0 ? "两者都为负：稳定结点。" : "两者都为正：不稳定结点。"}`,
          ),
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
    {
      id: "telling-a-star-node-from-a-degenerate-node",
      title: t("Telling a star node from a degenerate node", "区分星形结点与退化结点"),
      explanation: t(
        "A repeated eigenvalue $\\lambda$ gives two different portraits. If $A = \\lambda I$, every vector is an eigenvector and trajectories are straight rays: a star (proper) node. Otherwise $A - \\lambda I \\ne 0$, there is only one eigenvector line, and trajectories curve to become tangent to it: a degenerate (improper) node. In both cases the node is stable when $\\lambda < 0$ and unstable when $\\lambda > 0$.",
        "重特征值 $\\lambda$ 对应两种不同的相图。若 $A = \\lambda I$，每个向量都是特征向量，轨线是直的射线：星形（正常）结点。否则 $A - \\lambda I \\ne 0$，只有一条特征向量直线，轨线弯曲并与之相切：退化（非正常）结点。两种情形下，$\\lambda < 0$ 时结点稳定，$\\lambda > 0$ 时不稳定。",
      ),
      generate(rng: Rng): Problem {
        const l = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const star = rng.int(0, 2) === 0;
        const u = rng.pick([-2, -1, 1, 2]);
        const v = rng.pick([-2, -1, 0, 1, 2]);
        const [a, b, c, d] = star ? [l, 0, 0, l] : [l + u * v, -u * u, v * v, l - u * v];
        const correct = (l < 0 ? 0 : 1) + (star ? 0 : 2);
        return choiceProblem({
          prompt: t(
            `Classify the origin for $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$.`,
            `判断 $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ 的原点类型。`,
          ),
          options: [
            t("Stable star node", "稳定星形结点"),
            t("Unstable star node", "不稳定星形结点"),
            t("Stable degenerate node", "稳定退化结点"),
            t("Unstable degenerate node", "不稳定退化结点"),
          ],
          correct,
          solution: t(
            `$\\operatorname{tr}(A)^2 - 4\\det(A) = 0$, so $\\lambda = ${l}$ is repeated. ${star ? `$A = ${par(l)}I$, a star node` : `$A - ${par(l)}I \\ne 0$, a degenerate node`}, ${l < 0 ? "stable" : "unstable"} because $\\lambda ${l < 0 ? "<" : ">"} 0$.`,
            `$\\operatorname{tr}(A)^2 - 4\\det(A) = 0$，所以 $\\lambda = ${l}$ 是重根。${star ? `$A = ${par(l)}I$，是星形结点` : `$A - ${par(l)}I \\ne 0$，是退化结点`}，又因 $\\lambda ${l < 0 ? "<" : ">"} 0$，它${l < 0 ? "稳定" : "不稳定"}。`,
          ),
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
        "A zero determinant means the matrix sends a whole line of vectors to zero, so every point of that line is an equilibrium. For $A = \\begin{pmatrix} a & b \\\\ 2a & 2b \\end{pmatrix}$, $\\det(A) = 0$. The equilibrium points satisfy $a x + b y = 0$.",
        "行列式为零意味着矩阵把一整条直线上的向量都映射到零，所以这条直线上的每一点都是平衡点。对于秩为 1 的矩阵 $A = \\begin{pmatrix} a & b \\\\ 2a & 2b \\end{pmatrix}$，$\\det(A) = 0$。其平衡点轨迹构成直线 $a x + b y = 0$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 35);
        const ans = -a;

        const prompt = t(
          `For the linear system $\\mathbf{x}' = \\begin{pmatrix} ${a} & 1 \\\\ ${2 * a} & 2 \\end{pmatrix} \\mathbf{x}$, the equilibrium points form a line $y = mx$. Find $m$.`,
          `对于线性系统 $\\mathbf{x}' = \\begin{pmatrix} ${a} & 1 \\\\ ${2 * a} & 2 \\end{pmatrix} \\mathbf{x}$，其平衡点构成直线 $y = mx$。求 $m$。`,
        );
        const solution = t(
          steps(
            `Equilibrium points satisfy $A \\mathbf{x} = \\mathbf{0}$, which gives $${a}x + y = 0$ and $${2 * a}x + 2y = 0$.`,
            `The second equation is twice the first, so both say $${a}x + y = 0$.`,
            `Solving for $y$ gives $y = ${ans}x$, so $m = ${ans}$.`,
          ),
          steps(
            `平衡点满足 $A \\mathbf{x} = \\mathbf{0}$，展开得 $${a}x + y = 0$ 与 $${2 * a}x + 2y = 0$。`,
            `第二个方程是第一个的两倍，所以两者都表示 $${a}x + y = 0$。`,
            `解出 $y$ 得 $y = ${ans}x$，所以 $m = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a, -2 * a, 1],
        });
      },
    },
    {
      id: "the-nonzero-eigenvalue-of-a-singular-system",
      title: t("The nonzero eigenvalue of a singular system", "奇异方程组的非零特征值"),
      explanation: t(
        "If $\\det(A) = 0$ then $0$ is an eigenvalue, and the other eigenvalue equals the trace because the eigenvalues add up to $\\operatorname{tr}(A)$. Its eigenvector gives the direction of the parallel straight trajectories, and its sign decides the motion. If $\\operatorname{tr}(A) < 0$ trajectories move toward the line of equilibria; if $\\operatorname{tr}(A) > 0$ they move away from it.",
        "若 $\\det(A) = 0$，则 $0$ 是一个特征值，另一个特征值等于迹，因为特征值之和为 $\\operatorname{tr}(A)$。它的特征向量给出平行直线轨线的方向，它的符号决定运动方向。若 $\\operatorname{tr}(A) < 0$，轨线趋向平衡点直线；若 $\\operatorname{tr}(A) > 0$，轨线远离它。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-5, 5) || 1;
        const c = rng.int(-5, 5);
        const k = rng.pick([-3, -2, -1, 1, 2, 3]);
        const [b, d] = [k * a, k * c];
        const ans = a + d;
        return numberProblem({
          prompt: t(
            `$A = ${mat(a, b, c, d)}$ has $\\det(A) = 0$. Find the nonzero eigenvalue of $A$, or $0$ if both eigenvalues are zero.`,
            `$A = ${mat(a, b, c, d)}$ 满足 $\\det(A) = 0$。求 $A$ 的非零特征值；若两个特征值都为零，填 $0$。`,
          ),
          answer: ans,
          wrong: [a - d, -ans, a, b + c],
          solution: t(
            `The eigenvalues are $0$ and $\\operatorname{tr}(A) = ${a} ${signed(d)} = ${ans}$.`,
            `特征值为 $0$ 与 $\\operatorname{tr}(A) = ${a} ${signed(d)} = ${ans}$。`,
          ),
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
        "Purely imaginary eigenvalues give closed orbits that circle the origin forever, and their frequency is the imaginary part. For $A = \\begin{pmatrix} 0 & -\\omega \\\\ \\omega & 0 \\end{pmatrix}$, eigenvalues are $\\pm i\\omega$, producing a center with angular frequency $\\omega$.",
        "纯虚特征值给出永远绕原点运行的闭轨道，频率就是虚部。对于系统 $A = \\begin{pmatrix} 0 & -\\omega \\\\ \\omega & 0 \\end{pmatrix}$，特征值为纯虚根 $\\pm i\\omega$，原点为中心点，闭轨道的角频率为 $\\omega$。",
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
    {
      id: "classifying-a-spiral-or-center",
      title: t("Classifying a spiral or center", "判别焦点或中心"),
      explanation: t(
        "When $\\operatorname{tr}(A)^2 < 4\\det(A)$ the eigenvalues $\\alpha \\pm \\beta i$ are complex and trajectories turn around the origin. The real part $\\alpha = \\tfrac{1}{2}\\operatorname{tr}(A)$ decides the rest: $\\alpha < 0$ gives a stable spiral, $\\alpha > 0$ an unstable spiral, and $\\alpha = 0$ a center with closed orbits. The direction of turning is read from $A$ at the point $(1, 0)$: the velocity there is the first column of $A$, so a positive entry $A_{21}$ means counterclockwise motion.",
        "当 $\\operatorname{tr}(A)^2 < 4\\det(A)$ 时，特征值 $\\alpha \\pm \\beta i$ 为复数，轨线绕原点旋转。实部 $\\alpha = \\tfrac{1}{2}\\operatorname{tr}(A)$ 决定其余性质：$\\alpha < 0$ 为稳定焦点，$\\alpha > 0$ 为不稳定焦点，$\\alpha = 0$ 为中心，轨道闭合。旋转方向可在点 $(1, 0)$ 处读出：那里的速度是 $A$ 的第一列，所以 $A_{21}$ 为正表示逆时针运动。",
      ),
      generate(rng: Rng): Problem {
        const al = rng.pick([-2, -1, 0, 0, 1, 2]);
        const be = rng.int(1, 4);
        const u = rng.int(-2, 2);
        const n = u * u + be * be;
        const divs = Array.from({ length: n }, (_, i) => i + 1).filter((k) => n % k === 0);
        const v = rng.pick(divs) * rng.pick([-1, 1]);
        const w = n / v;
        const [a, b, c, d] = [al + u, -v, w, al - u];
        const kind = al < 0 ? 0 : al > 0 ? 1 : 2;
        const ccw = c > 0;
        const correct = kind * 2 + (ccw ? 0 : 1);
        const names = [
          t("Stable spiral, counterclockwise", "稳定焦点，逆时针"),
          t("Stable spiral, clockwise", "稳定焦点，顺时针"),
          t("Unstable spiral, counterclockwise", "不稳定焦点，逆时针"),
          t("Unstable spiral, clockwise", "不稳定焦点，顺时针"),
          t("Center, counterclockwise", "中心，逆时针"),
          t("Center, clockwise", "中心，顺时针"),
        ];
        return choiceProblem({
          prompt: t(
            `Classify the origin for $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ and give the direction of rotation.`,
            `判断 $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ 的原点类型，并给出旋转方向。`,
          ),
          options: names,
          correct,
          solution: t(
            `$\\operatorname{tr}(A) = ${a + d}$ and $\\det(A) = ${a * d - b * c}$, so the eigenvalues are $${al} \\pm ${be === 1 ? "" : be}i$. At $(1, 0)$ the velocity is $(${a}, ${c})$, which turns ${ccw ? "counterclockwise" : "clockwise"}.`,
            `$\\operatorname{tr}(A) = ${a + d}$，$\\det(A) = ${a * d - b * c}$，所以特征值为 $${al} \\pm ${be === 1 ? "" : be}i$。在 $(1, 0)$ 处速度为 $(${a}, ${c})$，${ccw ? "逆时针" : "顺时针"}旋转。`,
          ),
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
    "A shifted system $\\mathbf{x}' = A(\\mathbf{x} - \\mathbf{x}_*)$ moves the phase portrait to the equilibrium $\\mathbf{x}_*$; the substitution $\\mathbf{u} = \\mathbf{x} - \\mathbf{x}_*$ moves it back to the origin.",
    "平移系统 $\\mathbf{x}' = A(\\mathbf{x} - \\mathbf{x}_*)$ 把相图平移到平衡点 $\\mathbf{x}_*$；代换 $\\mathbf{u} = \\mathbf{x} - \\mathbf{x}_*$ 可化回原点形式。",
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
        "Shifting the variable by the equilibrium value moves the equilibrium to the origin, where the standard analysis applies. For $x' = -a(x - x_*)$, the equilibrium point is located at $x = x_*$.",
        "把变量平移一个平衡值，就把平衡点移到原点，在那里可以使用标准的分析方法。对于方程 $x' = -a(x - x_*)$，系统的稳定平衡点位于 $x = x_*$。",
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
    {
      id: "the-equilibrium-of-a-shifted-coupled-system",
      title: t("The equilibrium of a shifted coupled system", "平移耦合方程组的平衡点"),
      explanation: t(
        "A system $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{b}$ with $\\det(A) \\ne 0$ has one equilibrium $\\mathbf{x}_*$, found by solving $A\\mathbf{x}_* = -\\mathbf{b}$. Shifting to $\\mathbf{u} = \\mathbf{x} - \\mathbf{x}_*$ gives $\\mathbf{u}' = A\\mathbf{u}$, so the portrait is the one of $A$ moved to $\\mathbf{x}_*$. Then the eigenvalues of $A$ also classify the equilibrium $\\mathbf{x}_*$.",
        "当 $\\det(A) \\ne 0$ 时，方程组 $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{b}$ 有唯一平衡点 $\\mathbf{x}_*$，由 $A\\mathbf{x}_* = -\\mathbf{b}$ 解出。平移 $\\mathbf{u} = \\mathbf{x} - \\mathbf{x}_*$ 后得 $\\mathbf{u}' = A\\mathbf{u}$，所以相图就是 $A$ 的相图平移到 $\\mathbf{x}_*$。于是 $A$ 的特征值同样判定平衡点 $\\mathbf{x}_*$ 的类型。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c, d] = rng.pick([
          [1, 1, 1, 2],
          [-1, 2, 1, -3],
          [2, -1, 3, -1],
          [-3, 2, -2, 1],
          [1, -2, 1, -1],
          [-2, 1, 1, -1],
        ] as const);
        const x = rng.int(-5, 5) || 3;
        const y = rng.int(-5, 5);
        const e = -(a * x + b * y);
        const f = -(c * x + d * y);
        const comp = rng.int(1, 2);
        const ans = comp === 1 ? x : y;
        return numberProblem({
          prompt: t(
            `Shift $x' = ${poly([a, "x"], [b, "y"], [e, ""])}$, $y' = ${poly([c, "x"], [d, "y"], [f, ""])}$ to its equilibrium $(x_*, y_*)$. Find $${comp === 1 ? "x_*" : "y_*"}$.`,
            `把 $x' = ${poly([a, "x"], [b, "y"], [e, ""])}$，$y' = ${poly([c, "x"], [d, "y"], [f, ""])}$ 平移到平衡点 $(x_*, y_*)$。求 $${comp === 1 ? "x_*" : "y_*"}$。`,
          ),
          answer: ans,
          wrong: [comp === 1 ? y : x, -ans, comp === 1 ? e : f],
          solution: t(
            `Solve $${poly([a, "x"], [b, "y"])} = ${-e}$ and $${poly([c, "x"], [d, "y"])} = ${-f}$: $(x_*, y_*) = (${x}, ${y})$.`,
            `解 $${poly([a, "x"], [b, "y"])} = ${-e}$ 与 $${poly([c, "x"], [d, "y"])} = ${-f}$：$(x_*, y_*) = (${x}, ${y})$。`,
          ),
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
    "Near an equilibrium $\\mathbf{x}_*$, a nonlinear system $\\mathbf{x}' = F(\\mathbf{x})$ is approximated by $\\mathbf{u}' = J(\\mathbf{x}_*)\\mathbf{u}$, where $J$ is the Jacobian matrix.",
    "在平衡点 $\\mathbf{x}_*$ 附近，非线性系统 $\\mathbf{x}' = F(\\mathbf{x})$ 可用 $\\mathbf{u}' = J(\\mathbf{x}_*)\\mathbf{u}$ 近似，其中 $J$ 为雅可比矩阵。",
  ),
  prerequisites: ["shifted-systems-of-odes"],
  encompasses: [{ topic: "shifted-systems-of-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "jacobian-matrix-and-local-linearization",
      title: t("Jacobian entry of a nonlinear system", "非线性系统在平衡点处的雅可比矩阵元素"),
      explanation: t(
        "Near an equilibrium a nonlinear system behaves like its linearization, whose matrix is the Jacobian of partial derivatives evaluated there. For $x' = f(x, y) = a x - x^2$, the partial derivative $\\frac{\\partial f}{\\partial x} = a - 2x$. At the origin $(0, 0)$, $J_{11} = a$.",
        "在平衡点附近，非线性方程组的行为与它的线性化相似，其矩阵是在该点处求值的偏导数雅可比矩阵。对于 $x' = f(x, y) = a x - x^2$，偏导数为 $\\frac{\\partial f}{\\partial x} = a - 2x$。在原点平衡点 $(0, 0)$ 处，雅可比元素为 $J_{11} = a$。",
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
    {
      id: "the-jacobian-at-an-interior-equilibrium",
      title: t("The Jacobian at an interior equilibrium", "内部平衡点处的雅可比矩阵"),
      explanation: t(
        "Near an equilibrium $(x_*, y_*)$ of $x' = f(x, y)$, $y' = g(x, y)$, the system behaves like $\\mathbf{u}' = J\\mathbf{u}$ with\n\n$$J = \\begin{pmatrix} f_x & f_y \\\\ g_x & g_y \\end{pmatrix}\\Bigg|_{(x_*, y_*)}.$$\n\nFind the equilibrium first, then differentiate, then substitute: the partial derivatives of a product such as $xy$ depend on the point. The trace and determinant of $J$ classify the equilibrium when the linearization is not a borderline case.",
        "在 $x' = f(x, y)$，$y' = g(x, y)$ 的平衡点 $(x_*, y_*)$ 附近，方程组的行为类似 $\\mathbf{u}' = J\\mathbf{u}$，其中\n\n$$J = \\begin{pmatrix} f_x & f_y \\\\ g_x & g_y \\end{pmatrix}\\Bigg|_{(x_*, y_*)}.$$\n\n先求平衡点，再求偏导，最后代入：像 $xy$ 这样的乘积，其偏导数与点有关。线性化不属于临界情形时，$J$ 的迹和行列式就能判定平衡点类型。",
      ),
      generate(rng: Rng): Problem {
        const qv = rng.int(1, 6);
        const r = rng.int(1, 6);
        const k = rng.int(1, 4);
        const p = qv * r;
        const askTrace = rng.int(0, 1) === 0;
        const ans = askTrace ? -r : k * qv;
        const what = askTrace ? "\\operatorname{tr}(J)" : "\\det(J)";
        return numberProblem({
          prompt: t(
            `Linearize $x' = ${p} - xy$, $y' = ${poly([k, "x"], [-k * qv, ""])}$ at its equilibrium. Find $${what}$ for the Jacobian $J$ there.`,
            `在平衡点处线性化 $x' = ${p} - xy$，$y' = ${poly([k, "x"], [-k * qv, ""])}$。求该点处雅可比矩阵 $J$ 的 $${what}$。`,
          ),
          answer: ans,
          wrong: askTrace ? [r, -qv, -r - qv, 0] : [-k * qv, k * r, qv, r * qv],
          solution: t(
            steps(
              `From $y' = 0$: $x_* = ${qv}$; then $${p} - ${qv}y = 0$ gives $y_* = ${r}$.`,
              `$J = ${mat("-y", "-x", k, 0)}$ becomes $${mat(-r, -qv, k, 0)}$ at $(${qv}, ${r})$, so $${what} = ${ans}$.`,
            ),
            steps(
              `由 $y' = 0$ 得 $x_* = ${qv}$；再由 $${p} - ${qv}y = 0$ 得 $y_* = ${r}$。`,
              `$J = ${mat("-y", "-x", k, 0)}$ 在 $(${qv}, ${r})$ 处为 $${mat(-r, -qv, k, 0)}$，所以 $${what} = ${ans}$。`,
            ),
          ),
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
    "The matrix exponential $e^{At} = \\sum_{k=0}^{\\infty} \\frac{(At)^k}{k!}$ solves $\\mathbf{x}' = A\\mathbf{x}$; when $A^2 = 0$ the series stops at $I + At$.",
    "矩阵指数 $e^{At} = \\sum_{k=0}^{\\infty} \\frac{(At)^k}{k!}$ 给出 $\\mathbf{x}' = A\\mathbf{x}$ 的解；当 $A^2 = 0$ 时级数截断为 $I + At$。",
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
        "The matrix exponential is defined by the same power series as the ordinary exponential, and when a power of the matrix is zero, the series stops. For $A = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$, $A^2 = 0$. Thus $e^{At} = I + At = \\begin{pmatrix} 1 & kt \\\\ 0 & 1 \\end{pmatrix}$. At $t = 1$, the upper right entry is $k$.",
        "矩阵指数由与普通指数相同的幂级数定义，当矩阵的某次幂为零时，级数就终止了。对于矩阵 $A = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$，有 $A^2 = 0$。因此 $e^{At} = I + At = \\begin{pmatrix} 1 & kt \\\\ 0 & 1 \\end{pmatrix}$。在 $t = 1$ 处右上角元素即为 $k$。",
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
    {
      id: "the-matrix-exponential-of-a-rotation-generator",
      title: t("The matrix exponential of a rotation generator", "旋转生成矩阵的矩阵指数"),
      explanation: t(
        "For $A = \\begin{pmatrix} 0 & -\\omega \\\\ \\omega & 0 \\end{pmatrix}$ we have $A^2 = -\\omega^2 I$, so the even powers in $\\sum A^nt^n/n!$ build a cosine and the odd powers a sine:\n\n$$e^{At} = \\begin{pmatrix} \\cos \\omega t & -\\sin \\omega t \\\\ \\sin \\omega t & \\cos \\omega t \\end{pmatrix}.$$\n\nThis matrix rotates a vector counterclockwise by the angle $\\omega t$. Entry by entry, the sine sits below the diagonal with a plus sign and above it with a minus sign.",
        "对 $A = \\begin{pmatrix} 0 & -\\omega \\\\ \\omega & 0 \\end{pmatrix}$ 有 $A^2 = -\\omega^2 I$，所以级数 $\\sum A^nt^n/n!$ 中的偶次幂组成余弦，奇次幂组成正弦：\n\n$$e^{At} = \\begin{pmatrix} \\cos \\omega t & -\\sin \\omega t \\\\ \\sin \\omega t & \\cos \\omega t \\end{pmatrix}.$$\n\n这个矩阵把向量逆时针旋转角度 $\\omega t$。逐个元素看，正弦在对角线下方带正号，在上方带负号。",
      ),
      generate(rng: Rng): Problem {
        const w = rng.int(1, 4);
        const k = rng.pick([1, 3, 5, 7, 9, 11]);
        const sin = Q.of([1, 1, 1, -1, -1, -1][(k - 1) / 2] ?? 1, k === 3 || k === 9 ? 1 : 2);
        const lower = rng.int(0, 1) === 0;
        const ans = lower ? sin : sin.neg();
        const tt = Q.of(k, 6 * w);
        const tLatex = piLatex(tt);
        const entry = lower ? "21" : "12";
        return numberProblem({
          prompt: t(
            `For $A = ${mat(0, -w, w, 0)}$, find the entry $(e^{At})_{${entry}}$ at $t = ${tLatex}$.`,
            `对 $A = ${mat(0, -w, w, 0)}$，求 $t = ${tLatex}$ 时的元素 $(e^{At})_{${entry}}$。`,
          ),
          answer: ans,
          wrong: [ans.neg(), Q.of(w).mul(ans), Q.zero, Q.one],
          solution: t(
            `$(e^{At})_{${entry}} = ${lower ? "" : "-"}\\sin ${w === 1 ? "" : w}t$ and $${w === 1 ? "" : w}t = ${piLatex(Q.of(k, 6))}$, so the entry is $${ans.toLatex()}$.`,
            `$(e^{At})_{${entry}} = ${lower ? "" : "-"}\\sin ${w === 1 ? "" : w}t$，且 $${w === 1 ? "" : w}t = ${piLatex(Q.of(k, 6))}$，所以该元素为 $${ans.toLatex()}$。`,
          ),
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
    "A fundamental matrix $\\Phi(t)$ has linearly independent solutions as columns, satisfies $\\Phi' = A\\Phi$, and gives $e^{At} = \\Phi(t)\\Phi(0)^{-1}$.",
    "基本解矩阵 $\\Phi(t)$ 的各列是线性无关的解，满足 $\\Phi' = A\\Phi$，且 $e^{At} = \\Phi(t)\\Phi(0)^{-1}$。",
  ),
  prerequisites: ["matrix-exponentials"],
  encompasses: [{ topic: "matrix-exponentials", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "the-fundamental-matrix-solution",
      title: t("Initial determinant of a fundamental matrix", "基本解矩阵的初值行列式"),
      explanation: t(
        "A fundamental matrix has independent solutions as its columns, and its determinant at any time is the Wronskian of those solutions. For $\\Phi(t) = \\begin{pmatrix} e^{a t} & 0 \\\\ 0 & e^{b t} \\end{pmatrix}$, evaluating at $t = 0$ gives $\\Phi(0) = I$, with determinant $\\det(\\Phi(0)) = 1$. For scaled columns, $\\det(\\Phi(0)) = u v$.",
        "基本矩阵以线性无关的解为列，它在任意时刻的行列式就是这些解的朗斯基行列式。对于基本解矩阵 $\\Phi(t)$，在 $t = 0$ 处的行列式等于各初始解向量构成的方阵行列式。",
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
    {
      id: "recovering-the-coefficient-matrix-from-a-fundamental-matrix",
      title: t("Recovering the coefficient matrix from a fundamental matrix", "由基本矩阵还原系数矩阵"),
      explanation: t(
        "A fundamental matrix satisfies $\\Phi'(t) = A\\Phi(t)$ and is invertible, so the coefficient matrix can be read off at any time, most simply at $t = 0$:\n\n$$A = \\Phi'(0)\\,\\Phi(0)^{-1}.$$\n\nDifferentiate each column, set $t = 0$, and multiply by the inverse of $\\Phi(0)$. For a $2 \\times 2$ matrix $\\begin{pmatrix} p & q \\\\ r & s \\end{pmatrix}$ the inverse is $\\frac{1}{ps - qr}\\begin{pmatrix} s & -q \\\\ -r & p \\end{pmatrix}$.",
        "基本矩阵满足 $\\Phi'(t) = A\\Phi(t)$ 且可逆，所以可以在任意时刻读出系数矩阵，最简单的是 $t = 0$：\n\n$$A = \\Phi'(0)\\,\\Phi(0)^{-1}.$$\n\n对每一列求导，令 $t = 0$，再乘以 $\\Phi(0)$ 的逆。对 $2 \\times 2$ 矩阵 $\\begin{pmatrix} p & q \\\\ r & s \\end{pmatrix}$，其逆为 $\\frac{1}{ps - qr}\\begin{pmatrix} s & -q \\\\ -r & p \\end{pmatrix}$。",
      ),
      generate(rng: Rng): Problem {
        const l1 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const l2 = rng.pick([-4, -2, 2, 4, 5].filter((x) => x !== l1));
        const m1 = rng.int(-3, 3);
        const m2 = m1 + rng.pick([-1, 1]);
        const A = fromEigen(l1, l2, m1, m2);
        const i = rng.int(0, 3);
        const ans = A[i] ?? 0;
        const entry = ["11", "12", "21", "22"][i] ?? "11";
        const col = (l: number, m: number) =>
          `$\\begin{pmatrix} e^{${ex(l)}} \\\\ ${m === 0 ? "0" : `${m === 1 ? "" : m === -1 ? "-" : m}e^{${ex(l)}}`} \\end{pmatrix}$`;
        return numberProblem({
          prompt: t(
            `The columns ${col(l1, m1)} and ${col(l2, m2)} form a fundamental matrix of $\\mathbf{x}' = A\\mathbf{x}$. Find $A_{${entry}}$.`,
            `列向量 ${col(l1, m1)} 与 ${col(l2, m2)} 组成 $\\mathbf{x}' = A\\mathbf{x}$ 的基本矩阵。求 $A_{${entry}}$。`,
          ),
          answer: ans,
          wrong: [-ans, i === 0 ? l1 : i === 3 ? l2 : l2 - l1, A[3 - i] ?? 0],
          solution: t(
            `$\\Phi(0) = ${mat(1, 1, m1, m2)}$ and $\\Phi'(0) = ${mat(l1, l2, m1 * l1, m2 * l2)}$, so $A = \\Phi'(0)\\Phi(0)^{-1} = ${mat(...A)}$ and $A_{${entry}} = ${ans}$.`,
            `$\\Phi(0) = ${mat(1, 1, m1, m2)}$，$\\Phi'(0) = ${mat(l1, l2, m1 * l1, m2 * l2)}$，所以 $A = \\Phi'(0)\\Phi(0)^{-1} = ${mat(...A)}$，$A_{${entry}} = ${ans}$。`,
          ),
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
    "With the matrix exponential, the solution of $\\mathbf{x}' = A\\mathbf{x}$, $\\mathbf{x}(0) = \\mathbf{x}_0$ is $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0$.",
    "利用矩阵指数，初值问题 $\\mathbf{x}' = A\\mathbf{x}$，$\\mathbf{x}(0) = \\mathbf{x}_0$ 的解为 $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0$。",
  ),
  prerequisites: ["fundamental-matrices"],
  encompasses: [{ topic: "fundamental-matrices", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "solution-via-matrix-exponential",
      title: t("Initial state evaluation via matrix exponential", "矩阵指数解在初始状态下的验证"),
      explanation: t(
        "Multiplying the matrix exponential by the initial vector solves the system, and at time zero the exponential is the identity, so the initial condition holds. Since $e^{A \\cdot 0} = I$, the solution $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0$ satisfies $\\mathbf{x}(0) = I \\mathbf{x}_0 = \\mathbf{x}_0$.",
        "用矩阵指数乘以初始向量就解出了方程组，在零时刻指数是单位矩阵，所以初始条件成立。因为 $e^{A \\cdot 0} = I$，解向量 $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0$ 在 $t = 0$ 处满足 $\\mathbf{x}(0) = I \\mathbf{x}_0 = \\mathbf{x}_0$。",
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
    {
      id: "solving-a-nilpotent-three-dimensional-system",
      title: t("Solving a nilpotent three-dimensional system", "求解三维幂零方程组"),
      explanation: t(
        "If some power of $A$ is zero, the series for $e^{At}$ stops. For a strictly upper triangular $3 \\times 3$ matrix $A^3 = 0$, so\n\n$$e^{At} = I + tA + \\frac{t^2}{2}A^2, \\qquad \\mathbf{x}(t) = e^{At}\\mathbf{x}(0).$$\n\nOnly the corner entry of $A^2$ is nonzero: for $A = \\begin{pmatrix} 0 & p & q \\\\ 0 & 0 & r \\\\ 0 & 0 & 0 \\end{pmatrix}$ it is $(A^2)_{13} = pr$. Keep the factor $\\tfrac{1}{2}$ from $2!$.",
        "如果 $A$ 的某个幂为零，$e^{At}$ 的级数就会截断。对严格上三角的 $3 \\times 3$ 矩阵有 $A^3 = 0$，所以\n\n$$e^{At} = I + tA + \\frac{t^2}{2}A^2, \\qquad \\mathbf{x}(t) = e^{At}\\mathbf{x}(0).$$\n\n$A^2$ 只有角上的元素非零：对 $A = \\begin{pmatrix} 0 & p & q \\\\ 0 & 0 & r \\\\ 0 & 0 & 0 \\end{pmatrix}$，$(A^2)_{13} = pr$。别忘了来自 $2!$ 的因子 $\\tfrac{1}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(-3, 3) || 1;
        const q = rng.int(-3, 3);
        const r = rng.int(-3, 3) || 2;
        const u = rng.int(-4, 4);
        const v = rng.int(-4, 4);
        const w = rng.int(-3, 3) || 1;
        const lin = p * v + q * w;
        const ans = u + 2 * lin + 2 * p * r * w;
        return numberProblem({
          prompt: t(
            `Solve $\\mathbf{x}' = \\begin{pmatrix} 0 & ${p} & ${q} \\\\ 0 & 0 & ${r} \\\\ 0 & 0 & 0 \\end{pmatrix}\\mathbf{x}$ with $\\mathbf{x}(0) = (${u}, ${v}, ${w})$. Find $x_1(2)$.`,
            `解 $\\mathbf{x}' = \\begin{pmatrix} 0 & ${p} & ${q} \\\\ 0 & 0 & ${r} \\\\ 0 & 0 & 0 \\end{pmatrix}\\mathbf{x}$，$\\mathbf{x}(0) = (${u}, ${v}, ${w})$。求 $x_1(2)$。`,
          ),
          answer: ans,
          wrong: [u + 2 * lin, u + 2 * lin + 4 * p * r * w, u + lin + p * r * w, u],
          solution: t(
            steps(
              `$(A\\mathbf{x}(0))_1 = ${lin}$ and $(A^2\\mathbf{x}(0))_1 = ${p * r} \\cdot ${par(w)} = ${p * r * w}$.`,
              `$x_1(2) = ${u} + 2 \\cdot ${par(lin)} + \\frac{2^2}{2} \\cdot ${par(p * r * w)} = ${ans}$.`,
            ),
            steps(
              `$(A\\mathbf{x}(0))_1 = ${lin}$，$(A^2\\mathbf{x}(0))_1 = ${p * r} \\cdot ${par(w)} = ${p * r * w}$。`,
              `$x_1(2) = ${u} + 2 \\cdot ${par(lin)} + \\frac{2^2}{2} \\cdot ${par(p * r * w)} = ${ans}$。`,
            ),
          ),
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
    "The formula $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0 + \\int_0^t e^{A(t - s)}\\mathbf{g}(s)\\,ds$ solves inhomogeneous linear systems.",
    "公式 $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0 + \\int_0^t e^{A(t - s)}\\mathbf{g}(s)\\,ds$ 给出非齐次线性方程组的解。",
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
        "The particular solution adds up the effect of the forcing at each earlier time, carried forward by the matrix exponential to the present. For $\\mathbf{x}_p(t) = \\int_0^t e^{A(t-s)}\\mathbf{g}(s)\\,ds$, differentiating by Leibniz's rule yields $\\mathbf{x}_p'(0) = \\mathbf{g}(0)$.",
        "特解把之前每个时刻强迫项的作用加起来，并由矩阵指数传递到当前时刻。对于卷积特解 $\\mathbf{x}_p(t) = \\int_0^t e^{A(t-s)}\\mathbf{g}(s)\\,ds$，根据含参变限积分莱布尼茨求导法则，在 $t = 0$ 处满足 $\\mathbf{x}_p'(0) = \\mathbf{g}(0)$。",
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
    {
      id: "the-forced-response-of-a-shear-system",
      title: t("The forced response of a shear system", "剪切方程组的受迫响应"),
      explanation: t(
        "The solution of $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}$ is\n\n$$\\mathbf{x}(t) = e^{At}\\mathbf{x}(0) + \\int_0^t e^{A(t - s)}\\mathbf{g}(s)\\,ds.$$\n\nFor the shear matrix $A = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$, $e^{At} = I + tA$. With a constant $\\mathbf{g}$ the integral is $\\int_0^t (I + (t - s)A)\\,ds\\,\\mathbf{g} = (tI + \\tfrac{t^2}{2}A)\\mathbf{g}$. So the forcing in the second equation reaches $x_1$ through the factor $\\tfrac{t^2}{2}k$.",
        "$\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}$ 的解为\n\n$$\\mathbf{x}(t) = e^{At}\\mathbf{x}(0) + \\int_0^t e^{A(t - s)}\\mathbf{g}(s)\\,ds.$$\n\n对剪切矩阵 $A = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$，$e^{At} = I + tA$。$\\mathbf{g}$ 为常向量时，积分为 $\\int_0^t (I + (t - s)A)\\,ds\\,\\mathbf{g} = (tI + \\tfrac{t^2}{2}A)\\mathbf{g}$。所以第二个方程中的强迫项通过因子 $\\tfrac{t^2}{2}k$ 影响 $x_1$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(-3, 3) || 2;
        const p = rng.int(-4, 4);
        const q = rng.int(-4, 4) || 1;
        const g1 = rng.int(-4, 4);
        const g2 = rng.int(-4, 4) || 3;
        const ans = p + 2 * k * q + 2 * g1 + 2 * k * g2;
        return numberProblem({
          prompt: t(
            `Solve $x_1' = ${poly([k, "x_2"], [g1, ""])}$, $x_2' = ${g2}$ with $x_1(0) = ${p}$, $x_2(0) = ${q}$, and find $x_1(2)$.`,
            `解 $x_1' = ${poly([k, "x_2"], [g1, ""])}$，$x_2' = ${g2}$，$x_1(0) = ${p}$，$x_2(0) = ${q}$，并求 $x_1(2)$。`,
          ),
          answer: ans,
          wrong: [p + 2 * k * q + 2 * g1 + 4 * k * g2, p + 2 * k * q + 2 * g1, p + 2 * g1 + 2 * k * g2, 2 * k * q + 2 * g1 + 2 * k * g2],
          solution: t(
            steps(
              `$e^{At}\\mathbf{x}(0)$ has first component $${poly([p, ""], [k * q, "t"])}$, and the integral has first component $${poly([g1, "t"], [Q.of(k * g2, 2), "t^2"])}$.`,
              `So $x_1(t) = ${poly([p, ""], [k * q + g1, "t"], [Q.of(k * g2, 2), "t^2"])}$ and $x_1(2) = ${ans}$.`,
            ),
            steps(
              `$e^{At}\\mathbf{x}(0)$ 的第一分量为 $${poly([p, ""], [k * q, "t"])}$，积分项的第一分量为 $${poly([g1, "t"], [Q.of(k * g2, 2), "t^2"])}$。`,
              `所以 $x_1(t) = ${poly([p, ""], [k * q + g1, "t"], [Q.of(k * g2, 2), "t^2"])}$，$x_1(2) = ${ans}$。`,
            ),
          ),
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
    "Setting $\\mathbf{x} = \\Phi(t)\\mathbf{u}(t)$ turns the inhomogeneous system into $\\Phi\\mathbf{u}' = \\mathbf{g}$, so $\\mathbf{u}' = \\Phi^{-1}\\mathbf{g}$.",
    "设 $\\mathbf{x} = \\Phi(t)\\mathbf{u}(t)$，非齐次方程组化为 $\\Phi\\mathbf{u}' = \\mathbf{g}$，从而 $\\mathbf{u}' = \\Phi^{-1}\\mathbf{g}$。",
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
        "Writing the solution as the fundamental matrix times an unknown vector leads to an equation for the derivative of that vector. For $\\Phi(0) = I$, the parameter derivative at $t = 0$ is $\\mathbf{u}'(0) = \\Phi(0)^{-1}\\mathbf{g}(0) = \\mathbf{g}(0)$.",
        "把解写成基本矩阵乘以一个未知向量，就得到关于这个向量导数的方程。当规范化基本解矩阵满足 $\\Phi(0) = I$ 时，在 $t = 0$ 处的参数导数向量为 $\\mathbf{u}'(0) = \\Phi(0)^{-1}\\mathbf{g}(0) = \\mathbf{g}(0)$。",
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
    {
      id: "a-particular-solution-by-variation-of-parameters",
      title: t("A particular solution by variation of parameters", "用参数变易法求特解"),
      explanation: t(
        "Variation of parameters looks for $\\mathbf{x}_p = \\Phi(t)\\mathbf{u}(t)$, which turns $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}$ into $\\Phi\\mathbf{u}' = \\mathbf{g}$. For the diagonal system $A = \\operatorname{diag}(a, b)$ with $\\Phi = \\operatorname{diag}(e^{at}, e^{bt})$ this reads\n\n$$u_1' = e^{-at}g_1(t), \\qquad u_2' = e^{-bt}g_2(t).$$\n\nIntegrate and multiply back by $\\Phi$. A forcing term $ke^{at}$ that matches the rate $a$ gives $u_1' = k$, so it produces the resonant term $kte^{at}$; a forcing $me^{ct}$ with $c \\ne b$ produces $\\frac{m}{c - b}e^{ct}$.",
        "参数变易法设 $\\mathbf{x}_p = \\Phi(t)\\mathbf{u}(t)$，它把 $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}$ 化为 $\\Phi\\mathbf{u}' = \\mathbf{g}$。对对角方程组 $A = \\operatorname{diag}(a, b)$，取 $\\Phi = \\operatorname{diag}(e^{at}, e^{bt})$，即\n\n$$u_1' = e^{-at}g_1(t), \\qquad u_2' = e^{-bt}g_2(t).$$\n\n积分后再乘回 $\\Phi$。与速率 $a$ 相同的强迫项 $ke^{at}$ 给出 $u_1' = k$，从而产生共振项 $kte^{at}$；强迫项 $me^{ct}$（$c \\ne b$）产生 $\\frac{m}{c - b}e^{ct}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const b = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c = rng.pick([-4, -2, 0, 2, 4, 5].filter((x) => x !== b));
        const k = rng.int(-6, 6) || 2;
        const m = rng.int(-6, 6) || 3;
        const first = rng.int(0, 1) === 0;
        const ans = first ? Q.of(k) : Q.of(m, c - b);
        const rhs1 = poly([a, "x_1"], [k, `e^{${ex(a)}}`]);
        const rhs2 = poly([b, "x_2"], [m, c === 0 ? "" : `e^{${ex(c)}}`]);
        return numberProblem({
          prompt: t(
            `Use variation of parameters on $x_1' = ${rhs1}$, $x_2' = ${rhs2}$ with $\\mathbf{u}(0) = \\mathbf{0}$. ${first ? `Find the coefficient of $te^{${ex(a)}}$ in $x_{p,1}$.` : `Find the coefficient of ${c === 0 ? "the constant term" : `$e^{${ex(c)}}$`} in $x_{p,2}$.`}`,
            `对 $x_1' = ${rhs1}$，$x_2' = ${rhs2}$ 用参数变易法，取 $\\mathbf{u}(0) = \\mathbf{0}$。${first ? `求 $x_{p,1}$ 中 $te^{${ex(a)}}$ 的系数。` : `求 $x_{p,2}$ 中${c === 0 ? "常数项" : ` $e^{${ex(c)}}$ `}的系数。`}`,
          ),
          answer: ans,
          wrong: first
            ? [Q.of(k, a), Q.of(-k), Q.of(k * a)]
            : [Q.of(m, b - c), Q.of(m), ...(c === 0 ? [] : [Q.of(m, c)]), Q.of(m, c + b || 7)],
          solution: t(
            first
              ? `$u_1' = e^{${ex(-a)}} \\cdot ${poly([k, `e^{${ex(a)}}`])} = ${k}$, so $u_1 = ${poly([k, "t"])}$ and $x_{p,1} = ${poly([k, `te^{${ex(a)}}`])}$. The coefficient is $${k}$.`
              : `$u_2' = ${poly([m, `e^{${ex(c - b)}}`])}$, so $u_2 = ${poly([Q.of(m, c - b), `e^{${ex(c - b)}}`])} + C$, and multiplying by $e^{${ex(b)}}$ gives the coefficient $${ans.toLatex()}$; the constant $C$ only adds a homogeneous term $Ce^{${ex(b)}}$.`,
            first
              ? `$u_1' = e^{${ex(-a)}} \\cdot ${poly([k, `e^{${ex(a)}}`])} = ${k}$，所以 $u_1 = ${poly([k, "t"])}$，$x_{p,1} = ${poly([k, `te^{${ex(a)}}`])}$，系数为 $${k}$。`
              : `$u_2' = ${poly([m, `e^{${ex(c - b)}}`])}$，所以 $u_2 = ${poly([Q.of(m, c - b), `e^{${ex(c - b)}}`])} + C$，乘以 $e^{${ex(b)}}$ 得系数 $${ans.toLatex()}$；常数 $C$ 只添加齐次项 $Ce^{${ex(b)}}$。`,
          ),
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
    "The Lotka-Volterra model $x' = \\alpha x - \\beta xy$, $y' = -\\gamma y + \\delta xy$ describes predator and prey populations, with coexistence equilibrium $(x_*, y_*) = \\left(\\frac{\\gamma}{\\delta}, \\frac{\\alpha}{\\beta}\\right)$.",
    "洛特卡-沃尔泰拉模型 $x' = \\alpha x - \\beta xy$，$y' = -\\gamma y + \\delta xy$ 描述捕食者与猎物种群，其共存平衡点为 $(x_*, y_*) = \\left(\\frac{\\gamma}{\\delta}, \\frac{\\alpha}{\\beta}\\right)$。",
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
    {
      id: "the-frequency-of-small-predator-prey-cycles",
      title: t("The frequency of small predator-prey cycles", "小幅捕食者-猎物循环的频率"),
      explanation: t(
        "For $x' = ax - bxy$, $y' = -cy + dxy$, the coexistence equilibrium is $\\left(\\frac{c}{d}, \\frac{a}{b}\\right)$. There the Jacobian is\n\n$$J = \\begin{pmatrix} 0 & -\\frac{bc}{d} \\\\ \\frac{ad}{b} & 0 \\end{pmatrix}, \\qquad \\lambda^2 = -ac.$$\n\nThe eigenvalues are $\\pm i\\sqrt{ac}$, so small oscillations of both populations have angular frequency $\\omega = \\sqrt{ac}$ and period $2\\pi/\\sqrt{ac}$. The interaction rates $b$ and $d$ set the equilibrium but not the frequency.",
        "对 $x' = ax - bxy$，$y' = -cy + dxy$，共存平衡点为 $\\left(\\frac{c}{d}, \\frac{a}{b}\\right)$。该点处的雅可比矩阵为\n\n$$J = \\begin{pmatrix} 0 & -\\frac{bc}{d} \\\\ \\frac{ad}{b} & 0 \\end{pmatrix}, \\qquad \\lambda^2 = -ac.$$\n\n特征值为 $\\pm i\\sqrt{ac}$，所以两种群小幅振荡的角频率为 $\\omega = \\sqrt{ac}$，周期为 $2\\pi/\\sqrt{ac}$。相互作用率 $b$ 与 $d$ 决定平衡点，但不影响频率。",
      ),
      generate(rng: Rng): Problem {
        const w = rng.int(1, 6);
        const divs = Array.from({ length: w * w }, (_, i) => i + 1).filter((k) => (w * w) % k === 0);
        const a = rng.pick(divs);
        const c = (w * w) / a;
        const b = rng.int(1, 5);
        const d = rng.int(1, 5);
        return numberProblem({
          prompt: t(
            `Linearize $x' = ${poly([a, "x"], [-b, "xy"])}$, $y' = ${poly([-c, "y"], [d, "xy"])}$ at its coexistence equilibrium. Find the angular frequency $\\omega$ of small oscillations.`,
            `在共存平衡点处线性化 $x' = ${poly([a, "x"], [-b, "xy"])}$，$y' = ${poly([-c, "y"], [d, "xy"])}$。求小幅振荡的角频率 $\\omega$。`,
          ),
          answer: w,
          wrong: [w * w, a + c, Q.of(c, d), Q.of(a, b)],
          solution: t(
            steps(
              `The equilibrium is $\\left(${Q.of(c, d).toLatex()}, ${Q.of(a, b).toLatex()}\\right)$, where $J = ${mat(0, Q.of(-b * c, d).toLatex(), Q.of(a * d, b).toLatex(), 0)}$.`,
              `$\\lambda^2 = -${a} \\cdot ${c} = -${w * w}$, so $\\omega = ${w}$.`,
            ),
            steps(
              `平衡点为 $\\left(${Q.of(c, d).toLatex()}, ${Q.of(a, b).toLatex()}\\right)$，该点处 $J = ${mat(0, Q.of(-b * c, d).toLatex(), Q.of(a * d, b).toLatex(), 0)}$。`,
              `$\\lambda^2 = -${a} \\cdot ${c} = -${w * w}$，所以 $\\omega = ${w}$。`,
            ),
          ),
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
    {
      id: "the-predator-level-at-coexistence-with-limited-prey",
      title: t("The predator level at coexistence with limited prey", "猎物受限时共存状态的捕食者数量"),
      explanation: t(
        "For $x' = ax\\left(1 - \\frac{x}{K}\\right) - bxy$, $y' = -cy + dxy$, the predator equation is unchanged, so coexistence still needs $x_* = \\frac{c}{d}$. Substituting into the prey equation and dividing by $x$ gives\n\n$$y_* = \\frac{a}{b}\\left(1 - \\frac{x_*}{K}\\right).$$\n\nThe logistic limit lowers the predator level below $\\frac{a}{b}$, and when $x_* \\ge K$ the predators cannot survive at all.",
        "对 $x' = ax\\left(1 - \\frac{x}{K}\\right) - bxy$，$y' = -cy + dxy$，捕食者方程没有变化，所以共存仍要求 $x_* = \\frac{c}{d}$。代入猎物方程并除以 $x$ 得\n\n$$y_* = \\frac{a}{b}\\left(1 - \\frac{x_*}{K}\\right).$$\n\nLogistic 限制使捕食者数量低于 $\\frac{a}{b}$；当 $x_* \\ge K$ 时捕食者根本无法存活。",
      ),
      generate(rng: Rng): Problem {
        const d = rng.int(1, 4);
        const xs = rng.int(1, 8);
        const c = d * xs;
        const K = xs + rng.int(1, 12);
        const a = rng.int(1, 6);
        const b = rng.int(1, 5);
        const ans = Q.of(a * (K - xs), b * K);
        return numberProblem({
          prompt: t(
            `Find the predator level $y_*$ at the coexistence equilibrium of $x' = ${a === 1 ? "" : a}x\\left(1 - \\frac{x}{${K}}\\right) - ${b === 1 ? "" : b}xy$, $y' = ${poly([-c, "y"], [d, "xy"])}$.`,
            `求 $x' = ${a === 1 ? "" : a}x\\left(1 - \\frac{x}{${K}}\\right) - ${b === 1 ? "" : b}xy$，$y' = ${poly([-c, "y"], [d, "xy"])}$ 的共存平衡点处的捕食者数量 $y_*$。`,
          ),
          answer: ans,
          wrong: [Q.of(a, b), Q.of(a * (K - xs), K), Q.of(K - xs, b), Q.of(a * xs, b * K)],
          solution: t(
            `From $y' = 0$: $x_* = \\frac{${c}}{${d}} = ${xs}$. Then $y_* = \\frac{${a}}{${b}}\\left(1 - \\frac{${xs}}{${K}}\\right) = ${ans.toLatex()}$.`,
            `由 $y' = 0$ 得 $x_* = \\frac{${c}}{${d}} = ${xs}$。于是 $y_* = \\frac{${a}}{${b}}\\left(1 - \\frac{${xs}}{${K}}\\right) = ${ans.toLatex()}$。`,
          ),
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
