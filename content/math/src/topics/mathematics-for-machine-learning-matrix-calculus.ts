import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, paren, poly, Q } from "@ga/subject-math";
import { article, numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** distinct drops the mistakes whose value repeats an earlier one. */
const distinct = <M extends { readonly value: unknown }>(ms: readonly M[]): M[] =>
  ms.filter((m, i) => ms.findIndex((o) => String(o.value) === String(m.value)) === i);

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
    intro: t(
      "A loss depends on two weights and a bias: $L = w_1^2 + 2w_1 b + 3w_2^2$. Training updates the weights with the bias held fixed, using $\\nabla_{\\mathbf{w}} L = (2w_1 + 2b,\\ 6w_2)$, which at $\\mathbf{w} = (1, 2)$ and $b = 3$ is $(8, 12)$.\n\nCheck: the term $2w_1 b$ adds $2b = 6$ to the first entry, so $2 + 6 = 8$, and $6 \\times 2 = 12$.\n\nIn this lesson we take gradients with respect to some of the variables while holding the others fixed, including the gradient of a squared loss with respect to the bias.",
      "某个损失依赖两个权重和一个偏置：$L = w_1^2 + 2w_1 b + 3w_2^2$。训练时固定偏置来更新权重，用的是 $\\nabla_{\\mathbf{w}} L = (2w_1 + 2b,\\ 6w_2)$，在 $\\mathbf{w} = (1, 2)$、$b = 3$ 处它等于 $(8, 12)$。\n\n检验：项 $2w_1 b$ 给第一个分量加上 $2b = 6$，所以 $2 + 6 = 8$，而 $6 \\times 2 = 12$。\n\n本课我们固定一部分变量，对另一部分变量求梯度，包括平方损失关于偏置的梯度。",
    ),
    knowledgePoints: [
      {
        id: "evaluating-subset-gradients",
        title: t("Evaluating gradients with respect to parameter subsets", "求关于参数子集的梯度"),
        explanation: t(
          "A gradient with respect to some of the parameters treats all the others as constants, just as a partial derivative does for one variable. For $f(\\mathbf{w}, b) = \\|\\mathbf{y} - (X\\mathbf{w} + b\\mathbf{1})\\|^2$, holding the bias $b$ constant gives $\\nabla_{\\mathbf{w}} f = -2X^T(\\mathbf{y} - (X\\mathbf{w} + b\\mathbf{1}))$.\n\nFor example, $f = 3x_1y_1 + 2x_1^2$ has $\\frac{\\partial f}{\\partial x_1} = 3y_1 + 4x_1$, which at $x_1 = 1$, $y_1 = 2$ is $6 + 4 = 10$.\n\nCheck: putting $y_1 = 2$ in first gives $f = 6x_1 + 2x_1^2$, whose derivative at $x_1 = 1$ is also $6 + 4 = 10$.\n\n> **Watch out.** The power rule doubles the coefficient of $x_1^2$, so $2x_1^2$ gives $4x_1$, not $2x_1$; and the cross term $3x_1y_1$ does not vanish: with $y_1$ held constant it gives $3y_1$.",
          "对部分参数求梯度时，把其他所有参数都当作常数，就像对一个变量求偏导数一样。对于 $f(\\mathbf{w}, b) = \\|\\mathbf{y} - (X\\mathbf{w} + b\\mathbf{1})\\|^2$，固定偏置 $b$ 时有 $\\nabla_{\\mathbf{w}} f = -2X^T(\\mathbf{y} - (X\\mathbf{w} + b\\mathbf{1}))$。\n\n例如，$f = 3x_1y_1 + 2x_1^2$ 有 $\\frac{\\partial f}{\\partial x_1} = 3y_1 + 4x_1$，在 $x_1 = 1$、$y_1 = 2$ 处等于 $6 + 4 = 10$。\n\n检验：先代入 $y_1 = 2$ 得 $f = 6x_1 + 2x_1^2$，它在 $x_1 = 1$ 处的导数也是 $6 + 4 = 10$。\n\n> **注意。** 幂法则会把 $x_1^2$ 的系数翻倍，所以 $2x_1^2$ 求导得 $4x_1$，而不是 $2x_1$；交叉项 $3x_1y_1$ 也不会消失：固定 $y_1$ 时它求导得 $3y_1$。",
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
          const i = askIndex;
          const ky = i === 1 ? a : b;
          const kc = i === 1 ? c : d;
          const xi = i === 1 ? x1 : x2;
          const yi = i === 1 ? y1 : y2;
          const dy = ky === 1 ? `y_${i}` : `${ky} y_${i}`;
          const cross = `${ky === 1 ? "" : `${ky} `}x_${i} y_${i}`;
          const sq = `${kc === 1 ? "" : `${kc} `}x_${i}^2`;

          return numberProblem({
            prompt: t(
              `Consider the scalar objective function $f(\\mathbf{x}, \\mathbf{y}) = ${a} x_1 y_1 + ${b} x_2 y_2 + ${c} x_1^2 + ${d} x_2^2$ for vectors $\\mathbf{x} = [x_1, x_2]^T$ and $\\mathbf{y} = [y_1, y_2]^T$. Find the $x_{${askIndex}}$-component of the gradient vector $\\nabla_{\\mathbf{x}} f(\\mathbf{x}, \\mathbf{y}) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x_1} \\\\[3pt] \\frac{\\partial f}{\\partial x_2} \\end{bmatrix}$ evaluated at $\\mathbf{x} = [${x1}, ${x2}]^T$ and $\\mathbf{y} = [${y1}, ${y2}]^T$.`,
              `考虑标量目标函数 $f(\\mathbf{x}, \\mathbf{y}) = ${a} x_1 y_1 + ${b} x_2 y_2 + ${c} x_1^2 + ${d} x_2^2$，其中向量 $\\mathbf{x} = [x_1, x_2]^T$ 且 $\\mathbf{y} = [y_1, y_2]^T$。在点 $\\mathbf{x} = [${x1}, ${x2}]^T$ 和 $\\mathbf{y} = [${y1}, ${y2}]^T$ 处，求关于子变量 $\\mathbf{x}$ 的梯度向量 $\\nabla_{\\mathbf{x}} f(\\mathbf{x}, \\mathbf{y}) = \\begin{bmatrix} \\frac{\\partial f}{\\partial x_1} \\\\[3pt] \\frac{\\partial f}{\\partial x_2} \\end{bmatrix}$ 的第 $x_{${askIndex}}$ 个分量。`,
            ),
            answer: ans,
            mistakes: distinct([
              why(
                kc * xi + ky * yi,
                `That forgets the factor $2$ of the power rule: $${sq}$ differentiates to $${2 * kc} x_${i}$.`,
                `这忘了幂法则中的因子 $2$：$${sq}$ 求导得 $${2 * kc} x_${i}$。`,
              ),
              why(
                ky * yi,
                `That drops the square term; only $\\mathbf{y}$ is held constant, so $${sq}$ still contributes.`,
                `这漏掉了平方项；只有 $\\mathbf{y}$ 被固定，所以 $${sq}$ 仍有贡献。`,
              ),
              why(
                2 * kc * xi,
                `That drops the cross term; with $y_${i}$ held constant, $${cross}$ differentiates to $${dy}$, not $0$.`,
                `这漏掉了交叉项；固定 $y_${i}$ 时，$${cross}$ 求导得 $${dy}$，而不是 $0$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Differentiate with y held fixed", "固定另一组变量求导"],
                  t(
                    `Holding $\\mathbf{y}$ constant, $\\frac{\\partial f}{\\partial x_${i}} = ${dy} + ${2 * kc} x_${i}$.`,
                    `固定 $\\mathbf{y}$ 时，$\\frac{\\partial f}{\\partial x_${i}} = ${dy} + ${2 * kc} x_${i}$。`,
                  ),
                ],
                [
                  ["Substitute the values", "代入数值"],
                  t(
                    `At $x_${i} = ${xi}$ and $y_${i} = ${yi}$, the cross term gives $${ky * yi}$ and the square term gives $${2 * kc * xi}$, so the component is $${ky * yi} + ${paren(2 * kc * xi)} = ${ans}$.`,
                    `在 $x_${i} = ${xi}$、$y_${i} = ${yi}$ 处，交叉项给出 $${ky * yi}$，平方项给出 $${2 * kc * xi}$，所以该分量为 $${ky * yi} + ${paren(2 * kc * xi)} = ${ans}$。`,
                  ),
                ],
              ],
              t(
                `The other variables $x_${3 - i}$ and $y_${3 - i}$ do not appear in $\\frac{\\partial f}{\\partial x_${i}}$, so their values cannot change the answer.`,
                `另外的变量 $x_${3 - i}$ 与 $y_${3 - i}$ 不出现在 $\\frac{\\partial f}{\\partial x_${i}}$ 中，所以它们的值不会影响答案。`,
              ),
            ),
          });
        },
      },
      {
        id: "the-gradient-with-respect-to-the-bias",
        title: t("The gradient of a squared loss with respect to the bias", "平方损失关于偏置的梯度"),
        explanation: t(
          "Splitting the parameters of a model into weights and a bias lets each gradient be taken on its own, holding the other part fixed. For the line model $\\hat{y}_i = w x_i + b$ with loss $L(w, b) = \\sum_i (y_i - w x_i - b)^2$, holding $w$ fixed and differentiating each square by the chain rule gives\n$$\\frac{\\partial L}{\\partial b} = -2 \\sum_i (y_i - w x_i - b),$$\nminus twice the sum of the residuals. With the points $(1, 4), (2, 5)$ and $w = 1$, $b = 1$, the residuals are $2$ and $2$, so $\\frac{\\partial L}{\\partial b} = -8$: increasing $b$ lowers the loss.\n\nCheck: with $w = 1$ both residuals are $3 - b$, so $L = 2(3 - b)^2$, whose derivative $-4(3 - b)$ is $-8$ at $b = 1$.\n\n> **Watch out.** Keep both factors of the chain rule: the square gives $2$, and the inner expression $y_i - w x_i - b$ has derivative $-1$ in $b$, so the answer here is $-8$, not $8$ and not $-4$.",
          "把模型参数分成权重和偏置后，可以固定一部分，对另一部分单独求梯度。对直线模型 $\\hat{y}_i = w x_i + b$，损失为 $L(w, b) = \\sum_i (y_i - w x_i - b)^2$，固定 $w$，并用链式法则对每个平方求导，得\n$$\\frac{\\partial L}{\\partial b} = -2 \\sum_i (y_i - w x_i - b),$$\n即残差之和的 $-2$ 倍。对点 $(1, 4), (2, 5)$，取 $w = 1$，$b = 1$，残差为 $2$ 和 $2$，所以 $\\frac{\\partial L}{\\partial b} = -8$：增大 $b$ 会降低损失。\n\n检验：$w = 1$ 时两个残差都是 $3 - b$，所以 $L = 2(3 - b)^2$，它的导数 $-4(3 - b)$ 在 $b = 1$ 处等于 $-8$。\n\n> **注意。** 链式法则的两个因子都要保留：平方给出 $2$，内层 $y_i - w x_i - b$ 关于 $b$ 的导数是 $-1$，所以这里答案是 $-8$，既不是 $8$，也不是 $-4$。",
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
            mistakes: distinct([
              why(
                2 * sum,
                "That loses the minus sign: the inner expression $y_i - w x_i - b$ has derivative $-1$ in $b$.",
                "这丢了负号：内层 $y_i - w x_i - b$ 关于 $b$ 的导数是 $-1$。",
              ),
              why(-sum, "That forgets the factor $2$ that the square brings down.", "这忘了平方求导带来的因子 $2$。"),
              why(
                -2 * xs.reduce((s, x, i) => s + x * residuals[i]!, 0),
                "That multiplies each residual by $x_i$, which gives $\\frac{\\partial L}{\\partial w}$, not $\\frac{\\partial L}{\\partial b}$.",
                "这把每个残差乘了 $x_i$，得到的是 $\\frac{\\partial L}{\\partial w}$，而不是 $\\frac{\\partial L}{\\partial b}$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the residuals", "求残差"],
                  t(
                    `At $w = ${w}$, $b = ${b}$, the residuals $y_i - w x_i - b$ are $${residuals.join(", ")}$.`,
                    `在 $w = ${w}$，$b = ${b}$ 时，残差 $y_i - w x_i - b$ 为 $${residuals.join(", ")}$。`,
                  ),
                ],
                [
                  ["Apply the bias gradient", "代入偏置的梯度"],
                  t(
                    `Holding $w$ fixed, $\\frac{\\partial L}{\\partial b} = -2 \\sum_i (y_i - w x_i - b) = -2(${rs}) = ${ans}$.`,
                    `固定 $w$，$\\frac{\\partial L}{\\partial b} = -2 \\sum_i (y_i - w x_i - b) = -2(${rs}) = ${ans}$。`,
                  ),
                ],
              ],
              t(
                `The residuals add to $${sum}$, and $-2$ times $${paren(sum)}$ is $${ans}$.`,
                `残差之和为 $${sum}$，而 $-2$ 乘以 $${paren(sum)}$ 等于 $${ans}$。`,
              ),
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
    intro: t(
      "The tip of a robot arm sits at $\\mathbf{f}(x, y) = (x^2,\\ xy)$ for joint settings $(x, y)$. At $(1, 2)$ the Jacobian is $\\begin{pmatrix} 2 & 0 \\\\ 2 & 1 \\end{pmatrix}$, so nudging both settings by $0.1$ moves the tip by about $J\\mathbf{v} = (0.2,\\ 0.3)$.\n\nCheck: the exact new position $\\mathbf{f}(1.1, 2.1) = (1.21,\\ 2.31)$ differs from $(1, 2)$ by $(0.21,\\ 0.31)$, close to the estimate.\n\nIn this lesson we apply the total derivative to direction vectors, use it to approximate nearby values, and count the partial derivatives it holds.",
      "机械臂末端的位置是 $\\mathbf{f}(x, y) = (x^2,\\ xy)$，其中 $(x, y)$ 是关节的设定。在 $(1, 2)$ 处雅可比矩阵为 $\\begin{pmatrix} 2 & 0 \\\\ 2 & 1 \\end{pmatrix}$，所以两个设定各增加 $0.1$ 时，末端大约移动 $J\\mathbf{v} = (0.2,\\ 0.3)$。\n\n检验：精确的新位置 $\\mathbf{f}(1.1, 2.1) = (1.21,\\ 2.31)$ 与 $(1, 2)$ 相差 $(0.21,\\ 0.31)$，与估计值接近。\n\n本课我们把全导数作用于方向向量，用它近似邻近的函数值，并数一数它包含多少个偏导数。",
    ),
    knowledgePoints: [
      {
        id: "evaluating-total-derivatives-on-vectors",
        title: t("Applying total derivatives to direction vectors", "将全导数作用于方向向量"),
        explanation: t(
          "The total derivative is a linear map, so applying it to a direction means multiplying the Jacobian matrix by that direction vector. $D\\mathbf{f}(\\mathbf{x})(\\mathbf{v}) = J_{\\mathbf{f}}(\\mathbf{x}) \\mathbf{v}$ is the directional differential, which linearly approximates $\\mathbf{f}(\\mathbf{x} + \\mathbf{v}) - \\mathbf{f}(\\mathbf{x})$.\n\nFor example, $\\mathbf{f}(x, y) = (x^2 + y,\\ xy)$ has $J_{\\mathbf{f}}(1, 2) = \\begin{bmatrix} 2 & 1 \\\\ 2 & 1 \\end{bmatrix}$, and in the direction $\\mathbf{v} = (3, -1)$ the first component of $J_{\\mathbf{f}}\\mathbf{v}$ is $2 \\times 3 + 1 \\times (-1) = 5$.\n\nCheck: $3$ times the first column $(2, 2)$ plus $-1$ times the second column $(1, 1)$ is $(5, 5)$, whose first entry is $5$.\n\n> **Watch out.** Each component of $J_{\\mathbf{f}}\\mathbf{v}$ uses a row of the Jacobian, not a column: the first column $(2, 2)$ dotted with $\\mathbf{v}$ gives $6 - 2 = 4$, which is wrong.",
          "全导数是一个线性映射，所以把它作用于一个方向，就是用雅可比矩阵乘以这个方向向量。$D\\mathbf{f}(\\mathbf{x})(\\mathbf{v}) = J_{\\mathbf{f}}(\\mathbf{x}) \\mathbf{v}$ 为方向微分，它线性逼近 $\\mathbf{f}(\\mathbf{x} + \\mathbf{v}) - \\mathbf{f}(\\mathbf{x})$。\n\n例如，$\\mathbf{f}(x, y) = (x^2 + y,\\ xy)$ 有 $J_{\\mathbf{f}}(1, 2) = \\begin{bmatrix} 2 & 1 \\\\ 2 & 1 \\end{bmatrix}$，沿方向 $\\mathbf{v} = (3, -1)$，$J_{\\mathbf{f}}\\mathbf{v}$ 的第一个分量为 $2 \\times 3 + 1 \\times (-1) = 5$。\n\n检验：$3$ 乘以第一列 $(2, 2)$ 加上 $-1$ 乘以第二列 $(1, 1)$ 得 $(5, 5)$，第一个分量为 $5$。\n\n> **注意。** $J_{\\mathbf{f}}\\mathbf{v}$ 的每个分量用的是雅可比矩阵的一行，而不是一列：用第一列 $(2, 2)$ 与 $\\mathbf{v}$ 做点积得 $6 - 2 = 4$，是错的。",
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
            mistakes: distinct([
              why(
                askComponent === 1 ? res2 : res1,
                `That is the ${askComponent === 1 ? "second" : "first"} component of $J_{\\mathbf{f}}\\mathbf{v}$, not the ${askComponent === 1 ? "first" : "second"}.`,
                `这是 $J_{\\mathbf{f}}\\mathbf{v}$ 的第${askComponent === 1 ? "二" : "一"}个分量，而不是第${askComponent === 1 ? "一" : "二"}个。`,
              ),
              why(
                askComponent === 1 ? j11 * v1 + j21 * v2 : j12 * v1 + j22 * v2,
                `That multiplies $\\mathbf{v}$ by a column of the Jacobian instead of row $${askComponent}$, as if it were transposed.`,
                `这用雅可比矩阵的一列而不是第 $${askComponent}$ 行去乘 $\\mathbf{v}$，相当于把矩阵转置了。`,
              ),
              askComponent === 1
                ? why(
                    a * x0 * v1 + j12 * v2,
                    "That forgets the factor $2$ of the power rule in the derivative of the $x^2$ term.",
                    "这在对 $x^2$ 项求导时忘了幂法则中的因子 $2$。",
                  )
                : why(
                    j21 * v2 + j22 * v1,
                    "That pairs the entries of $\\mathbf{v}$ with the wrong partial derivatives, swapping $v_1$ and $v_2$.",
                    "这把 $\\mathbf{v}$ 的分量与偏导数配错了，交换了 $v_1$ 与 $v_2$。",
                  ),
            ]),
            solution: walked(
              [
                [
                  ["Find the Jacobian", "求雅可比矩阵"],
                  t(
                    `$J_{\\mathbf{f}}(x, y) = \\begin{bmatrix} ${2 * a}x & ${b} \\\\ ${poly([c, "y"])} & ${poly([c, "x"])} \\end{bmatrix}$, so at $\\mathbf{x}_0 = (${x0}, ${y0})$, $J_{\\mathbf{f}}(\\mathbf{x}_0) = \\begin{bmatrix} ${j11} & ${j12} \\\\ ${j21} & ${j22} \\end{bmatrix}$.`,
                    `$J_{\\mathbf{f}}(x, y) = \\begin{bmatrix} ${2 * a}x & ${b} \\\\ ${poly([c, "y"])} & ${poly([c, "x"])} \\end{bmatrix}$，所以在 $\\mathbf{x}_0 = (${x0}, ${y0})$ 处，$J_{\\mathbf{f}}(\\mathbf{x}_0) = \\begin{bmatrix} ${j11} & ${j12} \\\\ ${j21} & ${j22} \\end{bmatrix}$。`,
                  ),
                ],
                [
                  ["Multiply by the direction", "乘以方向向量"],
                  t(
                    `$J_{\\mathbf{f}}(\\mathbf{x}_0)\\mathbf{v} = \\begin{bmatrix} (${j11})(${v1}) + (${j12})(${v2}) \\\\[3pt] (${j21})(${v1}) + (${j22})(${v2}) \\end{bmatrix} = \\begin{bmatrix} ${res1} \\\\[3pt] ${res2} \\end{bmatrix}$, so the requested component is $${ans}$.`,
                    `$J_{\\mathbf{f}}(\\mathbf{x}_0)\\mathbf{v} = \\begin{bmatrix} (${j11})(${v1}) + (${j12})(${v2}) \\\\[3pt] (${j21})(${v1}) + (${j22})(${v2}) \\end{bmatrix} = \\begin{bmatrix} ${res1} \\\\[3pt] ${res2} \\end{bmatrix}$，所以所求分量为 $${ans}$。`,
                  ),
                ],
              ],
              t(
                `By columns, $${v1}$ times $(${j11}, ${j21})$ plus $${v2}$ times $(${j12}, ${j22})$ is $(${res1}, ${res2})$, the same vector.`,
                `按列计算，$${v1}$ 乘以 $(${j11}, ${j21})$ 加上 $${v2}$ 乘以 $(${j12}, ${j22})$ 得 $(${res1}, ${res2})$，是同一个向量。`,
              ),
            ),
          });
        },
      },
      {
        id: "linear-approximation-from-the-total-derivative",
        title: t("Approximating a nearby value with the total derivative", "用全导数近似邻近的函数值"),
        explanation: t(
          "The defining property of the total derivative is that it is the best linear approximation of the change in $\\mathbf{f}$:\n$$\\mathbf{f}(\\mathbf{x}_0 + \\mathbf{h}) \\approx \\mathbf{f}(\\mathbf{x}_0) + J_{\\mathbf{f}}(\\mathbf{x}_0)\\,\\mathbf{h}$$\nfor a small step $\\mathbf{h}$. For $f(x, y) = x^2 y$ at $(1, 2)$ the Jacobian is the row $[2xy,\\ x^2] = [4,\\ 1]$, so with $\\mathbf{h} = (0.1, -0.2)$, $f(1.1, 1.8) \\approx 2 + 4(0.1) + 1(-0.2) = 2.2$; the exact value is $2.178$.\n\nCheck: the predicted change $0.2$ is close to the exact change $2.178 - 2 = 0.178$.\n\n> **Watch out.** Pair each step with its own partial derivative and add the starting value: $2 + 4(-0.2) + 1(0.1) = 1.3$ swaps the steps, and $0.2$ alone is only the change.",
          "全导数的定义性质是：它是 $\\mathbf{f}$ 变化量的最佳线性近似：\n$$\\mathbf{f}(\\mathbf{x}_0 + \\mathbf{h}) \\approx \\mathbf{f}(\\mathbf{x}_0) + J_{\\mathbf{f}}(\\mathbf{x}_0)\\,\\mathbf{h}$$\n其中 $\\mathbf{h}$ 是小步长。对于 $f(x, y) = x^2 y$，在 $(1, 2)$ 处雅可比矩阵为行向量 $[2xy,\\ x^2] = [4,\\ 1]$，所以取 $\\mathbf{h} = (0.1, -0.2)$ 时，$f(1.1, 1.8) \\approx 2 + 4(0.1) + 1(-0.2) = 2.2$；精确值为 $2.178$。\n\n检验：预测的变化量 $0.2$ 与精确的变化量 $2.178 - 2 = 0.178$ 很接近。\n\n> **注意。** 每个步长要与它自己的偏导数配对，并加上起点处的值：$2 + 4(-0.2) + 1(0.1) = 1.3$ 把步长配错了，而单独的 $0.2$ 只是变化量。",
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
            mistakes: distinct([
              why(
                Q.of(value),
                "That is the value at $\\mathbf{x}_0$ alone, before the step is taken into account.",
                "这只是 $\\mathbf{x}_0$ 处的值，没有计入步长带来的变化。",
              ),
              why(
                Q.of(gx * h1 + gy * h2, 10),
                `That is only the change $J_{\\mathbf{f}}\\mathbf{h}$; add the starting value $${value}$.`,
                `这只是变化量 $J_{\\mathbf{f}}\\mathbf{h}$；还要加上起点处的值 $${value}$。`,
              ),
              why(
                Q.of(10 * value + gx * h2 + gy * h1, 10),
                "That pairs each step with the wrong partial derivative, swapping the two steps.",
                "这把步长与偏导数配错了，交换了两个步长。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Evaluate at the base point", "在基点处求值"],
                  t(
                    `The step is $\\mathbf{h} = (${step(h1)}, ${step(h2)})$. The ${comp.en} component has value $${value}$ at $\\mathbf{x}_0$ and Jacobian row $[${gx},\\ ${gy}]$ there.`,
                    `步长为 $\\mathbf{h} = (${step(h1)}, ${step(h2)})$。${comp["zh-CN"]}分量在 $\\mathbf{x}_0$ 处的值为 $${value}$，雅可比矩阵对应行为 $[${gx},\\ ${gy}]$。`,
                  ),
                ],
                [
                  ["Add the linear change", "加上线性变化量"],
                  t(
                    `The approximation is $${value} + (${gx})(${step(h1)}) + (${gy})(${step(h2)}) = ${dec(ans)}$.`,
                    `近似值为 $${value} + (${gx})(${step(h1)}) + (${gy})(${step(h2)}) = ${dec(ans)}$。`,
                  ),
                ],
              ],
              t(
                `Subtracting $${value}$ from $${dec(ans)}$ leaves $${dec(Q.of(gx * h1 + gy * h2, 10))}$, the linear change $J_{\\mathbf{f}}\\mathbf{h}$ for this component.`,
                `从 $${dec(ans)}$ 中减去 $${value}$ 得 $${dec(Q.of(gx * h1 + gy * h2, 10))}$，正是该分量的线性变化量 $J_{\\mathbf{f}}\\mathbf{h}$。`,
              ),
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
    intro: t(
      "A model maps inputs $(x, y)$ to features $(u, v) = (x + y,\\ xy)$ and then scores them with $g = u^2 + 3v$. At $(1, 2)$ the features are $(3, 2)$, $J_g = [6,\\ 3]$ there, and the $x$-column of $J_{\\mathbf{f}}$ is $(1, 2)$, so $\\frac{\\partial g}{\\partial x} = 6 + 6 = 12$.\n\nCheck: substituting first, $g = (x + y)^2 + 3xy$, whose $x$-derivative $2(x + y) + 3y$ is $6 + 6 = 12$ at $(1, 2)$.\n\nIn this lesson we multiply Jacobians to differentiate composite maps, apply the chain rule to explicit formulas, and find the shape of a composite Jacobian.",
      "某个模型把输入 $(x, y)$ 映射为特征 $(u, v) = (x + y,\\ xy)$，再用 $g = u^2 + 3v$ 打分。在 $(1, 2)$ 处特征为 $(3, 2)$，那里 $J_g = [6,\\ 3]$，而 $J_{\\mathbf{f}}$ 对应 $x$ 的列为 $(1, 2)$，所以 $\\frac{\\partial g}{\\partial x} = 6 + 6 = 12$。\n\n检验：先代入得 $g = (x + y)^2 + 3xy$，它对 $x$ 的导数 $2(x + y) + 3y$ 在 $(1, 2)$ 处等于 $6 + 6 = 12$。\n\n本课我们用雅可比矩阵相乘求复合映射的导数，对具体公式应用链式法则，并求复合雅可比矩阵的形状。",
    ),
    knowledgePoints: [
      {
        id: "multiplying-jacobians-chain-rule",
        title: t("Computing Jacobian of composite functions via matrix multiplication", "通过矩阵乘法计算复合映射的雅可比矩阵"),
        explanation: t(
          "The chain rule for functions of several variables multiplies Jacobian matrices, with the outer function's Jacobian evaluated at the inner function's output. $J_{g \\circ f}(\\mathbf{x}) = J_g(\\mathbf{y}) \\, J_f(\\mathbf{x})$, where $\\mathbf{y} = f(\\mathbf{x})$. Entry $(i, j)$ is $\\sum_k (J_g)_{ik} (J_f)_{kj}$.\n\nFor example, with $J_g = \\begin{bmatrix} 1 & 2 \\\\ 0 & 3 \\end{bmatrix}$ and $J_f = \\begin{bmatrix} 4 & 1 \\\\ -1 & 2 \\end{bmatrix}$, entry $(1, 2)$ of $J_g J_f$ is $1 \\times 1 + 2 \\times 2 = 5$.\n\nCheck: row $1$ of $J_g$ is $[1, 2]$, column $2$ of $J_f$ is $(1, 2)$, and their dot product is $5$.\n\n> **Watch out.** The order matters, since $J_f J_g$ is a different matrix; and an entry is a row-times-column sum, not the product $2 \\times 1 = 2$ of the two entries in position $(1, 2)$.",
          "多元函数的链式法则是雅可比矩阵相乘，外层函数的雅可比矩阵要在内层函数的输出处求值。$J_{g \\circ f}(\\mathbf{x}) = J_g(\\mathbf{y}) \\, J_f(\\mathbf{x})$，其中 $\\mathbf{y} = f(\\mathbf{x})$。第 $(i, j)$ 个元素为 $\\sum_k (J_g)_{ik} (J_f)_{kj}$。\n\n例如，取 $J_g = \\begin{bmatrix} 1 & 2 \\\\ 0 & 3 \\end{bmatrix}$，$J_f = \\begin{bmatrix} 4 & 1 \\\\ -1 & 2 \\end{bmatrix}$，$J_g J_f$ 的第 $(1, 2)$ 个元素为 $1 \\times 1 + 2 \\times 2 = 5$。\n\n检验：$J_g$ 的第 $1$ 行是 $[1, 2]$，$J_f$ 的第 $2$ 列是 $(1, 2)$，它们的点积为 $5$。\n\n> **注意。** 顺序很重要，$J_f J_g$ 是另一个矩阵；而且一个元素是行乘列之和，而不是两个矩阵在 $(1, 2)$ 位置上的元素之积 $2 \\times 1 = 2$。",
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
            mistakes: distinct([
              why(
                jf[r]![0]! * jg[0]![c]! + jf[r]![1]! * jg[1]![c]!,
                "That multiplies in the wrong order, $J_{\\mathbf{f}} J_{\\mathbf{g}}$; the outer map's Jacobian comes first.",
                "这把乘法顺序弄反了，算成了 $J_{\\mathbf{f}} J_{\\mathbf{g}}$；外层映射的雅可比矩阵要放在前面。",
              ),
              why(
                jg[r]![c]! * jf[r]![c]!,
                "That multiplies only the two entries in the same position; a matrix product entry is a row-times-column sum.",
                "这只把同一位置的两个元素相乘；矩阵乘积的元素是行乘列之和。",
              ),
              why(
                jg[r]![0]! * jf[c]![0]! + jg[r]![1]! * jf[c]![1]!,
                `That uses row $${targetCol}$ of $J_{\\mathbf{f}}$ instead of column $${targetCol}$.`,
                `这用了 $J_{\\mathbf{f}}$ 的第 $${targetCol}$ 行，而不是第 $${targetCol}$ 列。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Pick the row and the column", "取出行与列"],
                  t(
                    `By the chain rule, $J_{\\mathbf{h}} = J_{\\mathbf{g}} J_{\\mathbf{f}}$. Row $${targetRow}$ of $J_{\\mathbf{g}}$ is $[${jg[r]![0]},\\ ${jg[r]![1]}]$ and column $${targetCol}$ of $J_{\\mathbf{f}}$ is $(${jf[0]![c]}, ${jf[1]![c]})$.`,
                    `由链式法则，$J_{\\mathbf{h}} = J_{\\mathbf{g}} J_{\\mathbf{f}}$。$J_{\\mathbf{g}}$ 的第 $${targetRow}$ 行是 $[${jg[r]![0]},\\ ${jg[r]![1]}]$，$J_{\\mathbf{f}}$ 的第 $${targetCol}$ 列是 $(${jf[0]![c]}, ${jf[1]![c]})$。`,
                  ),
                ],
                [
                  ["Take their dot product", "求点积"],
                  t(
                    `$(${jg[r]![0]})(${jf[0]![c]}) + (${jg[r]![1]})(${jf[1]![c]}) = ${ans}$.`,
                    `$(${jg[r]![0]})(${jf[0]![c]}) + (${jg[r]![1]})(${jf[1]![c]}) = ${ans}$。`,
                  ),
                ],
              ],
              t(
                `The two products are $${jg[r]![0]! * jf[0]![c]!}$ and $${jg[r]![1]! * jf[1]![c]!}$, and they add to $${ans}$.`,
                `两个乘积分别是 $${jg[r]![0]! * jf[0]![c]!}$ 与 $${jg[r]![1]! * jf[1]![c]!}$，相加得 $${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "chain-rule-with-explicit-maps",
        title: t("Applying the chain rule to explicit maps", "对具体映射应用链式法则"),
        explanation: t(
          "When the maps are given by formulas, first evaluate the inner map to find where the outer Jacobian is taken, then multiply. For $\\mathbf{f}(x, y) = (x + y,\\ xy)$ and $g(u, v) = u^2 + 3v$, at $(x, y) = (1, 2)$ the inner value is $(u, v) = (3, 2)$. Then $J_g = [2u,\\ 3] = [6,\\ 3]$ and $J_{\\mathbf{f}} = \\begin{bmatrix} 1 & 1 \\\\ y & x \\end{bmatrix} = \\begin{bmatrix} 1 & 1 \\\\ 2 & 1 \\end{bmatrix}$, so\n$$J_{g \\circ \\mathbf{f}} = [6,\\ 3]\\begin{bmatrix} 1 & 1 \\\\ 2 & 1 \\end{bmatrix} = [12,\\ 9].$$\nEvaluating $J_g$ at $(x, y)$ instead of at $\\mathbf{f}(x, y)$ is the usual mistake.\n\nCheck: substituting first, $g = (x + y)^2 + 3xy$ has $\\frac{\\partial g}{\\partial x} = 2(x + y) + 3y = 6 + 6 = 12$ at $(1, 2)$.\n\n> **Watch out.** Evaluate $J_g$ at $\\mathbf{f}(1, 2) = (3, 2)$, not at $(1, 2)$: using $u = 1$ gives $[2,\\ 3]$ and the wrong first entry $2 + 6 = 8$.",
          "当映射由公式给出时，先计算内层映射的值，确定外层雅可比矩阵在哪一点取值，再相乘。对 $\\mathbf{f}(x, y) = (x + y,\\ xy)$ 与 $g(u, v) = u^2 + 3v$，在 $(x, y) = (1, 2)$ 处内层的值为 $(u, v) = (3, 2)$。于是 $J_g = [2u,\\ 3] = [6,\\ 3]$，$J_{\\mathbf{f}} = \\begin{bmatrix} 1 & 1 \\\\ y & x \\end{bmatrix} = \\begin{bmatrix} 1 & 1 \\\\ 2 & 1 \\end{bmatrix}$，所以\n$$J_{g \\circ \\mathbf{f}} = [6,\\ 3]\\begin{bmatrix} 1 & 1 \\\\ 2 & 1 \\end{bmatrix} = [12,\\ 9].$$\n常见错误是在 $(x, y)$ 而不是在 $\\mathbf{f}(x, y)$ 处计算 $J_g$。\n\n检验：先代入得 $g = (x + y)^2 + 3xy$，在 $(1, 2)$ 处 $\\frac{\\partial g}{\\partial x} = 2(x + y) + 3y = 6 + 6 = 12$。\n\n> **注意。** 要在 $\\mathbf{f}(1, 2) = (3, 2)$ 处而不是在 $(1, 2)$ 处计算 $J_g$：用 $u = 1$ 会得到 $[2,\\ 3]$ 和错误的第一个元素 $2 + 6 = 8$。",
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
            mistakes: distinct([
              why(
                wrongAtX,
                `That evaluates $J_g$ at $(x, y) = (${x0}, ${y0})$ instead of at $\\mathbf{f}(${x0}, ${y0}) = (${u}, ${v})$.`,
                `这在 $(x, y) = (${x0}, ${y0})$ 处而不是在 $\\mathbf{f}(${x0}, ${y0}) = (${u}, ${v})$ 处计算了 $J_g$。`,
              ),
              why(
                byX ? 2 * u * p : 2 * u * q,
                `That drops the path through $v = xy$, the term $${c}$ times $\\frac{\\partial v}{\\partial ${name}}$.`,
                `这漏掉了经过 $v = xy$ 的那条路径，即 $${c}$ 乘以 $\\frac{\\partial v}{\\partial ${name}}$ 这一项。`,
              ),
              why(
                byX ? 2 * u + c * y0 : 2 * u + c * x0,
                `That forgets to multiply $2u$ by $\\frac{\\partial u}{\\partial ${name}} = ${byX ? p : q}$.`,
                `这忘了把 $2u$ 乘以 $\\frac{\\partial u}{\\partial ${name}} = ${byX ? p : q}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Evaluate the inner map", "求内层映射的值"],
                  t(
                    `At $(${x0}, ${y0})$, $\\mathbf{f} = (u, v) = (${u}, ${v})$, so $J_g = [2u,\\ ${c}] = [${2 * u},\\ ${c}]$.`,
                    `在 $(${x0}, ${y0})$ 处，$\\mathbf{f} = (u, v) = (${u}, ${v})$，所以 $J_g = [2u,\\ ${c}] = [${2 * u},\\ ${c}]$。`,
                  ),
                ],
                [
                  ["Multiply by the column", "乘以对应的列"],
                  t(
                    `The ${name}-column of $J_{\\mathbf{f}}$ is $(${byX ? p : q},\\ ${byX ? y0 : x0})$, and $(${2 * u})(${byX ? p : q}) + (${c})(${byX ? y0 : x0}) = ${ans}$.`,
                    `$J_{\\mathbf{f}}$ 中对应 ${name} 的列为 $(${byX ? p : q},\\ ${byX ? y0 : x0})$，而 $(${2 * u})(${byX ? p : q}) + (${c})(${byX ? y0 : x0}) = ${ans}$。`,
                  ),
                ],
              ],
              t(
                `Substituting first gives $g = ${poly([1, `(${poly([p, "x"], [q, "y"])})^2`], [c, "xy"])}$, and differentiating that directly at $(${x0}, ${y0})$ also gives $${ans}$.`,
                `先代入得 $g = ${poly([1, `(${poly([p, "x"], [q, "y"])})^2`], [c, "xy"])}$，直接对它求导并代入 $(${x0}, ${y0})$ 也得到 $${ans}$。`,
              ),
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
    intro: t(
      "Training losses and penalties are often quadratic forms in the weights. For $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x}$ with the symmetric $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$, the gradient is $2A\\mathbf{x}$, which at $\\mathbf{x} = (1, 1)$ is $(6, 8)$.\n\nCheck: expanding, $f = 2x_1^2 + 2x_1x_2 + 3x_2^2$, whose partial derivatives at $(1, 1)$ are $4 + 2 = 6$ and $2 + 6 = 8$.\n\nIn this lesson we find the gradients of linear terms and quadratic forms, with symmetric and non-symmetric matrices, and of a regularized objective.",
      "训练中的损失与惩罚项常常是权重的二次型。对 $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x}$，其中 $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$ 对称，梯度为 $2A\\mathbf{x}$，在 $\\mathbf{x} = (1, 1)$ 处等于 $(6, 8)$。\n\n检验：展开得 $f = 2x_1^2 + 2x_1x_2 + 3x_2^2$，它在 $(1, 1)$ 处的偏导数为 $4 + 2 = 6$ 与 $2 + 6 = 8$。\n\n本课我们求一次项与二次型（矩阵对称或不对称）的梯度，以及带正则项的目标函数的梯度。",
    ),
    knowledgePoints: [
      {
        id: "evaluating-quadratic-form-vector-gradients",
        title: t("Evaluating gradients of quadratic forms and linear terms", "求二次型与线性项关于向量的梯度"),
        explanation: t(
          "The gradient of a quadratic form involves the matrix plus its transpose, which simplifies to twice the matrix when the matrix is symmetric. For $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x} + \\mathbf{b}^T \\mathbf{x}$, $\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = (A + A^T)\\mathbf{x} + \\mathbf{b}$.\n\nFor example, with $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$, $\\mathbf{b} = (1, -2)$ and $\\mathbf{x} = (1, 1)$, $A\\mathbf{x} = (3, 4)$, so $\\nabla_{\\mathbf{x}} f = 2(3, 4) + (1, -2) = (7, 6)$.\n\nCheck: $2 \\times 3 + 1 = 7$ and $2 \\times 4 - 2 = 6$.\n\n> **Watch out.** Keep the factor $2$ and add $\\mathbf{b}$: $A\\mathbf{x} + \\mathbf{b} = (4, 2)$ and $2A\\mathbf{x} = (6, 8)$ are both wrong.",
          "二次型的梯度含有矩阵加上它的转置，当矩阵对称时化简为矩阵的两倍。对于 $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x} + \\mathbf{b}^T \\mathbf{x}$，$\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = (A + A^T)\\mathbf{x} + \\mathbf{b}$。\n\n例如，取 $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$，$\\mathbf{b} = (1, -2)$，$\\mathbf{x} = (1, 1)$，则 $A\\mathbf{x} = (3, 4)$，所以 $\\nabla_{\\mathbf{x}} f = 2(3, 4) + (1, -2) = (7, 6)$。\n\n检验：$2 \\times 3 + 1 = 7$，$2 \\times 4 - 2 = 6$。\n\n> **注意。** 因子 $2$ 要保留，$\\mathbf{b}$ 也要加上：$A\\mathbf{x} + \\mathbf{b} = (4, 2)$ 与 $2A\\mathbf{x} = (6, 8)$ 都是错的。",
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
              `Let $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x} + \\mathbf{b}^T \\mathbf{x}$ for $\\mathbf{x} \\in \\mathbb{R}^2$, where $A = ${aMat}$ and $\\mathbf{b} = ${bVec}$. Evaluate the gradient $\\nabla_{\\mathbf{x}} f(\\mathbf{x})$ at $\\mathbf{x} = ${xVec}$, and report its $x_{${askIdx}}$-component.`,
              `设 $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x} + \\mathbf{b}^T \\mathbf{x}$，其中 $\\mathbf{x} \\in \\mathbb{R}^2$，$A = ${aMat}$ 且 $\\mathbf{b} = ${bVec}$。在 $\\mathbf{x} = ${xVec}$ 处计算梯度 $\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = 2A\\mathbf{x} + \\mathbf{b}$，并给出其第 $x_{${askIdx}}$ 个分量。`,
            ),
            answer: ans,
            mistakes: distinct([
              why(
                askIdx === 1 ? a * x1 + b * x2 + b1 : b * x1 + c * x2 + b2,
                "That forgets the factor $2$: the gradient of $\\mathbf{x}^T A \\mathbf{x}$ is $2A\\mathbf{x}$ for a symmetric $A$.",
                "这忘了因子 $2$：$A$ 对称时，$\\mathbf{x}^T A \\mathbf{x}$ 的梯度是 $2A\\mathbf{x}$。",
              ),
              why(
                askIdx === 1 ? g1 - b1 : g2 - b2,
                "That leaves out $\\mathbf{b}$, the gradient of the linear term $\\mathbf{b}^T \\mathbf{x}$.",
                "这漏掉了 $\\mathbf{b}$，即一次项 $\\mathbf{b}^T \\mathbf{x}$ 的梯度。",
              ),
              why(
                askIdx === 1 ? 2 * a * x1 + b1 : 2 * c * x2 + b2,
                "That keeps only the diagonal entry of $A$ and drops the off-diagonal term of the row.",
                "这只保留了 $A$ 的对角元素，漏掉了这一行中的非对角项。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Multiply A by x", "矩阵乘以向量"],
                  t(
                    `$A\\mathbf{x} = ${aMat} ${xVec} = \\begin{bmatrix} ${a * x1 + b * x2} \\\\[3pt] ${b * x1 + c * x2} \\end{bmatrix}$.`,
                    `$A\\mathbf{x} = ${aMat} ${xVec} = \\begin{bmatrix} ${a * x1 + b * x2} \\\\[3pt] ${b * x1 + c * x2} \\end{bmatrix}$。`,
                  ),
                ],
                [
                  ["Double it and add b", "加倍后加上一次项"],
                  t(
                    `Since $A$ is symmetric, $\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = 2 A \\mathbf{x} + \\mathbf{b} = \\begin{bmatrix} 2(${a * x1 + b * x2}) + ${paren(b1)} \\\\[3pt] 2(${b * x1 + c * x2}) + ${paren(b2)} \\end{bmatrix} = \\begin{bmatrix} ${g1} \\\\[3pt] ${g2} \\end{bmatrix}$. The requested component is $${ans}$.`,
                    `由于 $A$ 是对称矩阵，$\\nabla_{\\mathbf{x}} f(\\mathbf{x}) = 2 A \\mathbf{x} + \\mathbf{b} = \\begin{bmatrix} 2(${a * x1 + b * x2}) + ${paren(b1)} \\\\[3pt] 2(${b * x1 + c * x2}) + ${paren(b2)} \\end{bmatrix} = \\begin{bmatrix} ${g1} \\\\[3pt] ${g2} \\end{bmatrix}$。所求分量为 $${ans}$。`,
                  ),
                ],
              ],
              t(
                `Differentiating the expanded form directly, $\\frac{\\partial f}{\\partial x_${askIdx}} = ${askIdx === 1 ? `2(${a})(${x1}) + 2(${b})(${x2}) + ${paren(b1)}` : `2(${b})(${x1}) + 2(${c})(${x2}) + ${paren(b2)}`} = ${ans}$ as well.`,
                `直接对展开式求导，$\\frac{\\partial f}{\\partial x_${askIdx}} = ${askIdx === 1 ? `2(${a})(${x1}) + 2(${b})(${x2}) + ${paren(b1)}` : `2(${b})(${x1}) + 2(${c})(${x2}) + ${paren(b2)}`} = ${ans}$，结果相同。`,
              ),
            ),
          });
        },
      },
      {
        id: "gradients-of-non-symmetric-quadratic-forms",
        title: t("Gradients of quadratic forms with a non-symmetric matrix", "非对称矩阵二次型的梯度"),
        explanation: t(
          "The shortcut $2A\\mathbf{x}$ holds only for a symmetric $A$. In general $\\nabla_{\\mathbf{x}}(\\mathbf{x}^T A \\mathbf{x}) = (A + A^T)\\mathbf{x}$, because $x_i$ appears both in row $i$ and in column $i$ of the double sum $\\sum_{j,k} a_{jk} x_j x_k$.\n\nFor $A = \\begin{bmatrix} 1 & 4 \\\\ 0 & 2 \\end{bmatrix}$, $\\mathbf{x}^T A \\mathbf{x} = x_1^2 + 4x_1x_2 + 2x_2^2$ and $A + A^T = \\begin{bmatrix} 2 & 4 \\\\ 4 & 4 \\end{bmatrix}$, so the gradient is $(2x_1 + 4x_2,\\ 4x_1 + 4x_2)$, matching the partial derivatives of the expanded form. Using $2A\\mathbf{x}$ would give $(2x_1 + 8x_2,\\ 4x_2)$, which is wrong.\n\nCheck: differentiating $x_1^2 + 4x_1x_2 + 2x_2^2$ in $x_2$ gives $4x_1 + 4x_2$, the second entry of $(A + A^T)\\mathbf{x}$.\n\n> **Watch out.** $2A^T\\mathbf{x}$ is just as wrong as $2A\\mathbf{x}$; only $A + A^T$ counts both off-diagonal entries $a_{12}$ and $a_{21}$.",
          "捷径 $2A\\mathbf{x}$ 只对对称矩阵 $A$ 成立。一般地，$\\nabla_{\\mathbf{x}}(\\mathbf{x}^T A \\mathbf{x}) = (A + A^T)\\mathbf{x}$，因为在二重和 $\\sum_{j,k} a_{jk} x_j x_k$ 中，$x_i$ 既出现在第 $i$ 行，也出现在第 $i$ 列。\n\n对 $A = \\begin{bmatrix} 1 & 4 \\\\ 0 & 2 \\end{bmatrix}$，$\\mathbf{x}^T A \\mathbf{x} = x_1^2 + 4x_1x_2 + 2x_2^2$，$A + A^T = \\begin{bmatrix} 2 & 4 \\\\ 4 & 4 \\end{bmatrix}$，所以梯度为 $(2x_1 + 4x_2,\\ 4x_1 + 4x_2)$，与展开式的偏导数一致。若用 $2A\\mathbf{x}$ 则得到 $(2x_1 + 8x_2,\\ 4x_2)$，是错误的。\n\n检验：$x_1^2 + 4x_1x_2 + 2x_2^2$ 对 $x_2$ 求导得 $4x_1 + 4x_2$，正是 $(A + A^T)\\mathbf{x}$ 的第二个分量。\n\n> **注意。** $2A^T\\mathbf{x}$ 和 $2A\\mathbf{x}$ 一样是错的；只有 $A + A^T$ 同时计入了两个非对角元素 $a_{12}$ 与 $a_{21}$。",
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
              `Let $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x}$ with $A = \\begin{bmatrix} ${a11} & ${a12} \\\\[3pt] ${a21} & ${a22} \\end{bmatrix}$. Find the $x_{${k}}$-component of $\\nabla_{\\mathbf{x}} f$ at $\\mathbf{x} = (${x1}, ${x2})$.`,
              `设 $f(\\mathbf{x}) = \\mathbf{x}^T A \\mathbf{x}$，其中 $A = \\begin{bmatrix} ${a11} & ${a12} \\\\[3pt] ${a21} & ${a22} \\end{bmatrix}$。求 $\\nabla_{\\mathbf{x}} f$ 在 $\\mathbf{x} = (${x1}, ${x2})$ 处的 $x_{${k}}$ 分量。`,
            ),
            answer: ans,
            mistakes: distinct([
              why(
                twoAx,
                "That uses $2A\\mathbf{x}$, which holds only when $A$ is symmetric.",
                "这用了 $2A\\mathbf{x}$，它只在 $A$ 对称时成立。",
              ),
              why(
                twoATx,
                "That uses $2A^T\\mathbf{x}$, which is just as wrong for a non-symmetric $A$.",
                "这用了 $2A^T\\mathbf{x}$，对不对称的 $A$ 同样是错的。",
              ),
              why(
                ax,
                "That uses $A\\mathbf{x}$ and leaves out the $A^T\\mathbf{x}$ half of the gradient.",
                "这用了 $A\\mathbf{x}$，漏掉了梯度中 $A^T\\mathbf{x}$ 的那一半。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Form the symmetric sum", "求矩阵与转置之和"],
                  t(
                    `$A$ is not symmetric, so use $\\nabla_{\\mathbf{x}} f = (A + A^T)\\mathbf{x}$. Row ${k} of $A + A^T$ is $[${row}]$.`,
                    `$A$ 不对称，所以用 $\\nabla_{\\mathbf{x}} f = (A + A^T)\\mathbf{x}$。$A + A^T$ 的第 ${k} 行为 $[${row}]$。`,
                  ),
                ],
                [
                  ["Multiply by x", "乘以向量"],
                  t(
                    `$(${first ? 2 * a11 : s})(${x1}) + (${first ? s : 2 * a22})(${x2}) = ${ans}$.`,
                    `$(${first ? 2 * a11 : s})(${x1}) + (${first ? s : 2 * a22})(${x2}) = ${ans}$。`,
                  ),
                ],
              ],
              t(
                `The off-diagonal entries enter only through their sum $${a12} + ${paren(a21)} = ${s}$, since $a_{12}x_1x_2$ and $a_{21}x_2x_1$ are like terms.`,
                `非对角元素只以它们的和 $${a12} + ${paren(a21)} = ${s}$ 出现，因为 $a_{12}x_1x_2$ 与 $a_{21}x_2x_1$ 是同类项。`,
              ),
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
    intro: t(
      "Fitting $A\\mathbf{x} \\approx \\mathbf{b}$ by least squares means walking downhill on $f(\\mathbf{x}) = \\|A\\mathbf{x} - \\mathbf{b}\\|^2$. With $A = I$, $\\mathbf{b} = (3, 1)$ and $\\mathbf{x} = (1, 1)$, the residual is $(-2, 0)$ and the gradient $2A^T(A\\mathbf{x} - \\mathbf{b})$ is $(-4, 0)$, so a step against it moves $x_1$ up toward $3$.\n\nCheck: $f = (x_1 - 3)^2 + (x_2 - 1)^2$ has $\\frac{\\partial f}{\\partial x_1} = 2(1 - 3) = -4$ at $\\mathbf{x} = (1, 1)$.\n\nIn this lesson we evaluate gradients of least-squares objectives and squared distances, and solve the normal equations for a best-fit line.",
      "用最小二乘法拟合 $A\\mathbf{x} \\approx \\mathbf{b}$，就是沿 $f(\\mathbf{x}) = \\|A\\mathbf{x} - \\mathbf{b}\\|^2$ 往下走。取 $A = I$，$\\mathbf{b} = (3, 1)$，$\\mathbf{x} = (1, 1)$，残差为 $(-2, 0)$，梯度 $2A^T(A\\mathbf{x} - \\mathbf{b})$ 为 $(-4, 0)$，所以逆着梯度走一步会让 $x_1$ 朝 $3$ 增大。\n\n检验：$f = (x_1 - 3)^2 + (x_2 - 1)^2$ 在 $\\mathbf{x} = (1, 1)$ 处有 $\\frac{\\partial f}{\\partial x_1} = 2(1 - 3) = -4$。\n\n本课我们计算最小二乘目标函数与平方距离的梯度，并解正规方程求最佳拟合直线。",
    ),
    knowledgePoints: [
      {
        id: "evaluating-least-squares-gradients",
        title: t("Evaluating gradients of least-squares objective functions", "计算最小二乘目标函数的梯度"),
        explanation: t(
          "Expanding the squared error gives a quadratic form plus a linear term, and its gradient is twice the transpose times the residual. For $f(\\mathbf{x}) = \\|A\\mathbf{x} - \\mathbf{b}\\|^2 = (A\\mathbf{x} - \\mathbf{b})^T (A\\mathbf{x} - \\mathbf{b})$, $\\nabla_{\\mathbf{x}} f = 2A^T(A\\mathbf{x} - \\mathbf{b})$.\n\nFor example, with $A = \\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix}$, $\\mathbf{b} = (1, 1)$ and $\\mathbf{x} = (1, 1)$, the residual is $\\mathbf{r} = A\\mathbf{x} - \\mathbf{b} = (2, 0)$, and $2A^T\\mathbf{r} = 2(2, 4) = (4, 8)$.\n\nCheck: $A^T = \\begin{bmatrix} 1 & 0 \\\\ 2 & 1 \\end{bmatrix}$, and $A^T(2, 0) = (2, 4)$.\n\n> **Watch out.** Multiply the residual by $A^T$, not by $A$: here $2A\\mathbf{r} = (4, 0)$, which is wrong; and keep the factor $2$.",
          "把平方误差展开得到一个二次型加一个一次项，它的梯度是转置乘以残差的两倍。对于 $f(\\mathbf{x}) = \\|A\\mathbf{x} - \\mathbf{b}\\|^2 = (A\\mathbf{x} - \\mathbf{b})^T (A\\mathbf{x} - \\mathbf{b})$，$\\nabla_{\\mathbf{x}} f = 2A^T(A\\mathbf{x} - \\mathbf{b})$。\n\n例如，取 $A = \\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix}$，$\\mathbf{b} = (1, 1)$，$\\mathbf{x} = (1, 1)$，残差为 $\\mathbf{r} = A\\mathbf{x} - \\mathbf{b} = (2, 0)$，而 $2A^T\\mathbf{r} = 2(2, 4) = (4, 8)$。\n\n检验：$A^T = \\begin{bmatrix} 1 & 0 \\\\ 2 & 1 \\end{bmatrix}$，且 $A^T(2, 0) = (2, 4)$。\n\n> **注意。** 残差要乘以 $A^T$，而不是 $A$：这里 $2A\\mathbf{r} = (4, 0)$，是错的；因子 $2$ 也要保留。",
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
              `Consider the least-squares residual objective $f(\\mathbf{x}) = \\|A\\mathbf{x} - \\mathbf{b}\\|^2$, where $A = ${aMat}$ and $\\mathbf{b} = ${bVec}$. Evaluate the gradient $\\nabla_{\\mathbf{x}} f(\\mathbf{x})$ at $\\mathbf{x} = ${xVec}$, and find its $x_{${askIdx}}$-component.`,
              `考虑最小二乘残差目标函数 $f(\\mathbf{x}) = \\|A\\mathbf{x} - \\mathbf{b}\\|^2$，其中 $A = ${aMat}$ 且 $\\mathbf{b} = ${bVec}$。在点 $\\mathbf{x} = ${xVec}$ 处求梯度 $\\nabla_{\\mathbf{x}} f(\\mathbf{x})$，并给出其第 $x_{${askIdx}}$ 个分量。`,
            ),
            answer: ans,
            mistakes: distinct([
              why(
                askIdx === 1 ? a11 * r1 + a21 * r2 : a12 * r1 + a22 * r2,
                "That forgets the factor $2$ that the square brings down.",
                "这忘了平方求导带来的因子 $2$。",
              ),
              why(
                askIdx === 1 ? 2 * (a11 * r1 + a12 * r2) : 2 * (a21 * r1 + a22 * r2),
                "That multiplies the residual by $A$ instead of $A^T$.",
                "这用 $A$ 而不是 $A^T$ 去乘残差。",
              ),
              why(
                askIdx === 1 ? 2 * r1 : 2 * r2,
                "That is twice the residual, leaving out the factor $A^T$ from the chain rule.",
                "这是残差的两倍，漏掉了链式法则中的因子 $A^T$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the residual", "求残差"],
                  t(
                    `$\\mathbf{r} = A\\mathbf{x} - \\mathbf{b} = \\begin{bmatrix} (${a11})(${x1}) + (${a12})(${x2}) - (${b1}) \\\\[3pt] (${a21})(${x1}) + (${a22})(${x2}) - (${b2}) \\end{bmatrix} = \\begin{bmatrix} ${r1} \\\\[3pt] ${r2} \\end{bmatrix}$.`,
                    `$\\mathbf{r} = A\\mathbf{x} - \\mathbf{b} = \\begin{bmatrix} (${a11})(${x1}) + (${a12})(${x2}) - (${b1}) \\\\[3pt] (${a21})(${x1}) + (${a22})(${x2}) - (${b2}) \\end{bmatrix} = \\begin{bmatrix} ${r1} \\\\[3pt] ${r2} \\end{bmatrix}$。`,
                  ),
                ],
                [
                  ["Multiply by twice the transpose", "乘以转置的两倍"],
                  t(
                    `$2 A^T \\mathbf{r} = 2 \\begin{bmatrix} ${a11} & ${a21} \\\\[3pt] ${a12} & ${a22} \\end{bmatrix} \\begin{bmatrix} ${r1} \\\\[3pt] ${r2} \\end{bmatrix} = \\begin{bmatrix} ${g1} \\\\[3pt] ${g2} \\end{bmatrix}$, so component $${askIdx}$ is $${ans}$.`,
                    `$2 A^T \\mathbf{r} = 2 \\begin{bmatrix} ${a11} & ${a21} \\\\[3pt] ${a12} & ${a22} \\end{bmatrix} \\begin{bmatrix} ${r1} \\\\[3pt] ${r2} \\end{bmatrix} = \\begin{bmatrix} ${g1} \\\\[3pt] ${g2} \\end{bmatrix}$，所以第 $${askIdx}$ 个分量为 $${ans}$。`,
                  ),
                ],
              ],
              t(
                `Component $${askIdx}$ uses column $${askIdx}$ of $A$: $2[(${askIdx === 1 ? a11 : a12})(${r1}) + (${askIdx === 1 ? a21 : a22})(${r2})] = ${ans}$.`,
                `第 $${askIdx}$ 个分量用的是 $A$ 的第 $${askIdx}$ 列：$2[(${askIdx === 1 ? a11 : a12})(${r1}) + (${askIdx === 1 ? a21 : a22})(${r2})] = ${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "solving-the-normal-equations",
        title: t("Solving the normal equations for a best-fit line", "解正规方程求最佳拟合直线"),
        explanation: t(
          "Setting the least-squares gradient $2A^T(A\\mathbf{x} - \\mathbf{b})$ to zero gives the normal equations $A^TA\\,\\mathbf{x} = A^T\\mathbf{b}$. To fit $y = c_0 + c_1 t$ to data points $(t_i, y_i)$, the rows of $A$ are $[1,\\ t_i]$ and $\\mathbf{b}$ holds the $y_i$, so\n$$A^TA = \\begin{bmatrix} n & \\sum t_i \\\\ \\sum t_i & \\sum t_i^2 \\end{bmatrix}, \\qquad A^T\\mathbf{b} = \\begin{bmatrix} \\sum y_i \\\\ \\sum t_i y_i \\end{bmatrix}.$$\nFor $(0, 1), (1, 3), (2, 4)$: $\\begin{bmatrix} 3 & 3 \\\\ 3 & 5 \\end{bmatrix}\\mathbf{x} = \\begin{bmatrix} 8 \\\\ 11 \\end{bmatrix}$, whose solution is $c_0 = \\frac{7}{6}$, $c_1 = \\frac{3}{2}$.\n\nCheck: the residuals $1 - \\frac{7}{6}$, $3 - \\frac{8}{3}$ and $4 - \\frac{25}{6}$ are $-\\frac{1}{6}$, $\\frac{1}{3}$ and $-\\frac{1}{6}$, which add to $0$, as the first normal equation requires.\n\n> **Watch out.** Solve the two equations together: dividing $\\sum t_i y_i = 11$ by $\\sum t_i^2 = 5$ ignores the intercept, and $\\frac{11}{5}$ is not $c_1$.",
          "令最小二乘梯度 $2A^T(A\\mathbf{x} - \\mathbf{b})$ 等于零，得到正规方程 $A^TA\\,\\mathbf{x} = A^T\\mathbf{b}$。用 $y = c_0 + c_1 t$ 拟合数据点 $(t_i, y_i)$ 时，$A$ 的各行为 $[1,\\ t_i]$，$\\mathbf{b}$ 由各 $y_i$ 组成，所以\n$$A^TA = \\begin{bmatrix} n & \\sum t_i \\\\ \\sum t_i & \\sum t_i^2 \\end{bmatrix}, \\qquad A^T\\mathbf{b} = \\begin{bmatrix} \\sum y_i \\\\ \\sum t_i y_i \\end{bmatrix}.$$\n对 $(0, 1), (1, 3), (2, 4)$：$\\begin{bmatrix} 3 & 3 \\\\ 3 & 5 \\end{bmatrix}\\mathbf{x} = \\begin{bmatrix} 8 \\\\ 11 \\end{bmatrix}$，解为 $c_0 = \\frac{7}{6}$，$c_1 = \\frac{3}{2}$。\n\n检验：残差 $1 - \\frac{7}{6}$、$3 - \\frac{8}{3}$、$4 - \\frac{25}{6}$ 分别为 $-\\frac{1}{6}$、$\\frac{1}{3}$、$-\\frac{1}{6}$，和为 $0$，正如第一个正规方程所要求的。\n\n> **注意。** 两个方程要联立求解：用 $\\sum t_i y_i = 11$ 除以 $\\sum t_i^2 = 5$ 忽略了截距，$\\frac{11}{5}$ 并不是 $c_1$。",
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
            mistakes: distinct(
              slope
                ? [
                    why(
                      Q.of(sty, stt),
                      "That divides $\\sum t_i y_i$ by $\\sum t_i^2$, ignoring the intercept $c_0$.",
                      "这用 $\\sum t_i y_i$ 除以 $\\sum t_i^2$，忽略了截距 $c_0$。",
                    ),
                    why(c0, "That is the intercept $c_0$, not the slope $c_1$.", "这是截距 $c_0$，而不是斜率 $c_1$。"),
                    why(
                      Q.of(ys[2]! - ys[0]!, ts[2]! - ts[0]!),
                      "That is the slope through the two end points, which ignores the middle point.",
                      "这是经过两个端点的直线的斜率，忽略了中间的点。",
                    ),
                  ]
                : [
                    why(
                      Q.of(sy, n),
                      "That is the mean of the $y_i$, which equals $c_0$ only when the mean of the $t_i$ is $0$.",
                      "这是各 $y_i$ 的平均数，只有当各 $t_i$ 的平均数为 $0$ 时它才等于 $c_0$。",
                    ),
                    why(c1, "That is the slope $c_1$, not the intercept $c_0$.", "这是斜率 $c_1$，而不是截距 $c_0$。"),
                    why(
                      Q.of(sty, st === 0 ? 1 : st),
                      "That divides one entry of $A^T\\mathbf{b}$ by one entry of $A^TA$ instead of solving the system.",
                      "这用 $A^T\\mathbf{b}$ 的一个分量除以 $A^TA$ 的一个元素，而没有解方程组。",
                    ),
                  ],
            ),
            solution: walked(
              [
                [
                  ["Form the normal equations", "列出正规方程"],
                  t(
                    `Here $A^TA = \\begin{bmatrix} ${n} & ${st} \\\\ ${st} & ${stt} \\end{bmatrix}$ and $A^T\\mathbf{b} = \\begin{bmatrix} ${sy} \\\\ ${sty} \\end{bmatrix}$.`,
                    `这里 $A^TA = \\begin{bmatrix} ${n} & ${st} \\\\ ${st} & ${stt} \\end{bmatrix}$，$A^T\\mathbf{b} = \\begin{bmatrix} ${sy} \\\\ ${sty} \\end{bmatrix}$。`,
                  ),
                ],
                [
                  ["Solve the system", "解方程组"],
                  t(
                    `The determinant is $${n}(${stt}) - (${st})^2 = ${det}$, so $c_0 = \\frac{${stt}(${sy}) - (${st})(${sty})}{${det}} = ${c0.toLatex()}$ and $c_1 = \\frac{${n}(${sty}) - (${st})(${sy})}{${det}} = ${c1.toLatex()}$.`,
                    `行列式为 $${n}(${stt}) - (${st})^2 = ${det}$，所以 $c_0 = \\frac{${stt}(${sy}) - (${st})(${sty})}{${det}} = ${c0.toLatex()}$，$c_1 = \\frac{${n}(${sty}) - (${st})(${sy})}{${det}} = ${c1.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `The first normal equation holds: $${n} \\times ${paren(c0)} + ${paren(st)} \\times ${paren(c1)} = ${sy}$.`,
                `第一个正规方程成立：$${n} \\times ${paren(c0)} + ${paren(st)} \\times ${paren(c1)} = ${sy}$。`,
              ),
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
    intro: t(
      "In a linear layer the score is $\\mathbf{a}^T W \\mathbf{b}$, and training needs its gradient with respect to the whole weight matrix $W$. That gradient is the outer product $\\mathbf{a}\\mathbf{b}^T$: with $\\mathbf{a} = (2, -1)$ and $\\mathbf{b} = (3, 4)$ it is $\\begin{pmatrix} 6 & 8 \\\\ -3 & -4 \\end{pmatrix}$.\n\nCheck: $W_{12}$ appears in the score only in the term $a_1 W_{12} b_2$, so its partial derivative is $a_1 b_2 = 2 \\times 4 = 8$.\n\nIn this lesson we compute matrix gradients of bilinear forms, of traces and of the Frobenius norm.",
      "线性层的得分是 $\\mathbf{a}^T W \\mathbf{b}$，训练时需要它关于整个权重矩阵 $W$ 的梯度。这个梯度是外积 $\\mathbf{a}\\mathbf{b}^T$：取 $\\mathbf{a} = (2, -1)$，$\\mathbf{b} = (3, 4)$，它等于 $\\begin{pmatrix} 6 & 8 \\\\ -3 & -4 \\end{pmatrix}$。\n\n检验：$W_{12}$ 只出现在得分的 $a_1 W_{12} b_2$ 一项中，所以它的偏导数是 $a_1 b_2 = 2 \\times 4 = 8$。\n\n本课我们计算双线性形式、迹与弗罗贝尼乌斯范数的矩阵梯度。",
    ),
    knowledgePoints: [
      {
        id: "evaluating-matrix-derivative-identities",
        title: t("Evaluating matrix gradients of bilinear forms and traces", "计算双线性形式与迹的矩阵梯度"),
        explanation: t(
          "Each entry of a matrix gradient is the partial derivative with respect to one entry of the matrix, so the identities can be checked one entry at a time. $\\nabla_X (\\mathbf{a}^T X \\mathbf{b}) = \\mathbf{a} \\mathbf{b}^T$, so entry $(i, j)$ of $\\nabla_X (\\mathbf{a}^T X \\mathbf{b})$ is $a_i b_j$.\n\nFor example, with $\\mathbf{a} = (2, -1, 3)$ and $\\mathbf{b} = (4, 5)$, entry $(3, 1)$ of the gradient is $a_3 b_1 = 3 \\times 4 = 12$.\n\nCheck: $X_{31}$ enters $\\mathbf{a}^T X \\mathbf{b}$ only in the term $a_3 X_{31} b_1 = 12X_{31}$.\n\n> **Watch out.** Multiply $a_i$ by $b_j$; adding them, as in $3 + 4 = 7$, is wrong, and so is using the sum of all of $\\mathbf{a}$.",
          "矩阵梯度的每个元素都是对矩阵某个元素的偏导数，所以这些恒等式可以逐个元素地检验。$\\nabla_X (\\mathbf{a}^T X \\mathbf{b}) = \\mathbf{a} \\mathbf{b}^T$，因此 $\\nabla_X (\\mathbf{a}^T X \\mathbf{b})$ 的第 $(i, j)$ 个元素为 $a_i b_j$。\n\n例如，取 $\\mathbf{a} = (2, -1, 3)$，$\\mathbf{b} = (4, 5)$，梯度的第 $(3, 1)$ 个元素为 $a_3 b_1 = 3 \\times 4 = 12$。\n\n检验：$X_{31}$ 只出现在 $\\mathbf{a}^T X \\mathbf{b}$ 的 $a_3 X_{31} b_1 = 12X_{31}$ 一项中。\n\n> **注意。** 要把 $a_i$ 与 $b_j$ 相乘；像 $3 + 4 = 7$ 那样相加是错的，用 $\\mathbf{a}$ 所有分量之和也是错的。",
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
              `Let $f(X) = \\mathbf{a}^T X \\mathbf{b}$ for ${article(m)} $${m} \\times ${n}$ matrix $X$, where $${aVec}$ and $${bVec}$. Find the entry in row $${row}$, column $${col}$ of the gradient matrix $\\nabla_X f$.`,
              `设 $f(X) = \\mathbf{a}^T X \\mathbf{b}$，其中 $X$ 为 $${m} \\times ${n}$ 矩阵，$${aVec}$ 且 $${bVec}$。求梯度矩阵 $\\nabla_X f$ 的第 $${row}$ 行第 $${col}$ 列元素。`,
            ),
            answer: ans,
            mistakes: distinct([
              why(
                a[row - 1]! + b[col - 1]!,
                `That adds $a_{${row}}$ and $b_{${col}}$ instead of multiplying them.`,
                `这把 $a_{${row}}$ 与 $b_{${col}}$ 相加了，而不是相乘。`,
              ),
              why(
                a.reduce((s, x) => s + x, 0) * b[col - 1]!,
                `That multiplies $b_{${col}}$ by the sum of all entries of $\\mathbf{a}$ instead of by $a_{${row}}$ alone.`,
                `这用 $\\mathbf{a}$ 所有分量之和而不是单独的 $a_{${row}}$ 去乘 $b_{${col}}$。`,
              ),
              why(-ans, "That has the wrong sign; recheck the signs of the two entries.", "这符号错了；请重新检查两个分量的符号。"),
            ]),
            solution: walked(
              [
                [
                  ["Use the identity", "使用恒等式"],
                  t(
                    `The gradient matrix is $\\nabla_X f = \\mathbf{a} \\mathbf{b}^T$, whose entry in row $${row}$, column $${col}$ is $a_{${row}} b_{${col}}$.`,
                    `梯度矩阵为 $\\nabla_X f = \\mathbf{a} \\mathbf{b}^T$，它的第 $${row}$ 行第 $${col}$ 列元素是 $a_{${row}} b_{${col}}$。`,
                  ),
                ],
                [
                  ["Multiply the entries", "分量相乘"],
                  t(
                    `$a_{${row}} b_{${col}} = (${a[row - 1]})(${b[col - 1]}) = ${ans}$.`,
                    `$a_{${row}} b_{${col}} = (${a[row - 1]})(${b[col - 1]}) = ${ans}$。`,
                  ),
                ],
              ],
              t(
                `$X_{${row}${col}}$ appears in $f$ only in the term $a_{${row}} X_{${row}${col}} b_{${col}}$, whose coefficient is $${ans}$.`,
                `$X_{${row}${col}}$ 只出现在 $f$ 的 $a_{${row}} X_{${row}${col}} b_{${col}}$ 一项中，它的系数是 $${ans}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "gradients-of-traces",
        title: t("Matrix gradients of traces", "迹的矩阵梯度"),
        explanation: t(
          "A trace of a product is a sum of products of entries, so each entry of $X$ appears with one entry of the other matrix. Since $\\operatorname{tr}(AX) = \\sum_{i,j} a_{ij} x_{ji}$, the partial derivative with respect to $x_{ji}$ is $a_{ij}$, and\n$$\\nabla_X \\operatorname{tr}(AX) = A^T, \\qquad \\nabla_X \\operatorname{tr}(X^T B) = B.$$\nSo entry $(i, j)$ of $\\nabla_X \\operatorname{tr}(AX)$ is $a_{ji}$, with the indices swapped, while entry $(i, j)$ of $\\nabla_X \\operatorname{tr}(X^T B)$ is $b_{ij}$.\n\nFor example, if $A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{bmatrix}$, then $X$ is $3 \\times 2$ and entry $(3, 1)$ of $\\nabla_X \\operatorname{tr}(AX)$ is $a_{13} = 3$.\n\nCheck: $x_{31}$ appears in $\\operatorname{tr}(AX)$ only in the product $a_{13}x_{31}$.\n\n> **Watch out.** For $\\operatorname{tr}(AX)$ swap the indices before reading $A$: entry $(3, 1)$ is $a_{13}$, not $a_{31}$, which does not even exist here.",
          "乘积的迹是各元素乘积之和，所以 $X$ 的每个元素都与另一个矩阵的某个元素相乘。由于 $\\operatorname{tr}(AX) = \\sum_{i,j} a_{ij} x_{ji}$，对 $x_{ji}$ 的偏导数为 $a_{ij}$，因此\n$$\\nabla_X \\operatorname{tr}(AX) = A^T, \\qquad \\nabla_X \\operatorname{tr}(X^T B) = B.$$\n所以 $\\nabla_X \\operatorname{tr}(AX)$ 的 $(i, j)$ 元素是 $a_{ji}$（下标互换），而 $\\nabla_X \\operatorname{tr}(X^T B)$ 的 $(i, j)$ 元素是 $b_{ij}$。\n\n例如，若 $A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{bmatrix}$，则 $X$ 是 $3 \\times 2$ 矩阵，$\\nabla_X \\operatorname{tr}(AX)$ 的 $(3, 1)$ 元素是 $a_{13} = 3$。\n\n检验：$x_{31}$ 在 $\\operatorname{tr}(AX)$ 中只出现在乘积 $a_{13}x_{31}$ 里。\n\n> **注意。** 对 $\\operatorname{tr}(AX)$ 要先交换下标再读 $A$：$(3, 1)$ 元素是 $a_{13}$，而不是 $a_{31}$，这里 $a_{31}$ 根本不存在。",
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
            mistakes: distinct([
              traceAX
                ? why(
                    swapped,
                    `That reads $${name}$ at row $${i}$, column $${j}$ without swapping the indices; the gradient is $A^T$.`,
                    `这没有交换下标，直接读了 $${name}$ 的第 $${i}$ 行第 $${j}$ 列；梯度是 $A^T$。`,
                  )
                : why(
                    swapped,
                    "That swaps the indices, which is right only for $\\operatorname{tr}(AX)$; here the gradient is $B$ itself.",
                    "这交换了下标，那只适用于 $\\operatorname{tr}(AX)$；这里的梯度就是 $B$ 本身。",
                  ),
              why(
                -ans,
                "That has the wrong sign; the trace is linear, so the entry is used as it is.",
                "这符号错了；迹是线性的，元素按原样使用。",
              ),
              why(
                sum,
                `That adds all the entries of $${name}$; each entry of the gradient is a single entry of $${name}$.`,
                `这把 $${name}$ 的所有元素加起来了；梯度的每个元素只是 $${name}$ 的一个元素。`,
              ),
              why(
                entries[0]!,
                `That is the entry in row $1$, column $1$ of $${name}$, not the one the indices point to.`,
                `这是 $${name}$ 第 $1$ 行第 $1$ 列的元素，而不是下标所指的那个。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Use the identity", "使用恒等式"],
                  traceAX
                    ? t(
                        "$\\nabla_X \\operatorname{tr}(AX) = A^T$, so the row and column indices swap when reading $A$.",
                        "$\\nabla_X \\operatorname{tr}(AX) = A^T$，所以读 $A$ 时行与列的下标要交换。",
                      )
                    : t(
                        "$\\nabla_X \\operatorname{tr}(X^T B) = B$, so the gradient is read straight from $B$.",
                        "$\\nabla_X \\operatorname{tr}(X^T B) = B$，所以梯度直接从 $B$ 中读出。",
                      ),
                ],
                [
                  ["Read the entry", "读出元素"],
                  traceAX
                    ? t(
                        `The entry in row $${i}$, column $${j}$ is $a_{${j}${i}} = ${ans}$.`,
                        `第 $${i}$ 行第 $${j}$ 列的元素为 $a_{${j}${i}} = ${ans}$。`,
                      )
                    : t(
                        `The entry in row $${i}$, column $${j}$ is $b_{${i}${j}} = ${ans}$.`,
                        `第 $${i}$ 行第 $${j}$ 列的元素为 $b_{${i}${j}} = ${ans}$。`,
                      ),
                ],
              ],
              traceAX
                ? t(
                    `$x_{${i}${j}}$ appears in $\\operatorname{tr}(AX)$ only in the product $a_{${j}${i}}x_{${i}${j}}$, whose coefficient is $${ans}$.`,
                    `$x_{${i}${j}}$ 在 $\\operatorname{tr}(AX)$ 中只出现在乘积 $a_{${j}${i}}x_{${i}${j}}$ 里，它的系数是 $${ans}$。`,
                  )
                : t(
                    `$x_{${i}${j}}$ appears in $\\operatorname{tr}(X^T B)$ only in the product $x_{${i}${j}}b_{${i}${j}}$, whose coefficient is $${ans}$.`,
                    `$x_{${i}${j}}$ 在 $\\operatorname{tr}(X^T B)$ 中只出现在乘积 $x_{${i}${j}}b_{${i}${j}}$ 里，它的系数是 $${ans}$。`,
                  ),
            ),
          });
        },
      },
    ],
  },
];
