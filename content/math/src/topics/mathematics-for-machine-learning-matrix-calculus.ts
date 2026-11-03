import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, paren, poly, Q } from "@ga/subject-math";
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
          "A gradient with respect to some of the parameters treats all the others as constants, just as a partial derivative does for one variable. For $f(\\mathbf{w}, b) = \\|\\mathbf{y} - (X\\mathbf{w} + b\\mathbf{1})\\|^2$, holding the bias $b$ constant gives $\\nabla_{\\mathbf{w}} f = -2X^T(\\mathbf{y} - (X\\mathbf{w} + b\\mathbf{1}))$.",
          "对部分参数求梯度时，把其他所有参数都当作常数，就像对一个变量求偏导数一样。对于 $f(\\mathbf{w}, b) = \\|\\mathbf{y} - (X\\mathbf{w} + b\\mathbf{1})\\|^2$，固定偏置 $b$ 时有 $\\nabla_{\\mathbf{w}} f = -2X^T(\\mathbf{y} - (X\\mathbf{w} + b\\mathbf{1}))$。",
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
            wrong: [
              askIndex === 1 ? a * y1 + c * x1 : b * y2 + d * x2,
              askIndex === 1 ? a * y1 : b * y2,
              askIndex === 1 ? 2 * c * x1 : 2 * d * x2,
            ],
            solution: t(
              `Holding $\\mathbf{y}$ constant, the partial derivative is $\\frac{\\partial f}{\\partial x_${askIndex}} = ${askIndex === 1 ? `${a} y_1 + 2(${c}) x_1` : `${b} y_2 + 2(${d}) x_2`}$. Substituting $x_${askIndex} = ${askIndex === 1 ? x1 : x2}$ and $y_${askIndex} = ${askIndex === 1 ? y1 : y2}$ yields $${ans}$.`,
              `固定 $\\mathbf{y}$ 时，偏导数为 $\\frac{\\partial f}{\\partial x_${askIndex}} = ${askIndex === 1 ? `${a} y_1 + 2(${c}) x_1` : `${b} y_2 + 2(${d}) x_2`}$。代入 $x_${askIndex} = ${askIndex === 1 ? x1 : x2}$ 和 $y_${askIndex} = ${askIndex === 1 ? y1 : y2}$ 计算得 $${ans}$。`,
            ),
          });
        },
      },
      {
        id: "the-gradient-with-respect-to-the-bias",
        title: t("The gradient of a squared loss with respect to the bias", "平方损失关于偏置的梯度"),
        explanation: t(
          "Splitting the parameters of a model into weights and a bias lets each gradient be taken on its own, holding the other part fixed. For the line model $\\hat{y}_i = w x_i + b$ with loss $L(w, b) = \\sum_i (y_i - w x_i - b)^2$, holding $w$ fixed and differentiating each square by the chain rule gives\n$$\\frac{\\partial L}{\\partial b} = -2 \\sum_i (y_i - w x_i - b),$$\nminus twice the sum of the residuals. With the points $(1, 4), (2, 5)$ and $w = 1$, $b = 1$, the residuals are $2$ and $2$, so $\\frac{\\partial L}{\\partial b} = -8$: increasing $b$ lowers the loss.",
          "把模型参数分成权重和偏置后，可以固定一部分，对另一部分单独求梯度。对直线模型 $\\hat{y}_i = w x_i + b$，损失为 $L(w, b) = \\sum_i (y_i - w x_i - b)^2$，固定 $w$，并用链式法则对每个平方求导，得\n$$\\frac{\\partial L}{\\partial b} = -2 \\sum_i (y_i - w x_i - b),$$\n即残差之和的 $-2$ 倍。对点 $(1, 4), (2, 5)$，取 $w = 1$，$b = 1$，残差为 $2$ 和 $2$，所以 $\\frac{\\partial L}{\\partial b} = -8$：增大 $b$ 会降低损失。",
        ),
        generate: (rng: Rng): Problem => {
          const xs = rng.sample([-3, -2, -1, 0, 1, 2, 3, 4], 3);
          const ys = xs.map(() => rng.int(-6, 9));
          const w = rng.int(-3, 3);
          const b = rng.int(-4, 4);
          const residuals = xs.map((x, i) => ys[i]! - w * x - b);
          const sum = residuals.reduce((s, r) => s + r, 0);
          const ans = -2 * sum;
          const pts = xs.map((x, i) => `(${x}, ${ys[i]})`).join(", ");
          const rs = residuals.map((r) => paren(r)).join(" + ");
          return numberProblem({
            prompt: t(
              `A line model $\\hat{y} = w x + b$ is fit to the points $${pts}$ with loss $L(w, b) = \\sum_i (y_i - w x_i - b)^2$. Find $\\frac{\\partial L}{\\partial b}$ at $w = ${w}$, $b = ${b}$.`,
              `用直线模型 $\\hat{y} = w x + b$ 拟合点 $${pts}$，损失为 $L(w, b) = \\sum_i (y_i - w x_i - b)^2$。求 $w = ${w}$，$b = ${b}$ 时的 $\\frac{\\partial L}{\\partial b}$。`,
            ),
            answer: ans,
            wrong: [2 * sum, -sum, -2 * xs.reduce((s, x, i) => s + x * residuals[i]!, 0)],
            solution: t(
              `Holding $w$ fixed, $\\frac{\\partial L}{\\partial b} = -2 \\sum_i (y_i - w x_i - b)$. The residuals at $w = ${w}$, $b = ${b}$ are $${residuals.join(", ")}$, so $\\frac{\\partial L}{\\partial b} = -2(${rs}) = ${ans}$.`,
              `固定 $w$，$\\frac{\\partial L}{\\partial b} = -2 \\sum_i (y_i - w x_i - b)$。在 $w = ${w}$，$b = ${b}$ 时残差为 $${residuals.join(", ")}$，所以 $\\frac{\\partial L}{\\partial b} = -2(${rs}) = ${ans}$。`,
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
          "The total derivative is a linear map, so applying it to a direction means multiplying the Jacobian matrix by that direction vector. $D\\mathbf{f}(\\mathbf{x})(\\mathbf{v}) = J_{\\mathbf{f}}(\\mathbf{x}) \\mathbf{v}$ is the directional differential, which linearly approximates $\\mathbf{f}(\\mathbf{x} + \\mathbf{v}) - \\mathbf{f}(\\mathbf{x})$.",
          "全导数是一个线性映射，所以把它作用于一个方向，就是用雅可比矩阵乘以这个方向向量。$D\\mathbf{f}(\\mathbf{x})(\\mathbf{v}) = J_{\\mathbf{f}}(\\mathbf{x}) \\mathbf{v}$ 为方向微分，它线性逼近 $\\mathbf{f}(\\mathbf{x} + \\mathbf{v}) - \\mathbf{f}(\\mathbf{x})$。",
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
            wrong: [
              askComponent === 1 ? res2 : res1,
              askComponent === 1 ? j11 * v1 + j21 * v2 : j12 * v1 + j22 * v2,
              askComponent === 1 ? a * x0 * v1 + j12 * v2 : j21 * v2 + j22 * v1,
            ],
            solution: t(
              `The Jacobian matrix is $J_{\\mathbf{f}}(x, y) = \\begin{bmatrix} 2(${a})x & ${b} \\\\ ${poly([c, "y"])} & ${poly([c, "x"])} \\end{bmatrix}$. At $\\mathbf{x}_0 = (${x0}, ${y0})$, $J_{\\mathbf{f}}(\\mathbf{x}_0) = \\begin{bmatrix} ${j11} & ${j12} \\\\ ${j21} & ${j22} \\end{bmatrix}$. Multiplying by $\\mathbf{v}$ yields $D\\mathbf{f}(\\mathbf{x}_0)(\\mathbf{v}) = \\begin{bmatrix} (${j11})(${v1}) + (${j12})(${v2}) \\\\[3pt] (${j21})(${v1}) + (${j22})(${v2}) \\end{bmatrix} = \\begin{bmatrix} ${res1} \\\\[3pt] ${res2} \\end{bmatrix}$. The requested component is $${ans}$.`,
              `雅可比矩阵为 $J_{\\mathbf{f}}(x, y) = \\begin{bmatrix} 2(${a})x & ${b} \\\\ ${poly([c, "y"])} & ${poly([c, "x"])} \\end{bmatrix}$。在点 $\\mathbf{x}_0 = (${x0}, ${y0})$ 处，有 $J_{\\mathbf{f}}(\\mathbf{x}_0) = \\begin{bmatrix} ${j11} & ${j12} \\\\ ${j21} & ${j22} \\end{bmatrix}$。与 $\\mathbf{v}$ 相乘得 $D\\mathbf{f}(\\mathbf{x}_0)(\\mathbf{v}) = \\begin{bmatrix} (${j11})(${v1}) + (${j12})(${v2}) \\\\[3pt] (${j21})(${v1}) + (${j22})(${v2}) \\end{bmatrix} = \\begin{bmatrix} ${res1} \\\\[3pt] ${res2} \\end{bmatrix}$。所求分量为 $${ans}$。`,
            ),
          });
        },
      },
      {
        id: "linear-approximation-from-the-total-derivative",
        title: t("Approximating a nearby value with the total derivative", "用全导数近似邻近的函数值"),
        explanation: t(
          "The defining property of the total derivative is that it is the best linear approximation of the change in $\\mathbf{f}$:\n$$\\mathbf{f}(\\mathbf{x}_0 + \\mathbf{h}) \\approx \\mathbf{f}(\\mathbf{x}_0) + J_{\\mathbf{f}}(\\mathbf{x}_0)\\,\\mathbf{h}$$\nfor a small step $\\mathbf{h}$. For $f(x, y) = x^2 y$ at $(1, 2)$ the Jacobian is the row $[2xy,\\ x^2] = [4,\\ 1]$, so with $\\mathbf{h} = (0.1, -0.2)$, $f(1.1, 1.8) \\approx 2 + 4(0.1) + 1(-0.2) = 2.2$; the exact value is $2.178$.",
          "全导数的定义性质是：它是 $\\mathbf{f}$ 变化量的最佳线性近似：\n$$\\mathbf{f}(\\mathbf{x}_0 + \\mathbf{h}) \\approx \\mathbf{f}(\\mathbf{x}_0) + J_{\\mathbf{f}}(\\mathbf{x}_0)\\,\\mathbf{h}$$\n其中 $\\mathbf{h}$ 是小步长。对于 $f(x, y) = x^2 y$，在 $(1, 2)$ 处雅可比矩阵为行向量 $[2xy,\\ x^2] = [4,\\ 1]$，所以取 $\\mathbf{h} = (0.1, -0.2)$ 时，$f(1.1, 1.8) \\approx 2 + 4(0.1) + 1(-0.2) = 2.2$；精确值为 $2.178$。",
        ),
        generate: (rng: Rng): Problem => {
          const a = rng.int(1, 4);
          const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]);
          const c = rng.int(1, 4);
          const x0 = rng.int(-3, 3);
          const y0 = rng.int(-3, 3);
          const h1 = rng.pick([-3, -2, -1, 1, 2, 3]);
          const h2 = rng.pick([-3, -2, -1, 1, 2, 3]);
          const first = rng.bool();
          // f1 = a x^2 + b y, f2 = c x y; steps are tenths.
          const value = first ? a * x0 * x0 + b * y0 : c * x0 * y0;
          const gx = first ? 2 * a * x0 : c * y0;
          const gy = first ? b : c * x0;
          const ans = Q.of(10 * value + gx * h1 + gy * h2, 10);
          const step = (h: number) => dec(Q.of(h, 10));
          const p1 = dec(Q.of(10 * x0 + h1, 10));
          const p2 = dec(Q.of(10 * y0 + h2, 10));
          const comp = first ? t("first", "第一个") : t("second", "第二个");
          return numberProblem({
            prompt: t(
              `Let $\\mathbf{f}(x, y) = \\begin{bmatrix} ${poly([a, "x^2"], [b, "y"])} \\\\[3pt] ${poly([c, "xy"])} \\end{bmatrix}$. Use the total derivative at $\\mathbf{x}_0 = (${x0}, ${y0})$ to approximate the ${comp.en} component of $\\mathbf{f}(${p1}, ${p2})$.`,
              `设 $\\mathbf{f}(x, y) = \\begin{bmatrix} ${poly([a, "x^2"], [b, "y"])} \\\\[3pt] ${poly([c, "xy"])} \\end{bmatrix}$。用 $\\mathbf{x}_0 = (${x0}, ${y0})$ 处的全导数近似 $\\mathbf{f}(${p1}, ${p2})$ 的${comp["zh-CN"]}分量。`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [Q.of(value), Q.of(gx * h1 + gy * h2, 10), Q.of(10 * value + gx * h2 + gy * h1, 10)],
            solution: t(
              `The step is $\\mathbf{h} = (${step(h1)}, ${step(h2)})$. The ${comp.en} component has value $${value}$ at $\\mathbf{x}_0$ and Jacobian row $[${gx},\\ ${gy}]$ there, so the approximation is $${value} + (${gx})(${step(h1)}) + (${gy})(${step(h2)}) = ${dec(ans)}$.`,
              `步长为 $\\mathbf{h} = (${step(h1)}, ${step(h2)})$。${comp["zh-CN"]}分量在 $\\mathbf{x}_0$ 处的值为 $${value}$，雅可比矩阵对应行为 $[${gx},\\ ${gy}]$，所以近似值为 $${value} + (${gx})(${step(h1)}) + (${gy})(${step(h2)}) = ${dec(ans)}$。`,
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
          "The chain rule for functions of several variables multiplies Jacobian matrices, with the outer function's Jacobian evaluated at the inner function's output. $J_{g \\circ f}(\\mathbf{x}) = J_g(\\mathbf{y}) \\, J_f(\\mathbf{x})$, where $\\mathbf{y} = f(\\mathbf{x})$. Entry $(i, j)$ is $\\sum_k (J_g)_{ik} (J_f)_{kj}$.",
          "多元函数的链式法则是雅可比矩阵相乘，外层函数的雅可比矩阵要在内层函数的输出处求值。$J_{g \\circ f}(\\mathbf{x}) = J_g(\\mathbf{y}) \\, J_f(\\mathbf{x})$，其中 $\\mathbf{y} = f(\\mathbf{x})$。第 $(i, j)$ 个元素为 $\\sum_k (J_g)_{ik} (J_f)_{kj}$。",
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
            wrong: [
              jf[r]![0]! * jg[0]![c]! + jf[r]![1]! * jg[1]![c]!,
              jg[r]![c]! * jf[r]![c]!,
              jg[r]![0]! * jf[c]![0]! + jg[r]![1]! * jf[c]![1]!,
            ],
            solution: t(
              `By the chain rule for total derivatives, $J_{\\mathbf{h}} = J_{\\mathbf{g}} J_{\\mathbf{f}}$. Entry $(${targetRow}, ${targetCol})$ is the dot product of row $${targetRow}$ of $J_{\\mathbf{g}}$ and column $${targetCol}$ of $J_{\\mathbf{f}}$: $(${jg[r]![0]})(${jf[0]![c]}) + (${jg[r]![1]})(${jf[1]![c]}) = ${ans}$.`,
              `由全导数的链式法则，$J_{\\mathbf{h}} = J_{\\mathbf{g}} J_{\\mathbf{f}}$。第 $(${targetRow}, ${targetCol})$ 个元素为 $J_{\\mathbf{g}}$ 的第 $${targetRow}$ 行与 $J_{\\mathbf{f}}$ 的第 $${targetCol}$ 列的点积：$(${jg[r]![0]})(${jf[0]![c]}) + (${jg[r]![1]})(${jf[1]![c]}) = ${ans}$。`,
            ),
          });
        },
      },
      {
        id: "chain-rule-with-explicit-maps",
        title: t("Applying the chain rule to explicit maps", "对具体映射应用链式法则"),
        explanation: t(
          "When the maps are given by formulas, first evaluate the inner map to find where the outer Jacobian is taken, then multiply. For $\\mathbf{f}(x, y) = (x + y,\\ xy)$ and $g(u, v) = u^2 + 3v$, at $(x, y) = (1, 2)$ the inner value is $(u, v) = (3, 2)$. Then $J_g = [2u,\\ 3] = [6,\\ 3]$ and $J_{\\mathbf{f}} = \\begin{bmatrix} 1 & 1 \\\\ y & x \\end{bmatrix} = \\begin{bmatrix} 1 & 1 \\\\ 2 & 1 \\end{bmatrix}$, so\n$$J_{g \\circ \\mathbf{f}} = [6,\\ 3]\\begin{bmatrix} 1 & 1 \\\\ 2 & 1 \\end{bmatrix} = [12,\\ 9].$$\nEvaluating $J_g$ at $(x, y)$ instead of at $\\mathbf{f}(x, y)$ is the usual mistake.",
          "当映射由公式给出时，先计算内层映射的值，确定外层雅可比矩阵在哪一点取值，再相乘。对 $\\mathbf{f}(x, y) = (x + y,\\ xy)$ 与 $g(u, v) = u^2 + 3v$，在 $(x, y) = (1, 2)$ 处内层的值为 $(u, v) = (3, 2)$。于是 $J_g = [2u,\\ 3] = [6,\\ 3]$，$J_{\\mathbf{f}} = \\begin{bmatrix} 1 & 1 \\\\ y & x \\end{bmatrix} = \\begin{bmatrix} 1 & 1 \\\\ 2 & 1 \\end{bmatrix}$，所以\n$$J_{g \\circ \\mathbf{f}} = [6,\\ 3]\\begin{bmatrix} 1 & 1 \\\\ 2 & 1 \\end{bmatrix} = [12,\\ 9].$$\n常见错误是在 $(x, y)$ 而不是在 $\\mathbf{f}(x, y)$ 处计算 $J_g$。",
        ),
        generate: (rng: Rng): Problem => {
          const p = rng.int(1, 3);
          const q = rng.pick([-2, -1, 1, 2, 3]);
          const c = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
          const x0 = rng.pick([-3, -2, -1, 1, 2, 3]);
          const y0 = rng.pick([-3, -2, -1, 1, 2, 3]);
          // f(x, y) = (p x + q y, x y), g(u, v) = u^2 + c v.
          const u = p * x0 + q * y0;
          const v = x0 * y0;
          const byX = rng.bool();
          const ans = byX ? 2 * u * p + c * y0 : 2 * u * q + c * x0;
          const wrongAtX = byX ? 2 * x0 * p + c * y0 : 2 * y0 * q + c * x0;
          const name = byX ? "x" : "y";
          return numberProblem({
            prompt: t(
              `Let $\\mathbf{f}(x, y) = \\left(${poly([p, "x"], [q, "y"])},\\ xy\\right)$ and $g(u, v) = ${poly([1, "u^2"], [c, "v"])}$. Find $\\frac{\\partial (g \\circ \\mathbf{f})}{\\partial ${name}}$ at $(x, y) = (${x0}, ${y0})$.`,
              `设 $\\mathbf{f}(x, y) = \\left(${poly([p, "x"], [q, "y"])},\\ xy\\right)$，$g(u, v) = ${poly([1, "u^2"], [c, "v"])}$。求 $(x, y) = (${x0}, ${y0})$ 处的 $\\frac{\\partial (g \\circ \\mathbf{f})}{\\partial ${name}}$。`,
            ),
            answer: ans,
            wrong: [wrongAtX, byX ? 2 * u * p : 2 * u * q, byX ? 2 * u + c * y0 : 2 * u + c * x0],
            solution: t(
              `At $(${x0}, ${y0})$, $\\mathbf{f} = (u, v) = (${u}, ${v})$, so $J_g = [2u,\\ ${c}] = [${2 * u},\\ ${c}]$. The ${name}-column of $J_{\\mathbf{f}}$ is $(${byX ? p : q},\\ ${byX ? y0 : x0})$. Multiplying gives $(${2 * u})(${byX ? p : q}) + (${c})(${byX ? y0 : x0}) = ${ans}$.`,
              `在 $(${x0}, ${y0})$ 处，$\\mathbf{f} = (u, v) = (${u}, ${v})$，所以 $J_g = [2u,\\ ${c}] = [${2 * u},\\ ${c}]$。$J_{\\mathbf{f}}$ 中对应 ${name} 的列为 $(${byX ? p : q},\\ ${byX ? y0 : x0})$。相乘得 $(${2 * u})(${byX ? p : q}) + (${c})(${byX ? y0 : x0}) = ${ans}$。`,
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
          "The gradient of a quadratic form involves the matrix plus its transpose, which simplifies to twice the matrix when the matrix is symmetric. For $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x} + \\mathbf{b}^T \\mathbf{x}$, $\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = (A + A^T)\\mathbf{x} + \\mathbf{b}$.",
          "二次型的梯度含有矩阵加上它的转置，当矩阵对称时化简为矩阵的两倍。对于 $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x} + \\mathbf{b}^T \\mathbf{x}$，$\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = (A + A^T)\\mathbf{x} + \\mathbf{b}$。",
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
            wrong: [
              askIdx === 1 ? a * x1 + b * x2 + b1 : b * x1 + c * x2 + b2,
              askIdx === 1 ? g1 - b1 : g2 - b2,
              askIdx === 1 ? 2 * a * x1 + b1 : 2 * c * x2 + b2,
            ],
            solution: t(
              `Since $A$ is symmetric, $\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = 2 A \\mathbf{x} + \\mathbf{b} = 2 ${aMat} ${xVec} + ${bVec} = \\begin{bmatrix} 2(${a * x1 + b * x2}) + ${paren(b1)} \\\\[3pt] 2(${b * x1 + c * x2}) + ${paren(b2)} \\end{bmatrix} = \\begin{bmatrix} ${g1} \\\\[3pt] ${g2} \\end{bmatrix}$. The requested component is $${ans}$.`,
              `由于 $A$ 是对称矩阵，$\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = 2 A \\mathbf{x} + \\mathbf{b} = 2 ${aMat} ${xVec} + ${bVec} = \\begin{bmatrix} 2(${a * x1 + b * x2}) + ${paren(b1)} \\\\[3pt] 2(${b * x1 + c * x2}) + ${paren(b2)} \\end{bmatrix} = \\begin{bmatrix} ${g1} \\\\[3pt] ${g2} \\end{bmatrix}$。所求分量为 $${ans}$。`,
            ),
          });
        },
      },
      {
        id: "gradients-of-non-symmetric-quadratic-forms",
        title: t("Gradients of quadratic forms with a non-symmetric matrix", "非对称矩阵二次型的梯度"),
        explanation: t(
          "The shortcut $2A\\mathbf{x}$ holds only for a symmetric $A$. In general $\\nabla_{\\mathbf{x}}(\\mathbf{x}^T A \\mathbf{x}) = (A + A^T)\\mathbf{x}$, because $x_i$ appears both in row $i$ and in column $i$ of the double sum $\\sum_{j,k} a_{jk} x_j x_k$.\n\nFor $A = \\begin{bmatrix} 1 & 4 \\\\ 0 & 2 \\end{bmatrix}$, $\\mathbf{x}^T A \\mathbf{x} = x_1^2 + 4x_1x_2 + 2x_2^2$ and $A + A^T = \\begin{bmatrix} 2 & 4 \\\\ 4 & 4 \\end{bmatrix}$, so the gradient is $(2x_1 + 4x_2,\\ 4x_1 + 4x_2)$, matching the partial derivatives of the expanded form. Using $2A\\mathbf{x}$ would give $(2x_1 + 8x_2,\\ 4x_2)$, which is wrong.",
          "捷径 $2A\\mathbf{x}$ 只对对称矩阵 $A$ 成立。一般地，$\\nabla_{\\mathbf{x}}(\\mathbf{x}^T A \\mathbf{x}) = (A + A^T)\\mathbf{x}$，因为在二重和 $\\sum_{j,k} a_{jk} x_j x_k$ 中，$x_i$ 既出现在第 $i$ 行，也出现在第 $i$ 列。\n\n对 $A = \\begin{bmatrix} 1 & 4 \\\\ 0 & 2 \\end{bmatrix}$，$\\mathbf{x}^T A \\mathbf{x} = x_1^2 + 4x_1x_2 + 2x_2^2$，$A + A^T = \\begin{bmatrix} 2 & 4 \\\\ 4 & 4 \\end{bmatrix}$，所以梯度为 $(2x_1 + 4x_2,\\ 4x_1 + 4x_2)$，与展开式的偏导数一致。若用 $2A\\mathbf{x}$ 则得到 $(2x_1 + 8x_2,\\ 4x_2)$，是错误的。",
        ),
        generate: (rng: Rng): Problem => {
          const a11 = rng.int(-4, 5);
          const a22 = rng.int(-4, 5);
          const a12 = rng.int(-4, 5);
          const a21 = rng.pick([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].filter((v) => v !== a12));
          const x1 = rng.pick([-3, -2, -1, 1, 2, 3]);
          const x2 = rng.pick([-3, -2, -1, 1, 2, 3]);
          const first = rng.bool();
          const s = a12 + a21;
          const ans = first ? 2 * a11 * x1 + s * x2 : s * x1 + 2 * a22 * x2;
          const twoAx = first ? 2 * (a11 * x1 + a12 * x2) : 2 * (a21 * x1 + a22 * x2);
          const twoATx = first ? 2 * (a11 * x1 + a21 * x2) : 2 * (a12 * x1 + a22 * x2);
          const ax = first ? a11 * x1 + a12 * x2 : a21 * x1 + a22 * x2;
          const k = first ? 1 : 2;
          const row = first ? `${2 * a11},\\ ${s}` : `${s},\\ ${2 * a22}`;
          return numberProblem({
            prompt: t(
              `Let $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x}$ with $A = \\begin{bmatrix} ${a11} & ${a12} \\\\[3pt] ${a21} & ${a22} \\end{bmatrix}$. Find the $x_${k}$-component of $\\nabla_{\\mathbf{x}} f$ at $\\mathbf{x} = (${x1}, ${x2})$.`,
              `设 $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x}$，其中 $A = \\begin{bmatrix} ${a11} & ${a12} \\\\[3pt] ${a21} & ${a22} \\end{bmatrix}$。求 $\\nabla_{\\mathbf{x}} f$ 在 $\\mathbf{x} = (${x1}, ${x2})$ 处的 $x_${k}$ 分量。`,
            ),
            answer: ans,
            wrong: [twoAx, twoATx, ax],
            solution: t(
              `$A$ is not symmetric, so use $\\nabla_{\\mathbf{x}} f = (A + A^T)\\mathbf{x}$. Row ${k} of $A + A^T$ is $[${row}]$, and $(${first ? 2 * a11 : s})(${x1}) + (${first ? s : 2 * a22})(${x2}) = ${ans}$.`,
              `$A$ 不对称，所以用 $\\nabla_{\\mathbf{x}} f = (A + A^T)\\mathbf{x}$。$A + A^T$ 的第 ${k} 行为 $[${row}]$，且 $(${first ? 2 * a11 : s})(${x1}) + (${first ? s : 2 * a22})(${x2}) = ${ans}$。`,
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
          "Expanding the squared error gives a quadratic form plus a linear term, and its gradient is twice the transpose times the residual. For $f(\\mathbf{x}) = \\|A\\mathbf{x} - \\mathbf{b}\\|^2 = (A\\mathbf{x} - \\mathbf{b})^T (A\\mathbf{x} - \\mathbf{b})$, $\\nabla_{\\mathbf{x}} f = 2A^T(A\\mathbf{x} - \\mathbf{b})$.",
          "把平方误差展开得到一个二次型加一个一次项，它的梯度是转置乘以残差的两倍。对于 $f(\\mathbf{x}) = \\|A\\mathbf{x} - \\mathbf{b}\\|^2 = (A\\mathbf{x} - \\mathbf{b})^T (A\\mathbf{x} - \\mathbf{b})$，$\\nabla_{\\mathbf{x}} f = 2A^T(A\\mathbf{x} - \\mathbf{b})$。",
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
            wrong: [
              askIdx === 1 ? a11 * r1 + a21 * r2 : a12 * r1 + a22 * r2,
              askIdx === 1 ? 2 * (a11 * r1 + a12 * r2) : 2 * (a21 * r1 + a22 * r2),
              askIdx === 1 ? 2 * r1 : 2 * r2,
            ],
            solution: t(
              `First, the residual vector is $\\mathbf{r} = A\\mathbf{x} - \\mathbf{b} = \\begin{bmatrix} (${a11})(${x1}) + (${a12})(${x2}) - (${b1}) \\\\[3pt] (${a21})(${x1}) + (${a22})(${x2}) - (${b2}) \\end{bmatrix} = \\begin{bmatrix} ${r1} \\\\[3pt] ${r2} \\end{bmatrix}$. Then $2 A^T \\mathbf{r} = 2 \\begin{bmatrix} ${a11} & ${a21} \\\\[3pt] ${a12} & ${a22} \\end{bmatrix} \\begin{bmatrix} ${r1} \\\\[3pt] ${r2} \\end{bmatrix} = \\begin{bmatrix} ${g1} \\\\[3pt] ${g2} \\end{bmatrix}$. Component $${askIdx}$ is $${ans}$.`,
              `首先计算残差向量 $\\mathbf{r} = A\\mathbf{x} - \\mathbf{b} = \\begin{bmatrix} (${a11})(${x1}) + (${a12})(${x2}) - (${b1}) \\\\[3pt] (${a21})(${x1}) + (${a22})(${x2}) - (${b2}) \\end{bmatrix} = \\begin{bmatrix} ${r1} \\\\[3pt] ${r2} \\end{bmatrix}$。然后计算 $2 A^T \\mathbf{r} = 2 \\begin{bmatrix} ${a11} & ${a21} \\\\[3pt] ${a12} & ${a22} \\end{bmatrix} \\begin{bmatrix} ${r1} \\\\[3pt] ${r2} \\end{bmatrix} = \\begin{bmatrix} ${g1} \\\\[3pt] ${g2} \\end{bmatrix}$。第 $${askIdx}$ 个分量为 $${ans}$。`,
            ),
          });
        },
      },
      {
        id: "solving-the-normal-equations",
        title: t("Solving the normal equations for a best-fit line", "解正规方程求最佳拟合直线"),
        explanation: t(
          "Setting the least-squares gradient $2A^T(A\\mathbf{x} - \\mathbf{b})$ to zero gives the normal equations $A^TA\\,\\mathbf{x} = A^T\\mathbf{b}$. To fit $y = c_0 + c_1 t$ to data points $(t_i, y_i)$, the rows of $A$ are $[1,\\ t_i]$ and $\\mathbf{b}$ holds the $y_i$, so\n$$A^TA = \\begin{bmatrix} n & \\sum t_i \\\\ \\sum t_i & \\sum t_i^2 \\end{bmatrix}, \\qquad A^T\\mathbf{b} = \\begin{bmatrix} \\sum y_i \\\\ \\sum t_i y_i \\end{bmatrix}.$$\nFor $(0, 1), (1, 3), (2, 4)$: $\\begin{bmatrix} 3 & 3 \\\\ 3 & 5 \\end{bmatrix}\\mathbf{x} = \\begin{bmatrix} 8 \\\\ 11 \\end{bmatrix}$, whose solution is $c_0 = \\frac{7}{6}$, $c_1 = \\frac{3}{2}$.",
          "令最小二乘梯度 $2A^T(A\\mathbf{x} - \\mathbf{b})$ 等于零，得到正规方程 $A^TA\\,\\mathbf{x} = A^T\\mathbf{b}$。用 $y = c_0 + c_1 t$ 拟合数据点 $(t_i, y_i)$ 时，$A$ 的各行为 $[1,\\ t_i]$，$\\mathbf{b}$ 由各 $y_i$ 组成，所以\n$$A^TA = \\begin{bmatrix} n & \\sum t_i \\\\ \\sum t_i & \\sum t_i^2 \\end{bmatrix}, \\qquad A^T\\mathbf{b} = \\begin{bmatrix} \\sum y_i \\\\ \\sum t_i y_i \\end{bmatrix}.$$\n对 $(0, 1), (1, 3), (2, 4)$：$\\begin{bmatrix} 3 & 3 \\\\ 3 & 5 \\end{bmatrix}\\mathbf{x} = \\begin{bmatrix} 8 \\\\ 11 \\end{bmatrix}$，解为 $c_0 = \\frac{7}{6}$，$c_1 = \\frac{3}{2}$。",
        ),
        generate: (rng: Rng): Problem => {
          const ts = rng.sample([-2, -1, 0, 1, 2, 3, 4], 3).sort((x, y) => x - y);
          const ys = ts.map(() => rng.int(-4, 9));
          const n = ts.length;
          const st = ts.reduce((s, v) => s + v, 0);
          const stt = ts.reduce((s, v) => s + v * v, 0);
          const sy = ys.reduce((s, v) => s + v, 0);
          const sty = ts.reduce((s, v, i) => s + v * ys[i]!, 0);
          const det = n * stt - st * st;
          const c1 = Q.of(n * sty - st * sy, det);
          const c0 = Q.of(stt * sy - st * sty, det);
          const slope = rng.bool();
          const pts = ts.map((v, i) => `(${v}, ${ys[i]})`).join(", ");
          const which = slope ? "c_1" : "c_0";
          return numberProblem({
            prompt: t(
              `Fit $y = c_0 + c_1 t$ to the points $${pts}$ by least squares, solving the normal equations $A^TA\\,\\mathbf{x} = A^T\\mathbf{b}$ for $\\mathbf{x} = (c_0, c_1)$. Find $${which}$.`,
              `用最小二乘法以 $y = c_0 + c_1 t$ 拟合点 $${pts}$，解正规方程 $A^TA\\,\\mathbf{x} = A^T\\mathbf{b}$，其中 $\\mathbf{x} = (c_0, c_1)$。求 $${which}$。`,
            ),
            answer: slope ? c1 : c0,
            form: "fraction",
            wrong: slope ? [Q.of(sty, stt), c0, Q.of(ys[2]! - ys[0]!, ts[2]! - ts[0]!)] : [Q.of(sy, n), c1, Q.of(sty, st === 0 ? 1 : st)],
            solution: t(
              `Here $A^TA = \\begin{bmatrix} ${n} & ${st} \\\\ ${st} & ${stt} \\end{bmatrix}$ and $A^T\\mathbf{b} = \\begin{bmatrix} ${sy} \\\\ ${sty} \\end{bmatrix}$. The determinant is $${n}(${stt}) - (${st})^2 = ${det}$, so $c_0 = \\frac{${stt}(${sy}) - (${st})(${sty})}{${det}} = ${c0.toLatex()}$ and $c_1 = \\frac{${n}(${sty}) - (${st})(${sy})}{${det}} = ${c1.toLatex()}$.`,
              `这里 $A^TA = \\begin{bmatrix} ${n} & ${st} \\\\ ${st} & ${stt} \\end{bmatrix}$，$A^T\\mathbf{b} = \\begin{bmatrix} ${sy} \\\\ ${sty} \\end{bmatrix}$。行列式为 $${n}(${stt}) - (${st})^2 = ${det}$，所以 $c_0 = \\frac{${stt}(${sy}) - (${st})(${sty})}{${det}} = ${c0.toLatex()}$，$c_1 = \\frac{${n}(${sty}) - (${st})(${sy})}{${det}} = ${c1.toLatex()}$。`,
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
          "Each entry of a matrix gradient is the partial derivative with respect to one entry of the matrix, so the identities can be checked one entry at a time. $\\nabla_X (\\mathbf{a}^T X \\mathbf{b}) = \\mathbf{a} \\mathbf{b}^T$, so entry $(i, j)$ of $\\nabla_X (\\mathbf{a}^T X \\mathbf{b})$ is $a_i b_j$.",
          "矩阵梯度的每个元素都是对矩阵某个元素的偏导数，所以这些恒等式可以逐个元素地检验。$\\nabla_X (\\mathbf{a}^T X \\mathbf{b}) = \\mathbf{a} \\mathbf{b}^T$，因此 $\\nabla_X (\\mathbf{a}^T X \\mathbf{b})$ 的第 $(i, j)$ 个元素为 $a_i b_j$。",
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
            wrong: [a[row - 1]! + b[col - 1]!, a.reduce((s, x) => s + x, 0) * b[col - 1]!, -ans],
            solution: t(
              `The gradient matrix is $\\nabla_X f = \\mathbf{a} \\mathbf{b}^T$. The entry at $(row, col) = (${row}, ${col})$ is $a_{${row}} b_{${col}} = (${a[row - 1]})(${b[col - 1]}) = ${ans}$.`,
              `梯度矩阵为 $\\nabla_X f = \\mathbf{a} \\mathbf{b}^T$。第 $(${row}, ${col})$ 个元素即为外积对应项 $a_{${row}} b_{${col}} = (${a[row - 1]})(${b[col - 1]}) = ${ans}$。`,
            ),
          });
        },
      },
      {
        id: "gradients-of-traces",
        title: t("Matrix gradients of traces", "迹的矩阵梯度"),
        explanation: t(
          "A trace of a product is a sum of products of entries, so each entry of $X$ appears with one entry of the other matrix. Since $\\operatorname{tr}(AX) = \\sum_{i,j} a_{ij} x_{ji}$, the partial derivative with respect to $x_{ji}$ is $a_{ij}$, and\n$$\\nabla_X \\operatorname{tr}(AX) = A^T, \\qquad \\nabla_X \\operatorname{tr}(X^T B) = B.$$\nSo entry $(i, j)$ of $\\nabla_X \\operatorname{tr}(AX)$ is $a_{ji}$, with the indices swapped, while entry $(i, j)$ of $\\nabla_X \\operatorname{tr}(X^T B)$ is $b_{ij}$.",
          "乘积的迹是各元素乘积之和，所以 $X$ 的每个元素都与另一个矩阵的某个元素相乘。由于 $\\operatorname{tr}(AX) = \\sum_{i,j} a_{ij} x_{ji}$，对 $x_{ji}$ 的偏导数为 $a_{ij}$，因此\n$$\\nabla_X \\operatorname{tr}(AX) = A^T, \\qquad \\nabla_X \\operatorname{tr}(X^T B) = B.$$\n所以 $\\nabla_X \\operatorname{tr}(AX)$ 的 $(i, j)$ 元素是 $a_{ji}$（下标互换），而 $\\nabla_X \\operatorname{tr}(X^T B)$ 的 $(i, j)$ 元素是 $b_{ij}$。",
        ),
        generate: (rng: Rng): Problem => {
          const rows = rng.int(2, 3);
          const cols = rows === 2 ? 3 : 2;
          const entries = rng.sample([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9], rows * cols);
          const m = Array.from({ length: rows }, (_, i) => entries.slice(i * cols, (i + 1) * cols));
          const tex = `\\begin{bmatrix} ${m.map((r) => r.join(" & ")).join(" \\\\[3pt] ")} \\end{bmatrix}`;
          const traceAX = rng.bool();
          // For tr(AX), A is rows x cols and X is cols x rows; for tr(X^T B), X has the shape of B.
          const i = rng.int(1, traceAX ? cols : rows);
          const j = rng.int(1, traceAX ? rows : cols);
          const ans = traceAX ? m[j - 1]![i - 1]! : m[i - 1]![j - 1]!;
          const sum = entries.reduce((s, v) => s + v, 0);
          const swapped = traceAX ? m[(i - 1) % rows]![(j - 1) % cols]! : m[(j - 1) % rows]![(i - 1) % cols]!;
          const name = traceAX ? "A" : "B";
          const expr = traceAX ? "\\operatorname{tr}(AX)" : "\\operatorname{tr}(X^T B)";
          const shape = traceAX ? `${cols} \\times ${rows}` : `${rows} \\times ${cols}`;
          return numberProblem({
            prompt: t(
              `Let $f(X) = ${expr}$ for a $${shape}$ matrix $X$, where $${name} = ${tex}$. Find the entry in row $${i}$, column $${j}$ of $\\nabla_X f$.`,
              `设 $f(X) = ${expr}$，其中 $X$ 为 $${shape}$ 矩阵，$${name} = ${tex}$。求 $\\nabla_X f$ 第 $${i}$ 行第 $${j}$ 列的元素。`,
            ),
            answer: ans,
            wrong: [swapped, -ans, sum, entries[0]!],
            solution: traceAX
              ? t(
                  `$\\nabla_X \\operatorname{tr}(AX) = A^T$, so the entry in row $${i}$, column $${j}$ is $a_{${j}${i}} = ${ans}$.`,
                  `$\\nabla_X \\operatorname{tr}(AX) = A^T$，所以第 $${i}$ 行第 $${j}$ 列的元素为 $a_{${j}${i}} = ${ans}$。`,
                )
              : t(
                  `$\\nabla_X \\operatorname{tr}(X^T B) = B$, so the entry in row $${i}$, column $${j}$ is $b_{${i}${j}} = ${ans}$.`,
                  `$\\nabla_X \\operatorname{tr}(X^T B) = B$，所以第 $${i}$ 行第 $${j}$ 列的元素为 $b_{${i}${j}} = ${ans}$。`,
                ),
          });
        },
      },
    ],
  },
];
