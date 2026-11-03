import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { article, choiceProblem, numberProblem, pointProblem, solutionsProblem } from "../problems.ts";

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
        "Find the set of all vectors that are mapped to zero under a linear transformation.",
        "求解在线性变换下映射为零向量的所有向量集合。",
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
      explanation: t("Determine the dimension of the image of a linear transformation.", "确定线性变换像空间的维数（秩）。"),
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
        "For a linear transformation $T: V \\to W$, compute $\\operatorname{rank}(T) = \\dim(V) - \\operatorname{nullity}(T)$.",
        "对线性变换 $T: V \\to W$，利用 $\\operatorname{rank}(T) = \\dim(V) - \\operatorname{nullity}(T)$ 计算其秩。",
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
        "Form the matrix $[T]_B$ whose columns are the coordinate vectors $[T(\\mathbf{b}_j)]_B$.",
        "构造各列为坐标向量 $[T(\\mathbf{b}_j)]_B$ 的矩阵 $[T]_B$。",
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
        "Apply the formula $[T]_C = P^{-1} [T]_B P$, where $P$ is the change-of-basis matrix from $C$ to $B$.",
        "应用公式 $[T]_C = P^{-1} [T]_B P$，其中 $P$ 为从基 $C$ 到基 $B$ 的过渡矩阵。",
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
        "Evaluate linear transformations from $\\mathbb{P}_2$ to $\\mathbb{R}^2$ or between other distinct spaces.",
        "求从 $\\mathbb{P}_2$ 到 $\\mathbb{R}^2$ 等不同空间之间的线性映射的值。",
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
        "Construct $[T]_{C \\leftarrow B}$, whose columns are the $C$-coordinate vectors of the images of the $B$-basis vectors.",
        "构造矩阵 $[T]_{C \\leftarrow B}$，其各列为基 $B$ 中向量的像在基 $C$ 下的坐标向量。",
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
        "Verify whether a given vector is an eigenvector and find its corresponding eigenvalue.",
        "检验给定向量是否为特征向量并求解其对应的特征值。",
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
        "Find the real eigenvalues of a $2 \\times 2$ matrix from its trace and determinant.",
        "利用矩阵的迹和行列式求 $2 \\times 2$ 矩阵的实特征值。",
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
        "Find the nontrivial solutions of $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ for a $2 \\times 2$ matrix.",
        "求 $2 \\times 2$ 矩阵方程 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ 的非零解。",
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
        "Express the characteristic equation in the standard form $\\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det(A) = 0$.",
        "将特征方程写为标准形式 $\\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det(A) = 0$。",
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
        "Substitute $A$ into its characteristic polynomial to compute $A^2 = \\operatorname{tr}(A)A - \\det(A)I$.",
        "将矩阵 $A$ 代入其特征多项式，计算 $A^2 = \\operatorname{tr}(A)A - \\det(A)I$。",
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
        "Solve $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ for a $3 \\times 3$ matrix with distinct eigenvalues.",
        "对具有互异特征值的 $3 \\times 3$ 矩阵，求解方程 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$。",
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
        "Compute $\\operatorname{nullity}(A - \\lambda I)$ to find the geometric multiplicity of a repeated eigenvalue.",
        "计算 $\\operatorname{nullity}(A - \\lambda I)$，得到重特征值的几何重数。",
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
        "Relate matrix invertibility to the absence of zero from the spectrum.",
        "将矩阵的可逆性与其特征值谱中不含零联系起来。",
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
        "Form $P$ and $D$ such that $A = PDP^{-1}$ for a diagonalizable $2 \\times 2$ matrix.",
        "构造矩阵 $P$ 与 $D$，使得可对角化的 $2 \\times 2$ 矩阵满足 $A = PDP^{-1}$。",
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
        "Apply $A^k = P D^k P^{-1}$ to compute high powers of a diagonalizable matrix.",
        "应用 $A^k = P D^k P^{-1}$ 计算可对角化矩阵的高次幂。",
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
        "Assemble the eigenvectors as the columns of $P$ so that $P^{-1} A P = D$.",
        "将特征向量组合为 $P$ 的各列，使得 $P^{-1} A P = D$。",
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
        "Check whether geometric multiplicity equals algebraic multiplicity for each eigenvalue.",
        "检验每个特征值的几何重数是否等于代数重数。",
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
        "Express a complex vector $\\mathbf{v} \\in \\mathbb{C}^n$ as $\\mathbf{v} = \\operatorname{Re}(\\mathbf{v}) + i \\operatorname{Im}(\\mathbf{v})$ and find its conjugate.",
        "将复向量 $\\mathbf{v} \\in \\mathbb{C}^n$ 表示为 $\\mathbf{v} = \\operatorname{Re}(\\mathbf{v}) + i \\operatorname{Im}(\\mathbf{v})$ 并求其复共轭。",
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
        "Calculate the conjugate transpose $A^* = \\bar{A}^T$ of a $2 \\times 2$ complex matrix.",
        "计算 $2 \\times 2$ 复矩阵的共轭转置 $A^* = \\bar{A}^T$。",
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
        "Solve the characteristic quadratic equation when $\\operatorname{tr}(A)^2 - 4\\det(A) < 0$.",
        "在 $\\operatorname{tr}(A)^2 - 4\\det(A) < 0$ 时求解特征二次方程。",
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
        "Find the nonzero solutions in $\\mathbb{C}^2$ of $(A - (a + bi)I)\\mathbf{v} = \\mathbf{0}$.",
        "在 $\\mathbb{C}^2$ 中求方程 $(A - (a + bi)I)\\mathbf{v} = \\mathbf{0}$ 的非零解。",
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
        "Compute the square of the scaling factor, $r^2 = a^2 + b^2$, for a rotation-scaling matrix.",
        "计算旋转缩放矩阵缩放因子的平方 $r^2 = a^2 + b^2$。",
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
        "Assemble $P = \\begin{bmatrix} \\operatorname{Re}(\\mathbf{v}) & \\operatorname{Im}(\\mathbf{v}) \\end{bmatrix}$ for an eigenvector $\\mathbf{v}$ of the eigenvalue $a - bi$.",
        "利用特征值 $a - bi$ 的特征向量 $\\mathbf{v}$ 构造矩阵 $P = \\begin{bmatrix} \\operatorname{Re}(\\mathbf{v}) & \\operatorname{Im}(\\mathbf{v}) \\end{bmatrix}$。",
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
        "Determine the block diagonal structure from real and complex conjugate pairs of eigenvalues.",
        "根据实特征值与共轭复特征值对确定分块对角结构。",
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
        "Recognize that nilpotent matrices have only eigenvalue 0, and idempotent matrices have only eigenvalues 0 and 1.",
        "认识到幂零矩阵的特征值只能为 0，而幂等矩阵的特征值只能为 0 或 1。",
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
        "Identify the defining condition $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$ for a generalized eigenvector.",
        "识别广义特征向量的定义条件 $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$。",
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
        "Find the smallest positive integer $k$ such that $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$.",
        "求满足 $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$ 的最小正整数 $k$。",
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
        "Solve $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$, where $\\mathbf{v}_1$ is an ordinary eigenvector.",
        "求解 $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$，其中 $\\mathbf{v}_1$ 为普通特征向量。",
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
      explanation: t("Identify Jordan blocks and block diagonal Jordan matrices.", "识别若尔当块及分块对角的若尔当矩阵。"),
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
        "Distinguish diagonalizable $2 \\times 2$ matrices from those similar to a single Jordan block $\\begin{bmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{bmatrix}$.",
        "区分可对角化的 $2 \\times 2$ 矩阵与相似于单个若尔当块 $\\begin{bmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{bmatrix}$ 的矩阵。",
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
        "Find $P = \\begin{bmatrix} \\mathbf{v}_1 & \\mathbf{v}_2 \\end{bmatrix}$ satisfying $(A - \\lambda I)\\mathbf{v}_1 = \\mathbf{0}$ and $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$.",
        "求满足 $(A - \\lambda I)\\mathbf{v}_1 = \\mathbf{0}$ 与 $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$ 的矩阵 $P = \\begin{bmatrix} \\mathbf{v}_1 & \\mathbf{v}_2 \\end{bmatrix}$。",
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
        "Determine whether $J$ is $J_3(\\lambda)$, $\\operatorname{diag}(J_2(\\lambda), J_1(\\lambda))$, or $\\operatorname{diag}(J_1(\\lambda), J_1(\\lambda), J_1(\\lambda))$.",
        "判定若尔当标准型 $J$ 是 $J_3(\\lambda)$、$\\operatorname{diag}(J_2(\\lambda), J_1(\\lambda))$ 还是 $\\operatorname{diag}(J_1(\\lambda), J_1(\\lambda), J_1(\\lambda))$。",
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
        "Identify the relations between column vectors of P corresponding to a size-3 Jordan block.",
        "识别对应 3 阶若尔当块的变换矩阵 P 各列向量之间的链式关系。",
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
        "Apply $f\\left(\\begin{bmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{bmatrix}\\right) = \\begin{bmatrix} f(\\lambda) & f'(\\lambda) \\\\ 0 & f(\\lambda) \\end{bmatrix}$.",
        "应用公式 $f\\left(\\begin{bmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{bmatrix}\\right) = \\begin{bmatrix} f(\\lambda) & f'(\\lambda) \\\\ 0 & f(\\lambda) \\end{bmatrix}$。",
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
