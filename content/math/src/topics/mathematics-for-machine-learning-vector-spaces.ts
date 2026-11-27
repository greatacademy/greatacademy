import type { Problem, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** distinct drops the mistakes whose value repeats an earlier one. */
const distinct = <M extends { readonly value: unknown }>(ms: readonly M[]): M[] =>
  ms.filter((m, i) => ms.findIndex((o) => String(o.value) === String(m.value)) === i);

/** p wraps a negative number in parentheses. */
const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);

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
    intro: t(
      "A spam filter keeps a weight for each of $3$ words, $\\mathbf{w} = (2, -1, 3)$, and an email has the word counts $\\mathbf{x} = (1, 4, 2)$. The Hadamard product $\\mathbf{w} \\odot \\mathbf{x} = (2, -4, 6)$ shows how much each word contributes on its own.\n\nCheck: the entries multiply in matching positions, $2 \\times 1 = 2$, $(-1) \\times 4 = -4$ and $3 \\times 2 = 6$.\n\nIn this lesson we compute the entries of Hadamard products of vectors and matrices and add up those entries.",
      "垃圾邮件过滤器给 $3$ 个词各设一个权重 $\\mathbf{w} = (2, -1, 3)$，一封邮件中这些词的次数是 $\\mathbf{x} = (1, 4, 2)$。阿达马积 $\\mathbf{w} \\odot \\mathbf{x} = (2, -4, 6)$ 显示了每个词各自的贡献。\n\n检验：对应位置的元素相乘，$2 \\times 1 = 2$，$(-1) \\times 4 = -4$，$3 \\times 2 = 6$。\n\n本课我们计算向量与矩阵的阿达马积的元素，并把这些元素相加。",
    ),
    knowledgePoints: [
      {
        id: "evaluating-hadamard-products",
        title: t("Computing Hadamard products and their components", "计算阿达马积及其元素"),
        explanation: t(
          "The Hadamard product multiplies vectors entry by entry rather than taking a dot product, so its result is a vector of the same length. For $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$, $(\\mathbf{u} \\odot \\mathbf{v})_i = u_i v_i$. The sum of the entries of $\\mathbf{u} \\odot \\mathbf{v}$ equals the standard inner product $\\mathbf{u}^T \\mathbf{v}$.\n\nFor example, with $\\mathbf{u} = (2, -3, 1)$ and $\\mathbf{v} = (4, 5, -2)$, $\\mathbf{u} \\odot \\mathbf{v} = (8, -15, -2)$, and its entries add to $8 - 15 - 2 = -9$.\n\nCheck: the dot product $\\mathbf{u}^T \\mathbf{v} = 8 + (-15) + (-2)$ is also $-9$.\n\n> **Watch out.** Multiply matching entries; do not add them, and do not multiply the sums of the two vectors: $(2 - 3 + 1)(4 + 5 - 2) = 0$, not $-9$.",
          "哈达玛积是逐个分量相乘，而不是求点积，所以结果是一个长度相同的向量。对于 $\\mathbf{u}, \\mathbf{v} \\in \\mathbb{R}^n$，$(\\mathbf{u} \\odot \\mathbf{v})_i = u_i v_i$。$\\mathbf{u} \\odot \\mathbf{v}$ 各分量之和等于标准内积 $\\mathbf{u}^T \\mathbf{v}$。\n\n例如，取 $\\mathbf{u} = (2, -3, 1)$ 与 $\\mathbf{v} = (4, 5, -2)$，则 $\\mathbf{u} \\odot \\mathbf{v} = (8, -15, -2)$，各分量之和为 $8 - 15 - 2 = -9$。\n\n检验：点积 $\\mathbf{u}^T \\mathbf{v} = 8 + (-15) + (-2)$ 也等于 $-9$。\n\n> **注意。** 要把对应分量相乘，不要相加，也不要把两个向量各自的和相乘：$(2 - 3 + 1)(4 + 5 - 2) = 0$，而不是 $-9$。",
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
            const at = `${targetRow}, ${targetCol}`;

            const formatMat = (M: number[][]) => `\\begin{pmatrix} ${M.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;

            return numberProblem({
              prompt: t(
                `Given the matrices $A = ${formatMat(A)}$ and $B = ${formatMat(B)}$, let $C = A \\odot B$ denote their Hadamard product. Find the entry $C_{${targetRow}, ${targetCol}} = (A \\odot B)_{${targetRow}, ${targetCol}}$.`,
                `给定矩阵 $A = ${formatMat(A)}$ 与 $B = ${formatMat(B)}$，设 $C = A \\odot B$ 为它们的阿达马积。求元素 $C_{${targetRow}, ${targetCol}} = (A \\odot B)_{${targetRow}, ${targetCol}}$ 的值。`,
              ),
              answer: ans,
              mistakes: distinct([
                why(valA + valB, "That adds the two matching entries instead of multiplying them.", "这把两个对应元素相加了，而不是相乘。"),
                why(
                  -ans,
                  `That flips the sign of the product; recheck the signs of $${valA}$ and $${valB}$.`,
                  `这把乘积的符号弄反了；请重新检查 $${valA}$ 与 $${valB}$ 的符号。`,
                ),
                why(valA - valB, "That subtracts the matching entries instead of multiplying them.", "这把对应元素相减了，而不是相乘。"),
              ]),
              solution: walked(
                [
                  [
                    ["Pick the matching entries", "取对应元素"],
                    t(
                      `The $(${at})$ entry of $A$ is $${valA}$, and the $(${at})$ entry of $B$ is $${valB}$.`,
                      `$A$ 的第 $(${at})$ 个元素是 $${valA}$，$B$ 的第 $(${at})$ 个元素是 $${valB}$。`,
                    ),
                  ],
                  [
                    ["Multiply them", "相乘"],
                    t(
                      `The Hadamard product multiplies matching entries: $C_{${at}} = ${p(valA)} \\times ${p(valB)} = ${ans}$.`,
                      `阿达马积把对应元素相乘：$C_{${at}} = ${p(valA)} \\times ${p(valB)} = ${ans}$。`,
                    ),
                  ],
                ],
                t(
                  `Multiplying in the other order, $${p(valB)} \\times ${p(valA)}$, also gives $${ans}$.`,
                  `换一个顺序相乘，$${p(valB)} \\times ${p(valA)}$ 也等于 $${ans}$。`,
                ),
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
          const sumU = u.reduce((s, x) => s + x, 0);
          const sumV = v.reduce((s, x) => s + x, 0);
          const prods = u.map((x, i) => x * v[i]!);

          const uLatex = `\\begin{bmatrix} ${u.join(" \\\\ ")} \\end{bmatrix}`;
          const vLatex = `\\begin{bmatrix} ${v.join(" \\\\ ")} \\end{bmatrix}`;
          const wLatex = `\\begin{bmatrix} ${u.map((x, i) => `${p(x)} \\times ${p(v[i]!)} = ${prods[i]}`).join(" \\\\ ")} \\end{bmatrix}`;

          return numberProblem({
            prompt: t(
              `Let $\\mathbf{u} = ${uLatex}$ and $\\mathbf{v} = ${vLatex}$ be vectors in $\\mathbb{R}^{${dim}}$. Find the sum of all components of their Hadamard product $\\mathbf{w} = \\mathbf{u} \\odot \\mathbf{v}$, i.e., $\\sum_{i=1}^{${dim}} w_i$.`,
              `设 $\\mathbf{u} = ${uLatex}$ 和 $\\mathbf{v} = ${vLatex}$ 为 $\\mathbb{R}^{${dim}}$ 中的向量。求它们的阿达马积 $\\mathbf{w} = \\mathbf{u} \\odot \\mathbf{v}$ 的所有分量之和，即 $\\sum_{i=1}^{${dim}} w_i$。`,
            ),
            answer: sumProd,
            mistakes: distinct([
              why(
                sumU + sumV,
                "That adds the sums of the two vectors instead of multiplying matching components.",
                "这把两个向量各自的和相加了，而不是把对应分量相乘。",
              ),
              why(
                sumU * sumV,
                `That multiplies the sums $${sumU}$ and $${sumV}$; the Hadamard product multiplies component by component before adding.`,
                `这把和 $${sumU}$ 与 $${sumV}$ 相乘了；阿达马积要先逐个分量相乘，再相加。`,
              ),
              why(
                -sumProd,
                "That flips the sign of the total; recheck the signs of the products.",
                "这把总和的符号弄反了；请重新检查各乘积的符号。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Multiply matching components", "对应分量相乘"],
                  t(`The Hadamard product is $\\mathbf{w} = ${wLatex}$.`, `阿达马积为 $\\mathbf{w} = ${wLatex}$。`),
                ],
                [
                  ["Add the components", "把分量相加"],
                  t(
                    `$\\sum_{i=1}^{${dim}} w_i = ${prods.map(p).join(" + ")} = ${sumProd}$.`,
                    `$\\sum_{i=1}^{${dim}} w_i = ${prods.map(p).join(" + ")} = ${sumProd}$。`,
                  ),
                ],
              ],
              t(
                `The sum of the components of $\\mathbf{u} \\odot \\mathbf{v}$ is the dot product $\\mathbf{u}^T \\mathbf{v}$, which also comes to $${sumProd}$.`,
                `$\\mathbf{u} \\odot \\mathbf{v}$ 的分量之和就是点积 $\\mathbf{u}^T \\mathbf{v}$，它也等于 $${sumProd}$。`,
              ),
            ),
          });
        },
      },
      {
        id: "summing-a-hadamard-product",
        title: t("Summing the entries of a Hadamard product", "阿达马积各元素之和"),
        explanation: t(
          "Adding up all entries of $A \\odot B$ gives the Frobenius inner product of the two matrices,\n$$\\langle A, B \\rangle_F = \\sum_{i,j} A_{ij}B_{ij} = \\operatorname{tr}(A^T B),$$\nthe matrix version of the dot product. It is not the sum of the entries of the matrix product $AB$. For $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ and $B = \\begin{pmatrix} 2 & 0 \\\\ 1 & -1 \\end{pmatrix}$, $A \\odot B = \\begin{pmatrix} 2 & 0 \\\\ 3 & -4 \\end{pmatrix}$, whose entries sum to $1$.\n\nCheck: row by row, $2 + 0 = 2$ and $3 + (-4) = -1$, and $2 + (-1) = 1$.\n\n> **Watch out.** Do not multiply the sum of the entries of $A$ by the sum of the entries of $B$: here that gives $10 \\times 2 = 20$, not $1$.",
          "把 $A \\odot B$ 的所有元素相加，得到两个矩阵的弗罗贝尼乌斯内积\n$$\\langle A, B \\rangle_F = \\sum_{i,j} A_{ij}B_{ij} = \\operatorname{tr}(A^T B),$$\n即点积的矩阵版本。它不是矩阵乘积 $AB$ 的元素之和。对 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ 与 $B = \\begin{pmatrix} 2 & 0 \\\\ 1 & -1 \\end{pmatrix}$，$A \\odot B = \\begin{pmatrix} 2 & 0 \\\\ 3 & -4 \\end{pmatrix}$，其元素之和为 $1$。\n\n检验：逐行相加，$2 + 0 = 2$，$3 + (-4) = -1$，而 $2 + (-1) = 1$。\n\n> **注意。** 不要把 $A$ 的元素之和与 $B$ 的元素之和相乘：这里那样得到 $10 \\times 2 = 20$，而不是 $1$。",
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
          const row1 = prods.slice(0, cols).reduce((s, v) => s + v, 0);
          const row2 = ans - row1;
          return numberProblem({
            prompt: t(
              `For $A = ${fmt(A)}$ and $B = ${fmt(B)}$, find the sum of all entries of $A \\odot B$.`,
              `对 $A = ${fmt(A)}$ 与 $B = ${fmt(B)}$，求 $A \\odot B$ 所有元素之和。`,
            ),
            answer: ans,
            form: "integer",
            mistakes: distinct([
              why(
                sumA * sumB,
                `That multiplies the entry sums $${sumA}$ and $${sumB}$ instead of multiplying matching entries first.`,
                `这把元素之和 $${sumA}$ 与 $${sumB}$ 相乘了，而不是先把对应元素相乘。`,
              ),
              why(
                sumA + sumB,
                "That adds all the entries of both matrices without multiplying any of them.",
                "这把两个矩阵的所有元素直接相加了，没有做任何乘法。",
              ),
              why(
                diag,
                "That keeps only the diagonal products $A_{11}B_{11} + A_{22}B_{22}$ and leaves out the other entries.",
                "这只保留了对角线上的乘积 $A_{11}B_{11} + A_{22}B_{22}$，漏掉了其他元素。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Multiply matching entries", "对应元素相乘"],
                  t(`The entries of $A \\odot B$ are $${prods.join(", ")}$.`, `$A \\odot B$ 的元素是 $${prods.join(", ")}$。`),
                ],
                [
                  ["Add the products", "把乘积相加"],
                  t(`$${prods.map(p).join(" + ")} = ${ans}$.`, `$${prods.map(p).join(" + ")} = ${ans}$。`),
                ],
              ],
              t(
                `Row by row, the products add to $${row1}$ and $${row2}$, and $${row1} + ${p(row2)} = ${ans}$.`,
                `逐行相加，乘积之和分别是 $${row1}$ 与 $${row2}$，而 $${row1} + ${p(row2)} = ${ans}$。`,
              ),
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
    intro: t(
      "A delivery robot on a city grid goes from $(1, 2)$ to $(4, 6)$. Along the streets it covers $|4 - 1| + |6 - 2| = 7$ blocks, the Manhattan distance, while a drone flies straight across $\\sqrt{3^2 + 4^2} = 5$ blocks, the Euclidean distance.\n\nCheck: $9 + 16 = 25$ and $\\sqrt{25} = 5$, shorter than the $7$ blocks of the streets.\n\nIn this lesson we compute Manhattan, Euclidean, Chebyshev and higher-order Minkowski distances between points.",
      "一个送货机器人在城市网格上从 $(1, 2)$ 走到 $(4, 6)$。沿街道走要经过 $|4 - 1| + |6 - 2| = 7$ 个街区，这是曼哈顿距离；而无人机直线飞过 $\\sqrt{3^2 + 4^2} = 5$ 个街区，这是欧几里得距离。\n\n检验：$9 + 16 = 25$，$\\sqrt{25} = 5$，比沿街道的 $7$ 个街区短。\n\n本课我们计算点之间的曼哈顿距离、欧几里得距离、切比雪夫距离和更高阶的闵可夫斯基距离。",
    ),
    knowledgePoints: [
      {
        id: "calculating-minkowski-distances",
        title: t("Calculating Manhattan and Euclidean distances", "计算曼哈顿距离与欧几里得距离"),
        explanation: t(
          "Manhattan distance adds the absolute differences along each axis like walking on a grid, while Euclidean distance takes the straight line length. $D_1(\\mathbf{x}, \\mathbf{y}) = \\sum_i |x_i - y_i|$ (Manhattan, $L_1$), and $D_2(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_i (x_i - y_i)^2}$ (Euclidean, $L_2$).\n\nFor example, between $(2, -1, 5)$ and $(4, 3, 1)$ the absolute differences are $2, 4, 4$, so $D_1 = 2 + 4 + 4 = 10$, $D_2 = \\sqrt{4 + 16 + 16} = 6$, and the Chebyshev distance, the largest difference, is $D_\\infty = 4$.\n\nCheck: the distances shrink as the order grows, $10 \\ge 6 \\ge 4$.\n\n> **Watch out.** Take absolute values before adding: the signed differences $-2, -4, 4$ add to $-2$, and a distance is never negative.",
          "曼哈顿距离像在网格上行走一样把各轴上的绝对差加起来，而欧氏距离取的是直线长度。$D_1(\\mathbf{x}, \\mathbf{y}) = \\sum_i |x_i - y_i|$（曼哈顿距离，$L_1$），$D_2(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_i (x_i - y_i)^2}$（欧几里得距离，$L_2$）。\n\n例如，$(2, -1, 5)$ 与 $(4, 3, 1)$ 之间差的绝对值为 $2, 4, 4$，所以 $D_1 = 2 + 4 + 4 = 10$，$D_2 = \\sqrt{4 + 16 + 16} = 6$，切比雪夫距离即最大的差 $D_\\infty = 4$。\n\n检验：阶数越大距离越小，$10 \\ge 6 \\ge 4$。\n\n> **注意。** 相加之前先取绝对值：带符号的差 $-2, -4, 4$ 相加得 $-2$，而距离不可能是负数。",
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
            const sum = chosen.reduce((s, v) => s + v, 0);
            const most = Math.max(...chosen);

            const xStr = `(${x.join(", ")})`;
            const yStr = `(${y.join(", ")})`;

            return numberProblem({
              prompt: t(
                `Calculate the Euclidean distance ($L_2$ distance) $D_2(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_{i=1}^{${dim}} (x_i - y_i)^2}$ between points $\\mathbf{x} = ${xStr}$ and $\\mathbf{y} = ${yStr}$.`,
                `计算点 $\\mathbf{x} = ${xStr}$ 与 $\\mathbf{y} = ${yStr}$ 之间的欧几里得距离（$L_2$ 距离）$D_2(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_{i=1}^{${dim}} (x_i - y_i)^2}$。`,
              ),
              answer: expectedDist,
              mistakes: distinct([
                why(
                  sum,
                  "That adds the absolute differences, which is the Manhattan distance, not the Euclidean one.",
                  "这把差的绝对值相加了，这是曼哈顿距离，而不是欧几里得距离。",
                ),
                why(
                  expectedDist * expectedDist,
                  "That is the sum of the squares; the distance is its square root.",
                  "这是平方和；距离是它的平方根。",
                ),
                why(most, "That is only the largest difference, the Chebyshev distance.", "这只是最大的差，即切比雪夫距离。"),
              ]),
              solution: walked(
                [
                  [
                    ["Square the differences", "差的平方"],
                    t(
                      `The component differences are $|x_i - y_i| = ${chosen.join(", ")}$, and $\\sum (x_i - y_i)^2 = ${chosen.map((d) => `${d}^2`).join(" + ")} = ${expectedDist * expectedDist}$.`,
                      `各分量差的绝对值为 $|x_i - y_i| = ${chosen.join(", ")}$，且 $\\sum (x_i - y_i)^2 = ${chosen.map((d) => `${d}^2`).join(" + ")} = ${expectedDist * expectedDist}$。`,
                    ),
                  ],
                  [
                    ["Take the square root", "开平方"],
                    t(
                      `$D_2(\\mathbf{x}, \\mathbf{y}) = \\sqrt{${expectedDist * expectedDist}} = ${expectedDist}$.`,
                      `$D_2(\\mathbf{x}, \\mathbf{y}) = \\sqrt{${expectedDist * expectedDist}} = ${expectedDist}$。`,
                    ),
                  ],
                ],
                t(
                  `$${expectedDist}^2 = ${expectedDist * expectedDist}$, and $${expectedDist}$ lies between the largest difference $${most}$ and the Manhattan distance $${sum}$.`,
                  `$${expectedDist}^2 = ${expectedDist * expectedDist}$，且 $${expectedDist}$ 介于最大的差 $${most}$ 与曼哈顿距离 $${sum}$ 之间。`,
                ),
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
            const lines = x.map((xi, i) => `|${xi} - ${p(y[i]!)}| = ${diffs[i]}`).join(", ");

            return numberProblem({
              prompt: t(
                `Calculate the Chebyshev distance ($L_\\infty$ or maximum Minkowski metric) $D_\\infty(\\mathbf{x}, \\mathbf{y}) = \\max_{1 \\le i \\le ${dim}} |x_i - y_i|$ between $\\mathbf{x} = ${xStr}$ and $\\mathbf{y} = ${yStr}$.`,
                `计算 $\\mathbf{x} = ${xStr}$ 与 $\\mathbf{y} = ${yStr}$ 之间的切比雪夫距离（$L_\\infty$ 或最大明可夫斯基度量）$D_\\infty(\\mathbf{x}, \\mathbf{y}) = \\max_{1 \\le i \\le ${dim}} |x_i - y_i|$。`,
              ),
              answer: maxDiff,
              mistakes: distinct([
                why(
                  diffs.reduce((s, v) => s + v, 0),
                  "That adds the absolute differences, which is the Manhattan distance.",
                  "这把差的绝对值相加了，这是曼哈顿距离。",
                ),
                why(
                  Math.min(...diffs),
                  "That is the smallest absolute difference; the Chebyshev distance takes the largest.",
                  "这是最小的绝对差；切比雪夫距离取最大的。",
                ),
                why(
                  Math.max(...x.map((xi, i) => xi - y[i]!)),
                  "That is the largest signed difference $x_i - y_i$, taken without absolute values.",
                  "这是不取绝对值时最大的差 $x_i - y_i$。",
                ),
              ]),
              solution: walked(
                [
                  [
                    ["Find the absolute differences", "求差的绝对值"],
                    t(`Coordinate by coordinate, $${lines}$.`, `逐个坐标计算，$${lines}$。`),
                  ],
                  [
                    ["Take the largest", "取最大值"],
                    t(
                      `The largest of $${diffs.join(", ")}$ is $D_\\infty(\\mathbf{x}, \\mathbf{y}) = ${maxDiff}$.`,
                      `$${diffs.join(", ")}$ 中最大的是 $D_\\infty(\\mathbf{x}, \\mathbf{y}) = ${maxDiff}$。`,
                    ),
                  ],
                ],
                t(
                  `Every absolute difference is at most $${maxDiff}$, and one of them equals it.`,
                  `每个绝对差都不超过 $${maxDiff}$，并且有一个恰好等于它。`,
                ),
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
          const abs = x.map((xi, i) => Math.abs(xi - y[i]!));
          const most = Math.max(...abs);

          return numberProblem({
            prompt: t(
              `Calculate the Manhattan distance ($L_1$ Minkowski metric) $D_1(\\mathbf{x}, \\mathbf{y}) = \\sum_{i=1}^{${dim}} |x_i - y_i|$ between $\\mathbf{x} = ${xStr}$ and $\\mathbf{y} = ${yStr}$.`,
              `计算 $\\mathbf{x} = ${xStr}$ 与 $\\mathbf{y} = ${yStr}$ 之间的曼哈顿距离（$L_1$ 明可夫斯基度量）$D_1(\\mathbf{x}, \\mathbf{y}) = \\sum_{i=1}^{${dim}} |x_i - y_i|$。`,
            ),
            answer: manhattan,
            mistakes: distinct([
              why(
                x.reduce((s, xi, i) => s + xi - y[i]!, 0),
                "That adds the signed differences $x_i - y_i$, so positive and negative differences cancel.",
                "这把带符号的差 $x_i - y_i$ 相加了，正负差相互抵消。",
              ),
              why(most, "That is only the largest absolute difference, the Chebyshev distance.", "这只是最大的绝对差，即切比雪夫距离。"),
              why(
                y.reduce((s, yi, i) => s + yi - x[i]!, 0),
                "That adds the signed differences $y_i - x_i$, so positive and negative differences cancel.",
                "这把带符号的差 $y_i - x_i$ 相加了，正负差相互抵消。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the absolute differences", "求差的绝对值"],
                  t(
                    `Coordinate by coordinate, $${x.map((xi, i) => `|${xi} - ${p(y[i]!)}| = ${abs[i]}`).join(", ")}$.`,
                    `逐个坐标计算，$${x.map((xi, i) => `|${xi} - ${p(y[i]!)}| = ${abs[i]}`).join(", ")}$。`,
                  ),
                ],
                [
                  ["Add them", "相加"],
                  t(
                    `$D_1(\\mathbf{x}, \\mathbf{y}) = ${abs.join(" + ")} = ${manhattan}$.`,
                    `$D_1(\\mathbf{x}, \\mathbf{y}) = ${abs.join(" + ")} = ${manhattan}$。`,
                  ),
                ],
              ],
              t(
                `The total $${manhattan}$ is at least the largest single difference $${most}$, as a sum of non-negative terms must be.`,
                `总和 $${manhattan}$ 不小于最大的单个差 $${most}$，非负项之和本应如此。`,
              ),
            ),
          });
        },
      },
      {
        id: "minkowski-distance-of-order-three",
        title: t("Minkowski distances of higher order", "高阶闵可夫斯基距离"),
        explanation: t(
          "For an order $p$ other than $1$ or $2$, apply the definition directly: raise each absolute difference to the $p$-th power, add, and take the $p$-th root,\n$$D_p(\\mathbf{x}, \\mathbf{y}) = \\Big(\\sum_i |x_i - y_i|^p\\Big)^{1/p}.$$\nFor differences $3, 4, 5$ and $p = 3$: $27 + 64 + 125 = 216$, and $\\sqrt[3]{216} = 6$. As $p$ grows the largest difference dominates, so $D_1 \\ge D_2 \\ge D_3 \\ge \\dots \\ge D_\\infty$: here $12 \\ge 7.07 \\ge 6 \\ge 5$.\n\nCheck: $6^3 = 6 \\times 6 \\times 6 = 216$.\n\n> **Watch out.** Cube the differences before adding, and take the cube root at the end: adding $3 + 4 + 5 = 12$ gives $D_1$, not $D_3$.",
          "当阶数 $p$ 不是 $1$ 或 $2$ 时，直接用定义：把每个差的绝对值取 $p$ 次方，相加，再开 $p$ 次方，\n$$D_p(\\mathbf{x}, \\mathbf{y}) = \\Big(\\sum_i |x_i - y_i|^p\\Big)^{1/p}.$$\n对差 $3, 4, 5$ 与 $p = 3$：$27 + 64 + 125 = 216$，$\\sqrt[3]{216} = 6$。随着 $p$ 增大，最大的差起主导作用，所以 $D_1 \\ge D_2 \\ge D_3 \\ge \\dots \\ge D_\\infty$：这里 $12 \\ge 7.07 \\ge 6 \\ge 5$。\n\n检验：$6^3 = 6 \\times 6 \\times 6 = 216$。\n\n> **注意。** 先把差取立方再相加，最后开立方：直接相加 $3 + 4 + 5 = 12$ 得到的是 $D_1$，而不是 $D_3$。",
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
          const sum = abs.reduce((s, v) => s + v, 0);
          const most = Math.max(...abs);
          return numberProblem({
            prompt: t(
              `Find the Minkowski distance of order $3$, $D_3(\\mathbf{x}, \\mathbf{y}) = \\left(\\sum_i |x_i - y_i|^3\\right)^{1/3}$, between $\\mathbf{x} = (${x.join(", ")})$ and $\\mathbf{y} = (${y.join(", ")})$.`,
              `求 $\\mathbf{x} = (${x.join(", ")})$ 与 $\\mathbf{y} = (${y.join(", ")})$ 之间的 $3$ 阶闵可夫斯基距离 $D_3(\\mathbf{x}, \\mathbf{y}) = \\left(\\sum_i |x_i - y_i|^3\\right)^{1/3}$。`,
            ),
            answer: dist,
            form: "integer",
            mistakes: distinct([
              why(
                sum,
                "That adds the differences without cubing them, which is the Manhattan distance $D_1$.",
                "这没有取立方就把差相加了，这是曼哈顿距离 $D_1$。",
              ),
              why(
                most,
                "That is only the largest difference, the Chebyshev distance $D_\\infty$.",
                "这只是最大的差，即切比雪夫距离 $D_\\infty$。",
              ),
              why(
                Math.round(sum / 3),
                "That averages the differences instead of cubing them and taking the cube root.",
                "这是把差取平均，而不是先取立方再开立方。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Cube the differences", "差的立方"],
                  t(
                    `The absolute differences are $${abs.join(", ")}$, and their cubes sum to $${cubes.join(" + ")} = ${dist ** 3}$.`,
                    `差的绝对值为 $${abs.join(", ")}$，它们的立方和为 $${cubes.join(" + ")} = ${dist ** 3}$。`,
                  ),
                ],
                [
                  ["Take the cube root", "开立方"],
                  t(
                    `$D_3(\\mathbf{x}, \\mathbf{y}) = \\sqrt[3]{${dist ** 3}} = ${dist}$.`,
                    `$D_3(\\mathbf{x}, \\mathbf{y}) = \\sqrt[3]{${dist ** 3}} = ${dist}$。`,
                  ),
                ],
              ],
              t(
                `$${dist}^3 = ${dist ** 3}$, and $${dist}$ lies between the largest difference $${most}$ and the sum $${sum}$.`,
                `$${dist}^3 = ${dist ** 3}$，且 $${dist}$ 介于最大的差 $${most}$ 与和 $${sum}$ 之间。`,
              ),
            ),
          });
        },
      },
    ],
  },
];
