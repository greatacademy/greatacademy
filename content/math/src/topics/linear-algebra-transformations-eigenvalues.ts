import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";

import { article, choiceProblem, numberProblem, pointProblem, solutionsProblem, steps, yesNo } from "../problems.ts";

// Linear Algebra Units 4 & 5: Linear Transformations, Eigenvalues, Diagonalization,
// Complex Eigenvalues, Generalized Eigenvectors, and Jordan Canonical Form.
// Modules 4.14, 4.15, 5.16, 5.17, 5.18, 5.19, 5.20 (39 topics).

type Mat2 = readonly [readonly [number, number], readonly [number, number]];
type Mat3 = readonly [readonly [number, number, number], readonly [number, number, number], readonly [number, number, number]];
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

/** vec2Latex formats a 2-element vector as a LaTeX pmatrix. */
function vec2Latex(v: Vec2 | readonly [string, string]): string {
  return `\\begin{pmatrix} ${v[0]} \\\\ ${v[1]} \\end{pmatrix}`;
}

/** vec3Latex formats a 3-element vector as a LaTeX pmatrix. */
function vec3Latex(v: Vec3 | readonly [string, string, string]): string {
  return `\\begin{pmatrix} ${v[0]} \\\\ ${v[1]} \\\\ ${v[2]} \\end{pmatrix}`;
}

/** formatShift formats A - lambda I as A - cI, A + cI, A - I, A + I, or A. */
function formatShift(val: number, name = "I"): string {
  if (val === 0) return "";
  if (val === 1) return ` - ${name}`;
  if (val === -1) return ` + ${name}`;
  if (val > 0) return ` - ${val}${name}`;
  return ` + ${-val}${name}`;
}

/** formatFactor formats (x - root) as x - r, x + r, or x. */
function formatFactor(variable: string, root: number): string {
  if (root === 0) return variable;
  if (root > 0) return `${variable} - ${root}`;
  return `${variable} + ${-root}`;
}

/** formatLinearComb2 formats c1 v1 + c2 v2 with proper signs and omitting 1/-1/0 coefficients. */
function formatLinearComb2(c1: number, v1: string, c2: number, v2: string): string {
  let first = "";
  if (c1 === 1) first = v1;
  else if (c1 === -1) first = `-${v1}`;
  else if (c1 !== 0) first = `${c1}${v1}`;

  let second = "";
  if (c2 === 1) second = first ? ` + ${v2}` : v2;
  else if (c2 === -1) second = first ? ` - ${v2}` : `-${v2}`;
  else if (c2 > 0) second = first ? ` + ${c2}${v2}` : `${c2}${v2}`;
  else if (c2 < 0) second = first ? ` - ${-c2}${v2}` : `-${-c2}${v2}`;

  return first || second ? `${first}${second}` : "0";
}

/** formatPoly2 formats a quadratic polynomial c x^2 + d x + e cleanly. */
function formatPoly2(c: number, d: number, e: number): string {
  let res = "";
  if (c === 1) res = "x^2";
  else if (c === -1) res = "-x^2";
  else if (c !== 0) res = `${c}x^2`;

  if (d === 1) res += res ? " + x" : "x";
  else if (d === -1) res += res ? " - x" : "-x";
  else if (d > 0) res += res ? ` + ${d}x` : `${d}x`;
  else if (d < 0) res += res ? ` - ${-d}x` : `-${-d}x`;

  if (e > 0) res += res ? ` + ${e}` : `${e}`;
  else if (e < 0) res += res ? ` - ${-e}` : `-${-e}`;

  return res || "0";
}

/** formatComplex formats a + bi without 1i, -1i, 0+ or raw signs. */
function formatComplex(a: number, b: number): string {
  if (b === 0) return `${a}`;
  const iPart = b === 1 ? "i" : b === -1 ? "-i" : `${b}i`;
  if (a === 0) return iPart;
  if (b === 1) return `${a} + i`;
  if (b === -1) return `${a} - i`;
  if (b > 0) return `${a} + ${b}i`;
  return `${a} - ${-b}i`;
}

/** formatComplexPair formats a \pm bi without 1i or 0 \pm. */
function formatComplexPair(a: number, b: number): string {
  const iPart = b === 1 ? "i" : `${b}i`;
  if (a === 0) return `\\pm ${iPart}`;
  return `${a} \\pm ${iPart}`;
}

/** formatCharEq formats \lambda^2 - tr \lambda + det = 0. */
function formatCharEq(tr: number, det: number): string {
  let tPart = "";
  if (tr === 1) tPart = " - \\lambda";
  else if (tr === -1) tPart = " + \\lambda";
  else if (tr > 0) tPart = ` - ${tr}\\lambda`;
  else if (tr < 0) tPart = ` + ${-tr}\\lambda`;

  let dPart = "";
  if (det > 0) dPart = ` + ${det}`;
  else if (det < 0) dPart = ` - ${-det}`;

  return `\\lambda^2${tPart}${dPart} = 0`;
}

/** formatCayleyComb formats tr A - det I. */
function formatCayleyComb(tr: number, det: number): string {
  let tStr = "";
  if (tr === 1) tStr = "A";
  else if (tr === -1) tStr = "-A";
  else if (tr !== 0) tStr = `${tr}A`;

  let dStr = "";
  if (det === 1) dStr = tStr ? " - I" : "-I";
  else if (det === -1) dStr = tStr ? " + I" : "I";
  else if (det > 0) dStr = tStr ? ` - ${det}I` : `-${det}I`;
  else if (det < 0) dStr = tStr ? ` + ${-det}I` : `${-det}I`;

  return tStr || dStr ? `${tStr}${dStr}` : "0";
}

/** Pythagorean triples scaled for rotation-scaling matrices. */
const pythagoreanTriples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [6, 8, 10],
  [8, 6, 10],
  [7, 24, 25],
  [24, 7, 25],
  [8, 15, 17],
  [15, 8, 17],
  [9, 12, 15],
  [12, 9, 15],
  [10, 24, 26],
  [24, 10, 26],
  [15, 20, 25],
  [20, 15, 25],
];

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

/** mul2 multiplies two 2x2 matrices. */
function mul2(a: Mat2, b: Mat2): Mat2 {
  return [
    [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
    [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
  ];
}

/** fromEigen2 builds the integer matrix P diag(l1, l2) P^-1 with P = [[1, k], [j, 1 + jk]], whose columns (1, j) and (k, 1 + jk) are eigenvectors for l1 and l2. */
function fromEigen2(l1: number, l2: number, j: number, k: number): Mat2 {
  const P: Mat2 = [
    [1, k],
    [j, 1 + j * k],
  ];
  const Pinv: Mat2 = [
    [1 + j * k, -k],
    [-j, 1],
  ];
  return mul2(
    mul2(P, [
      [l1, 0],
      [0, l2],
    ]),
    Pinv,
  );
}

/** complexEigenMatrix builds an integer matrix [[p, q], [r, 2a - p]] with q = ±1 and eigenvalues a ± bi. */
function complexEigenMatrix(rng: Rng, a: number, b: number): Mat2 {
  const p = rng.int(-4, 4);
  const q = rng.pick([-1, 1]);
  const s = 2 * a - p;
  const r = (p * s - (a * a + b * b)) / q;
  return [
    [p, q],
    [r, s],
  ];
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE 4.14: LINEAR TRANSFORMATIONS
// ════════════════════════════════════════════════════════════════════════════

/** standardMatrixOfALinearTransformationInTermsOfTheStandardBasis constructs standard matrix from images of basis vectors. */
export const standardMatrixOfALinearTransformationInTermsOfTheStandardBasis: TopicDef = {
  id: "standard-matrix-of-a-linear-transformation-in-terms-of-the-standard-basis",
  title: t("The Standard Matrix of a Linear Transformation in Terms of the Standard Basis", "按标准基表示的线性变换的标准矩阵"),
  summary: t(
    "Construct the standard matrix of a linear transformation using the images of the standard basis vectors.",
    "利用标准基向量的像构造线性变换的标准矩阵。",
  ),
  prerequisites: ["the-standard-matrix-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "columns-from-standard-basis-images",
      title: t("Columns from Standard Basis Images", "标准基向量的像构成矩阵各列"),
      explanation: t(
        "Recognize that the $j$-th column of the standard matrix $[T]$ is the image $T(\\mathbf{e}_j)$ of the $j$-th standard basis vector.",
        "理解标准矩阵 $[T]$ 的第 $j$ 列就是第 $j$ 个标准基向量的像 $T(\\mathbf{e}_j)$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(-8, 8);
        const b = rng.int(-8, 8);
        const c = rng.int(-8, 8);
        const d = rng.int(-8, 8);
        const e1Img: Vec2 = [a, c];
        const e2Img: Vec2 = [b, d];
        const prompt = t(
          `Let $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ be a linear transformation such that $T(e_1) = ${vec2Latex(e1Img)}$ and $T(e_2) = ${vec2Latex(e2Img)}$, where $\\{e_1, e_2\\}$ is the standard basis of $\\mathbb{R}^2$. What is the standard matrix $[T]$?`,
          `设 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 为线性变换，使得 $T(e_1) = ${vec2Latex(e1Img)}$ 且 $T(e_2) = ${vec2Latex(e2Img)}$，其中 $\\{e_1, e_2\\}$ 是 $\\mathbb{R}^2$ 的标准基。求线性变换的标准矩阵 $[T]$。`,
        );
        const right = t(
          `$${mat2Latex([
            [a, b],
            [c, d],
          ])}$`,
          `$${mat2Latex([
            [a, b],
            [c, d],
          ])}$`,
        );
        const wrong = [
          t(
            `$${mat2Latex([
              [a, c],
              [b, d],
            ])}$`,
            `$${mat2Latex([
              [a, c],
              [b, d],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [b, a],
              [d, c],
            ])}$`,
            `$${mat2Latex([
              [b, a],
              [d, c],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [c, d],
              [a, b],
            ])}$`,
            `$${mat2Latex([
              [c, d],
              [a, b],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [d, b],
              [c, a],
            ])}$`,
            `$${mat2Latex([
              [d, b],
              [c, a],
            ])}$`,
          ),
        ];
        const solution = t(
          `The columns of the standard matrix $[T]$ are the images of the standard basis vectors: $[T] = \\begin{pmatrix} T(e_1) & T(e_2) \\end{pmatrix} = ${mat2Latex(
            [
              [a, b],
              [c, d],
            ],
          )}$.`,
          `标准矩阵 $[T]$ 的各列即为标准基向量的像：$[T] = \\begin{pmatrix} T(e_1) & T(e_2) \\end{pmatrix} = ${mat2Latex([
            [a, b],
            [c, d],
          ])}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "evaluating-a-transformation-from-basis-images",
      title: t("Evaluating a transformation from basis images", "由基向量的像求变换的值"),
      explanation: t(
        "A linear transformation is determined by what it does to the standard basis. Since $(p, q) = p\\,e_1 + q\\,e_2$, linearity gives\n\n$$T(p, q) = p\\,T(e_1) + q\\,T(e_2).$$\n\nThis is the same as multiplying the standard matrix, whose columns are $T(e_1)$ and $T(e_2)$, by the vector $(p, q)$.",
        "线性变换由它对标准基的作用决定。由于 $(p, q) = p\\,e_1 + q\\,e_2$，线性性给出\n\n$$T(p, q) = p\\,T(e_1) + q\\,T(e_2).$$\n\n这与用标准矩阵（其列为 $T(e_1)$ 和 $T(e_2)$）乘以向量 $(p, q)$ 是一样的。",
      ),
      generate(rng: Rng): Problem {
        const [a, c, b, d] = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5)];
        const p = rng.int(-4, 4) || 2;
        const q = rng.int(-4, 4) || -1;
        const y1 = p * a + q * b;
        const y2 = p * c + q * d;
        return pointProblem({
          prompt: t(
            `A linear transformation $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ has $T(e_1) = ${vec2Latex([a, c])}$ and $T(e_2) = ${vec2Latex([b, d])}$. Find $T\\begin{pmatrix} ${p} \\\\ ${q} \\end{pmatrix} = \\langle y_1, y_2 \\rangle$.`,
            `线性变换 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 满足 $T(e_1) = ${vec2Latex([a, c])}$，$T(e_2) = ${vec2Latex([b, d])}$。求 $T\\begin{pmatrix} ${p} \\\\ ${q} \\end{pmatrix} = \\langle y_1, y_2 \\rangle$。`,
          ),
          answer: [y1, y2],
          vector: true,
          vars: ["y_1", "y_2"],
          wrong: [
            [p * a + q * c, p * b + q * d],
            [a + b, c + d],
          ],
          solution: t(
            `$T(${p}, ${q}) = ${formatLinearComb2(p, vec2Latex([a, c]), q, vec2Latex([b, d]))} = ${vec2Latex([y1, y2])}$.`,
            `$T(${p}, ${q}) = ${formatLinearComb2(p, vec2Latex([a, c]), q, vec2Latex([b, d]))} = ${vec2Latex([y1, y2])}$。`,
          ),
        });
      },
    },
  ],
};

/** kernelOfALinearTransformation covers the definition and computation of the kernel. */
export const kernelOfALinearTransformation: TopicDef = {
  id: "kernel-of-a-linear-transformation",
  title: t("The Kernel of a Linear Transformation", "线性变换的核"),
  summary: t(
    "Find the kernel (null space) of a linear transformation and determine which vectors lie in the kernel.",
    "求线性变换的核（零空间），并判定向量是否属于核。",
  ),
  prerequisites: ["standard-matrix-of-a-linear-transformation-in-terms-of-the-standard-basis"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "determining-kernel-of-linear-transformation",
      title: t("Determining the Kernel of a Linear Transformation", "确定线性变换的核"),
      explanation: t(
        "The kernel is always a subspace of the domain, and you find it by setting the output equal to zero and solving the resulting equations for the input. Find the set of all vectors that are mapped to zero under a linear transformation.",
        "核总是定义域的子空间，求它时令输出等于零，再解出输入满足的方程。求解在线性变换下映射为零向量的所有向量集合。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(1, 6);
        const b = rng.int(1, 6);
        const k = rng.pick([-3, -2, -1, 2, 3, 4])!;
        const mat: Mat2 = [
          [a, k * a],
          [b, k * b],
        ];
        const basisVec: Vec2 = [-k, 1];
        const prompt = t(
          `Let $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ be the linear transformation defined by $T(\\mathbf{x}) = A\\mathbf{x}$, where $A = ${mat2Latex(mat)}$. Find the basis vector $\\mathbf{v} = \\langle x_1, x_2 \\rangle$ for the kernel $\\ker(T)$ whose second component is $x_2 = 1$.`,
          `设 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 为由 $T(\\mathbf{x}) = A\\mathbf{x}$ 定义的线性变换，其中 $A = ${mat2Latex(mat)}$。求核 $\\ker(T)$ 的基向量 $\\mathbf{v} = \\langle x_1, x_2 \\rangle$，使其第二分量为 $x_2 = 1$。`,
        );
        const kStr = k === 1 ? "" : k === -1 ? "-" : `${k}`;
        const negKStr = -k === 1 ? "" : -k === -1 ? "-" : `${-k}`;
        const solution = t(
          `The kernel is the null space of $A$, satisfying $A\\mathbf{x} = \\mathbf{0}$. Since row 2 is a multiple of row 1, the equation is $x_1 ${k > 0 ? `+ ${kStr}` : `- ${negKStr}`}x_2 = 0$, giving $x_1 = ${negKStr}x_2$. Setting $x_2 = 1$ gives $x_1 = ${-k}$, so the basis vector is $\\langle ${-k}, 1 \\rangle$.`,
          `核是满足 $A\\mathbf{x} = \\mathbf{0}$ 的零空间。因为第 2 行是第 1 行的倍数，所以方程为 $x_1 ${k > 0 ? `+ ${kStr}` : `- ${negKStr}`}x_2 = 0$，即 $x_1 = ${negKStr}x_2$。取 $x_2 = 1$ 可得 $x_1 = ${-k}$，因此基向量为 $\\langle ${-k}, 1 \\rangle$。`,
        );
        return pointProblem({
          prompt,
          answer: basisVec,
          vector: true,
          solution,
          wrong: [
            [k, 1],
            [-k, -1],
            [1, -k],
            [a, b],
          ],
        });
      },
    },
    {
      id: "the-kernel-of-a-map-from-r3-to-r2",
      title: t("The kernel of a map from R^3 to R^2", "从 R^3 到 R^2 的映射的核"),
      explanation: t(
        "The kernel of $T(\\mathbf{x}) = A\\mathbf{x}$ is the solution set of $A\\mathbf{x} = \\mathbf{0}$. For a $2 \\times 3$ matrix already in echelon form with pivots in the first two columns, $x_3$ is free. Set $x_3 = 1$ and solve upward by back substitution: the second row gives $x_2$, then the first row gives $x_1$. The resulting vector spans the kernel.",
        "$T(\\mathbf{x}) = A\\mathbf{x}$ 的核是 $A\\mathbf{x} = \\mathbf{0}$ 的解集。对已是阶梯形、主元在前两列的 $2 \\times 3$ 矩阵，$x_3$ 是自由变量。令 $x_3 = 1$，用回代向上求解：第二行给出 $x_2$，再由第一行给出 $x_1$。所得向量张成核。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-4, 4);
        const b = rng.int(-5, 5);
        const c = rng.int(-4, 4) || 2;
        const x2 = -c;
        const x1 = -(a * x2 + b);
        return pointProblem({
          prompt: t(
            `Let $T(\\mathbf{x}) = A\\mathbf{x}$ with $A = \\begin{pmatrix} 1 & ${a} & ${b} \\\\ 0 & 1 & ${c} \\end{pmatrix}$. Find the vector $\\langle x_1, x_2, x_3 \\rangle$ spanning $\\ker(T)$ with $x_3 = 1$.`,
            `设 $T(\\mathbf{x}) = A\\mathbf{x}$，$A = \\begin{pmatrix} 1 & ${a} & ${b} \\\\ 0 & 1 & ${c} \\end{pmatrix}$。求张成 $\\ker(T)$ 且 $x_3 = 1$ 的向量 $\\langle x_1, x_2, x_3 \\rangle$。`,
          ),
          answer: [x1, x2, 1],
          vector: true,
          vars: ["x_1", "x_2", "x_3"],
          wrong: [
            [-b, -c, 1],
            [a * c - b, c, 1],
            [b, c, 1],
          ],
          solution: t(
            `With $x_3 = 1$, the second row gives $x_2 = ${x2}$, and the first row gives $x_1 = -(${a} \\cdot ${paren(x2)} + ${paren(b)}) = ${x1}$.`,
            `取 $x_3 = 1$，第二行给出 $x_2 = ${x2}$，第一行给出 $x_1 = -(${a} \\cdot ${paren(x2)} + ${paren(b)}) = ${x1}$。`,
          ),
        });
      },
    },
  ],
};

/** imageAndRankOfALinearTransformation covers the image and rank of linear transformations. */
export const imageAndRankOfALinearTransformation: TopicDef = {
  id: "image-and-rank-of-a-linear-transformation",
  title: t("The Image and Rank of a Linear Transformation", "线性变换的像与秩"),
  summary: t("Compute the rank and determine the image of a linear transformation.", "计算线性变换的秩并确定其像空间。"),
  prerequisites: ["kernel-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "computing-rank-of-linear-transformation",
      title: t("Computing the Rank of a Linear Transformation", "计算线性变换的秩"),
      explanation: t(
        "The rank of a transformation is the dimension of its range, which equals the rank of any matrix that represents it. Determine the dimension of the image of a linear transformation.",
        "变换的秩是值域的维数，它等于表示这个变换的任意矩阵的秩。确定线性变换像空间的维数（秩）。",
      ),
      generate: (rng: Rng): Problem => {
        const d1 = rng.int(1, 5);
        const d2 = rng.int(1, 5);
        const c12 = rng.int(-3, 3);
        const c13 = rng.int(-3, 3);
        const c23 = rng.int(-3, 3);
        const rankCase = rng.pick([1, 2, 3])!;
        let d3 = 0;
        let finalRank = 2;
        if (rankCase === 3) {
          d3 = rng.int(1, 4);
          finalRank = 3;
        } else if (rankCase === 1) {
          finalRank = 1;
        }

        let mat: Mat3;
        if (finalRank === 3) {
          mat = [
            [d1, c12, c13],
            [0, d2, c23],
            [0, 0, d3],
          ];
        } else if (finalRank === 2) {
          mat = [
            [d1, c12, c13],
            [0, d2, c23],
            [0, 0, 0],
          ];
        } else {
          mat = [
            [d1, c12, c13],
            [0, 0, 0],
            [0, 0, 0],
          ];
        }

        const prompt = t(
          `What is the rank of the linear transformation $T: \\mathbb{R}^3 \\to \\mathbb{R}^3$ defined by $T(x) = Ax$, where $A = ${mat3Latex(mat)}$?`,
          `设线性变换 $T: \\mathbb{R}^3 \\to \\mathbb{R}^3$ 定义为 $T(x) = Ax$，其中 $A = ${mat3Latex(mat)}$。求 $T$ 的秩。`,
        );
        const solution = t(
          `The rank of $T$ is the dimension of the column space of $A$. Since $A$ is in upper triangular form with ${finalRank} non-zero pivot rows, $\\operatorname{rank}(T) = ${finalRank}$.`,
          `变换 $T$ 的秩是矩阵 $A$ 的列空间的维数。由于 $A$ 是上三角矩阵且含有 ${finalRank} 个非零主元行，因此 $\\operatorname{rank}(T) = ${finalRank}$。`,
        );
        return numberProblem({
          prompt,
          answer: finalRank,
          solution,
          wrong: [0, 1, 2, 3].filter((w) => w !== finalRank),
        });
      },
    },
    {
      id: "the-rank-of-a-matrix-with-dependent-rows",
      title: t("The rank of a matrix with dependent rows", "行线性相关的矩阵的秩"),
      explanation: t(
        "The rank of $T(\\mathbf{x}) = A\\mathbf{x}$ is the dimension of its image, which equals the number of linearly independent rows (or columns) of $A$. A row that is a combination of other rows adds nothing: if row 3 equals $p$ times row 1 plus $q$ times row 2, row reduction turns it into zeros. Count the rows that remain non-zero after reduction.",
        "$T(\\mathbf{x}) = A\\mathbf{x}$ 的秩是其像的维数，等于 $A$ 中线性无关的行（或列）的个数。一行若是其他行的组合，则不增加秩：若第 3 行等于第 1 行的 $p$ 倍加第 2 行的 $q$ 倍，行化简会把它变成零。数一数化简后剩下的非零行。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(1, 3);
        const r1 = [1, rng.int(-3, 3), rng.int(-3, 3)] as const;
        const r2 = [0, 1, rng.int(-3, 3)] as const;
        const p = rng.int(-2, 2) || 1;
        const q = rng.int(-2, 2);
        let rows: Mat3;
        if (kind === 1) {
          const s = rng.int(2, 3);
          const tt = rng.pick([-2, -1, 2]);
          rows = [r1, [s * r1[0], s * r1[1], s * r1[2]], [tt * r1[0], tt * r1[1], tt * r1[2]]];
        } else if (kind === 2) {
          rows = [
            r1,
            [r2[0] + p * r1[0], r2[1] + p * r1[1], r2[2] + p * r1[2]],
            [p * r1[0] + q * r2[0], p * r1[1] + q * r2[1], p * r1[2] + q * r2[2]],
          ];
        } else {
          rows = [r1, [r2[0] + p * r1[0], r2[1] + p * r1[1], r2[2] + p * r1[2]], [p, rng.int(-3, 3), r1[2] * p + rng.int(1, 3)]];
        }
        const det =
          rows[0][0] * (rows[1][1] * rows[2][2] - rows[1][2] * rows[2][1]) -
          rows[0][1] * (rows[1][0] * rows[2][2] - rows[1][2] * rows[2][0]) +
          rows[0][2] * (rows[1][0] * rows[2][1] - rows[1][1] * rows[2][0]);
        const rank = kind === 3 && det === 0 ? 2 : kind;
        return numberProblem({
          prompt: t(
            `Find the rank of $T(\\mathbf{x}) = A\\mathbf{x}$ for $A = ${mat3Latex(rows)}$.`,
            `求 $T(\\mathbf{x}) = A\\mathbf{x}$ 的秩，其中 $A = ${mat3Latex(rows)}$。`,
          ),
          answer: rank,
          wrong: [3, 2, 1, 0],
          solution: t(
            rank === 3
              ? `$\\det A = ${det} \\ne 0$, so the rows are independent and the rank is $3$.`
              : rank === 2
                ? "Row reduction leaves two non-zero rows, since one row is a combination of the other two, so the rank is $2$."
                : "Every row is a multiple of the first, so row reduction leaves one non-zero row and the rank is $1$.",
            rank === 3
              ? `$\\det A = ${det} \\ne 0$，所以各行线性无关，秩为 $3$。`
              : rank === 2
                ? "某一行是另两行的组合，行化简后剩两个非零行，所以秩为 $2$。"
                : "每一行都是第一行的倍数，行化简后只剩一个非零行，所以秩为 $1$。",
          ),
        });
      },
    },
  ],
};

/** imageOfALinearTransformationInTheCartesianPlane covers geometric image in R2. */
export const imageOfALinearTransformationInTheCartesianPlane: TopicDef = {
  id: "image-of-a-linear-transformation-in-the-cartesian-plane",
  title: t("The Image of a Linear Transformation in the Cartesian Plane", "笛卡尔平面上线形变换的像"),
  summary: t(
    "Identify the geometric nature of the image of a linear transformation in the plane as a point, line, or the entire plane.",
    "在笛卡尔平面中将线性变换的像识别为单点、过原点的直线或整个平面。",
  ),
  prerequisites: ["image-and-rank-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "geometric-image-in-plane",
      title: t("Geometric Image in the Plane", "平面中的几何像空间"),
      explanation: t(
        "Determine whether the image of a 2D linear transformation is the origin, a line, or the entire plane $\\mathbb{R}^2$.",
        "判定二维线性变换的像空间是原点、一条直线还是整个平面 $\\mathbb{R}^2$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const k = rng.pick([-3, -2, 2, 3])!;
        const mat: Mat2 = [
          [a, k * a],
          [b, k * b],
        ];
        const prompt = t(
          `Let $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ have standard matrix $A = ${mat2Latex(mat)}$. Which geometric object describes the image $\\operatorname{im}(T)$ in the Cartesian plane?`,
          `设线性变换 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 的标准矩阵为 $A = ${mat2Latex(mat)}$。在笛卡尔平面中，哪个几何对象描述了像空间 $\\operatorname{im}(T)$？`,
        );
        const right = t(
          `The line through the origin in the direction of the vector $${vec2Latex([a, b])}$`,
          `过原点且沿向量 $${vec2Latex([a, b])}$ 方向的直线`,
        );
        const wrong = [
          t("The entire Cartesian plane $\\mathbb{R}^2$", "整个笛卡尔平面 $\\mathbb{R}^2$"),
          t("The single point consisting of the origin $\\{(0, 0)\\}$", "仅由原点构成的单点集 $\\{(0, 0)\\}$"),
          t(`The line with equation $x + y = ${a + b}$`, `方程为 $x + y = ${a + b}$ 的直线`),
          t(
            `The line perpendicular to the vector $${vec2Latex([a, b])}$ not passing through the origin`,
            `不经过原点且垂直于向量 $${vec2Latex([a, b])}$ 的直线`,
          ),
        ];
        const solution = t(
          `The columns of $A$ are $${vec2Latex([a, b])}$ and $${k} ${vec2Latex([a, b])}$. Since the second column is a scalar multiple of the first, the column space is 1-dimensional, which is a line through the origin in the direction of $${vec2Latex([a, b])}$.`,
          `矩阵 $A$ 的列向量为 $${vec2Latex([a, b])}$ 和 $${k} ${vec2Latex([a, b])}$。因为第二列是第一列的倍数，所以列空间是一维的，即过原点且沿向量 $${vec2Latex([a, b])}$ 方向的直线。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "testing-membership-in-a-line-image",
      title: t("Testing membership in the image of a rank-one map", "判断向量是否在秩一映射的像中"),
      explanation: t(
        "When the standard matrix of $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ has rank $1$, both columns are multiples of one non-zero vector $\\mathbf{u}$, and the image is the line through the origin spanned by $\\mathbf{u}$. A vector $(p, q)$ lies on that line exactly when it is parallel to $\\mathbf{u} = (u_1, u_2)$, that is when $p\\,u_2 - q\\,u_1 = 0$.",
        "当 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 的标准矩阵秩为 $1$ 时，两列都是某个非零向量 $\\mathbf{u}$ 的倍数，像是由 $\\mathbf{u}$ 张成的过原点的直线。向量 $(p, q)$ 在这条直线上当且仅当它与 $\\mathbf{u} = (u_1, u_2)$ 平行，即 $p\\,u_2 - q\\,u_1 = 0$。",
      ),
      generate(rng: Rng): Problem {
        const u1 = rng.int(1, 4) * rng.pick([-1, 1]);
        const u2 = rng.int(-4, 4) || 3;
        const s = rng.int(1, 3);
        const tt = rng.int(-3, 3) || 2;
        const A: Mat2 = [
          [s * u1, tt * u1],
          [s * u2, tt * u2],
        ];
        const m = rng.int(-3, 3) || 2;
        const inside = rng.int(0, 1) === 0;
        const p = m * u1;
        const q = m * u2 + (inside ? 0 : rng.pick([-1, 1]));
        const cross = p * u2 - q * u1;
        return choiceProblem({
          prompt: t(
            `Let $T$ have standard matrix $A = ${mat2Latex(A)}$. Is $${vec2Latex([p, q])}$ in the image of $T$?`,
            `设 $T$ 的标准矩阵为 $A = ${mat2Latex(A)}$。$${vec2Latex([p, q])}$ 是否在 $T$ 的像中？`,
          ),
          options: yesNo,
          correct: inside ? 0 : 1,
          solution: t(
            `The image is the line spanned by $${vec2Latex([u1, u2])}$. Here $${p} \\cdot ${paren(u2)} - ${paren(q)} \\cdot ${paren(u1)} = ${cross}$, so the vector ${inside ? "is" : "is not"} on that line.`,
            `像是由 $${vec2Latex([u1, u2])}$ 张成的直线。这里 $${p} \\cdot ${paren(u2)} - ${paren(q)} \\cdot ${paren(u1)} = ${cross}$，所以该向量${inside ? "在" : "不在"}这条直线上。`,
          ),
        });
      },
    },
  ],
};

/** invertibleMatrixTheoremInTermsOfLinearTransformations connects invertibility with injectivity and surjectivity. */
export const invertibleMatrixTheoremInTermsOfLinearTransformations: TopicDef = {
  id: "invertible-matrix-theorem-in-terms-of-linear-transformations",
  title: t("The Invertible Matrix Theorem in Terms of Linear Transformations", "线性变换视角的逆矩阵定理"),
  summary: t(
    "Apply the Invertible Matrix Theorem to linear transformations, connecting invertibility, trivial kernel, and full image.",
    "应用线性变换视角的逆矩阵定理，联系可逆性、零核与满射像空间。",
  ),
  prerequisites: ["image-of-a-linear-transformation-in-the-cartesian-plane"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "invertibility-equivalences-for-transformations",
      title: t("Invertibility Equivalences for Transformations", "线性变换可逆性的等价条件"),
      explanation: t(
        "Identify equivalent conditions for an operator on $\\mathbb{R}^n$ to be invertible: one-to-one, onto, and $\\ker(T) = \\{\\mathbf{0}\\}$.",
        "识别 $\\mathbb{R}^n$ 上线性变换可逆的等价条件：单射、满射及 $\\ker(T) = \\{\\mathbf{0}\\}$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(-4, 4);
        const b = rng.nonZero(-4, 4);
        const c = rng.nonZero(-4, 4);
        const d = rng.int(-4, 4);
        const det = a * d - b * c;
        const isInvertible = det !== 0;
        const mat: Mat2 = [
          [a, b],
          [c, d],
        ];
        const prompt = t(
          `Let $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ be the linear transformation with standard matrix $A = ${mat2Latex(mat)}$. According to the Invertible Matrix Theorem, what can be concluded about $T$?`,
          `设 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 为标准矩阵为 $A = ${mat2Latex(mat)}$ 的线性变换。根据逆矩阵定理，关于 $T$ 可以得出什么结论？`,
        );
        const right = isInvertible
          ? t("$\\det(A) \\neq 0$, so $T$ is invertible, one-to-one, and onto", "$\\det(A) \\neq 0$，因此 $T$ 可逆、是单射且是满射")
          : t(
              "$\\det(A) = 0$, so $T$ is not invertible (neither one-to-one nor onto)",
              "$\\det(A) = 0$，因此 $T$ 不可逆（既非单射亦非满射）",
            );
        const wrong = isInvertible
          ? [
              t("$\\det(A) = 0$, so $T$ is not invertible", "$\\det(A) = 0$，因此 $T$ 不可逆"),
              t("$T$ is one-to-one but not onto", "$T$ 是单射但不是满射"),
              t("$T$ is onto but not one-to-one", "$T$ 是满射但不是单射"),
              t("$\\ker(T) = \\mathbb{R}^2$", "$\\ker(T) = \\mathbb{R}^2$"),
            ]
          : [
              t("$\\det(A) \\neq 0$, so $T$ is invertible, one-to-one, and onto", "$\\det(A) \\neq 0$，因此 $T$ 可逆、是单射且是满射"),
              t("$T$ is one-to-one but not onto", "$T$ 是单射但不是满射"),
              t("$\\ker(T) = \\{0\\}$", "$\\ker(T) = \\{0\\}$"),
              t("$\\operatorname{im}(T) = \\mathbb{R}^2$", "$\\operatorname{im}(T) = \\mathbb{R}^2$"),
            ];
        const solution = isInvertible
          ? t(
              `The determinant is $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det} \\neq 0$. By the Invertible Matrix Theorem, $T$ is invertible, which is equivalent to $T$ being one-to-one ($\\ker(T) = \\{0\\}$) and onto ($\\operatorname{im}(T) = \\mathbb{R}^2$).`,
              `行列式为 $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det} \\neq 0$。根据逆矩阵定理，$T$ 可逆，这等价于 $T$ 是单射（$\\ker(T) = \\{0\\}$）且是满射（$\\operatorname{im}(T) = \\mathbb{R}^2$）。`,
            )
          : t(
              `The determinant is $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det} = 0$. By the Invertible Matrix Theorem, $A$ is singular, so $T$ is not invertible, neither one-to-one nor onto.`,
              `行列式为 $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det} = 0$。根据逆矩阵定理，$A$ 是奇异矩阵，因此 $T$ 不可逆，既不是单射也不是满射。`,
            );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-parameter-that-makes-a-transformation-singular",
      title: t("The parameter that makes a transformation singular", "使变换不可逆的参数值"),
      explanation: t(
        "By the invertible matrix theorem, $T(\\mathbf{x}) = A\\mathbf{x}$ is invertible (one-to-one and onto) exactly when $\\det A \\ne 0$. So $T$ fails to be invertible for the parameter values that make the determinant zero. For $A = \\begin{pmatrix} a & k \\\\ c & d \\end{pmatrix}$, $\\det A = ad - kc = 0$ gives $k = \\frac{ad}{c}$.",
        "由可逆矩阵定理，$T(\\mathbf{x}) = A\\mathbf{x}$ 可逆（既单又满）当且仅当 $\\det A \\ne 0$。所以使行列式为零的参数值使 $T$ 不可逆。对 $A = \\begin{pmatrix} a & k \\\\ c & d \\end{pmatrix}$，由 $\\det A = ad - kc = 0$ 得 $k = \\frac{ad}{c}$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 4) * rng.pick([-1, 1]);
        const a = c * rng.int(1, 3) * rng.pick([-1, 1]);
        const d = rng.int(-4, 4) || 2;
        const k = (a * d) / c;
        return numberProblem({
          prompt: t(
            `For which $k$ is $T(\\mathbf{x}) = A\\mathbf{x}$ not invertible, where $A = \\begin{pmatrix} ${a} & k \\\\ ${c} & ${d} \\end{pmatrix}$?`,
            `$k$ 取何值时 $T(\\mathbf{x}) = A\\mathbf{x}$ 不可逆，其中 $A = \\begin{pmatrix} ${a} & k \\\\ ${c} & ${d} \\end{pmatrix}$？`,
          ),
          answer: k,
          solveFor: "k",
          wrong: [-k, Q.of(c * d, a), a * d],
          solution: t(
            `$\\det A = ${a} \\cdot ${paren(d)} ${c < 0 ? "+" : "-"} ${poly([Math.abs(c), "k"])} = 0$ gives $k = ${k}$. For this $k$, $T$ is neither one-to-one nor onto.`,
            `由 $\\det A = ${a} \\cdot ${paren(d)} ${c < 0 ? "+" : "-"} ${poly([Math.abs(c), "k"])} = 0$ 得 $k = ${k}$。此时 $T$ 既不是单射也不是满射。`,
          ),
        });
      },
    },
  ],
};

/** rankNullityTheoremInTermsOfLinearTransformations applies rank-nullity to transformations. */
export const rankNullityTheoremInTermsOfLinearTransformations: TopicDef = {
  id: "rank-nullity-theorem-in-terms-of-linear-transformations",
  title: t("The Rank-Nullity Theorem in Terms of Linear Transformations", "线性变换视角的秩-零度定理"),
  summary: t(
    "Apply the Rank-Nullity Theorem to find the rank or nullity of a linear map from the dimension of its domain.",
    "应用秩-零度定理，通过定义域的维数求解线性映射的秩或零度。",
  ),
  prerequisites: ["invertible-matrix-theorem-in-terms-of-linear-transformations"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "calculating-via-rank-nullity-theorem",
      title: t("Calculating via Rank-Nullity Theorem", "利用秩-零度定理计算"),
      explanation: t(
        "The dimension of the domain is shared between the vectors sent to zero and the dimension of the image, so knowing two of the three numbers gives the third. For a linear transformation $T: V \\to W$, compute $\\operatorname{rank}(T) = \\dim(V) - \\operatorname{nullity}(T)$.",
        "定义域的维数分成被映射到零的部分和像的维数两部分，所以知道三个数中的两个就能求出第三个。对线性变换 $T: V \\to W$，利用 $\\operatorname{rank}(T) = \\dim(V) - \\operatorname{nullity}(T)$ 计算其秩。",
      ),
      generate: (rng: Rng): Problem => {
        const dimV = rng.int(4, 9);
        const dimW = rng.int(3, 8);
        const nullity = rng.int(1, dimV - 1);
        const rank = dimV - nullity;
        const prompt = t(
          `Let $T: \\mathbb{R}^${dimV} \\to \\mathbb{R}^${dimW}$ be a linear transformation. If $\\dim(\\ker(T)) = ${nullity}$, what is the rank of $T$ (that is, $\\dim(\\operatorname{im}(T))$)?`,
          `设 $T: \\mathbb{R}^${dimV} \\to \\mathbb{R}^${dimW}$ 为线性变换。若 $\\dim(\\ker(T)) = ${nullity}$，求 $T$ 的秩（即 $\\dim(\\operatorname{im}(T))$）。`,
        );
        const solution = t(
          `By the Rank-Nullity Theorem, $\\dim(V) = \\dim(\\ker(T)) + \\dim(\\operatorname{im}(T))$. Therefore, $\\operatorname{rank}(T) = ${dimV} - ${nullity} = ${rank}$.`,
          `由秩-零度定理，$\\dim(V) = \\dim(\\ker(T)) + \\dim(\\operatorname{im}(T))$。因此，$\\operatorname{rank}(T) = ${dimV} - ${nullity} = ${rank}$。`,
        );
        return numberProblem({
          prompt,
          answer: rank,
          solution,
          wrong: [dimV, dimW, nullity, dimV + nullity].filter((w) => w !== rank),
        });
      },
    },
    {
      id: "rank-and-nullity-of-differentiation",
      title: t("Rank and nullity of differentiation", "求导映射的秩与零化度"),
      explanation: t(
        "The rank-nullity theorem says $\\operatorname{rank}(T) + \\dim\\ker(T) = \\dim V$ for $T: V \\to W$. The space $P_n$ of polynomials of degree at most $n$ has dimension $n + 1$. The map $T(p) = p^{(k)}$, the $k$-th derivative, kills exactly the polynomials of degree less than $k$, so $\\dim\\ker(T) = k$ and the rank is $n + 1 - k$.",
        "秩–零化度定理指出，对 $T: V \\to W$ 有 $\\operatorname{rank}(T) + \\dim\\ker(T) = \\dim V$。次数不超过 $n$ 的多项式空间 $P_n$ 的维数为 $n + 1$。映射 $T(p) = p^{(k)}$（$k$ 阶导数）恰好把次数小于 $k$ 的多项式变为零，所以 $\\dim\\ker(T) = k$，秩为 $n + 1 - k$。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(2, 9);
        const k = rng.int(1, Math.min(4, n));
        const wantRank = rng.int(0, 1) === 0;
        const ans = wantRank ? n + 1 - k : k;
        const d = k === 1 ? "p'" : k === 2 ? "p''" : k === 3 ? "p'''" : `p^{(${k})}`;
        return numberProblem({
          prompt: t(
            `Let $T: P_{${n}} \\to P_{${n}}$ be $T(p) = ${d}$. Find ${wantRank ? "the rank of $T$" : "$\\dim\\ker(T)$"}.`,
            `设 $T: P_{${n}} \\to P_{${n}}$，$T(p) = ${d}$。求${wantRank ? " $T$ 的秩" : " $\\dim\\ker(T)$"}。`,
          ),
          answer: ans,
          wrong: [wantRank ? n - k : k - 1, wantRank ? n + 1 : n + 1 - k, n],
          solution: t(
            `$\\dim P_{${n}} = ${n + 1}$. The kernel is the polynomials of degree less than $${k}$, of dimension $${k}$, so the rank is $${n + 1} - ${k} = ${n + 1 - k}$.`,
            `$\\dim P_{${n}} = ${n + 1}$。核由次数小于 $${k}$ 的多项式组成，维数为 $${k}$，所以秩为 $${n + 1} - ${k} = ${n + 1 - k}$。`,
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 4.15: LINEAR MAPS AND THEIR MATRIX REPRESENTATIONS
// ════════════════════════════════════════════════════════════════════════════

/** matrixOfALinearTransformationRelativeToABasis finds matrix representation relative to a single basis. */
export const matrixOfALinearTransformationRelativeToABasis: TopicDef = {
  id: "matrix-of-a-linear-transformation-relative-to-a-basis",
  title: t("The Matrix of a Linear Transformation Relative to a Basis", "线性变换关于基的矩阵"),
  summary: t(
    "Compute the matrix $[T]_{\\mathcal{B}}$ of a linear transformation relative to a given basis $\\mathcal{B}$.",
    "计算线性变换关于给定基 $\\mathcal{B}$ 的矩阵 $[T]_{\\mathcal{B}}$。",
  ),
  prerequisites: ["rank-nullity-theorem-in-terms-of-linear-transformations"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "matrix-relative-to-basis-computation",
      title: t("Matrix Relative to a Basis Computation", "计算关于基的矩阵"),
      explanation: t(
        "To build the matrix, apply the transformation to each basis vector, write the result in coordinates, and use those coordinates as the columns. Form the matrix $[T]_B$ whose columns are the coordinate vectors $[T(\\mathbf{b}_j)]_B$.",
        "构造矩阵时，把变换作用在每个基向量上，把结果写成坐标，再用这些坐标作为矩阵的列。构造各列为坐标向量 $[T(\\mathbf{b}_j)]_B$ 的矩阵 $[T]_B$。",
      ),
      generate: (rng: Rng): Problem => {
        const c1 = rng.int(-5, 5);
        const c2 = rng.pick([-4, -3, -2, 2, 3, 4])!;
        const d1 = rng.int(-5, 5);
        const d2 = rng.pick([-4, -3, -2, 2, 3, 4])!;
        const expr1 = formatLinearComb2(c1, "b_1", c2, "b_2");
        const expr2 = formatLinearComb2(d1, "b_1", d2, "b_2");
        const prompt = t(
          `Let $B = \\{b_1, b_2\\}$ be a basis of $\\mathbb{R}^2$, and let $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ be a linear transformation satisfying $T(b_1) = ${expr1}$ and $T(b_2) = ${expr2}$. What is the matrix representation $[T]_B$?`,
          `设 $B = \\{b_1, b_2\\}$ 为 $\\mathbb{R}^2$ 的一组基，线性变换 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 满足 $T(b_1) = ${expr1}$ 且 $T(b_2) = ${expr2}$。求 $T$ 关于基 $B$ 的矩阵表示 $[T]_B$。`,
        );
        const right = t(
          `$${mat2Latex([
            [c1, d1],
            [c2, d2],
          ])}$`,
          `$${mat2Latex([
            [c1, d1],
            [c2, d2],
          ])}$`,
        );
        const wrong = [
          t(
            `$${mat2Latex([
              [c1, c2],
              [d1, d2],
            ])}$`,
            `$${mat2Latex([
              [c1, c2],
              [d1, d2],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [d1, c1],
              [d2, c2],
            ])}$`,
            `$${mat2Latex([
              [d1, c1],
              [d2, c2],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [c2, d2],
              [c1, d1],
            ])}$`,
            `$${mat2Latex([
              [c2, d2],
              [c1, d1],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [d2, d1],
              [c2, c1],
            ])}$`,
            `$${mat2Latex([
              [d2, d1],
              [c2, c1],
            ])}$`,
          ),
        ];
        const solution = t(
          `The columns of $[T]_B$ are the coordinate vectors of $T(b_1)$ and $T(b_2)$ with respect to $B$: $[T(b_1)]_B = ${vec2Latex([c1, c2])}$ and $[T(b_2)]_B = ${vec2Latex([d1, d2])}$. Thus, $[T]_B = ${mat2Latex(
            [
              [c1, d1],
              [c2, d2],
            ],
          )}$.`,
          `矩阵 $[T]_B$ 的列向量为 $T(b_1)$ 与 $T(b_2)$ 关于基 $B$ 的坐标向量：$[T(b_1)]_B = ${vec2Latex([c1, c2])}$ 且 $[T(b_2)]_B = ${vec2Latex([d1, d2])}$。因此 $[T]_B = ${mat2Latex(
            [
              [c1, d1],
              [c2, d2],
            ],
          )}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "changing-a-standard-matrix-to-a-basis",
      title: t("Changing a standard matrix to a basis", "把标准矩阵换到另一组基下"),
      explanation: t(
        "If $T(\\mathbf{x}) = A\\mathbf{x}$ and $P$ has the basis vectors $b_1, b_2$ as columns, the matrix of $T$ relative to $B$ is\n\n$$[T]_B = P^{-1}AP.$$\n\nThe product $AP$ applies $T$ to each basis vector, and $P^{-1}$ rewrites the results in $B$-coordinates. For $P = \\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$, $P^{-1} = \\begin{pmatrix} 1 & -k \\\\ 0 & 1 \\end{pmatrix}$.",
        "若 $T(\\mathbf{x}) = A\\mathbf{x}$，且 $P$ 以基向量 $b_1, b_2$ 为列，则 $T$ 关于 $B$ 的矩阵为\n\n$$[T]_B = P^{-1}AP.$$\n\n乘积 $AP$ 把 $T$ 作用于每个基向量，$P^{-1}$ 再把结果写成 $B$ 坐标。对 $P = \\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$，$P^{-1} = \\begin{pmatrix} 1 & -k \\\\ 0 & 1 \\end{pmatrix}$。",
      ),
      generate(rng: Rng): Problem {
        const A: Mat2 = [
          [rng.int(-4, 4), rng.int(-4, 4)],
          [rng.int(-4, 4), rng.int(-4, 4)],
        ];
        const k = rng.int(1, 3) * rng.pick([-1, 1]);
        const P: Mat2 = [
          [1, k],
          [0, 1],
        ];
        const Pinv: Mat2 = [
          [1, -k],
          [0, 1],
        ];
        const AP = mul2(A, P);
        const M = mul2(Pinv, AP);
        const i = rng.int(0, 1);
        const j = rng.int(0, 1);
        const pos = ["1", "2"];
        return numberProblem({
          prompt: t(
            `Let $T(\\mathbf{x}) = A\\mathbf{x}$ with $A = ${mat2Latex(A)}$, and let $B = \\left\\{${vec2Latex([1, 0])}, ${vec2Latex([k, 1])}\\right\\}$. Find the $(${pos[i]}, ${pos[j]})$ entry of $[T]_B$.`,
            `设 $T(\\mathbf{x}) = A\\mathbf{x}$，$A = ${mat2Latex(A)}$，$B = \\left\\{${vec2Latex([1, 0])}, ${vec2Latex([k, 1])}\\right\\}$。求 $[T]_B$ 的 $(${pos[i]}, ${pos[j]})$ 元。`,
          ),
          answer: M[i]![j]!,
          wrong: [AP[i]![j]!, mul2(P, mul2(A, Pinv))[i]![j]!, A[i]![j]!],
          solution: t(
            `$AP = ${mat2Latex(AP)}$ and $[T]_B = P^{-1}AP = ${mat2Latex(M)}$, so the entry is $${M[i]![j]!}$.`,
            `$AP = ${mat2Latex(AP)}$，$[T]_B = P^{-1}AP = ${mat2Latex(M)}$，所以该元为 $${M[i]![j]!}$。`,
          ),
        });
      },
    },
  ],
};

/** connectionsBetweenMatrixRepresentationsOfALinearTransformation covers similarity under change of basis. */
export const connectionsBetweenMatrixRepresentationsOfALinearTransformation: TopicDef = {
  id: "connections-between-matrix-representations-of-a-linear-transformation",
  title: t("Connections Between Matrix Representations of a Linear Transformation", "线性变换不同矩阵表示之间的联系"),
  summary: t(
    "Relate matrix representations of a linear transformation under different bases using similarity transformations.",
    "通过相似变换联系线性变换在不同基下的矩阵表示。",
  ),
  prerequisites: ["matrix-of-a-linear-transformation-relative-to-a-basis"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "similarity-under-change-of-basis",
      title: t("Similarity Under Change of Basis", "基变换下的相似关系"),
      explanation: t(
        "The two matrices describe the same transformation in different coordinates, so converting coordinates before and after relates them by a similarity. Apply the formula $[T]_C = P^{-1} [T]_B P$, where $P$ is the change-of-basis matrix from $C$ to $B$.",
        "两个矩阵在不同坐标下描述同一个变换，所以在变换前后转换坐标，就把它们用相似关系联系起来。应用公式 $[T]_C = P^{-1} [T]_B P$，其中 $P$ 为从基 $C$ 到基 $B$ 的过渡矩阵。",
      ),
      generate: (rng: Rng): Problem => {
        const trace = rng.int(-8, 8);
        const det = rng.int(-9, 9);
        const askTrace = rng.bool();
        if (askTrace) {
          const prompt = t(
            `Let $B$ and $C$ be two bases of a vector space $V$, and let $P$ be the change-of-basis matrix from $C$ to $B$. If the matrix of a linear operator $T$ relative to $B$ has trace $\\operatorname{tr}([T]_B) = ${trace}$ and determinant $\\det([T]_B) = ${det}$, what is the trace $\\operatorname{tr}([T]_C)$?`,
            `设 $B$ 与 $C$ 为向量空间 $V$ 的两组基，且 $P$ 为从基 $C$ 到基 $B$ 的过渡矩阵。若线性算子 $T$ 关于基 $B$ 的矩阵的迹为 $\\operatorname{tr}([T]_B) = ${trace}$ 且行列式为 $\\det([T]_B) = ${det}$，求 $\\operatorname{tr}([T]_C)$。`,
          );
          const solution = t(
            `The matrices $[T]_B$ and $[T]_C$ are similar via $[T]_C = P^{-1} [T]_B P$. Since similar matrices share the same characteristic polynomial, the trace is invariant under change of basis. Thus, $\\operatorname{tr}([T]_C) = \\operatorname{tr}([T]_B) = ${trace}$.`,
            `矩阵 $[T]_B$ 与 $[T]_C$ 满足相似关系 $[T]_C = P^{-1} [T]_B P$。因为相似矩阵具有相同的特征多项式，所以迹在基变换下保持不变。故 $\\operatorname{tr}([T]_C) = \\operatorname{tr}([T]_B) = ${trace}$。`,
          );
          return numberProblem({
            prompt,
            answer: trace,
            solution,
            wrong: [-trace, det, 0, trace + 1].filter((w) => w !== trace),
          });
        }
        const prompt = t(
          `Let $B$ and $C$ be two bases of a vector space $V$, and let $P$ be the change-of-basis matrix from $C$ to $B$. If the matrix of a linear operator $T$ relative to $B$ has trace $\\operatorname{tr}([T]_B) = ${trace}$ and determinant $\\det([T]_B) = ${det}$, what is the determinant $\\det([T]_C)$?`,
          `设 $B$ 与 $C$ 为向量空间 $V$ 的两组基，且 $P$ 为从基 $C$ 到基 $B$ 的过渡矩阵。若线性算子 $T$ 关于基 $B$ 的矩阵的迹为 $\\operatorname{tr}([T]_B) = ${trace}$ 且行列式为 $\\det([T]_B) = ${det}$，求 $\\det([T]_C)$。`,
        );
        const solution = t(
          `The matrices $[T]_B$ and $[T]_C$ are similar via $[T]_C = P^{-1} [T]_B P$. Since similar matrices share the same characteristic polynomial, the determinant is invariant under change of basis. Thus, $\\det([T]_C) = \\det([T]_B) = ${det}$.`,
          `矩阵 $[T]_B$ 与 $[T]_C$ 满足相似关系 $[T]_C = P^{-1} [T]_B P$。因为相似矩阵具有相同的特征多项式，所以行列式在基变换下保持不变。故 $\\det([T]_C) = \\det([T]_B) = ${det}$。`,
        );
        return numberProblem({
          prompt,
          answer: det,
          solution,
          wrong: [-det, trace, 1, det + 1].filter((w) => w !== det),
        });
      },
    },
    {
      id: "invariants-shared-by-similar-representations",
      title: t("Invariants shared by similar representations", "相似表示共有的不变量"),
      explanation: t(
        "Two matrices of the same operator relative to different bases are similar: $[T]_C = P^{-1}[T]_B P$. Similar matrices have the same trace, determinant and eigenvalues, and so do their powers, since $[T]_C^2 = P^{-1}[T]_B^2 P$. So $\\operatorname{tr}([T]_C^2)$ can be computed from $[T]_B$ without knowing $P$.",
        "同一算子关于不同基的两个矩阵是相似的：$[T]_C = P^{-1}[T]_B P$。相似矩阵有相同的迹、行列式和特征值，它们的幂也是如此，因为 $[T]_C^2 = P^{-1}[T]_B^2 P$。所以无需知道 $P$ 就能由 $[T]_B$ 算出 $\\operatorname{tr}([T]_C^2)$。",
      ),
      generate(rng: Rng): Problem {
        const M: Mat2 = [
          [rng.int(-4, 4), rng.int(-4, 4) || 1],
          [rng.int(-4, 4), rng.int(-4, 4)],
        ];
        const M2 = mul2(M, M);
        const ans = M2[0][0] + M2[1][1];
        const tr = M[0][0] + M[1][1];
        return numberProblem({
          prompt: t(
            `The matrix of an operator $T$ relative to a basis $B$ is $[T]_B = ${mat2Latex(M)}$. Find $\\operatorname{tr}\\left([T]_C^2\\right)$ for another basis $C$.`,
            `算子 $T$ 关于基 $B$ 的矩阵为 $[T]_B = ${mat2Latex(M)}$。对另一组基 $C$，求 $\\operatorname{tr}\\left([T]_C^2\\right)$。`,
          ),
          answer: ans,
          wrong: [tr * tr, M[0][0] ** 2 + M[1][1] ** 2, tr],
          solution: t(
            `$[T]_C^2$ is similar to $[T]_B^2 = ${mat2Latex(M2)}$, so its trace is $${M2[0][0]} + ${paren(M2[1][1])} = ${ans}$.`,
            `$[T]_C^2$ 与 $[T]_B^2 = ${mat2Latex(M2)}$ 相似，所以其迹为 $${M2[0][0]} + ${paren(M2[1][1])} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** linearMapsBetweenTwoDifferentVectorSpaces covers linear maps between different spaces. */
export const linearMapsBetweenTwoDifferentVectorSpaces: TopicDef = {
  id: "linear-maps-between-two-different-vector-spaces",
  title: t("Linear Maps Between Two Different Vector Spaces", "不同向量空间之间的线性映射"),
  summary: t(
    "Evaluate and analyze linear maps between distinct vector spaces, such as polynomial and coordinate spaces.",
    "求值并分析不同向量空间之间的线性映射，如多项式空间与坐标空间之间的映射。",
  ),
  prerequisites: ["connections-between-matrix-representations-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "evaluating-maps-between-distinct-spaces",
      title: t("Evaluating Maps Between Distinct Spaces", "在不同空间之间求值线性映射"),
      explanation: t(
        "A linear transformation can take inputs from one kind of space, such as polynomials, and produce outputs in another, so apply its rule directly to the given input. Evaluate linear transformations from $\\mathbb{P}_2$ to $\\mathbb{R}^2$ or between other distinct spaces.",
        "线性变换可以从一种空间（例如多项式空间）取输入，在另一种空间中给出输出，所以直接把它的规则用于给定的输入。求从 $\\mathbb{P}_2$ 到 $\\mathbb{R}^2$ 等不同空间之间的线性映射的值。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(1, 3);
        const b = rng.int(-2, 2);
        const c = rng.int(1, 4);
        const d = rng.int(-3, 3);
        const e = rng.int(-4, 4);
        // p(x) = c x^2 + d x + e
        // T(p) = (p(a), p'(b))^T
        // p(a) = c * a^2 + d * a + e
        // p'(b) = 2 * c * b + d
        const val1 = c * a * a + d * a + e;
        const val2 = 2 * c * b + d;
        const polyStr = formatPoly2(c, d, e);
        const prompt = t(
          `Let $T: P_2 \\to \\mathbb{R}^2$ be the linear map defined by $T(p) = \\begin{pmatrix} p(${a}) \\\\ p'(${b}) \\end{pmatrix}$. For the polynomial $p(x) = ${polyStr}$, find the vector $T(p) = \\langle y_1, y_2 \\rangle$.`,
          `设 $T: P_2 \\to \\mathbb{R}^2$ 为由 $T(p) = \\begin{pmatrix} p(${a}) \\\\ p'(${b}) \\end{pmatrix}$ 定义的线性映射。对于多项式 $p(x) = ${polyStr}$，求向量 $T(p) = \\langle y_1, y_2 \\rangle$。`,
        );
        const dEval = d === 0 ? "" : d > 0 ? ` + ${d}(${a})` : ` - ${-d}(${a})`;
        const eEval = e === 0 ? "" : e > 0 ? ` + ${e}` : ` - ${-e}`;
        const dPrime = d === 0 ? "" : d > 0 ? ` + ${d}` : ` - ${-d}`;
        const solution = t(
          `Evaluate $p(${a}) = ${c}(${a})^2${dEval}${eEval} = ${val1}$ and $p'(x) = ${2 * c}x${dPrime}$, so $p'(${b}) = ${2 * c}(${b})${dPrime} = ${val2}$. Thus, $T(p) = \\langle ${val1}, ${val2} \\rangle$.`,
          `求值 $p(${a}) = ${c}(${a})^2${dEval}${eEval} = ${val1}$，而导数为 $p'(x) = ${2 * c}x${dPrime}$，故 $p'(${b}) = ${2 * c}(${b})${dPrime} = ${val2}$。因此 $T(p) = \\langle ${val1}, ${val2} \\rangle$。`,
        );
        return pointProblem({
          prompt,
          answer: [val1, val2],
          vector: true,
          solution,
          wrong: [
            [val2, val1],
            [val1 + 1, val2],
            [val1, val2 - 2],
            [-val1, val2],
          ],
        });
      },
    },
    {
      id: "an-integral-map-from-polynomials-to-numbers",
      title: t("An integral map from polynomials to numbers", "从多项式到数的积分映射"),
      explanation: t(
        "A linear map can go between spaces of different kinds. The map $T: P_2 \\to \\mathbb{R}$, $T(p) = \\int_0^k p(x)\\,dx$, is linear because integrals respect sums and constant multiples. To evaluate it on $p(x) = ax^2 + bx + c$, integrate term by term:\n\n$$T(p) = \\frac{a k^3}{3} + \\frac{b k^2}{2} + ck.$$",
        "线性映射可以在不同种类的空间之间进行。映射 $T: P_2 \\to \\mathbb{R}$，$T(p) = \\int_0^k p(x)\\,dx$ 是线性的，因为积分保持和与常数倍。要在 $p(x) = ax^2 + bx + c$ 上求值，逐项积分：\n\n$$T(p) = \\frac{a k^3}{3} + \\frac{b k^2}{2} + ck.$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-4, 4) || 3;
        const b = rng.int(-5, 5);
        const c = rng.int(-5, 5);
        const k = rng.int(1, 3);
        const ans = Q.of(a * k ** 3, 3)
          .add(Q.of(b * k * k, 2))
          .add(Q.of(c * k));
        return numberProblem({
          prompt: t(
            `Let $T: P_2 \\to \\mathbb{R}$ be $T(p) = \\int_0^{${k}} p(x)\\,dx$. Find $T(p)$ for $p(x) = ${formatPoly2(a, b, c)}$.`,
            `设 $T: P_2 \\to \\mathbb{R}$，$T(p) = \\int_0^{${k}} p(x)\\,dx$。对 $p(x) = ${formatPoly2(a, b, c)}$ 求 $T(p)$。`,
          ),
          answer: ans,
          wrong: [Q.of(a * k * k + b * k + c), Q.of(a * k ** 3 + b * k * k + c * k), Q.of(2 * a * k + b)],
          solution: t(
            `$T(p) = \\frac{${a} \\cdot ${k ** 3}}{3} + \\frac{${b} \\cdot ${k * k}}{2} + ${paren(c)} \\cdot ${k} = ${ans.toLatex()}$.`,
            `$T(p) = \\frac{${a} \\cdot ${k ** 3}}{3} + \\frac{${b} \\cdot ${k * k}}{2} + ${paren(c)} \\cdot ${k} = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** matrixOfALinearMapRelativeToTwoBases finds matrix representation relative to domain and codomain bases. */
export const matrixOfALinearMapRelativeToTwoBases: TopicDef = {
  id: "matrix-of-a-linear-map-relative-to-two-bases",
  title: t("The Matrix of a Linear Map Relative to Two Bases", "线性映射关于两组基的矩阵"),
  summary: t(
    "Find the matrix representation of a linear map T: V -> W relative to a basis B of V and a basis C of W.",
    "求线性映射 T: V -> W 关于 V 的基 B 与 W 的基 C 的矩阵表示。",
  ),
  prerequisites: ["linear-maps-between-two-different-vector-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "matrix-with-two-bases-computation",
      title: t("Matrix with Two Bases Computation", "双基矩阵表示的计算"),
      explanation: t(
        "When the domain and codomain have different bases, apply the transformation to each input basis vector and write each result in coordinates of the output basis. Construct $[T]_{C \\leftarrow B}$, whose columns are the $C$-coordinate vectors of the images of the $B$-basis vectors.",
        "当定义域和值域用不同的基时，把变换作用在每个输入基向量上，再把每个结果写成输出基下的坐标。构造矩阵 $[T]_{C \\leftarrow B}$，其各列为基 $B$ 中向量的像在基 $C$ 下的坐标向量。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(2, 6);
        const b = rng.pick([-5, -4, -3, 3, 4, 5])!;
        // T: P_2 -> P_1 defined by T(p) = a * p' + b * p(0)
        // Basis B = {1, x, x^2}, C = {1, x}
        // T(1) = a(0) + b(1) = b = b*1 + 0*x
        // T(x) = a(1) + b(0) = a = a*1 + 0*x
        // T(x^2) = a(2x) + b(0) = 2a*x = 0*1 + (2a)*x
        // Matrix:
        // [ b  a  0 ]
        // [ 0  0  2a]
        const mLatex = `\\begin{pmatrix} ${b} & ${a} & 0 \\\\ 0 & 0 & ${2 * a} \\end{pmatrix}`;
        const bTerm = b >= 0 ? `+ ${b}` : `- ${-b}`;
        const prompt = t(
          `Let $T: P_2 \\to P_1$ be the linear map defined by $T(p) = ${a} p'(x) ${bTerm} p(0)$. Let $B = \\{1, x, x^2\\}$ be the standard basis of $P_2$ and $C = \\{1, x\\}$ be the standard basis of $P_1$. Find the matrix $[T]_{C \\leftarrow B}$.`,
          `设 $T: P_2 \\to P_1$ 为由 $T(p) = ${a} p'(x) ${bTerm} p(0)$ 定义的线性映射。设 $B = \\{1, x, x^2\\}$ 为 $P_2$ 的标准基，$C = \\{1, x\\}$ 为 $P_1$ 的标准基。求矩阵 $[T]_{C \\leftarrow B}$。`,
        );
        const right = t(`$${mLatex}$`, `$${mLatex}$`);
        const wrong = [
          t(
            `$\\begin{pmatrix} ${a} & ${b} & 0 \\\\ 0 & 0 & ${2 * a} \\end{pmatrix}$`,
            `$\\begin{pmatrix} ${a} & ${b} & 0 \\\\ 0 & 0 & ${2 * a} \\end{pmatrix}$`,
          ),
          t(
            `$\\begin{pmatrix} ${b} & 0 \\\\ ${a} & 0 \\\\ 0 & ${2 * a} \\end{pmatrix}$`,
            `$\\begin{pmatrix} ${b} & 0 \\\\ ${a} & 0 \\\\ 0 & ${2 * a} \\end{pmatrix}$`,
          ),
          t(
            `$\\begin{pmatrix} ${b} & ${a} & 0 \\\\ 0 & ${2 * a} & 0 \\end{pmatrix}$`,
            `$\\begin{pmatrix} ${b} & ${a} & 0 \\\\ 0 & ${2 * a} & 0 \\end{pmatrix}$`,
          ),
          t(
            `$\\begin{pmatrix} 0 & ${a} & ${b} \\\\ ${2 * a} & 0 & 0 \\end{pmatrix}$`,
            `$\\begin{pmatrix} 0 & ${a} & ${b} \\\\ ${2 * a} & 0 & 0 \\end{pmatrix}$`,
          ),
        ];
        const solution = t(
          `We compute the images of the basis vectors in $B$ and express them in basis $C$: $T(1) = ${b}$ with coordinates $\\begin{pmatrix} ${b} \\\\ 0 \\end{pmatrix}$, $T(x) = ${a}$ with coordinates $\\begin{pmatrix} ${a} \\\\ 0 \\end{pmatrix}$, and $T(x^2) = ${2 * a}x$ with coordinates $\\begin{pmatrix} 0 \\\\ ${2 * a} \\end{pmatrix}$. Arranging these coordinate vectors as columns yields $[T]_{C \\leftarrow B} = ${mLatex}$.`,
          `计算基 $B$ 中各基向量在基 $C$ 下的坐标：$T(1) = ${b}$ 的坐标为 $\\begin{pmatrix} ${b} \\\\ 0 \\end{pmatrix}$，$T(x) = ${a}$ 的坐标为 $\\begin{pmatrix} ${a} \\\\ 0 \\end{pmatrix}$，$T(x^2) = ${2 * a}x$ 的坐标为 $\\begin{pmatrix} 0 \\\\ ${2 * a} \\end{pmatrix}$。将各坐标向量按列排列，得到 $[T]_{C \\leftarrow B} = ${mLatex}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-matrix-of-multiplication-by-a-linear-factor",
      title: t("The matrix of multiplication by a linear factor", "乘以一次因式的映射的矩阵"),
      explanation: t(
        "To find $[T]_{C \\leftarrow B}$, apply $T$ to each vector of $B$ and write the result in $C$-coordinates; these coordinate vectors are the columns. For $T: P_1 \\to P_2$, $T(p) = (ax + k)p(x)$, with $B = \\{1, x\\}$ and $C = \\{1, x, x^2\\}$:\n\n$$T(1) = k + ax, \\qquad T(x) = kx + ax^2,$$\n\nso the columns are $(k, a, 0)$ and $(0, k, a)$, giving a $3 \\times 2$ matrix.",
        "要求 $[T]_{C \\leftarrow B}$，把 $T$ 作用于 $B$ 中每个向量，再把结果写成 $C$ 坐标；这些坐标向量就是各列。对 $T: P_1 \\to P_2$，$T(p) = (ax + k)p(x)$，$B = \\{1, x\\}$，$C = \\{1, x, x^2\\}$：\n\n$$T(1) = k + ax, \\qquad T(x) = kx + ax^2,$$\n\n所以各列为 $(k, a, 0)$ 和 $(0, k, a)$，得到一个 $3 \\times 2$ 矩阵。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-5, 5) || 2;
        const k = rng.int(-5, 5) || -3;
        const M = [
          [k, 0],
          [a, k],
          [0, a],
        ];
        const i = rng.int(0, 2);
        const j = rng.int(0, 1);
        const ans = M[i]![j]!;
        const factor = formatPoly2(0, a, k);
        return numberProblem({
          prompt: t(
            `Let $T: P_1 \\to P_2$ be $T(p) = (${factor})p(x)$, with bases $B = \\{1, x\\}$ and $C = \\{1, x, x^2\\}$. Find the $(${i + 1}, ${j + 1})$ entry of $[T]_{C \\leftarrow B}$.`,
            `设 $T: P_1 \\to P_2$，$T(p) = (${factor})p(x)$，基为 $B = \\{1, x\\}$ 和 $C = \\{1, x, x^2\\}$。求 $[T]_{C \\leftarrow B}$ 的 $(${i + 1}, ${j + 1})$ 元。`,
          ),
          answer: ans,
          wrong: [M[2 - i]![j]!, M[i]![1 - j]!, a + k],
          solution: t(
            `$T(1) = ${formatPoly2(0, a, k)}$ and $T(x) = ${formatPoly2(a, k, 0)}$, so $[T]_{C \\leftarrow B} = \\begin{pmatrix} ${k} & 0 \\\\ ${a} & ${k} \\\\ 0 & ${a} \\end{pmatrix}$ and the entry is $${ans}$.`,
            `$T(1) = ${formatPoly2(0, a, k)}$，$T(x) = ${formatPoly2(a, k, 0)}$，所以 $[T]_{C \\leftarrow B} = \\begin{pmatrix} ${k} & 0 \\\\ ${a} & ${k} \\\\ 0 & ${a} \\end{pmatrix}$，该元为 $${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 5.16: EIGENVECTORS AND EIGENVALUES
// ════════════════════════════════════════════════════════════════════════════

/** eigenvaluesAndEigenvectorsOfA2x2Matrix introduces eigenpairs for 2x2 matrices. */
export const eigenvaluesAndEigenvectorsOfA2x2Matrix: TopicDef = {
  id: "eigenvalues-and-eigenvectors-of-a-2x2-matrix",
  title: t("The Eigenvalues and Eigenvectors of a 2x2 Matrix", "2x2 矩阵的特征值与特征向量"),
  summary: t(
    "Understand the defining equation Av = lambda v for eigenvalues and eigenvectors of a 2x2 matrix.",
    "理解 2x2 矩阵特征值与特征向量的定义方程 Av = lambda v。",
  ),
  prerequisites: ["matrix-of-a-linear-map-relative-to-two-bases"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "eigenpair-definition-2x2",
      title: t("Eigenpair Definition for 2x2 Matrices", "2x2 矩阵特征对的定义"),
      explanation: t(
        "An eigenvector is a nonzero vector that the matrix only stretches or shrinks, so multiplying it by the matrix gives a multiple of itself. Verify whether a given vector is an eigenvector and find its corresponding eigenvalue.",
        "特征向量是只被矩阵拉伸或缩短的非零向量，所以用矩阵乘它会得到它自身的倍数。检验给定向量是否为特征向量并求解其对应的特征值。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5])!;
        const mu = rng.pick([-6, -1, 1, 6])!;
        // Diagonal or upper-triangular matrix: A = [[lambda, b], [0, mu]]
        const b = rng.int(1, 5);
        const mat: Mat2 = [
          [lambda, b],
          [0, mu],
        ];
        const v: Vec2 = [1, 0];
        const prompt = t(
          `For the matrix $A = ${mat2Latex(mat)}$ and vector $v = ${vec2Latex(v)}$, $v$ is an eigenvector satisfying $Av = \\lambda v$. What is the eigenvalue $\\lambda$?`,
          `对于矩阵 $A = ${mat2Latex(mat)}$ 和向量 $v = ${vec2Latex(v)}$，$v$ 是满足 $Av = \\lambda v$ 的特征向量。求对应的特征值 $\\lambda$。`,
        );
        const solution = t(
          `Multiply $A$ by $v$: $Av = ${mat2Latex(mat)} ${vec2Latex(v)} = ${vec2Latex([lambda, 0])} = ${lambda} ${vec2Latex(v)}$. Therefore, the eigenvalue is $\\lambda = ${lambda}$.`,
          `计算矩阵乘积 $Av$：$Av = ${mat2Latex(mat)} ${vec2Latex(v)} = ${vec2Latex([lambda, 0])} = ${lambda} ${vec2Latex(v)}$。因此对应的特征值为 $\\lambda = ${lambda}$。`,
        );
        return numberProblem({
          prompt,
          answer: lambda,
          solution,
          wrong: [mu, -lambda, 0, lambda + 1].filter((w) => w !== lambda),
        });
      },
    },
    {
      id: "reading-an-eigenvalue-from-a-product",
      title: t("Reading an eigenvalue from a product", "由乘积读出特征值"),
      explanation: t(
        "To check whether $\\mathbf{v}$ is an eigenvector of $A$, compute $A\\mathbf{v}$ and compare it with $\\mathbf{v}$. If $A\\mathbf{v}$ is a scalar multiple $\\lambda\\mathbf{v}$, then $\\mathbf{v}$ is an eigenvector and the scalar is its eigenvalue. Divide any non-zero component of $A\\mathbf{v}$ by the matching component of $\\mathbf{v}$, and check that the other components give the same ratio.",
        "要检验 $\\mathbf{v}$ 是否是 $A$ 的特征向量，计算 $A\\mathbf{v}$ 并与 $\\mathbf{v}$ 比较。若 $A\\mathbf{v}$ 是标量倍 $\\lambda\\mathbf{v}$，则 $\\mathbf{v}$ 是特征向量，该标量就是其特征值。用 $A\\mathbf{v}$ 的任一非零分量除以 $\\mathbf{v}$ 的对应分量，并检查其他分量给出相同的比值。",
      ),
      generate(rng: Rng): Problem {
        const l1 = rng.int(-5, 5);
        let l2 = rng.int(-5, 5);
        if (l2 === l1) l2 = l1 + 2;
        const j = rng.pick([-1, 1, 2]);
        const k = rng.pick([1, 2, -2]);
        const A = fromEigen2(l1, l2, j, k);
        const first = rng.int(0, 1) === 0;
        const v: Vec2 = first ? [1, j] : [k, 1 + j * k];
        const lam = first ? l1 : l2;
        const Av: Vec2 = [lam * v[0], lam * v[1]];
        return numberProblem({
          prompt: t(
            `The vector $\\mathbf{v} = ${vec2Latex(v)}$ is an eigenvector of $A = ${mat2Latex(A)}$. Find its eigenvalue.`,
            `向量 $\\mathbf{v} = ${vec2Latex(v)}$ 是 $A = ${mat2Latex(A)}$ 的特征向量。求其特征值。`,
          ),
          answer: lam,
          wrong: [first ? l2 : l1, A[0][0], A[0][0] + A[1][1]],
          solution: t(
            `$A\\mathbf{v} = ${vec2Latex(Av)} = ${formatLinearComb2(lam, vec2Latex(v), 0, "")}$, so $\\lambda = ${lam}$.`,
            `$A\\mathbf{v} = ${vec2Latex(Av)} = ${formatLinearComb2(lam, vec2Latex(v), 0, "")}$，所以 $\\lambda = ${lam}$。`,
          ),
        });
      },
    },
  ],
};

/** calculatingTheEigenvaluesOfA2x2Matrix calculates eigenvalues via the characteristic equation. */
export const calculatingTheEigenvaluesOfA2x2Matrix: TopicDef = {
  id: "calculating-the-eigenvalues-of-a-2x2-matrix",
  title: t("Calculating the Eigenvalues of a 2x2 Matrix", "计算 2x2 矩阵的特征值"),
  summary: t(
    "Solve the characteristic equation det(A - lambda I) = 0 to find the eigenvalues of a 2x2 matrix.",
    "通过求解特征方程 det(A - lambda I) = 0 计算 2x2 矩阵的特征值。",
  ),
  prerequisites: ["eigenvalues-and-eigenvectors-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "solving-characteristic-polynomial-2x2",
      title: t("Solving the Characteristic Polynomial of a 2x2 Matrix", "求解 2x2 矩阵的特征多项式"),
      explanation: t(
        "The eigenvalues are the numbers that make the matrix minus that multiple of the identity singular, which happens when its determinant is zero. Find the real eigenvalues of a $2 \\times 2$ matrix from its trace and determinant.",
        "特征值就是使矩阵减去单位矩阵相应倍数后变为奇异的数，也就是使其行列式为零的数。利用矩阵的迹和行列式求 $2 \\times 2$ 矩阵的实特征值。",
      ),
      generate: (rng: Rng): Problem => {
        const l1 = rng.int(-5, 2);
        const l2 = rng.int(l1 + 1, 6);
        const k = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4])!;
        const mat: Mat2 = [
          [l1, k],
          [0, l2],
        ];
        const prompt = t(
          `Find all real eigenvalues of the matrix $A = ${mat2Latex(mat)}$. Enter the eigenvalues separated by commas.`,
          `求矩阵 $A = ${mat2Latex(mat)}$ 的所有实特征值。若有多个特征值，请用逗号分隔。`,
        );
        const solution = t(
          `Since $A$ is an upper triangular matrix, its eigenvalues are the diagonal entries: $\\lambda_1 = ${l1}$ and $\\lambda_2 = ${l2}$.`,
          `因为 $A$ 是上三角矩阵，所以它的特征值就是主对角线上的元素：$\\lambda_1 = ${l1}$ 且 $\\lambda_2 = ${l2}$。`,
        );
        return solutionsProblem({
          prompt,
          values: [String(l1), String(l2)],
          solution,
          wrong: [[String(-l1), String(-l2)], [String(l1), String(-l2)], [String(-l1), String(l2)], [String(l1)], [String(l2)]],
        });
      },
    },
    {
      id: "eigenvalues-of-a-full-2x2-matrix",
      title: t("Eigenvalues of a full 2x2 matrix", "一般 2x2 矩阵的特征值"),
      explanation: t(
        "For a $2 \\times 2$ matrix that is not triangular, the eigenvalues are not on the diagonal. Solve the characteristic equation\n\n$$\\lambda^2 - (\\operatorname{tr} A)\\lambda + \\det A = 0.$$\n\nThe two roots add up to the trace and multiply to the determinant, which is a quick check on the answer.",
        "对非三角的 $2 \\times 2$ 矩阵，特征值不在对角线上。解特征方程\n\n$$\\lambda^2 - (\\operatorname{tr} A)\\lambda + \\det A = 0.$$\n\n两根之和等于迹，之积等于行列式，可用来快速检验答案。",
      ),
      generate(rng: Rng): Problem {
        const l1 = rng.int(-6, 6);
        let l2 = rng.int(-6, 6);
        if (l2 === l1) l2 = l1 + 3;
        const A = fromEigen2(l1, l2, rng.pick([-1, 1, 2]), rng.pick([1, -1, 2]));
        const tr = l1 + l2;
        const det = l1 * l2;
        return solutionsProblem({
          prompt: t(
            `Find all eigenvalues of $A = ${mat2Latex(A)}$. Enter them separated by commas.`,
            `求 $A = ${mat2Latex(A)}$ 的所有特征值，用逗号分隔。`,
          ),
          values: [String(Math.min(l1, l2)), String(Math.max(l1, l2))],
          wrong: [
            [String(A[0][0]), String(A[1][1])],
            [String(-l1), String(-l2)],
          ],
          solution: t(
            `$\\operatorname{tr} A = ${tr}$ and $\\det A = ${det}$, so the characteristic equation is $${formatCharEq(tr, det)}$, with roots $\\lambda = ${l1}$ and $\\lambda = ${l2}$.`,
            `$\\operatorname{tr} A = ${tr}$，$\\det A = ${det}$，所以特征方程为 $${formatCharEq(tr, det)}$，其根为 $\\lambda = ${l1}$ 和 $\\lambda = ${l2}$。`,
          ),
        });
      },
    },
  ],
};

/** calculatingTheEigenvectorsOfA2x2Matrix computes eigenspace bases for 2x2 matrices. */
export const calculatingTheEigenvectorsOfA2x2Matrix: TopicDef = {
  id: "calculating-the-eigenvectors-of-a-2x2-matrix",
  title: t("Calculating the Eigenvectors of a 2x2 Matrix", "计算 2x2 矩阵的特征向量"),
  summary: t(
    "Find an eigenvector corresponding to a known eigenvalue by solving (A - lambda I)v = 0.",
    "通过求解 (A - lambda I)v = 0 求出已知特征值对应的特征向量。",
  ),
  prerequisites: ["calculating-the-eigenvalues-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "solving-for-eigenvector-2x2",
      title: t("Solving for an Eigenvector of a 2x2 Matrix", "求解 2x2 矩阵的特征向量"),
      explanation: t(
        "For each eigenvalue the matrix minus that multiple of the identity has a nonzero null space, and any nonzero vector in it is an eigenvector. Find the nontrivial solutions of $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ for a $2 \\times 2$ matrix.",
        "对每个特征值，矩阵减去单位矩阵的相应倍数后有非零的零空间，其中任何非零向量都是特征向量。求 $2 \\times 2$ 矩阵方程 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ 的非零解。",
      ),
      generate: (rng: Rng): Problem => {
        const l1 = rng.int(-4, 4);
        const diff = rng.int(1, 5);
        const l2 = l1 + diff;
        const m = rng.pick([-3, -2, -1, 1, 2, 3])!;
        const b = m * diff;
        const mat: Mat2 = [
          [l1, b],
          [0, l2],
        ];
        const prompt = t(
          `For the matrix $A = ${mat2Latex(mat)}$, find an eigenvector $\\mathbf{v} = \\langle x, 1 \\rangle$ (with second component $1$) corresponding to the eigenvalue $\\lambda = ${l2}$.`,
          `对于矩阵 $A = ${mat2Latex(mat)}$，求对应于特征值 $\\lambda = ${l2}$ 且第二分量为 $1$ 的特征向量 $\\mathbf{v} = \\langle x, 1 \\rangle$。`,
        );
        const rowEq = formatLinearComb2(l1 - l2, "x", b, "y");
        const xTerm = l1 - l2 === -1 ? "-x" : `${l1 - l2}x`;
        const solution = t(
          `We solve $(A${formatShift(l2, "I")})\\mathbf{v} = \\mathbf{0}$: $\\begin{pmatrix} ${l1 - l2} & ${b} \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$. This gives $${rowEq} = 0$. Setting $y = 1$ yields $${xTerm} = ${-b}$, so $x = ${m}$. Thus, $\\mathbf{v} = \\langle ${m}, 1 \\rangle$.`,
          `求解方程 $(A${formatShift(l2, "I")})\\mathbf{v} = \\mathbf{0}$：$\\begin{pmatrix} ${l1 - l2} & ${b} \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$。得到 $${rowEq} = 0$。取 $y = 1$ 可得 $${xTerm} = ${-b}$，解得 $x = ${m}$。因此 $\\mathbf{v} = \\langle ${m}, 1 \\rangle$。`,
        );
        return pointProblem({
          prompt,
          answer: [m, 1],
          vector: true,
          solution,
          wrong: [
            [-m, 1],
            [m, -1],
            [1, m],
            [0, 1],
            [1, 0],
          ],
        });
      },
    },
    {
      id: "eigenvectors-of-a-full-2x2-matrix",
      title: t("Eigenvectors of a full 2x2 matrix", "一般 2x2 矩阵的特征向量"),
      explanation: t(
        "To find an eigenvector for $\\lambda$, solve $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$. Because $\\lambda$ is an eigenvalue, the two rows of $A - \\lambda I$ are dependent, so one equation is enough. With $\\mathbf{v} = (x, 1)$, a row $(r, s)$ of $A - \\lambda I$ with $r \\ne 0$ gives $rx + s = 0$, so $x = -\\frac{s}{r}$.",
        "要求 $\\lambda$ 对应的特征向量，解 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$。由于 $\\lambda$ 是特征值，$A - \\lambda I$ 的两行线性相关，所以一个方程就够了。取 $\\mathbf{v} = (x, 1)$，$A - \\lambda I$ 中 $r \\ne 0$ 的一行 $(r, s)$ 给出 $rx + s = 0$，所以 $x = -\\frac{s}{r}$。",
      ),
      generate(rng: Rng): Problem {
        const l1 = rng.int(-5, 5);
        let l2 = rng.int(-5, 5);
        if (l2 === l1) l2 = l1 + 2;
        const j = rng.pick([1, 2, -2, 3]);
        const k = rng.pick([1, 2, -3, 3]);
        const A = fromEigen2(l1, l2, j, k);
        const x = Q.of(k, 1 + j * k);
        const B: Mat2 = [
          [A[0][0] - l2, A[0][1]],
          [A[1][0], A[1][1] - l2],
        ];
        const row = B[0][0] !== 0 ? B[0] : B[1];
        return numberProblem({
          prompt: t(
            `Find $x$ so that $\\mathbf{v} = ${vec2Latex(["x", "1"])}$ is an eigenvector of $A = ${mat2Latex(A)}$ for $\\lambda = ${l2}$.`,
            `求 $x$，使 $\\mathbf{v} = ${vec2Latex(["x", "1"])}$ 是 $A = ${mat2Latex(A)}$ 对应于 $\\lambda = ${l2}$ 的特征向量。`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [x.neg(), Q.of(1, j), Q.of(1 + j * k, k)],
          solution: t(
            `$A - ${paren(l2)}I = ${mat2Latex(B)}$. The row $(${row[0]}, ${row[1]})$ gives $${formatPoly2(0, row[0], row[1])} = 0$, so $x = ${x.toLatex()}$.`,
            `$A - ${paren(l2)}I = ${mat2Latex(B)}$。行 $(${row[0]}, ${row[1]})$ 给出 $${formatPoly2(0, row[0], row[1])} = 0$，所以 $x = ${x.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** characteristicEquationOfAMatrix finds the characteristic polynomial and equation. */
export const characteristicEquationOfAMatrix: TopicDef = {
  id: "characteristic-equation-of-a-matrix",
  title: t("The Characteristic Equation of a Matrix", "矩阵的特征方程"),
  summary: t(
    "Set up and expand the characteristic equation det(A - lambda I) = 0 for square matrices.",
    "列出并展开方阵的特征方程 det(A - lambda I) = 0。",
  ),
  prerequisites: ["calculating-the-eigenvectors-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "characteristic-equation-expansion",
      title: t("Characteristic Equation Expansion", "特征方程的展开"),
      explanation: t(
        "Expanding the determinant of a two by two matrix minus a multiple of the identity always produces the trace and the determinant as the coefficients. Express the characteristic equation in the standard form $\\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det(A) = 0$.",
        "展开二阶矩阵减去单位矩阵倍数后的行列式，得到的系数总是迹和行列式。将特征方程写为标准形式 $\\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det(A) = 0$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(-4, 5);
        const b = rng.pick([-3, -2, -1, 1, 2, 3])!;
        const c = rng.pick([-3, -2, -1, 1, 2, 3])!;
        const d = rng.int(-4, 5);
        const tr = a + d;
        const det = a * d - b * c;
        const mat: Mat2 = [
          [a, b],
          [c, d],
        ];
        const prompt = t(
          `Find the characteristic equation of the matrix $A = ${mat2Latex(mat)}$.`,
          `求矩阵 $A = ${mat2Latex(mat)}$ 的特征方程。`,
        );
        const right = t(`$${formatCharEq(tr, det)}$`, `$${formatCharEq(tr, det)}$`);
        const wrong = [
          t(`$${formatCharEq(-tr, det)}$`, `$${formatCharEq(-tr, det)}$`),
          t(`$${formatCharEq(tr, -det)}$`, `$${formatCharEq(tr, -det)}$`),
          t(`$${formatCharEq(-tr, -det)}$`, `$${formatCharEq(-tr, -det)}$`),
          t(`$${formatCharEq(tr + 1, det)}$`, `$${formatCharEq(tr + 1, det)}$`),
        ];
        const trText =
          a === 0 && d === 0 ? "0" : d === 0 ? `${a}` : a === 0 ? `${d}` : `${d >= 0 ? `${a} + ${d}` : `${a} - ${-d}`} = ${tr}`;
        const solution = t(
          `The characteristic equation for a $2 \\times 2$ matrix is $\\det(A - \\lambda I) = \\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det(A) = 0$. Here $\\operatorname{tr}(A) = ${trText}$ and $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det}$, giving $${formatCharEq(tr, det)}$.`,
          `$2 \\times 2$ 矩阵的特征方程为 $\\det(A - \\lambda I) = \\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det(A) = 0$。这里 $\\operatorname{tr}(A) = ${trText}$ 且 $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det}$，得到 $${formatCharEq(tr, det)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "coefficients-of-a-3x3-characteristic-polynomial",
      title: t("Coefficients of a 3x3 characteristic polynomial", "3x3 特征多项式的系数"),
      explanation: t(
        "For a $3 \\times 3$ matrix the characteristic polynomial is\n\n$$\\det(\\lambda I - A) = \\lambda^3 - (\\operatorname{tr} A)\\lambda^2 + c_1\\lambda - \\det A,$$\n\nwhere $c_1$ is the sum of the three $2 \\times 2$ principal minors. So the coefficient of $\\lambda^2$ is minus the trace and the constant term is minus the determinant, which can be read off without expanding the whole determinant.",
        "对 $3 \\times 3$ 矩阵，特征多项式为\n\n$$\\det(\\lambda I - A) = \\lambda^3 - (\\operatorname{tr} A)\\lambda^2 + c_1\\lambda - \\det A,$$\n\n其中 $c_1$ 是三个 $2 \\times 2$ 主子式之和。所以 $\\lambda^2$ 的系数是迹的相反数，常数项是行列式的相反数，无需展开整个行列式就能读出。",
      ),
      generate(rng: Rng): Problem {
        const m: number[][] = [0, 1, 2].map(() => [0, 1, 2].map(() => rng.int(-4, 4)));
        const M = m as unknown as Mat3;
        const tr = M[0][0] + M[1][1] + M[2][2];
        const det =
          M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) -
          M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) +
          M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
        const wantConst = rng.int(0, 1) === 1;
        const ans = wantConst ? -det : -tr;
        return numberProblem({
          prompt: t(
            `Find the ${wantConst ? "constant term" : "coefficient of $\\lambda^2$"} of $\\det(\\lambda I - A)$ for $A = ${mat3Latex(M)}$.`,
            `对 $A = ${mat3Latex(M)}$，求 $\\det(\\lambda I - A)$ 的${wantConst ? "常数项" : " $\\lambda^2$ 系数"}。`,
          ),
          answer: ans,
          wrong: wantConst ? [det, -tr, tr] : [tr, -det, det],
          solution: t(
            wantConst
              ? `The constant term is $-\\det A$, and $\\det A = ${det}$, so it is $${-det}$.`
              : `The coefficient of $\\lambda^2$ is $-\\operatorname{tr} A = -(${M[0][0]} + ${paren(M[1][1])} + ${paren(M[2][2])}) = ${-tr}$.`,
            wantConst
              ? `常数项为 $-\\det A$，而 $\\det A = ${det}$，所以它是 $${-det}$。`
              : `$\\lambda^2$ 的系数为 $-\\operatorname{tr} A = -(${M[0][0]} + ${paren(M[1][1])} + ${paren(M[2][2])}) = ${-tr}$。`,
          ),
        });
      },
    },
  ],
};

/** cayleyHamiltonTheorem applies the Cayley-Hamilton theorem to matrix powers and inverses. */
export const cayleyHamiltonTheorem: TopicDef = {
  id: "cayley-hamilton-theorem",
  title: t("The Cayley-Hamilton Theorem", "凯莱-哈密顿定理"),
  summary: t(
    "Apply the Cayley-Hamilton theorem p(A) = 0 to express powers of a matrix in terms of lower powers.",
    "应用凯莱-哈密顿定理 p(A) = 0 将矩阵的高次幂表示为低次幂的线性组合。",
  ),
  prerequisites: ["characteristic-equation-of-a-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "applying-cayley-hamilton-to-powers",
      title: t("Applying Cayley-Hamilton to Matrix Powers", "将凯莱-哈密顿定理应用于矩阵幂"),
      explanation: t(
        "Every square matrix satisfies its own characteristic equation, so its square can be written using only the matrix itself and the identity. Substitute $A$ into its characteristic polynomial to compute $A^2 = \\operatorname{tr}(A)A - \\det(A)I$.",
        "每个方阵都满足它自己的特征方程，所以它的平方可以只用矩阵本身和单位矩阵来表示。将矩阵 $A$ 代入其特征多项式，计算 $A^2 = \\operatorname{tr}(A)A - \\det(A)I$。",
      ),
      generate: (rng: Rng): Problem => {
        const tr = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5])!;
        const det = rng.pick([-7, -6, -5, 5, 6, 7])!;
        const charEq = formatCharEq(tr, det);
        const prompt = t(
          `Let $A$ be a $2 \\times 2$ matrix with characteristic equation $${charEq}$. By the Cayley-Hamilton theorem, express $A^2$ as a linear combination of $A$ and the identity matrix $I$.`,
          `设 $A$ 为 $2 \\times 2$ 矩阵，其特征方程为 $${charEq}$。根据凯莱-哈密顿定理，将 $A^2$ 表示为 $A$ 与单位矩阵 $I$ 的线性组合。`,
        );
        const right = t(`$A^2 = ${formatCayleyComb(tr, det)}$`, `$A^2 = ${formatCayleyComb(tr, det)}$`);
        const wrong = [
          t(`$A^2 = ${formatCayleyComb(-tr, det)}$`, `$A^2 = ${formatCayleyComb(-tr, det)}$`),
          t(`$A^2 = ${formatCayleyComb(tr, -det)}$`, `$A^2 = ${formatCayleyComb(tr, -det)}$`),
          t(`$A^2 = ${formatCayleyComb(-tr, -det)}$`, `$A^2 = ${formatCayleyComb(-tr, -det)}$`),
          t(`$A^2 = ${formatCayleyComb(1, det)}$`, `$A^2 = ${formatCayleyComb(1, det)}$`),
        ];
        const solution = t(
          `The Cayley-Hamilton theorem states that a matrix satisfies its own characteristic equation: $A^2 ${formatShift(tr, "A")}${formatShift(-det, "I")} = 0$. Solving for $A^2$ gives $A^2 = ${formatCayleyComb(tr, det)}$.`,
          `凯莱-哈密顿定理指出方阵满足其自身的特征方程：$A^2 ${formatShift(tr, "A")}${formatShift(-det, "I")} = 0$。解出 $A^2$ 得到 $A^2 = ${formatCayleyComb(tr, det)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "reducing-the-cube-of-a-matrix",
      title: t("Reducing the cube of a matrix", "化简矩阵的三次幂"),
      explanation: t(
        "If $A$ is $2 \\times 2$ with characteristic equation $\\lambda^2 - s\\lambda + p = 0$, the Cayley-Hamilton theorem gives $A^2 = sA - pI$. Multiplying by $A$ and substituting again,\n\n$$A^3 = sA^2 - pA = (s^2 - p)A - spI.$$\n\nSo every power of $A$ is a combination of $A$ and $I$.",
        "若 $2 \\times 2$ 矩阵 $A$ 的特征方程为 $\\lambda^2 - s\\lambda + p = 0$，凯莱–哈密顿定理给出 $A^2 = sA - pI$。两边乘以 $A$ 再代入一次，\n\n$$A^3 = sA^2 - pA = (s^2 - p)A - spI.$$\n\n所以 $A$ 的每个幂都是 $A$ 与 $I$ 的组合。",
      ),
      generate(rng: Rng): Problem {
        const s = rng.int(-5, 5) || 2;
        const p = rng.int(-6, 6) || -3;
        const wantA = rng.int(0, 1) === 0;
        const alpha = s * s - p;
        const beta = -s * p;
        return numberProblem({
          prompt: t(
            `A $2 \\times 2$ matrix $A$ has characteristic equation $${formatCharEq(s, p)}$. Writing $A^3 = \\alpha A + \\beta I$, find $\\${wantA ? "alpha" : "beta"}$.`,
            `$2 \\times 2$ 矩阵 $A$ 的特征方程为 $${formatCharEq(s, p)}$。写成 $A^3 = \\alpha A + \\beta I$，求 $\\${wantA ? "alpha" : "beta"}$。`,
          ),
          answer: wantA ? alpha : beta,
          wrong: wantA ? [s * s + p, s * s, s] : [s * p, -p, p * p],
          solution: t(
            `$A^2 = ${formatCayleyComb(s, p)}$, so $A^3 = ${formatLinearComb2(s, "A^2", -p, "A")} = ${formatLinearComb2(alpha, "A", beta, "I")}$. Hence $\\alpha = ${alpha}$ and $\\beta = ${beta}$.`,
            `$A^2 = ${formatCayleyComb(s, p)}$，所以 $A^3 = ${formatLinearComb2(s, "A^2", -p, "A")} = ${formatLinearComb2(alpha, "A", beta, "I")}$。故 $\\alpha = ${alpha}$，$\\beta = ${beta}$。`,
          ),
        });
      },
    },
  ],
};

/** calculatingTheEigenvectorsOfA3x3MatrixWithDistinctEigenvalues finds eigenvectors for distinct eigenvalues. */
export const calculatingTheEigenvectorsOfA3x3MatrixWithDistinctEigenvalues: TopicDef = {
  id: "calculating-the-eigenvectors-of-a-3x3-matrix-with-distinct-eigenvalues",
  title: t("Calculating the Eigenvectors of a 3x3 Matrix With Distinct Eigenvalues", "计算具有不同特征值的 3x3 矩阵的特征向量"),
  summary: t(
    "Calculate the eigenvectors of a 3x3 matrix when all eigenvalues are distinct.",
    "计算所有特征值互不相同的 3x3 矩阵的特征向量。",
  ),
  prerequisites: ["cayley-hamilton-theorem"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "eigenvectors-3x3-distinct-eigenvalues",
      title: t("Eigenvectors of 3x3 Matrix with Distinct Eigenvalues", "3x3 矩阵在相异特征值下的特征向量"),
      explanation: t(
        "With distinct eigenvalues, each one gives a one dimensional null space, so row reduce to find one free variable and read off the eigenvector. Solve $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ for a $3 \\times 3$ matrix with distinct eigenvalues.",
        "当特征值互不相同时，每个特征值对应一维的零空间，所以行化简后找到一个自由变量，就能读出特征向量。对具有互异特征值的 $3 \\times 3$ 矩阵，求解方程 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$。",
      ),
      generate: (rng: Rng): Problem => {
        const l1 = rng.int(1, 3);
        const l2 = rng.int(4, 6);
        const l3 = rng.int(-4, -1);
        const a12 = rng.int(1, 4);
        const a13 = rng.int(-3, 3);
        const a23 = rng.int(1, 4);
        const mat: Mat3 = [
          [l1, a12, a13],
          [0, l2, a23],
          [0, 0, l3],
        ];
        const prompt = t(
          `The upper triangular matrix $A = ${mat3Latex(mat)}$ has distinct eigenvalues $\\lambda_1 = ${l1}$, $\\lambda_2 = ${l2}$, and $\\lambda_3 = ${l3}$. Find the eigenvector $\\mathbf{v} = \\langle x_1, x_2, x_3 \\rangle$ corresponding to $\\lambda_1 = ${l1}$ whose first non-zero component is $1$.`,
          `上三角矩阵 $A = ${mat3Latex(mat)}$ 具有相异特征值 $\\lambda_1 = ${l1}$、$\\lambda_2 = ${l2}$ 与 $\\lambda_3 = ${l3}$。求对应于 $\\lambda_1 = ${l1}$ 且首个非零分量为 $1$ 的特征向量 $\\mathbf{v} = \\langle x_1, x_2, x_3 \\rangle$。`,
        );
        const solution = t(
          `Since $A$ is upper triangular, $A e_1 = A ${vec3Latex([1, 0, 0])} = ${vec3Latex([l1, 0, 0])} = ${l1} e_1$. Thus, $\\mathbf{v} = \\langle 1, 0, 0 \\rangle$ is the eigenvector corresponding to $\\lambda_1 = ${l1}$.`,
          `因为 $A$ 是上三角矩阵，计算可知 $A e_1 = A ${vec3Latex([1, 0, 0])} = ${vec3Latex([l1, 0, 0])} = ${l1} e_1$。因此 $\\mathbf{v} = \\langle 1, 0, 0 \\rangle$ 是对应 $\\lambda_1 = ${l1}$ 的特征向量。`,
        );
        return pointProblem({
          prompt,
          answer: [1, 0, 0],
          vector: true,
          solution,
          wrong: [
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 0],
            [1, 0, 1],
          ],
        });
      },
    },
    {
      id: "the-middle-eigenvector-of-a-triangular-3x3-matrix",
      title: t("The middle eigenvector of a triangular 3x3 matrix", "三角 3x3 矩阵中间特征值的特征向量"),
      explanation: t(
        "For an upper triangular matrix the eigenvalues are the diagonal entries. An eigenvector for the middle entry $\\lambda = a_{22}$ can be taken with $x_3 = 0$ and $x_2 = 1$. The third equation then holds automatically, the second is $0 = 0$, and the first row gives\n\n$$(a_{11} - a_{22})x_1 + a_{12} = 0, \\qquad x_1 = \\frac{a_{12}}{a_{22} - a_{11}}.$$",
        "上三角矩阵的特征值就是对角元。对中间的对角元 $\\lambda = a_{22}$，可取特征向量使 $x_3 = 0$，$x_2 = 1$。此时第三个方程自动成立，第二个方程为 $0 = 0$，第一行给出\n\n$$(a_{11} - a_{22})x_1 + a_{12} = 0, \\qquad x_1 = \\frac{a_{12}}{a_{22} - a_{11}}.$$",
      ),
      generate(rng: Rng): Problem {
        const d1 = rng.int(-5, 5);
        let d2 = rng.int(-5, 5);
        if (d2 === d1) d2 = d1 + rng.pick([-3, -2, -1, 1, 2, 3]);
        let d3 = rng.int(-5, 5);
        if (d3 === d1 || d3 === d2) d3 = Math.max(d1, d2) + 1;
        const a12 = rng.int(-6, 6) || 4;
        const M: Mat3 = [
          [d1, a12, rng.int(-4, 4)],
          [0, d2, rng.int(-4, 4)],
          [0, 0, d3],
        ];
        const x1 = Q.of(a12, d2 - d1);
        return numberProblem({
          prompt: t(
            `Find $x_1$ so that $\\langle x_1, 1, 0 \\rangle$ is an eigenvector of $A = ${mat3Latex(M)}$ for $\\lambda = ${d2}$.`,
            `求 $x_1$，使 $\\langle x_1, 1, 0 \\rangle$ 是 $A = ${mat3Latex(M)}$ 对应于 $\\lambda = ${d2}$ 的特征向量。`,
          ),
          answer: x1,
          solveFor: "x_1",
          wrong: [x1.neg(), Q.of(a12), Q.of(d2 - d1, a12)],
          solution: t(
            `The first row of $(A - ${paren(d2)}I)\\mathbf{v} = \\mathbf{0}$ is $${poly([d1 - d2, "x_1"], [a12, ""])} = 0$, so $x_1 = ${x1.toLatex()}$.`,
            `$(A - ${paren(d2)}I)\\mathbf{v} = \\mathbf{0}$ 的第一行为 $${poly([d1 - d2, "x_1"], [a12, ""])} = 0$，所以 $x_1 = ${x1.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** calculatingTheEigenvectorsOfA3x3MatrixInTheGeneralCase covers repeated eigenvalues and geometric multiplicity. */
export const calculatingTheEigenvectorsOfA3x3MatrixInTheGeneralCase: TopicDef = {
  id: "calculating-the-eigenvectors-of-a-3x3-matrix-in-the-general-case",
  title: t("Calculating the Eigenvectors of a 3x3 Matrix in the General Case", "一般情况下计算 3x3 矩阵的特征向量"),
  summary: t(
    "Determine the eigenspace and geometric multiplicity for 3x3 matrices with repeated eigenvalues.",
    "确定具有重特征值的 3x3 矩阵的特征子空间与几何重数。",
  ),
  prerequisites: ["calculating-the-eigenvectors-of-a-3x3-matrix-with-distinct-eigenvalues"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "geometric-multiplicity-3x3",
      title: t("Geometric Multiplicity of 3x3 Matrices", "3x3 矩阵的几何重数"),
      explanation: t(
        "The geometric multiplicity counts the independent eigenvectors for an eigenvalue, and it can be smaller than the number of times the eigenvalue is repeated. Compute $\\operatorname{nullity}(A - \\lambda I)$ to find the geometric multiplicity of a repeated eigenvalue.",
        "几何重数是一个特征值对应的线性无关特征向量的个数，它可能小于该特征值重复的次数。计算 $\\operatorname{nullity}(A - \\lambda I)$，得到重特征值的几何重数。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.int(-3, 3);
        const mu = rng.pick([-5, -4, 4, 5])!;
        const hasExtraPivot = rng.bool();
        // A = [[lambda, a, 0], [0, lambda, 0], [0, 0, mu]]
        // If a != 0, rank(A - lambda I) = 2, nullity = 1.
        // If a = 0, rank(A - lambda I) = 1, nullity = 2.
        const a = hasExtraPivot ? rng.pick([1, 2, 3])! : 0;
        const expectedGeoMult = hasExtraPivot ? 1 : 2;
        const mat: Mat3 = [
          [lambda, a, 0],
          [0, lambda, 0],
          [0, 0, mu],
        ];
        const prompt = t(
          `For the matrix $A = ${mat3Latex(mat)}$, the eigenvalue $\\lambda = ${lambda}$ has algebraic multiplicity $2$. What is the geometric multiplicity of $\\lambda = ${lambda}$?`,
          `对于矩阵 $A = ${mat3Latex(mat)}$，特征值 $\\lambda = ${lambda}$ 的代数重数为 $2$。求 $\\lambda = ${lambda}$ 的几何重数。`,
        );
        const shiftStr = formatShift(lambda, "I");
        const solution = t(
          `The geometric multiplicity is $\\dim(\\ker(A${shiftStr})) = 3 - \\operatorname{rank}(A${shiftStr})$. Here $A${shiftStr} = ${mat3Latex(
            [
              [0, a, 0],
              [0, 0, 0],
              [0, 0, mu - lambda],
            ],
          )}$, which has rank ${3 - expectedGeoMult}. Therefore, the geometric multiplicity is $3 - ${3 - expectedGeoMult} = ${expectedGeoMult}$.`,
          `几何重数为 $\\dim(\\ker(A${shiftStr})) = 3 - \\operatorname{rank}(A${shiftStr})$。这里 $A${shiftStr} = ${mat3Latex([
            [0, a, 0],
            [0, 0, 0],
            [0, 0, mu - lambda],
          ])}$，其秩为 ${3 - expectedGeoMult}。因此几何重数为 $3 - ${3 - expectedGeoMult} = ${expectedGeoMult}$。`,
        );
        return numberProblem({
          prompt,
          answer: expectedGeoMult,
          solution,
          wrong: [0, 1, 2, 3].filter((w) => w !== expectedGeoMult),
        });
      },
    },
    {
      id: "the-simple-eigenvector-beside-a-repeated-eigenvalue",
      title: t("The eigenvector of a simple eigenvalue beside a repeated one", "重特征值旁单特征值的特征向量"),
      explanation: t(
        "When $A$ has a repeated eigenvalue $\\lambda$ and a simple eigenvalue $\\mu$, the eigenvector for $\\mu$ is still found by solving $(A - \\mu I)\\mathbf{v} = \\mathbf{0}$. For an upper triangular $A$ with $\\mu$ in the last diagonal position, set $x_3 = 1$ and back-substitute: each row above gives one more coordinate, divided by $\\lambda - \\mu$.",
        "当 $A$ 有重特征值 $\\lambda$ 和单特征值 $\\mu$ 时，$\\mu$ 的特征向量仍由解 $(A - \\mu I)\\mathbf{v} = \\mathbf{0}$ 得到。对 $\\mu$ 位于最后一个对角位置的上三角矩阵 $A$，令 $x_3 = 1$ 并回代：上面每一行给出一个坐标，要除以 $\\lambda - \\mu$。",
      ),
      generate(rng: Rng): Problem {
        const lam = rng.int(-4, 4);
        const g = rng.pick([-2, -1, 1, 2]);
        const mu = lam + g;
        const c = rng.int(-3, 3);
        const b = rng.int(-4, 4) || 2;
        const a = rng.int(-4, 4);
        const M: Mat3 = [
          [lam, c, a],
          [0, lam, b],
          [0, 0, mu],
        ];
        const x2 = Q.of(b, g);
        const x1 = Q.of(a).add(Q.of(c).mul(x2)).div(Q.of(g));
        return pointProblem({
          prompt: t(
            `Find the eigenvector $\\langle x_1, x_2, 1 \\rangle$ of $A = ${mat3Latex(M)}$ for $\\lambda = ${mu}$.`,
            `求 $A = ${mat3Latex(M)}$ 对应于 $\\lambda = ${mu}$ 的特征向量 $\\langle x_1, x_2, 1 \\rangle$。`,
          ),
          answer: [x1, x2, 1],
          vector: true,
          vars: ["x_1", "x_2", "x_3"],
          wrong: [
            [x1.neg(), x2.neg(), 1],
            [Q.of(a, g), x2, 1],
          ],
          solution: t(
            `${steps(
              `A - ${paren(mu)}I = ${mat3Latex([
                [-g, c, a],
                [0, -g, b],
                [0, 0, 0],
              ])}`,
            )}The second row gives $${poly([-g, "x_2"], [b, ""])} = 0$, so $x_2 = ${x2.toLatex()}$. The first row gives $${poly([-g, "x_1"])} + ${paren(c)} \\cdot ${paren(x2)} + ${paren(a)} = 0$, so $x_1 = ${x1.toLatex()}$.`,
            `${steps(
              `A - ${paren(mu)}I = ${mat3Latex([
                [-g, c, a],
                [0, -g, b],
                [0, 0, 0],
              ])}`,
            )}第二行给出 $${poly([-g, "x_2"], [b, ""])} = 0$，所以 $x_2 = ${x2.toLatex()}$。第一行给出 $${poly([-g, "x_1"])} + ${paren(c)} \\cdot ${paren(x2)} + ${paren(a)} = 0$，所以 $x_1 = ${x1.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** invertibleMatrixTheoremInTermsOfEigenvalues relates invertibility to non-zero eigenvalues. */
export const invertibleMatrixTheoremInTermsOfEigenvalues: TopicDef = {
  id: "invertible-matrix-theorem-in-terms-of-eigenvalues",
  title: t("The Invertible Matrix Theorem in Terms of Eigenvalues", "特征值视角的逆矩阵定理"),
  summary: t(
    "Apply the eigenvalue criterion for matrix invertibility: A is invertible if and only if 0 is not an eigenvalue.",
    "应用矩阵可逆性的特征值判据：矩阵 A 可逆当且仅当 0 不是 A 的特征值。",
  ),
  prerequisites: ["calculating-the-eigenvectors-of-a-3x3-matrix-in-the-general-case"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "zero-eigenvalue-invertibility-test",
      title: t("Zero Eigenvalue Invertibility Test", "零特征值可逆性判据"),
      explanation: t(
        "Zero is an eigenvalue exactly when some nonzero vector is sent to zero, which is exactly when the matrix fails to be invertible. Relate matrix invertibility to the absence of zero from the spectrum.",
        "零是特征值当且仅当某个非零向量被映射到零，而这正是矩阵不可逆的情形。将矩阵的可逆性与其特征值谱中不含零联系起来。",
      ),
      generate: (rng: Rng): Problem => {
        const l1 = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9])!;
        const n = rng.int(2, 6);
        const prompt = t(
          `Let $A$ be an invertible $${n} \\times ${n}$ matrix with known eigenvalue $\\lambda = ${l1}$. What is the corresponding eigenvalue of $A^{-1}$?`,
          `设 $A$ 为可逆的 $${n} \\times ${n}$ 矩阵，已知其具有特征值 $\\lambda = ${l1}$。求 $A^{-1}$ 对应的特征值。`,
        );
        const ans = Q.of(1, l1);
        const solution = t(
          `If $A\\mathbf{v} = \\lambda \\mathbf{v}$ with $\\lambda = ${l1} \\neq 0$, multiplying both sides by $A^{-1}$ yields $\\mathbf{v} = \\lambda A^{-1}\\mathbf{v}$, so $A^{-1}\\mathbf{v} = \\frac{1}{\\lambda}\\mathbf{v}$. Thus, the eigenvalue of $A^{-1}$ is $\\frac{1}{${l1}} = ${ans.toLatex()}$.`,
          `若 $A\\mathbf{v} = \\lambda \\mathbf{v}$ 且 $\\lambda = ${l1} \\neq 0$，两边同乘 $A^{-1}$ 可得 $\\mathbf{v} = \\lambda A^{-1}\\mathbf{v}$，即 $A^{-1}\\mathbf{v} = \\frac{1}{\\lambda}\\mathbf{v}$。因此 $A^{-1}$ 对应的特征值为 $\\frac{1}{${l1}} = ${ans.toLatex()}$。`,
        );
        return numberProblem({
          prompt,
          answer: ans,
          solution,
          wrong: [Q.of(-1, l1), Q.of(l1), Q.of(-l1), Q.zero],
        });
      },
    },
    {
      id: "the-determinant-of-an-inverse-from-eigenvalues",
      title: t("The determinant of an inverse from eigenvalues", "由特征值求逆矩阵的行列式"),
      explanation: t(
        "The determinant of a matrix is the product of its eigenvalues, so $A$ is invertible exactly when $0$ is not an eigenvalue. The eigenvalues of $A^{-1}$ are the reciprocals $\\frac{1}{\\lambda_i}$, with the same eigenvectors, so\n\n$$\\det(A^{-1}) = \\frac{1}{\\lambda_1\\lambda_2\\lambda_3} = \\frac{1}{\\det A}.$$",
        "矩阵的行列式等于其特征值之积，所以 $A$ 可逆当且仅当 $0$ 不是特征值。$A^{-1}$ 的特征值是倒数 $\\frac{1}{\\lambda_i}$，特征向量相同，所以\n\n$$\\det(A^{-1}) = \\frac{1}{\\lambda_1\\lambda_2\\lambda_3} = \\frac{1}{\\det A}.$$",
      ),
      generate(rng: Rng): Problem {
        const nz = (): number => rng.int(1, 5) * rng.pick([-1, 1]);
        const [l1, l2, l3] = [nz(), nz(), nz()];
        const prod = l1 * l2 * l3;
        const ans = Q.of(1, prod);
        return numberProblem({
          prompt: t(
            `A $3 \\times 3$ matrix $A$ has eigenvalues $${l1}$, $${l2}$ and $${l3}$. Find $\\det(A^{-1})$.`,
            `$3 \\times 3$ 矩阵 $A$ 的特征值为 $${l1}$、$${l2}$ 和 $${l3}$。求 $\\det(A^{-1})$。`,
          ),
          answer: ans,
          wrong: [Q.of(prod), Q.of(1, l1 + l2 + l3 === 0 ? 1 : l1 + l2 + l3), ans.neg()],
          solution: t(
            `$\\det A = ${l1} \\cdot ${paren(l2)} \\cdot ${paren(l3)} = ${prod}$, so $\\det(A^{-1}) = \\frac{1}{\\det A} = ${ans.toLatex()}$.`,
            `$\\det A = ${l1} \\cdot ${paren(l2)} \\cdot ${paren(l3)} = ${prod}$，所以 $\\det(A^{-1}) = \\frac{1}{\\det A} = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 5.17: DIAGONALIZATION
// ════════════════════════════════════════════════════════════════════════════

/** diagonalizingA2x2Matrix factorizes A = PDP^{-1} for 2x2 matrices. */
export const diagonalizingA2x2Matrix: TopicDef = {
  id: "diagonalizing-a-2x2-matrix",
  title: t("Diagonalizing a 2x2 Matrix", "对角化 2x2 矩阵"),
  summary: t(
    "Diagonalize a 2x2 matrix by finding an invertible matrix P of eigenvectors and a diagonal matrix D of eigenvalues.",
    "通过寻找由特征向量构成的可逆矩阵 P 和由特征值构成的对角矩阵 D 对角化 2x2 矩阵。",
  ),
  prerequisites: ["invertible-matrix-theorem-in-terms-of-eigenvalues"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "factorization-a-equals-pdp-inv-2x2",
      title: t("Factorization A = PDP^{-1} for 2x2 Matrices", "2x2 矩阵的 A = PDP^{-1} 分解"),
      explanation: t(
        "Put the eigenvectors as the columns of one matrix and the matching eigenvalues on the diagonal of another, keeping them in the same order. Form $P$ and $D$ such that $A = PDP^{-1}$ for a diagonalizable $2 \\times 2$ matrix.",
        "把特征向量作为一个矩阵的列，把对应的特征值放在另一个矩阵的对角线上，并保持相同的顺序。构造矩阵 $P$ 与 $D$，使得可对角化的 $2 \\times 2$ 矩阵满足 $A = PDP^{-1}$。",
      ),
      generate: (rng: Rng): Problem => {
        const l1 = rng.int(1, 3);
        const l2 = rng.int(4, 6);
        const b = rng.pick([-3, -2, 2, 3])!;
        // A = [[l1, b], [0, l2]]
        // Eigenvalues l1, l2.
        // v1 for l1: [1, 0]^T
        // v2 for l2: [b, l2 - l1]^T
        const p11 = 1;
        const p21 = 0;
        const p12 = b;
        const p22 = l2 - l1;
        const matA: Mat2 = [
          [l1, b],
          [0, l2],
        ];
        const matP: Mat2 = [
          [p11, p12],
          [p21, p22],
        ];
        const matD: Mat2 = [
          [l1, 0],
          [0, l2],
        ];
        const prompt = t(
          `Find an invertible matrix $P$ and diagonal matrix $D$ that diagonalize $A = ${mat2Latex(matA)}$ such that $A = P D P^{-1}$.`,
          `求可逆矩阵 $P$ 和对角矩阵 $D$，将矩阵 $A = ${mat2Latex(matA)}$ 对角化为 $A = P D P^{-1}$。`,
        );
        const right = t(`$P = ${mat2Latex(matP)}, \\; D = ${mat2Latex(matD)}$`, `$P = ${mat2Latex(matP)}, \\; D = ${mat2Latex(matD)}$`);
        const wrong = [
          t(
            `$P = ${mat2Latex([
              [p12, p11],
              [p22, p21],
            ])}, \\; D = ${mat2Latex(matD)}$`,
            `$P = ${mat2Latex([
              [p12, p11],
              [p22, p21],
            ])}, \\; D = ${mat2Latex(matD)}$`,
          ),
          t(
            `$P = ${mat2Latex([
              [1, 0],
              [0, 1],
            ])}, \\; D = ${mat2Latex(matA)}$`,
            `$P = ${mat2Latex([
              [1, 0],
              [0, 1],
            ])}, \\; D = ${mat2Latex(matA)}$`,
          ),
          t(
            `$P = ${mat2Latex(matP)}, \\; D = ${mat2Latex([
              [l2, 0],
              [0, l1],
            ])}$`,
            `$P = ${mat2Latex(matP)}, \\; D = ${mat2Latex([
              [l2, 0],
              [0, l1],
            ])}$`,
          ),
          t(
            `$P = ${mat2Latex([
              [p21, p11],
              [p22, p12],
            ])}, \\; D = ${mat2Latex(matD)}$`,
            `$P = ${mat2Latex([
              [p21, p11],
              [p22, p12],
            ])}, \\; D = ${mat2Latex(matD)}$`,
          ),
        ];
        const solution = t(
          `The eigenvalues are $\\lambda_1 = ${l1}$ and $\\lambda_2 = ${l2}$. The corresponding eigenvectors form the columns of $P$: $v_1 = ${vec2Latex([1, 0])}$ and $v_2 = ${vec2Latex([p12, p22])}$. Setting $D = \\operatorname{diag}(${l1}, ${l2})$ gives $A = P D P^{-1}$.`,
          `特征值为 $\\lambda_1 = ${l1}$ 与 $\\lambda_2 = ${l2}$。对应的特征向量构成矩阵 $P$ 的各列：$v_1 = ${vec2Latex([1, 0])}$ 且 $v_2 = ${vec2Latex([p12, p22])}$。取 $D = \\operatorname{diag}(${l1}, ${l2})$ 即可得到 $A = P D P^{-1}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "rebuilding-a-matrix-from-its-diagonalization",
      title: t("Rebuilding a matrix from its diagonalization", "由对角化还原矩阵"),
      explanation: t(
        "If $P$ has eigenvectors as columns and $D$ holds the matching eigenvalues, then $A = PDP^{-1}$. Multiplying out recovers $A$: first $PD$ scales each column of $P$ by its eigenvalue, then multiplying by $P^{-1}$ on the right gives $A$. For $P = \\begin{pmatrix} 1 & k \\\\ j & 1 + jk \\end{pmatrix}$, which has determinant $1$, $P^{-1} = \\begin{pmatrix} 1 + jk & -k \\\\ -j & 1 \\end{pmatrix}$.",
        "若 $P$ 以特征向量为列，$D$ 含有对应的特征值，则 $A = PDP^{-1}$。乘出来就能还原 $A$：先用 $PD$ 把 $P$ 的每一列乘以其特征值，再右乘 $P^{-1}$ 得到 $A$。对行列式为 $1$ 的 $P = \\begin{pmatrix} 1 & k \\\\ j & 1 + jk \\end{pmatrix}$，$P^{-1} = \\begin{pmatrix} 1 + jk & -k \\\\ -j & 1 \\end{pmatrix}$。",
      ),
      generate(rng: Rng): Problem {
        const l1 = rng.int(-5, 5);
        let l2 = rng.int(-5, 5);
        if (l2 === l1) l2 = l1 - 2;
        const j = rng.pick([-1, 1, 2]);
        const k = rng.pick([1, 2, -1]);
        const P: Mat2 = [
          [1, k],
          [j, 1 + j * k],
        ];
        const A = fromEigen2(l1, l2, j, k);
        const PD: Mat2 = [
          [l1, l2 * k],
          [l1 * j, l2 * (1 + j * k)],
        ];
        const i = rng.int(0, 1);
        const c = rng.int(0, 1);
        const swapped = fromEigen2(l2, l1, j, k);
        return numberProblem({
          prompt: t(
            `Let $A = PDP^{-1}$ with $P = ${mat2Latex(P)}$ and $D = ${mat2Latex([
              [l1, 0],
              [0, l2],
            ])}$. Find the $(${i + 1}, ${c + 1})$ entry of $A$.`,
            `设 $A = PDP^{-1}$，$P = ${mat2Latex(P)}$，$D = ${mat2Latex([
              [l1, 0],
              [0, l2],
            ])}$。求 $A$ 的 $(${i + 1}, ${c + 1})$ 元。`,
          ),
          answer: A[i]![c]!,
          wrong: [swapped[i]![c]!, PD[i]![c]!, i === c ? (i === 0 ? l1 : l2) : 0],
          solution: t(
            `$PD = ${mat2Latex(PD)}$ and $P^{-1} = ${mat2Latex([
              [1 + j * k, -k],
              [-j, 1],
            ])}$, so $A = ${mat2Latex(A)}$ and the entry is $${A[i]![c]!}$.`,
            `$PD = ${mat2Latex(PD)}$，$P^{-1} = ${mat2Latex([
              [1 + j * k, -k],
              [-j, 1],
            ])}$，所以 $A = ${mat2Latex(A)}$，该元为 $${A[i]![c]!}$。`,
          ),
        });
      },
    },
  ],
};

/** propertiesOfDiagonalization computes matrix powers via diagonalization. */
export const propertiesOfDiagonalization: TopicDef = {
  id: "properties-of-diagonalization",
  title: t("Properties of Diagonalization", "对角化的性质"),
  summary: t(
    "Use a diagonalization $A = PDP^{-1}$ to compute powers $A^k$, and understand properties of diagonalizable matrices.",
    "利用对角化 $A = PDP^{-1}$ 计算矩阵幂 $A^k$，并理解可对角化矩阵的性质。",
  ),
  prerequisites: ["diagonalizing-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "computing-matrix-powers-diagonalization",
      title: t("Computing Matrix Powers via Diagonalization", "通过对角化计算矩阵幂"),
      explanation: t(
        "In the factorization the inner factors cancel when multiplied repeatedly, so only the diagonal matrix is raised to the power, which just raises each entry. Apply $A^k = P D^k P^{-1}$ to compute high powers of a diagonalizable matrix.",
        "在分解式中反复相乘时，中间的因子相互抵消，所以只需对对角矩阵求幂，也就是对每个对角元素求幂。应用 $A^k = P D^k P^{-1}$ 计算可对角化矩阵的高次幂。",
      ),
      generate: (rng: Rng): Problem => {
        const l1 = rng.int(2, 4);
        const l2 = rng.pick([-3, -2, 5])!;
        const k = rng.int(3, 7);
        const prompt = t(
          `If a matrix $A$ is diagonalized as $A = P D P^{-1}$ with $D = \\begin{pmatrix} ${l1} & 0 \\\\ 0 & ${l2} \\end{pmatrix}$, what is the diagonal matrix $D^{${k}}$ used in computing $A^{${k}} = P D^{${k}} P^{-1}$?`,
          `若矩阵 $A$ 可对角化为 $A = P D P^{-1}$，其中 $D = \\begin{pmatrix} ${l1} & 0 \\\\ 0 & ${l2} \\end{pmatrix}$，求计算 $A^{${k}} = P D^{${k}} P^{-1}$ 时所用的对角矩阵 $D^{${k}}$。`,
        );
        const right = t(
          `$\\begin{pmatrix} ${l1}^{${k}} & 0 \\\\ 0 & (${l2})^{${k}} \\end{pmatrix}$`,
          `$\\begin{pmatrix} ${l1}^{${k}} & 0 \\\\ 0 & (${l2})^{${k}} \\end{pmatrix}$`,
        );
        const wrong = [
          t(
            `$\\begin{pmatrix} ${k * l1} & 0 \\\\ 0 & ${k * l2} \\end{pmatrix}$`,
            `$\\begin{pmatrix} ${k * l1} & 0 \\\\ 0 & ${k * l2} \\end{pmatrix}$`,
          ),
          t(`$\\begin{pmatrix} ${l1} & 0 \\\\ 0 & ${l2} \\end{pmatrix}$`, `$\\begin{pmatrix} ${l1} & 0 \\\\ 0 & ${l2} \\end{pmatrix}$`),
          t(
            `$\\begin{pmatrix} (${l2})^{${k}} & 0 \\\\ 0 & ${l1}^{${k}} \\end{pmatrix}$`,
            `$\\begin{pmatrix} (${l2})^{${k}} & 0 \\\\ 0 & ${l1}^{${k}} \\end{pmatrix}$`,
          ),
          t(
            `$\\begin{pmatrix} ${l1 + k} & 0 \\\\ 0 & ${l2 + k} \\end{pmatrix}$`,
            `$\\begin{pmatrix} ${l1 + k} & 0 \\\\ 0 & ${l2 + k} \\end{pmatrix}$`,
          ),
        ];
        const solution = t(
          `For a diagonal matrix $D = \\operatorname{diag}(\\lambda_1, \\lambda_2)$, its $k$-th power is obtained by raising each diagonal entry to the $k$-th power: $D^{${k}} = \\begin{pmatrix} ${l1}^{${k}} & 0 \\\\ 0 & (${l2})^{${k}} \\end{pmatrix}$.`,
          `对角矩阵 $D = \\operatorname{diag}(\\lambda_1, \\lambda_2)$ 的 $k$ 次幂等于将其对角线上的每个元素分别取 $k$ 次幂：$D^{${k}} = \\begin{pmatrix} ${l1}^{${k}} & 0 \\\\ 0 & (${l2})^{${k}} \\end{pmatrix}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "an-entry-of-a-power-through-diagonalization",
      title: t("An entry of a power through diagonalization", "通过对角化求幂的元素"),
      explanation: t(
        "Diagonalization turns powers into powers of numbers: $A^n = PD^nP^{-1}$, and $D^n$ just raises each eigenvalue to the $n$th power. For $A = \\begin{pmatrix} a & b - a \\\\ 0 & b \\end{pmatrix}$ the eigenvectors $(1, 0)$ and $(1, 1)$ give $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$, and\n\n$$A^n = \\begin{pmatrix} a^n & b^n - a^n \\\\ 0 & b^n \\end{pmatrix}.$$",
        "对角化把矩阵的幂变成数的幂：$A^n = PD^nP^{-1}$，而 $D^n$ 只是把每个特征值取 $n$ 次方。对 $A = \\begin{pmatrix} a & b - a \\\\ 0 & b \\end{pmatrix}$，特征向量 $(1, 0)$ 和 $(1, 1)$ 给出 $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$，且\n\n$$A^n = \\begin{pmatrix} a^n & b^n - a^n \\\\ 0 & b^n \\end{pmatrix}.$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 3);
        let b = rng.int(-3, 3);
        if (b === a) b = a + 1;
        const n = rng.int(3, 6);
        const ans = b ** n - a ** n;
        return numberProblem({
          prompt: t(
            `Use diagonalization to find the $(1, 2)$ entry of $A^{${n}}$ for $A = ${mat2Latex([
              [a, b - a],
              [0, b],
            ])}$.`,
            `用对角化求 $A^{${n}}$ 的 $(1, 2)$ 元，其中 $A = ${mat2Latex([
              [a, b - a],
              [0, b],
            ])}$。`,
          ),
          answer: ans,
          wrong: [(b - a) ** n, a ** n - b ** n, n * (b - a)],
          solution: t(
            `$A = PDP^{-1}$ with $P = ${mat2Latex([
              [1, 1],
              [0, 1],
            ])}$ and $D = \\operatorname{diag}(${a}, ${b})$, so the $(1, 2)$ entry of $A^{${n}}$ is $${paren(b)}^{${n}} - ${paren(a)}^{${n}} = ${ans}$.`,
            `$A = PDP^{-1}$，其中 $P = ${mat2Latex([
              [1, 1],
              [0, 1],
            ])}$，$D = \\operatorname{diag}(${a}, ${b})$，所以 $A^{${n}}$ 的 $(1, 2)$ 元为 $${paren(b)}^{${n}} - ${paren(a)}^{${n}} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** diagonalizingA3x3MatrixWithDistinctEigenvalues diagonalizes 3x3 matrices with 3 distinct eigenvalues. */
export const diagonalizingA3x3MatrixWithDistinctEigenvalues: TopicDef = {
  id: "diagonalizing-a-3x3-matrix-with-distinct-eigenvalues",
  title: t("Diagonalizing a 3x3 Matrix With Distinct Eigenvalues", "对角化具有不同特征值的 3x3 矩阵"),
  summary: t(
    "Construct the diagonalizing matrix P and diagonal matrix D for 3x3 matrices with distinct eigenvalues.",
    "构造具有不同特征值的 3x3 矩阵的对角化变换矩阵 P 和对角矩阵 D。",
  ),
  prerequisites: ["properties-of-diagonalization"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "diagonalizing-3x3-distinct-eigenvalues-kp",
      title: t("Diagonalizing 3x3 Matrices with Distinct Eigenvalues", "对角化具有相异特征值的 3x3 矩阵"),
      explanation: t(
        "Eigenvectors for distinct eigenvalues are always independent, so a three by three matrix with three distinct eigenvalues can always be diagonalized. Assemble the eigenvectors as the columns of $P$ so that $P^{-1} A P = D$.",
        "属于不同特征值的特征向量总是线性无关的，所以有三个不同特征值的三阶矩阵总能对角化。将特征向量组合为 $P$ 的各列，使得 $P^{-1} A P = D$。",
      ),
      generate: (rng: Rng): Problem => {
        const l1 = rng.int(1, 3);
        const l2 = rng.int(4, 6);
        const l3 = rng.int(-4, -1);
        const prompt = t(
          `A $3 \\times 3$ matrix $A$ has distinct eigenvalues $\\lambda_1 = ${l1}$, $\\lambda_2 = ${l2}$, and $\\lambda_3 = ${l3}$ with corresponding eigenvectors $v_1, v_2, v_3$. If $P = \\begin{pmatrix} v_1 & v_2 & v_3 \\end{pmatrix}$, what is $P^{-1} A P$?`,
          `$3 \\times 3$ 矩阵 $A$ 具有相异特征值 $\\lambda_1 = ${l1}$、$\\lambda_2 = ${l2}$ 与 $\\lambda_3 = ${l3}$，对应特征向量为 $v_1, v_2, v_3$。若 $P = \\begin{pmatrix} v_1 & v_2 & v_3 \\end{pmatrix}$，求 $P^{-1} A P$。`,
        );
        const right = t(
          `$${mat3Latex([
            [l1, 0, 0],
            [0, l2, 0],
            [0, 0, l3],
          ])}$`,
          `$${mat3Latex([
            [l1, 0, 0],
            [0, l2, 0],
            [0, 0, l3],
          ])}$`,
        );
        const wrong = [
          t(
            `$${mat3Latex([
              [l3, 0, 0],
              [0, l2, 0],
              [0, 0, l1],
            ])}$`,
            `$${mat3Latex([
              [l3, 0, 0],
              [0, l2, 0],
              [0, 0, l1],
            ])}$`,
          ),
          t(
            `$${mat3Latex([
              [l1, l2, l3],
              [0, 0, 0],
              [0, 0, 0],
            ])}$`,
            `$${mat3Latex([
              [l1, l2, l3],
              [0, 0, 0],
              [0, 0, 0],
            ])}$`,
          ),
          t(
            `$${mat3Latex([
              [0, 0, l1],
              [0, l2, 0],
              [l3, 0, 0],
            ])}$`,
            `$${mat3Latex([
              [0, 0, l1],
              [0, l2, 0],
              [l3, 0, 0],
            ])}$`,
          ),
          t(
            `$${mat3Latex([
              [1, 0, 0],
              [0, 1, 0],
              [0, 0, 1],
            ])}$`,
            `$${mat3Latex([
              [1, 0, 0],
              [0, 1, 0],
              [0, 0, 1],
            ])}$`,
          ),
        ];
        const solution = t(
          `When the columns of $P$ are eigenvectors ordered as $v_1, v_2, v_3$, the similarity transform $P^{-1} A P$ produces the diagonal matrix $D = \\operatorname{diag}(\\lambda_1, \\lambda_2, \\lambda_3) = ${mat3Latex(
            [
              [l1, 0, 0],
              [0, l2, 0],
              [0, 0, l3],
            ],
          )}$.`,
          `当矩阵 $P$ 的列向量按特征向量 $v_1, v_2, v_3$ 的顺序排列时，相似变换 $P^{-1} A P$ 产生对应的对角矩阵 $D = \\operatorname{diag}(\\lambda_1, \\lambda_2, \\lambda_3) = ${mat3Latex(
            [
              [l1, 0, 0],
              [0, l2, 0],
              [0, 0, l3],
            ],
          )}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "a-shifted-determinant-through-diagonalization",
      title: t("A shifted determinant through diagonalization", "通过对角化求平移后的行列式"),
      explanation: t(
        "If $A = PDP^{-1}$ with $D = \\operatorname{diag}(\\lambda_1, \\lambda_2, \\lambda_3)$, then $A + kI = P(D + kI)P^{-1}$, because $P(kI)P^{-1} = kI$. So $A + kI$ is diagonalized by the same $P$, with eigenvalues $\\lambda_i + k$, and\n\n$$\\det(A + kI) = (\\lambda_1 + k)(\\lambda_2 + k)(\\lambda_3 + k).$$\n\nThe determinant of a diagonalizable matrix is the product of its eigenvalues, so there is no need to form $A$ or multiply out any matrices.",
        "若 $A = PDP^{-1}$，$D = \\operatorname{diag}(\\lambda_1, \\lambda_2, \\lambda_3)$，则 $A + kI = P(D + kI)P^{-1}$，因为 $P(kI)P^{-1} = kI$。所以 $A + kI$ 由同一个 $P$ 对角化，特征值为 $\\lambda_i + k$，且\n\n$$\\det(A + kI) = (\\lambda_1 + k)(\\lambda_2 + k)(\\lambda_3 + k).$$\n\n可对角化矩阵的行列式等于其特征值之积，所以无需求出 $A$ 或做任何矩阵乘法。",
      ),
      generate(rng: Rng): Problem {
        const l1 = rng.int(-4, 4);
        let l2 = rng.int(-4, 4);
        if (l2 === l1) l2 = l1 + 1;
        let l3 = rng.int(-4, 4);
        if (l3 === l1 || l3 === l2) l3 = Math.max(l1, l2) + 2;
        const k = rng.int(1, 3) * rng.pick([-1, 1]);
        const ans = (l1 + k) * (l2 + k) * (l3 + k);
        return numberProblem({
          prompt: t(
            `A $3 \\times 3$ matrix is diagonalized as $A = PDP^{-1}$ with $D = \\operatorname{diag}(${l1}, ${l2}, ${l3})$. Find $\\det(A ${k < 0 ? "-" : "+"} ${Math.abs(k)}I)$.`,
            `$3 \\times 3$ 矩阵对角化为 $A = PDP^{-1}$，$D = \\operatorname{diag}(${l1}, ${l2}, ${l3})$。求 $\\det(A ${k < 0 ? "-" : "+"} ${Math.abs(k)}I)$。`,
          ),
          answer: ans,
          wrong: [l1 * l2 * l3 + k, l1 * l2 * l3 + k ** 3, (l1 - k) * (l2 - k) * (l3 - k)],
          solution: t(
            `$A ${k < 0 ? "-" : "+"} ${Math.abs(k)}I$ has eigenvalues $${l1 + k}$, $${l2 + k}$, $${l3 + k}$, so its determinant is $${l1 + k} \\cdot ${paren(l2 + k)} \\cdot ${paren(l3 + k)} = ${ans}$.`,
            `$A ${k < 0 ? "-" : "+"} ${Math.abs(k)}I$ 的特征值为 $${l1 + k}$、$${l2 + k}$、$${l3 + k}$，所以其行列式为 $${l1 + k} \\cdot ${paren(l2 + k)} \\cdot ${paren(l3 + k)} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** diagonalizingA3x3MatrixInTheGeneralCase covers diagonalizability tests for general 3x3 matrices. */
export const diagonalizingA3x3MatrixInTheGeneralCase: TopicDef = {
  id: "diagonalizing-a-3x3-matrix-in-the-general-case",
  title: t("Diagonalizing a 3x3 Matrix in the General Case", "一般情况下对角化 3x3 矩阵"),
  summary: t(
    "Determine whether a general 3x3 matrix is diagonalizable by comparing algebraic and geometric multiplicities.",
    "通过比较代数重数与几何重数，判定一般 3x3 矩阵是否可对角化。",
  ),
  prerequisites: ["diagonalizing-a-3x3-matrix-with-distinct-eigenvalues"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "diagonalizability-criterion-3x3",
      title: t("Diagonalizability Criterion for 3x3 Matrices", "3x3 矩阵可对角化判据"),
      explanation: t(
        "A matrix is diagonalizable when it has enough independent eigenvectors to form a basis, which fails if some repeated eigenvalue has too few. Check whether geometric multiplicity equals algebraic multiplicity for each eigenvalue.",
        "当矩阵有足够多的线性无关特征向量构成一组基时，它就可以对角化；如果某个重复特征值的特征向量太少就不行。检验每个特征值的几何重数是否等于代数重数。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.int(-3, 3);
        const mu = rng.pick([-5, -4, 4, 5])!;
        const isDiag = rng.bool();
        const a = isDiag ? 0 : rng.pick([1, 2, 3])!;
        const mat: Mat3 = [
          [lambda, a, 0],
          [0, lambda, 0],
          [0, 0, mu],
        ];
        const prompt = t(
          `Is the matrix $A = ${mat3Latex(mat)}$ diagonalizable over $\\mathbb{R}$?`,
          `矩阵 $A = ${mat3Latex(mat)}$ 在 $\\mathbb{R}$ 上是否可对角化？`,
        );
        const right = isDiag
          ? t(
              "Yes, because the geometric multiplicity of each eigenvalue equals its algebraic multiplicity",
              "是，因为每个特征值的几何重数均等于其代数重数",
            )
          : t(
              "No, because the geometric multiplicity of the repeated eigenvalue is strictly less than its algebraic multiplicity",
              "否，因为重特征值的几何重数严格小于其代数重数",
            );
        const wrong = isDiag
          ? [
              t("No, because the matrix has repeated eigenvalues", "否，因为该矩阵具有重特征值"),
              t("No, because the determinant is zero", "否，因为其行列式为零"),
              t("Yes, but only over the complex numbers", "是，但仅在复数域上可对角化"),
            ]
          : [
              t("Yes, because every upper triangular matrix is diagonalizable", "是，因为所有上三角矩阵均可对角化"),
              t("Yes, because it has 3 distinct eigenvalues", "是，因为其具有 3 个互异特征值"),
              t("No, because its trace is non-zero", "否，因为其迹非零"),
            ];
        const shiftStr = formatShift(lambda, "I");
        const solution = isDiag
          ? t(
              `The eigenvalue $\\lambda = ${lambda}$ has algebraic multiplicity 2. Since $A${shiftStr} = ${mat3Latex([
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, mu - lambda],
              ])}$ has rank 1, its nullity is $3 - 1 = 2$. Since geometric multiplicity equals algebraic multiplicity for all eigenvalues, $A$ is diagonalizable.`,
              `特征值 $\\lambda = ${lambda}$ 的代数重数为 2。因为 $A${shiftStr} = ${mat3Latex([
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, mu - lambda],
              ])}$ 的秩为 1，零度为 $3 - 1 = 2$。所有特征值的几何重数均等于代数重数，因此 $A$ 可对角化。`,
            )
          : t(
              `The eigenvalue $\\lambda = ${lambda}$ has algebraic multiplicity 2. Since $A${shiftStr} = ${mat3Latex([
                [0, a, 0],
                [0, 0, 0],
                [0, 0, mu - lambda],
              ])}$ has rank 2, its nullity (geometric multiplicity) is only $3 - 2 = 1 < 2$. Hence, $A$ is not diagonalizable.`,
              `特征值 $\\lambda = ${lambda}$ 的代数重数为 2。因为 $A${shiftStr} = ${mat3Latex([
                [0, a, 0],
                [0, 0, 0],
                [0, 0, mu - lambda],
              ])}$ 的秩为 2，其零度（几何重数）仅为 $3 - 2 = 1 < 2$。因此 $A$ 不可对角化。`,
            );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "counting-independent-eigenvectors",
      title: t("Counting independent eigenvectors", "数线性无关的特征向量"),
      explanation: t(
        "A $3 \\times 3$ matrix is diagonalizable exactly when it has $3$ linearly independent eigenvectors. Eigenvectors for different eigenvalues are independent, and the eigenspace of $\\lambda$ contributes $3 - \\operatorname{rank}(A - \\lambda I)$ of them. So count, for each eigenvalue, the dimension of its eigenspace and add them up.",
        "$3 \\times 3$ 矩阵可对角化当且仅当它有 $3$ 个线性无关的特征向量。不同特征值的特征向量线性无关，$\\lambda$ 的特征空间提供 $3 - \\operatorname{rank}(A - \\lambda I)$ 个。所以对每个特征值求其特征空间的维数，再加起来。",
      ),
      generate(rng: Rng): Problem {
        const lam = rng.int(-4, 4);
        const mu = lam + rng.pick([-3, -2, -1, 1, 2, 3]);
        const a = rng.int(0, 1) === 0 ? 0 : rng.int(1, 4) * rng.pick([-1, 1]);
        const M: Mat3 = [
          [lam, a, rng.int(-3, 3)],
          [0, lam, rng.int(-3, 3)],
          [0, 0, mu],
        ];
        const dimLam = a === 0 ? 2 : 1;
        const ans = dimLam + 1;
        return numberProblem({
          prompt: t(
            `How many linearly independent eigenvectors does $A = ${mat3Latex(M)}$ have?`,
            `$A = ${mat3Latex(M)}$ 有多少个线性无关的特征向量？`,
          ),
          answer: ans,
          wrong: [5 - ans, 1, 3],
          solution: t(
            `For $\\lambda = ${lam}$, $A - ${paren(lam)}I$ has rank $${3 - dimLam}$, so its eigenspace has dimension $${dimLam}$; $\\lambda = ${mu}$ adds one more. In total there are $${ans}$${ans === 3 ? ", so $A$ is diagonalizable" : ", so $A$ is not diagonalizable"}.`,
            `对 $\\lambda = ${lam}$，$A - ${paren(lam)}I$ 的秩为 $${3 - dimLam}$，所以其特征空间维数为 $${dimLam}$；$\\lambda = ${mu}$ 再提供一个。共有 $${ans}$ 个${ans === 3 ? "，所以 $A$ 可对角化" : "，所以 $A$ 不可对角化"}。`,
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 5.18: REAL MATRICES WITH COMPLEX EIGENVALUES
// ════════════════════════════════════════════════════════════════════════════

/** vectorsOverTheComplexNumbers covers operations on vectors in C^n. */
export const vectorsOverTheComplexNumbers: TopicDef = {
  id: "vectors-over-the-complex-numbers",
  title: t("Vectors Over the Complex Numbers", "复数域上的向量"),
  summary: t(
    "Decompose complex vectors into real and imaginary parts and compute complex conjugates.",
    "将复向量分解为实部与虚部，并计算复共轭向量。",
  ),
  prerequisites: ["diagonalizing-a-3x3-matrix-in-the-general-case"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "complex-vector-decomposition",
      title: t("Complex Vector Decomposition", "复向量的分解"),
      explanation: t(
        "Splitting each entry into its real and imaginary parts writes a complex vector as a real vector plus $i$ times another real vector. Express a complex vector $\\mathbf{v} \\in \\mathbb{C}^n$ as $\\mathbf{v} = \\operatorname{Re}(\\mathbf{v}) + i \\operatorname{Im}(\\mathbf{v})$ and find its conjugate.",
        "把每个分量拆成实部和虚部，就把复向量写成一个实向量加上 $i$ 乘以另一个实向量。将复向量 $\\mathbf{v} \\in \\mathbb{C}^n$ 表示为 $\\mathbf{v} = \\operatorname{Re}(\\mathbf{v}) + i \\operatorname{Im}(\\mathbf{v})$ 并求其复共轭。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(-6, 6);
        const b = rng.pick([-5, -4, -3, 3, 4, 5])!;
        const c = rng.int(-6, 6);
        const d = rng.pick([-5, -4, -3, 3, 4, 5])!;
        const vStr: readonly [string, string] = [formatComplex(a, b), formatComplex(c, d)];
        const askRe = rng.bool();
        if (askRe) {
          const prompt = t(
            `Let $\\mathbf{v} = ${vec2Latex(vStr)} \\in \\mathbb{C}^2$. What is the real part $\\operatorname{Re}(\\mathbf{v})$? Enter your answer as a vector $\\langle x_1, x_2 \\rangle$.`,
            `设 $\\mathbf{v} = ${vec2Latex(vStr)} \\in \\mathbb{C}^2$。求其实部 $\\operatorname{Re}(\\mathbf{v})$。请以向量 $\\langle x_1, x_2 \\rangle$ 的形式作答。`,
          );
          const solution = t(
            `The real part takes the real components: $\\operatorname{Re}(\\mathbf{v}) = \\langle ${a}, ${c} \\rangle$.`,
            `实部取各分量的实部：$\\operatorname{Re}(\\mathbf{v}) = \\langle ${a}, ${c} \\rangle$。`,
          );
          return pointProblem({
            prompt,
            answer: [a, c],
            vector: true,
            solution,
            wrong: [
              [b, d],
              [-a, -c],
              [a, b],
              [c, d],
            ],
          });
        }
        const prompt = t(
          `Let $\\mathbf{v} = ${vec2Latex(vStr)} \\in \\mathbb{C}^2$. What is the imaginary part $\\operatorname{Im}(\\mathbf{v})$? Enter your answer as a vector $\\langle y_1, y_2 \\rangle$.`,
          `设 $\\mathbf{v} = ${vec2Latex(vStr)} \\in \\mathbb{C}^2$。求其虚部 $\\operatorname{Im}(\\mathbf{v})$。请以向量 $\\langle y_1, y_2 \\rangle$ 的形式作答。`,
        );
        const solution = t(
          `The imaginary part takes the coefficients of $i$: $\\operatorname{Im}(\\mathbf{v}) = \\langle ${b}, ${d} \\rangle$.`,
          `虚部取各分量中 $i$ 的系数：$\\operatorname{Im}(\\mathbf{v}) = \\langle ${b}, ${d} \\rangle$。`,
        );
        return pointProblem({
          prompt,
          answer: [b, d],
          vector: true,
          solution,
          wrong: [
            [a, c],
            [-b, -d],
            [a, b],
            [c, d],
          ],
        });
      },
    },
    {
      id: "the-length-of-a-complex-vector",
      title: t("The length of a complex vector", "复向量的长度"),
      explanation: t(
        "In $\\mathbb{C}^n$ the length is defined with absolute values, so that it is a non-negative real number:\n\n$$\\|\\mathbf{v}\\|^2 = |v_1|^2 + |v_2|^2, \\qquad |a + bi|^2 = a^2 + b^2.$$\n\nSquaring the components themselves would give complex numbers and could even give $0$ for a non-zero vector, as for $(1, i)$.",
        "在 $\\mathbb{C}^n$ 中长度用绝对值定义，使之成为非负实数：\n\n$$\\|\\mathbf{v}\\|^2 = |v_1|^2 + |v_2|^2, \\qquad |a + bi|^2 = a^2 + b^2.$$\n\n若直接把分量平方，会得到复数，对非零向量甚至可能得到 $0$，例如 $(1, i)$。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c, d] = [rng.int(-5, 5), rng.int(-5, 5) || 1, rng.int(-5, 5), rng.int(-5, 5) || -2];
        const ans = a * a + b * b + c * c + d * d;
        return numberProblem({
          prompt: t(
            `Find $\\|\\mathbf{v}\\|^2$ for $\\mathbf{v} = ${vec2Latex([formatComplex(a, b), formatComplex(c, d)])} \\in \\mathbb{C}^2$.`,
            `求 $\\mathbf{v} = ${vec2Latex([formatComplex(a, b), formatComplex(c, d)])} \\in \\mathbb{C}^2$ 的 $\\|\\mathbf{v}\\|^2$。`,
          ),
          answer: ans,
          wrong: [a * a - b * b + c * c - d * d, a * a + c * c, (a + c) ** 2 + (b + d) ** 2],
          solution: t(
            `$|${formatComplex(a, b)}|^2 = ${a * a + b * b}$ and $|${formatComplex(c, d)}|^2 = ${c * c + d * d}$, so $\\|\\mathbf{v}\\|^2 = ${ans}$.`,
            `$|${formatComplex(a, b)}|^2 = ${a * a + b * b}$，$|${formatComplex(c, d)}|^2 = ${c * c + d * d}$，所以 $\\|\\mathbf{v}\\|^2 = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** matricesOverTheComplexNumbers covers complex matrices and conjugate transpose. */
export const matricesOverTheComplexNumbers: TopicDef = {
  id: "matrices-over-the-complex-numbers",
  title: t("Matrices Over the Complex Numbers", "复数域上的矩阵"),
  summary: t(
    "Compute the conjugate transpose (Hermitian adjoint) and basic operations on complex matrices.",
    "计算复矩阵的共轭转置（埃尔米特伴随）及基本运算。",
  ),
  prerequisites: ["vectors-over-the-complex-numbers"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "conjugate-transpose-complex-matrix",
      title: t("Conjugate Transpose of a Complex Matrix", "复矩阵的共轭转置"),
      explanation: t(
        "The conjugate transpose combines two operations: swap rows and columns, and replace every entry by its complex conjugate. Calculate the conjugate transpose $A^* = \\bar{A}^T$ of a $2 \\times 2$ complex matrix.",
        "共轭转置结合了两个操作：交换行与列，并把每个元素换成它的共轭复数。计算 $2 \\times 2$ 复矩阵的共轭转置 $A^* = \\bar{A}^T$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(-3, 3);
        const b = rng.pick([-4, -3, 3, 4])!;
        const c = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4])!;
        const d = rng.pick([-4, -3, 3, 4])!;
        const biStr = formatComplex(0, b);
        const ciStr = formatComplex(0, c);
        const negCiStr = formatComplex(0, -c);
        const negBiStr = formatComplex(0, -b);
        const mStr: readonly [readonly [string, string], readonly [string, string]] = [
          [`${a}`, biStr],
          [ciStr, `${d}`],
        ];
        const mAdjStr: readonly [readonly [string, string], readonly [string, string]] = [
          [`${a}`, negCiStr],
          [negBiStr, `${d}`],
        ];
        const prompt = t(
          `Find the conjugate transpose (Hermitian adjoint) $A^* = \\overline{A}^T$ of the matrix $A = ${mat2StrLatex(mStr)}$.`,
          `求矩阵 $A = ${mat2StrLatex(mStr)}$ 的共轭转置（埃尔米特伴随）$A^* = \\overline{A}^T$。`,
        );
        const right = t(`$${mat2StrLatex(mAdjStr)}$`, `$${mat2StrLatex(mAdjStr)}$`);
        const wrong = [
          t(
            `$${mat2StrLatex([
              [mStr[0][0], mStr[1][0]],
              [mStr[0][1], mStr[1][1]],
            ])}$`,
            `$${mat2StrLatex([
              [mStr[0][0], mStr[1][0]],
              [mStr[0][1], mStr[1][1]],
            ])}$`,
          ),
          t(
            `$${mat2StrLatex([
              [`${a}`, negBiStr],
              [negCiStr, `${d}`],
            ])}$`,
            `$${mat2StrLatex([
              [`${a}`, negBiStr],
              [negCiStr, `${d}`],
            ])}$`,
          ),
          t(
            `$${mat2StrLatex([
              [`${-a}`, ciStr],
              [biStr, `${-d}`],
            ])}$`,
            `$${mat2StrLatex([
              [`${-a}`, ciStr],
              [biStr, `${-d}`],
            ])}$`,
          ),
          t(
            `$${mat2StrLatex([
              [`${a}`, biStr],
              [ciStr, `${d}`],
            ])}$`,
            `$${mat2StrLatex([
              [`${a}`, biStr],
              [ciStr, `${d}`],
            ])}$`,
          ),
        ];
        const solution = t(
          `To find $A^*$, transpose the matrix and take the complex conjugate of each entry: $\\overline{A}^T = ${mat2StrLatex(mAdjStr)}$.`,
          `求 $A^*$ 时，先将矩阵转置，再对每个元素取复共轭：$\\overline{A}^T = ${mat2StrLatex(mAdjStr)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-trace-of-a-matrix-times-its-conjugate-transpose",
      title: t("The trace of a matrix times its conjugate transpose", "矩阵与其共轭转置之积的迹"),
      explanation: t(
        "For a complex matrix $A$, the diagonal entries of $AA^*$ are $\\sum_j a_{ij}\\overline{a_{ij}} = \\sum_j |a_{ij}|^2$, the squared lengths of the rows. So\n\n$$\\operatorname{tr}(AA^*) = \\sum_{i, j} |a_{ij}|^2,$$\n\nthe sum of the squared absolute values of all entries. It is always a non-negative real number, even though $A$ is complex.",
        "对复矩阵 $A$，$AA^*$ 的对角元为 $\\sum_j a_{ij}\\overline{a_{ij}} = \\sum_j |a_{ij}|^2$，即各行长度的平方。所以\n\n$$\\operatorname{tr}(AA^*) = \\sum_{i, j} |a_{ij}|^2,$$\n\n即所有元素绝对值平方之和。即使 $A$ 是复矩阵，它也总是非负实数。",
      ),
      generate(rng: Rng): Problem {
        const z = [0, 1, 2, 3].map(() => [rng.int(-3, 3), rng.int(-3, 3)] as const);
        if (z.every(([, b]) => b === 0)) z[1] = [z[1]![0], 2];
        const ent = z.map(([a, b]) => formatComplex(a, b));
        const sq = z.map(([a, b]) => a * a + b * b);
        const ans = sq.reduce((x, y) => x + y, 0);
        const A = mat2StrLatex([
          [ent[0]!, ent[1]!],
          [ent[2]!, ent[3]!],
        ]);
        return numberProblem({
          prompt: t(`Find $\\operatorname{tr}(AA^*)$ for $A = ${A}$.`, `求 $A = ${A}$ 的 $\\operatorname{tr}(AA^*)$。`),
          answer: ans,
          wrong: [z.reduce((x, [a, b]) => x + a * a - b * b, 0), z.reduce((x, [a]) => x + a * a, 0), sq[0]! + sq[3]!],
          solution: t(
            `$\\operatorname{tr}(AA^*)$ is the sum of $|a_{ij}|^2$: $${sq.join(" + ")} = ${ans}$.`,
            `$\\operatorname{tr}(AA^*)$ 等于各 $|a_{ij}|^2$ 之和：$${sq.join(" + ")} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** findingComplexEigenvaluesOfReal2x2Matrices finds complex conjugate eigenvalues of real 2x2 matrices. */
export const findingComplexEigenvaluesOfReal2x2Matrices: TopicDef = {
  id: "finding-complex-eigenvalues-of-real-2x2-matrices",
  title: t("Finding Complex Eigenvalues of Real 2x2 Matrices", "求实 2x2 矩阵的复特征值"),
  summary: t(
    "Find the complex conjugate pair of eigenvalues a +- bi for real 2x2 matrices with negative discriminant.",
    "求判别式为负的实 2x2 矩阵的共轭复特征值对 a +- bi。",
  ),
  prerequisites: ["matrices-over-the-complex-numbers"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "computing-complex-eigenvalues-2x2-kp",
      title: t("Computing Complex Eigenvalues of 2x2 Matrices", "计算 2x2 矩阵的复特征值"),
      explanation: t(
        "When the characteristic quadratic has a negative discriminant, the quadratic formula gives a pair of complex conjugate eigenvalues. Solve the characteristic quadratic equation when $\\operatorname{tr}(A)^2 - 4\\det(A) < 0$.",
        "当特征二次方程的判别式为负时，求根公式给出一对共轭复特征值。在 $\\operatorname{tr}(A)^2 - 4\\det(A) < 0$ 时求解特征二次方程。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(-4, 4);
        const b = rng.int(1, 6);
        // Matrix [[a, -b], [b, a]] has eigenvalues a +- bi
        const mat: Mat2 = [
          [a, -b],
          [b, a],
        ];
        const eigPair = formatComplexPair(a, b);
        const prompt = t(`Find the eigenvalues of the real matrix $A = ${mat2Latex(mat)}$.`, `求实矩阵 $A = ${mat2Latex(mat)}$ 的特征值。`);
        const right = t(`$\\lambda = ${eigPair}$`, `$\\lambda = ${eigPair}$`);
        const wrong = [
          t(`$\\lambda = ${formatComplexPair(-a, b)}$`, `$\\lambda = ${formatComplexPair(-a, b)}$`),
          t(`$\\lambda = ${formatComplexPair(b, Math.abs(a) || 1)}$`, `$\\lambda = ${formatComplexPair(b, Math.abs(a) || 1)}$`),
          t(`$\\lambda = ${a} \\pm ${b}$`, `$\\lambda = ${a} \\pm ${b}$`),
          t(`$\\lambda = ${formatComplexPair(0, b)}$`, `$\\lambda = ${formatComplexPair(0, b)}$`),
        ];
        const aPart = a === 0 ? "\\lambda^2" : `(${formatFactor("\\lambda", a)})^2`;
        const solution = t(
          `The characteristic equation is $\\det(A - \\lambda I) = ${aPart} + ${b * b} = 0$. Solving gives $${aPart} = -${b * b}$, so $\\lambda = ${eigPair}$.`,
          `特征方程为 $\\det(A - \\lambda I) = ${aPart} + ${b * b} = 0$。解得 $${aPart} = -${b * b}$，因此 $\\lambda = ${eigPair}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-modulus-and-real-part-of-complex-eigenvalues",
      title: t("The modulus and real part of complex eigenvalues", "复特征值的模与实部"),
      explanation: t(
        "When a real $2 \\times 2$ matrix has $(\\operatorname{tr} A)^2 < 4\\det A$, its eigenvalues are a conjugate pair $\\alpha \\pm \\beta i$. Their sum is the trace and their product is the determinant, so\n\n$$\\alpha = \\frac{\\operatorname{tr} A}{2}, \\qquad |\\lambda|^2 = \\alpha^2 + \\beta^2 = \\det A.$$\n\nBoth can be read off without solving the quadratic.",
        "当实 $2 \\times 2$ 矩阵满足 $(\\operatorname{tr} A)^2 < 4\\det A$ 时，其特征值是一对共轭复数 $\\alpha \\pm \\beta i$。两者之和为迹，之积为行列式，所以\n\n$$\\alpha = \\frac{\\operatorname{tr} A}{2}, \\qquad |\\lambda|^2 = \\alpha^2 + \\beta^2 = \\det A.$$\n\n无需解二次方程就能读出两者。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-4, 4);
        const b = rng.int(1, 4);
        const A = complexEigenMatrix(rng, a, b);
        const wantMod = rng.int(0, 1) === 0;
        const det = a * a + b * b;
        const ans = wantMod ? det : a;
        return numberProblem({
          prompt: t(
            `The eigenvalues of $A = ${mat2Latex(A)}$ are a complex conjugate pair $\\lambda$, $\\bar{\\lambda}$. Find ${wantMod ? "$|\\lambda|^2$" : "$\\operatorname{Re}(\\lambda)$"}.`,
            `$A = ${mat2Latex(A)}$ 的特征值是一对共轭复数 $\\lambda$、$\\bar{\\lambda}$。求${wantMod ? " $|\\lambda|^2$" : " $\\operatorname{Re}(\\lambda)$"}。`,
          ),
          answer: ans,
          wrong: wantMod ? [b * b, a * a - b * b, 2 * a] : [2 * a, b, det],
          solution: t(
            `$\\operatorname{tr} A = ${2 * a}$ and $\\det A = ${det}$, so the eigenvalues are $${formatComplexPair(a, b)}$. ${wantMod ? `$|\\lambda|^2 = \\det A = ${det}$.` : `$\\operatorname{Re}(\\lambda) = \\frac{${2 * a}}{2} = ${a}$.`}`,
            `$\\operatorname{tr} A = ${2 * a}$，$\\det A = ${det}$，所以特征值为 $${formatComplexPair(a, b)}$。${wantMod ? `$|\\lambda|^2 = \\det A = ${det}$。` : `$\\operatorname{Re}(\\lambda) = \\frac{${2 * a}}{2} = ${a}$。`}`,
          ),
        });
      },
    },
  ],
};

/** findingComplexEigenvectorsOfReal2x2Matrices finds complex eigenvectors for real matrices. */
export const findingComplexEigenvectorsOfReal2x2Matrices: TopicDef = {
  id: "finding-complex-eigenvectors-of-real-2x2-matrices",
  title: t("Finding Complex Eigenvectors of Real 2x2 Matrices", "求实 2x2 矩阵的复特征向量"),
  summary: t(
    "Find a complex eigenvector corresponding to a complex eigenvalue of a real 2x2 matrix.",
    "求实 2x2 矩阵的复特征值对应的复特征向量。",
  ),
  prerequisites: ["finding-complex-eigenvalues-of-real-2x2-matrices"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "solving-for-complex-eigenvector-2x2-kp",
      title: t("Solving for Complex Eigenvectors of 2x2 Matrices", "求解 2x2 矩阵的复特征向量"),
      explanation: t(
        "The two rows of the shifted matrix are complex multiples of each other, so one row is enough to find an eigenvector. Find the nonzero solutions in $\\mathbb{C}^2$ of $(A - (a + bi)I)\\mathbf{v} = \\mathbf{0}$.",
        "平移后的矩阵的两行互为复数倍，所以只用一行就能求出特征向量。在 $\\mathbb{C}^2$ 中求方程 $(A - (a + bi)I)\\mathbf{v} = \\mathbf{0}$ 的非零解。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(-3, 3);
        const b = rng.int(1, 5);
        // A = [[a, -b], [b, a]] has eigenvalues a ∓ bi. For λ = a - sbi (s = ±1), the first row of
        // A - λI is (sbi, -b), so sbi v1 - b v2 = 0 and v2 = si v1: v = (1, si).
        const s = rng.pick([1, -1]);
        const mat: Mat2 = [
          [a, -b],
          [b, a],
        ];
        const eigStr = formatComplex(a, -s * b);
        const prompt = t(
          `For the matrix $A = ${mat2Latex(mat)}$, which of the following is an eigenvector corresponding to the eigenvalue $\\lambda = ${eigStr}$?`,
          `对于矩阵 $A = ${mat2Latex(mat)}$，下列哪个向量是对应特征值 $\\lambda = ${eigStr}$ 的特征向量？`,
        );
        const si = s === 1 ? "i" : "-i";
        const vec = (v: [string, string]) => t(`$${vec2Latex(v)}$`, `$${vec2Latex(v)}$`);
        const right = vec(["1", si]);
        const wrong = [vec(["1", s === 1 ? "-i" : "i"]), vec(["1", "1"]), vec([si, "1"]), vec(["-1", si])];
        const biStr = formatComplex(0, s * b);
        const v2Term = b === 1 ? "v_2" : `${b} v_2`;
        const solution = t(
          `We solve $(A - (${eigStr})I)\\mathbf{v} = \\mathbf{0}$: $\\begin{pmatrix} ${biStr} & -${b} \\\\ ${b} & ${biStr} \\end{pmatrix} \\begin{pmatrix} v_1 \\\\ v_2 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$. The first row gives $${biStr} v_1 - ${v2Term} = 0$, so $v_2 = ${si} v_1$. Choosing $v_1 = 1$ gives $\\mathbf{v} = ${vec2Latex(["1", si])}$.`,
          `求解方程 $(A - (${eigStr})I)\\mathbf{v} = \\mathbf{0}$：$\\begin{pmatrix} ${biStr} & -${b} \\\\ ${b} & ${biStr} \\end{pmatrix} \\begin{pmatrix} v_1 \\\\ v_2 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$。第一行给出 $${biStr} v_1 - ${v2Term} = 0$，即 $v_2 = ${si} v_1$。取 $v_1 = 1$ 可得 $\\mathbf{v} = ${vec2Latex(["1", si])}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "a-complex-eigenvector-from-the-first-row",
      title: t("A complex eigenvector from the first row", "由第一行求复特征向量"),
      explanation: t(
        "For a complex eigenvalue $\\lambda$ of $A = \\begin{pmatrix} p & q \\\\ r & s \\end{pmatrix}$ with $q \\ne 0$, the first row of $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ is $(p - \\lambda)v_1 + qv_2 = 0$. It is solved by\n\n$$\\mathbf{v} = \\begin{pmatrix} q \\\\ \\lambda - p \\end{pmatrix}.$$\n\nThe second row is then satisfied automatically because $\\lambda$ is an eigenvalue. The eigenvector for $\\bar{\\lambda}$ is the conjugate $\\bar{\\mathbf{v}}$.",
        "对 $A = \\begin{pmatrix} p & q \\\\ r & s \\end{pmatrix}$（$q \\ne 0$）的复特征值 $\\lambda$，$(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ 的第一行为 $(p - \\lambda)v_1 + qv_2 = 0$。它的一个解是\n\n$$\\mathbf{v} = \\begin{pmatrix} q \\\\ \\lambda - p \\end{pmatrix}.$$\n\n由于 $\\lambda$ 是特征值，第二行自动成立。$\\bar{\\lambda}$ 的特征向量是共轭 $\\bar{\\mathbf{v}}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 3);
        const b = rng.int(1, 4);
        const A = complexEigenMatrix(rng, a, b);
        const p = A[0][0];
        const q = A[0][1];
        const opt = (x: string, y: string): Text => {
          const v = vec2Latex([x, y]);
          return t(`$${v}$`, `$${v}$`);
        };
        const right = opt(String(q), formatComplex(a - p, b));
        return oneOf(
          rng,
          t(
            `Which vector is an eigenvector of $A = ${mat2Latex(A)}$ for $\\lambda = ${formatComplex(a, b)}$?`,
            `哪个向量是 $A = ${mat2Latex(A)}$ 对应于 $\\lambda = ${formatComplex(a, b)}$ 的特征向量？`,
          ),
          right,
          [opt(String(q), formatComplex(a - p, -b)), opt(String(q), formatComplex(p - a, b)), opt(formatComplex(a - p, b), String(q))],
          t(
            `The first row of $A - \\lambda I$ is $(${formatComplex(p - a, -b)}, ${q})$, so $\\mathbf{v} = ${vec2Latex([String(q), formatComplex(a - p, b)])}$ satisfies $(${formatComplex(p - a, -b)})v_1 ${formatLinearComb2(
              0,
              "",
              q,
              "v_2",
            )
              .replace(/^-/, "- ")
              .replace(/^(?!-)/, "+ ")} = 0$.`,
            `$A - \\lambda I$ 的第一行为 $(${formatComplex(p - a, -b)}, ${q})$，所以 $\\mathbf{v} = ${vec2Latex([String(q), formatComplex(a - p, b)])}$ 满足 $(${formatComplex(p - a, -b)})v_1 ${formatLinearComb2(
              0,
              "",
              q,
              "v_2",
            )
              .replace(/^-/, "- ")
              .replace(/^(?!-)/, "+ ")} = 0$。`,
          ),
        );
      },
    },
  ],
};

/** rotationScalingMatrices covers rotation-scaling matrices C = [[a, -b], [b, a]]. */
export const rotationScalingMatrices: TopicDef = {
  id: "rotation-scaling-matrices",
  title: t("Rotation-Scaling Matrices", "旋转缩放矩阵"),
  summary: t(
    "Analyze rotation-scaling matrices, computing the scale factor $r = \\sqrt{a^2 + b^2}$ and the rotation angle.",
    "分析旋转缩放矩阵，计算缩放因子 $r = \\sqrt{a^2 + b^2}$ 与旋转角。",
  ),
  prerequisites: ["finding-complex-eigenvectors-of-real-2x2-matrices"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "rotation-scaling-scale-factor",
      title: t("Rotation-Scaling Scale Factor", "旋转缩放矩阵的缩放因子"),
      explanation: t(
        "A rotation scaling matrix multiplies lengths by a fixed factor while it rotates, and that factor is the modulus of the complex eigenvalue. Compute the square of the scaling factor, $r^2 = a^2 + b^2$, for a rotation-scaling matrix.",
        "旋转缩放矩阵在旋转的同时把长度乘以一个固定的因子，这个因子就是复特征值的模。计算旋转缩放矩阵缩放因子的平方 $r^2 = a^2 + b^2$。",
      ),
      generate: (rng: Rng): Problem => {
        const [baseA, baseB, r] = rng.pick(pythagoreanTriples)!;
        const signA = rng.pick([-1, 1])!;
        const signB = rng.pick([-1, 1])!;
        const a = signA * baseA;
        const b = signB * baseB;
        const mat: Mat2 = [
          [a, -b],
          [b, a],
        ];
        const prompt = t(
          `A rotation-scaling matrix has the form $C = ${mat2Latex(mat)}$. What is its scaling factor $r = \\sqrt{a^2 + b^2}$?`,
          `旋转缩放矩阵具有形式 $C = ${mat2Latex(mat)}$。求其缩放因子 $r = \\sqrt{a^2 + b^2}$。`,
        );
        const solution = t(
          `A rotation-scaling matrix can be factored as $r \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$, where $r = \\sqrt{a^2 + b^2} = \\sqrt{(${a})^2 + (${b})^2} = \\sqrt{${a * a + b * b}} = ${r}$.`,
          `旋转缩放矩阵可分解为 $r \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$，其中 $r = \\sqrt{a^2 + b^2} = \\sqrt{(${a})^2 + (${b})^2} = \\sqrt{${a * a + b * b}} = ${r}$。`,
        );
        return numberProblem({
          prompt,
          answer: r,
          solution,
          wrong: [r * r, Math.abs(a), Math.abs(b), Math.abs(a) + Math.abs(b)].filter((w) => w !== r),
        });
      },
    },
    {
      id: "the-rotation-angle-of-a-rotation-scaling-matrix",
      title: t("The rotation angle of a rotation-scaling matrix", "旋转伸缩矩阵的旋转角"),
      explanation: t(
        "A rotation-scaling matrix $C = \\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ equals $r\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$ with $r = \\sqrt{a^2 + b^2}$. The angle $\\theta$ is the argument of the point $(a, b)$: find the quadrant from the signs of $a$ and $b$, then the reference angle from $\\tan\\theta = \\frac{b}{a}$.",
        "旋转伸缩矩阵 $C = \\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ 等于 $r\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$，其中 $r = \\sqrt{a^2 + b^2}$。角 $\\theta$ 是点 $(a, b)$ 的辐角：先由 $a$、$b$ 的符号确定象限，再由 $\\tan\\theta = \\frac{b}{a}$ 求参考角。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 6);
        const dirs = [
          [1, 0, 0],
          [1, 1, 45],
          [0, 1, 90],
          [-1, 1, 135],
          [-1, 0, 180],
          [-1, -1, 225],
          [0, -1, 270],
          [1, -1, 315],
        ] as const;
        const idx = rng.int(0, 7);
        const [sa, sb, deg] = dirs[idx]!;
        const a = sa * k;
        const b = sb * k;
        const opt = (d: number): Text => t(`$${d}^{\\circ}$`, `$${d}^{\\circ}$`);
        const others = [dirs[(idx + 2) % 8]![2], dirs[(idx + 4) % 8]![2], dirs[(idx + 6) % 8]![2]];
        return oneOf(
          rng,
          t(
            `Find the rotation angle $\\theta$, with $0^{\\circ} \\le \\theta < 360^{\\circ}$, of the rotation-scaling matrix $C = ${mat2Latex(
              [
                [a, -b],
                [b, a],
              ],
            )}$.`,
            `求旋转伸缩矩阵 $C = ${mat2Latex([
              [a, -b],
              [b, a],
            ])}$ 的旋转角 $\\theta$（$0^{\\circ} \\le \\theta < 360^{\\circ}$）。`,
          ),
          opt(deg),
          others.map(opt),
          t(
            `Here $(a, b) = (${a}, ${b})$, which points at angle $${deg}^{\\circ}$; the scaling factor is $r = ${b === 0 || a === 0 ? k : `${k}\\sqrt{2}`}$.`,
            `这里 $(a, b) = (${a}, ${b})$，其方向角为 $${deg}^{\\circ}$；伸缩因子为 $r = ${b === 0 || a === 0 ? k : `${k}\\sqrt{2}`}$。`,
          ),
        );
      },
    },
  ],
};

/** reducingReal2x2MatricesToRotationScalingForm reduces real matrices to canonical rotation-scaling form. */
export const reducingReal2x2MatricesToRotationScalingForm: TopicDef = {
  id: "reducing-real-2x2-matrices-to-rotation-scaling-form",
  title: t("Reducing Real 2x2 Matrices to Rotation-Scaling Form", "将实 2x2 矩阵化为旋转缩放形式"),
  summary: t(
    "Find the matrix $P = \\begin{pmatrix} \\operatorname{Re}\\mathbf{v} & \\operatorname{Im}\\mathbf{v} \\end{pmatrix}$ that brings $A$ to rotation-scaling form $A = PCP^{-1}$.",
    "构造矩阵 $P = \\begin{pmatrix} \\operatorname{Re}\\mathbf{v} & \\operatorname{Im}\\mathbf{v} \\end{pmatrix}$，使实矩阵 $A$ 化为旋转缩放形式 $A = PCP^{-1}$。",
  ),
  prerequisites: ["rotation-scaling-matrices"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "constructing-rotation-scaling-basis",
      title: t("Constructing the Rotation-Scaling Basis", "构造旋转缩放基"),
      explanation: t(
        "Using the real and imaginary parts of a complex eigenvector as a basis turns the matrix into a rotation scaling matrix with real entries. Assemble $P = \\begin{bmatrix} \\operatorname{Re}(\\mathbf{v}) & \\operatorname{Im}(\\mathbf{v}) \\end{bmatrix}$ for an eigenvector $\\mathbf{v}$ of the eigenvalue $a - bi$.",
        "用复特征向量的实部和虚部作为基，就能把矩阵化为实元素的旋转缩放矩阵。利用特征值 $a - bi$ 的特征向量 $\\mathbf{v}$ 构造矩阵 $P = \\begin{bmatrix} \\operatorname{Re}(\\mathbf{v}) & \\operatorname{Im}(\\mathbf{v}) \\end{bmatrix}$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(-3, 3);
        const b = rng.int(1, 5);
        const eigStr = formatComplex(a, -b);
        const prompt = t(
          `Let $A$ be a real $2 \\times 2$ matrix with eigenvalue $\\lambda = ${eigStr}$ and corresponding eigenvector $v = v_{\\text{re}} + i v_{\\text{im}}$. Which matrix $P$ satisfies $A = P C P^{-1}$ with $C = \\begin{pmatrix} ${a} & -${b} \\\\ ${b} & ${a} \\end{pmatrix}$?`,
          `设 $A$ 为实 $2 \\times 2$ 矩阵，具有特征值 $\\lambda = ${eigStr}$ 及对应特征向量 $v = v_{\\text{re}} + i v_{\\text{im}}$。哪个矩阵 $P$ 满足 $A = P C P^{-1}$，其中 $C = \\begin{pmatrix} ${a} & -${b} \\\\ ${b} & ${a} \\end{pmatrix}$？`,
        );
        const right = t(
          `$P = \\begin{pmatrix} v_{\\text{re}} & v_{\\text{im}} \\end{pmatrix}$`,
          `$P = \\begin{pmatrix} v_{\\text{re}} & v_{\\text{im}} \\end{pmatrix}$`,
        );
        const wrong = [
          t(
            `$P = \\begin{pmatrix} v_{\\text{im}} & v_{\\text{re}} \\end{pmatrix}$`,
            `$P = \\begin{pmatrix} v_{\\text{im}} & v_{\\text{re}} \\end{pmatrix}$`,
          ),
          t(
            `$P = \\begin{pmatrix} v_{\\text{re}} & -v_{\\text{im}} \\end{pmatrix}$`,
            `$P = \\begin{pmatrix} v_{\\text{re}} & -v_{\\text{im}} \\end{pmatrix}$`,
          ),
          t(`$P = \\begin{pmatrix} v & \\bar{v} \\end{pmatrix}$`, `$P = \\begin{pmatrix} v & \\bar{v} \\end{pmatrix}$`),
          t(
            `$P = \\begin{pmatrix} v_{\\text{re}} + v_{\\text{im}} & v_{\\text{re}} - v_{\\text{im}} \\end{pmatrix}$`,
            `$P = \\begin{pmatrix} v_{\\text{re}} + v_{\\text{im}} & v_{\\text{re}} - v_{\\text{im}} \\end{pmatrix}$`,
          ),
        ];
        const solution = t(
          `By the Real Canonical Form Theorem, for eigenvalue $\\lambda = a - bi$, setting $P = \\begin{pmatrix} \\operatorname{Re}(v) & \\operatorname{Im}(v) \\end{pmatrix}$ gives $AP = P C$, so $A = P C P^{-1}$ with $C = \\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$.`,
          `由实标准型定理，对于特征值 $\\lambda = a - bi$，取 $P = \\begin{pmatrix} \\operatorname{Re}(v) & \\operatorname{Im}(v) \\end{pmatrix}$ 可得 $AP = P C$，从而 $A = P C P^{-1}$，其中 $C = \\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-scaling-factor-of-a-real-matrix-with-complex-eigenvalues",
      title: t("The scaling factor of a real matrix with complex eigenvalues", "具有复特征值的实矩阵的伸缩因子"),
      explanation: t(
        "A real $2 \\times 2$ matrix with eigenvalues $\\alpha \\pm \\beta i$ is similar to the rotation-scaling matrix $C = \\begin{pmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{pmatrix}$. Similar matrices have the same determinant, so the scaling factor of $C$ is\n\n$$r = \\sqrt{\\alpha^2 + \\beta^2} = \\sqrt{\\det A}.$$\n\nRepeated multiplication by $A$ stretches vectors by roughly $r$ each time.",
        "具有特征值 $\\alpha \\pm \\beta i$ 的实 $2 \\times 2$ 矩阵相似于旋转伸缩矩阵 $C = \\begin{pmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{pmatrix}$。相似矩阵行列式相同，所以 $C$ 的伸缩因子为\n\n$$r = \\sqrt{\\alpha^2 + \\beta^2} = \\sqrt{\\det A}.$$\n\n反复乘以 $A$ 时，向量每次大约被拉伸 $r$ 倍。",
      ),
      generate(rng: Rng): Problem {
        const [x, y, r] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [0, 2, 2],
          [0, 3, 3],
          [6, 8, 10],
          [5, 12, 13],
          [0, 1, 1],
        ] as const);
        const a = x * rng.pick([-1, 1]);
        const b = y;
        const A = complexEigenMatrix(rng, a, b);
        return numberProblem({
          prompt: t(
            `The real matrix $A = ${mat2Latex(A)}$ is similar to a rotation-scaling matrix $C$. Find the scaling factor $r$ of $C$.`,
            `实矩阵 $A = ${mat2Latex(A)}$ 相似于旋转伸缩矩阵 $C$。求 $C$ 的伸缩因子 $r$。`,
          ),
          answer: r,
          wrong: [r * r, Math.abs(a) + b, b],
          solution: t(
            `$\\det A = ${r * r}$, and the eigenvalues are $${formatComplexPair(a, b)}$, so $r = \\sqrt{${r * r}} = ${r}$.`,
            `$\\det A = ${r * r}$，特征值为 $${formatComplexPair(a, b)}$，所以 $r = \\sqrt{${r * r}} = ${r}$。`,
          ),
        });
      },
    },
  ],
};

/** blockDiagonalizationOfNxNMatrices decomposes real matrices into 1x1 and 2x2 diagonal blocks. */
export const blockDiagonalizationOfNxNMatrices: TopicDef = {
  id: "block-diagonalization-of-nxn-matrices",
  title: t("Block Diagonalization of NxN Matrices", "NxN 矩阵的分块对角化"),
  summary: t(
    "Decompose real matrices into real canonical block diagonal form with 1x1 real blocks and 2x2 rotation-scaling blocks.",
    "将实矩阵分解为含有 1x1 实特征值块和 2x2 旋转缩放块的实标准型分块对角矩阵。",
  ),
  prerequisites: ["reducing-real-2x2-matrices-to-rotation-scaling-form"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "real-canonical-block-structure",
      title: t("Real Canonical Block Structure", "实标准型的分块结构"),
      explanation: t(
        "Each real eigenvalue gives a single diagonal entry, while each pair of complex conjugate eigenvalues gives a two by two rotation scaling block. Determine the block diagonal structure from real and complex conjugate pairs of eigenvalues.",
        "每个实特征值给出一个对角元素，而每对共轭复特征值给出一个二阶旋转缩放块。根据实特征值与共轭复特征值对确定分块对角结构。",
      ),
      generate: (rng: Rng): Problem => {
        // kind: 0 three real eigenvalues (3 × 3), 1 one real and a pair (3 × 3), 2 two pairs (4 × 4), 3 two real and a pair (4 × 4).
        const kind = rng.int(0, 3);
        const reals = rng.sample([-4, -3, -2, -1, 0, 1, 2, 3, 4], [3, 1, 0, 2][kind]!).sort((m, n) => m - n);
        const pairs = Array.from({ length: [0, 1, 2, 1][kind]! }, () => [rng.int(1, 4), rng.int(1, 5)] as const);
        if (pairs.length === 2 && pairs[0]![0] === pairs[1]![0] && pairs[0]![1] === pairs[1]![1])
          pairs[1] = [pairs[0]![0], pairs[0]![1] + 1];
        const size = reals.length + 2 * pairs.length;
        const listed = [
          ...reals.map((r) => t(`$${r}$`, `$${r}$`)),
          ...pairs.map(([a, b]) => t(`the conjugate pair $${formatComplexPair(a, b)}$`, `共轭复特征值对 $${formatComplexPair(a, b)}$`)),
        ];
        const prompt = t(
          `A real $${size} \\times ${size}$ matrix $A$ has eigenvalues ${listed
            .map((x) => x.en)
            .join(listed.length === 2 ? " and " : ", ")
            .replace(
              /, ([^,]*)$/,
              ", and $1",
            )}. In its real canonical block diagonal form $R = P^{-1} A P$, what are the sizes of the diagonal blocks?`,
          `实 $${size} \\times ${size}$ 矩阵 $A$ 的特征值为 ${listed.map((x) => x["zh-CN"]).join("、")}。在其分块对角实标准型 $R = P^{-1} A P$ 中，各对角块的大小是多少？`,
        );
        const options = [
          t("Three $1 \\times 1$ blocks", "三个 $1 \\times 1$ 块"),
          t("One $1 \\times 1$ block and one $2 \\times 2$ block", "一个 $1 \\times 1$ 块和一个 $2 \\times 2$ 块"),
          t("Two $2 \\times 2$ blocks", "两个 $2 \\times 2$ 块"),
          t("Two $1 \\times 1$ blocks and one $2 \\times 2$ block", "两个 $1 \\times 1$ 块和一个 $2 \\times 2$ 块"),
        ];
        const blocks = pairs.map(([a, b]) => `\\begin{pmatrix} ${a} & -${b} \\\\ ${b} & ${a} \\end{pmatrix}`).join(", ");
        const solution = t(
          `Each real eigenvalue contributes a $1 \\times 1$ block, and each complex conjugate pair $a \\pm bi$ contributes a $2 \\times 2$ rotation-scaling block $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$${pairs.length ? `, here $${blocks}$` : ""}. With ${reals.length} real eigenvalue${reals.length === 1 ? "" : "s"} and ${pairs.length} pair${pairs.length === 1 ? "" : "s"}, the form has ${options[kind]!.en.toLowerCase()}.`,
          `每个实特征值对应一个 $1 \\times 1$ 块，每对共轭复特征值 $a \\pm bi$ 对应一个 $2 \\times 2$ 旋转缩放块 $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$${pairs.length ? `，这里是 $${blocks}$` : ""}。有 ${reals.length} 个实特征值和 ${pairs.length} 对复特征值，所以实标准型由${options[kind]!["zh-CN"]}组成。`,
        );
        return choiceProblem({ prompt, options, correct: kind, solution });
      },
    },
    {
      id: "invariants-of-a-real-block-diagonal-form",
      title: t("Invariants of a real block diagonal form", "实块对角形的不变量"),
      explanation: t(
        "A real $3 \\times 3$ matrix with a real eigenvalue $\\mu$ and a complex pair $\\alpha \\pm \\beta i$ is similar to the block diagonal matrix\n\n$$R = \\begin{pmatrix} \\mu & 0 & 0 \\\\ 0 & \\alpha & -\\beta \\\\ 0 & \\beta & \\alpha \\end{pmatrix}.$$\n\nSimilar matrices share trace and determinant, so $\\operatorname{tr} A = \\mu + 2\\alpha$ and $\\det A = \\mu(\\alpha^2 + \\beta^2)$, the determinant of a block diagonal matrix being the product of the block determinants.",
        "具有实特征值 $\\mu$ 和复共轭对 $\\alpha \\pm \\beta i$ 的实 $3 \\times 3$ 矩阵相似于块对角矩阵\n\n$$R = \\begin{pmatrix} \\mu & 0 & 0 \\\\ 0 & \\alpha & -\\beta \\\\ 0 & \\beta & \\alpha \\end{pmatrix}.$$\n\n相似矩阵有相同的迹和行列式，所以 $\\operatorname{tr} A = \\mu + 2\\alpha$，$\\det A = \\mu(\\alpha^2 + \\beta^2)$，因为块对角矩阵的行列式是各块行列式之积。",
      ),
      generate(rng: Rng): Problem {
        const mu = rng.int(-5, 5) || 2;
        const a = rng.int(-3, 3);
        const b = rng.int(1, 4);
        const wantDet = rng.int(0, 1) === 0;
        const ans = wantDet ? mu * (a * a + b * b) : mu + 2 * a;
        return numberProblem({
          prompt: t(
            `A real $3 \\times 3$ matrix $A$ has eigenvalues $${mu}$ and $${formatComplexPair(a, b)}$. Find $${wantDet ? "\\det A" : "\\operatorname{tr} A"}$.`,
            `实 $3 \\times 3$ 矩阵 $A$ 的特征值为 $${mu}$ 和 $${formatComplexPair(a, b)}$。求 $${wantDet ? "\\det A" : "\\operatorname{tr} A"}$。`,
          ),
          answer: ans,
          wrong: wantDet ? [mu * (a * a - b * b), mu * a * a, mu * (a * a + b * b) * 2] : [mu + a, mu + 2 * a + 2 * b, 2 * a],
          solution: t(
            wantDet
              ? `$\\det A = \\det R = ${mu} \\cdot (${a * a} + ${b * b}) = ${ans}$.`
              : `$\\operatorname{tr} A = \\operatorname{tr} R = ${mu} + 2 \\cdot ${paren(a)} = ${ans}$.`,
            wantDet
              ? `$\\det A = \\det R = ${mu} \\cdot (${a * a} + ${b * b}) = ${ans}$。`
              : `$\\operatorname{tr} A = \\operatorname{tr} R = ${mu} + 2 \\cdot ${paren(a)} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 5.19: GENERALIZED EIGENVECTORS
// ════════════════════════════════════════════════════════════════════════════

/** nilpotentAndIdempotentMatrices covers definitions and eigenvalue spectra of nilpotent and idempotent matrices. */
export const nilpotentAndIdempotentMatrices: TopicDef = {
  id: "nilpotent-and-idempotent-matrices",
  title: t("Nilpotent and Idempotent Matrices", "幂零矩阵与幂等矩阵"),
  summary: t(
    "Identify nilpotent ($N^k = 0$) and idempotent ($M^2 = M$) matrices and determine their eigenvalues.",
    "识别幂零矩阵（$N^k = 0$）与幂等矩阵（$M^2 = M$），并求其特征值。",
  ),
  prerequisites: ["block-diagonalization-of-nxn-matrices"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "nilpotent-idempotent-eigenvalues",
      title: t("Eigenvalues of Nilpotent and Idempotent Matrices", "幂零与幂等矩阵的特征值"),
      explanation: t(
        "Applying the defining equation to an eigenvector turns it into an equation for the eigenvalue, which limits the values the eigenvalue can take. Recognize that nilpotent matrices have only eigenvalue 0, and idempotent matrices have only eigenvalues 0 and 1.",
        "把定义方程作用在特征向量上，就得到关于特征值的方程，从而限制了特征值可能的取值。认识到幂零矩阵的特征值只能为 0，而幂等矩阵的特征值只能为 0 或 1。",
      ),
      generate: (rng: Rng): Problem => {
        const n = rng.int(2, 8);
        const k = rng.int(2, 7);
        const prompt = t(
          `Let $N$ be a non-zero $${n} \\times ${n}$ nilpotent matrix with nilpotency index $k = ${k}$ (satisfying $N^{${k}} = 0$ and $N^{${k - 1}} \\neq 0$), and let $M$ be an idempotent projection matrix on $\\mathbb{R}^{${n}}$ satisfying $M^2 = M$. What are the possible eigenvalues of $N$ and $M$?`,
          `设 $N$ 为非零 $${n} \\times ${n}$ 幂零矩阵，其幂零指数为 $k = ${k}$（满足 $N^{${k}} = 0$ 且 $N^{${k - 1}} \\neq 0$），设 $M$ 为 $\\mathbb{R}^{${n}}$ 上的幂等投影矩阵，满足 $M^2 = M$。求 $N$ 与 $M$ 各自可能的特征值。`,
        );
        const right = t(
          "For $N$, only $\\lambda = 0$; for $M$, only $\\lambda = 0$ or $\\lambda = 1$",
          "对 $N$，仅有 $\\lambda = 0$；对 $M$，仅有 $\\lambda = 0$ 或 $\\lambda = 1$",
        );
        const wrong = [
          t("For $N$, only $\\lambda = 1$; for $M$, only $\\lambda = 0$", "对 $N$，仅有 $\\lambda = 1$；对 $M$，仅有 $\\lambda = 0$"),
          t("For both, any real number $\\lambda$", "对两者，可为任意实数 $\\lambda$"),
          t("For $N$, $\\lambda = \\pm 1$; for $M$, $\\lambda = 0, 1$", "对 $N$，$\\lambda = \\pm 1$；对 $M$，$\\lambda = 0, 1$"),
          t(
            "For $N$, only $\\lambda = 0$; for $M$, only $\\lambda = -1$ or $\\lambda = 1$",
            "对 $N$，仅有 $\\lambda = 0$；对 $M$，仅有 $\\lambda = -1$ 或 $\\lambda = 1$",
          ),
        ];
        const solution = t(
          `If $N v = \\lambda v$, then $N^${k} v = \\lambda^${k} v = 0$, so $\\lambda = 0$. If $M v = \\lambda v$, then $M^2 v = \\lambda^2 v = \\lambda v$, so $\\lambda^2 - \\lambda = 0$, giving $\\lambda = 0$ or $\\lambda = 1$.`,
          `若 $N v = \\lambda v$，则 $N^${k} v = \\lambda^${k} v = 0$，故 $\\lambda = 0$。若 $M v = \\lambda v$，则 $M^2 v = \\lambda^2 v = \\lambda v$，故 $\\lambda^2 - \\lambda = 0$，即 $\\lambda = 0$ 或 $\\lambda = 1$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "completing-a-nilpotent-2x2-matrix",
      title: t("Completing a nilpotent 2x2 matrix", "补全幂零 2x2 矩阵"),
      explanation: t(
        "A $2 \\times 2$ matrix is nilpotent exactly when both eigenvalues are $0$, that is when its trace and determinant are both $0$. A matrix with trace $0$ has the form $N = \\begin{pmatrix} a & b \\\\ c & -a \\end{pmatrix}$, and\n\n$$N^2 = (a^2 + bc)I.$$\n\nSo $N^2 = 0$ exactly when $a^2 + bc = 0$, which is the same as $\\det N = 0$.",
        "$2 \\times 2$ 矩阵是幂零的当且仅当两个特征值都是 $0$，即迹和行列式都为 $0$。迹为 $0$ 的矩阵形如 $N = \\begin{pmatrix} a & b \\\\ c & -a \\end{pmatrix}$，且\n\n$$N^2 = (a^2 + bc)I.$$\n\n所以 $N^2 = 0$ 当且仅当 $a^2 + bc = 0$，这与 $\\det N = 0$ 相同。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.pick([-4, -2, -1, 1, 2, 4]);
        const m = rng.int(1, 3) * rng.pick([-1, 1]);
        const a = b * m;
        const c = -b * m * m;
        return numberProblem({
          prompt: t(
            `Find $c$ so that $N = \\begin{pmatrix} ${a} & ${b} \\\\ c & ${-a} \\end{pmatrix}$ is nilpotent.`,
            `求 $c$，使 $N = \\begin{pmatrix} ${a} & ${b} \\\\ c & ${-a} \\end{pmatrix}$ 为幂零矩阵。`,
          ),
          answer: c,
          solveFor: "c",
          wrong: [-c, Q.of(-a, b), a * a],
          solution: t(
            `$N^2 = (${formatLinearComb2(a * a, "", b, "c")})I$, so $${formatLinearComb2(a * a, "", b, "c")} = 0$ and $c = ${c}$.`,
            `$N^2 = (${formatLinearComb2(a * a, "", b, "c")})I$，所以 $${formatLinearComb2(a * a, "", b, "c")} = 0$，$c = ${c}$。`,
          ),
        });
      },
    },
  ],
};

/** generalizedEigenvectors defines generalized eigenvectors (A - lambda I)^k v = 0. */
export const generalizedEigenvectors: TopicDef = {
  id: "generalized-eigenvectors",
  title: t("Generalized Eigenvectors", "广义特征向量"),
  summary: t(
    "Define generalized eigenvectors, which satisfy $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$, and understand generalized eigenspaces.",
    "定义满足 $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$ 的广义特征向量，并理解广义特征子空间。",
  ),
  prerequisites: ["nilpotent-and-idempotent-matrices"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "generalized-eigenvector-definition-kp",
      title: t("Generalized Eigenvector Definition", "广义特征向量的定义"),
      explanation: t(
        "When there are too few eigenvectors, generalized eigenvectors are sent to zero by a higher power of the shifted matrix and fill out the basis. Identify the defining condition $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$ for a generalized eigenvector.",
        "当特征向量不够时，广义特征向量会被平移矩阵的更高次幂映射到零，从而补足一组基。识别广义特征向量的定义条件 $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.int(-5, 5);
        const k = rng.int(2, 6);
        const n = rng.int(k, k + 3);
        const prompt = t(
          `Let $A$ be ${article(n)} $${n} \\times ${n}$ matrix with eigenvalue $\\lambda = ${lambda}$. By definition, a non-zero vector $v$ is a generalized eigenvector of rank $k = ${k}$ corresponding to $\\lambda = ${lambda}$ if and only if:`,
          `设 $A$ 为 $${n} \\times ${n}$ 矩阵，其特征值为 $\\lambda = ${lambda}$。根据定义，非零向量 $v$ 是对应于 $\\lambda = ${lambda}$ 的 $k = ${k}$ 阶广义特征向量当且仅当：`,
        );
        const shiftStr = formatShift(lambda, "I");
        const right = t(
          `$(A${shiftStr})^${k} v = 0$ and $(A${shiftStr})^{${k - 1}} v \\neq 0$`,
          `$(A${shiftStr})^${k} v = 0$ 且 $(A${shiftStr})^{${k - 1}} v \\neq 0$`,
        );
        const wrong = [
          t(`$(A${shiftStr})^${k} v = v$`, `$(A${shiftStr})^${k} v = v$`),
          t(`$(A${shiftStr}) v = ${k} v$`, `$(A${shiftStr}) v = ${k} v$`),
          t(`$A^${k} v = (${lambda})^${k} v$`, `$A^${k} v = (${lambda})^${k} v$`),
          t(
            `$(A${shiftStr})^${k} v \\neq 0$ and $(A${shiftStr})^{${k + 1}} v = 0$`,
            `$(A${shiftStr})^${k} v \\neq 0$ 且 $(A${shiftStr})^{${k + 1}} v = 0$`,
          ),
        ];
        const solution = t(
          `A non-zero vector $v$ is a generalized eigenvector of rank $k = ${k}$ for $\\lambda = ${lambda}$ if $(A${shiftStr})^${k} v = 0$ and $(A${shiftStr})^{${k - 1}} v \\neq 0$.`,
          `非零向量 $v$ 是对应于 $\\lambda = ${lambda}$ 的 $k = ${k}$ 阶广义特征向量，当且仅当 $(A${shiftStr})^${k} v = 0$ 且 $(A${shiftStr})^{${k - 1}} v \\neq 0$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-power-that-kills-every-generalized-eigenvector",
      title: t("The power that kills every generalized eigenvector", "消去所有广义特征向量的幂"),
      explanation: t(
        "Every generalized eigenvector for $\\lambda$ satisfies $(A - \\lambda I)^k\\mathbf{v} = \\mathbf{0}$ for some $k$. On a Jordan block $J_m(\\lambda)$, $(J - \\lambda I)$ shifts the basis vectors down one step, so it takes exactly $m$ applications to reach $\\mathbf{0}$. Hence the smallest $k$ that works for all generalized eigenvectors of $\\lambda$ is the size of the largest Jordan block for $\\lambda$.",
        "$\\lambda$ 的每个广义特征向量都对某个 $k$ 满足 $(A - \\lambda I)^k\\mathbf{v} = \\mathbf{0}$。在若尔当块 $J_m(\\lambda)$ 上，$(J - \\lambda I)$ 把基向量依次下移一步，恰好作用 $m$ 次才得到 $\\mathbf{0}$。所以对 $\\lambda$ 的所有广义特征向量都成立的最小 $k$ 就是 $\\lambda$ 的最大若尔当块的阶数。",
      ),
      generate(rng: Rng): Problem {
        const lam = rng.int(-4, 4);
        const mu = lam + rng.pick([-2, -1, 1, 2, 3]);
        const sizes = [rng.int(1, 4), rng.int(1, 3)];
        const other = rng.int(1, 3);
        const blocks = [...sizes.map((s) => `J_{${s}}(${lam})`), `J_{${other}}(${mu})`];
        const shown = rng.shuffle(blocks);
        const ans = Math.max(...sizes);
        const n = sizes[0]! + sizes[1]! + other;
        return numberProblem({
          prompt: t(
            `${article(n, true)} $${n} \\times ${n}$ matrix has Jordan form $${shown.join(" \\oplus ")}$. Find the smallest $k$ with $(A - \\lambda I)^k\\mathbf{v} = \\mathbf{0}$ for every generalized eigenvector $\\mathbf{v}$ of $\\lambda = ${lam}$.`,
            `一个 $${n} \\times ${n}$ 矩阵的若尔当形为 $${shown.join(" \\oplus ")}$。求最小的 $k$，使对 $\\lambda = ${lam}$ 的每个广义特征向量 $\\mathbf{v}$ 都有 $(A - \\lambda I)^k\\mathbf{v} = \\mathbf{0}$。`,
          ),
          answer: ans,
          wrong: [sizes[0]! + sizes[1]!, Math.min(...sizes), 2],
          solution: t(
            `The blocks for $\\lambda = ${lam}$ have sizes $${sizes[0]}$ and $${sizes[1]}$. The largest is $${ans}$, so $k = ${ans}$.`,
            `$\\lambda = ${lam}$ 的若尔当块阶数为 $${sizes[0]}$ 和 $${sizes[1]}$。最大的为 $${ans}$，所以 $k = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** ranksOfGeneralizedEigenvectors determines the rank of a generalized eigenvector. */
export const ranksOfGeneralizedEigenvectors: TopicDef = {
  id: "ranks-of-generalized-eigenvectors",
  title: t("Ranks of Generalized Eigenvectors", "广义特征向量的阶"),
  summary: t(
    "Determine the rank of a generalized eigenvector by computing successive powers $(A - \\lambda I)^m \\mathbf{v}$.",
    "通过计算逐次幂 $(A - \\lambda I)^m \\mathbf{v}$ 确定广义特征向量的秩。",
  ),
  prerequisites: ["generalized-eigenvectors"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "determining-rank-of-generalized-vector",
      title: t("Determining the Rank of a Generalized Vector", "确定广义特征向量的阶"),
      explanation: t(
        "Apply the shifted matrix repeatedly to the vector and count how many applications it takes to reach the zero vector. Find the smallest positive integer $k$ such that $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$.",
        "反复用平移后的矩阵作用于这个向量，数出需要作用多少次才能得到零向量。求满足 $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$ 的最小正整数 $k$。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.int(-3, 3);
        const rankCase = rng.pick([1, 2, 3])!;
        const c = rng.pick([-4, -3, -2, 2, 3, 4])!;
        // Jordan block J = [[lambda, 1, 0], [0, lambda, 1], [0, 0, lambda]]
        // e1 has rank 1, e2 has rank 2, e3 has rank 3.
        let v: Vec3;
        if (rankCase === 1) {
          v = [c, 0, 0];
        } else if (rankCase === 2) {
          v = [0, c, 0];
        } else {
          v = [0, 0, c];
        }
        const mat: Mat3 = [
          [lambda, 1, 0],
          [0, lambda, 1],
          [0, 0, lambda],
        ];
        const prompt = t(
          `For the matrix $A = ${mat3Latex(mat)}$ with eigenvalue $\\lambda = ${lambda}$, what is the rank (order) of the generalized eigenvector $v = ${vec3Latex(v)}$?`,
          `对于矩阵 $A = ${mat3Latex(mat)}$（特征值 $\\lambda = ${lambda}$），求广义特征向量 $v = ${vec3Latex(v)}$ 的阶（秩）。`,
        );
        const shiftStr = formatShift(lambda, "I");
        const solution = t(
          `We compute powers of $(A${shiftStr}) = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix}$. The vector $v$ satisfies $(A${shiftStr})^{${rankCase}} v = 0$, while $(A${shiftStr})^{${rankCase - 1}} v \\neq 0$. Therefore, the rank is ${rankCase}.`,
          `计算 $(A${shiftStr}) = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix}$ 对向量 $v$ 的作用。可知 $(A${shiftStr})^{${rankCase}} v = 0$，且 $(A${shiftStr})^{${rankCase - 1}} v \\neq 0$。因此阶为 $${rankCase}$。`,
        );
        return numberProblem({
          prompt,
          answer: rankCase,
          solution,
          wrong: [0, 1, 2, 3, 4].filter((w) => w !== rankCase),
        });
      },
    },
    {
      id: "the-rank-of-a-generalized-eigenvector-for-a-general-nilpotent-part",
      title: t("The rank of a generalized eigenvector", "广义特征向量的秩"),
      explanation: t(
        "A generalized eigenvector $\\mathbf{v}$ for $\\lambda$ has rank $k$ when $(A - \\lambda I)^k\\mathbf{v} = \\mathbf{0}$ but $(A - \\lambda I)^{k-1}\\mathbf{v} \\ne \\mathbf{0}$. To find it, apply $N = A - \\lambda I$ repeatedly and count the steps until the result is the zero vector. An ordinary eigenvector has rank $1$.",
        "若 $(A - \\lambda I)^k\\mathbf{v} = \\mathbf{0}$ 而 $(A - \\lambda I)^{k-1}\\mathbf{v} \\ne \\mathbf{0}$，则 $\\lambda$ 的广义特征向量 $\\mathbf{v}$ 的秩为 $k$。要求秩，反复作用 $N = A - \\lambda I$，数到结果为零向量所需的步数。普通特征向量的秩为 $1$。",
      ),
      generate(rng: Rng): Problem {
        const lam = rng.int(-4, 4);
        const p = rng.int(1, 3) * rng.pick([-1, 1]);
        const q = rng.int(-3, 3);
        const r = rng.int(1, 3) * rng.pick([-1, 1]);
        const A: Mat3 = [
          [lam, p, q],
          [0, lam, r],
          [0, 0, lam],
        ];
        const kind = rng.int(1, 3);
        const v: Vec3 =
          kind === 3
            ? [rng.int(-2, 2), rng.int(-2, 2), rng.int(1, 3)]
            : kind === 2
              ? [rng.int(-2, 2), rng.int(1, 3) * rng.pick([-1, 1]), 0]
              : [rng.int(1, 3) * rng.pick([-1, 1]), 0, 0];
        const Nv: Vec3 = [p * v[1] + q * v[2], r * v[2], 0];
        const N2v: Vec3 = [p * Nv[1] + q * Nv[2], 0, 0];
        return numberProblem({
          prompt: t(
            `For $A = ${mat3Latex(A)}$ with eigenvalue $\\lambda = ${lam}$, find the rank of the generalized eigenvector $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `对特征值为 $\\lambda = ${lam}$ 的 $A = ${mat3Latex(A)}$，求广义特征向量 $\\mathbf{v} = ${vec3Latex(v)}$ 的秩。`,
          ),
          answer: kind,
          wrong: [1, 2, 3],
          solution: t(
            kind === 1
              ? `With $N = A - \\lambda I$: $N\\mathbf{v} = ${vec3Latex(Nv)} = \\mathbf{0}$, so $\\mathbf{v}$ is an eigenvector: rank $1$.`
              : kind === 2
                ? `With $N = A - \\lambda I$: $N\\mathbf{v} = ${vec3Latex(Nv)} \\ne \\mathbf{0}$ and $N^2\\mathbf{v} = ${vec3Latex(N2v)} = \\mathbf{0}$, so the rank is $2$.`
                : `With $N = A - \\lambda I$: $N\\mathbf{v} = ${vec3Latex(Nv)}$ and $N^2\\mathbf{v} = ${vec3Latex(N2v)} \\ne \\mathbf{0}$, while $N^3 = 0$, so the rank is $3$.`,
            kind === 1
              ? `令 $N = A - \\lambda I$，$N\\mathbf{v} = ${vec3Latex(Nv)} = \\mathbf{0}$，所以 $\\mathbf{v}$ 是特征向量：秩为 $1$。`
              : kind === 2
                ? `令 $N = A - \\lambda I$：$N\\mathbf{v} = ${vec3Latex(Nv)} \\ne \\mathbf{0}$，$N^2\\mathbf{v} = ${vec3Latex(N2v)} = \\mathbf{0}$，所以秩为 $2$。`
                : `令 $N = A - \\lambda I$：$N\\mathbf{v} = ${vec3Latex(Nv)}$，$N^2\\mathbf{v} = ${vec3Latex(N2v)} \\ne \\mathbf{0}$，而 $N^3 = 0$，所以秩为 $3$。`,
          ),
        });
      },
    },
  ],
};

/** findingGeneralizedEigenvectorsOfSpecificRanks builds Jordan chains by solving (A - lambda I)v_2 = v_1. */
export const findingGeneralizedEigenvectorsOfSpecificRanks: TopicDef = {
  id: "finding-generalized-eigenvectors-of-specific-ranks",
  title: t("Finding Generalized Eigenvectors of Specific Ranks", "寻找特定阶的广义特征向量"),
  summary: t(
    "Solve $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$ to find rank-2 generalized eigenvectors and build Jordan chains.",
    "通过求解 $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$ 寻找秩为 2 的广义特征向量，并构造若尔当链。",
  ),
  prerequisites: ["ranks-of-generalized-eigenvectors"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "solving-for-rank-2-generalized-eigenvector-kp",
      title: t("Solving for Rank-2 Generalized Eigenvectors", "求解 2 阶广义特征向量"),
      explanation: t(
        "A generalized eigenvector of rank two is a vector that the shifted matrix sends to an ordinary eigenvector, so solve a linear system with that eigenvector on the right. Solve $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$, where $\\mathbf{v}_1$ is an ordinary eigenvector.",
        "二阶广义特征向量被平移矩阵映射为一个普通特征向量，所以要解右边为该特征向量的线性方程组。求解 $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$，其中 $\\mathbf{v}_1$ 为普通特征向量。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.int(-5, 5);
        const k = rng.pick([-4, -3, -2, 2, 3, 4])!;
        // A = [[lambda, k], [0, lambda]]
        // (A - lambda I) = [[0, k], [0, 0]]
        // v1 = [k, 0]^T is an ordinary eigenvector.
        // (A - lambda I) v2 = v1 => [[0, k], [0, 0]] [x, y]^T = [k, 0]^T => k y = k => y = 1.
        // A choice of v2 is [0, 1]^T.
        const mat: Mat2 = [
          [lambda, k],
          [0, lambda],
        ];
        const v1: Vec2 = [k, 0];
        const shiftStr = formatShift(lambda, "I");
        const prompt = t(
          `Let $A = ${mat2Latex(mat)}$ have eigenvalue $\\lambda = ${lambda}$ with eigenvector $v_1 = ${vec2Latex(v1)}$. Find a rank-$2$ generalized eigenvector $\\mathbf{v}_2 = \\langle x, y \\rangle$ satisfying $(A${shiftStr})\\mathbf{v}_2 = v_1$ whose first component is $x = 0$.`,
          `设 $A = ${mat2Latex(mat)}$ 具有特征值 $\\lambda = ${lambda}$，其特征向量为 $v_1 = ${vec2Latex(v1)}$。求满足 $(A${shiftStr})\\mathbf{v}_2 = v_1$ 且第一分量为 $x = 0$ 的 $2$ 阶广义特征向量 $\\mathbf{v}_2 = \\langle x, y \\rangle$。`,
        );
        const solution = t(
          `We solve $(A${shiftStr})\\mathbf{v}_2 = v_1$: $\\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${k} \\\\ 0 \\end{pmatrix}$, which requires $${k}y = ${k}$, so $y = 1$. With $x = 0$, $\\mathbf{v}_2 = \\langle 0, 1 \\rangle$.`,
          `求解方程 $(A${shiftStr})\\mathbf{v}_2 = v_1$：$\\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${k} \\\\ 0 \\end{pmatrix}$，要求 $${k}y = ${k}$，故 $y = 1$。取 $x = 0$，得到 $\\mathbf{v}_2 = \\langle 0, 1 \\rangle$。`,
        );
        return pointProblem({
          prompt,
          answer: [0, 1],
          vector: true,
          solution,
          wrong: [
            [1, 0],
            [1, 1],
            [0, k],
            [k, 0],
          ],
        });
      },
    },
    {
      id: "building-a-jordan-chain-from-a-rank-3-generalized-eigenvector",
      title: t("Building a Jordan chain from a rank-3 vector", "由秩 3 向量构造若尔当链"),
      explanation: t(
        "Once a generalized eigenvector $\\mathbf{v}_3$ of rank $3$ is known, the rest of its Jordan chain follows by multiplication: $\\mathbf{v}_2 = (A - \\lambda I)\\mathbf{v}_3$ has rank $2$ and $\\mathbf{v}_1 = (A - \\lambda I)\\mathbf{v}_2$ has rank $1$, so it is an ordinary eigenvector. Each step lowers the rank by exactly one.",
        "一旦知道秩为 $3$ 的广义特征向量 $\\mathbf{v}_3$，其若尔当链的其余部分可由乘法得到：$\\mathbf{v}_2 = (A - \\lambda I)\\mathbf{v}_3$ 的秩为 $2$，$\\mathbf{v}_1 = (A - \\lambda I)\\mathbf{v}_2$ 的秩为 $1$，即普通特征向量。每一步秩恰好降低一。",
      ),
      generate(rng: Rng): Problem {
        const lam = rng.int(-4, 4);
        const p = rng.int(1, 3) * rng.pick([-1, 1]);
        const q = rng.int(-3, 3);
        const r = rng.int(1, 3) * rng.pick([-1, 1]);
        const A: Mat3 = [
          [lam, p, q],
          [0, lam, r],
          [0, 0, lam],
        ];
        const v3: Vec3 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(1, 2) * rng.pick([-1, 1])];
        const v2: Vec3 = [p * v3[1] + q * v3[2], r * v3[2], 0];
        const v1: Vec3 = [p * v2[1], 0, 0];
        return pointProblem({
          prompt: t(
            `$A = ${mat3Latex(A)}$ has the single eigenvalue $\\lambda = ${lam}$, and $\\mathbf{v}_3 = ${vec3Latex(v3)}$ is a generalized eigenvector of rank $3$. Find $\\mathbf{v}_2 = (A - \\lambda I)\\mathbf{v}_3$.`,
            `$A = ${mat3Latex(A)}$ 只有特征值 $\\lambda = ${lam}$，$\\mathbf{v}_3 = ${vec3Latex(v3)}$ 是秩为 $3$ 的广义特征向量。求 $\\mathbf{v}_2 = (A - \\lambda I)\\mathbf{v}_3$。`,
          ),
          answer: [v2[0], v2[1], v2[2]],
          vector: true,
          wrong: [
            [v1[0], 0, 0],
            [q * v3[1] + p * v3[2], r * v3[2], 0],
            [p * v3[1] + q * v3[2] + lam * v3[0], r * v3[2] + lam * v3[1], lam * v3[2]],
          ],
          solution: t(
            `$A - \\lambda I = ${mat3Latex([
              [0, p, q],
              [0, 0, r],
              [0, 0, 0],
            ])}$, so $\\mathbf{v}_2 = ${vec3Latex(v2)}$. One more step gives the eigenvector $\\mathbf{v}_1 = ${vec3Latex(v1)}$.`,
            `$A - \\lambda I = ${mat3Latex([
              [0, p, q],
              [0, 0, r],
              [0, 0, 0],
            ])}$，所以 $\\mathbf{v}_2 = ${vec3Latex(v2)}$。再作用一次得到特征向量 $\\mathbf{v}_1 = ${vec3Latex(v1)}$。`,
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 5.20: JORDAN CANONICAL DECOMPOSITION
// ════════════════════════════════════════════════════════════════════════════

/** jordanBlocksAndJordanMatrices covers the definition and structure of Jordan blocks. */
export const jordanBlocksAndJordanMatrices: TopicDef = {
  id: "jordan-blocks-and-jordan-matrices",
  title: t("Jordan Blocks and Jordan Matrices", "若尔当块与若尔当矩阵"),
  summary: t(
    "Understand the structure of a Jordan block $J_k(\\lambda)$, with $\\lambda$ on the diagonal and $1$ on the superdiagonal.",
    "理解主对角线上为 $\\lambda$、上对角线上为 $1$ 的若尔当块 $J_k(\\lambda)$ 的结构。",
  ),
  prerequisites: ["finding-generalized-eigenvectors-of-specific-ranks"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "jordan-block-structure-definition",
      title: t("Jordan Block Structure Definition", "若尔当块的结构定义"),
      explanation: t(
        "A Jordan block has one eigenvalue repeated down the diagonal and ones just above it, and a Jordan matrix places such blocks along the diagonal. Identify Jordan blocks and block diagonal Jordan matrices.",
        "若尔当块的对角线上是同一个重复的特征值，紧挨着对角线上方是 1，若尔当矩阵则把这样的块沿对角线排列。识别若尔当块及分块对角的若尔当矩阵。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.int(-8, 8);
        const isDim2 = rng.bool();
        if (isDim2) {
          const prompt = t(
            `Which of the following matrices represents a $2 \\times 2$ Jordan block $J_2(${lambda})$ associated with eigenvalue $\\lambda = ${lambda}$?`,
            `下列哪个矩阵表示对应特征值 $\\lambda = ${lambda}$ 的 $2 \\times 2$ 若尔当块 $J_2(${lambda})$？`,
          );
          const right = t(
            `$${mat2Latex([
              [lambda, 1],
              [0, lambda],
            ])}$`,
            `$${mat2Latex([
              [lambda, 1],
              [0, lambda],
            ])}$`,
          );
          const wrong = [
            t(
              `$${mat2Latex([
                [lambda, 0],
                [1, lambda],
              ])}$`,
              `$${mat2Latex([
                [lambda, 0],
                [1, lambda],
              ])}$`,
            ),
            t(
              `$${mat2Latex([
                [lambda, 0],
                [0, lambda],
              ])}$`,
              `$${mat2Latex([
                [lambda, 0],
                [0, lambda],
              ])}$`,
            ),
            t(
              `$${mat2Latex([
                [1, lambda],
                [0, 1],
              ])}$`,
              `$${mat2Latex([
                [1, lambda],
                [0, 1],
              ])}$`,
            ),
            t(
              `$${mat2Latex([
                [lambda, 1],
                [1, lambda],
              ])}$`,
              `$${mat2Latex([
                [lambda, 1],
                [1, lambda],
              ])}$`,
            ),
          ];
          const solution = t(
            `A standard Jordan block $J_2(${lambda})$ has $${lambda}$ on the main diagonal, $1$ on the superdiagonal, and $0$ on the subdiagonal: $J_2(${lambda}) = ${mat2Latex(
              [
                [lambda, 1],
                [0, lambda],
              ],
            )}$.`,
            `标准若尔当块 $J_2(${lambda})$ 的主对角线上为 $${lambda}$，上对角线上为 $1$，下对角线上为 $0$：$J_2(${lambda}) = ${mat2Latex([
              [lambda, 1],
              [0, lambda],
            ])}$。`,
          );
          return oneOf(rng, prompt, right, wrong, solution);
        }
        const prompt = t(
          `Which of the following matrices represents a $3 \\times 3$ Jordan block $J_3(${lambda})$ associated with eigenvalue $\\lambda = ${lambda}$?`,
          `下列哪个矩阵表示对应特征值 $\\lambda = ${lambda}$ 的 $3 \\times 3$ 若尔当块 $J_3(${lambda})$？`,
        );
        const right = t(
          `$${mat3Latex([
            [lambda, 1, 0],
            [0, lambda, 1],
            [0, 0, lambda],
          ])}$`,
          `$${mat3Latex([
            [lambda, 1, 0],
            [0, lambda, 1],
            [0, 0, lambda],
          ])}$`,
        );
        const wrong = [
          t(
            `$${mat3Latex([
              [lambda, 0, 0],
              [1, lambda, 0],
              [0, 1, lambda],
            ])}$`,
            `$${mat3Latex([
              [lambda, 0, 0],
              [1, lambda, 0],
              [0, 1, lambda],
            ])}$`,
          ),
          t(
            `$${mat3Latex([
              [lambda, 0, 0],
              [0, lambda, 0],
              [0, 0, lambda],
            ])}$`,
            `$${mat3Latex([
              [lambda, 0, 0],
              [0, lambda, 0],
              [0, 0, lambda],
            ])}$`,
          ),
          t(
            `$${mat3Latex([
              [1, lambda, 0],
              [0, 1, lambda],
              [0, 0, 1],
            ])}$`,
            `$${mat3Latex([
              [1, lambda, 0],
              [0, 1, lambda],
              [0, 0, 1],
            ])}$`,
          ),
          t(
            `$${mat3Latex([
              [lambda, 1, 1],
              [0, lambda, 1],
              [0, 0, lambda],
            ])}$`,
            `$${mat3Latex([
              [lambda, 1, 1],
              [0, lambda, 1],
              [0, 0, lambda],
            ])}$`,
          ),
        ];
        const solution = t(
          `A standard Jordan block $J_k(\\lambda)$ has $\\lambda$ on the main diagonal, $1$s on the superdiagonal directly above the main diagonal, and $0$ elsewhere. Thus, $J_3(${lambda}) = ${mat3Latex(
            [
              [lambda, 1, 0],
              [0, lambda, 1],
              [0, 0, lambda],
            ],
          )}$.`,
          `标准若尔当块 $J_k(\\lambda)$ 的主对角线上全为 $\\lambda$，紧邻主对角线上方的上对角线上全为 $1$，其余元素均为 $0$。因此 $J_3(${lambda}) = ${mat3Latex(
            [
              [lambda, 1, 0],
              [0, lambda, 1],
              [0, 0, lambda],
            ],
          )}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-rank-of-a-shifted-jordan-matrix",
      title: t("The rank of a shifted Jordan matrix", "平移后若尔当矩阵的秩"),
      explanation: t(
        "Subtracting $\\lambda I$ from a Jordan matrix turns every block $J_m(\\lambda)$ into a nilpotent block of rank $m - 1$, while blocks for other eigenvalues stay invertible and keep full rank. Adding up, $\\operatorname{rank}(J - \\lambda I) = n - (\\text{number of blocks for } \\lambda)$. Equivalently, the number of blocks for $\\lambda$ equals the dimension of its eigenspace.",
        "从若尔当矩阵中减去 $\\lambda I$，每个块 $J_m(\\lambda)$ 变成秩为 $m - 1$ 的幂零块，而其他特征值的块仍可逆、保持满秩。相加得 $\\operatorname{rank}(J - \\lambda I) = n - (\\lambda \\text{ 的块数})$。等价地，$\\lambda$ 的块数等于其特征空间的维数。",
      ),
      generate(rng: Rng): Problem {
        const lam = rng.int(-3, 4);
        const mu = lam + rng.pick([-3, -2, -1, 1, 2]);
        const own = Array.from({ length: rng.int(1, 3) }, () => rng.int(1, 3));
        const others = Array.from({ length: rng.int(1, 2) }, () => rng.int(1, 3));
        const blocks = rng.shuffle([...own.map((s) => `J_{${s}}(${lam})`), ...others.map((s) => `J_{${s}}(${mu})`)]);
        const n = [...own, ...others].reduce((a, b) => a + b, 0);
        const ans = n - own.length;
        const ownSize = own.reduce((a, b) => a + b, 0);
        return numberProblem({
          prompt: t(
            `Let $J = ${blocks.join(" \\oplus ")}$. Find $\\operatorname{rank}(J${formatShift(lam)})$.`,
            `设 $J = ${blocks.join(" \\oplus ")}$。求 $\\operatorname{rank}(J${formatShift(lam)})$。`,
          ),
          answer: ans,
          wrong: [own.length, n - ownSize, n - others.length, n],
          solution: t(
            `$J$ is $${n} \\times ${n}$ and has $${own.length}$ block${own.length === 1 ? "" : "s"} for $\\lambda = ${lam}$. Each loses one rank, so the rank is $${n} - ${own.length} = ${ans}$.`,
            `$J$ 为 $${n} \\times ${n}$ 矩阵，$\\lambda = ${lam}$ 有 $${own.length}$ 个块。每个块秩减一，所以秩为 $${n} - ${own.length} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** jordanCanonicalFormOfA2x2Matrix determines the Jordan form of a 2x2 matrix. */
export const jordanCanonicalFormOfA2x2Matrix: TopicDef = {
  id: "jordan-canonical-form-of-a-2x2-matrix",
  title: t("Jordan Canonical Form of a 2x2 Matrix", "2x2 矩阵的若尔当标准型"),
  summary: t(
    "Determine the Jordan canonical form of a 2x2 matrix based on its eigenvalues and geometric multiplicity.",
    "根据特征值与几何重数确定 2x2 矩阵的若尔当标准型。",
  ),
  prerequisites: ["jordan-blocks-and-jordan-matrices"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "determining-jordan-form-2x2-kp",
      title: t("Determining the Jordan Form of a 2x2 Matrix", "确定 2x2 矩阵的若尔当标准型"),
      explanation: t(
        "A two by two matrix with a repeated eigenvalue is diagonalizable only if it is already a multiple of the identity; otherwise it is similar to a single Jordan block. Distinguish diagonalizable $2 \\times 2$ matrices from those similar to a single Jordan block $\\begin{bmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{bmatrix}$.",
        "有重复特征值的二阶矩阵只有本身就是单位矩阵的倍数时才能对角化，否则它与一个若尔当块相似。区分可对角化的 $2 \\times 2$ 矩阵与相似于单个若尔当块 $\\begin{bmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{bmatrix}$ 的矩阵。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.int(-4, 4);
        const a = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5])!;
        // Non-diagonalizable 2x2 matrix with repeated eigenvalue lambda:
        const matA: Mat2 = [
          [lambda, a],
          [0, lambda],
        ];
        const matJ: Mat2 = [
          [lambda, 1],
          [0, lambda],
        ];
        const prompt = t(
          `Find the Jordan canonical form $J$ of the matrix $A = ${mat2Latex(matA)}$.`,
          `求矩阵 $A = ${mat2Latex(matA)}$ 的若尔当标准型 $J$。`,
        );
        const right = t(`$${mat2Latex(matJ)}$`, `$${mat2Latex(matJ)}$`);
        const wrong = [
          t(
            `$${mat2Latex([
              [lambda, 0],
              [0, lambda],
            ])}$`,
            `$${mat2Latex([
              [lambda, 0],
              [0, lambda],
            ])}$`,
          ),
          t(`$${mat2Latex(matA)}$`, `$${mat2Latex(matA)}$`),
          t(
            `$${mat2Latex([
              [1, lambda],
              [0, 1],
            ])}$`,
            `$${mat2Latex([
              [1, lambda],
              [0, 1],
            ])}$`,
          ),
          t(
            `$${mat2Latex([
              [lambda, 1],
              [1, lambda],
            ])}$`,
            `$${mat2Latex([
              [lambda, 1],
              [1, lambda],
            ])}$`,
          ),
        ];
        const shiftStr = formatShift(lambda, "I");
        const solution = t(
          `The matrix $A$ has repeated eigenvalue $\\lambda = ${lambda}$ with algebraic multiplicity 2. Since $A${shiftStr} = \\begin{pmatrix} 0 & ${a} \\\\ 0 & 0 \\end{pmatrix}$ has rank 1, its nullity (geometric multiplicity) is $2 - 1 = 1 < 2$. Thus $A$ is defective and consists of a single $2 \\times 2$ Jordan block: $J = ${mat2Latex(matJ)}$.`,
          `矩阵 $A$ 具有重特征值 $\\lambda = ${lambda}$（代数重数为 2）。因为 $A${shiftStr} = \\begin{pmatrix} 0 & ${a} \\\\ 0 & 0 \\end{pmatrix}$ 的秩为 1，零度（几何重数）为 $2 - 1 = 1 < 2$。因此 $A$ 不可对角化，由单一的 $2 \\times 2$ 若尔当块构成：$J = ${mat2Latex(matJ)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-eigenvalue-in-the-jordan-block-of-a-defective-2x2-matrix",
      title: t("The eigenvalue in a defective 2×2 Jordan block", "亏损 2×2 矩阵若尔当块中的特征值"),
      explanation: t(
        "A $2 \\times 2$ matrix that is not diagonalizable has one repeated eigenvalue $\\lambda$, and its Jordan form is $\\begin{pmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{pmatrix}$. Similar matrices have the same trace, so $2\\lambda = \\operatorname{tr} A$ and $\\lambda = \\tfrac{1}{2}\\operatorname{tr} A$. The determinant gives a check: $\\det A = \\lambda^2$.",
        "不可对角化的 $2 \\times 2$ 矩阵只有一个重特征值 $\\lambda$，其若尔当形为 $\\begin{pmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{pmatrix}$。相似矩阵的迹相同，所以 $2\\lambda = \\operatorname{tr} A$，$\\lambda = \\tfrac{1}{2}\\operatorname{tr} A$。行列式可作检验：$\\det A = \\lambda^2$。",
      ),
      generate(rng: Rng): Problem {
        const lam = rng.int(-5, 5);
        const a = rng.int(1, 3) * rng.pick([-1, 1]);
        const b = rng.pick([1, a * a].map((x) => x * rng.pick([-1, 1])));
        const c = (-a * a) / b;
        const A: Mat2 = [
          [lam + a, b],
          [c, lam - a],
        ];
        const det = lam * lam;
        return numberProblem({
          prompt: t(
            `$A = ${mat2Latex(A)}$ is not diagonalizable, so its Jordan form is $\\begin{pmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{pmatrix}$. Find $\\lambda$.`,
            `$A = ${mat2Latex(A)}$ 不可对角化，所以其若尔当形为 $\\begin{pmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{pmatrix}$。求 $\\lambda$。`,
          ),
          answer: lam,
          wrong: [2 * lam, lam + a, lam - a, -lam],
          solution: t(
            `$\\operatorname{tr} A = ${2 * lam} = 2\\lambda$, so $\\lambda = ${lam}$. Check: $\\det A = ${det} = \\lambda^2$.`,
            `$\\operatorname{tr} A = ${2 * lam} = 2\\lambda$，所以 $\\lambda = ${lam}$。检验：$\\det A = ${det} = \\lambda^2$。`,
          ),
        });
      },
    },
  ],
};

/** jordanCanonicalDecompositionOfA2x2Matrix finds P such that A = PJP^{-1} for 2x2 matrices. */
export const jordanCanonicalDecompositionOfA2x2Matrix: TopicDef = {
  id: "jordan-canonical-decomposition-of-a-2x2-matrix",
  title: t("Jordan Canonical Decomposition of a 2x2 Matrix", "2x2 矩阵的若尔当标准分解"),
  summary: t(
    "Construct the matrix $P$ of generalized eigenvectors with $A = PJP^{-1}$ for a $2 \\times 2$ matrix.",
    "对 $2 \\times 2$ 矩阵构造由广义特征向量组成的矩阵 $P$，使 $A = PJP^{-1}$。",
  ),
  prerequisites: ["jordan-canonical-form-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "jordan-decomposition-2x2-computation",
      title: t("Jordan Decomposition Computation for 2x2 Matrices", "2x2 矩阵的若尔当分解计算"),
      explanation: t(
        "The first column is an eigenvector and the second is a generalized eigenvector that the shifted matrix sends to the first, forming a chain. Find $P = \\begin{bmatrix} \\mathbf{v}_1 & \\mathbf{v}_2 \\end{bmatrix}$ satisfying $(A - \\lambda I)\\mathbf{v}_1 = \\mathbf{0}$ and $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$.",
        "第一列是特征向量，第二列是被平移矩阵映射到第一列的广义特征向量，它们构成一条链。求满足 $(A - \\lambda I)\\mathbf{v}_1 = \\mathbf{0}$ 与 $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$ 的矩阵 $P = \\begin{bmatrix} \\mathbf{v}_1 & \\mathbf{v}_2 \\end{bmatrix}$。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.int(-3, 3);
        const k = rng.pick([2, 3, 4, 5])!;
        // A = [[lambda, k], [0, lambda]]
        // J = [[lambda, 1], [0, lambda]]
        // We want AP = PJ => A v1 = lambda v1, A v2 = v1 + lambda v2 => (A - lambda I) v2 = v1.
        // v1 = [k, 0]^T, v2 = [0, 1]^T gives P = [[k, 0], [0, 1]].
        const matA: Mat2 = [
          [lambda, k],
          [0, lambda],
        ];
        const matP: Mat2 = [
          [k, 0],
          [0, 1],
        ];
        const prompt = t(
          `For the matrix $A = ${mat2Latex(matA)}$, find an invertible matrix $P$ such that $P^{-1} A P = J = \\begin{pmatrix} ${lambda} & 1 \\\\ 0 & ${lambda} \\end{pmatrix}$.`,
          `对于矩阵 $A = ${mat2Latex(matA)}$，求可逆矩阵 $P$，使得 $P^{-1} A P = J = \\begin{pmatrix} ${lambda} & 1 \\\\ 0 & ${lambda} \\end{pmatrix}$。`,
        );
        const right = t(`$P = ${mat2Latex(matP)}$`, `$P = ${mat2Latex(matP)}$`);
        const wrong = [
          t(
            `$P = ${mat2Latex([
              [1, 0],
              [0, k],
            ])}$`,
            `$P = ${mat2Latex([
              [1, 0],
              [0, k],
            ])}$`,
          ),
          t(
            `$P = ${mat2Latex([
              [1, 1],
              [0, 1],
            ])}$`,
            `$P = ${mat2Latex([
              [1, 1],
              [0, 1],
            ])}$`,
          ),
          t(
            `$P = ${mat2Latex([
              [0, k],
              [1, 0],
            ])}$`,
            `$P = ${mat2Latex([
              [0, k],
              [1, 0],
            ])}$`,
          ),
          t(
            `$P = ${mat2Latex([
              [k, 1],
              [0, 1],
            ])}$`,
            `$P = ${mat2Latex([
              [k, 1],
              [0, 1],
            ])}$`,
          ),
        ];
        const shiftStr = formatShift(lambda, "I");
        const solution = t(
          `The columns of $P = \\begin{pmatrix} v_1 & v_2 \\end{pmatrix}$ satisfy $A v_1 = ${lambda} v_1$ and $(A${shiftStr})v_2 = v_1$. Choosing $v_1 = ${vec2Latex([k, 0])}$ and $v_2 = ${vec2Latex([0, 1])}$ gives $(A${shiftStr})v_2 = \\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix} ${vec2Latex([0, 1])} = ${vec2Latex([k, 0])} = v_1$. Thus $P = ${mat2Latex(matP)}$.`,
          `$P = \\begin{pmatrix} v_1 & v_2 \\end{pmatrix}$ 的列满足 $A v_1 = ${lambda} v_1$ 与 $(A${shiftStr})v_2 = v_1$。取 $v_1 = ${vec2Latex([k, 0])}$ 与 $v_2 = ${vec2Latex([0, 1])}$，满足 $(A${shiftStr})v_2 = \\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix} ${vec2Latex([0, 1])} = ${vec2Latex([k, 0])} = v_1$。因此 $P = ${mat2Latex(matP)}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "rebuilding-a-2x2-matrix-from-its-jordan-decomposition",
      title: t("Rebuilding a matrix from its Jordan decomposition", "由若尔当分解还原矩阵"),
      explanation: t(
        "A Jordan decomposition $A = PJP^{-1}$ can be multiplied out to recover $A$. With $J = \\lambda I + N$ and $N = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$, this is $A = \\lambda I + PNP^{-1}$, so only the nilpotent part needs to be conjugated. When $\\det P = 1$, the inverse is simply $P^{-1} = \\begin{pmatrix} s & -q \\\\ -r & p \\end{pmatrix}$ for $P = \\begin{pmatrix} p & q \\\\ r & s \\end{pmatrix}$.",
        "若尔当分解 $A = PJP^{-1}$ 乘开即可还原 $A$。设 $J = \\lambda I + N$，$N = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$，则 $A = \\lambda I + PNP^{-1}$，只需对幂零部分作共轭。当 $\\det P = 1$ 时，对 $P = \\begin{pmatrix} p & q \\\\ r & s \\end{pmatrix}$ 有 $P^{-1} = \\begin{pmatrix} s & -q \\\\ -r & p \\end{pmatrix}$。",
      ),
      generate(rng: Rng): Problem {
        const lam = rng.int(-4, 4);
        const [p, r] = rng.pick([
          [1, 0],
          [1, 1],
          [1, -1],
          [1, 2],
          [1, -2],
          [2, 1],
          [2, -1],
          [2, 3],
          [3, 1],
          [3, 2],
          [-1, 2],
          [2, -3],
        ] as const);
        let q = 0;
        let s = 0;
        for (let cand = -4; cand <= 4; cand++) {
          if ((1 + cand * r) % p === 0) {
            q = cand;
            s = (1 + cand * r) / p;
            if (cand !== 0) break;
          }
        }
        const P: Mat2 = [
          [p, q],
          [r, s],
        ];
        const A: Mat2 = [
          [lam - p * r, p * p],
          [-r * r, lam + p * r],
        ];
        const swapped: Mat2 = [
          [lam + r * s, s * s],
          [-r * r, lam - r * s],
        ];
        const i = rng.int(0, 1);
        const j = i === 1 ? 0 : rng.int(0, 1);
        const pos = [
          ["top-left", "左上"],
          ["top-right", "右上"],
          ["bottom-left", "左下"],
        ][i * 2 + j]!;
        return numberProblem({
          prompt: t(
            `Let $P = ${mat2Latex(P)}$ and $J = \\begin{pmatrix} ${lam} & 1 \\\\ 0 & ${lam} \\end{pmatrix}$. Find the ${pos[0]} entry of $A = PJP^{-1}$.`,
            `设 $P = ${mat2Latex(P)}$，$J = \\begin{pmatrix} ${lam} & 1 \\\\ 0 & ${lam} \\end{pmatrix}$。求 $A = PJP^{-1}$ 的${pos[1]}元素。`,
          ),
          answer: A[i]![j]!,
          wrong: [swapped[i]![j]!, -A[i]![j]!, i === j ? lam : A[j]![i]!, A[i]![j]! - lam],
          solution: t(
            `$\\det P = 1$, so $P^{-1} = ${mat2Latex([
              [s, -q],
              [-r, p],
            ])}$. Multiplying out gives $A = ${mat2Latex(A)}$, whose ${pos[0]} entry is $${A[i]![j]!}$.`,
            `$\\det P = 1$，所以 $P^{-1} = ${mat2Latex([
              [s, -q],
              [-r, p],
            ])}$。乘开得 $A = ${mat2Latex(A)}$，其${pos[1]}元素为 $${A[i]![j]!}$。`,
          ),
        });
      },
    },
  ],
};

/** jordanCanonicalFormOfA3x3Matrix determines block partitions for 3x3 matrices. */
export const jordanCanonicalFormOfA3x3Matrix: TopicDef = {
  id: "jordan-canonical-form-of-a-3x3-matrix",
  title: t("Jordan Canonical Form of a 3x3 Matrix", "3x3 矩阵的若尔当标准型"),
  summary: t(
    "Determine the block sizes in the Jordan canonical form of a 3x3 matrix using rank powers.",
    "利用矩阵秩的逐次幂确定 3x3 矩阵若尔当标准型中的块尺寸。",
  ),
  prerequisites: ["jordan-canonical-decomposition-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "jordan-blocks-partition-3x3",
      title: t("Jordan Blocks Partition for 3x3 Matrices", "3x3 矩阵的若尔当块划分"),
      explanation: t(
        "The number of blocks equals the number of independent eigenvectors, so the geometric multiplicity tells you how the three dimensions split into blocks. Determine whether $J$ is $J_3(\\lambda)$, $\\operatorname{diag}(J_2(\\lambda), J_1(\\lambda))$, or $\\operatorname{diag}(J_1(\\lambda), J_1(\\lambda), J_1(\\lambda))$.",
        "块的个数等于线性无关特征向量的个数，所以几何重数告诉你三个维度怎样分成若干块。判定若尔当标准型 $J$ 是 $J_3(\\lambda)$、$\\operatorname{diag}(J_2(\\lambda), J_1(\\lambda))$ 还是 $\\operatorname{diag}(J_1(\\lambda), J_1(\\lambda), J_1(\\lambda))$。",
      ),
      generate: (rng: Rng): Problem => {
        const c = rng.int(-9, 9);
        const rankCase = rng.pick([1, 2])!;
        // If rank(A - cI) = 1, nullity = 2 => 2 Jordan blocks => sizes 2 + 1.
        // If rank(A - cI) = 2, nullity = 1 => 1 Jordan block => size 3.
        const matJ: Mat3 =
          rankCase === 1
            ? [
                [c, 1, 0],
                [0, c, 0],
                [0, 0, c],
              ]
            : [
                [c, 1, 0],
                [0, c, 1],
                [0, 0, c],
              ];
        const polyFactor = formatFactor("\\lambda", c);
        const shiftStr = formatShift(c, "I");
        const prompt = t(
          `A $3 \\times 3$ matrix $A$ has characteristic polynomial $p(\\lambda) = (${polyFactor})^3$. If $\\operatorname{rank}(A${shiftStr}) = ${rankCase}$, what is the Jordan canonical form $J$ of $A$?`,
          `$3 \\times 3$ 矩阵 $A$ 的特征多项式为 $p(\\lambda) = (${polyFactor})^3$。若 $\\operatorname{rank}(A${shiftStr}) = ${rankCase}$，求 $A$ 的若尔当标准型 $J$。`,
        );
        const right = t(`$${mat3Latex(matJ)}$`, `$${mat3Latex(matJ)}$`);
        const wrong = [
          t(
            `$${mat3Latex([
              [c, 0, 0],
              [0, c, 0],
              [0, 0, c],
            ])}$`,
            `$${mat3Latex([
              [c, 0, 0],
              [0, c, 0],
              [0, 0, c],
            ])}$`,
          ),
          t(
            rankCase === 1
              ? `$${mat3Latex([
                  [c, 1, 0],
                  [0, c, 1],
                  [0, 0, c],
                ])}$`
              : `$${mat3Latex([
                  [c, 1, 0],
                  [0, c, 0],
                  [0, 0, c],
                ])}$`,
            rankCase === 1
              ? `$${mat3Latex([
                  [c, 1, 0],
                  [0, c, 1],
                  [0, 0, c],
                ])}$`
              : `$${mat3Latex([
                  [c, 1, 0],
                  [0, c, 0],
                  [0, 0, c],
                ])}$`,
          ),
          t(
            `$${mat3Latex([
              [c, 0, 1],
              [0, c, 0],
              [0, 0, c],
            ])}$`,
            `$${mat3Latex([
              [c, 0, 1],
              [0, c, 0],
              [0, 0, c],
            ])}$`,
          ),
          t(
            `$${mat3Latex([
              [c, 1, 1],
              [0, c, 1],
              [0, 0, c],
            ])}$`,
            `$${mat3Latex([
              [c, 1, 1],
              [0, c, 1],
              [0, 0, c],
            ])}$`,
          ),
        ];
        const solution = t(
          `The number of Jordan blocks is the geometric multiplicity $\\operatorname{nullity}(A${shiftStr}) = 3 - ${rankCase} = ${3 - rankCase}$. ${
            rankCase === 1
              ? `Since there are 2 Jordan blocks of total size 3, the block sizes must be $2 + 1$: $J = \\operatorname{diag}(J_2(${c}), J_1(${c})) = ${mat3Latex(matJ)}$.`
              : `Since there is only 1 Jordan block of size 3, $J = J_3(${c}) = ${mat3Latex(matJ)}$.`
          }`,
          `若尔当块的数量等于几何重数 $\\operatorname{nullity}(A${shiftStr}) = 3 - ${rankCase} = ${3 - rankCase}$。${
            rankCase === 1
              ? `因为总尺寸为 3 且有 2 个若尔当块，所以块尺寸必为 $2 + 1$：$J = \\operatorname{diag}(J_2(${c}), J_1(${c})) = ${mat3Latex(matJ)}$。`
              : `因为只有一个尺寸为 3 的若尔当块，所以 $J = J_3(${c}) = ${mat3Latex(matJ)}$。`
          }`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-largest-jordan-block-of-a-triangular-3x3-matrix",
      title: t("The largest Jordan block of a triangular 3×3 matrix", "三角 3×3 矩阵的最大若尔当块"),
      explanation: t(
        "For $A = cI + N$ with $N$ strictly upper triangular, the only eigenvalue is $c$ and the size of the largest Jordan block is the smallest $k$ with $N^k = 0$. If $N = 0$ every block has size $1$. Otherwise check $N^2$: for $N = \\begin{pmatrix} 0 & p & q \\\\ 0 & 0 & r \\\\ 0 & 0 & 0 \\end{pmatrix}$ the only nonzero entry of $N^2$ is $pr$ in the corner, so the largest block has size $3$ when $pr \\ne 0$ and size $2$ when $pr = 0$.",
        "对 $A = cI + N$（$N$ 为严格上三角），唯一特征值是 $c$，最大若尔当块的阶数是满足 $N^k = 0$ 的最小 $k$。若 $N = 0$，所有块阶数为 $1$。否则检查 $N^2$：对 $N = \\begin{pmatrix} 0 & p & q \\\\ 0 & 0 & r \\\\ 0 & 0 & 0 \\end{pmatrix}$，$N^2$ 唯一的非零元素是角上的 $pr$，所以 $pr \\ne 0$ 时最大块阶数为 $3$，$pr = 0$ 时为 $2$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(-4, 4);
        const nz = () => rng.int(1, 4) * rng.pick([-1, 1]);
        const kind = rng.pick([3, 3, 2, 2, 2, 1]);
        let [p, q, r] = [0, 0, 0];
        if (kind === 3) [p, q, r] = [nz(), rng.int(-3, 3), nz()];
        else if (kind === 2)
          [p, q, r] = rng.pick([
            [nz(), rng.int(-3, 3), 0],
            [0, rng.int(-3, 3), nz()],
            [0, nz(), 0],
          ]);
        const A: Mat3 = [
          [c, p, q],
          [0, c, r],
          [0, 0, c],
        ];
        return numberProblem({
          prompt: t(
            `What is the size of the largest Jordan block in the Jordan form of $A = ${mat3Latex(A)}$?`,
            `$A = ${mat3Latex(A)}$ 的若尔当形中最大若尔当块的阶数是多少？`,
          ),
          answer: kind,
          wrong: [1, 2, 3],
          solution: t(
            kind === 1
              ? `$A = ${c}I$ is already diagonal, so every block has size $1$.`
              : `$N = A - ${c < 0 ? `(${c})` : c}I$ is nonzero and the corner entry of $N^2$ is $pr = ${p * r}$. ${kind === 3 ? "It is nonzero, so $N^2 \\ne 0$ and the largest block has size $3$." : "So $N^2 = 0$ and the largest block has size $2$."}`,
            kind === 1
              ? `$A = ${c}I$ 已是对角矩阵，所以每个块的阶数都是 $1$。`
              : `$N = A - ${c < 0 ? `(${c})` : c}I$ 非零，$N^2$ 角上的元素为 $pr = ${p * r}$。${kind === 3 ? "它非零，所以 $N^2 \\ne 0$，最大块阶数为 $3$。" : "所以 $N^2 = 0$，最大块阶数为 $2$。"}`,
          ),
        });
      },
    },
  ],
};

/** jordanCanonicalDecompositionOfA3x3Matrix finds transition matrix P for 3x3 Jordan form. */
export const jordanCanonicalDecompositionOfA3x3Matrix: TopicDef = {
  id: "jordan-canonical-decomposition-of-a-3x3-matrix",
  title: t("Jordan Canonical Decomposition of a 3x3 Matrix", "3x3 矩阵的若尔当标准分解"),
  summary: t(
    "Build Jordan chains to form the invertible matrix $P$ with $A = PJP^{-1}$ for $3 \\times 3$ matrices.",
    "对 $3 \\times 3$ 矩阵构造若尔当链，得到满足 $A = PJP^{-1}$ 的可逆矩阵 $P$。",
  ),
  prerequisites: ["jordan-canonical-form-of-a-3x3-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "jordan-chain-relations-3x3",
      title: t("Jordan Chain Relations for 3x3 Matrices", "3x3 矩阵若尔当链的关系"),
      explanation: t(
        "In a chain the shifted matrix sends each column to the one before it, and sends the first column, an ordinary eigenvector, to zero. Identify the relations between column vectors of P corresponding to a size-3 Jordan block.",
        "在一条链中，平移后的矩阵把每一列映射到前一列，并把第一列（一个普通特征向量）映射到零。识别对应 3 阶若尔当块的变换矩阵 P 各列向量之间的链式关系。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.int(-15, 15);
        const shiftStr = formatShift(lambda, "I");
        const prompt = t(
          `Let $A$ be a $3 \\times 3$ matrix with a single Jordan block $J_3(${lambda})$. How are the column vectors $v_1, v_2, v_3$ of the transition matrix $P = \\begin{pmatrix} v_1 & v_2 & v_3 \\end{pmatrix}$ (satisfying $P^{-1} A P = J_3(${lambda})$) related?`,
          `设 $A$ 为 $3 \\times 3$ 矩阵，其若尔当标准型为单一若尔当块 $J_3(${lambda})$。求满足 $P^{-1} A P = J_3(${lambda})$ 的过渡矩阵 $P = \\begin{pmatrix} v_1 & v_2 & v_3 \\end{pmatrix}$ 的列向量 $v_1, v_2, v_3$ 之间的关系。`,
        );
        const right = t(
          `$(A${shiftStr})v_1 = 0$, $(A${shiftStr})v_2 = v_1$, and $(A${shiftStr})v_3 = v_2$`,
          `$(A${shiftStr})v_1 = 0$、$(A${shiftStr})v_2 = v_1$ 且 $(A${shiftStr})v_3 = v_2$`,
        );
        const wrong = [
          t(
            `$(A${shiftStr})v_1 = 0$, $(A${shiftStr})v_2 = 0$, and $(A${shiftStr})v_3 = 0$`,
            `$(A${shiftStr})v_1 = 0$、$(A${shiftStr})v_2 = 0$ 且 $(A${shiftStr})v_3 = 0$`,
          ),
          t(
            `$(A${shiftStr})v_3 = 0$, $(A${shiftStr})v_2 = v_3$, and $(A${shiftStr})v_1 = v_2$`,
            `$(A${shiftStr})v_3 = 0$、$(A${shiftStr})v_2 = v_3$ 且 $(A${shiftStr})v_1 = v_2$`,
          ),
          t(
            `$Av_1 = ${lambda}v_1$, $Av_2 = ${lambda}^2 v_2$, and $Av_3 = ${lambda}^3 v_3$`,
            `$Av_1 = ${lambda}v_1$、$Av_2 = ${lambda}^2 v_2$ 且 $Av_3 = ${lambda}^3 v_3$`,
          ),
          t(`$v_1 + v_2 + v_3 = 0$`, `$v_1 + v_2 + v_3 = 0$`),
        ];
        const solution = t(
          `The equation $AP = PJ_3(\\lambda)$ expands column-by-column to $Av_1 = \\lambda v_1$, $Av_2 = v_1 + \\lambda v_2$, and $Av_3 = v_2 + \\lambda v_3$. Rearranging gives $(A - \\lambda I)v_1 = 0$, $(A - \\lambda I)v_2 = v_1$, and $(A - \\lambda I)v_3 = v_2$.`,
          `方程 $AP = PJ_3(\\lambda)$ 按列展开为 $Av_1 = \\lambda v_1$、$Av_2 = v_1 + \\lambda v_2$ 以及 $Av_3 = v_2 + \\lambda v_3$。移项整理得到 $(A - \\lambda I)v_1 = 0$、$(A - \\lambda I)v_2 = v_1$ 且 $(A - \\lambda I)v_3 = v_2$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "a-determinant-from-a-3x3-jordan-decomposition",
      title: t("A determinant from a Jordan decomposition", "由若尔当分解求行列式"),
      explanation: t(
        "If $A = PJP^{-1}$, then $A - kI = P(J - kI)P^{-1}$, so $\\det(A - kI) = \\det(J - kI)$. The matrix $J - kI$ is upper triangular, so its determinant is the product of its diagonal entries. For $J = J_2(\\lambda) \\oplus J_1(\\mu)$ this gives $(\\lambda - k)^2(\\mu - k)$, without ever computing $A$.",
        "若 $A = PJP^{-1}$，则 $A - kI = P(J - kI)P^{-1}$，所以 $\\det(A - kI) = \\det(J - kI)$。$J - kI$ 是上三角矩阵，其行列式等于对角元素之积。对 $J = J_2(\\lambda) \\oplus J_1(\\mu)$，结果为 $(\\lambda - k)^2(\\mu - k)$，无需算出 $A$。",
      ),
      generate(rng: Rng): Problem {
        const lam = rng.int(-3, 4);
        const mu = lam + rng.pick([-3, -2, -1, 1, 2, 3]);
        const k = rng.pick([-2, -1, 1, 2, 3].filter((x) => x !== lam && x !== mu));
        const ans = (lam - k) ** 2 * (mu - k);
        const J: Mat3 = [
          [lam, 1, 0],
          [0, lam, 0],
          [0, 0, mu],
        ];
        return numberProblem({
          prompt: t(
            `$A = PJP^{-1}$ with $J = ${mat3Latex(J)}$. Find $\\det(A${formatShift(k)})$.`,
            `$A = PJP^{-1}$，其中 $J = ${mat3Latex(J)}$。求 $\\det(A${formatShift(k)})$。`,
          ),
          answer: ans,
          wrong: [(lam - k) * (mu - k), (lam + k) ** 2 * (mu + k), lam * lam * mu - k, (lam - k) ** 2 * (mu - k) - (mu - k)],
          solution: t(
            `$\\det(A${formatShift(k)}) = \\det(J${formatShift(k)}) = (${lam} ${k < 0 ? "+" : "-"} ${Math.abs(k)})^2(${mu} ${k < 0 ? "+" : "-"} ${Math.abs(k)}) = ${ans}$.`,
            `$\\det(A${formatShift(k)}) = \\det(J${formatShift(k)}) = (${lam} ${k < 0 ? "+" : "-"} ${Math.abs(k)})^2(${mu} ${k < 0 ? "+" : "-"} ${Math.abs(k)}) = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** matrixFunctions evaluates analytic functions of matrices via Jordan canonical form. */
export const matrixFunctions: TopicDef = {
  id: "matrix-functions",
  title: t("Matrix Functions", "矩阵函数"),
  summary: t(
    "Evaluate analytic matrix functions f(A) on diagonalizable matrices and Jordan blocks using derivatives.",
    "利用导数在可对角化矩阵与若尔当块上计算解析矩阵函数 f(A)。",
  ),
  prerequisites: ["jordan-canonical-decomposition-of-a-3x3-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "evaluating-functions-on-jordan-blocks-kp",
      title: t("Evaluating Functions on Jordan Blocks", "在若尔当块上求值矩阵函数"),
      explanation: t(
        "The one above the diagonal acts like a small step, so a function of a Jordan block brings in the derivative of the function above the diagonal, as in a Taylor expansion. Apply $f\\left(\\begin{bmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{bmatrix}\\right) = \\begin{bmatrix} f(\\lambda) & f'(\\lambda) \\\\ 0 & f(\\lambda) \\end{bmatrix}$.",
        "对角线上方的 1 像一个小步长，所以若尔当块的函数会在对角线上方引入函数的导数，就像泰勒展开一样。应用公式 $f\\left(\\begin{bmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{bmatrix}\\right) = \\begin{bmatrix} f(\\lambda) & f'(\\lambda) \\\\ 0 & f(\\lambda) \\end{bmatrix}$。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.int(1, 8);
        const k = rng.int(2, 6);
        // Function f(x) = x^k
        // f(J) = [[lambda^k, k * lambda^(k-1)], [0, lambda^k]]
        const diagVal = lambda ** k;
        const superVal = k * lambda ** (k - 1);
        const prompt = t(
          `For the $2 \\times 2$ Jordan block $J = \\begin{pmatrix} ${lambda} & 1 \\\\ 0 & ${lambda} \\end{pmatrix}$, compute the matrix power $J^{${k}}$ by applying the matrix function formula $f(J) = \\begin{pmatrix} f(\\lambda) & f'(\\lambda) \\\\ 0 & f(\\lambda) \\end{pmatrix}$ with $f(x) = x^{${k}}$.`,
          `对于 $2 \\times 2$ 若尔当块 $J = \\begin{pmatrix} ${lambda} & 1 \\\\ 0 & ${lambda} \\end{pmatrix}$，应用矩阵函数公式 $f(J) = \\begin{pmatrix} f(\\lambda) & f'(\\lambda) \\\\ 0 & f(\\lambda) \\end{pmatrix}$（其中 $f(x) = x^{${k}}$）计算矩阵幂 $J^{${k}}$。`,
        );
        const right = t(
          `$\\begin{pmatrix} ${diagVal} & ${superVal} \\\\ 0 & ${diagVal} \\end{pmatrix}$`,
          `$\\begin{pmatrix} ${diagVal} & ${superVal} \\\\ 0 & ${diagVal} \\end{pmatrix}$`,
        );
        const wrong = [
          t(
            `$\\begin{pmatrix} ${diagVal} & 1 \\\\ 0 & ${diagVal} \\end{pmatrix}$`,
            `$\\begin{pmatrix} ${diagVal} & 1 \\\\ 0 & ${diagVal} \\end{pmatrix}$`,
          ),
          t(
            `$\\begin{pmatrix} ${diagVal} & 0 \\\\ 0 & ${diagVal} \\end{pmatrix}$`,
            `$\\begin{pmatrix} ${diagVal} & 0 \\\\ 0 & ${diagVal} \\end{pmatrix}$`,
          ),
          t(
            `$\\begin{pmatrix} ${diagVal} & ${diagVal} \\\\ 0 & ${diagVal} \\end{pmatrix}$`,
            `$\\begin{pmatrix} ${diagVal} & ${diagVal} \\\\ 0 & ${diagVal} \\end{pmatrix}$`,
          ),
          t(
            `$\\begin{pmatrix} ${superVal} & ${diagVal} \\\\ 0 & ${superVal} \\end{pmatrix}$`,
            `$\\begin{pmatrix} ${superVal} & ${diagVal} \\\\ 0 & ${superVal} \\end{pmatrix}$`,
          ),
        ];
        const solution = t(
          `For $f(x) = x^{${k}}$, the derivative is $f'(x) = ${k} x^{${k - 1}}$. At $x = ${lambda}$, we have $f(${lambda}) = ${lambda}^{${k}} = ${diagVal}$ and $f'(${lambda}) = ${k}(${lambda})^{${k - 1}} = ${superVal}$. Therefore, $J^{${k}} = \\begin{pmatrix} ${diagVal} & ${superVal} \\\\ 0 & ${diagVal} \\end{pmatrix}$.`,
          `对于 $f(x) = x^{${k}}$，其导数为 $f'(x) = ${k} x^{${k - 1}}$。在 $x = ${lambda}$ 处，$f(${lambda}) = ${lambda}^{${k}} = ${diagVal}$ 且 $f'(${lambda}) = ${k}(${lambda})^{${k - 1}} = ${superVal}$。因此 $J^{${k}} = \\begin{pmatrix} ${diagVal} & ${superVal} \\\\ 0 & ${diagVal} \\end{pmatrix}$。`,
        );
        return oneOf(rng, prompt, right, wrong, solution);
      },
    },
    {
      id: "the-corner-entry-of-a-power-of-a-3x3-jordan-block",
      title: t("The corner entry of a power of a 3×3 Jordan block", "3×3 若尔当块幂的角元素"),
      explanation: t(
        "For a Jordan block $J_3(\\lambda)$, a matrix function is $f(J) = \\begin{pmatrix} f(\\lambda) & f'(\\lambda) & \\tfrac{1}{2}f''(\\lambda) \\\\ 0 & f(\\lambda) & f'(\\lambda) \\\\ 0 & 0 & f(\\lambda) \\end{pmatrix}$. With $f(x) = x^n$ the corner entry is $\\tfrac{1}{2}n(n-1)\\lambda^{n-2} = \\binom{n}{2}\\lambda^{n-2}$. The same pattern comes from the binomial expansion of $(\\lambda I + N)^n$, which stops after $N^2$.",
        "对若尔当块 $J_3(\\lambda)$，矩阵函数为 $f(J) = \\begin{pmatrix} f(\\lambda) & f'(\\lambda) & \\tfrac{1}{2}f''(\\lambda) \\\\ 0 & f(\\lambda) & f'(\\lambda) \\\\ 0 & 0 & f(\\lambda) \\end{pmatrix}$。取 $f(x) = x^n$，角元素为 $\\tfrac{1}{2}n(n-1)\\lambda^{n-2} = \\binom{n}{2}\\lambda^{n-2}$。由 $(\\lambda I + N)^n$ 的二项展开（到 $N^2$ 为止）也得到同样的规律。",
      ),
      generate(rng: Rng): Problem {
        const lam = rng.pick([-3, -2, -1, 1, 2, 3]);
        const n = rng.int(3, 7);
        const c2 = (n * (n - 1)) / 2;
        const ans = c2 * lam ** (n - 2);
        const J: Mat3 = [
          [lam, 1, 0],
          [0, lam, 1],
          [0, 0, lam],
        ];
        return numberProblem({
          prompt: t(
            `Let $J = ${mat3Latex(J)}$. Find the top-right entry of $J^{${n}}$.`,
            `设 $J = ${mat3Latex(J)}$。求 $J^{${n}}$ 的右上角元素。`,
          ),
          answer: ans,
          wrong: [n * (n - 1) * lam ** (n - 2), n * lam ** (n - 1), c2 * lam ** (n - 1), lam ** n],
          solution: t(
            `With $f(x) = x^{${n}}$, the corner entry is $\\tfrac{1}{2}f''(${lam}) = \\binom{${n}}{2}(${lam})^{${n - 2}} = ${c2} \\cdot ${lam ** (n - 2)} = ${ans}$.`,
            `取 $f(x) = x^{${n}}$，角元素为 $\\tfrac{1}{2}f''(${lam}) = \\binom{${n}}{2}(${lam})^{${n - 2}} = ${c2} \\cdot ${lam ** (n - 2)} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// TOPIC EXPORT LIST
// ════════════════════════════════════════════════════════════════════════════

/** linearAlgebraTransformationsEigenvaluesTopics exports all topics for Units 4 and 5 of Linear Algebra. */
export const linearAlgebraTransformationsEigenvaluesTopics: readonly TopicDef[] = [
  // Module 4.14: Linear Transformations
  standardMatrixOfALinearTransformationInTermsOfTheStandardBasis,
  kernelOfALinearTransformation,
  imageAndRankOfALinearTransformation,
  imageOfALinearTransformationInTheCartesianPlane,
  invertibleMatrixTheoremInTermsOfLinearTransformations,
  rankNullityTheoremInTermsOfLinearTransformations,

  // Module 4.15: Linear Maps and Their Matrix Representations
  matrixOfALinearTransformationRelativeToABasis,
  connectionsBetweenMatrixRepresentationsOfALinearTransformation,
  linearMapsBetweenTwoDifferentVectorSpaces,
  matrixOfALinearMapRelativeToTwoBases,

  // Module 5.16: Eigenvectors and Eigenvalues
  eigenvaluesAndEigenvectorsOfA2x2Matrix,
  calculatingTheEigenvaluesOfA2x2Matrix,
  calculatingTheEigenvectorsOfA2x2Matrix,
  characteristicEquationOfAMatrix,
  cayleyHamiltonTheorem,
  calculatingTheEigenvectorsOfA3x3MatrixWithDistinctEigenvalues,
  calculatingTheEigenvectorsOfA3x3MatrixInTheGeneralCase,
  invertibleMatrixTheoremInTermsOfEigenvalues,

  // Module 5.17: Diagonalization
  diagonalizingA2x2Matrix,
  propertiesOfDiagonalization,
  diagonalizingA3x3MatrixWithDistinctEigenvalues,
  diagonalizingA3x3MatrixInTheGeneralCase,

  // Module 5.18: Real Matrices With Complex Eigenvalues
  vectorsOverTheComplexNumbers,
  matricesOverTheComplexNumbers,
  findingComplexEigenvaluesOfReal2x2Matrices,
  findingComplexEigenvectorsOfReal2x2Matrices,
  rotationScalingMatrices,
  reducingReal2x2MatricesToRotationScalingForm,
  blockDiagonalizationOfNxNMatrices,

  // Module 5.19: Generalized Eigenvectors
  nilpotentAndIdempotentMatrices,
  generalizedEigenvectors,
  ranksOfGeneralizedEigenvectors,
  findingGeneralizedEigenvectorsOfSpecificRanks,

  // Module 5.20: Jordan Canonical Decomposition
  jordanBlocksAndJordanMatrices,
  jordanCanonicalFormOfA2x2Matrix,
  jordanCanonicalDecompositionOfA2x2Matrix,
  jordanCanonicalFormOfA3x3Matrix,
  jordanCanonicalDecompositionOfA3x3Matrix,
  matrixFunctions,
];
