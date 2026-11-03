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
        "Lagrange's method repeatedly completes the square on each variable to eliminate cross-product terms: $a x_1^2 + 2b x_1 x_2 + c x_2^2 = a\\left(x_1 + \\frac{b}{a} x_2\\right)^2 + \\left(c - \\frac{b^2}{a}\\right) x_2^2 = d_1 y_1^2 + d_2 y_2^2$.",
        "拉格朗日配方法通过逐个变量配方以消除交叉项：$a x_1^2 + 2b x_1 x_2 + c x_2^2 = a\\left(x_1 + \\frac{b}{a} x_2\\right)^2 + \\left(c - \\frac{b^2}{a}\\right) x_2^2 = d_1 y_1^2 + d_2 y_2^2$。",
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
        "The maximum (minimum) of $x^T A x$ subject to $\\|x\\| = 1$ is attained at normalized eigenvectors corresponding to $\\lambda_{\\max}$ (respectively $\\lambda_{\\min}$).",
        "二次型 $x^T A x$ 在 $\\|x\\| = 1$ 约束下的最大值（或最小值）在对应于最大特征值 $\\lambda_{\\max}$（或最小特征值 $\\lambda_{\\min}$）的单位特征向量处取得。",
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
          ])}$. The eigenvalues of $A^T A$ are ${c * c}$ and ${d * d}$. Taking the positive square roots gives the singular values $\\sigma_1 = \\sqrt{${c * c}} = ${c}$ and $\\sigma_2 = \\sqrt{${d * d}} = ${d}$.`,
          `计算 $A^T A = ${mat2Latex([
            [a11 * a11, 0],
            [0, a22 * a22],
          ])}$。$A^T A$ 的特征值为 ${c * c}$ 和 ${d * d}$。取算术平方根得到奇异值为 $\\sigma_1 = \\sqrt{${c * c}} = ${c}$ 与 $\\sigma_2 = \\sqrt{${d * d}} = ${d}$。`,
        );

        return solutionsProblem({
          prompt,
          values: [String(c), String(d)],
          solution,
          wrong: [[String(c * c), String(d * d)], [String(c), String(c + d)], [String(d)], [String(c)]],
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
