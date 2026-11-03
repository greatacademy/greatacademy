import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly } from "@ga/subject-math";
import { article, numberProblem } from "../problems.ts";

export const mathematicsForMachineLearningMatrixCalculusTopics: TopicDef[] = [
  // 9.28.7 Gradients With Respect to a Variable Subset
  {
    id: "gradients-with-respect-to-a-variable-subset",
    title: t("Gradients With Respect to a Variable Subset", "关于子变量的梯度"),
    summary: t(
      "For $f(\\mathbf{x}, \\mathbf{y})$ with $\\mathbf{x} \\in \\mathbb{R}^n$ and $\\mathbf{y} \\in \\mathbb{R}^m$, the gradient with respect to $\\mathbf{x}$ is $\\nabla_{\\mathbf{x}} f = \\left[\\frac{\\partial f}{\\partial x_1}, \\dots, \\frac{\\partial f}{\\partial x_n}\\right]^T$, treating $\\mathbf{y}$ as constant.",
      "对于 $f(\\mathbf{x}, \\mathbf{y})$（$\\mathbf{x} \\in \\mathbb{R}^n$，$\\mathbf{y} \\in \\mathbb{R}^m$），关于 $\\mathbf{x}$ 的梯度为 $\\nabla_{\\mathbf{x}} f = \\left[\\frac{\\partial f}{\\partial x_1}, \\dots, \\frac{\\partial f}{\\partial x_n}\\right]^T$，此时把 $\\mathbf{y}$ 视为常数。",
    ),
    prerequisites: ["the-multivariable-chain-rule-in-vector-form"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-subset-gradients",
        title: t("Evaluating gradients with respect to parameter subsets", "求关于参数子集的梯度"),
        explanation: t(
          "For $f(\\mathbf{w}, b) = \\|\\mathbf{y} - (X\\mathbf{w} + b\\mathbf{1})\\|^2$, holding the bias $b$ constant gives $\\nabla_{\\mathbf{w}} f = -2X^T(\\mathbf{y} - (X\\mathbf{w} + b\\mathbf{1}))$.",
          "对于 $f(\\mathbf{w}, b) = \\|\\mathbf{y} - (X\\mathbf{w} + b\\mathbf{1})\\|^2$，固定偏置 $b$ 时有 $\\nabla_{\\mathbf{w}} f = -2X^T(\\mathbf{y} - (X\\mathbf{w} + b\\mathbf{1}))$。",
        ),
        generate: (rng: Rng): Problem => {
          // f(x1, x2, y1, y2) = a*x1*y1 + b*x2*y2 + c*x1^2 + d*x2^2 + e*y1^2
          const a = rng.int(1, 5);
          const b = rng.int(1, 5);
          const c = rng.int(1, 4);
          const d = rng.int(1, 4);

          const x1 = rng.int(-4, 4);
          const x2 = rng.int(-4, 4);
          const y1 = rng.int(-4, 4);
          const y2 = rng.int(-4, 4);

          const askIndex = rng.pick([1, 2]);
          // df/dx1 = a*y1 + 2*c*x1
          // df/dx2 = b*y2 + 2*d*x2
          const ans = askIndex === 1 ? a * y1 + 2 * c * x1 : b * y2 + 2 * d * x2;

          return numberProblem({
            prompt: t(
              `Consider the scalar objective function $f(\\mathbf{x}, \\mathbf{y}) = ${a} x_1 y_1 + ${b} x_2 y_2 + ${c} x_1^2 + ${d} x_2^2$ for vectors $\\mathbf{x} = [x_1, x_2]^T$ and $\\mathbf{y} = [y_1, y_2]^T$. Find the $x_${askIndex}$-component of the gradient vector $\\nabla_{\\mathbf{x}} f(\\mathbf{x}, \\mathbf{y}) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x_1} \\\\[3pt] \\frac{\\partial f}{\\partial x_2} \\end{bmatrix}$ evaluated at $\\mathbf{x} = [${x1}, ${x2}]^T$ and $\\mathbf{y} = [${y1}, ${y2}]^T$.`,
              `考虑标量目标函数 $f(\\mathbf{x}, \\mathbf{y}) = ${a} x_1 y_1 + ${b} x_2 y_2 + ${c} x_1^2 + ${d} x_2^2$，其中向量 $\\mathbf{x} = [x_1, x_2]^T$ 且 $\\mathbf{y} = [y_1, y_2]^T$。在点 $\\mathbf{x} = [${x1}, ${x2}]^T$ 和 $\\mathbf{y} = [${y1}, ${y2}]^T$ 处，求关于子变量 $\\mathbf{x}$ 的梯度向量 $\\nabla_{\\mathbf{x}} f(\\mathbf{x}, \\mathbf{y}) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x_1} \\\\[3pt] \\frac{\\partial f}{\\partial x_2} \\end{bmatrix}$ 的第 $x_${askIndex}$ 个分量。`,
            ),
            answer: ans,
            solution: t(
              `Holding $\\mathbf{y}$ constant, the partial derivative is $\\frac{\\partial f}{\\partial x_${askIndex}} = ${askIndex === 1 ? `${a} y_1 + 2(${c}) x_1` : `${b} y_2 + 2(${d}) x_2`}$. Substituting $x_${askIndex} = ${askIndex === 1 ? x1 : x2}$ and $y_${askIndex} = ${askIndex === 1 ? y1 : y2}$ yields $${ans}$.`,
              `固定 $\\mathbf{y}$ 时，偏导数为 $\\frac{\\partial f}{\\partial x_${askIndex}} = ${askIndex === 1 ? `${a} y_1 + 2(${c}) x_1` : `${b} y_2 + 2(${d}) x_2`}$。代入 $x_${askIndex} = ${askIndex === 1 ? x1 : x2}$ 和 $y_${askIndex} = ${askIndex === 1 ? y1 : y2}$ 计算得 $${ans}$。`,
            ),
          });
        },
      },
    ],
  },

  // 9.30.1 Total and Tensor Derivatives
  {
    id: "total-and-tensor-derivatives",
    title: t("Total and Tensor Derivatives", "全导数与张量导数"),
    summary: t(
      "The total derivative $Df(\\mathbf{x})$ of $f: \\mathbb{R}^n \\to \\mathbb{R}^m$ is the unique linear map with $\\lim_{\\mathbf{h} \\to \\mathbf{0}} \\frac{\\|f(\\mathbf{x} + \\mathbf{h}) - f(\\mathbf{x}) - Df(\\mathbf{x})\\mathbf{h}\\|}{\\|\\mathbf{h}\\|} = 0$; its matrix is the $m \\times n$ Jacobian $J_f(\\mathbf{x})$.",
      "映射 $f: \\mathbb{R}^n \\to \\mathbb{R}^m$ 的全导数 $Df(\\mathbf{x})$ 是满足 $\\lim_{\\mathbf{h} \\to \\mathbf{0}} \\frac{\\|f(\\mathbf{x} + \\mathbf{h}) - f(\\mathbf{x}) - Df(\\mathbf{x})\\mathbf{h}\\|}{\\|\\mathbf{h}\\|} = 0$ 的唯一线性映射，其矩阵是 $m \\times n$ 的雅可比矩阵 $J_f(\\mathbf{x})$。",
    ),
    prerequisites: ["the-derivative-of-a-multivariable-function"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-total-derivatives-on-vectors",
        title: t("Applying total derivatives to direction vectors", "将全导数作用于方向向量"),
        explanation: t(
          "$D\\mathbf{f}(\\mathbf{x})(\\mathbf{v}) = J_{\\mathbf{f}}(\\mathbf{x}) \\mathbf{v}$ is the directional differential, which linearly approximates $\\mathbf{f}(\\mathbf{x} + \\mathbf{v}) - \\mathbf{f}(\\mathbf{x})$.",
          "$D\\mathbf{f}(\\mathbf{x})(\\mathbf{v}) = J_{\\mathbf{f}}(\\mathbf{x}) \\mathbf{v}$ 为方向微分，它线性逼近 $\\mathbf{f}(\\mathbf{x} + \\mathbf{v}) - \\mathbf{f}(\\mathbf{x})$。",
        ),
        generate: (rng: Rng): Problem => {
          // f: R^2 -> R^2: f1(x, y) = a*x^2 + b*y, f2(x, y) = c*x*y + d
          const a = rng.int(1, 4);
          const b = rng.int(-4, 5);
          const c = rng.int(1, 4);
          const d = rng.int(-5, 5);

          const x0 = rng.int(-3, 3);
          const y0 = rng.int(-3, 3);

          const v1 = rng.int(-3, 3);
          const v2 = rng.int(-3, 3);

          // J = [[2*a*x, b], [c*y, c*x]]
          const j11 = 2 * a * x0;
          const j12 = b;
          const j21 = c * y0;
          const j22 = c * x0;

          // Df(x0)(v) = [j11*v1 + j12*v2, j21*v1 + j22*v2]
          const res1 = j11 * v1 + j12 * v2;
          const res2 = j21 * v1 + j22 * v2;

          const askComponent = rng.pick([1, 2]);
          const ans = askComponent === 1 ? res1 : res2;

          return numberProblem({
            prompt: t(
              `Let $\\mathbf{f}: \\mathbb{R}^2 \\to \\mathbb{R}^2$ be given by $\\mathbf{f}(x, y) = \\begin{bmatrix} ${poly([a, "x^2"], [b, "y"])} \\\\[3pt] ${poly([c, "xy"], [d, ""])} \\end{bmatrix}$. Find the ${askComponent === 1 ? "first" : "second"} component of the total differential $D\\mathbf{f}(\\mathbf{x}_0)(\\mathbf{v}) = J_{\\mathbf{f}}(\\mathbf{x}_0) \\mathbf{v}$ at $\\mathbf{x}_0 = (${x0}, ${y0})$ in the direction $\\mathbf{v} = \\begin{bmatrix} ${v1} \\\\[3pt] ${v2} \\end{bmatrix}$.`,
              `设映射 $\\mathbf{f}: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 为 $\\mathbf{f}(x, y) = \\begin{bmatrix} ${poly([a, "x^2"], [b, "y"])} \\\\[3pt] ${poly([c, "xy"], [d, ""])} \\end{bmatrix}$。在点 $\\mathbf{x}_0 = (${x0}, ${y0})$ 处，求全微分 $D\\mathbf{f}(\\mathbf{x}_0)(\\mathbf{v}) = J_{\\mathbf{f}}(\\mathbf{x}_0) \\mathbf{v}$ 沿方向 $\\mathbf{v} = \\begin{bmatrix} ${v1} \\\\[3pt] ${v2} \\end{bmatrix}$ 的第 ${askComponent === 1 ? "一" : "二"}个分量。`,
            ),
            answer: ans,
            solution: t(
              `The Jacobian matrix is $J_{\\mathbf{f}}(x, y) = \\begin{bmatrix} 2(${a})x & ${b} \\\\ ${poly([c, "y"])} & ${poly([c, "x"])} \\end{bmatrix}$. At $\\mathbf{x}_0 = (${x0}, ${y0})$, $J_{\\mathbf{f}}(\\mathbf{x}_0) = \\begin{bmatrix} ${j11} & ${j12} \\\\ ${j21} & ${j22} \\end{bmatrix}$. Multiplying by $\\mathbf{v}$ yields $D\\mathbf{f}(\\mathbf{x}_0)(\\mathbf{v}) = \\begin{bmatrix} (${j11})(${v1}) + (${j12})(${v2}) \\\\[3pt] (${j21})(${v1}) + (${j22})(${v2}) \\end{bmatrix} = \\begin{bmatrix} ${res1} \\\\[3pt] ${res2} \\end{bmatrix}$. The requested component is $${ans}$.`,
              `雅可比矩阵为 $J_{\\mathbf{f}}(x, y) = \\begin{bmatrix} 2(${a})x & ${b} \\\\ ${poly([c, "y"])} & ${poly([c, "x"])} \\end{bmatrix}$。在点 $\\mathbf{x}_0 = (${x0}, ${y0})$ 处，有 $J_{\\mathbf{f}}(\\mathbf{x}_0) = \\begin{bmatrix} ${j11} & ${j12} \\\\ ${j21} & ${j22} \\end{bmatrix}$。与 $\\mathbf{v}$ 相乘得 $D\\mathbf{f}(\\mathbf{x}_0)(\\mathbf{v}) = \\begin{bmatrix} (${j11})(${v1}) + (${j12})(${v2}) \\\\[3pt] (${j21})(${v1}) + (${j22})(${v2}) \\end{bmatrix} = \\begin{bmatrix} ${res1} \\\\[3pt] ${res2} \\end{bmatrix}$。所求分量为 $${ans}$。`,
            ),
          });
        },
      },
    ],
  },

  // 9.30.2 The Chain Rule for Total Derivatives
  {
    id: "the-chain-rule-for-total-derivatives",
    title: t("The Chain Rule for Total Derivatives", "全导数的链式法则"),
    summary: t(
      "For a composition $g \\circ f$, $D(g \\circ f)(\\mathbf{x}) = Dg(f(\\mathbf{x})) \\circ Df(\\mathbf{x})$; in matrices, $J_{g \\circ f}(\\mathbf{x}) = J_g(f(\\mathbf{x}))\\,J_f(\\mathbf{x})$.",
      "对于复合映射 $g \\circ f$，$D(g \\circ f)(\\mathbf{x}) = Dg(f(\\mathbf{x})) \\circ Df(\\mathbf{x})$；用矩阵表示即 $J_{g \\circ f}(\\mathbf{x}) = J_g(f(\\mathbf{x}))\\,J_f(\\mathbf{x})$。",
    ),
    prerequisites: ["total-and-tensor-derivatives"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "multiplying-jacobians-chain-rule",
        title: t("Computing Jacobian of composite functions via matrix multiplication", "通过矩阵乘法计算复合映射的雅可比矩阵"),
        explanation: t(
          "$J_{g \\circ f}(\\mathbf{x}) = J_g(\\mathbf{y}) \\, J_f(\\mathbf{x})$, where $\\mathbf{y} = f(\\mathbf{x})$. Entry $(i, j)$ is $\\sum_k (J_g)_{ik} (J_f)_{kj}$.",
          "$J_{g \\circ f}(\\mathbf{x}) = J_g(\\mathbf{y}) \\, J_f(\\mathbf{x})$，其中 $\\mathbf{y} = f(\\mathbf{x})$。第 $(i, j)$ 个元素为 $\\sum_k (J_g)_{ik} (J_f)_{kj}$。",
        ),
        generate: (rng: Rng): Problem => {
          // 2x2 Jacobians
          const jf = [
            [rng.int(-3, 4), rng.int(-3, 4)],
            [rng.int(-3, 4), rng.int(-3, 4)],
          ];
          const jg = [
            [rng.int(-3, 4), rng.int(-3, 4)],
            [rng.int(-3, 4), rng.int(-3, 4)],
          ];

          const targetRow = rng.int(1, 2);
          const targetCol = rng.int(1, 2);

          // (Jg * Jf)_{row, col}
          const r = targetRow - 1;
          const c = targetCol - 1;
          const ans = jg[r]![0]! * jf[0]![c]! + jg[r]![1]! * jf[1]![c]!;

          const formatMat = (M: number[][]) =>
            `\\begin{bmatrix} ${M[0]![0]} & ${M[0]![1]} \\\\[3pt] ${M[1]![0]} & ${M[1]![1]} \\end{bmatrix}`;

          return numberProblem({
            prompt: t(
              `Let $\\mathbf{f}: \\mathbb{R}^2 \\to \\mathbb{R}^2$ and $\\mathbf{g}: \\mathbb{R}^2 \\to \\mathbb{R}^2$. At point $\\mathbf{x}_0$, the Jacobian matrix of $\\mathbf{f}$ is $J_{\\mathbf{f}}(\\mathbf{x}_0) = ${formatMat(jf)}$, and at $\\mathbf{y}_0 = \\mathbf{f}(\\mathbf{x}_0)$, the Jacobian of $\\mathbf{g}$ is $J_{\\mathbf{g}}(\\mathbf{y}_0) = ${formatMat(jg)}$. Let $\\mathbf{h} = \\mathbf{g} \\circ \\mathbf{f}$. Find the entry in row $${targetRow}$, column $${targetCol}$ of the composite Jacobian matrix $J_{\\mathbf{h}}(\\mathbf{x}_0) = J_{\\mathbf{g}}(\\mathbf{y}_0) J_{\\mathbf{f}}(\\mathbf{x}_0)$.`,
              `设映射 $\\mathbf{f}: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 与 $\\mathbf{g}: \\mathbb{R}^2 \\to \\mathbb{R}^2$。在点 $\\mathbf{x}_0$ 处，$\\mathbf{f}$ 的雅可比矩阵为 $J_{\\mathbf{f}}(\\mathbf{x}_0) = ${formatMat(jf)}$；在 $\\mathbf{y}_0 = \\mathbf{f}(\\mathbf{x}_0)$ 处，$\\mathbf{g}$ 的雅可比矩阵为 $J_{\\mathbf{g}}(\\mathbf{y}_0) = ${formatMat(jg)}$。设 $\\mathbf{h} = \\mathbf{g} \\circ \\mathbf{f}$。求复合映射雅可比矩阵 $J_{\\mathbf{h}}(\\mathbf{x}_0) = J_{\\mathbf{g}}(\\mathbf{y}_0) J_{\\mathbf{f}}(\\mathbf{x}_0)$ 第 $${targetRow}$ 行第 $${targetCol}$ 列的元素。`,
            ),
            answer: ans,
            solution: t(
              `By the chain rule for total derivatives, $J_{\\mathbf{h}} = J_{\\mathbf{g}} J_{\\mathbf{f}}$. Entry $(${targetRow}, ${targetCol})$ is the dot product of row $${targetRow}$ of $J_{\\mathbf{g}}$ and column $${targetCol}$ of $J_{\\mathbf{f}}$: $(${jg[r]![0]})(${jf[0]![c]}) + (${jg[r]![1]})(${jf[1]![c]}) = ${ans}$.`,
              `由全导数的链式法则，$J_{\\mathbf{h}} = J_{\\mathbf{g}} J_{\\mathbf{f}}$。第 $(${targetRow}, ${targetCol})$ 个元素为 $J_{\\mathbf{g}}$ 的第 $${targetRow}$ 行与 $J_{\\mathbf{f}}$ 的第 $${targetCol}$ 列的点积：$(${jg[r]![0]})(${jf[0]![c]}) + (${jg[r]![1]})(${jf[1]![c]}) = ${ans}$。`,
            ),
          });
        },
      },
    ],
  },

  // 9.30.3 Vector Gradients
  {
    id: "vector-gradients",
    title: t("Vector Gradients", "向量梯度"),
    summary: t(
      "Basic gradient identities: $\\nabla_{\\mathbf{x}}(\\mathbf{a}^T\\mathbf{x}) = \\mathbf{a}$ and $\\nabla_{\\mathbf{x}}(\\mathbf{x}^T A\\mathbf{x}) = (A + A^T)\\mathbf{x}$. For symmetric $A$, $\\nabla_{\\mathbf{x}}(\\mathbf{x}^T A\\mathbf{x}) = 2A\\mathbf{x}$.",
      "基本梯度公式：$\\nabla_{\\mathbf{x}}(\\mathbf{a}^T\\mathbf{x}) = \\mathbf{a}$，$\\nabla_{\\mathbf{x}}(\\mathbf{x}^T A\\mathbf{x}) = (A + A^T)\\mathbf{x}$。当 $A$ 对称时，$\\nabla_{\\mathbf{x}}(\\mathbf{x}^T A\\mathbf{x}) = 2A\\mathbf{x}$。",
    ),
    prerequisites: ["the-chain-rule-for-total-derivatives"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-quadratic-form-vector-gradients",
        title: t("Evaluating gradients of quadratic forms and linear terms", "求二次型与线性项关于向量的梯度"),
        explanation: t(
          "For $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x} + \\mathbf{b}^T \\mathbf{x}$, $\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = (A + A^T)\\mathbf{x} + \\mathbf{b}$.",
          "对于 $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x} + \\mathbf{b}^T \\mathbf{x}$，$\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = (A + A^T)\\mathbf{x} + \\mathbf{b}$。",
        ),
        generate: (rng: Rng): Problem => {
          // Symmetric 2x2 matrix A = [[a, b], [b, c]]
          const a = rng.int(-4, 5);
          const b = rng.int(-4, 5);
          const c = rng.int(-4, 5);
          const b1 = rng.int(-5, 6);
          const b2 = rng.int(-5, 6);

          const x1 = rng.int(-4, 4);
          const x2 = rng.int(-4, 4);

          // ∇_x f = 2Ax + b
          // 2*(a*x1 + b*x2) + b1
          // 2*(b*x1 + c*x2) + b2
          const g1 = 2 * (a * x1 + b * x2) + b1;
          const g2 = 2 * (b * x1 + c * x2) + b2;

          const askIdx = rng.pick([1, 2]);
          const ans = askIdx === 1 ? g1 : g2;

          const aMat = `\\begin{pmatrix} ${a} & ${b} \\\\[3pt] ${b} & ${c} \\end{pmatrix}`;
          const bVec = `\\begin{bmatrix} ${b1} \\\\[3pt] ${b2} \\end{bmatrix}`;
          const xVec = `\\begin{bmatrix} ${x1} \\\\[3pt] ${x2} \\end{bmatrix}`;

          return numberProblem({
            prompt: t(
              `Let $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x} + \\mathbf{b}^T \\mathbf{x}$ for $\\mathbf{x} \\in \\mathbb{R}^2$, where $A = ${aMat}$ and $\\mathbf{b} = ${bVec}$. Evaluate the gradient $\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = 2A\\mathbf{x} + \\mathbf{b}$ at $\\mathbf{x} = ${xVec}$, and report its $x_${askIdx}$-component.`,
              `设 $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x} + \\mathbf{b}^T \\mathbf{x}$，其中 $\\mathbf{x} \\in \\mathbb{R}^2$，$A = ${aMat}$ 且 $\\mathbf{b} = ${bVec}$。在 $\\mathbf{x} = ${xVec}$ 处计算梯度 $\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = 2A\\mathbf{x} + \\mathbf{b}$，并给出其第 $x_${askIdx}$ 个分量。`,
            ),
            answer: ans,
            solution: t(
              `Since $A$ is symmetric, $\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = 2 A \\mathbf{x} + \\mathbf{b} = 2 ${aMat} ${xVec} + ${bVec} = \\begin{bmatrix} 2(${a * x1 + b * x2}) + ${paren(b1)} \\\\[3pt] 2(${b * x1 + c * x2}) + ${paren(b2)} \\end{bmatrix} = \\begin{bmatrix} ${g1} \\\\[3pt] ${g2} \\end{bmatrix}$. The requested component is $${ans}$.`,
              `由于 $A$ 是对称矩阵，$\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = 2 A \\mathbf{x} + \\mathbf{b} = 2 ${aMat} ${xVec} + ${bVec} = \\begin{bmatrix} 2(${a * x1 + b * x2}) + ${paren(b1)} \\\\[3pt] 2(${b * x1 + c * x2}) + ${paren(b2)} \\end{bmatrix} = \\begin{bmatrix} ${g1} \\\\[3pt] ${g2} \\end{bmatrix}$。所求分量为 $${ans}$。`,
            ),
          });
        },
      },
    ],
  },

  // 9.30.4 Further Vector Gradients
  {
    id: "further-vector-gradients",
    title: t("Further Vector Gradients", "进阶向量梯度"),
    summary: t(
      "Gradients of distance and least-squares functions: $\\nabla_{\\mathbf{x}}\\|\\mathbf{x} - \\mathbf{y}\\|^2 = 2(\\mathbf{x} - \\mathbf{y})$ and $\\nabla_{\\mathbf{x}}\\|A\\mathbf{x} - \\mathbf{b}\\|^2 = 2A^T(A\\mathbf{x} - \\mathbf{b})$. Setting the latter to zero gives the normal equations $A^TA\\mathbf{x} = A^T\\mathbf{b}$.",
      "距离与最小二乘函数的梯度：$\\nabla_{\\mathbf{x}}\\|\\mathbf{x} - \\mathbf{y}\\|^2 = 2(\\mathbf{x} - \\mathbf{y})$，$\\nabla_{\\mathbf{x}}\\|A\\mathbf{x} - \\mathbf{b}\\|^2 = 2A^T(A\\mathbf{x} - \\mathbf{b})$。令后者为零即得正规方程 $A^TA\\mathbf{x} = A^T\\mathbf{b}$。",
    ),
    prerequisites: ["vector-gradients"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-least-squares-gradients",
        title: t("Evaluating gradients of least-squares objective functions", "计算最小二乘目标函数的梯度"),
        explanation: t(
          "For $f(\\mathbf{x}) = \\|A\\mathbf{x} - \\mathbf{b}\\|^2 = (A\\mathbf{x} - \\mathbf{b})^T (A\\mathbf{x} - \\mathbf{b})$, $\\nabla_{\\mathbf{x}} f = 2A^T(A\\mathbf{x} - \\mathbf{b})$.",
          "对于 $f(\\mathbf{x}) = \\|A\\mathbf{x} - \\mathbf{b}\\|^2 = (A\\mathbf{x} - \\mathbf{b})^T (A\\mathbf{x} - \\mathbf{b})$，$\\nabla_{\\mathbf{x}} f = 2A^T(A\\mathbf{x} - \\mathbf{b})$。",
        ),
        generate: (rng: Rng): Problem => {
          // A is 2x2, b is 2x1, x is 2x1
          const a11 = rng.int(-2, 3);
          const a12 = rng.int(-2, 3);
          const a21 = rng.int(-2, 3);
          const a22 = rng.int(-2, 3);

          const x1 = rng.int(-3, 3);
          const x2 = rng.int(-3, 3);

          const b1 = rng.int(-4, 4);
          const b2 = rng.int(-4, 4);

          // r = Ax - b
          const r1 = a11 * x1 + a12 * x2 - b1;
          const r2 = a21 * x1 + a22 * x2 - b2;

          // 2 * A^T * r
          // grad = 2 * [a11*r1 + a21*r2, a12*r1 + a22*r2]
          const g1 = 2 * (a11 * r1 + a21 * r2);
          const g2 = 2 * (a12 * r1 + a22 * r2);

          const askIdx = rng.pick([1, 2]);
          const ans = askIdx === 1 ? g1 : g2;

          const aMat = `\\begin{bmatrix} ${a11} & ${a12} \\\\[3pt] ${a21} & ${a22} \\end{bmatrix}`;
          const bVec = `\\begin{bmatrix} ${b1} \\\\[3pt] ${b2} \\end{bmatrix}`;
          const xVec = `\\begin{bmatrix} ${x1} \\\\[3pt] ${x2} \\end{bmatrix}`;

          return numberProblem({
            prompt: t(
              `Consider the least-squares residual objective $f(\\mathbf{x}) = \\|A\\mathbf{x} - \\mathbf{b}\\|^2$, where $A = ${aMat}$ and $\\mathbf{b} = ${bVec}$. Evaluate the gradient $\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = 2 A^T (A\\mathbf{x} - \\mathbf{b})$ at $\\mathbf{x} = ${xVec}$, and find its $x_${askIdx}$-component.`,
              `考虑最小二乘残差目标函数 $f(\\mathbf{x}) = \\|A\\mathbf{x} - \\mathbf{b}\\|^2$，其中 $A = ${aMat}$ 且 $\\mathbf{b} = ${bVec}$。在点 $\\mathbf{x} = ${xVec}$ 处求梯度 $\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = 2 A^T (A\\mathbf{x} - \\mathbf{b})$，并给出其第 $x_${askIdx}$ 个分量。`,
            ),
            answer: ans,
            solution: t(
              `First, the residual vector is $\\mathbf{r} = A\\mathbf{x} - \\mathbf{b} = \\begin{bmatrix} (${a11})(${x1}) + (${a12})(${x2}) - (${b1}) \\\\[3pt] (${a21})(${x1}) + (${a22})(${x2}) - (${b2}) \\end{bmatrix} = \\begin{bmatrix} ${r1} \\\\[3pt] ${r2} \\end{bmatrix}$. Then $2 A^T \\mathbf{r} = 2 \\begin{bmatrix} ${a11} & ${a21} \\\\[3pt] ${a12} & ${a22} \\end{bmatrix} \\begin{bmatrix} ${r1} \\\\[3pt] ${r2} \\end{bmatrix} = \\begin{bmatrix} ${g1} \\\\[3pt] ${g2} \\end{bmatrix}$. Component $${askIdx}$ is $${ans}$.`,
              `首先计算残差向量 $\\mathbf{r} = A\\mathbf{x} - \\mathbf{b} = \\begin{bmatrix} (${a11})(${x1}) + (${a12})(${x2}) - (${b1}) \\\\[3pt] (${a21})(${x1}) + (${a22})(${x2}) - (${b2}) \\end{bmatrix} = \\begin{bmatrix} ${r1} \\\\[3pt] ${r2} \\end{bmatrix}$。然后计算 $2 A^T \\mathbf{r} = 2 \\begin{bmatrix} ${a11} & ${a21} \\\\[3pt] ${a12} & ${a22} \\end{bmatrix} \\begin{bmatrix} ${r1} \\\\[3pt] ${r2} \\end{bmatrix} = \\begin{bmatrix} ${g1} \\\\[3pt] ${g2} \\end{bmatrix}$。第 $${askIdx}$ 个分量为 $${ans}$。`,
            ),
          });
        },
      },
    ],
  },

  // 9.30.5 Matrix Gradients
  {
    id: "matrix-gradients",
    title: t("Matrix Gradients", "矩阵梯度"),
    summary: t(
      "The gradient of a scalar function $f(X)$ with respect to a matrix $X$ has entries $(\\nabla_X f)_{ij} = \\frac{\\partial f}{\\partial X_{ij}}$. Key identities include $\\nabla_X(\\mathbf{a}^T X\\mathbf{b}) = \\mathbf{a}\\mathbf{b}^T$ and $\\nabla_X \\operatorname{tr}(AX) = A^T$.",
      "标量函数 $f(X)$ 关于矩阵 $X$ 的梯度的元素为 $(\\nabla_X f)_{ij} = \\frac{\\partial f}{\\partial X_{ij}}$。常用公式包括 $\\nabla_X(\\mathbf{a}^T X\\mathbf{b}) = \\mathbf{a}\\mathbf{b}^T$ 与 $\\nabla_X \\operatorname{tr}(AX) = A^T$。",
    ),
    prerequisites: ["further-vector-gradients"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "evaluating-matrix-derivative-identities",
        title: t("Evaluating matrix gradients of bilinear forms and traces", "计算双线性形式与迹的矩阵梯度"),
        explanation: t(
          "$\\nabla_X (\\mathbf{a}^T X \\mathbf{b}) = \\mathbf{a} \\mathbf{b}^T$, so entry $(i, j)$ of $\\nabla_X (\\mathbf{a}^T X \\mathbf{b})$ is $a_i b_j$.",
          "$\\nabla_X (\\mathbf{a}^T X \\mathbf{b}) = \\mathbf{a} \\mathbf{b}^T$，因此 $\\nabla_X (\\mathbf{a}^T X \\mathbf{b})$ 的第 $(i, j)$ 个元素为 $a_i b_j$。",
        ),
        generate: (rng: Rng): Problem => {
          const m = rng.int(2, 3);
          const n = rng.int(2, 3);

          const a: number[] = [];
          for (let i = 0; i < m; i++) a.push(rng.int(-5, 6));
          const b: number[] = [];
          for (let j = 0; j < n; j++) b.push(rng.int(-5, 6));

          const row = rng.int(1, m);
          const col = rng.int(1, n);
          const ans = a[row - 1]! * b[col - 1]!;

          const aVec = `\\mathbf{a} = \\begin{bmatrix} ${a.join(" \\\\ ")} \\end{bmatrix}`;
          const bVec = `\\mathbf{b} = \\begin{bmatrix} ${b.join(" \\\\ ")} \\end{bmatrix}`;

          return numberProblem({
            prompt: t(
              `Let $f(X) = \\mathbf{a}^T X \\mathbf{b}$ for ${article(m)} $${m} \\times ${n}$ matrix $X$, where $${aVec}$ and $${bVec}$. Using the matrix gradient identity $\\nabla_X (\\mathbf{a}^T X \\mathbf{b}) = \\mathbf{a} \\mathbf{b}^T$, find the entry in row $${row}$, column $${col}$ of the gradient matrix $\\nabla_X f$.`,
              `设 $f(X) = \\mathbf{a}^T X \\mathbf{b}$，其中 $X$ 为 $${m} \\times ${n}$ 矩阵，$${aVec}$ 且 $${bVec}$。利用矩阵梯度公式 $\\nabla_X (\\mathbf{a}^T X \\mathbf{b}) = \\mathbf{a} \\mathbf{b}^T$，求梯度矩阵 $\\nabla_X f$ 的第 $${row}$ 行第 $${col}$ 列元素。`,
            ),
            answer: ans,
            solution: t(
              `The gradient matrix is $\\nabla_X f = \\mathbf{a} \\mathbf{b}^T$. The entry at $(row, col) = (${row}, ${col})$ is $a_{${row}} b_{${col}} = (${a[row - 1]})(${b[col - 1]}) = ${ans}$.`,
              `梯度矩阵为 $\\nabla_X f = \\mathbf{a} \\mathbf{b}^T$。第 $(${row}, ${col})$ 个元素即为外积对应项 $a_{${row}} b_{${col}} = (${a[row - 1]})(${b[col - 1]}) = ${ans}$。`,
            ),
          });
        },
      },
    ],
  },
];
