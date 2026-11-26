import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";

import { article, choiceProblem, numberProblem, pointProblem, say, vectorLatex, why, withMistakes } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";

/** sumLatex writes a sum of numbers with negatives in parentheses: "3 + (-2) + 5". */
function sumLatex(values: readonly number[]): string {
  return values.map((v, i) => (i === 0 ? `${v}` : paren(v))).join(" + ");
}

/** entrySum adds the entries of a vector. */
function entrySum(v: readonly number[]): number {
  return v.reduce((s, x) => s + x, 0);
}

/** dedupeSaid keeps the first of each response and drops the right answer. */
function dedupeSaid<T extends { readonly response: string }>(list: readonly T[], right: string): T[] {
  return list.filter((m, i, all) => m.response !== right && all.findIndex((o) => o.response === m.response) === i);
}

/** colVecLatex renders a column vector in LaTeX. */
function colVecLatex(v: readonly (number | string)[]): string {
  return `\\begin{pmatrix} ${v.join(" \\\\ ")} \\end{pmatrix}`;
}

/** matLatex renders a matrix in LaTeX. */
function matLatex(rows: readonly (readonly (number | string)[])[]): string {
  return `\\begin{pmatrix} ${rows.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
}

/** formatLinearTerm formats a single term like "+ 2x", "- y", "3z", or "5". */
function formatLinearTerm(coeff: number, symbol: string, isFirst = true): string {
  if (coeff === 0) return "";
  const sign = isFirst ? (coeff < 0 ? "-" : "") : coeff < 0 ? "- " : "+ ";
  const abs = Math.abs(coeff);
  const coeffPart = symbol === "" || abs !== 1 ? `${abs}` : "";
  return `${sign}${coeffPart}${symbol}`;
}

/** formatLinearExpr formats a linear combination of symbols with coefficients, e.g. 2x - 3y + z. */
function formatLinearExpr(terms: readonly (readonly [number, string])[]): string {
  const nonZero = terms.filter(([c]) => c !== 0);
  if (nonZero.length === 0) return "0";
  return nonZero.map(([c, sym], i) => formatLinearTerm(c, sym, i === 0)).join(" ");
}

/** formatVectorComb formats a linear combination of vector symbols like 2\mathbf{v}_1 - 3\mathbf{v}_2 + \mathbf{v}_3. */
function formatVectorComb(terms: readonly (readonly [number, string])[]): string {
  return formatLinearExpr(terms);
}

/** formatPoly2 formats a degree <= 2 polynomial a0 + a1 t + a2 t^2. */
function formatPoly2(a0: number, a1: number, a2: number, tVar = "t"): string {
  return formatLinearExpr([
    [a0, ""],
    [a1, tVar],
    [a2, `${tVar}^2`],
  ]);
}

/** oneOf builds a multiple-choice problem with options shuffled and deduplicated. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
      if (rest.length === 3) break;
    }
  }
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE 3.9: VECTORS IN N-DIMENSIONAL SPACE
// ════════════════════════════════════════════════════════════════════════════

/** vectorsInNDimensionalEuclideanSpace covers column vectors in ℝⁿ, vector addition and scalar multiplication. */
export const vectorsInNDimensionalEuclideanSpace: TopicDef = {
  id: "vectors-in-n-dimensional-euclidean-space",
  title: t("Vectors in N-Dimensional Euclidean Space", "N 维欧几里得空间中的向量"),
  summary: t(
    "Represent vectors in $\\mathbb{R}^n$ as column vectors, perform componentwise vector addition, and calculate scalar multiples.",
    "掌握将 $\\mathbb{R}^n$ 中的向量表示为列向量，并进行分量加法与标量乘法运算。",
  ),
  intro: t(
    "In $\\mathbb{R}^4$ take $\\mathbf{u} = (1, -2, 0, 3)^T$ and $\\mathbf{v} = (4, 1, -5, 2)^T$. Adding entry by entry gives $\\mathbf{u} + \\mathbf{v} = (5, -1, -5, 5)^T$, and scaling every entry gives $2\\mathbf{u} = (2, -4, 0, 6)^T$.\n\nCheck: subtracting $\\mathbf{v}$ from $(5, -1, -5, 5)^T$ gives $(1, -2, 0, 3)^T = \\mathbf{u}$ again.\n\nIn this lesson we add vectors in $\\mathbb{R}^n$ and multiply them by scalars, one entry at a time.",
    "在 $\\mathbb{R}^4$ 中取 $\\mathbf{u} = (1, -2, 0, 3)^T$，$\\mathbf{v} = (4, 1, -5, 2)^T$。逐个分量相加得 $\\mathbf{u} + \\mathbf{v} = (5, -1, -5, 5)^T$，每个分量乘以 $2$ 得 $2\\mathbf{u} = (2, -4, 0, 6)^T$。\n\n检验：从 $(5, -1, -5, 5)^T$ 中减去 $\\mathbf{v}$，又得到 $(1, -2, 0, 3)^T = \\mathbf{u}$。\n\n本课我们在 $\\mathbb{R}^n$ 中逐个分量地做向量加法与数乘。",
  ),
  prerequisites: ["addition-and-scalar-multiplication-of-cartesian-vectors-in-3d"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "rn-vectors-addition",
      title: t("Vector addition in $\\mathbb{R}^n$", "$\\mathbb{R}^n$ 中的向量加法"),
      explanation: t(
        "Adding vectors works the same way in any number of dimensions: add the entries in the same position and leave the others alone. Vectors in $\\mathbb{R}^n$ are added componentwise: if $\\mathbf{u} = (u_1, \\dots, u_n)^T$ and $\\mathbf{v} = (v_1, \\dots, v_n)^T$, then $\\mathbf{u} + \\mathbf{v} = (u_1 + v_1, \\dots, u_n + v_n)^T$. For example, $(1, 2, 3, 4)^T + (0, -2, 5, 1)^T = (1, 0, 8, 5)^T$.\n\n> **Watch out.** Only vectors with the same number of entries can be added, and each entry is added with the entry in the same position, keeping its sign.",
        "在任意维数中向量加法都一样：把相同位置的分量相加，互不影响。$\\mathbb{R}^n$ 中的向量加法是按分量进行的：若 $\\mathbf{u} = (u_1, \\dots, u_n)^T$ 且 $\\mathbf{v} = (v_1, \\dots, v_n)^T$，则 $\\mathbf{u} + \\mathbf{v} = (u_1 + v_1, \\dots, u_n + v_n)^T$。例如 $(1, 2, 3, 4)^T + (0, -2, 5, 1)^T = (1, 0, 8, 5)^T$。\n\n> **注意。** 只有分量个数相同的向量才能相加，并且每个分量与同一位置的分量相加，保留其符号。",
      ),
      generate(rng) {
        const n = 4;
        const u = Array.from({ length: n }, () => rng.int(-6, 6));
        const v = Array.from({ length: n }, () => rng.int(-6, 6));
        const sum = u.map((x, i) => x + v[i]!);
        const prompt = t(
          `In $\\mathbb{R}^4$, compute $\\mathbf{u} + \\mathbf{v}$ for $\\mathbf{u} = ${colVecLatex(u)}$ and $\\mathbf{v} = ${colVecLatex(v)}$. Enter the vector as $\\langle a, b, c, d \\rangle$.`,
          `在 $\\mathbb{R}^4$ 中，计算向量 $\\mathbf{u} = ${colVecLatex(u)}$ 与 $\\mathbf{v} = ${colVecLatex(v)}$ 的和 $\\mathbf{u} + \\mathbf{v}$。以 $\\langle a, b, c, d \\rangle$ 的形式输入结果。`,
        );
        const pairs = colVecLatex(u.map((x, i) => `${x} + ${paren(v[i]!)}`));
        const back = colVecLatex(sum.map((x, i) => `${x} - ${paren(v[i]!)}`));
        return withMistakes(
          pointProblem({
            prompt,
            answer: sum,
            vector: true,
            vars: ["x_1", "x_2", "x_3", "x_4"],
            solution: walked(
              [
                [
                  ["Pair the entries", "对齐分量"],
                  t(
                    "Both vectors have $4$ entries, so add the entries in the same position:",
                    "两个向量都有 $4$ 个分量，把同一位置的分量相加：",
                  ),
                  [`\\mathbf{u} + \\mathbf{v} = ${pairs}`],
                ],
                [["Add each pair", "逐对相加"], t("", ""), [`\\mathbf{u} + \\mathbf{v} = ${colVecLatex(sum)}`]],
              ],
              t(
                `Subtracting $\\mathbf{v}$ again gives $${back} = ${colVecLatex(u)} = \\mathbf{u}$.`,
                `再减去 $\\mathbf{v}$ 得 $${back} = ${colVecLatex(u)} = \\mathbf{u}$。`,
              ),
            ),
          }),
          dedupeSaid(
            [
              say(
                vectorLatex(u.map((x, i) => x - v[i]!)),
                "That is $\\mathbf{u} - \\mathbf{v}$; each entry of $\\mathbf{v}$ is added, not subtracted.",
                "这是 $\\mathbf{u} - \\mathbf{v}$；$\\mathbf{v}$ 的每个分量要相加，而不是相减。",
              ),
              say(
                vectorLatex(sum.map((x) => -x)),
                "Every sign is flipped; the sum keeps the signs of the entries.",
                "每个符号都反了；和要保留各分量的符号。",
              ),
              say(
                vectorLatex(sum.map((x, i) => (i === 1 ? x + 1 : x))),
                `The second entry is off: $${u[1]} + ${paren(v[1]!)} = ${sum[1]}$.`,
                `第二个分量算错了：$${u[1]} + ${paren(v[1]!)} = ${sum[1]}$。`,
              ),
            ],
            vectorLatex(sum),
          ),
        );
      },
    },
    {
      id: "rn-vectors-scalar-multiplication",
      title: t("Scalar multiplication in $\\mathbb{R}^n$", "$\\mathbb{R}^n$ 中的标量乘法与线性组合"),
      explanation: t(
        "A scalar multiplies every entry of a vector, and a linear combination is formed by scaling each vector and then adding the results entry by entry. For a scalar $c$ and a vector $\\mathbf{u}$ in $\\mathbb{R}^n$, $c\\mathbf{u} = (cu_1, \\dots, cu_n)^T$. A linear combination $c\\mathbf{u} + d\\mathbf{v}$ is computed componentwise. For example, $2(1, 0, -1, 3)^T - (0, 4, 1, 1)^T = (2, -4, -3, 5)^T$.\n\n> **Watch out.** The scalar multiplies every entry, not only the first, and a negative scalar flips the sign of each entry it multiplies.",
        "数乘向量就是用这个数乘向量的每个分量，线性组合则是先把每个向量数乘，再把结果逐个分量相加。对于标量 $c$ 与向量 $\\mathbf{u} \\in \\mathbb{R}^n$，$c\\mathbf{u} = (cu_1, \\dots, cu_n)^T$。线性组合 $c\\mathbf{u} + d\\mathbf{v}$ 逐分量计算。例如 $2(1, 0, -1, 3)^T - (0, 4, 1, 1)^T = (2, -4, -3, 5)^T$。\n\n> **注意。** 标量要乘每一个分量，而不只是第一个；负的标量会改变它所乘的每个分量的符号。",
      ),
      generate(rng) {
        const c = rng.nonZero(-3, 3);
        const d = rng.nonZero(-3, 3);
        const u = Array.from({ length: 4 }, () => rng.int(-4, 4));
        const v = Array.from({ length: 4 }, () => rng.int(-4, 4));
        const res = u.map((x, i) => c * x + d * v[i]!);
        const expr = formatVectorComb([
          [c, "\\mathbf{u}"],
          [d, "\\mathbf{v}"],
        ]);
        const prompt = t(
          `Given $\\mathbf{u} = ${colVecLatex(u)}$ and $\\mathbf{v} = ${colVecLatex(v)}$ in $\\mathbb{R}^4$, compute $${expr}$. Enter the vector as $\\langle a, b, c, d \\rangle$.`,
          `已知 $\\mathbb{R}^4$ 中的向量 $\\mathbf{u} = ${colVecLatex(u)}$ 与 $\\mathbf{v} = ${colVecLatex(v)}$，计算 $${expr}$。以 $\\langle a, b, c, d \\rangle$ 的形式输入结果。`,
        );
        const cu = u.map((x) => c * x);
        const dv = v.map((x) => d * x);
        return withMistakes(
          pointProblem({
            prompt,
            answer: res,
            vector: true,
            vars: ["x_1", "x_2", "x_3", "x_4"],
            solution: walked(
              [
                [
                  ["Scale each vector", "数乘每个向量"],
                  t("Multiply every entry by its scalar:", "用标量乘每个分量："),
                  [`${c}\\mathbf{u} = ${colVecLatex(cu)}, \\quad ${d}\\mathbf{v} = ${colVecLatex(dv)}`],
                ],
                [["Add entry by entry", "逐个分量相加"], t("", ""), [`${expr} = ${colVecLatex(res)}`]],
              ],
              t(
                `The entries of the answer add up to $${entrySum(res)}$, and so do those of the combination: $${c} \\cdot ${paren(entrySum(u))} + ${paren(d)} \\cdot ${paren(entrySum(v))} = ${entrySum(res)}$.`,
                `答案各分量之和为 $${entrySum(res)}$，组合的分量和也是：$${c} \\cdot ${paren(entrySum(u))} + ${paren(d)} \\cdot ${paren(entrySum(v))} = ${entrySum(res)}$。`,
              ),
            ),
          }),
          dedupeSaid(
            [
              say(
                vectorLatex(u.map((x, i) => c * x - d * v[i]!)),
                `The sign of the second term is wrong: it is $${d}\\mathbf{v}$, added entry by entry.`,
                `第二项的符号错了：它是 $${d}\\mathbf{v}$，要逐个分量相加。`,
              ),
              say(
                vectorLatex(u.map((x, i) => d * x + c * v[i]!)),
                "The scalars are swapped: $c$ goes with $\\mathbf{u}$ and $d$ with $\\mathbf{v}$.",
                "两个标量对调了：$c$ 乘 $\\mathbf{u}$，$d$ 乘 $\\mathbf{v}$。",
              ),
              say(
                vectorLatex(res.map((x) => -x)),
                "Every sign is flipped; recheck the signs of the two scalars.",
                "每个符号都反了；请重新检查两个标量的符号。",
              ),
            ],
            vectorLatex(res),
          ),
        );
      },
    },
  ],
};

/** linearCombinationsOfVectorsInNDimensionalEuclideanSpace covers forming linear combinations and checking if a vector is a linear combination. */
export const linearCombinationsOfVectorsInNDimensionalEuclideanSpace: TopicDef = {
  id: "linear-combinations-of-vectors-in-n-dimensional-euclidean-space",
  title: t("Linear Combinations of Vectors in N-Dimensional Euclidean Space", "N 维向量的线性组合"),
  summary: t(
    "Calculate linear combinations of vectors and determine if a vector b can be written as a linear combination of a set of vectors.",
    "计算向量的线性组合，并通过增广矩阵判断向量 b 是否可由一组向量线性表出。",
  ),
  intro: t(
    "With $\\mathbf{v}_1 = (1, 0, 2)^T$ and $\\mathbf{v}_2 = (0, 1, -1)^T$, the combination $3\\mathbf{v}_1 - 2\\mathbf{v}_2$ is $(3, 0, 6)^T + (0, -2, 2)^T = (3, -2, 8)^T$. Going the other way, $\\mathbf{b} = (3, -2, 8)^T$ is a combination $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2$: the first entry forces $c_1 = 3$ and the second forces $c_2 = -2$.\n\nCheck: the third entry must then be $3 \\cdot 2 + (-2)(-1) = 8$, and it is.\n\nIn this lesson we compute linear combinations and decide whether a vector is one, by solving for the weights.",
    "取 $\\mathbf{v}_1 = (1, 0, 2)^T$，$\\mathbf{v}_2 = (0, 1, -1)^T$，组合 $3\\mathbf{v}_1 - 2\\mathbf{v}_2 = (3, 0, 6)^T + (0, -2, 2)^T = (3, -2, 8)^T$。反过来，$\\mathbf{b} = (3, -2, 8)^T$ 是组合 $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2$：第一个分量迫使 $c_1 = 3$，第二个分量迫使 $c_2 = -2$。\n\n检验：于是第三个分量必须是 $3 \\cdot 2 + (-2)(-1) = 8$，确实如此。\n\n本课我们计算线性组合，并通过求权重判断一个向量是否为线性组合。",
  ),
  prerequisites: ["vectors-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "compute-linear-combination-3-vectors",
      title: t("Computing a linear combination of vectors", "计算多个向量的线性组合"),
      explanation: t(
        "Scale each vector by its weight first, then add the scaled vectors one entry at a time to get a single vector. A linear combination of vectors $\\mathbf{v}_1, \\dots, \\mathbf{v}_k$ with weights $c_1, \\dots, c_k$ is the vector $c_1\\mathbf{v}_1 + \\dots + c_k\\mathbf{v}_k$. For example, $2(1, 1, 0)^T + (0, 3, 1)^T - (1, 0, 2)^T = (1, 5, -1)^T$.\n\n> **Watch out.** Each weight belongs to its own vector; a minus sign in front of a weight flips every entry of that vector.",
        "先用权重数乘每个向量，再把数乘后的向量逐个分量相加，得到一个向量。向量组 $\\mathbf{v}_1, \\dots, \\mathbf{v}_k$ 关于权重 $c_1, \\dots, c_k$ 的线性组合为向量 $c_1\\mathbf{v}_1 + \\dots + c_k\\mathbf{v}_k$。例如 $2(1, 1, 0)^T + (0, 3, 1)^T - (1, 0, 2)^T = (1, 5, -1)^T$。\n\n> **注意。** 每个权重只属于它自己的向量；权重前的负号会改变该向量每个分量的符号。",
      ),
      generate(rng) {
        const c1 = rng.nonZero(-3, 3);
        const c2 = rng.nonZero(-3, 3);
        const c3 = rng.nonZero(-3, 3);
        const v1 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const v2 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const v3 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const res = [0, 1, 2].map((i) => c1 * v1[i]! + c2 * v2[i]! + c3 * v3[i]!);
        const expr = formatVectorComb([
          [c1, "\\mathbf{v}_1"],
          [c2, "\\mathbf{v}_2"],
          [c3, "\\mathbf{v}_3"],
        ]);
        const prompt = t(
          `Compute the linear combination $${expr}$ for $\\mathbf{v}_1 = ${colVecLatex(v1)}$, $\\mathbf{v}_2 = ${colVecLatex(v2)}$, and $\\mathbf{v}_3 = ${colVecLatex(v3)}$. Enter the vector as $\\langle a, b, c \\rangle$.`,
          `计算线性组合 $${expr}$，其中 $\\mathbf{v}_1 = ${colVecLatex(v1)}$，$\\mathbf{v}_2 = ${colVecLatex(v2)}$，$\\mathbf{v}_3 = ${colVecLatex(v3)}$。以 $\\langle a, b, c \\rangle$ 的形式输入结果。`,
        );
        const scaled = [
          [c1, v1],
          [c2, v2],
          [c3, v3],
        ] as const;
        const sums = [v1, v2, v3].map(entrySum);
        return withMistakes(
          pointProblem({
            prompt,
            answer: res,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Scale each vector", "数乘每个向量"],
                  t("Multiply every entry by its weight:", "用权重乘每个分量："),
                  [scaled.map(([c, v], k) => `${c}\\mathbf{v}_${k + 1} = ${colVecLatex(v.map((x) => c * x))}`).join(", \\quad ")],
                ],
                [["Add entry by entry", "逐个分量相加"], t("", ""), [`${expr} = ${colVecLatex(res)}`]],
              ],
              t(
                `The entries of the answer add up to $${entrySum(res)}$, and the weights applied to the entry sums give the same: $${c1} \\cdot ${paren(sums[0]!)} + ${paren(c2)} \\cdot ${paren(sums[1]!)} + ${paren(c3)} \\cdot ${paren(sums[2]!)} = ${entrySum(res)}$.`,
                `答案各分量之和为 $${entrySum(res)}$，用权重乘各向量的分量和也一样：$${c1} \\cdot ${paren(sums[0]!)} + ${paren(c2)} \\cdot ${paren(sums[1]!)} + ${paren(c3)} \\cdot ${paren(sums[2]!)} = ${entrySum(res)}$。`,
              ),
            ),
          }),
          dedupeSaid(
            [
              say(
                vectorLatex([0, 1, 2].map((i) => c1 * v1[i]! - c2 * v2[i]! + c3 * v3[i]!)),
                `The sign of the middle term is wrong: it is $${c2}\\mathbf{v}_2$.`,
                `中间一项的符号错了：它是 $${c2}\\mathbf{v}_2$。`,
              ),
              say(
                vectorLatex([0, 1, 2].map((i) => v1[i]! + v2[i]! + v3[i]!)),
                "The weights are missing: each vector is scaled before adding.",
                "漏了权重：每个向量都要先数乘再相加。",
              ),
              say(
                vectorLatex(res.map((x) => -x)),
                "Every sign is flipped; recheck the signs of the weights.",
                "每个符号都反了；请重新检查各权重的符号。",
              ),
            ],
            vectorLatex(res),
          ),
        );
      },
    },
    {
      id: "determine-if-linear-combination",
      title: t("Determining if a vector is a linear combination", "判定向量是否为线性组合"),
      explanation: t(
        "A vector $\\mathbf{b}$ is a linear combination of $\\mathbf{v}_1, \\dots, \\mathbf{v}_k$ if and only if the vector equation $c_1\\mathbf{v}_1 + \\dots + c_k\\mathbf{v}_k = \\mathbf{b}$ has a solution, which corresponds to the augmented matrix $[\\mathbf{v}_1 \\ \\cdots \\ \\mathbf{v}_k \\mid \\mathbf{b}]$ being consistent. For example, $(2, 3, 5)^T = 2(1, 0, 1)^T + 3(0, 1, 1)^T$, while $(2, 3, 6)^T$ is no combination of these two: their combinations all have third entry equal to the sum of the first two.\n\n> **Watch out.** Weights that fit some of the entries are not enough; they must fit every entry of $\\mathbf{b}$.",
        "向量 $\\mathbf{b}$ 可由 $\\mathbf{v}_1, \\dots, \\mathbf{v}_k$ 线性表出，当且仅当方程 $c_1\\mathbf{v}_1 + \\dots + c_k\\mathbf{v}_k = \\mathbf{b}$ 有解，即增广矩阵 $[\\mathbf{v}_1 \\ \\cdots \\ \\mathbf{v}_k \\mid \\mathbf{b}]$ 相容。例如 $(2, 3, 5)^T = 2(1, 0, 1)^T + 3(0, 1, 1)^T$，而 $(2, 3, 6)^T$ 不是这两个向量的组合：它们的组合第三个分量都等于前两个之和。\n\n> **注意。** 只符合部分分量的权重是不够的，必须符合 $\\mathbf{b}$ 的每个分量。",
      ),
      generate(rng) {
        const c1 = rng.nonZero(-3, 3);
        const c2 = rng.nonZero(-3, 3);
        const a = rng.nonZero(-2, 2);
        const b = rng.int(-3, 3);
        const d = rng.nonZero(-2, 2);
        const v1 = [a, b, a + b];
        const v2 = [0, d, d];
        const isComb = rng.bool();
        const delta = isComb ? 0 : rng.pick([-3, -2, -1, 1, 2, 3]);
        const target = [c1 * v1[0]! + c2 * v2[0]!, c1 * v1[1]! + c2 * v2[1]!, c1 * v1[2]! + c2 * v2[2]! + delta];
        const combStr = formatVectorComb([
          [c1, "\\mathbf{v}_1"],
          [c2, "\\mathbf{v}_2"],
        ]);
        const prompt = t(
          `Determine whether $\\mathbf{b} = ${colVecLatex(target)}$ can be written as a linear combination of $\\mathbf{v}_1 = ${colVecLatex(v1)}$ and $\\mathbf{v}_2 = ${colVecLatex(v2)}$.`,
          `判断向量 $\\mathbf{b} = ${colVecLatex(target)}$ 是否可由 $\\mathbf{v}_1 = ${colVecLatex(v1)}$ 与 $\\mathbf{v}_2 = ${colVecLatex(v2)}$ 线性表出。`,
        );
        const right = isComb
          ? t(`Yes, $\\mathbf{b} = ${combStr}$`, `是，$\\mathbf{b} = ${combStr}$`)
          : t(
              `No, the weights that fit the first two entries miss the third, so the system is inconsistent`,
              `否，符合前两个分量的权重不符合第三个分量，方程组不相容`,
            );
        const yes = (p: number, q: number) => {
          const s = formatVectorComb([
            [p, "\\mathbf{v}_1"],
            [q, "\\mathbf{v}_2"],
          ]);
          return t(`Yes, $\\mathbf{b} = ${s}$`, `是，$\\mathbf{b} = ${s}$`);
        };
        const no = t(`No, the system has no solution`, `否，该方程组无解`);
        const wrong = isComb
          ? [no, yes(c1 + 1, c2), yes(c1, c2 - 1)]
          : [
              yes(c1, c2),
              t(`Yes, $\\mathbf{b} = \\mathbf{v}_1 + \\mathbf{v}_2$`, `是，$\\mathbf{b} = \\mathbf{v}_1 + \\mathbf{v}_2$`),
              yes(c2, c1),
            ];
        const third = c1 * v1[2]! + c2 * v2[2]!;
        const solution = walked(
          [
            [
              ["Use the first two entries", "用前两个分量"],
              t(
                `The first entries give $${formatLinearExpr([[a, "c_1"]])} = ${target[0]}$, so $c_1 = ${c1}$. The second give $${formatLinearExpr(
                  [
                    [b, "c_1"],
                    [d, "c_2"],
                  ],
                )} = ${target[1]}$, so $c_2 = ${c2}$.`,
                `由第一个分量 $${formatLinearExpr([[a, "c_1"]])} = ${target[0]}$ 得 $c_1 = ${c1}$。由第二个分量 $${formatLinearExpr([
                  [b, "c_1"],
                  [d, "c_2"],
                ])} = ${target[1]}$ 得 $c_2 = ${c2}$。`,
              ),
            ],
            [
              ["Test the third entry", "检验第三个分量"],
              isComb
                ? t(
                    `These weights give third entry $${third}$, which matches $\\mathbf{b}$:`,
                    `这组权重给出第三个分量 $${third}$，与 $\\mathbf{b}$ 相符：`,
                  )
                : t(
                    `These weights give third entry $${third}$, but $\\mathbf{b}$ has $${target[2]}$, so the system is inconsistent:`,
                    `这组权重给出第三个分量 $${third}$，而 $\\mathbf{b}$ 的是 $${target[2]}$，方程组不相容：`,
                  ),
              [`${c1} \\cdot ${paren(v1[2]!)} + ${paren(c2)} \\cdot ${paren(v2[2]!)} = ${third}`],
            ],
          ],
          t(
            `Every combination of $\\mathbf{v}_1$ and $\\mathbf{v}_2$ has third entry equal to the sum of the first two, and for $\\mathbf{b}$ that sum is $${target[0]} + ${paren(target[1]!)} = ${target[0]! + target[1]!}$ against $${target[2]}$.`,
            `$\\mathbf{v}_1$ 与 $\\mathbf{v}_2$ 的每个组合，第三个分量都等于前两个之和；对 $\\mathbf{b}$ 这个和为 $${target[0]} + ${paren(target[1]!)} = ${target[0]! + target[1]!}$，而第三个分量为 $${target[2]}$。`,
          ),
        );
        const off = (p: number, q: number) => [0, 1, 2].map((i) => p * v1[i]! + q * v2[i]!);
        const notAny: [string, string] = [
          `No combination works: each one has third entry equal to the sum of the first two, but $\\mathbf{b}$ has $${target[2]}$ instead of $${target[0]! + target[1]!}$.`,
          `任何组合都不行：每个组合的第三个分量都等于前两个之和，而 $\\mathbf{b}$ 的是 $${target[2]}$，不是 $${target[0]! + target[1]!}$。`,
        ];
        const reasons: [string, string, string][] = isComb
          ? [
              [
                no.en,
                `The weights $c_1 = ${c1}$, $c_2 = ${c2}$ fit all three entries, so the system has a solution.`,
                `权重 $c_1 = ${c1}$，$c_2 = ${c2}$ 符合全部三个分量，所以方程组有解。`,
              ],
              [
                yes(c1 + 1, c2).en,
                `That combination is $${colVecLatex(off(c1 + 1, c2))}$, not $\\mathbf{b}$: its first entry is wrong.`,
                `该组合为 $${colVecLatex(off(c1 + 1, c2))}$，不是 $\\mathbf{b}$：第一个分量不对。`,
              ],
              [
                yes(c1, c2 - 1).en,
                `That combination is $${colVecLatex(off(c1, c2 - 1))}$, not $\\mathbf{b}$: its second entry is wrong.`,
                `该组合为 $${colVecLatex(off(c1, c2 - 1))}$，不是 $\\mathbf{b}$：第二个分量不对。`,
              ],
            ]
          : [
              [
                yes(c1, c2).en,
                `That combination matches the first two entries but gives third entry $${third}$, not $${target[2]}$.`,
                `该组合符合前两个分量，但第三个分量为 $${third}$，不是 $${target[2]}$。`,
              ],
              [`Yes, $\\mathbf{b} = \\mathbf{v}_1 + \\mathbf{v}_2$`, ...notAny],
              [yes(c2, c1).en, ...notAny],
            ];
        return reasoned(oneOf(rng, prompt, right, wrong, solution), reasons);
      },
    },
  ],
};

/** linearSpanOfVectorsInNDimensionalEuclideanSpace covers span definition, span membership, and spanning ℝⁿ. */
export const linearSpanOfVectorsInNDimensionalEuclideanSpace: TopicDef = {
  id: "linear-span-of-vectors-in-n-dimensional-euclidean-space",
  title: t("Linear Span of Vectors in N-Dimensional Euclidean Space", "向量组的线性张成空间 (Span)"),
  summary: t(
    "Define the span of a set of vectors as the collection of all linear combinations, test for membership in a span, and determine whether a set spans $\\mathbb{R}^n$.",
    "掌握向量组的张成空间定义（所有线性组合的集合），判断向量是否属于张成空间，并判定是否张成 $\\mathbb{R}^n$。",
  ),
  intro: t(
    "Is $\\mathbf{w} = (2, 7, 3)^T$ in $\\operatorname{Span}\\{(1, 2, 0)^T, (0, 1, 1)^T\\}$? In $c_1(1, 2, 0)^T + c_2(0, 1, 1)^T$ the first entry is $c_1$ and the third is $c_2$, so $c_1 = 2$ and $c_2 = 3$. The middle entry is then $2 \\cdot 2 + 3 \\cdot 1 = 7$, as needed, so $\\mathbf{w}$ is in the span.\n\nCheck: $2(1, 2, 0)^T + 3(0, 1, 1)^T = (2, 4 + 3, 3)^T = (2, 7, 3)^T$.\n\nIn this lesson we test whether a vector lies in a span and whether a set of vectors spans all of $\\mathbb{R}^n$.",
    "$\\mathbf{w} = (2, 7, 3)^T$ 是否属于 $\\operatorname{Span}\\{(1, 2, 0)^T, (0, 1, 1)^T\\}$？在 $c_1(1, 2, 0)^T + c_2(0, 1, 1)^T$ 中，第一个分量是 $c_1$，第三个分量是 $c_2$，所以 $c_1 = 2$，$c_2 = 3$。此时中间分量为 $2 \\cdot 2 + 3 \\cdot 1 = 7$，正符合，所以 $\\mathbf{w}$ 属于该张成空间。\n\n检验：$2(1, 2, 0)^T + 3(0, 1, 1)^T = (2, 4 + 3, 3)^T = (2, 7, 3)^T$。\n\n本课我们判断一个向量是否属于张成空间，以及一组向量是否张成整个 $\\mathbb{R}^n$。",
  ),
  prerequisites: ["linear-combinations-of-vectors-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "membership-in-span",
      title: t("Membership in $\\operatorname{Span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$", "判定向量是否属于张成空间"),
      explanation: t(
        "A vector $\\mathbf{w}$ belongs to $\\operatorname{Span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ if and only if $\\mathbf{w}$ can be expressed as a linear combination of $\\mathbf{v}_1, \\dots, \\mathbf{v}_k$. To decide, set up the vector equation with unknown weights, row reduce its augmented matrix, and check whether the system is consistent. For example, $(3, 1, 0)^T$ is in $\\operatorname{Span}\\{(1, 0, 0)^T, (0, 1, 0)^T\\}$, but $(3, 1, 2)^T$ is not, since every combination has third entry $0$.\n\n> **Watch out.** The span of two vectors contains all their combinations, not just the multiples of one of them, and the weights must fit every entry at once.",
        "向量 $\\mathbf{w}$ 属于 $\\operatorname{Span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$，当且仅当 $\\mathbf{w}$ 可以表示为该向量组的一个线性组合。判定时，写出含未知权重的向量方程，对其增广矩阵作行化简，检查方程组是否相容。例如 $(3, 1, 0)^T$ 属于 $\\operatorname{Span}\\{(1, 0, 0)^T, (0, 1, 0)^T\\}$，而 $(3, 1, 2)^T$ 不属于，因为每个组合的第三个分量都是 $0$。\n\n> **注意。** 两个向量的张成空间包含它们的所有组合，而不只是其中一个的倍数；权重必须同时符合每个分量。",
      ),
      generate(rng) {
        const u1 = rng.int(-3, 3);
        const u2 = rng.nonZero(-3, 3);
        const v1 = [1, u1, 0];
        const v2 = [0, u2, 1];
        const c1 = rng.nonZero(-3, 3);
        const c2 = rng.nonZero(-3, 3);
        const inSpan = rng.bool();
        const delta = inSpan ? 0 : rng.pick([-4, -2, 2, 4]);
        const middle = c1 * u1 + c2 * u2;
        const w = [c1, middle + delta, c2];
        const combStr = formatVectorComb([
          [c1, "\\mathbf{v}_1"],
          [c2, "\\mathbf{v}_2"],
        ]);
        const prompt = t(
          `Let $\\mathbf{v}_1 = ${colVecLatex(v1)}$ and $\\mathbf{v}_2 = ${colVecLatex(v2)}$. Does $\\mathbf{w} = ${colVecLatex(w)}$ belong to $\\text{Span}\\{\\mathbf{v}_1, \\mathbf{v}_2\\}$?`,
          `设 $\\mathbf{v}_1 = ${colVecLatex(v1)}$，$\\mathbf{v}_2 = ${colVecLatex(v2)}$。向量 $\\mathbf{w} = ${colVecLatex(w)}$ 是否属于 $\\text{Span}\\{\\mathbf{v}_1, \\mathbf{v}_2\\}$？`,
        );
        const yesComb = t(`Yes, because $\\mathbf{w} = ${combStr}$`, `是，因为 $\\mathbf{w} = ${combStr}$`);
        const right = inSpan
          ? yesComb
          : t(
              `No, because the required second component would be $${middle}$, but here it is $${w[1]}$`,
              `否，因为第二分量需为 $${middle}$，但此处为 $${w[1]}$`,
            );
        const notMultiple = t(
          `No, because $\\mathbf{w}$ is not a scalar multiple of $\\mathbf{v}_1$`,
          `否，因为 $\\mathbf{w}$ 不是 $\\mathbf{v}_1$ 的数乘倍数`,
        );
        const noSolution = t(`No, the system has no solution`, `否，方程组无解`);
        const onlyZero = t(`Yes, but only if $\\mathbf{w} = \\mathbf{0}$`, `是，但仅当 $\\mathbf{w} = \\mathbf{0}$ 时`);
        const anyVector = t(
          `Yes, because any vector in $\\mathbb{R}^3$ is in the span of two vectors`,
          `是，因为任意 $\\mathbb{R}^3$ 向量都在两个向量的张成空间中`,
        );
        const swapped = t(`Yes, with weights $c_1 = ${c2}, c_2 = ${c1}$`, `是，权重为 $c_1 = ${c2}, c_2 = ${c1}$`);
        const wrong = inSpan ? [notMultiple, noSolution, onlyZero] : [yesComb, anyVector, swapped];
        const solution = walked(
          [
            [
              ["Read the weights", "读出权重"],
              t(
                `In $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2$ the first entry is $c_1$ and the third is $c_2$, so $c_1 = ${c1}$ and $c_2 = ${c2}$.`,
                `在 $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2$ 中，第一个分量是 $c_1$，第三个分量是 $c_2$，所以 $c_1 = ${c1}$，$c_2 = ${c2}$。`,
              ),
            ],
            [
              ["Test the middle entry", "检验中间分量"],
              inSpan
                ? t(
                    `The middle entry must then be the one of $\\mathbf{w}$, and it is:`,
                    `这时中间分量必须等于 $\\mathbf{w}$ 的中间分量，确实如此：`,
                  )
                : t(
                    `The middle entry must then be $${middle}$, but $\\mathbf{w}$ has $${w[1]}$:`,
                    `这时中间分量必须是 $${middle}$，但 $\\mathbf{w}$ 的是 $${w[1]}$：`,
                  ),
              [`${c1} \\cdot ${paren(u1)} + ${paren(c2)} \\cdot ${paren(u2)} = ${middle}`],
            ],
          ],
          t(
            `The only candidate is $${combStr} = ${colVecLatex([c1, middle, c2])}$, which ${inSpan ? "equals" : "differs from"} $\\mathbf{w} = ${colVecLatex(w)}$.`,
            `唯一的候选是 $${combStr} = ${colVecLatex([c1, middle, c2])}$，它${inSpan ? "等于" : "不等于"} $\\mathbf{w} = ${colVecLatex(w)}$。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            notMultiple.en,
            `The span holds every combination of both vectors, and $\\mathbf{w} = ${combStr}$ is one.`,
            `张成空间包含两个向量的所有组合，而 $\\mathbf{w} = ${combStr}$ 正是其中之一。`,
          ],
          [
            noSolution.en,
            `The system has the solution $c_1 = ${c1}$, $c_2 = ${c2}$, which fits all three entries.`,
            `方程组有解 $c_1 = ${c1}$，$c_2 = ${c2}$，符合全部三个分量。`,
          ],
          [
            onlyZero.en,
            `The zero vector is in every span, but so is $\\mathbf{w} = ${combStr}$.`,
            `零向量属于任何张成空间，但 $\\mathbf{w} = ${combStr}$ 也属于。`,
          ],
          [yesComb.en, `That combination has middle entry $${middle}$, not $${w[1]}$.`, `该组合的中间分量是 $${middle}$，不是 $${w[1]}$。`],
          [
            anyVector.en,
            "Two vectors span at most a plane through the origin, not all of $\\mathbb{R}^3$.",
            "两个向量至多张成一个过原点的平面，而不是整个 $\\mathbb{R}^3$。",
          ],
          [
            swapped.en,
            `The first and third entries force $c_1 = ${c1}$ and $c_2 = ${c2}$, and even those weights miss the middle entry.`,
            `第一、第三个分量迫使 $c_1 = ${c1}$，$c_2 = ${c2}$，而即使这组权重也不符合中间分量。`,
          ],
        ]);
      },
    },
    {
      id: "spanning-entire-space",
      title: t("Spanning all of $\\mathbb{R}^n$", "判定向量组是否张成整个空间 $\\mathbb{R}^n$"),
      explanation: t(
        "A set of $k$ vectors in $\\mathbb{R}^n$ spans $\\mathbb{R}^n$ if and only if the matrix with these vectors as columns has a pivot position in every row (which requires $k \\ge n$). For example, $(1, 0)^T$ and $(1, 1)^T$ span $\\mathbb{R}^2$, since $\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ has a pivot in both rows.\n\n> **Watch out.** Having $n$ vectors is not enough: if one is a combination of the others, some row has no pivot and the set spans less.",
        "$\\mathbb{R}^n$ 中的 $k$ 个向量张成 $\\mathbb{R}^n$，当且仅当以这组向量为列的矩阵每一行都有主元（这要求 $k \\ge n$）。例如 $(1, 0)^T$ 与 $(1, 1)^T$ 张成 $\\mathbb{R}^2$，因为 $\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ 两行都有主元。\n\n> **注意。** 有 $n$ 个向量还不够：若其中一个是其余向量的组合，就会有某行没有主元，张成的空间更小。",
      ),
      generate(rng) {
        const type = rng.pick(["less-vectors", "dependent-three", "spans-three"]);
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        if (type === "less-vectors") {
          const v1 = [a, 0, 1];
          const v2 = [0, b, -1];
          const prompt = t(
            `Does the set $\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)} \\right\\}$ span $\\mathbb{R}^3$?`,
            `向量组 $\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)} \\right\\}$ 能否张成 $\\mathbb{R}^3$？`,
          );
          const right = t(
            `No, because at least 3 vectors are needed to span $\\mathbb{R}^3$`,
            `否，因为张成 $\\mathbb{R}^3$ 至少需要 3 个向量`,
          );
          const wrong = [
            t(`Yes, because the two vectors are linearly independent`, `是，因为这两个向量线性无关`),
            t(`Yes, because their span is 3-dimensional`, `是，因为它们的张成空间是 3 维的`),
            t(`No, only because one vector contains a zero entry`, `否，仅因为某个向量含有零分量`),
          ];
          const solution = walked(
            [
              [
                ["Count the possible pivots", "数可能的主元"],
                t(
                  "The matrix with these columns is $3 \\times 2$, so it has at most $2$ pivots, one per column.",
                  "以它们为列的矩阵是 $3 \\times 2$ 的，至多有 $2$ 个主元，每列一个。",
                ),
              ],
              [
                ["Compare with the rows", "与行数比较"],
                t(
                  "Spanning $\\mathbb{R}^3$ needs a pivot in each of the $3$ rows, so these two vectors cannot span it.",
                  "张成 $\\mathbb{R}^3$ 需要 $3$ 行每行都有主元，所以这两个向量不能张成它。",
                ),
              ],
            ],
            t(
              `For example, $${colVecLatex([a, b, 1])}$ is missed: its first two entries force $c_1 = 1$ and $c_2 = 1$, and then the third entry is $1 - 1 = 0$, not $1$.`,
              `例如 $${colVecLatex([a, b, 1])}$ 就得不到：前两个分量迫使 $c_1 = 1$，$c_2 = 1$，而此时第三个分量为 $1 - 1 = 0$，不是 $1$。`,
            ),
          );
          return reasoned(oneOf(rng, prompt, right, wrong, solution), [
            [
              wrong[0]!.en,
              "They are independent, but two independent vectors span only a plane in $\\mathbb{R}^3$.",
              "它们确实线性无关，但两个无关向量在 $\\mathbb{R}^3$ 中只张成一个平面。",
            ],
            [wrong[1]!.en, "The span of two vectors has dimension at most $2$.", "两个向量的张成空间维数至多为 $2$。"],
            [wrong[2]!.en, "Zero entries are not the reason; the number of vectors is.", "原因不是零分量，而是向量的个数。"],
          ]);
        }
        if (type === "dependent-three") {
          const v1 = [1, 0, 0];
          const v2 = [0, 1, 0];
          const v3 = [a, b, 0];
          const prompt = t(
            `Does the set $\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)}, ${colVecLatex(v3)} \\right\\}$ span $\\mathbb{R}^3$?`,
            `向量组 $\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)}, ${colVecLatex(v3)} \\right\\}$ 能否张成 $\\mathbb{R}^3$？`,
          );
          const right = t(
            `No, because the third component of all three vectors is 0, so they only span the $xy$-plane`,
            `否，因为三个向量的第三分量全为 0，只能张成 $xy$ 平面`,
          );
          const wrong = [
            t(`Yes, because there are 3 vectors in $\\mathbb{R}^3$`, `是，因为在 $\\mathbb{R}^3$ 中有 3 个向量`),
            t(`Yes, because the first two vectors are linearly independent`, `是，因为前两个向量线性无关`),
            t(`No, because no vector space can be spanned by vectors with integer entries`, `否，因为整数向量不能张成向量空间`),
          ];
          const third = formatVectorComb([
            [a, "\\mathbf{v}_1"],
            [b, "\\mathbf{v}_2"],
          ]);
          const solution = walked(
            [
              [
                ["Look at the third entries", "看第三个分量"],
                t(
                  "Every vector here has third entry $0$, so every combination has third entry $0 \\cdot c_1 + 0 \\cdot c_2 + 0 \\cdot c_3 = 0$.",
                  "这里每个向量的第三个分量都是 $0$，所以每个组合的第三个分量都是 $0 \\cdot c_1 + 0 \\cdot c_2 + 0 \\cdot c_3 = 0$。",
                ),
              ],
              [
                ["Find a vector that is missed", "找出得不到的向量"],
                t(
                  "So $(0, 0, 1)^T$ is not a combination, and the set does not span $\\mathbb{R}^3$; it spans the $xy$-plane.",
                  "所以 $(0, 0, 1)^T$ 不是组合，该向量组不能张成 $\\mathbb{R}^3$；它张成的是 $xy$ 平面。",
                ),
              ],
            ],
            t(
              `The matrix with these columns has a zero third row, so it has at most $2$ pivots; indeed $\\mathbf{v}_3 = ${third}$.`,
              `以它们为列的矩阵第三行全为零，至多有 $2$ 个主元；事实上 $\\mathbf{v}_3 = ${third}$。`,
            ),
          );
          return reasoned(oneOf(rng, prompt, right, wrong, solution), [
            [
              wrong[0]!.en,
              `Three vectors are not enough when one depends on the others: $\\mathbf{v}_3 = ${third}$.`,
              `当其中一个依赖于其余向量时，三个向量也不够：$\\mathbf{v}_3 = ${third}$。`,
            ],
            [
              wrong[1]!.en,
              "The first two span only the $xy$-plane, and the third adds nothing outside it.",
              "前两个只张成 $xy$ 平面，第三个也没有带来平面外的方向。",
            ],
            [
              wrong[2]!.en,
              "Integer entries are no obstacle: $(1, 0, 0)^T$, $(0, 1, 0)^T$, $(0, 0, 1)^T$ span $\\mathbb{R}^3$.",
              "整数分量不是障碍：$(1, 0, 0)^T$、$(0, 1, 0)^T$、$(0, 0, 1)^T$ 张成 $\\mathbb{R}^3$。",
            ],
          ]);
        }
        const v1 = [1, 0, 0];
        const v2 = [a, 1, 0];
        const v3 = [b, c, 1];
        const prompt = t(
          `Does the set $\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)}, ${colVecLatex(v3)} \\right\\}$ span $\\mathbb{R}^3$?`,
          `向量组 $\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)}, ${colVecLatex(v3)} \\right\\}$ 能否张成 $\\mathbb{R}^3$？`,
        );
        const right = t(
          `Yes, because the matrix has 3 pivot positions (a pivot in every row)`,
          `是，因为矩阵具有 3 个主元位置（每一行都有主元）`,
        );
        const wrong = [
          t(`No, because the vectors are not orthogonal`, `否，因为向量不正交`),
          t(`No, because triangular matrices never span $\\mathbb{R}^3$`, `否，因为三角矩阵对应的向量无法张成 $\\mathbb{R}^3$`),
          t(`Yes, but only because all entries are positive`, `是，但仅仅是因为所有分量为正`),
        ];
        const M = [
          [1, a, b],
          [0, 1, c],
          [0, 0, 1],
        ];
        const solution = walked(
          [
            [
              ["Form the matrix", "写出矩阵"],
              t("Put the vectors in as columns:", "把这些向量作为列："),
              [`[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\; \\mathbf{v}_3] = ${matLatex(M)}`],
            ],
            [
              ["Count the pivots", "数主元"],
              t(
                "It is already in echelon form with the diagonal entries $1, 1, 1$ as pivots, so there is a pivot in every row and the columns span $\\mathbb{R}^3$.",
                "它已是阶梯形，对角元素 $1, 1, 1$ 都是主元，每行都有主元，所以各列张成 $\\mathbb{R}^3$。",
              ),
            ],
          ],
          t(
            "The determinant of a triangular matrix is the product of its diagonal, $1 \\cdot 1 \\cdot 1 = 1 \\neq 0$, which agrees.",
            "三角矩阵的行列式是对角元素之积 $1 \\cdot 1 \\cdot 1 = 1 \\neq 0$，结论一致。",
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `Spanning needs pivots, not right angles: here $\\mathbf{v}_1 \\cdot \\mathbf{v}_2 = ${a} \\neq 0$, and the set still spans.`,
            `张成需要的是主元而不是直角：这里 $\\mathbf{v}_1 \\cdot \\mathbf{v}_2 = ${a} \\neq 0$，向量组仍然张成。`,
          ],
          [
            wrong[1]!.en,
            "A triangular matrix with nonzero diagonal entries has a pivot in every row.",
            "对角元素都不为零的三角矩阵每行都有主元。",
          ],
          [wrong[2]!.en, "The signs of the entries play no part; the pivots decide.", "分量的符号不起作用；起决定作用的是主元。"],
        ]);
      },
    },
  ],
};

/** linearDependenceAndIndependence covers definition, testing independence via homogeneous system, and finding dependence relations. */
export const linearDependenceAndIndependence: TopicDef = {
  id: "linear-dependence-and-independence",
  title: t("Linear Dependence and Independence", "向量组的线性相关与线性无关"),
  summary: t(
    "Define linear independence via $c_1\\mathbf{v}_1 + \\dots + c_k\\mathbf{v}_k = \\mathbf{0}$ having only the trivial solution, and detect linear dependence through pivot columns or non-trivial relations.",
    "通过齐次方程 $c_1\\mathbf{v}_1 + \\dots + c_k\\mathbf{v}_k = \\mathbf{0}$ 仅有零解定义线性无关，并通过主元列或非平凡线性关系判定线性相关性。",
  ),
  intro: t(
    "Take $\\mathbf{v}_1 = (1, 0, 2)^T$, $\\mathbf{v}_2 = (0, 1, 1)^T$ and $\\mathbf{v}_3 = (2, 3, 7)^T$. The first two entries of $\\mathbf{v}_3$ suggest $\\mathbf{v}_3 = 2\\mathbf{v}_1 + 3\\mathbf{v}_2$, and the third entry agrees: $2 \\cdot 2 + 3 \\cdot 1 = 7$. So $2\\mathbf{v}_1 + 3\\mathbf{v}_2 - \\mathbf{v}_3 = \\mathbf{0}$ with weights not all zero, and the set is linearly dependent.\n\nCheck: entry by entry, $2 - 2 = 0$, $3 - 3 = 0$ and $4 + 3 - 7 = 0$.\n\nIn this lesson we decide whether a set of vectors is linearly independent and write down a dependence relation when it is not.",
    "取 $\\mathbf{v}_1 = (1, 0, 2)^T$，$\\mathbf{v}_2 = (0, 1, 1)^T$，$\\mathbf{v}_3 = (2, 3, 7)^T$。$\\mathbf{v}_3$ 的前两个分量提示 $\\mathbf{v}_3 = 2\\mathbf{v}_1 + 3\\mathbf{v}_2$，第三个分量也相符：$2 \\cdot 2 + 3 \\cdot 1 = 7$。所以 $2\\mathbf{v}_1 + 3\\mathbf{v}_2 - \\mathbf{v}_3 = \\mathbf{0}$，权重不全为零，该向量组线性相关。\n\n检验：逐个分量，$2 - 2 = 0$，$3 - 3 = 0$，$4 + 3 - 7 = 0$。\n\n本课我们判断一组向量是否线性无关，并在线性相关时写出相关关系。",
  ),
  prerequisites: ["linear-span-of-vectors-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "test-linear-independence",
      title: t("Testing linear independence of a vector set", "检验向量组的线性相关性"),
      explanation: t(
        "A set of vectors $\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ is linearly independent if $c_1\\mathbf{v}_1 + \\dots + c_k\\mathbf{v}_k = \\mathbf{0}$ has only the trivial solution $c_1 = \\dots = c_k = 0$. If a non-trivial solution exists, the set is linearly dependent. For example, $(1, 2)^T$ and $(2, 4)^T$ are dependent, since $2(1, 2)^T - (2, 4)^T = \\mathbf{0}$.\n\n> **Watch out.** Having no zero vector, or having exactly $n$ vectors in $\\mathbb{R}^n$, proves nothing; look for a nontrivial relation or count the pivots.",
        "若 $c_1\\mathbf{v}_1 + \\dots + c_k\\mathbf{v}_k = \\mathbf{0}$ 仅有零解 $c_1 = \\dots = c_k = 0$，则向量组 $\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ 线性无关；若存在非全零解，则线性相关。例如 $(1, 2)^T$ 与 $(2, 4)^T$ 线性相关，因为 $2(1, 2)^T - (2, 4)^T = \\mathbf{0}$。\n\n> **注意。** 不含零向量，或在 $\\mathbb{R}^n$ 中恰有 $n$ 个向量，都说明不了什么；要找非平凡关系或数主元。",
      ),
      generate(rng) {
        const isDep = rng.bool();
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-2, 2);
        let v1: number[];
        let v2: number[];
        let v3: number[];
        if (isDep) {
          v1 = [1, a, 0];
          v2 = [0, 1, b];
          v3 = [c, c * a + 2, 2 * b]; // v3 = c*v1 + 2*v2
        } else {
          v1 = [1, 0, 0];
          v2 = [a, 1, 0];
          v3 = [b, c, 1];
        }
        const prompt = t(
          `Let $\\mathbf{v}_1 = ${colVecLatex(v1)}$, $\\mathbf{v}_2 = ${colVecLatex(v2)}$ and $\\mathbf{v}_3 = ${colVecLatex(v3)}$. Determine whether the set $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}$ in $\\mathbb{R}^3$ is linearly independent or linearly dependent.`,
          `设 $\\mathbf{v}_1 = ${colVecLatex(v1)}$，$\\mathbf{v}_2 = ${colVecLatex(v2)}$，$\\mathbf{v}_3 = ${colVecLatex(v3)}$。判断 $\\mathbb{R}^3$ 中的向量组 $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}$ 是线性无关还是线性相关。`,
        );
        const right = isDep
          ? t(
              `Linearly dependent, because there exists a non-trivial linear combination equaling $\\mathbf{0}$`,
              `线性相关，因为存在不全为零的数使得线性组合为 $\\mathbf{0}$`,
            )
          : t(
              `Linearly independent, because $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2 + c_3\\mathbf{v}_3 = \\mathbf{0}$ has only the trivial solution`,
              `线性无关，因为 $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2 + c_3\\mathbf{v}_3 = \\mathbf{0}$ 只有平凡解（零解）`,
            );
        const wrong = isDep
          ? [
              t(`Linearly independent, because none of the vectors is the zero vector`, `线性无关，因为其中没有零向量`),
              t(`Linearly independent, because there are 3 vectors in $\\mathbb{R}^3$`, `线性无关，因为是 $\\mathbb{R}^3$ 中的 3 个向量`),
              t(`Linearly dependent, but only if all components are non-negative`, `线性相关，但仅在所有分量非负时成立`),
            ]
          : [
              t(
                `Linearly dependent, because 3 vectors always form a dependent set in $\\mathbb{R}^3$`,
                `线性相关，因为 $\\mathbb{R}^3$ 中的 3 个向量必定线性相关`,
              ),
              t(
                `Linearly dependent, because $\\mathbf{v}_1 + \\mathbf{v}_2 = \\mathbf{v}_3$`,
                `线性相关，因为 $\\mathbf{v}_1 + \\mathbf{v}_2 = \\mathbf{v}_3$`,
              ),
              t(`Linearly dependent, because the matrix has determinant 0`, `线性相关，因为矩阵的行列式为 0`),
            ];
        const rel = formatVectorComb([
          [c, "\\mathbf{v}_1"],
          [2, "\\mathbf{v}_2"],
        ]);
        const relZero = `${formatVectorComb([
          [c, "\\mathbf{v}_1"],
          [2, "\\mathbf{v}_2"],
          [-1, "\\mathbf{v}_3"],
        ])} = \\mathbf{0}`;
        const solution = isDep
          ? walked(
              [
                [
                  ["Write $\\mathbf{v}_3$ from the others", "用其余向量表示 $\\mathbf{v}_3$"],
                  t(
                    `$\\mathbf{v}_1$ is the only vector with a first entry, so the weight on it is $${c}$. The second entries then need $${c} \\cdot ${paren(a)} + k = ${c * a + 2}$, so $k = 2$:`,
                    `只有 $\\mathbf{v}_1$ 有第一个分量，所以它的权重为 $${c}$。第二个分量要求 $${c} \\cdot ${paren(a)} + k = ${c * a + 2}$，所以 $k = 2$：`,
                  ),
                  [`\\mathbf{v}_3 = ${rel}`],
                ],
                [["Move it across", "移项"], t("This is a relation with weights not all zero:", "这是一个权重不全为零的关系："), [relZero]],
              ],
              t(
                `The third entries agree too: $${c} \\cdot 0 + 2 \\cdot ${paren(b)} - ${paren(2 * b)} = 0$.`,
                `第三个分量也相符：$${c} \\cdot 0 + 2 \\cdot ${paren(b)} - ${paren(2 * b)} = 0$。`,
              ),
            )
          : walked(
              [
                [
                  ["Form the matrix", "写出矩阵"],
                  t("With the vectors as columns the matrix is upper triangular:", "以这些向量为列，矩阵是上三角矩阵："),
                  [
                    matLatex([
                      [1, a, b],
                      [0, 1, c],
                      [0, 0, 1],
                    ]),
                  ],
                ],
                [
                  ["Solve the homogeneous system", "解齐次方程组"],
                  t(
                    "Row 3 gives $c_3 = 0$, then row 2 gives $c_2 = 0$, then row 1 gives $c_1 = 0$: only the trivial solution.",
                    "第 3 行给出 $c_3 = 0$，再由第 2 行得 $c_2 = 0$，再由第 1 行得 $c_1 = 0$：只有零解。",
                  ),
                ],
              ],
              t(
                "The determinant is the product of the diagonal, $1 \\cdot 1 \\cdot 1 = 1 \\neq 0$, so all three columns are pivot columns.",
                "行列式是对角元素之积 $1 \\cdot 1 \\cdot 1 = 1 \\neq 0$，所以三列都是主元列。",
              ),
            );
        const sum12 = [1 + a, 1, 0];
        const reasons: [string, string, string][] = isDep
          ? [
              [wrong[0]!.en, `No vector is zero, yet $${relZero}$ is a nontrivial relation.`, `没有零向量，但 $${relZero}$ 是非平凡关系。`],
              [
                wrong[1]!.en,
                `Three vectors in $\\mathbb{R}^3$ can still be dependent: here $\\mathbf{v}_3 = ${rel}$.`,
                `$\\mathbb{R}^3$ 中的三个向量仍可能相关：这里 $\\mathbf{v}_3 = ${rel}$。`,
              ],
              [
                wrong[2]!.en,
                "The signs of the entries do not matter; the relation holds as it is.",
                "分量的符号无关紧要；这个关系本身就成立。",
              ],
            ]
          : [
              [
                wrong[0]!.en,
                "Only more than $3$ vectors in $\\mathbb{R}^3$ must be dependent; three can be independent.",
                "只有多于 $3$ 个的 $\\mathbb{R}^3$ 向量才必定相关；三个向量可以无关。",
              ],
              [
                wrong[1]!.en,
                `$\\mathbf{v}_1 + \\mathbf{v}_2 = ${colVecLatex(sum12)}$, whose third entry is $0$, while $\\mathbf{v}_3$ has $1$.`,
                `$\\mathbf{v}_1 + \\mathbf{v}_2 = ${colVecLatex(sum12)}$，第三个分量为 $0$，而 $\\mathbf{v}_3$ 的是 $1$。`,
              ],
              [
                wrong[2]!.en,
                "The matrix is triangular with diagonal $1, 1, 1$, so its determinant is $1$, not $0$.",
                "该矩阵是对角元素为 $1, 1, 1$ 的三角矩阵，行列式为 $1$，不是 $0$。",
              ],
            ];
        return reasoned(oneOf(rng, prompt, right, wrong, solution), reasons);
      },
    },
    {
      id: "linear-dependence-relation-finding",
      title: t("Finding a linear dependence relation", "寻找线性相关关系的非平凡权值"),
      explanation: t(
        "If a vector in a set is a linear combination of the others, rearranging yields a linear dependence relation $a_1\\mathbf{v}_1 + \\dots + a_k\\mathbf{v}_k = \\mathbf{0}$ with not all weights zero. For example, $\\mathbf{v}_3 = 2\\mathbf{v}_1 - \\mathbf{v}_2$ rearranges to $2\\mathbf{v}_1 - \\mathbf{v}_2 - \\mathbf{v}_3 = \\mathbf{0}$.\n\n> **Watch out.** Moving $\\mathbf{v}_3$ across changes only its own sign; the weights of the other vectors stay as they were.",
        "若向量组中某个向量是其余向量的线性组合，移项即可得到非平凡线性相关关系 $a_1\\mathbf{v}_1 + \\dots + a_k\\mathbf{v}_k = \\mathbf{0}$。例如 $\\mathbf{v}_3 = 2\\mathbf{v}_1 - \\mathbf{v}_2$ 移项得 $2\\mathbf{v}_1 - \\mathbf{v}_2 - \\mathbf{v}_3 = \\mathbf{0}$。\n\n> **注意。** 把 $\\mathbf{v}_3$ 移过去只改变它自己的符号；其他向量的权重保持不变。",
      ),
      generate(rng) {
        const c1 = rng.nonZero(-3, 3);
        const c2 = rng.nonZero(-3, 3);
        const v1 = [1, 0, rng.int(-2, 2)];
        const v2 = [0, 1, rng.int(-2, 2)];
        const v3 = [c1 * v1[0]! + c2 * v2[0]!, c1 * v1[1]! + c2 * v2[1]!, c1 * v1[2]! + c2 * v2[2]!];
        const prompt = t(
          `Given $\\mathbf{v}_1 = ${colVecLatex(v1)}$, $\\mathbf{v}_2 = ${colVecLatex(v2)}$, and $\\mathbf{v}_3 = ${colVecLatex(v3)}$, which relation shows that $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\mathbf{v}_3\\}$ is linearly dependent?`,
          `已知 $\\mathbf{v}_1 = ${colVecLatex(v1)}$，$\\mathbf{v}_2 = ${colVecLatex(v2)}$ 与 $\\mathbf{v}_3 = ${colVecLatex(v3)}$，下列哪个关系式证明了该向量组线性相关？`,
        );
        const relation = (p: number, q: number, r: number) =>
          `${formatVectorComb([
            [p, "\\mathbf{v}_1"],
            [q, "\\mathbf{v}_2"],
            [r, "\\mathbf{v}_3"],
          ])} = \\mathbf{0}`;
        const lhs = (p: number, q: number, r: number) => [0, 1, 2].map((i) => p * v1[i]! + q * v2[i]! + r * v3[i]!);
        const relStr = relation(c1, c2, -1);
        const right = t(`$${relStr}$`, `$${relStr}$`);
        const tries = [
          [c1, -c2, 1],
          [c2, c1, -1],
          // v1 + v2 + v3 = 0 holds when c1 = c2 = -1, so use another all-ones guess there.
          c1 === -1 && c2 === -1 ? [1, 1, -1] : [1, 1, 1],
        ] as const;
        const wrong = tries.map(([p, q, r]) => t(`$${relation(p, q, r)}$`, `$${relation(p, q, r)}$`));
        const comb3 = formatVectorComb([
          [c1, "\\mathbf{v}_1"],
          [c2, "\\mathbf{v}_2"],
        ]);
        const solution = walked(
          [
            [
              ["Express $\\mathbf{v}_3$", "表示 $\\mathbf{v}_3$"],
              t(
                `$\\mathbf{v}_1$ and $\\mathbf{v}_2$ start $(1, 0)$ and $(0, 1)$, so the first two entries of $\\mathbf{v}_3$ give the weights $${c1}$ and $${c2}$:`,
                `$\\mathbf{v}_1$、$\\mathbf{v}_2$ 的前两个分量是 $(1, 0)$ 与 $(0, 1)$，所以 $\\mathbf{v}_3$ 的前两个分量给出权重 $${c1}$ 与 $${c2}$：`,
              ),
              [`\\mathbf{v}_3 = ${comb3}`],
            ],
            [["Move $\\mathbf{v}_3$ across", "把 $\\mathbf{v}_3$ 移过去"], t("The weights are not all zero:", "权重不全为零："), [relStr]],
          ],
          t(
            `The third entries agree: $${c1} \\cdot ${paren(v1[2]!)} + ${paren(c2)} \\cdot ${paren(v2[2]!)} - ${paren(v3[2]!)} = 0$.`,
            `第三个分量也相符：$${c1} \\cdot ${paren(v1[2]!)} + ${paren(c2)} \\cdot ${paren(v2[2]!)} - ${paren(v3[2]!)} = 0$。`,
          ),
        );
        return reasoned(
          oneOf(rng, prompt, right, wrong, solution),
          tries.map(([p, q, r], k) => {
            const got = colVecLatex(lhs(p, q, r));
            return [
              wrong[k]!.en,
              `The left side works out to $${got}$, not $\\mathbf{0}$.`,
              `左边算出来是 $${got}$，不是 $\\mathbf{0}$。`,
            ] as [string, string, string];
          }),
        );
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 3.10: SUBSPACES OF N-DIMENSIONAL SPACE
// ════════════════════════════════════════════════════════════════════════════

/** subspacesOfNDimensionalSpace covers subspace definition, the three axioms, and checking subsets. */
export const subspacesOfNDimensionalSpace: TopicDef = {
  id: "subspaces-of-n-dimensional-space",
  title: t("Subspaces of N-Dimensional Space", "N 维空间子空间的定义与判定"),
  summary: t(
    "Verify whether a subset $H$ of $\\mathbb{R}^n$ is a subspace by checking the three axioms: containing the zero vector, closure under addition, and closure under scalar multiplication.",
    "通过验证包含零向量、加法封闭和标量乘法封闭这三个公理，判定 $\\mathbb{R}^n$ 的子集是否构成子空间。",
  ),
  intro: t(
    "Test $H = \\{(x, y, z) \\mid x - 2y + z = 0\\}$. The zero vector is in $H$, since $0 - 0 + 0 = 0$. The vectors $(1, 1, 1)$ and $(2, 1, 0)$ are in $H$, and so is their sum $(3, 2, 1)$: $3 - 4 + 1 = 0$. The multiple $-3(1, 1, 1) = (-3, -3, -3)$ is in $H$ too: $-3 + 6 - 3 = 0$.\n\nCheck: in general, if two vectors satisfy the equation, their sum gives $0 + 0 = 0$ and $c$ times one gives $c \\cdot 0 = 0$, so $H$ passes all three tests.\n\nIn this lesson we decide whether a subset of $\\mathbb{R}^n$ is a subspace by testing the zero vector, sums and scalar multiples.",
    "检验 $H = \\{(x, y, z) \\mid x - 2y + z = 0\\}$。零向量属于 $H$，因为 $0 - 0 + 0 = 0$。$(1, 1, 1)$ 与 $(2, 1, 0)$ 都属于 $H$，它们的和 $(3, 2, 1)$ 也属于：$3 - 4 + 1 = 0$。倍数 $-3(1, 1, 1) = (-3, -3, -3)$ 也属于 $H$：$-3 + 6 - 3 = 0$。\n\n检验：一般地，若两个向量满足方程，它们的和给出 $0 + 0 = 0$，其中一个的 $c$ 倍给出 $c \\cdot 0 = 0$，所以 $H$ 通过全部三项检验。\n\n本课我们通过检验零向量、加法与数乘，判断 $\\mathbb{R}^n$ 的子集是否为子空间。",
  ),
  prerequisites: ["linear-span-of-vectors-in-n-dimensional-euclidean-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "subspace-three-axioms-check",
      title: t("Checking the three subspace axioms", "子空间三公理的检验"),
      explanation: t(
        "A subset $H$ of $\\mathbb{R}^n$ is a subspace if and only if: 1. The zero vector $\\mathbf{0}$ is in $H$; 2. For all $\\mathbf{u}, \\mathbf{v}$ in $H$, $\\mathbf{u} + \\mathbf{v}$ is in $H$; 3. For all $\\mathbf{u}$ in $H$ and every scalar $c$, $c\\mathbf{u}$ is in $H$. For example, the line $y = 2x$ in $\\mathbb{R}^2$ is a subspace, but $y = 2x + 1$ is not, since it misses $(0, 0)$.\n\n> **Watch out.** Containing the zero vector is not enough: the half-space $x \\ge 0$ contains it, yet $-1 \\cdot (1, 0, 0)$ falls outside.",
        "$\\mathbb{R}^n$ 的非空子集 $H$ 构成子空间当且仅当满足：1. 零向量 $\\mathbf{0} \\in H$；2. 对任意 $\\mathbf{u}, \\mathbf{v} \\in H$，$\\mathbf{u} + \\mathbf{v} \\in H$（加法封闭）；3. 对任意 $\\mathbf{u} \\in H$ 及标量 $c$，$c\\mathbf{u} \\in H$（数乘封闭）。例如 $\\mathbb{R}^2$ 中的直线 $y = 2x$ 是子空间，而 $y = 2x + 1$ 不是，因为它不经过 $(0, 0)$。\n\n> **注意。** 含有零向量还不够：半空间 $x \\ge 0$ 含零向量，但 $-1 \\cdot (1, 0, 0)$ 不在其中。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const c = rng.nonZero(-5, 5);
        const d = rng.nonZero(1, 8);
        const eqLhs = formatLinearExpr([
          [a, "x"],
          [b, "y"],
          [c, "z"],
        ]);
        // sets lists the plane through the origin, the shifted plane and the half-space; order assigns them the names W₁, W₂, W₃.
        const sets = [`${eqLhs} = 0`, `${eqLhs} = ${d}`, "x \\ge 0"];
        const order = rng.shuffle([0, 1, 2]);
        const name = (kind: number) => `W_${order.indexOf(kind) + 1}`;
        const listed = order.map((kind, i) => `W_{${i + 1}} = \\{ (x, y, z) \\mid ${sets[kind]} \\}`);
        const answer = order.indexOf(0);
        const options = [
          t("Only $W_1$", "仅有 $W_1$"),
          t("Only $W_2$", "仅有 $W_2$"),
          t("Only $W_3$", "仅有 $W_3$"),
          t("All three are subspaces", "三个都是子空间"),
        ];
        const shifted: [string, string] = [
          `$${name(1)}$ does not contain $\\mathbf{0}$: at the origin the left side is $0$, not $${d}$.`,
          `$${name(1)}$ 不含 $\\mathbf{0}$：在原点处左边是 $0$，不是 $${d}$。`,
        ];
        const half: [string, string] = [
          `$${name(2)}$ contains $(1, 0, 0)$ but not $-1 \\cdot (1, 0, 0) = (-1, 0, 0)$, so it is not closed under scalar multiplication.`,
          `$${name(2)}$ 含 $(1, 0, 0)$，但不含 $-1 \\cdot (1, 0, 0) = (-1, 0, 0)$，对数乘不封闭。`,
        ];
        return reasoned(
          choiceProblem({
            prompt: t(
              `Consider the subsets of $\\mathbb{R}^3$: $${listed[0]}$, $${listed[1]}$, and $${listed[2]}$. Which of these is a subspace of $\\mathbb{R}^3$?`,
              `考虑 $\\mathbb{R}^3$ 的子集：$${listed[0]}$，$${listed[1]}$ 及 $${listed[2]}$。其中哪一个是 $\\mathbb{R}^3$ 的子空间？`,
            ),
            options,
            correct: answer,
            solution: walked(
              [
                [
                  ["Test the zero vector", "检验零向量"],
                  t(
                    `At $(0, 0, 0)$ the left side $${eqLhs}$ is $0$, so $${name(0)}$ contains $\\mathbf{0}$ but $${name(1)}$ does not ($0 \\neq ${d}$). $${name(2)}$ contains $\\mathbf{0}$, since $0 \\ge 0$.`,
                    `在 $(0, 0, 0)$ 处左边 $${eqLhs}$ 为 $0$，所以 $${name(0)}$ 含 $\\mathbf{0}$，而 $${name(1)}$ 不含（$0 \\neq ${d}$）。$${name(2)}$ 含 $\\mathbf{0}$，因为 $0 \\ge 0$。`,
                  ),
                ],
                [["Test scaling", "检验数乘"], t(...half)],
              ],
              t(
                `$${name(0)}$ passes all three tests: if two vectors give $${eqLhs} = 0$, their sum gives $0 + 0 = 0$ and $k$ times one gives $k \\cdot 0 = 0$. So only $${name(0)}$ is a subspace.`,
                `$${name(0)}$ 通过全部三项检验：若两个向量使 $${eqLhs} = 0$，它们的和给出 $0 + 0 = 0$，其中一个的 $k$ 倍给出 $k \\cdot 0 = 0$。所以只有 $${name(0)}$ 是子空间。`,
              ),
            ),
          }),
          [
            [options[order.indexOf(1)]!.en, ...shifted],
            [options[order.indexOf(2)]!.en, ...half],
            [options[3]!.en, `Only one of them passes all three tests. ${shifted[0]}`, `只有一个通过全部三项检验。${shifted[1]}`],
          ],
        );
      },
    },
    {
      id: "span-is-subspace-property",
      title: t("The span of vectors is always a subspace", "向量组的张成空间必为子空间"),
      explanation: t(
        "Adding two combinations of the vectors or scaling one gives another combination, and the zero vector is the combination with all weights zero. For any set of vectors $\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ in $\\mathbb{R}^n$, $\\operatorname{Span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ is always a subspace of $\\mathbb{R}^n$. For example, $(2\\mathbf{v}_1 + \\mathbf{v}_2) + (\\mathbf{v}_1 - 3\\mathbf{v}_2) = 3\\mathbf{v}_1 - 2\\mathbf{v}_2$ is again in the span.\n\n> **Watch out.** A span is a subspace even when the vectors are dependent or few; it just may be smaller than $\\mathbb{R}^n$.",
        "两个向量组合相加或一个组合数乘后仍是这些向量的组合，零向量就是所有权重都为零的组合。对 $\\mathbb{R}^n$ 中任意向量组 $\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$，其张成空间 $\\operatorname{Span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ 恒为 $\\mathbb{R}^n$ 的子空间。例如 $(2\\mathbf{v}_1 + \\mathbf{v}_2) + (\\mathbf{v}_1 - 3\\mathbf{v}_2) = 3\\mathbf{v}_1 - 2\\mathbf{v}_2$ 仍在张成空间中。\n\n> **注意。** 即使向量线性相关或个数很少，张成空间也是子空间；只是它可能比 $\\mathbb{R}^n$ 小。",
      ),
      generate(rng) {
        const k = rng.int(2, 12);
        const n = rng.int(3, 15);
        const prompt = t(
          `Let $S = \\{\\mathbf{v}_1, \\dots, \\mathbf{v}_{${k}}\\}$ be any collection of $${k}$ vectors in $\\mathbb{R}^{${n}}$. Which statement about $W = \\text{Span}(S)$ is always true?`,
          `设 $S = \\{\\mathbf{v}_1, \\dots, \\mathbf{v}_{${k}}\\}$ 为 $\\mathbb{R}^{${n}}$ 中的任意 $${k}$ 个向量构成的向量组。关于 $W = \\text{Span}(S)$，下列哪个说法恒成立？`,
        );
        const right = t(
          `$W$ is always a subspace of $\\mathbb{R}^{${n}}$, containing $\\mathbf{0}$ and closed under linear combinations`,
          `$W$ 恒为 $\\mathbb{R}^{${n}}$ 的子空间，包含零向量且对线性组合封闭`,
        );
        const wrong = [
          t(`$W$ is a subspace only if the vectors in $S$ are linearly independent`, `只有当 $S$ 中的向量线性无关时，$W$ 才是子空间`),
          t(`$W$ is a subspace only if $S$ has at least $${n}$ vectors`, `只有当 $S$ 至少含 $${n}$ 个向量时，$W$ 才是子空间`),
          t(`$W = \\mathbb{R}^{${n}}$ regardless of which vectors are in $S$`, `无论 $S$ 中是何向量，$W$ 恒等于 $\\mathbb{R}^{${n}}$`),
        ];
        const solution = walked(
          [
            [
              ["The zero vector", "零向量"],
              t(
                `Taking all $${k}$ weights equal to $0$ gives $0\\mathbf{v}_1 + \\dots + 0\\mathbf{v}_{${k}} = \\mathbf{0}$, so $\\mathbf{0} \\in W$.`,
                `取全部 $${k}$ 个权重为 $0$，得 $0\\mathbf{v}_1 + \\dots + 0\\mathbf{v}_{${k}} = \\mathbf{0}$，所以 $\\mathbf{0} \\in W$。`,
              ),
            ],
            [
              ["Sums and multiples", "加法与数乘"],
              t(
                "Combinations add and scale weight by weight, so the results are again combinations:",
                "组合按权重逐个相加、数乘，结果仍是组合：",
              ),
              [
                `\\sum a_i\\mathbf{v}_i + \\sum b_i\\mathbf{v}_i = \\sum (a_i + b_i)\\mathbf{v}_i, \\quad c\\sum a_i\\mathbf{v}_i = \\sum (ca_i)\\mathbf{v}_i`,
              ],
            ],
          ],
          t(
            `If all $${k}$ vectors equal one nonzero $\\mathbf{v}_1$, then $W$ is the line through the origin in the direction of $\\mathbf{v}_1$: a subspace, though not all of $\\mathbb{R}^{${n}}$.`,
            `若 $${k}$ 个向量都等于同一个非零向量 $\\mathbf{v}_1$，则 $W$ 是沿 $\\mathbf{v}_1$ 方向过原点的直线：它是子空间，但不是整个 $\\mathbb{R}^{${n}}$。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "Dependence only makes the span smaller; sums and multiples of combinations are still combinations.",
            "线性相关只会让张成空间变小；组合的和与倍数仍是组合。",
          ],
          [
            wrong[1]!.en,
            "Even one vector spans a line through the origin, which is a subspace.",
            "即使一个向量也张成一条过原点的直线，它是子空间。",
          ],
          [
            wrong[2]!.en,
            `The vectors may span less: if all $${k}$ of them are equal, the span is a line.`,
            `这些向量张成的空间可能更小：若 $${k}$ 个向量都相同，张成空间只是一条直线。`,
          ],
        ]);
      },
    },
  ],
};

/** subspacesOfNDimensionalSpaceGeometricInterpretation covers geometric interpretation of subspaces as lines/planes/hyperplanes through the origin. */
export const subspacesOfNDimensionalSpaceGeometricInterpretation: TopicDef = {
  id: "subspaces-of-n-dimensional-space-geometric-interpretation",
  title: t("Subspaces of N-Dimensional Space: Geometric Interpretation", "子空间的几何意义"),
  summary: t(
    "Interpret subspaces of $\\mathbb{R}^n$ geometrically as points, lines, planes, and hyperplanes passing through the origin.",
    "从几何角度理解 $\\mathbb{R}^n$ 的子空间：过原点的单点、直线、平面及超平面。",
  ),
  intro: t(
    "The plane $2x - y + 3z = 0$ passes through the origin, so it is a subspace of $\\mathbb{R}^3$ of dimension $2$. The parallel plane $2x - y + 3z = 6$ misses the origin, since $0 \\neq 6$, so it is not a subspace.\n\nCheck: $(1, 2, 0)$ lies on the first plane ($2 - 2 + 0 = 0$), and so does $5(1, 2, 0) = (5, 10, 0)$, since $10 - 10 + 0 = 0$.\n\nIn this lesson we recognize the subspaces of $\\mathbb{R}^n$ as the point, lines, planes and hyperplanes through the origin.",
    "平面 $2x - y + 3z = 0$ 经过原点，所以它是 $\\mathbb{R}^3$ 的 $2$ 维子空间。平行平面 $2x - y + 3z = 6$ 不经过原点，因为 $0 \\neq 6$，所以它不是子空间。\n\n检验：$(1, 2, 0)$ 在第一个平面上（$2 - 2 + 0 = 0$），$5(1, 2, 0) = (5, 10, 0)$ 也在，因为 $10 - 10 + 0 = 0$。\n\n本课我们把 $\\mathbb{R}^n$ 的子空间认作过原点的单点、直线、平面与超平面。",
  ),
  prerequisites: ["subspaces-of-n-dimensional-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "geometric-subspaces-in-r3",
      title: t("Geometric classification of subspaces in $\\mathbb{R}^3$", "$\\mathbb{R}^3$ 中子空间的几何分类"),
      explanation: t(
        "The only subspaces of $\\mathbb{R}^3$ are: the origin $\\{\\mathbf{0}\\}$ (dimension $0$), any line through the origin (dimension $1$), any plane through the origin (dimension $2$), and $\\mathbb{R}^3$ itself (dimension $3$). For example, the line $t(1, 2, 3)$ is a subspace, but the line $(1, 0, 0) + t(0, 1, 0)$ is not, since it never reaches the origin.\n\n> **Watch out.** A line or plane is a subspace exactly when it passes through the origin; its direction, slope or dimension does not matter.",
        "$\\mathbb{R}^3$ 的子空间仅有四类几何对象：零向量单点 $\\{\\mathbf{0}\\}$（$0$ 维）、过原点的任意直线（$1$ 维）、过原点的任意平面（$2$ 维）以及整个 $\\mathbb{R}^3$（$3$ 维）。例如直线 $t(1, 2, 3)$ 是子空间，而直线 $(1, 0, 0) + t(0, 1, 0)$ 不是，因为它永远到不了原点。\n\n> **注意。** 直线或平面是子空间，当且仅当它经过原点；方向、倾斜程度或维数都无关紧要。",
      ),
      generate(rng) {
        const dim = rng.pick([1, 2]);
        const passOrigin = rng.bool();
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const d = passOrigin ? 0 : rng.pick([-4, -2, 2, 4]);
        if (dim === 2) {
          const planeLhs = formatLinearExpr([
            [a, "x"],
            [b, "y"],
            [c, "z"],
          ]);
          const prompt = t(
            `Consider the geometric object in $\\mathbb{R}^3$ defined by $P: ${planeLhs} = ${d}$. Is $P$ a subspace of $\\mathbb{R}^3$?`,
            `考虑 $\\mathbb{R}^3$ 中由方程 $P: ${planeLhs} = ${d}$ 定义的几何对象。$P$ 是否是 $\\mathbb{R}^3$ 的子空间？`,
          );
          const right = passOrigin
            ? t(`Yes, because it is a plane passing through the origin`, `是，因为它是过原点的平面`)
            : t(
                `No, because it is an affine plane that does not pass through the origin ($${d} \\neq 0$)`,
                `否，因为它是不过原点的仿射平面（$${d} \\neq 0$）`,
              );
          const wrong = passOrigin
            ? [
                t(`No, because only lines can be subspaces`, `否，因为只有直线才能构成子空间`),
                t(`No, because it does not contain the unit vectors`, `否，因为不包含标准基向量`),
                t(`Yes, but only if $x, y, z$ are all positive`, `是，但仅当 $x, y, z$ 全为正数时`),
              ]
            : [
                t(`Yes, because every plane in $\\mathbb{R}^3$ is a subspace`, `是，因为 $\\mathbb{R}^3$ 中的所有平面都是子空间`),
                t(`Yes, because the plane has dimension 2`, `是，因为该平面的维数是 2`),
                t(`No, because planes have too many dimensions to be subspaces`, `否，因为平面的维数太高无法构成子空间`),
              ];
          const p = [b, -a, 0];
          const solution = walked(
            [
              [
                ["Test the origin", "检验原点"],
                t(`At $(0, 0, 0)$ the left side is $0$, and the right side is $${d}$.`, `在 $(0, 0, 0)$ 处左边为 $0$，右边为 $${d}$。`),
              ],
              [
                ["Conclude", "得出结论"],
                passOrigin
                  ? t(
                      "The equation is homogeneous, so $P$ is a plane through the origin, a $2$-dimensional subspace.",
                      "方程是齐次的，所以 $P$ 是过原点的平面，即 $2$ 维子空间。",
                    )
                  : t(
                      `Since $0 \\neq ${d}$, $P$ misses the zero vector and is not a subspace.`,
                      `由于 $0 \\neq ${d}$，$P$ 不含零向量，不是子空间。`,
                    ),
              ],
            ],
            passOrigin
              ? t(
                  `The point $(${p.join(", ")})$ is on $P$, since $${a} \\cdot ${paren(b)} + ${paren(b)} \\cdot ${paren(-a)} = 0$, and so is every multiple of it.`,
                  `点 $(${p.join(", ")})$ 在 $P$ 上，因为 $${a} \\cdot ${paren(b)} + ${paren(b)} \\cdot ${paren(-a)} = 0$，它的每个倍数也在。`,
                )
              : t(
                  `Scaling fails as well: if $\\mathbf{p}$ is on $P$, then $2\\mathbf{p}$ gives $2 \\cdot ${paren(d)} = ${2 * d} \\neq ${d}$.`,
                  `数乘也不封闭：若 $\\mathbf{p}$ 在 $P$ 上，则 $2\\mathbf{p}$ 给出 $2 \\cdot ${paren(d)} = ${2 * d} \\neq ${d}$。`,
                ),
          );
          const reasons: [string, string, string][] = passOrigin
            ? [
                [wrong[0]!.en, "Planes through the origin are subspaces too, of dimension $2$.", "过原点的平面也是子空间，维数为 $2$。"],
                [
                  wrong[1]!.en,
                  "A subspace need not contain the unit vectors; it must contain $\\mathbf{0}$ and be closed.",
                  "子空间不必包含标准基向量；它必须含 $\\mathbf{0}$ 并且封闭。",
                ],
                [
                  wrong[2]!.en,
                  "Keeping only positive entries would break closure under negative scalars; the whole plane is the subspace.",
                  "只保留正分量会破坏对负数数乘的封闭性；整个平面才是子空间。",
                ],
              ]
            : [
                [
                  wrong[0]!.en,
                  `Only planes through the origin are subspaces, and this one misses it: $0 \\neq ${d}$.`,
                  `只有过原点的平面才是子空间，而这个平面不经过原点：$0 \\neq ${d}$。`,
                ],
                [
                  wrong[1]!.en,
                  "Dimension $2$ is not enough; a subspace must contain the zero vector.",
                  "维数为 $2$ 还不够；子空间必须含零向量。",
                ],
                [
                  wrong[2]!.en,
                  "Planes through the origin are subspaces; this one fails only because it misses the origin.",
                  "过原点的平面是子空间；这个平面不是，只因为它不经过原点。",
                ],
              ];
          return reasoned(oneOf(rng, prompt, right, wrong, solution), reasons);
        }
        const v = [a, b, c];
        const offset = passOrigin ? [0, 0, 0] : [1, 0, 0];
        const prompt = t(
          `In $\\mathbb{R}^3$, the line $L$ parameterized by $\\mathbf{r}(t) = ${colVecLatex(offset)} + t ${colVecLatex(v)}$ is a subspace of $\\mathbb{R}^3$ if and only if:`,
          `在 $\\mathbb{R}^3$ 中，由参数方程 $\\mathbf{r}(t) = ${colVecLatex(offset)} + t ${colVecLatex(v)}$ 表示的直线 $L$ 构成子空间当且仅当：`,
        );
        const right = t(`The line passes through the origin $(0, 0, 0)$`, `该直线经过原点 $(0, 0, 0)$`);
        const wrong = [
          t(`The line is parallel to the z-axis`, `该直线平行于 z 轴`),
          t(`The direction vector has unit length`, `方向向量具有单位长度`),
          t(`The parameter $t$ is strictly positive`, `参数 $t$ 严格为正数`),
        ];
        const solution = walked(
          [
            [
              ["The zero vector is needed", "需要零向量"],
              t(
                "Every subspace contains $\\mathbf{0}$, so a line that misses the origin is never a subspace.",
                "每个子空间都含 $\\mathbf{0}$，所以不经过原点的直线一定不是子空间。",
              ),
            ],
            [
              ["A line through the origin is a span", "过原点的直线是张成空间"],
              t(
                `If the line passes through the origin, it is $\\operatorname{Span}\\{${colVecLatex(v)}\\}$, which is a subspace.`,
                `若直线经过原点，它就是 $\\operatorname{Span}\\{${colVecLatex(v)}\\}$，是子空间。`,
              ),
            ],
          ],
          passOrigin
            ? t(
                "Here $t = 0$ gives $\\mathbf{r}(0) = \\mathbf{0}$, so this line is a subspace.",
                "这里 $t = 0$ 给出 $\\mathbf{r}(0) = \\mathbf{0}$，所以这条直线是子空间。",
              )
            : t(
                `Here the second entry $${formatLinearExpr([[b, "t"]])}$ is $0$ only at $t = 0$, where the first entry is $1$, so this line misses the origin and is not a subspace.`,
                `这里第二个分量 $${formatLinearExpr([[b, "t"]])}$ 只在 $t = 0$ 时为 $0$，而此时第一个分量为 $1$，所以这条直线不经过原点，不是子空间。`,
              ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The direction does not matter; a line in any direction is a subspace when it passes through the origin.",
            "方向无关紧要；任何方向的直线只要经过原点就是子空间。",
          ],
          [
            wrong[1]!.en,
            "Rescaling the direction vector gives the same line, so its length cannot matter.",
            "把方向向量伸缩后仍是同一条直线，所以长度无关紧要。",
          ],
          [
            wrong[2]!.en,
            "Positive $t$ gives only half a line, which is not closed under negative scalars.",
            "只取正的 $t$ 只得到半条直线，对负数数乘不封闭。",
          ],
        ]);
      },
    },
    {
      id: "hyperplane-subspaces-rn",
      title: t("Hyperplanes through the origin in $\\mathbb{R}^n$", "$\\mathbb{R}^n$ 中过原点的超平面子空间"),
      explanation: t(
        "In $\\mathbb{R}^n$, a single linear equation $a_1x_1 + \\dots + a_nx_n = k$ with not all $a_i$ zero defines an $(n - 1)$-dimensional hyperplane. It is a subspace if and only if $k = 0$. For example, $x_1 + 2x_2 - x_3 + x_4 = k - 3$ is a subspace of $\\mathbb{R}^4$ exactly when $k - 3 = 0$, that is $k = 3$.\n\n> **Watch out.** It is the whole right side that must vanish; when it is written as $k$ plus a number, solve for $k$ rather than setting $k = 0$.",
        "在 $\\mathbb{R}^n$ 中，系数不全为零的单一线性方程 $a_1x_1 + \\dots + a_nx_n = k$ 定义一个 $(n - 1)$ 维超平面。它构成子空间当且仅当常数项 $k = 0$。例如 $x_1 + 2x_2 - x_3 + x_4 = k - 3$ 是 $\\mathbb{R}^4$ 的子空间，当且仅当 $k - 3 = 0$，即 $k = 3$。\n\n> **注意。** 必须为零的是整个右边；当右边写成 $k$ 加一个数时，要解出 $k$，而不是令 $k = 0$。",
      ),
      generate(rng) {
        const n = rng.int(4, 6);
        const coeffs = Array.from({ length: n }, () => rng.nonZero(-3, 3));
        const eqLhs = formatLinearExpr(coeffs.map((c, i) => [c, `x_{${i + 1}}`]));
        const m = rng.int(-9, 9);
        const rhs = m === 0 ? "k" : `k ${m < 0 ? "+" : "-"} ${Math.abs(m)}`;
        const prompt = t(
          `The hyperplane in $\\mathbb{R}^{${n}}$ defined by $H = \\left\\{ (x_1, \\dots, x_{${n}}) \\mid ${eqLhs} = ${rhs} \\right\\}$ forms a subspace of $\\mathbb{R}^{${n}}$ precisely when:`,
          `在 $\\mathbb{R}^{${n}}$ 中，由 $H = \\left\\{ (x_1, \\dots, x_{${n}}) \\mid ${eqLhs} = ${rhs} \\right\\}$ 定义的超平面构成子空间，充要条件是：`,
        );
        const right = t(`$k = ${m}$`, `$k = ${m}$`);
        const others = [-m, m + 1, m - 1, m === 0 ? 2 : 0, coeffs[0]!];
        const wrong = others.map((v) => t(`$k = ${v}$`, `$k = ${v}$`));
        const solution = walked(
          [
            [
              ["Put in the zero vector", "代入零向量"],
              t(
                "A subspace must contain $\\mathbf{0} = (0, \\dots, 0)$, where the left side is $0$:",
                "子空间必须含 $\\mathbf{0} = (0, \\dots, 0)$，在该处左边为 $0$：",
              ),
              [`0 = ${rhs}`],
            ],
            [["Solve for $k$", "解出 $k$"], t("", ""), [`k = ${m}`]],
          ],
          t(
            `With $k = ${m}$ the equation reads $${eqLhs} = 0$; if two vectors satisfy it, so does their sum ($0 + 0 = 0$) and every multiple ($c \\cdot 0 = 0$).`,
            `当 $k = ${m}$ 时方程为 $${eqLhs} = 0$；若两个向量满足它，它们的和（$0 + 0 = 0$）与每个倍数（$c \\cdot 0 = 0$）也满足。`,
          ),
        );
        return reasoned(
          oneOf(rng, prompt, right, wrong, solution),
          others.map(
            (v) =>
              [
                `$k = ${v}$`,
                `At the zero vector the left side is $0$, and with this $k$ the right side is $${v - m}$, so the zero vector is not in $H$.`,
                `在零向量处左边是 $0$，而取这个 $k$ 时右边是 $${v - m}$，所以零向量不在 $H$ 中。`,
              ] as [string, string, string],
          ),
        );
      },
    },
  ],
};

/** theColumnSpaceOfAMatrix covers column space definition, ambient space, and testing membership via Ax = b. */
export const theColumnSpaceOfAMatrix: TopicDef = {
  id: "the-column-space-of-a-matrix",
  title: t("The Column Space of a Matrix", "矩阵的列空间 Col(A)"),
  summary: t(
    "Define the column space Col(A) as the span of the columns of matrix A, identify its ambient space, and relate membership in Col(A) to the consistency of Ax = b.",
    "掌握矩阵列空间 Col(A) 作为矩阵列向量张成空间的定义，明确其所在空间，并建立向量属于列空间与线性方程组 Ax = b 相容性的联系。",
  ),
  intro: t(
    "Let $A$ have columns $(1, 2, 0)$ and $(0, 1, 3)$. Is $\\mathbf{b} = (2, 3, -3)$ in $\\operatorname{Col}(A)$? We need weights with $x_1(1, 2, 0) + x_2(0, 1, 3) = (2, 3, -3)$. The first entry gives $x_1 = 2$, the second gives $4 + x_2 = 3$, so $x_2 = -1$.\n\nCheck: the third entry is $0 \\cdot 2 + 3 \\cdot (-1) = -3$, which matches, so $\\mathbf{b} = 2\\mathbf{a}_1 - \\mathbf{a}_2$ is in $\\operatorname{Col}(A)$, a subspace of $\\mathbb{R}^3$.\n\nIn this lesson we find where the column space lives and test whether a vector is in it by solving $A\\mathbf{x} = \\mathbf{b}$.",
    "设 $A$ 的列为 $(1, 2, 0)$ 与 $(0, 1, 3)$。$\\mathbf{b} = (2, 3, -3)$ 是否在 $\\operatorname{Col}(A)$ 中？我们需要权重使 $x_1(1, 2, 0) + x_2(0, 1, 3) = (2, 3, -3)$。第一个分量给出 $x_1 = 2$，第二个分量给出 $4 + x_2 = 3$，所以 $x_2 = -1$。\n\n检验：第三个分量为 $0 \\cdot 2 + 3 \\cdot (-1) = -3$，相符，所以 $\\mathbf{b} = 2\\mathbf{a}_1 - \\mathbf{a}_2$ 在 $\\operatorname{Col}(A)$ 中，它是 $\\mathbb{R}^3$ 的子空间。\n\n本课我们确定列空间所在的空间，并通过求解 $A\\mathbf{x} = \\mathbf{b}$ 检验一个向量是否属于列空间。",
  ),
  prerequisites: ["subspaces-of-n-dimensional-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "column-space-ambient-space-dimension",
      title: t("Ambient space of Col(A)", "列空间 Col(A) 的所在空间"),
      explanation: t(
        "The column space is built from the columns, so it lives in the space whose dimension is the number of rows, the length of each column. For an $m \\times n$ matrix $A$, each column has $m$ entries, so $\\operatorname{Col}(A)$ is a subspace of $\\mathbb{R}^m$. For example, a $4 \\times 7$ matrix has seven columns of length $4$, so its column space lies in $\\mathbb{R}^4$.\n\n> **Watch out.** Count the rows, not the columns: the number of columns says how many vectors are spanned, not how long they are.",
        "列空间由各列构成，所以它位于维数等于行数，也就是每列长度的空间中。对于 $m \\times n$ 矩阵 $A$，每个列向量有 $m$ 个分量，因此列空间 $\\operatorname{Col}(A)$ 是 $\\mathbb{R}^m$ 的子空间。例如 $4 \\times 7$ 矩阵有七个长度为 $4$ 的列，所以它的列空间在 $\\mathbb{R}^4$ 中。\n\n> **注意。** 数的是行数而不是列数：列数说明张成用了多少个向量，而不是向量有多长。",
      ),
      generate(rng) {
        const m = rng.int(2, 10);
        const n = rng.int(2, 10);
        const prompt = t(
          `Let $A$ be ${article(m)} $${m} \\times ${n}$ matrix. The column space $\\text{Col}(A)$ is a subspace of which Euclidean space?`,
          `设 $A$ 为一个 $${m} \\times ${n}$ 矩阵。其列空间 $\\text{Col}(A)$ 是哪一个欧几里得空间的子空间？`,
        );
        const right = t(`$\\mathbb{R}^{${m}}$`, `$\\mathbb{R}^{${m}}$`);
        const wrong = [
          t(`$\\mathbb{R}^{${n}}$`, `$\\mathbb{R}^{${n}}$`),
          t(`$\\mathbb{R}^{${m + n}}$`, `$\\mathbb{R}^{${m + n}}$`),
          t(`$\\mathbb{R}^{${m * n}}$`, `$\\mathbb{R}^{${m * n}}$`),
        ];
        const solution = walked(
          [
            [["Read the size", "读出尺寸"], t(`$A$ has $${m}$ rows and $${n}$ columns.`, `$A$ 有 $${m}$ 行、$${n}$ 列。`)],
            [
              ["Length of a column", "列的长度"],
              t(
                `Each of the $${n}$ columns has one entry per row, so each lies in $\\mathbb{R}^{${m}}$.`,
                `$${n}$ 个列中每一列每行一个元素，所以每列都在 $\\mathbb{R}^{${m}}$ 中。`,
              ),
            ],
          ],
          t(
            `$\\text{Col}(A)$ is the span of these columns, and a span of vectors in $\\mathbb{R}^{${m}}$ stays in $\\mathbb{R}^{${m}}$; also $A\\mathbf{x}$ has $${m}$ entries for every $\\mathbf{x}$.`,
            `$\\text{Col}(A)$ 是这些列的张成空间，而 $\\mathbb{R}^{${m}}$ 中向量的张成空间仍在 $\\mathbb{R}^{${m}}$ 中；并且对任意 $\\mathbf{x}$，$A\\mathbf{x}$ 都有 $${m}$ 个分量。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `$${n}$ is the number of columns, but the space is set by how many entries each column has, which is $${m}$.`,
            `$${n}$ 是列数，但空间由每列的元素个数决定，也就是 $${m}$。`,
          ],
          [wrong[1]!.en, `The two sizes are not added: each column has $${m}$ entries.`, `两个尺寸不相加：每列有 $${m}$ 个元素。`],
          [
            wrong[2]!.en,
            `$${m * n}$ counts all the entries of the matrix, but each column has only $${m}$.`,
            `$${m * n}$ 是矩阵的元素总数，而每列只有 $${m}$ 个元素。`,
          ],
        ]);
      },
    },
    {
      id: "membership-in-column-space",
      title: t("Determining if b is in Col(A)", "判定向量 b 是否属于列空间 Col(A)"),
      explanation: t(
        "Every product of the matrix with a vector is a combination of its columns, so a vector is in the column space exactly when the system can be solved. A vector $\\mathbf{b}$ is in $\\operatorname{Col}(A)$ if and only if the linear system $A\\mathbf{x} = \\mathbf{b}$ has a solution (is consistent). For example, with columns $(1, 0, 1)$ and $(0, 1, 1)$, the vector $(2, 3, 5)$ is in the column space, since $2(1, 0, 1) + 3(0, 1, 1) = (2, 3, 5)$, but $(2, 3, 4)$ is not.\n\n> **Watch out.** Weights that fit the first two entries settle nothing until the last entry is checked as well.",
        "矩阵与向量的每个乘积都是它各列的组合，所以一个向量在列空间中，当且仅当方程组有解。向量 $\\mathbf{b}$ 属于列空间 $\\operatorname{Col}(A)$，当且仅当线性方程组 $A\\mathbf{x} = \\mathbf{b}$ 有解（即方程组相容）。例如列为 $(1, 0, 1)$ 与 $(0, 1, 1)$ 时，向量 $(2, 3, 5)$ 在列空间中，因为 $2(1, 0, 1) + 3(0, 1, 1) = (2, 3, 5)$，而 $(2, 3, 4)$ 不在。\n\n> **注意。** 符合前两个分量的权重还说明不了什么，必须再检验最后一个分量。",
      ),
      generate(rng) {
        const inCol = rng.bool();
        const a11 = 1;
        const a21 = rng.int(-2, 2);
        const a31 = rng.int(-2, 2);
        const a12 = 0;
        const a22 = 1;
        const a32 = rng.int(-2, 2);
        const x1 = rng.int(-3, 3);
        const x2 = rng.int(-3, 3);
        const delta = inCol ? 0 : rng.pick([-3, -2, 2, 3]);
        const b = [a11 * x1 + a12 * x2, a21 * x1 + a22 * x2, a31 * x1 + a32 * x2 + delta];
        const mat = [
          [a11, a12],
          [a21, a22],
          [a31, a32],
        ];
        const prompt = t(
          `Let $A = ${matLatex(mat)}$ and $\\mathbf{b} = ${colVecLatex(b)}$. Does $\\mathbf{b}$ belong to $\\text{Col}(A)$?`,
          `设 $A = ${matLatex(mat)}$ 且 $\\mathbf{b} = ${colVecLatex(b)}$。向量 $\\mathbf{b}$ 是否属于 $\\text{Col}(A)$？`,
        );
        const right = inCol
          ? t(
              `Yes, because the system $A\\mathbf{x} = \\mathbf{b}$ is consistent with $\\mathbf{x} = ${colVecLatex([x1, x2])}$`,
              `是，因为方程组 $A\\mathbf{x} = \\mathbf{b}$ 相容，解为 $\\mathbf{x} = ${colVecLatex([x1, x2])}$`,
            )
          : t(
              `No, because the system $A\\mathbf{x} = \\mathbf{b}$ is inconsistent`,
              `否，因为方程组 $A\\mathbf{x} = \\mathbf{b}$ 矛盾无解`,
            );
        const wrong = inCol
          ? [
              t(`No, because $A$ is not a square matrix`, `否，因为 $A$ 不是方阵`),
              t(
                `No, because $\\mathbf{b}$ is in $\\mathbb{R}^3$ while the columns have 2 entries`,
                `否，因为 $\\mathbf{b} \\in \\mathbb{R}^3$ 而列向量只有 2 个元素`,
              ),
              t(`Yes, but only if $\\mathbf{x} = \\mathbf{0}$`, `是，但仅当 $\\mathbf{x} = \\mathbf{0}$ 时`),
            ]
          : [
              t(
                `Yes, because every vector in $\\mathbb{R}^3$ is in $\\text{Col}(A)$`,
                `是，因为 $\\mathbb{R}^3$ 中的每个向量都在 $\\text{Col}(A)$ 中`,
              ),
              t(`Yes, with solution $\\mathbf{x} = ${colVecLatex([x1, x2])}$`, `是，其解为 $\\mathbf{x} = ${colVecLatex([x1, x2])}$`),
              t(`No, because $\\text{Col}(A)$ is always the zero subspace`, `否，因为 $\\text{Col}(A)$ 始终是零子空间`),
            ];
        const third = a31 * x1 + a32 * x2;
        const solution = walked(
          [
            [
              ["First equation", "第一个方程"],
              t("Row 1 of $A\\mathbf{x} = \\mathbf{b}$ reads $x_1 = b_1$:", "$A\\mathbf{x} = \\mathbf{b}$ 的第 1 行为 $x_1 = b_1$："),
              [`x_1 = ${x1}`],
            ],
            [
              ["Second equation", "第二个方程"],
              t("Row 2 then fixes $x_2$:", "第 2 行随后确定 $x_2$："),
              [`${a21} \\cdot ${paren(x1)} + x_2 = ${b[1]}`, `x_2 = ${x2}`],
            ],
            [
              ["Check the third equation", "检验第三个方程"],
              t("Put both weights into row 3:", "把两个权重代入第 3 行："),
              [`${a31} \\cdot ${paren(x1)} + ${paren(a32)} \\cdot ${paren(x2)} = ${third}`],
            ],
          ],
          inCol
            ? t(
                `This equals $b_3 = ${b[2]}$, so the system is consistent and $\\mathbf{b} = ${formatVectorComb([
                  [x1, "\\mathbf{a}_1"],
                  [x2, "\\mathbf{a}_2"],
                ]).replace(/^0$/, "\\mathbf{0}")} \\in \\text{Col}(A)$.`,
                `它等于 $b_3 = ${b[2]}$，所以方程组相容，$\\mathbf{b} = ${formatVectorComb([
                  [x1, "\\mathbf{a}_1"],
                  [x2, "\\mathbf{a}_2"],
                ]).replace(/^0$/, "\\mathbf{0}")} \\in \\text{Col}(A)$。`,
              )
            : t(
                `But $b_3 = ${b[2]} \\neq ${third}$. The only weights that fit rows 1 and 2 fail row 3, so the system is inconsistent and $\\mathbf{b} \\notin \\text{Col}(A)$.`,
                `但 $b_3 = ${b[2]} \\neq ${third}$。唯一符合第 1、2 行的权重不满足第 3 行，所以方程组无解，$\\mathbf{b} \\notin \\text{Col}(A)$。`,
              ),
        );
        const reasons: [string, string, string][] = inCol
          ? [
              [wrong[0]!.en, "A column space is defined for every matrix, square or not.", "每个矩阵都有列空间，无论是否为方阵。"],
              [
                wrong[1]!.en,
                "The columns have 3 entries, one per row, so they lie in $\\mathbb{R}^3$ like $\\mathbf{b}$.",
                "列有 3 个元素，每行一个，所以它们与 $\\mathbf{b}$ 一样在 $\\mathbb{R}^3$ 中。",
              ],
              [
                wrong[2]!.en,
                `$\\mathbf{x} = \\mathbf{0}$ gives only the zero vector; here $\\mathbf{x} = ${colVecLatex([x1, x2])}$ works.`,
                `$\\mathbf{x} = \\mathbf{0}$ 只给出零向量；这里 $\\mathbf{x} = ${colVecLatex([x1, x2])}$ 满足方程。`,
              ],
            ]
          : [
              [
                wrong[0]!.en,
                "Two columns span at most a plane, not all of $\\mathbb{R}^3$.",
                "两个列最多张成一个平面，而不是整个 $\\mathbb{R}^3$。",
              ],
              [
                wrong[1]!.en,
                `These weights fit rows 1 and 2, but row 3 gives $${third}$, not $${b[2]}$.`,
                `这组权重符合第 1、2 行，但第 3 行给出 $${third}$，不是 $${b[2]}$。`,
              ],
              [
                wrong[2]!.en,
                "The columns themselves are nonzero vectors in $\\text{Col}(A)$.",
                "各列本身就是 $\\text{Col}(A)$ 中的非零向量。",
              ],
            ];
        return reasoned(oneOf(rng, prompt, right, wrong, solution), reasons);
      },
    },
  ],
};

/** theNullSpaceOfAMatrix covers null space definition, ambient space, and testing membership via Av = 0. */
export const theNullSpaceOfAMatrix: TopicDef = {
  id: "the-null-space-of-a-matrix",
  title: t("The Null Space of a Matrix", "矩阵的零空间/核 Null(A)"),
  summary: t(
    "Define the null space Null(A) as the solution set of Ax = 0, identify its ambient space, and test whether a vector belongs to Null(A).",
    "掌握矩阵零空间（核）Null(A) 作为齐次方程 Ax = 0 解集的定义，明确其所在空间，并检验向量是否属于 Null(A)。",
  ),
  intro: t(
    "Let $A = \\begin{pmatrix} 1 & 2 & -1 \\\\ 0 & 1 & 3 \\end{pmatrix}$ and $\\mathbf{v} = (7, -3, 1)$. Then $A\\mathbf{v} = (7 - 6 - 1, -3 + 3) = (0, 0)$, so $\\mathbf{v}$ is in $\\operatorname{Null}(A)$, a subspace of $\\mathbb{R}^3$.\n\nCheck: $2\\mathbf{v} = (14, -6, 2)$ gives $14 - 12 - 2 = 0$ and $-6 + 6 = 0$, so the multiple is in the null space too, as it must be.\n\nIn this lesson we find where the null space lives and test whether a vector is in it by computing $A\\mathbf{v}$.",
    "设 $A = \\begin{pmatrix} 1 & 2 & -1 \\\\ 0 & 1 & 3 \\end{pmatrix}$，$\\mathbf{v} = (7, -3, 1)$。则 $A\\mathbf{v} = (7 - 6 - 1, -3 + 3) = (0, 0)$，所以 $\\mathbf{v}$ 在 $\\operatorname{Null}(A)$ 中，它是 $\\mathbb{R}^3$ 的子空间。\n\n检验：$2\\mathbf{v} = (14, -6, 2)$ 给出 $14 - 12 - 2 = 0$ 与 $-6 + 6 = 0$，所以这个倍数也在零空间中，理应如此。\n\n本课我们确定零空间所在的空间，并通过计算 $A\\mathbf{v}$ 检验一个向量是否属于零空间。",
  ),
  prerequisites: ["subspaces-of-n-dimensional-space"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "null-space-ambient-space",
      title: t("Ambient space of Null(A)", "零空间 Null(A) 的所在空间"),
      explanation: t(
        "The null space consists of inputs to the matrix, so its vectors have as many entries as the matrix has columns. For an $m \\times n$ matrix $A$, the equation $A\\mathbf{x} = \\mathbf{0}$ requires $\\mathbf{x}$ to have $n$ components, so $\\operatorname{Null}(A)$ is a subspace of $\\mathbb{R}^n$. For example, a $4 \\times 7$ matrix multiplies vectors with $7$ entries, so its null space lies in $\\mathbb{R}^7$.\n\n> **Watch out.** The null space and the column space usually live in different spaces: $\\mathbb{R}^n$ for inputs, $\\mathbb{R}^m$ for outputs.",
        "零空间由矩阵的输入向量组成，所以其中的向量的分量个数等于矩阵的列数。对于 $m \\times n$ 矩阵 $A$，方程 $A\\mathbf{x} = \\mathbf{0}$ 中的未知向量 $\\mathbf{x}$ 有 $n$ 个分量，因此 $\\operatorname{Null}(A)$ 是 $\\mathbb{R}^n$ 的子空间。例如 $4 \\times 7$ 矩阵乘的是有 $7$ 个分量的向量，所以它的零空间在 $\\mathbb{R}^7$ 中。\n\n> **注意。** 零空间与列空间通常位于不同的空间：输入在 $\\mathbb{R}^n$ 中，输出在 $\\mathbb{R}^m$ 中。",
      ),
      generate(rng) {
        const m = rng.int(2, 10);
        const n = rng.int(2, 10);
        const prompt = t(
          `Let $A$ be ${article(m)} $${m} \\times ${n}$ matrix. In which Euclidean space does the null space $\\text{Null}(A)$ reside?`,
          `设 $A$ 为一个 $${m} \\times ${n}$ 矩阵。其零空间 $\\text{Null}(A)$ 是哪一个空间的子空间？`,
        );
        const right = t(`$\\mathbb{R}^{${n}}$`, `$\\mathbb{R}^{${n}}$`);
        const wrong = [
          t(`$\\mathbb{R}^{${m}}$`, `$\\mathbb{R}^{${m}}$`),
          t(`$\\mathbb{R}^{${m - n > 0 ? m - n : 1}}$`, `$\\mathbb{R}^{${m - n > 0 ? m - n : 1}}$`),
          t(`$\\mathbb{R}^{${m * n}}$`, `$\\mathbb{R}^{${m * n}}$`),
        ];
        const solution = walked(
          [
            [["Read the size", "读出尺寸"], t(`$A$ has $${m}$ rows and $${n}$ columns.`, `$A$ 有 $${m}$ 行、$${n}$ 列。`)],
            [
              ["Size of an input", "输入的长度"],
              t(
                `$A\\mathbf{x}$ pairs each of the $${n}$ columns with one entry of $\\mathbf{x}$, so $\\mathbf{x}$ must have $${n}$ entries.`,
                `$A\\mathbf{x}$ 把 $${n}$ 个列各与 $\\mathbf{x}$ 的一个分量配对，所以 $\\mathbf{x}$ 必须有 $${n}$ 个分量。`,
              ),
            ],
          ],
          t(
            `The solutions of $A\\mathbf{x} = \\mathbf{0}$ are such inputs, so $\\text{Null}(A) \\subseteq \\mathbb{R}^{${n}}$, while the output $\\mathbf{0}$ has $${m}$ entries.`,
            `$A\\mathbf{x} = \\mathbf{0}$ 的解就是这样的输入，所以 $\\text{Null}(A) \\subseteq \\mathbb{R}^{${n}}$，而输出 $\\mathbf{0}$ 有 $${m}$ 个分量。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `$A\\mathbf{x}$ lands in this space, but the null space holds the inputs $\\mathbf{x}$, which have $${n}$ entries.`,
            `$A\\mathbf{x}$落在这个空间里，但零空间包含的是输入 $\\mathbf{x}$，它有 $${n}$ 个分量。`,
          ],
          [
            wrong[1]!.en,
            `The inputs $\\mathbf{x}$ have $${n}$ entries, one for each column, whatever the difference of the sizes.`,
            `输入 $\\mathbf{x}$ 有 $${n}$ 个分量，每列一个，与两个尺寸之差无关。`,
          ],
          [
            wrong[2]!.en,
            `$${m * n}$ counts all the entries of the matrix, but $\\mathbf{x}$ has one entry per column.`,
            `$${m * n}$ 是矩阵的元素总数，而 $\\mathbf{x}$ 每列只有一个分量。`,
          ],
        ]);
      },
    },
    {
      id: "test-membership-in-null-space",
      title: t("Testing membership in Null(A)", "检验向量是否属于零空间 Null(A)"),
      explanation: t(
        "To test a vector, multiply the matrix by it; the vector is in the null space only if every entry of the product is zero. A vector $\\mathbf{v}$ belongs to $\\operatorname{Null}(A)$ if and only if $A\\mathbf{v} = \\mathbf{0}$. For example, with rows $(1, 0, -2)$ and $(0, 1, 1)$, the vector $(2, -1, 1)$ gives $2 - 2 = 0$ and $-1 + 1 = 0$, so it is in the null space.\n\n> **Watch out.** A nonzero vector can still be in the null space; what matters is the product $A\\mathbf{v}$, not $\\mathbf{v}$ itself.",
        "要检验一个向量，用矩阵乘它；只有当乘积的每个分量都是零时，这个向量才在零空间中。向量 $\\mathbf{v}$ 属于 $\\operatorname{Null}(A)$，当且仅当 $A\\mathbf{v} = \\mathbf{0}$。例如行为 $(1, 0, -2)$ 与 $(0, 1, 1)$ 时，向量 $(2, -1, 1)$ 给出 $2 - 2 = 0$ 与 $-1 + 1 = 0$，所以它在零空间中。\n\n> **注意。** 非零向量也可以在零空间中；关键是乘积 $A\\mathbf{v}$，而不是 $\\mathbf{v}$ 本身。",
      ),
      generate(rng) {
        const inNull = rng.bool();
        const k1 = rng.int(-2, 2);
        const k2 = rng.nonZero(-2, 2);
        const mult = rng.nonZero(-2, 2);
        const cand = inNull ? [mult * k1, mult * k2, mult] : [mult * k1 + 1, mult * k2, mult];
        const A = [
          [1, 0, -k1],
          [0, 1, -k2],
        ];
        const prompt = t(
          `Let $A = ${matLatex(A)}$. Does $\\mathbf{v} = ${colVecLatex(cand)}$ belong to $\\text{Null}(A)$?`,
          `设 $A = ${matLatex(A)}$。向量 $\\mathbf{v} = ${colVecLatex(cand)}$ 是否属于 $\\text{Null}(A)$？`,
        );
        const prod = [cand[0]! - k1 * cand[2]!, cand[1]! - k2 * cand[2]!];
        const right = inNull
          ? t(`Yes, because $A\\mathbf{v} = ${colVecLatex([0, 0])}$`, `是，因为 $A\\mathbf{v} = ${colVecLatex([0, 0])}$`)
          : t(
              `No, because $A\\mathbf{v} = ${colVecLatex(prod)} \\neq \\mathbf{0}$`,
              `否，因为 $A\\mathbf{v} = ${colVecLatex(prod)} \\neq \\mathbf{0}$`,
            );
        const wrong = inNull
          ? [
              t(`No, because $\\mathbf{v} \\neq \\mathbf{0}$`, `否，因为 $\\mathbf{v} \\neq \\mathbf{0}$`),
              t(`No, because $A$ has full row rank`, `否，因为 $A$ 行满秩`),
              t(`Yes, but only if $A$ is invertible`, `是，但仅当 $A$ 可逆时`),
            ]
          : [
              t(`Yes, because $A\\mathbf{v} = ${colVecLatex([0, 0])}$`, `是，因为 $A\\mathbf{v} = ${colVecLatex([0, 0])}$`),
              t(`Yes, because $\\mathbf{v} \\in \\mathbb{R}^3$`, `是，因为 $\\mathbf{v} \\in \\mathbb{R}^3$`),
              t(`No, because $\\text{Null}(A)$ contains only the zero vector`, `否，因为 $\\text{Null}(A)$ 仅含零向量`),
            ];
        const solution = walked(
          [
            [
              ["Row 1 times v", "第 1 行乘 v"],
              t("", ""),
              [`1 \\cdot ${paren(cand[0]!)} + 0 \\cdot ${paren(cand[1]!)} + ${paren(-k1)} \\cdot ${paren(cand[2]!)} = ${prod[0]}`],
            ],
            [
              ["Row 2 times v", "第 2 行乘 v"],
              t("", ""),
              [`0 \\cdot ${paren(cand[0]!)} + 1 \\cdot ${paren(cand[1]!)} + ${paren(-k2)} \\cdot ${paren(cand[2]!)} = ${prod[1]}`],
            ],
          ],
          inNull
            ? t(
                `Both entries are $0$, so $A\\mathbf{v} = \\mathbf{0}$ and $\\mathbf{v} \\in \\text{Null}(A)$.`,
                `两个分量都是 $0$，所以 $A\\mathbf{v} = \\mathbf{0}$，$\\mathbf{v} \\in \\text{Null}(A)$。`,
              )
            : t(
                `The first entry is $${prod[0]} \\neq 0$, so $A\\mathbf{v} \\neq \\mathbf{0}$ and $\\mathbf{v} \\notin \\text{Null}(A)$.`,
                `第一个分量为 $${prod[0]} \\neq 0$，所以 $A\\mathbf{v} \\neq \\mathbf{0}$，$\\mathbf{v} \\notin \\text{Null}(A)$。`,
              ),
        );
        const reasons: [string, string, string][] = inNull
          ? [
              [
                wrong[0]!.en,
                "A nonzero vector is in the null space whenever $A\\mathbf{v} = \\mathbf{0}$, and here it is.",
                "只要 $A\\mathbf{v} = \\mathbf{0}$，非零向量也在零空间中，这里正是如此。",
              ],
              [
                wrong[1]!.en,
                "Full row rank does not stop a $2 \\times 3$ matrix from sending nonzero vectors to $\\mathbf{0}$; with three columns and two rows it must.",
                "行满秩并不妨碍 $2 \\times 3$ 矩阵把非零向量映到 $\\mathbf{0}$；三列两行的矩阵必然如此。",
              ],
              [
                wrong[2]!.en,
                "$A$ is not square, so it is not invertible, and membership depends only on $A\\mathbf{v}$.",
                "$A$ 不是方阵，不可逆，而是否属于零空间只取决于 $A\\mathbf{v}$。",
              ],
            ]
          : [
              [wrong[0]!.en, `Row 1 gives $${prod[0]}$, not $0$.`, `第 1 行给出 $${prod[0]}$，不是 $0$。`],
              [
                wrong[1]!.en,
                "Having three entries only makes the product defined; it still has to come out zero.",
                "有三个分量只说明乘积有定义；乘积还必须为零。",
              ],
              [
                wrong[2]!.en,
                "The null space of a $2 \\times 3$ matrix always contains nonzero vectors; this one just is not among them.",
                "$2 \\times 3$ 矩阵的零空间总含非零向量；只是这个向量不在其中。",
              ],
            ];
        return reasoned(oneOf(rng, prompt, right, wrong, solution), reasons);
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 3.11: BASES OF N-DIMENSIONAL SPACE
// ════════════════════════════════════════════════════════════════════════════

/** findingABasisOfASpan covers the definition of a basis and extracting a basis from a spanning set. */
export const findingABasisOfASpan: TopicDef = {
  id: "finding-a-basis-of-a-span",
  title: t("Finding a Basis of a Span", "求向量张成空间的基"),
  summary: t(
    "Define a basis as a linearly independent spanning set and extract a basis from a collection of spanning vectors by locating pivot columns.",
    "掌握基作为线性无关张成集的定义，并通过确定主元列从一组张成向量中提取出基。",
  ),
  intro: t(
    "Take $W = \\operatorname{Span}\\{(1, 2), (2, 4), (0, 1)\\}$. Since $(2, 4) = 2(1, 2)$, the second vector adds nothing, and we drop it. The vectors $(1, 2)$ and $(0, 1)$ are not multiples of each other, so $\\{(1, 2), (0, 1)\\}$ is independent and still spans $W$: it is a basis.\n\nCheck: $(3, 5) = 3(1, 2) + (-1)(0, 1)$, since $(3, 6 - 1) = (3, 5)$, and these are the only weights that work.\n\nIn this lesson we define a basis as an independent spanning set and extract one from a spanning set by keeping the pivot columns.",
    "取 $W = \\operatorname{Span}\\{(1, 2), (2, 4), (0, 1)\\}$。由于 $(2, 4) = 2(1, 2)$，第二个向量没有带来新东西，把它去掉。向量 $(1, 2)$ 与 $(0, 1)$ 不互为倍数，所以 $\\{(1, 2), (0, 1)\\}$ 线性无关且仍张成 $W$：它是一组基。\n\n检验：$(3, 5) = 3(1, 2) + (-1)(0, 1)$，因为 $(3, 6 - 1) = (3, 5)$，而且只有这组权重成立。\n\n本课我们把基定义为线性无关的张成组，并通过保留主元列从张成组中提取基。",
  ),
  prerequisites: ["linear-dependence-and-independence"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "basis-definition-criteria",
      title: t("Criteria for a basis of a subspace", "子空间基的判定准则"),
      explanation: t(
        "A basis has enough vectors to build every vector of the subspace and no extra ones, so each vector has exactly one set of coordinates. A set of vectors $\\mathcal{B} = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_k\\}$ is a basis for a subspace $H$ if (1) $\\mathcal{B}$ is linearly independent and (2) $\\operatorname{Span}(\\mathcal{B}) = H$. For example, $\\{(1, 0), (0, 1), (1, 1)\\}$ spans $\\mathbb{R}^2$ but is dependent, since $(1, 1) = (1, 0) + (0, 1)$, so it is not a basis; $\\{(1, 0), (1, 1)\\}$ is.\n\n> **Watch out.** Both conditions are needed: an independent set may span too little, and a spanning set may have a redundant vector.",
        "基有足够的向量来构造子空间中的每个向量，而且没有多余的向量，所以每个向量的坐标都是唯一的。向量组 $\\mathcal{B} = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_k\\}$ 是子空间 $H$ 的一组基，当且仅当：(1) $\\mathcal{B}$ 线性无关；(2) $\\operatorname{Span}(\\mathcal{B}) = H$。例如 $\\{(1, 0), (0, 1), (1, 1)\\}$ 张成 $\\mathbb{R}^2$ 但线性相关，因为 $(1, 1) = (1, 0) + (0, 1)$，所以它不是基；$\\{(1, 0), (1, 1)\\}$ 才是。\n\n> **注意。** 两个条件缺一不可：线性无关的组可能张成得太少，张成组可能含有多余的向量。",
      ),
      generate(rng) {
        const k = rng.int(2, 8);
        const n = rng.int(k + 1, 12);
        const prompt = t(
          `Let $H$ be ${article(k)} $${k}$-dimensional subspace of $\\mathbb{R}^{${n}}$. What two conditions must a set of vectors $\\mathcal{B} = \\{\\mathbf{v}_1, \\dots, \\mathbf{v}_{${k}}\\}$ satisfy to be a basis for $H$?`,
          `设 $H$ 为 $\\mathbb{R}^{${n}}$ 的一个 $${k}$ 维子空间。向量组 $\\mathcal{B} = \\{\\mathbf{v}_1, \\dots, \\mathbf{v}_{${k}}\\}$ 成为 $H$ 的一组基必须满足哪两个条件？`,
        );
        const right = t(
          `$\\mathcal{B}$ must be linearly independent, and $\\text{Span}(\\mathcal{B}) = H$`,
          `$\\mathcal{B}$ 必须线性无关，且 $\\text{Span}(\\mathcal{B}) = H$`,
        );
        const wrong = [
          t(
            `$\\mathcal{B}$ must be orthogonal, and all vectors must have unit length`,
            `$\\mathcal{B}$ 必须正交，且所有向量必须为单位向量`,
          ),
          t(
            `$\\mathcal{B}$ must span all of $\\mathbb{R}^{${n}}$, and it must have $${n}$ vectors`,
            `$\\mathcal{B}$ 必须张成整个 $\\mathbb{R}^{${n}}$，且必须含 $${n}$ 个向量`,
          ),
          t(
            `The vectors in $\\mathcal{B}$ must have non-zero entries and be pairwise linearly independent`,
            `$\\mathcal{B}$ 中的向量分量全非零且两两线性无关`,
          ),
        ];
        const solution = walked(
          [
            [
              ["Enough vectors", "向量足够"],
              t(
                `Every vector of $H$ must be a combination of $\\mathbf{v}_1, \\dots, \\mathbf{v}_{${k}}$, that is $\\text{Span}(\\mathcal{B}) = H$.`,
                `$H$ 中每个向量都必须是 $\\mathbf{v}_1, \\dots, \\mathbf{v}_{${k}}$ 的组合，即 $\\text{Span}(\\mathcal{B}) = H$。`,
              ),
            ],
            [
              ["No extra vectors", "没有多余的向量"],
              t(
                "No vector of $\\mathcal{B}$ may be a combination of the others, that is $\\mathcal{B}$ is linearly independent.",
                "$\\mathcal{B}$ 中没有向量是其余向量的组合，即 $\\mathcal{B}$ 线性无关。",
              ),
            ],
          ],
          t(
            `With both, each vector of $H$ is written in exactly one way as a combination of the $${k}$ vectors; nothing about lengths, angles or zero entries is required.`,
            `两者都满足时，$H$ 中每个向量都唯一地写成这 $${k}$ 个向量的组合；对长度、夹角或零分量没有任何要求。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "That describes an orthonormal basis, which is a special kind: a basis need not be orthogonal or of unit length.",
            "这说的是标准正交基，只是一种特殊的基：基不必正交，也不必是单位长度。",
          ],
          [
            wrong[1]!.en,
            `The subspace $H$ is smaller than $\\mathbb{R}^{${n}}$: a basis of $H$ spans $H$ and has $${k}$ vectors.`,
            `子空间 $H$ 比 $\\mathbb{R}^{${n}}$ 小：$H$ 的基张成 $H$，含 $${k}$ 个向量。`,
          ],
          [
            wrong[2]!.en,
            "Entries may be zero, and being independent in pairs is weaker than a linearly independent set. Spanning is also left out.",
            "分量可以为零，两两无关也弱于整个集合线性无关，而且这里还漏了张成的条件。",
          ],
        ]);
      },
    },
    {
      id: "extract-basis-from-spanning-set",
      title: t("Extracting a basis from a spanning set", "从张成向量组中提取基"),
      explanation: t(
        "To find a basis for $W = \\operatorname{Span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$, form the matrix with these vectors as columns and row reduce. The original vectors in the pivot columns form a basis for $W$. For example, for $(1, 1, 0)$, $(2, 2, 0)$, $(0, 1, 1)$ the pivots fall in columns 1 and 3, so $\\{(1, 1, 0), (0, 1, 1)\\}$ is a basis.\n\n> **Watch out.** Dropping a vector is safe only when it is a combination of the vectors kept; otherwise the span shrinks.",
        "求 $W = \\operatorname{Span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ 的基，将这些向量作为列构成矩阵并进行行化简，主元所在的原列向量即构成 $W$ 的一组基。例如对 $(1, 1, 0)$、$(2, 2, 0)$、$(0, 1, 1)$，主元在第 1 列和第 3 列，所以 $\\{(1, 1, 0), (0, 1, 1)\\}$ 是一组基。\n\n> **注意。** 只有当一个向量是保留下来的向量的组合时，去掉它才是安全的；否则张成空间会变小。",
      ),
      generate(rng) {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.pick([-3, -2, 2, 3]);
        const p = [1, 0, a];
        const q = [0, 1, b];
        const [u, w] = rng.bool() ? [p, q] : [q, p];
        // Two of the vectors are parallel (u and cu); the pivot columns keep the earlier of the two and the third vector w.
        const vectors = rng.shuffle([
          { v: u, kind: "u" },
          { v: u.map((x) => c * x), kind: "cu" },
          { v: w, kind: "w" },
        ]);
        const pos = (kind: string) => vectors.findIndex((x) => x.kind === kind) + 1;
        const [i, j] = [pos("u"), pos("cu")].sort((m, n) => m - n) as [number, number];
        const k = pos("w");
        const ratio = pos("u") < pos("cu") ? Q.of(c) : Q.of(1, c);
        const v = (n: number) => `\\mathbf{v}_{${n}}`;
        const set = (ns: number[]) =>
          `$\\{${[...ns]
            .sort((m, n) => m - n)
            .map(v)
            .join(", ")}\\}$`;
        const span = vectors.map((x, n) => `${v(n + 1)} = ${colVecLatex(x.v)}`).join(", ");
        const prompt = t(
          `Find a basis for the subspace $W = \\text{Span}\\left\\{ ${span} \\right\\}$.`,
          `求子空间 $W = \\text{Span}\\left\\{ ${span} \\right\\}$ 的一组基。`,
        );
        const right = set([i, k]);
        const wrong = [set([i, j]), set([1, 2, 3]), set([k])];
        const pivots = [i, k].sort((m, n) => m - n).join(", ");
        const relation = `${v(j)} = ${ratio.toLatex()}${v(i)}`;
        const solution = walked(
          [
            [
              ["Spot the parallel pair", "找出平行的一对"],
              t("Comparing entries shows one vector is a multiple of an earlier one:", "比较分量可见有一个向量是前面某个向量的倍数："),
              [`${colVecLatex(vectors[j - 1]!.v)} = ${ratio.toLatex()} ${colVecLatex(vectors[i - 1]!.v)}`],
            ],
            [
              ["Keep the pivot columns", "保留主元列"],
              t(
                `Row reducing $[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\; \\mathbf{v}_3]$ gives pivots in columns ${pivots}; column ${j} has none, since $${relation}$.`,
                `对 $[\\mathbf{v}_1 \\; \\mathbf{v}_2 \\; \\mathbf{v}_3]$ 行化简，主元在第 ${pivots} 列；第 ${j} 列没有主元，因为 $${relation}$。`,
              ),
            ],
          ],
          t(
            `$${v(i)}$ and $${v(k)}$ are not multiples of each other, since one has a zero entry where the other does not, so ${right} is independent; it still spans $W$, because $${relation}$ is built from $${v(i)}$.`,
            `$${v(i)}$ 与 $${v(k)}$ 不互为倍数，因为一个在某处分量为零而另一个不为零，所以 ${right} 线性无关；它仍张成 $W$，因为 $${relation}$ 由 $${v(i)}$ 构成。`,
          ),
        );
        return reasoned(
          oneOf(
            rng,
            prompt,
            t(right, right),
            wrong.map((x) => t(x, x)),
            solution,
          ),
          [
            [
              wrong[0]!,
              `These two are dependent, since $${relation}$; together they span only a line.`,
              `这两个向量线性相关，因为 $${relation}$；它们只张成一条直线。`,
            ],
            [
              wrong[1]!,
              `This spans $W$ but is dependent, since $${relation}$, so it has a redundant vector.`,
              `它张成 $W$ 但线性相关，因为 $${relation}$，所以含有多余的向量。`,
            ],
            [
              wrong[2]!,
              `One vector spans only a line, and $${v(i)}$ is not a multiple of $${v(k)}$.`,
              `一个向量只张成一条直线，而 $${v(i)}$ 不是 $${v(k)}$ 的倍数。`,
            ],
          ],
        );
      },
    },
  ],
};

/** findingABasisOfTheColumnSpaceOfAMatrix covers pivot column method for Col(A) and selecting columns of original matrix. */
export const findingABasisOfTheColumnSpaceOfAMatrix: TopicDef = {
  id: "finding-a-basis-of-the-column-space-of-a-matrix",
  title: t("Finding a Basis of the Column Space of a Matrix", "求矩阵列空间的基"),
  summary: t(
    "Locate the pivot columns of the row echelon form of A, and select the corresponding columns of the original matrix A to form a basis for Col(A).",
    "通过矩阵阶梯形确定主元列，并选取原矩阵 A 中对应的主元列构成 Col(A) 的基。",
  ),
  intro: t(
    "Let $A$ have columns $\\mathbf{a}_1 = (1, 2, 1)$, $\\mathbf{a}_2 = (2, 4, 2)$, $\\mathbf{a}_3 = (0, 1, 3)$. Subtracting twice row 1 from row 2 and row 1 from row 3 gives rows $(1, 2, 0)$, $(0, 0, 1)$, $(0, 0, 3)$, so the pivots are in columns 1 and 3. A basis of $\\operatorname{Col}(A)$ is $\\{(1, 2, 1), (0, 1, 3)\\}$, taken from $A$ itself.\n\nCheck: the missing column is a combination of the kept ones, $\\mathbf{a}_2 = 2\\mathbf{a}_1 + 0\\mathbf{a}_3$, since $(2, 4, 2) = 2(1, 2, 1)$.\n\nIn this lesson we find a basis of a column space by reading the pivot columns from the echelon form and taking those columns of the original matrix.",
    "设 $A$ 的列为 $\\mathbf{a}_1 = (1, 2, 1)$、$\\mathbf{a}_2 = (2, 4, 2)$、$\\mathbf{a}_3 = (0, 1, 3)$。第 2 行减去第 1 行的 2 倍，第 3 行减去第 1 行，得到行 $(1, 2, 0)$、$(0, 0, 1)$、$(0, 0, 3)$，所以主元在第 1 列和第 3 列。$\\operatorname{Col}(A)$ 的一组基是 $\\{(1, 2, 1), (0, 1, 3)\\}$，取自 $A$ 本身。\n\n检验：缺少的那一列是保留列的组合，$\\mathbf{a}_2 = 2\\mathbf{a}_1 + 0\\mathbf{a}_3$，因为 $(2, 4, 2) = 2(1, 2, 1)$。\n\n本课我们从阶梯形读出主元列，再取原矩阵的这些列，得到列空间的基。",
  ),
  prerequisites: ["finding-a-basis-of-a-span", "the-column-space-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "basis-col-a-original-pivot-columns",
      title: t("Pivot columns of A form a basis for Col(A)", "原矩阵的主元列构成 Col(A) 的基"),
      explanation: t(
        "Row operations preserve the linear dependence relations among the columns. The pivot columns of the original matrix $A$ (not of its echelon form) form a basis for $\\operatorname{Col}(A)$. For example, if $\\operatorname{RREF}(A)$ has third column $(2, -1, 0)$ and pivots in columns 1 and 2, then $\\mathbf{a}_3 = 2\\mathbf{a}_1 - \\mathbf{a}_2$, and $\\{\\mathbf{a}_1, \\mathbf{a}_2\\}$ is a basis.\n\n> **Watch out.** The pivot positions come from the echelon form, but the basis vectors come from $A$.",
        "初等行变换保持列向量之间的线性相关关系。原矩阵 $A$（而非其阶梯形）中的主元列构成 $\\operatorname{Col}(A)$ 的一组基。例如若 $\\operatorname{RREF}(A)$ 的第三列为 $(2, -1, 0)$，主元在第 1、2 列，则 $\\mathbf{a}_3 = 2\\mathbf{a}_1 - \\mathbf{a}_2$，$\\{\\mathbf{a}_1, \\mathbf{a}_2\\}$ 是一组基。\n\n> **注意。** 主元的位置从阶梯形读出，但基向量要取自 $A$。",
      ),
      generate(rng) {
        const k1 = rng.int(-2, 2);
        const k2 = rng.int(-2, 2);
        const mult = rng.nonZero(-2, 2);
        const col1 = [mult, 2 * mult, -mult];
        const col2 = [0, mult, 2 * mult];
        const col3 = [k1 * col1[0]! + k2 * col2[0]!, k1 * col1[1]! + k2 * col2[1]!, k1 * col1[2]! + k2 * col2[2]!];
        const A = [
          [col1[0]!, col2[0]!, col3[0]!],
          [col1[1]!, col2[1]!, col3[1]!],
          [col1[2]!, col2[2]!, col3[2]!],
        ];
        const prompt = t(
          `Given matrix $A = ${matLatex(A)}$, which has reduced row echelon form $\\text{RREF}(A) = \\begin{pmatrix} 1 & 0 & ${k1} \\\\ 0 & 1 & ${k2} \\\\ 0 & 0 & 0 \\end{pmatrix}$, find a basis for $\\text{Col}(A)$.`,
          `已知矩阵 $A = ${matLatex(A)}$，其简化行阶梯形为 $\\text{RREF}(A) = \\begin{pmatrix} 1 & 0 & ${k1} \\\\ 0 & 1 & ${k2} \\\\ 0 & 0 & 0 \\end{pmatrix}$，求 $\\text{Col}(A)$ 的一组基。`,
        );
        const right = t(
          `$\\left\\{ ${colVecLatex(col1)}, ${colVecLatex(col2)} \\right\\}$`,
          `$\\left\\{ ${colVecLatex(col1)}, ${colVecLatex(col2)} \\right\\}$`,
        );
        const wrong = [
          t(
            `$\\left\\{ ${colVecLatex([1, 0, 0])}, ${colVecLatex([0, 1, 0])} \\right\\}$`,
            `$\\left\\{ ${colVecLatex([1, 0, 0])}, ${colVecLatex([0, 1, 0])} \\right\\}$`,
          ),
          t(
            `$\\left\\{ ${colVecLatex(col1)}, ${colVecLatex(col2)}, ${colVecLatex(col3)} \\right\\}$`,
            `$\\left\\{ ${colVecLatex(col1)}, ${colVecLatex(col2)}, ${colVecLatex(col3)} \\right\\}$`,
          ),
          t(`$\\left\\{ ${colVecLatex(col3)} \\right\\}$`, `$\\left\\{ ${colVecLatex(col3)} \\right\\}$`),
        ];
        const relation = formatVectorComb([
          [k1, "\\mathbf{a}_1"],
          [k2, "\\mathbf{a}_2"],
        ]).replace(/^0$/, "\\mathbf{0}");
        const solution = walked(
          [
            [
              ["Read the pivots", "读出主元"],
              t(
                "$\\text{RREF}(A)$ has pivots in columns 1 and 2; column 3 has none.",
                "$\\text{RREF}(A)$ 的主元在第 1、2 列；第 3 列没有主元。",
              ),
            ],
            [
              ["Read the relation", "读出关系"],
              t(
                `Column 3 of the RREF is $(${k1}, ${k2}, 0)$, and row operations keep column relations, so in $A$:`,
                `RREF 的第 3 列为 $(${k1}, ${k2}, 0)$，而行变换保持列之间的关系，所以在 $A$ 中：`,
              ),
              [`\\mathbf{a}_3 = ${relation}`],
            ],
            [
              ["Take columns of A", "取 A 的列"],
              t(
                `The basis is columns 1 and 2 of $A$: $\\{${colVecLatex(col1)}, ${colVecLatex(col2)}\\}$.`,
                `基是 $A$ 的第 1、2 列：$\\{${colVecLatex(col1)}, ${colVecLatex(col2)}\\}$。`,
              ),
            ],
          ],
          t(
            `Entry by entry, ${k1} times column 1 plus ${paren(k2)} times column 2 gives $(${col3.join(", ")})$, which is column 3 of $A$.`,
            `逐个分量看，第 1 列的 ${k1} 倍加第 2 列的 ${paren(k2)} 倍得到 $(${col3.join(", ")})$，正是 $A$ 的第 3 列。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "These are the pivot columns of the RREF; row operations changed the column space, so they need not lie in $\\text{Col}(A)$.",
            "这是 RREF 的主元列；行变换改变了列空间，它们不一定在 $\\text{Col}(A)$ 中。",
          ],
          [
            wrong[1]!.en,
            `Column 3 is a combination of the first two, $\\mathbf{a}_3 = ${relation}$, so this set is dependent.`,
            `第 3 列是前两列的组合，$\\mathbf{a}_3 = ${relation}$，所以这个组线性相关。`,
          ],
          [
            wrong[2]!.en,
            "Column 3 is not a pivot column, and one vector cannot span a column space of dimension $2$.",
            "第 3 列不是主元列，而且一个向量张成不了 $2$ 维的列空间。",
          ],
        ]);
      },
    },
    {
      id: "why-original-columns-not-echelon",
      title: t("Why original columns must be used for Col(A)", "为什么必须使用原矩阵的列向量"),
      explanation: t(
        "Row operations change the column space of a matrix: in general $\\operatorname{Col}(A) \\ne \\operatorname{Col}(\\operatorname{RREF}(A))$, although their dimensions and column dependence relations are the same. For example, $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$ reduces to $R = \\begin{pmatrix} 1 & 2 \\\\ 0 & 0 \\end{pmatrix}$; $\\operatorname{Col}(A)$ is the line through $(1, 2)$, while $\\operatorname{Col}(R)$ is the line through $(1, 0)$.\n\n> **Watch out.** Row operations keep the null space, the rank and the column relations, but not the column space itself.",
        "初等行变换通常会改变矩阵的列空间：一般情况下 $\\operatorname{Col}(A) \\ne \\operatorname{Col}(\\operatorname{RREF}(A))$，尽管两者的维数与列相关关系完全相同。例如 $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$ 化简为 $R = \\begin{pmatrix} 1 & 2 \\\\ 0 & 0 \\end{pmatrix}$；$\\operatorname{Col}(A)$ 是过 $(1, 2)$ 的直线，而 $\\operatorname{Col}(R)$ 是过 $(1, 0)$ 的直线。\n\n> **注意。** 行变换保持零空间、秩和列之间的关系，但不保持列空间本身。",
      ),
      generate(rng) {
        const m = rng.int(3, 8);
        const n = rng.int(3, 8);
        const prompt = t(
          `For ${article(m)} $${m} \\times ${n}$ matrix $A$ and its echelon form $R$, why must we select pivot columns of the original matrix $A$ (instead of the columns of $R$) to form a basis for $\\text{Col}(A)$?`,
          `对于 $${m} \\times ${n}$ 矩阵 $A$ 及其阶梯形 $R$，在求 $\\text{Col}(A)$ 的基时，为什么必须选取原矩阵 $A$ 的主元列（而不是 $R$ 的列）？`,
        );
        const right = t(
          `Row operations generally change the column space, so $\\text{Col}(A) \\neq \\text{Col}(R)$ in general`,
          `初等行变换通常会改变列空间，因此通常 $\\text{Col}(A) \\neq \\text{Col}(R)$`,
        );
        const wrong = [
          t(
            `Row operations change the null space, so $\\text{Null}(A) \\neq \\text{Null}(R)$`,
            `初等行变换会改变零空间，因此 $\\text{Null}(A) \\neq \\text{Null}(R)$`,
          ),
          t(`The columns of $R$ are never linearly independent`, `矩阵 $R$ 的列向量永远线性相关`),
          t(`The dimensions of $\\text{Col}(A)$ and $\\text{Col}(R)$ are different`, `$\\text{Col}(A)$ 与 $\\text{Col}(R)$ 的维数不同`),
        ];
        const solution = walked(
          [
            [
              ["What row operations keep", "行变换保持什么"],
              t(
                "$A\\mathbf{x} = \\mathbf{0}$ and $R\\mathbf{x} = \\mathbf{0}$ have the same solutions, so the null space and every relation among the columns are kept, and with them the positions of the pivot columns.",
                "$A\\mathbf{x} = \\mathbf{0}$ 与 $R\\mathbf{x} = \\mathbf{0}$ 同解，所以零空间与列之间的每个关系都保持不变，主元列的位置也随之不变。",
              ),
            ],
            [
              ["What they change", "行变换改变什么"],
              t(
                "Mixing rows changes the entries of each column, so the columns of $R$ can span a different subspace: an echelon form with a zero last row has every column ending in $0$.",
                "行之间的运算改变了每一列的分量，所以 $R$ 的列可能张成另一个子空间：最后一行为零的阶梯形，其每一列的最后一个分量都是 $0$。",
              ),
            ],
          ],
          t(
            "For $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$ and $R = \\begin{pmatrix} 1 & 2 \\\\ 0 & 0 \\end{pmatrix}$, the vector $(1, 2)$ is in $\\text{Col}(A)$ but not in $\\text{Col}(R)$, so the basis must come from the columns of $A$.",
            "对 $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$ 与 $R = \\begin{pmatrix} 1 & 2 \\\\ 0 & 0 \\end{pmatrix}$，向量 $(1, 2)$ 在 $\\text{Col}(A)$ 中但不在 $\\text{Col}(R)$ 中，所以基必须取自 $A$ 的列。",
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [wrong[0]!.en, "Row operations keep the null space, so this is false.", "行变换保持零空间不变，所以这句话不对。"],
          [wrong[1]!.en, "The pivot columns of $R$ are linearly independent, so this is false.", "$R$ 的主元列线性无关，所以这句话不对。"],
          [
            wrong[2]!.en,
            "Row operations keep the rank, so the two dimensions are equal. It is the spaces that differ.",
            "行变换保持秩不变，所以两者维数相等。不同的是空间本身。",
          ],
        ]);
      },
    },
  ],
};

/** findingABasisOfTheNullSpaceOfAMatrix covers solving Ax = 0, parametric vector form, and reading off basis vectors. */
export const findingABasisOfTheNullSpaceOfAMatrix: TopicDef = {
  id: "finding-a-basis-of-the-null-space-of-a-matrix",
  title: t("Finding a Basis of the Null Space of a Matrix", "求矩阵零空间的基"),
  summary: t(
    "Express the general solution of Ax = 0 in parametric vector form and extract the vectors attached to each free variable to form a basis of Null(A).",
    "将 Ax = 0 的通解写成参数向量形式，提取每个自由未知量对应的向量构成 Null(A) 的一组基。",
  ),
  intro: t(
    "Suppose $\\operatorname{RREF}(A) = \\begin{pmatrix} 1 & 0 & -2 \\\\ 0 & 1 & 3 \\end{pmatrix}$. The equations are $x_1 - 2x_3 = 0$ and $x_2 + 3x_3 = 0$, with $x_3$ free, so $x_1 = 2x_3$, $x_2 = -3x_3$ and $\\mathbf{x} = x_3(2, -3, 1)$. A basis of $\\operatorname{Null}(A)$ is $\\{(2, -3, 1)\\}$.\n\nCheck: row 1 gives $2 - 2 = 0$ and row 2 gives $-3 + 3 = 0$.\n\nIn this lesson we write the solutions of $A\\mathbf{x} = \\mathbf{0}$ in parametric vector form and read off one basis vector for each free variable.",
    "设 $\\operatorname{RREF}(A) = \\begin{pmatrix} 1 & 0 & -2 \\\\ 0 & 1 & 3 \\end{pmatrix}$。方程为 $x_1 - 2x_3 = 0$ 与 $x_2 + 3x_3 = 0$，$x_3$ 为自由变量，所以 $x_1 = 2x_3$，$x_2 = -3x_3$，$\\mathbf{x} = x_3(2, -3, 1)$。$\\operatorname{Null}(A)$ 的一组基是 $\\{(2, -3, 1)\\}$。\n\n检验：第 1 行给出 $2 - 2 = 0$，第 2 行给出 $-3 + 3 = 0$。\n\n本课我们把 $A\\mathbf{x} = \\mathbf{0}$ 的解写成参数向量形式，并为每个自由变量读出一个基向量。",
  ),
  prerequisites: ["the-null-space-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "basis-null-space-single-free-var",
      title: t("Basis of Null(A) with one free variable", "含一个自由变量的 Null(A) 的基"),
      explanation: t(
        "For $A\\mathbf{x} = \\mathbf{0}$ with one free variable $x_3$, writing the basic variables in terms of $x_3$ gives $\\mathbf{x} = x_3 \\mathbf{v}$. The single vector $\\mathbf{v}$ forms a basis for $\\operatorname{Null}(A)$. For example, rows $(1, 0, 4)$ and $(0, 1, -1)$ give $x_1 = -4x_3$ and $x_2 = x_3$, so the basis is $\\{(-4, 1, 1)\\}$.\n\n> **Watch out.** The entries in the last column change sign when moved across the equals sign, and the free variable's own entry is $1$.",
        "对于只含一个自由未知量 $x_3$ 的齐次方程组 $A\\mathbf{x} = \\mathbf{0}$，将主元未知量用 $x_3$ 表示，得到 $\\mathbf{x} = x_3 \\mathbf{v}$。向量 $\\mathbf{v}$ 即构成 $\\operatorname{Null}(A)$ 的一组基。例如行为 $(1, 0, 4)$ 与 $(0, 1, -1)$ 时，$x_1 = -4x_3$，$x_2 = x_3$，所以基为 $\\{(-4, 1, 1)\\}$。\n\n> **注意。** 最后一列的元素移到等号另一边时要变号，而自由变量自己对应的分量是 $1$。",
      ),
      generate(rng) {
        const c1 = rng.nonZero(-3, 3);
        const c2 = rng.nonZero(-3, 3);
        const rref = [
          [1, 0, c1],
          [0, 1, c2],
        ];
        const basisVec = [-c1, -c2, 1];
        const prompt = t(
          `A matrix $A$ has reduced row echelon form $\\text{RREF}(A) = ${matLatex(rref)}$. Find a basis for $\\text{Null}(A)$.`,
          `矩阵 $A$ 的简化行阶梯形为 $\\text{RREF}(A) = ${matLatex(rref)}$。求 $\\text{Null}(A)$ 的一组基。`,
        );
        const right = t(`$\\left\\{ ${colVecLatex(basisVec)} \\right\\}$`, `$\\left\\{ ${colVecLatex(basisVec)} \\right\\}$`);
        const wrong = [
          t(`$\\left\\{ ${colVecLatex([c1, c2, 1])} \\right\\}$`, `$\\left\\{ ${colVecLatex([c1, c2, 1])} \\right\\}$`),
          t(`$\\left\\{ ${colVecLatex([-c1, -c2, 0])} \\right\\}$`, `$\\left\\{ ${colVecLatex([-c1, -c2, 0])} \\right\\}$`),
          t(
            `$\\left\\{ ${colVecLatex([1, 0, 0])}, ${colVecLatex([0, 1, 0])} \\right\\}$`,
            `$\\left\\{ ${colVecLatex([1, 0, 0])}, ${colVecLatex([0, 1, 0])} \\right\\}$`,
          ),
        ];
        const eq1 = formatLinearExpr([
          [1, "x_1"],
          [c1, "x_3"],
        ]);
        const eq2 = formatLinearExpr([
          [1, "x_2"],
          [c2, "x_3"],
        ]);
        const x1Expr = formatLinearTerm(-c1, "x_3");
        const x2Expr = formatLinearTerm(-c2, "x_3");
        const solution = walked(
          [
            [
              ["Write the equations", "写出方程"],
              t(
                "Each nonzero row of the RREF is an equation; $x_3$ has no pivot, so it is free:",
                "RREF 的每个非零行是一个方程；$x_3$ 没有主元，是自由变量：",
              ),
              [`${eq1} = 0`, `${eq2} = 0`],
            ],
            [["Solve for the basic variables", "解出主元变量"], t("", ""), [`x_1 = ${x1Expr}`, `x_2 = ${x2Expr}`]],
            [["Parametric vector form", "参数向量形式"], t("", ""), [`\\mathbf{x} = x_3 ${colVecLatex(basisVec)}`]],
          ],
          t(
            `Row 1 times $${colVecLatex(basisVec)}$ gives $${-c1} + ${paren(c1)} = 0$ and row 2 gives $${-c2} + ${paren(c2)} = 0$, so $\\{${colVecLatex(basisVec)}\\}$ is a basis.`,
            `第 1 行乘 $${colVecLatex(basisVec)}$ 得 $${-c1} + ${paren(c1)} = 0$，第 2 行得 $${-c2} + ${paren(c2)} = 0$，所以 $\\{${colVecLatex(basisVec)}\\}$ 是一组基。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The signs are wrong: moving the $x_3$ terms across the equals sign changes their signs.",
            "符号错了：把 $x_3$ 项移到等号另一边，符号要改变。",
          ],
          [
            wrong[1]!.en,
            "The free variable must be $1$ here: this sets $x_3 = 0$ yet keeps entries that came from $x_3 = 1$.",
            "这里自由变量应取 $1$：这个向量取 $x_3 = 0$，却保留了由 $x_3 = 1$ 得到的分量。",
          ],
          [
            wrong[2]!.en,
            "These vectors do not solve the system: each has a nonzero pivot variable while $x_3 = 0$.",
            "这些向量不满足方程组：每个的主变量都不为零，而 $x_3 = 0$。",
          ],
        ]);
      },
    },
    {
      id: "basis-null-space-multiple-free-vars",
      title: t("Basis of Null(A) with two free variables", "含两个自由变量的 Null(A) 的基"),
      explanation: t(
        "Each free variable contributes one vector, found by setting that variable to one and the other free variables to zero, and these vectors are automatically independent. With $k$ free variables, the parametric vector form is $\\mathbf{x} = s_1 \\mathbf{v}_1 + \\dots + s_k \\mathbf{v}_k$. The vectors $\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ form a basis for $\\operatorname{Null}(A)$. For example, the single row $(1, 2, -3)$ gives $x_1 = -2x_2 + 3x_3$, so the basis is $\\{(-2, 1, 0), (3, 0, 1)\\}$.\n\n> **Watch out.** Count the free variables first: the basis needs exactly one vector for each, no more and no fewer.",
        "每个自由变量贡献一个向量，方法是令该变量为 1、其他自由变量为 0，这些向量自然是线性无关的。有 $k$ 个自由未知量时，通解的参数向量形式为 $\\mathbf{x} = s_1 \\mathbf{v}_1 + \\dots + s_k \\mathbf{v}_k$。向量组 $\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ 即构成 $\\operatorname{Null}(A)$ 的一组基。例如只有一行 $(1, 2, -3)$ 时，$x_1 = -2x_2 + 3x_3$，所以基为 $\\{(-2, 1, 0), (3, 0, 1)\\}$。\n\n> **注意。** 先数自由变量：基恰好需要每个自由变量一个向量，不多也不少。",
      ),
      generate(rng) {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-2, 2);
        const rref = [
          [1, a, 0, b],
          [0, 0, 1, c],
        ];
        const v1 = [-a, 1, 0, 0];
        const v2 = [-b, 0, -c, 1];
        const prompt = t(
          `Find a basis for $\\text{Null}(A)$ if $\\text{RREF}(A) = ${matLatex(rref)}$.`,
          `若 $\\text{RREF}(A) = ${matLatex(rref)}$，求 $\\text{Null}(A)$ 的一组基。`,
        );
        const right = t(
          `$\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)} \\right\\}$`,
          `$\\left\\{ ${colVecLatex(v1)}, ${colVecLatex(v2)} \\right\\}$`,
        );
        const wrong = [
          t(
            `$\\left\\{ ${colVecLatex([a, 1, 0, 0])}, ${colVecLatex([b, 0, c, 1])} \\right\\}$`,
            `$\\left\\{ ${colVecLatex([a, 1, 0, 0])}, ${colVecLatex([b, 0, c, 1])} \\right\\}$`,
          ),
          t(
            `$\\left\\{ ${colVecLatex([1, a, 0, b])}, ${colVecLatex([0, 0, 1, c])} \\right\\}$`,
            `$\\left\\{ ${colVecLatex([1, a, 0, b])}, ${colVecLatex([0, 0, 1, c])} \\right\\}$`,
          ),
          t(`$\\left\\{ ${colVecLatex(v1)} \\right\\}$`, `$\\left\\{ ${colVecLatex(v1)} \\right\\}$`),
        ];
        const x1Expr = formatLinearExpr([
          [-a, "x_2"],
          [-b, "x_4"],
        ]);
        const x3Expr = formatLinearTerm(-c, "x_4");
        const solution = walked(
          [
            [
              ["Find the free variables", "找出自由变量"],
              t(
                "The pivots are in columns 1 and 3, so $x_1, x_3$ are basic and $x_2, x_4$ are free.",
                "主元在第 1、3 列，所以 $x_1, x_3$ 是主元变量，$x_2, x_4$ 是自由变量。",
              ),
            ],
            [["Solve for the basic variables", "解出主元变量"], t("", ""), [`x_1 = ${x1Expr}`, `x_3 = ${x3Expr}`]],
            [["Parametric vector form", "参数向量形式"], t("", ""), [`\\mathbf{x} = x_2 ${colVecLatex(v1)} + x_4 ${colVecLatex(v2)}`]],
          ],
          t(
            `Row 1 times the second vector gives $${-b} + ${paren(b)} = 0$, and row 2 gives $${-c} + ${paren(c)} = 0$; the first vector is checked the same way, and the two are independent, since only the second has a nonzero fourth entry.`,
            `第 1 行乘第二个向量得 $${-b} + ${paren(b)} = 0$，第 2 行得 $${-c} + ${paren(c)} = 0$；第一个向量同样可验证，而且两个向量线性无关，因为只有第二个的第四个分量不为零。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The signs are wrong: moving the free-variable terms across the equals sign changes their signs.",
            "符号错了：把自由变量的项移到等号另一边，符号要改变。",
          ],
          [
            wrong[1]!.en,
            "These are the rows of the RREF, which are not solutions of $A\\mathbf{x} = \\mathbf{0}$.",
            "这是 RREF 的行，它们不是 $A\\mathbf{x} = \\mathbf{0}$ 的解。",
          ],
          [
            wrong[2]!.en,
            "There are two free variables, so the basis needs two vectors; this one misses the $x_4$ direction.",
            "有两个自由变量，所以基需要两个向量；这里漏掉了 $x_4$ 方向。",
          ],
        ]);
      },
    },
  ],
};

/** expressingTheCoordinatesOfAVectorInAGivenBasis covers finding [x]_B and reconstructing x from [x]_B. */
export const expressingTheCoordinatesOfAVectorInAGivenBasis: TopicDef = {
  id: "expressing-the-coordinates-of-a-vector-in-a-given-basis",
  title: t("Expressing the Coordinates of a Vector in a Given Basis", "向量在给定基下的坐标"),
  summary: t(
    "Calculate the coordinate vector $[\\mathbf{x}]_{\\mathcal{B}}$ of a vector $\\mathbf{x}$ relative to an ordered basis $\\mathcal{B}$, and reconstruct $\\mathbf{x}$ from its coordinates.",
    "计算向量 $\\mathbf{x}$ 在有序基 $\\mathcal{B}$ 下的坐标向量 $[\\mathbf{x}]_{\\mathcal{B}}$，并根据坐标向量还原向量 $\\mathbf{x}$。",
  ),
  intro: t(
    "Let $\\mathcal{B} = \\{(1, 1), (0, 1)\\}$ and $\\mathbf{x} = (3, 5)$. We want $c_1(1, 1) + c_2(0, 1) = (3, 5)$. The first entry gives $c_1 = 3$, and the second gives $3 + c_2 = 5$, so $c_2 = 2$ and $[\\mathbf{x}]_{\\mathcal{B}} = (3, 2)$.\n\nCheck: $3(1, 1) + 2(0, 1) = (3, 3 + 2) = (3, 5) = \\mathbf{x}$.\n\nIn this lesson we find the coordinates of a vector in a basis by solving for the weights, and rebuild a vector from its coordinates.",
    "设 $\\mathcal{B} = \\{(1, 1), (0, 1)\\}$，$\\mathbf{x} = (3, 5)$。我们要求 $c_1(1, 1) + c_2(0, 1) = (3, 5)$。第一个分量给出 $c_1 = 3$，第二个分量给出 $3 + c_2 = 5$，所以 $c_2 = 2$，$[\\mathbf{x}]_{\\mathcal{B}} = (3, 2)$。\n\n检验：$3(1, 1) + 2(0, 1) = (3, 3 + 2) = (3, 5) = \\mathbf{x}$。\n\n本课我们通过求权重得到向量在一组基下的坐标，并由坐标还原向量。",
  ),
  prerequisites: ["finding-a-basis-of-a-span"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "find-coordinates-2d-basis",
      title: t(
        "Finding the coordinate vector $[\\mathbf{x}]_{\\mathcal{B}}$ in $\\mathbb{R}^2$",
        "在 $\\mathbb{R}^2$ 中求坐标向量 $[\\mathbf{x}]_{\\mathcal{B}}$",
      ),
      explanation: t(
        "Finding coordinates means finding the weights that build the vector from the basis vectors, which is a small linear system to solve. If $\\mathcal{B} = \\{\\mathbf{b}_1, \\mathbf{b}_2\\}$ is a basis of $\\mathbb{R}^2$, the coordinates $c_1, c_2$ of $\\mathbf{x}$ satisfy $c_1\\mathbf{b}_1 + c_2\\mathbf{b}_2 = \\mathbf{x}$, written $[\\mathbf{x}]_{\\mathcal{B}} = (c_1, c_2)^T$. For example, with $\\mathcal{B} = \\{(1, 1), (0, 1)\\}$, the vector $(3, 5)$ has coordinates $(3, 2)$, since $3(1, 1) + 2(0, 1) = (3, 5)$.\n\n> **Watch out.** The coordinates are weights on the basis vectors, not the entries of $\\mathbf{x}$, and their order follows the order of the basis.",
        "求坐标就是求出用基向量构造该向量所需的权重，这是一个需要求解的小型线性方程组。若 $\\mathcal{B} = \\{\\mathbf{b}_1, \\mathbf{b}_2\\}$ 是 $\\mathbb{R}^2$ 的一组基，则 $\\mathbf{x}$ 在基 $\\mathcal{B}$ 下的坐标 $c_1, c_2$ 满足 $c_1\\mathbf{b}_1 + c_2\\mathbf{b}_2 = \\mathbf{x}$，记作 $[\\mathbf{x}]_{\\mathcal{B}} = (c_1, c_2)^T$。例如 $\\mathcal{B} = \\{(1, 1), (0, 1)\\}$ 时，向量 $(3, 5)$ 的坐标为 $(3, 2)$，因为 $3(1, 1) + 2(0, 1) = (3, 5)$。\n\n> **注意。** 坐标是基向量的权重，不是 $\\mathbf{x}$ 的分量，其顺序跟随基中向量的顺序。",
      ),
      generate(rng) {
        const c1 = rng.int(-4, 4);
        const c2 = rng.int(-4, 4);
        const b1 = [1, rng.int(-2, 2)];
        const b2 = [0, rng.pick([-1, 1])];
        const x = [c1 * b1[0]! + c2 * b2[0]!, c1 * b1[1]! + c2 * b2[1]!];
        const prompt = t(
          `Let $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ be a basis for $\\mathbb{R}^2$. Find the coordinate vector $[\\mathbf{x}]_{\\mathcal{B}}$ of $\\mathbf{x} = ${colVecLatex(x)}$. Enter the vector as $\\langle c_1, c_2 \\rangle$.`,
          `设 $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ 为 $\\mathbb{R}^2$ 的一组基。求向量 $\\mathbf{x} = ${colVecLatex(x)}$ 在基 $\\mathcal{B}$ 下的坐标向量 $[\\mathbf{x}]_{\\mathcal{B}}$。以 $\\langle c_1, c_2 \\rangle$ 的形式输入结果。`,
        );
        const second = formatLinearExpr([
          [b1[1]!, "c_1"],
          [b2[1]!, "c_2"],
        ]);
        return withMistakes(
          pointProblem({
            prompt,
            answer: [c1, c2],
            vars: ["c_1", "c_2"],
            vector: true,
            solution: walked(
              [
                [
                  ["Set up the system", "列出方程组"],
                  t(
                    "Write $c_1\\mathbf{b}_1 + c_2\\mathbf{b}_2 = \\mathbf{x}$ entry by entry:",
                    "把 $c_1\\mathbf{b}_1 + c_2\\mathbf{b}_2 = \\mathbf{x}$ 逐个分量写出：",
                  ),
                  [`c_1 = ${x[0]}`, `${second} = ${x[1]}`],
                ],
                [
                  ["Solve for $c_2$", "解出 $c_2$"],
                  t("Put $c_1$ into the second equation:", "把 $c_1$ 代入第二个方程："),
                  [`${b1[1]} \\cdot ${paren(c1)} + ${paren(b2[1]!)}c_2 = ${x[1]}`, `c_2 = ${c2}`],
                ],
              ],
              t(
                `$${c1}${colVecLatex(b1)} + ${paren(c2)}${colVecLatex(b2)} = ${colVecLatex(x)}$, so $[\\mathbf{x}]_{\\mathcal{B}} = \\langle ${c1}, ${c2} \\rangle$.`,
                `$${c1}${colVecLatex(b1)} + ${paren(c2)}${colVecLatex(b2)} = ${colVecLatex(x)}$，所以 $[\\mathbf{x}]_{\\mathcal{B}} = \\langle ${c1}, ${c2} \\rangle$。`,
              ),
            ),
          }),
          dedupeSaid(
            [
              say(
                vectorLatex(x),
                "These are the entries of $\\mathbf{x}$ itself; the coordinates are the weights on $\\mathbf{b}_1$ and $\\mathbf{b}_2$.",
                "这是 $\\mathbf{x}$ 本身的分量；坐标是 $\\mathbf{b}_1$ 与 $\\mathbf{b}_2$ 的权重。",
              ),
              say(
                vectorLatex([c2, c1]),
                "The order is swapped: the first coordinate goes with $\\mathbf{b}_1$.",
                "顺序反了：第一个坐标对应 $\\mathbf{b}_1$。",
              ),
              say(
                vectorLatex([c1, b2[1]! * x[1]!]),
                `The second equation also has the term $${formatLinearExpr([[b1[1]!, "c_1"]])}$ from $c_1\\mathbf{b}_1$; it must be moved over before solving.`,
                `第二个方程里还有来自 $c_1\\mathbf{b}_1$ 的项 $${formatLinearExpr([[b1[1]!, "c_1"]])}$；求解前要先移项。`,
              ),
              say(
                vectorLatex([c1, -c2]),
                "The sign of $c_2$ is wrong; recheck the division by the second entry of $\\mathbf{b}_2$.",
                "$c_2$ 的符号错了；请重新检查除以 $\\mathbf{b}_2$ 第二个分量的那一步。",
              ),
            ],
            vectorLatex([c1, c2]),
          ),
        );
      },
    },
    {
      id: "reconstruct-vector-from-coordinates",
      title: t("Reconstructing a vector from its coordinate vector", "根据坐标向量还原向量"),
      explanation: t(
        "Coordinates are the weights of the basis vectors, so multiply each basis vector by its coordinate and add the results. Given $[\\mathbf{x}]_{\\mathcal{B}} = (c_1, \\dots, c_n)^T$ and the basis $\\mathcal{B} = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_n\\}$, the vector is $\\mathbf{x} = c_1\\mathbf{b}_1 + \\dots + c_n\\mathbf{b}_n$. For example, with $\\mathbf{b}_1 = (1, 0, 1)$, $\\mathbf{b}_2 = (0, 1, 1)$ and $[\\mathbf{x}]_{\\mathcal{B}} = (2, -1)$, we get $\\mathbf{x} = (2, 0, 2) + (0, -1, -1) = (2, -1, 1)$.\n\n> **Watch out.** The coordinate vector is not the vector itself unless the basis is the standard one.",
        "坐标就是基向量的权重，所以把每个基向量乘以对应的坐标，再把结果相加。已知 $[\\mathbf{x}]_{\\mathcal{B}} = (c_1, \\dots, c_n)^T$ 与基 $\\mathcal{B} = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_n\\}$，该向量可通过线性组合还原：$\\mathbf{x} = c_1\\mathbf{b}_1 + \\dots + c_n\\mathbf{b}_n$。例如 $\\mathbf{b}_1 = (1, 0, 1)$、$\\mathbf{b}_2 = (0, 1, 1)$、$[\\mathbf{x}]_{\\mathcal{B}} = (2, -1)$ 时，$\\mathbf{x} = (2, 0, 2) + (0, -1, -1) = (2, -1, 1)$。\n\n> **注意。** 除非是标准基，坐标向量并不是向量本身。",
      ),
      generate(rng) {
        const c1 = rng.int(-3, 3);
        const c2 = rng.int(-3, 3);
        const c3 = rng.int(-3, 3);
        const b1 = [1, 0, rng.int(-2, 2)];
        const b2 = [0, 1, rng.int(-2, 2)];
        const b3 = [0, 0, 1];
        const x = [
          c1 * b1[0]! + c2 * b2[0]! + c3 * b3[0]!,
          c1 * b1[1]! + c2 * b2[1]! + c3 * b3[1]!,
          c1 * b1[2]! + c2 * b2[2]! + c3 * b3[2]!,
        ];
        const coords = [c1, c2, c3];
        const prompt = t(
          `In $\\mathbb{R}^3$, relative to the basis $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)}, ${colVecLatex(b3)} \\right\\}$, a vector has coordinates $[\\mathbf{x}]_{\\mathcal{B}} = ${colVecLatex(coords)}$. Find $\\mathbf{x}$ in standard coordinates. Enter the vector as $\\langle x_1, x_2, x_3 \\rangle$.`,
          `在 $\\mathbb{R}^3$ 中，设基为 $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)}, ${colVecLatex(b3)} \\right\\}$，某向量在基 $\\mathcal{B}$ 下的坐标为 $[\\mathbf{x}]_{\\mathcal{B}} = ${colVecLatex(coords)}$。求 $\\mathbf{x}$ 在标准坐标系下的向量。以 $\\langle x_1, x_2, x_3 \\rangle$ 的形式输入结果。`,
        );
        const scaled = [b1, b2, b3].map((b, i) => colVecLatex(b.map((e) => coords[i]! * e)));
        return withMistakes(
          pointProblem({
            prompt,
            answer: x,
            vars: ["x_1", "x_2", "x_3"],
            vector: true,
            solution: walked(
              [
                [
                  ["Scale each basis vector", "数乘每个基向量"],
                  t("Multiply each basis vector by its coordinate:", "把每个基向量乘以对应的坐标："),
                  [`${c1}\\mathbf{b}_1 = ${scaled[0]}, \\quad ${c2}\\mathbf{b}_2 = ${scaled[1]}, \\quad ${c3}\\mathbf{b}_3 = ${scaled[2]}`],
                ],
                [["Add", "相加"], t("", ""), [`\\mathbf{x} = ${scaled.join(" + ")} = ${colVecLatex(x)}`]],
              ],
              t(
                `Only $\\mathbf{b}_1$ has a nonzero first entry and only $\\mathbf{b}_2$ a nonzero second entry, so $x_1 = ${c1}$ and $x_2 = ${c2}$, as found; the third entry is $${sumLatex([c1 * b1[2]!, c2 * b2[2]!, c3])} = ${x[2]}$.`,
                `只有 $\\mathbf{b}_1$ 的第一个分量不为零，只有 $\\mathbf{b}_2$ 的第二个分量不为零，所以 $x_1 = ${c1}$，$x_2 = ${c2}$，与所得相符；第三个分量为 $${sumLatex([c1 * b1[2]!, c2 * b2[2]!, c3])} = ${x[2]}$。`,
              ),
            ),
          }),
          dedupeSaid(
            [
              say(
                vectorLatex(coords),
                "These are the coordinates themselves; they must be used as weights on the basis vectors.",
                "这是坐标本身；它们要作为基向量的权重。",
              ),
              say(
                vectorLatex([x[0]!, x[1]!, x[2]! - c3]),
                "The third basis vector is left out; add $c_3\\mathbf{b}_3$ as well.",
                "漏掉了第三个基向量；还要加上 $c_3\\mathbf{b}_3$。",
              ),
              say(
                vectorLatex(x.map((e) => -e)),
                "Every sign is flipped; recheck the signs of the coordinates.",
                "每个符号都反了；请重新检查坐标的符号。",
              ),
            ],
            vectorLatex(x),
          ),
        );
      },
    },
  ],
};

/** writingVectorsInDifferentBases covers the change of basis matrix P_B and relation between standard and non-standard coordinates. */
export const writingVectorsInDifferentBases: TopicDef = {
  id: "writing-vectors-in-different-bases",
  title: t("Writing Vectors in Different Bases", "不同基下的向量坐标表示"),
  summary: t(
    "Relate standard coordinates to coordinates in a basis $\\mathcal{B}$ using the change-of-basis matrix $P_{\\mathcal{B}} = [\\mathbf{b}_1 \\ \\cdots \\ \\mathbf{b}_n]$, satisfying $\\mathbf{x} = P_{\\mathcal{B}}[\\mathbf{x}]_{\\mathcal{B}}$ and $[\\mathbf{x}]_{\\mathcal{B}} = P_{\\mathcal{B}}^{-1}\\mathbf{x}$.",
    "利用基矩阵 $P_{\\mathcal{B}} = [\\mathbf{b}_1 \\ \\cdots \\ \\mathbf{b}_n]$ 建立标准坐标与基 $\\mathcal{B}$ 下坐标的关系：$\\mathbf{x} = P_{\\mathcal{B}}[\\mathbf{x}]_{\\mathcal{B}}$ 以及 $[\\mathbf{x}]_{\\mathcal{B}} = P_{\\mathcal{B}}^{-1}\\mathbf{x}$。",
  ),
  intro: t(
    "For $\\mathcal{B} = \\{(2, 1), (1, 1)\\}$ the basis matrix is $P_{\\mathcal{B}} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$. If $[\\mathbf{x}]_{\\mathcal{B}} = (3, -1)$, then $\\mathbf{x} = P_{\\mathcal{B}}(3, -1) = (6 - 1, 3 - 1) = (5, 2)$.\n\nCheck: $P_{\\mathcal{B}}^{-1} = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$, and $P_{\\mathcal{B}}^{-1}(5, 2) = (5 - 2, -5 + 4) = (3, -1)$ gives the coordinates back.\n\nIn this lesson we build the basis matrix $P_{\\mathcal{B}}$, use it to turn coordinates into a vector, and use its inverse to turn a vector into coordinates.",
    "对 $\\mathcal{B} = \\{(2, 1), (1, 1)\\}$，基矩阵为 $P_{\\mathcal{B}} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$。若 $[\\mathbf{x}]_{\\mathcal{B}} = (3, -1)$，则 $\\mathbf{x} = P_{\\mathcal{B}}(3, -1) = (6 - 1, 3 - 1) = (5, 2)$。\n\n检验：$P_{\\mathcal{B}}^{-1} = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$，而 $P_{\\mathcal{B}}^{-1}(5, 2) = (5 - 2, -5 + 4) = (3, -1)$，回到原来的坐标。\n\n本课我们构造基矩阵 $P_{\\mathcal{B}}$，用它把坐标变成向量，再用它的逆把向量变成坐标。",
  ),
  prerequisites: ["expressing-the-coordinates-of-a-vector-in-a-given-basis"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "matrix-pb-relation",
      title: t("The change-of-basis matrix $P_{\\mathcal{B}}$", "基矩阵 $P_{\\mathcal{B}}$ 的构造与性质"),
      explanation: t(
        "Multiplying the matrix of basis vectors by a coordinate vector forms the weighted sum of the basis vectors, which is the vector itself. For a basis $\\mathcal{B} = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_n\\}$ of $\\mathbb{R}^n$, the matrix $P_{\\mathcal{B}} = [\\mathbf{b}_1 \\ \\cdots \\ \\mathbf{b}_n]$ transforms $\\mathcal{B}$-coordinates into standard coordinates: $\\mathbf{x} = P_{\\mathcal{B}}[\\mathbf{x}]_{\\mathcal{B}}$. For example, $\\mathcal{B} = \\{(2, 1), (1, 1)\\}$ gives $P_{\\mathcal{B}} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$.\n\n> **Watch out.** The basis vectors go in as columns, in the order of the basis, not as rows.",
        "用基向量组成的矩阵乘以坐标向量，就得到基向量的加权和，也就是这个向量本身。对于 $\\mathbb{R}^n$ 的基 $\\mathcal{B} = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_n\\}$，矩阵 $P_{\\mathcal{B}} = [\\mathbf{b}_1 \\ \\cdots \\ \\mathbf{b}_n]$ 将 $\\mathcal{B}$-坐标转换为标准坐标：$\\mathbf{x} = P_{\\mathcal{B}}[\\mathbf{x}]_{\\mathcal{B}}$。例如 $\\mathcal{B} = \\{(2, 1), (1, 1)\\}$ 给出 $P_{\\mathcal{B}} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$。\n\n> **注意。** 基向量按基中的顺序作为列放入，而不是作为行。",
      ),
      generate(rng) {
        const b1 = [rng.nonZero(-3, 3), rng.int(-2, 2)];
        const b2 = [rng.int(-2, 2), rng.nonZero(-3, 3)];
        // A zero determinant needs b1[1] ≠ 0, so moving b2[0] by one makes the pair a basis.
        if (b1[0]! * b2[1]! - b1[1]! * b2[0]! === 0) {
          b2[0] = b2[0]! + 1;
        }
        const P = [
          [b1[0]!, b2[0]!],
          [b1[1]!, b2[1]!],
        ];
        const prompt = t(
          `Let $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ be a basis for $\\mathbb{R}^2$. What is the change-of-basis matrix $P_{\\mathcal{B}}$ such that $\\mathbf{x} = P_{\\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}}$?`,
          `设 $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ 为 $\\mathbb{R}^2$ 的一组基。使得 $\\mathbf{x} = P_{\\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}}$ 成立的基矩阵 $P_{\\mathcal{B}}$ 是什么？`,
        );
        const right = t(`$${matLatex(P)}$`, `$${matLatex(P)}$`);
        const rows = `$${matLatex([
          [b1[0]!, b1[1]!],
          [b2[0]!, b2[1]!],
        ])}$`;
        const swapped = `$${matLatex([
          [b2[0]!, b1[0]!],
          [b2[1]!, b1[1]!],
        ])}$`;
        const negated = `$${matLatex([
          [-b1[0]!, -b2[0]!],
          [-b1[1]!, -b2[1]!],
        ])}$`;
        const wrong = [t(rows, rows), t(swapped, swapped), t(negated, negated)];
        const solution = walked(
          [
            [
              ["Why columns", "为什么是列"],
              t(
                "A matrix times a vector is the combination of its columns with the vector's entries as weights:",
                "矩阵乘向量就是以向量分量为权重的各列组合：",
              ),
              [`[\\mathbf{b}_1 \\; \\mathbf{b}_2] ${colVecLatex(["c_1", "c_2"])} = c_1\\mathbf{b}_1 + c_2\\mathbf{b}_2 = \\mathbf{x}`],
            ],
            [
              ["Place the vectors", "放入向量"],
              t(
                "Put $\\mathbf{b}_1$ in column 1 and $\\mathbf{b}_2$ in column 2:",
                "把 $\\mathbf{b}_1$ 放在第 1 列，$\\mathbf{b}_2$ 放在第 2 列：",
              ),
              [`P_{\\mathcal{B}} = ${matLatex(P)}`],
            ],
          ],
          t(
            `$P_{\\mathcal{B}}${colVecLatex([1, 0])} = ${colVecLatex(b1)} = \\mathbf{b}_1$, as it must, since $[\\mathbf{b}_1]_{\\mathcal{B}} = (1, 0)$.`,
            `$P_{\\mathcal{B}}${colVecLatex([1, 0])} = ${colVecLatex(b1)} = \\mathbf{b}_1$，理应如此，因为 $[\\mathbf{b}_1]_{\\mathcal{B}} = (1, 0)$。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [rows, "The basis vectors are written as rows here; they must be the columns.", "这里基向量写成了行；它们应当是列。"],
          [swapped, "The columns are in the wrong order: $\\mathbf{b}_1$ goes first.", "列的顺序反了：$\\mathbf{b}_1$ 在前。"],
          [negated, "Every entry is negated; the columns are the basis vectors themselves.", "每个元素都变了号；列就是基向量本身。"],
        ]);
      },
    },
    {
      id: "solve-coords-using-inverse-pb",
      title: t("Converting standard coordinates to $\\mathcal{B}$-coordinates", "利用逆矩阵将标准坐标转换为 $\\mathcal{B}$-坐标"),
      explanation: t(
        "Because the basis vectors are independent, their matrix is invertible, and multiplying by the inverse undoes the conversion from coordinates to the vector. To find the coordinates of $\\mathbf{x}$ relative to $\\mathcal{B}$, invert $P_{\\mathcal{B}}$: $[\\mathbf{x}]_{\\mathcal{B}} = P_{\\mathcal{B}}^{-1}\\mathbf{x}$. For example, $P_{\\mathcal{B}} = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$ has inverse $\\begin{pmatrix} 1 & -2 \\\\ 0 & 1 \\end{pmatrix}$, so $\\mathbf{x} = (5, 1)$ has $[\\mathbf{x}]_{\\mathcal{B}} = (5 - 2, 1) = (3, 1)$.\n\n> **Watch out.** $P_{\\mathcal{B}}$ turns coordinates into the vector; going from the vector to coordinates needs $P_{\\mathcal{B}}^{-1}$, not $P_{\\mathcal{B}}$.",
        "由于基向量线性无关，它们组成的矩阵可逆，乘以逆矩阵就把从坐标到向量的转换倒了回来。求向量 $\\mathbf{x}$ 关于基 $\\mathcal{B}$ 的坐标向量，使用基矩阵的逆：$[\\mathbf{x}]_{\\mathcal{B}} = P_{\\mathcal{B}}^{-1}\\mathbf{x}$。例如 $P_{\\mathcal{B}} = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$ 的逆为 $\\begin{pmatrix} 1 & -2 \\\\ 0 & 1 \\end{pmatrix}$，所以 $\\mathbf{x} = (5, 1)$ 的坐标为 $[\\mathbf{x}]_{\\mathcal{B}} = (5 - 2, 1) = (3, 1)$。\n\n> **注意。** $P_{\\mathcal{B}}$ 把坐标变成向量；从向量求坐标要用 $P_{\\mathcal{B}}^{-1}$，而不是 $P_{\\mathcal{B}}$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b1 = [1, 0];
        const b2 = [a, 1];
        const x1 = rng.int(-6, 6);
        const x2 = rng.nonZero(-6, 6);
        const x = [x1, x2];
        const c1 = x1 - a * x2;
        const c2 = x2;
        const coords = [c1, c2];
        const prompt = t(
          `Let $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ be a basis for $\\mathbb{R}^2$. Using $P_{\\mathcal{B}}^{-1}$, find $[\\mathbf{x}]_{\\mathcal{B}}$ for $\\mathbf{x} = ${colVecLatex(x)}$. Enter the vector as $\\langle c_1, c_2 \\rangle$.`,
          `设 $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ 为 $\\mathbb{R}^2$ 的一组基。利用 $P_{\\mathcal{B}}^{-1}$ 计算向量 $\\mathbf{x} = ${colVecLatex(x)}$ 的坐标 $[\\mathbf{x}]_{\\mathcal{B}}$。以 $\\langle c_1, c_2 \\rangle$ 的形式输入结果。`,
        );
        const P = [
          [1, a],
          [0, 1],
        ];
        const Pinv = [
          [1, -a],
          [0, 1],
        ];
        return withMistakes(
          pointProblem({
            prompt,
            answer: coords,
            vars: ["c_1", "c_2"],
            vector: true,
            solution: walked(
              [
                [["Build the basis matrix", "构造基矩阵"], t("", ""), [`P_{\\mathcal{B}} = ${matLatex(P)}`]],
                [
                  ["Invert it", "求逆"],
                  t(
                    "For $\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}$ the inverse changes the sign of $a$:",
                    "$\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}$ 的逆只需改变 $a$ 的符号：",
                  ),
                  [`P_{\\mathcal{B}}^{-1} = ${matLatex(Pinv)}`],
                ],
                [
                  ["Multiply", "相乘"],
                  t("", ""),
                  [
                    `[\\mathbf{x}]_{\\mathcal{B}} = ${matLatex(Pinv)}${colVecLatex(x)} = ${colVecLatex([`${x1} + ${paren(-a)} \\cdot ${paren(x2)}`, `${x2}`])} = ${colVecLatex(coords)}`,
                  ],
                ],
              ],
              t(
                `$${c1}${colVecLatex(b1)} + ${paren(c2)}${colVecLatex(b2)} = ${colVecLatex([c1 + a * c2, c2])} = \\mathbf{x}$.`,
                `$${c1}${colVecLatex(b1)} + ${paren(c2)}${colVecLatex(b2)} = ${colVecLatex([c1 + a * c2, c2])} = \\mathbf{x}$。`,
              ),
            ),
          }),
          dedupeSaid(
            [
              say(
                vectorLatex([x1 + a * x2, x2]),
                "This multiplies by $P_{\\mathcal{B}}$; coordinates come from $P_{\\mathcal{B}}^{-1}$.",
                "这是乘以 $P_{\\mathcal{B}}$；坐标要用 $P_{\\mathcal{B}}^{-1}$ 求。",
              ),
              say(
                vectorLatex(x),
                "These are the standard coordinates of $\\mathbf{x}$; they still have to be converted.",
                "这是 $\\mathbf{x}$ 的标准坐标；还需要转换。",
              ),
              say(
                vectorLatex([c2, c1]),
                "The order is swapped: the first coordinate goes with $\\mathbf{b}_1$.",
                "顺序反了：第一个坐标对应 $\\mathbf{b}_1$。",
              ),
            ],
            vectorLatex(coords),
          ),
        );
      },
    },
  ],
};

/** theChangeOfCoordinatesMatrix covers constructing P_{C ← B} and applying the coordinate transformation formula. */
export const theChangeOfCoordinatesMatrix: TopicDef = {
  id: "the-change-of-coordinates-matrix",
  title: t("The Change-of-Coordinates Matrix", "坐标变换矩阵（过渡矩阵）"),
  summary: t(
    "Construct the change-of-coordinates matrix $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$, whose columns are the $\\mathcal{C}$-coordinate vectors of the vectors of $\\mathcal{B}$, and apply $[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C} \\leftarrow \\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}}$.",
    "构造过渡矩阵 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$（其列为基 $\\mathcal{B}$ 的向量在基 $\\mathcal{C}$ 下的坐标），并应用 $[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C} \\leftarrow \\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}}$ 变换坐标。",
  ),
  intro: t(
    "Suppose $\\mathbf{b}_1 = \\mathbf{c}_1$ and $\\mathbf{b}_2 = 2\\mathbf{c}_1 + \\mathbf{c}_2$. Then $[\\mathbf{b}_1]_{\\mathcal{C}} = (1, 0)$ and $[\\mathbf{b}_2]_{\\mathcal{C}} = (2, 1)$, so $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$. For $[\\mathbf{x}]_{\\mathcal{B}} = (3, 1)$ this gives $[\\mathbf{x}]_{\\mathcal{C}} = (3 + 2, 1) = (5, 1)$.\n\nCheck: $\\mathbf{x} = 3\\mathbf{b}_1 + \\mathbf{b}_2 = 3\\mathbf{c}_1 + 2\\mathbf{c}_1 + \\mathbf{c}_2 = 5\\mathbf{c}_1 + \\mathbf{c}_2$.\n\nIn this lesson we build the change-of-coordinates matrix from $\\mathcal{B}$ to $\\mathcal{C}$ and use it to convert coordinates.",
    "设 $\\mathbf{b}_1 = \\mathbf{c}_1$，$\\mathbf{b}_2 = 2\\mathbf{c}_1 + \\mathbf{c}_2$。则 $[\\mathbf{b}_1]_{\\mathcal{C}} = (1, 0)$，$[\\mathbf{b}_2]_{\\mathcal{C}} = (2, 1)$，所以 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$。对 $[\\mathbf{x}]_{\\mathcal{B}} = (3, 1)$，得 $[\\mathbf{x}]_{\\mathcal{C}} = (3 + 2, 1) = (5, 1)$。\n\n检验：$\\mathbf{x} = 3\\mathbf{b}_1 + \\mathbf{b}_2 = 3\\mathbf{c}_1 + 2\\mathbf{c}_1 + \\mathbf{c}_2 = 5\\mathbf{c}_1 + \\mathbf{c}_2$。\n\n本课我们构造从 $\\mathcal{B}$ 到 $\\mathcal{C}$ 的过渡矩阵，并用它转换坐标。",
  ),
  prerequisites: ["writing-vectors-in-different-bases"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "construct-change-of-basis-matrix",
      title: t("Columns of the change-of-coordinates matrix", "过渡矩阵的列结构"),
      explanation: t(
        "Each column of the change of coordinates matrix tells you how one old basis vector is written in terms of the new basis. The change-of-coordinates matrix from the basis $\\mathcal{B} = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_n\\}$ to the basis $\\mathcal{C}$ is $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{bmatrix} [\\mathbf{b}_1]_{\\mathcal{C}} & \\cdots & [\\mathbf{b}_n]_{\\mathcal{C}} \\end{bmatrix}$. For example, if $\\mathbf{b}_1 = 2\\mathbf{c}_1 + \\mathbf{c}_2$ and $\\mathbf{b}_2 = \\mathbf{c}_1 - \\mathbf{c}_2$, then $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} 2 & 1 \\\\ 1 & -1 \\end{pmatrix}$.\n\n> **Watch out.** Read the arrow: $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$ holds the vectors of $\\mathcal{B}$ written in $\\mathcal{C}$, not the other way round.",
        "坐标变换矩阵的每一列说明一个旧基向量怎样用新基表示。从基 $\\mathcal{B} = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_n\\}$ 到基 $\\mathcal{C}$ 的过渡矩阵为 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{bmatrix} [\\mathbf{b}_1]_{\\mathcal{C}} & \\cdots & [\\mathbf{b}_n]_{\\mathcal{C}} \\end{bmatrix}$，每一列是 $\\mathcal{B}$ 中的基向量在基 $\\mathcal{C}$ 下的坐标。例如若 $\\mathbf{b}_1 = 2\\mathbf{c}_1 + \\mathbf{c}_2$，$\\mathbf{b}_2 = \\mathbf{c}_1 - \\mathbf{c}_2$，则 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} 2 & 1 \\\\ 1 & -1 \\end{pmatrix}$。\n\n> **注意。** 看清箭头：$P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$ 装的是用 $\\mathcal{C}$ 表示的 $\\mathcal{B}$ 中的向量，而不是反过来。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const c = rng.nonZero(-4, 4);
        const d = rng.nonZero(-4, 4);
        const b1 = [a, b];
        const b2 = [c, d];
        const prompt = t(
          `Let $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ and $\\mathcal{C} = \\{\\mathbf{c}_1, \\mathbf{c}_2\\}$ be two bases for $\\mathbb{R}^2$. Which matrix converts $\\mathcal{B}$-coordinates to $\\mathcal{C}$-coordinates via $[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C} \\leftarrow \\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}}$?`,
          `设 $\\mathcal{B} = \\left\\{ ${colVecLatex(b1)}, ${colVecLatex(b2)} \\right\\}$ 和 $\\mathcal{C} = \\{\\mathbf{c}_1, \\mathbf{c}_2\\}$ 为 $\\mathbb{R}^2$ 的两组基。哪一个矩阵满足 $[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C} \\leftarrow \\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}}$？`,
        );
        const right = t(
          `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} [\\mathbf{b}_1]_{\\mathcal{C}} & [\\mathbf{b}_2]_{\\mathcal{C}} \\end{pmatrix}$`,
          `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} [\\mathbf{b}_1]_{\\mathcal{C}} & [\\mathbf{b}_2]_{\\mathcal{C}} \\end{pmatrix}$`,
        );
        const wrong = [
          t(
            `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} [\\mathbf{c}_1]_{\\mathcal{B}} & [\\mathbf{c}_2]_{\\mathcal{B}} \\end{pmatrix}$`,
            `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} [\\mathbf{c}_1]_{\\mathcal{B}} & [\\mathbf{c}_2]_{\\mathcal{B}} \\end{pmatrix}$`,
          ),
          t(
            `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} [\\mathbf{b}_1]_{\\mathcal{B}} & [\\mathbf{b}_2]_{\\mathcal{B}} \\end{pmatrix}$`,
            `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} [\\mathbf{b}_1]_{\\mathcal{B}} & [\\mathbf{b}_2]_{\\mathcal{B}} \\end{pmatrix}$`,
          ),
          t(
            `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = [\\mathbf{b}_1 \\; \\mathbf{c}_1]$`,
            `$P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = [\\mathbf{b}_1 \\; \\mathbf{c}_1]$`,
          ),
        ];
        const solution = walked(
          [
            [
              ["Write x in B", "用 B 表示 x"],
              t(
                "If $[\\mathbf{x}]_{\\mathcal{B}} = (u_1, u_2)$, then $\\mathbf{x} = u_1\\mathbf{b}_1 + u_2\\mathbf{b}_2$.",
                "若 $[\\mathbf{x}]_{\\mathcal{B}} = (u_1, u_2)$，则 $\\mathbf{x} = u_1\\mathbf{b}_1 + u_2\\mathbf{b}_2$。",
              ),
            ],
            [
              ["Take C-coordinates", "取 C 坐标"],
              t("Taking coordinates is linear, so:", "取坐标是线性的，所以："),
              [
                `[\\mathbf{x}]_{\\mathcal{C}} = u_1[\\mathbf{b}_1]_{\\mathcal{C}} + u_2[\\mathbf{b}_2]_{\\mathcal{C}} = \\begin{pmatrix} [\\mathbf{b}_1]_{\\mathcal{C}} & [\\mathbf{b}_2]_{\\mathcal{C}} \\end{pmatrix} ${colVecLatex(["u_1", "u_2"])}`,
              ],
            ],
          ],
          t(
            "For $\\mathbf{x} = \\mathbf{b}_1$, with $[\\mathbf{x}]_{\\mathcal{B}} = (1, 0)$, the product picks out column 1, which is $[\\mathbf{b}_1]_{\\mathcal{C}}$, as it should be.",
            "对 $\\mathbf{x} = \\mathbf{b}_1$，$[\\mathbf{x}]_{\\mathcal{B}} = (1, 0)$，乘积取出第 1 列，正是 $[\\mathbf{b}_1]_{\\mathcal{C}}$，理应如此。",
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "This is $P_{\\mathcal{B} \\leftarrow \\mathcal{C}}$, which converts the other way; it is the inverse of the matrix asked for.",
            "这是 $P_{\\mathcal{B} \\leftarrow \\mathcal{C}}$，方向相反；它是所求矩阵的逆。",
          ],
          [
            wrong[1]!.en,
            "$[\\mathbf{b}_1]_{\\mathcal{B}} = (1, 0)$ and $[\\mathbf{b}_2]_{\\mathcal{B}} = (0, 1)$, so this is the identity, which changes nothing.",
            "$[\\mathbf{b}_1]_{\\mathcal{B}} = (1, 0)$，$[\\mathbf{b}_2]_{\\mathcal{B}} = (0, 1)$，所以这是单位矩阵，什么也没有改变。",
          ],
          [
            wrong[2]!.en,
            "This mixes one vector of each basis; each column must be a vector of $\\mathcal{B}$ written in $\\mathcal{C}$-coordinates.",
            "这里混用了两组基各一个向量；每一列都必须是用 $\\mathcal{C}$ 坐标表示的 $\\mathcal{B}$ 中的向量。",
          ],
        ]);
      },
    },
    {
      id: "apply-change-of-coordinates-matrix",
      title: t("Applying the change-of-coordinates matrix", "计算变换后的坐标向量"),
      explanation: t(
        "Once the matrix is known, converting coordinates is just one product of the matrix with the old coordinate vector. To find $[\\mathbf{x}]_{\\mathcal{C}}$ given $[\\mathbf{x}]_{\\mathcal{B}}$ and $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$, compute the matrix-vector product $[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C} \\leftarrow \\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}}$. For example, $\\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}(3, 1) = (3 + 2, 0 + 1) = (5, 1)$.\n\n> **Watch out.** Each entry of the product is a row of the matrix times the vector; using the columns as rows computes the transpose instead.",
        "一旦知道这个矩阵，转换坐标就只是用它乘以旧坐标向量。已知 $[\\mathbf{x}]_{\\mathcal{B}}$ 与过渡矩阵 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$ 时，通过矩阵乘法求 $[\\mathbf{x}]_{\\mathcal{C}}$：$[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C} \\leftarrow \\mathcal{B}} [\\mathbf{x}]_{\\mathcal{B}}$。例如 $\\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}(3, 1) = (3 + 2, 0 + 1) = (5, 1)$。\n\n> **注意。** 乘积的每个分量是矩阵的一行乘以向量；把列当作行来用，算出的是转置的乘积。",
      ),
      generate(rng) {
        const p11 = rng.int(-2, 2);
        const p12 = rng.int(-2, 2);
        const p21 = rng.int(-2, 2);
        const p22 = rng.int(-2, 2);
        const P = [
          [p11, p12],
          [p21, p22],
        ];
        const u1 = rng.int(-3, 3);
        const u2 = rng.int(-3, 3);
        const u = [u1, u2];
        const v1 = p11 * u1 + p12 * u2;
        const v2 = p21 * u1 + p22 * u2;
        const v = [v1, v2];
        const prompt = t(
          `Given the change-of-coordinates matrix $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = ${matLatex(P)}$ and $[\\mathbf{x}]_{\\mathcal{B}} = ${colVecLatex(u)}$, compute $[\\mathbf{x}]_{\\mathcal{C}}$. Enter the vector as $\\langle c_1, c_2 \\rangle$.`,
          `已知过渡矩阵 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = ${matLatex(P)}$ 以及 $[\\mathbf{x}]_{\\mathcal{B}} = ${colVecLatex(u)}$，计算 $[\\mathbf{x}]_{\\mathcal{C}}$。以 $\\langle c_1, c_2 \\rangle$ 的形式输入结果。`,
        );
        return withMistakes(
          pointProblem({
            prompt,
            answer: v,
            vars: ["c_1", "c_2"],
            vector: true,
            solution: walked(
              [
                [
                  ["Row 1 times the vector", "第 1 行乘向量"],
                  t("", ""),
                  [`${p11} \\cdot ${paren(u1)} + ${paren(p12)} \\cdot ${paren(u2)} = ${v1}`],
                ],
                [
                  ["Row 2 times the vector", "第 2 行乘向量"],
                  t("", ""),
                  [`${p21} \\cdot ${paren(u1)} + ${paren(p22)} \\cdot ${paren(u2)} = ${v2}`],
                ],
              ],
              t(
                `By columns: $${u1}${colVecLatex([p11, p21])} + ${paren(u2)}${colVecLatex([p12, p22])} = ${colVecLatex(v)}$, the same $[\\mathbf{x}]_{\\mathcal{C}} = \\langle ${v1}, ${v2} \\rangle$.`,
                `按列计算：$${u1}${colVecLatex([p11, p21])} + ${paren(u2)}${colVecLatex([p12, p22])} = ${colVecLatex(v)}$，同样得到 $[\\mathbf{x}]_{\\mathcal{C}} = \\langle ${v1}, ${v2} \\rangle$。`,
              ),
            ),
          }),
          dedupeSaid(
            [
              say(
                vectorLatex([p11 * u1 + p21 * u2, p12 * u1 + p22 * u2]),
                "The columns were used as rows; this is the product with the transpose.",
                "把列当作行来用了；这是与转置矩阵的乘积。",
              ),
              say(
                vectorLatex(u),
                "These are the $\\mathcal{B}$-coordinates unchanged; they still have to be multiplied by the matrix.",
                "这是未经变换的 $\\mathcal{B}$ 坐标；还要乘以矩阵。",
              ),
              say(
                vectorLatex([p11 * u1, p22 * u2]),
                "Only the diagonal entries were used; each row has two terms.",
                "只用了对角线元素；每一行都有两项。",
              ),
            ],
            vectorLatex(v),
          ),
        );
      },
    },
  ],
};

/** changingABasisUsingTheChangeOfCoordinatesMatrix covers inverse relation P_{B ← C} = (P_{C ← B})⁻¹ and augmented matrix row reduction [C | B] ~ [I | P]. */
export const changingABasisUsingTheChangeOfCoordinatesMatrix: TopicDef = {
  id: "changing-a-basis-using-the-change-of-coordinates-matrix",
  title: t("Changing a Basis Using the Change-of-Coordinates Matrix", "利用过渡矩阵转换基与坐标"),
  summary: t(
    "Use $(P_{\\mathcal{C} \\leftarrow \\mathcal{B}})^{-1} = P_{\\mathcal{B} \\leftarrow \\mathcal{C}}$ and the row reduction $[C \\mid B] \\sim [I \\mid P_{\\mathcal{C} \\leftarrow \\mathcal{B}}]$ to change bases and coordinates.",
    "利用 $(P_{\\mathcal{C} \\leftarrow \\mathcal{B}})^{-1} = P_{\\mathcal{B} \\leftarrow \\mathcal{C}}$ 与行化简 $[C \\mid B] \\sim [I \\mid P_{\\mathcal{C} \\leftarrow \\mathcal{B}}]$ 求过渡矩阵并转换基与坐标。",
  ),
  intro: t(
    "If $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$, the way back is its inverse: the determinant is $2 - 1 = 1$, so $P_{\\mathcal{B} \\leftarrow \\mathcal{C}} = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$.\n\nCheck: $\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}\\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix} = \\begin{pmatrix} 2 - 1 & -2 + 2 \\\\ 1 - 1 & -1 + 2 \\end{pmatrix} = I$, so converting there and back changes nothing.\n\nIn this lesson we reverse a change of coordinates with the inverse matrix and compute $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$ by row reducing $[C \\mid B]$.",
    "若 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$，反方向就是它的逆：行列式为 $2 - 1 = 1$，所以 $P_{\\mathcal{B} \\leftarrow \\mathcal{C}} = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$。\n\n检验：$\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}\\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix} = \\begin{pmatrix} 2 - 1 & -2 + 2 \\\\ 1 - 1 & -1 + 2 \\end{pmatrix} = I$，所以转过去再转回来什么也不变。\n\n本课我们用逆矩阵把坐标变换倒回来，并通过行化简 $[C \\mid B]$ 求 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$。",
  ),
  prerequisites: ["the-change-of-coordinates-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "inverse-transition-matrix-property",
      title: t("The inverse of a transition matrix", "过渡矩阵的逆矩阵性质"),
      explanation: t(
        "The transition matrix from $\\mathcal{C}$ back to $\\mathcal{B}$ is the inverse of the transition matrix from $\\mathcal{B}$ to $\\mathcal{C}$: $P_{\\mathcal{B} \\leftarrow \\mathcal{C}} = (P_{\\mathcal{C} \\leftarrow \\mathcal{B}})^{-1}$. For example, if $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$, then $P_{\\mathcal{B} \\leftarrow \\mathcal{C}} = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$, since their product is $I$.\n\n> **Watch out.** The inverse is neither the transpose nor the matrix with every sign changed; check that the product is $I$.",
        "从基 $\\mathcal{C}$ 到基 $\\mathcal{B}$ 的过渡矩阵等于从 $\\mathcal{B}$ 到 $\\mathcal{C}$ 的过渡矩阵的逆矩阵：$P_{\\mathcal{B} \\leftarrow \\mathcal{C}} = (P_{\\mathcal{C} \\leftarrow \\mathcal{B}})^{-1}$。例如若 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$，则 $P_{\\mathcal{B} \\leftarrow \\mathcal{C}} = \\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$，因为两者之积为 $I$。\n\n> **注意。** 逆矩阵既不是转置，也不是把每个符号都改变的矩阵；要检验乘积是否为 $I$。",
      ),
      generate(rng) {
        const k = rng.nonZero(-15, 15);
        const P = [
          [1, k],
          [0, 1],
        ];
        const Pinv = [
          [1, -k],
          [0, 1],
        ];
        const prompt = t(
          `If the change-of-coordinates matrix from basis $\\mathcal{B}$ to basis $\\mathcal{C}$ is $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = ${matLatex(P)}$, what is the change-of-coordinates matrix $P_{\\mathcal{B} \\leftarrow \\mathcal{C}}$?`,
          `若从基 $\\mathcal{B}$ 到基 $\\mathcal{C}$ 的过渡矩阵为 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = ${matLatex(P)}$，则逆向过渡矩阵 $P_{\\mathcal{B} \\leftarrow \\mathcal{C}}$ 是多少？`,
        );
        const right = t(`$${matLatex(Pinv)}$`, `$${matLatex(Pinv)}$`);
        const transposed = `$${matLatex([
          [1, 0],
          [k, 1],
        ])}$`;
        const negated = `$${matLatex([
          [-1, -k],
          [0, -1],
        ])}$`;
        const wrong = [t(`$${matLatex(P)}$`, `$${matLatex(P)}$`), t(transposed, transposed), t(negated, negated)];
        const solution = walked(
          [
            [
              ["Going back is the inverse", "反方向就是逆"],
              t(
                "Converting from $\\mathcal{B}$ to $\\mathcal{C}$ and then back must give the same coordinates, so $P_{\\mathcal{B} \\leftarrow \\mathcal{C}}P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = I$.",
                "从 $\\mathcal{B}$ 转到 $\\mathcal{C}$ 再转回来必须得到原坐标，所以 $P_{\\mathcal{B} \\leftarrow \\mathcal{C}}P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = I$。",
              ),
            ],
            [
              ["Invert", "求逆"],
              t(
                "The determinant is $1$, so swap the diagonal entries (both $1$) and change the sign of the off-diagonal entry:",
                "行列式为 $1$，所以交换对角元素（都是 $1$），并改变非对角元素的符号：",
              ),
              [`P_{\\mathcal{B} \\leftarrow \\mathcal{C}} = ${matLatex(Pinv)}`],
            ],
          ],
          t(
            `$${matLatex(P)}${matLatex(Pinv)} = \\begin{pmatrix} 1 & ${-k} + ${paren(k)} \\\\ 0 & 1 \\end{pmatrix} = I$.`,
            `$${matLatex(P)}${matLatex(Pinv)} = \\begin{pmatrix} 1 & ${-k} + ${paren(k)} \\\\ 0 & 1 \\end{pmatrix} = I$。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            `$${matLatex(P)}$`,
            "This is the given matrix: going back the other way needs its inverse.",
            "这是已知矩阵：反方向需要它的逆矩阵。",
          ],
          [
            transposed,
            "This is the transpose, and the inverse of a matrix is not its transpose in general.",
            "这是转置，而矩阵的逆一般不是它的转置。",
          ],
          [
            negated,
            "This negates every entry, but the product with the given matrix must have $1$s on the diagonal.",
            "这里把每个元素都变号了，但它与已知矩阵的积对角线上应为 $1$。",
          ],
        ]);
      },
    },
    {
      id: "row-reduction-change-of-basis",
      title: t("Computing transition matrix via row reduction", "通过增广矩阵行化简求过渡矩阵"),
      explanation: t(
        "To find $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$ for bases $\\mathcal{B}$ and $\\mathcal{C}$ of $\\mathbb{R}^n$, row reduce the augmented matrix $[C \\mid B]$ until the left side is the identity matrix: $[C \\mid B] \\sim [I \\mid P_{\\mathcal{C} \\leftarrow \\mathcal{B}}]$. For example, with $C = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ and $B = \\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$, subtracting row 2 from row 1 gives $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} 2 & -1 \\\\ 1 & 2 \\end{pmatrix}$.\n\n> **Watch out.** The target basis $\\mathcal{C}$ goes on the left; putting $B$ on the left gives $P_{\\mathcal{B} \\leftarrow \\mathcal{C}}$ instead.",
        "在 $\\mathbb{R}^n$ 中求基 $\\mathcal{B}$ 到基 $\\mathcal{C}$ 的过渡矩阵 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$，可对增广矩阵 $[C \\mid B]$ 进行初等行变换，化简至左侧为单位阵：$[C \\mid B] \\sim [I \\mid P_{\\mathcal{C} \\leftarrow \\mathcal{B}}]$。例如 $C = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$，$B = \\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$ 时，第 1 行减去第 2 行，得 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = \\begin{pmatrix} 2 & -1 \\\\ 1 & 2 \\end{pmatrix}$。\n\n> **注意。** 目标基 $\\mathcal{C}$ 放在左边；把 $B$ 放在左边得到的是 $P_{\\mathcal{B} \\leftarrow \\mathcal{C}}$。",
      ),
      generate(rng) {
        const n = rng.int(2, 35);
        const prompt = t(
          `In $\\mathbb{R}^{${n}}$, to compute the change-of-coordinates matrix $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$ between two bases $\\mathcal{B} = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_{${n}}\\}$ and $\\mathcal{C} = \\{\\mathbf{c}_1, \\dots, \\mathbf{c}_{${n}}\\}$, which augmented matrix is row reduced to $[I \\mid P_{\\mathcal{C} \\leftarrow \\mathcal{B}}]$?`,
          `在 $\\mathbb{R}^{${n}}$ 中，为求基 $\\mathcal{B} = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_{${n}}\\}$ 到基 $\\mathcal{C} = \\{\\mathbf{c}_1, \\dots, \\mathbf{c}_{${n}}\\}$ 的过渡矩阵 $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$，应将哪一个增广矩阵行化简为 $[I \\mid P_{\\mathcal{C} \\leftarrow \\mathcal{B}}]$？`,
        );
        const right = t(
          `$[\\mathbf{c}_1 \\; \\dots \\; \\mathbf{c}_{${n}} \\mid \\mathbf{b}_1 \\; \\dots \\; \\mathbf{b}_{${n}}]$`,
          `$[\\mathbf{c}_1 \\; \\dots \\; \\mathbf{c}_{${n}} \\mid \\mathbf{b}_1 \\; \\dots \\; \\mathbf{b}_{${n}}]$`,
        );
        const wrong = [
          t(
            `$[\\mathbf{b}_1 \\; \\dots \\; \\mathbf{b}_{${n}} \\mid \\mathbf{c}_1 \\; \\dots \\; \\mathbf{c}_{${n}}]$`,
            `$[\\mathbf{b}_1 \\; \\dots \\; \\mathbf{b}_{${n}} \\mid \\mathbf{c}_1 \\; \\dots \\; \\mathbf{c}_{${n}}]$`,
          ),
          t(
            `$[I \\mid \\mathbf{b}_1 \\; \\dots \\; \\mathbf{b}_{${n}} \\; \\mathbf{c}_1 \\; \\dots \\; \\mathbf{c}_{${n}}]$`,
            `$[I \\mid \\mathbf{b}_1 \\; \\dots \\; \\mathbf{b}_{${n}} \\; \\mathbf{c}_1 \\; \\dots \\; \\mathbf{c}_{${n}}]$`,
          ),
          t(
            `$[\\mathbf{b}_1 \\; \\mathbf{c}_1 \\mid \\dots \\mid \\mathbf{b}_{${n}} \\; \\mathbf{c}_{${n}}]$`,
            `$[\\mathbf{b}_1 \\; \\mathbf{c}_1 \\mid \\dots \\mid \\mathbf{b}_{${n}} \\; \\mathbf{c}_{${n}}]$`,
          ),
        ];
        const solution = walked(
          [
            [
              ["The matrix equation", "矩阵方程"],
              t(
                "Column $j$ of $P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$ is $[\\mathbf{b}_j]_{\\mathcal{C}}$, the weights with $C[\\mathbf{b}_j]_{\\mathcal{C}} = \\mathbf{b}_j$. All columns together:",
                "$P_{\\mathcal{C} \\leftarrow \\mathcal{B}}$ 的第 $j$ 列是 $[\\mathbf{b}_j]_{\\mathcal{C}}$，即满足 $C[\\mathbf{b}_j]_{\\mathcal{C}} = \\mathbf{b}_j$ 的权重。所有列合起来：",
              ),
              ["C P_{\\mathcal{C} \\leftarrow \\mathcal{B}} = B"],
            ],
            [
              ["Row reduce", "行化简"],
              t(
                "The row operations that turn $C$ into $I$ multiply by $C^{-1}$, so applied to $[C \\mid B]$ they give:",
                "把 $C$ 化为 $I$ 的行变换相当于左乘 $C^{-1}$，作用在 $[C \\mid B]$ 上得到：",
              ),
              ["[C \\mid B] \\sim [I \\mid C^{-1}B] = [I \\mid P_{\\mathcal{C} \\leftarrow \\mathcal{B}}]"],
            ],
          ],
          t(
            "For $C = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$, $B = \\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$ the result $P = \\begin{pmatrix} 2 & -1 \\\\ 1 & 2 \\end{pmatrix}$ satisfies $CP = \\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix} = B$.",
            "对 $C = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$、$B = \\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$，结果 $P = \\begin{pmatrix} 2 & -1 \\\\ 1 & 2 \\end{pmatrix}$ 满足 $CP = \\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix} = B$。",
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "With $B$ on the left the result is $B^{-1}C = P_{\\mathcal{B} \\leftarrow \\mathcal{C}}$, the change in the other direction.",
            "把 $B$ 放在左边得到 $B^{-1}C = P_{\\mathcal{B} \\leftarrow \\mathcal{C}}$，是反方向的变换。",
          ],
          [
            wrong[1]!.en,
            "The left side is already $I$, so nothing is solved; the right side just lists both bases.",
            "左边已经是 $I$，什么也没有解；右边只是罗列了两组基。",
          ],
          [
            wrong[2]!.en,
            "Interleaving the vectors does not express $CP = B$; all of $\\mathcal{C}$ goes on the left and all of $\\mathcal{B}$ on the right.",
            "把向量交错排列并不能表达 $CP = B$；$\\mathcal{C}$ 全部放左边，$\\mathcal{B}$ 全部放右边。",
          ],
        ]);
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 3.12: DIMENSION AND RANK IN N-DIMENSIONAL SPACE
// ════════════════════════════════════════════════════════════════════════════

/** theDimensionOfASpan covers the definition of dimension as basis cardinality and computing dim(Span). */
export const theDimensionOfASpan: TopicDef = {
  id: "the-dimension-of-a-span",
  title: t("The Dimension of a Span", "张成空间的维数"),
  summary: t(
    "Define the dimension of a subspace as the number of vectors in any basis, and determine the dimension of a span by counting pivot columns.",
    "理解子空间维数作为任意基中向量个数的定义，并通过统计主元列数求解张成空间的维数。",
  ),
  intro: t(
    "Take $W = \\operatorname{Span}\\{(1, 2, 0), (2, 4, 0), (0, 0, 1)\\}$. The second vector is $2(1, 2, 0)$, so it adds nothing, and $\\{(1, 2, 0), (0, 0, 1)\\}$ is a basis of $W$: $\\dim W = 2$.\n\nCheck: neither of $(1, 2, 0)$ and $(0, 0, 1)$ is a multiple of the other, so they are independent, and $(2, 4, 0) = 2(1, 2, 0) + 0(0, 0, 1)$ is a combination of them.\n\nIn this lesson we define the dimension of a subspace as the size of any of its bases and find the dimension of a span by counting pivot columns.",
    "取 $W = \\operatorname{Span}\\{(1, 2, 0), (2, 4, 0), (0, 0, 1)\\}$。第二个向量是 $2(1, 2, 0)$，不提供新方向，所以 $\\{(1, 2, 0), (0, 0, 1)\\}$ 是 $W$ 的一组基：$\\dim W = 2$。\n\n检验：$(1, 2, 0)$ 与 $(0, 0, 1)$ 互不为倍数，所以线性无关，而 $(2, 4, 0) = 2(1, 2, 0) + 0(0, 0, 1)$ 是它们的组合。\n\n本课我们把子空间的维数定义为它任意一组基的向量个数，并通过数主元列求张成空间的维数。",
  ),
  prerequisites: ["finding-a-basis-of-a-span"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "dimension-definition-invariance",
      title: t("Dimension as basis cardinality", "维数作为基向量个数的唯一性"),
      explanation: t(
        "The dimension of a nonzero subspace $H$, written $\\dim(H)$, is the number of vectors in any basis for $H$. The zero subspace $\\{\\mathbf{0}\\}$ has dimension $0$. This makes sense because every basis of $H$ has the same size. For example, $\\mathbb{R}^3$ has the standard basis $\\{\\mathbf{e}_1, \\mathbf{e}_2, \\mathbf{e}_3\\}$ and also the basis $\\{(1, 1, 0), (0, 1, 1), (1, 0, 1)\\}$, and both have $3$ vectors.\n\n> **Watch out.** A spanning set may have more vectors than $\\dim(H)$, and an independent set fewer; only a set that is both, a basis, has exactly $\\dim(H)$ vectors.",
        "非零子空间 $H$ 的维数（记作 $\\dim(H)$）是 $H$ 的任意一组基中所含向量的个数。零子空间 $\\{\\mathbf{0}\\}$ 的维数规定为 $0$。这个定义有意义，是因为 $H$ 的所有基大小相同。例如 $\\mathbb{R}^3$ 有标准基 $\\{\\mathbf{e}_1, \\mathbf{e}_2, \\mathbf{e}_3\\}$，也有基 $\\{(1, 1, 0), (0, 1, 1), (1, 0, 1)\\}$，两者都含 $3$ 个向量。\n\n> **注意。** 张成集的向量可以多于 $\\dim(H)$，线性无关集的向量可以少于 $\\dim(H)$；只有既张成又线性无关的集合，即基，恰好有 $\\dim(H)$ 个向量。",
      ),
      generate(rng) {
        const k = rng.int(2, 30);
        const prompt = t(
          `If a subspace $H$ has a basis containing exactly $${k}$ vectors, what can be said about any other basis for $H$?`,
          `若子空间 $H$ 的某一组基恰好包含 $${k}$ 个向量，则关于 $H$ 的任意另一组基，下列说法正确的是？`,
        );
        const right = t(`It must also contain exactly $${k}$ vectors`, `它也必须恰好包含 $${k}$ 个向量`);
        const wrong = [
          t(`It can contain any number of vectors as long as they span $H$`, `它可以包含任意数量的向量，只要它们能张成 $H$`),
          t(`It must contain at least $${k + 1}$ vectors`, `它必须至少包含 $${k + 1}$ 个向量`),
          t(`It must contain fewer than $${k}$ vectors if they are orthogonal`, `若向量正交，则包含的向量个数可以少于 $${k}$ 个`),
        ];
        const solution = walked(
          [
            [
              ["Compare the sizes", "比较大小"],
              t(
                `In $H$, an independent set never has more vectors than a spanning set. The given basis spans $H$, so another basis, being independent, has at most $${k}$ vectors; the other basis spans $H$, so the given one, being independent, has at most as many as it.`,
                `在 $H$ 中，线性无关集的向量个数不超过张成集的向量个数。已知的基张成 $H$，所以另一组基（线性无关）至多有 $${k}$ 个向量；另一组基也张成 $H$，所以已知的基（线性无关）的个数不超过它。`,
              ),
            ],
            [
              ["Conclude", "得出结论"],
              t(
                `Both inequalities hold, so every basis of $H$ has exactly $${k}$ vectors and $\\dim(H) = ${k}$.`,
                `两个不等式同时成立，所以 $H$ 的每组基都恰有 $${k}$ 个向量，$\\dim(H) = ${k}$。`,
              ),
            ],
          ],
          t(
            `$${k + 1}$ vectors in $H$ would be dependent, and $${k - 1}$ vectors could not span $H$, so no other size is possible.`,
            `$H$ 中 $${k + 1}$ 个向量必定线性相关，而 $${k - 1}$ 个向量不能张成 $H$，所以不可能是别的个数。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "Spanning is not enough: a basis must also be independent, and that fixes the count.",
            "只张成还不够：基还必须线性无关，这就确定了向量个数。",
          ],
          [
            wrong[1]!.en,
            `In a subspace of dimension $${k}$, any $${k + 1}$ vectors are dependent, so they cannot form a basis.`,
            `在 $${k}$ 维子空间中，任意 $${k + 1}$ 个向量都线性相关，所以不能构成基。`,
          ],
          [
            wrong[2]!.en,
            `Orthogonality does not change the count: an orthogonal basis is still a basis, with $${k}$ vectors.`,
            `正交与否不改变个数：正交基仍是基，有 $${k}$ 个向量。`,
          ],
        ]);
      },
    },
    {
      id: "compute-dim-of-span",
      title: t(
        "Computing $\\dim \\operatorname{Span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$",
        "计算 $\\operatorname{Span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ 的维数",
      ),
      explanation: t(
        "Row reduction shows which vectors are combinations of earlier ones, and the remaining pivot columns form a basis of the span. The dimension of $\\operatorname{Span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ equals the number of pivot columns in the matrix $[\\mathbf{v}_1 \\ \\cdots \\ \\mathbf{v}_k]$. For example, $(1, 0, 2)$, $(0, 1, 1)$ and $(1, 1, 3)$ span a space of dimension $2$: the first two are independent, and $(1, 1, 3) = (1, 0, 2) + (0, 1, 1)$, so the third column has no pivot.\n\n> **Watch out.** Count pivots, not vectors: three vectors in $\\mathbb{R}^3$ may span all of $\\mathbb{R}^3$, a plane or only a line.",
        "行化简可以看出哪些向量是前面向量的组合，剩下的主元列构成张成空间的一组基。$\\operatorname{Span}\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_k\\}$ 的维数等于以这些向量为列构成的矩阵 $[\\mathbf{v}_1 \\ \\cdots \\ \\mathbf{v}_k]$ 的主元列个数。例如 $(1, 0, 2)$、$(0, 1, 1)$、$(1, 1, 3)$ 张成的空间维数为 $2$：前两个线性无关，而 $(1, 1, 3) = (1, 0, 2) + (0, 1, 1)$，所以第三列没有主元。\n\n> **注意。** 数主元，不是数向量：$\\mathbb{R}^3$ 中三个向量可能张成整个 $\\mathbb{R}^3$、一个平面，或只是一条直线。",
      ),
      generate(rng) {
        const pivots = rng.pick([1, 2, 3]);
        let v1: number[];
        let v2: number[];
        let v3: number[];
        let s1 = 0;
        let s2 = 0;
        let c = 0;
        let d = 0;
        if (pivots === 1) {
          const a = rng.nonZero(-3, 3);
          const b = rng.int(-3, 3);
          const cc = rng.int(-3, 3);
          s1 = rng.nonZero(-3, 3);
          s2 = rng.nonZero(-3, 3);
          v1 = [a, b, cc];
          v2 = [s1 * a, s1 * b, s1 * cc];
          v3 = [s2 * a, s2 * b, s2 * cc];
        } else if (pivots === 2) {
          const a = rng.int(-3, 3);
          const b = rng.int(-3, 3);
          c = rng.nonZero(-2, 2);
          d = rng.nonZero(-2, 2);
          v1 = [1, 0, a];
          v2 = [0, 1, b];
          v3 = [c, d, c * a + d * b];
        } else {
          const a = rng.int(-3, 3);
          const b = rng.int(-3, 3);
          const cc = rng.int(-3, 3);
          v1 = [1, 0, 0];
          v2 = [a, 1, 0];
          v3 = [cc, b, 1];
        }
        const [c1, c2, c3] = [colVecLatex(v1), colVecLatex(v2), colVecLatex(v3)];
        const prompt = t(
          `Find the dimension of the subspace $W = \\text{Span}\\left\\{ ${c1}, ${c2}, ${c3} \\right\\}$ in $\\mathbb{R}^3$.`,
          `求 $\\mathbb{R}^3$ 中子空间 $W = \\text{Span}\\left\\{ ${c1}, ${c2}, ${c3} \\right\\}$ 的维数。`,
        );
        const steps: Step[] =
          pivots === 1
            ? [
                [
                  ["Compare the vectors", "比较各向量"],
                  t(`The first vector is nonzero, and the others are multiples of it:`, `第一个向量非零，其余向量都是它的倍数：`),
                  [`\\mathbf{v}_2 = ${s1}\\mathbf{v}_1`, `\\mathbf{v}_3 = ${s2}\\mathbf{v}_1`],
                ],
                [
                  ["Count the pivots", "数主元"],
                  t(
                    "Row reduction leaves one nonzero row, so only the first column has a pivot and $\\{\\mathbf{v}_1\\}$ is a basis of $W$.",
                    "行化简后只剩一个非零行，所以只有第一列有主元，$\\{\\mathbf{v}_1\\}$ 是 $W$ 的一组基。",
                  ),
                ],
              ]
            : pivots === 2
              ? [
                  [
                    ["The first two vectors", "前两个向量"],
                    t(
                      "$\\mathbf{v}_1$ and $\\mathbf{v}_2$ have entries $(1, 0)$ and $(0, 1)$ on top, so neither is a multiple of the other and both columns have pivots.",
                      "$\\mathbf{v}_1$ 与 $\\mathbf{v}_2$ 的前两个元素是 $(1, 0)$ 和 $(0, 1)$，互不为倍数，所以这两列都有主元。",
                    ),
                  ],
                  [
                    ["The third vector", "第三个向量"],
                    t(
                      "The top two entries of $\\mathbf{v}_3$ give the weights, and they fit the last entry too:",
                      "$\\mathbf{v}_3$ 的前两个元素给出权重，而且最后一个元素也吻合：",
                    ),
                    [`\\mathbf{v}_3 = ${c}\\mathbf{v}_1 + ${paren(d)}\\mathbf{v}_2`],
                  ],
                ]
              : [
                  [
                    ["Form the matrix", "写出矩阵"],
                    t(
                      "With the vectors as columns the matrix is upper triangular, with $1$ on the diagonal:",
                      "以这些向量为列，矩阵是对角线为 $1$ 的上三角矩阵：",
                    ),
                    [`[\\mathbf{v}_1 \\ \\mathbf{v}_2 \\ \\mathbf{v}_3] = ${matLatex([0, 1, 2].map((i) => [v1[i]!, v2[i]!, v3[i]!]))}`],
                  ],
                  [
                    ["Count the pivots", "数主元"],
                    t(
                      "Each of the three diagonal $1$s is a pivot, so no vector is a combination of the others.",
                      "对角线上的三个 $1$ 都是主元，所以没有一个向量是其他向量的组合。",
                    ),
                  ],
                ];
        const solution = walked(
          steps,
          pivots === 1
            ? t(
                `$${s1} \\cdot ${c1} = ${c2}$, so $W$ is the line through $\\mathbf{v}_1$ and $\\dim W = 1$.`,
                `$${s1} \\cdot ${c1} = ${c2}$，所以 $W$ 是过 $\\mathbf{v}_1$ 的直线，$\\dim W = 1$。`,
              )
            : pivots === 2
              ? t(
                  `$${c} \\cdot ${c1} + ${paren(d)} \\cdot ${c2} = ${c3}$, so $W$ is a plane and $\\dim W = 2$.`,
                  `$${c} \\cdot ${c1} + ${paren(d)} \\cdot ${c2} = ${c3}$，所以 $W$ 是平面，$\\dim W = 2$。`,
                )
              : t(
                  "A triangular matrix with $1$s on the diagonal has determinant $1 \\ne 0$, so the three vectors are independent and $\\dim W = 3$.",
                  "对角线为 $1$ 的三角矩阵行列式为 $1 \\ne 0$，所以三个向量线性无关，$\\dim W = 3$。",
                ),
        );
        return numberProblem({
          prompt,
          answer: pivots,
          form: "integer",
          mistakes: [
            why(
              3,
              "That counts the vectors; at least one of them is a combination of the others and adds no dimension.",
              "这是数向量的个数；其中至少一个是其他向量的组合，不增加维数。",
            ),
            why(
              pivots === 3 ? 2 : pivots === 1 ? 2 : 1,
              pivots === 3
                ? "All three columns have pivots: the matrix is triangular with $1$s on the diagonal."
                : pivots === 1
                  ? "$\\mathbf{v}_2$ and $\\mathbf{v}_3$ are multiples of $\\mathbf{v}_1$, so all three lie on one line."
                  : "$\\mathbf{v}_1$ and $\\mathbf{v}_2$ are not multiples of each other, so the span is more than a line.",
              pivots === 3
                ? "三列都有主元：矩阵是对角线为 $1$ 的三角矩阵。"
                : pivots === 1
                  ? "$\\mathbf{v}_2$ 和 $\\mathbf{v}_3$ 都是 $\\mathbf{v}_1$ 的倍数，所以三者在同一条直线上。"
                  : "$\\mathbf{v}_1$ 与 $\\mathbf{v}_2$ 互不为倍数，所以张成的不止一条直线。",
            ),
            why(
              0,
              "Dimension $0$ belongs only to the zero subspace, and these vectors are nonzero.",
              "只有零子空间的维数是 $0$，而这些向量非零。",
            ),
          ].filter((m, i, all) => m.value !== pivots && all.findIndex((o) => o.value === m.value) === i),
          solution,
        });
      },
    },
  ],
};

/** theRankOfAMatrix covers rank definition as dim(Col(A)), pivot count, and rank bounds. */
export const theRankOfAMatrix: TopicDef = {
  id: "the-rank-of-a-matrix",
  title: t("The Rank of a Matrix", "矩阵的秩"),
  summary: t(
    "Define the rank of a matrix as $\\dim \\operatorname{Col}(A)$, equal to the number of pivot positions, and understand properties such as $\\operatorname{rank}(A) \\le \\min(m, n)$ and $\\operatorname{rank}(A^T) = \\operatorname{rank}(A)$.",
    "掌握矩阵的秩定义为 $\\dim \\operatorname{Col}(A)$（即阶梯形的主元个数），理解 $\\operatorname{rank}(A) \\le \\min(m, n)$ 与 $\\operatorname{rank}(A^T) = \\operatorname{rank}(A)$ 等性质。",
  ),
  intro: t(
    "Suppose $A$ row reduces to $\\begin{pmatrix} 1 & 2 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix}$. The pivots are in columns $1$ and $3$, so columns $1$ and $3$ of $A$ form a basis of $\\operatorname{Col}(A)$ and $\\operatorname{rank}(A) = 2$.\n\nCheck: the rank is at most $\\min(3, 3) = 3$, and it is less because column $2$ of the echelon form is $2$ times column $1$, so it adds no new direction.\n\nIn this lesson we read the rank of a matrix from its pivot positions and use the bound $\\operatorname{rank}(A) \\le \\min(m, n)$.",
    "设 $A$ 行化简为 $\\begin{pmatrix} 1 & 2 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix}$。主元在第 $1$ 列和第 $3$ 列，所以 $A$ 的第 $1$、$3$ 列构成 $\\operatorname{Col}(A)$ 的一组基，$\\operatorname{rank}(A) = 2$。\n\n检验：秩至多为 $\\min(3, 3) = 3$，而这里更小，因为阶梯形的第 $2$ 列是第 $1$ 列的 $2$ 倍，不提供新方向。\n\n本课我们由主元位置读出矩阵的秩，并使用上界 $\\operatorname{rank}(A) \\le \\min(m, n)$。",
  ),
  prerequisites: ["finding-a-basis-of-the-column-space-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "rank-from-pivot-positions",
      title: t("Rank as number of pivot positions", "秩作为主元位置个数"),
      explanation: t(
        "The rank of a matrix $A$, written $\\operatorname{rank}(A)$, is the dimension of the column space $\\operatorname{Col}(A)$, which equals the number of pivot columns in any echelon form of $A$. For example, the echelon form $\\begin{pmatrix} 2 & 1 & 3 \\\\ 0 & 0 & -1 \\end{pmatrix}$ has its pivots in columns $1$ and $3$, so the rank is $2$.\n\n> **Watch out.** Count pivots, the leading entries of the nonzero rows, not nonzero entries or nonzero columns: a column with entries but no pivot adds nothing to the rank.",
        "矩阵 $A$ 的秩记作 $\\operatorname{rank}(A)$，是列空间 $\\operatorname{Col}(A)$ 的维数，等于 $A$ 的任意阶梯形中主元列的个数。例如阶梯形 $\\begin{pmatrix} 2 & 1 & 3 \\\\ 0 & 0 & -1 \\end{pmatrix}$ 的主元在第 $1$ 列和第 $3$ 列，所以秩为 $2$。\n\n> **注意。** 数的是主元，即各非零行的首个非零元，而不是非零元素或非零列：有元素却没有主元的列不增加秩。",
      ),
      generate(rng) {
        const rows = rng.int(3, 5);
        const cols = rng.int(rows, 6);
        const r = rng.int(1, rows);
        // Pivot columns chosen at random, with free entries to the right of each pivot.
        const pivotCols = rng
          .shuffle(Array.from({ length: cols }, (_, i) => i))
          .slice(0, r)
          .sort((a, b) => a - b);
        const echelon = Array.from({ length: rows }, (_, i) =>
          Array.from({ length: cols }, (_, j) => {
            const pivot = pivotCols[i];
            if (pivot === undefined || j < pivot) return 0;
            if (j === pivot) return rng.pick([1, 2, 3, -1, -2]);
            return pivotCols.includes(j) ? 0 : rng.int(-3, 3);
          }),
        );
        const columnList = pivotCols.map((c) => c + 1).join(", ");
        const prompt = t(
          `An echelon form of the matrix $A$ is $$${matLatex(echelon)}.$$ What is $\\text{rank}(A)$?`,
          `矩阵 $A$ 的一个阶梯形为 $$${matLatex(echelon)}$$ $\\text{rank}(A)$ 是多少？`,
        );
        const solution = walked(
          [
            [
              ["Find the pivots", "找出主元"],
              t(
                `The leading entry of each nonzero row is a pivot. They sit in columns $${columnList}$.`,
                `每个非零行的首个非零元是主元。它们位于第 $${columnList}$ 列。`,
              ),
            ],
            [
              ["Count them", "数主元"],
              t(
                `There are $${r}$ pivot columns, so $\\text{rank}(A) = \\dim(\\text{Col}(A)) = ${r}$.`,
                `共有 $${r}$ 个主元列，所以 $\\text{rank}(A) = \\dim(\\text{Col}(A)) = ${r}$。`,
              ),
            ],
          ],
          t(
            `The echelon form has $${r}$ nonzero rows, one pivot in each, and $${r} \\le \\min(${rows}, ${cols})$.`,
            `阶梯形有 $${r}$ 个非零行，每行一个主元，且 $${r} \\le \\min(${rows}, ${cols})$。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: r,
          form: "integer",
          mistakes: [
            why(cols, "That is the number of columns; a column without a pivot does not count.", "这是列数；没有主元的列不算。"),
            why(rows, "That is the number of rows; a zero row has no pivot.", "这是行数；零行没有主元。"),
            why(r + 1, `Count the leading entries again: only $${r}$ rows are nonzero.`, `重新数首个非零元：只有 $${r}$ 行非零。`),
          ].filter((m, i, all) => m.value !== r && all.findIndex((o) => o.value === m.value) === i),
          solution,
        });
      },
    },
    {
      id: "properties-of-matrix-rank",
      title: t("Fundamental properties of rank", "矩阵秩的基本性质"),
      explanation: t(
        "The rank counts independent columns and also independent rows, so it can never exceed either the number of rows or the number of columns. For any $m \\times n$ matrix $A$: (1) $\\operatorname{rank}(A) \\le \\min(m, n)$; (2) $\\operatorname{rank}(A^T) = \\operatorname{rank}(A)$ (row rank equals column rank). For example, a $3 \\times 5$ matrix has rank at most $3$, even though it has $5$ columns, and its $5 \\times 3$ transpose has the same rank.\n\n> **Watch out.** The bound is the smaller of $m$ and $n$, not the larger one, their sum or their product.",
        "秩既是线性无关列的个数，也是线性无关行的个数，所以它不会超过行数，也不会超过列数。对任意 $m \\times n$ 矩阵 $A$：(1) $\\operatorname{rank}(A) \\le \\min(m, n)$；(2) $\\operatorname{rank}(A^T) = \\operatorname{rank}(A)$（行秩等于列秩）。例如 $3 \\times 5$ 矩阵的秩至多为 $3$，尽管它有 $5$ 列，它的 $5 \\times 3$ 转置秩相同。\n\n> **注意。** 上界是 $m$ 与 $n$ 中较小的那个，不是较大的那个，也不是它们的和或积。",
      ),
      generate(rng) {
        const m = rng.int(2, 12);
        const n = rng.int(2, 12);
        const minMN = Math.min(m, n);
        const prompt = t(
          `What is the maximum possible rank of ${article(m)} $${m} \\times ${n}$ matrix $A$?`,
          `一个 $${m} \\times ${n}$ 矩阵 $A$ 的秩最大可能为多少？`,
        );
        const solution = walked(
          [
            [
              ["Bound by the rows", "受行数限制"],
              t(`Each pivot is in a different row, so there are at most $${m}$ pivots.`, `每个主元在不同的行，所以至多 $${m}$ 个主元。`),
            ],
            [
              ["Bound by the columns", "受列数限制"],
              t(
                `Each pivot is also in a different column, so there are at most $${n}$. Together, $\\text{rank}(A) \\le \\min(${m}, ${n}) = ${minMN}$.`,
                `每个主元也在不同的列，所以至多 $${n}$ 个。合起来，$\\text{rank}(A) \\le \\min(${m}, ${n}) = ${minMN}$。`,
              ),
            ],
          ],
          t(
            `The bound is reached: the matrix with $1$ in positions $(1, 1)$ to $(${minMN}, ${minMN})$ and $0$ elsewhere has exactly $${minMN}$ pivots.`,
            `这个上界能取到：在 $(1, 1)$ 到 $(${minMN}, ${minMN})$ 位置为 $1$、其余为 $0$ 的矩阵恰有 $${minMN}$ 个主元。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: minMN,
          form: "integer",
          mistakes: [
            why(
              Math.max(m, n),
              "That is the larger dimension; a pivot needs its own row and its own column, so the smaller one limits it.",
              "这是较大的维数；每个主元需要单独的一行和一列，所以较小的那个起限制作用。",
            ),
            ...(m === n
              ? [
                  why(
                    minMN + 1,
                    `There are only $${minMN}$ rows and $${minMN}$ columns, so at most $${minMN}$ pivots.`,
                    `只有 $${minMN}$ 行和 $${minMN}$ 列，所以至多 $${minMN}$ 个主元。`,
                  ),
                ]
              : []),
            why(
              m + n,
              "Rows and columns do not add up: the rank is bounded by each of them separately.",
              "行数和列数不能相加：秩分别受两者限制。",
            ),
            why(
              m * n,
              "That counts the entries; each pivot uses up a whole row and a whole column.",
              "这是元素个数；每个主元占用一整行和一整列。",
            ),
          ].filter((w, i, all) => w.value !== minMN && all.findIndex((o) => o.value === w.value) === i),
          solution,
        });
      },
    },
  ],
};

/** theDimensionOfTheNullSpaceOfAMatrix covers nullity definition as dim(Null(A)) and counting free variables. */
export const theDimensionOfTheNullSpaceOfAMatrix: TopicDef = {
  id: "the-dimension-of-the-null-space-of-a-matrix",
  title: t("The Dimension of the Null Space of a Matrix", "零空间的维数（零度/虚度 Nullity）"),
  summary: t(
    "Define nullity(A) as dim(Null(A)), compute it as the number of free variables in Ax = 0, and relate nullity(A) = 0 to trivial null space.",
    "掌握矩阵零度 nullity(A) 作为 dim(Null(A)) 的定义，通过自由未知量个数进行计算，并理解 nullity(A) = 0 与零空间仅含零向量的等价性。",
  ),
  intro: t(
    "Suppose $A$ has reduced echelon form $\\begin{pmatrix} 1 & 0 & 2 & -1 \\\\ 0 & 1 & 3 & 0 \\end{pmatrix}$. Columns $3$ and $4$ have no pivot, so $x_3$ and $x_4$ are free, and $\\operatorname{nullity}(A) = 2$.\n\nCheck: setting $x_3 = 1, x_4 = 0$ and then $x_3 = 0, x_4 = 1$ gives the basis $(-2, -3, 1, 0)$ and $(1, 0, 0, 1)$ of $\\operatorname{Null}(A)$, two vectors.\n\nIn this lesson we find the nullity of a matrix by counting free variables and see what nullity $0$ says about the matrix.",
    "设 $A$ 的简化阶梯形为 $\\begin{pmatrix} 1 & 0 & 2 & -1 \\\\ 0 & 1 & 3 & 0 \\end{pmatrix}$。第 $3$、$4$ 列没有主元，所以 $x_3$、$x_4$ 是自由变量，$\\operatorname{nullity}(A) = 2$。\n\n检验：先取 $x_3 = 1, x_4 = 0$，再取 $x_3 = 0, x_4 = 1$，得到 $\\operatorname{Null}(A)$ 的基 $(-2, -3, 1, 0)$ 和 $(1, 0, 0, 1)$，共两个向量。\n\n本课我们通过数自由变量求矩阵的零度，并看零度为 $0$ 对矩阵意味着什么。",
  ),
  prerequisites: ["finding-a-basis-of-the-null-space-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "nullity-from-free-variables",
      title: t("Nullity equals the number of free variables", "零度等于自由未知量的个数"),
      explanation: t(
        "The dimension of $\\operatorname{Null}(A)$, called the nullity of $A$, equals the number of free variables in the homogeneous equation $A\\mathbf{x} = \\mathbf{0}$. Each free variable gives one basis vector of the null space. For example, if $A$ has $5$ columns and $3$ pivot columns, then $2$ variables are free and $\\operatorname{nullity}(A) = 2$.\n\n> **Watch out.** Subtract the pivot columns from the number of columns, not from the number of rows: the free variables are the columns without a pivot.",
        "$\\operatorname{Null}(A)$ 的维数称为矩阵 $A$ 的零度，等于齐次线性方程组 $A\\mathbf{x} = \\mathbf{0}$ 中自由未知量的个数。每个自由变量给出零空间的一个基向量。例如 $A$ 有 $5$ 列、$3$ 个主元列时，有 $2$ 个自由变量，$\\operatorname{nullity}(A) = 2$。\n\n> **注意。** 用列数减主元列数，而不是用行数减：自由变量对应没有主元的列。",
      ),
      generate(rng) {
        const n = rng.int(4, 15);
        const pivots = rng.int(1, n - 1);
        const freeVars = n - pivots;
        const prompt = t(
          `A matrix $A$ has $${n}$ columns and its reduced row echelon form has $${pivots}$ pivot columns. What is $\\text{nullity}(A) = \\dim(\\text{Null}(A))$?`,
          `矩阵 $A$ 拥有 $${n}$ 列，其简化行阶梯形有 $${pivots}$ 个主元列。矩阵 $A$ 的零度 $\\text{nullity}(A) = \\dim(\\text{Null}(A))$ 是多少？`,
        );
        const solution = walked(
          [
            [
              ["Count the free variables", "数自由变量"],
              t(
                `Each of the $${n}$ columns either has a pivot or gives a free variable of $A\\mathbf{x} = \\mathbf{0}$, so:`,
                `$${n}$ 列中每一列要么有主元，要么对应 $A\\mathbf{x} = \\mathbf{0}$ 的一个自由变量，所以：`,
              ),
              [`\\text{free variables} = ${n} - ${pivots} = ${freeVars}`],
            ],
            [
              ["Read the nullity", "读出零度"],
              t(
                `Each free variable gives one basis vector of $\\text{Null}(A)$, so $\\text{nullity}(A) = ${freeVars}$.`,
                `每个自由变量给出 $\\text{Null}(A)$ 的一个基向量，所以 $\\text{nullity}(A) = ${freeVars}$。`,
              ),
            ],
          ],
          t(
            `$\\text{rank} + \\text{nullity} = ${pivots} + ${freeVars} = ${n}$, the number of columns.`,
            `$\\text{rank} + \\text{nullity} = ${pivots} + ${freeVars} = ${n}$，正是列数。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: freeVars,
          form: "integer",
          mistakes: [
            why(
              pivots,
              "That is the number of pivot columns, the rank; the nullity counts the columns without a pivot.",
              "这是主元列数，即秩；零度数的是没有主元的列。",
            ),
            why(n, "That is the number of columns; the pivot columns must be taken away.", "这是列数；要减去主元列。"),
            why(
              0,
              `Nullity $0$ would need a pivot in every column, but only $${pivots}$ of the $${n}$ columns have one.`,
              `零度为 $0$ 需要每列都有主元，但 $${n}$ 列中只有 $${pivots}$ 列有。`,
            ),
          ].filter((m, i, all) => m.value !== freeVars && all.findIndex((o) => o.value === m.value) === i),
          solution,
        });
      },
    },
    {
      id: "nullity-zero-and-uniqueness",
      title: t("Nullity 0 and linear independence", "零度为 0 与线性无关的等价性"),
      explanation: t(
        "$\\operatorname{nullity}(A) = 0$ if and only if $\\operatorname{Null}(A) = \\{\\mathbf{0}\\}$, which means $A\\mathbf{x} = \\mathbf{0}$ has only the trivial solution and the columns of $A$ are linearly independent. For example, for $A = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\\\ 1 & 1 \\end{pmatrix}$ the first two rows of $A\\mathbf{x} = \\mathbf{0}$ already force $x_1 = x_2 = 0$, so the nullity is $0$ and the two columns are independent.\n\n> **Watch out.** Nullity $0$ is about the columns. It says nothing direct about the rows: the $3 \\times 2$ matrix above has nullity $0$, yet its three rows are dependent.",
        "$\\operatorname{nullity}(A) = 0$ 当且仅当 $\\operatorname{Null}(A) = \\{\\mathbf{0}\\}$，即 $A\\mathbf{x} = \\mathbf{0}$ 只有零解，且 $A$ 的列向量线性无关。例如对 $A = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\\\ 1 & 1 \\end{pmatrix}$，$A\\mathbf{x} = \\mathbf{0}$ 的前两行就迫使 $x_1 = x_2 = 0$，所以零度为 $0$，两列线性无关。\n\n> **注意。** 零度为 $0$ 说的是列。它不直接说明行：上面的 $3 \\times 2$ 矩阵零度为 $0$，但它的三行线性相关。",
      ),
      generate(rng) {
        const m = rng.int(3, 10);
        const n = rng.int(2, m);
        const prompt = t(
          `What does $\\text{nullity}(A) = 0$ imply about ${article(m)} $${m} \\times ${n}$ matrix $A$?`,
          `对于一个 $${m} \\times ${n}$ 矩阵 $A$，$\\text{nullity}(A) = 0$ 意味着什么？`,
        );
        const right = t(
          `$A\\mathbf{x} = \\mathbf{0}$ has only the trivial solution, and the columns of $A$ are linearly independent`,
          `$A\\mathbf{x} = \\mathbf{0}$ 仅有零解，且 $A$ 的列向量线性无关`,
        );
        const rowsClaim =
          m === n
            ? t(`The rows of $A$ are linearly dependent`, `$A$ 的行向量必定线性相关`)
            : t(`The rows of $A$ are linearly independent`, `$A$ 的行向量线性无关`);
        const wrong = [
          t(`$A\\mathbf{x} = \\mathbf{0}$ has infinitely many solutions`, `$A\\mathbf{x} = \\mathbf{0}$ 有无穷多解`),
          rowsClaim,
          t(`$A$ is the zero matrix`, `$A$ 必定是零矩阵`),
        ];
        const solution = walked(
          [
            [
              ["Read the nullity", "读出零度"],
              t(
                "$\\text{nullity}(A) = 0$ means $\\text{Null}(A)$ has dimension $0$, so $\\text{Null}(A) = \\{\\mathbf{0}\\}$ and $A\\mathbf{x} = \\mathbf{0}$ has only the solution $\\mathbf{x} = \\mathbf{0}$.",
                "$\\text{nullity}(A) = 0$ 表示 $\\text{Null}(A)$ 的维数为 $0$，所以 $\\text{Null}(A) = \\{\\mathbf{0}\\}$，$A\\mathbf{x} = \\mathbf{0}$ 只有解 $\\mathbf{x} = \\mathbf{0}$。",
              ),
            ],
            [
              ["Translate to the columns", "转化为列的语言"],
              t(
                "A relation $c_1\\mathbf{a}_1 + \\dots + c_n\\mathbf{a}_n = \\mathbf{0}$ among the columns is a solution $\\mathbf{x} = (c_1, \\dots, c_n)$, so every $c_i = 0$: the columns are independent.",
                "列之间的关系 $c_1\\mathbf{a}_1 + \\dots + c_n\\mathbf{a}_n = \\mathbf{0}$ 就是一个解 $\\mathbf{x} = (c_1, \\dots, c_n)$，所以每个 $c_i = 0$：各列线性无关。",
              ),
            ],
          ],
          t(
            `$\\text{rank}(A) = ${n} - 0 = ${n}$, so each of the $${n}$ columns has a pivot.`,
            `$\\text{rank}(A) = ${n} - 0 = ${n}$，所以 $${n}$ 列每列都有主元。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "Infinitely many solutions would need a free variable, that is, nullity at least $1$.",
            "无穷多解需要有自由变量，即零度至少为 $1$。",
          ],
          [
            rowsClaim.en,
            m === n
              ? `For a square matrix, rank $${n}$ means the $${n}$ rows are independent too.`
              : `The rank is $${n}$, but there are $${m}$ rows, so the rows are dependent, not independent.`,
            m === n
              ? `对方阵而言，秩为 $${n}$ 意味着 $${n}$ 行也线性无关。`
              : `秩为 $${n}$，但有 $${m}$ 行，所以各行线性相关，而不是线性无关。`,
          ],
          [
            wrong[2]!.en,
            `The zero matrix is the opposite extreme: its nullity is $${n}$, since every vector solves $A\\mathbf{x} = \\mathbf{0}$.`,
            `零矩阵是另一个极端：它的零度是 $${n}$，因为每个向量都满足 $A\\mathbf{x} = \\mathbf{0}$。`,
          ],
        ]);
      },
    },
  ],
};

/** theInvertibleMatrixTheoremInTermsOfDimensionRankAndNullity connects invertibility of n x n matrices to rank n, nullity 0, and spanning. */
export const theInvertibleMatrixTheoremInTermsOfDimensionRankAndNullity: TopicDef = {
  id: "the-invertible-matrix-theorem-in-terms-of-dimension-rank-and-nullity",
  title: t("The Invertible Matrix Theorem in Terms of Dimension, Rank and Nullity", "可逆矩阵等价命题（秩与维数角度）"),
  summary: t(
    "Characterize the invertibility of an $n \\times n$ matrix in terms of $\\operatorname{rank}(A) = n$, $\\operatorname{nullity}(A) = 0$, $\\operatorname{Col}(A) = \\mathbb{R}^n$, and $\\operatorname{Null}(A) = \\{\\mathbf{0}\\}$.",
    "从 $\\operatorname{rank}(A) = n$、$\\operatorname{nullity}(A) = 0$、$\\operatorname{Col}(A) = \\mathbb{R}^n$ 及 $\\operatorname{Null}(A) = \\{\\mathbf{0}\\}$ 等秩与维数的角度表述 $n$ 阶方阵的可逆等价条件。",
  ),
  intro: t(
    "Take $A = \\begin{pmatrix} 2 & 1 \\\\ 4 & 2 \\end{pmatrix}$. Subtracting $2$ times row $1$ from row $2$ leaves one pivot, so $\\operatorname{rank}(A) = 1 < 2$, $\\operatorname{nullity}(A) = 1$, and $A$ is not invertible.\n\nCheck: $\\det A = 2 \\cdot 2 - 1 \\cdot 4 = 0$, and $A(1, -2) = (2 - 2, 4 - 4) = (0, 0)$, a nonzero vector in $\\operatorname{Null}(A)$.\n\nIn this lesson we state invertibility of a square matrix through rank, nullity, column space and null space, and draw the consequences when the rank falls short.",
    "取 $A = \\begin{pmatrix} 2 & 1 \\\\ 4 & 2 \\end{pmatrix}$。第 $2$ 行减去第 $1$ 行的 $2$ 倍后只剩一个主元，所以 $\\operatorname{rank}(A) = 1 < 2$，$\\operatorname{nullity}(A) = 1$，$A$ 不可逆。\n\n检验：$\\det A = 2 \\cdot 2 - 1 \\cdot 4 = 0$，且 $A(1, -2) = (2 - 2, 4 - 4) = (0, 0)$，是 $\\operatorname{Null}(A)$ 中的非零向量。\n\n本课我们用秩、零度、列空间和零空间表述方阵的可逆性，并推出秩不足时的结论。",
  ),
  prerequisites: ["the-rank-of-a-matrix", "the-dimension-of-the-null-space-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "imt-rank-conditions-n-by-n",
      title: t("Invertibility statements for rank and nullity", "秩与零度视角的方阵可逆等价命题"),
      explanation: t(
        "For a square matrix, having a pivot in every column, full rank and a zero null space all express the same fact: the matrix is invertible. For an $n \\times n$ matrix $A$, the following are equivalent: (1) $A$ is invertible; (2) $\\operatorname{rank}(A) = n$; (3) $\\operatorname{nullity}(A) = 0$; (4) $\\operatorname{Col}(A) = \\mathbb{R}^n$; (5) $\\operatorname{Null}(A) = \\{\\mathbf{0}\\}$. For example, a $3 \\times 3$ matrix of rank $3$ has nullity $3 - 3 = 0$, its columns span $\\mathbb{R}^3$, and it is invertible.\n\n> **Watch out.** These equivalences are for square matrices only: a $3 \\times 2$ matrix can have nullity $0$ without being invertible.",
        "对于方阵，每列都有主元、满秩和零空间只含零向量都表达同一个事实：矩阵可逆。对 $n \\times n$ 矩阵 $A$，以下条件相互等价：(1) $A$ 可逆；(2) $\\operatorname{rank}(A) = n$；(3) $\\operatorname{nullity}(A) = 0$；(4) $\\operatorname{Col}(A) = \\mathbb{R}^n$；(5) $\\operatorname{Null}(A) = \\{\\mathbf{0}\\}$。例如秩为 $3$ 的 $3 \\times 3$ 矩阵零度为 $3 - 3 = 0$，各列张成 $\\mathbb{R}^3$，矩阵可逆。\n\n> **注意。** 这些等价只对方阵成立：$3 \\times 2$ 矩阵可以零度为 $0$ 却不可逆。",
      ),
      generate(rng) {
        const n = rng.int(3, 30);
        const prompt = t(
          `Let $A$ be ${article(n)} $${n} \\times ${n}$ square matrix. Which of the following conditions is equivalent to $A$ being invertible?`,
          `设 $A$ 为一个 $${n} \\times ${n}$ 方阵。下列哪一个条件与 $A$ 可逆等价？`,
        );
        const right = t(`$\\text{rank}(A) = ${n}$ and $\\text{nullity}(A) = 0$`, `$\\text{rank}(A) = ${n}$ 且 $\\text{nullity}(A) = 0$`);
        const wrong = [
          t(`$\\text{rank}(A) = 0$ and $\\text{nullity}(A) = ${n}$`, `$\\text{rank}(A) = 0$ 且 $\\text{nullity}(A) = ${n}$`),
          t(`$\\text{Col}(A)$ is a line in $\\mathbb{R}^{${n}}$`, `$\\text{Col}(A)$ 是 $\\mathbb{R}^{${n}}$ 中的一条直线`),
          t(`$\\text{Null}(A)$ contains non-zero vectors`, `$\\text{Null}(A)$ 包含非零向量`),
        ];
        const solution = walked(
          [
            [
              ["Invertible means full rank", "可逆即满秩"],
              t(
                `An $${n} \\times ${n}$ matrix is invertible exactly when its reduced echelon form is $I$, that is, when all $${n}$ columns have pivots: $\\text{rank}(A) = ${n}$.`,
                `$${n} \\times ${n}$ 矩阵可逆，当且仅当它的简化阶梯形是 $I$，即 $${n}$ 列都有主元：$\\text{rank}(A) = ${n}$。`,
              ),
            ],
            [
              ["Apply rank-nullity", "应用秩-零度定理"],
              t(`Then the nullity is:`, `于是零度为：`),
              [`\\text{nullity}(A) = ${n} - ${n} = 0`],
            ],
          ],
          t(
            `Conversely, nullity $0$ gives rank $${n} - 0 = ${n}$, so the two conditions together are equivalent to invertibility.`,
            `反过来，零度为 $0$ 给出秩 $${n} - 0 = ${n}$，所以这两个条件合起来与可逆等价。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [wrong[0]!.en, "Rank $0$ is the zero matrix, the furthest from invertible.", "秩为 $0$ 的是零矩阵，离可逆最远。"],
          [
            wrong[1]!.en,
            `A line has dimension $1$, so the rank would be $1 < ${n}$ and $A$ would not be invertible.`,
            `直线的维数是 $1$，所以秩为 $1 < ${n}$，$A$ 不可逆。`,
          ],
          [
            wrong[2]!.en,
            "A nonzero $\\mathbf{x}$ with $A\\mathbf{x} = \\mathbf{0}$ means two inputs, $\\mathbf{x}$ and $\\mathbf{0}$, give the same output, so $A$ cannot be undone.",
            "有非零 $\\mathbf{x}$ 使 $A\\mathbf{x} = \\mathbf{0}$，说明 $\\mathbf{x}$ 和 $\\mathbf{0}$ 两个输入给出同一输出，所以 $A$ 无法逆转。",
          ],
        ]);
      },
    },
    {
      id: "imt-singular-matrix-deductions",
      title: t("Deductions for non-invertible square matrices", "奇异矩阵的维数推论"),
      explanation: t(
        "If an $n \\times n$ matrix has $\\operatorname{rank}(A) < n$, then $\\operatorname{nullity}(A) \\ge 1$ and $\\det(A) = 0$, and its columns are linearly dependent and do not span $\\mathbb{R}^n$. For example, a $4 \\times 4$ matrix of rank $3$ has nullity $4 - 3 = 1$, its columns span only a $3$-dimensional subspace, and it is not invertible.\n\n> **Watch out.** Rank below $n$ rules out every invertibility condition at once: $\\operatorname{Col}(A) \\ne \\mathbb{R}^n$ and $\\operatorname{Null}(A) \\ne \\{\\mathbf{0}\\}$.",
        "若 $n \\times n$ 矩阵满足 $\\operatorname{rank}(A) < n$，则 $\\operatorname{nullity}(A) \\ge 1$，$\\det(A) = 0$，其列向量线性相关且不能张成 $\\mathbb{R}^n$。例如秩为 $3$ 的 $4 \\times 4$ 矩阵零度为 $4 - 3 = 1$，各列只张成一个 $3$ 维子空间，矩阵不可逆。\n\n> **注意。** 秩小于 $n$ 会同时否定所有可逆条件：$\\operatorname{Col}(A) \\ne \\mathbb{R}^n$，$\\operatorname{Null}(A) \\ne \\{\\mathbf{0}\\}$。",
      ),
      generate(rng) {
        const n = rng.int(3, 15);
        const r = rng.int(1, n - 1);
        const nullity = n - r;
        const prompt = t(
          `${article(n, true)} $${n} \\times ${n}$ matrix $A$ has $\\text{rank}(A) = ${r}$. Which statement must be true?`,
          `一个 $${n} \\times ${n}$ 方阵 $A$ 满足 $\\text{rank}(A) = ${r}$。下列哪个断言必定成立？`,
        );
        const right = t(`$\\text{nullity}(A) = ${nullity}$, and $A$ is not invertible`, `$\\text{nullity}(A) = ${nullity}$，且 $A$ 不可逆`);
        const wrong = [
          t(`$A$ is invertible`, `$A$ 可逆`),
          t(`$\\text{Col}(A) = \\mathbb{R}^{${n}}$`, `$\\text{Col}(A) = \\mathbb{R}^{${n}}$`),
          t(`$\\text{Null}(A) = \\{\\mathbf{0}\\}$`, `$\\text{Null}(A) = \\{\\mathbf{0}\\}$`),
        ];
        const solution = walked(
          [
            [
              ["Compare the rank with $n$", "把秩与 $n$ 比较"],
              t(
                `$\\text{rank}(A) = ${r} < ${n}$, so some column has no pivot and $A$ is not invertible.`,
                `$\\text{rank}(A) = ${r} < ${n}$，所以有的列没有主元，$A$ 不可逆。`,
              ),
            ],
            [
              ["Apply rank-nullity", "应用秩-零度定理"],
              t("The nullity is the number of columns minus the rank:", "零度等于列数减秩："),
              [`\\text{nullity}(A) = ${n} - ${r} = ${nullity}`],
            ],
          ],
          t(`$${r} + ${nullity} = ${n}$, the number of columns.`, `$${r} + ${nullity} = ${n}$，正是列数。`),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [wrong[0]!.en, `Invertibility needs rank $${n}$, and the rank is only $${r}$.`, `可逆需要秩为 $${n}$，而秩只有 $${r}$。`],
          [
            wrong[1]!.en,
            `$\\text{Col}(A)$ has dimension $${r}$, less than $${n}$, so it is not all of $\\mathbb{R}^{${n}}$.`,
            `$\\text{Col}(A)$ 的维数是 $${r}$，小于 $${n}$，所以不是整个 $\\mathbb{R}^{${n}}$。`,
          ],
          [
            wrong[2]!.en,
            `$\\text{Null}(A)$ has dimension $${nullity} \\ge 1$, so it contains nonzero vectors.`,
            `$\\text{Null}(A)$ 的维数是 $${nullity} \\ge 1$，所以含非零向量。`,
          ],
        ]);
      },
    },
  ],
};

/** theRankNullityTheorem covers rank(A) + nullity(A) = n and applying it to linear systems. */
export const theRankNullityTheorem: TopicDef = {
  id: "the-rank-nullity-theorem",
  title: t("The Rank-Nullity Theorem", "秩-零度定理"),
  summary: t(
    "Apply the Rank-Nullity Theorem: for any m × n matrix A, rank(A) + nullity(A) = n (the number of columns).",
    "掌握并应用秩-零度定理：对任意 m × n 矩阵 A，恒有 rank(A) + nullity(A) = n（总列数）。",
  ),
  intro: t(
    "A $3 \\times 5$ matrix $A$ of rank $2$ has $2$ pivot columns, and the other $5 - 2 = 3$ columns give free variables, so $\\operatorname{nullity}(A) = 3$.\n\nCheck: $\\operatorname{rank}(A) + \\operatorname{nullity}(A) = 2 + 3 = 5$, the number of columns, and the $3$ rows played no part in the count.\n\nIn this lesson we use $\\operatorname{rank}(A) + \\operatorname{nullity}(A) = n$ to find one of the two from the other, and to find the dimension of the solution space of a homogeneous system.",
    "秩为 $2$ 的 $3 \\times 5$ 矩阵 $A$ 有 $2$ 个主元列，其余 $5 - 2 = 3$ 列对应自由变量，所以 $\\operatorname{nullity}(A) = 3$。\n\n检验：$\\operatorname{rank}(A) + \\operatorname{nullity}(A) = 2 + 3 = 5$，正是列数，$3$ 个行在计数中不起作用。\n\n本课我们用 $\\operatorname{rank}(A) + \\operatorname{nullity}(A) = n$ 由其中一个求另一个，并求齐次方程组解空间的维数。",
  ),
  prerequisites: ["the-rank-of-a-matrix", "the-dimension-of-the-null-space-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "rank-nullity-computation",
      title: t("Rank-Nullity formula computation", "应用秩-零度公式进行计算"),
      explanation: t(
        "The theorem splits the columns into those with pivots, which give the rank, and those with free variables, which give the nullity. For an $m \\times n$ matrix $A$, $\\operatorname{rank}(A) + \\operatorname{nullity}(A) = n$: every column is either a pivot column or corresponds to a free variable. For example, a $4 \\times 6$ matrix of rank $4$ has nullity $6 - 4 = 2$.\n\n> **Watch out.** Use $n$, the number of columns; the number of rows does not enter the formula.",
        "这个定理把各列分成有主元的列和对应自由变量的列，前者给出秩，后者给出零度。对于 $m \\times n$ 矩阵 $A$，$\\operatorname{rank}(A) + \\operatorname{nullity}(A) = n$：每一列要么是主元列，要么对应一个自由未知量。例如秩为 $4$ 的 $4 \\times 6$ 矩阵零度为 $6 - 4 = 2$。\n\n> **注意。** 要用列数 $n$；行数不出现在公式中。",
      ),
      generate(rng) {
        const m = rng.int(3, 10);
        const n = rng.int(4, 12);
        const r = rng.int(1, Math.min(m, n) - 1);
        const nullity = n - r;
        const prompt = t(
          `A matrix $A$ has $${m}$ rows and $${n}$ columns. If $\\text{rank}(A) = ${r}$, what is $\\text{nullity}(A) = \\dim(\\text{Null}(A))$?`,
          `矩阵 $A$ 拥有 $${m}$ 行和 $${n}$ 列。若 $\\text{rank}(A) = ${r}$，则 $\\text{nullity}(A) = \\dim(\\text{Null}(A))$ 等于多少？`,
        );
        const solution = walked(
          [
            [
              ["State the theorem", "写出定理"],
              t(`For a matrix with $n = ${n}$ columns:`, `对有 $n = ${n}$ 列的矩阵：`),
              [`\\text{rank}(A) + \\text{nullity}(A) = ${n}`],
            ],
            [["Solve for the nullity", "解出零度"], t("", ""), [`\\text{nullity}(A) = ${n} - ${r} = ${nullity}`]],
          ],
          t(
            `$${r} + ${nullity} = ${n}$: $${r}$ pivot columns and $${nullity}$ free variables account for all $${n}$ columns.`,
            `$${r} + ${nullity} = ${n}$：$${r}$ 个主元列和 $${nullity}$ 个自由变量正好对应全部 $${n}$ 列。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: nullity,
          form: "integer",
          mistakes: [
            why(
              m - r,
              "That subtracts the rank from the number of rows; the theorem uses the number of columns.",
              "这是用行数减秩；定理用的是列数。",
            ),
            why(r, "That is the rank itself; the nullity is what remains of the columns.", "这就是秩本身；零度是列数中剩下的部分。"),
            why(
              n + r,
              "The rank and the nullity add up to $n$, so the rank must be subtracted, not added.",
              "秩与零度之和是 $n$，所以要减去秩，而不是加上。",
            ),
          ].filter((w, i, all) => w.value !== nullity && all.findIndex((o) => o.value === w.value) === i),
          solution,
        });
      },
    },
    {
      id: "rank-nullity-homogeneous-system-analysis",
      title: t("Solution space dimension of homogeneous systems", "齐次线性方程组解空间的维数"),
      explanation: t(
        "Each free variable adds one dimension to the solution space, and the number of free variables is the number of variables minus the rank. A homogeneous system $A\\mathbf{x} = \\mathbf{0}$ of $m$ linear equations in $n$ variables has a solution space of dimension $n - \\operatorname{rank}(A)$. For example, $5$ equations in $7$ variables with a coefficient matrix of rank $4$ have a solution space of dimension $7 - 4 = 3$.\n\n> **Watch out.** Subtract the rank from the number of variables, not from the number of equations.",
        "每个自由变量为解空间增加一维，自由变量的个数等于变量个数减去秩。含 $n$ 个未知量、$m$ 个方程的齐次线性方程组 $A\\mathbf{x} = \\mathbf{0}$，其解空间的维数等于 $n - \\operatorname{rank}(A)$。例如 $7$ 个未知量、$5$ 个方程、系数矩阵秩为 $4$ 的方程组，解空间维数为 $7 - 4 = 3$。\n\n> **注意。** 用未知量个数减秩，而不是用方程个数减秩。",
      ),
      generate(rng) {
        const m = rng.int(3, 12);
        const n = rng.int(4, 15);
        const r = rng.int(1, Math.min(m, n) - 1);
        const dimSol = n - r;
        const prompt = t(
          `A homogeneous system of $${m}$ linear equations in $${n}$ variables has coefficient matrix with rank $${r}$. What is the dimension of the solution space?`,
          `一个由 $${m}$ 个方程与 $${n}$ 个未知量组成的齐次线性方程组，其系数矩阵的秩为 $${r}$。该方程组解空间的维数是多少？`,
        );
        const solution = walked(
          [
            [
              ["Name the solution space", "认出解空间"],
              t(
                `The solutions of $A\\mathbf{x} = \\mathbf{0}$ form $\\text{Null}(A)$, and $A$ has one column per variable: $${n}$ columns.`,
                `$A\\mathbf{x} = \\mathbf{0}$ 的解构成 $\\text{Null}(A)$，$A$ 每个未知量对应一列：共 $${n}$ 列。`,
              ),
            ],
            [
              ["Apply rank-nullity", "应用秩-零度定理"],
              t("", ""),
              [`\\dim(\\text{Null}(A)) = n - \\text{rank}(A) = ${n} - ${r} = ${dimSol}`],
            ],
          ],
          t(
            `There are $${r}$ pivot variables and $${dimSol}$ free variables, $${r} + ${dimSol} = ${n}$ in all, and each free variable gives one basis vector of the solution space.`,
            `共有 $${r}$ 个主元变量和 $${dimSol}$ 个自由变量，合计 $${r} + ${dimSol} = ${n}$ 个，每个自由变量给出解空间的一个基向量。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: dimSol,
          form: "integer",
          mistakes: [
            why(
              m - r,
              "That subtracts the rank from the number of equations; the free variables come from the variables.",
              "这是用方程个数减秩；自由变量来自未知量。",
            ),
            why(
              r,
              "That is the rank, the number of pivot variables; the solution space has one dimension per free variable.",
              "这是秩，即主元变量个数；解空间每个自由变量贡献一维。",
            ),
            why(
              n,
              "That is the number of variables; the pivot variables are determined by the free ones and add no dimension.",
              "这是未知量个数；主元变量由自由变量决定，不增加维数。",
            ),
          ].filter((w, i, all) => w.value !== dimSol && all.findIndex((o) => o.value === w.value) === i),
          solution,
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 3.13: ABSTRACT VECTOR SPACES
// ════════════════════════════════════════════════════════════════════════════

/** introductionToAbstractVectorSpaces covers generalizing vectors to polynomials, matrices, and continuous functions. */
export const introductionToAbstractVectorSpaces: TopicDef = {
  id: "introduction-to-abstract-vector-spaces",
  title: t("Introduction to Abstract Vector Spaces", "抽象向量空间的概念"),
  summary: t(
    "Generalize vectors beyond $\\mathbb{R}^n$ to polynomial spaces $\\mathbb{P}_n$, matrix spaces $M_{m \\times n}$, and continuous functions $C[a, b]$, identifying their operations and zero vectors.",
    "将向量概念由 $\\mathbb{R}^n$ 推广至多项式空间 $\\mathbb{P}_n$、矩阵空间 $M_{m \\times n}$ 及连续函数空间 $C[a, b]$，理解其运算与零向量。",
  ),
  intro: t(
    "In $\\mathbb{P}_2$, add $p(t) = 1 + 2t$ and $q(t) = 3 - t + t^2$ coefficient by coefficient: $p + q = 4 + t + t^2$, and $2p = 2 + 4t$. Both results are again polynomials of degree at most $2$, so they stay in $\\mathbb{P}_2$, just as sums and multiples of vectors stay in $\\mathbb{R}^3$.\n\nCheck: the zero polynomial $0$ works as the zero vector, since $p + 0 = 1 + 2t = p$.\n\nIn this lesson we treat polynomials, matrices and functions as vectors and find the zero vector of each of these spaces.",
    "在 $\\mathbb{P}_2$ 中，把 $p(t) = 1 + 2t$ 和 $q(t) = 3 - t + t^2$ 逐项系数相加：$p + q = 4 + t + t^2$，且 $2p = 2 + 4t$。两个结果仍是次数不超过 $2$ 的多项式，所以仍在 $\\mathbb{P}_2$ 中，正如 $\\mathbb{R}^3$ 中向量的和与倍数仍在 $\\mathbb{R}^3$ 中。\n\n检验：零多项式 $0$ 起零向量的作用，因为 $p + 0 = 1 + 2t = p$。\n\n本课我们把多项式、矩阵和函数看作向量，并找出这些空间各自的零向量。",
  ),
  prerequisites: ["the-rank-nullity-theorem"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "abstract-vectors-elements",
      title: t("Objects in abstract vector spaces", "抽象向量空间中的元素与运算"),
      explanation: t(
        'In abstract linear algebra, "vectors" are the elements of any set with an addition and a scalar multiplication satisfying the vector space axioms, such as polynomials in $\\mathbb{P}_n$ or matrices in $M_{m \\times n}$. For example, $\\mathbb{P}_3$ contains $1 - t^2$, $5t^3$ and also the constant $7$, since "degree at most $3$" includes lower degrees.\n\n> **Watch out.** $\\mathbb{P}_n$ means degree at most $n$, not exactly $n$: polynomials of exact degree $n$ alone are not closed under addition, since $t^n + (-t^n) = 0$.',
        '在抽象线性代数中，"向量"指任何满足向量空间公理的集合中的元素，例如多项式空间 $\\mathbb{P}_n$ 中的多项式或矩阵空间 $M_{m \\times n}$ 中的矩阵。例如 $\\mathbb{P}_3$ 含有 $1 - t^2$、$5t^3$，也含有常数 $7$，因为"次数至多为 $3$"包括更低的次数。\n\n> **注意。** $\\mathbb{P}_n$ 指次数至多为 $n$，而不是恰好为 $n$：仅由恰好 $n$ 次的多项式组成的集合对加法不封闭，因为 $t^n + (-t^n) = 0$。',
      ),
      generate(rng) {
        const n = rng.int(2, 30);
        const prompt = t(
          `In the polynomial vector space $\\mathbb{P}_{${n}}$, what mathematical objects play the role of 'vectors'?`,
          `在多项式向量空间 $\\mathbb{P}_{${n}}$ 中，什么数学对象充当'向量'的角色？`,
        );
        const right = t(
          `All polynomials with real coefficients of degree at most $${n}$, together with the zero polynomial`,
          `次数不超过 $${n}$ 的实系数多项式及零多项式`,
        );
        const wrong = [
          t(`Only polynomials of degree exactly equal to $${n}$`, `次数严格等于 $${n}$ 的多项式`),
          t(`Column vectors in $\\mathbb{R}^{${n}}$ whose entries are integers`, `分量为整数的 $\\mathbb{R}^{${n}}$ 列向量`),
          t(`All rational functions $p(x)/q(x)$ of degree at most $${n}$`, `次数不超过 $${n}$ 的所有有理分式 $p(x)/q(x)$`),
        ];
        const solution = walked(
          [
            [
              ["Recall the definition", "回顾定义"],
              t(
                `$\\mathbb{P}_{${n}}$ is the set of all $p(t) = a_0 + a_1 t + \\dots + a_{${n}} t^{${n}}$ with real coefficients, so its degree is at most $${n}$, and the zero polynomial is included.`,
                `$\\mathbb{P}_{${n}}$ 是所有实系数 $p(t) = a_0 + a_1 t + \\dots + a_{${n}} t^{${n}}$ 的集合，所以次数至多为 $${n}$，且包含零多项式。`,
              ),
            ],
            [
              ["Check the operations", "检验运算"],
              t(
                `Adding two such polynomials adds their coefficients, and scaling multiplies them, so the results are again in $\\mathbb{P}_{${n}}$: these polynomials are the vectors.`,
                `两个这样的多项式相加就是系数相加，数乘就是系数相乘，结果仍在 $\\mathbb{P}_{${n}}$ 中：这些多项式就是向量。`,
              ),
            ],
          ],
          t(
            `$t^{${n}} + (1 - t^{${n}}) = 1$ has degree $0$, and it is still in $\\mathbb{P}_{${n}}$, as it must be.`,
            `$t^{${n}} + (1 - t^{${n}}) = 1$ 的次数为 $0$，仍在 $\\mathbb{P}_{${n}}$ 中，正应如此。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `Exact degree $${n}$ is too narrow: $t^{${n}} + (1 - t^{${n}}) = 1$ leaves that set, and the zero polynomial is not in it.`,
            `恰好 $${n}$ 次太窄了：$t^{${n}} + (1 - t^{${n}}) = 1$ 不在这个集合中，零多项式也不在。`,
          ],
          [
            wrong[1]!.en,
            "The vectors of $\\mathbb{P}_n$ are polynomials, not columns of numbers, and integer entries are not closed under real multiples.",
            "$\\mathbb{P}_n$ 的向量是多项式，不是数列，而且整数分量对实数倍不封闭。",
          ],
          [
            wrong[2]!.en,
            "A quotient $p(x)/q(x)$ is generally not a polynomial, so it is not an element of $\\mathbb{P}_n$.",
            "商 $p(x)/q(x)$ 一般不是多项式，所以不是 $\\mathbb{P}_n$ 的元素。",
          ],
        ]);
      },
    },
    {
      id: "zero-vector-in-abstract-spaces",
      title: t("The zero vector in abstract spaces", "抽象空间中的零向量"),
      explanation: t(
        "Every vector space $V$ has a unique zero vector $\\mathbf{0}$ satisfying $\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$ for all $\\mathbf{v} \\in V$. In $\\mathbb{P}_n$ it is the zero polynomial $0$, in $M_{m \\times n}$ it is the $m \\times n$ zero matrix $O$, and in $C[a, b]$ it is the constant zero function $f(x) = 0$. For example, in $M_{2 \\times 3}$, $\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix} + O$ leaves every entry unchanged.\n\n> **Watch out.** The zero vector belongs to the space itself: in a matrix space it is a matrix of the right size, not the number $0$ and not the identity matrix.",
        "每个向量空间 $V$ 都有唯一的零向量 $\\mathbf{0}$，对所有 $\\mathbf{v} \\in V$ 满足 $\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$。在 $\\mathbb{P}_n$ 中为零多项式 $0$，在 $M_{m \\times n}$ 中为 $m \\times n$ 零矩阵 $O$，在 $C[a, b]$ 中为恒零函数 $f(x) = 0$。例如在 $M_{2 \\times 3}$ 中，$\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix} + O$ 的每个元素都不变。\n\n> **注意。** 零向量属于这个空间本身：在矩阵空间中它是尺寸合适的矩阵，不是数 $0$，也不是单位矩阵。",
      ),
      generate(rng) {
        const space = rng.pick(["matrices", "functions", "polynomials"]);
        if (space === "matrices") {
          const m = rng.int(2, 6);
          const n = rng.int(2, 6);
          const prompt = t(
            `What is the zero vector in the vector space $M_{${m} \\times ${n}}$ of all $${m} \\times ${n}$ real matrices?`,
            `在所有 $${m} \\times ${n}$ 实矩阵构成的向量空间 $M_{${m} \\times ${n}}$ 中，零向量是什么？`,
          );
          const right = t(
            `The $${m} \\times ${n}$ zero matrix $O$ with all entries equal to 0`,
            `所有元素均为 0 的 $${m} \\times ${n}$ 零矩阵 $O$`,
          );
          const wrong = [
            t(`The identity matrix $I$`, `单位矩阵 $I$`),
            t(`The scalar number $0$`, `实数标量 $0$`),
            t(`The column vector of length $${m}$ with all 0s`, `长度为 $${m}$ 的全零列向量`),
          ];
          const solution = walked(
            [
              [
                ["State the requirement", "写出要求"],
                t(
                  `The zero vector $O$ must be an $${m} \\times ${n}$ matrix with $A + O = A$ for every $A$ in $M_{${m} \\times ${n}}$.`,
                  `零向量 $O$ 必须是 $${m} \\times ${n}$ 矩阵，且对 $M_{${m} \\times ${n}}$ 中每个 $A$ 都有 $A + O = A$。`,
                ),
              ],
              [
                ["Solve entry by entry", "逐个元素求解"],
                t(
                  "Addition is entrywise, so each entry of $O$ satisfies $a_{ij} + o_{ij} = a_{ij}$, giving $o_{ij} = 0$.",
                  "加法逐元素进行，所以 $O$ 的每个元素满足 $a_{ij} + o_{ij} = a_{ij}$，得 $o_{ij} = 0$。",
                ),
              ],
            ],
            t(
              `Whatever the entries of $A$, adding the all-zero $${m} \\times ${n}$ matrix changes nothing, so $O$ is the zero vector.`,
              `无论 $A$ 的元素是什么，加上全零的 $${m} \\times ${n}$ 矩阵都不改变它，所以 $O$ 是零向量。`,
            ),
          );
          return reasoned(oneOf(rng, prompt, right, wrong, solution), [
            [
              wrong[0]!.en,
              "$A + I$ adds $1$ to each diagonal entry, so it changes $A$; $I$ is the identity for multiplication, not addition.",
              "$A + I$ 会给每个对角元加 $1$，改变了 $A$；$I$ 是乘法的单位元，不是加法的。",
            ],
            [
              wrong[1]!.en,
              `The number $0$ is not an element of $M_{${m} \\times ${n}}$; the zero vector must be a matrix of that size.`,
              `数 $0$ 不是 $M_{${m} \\times ${n}}$ 的元素；零向量必须是这个尺寸的矩阵。`,
            ],
            [
              wrong[2]!.en,
              `A column of length $${m}$ is not an $${m} \\times ${n}$ matrix, so it cannot be added to the elements of this space.`,
              `长度为 $${m}$ 的列不是 $${m} \\times ${n}$ 矩阵，不能与这个空间的元素相加。`,
            ],
          ]);
        }
        if (space === "functions") {
          const a = rng.int(-5, 0);
          const b = rng.int(1, 6);
          const prompt = t(
            `What is the zero vector in the vector space $C[${a}, ${b}]$ of continuous real-valued functions?`,
            `在连续实函数构成的向量空间 $C[${a}, ${b}]$ 中，零向量是什么？`,
          );
          const right = t(
            `The constant zero function $z(x) = 0$ for all $x \\in [${a}, ${b}]$`,
            `在区间 $[${a}, ${b}]$ 上恒等于 0 的常数函数 $z(x) = 0$`,
          );
          const wrong = [
            t(`The constant function $f(x) = 1$`, `常数函数 $f(x) = 1$`),
            t(`The identity function $f(x) = x$`, `恒等函数 $f(x) = x$`),
            t(`The origin $(0, 0)$ in $\\mathbb{R}^2$`, `$\\mathbb{R}^2$ 中的原点 $(0, 0)$`),
          ];
          const solution = walked(
            [
              [
                ["State the requirement", "写出要求"],
                t(
                  `The zero vector $z$ must be a continuous function on $[${a}, ${b}]$ with $f + z = f$ for every $f$.`,
                  `零向量 $z$ 必须是 $[${a}, ${b}]$ 上的连续函数，且对每个 $f$ 都有 $f + z = f$。`,
                ),
              ],
              [
                ["Solve point by point", "逐点求解"],
                t(
                  `Functions add pointwise, so $f(x) + z(x) = f(x)$ for each $x \\in [${a}, ${b}]$, giving $z(x) = 0$ everywhere.`,
                  `函数逐点相加，所以对每个 $x \\in [${a}, ${b}]$ 有 $f(x) + z(x) = f(x)$，得处处 $z(x) = 0$。`,
                ),
              ],
            ],
            t(
              `$z(x) = 0$ is continuous, so it lies in $C[${a}, ${b}]$, and $(f + z)(x) = f(x) + 0 = f(x)$.`,
              `$z(x) = 0$ 是连续的，所以在 $C[${a}, ${b}]$ 中，且 $(f + z)(x) = f(x) + 0 = f(x)$。`,
            ),
          );
          return reasoned(oneOf(rng, prompt, right, wrong, solution), [
            [
              wrong[0]!.en,
              "Adding $1$ raises every value by $1$, so $f + 1 \\ne f$.",
              "加上 $1$ 使每个函数值增加 $1$，所以 $f + 1 \\ne f$。",
            ],
            [
              wrong[1]!.en,
              "Adding $x$ changes $f(x)$ to $f(x) + x$; the identity function is not the additive zero.",
              "加上 $x$ 把 $f(x)$ 变成 $f(x) + x$；恒等函数不是加法的零元。",
            ],
            [
              wrong[2]!.en,
              `A point of $\\mathbb{R}^2$ is not a function on $[${a}, ${b}]$, so it is not an element of this space.`,
              `$\\mathbb{R}^2$ 中的点不是 $[${a}, ${b}]$ 上的函数，所以不是这个空间的元素。`,
            ],
          ]);
        }
        const k = rng.int(2, 10);
        const prompt = t(
          `What is the zero vector in the polynomial vector space $\\mathbb{P}_{${k}}$?`,
          `在多项式向量空间 $\\mathbb{P}_{${k}}$ 中，零向量是什么？`,
        );
        const right = t(`The zero polynomial $p(t) = 0$ with all coefficients equal to zero`, `所有系数均为 0 的零多项式 $p(t) = 0$`);
        const wrong = [
          t(`The polynomial $p(t) = 1$`, `多项式 $p(t) = 1$`),
          t(`The monomial $p(t) = t^{${k}}$`, `单项式 $p(t) = t^{${k}}$`),
          t(`The zero vector in $\\mathbb{R}^{${k}}$`, `$\\mathbb{R}^{${k}}$ 中的零向量`),
        ];
        const solution = walked(
          [
            [
              ["State the requirement", "写出要求"],
              t(
                `The zero vector must be a polynomial $z$ in $\\mathbb{P}_{${k}}$ with $q + z = q$ for every $q$.`,
                `零向量必须是 $\\mathbb{P}_{${k}}$ 中的多项式 $z$，且对每个 $q$ 都有 $q + z = q$。`,
              ),
            ],
            [
              ["Solve coefficient by coefficient", "逐个系数求解"],
              t(
                "Polynomials add coefficient by coefficient, so every coefficient of $z$ must be $0$: $z(t) = 0$.",
                "多项式逐项系数相加，所以 $z$ 的每个系数都必须为 $0$：$z(t) = 0$。",
              ),
            ],
          ],
          t(`For $q(t) = 1 + t^{${k}}$, $q + 0 = 1 + t^{${k}} = q$.`, `对 $q(t) = 1 + t^{${k}}$，$q + 0 = 1 + t^{${k}} = q$。`),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [wrong[0]!.en, "Adding $1$ raises the constant term, so $q + 1 \\ne q$.", "加上 $1$ 会改变常数项，所以 $q + 1 \\ne q$。"],
          [
            wrong[1]!.en,
            `Adding $t^{${k}}$ raises the top coefficient by $1$, so it changes $q$.`,
            `加上 $t^{${k}}$ 使最高次系数增加 $1$，改变了 $q$。`,
          ],
          [
            wrong[2]!.en,
            `A vector of $\\mathbb{R}^{${k}}$ is not a polynomial; besides, $\\mathbb{P}_{${k}}$ has $${k + 1}$ coefficients, not $${k}$.`,
            `$\\mathbb{R}^{${k}}$ 中的向量不是多项式；而且 $\\mathbb{P}_{${k}}$ 有 $${k + 1}$ 个系数，而不是 $${k}$ 个。`,
          ],
        ]);
      },
    },
  ],
};

/** definingAbstractVectorSpaces covers the 8 vector space axioms and verifying exotic operations. */
export const definingAbstractVectorSpaces: TopicDef = {
  id: "defining-abstract-vector-spaces",
  title: t("Defining Abstract Vector Spaces", "抽象向量空间的公理体系"),
  summary: t(
    "Examine the eight vector space axioms governing addition and scalar multiplication, and determine whether a given set and operations form a vector space.",
    "掌握支配向量加法与标量乘法的八条公理，并检验给定的集合与代数运算是否构成向量空间。",
  ),
  intro: t(
    "Define addition on $\\mathbb{R}^2$ by $(x, y) \\oplus (u, v) = (x + u + 1, y + v)$ and keep the usual scaling. With $c = 2$ and $\\mathbf{u} = \\mathbf{v} = (0, 0)$: $2(\\mathbf{u} \\oplus \\mathbf{v}) = 2(1, 0) = (2, 0)$, but $2\\mathbf{u} \\oplus 2\\mathbf{v} = (0, 0) \\oplus (0, 0) = (1, 0)$.\n\nCheck: $(2, 0) \\ne (1, 0)$, so the axiom $c(\\mathbf{u} \\oplus \\mathbf{v}) = c\\mathbf{u} \\oplus c\\mathbf{v}$ fails and these operations do not make $\\mathbb{R}^2$ a vector space.\n\nIn this lesson we name the vector space axioms and test them on operations that are defined in unusual ways.",
    "在 $\\mathbb{R}^2$ 上定义加法 $(x, y) \\oplus (u, v) = (x + u + 1, y + v)$，数乘照常。取 $c = 2$、$\\mathbf{u} = \\mathbf{v} = (0, 0)$：$2(\\mathbf{u} \\oplus \\mathbf{v}) = 2(1, 0) = (2, 0)$，而 $2\\mathbf{u} \\oplus 2\\mathbf{v} = (0, 0) \\oplus (0, 0) = (1, 0)$。\n\n检验：$(2, 0) \\ne (1, 0)$，所以公理 $c(\\mathbf{u} \\oplus \\mathbf{v}) = c\\mathbf{u} \\oplus c\\mathbf{v}$ 不成立，这样的运算不能使 $\\mathbb{R}^2$ 成为向量空间。\n\n本课我们说出向量空间的各条公理，并在定义特殊的运算上检验它们。",
  ),
  prerequisites: ["introduction-to-abstract-vector-spaces"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "identify-vector-space-axioms",
      title: t("Identifying vector space axioms", "识别向量空间公理"),
      explanation: t(
        "The axioms include associativity and commutativity of addition, existence of zero and additive inverses, distributivity of scalar multiplication over vector addition $c(u+v) = cu+cv$, distributivity over scalar addition $(c+d)u = cu+du$, associativity of scaling $c(du) = (cd)u$, and $1u = u$. For example, $3(\\mathbf{u} + \\mathbf{v}) = 3\\mathbf{u} + 3\\mathbf{v}$ has one scalar and two vectors, so it is distributivity over vector addition, while $(2 + 3)\\mathbf{u} = 2\\mathbf{u} + 3\\mathbf{u}$ has two scalars and one vector.\n\n> **Watch out.** To tell the two distributive laws apart, look at what is being added inside the parentheses: two vectors, or two scalars.",
        "公理包括加法结合律、加法交换律、零元存在性、负元存在性、数乘对向量加法的分配律 $c(u+v) = cu+cv$、数乘对标量加法的分配律 $(c+d)u = cu+du$、数乘结合律 $c(du) = (cd)u$ 以及标量乘单位元 $1u = u$。例如 $3(\\mathbf{u} + \\mathbf{v}) = 3\\mathbf{u} + 3\\mathbf{v}$ 中有一个标量和两个向量，是对向量加法的分配律；而 $(2 + 3)\\mathbf{u} = 2\\mathbf{u} + 3\\mathbf{u}$ 中有两个标量和一个向量。\n\n> **注意。** 区分两条分配律，要看括号里相加的是什么：两个向量，还是两个标量。",
      ),
      generate(rng) {
        const type = rng.pick(["distrib-vector", "distrib-scalar", "assoc-scalar", "inverse"]);
        const sc1 = rng.nonZero(-5, 5);
        const sc2 = rng.nonZero(-5, 5);
        const two = (readEn: string, readZh: string, nameEn: string, nameZh: string, check: Text) =>
          walked(
            [
              [["Read the identity", "读等式"], t(readEn, readZh)],
              [["Name the axiom", "说出公理"], t(nameEn, nameZh)],
            ],
            check,
          );
        if (type === "distrib-vector") {
          const prompt = t(
            `Which vector space axiom is demonstrated by the identity $${sc1}(\\mathbf{u} + \\mathbf{v}) = ${poly([sc1, "\\mathbf{u}"], [sc1, "\\mathbf{v}"])}$ for scalar $c = ${sc1}$ and vectors $\\mathbf{u}, \\mathbf{v}$?`,
            `等式 $${sc1}(\\mathbf{u} + \\mathbf{v}) = ${poly([sc1, "\\mathbf{u}"], [sc1, "\\mathbf{v}"])}$ 对标量 $c = ${sc1}$ 与向量 $\\mathbf{u}, \\mathbf{v}$ 成立，体现了哪条向量空间公理？`,
          );
          const right = t(`Distributivity of scalar multiplication with respect to vector addition`, `标量乘法对向量加法的分配律`);
          const wrong = [
            t(`Distributivity of scalar multiplication with respect to scalar addition`, `标量乘法对标量加法的分配律`),
            t(`Associativity of vector addition`, `向量加法的结合律`),
            t(`Commutativity of scalar multiplication`, `标量乘法的交换律`),
          ];
          const solution = two(
            `Inside the parentheses two vectors are added, $\\mathbf{u} + \\mathbf{v}$, and one scalar $${sc1}$ multiplies the sum.`,
            `括号里是两个向量相加 $\\mathbf{u} + \\mathbf{v}$，一个标量 $${sc1}$ 乘这个和。`,
            "The scalar is spread over the sum of vectors: distributivity over vector addition, $c(\\mathbf{u} + \\mathbf{v}) = c\\mathbf{u} + c\\mathbf{v}$.",
            "标量分配到向量的和上：对向量加法的分配律 $c(\\mathbf{u} + \\mathbf{v}) = c\\mathbf{u} + c\\mathbf{v}$。",
            t(`With $c = ${sc1}$ the general law reads exactly as the given identity.`, `取 $c = ${sc1}$，一般规律正好就是所给等式。`),
          );
          return reasoned(oneOf(rng, prompt, right, wrong, solution), [
            [
              wrong[0]!.en,
              "That law adds two scalars, $(c + d)\\mathbf{u}$; here two vectors are added.",
              "那条规律是两个标量相加 $(c + d)\\mathbf{u}$；这里相加的是两个向量。",
            ],
            [
              wrong[1]!.en,
              "Associativity regroups three vectors in a sum; no scalar is involved.",
              "结合律是对三个向量之和重新分组；不涉及标量。",
            ],
            [wrong[2]!.en, "There is no such axiom, and nothing here is swapped.", "没有这样的公理，这里也没有交换任何东西。"],
          ]);
        }
        if (type === "distrib-scalar") {
          const prompt = t(
            `Which vector space axiom is demonstrated by $(${sc1} + ${paren(sc2)})\\mathbf{u} = ${poly([sc1, "\\mathbf{u}"], [sc2, "\\mathbf{u}"])}$ for scalars $c = ${sc1}, d = ${sc2}$ and vector $\\mathbf{u}$?`,
            `等式 $(${sc1} + ${paren(sc2)})\\mathbf{u} = ${poly([sc1, "\\mathbf{u}"], [sc2, "\\mathbf{u}"])}$ 对标量 $c = ${sc1}, d = ${sc2}$ 与向量 $\\mathbf{u}$ 成立，体现了哪条向量空间公理？`,
          );
          const right = t(`Distributivity of scalar multiplication with respect to scalar addition`, `标量乘法对标量加法的分配律`);
          const wrong = [
            t(`Distributivity of scalar multiplication with respect to vector addition`, `标量乘法对向量加法的分配律`),
            t(`Associativity of scalar multiplication`, `标量乘法的结合律`),
            t(`Existence of additive identity`, `加法单位元的存在性`),
          ];
          const solution = two(
            `Inside the parentheses two scalars are added, $${sc1} + ${paren(sc2)}$, and the sum multiplies one vector $\\mathbf{u}$.`,
            `括号里是两个标量相加 $${sc1} + ${paren(sc2)}$，这个和乘一个向量 $\\mathbf{u}$。`,
            "The vector is spread over the sum of scalars: distributivity over scalar addition, $(c + d)\\mathbf{u} = c\\mathbf{u} + d\\mathbf{u}$.",
            "向量分配到标量的和上：对标量加法的分配律 $(c + d)\\mathbf{u} = c\\mathbf{u} + d\\mathbf{u}$。",
            t(
              `With $c = ${sc1}$ and $d = ${sc2}$ the general law reads exactly as the given identity.`,
              `取 $c = ${sc1}$、$d = ${sc2}$，一般规律正好就是所给等式。`,
            ),
          );
          return reasoned(oneOf(rng, prompt, right, wrong, solution), [
            [
              wrong[0]!.en,
              "That law adds two vectors, $c(\\mathbf{u} + \\mathbf{v})$; here two scalars are added.",
              "那条规律是两个向量相加 $c(\\mathbf{u} + \\mathbf{v})$；这里相加的是两个标量。",
            ],
            [
              wrong[1]!.en,
              "Associativity of scaling multiplies scalars one after another, $c(d\\mathbf{u})$; here they are added.",
              "数乘结合律是标量逐次相乘 $c(d\\mathbf{u})$；这里是标量相加。",
            ],
            [
              wrong[2]!.en,
              "The additive identity is about $\\mathbf{u} + \\mathbf{0} = \\mathbf{u}$; no zero vector appears here.",
              "加法单位元说的是 $\\mathbf{u} + \\mathbf{0} = \\mathbf{u}$；这里没有出现零向量。",
            ],
          ]);
        }
        if (type === "assoc-scalar") {
          const prompt = t(
            `Which vector space axiom is demonstrated by $${sc1}(${sc2}\\mathbf{u}) = (${sc1 * sc2})\\mathbf{u}$ for vector $\\mathbf{u}$?`,
            `等式 $${sc1}(${sc2}\\mathbf{u}) = (${sc1 * sc2})\\mathbf{u}$ 对向量 $\\mathbf{u}$ 成立，体现了哪条向量空间公理？`,
          );
          const right = t(`Associativity of scalar multiplication`, `标量乘法的结合律`);
          const wrong = [
            t(`Commutativity of vector addition`, `向量加法的交换律`),
            t(`Distributivity of scalar multiplication`, `标量乘法的分配律`),
            t(`Unitary property of scalar multiplication`, `标量乘法的单位元性质`),
          ];
          const solution = two(
            `The vector is scaled by $${sc2}$ and then by $${sc1}$, and the result equals one scaling by $${sc1} \\cdot ${paren(sc2)} = ${sc1 * sc2}$.`,
            `向量先乘 $${sc2}$ 再乘 $${sc1}$，结果等于一次乘以 $${sc1} \\cdot ${paren(sc2)} = ${sc1 * sc2}$。`,
            "Two scalings combine into one by multiplying the scalars: associativity of scalar multiplication, $c(d\\mathbf{u}) = (cd)\\mathbf{u}$.",
            "两次数乘可合并为一次，标量相乘：标量乘法的结合律 $c(d\\mathbf{u}) = (cd)\\mathbf{u}$。",
            t(
              `With $c = ${sc1}$ and $d = ${sc2}$, $cd = ${sc1 * sc2}$, matching the right side.`,
              `取 $c = ${sc1}$、$d = ${sc2}$，$cd = ${sc1 * sc2}$，与右边一致。`,
            ),
          );
          return reasoned(oneOf(rng, prompt, right, wrong, solution), [
            [
              wrong[0]!.en,
              "Commutativity swaps two vectors in a sum; there is no sum of vectors here.",
              "交换律交换和中的两个向量；这里没有向量之和。",
            ],
            [
              wrong[1]!.en,
              "A distributive law needs a sum inside the parentheses; here there is a product.",
              "分配律需要括号里有和；这里是积。",
            ],
            [
              wrong[2]!.en,
              "The unitary property is $1\\mathbf{u} = \\mathbf{u}$, about the scalar $1$ only.",
              "单位元性质是 $1\\mathbf{u} = \\mathbf{u}$，只涉及标量 $1$。",
            ],
          ]);
        }
        const prompt = t(
          `For a vector $\\mathbf{u}$, which vector space axiom guarantees that there exists a vector $-\\mathbf{u}$ such that $\\mathbf{u} + (-\\mathbf{u}) = \\mathbf{0}$?`,
          `对于向量 $\\mathbf{u}$，哪条向量空间公理保证必定存在向量 $-\\mathbf{u}$ 使得 $\\mathbf{u} + (-\\mathbf{u}) = \\mathbf{0}$？`,
        );
        const right = t(`Existence of additive inverse`, `加法逆元（负元）的存在性`);
        const wrong = [
          t(`Existence of additive identity`, `加法单位元的存在性`),
          t(`Closure under scalar multiplication`, `标量乘法的封闭性`),
          t(`Commutativity of addition`, `加法交换律`),
        ];
        const solution = two(
          "The statement asks for a partner $-\\mathbf{u}$ that adds with $\\mathbf{u}$ to give $\\mathbf{0}$.",
          "这句话要求有一个伙伴 $-\\mathbf{u}$，与 $\\mathbf{u}$ 相加得 $\\mathbf{0}$。",
          "A vector that cancels $\\mathbf{u}$ is its additive inverse, and the axiom that guarantees it is the existence of additive inverses.",
          "抵消 $\\mathbf{u}$ 的向量是它的加法逆元，保证它存在的公理是加法逆元的存在性。",
          t(
            "In $\\mathbb{R}^2$, $(3, -1) + (-3, 1) = (0, 0)$, so $(-3, 1)$ is the inverse of $(3, -1)$.",
            "在 $\\mathbb{R}^2$ 中，$(3, -1) + (-3, 1) = (0, 0)$，所以 $(-3, 1)$ 是 $(3, -1)$ 的逆元。",
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "That axiom gives the zero vector $\\mathbf{0}$ itself, not a partner for each $\\mathbf{u}$.",
            "那条公理给出零向量 $\\mathbf{0}$ 本身，而不是每个 $\\mathbf{u}$ 的伙伴。",
          ],
          [
            wrong[1]!.en,
            "Closure says $c\\mathbf{u}$ stays in the space; it does not say that a sum can return to $\\mathbf{0}$.",
            "封闭性说 $c\\mathbf{u}$ 仍在空间中；它不保证某个和能回到 $\\mathbf{0}$。",
          ],
          [
            wrong[2]!.en,
            "Commutativity says $\\mathbf{u} + \\mathbf{v} = \\mathbf{v} + \\mathbf{u}$; it does not produce any new vector.",
            "交换律说 $\\mathbf{u} + \\mathbf{v} = \\mathbf{v} + \\mathbf{u}$；它不产生新的向量。",
          ],
        ]);
      },
    },
    {
      id: "verify-nonstandard-operations",
      title: t("Testing non-standard operations", "检验非标准运算是否满足公理"),
      explanation: t(
        "When addition or scalar multiplication is redefined non-standardly, one or more axioms may fail. For example, if $c(x, y) = (cx, 0)$, the identity axiom $1\\mathbf{u} = \\mathbf{u}$ fails when $y \\neq 0$: $1(2, 5) = (2, 0) \\ne (2, 5)$. To show an axiom fails, one specific counterexample with numbers is enough.\n\n> **Watch out.** An axiom that holds for the usual operations may fail for the new ones, so test each law with the new definitions, starting from the simplest vectors such as $\\mathbf{0}$.",
        "当重新定义非标准的加法或数乘时，某些公理可能不成立。例如若定义 $c(x, y) = (cx, 0)$，当 $y \\neq 0$ 时单位元公理 $1\\mathbf{u} = \\mathbf{u}$ 将失效：$1(2, 5) = (2, 0) \\ne (2, 5)$。要说明某条公理不成立，一个具体的数值反例就够了。\n\n> **注意。** 对通常运算成立的公理，对新运算可能不成立，所以要用新定义逐条检验，从 $\\mathbf{0}$ 这样最简单的向量开始。",
      ),
      generate(rng) {
        const k = rng.nonZero(-25, 25);
        const prompt = t(
          `On $\\mathbb{R}^2$, define vector addition non-standardly by $(x, y) \\oplus (u, v) = (${poly([1, "x"], [1, "u"], [k, ""])}, y + v)$, and define scalar multiplication as usual. Which vector space axiom fails?`,
          `在 $\\mathbb{R}^2$ 上，向量加法非标准地定义为 $(x, y) \\oplus (u, v) = (${poly([1, "x"], [1, "u"], [k, ""])}, y + v)$，标量乘法采用通常定义。哪条向量空间公理不成立？`,
        );
        const right = t(
          `Distributivity of scalar multiplication over vector addition ($c(\\mathbf{u} \\oplus \\mathbf{v}) = c\\mathbf{u} \\oplus c\\mathbf{v}$) fails`,
          `标量乘法对向量加法的分配律（$c(\\mathbf{u} \\oplus \\mathbf{v}) = c\\mathbf{u} \\oplus c\\mathbf{v}$）失效`,
        );
        const wrong = [
          t(`Commutativity of vector addition fails`, `向量加法交换律不成立`),
          t(`Closure under vector addition fails`, `向量加法封闭性不成立`),
          t(`Associativity of scalar multiplication fails`, `标量乘法结合律不成立`),
        ];
        const solution = walked(
          [
            [
              ["Take simple vectors", "取简单的向量"],
              t(
                `Let $c = 2$ and $\\mathbf{u} = \\mathbf{v} = (0, 0)$. Then $\\mathbf{u} \\oplus \\mathbf{v} = (${k}, 0)$, so:`,
                `取 $c = 2$，$\\mathbf{u} = \\mathbf{v} = (0, 0)$。则 $\\mathbf{u} \\oplus \\mathbf{v} = (${k}, 0)$，所以：`,
              ),
              [`c(\\mathbf{u} \\oplus \\mathbf{v}) = 2(${k}, 0) = (${2 * k}, 0)`],
            ],
            [
              ["Compute the other side", "计算另一边"],
              t(
                "Scaling first gives $c\\mathbf{u} = c\\mathbf{v} = (0, 0)$, so:",
                "先数乘得 $c\\mathbf{u} = c\\mathbf{v} = (0, 0)$，所以：",
              ),
              [`c\\mathbf{u} \\oplus c\\mathbf{v} = (0, 0) \\oplus (0, 0) = (${k}, 0)`],
            ],
          ],
          t(
            `$(${2 * k}, 0) \\ne (${k}, 0)$ because $${k} \\ne 0$, so distributivity over vector addition fails.`,
            `因为 $${k} \\ne 0$，$(${2 * k}, 0) \\ne (${k}, 0)$，所以对向量加法的分配律不成立。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [wrong[0]!.en, "Swapping the two vectors gives the same sums, so commutativity holds.", "交换两个向量，和不变，所以交换律成立。"],
          [wrong[1]!.en, "The result is always a pair of real numbers, so closure holds.", "结果总是一对实数，所以封闭性成立。"],
          [wrong[2]!.en, "Scalar multiplication is the standard one, so this law holds.", "标量乘法是标准的，所以这条规律成立。"],
        ]);
      },
    },
  ],
};

/** linearIndependenceInAbstractVectorSpaces covers linear independence of polynomials in P_n and matrices in M_{m×n}. */
export const linearIndependenceInAbstractVectorSpaces: TopicDef = {
  id: "linear-independence-in-abstract-vector-spaces",
  title: t("Linear Independence in Abstract Vector Spaces", "抽象向量空间中的线性相关与无关"),
  summary: t(
    "Determine whether sets of polynomials in $\\mathbb{P}_n$ or matrices in $M_{m \\times n}$ are linearly independent by setting linear combinations equal to the zero vector.",
    "通过令线性组合等于零向量，判定 $\\mathbb{P}_n$ 中的多项式组或 $M_{m \\times n}$ 中的矩阵组是否线性无关。",
  ),
  intro: t(
    "Are $1 + t$, $t$ and $t^2$ independent in $\\mathbb{P}_2$? Set $c_1(1 + t) + c_2 t + c_3 t^2 = 0$ and compare coefficients: the constant term gives $c_1 = 0$, the $t$ term gives $c_1 + c_2 = 0$, so $c_2 = 0$, and the $t^2$ term gives $c_3 = 0$.\n\nCheck: only the trivial combination gives the zero polynomial, so the three polynomials are independent; a relation such as $1 + t = t + 1 \\cdot 1$ would need the polynomial $1$, which is not in the set.\n\nIn this lesson we test sets of polynomials and of matrices for independence by setting a combination equal to the zero vector and comparing coefficients or entries.",
    "$1 + t$、$t$、$t^2$ 在 $\\mathbb{P}_2$ 中线性无关吗？令 $c_1(1 + t) + c_2 t + c_3 t^2 = 0$ 并比较系数：常数项给出 $c_1 = 0$，$t$ 项给出 $c_1 + c_2 = 0$，所以 $c_2 = 0$，$t^2$ 项给出 $c_3 = 0$。\n\n检验：只有平凡组合得到零多项式，所以三个多项式线性无关；像 $1 + t = t + 1 \\cdot 1$ 这样的关系需要多项式 $1$，而它不在集合中。\n\n本课我们令组合等于零向量，比较系数或元素，检验多项式组和矩阵组是否线性无关。",
  ),
  prerequisites: ["defining-abstract-vector-spaces"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "independence-of-polynomials",
      title: t("Linear independence of polynomials in $\\mathbb{P}_2$", "$\\mathbb{P}_2$ 中多项式组的线性相关性"),
      explanation: t(
        "Polynomials $p_1, \\dots, p_k$ are linearly independent if $c_1p_1(t) + \\dots + c_kp_k(t) = 0$ for all $t$ implies $c_1 = \\dots = c_k = 0$. Equating coefficients of like powers yields a linear system. For example, $p_1 = 1 + t$, $p_2 = t$, $p_3 = 2 + 3t$ are dependent: $2p_1 + p_2 = 2 + 3t = p_3$.\n\n> **Watch out.** The combination must be the zero polynomial for every $t$, not just at one value of $t$; compare all the coefficients.",
        "若由 $c_1p_1(t) + \\dots + c_kp_k(t) \\equiv 0$ 能推出 $c_1 = \\dots = c_k = 0$，则多项式组线性无关。通过比较同次项系数可转化为常系数线性方程组。例如 $p_1 = 1 + t$，$p_2 = t$，$p_3 = 2 + 3t$ 线性相关：$2p_1 + p_2 = 2 + 3t = p_3$。\n\n> **注意。** 组合必须对每个 $t$ 都是零多项式，而不只在某一个 $t$ 处为零；要比较全部系数。",
      ),
      generate(rng) {
        const isDep = rng.bool();
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const p1Str = formatPoly2(1, a, 0);
        const p2Str = formatPoly2(0, 1, b);
        const p3Str = isDep ? formatPoly2(2, 2 * a + 1, b) : `t^2`;
        const prompt = t(
          `Determine whether the set of polynomials $S = \\left\\{ p_1(t) = ${p1Str}, \\; p_2(t) = ${p2Str}, \\; p_3(t) = ${p3Str} \\right\\}$ in $\\mathbb{P}_2$ is linearly independent.`,
          `判断多项式空间 $\\mathbb{P}_2$ 中的多项式组 $S = \\left\\{ p_1(t) = ${p1Str}, \\; p_2(t) = ${p2Str}, \\; p_3(t) = ${p3Str} \\right\\}$ 是否线性无关。`,
        );
        const right = isDep
          ? t(`Linearly dependent, because $2p_1(t) + p_2(t) - p_3(t) = 0$`, `线性相关，因为 $2p_1(t) + p_2(t) - p_3(t) = 0$`)
          : t(
              `Linearly independent, because $c_1 p_1(t) + c_2 p_2(t) + c_3 p_3(t) = 0$ implies $c_1 = c_2 = c_3 = 0$`,
              `线性无关，因为 $c_1 p_1(t) + c_2 p_2(t) + c_3 p_3(t) = 0$ 能推出 $c_1 = c_2 = c_3 = 0$`,
            );
        const wrong = isDep
          ? [
              t(`Linearly independent, because they all have different degrees`, `线性无关，因为它们的次数各不相同`),
              t(`Linearly independent, because none of the polynomials is the zero polynomial`, `线性无关，因为没有多项式是零多项式`),
              t(`Linearly dependent, but only for $t = 0$`, `线性相关，但仅对 $t = 0$ 成立`),
            ]
          : [
              t(`Linearly dependent, because there are 3 polynomials in $\\mathbb{P}_2$`, `线性相关，因为 $\\mathbb{P}_2$ 中有 3 个多项式`),
              t(`Linearly dependent, because $p_1(0) \\neq 0$`, `线性相关，因为 $p_1(0) \\neq 0$`),
              t(`Linearly dependent, because $p_1(t) + p_2(t) = p_3(t)$`, `线性相关，因为 $p_1(t) + p_2(t) = p_3(t)$`),
            ];
        const sum2 = formatPoly2(2, 2 * a, 0);
        const sum12 = formatPoly2(1, a + 1, b);
        const solution = isDep
          ? walked(
              [
                [
                  ["Match the constant term", "对齐常数项"],
                  t(
                    `Only $p_1$ and $p_3$ have constant terms, $1$ and $2$, so try $2p_1$:`,
                    `只有 $p_1$ 和 $p_3$ 有常数项，分别为 $1$ 和 $2$，所以试 $2p_1$：`,
                  ),
                  [`2p_1(t) = ${sum2}`],
                ],
                [
                  ["Add $p_2$", "加上 $p_2$"],
                  t(`Adding $p_2(t) = ${p2Str}$ gives:`, `加上 $p_2(t) = ${p2Str}$ 得：`),
                  [`2p_1(t) + p_2(t) = ${p3Str} = p_3(t)`],
                ],
              ],
              t(
                `$2p_1 + p_2 - p_3 = 0$ has the nonzero weights $2, 1, -1$, so the set is dependent.`,
                `$2p_1 + p_2 - p_3 = 0$ 的权重 $2, 1, -1$ 不全为零，所以线性相关。`,
              ),
            )
          : walked(
              [
                [
                  ["Compare coefficients", "比较系数"],
                  t(
                    `Set $c_1(${p1Str}) + c_2(${p2Str}) + c_3 t^2 = 0$. The coefficients of $1$, $t$ and $t^2$ give:`,
                    `令 $c_1(${p1Str}) + c_2(${p2Str}) + c_3 t^2 = 0$。$1$、$t$、$t^2$ 的系数给出：`,
                  ),
                  [`c_1 = 0`, `${a === 1 ? "" : a === -1 ? "-" : a}c_1 + c_2 = 0`, `${b === 1 ? "" : b === -1 ? "-" : b}c_2 + c_3 = 0`],
                ],
                [
                  ["Solve in order", "依次求解"],
                  t(
                    "The first equation gives $c_1 = 0$, then the second gives $c_2 = 0$, and the third gives $c_3 = 0$.",
                    "第一个方程给出 $c_1 = 0$，再由第二个得 $c_2 = 0$，由第三个得 $c_3 = 0$。",
                  ),
                ],
              ],
              t(
                `Only the trivial combination works, so the set is independent; for instance $p_1 + p_2 = ${sum12} \\ne t^2$.`,
                `只有平凡组合成立，所以线性无关；例如 $p_1 + p_2 = ${sum12} \\ne t^2$。`,
              ),
            );
        return reasoned(
          oneOf(rng, prompt, right, wrong, solution),
          isDep
            ? [
                [
                  wrong[0]!.en,
                  "$p_2$ and $p_3$ both have degree $2$, and in any case different degrees would not rule out a relation among three polynomials here.",
                  "$p_2$ 和 $p_3$ 都是 $2$ 次的；而且这里次数不同也不能排除三个多项式之间的关系。",
                ],
                [
                  wrong[1]!.en,
                  "Nonzero polynomials can still be dependent: here $p_3 = 2p_1 + p_2$.",
                  "非零多项式仍可能线性相关：这里 $p_3 = 2p_1 + p_2$。",
                ],
                [
                  wrong[2]!.en,
                  "$2p_1 + p_2 - p_3$ is the zero polynomial, zero for every $t$, not only at $t = 0$.",
                  "$2p_1 + p_2 - p_3$ 是零多项式，对每个 $t$ 都为零，而不只在 $t = 0$ 处。",
                ],
              ]
            : [
                [
                  wrong[0]!.en,
                  "$\\mathbb{P}_2$ has dimension $3$, so $3$ polynomials can be independent; dependence needs more than $3$.",
                  "$\\mathbb{P}_2$ 的维数是 $3$，所以 $3$ 个多项式可以线性无关；超过 $3$ 个才必定相关。",
                ],
                [
                  wrong[1]!.en,
                  "A nonzero value at one point says nothing about dependence; compare all coefficients.",
                  "某一点处的值非零与相关性无关；要比较全部系数。",
                ],
                [wrong[2]!.en, `$p_1 + p_2 = ${sum12}$, which is not $t^2$.`, `$p_1 + p_2 = ${sum12}$，不是 $t^2$。`],
              ],
        );
      },
    },
    {
      id: "independence-of-matrices-m22",
      title: t("Linear independence of matrices in M_{2×2}", "M_{2×2} 中矩阵组的线性相关性"),
      explanation: t(
        "Matrices form a vector space too, so independence is tested exactly as for vectors, by setting a combination equal to the zero matrix and solving for the weights. A set of matrices $\\{A_1, \\dots, A_k\\}$ is linearly independent if $c_1A_1 + \\dots + c_kA_k = O$ implies all scalars $c_i = 0$. For example, $c_1\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} + c_2\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} c_1 & c_2 \\\\ c_2 & 0 \\end{pmatrix}$ is $O$ only when $c_1 = c_2 = 0$, so these two matrices are independent.\n\n> **Watch out.** Each entry gives its own equation; properties such as invertibility, determinants or traces of the single matrices do not decide independence.",
        "矩阵也构成向量空间，所以检验线性无关的方法与向量完全相同：令组合等于零矩阵，求出权重。若 $c_1A_1 + \\dots + c_kA_k = O$ 蕴含所有标量 $c_i = 0$，则矩阵组 $\\{A_1, \\dots, A_k\\}$ 线性无关。例如 $c_1\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} + c_2\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} c_1 & c_2 \\\\ c_2 & 0 \\end{pmatrix}$ 只有在 $c_1 = c_2 = 0$ 时才是 $O$，所以这两个矩阵线性无关。\n\n> **注意。** 每个元素给出一个方程；单个矩阵是否可逆、行列式或迹是多少，都不能决定线性相关性。",
      ),
      generate(rng) {
        const isDep = rng.bool();
        const a = rng.nonZero(-2, 2);
        const b = rng.nonZero(-2, 2);
        const A1 = [
          [1, 0],
          [0, a],
        ];
        const A2 = [
          [0, 1],
          [b, 0],
        ];
        const A3 = isDep
          ? [
              [2, 1],
              [b, 2 * a],
            ]
          : [
              [0, 0],
              [1, 0],
            ];
        const prompt = t(
          `Determine whether the set $\\left\\{ ${matLatex(A1)}, ${matLatex(A2)}, ${matLatex(A3)} \\right\\}$ in $M_{2 \\times 2}$ is linearly independent.`,
          `判断 $M_{2 \\times 2}$ 中的矩阵组 $\\left\\{ ${matLatex(A1)}, ${matLatex(A2)}, ${matLatex(A3)} \\right\\}$ 是否线性无关。`,
        );
        const right = isDep
          ? t(`Linearly dependent, because the third matrix is $2A_1 + A_2$`, `线性相关，因为第三个矩阵等于 $2A_1 + A_2$`)
          : t(
              `Linearly independent, because $c_1 A_1 + c_2 A_2 + c_3 A_3 = O$ has only the trivial solution`,
              `线性无关，因为 $c_1 A_1 + c_2 A_2 + c_3 A_3 = O$ 只有零解`,
            );
        const wrong = isDep
          ? [
              t(`Linearly independent, because all three matrices are invertible`, `线性无关，因为三个矩阵都可逆`),
              t(`Linearly independent, because their traces are distinct`, `线性无关，因为它们的迹互不相同`),
              t(`Linearly dependent, but only if the second matrix is symmetric`, `线性相关，但仅在第二个矩阵对称时成立`),
            ]
          : [
              t(
                `Linearly dependent, because 3 matrices in $M_{2 \\times 2}$ are always dependent`,
                `线性相关，因为 $M_{2 \\times 2}$ 中的 3 个矩阵必定相关`,
              ),
              t(`Linearly dependent, because one matrix has zero determinant`, `线性相关，因为其中一个矩阵的行列式为 0`),
              t(`Linearly dependent, because $A_1 + A_2 = A_3$`, `线性相关，因为 $A_1 + A_2 = A_3$`),
            ];
        const combo = (x: string, y: string, z: string) =>
          `\\begin{pmatrix} ${x} & ${y} \\\\ ${z} & ${a === 1 ? "" : a === -1 ? "-" : a}c_1 \\end{pmatrix}`;
        const solution = isDep
          ? walked(
              [
                [
                  ["Match the top row", "对齐第一行"],
                  t(
                    "The top row of the third matrix is $(2, 1)$, which is $2$ times that of $A_1$ plus that of $A_2$. So try $2A_1 + A_2$:",
                    "第三个矩阵的第一行是 $(2, 1)$，等于 $A_1$ 第一行的 $2$ 倍加 $A_2$ 的第一行。所以试 $2A_1 + A_2$：",
                  ),
                  [
                    `2A_1 + A_2 = ${matLatex([
                      [2, 0],
                      [0, 2 * a],
                    ])} + ${matLatex(A2)} = ${matLatex(A3)}`,
                  ],
                ],
                [
                  ["Conclude", "得出结论"],
                  t(
                    "This is the third matrix, so $2A_1 + A_2 - A_3 = O$ is a relation with nonzero weights.",
                    "这正是第三个矩阵，所以 $2A_1 + A_2 - A_3 = O$ 是权重不全为零的关系。",
                  ),
                ],
              ],
              t(
                `The bottom row matches too: $2 \\cdot 0 + ${paren(b)} = ${b}$ and $2 \\cdot ${paren(a)} + 0 = ${2 * a}$.`,
                `第二行也吻合：$2 \\cdot 0 + ${paren(b)} = ${b}$，$2 \\cdot ${paren(a)} + 0 = ${2 * a}$。`,
              ),
            )
          : walked(
              [
                [
                  ["Write the combination", "写出组合"],
                  t("Entry by entry, $c_1A_1 + c_2A_2 + c_3A_3$ is:", "逐个元素，$c_1A_1 + c_2A_2 + c_3A_3$ 为："),
                  [combo("c_1", "c_2", `${b === 1 ? "" : b === -1 ? "-" : b}c_2 + c_3`)],
                ],
                [
                  ["Set it equal to $O$", "令其等于 $O$"],
                  t(
                    "The top row gives $c_1 = 0$ and $c_2 = 0$, and then the bottom left entry gives $c_3 = 0$.",
                    "第一行给出 $c_1 = 0$、$c_2 = 0$，于是左下角元素给出 $c_3 = 0$。",
                  ),
                ],
              ],
              t(
                "Only the trivial combination gives $O$, so the three matrices are independent.",
                "只有平凡组合得到 $O$，所以三个矩阵线性无关。",
              ),
            );
        return reasoned(
          oneOf(rng, prompt, right, wrong, solution),
          isDep
            ? [
                [
                  wrong[0]!.en,
                  "Invertible matrices can still be dependent: here the third matrix is $2A_1 + A_2$.",
                  "可逆矩阵仍可能线性相关：这里第三个矩阵等于 $2A_1 + A_2$。",
                ],
                [
                  wrong[1]!.en,
                  "Traces of the single matrices do not decide independence; the relation $2A_1 + A_2 = A_3$ does.",
                  "单个矩阵的迹不能决定线性相关性；起决定作用的是关系 $2A_1 + A_2 = A_3$。",
                ],
                [
                  wrong[2]!.en,
                  "The relation $2A_1 + A_2 = A_3$ holds whatever $A_2$ looks like; no symmetry is needed.",
                  "无论 $A_2$ 是什么样，关系 $2A_1 + A_2 = A_3$ 都成立；不需要对称。",
                ],
              ]
            : [
                [
                  wrong[0]!.en,
                  "$M_{2 \\times 2}$ has dimension $4$, so $3$ matrices can be independent; only $5$ or more must be dependent.",
                  "$M_{2 \\times 2}$ 的维数是 $4$，所以 $3$ 个矩阵可以线性无关；$5$ 个或更多才必定相关。",
                ],
                [
                  wrong[1]!.en,
                  "One matrix with determinant $0$ can still be part of an independent set; only the combination equal to $O$ decides.",
                  "行列式为 $0$ 的矩阵仍可属于线性无关组；只有令组合等于 $O$ 才能判定。",
                ],
                [
                  wrong[2]!.en,
                  "$A_1 + A_2$ has top row $(1, 1)$, while $A_3$ has top row $(0, 0)$, so they are not equal.",
                  "$A_1 + A_2$ 的第一行是 $(1, 1)$，而 $A_3$ 的第一行是 $(0, 0)$，两者不相等。",
                ],
              ],
        );
      },
    },
  ],
};

/** subspacesOfAbstractVectorSpaces covers verifying subspace criteria for polynomial subsets and matrix subsets. */
export const subspacesOfAbstractVectorSpaces: TopicDef = {
  id: "subspaces-of-abstract-vector-spaces",
  title: t("Subspaces of Abstract Vector Spaces", "抽象向量空间的子空间"),
  summary: t(
    "Verify the three subspace criteria (zero element, closure under addition and under scalar multiplication) for subsets of $\\mathbb{P}_n$ and $M_{n \\times n}$.",
    "对 $\\mathbb{P}_n$ 与 $M_{n \\times n}$ 的子集检验零元、加法封闭与数乘封闭，判定子空间。",
  ),
  intro: t(
    "Is $W = \\{p \\in \\mathbb{P}_2 \\mid p(1) = 0\\}$ a subspace? The zero polynomial has $0(1) = 0$, so it is in $W$. If $p(1) = 0$ and $q(1) = 0$, then $(p + q)(1) = 0 + 0 = 0$ and $(cp)(1) = c \\cdot 0 = 0$, so $W$ is closed under both operations.\n\nCheck: $t - 1$ and $t^2 - 1$ are in $W$, and so is their sum $t^2 + t - 2$, since $1 + 1 - 2 = 0$.\n\nIn this lesson we test subsets of polynomial and matrix spaces with the three subspace conditions.",
    "$W = \\{p \\in \\mathbb{P}_2 \\mid p(1) = 0\\}$ 是子空间吗？零多项式满足 $0(1) = 0$，所以在 $W$ 中。若 $p(1) = 0$、$q(1) = 0$，则 $(p + q)(1) = 0 + 0 = 0$，$(cp)(1) = c \\cdot 0 = 0$，所以 $W$ 对两种运算都封闭。\n\n检验：$t - 1$ 和 $t^2 - 1$ 都在 $W$ 中，它们的和 $t^2 + t - 2$ 也在，因为 $1 + 1 - 2 = 0$。\n\n本课我们用子空间的三个条件检验多项式空间和矩阵空间的子集。",
  ),
  prerequisites: ["defining-abstract-vector-spaces"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "subspaces-of-polynomial-spaces",
      title: t("Subspaces of $\\mathbb{P}_n$", "$\\mathbb{P}_n$ 的子空间判定"),
      explanation: t(
        "A subset of $\\mathbb{P}_n$ defined by homogeneous linear conditions on values or derivatives (such as $p(0) = 0$ or $p'(1) = 0$) is a subspace. Subsets defined by non-zero values (such as $p(0) = 1$) or by an exact degree are not. For example, $\\{p \\in \\mathbb{P}_2 \\mid p(0) = 1\\}$ is not a subspace: the zero polynomial has $0(0) = 0 \\ne 1$, and $1 + 1 = 2$ shows that sums leave the set.\n\n> **Watch out.** Test the zero polynomial first: a condition with a nonzero right side, or a fixed degree, already fails there.",
        "由函数值或导数的齐次线性条件（如 $p(0) = 0$ 或 $p'(1) = 0$）定义的 $\\mathbb{P}_n$ 子集是子空间。由非零函数值（如 $p(0) = 1$）或固定次数定义的子集则不是子空间。例如 $\\{p \\in \\mathbb{P}_2 \\mid p(0) = 1\\}$ 不是子空间：零多项式满足 $0(0) = 0 \\ne 1$，而 $1 + 1 = 2$ 说明和会离开这个集合。\n\n> **注意。** 先检验零多项式：右边非零的条件，或固定次数的条件，在这里就已经不成立。",
      ),
      generate(rng) {
        const x0 = rng.int(-5, 5);
        const k = rng.nonZero(1, 9);
        const n = rng.int(2, 6);
        // sets lists the polynomials vanishing at x0, those taking the value k there and those of degree exactly n; order names them W₁, W₂, W₃.
        const sets = [`p(${x0}) = 0`, `p(${x0}) = ${k}`, `\\deg(p) = ${n}`];
        const order = rng.shuffle([0, 1, 2]);
        const name = (kind: number) => `W_${order.indexOf(kind) + 1}`;
        const listed = order.map((kind, i) => `W_{${i + 1}} = \\{ p(t) \\in \\mathbb{P}_{${n}} \\mid ${sets[kind]} \\}`);
        const options = [
          t("Only $W_1$", "仅有 $W_1$"),
          t("Only $W_2$", "仅有 $W_2$"),
          t("Only $W_3$", "仅有 $W_3$"),
          t("All three are subspaces", "三个都是子空间"),
        ];
        const problem = choiceProblem({
          prompt: t(
            `Consider the subsets of $\\mathbb{P}_{${n}}$: $${listed[0]}$, $${listed[1]}$, and $${listed[2]}$. Which of these is a subspace of $\\mathbb{P}_{${n}}$?`,
            `考虑 $\\mathbb{P}_{${n}}$ 的子集：$${listed[0]}$，$${listed[1]}$ 及 $${listed[2]}$。其中哪一个是 $\\mathbb{P}_{${n}}$ 的子空间？`,
          ),
          options,
          correct: order.indexOf(0),
          solution: walked(
            [
              [
                ["Test the zero polynomial", "检验零多项式"],
                t(
                  `$0(${x0}) = 0 \\ne ${k}$, so $${name(1)}$ misses the zero polynomial, and the zero polynomial has no degree $${n}$, so $${name(2)}$ misses it too. Only $${name(0)}$ contains it.`,
                  `$0(${x0}) = 0 \\ne ${k}$，所以 $${name(1)}$ 不含零多项式；零多项式也不是 $${n}$ 次的，所以 $${name(2)}$ 也不含它。只有 $${name(0)}$ 含零多项式。`,
                ),
              ],
              [
                [`Test closure for $${name(0)}$`, `检验 $${name(0)}$ 的封闭性`],
                t(
                  `If $p(${x0}) = 0$ and $q(${x0}) = 0$, then $(p + q)(${x0}) = 0 + 0 = 0$ and $(cp)(${x0}) = c \\cdot 0 = 0$.`,
                  `若 $p(${x0}) = 0$、$q(${x0}) = 0$，则 $(p + q)(${x0}) = 0 + 0 = 0$，$(cp)(${x0}) = c \\cdot 0 = 0$。`,
                ),
              ],
            ],
            t(
              `$${name(0)}$ passes all three conditions and the other two fail the first, so only $${name(0)}$ is a subspace.`,
              `$${name(0)}$ 满足全部三个条件，另外两个连第一个都不满足，所以只有 $${name(0)}$ 是子空间。`,
            ),
          ),
        });
        const only = (kind: number) => options[order.indexOf(kind)]!.en;
        return reasoned(problem, [
          [
            only(1),
            `$${name(1)}$ does not contain the zero polynomial, since $0(${x0}) = 0 \\ne ${k}$.`,
            `$${name(1)}$ 不含零多项式，因为 $0(${x0}) = 0 \\ne ${k}$。`,
          ],
          [
            only(2),
            `$${name(2)}$ does not contain the zero polynomial, and $t^{${n}} + (1 - t^{${n}}) = 1$ drops out of it.`,
            `$${name(2)}$ 不含零多项式，而且 $t^{${n}} + (1 - t^{${n}}) = 1$ 不在其中。`,
          ],
          [
            options[3]!.en,
            `$${name(1)}$ and $${name(2)}$ both miss the zero polynomial, so they are not subspaces.`,
            `$${name(1)}$ 和 $${name(2)}$ 都不含零多项式，所以不是子空间。`,
          ],
        ]);
      },
    },
    {
      id: "subspaces-of-matrix-spaces",
      title: t("Subspaces of matrix spaces M_{n×n}", "矩阵空间 M_{n×n} 的子空间"),
      explanation: t(
        "Subsets of $M_{n \\times n}$ defined by linear constraints, such as the symmetric matrices ($A^T = A$), the diagonal matrices, or the matrices with zero trace ($\\operatorname{tr}(A) = 0$), form subspaces. The invertible matrices do not form a subspace: they are not closed under addition and do not contain the zero matrix. For example, $\\begin{pmatrix} 1 & 2 \\\\ 2 & 0 \\end{pmatrix}$ and $\\begin{pmatrix} 0 & -1 \\\\ -1 & 3 \\end{pmatrix}$ are symmetric, and so is their sum $\\begin{pmatrix} 1 & 1 \\\\ 1 & 3 \\end{pmatrix}$.\n\n> **Watch out.** A condition such as $\\det(A) = 1$ or $A^TA = I$ is not linear: the zero matrix fails it, so the set cannot be a subspace.",
        "由线性条件定义的 $M_{n \\times n}$ 子集（如对称矩阵 $A^T = A$、对角矩阵或零迹矩阵 $\\operatorname{tr}(A) = 0$）构成子空间。可逆矩阵不构成子空间：它们对加法不封闭，且不含零矩阵。例如 $\\begin{pmatrix} 1 & 2 \\\\ 2 & 0 \\end{pmatrix}$ 和 $\\begin{pmatrix} 0 & -1 \\\\ -1 & 3 \\end{pmatrix}$ 都是对称的，它们的和 $\\begin{pmatrix} 1 & 1 \\\\ 1 & 3 \\end{pmatrix}$ 也是。\n\n> **注意。** $\\det(A) = 1$ 或 $A^TA = I$ 这样的条件不是线性的：零矩阵不满足它，所以这样的集合不可能是子空间。",
      ),
      generate(rng) {
        const n = rng.int(2, 35);
        const prompt = t(
          `Which of the following subsets of $M_{${n} \\times ${n}}$ is a valid subspace?`,
          `在 $M_{${n} \\times ${n}}$ 中，下列哪一个子集是其子空间？`,
        );
        const right = t(
          `The set of all symmetric matrices: $\\{ A \\in M_{${n} \\times ${n}} \\mid A^T = A \\}$`,
          `所有对称矩阵的集合：$\\{ A \\in M_{${n} \\times ${n}} \\mid A^T = A \\}$`,
        );
        const wrong = [
          t(
            `The set of all invertible matrices: $\\{ A \\in M_{${n} \\times ${n}} \\mid \\det(A) \\neq 0 \\}$`,
            `所有可逆矩阵的集合：$\\{ A \\in M_{${n} \\times ${n}} \\mid \\det(A) \\neq 0 \\}$`,
          ),
          t(
            `The set of matrices with determinant 1: $\\{ A \\in M_{${n} \\times ${n}} \\mid \\det(A) = 1 \\}$`,
            `行列式为 1 的矩阵集合：$\\{ A \\in M_{${n} \\times ${n}} \\mid \\det(A) = 1 \\}$`,
          ),
          t(
            `The set of orthogonal matrices: $\\{ A \\in M_{${n} \\times ${n}} \\mid A^T A = I \\}$`,
            `正交矩阵的集合：$\\{ A \\in M_{${n} \\times ${n}} \\mid A^T A = I \\}$`,
          ),
        ];
        const solution = walked(
          [
            [
              ["Test the zero matrix", "检验零矩阵"],
              t(
                "$O^T = O$, so the zero matrix is symmetric. It is not invertible, has determinant $0 \\ne 1$, and $O^TO = O \\ne I$, so the other three sets miss it.",
                "$O^T = O$，所以零矩阵是对称的。它不可逆，行列式为 $0 \\ne 1$，且 $O^TO = O \\ne I$，所以另外三个集合都不含它。",
              ),
            ],
            [
              ["Test closure for symmetric matrices", "检验对称矩阵的封闭性"],
              t("If $A^T = A$ and $B^T = B$, then:", "若 $A^T = A$、$B^T = B$，则："),
              ["(A + B)^T = A^T + B^T = A + B", "(cA)^T = cA^T = cA"],
            ],
          ],
          t("The symmetric matrices pass all three conditions, so they form a subspace.", "对称矩阵满足全部三个条件，所以构成子空间。"),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The zero matrix is not invertible, and $I + (-I) = O$ shows that sums leave the set.",
            "零矩阵不可逆，而 $I + (-I) = O$ 说明和会离开这个集合。",
          ],
          [
            wrong[1]!.en,
            `The zero matrix has determinant $0$, not $1$, and $2I$ has determinant $2^{${n}} \\ne 1$.`,
            `零矩阵的行列式是 $0$ 而不是 $1$，而 $2I$ 的行列式为 $2^{${n}} \\ne 1$。`,
          ],
          [
            wrong[2]!.en,
            "$O^TO = O \\ne I$, so the zero matrix is not orthogonal, and $2I$ is not orthogonal either.",
            "$O^TO = O \\ne I$，所以零矩阵不是正交矩阵，$2I$ 也不是。",
          ],
        ]);
      },
    },
  ],
};

/** basesInAbstractVectorSpaces covers standard bases for P_n and M_{2×2} and verifying abstract bases. */
export const basesInAbstractVectorSpaces: TopicDef = {
  id: "bases-in-abstract-vector-spaces",
  title: t("Bases in Abstract Vector Spaces", "抽象向量空间的基"),
  summary: t(
    "Identify the standard bases of $\\mathbb{P}_n$ and $M_{m \\times n}$, and verify whether a given set forms a basis.",
    "掌握 $\\mathbb{P}_n$ 与 $M_{m \\times n}$ 的标准基，并验证给定向量组是否构成基。",
  ),
  intro: t(
    "Is $\\{1, 1 + t, 1 + t + t^2\\}$ a basis of $\\mathbb{P}_2$? The degrees are $0$, $1$ and $2$, so a combination equal to $0$ must have weight $0$ on $1 + t + t^2$ (the only $t^2$ term), then on $1 + t$ (the only remaining $t$ term), then on $1$.\n\nCheck: the three polynomials are independent, and $\\dim \\mathbb{P}_2 = 3$, so they also span; for example $t^2 = (1 + t + t^2) - (1 + t)$.\n\nIn this lesson we use the standard bases of $\\mathbb{P}_n$ and $M_{2 \\times 2}$ and decide whether other sets are bases.",
    "$\\{1, 1 + t, 1 + t + t^2\\}$ 是 $\\mathbb{P}_2$ 的基吗？三者次数分别为 $0$、$1$、$2$，所以等于 $0$ 的组合中，$1 + t + t^2$ 的权重必为 $0$（唯一的 $t^2$ 项），接着 $1 + t$ 的权重为 $0$（剩下唯一的 $t$ 项），再接着 $1$ 的权重为 $0$。\n\n检验：三个多项式线性无关，而 $\\dim \\mathbb{P}_2 = 3$，所以也张成；例如 $t^2 = (1 + t + t^2) - (1 + t)$。\n\n本课我们使用 $\\mathbb{P}_n$ 和 $M_{2 \\times 2}$ 的标准基，并判断其他集合是否为基。",
  ),
  prerequisites: ["linear-independence-in-abstract-vector-spaces"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "standard-bases-abstract",
      title: t("Standard bases for $\\mathbb{P}_n$ and $M_{2 \\times 2}$", "$\\mathbb{P}_n$ 与 $M_{2 \\times 2}$ 的标准基"),
      explanation: t(
        "The standard basis for $\\mathbb{P}_n$ is $\\{1, t, t^2, \\dots, t^n\\}$, which contains $n + 1$ polynomials. The standard basis for $M_{2 \\times 2}$ consists of the four elementary matrices $E_{11}, E_{12}, E_{21}, E_{22}$. For example, in $\\mathbb{P}_3$ the polynomial $4 - t + 2t^3$ is $4 \\cdot 1 + (-1) \\cdot t + 0 \\cdot t^2 + 2 \\cdot t^3$.\n\n> **Watch out.** The constant polynomial $1$ belongs to the basis, so $\\mathbb{P}_n$ needs $n + 1$ basis polynomials, not $n$.",
        "多项式空间 $\\mathbb{P}_n$ 的标准基为 $\\{1, t, t^2, \\dots, t^n\\}$，共含 $n + 1$ 个多项式。矩阵空间 $M_{2 \\times 2}$ 的标准基由 $4$ 个基本矩阵 $E_{11}, E_{12}, E_{21}, E_{22}$ 组成。例如在 $\\mathbb{P}_3$ 中，多项式 $4 - t + 2t^3$ 等于 $4 \\cdot 1 + (-1) \\cdot t + 0 \\cdot t^2 + 2 \\cdot t^3$。\n\n> **注意。** 常数多项式 $1$ 属于这组基，所以 $\\mathbb{P}_n$ 需要 $n + 1$ 个基多项式，而不是 $n$ 个。",
      ),
      generate(rng) {
        const n = rng.int(2, 40);
        const prompt = t(
          `What is the standard basis for the polynomial vector space $\\mathbb{P}_{${n}}$?`,
          `多项式向量空间 $\\mathbb{P}_{${n}}$ 的标准基是什么？`,
        );
        const powers = Array.from({ length: n + 1 }, (_, i) => (i === 0 ? "1" : i === 1 ? "t" : `t^{${i}}`));
        const right = t(`$\\left\\{ ${powers.join(", ")} \\right\\}$`, `$\\left\\{ ${powers.join(", ")} \\right\\}$`);
        const powersNo1 = Array.from({ length: n }, (_, i) => (i === 0 ? "t" : `t^{${i + 1}}`));
        const wrong = [
          t(`$\\left\\{ ${powersNo1.join(", ")} \\right\\}$`, `$\\left\\{ ${powersNo1.join(", ")} \\right\\}$`),
          t(`$\\left\\{ 1 + t + \\dots + t^{${n}} \\right\\}$`, `$\\left\\{ 1 + t + \\dots + t^{${n}} \\right\\}$`),
          t(`$\\left\\{ t^{${n}} \\right\\}$`, `$\\left\\{ t^{${n}} \\right\\}$`),
        ];
        const solution = walked(
          [
            [
              ["Spanning", "张成"],
              t(
                `Every polynomial in $\\mathbb{P}_{${n}}$ is $a_0 \\cdot 1 + a_1 t + \\dots + a_{${n}} t^{${n}}$, a combination of the powers $1, t, \\dots, t^{${n}}$.`,
                `$\\mathbb{P}_{${n}}$ 中每个多项式都是 $a_0 \\cdot 1 + a_1 t + \\dots + a_{${n}} t^{${n}}$，是各次幂 $1, t, \\dots, t^{${n}}$ 的组合。`,
              ),
            ],
            [
              ["Independence", "线性无关"],
              t(
                "A combination of the powers is the zero polynomial only when every coefficient is $0$.",
                "各次幂的组合只有在每个系数都为 $0$ 时才是零多项式。",
              ),
            ],
          ],
          t(
            `The basis has $${n + 1}$ polynomials, matching $\\dim \\mathbb{P}_{${n}} = ${n} + 1$.`,
            `这组基有 $${n + 1}$ 个多项式，与 $\\dim \\mathbb{P}_{${n}} = ${n} + 1$ 一致。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The constant polynomial $1$ is missing, so no nonzero constant can be written from this set.",
            "缺少常数多项式 $1$，所以这个集合表示不出非零常数。",
          ],
          [
            wrong[1]!.en,
            "This is one polynomial, the sum of the powers, and its multiples are not all of the space.",
            "这只是一个多项式，即各次幂的和，它的倍数不能构成整个空间。",
          ],
          [
            wrong[2]!.en,
            "This one power spans only its own multiples, and a basis needs every power from $1$ up.",
            "这一个幂只能张成自身的倍数，而基需要从 $1$ 起的每一个幂。",
          ],
        ]);
      },
    },
    {
      id: "verify-basis-in-polynomial-space",
      title: t("Verifying a basis for $\\mathbb{P}_2$", "验证 $\\mathbb{P}_2$ 的一组非标准基"),
      explanation: t(
        "A set of $3$ polynomials in $\\mathbb{P}_2$ forms a basis if and only if they are linearly independent (which in turn guarantees they span the $3$-dimensional space $\\mathbb{P}_2$). For example, $\\{1, 1 + t, t + t^2\\}$ is a basis, since the degrees $0, 1, 2$ force every weight in a zero combination to vanish, while $\\{1, 1 + t, 2 + 2t\\}$ is not, since $2 + 2t = 2(1 + t)$.\n\n> **Watch out.** Three nonzero polynomials need not be a basis: check that none is a combination of the others.",
        "$\\mathbb{P}_2$ 中的 $3$ 个多项式构成基，当且仅当它们线性无关（这也保证了它们必能张成 $3$ 维空间 $\\mathbb{P}_2$）。例如 $\\{1, 1 + t, t + t^2\\}$ 是基，因为次数 $0, 1, 2$ 迫使零组合的每个权重为零；而 $\\{1, 1 + t, 2 + 2t\\}$ 不是，因为 $2 + 2t = 2(1 + t)$。\n\n> **注意。** 三个非零多项式不一定构成基：要检查没有一个是其他多项式的组合。",
      ),
      generate(rng) {
        const isBasis = rng.bool();
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const c = rng.int(-4, 4);
        const p1 = `1`;
        const p2 = formatPoly2(1, a, 0);
        const p3 = isBasis ? formatPoly2(1, c, b) : formatPoly2(2, 2 * a, 0); // 2*p2, dependent
        const prompt = t(
          `Does the set $\\mathcal{B} = \\left\\{ ${p1}, \\; ${p2}, \\; ${p3} \\right\\}$ form a basis for $\\mathbb{P}_2$?`,
          `集合 $\\mathcal{B} = \\left\\{ ${p1}, \\; ${p2}, \\; ${p3} \\right\\}$ 是否构成 $\\mathbb{P}_2$ 的一组基？`,
        );
        const right = isBasis
          ? t(
              `Yes, because the 3 polynomials have degrees 0, 1, and 2, which guarantees linear independence and spanning for 3-dimensional $\\mathbb{P}_2$`,
              `是，因为 3 个多项式的次数分别为 0、1、2，保证了线性无关且能张成 3 维空间 $\\mathbb{P}_2$`,
            )
          : t(
              `No, because the third polynomial is a scalar multiple of the second, so the set is linearly dependent`,
              `否，因为第三个多项式是第二个的标量倍数，向量组线性相关`,
            );
        const wrong = isBasis
          ? [
              t(`No, because only the standard basis $\\{1, t, t^2\\}$ can be a basis`, `否，因为只有标准基 $\\{1, t, t^2\\}$ 才能成为基`),
              t(`No, because a basis for $\\mathbb{P}_2$ must contain 2 polynomials`, `否，因为 $\\mathbb{P}_2$ 的基必须包含 2 个多项式`),
              t(`Yes, but only for $t > 0$`, `是，但仅当 $t > 0$ 时成立`),
            ]
          : [
              t(`Yes, because any 3 polynomials form a basis for $\\mathbb{P}_2$`, `是，因为任意 3 个多项式都构成 $\\mathbb{P}_2$ 的基`),
              t(`Yes, because none of the polynomials is zero`, `是，因为其中没有零多项式`),
              t(`No, because $\\mathbb{P}_2$ is infinite-dimensional`, `否，因为 $\\mathbb{P}_2$ 是无限维的`),
            ];
        const solution = isBasis
          ? walked(
              [
                [
                  ["Look at the degrees", "看次数"],
                  t(
                    `$${p1}$, $${p2}$ and $${p3}$ have degrees $0$, $1$ and $2$.`,
                    `$${p1}$、$${p2}$、$${p3}$ 的次数分别为 $0$、$1$、$2$。`,
                  ),
                ],
                [
                  ["Solve a zero combination", "求解零组合"],
                  t(
                    `In $c_1 \\cdot 1 + c_2(${p2}) + c_3(${p3}) = 0$, only the third has a $t^2$ term, so $c_3 = 0$; then only the second has a $t$ term, so $c_2 = 0$; then $c_1 = 0$.`,
                    `在 $c_1 \\cdot 1 + c_2(${p2}) + c_3(${p3}) = 0$ 中，只有第三个有 $t^2$ 项，所以 $c_3 = 0$；接着只有第二个有 $t$ 项，所以 $c_2 = 0$；于是 $c_1 = 0$。`,
                  ),
                ],
              ],
              t(
                "The three are independent, and $\\dim \\mathbb{P}_2 = 3$, so three independent polynomials also span: they form a basis.",
                "三者线性无关，而 $\\dim \\mathbb{P}_2 = 3$，所以三个线性无关的多项式也张成：它们构成基。",
              ),
            )
          : walked(
              [
                [
                  ["Compare the last two", "比较后两个"],
                  t(
                    `$${p3} = 2(${p2})$, so the third polynomial is a multiple of the second.`,
                    `$${p3} = 2(${p2})$，所以第三个多项式是第二个的倍数。`,
                  ),
                ],
                [
                  ["Conclude", "得出结论"],
                  t(
                    "$2p_2 - p_3 = 0$ is a relation with nonzero weights, so the set is dependent and is not a basis.",
                    "$2p_2 - p_3 = 0$ 是权重不全为零的关系，所以线性相关，不是基。",
                  ),
                ],
              ],
              t(
                "No polynomial in the set has a $t^2$ term, so $t^2$ is not in their span either.",
                "集合中没有多项式含 $t^2$ 项，所以 $t^2$ 也不在它们的张成中。",
              ),
            );
        return reasoned(
          oneOf(rng, prompt, right, wrong, solution),
          isBasis
            ? [
                [
                  wrong[0]!.en,
                  "A space has many bases; any $3$ independent polynomials in $\\mathbb{P}_2$ form one.",
                  "一个空间有许多组基；$\\mathbb{P}_2$ 中任意 $3$ 个线性无关的多项式都构成一组。",
                ],
                [
                  wrong[1]!.en,
                  "$\\dim \\mathbb{P}_2 = 3$, because of the basis $\\{1, t, t^2\\}$, so a basis has $3$ polynomials.",
                  "因为有基 $\\{1, t, t^2\\}$，$\\dim \\mathbb{P}_2 = 3$，所以基有 $3$ 个多项式。",
                ],
                [
                  wrong[2]!.en,
                  "Being a basis is a property of the polynomials themselves, not of particular values of $t$.",
                  "是否为基是多项式本身的性质，与 $t$ 的取值无关。",
                ],
              ]
            : [
                [
                  wrong[0]!.en,
                  "Three polynomials form a basis only when they are independent, and here the third is twice the second.",
                  "三个多项式只有线性无关时才构成基，而这里第三个是第二个的 $2$ 倍。",
                ],
                [
                  wrong[1]!.en,
                  "Nonzero polynomials can still be dependent: here the third is twice the second.",
                  "非零多项式仍可能线性相关：这里第三个是第二个的 $2$ 倍。",
                ],
                [
                  wrong[2]!.en,
                  "$\\mathbb{P}_2$ has dimension $3$; the set fails because it is dependent.",
                  "$\\mathbb{P}_2$ 的维数是 $3$；这个集合不行是因为它线性相关。",
                ],
              ],
        );
      },
    },
  ],
};

/** theCoordinatesOfAVectorRelativeToABasisInAbstractVectorSpaces covers coordinate isomorphism [v]_B in ℝⁿ for abstract spaces. */
export const theCoordinatesOfAVectorRelativeToABasisInAbstractVectorSpaces: TopicDef = {
  id: "the-coordinates-of-a-vector-relative-to-a-basis-in-abstract-vector-spaces",
  title: t("The Coordinates of a Vector Relative to a Basis in Abstract Vector Spaces", "抽象向量在基下的坐标映射"),
  summary: t(
    "Determine coordinate vectors $[\\mathbf{v}]_{\\mathcal{B}} \\in \\mathbb{R}^n$ for polynomials and matrices relative to ordered bases, illustrating the coordinate isomorphism.",
    "求解多项式与矩阵在有序基下的坐标向量 $[\\mathbf{v}]_{\\mathcal{B}} \\in \\mathbb{R}^n$，理解坐标同构映射。",
  ),
  intro: t(
    "Relative to $\\mathcal{B} = \\{1, t, t^2\\}$, the polynomial $p(t) = 3 - 2t + 5t^2$ has coordinate vector $[p]_{\\mathcal{B}} = (3, -2, 5)$: the weights on $1$, $t$ and $t^2$ in that order.\n\nCheck: $3 \\cdot 1 + (-2) \\cdot t + 5 \\cdot t^2 = 3 - 2t + 5t^2 = p(t)$.\n\nIn this lesson we turn polynomials and $2 \\times 2$ matrices into coordinate vectors relative to their standard bases.",
    "相对于 $\\mathcal{B} = \\{1, t, t^2\\}$，多项式 $p(t) = 3 - 2t + 5t^2$ 的坐标向量为 $[p]_{\\mathcal{B}} = (3, -2, 5)$：依次是 $1$、$t$、$t^2$ 的权重。\n\n检验：$3 \\cdot 1 + (-2) \\cdot t + 5 \\cdot t^2 = 3 - 2t + 5t^2 = p(t)$。\n\n本课我们把多项式和 $2 \\times 2$ 矩阵写成相对于标准基的坐标向量。",
  ),
  prerequisites: ["bases-in-abstract-vector-spaces"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "polynomial-coordinate-vector",
      title: t("Coordinate vector of a polynomial in $\\mathbb{P}_2$", "$\\mathbb{P}_2$ 中多项式的坐标向量"),
      explanation: t(
        "Relative to the standard basis of powers, the coordinates of a polynomial are just its coefficients listed in order of increasing degree. For the ordered standard basis $\\mathcal{B} = \\{1, t, t^2\\}$ of $\\mathbb{P}_2$, the polynomial $p(t) = a_0 + a_1t + a_2t^2$ has coordinate vector $[p]_{\\mathcal{B}} = (a_0, a_1, a_2)^T$. For example, $p(t) = 4t - t^2$ has $[p]_{\\mathcal{B}} = (0, 4, -1)$.\n\n> **Watch out.** Follow the order of the basis, starting with the constant term, and write $0$ for any missing power.",
        "相对于由幂组成的标准基，多项式的坐标就是按次数从低到高排列的系数。对于 $\\mathbb{P}_2$ 的有序标准基 $\\mathcal{B} = \\{1, t, t^2\\}$，多项式 $p(t) = a_0 + a_1t + a_2t^2$ 的坐标向量为 $[p]_{\\mathcal{B}} = (a_0, a_1, a_2)^T$。例如 $p(t) = 4t - t^2$ 的坐标为 $[p]_{\\mathcal{B}} = (0, 4, -1)$。\n\n> **注意。** 按基的顺序排列，从常数项开始，缺少的幂写 $0$。",
      ),
      generate(rng) {
        const a0 = rng.int(-5, 5);
        const a1 = rng.nonZero(-5, 5);
        const a2 = rng.nonZero(-5, 5);
        const polyStr = formatPoly2(a0, a1, a2);
        const answer = [a0, a1, a2];
        const prompt = t(
          `Find the coordinate vector $[p(t)]_{\\mathcal{B}}$ of the polynomial $p(t) = ${polyStr}$ relative to the ordered standard basis $\\mathcal{B} = \\{1, t, t^2\\}$ of $\\mathbb{P}_2$. Enter the vector as $\\langle a_0, a_1, a_2 \\rangle$.`,
          `求多项式 $p(t) = ${polyStr}$ 在 $\\mathbb{P}_2$ 的有序标准基 $\\mathcal{B} = \\{1, t, t^2\\}$ 下的坐标向量 $[p(t)]_{\\mathcal{B}}$。以 $\\langle a_0, a_1, a_2 \\rangle$ 的形式输入结果。`,
        );
        const solution = walked(
          [
            [
              ["Write $p$ in the basis", "用基写出 $p$"],
              t(
                "Give every basis polynomial its weight, including $0$ for a missing term:",
                "给每个基多项式配上权重，缺少的项权重为 $0$：",
              ),
              [`p(t) = ${paren(a0)} \\cdot 1 + ${paren(a1)} \\cdot t + ${paren(a2)} \\cdot t^2`],
            ],
            [["List the weights in order", "按顺序列出权重"], t("", ""), [`[p(t)]_{\\mathcal{B}} = ${vectorLatex(answer)}`]],
          ],
          t(
            `At $t = 1$ the combination gives $${sumLatex([a0, a1, a2])} = ${a0 + a1 + a2}$, and $p(1) = ${a0 + a1 + a2}$ as well.`,
            `在 $t = 1$ 处，组合给出 $${sumLatex([a0, a1, a2])} = ${a0 + a1 + a2}$，而 $p(1)$ 也等于 $${a0 + a1 + a2}$。`,
          ),
        );
        return withMistakes(
          pointProblem({ prompt, answer, vars: ["a_0", "a_1", "a_2"], vector: true, solution }),
          dedupeSaid(
            [
              say(
                vectorLatex([a2, a1, a0]),
                "The order is reversed: the basis starts with $1$, so the constant term comes first.",
                "顺序反了：基从 $1$ 开始，所以常数项在前。",
              ),
              say(
                vectorLatex([a0, -a1, a2]),
                "The sign of the $t$ coefficient is flipped; copy each coefficient with its sign.",
                "$t$ 的系数符号反了；每个系数要连同符号照抄。",
              ),
              say(
                vectorLatex([a1, a2, a0]),
                "The entries are shifted: the first coordinate is the weight on $1$, the constant term.",
                "各分量错位了：第一个坐标是 $1$ 的权重，即常数项。",
              ),
            ],
            vectorLatex(answer),
          ),
        );
      },
    },
    {
      id: "matrix-coordinate-vector-m22",
      title: t("Coordinate vector of a 2×2 matrix", "2×2 矩阵在标准基下的坐标向量"),
      explanation: t(
        "Each standard basis matrix has a single one in one position, so the coordinates of a matrix are its entries read row by row. For $M_{2 \\times 2}$ with the standard ordered basis $\\mathcal{B} = \\{E_{11}, E_{12}, E_{21}, E_{22}\\}$, the matrix $M = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ has coordinate vector $[M]_{\\mathcal{B}} = (a, b, c, d)^T$ in $\\mathbb{R}^4$. For example, $\\begin{pmatrix} 2 & -1 \\\\ 0 & 3 \\end{pmatrix}$ has coordinates $(2, -1, 0, 3)$.\n\n> **Watch out.** Read along the rows, as the basis is ordered $E_{11}, E_{12}, E_{21}, E_{22}$; reading down the columns swaps the middle two coordinates.",
        "每个标准基矩阵只在一个位置上有 1，所以矩阵的坐标就是按行读出的各个元素。在 $M_{2 \\times 2}$ 中，关于标准有序基 $\\mathcal{B} = \\{E_{11}, E_{12}, E_{21}, E_{22}\\}$，矩阵 $M = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$ 的坐标向量为 $\\mathbb{R}^4$ 中的 $[M]_{\\mathcal{B}} = (a, b, c, d)^T$。例如 $\\begin{pmatrix} 2 & -1 \\\\ 0 & 3 \\end{pmatrix}$ 的坐标为 $(2, -1, 0, 3)$。\n\n> **注意。** 基的顺序是 $E_{11}, E_{12}, E_{21}, E_{22}$，所以要按行读；按列读会把中间两个坐标交换。",
      ),
      generate(rng) {
        const a = rng.int(-4, 4);
        const b = rng.int(-4, 4);
        const c = rng.int(-4, 4);
        const d = rng.int(-4, 4);
        const M = [
          [a, b],
          [c, d],
        ];
        const answer = [a, b, c, d];
        const prompt = t(
          `Find the coordinate vector $[M]_{\\mathcal{B}}$ of the matrix $M = ${matLatex(M)}$ relative to the standard ordered basis $\\mathcal{B} = \\left\\{ \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\right\\}$ of $M_{2 \\times 2}$. Enter the vector as $\\langle a, b, c, d \\rangle$.`,
          `求矩阵 $M = ${matLatex(M)}$ 在 $M_{2 \\times 2}$ 的标准有序基 $\\mathcal{B} = \\left\\{ \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\right\\}$ 下的坐标向量 $[M]_{\\mathcal{B}}$。以 $\\langle a, b, c, d \\rangle$ 的形式输入结果。`,
        );
        const solution = walked(
          [
            [
              ["Split $M$ into basis matrices", "把 $M$ 拆成基矩阵"],
              t("Each entry is the weight on the basis matrix with a $1$ in that position:", "每个元素就是在该位置为 $1$ 的基矩阵的权重："),
              [`M = ${paren(a)}E_{11} + ${paren(b)}E_{12} + ${paren(c)}E_{21} + ${paren(d)}E_{22}`],
            ],
            [["List the weights in the basis order", "按基的顺序列出权重"], t("", ""), [`[M]_{\\mathcal{B}} = ${vectorLatex(answer)}`]],
          ],
          t(
            `The first two coordinates are the top row $(${a}, ${b})$ and the last two the bottom row $(${c}, ${d})$, as in $M$.`,
            `前两个坐标是第一行 $(${a}, ${b})$，后两个是第二行 $(${c}, ${d})$，与 $M$ 一致。`,
          ),
        );
        return withMistakes(
          pointProblem({ prompt, answer, vars: ["a", "b", "c", "d"], vector: true, solution }),
          dedupeSaid(
            [
              say(
                vectorLatex([a, c, b, d]),
                "That reads down the columns; the basis order $E_{11}, E_{12}, E_{21}, E_{22}$ reads along the rows.",
                "这是按列读的；基的顺序 $E_{11}, E_{12}, E_{21}, E_{22}$ 是按行读。",
              ),
              say(
                vectorLatex([d, c, b, a]),
                "The order is reversed: the first coordinate is the weight on $E_{11}$, the top left entry.",
                "顺序反了：第一个坐标是 $E_{11}$ 的权重，即左上角的元素。",
              ),
              say(
                vectorLatex([a, b, -c, -d]),
                "The bottom row has its signs flipped; copy each entry with its sign.",
                "第二行的符号反了；每个元素要连同符号照抄。",
              ),
            ],
            vectorLatex(answer),
          ),
        );
      },
    },
  ],
};

/** dimensionInAbstractVectorSpaces covers dimension formulas for P_n, M_{m×n}, symmetric matrices, and finite vs infinite dimensional spaces. */
export const dimensionInAbstractVectorSpaces: TopicDef = {
  id: "dimension-in-abstract-vector-spaces",
  title: t("Dimension in Abstract Vector Spaces", "抽象向量空间的维数"),
  summary: t(
    "Calculate dimensions such as $\\dim \\mathbb{P}_n = n + 1$ and $\\dim M_{m \\times n} = mn$, and distinguish finite-dimensional from infinite-dimensional spaces.",
    "计算维数，如 $\\dim \\mathbb{P}_n = n + 1$ 与 $\\dim M_{m \\times n} = mn$，并区分有限维与无限维向量空间。",
  ),
  intro: t(
    "$\\mathbb{P}_3$ has the basis $\\{1, t, t^2, t^3\\}$, so $\\dim \\mathbb{P}_3 = 4$, and $M_{2 \\times 3}$ has one basis matrix $E_{ij}$ for each of its $6$ positions, so $\\dim M_{2 \\times 3} = 6$.\n\nCheck: a polynomial in $\\mathbb{P}_3$ is fixed by its $4$ coefficients $a_0, a_1, a_2, a_3$, and a $2 \\times 3$ matrix by its $2 \\cdot 3 = 6$ entries, so the counts agree.\n\nIn this lesson we compute the dimensions of polynomial and matrix spaces and tell finite-dimensional spaces from infinite-dimensional ones.",
    "$\\mathbb{P}_3$ 有基 $\\{1, t, t^2, t^3\\}$，所以 $\\dim \\mathbb{P}_3 = 4$；$M_{2 \\times 3}$ 的 $6$ 个位置各对应一个基矩阵 $E_{ij}$，所以 $\\dim M_{2 \\times 3} = 6$。\n\n检验：$\\mathbb{P}_3$ 中的多项式由 $4$ 个系数 $a_0, a_1, a_2, a_3$ 确定，$2 \\times 3$ 矩阵由 $2 \\cdot 3 = 6$ 个元素确定，个数吻合。\n\n本课我们计算多项式空间和矩阵空间的维数，并区分有限维空间与无限维空间。",
  ),
  prerequisites: ["the-coordinates-of-a-vector-relative-to-a-basis-in-abstract-vector-spaces"],
  encompasses: [],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "dimension-formula-abstract-spaces",
      title: t("Dimension formulas for $\\mathbb{P}_n$ and $M_{m \\times n}$", "$\\mathbb{P}_n$ 与 $M_{m \\times n}$ 的维数公式"),
      explanation: t(
        "$\\dim(\\mathbb{P}_n) = n + 1$ because its standard basis $\\{1, t, \\dots, t^n\\}$ has $n + 1$ elements. For matrix spaces, $\\dim(M_{m \\times n}) = mn$. For the symmetric $n \\times n$ matrices, the dimension is $\\frac{n(n + 1)}{2}$. For example, a symmetric $3 \\times 3$ matrix is fixed by the $3$ diagonal entries and the $3$ entries above the diagonal, so that subspace has dimension $6 = \\frac{3 \\cdot 4}{2}$.\n\n> **Watch out.** Count free choices: $\\mathbb{P}_n$ has $n + 1$ coefficients because of the constant term, and in a symmetric matrix the entries below the diagonal are not free.",
        "$\\dim(\\mathbb{P}_n) = n + 1$，因为其标准基 $\\{1, t, \\dots, t^n\\}$ 包含 $n + 1$ 个元素。矩阵空间的维数为 $\\dim(M_{m \\times n}) = mn$。$n$ 阶对称矩阵子空间的维数为 $\\frac{n(n + 1)}{2}$。例如 $3 \\times 3$ 对称矩阵由 $3$ 个对角元和对角线上方的 $3$ 个元素确定，所以这个子空间的维数为 $6 = \\frac{3 \\cdot 4}{2}$。\n\n> **注意。** 数自由选择的个数：$\\mathbb{P}_n$ 因为有常数项而有 $n + 1$ 个系数；对称矩阵中对角线下方的元素不是自由的。",
      ),
      generate(rng) {
        const choice = rng.pick(["polynomials", "matrices", "symmetric"]);
        if (choice === "polynomials") {
          const n = rng.int(2, 15);
          const prompt = t(
            `What is the dimension of the polynomial vector space $\\mathbb{P}_{${n}}$?`,
            `多项式向量空间 $\\mathbb{P}_{${n}}$ 的维数是多少？`,
          );
          const solution = walked(
            [
              [
                ["Take the standard basis", "取标准基"],
                t(
                  `$\\mathbb{P}_{${n}}$ has the basis $\\{1, t, t^2, \\dots, t^{${n}}\\}$.`,
                  `$\\mathbb{P}_{${n}}$ 有基 $\\{1, t, t^2, \\dots, t^{${n}}\\}$。`,
                ),
              ],
              [
                ["Count it", "数个数"],
                t(`The powers $t^0$ to $t^{${n}}$ number:`, `幂 $t^0$ 到 $t^{${n}}$ 的个数为：`),
                [`${n} + 1 = ${n + 1}`],
              ],
            ],
            t(
              `A polynomial in $\\mathbb{P}_{${n}}$ is fixed by its $${n + 1}$ coefficients $a_0, \\dots, a_{${n}}$.`,
              `$\\mathbb{P}_{${n}}$ 中的多项式由 $${n + 1}$ 个系数 $a_0, \\dots, a_{${n}}$ 确定。`,
            ),
          );
          return numberProblem({
            prompt,
            answer: n + 1,
            form: "integer",
            mistakes: [
              why(n, "That leaves out the constant polynomial $1$, which is in the basis.", "这漏掉了常数多项式 $1$，它也在基中。"),
              why(
                n - 1,
                `Count the powers from $t^0$ to $t^{${n}}$; there are $${n + 1}$ of them.`,
                `数一数从 $t^0$ 到 $t^{${n}}$ 的幂；共有 $${n + 1}$ 个。`,
              ),
              why(2 * n, "Each power appears once in the basis; nothing is doubled.", "每个幂在基中只出现一次；没有加倍。"),
            ].filter((w, i, all) => w.value !== n + 1 && all.findIndex((o) => o.value === w.value) === i),
            solution,
          });
        }
        if (choice === "matrices") {
          const m = rng.int(2, 6);
          const n = rng.int(2, 6);
          const dim = m * n;
          const prompt = t(
            `What is the dimension of the vector space $M_{${m} \\times ${n}}$ of all $${m} \\times ${n}$ matrices?`,
            `所有 $${m} \\times ${n}$ 矩阵构成的向量空间 $M_{${m} \\times ${n}}$ 的维数是多少？`,
          );
          const solution = walked(
            [
              [
                ["Take the standard basis", "取标准基"],
                t(
                  "For each position $(i, j)$, the matrix $E_{ij}$ has a $1$ there and $0$ elsewhere.",
                  "对每个位置 $(i, j)$，矩阵 $E_{ij}$ 在该处为 $1$，其余为 $0$。",
                ),
              ],
              [["Count the positions", "数位置"], t("", ""), [`${m} \\times ${n} = ${dim}`]],
            ],
            t(
              `Each of the $${dim}$ entries can be chosen freely, one weight per $E_{ij}$.`,
              `$${dim}$ 个元素都可以自由选取，每个 $E_{ij}$ 对应一个权重。`,
            ),
          );
          return numberProblem({
            prompt,
            answer: dim,
            form: "integer",
            mistakes: [
              why(
                m + n,
                "That adds the numbers of rows and columns; the basis has one matrix per entry, $m \\times n$ of them.",
                "这是把行数和列数相加；基中每个元素位置对应一个矩阵，共 $m \\times n$ 个。",
              ),
              why(
                Math.max(m, n),
                "That counts only one row or one column; every entry gets its own basis matrix.",
                "这只数了一行或一列；每个元素位置都有自己的基矩阵。",
              ),
            ].filter((w, i, all) => w.value !== dim && all.findIndex((o) => o.value === w.value) === i),
            solution,
          });
        }
        const n = rng.int(2, 8);
        const dimSym = (n * (n + 1)) / 2;
        const prompt = t(
          `What is the dimension of the subspace of all symmetric $${n} \\times ${n}$ matrices in $M_{${n} \\times ${n}}$?`,
          `在 $M_{${n} \\times ${n}}$ 中，所有 $${n} \\times ${n}$ 对称矩阵构成的子空间的维数是多少？`,
        );
        const solution = walked(
          [
            [
              ["Find the free entries", "找出自由元素"],
              t(
                "$A^T = A$ means each entry below the diagonal equals the one above it, so only the diagonal and the entries above it are free.",
                "$A^T = A$ 表示对角线下方的每个元素等于上方对应的元素，所以只有对角线及其上方的元素是自由的。",
              ),
            ],
            [
              ["Count them", "数个数"],
              t(
                `Row $1$ has $${n}$ such entries, row $2$ has $${n - 1}$, and so on down to $1$:`,
                `第 $1$ 行有 $${n}$ 个，第 $2$ 行有 $${n - 1}$ 个，依此类推到 $1$：`,
              ),
              [`${n} + ${n - 1} + \\dots + 1 = \\frac{${n} \\cdot ${n + 1}}{2} = ${dimSym}`],
            ],
          ],
          t(
            `$${dimSym}$ free entries plus $${(n * (n - 1)) / 2}$ copied ones below the diagonal give all $${n * n}$ entries.`,
            `$${dimSym}$ 个自由元素加上对角线下方 $${(n * (n - 1)) / 2}$ 个复制的元素，正好是全部 $${n * n}$ 个元素。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: dimSym,
          form: "integer",
          mistakes: [
            why(
              n * n,
              "That is the dimension of all $n \\times n$ matrices; in a symmetric matrix the entries below the diagonal are not free.",
              "这是全部 $n \\times n$ 矩阵的维数；对称矩阵中对角线下方的元素不是自由的。",
            ),
            why(n, "That counts only the diagonal; the entries above it are free too.", "这只数了对角线；对角线上方的元素也是自由的。"),
            why(
              (n * (n - 1)) / 2,
              "That counts only the entries above the diagonal; the diagonal entries are free too.",
              "这只数了对角线上方的元素；对角元也是自由的。",
            ),
          ].filter((w, i, all) => w.value !== dimSym && all.findIndex((o) => o.value === w.value) === i),
          solution,
        });
      },
    },
    {
      id: "finite-vs-infinite-dimensional",
      title: t("Finite vs infinite-dimensional vector spaces", "有限维与无限维向量空间"),
      explanation: t(
        "A vector space is finite-dimensional if it is spanned by a finite set of vectors. Otherwise it is infinite-dimensional, such as the space $\\mathbb{P}$ of all polynomials, $C[a, b]$, or $C^\\infty(\\mathbb{R})$. For example, any finite set of polynomials has some highest degree $d$, so $t^{d + 1}$ is not in its span; hence no finite set spans $\\mathbb{P}$.\n\n> **Watch out.** A large dimension is still finite: $M_{2 \\times 10}$ has dimension $20$, while $C[a, b]$ has no finite basis at all.",
        "若向量空间可由有限个向量张成，则为有限维空间；否则为无限维空间，例如所有多项式的空间 $\\mathbb{P}$、连续函数空间 $C[a, b]$ 以及光滑函数空间 $C^\\infty(\\mathbb{R})$。例如任何有限个多项式都有一个最高次数 $d$，所以 $t^{d + 1}$ 不在它们的张成中；因此没有有限集能张成 $\\mathbb{P}$。\n\n> **注意。** 维数再大也仍是有限的：$M_{2 \\times 10}$ 的维数是 $20$，而 $C[a, b]$ 根本没有有限的基。",
      ),
      generate(rng) {
        const a = rng.int(-5, 0);
        const b = rng.int(1, 6);
        const d = rng.int(4, 10);
        const prompt = t(
          `Consider the vector spaces $C[${a}, ${b}]$, $\\mathbb{P}_{${d}}$, $M_{2 \\times ${d}}$, and $\\mathbb{R}^{${d}}$. Which of these is an infinite-dimensional vector space?`,
          `考虑向量空间 $C[${a}, ${b}]$、$\\mathbb{P}_{${d}}$、$M_{2 \\times ${d}}$ 与 $\\mathbb{R}^{${d}}$。其中哪一个是无限维向量空间？`,
        );
        const right = t(
          `$C[${a}, ${b}]$, the space of all continuous real functions on $[${a}, ${b}]$`,
          `$C[${a}, ${b}]$，区间 $[${a}, ${b}]$ 上的所有连续实函数构成的空间`,
        );
        const wrong = [
          t(`$\\mathbb{P}_{${d}}$, the space of polynomials of degree at most ${d}`, `$\\mathbb{P}_{${d}}$，次数不超过 ${d} 的多项式空间`),
          t(`$M_{2 \\times ${d}}$, the space of $2 \\times ${d}$ matrices`, `$M_{2 \\times ${d}}$，所有 $2 \\times ${d}$ 矩阵构成的空间`),
          t(`$\\mathbb{R}^{${d}}$, the ${d}-dimensional Euclidean space`, `$\\mathbb{R}^{${d}}$，${d} 维欧几里得空间`),
        ];
        const solution = walked(
          [
            [
              ["Count the finite ones", "数出有限维的"],
              t(
                `$\\mathbb{P}_{${d}}$ has dimension $${d + 1}$, $M_{2 \\times ${d}}$ has dimension $${2 * d}$, and $\\mathbb{R}^{${d}}$ has dimension $${d}$: each has a finite basis.`,
                `$\\mathbb{P}_{${d}}$ 的维数为 $${d + 1}$，$M_{2 \\times ${d}}$ 的维数为 $${2 * d}$，$\\mathbb{R}^{${d}}$ 的维数为 $${d}$：它们都有有限的基。`,
              ),
            ],
            [
              ["Look at the function space", "看函数空间"],
              t(
                `$C[${a}, ${b}]$ contains $1, x, x^2, x^3, \\dots$, and any finitely many of them are independent, so no finite set of functions spans it.`,
                `$C[${a}, ${b}]$ 含有 $1, x, x^2, x^3, \\dots$，其中任意有限个都线性无关，所以没有有限个函数能张成它。`,
              ),
            ],
          ],
          t(
            `If $C[${a}, ${b}]$ had dimension $N$, the $N + 1$ independent functions $1, x, \\dots, x^N$ could not exist in it; they do, so it is infinite-dimensional.`,
            `若 $C[${a}, ${b}]$ 的维数为 $N$，其中就不可能有 $N + 1$ 个线性无关的函数 $1, x, \\dots, x^N$；而它们确实存在，所以它是无限维的。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `The powers $1$ to $t^{${d}}$ form a basis, so its dimension is the finite number $${d + 1}$.`,
            `$1$ 到 $t^{${d}}$ 的各次幂构成一组基，所以它的维数是有限的 $${d + 1}$。`,
          ],
          [
            wrong[1]!.en,
            `A $2 \\times ${d}$ matrix has $${2 * d}$ entries, so this dimension is finite.`,
            `一个 $2 \\times ${d}$ 矩阵有 $${2 * d}$ 个元素，所以维数是有限的。`,
          ],
          [
            wrong[2]!.en,
            `The standard basis has $${d}$ vectors, so this dimension is finite.`,
            `标准基有 $${d}$ 个向量，所以维数是有限的。`,
          ],
        ]);
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// ALL TOPICS EXPORT
// ════════════════════════════════════════════════════════════════════════════

/** linearAlgebraVectorSpaceTopics contains the 27 topics of Unit 3 of Linear Algebra. */
export const linearAlgebraVectorSpaceTopics: readonly TopicDef[] = [
  // Module 3.9 (4 topics)
  vectorsInNDimensionalEuclideanSpace,
  linearCombinationsOfVectorsInNDimensionalEuclideanSpace,
  linearSpanOfVectorsInNDimensionalEuclideanSpace,
  linearDependenceAndIndependence,

  // Module 3.10 (4 topics)
  subspacesOfNDimensionalSpace,
  subspacesOfNDimensionalSpaceGeometricInterpretation,
  theColumnSpaceOfAMatrix,
  theNullSpaceOfAMatrix,

  // Module 3.11 (7 topics)
  findingABasisOfASpan,
  findingABasisOfTheColumnSpaceOfAMatrix,
  findingABasisOfTheNullSpaceOfAMatrix,
  expressingTheCoordinatesOfAVectorInAGivenBasis,
  writingVectorsInDifferentBases,
  theChangeOfCoordinatesMatrix,
  changingABasisUsingTheChangeOfCoordinatesMatrix,

  // Module 3.12 (5 topics)
  theDimensionOfASpan,
  theRankOfAMatrix,
  theDimensionOfTheNullSpaceOfAMatrix,
  theInvertibleMatrixTheoremInTermsOfDimensionRankAndNullity,
  theRankNullityTheorem,

  // Module 3.13 (7 topics)
  introductionToAbstractVectorSpaces,
  definingAbstractVectorSpaces,
  linearIndependenceInAbstractVectorSpaces,
  subspacesOfAbstractVectorSpaces,
  basesInAbstractVectorSpaces,
  theCoordinatesOfAVectorRelativeToABasisInAbstractVectorSpaces,
  dimensionInAbstractVectorSpaces,
];
