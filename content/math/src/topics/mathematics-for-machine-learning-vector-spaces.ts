import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { numberProblem } from "../problems.ts";

export const mathematicsForMachineLearningVectorSpaceTopics: TopicDef[] = [
  // 4.12.5 The Hadamard Product
  {
    id: "the-hadamard-product",
    title: t("The Hadamard Product", "阿达马积"),
    summary: t(
      "The Hadamard (entrywise) product $A \\odot B$ of two matrices or vectors of the same size multiplies corresponding entries: $(A \\odot B)_{ij} = A_{ij}B_{ij}$.",
      "两个同型矩阵或向量的阿达马积（逐元素乘积）$A \\odot B$ 由对应元素相乘得到：$(A \\odot B)_{ij} = A_{ij}B_{ij}$。",
    ),
    prerequisites: ["vectors-in-n-dimensional-euclidean-space"],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      {
        id: "evaluating-hadamard-products",
        title: t("Computing Hadamard products and their components", "计算阿达马积及其元素"),
        explanation: t(
          "The Hadamard product multiplies vectors entry by entry rather than taking a dot product, so its result is a vector of the same length. For $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$, $(\\mathbf{u} \\odot \\mathbf{v})_i = u_i v_i$. The sum of the entries of $\\mathbf{u} \\odot \\mathbf{v}$ equals the standard inner product $\\mathbf{u}^T \\mathbf{v}$.",
          "哈达玛积是逐个分量相乘，而不是求点积，所以结果是一个长度相同的向量。对于 $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$，$(\\mathbf{u} \\odot \\mathbf{v})_i = u_i v_i$。$\\mathbf{u} \\odot \\mathbf{v}$ 各分量之和等于标准内积 $\\mathbf{u}^T \\mathbf{v}$。",
        ),
        generate: (rng: Rng): Problem => {
          const kind = rng.int(0, 1);
          if (kind === 0) {
            // Specific entry of matrix Hadamard product
            const r = rng.int(2, 3);
            const c = rng.int(2, 3);
            const A: number[][] = [];
            const B: number[][] = [];
            for (let i = 0; i < r; i++) {
              A.push([rng.int(-5, 8), rng.int(-5, 8), rng.int(-5, 8)].slice(0, c));
              B.push([rng.int(-5, 8), rng.int(-5, 8), rng.int(-5, 8)].slice(0, c));
            }
            const targetRow = rng.int(1, r);
            const targetCol = rng.int(1, c);
            const valA = A[targetRow - 1]![targetCol - 1]!;
            const valB = B[targetRow - 1]![targetCol - 1]!;
            const ans = valA * valB;

            const formatMat = (M: number[][]) => `\\begin{pmatrix} ${M.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;

            return numberProblem({
              prompt: t(
                `Given the matrices $A = ${formatMat(A)}$ and $B = ${formatMat(B)}$, let $C = A \\odot B$ denote their Hadamard product. Find the entry $C_{${targetRow}, ${targetCol}} = (A \\odot B)_{${targetRow}, ${targetCol}}$.`,
                `给定矩阵 $A = ${formatMat(A)}$ 与 $B = ${formatMat(B)}$，设 $C = A \\odot B$ 为它们的阿达马积。求元素 $C_{${targetRow}, ${targetCol}} = (A \\odot B)_{${targetRow}, ${targetCol}}$ 的值。`,
              ),
              answer: ans,
              solution: t(
                `The $(i, j)$ entry of the Hadamard product is the product of the corresponding entries: $C_{${targetRow}, ${targetCol}} = A_{${targetRow}, ${targetCol}} \\times B_{${targetRow}, ${targetCol}} = (${valA}) \\times (${valB}) = ${ans}$.`,
                `阿达马积的第 $(i, j)$ 个元素为对应元素的乘积：$C_{${targetRow}, ${targetCol}} = A_{${targetRow}, ${targetCol}} \\times B_{${targetRow}, ${targetCol}} = (${valA}) \\times (${valB}) = ${ans}$。`,
              ),
            });
          }

          // Vector Hadamard sum: sum_i (u_i * v_i)
          const dim = rng.int(3, 5);
          const u: number[] = [];
          const v: number[] = [];
          let sumProd = 0;
          for (let i = 0; i < dim; i++) {
            const ui = rng.int(-6, 9);
            const vi = rng.int(-6, 9);
            u.push(ui);
            v.push(vi);
            sumProd += ui * vi;
          }

          const uLatex = `\\begin{bmatrix} ${u.join(" \\\\ ")} \\end{bmatrix}`;
          const vLatex = `\\begin{bmatrix} ${v.join(" \\\\ ")} \\end{bmatrix}`;

          return numberProblem({
            prompt: t(
              `Let $\\mathbf{u} = ${uLatex}$ and $\\mathbf{v} = ${vLatex}$ be vectors in $\\mathbb{R}^{${dim}}$. Find the sum of all components of their Hadamard product $\\mathbf{w} = \\mathbf{u} \\odot \\mathbf{v}$, i.e., $\\sum_{i=1}^{${dim}} w_i$.`,
              `设 $\\mathbf{u} = ${uLatex}$ 和 $\\mathbf{v} = ${vLatex}$ 为 $\\mathbb{R}^{${dim}}$ 中的向量。求它们的阿达马积 $\\mathbf{w} = \\mathbf{u} \\odot \\mathbf{v}$ 的所有分量之和，即 $\\sum_{i=1}^{${dim}} w_i$。`,
            ),
            answer: sumProd,
            solution: t(
              `The Hadamard product is $\\mathbf{w} = \\begin{bmatrix} ${u.map((x, i) => `${x} \\times ${v[i]} = ${x * v[i]!}`).join(" \\\\ ")} \\end{bmatrix}$. Summing these components yields $\\sum_{i=1}^{${dim}} w_i = ${sumProd}$.`,
              `阿达马积为 $\\mathbf{w} = \\begin{bmatrix} ${u.map((x, i) => `${x} \\times ${v[i]} = ${x * v[i]!}`).join(" \\\\ ")} \\end{bmatrix}$。将各分量求和得 $\\sum_{i=1}^{${dim}} w_i = ${sumProd}$。`,
            ),
          });
        },
      },
    ],
  },

  // 6.18.3 Euclidean, Manhattan, and Minkowski Distance
  {
    id: "euclidean-manhattan-and-minkowski-distance",
    title: t("Euclidean, Manhattan, and Minkowski Distance", "欧几里得距离、曼哈顿距离与明可夫斯基距离"),
    summary: t(
      "The Minkowski distance of order $p \\ge 1$ between $\\mathbf{x}, \\mathbf{y} \\in \\mathbb{R}^n$ is $D_p(\\mathbf{x}, \\mathbf{y}) = \\left(\\sum |x_i - y_i|^p\\right)^{1/p}$. Special cases are the Manhattan distance ($p = 1$), the Euclidean distance ($p = 2$) and the Chebyshev distance ($p \\to \\infty$).",
      "$\\mathbb{R}^n$ 中 $\\mathbf{x}$ 与 $\\mathbf{y}$ 之间 $p$ 阶（$p \\ge 1$）明可夫斯基距离为 $D_p(\\mathbf{x}, \\mathbf{y}) = \\left(\\sum |x_i - y_i|^p\\right)^{1/p}$。特例有曼哈顿距离（$p = 1$）、欧几里得距离（$p = 2$）和切比雪夫距离（$p \\to \\infty$）。",
    ),
    prerequisites: ["norm-of-a-vector-in-n-dimensional-euclidean-space"],
    encompasses: [],
    xp: 12,
    knowledgePoints: [
      {
        id: "calculating-minkowski-distances",
        title: t("Calculating Manhattan and Euclidean distances", "计算曼哈顿距离与欧几里得距离"),
        explanation: t(
          "Manhattan distance adds the absolute differences along each axis like walking on a grid, while Euclidean distance takes the straight line length. $D_1(\\mathbf{x}, \\mathbf{y}) = \\sum_i |x_i - y_i|$ (Manhattan, $L_1$), and $D_2(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_i (x_i - y_i)^2}$ (Euclidean, $L_2$).",
          "曼哈顿距离像在网格上行走一样把各轴上的绝对差加起来，而欧氏距离取的是直线长度。$D_1(\\mathbf{x}, \\mathbf{y}) = \\sum_i |x_i - y_i|$（曼哈顿距离，$L_1$），$D_2(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_i (x_i - y_i)^2}$（欧几里得距离，$L_2$）。",
        ),
        generate: (rng: Rng): Problem => {
          const metricType = rng.pick(["manhattan", "euclidean", "chebyshev"] as const);

          if (metricType === "euclidean") {
            // Pick differences that form an integer Euclidean distance
            // e.g. (3, 4) -> 5, (6, 8) -> 10, (1, 2, 2) -> 3, (2, 3, 6) -> 7, (4, 4, 7) -> 9, (1, 4, 8) -> 9
            const triples = [
              [3, 4],
              [6, 8],
              [5, 12],
              [1, 2, 2],
              [2, 3, 6],
              [1, 4, 8],
              [4, 4, 7],
            ];
            const chosen = rng.pick(triples);
            const dim = chosen.length;
            const signs = chosen.map(() => (rng.bool() ? 1 : -1));
            const diffs = chosen.map((d, i) => d * signs[i]!);

            const x: number[] = [];
            const y: number[] = [];
            for (let i = 0; i < dim; i++) {
              const xi = rng.int(-8, 12);
              x.push(xi);
              y.push(xi - diffs[i]!);
            }

            const expectedDist = Math.round(Math.sqrt(chosen.reduce((acc, v) => acc + v * v, 0)));

            const xStr = `(${x.join(", ")})`;
            const yStr = `(${y.join(", ")})`;

            return numberProblem({
              prompt: t(
                `Calculate the Euclidean distance ($L_2$ distance) $D_2(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_{i=1}^{${dim}} (x_i - y_i)^2}$ between points $\\mathbf{x} = ${xStr}$ and $\\mathbf{y} = ${yStr}$.`,
                `计算点 $\\mathbf{x} = ${xStr}$ 与 $\\mathbf{y} = ${yStr}$ 之间的欧几里得距离（$L_2$ 距离）$D_2(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_{i=1}^{${dim}} (x_i - y_i)^2}$。`,
              ),
              answer: expectedDist,
              solution: t(
                `The component differences are $|x_i - y_i| = [${chosen.join(", ")}]$. Squaring and summing gives $\\sum (x_i - y_i)^2 = ${chosen.map((d) => `${d}^2`).join(" + ")} = ${expectedDist * expectedDist}$. Taking the square root yields $D_2(\\mathbf{x}, \\mathbf{y}) = ${expectedDist}$.`,
                `各分量差值为 $|x_i - y_i| = [${chosen.join(", ")}]$。平方求和得 $\\sum (x_i - y_i)^2 = ${chosen.map((d) => `${d}^2`).join(" + ")} = ${expectedDist * expectedDist}$。开方得 $D_2(\\mathbf{x}, \\mathbf{y}) = ${expectedDist}$。`,
              ),
            });
          }

          if (metricType === "chebyshev") {
            const dim = rng.int(3, 4);
            const x: number[] = [];
            const y: number[] = [];
            const diffs: number[] = [];
            for (let i = 0; i < dim; i++) {
              const xi = rng.int(-10, 10);
              const yi = rng.int(-10, 10);
              x.push(xi);
              y.push(yi);
              diffs.push(Math.abs(xi - yi));
            }
            const maxDiff = Math.max(...diffs);
            const xStr = `(${x.join(", ")})`;
            const yStr = `(${y.join(", ")})`;

            return numberProblem({
              prompt: t(
                `Calculate the Chebyshev distance ($L_\\infty$ or maximum Minkowski metric) $D_\\infty(\\mathbf{x}, \\mathbf{y}) = \\max_{1 \\le i \\le ${dim}} |x_i - y_i|$ between $\\mathbf{x} = ${xStr}$ and $\\mathbf{y} = ${yStr}$.`,
                `计算 $\\mathbf{x} = ${xStr}$ 与 $\\mathbf{y} = ${yStr}$ 之间的切比雪夫距离（$L_\\infty$ 或最大明可夫斯基度量）$D_\\infty(\\mathbf{x}, \\mathbf{y}) = \\max_{1 \\le i \\le ${dim}} |x_i - y_i|$。`,
              ),
              answer: maxDiff,
              solution: t(
                `The absolute differences along each coordinate are $|x_i - y_i| = [${diffs.join(", ")}]$. The maximum difference is $D_\\infty(\\mathbf{x}, \\mathbf{y}) = ${maxDiff}$.`,
                `各坐标方向上的绝对差值为 $|x_i - y_i| = [${diffs.join(", ")}]$。其中的最大差值为 $D_\\infty(\\mathbf{x}, \\mathbf{y}) = ${maxDiff}$。`,
              ),
            });
          }

          // Manhattan distance
          const dim = rng.int(3, 5);
          const x: number[] = [];
          const y: number[] = [];
          let manhattan = 0;
          for (let i = 0; i < dim; i++) {
            const xi = rng.int(-8, 12);
            const yi = rng.int(-8, 12);
            x.push(xi);
            y.push(yi);
            manhattan += Math.abs(xi - yi);
          }
          const xStr = `(${x.join(", ")})`;
          const yStr = `(${y.join(", ")})`;

          return numberProblem({
            prompt: t(
              `Calculate the Manhattan distance ($L_1$ Minkowski metric) $D_1(\\mathbf{x}, \\mathbf{y}) = \\sum_{i=1}^{${dim}} |x_i - y_i|$ between $\\mathbf{x} = ${xStr}$ and $\\mathbf{y} = ${yStr}$.`,
              `计算 $\\mathbf{x} = ${xStr}$ 与 $\\mathbf{y} = ${yStr}$ 之间的曼哈顿距离（$L_1$ 明可夫斯基度量）$D_1(\\mathbf{x}, \\mathbf{y}) = \\sum_{i=1}^{${dim}} |x_i - y_i|$。`,
            ),
            answer: manhattan,
            solution: t(
              `Summing the absolute differences coordinate by coordinate gives $D_1(\\mathbf{x}, \\mathbf{y}) = ${x.map((xi, i) => `|${xi} - (${y[i]})|`).join(" + ")} = ${manhattan}$.`,
              `逐坐标计算绝对差值并求和得 $D_1(\\mathbf{x}, \\mathbf{y}) = ${x.map((xi, i) => `|${xi} - (${y[i]})|`).join(" + ")} = ${manhattan}$。`,
            ),
          });
        },
      },
    ],
  },
];
