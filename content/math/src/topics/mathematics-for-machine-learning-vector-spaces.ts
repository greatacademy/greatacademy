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
              wrong: [valA + valB, -ans, valA - valB],
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
            wrong: [
              u.reduce((s, x) => s + x, 0) + v.reduce((s, x) => s + x, 0),
              u.reduce((s, x) => s + x, 0) * v.reduce((s, x) => s + x, 0),
              -sumProd,
            ],
            solution: t(
              `The Hadamard product is $\\mathbf{w} = \\begin{bmatrix} ${u.map((x, i) => `${x} \\times ${v[i]} = ${x * v[i]!}`).join(" \\\\ ")} \\end{bmatrix}$. Summing these components yields $\\sum_{i=1}^{${dim}} w_i = ${sumProd}$.`,
              `阿达马积为 $\\mathbf{w} = \\begin{bmatrix} ${u.map((x, i) => `${x} \\times ${v[i]} = ${x * v[i]!}`).join(" \\\\ ")} \\end{bmatrix}$。将各分量求和得 $\\sum_{i=1}^{${dim}} w_i = ${sumProd}$。`,
            ),
          });
        },
      },
      {
        id: "summing-a-hadamard-product",
        title: t("Summing the entries of a Hadamard product", "阿达马积各元素之和"),
        explanation: t(
          "Adding up all entries of $A \\odot B$ gives the Frobenius inner product of the two matrices,\n$$\\langle A, B \\rangle_F = \\sum_{i,j} A_{ij}B_{ij} = \\operatorname{tr}(A^T B),$$\nthe matrix version of the dot product. It is not the sum of the entries of the matrix product $AB$. For $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ and $B = \\begin{pmatrix} 2 & 0 \\\\ 1 & -1 \\end{pmatrix}$, $A \\odot B = \\begin{pmatrix} 2 & 0 \\\\ 3 & -4 \\end{pmatrix}$, whose entries sum to $1$.",
          "把 $A \\odot B$ 的所有元素相加，得到两个矩阵的弗罗贝尼乌斯内积\n$$\\langle A, B \\rangle_F = \\sum_{i,j} A_{ij}B_{ij} = \\operatorname{tr}(A^T B),$$\n即点积的矩阵版本。它不是矩阵乘积 $AB$ 的元素之和。对 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ 与 $B = \\begin{pmatrix} 2 & 0 \\\\ 1 & -1 \\end{pmatrix}$，$A \\odot B = \\begin{pmatrix} 2 & 0 \\\\ 3 & -4 \\end{pmatrix}$，其元素之和为 $1$。",
        ),
        generate: (rng: Rng): Problem => {
          const rows = 2;
          const cols = rng.int(2, 3);
          const entry = () => rng.int(-5, 6);
          const A = Array.from({ length: rows }, () => Array.from({ length: cols }, entry));
          const B = Array.from({ length: rows }, () => Array.from({ length: cols }, entry));
          const fmt = (M: number[][]) => `\\begin{pmatrix} ${M.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
          const prods = A.flatMap((r, i) => r.map((v, j) => v * B[i]![j]!));
          const ans = prods.reduce((s, v) => s + v, 0);
          const sumA = A.flat().reduce((s, v) => s + v, 0);
          const sumB = B.flat().reduce((s, v) => s + v, 0);
          const diag = A.reduce((s, r, i) => s + r[i]! * B[i]![i]!, 0);
          return numberProblem({
            prompt: t(
              `For $A = ${fmt(A)}$ and $B = ${fmt(B)}$, find the sum of all entries of $A \\odot B$.`,
              `对 $A = ${fmt(A)}$ 与 $B = ${fmt(B)}$，求 $A \\odot B$ 所有元素之和。`,
            ),
            answer: ans,
            form: "integer",
            wrong: [sumA * sumB, sumA + sumB, diag],
            solution: t(
              `Multiply matching entries: $${prods.map((v) => (v < 0 ? `(${v})` : `${v}`)).join(" + ")} = ${ans}$.`,
              `对应元素相乘再相加：$${prods.map((v) => (v < 0 ? `(${v})` : `${v}`)).join(" + ")} = ${ans}$。`,
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
              wrong: [chosen.reduce((s, v) => s + v, 0), expectedDist * expectedDist, Math.max(...chosen)],
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
              wrong: [diffs.reduce((s, v) => s + v, 0), Math.min(...diffs), Math.max(...x.map((xi, i) => xi - y[i]!))],
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
            wrong: [
              x.reduce((s, xi, i) => s + xi - y[i]!, 0),
              Math.max(...x.map((xi, i) => Math.abs(xi - y[i]!))),
              y.reduce((s, yi, i) => s + yi - x[i]!, 0),
            ],
            solution: t(
              `Summing the absolute differences coordinate by coordinate gives $D_1(\\mathbf{x}, \\mathbf{y}) = ${x.map((xi, i) => `|${xi} - (${y[i]})|`).join(" + ")} = ${manhattan}$.`,
              `逐坐标计算绝对差值并求和得 $D_1(\\mathbf{x}, \\mathbf{y}) = ${x.map((xi, i) => `|${xi} - (${y[i]})|`).join(" + ")} = ${manhattan}$。`,
            ),
          });
        },
      },
      {
        id: "minkowski-distance-of-order-three",
        title: t("Minkowski distances of higher order", "高阶闵可夫斯基距离"),
        explanation: t(
          "For an order $p$ other than $1$ or $2$, apply the definition directly: raise each absolute difference to the $p$-th power, add, and take the $p$-th root,\n$$D_p(\\mathbf{x}, \\mathbf{y}) = \\Big(\\sum_i |x_i - y_i|^p\\Big)^{1/p}.$$\nFor differences $3, 4, 5$ and $p = 3$: $27 + 64 + 125 = 216$, and $\\sqrt[3]{216} = 6$. As $p$ grows the largest difference dominates, so $D_1 \\ge D_2 \\ge D_3 \\ge \\dots \\ge D_\\infty$: here $12 \\ge 7.07 \\ge 6 \\ge 5$.",
          "当阶数 $p$ 不是 $1$ 或 $2$ 时，直接用定义：把每个差的绝对值取 $p$ 次方，相加，再开 $p$ 次方，\n$$D_p(\\mathbf{x}, \\mathbf{y}) = \\Big(\\sum_i |x_i - y_i|^p\\Big)^{1/p}.$$\n对差 $3, 4, 5$ 与 $p = 3$：$27 + 64 + 125 = 216$，$\\sqrt[3]{216} = 6$。随着 $p$ 增大，最大的差起主导作用，所以 $D_1 \\ge D_2 \\ge D_3 \\ge \\dots \\ge D_\\infty$：这里 $12 \\ge 7.07 \\ge 6 \\ge 5$。",
        ),
        generate: (rng: Rng): Problem => {
          const [diffs, dist] = rng.pick([
            [[3, 4, 5], 6],
            [[1, 6, 8], 9],
            [[6, 8, 10], 12],
            [[2, 12, 16], 18],
            [[9, 12, 15], 18],
            [[3, 10, 18], 19],
            [[7, 14, 17], 20],
          ] as const);
          const order = rng.shuffle([0, 1, 2]);
          const x = [0, 1, 2].map(() => rng.int(-9, 12));
          const y = x.map((v, i) => v - (rng.bool() ? 1 : -1) * diffs[order[i]!]!);
          const abs = x.map((v, i) => Math.abs(v - y[i]!));
          const cubes = abs.map((v) => v ** 3);
          return numberProblem({
            prompt: t(
              `Find the Minkowski distance of order $3$, $D_3(\\mathbf{x}, \\mathbf{y}) = \\left(\\sum_i |x_i - y_i|^3\\right)^{1/3}$, between $\\mathbf{x} = (${x.join(", ")})$ and $\\mathbf{y} = (${y.join(", ")})$.`,
              `求 $\\mathbf{x} = (${x.join(", ")})$ 与 $\\mathbf{y} = (${y.join(", ")})$ 之间的 $3$ 阶闵可夫斯基距离 $D_3(\\mathbf{x}, \\mathbf{y}) = \\left(\\sum_i |x_i - y_i|^3\\right)^{1/3}$。`,
            ),
            answer: dist,
            form: "integer",
            wrong: [abs.reduce((s, v) => s + v, 0), Math.max(...abs), Math.round(abs.reduce((s, v) => s + v, 0) / 3)],
            solution: t(
              `The absolute differences are $${abs.join(", ")}$. Their cubes sum to $${cubes.join(" + ")} = ${dist ** 3}$, and $\\sqrt[3]{${dist ** 3}} = ${dist}$.`,
              `差的绝对值为 $${abs.join(", ")}$。它们的立方和为 $${cubes.join(" + ")} = ${dist ** 3}$，且 $\\sqrt[3]{${dist ** 3}} = ${dist}$。`,
            ),
          });
        },
      },
    ],
  },
];
