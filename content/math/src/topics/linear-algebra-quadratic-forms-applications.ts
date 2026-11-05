import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { article, choiceProblem, numberProblem, pointProblem, solutionsProblem } from "../problems.ts";

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
  prerequisites: ["calculating-the-eigenvalues-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "symmetric-matrices-properties",
      title: t("Orthogonality of Eigenvectors of Symmetric Matrices", "对称矩阵特征向量的正交性"),
      explanation: t(
        "A real matrix $A$ is symmetric if $A^T = A$. For any real symmetric matrix, all eigenvalues are real, and eigenvectors corresponding to distinct eigenvalues are mutually orthogonal ($u \\cdot v = 0$).",
        "实矩阵 $A$ 满足 $A^T = A$ 时称为实对称矩阵。实对称矩阵的特征值全为实数，且属于不同特征值的特征向量相互正交（点积为 0）。",
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

        const solution = t(
          `Because $A$ is a real symmetric matrix, eigenvectors corresponding to distinct eigenvalues are orthogonal: $v_1 \\cdot v_2 = 0$. Hence $(${u1})(${v1}) + (${u2})x_2 = 0$, giving $(${u2})x_2 = ${-u1 * v1}$, which yields $x_2 = ${v2}$. Thus $v_2 = \\langle ${v1}, ${v2} \\rangle$.`,
          `因为 $A$ 为实对称矩阵，不同特征值对应的特征向量相互正交：$v_1 \\cdot v_2 = 0$。即 $(${u1})(${v1}) + (${u2})x_2 = 0$，得 $(${u2})x_2 = ${-u1 * v1}$，解得 $x_2 = ${v2}$。因此 $v_2 = \\langle ${v1}, ${v2} \\rangle$。`,
        );

        return pointProblem({
          prompt,
          answer: [v1, v2],
          vector: true,
          vars: ["x_1", "x_2"],
          solution,
          wrong: [
            [v1, -v2],
            [-v1, v2],
            [u1, u2],
            [-u2, u1],
          ],
        });
      },
    },
    {
      id: "making-a-matrix-symmetric",
      title: t("Making a matrix symmetric", "使矩阵成为对称矩阵"),
      explanation: t(
        "A square matrix is symmetric when $A^T = A$, that is, $a_{ij} = a_{ji}$ for every pair of positions mirrored across the main diagonal. The diagonal entries are unrestricted. To make a matrix with an unknown entry symmetric, set that entry equal to its mirror image and solve the resulting equation.",
        "方阵满足 $A^T = A$，即关于主对角线对称的每对位置都有 $a_{ij} = a_{ji}$ 时，称为对称矩阵。对角元不受限制。要让含未知元的矩阵对称，令该元等于它的镜像元并解所得方程。",
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
        return numberProblem({
          prompt: t(`Find $x$ so that $${latex}$ is symmetric.`, `求 $x$，使 $${latex}$ 为对称矩阵。`),
          answer: x,
          wrong: [v - q, -x, Q.of(v, p), Q.of(v + q, p)],
          solution: t(
            `Symmetry requires $a_{${i + 1}${j + 1}} = a_{${j + 1}${i + 1}}$: $${expr} = ${v}$, so $x = ${x}$.`,
            `对称要求 $a_{${i + 1}${j + 1}} = a_{${j + 1}${i + 1}}$：$${expr} = ${v}$，所以 $x = ${x}$。`,
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
  prerequisites: ["symmetric-matrices"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "orthogonal-diagonalization-2x2",
      title: t("Orthogonal Diagonalization of a 2x2 Matrix", "2x2 矩阵的正交对角化"),
      explanation: t(
        "Every real symmetric matrix $A$ can be orthogonally diagonalized as $A = P D P^T$, where $P$ is an orthogonal matrix ($P^{-1} = P^T$) whose columns are orthonormal eigenvectors, and $D$ contains the eigenvalues of $A$.",
        "任意实对称矩阵 $A$ 都可以正交对角化为 $A = P D P^T$，其中正交矩阵 $P$（满足 $P^{-1} = P^T$）的各列为标准正交特征向量，对角矩阵 $D$ 的对角元为 $A$ 的特征值。",
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

        const solution = t(
          `The characteristic equation of $A$ is $\\det(A - \\lambda I) = (${a} - \\lambda)^2 - ${b}^2 = 0$. Solving gives $(${a} - \\lambda - ${b})(${a} - \\lambda + ${b}) = 0$, so $\\lambda_1 = ${lambda1}$ and $\\lambda_2 = ${lambda2}$. Thus $D = ${mat2Latex(
            [
              [lambda1, 0],
              [0, lambda2],
            ],
          )}$.`,
          `矩阵 $A$ 的特征方程为 $\\det(A - \\lambda I) = (${a} - \\lambda)^2 - ${b}^2 = 0$。解得 $(${a} - \\lambda - ${b})(${a} - \\lambda + ${b}) = 0$，即特征值为 $\\lambda_1 = ${lambda1}$ 和 $\\lambda_2 = ${lambda2}$。因此 $D = ${mat2Latex(
            [
              [lambda1, 0],
              [0, lambda2],
            ],
          )}$。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "rebuilding-a-symmetric-matrix-from-its-eigen-data",
      title: t("Rebuilding a symmetric matrix from $P$ and $D$", "由 $P$ 与 $D$ 还原对称矩阵"),
      explanation: t(
        "An orthogonal diagonalization $A = PDP^T$ can be run backwards. If the unit eigenvectors are $\\frac{1}{\\sqrt{n}}(1, k)$ for $\\lambda_1$ and $\\frac{1}{\\sqrt{n}}(-k, 1)$ for $\\lambda_2$, with $n = 1 + k^2$, then multiplying out gives\n\n$$A = \\frac{1}{n}\\begin{pmatrix} \\lambda_1 + k^2\\lambda_2 & k(\\lambda_1 - \\lambda_2) \\\\ k(\\lambda_1 - \\lambda_2) & k^2\\lambda_1 + \\lambda_2 \\end{pmatrix}.$$\n\nThe result is automatically symmetric, and its trace is $\\lambda_1 + \\lambda_2$.",
        "正交对角化 $A = PDP^T$ 可以反过来用。若 $\\lambda_1$ 的单位特征向量为 $\\frac{1}{\\sqrt{n}}(1, k)$，$\\lambda_2$ 的为 $\\frac{1}{\\sqrt{n}}(-k, 1)$，$n = 1 + k^2$，则乘开得\n\n$$A = \\frac{1}{n}\\begin{pmatrix} \\lambda_1 + k^2\\lambda_2 & k(\\lambda_1 - \\lambda_2) \\\\ k(\\lambda_1 - \\lambda_2) & k^2\\lambda_1 + \\lambda_2 \\end{pmatrix}。$$\n\n结果自然是对称的，迹为 $\\lambda_1 + \\lambda_2$。",
      ),
      generate(rng: Rng): Problem {
        const [l1, l2, k] = pickEigenPair(rng, -4, 6);
        const A = symFromEigen(l1, l2, k);
        const n = 1 + k * k;
        const ans = [A[0][0], A[0][1], A[1][1]] as const;
        return pointProblem({
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
          wrong: [
            [A[1][1], A[0][1], A[0][0]],
            [A[0][0], -A[0][1], A[1][1]],
            [l1, 0, l2],
          ],
          solution: t(
            `$A = \\frac{1}{${n}}${mat2Latex([
              [l1 + l2 * k * k, k * (l1 - l2)],
              [k * (l1 - l2), l1 * k * k + l2],
            ])} = ${mat2Latex(A)}$. Check: the trace is $${A[0][0] + A[1][1]} = ${l1} + ${l2 < 0 ? `(${l2})` : l2}$.`,
            `$A = \\frac{1}{${n}}${mat2Latex([
              [l1 + l2 * k * k, k * (l1 - l2)],
              [k * (l1 - l2), l1 * k * k + l2],
            ])} = ${mat2Latex(A)}$。检验：迹为 $${A[0][0] + A[1][1]} = ${l1} + ${l2 < 0 ? `(${l2})` : l2}$。`,
          ),
        });
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
  prerequisites: ["diagonalization-of-2x2-symmetric-matrices"],
  encompasses: [],
  xp: 16,
  knowledgePoints: [
    {
      id: "orthogonal-diagonalization-3x3",
      title: t("Eigenvalues and Orthogonal Diagonalization of a 3x3 Symmetric Matrix", "3x3 对称矩阵的特征值与正交对角化"),
      explanation: t(
        "A $3 \\times 3$ real symmetric matrix has 3 real eigenvalues (counting multiplicity). An orthonormal basis of $\\mathbb{R}^3$ consisting of eigenvectors of $A$ can always be constructed, using the Gram-Schmidt process on any repeated eigenspace.",
        "$3 \\times 3$ 实对称矩阵具有 $3$ 个实特征值（计重数）。总能构造由其特征向量组成的 $\\mathbb{R}^3$ 标准正交基；当出现重特征值时，可对其特征子空间使用施密特正交化。",
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

        const solution = t(
          `Because $A$ is block diagonal with a $2 \\times 2$ block $\\begin{pmatrix} ${m} & ${k} \\\\ ${k} & ${m} \\end{pmatrix}$ and a $1 \\times 1$ block $(${c})$, its characteristic polynomial factors as $\\det(A - \\lambda I) = [(${m} - \\lambda)^2 - ${k}^2](${c} - \\lambda) = 0$. Solving gives $\\lambda = ${l1}$, $\\lambda = ${l2}$, and $\\lambda = ${c}$.`,
          `因为 $A$ 为分块对角矩阵，包含 $2 \\times 2$ 块 $\\begin{pmatrix} ${m} & ${k} \\\\ ${k} & ${m} \\end{pmatrix}$ 与 $1 \\times 1$ 块 $(${c})$，其特征多项式分解为 $\\det(A - \\lambda I) = [(${m} - \\lambda)^2 - ${k}^2](${c} - \\lambda) = 0$。解得特征值为 $\\lambda = ${l1}, ${l2}, ${c}$。`,
        );

        return solutionsProblem({
          prompt,
          values,
          solution,
          wrong: [
            [m, k, c].sort((x, y) => x - y).map(String),
            [l1, l2, -c].sort((x, y) => x - y).map(String),
            [m - 2 * k, m + 2 * k, c].sort((x, y) => x - y).map(String),
          ],
        });
      },
    },
    {
      id: "the-third-eigenvector-of-a-3x3-symmetric-matrix",
      title: t("The third eigenvector by orthogonality", "用正交性求第三个特征向量"),
      explanation: t(
        "Eigenvectors of a symmetric matrix that belong to different eigenvalues are orthogonal. So if a $3 \\times 3$ symmetric matrix has three distinct eigenvalues and two of its eigenvectors $\\mathbf{v}_1, \\mathbf{v}_2$ are known, the third eigenvector must be orthogonal to both. The cross product $\\mathbf{v}_1 \\times \\mathbf{v}_2$ is such a vector, and any nonzero multiple of it works.",
        "对称矩阵属于不同特征值的特征向量相互正交。所以若 $3 \\times 3$ 对称矩阵有三个不同特征值，且已知其中两个特征向量 $\\mathbf{v}_1, \\mathbf{v}_2$，则第三个特征向量必与二者都正交。叉积 $\\mathbf{v}_1 \\times \\mathbf{v}_2$ 就是这样的向量，它的任意非零倍数都可以。",
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
        return pointProblem({
          prompt: t(
            `A $3 \\times 3$ symmetric matrix has three distinct eigenvalues, and $${vec3Latex(v1)}$ and $${vec3Latex(v2)}$ are eigenvectors for two of them. Find the eigenvector for the third eigenvalue scaled so that its first component is $1$.`,
            `某 $3 \\times 3$ 对称矩阵有三个不同特征值，$${vec3Latex(v1)}$ 与 $${vec3Latex(v2)}$ 是其中两个特征值的特征向量。求第三个特征值的特征向量，并缩放使其第一个分量为 $1$。`,
          ),
          answer: ans,
          vector: true,
          vars: ["x_1", "x_2", "x_3"],
          wrong: [
            [Q.of(1), Q.of(-c[1], c[0]), Q.of(-c[2], c[0])],
            [Q.of(1), Q.of(c[2], c[0]), Q.of(c[1], c[0])],
          ],
          solution: t(
            `The third eigenvector is orthogonal to both, so take $\\mathbf{v}_1 \\times \\mathbf{v}_2 = ${vec3Latex(c)}$ and divide by $${c[0]}$.`,
            `第三个特征向量与二者都正交，取 $\\mathbf{v}_1 \\times \\mathbf{v}_2 = ${vec3Latex(c)}$，再除以 $${c[0]}$。`,
          ),
        });
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
  prerequisites: ["diagonalization-of-3x3-symmetric-matrices"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "spectral-decomposition",
      title: t("Spectral Decomposition of a Symmetric Matrix", "实对称矩阵的谱分解"),
      explanation: t(
        "By the Spectral Theorem, any $n \\times n$ real symmetric matrix $A$ can be written as $A = \\sum_{i=1}^n \\lambda_i u_i u_i^T$, where $\\{u_1, \\dots, u_n\\}$ is an orthonormal basis of eigenvectors. Each $P_i = u_i u_i^T$ is a rank-1 orthogonal projection matrix satisfying $P_i^2 = P_i$, $P_i P_j = 0$ for $i \\ne j$, and $\\sum P_i = I$.",
        "根据谱定理，任意 $n \\times n$ 实对称矩阵 $A$ 均可表示为谱分解 $A = \\sum_{i=1}^n \\lambda_i u_i u_i^T$，其中 $\\{u_1, \\dots, u_n\\}$ 为标准正交特征向量基。每个 $P_i = u_i u_i^T$ 均为秩 1 正交投影矩阵，满足 $P_i^2 = P_i$、$i \\ne j$ 时 $P_i P_j = 0$ 以及 $\\sum P_i = I$。",
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

        const solution = t(
          `Compute the outer product: $P_1 = u_1 u_1^T = \\frac{1}{${hypSq}} ${vec2Latex([a, b])} \\begin{pmatrix} ${a} & ${b} \\end{pmatrix} = \\frac{1}{${hypSq}} ${mat2Latex(
            [
              [p11, p12],
              [p12, p22],
            ],
          )}$.`,
          `计算外积：$P_1 = u_1 u_1^T = \\frac{1}{${hypSq}} ${vec2Latex([a, b])} \\begin{pmatrix} ${a} & ${b} \\end{pmatrix} = \\frac{1}{${hypSq}} ${mat2Latex(
            [
              [p11, p12],
              [p12, p22],
            ],
          )}$。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "applying-a-spectral-decomposition-to-a-vector",
      title: t("Applying a spectral decomposition to a vector", "用谱分解作用于向量"),
      explanation: t(
        "The spectral theorem writes a symmetric matrix as $A = \\lambda_1\\mathbf{u}_1\\mathbf{u}_1^T + \\lambda_2\\mathbf{u}_2\\mathbf{u}_2^T$ with orthonormal eigenvectors $\\mathbf{u}_1, \\mathbf{u}_2$. To apply $A$ to a vector, write the vector in the eigenvector basis: if $\\mathbf{x} = \\alpha\\mathbf{v}_1 + \\beta\\mathbf{v}_2$ with eigenvectors $\\mathbf{v}_1, \\mathbf{v}_2$, then $A\\mathbf{x} = \\lambda_1\\alpha\\mathbf{v}_1 + \\lambda_2\\beta\\mathbf{v}_2$. Each component is simply scaled by its eigenvalue.",
        "谱定理把对称矩阵写成 $A = \\lambda_1\\mathbf{u}_1\\mathbf{u}_1^T + \\lambda_2\\mathbf{u}_2\\mathbf{u}_2^T$，$\\mathbf{u}_1, \\mathbf{u}_2$ 为标准正交特征向量。要把 $A$ 作用于向量，先把向量写在特征向量基下：若 $\\mathbf{x} = \\alpha\\mathbf{v}_1 + \\beta\\mathbf{v}_2$，$\\mathbf{v}_1, \\mathbf{v}_2$ 为特征向量，则 $A\\mathbf{x} = \\lambda_1\\alpha\\mathbf{v}_1 + \\lambda_2\\beta\\mathbf{v}_2$。每个分量只是按其特征值缩放。",
      ),
      generate(rng: Rng): Problem {
        const [l1, l2, k] = pickEigenPair(rng, -3, 5);
        const al = rng.nonZero(-3, 3);
        const be = rng.nonZero(-3, 3);
        const x = [al - k * be, al * k + be] as const;
        const ax = [l1 * al - l2 * k * be, l1 * al * k + l2 * be] as const;
        return pointProblem({
          prompt: t(
            `A symmetric matrix $A$ has eigenvalue $${l1}$ with eigenvector $${vec2Latex([1, k])}$ and eigenvalue $${l2}$ with eigenvector $${vec2Latex([-k, 1])}$. Find $A\\mathbf{x}$ for $\\mathbf{x} = ${vec2Latex(x)}$.`,
            `对称矩阵 $A$ 有特征值 $${l1}$，特征向量 $${vec2Latex([1, k])}$，以及特征值 $${l2}$，特征向量 $${vec2Latex([-k, 1])}$。对 $\\mathbf{x} = ${vec2Latex(x)}$ 求 $A\\mathbf{x}$。`,
          ),
          answer: ax,
          vector: true,
          wrong: [
            [l1 * x[0], l2 * x[1]],
            [l2 * al - l1 * k * be, l2 * al * k + l1 * be],
            [(l1 + l2) * x[0], (l1 + l2) * x[1]],
          ],
          solution: t(
            `$\\mathbf{x} = ${al}${vec2Latex([1, k])} + ${be < 0 ? `(${be})` : be}${vec2Latex([-k, 1])}$, so $A\\mathbf{x} = ${l1 * al}${vec2Latex([1, k])} + ${l2 * be < 0 ? `(${l2 * be})` : l2 * be}${vec2Latex([-k, 1])} = ${vec2Latex(ax)}$.`,
            `$\\mathbf{x} = ${al}${vec2Latex([1, k])} + ${be < 0 ? `(${be})` : be}${vec2Latex([-k, 1])}$，所以 $A\\mathbf{x} = ${l1 * al}${vec2Latex([1, k])} + ${l2 * be < 0 ? `(${l2 * be})` : l2 * be}${vec2Latex([-k, 1])} = ${vec2Latex(ax)}$。`,
          ),
        });
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
  prerequisites: ["spectral-theorem"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "bilinear-forms-matrix",
      title: t("Matrix Representation of a Bilinear Form", "双线性型的矩阵表示"),
      explanation: t(
        "A bilinear form $B(x, y)$ on $\\mathbb{R}^n$ can be expressed uniquely as $B(x, y) = x^T A y$, where the entry $a_{ij} = B(e_i, e_j)$ is the coefficient of $x_i y_j$.",
        "$\\mathbb{R}^n$ 上的双线性型 $B(x, y)$ 可唯一表示为 $B(x, y) = x^T A y$，其中矩阵元 $a_{ij} = B(e_i, e_j)$ 即为对应项 $x_i y_j$ 的系数。",
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

        const solution = t(
          `The entry in row $i$, column $j$ of $A$ is the coefficient of $x_i y_j$. Therefore, $a_{11} = ${a11}$, $a_{12} = ${a12}$, $a_{21} = ${a21}$, and $a_{22} = ${a22}$, giving $A = ${mat2Latex(
            [
              [a11, a12],
              [a21, a22],
            ],
          )}$.`,
          `矩阵 $A$ 第 $i$ 行第 $j$ 列的元素就是 $x_i y_j$ 的系数。因此 $a_{11} = ${a11}$，$a_{12} = ${a12}$，$a_{21} = ${a21}$，$a_{22} = ${a22}$，故 $A = ${mat2Latex(
            [
              [a11, a12],
              [a21, a22],
            ],
          )}$。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "evaluating-a-bilinear-form-from-its-matrix",
      title: t("Evaluating a bilinear form from its matrix", "由矩阵计算双线性型的值"),
      explanation: t(
        "A bilinear form on $\\mathbb{R}^2$ with matrix $A$ is $B(\\mathbf{x}, \\mathbf{y}) = \\mathbf{x}^T A\\mathbf{y} = \\sum_{i, j} a_{ij}x_iy_j$. To evaluate it, first compute $A\\mathbf{y}$ and then take the dot product with $\\mathbf{x}$. When $A$ is not symmetric, swapping the arguments can change the value, since $B(\\mathbf{y}, \\mathbf{x}) = \\mathbf{x}^T A^T\\mathbf{y}$.",
        "$\\mathbb{R}^2$ 上矩阵为 $A$ 的双线性型为 $B(\\mathbf{x}, \\mathbf{y}) = \\mathbf{x}^T A\\mathbf{y} = \\sum_{i, j} a_{ij}x_iy_j$。计算时先求 $A\\mathbf{y}$，再与 $\\mathbf{x}$ 作点积。当 $A$ 不对称时，交换两个自变量可能改变值，因为 $B(\\mathbf{y}, \\mathbf{x}) = \\mathbf{x}^T A^T\\mathbf{y}$。",
      ),
      generate(rng: Rng): Problem {
        const A: Mat2 = [
          [rng.int(-4, 4), rng.int(-4, 4)],
          [rng.int(-4, 4), rng.int(-4, 4)],
        ];
        const x = [rng.nonZero(-3, 3), rng.int(-3, 3)] as const;
        const y = [rng.int(-3, 3), rng.nonZero(-3, 3)] as const;
        const Ay = [A[0][0] * y[0] + A[0][1] * y[1], A[1][0] * y[0] + A[1][1] * y[1]] as const;
        const ans = x[0] * Ay[0] + x[1] * Ay[1];
        const swapped = y[0] * (A[0][0] * x[0] + A[0][1] * x[1]) + y[1] * (A[1][0] * x[0] + A[1][1] * x[1]);
        return numberProblem({
          prompt: t(
            `$B(\\mathbf{x}, \\mathbf{y}) = \\mathbf{x}^T A\\mathbf{y}$ with $A = ${mat2Latex(A)}$. Find $B(\\mathbf{x}, \\mathbf{y})$ for $\\mathbf{x} = ${vec2Latex(x)}$ and $\\mathbf{y} = ${vec2Latex(y)}$.`,
            `$B(\\mathbf{x}, \\mathbf{y}) = \\mathbf{x}^T A\\mathbf{y}$，$A = ${mat2Latex(A)}$。对 $\\mathbf{x} = ${vec2Latex(x)}$ 与 $\\mathbf{y} = ${vec2Latex(y)}$ 求 $B(\\mathbf{x}, \\mathbf{y})$。`,
          ),
          answer: ans,
          wrong: [swapped, Ay[0] + Ay[1], -ans, x[0] * y[0] + x[1] * y[1]],
          solution: t(
            `$A\\mathbf{y} = ${vec2Latex(Ay)}$, so $B(\\mathbf{x}, \\mathbf{y}) = ${x[0]} \\cdot ${Ay[0] < 0 ? `(${Ay[0]})` : Ay[0]} + ${x[1] < 0 ? `(${x[1]})` : x[1]} \\cdot ${Ay[1] < 0 ? `(${Ay[1]})` : Ay[1]} = ${ans}$.`,
            `$A\\mathbf{y} = ${vec2Latex(Ay)}$，所以 $B(\\mathbf{x}, \\mathbf{y}) = ${x[0]} \\cdot ${Ay[0] < 0 ? `(${Ay[0]})` : Ay[0]} + ${x[1] < 0 ? `(${x[1]})` : x[1]} \\cdot ${Ay[1] < 0 ? `(${Ay[1]})` : Ay[1]} = ${ans}$。`,
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
  prerequisites: ["bilinear-forms"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "quadratic-forms-symmetric-matrix",
      title: t("Symmetric Matrix of a Quadratic Form", "二次型的对称矩阵"),
      explanation: t(
        "A quadratic form $Q(x) = x^T A x$ is represented uniquely by a symmetric matrix $A = A^T$. The diagonal entry $a_{ii}$ is the coefficient of $x_i^2$, and the off-diagonal entries are $a_{ij} = a_{ji} = \\frac{1}{2} c_{ij}$, where $c_{ij}$ is the coefficient of $x_i x_j$.",
        "二次型 $Q(x) = x^T A x$ 可由唯一的实对称矩阵 $A = A^T$ 表示。主对角元 $a_{ii}$ 为 $x_i^2$ 的系数，非对角元 $a_{ij} = a_{ji} = \\frac{1}{2} c_{ij}$，其中 $c_{ij}$ 为交叉项 $x_i x_j$ 的系数。",
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

        const solution = t(
          `For a symmetric matrix $A$, the diagonal entries are the squared term coefficients: $a_{11} = ${a}$ and $a_{22} = ${c}$. The off-diagonal entries split the cross-term coefficient evenly: $a_{12} = a_{21} = \\frac{${twoB}}{2} = ${b}$. Thus $A = ${mat2Latex(
            [
              [a, b],
              [b, c],
            ],
          )}$.`,
          `对于实对称矩阵 $A$，主对角元为平方项系数：$a_{11} = ${a}$，$a_{22} = ${c}$。非对角元平分交叉项系数：$a_{12} = a_{21} = \\frac{${twoB}}{2} = ${b}$。因此 $A = ${mat2Latex(
            [
              [a, b],
              [b, c],
            ],
          )}$。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "reading-coefficients-of-a-quadratic-form-from-its-matrix",
      title: t("Reading coefficients of a quadratic form from its matrix", "从矩阵读出二次型的系数"),
      explanation: t(
        "For a symmetric $3 \\times 3$ matrix $A$, the quadratic form $Q(\\mathbf{x}) = \\mathbf{x}^T A\\mathbf{x}$ expands to\n\n$$Q = a_{11}x_1^2 + a_{22}x_2^2 + a_{33}x_3^2 + 2a_{12}x_1x_2 + 2a_{13}x_1x_3 + 2a_{23}x_2x_3.$$\n\nA square term takes its diagonal entry directly, while a cross term $x_ix_j$ collects both $a_{ij}$ and $a_{ji}$, so its coefficient is $2a_{ij}$.",
        "对 $3 \\times 3$ 对称矩阵 $A$，二次型 $Q(\\mathbf{x}) = \\mathbf{x}^T A\\mathbf{x}$ 展开为\n\n$$Q = a_{11}x_1^2 + a_{22}x_2^2 + a_{33}x_3^2 + 2a_{12}x_1x_2 + 2a_{13}x_1x_3 + 2a_{23}x_2x_3。$$\n\n平方项直接取对角元，而交叉项 $x_ix_j$ 同时汇集 $a_{ij}$ 与 $a_{ji}$，所以系数为 $2a_{ij}$。",
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
          wrong: cross ? [term.e, term.e * 4, -term.v] : [2 * term.v, d[0]!, d[2]!],
          solution: cross
            ? t(
                `The cross term collects $a_{ij}$ and $a_{ji}$: its coefficient is $2${term.at} = 2 \\cdot ${term.e < 0 ? `(${term.e})` : term.e} = ${term.v}$.`,
                `交叉项汇集 $a_{ij}$ 与 $a_{ji}$：系数为 $2${term.at} = 2 \\cdot ${term.e < 0 ? `(${term.e})` : term.e} = ${term.v}$。`,
              )
            : t(`A square term takes its diagonal entry: $${term.at} = ${term.v}$.`, `平方项取对角元：$${term.at} = ${term.v}$。`),
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
  prerequisites: ["quadratic-forms"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "change-of-variables-congruence",
      title: t("Congruent Matrix Under Change of Variables", "变量替换下的合同矩阵"),
      explanation: t(
        "If a quadratic form $Q(x) = x^T A x$ undergoes an invertible change of variables $x = P y$, then $Q(P y) = y^T (P^T A P) y$. The matrix of the new quadratic form is $B = P^T A P$, which is congruent to $A$.",
        "若二次型 $Q(x) = x^T A x$ 进行可逆变量替换 $x = P y$，则 $Q(P y) = y^T (P^T A P) y$。新二次型的矩阵为 $B = P^T A P$，与 $A$ 互为合同矩阵。",
      ),
      generate: (rng: Rng): Problem => {
        const d1 = rng.nonZero(-4, 4);
        const d2 = rng.nonZero(-4, 4);
        const p11 = rng.nonZero(-2, 2);
        const p12 = rng.int(-2, 2);
        const p21 = rng.int(-2, 2);
        const p22 = rng.nonZero(-2, 2);

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
        ];

        const solution = t(
          `Calculate $B = P^T A P$:\n\n$$P^T A = ${mat2Latex([
            [p11, p21],
            [p12, p22],
          ])} ${mat2Latex(A)} = ${mat2Latex([
            [d1 * p11, d2 * p21],
            [d1 * p12, d2 * p22],
          ])}.$$\n\nMultiplying by $P$ gives $B = ${mat2Latex(B)}$.`,
          `计算 $B = P^T A P$：\n\n$$P^T A = ${mat2Latex([
            [p11, p21],
            [p12, p22],
          ])} ${mat2Latex(A)} = ${mat2Latex([
            [d1 * p11, d2 * p21],
            [d1 * p12, d2 * p22],
          ])}。$$\n\n再右乘 $P$ 得到 $B = ${mat2Latex(B)}$。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "substituting-a-shear-into-a-quadratic-form",
      title: t("Substituting a shear into a quadratic form", "将剪切变换代入二次型"),
      explanation: t(
        "A change of variables can be carried out by direct substitution as well as by $B = P^TAP$. Under $x_1 = y_1 + ky_2$, $x_2 = y_2$, the form $Q = ax_1^2 + bx_1x_2 + cx_2^2$ becomes\n\n$$a(y_1 + ky_2)^2 + b(y_1 + ky_2)y_2 + cy_2^2 = ay_1^2 + (2ak + b)y_1y_2 + (ak^2 + bk + c)y_2^2.$$\n\nChoosing $k = -\\frac{b}{2a}$ removes the cross term, which is exactly completing the square.",
        "变量替换既可以用 $B = P^TAP$，也可以直接代入。在 $x_1 = y_1 + ky_2$，$x_2 = y_2$ 下，$Q = ax_1^2 + bx_1x_2 + cx_2^2$ 变为\n\n$$a(y_1 + ky_2)^2 + b(y_1 + ky_2)y_2 + cy_2^2 = ay_1^2 + (2ak + b)y_1y_2 + (ak^2 + bk + c)y_2^2。$$\n\n取 $k = -\\frac{b}{2a}$ 可消去交叉项，这正是配方。",
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
          wrong: askCross ? [a * k + b, 2 * a * k, b, cross + 2 * a] : [a * k * k + c, a * k + b * k + c, sq - b * k, c],
          solution: t(
            `Expanding, the $y_1y_2$ coefficient is $2(${a})(${k}) + ${b < 0 ? `(${b})` : b} = ${cross}$ and the $y_2^2$ coefficient is $${a}(${k})^2 + ${b < 0 ? `(${b})` : b}(${k}) + ${c < 0 ? `(${c})` : c} = ${sq}$.`,
            `展开后，$y_1y_2$ 的系数为 $2(${a})(${k}) + ${b < 0 ? `(${b})` : b} = ${cross}$，$y_2^2$ 的系数为 $${a}(${k})^2 + ${b < 0 ? `(${b})` : b}(${k}) + ${c < 0 ? `(${c})` : c} = ${sq}$。`,
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
  prerequisites: ["change-of-variables-in-quadratic-forms"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "lagrange-completing-the-square",
      title: t("Lagrange Reduction by Completing the Square", "拉格朗日配方法"),
      explanation: t(
        "Completing the square on one variable at a time removes the cross terms, rewriting the quadratic form as a weighted sum of squares. Lagrange's method repeatedly completes the square on each variable to eliminate cross-product terms: $a x_1^2 + 2b x_1 x_2 + c x_2^2 = a\\left(x_1 + \\frac{b}{a} x_2\\right)^2 + \\left(c - \\frac{b^2}{a}\\right) x_2^2 = d_1 y_1^2 + d_2 y_2^2$.",
        "一次对一个变量配方可以消去交叉项，把二次型改写成平方的加权和。拉格朗日配方法通过逐个变量配方以消除交叉项：$a x_1^2 + 2b x_1 x_2 + c x_2^2 = a\\left(x_1 + \\frac{b}{a} x_2\\right)^2 + \\left(c - \\frac{b^2}{a}\\right) x_2^2 = d_1 y_1^2 + d_2 y_2^2$。",
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

        const solution = t(
          `Complete the square in $x_1$:\n\n$$Q(x_1, x_2) = ${formatFirstTerm(a, `(x_1 ${kTerm})^2`)} ${formatSignedTerm(-a * k * k, "x_2^2")} + (${c})x_2^2 = ${formatFirstTerm(a, "y_1^2")} ${formatSignedTerm(rem, "y_2^2")}.$$\n\nHence $(d_1, d_2) = (${a}, ${rem})$.`,
          `对 $x_1$ 配方：\n\n$$Q(x_1, x_2) = ${formatFirstTerm(a, `(x_1 ${kTerm})^2`)} ${formatSignedTerm(-a * k * k, "x_2^2")} + (${c})x_2^2 = ${formatFirstTerm(a, "y_1^2")} ${formatSignedTerm(rem, "y_2^2")}。$$\n\n故系数对为 $(d_1, d_2) = (${a}, ${rem})$。`,
        );

        return pointProblem({
          prompt,
          answer: [a, rem],
          vars: ["d_1", "d_2"],
          solution,
          wrong: [
            [a, c],
            [a, -rem],
            [rem, a],
            [a, c - a * k],
          ],
        });
      },
    },
    {
      id: "lagranges-method-with-no-square-terms",
      title: t("Lagrange's method when there are no square terms", "没有平方项时的拉格朗日配方法"),
      explanation: t(
        "Completing the square needs a square term to start from. When the form is a pure product such as $Q = kx_1x_2$, first create squares with $x_1 = y_1 + cy_2$, $x_2 = y_1 - cy_2$:\n\n$$kx_1x_2 = k(y_1 + cy_2)(y_1 - cy_2) = ky_1^2 - kc^2y_2^2.$$\n\nThe result is already canonical, with one positive and one negative coefficient.",
        "配方需要一个平方项作为起点。当二次型是纯乘积如 $Q = kx_1x_2$ 时，先用 $x_1 = y_1 + cy_2$，$x_2 = y_1 - cy_2$ 造出平方：\n\n$$kx_1x_2 = k(y_1 + cy_2)(y_1 - cy_2) = ky_1^2 - kc^2y_2^2。$$\n\n结果已是标准形，一个系数为正、一个为负。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.nonZero(-9, 9);
        const c = rng.int(1, 3);
        const askFirst = rng.int(0, 1) === 0;
        const d1 = k;
        const d2 = -k * c * c;
        const cy = c === 1 ? "y_2" : `${c}y_2`;
        return numberProblem({
          prompt: t(
            `Substitute $x_1 = y_1 + ${cy}$, $x_2 = y_1 - ${cy}$ into $Q = ${formatFirstTerm(k, "x_1x_2")}$ to get $d_1y_1^2 + d_2y_2^2$. Find $${askFirst ? "d_1" : "d_2"}$.`,
            `把 $x_1 = y_1 + ${cy}$，$x_2 = y_1 - ${cy}$ 代入 $Q = ${formatFirstTerm(k, "x_1x_2")}$，得到 $d_1y_1^2 + d_2y_2^2$。求 $${askFirst ? "d_1" : "d_2"}$。`,
          ),
          answer: askFirst ? d1 : d2,
          wrong: askFirst ? [-k, 2 * k, k * c * c] : [k * c * c, -k * c, -k],
          solution: t(
            `$(y_1 + ${cy})(y_1 - ${cy}) = y_1^2 - ${c * c === 1 ? "" : c * c}y_2^2$, so $Q = ${formatDiagonalForm(d1, d2)}$ and $${askFirst ? "d_1" : "d_2"} = ${askFirst ? d1 : d2}$.`,
            `$(y_1 + ${cy})(y_1 - ${cy}) = y_1^2 - ${c * c === 1 ? "" : c * c}y_2^2$，所以 $Q = ${formatDiagonalForm(d1, d2)}$，$${askFirst ? "d_1" : "d_2"} = ${askFirst ? d1 : d2}$。`,
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
  prerequisites: ["canonical-form-of-a-quadratic-form-using-lagranges-method"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "orthogonal-transformation-canonical-form",
      title: t("Canonical Form via Orthogonal Transformation", "正交变换下的标准形"),
      explanation: t(
        "By the Principal Axes Theorem, any quadratic form $x^T A x$ can be transformed by an orthogonal substitution $x = P y$ into $Q = \\lambda_1 y_1^2 + \\dots + \\lambda_n y_n^2$, where the coefficients $\\lambda_i$ are the eigenvalues of the symmetric matrix $A$.",
        "根据主轴定理，任意二次型 $x^T A x$ 均可通过正交变换 $x = P y$ 化为标准形 $Q = \\lambda_1 y_1^2 + \\dots + \\lambda_n y_n^2$，其中系数 $\\lambda_i$ 为实对称矩阵 $A$ 的特征值。",
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

        const solution = t(
          `The symmetric matrix of $Q$ is $A = ${mat2Latex([
            [m, k],
            [k, m],
          ])}$. Its characteristic equation is $(${m} - \\lambda)^2 - ${k}^2 = 0$, giving eigenvalues $\\lambda_1 = ${l1}$ and $\\lambda_2 = ${l2}$. Under an orthogonal transformation, the coefficients of the canonical form are the eigenvalues, yielding $${rightStr}$.`,
          `二次型 $Q$ 的实对称矩阵为 $A = ${mat2Latex([
            [m, k],
            [k, m],
          ])}$。其特征方程为 $(${m} - \\lambda)^2 - ${k}^2 = 0$，解得特征值 $\\lambda_1 = ${l1}$，$\\lambda_2 = ${l2}$。在正交变换下，标准形的系数即为特征值，故为 $${rightStr}$。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "invariants-of-the-orthogonal-canonical-form",
      title: t("Trace and determinant of the canonical form", "标准形的迹与行列式"),
      explanation: t(
        "Under an orthogonal transformation the canonical form is $\\lambda_1y_1^2 + \\lambda_2y_2^2$, where $\\lambda_1, \\lambda_2$ are the eigenvalues of the symmetric matrix $A$. Similar matrices share trace and determinant, so without finding the eigenvalues:\n\n$$\\lambda_1 + \\lambda_2 = a_{11} + a_{22}, \\qquad \\lambda_1\\lambda_2 = a_{11}a_{22} - a_{12}^2.$$\n\nFor $Q = ax_1^2 + bx_1x_2 + cx_2^2$ remember that $a_{12} = \\frac{b}{2}$.",
        "在正交变换下标准形为 $\\lambda_1y_1^2 + \\lambda_2y_2^2$，$\\lambda_1, \\lambda_2$ 是对称矩阵 $A$ 的特征值。相似矩阵有相同的迹与行列式，所以不必求特征值：\n\n$$\\lambda_1 + \\lambda_2 = a_{11} + a_{22}, \\qquad \\lambda_1\\lambda_2 = a_{11}a_{22} - a_{12}^2。$$\n\n对 $Q = ax_1^2 + bx_1x_2 + cx_2^2$，记住 $a_{12} = \\frac{b}{2}$。",
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
          solution: askSum
            ? t(
                `$\\lambda_1 + \\lambda_2 = \\operatorname{tr}A = ${a} + ${c < 0 ? `(${c})` : c} = ${ans}$.`,
                `$\\lambda_1 + \\lambda_2 = \\operatorname{tr}A = ${a} + ${c < 0 ? `(${c})` : c} = ${ans}$。`,
              )
            : t(
                `$a_{12} = ${h}$, so $\\lambda_1\\lambda_2 = \\det A = ${a} \\cdot ${c < 0 ? `(${c})` : c} - ${h < 0 ? `(${h})` : h}^2 = ${ans}$.`,
                `$a_{12} = ${h}$，所以 $\\lambda_1\\lambda_2 = \\det A = ${a} \\cdot ${c < 0 ? `(${c})` : c} - ${h < 0 ? `(${h})` : h}^2 = ${ans}$。`,
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
  prerequisites: ["canonical-form-of-a-quadratic-form-using-orthogonal-transformations"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "quadratic-forms-definiteness",
      title: t("Classifying Definiteness of Quadratic Forms", "二次型定性的判定"),
      explanation: t(
        "A quadratic form is:\n- **Positive definite** iff all eigenvalues are $> 0$ (all leading principal minors $\\Delta_k > 0$).\n- **Negative definite** iff all eigenvalues are $< 0$ ($(-1)^k \\Delta_k > 0$).\n- **Indefinite** iff it has both positive and negative eigenvalues.",
        "二次型的定性判定：\n- **正定**：当且仅当所有特征值大于 0（所有顺序主子式 $\\Delta_k > 0$）；\n- **负定**：当且仅当所有特征值小于 0（顺序主子式正负相错，即 $(-1)^k \\Delta_k > 0$）；\n- **不定**：具有异号特征值。",
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

        const reasonEn =
          kind === 0
            ? `The leading principal minors are $\\Delta_1 = ${delta1} > 0$ and $\\Delta_2 = ac - b^2 = (${a})(${c}) - ${b}^2 = ${delta2} > 0$. By Sylvester's criterion, the quadratic form is positive definite.`
            : kind === 1
              ? `The leading principal minors are $\\Delta_1 = ${delta1} < 0$ and $\\Delta_2 = ac - b^2 = (${a})(${c}) - ${b}^2 = ${delta2} > 0$. The signs alternate starting with negative, so the quadratic form is negative definite.`
              : `The determinant of the matrix is $\\Delta_2 = ac - b^2 = (${a})(${c}) - ${b}^2 = ${delta2} < 0$. The eigenvalues have opposite signs, so the quadratic form is indefinite.`;

        const reasonZh =
          kind === 0
            ? `顺序主子式分别为 $\\Delta_1 = ${delta1} > 0$ 且 $\\Delta_2 = ac - b^2 = (${a})(${c}) - ${b}^2 = ${delta2} > 0$。根据西尔维斯特准则，该二次型为正定。`
            : kind === 1
              ? `顺序主子式分别为 $\\Delta_1 = ${delta1} < 0$ 且 $\\Delta_2 = ac - b^2 = (${a})(${c}) - ${b}^2 = ${delta2} > 0$。符号正负相错且由负开始，故该二次型为负定。`
              : `行列式 $\\Delta_2 = ac - b^2 = (${a})(${c}) - ${b}^2 = ${delta2} < 0$。两特征值异号，故该二次型为不定。`;

        const solution = t(reasonEn, reasonZh);

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "sylvesters-criterion-for-three-variables",
      title: t("Sylvester's criterion in three variables", "三元二次型的西尔维斯特判据"),
      explanation: t(
        "Sylvester's criterion classifies a symmetric matrix by its leading principal minors $D_1 = a_{11}$, $D_2 = \\det$ of the top-left $2 \\times 2$ block, and $D_3 = \\det A$. The form is positive definite exactly when $D_1, D_2, D_3 > 0$, and negative definite exactly when the signs alternate $D_1 < 0$, $D_2 > 0$, $D_3 < 0$. If $D_3 \\ne 0$ and neither pattern holds, the form is indefinite.",
        "西尔维斯特判据用顺序主子式 $D_1 = a_{11}$、左上 $2 \\times 2$ 块的行列式 $D_2$ 与 $D_3 = \\det A$ 来分类对称矩阵。二次型正定当且仅当 $D_1, D_2, D_3 > 0$；负定当且仅当符号交替 $D_1 < 0$，$D_2 > 0$，$D_3 < 0$。若 $D_3 \\ne 0$ 且两种模式都不满足，则二次型不定。",
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
        return oneOf(
          rng,
          t(
            `Classify the quadratic form $\\mathbf{x}^T A\\mathbf{x}$ with $A = ${mat3Latex(A as unknown as Mat3)}$.`,
            `判定二次型 $\\mathbf{x}^T A\\mathbf{x}$ 的类型，$A = ${mat3Latex(A as unknown as Mat3)}$。`,
          ),
          right,
          [P, N, I, S].filter((o) => o !== right),
          t(
            `The leading principal minors are $D_1 = ${D[0]}$, $D_2 = ${D[1]}$, $D_3 = ${D[2]}$, so the form is ${pd ? "positive definite" : nd ? "negative definite" : "indefinite"}.`,
            `顺序主子式为 $D_1 = ${D[0]}$，$D_2 = ${D[1]}$，$D_3 = ${D[2]}$，所以二次型${pd ? "正定" : nd ? "负定" : "不定"}。`,
          ),
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
  prerequisites: ["positive-definite-and-negative-definite-quadratic-forms"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "principal-axes-reduction",
      title: t("Principal Axes Equation of a Conic", "二次曲线的主轴方程"),
      explanation: t(
        "For a quadratic curve $a x_1^2 + 2b x_1 x_2 + c x_2^2 = d$, rotating coordinates via an orthogonal matrix $P$ to the principal axes eliminates the cross term, yielding $\\lambda_1 y_1^2 + \\lambda_2 y_2^2 = d$, where $\\lambda_1, \\lambda_2$ are the eigenvalues of $\\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}$.",
        "对于二次曲线 $a x_1^2 + 2b x_1 x_2 + c x_2^2 = d$，通过正交矩阵 $P$ 旋转至主轴坐标系可消除交叉项，化为主轴方程 $\\lambda_1 y_1^2 + \\lambda_2 y_2^2 = d$，其中 $\\lambda_1, \\lambda_2$ 为矩阵 $\\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}$ 的特征值。",
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

        const solution = t(
          `The matrix of the quadratic part is $A = ${mat2Latex([
            [m, k],
            [k, m],
          ])}$. Its eigenvalues are the roots of $(${m} - \\lambda)^2 - ${k}^2 = 0$, giving $\\lambda_1 = ${l1}$ and $\\lambda_2 = ${l2}$. In the principal axes coordinate system $(y_1, y_2)$, the equation is $${rightStr}$.`,
          `二次项矩阵为 $A = ${mat2Latex([
            [m, k],
            [k, m],
          ])}$。特征方程为 $(${m} - \\lambda)^2 - ${k}^2 = 0$，解得特征值 $\\lambda_1 = ${l1}$，$\\lambda_2 = ${l2}$。在主轴坐标系 $(y_1, y_2)$ 下，方程为 $${rightStr}$。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "semi-axes-of-an-ellipse-from-its-principal-axes",
      title: t("Semi-axes of an ellipse from its principal axes", "由主轴形式求椭圆的半轴"),
      explanation: t(
        "Rotating to principal axes turns $ax^2 + 2hxy + cy^2 = d$ into $\\lambda_1y_1^2 + \\lambda_2y_2^2 = d$, where $\\lambda_1, \\lambda_2$ are the eigenvalues of $\\begin{pmatrix} a & h \\\\ h & c \\end{pmatrix}$. When both eigenvalues and $d$ are positive, this is an ellipse with semi-axes $\\sqrt{d/\\lambda_1}$ and $\\sqrt{d/\\lambda_2}$. The smaller eigenvalue gives the longer, major semi-axis.",
        "旋转到主轴把 $ax^2 + 2hxy + cy^2 = d$ 化为 $\\lambda_1y_1^2 + \\lambda_2y_2^2 = d$，其中 $\\lambda_1, \\lambda_2$ 是 $\\begin{pmatrix} a & h \\\\ h & c \\end{pmatrix}$ 的特征值。当两个特征值与 $d$ 都为正时，这是半轴为 $\\sqrt{d/\\lambda_1}$ 与 $\\sqrt{d/\\lambda_2}$ 的椭圆。较小的特征值给出较长的半长轴。",
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
          solution: t(
            `In principal axes the curve is $${formatDiagonalForm(l1, l2)} = ${d}$. The semi-axes are $\\sqrt{${d}/${l1}} = ${Math.sqrt(d / l1)}$ and $\\sqrt{${d}/${l2}} = ${Math.sqrt(d / l2)}$, so the major semi-axis is $${major}$.`,
            `在主轴下曲线为 $${formatDiagonalForm(l1, l2)} = ${d}$。半轴为 $\\sqrt{${d}/${l1}} = ${Math.sqrt(d / l1)}$ 与 $\\sqrt{${d}/${l2}} = ${Math.sqrt(d / l2)}$，所以半长轴为 $${major}$。`,
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
  prerequisites: ["reducing-a-quadratic-curve-to-its-principal-axes"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "quadratic-curve-classification",
      title: t("Classification of Conics by the Discriminant", "利用判别式对二次曲线分类"),
      explanation: t(
        "For a quadratic curve $a x^2 + 2b xy + c y^2 + d x + e y = f$, let $A = \\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}$. The nature of the conic is determined by $\\det(A) = ac - b^2$:\n- $\\det(A) > 0$ (eigenvalues same sign): **Ellipse** (or circle/empty set/point);\n- $\\det(A) < 0$ (eigenvalues opposite signs): **Hyperbola**;\n- $\\det(A) = 0$ (one zero eigenvalue): **Parabola**.",
        "对于二次曲线 $a x^2 + 2b xy + c y^2 + d x + e y = f$，设 $A = \\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}$。由 $\\det(A) = ac - b^2$ 判定曲线类型：\n- $\\det(A) > 0$（特征值同号）：**椭圆**；\n- $\\det(A) < 0$（特征值异号）：**双曲线**；\n- $\\det(A) = 0$（存在零特征值）：**抛物线**。",
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
        const lhsStr = formatQuadratic(a, twoB, c, "x", "y");

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

        const solEn =
          type === 0
            ? `The matrix of quadratic terms is $A = ${mat2Latex([
                [a, b],
                [b, c],
              ])}$. Its determinant is $\\det(A) = ac - b^2 = (${a})(${c}) - ${b}^2 = ${detA} > 0$. Since $a > 0$ and $\\det(A) > 0$, both eigenvalues are positive, so the curve is an ellipse.`
            : type === 1
              ? `The matrix of quadratic terms is $A = ${mat2Latex([
                  [a, b],
                  [b, c],
                ])}$. Its determinant is $\\det(A) = ac - b^2 = (${a})(${c}) - ${b}^2 = ${detA} < 0$. The eigenvalues have opposite signs, so the curve is a hyperbola.`
              : `The matrix of quadratic terms is $A = ${mat2Latex([
                  [a, b],
                  [b, c],
                ])}$. Its determinant is $\\det(A) = ac - b^2 = (${a})(${c}) - ${b}^2 = ${detA} = 0$. Exactly one eigenvalue is zero, so the curve is a parabola.`;

        const solZh =
          type === 0
            ? `二次项矩阵为 $A = ${mat2Latex([
                [a, b],
                [b, c],
              ])}$。其行列式为 $\\det(A) = ac - b^2 = (${a})(${c}) - ${b}^2 = ${detA} > 0$。两特征值同号且为正，故该曲线为椭圆。`
            : type === 1
              ? `二次项矩阵为 $A = ${mat2Latex([
                  [a, b],
                  [b, c],
                ])}$。其行列式为 $\\det(A) = ac - b^2 = (${a})(${c}) - ${b}^2 = ${detA} < 0$。两特征值异号，故该曲线为双曲线。`
              : `二次项矩阵为 $A = ${mat2Latex([
                  [a, b],
                  [b, c],
                ])}$。其行列式为 $\\det(A) = ac - b^2 = (${a})(${c}) - ${b}^2 = ${detA} = 0$。恰有一个特征值为 0，故该曲线为抛物线。`;

        const solution = t(solEn, solZh);

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "classifying-a-conic-by-its-discriminant",
      title: t("Classifying a conic by its discriminant", "用判别式分类二次曲线"),
      explanation: t(
        "For a non-degenerate curve $ax^2 + bxy + cy^2 + dx + ey + f = 0$, only the quadratic part decides the type. Its matrix $\\begin{pmatrix} a & b/2 \\\\ b/2 & c \\end{pmatrix}$ has determinant $ac - \\frac{b^2}{4}$, so the sign of $b^2 - 4ac$ tells whether the eigenvalues have the same sign:\n- $b^2 - 4ac < 0$: an ellipse,\n- $b^2 - 4ac > 0$: a hyperbola,\n- $b^2 - 4ac = 0$: a parabola.\n\nThe linear terms only shift the curve.",
        "对非退化曲线 $ax^2 + bxy + cy^2 + dx + ey + f = 0$，只有二次部分决定类型。其矩阵 $\\begin{pmatrix} a & b/2 \\\\ b/2 & c \\end{pmatrix}$ 的行列式为 $ac - \\frac{b^2}{4}$，所以 $b^2 - 4ac$ 的符号说明特征值是否同号：\n- $b^2 - 4ac < 0$：椭圆，\n- $b^2 - 4ac > 0$：双曲线，\n- $b^2 - 4ac = 0$：抛物线。\n\n一次项只是平移曲线。",
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
        return oneOf(
          rng,
          t(
            `Assuming it is non-degenerate, what kind of curve is $${lhs} = ${rhs}$?`,
            `假设曲线非退化，$${lhs} = ${rhs}$ 是哪种曲线？`,
          ),
          right,
          [E, H, Pa].filter((o) => o !== right),
          t(
            `$b^2 - 4ac = ${b * b} - ${4 * a * c} = ${disc}$, which is ${disc < 0 ? "negative, so it is an ellipse" : disc > 0 ? "positive, so it is a hyperbola" : "zero, so it is a parabola"}.`,
            `$b^2 - 4ac = ${b * b} - ${4 * a * c} = ${disc}$，${disc < 0 ? "为负，所以是椭圆" : disc > 0 ? "为正，所以是双曲线" : "为零，所以是抛物线"}。`,
          ),
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
  prerequisites: ["classifying-quadratic-curves"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "constrained-extrema-unit-sphere",
      title: t("Maximum and Minimum on the Unit Sphere", "单位球面上的最大值与最小值"),
      explanation: t(
        "By the Rayleigh quotient theorem, for any real symmetric matrix $A$, the maximum value of $x^T A x$ subject to $\\|x\\| = 1$ is $\\lambda_{\\max}(A)$, and the minimum value is $\\lambda_{\\min}(A)$.",
        "根据瑞利商定理，对于实对称矩阵 $A$，在 $\\|x\\| = 1$ 的约束下，$x^T A x$ 的最大值为最大特征值 $\\lambda_{\\max}(A)$，最小值为最小特征值 $\\lambda_{\\min}(A)$。",
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
          solution: t(
            `The symmetric matrix is $A = ${mat2Latex([
              [m, k],
              [k, m],
            ])}$. Its eigenvalues are $\\lambda_1 = ${lMin}$ and $\\lambda_2 = ${lMax}$. The ${extremaWordEn} value subject to $\\|x\\| = 1$ is $\\lambda = ${targetValue}$.`,
            `对称矩阵为 $A = ${mat2Latex([
              [m, k],
              [k, m],
            ])}$。其特征值为 $\\lambda_1 = ${lMin}$ 和 $\\lambda_2 = ${lMax}$。在 $\\|x\\| = 1$ 约束下的${extremaWordZh}为 $\\lambda = ${targetValue}$。`,
          ),
          wrong: [findMax ? lMin : lMax, m, 2 * k],
        });
      },
    },
    {
      id: "extrema-of-a-quadratic-form-on-a-circle-of-radius-r",
      title: t("Extrema of a quadratic form on a circle of radius $r$", "二次型在半径为 $r$ 的圆上的最值"),
      explanation: t(
        "On the unit circle the maximum and minimum of $Q(\\mathbf{x}) = \\mathbf{x}^T A\\mathbf{x}$ are the largest and smallest eigenvalues of $A$. A quadratic form is homogeneous of degree 2, so $Q(r\\mathbf{u}) = r^2Q(\\mathbf{u})$. On the circle $\\|\\mathbf{x}\\| = r$ the extremes are therefore $r^2\\lambda_{\\max}$ and $r^2\\lambda_{\\min}$.",
        "在单位圆上，$Q(\\mathbf{x}) = \\mathbf{x}^T A\\mathbf{x}$ 的最大值与最小值是 $A$ 的最大与最小特征值。二次型是 2 次齐次的，所以 $Q(r\\mathbf{u}) = r^2Q(\\mathbf{u})$。因此在圆 $\\|\\mathbf{x}\\| = r$ 上，最值为 $r^2\\lambda_{\\max}$ 与 $r^2\\lambda_{\\min}$。",
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
          solution: t(
            `The matrix $${mat2Latex(A)}$ has eigenvalues $${l1}$ and $${l2}$. On the unit circle the ${findMax ? "maximum" : "minimum"} is $${lam}$, and scaling to radius $${r}$ multiplies it by $${r * r}$: $${ans}$.`,
            `矩阵 $${mat2Latex(A)}$ 的特征值为 $${l1}$ 与 $${l2}$。在单位圆上${findMax ? "最大值" : "最小值"}为 $${lam}$，缩放到半径 $${r}$ 乘以 $${r * r}$：$${ans}$。`,
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
  prerequisites: ["constrained-optimization-of-quadratic-forms"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "where-extrema-are-attained",
      title: t("Unit Vectors for Constrained Extrema", "取条件极值的单位向量"),
      explanation: t(
        "On the unit sphere the quadratic form is largest in the direction of the eigenvector for the largest eigenvalue and smallest for the smallest one. The maximum (minimum) of $x^T A x$ subject to $\\|x\\| = 1$ is attained at normalized eigenvectors corresponding to $\\lambda_{\\max}$ (respectively $\\lambda_{\\min}$).",
        "在单位球面上，二次型在最大特征值对应的特征向量方向上最大，在最小特征值对应的方向上最小。二次型 $x^T A x$ 在 $\\|x\\| = 1$ 约束下的最大值（或最小值）在对应于最大特征值 $\\lambda_{\\max}$（或最小特征值 $\\lambda_{\\min}$）的单位特征向量处取得。",
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

        const solution = t(
          `The symmetric matrix is $A = ${mat2Latex([
            [m, k],
            [k, m],
          ])}$. Its eigenvalues are $\\lambda_1 = ${m - k}$ (eigenvector $\\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix}$) and $\\lambda_2 = ${m + k}$ (eigenvector $\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$). The ${findMax ? "maximum" : "minimum"} corresponds to $\\lambda = ${findMax ? m + k : m - k}$, which is attained at the unit eigenvector $\\frac{1}{\\sqrt{2}} ${vec2Latex(rightVec)}$.`,
          `对称矩阵为 $A = ${mat2Latex([
            [m, k],
            [k, m],
          ])}$。其特征值为 $\\lambda_1 = ${m - k}$（对应特征向量 $\\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix}$）与 $\\lambda_2 = ${m + k}$（对应特征向量 $\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$）。${findMax ? "最大值" : "最小值"}对应特征值 $\\lambda = ${findMax ? m + k : m - k}$，在单位特征向量 $\\frac{1}{\\sqrt{2}} ${vec2Latex(rightVec)}$ 处取得。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "where-a-diagonal-form-in-three-variables-is-extreme",
      title: t("Where a diagonal form in three variables is extreme", "三元对角二次型在何处取最值"),
      explanation: t(
        "For a diagonal form $Q = d_1x_1^2 + d_2x_2^2 + d_3x_3^2$ on the unit sphere, $Q$ is a weighted average of the $d_i$ with weights $x_i^2$ that sum to $1$. It is largest when all the weight sits on the largest coefficient, that is, at $\\pm\\mathbf{e}_i$ for that $i$, and smallest at $\\pm\\mathbf{e}_j$ for the smallest coefficient. Any vector that spreads the weight gives a value in between.",
        "对单位球面上的对角二次型 $Q = d_1x_1^2 + d_2x_2^2 + d_3x_3^2$，$Q$ 是各 $d_i$ 以 $x_i^2$ 为权（和为 $1$）的加权平均。当全部权重落在最大系数上，即在该 $i$ 的 $\\pm\\mathbf{e}_i$ 处，$Q$ 最大；在最小系数的 $\\pm\\mathbf{e}_j$ 处最小。任何分散权重的向量给出介于其间的值。",
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
        return oneOf(
          rng,
          t(
            `On the unit sphere, where does $Q = ${q}$ attain its ${findMax ? "maximum" : "minimum"}?`,
            `在单位球面上，$Q = ${q}$ 在何处取得${findMax ? "最大值" : "最小值"}？`,
          ),
          opt(`\\pm${e(target)}`),
          [...others.map((o) => t(`$\\pm${o.en.slice(1)}`, `$\\pm${o["zh-CN"].slice(1)}`)), opt("\\frac{1}{\\sqrt{3}}(1, 1, 1)")],
          t(
            `The ${findMax ? "largest" : "smallest"} coefficient is $${d[target]}$, on $x_{${target + 1}}^2$, so the ${findMax ? "maximum" : "minimum"} $${d[target]}$ is attained at $\\pm${e(target)}$.`,
            `${findMax ? "最大" : "最小"}系数为 $x_{${target + 1}}^2$ 的 $${d[target]}$，所以${findMax ? "最大值" : "最小值"} $${d[target]}$ 在 $\\pm${e(target)}$ 处取得。`,
          ),
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
  prerequisites: ["constrained-optimization-of-quadratic-forms-determining-where-extrema-are-attained"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "singular-values-definition-properties",
      title: t("Definition and Properties of Singular Values", "奇异值的定义与性质"),
      explanation: t(
        "For any $m \\times n$ real matrix $A$, the singular values $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge \\sigma_n \\ge 0$ are the square roots of the eigenvalues of the positive semidefinite matrix $A^T A$: $\\sigma_i = \\sqrt{\\lambda_i(A^T A)}$. The number of non-zero singular values equals the rank of $A$.",
        "对于任意 $m \\times n$ 实矩阵 $A$，其奇异值 $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge \\sigma_n \\ge 0$ 定义为半正定矩阵 $A^T A$ 的特征值的算术平方根：$\\sigma_i = \\sqrt{\\lambda_i(A^T A)}$。非零奇异值的个数等于矩阵 $A$ 的秩。",
      ),
      generate: (rng: Rng): Problem => {
        const m = rng.int(3, 9);
        const n = rng.int(3, 9);
        const rank = rng.int(1, Math.min(m, n));

        const prompt = t(
          `Let $A$ be ${article(m)} $${m} \\times ${n}$ real matrix with $\\operatorname{rank}(A) = ${rank}$. How many strictly positive singular values does $A$ have?`,
          `设 $A$ 为秩为 $${rank}$ 的 $${m} \\times ${n}$ 实矩阵。矩阵 $A$ 恰有多少个严格大于零的奇异值？`,
        );

        return numberProblem({
          prompt,
          answer: rank,
          solution: t(
            `The number of strictly positive (non-zero) singular values of any matrix $A$ is precisely equal to its rank, $\\operatorname{rank}(A)$. Therefore, $A$ has ${rank} positive singular values.`,
            `任意矩阵 $A$ 的严格大于零（非零）的奇异值个数恰好等于其矩阵的秩 $\\operatorname{rank}(A)$。因此，$A$ 拥有 $${rank}$ 个正奇异值。`,
          ),
          wrong: [m, n, Math.min(m, n), Math.max(0, rank - 1)],
        });
      },
    },
    {
      id: "singular-values-from-the-eigenvalues-of-ata",
      title: t("Singular values from the eigenvalues of $A^TA$", "由 $A^TA$ 的特征值求奇异值"),
      explanation: t(
        "The singular values of $A$ are the square roots of the eigenvalues of $A^TA$, listed as $\\sigma_1 \\ge \\sigma_2 \\ge \\cdots \\ge 0$. They connect to familiar quantities: $\\sigma_1 = \\max_{\\|\\mathbf{x}\\| = 1}\\|A\\mathbf{x}\\|$, and for a square matrix $\\sigma_1\\sigma_2\\cdots\\sigma_n = |\\det A|$, because $\\det(A^TA) = (\\det A)^2$.",
        "$A$ 的奇异值是 $A^TA$ 特征值的平方根，按 $\\sigma_1 \\ge \\sigma_2 \\ge \\cdots \\ge 0$ 排列。它们与熟悉的量相联系：$\\sigma_1 = \\max_{\\|\\mathbf{x}\\| = 1}\\|A\\mathbf{x}\\|$；对方阵有 $\\sigma_1\\sigma_2\\cdots\\sigma_n = |\\det A|$，因为 $\\det(A^TA) = (\\det A)^2$。",
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
            solution: t(
              `The largest singular value is $\\sigma_1 = \\sqrt{${e1}} = ${s1}$, and that is the maximum stretch $\\|A\\mathbf{x}\\|$.`,
              `最大奇异值为 $\\sigma_1 = \\sqrt{${e1}} = ${s1}$，这就是最大伸缩 $\\|A\\mathbf{x}\\|$。`,
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
            wrong: [e1 * e2, s1 + s2, e1 + e2, s1 * s1 - s2 * s2],
            solution: t(
              `The singular values are $${s1}$ and $${s2}$, and $|\\det A| = \\sigma_1\\sigma_2 = ${s1 * s2}$.`,
              `奇异值为 $${s1}$ 与 $${s2}$，$|\\det A| = \\sigma_1\\sigma_2 = ${s1 * s2}$。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A $2 \\times 2$ matrix $A$ has singular values $${s1}$ and $${s2}$. Find $\\det(A^TA)$.`,
            `$2 \\times 2$ 矩阵 $A$ 的奇异值为 $${s1}$ 与 $${s2}$。求 $\\det(A^TA)$。`,
          ),
          answer: e1 * e2,
          wrong: [s1 * s2, e1 + e2, 2 * s1 * s2],
          solution: t(
            `$A^TA$ has eigenvalues $\\sigma_1^2 = ${e1}$ and $\\sigma_2^2 = ${e2}$, so its determinant is $${e1 * e2}$.`,
            `$A^TA$ 的特征值为 $\\sigma_1^2 = ${e1}$ 与 $\\sigma_2^2 = ${e2}$，所以其行列式为 $${e1 * e2}$。`,
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
  prerequisites: ["singular-values-of-a-matrix"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "compute-singular-values",
      title: t("Computing Singular Values from A^T A", "由 A^T A 计算奇异值"),
      explanation: t(
        "To find the singular values of $A$, compute the $n \\times n$ symmetric matrix $A^T A$, find its eigenvalues $\\lambda_1 \\ge \\lambda_2 \\ge \\dots \\ge 0$, and take the positive square roots $\\sigma_i = \\sqrt{\\lambda_i}$.",
        "计算 $A$ 的奇异值时，先求 $n \\times n$ 对称矩阵 $A^T A$，求其降序特征值 $\\lambda_1 \\ge \\lambda_2 \\ge \\dots \\ge 0$，再取平方根 $\\sigma_i = \\sqrt{\\lambda_i}$。",
      ),
      generate: (rng: Rng): Problem => {
        const c = rng.int(2, 12);
        const d = rng.int(1, c - 1);
        const flip = rng.bool();
        const a11 = flip ? d : c;
        const a22 = flip ? c : d;

        const prompt = t(
          `Compute all singular values of the matrix\n\n$$A = ${mat2Latex([
            [a11, 0],
            [0, a22],
          ])}.$$\n\nEnter the singular values separated by commas.`,
          `计算矩阵 $A = ${mat2Latex([
            [a11, 0],
            [0, a22],
          ])}$ 的所有奇异值。多个奇异值用逗号隔开。`,
        );

        const solution = t(
          `Compute $A^T A = ${mat2Latex([
            [a11 * a11, 0],
            [0, a22 * a22],
          ])}$. The eigenvalues of $A^T A$ are $${c * c}$ and $${d * d}$. Taking the positive square roots gives the singular values $\\sigma_1 = \\sqrt{${c * c}} = ${c}$ and $\\sigma_2 = \\sqrt{${d * d}} = ${d}$.`,
          `计算 $A^T A = ${mat2Latex([
            [a11 * a11, 0],
            [0, a22 * a22],
          ])}$。$A^T A$ 的特征值为 $${c * c}$ 和 $${d * d}$。取算术平方根得到奇异值为 $\\sigma_1 = \\sqrt{${c * c}} = ${c}$ 与 $\\sigma_2 = \\sqrt{${d * d}} = ${d}$。`,
        );

        return solutionsProblem({
          prompt,
          values: [String(c), String(d)],
          solution,
          wrong: [[String(c * c), String(d * d)], [String(c), String(c + d)], [String(d)], [String(c)]],
        });
      },
    },
    {
      id: "singular-values-of-a-scaled-rotation-and-a-rank-one-matrix",
      title: t("Singular values through $A^TA$", "通过 $A^TA$ 计算奇异值"),
      explanation: t(
        "To compute singular values, form $A^TA$, find its eigenvalues and take square roots. For $A = \\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$, $A^TA = (a^2 + b^2)I$, so both singular values equal $\\sqrt{a^2 + b^2}$: the matrix rotates and scales uniformly. For a matrix whose second row is zero, $A^TA = \\mathbf{r}\\mathbf{r}^T$ for the first row $\\mathbf{r}$, which has eigenvalues $\\|\\mathbf{r}\\|^2$ and $0$.",
        "计算奇异值时，构造 $A^TA$，求其特征值再开平方。对 $A = \\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$，$A^TA = (a^2 + b^2)I$，所以两个奇异值都等于 $\\sqrt{a^2 + b^2}$：矩阵作旋转并均匀缩放。对第二行为零的矩阵，$A^TA = \\mathbf{r}\\mathbf{r}^T$（$\\mathbf{r}$ 为第一行），特征值为 $\\|\\mathbf{r}\\|^2$ 与 $0$。",
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
          solution: rot
            ? t(
                `$A^TA = ${c * c}I$, so both eigenvalues are $${c * c}$ and both singular values are $${c}$; the smallest is $${c}$.`,
                `$A^TA = ${c * c}I$，两个特征值都是 $${c * c}$，两个奇异值都是 $${c}$；最小的为 $${c}$。`,
              )
            : t(
                `$A^TA$ has eigenvalues $${p * p} + ${q * q} = ${c * c}$ and $0$, so the singular values are $${c}$ and $0$; the largest is $${c}$.`,
                `$A^TA$ 的特征值为 $${p * p} + ${q * q} = ${c * c}$ 与 $0$，所以奇异值为 $${c}$ 与 $0$；最大的为 $${c}$。`,
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
  prerequisites: ["computing-the-singular-values-of-a-matrix"],
  encompasses: [],
  xp: 16,
  knowledgePoints: [
    {
      id: "svd-2x2-full-rank",
      title: t("SVD of a 2x2 Matrix", "2x2 矩阵的 SVD 分解"),
      explanation: t(
        "For an $m \\times n$ matrix $A$, the SVD is $A = U \\Sigma V^T$, where $U$ and $V$ are orthogonal matrices and $\\Sigma$ is diagonal containing singular values $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge 0$. The columns of $V$ are orthonormal eigenvectors of $A^T A$, and $u_i = \\frac{1}{\\sigma_i} A v_i$.",
        "矩阵 $A$ 的奇异值分解为 $A = U \\Sigma V^T$，其中 $U$ 与 $V$ 为正交矩阵，$\\Sigma$ 对角线上为降序奇异值 $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge 0$。$V$ 的各列为 $A^T A$ 的标准正交特征向量，且 $u_i = \\frac{1}{\\sigma_i} A v_i$。",
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

        const solution = t(
          `In the singular value decomposition $A = U \\Sigma V^T$, the matrix $\\Sigma$ is a diagonal matrix containing the singular values in descending order along its main diagonal: $\\Sigma = ${mat2Latex(
            [
              [s1, 0],
              [0, s2],
            ],
          )}$.`,
          `在奇异值分解 $A = U \\Sigma V^T$ 中，$\\Sigma$ 是对角线上按降序排列奇异值的对角矩阵：$\\Sigma = ${mat2Latex([
            [s1, 0],
            [0, s2],
          ])}$。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "frobenius-norm-and-determinant-from-singular-values",
      title: t("Matrix quantities from the singular values", "由奇异值求矩阵的量"),
      explanation: t(
        "In $A = U\\Sigma V^T$ the factors $U$ and $V$ are orthogonal, so they preserve lengths and change neither $\\operatorname{tr}(A^TA)$ nor $|\\det A|$. Since $A^TA = V\\Sigma^2V^T$:\n\n$$\\|A\\|_F^2 = \\sum_{i,j} a_{ij}^2 = \\operatorname{tr}(A^TA) = \\sigma_1^2 + \\sigma_2^2, \\qquad |\\det A| = \\sigma_1\\sigma_2.$$\n\nSo the sum of squares of all entries can be read off from the singular values, and vice versa.",
        "在 $A = U\\Sigma V^T$ 中，$U$ 与 $V$ 正交，保持长度，不改变 $\\operatorname{tr}(A^TA)$ 与 $|\\det A|$。由于 $A^TA = V\\Sigma^2V^T$：\n\n$$\\|A\\|_F^2 = \\sum_{i,j} a_{ij}^2 = \\operatorname{tr}(A^TA) = \\sigma_1^2 + \\sigma_2^2, \\qquad |\\det A| = \\sigma_1\\sigma_2。$$\n\n所以全部元素的平方和可以由奇异值读出，反之亦然。",
      ),
      generate(rng: Rng): Problem {
        const A: Mat2 = [
          [rng.int(-5, 5), rng.int(-5, 5)],
          [rng.int(-5, 5), rng.nonZero(-5, 5)],
        ];
        const fro = A[0][0] ** 2 + A[0][1] ** 2 + A[1][0] ** 2 + A[1][1] ** 2;
        const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
        const askSum = rng.int(0, 1) === 0;
        return numberProblem({
          prompt: t(
            `$A = ${mat2Latex(A)}$ has singular values $\\sigma_1 \\ge \\sigma_2$. Find $${askSum ? "\\sigma_1^2 + \\sigma_2^2" : "\\sigma_1\\sigma_2"}$ without computing the SVD.`,
            `$A = ${mat2Latex(A)}$ 的奇异值为 $\\sigma_1 \\ge \\sigma_2$。不计算奇异值分解，求 $${askSum ? "\\sigma_1^2 + \\sigma_2^2" : "\\sigma_1\\sigma_2"}$。`,
          ),
          answer: askSum ? fro : Math.abs(det),
          wrong: askSum ? [A[0][0] + A[1][1], det * det, fro - 2 * det] : [det * det, fro, A[0][0] * A[1][1] + A[0][1] * A[1][0]],
          solution: askSum
            ? t(
                `$\\sigma_1^2 + \\sigma_2^2 = \\|A\\|_F^2$, the sum of the squares of the entries: $${fro}$.`,
                `$\\sigma_1^2 + \\sigma_2^2 = \\|A\\|_F^2$，即各元素平方和：$${fro}$。`,
              )
            : t(
                `$\\sigma_1\\sigma_2 = |\\det A| = |${det}| = ${Math.abs(det)}$.`,
                `$\\sigma_1\\sigma_2 = |\\det A| = |${det}| = ${Math.abs(det)}$。`,
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
  prerequisites: ["singular-value-decomposition-of-2x2-matrices"],
  encompasses: [],
  xp: 16,
  knowledgePoints: [
    {
      id: "svd-2x2-rank-one",
      title: t("SVD of a Rank-One 2x2 Matrix", "秩为 1 的 2x2 矩阵的 SVD"),
      explanation: t(
        "When $\\operatorname{rank}(A) = 1$, the second singular value is $\\sigma_2 = 0$. In this case, $u_1 = \\frac{1}{\\sigma_1} A v_1$, and $u_2$ is chosen as any unit vector orthogonal to $u_1$ to complete the orthonormal basis for $\\mathbb{R}^2$.",
        "当 $\\operatorname{rank}(A) = 1$ 时，第二个奇异值为 $\\sigma_2 = 0$。此时 $u_1 = \\frac{1}{\\sigma_1} A v_1$，而 $u_2$ 选取与 $u_1$ 正交的任意单位向量以补齐 $\\mathbb{R}^2$ 的标准正交基。",
      ),
      generate: (rng: Rng): Problem => {
        const u1 = rng.nonZero(-5, 5);
        const u2 = rng.nonZero(-5, 5);
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

        const solution = t(
          `The matrix $U$ must be an orthogonal matrix, so its columns must be orthonormal. Since $u_1 = \\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([u1, u2])}$, the column $u_2$ must be a unit vector orthogonal to $u_1$. The dot product of $u_1$ with $\\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([-u2, u1])}$ is $\\frac{1}{${hypSq}} [(${u1})(${-u2}) + (${u2})(${u1})] = 0$, making it a valid choice.`,
          `矩阵 $U$ 必须为正交矩阵，其各列须标准正交。因为 $u_1 = \\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([u1, u2])}$，所以 $u_2$ 必须是与 $u_1$ 正交的单位向量。计算其与 $\\frac{1}{\\sqrt{${hypSq}}} ${vec2Latex([-u2, u1])}$ 的点积为 $\\frac{1}{${hypSq}} [(${u1})(${-u2}) + (${u2})(${u1})] = 0$，故这是一个有效选择。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-nonzero-singular-value-of-a-rank-one-matrix",
      title: t("The nonzero singular value of a rank-one matrix", "秩一矩阵的非零奇异值"),
      explanation: t(
        "A rank-one matrix is an outer product $A = \\mathbf{u}\\mathbf{v}^T$. Then $A^TA = \\|\\mathbf{u}\\|^2\\mathbf{v}\\mathbf{v}^T$, whose only nonzero eigenvalue is $\\|\\mathbf{u}\\|^2\\|\\mathbf{v}\\|^2$. So the singular values are\n\n$$\\sigma_1 = \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|, \\qquad \\sigma_2 = 0,$$\n\nwith $\\frac{\\mathbf{u}}{\\|\\mathbf{u}\\|}$ and $\\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$ as the first left and right singular vectors.",
        "秩一矩阵是外积 $A = \\mathbf{u}\\mathbf{v}^T$。于是 $A^TA = \\|\\mathbf{u}\\|^2\\mathbf{v}\\mathbf{v}^T$，唯一的非零特征值为 $\\|\\mathbf{u}\\|^2\\|\\mathbf{v}\\|^2$。所以奇异值为\n\n$$\\sigma_1 = \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|, \\qquad \\sigma_2 = 0,$$\n\n$\\frac{\\mathbf{u}}{\\|\\mathbf{u}\\|}$ 与 $\\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$ 为第一个左、右奇异向量。",
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
          wrong: [ans * ans, r + c, Math.abs(A[0][0]) + Math.abs(A[1][1]), c],
          solution: t(
            `$A = ${vec2Latex([p, q])}\\begin{pmatrix} ${a} & ${s * b} \\end{pmatrix}$, so $\\sigma_1 = ${r} \\cdot ${c} = ${ans}$ and $\\sigma_2 = 0$.`,
            `$A = ${vec2Latex([p, q])}\\begin{pmatrix} ${a} & ${s * b} \\end{pmatrix}$，所以 $\\sigma_1 = ${r} \\cdot ${c} = ${ans}$，$\\sigma_2 = 0$。`,
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
  prerequisites: ["singular-value-decomposition-of-2x2-matrices-with-zero-or-repeated-eigenvalues"],
  encompasses: [],
  xp: 16,
  knowledgePoints: [
    {
      id: "svd-outer-product-expansion",
      title: t("Outer Product Expansion of SVD", "SVD 的外积展开式"),
      explanation: t(
        "Any matrix $A$ of rank $r$ can be written as the sum of $r$ rank-one matrices: $A = \\sum_{i=1}^r \\sigma_i u_i v_i^T$. By the Eckart-Young-Mirsky theorem, the best rank-$k$ approximation to $A$ in both Frobenius and spectral norms is $A_k = \\sum_{i=1}^k \\sigma_i u_i v_i^T$.",
        "任意秩为 $r$ 的矩阵 $A$ 均可展开为 $r$ 个秩 1 矩阵之和：$A = \\sum_{i=1}^r \\sigma_i u_i v_i^T$。根据 Eckart-Young-Mirsky 定理，在 Frobenius 范数和谱范数下，$A$ 的最佳秩 $k$ 逼近为截断和 $A_k = \\sum_{i=1}^k \\sigma_i u_i v_i^T$。",
      ),
      generate: (rng: Rng): Problem => {
        const s1 = rng.int(2, 6);
        const u1 = rng.nonZero(-3, 3);
        const u2 = rng.nonZero(-3, 3);
        const v1 = rng.nonZero(-3, 3);
        const v2 = rng.nonZero(-3, 3);

        const a11 = s1 * u1 * v1;
        const a12 = s1 * u1 * v2;
        const a21 = s1 * u2 * v1;
        const a22 = s1 * u2 * v2;

        const prompt = t(
          `In the outer product expansion of the SVD of a matrix $A$, the leading term is $A_1 = \\sigma_1 u_1 v_1^T$. Given $\\sigma_1 = ${s1}$, $u_1 = ${vec2Latex([u1, u2])}$, and $v_1 = ${vec2Latex([v1, v2])}$, calculate the rank-1 matrix $A_1$.`,
          `在矩阵 $A$ 的 SVD 外积展开式中，第一项为最佳秩 1 逼近 $A_1 = \\sigma_1 u_1 v_1^T$。已知 $\\sigma_1 = ${s1}$，$u_1 = ${vec2Latex([u1, u2])}$，$v_1 = ${vec2Latex([v1, v2])}$，计算该秩 1 矩阵 $A_1$。`,
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

        const solution = t(
          `Compute the outer product $u_1 v_1^T = ${vec2Latex([u1, u2])} \\begin{pmatrix} ${v1} & ${v2} \\end{pmatrix} = ${mat2Latex([
            [u1 * v1, u1 * v2],
            [u2 * v1, u2 * v2],
          ])}$. Multiplying by $\\sigma_1 = ${s1}$ gives $A_1 = ${mat2Latex([
            [a11, a12],
            [a21, a22],
          ])}$.`,
          `计算外积 $u_1 v_1^T = ${vec2Latex([u1, u2])} \\begin{pmatrix} ${v1} & ${v2} \\end{pmatrix} = ${mat2Latex([
            [u1 * v1, u1 * v2],
            [u2 * v1, u2 * v2],
          ])}$。乘上奇异值 $\\sigma_1 = ${s1}$ 即得 $A_1 = ${mat2Latex([
            [a11, a12],
            [a21, a22],
          ])}$。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-error-of-a-truncated-svd",
      title: t("The error of a truncated SVD", "截断奇异值分解的误差"),
      explanation: t(
        "Keeping the first $k$ terms of $A = \\sum_i \\sigma_i\\mathbf{u}_i\\mathbf{v}_i^T$ gives the best rank-$k$ approximation $A_k$. The error $A - A_k = \\sum_{i > k}\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^T$ has singular values $\\sigma_{k+1}, \\sigma_{k+2}, \\dots$, so\n\n$$\\|A - A_k\\|_2 = \\sigma_{k+1}, \\qquad \\|A - A_k\\|_F^2 = \\sigma_{k+1}^2 + \\sigma_{k+2}^2 + \\cdots.$$",
        "保留 $A = \\sum_i \\sigma_i\\mathbf{u}_i\\mathbf{v}_i^T$ 的前 $k$ 项得到最佳秩 $k$ 逼近 $A_k$。误差 $A - A_k = \\sum_{i > k}\\sigma_i\\mathbf{u}_i\\mathbf{v}_i^T$ 的奇异值为 $\\sigma_{k+1}, \\sigma_{k+2}, \\dots$，所以\n\n$$\\|A - A_k\\|_2 = \\sigma_{k+1}, \\qquad \\|A - A_k\\|_F^2 = \\sigma_{k+1}^2 + \\sigma_{k+2}^2 + \\cdots。$$",
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
          wrong: fro
            ? [rest.reduce((x, y) => x + y, 0), sig[k]! ** 2, sig.slice(k + 1).reduce((x, y) => x + y * y, 0)]
            : [sig[k - 1]!, sig[k + 1]!, rest.reduce((x, y) => x + y, 0)],
          solution: fro
            ? t(
                `The discarded singular values are $${rest.join(", ")}$, so the squared Frobenius error is $${rest.map((x) => `${x}^2`).join(" + ")} = ${ans}$.`,
                `舍弃的奇异值为 $${rest.join(", ")}$，所以 Frobenius 误差的平方为 $${rest.map((x) => `${x}^2`).join(" + ")} = ${ans}$。`,
              )
            : t(
                `The spectral-norm error is the first discarded singular value, $\\sigma_{${k + 1}} = ${ans}$.`,
                `谱范数误差是第一个被舍弃的奇异值 $\\sigma_{${k + 1}} = ${ans}$。`,
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
  prerequisites: ["singular-value-decomposition-of-larger-matrices"],
  encompasses: [],
  xp: 16,
  knowledgePoints: [
    {
      id: "moore-penrose-pseudoinverse",
      title: t("Moore-Penrose Pseudoinverse from SVD", "由 SVD 构造摩尔-彭罗斯伪逆"),
      explanation: t(
        "For a matrix with SVD $A = U \\Sigma V^T$, the Moore-Penrose pseudoinverse is $A^+ = V \\Sigma^+ U^T$, where $\\Sigma^+$ is formed by replacing every non-zero singular value $\\sigma_i$ by its reciprocal $\\frac{1}{\\sigma_i}$ and transposing.",
        "若矩阵 $A$ 的 SVD 分解为 $A = U \\Sigma V^T$，则其摩尔-彭罗斯伪逆为 $A^+ = V \\Sigma^+ U^T$。其中 $\\Sigma^+$ 是将 $\\Sigma$ 的每个非零奇异值 $\\sigma_i$ 替换为其倒数 $\\frac{1}{\\sigma_i}$ 并转置后得到的矩阵。",
      ),
      generate: (rng: Rng): Problem => {
        const s1 = rng.int(2, 8);
        const s2 = rng.int(2, 8);

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

        const solution = t(
          `For a diagonal matrix with non-zero diagonal entries, the pseudoinverse is obtained by inverting each non-zero diagonal element: $\\Sigma^+ = ${mat2StrLatex(
            [
              [`\\frac{1}{${s1}}`, "0"],
              ["0", `\\frac{1}{${s2}}`],
            ],
          )}$.`,
          `对于主对角元非零的对角矩阵，其伪逆只需将每个对角元取倒数：$\\Sigma^+ = ${mat2StrLatex([
            [`\\frac{1}{${s1}}`, "0"],
            ["0", `\\frac{1}{${s2}}`],
          ])}$。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-pseudoinverse-of-a-column-vector",
      title: t("The pseudoinverse of a single column", "单列矩阵的伪逆"),
      explanation: t(
        "A nonzero column $\\mathbf{a}$ has SVD $\\mathbf{a} = \\mathbf{u}\\,\\sigma\\,[1]$ with $\\sigma = \\|\\mathbf{a}\\|$ and $\\mathbf{u} = \\mathbf{a}/\\|\\mathbf{a}\\|$. Inverting the nonzero singular value and transposing gives\n\n$$\\mathbf{a}^+ = \\frac{\\mathbf{a}^T}{\\|\\mathbf{a}\\|^2}.$$\n\nSo $\\mathbf{a}^+\\mathbf{b} = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{\\mathbf{a} \\cdot \\mathbf{a}}$, which is the least-squares solution of $\\mathbf{a}x = \\mathbf{b}$.",
        "非零列 $\\mathbf{a}$ 的奇异值分解为 $\\mathbf{a} = \\mathbf{u}\\,\\sigma\\,[1]$，$\\sigma = \\|\\mathbf{a}\\|$，$\\mathbf{u} = \\mathbf{a}/\\|\\mathbf{a}\\|$。把非零奇异值取倒数再转置得\n\n$$\\mathbf{a}^+ = \\frac{\\mathbf{a}^T}{\\|\\mathbf{a}\\|^2}。$$\n\n所以 $\\mathbf{a}^+\\mathbf{b} = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{\\mathbf{a} \\cdot \\mathbf{a}}$，即 $\\mathbf{a}x = \\mathbf{b}$ 的最小二乘解。",
      ),
      generate(rng: Rng): Problem {
        const a = [rng.nonZero(-3, 3), rng.int(-3, 3), rng.nonZero(-3, 3)] as const;
        const b = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5)] as const;
        const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        const nn = a[0] ** 2 + a[1] ** 2 + a[2] ** 2;
        const ans = Q.of(dot, nn);
        return numberProblem({
          prompt: t(
            `Let $A = ${vec3Latex(a)}$, a $3 \\times 1$ matrix. Find $A^+\\mathbf{b}$ for $\\mathbf{b} = ${vec3Latex(b)}$.`,
            `设 $A = ${vec3Latex(a)}$ 为 $3 \\times 1$ 矩阵。对 $\\mathbf{b} = ${vec3Latex(b)}$ 求 $A^+\\mathbf{b}$。`,
          ),
          answer: ans,
          wrong: [Q.of(dot), Q.of(nn, dot === 0 ? 1 : dot), Q.of(dot, nn * nn), ans.neg()],
          solution: t(
            `$A^+ = \\frac{1}{${nn}}A^T$, so $A^+\\mathbf{b} = \\frac{${dot}}{${nn}}${ans.isInteger() || ans.d !== BigInt(nn) ? ` = ${ans.toLatex()}` : ""}$.`,
            `$A^+ = \\frac{1}{${nn}}A^T$，所以 $A^+\\mathbf{b} = \\frac{${dot}}{${nn}}${ans.isInteger() || ans.d !== BigInt(nn) ? ` = ${ans.toLatex()}` : ""}$。`,
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
  prerequisites: ["singular-value-decomposition-and-the-pseudoinverse-matrix"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "least-squares-normal-equations",
      title: t("Normal Equations for Full-Rank Systems", "正规方程与最小二乘解"),
      explanation: t(
        "For an inconsistent linear system $A x = b$ where $A$ has linearly independent columns (full column rank), $A^T A$ is invertible. The unique least-squares solution minimizing $\\|b - A x\\|$ satisfies the normal equations $A^T A \\hat{x} = A^T b$, given by $\\hat{x} = (A^T A)^{-1} A^T b$.",
        "对于矛盾线性方程组 $A x = b$，若 $A$ 为列满秩矩阵，则 $A^T A$ 可逆。使残差范数 $\\|b - A x\\|$ 最小的唯一最小二乘解满足正规方程 $A^T A \\hat{x} = A^T b$，其解为 $\\hat{x} = (A^T A)^{-1} A^T b$。",
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
          `求线性方程组 $A x = b$ 的最小二乘解向量 $\\hat{x} = \\langle x_1, x_2 \\rangle$，其中\n\n$$A = ${mat3x2Latex(A)}, \\quad b = ${vec3Latex([b1, b2, b3])}。$$\n\n以 $\\langle x_1, x_2 \\rangle$ 的形式输入向量。`,
        );

        const sumB = b1 + b2 + b3;
        const diffB = -b1 + b3;

        const solution = t(
          `Compute the normal equation components:\n\n$$A^T A = \\begin{pmatrix} 1 & 1 & 1 \\\\ -1 & 0 & 1 \\end{pmatrix} ${mat3x2Latex(A)} = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix},$$\n\n$$A^T b = \\begin{pmatrix} (${b1}) + (${b2}) + (${b3}) \\\\ -(${b1}) + (${b3}) \\end{pmatrix} = \\begin{pmatrix} ${sumB} \\\\ ${diffB} \\end{pmatrix}.$$\n\nSolving $A^T A \\hat{x} = A^T b$ gives $\\hat{x}_1 = \\frac{${sumB}}{3} = ${xHat1}$ and $\\hat{x}_2 = \\frac{${diffB}}{2} = ${xHat2}$. Thus $\\hat{x} = \\langle ${xHat1}, ${xHat2} \\rangle$.`,
          `计算正规方程的各个部分：\n\n$$A^T A = \\begin{pmatrix} 1 & 1 & 1 \\\\ -1 & 0 & 1 \\end{pmatrix} ${mat3x2Latex(A)} = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}，$$\n\n$$A^T b = \\begin{pmatrix} (${b1}) + (${b2}) + (${b3}) \\\\ -(${b1}) + (${b3}) \\end{pmatrix} = \\begin{pmatrix} ${sumB} \\\\ ${diffB} \\end{pmatrix}。$$\n\n解 $A^T A \\hat{x} = A^T b$ 得 $\\hat{x}_1 = \\frac{${sumB}}{3} = ${xHat1}$，$\\hat{x}_2 = \\frac{${diffB}}{2} = ${xHat2}$。因此 $\\hat{x} = \\langle ${xHat1}, ${xHat2} \\rangle$。`,
        );

        return pointProblem({
          prompt,
          answer: [xHat1, xHat2],
          vector: true,
          vars: ["x_1", "x_2"],
          solution,
          wrong: [
            [xHat2, xHat1],
            [xHat1, -xHat2],
            [-xHat1, xHat2],
            [xHat1 + 1, xHat2 - 1],
          ],
        });
      },
    },
    {
      id: "least-squares-with-orthogonal-columns",
      title: t("Least squares with orthogonal columns", "列正交时的最小二乘"),
      explanation: t(
        "The normal equations $A^TA\\hat{\\mathbf{x}} = A^T\\mathbf{b}$ become very simple when the columns of $A$ are orthogonal: $A^TA$ is diagonal, and each unknown is found separately,\n\n$$\\hat{x}_i = \\frac{\\mathbf{a}_i \\cdot \\mathbf{b}}{\\mathbf{a}_i \\cdot \\mathbf{a}_i}.$$\n\nFor example, the columns $(1, 1, 1)$ and $(-1, 0, 1)$ are orthogonal, which is why centered $x$-values make straight-line fits easy.",
        "当 $A$ 的列正交时，正规方程 $A^TA\\hat{\\mathbf{x}} = A^T\\mathbf{b}$ 变得非常简单：$A^TA$ 是对角的，每个未知数可以单独求出，\n\n$$\\hat{x}_i = \\frac{\\mathbf{a}_i \\cdot \\mathbf{b}}{\\mathbf{a}_i \\cdot \\mathbf{a}_i}。$$\n\n例如列 $(1, 1, 1)$ 与 $(-1, 0, 1)$ 正交，这就是中心化的 $x$ 值让直线拟合变容易的原因。",
      ),
      generate(rng: Rng): Problem {
        const s = rng.int(1, 2);
        const A: Mat3x2 = [
          [1, -s],
          [1, 0],
          [1, s],
        ];
        const b = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6)] as const;
        const x1 = Q.of(b[0] + b[1] + b[2], 3);
        const x2 = Q.of(s * (b[2] - b[0]), 2 * s * s);
        return pointProblem({
          prompt: t(
            `Find the least-squares solution $\\hat{\\mathbf{x}}$ of $A\\mathbf{x} = \\mathbf{b}$ with $A = ${mat3x2Latex(A)}$ and $\\mathbf{b} = ${vec3Latex(b)}$.`,
            `求 $A\\mathbf{x} = \\mathbf{b}$ 的最小二乘解 $\\hat{\\mathbf{x}}$，$A = ${mat3x2Latex(A)}$，$\\mathbf{b} = ${vec3Latex(b)}$。`,
          ),
          answer: [x1, x2],
          vector: true,
          vars: ["x_1", "x_2"],
          wrong: [
            [Q.of(b[0] + b[1] + b[2]), Q.of(s * (b[2] - b[0]))],
            [x1, Q.of(s * (b[2] - b[0]), s * s)],
            [Q.of(b[1]), x2],
          ],
          solution: t(
            `The columns are orthogonal, so $\\hat{x}_1 = \\frac{${b[0] + b[1] + b[2]}}{3}$ and $\\hat{x}_2 = \\frac{${s * (b[2] - b[0])}}{${2 * s * s}}$, giving $\\hat{\\mathbf{x}} = \\langle ${x1.toLatex()}, ${x2.toLatex()} \\rangle$.`,
            `各列正交，所以 $\\hat{x}_1 = \\frac{${b[0] + b[1] + b[2]}}{3}$，$\\hat{x}_2 = \\frac{${s * (b[2] - b[0])}}{${2 * s * s}}$，得 $\\hat{\\mathbf{x}} = \\langle ${x1.toLatex()}, ${x2.toLatex()} \\rangle$。`,
          ),
        });
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
  prerequisites: ["least-squares-solution-of-a-linear-system-without-collinearity"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "least-squares-collinear-min-norm",
      title: t("Collinearity and Minimal-Norm Solution", "列相关与极小范数解"),
      explanation: t(
        "When the columns of $A$ are linearly dependent, $A^T A$ is singular. The normal equations $A^T A \\hat{x} = A^T b$ have infinitely many solutions, forming the affine set $\\hat{x}_0 + \\operatorname{Nul}(A)$. Among all least-squares solutions, there is a unique solution with minimal Euclidean norm $\\|\\hat{x}\\|$, given by the pseudoinverse $\\hat{x}_{\\text{min}} = A^+ b$.",
        "当 $A$ 的列向量线性相关时，$A^T A$ 奇异。正规方程 $A^T A \\hat{x} = A^T b$ 有无穷多组解，构成仿射集 $\\hat{x}_0 + \\operatorname{Nul}(A)$。在所有最小二乘解中，存在唯一的欧氏范数 $\\|\\hat{x}\\|$ 最小的解，由伪逆给出：$\\hat{x}_{\\text{min}} = A^+ b$。",
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

        const solution = t(
          `The columns of $A$ are linearly dependent since column 2 is $${mult}$ times column 1. Thus $\\operatorname{rank}(A) = 1 < 2$, making $A^T A$ singular. The normal equations are consistent and have infinitely many solutions along a line $\\hat{x}_0 + \\operatorname{Nul}(A)$. The unique solution with the smallest Euclidean norm is given by the pseudoinverse $\\hat{x}_{\\text{min}} = A^+ b$.`,
          `由于第 2 列是第 1 列的 ${mult} 倍，列向量线性相关，$\\operatorname{rank}(A) = 1 < 2$，导致 $A^T A$ 奇异。正规方程相容且具有无穷多解（构成直线 $\\hat{x}_0 + \\operatorname{Nul}(A)$）。其中欧氏范数最小的解是唯一的，由伪逆 $\\hat{x}_{\\text{min}} = A^+ b$ 给出。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "counting-least-squares-solutions",
      title: t("How many least-squares solutions?", "最小二乘解有几个？"),
      explanation: t(
        "Every system $A\\mathbf{x} = \\mathbf{b}$ has at least one least-squares solution, because the projection of $\\mathbf{b}$ onto the column space always exists. The solution is unique exactly when the columns of $A$ are linearly independent, so that $A^TA$ is invertible. When the columns are collinear or otherwise dependent, any vector in the null space can be added, and there are infinitely many least-squares solutions.",
        "每个方程组 $A\\mathbf{x} = \\mathbf{b}$ 至少有一个最小二乘解，因为 $\\mathbf{b}$ 在列空间上的投影总存在。解唯一当且仅当 $A$ 的列线性无关，此时 $A^TA$ 可逆。当列共线或以其他方式相关时，可以加上零空间中的任意向量，最小二乘解有无穷多个。",
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
        return oneOf(
          rng,
          t(
            `How many least-squares solutions does $A\\mathbf{x} = \\mathbf{b}$ have for $A = ${mat3x2Latex(A)}$ and $\\mathbf{b} = ${vec3Latex(b)}$?`,
            `对 $A = ${mat3x2Latex(A)}$ 与 $\\mathbf{b} = ${vec3Latex(b)}$，$A\\mathbf{x} = \\mathbf{b}$ 有几个最小二乘解？`,
          ),
          dependent ? inf : one,
          [dependent ? one : inf, none],
          dependent
            ? t(
                `The second column is $${m}$ times the first, so the columns are dependent and $A^TA$ is singular. A least-squares solution exists, and adding multiples of $\\langle ${-m}, 1 \\rangle$ gives infinitely many.`,
                `第二列是第一列的 $${m}$ 倍，列相关，$A^TA$ 奇异。最小二乘解存在，加上 $\\langle ${-m}, 1 \\rangle$ 的倍数得到无穷多个。`,
              )
            : t(
                "The columns are not multiples of each other, so they are independent, $A^TA$ is invertible, and the least-squares solution is unique.",
                "两列不成倍数，所以线性无关，$A^TA$ 可逆，最小二乘解唯一。",
              ),
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
  prerequisites: ["least-squares-solution-of-a-linear-system-with-collinearity"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "least-squares-qr-solution",
      title: t("Least-Squares via R x = Q^T b", "利用 R x = Q^T b 求解最小二乘"),
      explanation: t(
        "If $A = Q R$ where $Q$ has orthonormal columns ($Q^T Q = I$) and $R$ is upper triangular and invertible, the normal equations $A^T A \\hat{x} = A^T b$ simplify to $R \\hat{x} = Q^T b$. This upper-triangular system is solved directly by back-substitution without computing $A^T A$.",
        "若 $A = Q R$，其中 $Q$ 的列标准正交（$Q^T Q = I$），$R$ 为可逆上三角矩阵，则正规方程 $A^T A \\hat{x} = A^T b$ 简化为上三角方程组 $R \\hat{x} = Q^T b$。无需计算 $A^T A$，通过回代即可直接求解。",
      ),
      generate: (rng: Rng): Problem => {
        const r11 = rng.nonZero(1, 4);
        const r12 = rng.int(-3, 3);
        const r22 = rng.nonZero(1, 4);

        const xHat2 = rng.int(-3, 3);
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

        const solution = t(
          `Solve the triangular system $R \\hat{x} = Q^T b$:\n\n1. From the second row: $${r22}\\hat{x}_2 = ${d2} \\implies \\hat{x}_2 = ${xHat2}$.\n2. From the first row: $${r11}\\hat{x}_1 + (${r12})(${xHat2}) = ${d1} \\implies ${r11}\\hat{x}_1 = ${d1 - r12 * xHat2} \\implies \\hat{x}_1 = ${xHat1}$.\n\nThus $\\hat{x} = \\langle ${xHat1}, ${xHat2} \\rangle$.`,
          `求解上三角方程组 $R \\hat{x} = Q^T b$：\n\n1. 由第 2 行：$${r22}\\hat{x}_2 = ${d2} \\implies \\hat{x}_2 = ${xHat2}$；\n2. 由第 1 行：$${r11}\\hat{x}_1 + (${r12})(${xHat2}) = ${d1} \\implies ${r11}\\hat{x}_1 = ${d1 - r12 * xHat2} \\implies \\hat{x}_1 = ${xHat1}$。\n\n因此 $\\hat{x} = \\langle ${xHat1}, ${xHat2} \\rangle$。`,
        );

        return pointProblem({
          prompt,
          answer: [xHat1, xHat2],
          vector: true,
          vars: ["x_1", "x_2"],
          solution,
          wrong: [
            [xHat2, xHat1],
            [xHat1, -xHat2],
            [d1, d2],
            [xHat1 + 1, xHat2 - 1],
          ],
        });
      },
    },
    {
      id: "the-right-hand-side-qtb-in-qr-least-squares",
      title: t("The right-hand side $Q^T\\mathbf{b}$ in QR least squares", "QR 最小二乘中的右端 $Q^T\\mathbf{b}$"),
      explanation: t(
        "With $A = QR$, where $Q$ has orthonormal columns, the normal equations reduce to the triangular system $R\\hat{\\mathbf{x}} = Q^T\\mathbf{b}$. The right-hand side is just the dot products of $\\mathbf{b}$ with the columns of $Q$. For instance, the columns $\\frac12(1, 1, 1, 1)$ and $\\frac12(1, -1, 1, -1)$ are orthonormal, and $Q^T\\mathbf{b}$ is half the sum and half the alternating sum of the entries of $\\mathbf{b}$.",
        "对 $A = QR$（$Q$ 的列标准正交），正规方程化为三角方程组 $R\\hat{\\mathbf{x}} = Q^T\\mathbf{b}$。右端就是 $\\mathbf{b}$ 与 $Q$ 各列的点积。例如列 $\\frac12(1, 1, 1, 1)$ 与 $\\frac12(1, -1, 1, -1)$ 标准正交，$Q^T\\mathbf{b}$ 为 $\\mathbf{b}$ 各分量之和的一半与交错和的一半。",
      ),
      generate(rng: Rng): Problem {
        const b = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6)] as const;
        const alt = rng.int(0, 1) === 0;
        const c2 = alt ? [1, -1, 1, -1] : [1, 1, -1, -1];
        const s1 = b[0] + b[1] + b[2] + b[3];
        const s2 = c2[0]! * b[0] + c2[1]! * b[1] + c2[2]! * b[2] + c2[3]! * b[3];
        const ans = [Q.of(s1, 2), Q.of(s2, 2)];
        const col = (v: readonly number[]) => `\\begin{pmatrix} ${v.join(" \\\\ ")} \\end{pmatrix}`;
        return pointProblem({
          prompt: t(
            `In a QR least-squares solve, $Q = \\frac12\\begin{pmatrix} ${[0, 1, 2, 3].map((i) => `1 & ${c2[i]}`).join(" \\\\ ")} \\end{pmatrix}$. Find $Q^T\\mathbf{b}$ for $\\mathbf{b} = ${col(b)}$.`,
            `在 QR 最小二乘求解中，$Q = \\frac12\\begin{pmatrix} ${[0, 1, 2, 3].map((i) => `1 & ${c2[i]}`).join(" \\\\ ")} \\end{pmatrix}$。对 $\\mathbf{b} = ${col(b)}$ 求 $Q^T\\mathbf{b}$。`,
          ),
          answer: ans,
          vector: true,
          wrong: [
            [s1, s2],
            [Q.of(s1, 4), Q.of(s2, 4)],
            [Q.of(s2, 2), Q.of(s1, 2)],
          ],
          solution: t(
            `The first entry is $\\frac12(${b.map((x, i) => (i === 0 ? String(x) : x < 0 ? `- ${-x}` : `+ ${x}`)).join(" ")}) = ${ans[0]!.toLatex()}$, and the second is $\\frac12$ times the signed sum $${s2}$, which is $${ans[1]!.toLatex()}$.`,
            `第一个分量为 $\\frac12(${b.map((x, i) => (i === 0 ? String(x) : x < 0 ? `- ${-x}` : `+ ${x}`)).join(" ")}) = ${ans[0]!.toLatex()}$，第二个是带符号和 $${s2}$ 的 $\\frac12$，即 $${ans[1]!.toLatex()}$。`,
          ),
        });
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
  prerequisites: ["finding-a-least-squares-solution-using-qr-factorization"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "weighted-least-squares-equations",
      title: t("Weighted Normal Equations", "加权正规方程组"),
      explanation: t(
        "When data points have varying reliabilities, each residual $r_i$ is multiplied by a weight $w_i$. Minimizing $\\|W(b - A x)\\|^2$ leads to the weighted normal equations $A^T W^T W A \\hat{x} = A^T W^T W b$, or $A^T \\Omega A \\hat{x} = A^T \\Omega b$ with $\\Omega = \\operatorname{diag}(w_1^2, \\dots, w_m^2)$.",
        "当各数据点可靠性不同时，每个残差 $r_i$ 乘上权重 $w_i$。极小化加权残差 $\\|W(b - A x)\\|^2$ 导出的加权正规方程为 $A^T W^T W A \\hat{x} = A^T W^T W b$，即 $A^T \\Omega A \\hat{x} = A^T \\Omega b$，其中 $\\Omega = \\operatorname{diag}(w_1^2, \\dots, w_m^2)$。",
      ),
      generate: (rng: Rng): Problem => {
        const w1 = rng.int(1, 4);
        const w2 = rng.int(1, 4);
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

        return numberProblem({
          prompt,
          answer: atOmegaA,
          solution: t(
            `The weight squared matrix is $\\Omega = W^T W = ${mat2Latex([
              [w1Sq, 0],
              [0, w2Sq],
            ])}$. Compute $A^T \\Omega A = (${a1})^2(${w1Sq}) + (${a2})^2(${w2Sq}) = ${a1 * a1 * w1Sq} + ${a2 * a2 * w2Sq} = ${atOmegaA}$.`,
            `权重平方矩阵为 $\\Omega = W^T W = ${mat2Latex([
              [w1Sq, 0],
              [0, w2Sq],
            ])}$。计算 $A^T \\Omega A = (${a1})^2(${w1Sq}) + (${a2})^2(${w2Sq}) = ${a1 * a1 * w1Sq} + ${a2 * a2 * w2Sq} = ${atOmegaA}$。`,
          ),
          wrong: [a1 * a1 + a2 * a2, atOmegaA + 2, atOmegaA - 2, a1 * w1 + a2 * w2],
        });
      },
    },
    {
      id: "a-weighted-least-squares-constant-fit",
      title: t("Fitting a constant by weighted least squares", "用加权最小二乘拟合常数"),
      explanation: t(
        "Weighted least squares minimizes $\\sum_i w_i(y_i - \\hat{y}_i)^2$, solving $A^TWA\\hat{\\mathbf{x}} = A^TW\\mathbf{y}$. For the constant model $y = c$, $A$ is a column of ones, and the solution is the weighted mean\n\n$$\\hat{c} = \\frac{\\sum_i w_iy_i}{\\sum_i w_i}.$$\n\nObservations with larger weights pull the estimate toward themselves.",
        "加权最小二乘最小化 $\\sum_i w_i(y_i - \\hat{y}_i)^2$，求解 $A^TWA\\hat{\\mathbf{x}} = A^TW\\mathbf{y}$。对常数模型 $y = c$，$A$ 是全 1 列，解为加权平均\n\n$$\\hat{c} = \\frac{\\sum_i w_iy_i}{\\sum_i w_i}。$$\n\n权重较大的观测把估计拉向自己。",
      ),
      generate(rng: Rng): Problem {
        const y = [rng.int(-5, 9), rng.int(-5, 9), rng.int(-5, 9)];
        const w = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 5)];
        if (w[0] === w[1] && w[1] === w[2]) w[2] = w[2]! + 1;
        const num = w[0]! * y[0]! + w[1]! * y[1]! + w[2]! * y[2]!;
        const den = w[0]! + w[1]! + w[2]!;
        const ans = Q.of(num, den);
        return numberProblem({
          prompt: t(
            `Fit $y = c$ to the observations $y_1 = ${y[0]}$, $y_2 = ${y[1]}$, $y_3 = ${y[2]}$ by weighted least squares with weights $w_1 = ${w[0]}$, $w_2 = ${w[1]}$, $w_3 = ${w[2]}$. Find $\\hat{c}$.`,
            `用权重 $w_1 = ${w[0]}$，$w_2 = ${w[1]}$，$w_3 = ${w[2]}$ 的加权最小二乘把 $y = c$ 拟合到观测 $y_1 = ${y[0]}$，$y_2 = ${y[1]}$，$y_3 = ${y[2]}$。求 $\\hat{c}$。`,
          ),
          answer: ans,
          wrong: [Q.of(y[0]! + y[1]! + y[2]!, 3), Q.of(num), Q.of(num, 3), Q.of(w[2]! * y[0]! + w[1]! * y[1]! + w[0]! * y[2]!, den)],
          solution: t(
            `$\\hat{c} = \\frac{${w[0]} \\cdot ${y[0]! < 0 ? `(${y[0]})` : y[0]} + ${w[1]} \\cdot ${y[1]! < 0 ? `(${y[1]})` : y[1]} + ${w[2]} \\cdot ${y[2]! < 0 ? `(${y[2]})` : y[2]}}{${den}} = ${ans.toLatex()}$.`,
            `$\\hat{c} = \\frac{${w[0]} \\cdot ${y[0]! < 0 ? `(${y[0]})` : y[0]} + ${w[1]} \\cdot ${y[1]! < 0 ? `(${y[1]})` : y[1]} + ${w[2]} \\cdot ${y[2]! < 0 ? `(${y[2]})` : y[2]}}{${den}} = ${ans.toLatex()}$。`,
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
  prerequisites: ["weighted-least-squares"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "markov-chains-transition",
      title: t("State Transitions in a Markov Chain", "马尔可夫链的状态转移"),
      explanation: t(
        "A column-stochastic matrix $P$ has non-negative entries with each column summing to 1. Given the state probability vector $x_k$ at step $k$, the state vector at step $k+1$ is given by $x_{k+1} = P x_k$.",
        "列随机矩阵 $P$ 的元素非负且每列元素之和为 1。已知第 $k$ 步的状态概率向量为 $x_k$，则第 $k+1$ 步的状态向量由 $x_{k+1} = P x_k$ 给出。",
      ),
      generate: (rng: Rng): Problem => {
        const aNum = rng.int(6, 9);
        const bNum = rng.int(1, 4);

        const p11 = Q.of(aNum, 10);
        const p21 = Q.of(10 - aNum, 10);
        const p12 = Q.of(bNum, 10);
        const p22 = Q.of(10 - bNum, 10);

        const useStandard = rng.bool();
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

        const solution = t(
          `Multiply $P$ by $x_0$:\n\n$$x_1 = P x_0 = ${mat2StrLatex(matStr)} ${vec2Latex(x0Str)} = \\begin{pmatrix} (${p11.toLatex()})(${x01.toLatex()}) + (${p12.toLatex()})(${x02.toLatex()}) \\\\ (${p21.toLatex()})(${x01.toLatex()}) + (${p22.toLatex()})(${x02.toLatex()}) \\end{pmatrix} = \\begin{pmatrix} ${y1.toLatex()} \\\\ ${y2.toLatex()} \\end{pmatrix}.$$\n\nThus $x_1 = \\langle ${y1.toLatex()}, ${y2.toLatex()} \\rangle$.`,
          `计算矩阵与初始状态向量之积：\n\n$$x_1 = P x_0 = ${mat2StrLatex(matStr)} ${vec2Latex(x0Str)} = \\begin{pmatrix} (${p11.toLatex()})(${x01.toLatex()}) + (${p12.toLatex()})(${x02.toLatex()}) \\\\ (${p21.toLatex()})(${x01.toLatex()}) + (${p22.toLatex()})(${x02.toLatex()}) \\end{pmatrix} = \\begin{pmatrix} ${y1.toLatex()} \\\\ ${y2.toLatex()} \\end{pmatrix}。$$\n\n故 $x_1 = \\langle ${y1.toLatex()}, ${y2.toLatex()} \\rangle$。`,
        );

        return pointProblem({
          prompt,
          answer: [y1, y2],
          vector: true,
          vars: ["x_1", "x_2"],
          solution,
          wrong: [
            [y2, y1],
            [p12, p22],
            [Q.of(1, 2), Q.of(1, 2)],
            [p11, p12],
          ],
        });
      },
    },
    {
      id: "a-two-step-transition-probability",
      title: t("A two-step transition probability", "两步转移概率"),
      explanation: t(
        "With a column-stochastic matrix $P$, the entry $p_{ij}$ is the probability of moving from state $j$ to state $i$ in one step. Two steps correspond to $P^2$, and summing over the intermediate state $k$ gives\n\n$$(P^2)_{ij} = \\sum_k p_{ik}\\,p_{kj}.$$\n\nFor two states, the probability of being in state 1 two steps after starting there is $p_{11}^2 + p_{12}p_{21}$: stay twice, or leave and come back.",
        "对列随机矩阵 $P$，元素 $p_{ij}$ 是一步从状态 $j$ 转到状态 $i$ 的概率。两步对应 $P^2$，对中间状态 $k$ 求和得\n\n$$(P^2)_{ij} = \\sum_k p_{ik}\\,p_{kj}。$$\n\n对两个状态，从状态 1 出发两步后仍在状态 1 的概率为 $p_{11}^2 + p_{12}p_{21}$：两次都停留，或离开后再回来。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
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
          wrong: toTwo ? [p21, p21.mul(p21), p21.mul(p11)] : [p11, p11.mul(p11), p12.mul(p21)],
          solution: toTwo
            ? t(
                `$(P^2)_{21} = p_{21}p_{11} + p_{22}p_{21} = ${p21.toLatex()} \\cdot ${p11.toLatex()} + ${p22.toLatex()} \\cdot ${p21.toLatex()} = ${ans.toLatex()}$.`,
                `$(P^2)_{21} = p_{21}p_{11} + p_{22}p_{21} = ${p21.toLatex()} \\cdot ${p11.toLatex()} + ${p22.toLatex()} \\cdot ${p21.toLatex()} = ${ans.toLatex()}$。`,
              )
            : t(
                `$(P^2)_{11} = p_{11}^2 + p_{12}p_{21} = \\left(${p11.toLatex()}\\right)^2 + ${p12.toLatex()} \\cdot ${p21.toLatex()} = ${ans.toLatex()}$.`,
                `$(P^2)_{11} = p_{11}^2 + p_{12}p_{21} = \\left(${p11.toLatex()}\\right)^2 + ${p12.toLatex()} \\cdot ${p21.toLatex()} = ${ans.toLatex()}$。`,
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
  prerequisites: ["markov-chains"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "markov-steady-state-vector",
      title: t("Computing Steady-State Probability Vectors", "计算稳态概率向量"),
      explanation: t(
        "A probability vector $q$ is a steady-state vector for a transition matrix $P$ if $P q = q$ (so $(P - I) q = 0$) and the components satisfy $q_i \\ge 0$ and $\\sum q_i = 1$. For a $2 \\times 2$ matrix $P = \\begin{pmatrix} 1 - a & b \\\\ a & 1 - b \\end{pmatrix}$, $q = \\frac{1}{a + b} \\begin{pmatrix} b \\\\ a \\end{pmatrix}$.",
        "概率向量 $q$ 若满足 $P q = q$（即 $(P - I) q = 0$）且其分量非负且和为 1，则称为转移矩阵 $P$ 的稳态向量。对于 $2 \\times 2$ 矩阵 $P = \\begin{pmatrix} 1 - a & b \\\\ a & 1 - b \\end{pmatrix}$，其稳态向量为 $q = \\frac{1}{a + b} \\begin{pmatrix} b \\\\ a \\end{pmatrix}$。",
      ),
      generate: (rng: Rng): Problem => {
        const aNum = rng.int(1, 8);
        const bNum = rng.int(1, 8);
        const sum = aNum + bNum;
        const extra = rng.int(1, 5);
        const denom = sum + extra;

        const q1 = Q.of(bNum, sum);
        const q2 = Q.of(aNum, sum);

        const prompt = t(
          `For a regular Markov chain with transition matrix $P = \\begin{pmatrix} 1 - \\frac{${aNum}}{${denom}} & \\frac{${bNum}}{${denom}} \\\\ \\frac{${aNum}}{${denom}} & 1 - \\frac{${bNum}}{${denom}} \\end{pmatrix}$, find the first component $q_1$ of the steady-state probability vector $q = \\begin{pmatrix} q_1 \\\\ q_2 \\end{pmatrix}$.`,
          `对于具有转移矩阵 $P = \\begin{pmatrix} 1 - \\frac{${aNum}}{${denom}} & \\frac{${bNum}}{${denom}} \\\\ \\frac{${aNum}}{${denom}} & 1 - \\frac{${bNum}}{${denom}} \\end{pmatrix}$ 的正则马尔可夫链，求稳态概率向量 $q = \\begin{pmatrix} q_1 \\\\ q_2 \\end{pmatrix}$ 的第一个分量 $q_1$。`,
        );

        return numberProblem({
          prompt,
          answer: q1,
          solution: t(
            `The steady-state equation $(P - I) q = 0$ gives $-\\frac{${aNum}}{${denom}} q_1 + \\frac{${bNum}}{${denom}} q_2 = 0$, which simplifies to $${aNum} q_1 = ${bNum} q_2$. Together with the probability condition $q_1 + q_2 = 1$, substituting $q_2 = \\frac{${aNum}}{${bNum}} q_1$ gives $\\left(1 + \\frac{${aNum}}{${bNum}}\\right) q_1 = 1$, so $q_1 = \\frac{${bNum}}{${sum}} = ${q1.toLatex()}$.`,
            `稳态方程 $(P - I) q = 0$ 给出 $-\\frac{${aNum}}{${denom}} q_1 + \\frac{${bNum}}{${denom}} q_2 = 0$，化简得 $${aNum} q_1 = ${bNum} q_2$。结合概率条件 $q_1 + q_2 = 1$，代入 $q_2 = \\frac{${aNum}}{${bNum}} q_1$ 得 $\\left(1 + \\frac{${aNum}}{${bNum}}\\right) q_1 = 1$，解得 $q_1 = \\frac{${bNum}}{${sum}} = ${q1.toLatex()}$。`,
          ),
          wrong: [q2, Q.of(1, 2), Q.of(aNum, denom)],
        });
      },
    },
    {
      id: "the-steady-state-of-a-three-state-chain-by-balance",
      title: t("The steady state of a three-state chain by balance", "用平衡关系求三状态链的稳态"),
      explanation: t(
        "In a chain on states $1, 2, 3$ that only moves between neighbors, in the long run the flow across each cut must balance: $\\pi_1 p_{21} = \\pi_2 p_{12}$ and $\\pi_2 p_{32} = \\pi_3 p_{23}$, where $p_{ij}$ is the probability of moving from $j$ to $i$. So $\\pi$ is proportional to\n\n$$\\left(1,\\ \\frac{p_{21}}{p_{12}},\\ \\frac{p_{21}p_{32}}{p_{12}p_{23}}\\right),$$\n\nand dividing by the sum makes the entries add to $1$.",
        "在只在相邻状态间移动的三状态链 $1, 2, 3$ 中，长期来看穿过每个割的流量必须平衡：$\\pi_1 p_{21} = \\pi_2 p_{12}$，$\\pi_2 p_{32} = \\pi_3 p_{23}$，其中 $p_{ij}$ 是从 $j$ 转到 $i$ 的概率。所以 $\\pi$ 与\n\n$$\\left(1,\\ \\frac{p_{21}}{p_{12}},\\ \\frac{p_{21}p_{32}}{p_{12}p_{23}}\\right)$$\n\n成比例，除以总和使各分量之和为 $1$。",
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
        return numberProblem({
          prompt: t(
            `A chain moves each step from state 1 to 2 with probability $${pct(up1)}$; from 2 to 1 with probability $${pct(down2)}$ and from 2 to 3 with probability $${pct(up2)}$; from 3 to 2 with probability $${pct(down3)}$; otherwise it stays. Find the long-run probability of state ${which}.`,
            `某链每一步从状态 1 转到 2 的概率为 $${pct(up1)}$；从 2 转到 1 的概率为 $${pct(down2)}$，从 2 转到 3 的概率为 $${pct(up2)}$；从 3 转到 2 的概率为 $${pct(down3)}$；否则停留。求状态 ${which} 的长期概率。`,
          ),
          answer: ans,
          wrong: [Q.of(1, 3), Q.one.div(total), r3.div(total), r2.div(total), Q.of(up1, up1 + down2)],
          solution: t(
            `Balance gives $\\pi_2 = ${r2.toLatex()}\\,\\pi_1$ and $\\pi_3 = ${up2 === down3 ? "" : `${Q.of(up2, down3).toLatex()}\\,`}\\pi_2 = ${r3.toLatex()}\\,\\pi_1$. The weights $1, ${r2.toLatex()}, ${r3.toLatex()}$ sum to $${total.toLatex()}$, so $\\pi_{${which}} = ${ans.toLatex()}$.`,
            `平衡给出 $\\pi_2 = ${r2.toLatex()}\\,\\pi_1$，$\\pi_3 = ${up2 === down3 ? "" : `${Q.of(up2, down3).toLatex()}\\,`}\\pi_2 = ${r3.toLatex()}\\,\\pi_1$。权重 $1, ${r2.toLatex()}, ${r3.toLatex()}$ 之和为 $${total.toLatex()}$，所以 $\\pi_{${which}} = ${ans.toLatex()}$。`,
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
  prerequisites: ["steady-state-vectors"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "matrix-linear-regression",
      title: t("Design Matrix and Normal Equations for Linear Regression", "线性回归的设计矩阵与正规方程"),
      explanation: t(
        "To fit a regression line $y = \\beta_0 + \\beta_1 x$ to $n$ data points $(x_i, y_i)$, set up the design matrix $X = \\begin{pmatrix} 1 & x_1 \\\\ \\vdots & \\vdots \\\\ 1 & x_n \\end{pmatrix}$ and response vector $y = \\begin{pmatrix} y_1 \\\\ \\vdots \\\\ y_n \\end{pmatrix}$. The parameter vector $\\beta = \\begin{pmatrix} \\beta_0 \\\\ \\beta_1 \\end{pmatrix}$ satisfies $X^T X \\beta = X^T y$.",
        "为了对 $n$ 个数据点 $(x_i, y_i)$ 拟合回归线 $y = \\beta_0 + \\beta_1 x$，建立设计矩阵 $X = \\begin{pmatrix} 1 & x_1 \\\\ \\vdots & \\vdots \\\\ 1 & x_n \\end{pmatrix}$ 与响应向量 $y = \\begin{pmatrix} y_1 \\\\ \\vdots \\\\ y_n \\end{pmatrix}$。回归参数向量 $\\beta = \\begin{pmatrix} \\beta_0 \\\\ \\beta_1 \\end{pmatrix}$ 满足正规方程 $X^T X \\beta = X^T y$。",
      ),
      generate: (rng: Rng): Problem => {
        const beta0 = rng.int(-4, 4);
        const beta1 = rng.int(-3, 3);
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

        const solution = t(
          `Set up the design matrix $X$ and response vector $y$:\n\n$$X = \\begin{pmatrix} 1 & -1 \\\\ 1 & 0 \\\\ 1 & 1 \\end{pmatrix}, \\quad y = ${vec3Latex([y1, y2, y3])}.$$\n\nCompute $X^T X$ and $X^T y$:\n\n$$X^T X = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}, \\quad X^T y = \\begin{pmatrix} (${y1}) + (${y2}) + (${y3}) \\\\ -(${y1}) + (${y3}) \\end{pmatrix} = \\begin{pmatrix} ${sumY} \\\\ ${sumXY} \\end{pmatrix}.$$\n\nSolving $X^T X \\beta = X^T y$ gives $\\beta_0 = \\frac{${sumY}}{3} = ${beta0}$ and $\\beta_1 = \\frac{${sumXY}}{2} = ${beta1}$. Thus $\\beta = \\langle ${beta0}, ${beta1} \\rangle$.`,
          `建立设计矩阵 $X$ 与响应向量 $y$：\n\n$$X = \\begin{pmatrix} 1 & -1 \\\\ 1 & 0 \\\\ 1 & 1 \\end{pmatrix}, \\quad y = ${vec3Latex([y1, y2, y3])}。$$\n\n计算 $X^T X$ 与 $X^T y$：\n\n$$X^T X = \\begin{pmatrix} 3 & 0 \\\\ 0 & 2 \\end{pmatrix}, \\quad X^T y = \\begin{pmatrix} (${y1}) + (${y2}) + (${y3}) \\\\ -(${y1}) + (${y3}) \\end{pmatrix} = \\begin{pmatrix} ${sumY} \\\\ ${sumXY} \\end{pmatrix}。$$\n\n求解 $X^T X \\beta = X^T y$ 得 $\\beta_0 = \\frac{${sumY}}{3} = ${beta0}$，$\\beta_1 = \\frac{${sumXY}}{2} = ${beta1}$。因此 $\\beta = \\langle ${beta0}, ${beta1} \\rangle$。`,
        );

        return pointProblem({
          prompt,
          answer: [beta0, beta1],
          vector: true,
          vars: ["\\beta_0", "\\beta_1"],
          solution,
          wrong: [
            [beta1, beta0],
            [beta0, -beta1],
            [-beta0, beta1],
            [beta0 + 1, beta1 - 1],
          ],
        });
      },
    },
    {
      id: "the-entries-of-xtx-and-xty",
      title: t("The entries of $X^TX$ and $X^T\\mathbf{y}$", "$X^TX$ 与 $X^T\\mathbf{y}$ 的元素"),
      explanation: t(
        "For the line $y = \\beta_0 + \\beta_1x$ the design matrix $X$ has a column of ones and a column of $x$-values. Its normal equations $X^TX\\boldsymbol{\\beta} = X^T\\mathbf{y}$ are built from simple sums:\n\n$$X^TX = \\begin{pmatrix} n & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{pmatrix}, \\qquad X^T\\mathbf{y} = \\begin{pmatrix} \\sum y_i \\\\ \\sum x_iy_i \\end{pmatrix}.$$\n\nComputing these four sums is the main work of a straight-line fit.",
        "对直线 $y = \\beta_0 + \\beta_1x$，设计矩阵 $X$ 有一列 1 与一列 $x$ 值。其正规方程 $X^TX\\boldsymbol{\\beta} = X^T\\mathbf{y}$ 由简单的和构成：\n\n$$X^TX = \\begin{pmatrix} n & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{pmatrix}, \\qquad X^T\\mathbf{y} = \\begin{pmatrix} \\sum y_i \\\\ \\sum x_iy_i \\end{pmatrix}。$$\n\n计算这四个和是直线拟合的主要工作。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(3, 4);
        const xs = Array.from({ length: n }, () => rng.int(-3, 5));
        const ys = Array.from({ length: n }, () => rng.int(-4, 8));
        const pts = xs.map((x, i) => `(${x}, ${ys[i]})`).join(", ");
        const kind = rng.int(0, 2);
        const sx = xs.reduce((a, b) => a + b, 0);
        const sxx = xs.reduce((a, b) => a + b * b, 0);
        const sxy = xs.reduce((a, x, i) => a + x * ys[i]!, 0);
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
          wrong: [sx * sx, sxx, sx, sxy, n, ys.reduce((a, b) => a + b, 0)].filter((w) => w !== ans).slice(0, 4),
          solution: t(`That entry is $${formula} = ${ans}$.`, `该元素为 $${formula} = ${ans}$。`),
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
  prerequisites: ["linear-regression-with-matrices"],
  encompasses: [],
  xp: 15,
  knowledgePoints: [
    {
      id: "matrix-polynomial-regression",
      title: t("Vandermonde Design Matrix for Polynomial Regression", "多项式回归的范德蒙德设计矩阵"),
      explanation: t(
        "To fit a polynomial model $y = \\beta_0 + \\beta_1 x + \\beta_2 x^2 + \\dots + \\beta_d x^d$ to data points $(x_i, y_i)$, the design matrix $X$ is a Vandermonde matrix with $i$-th row $\\begin{pmatrix} 1 & x_i & x_i^2 & \\dots & x_i^d \\end{pmatrix}$. The coefficient vector $\\beta$ satisfies $X^T X \\beta = X^T y$.",
        "为了拟合多项式模型 $y = \\beta_0 + \\beta_1 x + \\beta_2 x^2 + \\dots + \\beta_d x^d$，设计矩阵 $X$ 为范德蒙德矩阵，其第 $i$ 行为 $\\begin{pmatrix} 1 & x_i & x_i^2 & \\dots & x_i^d \\end{pmatrix}$。系数向量 $\\beta$ 满足正规方程 $X^T X \\beta = X^T y$。",
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

        const solution = t(
          `Each row of the design matrix for a quadratic polynomial has the form $\\begin{pmatrix} 1 & x_i & x_i^2 \\end{pmatrix}$. Substituting $x_1 = ${x1}$, $x_2 = ${x2}$, and $x_3 = ${x3}$ gives the rows $\\begin{pmatrix} 1 & ${x1} & ${x1Sq} \\end{pmatrix}$, $\\begin{pmatrix} 1 & ${x2} & ${x2Sq} \\end{pmatrix}$, and $\\begin{pmatrix} 1 & ${x3} & ${x3Sq} \\end{pmatrix}$, giving $X = ${mat3Latex(mat)}$.`,
          `二次多项式拟合设计矩阵的每一行具有形式 $\\begin{pmatrix} 1 & x_i & x_i^2 \\end{pmatrix}$。代入 $x_1 = ${x1}$、$x_2 = ${x2}$、$x_3 = ${x3}$，各行分别为 $\\begin{pmatrix} 1 & ${x1} & ${x1Sq} \\end{pmatrix}$、$\\begin{pmatrix} 1 & ${x2} & ${x2Sq} \\end{pmatrix}$ 与 $\\begin{pmatrix} 1 & ${x3} & ${x3Sq} \\end{pmatrix}$，故 $X = ${mat3Latex(mat)}$。`,
        );

        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "a-quadratic-fit-through-three-points-interpolates",
      title: t("A quadratic fit to three points", "三点的二次拟合"),
      explanation: t(
        "Fitting $y = \\beta_0 + \\beta_1x + \\beta_2x^2$ to three points with distinct $x$-values gives a square, invertible design matrix. The least-squares solution then solves $X\\boldsymbol{\\beta} = \\mathbf{y}$ exactly, so the parabola passes through all three points. For $x = -h, 0, h$:\n\n$$\\beta_0 = y_0, \\qquad \\beta_1 = \\frac{y_h - y_{-h}}{2h}, \\qquad \\beta_2 = \\frac{y_h + y_{-h} - 2y_0}{2h^2}.$$",
        "用 $y = \\beta_0 + \\beta_1x + \\beta_2x^2$ 拟合 $x$ 值互不相同的三个点，设计矩阵是可逆方阵。此时最小二乘解恰好满足 $X\\boldsymbol{\\beta} = \\mathbf{y}$，抛物线经过全部三点。对 $x = -h, 0, h$：\n\n$$\\beta_0 = y_0, \\qquad \\beta_1 = \\frac{y_h - y_{-h}}{2h}, \\qquad \\beta_2 = \\frac{y_h + y_{-h} - 2y_0}{2h^2}。$$",
      ),
      generate(rng: Rng): Problem {
        const h = rng.int(1, 2);
        const ym = rng.int(-6, 8);
        const y0 = rng.int(-6, 8);
        const yp = rng.int(-6, 8);
        const which = rng.int(1, 2);
        const b1 = Q.of(yp - ym, 2 * h);
        const b2 = Q.of(yp + ym - 2 * y0, 2 * h * h);
        const ans = which === 1 ? b1 : b2;
        return numberProblem({
          prompt: t(
            `Fit $y = \\beta_0 + \\beta_1x + \\beta_2x^2$ by least squares to $(${-h}, ${ym})$, $(0, ${y0})$, $(${h}, ${yp})$. Find $\\beta_{${which}}$.`,
            `用最小二乘把 $y = \\beta_0 + \\beta_1x + \\beta_2x^2$ 拟合到 $(${-h}, ${ym})$、$(0, ${y0})$、$(${h}, ${yp})$。求 $\\beta_{${which}}$。`,
          ),
          answer: ans,
          wrong:
            which === 1
              ? [Q.of(yp - ym), Q.of(yp - ym, h), b2]
              : [Q.of(yp + ym - 2 * y0), Q.of(yp + ym - 2 * y0, h * h), Q.of(yp + ym - y0, 2 * h * h), b1],
          solution: t(
            `Three points with distinct $x$ give an exact fit. Then $\\beta_1 = \\frac{${yp} - ${ym < 0 ? `(${ym})` : ym}}{${2 * h}} = ${b1.toLatex()}$ and $\\beta_2 = \\frac{${yp} + ${ym < 0 ? `(${ym})` : ym} - 2 \\cdot ${y0 < 0 ? `(${y0})` : y0}}{${2 * h * h}} = ${b2.toLatex()}$.`,
            `$x$ 互不相同的三点给出精确拟合。于是 $\\beta_1 = \\frac{${yp} - ${ym < 0 ? `(${ym})` : ym}}{${2 * h}} = ${b1.toLatex()}$，$\\beta_2 = \\frac{${yp} + ${ym < 0 ? `(${ym})` : ym} - 2 \\cdot ${y0 < 0 ? `(${y0})` : y0}}{${2 * h * h}} = ${b2.toLatex()}$。`,
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
  prerequisites: ["polynomial-regression-with-matrices"],
  encompasses: [],
  xp: 16,
  knowledgePoints: [
    {
      id: "multiple-regression-hat-matrix",
      title: t("The Hat Matrix in Multiple Regression", "多元回归中的帽子矩阵"),
      explanation: t(
        "In multiple linear regression $y = X \\beta + \\varepsilon$, the vector of fitted values is $\\hat{y} = X \\hat{\\beta} = X(X^T X)^{-1} X^T y = H y$. The hat matrix $H = X(X^T X)^{-1} X^T$ is an orthogonal projection matrix onto the column space $\\operatorname{Col}(X)$, satisfying $H^2 = H$ (idempotent), $H^T = H$ (symmetric), and $\\operatorname{tr}(H) = \\operatorname{rank}(X)$.",
        "在多元线性回归 $y = X \\beta + \\varepsilon$ 中，拟合值向量为 $\\hat{y} = X \\hat{\\beta} = X(X^T X)^{-1} X^T y = H y$。帽子矩阵 $H = X(X^T X)^{-1} X^T$ 是向列空间 $\\operatorname{Col}(X)$ 的正交投影矩阵，满足 $H^2 = H$（幂等）、$H^T = H$（对称）且 $\\operatorname{tr}(H) = \\operatorname{rank}(X)$。",
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
          solution: t(
            `Using the cyclic property of the trace, $\\operatorname{tr}(H) = \\operatorname{tr}(X (X^T X)^{-1} X^T) = \\operatorname{tr}((X^T X)^{-1} X^T X) = \\operatorname{tr}(I_p) = p$. Since there are $p = ${p}$ parameters, the trace of the hat matrix is $${p}$.`,
            `利用迹的循环性质，$\\operatorname{tr}(H) = \\operatorname{tr}(X (X^T X)^{-1} X^T) = \\operatorname{tr}((X^T X)^{-1} X^T X) = \\operatorname{tr}(I_p) = p$。由于共有 $p = ${p}$ 个参数，故帽子矩阵的迹为 $${p}$。`,
          ),
          wrong: [n, n - p, p - 1, 1],
        });
      },
    },
    {
      id: "a-fitted-value-and-residual-in-multiple-regression",
      title: t("A fitted value and residual in multiple regression", "多元回归中的拟合值与残差"),
      explanation: t(
        "Once $\\hat{\\boldsymbol{\\beta}} = (X^TX)^{-1}X^T\\mathbf{y}$ is known, the fitted values are $\\hat{\\mathbf{y}} = X\\hat{\\boldsymbol{\\beta}}$: each row of $X$, $(1, x_{i1}, x_{i2})$, is dotted with $\\hat{\\boldsymbol{\\beta}}$. The residual of an observation is $e_i = y_i - \\hat{y}_i$, positive when the observation lies above the fitted plane and negative when it lies below.",
        "求得 $\\hat{\\boldsymbol{\\beta}} = (X^TX)^{-1}X^T\\mathbf{y}$ 后，拟合值为 $\\hat{\\mathbf{y}} = X\\hat{\\boldsymbol{\\beta}}$：$X$ 的每一行 $(1, x_{i1}, x_{i2})$ 与 $\\hat{\\boldsymbol{\\beta}}$ 作点积。观测的残差为 $e_i = y_i - \\hat{y}_i$，观测在拟合平面上方时为正，下方时为负。",
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
          wrong: [-ans, yhat, y - b[0], y - (b[1] * x1 + b[2] * x2)],
          solution: t(
            `$\\hat{y} = ${b[0]} + ${b[1] < 0 ? `(${b[1]})` : b[1]} \\cdot ${x1} + ${b[2] < 0 ? `(${b[2]})` : b[2]} \\cdot ${x2 < 0 ? `(${x2})` : x2} = ${yhat}$, so $e = ${y} - ${yhat < 0 ? `(${yhat})` : yhat} = ${ans}$.`,
            `$\\hat{y} = ${b[0]} + ${b[1] < 0 ? `(${b[1]})` : b[1]} \\cdot ${x1} + ${b[2] < 0 ? `(${b[2]})` : b[2]} \\cdot ${x2 < 0 ? `(${x2})` : x2} = ${yhat}$，所以 $e = ${y} - ${yhat < 0 ? `(${yhat})` : yhat} = ${ans}$。`,
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
