import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { linearAlgebraDrawings2 } from "../explanation-drawings-linear-algebra-2.ts";

import {
  article,
  choiceProblem,
  numberProblem,
  pointLatex,
  pointProblem,
  say,
  solutionsProblem,
  vectorLatex,
  why,
  whySet,
  withMistakes,
} from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

// Linear Algebra Units 7 & 8: Diagonalization of Symmetric Matrices, Quadratic Forms,
// Quadratic Forms in Euclidean Space, Singular Value Decomposition, Linear Least-Squares,
// Markov Chains, and Linear Regression (29 topics).

type Mat2 = readonly [readonly [number, number], readonly [number, number]];
type Mat3 = readonly [readonly [number, number, number], readonly [number, number, number], readonly [number, number, number]];
type Mat3x2 = readonly [readonly [number, number], readonly [number, number], readonly [number, number]];
type Vec2 = readonly [number, number];
type Vec3 = readonly [number, number, number];

/** mat2Latex formats a 2x2 numeric matrix as a LaTeX pmatrix. */
function mat2Latex(m: Mat2): string {
  return `\\begin{pmatrix} ${m[0][0]} & ${m[0][1]} \\\\ ${m[1][0]} & ${m[1][1]} \\end{pmatrix}`;
}

/** mat2StrLatex formats a 2x2 string matrix as a LaTeX pmatrix. */
function mat2StrLatex(m: readonly [readonly [string, string], readonly [string, string]]): string {
  return `\\begin{pmatrix} ${m[0][0]} & ${m[0][1]} \\\\ ${m[1][0]} & ${m[1][1]} \\end{pmatrix}`;
}

/** mat3Latex formats a 3x3 numeric matrix as a LaTeX pmatrix. */
function mat3Latex(m: Mat3): string {
  return `\\begin{pmatrix} ${m[0][0]} & ${m[0][1]} & ${m[0][2]} \\\\ ${m[1][0]} & ${m[1][1]} & ${m[1][2]} \\\\ ${m[2][0]} & ${m[2][1]} & ${m[2][2]} \\end{pmatrix}`;
}

/** mat3x2Latex formats a 3x2 numeric matrix as a LaTeX pmatrix. */
function mat3x2Latex(m: Mat3x2): string {
  return `\\begin{pmatrix} ${m[0][0]} & ${m[0][1]} \\\\ ${m[1][0]} & ${m[1][1]} \\\\ ${m[2][0]} & ${m[2][1]} \\end{pmatrix}`;
}

/** vec2Latex formats a 2-element vector as a LaTeX pmatrix. */
function vec2Latex(v: Vec2 | readonly [string, string]): string {
  return `\\begin{pmatrix} ${v[0]} \\\\ ${v[1]} \\end{pmatrix}`;
}

/** vec3Latex formats a 3-element vector as a LaTeX pmatrix. */
function vec3Latex(v: Vec3 | readonly [string, string, string]): string {
  return `\\begin{pmatrix} ${v[0]} \\\\ ${v[1]} \\\\ ${v[2]} \\end{pmatrix}`;
}

/** formatSignedTerm formats "+ c var" or "- c var" without "+ -". */
function formatSignedTerm(c: number, variable: string): string {
  if (c === 0) return "";
  const sign = c > 0 ? "+ " : "- ";
  const abs = Math.abs(c);
  const coeff = abs === 1 ? "" : `${abs}`;
  return `${sign}${coeff}${variable}`;
}

/** formatFirstTerm formats "c var" or "-c var" for the leading term. */
function formatFirstTerm(c: number, variable: string): string {
  if (c === 0) return "";
  if (c === 1) return variable;
  if (c === -1) return `-${variable}`;
  return `${c}${variable}`;
}

/** formatQuadratic formats a x1^2 + b x1 x2 + c x2^2 cleanly without "+ -". */
function formatQuadratic(a: number, b: number, c: number, v1 = "x_1", v2 = "x_2"): string {
  let res = formatFirstTerm(a, `${v1}^2`);
  if (b !== 0) {
    res = res ? `${res} ${formatSignedTerm(b, `${v1} ${v2}`)}` : formatFirstTerm(b, `${v1} ${v2}`);
  }
  if (c !== 0) {
    res = res ? `${res} ${formatSignedTerm(c, `${v2}^2`)}` : formatFirstTerm(c, `${v2}^2`);
  }
  return res || "0";
}

/** formatBilinear formats a11 x1 y1 + a12 x1 y2 + a21 x2 y1 + a22 x2 y2 without "+ -". */
function formatBilinear(a11: number, a12: number, a21: number, a22: number): string {
  let res = formatFirstTerm(a11, "x_1 y_1");
  if (a12 !== 0) res = res ? `${res} ${formatSignedTerm(a12, "x_1 y_2")}` : formatFirstTerm(a12, "x_1 y_2");
  if (a21 !== 0) res = res ? `${res} ${formatSignedTerm(a21, "x_2 y_1")}` : formatFirstTerm(a21, "x_2 y_1");
  if (a22 !== 0) res = res ? `${res} ${formatSignedTerm(a22, "x_2 y_2")}` : formatFirstTerm(a22, "x_2 y_2");
  return res || "0";
}

/** formatDiagonalForm formats d1 y1^2 + d2 y2^2 without "+ -". */
function formatDiagonalForm(d1: number, d2: number, v1 = "y_1", v2 = "y_2"): string {
  let res = formatFirstTerm(d1, `${v1}^2`);
  if (d2 !== 0) {
    res = res ? `${res} ${formatSignedTerm(d2, `${v2}^2`)}` : formatFirstTerm(d2, `${v2}^2`);
  }
  return res || "0";
}

/** formatAddVar formats "+ c v" or "- c v" for linear combinations like x_1 + 2 x_2. */
function formatAddVar(c: number, v: string): string {
  if (c === 0) return "";
  if (c === 1) return `+ ${v}`;
  if (c === -1) return `- ${v}`;
  return c > 0 ? `+ ${c}${v}` : `- ${-c}${v}`;
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

/** dedupeSaid drops mistakes that repeat the right response or an earlier mistake. */
function dedupeSaid<T extends { readonly response: string }>(list: readonly T[], right: string): T[] {
  return list.filter((m, i, all) => m.response !== right && all.findIndex((o) => o.response === m.response) === i);
}

/** distinct drops number mistakes that equal the answer or repeat an earlier one. */
function distinct<T extends { readonly value: number | Q }>(list: readonly T[], answer: number | Q): T[] {
  return list.filter((m, i, all) => String(m.value) !== String(answer) && all.findIndex((o) => String(o.value) === String(m.value)) === i);
}

/** paren wraps a negative number in parentheses for use inside a product. */
const paren = (x: number) => (x < 0 ? `(${x})` : `${x}`);

/** signed writes "+ n" or "- |n|" after an earlier term. */
const signed = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`);

/** lead writes a leading coefficient in front of a vector or symbol, dropping a 1. */
const lead = (c: number, body: string) => `${c === 1 ? "" : c === -1 ? "-" : c}${body}`;

/** plus writes "+ c body" or "- |c| body" after an earlier term, dropping a 1. */
const plus = (c: number, body: string) => (c < 0 ? `- ${lead(-c, body)}` : `+ ${lead(c, body)}`);

/** symFromEigen is the symmetric matrix with eigenvalue l1 on (1, k) and l2 on (-k, 1); l1 - l2 must be a multiple of 1 + k^2. */
function symFromEigen(l1: number, l2: number, k: number): Mat2 {
  const n = 1 + k * k;
  const off = (k * (l1 - l2)) / n;
  return [
    [(l1 + l2 * k * k) / n, off],
    [off, (l1 * k * k + l2) / n],
  ];
}

/** pickEigenPair draws distinct integer eigenvalues l1, l2 and a slope k in {1, 2} that make symFromEigen integral. */
function pickEigenPair(rng: Rng, lo: number, hi: number): [number, number, number] {
  const k = rng.int(1, 2);
  const n = 1 + k * k;
  const l1 = rng.int(lo, hi);
  const steps = rng.pick([-2, -1, 1, 2]);
  return [l1, l1 + steps * n, k];
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE 7.25: DIAGONALIZATION OF SYMMETRIC MATRICES
// ════════════════════════════════════════════════════════════════════════════

/** symmetricMatrices covers properties of symmetric matrices and their eigenvectors. */
export const symmetricMatrices: TopicDef = {
  id: "symmetric-matrices",
  title: t("Symmetric Matrices", "对称矩阵"),
  summary: t(
    "Identify symmetric matrices, verify the reality of their eigenvalues, and apply the orthogonality of eigenvectors for distinct eigenvalues.",
    "识别对称矩阵，掌握实对称矩阵特征值为实数以及不同特征值对应的特征向量相互正交的性质。",
  ),
  intro: t(
    "The matrix $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ equals its transpose. It sends $(1, 1)$ to $(3, 3)$ and $(1, -1)$ to $(1, -1)$, so its eigenvalues are $3$ and $1$, and the two eigenvectors have dot product $1 - 1 = 0$.\n\nCheck: $\\det(A - \\lambda I) = (2 - \\lambda)^2 - 1$ is zero at $\\lambda = 1$ and $\\lambda = 3$, the same two eigenvalues, both real.\n\nIn this lesson we recognise symmetric matrices, fill in entries that make a matrix symmetric, and use the fact that eigenvectors for different eigenvalues are orthogonal to find one eigenvector from another.",
    "矩阵 $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ 等于它的转置。它把 $(1, 1)$ 变为 $(3, 3)$，把 $(1, -1)$ 变为 $(1, -1)$，所以特征值是 $3$ 和 $1$，两个特征向量的点积为 $1 - 1 = 0$。\n\n检验：$\\det(A - \\lambda I) = (2 - \\lambda)^2 - 1$ 在 $\\lambda = 1$ 和 $\\lambda = 3$ 处为零，正是这两个特征值，而且都是实数。\n\n本课我们识别对称矩阵，补全使矩阵对称的元素，并利用不同特征值的特征向量相互正交，由一个特征向量求出另一个。",
  ),
  prerequisites: ["calculating-the-eigenvalues-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "symmetric-matrices-properties",
      title: t("Orthogonality of Eigenvectors of Symmetric Matrices", "对称矩阵特征向量的正交性"),
      explanation: t(
        "A real matrix $A$ is symmetric if $A^T = A$. For any real symmetric matrix, all eigenvalues are real, and eigenvectors corresponding to distinct eigenvalues are mutually orthogonal ($u \\cdot v = 0$). For example, if $(2, 1)$ is one eigenvector of a $2 \\times 2$ symmetric matrix, an eigenvector for the other eigenvalue with first component $-2$ satisfies $2(-2) + 1 \\cdot x_2 = 0$, so it is $(-2, 4)$.\n\n> **Watch out.** The second eigenvector is orthogonal to the first, not equal to it, and its first component is the one given. Set the dot product to zero and solve for the missing component.",
        "实矩阵 $A$ 满足 $A^T = A$ 时称为实对称矩阵。实对称矩阵的特征值全为实数，且属于不同特征值的特征向量相互正交（点积为 0）。例如若 $(2, 1)$ 是某 $2 \\times 2$ 对称矩阵的一个特征向量，则另一特征值的、第一个分量为 $-2$ 的特征向量满足 $2(-2) + 1 \\cdot x_2 = 0$，所以它是 $(-2, 4)$。\n\n> **注意。** 第二个特征向量与第一个正交，而不是相等，并且它的第一个分量是题目给定的。令点积为零，解出缺少的分量。",
      ),
      generate: (rng: Rng): Problem => {
        const u1 = rng.nonZero(-6, 6);
        const u2 = rng.nonZero(-6, 6);
        const k = rng.nonZero(-3, 3);
        const v1 = -k * u2;
        const v2 = k * u1;

        const prompt = t(
          `Let $A$ be a $2 \\times 2$ real symmetric matrix with distinct eigenvalues $\\lambda_1 \\ne \\lambda_2$. If $v_1 = ${vec2Latex([u1, u2])}$ is an eigenvector corresponding to $\\lambda_1$, find the eigenvector $v_2 = \\langle x_1, x_2 \\rangle$ corresponding to $\\lambda_2$ whose first component is $x_1 = ${v1}$. Enter the vector as $\\langle x_1, x_2 \\rangle$.`,
          `设 $A$ 为 $2 \\times 2$ 实对称矩阵，具有两个不相等的特征值 $\\lambda_1 \\ne \\lambda_2$。若 $v_1 = ${vec2Latex([u1, u2])}$ 是对应于 $\\lambda_1$ 的特征向量，求对应于 $\\lambda_2$ 且第一个分量为 $x_1 = ${v1}$ 的特征向量 $v_2 = \\langle x_1, x_2 \\rangle$。以 $\\langle x_1, x_2 \\rangle$ 的形式输入向量。`,
        );

        const solution = walked(
          [
            [
              ["Use orthogonality", "利用正交性"],
              t(
                "$A$ is symmetric and the eigenvalues differ, so $v_1 \\cdot v_2 = 0$:",
                "$A$ 是对称矩阵且两个特征值不同，所以 $v_1 \\cdot v_2 = 0$：",
              ),
              [`(${u1})(${v1}) + (${u2})x_2 = 0`],
            ],
            [["Solve for the second component", "解出第二个分量"], t("", ""), [`(${u2})x_2 = ${-u1 * v1}`, `x_2 = ${v2}`]],
          ],
          t(
            `$(${u1})(${v1}) + (${u2})(${v2}) = ${u1 * v1} + ${paren(u2 * v2)} = 0$, so $v_2 = \\langle ${v1}, ${v2} \\rangle$ is orthogonal to $v_1$.`,
            `$(${u1})(${v1}) + (${u2})(${v2}) = ${u1 * v1} + ${paren(u2 * v2)} = 0$，所以 $v_2 = \\langle ${v1}, ${v2} \\rangle$ 与 $v_1$ 正交。`,
          ),
        );

        const wrong = [
          [v1, -v2],
          [-v1, v2],
          [u1, u2],
          [-u2, u1],
        ];
        return withMistakes(
          pointProblem({ prompt, answer: [v1, v2], vector: true, vars: ["x_1", "x_2"], solution, wrong }),
          dedupeSaid(
            [
              say(
                vectorLatex(wrong[0]!),
                `The sign of $x_2$ is flipped: its dot product with $v_1$ is $${2 * u1 * v1}$, not $0$.`,
                `$x_2$ 的符号反了：它与 $v_1$ 的点积是 $${2 * u1 * v1}$，不是 $0$。`,
              ),
              say(vectorLatex(wrong[1]!), `The first component must be the given $x_1 = ${v1}$.`, `第一个分量必须是给定的 $x_1 = ${v1}$。`),
              say(
                vectorLatex(wrong[2]!),
                "That is $v_1$ itself; an eigenvector for $\\lambda_2$ must be orthogonal to $v_1$.",
                "这是 $v_1$ 本身；$\\lambda_2$ 的特征向量必须与 $v_1$ 正交。",
              ),
              say(
                vectorLatex(wrong[3]!),
                `That points the right way but is not scaled to the given first component $${v1}$.`,
                `方向对了，但没有按给定的第一个分量 $${v1}$ 缩放。`,
              ),
            ],
            vectorLatex([v1, v2]),
          ),
        );
      },
    },
    {
      id: "making-a-matrix-symmetric",
      title: t("Making a matrix symmetric", "使矩阵成为对称矩阵"),
      explanation: t(
        "A square matrix is symmetric when $A^T = A$, that is, $a_{ij} = a_{ji}$ for every pair of positions mirrored across the main diagonal. The diagonal entries are unrestricted. To make a matrix with an unknown entry symmetric, set that entry equal to its mirror image and solve the resulting equation. For example, if $a_{12} = 3x - 1$ and $a_{21} = 8$, symmetry needs $3x - 1 = 8$, so $3x = 9$ and $x = 3$.\n\n> **Watch out.** Undo the constant before dividing by the coefficient: from $3x - 1 = 8$, add $1$ first to get $3x = 9$, then divide by $3$.",
        "方阵满足 $A^T = A$，即关于主对角线对称的每对位置都有 $a_{ij} = a_{ji}$ 时，称为对称矩阵。对角元不受限制。要让含未知元的矩阵对称，令该元等于它的镜像元并解所得方程。例如若 $a_{12} = 3x - 1$，$a_{21} = 8$，对称要求 $3x - 1 = 8$，于是 $3x = 9$，$x = 3$。\n\n> **注意。** 先消去常数项，再除以系数：由 $3x - 1 = 8$，先加 $1$ 得 $3x = 9$，再除以 $3$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.pick([2, 3, 4, -2, -3]);
        const x = rng.nonZero(-5, 5);
        const q = rng.int(-6, 6);
        const v = p * x + q;
        const pos = rng.int(0, 2);
        const others = [rng.int(-5, 9), rng.int(-5, 9), rng.int(-5, 9)];
        const expr = `${p}x ${q === 0 ? "" : q > 0 ? `+ ${q}` : `- ${-q}`}`.trim();
        const m: string[][] = [
          [String(others[0]), "", ""],
          ["", String(others[1]), ""],
          ["", "", String(others[2])],
        ];
        const e = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6)];
        const pairs = [
          [0, 1],
          [0, 2],
          [1, 2],
        ] as const;
        pairs.forEach(([i, j], idx) => {
          m[i]![j] = idx === pos ? expr : String(e[idx]);
          m[j]![i] = idx === pos ? String(v) : String(e[idx]);
        });
        const [i, j] = pairs[pos]!;
        const latex = `\\begin{pmatrix} ${m.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
        const px = `${p}x`;
        const moved = q === 0 ? [] : [`${px} = ${v} ${q > 0 ? `- ${q}` : `+ ${-q}`} = ${v - q}`];
        return numberProblem({
          prompt: t(`Find $x$ so that $${latex}$ is symmetric.`, `求 $x$，使 $${latex}$ 为对称矩阵。`),
          answer: x,
          wrong: [v - q, -x, Q.of(v, p), Q.of(v + q, p)],
          solution: walked(
            [
              [
                ["Match the mirrored entries", "令对称位置相等"],
                t(
                  `Symmetry requires $a_{${i + 1}${j + 1}} = a_{${j + 1}${i + 1}}$:`,
                  `对称要求 $a_{${i + 1}${j + 1}} = a_{${j + 1}${i + 1}}$：`,
                ),
                [`${expr} = ${v}`],
              ],
              [["Solve for x", "解出 x"], t("", ""), [...moved, `x = ${x}`]],
            ],
            t(
              `$${p}(${x}) ${q === 0 ? "" : q > 0 ? `+ ${q}` : `- ${-q}`} = ${v}$, the mirrored entry.`.replace("  ", " "),
              `$${p}(${x}) ${q === 0 ? "" : q > 0 ? `+ ${q}` : `- ${-q}`} = ${v}$，正是对称位置的元素。`.replace("  ", " "),
            ),
          ),
          mistakes: distinct(
            [
              why(v - q, `That is $${px}$, not $x$; divide by $${p}$ as well.`, `这是 $${px}$，不是 $x$；还要除以 $${p}$。`),
              why(-x, "The sign is flipped; recheck the division.", "符号反了；重新检查除法。"),
              why(
                Q.of(v, p),
                `That divides $${v}$ by $${p}$ before removing the constant $${q}$.`,
                `这是没有先消去常数 $${q}$ 就用 $${v}$ 除以 $${p}$。`,
              ),
              why(Q.of(v + q, p), `The constant $${q}$ was moved across without changing its sign.`, `常数 $${q}$ 移项时没有变号。`),
            ],
            x,
          ),
        });
      },
    },
  ],
};

/** diagonalizationOf2x2SymmetricMatrices covers orthogonal diagonalization of 2x2 symmetric matrices. */
export const diagonalizationOf2x2SymmetricMatrices: TopicDef = {
  id: "diagonalization-of-2x2-symmetric-matrices",
  title: t("Diagonalization of 2x2 Symmetric Matrices", "2x2 对称矩阵的正交对角化"),
  summary: t(
    "Orthogonally diagonalize a $2 \\times 2$ symmetric matrix as $A = PDP^T$ with $P$ orthogonal and $D$ diagonal.",
    "将 $2 \\times 2$ 对称矩阵正交对角化为 $A = PDP^T$，其中 $P$ 为正交矩阵，$D$ 为对角矩阵。",
  ),
  intro: t(
    "For $A = \\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$, the eigenvalues are $3 - 1 = 2$ with unit eigenvector $\\frac{1}{\\sqrt{2}}(1, -1)$ and $3 + 1 = 4$ with unit eigenvector $\\frac{1}{\\sqrt{2}}(1, 1)$. Putting these as the columns of $P$ and the eigenvalues in the same order on the diagonal of $D$ gives $A = PDP^T$ with $D = \\begin{pmatrix} 2 & 0 \\\\ 0 & 4 \\end{pmatrix}$.\n\nCheck: the trace of $D$ is $2 + 4 = 6$, the trace of $A$, and $\\det D = 8 = 9 - 1 = \\det A$.\n\nIn this lesson we find the diagonal factor $D$ of a $2 \\times 2$ symmetric matrix, and run $A = PDP^T$ backwards to rebuild $A$ from its eigenvectors and eigenvalues.",
    "对 $A = \\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$，特征值 $3 - 1 = 2$ 的单位特征向量为 $\\frac{1}{\\sqrt{2}}(1, -1)$，特征值 $3 + 1 = 4$ 的单位特征向量为 $\\frac{1}{\\sqrt{2}}(1, 1)$。把它们作为 $P$ 的列，并按同样的顺序把特征值放在 $D$ 的对角线上，就得到 $A = PDP^T$，其中 $D = \\begin{pmatrix} 2 & 0 \\\\ 0 & 4 \\end{pmatrix}$。\n\n检验：$D$ 的迹是 $2 + 4 = 6$，等于 $A$ 的迹；$\\det D = 8 = 9 - 1 = \\det A$。\n\n本课我们求 $2 \\times 2$ 对称矩阵的对角因子 $D$，并把 $A = PDP^T$ 反过来用，由特征向量和特征值还原 $A$。",
  ),
  prerequisites: ["symmetric-matrices"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "orthogonal-diagonalization-2x2",
      title: t("Orthogonal Diagonalization of a 2x2 Matrix", "2x2 矩阵的正交对角化"),
      explanation: t(
        "Every real symmetric matrix $A$ can be orthogonally diagonalized as $A = P D P^T$, where $P$ is an orthogonal matrix ($P^{-1} = P^T$) whose columns are orthonormal eigenvectors, and $D$ contains the eigenvalues of $A$. For example, $\\begin{pmatrix} a & b \\\\ b & a \\end{pmatrix}$ has $\\det(A - \\lambda I) = (a - \\lambda)^2 - b^2$, so $\\lambda = a \\pm b$; for $a = 1$, $b = 4$ this gives $D = \\begin{pmatrix} -3 & 0 \\\\ 0 & 5 \\end{pmatrix}$.\n\n> **Watch out.** The diagonal of $D$ holds the eigenvalues, not the entries of $A$. Keep the order asked for: with $\\lambda_1 \\le \\lambda_2$, the smaller eigenvalue comes first.",
        "任意实对称矩阵 $A$ 都可以正交对角化为 $A = P D P^T$，其中正交矩阵 $P$（满足 $P^{-1} = P^T$）的各列为标准正交特征向量，对角矩阵 $D$ 的对角元为 $A$ 的特征值。例如 $\\begin{pmatrix} a & b \\\\ b & a \\end{pmatrix}$ 有 $\\det(A - \\lambda I) = (a - \\lambda)^2 - b^2$，所以 $\\lambda = a \\pm b$；当 $a = 1$，$b = 4$ 时得 $D = \\begin{pmatrix} -3 & 0 \\\\ 0 & 5 \\end{pmatrix}$。\n\n> **注意。** $D$ 的对角线上是特征值，而不是 $A$ 的元素。按题目要求的顺序排列：$\\lambda_1 \\le \\lambda_2$ 时较小的特征值在前。",
      ),
      generate: (rng: Rng): Problem => {
        const m = rng.int(-5, 5);
        const k = rng.int(1, 6);
        const a = m;
        const b = k;
        const lambda1 = m - k;
        const lambda2 = m + k;

        const prompt = t(
          `Find the diagonal matrix $D = \\begin{pmatrix} \\lambda_1 & 0 \\\\ 0 & \\lambda_2 \\end{pmatrix}$ with $\\lambda_1 \\le \\lambda_2$ in the orthogonal diagonalization $A = P D P^T$ of the symmetric matrix\n\n$$A = ${mat2Latex(
            [
              [a, b],
              [b, a],
            ],
          )}.$$`,
          `求对称矩阵 $A = ${mat2Latex([
            [a, b],
            [b, a],
          ])}$ 在正交对角化 $A = P D P^T$ 中的对角矩阵 $D = \\begin{pmatrix} \\lambda_1 & 0 \\\\ 0 & \\lambda_2 \\end{pmatrix}$（满足 $\\lambda_1 \\le \\lambda_2$）。`,
        );

        const right = t(
          `$${mat2Latex([
            [lambda1, 0],
            [0, lambda2],
          ])}$`,
          `$${mat2Latex([
            [lambda1, 0],
            [0, lambda2],
          ])}$`,
        );
        const wrong = [
          t(
            `$${mat2Latex([
              [lambda2, 0],
              [0, lambda1],
            ])}$`,
            `$${mat2Latex([
              [lambda2, 0],
              [0, lambda1],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [a, 0],
              [0, b],
            ])}$`,
            `$${mat2Latex([
              [a, 0],
              [0, b],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [lambda1, 0],
              [0, -lambda2],
            ])}$`,
            `$${mat2Latex([
              [lambda1, 0],
              [0, -lambda2],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [m, 0],
              [0, m],
            ])}$`,
            `$${mat2Latex([
              [m, 0],
              [0, m],
            ])}$`,
          ),
        ];

        const dRight = mat2Latex([
          [lambda1, 0],
          [0, lambda2],
        ]);
        const solution = walked(
          [
            [
              ["Write the characteristic equation", "写出特征方程"],
              t("", ""),
              [`\\det(A - \\lambda I) = (${a} - \\lambda)^2 - ${b}^2 = 0`, `${a} - \\lambda = \\pm ${b}`],
            ],
            [
              ["Order the eigenvalues", "排列特征值"],
              t(`So $\\lambda = ${a} \\pm ${b}$, and the smaller one goes first:`, `所以 $\\lambda = ${a} \\pm ${b}$，较小的在前：`),
              [`\\lambda_1 = ${lambda1}, \\quad \\lambda_2 = ${lambda2}`, `D = ${dRight}`],
            ],
          ],
          t(
            `The trace of $D$ is $${lambda1} + ${paren(lambda2)} = ${2 * a}$ and the trace of $A$ is $${a} + ${paren(a)} = ${2 * a}$; $\\det D = ${lambda1 * lambda2} = ${a * a} - ${b * b} = \\det A$.`,
            `$D$ 的迹为 $${lambda1} + ${paren(lambda2)} = ${2 * a}$，$A$ 的迹为 $${a} + ${paren(a)} = ${2 * a}$；$\\det D = ${lambda1 * lambda2} = ${a * a} - ${b * b} = \\det A$。`,
          ),
        );

        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "Those are the eigenvalues in the wrong order; the problem asks for $\\lambda_1 \\le \\lambda_2$.",
            "特征值的顺序反了；题目要求 $\\lambda_1 \\le \\lambda_2$。",
          ],
          [wrong[1]!.en, "Those are two entries of $A$, not its eigenvalues.", "这是 $A$ 的两个元素，不是它的特征值。"],
          [
            wrong[2]!.en,
            `The second eigenvalue is $${a} + ${b} = ${lambda2}$; its sign was flipped.`,
            `第二个特征值是 $${a} + ${b} = ${lambda2}$；符号被弄反了。`,
          ],
          [
            wrong[3]!.en,
            `That is the diagonal of $A$; the off-diagonal entries $${b}$ shift the eigenvalues to $${a} \\pm ${b}$.`,
            `这是 $A$ 的对角线；非对角元 $${b}$ 使特征值变为 $${a} \\pm ${b}$。`,
          ],
        ]);
      },
    },
    {
      id: "rebuilding-a-symmetric-matrix-from-its-eigen-data",
      title: t("Rebuilding a symmetric matrix from $P$ and $D$", "由 $P$ 与 $D$ 还原对称矩阵"),
      explanation: t(
        "An orthogonal diagonalization $A = PDP^T$ can be run backwards. If the unit eigenvectors are $\\frac{1}{\\sqrt{n}}(1, k)$ for $\\lambda_1$ and $\\frac{1}{\\sqrt{n}}(-k, 1)$ for $\\lambda_2$, with $n = 1 + k^2$, then multiplying out gives\n\n$$A = \\frac{1}{n}\\begin{pmatrix} \\lambda_1 + k^2\\lambda_2 & k(\\lambda_1 - \\lambda_2) \\\\ k(\\lambda_1 - \\lambda_2) & k^2\\lambda_1 + \\lambda_2 \\end{pmatrix}.$$\n\nThe result is automatically symmetric, and its trace is $\\lambda_1 + \\lambda_2$. For example, with $k = 1$, $\\lambda_1 = 5$ and $\\lambda_2 = 1$, $A = \\frac{1}{2}\\begin{pmatrix} 6 & 4 \\\\ 4 & 6 \\end{pmatrix} = \\begin{pmatrix} 3 & 2 \\\\ 2 & 3 \\end{pmatrix}$.\n\n> **Watch out.** Multiply in the order $PDP^T$, with the eigenvectors as the columns of $P$. The order $P^TDP$ flips the sign of the off-diagonal entry, and $D$ alone is not $A$.",
        "正交对角化 $A = PDP^T$ 可以反过来用。若 $\\lambda_1$ 的单位特征向量为 $\\frac{1}{\\sqrt{n}}(1, k)$，$\\lambda_2$ 的为 $\\frac{1}{\\sqrt{n}}(-k, 1)$，$n = 1 + k^2$，则乘开得\n\n$$A = \\frac{1}{n}\\begin{pmatrix} \\lambda_1 + k^2\\lambda_2 & k(\\lambda_1 - \\lambda_2) \\\\ k(\\lambda_1 - \\lambda_2) & k^2\\lambda_1 + \\lambda_2 \\end{pmatrix}$$\n\n结果自然是对称的，迹为 $\\lambda_1 + \\lambda_2$。例如 $k = 1$，$\\lambda_1 = 5$，$\\lambda_2 = 1$ 时，$A = \\frac{1}{2}\\begin{pmatrix} 6 & 4 \\\\ 4 & 6 \\end{pmatrix} = \\begin{pmatrix} 3 & 2 \\\\ 2 & 3 \\end{pmatrix}$。\n\n> **注意。** 按 $PDP^T$ 的顺序相乘，$P$ 的列是特征向量。按 $P^TDP$ 的顺序会使非对角元变号，而 $D$ 本身也不是 $A$。",
      ),
      generate(rng: Rng): Problem {
        const [l1, l2, k] = pickEigenPair(rng, -4, 6);
        const A = symFromEigen(l1, l2, k);
        const n = 1 + k * k;
        const ans = [A[0][0], A[0][1], A[1][1]] as const;
        const swapped = [A[1][1], A[0][1], A[0][0]];
        const flipped = [A[0][0], -A[0][1], A[1][1]];
        const justD = [l1, 0, l2];
        const problem = pointProblem({
          prompt: t(
            `A symmetric matrix $A = PDP^T$ has $P = \\frac{1}{\\sqrt{${n}}}${mat2Latex([
              [1, -k],
              [k, 1],
            ])}$ and $D = ${mat2Latex([
              [l1, 0],
              [0, l2],
            ])}$. Enter $(a_{11}, a_{12}, a_{22})$.`,
            `对称矩阵 $A = PDP^T$，$P = \\frac{1}{\\sqrt{${n}}}${mat2Latex([
              [1, -k],
              [k, 1],
            ])}$，$D = ${mat2Latex([
              [l1, 0],
              [0, l2],
            ])}$。输入 $(a_{11}, a_{12}, a_{22})$。`,
          ),
          answer: ans,
          vars: ["a_{11}", "a_{12}", "a_{22}"],
          wrong: [swapped, flipped, justD],
          solution: walked(
            [
              [
                ["Multiply out the product", "乘开乘积"],
                t(`With $k = ${k}$ and $n = 1 + ${k}^2 = ${n}$, the formula gives`, `这里 $k = ${k}$，$n = 1 + ${k}^2 = ${n}$，由公式得`),
                [
                  `A = \\frac{1}{${n}}${mat2Latex([
                    [l1 + l2 * k * k, k * (l1 - l2)],
                    [k * (l1 - l2), l1 * k * k + l2],
                  ])} = ${mat2Latex(A)}`,
                ],
              ],
              [
                ["Read off the entries", "读出元素"],
                t("", ""),
                [`a_{11} = ${A[0][0]}, \\quad a_{12} = ${A[0][1]}, \\quad a_{22} = ${A[1][1]}`],
              ],
            ],
            t(
              `The trace is $${A[0][0]} + ${paren(A[1][1])} = ${A[0][0] + A[1][1]} = ${l1} + ${paren(l2)}$, the sum of the eigenvalues.`,
              `迹为 $${A[0][0]} + ${paren(A[1][1])} = ${A[0][0] + A[1][1]} = ${l1} + ${paren(l2)}$，等于特征值之和。`,
            ),
          ),
        });
        return withMistakes(
          problem,
          dedupeSaid(
            [
              say(pointLatex(swapped), "The two diagonal entries are swapped.", "两个对角元的位置换反了。"),
              say(
                pointLatex(flipped),
                "The sign of $a_{12}$ is flipped, as if the product were $P^TDP$ instead of $PDP^T$.",
                "$a_{12}$ 的符号反了，好像算的是 $P^TDP$ 而不是 $PDP^T$。",
              ),
              say(
                pointLatex(justD),
                "That reads the entries off $D$; $A = PDP^T$ also mixes in the eigenvectors.",
                "这是直接读 $D$ 的元素；$A = PDP^T$ 还要乘上特征向量。",
              ),
            ],
            pointLatex(ans),
          ),
        );
      },
    },
  ],
};

/** diagonalizationOf3x3SymmetricMatrices covers orthogonal diagonalization of 3x3 symmetric matrices. */
export const diagonalizationOf3x3SymmetricMatrices: TopicDef = {
  id: "diagonalization-of-3x3-symmetric-matrices",
  title: t("Diagonalization of 3x3 Symmetric Matrices", "3x3 对称矩阵的正交对角化"),
  summary: t(
    "Orthogonally diagonalize 3x3 symmetric matrices, including finding orthonormal bases for eigenspaces.",
    "对 3x3 对称矩阵进行正交对角化，包括求特征子空间标准正交基。",
  ),
  intro: t(
    "The matrix $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 1 & 2 & 0 \\\\ 0 & 0 & 5 \\end{pmatrix}$ splits into the block $\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$, with eigenvalues $1$ and $3$ on $(1, -1, 0)$ and $(1, 1, 0)$, and the entry $5$ on $(0, 0, 1)$. These three eigenvectors are mutually orthogonal, and dividing each by its length gives the columns of an orthogonal $P$.\n\nCheck: $1 + 3 + 5 = 9 = 2 + 2 + 5$, the trace of $A$.\n\nIn this lesson we find the three eigenvalues of a $3 \\times 3$ symmetric matrix, and use orthogonality to find a third eigenvector from two known ones.",
    "矩阵 $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 1 & 2 & 0 \\\\ 0 & 0 & 5 \\end{pmatrix}$ 分成块 $\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ 与元素 $5$：前者的特征值 $1$ 和 $3$ 对应 $(1, -1, 0)$ 和 $(1, 1, 0)$，后者的特征值 $5$ 对应 $(0, 0, 1)$。这三个特征向量两两正交，各自除以长度就得到正交矩阵 $P$ 的列。\n\n检验：$1 + 3 + 5 = 9 = 2 + 2 + 5$，正是 $A$ 的迹。\n\n本课我们求 $3 \\times 3$ 对称矩阵的三个特征值，并利用正交性由两个已知特征向量求出第三个。",
  ),
  prerequisites: ["diagonalization-of-2x2-symmetric-matrices"],
  encompasses: [],
  xp: 16,
  knowledgePoints: [
    {
      id: "orthogonal-diagonalization-3x3",
      title: t("Eigenvalues and Orthogonal Diagonalization of a 3x3 Symmetric Matrix", "3x3 对称矩阵的特征值与正交对角化"),
      explanation: t(
        "A $3 \\times 3$ real symmetric matrix has 3 real eigenvalues (counting multiplicity). An orthonormal basis of $\\mathbb{R}^3$ consisting of eigenvectors of $A$ can always be constructed, using the Gram-Schmidt process on any repeated eigenspace. For example, when $A$ is block diagonal with a block $\\begin{pmatrix} m & k \\\\ k & m \\end{pmatrix}$ and a lone entry $c$, the eigenvalues are $m - k$, $m + k$ and $c$: for $m = 1$, $k = 3$, $c = 5$ they are $-2, 4, 5$.\n\n> **Watch out.** The eigenvalues of the block are $m \\pm k$, not its entries $m$ and $k$. The lone entry $c$ is itself an eigenvalue, with its own sign.",
        "$3 \\times 3$ 实对称矩阵具有 $3$ 个实特征值（计重数）。总能构造由其特征向量组成的 $\\mathbb{R}^3$ 标准正交基；当出现重特征值时，可对其特征子空间使用施密特正交化。例如当 $A$ 是由块 $\\begin{pmatrix} m & k \\\\ k & m \\end{pmatrix}$ 与单独元素 $c$ 组成的分块对角矩阵时，特征值为 $m - k$、$m + k$ 和 $c$：$m = 1$，$k = 3$，$c = 5$ 时为 $-2, 4, 5$。\n\n> **注意。** 块的特征值是 $m \\pm k$，不是它的元素 $m$ 和 $k$。单独元素 $c$ 本身就是特征值，符号不变。",
      ),
      generate: (rng: Rng): Problem => {
        const m = rng.int(-4, 4);
        const k = rng.int(1, 4);
        const l1 = m - k;
        const l2 = m + k;
        let c = rng.int(-5, 5);
        while (c === l1 || c === l2) {
          c = rng.int(-5, 5);
        }

        const mat: Mat3 = [
          [m, k, 0],
          [k, m, 0],
          [0, 0, c],
        ];

        const prompt = t(
          `Find all eigenvalues of the $3 \\times 3$ symmetric matrix\n\n$$A = ${mat3Latex(mat)}.$$\n\nEnter the eigenvalues separated by commas.`,
          `求 $3 \\times 3$ 对称矩阵 $A = ${mat3Latex(mat)}$ 的所有特征值。多个特征值用逗号隔开。`,
        );

        const sorted = [l1, l2, c].sort((x, y) => x - y);
        const values = sorted.map(String);

        const solution = walked(
          [
            [
              ["Factor by blocks", "按块分解"],
              t(
                `$A$ is block diagonal with the block $\\begin{pmatrix} ${m} & ${k} \\\\ ${k} & ${m} \\end{pmatrix}$ and the entry $${c}$, so`,
                `$A$ 是由块 $\\begin{pmatrix} ${m} & ${k} \\\\ ${k} & ${m} \\end{pmatrix}$ 与元素 $${c}$ 组成的分块对角矩阵，所以`,
              ),
              [`\\det(A - \\lambda I) = \\left[(${m} - \\lambda)^2 - ${k}^2\\right](${c} - \\lambda) = 0`],
            ],
            [
              ["Solve each factor", "分别求解每个因子"],
              t("", ""),
              [`${m} - \\lambda = \\pm ${k} \\implies \\lambda = ${l1}, ${l2}`, `${c} - \\lambda = 0 \\implies \\lambda = ${c}`],
            ],
          ],
          t(
            `$${l1} + ${paren(l2)} + ${paren(c)} = ${l1 + l2 + c} = ${m} + ${paren(m)} + ${paren(c)}$, the trace of $A$.`,
            `$${l1} + ${paren(l2)} + ${paren(c)} = ${l1 + l2 + c} = ${m} + ${paren(m)} + ${paren(c)}$，正是 $A$ 的迹。`,
          ),
        );

        return solutionsProblem({
          prompt,
          values,
          solution,
          mistakes: [
            whySet(
              [m, k, c].sort((x, y) => x - y).map(String),
              `$${m}$ and $${k}$ are entries of the block; its eigenvalues are $${m} \\pm ${k}$.`,
              `$${m}$ 和 $${k}$ 是块的元素；它的特征值是 $${m} \\pm ${k}$。`,
            ),
            whySet(
              [l1, l2, -c].sort((x, y) => x - y).map(String),
              `The lone entry gives $\\lambda = ${c}$ from $${c} - \\lambda = 0$; its sign was flipped.`,
              `由 $${c} - \\lambda = 0$ 得 $\\lambda = ${c}$；符号被弄反了。`,
            ),
            whySet(
              [m - 2 * k, m + 2 * k, c].sort((x, y) => x - y).map(String),
              `From $(${m} - \\lambda)^2 = ${k}^2$ the shift is $\\pm ${k}$, not $\\pm ${2 * k}$.`,
              `由 $(${m} - \\lambda)^2 = ${k}^2$ 得偏移为 $\\pm ${k}$，不是 $\\pm ${2 * k}$。`,
            ),
            whySet(
              [k - m, k + m, c].sort((x, y) => x - y).map(String),
              `The roles of $${m}$ and $${k}$ are swapped: $(${m} - \\lambda)^2 = ${k}^2$ gives $\\lambda = ${m} \\pm ${k}$.`,
              `$${m}$ 与 $${k}$ 的作用弄反了：$(${m} - \\lambda)^2 = ${k}^2$ 给出 $\\lambda = ${m} \\pm ${k}$。`,
            ),
            whySet(
              [l1, l2].map(String),
              `The factor $${c} - \\lambda$ was dropped: a $3 \\times 3$ matrix has three eigenvalues, and the lone entry gives $\\lambda = ${c}$.`,
              `漏掉了因子 $${c} - \\lambda$：$3 \\times 3$ 矩阵有三个特征值，单独的那个元素给出 $\\lambda = ${c}$。`,
            ),
          ].filter(
            (w, i, all) =>
              new Set(w.values).size === w.values.length &&
              w.values.join() !== values.join() &&
              all.findIndex((o) => o.values.join() === w.values.join()) === i,
          ),
        });
      },
    },
    {
      id: "the-third-eigenvector-of-a-3x3-symmetric-matrix",
      title: t("The third eigenvector by orthogonality", "用正交性求第三个特征向量"),
      explanation: t(
        "Eigenvectors of a symmetric matrix that belong to different eigenvalues are orthogonal. So if a $3 \\times 3$ symmetric matrix has three distinct eigenvalues and two of its eigenvectors $\\mathbf{v}_1, \\mathbf{v}_2$ are known, the third eigenvector must be orthogonal to both. The cross product $\\mathbf{v}_1 \\times \\mathbf{v}_2$ is such a vector, and any nonzero multiple of it works. For example, $(1, 1, 0) \\times (1, -1, 1) = (1 \\cdot 1 - 0 \\cdot (-1),\\ 0 \\cdot 1 - 1 \\cdot 1,\\ 1 \\cdot (-1) - 1 \\cdot 1) = (1, -1, -2)$, which has dot product $0$ with both.\n\n> **Watch out.** The middle component of $\\mathbf{a} \\times \\mathbf{b}$ is $a_3 b_1 - a_1 b_3$, in that order; writing $a_1 b_3 - a_3 b_1$ flips its sign. Check the answer against both given vectors.",
        "对称矩阵属于不同特征值的特征向量相互正交。所以若 $3 \\times 3$ 对称矩阵有三个不同特征值，且已知其中两个特征向量 $\\mathbf{v}_1, \\mathbf{v}_2$，则第三个特征向量必与二者都正交。叉积 $\\mathbf{v}_1 \\times \\mathbf{v}_2$ 就是这样的向量，它的任意非零倍数都可以。例如 $(1, 1, 0) \\times (1, -1, 1) = (1 \\cdot 1 - 0 \\cdot (-1),\\ 0 \\cdot 1 - 1 \\cdot 1,\\ 1 \\cdot (-1) - 1 \\cdot 1) = (1, -1, -2)$，它与两者的点积都是 $0$。\n\n> **注意。** $\\mathbf{a} \\times \\mathbf{b}$ 的中间分量是 $a_3 b_1 - a_1 b_3$，顺序不能反；写成 $a_1 b_3 - a_3 b_1$ 会使它变号。用两个给定向量检验答案。",
      ),
      generate(rng: Rng): Problem {
        let v1: [number, number, number] = [1, rng.nonZero(-2, 2), rng.int(-2, 2)];
        let v2: [number, number, number] = [0, 0, 0];
        let c: [number, number, number] = [0, 0, 0];
        for (let tries = 0; tries < 20; tries++) {
          const a = rng.int(-2, 2);
          const b = rng.nonZero(-2, 2);
          // v2 = (x, a, b) with v1 · v2 = 0 fixes x.
          const x = -(v1[1] * a + v1[2] * b);
          v2 = [x, a, b];
          c = [v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0]];
          if (c[0] !== 0) break;
          v1 = [1, v1[1], v1[2] + 1];
        }
        if (c[0] === 0) {
          v1 = [1, 1, 0];
          v2 = [1, -1, 1];
          c = [1, -1, -2];
        }
        const ans = [Q.of(1), Q.of(c[1], c[0]), Q.of(c[2], c[0])];
        const middle = [Q.of(1), Q.of(-c[1], c[0]), Q.of(c[2], c[0])];
        const swapped = [Q.of(1), Q.of(c[2], c[0]), Q.of(c[1], c[0])];
        const first = [Q.of(1), Q.of(v1[1]), Q.of(v1[2])];
        const dot = (a: readonly number[], b: readonly number[]) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
        const sum = (a: readonly number[], b: readonly number[]) =>
          `${a[0]! * b[0]!} + ${paren(a[1]! * b[1]!)} + ${paren(a[2]! * b[2]!)} = ${dot(a, b)}`;
        const problem = pointProblem({
          prompt: t(
            `A $3 \\times 3$ symmetric matrix has three distinct eigenvalues, and $${vec3Latex(v1)}$ and $${vec3Latex(v2)}$ are eigenvectors for two of them. Find the eigenvector for the third eigenvalue scaled so that its first component is $1$.`,
            `某 $3 \\times 3$ 对称矩阵有三个不同特征值，$${vec3Latex(v1)}$ 与 $${vec3Latex(v2)}$ 是其中两个特征值的特征向量。求第三个特征值的特征向量，并缩放使其第一个分量为 $1$。`,
          ),
          answer: ans,
          vector: true,
          vars: ["x_1", "x_2", "x_3"],
          wrong: [middle, swapped, first],
          solution: walked(
            [
              [
                ["Take the cross product", "求叉积"],
                t(
                  "Call the given eigenvectors $\\mathbf{v}_1$ and $\\mathbf{v}_2$. The third eigenvector is orthogonal to both, and so is their cross product:",
                  "记两个已知特征向量为 $\\mathbf{v}_1$ 和 $\\mathbf{v}_2$。第三个特征向量与二者都正交，它们的叉积也是如此：",
                ),
                [`\\mathbf{v}_1 \\times \\mathbf{v}_2 = ${vec3Latex(c)}`],
              ],
              [
                ["Scale the first component to 1", "把第一个分量缩放为 1"],
                t(`Divide by $${c[0]}$:`, `除以 $${c[0]}$：`),
                [vectorLatex(ans)],
              ],
            ],
            t(
              `$\\mathbf{v}_1 \\cdot (\\mathbf{v}_1 \\times \\mathbf{v}_2) = ${sum(v1, c)}$ and $\\mathbf{v}_2 \\cdot (\\mathbf{v}_1 \\times \\mathbf{v}_2) = ${sum(v2, c)}$, so it is orthogonal to both.`,
              `$\\mathbf{v}_1 \\cdot (\\mathbf{v}_1 \\times \\mathbf{v}_2) = ${sum(v1, c)}$，$\\mathbf{v}_2 \\cdot (\\mathbf{v}_1 \\times \\mathbf{v}_2) = ${sum(v2, c)}$，所以它与二者都正交。`,
            ),
          ),
        });
        return withMistakes(
          problem,
          dedupeSaid(
            [
              say(
                vectorLatex(middle),
                "The middle component of the cross product has the wrong sign: it is $a_3 b_1 - a_1 b_3$.",
                "叉积中间分量的符号错了：它是 $a_3 b_1 - a_1 b_3$。",
              ),
              say(vectorLatex(swapped), "The second and third components are swapped.", "第二和第三个分量的位置换反了。"),
              say(
                vectorLatex(first),
                "That is $\\mathbf{v}_1$ itself; the third eigenvector must be orthogonal to it.",
                "这是 $\\mathbf{v}_1$ 本身；第三个特征向量必须与它正交。",
              ),
            ],
            vectorLatex(ans),
          ),
        );
      },
    },
  ],
};

/** spectralTheorem covers the spectral theorem and spectral decomposition. */
export const spectralTheorem: TopicDef = {
  id: "spectral-theorem",
  title: t("The Spectral Theorem", "谱定理"),
  summary: t(
    "State the Spectral Theorem and write symmetric matrices as spectral decompositions $\\sum \\lambda_i \\mathbf{u}_i \\mathbf{u}_i^T$.",
    "陈述谱定理，并将实对称矩阵写成谱分解 $\\sum \\lambda_i \\mathbf{u}_i \\mathbf{u}_i^T$。",
  ),
  intro: t(
    "The matrix $A = \\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$ has eigenvalue $4$ on $\\mathbf{u}_1 = \\frac{1}{\\sqrt{2}}(1, 1)$ and $2$ on $\\mathbf{u}_2 = \\frac{1}{\\sqrt{2}}(1, -1)$. The projections are $\\mathbf{u}_1\\mathbf{u}_1^T = \\frac{1}{2}\\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}$ and $\\mathbf{u}_2\\mathbf{u}_2^T = \\frac{1}{2}\\begin{pmatrix} 1 & -1 \\\\ -1 & 1 \\end{pmatrix}$, and $4\\mathbf{u}_1\\mathbf{u}_1^T + 2\\mathbf{u}_2\\mathbf{u}_2^T = \\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$.\n\nCheck: the two projections add up to $\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$, as they must.\n\nIn this lesson we build the projection matrices of a spectral decomposition, and use the decomposition to apply a symmetric matrix to a vector by scaling its eigenvector components.",
    "矩阵 $A = \\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$ 在 $\\mathbf{u}_1 = \\frac{1}{\\sqrt{2}}(1, 1)$ 上的特征值是 $4$，在 $\\mathbf{u}_2 = \\frac{1}{\\sqrt{2}}(1, -1)$ 上的特征值是 $2$。投影矩阵为 $\\mathbf{u}_1\\mathbf{u}_1^T = \\frac{1}{2}\\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}$ 和 $\\mathbf{u}_2\\mathbf{u}_2^T = \\frac{1}{2}\\begin{pmatrix} 1 & -1 \\\\ -1 & 1 \\end{pmatrix}$，而 $4\\mathbf{u}_1\\mathbf{u}_1^T + 2\\mathbf{u}_2\\mathbf{u}_2^T = \\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$。\n\n检验：两个投影矩阵之和是 $\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$，理应如此。\n\n本课我们构造谱分解中的投影矩阵，并利用谱分解把对称矩阵作用于向量：只需按特征值缩放向量在特征向量上的分量。",
  ),
  prerequisites: ["diagonalization-of-3x3-symmetric-matrices"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "spectral-decomposition",
      title: t("Spectral Decomposition of a Symmetric Matrix", "实对称矩阵的谱分解"),
      explanation: t(
        "By the Spectral Theorem, any $n \\times n$ real symmetric matrix $A$ can be written as $A = \\sum_{i=1}^n \\lambda_i u_i u_i^T$, where $\\{u_1, \\dots, u_n\\}$ is an orthonormal basis of eigenvectors. Each $P_i = u_i u_i^T$ is a rank-1 orthogonal projection matrix satisfying $P_i^2 = P_i$, $P_i P_j = 0$ for $i \\ne j$, and $\\sum P_i = I$. For example, for $u = \\frac{1}{\\sqrt{5}}(1, 2)$, entry $(i, j)$ of $uu^T$ is $u_i u_j$, so $uu^T = \\frac{1}{5}\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$.\n\n> **Watch out.** The factor $\\frac{1}{\\sqrt{5}}$ appears in both $u$ and $u^T$, so the product carries $\\frac{1}{5}$, not $\\frac{1}{\\sqrt{5}}$. The result is always symmetric, with the squares $u_1^2$ and $u_2^2$ on the diagonal.",
        "根据谱定理，任意 $n \\times n$ 实对称矩阵 $A$ 均可表示为谱分解 $A = \\sum_{i=1}^n \\lambda_i u_i u_i^T$，其中 $\\{u_1, \\dots, u_n\\}$ 为标准正交特征向量基。每个 $P_i = u_i u_i^T$ 均为秩 1 正交投影矩阵，满足 $P_i^2 = P_i$、$i \\ne j$ 时 $P_i P_j = 0$ 以及 $\\sum P_i = I$。例如对 $u = \\frac{1}{\\sqrt{5}}(1, 2)$，$uu^T$ 的 $(i, j)$ 元是 $u_i u_j$，所以 $uu^T = \\frac{1}{5}\\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$。\n\n> **注意。** 因子 $\\frac{1}{\\sqrt{5}}$ 在 $u$ 和 $u^T$ 中各出现一次，所以乘积带的是 $\\frac{1}{5}$，不是 $\\frac{1}{\\sqrt{5}}$。结果总是对称的，对角线上是平方 $u_1^2$ 和 $u_2^2$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-6, 6);
        const hypSq = a * a + b * b;

        const p11 = a * a;
        const p12 = a * b;
        const p22 = b * b;

        const prompt = t(
          `Let $u_1 = \\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([a, b])}$ be a unit eigenvector of a $2 \\times 2$ symmetric matrix $A$. What is the orthogonal projection matrix $P_1 = u_1 u_1^T$ in the spectral decomposition of $A$?`,
          `设 $u_1 = \\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([a, b])}$ 为 $2 \\times 2$ 实对称矩阵 $A$ 的单位特征向量。求 $A$ 的谱分解中对应的正交投影矩阵 $P_1 = u_1 u_1^T$。`,
        );

        const right = t(
          `$\\frac{1}{${hypSq}} ${mat2Latex([
            [p11, p12],
            [p12, p22],
          ])}$`,
          `$\\frac{1}{${hypSq}} ${mat2Latex([
            [p11, p12],
            [p12, p22],
          ])}$`,
        );
        const wrong = [
          t(
            `$\\frac{1}{${hypSq}} ${mat2Latex([
              [p11, -p12],
              [-p12, p22],
            ])}$`,
            `$\\frac{1}{${hypSq}} ${mat2Latex([
              [p11, -p12],
              [-p12, p22],
            ])}$`,
          ),
          t(
            `$\\frac{1}{${hypSq}} ${mat2Latex([
              [p12, p11],
              [p22, p12],
            ])}$`,
            `$\\frac{1}{${hypSq}} ${mat2Latex([
              [p12, p11],
              [p22, p12],
            ])}$`,
          ),
          t(
            `$\\frac{1}{\\sqrt{${hypSq}}} ${mat2Latex([
              [p11, p12],
              [p12, p22],
            ])}$`,
            `$\\frac{1}{\\sqrt{${hypSq}}} ${mat2Latex([
              [p11, p12],
              [p12, p22],
            ])}$`,
          ),
          t(
            `$\\frac{1}{${hypSq}} ${mat2Latex([
              [p22, p12],
              [p12, p11],
            ])}$`,
            `$\\frac{1}{${hypSq}} ${mat2Latex([
              [p22, p12],
              [p12, p11],
            ])}$`,
          ),
        ];

        const solution = walked(
          [
            [
              ["Combine the scalar factors", "合并数量因子"],
              t(
                `Both $u_1$ and $u_1^T$ carry $\\frac{1}{\\sqrt{${hypSq}}}$, so together they give $\\frac{1}{${hypSq}}$:`,
                `$u_1$ 与 $u_1^T$ 各带一个 $\\frac{1}{\\sqrt{${hypSq}}}$，合起来是 $\\frac{1}{${hypSq}}$：`,
              ),
              [`P_1 = \\frac{1}{${hypSq}} ${vec2Latex([a, b])} \\begin{pmatrix} ${a} & ${b} \\end{pmatrix}`],
            ],
            [
              ["Multiply out the outer product", "乘开外积"],
              t("Entry $(i, j)$ is the product of components $i$ and $j$:", "$(i, j)$ 元是第 $i$ 个与第 $j$ 个分量之积："),
              [
                `P_1 = \\frac{1}{${hypSq}} ${mat2Latex([
                  [p11, p12],
                  [p12, p22],
                ])}`,
              ],
            ],
          ],
          t(
            `The trace is $\\frac{${p11} + ${p22}}{${hypSq}} = 1$, as it must be for a projection onto a line.`,
            `迹为 $\\frac{${p11} + ${p22}}{${hypSq}} = 1$，投影到一条直线上的矩阵理应如此。`,
          ),
        );

        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `The off-diagonal entries are $(${a})(${b}) = ${p12}$; their sign was flipped.`,
            `非对角元是 $(${a})(${b}) = ${p12}$；符号被弄反了。`,
          ],
          [
            wrong[1]!.en,
            "The entries are out of place: entry $(i, j)$ of $u_1 u_1^T$ is $u_i u_j$, which makes the matrix symmetric.",
            "元素放错了位置：$u_1 u_1^T$ 的 $(i, j)$ 元是 $u_i u_j$，所以矩阵是对称的。",
          ],
          [
            wrong[2]!.en,
            `The factor $\\frac{1}{\\sqrt{${hypSq}}}$ comes from both $u_1$ and $u_1^T$, so the product carries $\\frac{1}{${hypSq}}$.`,
            `因子 $\\frac{1}{\\sqrt{${hypSq}}}$ 来自 $u_1$ 与 $u_1^T$ 两处，所以乘积带的是 $\\frac{1}{${hypSq}}$。`,
          ],
          [
            wrong[3]!.en,
            `The diagonal entries are swapped: entry $(1, 1)$ is $${a < 0 ? `(${a})` : a}^2 = ${p11}$.`,
            `对角元的位置换反了：$(1, 1)$ 元是 $${a < 0 ? `(${a})` : a}^2 = ${p11}$。`,
          ],
        ]);
      },
    },
    {
      id: "applying-a-spectral-decomposition-to-a-vector",
      title: t("Applying a spectral decomposition to a vector", "用谱分解作用于向量"),
      explanation: t(
        "The spectral theorem writes a symmetric matrix as $A = \\lambda_1\\mathbf{u}_1\\mathbf{u}_1^T + \\lambda_2\\mathbf{u}_2\\mathbf{u}_2^T$ with orthonormal eigenvectors $\\mathbf{u}_1, \\mathbf{u}_2$. To apply $A$ to a vector, write the vector in the eigenvector basis: if $\\mathbf{x} = \\alpha\\mathbf{v}_1 + \\beta\\mathbf{v}_2$ with eigenvectors $\\mathbf{v}_1, \\mathbf{v}_2$, then $A\\mathbf{x} = \\lambda_1\\alpha\\mathbf{v}_1 + \\lambda_2\\beta\\mathbf{v}_2$. Each component is simply scaled by its eigenvalue. For example, with eigenvalue $3$ on $(1, 1)$ and $-1$ on $(-1, 1)$, the vector $(0, 2)$ is $1(1, 1) + 1(-1, 1)$, so $A(0, 2) = 3(1, 1) - 1(-1, 1) = (4, 2)$.\n\n> **Watch out.** Scale the coefficients $\\alpha$ and $\\beta$ along the eigenvectors, not the coordinates of $\\mathbf{x}$, and give each eigenvector its own eigenvalue.",
        "谱定理把对称矩阵写成 $A = \\lambda_1\\mathbf{u}_1\\mathbf{u}_1^T + \\lambda_2\\mathbf{u}_2\\mathbf{u}_2^T$，$\\mathbf{u}_1, \\mathbf{u}_2$ 为标准正交特征向量。要把 $A$ 作用于向量，先把向量写在特征向量基下：若 $\\mathbf{x} = \\alpha\\mathbf{v}_1 + \\beta\\mathbf{v}_2$，$\\mathbf{v}_1, \\mathbf{v}_2$ 为特征向量，则 $A\\mathbf{x} = \\lambda_1\\alpha\\mathbf{v}_1 + \\lambda_2\\beta\\mathbf{v}_2$。每个分量只是按其特征值缩放。例如特征值 $3$ 对应 $(1, 1)$，$-1$ 对应 $(-1, 1)$，向量 $(0, 2) = 1(1, 1) + 1(-1, 1)$，所以 $A(0, 2) = 3(1, 1) - 1(-1, 1) = (4, 2)$。\n\n> **注意。** 要缩放的是沿特征向量的系数 $\\alpha$ 和 $\\beta$，而不是 $\\mathbf{x}$ 的坐标，并且每个特征向量用它自己的特征值。",
      ),
      generate(rng: Rng): Problem {
        const [l1, l2, k] = pickEigenPair(rng, -3, 5);
        const al = rng.nonZero(-3, 3);
        const be = rng.nonZero(-3, 3);
        const x = [al - k * be, al * k + be] as const;
        const ax = [l1 * al - l2 * k * be, l1 * al * k + l2 * be] as const;
        const coords = [l1 * x[0], l2 * x[1]];
        const swappedL = [l2 * al - l1 * k * be, l2 * al * k + l1 * be];
        const trace = [(l1 + l2) * x[0], (l1 + l2) * x[1]];
        const n = 1 + k * k;
        const problem = pointProblem({
          prompt: t(
            `A symmetric matrix $A$ has eigenvalue $${l1}$ with eigenvector $${vec2Latex([1, k])}$ and eigenvalue $${l2}$ with eigenvector $${vec2Latex([-k, 1])}$. Find $A\\mathbf{x}$ for $\\mathbf{x} = ${vec2Latex(x)}$.`,
            `对称矩阵 $A$ 有特征值 $${l1}$，特征向量 $${vec2Latex([1, k])}$，以及特征值 $${l2}$，特征向量 $${vec2Latex([-k, 1])}$。对 $\\mathbf{x} = ${vec2Latex(x)}$ 求 $A\\mathbf{x}$。`,
          ),
          answer: ax,
          vector: true,
          wrong: [coords, swappedL, trace],
          solution: walked(
            [
              [
                ["Write x in the eigenvector basis", "把 x 写在特征向量基下"],
                t(
                  `Call the eigenvectors $\\mathbf{v}_1 = ${vec2Latex([1, k])}$ and $\\mathbf{v}_2 = ${vec2Latex([-k, 1])}$. They are orthogonal, so the coefficients are $\\alpha = \\frac{\\mathbf{x} \\cdot \\mathbf{v}_1}{${n}} = ${al}$ and $\\beta = \\frac{\\mathbf{x} \\cdot \\mathbf{v}_2}{${n}} = ${be}$:`,
                  `记特征向量为 $\\mathbf{v}_1 = ${vec2Latex([1, k])}$，$\\mathbf{v}_2 = ${vec2Latex([-k, 1])}$。它们相互正交，所以系数为 $\\alpha = \\frac{\\mathbf{x} \\cdot \\mathbf{v}_1}{${n}} = ${al}$，$\\beta = \\frac{\\mathbf{x} \\cdot \\mathbf{v}_2}{${n}} = ${be}$：`,
                ),
                [`\\mathbf{x} = ${lead(al, vec2Latex([1, k]))} ${plus(be, vec2Latex([-k, 1]))}`],
              ],
              [
                ["Scale each part by its eigenvalue", "每部分乘以各自的特征值"],
                t("", ""),
                [
                  l1 * al === 0
                    ? `A\\mathbf{x} = ${l1}${vec2Latex([1, k])} ${plus(l2 * be, vec2Latex([-k, 1]))} = ${vec2Latex(ax)}`
                    : l2 * be === 0
                      ? `A\\mathbf{x} = ${lead(l1 * al, vec2Latex([1, k]))} + ${l2}${vec2Latex([-k, 1])} = ${vec2Latex(ax)}`
                      : `A\\mathbf{x} = ${lead(l1 * al, vec2Latex([1, k]))} ${plus(l2 * be, vec2Latex([-k, 1]))} = ${vec2Latex(ax)}`,
                ],
              ],
            ],
            t(
              `$A\\mathbf{x} \\cdot \\mathbf{v}_1 = ${ax[0] + k * ax[1]} = ${paren(l1)} \\cdot ${paren(x[0] + k * x[1])} = \\lambda_1 (\\mathbf{x} \\cdot \\mathbf{v}_1)$, as it should be for a symmetric $A$.`,
              `$A\\mathbf{x} \\cdot \\mathbf{v}_1 = ${ax[0] + k * ax[1]} = ${paren(l1)} \\cdot ${paren(x[0] + k * x[1])} = \\lambda_1 (\\mathbf{x} \\cdot \\mathbf{v}_1)$，对称矩阵理应如此。`,
            ),
          ),
        });
        return withMistakes(
          problem,
          dedupeSaid(
            [
              say(
                vectorLatex(coords),
                "That scales the coordinates of $\\mathbf{x}$; scale its coefficients along the eigenvectors instead.",
                "这是缩放 $\\mathbf{x}$ 的坐标；应该缩放它沿特征向量的系数。",
              ),
              say(
                vectorLatex(swappedL),
                `The eigenvalues are swapped: $${l1}$ belongs to $${vec2Latex([1, k])}$.`,
                `特征值配反了：$${l1}$ 对应 $${vec2Latex([1, k])}$。`,
              ),
              say(
                vectorLatex(trace),
                "That multiplies $\\mathbf{x}$ by $\\lambda_1 + \\lambda_2$; each eigenvector part is scaled by its own eigenvalue.",
                "这是把 $\\mathbf{x}$ 乘以 $\\lambda_1 + \\lambda_2$；每个特征向量部分要乘以各自的特征值。",
              ),
            ],
            vectorLatex(ax),
          ),
        );
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 7.26: QUADRATIC FORMS
// ════════════════════════════════════════════════════════════════════════════

/** bilinearForms covers the definition and matrix representation of bilinear forms. */
export const bilinearForms: TopicDef = {
  id: "bilinear-forms",
  title: t("Bilinear Forms", "双线性型"),
  summary: t(
    "Define bilinear forms on vector spaces, find their matrix representations, and evaluate them on vector pairs.",
    "定义向量空间上的双线性型，求其矩阵表示，并计算其在向量对上的取值。",
  ),
  intro: t(
    "The form $B(\\mathbf{x}, \\mathbf{y}) = 2x_1y_1 + 3x_1y_2 - x_2y_1 + 4x_2y_2$ is linear in $\\mathbf{x}$ and linear in $\\mathbf{y}$. Putting the coefficient of $x_iy_j$ in row $i$, column $j$ gives $A = \\begin{pmatrix} 2 & 3 \\\\ -1 & 4 \\end{pmatrix}$, and then $B(\\mathbf{x}, \\mathbf{y}) = \\mathbf{x}^TA\\mathbf{y}$.\n\nCheck: for $\\mathbf{x} = (1, 1)$ and $\\mathbf{y} = (1, 0)$ the formula gives $2 - 1 = 1$, and $A\\mathbf{y} = (2, -1)$ dotted with $\\mathbf{x}$ is also $1$.\n\nIn this lesson we write the matrix of a bilinear form and evaluate a bilinear form from its matrix.",
    "形式 $B(\\mathbf{x}, \\mathbf{y}) = 2x_1y_1 + 3x_1y_2 - x_2y_1 + 4x_2y_2$ 对 $\\mathbf{x}$ 线性，对 $\\mathbf{y}$ 也线性。把 $x_iy_j$ 的系数放在第 $i$ 行第 $j$ 列，得 $A = \\begin{pmatrix} 2 & 3 \\\\ -1 & 4 \\end{pmatrix}$，于是 $B(\\mathbf{x}, \\mathbf{y}) = \\mathbf{x}^TA\\mathbf{y}$。\n\n检验：对 $\\mathbf{x} = (1, 1)$，$\\mathbf{y} = (1, 0)$，公式给出 $2 - 1 = 1$，而 $A\\mathbf{y} = (2, -1)$ 与 $\\mathbf{x}$ 的点积也是 $1$。\n\n本课我们写出双线性型的矩阵，并由矩阵计算双线性型的值。",
  ),
  prerequisites: ["spectral-theorem"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "bilinear-forms-matrix",
      title: t("Matrix Representation of a Bilinear Form", "双线性型的矩阵表示"),
      explanation: t(
        "A bilinear form $B(x, y)$ on $\\mathbb{R}^n$ can be expressed uniquely as $B(x, y) = x^T A y$, where the entry $a_{ij} = B(e_i, e_j)$ is the coefficient of $x_i y_j$. For example, $B(x, y) = x_1y_1 - 5x_1y_2 + 2x_2y_1$ has $a_{12} = -5$, $a_{21} = 2$ and $a_{22} = 0$, so $A = \\begin{pmatrix} 1 & -5 \\\\ 2 & 0 \\end{pmatrix}$.\n\n> **Watch out.** The index of $x$ picks the row and the index of $y$ picks the column. Putting the coefficient of $x_1y_2$ in row 2 writes $A^T$ instead, and the matrix need not be symmetric.",
        "$\\mathbb{R}^n$ 上的双线性型 $B(x, y)$ 可唯一表示为 $B(x, y) = x^T A y$，其中矩阵元 $a_{ij} = B(e_i, e_j)$ 即为对应项 $x_i y_j$ 的系数。例如 $B(x, y) = x_1y_1 - 5x_1y_2 + 2x_2y_1$ 有 $a_{12} = -5$，$a_{21} = 2$，$a_{22} = 0$，所以 $A = \\begin{pmatrix} 1 & -5 \\\\ 2 & 0 \\end{pmatrix}$。\n\n> **注意。** $x$ 的下标决定行，$y$ 的下标决定列。把 $x_1y_2$ 的系数放在第 2 行就写成了 $A^T$；这个矩阵也不必对称。",
      ),
      generate: (rng: Rng): Problem => {
        const a11 = rng.nonZero(-6, 6);
        const a12 = rng.nonZero(-6, 6);
        const a21 = rng.nonZero(-6, 6);
        const a22 = rng.nonZero(-6, 6);

        const formStr = formatBilinear(a11, a12, a21, a22);

        const prompt = t(
          `Find the matrix $A$ representing the bilinear form $B(x, y) = ${formStr}$ with respect to the standard basis of $\\mathbb{R}^2$, such that $B(x, y) = x^T A y$.`,
          `求以标准基表示的双线性型 $B(x, y) = ${formStr}$ 的矩阵 $A$，使得 $B(x, y) = x^T A y$。`,
        );

        const right = t(
          `$${mat2Latex([
            [a11, a12],
            [a21, a22],
          ])}$`,
          `$${mat2Latex([
            [a11, a12],
            [a21, a22],
          ])}$`,
        );
        const wrong = [
          t(
            `$${mat2Latex([
              [a11, a21],
              [a12, a22],
            ])}$`,
            `$${mat2Latex([
              [a11, a21],
              [a12, a22],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [a22, a12],
              [a21, a11],
            ])}$`,
            `$${mat2Latex([
              [a22, a12],
              [a21, a11],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [a11, -a12],
              [-a21, a22],
            ])}$`,
            `$${mat2Latex([
              [a11, -a12],
              [-a21, a22],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [a12, a11],
              [a22, a21],
            ])}$`,
            `$${mat2Latex([
              [a12, a11],
              [a22, a21],
            ])}$`,
          ),
        ];

        const solution = walked(
          [
            [
              ["Read each coefficient", "读出每个系数"],
              t(
                "The entry in row $i$, column $j$ of $A$ is the coefficient of $x_i y_j$:",
                "$A$ 第 $i$ 行第 $j$ 列的元素是 $x_i y_j$ 的系数：",
              ),
              [`a_{11} = ${a11}, \\quad a_{12} = ${a12}, \\quad a_{21} = ${a21}, \\quad a_{22} = ${a22}`],
            ],
            [
              ["Place them in the matrix", "放入矩阵"],
              t("", ""),
              [
                `A = ${mat2Latex([
                  [a11, a12],
                  [a21, a22],
                ])}`,
              ],
            ],
          ],
          t(
            `$B(\\mathbf{e}_1, \\mathbf{e}_2) = \\mathbf{e}_1^TA\\mathbf{e}_2$ is the entry in row 1, column 2, which is $${a12}$, the coefficient of $x_1y_2$.`,
            `$B(\\mathbf{e}_1, \\mathbf{e}_2) = \\mathbf{e}_1^TA\\mathbf{e}_2$ 是第 1 行第 2 列的元素 $${a12}$，正是 $x_1y_2$ 的系数。`,
          ),
        );

        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "That is $A^T$: the coefficient of $x_1y_2$ belongs in row 1, column 2, not row 2, column 1.",
            "这是 $A^T$：$x_1y_2$ 的系数应在第 1 行第 2 列，而不是第 2 行第 1 列。",
          ],
          [
            wrong[1]!.en,
            `The diagonal entries are swapped: $a_{11}$ is the coefficient of $x_1y_1$, which is $${a11}$.`,
            `对角元换反了：$a_{11}$ 是 $x_1y_1$ 的系数，即 $${a11}$。`,
          ],
          [
            wrong[2]!.en,
            "The off-diagonal entries have the wrong signs; each entry keeps the sign of its coefficient.",
            "非对角元的符号错了；每个元素保留其系数的符号。",
          ],
          [
            wrong[3]!.en,
            "The two columns are swapped: column $j$ holds the coefficients of the terms with $y_j$.",
            "两列换反了：第 $j$ 列放的是含 $y_j$ 的项的系数。",
          ],
        ]);
      },
    },
    {
      id: "evaluating-a-bilinear-form-from-its-matrix",
      title: t("Evaluating a bilinear form from its matrix", "由矩阵计算双线性型的值"),
      explanation: t(
        "A bilinear form on $\\mathbb{R}^2$ with matrix $A$ is $B(\\mathbf{x}, \\mathbf{y}) = \\mathbf{x}^T A\\mathbf{y} = \\sum_{i, j} a_{ij}x_iy_j$. To evaluate it, first compute $A\\mathbf{y}$ and then take the dot product with $\\mathbf{x}$. When $A$ is not symmetric, swapping the arguments can change the value, since $B(\\mathbf{y}, \\mathbf{x}) = \\mathbf{x}^T A^T\\mathbf{y}$. For example, with $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 3 \\end{pmatrix}$, $\\mathbf{x} = (1, 2)$ and $\\mathbf{y} = (2, 1)$, $A\\mathbf{y} = (4, 3)$ and $B(\\mathbf{x}, \\mathbf{y}) = 4 + 6 = 10$, while $B(\\mathbf{y}, \\mathbf{x}) = 16$.\n\n> **Watch out.** $A$ multiplies $\\mathbf{y}$, and the result is dotted with $\\mathbf{x}$; computing $A\\mathbf{x}$ and dotting with $\\mathbf{y}$ gives $B(\\mathbf{y}, \\mathbf{x})$. The answer is one number, not the sum of the entries of $A\\mathbf{y}$.",
        "$\\mathbb{R}^2$ 上矩阵为 $A$ 的双线性型为 $B(\\mathbf{x}, \\mathbf{y}) = \\mathbf{x}^T A\\mathbf{y} = \\sum_{i, j} a_{ij}x_iy_j$。计算时先求 $A\\mathbf{y}$，再与 $\\mathbf{x}$ 作点积。当 $A$ 不对称时，交换两个自变量可能改变值，因为 $B(\\mathbf{y}, \\mathbf{x}) = \\mathbf{x}^T A^T\\mathbf{y}$。例如 $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 3 \\end{pmatrix}$，$\\mathbf{x} = (1, 2)$，$\\mathbf{y} = (2, 1)$ 时，$A\\mathbf{y} = (4, 3)$，$B(\\mathbf{x}, \\mathbf{y}) = 4 + 6 = 10$，而 $B(\\mathbf{y}, \\mathbf{x}) = 16$。\n\n> **注意。** $A$ 乘的是 $\\mathbf{y}$，结果再与 $\\mathbf{x}$ 作点积；先算 $A\\mathbf{x}$ 再与 $\\mathbf{y}$ 作点积得到的是 $B(\\mathbf{y}, \\mathbf{x})$。答案是这个数，而不是 $A\\mathbf{y}$ 各分量之和。",
      ),
      generate(rng: Rng): Problem {
        const top = [rng.nonZero(-4, 4), rng.nonZero(-4, 4)] as const;
        const bottom = [rng.nonZero(-4, 4), rng.nonZero(-4, 4)] as const;
        // B(x, y) − B(y, x) = (a12 − a21)(x1y2 − x2y1), so A is kept nonsymmetric and x, y not parallel: swapping matters.
        const A: Mat2 = [top, [bottom[0] === top[1] ? -top[1] : bottom[0], bottom[1]]];
        const x = [rng.nonZero(-3, 3), rng.nonZero(-3, 3)] as const;
        const y0 = [rng.nonZero(-3, 3), rng.nonZero(-3, 3)] as const;
        const y = (x[0] * y0[1] === x[1] * y0[0] ? [y0[0], -y0[1]] : y0) as readonly [number, number];
        const Ay = [A[0][0] * y[0] + A[0][1] * y[1], A[1][0] * y[0] + A[1][1] * y[1]] as const;
        const ans = x[0] * Ay[0] + x[1] * Ay[1];
        const swapped = y[0] * (A[0][0] * x[0] + A[0][1] * x[1]) + y[1] * (A[1][0] * x[0] + A[1][1] * x[1]);
        return numberProblem({
          prompt: t(
            `$B(\\mathbf{x}, \\mathbf{y}) = \\mathbf{x}^T A\\mathbf{y}$ with $A = ${mat2Latex(A)}$. Find $B(\\mathbf{x}, \\mathbf{y})$ for $\\mathbf{x} = ${vec2Latex(x)}$ and $\\mathbf{y} = ${vec2Latex(y)}$.`,
            `$B(\\mathbf{x}, \\mathbf{y}) = \\mathbf{x}^T A\\mathbf{y}$，$A = ${mat2Latex(A)}$。对 $\\mathbf{x} = ${vec2Latex(x)}$ 与 $\\mathbf{y} = ${vec2Latex(y)}$ 求 $B(\\mathbf{x}, \\mathbf{y})$。`,
          ),
          answer: ans,
          wrong: [swapped, Ay[0] + Ay[1], x[0] * y[0] + x[1] * y[1]],
          mistakes: distinct(
            [
              why(
                swapped,
                "That is $B(\\mathbf{y}, \\mathbf{x})$: $A$ multiplies $\\mathbf{y}$, not $\\mathbf{x}$.",
                "这是 $B(\\mathbf{y}, \\mathbf{x})$：$A$ 乘的是 $\\mathbf{y}$，不是 $\\mathbf{x}$。",
              ),
              why(
                Ay[0] + Ay[1],
                "That adds the entries of $A\\mathbf{y}$; dot them with $\\mathbf{x}$ instead.",
                "这是把 $A\\mathbf{y}$ 的分量相加；应与 $\\mathbf{x}$ 作点积。",
              ),
              why(
                x[0] * y[0] + x[1] * y[1],
                "That is $\\mathbf{x} \\cdot \\mathbf{y}$, which leaves out $A$.",
                "这是 $\\mathbf{x} \\cdot \\mathbf{y}$，漏掉了 $A$。",
              ),
              why(
                A[0][0] * x[0] * y[0] + A[1][1] * x[1] * y[1],
                "That keeps only the diagonal entries; $a_{12}x_1y_2$ and $a_{21}x_2y_1$ contribute too.",
                "这只保留了对角元；$a_{12}x_1y_2$ 和 $a_{21}x_2y_1$ 也有贡献。",
              ),
              why(
                y[0] * Ay[0] + y[1] * Ay[1],
                "That dots $A\\mathbf{y}$ with $\\mathbf{y}$, giving $B(\\mathbf{y}, \\mathbf{y})$; the first argument is $\\mathbf{x}$.",
                "这是把 $A\\mathbf{y}$ 与 $\\mathbf{y}$ 作点积，得到 $B(\\mathbf{y}, \\mathbf{y})$；第一个自变量是 $\\mathbf{x}$。",
              ),
              why(
                x[0] * (A[0][0] * x[0] + A[0][1] * x[1]) + x[1] * (A[1][0] * x[0] + A[1][1] * x[1]),
                "That is $B(\\mathbf{x}, \\mathbf{x}) = \\mathbf{x}^TA\\mathbf{x}$; $A$ multiplies the second argument $\\mathbf{y}$.",
                "这是 $B(\\mathbf{x}, \\mathbf{x}) = \\mathbf{x}^TA\\mathbf{x}$；$A$ 乘的是第二个自变量 $\\mathbf{y}$。",
              ),
            ],
            ans,
          ),
          solution: walked(
            [
              [["Multiply A by y", "计算 Ay"], t("", ""), [`A\\mathbf{y} = ${vec2Latex(Ay)}`]],
              [
                ["Dot with x", "与 x 作点积"],
                t("", ""),
                [`B(\\mathbf{x}, \\mathbf{y}) = ${x[0]} \\cdot ${paren(Ay[0])} + ${paren(x[1])} \\cdot ${paren(Ay[1])} = ${ans}`],
              ],
            ],
            t(
              `Summing $a_{ij}x_iy_j$ term by term: $${A[0][0] * x[0] * y[0]} + ${paren(A[0][1] * x[0] * y[1])} + ${paren(A[1][0] * x[1] * y[0])} + ${paren(A[1][1] * x[1] * y[1])} = ${ans}$.`,
              `逐项求和 $a_{ij}x_iy_j$：$${A[0][0] * x[0] * y[0]} + ${paren(A[0][1] * x[0] * y[1])} + ${paren(A[1][0] * x[1] * y[0])} + ${paren(A[1][1] * x[1] * y[1])} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** quadraticForms covers quadratic forms and their associated symmetric matrices. */
export const quadraticForms: TopicDef = {
  id: "quadratic-forms",
  title: t("Quadratic Forms", "二次型"),
  summary: t(
    "Write quadratic forms as polynomials and in symmetric matrix form $\\mathbf{x}^T A \\mathbf{x}$.",
    "将二次型表示为多项式以及对称矩阵形式 $\\mathbf{x}^T A \\mathbf{x}$。",
  ),
  intro: t(
    "The quadratic form $Q = 3x_1^2 + 8x_1x_2 - x_2^2$ has the squares' coefficients $3$ and $-1$ on the diagonal of its symmetric matrix, and the cross coefficient $8$ split evenly as $4$ and $4$: $A = \\begin{pmatrix} 3 & 4 \\\\ 4 & -1 \\end{pmatrix}$.\n\nCheck: at $\\mathbf{x} = (1, 1)$, $Q = 3 + 8 - 1 = 10$, and $A\\mathbf{x} = (7, 3)$ dotted with $(1, 1)$ is also $10$.\n\nIn this lesson we write the symmetric matrix of a quadratic form and read the coefficients of a quadratic form off its matrix.",
    "二次型 $Q = 3x_1^2 + 8x_1x_2 - x_2^2$ 的对称矩阵中，对角线上是平方项系数 $3$ 和 $-1$，交叉项系数 $8$ 平分为 $4$ 和 $4$：$A = \\begin{pmatrix} 3 & 4 \\\\ 4 & -1 \\end{pmatrix}$。\n\n检验：在 $\\mathbf{x} = (1, 1)$ 处 $Q = 3 + 8 - 1 = 10$，而 $A\\mathbf{x} = (7, 3)$ 与 $(1, 1)$ 的点积也是 $10$。\n\n本课我们写出二次型的对称矩阵，并从矩阵读出二次型的系数。",
  ),
  prerequisites: ["bilinear-forms"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "quadratic-forms-symmetric-matrix",
      title: t("Symmetric Matrix of a Quadratic Form", "二次型的对称矩阵"),
      explanation: t(
        "A quadratic form $Q(x) = x^T A x$ is represented uniquely by a symmetric matrix $A = A^T$. The diagonal entry $a_{ii}$ is the coefficient of $x_i^2$, and the off-diagonal entries are $a_{ij} = a_{ji} = \\frac{1}{2} c_{ij}$, where $c_{ij}$ is the coefficient of $x_i x_j$. For example, $Q = 2x_1^2 - 6x_1x_2 + 5x_2^2$ has $A = \\begin{pmatrix} 2 & -3 \\\\ -3 & 5 \\end{pmatrix}$.\n\n> **Watch out.** Halve the cross coefficient: $a_{12}$ and $a_{21}$ both contribute to $x_1x_2$, so each is half of it. Writing the whole coefficient in one corner and $0$ in the other gives the same form but not the symmetric matrix.",
        "二次型 $Q(x) = x^T A x$ 可由唯一的实对称矩阵 $A = A^T$ 表示。主对角元 $a_{ii}$ 为 $x_i^2$ 的系数，非对角元 $a_{ij} = a_{ji} = \\frac{1}{2} c_{ij}$，其中 $c_{ij}$ 为交叉项 $x_i x_j$ 的系数。例如 $Q = 2x_1^2 - 6x_1x_2 + 5x_2^2$ 的矩阵是 $A = \\begin{pmatrix} 2 & -3 \\\\ -3 & 5 \\end{pmatrix}$。\n\n> **注意。** 交叉项系数要减半：$a_{12}$ 与 $a_{21}$ 都贡献给 $x_1x_2$，所以各占一半。把整个系数写在一角、另一角写 $0$，得到的二次型相同，但不是对称矩阵。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.nonZero(-8, 8);
        const b = rng.nonZero(-8, 8);
        const c = rng.nonZero(-8, 8);
        const twoB = 2 * b;

        const qStr = formatQuadratic(a, twoB, c);

        const prompt = t(
          `Find the symmetric matrix $A$ associated with the quadratic form\n\n$$Q(x_1, x_2) = ${qStr}.$$`,
          `求与二次型 $Q(x_1, x_2) = ${qStr}$ 对应的实对称矩阵 $A$。`,
        );

        const right = t(
          `$${mat2Latex([
            [a, b],
            [b, c],
          ])}$`,
          `$${mat2Latex([
            [a, b],
            [b, c],
          ])}$`,
        );
        const wrong = [
          t(
            `$${mat2Latex([
              [a, twoB],
              [twoB, c],
            ])}$`,
            `$${mat2Latex([
              [a, twoB],
              [twoB, c],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [a, twoB],
              [0, c],
            ])}$`,
            `$${mat2Latex([
              [a, twoB],
              [0, c],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [c, b],
              [b, a],
            ])}$`,
            `$${mat2Latex([
              [c, b],
              [b, a],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [a, -b],
              [-b, c],
            ])}$`,
            `$${mat2Latex([
              [a, -b],
              [-b, c],
            ])}$`,
          ),
        ];

        const solution = walked(
          [
            [
              ["Put the square coefficients on the diagonal", "把平方项系数放在对角线上"],
              t("", ""),
              [`a_{11} = ${a}, \\quad a_{22} = ${c}`],
            ],
            [
              ["Halve the cross coefficient", "交叉项系数减半"],
              t("", ""),
              [
                `a_{12} = a_{21} = \\frac{${twoB}}{2} = ${b}`,
                `A = ${mat2Latex([
                  [a, b],
                  [b, c],
                ])}`,
              ],
            ],
          ],
          t(
            `Expanding $\\mathbf{x}^TA\\mathbf{x}$ gives $${formatQuadratic(a, 2 * b, c)}$, since $a_{12}$ and $a_{21}$ each contribute $${lead(b, "x_1x_2")}$.`,
            `展开 $\\mathbf{x}^TA\\mathbf{x}$ 得 $${formatQuadratic(a, 2 * b, c)}$，因为 $a_{12}$ 与 $a_{21}$ 各贡献 $${lead(b, "x_1x_2")}$。`,
          ),
        );

        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `The cross coefficient $${twoB}$ is split between $a_{12}$ and $a_{21}$, so each is $${b}$.`,
            `交叉项系数 $${twoB}$ 由 $a_{12}$ 与 $a_{21}$ 平分，所以各为 $${b}$。`,
          ],
          [wrong[1]!.en, "That matrix gives the same form, but it is not symmetric.", "这个矩阵给出相同的二次型，但它不是对称矩阵。"],
          [
            wrong[2]!.en,
            `The diagonal entries are swapped: $a_{11}$ is the coefficient of $x_1^2$, which is $${a}$.`,
            `对角元换反了：$a_{11}$ 是 $x_1^2$ 的系数，即 $${a}$。`,
          ],
          [
            wrong[3]!.en,
            `The off-diagonal entries have the wrong sign: half of $${twoB}$ is $${b}$.`,
            `非对角元的符号错了：$${twoB}$ 的一半是 $${b}$。`,
          ],
        ]);
      },
    },
    {
      id: "reading-coefficients-of-a-quadratic-form-from-its-matrix",
      title: t("Reading coefficients of a quadratic form from its matrix", "从矩阵读出二次型的系数"),
      explanation: t(
        "For a symmetric $3 \\times 3$ matrix $A$, the quadratic form $Q(\\mathbf{x}) = \\mathbf{x}^T A\\mathbf{x}$ expands to\n\n$$Q = a_{11}x_1^2 + a_{22}x_2^2 + a_{33}x_3^2 + 2a_{12}x_1x_2 + 2a_{13}x_1x_3 + 2a_{23}x_2x_3.$$\n\nA square term takes its diagonal entry directly, while a cross term $x_ix_j$ collects both $a_{ij}$ and $a_{ji}$, so its coefficient is $2a_{ij}$. For example, if $a_{13} = a_{31} = -3$, the coefficient of $x_1x_3$ is $2(-3) = -6$, while $a_{22} = 4$ makes the coefficient of $x_2^2$ just $4$.\n\n> **Watch out.** Double only the off-diagonal entries; a diagonal entry appears once in the expansion and is already the coefficient of its square.",
        "对 $3 \\times 3$ 对称矩阵 $A$，二次型 $Q(\\mathbf{x}) = \\mathbf{x}^T A\\mathbf{x}$ 展开为\n\n$$Q = a_{11}x_1^2 + a_{22}x_2^2 + a_{33}x_3^2 + 2a_{12}x_1x_2 + 2a_{13}x_1x_3 + 2a_{23}x_2x_3$$\n\n平方项直接取对角元，而交叉项 $x_ix_j$ 同时汇集 $a_{ij}$ 与 $a_{ji}$，所以系数为 $2a_{ij}$。例如若 $a_{13} = a_{31} = -3$，则 $x_1x_3$ 的系数是 $2(-3) = -6$，而 $a_{22} = 4$ 使 $x_2^2$ 的系数就是 $4$。\n\n> **注意。** 只有非对角元要加倍；对角元在展开式中只出现一次，本身就是对应平方项的系数。",
      ),
      generate(rng: Rng): Problem {
        const d = [rng.int(-5, 6), rng.int(-5, 6), rng.int(-5, 6)];
        const o = [rng.nonZero(-4, 4), rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
        const A: Mat3 = [
          [d[0]!, o[0]!, o[1]!],
          [o[0]!, d[1]!, o[2]!],
          [o[1]!, o[2]!, d[2]!],
        ];
        const terms = [
          { name: "x_1x_2", v: 2 * o[0]!, e: o[0]!, at: "a_{12}" },
          { name: "x_1x_3", v: 2 * o[1]!, e: o[1]!, at: "a_{13}" },
          { name: "x_2x_3", v: 2 * o[2]!, e: o[2]!, at: "a_{23}" },
          { name: "x_2^2", v: d[1]!, e: d[1]!, at: "a_{22}" },
        ];
        const term = rng.pick(terms);
        const cross = term.name !== "x_2^2";
        return numberProblem({
          prompt: t(
            `$Q(\\mathbf{x}) = \\mathbf{x}^T A\\mathbf{x}$ with $A = ${mat3Latex(A)}$. What is the coefficient of $${term.name}$ in $Q$?`,
            `$Q(\\mathbf{x}) = \\mathbf{x}^T A\\mathbf{x}$，$A = ${mat3Latex(A)}$。$Q$ 中 $${term.name}$ 的系数是多少？`,
          ),
          answer: term.v,
          wrong: cross ? [term.e, term.e * 4] : [2 * term.v, d[0]!, d[2]!],
          mistakes: distinct(
            cross
              ? [
                  why(
                    term.e,
                    `That is $${term.at}$ alone; the mirrored entry contributes the same amount again.`,
                    `这只是 $${term.at}$；对称位置的元素还要再贡献同样的量。`,
                  ),
                  why(term.e * 4, "The entry was doubled twice; it is doubled once.", "这个元素被加倍了两次；只需加倍一次。"),
                ]
              : [
                  why(
                    2 * term.v,
                    "A diagonal entry is not doubled; only cross terms collect two entries.",
                    "对角元不加倍；只有交叉项才汇集两个元素。",
                  ),
                  why(d[0]!, "That is $a_{11}$, the coefficient of $x_1^2$.", "这是 $a_{11}$，即 $x_1^2$ 的系数。"),
                  why(d[2]!, "That is $a_{33}$, the coefficient of $x_3^2$.", "这是 $a_{33}$，即 $x_3^2$ 的系数。"),
                  why(
                    o[0]!,
                    "That is $a_{12}$, which is off the diagonal; the coefficient of $x_2^2$ is $a_{22}$.",
                    "这是非对角元 $a_{12}$；$x_2^2$ 的系数是 $a_{22}$。",
                  ),
                  why(
                    o[2]!,
                    "That is $a_{23}$, which is off the diagonal; the coefficient of $x_2^2$ is $a_{22}$.",
                    "这是非对角元 $a_{23}$；$x_2^2$ 的系数是 $a_{22}$。",
                  ),
                ],
            term.v,
          ),
          solution: cross
            ? walked(
                [
                  [
                    ["Find the two entries", "找出两个元素"],
                    t(
                      `$x_${term.name[2]}x_${term.name[5]}$ comes from $${term.at}$ and its mirror image, which are equal:`,
                      `$x_${term.name[2]}x_${term.name[5]}$ 来自 $${term.at}$ 及其对称位置的元素，二者相等：`,
                    ),
                    [`${term.at} = ${term.e}`],
                  ],
                  [["Add them", "相加"], t("", ""), [`${term.e} + ${paren(term.e)} = ${term.v}`]],
                ],
                t(
                  `In the expansion $\\sum a_{ij}x_ix_j$, the two terms are $${lead(term.e, `x_${term.name[2]}x_${term.name[5]}`)}$ and $${lead(term.e, `x_${term.name[5]}x_${term.name[2]}`)}$, which add to $${lead(term.v, term.name)}$.`,
                  `在展开式 $\\sum a_{ij}x_ix_j$ 中，这两项是 $${lead(term.e, `x_${term.name[2]}x_${term.name[5]}`)}$ 和 $${lead(term.e, `x_${term.name[5]}x_${term.name[2]}`)}$，合起来是 $${lead(term.v, term.name)}$。`,
                ),
              )
            : walked(
                [
                  [
                    ["Take the diagonal entry", "取对角元"],
                    t("$x_2^2$ comes only from the term $a_{22}x_2x_2$:", "$x_2^2$ 只来自 $a_{22}x_2x_2$ 这一项："),
                    [`a_{22} = ${term.v}`],
                  ],
                ],
                t(
                  "Every off-diagonal entry multiplies two different variables, so none of them adds to $x_2^2$.",
                  "每个非对角元乘的都是两个不同的变量，所以它们都不会加到 $x_2^2$ 上。",
                ),
              ),
        });
      },
    },
  ],
};

/** changeOfVariablesInQuadraticForms covers matrix congruence under coordinate transformations. */
export const changeOfVariablesInQuadraticForms: TopicDef = {
  id: "change-of-variables-in-quadratic-forms",
  title: t("Change of Variables in Quadratic Forms", "二次型的变量替换"),
  summary: t(
    "Apply an invertible change of variables $\\mathbf{x} = P\\mathbf{y}$ to a quadratic form to obtain the congruent matrix $P^T A P$.",
    "对二次型作可逆变量替换 $\\mathbf{x} = P\\mathbf{y}$，求出合同矩阵 $P^T A P$。",
  ),
  intro: t(
    "Take $Q = x_1^2 + 3x_2^2$ and substitute $x_1 = y_1 + y_2$, $x_2 = y_2$, that is $\\mathbf{x} = P\\mathbf{y}$ with $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$. Then $Q = (y_1 + y_2)^2 + 3y_2^2 = y_1^2 + 2y_1y_2 + 4y_2^2$, whose matrix is $P^TAP = \\begin{pmatrix} 1 & 1 \\\\ 1 & 4 \\end{pmatrix}$.\n\nCheck: at $\\mathbf{y} = (1, 1)$, $\\mathbf{x} = (2, 1)$ and $Q = 4 + 3 = 7$, while $1 + 2 + 4 = 7$ as well.\n\nIn this lesson we compute the matrix $P^TAP$ of a quadratic form after a change of variables, and substitute a shear directly into a form.",
    "取 $Q = x_1^2 + 3x_2^2$，代入 $x_1 = y_1 + y_2$，$x_2 = y_2$，即 $\\mathbf{x} = P\\mathbf{y}$，$P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$。于是 $Q = (y_1 + y_2)^2 + 3y_2^2 = y_1^2 + 2y_1y_2 + 4y_2^2$，它的矩阵是 $P^TAP = \\begin{pmatrix} 1 & 1 \\\\ 1 & 4 \\end{pmatrix}$。\n\n检验：在 $\\mathbf{y} = (1, 1)$ 处 $\\mathbf{x} = (2, 1)$，$Q = 4 + 3 = 7$，而 $1 + 2 + 4 = 7$ 也一样。\n\n本课我们计算变量替换后二次型的矩阵 $P^TAP$，并把剪切变换直接代入二次型。",
  ),
  prerequisites: ["quadratic-forms"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "change-of-variables-congruence",
      title: t("Congruent Matrix Under Change of Variables", "变量替换下的合同矩阵"),
      explanation: t(
        "If a quadratic form $Q(x) = x^T A x$ undergoes an invertible change of variables $x = P y$, then $Q(P y) = y^T (P^T A P) y$. The matrix of the new quadratic form is $B = P^T A P$, which is congruent to $A$. For example, $A = \\begin{pmatrix} 2 & 0 \\\\ 0 & -1 \\end{pmatrix}$ and $P = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$ give $P^TA = \\begin{pmatrix} 2 & -1 \\\\ 2 & -2 \\end{pmatrix}$ and $B = \\begin{pmatrix} 1 & 0 \\\\ 0 & -2 \\end{pmatrix}$.\n\n> **Watch out.** Multiply on both sides: $AP$ alone is not the new matrix, and $B$ is symmetric but need not be diagonal. Its entry $b_{ij}$ is $\\mathbf{p}_i^TA\\mathbf{p}_j$ for the columns $\\mathbf{p}_i$ of $P$.",
        "若二次型 $Q(x) = x^T A x$ 进行可逆变量替换 $x = P y$，则 $Q(P y) = y^T (P^T A P) y$。新二次型的矩阵为 $B = P^T A P$，与 $A$ 互为合同矩阵。例如 $A = \\begin{pmatrix} 2 & 0 \\\\ 0 & -1 \\end{pmatrix}$，$P = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$ 时，$P^TA = \\begin{pmatrix} 2 & -1 \\\\ 2 & -2 \\end{pmatrix}$，$B = \\begin{pmatrix} 1 & 0 \\\\ 0 & -2 \\end{pmatrix}$。\n\n> **注意。** 两边都要乘：只算 $AP$ 不是新矩阵；$B$ 是对称的，但不一定是对角的。它的元素 $b_{ij}$ 等于 $\\mathbf{p}_i^TA\\mathbf{p}_j$，$\\mathbf{p}_i$ 是 $P$ 的列。",
      ),
      generate: (rng: Rng): Problem => {
        const d1 = rng.nonZero(-4, 4);
        const d2 = rng.nonZero(-4, 4);
        const p11 = rng.nonZero(-2, 2);
        const p12 = rng.nonZero(-2, 2);
        let p21 = rng.int(-2, 2);
        const p22 = rng.nonZero(-2, 2);
        // The change of variables must be invertible, and B must keep a cross term. With p21 = 0 the determinant is
        // p11·p22 and b12 is d1·p11·p12, both nonzero.
        if (p11 * p22 === p12 * p21 || d1 * p11 * p12 + d2 * p21 * p22 === 0) p21 = 0;

        const b11 = d1 * p11 * p11 + d2 * p21 * p21;
        const b12 = d1 * p11 * p12 + d2 * p21 * p22;
        const b22 = d1 * p12 * p12 + d2 * p22 * p22;

        const A: Mat2 = [
          [d1, 0],
          [0, d2],
        ];
        const P: Mat2 = [
          [p11, p12],
          [p21, p22],
        ];
        const B: Mat2 = [
          [b11, b12],
          [b12, b22],
        ];
        // PAPᵀ: the transpose put on the wrong side.
        const c12 = d1 * p11 * p21 + d2 * p12 * p22;
        const flipped: Mat2 = [
          [d1 * p11 * p11 + d2 * p12 * p12, c12],
          [c12, d1 * p21 * p21 + d2 * p22 * p22],
        ];

        const prompt = t(
          `Let $Q(x) = x^T A x$ with $A = ${mat2Latex(A)}$. If the variables are changed by $x = P y$ where $P = ${mat2Latex(P)}$, find the matrix $B = P^T A P$ of the quadratic form in terms of $y$.`,
          `设二次型 $Q(x) = x^T A x$ 的矩阵为 $A = ${mat2Latex(A)}$。若作变量替换 $x = P y$，其中 $P = ${mat2Latex(P)}$，求该二次型关于新变量 $y$ 的矩阵 $B = P^T A P$。`,
        );

        const right = t(`$${mat2Latex(B)}$`, `$${mat2Latex(B)}$`);
        const wrong = [
          t(
            `$${mat2Latex([
              [b11, -b12],
              [-b12, b22],
            ])}$`,
            `$${mat2Latex([
              [b11, -b12],
              [-b12, b22],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [b22, b12],
              [b12, b11],
            ])}$`,
            `$${mat2Latex([
              [b22, b12],
              [b12, b11],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [d1 * p11, d1 * p12],
              [d2 * p21, d2 * p22],
            ])}$`,
            `$${mat2Latex([
              [d1 * p11, d1 * p12],
              [d2 * p21, d2 * p22],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [b11, 0],
              [0, b22],
            ])}$`,
            `$${mat2Latex([
              [b11, 0],
              [0, b22],
            ])}$`,
          ),
          t(`$${mat2Latex(flipped)}$`, `$${mat2Latex(flipped)}$`),
        ];

        const solution = walked(
          [
            [
              ["Multiply the transpose by A", "先算转置乘 A"],
              t("", ""),
              [
                `P^T A = ${mat2Latex([
                  [p11, p21],
                  [p12, p22],
                ])} ${mat2Latex(A)} = ${mat2Latex([
                  [d1 * p11, d2 * p21],
                  [d1 * p12, d2 * p22],
                ])}`,
              ],
            ],
            [["Multiply by P on the right", "再右乘 P"], t("", ""), [`B = (P^T A)P = ${mat2Latex(B)}`]],
          ],
          t(
            `$b_{11}$ is the form at the first column of $P$: $${d1}(${p11})^2 + ${paren(d2)}(${p21})^2 = ${b11}$.`,
            `$b_{11}$ 是二次型在 $P$ 第一列处的值：$${d1}(${p11})^2 + ${paren(d2)}(${p21})^2 = ${b11}$。`,
          ),
        );

        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `The off-diagonal entry is $${d1}(${p11})(${p12}) + ${paren(d2)}(${p21})(${p22}) = ${b12}$; its sign was flipped.`,
            `非对角元是 $${d1}(${p11})(${p12}) + ${paren(d2)}(${p21})(${p22}) = ${b12}$；符号被弄反了。`,
          ],
          [
            wrong[1]!.en,
            `The diagonal entries are swapped: $b_{11}$ comes from the first column of $P$ and equals $${b11}$.`,
            `对角元换反了：$b_{11}$ 来自 $P$ 的第一列，等于 $${b11}$。`,
          ],
          [wrong[2]!.en, "That is $AP$; it still has to be multiplied by $P^T$ on the left.", "这是 $AP$；还要在左边乘上 $P^T$。"],
          [
            wrong[3]!.en,
            `The off-diagonal entries were dropped; $P^TAP$ is symmetric but not diagonal here, with $b_{12} = ${b12}$.`,
            `漏掉了非对角元；这里 $P^TAP$ 是对称的，但不是对角的，$b_{12} = ${b12}$。`,
          ],
          [
            wrong[4]!.en,
            "That is $PAP^T$: the transpose went on the wrong side. Substituting $x = Py$ gives $y^TP^TAPy$, so $P^T$ is on the left.",
            "这是 $PAP^T$：转置放错了边。代入 $x = Py$ 得 $y^TP^TAPy$，所以 $P^T$ 在左边。",
          ],
        ]);
      },
    },
    {
      id: "substituting-a-shear-into-a-quadratic-form",
      title: t("Substituting a shear into a quadratic form", "将剪切变换代入二次型"),
      explanation: t(
        "A change of variables can be carried out by direct substitution as well as by $B = P^TAP$. Under $x_1 = y_1 + ky_2$, $x_2 = y_2$, the form $Q = ax_1^2 + bx_1x_2 + cx_2^2$ becomes\n\n$$a(y_1 + ky_2)^2 + b(y_1 + ky_2)y_2 + cy_2^2 = ay_1^2 + (2ak + b)y_1y_2 + (ak^2 + bk + c)y_2^2.$$\n\nChoosing $k = -\\frac{b}{2a}$ removes the cross term, which is exactly completing the square. For example, $Q = x_1^2 + 4x_1x_2 + x_2^2$ with $k = -2$ has $y_1y_2$ coefficient $2(1)(-2) + 4 = 0$ and $y_2^2$ coefficient $1 \\cdot 4 + 4(-2) + 1 = -3$.\n\n> **Watch out.** Expanding $(y_1 + ky_2)^2$ gives $2ky_1y_2$, with a factor $2$, and $k^2y_2^2$, with $k$ squared; the middle term $bx_1x_2$ also adds $bk$ to the $y_2^2$ coefficient.",
        "变量替换既可以用 $B = P^TAP$，也可以直接代入。在 $x_1 = y_1 + ky_2$，$x_2 = y_2$ 下，$Q = ax_1^2 + bx_1x_2 + cx_2^2$ 变为\n\n$$a(y_1 + ky_2)^2 + b(y_1 + ky_2)y_2 + cy_2^2 = ay_1^2 + (2ak + b)y_1y_2 + (ak^2 + bk + c)y_2^2$$\n\n取 $k = -\\frac{b}{2a}$ 可消去交叉项，这正是配方。例如 $Q = x_1^2 + 4x_1x_2 + x_2^2$ 取 $k = -2$ 时，$y_1y_2$ 的系数为 $2(1)(-2) + 4 = 0$，$y_2^2$ 的系数为 $1 \\cdot 4 + 4(-2) + 1 = -3$。\n\n> **注意。** 展开 $(y_1 + ky_2)^2$ 得 $2ky_1y_2$（有因子 $2$）和 $k^2y_2^2$（$k$ 要平方）；中间项 $bx_1x_2$ 还会给 $y_2^2$ 的系数加上 $bk$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 4);
        const b = rng.nonZero(-6, 6);
        const c = rng.int(-5, 5);
        const k = rng.nonZero(-3, 3);
        const askCross = rng.int(0, 1) === 0;
        const cross = 2 * a * k + b;
        const sq = a * k * k + b * k + c;
        const sub = `x_1 = y_1 ${formatAddVar(k, "y_2")}`;
        return numberProblem({
          prompt: t(
            `Substitute $${sub}$, $x_2 = y_2$ into $Q = ${formatQuadratic(a, b, c)}$. What is the coefficient of $${askCross ? "y_1y_2" : "y_2^2"}$?`,
            `把 $${sub}$，$x_2 = y_2$ 代入 $Q = ${formatQuadratic(a, b, c)}$。$${askCross ? "y_1y_2" : "y_2^2"}$ 的系数是多少？`,
          ),
          answer: askCross ? cross : sq,
          wrong: askCross ? [a * k + b, 2 * a * k, b] : [a * k * k + c, a * k + b * k + c, c],
          mistakes: distinct(
            askCross
              ? [
                  why(
                    a * k + b,
                    `The factor $2$ from $(y_1 ${formatAddVar(k, "y_2")})^2$ is missing: it gives $${lead(2 * k, "y_1y_2")}$, not $${lead(k, "y_1y_2")}$.`,
                    `漏掉了 $(y_1 ${formatAddVar(k, "y_2")})^2$ 中的因子 $2$：它给出 $${lead(2 * k, "y_1y_2")}$，而不是 $${lead(k, "y_1y_2")}$。`,
                  ),
                  why(
                    2 * a * k,
                    `The term $${lead(b, "x_1x_2")}$ also becomes $${lead(b, "y_1y_2")} + \\dots$; its $${b}$ was left out.`,
                    `$${lead(b, "x_1x_2")}$ 这一项也会变为 $${lead(b, "y_1y_2")} + \\dots$；漏掉了它的 $${b}$。`,
                  ),
                  why(
                    b,
                    "That is the old cross coefficient; the substitution adds $2ak$ to it.",
                    "这是原来的交叉项系数；代换还会给它加上 $2ak$。",
                  ),
                ]
              : [
                  why(
                    a * k * k + c,
                    `The term $${lead(b, "x_1x_2")}$ also adds $${b}(${k}) = ${b * k}$ to the $y_2^2$ coefficient.`,
                    `$${lead(b, "x_1x_2")}$ 这一项也给 $y_2^2$ 的系数加上 $${b}(${k}) = ${b * k}$。`,
                  ),
                  why(
                    a * k + b * k + c,
                    `$k$ was not squared: $(y_1 ${formatAddVar(k, "y_2")})^2$ contains $${lead(k * k, "y_2^2")}$.`,
                    `$k$ 没有平方：$(y_1 ${formatAddVar(k, "y_2")})^2$ 含有 $${lead(k * k, "y_2^2")}$。`,
                  ),
                  why(
                    c,
                    "That is the old $x_2^2$ coefficient; the substitution adds $ak^2 + bk$ to it.",
                    "这是原来 $x_2^2$ 的系数；代换还会给它加上 $ak^2 + bk$。",
                  ),
                  why(
                    -a * k * k + b * k + c,
                    `The sign of $${lead(a, "k^2")}$ was flipped: $(${lead(k, "y_2")})^2 = ${lead(k * k, "y_2^2")}$ is positive, so $${lead(a, "x_1^2")}$ adds $${a * k * k}$.`,
                    `$${lead(a, "k^2")}$ 的符号弄反了：$(${lead(k, "y_2")})^2 = ${lead(k * k, "y_2^2")}$ 是正的，所以 $${lead(a, "x_1^2")}$ 加上的是 $${a * k * k}$。`,
                  ),
                ],
            askCross ? cross : sq,
          ),
          solution: walked(
            [
              [
                ["Expand the square", "展开平方"],
                t("", ""),
                [`(y_1 ${formatAddVar(k, "y_2")})^2 = y_1^2 ${formatSignedTerm(2 * k, "y_1y_2")} + ${k * k === 1 ? "" : k * k}y_2^2`],
              ],
              [
                ["Collect the coefficients", "合并系数"],
                t(
                  `$${lead(a, "x_1^2")}$ contributes $${a}$ times this, $${lead(b, "x_1x_2")}$ contributes $${lead(b, `(y_1 ${formatAddVar(k, "y_2")})y_2`)}$, and the $x_2^2$ term adds $${c}$ to the $y_2^2$ coefficient:`,
                  `$${lead(a, "x_1^2")}$ 贡献它的 $${a}$ 倍，$${lead(b, "x_1x_2")}$ 贡献 $${lead(b, `(y_1 ${formatAddVar(k, "y_2")})y_2`)}$，$x_2^2$ 项再给 $y_2^2$ 的系数加上 $${c}$：`,
                ),
                [`y_1y_2: \\ 2(${a})(${k}) + ${paren(b)} = ${cross}`, `y_2^2: \\ ${a}(${k})^2 + ${paren(b)}(${k}) + ${paren(c)} = ${sq}`],
              ],
            ],
            t(
              `At $\\mathbf{y} = (1, 1)$, $\\mathbf{x} = (${1 + k}, 1)$ and $Q = ${a * (1 + k) * (1 + k) + b * (1 + k) + c}$, which equals $${a} + ${paren(cross)} + ${paren(sq)}$, the sum of the three new coefficients.`,
              `在 $\\mathbf{y} = (1, 1)$ 处 $\\mathbf{x} = (${1 + k}, 1)$，$Q = ${a * (1 + k) * (1 + k) + b * (1 + k) + c}$，等于三个新系数之和 $${a} + ${paren(cross)} + ${paren(sq)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** canonicalFormOfAQuadraticFormUsingLagrangesMethod covers completing the square to find canonical form. */
export const canonicalFormOfAQuadraticFormUsingLagrangesMethod: TopicDef = {
  id: "canonical-form-of-a-quadratic-form-using-lagranges-method",
  title: t("Finding the Canonical Form of a Quadratic Form Using Lagrange's Method", "用配方法（拉格朗日法）化二次型为标准形"),
  summary: t(
    "Transform a quadratic form into a diagonal sum of squares using Lagrange's method of completing the square.",
    "利用拉格朗日配方法将二次型化为只含平方项的标准形。",
  ),
  intro: t(
    "In $Q = x_1^2 + 4x_1x_2 + 7x_2^2$, the terms with $x_1$ complete to $(x_1 + 2x_2)^2 = x_1^2 + 4x_1x_2 + 4x_2^2$, which leaves $3x_2^2$. With $y_1 = x_1 + 2x_2$ and $y_2 = x_2$, the form is $y_1^2 + 3y_2^2$, a sum of squares with no cross term.\n\nCheck: at $\\mathbf{x} = (1, 1)$, $Q = 1 + 4 + 7 = 12$, and $y_1 = 3$, $y_2 = 1$ give $9 + 3 = 12$.\n\nIn this lesson we reduce a quadratic form to canonical form by completing the square, and handle a form with no square terms by first creating them.",
    "在 $Q = x_1^2 + 4x_1x_2 + 7x_2^2$ 中，含 $x_1$ 的项配成 $(x_1 + 2x_2)^2 = x_1^2 + 4x_1x_2 + 4x_2^2$，剩下 $3x_2^2$。令 $y_1 = x_1 + 2x_2$，$y_2 = x_2$，二次型就是 $y_1^2 + 3y_2^2$，只含平方项，没有交叉项。\n\n检验：在 $\\mathbf{x} = (1, 1)$ 处 $Q = 1 + 4 + 7 = 12$，而 $y_1 = 3$，$y_2 = 1$ 给出 $9 + 3 = 12$。\n\n本课我们用配方法把二次型化为标准形，并处理没有平方项的二次型：先造出平方项。",
  ),
  prerequisites: ["change-of-variables-in-quadratic-forms"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "lagrange-completing-the-square",
      title: t("Lagrange Reduction by Completing the Square", "拉格朗日配方法"),
      explanation: t(
        "Completing the square on one variable at a time removes the cross terms, rewriting the quadratic form as a weighted sum of squares. Lagrange's method repeatedly completes the square on each variable to eliminate cross-product terms: $a x_1^2 + 2b x_1 x_2 + c x_2^2 = a\\left(x_1 + \\frac{b}{a} x_2\\right)^2 + \\left(c - \\frac{b^2}{a}\\right) x_2^2 = d_1 y_1^2 + d_2 y_2^2$. For example, $2x_1^2 + 12x_1x_2 + 13x_2^2 = 2(x_1 + 3x_2)^2 - 18x_2^2 + 13x_2^2 = 2y_1^2 - 5y_2^2$.\n\n> **Watch out.** Completing the square adds $ak^2x_2^2$, here $2 \\cdot 9 = 18$, which must be subtracted from the $x_2^2$ coefficient. Keep $d_1 = a$ first and $d_2$ second.",
        "一次对一个变量配方可以消去交叉项，把二次型改写成平方的加权和。拉格朗日配方法通过逐个变量配方以消除交叉项：$a x_1^2 + 2b x_1 x_2 + c x_2^2 = a\\left(x_1 + \\frac{b}{a} x_2\\right)^2 + \\left(c - \\frac{b^2}{a}\\right) x_2^2 = d_1 y_1^2 + d_2 y_2^2$。例如 $2x_1^2 + 12x_1x_2 + 13x_2^2 = 2(x_1 + 3x_2)^2 - 18x_2^2 + 13x_2^2 = 2y_1^2 - 5y_2^2$。\n\n> **注意。** 配方时多出了 $ak^2x_2^2$，这里是 $2 \\cdot 9 = 18$，必须从 $x_2^2$ 的系数中减去。$d_1 = a$ 在前，$d_2$ 在后。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.nonZero(-3, 3);
        const k = rng.nonZero(-3, 3);
        const twoAk = 2 * a * k;
        const rem = rng.nonZero(-6, 6);
        const c = a * k * k + rem;

        const kTerm = formatAddVar(k, "x_2");
        const qStr = formatQuadratic(a, twoAk, c);

        const prompt = t(
          `Use Lagrange's method of completing the square to reduce the quadratic form\n\n$$Q(x_1, x_2) = ${qStr}$$\n\nto canonical form $d_1 y_1^2 + d_2 y_2^2$ with $y_1 = x_1 ${kTerm}$ and $y_2 = x_2$. Enter the coefficients as an ordered pair $(d_1, d_2)$.`,
          `使用拉格朗日配方法，将二次型\n\n$$Q(x_1, x_2) = ${qStr}$$\n\n化为标准形 $d_1 y_1^2 + d_2 y_2^2$（其中 $y_1 = x_1 ${kTerm}$，$y_2 = x_2$）。以有序数对 $(d_1, d_2)$ 的形式输入系数。`,
        );

        const solution = walked(
          [
            [
              ["Complete the square in x1", "对 x1 配方"],
              t(
                `$${formatFirstTerm(a, `(x_1 ${kTerm})^2`)}$ reproduces the $x_1$ terms and adds $${formatFirstTerm(a * k * k, "x_2^2")}$, so subtract it:`,
                `$${formatFirstTerm(a, `(x_1 ${kTerm})^2`)}$ 给出含 $x_1$ 的项，并多出 $${formatFirstTerm(a * k * k, "x_2^2")}$，所以减去它：`,
              ),
              [`Q = ${formatFirstTerm(a, `(x_1 ${kTerm})^2`)} ${formatSignedTerm(-a * k * k, "x_2^2")} ${formatSignedTerm(c, "x_2^2")}`],
            ],
            [
              ["Rename the variables", "换成新变量"],
              t("", ""),
              [`Q = ${formatFirstTerm(a, "y_1^2")} ${formatSignedTerm(rem, "y_2^2")}`, `(d_1, d_2) = (${a}, ${rem})`],
            ],
          ],
          t(
            `At $\\mathbf{x} = (1, 1)$, $Q = ${a} + ${paren(twoAk)} + ${paren(c)} = ${a + twoAk + c}$, and $y_1 = ${1 + k}$, $y_2 = 1$ give $${a}(${1 + k})^2 + ${paren(rem)} = ${a * (1 + k) * (1 + k) + rem}$.`,
            `在 $\\mathbf{x} = (1, 1)$ 处 $Q = ${a} + ${paren(twoAk)} + ${paren(c)} = ${a + twoAk + c}$，而 $y_1 = ${1 + k}$，$y_2 = 1$ 给出 $${a}(${1 + k})^2 + ${paren(rem)} = ${a * (1 + k) * (1 + k) + rem}$。`,
          ),
        );

        const wrong = [
          [a, c],
          [a, -rem],
          [rem, a],
          [a, c - a * k],
        ];
        return withMistakes(
          pointProblem({ prompt, answer: [a, rem], vars: ["d_1", "d_2"], solution, wrong }),
          dedupeSaid(
            [
              say(
                pointLatex(wrong[0]!),
                `Completing the square adds $${formatFirstTerm(a * k * k, "x_2^2")}$, which must be subtracted from $${c}$.`,
                `配方多出了 $${formatFirstTerm(a * k * k, "x_2^2")}$，必须从 $${c}$ 中减去。`,
              ),
              say(
                pointLatex(wrong[1]!),
                `The sign of $d_2$ is flipped: $${c} - ${paren(a * k * k)} = ${rem}$.`,
                `$d_2$ 的符号反了：$${c} - ${paren(a * k * k)} = ${rem}$。`,
              ),
              say(
                pointLatex(wrong[2]!),
                "The two coefficients are swapped; $d_1$ is the coefficient of $y_1^2$.",
                "两个系数换反了；$d_1$ 是 $y_1^2$ 的系数。",
              ),
              say(
                pointLatex(wrong[3]!),
                `The subtracted amount is $ak^2 = ${a * k * k}$, with $k$ squared, not $ak = ${a * k}$.`,
                `要减去的是 $ak^2 = ${a * k * k}$，$k$ 要平方，而不是 $ak = ${a * k}$。`,
              ),
            ],
            pointLatex([a, rem]),
          ),
        );
      },
    },
    {
      id: "lagranges-method-with-no-square-terms",
      title: t("Lagrange's method when there are no square terms", "没有平方项时的拉格朗日配方法"),
      explanation: t(
        "Completing the square needs a square term to start from. When the form is a pure product such as $Q = kx_1x_2$, first create squares with $x_1 = y_1 + cy_2$, $x_2 = y_1 - cy_2$:\n\n$$kx_1x_2 = k(y_1 + cy_2)(y_1 - cy_2) = ky_1^2 - kc^2y_2^2.$$\n\nThe result is already canonical, with one positive and one negative coefficient. For example, $x_1 = y_1 + 2y_2$, $x_2 = y_1 - 2y_2$ turns $3x_1x_2$ into $3(y_1^2 - 4y_2^2) = 3y_1^2 - 12y_2^2$.\n\n> **Watch out.** The product $(y_1 + cy_2)(y_1 - cy_2)$ is $y_1^2 - c^2y_2^2$: $c$ is squared and the sign is minus, and both are then multiplied by $k$.",
        "配方需要一个平方项作为起点。当二次型是纯乘积如 $Q = kx_1x_2$ 时，先用 $x_1 = y_1 + cy_2$，$x_2 = y_1 - cy_2$ 造出平方：\n\n$$kx_1x_2 = k(y_1 + cy_2)(y_1 - cy_2) = ky_1^2 - kc^2y_2^2$$\n\n结果已是标准形，一个系数为正、一个为负。例如 $x_1 = y_1 + 2y_2$，$x_2 = y_1 - 2y_2$ 把 $3x_1x_2$ 变为 $3(y_1^2 - 4y_2^2) = 3y_1^2 - 12y_2^2$。\n\n> **注意。** 乘积 $(y_1 + cy_2)(y_1 - cy_2)$ 等于 $y_1^2 - c^2y_2^2$：$c$ 要平方，符号是减号，然后两项都乘以 $k$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.nonZero(-9, 9);
        const c = rng.int(1, 3);
        const d1 = k;
        const d2 = -k * c * c;
        const cy = c === 1 ? "y_2" : `${c}y_2`;
        return numberProblem({
          prompt: t(
            `Substitute $x_1 = y_1 + ${cy}$, $x_2 = y_1 - ${cy}$ into $Q = ${formatFirstTerm(k, "x_1x_2")}$ to get $d_1y_1^2 + d_2y_2^2$. Find $d_2$.`,
            `把 $x_1 = y_1 + ${cy}$，$x_2 = y_1 - ${cy}$ 代入 $Q = ${formatFirstTerm(k, "x_1x_2")}$，得到 $d_1y_1^2 + d_2y_2^2$。求 $d_2$。`,
          ),
          answer: d2,
          wrong: [k * c * c, -2 * k * c, k],
          mistakes: distinct(
            [
              why(k * c * c, "The sign is lost: the product of the two factors has $-c^2y_2^2$.", "符号丢了：两个因式之积含 $-c^2y_2^2$。"),
              why(
                -2 * k * c,
                `$c$ was doubled instead of squared: $${c}^2 = ${c * c}$.`,
                `$c$ 被乘以 $2$ 而不是平方：$${c}^2 = ${c * c}$。`,
              ),
              why(k, "That is $d_1$, the coefficient of $y_1^2$.", "这是 $d_1$，即 $y_1^2$ 的系数。"),
            ],
            d2,
          ),
          solution: walked(
            [
              [
                ["Multiply the two factors", "两个因式相乘"],
                t("", ""),
                [`(y_1 + ${cy})(y_1 - ${cy}) = y_1^2 - ${c * c === 1 ? "" : c * c}y_2^2`],
              ],
              [["Multiply by the coefficient", "乘以系数"], t("", ""), [`Q = ${formatDiagonalForm(d1, d2)}`, `d_2 = ${d2}`]],
            ],
            t(
              `At $\\mathbf{y} = (1, 1)$, $x_1 = ${1 + c}$ and $x_2 = ${1 - c}$, so $Q = ${k} \\cdot ${1 + c} \\cdot ${paren(1 - c)} = ${k * (1 + c) * (1 - c)}$, and $d_1 + d_2 = ${d1} + ${paren(d2)}$ gives the same.`,
              `在 $\\mathbf{y} = (1, 1)$ 处 $x_1 = ${1 + c}$，$x_2 = ${1 - c}$，所以 $Q = ${k} \\cdot ${1 + c} \\cdot ${paren(1 - c)} = ${k * (1 + c) * (1 - c)}$，而 $d_1 + d_2 = ${d1} + ${paren(d2)}$ 也是这个值。`,
            ),
          ),
        });
      },
    },
  ],
};

/** canonicalFormOfAQuadraticFormUsingOrthogonalTransformations covers orthogonal diagonalization of quadratic forms. */
export const canonicalFormOfAQuadraticFormUsingOrthogonalTransformations: TopicDef = {
  id: "canonical-form-of-a-quadratic-form-using-orthogonal-transformations",
  title: t("Finding the Canonical Form of a Quadratic Form Using Orthogonal Transformations", "用正交变换法化二次型为标准形"),
  summary: t(
    "Reduce a quadratic form to the canonical form $\\lambda_1 y_1^2 + \\cdots + \\lambda_n y_n^2$ using an orthogonal change of variables.",
    "通过正交变换将二次型化为标准形 $\\lambda_1 y_1^2 + \\cdots + \\lambda_n y_n^2$，其中系数为对称矩阵的特征值。",
  ),
  intro: t(
    "The form $Q = 5x_1^2 + 4x_1x_2 + 5x_2^2$ has the symmetric matrix $A = \\begin{pmatrix} 5 & 2 \\\\ 2 & 5 \\end{pmatrix}$, with eigenvalues $5 - 2 = 3$ and $5 + 2 = 7$. Rotating to the orthonormal eigenvectors, $\\mathbf{x} = P\\mathbf{y}$, turns the form into $3y_1^2 + 7y_2^2$.\n\nCheck: $3 + 7 = 10 = 5 + 5$, the trace of $A$, and $3 \\cdot 7 = 21 = 25 - 4 = \\det A$.\n\nIn this lesson we find the canonical form of a quadratic form under an orthogonal change of variables, and read the sum and product of its coefficients from the trace and determinant.",
    "二次型 $Q = 5x_1^2 + 4x_1x_2 + 5x_2^2$ 的对称矩阵为 $A = \\begin{pmatrix} 5 & 2 \\\\ 2 & 5 \\end{pmatrix}$，特征值为 $5 - 2 = 3$ 和 $5 + 2 = 7$。旋转到标准正交特征向量上，即 $\\mathbf{x} = P\\mathbf{y}$，二次型就变为 $3y_1^2 + 7y_2^2$。\n\n检验：$3 + 7 = 10 = 5 + 5$，等于 $A$ 的迹；$3 \\cdot 7 = 21 = 25 - 4 = \\det A$。\n\n本课我们求二次型在正交变量替换下的标准形，并由迹和行列式读出其系数之和与积。",
  ),
  prerequisites: ["canonical-form-of-a-quadratic-form-using-lagranges-method"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "orthogonal-transformation-canonical-form",
      title: t("Canonical Form via Orthogonal Transformation", "正交变换下的标准形"),
      explanation: t(
        "By the Principal Axes Theorem, any quadratic form $x^T A x$ can be transformed by an orthogonal substitution $x = P y$ into $Q = \\lambda_1 y_1^2 + \\dots + \\lambda_n y_n^2$, where the coefficients $\\lambda_i$ are the eigenvalues of the symmetric matrix $A$. For example, $Q = 3x_1^2 + 2x_1x_2 + 3x_2^2$ has $A = \\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$ with eigenvalues $2$ and $4$, so its canonical form is $2y_1^2 + 4y_2^2$.\n\n> **Watch out.** Build $A$ with half the cross coefficient off the diagonal, and use its eigenvalues as the coefficients, not its entries.",
        "根据主轴定理，任意二次型 $x^T A x$ 均可通过正交变换 $x = P y$ 化为标准形 $Q = \\lambda_1 y_1^2 + \\dots + \\lambda_n y_n^2$，其中系数 $\\lambda_i$ 为实对称矩阵 $A$ 的特征值。例如 $Q = 3x_1^2 + 2x_1x_2 + 3x_2^2$ 的矩阵 $A = \\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$ 的特征值为 $2$ 和 $4$，所以标准形是 $2y_1^2 + 4y_2^2$。\n\n> **注意。** 构造 $A$ 时非对角元取交叉项系数的一半，标准形的系数用它的特征值，而不是它的元素。",
      ),
      generate: (rng: Rng): Problem => {
        const m = rng.int(-5, 5);
        const k = rng.int(1, 6);
        const twoK = 2 * k;
        const l1 = m - k;
        const l2 = m + k;

        const qStr = formatQuadratic(m, twoK, m);
        const rightStr = formatDiagonalForm(l1, l2);

        const prompt = t(
          `Under an orthogonal transformation $x = P y$, find the canonical form of the quadratic form\n\n$$Q(x_1, x_2) = ${qStr}.$$`,
          `通过正交变换 $x = P y$，求二次型 $Q(x_1, x_2) = ${qStr}$ 的标准形。`,
        );

        const right = t(`$${rightStr}$`, `$${rightStr}$`);
        const wrong = [
          t(`$${formatDiagonalForm(m, twoK)}$`, `$${formatDiagonalForm(m, twoK)}$`),
          t(`$${formatDiagonalForm(m - 2 * k, m + 2 * k)}$`, `$${formatDiagonalForm(m - 2 * k, m + 2 * k)}$`),
          t(`$${formatDiagonalForm(l2, -l1)}$`, `$${formatDiagonalForm(l2, -l1)}$`),
          t(`$${formatDiagonalForm(m, k)}$`, `$${formatDiagonalForm(m, k)}$`),
        ];

        const solution = walked(
          [
            [
              ["Write the symmetric matrix", "写出对称矩阵"],
              t(`Half of $${twoK}$ goes off the diagonal:`, `$${twoK}$ 的一半放在非对角位置：`),
              [
                `A = ${mat2Latex([
                  [m, k],
                  [k, m],
                ])}`,
              ],
            ],
            [
              ["Find the eigenvalues", "求特征值"],
              t("", ""),
              [`(${m} - \\lambda)^2 - ${k}^2 = 0`, `\\lambda_1 = ${l1}, \\quad \\lambda_2 = ${l2}`],
            ],
            [["Use them as the coefficients", "以特征值为系数"], t("", ""), [`Q = ${rightStr}`]],
          ],
          t(
            `$${l1} + ${paren(l2)} = ${2 * m} = \\operatorname{tr}A$ and $${paren(l1)} \\cdot ${paren(l2)} = ${l1 * l2} = ${m * m} - ${k * k} = \\det A$.`,
            `$${l1} + ${paren(l2)} = ${2 * m} = \\operatorname{tr}A$，$${paren(l1)} \\cdot ${paren(l2)} = ${l1 * l2} = ${m * m} - ${k * k} = \\det A$。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `This uses the diagonal entry and the whole coefficient of $x_1 x_2$, but the coefficients of the canonical form are the eigenvalues $${l1}$ and $${l2}$.`,
            `这里用了对角元素和 $x_1 x_2$ 的整个系数，但标准形的系数是特征值 $${l1}$ 和 $${l2}$。`,
          ],
          [
            wrong[1]!.en,
            `The off-diagonal entry of the symmetric matrix is half the coefficient of $x_1 x_2$, so it is $${k}$, not $${twoK}$.`,
            `对称矩阵的非对角元素是 $x_1 x_2$ 系数的一半，所以是 $${k}$，不是 $${twoK}$。`,
          ],
          [
            wrong[2]!.en,
            `The coefficients are the eigenvalues $${l1}$ and $${l2}$, each with its own sign.`,
            `系数是特征值 $${l1}$ 和 $${l2}$，各带自己的符号。`,
          ],
          [
            wrong[3]!.en,
            `These are entries of the symmetric matrix, not its eigenvalues $${l1}$ and $${l2}$.`,
            `这些是对称矩阵的元素，不是它的特征值 $${l1}$ 和 $${l2}$。`,
          ],
        ]);
      },
    },
    {
      id: "invariants-of-the-orthogonal-canonical-form",
      title: t("Trace and determinant of the canonical form", "标准形的迹与行列式"),
      explanation: t(
        "Under an orthogonal transformation the canonical form is $\\lambda_1y_1^2 + \\lambda_2y_2^2$, where $\\lambda_1, \\lambda_2$ are the eigenvalues of the symmetric matrix $A$. Similar matrices share trace and determinant, so without finding the eigenvalues:\n\n$$\\lambda_1 + \\lambda_2 = a_{11} + a_{22}, \\qquad \\lambda_1\\lambda_2 = a_{11}a_{22} - a_{12}^2.$$\n\nFor $Q = ax_1^2 + bx_1x_2 + cx_2^2$ remember that $a_{12} = \\frac{b}{2}$. For example, $Q = 4x_1^2 + 6x_1x_2 - x_2^2$ has $\\lambda_1 + \\lambda_2 = 4 + (-1) = 3$ and $\\lambda_1\\lambda_2 = 4(-1) - 3^2 = -13$.\n\n> **Watch out.** In the determinant, square half the cross coefficient, $\\left(\\frac{b}{2}\\right)^2$, not $b^2$, and subtract it. The cross coefficient plays no part in the sum.",
        "在正交变换下标准形为 $\\lambda_1y_1^2 + \\lambda_2y_2^2$，$\\lambda_1, \\lambda_2$ 是对称矩阵 $A$ 的特征值。相似矩阵有相同的迹与行列式，所以不必求特征值：\n\n$$\\lambda_1 + \\lambda_2 = a_{11} + a_{22}, \\qquad \\lambda_1\\lambda_2 = a_{11}a_{22} - a_{12}^2$$\n\n对 $Q = ax_1^2 + bx_1x_2 + cx_2^2$，记住 $a_{12} = \\frac{b}{2}$。例如 $Q = 4x_1^2 + 6x_1x_2 - x_2^2$ 有 $\\lambda_1 + \\lambda_2 = 4 + (-1) = 3$，$\\lambda_1\\lambda_2 = 4(-1) - 3^2 = -13$。\n\n> **注意。** 行列式中要平方的是交叉项系数的一半 $\\left(\\frac{b}{2}\\right)^2$，而不是 $b^2$，并且要减去它。交叉项系数与和无关。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-5, 6);
        const c = rng.int(-5, 6);
        const h = rng.nonZero(-4, 4);
        const b = 2 * h;
        const askSum = rng.int(0, 1) === 0;
        const ans = askSum ? a + c : a * c - h * h;
        return numberProblem({
          prompt: t(
            `An orthogonal transformation reduces $Q = ${formatQuadratic(a, b, c)}$ to $\\lambda_1y_1^2 + \\lambda_2y_2^2$. Find $${askSum ? "\\lambda_1 + \\lambda_2" : "\\lambda_1\\lambda_2"}$.`,
            `正交变换把 $Q = ${formatQuadratic(a, b, c)}$ 化为 $\\lambda_1y_1^2 + \\lambda_2y_2^2$。求 $${askSum ? "\\lambda_1 + \\lambda_2" : "\\lambda_1\\lambda_2"}$。`,
          ),
          answer: ans,
          wrong: askSum ? [a + c + b, a * c - h * h, a - c] : [a * c - b * b, a * c + h * h, a + c],
          mistakes: distinct(
            askSum
              ? [
                  why(
                    a + c + b,
                    "The cross coefficient does not enter the trace; add only the diagonal.",
                    "交叉项系数不进入迹；只把对角元相加。",
                  ),
                  why(
                    a * c - h * h,
                    "That is $\\det A$, the product $\\lambda_1\\lambda_2$, not the sum.",
                    "这是 $\\det A$，即乘积 $\\lambda_1\\lambda_2$，不是和。",
                  ),
                  why(a - c, "The trace adds the diagonal entries; it does not subtract them.", "迹是把对角元相加，而不是相减。"),
                  why(
                    -(a + c),
                    "That is the coefficient of $\\lambda$ in $\\det(A - \\lambda I)$; the sum of the roots is its negative.",
                    "这是 $\\det(A - \\lambda I)$ 中 $\\lambda$ 的系数；两根之和是它的相反数。",
                  ),
                  why(
                    a + c + h,
                    `$a_{12} = ${h}$ is off the diagonal; the trace adds only $a_{11} = ${a}$ and $a_{22} = ${c}$.`,
                    `$a_{12} = ${h}$ 不在对角线上；迹只把 $a_{11} = ${a}$ 和 $a_{22} = ${c}$ 相加。`,
                  ),
                ]
              : [
                  why(
                    a * c - b * b,
                    `That squares the whole cross coefficient $${b}$; the entry $a_{12}$ is half of it, $${h}$.`,
                    `这是把整个交叉项系数 $${b}$ 平方了；元素 $a_{12}$ 是它的一半，即 $${h}$。`,
                  ),
                  why(
                    a * c + h * h,
                    `The determinant subtracts $a_{12}^2 = ${h * h}$; it does not add it.`,
                    `行列式要减去 $a_{12}^2 = ${h * h}$，而不是加上。`,
                  ),
                  why(
                    a + c,
                    "That is the trace, the sum $\\lambda_1 + \\lambda_2$, not the product.",
                    "这是迹，即和 $\\lambda_1 + \\lambda_2$，不是积。",
                  ),
                  why(
                    a * c,
                    `The off-diagonal entries were left out: $\\det A$ also subtracts $a_{12}^2 = ${h * h}$.`,
                    `漏掉了非对角元：$\\det A$ 还要减去 $a_{12}^2 = ${h * h}$。`,
                  ),
                ],
            ans,
          ),
          solution: walked(
            [
              [
                ["Write the symmetric matrix", "写出对称矩阵"],
                t(`Half of $${b}$ goes off the diagonal:`, `$${b}$ 的一半放在非对角位置：`),
                [
                  `A = ${mat2Latex([
                    [a, h],
                    [h, c],
                  ])}`,
                ],
              ],
              askSum
                ? [["Take the trace", "求迹"], t("", ""), [`\\lambda_1 + \\lambda_2 = \\operatorname{tr}A = ${a} + ${paren(c)} = ${ans}`]]
                : [
                    ["Take the determinant", "求行列式"],
                    t("", ""),
                    [`\\lambda_1\\lambda_2 = \\det A = ${a} \\cdot ${paren(c)} - ${paren(h)}^2 = ${ans}`],
                  ],
            ],
            t(
              `$\\det(A - \\lambda I) = (${a} - \\lambda)(${c} - \\lambda) - ${h * h} = \\lambda^2 ${formatSignedTerm(-(a + c), "\\lambda")} ${a * c - h * h === 0 ? "" : a * c - h * h > 0 ? `+ ${a * c - h * h}` : `- ${h * h - a * c}`}$. The sum of its roots is $${a + c}$ and their product is $${a * c - h * h}$, so $${askSum ? "\\lambda_1 + \\lambda_2" : "\\lambda_1\\lambda_2"} = ${ans}$.`,
              `$\\det(A - \\lambda I) = (${a} - \\lambda)(${c} - \\lambda) - ${h * h} = \\lambda^2 ${formatSignedTerm(-(a + c), "\\lambda")} ${a * c - h * h === 0 ? "" : a * c - h * h > 0 ? `+ ${a * c - h * h}` : `- ${h * h - a * c}`}$。它的两根之和为 $${a + c}$，之积为 $${a * c - h * h}$，所以 $${askSum ? "\\lambda_1 + \\lambda_2" : "\\lambda_1\\lambda_2"} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** positiveDefiniteAndNegativeDefiniteQuadraticForms covers classifying definiteness of quadratic forms. */
export const positiveDefiniteAndNegativeDefiniteQuadraticForms: TopicDef = {
  id: "positive-definite-and-negative-definite-quadratic-forms",
  title: t("Positive-Definite and Negative-Definite Quadratic Forms", "正定与负定二次型"),
  summary: t(
    "Classify quadratic forms as positive definite, negative definite, semidefinite, or indefinite using Sylvester's criterion and eigenvalues.",
    "利用西尔维斯特准则（顺序主子式）及特征值判定二次型的正定性、负定性、半定性与不定性。",
  ),
  intro: t(
    "The form $Q = 2x_1^2 + 2x_1x_2 + 3x_2^2$ has $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$, with leading principal minors $\\Delta_1 = 2 > 0$ and $\\Delta_2 = 6 - 1 = 5 > 0$. By Sylvester's criterion the form is positive definite: $Q(\\mathbf{x}) > 0$ for every $\\mathbf{x} \\ne \\mathbf{0}$.\n\nCheck: completing the square gives $Q = 2\\left(x_1 + \\frac{1}{2}x_2\\right)^2 + \\frac{5}{2}x_2^2$, a sum of squares with positive weights.\n\nIn this lesson we classify quadratic forms in two and three variables as positive definite, negative definite or indefinite from their leading principal minors.",
    "二次型 $Q = 2x_1^2 + 2x_1x_2 + 3x_2^2$ 的矩阵为 $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$，顺序主子式为 $\\Delta_1 = 2 > 0$，$\\Delta_2 = 6 - 1 = 5 > 0$。由西尔维斯特准则，该二次型正定：对每个 $\\mathbf{x} \\ne \\mathbf{0}$ 都有 $Q(\\mathbf{x}) > 0$。\n\n检验：配方得 $Q = 2\\left(x_1 + \\frac{1}{2}x_2\\right)^2 + \\frac{5}{2}x_2^2$，是权重为正的平方和。\n\n本课我们由顺序主子式判定二元和三元二次型是正定、负定还是不定。",
  ),
  prerequisites: ["canonical-form-of-a-quadratic-form-using-orthogonal-transformations"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "quadratic-forms-definiteness",
      title: t("Classifying Definiteness of Quadratic Forms", "二次型定性的判定"),
      explanation: t(
        "A quadratic form is:\n- **Positive definite** iff all eigenvalues are $> 0$ (all leading principal minors $\\Delta_k > 0$).\n- **Negative definite** iff all eigenvalues are $< 0$ ($(-1)^k \\Delta_k > 0$).\n- **Indefinite** iff it has both positive and negative eigenvalues.\n\nFor example, $Q = -x_1^2 + 4x_1x_2 - 5x_2^2$ has $\\Delta_1 = -1 < 0$ and $\\Delta_2 = (-1)(-5) - 2^2 = 1 > 0$, so it is negative definite.\n\n> **Watch out.** Use half the cross coefficient in $\\Delta_2 = ac - b^2$. A negative definite form has $\\Delta_2 > 0$, not $\\Delta_2 < 0$; a negative $\\Delta_2$ means the form is indefinite.",
        "二次型的定性判定：\n- **正定**：当且仅当所有特征值大于 0（所有顺序主子式 $\\Delta_k > 0$）；\n- **负定**：当且仅当所有特征值小于 0（顺序主子式正负相错，即 $(-1)^k \\Delta_k > 0$）；\n- **不定**：具有异号特征值。\n\n例如 $Q = -x_1^2 + 4x_1x_2 - 5x_2^2$ 有 $\\Delta_1 = -1 < 0$，$\\Delta_2 = (-1)(-5) - 2^2 = 1 > 0$，所以它是负定的。\n\n> **注意。** $\\Delta_2 = ac - b^2$ 中用的是交叉项系数的一半。负定二次型的 $\\Delta_2 > 0$，而不是 $\\Delta_2 < 0$；$\\Delta_2$ 为负说明二次型不定。",
      ),
      generate: (rng: Rng): Problem => {
        const kind = rng.int(0, 2);
        let a: number;
        let c: number;
        let b: number;
        let classificationEn: string;
        let classificationZh: string;

        if (kind === 0) {
          a = rng.int(2, 6);
          b = rng.int(1, 3);
          c = rng.int(Math.floor((b * b) / a) + 2, Math.floor((b * b) / a) + 6);
          classificationEn = "Positive definite";
          classificationZh = "正定";
        } else if (kind === 1) {
          a = -rng.int(2, 6);
          b = rng.int(1, 3);
          c = -rng.int(Math.floor((b * b) / -a) + 2, Math.floor((b * b) / -a) + 6);
          classificationEn = "Negative definite";
          classificationZh = "负定";
        } else {
          a = rng.int(1, 5);
          c = -rng.int(1, 5);
          b = rng.int(0, 3);
          classificationEn = "Indefinite";
          classificationZh = "不定";
        }

        const twoB = 2 * b;
        const delta1 = a;
        const delta2 = a * c - b * b;
        const qStr = formatQuadratic(a, twoB, c);

        const prompt = t(
          `Classify the definiteness of the quadratic form\n\n$$Q(x_1, x_2) = ${qStr}.$$`,
          `判定二次型 $Q(x_1, x_2) = ${qStr}$ 的定性。`,
        );

        const right = t(classificationEn, classificationZh);
        const wrong = [
          t("Positive definite", "正定"),
          t("Negative definite", "负定"),
          t("Indefinite", "不定"),
          t("Positive semidefinite (not positive definite)", "半正定（非正定）"),
        ].filter((opt) => opt.en !== classificationEn);

        const minorsLine = `\\Delta_1 = ${delta1}, \\quad \\Delta_2 = (${a})(${c}) - ${b}^2 = ${delta2}`;
        const conclude =
          kind === 0
            ? t(
                "Both minors are positive, so by Sylvester's criterion the form is positive definite.",
                "两个主子式都为正，由西尔维斯特准则，该二次型正定。",
              )
            : kind === 1
              ? t(
                  "$\\Delta_1 < 0$ and $\\Delta_2 > 0$: the signs alternate starting with negative, so the form is negative definite.",
                  "$\\Delta_1 < 0$ 且 $\\Delta_2 > 0$：符号由负开始交替，所以该二次型负定。",
                )
              : t(
                  "$\\Delta_2 = \\det A < 0$, so the two eigenvalues have opposite signs and the form is indefinite.",
                  "$\\Delta_2 = \\det A < 0$，所以两个特征值异号，该二次型不定。",
                );
        const solution = walked(
          [
            [
              ["Write the symmetric matrix", "写出对称矩阵"],
              t(`Half of $${twoB}$ goes off the diagonal:`, `$${twoB}$ 的一半放在非对角位置：`),
              [
                `A = ${mat2Latex([
                  [a, b],
                  [b, c],
                ])}`,
              ],
            ],
            [["Compute the leading principal minors", "计算顺序主子式"], t("", ""), [minorsLine]],
            [["Apply the criterion", "应用判据"], conclude],
          ],
          kind === 2
            ? t(
                `$Q(1, 0) = ${a} > 0$ while $Q(0, 1) = ${c} < 0$, so $Q$ takes both signs.`,
                `$Q(1, 0) = ${a} > 0$，而 $Q(0, 1) = ${c} < 0$，所以 $Q$ 取到两种符号。`,
              )
            : t(
                `$Q(1, 0) = ${a}$ and $Q(0, 1) = ${c}$ are both ${kind === 0 ? "positive" : "negative"}, as they must be.`,
                `$Q(1, 0) = ${a}$ 与 $Q(0, 1) = ${c}$ 都是${kind === 0 ? "正" : "负"}的，理应如此。`,
              ),
        );

        const opposite: [string, string] = [
          `$\\Delta_2 = ${delta2} < 0$, so the eigenvalues have opposite signs.`,
          `$\\Delta_2 = ${delta2} < 0$，所以特征值异号。`,
        ];
        const notPositive: [string, string] =
          kind === 2 ? opposite : [`$\\Delta_1 = ${delta1} < 0$, so $Q(1, 0) < 0$.`, `$\\Delta_1 = ${delta1} < 0$，所以 $Q(1, 0) < 0$。`];
        const notNegative: [string, string] =
          kind === 2 ? opposite : [`$\\Delta_1 = ${delta1} > 0$, so $Q(1, 0) > 0$.`, `$\\Delta_1 = ${delta1} > 0$，所以 $Q(1, 0) > 0$。`];
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          ["Positive definite", ...notPositive],
          ["Negative definite", ...notNegative],
          [
            "Indefinite",
            `$\\Delta_2 = ${delta2} > 0$, so both eigenvalues have the same sign.`,
            `$\\Delta_2 = ${delta2} > 0$，所以两个特征值同号。`,
          ],
          [
            "Positive semidefinite (not positive definite)",
            `$\\Delta_2 = ${delta2} \\ne 0$, so $0$ is not an eigenvalue and the form is not merely semidefinite.`,
            `$\\Delta_2 = ${delta2} \\ne 0$，所以 $0$ 不是特征值，该二次型不只是半定的。`,
          ],
        ]);
      },
    },
    {
      id: "sylvesters-criterion-for-three-variables",
      title: t("Sylvester's criterion in three variables", "三元二次型的西尔维斯特判据"),
      explanation: t(
        "Sylvester's criterion classifies a symmetric matrix by its leading principal minors $D_1 = a_{11}$, $D_2 = \\det$ of the top-left $2 \\times 2$ block, and $D_3 = \\det A$. The form is positive definite exactly when $D_1, D_2, D_3 > 0$, and negative definite exactly when the signs alternate $D_1 < 0$, $D_2 > 0$, $D_3 < 0$. If $D_3 \\ne 0$ and neither pattern holds, the form is indefinite. For example, $A = \\begin{pmatrix} 2 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & -1 \\end{pmatrix}$ has $D_1 = 2$, $D_2 = 6$ and $D_3 = -6$, so it is indefinite even though the first two minors are positive.\n\n> **Watch out.** Check all three minors. Negative definite does not mean all minors negative: the signs must alternate, so $D_2$ is positive.",
        "西尔维斯特判据用顺序主子式 $D_1 = a_{11}$、左上 $2 \\times 2$ 块的行列式 $D_2$ 与 $D_3 = \\det A$ 来分类对称矩阵。二次型正定当且仅当 $D_1, D_2, D_3 > 0$；负定当且仅当符号交替 $D_1 < 0$，$D_2 > 0$，$D_3 < 0$。若 $D_3 \\ne 0$ 且两种模式都不满足，则二次型不定。例如 $A = \\begin{pmatrix} 2 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & -1 \\end{pmatrix}$ 有 $D_1 = 2$，$D_2 = 6$，$D_3 = -6$，所以虽然前两个主子式为正，它仍是不定的。\n\n> **注意。** 三个主子式都要检查。负定并不是所有主子式都为负：符号必须交替，所以 $D_2$ 为正。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(0, 2);
        const off = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];
        let diag = [rng.int(5, 8), rng.int(5, 8), rng.int(5, 8)];
        if (kind === 2) diag = [rng.int(1, 4), -rng.int(1, 4), rng.int(1, 4)];
        const s = kind === 1 ? -1 : 1;
        const A: number[][] = [
          [s * diag[0]!, s * off[0]!, s * off[1]!],
          [s * off[0]!, s * diag[1]!, s * off[2]!],
          [s * off[1]!, s * off[2]!, s * diag[2]!],
        ];
        const minors = () => {
          const r = A as unknown as Mat3;
          const d2 = r[0][0] * r[1][1] - r[0][1] * r[1][0];
          const d3 =
            r[0][0] * (r[1][1] * r[2][2] - r[1][2] * r[2][1]) -
            r[0][1] * (r[1][0] * r[2][2] - r[1][2] * r[2][0]) +
            r[0][2] * (r[1][0] * r[2][1] - r[1][1] * r[2][0]);
          return [r[0][0], d2, d3] as const;
        };
        let D = minors();
        while (D[2] === 0) {
          A[2]![2]! += 1;
          D = minors();
        }
        const pd = D[0] > 0 && D[1] > 0 && D[2] > 0;
        const nd = D[0] < 0 && D[1] > 0 && D[2] < 0;
        const P = t("Positive definite", "正定");
        const N = t("Negative definite", "负定");
        const I = t("Indefinite", "不定");
        const S = t("Positive semidefinite but not definite", "半正定但不正定");
        const right = pd ? P : nd ? N : I;
        const r = A as unknown as Mat3;
        const diagonal = [r[0][0], r[1][1], r[2][2]];
        const up = diagonal.findIndex((v) => v > 0);
        const down = diagonal.findIndex((v) => v < 0);
        const minorLines = [
          `D_1 = ${D[0]}`,
          `D_2 = ${r[0][0]} \\cdot ${paren(r[1][1])} - ${paren(r[0][1])}^2 = ${D[1]}`,
          `D_3 = \\det A = ${D[2]}`,
        ];
        const solution = walked(
          [
            [["Compute the leading principal minors", "计算顺序主子式"], t("", ""), minorLines],
            [
              ["Compare with the sign patterns", "对照符号模式"],
              pd
                ? t("All three are positive, so the form is positive definite.", "三个都为正，所以二次型正定。")
                : nd
                  ? t(
                      "The signs alternate $-, +, -$, so the form is negative definite.",
                      "符号依次为 $-, +, -$，交替出现，所以二次型负定。",
                    )
                  : t(
                      "$D_3 \\ne 0$ and the signs fit neither pattern, so the form is indefinite.",
                      "$D_3 \\ne 0$，且符号不符合任何一种模式，所以二次型不定。",
                    ),
            ],
          ],
          pd || nd || up < 0 || down < 0
            ? t(
                `The diagonal entries $${diagonal.join(", ")}$ are the values $Q(\\mathbf{e}_1), Q(\\mathbf{e}_2), Q(\\mathbf{e}_3)$, and they agree with this.`,
                `对角元 $${diagonal.join(", ")}$ 就是 $Q(\\mathbf{e}_1), Q(\\mathbf{e}_2), Q(\\mathbf{e}_3)$ 的值，与上面的结论一致。`,
              )
            : t(
                `$Q(\\mathbf{e}_${up + 1}) = ${diagonal[up]} > 0$ while $Q(\\mathbf{e}_${down + 1}) = ${diagonal[down]} < 0$, so $Q$ takes both signs.`,
                `$Q(\\mathbf{e}_${up + 1}) = ${diagonal[up]} > 0$，而 $Q(\\mathbf{e}_${down + 1}) = ${diagonal[down]} < 0$，所以 $Q$ 取到两种符号。`,
              ),
        );
        const failP: [string, string] =
          D[0] <= 0
            ? [`$D_1 = ${D[0]}$ is not positive.`, `$D_1 = ${D[0]}$ 不是正的。`]
            : D[1] <= 0
              ? [`$D_2 = ${D[1]}$ is not positive.`, `$D_2 = ${D[1]}$ 不是正的。`]
              : [`$D_3 = ${D[2]}$ is not positive.`, `$D_3 = ${D[2]}$ 不是正的。`];
        const failN: [string, string] =
          D[0] >= 0
            ? [`Negative definite needs $D_1 < 0$, but $D_1 = ${D[0]}$.`, `负定要求 $D_1 < 0$，但 $D_1 = ${D[0]}$。`]
            : D[1] <= 0
              ? [`Negative definite needs $D_2 > 0$, but $D_2 = ${D[1]}$.`, `负定要求 $D_2 > 0$，但 $D_2 = ${D[1]}$。`]
              : [`Negative definite needs $D_3 < 0$, but $D_3 = ${D[2]}$.`, `负定要求 $D_3 < 0$，但 $D_3 = ${D[2]}$。`];
        return reasoned(
          oneOf(
            rng,
            t(
              `Classify the quadratic form $\\mathbf{x}^T A\\mathbf{x}$ with $A = ${mat3Latex(A as unknown as Mat3)}$.`,
              `判定二次型 $\\mathbf{x}^T A\\mathbf{x}$ 的类型，$A = ${mat3Latex(A as unknown as Mat3)}$。`,
            ),
            right,
            [P, N, I, S].filter((o) => o !== right),
            solution,
          ),
          [
            [P.en, ...failP],
            [N.en, ...failN],
            [
              I.en,
              `The minors follow the ${pd ? "all-positive" : "alternating"} pattern, so the form is definite.`,
              `主子式符合${pd ? "全为正" : "交替"}的模式，所以二次型是定的。`,
            ],
            [
              S.en,
              `$D_3 = \\det A = ${D[2]} \\ne 0$, so $0$ is not an eigenvalue and the form is not merely semidefinite.`,
              `$D_3 = \\det A = ${D[2]} \\ne 0$，所以 $0$ 不是特征值，二次型不只是半定的。`,
            ],
          ],
        );
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 7.27: QUADRATIC FORMS IN EUCLIDEAN SPACE
// ════════════════════════════════════════════════════════════════════════════

/** reducingAQuadraticCurveToItsPrincipalAxes covers eliminating cross-terms via coordinate rotation. */
export const reducingAQuadraticCurveToItsPrincipalAxes: TopicDef = {
  id: "reducing-a-quadratic-curve-to-its-principal-axes",
  title: t("Reducing a Quadratic Curve to Its Principal Axes", "二次曲线化为主轴方程"),
  summary: t(
    "Eliminate the cross-product term in a quadratic curve equation by rotating coordinate axes to the principal axes.",
    "通过旋转坐标轴至主轴方向，消除二次曲线方程中的交叉项。",
  ),
  intro: t(
    "The curve $3x_1^2 + 2x_1x_2 + 3x_2^2 = 8$ has the matrix $A = \\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$, with eigenvalues $2$ and $4$ and unit eigenvectors $\\frac{1}{\\sqrt{2}}(1, -1)$ and $\\frac{1}{\\sqrt{2}}(1, 1)$. Turning the axes onto these eigenvectors removes the cross term: the curve is $2y_1^2 + 4y_2^2 = 8$, an ellipse with semi-axes $2$ and $\\sqrt{2}$.\n\nCheck: the eigenvalues add up to the trace, $2 + 4 = 3 + 3$, and multiply to the determinant, $2 \\cdot 4 = 9 - 1$.\n\nIn this lesson we rotate a quadratic curve onto its principal axes and read off its semi-axes and area from the eigenvalues.",
    "曲线 $3x_1^2 + 2x_1x_2 + 3x_2^2 = 8$ 的矩阵为 $A = \\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$，特征值为 $2$ 和 $4$，单位特征向量为 $\\frac{1}{\\sqrt{2}}(1, -1)$ 和 $\\frac{1}{\\sqrt{2}}(1, 1)$。把坐标轴转到这两个特征向量上，交叉项就消失了：曲线变为 $2y_1^2 + 4y_2^2 = 8$，是半轴为 $2$ 和 $\\sqrt{2}$ 的椭圆。\n\n检验：特征值之和等于迹，$2 + 4 = 3 + 3$；特征值之积等于行列式，$2 \\cdot 4 = 9 - 1$。\n\n本课我们把二次曲线转到主轴上，并由特征值读出它的半轴和面积。",
  ),
  prerequisites: ["positive-definite-and-negative-definite-quadratic-forms"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "principal-axes-reduction",
      figure: linearAlgebraDrawings2["reducing-a-quadratic-curve-to-its-principal-axes#principal-axes-reduction"],
      title: t("Principal Axes Equation of a Conic", "二次曲线的主轴方程"),
      explanation: t(
        "For a quadratic curve $a x_1^2 + 2b x_1 x_2 + c x_2^2 = d$, rotating coordinates via an orthogonal matrix $P$ to the principal axes eliminates the cross term, yielding $\\lambda_1 y_1^2 + \\lambda_2 y_2^2 = d$, where $\\lambda_1, \\lambda_2$ are the eigenvalues of $\\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}$. For example, $5x_1^2 + 6x_1x_2 + 5x_2^2 = 16$ has the matrix $\\begin{pmatrix} 5 & 3 \\\\ 3 & 5 \\end{pmatrix}$ with eigenvalues $5 \\pm 3$, so it becomes $2y_1^2 + 8y_2^2 = 16$.\n\n> **Watch out.** The new coefficients are the eigenvalues, not the entries of the matrix, and the off-diagonal entry is half the coefficient of $x_1x_2$. The right-hand side $d$ does not change.",
        "对于二次曲线 $a x_1^2 + 2b x_1 x_2 + c x_2^2 = d$，通过正交矩阵 $P$ 旋转至主轴坐标系可消除交叉项，化为主轴方程 $\\lambda_1 y_1^2 + \\lambda_2 y_2^2 = d$，其中 $\\lambda_1, \\lambda_2$ 为矩阵 $\\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}$ 的特征值。例如 $5x_1^2 + 6x_1x_2 + 5x_2^2 = 16$ 的矩阵为 $\\begin{pmatrix} 5 & 3 \\\\ 3 & 5 \\end{pmatrix}$，特征值为 $5 \\pm 3$，所以它化为 $2y_1^2 + 8y_2^2 = 16$。\n\n> **注意。** 新的系数是特征值，而不是矩阵的元素；非对角元素是 $x_1x_2$ 系数的一半。右端的 $d$ 不变。",
      ),
      generate: (rng: Rng): Problem => {
        const m = rng.int(2, 7);
        const k = rng.int(1, 5);
        const twoK = 2 * k;
        const d = rng.int(10, 50);
        const l1 = m - k;
        const l2 = m + k;

        const lhsStr = formatQuadratic(m, twoK, m);
        const rightStr = `${formatDiagonalForm(l1, l2)} = ${d}`;

        const prompt = t(
          `Reduce the quadratic curve equation\n\n$$${lhsStr} = ${d}$$\n\nto its principal axes form $\\lambda_1 y_1^2 + \\lambda_2 y_2^2 = ${d}$ by an orthogonal rotation of axes (with $\\lambda_1 \\le \\lambda_2$).`,
          `通过正交旋转坐标轴，将二次曲线方程 $${lhsStr} = ${d}$ 化为主轴标准方程 $\\lambda_1 y_1^2 + \\lambda_2 y_2^2 = ${d}$（其中 $\\lambda_1 \\le \\lambda_2$）。`,
        );

        const right = t(`$${rightStr}$`, `$${rightStr}$`);
        const wrong = [
          t(`$${formatDiagonalForm(l2, l1)} = ${d}$`, `$${formatDiagonalForm(l2, l1)} = ${d}$`),
          t(`$${formatDiagonalForm(m, twoK)} = ${d}$`, `$${formatDiagonalForm(m, twoK)} = ${d}$`),
          t(`$${formatDiagonalForm(m - 2 * k, m + 2 * k)} = ${d}$`, `$${formatDiagonalForm(m - 2 * k, m + 2 * k)} = ${d}$`),
          t(`$${formatDiagonalForm(l1, -l2)} = ${d}$`, `$${formatDiagonalForm(l1, -l2)} = ${d}$`),
        ];

        const solution = walked(
          [
            [
              ["Write the matrix", "写出矩阵"],
              t(`Half of $${twoK}$ goes off the diagonal:`, `$${twoK}$ 的一半放在非对角位置：`),
              [
                `A = ${mat2Latex([
                  [m, k],
                  [k, m],
                ])}`,
              ],
            ],
            [
              ["Find the eigenvalues", "求特征值"],
              t("", ""),
              [`(${m} - \\lambda)^2 - ${k}^2 = 0`, `\\lambda = ${m} \\pm ${k} = ${l1}, ${l2}`],
            ],
            [
              ["Write the principal axes form", "写出主轴方程"],
              t("The eigenvalues become the coefficients, smaller first:", "特征值成为系数，较小的在前："),
              [rightStr],
            ],
          ],
          t(
            `$${l1} + ${paren(l2)} = ${l1 + l2} = ${m} + ${m}$, the trace, and $${paren(l1)} \\cdot ${paren(l2)} = ${l1 * l2} = ${m}^2 - ${k}^2$, the determinant.`,
            `$${l1} + ${paren(l2)} = ${l1 + l2} = ${m} + ${m}$，等于迹；$${paren(l1)} \\cdot ${paren(l2)} = ${l1 * l2} = ${m}^2 - ${k}^2$，等于行列式。`,
          ),
        );

        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The coefficients are in the wrong order: the smaller eigenvalue goes with $y_1$.",
            "系数顺序反了：较小的特征值对应 $y_1$。",
          ],
          [
            wrong[1]!.en,
            `$${m}$ and $${twoK}$ are coefficients of the original equation, not eigenvalues of $A$.`,
            `$${m}$ 和 $${twoK}$ 是原方程的系数，不是 $A$ 的特征值。`,
          ],
          [
            wrong[2]!.en,
            `That uses the whole cross coefficient $${twoK}$ as the off-diagonal entry; the entry is $${k}$, so the eigenvalues are $${m} \\pm ${k}$.`,
            `这把整个交叉项系数 $${twoK}$ 当作了非对角元素；元素是 $${k}$，所以特征值是 $${m} \\pm ${k}$。`,
          ],
          [
            wrong[3]!.en,
            `Both eigenvalues are $${m} \\pm ${k}$; the larger one, $${l2}$, keeps its sign.`,
            `两个特征值都是 $${m} \\pm ${k}$；较大的 $${l2}$ 符号不变。`,
          ],
        ]);
      },
    },
    {
      id: "semi-axes-of-an-ellipse-from-its-principal-axes",
      figure: linearAlgebraDrawings2["reducing-a-quadratic-curve-to-its-principal-axes#semi-axes-of-an-ellipse-from-its-principal-axes"],
      title: t("Semi-axes of an ellipse from its principal axes", "由主轴形式求椭圆的半轴"),
      explanation: t(
        "Rotating to principal axes turns $ax^2 + 2hxy + cy^2 = d$ into $\\lambda_1y_1^2 + \\lambda_2y_2^2 = d$, where $\\lambda_1, \\lambda_2$ are the eigenvalues of $\\begin{pmatrix} a & h \\\\ h & c \\end{pmatrix}$. When both eigenvalues and $d$ are positive, this is an ellipse with semi-axes $\\sqrt{d/\\lambda_1}$ and $\\sqrt{d/\\lambda_2}$. The smaller eigenvalue gives the longer, major semi-axis. For example, $y_1^2 + 4y_2^2 = 16$ has semi-axes $\\sqrt{16/1} = 4$ and $\\sqrt{16/4} = 2$, so the major semi-axis is $4$.\n\n> **Watch out.** Divide $d$ by the smaller eigenvalue and take the square root. Dividing by the larger one gives the minor semi-axis, and forgetting the root gives the square of the semi-axis.",
        "旋转到主轴把 $ax^2 + 2hxy + cy^2 = d$ 化为 $\\lambda_1y_1^2 + \\lambda_2y_2^2 = d$，其中 $\\lambda_1, \\lambda_2$ 是 $\\begin{pmatrix} a & h \\\\ h & c \\end{pmatrix}$ 的特征值。当两个特征值与 $d$ 都为正时，这是半轴为 $\\sqrt{d/\\lambda_1}$ 与 $\\sqrt{d/\\lambda_2}$ 的椭圆。较小的特征值给出较长的半长轴。例如 $y_1^2 + 4y_2^2 = 16$ 的半轴为 $\\sqrt{16/1} = 4$ 和 $\\sqrt{16/4} = 2$，所以半长轴为 $4$。\n\n> **注意。** 用 $d$ 除以较小的特征值，再开平方。除以较大的特征值得到的是半短轴，忘记开方得到的是半轴的平方。",
      ),
      generate(rng: Rng): Problem {
        const [r1, r2, k] = rng.pick([
          [1, 3, 1],
          [3, 5, 1],
          [1, 5, 1],
          [2, 4, 1],
          [2, 6, 1],
          [4, 6, 1],
          [1, 4, 2],
          [2, 3, 2],
          [1, 6, 2],
          [4, 6, 2],
        ] as const);
        const swap = rng.int(0, 1) === 1;
        const [l1, l2] = swap ? [r2 * r2, r1 * r1] : [r1 * r1, r2 * r2];
        const A = symFromEigen(l1, l2, k);
        const m = rng.int(1, 2);
        const d = (r1 * r2 * m) ** 2;
        const major = r2 * m;
        const minor = r1 * m;
        return numberProblem({
          prompt: t(
            `The curve $${formatQuadratic(A[0][0], 2 * A[0][1], A[1][1], "x", "y")} = ${d}$ has eigenvalues $${l1}$ and $${l2}$ for its matrix. Find the length of its major semi-axis.`,
            `曲线 $${formatQuadratic(A[0][0], 2 * A[0][1], A[1][1], "x", "y")} = ${d}$ 的矩阵特征值为 $${l1}$ 与 $${l2}$。求其半长轴的长度。`,
          ),
          answer: major,
          wrong: [minor, Q.of(d, r1 * r1), r2, 2 * major],
          mistakes: distinct(
            [
              why(
                minor,
                "That divides by the larger eigenvalue, which gives the minor semi-axis.",
                "这是除以较大的特征值，得到的是半短轴。",
              ),
              why(
                Q.of(d, r1 * r1),
                `$${d}/${r1 * r1} = ${d / (r1 * r1)}$ is the square of the semi-axis; take its square root.`,
                `$${d}/${r1 * r1} = ${d / (r1 * r1)}$ 是半轴的平方；还要开平方。`,
              ),
              why(
                r2,
                `$${r2}$ is the square root of the eigenvalue $${r2 * r2}$; the semi-axis is $\\sqrt{d/\\lambda}$.`,
                `$${r2}$ 是特征值 $${r2 * r2}$ 的平方根；半轴是 $\\sqrt{d/\\lambda}$。`,
              ),
              why(2 * major, "That is the whole major axis; the semi-axis is half of it.", "这是整条长轴；半长轴是它的一半。"),
            ],
            major,
          ),
          solution: walked(
            [
              [
                ["Write the principal axes form", "写出主轴方程"],
                t("The eigenvalues become the coefficients:", "特征值成为系数："),
                [`${formatDiagonalForm(l1, l2)} = ${d}`],
              ],
              [
                ["Find both semi-axes", "求两个半轴"],
                t("", ""),
                [`\\sqrt{${d}/${l1}} = ${Math.sqrt(d / l1)}`, `\\sqrt{${d}/${l2}} = ${Math.sqrt(d / l2)}`],
              ],
              [
                ["Take the longer one", "取较长的一个"],
                t(
                  `The smaller eigenvalue $${r1 * r1}$ gives the major semi-axis $${major}$.`,
                  `较小的特征值 $${r1 * r1}$ 给出半长轴 $${major}$。`,
                ),
              ],
            ],
            t(
              `$${r1 * r1} \\cdot ${major}^2 = ${d}$, so the point at distance $${major}$ along the axis of the eigenvalue $${r1 * r1}$ lies on the curve.`,
              `$${r1 * r1} \\cdot ${major}^2 = ${d}$，所以沿特征值 $${r1 * r1}$ 的轴、距离为 $${major}$ 的点在曲线上。`,
            ),
          ),
        });
      },
    },
  ],
};

/** classifyingQuadraticCurves covers classifying planar conics using quadratic forms. */
export const classifyingQuadraticCurves: TopicDef = {
  id: "classifying-quadratic-curves",
  title: t("Classifying Quadratic Curves", "二次曲线的分类"),
  summary: t(
    "Classify quadratic curves as ellipses, hyperbolas, or parabolas using the determinant and eigenvalues of the quadratic matrix.",
    "利用二次项矩阵的行列式及特征值将二次曲线分类为椭圆、双曲线或抛物线。",
  ),
  intro: t(
    "The curve $2x^2 + 6xy + y^2 = 4$ has the matrix $A = \\begin{pmatrix} 2 & 3 \\\\ 3 & 1 \\end{pmatrix}$, with $\\det A = 2 - 9 = -7 < 0$. The two eigenvalues multiply to $-7$, so they have opposite signs, and in principal axes the curve is $\\lambda_1y_1^2 + \\lambda_2y_2^2 = 4$ with $\\lambda_1 < 0 < \\lambda_2$: a hyperbola.\n\nCheck: the form takes both signs, since $Q(1, 0) = 2 > 0$ while $Q(1, -1) = 2 - 6 + 1 = -3 < 0$.\n\nIn this lesson we tell ellipses, hyperbolas and parabolas apart from the determinant of the quadratic part, or from the discriminant $b^2 - 4ac$, and find the axes of a rotated ellipse.",
    "曲线 $2x^2 + 6xy + y^2 = 4$ 的矩阵为 $A = \\begin{pmatrix} 2 & 3 \\\\ 3 & 1 \\end{pmatrix}$，$\\det A = 2 - 9 = -7 < 0$。两个特征值之积为 $-7$，所以它们异号；在主轴下曲线为 $\\lambda_1y_1^2 + \\lambda_2y_2^2 = 4$，其中 $\\lambda_1 < 0 < \\lambda_2$：这是双曲线。\n\n检验：二次型取两种符号，因为 $Q(1, 0) = 2 > 0$，而 $Q(1, -1) = 2 - 6 + 1 = -3 < 0$。\n\n本课我们由二次部分的行列式或判别式 $b^2 - 4ac$ 区分椭圆、双曲线和抛物线，并求旋转椭圆的轴。",
  ),
  prerequisites: ["reducing-a-quadratic-curve-to-its-principal-axes"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "quadratic-curve-classification",
      figure: linearAlgebraDrawings2["classifying-quadratic-curves#quadratic-curve-classification"],
      title: t("Classification of Conics by the Discriminant", "利用判别式对二次曲线分类"),
      explanation: t(
        "For a quadratic curve $a x^2 + 2b xy + c y^2 + d x + e y = f$, let $A = \\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}$. The nature of the conic is determined by $\\det(A) = ac - b^2$:\n- $\\det(A) > 0$ (eigenvalues same sign): **Ellipse** (or circle/empty set/point);\n- $\\det(A) < 0$ (eigenvalues opposite signs): **Hyperbola**;\n- $\\det(A) = 0$ (one zero eigenvalue): **Parabola** (or a pair of parallel lines when no linear term survives).\n\nFor example, $x^2 + 4xy + y^2 = 3$ has $\\det A = 1 \\cdot 1 - 2^2 = -3 < 0$, so it is a hyperbola, even though both squared terms are positive.\n\n> **Watch out.** Use half the coefficient of $xy$ in $A$. The signs of $a$ and $c$ alone do not decide the type; the determinant does.",
        "对于二次曲线 $a x^2 + 2b xy + c y^2 + d x + e y = f$，设 $A = \\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}$。由 $\\det(A) = ac - b^2$ 判定曲线类型：\n- $\\det(A) > 0$（特征值同号）：**椭圆**；\n- $\\det(A) < 0$（特征值异号）：**双曲线**；\n- $\\det(A) = 0$（存在零特征值）：**抛物线**（没有起作用的一次项时为一对平行线）。\n\n例如 $x^2 + 4xy + y^2 = 3$ 的 $\\det A = 1 \\cdot 1 - 2^2 = -3 < 0$，所以它是双曲线，尽管两个平方项都是正的。\n\n> **注意。** $A$ 中用的是 $xy$ 系数的一半。只看 $a$ 和 $c$ 的符号不能确定类型，要看行列式。",
      ),
      generate: (rng: Rng): Problem => {
        const type = rng.int(0, 2);
        let a: number;
        let b: number;
        let c: number;
        let conicEn: string;
        let conicZh: string;

        if (type === 0) {
          a = rng.int(3, 7);
          b = rng.int(1, 2);
          c = rng.int(2, 6);
          conicEn = "Ellipse";
          conicZh = "椭圆";
        } else if (type === 1) {
          a = rng.int(1, 5);
          c = -rng.int(1, 5);
          b = rng.int(0, 3);
          conicEn = "Hyperbola";
          conicZh = "双曲线";
        } else {
          const s = rng.int(1, 3);
          a = s * s;
          b = s * 2;
          c = 4;
          conicEn = "Parabola";
          conicZh = "抛物线";
        }

        const twoB = 2 * b;
        const detA = a * c - b * b;
        const rhs = rng.int(5, 30);
        // A parabola needs a linear term across the direction of the square; without it the curve is two parallel lines.
        const linear = type === 2 ? -(Math.sqrt(a) + 2) : 0;
        const lhsStr = `${formatQuadratic(a, twoB, c, "x", "y")}${linear ? ` ${formatSignedTerm(linear, "y")}` : ""}`;

        const prompt = t(
          `Classify the quadratic curve given by\n\n$$${lhsStr} = ${rhs}.$$`,
          `判定二次曲线 $${lhsStr} = ${rhs}$ 的几何类型。`,
        );

        const right = t(conicEn, conicZh);
        const wrong = [
          t("Ellipse", "椭圆"),
          t("Hyperbola", "双曲线"),
          t("Parabola", "抛物线"),
          t("Pair of intersecting lines", "两条相交直线"),
        ].filter((opt) => opt.en !== conicEn);

        const s = Math.sqrt(a);
        const solution = walked(
          [
            [
              ["Write the matrix of the quadratic part", "写出二次部分的矩阵"],
              t(`Half of $${twoB}$ goes off the diagonal:`, `$${twoB}$ 的一半放在非对角位置：`),
              [
                `A = ${mat2Latex([
                  [a, b],
                  [b, c],
                ])}`,
              ],
            ],
            [["Find its determinant", "求行列式"], t("", ""), [`\\det A = ${a} \\cdot ${paren(c)} - ${b}^2 = ${detA}`]],
            [
              ["Read the type", "判断类型"],
              type === 0
                ? t(
                    "The determinant is positive and $a > 0$, so both eigenvalues are positive and the curve is an ellipse.",
                    "行列式为正且 $a > 0$，所以两个特征值都为正，曲线是椭圆。",
                  )
                : type === 1
                  ? t(
                      "The determinant is negative, so the eigenvalues have opposite signs and the curve is a hyperbola.",
                      "行列式为负，所以两个特征值异号，曲线是双曲线。",
                    )
                  : t(
                      "The determinant is zero, so one eigenvalue is zero, and the term in $y$ is not along the square, so the curve is a parabola.",
                      "行列式为零，所以有一个特征值为零；而 $y$ 的一次项不沿平方项的方向，所以曲线是抛物线。",
                    ),
            ],
          ],
          type === 0
            ? t(
                `On the axes, $x = 0$ gives $${c}y^2 = ${rhs}$ and $y = 0$ gives $${a}x^2 = ${rhs}$: both have solutions, as an ellipse around the origin needs.`,
                `在坐标轴上，$x = 0$ 给出 $${c}y^2 = ${rhs}$，$y = 0$ 给出 $${a}x^2 = ${rhs}$：都有解，符合绕原点的椭圆。`,
              )
            : type === 1
              ? t(
                  `On the axes, $y = 0$ gives $${a === 1 ? "" : a}x^2 = ${rhs}$, which has solutions, while $x = 0$ gives $${c}y^2 = ${rhs}$, which has none: the curve meets one axis and misses the other.`,
                  `在坐标轴上，$y = 0$ 给出 $${a === 1 ? "" : a}x^2 = ${rhs}$，有解；而 $x = 0$ 给出 $${c}y^2 = ${rhs}$，无解：曲线与一条轴相交，与另一条不相交。`,
                )
              : t(
                  `The quadratic part is the perfect square $(${s === 1 ? "" : s}x + 2y)^2$, which confirms $\\det A = 0$.`,
                  `二次部分是完全平方 $(${s === 1 ? "" : s}x + 2y)^2$，印证了 $\\det A = 0$。`,
                ),
        );

        const reasons: Record<string, [string, string]> = {
          Ellipse: [
            `An ellipse needs $\\det A > 0$, and here $\\det A = ${detA}$.`,
            `椭圆要求 $\\det A > 0$，而这里 $\\det A = ${detA}$。`,
          ],
          Hyperbola: [
            `A hyperbola needs $\\det A < 0$, and here $\\det A = ${detA}$.`,
            `双曲线要求 $\\det A < 0$，而这里 $\\det A = ${detA}$。`,
          ],
          Parabola: [
            `A parabola needs $\\det A = 0$, and here $\\det A = ${detA}$.`,
            `抛物线要求 $\\det A = 0$，而这里 $\\det A = ${detA}$。`,
          ],
          "Pair of intersecting lines": [
            `Two intersecting lines need $\\det A < 0$ and a right-hand side of $0$; here the right-hand side is $${rhs}$${detA < 0 ? "" : ` and $\\det A = ${detA}$`}.`,
            `两条相交直线要求 $\\det A < 0$ 且右端为 $0$；这里右端是 $${rhs}$${detA < 0 ? "" : `，且 $\\det A = ${detA}$`}。`,
          ],
        };
        return reasoned(
          oneOf(rng, prompt, right, wrong, solution),
          wrong.map((w) => [w.en, ...reasons[w.en]!] as const),
        );
      },
    },
    {
      id: "classifying-a-conic-by-its-discriminant",
      figure: linearAlgebraDrawings2["classifying-quadratic-curves#classifying-a-conic-by-its-discriminant"],
      title: t("Classifying a conic by its discriminant", "用判别式分类二次曲线"),
      explanation: t(
        "For a non-degenerate curve $ax^2 + bxy + cy^2 + dx + ey + f = 0$, only the quadratic part decides the type. Its matrix $\\begin{pmatrix} a & b/2 \\\\ b/2 & c \\end{pmatrix}$ has determinant $ac - \\frac{b^2}{4}$, so the sign of $b^2 - 4ac$ tells whether the eigenvalues have the same sign:\n- $b^2 - 4ac < 0$: an ellipse,\n- $b^2 - 4ac > 0$: a hyperbola,\n- $b^2 - 4ac = 0$: a parabola.\n\nThe linear terms only shift the curve. For example, $2x^2 + 3xy + y^2 - x + 4y = 5$ has $b^2 - 4ac = 9 - 8 = 1 > 0$, so it is a hyperbola.\n\n> **Watch out.** Here $b$ is the whole coefficient of $xy$, so the test is $b^2 - 4ac$; with the matrix entry $\\frac{b}{2}$ the same test reads $ac - \\left(\\frac{b}{2}\\right)^2$, with the opposite sign.",
        "对非退化曲线 $ax^2 + bxy + cy^2 + dx + ey + f = 0$，只有二次部分决定类型。其矩阵 $\\begin{pmatrix} a & b/2 \\\\ b/2 & c \\end{pmatrix}$ 的行列式为 $ac - \\frac{b^2}{4}$，所以 $b^2 - 4ac$ 的符号说明特征值是否同号：\n- $b^2 - 4ac < 0$：椭圆，\n- $b^2 - 4ac > 0$：双曲线，\n- $b^2 - 4ac = 0$：抛物线。\n\n一次项只是平移曲线。例如 $2x^2 + 3xy + y^2 - x + 4y = 5$ 的 $b^2 - 4ac = 9 - 8 = 1 > 0$，所以它是双曲线。\n\n> **注意。** 这里 $b$ 是 $xy$ 的整个系数，所以判别式是 $b^2 - 4ac$；若用矩阵元素 $\\frac{b}{2}$，同一判据写成 $ac - \\left(\\frac{b}{2}\\right)^2$，符号相反。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(0, 2);
        let a = rng.int(1, 5);
        let b = rng.nonZero(-6, 6);
        let c = rng.int(1, 5);
        if (kind === 0) {
          while (b * b - 4 * a * c >= 0) c += 1;
        } else if (kind === 1) {
          while (b * b - 4 * a * c <= 0) b += b > 0 ? 1 : -1;
        } else {
          const p = rng.int(1, 3);
          const q = rng.nonZero(-3, 3);
          [a, b, c] = [p * p, 2 * p * q, q * q];
        }
        const d = rng.nonZero(-5, 5);
        const e = rng.nonZero(-5, 5);
        const disc = b * b - 4 * a * c;
        const E = t("An ellipse", "椭圆");
        const H = t("A hyperbola", "双曲线");
        const Pa = t("A parabola", "抛物线");
        const right = disc < 0 ? E : disc > 0 ? H : Pa;
        const lhs = `${formatQuadratic(a, b, c, "x", "y")} ${formatSignedTerm(d, "x")} ${formatSignedTerm(e, "y")}`;
        const rhs = rng.int(1, 9);
        const half = b % 2 === 0 && b > 0 ? `${b / 2}` : `\\left(${Q.of(b, 2).toLatex()}\\right)`;
        return reasoned(
          oneOf(
            rng,
            t(`Assuming it is non-degenerate, what kind of curve is $${lhs} = ${rhs}$?`, `假设曲线非退化，$${lhs} = ${rhs}$ 是哪种曲线？`),
            right,
            [E, H, Pa].filter((o) => o !== right),
            walked(
              [
                [
                  ["Read the quadratic coefficients", "读出二次项系数"],
                  t("The linear terms do not affect the type, so only these matter:", "一次项不影响类型，所以只看这些："),
                  [`a = ${a}, \\quad b = ${b}, \\quad c = ${c}`],
                ],
                [["Compute the discriminant", "计算判别式"], t("", ""), [`b^2 - 4ac = ${b * b} - ${4 * a * c} = ${disc}`]],
                [
                  ["Read the sign", "看符号"],
                  t(
                    `The discriminant is ${disc < 0 ? "negative, so the curve is an ellipse" : disc > 0 ? "positive, so the curve is a hyperbola" : "zero, so the curve is a parabola"}.`,
                    `判别式${disc < 0 ? "为负，所以曲线是椭圆" : disc > 0 ? "为正，所以曲线是双曲线" : "为零，所以曲线是抛物线"}。`,
                  ),
                ],
              ],
              t(
                `The matrix of the quadratic part has determinant $${a} \\cdot ${c} - ${half}^2 = ${Q.of(-disc, 4).toLatex()}$, which is $-\\frac{1}{4}$ of the discriminant, so it gives the same answer.`,
                `二次部分矩阵的行列式为 $${a} \\cdot ${c} - ${half}^2 = ${Q.of(-disc, 4).toLatex()}$，是判别式的 $-\\frac{1}{4}$，结论相同。`,
              ),
            ),
          ),
          [
            [
              "An ellipse",
              `An ellipse needs $b^2 - 4ac < 0$, and here it is $${disc}$.`,
              `椭圆要求 $b^2 - 4ac < 0$，而这里它等于 $${disc}$。`,
            ],
            [
              "A hyperbola",
              `A hyperbola needs $b^2 - 4ac > 0$, and here it is $${disc}$.`,
              `双曲线要求 $b^2 - 4ac > 0$，而这里它等于 $${disc}$。`,
            ],
            [
              "A parabola",
              `A parabola needs $b^2 - 4ac = 0$, and here it is $${disc}$.`,
              `抛物线要求 $b^2 - 4ac = 0$，而这里它等于 $${disc}$。`,
            ],
          ],
        );
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 7.28: SINGULAR VALUE DECOMPOSITION
// ════════════════════════════════════════════════════════════════════════════

/** constrainedOptimizationOfQuadraticForms covers Rayleigh quotient and extrema on the unit sphere. */
export const constrainedOptimizationOfQuadraticForms: TopicDef = {
  id: "constrained-optimization-of-quadratic-forms",
  title: t("Constrained Optimization of Quadratic Forms", "二次型的条件极值"),
  summary: t(
    "Use eigenvalues to find the maximum and minimum of a quadratic form $\\mathbf{x}^T A \\mathbf{x}$ subject to $\\|\\mathbf{x}\\| = 1$.",
    "利用特征值求二次型 $\\mathbf{x}^T A \\mathbf{x}$ 在约束 $\\|\\mathbf{x}\\| = 1$ 下的最大值和最小值。",
  ),
  intro: t(
    "On the unit circle, $Q = 3x_1^2 + 4x_1x_2 + 3x_2^2$ has the matrix $A = \\begin{pmatrix} 3 & 2 \\\\ 2 & 3 \\end{pmatrix}$ with eigenvalues $3 \\pm 2$. In principal axes $Q = y_1^2 + 5y_2^2$ with $y_1^2 + y_2^2 = 1$, a weighted average of $1$ and $5$, so the maximum is $5$ and the minimum is $1$.\n\nCheck: at the unit eigenvector $\\frac{1}{\\sqrt{2}}(1, 1)$, $Q = \\frac{3 + 4 + 3}{2} = 5$.\n\nIn this lesson we find the largest and smallest values of a quadratic form on the unit circle, and on a circle of any radius, from the eigenvalues of its matrix.",
    "在单位圆上，$Q = 3x_1^2 + 4x_1x_2 + 3x_2^2$ 的矩阵 $A = \\begin{pmatrix} 3 & 2 \\\\ 2 & 3 \\end{pmatrix}$ 的特征值为 $3 \\pm 2$。在主轴下 $Q = y_1^2 + 5y_2^2$，且 $y_1^2 + y_2^2 = 1$，它是 $1$ 与 $5$ 的加权平均，所以最大值为 $5$，最小值为 $1$。\n\n检验：在单位特征向量 $\\frac{1}{\\sqrt{2}}(1, 1)$ 处，$Q = \\frac{3 + 4 + 3}{2} = 5$。\n\n本课我们由矩阵的特征值求二次型在单位圆上以及任意半径的圆上的最大值与最小值。",
  ),
  prerequisites: ["classifying-quadratic-curves"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "constrained-extrema-unit-sphere",
      figure: linearAlgebraDrawings2["constrained-optimization-of-quadratic-forms#constrained-extrema-unit-sphere"],
      title: t("Maximum and Minimum on the Unit Sphere", "单位球面上的最大值与最小值"),
      explanation: t(
        "By the Rayleigh quotient theorem, for any real symmetric matrix $A$, the maximum value of $x^T A x$ subject to $\\|x\\| = 1$ is $\\lambda_{\\max}(A)$, and the minimum value is $\\lambda_{\\min}(A)$. For example, $Q = x_1^2 + 6x_1x_2 + x_2^2$ has the matrix $\\begin{pmatrix} 1 & 3 \\\\ 3 & 1 \\end{pmatrix}$ with eigenvalues $1 \\pm 3$, so on the unit circle its maximum is $4$ and its minimum is $-2$.\n\n> **Watch out.** The extremes are eigenvalues, not entries: the diagonal entry is only the value at $\\mathbf{e}_1$, and the cross coefficient $2k$ is twice the matrix entry $k$.",
        "根据瑞利商定理，对于实对称矩阵 $A$，在 $\\|x\\| = 1$ 的约束下，$x^T A x$ 的最大值为最大特征值 $\\lambda_{\\max}(A)$，最小值为最小特征值 $\\lambda_{\\min}(A)$。例如 $Q = x_1^2 + 6x_1x_2 + x_2^2$ 的矩阵 $\\begin{pmatrix} 1 & 3 \\\\ 3 & 1 \\end{pmatrix}$ 的特征值为 $1 \\pm 3$，所以它在单位圆上的最大值为 $4$，最小值为 $-2$。\n\n> **注意。** 最值是特征值，而不是矩阵元素：对角元只是 $\\mathbf{e}_1$ 处的值，交叉项系数 $2k$ 是矩阵元素 $k$ 的两倍。",
      ),
      generate: (rng: Rng): Problem => {
        const m = rng.int(-5, 6);
        const k = rng.int(1, 6);
        const findMax = rng.bool();
        const lMax = m + k;
        const lMin = m - k;
        const targetValue = findMax ? lMax : lMin;
        const extremaWordEn = findMax ? "maximum" : "minimum";
        const extremaWordZh = findMax ? "最大值" : "最小值";
        const qStr = formatQuadratic(m, 2 * k, m);

        const prompt = t(
          `Find the ${extremaWordEn} value of the quadratic form $Q(x) = ${qStr}$ subject to the constraint $x_1^2 + x_2^2 = 1$.`,
          `求二次型 $Q(x) = ${qStr}$ 在约束条件 $x_1^2 + x_2^2 = 1$ 下的${extremaWordZh}。`,
        );

        return numberProblem({
          prompt,
          answer: targetValue,
          solution: walked(
            [
              [
                ["Write the matrix", "写出矩阵"],
                t(`Half of $${2 * k}$ goes off the diagonal:`, `$${2 * k}$ 的一半放在非对角位置：`),
                [
                  `A = ${mat2Latex([
                    [m, k],
                    [k, m],
                  ])}`,
                ],
              ],
              [["Find the eigenvalues", "求特征值"], t("", ""), [`\\lambda = ${m} \\pm ${k} = ${lMin}, ${lMax}`]],
              [
                [findMax ? "Take the largest" : "Take the smallest", findMax ? "取最大的" : "取最小的"],
                t(
                  `On the unit circle the ${extremaWordEn} of $Q$ is the ${findMax ? "largest" : "smallest"} eigenvalue, $${targetValue}$.`,
                  `在单位圆上 $Q$ 的${extremaWordZh}是${findMax ? "最大" : "最小"}特征值 $${targetValue}$。`,
                ),
              ],
            ],
            t(
              `At the unit vector $\\frac{1}{\\sqrt{2}}(1, ${findMax ? 1 : -1})$, $Q = \\frac{${m} ${findMax ? "+" : "-"} ${2 * k} + ${paren(m)}}{2} = ${targetValue}$.`,
              `在单位向量 $\\frac{1}{\\sqrt{2}}(1, ${findMax ? 1 : -1})$ 处，$Q = \\frac{${m} ${findMax ? "+" : "-"} ${2 * k} + ${paren(m)}}{2} = ${targetValue}$。`,
            ),
          ),
          wrong: [findMax ? lMin : lMax, m, 2 * k],
          mistakes: distinct(
            [
              why(
                findMax ? lMin : lMax,
                `That is the ${findMax ? "smallest" : "largest"} eigenvalue, which gives the ${findMax ? "minimum" : "maximum"}.`,
                `这是${findMax ? "最小" : "最大"}特征值，给出的是${findMax ? "最小值" : "最大值"}。`,
              ),
              why(
                m,
                `$${m}$ is only the value at $(1, 0)$; the extreme is an eigenvalue of $A$.`,
                `$${m}$ 只是 $(1, 0)$ 处的值；最值是 $A$ 的特征值。`,
              ),
              why(2 * k, `$${2 * k}$ is the cross coefficient, not an eigenvalue.`, `$${2 * k}$ 是交叉项系数，不是特征值。`),
            ],
            targetValue,
          ),
        });
      },
    },
    {
      id: "extrema-of-a-quadratic-form-on-a-circle-of-radius-r",
      figure: linearAlgebraDrawings2["constrained-optimization-of-quadratic-forms#extrema-of-a-quadratic-form-on-a-circle-of-radius-r"],
      title: t("Extrema of a quadratic form on a circle of radius $r$", "二次型在半径为 $r$ 的圆上的最值"),
      explanation: t(
        "On the unit circle the maximum and minimum of $Q(\\mathbf{x}) = \\mathbf{x}^T A\\mathbf{x}$ are the largest and smallest eigenvalues of $A$. A quadratic form is homogeneous of degree 2, so $Q(r\\mathbf{u}) = r^2Q(\\mathbf{u})$. On the circle $\\|\\mathbf{x}\\| = r$ the extremes are therefore $r^2\\lambda_{\\max}$ and $r^2\\lambda_{\\min}$. For example, if the eigenvalues are $-1$ and $3$, then on $x_1^2 + x_2^2 = 4$ the maximum is $4 \\cdot 3 = 12$ and the minimum is $4 \\cdot (-1) = -4$.\n\n> **Watch out.** The constraint $x_1^2 + x_2^2 = c$ gives the radius $r = \\sqrt{c}$, so the factor is $r^2 = c$, not $r$.",
        "在单位圆上，$Q(\\mathbf{x}) = \\mathbf{x}^T A\\mathbf{x}$ 的最大值与最小值是 $A$ 的最大与最小特征值。二次型是 2 次齐次的，所以 $Q(r\\mathbf{u}) = r^2Q(\\mathbf{u})$。因此在圆 $\\|\\mathbf{x}\\| = r$ 上，最值为 $r^2\\lambda_{\\max}$ 与 $r^2\\lambda_{\\min}$。例如特征值为 $-1$ 和 $3$ 时，在 $x_1^2 + x_2^2 = 4$ 上最大值为 $4 \\cdot 3 = 12$，最小值为 $4 \\cdot (-1) = -4$。\n\n> **注意。** 约束 $x_1^2 + x_2^2 = c$ 给出半径 $r = \\sqrt{c}$，所以因子是 $r^2 = c$，而不是 $r$。",
      ),
      generate(rng: Rng): Problem {
        const [l1, l2, k] = pickEigenPair(rng, -4, 6);
        const A = symFromEigen(l1, l2, k);
        const r = rng.int(2, 4);
        const findMax = rng.int(0, 1) === 0;
        const lam = findMax ? Math.max(l1, l2) : Math.min(l1, l2);
        const other = findMax ? Math.min(l1, l2) : Math.max(l1, l2);
        const ans = r * r * lam;
        return numberProblem({
          prompt: t(
            `Find the ${findMax ? "maximum" : "minimum"} of $Q = ${formatQuadratic(A[0][0], 2 * A[0][1], A[1][1])}$ subject to $x_1^2 + x_2^2 = ${r * r}$.`,
            `在 $x_1^2 + x_2^2 = ${r * r}$ 的约束下求 $Q = ${formatQuadratic(A[0][0], 2 * A[0][1], A[1][1])}$ 的${findMax ? "最大值" : "最小值"}。`,
          ),
          answer: ans,
          wrong: [lam, r * lam, r * r * other, other],
          mistakes: distinct(
            [
              why(
                lam,
                `$${lam}$ is the ${findMax ? "maximum" : "minimum"} on the unit circle; on radius $${r}$ multiply by $${r * r}$.`,
                `$${lam}$ 是单位圆上的${findMax ? "最大值" : "最小值"}；半径为 $${r}$ 时要乘以 $${r * r}$。`,
              ),
              why(
                r * lam,
                `That scales by $r = ${r}$; a quadratic form scales by $r^2 = ${r * r}$.`,
                `这是乘以 $r = ${r}$；二次型按 $r^2 = ${r * r}$ 缩放。`,
              ),
              why(
                r * r * other,
                `That uses the ${findMax ? "smallest" : "largest"} eigenvalue $${other}$, which gives the ${findMax ? "minimum" : "maximum"}.`,
                `这用了${findMax ? "最小" : "最大"}特征值 $${other}$，给出的是${findMax ? "最小值" : "最大值"}。`,
              ),
              why(
                r * r * A[0][0],
                `That is $Q(${r}, 0)$, the value on the $x_1$-axis; the ${findMax ? "maximum" : "minimum"} is reached along an eigenvector.`,
                `这是 $Q(${r}, 0)$，即 $x_1$ 轴上的值；${findMax ? "最大值" : "最小值"}在特征向量方向取到。`,
              ),
            ],
            ans,
          ),
          solution: walked(
            [
              [
                ["Find the eigenvalues", "求特征值"],
                t(
                  `The matrix $${mat2Latex(A)}$ has trace $${l1 + l2}$ and determinant $${l1 * l2}$, so its eigenvalues are`,
                  `矩阵 $${mat2Latex(A)}$ 的迹为 $${l1 + l2}$，行列式为 $${l1 * l2}$，所以特征值为`,
                ),
                [`\\lambda = ${Math.min(l1, l2)}, ${Math.max(l1, l2)}`],
              ],
              [
                ["Scale to the circle", "缩放到圆上"],
                t(
                  `The circle has radius $${r}$, and $Q(r\\mathbf{u}) = r^2Q(\\mathbf{u})$:`,
                  `圆的半径为 $${r}$，且 $Q(r\\mathbf{u}) = r^2Q(\\mathbf{u})$：`,
                ),
                [`${r * r} \\cdot ${paren(lam)} = ${ans}`],
              ],
            ],
            t(
              `$\\lambda^2 - ${paren(l1 + l2)}\\lambda + ${paren(l1 * l2)}$ vanishes at $\\lambda = ${lam}$: $${lam * lam} - ${paren((l1 + l2) * lam)} + ${paren(l1 * l2)} = 0$.`,
              `$\\lambda^2 - ${paren(l1 + l2)}\\lambda + ${paren(l1 * l2)}$ 在 $\\lambda = ${lam}$ 处为零：$${lam * lam} - ${paren((l1 + l2) * lam)} + ${paren(l1 * l2)} = 0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** constrainedOptimizationOfQuadraticFormsDeterminingWhereExtremaAreAttained covers finding unit eigenvectors where extrema occur. */
export const constrainedOptimizationOfQuadraticFormsDeterminingWhereExtremaAreAttained: TopicDef = {
  id: "constrained-optimization-of-quadratic-forms-determining-where-extrema-are-attained",
  title: t("Constrained Optimization of Quadratic Forms: Determining Where Extrema are Attained", "二次型条件极值：确定取极值的位置"),
  summary: t(
    "Determine the unit eigenvectors at which constrained extrema of a quadratic form are attained.",
    "确定二次型在单位约束下达到极大值或极小值的单位特征向量。",
  ),
  intro: t(
    "The form $Q = 3x_1^2 + 4x_1x_2 + 3x_2^2$ has $A = \\begin{pmatrix} 3 & 2 \\\\ 2 & 3 \\end{pmatrix}$, with $A(1, 1) = 5(1, 1)$ and $A(1, -1) = 1(1, -1)$. On the unit circle its maximum $5$ is attained at $\\pm\\frac{1}{\\sqrt{2}}(1, 1)$ and its minimum $1$ at $\\pm\\frac{1}{\\sqrt{2}}(1, -1)$.\n\nCheck: at $\\frac{1}{\\sqrt{2}}(1, 1)$, $Q = \\frac{3 + 4 + 3}{2} = 5$, while at $(1, 0)$, $Q = 3$ lies in between.\n\nIn this lesson we find the unit vectors at which a quadratic form attains its constrained maximum and minimum, and count how many there are.",
    "二次型 $Q = 3x_1^2 + 4x_1x_2 + 3x_2^2$ 的矩阵为 $A = \\begin{pmatrix} 3 & 2 \\\\ 2 & 3 \\end{pmatrix}$，$A(1, 1) = 5(1, 1)$，$A(1, -1) = 1(1, -1)$。在单位圆上，它的最大值 $5$ 在 $\\pm\\frac{1}{\\sqrt{2}}(1, 1)$ 处取得，最小值 $1$ 在 $\\pm\\frac{1}{\\sqrt{2}}(1, -1)$ 处取得。\n\n检验：在 $\\frac{1}{\\sqrt{2}}(1, 1)$ 处 $Q = \\frac{3 + 4 + 3}{2} = 5$，而在 $(1, 0)$ 处 $Q = 3$，介于两者之间。\n\n本课我们求二次型在单位约束下取得最大值和最小值的单位向量，并数出有多少个。",
  ),
  prerequisites: ["constrained-optimization-of-quadratic-forms"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "where-extrema-are-attained",
      figure:
        linearAlgebraDrawings2[
          "constrained-optimization-of-quadratic-forms-determining-where-extrema-are-attained#where-extrema-are-attained"
        ],
      title: t("Unit Vectors for Constrained Extrema", "取条件极值的单位向量"),
      explanation: t(
        "On the unit sphere the quadratic form is largest in the direction of the eigenvector for the largest eigenvalue and smallest for the smallest one. The maximum (minimum) of $x^T A x$ subject to $\\|x\\| = 1$ is attained at normalized eigenvectors corresponding to $\\lambda_{\\max}$ (respectively $\\lambda_{\\min}$). For example, $Q = x_1^2 + 6x_1x_2 + x_2^2$ has $A(1, 1) = 4(1, 1)$ and $A(1, -1) = -2(1, -1)$, so its minimum $-2$ is attained at $\\pm\\frac{1}{\\sqrt{2}}(1, -1)$: there $Q = \\frac{1 - 6 + 1}{2} = -2$.\n\n> **Watch out.** The extremes sit on the eigenvectors, not on the coordinate axes: at $(1, 0)$ the form only gives $a_{11}$. Match each eigenvector to its own eigenvalue before choosing; for $\\begin{pmatrix} m & k \\\\ k & m \\end{pmatrix}$ with $k > 0$, the larger eigenvalue $m + k$ belongs to $(1, 1)$.",
        "在单位球面上，二次型在最大特征值对应的特征向量方向上最大，在最小特征值对应的方向上最小。二次型 $x^T A x$ 在 $\\|x\\| = 1$ 约束下的最大值（或最小值）在对应于最大特征值 $\\lambda_{\\max}$（或最小特征值 $\\lambda_{\\min}$）的单位特征向量处取得。例如 $Q = x_1^2 + 6x_1x_2 + x_2^2$ 有 $A(1, 1) = 4(1, 1)$，$A(1, -1) = -2(1, -1)$，所以它的最小值 $-2$ 在 $\\pm\\frac{1}{\\sqrt{2}}(1, -1)$ 处取得：那里 $Q = \\frac{1 - 6 + 1}{2} = -2$。\n\n> **注意。** 极值在特征向量上取得，而不在坐标轴上：在 $(1, 0)$ 处二次型只给出 $a_{11}$。先把每个特征向量与它自己的特征值对应好再选；对 $\\begin{pmatrix} m & k \\\\ k & m \\end{pmatrix}$，$k > 0$ 时较大的特征值 $m + k$ 属于 $(1, 1)$。",
      ),
      generate: (rng: Rng): Problem => {
        const m = rng.int(-4, 5);
        const k = rng.int(1, 5);
        const findMax = rng.bool();
        const qStr = formatQuadratic(m, 2 * k, m);

        const prompt = t(
          `At which of the following unit vectors does $Q(x) = ${qStr}$ attain its ${findMax ? "maximum" : "minimum"} subject to $\\|x\\| = 1$?`,
          `在约束 $\\|x\\| = 1$ 下，二次型 $Q(x) = ${qStr}$ 在下列哪个单位向量处取得${findMax ? "最大值" : "最小值"}？`,
        );

        const rightVec: Vec2 = findMax ? [1, 1] : [1, -1];
        const right = t(`$\\frac{1}{\\sqrt{2}} ${vec2Latex(rightVec)}$`, `$\\frac{1}{\\sqrt{2}} ${vec2Latex(rightVec)}$`);

        const wrongVec: Vec2 = findMax ? [1, -1] : [1, 1];
        const wrong = [
          t(`$\\frac{1}{\\sqrt{2}} ${vec2Latex(wrongVec)}$`, `$\\frac{1}{\\sqrt{2}} ${vec2Latex(wrongVec)}$`),
          t(`$${vec2Latex([1, 0])}$`, `$${vec2Latex([1, 0])}$`),
          t(`$${vec2Latex([0, 1])}$`, `$${vec2Latex([0, 1])}$`),
          t(`$\\frac{1}{\\sqrt{5}} ${vec2Latex([1, 2])}$`, `$\\frac{1}{\\sqrt{5}} ${vec2Latex([1, 2])}$`),
        ];

        const value = findMax ? m + k : m - k;
        // A scalar in front of a vector: none for 1, a bare minus for −1, parentheses for other negatives.
        const scale = (s: number) => (s === 1 ? "" : s === -1 ? "-" : paren(s));
        const solution = walked(
          [
            [
              ["Write the matrix", "写出矩阵"],
              t(`Half of the cross coefficient $${2 * k}$ goes off the diagonal:`, `交叉项系数 $${2 * k}$ 的一半放在非对角位置：`),
              [
                `A = ${mat2Latex([
                  [m, k],
                  [k, m],
                ])}`,
              ],
            ],
            [
              ["Pair each eigenvector with its eigenvalue", "把特征向量与特征值配对"],
              t("", ""),
              [
                `A${vec2Latex([1, 1])} = ${scale(m + k)}${vec2Latex([1, 1])}`,
                `A${vec2Latex([1, -1])} = ${scale(m - k)}${vec2Latex([1, -1])}`,
              ],
            ],
            [
              [findMax ? "Take the larger eigenvalue" : "Take the smaller eigenvalue", findMax ? "取较大的特征值" : "取较小的特征值"],
              t(
                `The ${findMax ? "maximum" : "minimum"} is $${value}$, attained at the unit eigenvectors $\\pm\\frac{1}{\\sqrt{2}}(1, ${rightVec[1]})$.`,
                `${findMax ? "最大值" : "最小值"}是 $${value}$，在单位特征向量 $\\pm\\frac{1}{\\sqrt{2}}(1, ${rightVec[1]})$ 处取得。`,
              ),
            ],
          ],
          t(
            `At $\\frac{1}{\\sqrt{2}}(1, ${rightVec[1]})$, $Q = \\frac{${m} ${findMax ? "+" : "-"} ${2 * k} + ${paren(m)}}{2} = ${value}$.`,
            `在 $\\frac{1}{\\sqrt{2}}(1, ${rightVec[1]})$ 处，$Q = \\frac{${m} ${findMax ? "+" : "-"} ${2 * k} + ${paren(m)}}{2} = ${value}$。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `This is the eigenvector of the other eigenvalue, $${findMax ? m - k : m + k}$, so it gives the ${findMax ? "minimum" : "maximum"}.`,
            `这是另一个特征值 $${findMax ? m - k : m + k}$ 的特征向量，所以它给出${findMax ? "最小值" : "最大值"}。`,
          ],
          [
            wrong[1]!.en,
            `At $\\mathbf{e}_1$ the form is $a_{11} = ${m}$, strictly between the minimum $${m - k}$ and the maximum $${m + k}$: $\\mathbf{e}_1$ is not an eigenvector.`,
            `在 $\\mathbf{e}_1$ 处二次型等于 $a_{11} = ${m}$，严格介于最小值 $${m - k}$ 和最大值 $${m + k}$ 之间：$\\mathbf{e}_1$ 不是特征向量。`,
          ],
          [
            wrong[2]!.en,
            `At $\\mathbf{e}_2$ the form is $a_{22} = ${m}$, the same middle value; the cross term $${2 * k}x_1x_2$ vanishes on the axes, so they miss the extremes.`,
            `在 $\\mathbf{e}_2$ 处二次型等于 $a_{22} = ${m}$，同样是中间值；交叉项 $${2 * k}x_1x_2$ 在坐标轴上为零，所以坐标轴上取不到极值。`,
          ],
          [
            wrong[3]!.en,
            `Here $Q = \\frac{${m} + ${4 * k} + ${paren(4 * m)}}{5} = ${Q.of(5 * m + 4 * k, 5).toLatex()}$, between the extremes: $(1, 2)$ is not an eigenvector of $A$.`,
            `这里 $Q = \\frac{${m} + ${4 * k} + ${paren(4 * m)}}{5} = ${Q.of(5 * m + 4 * k, 5).toLatex()}$，介于两个极值之间：$(1, 2)$ 不是 $A$ 的特征向量。`,
          ],
        ]);
      },
    },
    {
      id: "where-a-diagonal-form-in-three-variables-is-extreme",
      figure:
        linearAlgebraDrawings2[
          "constrained-optimization-of-quadratic-forms-determining-where-extrema-are-attained#where-a-diagonal-form-in-three-variables-is-extreme"
        ],
      title: t("Where a diagonal form in three variables is extreme", "三元对角二次型在何处取最值"),
      explanation: t(
        "For a diagonal form $Q = d_1x_1^2 + d_2x_2^2 + d_3x_3^2$ on the unit sphere, $Q$ is a weighted average of the $d_i$ with weights $x_i^2$ that sum to $1$. It is largest when all the weight sits on the largest coefficient, that is, at $\\pm\\mathbf{e}_i$ for that $i$, and smallest at $\\pm\\mathbf{e}_j$ for the smallest coefficient. Any vector that spreads the weight gives a value in between. For example, $Q = -2x_1^2 + x_2^2 + 5x_3^2$ has its maximum $5$ at $\\pm\\mathbf{e}_3$ and its minimum $-2$ at $\\pm\\mathbf{e}_1$, while $\\frac{1}{\\sqrt{3}}(1, 1, 1)$ gives only the average $\\frac{-2 + 1 + 5}{3} = \\frac{4}{3}$.\n\n> **Watch out.** Compare the coefficients with their signs: the minimum belongs to the most negative one, not to the one nearest $0$. Spreading the weight evenly gives the average, never an extreme.",
        "对单位球面上的对角二次型 $Q = d_1x_1^2 + d_2x_2^2 + d_3x_3^2$，$Q$ 是各 $d_i$ 以 $x_i^2$ 为权（和为 $1$）的加权平均。当全部权重落在最大系数上，即在该 $i$ 的 $\\pm\\mathbf{e}_i$ 处，$Q$ 最大；在最小系数的 $\\pm\\mathbf{e}_j$ 处最小。任何分散权重的向量给出介于其间的值。例如 $Q = -2x_1^2 + x_2^2 + 5x_3^2$ 的最大值 $5$ 在 $\\pm\\mathbf{e}_3$ 处取得，最小值 $-2$ 在 $\\pm\\mathbf{e}_1$ 处取得，而 $\\frac{1}{\\sqrt{3}}(1, 1, 1)$ 只给出平均值 $\\frac{-2 + 1 + 5}{3} = \\frac{4}{3}$。\n\n> **注意。** 比较系数时要带着符号：最小值属于最负的系数，而不是最接近 $0$ 的那个。把权重平均分开只得到平均值，永远不是极值。",
      ),
      generate(rng: Rng): Problem {
        const d = rng.shuffle([rng.int(-6, -1), rng.int(0, 3), rng.int(4, 9)]);
        const findMax = rng.int(0, 1) === 0;
        const target = findMax ? d.indexOf(Math.max(...d)) : d.indexOf(Math.min(...d));
        const e = (i: number) => `\\mathbf{e}_{${i + 1}}`;
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        const others = [0, 1, 2].filter((i) => i !== target).map((i) => opt(e(i)));
        const q = `${formatFirstTerm(d[0]!, "x_1^2")} ${formatSignedTerm(d[1]!, "x_2^2")} ${formatSignedTerm(d[2]!, "x_3^2")}`.replace(
          /\s+/g,
          " ",
        );
        const otherIdx = [0, 1, 2].filter((i) => i !== target);
        const wrongOpts = [
          ...others.map((o) => t(`$\\pm${o.en.slice(1)}`, `$\\pm${o["zh-CN"].slice(1)}`)),
          opt("\\frac{1}{\\sqrt{3}}(1, 1, 1)"),
        ];
        const sum = d[0]! + d[1]! + d[2]!;
        const average = Q.of(sum, 3).toLatex();
        const ranked = [...d].sort((x, y) => x - y);
        const solution = walked(
          [
            [
              ["Read Q as a weighted average", "把 Q 看作加权平均"],
              t(
                "On the unit sphere the weights $x_1^2, x_2^2, x_3^2$ are nonnegative and add to $1$:",
                "在单位球面上，权重 $x_1^2, x_2^2, x_3^2$ 非负且和为 $1$：",
              ),
              [`Q = ${q}, \\quad x_1^2 + x_2^2 + x_3^2 = 1`],
            ],
            [
              [
                findMax ? "Put all the weight on the largest coefficient" : "Put all the weight on the smallest coefficient",
                findMax ? "把全部权重放在最大系数上" : "把全部权重放在最小系数上",
              ],
              t(
                `Ordered, the coefficients are $${ranked.join(" < ")}$. The ${findMax ? "largest" : "smallest"} is $${d[target]}$, on $x_{${target + 1}}^2$, so the ${findMax ? "maximum" : "minimum"} $${d[target]}$ is attained at $\\pm${e(target)}$.`,
                `按大小排列，系数为 $${ranked.join(" < ")}$。${findMax ? "最大" : "最小"}的是 $x_{${target + 1}}^2$ 的 $${d[target]}$，所以${findMax ? "最大值" : "最小值"} $${d[target]}$ 在 $\\pm${e(target)}$ 处取得。`,
              ),
            ],
          ],
          t(
            `At $${e(target)}$, $Q = ${d[target]}$, while the other axes give $${d[otherIdx[0]!]}$ and $${d[otherIdx[1]!]}$ and $\\frac{1}{\\sqrt{3}}(1, 1, 1)$ gives $${average}$, all ${findMax ? "smaller" : "larger"}.`,
            `在 $${e(target)}$ 处 $Q = ${d[target]}$，而另两个坐标轴给出 $${d[otherIdx[0]!]}$ 和 $${d[otherIdx[1]!]}$，$\\frac{1}{\\sqrt{3}}(1, 1, 1)$ 给出 $${average}$，都${findMax ? "更小" : "更大"}。`,
          ),
        );
        return reasoned(
          oneOf(
            rng,
            t(
              `On the unit sphere, where does $Q = ${q}$ attain its ${findMax ? "maximum" : "minimum"}?`,
              `在单位球面上，$Q = ${q}$ 在何处取得${findMax ? "最大值" : "最小值"}？`,
            ),
            opt(`\\pm${e(target)}`),
            wrongOpts,
            solution,
          ),
          [
            ...otherIdx.map((i, n): readonly [string, string, string] => [
              wrongOpts[n]!.en,
              `At $\\pm${e(i)}$, $Q = ${d[i]}$, the coefficient of $x_{${i + 1}}^2$; $${d[target]}$ is ${findMax ? "larger" : "smaller"}.`,
              `在 $\\pm${e(i)}$ 处 $Q = ${d[i]}$，即 $x_{${i + 1}}^2$ 的系数；$${d[target]}$ ${findMax ? "更大" : "更小"}。`,
            ]),
            [
              wrongOpts[2]!.en,
              `Equal weights give the average of the coefficients, $${average}$, which lies strictly between the extremes.`,
              `平均分配权重得到系数的平均值 $${average}$，它严格介于两个极值之间。`,
            ],
          ],
        );
      },
    },
  ],
};

/** singularValuesOfAMatrix covers definitions and fundamental properties of singular values. */
export const singularValuesOfAMatrix: TopicDef = {
  id: "singular-values-of-a-matrix",
  title: t("The Singular Values of a Matrix", "矩阵的奇异值"),
  summary: t(
    "Define the singular values of an $m \\times n$ matrix as the square roots of the eigenvalues of $A^T A$, and examine their key properties.",
    "将 $m \\times n$ 矩阵的奇异值定义为 $A^T A$ 特征值的平方根，并掌握其关键性质。",
  ),
  intro: t(
    "The matrix $A = \\begin{pmatrix} 3 & -8 \\\\ 4 & 6 \\end{pmatrix}$ has orthogonal columns of lengths $5$ and $10$, so $A^TA = \\begin{pmatrix} 25 & 0 \\\\ 0 & 100 \\end{pmatrix}$. Its singular values are the square roots of these eigenvalues: $\\sigma_1 = 10$ and $\\sigma_2 = 5$.\n\nCheck: $|\\det A| = |18 + 32| = 50 = \\sigma_1\\sigma_2$, as it must be.\n\nIn this lesson we define the singular values of a matrix through $A^TA$, count the positive ones from the rank, and read the largest stretch and $|\\det A|$ from them.",
    "矩阵 $A = \\begin{pmatrix} 3 & -8 \\\\ 4 & 6 \\end{pmatrix}$ 的两列正交，长度分别为 $5$ 和 $10$，所以 $A^TA = \\begin{pmatrix} 25 & 0 \\\\ 0 & 100 \\end{pmatrix}$。它的奇异值是这两个特征值的平方根：$\\sigma_1 = 10$，$\\sigma_2 = 5$。\n\n检验：$|\\det A| = |18 + 32| = 50 = \\sigma_1\\sigma_2$，理应如此。\n\n本课我们通过 $A^TA$ 定义矩阵的奇异值，由秩数出正奇异值的个数，并由奇异值读出最大伸缩和 $|\\det A|$。",
  ),
  prerequisites: ["constrained-optimization-of-quadratic-forms-determining-where-extrema-are-attained"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "singular-values-definition-properties",
      title: t("Definition and Properties of Singular Values", "奇异值的定义与性质"),
      explanation: t(
        "For any $m \\times n$ real matrix $A$, the singular values $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge \\sigma_n \\ge 0$ are the square roots of the eigenvalues of the positive semidefinite matrix $A^T A$: $\\sigma_i = \\sqrt{\\lambda_i(A^T A)}$. The number of non-zero singular values equals the rank of $A$. For example, a $4 \\times 3$ matrix of rank $2$ has three singular values $\\sigma_1 \\ge \\sigma_2 > 0 = \\sigma_3$, so exactly two of them are positive.\n\n> **Watch out.** Count the positive singular values by the rank, not by the number of rows $m$ or columns $n$: there are $n$ singular values in all, and the other $n - \\operatorname{rank}(A)$ of them are $0$.",
        "对于任意 $m \\times n$ 实矩阵 $A$，其奇异值 $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge \\sigma_n \\ge 0$ 定义为半正定矩阵 $A^T A$ 的特征值的算术平方根：$\\sigma_i = \\sqrt{\\lambda_i(A^T A)}$。非零奇异值的个数等于矩阵 $A$ 的秩。例如秩为 $2$ 的 $4 \\times 3$ 矩阵有三个奇异值 $\\sigma_1 \\ge \\sigma_2 > 0 = \\sigma_3$，所以恰好两个是正的。\n\n> **注意。** 正奇异值的个数由秩决定，而不是行数 $m$ 或列数 $n$：奇异值共有 $n$ 个，其余 $n - \\operatorname{rank}(A)$ 个都是 $0$。",
      ),
      generate: (rng: Rng): Problem => {
        const n = rng.int(3, 9);
        const rows = rng.int(3, 9);
        // A non-square matrix of less than full rank, so that neither m, n nor min(m, n) is the answer.
        const m = rows === n ? n + 1 : rows;
        const rank = rng.int(1, Math.min(m, n) - 1);

        const prompt = t(
          `Let $A$ be ${article(m)} $${m} \\times ${n}$ real matrix with $\\operatorname{rank}(A) = ${rank}$. How many strictly positive singular values does $A$ have?`,
          `设 $A$ 为秩为 $${rank}$ 的 $${m} \\times ${n}$ 实矩阵。矩阵 $A$ 恰有多少个严格大于零的奇异值？`,
        );

        return numberProblem({
          prompt,
          answer: rank,
          solution: walked(
            [
              [
                ["Count all the singular values", "数出全部奇异值"],
                t(
                  `$A^TA$ is $${n} \\times ${n}$ and positive semidefinite, so it has $${n}$ eigenvalues $\\lambda_i \\ge 0$ and $A$ has $${n}$ singular values $\\sigma_i = \\sqrt{\\lambda_i}$.`,
                  `$A^TA$ 是 $${n} \\times ${n}$ 半正定矩阵，有 $${n}$ 个特征值 $\\lambda_i \\ge 0$，所以 $A$ 有 $${n}$ 个奇异值 $\\sigma_i = \\sqrt{\\lambda_i}$。`,
                ),
              ],
              [
                ["Count the positive ones", "数出正的"],
                t(
                  `$\\operatorname{rank}(A^TA) = \\operatorname{rank}(A) = ${rank}$, so exactly $${rank}$ of the eigenvalues, and of the singular values, are positive.`,
                  `$\\operatorname{rank}(A^TA) = \\operatorname{rank}(A) = ${rank}$，所以恰好 $${rank}$ 个特征值为正，奇异值也是如此。`,
                ),
              ],
            ],
            t(
              `The singular values that are left, $${n} - ${rank} = ${n - rank}$ of them, are $0$, and $${rank} + ${n - rank} = ${n}$ accounts for all of them.`,
              `其余 $${n} - ${rank} = ${n - rank}$ 个奇异值为 $0$，$${rank} + ${n - rank} = ${n}$ 正好是全部。`,
            ),
          ),
          wrong: [m, n, Math.min(m, n), n - rank],
          mistakes: distinct(
            [
              why(
                m,
                `$${m}$ is the number of rows; the positive singular values are counted by the rank.`,
                `$${m}$ 是行数；正奇异值的个数由秩决定。`,
              ),
              why(n, `$${n}$ counts all the singular values, the zero ones included.`, `$${n}$ 是全部奇异值的个数，连为 $0$ 的也算在内。`),
              why(
                Math.min(m, n),
                `$${Math.min(m, n)}$ is the largest rank a $${m} \\times ${n}$ matrix can have; this one has rank $${rank}$.`,
                `$${Math.min(m, n)}$ 是 $${m} \\times ${n}$ 矩阵可能的最大秩；这个矩阵的秩是 $${rank}$。`,
              ),
              why(
                n - rank,
                `$${n} - ${rank} = ${n - rank}$ counts the singular values that are $0$, not the positive ones.`,
                `$${n} - ${rank} = ${n - rank}$ 数的是为 $0$ 的奇异值，而不是正的。`,
              ),
            ],
            rank,
          ),
        });
      },
    },
    {
      id: "singular-values-from-the-eigenvalues-of-ata",
      title: t("Singular values from the eigenvalues of $A^TA$", "由 $A^TA$ 的特征值求奇异值"),
      explanation: t(
        "The singular values of $A$ are the square roots of the eigenvalues of $A^TA$, listed as $\\sigma_1 \\ge \\sigma_2 \\ge \\cdots \\ge 0$. They connect to familiar quantities: $\\sigma_1 = \\max_{\\|\\mathbf{x}\\| = 1}\\|A\\mathbf{x}\\|$, and for a square matrix $\\sigma_1\\sigma_2\\cdots\\sigma_n = |\\det A|$, because $\\det(A^TA) = (\\det A)^2$. For example, if $A^TA$ has eigenvalues $36$ and $4$, then $\\sigma_1 = 6$ and $\\sigma_2 = 2$, the longest stretch of a unit vector is $6$, and $|\\det A| = 12$.\n\n> **Watch out.** The eigenvalues of $A^TA$ are the squares $\\sigma_i^2$: take square roots before answering about $A$, and do not take them for $A^TA$ itself, whose determinant is $(\\sigma_1\\sigma_2)^2$.",
        "$A$ 的奇异值是 $A^TA$ 特征值的平方根，按 $\\sigma_1 \\ge \\sigma_2 \\ge \\cdots \\ge 0$ 排列。它们与熟悉的量相联系：$\\sigma_1 = \\max_{\\|\\mathbf{x}\\| = 1}\\|A\\mathbf{x}\\|$；对方阵有 $\\sigma_1\\sigma_2\\cdots\\sigma_n = |\\det A|$，因为 $\\det(A^TA) = (\\det A)^2$。例如 $A^TA$ 的特征值为 $36$ 和 $4$ 时，$\\sigma_1 = 6$，$\\sigma_2 = 2$，单位向量的最大伸缩是 $6$，$|\\det A| = 12$。\n\n> **注意。** $A^TA$ 的特征值是平方 $\\sigma_i^2$：回答关于 $A$ 的问题前要先开平方；而 $A^TA$ 本身的行列式是 $(\\sigma_1\\sigma_2)^2$，不要开方。",
      ),
      generate(rng: Rng): Problem {
        const s1 = rng.int(3, 9);
        const s2 = rng.int(1, s1 - 1);
        const kind = rng.int(0, 2);
        const e1 = s1 * s1;
        const e2 = s2 * s2;
        if (kind === 0) {
          return numberProblem({
            prompt: t(
              `For a $2 \\times 2$ matrix $A$, the eigenvalues of $A^TA$ are $${e1}$ and $${e2}$. Find the largest value of $\\|A\\mathbf{x}\\|$ over unit vectors $\\mathbf{x}$.`,
              `对 $2 \\times 2$ 矩阵 $A$，$A^TA$ 的特征值为 $${e1}$ 与 $${e2}$。求单位向量 $\\mathbf{x}$ 上 $\\|A\\mathbf{x}\\|$ 的最大值。`,
            ),
            answer: s1,
            wrong: [e1, s2, s1 + s2, e2],
            mistakes: [
              why(
                e1,
                `$${e1}$ is $\\sigma_1^2$, the largest value of $\\|A\\mathbf{x}\\|^2$; take its square root.`,
                `$${e1}$ 是 $\\sigma_1^2$，即 $\\|A\\mathbf{x}\\|^2$ 的最大值；要开平方。`,
              ),
              why(
                s2,
                `$${s2}$ is $\\sigma_2$, the smallest stretch of a unit vector, not the largest.`,
                `$${s2}$ 是 $\\sigma_2$，单位向量的最小伸缩，不是最大的。`,
              ),
              why(
                s1 + s2,
                "The singular values are not added: the longest stretch is $\\sigma_1$ alone, along its own right singular vector.",
                "奇异值不相加：最大伸缩只是 $\\sigma_1$，沿它自己的右奇异向量取到。",
              ),
            ],
            solution: walked(
              [
                [
                  ["Take square roots", "开平方"],
                  t("", ""),
                  [`\\sigma_1 = \\sqrt{${e1}} = ${s1}, \\quad \\sigma_2 = \\sqrt{${e2}} = ${s2}`],
                ],
                [
                  ["Use the largest", "取最大的"],
                  t(`The largest stretch of a unit vector is $\\sigma_1 = ${s1}$.`, `单位向量的最大伸缩是 $\\sigma_1 = ${s1}$。`),
                ],
              ],
              t(
                `$\\|A\\mathbf{x}\\|^2 = \\mathbf{x}^TA^TA\\mathbf{x}$, a quadratic form whose largest value on unit vectors is its largest eigenvalue $${e1}$, so $\\|A\\mathbf{x}\\| \\le \\sqrt{${e1}} = ${s1}$.`,
                `$\\|A\\mathbf{x}\\|^2 = \\mathbf{x}^TA^TA\\mathbf{x}$ 是一个二次型，它在单位向量上的最大值是最大特征值 $${e1}$，所以 $\\|A\\mathbf{x}\\| \\le \\sqrt{${e1}} = ${s1}$。`,
              ),
            ),
          });
        }
        if (kind === 1) {
          return numberProblem({
            prompt: t(
              `For a $2 \\times 2$ matrix $A$, the eigenvalues of $A^TA$ are $${e1}$ and $${e2}$. Find $|\\det A|$.`,
              `对 $2 \\times 2$ 矩阵 $A$，$A^TA$ 的特征值为 $${e1}$ 与 $${e2}$。求 $|\\det A|$。`,
            ),
            answer: s1 * s2,
            wrong: [e1 * e2, s1 + s2, e1 + e2],
            mistakes: [
              why(
                e1 * e2,
                `$${e1 * e2}$ is $\\det(A^TA) = (\\det A)^2$; its square root is $|\\det A|$.`,
                `$${e1 * e2}$ 是 $\\det(A^TA) = (\\det A)^2$；它的平方根才是 $|\\det A|$。`,
              ),
              why(s1 + s2, "The determinant multiplies the singular values; it does not add them.", "行列式是奇异值相乘，而不是相加。"),
              why(
                e1 + e2,
                `$${e1 + e2}$ is the trace of $A^TA$, the sum of the squared singular values.`,
                `$${e1 + e2}$ 是 $A^TA$ 的迹，即奇异值的平方和。`,
              ),
            ],
            solution: walked(
              [
                [
                  ["Take square roots", "开平方"],
                  t("", ""),
                  [`\\sigma_1 = \\sqrt{${e1}} = ${s1}, \\quad \\sigma_2 = \\sqrt{${e2}} = ${s2}`],
                ],
                [["Multiply them", "相乘"], t("", ""), [`|\\det A| = \\sigma_1\\sigma_2 = ${s1} \\cdot ${s2} = ${s1 * s2}`]],
              ],
              t(
                `$(\\det A)^2 = \\det(A^TA) = ${e1} \\cdot ${e2} = ${e1 * e2} = ${s1 * s2}^2$.`,
                `$(\\det A)^2 = \\det(A^TA) = ${e1} \\cdot ${e2} = ${e1 * e2} = ${s1 * s2}^2$。`,
              ),
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A $2 \\times 2$ matrix $A$ has singular values $${s1}$ and $${s2}$. Find $\\det(A^TA)$.`,
            `$2 \\times 2$ 矩阵 $A$ 的奇异值为 $${s1}$ 与 $${s2}$。求 $\\det(A^TA)$。`,
          ),
          answer: e1 * e2,
          wrong: [s1 * s2, e1 + e2, e1],
          mistakes: distinct(
            [
              why(
                s1 * s2,
                `$${s1 * s2}$ is $|\\det A|$; $\\det(A^TA) = (\\det A)^2$ squares it.`,
                `$${s1 * s2}$ 是 $|\\det A|$；$\\det(A^TA) = (\\det A)^2$ 还要平方。`,
              ),
              why(
                e1 + e2,
                `$${e1 + e2}$ is the trace of $A^TA$; the determinant multiplies the eigenvalues $${e1}$ and $${e2}$.`,
                `$${e1 + e2}$ 是 $A^TA$ 的迹；行列式是特征值 $${e1}$ 与 $${e2}$ 相乘。`,
              ),
              why(
                e1,
                `$${e1}$ is only $\\sigma_1^2$; the determinant also multiplies by $\\sigma_2^2 = ${e2}$.`,
                `$${e1}$ 只是 $\\sigma_1^2$；行列式还要乘以 $\\sigma_2^2 = ${e2}$。`,
              ),
            ],
            e1 * e2,
          ),
          solution: walked(
            [
              [
                ["Square the singular values", "把奇异值平方"],
                t("The eigenvalues of $A^TA$ are the squares of the singular values:", "$A^TA$ 的特征值是奇异值的平方："),
                [`\\sigma_1^2 = ${e1}, \\quad \\sigma_2^2 = ${e2}`],
              ],
              [["Multiply the eigenvalues", "特征值相乘"], t("", ""), [`\\det(A^TA) = ${e1} \\cdot ${e2} = ${e1 * e2}`]],
            ],
            t(
              `$|\\det A| = \\sigma_1\\sigma_2 = ${s1 * s2}$, and $\\det(A^TA) = (\\det A)^2 = ${s1 * s2}^2 = ${e1 * e2}$.`,
              `$|\\det A| = \\sigma_1\\sigma_2 = ${s1 * s2}$，而 $\\det(A^TA) = (\\det A)^2 = ${s1 * s2}^2 = ${e1 * e2}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** computingTheSingularValuesOfAMatrix covers explicit computation of singular values. */
export const computingTheSingularValuesOfAMatrix: TopicDef = {
  id: "computing-the-singular-values-of-a-matrix",
  title: t("Computing the Singular Values of a Matrix", "计算矩阵的奇异值"),
  summary: t(
    "Compute the singular values of $2 \\times 2$ and rectangular matrices from the eigenvalues of $A^T A$.",
    "通过求 $A^T A$ 的特征值来计算 $2 \\times 2$ 矩阵及矩形矩阵的奇异值。",
  ),
  intro: t(
    "For $A = \\begin{pmatrix} 3 & 4 \\\\ 0 & 0 \\end{pmatrix}$, $A^TA = \\begin{pmatrix} 9 & 12 \\\\ 12 & 16 \\end{pmatrix}$, with trace $25$ and determinant $144 - 144 = 0$. Its eigenvalues are $25$ and $0$, so the singular values of $A$ are $\\sigma_1 = 5$ and $\\sigma_2 = 0$.\n\nCheck: $A$ sends $\\frac{1}{5}(3, 4)$ to $(5, 0)$, a stretch by $5$, and sends $(-4, 3)$ to $\\mathbf{0}$.\n\nIn this lesson we compute singular values from the eigenvalues of $A^TA$, for rotations, rank-one matrices and others, and use them to find the condition number.",
    "对 $A = \\begin{pmatrix} 3 & 4 \\\\ 0 & 0 \\end{pmatrix}$，$A^TA = \\begin{pmatrix} 9 & 12 \\\\ 12 & 16 \\end{pmatrix}$，迹为 $25$，行列式为 $144 - 144 = 0$。它的特征值是 $25$ 和 $0$，所以 $A$ 的奇异值是 $\\sigma_1 = 5$，$\\sigma_2 = 0$。\n\n检验：$A$ 把 $\\frac{1}{5}(3, 4)$ 映到 $(5, 0)$，伸长为 $5$ 倍，并把 $(-4, 3)$ 映到 $\\mathbf{0}$。\n\n本课我们由 $A^TA$ 的特征值计算奇异值，包括旋转、秩一矩阵等情形，并用它们求条件数。",
  ),
  prerequisites: ["singular-values-of-a-matrix"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "compute-singular-values",
      title: t("Computing Singular Values from A^T A", "由 A^T A 计算奇异值"),
      explanation: t(
        "To find the singular values of $A$, compute the $n \\times n$ symmetric matrix $A^T A$, find its eigenvalues $\\lambda_1 \\ge \\lambda_2 \\ge \\dots \\ge 0$, and take the positive square roots $\\sigma_i = \\sqrt{\\lambda_i}$. For example, $A = \\begin{pmatrix} 6 & -4 \\\\ 8 & 3 \\end{pmatrix}$ has $A^TA = \\begin{pmatrix} 100 & 0 \\\\ 0 & 25 \\end{pmatrix}$, so $\\sigma_1 = 10$ and $\\sigma_2 = 5$.\n\n> **Watch out.** Take square roots of the eigenvalues of $A^TA$, not of the entries of $A$ or of its own eigenvalues, and list every one of them: a $2 \\times 2$ matrix has two singular values.",
        "计算 $A$ 的奇异值时，先求 $n \\times n$ 对称矩阵 $A^T A$，求其降序特征值 $\\lambda_1 \\ge \\lambda_2 \\ge \\dots \\ge 0$，再取平方根 $\\sigma_i = \\sqrt{\\lambda_i}$。例如 $A = \\begin{pmatrix} 6 & -4 \\\\ 8 & 3 \\end{pmatrix}$ 有 $A^TA = \\begin{pmatrix} 100 & 0 \\\\ 0 & 25 \\end{pmatrix}$，所以 $\\sigma_1 = 10$，$\\sigma_2 = 5$。\n\n> **注意。** 要对 $A^TA$ 的特征值开平方，而不是对 $A$ 的元素或 $A$ 自己的特征值；并且要全部列出：$2 \\times 2$ 矩阵有两个奇异值。",
      ),
      generate: (rng: Rng): Problem => {
        // The columns are orthogonal multiples of a rotation, so that the values are not read off the entries.
        const [p, q, h] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
        ] as const);
        const big = rng.int(2, 5);
        const small = rng.int(1, big - 1);
        const flip = rng.bool();
        const left = flip ? small : big;
        const right = flip ? big : small;
        const c = h * big;
        const d = h * small;
        const a11 = h * left;
        const a22 = h * right;
        const shown: Mat2 = [
          [p * left, -q * right],
          [q * left, p * right],
        ];

        const prompt = t(
          `Compute all singular values of the matrix\n\n$$A = ${mat2Latex(shown)}.$$\n\nEnter the singular values separated by commas.`,
          `计算矩阵 $A = ${mat2Latex(shown)}$ 的所有奇异值。多个奇异值用逗号隔开。`,
        );

        const solution = walked(
          [
            [
              ["Form the product", "构造乘积"],
              t(
                "The columns of $A$ are orthogonal, so the off-diagonal entries of $A^TA$ vanish and the diagonal holds the squared column lengths:",
                "$A$ 的各列正交，所以 $A^TA$ 的非对角元为零，对角线上是各列长度的平方：",
              ),
              [
                `A^T A = ${mat2Latex([
                  [a11 * a11, 0],
                  [0, a22 * a22],
                ])}`,
              ],
            ],
            [
              ["Read the eigenvalues", "读出特征值"],
              t(
                `A diagonal matrix has its diagonal entries as eigenvalues: $${c * c}$ and $${d * d}$.`,
                `对角矩阵的特征值就是对角元：$${c * c}$ 和 $${d * d}$。`,
              ),
            ],
            [
              ["Take square roots", "开平方"],
              t("", ""),
              [`\\sigma_1 = \\sqrt{${c * c}} = ${c}, \\quad \\sigma_2 = \\sqrt{${d * d}} = ${d}`],
            ],
          ],
          t(
            `$|\\det A| = |${p * left} \\cdot ${p * right} + ${q * right} \\cdot ${q * left}| = ${c * d} = ${c} \\cdot ${d} = \\sigma_1\\sigma_2$.`,
            `$|\\det A| = |${p * left} \\cdot ${p * right} + ${q * right} \\cdot ${q * left}| = ${c * d} = ${c} \\cdot ${d} = \\sigma_1\\sigma_2$。`,
          ),
        );

        return solutionsProblem({
          prompt,
          values: [String(c), String(d)],
          solution,
          mistakes: [
            whySet(
              [String(c * c), String(d * d)],
              `$${c * c}$ and $${d * d}$ are the eigenvalues of $A^TA$, the squares $\\sigma_i^2$; take their square roots.`,
              `$${c * c}$ 和 $${d * d}$ 是 $A^TA$ 的特征值，即平方 $\\sigma_i^2$；要开平方。`,
            ),
            whySet(
              [String(p * left), String(p * right)],
              `$${p * left}$ and $${p * right}$ are the diagonal entries of $A$; a singular value is the length of a whole column.`,
              `$${p * left}$ 和 $${p * right}$ 是 $A$ 的对角元；奇异值是整列的长度。`,
            ),
            whySet(
              [String(c)],
              `A $2 \\times 2$ matrix has two singular values, one from each column here: $${a11}$ and $${a22}$.`,
              `$2 \\times 2$ 矩阵有两个奇异值，这里每列给出一个：$${a11}$ 和 $${a22}$。`,
            ),
          ],
        });
      },
    },
    {
      id: "singular-values-of-a-scaled-rotation-and-a-rank-one-matrix",
      figure:
        linearAlgebraDrawings2["computing-the-singular-values-of-a-matrix#singular-values-of-a-scaled-rotation-and-a-rank-one-matrix"],
      title: t("Singular values through $A^TA$", "通过 $A^TA$ 计算奇异值"),
      explanation: t(
        "To compute singular values, form $A^TA$, find its eigenvalues and take square roots. For $A = \\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$, $A^TA = (a^2 + b^2)I$, so both singular values equal $\\sqrt{a^2 + b^2}$: the matrix rotates and scales uniformly. For a matrix whose second row is zero, $A^TA = \\mathbf{r}\\mathbf{r}^T$ for the first row $\\mathbf{r}$, which has eigenvalues $\\|\\mathbf{r}\\|^2$ and $0$. For example, $\\begin{pmatrix} 6 & -8 \\\\ 8 & 6 \\end{pmatrix}$ has both singular values $\\sqrt{36 + 64} = 10$, while $\\begin{pmatrix} 6 & 8 \\\\ 0 & 0 \\end{pmatrix}$ has singular values $10$ and $0$.\n\n> **Watch out.** The answer is a length $\\sqrt{a^2 + b^2}$, not an entry, not $a + b$, and not the eigenvalue $a^2 + b^2$ of $A^TA$. A scaled rotation is invertible, so neither of its singular values is $0$.",
        "计算奇异值时，构造 $A^TA$，求其特征值再开平方。对 $A = \\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$，$A^TA = (a^2 + b^2)I$，所以两个奇异值都等于 $\\sqrt{a^2 + b^2}$：矩阵作旋转并均匀缩放。对第二行为零的矩阵，$A^TA = \\mathbf{r}\\mathbf{r}^T$（$\\mathbf{r}$ 为第一行），特征值为 $\\|\\mathbf{r}\\|^2$ 与 $0$。例如 $\\begin{pmatrix} 6 & -8 \\\\ 8 & 6 \\end{pmatrix}$ 的两个奇异值都是 $\\sqrt{36 + 64} = 10$，而 $\\begin{pmatrix} 6 & 8 \\\\ 0 & 0 \\end{pmatrix}$ 的奇异值是 $10$ 和 $0$。\n\n> **注意。** 答案是长度 $\\sqrt{a^2 + b^2}$，不是某个元素，不是 $a + b$，也不是 $A^TA$ 的特征值 $a^2 + b^2$。伸缩旋转矩阵可逆，所以它的奇异值都不是 $0$。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, c] = rng.pick([
          [3, 4, 5],
          [5, 12, 13],
          [6, 8, 10],
          [8, 15, 17],
          [4, 3, 5],
          [12, 5, 13],
          [7, 24, 25],
          [24, 7, 25],
          [9, 12, 15],
          [15, 8, 17],
        ] as const);
        const sp = rng.pick([1, -1]);
        const rot = rng.int(0, 1) === 0;
        const A: Mat2 = rot
          ? [
              [p, -sp * q],
              [sp * q, p],
            ]
          : [
              [p, sp * q],
              [0, 0],
            ];
        return numberProblem({
          prompt: t(
            `Find the ${rot ? "smallest" : "largest"} singular value of $A = ${mat2Latex(A)}$.`,
            `求 $A = ${mat2Latex(A)}$ 的${rot ? "最小" : "最大"}奇异值。`,
          ),
          answer: c,
          wrong: rot ? [0, c * c, p, q] : [c * c, p + q, p, 0],
          mistakes: rot
            ? [
                why(
                  0,
                  `$\\det A = ${p * p} + ${q * q} = ${c * c} \\ne 0$, so $A$ is invertible and no singular value is $0$.`,
                  `$\\det A = ${p * p} + ${q * q} = ${c * c} \\ne 0$，所以 $A$ 可逆，没有奇异值为 $0$。`,
                ),
                why(
                  c * c,
                  `$${c * c}$ is the eigenvalue of $A^TA$, $\\sigma^2$; take its square root.`,
                  `$${c * c}$ 是 $A^TA$ 的特征值，即 $\\sigma^2$；要开平方。`,
                ),
                why(
                  p,
                  `$${p}$ is an entry of $A$; the singular value is the length of a column, $\\sqrt{${p * p} + ${q * q}}$.`,
                  `$${p}$ 是 $A$ 的元素；奇异值是列的长度 $\\sqrt{${p * p} + ${q * q}}$。`,
                ),
                why(
                  q,
                  `$${q}$ is the size of an off-diagonal entry; the singular value is the length of a column, $\\sqrt{${p * p} + ${q * q}}$.`,
                  `$${q}$ 是非对角元的大小；奇异值是列的长度 $\\sqrt{${p * p} + ${q * q}}$。`,
                ),
              ]
            : [
                why(
                  c * c,
                  `$${c * c}$ is the eigenvalue $\\|\\mathbf{r}\\|^2$ of $A^TA$; take its square root.`,
                  `$${c * c}$ 是 $A^TA$ 的特征值 $\\|\\mathbf{r}\\|^2$；要开平方。`,
                ),
                why(
                  p + q,
                  `That adds the sizes of the entries; the length of the row is $\\sqrt{${p * p} + ${q * q}} = ${c}$.`,
                  `这是把元素的大小相加了；行的长度是 $\\sqrt{${p * p} + ${q * q}} = ${c}$。`,
                ),
                why(
                  0,
                  "$0$ is the smaller singular value, from the zero row; the question asks for the larger.",
                  "$0$ 是较小的奇异值，来自零行；题目问的是较大的。",
                ),
              ],
          solution: rot
            ? walked(
                [
                  [
                    ["Form the product", "构造乘积"],
                    t("", ""),
                    [
                      `A^TA = ${mat2Latex([
                        [c * c, 0],
                        [0, c * c],
                      ])} = ${c * c}I`,
                    ],
                  ],
                  [
                    ["Take square roots", "开平方"],
                    t(
                      `Both eigenvalues are $${c * c}$, so both singular values are $\\sqrt{${c * c}} = ${c}$, and the smallest is $${c}$.`,
                      `两个特征值都是 $${c * c}$，所以两个奇异值都是 $\\sqrt{${c * c}} = ${c}$，最小的是 $${c}$。`,
                    ),
                  ],
                ],
                t(
                  `Both columns of $A$ have length $\\sqrt{${p * p} + ${q * q}} = ${c}$ and are orthogonal, so $A$ is $${c}$ times a rotation and stretches every vector by $${c}$.`,
                  `$A$ 的两列长度都是 $\\sqrt{${p * p} + ${q * q}} = ${c}$ 且正交，所以 $A$ 是旋转的 $${c}$ 倍，把每个向量都伸长 $${c}$ 倍。`,
                ),
              )
            : walked(
                [
                  [
                    ["Form the product", "构造乘积"],
                    t(`With the first row $\\mathbf{r} = (${p}, ${sp * q})$:`, `第一行 $\\mathbf{r} = (${p}, ${sp * q})$，于是`),
                    [
                      `A^TA = \\mathbf{r}\\mathbf{r}^T = ${mat2Latex([
                        [p * p, sp * p * q],
                        [sp * p * q, q * q],
                      ])}`,
                    ],
                  ],
                  [
                    ["Find the eigenvalues", "求特征值"],
                    t(
                      `The trace is $${p * p} + ${q * q} = ${c * c}$ and the determinant is $0$, so the eigenvalues are $${c * c}$ and $0$.`,
                      `迹为 $${p * p} + ${q * q} = ${c * c}$，行列式为 $0$，所以特征值为 $${c * c}$ 和 $0$。`,
                    ),
                  ],
                  [
                    ["Take square roots", "开平方"],
                    t(`The singular values are $${c}$ and $0$; the largest is $${c}$.`, `奇异值为 $${c}$ 和 $0$；最大的是 $${c}$。`),
                  ],
                ],
                t(
                  `$A$ sends the unit vector $\\frac{1}{${c}}(${p}, ${sp * q})$ to $(${c}, 0)$, a stretch by $${c}$.`,
                  `$A$ 把单位向量 $\\frac{1}{${c}}(${p}, ${sp * q})$ 映到 $(${c}, 0)$，伸长为 $${c}$ 倍。`,
                ),
              ),
        });
      },
    },
  ],
};

/** singularValueDecompositionOf2x2Matrices covers constructing the SVD for 2x2 matrices. */
export const singularValueDecompositionOf2x2Matrices: TopicDef = {
  id: "singular-value-decomposition-of-2x2-matrices",
  title: t("Singular Value Decomposition of 2x2 Matrices", "2x2 矩阵的奇异值分解"),
  summary: t(
    "Construct the full SVD $A = U \\Sigma V^T$ of a $2 \\times 2$ matrix from eigenvectors of $A^T A$ and $AA^T$.",
    "利用 $A^T A$ 和 $AA^T$ 的特征向量构造 $2 \\times 2$ 矩阵的完整奇异值分解 $A = U \\Sigma V^T$。",
  ),
  intro: t(
    "For $A = \\begin{pmatrix} 4 & 4 \\\\ -3 & 3 \\end{pmatrix}$, $A^TA = \\begin{pmatrix} 25 & 7 \\\\ 7 & 25 \\end{pmatrix}$ has eigenvalues $32$ and $18$ with unit eigenvectors $\\mathbf{v}_1 = \\frac{1}{\\sqrt{2}}(1, 1)$ and $\\mathbf{v}_2 = \\frac{1}{\\sqrt{2}}(1, -1)$. So $\\sigma_1 = 4\\sqrt{2}$ and $\\sigma_2 = 3\\sqrt{2}$. Then $A\\mathbf{v}_1 = \\frac{1}{\\sqrt{2}}(8, 0)$ gives $\\mathbf{u}_1 = (1, 0)$, and $A\\mathbf{v}_2 = \\frac{1}{\\sqrt{2}}(0, -6)$ gives $\\mathbf{u}_2 = (0, -1)$. Together $A = U\\Sigma V^T$ with $\\Sigma = \\operatorname{diag}(4\\sqrt{2}, 3\\sqrt{2})$.\n\nCheck: the squares of the entries add up to $16 + 16 + 9 + 9 = 50 = 32 + 18 = \\sigma_1^2 + \\sigma_2^2$.\n\nIn this lesson we build the SVD of a $2 \\times 2$ matrix: $V$ from the eigenvectors of $A^TA$, $\\Sigma$ from the square roots of its eigenvalues, and each $\\mathbf{u}_i$ as $A\\mathbf{v}_i / \\sigma_i$.",
    "对 $A = \\begin{pmatrix} 4 & 4 \\\\ -3 & 3 \\end{pmatrix}$，$A^TA = \\begin{pmatrix} 25 & 7 \\\\ 7 & 25 \\end{pmatrix}$ 的特征值为 $32$ 和 $18$，单位特征向量为 $\\mathbf{v}_1 = \\frac{1}{\\sqrt{2}}(1, 1)$ 和 $\\mathbf{v}_2 = \\frac{1}{\\sqrt{2}}(1, -1)$。所以 $\\sigma_1 = 4\\sqrt{2}$，$\\sigma_2 = 3\\sqrt{2}$。由 $A\\mathbf{v}_1 = \\frac{1}{\\sqrt{2}}(8, 0)$ 得 $\\mathbf{u}_1 = (1, 0)$，由 $A\\mathbf{v}_2 = \\frac{1}{\\sqrt{2}}(0, -6)$ 得 $\\mathbf{u}_2 = (0, -1)$。合起来 $A = U\\Sigma V^T$，其中 $\\Sigma = \\operatorname{diag}(4\\sqrt{2}, 3\\sqrt{2})$。\n\n检验：各元素的平方和为 $16 + 16 + 9 + 9 = 50 = 32 + 18 = \\sigma_1^2 + \\sigma_2^2$。\n\n本课我们构造 $2 \\times 2$ 矩阵的奇异值分解：$V$ 来自 $A^TA$ 的特征向量，$\\Sigma$ 来自其特征值的平方根，每个 $\\mathbf{u}_i$ 为 $A\\mathbf{v}_i / \\sigma_i$。",
  ),
  prerequisites: ["computing-the-singular-values-of-a-matrix"],
  encompasses: [],
  xp: 16,
  knowledgePoints: [
    {
      id: "svd-2x2-full-rank",
      title: t("SVD of a 2x2 Matrix", "2x2 矩阵的 SVD 分解"),
      explanation: t(
        "For an $m \\times n$ matrix $A$, the SVD is $A = U \\Sigma V^T$, where $U$ and $V$ are orthogonal matrices and $\\Sigma$ is diagonal containing singular values $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge 0$. The columns of $V$ are orthonormal eigenvectors of $A^T A$, and $u_i = \\frac{1}{\\sigma_i} A v_i$. For example, a $2 \\times 2$ matrix with singular values $6$ and $2$ has $\\Sigma = \\begin{pmatrix} 6 & 0 \\\\ 0 & 2 \\end{pmatrix}$, whatever its $U$ and $V$ are.\n\n> **Watch out.** $\\Sigma$ holds the singular values themselves, not their squares $\\sigma_i^2$ (those are the eigenvalues of $A^TA$). They are never negative and go down the diagonal from largest to smallest.",
        "矩阵 $A$ 的奇异值分解为 $A = U \\Sigma V^T$，其中 $U$ 与 $V$ 为正交矩阵，$\\Sigma$ 对角线上为降序奇异值 $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge 0$。$V$ 的各列为 $A^T A$ 的标准正交特征向量，且 $u_i = \\frac{1}{\\sigma_i} A v_i$。例如奇异值为 $6$ 和 $2$ 的 $2 \\times 2$ 矩阵，无论 $U$、$V$ 是什么，都有 $\\Sigma = \\begin{pmatrix} 6 & 0 \\\\ 0 & 2 \\end{pmatrix}$。\n\n> **注意。** $\\Sigma$ 中放的是奇异值本身，不是它们的平方 $\\sigma_i^2$（那是 $A^TA$ 的特征值）。奇异值从不为负，并沿对角线从大到小排列。",
      ),
      generate: (rng: Rng): Problem => {
        const s1 = rng.int(4, 12);
        const s2 = rng.int(1, s1 - 1);

        const prompt = t(
          `Let $A$ be a $2 \\times 2$ real matrix whose singular values are $\\sigma_1 = ${s1}$ and $\\sigma_2 = ${s2}$. What is the singular value matrix $\\Sigma$ in its SVD $A = U \\Sigma V^T$?`,
          `设 $2 \\times 2$ 实矩阵 $A$ 的奇异值为 $\\sigma_1 = ${s1}$ 和 $\\sigma_2 = ${s2}$。求其奇异值分解 $A = U \\Sigma V^T$ 中的奇异值矩阵 $\\Sigma$。`,
        );

        const right = t(
          `$${mat2Latex([
            [s1, 0],
            [0, s2],
          ])}$`,
          `$${mat2Latex([
            [s1, 0],
            [0, s2],
          ])}$`,
        );
        const wrong = [
          t(
            `$${mat2Latex([
              [s2, 0],
              [0, s1],
            ])}$`,
            `$${mat2Latex([
              [s2, 0],
              [0, s1],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [s1 * s1, 0],
              [0, s2 * s2],
            ])}$`,
            `$${mat2Latex([
              [s1 * s1, 0],
              [0, s2 * s2],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [s1, s2],
              [0, 0],
            ])}$`,
            `$${mat2Latex([
              [s1, s2],
              [0, 0],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [s1, 0],
              [0, -s2],
            ])}$`,
            `$${mat2Latex([
              [s1, 0],
              [0, -s2],
            ])}$`,
          ),
        ];

        const solution = walked(
          [
            [
              ["Place the values", "放置奇异值"],
              t(
                "$\\Sigma$ has the shape of $A$, zeros off the diagonal and the singular values themselves on it.",
                "$\\Sigma$ 与 $A$ 同型，非对角元为零，对角线上是奇异值本身。",
              ),
            ],
            [
              ["Order them", "排序"],
              t(`The larger, $${s1}$, comes first:`, `较大的 $${s1}$ 在前：`),
              [
                `\\Sigma = ${mat2Latex([
                  [s1, 0],
                  [0, s2],
                ])}`,
              ],
            ],
          ],
          t(
            `$\\Sigma^T\\Sigma = \\operatorname{diag}(${s1 * s1}, ${s2 * s2})$, whose entries are the eigenvalues $\\sigma_1^2$ and $\\sigma_2^2$ of $A^TA$, largest first.`,
            `$\\Sigma^T\\Sigma = \\operatorname{diag}(${s1 * s1}, ${s2 * s2})$，其元素正是 $A^TA$ 的特征值 $\\sigma_1^2$ 和 $\\sigma_2^2$，大的在前。`,
          ),
        );

        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `The singular values go down the diagonal from largest to smallest, so $${s1}$ comes first.`,
            `奇异值沿对角线从大到小排列，所以 $${s1}$ 在前。`,
          ],
          [
            wrong[1]!.en,
            `$${s1 * s1}$ and $${s2 * s2}$ are the squares $\\sigma_i^2$, the eigenvalues of $A^TA$; $\\Sigma$ holds $\\sigma_i$.`,
            `$${s1 * s1}$ 和 $${s2 * s2}$ 是平方 $\\sigma_i^2$，即 $A^TA$ 的特征值；$\\Sigma$ 中放的是 $\\sigma_i$。`,
          ],
          [
            wrong[2]!.en,
            "$\\Sigma$ is diagonal: the second singular value belongs in the second row and second column.",
            "$\\Sigma$ 是对角矩阵：第二个奇异值应在第二行第二列。",
          ],
          [
            wrong[3]!.en,
            "Singular values are lengths $\\|A\\mathbf{v}_i\\|$, so none is negative.",
            "奇异值是长度 $\\|A\\mathbf{v}_i\\|$，不会为负。",
          ],
        ]);
      },
    },
    {
      id: "frobenius-norm-and-determinant-from-singular-values",
      title: t("Matrix quantities from the singular values", "由奇异值求矩阵的量"),
      explanation: t(
        "In $A = U\\Sigma V^T$ the factors $U$ and $V$ are orthogonal, so they preserve lengths and change neither $\\operatorname{tr}(A^TA)$ nor $|\\det A|$. Since $A^TA = V\\Sigma^2V^T$:\n\n$$\\|A\\|_F^2 = \\sum_{i,j} a_{ij}^2 = \\operatorname{tr}(A^TA) = \\sigma_1^2 + \\sigma_2^2, \\qquad |\\det A| = \\sigma_1\\sigma_2.$$\n\nSo the sum of squares of all entries can be read off from the singular values, and vice versa. For example, $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ has $\\sigma_1^2 + \\sigma_2^2 = 1 + 4 + 9 + 16 = 30$ and $\\sigma_1\\sigma_2 = |4 - 6| = 2$.\n\n> **Watch out.** Square every entry, the off-diagonal ones too; the trace of $A$ itself is not $\\sigma_1^2 + \\sigma_2^2$. The product is the absolute value of $\\det A$, since singular values are never negative.",
        "在 $A = U\\Sigma V^T$ 中，$U$ 与 $V$ 正交，保持长度，不改变 $\\operatorname{tr}(A^TA)$ 与 $|\\det A|$。由于 $A^TA = V\\Sigma^2V^T$：\n\n$$\\|A\\|_F^2 = \\sum_{i,j} a_{ij}^2 = \\operatorname{tr}(A^TA) = \\sigma_1^2 + \\sigma_2^2, \\qquad |\\det A| = \\sigma_1\\sigma_2$$\n\n所以全部元素的平方和可以由奇异值读出，反之亦然。例如 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ 有 $\\sigma_1^2 + \\sigma_2^2 = 1 + 4 + 9 + 16 = 30$，$\\sigma_1\\sigma_2 = |4 - 6| = 2$。\n\n> **注意。** 每个元素都要平方，非对角元也不例外；$A$ 本身的迹不是 $\\sigma_1^2 + \\sigma_2^2$。乘积是 $\\det A$ 的绝对值，因为奇异值从不为负。",
      ),
      generate(rng: Rng): Problem {
        const drawn = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5), rng.nonZero(-5, 5)] as const;
        const askSum = rng.int(0, 1) === 0;
        // A product of 0 leaves too few distinct wrong answers; moving the corner entry changes det A by ±d ≠ 0.
        const corner = !askSum && drawn[0] * drawn[3] === drawn[1] * drawn[2] ? drawn[0] + (drawn[0] === 5 ? -1 : 1) : drawn[0];
        const A: Mat2 = [
          [corner, drawn[1]],
          [drawn[2], drawn[3]],
        ];
        const fro = A[0][0] ** 2 + A[0][1] ** 2 + A[1][0] ** 2 + A[1][1] ** 2;
        const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
        const [[a, b], [c, d]] = A;
        const squares = `${a * a} + ${b * b} + ${c * c} + ${d * d}`;
        const answer = askSum ? fro : Math.abs(det);
        const mistakes = askSum
          ? [
              why(
                a + d,
                `$${a + d}$ is the trace of $A$; $\\sigma_1^2 + \\sigma_2^2$ is the trace of $A^TA$, the sum of the squares of all entries.`,
                `$${a + d}$ 是 $A$ 的迹；$\\sigma_1^2 + \\sigma_2^2$ 是 $A^TA$ 的迹，即全部元素的平方和。`,
              ),
              why(
                det * det,
                `$${det * det}$ is $(\\det A)^2 = \\sigma_1^2\\sigma_2^2$, the product of the squares, not their sum.`,
                `$${det * det}$ 是 $(\\det A)^2 = \\sigma_1^2\\sigma_2^2$，是平方的乘积，不是和。`,
              ),
              why(
                a * a + d * d,
                `$${a * a + d * d}$ squares only the diagonal entries; the off-diagonal ones count too.`,
                `$${a * a + d * d}$ 只平方了对角元；非对角元也要算进去。`,
              ),
            ]
          : [
              why(
                det * det,
                `$${det * det}$ is $(\\det A)^2 = \\sigma_1^2\\sigma_2^2$; take its square root.`,
                `$${det * det}$ 是 $(\\det A)^2 = \\sigma_1^2\\sigma_2^2$；要开平方。`,
              ),
              why(
                fro,
                `$${fro}$ is the sum of the squares of the entries, $\\sigma_1^2 + \\sigma_2^2$, not the product.`,
                `$${fro}$ 是元素的平方和 $\\sigma_1^2 + \\sigma_2^2$，不是乘积。`,
              ),
              why(
                a * d + b * c,
                `The determinant subtracts the product of the off-diagonal entries: $${a * d} - ${paren(b * c)}$.`,
                `行列式要减去非对角元之积：$${a * d} - ${paren(b * c)}$。`,
              ),
              why(
                det,
                `$\\det A = ${det}$ is negative, but singular values are never negative, so their product is $|\\det A|$.`,
                `$\\det A = ${det}$ 为负，但奇异值从不为负，所以它们的积是 $|\\det A|$。`,
              ),
              why(
                a + d,
                `$${a + d}$ is the trace of $A$, the sum of its eigenvalues; the product $\\sigma_1\\sigma_2$ comes from the determinant.`,
                `$${a + d}$ 是 $A$ 的迹，即特征值之和；乘积 $\\sigma_1\\sigma_2$ 来自行列式。`,
              ),
            ];
        return numberProblem({
          prompt: t(
            `$A = ${mat2Latex(A)}$ has singular values $\\sigma_1 \\ge \\sigma_2$. Find $${askSum ? "\\sigma_1^2 + \\sigma_2^2" : "\\sigma_1\\sigma_2"}$ without computing the SVD.`,
            `$A = ${mat2Latex(A)}$ 的奇异值为 $\\sigma_1 \\ge \\sigma_2$。不计算奇异值分解，求 $${askSum ? "\\sigma_1^2 + \\sigma_2^2" : "\\sigma_1\\sigma_2"}$。`,
          ),
          answer,
          mistakes: distinct(mistakes, answer),
          solution: askSum
            ? walked(
                [
                  [
                    ["Use the trace of $A^TA$", "用 $A^TA$ 的迹"],
                    t(
                      "$A^TA = V\\Sigma^2V^T$ has trace $\\sigma_1^2 + \\sigma_2^2$, and its diagonal entries are the squared lengths of the columns of $A$.",
                      "$A^TA = V\\Sigma^2V^T$ 的迹为 $\\sigma_1^2 + \\sigma_2^2$，其对角元是 $A$ 各列长度的平方。",
                    ),
                  ],
                  [["Add the squares", "求平方和"], t("", ""), [`\\sigma_1^2 + \\sigma_2^2 = ${squares} = ${fro}`]],
                ],
                t(
                  `The first column has squared length $${a * a + c * c}$ and the second $${b * b + d * d}$, which add up to $${fro}$.`,
                  `第一列长度的平方为 $${a * a + c * c}$，第二列为 $${b * b + d * d}$，相加得 $${fro}$。`,
                ),
              )
            : walked(
                [
                  [
                    ["Use the determinant", "用行列式"],
                    t(
                      "$|\\det A| = |\\det U|\\,\\det\\Sigma\\,|\\det V| = \\sigma_1\\sigma_2$, since orthogonal matrices have determinant $\\pm 1$.",
                      "$|\\det A| = |\\det U|\\,\\det\\Sigma\\,|\\det V| = \\sigma_1\\sigma_2$，因为正交矩阵的行列式为 $\\pm 1$。",
                    ),
                  ],
                  [
                    ["Compute it", "计算"],
                    t("", ""),
                    [`\\det A = ${a * d} - ${paren(b * c)} = ${det}`, `\\sigma_1\\sigma_2 = |${det}| = ${Math.abs(det)}`],
                  ],
                ],
                t(
                  `$(\\sigma_1\\sigma_2)^2 = ${det * det} = \\det(A^TA)$, the product of the eigenvalues of $A^TA$.`,
                  `$(\\sigma_1\\sigma_2)^2 = ${det * det} = \\det(A^TA)$，即 $A^TA$ 特征值之积。`,
                ),
              ),
        });
      },
    },
  ],
};

/** singularValueDecompositionOf2x2MatricesWithZeroOrRepeatedEigenvalues covers rank-deficient and repeated singular value cases. */
export const singularValueDecompositionOf2x2MatricesWithZeroOrRepeatedEigenvalues: TopicDef = {
  id: "singular-value-decomposition-of-2x2-matrices-with-zero-or-repeated-eigenvalues",
  title: t("Singular Value Decomposition of 2x2 Matrices With Zero or Repeated Eigenvalues", "含零或重奇异值的 2x2 矩阵奇异值分解"),
  summary: t(
    "Perform SVD on rank-one 2x2 matrices and matrices with repeated singular values, completing orthonormal bases.",
    "对秩为 1 的 2x2 矩阵及具有重奇异值的矩阵进行 SVD 分解，并扩充标准正交基。",
  ),
  intro: t(
    "$A = \\begin{pmatrix} 9 & 12 \\\\ 12 & 16 \\end{pmatrix}$ is the outer product of $(3, 4)$ with itself, so it has rank $1$. Its singular values are $\\sigma_1 = 5 \\cdot 5 = 25$ and $\\sigma_2 = 0$, with $\\mathbf{v}_1 = \\frac{1}{5}(3, 4)$ and $\\mathbf{u}_1 = A\\mathbf{v}_1 / 25 = \\frac{1}{5}(3, 4)$. The formula $A\\mathbf{v}_2 / \\sigma_2$ fails for $\\sigma_2 = 0$, so $\\mathbf{u}_2$ is chosen as a unit vector orthogonal to $\\mathbf{u}_1$: $\\frac{1}{5}(-4, 3)$. At the other extreme, $\\begin{pmatrix} 3 & -4 \\\\ 4 & 3 \\end{pmatrix}$ has both singular values equal to $5$, and any orthonormal pair can serve as $V$.\n\nCheck: the squares of the entries of the first matrix add up to $81 + 144 + 144 + 256 = 625 = 25^2 + 0^2$.\n\nIn this lesson we complete the SVD when a singular value is $0$, find the nonzero singular value of a rank-one matrix, and invert a matrix whose singular values are equal.",
    "$A = \\begin{pmatrix} 9 & 12 \\\\ 12 & 16 \\end{pmatrix}$ 是 $(3, 4)$ 与自身的外积，所以秩为 $1$。它的奇异值为 $\\sigma_1 = 5 \\cdot 5 = 25$ 和 $\\sigma_2 = 0$，$\\mathbf{v}_1 = \\frac{1}{5}(3, 4)$，$\\mathbf{u}_1 = A\\mathbf{v}_1 / 25 = \\frac{1}{5}(3, 4)$。当 $\\sigma_2 = 0$ 时公式 $A\\mathbf{v}_2 / \\sigma_2$ 失效，所以 $\\mathbf{u}_2$ 取与 $\\mathbf{u}_1$ 正交的单位向量：$\\frac{1}{5}(-4, 3)$。另一个极端是 $\\begin{pmatrix} 3 & -4 \\\\ 4 & 3 \\end{pmatrix}$，两个奇异值都等于 $5$，任何一对标准正交向量都可以作为 $V$。\n\n检验：第一个矩阵各元素的平方和为 $81 + 144 + 144 + 256 = 625 = 25^2 + 0^2$。\n\n本课我们在有奇异值为 $0$ 时补全奇异值分解，求秩一矩阵的非零奇异值，并求奇异值相等的矩阵的逆。",
  ),
  prerequisites: ["singular-value-decomposition-of-2x2-matrices"],
  encompasses: [],
  xp: 16,
  knowledgePoints: [
    {
      id: "svd-2x2-rank-one",
      title: t("SVD of a Rank-One 2x2 Matrix", "秩为 1 的 2x2 矩阵的 SVD"),
      explanation: t(
        "When $\\operatorname{rank}(A) = 1$, the second singular value is $\\sigma_2 = 0$. In this case, $u_1 = \\frac{1}{\\sigma_1} A v_1$, and $u_2$ is chosen as any unit vector orthogonal to $u_1$ to complete the orthonormal basis for $\\mathbb{R}^2$. In the plane, swapping the two entries and negating one of them turns a vector by a right angle. For example, $u_1 = \\frac{1}{5}(3, 4)$ gives $u_2 = \\frac{1}{5}(-4, 3)$, and $\\frac{1}{5}(4, -3)$ works as well.\n\n> **Watch out.** Swap the entries and negate exactly one of them. Negating without swapping, or swapping without negating, gives a unit vector that is not orthogonal to $u_1$; check that the dot product is $0$.",
        "当 $\\operatorname{rank}(A) = 1$ 时，第二个奇异值为 $\\sigma_2 = 0$。此时 $u_1 = \\frac{1}{\\sigma_1} A v_1$，而 $u_2$ 选取与 $u_1$ 正交的任意单位向量以补齐 $\\mathbb{R}^2$ 的标准正交基。在平面上，把两个分量对调并把其中一个变号，就把向量转了一个直角。例如 $u_1 = \\frac{1}{5}(3, 4)$ 给出 $u_2 = \\frac{1}{5}(-4, 3)$，$\\frac{1}{5}(4, -3)$ 也可以。\n\n> **注意。** 要对调分量并恰好把其中一个变号。只变号不对调，或只对调不变号，得到的单位向量都与 $u_1$ 不正交；要检查点积是否为 $0$。",
      ),
      generate: (rng: Rng): Problem => {
        const u1 = rng.nonZero(-5, 5);
        // Equal sizes would make the option (u1, -u2) orthogonal to the first column too.
        let u2 = rng.nonZero(-5, 5);
        while (Math.abs(u2) === Math.abs(u1)) u2 = rng.nonZero(-5, 5);
        const hypSq = u1 * u1 + u2 * u2;

        const prompt = t(
          `Let $A$ be a $2 \\times 2$ real matrix of rank 1. In its SVD $A = U \\Sigma V^T$, the first column of $U$ is $u_1 = \\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([u1, u2])}$. Which of the following is a valid choice for the second column $u_2$ of $U$?`,
          `设 $A$ 为秩为 1 的 $2 \\times 2$ 实矩阵。在奇异值分解 $A = U \\Sigma V^T$ 中，$U$ 的第一列为 $u_1 = \\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([u1, u2])}$。下列哪个向量是 $U$ 的第二列 $u_2$ 的有效选择？`,
        );

        const right = t(`$\\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([-u2, u1])}$`, `$\\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([-u2, u1])}$`);
        const wrong = [
          t(`$\\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([u1, -u2])}$`, `$\\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([u1, -u2])}$`),
          t(`$\\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([u2, u1])}$`, `$\\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([u2, u1])}$`),
          t(`$\\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([u1, u2])}$`, `$\\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([u1, u2])}$`),
          t(`$${vec2Latex([1, 0])}$`, `$${vec2Latex([1, 0])}$`),
        ];

        const solution = walked(
          [
            [
              ["State what is needed", "明确要求"],
              t(
                `$U$ is orthogonal, so $u_2$ must be a unit vector orthogonal to $u_1 = \\frac{1}{\\sqrt{${hypSq}}}(${u1}, ${u2})$. Since $\\sigma_2 = 0$, the formula $A v_2 / \\sigma_2$ cannot give it.`,
                `$U$ 是正交矩阵，所以 $u_2$ 必须是与 $u_1 = \\frac{1}{\\sqrt{${hypSq}}}(${u1}, ${u2})$ 正交的单位向量。由于 $\\sigma_2 = 0$，公式 $A v_2 / \\sigma_2$ 给不出它。`,
              ),
            ],
            [
              ["Turn by a right angle", "转一个直角"],
              t("Swap the entries and negate the new first one:", "对调两个分量，并把新的第一个分量变号："),
              [`u_2 = \\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([-u2, u1])}`],
            ],
          ],
          t(
            `$u_1 \\cdot u_2 = \\frac{1}{${hypSq}}[${paren(u1)} \\cdot ${paren(-u2)} + ${paren(u2)} \\cdot ${paren(u1)}] = 0$, and $u_2$ has length $\\frac{\\sqrt{${u2 * u2} + ${u1 * u1}}}{\\sqrt{${hypSq}}} = 1$.`,
            `$u_1 \\cdot u_2 = \\frac{1}{${hypSq}}[${paren(u1)} \\cdot ${paren(-u2)} + ${paren(u2)} \\cdot ${paren(u1)}] = 0$，且 $u_2$ 的长度为 $\\frac{\\sqrt{${u2 * u2} + ${u1 * u1}}}{\\sqrt{${hypSq}}} = 1$。`,
          ),
        );

        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `Negating an entry without swapping leaves the dot product $\\frac{${u1 * u1} - ${u2 * u2}}{${hypSq}} \\ne 0$.`,
            `只变号不对调，点积为 $\\frac{${u1 * u1} - ${u2 * u2}}{${hypSq}} \\ne 0$。`,
          ],
          [
            wrong[1]!.en,
            `Swapping without negating gives the dot product $\\frac{${2 * u1 * u2}}{${hypSq}} \\ne 0$; one entry must also change sign.`,
            `只对调不变号，点积为 $\\frac{${2 * u1 * u2}}{${hypSq}} \\ne 0$；还要把一个分量变号。`,
          ],
          [
            wrong[2]!.en,
            "That is $u_1$ itself; the columns of $U$ must be orthogonal, not equal.",
            "这就是 $u_1$ 本身；$U$ 的各列必须正交，而不是相等。",
          ],
          [
            wrong[3]!.en,
            `$(1, 0)$ has dot product $\\frac{${u1}}{\\sqrt{${hypSq}}} \\ne 0$ with $u_1$; a standard basis vector works only when $u_1$ lies along an axis.`,
            `$(1, 0)$ 与 $u_1$ 的点积为 $\\frac{${u1}}{\\sqrt{${hypSq}}} \\ne 0$；只有 $u_1$ 沿坐标轴时标准基向量才可以。`,
          ],
        ]);
      },
    },
    {
      id: "the-nonzero-singular-value-of-a-rank-one-matrix",
      title: t("The nonzero singular value of a rank-one matrix", "秩一矩阵的非零奇异值"),
      explanation: t(
        "A rank-one matrix is an outer product $A = \\mathbf{u}\\mathbf{v}^T$. Then $A^TA = \\|\\mathbf{u}\\|^2\\mathbf{v}\\mathbf{v}^T$, whose only nonzero eigenvalue is $\\|\\mathbf{u}\\|^2\\|\\mathbf{v}\\|^2$. So the singular values are\n\n$$\\sigma_1 = \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|, \\qquad \\sigma_2 = 0,$$\n\nwith $\\frac{\\mathbf{u}}{\\|\\mathbf{u}\\|}$ and $\\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$ as the first left and right singular vectors. For example, $\\begin{pmatrix} 3 & 6 \\\\ 4 & 8 \\end{pmatrix} = (3, 4)(1, 2)^T$ has $\\sigma_1 = 5\\sqrt{5}$.\n\n> **Watch out.** Multiply the two lengths; do not add them, and do not stop at $\\|\\mathbf{u}\\|^2\\|\\mathbf{v}\\|^2$, which is the eigenvalue of $A^TA$, the square of $\\sigma_1$.",
        "秩一矩阵是外积 $A = \\mathbf{u}\\mathbf{v}^T$。于是 $A^TA = \\|\\mathbf{u}\\|^2\\mathbf{v}\\mathbf{v}^T$，唯一的非零特征值为 $\\|\\mathbf{u}\\|^2\\|\\mathbf{v}\\|^2$。所以奇异值为\n\n$$\\sigma_1 = \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|, \\qquad \\sigma_2 = 0,$$\n\n$\\frac{\\mathbf{u}}{\\|\\mathbf{u}\\|}$ 与 $\\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$ 为第一个左、右奇异向量。例如 $\\begin{pmatrix} 3 & 6 \\\\ 4 & 8 \\end{pmatrix} = (3, 4)(1, 2)^T$ 有 $\\sigma_1 = 5\\sqrt{5}$。\n\n> **注意。** 两个长度要相乘，不要相加；也不要停在 $\\|\\mathbf{u}\\|^2\\|\\mathbf{v}\\|^2$，那是 $A^TA$ 的特征值，即 $\\sigma_1$ 的平方。",
      ),
      generate(rng: Rng): Problem {
        const triples = [
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [1, 0, 1],
          [0, 2, 2],
        ] as const;
        const [p, q, r] = rng.pick(triples);
        const [a, b, c] = rng.pick(triples.slice(0, 4));
        const s = rng.pick([1, -1]);
        const A: Mat2 = [
          [p * a, s * p * b],
          [q * a, s * q * b],
        ];
        const ans = r * c;
        return numberProblem({
          prompt: t(
            `$A = ${mat2Latex(A)}$ has rank $1$. Find its largest singular value.`,
            `$A = ${mat2Latex(A)}$ 的秩为 $1$。求其最大奇异值。`,
          ),
          answer: ans,
          mistakes: distinct(
            [
              why(
                ans * ans,
                `$${ans * ans}$ is the eigenvalue $\\|\\mathbf{u}\\|^2\\|\\mathbf{v}\\|^2$ of $A^TA$; take its square root.`,
                `$${ans * ans}$ 是 $A^TA$ 的特征值 $\\|\\mathbf{u}\\|^2\\|\\mathbf{v}\\|^2$；要开平方。`,
              ),
              why(
                r + c,
                `That adds the lengths $${r}$ and $${c}$; $\\sigma_1 = \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|$ multiplies them.`,
                `这是把长度 $${r}$ 和 $${c}$ 相加了；$\\sigma_1 = \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|$ 要相乘。`,
              ),
              why(
                Math.abs(A[0][0]) + Math.abs(A[1][1]),
                "That adds the sizes of the diagonal entries; a singular value comes from the whole matrix, not its diagonal.",
                "这是把对角元的大小相加了；奇异值来自整个矩阵，而不是对角线。",
              ),
              why(
                c,
                `$${c}$ is the length of the row factor alone; it must be multiplied by the length $${r}$ of the column factor.`,
                `$${c}$ 只是行因子的长度；还要乘以列因子的长度 $${r}$。`,
              ),
            ],
            ans,
          ),
          solution: walked(
            [
              [
                ["Factor the matrix", "分解矩阵"],
                t(
                  "Every row is a multiple of the same row, so $A$ is a column times a row:",
                  "每一行都是同一行的倍数，所以 $A$ 是一列乘一行：",
                ),
                [`A = ${vec2Latex([p, q])}\\begin{pmatrix} ${a} & ${s * b} \\end{pmatrix}`],
              ],
              [
                ["Find the lengths", "求长度"],
                t("", ""),
                [`\\|\\mathbf{u}\\| = \\sqrt{${p * p} + ${q * q}} = ${r}, \\quad \\|\\mathbf{v}\\| = \\sqrt{${a * a} + ${b * b}} = ${c}`],
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `$\\sigma_1 = ${r} \\cdot ${c} = ${ans}$, and $\\sigma_2 = 0$.`,
                  `$\\sigma_1 = ${r} \\cdot ${c} = ${ans}$，$\\sigma_2 = 0$。`,
                ),
              ],
            ],
            t(
              `The squares of the entries of $A$ add up to $${A[0][0] ** 2 + A[0][1] ** 2 + A[1][0] ** 2 + A[1][1] ** 2} = ${ans}^2 = \\sigma_1^2 + \\sigma_2^2$.`,
              `$A$ 各元素的平方和为 $${A[0][0] ** 2 + A[0][1] ** 2 + A[1][0] ** 2 + A[1][1] ** 2} = ${ans}^2 = \\sigma_1^2 + \\sigma_2^2$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** singularValueDecompositionOfLargerMatrices covers SVD of rectangular matrices and dyadic expansion. */
export const singularValueDecompositionOfLargerMatrices: TopicDef = {
  id: "singular-value-decomposition-of-larger-matrices",
  title: t("Singular Value Decomposition of Larger Matrices", "一般矩阵的奇异值分解"),
  summary: t(
    "Find the SVD of rectangular matrices and use the outer product expansion $A = \\sum \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T$ for low-rank approximation.",
    "求矩形矩阵的奇异值分解，并用外积展开 $A = \\sum \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^T$ 进行低秩逼近。",
  ),
  intro: t(
    "Take $\\sigma_1 = 10$, $\\sigma_2 = 5$, $\\mathbf{u}_1 = (1, 0, 0)$, $\\mathbf{u}_2 = (0, 1, 0)$, $\\mathbf{v}_1 = \\frac{1}{5}(3, 4)$ and $\\mathbf{v}_2 = \\frac{1}{5}(-4, 3)$. The $3 \\times 2$ matrix $A = \\sigma_1\\mathbf{u}_1\\mathbf{v}_1^T + \\sigma_2\\mathbf{u}_2\\mathbf{v}_2^T$ is a sum of two rank-one pieces:\n\n$$A = \\begin{pmatrix} 6 & 8 \\\\ 0 & 0 \\\\ 0 & 0 \\end{pmatrix} + \\begin{pmatrix} 0 & 0 \\\\ -4 & 3 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 6 & 8 \\\\ -4 & 3 \\\\ 0 & 0 \\end{pmatrix}.$$\n\nKeeping only the first piece gives the best rank-one approximation $A_1$, and the error $A - A_1$ is the second piece, with $\\|A - A_1\\|_F^2 = 16 + 9 = 25 = \\sigma_2^2$.\n\nCheck: the squares of the entries of $A$ add up to $36 + 64 + 16 + 9 = 125 = 10^2 + 5^2$.\n\nIn this lesson we write a matrix as a sum of rank-one terms $\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^T$, measure the error of truncating that sum, and find the smallest rank that meets an error budget.",
    "取 $\\sigma_1 = 10$，$\\sigma_2 = 5$，$\\mathbf{u}_1 = (1, 0, 0)$，$\\mathbf{u}_2 = (0, 1, 0)$，$\\mathbf{v}_1 = \\frac{1}{5}(3, 4)$，$\\mathbf{v}_2 = \\frac{1}{5}(-4, 3)$。$3 \\times 2$ 矩阵 $A = \\sigma_1\\mathbf{u}_1\\mathbf{v}_1^T + \\sigma_2\\mathbf{u}_2\\mathbf{v}_2^T$ 是两个秩一部分之和：\n\n$$A = \\begin{pmatrix} 6 & 8 \\\\ 0 & 0 \\\\ 0 & 0 \\end{pmatrix} + \\begin{pmatrix} 0 & 0 \\\\ -4 & 3 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 6 & 8 \\\\ -4 & 3 \\\\ 0 & 0 \\end{pmatrix}$$\n\n只保留第一部分就得到最佳秩一逼近 $A_1$，误差 $A - A_1$ 就是第二部分，$\\|A - A_1\\|_F^2 = 16 + 9 = 25 = \\sigma_2^2$。\n\n检验：$A$ 各元素的平方和为 $36 + 64 + 16 + 9 = 125 = 10^2 + 5^2$。\n\n本课我们把矩阵写成秩一项 $\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^T$ 之和，度量截断这个和的误差，并求满足误差要求的最小秩。",
  ),
  prerequisites: ["singular-value-decomposition-of-2x2-matrices-with-zero-or-repeated-eigenvalues"],
  encompasses: [],
  xp: 16,
  knowledgePoints: [
    {
      id: "svd-outer-product-expansion",
      title: t("Outer Product Expansion of SVD", "SVD 的外积展开式"),
      explanation: t(
        "Any matrix $A$ of rank $r$ can be written as the sum of $r$ rank-one matrices: $A = \\sum_{i=1}^r \\sigma_i u_i v_i^T$. By the Eckart-Young-Mirsky theorem, the best rank-$k$ approximation to $A$ in both Frobenius and spectral norms is $A_k = \\sum_{i=1}^k \\sigma_i u_i v_i^T$. The outer product $u v^T$ is a column times a row: its $(i, j)$ entry is the $i$-th entry of $u$ times the $j$-th entry of $v$. For example, $\\sigma_1 = 10$, $u_1 = (1, 0)$ and $v_1 = \\frac{1}{5}(3, 4)$ give $A_1 = 10 \\cdot \\frac{1}{5}\\begin{pmatrix} 3 & 4 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 6 & 8 \\\\ 0 & 0 \\end{pmatrix}$.\n\n> **Watch out.** The rows follow $u$ and the columns follow $v$; $v u^T$ is the transpose. Keep the factor $\\sigma_1$ and the fractions in front of the unit vectors.",
        "任意秩为 $r$ 的矩阵 $A$ 均可展开为 $r$ 个秩 1 矩阵之和：$A = \\sum_{i=1}^r \\sigma_i u_i v_i^T$。根据 Eckart-Young-Mirsky 定理，在 Frobenius 范数和谱范数下，$A$ 的最佳秩 $k$ 逼近为截断和 $A_k = \\sum_{i=1}^k \\sigma_i u_i v_i^T$。外积 $u v^T$ 是一列乘一行：其 $(i, j)$ 元素是 $u$ 的第 $i$ 个分量乘 $v$ 的第 $j$ 个分量。例如 $\\sigma_1 = 10$，$u_1 = (1, 0)$，$v_1 = \\frac{1}{5}(3, 4)$ 给出 $A_1 = 10 \\cdot \\frac{1}{5}\\begin{pmatrix} 3 & 4 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 6 & 8 \\\\ 0 & 0 \\end{pmatrix}$。\n\n> **注意。** 行跟随 $u$，列跟随 $v$；$v u^T$ 是它的转置。要保留倍数 $\\sigma_1$ 和单位向量前的分数。",
      ),
      generate: (rng: Rng): Problem => {
        // Singular vectors have length one, so both are written as a fifth of a (3, 4) vector.
        const scale = rng.int(2, 5);
        const s1 = 25 * scale;
        const unit: [number, number][] = [
          [3, 4],
          [4, 3],
          [3, -4],
          [4, -3],
          [-3, 4],
          [-4, 3],
          [-3, -4],
          [-4, -3],
        ];
        const [u1, u2] = rng.pick(unit);
        // Parallel vectors would give a symmetric result, which is its own transpose.
        const [v1, v2] = rng.pick(unit.filter(([p, q]) => u1 * q !== u2 * p));

        const a11 = scale * u1 * v1;
        const a12 = scale * u1 * v2;
        const a21 = scale * u2 * v1;
        const a22 = scale * u2 * v2;

        const prompt = t(
          `In the outer product expansion of the SVD of a matrix $A$, the leading term is $A_1 = \\sigma_1 u_1 v_1^T$. Given $\\sigma_1 = ${s1}$, $u_1 = \\frac{1}{5}${vec2Latex([u1, u2])}$, and $v_1 = \\frac{1}{5}${vec2Latex([v1, v2])}$, calculate the rank-1 matrix $A_1$.`,
          `在矩阵 $A$ 的 SVD 外积展开式中，第一项为最佳秩 1 逼近 $A_1 = \\sigma_1 u_1 v_1^T$。已知 $\\sigma_1 = ${s1}$，$u_1 = \\frac{1}{5}${vec2Latex([u1, u2])}$，$v_1 = \\frac{1}{5}${vec2Latex([v1, v2])}$，计算该秩 1 矩阵 $A_1$。`,
        );

        const right = t(
          `$${mat2Latex([
            [a11, a12],
            [a21, a22],
          ])}$`,
          `$${mat2Latex([
            [a11, a12],
            [a21, a22],
          ])}$`,
        );
        const wrong = [
          t(
            `$${mat2Latex([
              [a11, a21],
              [a12, a22],
            ])}$`,
            `$${mat2Latex([
              [a11, a21],
              [a12, a22],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [u1 * v1, u1 * v2],
              [u2 * v1, u2 * v2],
            ])}$`,
            `$${mat2Latex([
              [u1 * v1, u1 * v2],
              [u2 * v1, u2 * v2],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [a11, -a12],
              [-a21, a22],
            ])}$`,
            `$${mat2Latex([
              [a11, -a12],
              [-a21, a22],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [a22, a12],
              [a21, a11],
            ])}$`,
            `$${mat2Latex([
              [a22, a12],
              [a21, a11],
            ])}$`,
          ),
        ];

        const solution = walked(
          [
            [
              ["Form the outer product", "构造外积"],
              t("Rows follow $u_1$ and columns follow $v_1$:", "行跟随 $u_1$，列跟随 $v_1$："),
              [
                `u_1 v_1^T = \\frac{1}{25}${vec2Latex([u1, u2])} \\begin{pmatrix} ${v1} & ${v2} \\end{pmatrix} = \\frac{1}{25}${mat2Latex([
                  [u1 * v1, u1 * v2],
                  [u2 * v1, u2 * v2],
                ])}`,
              ],
            ],
            [
              ["Scale by $\\sigma_1$", "乘以 $\\sigma_1$"],
              t(`$\\frac{${s1}}{25} = ${scale}$, so`, `$\\frac{${s1}}{25} = ${scale}$，所以`),
              [
                `A_1 = ${scale}${mat2Latex([
                  [u1 * v1, u1 * v2],
                  [u2 * v1, u2 * v2],
                ])} = ${mat2Latex([
                  [a11, a12],
                  [a21, a22],
                ])}`,
              ],
            ],
          ],
          t(
            `$A_1$ has rank $1$: $${paren(a11)} \\cdot ${paren(a22)} - ${paren(a12)} \\cdot ${paren(a21)} = 0$. Its squared entries add up to $${a11 * a11 + a12 * a12 + a21 * a21 + a22 * a22} = ${s1}^2 = \\sigma_1^2$.`,
            `$A_1$ 的秩为 $1$：$${paren(a11)} \\cdot ${paren(a22)} - ${paren(a12)} \\cdot ${paren(a21)} = 0$。其元素平方和为 $${a11 * a11 + a12 * a12 + a21 * a21 + a22 * a22} = ${s1}^2 = \\sigma_1^2$。`,
          ),
        );

        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "That is $\\sigma_1 v_1 u_1^T$, the transpose: the rows must follow $u_1$.",
            "这是 $\\sigma_1 v_1 u_1^T$，即转置：行应跟随 $u_1$。",
          ],
          [
            wrong[1]!.en,
            `That is $${vec2Latex([u1, u2])}\\begin{pmatrix} ${v1} & ${v2} \\end{pmatrix}$ without the factor $\\frac{${s1}}{25} = ${scale}$.`,
            `这是 $${vec2Latex([u1, u2])}\\begin{pmatrix} ${v1} & ${v2} \\end{pmatrix}$，漏了倍数 $\\frac{${s1}}{25} = ${scale}$。`,
          ],
          [
            wrong[2]!.en,
            "The off-diagonal signs are flipped; each entry is a product of an entry of $u_1$ and an entry of $v_1$, signs included.",
            "非对角元的符号反了；每个元素都是 $u_1$ 的一个分量乘 $v_1$ 的一个分量，符号也要带上。",
          ],
          [
            wrong[3]!.en,
            "The diagonal entries are swapped; the $(1, 1)$ entry is the first entry of $u_1$ times the first entry of $v_1$.",
            "对角元互换了；$(1, 1)$ 元素是 $u_1$ 的第一个分量乘 $v_1$ 的第一个分量。",
          ],
        ]);
      },
    },
    {
      id: "the-error-of-a-truncated-svd",
      title: t("The error of a truncated SVD", "截断奇异值分解的误差"),
      explanation: t(
        "Keeping the first $k$ terms of $A = \\sum_i \\sigma_i\\mathbf{u}_i\\mathbf{v}_i^T$ gives the best rank-$k$ approximation $A_k$. The error $A - A_k = \\sum_{i > k}\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^T$ has singular values $\\sigma_{k+1}, \\sigma_{k+2}, \\dots$, so\n\n$$\\|A - A_k\\|_2 = \\sigma_{k+1}, \\qquad \\|A - A_k\\|_F^2 = \\sigma_{k+1}^2 + \\sigma_{k+2}^2 + \\cdots.$$\n\nFor example, with singular values $9, 6, 2, 1$ the best rank-$2$ approximation has $\\|A - A_2\\|_2 = 2$ and $\\|A - A_2\\|_F^2 = 4 + 1 = 5$.\n\n> **Watch out.** The error comes from the discarded values, starting with $\\sigma_{k+1}$, not from the last one kept. The spectral error is one singular value, while the squared Frobenius error adds the squares of all the discarded ones.",
        "保留 $A = \\sum_i \\sigma_i\\mathbf{u}_i\\mathbf{v}_i^T$ 的前 $k$ 项得到最佳秩 $k$ 逼近 $A_k$。误差 $A - A_k = \\sum_{i > k}\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^T$ 的奇异值为 $\\sigma_{k+1}, \\sigma_{k+2}, \\dots$，所以\n\n$$\\|A - A_k\\|_2 = \\sigma_{k+1}, \\qquad \\|A - A_k\\|_F^2 = \\sigma_{k+1}^2 + \\sigma_{k+2}^2 + \\cdots$$\n\n例如奇异值为 $9, 6, 2, 1$ 时，最佳秩 $2$ 逼近满足 $\\|A - A_2\\|_2 = 2$，$\\|A - A_2\\|_F^2 = 4 + 1 = 5$。\n\n> **注意。** 误差来自被舍弃的值，从 $\\sigma_{k+1}$ 开始，而不是最后保留的那个。谱范数误差是一个奇异值，而 Frobenius 误差的平方要把所有被舍弃值的平方相加。",
      ),
      generate(rng: Rng): Problem {
        const s4 = rng.int(1, 3);
        const s3 = s4 + rng.int(1, 3);
        const s2 = s3 + rng.int(1, 3);
        const s1 = s2 + rng.int(1, 4);
        const sig = [s1, s2, s3, s4];
        const k = rng.int(1, 2);
        const fro = rng.int(0, 1) === 0;
        const rest = sig.slice(k);
        const ans = fro ? rest.reduce((x, y) => x + y * y, 0) : sig[k]!;
        return numberProblem({
          prompt: t(
            `A matrix has singular values $${sig.join(", ")}$. Let $A_{${k}}$ be its best rank-$${k}$ approximation from the SVD. Find $${fro ? `\\|A - A_{${k}}\\|_F^2` : `\\|A - A_{${k}}\\|_2`}$.`,
            `某矩阵的奇异值为 $${sig.join(", ")}$。设 $A_{${k}}$ 为由奇异值分解得到的最佳秩 $${k}$ 逼近。求 $${fro ? `\\|A - A_{${k}}\\|_F^2` : `\\|A - A_{${k}}\\|_2`}$。`,
          ),
          answer: ans,
          mistakes: distinct(
            fro
              ? [
                  why(
                    rest.reduce((x, y) => x + y, 0),
                    "That adds the discarded singular values themselves; the squared Frobenius error adds their squares.",
                    "这是把被舍弃的奇异值本身相加了；Frobenius 误差的平方要把它们的平方相加。",
                  ),
                  why(
                    sig[k]! ** 2,
                    `$${sig[k]! ** 2}$ is only $\\sigma_{${k + 1}}^2$; every discarded value contributes its square.`,
                    `$${sig[k]! ** 2}$ 只是 $\\sigma_{${k + 1}}^2$；每个被舍弃的值都要贡献它的平方。`,
                  ),
                  why(
                    sig.slice(k + 1).reduce((x, y) => x + y * y, 0),
                    `That leaves out $\\sigma_{${k + 1}} = ${sig[k]}$, the first value that $A_{${k}}$ discards.`,
                    `这漏掉了 $\\sigma_{${k + 1}} = ${sig[k]}$，它是 $A_{${k}}$ 舍弃的第一个值。`,
                  ),
                  why(
                    sig.slice(0, k).reduce((x, y) => x + y * y, 0),
                    `That adds the squares of the kept values; it is $\\|A_{${k}}\\|_F^2$, not the error.`,
                    `这是把保留值的平方相加了；它是 $\\|A_{${k}}\\|_F^2$，不是误差。`,
                  ),
                ]
              : [
                  why(
                    sig[k - 1]!,
                    `$${sig[k - 1]}$ is $\\sigma_{${k}}$, the last value kept; the error starts with the first value discarded.`,
                    `$${sig[k - 1]}$ 是 $\\sigma_{${k}}$，最后保留的值；误差从第一个被舍弃的值开始。`,
                  ),
                  why(
                    sig[k + 1]!,
                    `$${sig[k + 1]}$ is $\\sigma_{${k + 2}}$; the largest discarded value is $\\sigma_{${k + 1}} = ${sig[k]}$.`,
                    `$${sig[k + 1]}$ 是 $\\sigma_{${k + 2}}$；被舍弃的最大值是 $\\sigma_{${k + 1}} = ${sig[k]}$。`,
                  ),
                  why(
                    rest.reduce((x, y) => x + y, 0),
                    "That adds all the discarded values; the spectral norm of the error is only the largest of them.",
                    "这是把所有被舍弃的值相加了；误差的谱范数只是其中最大的一个。",
                  ),
                  why(
                    rest.reduce((x, y) => x + y * y, 0),
                    `$${rest.reduce((x, y) => x + y * y, 0)}$ is the squared Frobenius error; the spectral error is $\\sigma_{${k + 1}}$ alone.`,
                    `$${rest.reduce((x, y) => x + y * y, 0)}$ 是 Frobenius 误差的平方；谱范数误差只是 $\\sigma_{${k + 1}}$。`,
                  ),
                ],
            ans,
          ),
          solution: walked(
            [
              [
                ["List the discarded values", "列出被舍弃的值"],
                t(
                  `$A_{${k}}$ keeps $${sig.slice(0, k).join(", ")}$ and discards $${rest.join(", ")}$; these are the singular values of $A - A_{${k}}$.`,
                  `$A_{${k}}$ 保留 $${sig.slice(0, k).join(", ")}$，舍弃 $${rest.join(", ")}$；它们就是 $A - A_{${k}}$ 的奇异值。`,
                ),
              ],
              fro
                ? [
                    ["Add their squares", "平方相加"],
                    t("", ""),
                    [`\\|A - A_{${k}}\\|_F^2 = ${rest.map((x) => `${x}^2`).join(" + ")} = ${ans}`],
                  ]
                : [
                    ["Take the largest", "取最大的"],
                    t(
                      `The spectral norm is the largest singular value of the error, $\\sigma_{${k + 1}} = ${ans}$.`,
                      `谱范数是误差的最大奇异值 $\\sigma_{${k + 1}} = ${ans}$。`,
                    ),
                  ],
            ],
            fro
              ? t(
                  `The kept part has $\\|A_{${k}}\\|_F^2 = ${sig.slice(0, k).reduce((x, y) => x + y * y, 0)}$, and the two add up to $\\|A\\|_F^2 = ${sig.reduce((x, y) => x + y * y, 0)}$.`,
                  `保留部分有 $\\|A_{${k}}\\|_F^2 = ${sig.slice(0, k).reduce((x, y) => x + y * y, 0)}$，两者相加得 $\\|A\\|_F^2 = ${sig.reduce((x, y) => x + y * y, 0)}$。`,
                )
              : t(
                  `$${ans}$ lies below $\\sigma_{${k}} = ${sig[k - 1]}$ and above $${sig[k + 1]}$, as the largest discarded value should.`,
                  `$${ans}$ 小于 $\\sigma_{${k}} = ${sig[k - 1]}$，大于 $${sig[k + 1]}$，正是被舍弃的最大值。`,
                ),
          ),
        });
      },
    },
  ],
};

/** singularValueDecompositionAndThePseudoinverseMatrix covers Moore-Penrose pseudoinverse via SVD. */
export const singularValueDecompositionAndThePseudoinverseMatrix: TopicDef = {
  id: "singular-value-decomposition-and-the-pseudoinverse-matrix",
  title: t("Singular Value Decomposition and the Pseudoinverse Matrix", "奇异值分解与伪逆矩阵"),
  summary: t(
    "Define and compute the Moore-Penrose pseudoinverse $A^+$ from the SVD, and apply it to minimal-norm solutions.",
    "定义并利用奇异值分解计算摩尔-彭罗斯伪逆 $A^+$，并应用于求极小范数解。",
  ),
  intro: t(
    "The column $A = (3, 4)$ has one singular value, $\\sigma = 5$, with $\\mathbf{u} = \\frac{1}{5}(3, 4)$. Inverting it and transposing gives $A^+ = V\\Sigma^+U^T = \\frac{1}{25}\\begin{pmatrix} 3 & 4 \\end{pmatrix}$. For $\\mathbf{b} = (1, 2)$, $A^+\\mathbf{b} = \\frac{3 + 8}{25} = \\frac{11}{25}$, the least-squares solution of $Ax = \\mathbf{b}$.\n\nCheck: the residual $\\mathbf{b} - \\frac{11}{25}A = \\frac{1}{25}(-8, 6)$ is orthogonal to $A$, since $3(-8) + 4 \\cdot 6 = 0$.\n\nIn this lesson we build the pseudoinverse $A^+ = V\\Sigma^+U^T$ by inverting the nonzero singular values, for diagonal matrices, single columns and general SVDs.",
    "列向量 $A = (3, 4)$ 有一个奇异值 $\\sigma = 5$，$\\mathbf{u} = \\frac{1}{5}(3, 4)$。取倒数再转置得 $A^+ = V\\Sigma^+U^T = \\frac{1}{25}\\begin{pmatrix} 3 & 4 \\end{pmatrix}$。对 $\\mathbf{b} = (1, 2)$，$A^+\\mathbf{b} = \\frac{3 + 8}{25} = \\frac{11}{25}$，即 $Ax = \\mathbf{b}$ 的最小二乘解。\n\n检验：残差 $\\mathbf{b} - \\frac{11}{25}A = \\frac{1}{25}(-8, 6)$ 与 $A$ 正交，因为 $3(-8) + 4 \\cdot 6 = 0$。\n\n本课我们通过把非零奇异值取倒数来构造伪逆 $A^+ = V\\Sigma^+U^T$，包括对角矩阵、单列矩阵和一般的奇异值分解。",
  ),
  prerequisites: ["singular-value-decomposition-of-larger-matrices"],
  encompasses: [],
  xp: 16,
  knowledgePoints: [
    {
      id: "moore-penrose-pseudoinverse",
      title: t("Moore-Penrose Pseudoinverse from SVD", "由 SVD 构造摩尔-彭罗斯伪逆"),
      explanation: t(
        "For a matrix with SVD $A = U \\Sigma V^T$, the Moore-Penrose pseudoinverse is $A^+ = V \\Sigma^+ U^T$, where $\\Sigma^+$ is formed by replacing every non-zero singular value $\\sigma_i$ by its reciprocal $\\frac{1}{\\sigma_i}$ and transposing. For example, $\\Sigma = \\begin{pmatrix} 4 & 0 \\\\ 0 & 2 \\end{pmatrix}$ has $\\Sigma^+ = \\begin{pmatrix} \\frac{1}{4} & 0 \\\\ 0 & \\frac{1}{2} \\end{pmatrix}$, and a zero singular value would stay $0$.\n\n> **Watch out.** Each reciprocal stays in the place of its own singular value, even though $\\frac{1}{\\sigma_1}$ is now the smaller entry. Reciprocals of positive numbers are positive, and the off-diagonal entries stay $0$.",
        "若矩阵 $A$ 的 SVD 分解为 $A = U \\Sigma V^T$，则其摩尔-彭罗斯伪逆为 $A^+ = V \\Sigma^+ U^T$。其中 $\\Sigma^+$ 是将 $\\Sigma$ 的每个非零奇异值 $\\sigma_i$ 替换为其倒数 $\\frac{1}{\\sigma_i}$ 并转置后得到的矩阵。例如 $\\Sigma = \\begin{pmatrix} 4 & 0 \\\\ 0 & 2 \\end{pmatrix}$ 有 $\\Sigma^+ = \\begin{pmatrix} \\frac{1}{4} & 0 \\\\ 0 & \\frac{1}{2} \\end{pmatrix}$，零奇异值则仍为 $0$。\n\n> **注意。** 每个倒数留在它自己的奇异值的位置上，即使 $\\frac{1}{\\sigma_1}$ 现在是较小的元素。正数的倒数仍为正，非对角元仍为 $0$。",
      ),
      generate: (rng: Rng): Problem => {
        // Singular values are listed from largest to smallest.
        const s1 = rng.int(3, 10);
        const s2 = rng.int(2, s1 - 1);

        const prompt = t(
          `Let $\\Sigma = ${mat2Latex([
            [s1, 0],
            [0, s2],
          ])}$ be the diagonal singular value matrix in an SVD. What is its pseudoinverse $\\Sigma^+$?`,
          `设 $\\Sigma = ${mat2Latex([
            [s1, 0],
            [0, s2],
          ])}$ 为某奇异值分解中的对角矩阵。求其伪逆矩阵 $\\Sigma^+$。`,
        );

        const right = t(
          `$${mat2StrLatex([
            [`\\frac{1}{${s1}}`, "0"],
            ["0", `\\frac{1}{${s2}}`],
          ])}$`,
          `$${mat2StrLatex([
            [`\\frac{1}{${s1}}`, "0"],
            ["0", `\\frac{1}{${s2}}`],
          ])}$`,
        );
        const wrong = [
          t(
            `$${mat2StrLatex([
              [`\\frac{1}{${s2}}`, "0"],
              ["0", `\\frac{1}{${s1}}`],
            ])}$`,
            `$${mat2StrLatex([
              [`\\frac{1}{${s2}}`, "0"],
              ["0", `\\frac{1}{${s1}}`],
            ])}$`,
          ),
          t(
            `$${mat2StrLatex([
              [`-\\frac{1}{${s1}}`, "0"],
              ["0", `-\\frac{1}{${s2}}`],
            ])}$`,
            `$${mat2StrLatex([
              [`-\\frac{1}{${s1}}`, "0"],
              ["0", `-\\frac{1}{${s2}}`],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [s1, 0],
              [0, s2],
            ])}$`,
            `$${mat2Latex([
              [s1, 0],
              [0, s2],
            ])}$`,
          ),
          t(
            `$${mat2StrLatex([
              ["0", `\\frac{1}{${s1}}`],
              [`\\frac{1}{${s2}}`, "0"],
            ])}$`,
            `$${mat2StrLatex([
              ["0", `\\frac{1}{${s1}}`],
              [`\\frac{1}{${s2}}`, "0"],
            ])}$`,
          ),
        ];

        const solution = walked(
          [
            [
              ["Invert each singular value", "每个奇异值取倒数"],
              t(
                `Both singular values are nonzero, so each is replaced by its reciprocal: $\\frac{1}{${s1}}$ and $\\frac{1}{${s2}}$.`,
                `两个奇异值都非零，所以各自换成倒数：$\\frac{1}{${s1}}$ 和 $\\frac{1}{${s2}}$。`,
              ),
            ],
            [
              ["Keep the places", "保持位置"],
              t(
                "Each reciprocal stays where its singular value was, and transposing a square diagonal matrix changes nothing:",
                "每个倒数留在原奇异值的位置；方的对角矩阵转置后不变：",
              ),
              [
                `\\Sigma^+ = ${mat2StrLatex([
                  [`\\frac{1}{${s1}}`, "0"],
                  ["0", `\\frac{1}{${s2}}`],
                ])}`,
              ],
            ],
          ],
          t(
            `$\\Sigma\\Sigma^+ = \\operatorname{diag}(${s1} \\cdot \\frac{1}{${s1}}, ${s2} \\cdot \\frac{1}{${s2}}) = I$, as it should be when no singular value is $0$.`,
            `$\\Sigma\\Sigma^+ = \\operatorname{diag}(${s1} \\cdot \\frac{1}{${s1}}, ${s2} \\cdot \\frac{1}{${s2}}) = I$，没有奇异值为 $0$ 时正应如此。`,
          ),
        );

        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `The reciprocals were swapped; $\\frac{1}{${s1}}$ belongs in the place of $${s1}$, and the product with $\\Sigma$ would not be $I$.`,
            `倒数位置互换了；$\\frac{1}{${s1}}$ 应在 $${s1}$ 的位置，否则与 $\\Sigma$ 的乘积不是 $I$。`,
          ],
          [wrong[1]!.en, "The reciprocal of a positive number is positive; no sign changes.", "正数的倒数仍为正；没有变号。"],
          [
            wrong[2]!.en,
            "That is $\\Sigma$ itself; each nonzero singular value must be inverted.",
            "这是 $\\Sigma$ 本身；每个非零奇异值都要取倒数。",
          ],
          [
            wrong[3]!.en,
            "The reciprocals belong on the diagonal; moving them off it gives a matrix whose product with $\\Sigma$ is not $I$.",
            "倒数应在对角线上；移到对角线外得到的矩阵与 $\\Sigma$ 的乘积不是 $I$。",
          ],
        ]);
      },
    },
    {
      id: "the-pseudoinverse-of-a-column-vector",
      title: t("The pseudoinverse of a single column", "单列矩阵的伪逆"),
      explanation: t(
        "A nonzero column $\\mathbf{a}$ has SVD $\\mathbf{a} = \\mathbf{u}\\,\\sigma\\,[1]$ with $\\sigma = \\|\\mathbf{a}\\|$ and $\\mathbf{u} = \\mathbf{a}/\\|\\mathbf{a}\\|$. Inverting the nonzero singular value and transposing gives\n\n$$\\mathbf{a}^+ = \\frac{\\mathbf{a}^T}{\\|\\mathbf{a}\\|^2}.$$\n\nSo $\\mathbf{a}^+\\mathbf{b} = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{\\mathbf{a} \\cdot \\mathbf{a}}$, which is the least-squares solution of $\\mathbf{a}x = \\mathbf{b}$. For example, $\\mathbf{a} = (1, 2, 2)$ and $\\mathbf{b} = (3, 0, 3)$ give $\\mathbf{a}^+\\mathbf{b} = \\frac{3 + 0 + 6}{9} = 1$.\n\n> **Watch out.** Divide by $\\|\\mathbf{a}\\|^2 = \\mathbf{a} \\cdot \\mathbf{a}$, the square of the singular value, not by $\\|\\mathbf{b}\\|^2$, and keep $\\mathbf{a} \\cdot \\mathbf{b}$ on top.",
        "非零列 $\\mathbf{a}$ 的奇异值分解为 $\\mathbf{a} = \\mathbf{u}\\,\\sigma\\,[1]$，$\\sigma = \\|\\mathbf{a}\\|$，$\\mathbf{u} = \\mathbf{a}/\\|\\mathbf{a}\\|$。把非零奇异值取倒数再转置得\n\n$$\\mathbf{a}^+ = \\frac{\\mathbf{a}^T}{\\|\\mathbf{a}\\|^2}$$\n\n所以 $\\mathbf{a}^+\\mathbf{b} = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{\\mathbf{a} \\cdot \\mathbf{a}}$，即 $\\mathbf{a}x = \\mathbf{b}$ 的最小二乘解。例如 $\\mathbf{a} = (1, 2, 2)$，$\\mathbf{b} = (3, 0, 3)$ 给出 $\\mathbf{a}^+\\mathbf{b} = \\frac{3 + 0 + 6}{9} = 1$。\n\n> **注意。** 要除以 $\\|\\mathbf{a}\\|^2 = \\mathbf{a} \\cdot \\mathbf{a}$，即奇异值的平方，而不是 $\\|\\mathbf{b}\\|^2$；$\\mathbf{a} \\cdot \\mathbf{b}$ 放在分子上。",
      ),
      generate(rng: Rng): Problem {
        const a = [rng.nonZero(-3, 3), rng.int(-3, 3), rng.nonZero(-3, 3)] as const;
        const drawn = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5)] as const;
        // b orthogonal to a would make every slip read 0, the answer, so the first entry moves by one.
        const b = a[0] * drawn[0] + a[1] * drawn[1] + a[2] * drawn[2] === 0 ? ([drawn[0] + 1, drawn[1], drawn[2]] as const) : drawn;
        const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        const nn = a[0] ** 2 + a[1] ** 2 + a[2] ** 2;
        const bb = b[0] ** 2 + b[1] ** 2 + b[2] ** 2;
        const ans = Q.of(dot, nn);
        const products = `${paren(a[0])} \\cdot ${paren(b[0])} + ${paren(a[1])} \\cdot ${paren(b[1])} + ${paren(a[2])} \\cdot ${paren(b[2])}`;
        return numberProblem({
          prompt: t(
            `Let $A = ${vec3Latex(a)}$, a $3 \\times 1$ matrix. Find $A^+\\mathbf{b}$ for $\\mathbf{b} = ${vec3Latex(b)}$.`,
            `设 $A = ${vec3Latex(a)}$ 为 $3 \\times 1$ 矩阵。对 $\\mathbf{b} = ${vec3Latex(b)}$ 求 $A^+\\mathbf{b}$。`,
          ),
          answer: ans,
          mistakes: distinct(
            [
              why(
                dot,
                `$${dot}$ is $A^T\\mathbf{b}$; $A^+ = \\frac{1}{\\|A\\|^2}A^T$ also divides by $\\|A\\|^2 = ${nn}$.`,
                `$${dot}$ 是 $A^T\\mathbf{b}$；$A^+ = \\frac{1}{\\|A\\|^2}A^T$ 还要除以 $\\|A\\|^2 = ${nn}$。`,
              ),
              why(
                Q.of(nn, dot),
                `That is the fraction upside down; $A^+\\mathbf{b} = \\frac{A \\cdot \\mathbf{b}}{A \\cdot A} = \\frac{${dot}}{${nn}}$.`,
                `分式倒过来了；$A^+\\mathbf{b} = \\frac{A \\cdot \\mathbf{b}}{A \\cdot A} = \\frac{${dot}}{${nn}}$。`,
              ),
              why(
                Q.of(dot, bb),
                `That divides by $\\|\\mathbf{b}\\|^2 = ${bb}$; the singular value belongs to $A$, so divide by $\\|A\\|^2 = ${nn}$.`,
                `这是除以了 $\\|\\mathbf{b}\\|^2 = ${bb}$；奇异值属于 $A$，应除以 $\\|A\\|^2 = ${nn}$。`,
              ),
            ],
            ans,
          ),
          solution: walked(
            [
              [
                ["Find the pseudoinverse", "求伪逆"],
                t(
                  `The single singular value is $\\sigma = \\|A\\|$, with $\\sigma^2 = ${nn}$, so`,
                  `唯一的奇异值是 $\\sigma = \\|A\\|$，$\\sigma^2 = ${nn}$，所以`,
                ),
                [`A^+ = \\frac{1}{${nn}}A^T`],
              ],
              [
                ["Apply it to $\\mathbf{b}$", "作用于 $\\mathbf{b}$"],
                t("", ""),
                [
                  `A^+\\mathbf{b} = \\frac{${products}}{${nn}} = \\frac{${dot}}{${nn}}${ans.isInteger() || ans.d !== BigInt(nn) ? ` = ${ans.toLatex()}` : ""}`,
                ],
              ],
            ],
            t(
              `The residual $\\mathbf{b} - x A$ with $x = ${ans.toLatex()}$ is orthogonal to $A$: $A \\cdot \\mathbf{b} - x\\,(A \\cdot A) = ${dot} - ${paren(dot)} = 0$.`,
              `取 $x = ${ans.toLatex()}$，残差 $\\mathbf{b} - x A$ 与 $A$ 正交：$A \\cdot \\mathbf{b} - x\\,(A \\cdot A) = ${dot} - ${paren(dot)} = 0$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 8.29: LINEAR LEAST-SQUARES PROBLEMS
// ════════════════════════════════════════════════════════════════════════════

/** leastSquaresSolutionOfALinearSystemWithoutCollinearity covers full column-rank least-squares systems. */
export const leastSquaresSolutionOfALinearSystemWithoutCollinearity: TopicDef = {
  id: "least-squares-solution-of-a-linear-system-without-collinearity",
  title: t("The Least-Squares Solution of a Linear System (Without Collinearity)", "线性方程组的最小二乘解（列满秩情形）"),
  summary: t(
    "Set up the normal equations $A^T A \\mathbf{x} = A^T \\mathbf{b}$ and solve for the unique least-squares solution when $A$ has full column rank.",
    "建立正规方程 $A^T A \\mathbf{x} = A^T \\mathbf{b}$，并在 $A$ 列满秩时求唯一的最小二乘解。",
  ),
  intro: t(
    "The system with $A = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$ and $\\mathbf{b} = (0, 2, 1)$ has no solution. The normal equations use $A^TA = \\begin{pmatrix} 3 & 3 \\\\ 3 & 5 \\end{pmatrix}$ and $A^T\\mathbf{b} = (3, 4)$: from $3x_1 + 3x_2 = 3$ and $3x_1 + 5x_2 = 4$ we get $x_2 = \\frac{1}{2}$ and $x_1 = \\frac{1}{2}$. So $\\hat{\\mathbf{x}} = (\\frac{1}{2}, \\frac{1}{2})$, with fitted vector $A\\hat{\\mathbf{x}} = (\\frac{1}{2}, 1, \\frac{3}{2})$.\n\nCheck: the residual $\\mathbf{b} - A\\hat{\\mathbf{x}} = (-\\frac{1}{2}, 1, -\\frac{1}{2})$ is orthogonal to both columns: $-\\frac{1}{2} + 1 - \\frac{1}{2} = 0$ and $0 + 1 - 1 = 0$.\n\nIn this lesson we solve the normal equations when the columns of $A$ are independent, take the shortcut for orthogonal columns, and measure the smallest squared error of the fit.",
    "$A = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$，$\\mathbf{b} = (0, 2, 1)$ 的方程组无解。正规方程用到 $A^TA = \\begin{pmatrix} 3 & 3 \\\\ 3 & 5 \\end{pmatrix}$ 和 $A^T\\mathbf{b} = (3, 4)$：由 $3x_1 + 3x_2 = 3$ 和 $3x_1 + 5x_2 = 4$ 得 $x_2 = \\frac{1}{2}$，$x_1 = \\frac{1}{2}$。所以 $\\hat{\\mathbf{x}} = (\\frac{1}{2}, \\frac{1}{2})$，拟合向量为 $A\\hat{\\mathbf{x}} = (\\frac{1}{2}, 1, \\frac{3}{2})$。\n\n检验：残差 $\\mathbf{b} - A\\hat{\\mathbf{x}} = (-\\frac{1}{2}, 1, -\\frac{1}{2})$ 与两列都正交：$-\\frac{1}{2} + 1 - \\frac{1}{2} = 0$，$0 + 1 - 1 = 0$。\n\n本课我们在 $A$ 的列线性无关时解正规方程，利用列正交时的捷径，并度量拟合的最小平方误差。",
  ),
  prerequisites: ["singular-value-decomposition-and-the-pseudoinverse-matrix"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "least-squares-normal-equations",
      title: t("Normal Equations for Full-Rank Systems", "正规方程与最小二乘解"),
      explanation: t(
        "For an inconsistent linear system $A x = b$ where $A$ has linearly independent columns (full column rank), $A^T A$ is invertible. The unique least-squares solution minimizing $\\|b - A x\\|$ satisfies the normal equations $A^T A \\hat{x} = A^T b$, given by $\\hat{x} = (A^T A)^{-1} A^T b$. For example, $A = \\begin{pmatrix} 1 & -1 \\\\ 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$ and $b = (0, 3, 3)$ give $A^TA = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}$ and $A^Tb = (6, 3)$, so $\\hat{x} = (2, \\frac{3}{2})$.\n\n> **Watch out.** Use all the equations through $A^T$; solving just two of the rows exactly ignores the others. And $A^Tb$ is not yet the answer: it still has to be solved against $A^TA$.",
        "对于矛盾线性方程组 $A x = b$，若 $A$ 为列满秩矩阵，则 $A^T A$ 可逆。使残差范数 $\\|b - A x\\|$ 最小的唯一最小二乘解满足正规方程 $A^T A \\hat{x} = A^T b$，其解为 $\\hat{x} = (A^T A)^{-1} A^T b$。例如 $A = \\begin{pmatrix} 1 & -1 \\\\ 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$，$b = (0, 3, 3)$ 给出 $A^TA = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}$，$A^Tb = (6, 3)$，所以 $\\hat{x} = (2, \\frac{3}{2})$。\n\n> **注意。** 要通过 $A^T$ 用上全部方程；只把其中两行解出来会忽略其余的方程。$A^Tb$ 还不是答案：还要用 $A^TA$ 去解。",
      ),
      generate: (rng: Rng): Problem => {
        const xHat1 = rng.int(-3, 3);
        const xHat2 = rng.int(-3, 3);
        const r = rng.nonZero(-2, 2);

        // A is 3x2 with orthogonal columns [1, 1, 1]^T and [-1, 0, 1]^T
        // Residual vector e = r * [1, -2, 1]^T is orthogonal to Col(A)
        const b1 = xHat1 - xHat2 + r;
        const b2 = xHat1 - 2 * r;
        const b3 = xHat1 + xHat2 + r;

        const A: Mat3x2 = [
          [1, -1],
          [1, 0],
          [1, 1],
        ];

        const prompt = t(
          `Find the least-squares solution vector $\\hat{x} = \\langle x_1, x_2 \\rangle$ of the linear system $A x = b$, where\n\n$$A = ${mat3x2Latex(A)}, \\quad b = ${vec3Latex([b1, b2, b3])}.$$\n\nEnter the vector as $\\langle x_1, x_2 \\rangle$.`,
          `求线性方程组 $A x = b$ 的最小二乘解向量 $\\hat{x} = \\langle x_1, x_2 \\rangle$，其中\n\n$$A = ${mat3x2Latex(A)}, \\quad b = ${vec3Latex([b1, b2, b3])}$$\n\n以 $\\langle x_1, x_2 \\rangle$ 的形式输入向量。`,
        );

        const sumB = b1 + b2 + b3;
        const diffB = -b1 + b3;

        const solution = walked(
          [
            [
              ["Form $A^TA$", "构造 $A^TA$"],
              t("The two columns are orthogonal, so $A^TA$ is diagonal:", "两列正交，所以 $A^TA$ 是对角的："),
              [`A^T A = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}`],
            ],
            [
              ["Form $A^Tb$", "构造 $A^Tb$"],
              t("", ""),
              [
                `A^T b = \\begin{pmatrix} ${b1} ${signed(b2)} ${signed(b3)} \\\\ ${-b1} ${signed(b3)} \\end{pmatrix} = ${vec2Latex([sumB, diffB])}`,
              ],
            ],
            [
              ["Solve", "求解"],
              t("", ""),
              [`\\hat{x}_1 = \\frac{${sumB}}{3} = ${xHat1}, \\quad \\hat{x}_2 = \\frac{${diffB}}{2} = ${xHat2}`],
            ],
          ],
          t(
            `The residual $b - A\\hat{x} = (${b1 - xHat1 + xHat2}, ${b2 - xHat1}, ${b3 - xHat1 - xHat2})$ is orthogonal to both columns: its entries add up to $0$, and $-(${b1 - xHat1 + xHat2}) + (${b3 - xHat1 - xHat2}) = 0$.`,
            `残差 $b - A\\hat{x} = (${b1 - xHat1 + xHat2}, ${b2 - xHat1}, ${b3 - xHat1 - xHat2})$ 与两列都正交：各分量之和为 $0$，且 $-(${b1 - xHat1 + xHat2}) + (${b3 - xHat1 - xHat2}) = 0$。`,
          ),
        );

        const wrong = [
          [sumB, diffB],
          [b2, b2 - b1],
          [b2, b3 - b2],
          [xHat2, xHat1],
        ];
        return withMistakes(
          pointProblem({ prompt, answer: [xHat1, xHat2], vector: true, vars: ["x_1", "x_2"], solution, wrong }),
          dedupeSaid(
            [
              say(
                vectorLatex(wrong[0]!),
                `That is $A^Tb$; the normal equations still divide by the diagonal entries $3$ and $2$ of $A^TA$.`,
                `这是 $A^Tb$；正规方程还要除以 $A^TA$ 的对角元 $3$ 和 $2$。`,
              ),
              say(
                vectorLatex(wrong[1]!),
                "That solves the first two equations exactly and ignores the third; least squares uses all three through $A^T$.",
                "这是把前两个方程精确解出而忽略了第三个；最小二乘要通过 $A^T$ 用上全部三个方程。",
              ),
              say(
                vectorLatex(wrong[2]!),
                "That solves the last two equations exactly and ignores the first; least squares uses all three through $A^T$.",
                "这是把后两个方程精确解出而忽略了第一个；最小二乘要通过 $A^T$ 用上全部三个方程。",
              ),
              say(
                vectorLatex(wrong[3]!),
                `The entries are swapped: $\\hat{x}_1$ comes from the column of ones, $\\frac{${sumB}}{3} = ${xHat1}$.`,
                `分量顺序反了：$\\hat{x}_1$ 来自全为 1 的那一列，$\\frac{${sumB}}{3} = ${xHat1}$。`,
              ),
            ],
            vectorLatex([xHat1, xHat2]),
          ),
        );
      },
    },
    {
      id: "least-squares-with-orthogonal-columns",
      title: t("Least squares with orthogonal columns", "列正交时的最小二乘"),
      explanation: t(
        "The normal equations $A^TA\\hat{\\mathbf{x}} = A^T\\mathbf{b}$ become very simple when the columns of $A$ are orthogonal: $A^TA$ is diagonal, and each unknown is found separately,\n\n$$\\hat{x}_i = \\frac{\\mathbf{a}_i \\cdot \\mathbf{b}}{\\mathbf{a}_i \\cdot \\mathbf{a}_i}.$$\n\nFor example, the columns $(1, 1, 1)$ and $(-1, 0, 1)$ are orthogonal, which is why centered $x$-values make straight-line fits easy. With $\\mathbf{b} = (1, 2, 6)$ they give $\\hat{x}_1 = \\frac{9}{3} = 3$ and $\\hat{x}_2 = \\frac{-1 + 6}{2} = \\frac{5}{2}$.\n\n> **Watch out.** Divide each dot product by $\\mathbf{a}_i \\cdot \\mathbf{a}_i$, the squared length of its own column: for $(-s, 0, s)$ that is $2s^2$, not $s^2$. The first unknown is the average of all of $\\mathbf{b}$, not its middle entry.",
        "当 $A$ 的列正交时，正规方程 $A^TA\\hat{\\mathbf{x}} = A^T\\mathbf{b}$ 变得非常简单：$A^TA$ 是对角的，每个未知数可以单独求出，\n\n$$\\hat{x}_i = \\frac{\\mathbf{a}_i \\cdot \\mathbf{b}}{\\mathbf{a}_i \\cdot \\mathbf{a}_i}$$\n\n例如列 $(1, 1, 1)$ 与 $(-1, 0, 1)$ 正交，这就是中心化的 $x$ 值让直线拟合变容易的原因。取 $\\mathbf{b} = (1, 2, 6)$，得 $\\hat{x}_1 = \\frac{9}{3} = 3$，$\\hat{x}_2 = \\frac{-1 + 6}{2} = \\frac{5}{2}$。\n\n> **注意。** 每个点积要除以 $\\mathbf{a}_i \\cdot \\mathbf{a}_i$，即它自己那一列长度的平方：对 $(-s, 0, s)$ 是 $2s^2$，不是 $s^2$。第一个未知数是 $\\mathbf{b}$ 全部分量的平均值，不是中间那个分量。",
      ),
      generate(rng: Rng): Problem {
        const s = rng.int(1, 2);
        const A: Mat3x2 = [
          [1, -s],
          [1, 0],
          [1, s],
        ];
        const drawn = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6)] as const;
        // Equal end entries would make the second unknown 0, where several slips agree with the answer.
        const b = drawn[2] === drawn[0] ? ([drawn[0], drawn[1], drawn[2] + 1] as const) : drawn;
        const sum = b[0] + b[1] + b[2];
        const top = s * (b[2] - b[0]);
        const x1 = Q.of(sum, 3);
        const x2 = Q.of(top, 2 * s * s);
        const wrong = [
          [Q.of(sum), Q.of(top)],
          [x1, Q.of(top, s * s)],
          [Q.of(b[1]), x2],
          [x2, x1],
        ];
        return withMistakes(
          pointProblem({
            prompt: t(
              `Find the least-squares solution $\\hat{\\mathbf{x}}$ of $A\\mathbf{x} = \\mathbf{b}$ with $A = ${mat3x2Latex(A)}$ and $\\mathbf{b} = ${vec3Latex(b)}$.`,
              `求 $A\\mathbf{x} = \\mathbf{b}$ 的最小二乘解 $\\hat{\\mathbf{x}}$，$A = ${mat3x2Latex(A)}$，$\\mathbf{b} = ${vec3Latex(b)}$。`,
            ),
            answer: [x1, x2],
            vector: true,
            vars: ["x_1", "x_2"],
            wrong,
            solution: walked(
              [
                [
                  ["Check the columns", "检查各列"],
                  t(
                    `$(1, 1, 1) \\cdot (${-s}, 0, ${s}) = 0$, so the unknowns separate, with $\\mathbf{a}_1 \\cdot \\mathbf{a}_1 = 3$ and $\\mathbf{a}_2 \\cdot \\mathbf{a}_2 = ${2 * s * s}$.`,
                    `$(1, 1, 1) \\cdot (${-s}, 0, ${s}) = 0$，所以未知数可以分开求，$\\mathbf{a}_1 \\cdot \\mathbf{a}_1 = 3$，$\\mathbf{a}_2 \\cdot \\mathbf{a}_2 = ${2 * s * s}$。`,
                  ),
                ],
                [
                  ["Divide the dot products", "点积相除"],
                  t("", ""),
                  [
                    `\\hat{x}_1 = \\frac{${b[0]} ${signed(b[1])} ${signed(b[2])}}{3} = ${x1.toLatex()}, \\quad \\hat{x}_2 = \\frac{${s === 1 ? "" : s}(${b[2]} - ${paren(b[0])})}{${2 * s * s}} = ${x2.toLatex()}`,
                  ],
                ],
              ],
              t(
                `The residual is orthogonal to the column of ones: its entries add up to $${sum} - 3 \\cdot ${x1.toLatex().startsWith("-") ? `(${x1.toLatex()})` : x1.toLatex()} = 0$.`,
                `残差与全为 1 的列正交：其分量之和为 $${sum} - 3 \\cdot ${x1.toLatex().startsWith("-") ? `(${x1.toLatex()})` : x1.toLatex()} = 0$。`,
              ),
            ),
          }),
          dedupeSaid(
            [
              say(
                vectorLatex(wrong[0]!),
                "That is $A^T\\mathbf{b}$; each dot product must still be divided by the squared length of its column.",
                "这是 $A^T\\mathbf{b}$；每个点积还要除以所在列长度的平方。",
              ),
              say(
                vectorLatex(wrong[1]!),
                `The second column $(${-s}, 0, ${s})$ has squared length $${2 * s * s}$, not $${s * s}$: both nonzero entries count.`,
                `第二列 $(${-s}, 0, ${s})$ 长度的平方是 $${2 * s * s}$，不是 $${s * s}$：两个非零分量都要算。`,
              ),
              say(
                vectorLatex(wrong[2]!),
                `$${b[1]}$ is the middle entry of $\\mathbf{b}$; $\\hat{x}_1$ is the average of all three, $\\frac{${sum}}{3}$.`,
                `$${b[1]}$ 是 $\\mathbf{b}$ 的中间分量；$\\hat{x}_1$ 是三个分量的平均值 $\\frac{${sum}}{3}$。`,
              ),
              say(
                vectorLatex(wrong[3]!),
                "The entries are swapped: $\\hat{x}_1$ belongs to the column of ones.",
                "分量顺序反了：$\\hat{x}_1$ 对应全为 1 的那一列。",
              ),
            ],
            vectorLatex([x1, x2]),
          ),
        );
      },
    },
  ],
};

/** leastSquaresSolutionOfALinearSystemWithCollinearity covers least-squares with linearly dependent columns. */
export const leastSquaresSolutionOfALinearSystemWithCollinearity: TopicDef = {
  id: "least-squares-solution-of-a-linear-system-with-collinearity",
  title: t("The Least-Squares Solution of a Linear System (With Collinearity)", "线性方程组的最小二乘解（非列满秩情形）"),
  summary: t(
    "Analyze least-squares solutions when collinearity causes infinitely many solutions and identify the minimal-norm solution.",
    "分析列相关引起无穷多解时的最小二乘问题，并确定唯一的极小范数解。",
  ),
  intro: t(
    "In $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$ the second column is twice the first, so the column space is the line through $(1, 2)$. For $\\mathbf{b} = (5, 0)$ the projection onto that line is $\\frac{5}{5}(1, 2) = (1, 2)$, so every least-squares solution satisfies $x_1 + 2x_2 = 1$: a whole line of them. The one of smallest norm lies along the row direction $(1, 2)$, which gives $\\hat{\\mathbf{x}} = (\\frac{1}{5}, \\frac{2}{5})$.\n\nCheck: the residual $\\mathbf{b} - (1, 2) = (4, -2)$ is orthogonal to the column space, since $4 \\cdot 1 + (-2) \\cdot 2 = 0$.\n\nIn this lesson we see why dependent columns give infinitely many least-squares solutions, count the solutions from the columns, and find the fitted vector, which stays unique.",
    "在 $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$ 中第二列是第一列的两倍，所以列空间是过 $(1, 2)$ 的直线。对 $\\mathbf{b} = (5, 0)$，它在这条直线上的投影是 $\\frac{5}{5}(1, 2) = (1, 2)$，所以每个最小二乘解都满足 $x_1 + 2x_2 = 1$：解构成一整条直线。其中范数最小的解沿行方向 $(1, 2)$，得 $\\hat{\\mathbf{x}} = (\\frac{1}{5}, \\frac{2}{5})$。\n\n检验：残差 $\\mathbf{b} - (1, 2) = (4, -2)$ 与列空间正交，因为 $4 \\cdot 1 + (-2) \\cdot 2 = 0$。\n\n本课我们说明为什么列相关时最小二乘解有无穷多个，由列判断解的个数，并求出仍然唯一的拟合向量。",
  ),
  prerequisites: ["least-squares-solution-of-a-linear-system-without-collinearity"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "least-squares-collinear-min-norm",
      title: t("Collinearity and Minimal-Norm Solution", "列相关与极小范数解"),
      explanation: t(
        "When the columns of $A$ are linearly dependent, $A^T A$ is singular. The normal equations $A^T A \\hat{x} = A^T b$ have infinitely many solutions, forming the affine set $\\hat{x}_0 + \\operatorname{Nul}(A)$. Among all least-squares solutions, there is a unique solution with minimal Euclidean norm $\\|\\hat{x}\\|$, given by the pseudoinverse $\\hat{x}_{\\text{min}} = A^+ b$. For example, for $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$ and $b = (5, 0)$ the least-squares solutions are the line $x_1 + 2x_2 = 1$, and the shortest is $(\\frac{1}{5}, \\frac{2}{5})$.\n\n> **Watch out.** A singular $A^TA$ does not mean there is no least-squares solution: the projection of $b$ always exists. It means the solutions are not unique, and $(A^TA)^{-1}$ cannot be used.",
        "当 $A$ 的列向量线性相关时，$A^T A$ 奇异。正规方程 $A^T A \\hat{x} = A^T b$ 有无穷多组解，构成仿射集 $\\hat{x}_0 + \\operatorname{Nul}(A)$。在所有最小二乘解中，存在唯一的欧氏范数 $\\|\\hat{x}\\|$ 最小的解，由伪逆给出：$\\hat{x}_{\\text{min}} = A^+ b$。例如对 $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$ 和 $b = (5, 0)$，最小二乘解是直线 $x_1 + 2x_2 = 1$，其中最短的是 $(\\frac{1}{5}, \\frac{2}{5})$。\n\n> **注意。** $A^TA$ 奇异并不表示没有最小二乘解：$b$ 的投影总是存在的。它表示解不唯一，并且不能用 $(A^TA)^{-1}$。",
      ),
      generate: (rng: Rng): Problem => {
        const c1 = rng.nonZero(-4, 4);
        const c2 = rng.nonZero(-4, 4);
        const mult = rng.int(2, 5);

        const prompt = t(
          `Consider the linear system $A x = b$ where $A = \\begin{pmatrix} ${c1} & ${mult * c1} \\\\ ${c2} & ${mult * c2} \\end{pmatrix}$. Because the columns of $A$ are collinear, which statement correctly describes the set of least-squares solutions?`,
          `考虑线性系统 $A x = b$，其中 $A = \\begin{pmatrix} ${c1} & ${mult * c1} \\\\ ${c2} & ${mult * c2} \\end{pmatrix}$。由于 $A$ 的两列共线，下列哪个陈述正确描述了其最小二乘解集？`,
        );

        const right = t(
          "There are infinitely many least-squares solutions, and the unique solution of minimal norm is given by $\\hat{x}_{\\text{min}} = A^+ b$.",
          "存在无穷多个最小二乘解，且极小范数最小二乘解是唯一的，由 $\\hat{x}_{\\text{min}} = A^+ b$ 给出。",
        );
        const wrong = [
          t(
            "There is a unique least-squares solution given by $\\hat{x} = (A^T A)^{-1} A^T b$.",
            "存在唯一的最小二乘解，由 $\\hat{x} = (A^T A)^{-1} A^T b$ 给出。",
          ),
          t("No least-squares solution exists because $A^T A$ is singular.", "由于 $A^T A$ 奇异，该系统没有任何最小二乘解。"),
          t("Every vector in $\\mathbb{R}^2$ is a least-squares solution.", "$\\mathbb{R}^2$ 中的任意向量都是该系统的最小二乘解。"),
          t("The least-squares solutions form a 2-dimensional vector space.", "所有最小二乘解构成一个 2 维向量空间。"),
        ];

        const solution = walked(
          [
            [
              ["Compare the columns", "比较各列"],
              t(
                `Column $2$ is $${mult}$ times column $1$, so $\\operatorname{rank}(A) = 1$ and $A^TA$ is singular.`,
                `第 $2$ 列是第 $1$ 列的 $${mult}$ 倍，所以 $\\operatorname{rank}(A) = 1$，$A^TA$ 奇异。`,
              ),
            ],
            [
              ["Describe the solutions", "描述解集"],
              t(
                `The projection of $b$ onto the column space always exists, so the normal equations are consistent. Any multiple of $(${-mult}, 1)$ can be added to a solution, so they form a line $\\hat{x}_0 + \\operatorname{Nul}(A)$.`,
                `$b$ 在列空间上的投影总存在，所以正规方程相容。任一解加上 $(${-mult}, 1)$ 的倍数仍是解，所以解构成直线 $\\hat{x}_0 + \\operatorname{Nul}(A)$。`,
              ),
            ],
            [
              ["Pick the shortest", "取最短的"],
              t(
                "On that line exactly one point is closest to the origin, and it is $\\hat{x}_{\\text{min}} = A^+ b$.",
                "这条直线上恰有一个点离原点最近，它就是 $\\hat{x}_{\\text{min}} = A^+ b$。",
              ),
            ],
          ],
          t(
            `$A(${-mult}, 1) = (${-mult} \\cdot ${paren(c1)} ${signed(mult * c1)}, ${-mult} \\cdot ${paren(c2)} ${signed(mult * c2)}) = (0, 0)$, so $(${-mult}, 1)$ is in the null space.`,
            `$A(${-mult}, 1) = (${-mult} \\cdot ${paren(c1)} ${signed(mult * c1)}, ${-mult} \\cdot ${paren(c2)} ${signed(mult * c2)}) = (0, 0)$，所以 $(${-mult}, 1)$ 在零空间中。`,
          ),
        );

        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "That formula needs $A^TA$ to be invertible, and with dependent columns it is singular.",
            "这个公式要求 $A^TA$ 可逆，而列相关时它是奇异的。",
          ],
          [
            wrong[1]!.en,
            "A least-squares solution always exists, because $b$ always has a projection onto the column space.",
            "最小二乘解总是存在，因为 $b$ 在列空间上总有投影。",
          ],
          [
            wrong[2]!.en,
            "Only vectors with $Ax$ equal to the projection of $b$ qualify, and these form a line, not the whole plane.",
            "只有使 $Ax$ 等于 $b$ 的投影的向量才是解，它们构成一条直线，而不是整个平面。",
          ],
          [
            wrong[3]!.en,
            "The null space of $A$ is one-dimensional, so the solutions form a line; they fill the plane only if $A = 0$.",
            "$A$ 的零空间是一维的，所以解构成一条直线；只有 $A = 0$ 时才会充满平面。",
          ],
        ]);
      },
    },
    {
      id: "counting-least-squares-solutions",
      title: t("How many least-squares solutions?", "最小二乘解有几个？"),
      explanation: t(
        'Every system $A\\mathbf{x} = \\mathbf{b}$ has at least one least-squares solution, because the projection of $\\mathbf{b}$ onto the column space always exists. The solution is unique exactly when the columns of $A$ are linearly independent, so that $A^TA$ is invertible. When the columns are collinear or otherwise dependent, any vector in the null space can be added, and there are infinitely many least-squares solutions. For example, the columns $(1, 0, 2)$ and $(2, 0, 4)$ are collinear, so a system with them has infinitely many least-squares solutions, whatever $\\mathbf{b}$ is; $(1, 0, 2)$ and $(2, 1, 4)$ are not, so the solution is unique.\n\n> **Watch out.** The answer never depends on $\\mathbf{b}$, and it is never "none". Check whether one column is a multiple of the other in every entry; agreeing in two entries is not enough.',
        "每个方程组 $A\\mathbf{x} = \\mathbf{b}$ 至少有一个最小二乘解，因为 $\\mathbf{b}$ 在列空间上的投影总存在。解唯一当且仅当 $A$ 的列线性无关，此时 $A^TA$ 可逆。当列共线或以其他方式相关时，可以加上零空间中的任意向量，最小二乘解有无穷多个。例如列 $(1, 0, 2)$ 与 $(2, 0, 4)$ 共线，所以无论 $\\mathbf{b}$ 是什么，方程组都有无穷多个最小二乘解；$(1, 0, 2)$ 与 $(2, 1, 4)$ 不共线，所以解唯一。\n\n> **注意。** 答案与 $\\mathbf{b}$ 无关，也从来不会是“没有”。要检查一列是否在每个分量上都是另一列的同一倍数；只有两个分量相符是不够的。",
      ),
      generate(rng: Rng): Problem {
        const c = [rng.nonZero(-4, 4), rng.int(-4, 4), rng.nonZero(-4, 4)];
        const dependent = rng.int(0, 1) === 0;
        const m = rng.pick([-3, -2, 2, 3]);
        const d = dependent ? c.map((x) => m * x) : [c[0]! * m, c[1]! * m + rng.nonZero(-2, 2), c[2]! * m];
        const A: Mat3x2 = [
          [c[0]!, d[0]!],
          [c[1]!, d[1]!],
          [c[2]!, d[2]!],
        ];
        const b = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5)] as const;
        const one = t("Exactly one", "恰好一个");
        const inf = t("Infinitely many", "无穷多个");
        const none = t("None", "没有");
        const cc = c[0]! ** 2 + c[1]! ** 2 + c[2]! ** 2;
        const dd = d[0]! ** 2 + d[1]! ** 2 + d[2]! ** 2;
        const cd = c[0]! * d[0]! + c[1]! * d[1]! + c[2]! * d[2]!;
        const solution = walked(
          [
            [
              ["Compare the columns", "比较各列"],
              dependent
                ? t(
                    `Every entry of the second column is $${m}$ times the matching entry of the first, so the columns are dependent.`,
                    `第二列的每个分量都是第一列对应分量的 $${m}$ 倍，所以两列线性相关。`,
                  )
                : t(
                    `The first and third entries of the second column are $${m}$ times those of the first, but the middle one is $${d[1]}$, not $${m * c[1]!}$; so the columns are independent.`,
                    `第二列的第一、第三个分量是第一列的 $${m}$ 倍，但中间分量是 $${d[1]}$，不是 $${m * c[1]!}$；所以两列线性无关。`,
                  ),
            ],
            [
              ["Count the solutions", "数解的个数"],
              dependent
                ? t(
                    `A least-squares solution exists, and adding any multiple of $(${-m}, 1)$, which $A$ sends to $\\mathbf{0}$, gives another: infinitely many.`,
                    `最小二乘解存在，再加上被 $A$ 送到 $\\mathbf{0}$ 的 $(${-m}, 1)$ 的任意倍数仍是解：有无穷多个。`,
                  )
                : t("$A^TA$ is invertible, so the normal equations have exactly one solution.", "$A^TA$ 可逆，所以正规方程恰有一个解。"),
            ],
          ],
          t(
            `$\\det(A^TA) = ${cc} \\cdot ${dd} - ${paren(cd)}^2 = ${cc * dd - cd * cd}$, ${dependent ? "so $A^TA$ is singular" : "which is not $0$"}.`,
            `$\\det(A^TA) = ${cc} \\cdot ${dd} - ${paren(cd)}^2 = ${cc * dd - cd * cd}$，${dependent ? "所以 $A^TA$ 奇异" : "不为 $0$"}。`,
          ),
        );
        return reasoned(
          oneOf(
            rng,
            t(
              `How many least-squares solutions does $A\\mathbf{x} = \\mathbf{b}$ have for $A = ${mat3x2Latex(A)}$ and $\\mathbf{b} = ${vec3Latex(b)}$?`,
              `对 $A = ${mat3x2Latex(A)}$ 与 $\\mathbf{b} = ${vec3Latex(b)}$，$A\\mathbf{x} = \\mathbf{b}$ 有几个最小二乘解？`,
            ),
            dependent ? inf : one,
            [dependent ? one : inf, none],
            solution,
          ),
          [
            dependent
              ? [
                  one.en,
                  `The columns are dependent, so $A^TA$ is singular and the solution is not unique.`,
                  `两列线性相关，所以 $A^TA$ 奇异，解不唯一。`,
                ]
              : [
                  inf.en,
                  `Agreeing in the outer entries is not enough: the middle entries break the ratio $${m}$, so the columns are independent.`,
                  `外侧分量相符还不够：中间分量不满足比 $${m}$，所以两列线性无关。`,
                ],
            [
              none.en,
              "There is always at least one, because $\\mathbf{b}$ always has a projection onto the column space.",
              "至少总有一个，因为 $\\mathbf{b}$ 在列空间上总有投影。",
            ],
          ],
        );
      },
    },
  ],
};

/** findingALeastSquaresSolutionUsingQrFactorization covers solving least squares via QR factorization. */
export const findingALeastSquaresSolutionUsingQrFactorization: TopicDef = {
  id: "finding-a-least-squares-solution-using-qr-factorization",
  title: t("Finding a Least-Squares Solution Using QR Factorization", "利用 QR 分解求最小二乘解"),
  summary: t(
    "Solve least-squares problems stably by turning the normal equations into the triangular system $R\\mathbf{x} = Q^T \\mathbf{b}$.",
    "将正规方程化为上三角方程组 $R\\mathbf{x} = Q^T \\mathbf{b}$，利用 QR 分解稳定地求解最小二乘问题。",
  ),
  intro: t(
    "Let $A = QR$ with $Q = \\frac{1}{2}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\\\ 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$ and $R = \\begin{pmatrix} 2 & 4 \\\\ 0 & 2 \\end{pmatrix}$, so the rows of $A$ are $(1, 3), (1, 1), (1, 3), (1, 1)$. For $\\mathbf{b} = (2, 0, 4, 2)$, $Q^T\\mathbf{b} = (\\frac{2 + 0 + 4 + 2}{2}, \\frac{2 - 0 + 4 - 2}{2}) = (4, 2)$. Back-substitution in $R\\hat{\\mathbf{x}} = Q^T\\mathbf{b}$ gives $2\\hat{x}_2 = 2$, so $\\hat{x}_2 = 1$, and then $2\\hat{x}_1 + 4 = 4$, so $\\hat{x}_1 = 0$.\n\nCheck: $A\\hat{\\mathbf{x}} = (3, 1, 3, 1)$, and the residual $(-1, -1, 1, 1)$ is orthogonal to both columns of $A$: $-1 - 1 + 1 + 1 = 0$ and $-3 - 1 + 3 + 1 = 0$.\n\nIn this lesson we solve least-squares problems from a QR factorization: compute $Q^T\\mathbf{b}$, back-substitute in $R$, and read off the size of the residual.",
    "设 $A = QR$，$Q = \\frac{1}{2}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\\\ 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$，$R = \\begin{pmatrix} 2 & 4 \\\\ 0 & 2 \\end{pmatrix}$，于是 $A$ 的各行为 $(1, 3), (1, 1), (1, 3), (1, 1)$。对 $\\mathbf{b} = (2, 0, 4, 2)$，$Q^T\\mathbf{b} = (\\frac{2 + 0 + 4 + 2}{2}, \\frac{2 - 0 + 4 - 2}{2}) = (4, 2)$。在 $R\\hat{\\mathbf{x}} = Q^T\\mathbf{b}$ 中回代：$2\\hat{x}_2 = 2$，所以 $\\hat{x}_2 = 1$；再由 $2\\hat{x}_1 + 4 = 4$ 得 $\\hat{x}_1 = 0$。\n\n检验：$A\\hat{\\mathbf{x}} = (3, 1, 3, 1)$，残差 $(-1, -1, 1, 1)$ 与 $A$ 的两列都正交：$-1 - 1 + 1 + 1 = 0$，$-3 - 1 + 3 + 1 = 0$。\n\n本课我们由 QR 分解求最小二乘解：计算 $Q^T\\mathbf{b}$，在 $R$ 中回代，并读出残差的大小。",
  ),
  prerequisites: ["least-squares-solution-of-a-linear-system-with-collinearity"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "least-squares-qr-solution",
      title: t("Least-Squares via R x = Q^T b", "利用 R x = Q^T b 求解最小二乘"),
      explanation: t(
        "If $A = Q R$ where $Q$ has orthonormal columns ($Q^T Q = I$) and $R$ is upper triangular and invertible, the normal equations $A^T A \\hat{x} = A^T b$ simplify to $R \\hat{x} = Q^T b$. This upper-triangular system is solved directly by back-substitution without computing $A^T A$. For example, $R = \\begin{pmatrix} 2 & 3 \\\\ 0 & 4 \\end{pmatrix}$ and $Q^Tb = (7, 4)$ give $\\hat{x}_2 = 1$ from the last row, and then $2\\hat{x}_1 = 7 - 3 = 4$, so $\\hat{x} = (2, 1)$.\n\n> **Watch out.** $Q^Tb$ is the right-hand side, not the solution. Start from the bottom row, and move the known term $r_{12}\\hat{x}_2$ to the right side with its sign changed before dividing by $r_{11}$.",
        "若 $A = Q R$，其中 $Q$ 的列标准正交（$Q^T Q = I$），$R$ 为可逆上三角矩阵，则正规方程 $A^T A \\hat{x} = A^T b$ 简化为上三角方程组 $R \\hat{x} = Q^T b$。无需计算 $A^T A$，通过回代即可直接求解。例如 $R = \\begin{pmatrix} 2 & 3 \\\\ 0 & 4 \\end{pmatrix}$，$Q^Tb = (7, 4)$，由最后一行得 $\\hat{x}_2 = 1$，再由 $2\\hat{x}_1 = 7 - 3 = 4$ 得 $\\hat{x} = (2, 1)$。\n\n> **注意。** $Q^Tb$ 是右端，不是解。要从最下面一行开始，把已知项 $r_{12}\\hat{x}_2$ 变号移到右边，再除以 $r_{11}$。",
      ),
      generate: (rng: Rng): Problem => {
        const r11 = rng.nonZero(1, 4);
        // A zero r12 or a zero second unknown would make back-substitution slips agree with the answer.
        const r12Drawn = rng.int(-3, 3);
        const r12 = r12Drawn === 0 ? 1 : r12Drawn;
        const r22 = rng.nonZero(1, 4);

        const x2Drawn = rng.int(-3, 3);
        const xHat2 = x2Drawn === 0 ? -1 : x2Drawn;
        const xHat1 = rng.int(-3, 3);

        const d2 = r22 * xHat2;
        const d1 = r11 * xHat1 + r12 * xHat2;

        const prompt = t(
          `Given the QR factorization $A = QR$ of a matrix $A$ with full column rank, where $R = ${mat2Latex([
            [r11, r12],
            [0, r22],
          ])}$ and $Q^T b = ${vec2Latex([d1, d2])}$, solve for the least-squares solution $\\hat{x}$. Enter the vector as $\\langle x_1, x_2 \\rangle$.`,
          `已知列满秩矩阵 $A$ 的 QR 分解 $A = QR$，其中 $R = ${mat2Latex([
            [r11, r12],
            [0, r22],
          ])}$ 且 $Q^T b = ${vec2Latex([d1, d2])}$。求解其最小二乘解 $\\hat{x}$。以 $\\langle x_1, x_2 \\rangle$ 的形式输入向量。`,
        );

        const x1 = lead(r11, "\\hat{x}_1");
        const solution = walked(
          [
            [["Solve the last row", "解最后一行"], t("", ""), [`${lead(r22, "\\hat{x}_2")} = ${d2}`, `\\hat{x}_2 = ${xHat2}`]],
            [
              ["Substitute into the first row", "代入第一行"],
              t(`Move the known term $${r12 * xHat2}$ to the right:`, `把已知项 $${r12 * xHat2}$ 移到右边：`),
              [
                `${x1} ${signed(r12 * xHat2)} = ${d1}`,
                `${x1} = ${d1} - ${paren(r12 * xHat2)} = ${d1 - r12 * xHat2}`,
                `\\hat{x}_1 = ${xHat1}`,
              ],
            ],
          ],
          t(
            `$R\\hat{x} = (${r11} \\cdot ${paren(xHat1)} ${signed(r12)} \\cdot ${paren(xHat2)}, ${r22} \\cdot ${paren(xHat2)}) = (${d1}, ${d2}) = Q^Tb$.`,
            `$R\\hat{x} = (${r11} \\cdot ${paren(xHat1)} ${signed(r12)} \\cdot ${paren(xHat2)}, ${r22} \\cdot ${paren(xHat2)}) = (${d1}, ${d2}) = Q^Tb$。`,
          ),
        );

        const wrong = [
          [Q.of(d1), Q.of(d2)],
          [Q.of(d1, r11), Q.of(xHat2)],
          [Q.of(d1 + r12 * xHat2, r11), Q.of(xHat2)],
          [Q.of(xHat2), Q.of(xHat1)],
        ];
        return withMistakes(
          pointProblem({ prompt, answer: [xHat1, xHat2], vector: true, vars: ["x_1", "x_2"], solution, wrong }),
          dedupeSaid(
            [
              say(
                vectorLatex(wrong[0]!),
                "That is $Q^Tb$, the right-hand side; it still has to be solved against $R$.",
                "这是右端 $Q^Tb$；还要用 $R$ 去解。",
              ),
              say(
                vectorLatex(wrong[1]!),
                `That divides $${d1}$ by $${r11}$ without removing the term $${r12} \\cdot ${paren(xHat2)}$ of the first row.`,
                `这是直接用 $${d1}$ 除以 $${r11}$，没有去掉第一行中的 $${r12} \\cdot ${paren(xHat2)}$ 项。`,
              ),
              say(
                vectorLatex(wrong[2]!),
                `The term $${r12 * xHat2}$ was added to the right side; moving it across changes its sign.`,
                `把 $${r12 * xHat2}$ 加到了右边；移项时要变号。`,
              ),
              say(
                vectorLatex(wrong[3]!),
                `The entries are swapped: the last row gives $\\hat{x}_2 = ${xHat2}$.`,
                `分量顺序反了：最后一行给出 $\\hat{x}_2 = ${xHat2}$。`,
              ),
            ],
            vectorLatex([xHat1, xHat2]),
          ),
        );
      },
    },
    {
      id: "the-right-hand-side-qtb-in-qr-least-squares",
      title: t("The right-hand side $Q^T\\mathbf{b}$ in QR least squares", "QR 最小二乘中的右端 $Q^T\\mathbf{b}$"),
      explanation: t(
        "With $A = QR$, where $Q$ has orthonormal columns, the normal equations reduce to the triangular system $R\\hat{\\mathbf{x}} = Q^T\\mathbf{b}$. The right-hand side is just the dot products of $\\mathbf{b}$ with the columns of $Q$. For instance, the columns $\\frac12(1, 1, 1, 1)$ and $\\frac12(1, -1, 1, -1)$ are orthonormal, and $Q^T\\mathbf{b}$ is half the sum and half the alternating sum of the entries of $\\mathbf{b}$: for $\\mathbf{b} = (3, 1, 5, -1)$ that is $(\\frac{8}{2}, \\frac{6}{2}) = (4, 3)$.\n\n> **Watch out.** The factor $\\frac12$ sits in every column of $Q$, so each dot product is multiplied by $\\frac12$ once, not squared to $\\frac14$; and the signs of the second column decide which entries of $\\mathbf{b}$ are subtracted.",
        "对 $A = QR$（$Q$ 的列标准正交），正规方程化为三角方程组 $R\\hat{\\mathbf{x}} = Q^T\\mathbf{b}$。右端就是 $\\mathbf{b}$ 与 $Q$ 各列的点积。例如列 $\\frac12(1, 1, 1, 1)$ 与 $\\frac12(1, -1, 1, -1)$ 标准正交，$Q^T\\mathbf{b}$ 为 $\\mathbf{b}$ 各分量之和的一半与交错和的一半：对 $\\mathbf{b} = (3, 1, 5, -1)$，得 $(\\frac{8}{2}, \\frac{6}{2}) = (4, 3)$。\n\n> **注意。** 因子 $\\frac12$ 在 $Q$ 的每一列里，所以每个点积只乘一次 $\\frac12$，不是平方成 $\\frac14$；第二列的符号决定 $\\mathbf{b}$ 的哪些分量要减去。",
      ),
      generate(rng: Rng): Problem {
        const drawn = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6)] as const;
        const alt = rng.int(0, 1) === 0;
        // A zero sum would let the unhalved and quartered slips agree with the answer.
        const b = drawn[0] + drawn[1] + drawn[2] + drawn[3] === 0 ? ([drawn[0] + 1, drawn[1], drawn[2], drawn[3]] as const) : drawn;
        const c2 = alt ? [1, -1, 1, -1] : [1, 1, -1, -1];
        const other = alt ? [1, 1, -1, -1] : [1, -1, 1, -1];
        const s1 = b[0] + b[1] + b[2] + b[3];
        const dotWith = (c: readonly number[]) => c[0]! * b[0] + c[1]! * b[1] + c[2]! * b[2] + c[3]! * b[3];
        const s2 = dotWith(c2);
        const sOther = dotWith(other);
        const ans = [Q.of(s1, 2), Q.of(s2, 2)];
        const col = (v: readonly number[]) => `\\begin{pmatrix} ${v.join(" \\\\ ")} \\end{pmatrix}`;
        const terms = (c: readonly number[]) =>
          b
            .map((x, i) => {
              const v = c[i]! * x;
              return i === 0 ? String(v) : v < 0 ? `- ${-v}` : `+ ${v}`;
            })
            .join(" ");
        const wrong = [
          [Q.of(s1), Q.of(s2)],
          [Q.of(s1, 4), Q.of(s2, 4)],
          [Q.of(s2, 2), Q.of(s1, 2)],
          [Q.of(s1, 2), Q.of(sOther, 2)],
        ];
        const solution = walked(
          [
            [
              ["Dot with the first column", "与第一列作点积"],
              t("", ""),
              [`\\tfrac12(${terms([1, 1, 1, 1])}) = \\tfrac12 \\cdot ${paren(s1)} = ${ans[0]!.toLatex()}`],
            ],
            [
              ["Dot with the second column", "与第二列作点积"],
              t(`The second column has the signs $(${c2.join(", ")})$:`, `第二列的符号为 $(${c2.join(", ")})$：`),
              [`\\tfrac12(${terms(c2)}) = \\tfrac12 \\cdot ${paren(s2)} = ${ans[1]!.toLatex()}`],
            ],
          ],
          t(
            `$Q^T\\mathbf{b} = (${ans[0]!.toLatex()}, ${ans[1]!.toLatex()})$; doubling gives back the sums $${s1}$ and $${s2}$.`,
            `$Q^T\\mathbf{b} = (${ans[0]!.toLatex()}, ${ans[1]!.toLatex()})$；乘以 2 回到和 $${s1}$ 与 $${s2}$。`,
          ),
        );
        return withMistakes(
          pointProblem({
            prompt: t(
              `In a QR least-squares solve, $Q = \\frac12\\begin{pmatrix} ${[0, 1, 2, 3].map((i) => `1 & ${c2[i]}`).join(" \\\\ ")} \\end{pmatrix}$. Find $Q^T\\mathbf{b}$ for $\\mathbf{b} = ${col(b)}$.`,
              `在 QR 最小二乘求解中，$Q = \\frac12\\begin{pmatrix} ${[0, 1, 2, 3].map((i) => `1 & ${c2[i]}`).join(" \\\\ ")} \\end{pmatrix}$。对 $\\mathbf{b} = ${col(b)}$ 求 $Q^T\\mathbf{b}$。`,
            ),
            answer: ans,
            vector: true,
            wrong,
            solution,
          }),
          dedupeSaid(
            [
              say(vectorLatex(wrong[0]!), "The factor $\\frac12$ of $Q$ was dropped.", "漏掉了 $Q$ 的因子 $\\frac12$。"),
              say(
                vectorLatex(wrong[1]!),
                "The factor $\\frac12$ is applied once per dot product, not squared to $\\frac14$.",
                "每个点积只乘一次 $\\frac12$，不是平方成 $\\frac14$。",
              ),
              say(
                vectorLatex(wrong[2]!),
                "The entries are swapped: the first entry comes from the first column, the plain sum.",
                "分量顺序反了：第一个分量来自第一列，即直接求和。",
              ),
              say(
                vectorLatex(wrong[3]!),
                `The second entry used the signs $(${other.join(", ")})$; the second column of $Q$ has $(${c2.join(", ")})$.`,
                `第二个分量用了符号 $(${other.join(", ")})$；$Q$ 的第二列是 $(${c2.join(", ")})$。`,
              ),
            ],
            vectorLatex(ans),
          ),
        );
      },
    },
  ],
};

/** weightedLeastSquares covers weighted least squares formulations and normal equations. */
export const weightedLeastSquares: TopicDef = {
  id: "weighted-least-squares",
  title: t("Weighted Least-Squares", "加权最小二乘法"),
  summary: t(
    "Add a diagonal weight matrix to a least-squares problem and solve the weighted normal equations $A^T W^T W A \\mathbf{x} = A^T W^T W \\mathbf{b}$.",
    "在最小二乘问题中引入对角权重矩阵，建立并求解加权正规方程 $A^T W^T W A \\mathbf{x} = A^T W^T W \\mathbf{b}$。",
  ),
  intro: t(
    "Two measurements of one quantity read $2$ and $8$, and the first is three times as trustworthy. Fitting $y = c$ by minimizing $3(2 - c)^2 + 1(8 - c)^2$ gives the weighted normal equation $(3 + 1)c = 3 \\cdot 2 + 1 \\cdot 8$, so $c = \\frac{14}{4} = \\frac{7}{2}$, closer to the trusted reading than the plain mean $5$.\n\nCheck: the weighted residuals balance: $3(2 - \\frac{7}{2}) + 1(8 - \\frac{7}{2}) = -\\frac{9}{2} + \\frac{9}{2} = 0$.\n\nIn this lesson we put weights into least squares: build the weighted normal equations $A^T\\Omega A\\hat{\\mathbf{x}} = A^T\\Omega\\mathbf{b}$ and solve them for simple models.",
    "对同一个量的两次测量读数为 $2$ 和 $8$，第一次的可信度是第二次的三倍。通过极小化 $3(2 - c)^2 + 1(8 - c)^2$ 拟合 $y = c$，得到加权正规方程 $(3 + 1)c = 3 \\cdot 2 + 1 \\cdot 8$，所以 $c = \\frac{14}{4} = \\frac{7}{2}$，比普通平均值 $5$ 更靠近可信的读数。\n\n检验：加权残差相互抵消：$3(2 - \\frac{7}{2}) + 1(8 - \\frac{7}{2}) = -\\frac{9}{2} + \\frac{9}{2} = 0$。\n\n本课我们在最小二乘中引入权重：建立加权正规方程 $A^T\\Omega A\\hat{\\mathbf{x}} = A^T\\Omega\\mathbf{b}$，并对简单模型求解。",
  ),
  prerequisites: ["finding-a-least-squares-solution-using-qr-factorization"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "weighted-least-squares-equations",
      title: t("Weighted Normal Equations", "加权正规方程组"),
      explanation: t(
        "When data points have varying reliabilities, each residual $r_i$ is multiplied by a weight $w_i$. Minimizing $\\|W(b - A x)\\|^2$ leads to the weighted normal equations $A^T W^T W A \\hat{x} = A^T W^T W b$, or $A^T \\Omega A \\hat{x} = A^T \\Omega b$ with $\\Omega = \\operatorname{diag}(w_1^2, \\dots, w_m^2)$. For example, $A = (1, 2)$ and $W = \\operatorname{diag}(3, 1)$ give $A^T W^T W A = 1^2 \\cdot 9 + 2^2 \\cdot 1 = 13$.\n\n> **Watch out.** Here $W$ multiplies the residuals, so each entry of $A$ is squared and multiplied by the square $w_i^2$, not by $w_i$; and the weights must not be dropped.",
        "当各数据点可靠性不同时，每个残差 $r_i$ 乘上权重 $w_i$。极小化加权残差 $\\|W(b - A x)\\|^2$ 导出的加权正规方程为 $A^T W^T W A \\hat{x} = A^T W^T W b$，即 $A^T \\Omega A \\hat{x} = A^T \\Omega b$，其中 $\\Omega = \\operatorname{diag}(w_1^2, \\dots, w_m^2)$。例如 $A = (1, 2)$，$W = \\operatorname{diag}(3, 1)$，则 $A^T W^T W A = 1^2 \\cdot 9 + 2^2 \\cdot 1 = 13$。\n\n> **注意。** 这里 $W$ 乘在残差上，所以 $A$ 的每个元素平方后要乘以 $w_i^2$，而不是 $w_i$；也不能漏掉权重。",
      ),
      generate: (rng: Rng): Problem => {
        const w1 = rng.int(1, 4);
        // Equal weights would make the problem plain least squares, where dropping or not squaring them changes nothing.
        const w2Drawn = rng.int(1, 4);
        const w2 = w2Drawn === w1 ? (w1 === 4 ? 3 : w1 + 1) : w2Drawn;
        const w1Sq = w1 * w1;
        const w2Sq = w2 * w2;

        const a1 = rng.nonZero(-3, 3);
        const a2 = rng.nonZero(-3, 3);

        const atOmegaA = a1 * a1 * w1Sq + a2 * a2 * w2Sq;

        const prompt = t(
          `For a single parameter model $A x = b$ with $A = ${vec2Latex([a1, a2])}$ and weight matrix $W = ${mat2Latex([
            [w1, 0],
            [0, w2],
          ])}$, compute the scalar coefficient $A^T W^T W A$ in the weighted normal equation.`,
          `对于单参数模型 $A x = b$（其中 $A = ${vec2Latex([a1, a2])}$，权重矩阵为 $W = ${mat2Latex([
            [w1, 0],
            [0, w2],
          ])}$），计算加权正规方程中的标量系数 $A^T W^T W A$。`,
        );

        const omega = mat2Latex([
          [w1Sq, 0],
          [0, w2Sq],
        ]);
        const unsquared = a1 * a1 * w1 + a2 * a2 * w2;
        return numberProblem({
          prompt,
          answer: atOmegaA,
          mistakes: distinct(
            [
              why(
                a1 * a1 + a2 * a2,
                `$${a1 * a1 + a2 * a2}$ is $A^TA$; the weights were left out.`,
                `$${a1 * a1 + a2 * a2}$ 是 $A^TA$；漏掉了权重。`,
              ),
              why(
                unsquared,
                `$${unsquared}$ multiplies by $w_i$ instead of $w_i^2$; $W^TW$ squares the weights.`,
                `$${unsquared}$ 乘的是 $w_i$ 而不是 $w_i^2$；$W^TW$ 会把权重平方。`,
              ),
              why(
                a1 * w1 + a2 * w2,
                `$${a1 * w1 + a2 * w2}$ is the single product $WA$ summed; $A^TW^TWA$ is the squared length of $WA$.`,
                `$${a1 * w1 + a2 * w2}$ 只是把 $WA$ 的分量相加；$A^TW^TWA$ 是 $WA$ 的长度平方。`,
              ),
              why(
                (a1 * w1 + a2 * w2) ** 2,
                `$${(a1 * w1 + a2 * w2) ** 2}$ squares the sum of the entries of $WA$; square each entry first, then add.`,
                `$${(a1 * w1 + a2 * w2) ** 2}$ 是 $WA$ 各分量之和的平方；应先把每个分量平方再相加。`,
              ),
            ],
            atOmegaA,
          ),
          solution: walked(
            [
              [["Square the weights", "把权重平方"], t("", ""), [`\\Omega = W^T W = ${omega}`]],
              [
                ["Sum the weighted squares", "加权平方求和"],
                t("", ""),
                [
                  `A^T \\Omega A = ${paren(a1)}^2 \\cdot ${w1Sq} + ${paren(a2)}^2 \\cdot ${w2Sq} = ${a1 * a1 * w1Sq} + ${a2 * a2 * w2Sq} = ${atOmegaA}`,
                ],
              ],
            ],
            t(
              `$WA = (${a1 * w1}, ${a2 * w2})$ has squared length $${paren(a1 * w1)}^2 + ${paren(a2 * w2)}^2 = ${atOmegaA}$.`,
              `$WA = (${a1 * w1}, ${a2 * w2})$ 的长度平方为 $${paren(a1 * w1)}^2 + ${paren(a2 * w2)}^2 = ${atOmegaA}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-weighted-least-squares-constant-fit",
      title: t("Fitting a constant by weighted least squares", "用加权最小二乘拟合常数"),
      explanation: t(
        "Weighted least squares minimizes $\\sum_i w_i(y_i - \\hat{y}_i)^2$, solving $A^TWA\\hat{\\mathbf{x}} = A^TW\\mathbf{y}$. For the constant model $y = c$, $A$ is a column of ones, and the solution is the weighted mean\n\n$$\\hat{c} = \\frac{\\sum_i w_iy_i}{\\sum_i w_i}.$$\n\nObservations with larger weights pull the estimate toward themselves. For example, $y = 1, 4$ with weights $2, 1$ give $\\hat{c} = \\frac{2 \\cdot 1 + 1 \\cdot 4}{2 + 1} = 2$.\n\n> **Watch out.** Divide by the sum of the weights, not by the number of observations, and pair each weight with its own observation.",
        "加权最小二乘最小化 $\\sum_i w_i(y_i - \\hat{y}_i)^2$，求解 $A^TWA\\hat{\\mathbf{x}} = A^TW\\mathbf{y}$。对常数模型 $y = c$，$A$ 是全 1 列，解为加权平均\n\n$$\\hat{c} = \\frac{\\sum_i w_iy_i}{\\sum_i w_i}$$\n\n权重较大的观测把估计拉向自己。例如 $y = 1, 4$，权重 $2, 1$，得 $\\hat{c} = \\frac{2 \\cdot 1 + 1 \\cdot 4}{2 + 1} = 2$。\n\n> **注意。** 要除以权重之和，而不是观测的个数；每个权重要与它自己的观测配对。",
      ),
      generate(rng: Rng): Problem {
        const y = [rng.int(-5, 9), rng.int(-5, 9), rng.int(-5, 9)];
        const w = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 5)];
        if (w[0] === w[1] && w[1] === w[2]) w[2] = w[2]! + 1;
        // A zero weighted sum would let forgetting the division agree with the answer.
        if (w[0]! * y[0]! + w[1]! * y[1]! + w[2]! * y[2]! === 0) y[0] = y[0]! + 1;
        const num = w[0]! * y[0]! + w[1]! * y[1]! + w[2]! * y[2]!;
        const den = w[0]! + w[1]! + w[2]!;
        const ans = Q.of(num, den);
        const products = [0, 1, 2].map((i) => `${w[i]} \\cdot ${paren(y[i]!)}`).join(" + ");
        const reversed = w[2]! * y[0]! + w[1]! * y[1]! + w[0]! * y[2]!;
        return numberProblem({
          prompt: t(
            `Fit $y = c$ to the observations $y_1 = ${y[0]}$, $y_2 = ${y[1]}$, $y_3 = ${y[2]}$ by weighted least squares with weights $w_1 = ${w[0]}$, $w_2 = ${w[1]}$, $w_3 = ${w[2]}$. Find $\\hat{c}$.`,
            `用权重 $w_1 = ${w[0]}$，$w_2 = ${w[1]}$，$w_3 = ${w[2]}$ 的加权最小二乘把 $y = c$ 拟合到观测 $y_1 = ${y[0]}$，$y_2 = ${y[1]}$，$y_3 = ${y[2]}$。求 $\\hat{c}$。`,
          ),
          answer: ans,
          mistakes: distinct(
            [
              why(Q.of(y[0]! + y[1]! + y[2]!, 3), "That is the plain mean; the weights were ignored.", "这是普通平均值；忽略了权重。"),
              why(
                Q.of(num),
                `$${num}$ is $\\sum w_iy_i$; it still has to be divided by $\\sum w_i = ${den}$.`,
                `$${num}$ 是 $\\sum w_iy_i$；还要除以 $\\sum w_i = ${den}$。`,
              ),
              why(
                Q.of(num, 3),
                `That divides by the number of observations, $3$, instead of the sum of the weights, $${den}$.`,
                `这是除以观测个数 $3$，而不是权重之和 $${den}$。`,
              ),
              why(
                Q.of(reversed, den),
                `That pairs $w_1$ with $y_3$ and $w_3$ with $y_1$; each weight goes with its own observation.`,
                `这是把 $w_1$ 与 $y_3$、$w_3$ 与 $y_1$ 配对；每个权重要与自己的观测配对。`,
              ),
            ],
            ans,
          ),
          solution: walked(
            [
              [["Weight the observations", "对观测加权"], t("", ""), [`\\sum_i w_iy_i = ${products} = ${num}`]],
              [
                ["Divide by the total weight", "除以总权重"],
                t("", ""),
                [`\\hat{c} = \\frac{${num}}{${w[0]} + ${w[1]} + ${w[2]}} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `The weighted residuals sum to $0$: $${den} \\cdot ${ans.sign() < 0 ? `\\left(${ans.toLatex()}\\right)` : ans.toLatex()} = ${num} = \\sum_i w_iy_i$.`,
              `加权残差之和为 $0$：$${den} \\cdot ${ans.sign() < 0 ? `\\left(${ans.toLatex()}\\right)` : ans.toLatex()} = ${num} = \\sum_i w_iy_i$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 8.30: MARKOV CHAINS
// ════════════════════════════════════════════════════════════════════════════

/** markovChains covers stochastic transition matrices and discrete dynamical state evolution. */
export const markovChains: TopicDef = {
  id: "markov-chains",
  title: t("Markov Chains", "马尔可夫链"),
  summary: t(
    "Model discrete-time dynamical systems using stochastic transition matrices and compute state vectors at future steps.",
    "利用随机转移矩阵对离散时间动力系统建模，并计算后续步的状态向量。",
  ),
  intro: t(
    "A shop's customers either come back next week or not. Of those who came, $\\frac{9}{10}$ come again; of those who did not, $\\frac{1}{2}$ come. With states (came, did not come), the transition matrix is $P = \\begin{pmatrix} \\frac{9}{10} & \\frac{1}{2} \\\\ \\frac{1}{10} & \\frac{1}{2} \\end{pmatrix}$. A new customer starts at $\\mathbf{x}_0 = (0, 1)$, so $\\mathbf{x}_1 = P\\mathbf{x}_0 = (\\frac{1}{2}, \\frac{1}{2})$ and $\\mathbf{x}_2 = P\\mathbf{x}_1 = (\\frac{9}{20} + \\frac{1}{4}, \\frac{1}{20} + \\frac{1}{4}) = (\\frac{7}{10}, \\frac{3}{10})$.\n\nCheck: every state vector is a probability vector: $\\frac{1}{2} + \\frac{1}{2} = 1$ and $\\frac{7}{10} + \\frac{3}{10} = 1$.\n\nIn this lesson we model chance moves between states with a column-stochastic matrix, step a state vector forward with $\\mathbf{x}_{k+1} = P\\mathbf{x}_k$, and read probabilities of two steps from $P^2$.",
    "一家店的顾客下周要么再来，要么不来。来过的人中 $\\frac{9}{10}$ 会再来；没来的人中 $\\frac{1}{2}$ 会来。以（来，不来）为状态，转移矩阵为 $P = \\begin{pmatrix} \\frac{9}{10} & \\frac{1}{2} \\\\ \\frac{1}{10} & \\frac{1}{2} \\end{pmatrix}$。新顾客从 $\\mathbf{x}_0 = (0, 1)$ 出发，于是 $\\mathbf{x}_1 = P\\mathbf{x}_0 = (\\frac{1}{2}, \\frac{1}{2})$，$\\mathbf{x}_2 = P\\mathbf{x}_1 = (\\frac{9}{20} + \\frac{1}{4}, \\frac{1}{20} + \\frac{1}{4}) = (\\frac{7}{10}, \\frac{3}{10})$。\n\n检验：每个状态向量都是概率向量：$\\frac{1}{2} + \\frac{1}{2} = 1$，$\\frac{7}{10} + \\frac{3}{10} = 1$。\n\n本课我们用列随机矩阵描述状态间的随机转移，用 $\\mathbf{x}_{k+1} = P\\mathbf{x}_k$ 把状态向量向前推一步，并从 $P^2$ 读出两步的概率。",
  ),
  prerequisites: ["weighted-least-squares"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "markov-chains-transition",
      title: t("State Transitions in a Markov Chain", "马尔可夫链的状态转移"),
      explanation: t(
        "A column-stochastic matrix $P$ has non-negative entries with each column summing to 1. Given the state probability vector $x_k$ at step $k$, the state vector at step $k+1$ is given by $x_{k+1} = P x_k$. For example, $P = \\begin{pmatrix} 0.8 & 0.3 \\\\ 0.2 & 0.7 \\end{pmatrix}$ and $x_0 = (1, 0)$ give $x_1 = (0.8, 0.2)$, the first column of $P$.\n\n> **Watch out.** The state vector is a column multiplied on the right of $P$; multiplying it as a row on the left, $x_k^TP$, combines the rows of $P$ instead and gives the wrong probabilities.",
        "列随机矩阵 $P$ 的元素非负且每列元素之和为 1。已知第 $k$ 步的状态概率向量为 $x_k$，则第 $k+1$ 步的状态向量由 $x_{k+1} = P x_k$ 给出。例如 $P = \\begin{pmatrix} 0.8 & 0.3 \\\\ 0.2 & 0.7 \\end{pmatrix}$，$x_0 = (1, 0)$，则 $x_1 = (0.8, 0.2)$，即 $P$ 的第一列。\n\n> **注意。** 状态向量是列向量，乘在 $P$ 的右边；把它当行向量乘在左边（$x_k^TP$），组合的是 $P$ 的行，得到的概率是错的。",
      ),
      generate: (rng: Rng): Problem => {
        const aNum = rng.int(6, 9);
        const bDrawn = rng.int(1, 4);
        const useStandard = rng.bool();
        // From the even start, a matrix with p11 + p12 = 1 keeps the even split, and the slips agree with the answer.
        const bNum = !useStandard && aNum + bDrawn === 10 ? (bDrawn === 4 ? 3 : bDrawn + 1) : bDrawn;

        const p11 = Q.of(aNum, 10);
        const p21 = Q.of(10 - aNum, 10);
        const p12 = Q.of(bNum, 10);
        const p22 = Q.of(10 - bNum, 10);

        const x01 = useStandard ? Q.one : Q.of(1, 2);
        const x02 = useStandard ? Q.zero : Q.of(1, 2);

        const y1 = p11.mul(x01).add(p12.mul(x02));
        const y2 = p21.mul(x01).add(p22.mul(x02));

        const matStr: readonly [readonly [string, string], readonly [string, string]] = [
          [p11.toLatex(), p12.toLatex()],
          [p21.toLatex(), p22.toLatex()],
        ];

        const x0Str: readonly [string, string] = [x01.toLatex(), x02.toLatex()];

        const prompt = t(
          `A Markov chain has transition matrix $P = ${mat2StrLatex(matStr)}$. If the initial state vector is $x_0 = ${vec2Latex(x0Str)}$, find the state vector $x_1 = P x_0$ after one step. Enter the vector as $\\langle x_1, x_2 \\rangle$.`,
          `某马尔可夫链的转移矩阵为 $P = ${mat2StrLatex(matStr)}$。若初始状态向量为 $x_0 = ${vec2Latex(x0Str)}$，求一步之后的状态向量 $x_1 = P x_0$。以 $\\langle x_1, x_2 \\rangle$ 的形式输入向量。`,
        );

        const solution = walked(
          [
            [
              ["Multiply $P$ by $x_0$", "用 $P$ 乘 $x_0$"],
              t("Each entry is a row of $P$ times the column $x_0$:", "每个分量是 $P$ 的一行乘以列向量 $x_0$："),
              [
                `x_1 = ${mat2StrLatex(matStr)} ${vec2Latex(x0Str)} = \\begin{pmatrix} ${p11.toLatex()} \\cdot ${x01.toLatex()} + ${p12.toLatex()} \\cdot ${x02.toLatex()} \\\\ ${p21.toLatex()} \\cdot ${x01.toLatex()} + ${p22.toLatex()} \\cdot ${x02.toLatex()} \\end{pmatrix} = ${vec2Latex([y1.toLatex(), y2.toLatex()])}`,
              ],
            ],
          ],
          t(
            `$x_1$ is a probability vector: $${y1.toLatex()} + ${y2.toLatex()} = 1$.`,
            `$x_1$ 是概率向量：$${y1.toLatex()} + ${y2.toLatex()} = 1$。`,
          ),
        );

        const rowWise = [p11.mul(x01).add(p21.mul(x02)), p12.mul(x01).add(p22.mul(x02))];
        const oneColumn = useStandard ? [p12, p22] : [p11, p21];
        const wrong = [[y2, y1], rowWise, [x01, x02], oneColumn, [p12, p22]];
        return withMistakes(
          pointProblem({ prompt, answer: [y1, y2], vector: true, vars: ["x_1", "x_2"], solution, wrong }),
          dedupeSaid(
            [
              say(
                vectorLatex(wrong[0]!),
                "The entries are swapped: the first entry is the probability of state 1.",
                "分量顺序反了：第一个分量是状态 1 的概率。",
              ),
              say(
                vectorLatex(wrong[1]!),
                "That is $x_0^TP$, the row vector times $P$; it combines the rows of $P$. The column $x_0$ goes on the right: $Px_0$.",
                "这是 $x_0^TP$，即行向量乘 $P$，组合的是 $P$ 的行。列向量 $x_0$ 应乘在右边：$Px_0$。",
              ),
              say(vectorLatex(wrong[2]!), "That is $x_0$ itself; the step $P x_0$ was not taken.", "这是 $x_0$ 本身；没有做一步 $Px_0$。"),
              useStandard
                ? say(
                    vectorLatex(wrong[3]!),
                    "That is the second column of $P$, the moves out of state 2; the chain starts in state 1, so $Px_0$ is the first column.",
                    "这是 $P$ 的第二列，即从状态 2 出发的转移；链从状态 1 出发，所以 $Px_0$ 是第一列。",
                  )
                : say(
                    vectorLatex(wrong[3]!),
                    "That is only the first column of $P$; half of the chain starts in state 2, so $Px_0$ averages the two columns.",
                    "这只是 $P$ 的第一列；有一半从状态 2 出发，所以 $Px_0$ 是两列的平均。",
                  ),
              say(
                vectorLatex(wrong[4]!),
                "That is only the second column of $P$; half of the chain starts in state 1, so $Px_0$ averages the two columns.",
                "这只是 $P$ 的第二列；有一半从状态 1 出发，所以 $Px_0$ 是两列的平均。",
              ),
            ],
            vectorLatex([y1, y2]),
          ),
        );
      },
    },
    {
      id: "a-two-step-transition-probability",
      title: t("A two-step transition probability", "两步转移概率"),
      explanation: t(
        "With a column-stochastic matrix $P$, the entry $p_{ij}$ is the probability of moving from state $j$ to state $i$ in one step. Two steps correspond to $P^2$, and summing over the intermediate state $k$ gives\n\n$$(P^2)_{ij} = \\sum_k p_{ik}\\,p_{kj}.$$\n\nFor two states, the probability of being in state 1 two steps after starting there is $p_{11}^2 + p_{12}p_{21}$: stay twice, or leave and come back. For example, $P = \\begin{pmatrix} 0.8 & 0.3 \\\\ 0.2 & 0.7 \\end{pmatrix}$ gives $(P^2)_{11} = 0.8^2 + 0.3 \\cdot 0.2 = 0.7$.\n\n> **Watch out.** Add one product for every intermediate state, not just one path; and in $p_{ik}p_{kj}$ the first move is $p_{kj}$, out of the starting state $j$.",
        "对列随机矩阵 $P$，元素 $p_{ij}$ 是一步从状态 $j$ 转到状态 $i$ 的概率。两步对应 $P^2$，对中间状态 $k$ 求和得\n\n$$(P^2)_{ij} = \\sum_k p_{ik}\\,p_{kj}$$\n\n对两个状态，从状态 1 出发两步后仍在状态 1 的概率为 $p_{11}^2 + p_{12}p_{21}$：两次都停留，或离开后再回来。例如 $P = \\begin{pmatrix} 0.8 & 0.3 \\\\ 0.2 & 0.7 \\end{pmatrix}$，$(P^2)_{11} = 0.8^2 + 0.3 \\cdot 0.2 = 0.7$。\n\n> **注意。** 每个中间状态都要加一项乘积，不能只算一条路径；在 $p_{ik}p_{kj}$ 中，第一步是 $p_{kj}$，从出发状态 $j$ 转出。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 9);
        const bDrawn = rng.int(1, 9);
        // With every entry 1/2 each path has the same probability, and the wrong answers collapse.
        const b = a === 5 && bDrawn === 5 ? 4 : bDrawn;
        const p11 = Q.of(10 - a, 10);
        const p21 = Q.of(a, 10);
        const p12 = Q.of(b, 10);
        const p22 = Q.of(10 - b, 10);
        const toTwo = rng.int(0, 1) === 1;
        const ans = toTwo ? p21.mul(p11).add(p22.mul(p21)) : p11.mul(p11).add(p12.mul(p21));
        const P = `\\begin{pmatrix} ${p11.toLatex()} & ${p12.toLatex()} \\\\ ${p21.toLatex()} & ${p22.toLatex()} \\end{pmatrix}`;
        return numberProblem({
          prompt: t(
            `A Markov chain has column-stochastic transition matrix $P = ${P}$. Starting in state 1, what is the probability of being in state ${toTwo ? 2 : 1} after two steps?`,
            `某马尔可夫链的列随机转移矩阵为 $P = ${P}$。从状态 1 出发，两步后处于状态 ${toTwo ? 2 : 1} 的概率是多少？`,
          ),
          answer: ans,
          form: "decimal",
          mistakes: distinct(
            toTwo
              ? [
                  why(
                    p21,
                    "That is the one-step probability $p_{21}$; two steps need $(P^2)_{21}$.",
                    "这是一步转移概率 $p_{21}$；两步要用 $(P^2)_{21}$。",
                  ),
                  why(
                    p21.mul(p21),
                    "That uses $p_{21}$ for both steps; once in state 2, the chain stays there with $p_{22}$.",
                    "这是两步都用了 $p_{21}$；到了状态 2 之后，留在状态 2 的概率是 $p_{22}$。",
                  ),
                  why(
                    p21.mul(p11),
                    "That counts only the path $1 \\to 1 \\to 2$; the path $1 \\to 2 \\to 2$, with probability $p_{22}p_{21}$, must be added.",
                    "这只算了路径 $1 \\to 1 \\to 2$；还要加上路径 $1 \\to 2 \\to 2$，其概率为 $p_{22}p_{21}$。",
                  ),
                  why(
                    p22.mul(p21),
                    "That counts only the path $1 \\to 2 \\to 2$; the path $1 \\to 1 \\to 2$, with probability $p_{21}p_{11}$, must be added.",
                    "这只算了路径 $1 \\to 2 \\to 2$；还要加上路径 $1 \\to 1 \\to 2$，其概率为 $p_{21}p_{11}$。",
                  ),
                ]
              : [
                  why(
                    p11,
                    "That is the one-step probability $p_{11}$; two steps need $(P^2)_{11}$.",
                    "这是一步转移概率 $p_{11}$；两步要用 $(P^2)_{11}$。",
                  ),
                  why(
                    p11.mul(p11),
                    "That counts only staying twice; leaving and coming back, with probability $p_{12}p_{21}$, must be added.",
                    "这只算了两次都停留；还要加上离开再回来的概率 $p_{12}p_{21}$。",
                  ),
                  why(
                    p12.mul(p21),
                    "That counts only leaving and coming back; staying twice, with probability $p_{11}^2$, must be added.",
                    "这只算了离开再回来；还要加上两次都停留的概率 $p_{11}^2$。",
                  ),
                  why(
                    p11.mul(p11).add(p21.mul(p21)),
                    "That squares the first column, $p_{11}^2 + p_{21}^2$; the second step back to state 1 from state 2 is $p_{12}$, so the second term is $p_{12}p_{21}$.",
                    "这是把第一列平方相加 $p_{11}^2 + p_{21}^2$；从状态 2 回到状态 1 的概率是 $p_{12}$，所以第二项是 $p_{12}p_{21}$。",
                  ),
                ],
            ans,
          ),
          solution: toTwo
            ? walked(
                [
                  [
                    ["List the paths", "列出路径"],
                    t(
                      "From state 1 to state 2 in two steps: $1 \\to 1 \\to 2$ or $1 \\to 2 \\to 2$.",
                      "两步从状态 1 到状态 2：$1 \\to 1 \\to 2$ 或 $1 \\to 2 \\to 2$。",
                    ),
                  ],
                  [
                    ["Add their probabilities", "把概率相加"],
                    t("", ""),
                    [
                      `(P^2)_{21} = p_{21}p_{11} + p_{22}p_{21} = ${p21.toLatex()} \\cdot ${p11.toLatex()} + ${p22.toLatex()} \\cdot ${p21.toLatex()} = ${ans.toLatex()}`,
                    ],
                  ],
                ],
                t(
                  `$(P^2)_{11} = ${p11.mul(p11).add(p12.mul(p21)).toLatex()}$, and the two entries of the first column of $P^2$ add to $1$.`,
                  `$(P^2)_{11} = ${p11.mul(p11).add(p12.mul(p21)).toLatex()}$，$P^2$ 第一列的两个元素之和为 $1$。`,
                ),
              )
            : walked(
                [
                  [
                    ["List the paths", "列出路径"],
                    t(
                      "From state 1 back to state 1 in two steps: $1 \\to 1 \\to 1$ or $1 \\to 2 \\to 1$.",
                      "两步从状态 1 回到状态 1：$1 \\to 1 \\to 1$ 或 $1 \\to 2 \\to 1$。",
                    ),
                  ],
                  [
                    ["Add their probabilities", "把概率相加"],
                    t("", ""),
                    [
                      `(P^2)_{11} = p_{11}^2 + p_{12}p_{21} = \\left(${p11.toLatex()}\\right)^2 + ${p12.toLatex()} \\cdot ${p21.toLatex()} = ${ans.toLatex()}`,
                    ],
                  ],
                ],
                t(
                  `$(P^2)_{21} = ${p21.mul(p11).add(p22.mul(p21)).toLatex()}$, and the two entries of the first column of $P^2$ add to $1$.`,
                  `$(P^2)_{21} = ${p21.mul(p11).add(p22.mul(p21)).toLatex()}$，$P^2$ 第一列的两个元素之和为 $1$。`,
                ),
              ),
        });
      },
    },
  ],
};

/** steadyStateVectors covers solving for stationary probability vectors of Markov chains. */
export const steadyStateVectors: TopicDef = {
  id: "steady-state-vectors",
  title: t("Steady-State Vectors", "稳态向量"),
  summary: t(
    "Find the steady-state probability vector of a regular Markov chain by solving $(P - I)\\mathbf{q} = \\mathbf{0}$ with $\\sum q_i = 1$.",
    "通过求解 $(P - I)\\mathbf{q} = \\mathbf{0}$ 且 $\\sum q_i = 1$，求正则马尔可夫链的稳态概率向量。",
  ),
  intro: t(
    "Take $P = \\begin{pmatrix} \\frac{9}{10} & \\frac{1}{5} \\\\ \\frac{1}{10} & \\frac{4}{5} \\end{pmatrix}$. The first row of $(P - I)\\mathbf{q} = \\mathbf{0}$ reads $-\\frac{1}{10}q_1 + \\frac{1}{5}q_2 = 0$, so $q_1 = 2q_2$, and $q_1 + q_2 = 1$ gives $\\mathbf{q} = (\\frac{2}{3}, \\frac{1}{3})$.\n\nCheck: the first entry of $P\\mathbf{q}$ is $\\frac{9}{10} \\cdot \\frac{2}{3} + \\frac{1}{5} \\cdot \\frac{1}{3} = \\frac{9}{15} + \\frac{1}{15} = \\frac{2}{3} = q_1$.\n\nIn this lesson we find steady-state vectors, the probability vectors with $P\\mathbf{q} = \\mathbf{q}$ that a regular chain settles into, by solving $(P - I)\\mathbf{q} = \\mathbf{0}$ or by balancing the flows between states.",
    "取 $P = \\begin{pmatrix} \\frac{9}{10} & \\frac{1}{5} \\\\ \\frac{1}{10} & \\frac{4}{5} \\end{pmatrix}$。$(P - I)\\mathbf{q} = \\mathbf{0}$ 的第一行为 $-\\frac{1}{10}q_1 + \\frac{1}{5}q_2 = 0$，所以 $q_1 = 2q_2$，再由 $q_1 + q_2 = 1$ 得 $\\mathbf{q} = (\\frac{2}{3}, \\frac{1}{3})$。\n\n检验：$P\\mathbf{q}$ 的第一个分量是 $\\frac{9}{10} \\cdot \\frac{2}{3} + \\frac{1}{5} \\cdot \\frac{1}{3} = \\frac{9}{15} + \\frac{1}{15} = \\frac{2}{3} = q_1$。\n\n本课我们求稳态向量，即正则链最终趋于的、满足 $P\\mathbf{q} = \\mathbf{q}$ 的概率向量：解 $(P - I)\\mathbf{q} = \\mathbf{0}$，或者平衡状态之间的流量。",
  ),
  prerequisites: ["markov-chains"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "markov-steady-state-vector",
      title: t("Computing Steady-State Probability Vectors", "计算稳态概率向量"),
      explanation: t(
        "A probability vector $q$ is a steady-state vector for a transition matrix $P$ if $P q = q$ (so $(P - I) q = 0$) and the components satisfy $q_i \\ge 0$ and $\\sum q_i = 1$. For a $2 \\times 2$ matrix $P = \\begin{pmatrix} 1 - a & b \\\\ a & 1 - b \\end{pmatrix}$, $q = \\frac{1}{a + b} \\begin{pmatrix} b \\\\ a \\end{pmatrix}$. For example, $a = \\frac{1}{10}$ and $b = \\frac{3}{10}$ give $q = (\\frac{3}{4}, \\frac{1}{4})$.\n\n> **Watch out.** $q_1$ goes with $b$, the probability of moving into state 1, not with $a$, the probability of leaving it; and the entries of $P$ are one-step probabilities, not the long-run ones.",
        "概率向量 $q$ 若满足 $P q = q$（即 $(P - I) q = 0$）且其分量非负且和为 1，则称为转移矩阵 $P$ 的稳态向量。对于 $2 \\times 2$ 矩阵 $P = \\begin{pmatrix} 1 - a & b \\\\ a & 1 - b \\end{pmatrix}$，其稳态向量为 $q = \\frac{1}{a + b} \\begin{pmatrix} b \\\\ a \\end{pmatrix}$。例如 $a = \\frac{1}{10}$，$b = \\frac{3}{10}$，得 $q = (\\frac{3}{4}, \\frac{1}{4})$。\n\n> **注意。** $q_1$ 对应 $b$，即转入状态 1 的概率，而不是离开它的概率 $a$；$P$ 的元素是一步的概率，不是长期的概率。",
      ),
      generate: (rng: Rng): Problem => {
        const aNum = rng.int(1, 8);
        // Equal rates give the even split, where swapping the entries is no slip.
        const bDrawn = rng.int(1, 8);
        const bNum = bDrawn === aNum ? (aNum === 8 ? 7 : aNum + 1) : bDrawn;
        const sum = aNum + bNum;
        const extra = rng.int(1, 5);
        const denom = sum + extra;

        const q1 = Q.of(bNum, sum);
        const q2 = Q.of(aNum, sum);

        const prompt = t(
          `For a regular Markov chain with transition matrix $P = \\begin{pmatrix} 1 - \\frac{${aNum}}{${denom}} & \\frac{${bNum}}{${denom}} \\\\ \\frac{${aNum}}{${denom}} & 1 - \\frac{${bNum}}{${denom}} \\end{pmatrix}$, find the first component $q_1$ of the steady-state probability vector $q = \\begin{pmatrix} q_1 \\\\ q_2 \\end{pmatrix}$.`,
          `对于具有转移矩阵 $P = \\begin{pmatrix} 1 - \\frac{${aNum}}{${denom}} & \\frac{${bNum}}{${denom}} \\\\ \\frac{${aNum}}{${denom}} & 1 - \\frac{${bNum}}{${denom}} \\end{pmatrix}$ 的正则马尔可夫链，求稳态概率向量 $q = \\begin{pmatrix} q_1 \\\\ q_2 \\end{pmatrix}$ 的第一个分量 $q_1$。`,
        );

        const a = `\\frac{${aNum}}{${denom}}`;
        const b = `\\frac{${bNum}}{${denom}}`;
        return numberProblem({
          prompt,
          answer: q1,
          mistakes: distinct(
            [
              why(
                q2,
                "That is $q_2$: $q_1$ is proportional to the probability of moving into state 1, $b$, not to $a$.",
                "这是 $q_2$：$q_1$ 与转入状态 1 的概率 $b$ 成正比，而不是 $a$。",
              ),
              why(
                Q.of(1, 2),
                "The two states are left at different rates, so the long run is not an even split.",
                "离开两个状态的概率不同，所以长期并不是平分。",
              ),
              why(
                Q.of(bNum, denom),
                `$${b}$ is the one-step probability of moving from state 2 to state 1, not the long-run share.`,
                `$${b}$ 是一步从状态 2 转到状态 1 的概率，不是长期份额。`,
              ),
              why(
                Q.of(denom - aNum, denom),
                `$1 - ${a}$ is the probability of staying in state 1 for one step, not the long-run share.`,
                `$1 - ${a}$ 是一步内留在状态 1 的概率，不是长期份额。`,
              ),
            ],
            q1,
          ),
          solution: walked(
            [
              [
                ["Write the first row of $(P - I)q = 0$", "写出 $(P - I)q = 0$ 的第一行"],
                t("", ""),
                [`-${a}q_1 + ${b}q_2 = 0`, `${lead(aNum, "q_1")} = ${lead(bNum, "q_2")}`],
              ],
              [
                ["Normalize", "归一化"],
                t("With $q_1 + q_2 = 1$:", "由 $q_1 + q_2 = 1$："),
                [`q_1 = \\frac{${bNum}}{${aNum} + ${bNum}} = ${q1.toLatex()}`],
              ],
            ],
            t(
              `$q_2 = ${q2.toLatex()}$, and the first entry of $Pq$ is $\\left(1 - ${a}\\right) \\cdot ${q1.toLatex()} + ${b} \\cdot ${q2.toLatex()} = ${Q.of(
                denom - aNum,
                denom,
              )
                .mul(q1)
                .add(Q.of(bNum, denom).mul(q2))
                .toLatex()} = q_1$.`,
              `$q_2 = ${q2.toLatex()}$，$Pq$ 的第一个分量为 $\\left(1 - ${a}\\right) \\cdot ${q1.toLatex()} + ${b} \\cdot ${q2.toLatex()} = ${Q.of(
                denom - aNum,
                denom,
              )
                .mul(q1)
                .add(Q.of(bNum, denom).mul(q2))
                .toLatex()} = q_1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-steady-state-of-a-three-state-chain-by-balance",
      title: t("The steady state of a three-state chain by balance", "用平衡关系求三状态链的稳态"),
      explanation: t(
        "In a chain on states $1, 2, 3$ that only moves between neighbors, in the long run the flow across each cut must balance: $\\pi_1 p_{21} = \\pi_2 p_{12}$ and $\\pi_2 p_{32} = \\pi_3 p_{23}$, where $p_{ij}$ is the probability of moving from $j$ to $i$. So $\\pi$ is proportional to\n\n$$\\left(1,\\ \\frac{p_{21}}{p_{12}},\\ \\frac{p_{21}p_{32}}{p_{12}p_{23}}\\right),$$\n\nand dividing by the sum makes the entries add to $1$. For example, $p_{21} = \\frac{1}{5}$, $p_{12} = \\frac{2}{5}$, $p_{32} = \\frac{1}{5}$, $p_{23} = \\frac{1}{10}$ give the weights $(1, \\frac{1}{2}, 1)$, which sum to $\\frac{5}{2}$, so $\\pi = (\\frac{2}{5}, \\frac{1}{5}, \\frac{2}{5})$.\n\n> **Watch out.** Across each cut, the probability of the state on one side times its move across equals the same on the other side, so each ratio is the move into a state over the move out of it; and the weights must still be divided by their sum.",
        "在只在相邻状态间移动的三状态链 $1, 2, 3$ 中，长期来看穿过每个割的流量必须平衡：$\\pi_1 p_{21} = \\pi_2 p_{12}$，$\\pi_2 p_{32} = \\pi_3 p_{23}$，其中 $p_{ij}$ 是从 $j$ 转到 $i$ 的概率。所以 $\\pi$ 与\n\n$$\\left(1,\\ \\frac{p_{21}}{p_{12}},\\ \\frac{p_{21}p_{32}}{p_{12}p_{23}}\\right)$$\n\n成比例，除以总和使各分量之和为 $1$。例如 $p_{21} = \\frac{1}{5}$，$p_{12} = \\frac{2}{5}$，$p_{32} = \\frac{1}{5}$，$p_{23} = \\frac{1}{10}$，权重为 $(1, \\frac{1}{2}, 1)$，其和为 $\\frac{5}{2}$，所以 $\\pi = (\\frac{2}{5}, \\frac{1}{5}, \\frac{2}{5})$。\n\n> **注意。** 在每个割上，一侧状态的概率乘以它越过割的转移概率，等于另一侧的同样乘积，所以每个比值是转入某状态的概率除以转出的概率；权重最后还要除以它们的和。",
      ),
      generate(rng: Rng): Problem {
        const up1 = rng.int(1, 5);
        const down2 = rng.int(1, 4);
        const up2 = rng.int(1, 4);
        const down3 = rng.int(1, 5);
        const r2 = Q.of(up1, down2);
        const r3 = Q.of(up1 * up2, down2 * down3);
        const total = Q.one.add(r2).add(r3);
        const which = rng.int(1, 3);
        const ans = (which === 1 ? Q.one : which === 2 ? r2 : r3).div(total);
        const pct = (n: number) => `${n * 10}\\%`;
        const lead1 = (r: Q) => (r.eq(Q.one) ? "" : `${r.toLatex()}\\,`);
        const f2 = Q.of(down2, up1);
        const f3 = Q.of(down2 * down3, up1 * up2);
        const fTotal = Q.one.add(f2).add(f3);
        const flipped = (which === 1 ? Q.one : which === 2 ? f2 : f3).div(fTotal);
        return numberProblem({
          prompt: t(
            `A chain moves each step from state 1 to 2 with probability $${pct(up1)}$; from 2 to 1 with probability $${pct(down2)}$ and from 2 to 3 with probability $${pct(up2)}$; from 3 to 2 with probability $${pct(down3)}$; otherwise it stays. Find the long-run probability of state ${which}.`,
            `某链每一步从状态 1 转到 2 的概率为 $${pct(up1)}$；从 2 转到 1 的概率为 $${pct(down2)}$，从 2 转到 3 的概率为 $${pct(up2)}$；从 3 转到 2 的概率为 $${pct(down3)}$；否则停留。求状态 ${which} 的长期概率。`,
          ),
          answer: ans,
          mistakes: distinct(
            [
              ...[1, 2, 3]
                .filter((k) => k !== which)
                .map((k) =>
                  why(
                    (k === 1 ? Q.one : k === 2 ? r2 : r3).div(total),
                    `That is the long-run probability of state ${k}, not state ${which}.`,
                    `这是状态 ${k} 的长期概率，不是状态 ${which} 的。`,
                  ),
                ),
              why(
                Q.of(1, 3),
                "The moves between the states differ, so the long run is not an even split.",
                "各状态之间的转移概率不同，所以长期并不是平分。",
              ),
              why(
                which === 1 ? Q.one : which === 2 ? r2 : r3,
                `That is the weight of state ${which} before dividing by the total $${total.toLatex()}$.`,
                `这是状态 ${which} 除以总和 $${total.toLatex()}$ 之前的权重。`,
              ),
              why(
                which === 1 ? Q.of(down2, up1 + down2) : which === 2 ? Q.of(up1, up1 + down2) : Q.of(up2, up2 + down3),
                which === 3
                  ? "That balances only states 2 and 3 as if state 1 did not exist; state 1 also holds part of the probability."
                  : "That balances only states 1 and 2 as if state 3 did not exist; state 3 also holds part of the probability.",
                which === 3
                  ? "这只平衡了状态 2 和 3，好像状态 1 不存在；状态 1 也分去一部分概率。"
                  : "这只平衡了状态 1 和 2，好像状态 3 不存在；状态 3 也分去一部分概率。",
              ),
              why(
                flipped,
                "The ratios are upside down: each weight is the move into a state over the move back out of it.",
                "比值颠倒了：每个权重是转入某状态的概率除以从它转回的概率。",
              ),
            ],
            ans,
          ),
          solution: walked(
            [
              [
                ["Balance the cut between 1 and 2", "平衡 1 与 2 之间的割"],
                t("", ""),
                [`\\pi_1 \\cdot ${pct(up1)} = \\pi_2 \\cdot ${pct(down2)}`, `\\pi_2 = ${lead1(r2)}\\pi_1`],
              ],
              [
                ["Balance the cut between 2 and 3", "平衡 2 与 3 之间的割"],
                t("", ""),
                [
                  `\\pi_2 \\cdot ${pct(up2)} = \\pi_3 \\cdot ${pct(down3)}`,
                  `\\pi_3 = ${lead1(Q.of(up2, down3))}\\pi_2 = ${lead1(r3)}\\pi_1`,
                ],
              ],
              [
                ["Normalize", "归一化"],
                t(
                  `The weights $1, ${r2.toLatex()}, ${r3.toLatex()}$ sum to $${total.toLatex()}$:`,
                  `权重 $1, ${r2.toLatex()}, ${r3.toLatex()}$ 之和为 $${total.toLatex()}$：`,
                ),
                [
                  `\\pi_{${which}} = \\frac{${(which === 1 ? Q.one : which === 2 ? r2 : r3).toLatex()}}{${total.toLatex()}} = ${ans.toLatex()}`,
                ],
              ],
            ],
            t(
              `The three probabilities $${Q.one.div(total).toLatex()}, ${r2.div(total).toLatex()}, ${r3.div(total).toLatex()}$ add to $1$.`,
              `三个概率 $${Q.one.div(total).toLatex()}, ${r2.div(total).toLatex()}, ${r3.div(total).toLatex()}$ 之和为 $1$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 8.31: LINEAR REGRESSION
// ════════════════════════════════════════════════════════════════════════════

/** linearRegressionWithMatrices covers formulation and solution of simple linear regression using design matrices. */
export const linearRegressionWithMatrices: TopicDef = {
  id: "linear-regression-with-matrices",
  title: t("Linear Regression With Matrices", "基于矩阵的线性回归"),
  summary: t(
    "Fit the line $y = \\beta_0 + \\beta_1 x$ using a design matrix and the normal equations $X^T X \\boldsymbol{\\beta} = X^T \\mathbf{y}$.",
    "利用设计矩阵 $X$ 和正规方程 $X^T X \\boldsymbol{\\beta} = X^T \\mathbf{y}$ 拟合回归直线 $y = \\beta_0 + \\beta_1 x$。",
  ),
  intro: t(
    "Fit $y = \\beta_0 + \\beta_1x$ to $(0, 1), (1, 3), (2, 4)$. The design matrix has rows $(1, 0), (1, 1), (1, 2)$, so $X^TX = \\begin{pmatrix} 3 & 3 \\\\ 3 & 5 \\end{pmatrix}$ and $X^T\\mathbf{y} = (1 + 3 + 4, 0 + 3 + 8) = (8, 11)$. Subtracting the first normal equation $3\\beta_0 + 3\\beta_1 = 8$ from the second $3\\beta_0 + 5\\beta_1 = 11$ gives $2\\beta_1 = 3$, so $\\beta_1 = \\frac{3}{2}$ and $\\beta_0 = \\frac{8 - \\frac{9}{2}}{3} = \\frac{7}{6}$.\n\nCheck: the residuals $1 - \\frac{7}{6}, 3 - \\frac{8}{3}, 4 - \\frac{25}{6}$, that is $-\\frac{1}{6}, \\frac{1}{3}, -\\frac{1}{6}$, add to $0$, and $0 \\cdot (-\\frac{1}{6}) + 1 \\cdot \\frac{1}{3} + 2 \\cdot (-\\frac{1}{6}) = 0$.\n\nIn this lesson we write a straight-line fit as a least-squares problem: build the design matrix $X$, form $X^TX$ and $X^T\\mathbf{y}$ from sums of the data, and solve for the intercept and slope.",
    "用 $y = \\beta_0 + \\beta_1x$ 拟合 $(0, 1), (1, 3), (2, 4)$。设计矩阵的各行为 $(1, 0), (1, 1), (1, 2)$，所以 $X^TX = \\begin{pmatrix} 3 & 3 \\\\ 3 & 5 \\end{pmatrix}$，$X^T\\mathbf{y} = (1 + 3 + 4, 0 + 3 + 8) = (8, 11)$。用第二个正规方程 $3\\beta_0 + 5\\beta_1 = 11$ 减去第一个 $3\\beta_0 + 3\\beta_1 = 8$，得 $2\\beta_1 = 3$，所以 $\\beta_1 = \\frac{3}{2}$，$\\beta_0 = \\frac{8 - \\frac{9}{2}}{3} = \\frac{7}{6}$。\n\n检验：残差 $1 - \\frac{7}{6}, 3 - \\frac{8}{3}, 4 - \\frac{25}{6}$，即 $-\\frac{1}{6}, \\frac{1}{3}, -\\frac{1}{6}$，其和为 $0$，且 $0 \\cdot (-\\frac{1}{6}) + 1 \\cdot \\frac{1}{3} + 2 \\cdot (-\\frac{1}{6}) = 0$。\n\n本课我们把直线拟合写成最小二乘问题：建立设计矩阵 $X$，由数据的和得到 $X^TX$ 与 $X^T\\mathbf{y}$，再解出截距和斜率。",
  ),
  prerequisites: ["steady-state-vectors"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "matrix-linear-regression",
      title: t("Design Matrix and Normal Equations for Linear Regression", "线性回归的设计矩阵与正规方程"),
      explanation: t(
        "To fit a regression line $y = \\beta_0 + \\beta_1 x$ to $n$ data points $(x_i, y_i)$, set up the design matrix $X = \\begin{pmatrix} 1 & x_1 \\\\ \\vdots & \\vdots \\\\ 1 & x_n \\end{pmatrix}$ and response vector $y = \\begin{pmatrix} y_1 \\\\ \\vdots \\\\ y_n \\end{pmatrix}$. The parameter vector $\\beta = \\begin{pmatrix} \\beta_0 \\\\ \\beta_1 \\end{pmatrix}$ satisfies $X^T X \\beta = X^T y$. For example, the points $(-1, 1), (0, 2), (1, 6)$ give $X^TX = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}$ and $X^Ty = (9, 5)$, so $\\beta = (3, \\frac{5}{2})$.\n\n> **Watch out.** $X^Ty$ is the right-hand side, not $\\beta$: each of its entries is divided by the matching diagonal entry of $X^TX$ (here $3$ for $\\beta_0$ and $2$ for $\\beta_1$); and $\\sum x_iy_i$ takes $y$ at $x = -1$ with a minus sign.",
        "为了对 $n$ 个数据点 $(x_i, y_i)$ 拟合回归线 $y = \\beta_0 + \\beta_1 x$，建立设计矩阵 $X = \\begin{pmatrix} 1 & x_1 \\\\ \\vdots & \\vdots \\\\ 1 & x_n \\end{pmatrix}$ 与响应向量 $y = \\begin{pmatrix} y_1 \\\\ \\vdots \\\\ y_n \\end{pmatrix}$。回归参数向量 $\\beta = \\begin{pmatrix} \\beta_0 \\\\ \\beta_1 \\end{pmatrix}$ 满足正规方程 $X^T X \\beta = X^T y$。例如点 $(-1, 1), (0, 2), (1, 6)$ 给出 $X^TX = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}$，$X^Ty = (9, 5)$，所以 $\\beta = (3, \\frac{5}{2})$。\n\n> **注意。** $X^Ty$ 是右端，不是 $\\beta$：它的每个分量要除以 $X^TX$ 中对应的对角元素（这里 $\\beta_0$ 除以 $3$，$\\beta_1$ 除以 $2$）；$\\sum x_iy_i$ 中 $x = -1$ 处的 $y$ 要带负号。",
      ),
      generate: (rng: Rng): Problem => {
        const b0Drawn = rng.int(-4, 4);
        const beta1 = rng.int(-3, 3);
        // With both parameters zero every slip of the solve would give the answer again.
        const beta0 = b0Drawn === 0 && beta1 === 0 ? 1 : b0Drawn;
        const r = rng.nonZero(-2, 2);

        // Points x = -1, 0, 1 with residuals orthogonal to Col(X)
        const y1 = beta0 - beta1 + r;
        const y2 = beta0 - 2 * r;
        const y3 = beta0 + beta1 + r;

        const sumY = y1 + y2 + y3;
        const sumXY = -y1 + y3;

        const prompt = t(
          `Find the parameter vector $\\beta = \\langle \\beta_0, \\beta_1 \\rangle$ for the least-squares regression line $y = \\beta_0 + \\beta_1 x$ fitting the data points $(-1, ${y1})$, $(0, ${y2})$, and $(1, ${y3})$ using the normal equations $X^T X \\beta = X^T y$. Enter the vector as $\\langle \\beta_0, \\beta_1 \\rangle$.`,
          `利用正规方程 $X^T X \\beta = X^T y$，求拟合数据点 $(-1, ${y1})$、$(0, ${y2})$ 与 $(1, ${y3})$ 的最小二乘回归直线 $y = \\beta_0 + \\beta_1 x$ 的参数向量 $\\beta = \\langle \\beta_0, \\beta_1 \\rangle$。以 $\\langle \\beta_0, \\beta_1 \\rangle$ 的形式输入向量。`,
        );

        const fits = [beta0 - beta1, beta0, beta0 + beta1];
        const residuals = [y1 - fits[0]!, y2 - fits[1]!, y3 - fits[2]!];
        const solution = walked(
          [
            [
              ["Set up $X$ and $y$", "写出 $X$ 与 $y$"],
              t("", ""),
              [`X = \\begin{pmatrix} 1 & -1 \\\\ 1 & 0 \\\\ 1 & 1 \\end{pmatrix}, \\quad y = ${vec3Latex([y1, y2, y3])}`],
            ],
            [
              ["Form the normal equations", "写出正规方程"],
              t("", ""),
              [
                `X^T X = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}`,
                `X^T y = \\begin{pmatrix} ${y1} ${signed(y2)} ${signed(y3)} \\\\ ${-y1} ${signed(y3)} \\end{pmatrix} = ${vec2Latex([sumY, sumXY])}`,
              ],
            ],
            [
              ["Divide by the diagonal", "除以对角元素"],
              t("$X^TX$ is diagonal, so each equation has one unknown:", "$X^TX$ 是对角矩阵，所以每个方程只含一个未知数："),
              [`\\beta_0 = \\frac{${sumY}}{3} = ${beta0}, \\quad \\beta_1 = \\frac{${sumXY}}{2} = ${beta1}`],
            ],
          ],
          t(
            `The residuals $${residuals.join(", ")}$ add to $0$, and $-1 \\cdot ${paren(residuals[0]!)} + 0 \\cdot ${paren(residuals[1]!)} + 1 \\cdot ${paren(residuals[2]!)} = 0$, so they are orthogonal to both columns of $X$.`,
            `残差 $${residuals.join(", ")}$ 之和为 $0$，且 $-1 \\cdot ${paren(residuals[0]!)} + 0 \\cdot ${paren(residuals[1]!)} + 1 \\cdot ${paren(residuals[2]!)} = 0$，所以它们与 $X$ 的两列都正交。`,
          ),
        );

        const wrong = [
          [Q.of(sumY), Q.of(sumXY)],
          [Q.of(sumY, 2), Q.of(sumXY, 3)],
          [Q.of(beta0), Q.of(-beta1)],
          [Q.of(beta1), Q.of(beta0)],
        ];
        return withMistakes(
          pointProblem({ prompt, answer: [beta0, beta1], vector: true, vars: ["\\beta_0", "\\beta_1"], solution, wrong }),
          dedupeSaid(
            [
              say(
                vectorLatex(wrong[0]!),
                "That is $X^Ty$, the right-hand side; divide by the diagonal entries $3$ and $2$ of $X^TX$.",
                "这是右端 $X^Ty$；还要除以 $X^TX$ 的对角元素 $3$ 和 $2$。",
              ),
              say(
                vectorLatex(wrong[1]!),
                "The diagonal entries are swapped: $\\beta_0$ is divided by $n = 3$ and $\\beta_1$ by $\\sum x_i^2 = 2$.",
                "对角元素用反了：$\\beta_0$ 除以 $n = 3$，$\\beta_1$ 除以 $\\sum x_i^2 = 2$。",
              ),
              say(
                vectorLatex(wrong[2]!),
                `The sign of the slope is wrong: $\\sum x_iy_i = (-1) \\cdot ${paren(y1)} + 1 \\cdot ${paren(y3)}$, the last value minus the first.`,
                `斜率的符号错了：$\\sum x_iy_i = (-1) \\cdot ${paren(y1)} + 1 \\cdot ${paren(y3)}$，即最后一个值减第一个值。`,
              ),
              say(
                vectorLatex(wrong[3]!),
                "The entries are swapped: the intercept $\\beta_0$ comes first.",
                "分量顺序反了：截距 $\\beta_0$ 在前。",
              ),
            ],
            vectorLatex([beta0, beta1]),
          ),
        );
      },
    },
    {
      id: "the-entries-of-xtx-and-xty",
      title: t("The entries of $X^TX$ and $X^T\\mathbf{y}$", "$X^TX$ 与 $X^T\\mathbf{y}$ 的元素"),
      explanation: t(
        "For the line $y = \\beta_0 + \\beta_1x$ the design matrix $X$ has a column of ones and a column of $x$-values. Its normal equations $X^TX\\boldsymbol{\\beta} = X^T\\mathbf{y}$ are built from simple sums:\n\n$$X^TX = \\begin{pmatrix} n & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{pmatrix}, \\qquad X^T\\mathbf{y} = \\begin{pmatrix} \\sum y_i \\\\ \\sum x_iy_i \\end{pmatrix}.$$\n\nComputing these four sums is the main work of a straight-line fit. For example, the points $(1, 2), (2, 5), (4, 3)$ give $\\sum x_i = 7$, $\\sum x_i^2 = 21$ and $\\sum x_iy_i = 2 + 10 + 12 = 24$.\n\n> **Watch out.** $\\sum x_i^2$ squares each $x_i$ before adding, which is not $(\\sum x_i)^2$; and the $y$-values appear only in $X^T\\mathbf{y}$, never in $X^TX$.",
        "对直线 $y = \\beta_0 + \\beta_1x$，设计矩阵 $X$ 有一列 1 与一列 $x$ 值。其正规方程 $X^TX\\boldsymbol{\\beta} = X^T\\mathbf{y}$ 由简单的和构成：\n\n$$X^TX = \\begin{pmatrix} n & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{pmatrix}, \\qquad X^T\\mathbf{y} = \\begin{pmatrix} \\sum y_i \\\\ \\sum x_iy_i \\end{pmatrix}$$\n\n计算这四个和是直线拟合的主要工作。例如点 $(1, 2), (2, 5), (4, 3)$ 给出 $\\sum x_i = 7$，$\\sum x_i^2 = 21$，$\\sum x_iy_i = 2 + 10 + 12 = 24$。\n\n> **注意。** $\\sum x_i^2$ 是先把每个 $x_i$ 平方再相加，不是 $(\\sum x_i)^2$；$y$ 值只出现在 $X^T\\mathbf{y}$ 中，从不出现在 $X^TX$ 中。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(3, 4);
        const xs = Array.from({ length: n }, () => rng.int(-3, 5));
        const ys = Array.from({ length: n }, () => rng.int(-4, 8));
        // A line cannot be fitted when every x is the same, and then several slips agree with the answer.
        if (xs.every((x) => x === xs[0])) xs[0] = xs[0]! + 1;
        const kind = rng.int(0, 2);
        // A zero Σxy leaves too few distinct slips; raising the y of a nonzero x moves it by that x.
        const nonzeroAt = xs.findIndex((x) => x !== 0);
        if (kind === 2 && xs.reduce((a, x, i) => a + x * ys[i]!, 0) === 0) ys[nonzeroAt] = ys[nonzeroAt]! + 1;
        const pts = xs.map((x, i) => `(${x}, ${ys[i]})`).join(", ");
        const sx = xs.reduce((a, b) => a + b, 0);
        const sxx = xs.reduce((a, b) => a + b * b, 0);
        const sxy = xs.reduce((a, x, i) => a + x * ys[i]!, 0);
        const sy = ys.reduce((a, b) => a + b, 0);
        const terms = (f: (i: number) => string) => xs.map((_, i) => f(i)).join(" + ");
        const expansion = [
          terms((i) => `${paren(xs[i]!)}^2`),
          terms((i) => paren(xs[i]!)),
          terms((i) => `${paren(xs[i]!)} \\cdot ${paren(ys[i]!)}`),
        ][kind]!;
        const mistakes = [
          [
            why(
              sx * sx,
              `$${sx * sx}$ is $(\\sum x_i)^2$; square each $x_i$ first, then add.`,
              `$${sx * sx}$ 是 $(\\sum x_i)^2$；应先把每个 $x_i$ 平方再相加。`,
            ),
            why(
              sx,
              `$${sx}$ is $\\sum x_i$, the $(1, 2)$ entry; the $(2, 2)$ entry is the $x$-column times itself.`,
              `$${sx}$ 是 $\\sum x_i$，即 $(1, 2)$ 元；$(2, 2)$ 元是 $x$ 列与自身的乘积。`,
            ),
            why(n, `$${n}$ is the $(1, 1)$ entry, the column of ones times itself.`, `$${n}$ 是 $(1, 1)$ 元，即全 1 列与自身的乘积。`),
            why(
              sxy,
              `$${sxy}$ is $\\sum x_iy_i$, an entry of $X^T\\mathbf{y}$; $X^TX$ has no $y$-values.`,
              `$${sxy}$ 是 $\\sum x_iy_i$，属于 $X^T\\mathbf{y}$；$X^TX$ 中没有 $y$ 值。`,
            ),
          ],
          [
            why(
              n,
              `$${n}$ is the $(1, 1)$ entry, the column of ones times itself; the $(1, 2)$ entry pairs the ones with the $x$-values.`,
              `$${n}$ 是 $(1, 1)$ 元，即全 1 列与自身的乘积；$(1, 2)$ 元是全 1 列与 $x$ 列的乘积。`,
            ),
            why(sxx, `$${sxx}$ is $\\sum x_i^2$, the $(2, 2)$ entry.`, `$${sxx}$ 是 $\\sum x_i^2$，即 $(2, 2)$ 元。`),
            why(
              sy,
              `$${sy}$ is $\\sum y_i$, the first entry of $X^T\\mathbf{y}$; $X^TX$ has no $y$-values.`,
              `$${sy}$ 是 $\\sum y_i$，即 $X^T\\mathbf{y}$ 的第一个分量；$X^TX$ 中没有 $y$ 值。`,
            ),
            why(
              Q.of(sx, n),
              `That is the mean $\\bar{x}$; the entry is the column of ones times the $x$-column, the sum $\\sum x_i$, not divided by $n$.`,
              `这是平均值 $\\bar{x}$；该元素是全 1 列与 $x$ 列的乘积，即和 $\\sum x_i$，不除以 $n$。`,
            ),
          ],
          [
            why(
              sx * sy,
              `$${sx * sy}$ is $\\sum x_i \\cdot \\sum y_i$; multiply each $x_i$ by its own $y_i$, then add.`,
              `$${sx * sy}$ 是 $\\sum x_i \\cdot \\sum y_i$；应把每个 $x_i$ 乘以它自己的 $y_i$ 再相加。`,
            ),
            why(
              sy,
              `$${sy}$ is $\\sum y_i$, the first entry of $X^T\\mathbf{y}$; the second entry weights each $y_i$ by $x_i$.`,
              `$${sy}$ 是 $\\sum y_i$，即 $X^T\\mathbf{y}$ 的第一个分量；第二个分量要用 $x_i$ 给每个 $y_i$ 加权。`,
            ),
            why(
              sxx,
              `$${sxx}$ is $\\sum x_i^2$, an entry of $X^TX$, not of $X^T\\mathbf{y}$.`,
              `$${sxx}$ 是 $\\sum x_i^2$，属于 $X^TX$，不属于 $X^T\\mathbf{y}$。`,
            ),
          ],
        ][kind]!;
        const name = ["the $(2, 2)$ entry of $X^TX$", "the $(1, 2)$ entry of $X^TX$", "the second entry of $X^T\\mathbf{y}$"][kind]!;
        const nameZh = ["$X^TX$ 的 $(2, 2)$ 元", "$X^TX$ 的 $(1, 2)$ 元", "$X^T\\mathbf{y}$ 的第二个分量"][kind]!;
        const ans = [sxx, sx, sxy][kind]!;
        const formula = ["\\sum x_i^2", "\\sum x_i", "\\sum x_iy_i"][kind]!;
        return numberProblem({
          prompt: t(
            `For fitting $y = \\beta_0 + \\beta_1x$ to the points $${pts}$, find ${name}.`,
            `用直线 $y = \\beta_0 + \\beta_1x$ 拟合点 $${pts}$，求${nameZh}。`,
          ),
          answer: ans,
          mistakes: distinct(mistakes, ans),
          solution: walked(
            [
              [
                ["Name the entry", "确定元素"],
                t(
                  `The ${["$x$-column times itself", "column of ones times the $x$-column", "$x$-column times $\\mathbf{y}$"][kind]} gives $${formula}$.`,
                  `${["$x$ 列与自身的乘积", "全 1 列与 $x$ 列的乘积", "$x$ 列与 $\\mathbf{y}$ 的乘积"][kind]}给出 $${formula}$。`,
                ),
              ],
              [["Add up", "求和"], t("", ""), [`${formula} = ${expansion} = ${ans}`]],
            ],
            t(
              `$X^TX = ${mat2Latex([
                [n, sx],
                [sx, sxx],
              ])}$ and $X^T\\mathbf{y} = ${vec2Latex([sy, sxy])}$.`,
              `$X^TX = ${mat2Latex([
                [n, sx],
                [sx, sxx],
              ])}$，$X^T\\mathbf{y} = ${vec2Latex([sy, sxy])}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** polynomialRegressionWithMatrices covers Vandermonde design matrices for polynomial curve fitting. */
export const polynomialRegressionWithMatrices: TopicDef = {
  id: "polynomial-regression-with-matrices",
  title: t("Polynomial Regression With Matrices", "基于矩阵的多项式回归"),
  summary: t(
    "Set up Vandermonde design matrices to fit quadratic and higher-degree polynomial models via matrix normal equations.",
    "建立范德蒙德设计矩阵与正规方程以拟合二次及更高阶多项式模型。",
  ),
  intro: t(
    "Fit $y = \\beta_0 + \\beta_1x + \\beta_2x^2$ to $(-1, 2), (0, 1), (1, 4)$. The design matrix has the rows $(1, x_i, x_i^2)$: $(1, -1, 1), (1, 0, 0), (1, 1, 1)$. It is square and invertible, so the least-squares fit passes through the points: the middle row gives $\\beta_0 = 1$, the difference of the outer rows gives $2\\beta_1 = 4 - 2$, so $\\beta_1 = 1$, and their sum gives $2 + 2\\beta_2 = 6$, so $\\beta_2 = 2$.\n\nCheck: $1 - 1 + 2 = 2$, $1 = 1$ and $1 + 1 + 2 = 4$, so $y = 1 + x + 2x^2$ meets all three points.\n\nIn this lesson we fit polynomials by least squares: the design matrix gets one column for each power of $x$, and the normal equations are solved just as for a line.",
    "用 $y = \\beta_0 + \\beta_1x + \\beta_2x^2$ 拟合 $(-1, 2), (0, 1), (1, 4)$。设计矩阵的各行为 $(1, x_i, x_i^2)$：$(1, -1, 1), (1, 0, 0), (1, 1, 1)$。它是可逆方阵，所以最小二乘拟合经过这些点：中间一行给出 $\\beta_0 = 1$，两端两行之差给出 $2\\beta_1 = 4 - 2$，所以 $\\beta_1 = 1$，两行之和给出 $2 + 2\\beta_2 = 6$，所以 $\\beta_2 = 2$。\n\n检验：$1 - 1 + 2 = 2$，$1 = 1$，$1 + 1 + 2 = 4$，所以 $y = 1 + x + 2x^2$ 经过全部三点。\n\n本课我们用最小二乘拟合多项式：设计矩阵中 $x$ 的每个幂占一列，正规方程的解法与直线相同。",
  ),
  prerequisites: ["linear-regression-with-matrices"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "matrix-polynomial-regression",
      title: t("Vandermonde Design Matrix for Polynomial Regression", "多项式回归的范德蒙德设计矩阵"),
      explanation: t(
        "To fit a polynomial model $y = \\beta_0 + \\beta_1 x + \\beta_2 x^2 + \\dots + \\beta_d x^d$ to data points $(x_i, y_i)$, the design matrix $X$ is a Vandermonde matrix with $i$-th row $\\begin{pmatrix} 1 & x_i & x_i^2 & \\dots & x_i^d \\end{pmatrix}$. The coefficient vector $\\beta$ satisfies $X^T X \\beta = X^T y$. For example, a quadratic fit at $x = -2, 1, 3$ has the rows $(1, -2, 4)$, $(1, 1, 1)$ and $(1, 3, 9)$.\n\n> **Watch out.** Each data point gives a row, not a column, and the columns follow the order of the coefficients $\\beta_0, \\beta_1, \\beta_2$: first the ones, then $x_i$, then $x_i^2$, which is not $2x_i$.",
        "为了拟合多项式模型 $y = \\beta_0 + \\beta_1 x + \\beta_2 x^2 + \\dots + \\beta_d x^d$，设计矩阵 $X$ 为范德蒙德矩阵，其第 $i$ 行为 $\\begin{pmatrix} 1 & x_i & x_i^2 & \\dots & x_i^d \\end{pmatrix}$。系数向量 $\\beta$ 满足正规方程 $X^T X \\beta = X^T y$。例如在 $x = -2, 1, 3$ 处作二次拟合，各行为 $(1, -2, 4)$、$(1, 1, 1)$ 和 $(1, 3, 9)$。\n\n> **注意。** 每个数据点给出一行，而不是一列；各列按系数 $\\beta_0, \\beta_1, \\beta_2$ 的顺序排列：先是全 1，再是 $x_i$，然后是 $x_i^2$，而不是 $2x_i$。",
      ),
      generate: (rng: Rng): Problem => {
        const x1 = rng.int(-5, -1);
        const x2 = rng.int(0, 3);
        const x3 = rng.int(4, 9);

        const x1Sq = x1 * x1;
        const x2Sq = x2 * x2;
        const x3Sq = x3 * x3;

        const prompt = t(
          `What is the design matrix $X$ for fitting a quadratic polynomial $y = \\beta_0 + \\beta_1 x + \\beta_2 x^2$ to the data points with $x$-values $x_1 = ${x1}$, $x_2 = ${x2}$, and $x_3 = ${x3}$?`,
          `对具有自变量取值 $x_1 = ${x1}$、$x_2 = ${x2}$ 及 $x_3 = ${x3}$ 的数据点拟合二次多项式 $y = \\beta_0 + \\beta_1 x + \\beta_2 x^2$，其设计矩阵 $X$ 是什么？`,
        );

        const mat: Mat3 = [
          [1, x1, x1Sq],
          [1, x2, x2Sq],
          [1, x3, x3Sq],
        ];

        const right = t(`$${mat3Latex(mat)}$`, `$${mat3Latex(mat)}$`);
        const wrong = [
          t(
            `$${mat3Latex([
              [x1Sq, x1, 1],
              [x2Sq, x2, 1],
              [x3Sq, x3, 1],
            ])}$`,
            `$${mat3Latex([
              [x1Sq, x1, 1],
              [x2Sq, x2, 1],
              [x3Sq, x3, 1],
            ])}$`,
          ),
          t(
            `$${mat3Latex([
              [1, x1, 2 * x1],
              [1, x2, 2 * x2],
              [1, x3, 2 * x3],
            ])}$`,
            `$${mat3Latex([
              [1, x1, 2 * x1],
              [1, x2, 2 * x2],
              [1, x3, 2 * x3],
            ])}$`,
          ),
          t(
            `$${mat3Latex([
              [1, 1, 1],
              [x1, x2, x3],
              [x1Sq, x2Sq, x3Sq],
            ])}$`,
            `$${mat3Latex([
              [1, 1, 1],
              [x1, x2, x3],
              [x1Sq, x2Sq, x3Sq],
            ])}$`,
          ),
          t(
            `$${mat3Latex([
              [0, x1, x1Sq],
              [0, x2, x2Sq],
              [0, x3, x3Sq],
            ])}$`,
            `$${mat3Latex([
              [0, x1, x1Sq],
              [0, x2, x2Sq],
              [0, x3, x3Sq],
            ])}$`,
          ),
        ];

        const solution = walked(
          [
            [
              ["Write the form of a row", "写出一行的形式"],
              t(
                "A point $(x_i, y_i)$ gives the equation $\\beta_0 \\cdot 1 + \\beta_1 x_i + \\beta_2 x_i^2 = y_i$, so its row is $\\begin{pmatrix} 1 & x_i & x_i^2 \\end{pmatrix}$.",
                "点 $(x_i, y_i)$ 给出方程 $\\beta_0 \\cdot 1 + \\beta_1 x_i + \\beta_2 x_i^2 = y_i$，所以它的行是 $\\begin{pmatrix} 1 & x_i & x_i^2 \\end{pmatrix}$。",
              ),
            ],
            [["Fill in the rows", "填入各行"], t("", ""), [`X = ${mat3Latex(mat)}`]],
          ],
          t(
            `The second row reads $1, ${x2}, ${x2Sq}$, and $${x2Sq} = ${paren(x2)}^2$.`,
            `第二行为 $1, ${x2}, ${x2Sq}$，且 $${x2Sq} = ${paren(x2)}^2$。`,
          ),
        );

        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The columns are in reverse order; the first column multiplies $\\beta_0$ and is all ones.",
            "各列顺序反了；第一列乘 $\\beta_0$，应全为 1。",
          ],
          [
            wrong[1]!.en,
            "The last column holds $2x_i$; the coefficient $\\beta_2$ multiplies $x_i^2$.",
            "最后一列是 $2x_i$；系数 $\\beta_2$ 乘的是 $x_i^2$。",
          ],
          [wrong[2]!.en, "That is $X^T$: each data point must give a row, not a column.", "这是 $X^T$：每个数据点应给出一行，而不是一列。"],
          [
            wrong[3]!.en,
            "The first column holds $0$; the constant term $\\beta_0$ multiplies $x_i^0 = 1$.",
            "第一列是 $0$；常数项 $\\beta_0$ 乘的是 $x_i^0 = 1$。",
          ],
        ]);
      },
    },
    {
      id: "a-quadratic-fit-through-three-points-interpolates",
      figure: linearAlgebraDrawings2["polynomial-regression-with-matrices#a-quadratic-fit-through-three-points-interpolates"],
      title: t("A quadratic fit to three points", "三点的二次拟合"),
      explanation: t(
        "Fitting $y = \\beta_0 + \\beta_1x + \\beta_2x^2$ to three points with distinct $x$-values gives a square, invertible design matrix. The least-squares solution then solves $X\\boldsymbol{\\beta} = \\mathbf{y}$ exactly, so the parabola passes through all three points. For $x = -h, 0, h$:\n\n$$\\beta_0 = y_0, \\qquad \\beta_1 = \\frac{y_h - y_{-h}}{2h}, \\qquad \\beta_2 = \\frac{y_h + y_{-h} - 2y_0}{2h^2}.$$\n\nFor example, $(-2, 3), (0, 1), (2, 9)$ give $\\beta_1 = \\frac{9 - 3}{4} = \\frac{3}{2}$ and $\\beta_2 = \\frac{9 + 3 - 2}{8} = \\frac{5}{4}$.\n\n> **Watch out.** The outer points are $2h$ apart, so $\\beta_1$ divides by $2h$, not $h$; and $\\beta_2$ subtracts $2y_0$ and divides by $2h^2$.",
        "用 $y = \\beta_0 + \\beta_1x + \\beta_2x^2$ 拟合 $x$ 值互不相同的三个点，设计矩阵是可逆方阵。此时最小二乘解恰好满足 $X\\boldsymbol{\\beta} = \\mathbf{y}$，抛物线经过全部三点。对 $x = -h, 0, h$：\n\n$$\\beta_0 = y_0, \\qquad \\beta_1 = \\frac{y_h - y_{-h}}{2h}, \\qquad \\beta_2 = \\frac{y_h + y_{-h} - 2y_0}{2h^2}$$\n\n例如 $(-2, 3), (0, 1), (2, 9)$ 给出 $\\beta_1 = \\frac{9 - 3}{4} = \\frac{3}{2}$，$\\beta_2 = \\frac{9 + 3 - 2}{8} = \\frac{5}{4}$。\n\n> **注意。** 两端的点相距 $2h$，所以 $\\beta_1$ 要除以 $2h$，不是 $h$；$\\beta_2$ 要减去 $2y_0$ 并除以 $2h^2$。",
      ),
      generate(rng: Rng): Problem {
        const h = rng.int(1, 2);
        const ym = rng.int(-6, 8);
        const drawnY0 = rng.int(-6, 8);
        const drawnYp = rng.int(-6, 8);
        const which = rng.int(1, 2);
        // With h = 1 and y0 = 0 the slips in the divisor and in 2y0 all give the answer again.
        const y0 = which === 2 && h === 1 && drawnY0 === 0 ? 1 : drawnY0;
        // A zero numerator would make every slip in the division give the answer again.
        const yp = (which === 1 ? drawnYp === ym : drawnYp + ym === 2 * y0) ? drawnYp + 1 : drawnYp;
        const b1 = Q.of(yp - ym, 2 * h);
        const b2 = Q.of(yp + ym - 2 * y0, 2 * h * h);
        const ans = which === 1 ? b1 : b2;
        const pm = paren(ym);
        return numberProblem({
          prompt: t(
            `Fit $y = \\beta_0 + \\beta_1x + \\beta_2x^2$ by least squares to $(${-h}, ${ym})$, $(0, ${y0})$, $(${h}, ${yp})$. Find $\\beta_{${which}}$.`,
            `用最小二乘把 $y = \\beta_0 + \\beta_1x + \\beta_2x^2$ 拟合到 $(${-h}, ${ym})$、$(0, ${y0})$、$(${h}, ${yp})$。求 $\\beta_{${which}}$。`,
          ),
          answer: ans,
          mistakes: distinct(
            which === 1
              ? [
                  why(
                    Q.of(yp - ym),
                    `$${yp - ym}$ is the rise $y_h - y_{-h}$; divide by the run $2h = ${2 * h}$.`,
                    `$${yp - ym}$ 是升高量 $y_h - y_{-h}$；还要除以水平距离 $2h = ${2 * h}$。`,
                  ),
                  why(
                    Q.of(yp - ym, h),
                    `That divides by $h = ${h}$; the outer points are $2h = ${2 * h}$ apart.`,
                    `这是除以 $h = ${h}$；两端的点相距 $2h = ${2 * h}$。`,
                  ),
                  why(
                    b2,
                    "That is $\\beta_2$, the coefficient of $x^2$; $\\beta_1$ is the coefficient of $x$.",
                    "这是 $x^2$ 的系数 $\\beta_2$；$\\beta_1$ 是 $x$ 的系数。",
                  ),
                  why(
                    Q.of(ym - yp, 2 * h),
                    "The subtraction is the wrong way round: the slope runs from $x = -h$ to $x = h$, so it is $y_h - y_{-h}$ over $2h$.",
                    "减法顺序反了：斜率从 $x = -h$ 走到 $x = h$，所以是 $y_h - y_{-h}$ 除以 $2h$。",
                  ),
                ]
              : [
                  why(
                    Q.of(yp + ym - 2 * y0),
                    `$${yp + ym - 2 * y0}$ is $y_h + y_{-h} - 2y_0$; it still has to be divided by $2h^2 = ${2 * h * h}$.`,
                    `$${yp + ym - 2 * y0}$ 是 $y_h + y_{-h} - 2y_0$；还要除以 $2h^2 = ${2 * h * h}$。`,
                  ),
                  why(
                    Q.of(yp + ym - 2 * y0, h * h),
                    `That divides by $h^2 = ${h * h}$; adding the outer equations gives $2\\beta_2h^2$, so divide by $2h^2$.`,
                    `这是除以 $h^2 = ${h * h}$；两端方程相加得 $2\\beta_2h^2$，所以要除以 $2h^2$。`,
                  ),
                  why(
                    Q.of(yp + ym - y0, 2 * h * h),
                    "Adding the outer equations gives $2\\beta_0 = 2y_0$, so subtract $2y_0$, not $y_0$.",
                    "两端方程相加得 $2\\beta_0 = 2y_0$，所以要减去 $2y_0$，不是 $y_0$。",
                  ),
                  why(
                    b1,
                    "That is $\\beta_1$, the coefficient of $x$; $\\beta_2$ is the coefficient of $x^2$.",
                    "这是 $x$ 的系数 $\\beta_1$；$\\beta_2$ 是 $x^2$ 的系数。",
                  ),
                ],
            ans,
          ),
          solution: walked(
            [
              [
                ["The fit is exact", "拟合是精确的"],
                t(
                  `Three distinct $x$-values make $X$ square and invertible, so $X\\boldsymbol{\\beta} = \\mathbf{y}$ holds exactly, and $\\beta_0 = y_0 = ${y0}$.`,
                  `三个互不相同的 $x$ 值使 $X$ 成为可逆方阵，所以 $X\\boldsymbol{\\beta} = \\mathbf{y}$ 精确成立，且 $\\beta_0 = y_0 = ${y0}$。`,
                ),
              ],
              which === 1
                ? [
                    ["Subtract the outer equations", "两端方程相减"],
                    t(`$y_h - y_{-h} = 2\\beta_1h$:`, `$y_h - y_{-h} = 2\\beta_1h$：`),
                    [`\\beta_1 = \\frac{${yp} - ${pm}}{${2 * h}} = ${b1.toLatex()}`],
                  ]
                : [
                    ["Add the outer equations", "两端方程相加"],
                    t(`$y_h + y_{-h} = 2\\beta_0 + 2\\beta_2h^2$:`, `$y_h + y_{-h} = 2\\beta_0 + 2\\beta_2h^2$：`),
                    [`\\beta_2 = \\frac{${yp} + ${pm} - 2 \\cdot ${paren(y0)}}{${2 * h * h}} = ${b2.toLatex()}`],
                  ],
            ],
            t(
              `With $\\beta_1 = ${b1.toLatex()}$ and $\\beta_2 = ${b2.toLatex()}$, the value at $x = ${h}$ is $${Q.of(y0)
                .add(b1.mul(Q.of(h)))
                .add(b2.mul(Q.of(h * h)))
                .toLatex()} = y_h$.`,
              `由 $\\beta_1 = ${b1.toLatex()}$，$\\beta_2 = ${b2.toLatex()}$，在 $x = ${h}$ 处的值为 $${Q.of(y0)
                .add(b1.mul(Q.of(h)))
                .add(b2.mul(Q.of(h * h)))
                .toLatex()} = y_h$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** multipleLinearRegressionWithMatrices covers multiple regression, projection, and the hat matrix. */
export const multipleLinearRegressionWithMatrices: TopicDef = {
  id: "multiple-linear-regression-with-matrices",
  title: t("Multiple Linear Regression With Matrices", "基于矩阵的多元线性回归"),
  summary: t(
    "Set up regression models with several predictors and analyze the hat matrix $H = X(X^T X)^{-1} X^T$.",
    "建立多元线性回归模型，并分析帽子矩阵 $H = X(X^T X)^{-1} X^T$ 的几何与代数性质。",
  ),
  intro: t(
    "A model with an intercept and two predictors is fitted to $20$ observations, giving $\\hat{y} = 2 + 3x_1 - x_2$. For the observation $x_1 = 1$, $x_2 = 4$, $y = 3$, the row of $X$ is $(1, 1, 4)$, so $\\hat{y} = 2 + 3 - 4 = 1$ and the residual is $e = 3 - 1 = 2$. The hat matrix $H = X(X^TX)^{-1}X^T$ that maps $\\mathbf{y}$ to $\\hat{\\mathbf{y}}$ is $20 \\times 20$, but its trace is the number of parameters, $3$.\n\nCheck: $\\hat{y} + e = 1 + 2 = 3 = y$, and $\\operatorname{tr}(H) = \\operatorname{tr}((X^TX)^{-1}X^TX) = \\operatorname{tr}(I_3) = 3$.\n\nIn this lesson we fit models with several predictors by least squares, compute fitted values and residuals, and use the hat matrix, the projection onto the column space of $X$.",
    "一个含截距和两个预测变量的模型对 $20$ 个观测进行拟合，得到 $\\hat{y} = 2 + 3x_1 - x_2$。对观测 $x_1 = 1$，$x_2 = 4$，$y = 3$，$X$ 的对应行为 $(1, 1, 4)$，所以 $\\hat{y} = 2 + 3 - 4 = 1$，残差为 $e = 3 - 1 = 2$。把 $\\mathbf{y}$ 映到 $\\hat{\\mathbf{y}}$ 的帽子矩阵 $H = X(X^TX)^{-1}X^T$ 是 $20 \\times 20$ 的，但它的迹等于参数个数 $3$。\n\n检验：$\\hat{y} + e = 1 + 2 = 3 = y$，且 $\\operatorname{tr}(H) = \\operatorname{tr}((X^TX)^{-1}X^TX) = \\operatorname{tr}(I_3) = 3$。\n\n本课我们用最小二乘拟合含多个预测变量的模型，计算拟合值与残差，并使用帽子矩阵，即向 $X$ 的列空间的投影。",
  ),
  prerequisites: ["polynomial-regression-with-matrices"],
  encompasses: [],
  xp: 16,
  knowledgePoints: [
    {
      id: "multiple-regression-hat-matrix",
      title: t("The Hat Matrix in Multiple Regression", "多元回归中的帽子矩阵"),
      explanation: t(
        "In multiple linear regression $y = X \\beta + \\varepsilon$, the vector of fitted values is $\\hat{y} = X \\hat{\\beta} = X(X^T X)^{-1} X^T y = H y$. The hat matrix $H = X(X^T X)^{-1} X^T$ is an orthogonal projection matrix onto the column space $\\operatorname{Col}(X)$, satisfying $H^2 = H$ (idempotent), $H^T = H$ (symmetric), and $\\operatorname{tr}(H) = \\operatorname{rank}(X)$. For example, with $n = 30$ observations, an intercept and two predictors, $H$ is $30 \\times 30$ and $\\operatorname{tr}(H) = 3$.\n\n> **Watch out.** $H$ is $n \\times n$, but its trace is $p$, not $n$; the trace $n - p$ belongs to $I - H$, the projection onto the residuals; and the intercept counts as a parameter.",
        "在多元线性回归 $y = X \\beta + \\varepsilon$ 中，拟合值向量为 $\\hat{y} = X \\hat{\\beta} = X(X^T X)^{-1} X^T y = H y$。帽子矩阵 $H = X(X^T X)^{-1} X^T$ 是向列空间 $\\operatorname{Col}(X)$ 的正交投影矩阵，满足 $H^2 = H$（幂等）、$H^T = H$（对称）且 $\\operatorname{tr}(H) = \\operatorname{rank}(X)$。例如有 $n = 30$ 个观测、一个截距和两个预测变量时，$H$ 是 $30 \\times 30$ 的，$\\operatorname{tr}(H) = 3$。\n\n> **注意。** $H$ 是 $n \\times n$ 的，但它的迹是 $p$，不是 $n$；迹 $n - p$ 属于 $I - H$，即向残差的投影；截距也算一个参数。",
      ),
      generate: (rng: Rng): Problem => {
        const n = rng.int(15, 50);
        const p = rng.int(2, 6);

        const prompt = t(
          `In a multiple linear regression model with $n = ${n}$ observations and $p = ${p}$ parameters (including the intercept), the design matrix $X$ has full column rank. What is the trace of the hat matrix $H = X(X^T X)^{-1} X^T$?`,
          `在具有 $n = ${n}$ 个观测样本与 $p = ${p}$ 个回归参数（包含截距项）的多元线性回归模型中，设计矩阵 $X$ 为列满秩。求帽子矩阵 $H = X(X^T X)^{-1} X^T$ 的迹 $\\operatorname{tr}(H)$。`,
        );

        return numberProblem({
          prompt,
          answer: p,
          mistakes: distinct(
            [
              why(
                n,
                `$${n}$ is the size of $H$; its trace is the dimension of the column space it projects onto.`,
                `$${n}$ 是 $H$ 的阶数；它的迹是它投影到的列空间的维数。`,
              ),
              why(
                n - p,
                `$${n - p}$ is the trace of $I - H$, the projection onto the residuals.`,
                `$${n - p}$ 是 $I - H$ 的迹，即向残差的投影的迹。`,
              ),
              why(
                p - 1,
                "The intercept is one of the $p$ parameters and gives a column of $X$ too.",
                "截距也是 $p$ 个参数之一，同样给出 $X$ 的一列。",
              ),
              why(
                1,
                "$H^2 = H$ makes every eigenvalue $0$ or $1$; the trace counts the eigenvalues equal to $1$, one for each column of $X$.",
                "$H^2 = H$ 使每个特征值为 $0$ 或 $1$；迹数的是等于 $1$ 的特征值，$X$ 的每一列对应一个。",
              ),
            ],
            p,
          ),
          solution: walked(
            [
              [
                ["Cycle the factors", "循环移动因子"],
                t("The trace is unchanged when the factors of a product are cycled:", "乘积的因子循环移动时迹不变："),
                [`\\operatorname{tr}(H) = \\operatorname{tr}(X (X^T X)^{-1} X^T) = \\operatorname{tr}((X^T X)^{-1} X^T X)`],
              ],
              [
                ["Read the identity", "读出单位矩阵"],
                t(
                  `$X^TX$ is $${p} \\times ${p}$, so the product is $I_{${p}}$:`,
                  `$X^TX$ 是 $${p} \\times ${p}$ 的，所以乘积是 $I_{${p}}$：`,
                ),
                [`\\operatorname{tr}(I_{${p}}) = ${p}`],
              ],
            ],
            t(
              `$H$ projects onto $\\operatorname{Col}(X)$, which has dimension $\\operatorname{rank}(X) = ${p}$, and $\\operatorname{tr}(I - H) = ${n} - ${p} = ${n - p}$ is the rest.`,
              `$H$ 投影到 $\\operatorname{Col}(X)$，其维数为 $\\operatorname{rank}(X) = ${p}$，而 $\\operatorname{tr}(I - H) = ${n} - ${p} = ${n - p}$ 是剩下的部分。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-fitted-value-and-residual-in-multiple-regression",
      title: t("A fitted value and residual in multiple regression", "多元回归中的拟合值与残差"),
      explanation: t(
        "Once $\\hat{\\boldsymbol{\\beta}} = (X^TX)^{-1}X^T\\mathbf{y}$ is known, the fitted values are $\\hat{\\mathbf{y}} = X\\hat{\\boldsymbol{\\beta}}$: each row of $X$, $(1, x_{i1}, x_{i2})$, is dotted with $\\hat{\\boldsymbol{\\beta}}$. The residual of an observation is $e_i = y_i - \\hat{y}_i$, positive when the observation lies above the fitted plane and negative when it lies below. For example, $\\hat{y} = 1 + 2x_1 - x_2$ at $x_1 = 3$, $x_2 = 2$ gives $\\hat{y} = 5$, so an observation $y = 4$ has residual $-1$.\n\n> **Watch out.** The residual is observed minus fitted, $y_i - \\hat{y}_i$, not the other way round; and the row of $X$ starts with $1$, so the intercept is part of $\\hat{y}_i$.",
        "求得 $\\hat{\\boldsymbol{\\beta}} = (X^TX)^{-1}X^T\\mathbf{y}$ 后，拟合值为 $\\hat{\\mathbf{y}} = X\\hat{\\boldsymbol{\\beta}}$：$X$ 的每一行 $(1, x_{i1}, x_{i2})$ 与 $\\hat{\\boldsymbol{\\beta}}$ 作点积。观测的残差为 $e_i = y_i - \\hat{y}_i$，观测在拟合平面上方时为正，下方时为负。例如 $\\hat{y} = 1 + 2x_1 - x_2$ 在 $x_1 = 3$，$x_2 = 2$ 处给出 $\\hat{y} = 5$，所以观测 $y = 4$ 的残差为 $-1$。\n\n> **注意。** 残差是观测值减拟合值 $y_i - \\hat{y}_i$，顺序不能反；$X$ 的行以 $1$ 开头，所以截距是 $\\hat{y}_i$ 的一部分。",
      ),
      generate(rng: Rng): Problem {
        const b = [rng.nonZero(-5, 8), rng.nonZero(-4, 4), rng.nonZero(-4, 4)] as const;
        const x1 = rng.int(0, 6);
        const x2 = rng.int(-3, 5);
        const yhat = b[0] + b[1] * x1 + b[2] * x2;
        const y = yhat + rng.nonZero(-5, 5);
        const ans = y - yhat;
        return numberProblem({
          prompt: t(
            `A fitted model is $\\hat{y} = ${b[0]} ${formatAddVar(b[1], "x_1")} ${formatAddVar(b[2], "x_2")}$. Find the residual of the observation $x_1 = ${x1}$, $x_2 = ${x2}$, $y = ${y}$.`,
            `拟合模型为 $\\hat{y} = ${b[0]} ${formatAddVar(b[1], "x_1")} ${formatAddVar(b[2], "x_2")}$。求观测 $x_1 = ${x1}$，$x_2 = ${x2}$，$y = ${y}$ 的残差。`,
          ),
          answer: ans,
          mistakes: distinct(
            [
              why(
                -ans,
                `That is $\\hat{y} - y$; the residual is observed minus fitted, $${y} - ${paren(yhat)}$.`,
                `这是 $\\hat{y} - y$；残差是观测值减拟合值，即 $${y} - ${paren(yhat)}$。`,
              ),
              why(
                yhat,
                `$${yhat}$ is the fitted value $\\hat{y}$; subtract it from the observed $y = ${y}$.`,
                `$${yhat}$ 是拟合值 $\\hat{y}$；还要用观测值 $y = ${y}$ 减去它。`,
              ),
              why(
                y - (b[1] * x1 + b[2] * x2),
                `The intercept $${b[0]}$ was left out of $\\hat{y}$; the row of $X$ starts with $1$.`,
                `$\\hat{y}$ 中漏掉了截距 $${b[0]}$；$X$ 的行以 $1$ 开头。`,
              ),
              why(
                y - b[0],
                "Only the intercept was subtracted; the predictor terms belong to $\\hat{y}$ too.",
                "只减去了截距；预测变量的项也属于 $\\hat{y}$。",
              ),
            ],
            ans,
          ),
          solution: walked(
            [
              [
                ["Compute the fitted value", "计算拟合值"],
                t("Dot the row $(1, x_1, x_2)$ with the coefficients:", "用行 $(1, x_1, x_2)$ 与系数作点积："),
                [`\\hat{y} = ${b[0]} + ${paren(b[1])} \\cdot ${x1} + ${paren(b[2])} \\cdot ${paren(x2)} = ${yhat}`],
              ],
              [["Subtract", "相减"], t("", ""), [`e = y - \\hat{y} = ${y} - ${paren(yhat)} = ${ans}`]],
            ],
            t(
              `$\\hat{y} + e = ${yhat} ${signed(ans)} = ${y} = y$, and the observation is ${ans > 0 ? "above" : "below"} the fitted plane, as the sign of $e$ says.`,
              `$\\hat{y} + e = ${yhat} ${signed(ans)} = ${y} = y$，且观测在拟合平面${ans > 0 ? "上方" : "下方"}，与 $e$ 的符号一致。`,
            ),
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// TOPIC EXPORT LIST
// ════════════════════════════════════════════════════════════════════════════

/** linearAlgebraQuadraticFormsApplicationsTopics exports all topics for Units 7 and 8 of Linear Algebra. */
export const linearAlgebraQuadraticFormsApplicationsTopics: readonly TopicDef[] = [
  // Module 7.25: Diagonalization of Symmetric Matrices
  symmetricMatrices,
  diagonalizationOf2x2SymmetricMatrices,
  diagonalizationOf3x3SymmetricMatrices,
  spectralTheorem,

  // Module 7.26: Quadratic Forms
  bilinearForms,
  quadraticForms,
  changeOfVariablesInQuadraticForms,
  canonicalFormOfAQuadraticFormUsingLagrangesMethod,
  canonicalFormOfAQuadraticFormUsingOrthogonalTransformations,
  positiveDefiniteAndNegativeDefiniteQuadraticForms,

  // Module 7.27: Quadratic Forms in Euclidean Space
  reducingAQuadraticCurveToItsPrincipalAxes,
  classifyingQuadraticCurves,

  // Module 7.28: Singular Value Decomposition
  constrainedOptimizationOfQuadraticForms,
  constrainedOptimizationOfQuadraticFormsDeterminingWhereExtremaAreAttained,
  singularValuesOfAMatrix,
  computingTheSingularValuesOfAMatrix,
  singularValueDecompositionOf2x2Matrices,
  singularValueDecompositionOf2x2MatricesWithZeroOrRepeatedEigenvalues,
  singularValueDecompositionOfLargerMatrices,
  singularValueDecompositionAndThePseudoinverseMatrix,

  // Module 8.29: Linear Least-Squares Problems
  leastSquaresSolutionOfALinearSystemWithoutCollinearity,
  leastSquaresSolutionOfALinearSystemWithCollinearity,
  findingALeastSquaresSolutionUsingQrFactorization,
  weightedLeastSquares,

  // Module 8.30: Markov Chains
  markovChains,
  steadyStateVectors,

  // Module 8.31: Linear Regression
  linearRegressionWithMatrices,
  polynomialRegressionWithMatrices,
  multipleLinearRegressionWithMatrices,
];
