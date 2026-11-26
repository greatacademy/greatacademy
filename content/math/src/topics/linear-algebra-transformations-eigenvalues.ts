import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";
import { linearAlgebraDrawings1 } from "../explanation-drawings-linear-algebra-1.ts";
import { linearAlgebraDrawings2 } from "../explanation-drawings-linear-algebra-2.ts";

import {
  article,
  choiceProblem,
  numberProblem,
  pointProblem,
  say,
  solutionsProblem,
  vectorLatex,
  why,
  whySet,
  withMistakes,
  yesNo,
} from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** dedupeSaid drops mistakes that repeat the right response or an earlier mistake. */
function dedupeSaid<T extends { readonly response: string }>(list: readonly T[], right: string): T[] {
  return list.filter((m, i, all) => m.response !== right && all.findIndex((o) => o.response === m.response) === i);
}

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
  intro: t(
    "Suppose $T(e_1) = (2, 1)$ and $T(e_2) = (-1, 3)$. Writing these images as columns gives the standard matrix $[T] = \\begin{pmatrix} 2 & -1 \\\\ 1 & 3 \\end{pmatrix}$, and then $T(4, 1) = 4T(e_1) + T(e_2) = (8, 4) + (-1, 3) = (7, 7)$.\n\nCheck: $\\begin{pmatrix} 2 & -1 \\\\ 1 & 3 \\end{pmatrix}\\begin{pmatrix} 4 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 8 - 1 \\\\ 4 + 3 \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ 7 \\end{pmatrix}$, the same vector.\n\nIn this lesson we build the standard matrix from the images of $e_1$ and $e_2$ and use it to evaluate the transformation.",
    "设 $T(e_1) = (2, 1)$，$T(e_2) = (-1, 3)$。把这两个像写成列，得到标准矩阵 $[T] = \\begin{pmatrix} 2 & -1 \\\\ 1 & 3 \\end{pmatrix}$；于是 $T(4, 1) = 4T(e_1) + T(e_2) = (8, 4) + (-1, 3) = (7, 7)$。\n\n检验：$\\begin{pmatrix} 2 & -1 \\\\ 1 & 3 \\end{pmatrix}\\begin{pmatrix} 4 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 8 - 1 \\\\ 4 + 3 \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ 7 \\end{pmatrix}$，是同一个向量。\n\n本课我们由 $e_1$ 和 $e_2$ 的像构造标准矩阵，并用它求变换的值。",
  ),
  prerequisites: ["the-standard-matrix-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "columns-from-standard-basis-images",
      title: t("Columns from Standard Basis Images", "标准基向量的像构成矩阵各列"),
      explanation: t(
        "The $j$-th column of the standard matrix $[T]$ is the image $T(\\mathbf{e}_j)$ of the $j$-th standard basis vector, because $[T]\\mathbf{e}_j$ picks out column $j$. For example, if $T(e_1) = (3, -2)$ and $T(e_2) = (0, 5)$, then $[T] = \\begin{pmatrix} 3 & 0 \\\\ -2 & 5 \\end{pmatrix}$.\n\n> **Watch out.** The images go in as columns, not rows, and in the order $e_1$, $e_2$.",
        "标准矩阵 $[T]$ 的第 $j$ 列就是第 $j$ 个标准基向量的像 $T(\\mathbf{e}_j)$，因为 $[T]\\mathbf{e}_j$ 恰好取出第 $j$ 列。例如若 $T(e_1) = (3, -2)$，$T(e_2) = (0, 5)$，则 $[T] = \\begin{pmatrix} 3 & 0 \\\\ -2 & 5 \\end{pmatrix}$。\n\n> **注意。** 像要作为列放入，而不是作为行，并且按 $e_1$、$e_2$ 的顺序。",
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
        const m = (x: Mat2) => t(`$${mat2Latex(x)}$`, `$${mat2Latex(x)}$`);
        const answer: Mat2 = [
          [a, b],
          [c, d],
        ];
        const right = m(answer);
        const wrong = [
          m([
            [a, c],
            [b, d],
          ]),
          m([
            [b, a],
            [d, c],
          ]),
          m([
            [c, d],
            [a, b],
          ]),
          m([
            [d, b],
            [c, a],
          ]),
        ];
        const solution = walked(
          [
            [
              ["Place the images as columns", "把像作为列放入"],
              t("Column $1$ is $T(e_1)$ and column $2$ is $T(e_2)$:", "第 $1$ 列是 $T(e_1)$，第 $2$ 列是 $T(e_2)$："),
              [`[T] = \\begin{pmatrix} T(e_1) & T(e_2) \\end{pmatrix} = ${mat2Latex(answer)}`],
            ],
          ],
          t(
            `$[T]e_1 = ${mat2Latex(answer)}${vec2Latex([1, 0])} = ${vec2Latex(e1Img)} = T(e_1)$, and likewise $[T]e_2 = ${vec2Latex(e2Img)}$.`,
            `$[T]e_1 = ${mat2Latex(answer)}${vec2Latex([1, 0])} = ${vec2Latex(e1Img)} = T(e_1)$，同样 $[T]e_2 = ${vec2Latex(e2Img)}$。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "This puts the images in as rows; each image is a column of $[T]$.",
            "这是把像作为行放入了；每个像是 $[T]$ 的一列。",
          ],
          [wrong[1]!.en, "The columns are swapped: the first column must be $T(e_1)$.", "两列交换了：第一列必须是 $T(e_1)$。"],
          [
            wrong[2]!.en,
            "The rows are swapped: the top entry of each column is the first entry of the image.",
            "两行交换了：每列的上方元素是像的第一个分量。",
          ],
          [
            wrong[3]!.en,
            "The diagonal entries are swapped; read each column straight from $T(e_1)$ and $T(e_2)$.",
            "对角元交换了；每一列应直接照抄 $T(e_1)$ 和 $T(e_2)$。",
          ],
        ]);
      },
    },
    {
      id: "evaluating-a-transformation-from-basis-images",
      title: t("Evaluating a transformation from basis images", "由基向量的像求变换的值"),
      explanation: t(
        "A linear transformation is determined by what it does to the standard basis. Since $(p, q) = p\\,e_1 + q\\,e_2$, linearity gives\n\n$$T(p, q) = p\\,T(e_1) + q\\,T(e_2).$$\n\nThis is the same as multiplying the standard matrix, whose columns are $T(e_1)$ and $T(e_2)$, by the vector $(p, q)$. For example, with $T(e_1) = (1, 2)$ and $T(e_2) = (3, 0)$, $T(2, -1) = 2(1, 2) - (3, 0) = (-1, 4)$.\n\n> **Watch out.** Weight each image by the matching entry: $p$ goes with $T(e_1)$ and $q$ with $T(e_2)$.",
        "线性变换由它对标准基的作用决定。由于 $(p, q) = p\\,e_1 + q\\,e_2$，线性性给出\n\n$$T(p, q) = p\\,T(e_1) + q\\,T(e_2).$$\n\n这与用标准矩阵（其列为 $T(e_1)$ 和 $T(e_2)$）乘以向量 $(p, q)$ 是一样的。例如 $T(e_1) = (1, 2)$，$T(e_2) = (3, 0)$ 时，$T(2, -1) = 2(1, 2) - (3, 0) = (-1, 4)$。\n\n> **注意。** 每个像要乘对应的分量：$p$ 配 $T(e_1)$，$q$ 配 $T(e_2)$。",
      ),
      generate(rng: Rng): Problem {
        const [a, c, b, d] = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5)];
        const p = rng.int(-4, 4) || 2;
        const q = rng.int(-4, 4) || -1;
        const y1 = p * a + q * b;
        const y2 = p * c + q * d;
        const answer = [y1, y2];
        return withMistakes(
          pointProblem({
            prompt: t(
              `A linear transformation $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ has $T(e_1) = ${vec2Latex([a, c])}$ and $T(e_2) = ${vec2Latex([b, d])}$. Find $T\\begin{pmatrix} ${p} \\\\ ${q} \\end{pmatrix} = \\langle y_1, y_2 \\rangle$.`,
              `线性变换 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 满足 $T(e_1) = ${vec2Latex([a, c])}$，$T(e_2) = ${vec2Latex([b, d])}$。求 $T\\begin{pmatrix} ${p} \\\\ ${q} \\end{pmatrix} = \\langle y_1, y_2 \\rangle$。`,
            ),
            answer,
            vector: true,
            vars: ["y_1", "y_2"],
            solution: walked(
              [
                [["Split the input", "拆开输入"], t("", ""), [`${vec2Latex([p, q])} = ${formatLinearComb2(p, "e_1", q, "e_2")}`]],
                [
                  ["Use linearity", "用线性性"],
                  t("", ""),
                  [`T${vec2Latex([p, q])} = ${formatLinearComb2(p, vec2Latex([a, c]), q, vec2Latex([b, d]))} = ${vec2Latex([y1, y2])}`],
                ],
              ],
              t(
                `With the standard matrix: $${mat2Latex([
                  [a, b],
                  [c, d],
                ])}${vec2Latex([p, q])} = ${vec2Latex([y1, y2])}$.`,
                `用标准矩阵：$${mat2Latex([
                  [a, b],
                  [c, d],
                ])}${vec2Latex([p, q])} = ${vec2Latex([y1, y2])}$。`,
              ),
            ),
          }),
          dedupeSaid(
            [
              say(
                vectorLatex([p * a + q * c, p * b + q * d]),
                "This uses the images as rows; they are the columns of the matrix.",
                "这是把像当作行来用；它们是矩阵的列。",
              ),
              say(
                vectorLatex([a + b, c + d]),
                "This adds the images without weighting them by the entries of the input.",
                "这是直接把像相加，没有乘上输入的分量。",
              ),
              say(
                vectorLatex([q * a + p * b, q * c + p * d]),
                "The weights are swapped: $p$ goes with $T(e_1)$ and $q$ with $T(e_2)$.",
                "权重交换了：$p$ 配 $T(e_1)$，$q$ 配 $T(e_2)$。",
              ),
            ],
            vectorLatex(answer),
          ),
        );
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
  intro: t(
    "Let $T(\\mathbf{x}) = A\\mathbf{x}$ with $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 6 \\end{pmatrix}$. Setting $A\\mathbf{x} = \\mathbf{0}$ gives $x_1 + 2x_2 = 0$ twice over, so $x_1 = -2x_2$, and the kernel is the line spanned by $(-2, 1)$.\n\nCheck: $A\\begin{pmatrix} -2 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} -2 + 2 \\\\ -6 + 6 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$.\n\nIn this lesson we find the kernel of a transformation by solving $A\\mathbf{x} = \\mathbf{0}$ and describe it by a spanning vector.",
    "设 $T(\\mathbf{x}) = A\\mathbf{x}$，$A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 6 \\end{pmatrix}$。令 $A\\mathbf{x} = \\mathbf{0}$，两行都给出 $x_1 + 2x_2 = 0$，所以 $x_1 = -2x_2$，核是由 $(-2, 1)$ 张成的直线。\n\n检验：$A\\begin{pmatrix} -2 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} -2 + 2 \\\\ -6 + 6 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$。\n\n本课我们通过解 $A\\mathbf{x} = \\mathbf{0}$ 求变换的核，并用张成向量来描述它。",
  ),
  prerequisites: ["standard-matrix-of-a-linear-transformation-in-terms-of-the-standard-basis"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "determining-kernel-of-linear-transformation",
      title: t("Determining the Kernel of a Linear Transformation", "确定线性变换的核"),
      explanation: t(
        "The kernel is always a subspace of the domain, and you find it by setting the output equal to zero and solving the resulting equations for the input. When the second row of a $2 \\times 2$ matrix is a multiple of the first, one equation remains and the kernel is a line. For example, $A = \\begin{pmatrix} 2 & 6 \\\\ 1 & 3 \\end{pmatrix}$ gives $x_1 + 3x_2 = 0$, so the kernel is spanned by $(-3, 1)$.\n\n> **Watch out.** Solve for $x_1$ before substituting: $x_1 + kx_2 = 0$ gives $x_1 = -kx_2$, with the sign changed.",
        "核总是定义域的子空间，求它时令输出等于零，再解出输入满足的方程。当 $2 \\times 2$ 矩阵的第二行是第一行的倍数时，只剩一个方程，核是一条直线。例如 $A = \\begin{pmatrix} 2 & 6 \\\\ 1 & 3 \\end{pmatrix}$ 给出 $x_1 + 3x_2 = 0$，所以核由 $(-3, 1)$ 张成。\n\n> **注意。** 代入之前先解出 $x_1$：$x_1 + kx_2 = 0$ 给出 $x_1 = -kx_2$，符号要变。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(1, 6);
        const b = rng.int(1, 6);
        const k = rng.pick([-3, -2, -1, 2, 3, 4])!;
        const mat: Mat2 = [
          [a, k * a],
          [b, k * b],
        ];
        const basisVec = [-k, 1];
        const prompt = t(
          `Let $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ be the linear transformation defined by $T(\\mathbf{x}) = A\\mathbf{x}$, where $A = ${mat2Latex(mat)}$. Find the basis vector $\\mathbf{v} = \\langle x_1, x_2 \\rangle$ for the kernel $\\ker(T)$ whose second component is $x_2 = 1$.`,
          `设 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 为由 $T(\\mathbf{x}) = A\\mathbf{x}$ 定义的线性变换，其中 $A = ${mat2Latex(mat)}$。求核 $\\ker(T)$ 的基向量 $\\mathbf{v} = \\langle x_1, x_2 \\rangle$，使其第二分量为 $x_2 = 1$。`,
        );
        const eq = `x_1 ${k > 0 ? "+" : "-"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}x_2 = 0`;
        const solution = walked(
          [
            [
              ["Reduce to one equation", "化为一个方程"],
              t(
                `Row 1 divided by $${a}$ and row 2 divided by $${b}$ both give the same equation:`,
                `第 1 行除以 $${a}$、第 2 行除以 $${b}$，都得到同一个方程：`,
              ),
              [eq],
            ],
            [["Set $x_2 = 1$", "令 $x_2 = 1$"], t("", ""), [`x_1 = ${-k}`]],
          ],
          t(
            `$A${vec2Latex([-k, 1])} = ${vec2Latex([`${a} \\cdot ${paren(-k)} + ${paren(k * a)}`, `${b} \\cdot ${paren(-k)} + ${paren(k * b)}`])} = ${vec2Latex([0, 0])}$.`,
            `$A${vec2Latex([-k, 1])} = ${vec2Latex([`${a} \\cdot ${paren(-k)} + ${paren(k * a)}`, `${b} \\cdot ${paren(-k)} + ${paren(k * b)}`])} = ${vec2Latex([0, 0])}$。`,
          ),
        );
        return withMistakes(
          pointProblem({ prompt, answer: basisVec, vector: true, solution }),
          dedupeSaid(
            [
              say(vectorLatex([k, 1]), `The sign is lost: $${eq}$ gives $x_1 = ${-k}x_2$.`, `符号丢了：$${eq}$ 给出 $x_1 = ${-k}x_2$。`),
              say(vectorLatex([-k, -1]), "This is in the kernel, but the question fixes $x_2 = 1$.", "它在核中，但题目要求 $x_2 = 1$。"),
              say(
                vectorLatex([1, -k]),
                "The entries are swapped: the second component must be $1$.",
                "两个分量交换了：第二个分量必须是 $1$。",
              ),
              say(
                vectorLatex([a, b]),
                "That is the first column of $A$, a vector in the image, not one sent to $\\mathbf{0}$.",
                "这是 $A$ 的第一列，是像中的向量，而不是被映为 $\\mathbf{0}$ 的向量。",
              ),
            ],
            vectorLatex(basisVec),
          ),
        );
      },
    },
    {
      id: "the-kernel-of-a-map-from-r3-to-r2",
      title: t("The kernel of a map from R^3 to R^2", "从 R^3 到 R^2 的映射的核"),
      explanation: t(
        "The kernel of $T(\\mathbf{x}) = A\\mathbf{x}$ is the solution set of $A\\mathbf{x} = \\mathbf{0}$. For a $2 \\times 3$ matrix already in echelon form with pivots in the first two columns, $x_3$ is free. Set $x_3 = 1$ and solve upward by back substitution: the second row gives $x_2$, then the first row gives $x_1$. The resulting vector spans the kernel. For example, with rows $(1, 2, 1)$ and $(0, 1, 3)$: $x_2 = -3$, then $x_1 = -(2 \\cdot (-3) + 1) = 5$, so the kernel is spanned by $(5, -3, 1)$.\n\n> **Watch out.** Use the value of $x_2$ already found when solving the first row; the first row has an $x_2$ term too.",
        "$T(\\mathbf{x}) = A\\mathbf{x}$ 的核是 $A\\mathbf{x} = \\mathbf{0}$ 的解集。对已是阶梯形、主元在前两列的 $2 \\times 3$ 矩阵，$x_3$ 是自由变量。令 $x_3 = 1$，用回代向上求解：第二行给出 $x_2$，再由第一行给出 $x_1$。所得向量张成核。例如两行为 $(1, 2, 1)$ 和 $(0, 1, 3)$ 时：$x_2 = -3$，于是 $x_1 = -(2 \\cdot (-3) + 1) = 5$，核由 $(5, -3, 1)$ 张成。\n\n> **注意。** 解第一行时要用已求出的 $x_2$；第一行也含 $x_2$ 项。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-4, 4);
        const b = rng.int(-5, 5);
        const c = rng.int(-4, 4) || 2;
        const x2 = -c;
        const x1 = -(a * x2 + b);
        const answer = [x1, x2, 1];
        return withMistakes(
          pointProblem({
            prompt: t(
              `Let $T(\\mathbf{x}) = A\\mathbf{x}$ with $A = \\begin{pmatrix} 1 & ${a} & ${b} \\\\ 0 & 1 & ${c} \\end{pmatrix}$. Find the vector $\\langle x_1, x_2, x_3 \\rangle$ spanning $\\ker(T)$ with $x_3 = 1$.`,
              `设 $T(\\mathbf{x}) = A\\mathbf{x}$，$A = \\begin{pmatrix} 1 & ${a} & ${b} \\\\ 0 & 1 & ${c} \\end{pmatrix}$。求张成 $\\ker(T)$ 且 $x_3 = 1$ 的向量 $\\langle x_1, x_2, x_3 \\rangle$。`,
            ),
            answer,
            vector: true,
            vars: ["x_1", "x_2", "x_3"],
            solution: walked(
              [
                [
                  ["Solve the second row", "解第二行"],
                  t("With $x_3 = 1$:", "取 $x_3 = 1$："),
                  [`x_2 + ${paren(c)} \\cdot 1 = 0`, `x_2 = ${x2}`],
                ],
                [
                  ["Solve the first row", "解第一行"],
                  t("Substitute $x_2$ and $x_3$:", "代入 $x_2$ 和 $x_3$："),
                  [`x_1 = -(${a} \\cdot ${paren(x2)} + ${paren(b)}) = ${x1}`],
                ],
              ],
              t(
                `Row 1: $${x1} + ${paren(a)} \\cdot ${paren(x2)} + ${paren(b)} = 0$, and row 2: $${x2} + ${paren(c)} = 0$.`,
                `第 1 行：$${x1} + ${paren(a)} \\cdot ${paren(x2)} + ${paren(b)} = 0$；第 2 行：$${x2} + ${paren(c)} = 0$。`,
              ),
            ),
          }),
          dedupeSaid(
            [
              say(
                vectorLatex([-b, -c, 1]),
                "The first row also has the term $a x_2$; substitute $x_2$ before solving for $x_1$.",
                "第一行还有 $a x_2$ 项；求 $x_1$ 前要先代入 $x_2$。",
              ),
              say(
                vectorLatex([a * c - b, c, 1]),
                `The sign of $x_2$ is lost: $x_2 + ${paren(c)} = 0$ gives $x_2 = ${x2}$.`,
                `$x_2$ 的符号丢了：$x_2 + ${paren(c)} = 0$ 给出 $x_2 = ${x2}$。`,
              ),
              say(
                vectorLatex([b, c, 1]),
                "These are the entries of the last column; solving $A\\mathbf{x} = \\mathbf{0}$ moves them across with the opposite sign.",
                "这是最后一列的元素；解 $A\\mathbf{x} = \\mathbf{0}$ 时移项要变号。",
              ),
            ],
            vectorLatex(answer),
          ),
        );
      },
    },
  ],
};

/** imageAndRankOfALinearTransformation covers the image and rank of linear transformations. */
export const imageAndRankOfALinearTransformation: TopicDef = {
  id: "image-and-rank-of-a-linear-transformation",
  title: t("The Image and Rank of a Linear Transformation", "线性变换的像与秩"),
  summary: t("Compute the rank and determine the image of a linear transformation.", "计算线性变换的秩并确定其像空间。"),
  intro: t(
    "For $T(\\mathbf{x}) = A\\mathbf{x}$ with $A = \\begin{pmatrix} 1 & 2 & 0 \\\\ 0 & 0 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix}$, the image is the span of the columns. Row 1 and row 2 have pivots and row 3 is zero, so the image is a plane in $\\mathbb{R}^3$ and the rank is $2$.\n\nCheck: column 2 is $2$ times column 1, while column 3 is not a multiple of column 1, so exactly two columns are independent.\n\nIn this lesson we find the rank of a transformation by counting pivots and recognize rows that add nothing to the rank.",
    "对 $T(\\mathbf{x}) = A\\mathbf{x}$，$A = \\begin{pmatrix} 1 & 2 & 0 \\\\ 0 & 0 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix}$，像是各列的张成。第 1、2 行有主元，第 3 行为零，所以像是 $\\mathbb{R}^3$ 中的一个平面，秩为 $2$。\n\n检验：第 2 列是第 1 列的 $2$ 倍，而第 3 列不是第 1 列的倍数，所以恰有两列线性无关。\n\n本课我们通过数主元求变换的秩，并识别对秩没有贡献的行。",
  ),
  prerequisites: ["kernel-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "computing-rank-of-linear-transformation",
      title: t("Computing the Rank of a Linear Transformation", "计算线性变换的秩"),
      explanation: t(
        "The rank of a transformation is the dimension of its range, which equals the rank of any matrix that represents it. For a matrix in echelon form, the rank is the number of nonzero rows, one per pivot. For example, $\\begin{pmatrix} 2 & 1 & 5 \\\\ 0 & 3 & -1 \\\\ 0 & 0 & 0 \\end{pmatrix}$ has two pivots, so the transformation has rank $2$ and its image is a plane in $\\mathbb{R}^3$.\n\n> **Watch out.** Count pivots, not all rows: a zero row adds nothing to the image, even though the matrix is $3 \\times 3$.",
        "变换的秩是值域的维数，它等于表示这个变换的任意矩阵的秩。对阶梯形矩阵，秩就是非零行的个数，每行一个主元。例如 $\\begin{pmatrix} 2 & 1 & 5 \\\\ 0 & 3 & -1 \\\\ 0 & 0 & 0 \\end{pmatrix}$ 有两个主元，所以变换的秩为 $2$，像是 $\\mathbb{R}^3$ 中的平面。\n\n> **注意。** 要数主元，而不是数所有行：零行对像没有贡献，即使矩阵是 $3 \\times 3$ 的。",
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
        const pivots = [`$${d1}$`, `$${d2}$`, `$${d3}$`].slice(0, finalRank).join(finalRank === 3 ? ", " : " and ");
        const pivotsZh = [`$${d1}$`, `$${d2}$`, `$${d3}$`].slice(0, finalRank).join("、");
        const solution = walked(
          [
            [
              ["Find the pivots", "找主元"],
              t(
                `$A$ is already in echelon form. Its pivots are ${pivots}${finalRank < 3 ? `, and the remaining ${3 - finalRank === 1 ? "row is" : "rows are"} zero` : ""}.`,
                `$A$ 已是阶梯形。主元为 ${pivotsZh}${finalRank < 3 ? "，其余行为零" : ""}。`,
              ),
            ],
            [
              ["Count them", "数个数"],
              t("The rank of $T$ is the number of pivots:", "$T$ 的秩等于主元的个数："),
              [`\\operatorname{rank}(T) = ${finalRank}`],
            ],
          ],
          t(
            `By rank-nullity the kernel has dimension $3 - ${finalRank} = ${3 - finalRank}$, one free variable for each column without a pivot.`,
            `由秩-零化度定理，核的维数为 $3 - ${finalRank} = ${3 - finalRank}$，每个没有主元的列对应一个自由变量。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: finalRank,
          form: "integer",
          solution,
          mistakes: [
            why(
              3,
              "That counts all three rows; a zero row has no pivot and adds nothing to the image.",
              "这是数了全部三行；零行没有主元，对像没有贡献。",
            ),
            why(
              3 - finalRank,
              "That is the nullity, the number of free variables; the rank counts the pivots.",
              "这是零化度，即自由变量的个数；秩数的是主元。",
            ),
            ...(finalRank === 3
              ? [why(2, `The third row has the pivot $${d3} \\ne 0$, so it counts too.`, `第三行有主元 $${d3} \\ne 0$，也要算上。`)]
              : finalRank === 1
                ? [why(2, "Only the first row is nonzero; the second row has no pivot.", "只有第一行非零；第二行没有主元。")]
                : [why(1, `The second row has the pivot $${d2}$, so there are two pivots.`, `第二行有主元 $${d2}$，所以有两个主元。`)]),
          ].filter((w, i, all) => w.value !== finalRank && all.findIndex((o) => o.value === w.value) === i),
        });
      },
    },
    {
      id: "the-rank-of-a-matrix-with-dependent-rows",
      title: t("The rank of a matrix with dependent rows", "行线性相关的矩阵的秩"),
      explanation: t(
        "The rank of $T(\\mathbf{x}) = A\\mathbf{x}$ is the dimension of its image, which equals the number of linearly independent rows (or columns) of $A$. A row that is a combination of other rows adds nothing: if row 3 equals $p$ times row 1 plus $q$ times row 2, row reduction turns it into zeros. Count the rows that remain non-zero after reduction. For example, the rows $(1, 2, 0)$, $(0, 1, 1)$ and $(2, 5, 1)$ have rank $2$, since $(2, 5, 1) = 2(1, 2, 0) + (0, 1, 1)$.\n\n> **Watch out.** Rows with no zeros can still be dependent; look for one row that is a combination of the others.",
        "$T(\\mathbf{x}) = A\\mathbf{x}$ 的秩是其像的维数，等于 $A$ 中线性无关的行（或列）的个数。一行若是其他行的组合，则不增加秩：若第 3 行等于第 1 行的 $p$ 倍加第 2 行的 $q$ 倍，行化简会把它变成零。数一数化简后剩下的非零行。例如行 $(1, 2, 0)$、$(0, 1, 1)$、$(2, 5, 1)$ 的秩为 $2$，因为 $(2, 5, 1) = 2(1, 2, 0) + (0, 1, 1)$。\n\n> **注意。** 没有零元素的行仍可能线性相关；要找出某一行是否为其他行的组合。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(1, 3);
        const r1 = [1, rng.int(-3, 3), rng.int(-3, 3)] as const;
        const r2 = [0, 1, rng.int(-3, 3)] as const;
        const p = rng.int(-2, 2) || 1;
        const q = rng.int(-2, 2);
        let rows: Mat3;
        let s = 0;
        let tt = 0;
        if (kind === 1) {
          s = rng.int(2, 3);
          tt = rng.pick([-2, -1, 2]);
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
        const rowText = (v: readonly number[]) => `(${v.join(", ")})`;
        const relation =
          kind === 1
            ? t(
                `Row 2 is $${s}$ times row 1 and row 3 is $${tt}$ times row 1.`,
                `第 2 行是第 1 行的 $${s}$ 倍，第 3 行是第 1 行的 $${tt}$ 倍。`,
              )
            : kind === 2
              ? t(
                  `Row 2 minus $${p}$ times row 1 is $${rowText(r2)}$, and row 3 equals $${p}$ times row 1 plus $${q}$ times $${rowText(r2)}$, so it adds nothing.`,
                  `第 2 行减去第 1 行的 $${p}$ 倍得 $${rowText(r2)}$，第 3 行等于第 1 行的 $${p}$ 倍加 $${rowText(r2)}$ 的 $${q}$ 倍，所以它没有贡献。`,
                )
              : rank === 3
                ? t(
                    `The determinant is $\\det A = ${det} \\ne 0$, so no row is a combination of the others.`,
                    `行列式 $\\det A = ${det} \\ne 0$，所以没有一行是其他行的组合。`,
                  )
                : t("The determinant is $0$, so one row is a combination of the other two.", "行列式为 $0$，所以某一行是另两行的组合。");
        return numberProblem({
          prompt: t(
            `Find the rank of $T(\\mathbf{x}) = A\\mathbf{x}$ for $A = ${mat3Latex(rows)}$.`,
            `求 $T(\\mathbf{x}) = A\\mathbf{x}$ 的秩，其中 $A = ${mat3Latex(rows)}$。`,
          ),
          answer: rank,
          form: "integer",
          mistakes: [
            why(
              3,
              "Three nonzero rows need not be independent; one is a combination of the others.",
              "三个非零行不一定线性无关；其中一行是其他行的组合。",
            ),
            why(
              2,
              rank === 3
                ? `$\\det A = ${det} \\ne 0$, so all three rows are independent.`
                : "Rows 2 and 3 are both multiples of row 1, so only one row is independent.",
              rank === 3 ? `$\\det A = ${det} \\ne 0$，所以三行都线性无关。` : "第 2、3 行都是第 1 行的倍数，所以只有一行线性无关。",
            ),
            why(
              1,
              "Not every row is a multiple of row 1; row 2 has a different direction.",
              "并非每一行都是第 1 行的倍数；第 2 行方向不同。",
            ),
            why(0, "The rank is $0$ only for the zero matrix.", "只有零矩阵的秩才是 $0$。"),
          ].filter((w, i, all) => w.value !== rank && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [["Look for a relation among the rows", "寻找行之间的关系"], relation],
              [
                ["Count the independent rows", "数线性无关的行"],
                t(
                  rank === 1
                    ? "Row reduction leaves only row 1 nonzero."
                    : rank === 2
                      ? "Row reduction leaves two nonzero rows."
                      : "Row reduction leaves three pivots.",
                  rank === 1 ? "行化简后只有第 1 行非零。" : rank === 2 ? "行化简后剩下两个非零行。" : "行化简后有三个主元。",
                ),
                [`\\operatorname{rank}(T) = ${rank}`],
              ],
            ],
            t(
              `The kernel then has dimension $3 - ${rank} = ${3 - rank}$${rank === 3 ? ", so only $\\mathbf{0}$ is sent to $\\mathbf{0}$" : ""}.`,
              `于是核的维数为 $3 - ${rank} = ${3 - rank}$${rank === 3 ? "，只有 $\\mathbf{0}$ 被映为 $\\mathbf{0}$" : ""}。`,
            ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 1 & 3 \\\\ 2 & 6 \\end{pmatrix}$ has second column $3$ times the first, so every output $A\\mathbf{x} = x_1(1, 2) + 3x_2(1, 2) = (x_1 + 3x_2)(1, 2)$ is a multiple of $(1, 2)$. The image is the line through the origin with direction $(1, 2)$.\n\nCheck: $A(1, 1) = (4, 8) = 4(1, 2)$, which lies on that line, while $(1, 0)$ does not, since $1 \\cdot 2 - 0 \\cdot 1 = 2 \\ne 0$.\n\nIn this lesson we decide whether the image of a map of the plane is a point, a line or the whole plane, and test whether a vector lies on an image line.",
    "矩阵 $A = \\begin{pmatrix} 1 & 3 \\\\ 2 & 6 \\end{pmatrix}$ 的第二列是第一列的 $3$ 倍，所以每个输出 $A\\mathbf{x} = x_1(1, 2) + 3x_2(1, 2) = (x_1 + 3x_2)(1, 2)$ 都是 $(1, 2)$ 的倍数。像是过原点、方向为 $(1, 2)$ 的直线。\n\n检验：$A(1, 1) = (4, 8) = 4(1, 2)$ 在这条直线上，而 $(1, 0)$ 不在，因为 $1 \\cdot 2 - 0 \\cdot 1 = 2 \\ne 0$。\n\n本课我们判断平面上映射的像是一个点、一条直线还是整个平面，并检验向量是否在像直线上。",
  ),
  prerequisites: ["image-and-rank-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "geometric-image-in-plane",
      title: t("Geometric Image in the Plane", "平面中的几何像空间"),
      explanation: t(
        "The image of a linear map of the plane is the span of the columns of its matrix: the origin alone if both columns are zero, a line through the origin if they are parallel and not both zero, and the whole plane $\\mathbb{R}^2$ if they are independent. For example, $\\begin{pmatrix} 2 & -4 \\\\ 1 & -2 \\end{pmatrix}$ has second column $-2$ times the first, so its image is the line spanned by $(2, 1)$.\n\n> **Watch out.** The image of a linear map always contains the origin, so it can never be a line that misses the origin.",
        "平面上线性映射的像是其矩阵各列的张成：两列都为零时只有原点；两列平行且不全为零时是过原点的直线；两列线性无关时是整个平面 $\\mathbb{R}^2$。例如 $\\begin{pmatrix} 2 & -4 \\\\ 1 & -2 \\end{pmatrix}$ 的第二列是第一列的 $-2$ 倍，所以像是由 $(2, 1)$ 张成的直线。\n\n> **注意。** 线性映射的像总是包含原点，所以不可能是一条不过原点的直线。",
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
        const solution = walked(
          [
            [
              ["Compare the columns", "比较两列"],
              t(
                `The columns are $${vec2Latex([a, b])}$ and $${vec2Latex([k * a, k * b])} = ${k}${vec2Latex([a, b])}$, so they are parallel and not zero.`,
                `两列为 $${vec2Latex([a, b])}$ 和 $${vec2Latex([k * a, k * b])} = ${k}${vec2Latex([a, b])}$，两者平行且非零。`,
              ),
            ],
            [
              ["Describe the span", "描述张成"],
              t(
                `Every output is $x_1${vec2Latex([a, b])} + (${k})x_2${vec2Latex([a, b])} = (x_1 ${k > 0 ? "+" : "-"} ${Math.abs(k)}x_2)${vec2Latex([a, b])}$, a multiple of $${vec2Latex([a, b])}$: the image is the line through the origin in that direction.`,
                `每个输出都是 $x_1${vec2Latex([a, b])} + (${k})x_2${vec2Latex([a, b])} = (x_1 ${k > 0 ? "+" : "-"} ${Math.abs(k)}x_2)${vec2Latex([a, b])}$，是 $${vec2Latex([a, b])}$ 的倍数：像是沿这个方向的过原点直线。`,
              ),
            ],
          ],
          t(
            `$\\det A = ${a} \\cdot ${paren(k * b)} - ${paren(k * a)} \\cdot ${b} = 0$, so the rank is $1$, not $2$: a line, not the plane.`,
            `$\\det A = ${a} \\cdot ${paren(k * b)} - ${paren(k * a)} \\cdot ${b} = 0$，所以秩为 $1$ 而不是 $2$：是直线，不是整个平面。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The columns are parallel, so they span only a line; the whole plane needs two independent columns.",
            "两列平行，只能张成一条直线；整个平面需要两列线性无关。",
          ],
          [wrong[1]!.en, "The columns are not zero, so the image contains more than the origin.", "两列不为零，所以像不只含原点。"],
          [
            wrong[2]!.en,
            `This line does not pass through the origin, but $A\\mathbf{0} = \\mathbf{0}$ is always in the image.`,
            "这条直线不过原点，而 $A\\mathbf{0} = \\mathbf{0}$ 总在像中。",
          ],
          [
            wrong[3]!.en,
            "The image passes through the origin and runs along the columns, not perpendicular to them.",
            "像经过原点并沿着列的方向，而不是与列垂直。",
          ],
        ]);
      },
    },
    {
      id: "testing-membership-in-a-line-image",
      figure: linearAlgebraDrawings1["image-of-a-linear-transformation-in-the-cartesian-plane#testing-membership-in-a-line-image"],
      title: t("Testing membership in the image of a rank-one map", "判断向量是否在秩一映射的像中"),
      explanation: t(
        "When the standard matrix of $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ has rank $1$, both columns are multiples of one non-zero vector $\\mathbf{u}$, and the image is the line through the origin spanned by $\\mathbf{u}$. A vector $(p, q)$ lies on that line exactly when it is parallel to $\\mathbf{u} = (u_1, u_2)$, that is when $p\\,u_2 - q\\,u_1 = 0$. For example, with $\\mathbf{u} = (2, 3)$, the vector $(4, 6)$ is in the image since $4 \\cdot 3 - 6 \\cdot 2 = 0$, but $(4, 7)$ is not, since $4 \\cdot 3 - 7 \\cdot 2 = -2$.\n\n> **Watch out.** Being close to the line is not enough; the test $p\\,u_2 - q\\,u_1$ must be exactly $0$.",
        "当 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 的标准矩阵秩为 $1$ 时，两列都是某个非零向量 $\\mathbf{u}$ 的倍数，像是由 $\\mathbf{u}$ 张成的过原点的直线。向量 $(p, q)$ 在这条直线上当且仅当它与 $\\mathbf{u} = (u_1, u_2)$ 平行，即 $p\\,u_2 - q\\,u_1 = 0$。例如 $\\mathbf{u} = (2, 3)$ 时，$(4, 6)$ 在像中，因为 $4 \\cdot 3 - 6 \\cdot 2 = 0$；而 $(4, 7)$ 不在，因为 $4 \\cdot 3 - 7 \\cdot 2 = -2$。\n\n> **注意。** 接近这条直线还不够；检验值 $p\\,u_2 - q\\,u_1$ 必须恰好为 $0$。",
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
        const problem = choiceProblem({
          prompt: t(
            `Let $T$ have standard matrix $A = ${mat2Latex(A)}$. Is $${vec2Latex([p, q])}$ in the image of $T$?`,
            `设 $T$ 的标准矩阵为 $A = ${mat2Latex(A)}$。$${vec2Latex([p, q])}$ 是否在 $T$ 的像中？`,
          ),
          options: yesNo,
          correct: inside ? 0 : 1,
          solution: walked(
            [
              [
                ["Find the image line", "找出像直线"],
                t(
                  `Both columns are multiples of $\\mathbf{u} = ${vec2Latex([u1, u2])}$: they are $${s}\\mathbf{u}$ and $${tt}\\mathbf{u}$. So the image is the line spanned by $\\mathbf{u}$.`,
                  `两列都是 $\\mathbf{u} = ${vec2Latex([u1, u2])}$ 的倍数：分别为 $${s}\\mathbf{u}$ 和 $${tt}\\mathbf{u}$。所以像是由 $\\mathbf{u}$ 张成的直线。`,
                ),
              ],
              [["Test parallelism", "检验是否平行"], t("", ""), [`${p} \\cdot ${paren(u2)} - ${paren(q)} \\cdot ${paren(u1)} = ${cross}`]],
            ],
            inside
              ? t(
                  `The test gives $0$, and indeed $${vec2Latex([p, q])} = ${m}\\mathbf{u}$, so the vector is in the image.`,
                  `检验值为 $0$，而且确实 $${vec2Latex([p, q])} = ${m}\\mathbf{u}$，所以该向量在像中。`,
                )
              : t(
                  `The test gives $${cross} \\ne 0$: $${m}\\mathbf{u} = ${vec2Latex([m * u1, m * u2])}$ has the same first entry but a different second one, so the vector is not in the image.`,
                  `检验值为 $${cross} \\ne 0$：$${m}\\mathbf{u} = ${vec2Latex([m * u1, m * u2])}$ 的第一个分量相同，但第二个分量不同，所以该向量不在像中。`,
                ),
          ),
        });
        return reasoned(problem, [
          [
            yesNo[0]!.en,
            `$${p} \\cdot ${paren(u2)} - ${paren(q)} \\cdot ${paren(u1)} = ${cross} \\ne 0$, so the vector is not parallel to $\\mathbf{u}$.`,
            `$${p} \\cdot ${paren(u2)} - ${paren(q)} \\cdot ${paren(u1)} = ${cross} \\ne 0$，所以该向量与 $\\mathbf{u}$ 不平行。`,
          ],
          [
            yesNo[1]!.en,
            `The vector is $${m}$ times $\\mathbf{u}$, which lies on the image line.`,
            `该向量是 $\\mathbf{u}$ 的 $${m}$ 倍，在像直线上。`,
          ],
        ]);
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
  intro: t(
    "The map $T(\\mathbf{x}) = A\\mathbf{x}$ with $A = \\begin{pmatrix} 2 & 1 \\\\ 4 & 2 \\end{pmatrix}$ has $\\det A = 4 - 4 = 0$. So $T$ is not invertible: it sends $(1, -2)$ to $(0, 0)$, so it is not one-to-one, and every output is a multiple of $(1, 2)$, so it is not onto.\n\nCheck: $A\\begin{pmatrix} 1 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} 2 - 2 \\\\ 4 - 4 \\end{pmatrix} = \\mathbf{0}$, a nonzero vector in the kernel.\n\nIn this lesson we use the determinant to decide at once whether a map of $\\mathbb{R}^2$ is invertible, one-to-one and onto, and find the parameter values that make it fail.",
    "映射 $T(\\mathbf{x}) = A\\mathbf{x}$，$A = \\begin{pmatrix} 2 & 1 \\\\ 4 & 2 \\end{pmatrix}$，有 $\\det A = 4 - 4 = 0$。所以 $T$ 不可逆：它把 $(1, -2)$ 映为 $(0, 0)$，所以不是单射；每个输出都是 $(1, 2)$ 的倍数，所以不是满射。\n\n检验：$A\\begin{pmatrix} 1 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} 2 - 2 \\\\ 4 - 4 \\end{pmatrix} = \\mathbf{0}$，是核中的非零向量。\n\n本课我们用行列式一次判定 $\\mathbb{R}^2$ 上的映射是否可逆、是否单射、是否满射，并找出使其不可逆的参数值。",
  ),
  prerequisites: ["image-of-a-linear-transformation-in-the-cartesian-plane"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "invertibility-equivalences-for-transformations",
      title: t("Invertibility Equivalences for Transformations", "线性变换可逆性的等价条件"),
      explanation: t(
        "For an operator $T$ on $\\mathbb{R}^n$ with standard matrix $A$, the invertible matrix theorem says these all hold or all fail together: $T$ is invertible, $T$ is one-to-one, $T$ is onto, $\\ker(T) = \\{\\mathbf{0}\\}$, and $\\det A \\ne 0$. For example, $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ has $\\det A = -2 \\ne 0$, so $T$ is invertible, one-to-one and onto.\n\n> **Watch out.** For a map from $\\mathbb{R}^n$ to itself, one-to-one and onto cannot come apart: if one fails, so does the other.",
        "对 $\\mathbb{R}^n$ 上以 $A$ 为标准矩阵的线性变换 $T$，逆矩阵定理说下列条件同时成立或同时不成立：$T$ 可逆、$T$ 是单射、$T$ 是满射、$\\ker(T) = \\{\\mathbf{0}\\}$、$\\det A \\ne 0$。例如 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ 有 $\\det A = -2 \\ne 0$，所以 $T$ 可逆、是单射也是满射。\n\n> **注意。** 对从 $\\mathbb{R}^n$ 到自身的映射，单射与满射不会分开：一个不成立，另一个也不成立。",
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
        const solution = walked(
          [
            [
              ["Compute the determinant", "计算行列式"],
              t("", ""),
              [`\\det A = ${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}`],
            ],
            [
              ["Apply the theorem", "应用定理"],
              isInvertible
                ? t(
                    "$\\det A \\ne 0$, so by the invertible matrix theorem $T$ is invertible, $\\ker(T) = \\{\\mathbf{0}\\}$ (one-to-one) and $\\operatorname{im}(T) = \\mathbb{R}^2$ (onto).",
                    "$\\det A \\ne 0$，由逆矩阵定理，$T$ 可逆，$\\ker(T) = \\{\\mathbf{0}\\}$（单射），$\\operatorname{im}(T) = \\mathbb{R}^2$（满射）。",
                  )
                : t(
                    "$\\det A = 0$, so $A$ is singular and, by the invertible matrix theorem, $T$ is neither one-to-one nor onto.",
                    "$\\det A = 0$，$A$ 是奇异矩阵，由逆矩阵定理，$T$ 既不是单射也不是满射。",
                  ),
            ],
          ],
          isInvertible
            ? t(
                `$A^{-1} = \\frac{1}{${det}}${mat2Latex([
                  [d, -b],
                  [-c, a],
                ])}$ exists, so $T$ can be undone.`,
                `$A^{-1} = \\frac{1}{${det}}${mat2Latex([
                  [d, -b],
                  [-c, a],
                ])}$ 存在，所以 $T$ 可以被还原。`,
              )
            : t(
                `$A${vec2Latex([-b, a])} = ${vec2Latex([0, c * -b + d * a])}$ with $${vec2Latex([-b, a])} \\ne \\mathbf{0}$, a nonzero vector in the kernel.`,
                `$A${vec2Latex([-b, a])} = ${vec2Latex([0, c * -b + d * a])}$，且 $${vec2Latex([-b, a])} \\ne \\mathbf{0}$，是核中的非零向量。`,
              ),
        );
        return reasoned(
          oneOf(rng, prompt, right, wrong, solution),
          isInvertible
            ? [
                [wrong[0]!.en, `The determinant is $${det}$, not $0$.`, `行列式是 $${det}$，不是 $0$。`],
                [
                  wrong[1]!.en,
                  "For a map of $\\mathbb{R}^2$ to itself, one-to-one and onto hold together.",
                  "对 $\\mathbb{R}^2$ 到自身的映射，单射与满射同时成立。",
                ],
                [
                  wrong[2]!.en,
                  "For a map of $\\mathbb{R}^2$ to itself, onto and one-to-one hold together.",
                  "对 $\\mathbb{R}^2$ 到自身的映射，满射与单射同时成立。",
                ],
                [
                  wrong[3]!.en,
                  "Only the zero map has kernel $\\mathbb{R}^2$; here $\\det A \\ne 0$ makes the kernel $\\{\\mathbf{0}\\}$.",
                  "只有零映射的核是 $\\mathbb{R}^2$；这里 $\\det A \\ne 0$ 使核为 $\\{\\mathbf{0}\\}$。",
                ],
              ]
            : [
                [wrong[0]!.en, "The determinant is $0$, so $A$ has no inverse.", "行列式为 $0$，所以 $A$ 没有逆矩阵。"],
                [
                  wrong[1]!.en,
                  "With $\\det A = 0$ the kernel contains a nonzero vector, so $T$ is not one-to-one.",
                  "$\\det A = 0$ 时核含非零向量，所以 $T$ 不是单射。",
                ],
                [
                  wrong[2]!.en,
                  `$A${vec2Latex([-b, a])} = \\mathbf{0}$ with a nonzero input, so the kernel is bigger than $\\{\\mathbf{0}\\}$.`,
                  `$A${vec2Latex([-b, a])} = \\mathbf{0}$ 且输入非零，所以核比 $\\{\\mathbf{0}\\}$ 大。`,
                ],
                [
                  wrong[3]!.en,
                  "With $\\det A = 0$ the columns are parallel, so the image is at most a line.",
                  "$\\det A = 0$ 时两列平行，所以像至多是一条直线。",
                ],
              ],
        );
      },
    },
    {
      id: "the-parameter-that-makes-a-transformation-singular",
      title: t("The parameter that makes a transformation singular", "使变换不可逆的参数值"),
      explanation: t(
        "By the invertible matrix theorem, $T(\\mathbf{x}) = A\\mathbf{x}$ is invertible (one-to-one and onto) exactly when $\\det A \\ne 0$. So $T$ fails to be invertible for the parameter values that make the determinant zero. For $A = \\begin{pmatrix} a & k \\\\ c & d \\end{pmatrix}$, $\\det A = ad - kc = 0$ gives $k = \\frac{ad}{c}$. For example, $\\begin{pmatrix} 6 & k \\\\ 2 & 5 \\end{pmatrix}$ has $\\det = 30 - 2k$, which is $0$ for $k = 15$.\n\n> **Watch out.** The determinant is $ad - kc$, the main diagonal minus the other diagonal; solving $ad = kc$ divides by $c$, not by $a$.",
        "由可逆矩阵定理，$T(\\mathbf{x}) = A\\mathbf{x}$ 可逆（既单又满）当且仅当 $\\det A \\ne 0$。所以使行列式为零的参数值使 $T$ 不可逆。对 $A = \\begin{pmatrix} a & k \\\\ c & d \\end{pmatrix}$，由 $\\det A = ad - kc = 0$ 得 $k = \\frac{ad}{c}$。例如 $\\begin{pmatrix} 6 & k \\\\ 2 & 5 \\end{pmatrix}$ 的行列式为 $30 - 2k$，当 $k = 15$ 时为 $0$。\n\n> **注意。** 行列式是 $ad - kc$，即主对角线减去副对角线；解 $ad = kc$ 时要除以 $c$，而不是 $a$。",
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
          mistakes: [
            why(
              -k,
              "The sign is flipped; the determinant is $ad - kc$, so $k = \\frac{ad}{c}$.",
              "符号反了；行列式是 $ad - kc$，所以 $k = \\frac{ad}{c}$。",
            ),
            ...(Math.abs(a) !== Math.abs(c)
              ? [
                  why(
                    Q.of(c * d, a),
                    `That divides by $${a}$; solving $${a} \\cdot ${paren(d)} = ${paren(c)}k$ divides by $${c}$.`,
                    `这是除以 $${a}$；解 $${a} \\cdot ${paren(d)} = ${paren(c)}k$ 要除以 $${c}$。`,
                  ),
                ]
              : []),
            ...(c !== 1
              ? [why(a * d, `That is $ad$ itself; it must still be divided by $${c}$.`, `这是 $ad$ 本身；还要除以 $${c}$。`)]
              : []),
          ],
          solution: walked(
            [
              [
                ["Write the determinant", "写出行列式"],
                t("", ""),
                [
                  `\\det A = ${a} \\cdot ${paren(d)} ${c < 0 ? "+" : "-"} ${poly([Math.abs(c), "k"])} = ${a * d} ${c < 0 ? "+" : "-"} ${poly([Math.abs(c), "k"])}`,
                ],
              ],
              [["Set it to zero", "令其为零"], t("", ""), [`k = \\frac{${a * d}}{${c}} = ${k}`]],
            ],
            t(
              `With $k = ${k}$: $${a} \\cdot ${paren(d)} - ${paren(k)} \\cdot ${paren(c)} = ${a * d} - ${paren(k * c)} = 0$, so $T$ is neither one-to-one nor onto.`,
              `取 $k = ${k}$：$${a} \\cdot ${paren(d)} - ${paren(k)} \\cdot ${paren(c)} = ${a * d} - ${paren(k * c)} = 0$，所以 $T$ 既不是单射也不是满射。`,
            ),
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
  intro: t(
    "Differentiation $T(p) = p'$ on $P_3$, the polynomials of degree at most $3$, kills exactly the constants, so $\\dim\\ker(T) = 1$. The domain has dimension $4$, so the rank-nullity theorem gives $\\operatorname{rank}(T) = 4 - 1 = 3$.\n\nCheck: the image is all of $P_2$, spanned by $(t)' = 1$, $(t^2)' = 2t$ and $(t^3)' = 3t^2$, which has dimension $3$.\n\nIn this lesson we use $\\operatorname{rank}(T) + \\dim\\ker(T) = \\dim V$ to find one of the numbers from the other two, for matrices and for differentiation.",
    "在 $P_3$（次数不超过 $3$ 的多项式）上求导 $T(p) = p'$，恰好把常数变为零，所以 $\\dim\\ker(T) = 1$。定义域的维数为 $4$，所以秩-零度定理给出 $\\operatorname{rank}(T) = 4 - 1 = 3$。\n\n检验：像是整个 $P_2$，由 $(t)' = 1$、$(t^2)' = 2t$、$(t^3)' = 3t^2$ 张成，维数为 $3$。\n\n本课我们用 $\\operatorname{rank}(T) + \\dim\\ker(T) = \\dim V$ 由其中两个数求第三个，对矩阵和求导映射都适用。",
  ),
  prerequisites: ["invertible-matrix-theorem-in-terms-of-linear-transformations"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "calculating-via-rank-nullity-theorem",
      title: t("Calculating via Rank-Nullity Theorem", "利用秩-零度定理计算"),
      explanation: t(
        "The dimension of the domain is shared between the vectors sent to zero and the dimension of the image, so knowing two of the three numbers gives the third. For a linear transformation $T: V \\to W$, compute $\\operatorname{rank}(T) = \\dim(V) - \\operatorname{nullity}(T)$. For example, $T: \\mathbb{R}^7 \\to \\mathbb{R}^4$ with a $3$-dimensional kernel has rank $7 - 3 = 4$.\n\n> **Watch out.** Subtract from the dimension of the domain $V$, not of the target $W$; the target only bounds the rank from above.",
        "定义域的维数分成被映射到零的部分和像的维数两部分，所以知道三个数中的两个就能求出第三个。对线性变换 $T: V \\to W$，利用 $\\operatorname{rank}(T) = \\dim(V) - \\operatorname{nullity}(T)$ 计算其秩。例如核为 $3$ 维的 $T: \\mathbb{R}^7 \\to \\mathbb{R}^4$ 的秩为 $7 - 3 = 4$。\n\n> **注意。** 要从定义域 $V$ 的维数中减，而不是从目标空间 $W$ 的维数中减；目标空间只给出秩的上界。",
      ),
      generate: (rng: Rng): Problem => {
        const dimV = rng.int(4, 9);
        const dimW = rng.int(3, 8);
        const nullity = rng.int(Math.max(1, dimV - dimW), dimV - 1);
        const rank = dimV - nullity;
        const prompt = t(
          `Let $T: \\mathbb{R}^{${dimV}} \\to \\mathbb{R}^{${dimW}}$ be a linear transformation. If $\\dim(\\ker(T)) = ${nullity}$, what is the rank of $T$ (that is, $\\dim(\\operatorname{im}(T))$)?`,
          `设 $T: \\mathbb{R}^{${dimV}} \\to \\mathbb{R}^{${dimW}}$ 为线性变换。若 $\\dim(\\ker(T)) = ${nullity}$，求 $T$ 的秩（即 $\\dim(\\operatorname{im}(T))$）。`,
        );
        const solution = walked(
          [
            [
              ["State the theorem", "写出定理"],
              t("For $T: V \\to W$, the domain splits as:", "对 $T: V \\to W$，定义域的维数分为："),
              [`\\dim V = \\dim\\ker(T) + \\operatorname{rank}(T)`],
            ],
            [["Substitute", "代入"], t("", ""), [`\\operatorname{rank}(T) = ${dimV} - ${nullity} = ${rank}`]],
          ],
          t(
            `$${rank} \\le ${dimW}$, as it must be, since the image lies in $\\mathbb{R}^{${dimW}}$.`,
            `$${rank} \\le ${dimW}$，正应如此，因为像位于 $\\mathbb{R}^{${dimW}}$ 中。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: rank,
          form: "integer",
          solution,
          mistakes: [
            why(
              dimW - nullity,
              `Subtract from the dimension of the domain, $${dimV}$, not of the target.`,
              `要从定义域的维数 $${dimV}$ 中减，而不是从目标空间的维数中减。`,
            ),
            why(dimV, "That is the whole domain; the kernel's dimensions are lost in the image.", "这是整个定义域；核的维数在像中丢失了。"),
            why(dimW, "The target only bounds the rank; the image need not fill it.", "目标空间只给出秩的上界；像不一定充满它。"),
            why(nullity, "That is the nullity itself; the rank is what remains of the domain.", "这是零化度本身；秩是定义域剩下的部分。"),
            why(
              dimV + nullity,
              "Rank and nullity add up to $\\dim V$, so subtract the nullity.",
              "秩与零化度之和是 $\\dim V$，所以要减去零化度。",
            ),
          ].filter((w, i, all) => w.value !== rank && all.findIndex((o) => o.value === w.value) === i),
        });
      },
    },
    {
      id: "rank-and-nullity-of-differentiation",
      title: t("Rank and nullity of differentiation", "求导映射的秩与零化度"),
      explanation: t(
        "The rank-nullity theorem says $\\operatorname{rank}(T) + \\dim\\ker(T) = \\dim V$ for $T: V \\to W$. The space $P_n$ of polynomials of degree at most $n$ has dimension $n + 1$. The map $T(p) = p^{(k)}$, the $k$-th derivative, kills exactly the polynomials of degree less than $k$, so $\\dim\\ker(T) = k$ and the rank is $n + 1 - k$. For example, $T(p) = p''$ on $P_4$ kills $1$ and $t$, so $\\dim\\ker(T) = 2$ and the rank is $5 - 2 = 3$.\n\n> **Watch out.** $P_n$ has dimension $n + 1$, not $n$, because the constant term counts.",
        "秩–零化度定理指出，对 $T: V \\to W$ 有 $\\operatorname{rank}(T) + \\dim\\ker(T) = \\dim V$。次数不超过 $n$ 的多项式空间 $P_n$ 的维数为 $n + 1$。映射 $T(p) = p^{(k)}$（$k$ 阶导数）恰好把次数小于 $k$ 的多项式变为零，所以 $\\dim\\ker(T) = k$，秩为 $n + 1 - k$。例如 $P_4$ 上的 $T(p) = p''$ 把 $1$ 和 $t$ 变为零，所以 $\\dim\\ker(T) = 2$，秩为 $5 - 2 = 3$。\n\n> **注意。** $P_n$ 的维数是 $n + 1$ 而不是 $n$，因为常数项也算在内。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(2, 9);
        const k = rng.int(1, Math.min(4, n));
        const wantRank = rng.int(0, 1) === 0;
        const ans = wantRank ? n + 1 - k : k;
        const d = k === 1 ? "p'" : k === 2 ? "p''" : k === 3 ? "p'''" : `p^{(${k})}`;
        const killed = ["1", "t", "t^2", "t^3"].slice(0, k).join(", ");
        return numberProblem({
          prompt: t(
            `Let $T: P_{${n}} \\to P_{${n}}$ be $T(p) = ${d}$. Find ${wantRank ? "the rank of $T$" : "$\\dim\\ker(T)$"}.`,
            `设 $T: P_{${n}} \\to P_{${n}}$，$T(p) = ${d}$。求${wantRank ? " $T$ 的秩" : " $\\dim\\ker(T)$"}。`,
          ),
          answer: ans,
          form: "integer",
          mistakes: (wantRank
            ? [
                why(
                  n - k,
                  `$P_{${n}}$ has dimension $${n + 1}$, counting the constant term, so start from $${n + 1}$.`,
                  `$P_{${n}}$ 算上常数项维数为 $${n + 1}$，所以从 $${n + 1}$ 开始。`,
                ),
                why(n + 1, "That is the whole domain; the kernel's dimensions are lost.", "这是整个定义域；核的维数丢失了。"),
                why(k, "That is the dimension of the kernel, not the rank.", "这是核的维数，而不是秩。"),
              ]
            : [
                why(
                  k - 1,
                  `The kernel contains all of $${killed}$, which is $${k}$ polynomials.`,
                  `核包含 $${killed}$ 全部，共 $${k}$ 个多项式。`,
                ),
                why(n + 1 - k, "That is the rank, the dimension of the image, not of the kernel.", "这是秩，即像的维数，而不是核的维数。"),
                why(
                  n,
                  `Only polynomials of degree below $${k}$ have zero ${k === 1 ? "derivative" : `$${k}$th derivative`}.`,
                  `只有次数低于 $${k}$ 的多项式的 ${k} 阶导数为零。`,
                ),
              ]
          ).filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Find the kernel", "求核"],
                t(
                  `$${d} = 0$ exactly for the polynomials of degree less than $${k}$, spanned by $${killed}$:`,
                  `$${d} = 0$ 恰好对次数小于 $${k}$ 的多项式成立，它们由 $${killed}$ 张成：`,
                ),
                [`\\dim\\ker(T) = ${k}`],
              ],
              [
                ["Apply rank-nullity", "用秩-零化度定理"],
                t(`$\\dim P_{${n}} = ${n + 1}$, so:`, `$\\dim P_{${n}} = ${n + 1}$，所以：`),
                [`\\operatorname{rank}(T) = ${n + 1} - ${k} = ${n + 1 - k}`],
              ],
            ],
            t(
              `The image is spanned by the ${k === 1 ? "derivatives" : "derivatives"} of $t^{${k}}, \\dots, t^{${n}}$, which have degrees $0$ to $${n - k}$: $${n - k + 1}$ polynomials, matching the rank.`,
              `像由 $t^{${k}}, \\dots, t^{${n}}$ 的导数张成，它们的次数为 $0$ 到 $${n - k}$：共 $${n - k + 1}$ 个多项式，与秩一致。`,
            ),
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
  intro: t(
    "Suppose $T(b_1) = b_1 + 2b_2$ and $T(b_2) = 3b_1 - b_2$ for a basis $B = \\{b_1, b_2\\}$. The $B$-coordinates of the images are $(1, 2)$ and $(3, -1)$, and these are the columns: $[T]_B = \\begin{pmatrix} 1 & 3 \\\\ 2 & -1 \\end{pmatrix}$.\n\nCheck: $[T]_B \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$, and $(1, 0)$ is $[b_1]_B$ while $(1, 2)$ is $[T(b_1)]_B$, as it should be.\n\nIn this lesson we build the matrix of a transformation relative to a basis, from the coordinates of the images and from the standard matrix by $P^{-1}AP$.",
    "设基 $B = \\{b_1, b_2\\}$ 满足 $T(b_1) = b_1 + 2b_2$，$T(b_2) = 3b_1 - b_2$。两个像的 $B$ 坐标为 $(1, 2)$ 和 $(3, -1)$，它们就是各列：$[T]_B = \\begin{pmatrix} 1 & 3 \\\\ 2 & -1 \\end{pmatrix}$。\n\n检验：$[T]_B \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$，而 $(1, 0)$ 是 $[b_1]_B$，$(1, 2)$ 是 $[T(b_1)]_B$，正应如此。\n\n本课我们求变换关于一组基的矩阵：既由像的坐标直接构造，也由标准矩阵通过 $P^{-1}AP$ 求得。",
  ),
  prerequisites: ["rank-nullity-theorem-in-terms-of-linear-transformations"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "matrix-relative-to-basis-computation",
      title: t("Matrix Relative to a Basis Computation", "计算关于基的矩阵"),
      explanation: t(
        "To build the matrix, apply the transformation to each basis vector, write the result in coordinates, and use those coordinates as the columns. Form the matrix $[T]_B$ whose columns are the coordinate vectors $[T(\\mathbf{b}_j)]_B$. For example, $T(b_1) = 2b_1 - b_2$ and $T(b_2) = b_1 + 4b_2$ give $[T]_B = \\begin{pmatrix} 2 & 1 \\\\ -1 & 4 \\end{pmatrix}$.\n\n> **Watch out.** The coefficients of $T(b_j)$ fill column $j$, not row $j$.",
        "构造矩阵时，把变换作用在每个基向量上，把结果写成坐标，再用这些坐标作为矩阵的列。构造各列为坐标向量 $[T(\\mathbf{b}_j)]_B$ 的矩阵 $[T]_B$。例如 $T(b_1) = 2b_1 - b_2$，$T(b_2) = b_1 + 4b_2$ 给出 $[T]_B = \\begin{pmatrix} 2 & 1 \\\\ -1 & 4 \\end{pmatrix}$。\n\n> **注意。** $T(b_j)$ 的系数填入第 $j$ 列，而不是第 $j$ 行。",
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
        const m = (x: Mat2) => t(`$${mat2Latex(x)}$`, `$${mat2Latex(x)}$`);
        const answer: Mat2 = [
          [c1, d1],
          [c2, d2],
        ];
        const right = m(answer);
        const wrong = [
          m([
            [c1, c2],
            [d1, d2],
          ]),
          m([
            [d1, c1],
            [d2, c2],
          ]),
          m([
            [c2, d2],
            [c1, d1],
          ]),
          m([
            [d2, d1],
            [c2, c1],
          ]),
        ];
        const solution = walked(
          [
            [
              ["Read the coordinates", "读出坐标"],
              t("The coefficients of each image are its $B$-coordinates:", "每个像的系数就是它的 $B$ 坐标："),
              [`[T(b_1)]_B = ${vec2Latex([c1, c2])}, \\quad [T(b_2)]_B = ${vec2Latex([d1, d2])}`],
            ],
            [["Place them as columns", "作为列放入"], t("", ""), [`[T]_B = ${mat2Latex(answer)}`]],
          ],
          t(
            `$[T]_B ${vec2Latex([0, 1])} = ${vec2Latex([d1, d2])}$: the coordinates of $b_2$ go to the coordinates of $T(b_2)$.`,
            `$[T]_B ${vec2Latex([0, 1])} = ${vec2Latex([d1, d2])}$：$b_2$ 的坐标被映为 $T(b_2)$ 的坐标。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "This puts the coordinates in as rows; each $[T(b_j)]_B$ is a column.",
            "这是把坐标作为行放入了；每个 $[T(b_j)]_B$ 是一列。",
          ],
          [wrong[1]!.en, "The columns are swapped: column $1$ must be $[T(b_1)]_B$.", "两列交换了：第 $1$ 列必须是 $[T(b_1)]_B$。"],
          [
            wrong[2]!.en,
            "The rows are swapped: the coefficient of $b_1$ is the top entry of each column.",
            "两行交换了：$b_1$ 的系数是每一列的上方元素。",
          ],
          [
            wrong[3]!.en,
            "Both rows and columns are reversed; read column $j$ straight from $T(b_j)$.",
            "行和列都颠倒了；第 $j$ 列应直接照抄 $T(b_j)$ 的系数。",
          ],
        ]);
      },
    },
    {
      id: "changing-a-standard-matrix-to-a-basis",
      title: t("Changing a standard matrix to a basis", "把标准矩阵换到另一组基下"),
      explanation: t(
        "If $T(\\mathbf{x}) = A\\mathbf{x}$ and $P$ has the basis vectors $b_1, b_2$ as columns, the matrix of $T$ relative to $B$ is\n\n$$[T]_B = P^{-1}AP.$$\n\nThe product $AP$ applies $T$ to each basis vector, and $P^{-1}$ rewrites the results in $B$-coordinates. For $P = \\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$, $P^{-1} = \\begin{pmatrix} 1 & -k \\\\ 0 & 1 \\end{pmatrix}$. For example, $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$ and $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ give $AP = \\begin{pmatrix} 2 & 3 \\\\ 0 & 3 \\end{pmatrix}$ and $P^{-1}AP = \\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$.\n\n> **Watch out.** The order is $P^{-1}AP$: apply $P$ first, then $A$, then $P^{-1}$. The product $PAP^{-1}$ is a different matrix.",
        "若 $T(\\mathbf{x}) = A\\mathbf{x}$，且 $P$ 以基向量 $b_1, b_2$ 为列，则 $T$ 关于 $B$ 的矩阵为\n\n$$[T]_B = P^{-1}AP.$$\n\n乘积 $AP$ 把 $T$ 作用于每个基向量，$P^{-1}$ 再把结果写成 $B$ 坐标。对 $P = \\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$，$P^{-1} = \\begin{pmatrix} 1 & -k \\\\ 0 & 1 \\end{pmatrix}$。例如 $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$，$P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ 给出 $AP = \\begin{pmatrix} 2 & 3 \\\\ 0 & 3 \\end{pmatrix}$，$P^{-1}AP = \\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$。\n\n> **注意。** 顺序是 $P^{-1}AP$：先作用 $P$，再作用 $A$，最后作用 $P^{-1}$。乘积 $PAP^{-1}$ 是另一个矩阵。",
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
        const ans = M[i]![j]!;
        return numberProblem({
          prompt: t(
            `Let $T(\\mathbf{x}) = A\\mathbf{x}$ with $A = ${mat2Latex(A)}$, and let $B = \\left\\{${vec2Latex([1, 0])}, ${vec2Latex([k, 1])}\\right\\}$. Find the $(${pos[i]}, ${pos[j]})$ entry of $[T]_B$.`,
            `设 $T(\\mathbf{x}) = A\\mathbf{x}$，$A = ${mat2Latex(A)}$，$B = \\left\\{${vec2Latex([1, 0])}, ${vec2Latex([k, 1])}\\right\\}$。求 $[T]_B$ 的 $(${pos[i]}, ${pos[j]})$ 元。`,
          ),
          answer: ans,
          form: "integer",
          mistakes: [
            why(
              AP[i]![j]!,
              "That is an entry of $AP$; the images must still be rewritten in $B$-coordinates by $P^{-1}$.",
              "这是 $AP$ 的元；还要用 $P^{-1}$ 把像写成 $B$ 坐标。",
            ),
            why(
              mul2(P, mul2(A, Pinv))[i]![j]!,
              "That is an entry of $PAP^{-1}$; the order is $P^{-1}AP$.",
              "这是 $PAP^{-1}$ 的元；顺序应为 $P^{-1}AP$。",
            ),
            why(A[i]![j]!, "That is the standard matrix; changing the basis changes the entries.", "这是标准矩阵；换基会改变矩阵的元。"),
          ].filter((w, n, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === n),
          solution: walked(
            [
              [
                ["Write $P$ and $P^{-1}$", "写出 $P$ 和 $P^{-1}$"],
                t("The basis vectors are the columns of $P$:", "基向量是 $P$ 的列："),
                [`P = ${mat2Latex(P)}, \\quad P^{-1} = ${mat2Latex(Pinv)}`],
              ],
              [["Apply $T$ to the basis", "把 $T$ 作用于基"], t("", ""), [`AP = ${mat2Latex(AP)}`]],
              [
                ["Rewrite in $B$-coordinates", "写成 $B$ 坐标"],
                t("", ""),
                [`[T]_B = P^{-1}AP = ${mat2Latex(M)}`, `\\text{entry } (${pos[i]}, ${pos[j]}) = ${ans}`],
              ],
            ],
            t(
              `Similar matrices share the trace: $${M[0][0]} + ${paren(M[1][1])} = ${M[0][0] + M[1][1]}$ and $${A[0][0]} + ${paren(A[1][1])} = ${A[0][0] + A[1][1]}$.`,
              `相似矩阵的迹相同：$${M[0][0]} + ${paren(M[1][1])} = ${M[0][0] + M[1][1]}$，$${A[0][0]} + ${paren(A[1][1])} = ${A[0][0] + A[1][1]}$。`,
            ),
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
  intro: t(
    "Let $[T]_B = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$ and let $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ change coordinates from $C$ to $B$. Then $[T]_C = P^{-1}[T]_B P = \\begin{pmatrix} 1 & -1 \\\\ 0 & 1 \\end{pmatrix}\\begin{pmatrix} 2 & 3 \\\\ 0 & 3 \\end{pmatrix} = \\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$. The entries changed, but the trace is $5$ and the determinant is $6$ in both.\n\nCheck: $\\operatorname{tr} [T]_B = 2 + 3 = 5$ and $\\det [T]_B = 2 \\cdot 3 - 1 \\cdot 0 = 6$, the same as for $\\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$.\n\nIn this lesson we relate two matrices of one operator by a similarity and use the quantities they share, such as the trace and the determinant.",
    "设 $[T]_B = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$，$P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ 把坐标从 $C$ 换到 $B$。则 $[T]_C = P^{-1}[T]_B P = \\begin{pmatrix} 1 & -1 \\\\ 0 & 1 \\end{pmatrix}\\begin{pmatrix} 2 & 3 \\\\ 0 & 3 \\end{pmatrix} = \\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$。矩阵元变了，但两者的迹都是 $5$，行列式都是 $6$。\n\n检验：$\\operatorname{tr} [T]_B = 2 + 3 = 5$，$\\det [T]_B = 2 \\cdot 3 - 1 \\cdot 0 = 6$，与 $\\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$ 相同。\n\n本课我们用相似关系联系同一算子的两个矩阵，并利用它们共有的量，例如迹和行列式。",
  ),
  prerequisites: ["matrix-of-a-linear-transformation-relative-to-a-basis"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "similarity-under-change-of-basis",
      title: t("Similarity Under Change of Basis", "基变换下的相似关系"),
      explanation: t(
        "The two matrices describe the same transformation in different coordinates, so converting coordinates before and after relates them by a similarity. Apply the formula $[T]_C = P^{-1} [T]_B P$, where $P$ is the change-of-basis matrix from $C$ to $B$. Similar matrices have the same characteristic polynomial, so they share the trace and the determinant. For example, if $[T]_B$ has trace $5$ and determinant $6$, then so does $[T]_C$ for every other basis $C$.\n\n> **Watch out.** The individual entries do change with the basis; only quantities such as the trace, the determinant and the eigenvalues stay fixed.",
        "两个矩阵在不同坐标下描述同一个变换，所以在变换前后转换坐标，就把它们用相似关系联系起来。应用公式 $[T]_C = P^{-1} [T]_B P$，其中 $P$ 为从基 $C$ 到基 $B$ 的过渡矩阵。相似矩阵有相同的特征多项式，所以迹和行列式都相同。例如若 $[T]_B$ 的迹为 $5$、行列式为 $6$，则对任意其他基 $C$，$[T]_C$ 也是如此。\n\n> **注意。** 单个矩阵元会随基改变；只有迹、行列式和特征值这类量保持不变。",
      ),
      generate: (rng: Rng): Problem => {
        const trace = rng.int(-8, 8);
        const det = rng.int(-9, 9);
        const askTrace = rng.bool();
        const name = askTrace ? "\\operatorname{tr}" : "\\det";
        const ans = askTrace ? trace : det;
        const prompt = t(
          `Let $B$ and $C$ be two bases of a vector space $V$, and let $P$ be the change-of-basis matrix from $C$ to $B$. If the matrix of a linear operator $T$ relative to $B$ has trace $\\operatorname{tr}([T]_B) = ${trace}$ and determinant $\\det([T]_B) = ${det}$, what is ${askTrace ? "the trace $\\operatorname{tr}([T]_C)$" : "the determinant $\\det([T]_C)$"}?`,
          `设 $B$ 与 $C$ 为向量空间 $V$ 的两组基，且 $P$ 为从基 $C$ 到基 $B$ 的过渡矩阵。若线性算子 $T$ 关于基 $B$ 的矩阵的迹为 $\\operatorname{tr}([T]_B) = ${trace}$ 且行列式为 $\\det([T]_B) = ${det}$，求 $${name}([T]_C)$。`,
        );
        const solution = walked(
          [
            [["Write the similarity", "写出相似关系"], t("", ""), [`[T]_C = P^{-1}[T]_B P`]],
            [
              ["Use the invariant", "利用不变量"],
              askTrace
                ? t("The trace of a product does not change when its factors are cycled:", "乘积的迹在因子轮换时不变：")
                : t("The determinant is multiplicative and $\\det(P^{-1})\\det(P) = 1$:", "行列式可乘，且 $\\det(P^{-1})\\det(P) = 1$："),
              askTrace
                ? [
                    `\\operatorname{tr}\\left(P^{-1}([T]_B P)\\right) = \\operatorname{tr}\\left([T]_B P P^{-1}\\right) = \\operatorname{tr}([T]_B) = ${trace}`,
                  ]
                : [`\\det\\left(P^{-1}[T]_B P\\right) = \\det(P^{-1})\\det([T]_B)\\det(P) = \\det([T]_B) = ${det}`],
            ],
          ],
          t(
            `Both matrices have the characteristic polynomial $\\lambda^2 - ${paren(trace)}\\lambda + ${paren(det)}$, whose coefficients are the trace and the determinant.`,
            `两个矩阵的特征多项式都是 $\\lambda^2 - ${paren(trace)}\\lambda + ${paren(det)}$，其系数正是迹和行列式。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: ans,
          form: "integer",
          solution,
          mistakes: (askTrace
            ? [
                why(-trace, "The trace keeps its sign under a change of basis.", "换基时迹的符号不变。"),
                why(det, "That is the determinant; the question asks for the trace.", "这是行列式；题目问的是迹。"),
                why(
                  0,
                  "The trace is not lost when the basis changes; it is the same for both matrices.",
                  "换基后迹不会消失；两个矩阵的迹相同。",
                ),
              ]
            : [
                why(
                  -det,
                  "The determinant keeps its sign: $\\det(P^{-1})$ and $\\det(P)$ multiply to $1$.",
                  "行列式的符号不变：$\\det(P^{-1})$ 与 $\\det(P)$ 之积为 $1$。",
                ),
                why(trace, "That is the trace; the question asks for the determinant.", "这是迹；题目问的是行列式。"),
                why(
                  1,
                  "$\\det(P^{-1})\\det(P) = 1$, but $\\det([T]_B)$ remains as a factor.",
                  "$\\det(P^{-1})\\det(P) = 1$，但 $\\det([T]_B)$ 仍是一个因子。",
                ),
              ]
          ).filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
        });
      },
    },
    {
      id: "invariants-shared-by-similar-representations",
      title: t("Invariants shared by similar representations", "相似表示共有的不变量"),
      explanation: t(
        "Two matrices of the same operator relative to different bases are similar: $[T]_C = P^{-1}[T]_B P$. Similar matrices have the same trace, determinant and eigenvalues, and so do their powers, since $[T]_C^2 = P^{-1}[T]_B^2 P$. So $\\operatorname{tr}([T]_C^2)$ can be computed from $[T]_B$ without knowing $P$. For example, $[T]_B = \\begin{pmatrix} 1 & 2 \\\\ 3 & 0 \\end{pmatrix}$ has $[T]_B^2 = \\begin{pmatrix} 7 & 2 \\\\ 3 & 6 \\end{pmatrix}$, so $\\operatorname{tr}([T]_C^2) = 13$.\n\n> **Watch out.** The trace of the square is not the square of the trace: $\\operatorname{tr}(M^2) = a^2 + d^2 + 2bc$ includes the off-diagonal entries.",
        "同一算子关于不同基的两个矩阵是相似的：$[T]_C = P^{-1}[T]_B P$。相似矩阵有相同的迹、行列式和特征值，它们的幂也是如此，因为 $[T]_C^2 = P^{-1}[T]_B^2 P$。所以无需知道 $P$ 就能由 $[T]_B$ 算出 $\\operatorname{tr}([T]_C^2)$。例如 $[T]_B = \\begin{pmatrix} 1 & 2 \\\\ 3 & 0 \\end{pmatrix}$ 有 $[T]_B^2 = \\begin{pmatrix} 7 & 2 \\\\ 3 & 6 \\end{pmatrix}$，所以 $\\operatorname{tr}([T]_C^2) = 13$。\n\n> **注意。** 平方的迹不是迹的平方：$\\operatorname{tr}(M^2) = a^2 + d^2 + 2bc$ 包含非对角元。",
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
          form: "integer",
          mistakes: [
            why(
              tr * tr,
              "That squares the trace; the trace of the square also has the term $2bc$ from the off-diagonal entries.",
              "这是迹的平方；平方的迹还包含非对角元给出的 $2bc$ 项。",
            ),
            why(
              M[0][0] ** 2 + M[1][1] ** 2,
              "That squares only the diagonal entries; the diagonal of $M^2$ also has the products $bc$.",
              "这只把对角元平方了；$M^2$ 的对角元还含乘积 $bc$。",
            ),
            why(tr, "That is the trace of $[T]_C$ itself, not of its square.", "这是 $[T]_C$ 本身的迹，而不是其平方的迹。"),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Move to the basis $B$", "换到基 $B$"],
                t(
                  "$[T]_C^2 = P^{-1}[T]_B^2 P$ is similar to $[T]_B^2$, so it has the same trace.",
                  "$[T]_C^2 = P^{-1}[T]_B^2 P$ 与 $[T]_B^2$ 相似，所以迹相同。",
                ),
              ],
              [["Square $[T]_B$", "求 $[T]_B$ 的平方"], t("", ""), [`[T]_B^2 = ${mat2Latex(M2)}`]],
              [
                ["Add the diagonal", "对角元相加"],
                t("", ""),
                [`\\operatorname{tr}\\left([T]_C^2\\right) = ${M2[0][0]} + ${paren(M2[1][1])} = ${ans}`],
              ],
            ],
            t(
              `By the formula $a^2 + d^2 + 2bc$: $${paren(M[0][0])}^2 + ${paren(M[1][1])}^2 + 2 \\cdot ${paren(M[0][1])} \\cdot ${paren(M[1][0])} = ${ans}$.`,
              `由公式 $a^2 + d^2 + 2bc$：$${paren(M[0][0])}^2 + ${paren(M[1][1])}^2 + 2 \\cdot ${paren(M[0][1])} \\cdot ${paren(M[1][0])} = ${ans}$。`,
            ),
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
  intro: t(
    "The map $T: P_2 \\to \\mathbb{R}^2$, $T(p) = (p(1), p'(0))$, takes a polynomial and returns a vector. For $p(x) = x^2 + 3x - 2$: $p(1) = 1 + 3 - 2 = 2$ and $p'(x) = 2x + 3$, so $p'(0) = 3$ and $T(p) = (2, 3)$.\n\nCheck: by linearity, $T(x^2) = (1, 0)$, $T(x) = (1, 1)$ and $T(1) = (1, 0)$, so $T(p) = (1, 0) + 3(1, 1) - 2(1, 0) = (2, 3)$.\n\nIn this lesson we evaluate linear maps whose inputs and outputs live in different spaces, such as polynomials and vectors or numbers.",
    "映射 $T: P_2 \\to \\mathbb{R}^2$，$T(p) = (p(1), p'(0))$，输入多项式，输出向量。对 $p(x) = x^2 + 3x - 2$：$p(1) = 1 + 3 - 2 = 2$，$p'(x) = 2x + 3$，所以 $p'(0) = 3$，$T(p) = (2, 3)$。\n\n检验：由线性性，$T(x^2) = (1, 0)$，$T(x) = (1, 1)$，$T(1) = (1, 0)$，所以 $T(p) = (1, 0) + 3(1, 1) - 2(1, 0) = (2, 3)$。\n\n本课我们对输入和输出位于不同空间（如多项式与向量或数）的线性映射求值。",
  ),
  prerequisites: ["connections-between-matrix-representations-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "evaluating-maps-between-distinct-spaces",
      title: t("Evaluating Maps Between Distinct Spaces", "在不同空间之间求值线性映射"),
      explanation: t(
        "A linear transformation can take inputs from one kind of space, such as polynomials, and produce outputs in another, so apply its rule directly to the given input. Evaluate linear transformations from $\\mathbb{P}_2$ to $\\mathbb{R}^2$ or between other distinct spaces. For example, $T(p) = (p(2), p'(1))$ sends $p(x) = x^2 - x$ to $(4 - 2, 2 \\cdot 1 - 1) = (2, 1)$.\n\n> **Watch out.** Read each entry of the rule carefully: $p'(b)$ means differentiate first and then substitute $b$, not $p(b)$.",
        "线性变换可以从一种空间（例如多项式空间）取输入，在另一种空间中给出输出，所以直接把它的规则用于给定的输入。求从 $\\mathbb{P}_2$ 到 $\\mathbb{R}^2$ 等不同空间之间的线性映射的值。例如 $T(p) = (p(2), p'(1))$ 把 $p(x) = x^2 - x$ 映为 $(4 - 2, 2 \\cdot 1 - 1) = (2, 1)$。\n\n> **注意。** 仔细读规则的每个分量：$p'(b)$ 表示先求导再代入 $b$，而不是 $p(b)$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(1, 3);
        const b = rng.int(-2, 2);
        const c = rng.int(1, 4);
        const d = rng.int(-3, 3);
        const e = rng.int(-4, 4);
        // p(x) = c x^2 + d x + e and T(p) = (p(a), p'(b)).
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
        const solution = walked(
          [
            [["Evaluate $p$", "求 $p$ 的值"], t("", ""), [`p(${a}) = ${c}(${a})^2${dEval}${eEval} = ${val1}`]],
            [
              ["Differentiate, then substitute", "先求导，再代入"],
              t("", ""),
              [`p'(x) = ${formatPoly2(0, 2 * c, d)}`, `p'(${b}) = ${2 * c}(${b})${dPrime} = ${val2}`],
            ],
          ],
          t(
            `Term by term, $T(x^2) = (${a * a}, ${2 * b})$, $T(x) = (${a}, 1)$ and $T(1) = (1, 0)$, so $T(p) = ${c}(${a * a}, ${2 * b}) + ${paren(d)}(${a}, 1) + ${paren(e)}(1, 0) = (${val1}, ${val2})$.`,
            `逐项计算，$T(x^2) = (${a * a}, ${2 * b})$，$T(x) = (${a}, 1)$，$T(1) = (1, 0)$，所以 $T(p) = ${c}(${a * a}, ${2 * b}) + ${paren(d)}(${a}, 1) + ${paren(e)}(1, 0) = (${val1}, ${val2})$。`,
          ),
        );
        return withMistakes(
          pointProblem({ prompt, answer: [val1, val2], vector: true, solution }),
          dedupeSaid(
            [
              say(
                vectorLatex([val2, val1]),
                "The entries are swapped: the first entry is $p(a)$ and the second is $p'(b)$.",
                "两个分量交换了：第一个分量是 $p(a)$，第二个是 $p'(b)$。",
              ),
              say(
                vectorLatex([val1, c * b * b + d * b + e]),
                `The second entry is $p'(${b})$; this substitutes $${b}$ into $p$ instead of into $p'$.`,
                `第二个分量是 $p'(${b})$；这是把 $${b}$ 代入了 $p$，而不是 $p'$。`,
              ),
              say(
                vectorLatex([val1, c * b + d]),
                `The derivative of $${c}x^2$ is $${2 * c}x$; the factor $2$ is missing.`,
                `$${c}x^2$ 的导数是 $${2 * c}x$；漏了因子 $2$。`,
              ),
            ],
            vectorLatex([val1, val2]),
          ),
        );
      },
    },
    {
      id: "an-integral-map-from-polynomials-to-numbers",
      title: t("An integral map from polynomials to numbers", "从多项式到数的积分映射"),
      explanation: t(
        "A linear map can go between spaces of different kinds. The map $T: P_2 \\to \\mathbb{R}$, $T(p) = \\int_0^k p(x)\\,dx$, is linear because integrals respect sums and constant multiples. To evaluate it on $p(x) = ax^2 + bx + c$, integrate term by term:\n\n$$T(p) = \\frac{a k^3}{3} + \\frac{b k^2}{2} + ck.$$\n\nFor example, with $k = 2$ and $p(x) = 3x^2 + x - 1$, $T(p) = \\frac{3 \\cdot 8}{3} + \\frac{4}{2} - 2 = 8$.\n\n> **Watch out.** Integrating is not substituting: $\\int_0^k x^2\\,dx = \\frac{k^3}{3}$, not $k^2$.",
        "线性映射可以在不同种类的空间之间进行。映射 $T: P_2 \\to \\mathbb{R}$，$T(p) = \\int_0^k p(x)\\,dx$ 是线性的，因为积分保持和与常数倍。要在 $p(x) = ax^2 + bx + c$ 上求值，逐项积分：\n\n$$T(p) = \\frac{a k^3}{3} + \\frac{b k^2}{2} + ck.$$\n\n例如 $k = 2$，$p(x) = 3x^2 + x - 1$ 时，$T(p) = \\frac{3 \\cdot 8}{3} + \\frac{4}{2} - 2 = 8$。\n\n> **注意。** 积分不是代入：$\\int_0^k x^2\\,dx = \\frac{k^3}{3}$，而不是 $k^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-4, 4) || 3;
        const b = rng.int(-5, 5);
        const c = rng.int(-5, 5);
        const k = rng.int(1, 3);
        const ans = Q.of(a * k ** 3, 3)
          .add(Q.of(b * k * k, 2))
          .add(Q.of(c * k));
        const candidates: readonly (readonly [Q, string, string])[] = [
          [
            Q.of(a * k * k + b * k + c),
            `That is $p(${k})$; the map integrates $p$ from $0$ to $${k}$.`,
            `这是 $p(${k})$；该映射是把 $p$ 从 $0$ 积分到 $${k}$。`,
          ],
          [
            Q.of(a * k ** 3 + b * k * k + c * k),
            "The powers were raised but not divided: $x^2$ integrates to $\\frac{x^3}{3}$ and $x$ to $\\frac{x^2}{2}$.",
            "次数升高了却没有相除：$x^2$ 的积分是 $\\frac{x^3}{3}$，$x$ 的积分是 $\\frac{x^2}{2}$。",
          ],
          [
            Q.of(2 * a * k + b),
            `That is $p'(${k})$; the map integrates rather than differentiates.`,
            `这是 $p'(${k})$；该映射是积分而不是求导。`,
          ],
        ];
        const mistakes = candidates
          .filter(([v], i, all) => !v.eq(ans) && all.findIndex(([o]) => o.eq(v)) === i)
          .map(([v, en, zh]) => why(v, en, zh));
        return numberProblem({
          prompt: t(
            `Let $T: P_2 \\to \\mathbb{R}$ be $T(p) = \\int_0^{${k}} p(x)\\,dx$. Find $T(p)$ for $p(x) = ${formatPoly2(a, b, c)}$.`,
            `设 $T: P_2 \\to \\mathbb{R}$，$T(p) = \\int_0^{${k}} p(x)\\,dx$。对 $p(x) = ${formatPoly2(a, b, c)}$ 求 $T(p)$。`,
          ),
          answer: ans,
          mistakes,
          solution: walked(
            [
              [
                ["Integrate each basis polynomial", "对每个基多项式积分"],
                t("", ""),
                [
                  `\\int_0^{${k}} x^2\\,dx = \\frac{${k ** 3}}{3}, \\quad \\int_0^{${k}} x\\,dx = \\frac{${k * k}}{2}, \\quad \\int_0^{${k}} 1\\,dx = ${k}`,
                ],
              ],
              [
                ["Combine by linearity", "用线性性组合"],
                t("", ""),
                [`T(p) = \\frac{${a} \\cdot ${k ** 3}}{3} + \\frac{${b} \\cdot ${k * k}}{2} + ${paren(c)} \\cdot ${k} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `The antiderivative $F(x) = \\frac{${a}}{3}x^3 + \\frac{${b}}{2}x^2 + ${paren(c)}x$ has $F'(x) = p(x)$ and $F(0) = 0$, so $T(p) = F(${k}) = ${ans.toLatex()}$.`,
              `原函数 $F(x) = \\frac{${a}}{3}x^3 + \\frac{${b}}{2}x^2 + ${paren(c)}x$ 满足 $F'(x) = p(x)$ 且 $F(0) = 0$，所以 $T(p) = F(${k}) = ${ans.toLatex()}$。`,
            ),
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
  intro: t(
    "Let $T: P_1 \\to P_2$ be $T(p) = x\\,p(x)$, with $B = \\{1, x\\}$ and $C = \\{1, x, x^2\\}$. Then $T(1) = x$ has $C$-coordinates $(0, 1, 0)$ and $T(x) = x^2$ has $(0, 0, 1)$, so $[T]_{C \\leftarrow B} = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$, a $3 \\times 2$ matrix.\n\nCheck: $p = 2 + 5x$ has $B$-coordinates $(2, 5)$, and the matrix sends them to $(0, 2, 5)$, which is $2x + 5x^2 = x(2 + 5x)$.\n\nIn this lesson we build the matrix of a map between two spaces, one basis for the inputs and one for the outputs.",
    "设 $T: P_1 \\to P_2$，$T(p) = x\\,p(x)$，$B = \\{1, x\\}$，$C = \\{1, x, x^2\\}$。则 $T(1) = x$ 的 $C$ 坐标为 $(0, 1, 0)$，$T(x) = x^2$ 的为 $(0, 0, 1)$，所以 $[T]_{C \\leftarrow B} = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$，是一个 $3 \\times 2$ 矩阵。\n\n检验：$p = 2 + 5x$ 的 $B$ 坐标为 $(2, 5)$，矩阵把它映为 $(0, 2, 5)$，即 $2x + 5x^2 = x(2 + 5x)$。\n\n本课我们求两个空间之间映射的矩阵：输入用一组基，输出用另一组基。",
  ),
  prerequisites: ["linear-maps-between-two-different-vector-spaces"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "matrix-with-two-bases-computation",
      title: t("Matrix with Two Bases Computation", "双基矩阵表示的计算"),
      explanation: t(
        "When the domain and codomain have different bases, apply the transformation to each input basis vector and write each result in coordinates of the output basis. Construct $[T]_{C \\leftarrow B}$, whose columns are the $C$-coordinate vectors of the images of the $B$-basis vectors. It has one row per vector of $C$ and one column per vector of $B$. For example, $T(p) = p'(x) + 2p(0)$ from $P_2$ to $P_1$ gives $T(1) = 2$, $T(x) = 1$, $T(x^2) = 2x$, so $[T]_{C \\leftarrow B} = \\begin{pmatrix} 2 & 1 & 0 \\\\ 0 & 0 & 2 \\end{pmatrix}$.\n\n> **Watch out.** The matrix is $\\dim W \\times \\dim V$: here $2 \\times 3$, not $3 \\times 2$.",
        "当定义域和值域用不同的基时，把变换作用在每个输入基向量上，再把每个结果写成输出基下的坐标。构造矩阵 $[T]_{C \\leftarrow B}$，其各列为基 $B$ 中向量的像在基 $C$ 下的坐标向量。它对 $C$ 中每个向量有一行，对 $B$ 中每个向量有一列。例如从 $P_2$ 到 $P_1$ 的 $T(p) = p'(x) + 2p(0)$ 给出 $T(1) = 2$，$T(x) = 1$，$T(x^2) = 2x$，所以 $[T]_{C \\leftarrow B} = \\begin{pmatrix} 2 & 1 & 0 \\\\ 0 & 0 & 2 \\end{pmatrix}$。\n\n> **注意。** 矩阵的大小是 $\\dim W \\times \\dim V$：这里是 $2 \\times 3$，而不是 $3 \\times 2$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(2, 6);
        const b = rng.pick([-5, -4, -3, 3, 4, 5])!;
        // T(p) = a p' + b p(0) on B = {1, x, x^2}, C = {1, x}: T(1) = b, T(x) = a, T(x^2) = 2a x.
        const mLatex = `\\begin{pmatrix} ${b} & ${a} & 0 \\\\ 0 & 0 & ${2 * a} \\end{pmatrix}`;
        const bTerm = b >= 0 ? `+ ${b}` : `- ${-b}`;
        const prompt = t(
          `Let $T: P_2 \\to P_1$ be the linear map defined by $T(p) = ${a} p'(x) ${bTerm} p(0)$. Let $B = \\{1, x, x^2\\}$ be the standard basis of $P_2$ and $C = \\{1, x\\}$ be the standard basis of $P_1$. Find the matrix $[T]_{C \\leftarrow B}$.`,
          `设 $T: P_2 \\to P_1$ 为由 $T(p) = ${a} p'(x) ${bTerm} p(0)$ 定义的线性映射。设 $B = \\{1, x, x^2\\}$ 为 $P_2$ 的标准基，$C = \\{1, x\\}$ 为 $P_1$ 的标准基。求矩阵 $[T]_{C \\leftarrow B}$。`,
        );
        const right = t(`$${mLatex}$`, `$${mLatex}$`);
        const m = (s: string) => t(`$${s}$`, `$${s}$`);
        const wrong = [
          m(`\\begin{pmatrix} ${a} & ${b} & 0 \\\\ 0 & 0 & ${2 * a} \\end{pmatrix}`),
          m(`\\begin{pmatrix} ${b} & 0 \\\\ ${a} & 0 \\\\ 0 & ${2 * a} \\end{pmatrix}`),
          m(`\\begin{pmatrix} ${b} & ${a} & 0 \\\\ 0 & ${2 * a} & 0 \\end{pmatrix}`),
          m(`\\begin{pmatrix} 0 & ${a} & ${b} \\\\ ${2 * a} & 0 & 0 \\end{pmatrix}`),
        ];
        const solution = walked(
          [
            [
              ["Apply $T$ to each vector of $B$", "把 $T$ 作用于 $B$ 的每个向量"],
              t("", ""),
              [
                `T(1) = ${a} \\cdot 0 ${bTerm} \\cdot 1 = ${b}`,
                `T(x) = ${a} \\cdot 1 ${bTerm} \\cdot 0 = ${a}`,
                `T(x^2) = ${a} \\cdot 2x ${bTerm} \\cdot 0 = ${2 * a}x`,
              ],
            ],
            [
              ["Write the $C$-coordinates as columns", "把 $C$ 坐标作为列"],
              t(
                `In $C = \\{1, x\\}$ the coordinates are $(${b}, 0)$, $(${a}, 0)$ and $(0, ${2 * a})$:`,
                `在 $C = \\{1, x\\}$ 下坐标为 $(${b}, 0)$、$(${a}, 0)$ 和 $(0, ${2 * a})$：`,
              ),
              [`[T]_{C \\leftarrow B} = ${mLatex}`],
            ],
          ],
          t(
            `For $p = 1 + x + x^2$, with coordinates $(1, 1, 1)$, the matrix gives $(${a + b}, ${2 * a})$, and directly $T(p) = ${a}(1 + 2x) ${bTerm} = ${a + b} + ${2 * a}x$.`,
            `对 $p = 1 + x + x^2$，坐标为 $(1, 1, 1)$，矩阵给出 $(${a + b}, ${2 * a})$；直接计算 $T(p) = ${a}(1 + 2x) ${bTerm} = ${a + b} + ${2 * a}x$。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [wrong[0]!.en, `The first two columns are swapped: column $1$ is $T(1) = ${b}$.`, `前两列交换了：第 $1$ 列是 $T(1) = ${b}$。`],
          [
            wrong[1]!.en,
            "This is $3 \\times 2$; the matrix needs one row per vector of $C$ and one column per vector of $B$, so it is $2 \\times 3$.",
            "这是 $3 \\times 2$ 的；矩阵对 $C$ 中每个向量有一行，对 $B$ 中每个向量有一列，所以是 $2 \\times 3$。",
          ],
          [
            wrong[2]!.en,
            `$T(x) = ${a}$ has no $x$ term; the entry $${2 * a}$ comes from $T(x^2)$ and belongs in column $3$.`,
            `$T(x) = ${a}$ 没有 $x$ 项；元 $${2 * a}$ 来自 $T(x^2)$，应在第 $3$ 列。`,
          ],
          [
            wrong[3]!.en,
            "The columns are in reverse order and the rows are swapped; follow the order $1, x, x^2$ of $B$ and $1, x$ of $C$.",
            "列的顺序颠倒、行也交换了；要按 $B$ 的顺序 $1, x, x^2$ 和 $C$ 的顺序 $1, x$。",
          ],
        ]);
      },
    },
    {
      id: "the-matrix-of-multiplication-by-a-linear-factor",
      title: t("The matrix of multiplication by a linear factor", "乘以一次因式的映射的矩阵"),
      explanation: t(
        "To find $[T]_{C \\leftarrow B}$, apply $T$ to each vector of $B$ and write the result in $C$-coordinates; these coordinate vectors are the columns. For $T: P_1 \\to P_2$, $T(p) = (ax + k)p(x)$, with $B = \\{1, x\\}$ and $C = \\{1, x, x^2\\}$:\n\n$$T(1) = k + ax, \\qquad T(x) = kx + ax^2,$$\n\nso the columns are $(k, a, 0)$ and $(0, k, a)$, giving a $3 \\times 2$ matrix. For example, $T(p) = (2x + 3)p(x)$ has matrix $\\begin{pmatrix} 3 & 0 \\\\ 2 & 3 \\\\ 0 & 2 \\end{pmatrix}$.\n\n> **Watch out.** The rows follow the order of $C$: the constant coefficient comes first, then $x$, then $x^2$.",
        "要求 $[T]_{C \\leftarrow B}$，把 $T$ 作用于 $B$ 中每个向量，再把结果写成 $C$ 坐标；这些坐标向量就是各列。对 $T: P_1 \\to P_2$，$T(p) = (ax + k)p(x)$，$B = \\{1, x\\}$，$C = \\{1, x, x^2\\}$：\n\n$$T(1) = k + ax, \\qquad T(x) = kx + ax^2,$$\n\n所以各列为 $(k, a, 0)$ 和 $(0, k, a)$，得到一个 $3 \\times 2$ 矩阵。例如 $T(p) = (2x + 3)p(x)$ 的矩阵为 $\\begin{pmatrix} 3 & 0 \\\\ 2 & 3 \\\\ 0 & 2 \\end{pmatrix}$。\n\n> **注意。** 各行按 $C$ 的顺序：先是常数项系数，然后是 $x$，再是 $x^2$。",
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
        const matLatex = `\\begin{pmatrix} ${k} & 0 \\\\ ${a} & ${k} \\\\ 0 & ${a} \\end{pmatrix}`;
        return numberProblem({
          prompt: t(
            `Let $T: P_1 \\to P_2$ be $T(p) = (${factor})p(x)$, with bases $B = \\{1, x\\}$ and $C = \\{1, x, x^2\\}$. Find the $(${i + 1}, ${j + 1})$ entry of $[T]_{C \\leftarrow B}$.`,
            `设 $T: P_1 \\to P_2$，$T(p) = (${factor})p(x)$，基为 $B = \\{1, x\\}$ 和 $C = \\{1, x, x^2\\}$。求 $[T]_{C \\leftarrow B}$ 的 $(${i + 1}, ${j + 1})$ 元。`,
          ),
          answer: ans,
          form: "integer",
          mistakes: [
            why(
              M[2 - i]![j]!,
              "The rows are read upside down; row $1$ holds the constant coefficients.",
              "行的顺序颠倒了；第 $1$ 行是常数项系数。",
            ),
            why(
              M[i]![1 - j]!,
              `That entry is in the other column; column ${j + 1} comes from $T(${j === 0 ? "1" : "x"})$.`,
              `这个元在另一列；第 ${j + 1} 列来自 $T(${j === 0 ? "1" : "x"})$。`,
            ),
            why(
              a + k,
              "Each entry is a single coefficient of $T(1)$ or $T(x)$, not the sum of the factor's coefficients.",
              "每个元是 $T(1)$ 或 $T(x)$ 的一个系数，而不是因式系数之和。",
            ),
          ].filter((w, n, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === n),
          solution: walked(
            [
              [
                ["Apply $T$ to the basis $B$", "把 $T$ 作用于基 $B$"],
                t("", ""),
                [`T(1) = ${formatPoly2(0, a, k)}`, `T(x) = ${formatPoly2(a, k, 0)}`],
              ],
              [
                ["Write the $C$-coordinates as columns", "把 $C$ 坐标作为列"],
                t("", ""),
                [`[T]_{C \\leftarrow B} = ${matLatex}`, `\\text{entry } (${i + 1}, ${j + 1}) = ${ans}`],
              ],
            ],
            t(
              `For $p = 1 + x$: $${matLatex}${vec2Latex([1, 1])} = (${k}, ${a + k}, ${a})$, and indeed $(${factor})(1 + x) = ${formatPoly2(a, a + k, k)}$.`,
              `对 $p = 1 + x$：$${matLatex}${vec2Latex([1, 1])} = (${k}, ${a + k}, ${a})$，而确实 $(${factor})(1 + x) = ${formatPoly2(a, a + k, k)}$。`,
            ),
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
  intro: t(
    "Take $A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 2 \\end{pmatrix}$ and $\\mathbf{v} = (1, 0)$. Then $A\\mathbf{v} = (3, 0) = 3\\mathbf{v}$: the matrix only stretches $\\mathbf{v}$, so $\\mathbf{v}$ is an eigenvector with eigenvalue $\\lambda = 3$. By contrast $A(1, 1) = (4, 2)$ is not a multiple of $(1, 1)$.\n\nCheck: $(A - 3I)\\mathbf{v} = \\begin{pmatrix} 0 & 1 \\\\ 0 & -1 \\end{pmatrix}\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$.\n\nIn this lesson we test whether a vector is an eigenvector by computing $A\\mathbf{v}$, and read off its eigenvalue as the stretch factor.",
    "取 $A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 2 \\end{pmatrix}$，$\\mathbf{v} = (1, 0)$。则 $A\\mathbf{v} = (3, 0) = 3\\mathbf{v}$：矩阵只拉伸 $\\mathbf{v}$，所以 $\\mathbf{v}$ 是特征向量，特征值 $\\lambda = 3$。相比之下 $A(1, 1) = (4, 2)$ 不是 $(1, 1)$ 的倍数。\n\n检验：$(A - 3I)\\mathbf{v} = \\begin{pmatrix} 0 & 1 \\\\ 0 & -1 \\end{pmatrix}\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$。\n\n本课我们通过计算 $A\\mathbf{v}$ 检验向量是否为特征向量，并把拉伸倍数读作特征值。",
  ),
  prerequisites: ["matrix-of-a-linear-map-relative-to-two-bases"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "eigenpair-definition-2x2",
      title: t("Eigenpair Definition for 2x2 Matrices", "2x2 矩阵特征对的定义"),
      explanation: t(
        "An eigenvector is a nonzero vector that the matrix only stretches or shrinks, so multiplying it by the matrix gives a multiple of itself. Verify whether a given vector is an eigenvector and find its corresponding eigenvalue. For example, $A = \\begin{pmatrix} -2 & 4 \\\\ 0 & 1 \\end{pmatrix}$ sends $(1, 0)$ to $(-2, 0) = -2(1, 0)$, so the eigenvalue is $-2$.\n\n> **Watch out.** The eigenvalue is the factor $\\lambda$ in $A\\mathbf{v} = \\lambda\\mathbf{v}$; an entry of $A$ that does not act on $\\mathbf{v}$ is not it.",
        "特征向量是只被矩阵拉伸或缩短的非零向量，所以用矩阵乘它会得到它自身的倍数。检验给定向量是否为特征向量并求解其对应的特征值。例如 $A = \\begin{pmatrix} -2 & 4 \\\\ 0 & 1 \\end{pmatrix}$ 把 $(1, 0)$ 映为 $(-2, 0) = -2(1, 0)$，所以特征值为 $-2$。\n\n> **注意。** 特征值是 $A\\mathbf{v} = \\lambda\\mathbf{v}$ 中的倍数 $\\lambda$；$A$ 中不作用于 $\\mathbf{v}$ 的元不是特征值。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5])!;
        const mu = rng.pick([-6, -1, 1, 6])!;
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
        const solution = walked(
          [
            [["Multiply $A$ by $v$", "计算 $Av$"], t("", ""), [`Av = ${mat2Latex(mat)} ${vec2Latex(v)} = ${vec2Latex([lambda, 0])}`]],
            [
              ["Compare with $v$", "与 $v$ 比较"],
              t("", ""),
              [`${vec2Latex([lambda, 0])} = ${lambda} ${vec2Latex(v)}`, `\\lambda = ${lambda}`],
            ],
          ],
          t(
            `$(A ${formatShift(lambda, "I").trim()})v = ${mat2Latex([
              [0, b],
              [0, mu - lambda],
            ])}${vec2Latex(v)} = ${vec2Latex([0, 0])}$.`,
            `$(A ${formatShift(lambda, "I").trim()})v = ${mat2Latex([
              [0, b],
              [0, mu - lambda],
            ])}${vec2Latex(v)} = ${vec2Latex([0, 0])}$。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: lambda,
          form: "integer",
          solution,
          mistakes: [
            why(
              mu,
              `That is the other diagonal entry; it is the eigenvalue of a different eigenvector, not of $${vec2Latex(v)}$.`,
              `这是另一个对角元；它是另一个特征向量的特征值，而不是 $${vec2Latex(v)}$ 的。`,
            ),
            why(
              -lambda,
              "The sign is lost: $Av$ is $\\lambda v$ with $\\lambda$ exactly the first entry of $Av$.",
              "符号丢了：$Av = \\lambda v$，$\\lambda$ 恰好是 $Av$ 的第一个分量。",
            ),
            why(
              b,
              "The entry above the diagonal multiplies the second component of $v$, which is $0$, so it does not act on $v$.",
              "对角线上方的元乘的是 $v$ 的第二个分量 $0$，所以它不作用于 $v$。",
            ),
            why(
              0,
              "That is the second entry of $Av$; the eigenvalue is the ratio of $Av$ to $v$, read from the nonzero component.",
              "这是 $Av$ 的第二个分量；特征值是 $Av$ 与 $v$ 的比值，要从非零分量读出。",
            ),
          ].filter((w, i, all) => w.value !== lambda && all.findIndex((o) => o.value === w.value) === i),
        });
      },
    },
    {
      id: "reading-an-eigenvalue-from-a-product",
      title: t("Reading an eigenvalue from a product", "由乘积读出特征值"),
      explanation: t(
        "To check whether $\\mathbf{v}$ is an eigenvector of $A$, compute $A\\mathbf{v}$ and compare it with $\\mathbf{v}$. If $A\\mathbf{v}$ is a scalar multiple $\\lambda\\mathbf{v}$, then $\\mathbf{v}$ is an eigenvector and the scalar is its eigenvalue. Divide any non-zero component of $A\\mathbf{v}$ by the matching component of $\\mathbf{v}$, and check that the other components give the same ratio. For example, $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ sends $(1, 1)$ to $(3, 3)$, so the eigenvalue is $3$.\n\n> **Watch out.** When $A$ is not triangular, its diagonal entries are not its eigenvalues; compute $A\\mathbf{v}$.",
        "要检验 $\\mathbf{v}$ 是否是 $A$ 的特征向量，计算 $A\\mathbf{v}$ 并与 $\\mathbf{v}$ 比较。若 $A\\mathbf{v}$ 是标量倍 $\\lambda\\mathbf{v}$，则 $\\mathbf{v}$ 是特征向量，该标量就是其特征值。用 $A\\mathbf{v}$ 的任一非零分量除以 $\\mathbf{v}$ 的对应分量，并检查其他分量给出相同的比值。例如 $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ 把 $(1, 1)$ 映为 $(3, 3)$，所以特征值为 $3$。\n\n> **注意。** 当 $A$ 不是三角矩阵时，对角元不是它的特征值；要计算 $A\\mathbf{v}$。",
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
          form: "integer",
          mistakes: [
            why(
              first ? l2 : l1,
              "That is the other eigenvalue of $A$; it belongs to a different eigenvector.",
              "这是 $A$ 的另一个特征值；它属于另一个特征向量。",
            ),
            why(
              A[0][0],
              "$A$ is not triangular, so its diagonal entries are not its eigenvalues.",
              "$A$ 不是三角矩阵，所以对角元不是它的特征值。",
            ),
            why(A[0][0] + A[1][1], "That is the trace, the sum of both eigenvalues.", "这是迹，即两个特征值之和。"),
          ].filter((w, i, all) => w.value !== lam && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Compute $A\\mathbf{v}$", "计算 $A\\mathbf{v}$"],
                t("", ""),
                [`A\\mathbf{v} = ${mat2Latex(A)}${vec2Latex(v)} = ${vec2Latex(Av)}`],
              ],
              [
                ["Divide matching components", "对应分量相除"],
                t("The first component of $\\mathbf{v}$ is not zero:", "$\\mathbf{v}$ 的第一个分量不为零："),
                [`\\lambda = \\frac{${Av[0]}}{${v[0]}} = ${lam}`],
              ],
            ],
            t(
              `The second components give the same ratio: $${paren(lam)} \\cdot ${paren(v[1])} = ${Av[1]}$, so $A\\mathbf{v} = ${lam}\\mathbf{v}$.`,
              `第二个分量给出相同的比值：$${paren(lam)} \\cdot ${paren(v[1])} = ${Av[1]}$，所以 $A\\mathbf{v} = ${lam}\\mathbf{v}$。`,
            ),
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
  intro: t(
    "For $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$, $\\operatorname{tr} A = 7$ and $\\det A = 12 - 2 = 10$, so $\\det(A - \\lambda I) = \\lambda^2 - 7\\lambda + 10 = (\\lambda - 2)(\\lambda - 5)$. The eigenvalues are $2$ and $5$.\n\nCheck: $2 + 5 = 7$ is the trace and $2 \\cdot 5 = 10$ is the determinant.\n\nIn this lesson we find the eigenvalues of a $2 \\times 2$ matrix by solving $\\det(A - \\lambda I) = 0$, first for triangular matrices and then for full ones.",
    "对 $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$，$\\operatorname{tr} A = 7$，$\\det A = 12 - 2 = 10$，所以 $\\det(A - \\lambda I) = \\lambda^2 - 7\\lambda + 10 = (\\lambda - 2)(\\lambda - 5)$。特征值为 $2$ 和 $5$。\n\n检验：$2 + 5 = 7$ 是迹，$2 \\cdot 5 = 10$ 是行列式。\n\n本课我们通过解 $\\det(A - \\lambda I) = 0$ 求 $2 \\times 2$ 矩阵的特征值，先求三角矩阵的，再求一般矩阵的。",
  ),
  prerequisites: ["eigenvalues-and-eigenvectors-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "solving-characteristic-polynomial-2x2",
      title: t("Solving the Characteristic Polynomial of a 2x2 Matrix", "求解 2x2 矩阵的特征多项式"),
      explanation: t(
        "The eigenvalues are the numbers that make the matrix minus that multiple of the identity singular, which happens when its determinant is zero. Find the real eigenvalues of a $2 \\times 2$ matrix from its trace and determinant. For a triangular matrix, $\\det(A - \\lambda I)$ is the product of the diagonal entries of $A - \\lambda I$, so the eigenvalues are the diagonal entries. For example, $\\begin{pmatrix} 2 & 5 \\\\ 0 & -1 \\end{pmatrix}$ has $\\det(A - \\lambda I) = (2 - \\lambda)(-1 - \\lambda)$ and eigenvalues $2$ and $-1$.\n\n> **Watch out.** The entry off the diagonal of a triangular matrix does not change its eigenvalues; leave it out.",
        "特征值就是使矩阵减去单位矩阵相应倍数后变为奇异的数，也就是使其行列式为零的数。利用矩阵的迹和行列式求 $2 \\times 2$ 矩阵的实特征值。对三角矩阵，$\\det(A - \\lambda I)$ 是 $A - \\lambda I$ 对角元之积，所以特征值就是对角元。例如 $\\begin{pmatrix} 2 & 5 \\\\ 0 & -1 \\end{pmatrix}$ 有 $\\det(A - \\lambda I) = (2 - \\lambda)(-1 - \\lambda)$，特征值为 $2$ 和 $-1$。\n\n> **注意。** 三角矩阵对角线以外的元不影响特征值；不要把它算进去。",
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
        const solution = walked(
          [
            [
              ["Write the determinant", "写出行列式"],
              t(
                "$A - \\lambda I$ is triangular, so its determinant is the product of its diagonal entries:",
                "$A - \\lambda I$ 是三角矩阵，所以其行列式是对角元之积：",
              ),
              [`\\det(A - \\lambda I) = (${l1} - \\lambda)(${l2} - \\lambda)`],
            ],
            [["Set it to zero", "令其为零"], t("", ""), [`\\lambda_1 = ${l1}, \\quad \\lambda_2 = ${l2}`]],
          ],
          t(
            `The eigenvalues add to $${l1} + ${paren(l2)} = ${l1 + l2} = \\operatorname{tr} A$ and multiply to $${l1} \\cdot ${paren(l2)} = ${l1 * l2} = \\det A$.`,
            `两特征值之和 $${l1} + ${paren(l2)} = ${l1 + l2} = \\operatorname{tr} A$，之积 $${l1} \\cdot ${paren(l2)} = ${l1 * l2} = \\det A$。`,
          ),
        );
        return solutionsProblem({
          prompt,
          values: [String(l1), String(l2)],
          solution,
          mistakes: [
            whySet(
              [String(-l1), String(-l2)],
              "The signs are flipped: $(\\lambda_1 - \\lambda)(\\lambda_2 - \\lambda) = 0$ gives $\\lambda = \\lambda_1$ and $\\lambda = \\lambda_2$.",
              "符号反了：$(\\lambda_1 - \\lambda)(\\lambda_2 - \\lambda) = 0$ 给出 $\\lambda = \\lambda_1$ 和 $\\lambda = \\lambda_2$。",
            ),
            ...(k === l1
              ? []
              : [
                  whySet(
                    [String(l1), String(k)],
                    "The entry above the diagonal is not an eigenvalue; both diagonal entries are.",
                    "对角线上方的元不是特征值；两个对角元才是。",
                  ),
                ]),
            whySet(
              [String(l1)],
              "A $2 \\times 2$ matrix has two eigenvalues here; the second diagonal entry is one too.",
              "这里 $2 \\times 2$ 矩阵有两个特征值；第二个对角元也是。",
            ),
            whySet(
              [String(l2)],
              "A $2 \\times 2$ matrix has two eigenvalues here; the first diagonal entry is one too.",
              "这里 $2 \\times 2$ 矩阵有两个特征值；第一个对角元也是。",
            ),
          ],
        });
      },
    },
    {
      id: "eigenvalues-of-a-full-2x2-matrix",
      title: t("Eigenvalues of a full 2x2 matrix", "一般 2x2 矩阵的特征值"),
      explanation: t(
        "For a $2 \\times 2$ matrix that is not triangular, the eigenvalues are not on the diagonal. Solve the characteristic equation\n\n$$\\lambda^2 - (\\operatorname{tr} A)\\lambda + \\det A = 0.$$\n\nThe two roots add up to the trace and multiply to the determinant, which is a quick check on the answer. For example, $\\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$ gives $\\lambda^2 - 7\\lambda + 10 = 0$, with roots $2$ and $5$.\n\n> **Watch out.** The trace and the determinant are the coefficients of the equation, not its roots.",
        "对非三角的 $2 \\times 2$ 矩阵，特征值不在对角线上。解特征方程\n\n$$\\lambda^2 - (\\operatorname{tr} A)\\lambda + \\det A = 0.$$\n\n两根之和等于迹，之积等于行列式，可用来快速检验答案。例如 $\\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$ 给出 $\\lambda^2 - 7\\lambda + 10 = 0$，根为 $2$ 和 $5$。\n\n> **注意。** 迹和行列式是方程的系数，而不是方程的根。",
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
          mistakes: [
            whySet(
              [String(A[0][0]), String(A[1][1])],
              "$A$ is not triangular, so its diagonal entries are not its eigenvalues.",
              "$A$ 不是三角矩阵，所以对角元不是它的特征值。",
            ),
            whySet(
              [String(-l1), String(-l2)],
              "The signs are flipped: the roots of $(\\lambda - r)(\\lambda - s) = 0$ are $r$ and $s$.",
              "符号反了：$(\\lambda - r)(\\lambda - s) = 0$ 的根是 $r$ 和 $s$。",
            ),
            whySet(
              [String(tr), String(det)],
              "Those are the trace and the determinant, the coefficients of the equation, not its roots.",
              "这是迹和行列式，即方程的系数，而不是方程的根。",
            ),
          ],
          solution: walked(
            [
              [
                ["Find the trace and determinant", "求迹和行列式"],
                t("", ""),
                [
                  `\\operatorname{tr} A = ${A[0][0]} + ${paren(A[1][1])} = ${tr}`,
                  `\\det A = ${paren(A[0][0])} \\cdot ${paren(A[1][1])} - ${paren(A[0][1])} \\cdot ${paren(A[1][0])} = ${det}`,
                ],
              ],
              [
                ["Solve the characteristic equation", "解特征方程"],
                t("", ""),
                [
                  `${formatCharEq(tr, det)}`,
                  `(${formatFactor("\\lambda", l1)})(${formatFactor("\\lambda", l2)}) = 0`,
                  `\\lambda = ${l1}, \\quad \\lambda = ${l2}`,
                ],
              ],
            ],
            t(
              `$${l1} + ${paren(l2)} = ${tr}$ and $${l1} \\cdot ${paren(l2)} = ${det}$, matching the trace and the determinant.`,
              `$${l1} + ${paren(l2)} = ${tr}$，$${l1} \\cdot ${paren(l2)} = ${det}$，与迹和行列式一致。`,
            ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$ has eigenvalue $5$. Then $A - 5I = \\begin{pmatrix} -1 & 1 \\\\ 2 & -2 \\end{pmatrix}$, whose rows both say $x = y$, so $(1, 1)$ is an eigenvector.\n\nCheck: $A\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 5 \\end{pmatrix} = 5\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$.\n\nIn this lesson we find an eigenvector for a known eigenvalue by solving $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$.",
    "矩阵 $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$ 有特征值 $5$。于是 $A - 5I = \\begin{pmatrix} -1 & 1 \\\\ 2 & -2 \\end{pmatrix}$，两行都给出 $x = y$，所以 $(1, 1)$ 是特征向量。\n\n检验：$A\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 5 \\end{pmatrix} = 5\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$。\n\n本课我们通过解 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ 求已知特征值对应的特征向量。",
  ),
  prerequisites: ["calculating-the-eigenvalues-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "solving-for-eigenvector-2x2",
      title: t("Solving for an Eigenvector of a 2x2 Matrix", "求解 2x2 矩阵的特征向量"),
      explanation: t(
        "For each eigenvalue the matrix minus that multiple of the identity has a nonzero null space, and any nonzero vector in it is an eigenvector. Find the nontrivial solutions of $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ for a $2 \\times 2$ matrix. For example, $A = \\begin{pmatrix} 1 & 4 \\\\ 0 & 3 \\end{pmatrix}$ with $\\lambda = 3$ gives $A - 3I = \\begin{pmatrix} -2 & 4 \\\\ 0 & 0 \\end{pmatrix}$, so $-2x + 4 = 0$ with $y = 1$, and $\\mathbf{v} = (2, 1)$.\n\n> **Watch out.** Subtract the eigenvalue you were given; using the other diagonal entry gives the eigenvector of the other eigenvalue.",
        "对每个特征值，矩阵减去单位矩阵的相应倍数后有非零的零空间，其中任何非零向量都是特征向量。求 $2 \\times 2$ 矩阵方程 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ 的非零解。例如 $A = \\begin{pmatrix} 1 & 4 \\\\ 0 & 3 \\end{pmatrix}$，$\\lambda = 3$ 时 $A - 3I = \\begin{pmatrix} -2 & 4 \\\\ 0 & 0 \\end{pmatrix}$，取 $y = 1$ 得 $-2x + 4 = 0$，所以 $\\mathbf{v} = (2, 1)$。\n\n> **注意。** 要减去题目给出的特征值；用另一个对角元会得到另一个特征值的特征向量。",
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
        const solution = walked(
          [
            [
              ["Subtract the eigenvalue", "减去特征值"],
              t("", ""),
              [`A${formatShift(l2, "I")} = \\begin{pmatrix} ${l1 - l2} & ${b} \\\\ 0 & 0 \\end{pmatrix}`],
            ],
            [["Solve the first row", "解第一行"], t("With $y = 1$:", "取 $y = 1$："), [`${rowEq} = 0`, `${xTerm} = ${-b}`, `x = ${m}`]],
          ],
          t(
            `$A${vec2Latex([m, 1])} = ${vec2Latex([l2 * m, l2])} = ${l2}${vec2Latex([m, 1])}$.`,
            `$A${vec2Latex([m, 1])} = ${vec2Latex([l2 * m, l2])} = ${l2}${vec2Latex([m, 1])}$。`,
          ),
        );
        return withMistakes(
          pointProblem({ prompt, answer: [m, 1], vector: true, solution }),
          dedupeSaid(
            [
              say(
                vectorLatex([-m, 1]),
                `The sign is lost: $${xTerm} = ${-b}$ gives $x = ${m}$.`,
                `符号丢了：$${xTerm} = ${-b}$ 给出 $x = ${m}$。`,
              ),
              say(
                vectorLatex([1, m]),
                "The components are swapped; the second component must be $1$.",
                "两个分量交换了；第二个分量必须是 $1$。",
              ),
              say(
                vectorLatex([1, 0]),
                `That is an eigenvector for $\\lambda = ${l1}$, the other eigenvalue.`,
                `这是另一个特征值 $\\lambda = ${l1}$ 的特征向量。`,
              ),
              say(
                vectorLatex([0, 1]),
                `$A${vec2Latex([0, 1])} = ${vec2Latex([b, l2])}$ is not a multiple of $${vec2Latex([0, 1])}$, because the entry $${b}$ is not $0$.`,
                `$A${vec2Latex([0, 1])} = ${vec2Latex([b, l2])}$ 不是 $${vec2Latex([0, 1])}$ 的倍数，因为元 $${b}$ 不为 $0$。`,
              ),
            ],
            vectorLatex([m, 1]),
          ),
        );
      },
    },
    {
      id: "eigenvectors-of-a-full-2x2-matrix",
      title: t("Eigenvectors of a full 2x2 matrix", "一般 2x2 矩阵的特征向量"),
      explanation: t(
        "To find an eigenvector for $\\lambda$, solve $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$. Because $\\lambda$ is an eigenvalue, the two rows of $A - \\lambda I$ are dependent, so one equation is enough. With $\\mathbf{v} = (x, 1)$, a row $(r, s)$ of $A - \\lambda I$ with $r \\ne 0$ gives $rx + s = 0$, so $x = -\\frac{s}{r}$. For example, $A - \\lambda I = \\begin{pmatrix} 2 & -6 \\\\ -1 & 3 \\end{pmatrix}$ gives $2x - 6 = 0$, so $x = 3$.\n\n> **Watch out.** The fraction is $-\\frac{s}{r}$, the second entry over the first with a minus sign, not $-\\frac{r}{s}$.",
        "要求 $\\lambda$ 对应的特征向量，解 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$。由于 $\\lambda$ 是特征值，$A - \\lambda I$ 的两行线性相关，所以一个方程就够了。取 $\\mathbf{v} = (x, 1)$，$A - \\lambda I$ 中 $r \\ne 0$ 的一行 $(r, s)$ 给出 $rx + s = 0$，所以 $x = -\\frac{s}{r}$。例如 $A - \\lambda I = \\begin{pmatrix} 2 & -6 \\\\ -1 & 3 \\end{pmatrix}$ 给出 $2x - 6 = 0$，所以 $x = 3$。\n\n> **注意。** 分数是 $-\\frac{s}{r}$，即第二个元除以第一个元再取负，而不是 $-\\frac{r}{s}$。",
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
        const candidates: readonly (readonly [Q, string, string])[] = [
          [x.neg(), "The sign is lost: $rx + s = 0$ gives $x = -\\frac{s}{r}$.", "符号丢了：$rx + s = 0$ 给出 $x = -\\frac{s}{r}$。"],
          [
            Q.of(1, j),
            `That gives an eigenvector for $\\lambda = ${l1}$, the other eigenvalue.`,
            `这给出的是另一个特征值 $\\lambda = ${l1}$ 的特征向量。`,
          ],
          [
            Q.of(1 + j * k, k),
            "That is the reciprocal; the fraction is $-\\frac{s}{r}$, not $-\\frac{r}{s}$.",
            "这是倒数；分数是 $-\\frac{s}{r}$，而不是 $-\\frac{r}{s}$。",
          ],
        ];
        const scaled: Vec2 = [k, 1 + j * k];
        return numberProblem({
          prompt: t(
            `Find $x$ so that $\\mathbf{v} = ${vec2Latex(["x", "1"])}$ is an eigenvector of $A = ${mat2Latex(A)}$ for $\\lambda = ${l2}$.`,
            `求 $x$，使 $\\mathbf{v} = ${vec2Latex(["x", "1"])}$ 是 $A = ${mat2Latex(A)}$ 对应于 $\\lambda = ${l2}$ 的特征向量。`,
          ),
          answer: x,
          solveFor: "x",
          mistakes: candidates
            .filter(([v], i, all) => !v.eq(x) && all.findIndex(([o]) => o.eq(v)) === i)
            .map(([v, en, zh]) => why(v, en, zh)),
          solution: walked(
            [
              [["Subtract the eigenvalue", "减去特征值"], t("", ""), [`A - ${paren(l2)}I = ${mat2Latex(B)}`]],
              [
                ["Use one row", "用一行"],
                t(`The row $(${row[0]}, ${row[1]})$ with $y = 1$ gives:`, `行 $(${row[0]}, ${row[1]})$ 在 $y = 1$ 时给出：`),
                [`${formatPoly2(0, row[0], row[1])} = 0`, `x = ${x.toLatex()}`],
              ],
            ],
            t(
              `$\\mathbf{v}$ is a multiple of $${vec2Latex(scaled)}$, and $A${vec2Latex(scaled)} = ${vec2Latex([l2 * scaled[0], l2 * scaled[1]])} = ${l2}${vec2Latex(scaled)}$.`,
              `$\\mathbf{v}$ 是 $${vec2Latex(scaled)}$ 的倍数，而 $A${vec2Latex(scaled)} = ${vec2Latex([l2 * scaled[0], l2 * scaled[1]])} = ${l2}${vec2Latex(scaled)}$。`,
            ),
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
  intro: t(
    "For $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$, $\\operatorname{tr} A = 5$ and $\\det A = 4 - 6 = -2$, so the characteristic equation is $\\lambda^2 - 5\\lambda - 2 = 0$.\n\nCheck: expanding directly, $(1 - \\lambda)(4 - \\lambda) - 2 \\cdot 3 = \\lambda^2 - 5\\lambda + 4 - 6 = \\lambda^2 - 5\\lambda - 2$.\n\nIn this lesson we write the characteristic equation of a $2 \\times 2$ matrix from its trace and determinant, and read coefficients of the $3 \\times 3$ characteristic polynomial.",
    "对 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$，$\\operatorname{tr} A = 5$，$\\det A = 4 - 6 = -2$，所以特征方程为 $\\lambda^2 - 5\\lambda - 2 = 0$。\n\n检验：直接展开，$(1 - \\lambda)(4 - \\lambda) - 2 \\cdot 3 = \\lambda^2 - 5\\lambda + 4 - 6 = \\lambda^2 - 5\\lambda - 2$。\n\n本课我们由迹和行列式写出 $2 \\times 2$ 矩阵的特征方程，并读出 $3 \\times 3$ 特征多项式的系数。",
  ),
  prerequisites: ["calculating-the-eigenvectors-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "characteristic-equation-expansion",
      title: t("Characteristic Equation Expansion", "特征方程的展开"),
      explanation: t(
        "Expanding the determinant of a two by two matrix minus a multiple of the identity always produces the trace and the determinant as the coefficients. Express the characteristic equation in the standard form $\\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det(A) = 0$. For example, $\\begin{pmatrix} 2 & 1 \\\\ -3 & 0 \\end{pmatrix}$ has trace $2$ and determinant $3$, so its characteristic equation is $\\lambda^2 - 2\\lambda + 3 = 0$.\n\n> **Watch out.** The coefficient of $\\lambda$ is minus the trace, and the constant term is plus the determinant.",
        "展开二阶矩阵减去单位矩阵倍数后的行列式，得到的系数总是迹和行列式。将特征方程写为标准形式 $\\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det(A) = 0$。例如 $\\begin{pmatrix} 2 & 1 \\\\ -3 & 0 \\end{pmatrix}$ 的迹为 $2$、行列式为 $3$，所以特征方程为 $\\lambda^2 - 2\\lambda + 3 = 0$。\n\n> **注意。** $\\lambda$ 的系数是迹的相反数，常数项是行列式本身。",
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
        const solution = walked(
          [
            [["Find the trace", "求迹"], t("", ""), [`\\operatorname{tr}(A) = ${trText}`]],
            [["Find the determinant", "求行列式"], t("", ""), [`\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det}`]],
            [
              ["Assemble the equation", "写出方程"],
              t(
                "Substitute into $\\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det(A) = 0$:",
                "代入 $\\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det(A) = 0$：",
              ),
              [formatCharEq(tr, det)],
            ],
          ],
          t(
            `Expanding $(${a} - \\lambda)(${d} - \\lambda) - (${b})(${c})$ directly gives $\\lambda^2 - ${paren(tr)}\\lambda + ${paren(det)}$, the same polynomial.`,
            `直接展开 $(${a} - \\lambda)(${d} - \\lambda) - (${b})(${c})$ 得 $\\lambda^2 - ${paren(tr)}\\lambda + ${paren(det)}$，是同一个多项式。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The coefficient of $\\lambda$ is minus the trace, so its sign is wrong here.",
            "$\\lambda$ 的系数是迹的相反数，所以这里符号错了。",
          ],
          [
            wrong[1]!.en,
            "The constant term is the determinant itself, so its sign is wrong here.",
            "常数项就是行列式本身，所以这里符号错了。",
          ],
          [
            wrong[2]!.en,
            "Both signs are wrong: the coefficient of $\\lambda$ is minus the trace, and the constant term is the determinant.",
            "两个符号都错了：$\\lambda$ 的系数是迹的相反数，常数项是行列式。",
          ],
          [
            wrong[3]!.en,
            `The coefficient of $\\lambda$ is off by one: the trace here is $${tr}$.`,
            `$\\lambda$ 的系数差了 1：这里的迹是 $${tr}$。`,
          ],
        ]);
      },
    },
    {
      id: "coefficients-of-a-3x3-characteristic-polynomial",
      title: t("Coefficients of a 3x3 characteristic polynomial", "3x3 特征多项式的系数"),
      explanation: t(
        "For a $3 \\times 3$ matrix the characteristic polynomial is\n\n$$\\det(\\lambda I - A) = \\lambda^3 - (\\operatorname{tr} A)\\lambda^2 + c_1\\lambda - \\det A,$$\n\nwhere $c_1$ is the sum of the three $2 \\times 2$ principal minors. So the coefficient of $\\lambda^2$ is minus the trace and the constant term is minus the determinant, which can be read off without expanding the whole determinant. For example, $A = \\begin{pmatrix} 1 & 0 & 2 \\\\ 0 & 3 & 0 \\\\ 1 & 0 & 1 \\end{pmatrix}$ has trace $5$, so the coefficient of $\\lambda^2$ is $-5$, and its principal minors are $3$, $-1$ and $3$, so $c_1 = 5$.\n\n> **Watch out.** The signs alternate: $-\\operatorname{tr} A$ for $\\lambda^2$, then $+c_1$ for $\\lambda$, then $-\\det A$.",
        "对 $3 \\times 3$ 矩阵，特征多项式为\n\n$$\\det(\\lambda I - A) = \\lambda^3 - (\\operatorname{tr} A)\\lambda^2 + c_1\\lambda - \\det A,$$\n\n其中 $c_1$ 是三个 $2 \\times 2$ 主子式之和。所以 $\\lambda^2$ 的系数是迹的相反数，常数项是行列式的相反数，无需展开整个行列式就能读出。例如 $A = \\begin{pmatrix} 1 & 0 & 2 \\\\ 0 & 3 & 0 \\\\ 1 & 0 & 1 \\end{pmatrix}$ 的迹为 $5$，所以 $\\lambda^2$ 的系数为 $-5$；它的主子式为 $3$、$-1$、$3$，所以 $c_1 = 5$。\n\n> **注意。** 符号交替：$\\lambda^2$ 的系数是 $-\\operatorname{tr} A$，$\\lambda$ 的系数是 $+c_1$，常数项是 $-\\det A$。",
      ),
      generate(rng: Rng): Problem {
        const m: number[][] = [0, 1, 2].map(() => [0, 1, 2].map(() => rng.int(-4, 4)));
        const M = m as unknown as Mat3;
        const det3 = (X: Mat3) =>
          X[0][0] * (X[1][1] * X[2][2] - X[1][2] * X[2][1]) -
          X[0][1] * (X[1][0] * X[2][2] - X[1][2] * X[2][0]) +
          X[0][2] * (X[1][0] * X[2][1] - X[1][1] * X[2][0]);
        const tr = M[0][0] + M[1][1] + M[2][2];
        const det = det3(M);
        const m12 = M[0][0] * M[1][1] - M[0][1] * M[1][0];
        const m13 = M[0][0] * M[2][2] - M[0][2] * M[2][0];
        const m23 = M[1][1] * M[2][2] - M[1][2] * M[2][1];
        const minors = m12 + m13 + m23;
        const IminusA = [0, 1, 2].map((r) => [0, 1, 2].map((c) => (r === c ? 1 : 0) - M[r]![c]!)) as unknown as Mat3;
        const p1 = det3(IminusA);
        const wantLinear = rng.int(0, 1) === 1;
        const ans = wantLinear ? minors : -tr;
        const minorLine = (a: number, b: number, c: number, d: number, v: number) =>
          `${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${v}`;
        return numberProblem({
          prompt: t(
            `Find the coefficient of ${wantLinear ? "$\\lambda$" : "$\\lambda^2$"} in $\\det(\\lambda I - A)$ for $A = ${mat3Latex(M)}$.`,
            `对 $A = ${mat3Latex(M)}$，求 $\\det(\\lambda I - A)$ 中 ${wantLinear ? "$\\lambda$" : "$\\lambda^2$"} 的系数。`,
          ),
          answer: ans,
          form: "integer",
          mistakes: (wantLinear
            ? [
                why(-minors, "The coefficient of $\\lambda$ is $+c_1$, with a plus sign.", "$\\lambda$ 的系数是 $+c_1$，带正号。"),
                why(tr, "The trace goes with $\\lambda^2$, not with $\\lambda$.", "迹对应 $\\lambda^2$ 项，而不是 $\\lambda$ 项。"),
                why(-det, "That is the constant term, $-\\det A$.", "这是常数项 $-\\det A$。"),
              ]
            : [
                why(tr, "The coefficient of $\\lambda^2$ is minus the trace.", "$\\lambda^2$ 的系数是迹的相反数。"),
                why(
                  minors,
                  "The sum of the principal minors is the coefficient of $\\lambda$, not of $\\lambda^2$.",
                  "主子式之和是 $\\lambda$ 的系数，而不是 $\\lambda^2$ 的系数。",
                ),
                why(-det, "That is the constant term, $-\\det A$.", "这是常数项 $-\\det A$。"),
              ]
          ).filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: wantLinear
            ? walked(
                [
                  [
                    ["Compute the principal minors", "计算主子式"],
                    t("Delete one row and the matching column each time:", "每次删去一行及对应的一列："),
                    [
                      minorLine(M[0][0], M[0][1], M[1][0], M[1][1], m12),
                      minorLine(M[0][0], M[0][2], M[2][0], M[2][2], m13),
                      minorLine(M[1][1], M[1][2], M[2][1], M[2][2], m23),
                    ],
                  ],
                  [["Add them", "相加"], t("", ""), [`c_1 = ${m12} + ${paren(m13)} + ${paren(m23)} = ${minors}`]],
                ],
                t(
                  `At $\\lambda = 1$: $\\det(I - A) = ${p1}$, and $1 - ${paren(tr)} + ${paren(minors)} - ${paren(det)} = ${p1}$.`,
                  `取 $\\lambda = 1$：$\\det(I - A) = ${p1}$，而 $1 - ${paren(tr)} + ${paren(minors)} - ${paren(det)} = ${p1}$。`,
                ),
              )
            : walked(
                [
                  [
                    ["Find the trace", "求迹"],
                    t("", ""),
                    [`\\operatorname{tr} A = ${M[0][0]} + ${paren(M[1][1])} + ${paren(M[2][2])} = ${tr}`],
                  ],
                  [
                    ["Attach the sign", "加上符号"],
                    t("The coefficient of $\\lambda^2$ is $-\\operatorname{tr} A$:", "$\\lambda^2$ 的系数是 $-\\operatorname{tr} A$："),
                    [`-${paren(tr)} = ${-tr}`],
                  ],
                ],
                t(
                  `At $\\lambda = 1$: $\\det(I - A) = ${p1}$, and $1 - ${paren(tr)} + ${paren(minors)} - ${paren(det)} = ${p1}$, using $c_1 = ${minors}$ and $\\det A = ${det}$.`,
                  `取 $\\lambda = 1$：$\\det(I - A) = ${p1}$，而 $1 - ${paren(tr)} + ${paren(minors)} - ${paren(det)} = ${p1}$，其中 $c_1 = ${minors}$，$\\det A = ${det}$。`,
                ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ has characteristic equation $\\lambda^2 - 5\\lambda - 2 = 0$. The Cayley-Hamilton theorem says $A$ satisfies it too: $A^2 - 5A - 2I = 0$, so $A^2 = 5A + 2I$.\n\nCheck: $A^2 = \\begin{pmatrix} 7 & 10 \\\\ 15 & 22 \\end{pmatrix}$ and $5A + 2I = \\begin{pmatrix} 5 + 2 & 10 \\\\ 15 & 20 + 2 \\end{pmatrix}$, the same matrix.\n\nIn this lesson we use the Cayley-Hamilton theorem to write $A^2$, $A^3$ and other powers of a $2 \\times 2$ matrix as combinations of $A$ and $I$.",
    "矩阵 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ 的特征方程为 $\\lambda^2 - 5\\lambda - 2 = 0$。凯莱-哈密顿定理说 $A$ 也满足它：$A^2 - 5A - 2I = 0$，所以 $A^2 = 5A + 2I$。\n\n检验：$A^2 = \\begin{pmatrix} 7 & 10 \\\\ 15 & 22 \\end{pmatrix}$，$5A + 2I = \\begin{pmatrix} 5 + 2 & 10 \\\\ 15 & 20 + 2 \\end{pmatrix}$，是同一个矩阵。\n\n本课我们用凯莱-哈密顿定理把 $2 \\times 2$ 矩阵的 $A^2$、$A^3$ 等幂写成 $A$ 与 $I$ 的组合。",
  ),
  prerequisites: ["characteristic-equation-of-a-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "applying-cayley-hamilton-to-powers",
      title: t("Applying Cayley-Hamilton to Matrix Powers", "将凯莱-哈密顿定理应用于矩阵幂"),
      explanation: t(
        "Every square matrix satisfies its own characteristic equation, so its square can be written using only the matrix itself and the identity. Substitute $A$ into its characteristic polynomial to compute $A^2 = \\operatorname{tr}(A)A - \\det(A)I$. For example, the equation $\\lambda^2 - 3\\lambda + 4 = 0$ gives $A^2 - 3A + 4I = 0$, so $A^2 = 3A - 4I$.\n\n> **Watch out.** Moving the terms to the other side changes their signs: the coefficients in $A^2 = \\dots$ are the opposites of those in the equation.",
        "每个方阵都满足它自己的特征方程，所以它的平方可以只用矩阵本身和单位矩阵来表示。将矩阵 $A$ 代入其特征多项式，计算 $A^2 = \\operatorname{tr}(A)A - \\det(A)I$。例如方程 $\\lambda^2 - 3\\lambda + 4 = 0$ 给出 $A^2 - 3A + 4I = 0$，所以 $A^2 = 3A - 4I$。\n\n> **注意。** 把各项移到等号另一边时符号要变：$A^2 = \\dots$ 中的系数与方程中的系数相反。",
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
        const solution = walked(
          [
            [
              ["Substitute $A$ for $\\lambda$", "用 $A$ 代替 $\\lambda$"],
              t("The constant term becomes a multiple of $I$:", "常数项变为 $I$ 的倍数："),
              [`A^2${formatShift(tr, "A")}${formatShift(-det, "I")} = 0`],
            ],
            [["Solve for $A^2$", "解出 $A^2$"], t("", ""), [`A^2 = ${formatCayleyComb(tr, det)}`]],
          ],
          t(
            `Each eigenvalue satisfies the same relation with $\\lambda$ in place of $A$: $\\lambda^2 = ${formatCayleyComb(tr, det).replace("A", "\\lambda").replace("I", "")}$, which is the characteristic equation rearranged.`,
            `每个特征值满足把 $A$ 换成 $\\lambda$ 的同一关系：$\\lambda^2 = ${formatCayleyComb(tr, det).replace("A", "\\lambda").replace("I", "")}$，正是特征方程移项后的形式。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The coefficient of $A$ has the wrong sign: solving for $A^2$ moves that term across the equals sign, which changes its sign.",
            "$A$ 的系数符号错了：解出 $A^2$ 时这一项移到等号另一边，符号要改变。",
          ],
          [
            wrong[1]!.en,
            "The coefficient of $I$ has the wrong sign: solving for $A^2$ moves that term across the equals sign, which changes its sign.",
            "$I$ 的系数符号错了：解出 $A^2$ 时这一项移到等号另一边，符号要改变。",
          ],
          [
            wrong[2]!.en,
            "Both signs are wrong: solving for $A^2$ moves both terms across the equals sign, which changes their signs.",
            "两个符号都错了：解出 $A^2$ 时两项都移到等号另一边，符号都要改变。",
          ],
          [
            wrong[3]!.en,
            "The coefficient of $A$ comes from the characteristic equation, and it is not $1$ here.",
            "$A$ 的系数来自特征方程，这里不是 $1$。",
          ],
        ]);
      },
    },
    {
      id: "reducing-the-cube-of-a-matrix",
      title: t("Reducing the cube of a matrix", "化简矩阵的三次幂"),
      explanation: t(
        "If $A$ is $2 \\times 2$ with characteristic equation $\\lambda^2 - s\\lambda + p = 0$, the Cayley-Hamilton theorem gives $A^2 = sA - pI$. Multiplying by $A$ and substituting again,\n\n$$A^3 = sA^2 - pA = (s^2 - p)A - spI.$$\n\nSo every power of $A$ is a combination of $A$ and $I$. For example, $\\lambda^2 - 3\\lambda + 2 = 0$ gives $A^2 = 3A - 2I$ and $A^3 = 3(3A - 2I) - 2A = 7A - 6I$.\n\n> **Watch out.** After multiplying by $A$, substitute for $A^2$ once more; the answer must contain no $A^2$ term.",
        "若 $2 \\times 2$ 矩阵 $A$ 的特征方程为 $\\lambda^2 - s\\lambda + p = 0$，凯莱–哈密顿定理给出 $A^2 = sA - pI$。两边乘以 $A$ 再代入一次，\n\n$$A^3 = sA^2 - pA = (s^2 - p)A - spI.$$\n\n所以 $A$ 的每个幂都是 $A$ 与 $I$ 的组合。例如 $\\lambda^2 - 3\\lambda + 2 = 0$ 给出 $A^2 = 3A - 2I$，$A^3 = 3(3A - 2I) - 2A = 7A - 6I$。\n\n> **注意。** 乘以 $A$ 之后要再代入一次 $A^2$；答案中不能有 $A^2$ 项。",
      ),
      generate(rng: Rng): Problem {
        const s = rng.int(-5, 5) || 2;
        const p = rng.int(-6, 6) || -3;
        const wantA = rng.int(0, 1) === 0;
        const alpha = s * s - p;
        const beta = -s * p;
        const ans = wantA ? alpha : beta;
        const C: Mat2 = [
          [0, -p],
          [1, s],
        ];
        const C3 = mul2(C, mul2(C, C));
        return numberProblem({
          prompt: t(
            `A $2 \\times 2$ matrix $A$ has characteristic equation $${formatCharEq(s, p)}$. Writing $A^3 = \\alpha A + \\beta I$, find $\\${wantA ? "alpha" : "beta"}$.`,
            `$2 \\times 2$ 矩阵 $A$ 的特征方程为 $${formatCharEq(s, p)}$。写成 $A^3 = \\alpha A + \\beta I$，求 $\\${wantA ? "alpha" : "beta"}$。`,
          ),
          answer: ans,
          form: "integer",
          mistakes: (wantA
            ? [
                why(
                  s * s + p,
                  "The sign of $p$ is wrong: $A^3 = sA^2 - pA$ contributes $-p$ to the coefficient of $A$.",
                  "$p$ 的符号错了：$A^3 = sA^2 - pA$ 给 $A$ 的系数贡献 $-p$。",
                ),
                why(
                  s * s,
                  "The term $-pA$ from $A \\cdot A^2$ also adds to the coefficient of $A$.",
                  "由 $A \\cdot A^2$ 得到的 $-pA$ 项也计入 $A$ 的系数。",
                ),
                why(s, "That is the coefficient of $A$ in $A^2$, not in $A^3$.", "这是 $A^2$ 中 $A$ 的系数，而不是 $A^3$ 中的。"),
              ]
            : [
                why(s * p, "The sign is lost: $s(-pI) = -spI$.", "符号丢了：$s(-pI) = -spI$。"),
                why(-p, "That is the coefficient of $I$ in $A^2$, not in $A^3$.", "这是 $A^2$ 中 $I$ 的系数，而不是 $A^3$ 中的。"),
                why(
                  p * p,
                  "The multiple of $I$ comes from $s$ times $-pI$, so it is $-sp$, not $p^2$.",
                  "$I$ 的倍数来自 $s$ 乘 $-pI$，所以是 $-sp$，而不是 $p^2$。",
                ),
              ]
          ).filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [["Apply Cayley-Hamilton", "应用凯莱-哈密顿定理"], t("", ""), [`A^2 = ${formatCayleyComb(s, p)}`]],
              [["Multiply by $A$", "乘以 $A$"], t("", ""), [`A^3 = A \\cdot A^2 = ${formatLinearComb2(s, "A^2", -p, "A")}`]],
              [
                ["Substitute for $A^2$ again", "再代入 $A^2$"],
                t("", ""),
                [
                  `A^3 = ${s}\\left(${formatCayleyComb(s, p)}\\right)${-p > 0 ? " + " : " - "}${Math.abs(p) === 1 ? "" : Math.abs(p)}A = ${formatLinearComb2(alpha, "A", beta, "I")}`,
                  `\\${wantA ? "alpha" : "beta"} = ${ans}`,
                ],
              ],
            ],
            t(
              `The matrix $C = ${mat2Latex(C)}$ has this characteristic equation, and $C^3 = ${mat2Latex(C3)}$, which equals $${paren(alpha)}C + ${paren(beta)}I = ${mat2Latex(
                [
                  [beta, -p * alpha],
                  [alpha, s * alpha + beta],
                ],
              )}$.`,
              `矩阵 $C = ${mat2Latex(C)}$ 有这个特征方程，且 $C^3 = ${mat2Latex(C3)}$，等于 $${paren(alpha)}C + ${paren(beta)}I = ${mat2Latex(
                [
                  [beta, -p * alpha],
                  [alpha, s * alpha + beta],
                ],
              )}$。`,
            ),
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
  intro: t(
    "The triangular matrix $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 0 & 5 & 0 \\\\ 0 & 0 & -1 \\end{pmatrix}$ has eigenvalues $2$, $5$ and $-1$. For $\\lambda = 5$, the matrix $A - 5I$ has rows $(-3, 1, 0)$, $(0, 0, 0)$ and $(0, 0, -6)$. The last row forces $x_3 = 0$, and the first gives $x_2 = 3x_1$, so $\\mathbf{v} = \\langle 1, 3, 0 \\rangle$.\n\nCheck: $A\\mathbf{v} = \\langle 2 + 3, 15, 0 \\rangle = \\langle 5, 15, 0 \\rangle = 5\\mathbf{v}$.\n\nIn this lesson we find an eigenvector for each eigenvalue of a $3 \\times 3$ matrix whose eigenvalues are all different, by solving $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ with one free variable.",
    "三角矩阵 $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 0 & 5 & 0 \\\\ 0 & 0 & -1 \\end{pmatrix}$ 的特征值为 $2$、$5$ 和 $-1$。对 $\\lambda = 5$，矩阵 $A - 5I$ 的三行为 $(-3, 1, 0)$、$(0, 0, 0)$ 和 $(0, 0, -6)$。最后一行迫使 $x_3 = 0$，第一行给出 $x_2 = 3x_1$，所以 $\\mathbf{v} = \\langle 1, 3, 0 \\rangle$。\n\n检验：$A\\mathbf{v} = \\langle 2 + 3, 15, 0 \\rangle = \\langle 5, 15, 0 \\rangle = 5\\mathbf{v}$。\n\n本课我们对特征值互不相同的 $3 \\times 3$ 矩阵，通过解只有一个自由变量的 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$，为每个特征值求出一个特征向量。",
  ),
  prerequisites: ["cayley-hamilton-theorem"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "eigenvectors-3x3-distinct-eigenvalues",
      title: t("Eigenvectors of 3x3 Matrix with Distinct Eigenvalues", "3x3 矩阵在相异特征值下的特征向量"),
      explanation: t(
        "With distinct eigenvalues, each one gives a one dimensional null space, so row reduce to find one free variable and read off the eigenvector. Solve $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ for a $3 \\times 3$ matrix with distinct eigenvalues. For example, for $A = \\begin{pmatrix} 3 & 2 & 1 \\\\ 0 & 5 & 4 \\\\ 0 & 0 & -2 \\end{pmatrix}$ and $\\lambda = 3$, the matrix $A - 3I$ has diagonal $0, 2, -5$; back substitution gives $x_3 = 0$, then $x_2 = 0$, and $x_1$ is free, so $\\mathbf{v} = \\langle 1, 0, 0 \\rangle$.\n\n> **Watch out.** Solve from the bottom row up. A nonzero diagonal entry of $A - \\lambda I$ forces its variable to be $0$ once the variables below it are $0$; only the column with a zero on the diagonal is free.",
        "当特征值互不相同时，每个特征值对应一维的零空间，所以行化简后找到一个自由变量，就能读出特征向量。对具有互异特征值的 $3 \\times 3$ 矩阵，求解方程 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$。例如 $A = \\begin{pmatrix} 3 & 2 & 1 \\\\ 0 & 5 & 4 \\\\ 0 & 0 & -2 \\end{pmatrix}$，$\\lambda = 3$ 时，$A - 3I$ 的对角元为 $0, 2, -5$；回代得 $x_3 = 0$，再得 $x_2 = 0$，$x_1$ 自由，所以 $\\mathbf{v} = \\langle 1, 0, 0 \\rangle$。\n\n> **注意。** 从最下面一行往上解。下面的变量都为 $0$ 后，$A - \\lambda I$ 中非零的对角元会迫使它所在的变量为 $0$；只有对角元为零的那一列是自由的。",
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
        const shifted: Mat3 = [
          [0, a12, a13],
          [0, l2 - l1, a23],
          [0, 0, l3 - l1],
        ];
        const solution = walked(
          [
            [["Subtract $\\lambda_1 I$", "减去 $\\lambda_1 I$"], t("", ""), [`A - ${l1}I = ${mat3Latex(shifted)}`]],
            [
              ["Back-substitute", "回代"],
              t(
                `The third row gives $${l3 - l1}x_3 = 0$, so $x_3 = 0$. The second row then gives $${l2 - l1}x_2 = 0$, so $x_2 = 0$. The first column is zero, so $x_1$ is free; take $x_1 = 1$.`,
                `第三行给出 $${l3 - l1}x_3 = 0$，所以 $x_3 = 0$。第二行接着给出 $${l2 - l1}x_2 = 0$，所以 $x_2 = 0$。第一列全为零，所以 $x_1$ 自由；取 $x_1 = 1$。`,
              ),
            ],
          ],
          t(
            `$A ${vec3Latex([1, 0, 0])} = ${vec3Latex([l1, 0, 0])} = ${l1}${vec3Latex([1, 0, 0])}$.`,
            `$A ${vec3Latex([1, 0, 0])} = ${vec3Latex([l1, 0, 0])} = ${l1}${vec3Latex([1, 0, 0])}$。`,
          ),
        );
        const image = (v: Vec3): Vec3 => [l1 * v[0] + a12 * v[1] + a13 * v[2], l2 * v[1] + a23 * v[2], l3 * v[2]];
        const off = (v: Vec3, en: string, zh: string) => {
          const w = image(v);
          return say(
            vectorLatex(v),
            `${en} Here $A${vectorLatex(v)} = ${vectorLatex(w)}$, which is not $${l1}$ times it.`,
            `${zh}这里 $A${vectorLatex(v)} = ${vectorLatex(w)}$，不是它的 $${l1}$ 倍。`,
          );
        };
        return withMistakes(
          pointProblem({ prompt, answer: [1, 0, 0], vector: true, solution }),
          dedupeSaid(
            [
              off(
                [0, 1, 0],
                "This is $e_2$, but the second column of $A$ has the entry $a_{12} \\ne 0$ above the diagonal.",
                "这是 $e_2$，但 $A$ 的第二列在对角线上方有非零元 $a_{12}$。",
              ),
              off(
                [0, 0, 1],
                "This is $e_3$, which belongs with the last diagonal entry, if with any.",
                "这是 $e_3$，它即使是特征向量，也对应最后一个对角元。",
              ),
              off([1, 1, 0], "The second row of $A - \\lambda_1 I$ forces $x_2 = 0$.", "$A - \\lambda_1 I$ 的第二行迫使 $x_2 = 0$。"),
              off([1, 0, 1], "The third row of $A - \\lambda_1 I$ forces $x_3 = 0$.", "$A - \\lambda_1 I$ 的第三行迫使 $x_3 = 0$。"),
            ],
            vectorLatex([1, 0, 0]),
          ),
        );
      },
    },
    {
      id: "the-middle-eigenvector-of-a-triangular-3x3-matrix",
      title: t("The middle eigenvector of a triangular 3x3 matrix", "三角 3x3 矩阵中间特征值的特征向量"),
      explanation: t(
        "For an upper triangular matrix the eigenvalues are the diagonal entries. An eigenvector for the middle entry $\\lambda = a_{22}$ can be taken with $x_3 = 0$ and $x_2 = 1$. The third equation then holds automatically, the second is $0 = 0$, and the first row gives\n\n$$(a_{11} - a_{22})x_1 + a_{12} = 0, \\qquad x_1 = \\frac{a_{12}}{a_{22} - a_{11}}.$$\n\nFor example, if $a_{11} = 1$, $a_{12} = 4$ and $a_{22} = 3$, then $-2x_1 + 4 = 0$ and $x_1 = 2$.\n\n> **Watch out.** The denominator is $a_{22} - a_{11}$, the eigenvalue minus the first diagonal entry. Writing it the other way round flips the sign of $x_1$.",
        "上三角矩阵的特征值就是对角元。对中间的对角元 $\\lambda = a_{22}$，可取特征向量使 $x_3 = 0$，$x_2 = 1$。此时第三个方程自动成立，第二个方程为 $0 = 0$，第一行给出\n\n$$(a_{11} - a_{22})x_1 + a_{12} = 0, \\qquad x_1 = \\frac{a_{12}}{a_{22} - a_{11}}.$$\n\n例如 $a_{11} = 1$，$a_{12} = 4$，$a_{22} = 3$ 时，$-2x_1 + 4 = 0$，$x_1 = 2$。\n\n> **注意。** 分母是 $a_{22} - a_{11}$，即特征值减去第一个对角元。写反了会使 $x_1$ 变号。",
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
        const left = Q.of(d1).mul(x1).add(Q.of(a12));
        return numberProblem({
          prompt: t(
            `Find $x_1$ so that $\\langle x_1, 1, 0 \\rangle$ is an eigenvector of $A = ${mat3Latex(M)}$ for $\\lambda = ${d2}$.`,
            `求 $x_1$，使 $\\langle x_1, 1, 0 \\rangle$ 是 $A = ${mat3Latex(M)}$ 对应于 $\\lambda = ${d2}$ 的特征向量。`,
          ),
          answer: x1,
          solveFor: "x_1",
          mistakes: (
            [
              [
                x1.neg(),
                `The sign is flipped: the first row gives $x_1 = \\frac{${a12}}{${d2} - ${paren(d1)}}$, with the eigenvalue first in the denominator.`,
                `符号反了：第一行给出 $x_1 = \\frac{${a12}}{${d2} - ${paren(d1)}}$，分母中特征值在前。`,
              ],
              [
                Q.of(a12),
                "That is $a_{12}$ itself; it must still be divided by $a_{22} - a_{11}$.",
                "这是 $a_{12}$ 本身；还要除以 $a_{22} - a_{11}$。",
              ],
              [Q.of(d2 - d1, a12), "The fraction is upside down: $a_{12}$ goes in the numerator.", "分数上下颠倒了：$a_{12}$ 应在分子上。"],
            ] as const
          )
            .filter(([v], i, all) => !v.eq(x1) && all.findIndex(([o]) => o.eq(v)) === i)
            .map(([v, en, zh]) => why(v, en, zh)),
          solution: walked(
            [
              [
                ["Write the first row", "写出第一行"],
                t(
                  `With $x_2 = 1$ and $x_3 = 0$, the first row of $(A - ${paren(d2)}I)\\mathbf{v} = \\mathbf{0}$ is:`,
                  `取 $x_2 = 1$，$x_3 = 0$，$(A - ${paren(d2)}I)\\mathbf{v} = \\mathbf{0}$ 的第一行为：`,
                ),
                [`${poly([d1 - d2, "x_1"], [a12, ""])} = 0`],
              ],
              [["Solve for $x_1$", "解出 $x_1$"], t("", ""), [`x_1 = ${x1.toLatex()}`]],
            ],
            t(
              `The first entry of $A\\mathbf{v}$ is $${d1} \\cdot ${paren(x1)} + ${paren(a12)} = ${left.toLatex()} = ${d2} \\cdot ${paren(x1)}$, and the second is $${d2} \\cdot 1$, so $A\\mathbf{v} = ${d2}\\mathbf{v}$.`,
              `$A\\mathbf{v}$ 的第一个元素为 $${d1} \\cdot ${paren(x1)} + ${paren(a12)} = ${left.toLatex()} = ${d2} \\cdot ${paren(x1)}$，第二个元素为 $${d2} \\cdot 1$，所以 $A\\mathbf{v} = ${d2}\\mathbf{v}$。`,
            ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 5 \\end{pmatrix}$ has the eigenvalue $2$ twice and $5$ once. Here $A - 2I = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 3 \\end{pmatrix}$ has rank $2$, so its null space is a line, spanned by $\\langle 1, 0, 0 \\rangle$: the repeated eigenvalue has only one independent eigenvector.\n\nCheck: $A\\langle 1, 0, 0 \\rangle = \\langle 2, 0, 0 \\rangle$, while $A\\langle 0, 1, 0 \\rangle = \\langle 1, 2, 0 \\rangle$ is not a multiple of $\\langle 0, 1, 0 \\rangle$.\n\nIn this lesson we find the eigenvectors of a $3 \\times 3$ matrix when an eigenvalue repeats, and count them with the geometric multiplicity $3 - \\operatorname{rank}(A - \\lambda I)$.",
    "矩阵 $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 5 \\end{pmatrix}$ 的特征值 $2$ 出现两次，$5$ 出现一次。这里 $A - 2I = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 3 \\end{pmatrix}$ 的秩为 $2$，所以它的零空间是由 $\\langle 1, 0, 0 \\rangle$ 张成的直线：重特征值只有一个线性无关的特征向量。\n\n检验：$A\\langle 1, 0, 0 \\rangle = \\langle 2, 0, 0 \\rangle$，而 $A\\langle 0, 1, 0 \\rangle = \\langle 1, 2, 0 \\rangle$ 不是 $\\langle 0, 1, 0 \\rangle$ 的倍数。\n\n本课我们在特征值重复时求 $3 \\times 3$ 矩阵的特征向量，并用几何重数 $3 - \\operatorname{rank}(A - \\lambda I)$ 数出它们的个数。",
  ),
  prerequisites: ["calculating-the-eigenvectors-of-a-3x3-matrix-with-distinct-eigenvalues"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "geometric-multiplicity-3x3",
      title: t("Geometric Multiplicity of 3x3 Matrices", "3x3 矩阵的几何重数"),
      explanation: t(
        "The geometric multiplicity counts the independent eigenvectors for an eigenvalue, and it can be smaller than the number of times the eigenvalue is repeated. Compute $\\operatorname{nullity}(A - \\lambda I)$ to find the geometric multiplicity of a repeated eigenvalue. For example, $A = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 4 \\end{pmatrix}$ gives $A - I$ of rank $1$, so $\\lambda = 1$ has geometric multiplicity $3 - 1 = 2$; putting a $2$ in the top middle would raise the rank to $2$ and lower it to $1$.\n\n> **Watch out.** The geometric multiplicity is not read from the characteristic polynomial: two matrices with the same repeated eigenvalue can have different numbers of eigenvectors. Always find the rank of $A - \\lambda I$.",
        "几何重数是一个特征值对应的线性无关特征向量的个数，它可能小于该特征值重复的次数。计算 $\\operatorname{nullity}(A - \\lambda I)$，得到重特征值的几何重数。例如 $A = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 4 \\end{pmatrix}$ 使 $A - I$ 的秩为 $1$，所以 $\\lambda = 1$ 的几何重数为 $3 - 1 = 2$；在第一行中间放一个 $2$，秩升为 $2$，几何重数降为 $1$。\n\n> **注意。** 几何重数不能从特征多项式读出：重特征值相同的两个矩阵，特征向量的个数可以不同。一定要求 $A - \\lambda I$ 的秩。",
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
        const shifted = mat3Latex([
          [0, a, 0],
          [0, 0, 0],
          [0, 0, mu - lambda],
        ]);
        const rank = 3 - expectedGeoMult;
        const solution = walked(
          [
            [["Subtract $\\lambda I$", "减去 $\\lambda I$"], t("", ""), [`A${shiftStr} = ${shifted}`]],
            [
              ["Find the rank", "求秩"],
              t(
                hasExtraPivot
                  ? `The entries $${a}$ and $${mu - lambda}$ lie in different rows and columns, so the rank is $2$ and the nullity is $3 - 2 = 1$.`
                  : `Only the entry $${mu - lambda}$ is nonzero, so the rank is $1$ and the nullity is $3 - 1 = 2$.`,
                hasExtraPivot
                  ? `元素 $${a}$ 和 $${mu - lambda}$ 位于不同的行和列，所以秩为 $2$，零化度为 $3 - 2 = 1$。`
                  : `只有元素 $${mu - lambda}$ 非零，所以秩为 $1$，零化度为 $3 - 1 = 2$。`,
              ),
            ],
          ],
          t(
            hasExtraPivot
              ? `$A\\langle 1, 0, 0 \\rangle = ${lambda}\\langle 1, 0, 0 \\rangle$, but $A\\langle 0, 1, 0 \\rangle = \\langle ${a}, ${lambda}, 0 \\rangle$ is not a multiple of $\\langle 0, 1, 0 \\rangle$, so there is only one independent eigenvector.`
              : `Both $\\langle 1, 0, 0 \\rangle$ and $\\langle 0, 1, 0 \\rangle$ are sent to $${lambda}$ times themselves, so there are two independent eigenvectors.`,
            hasExtraPivot
              ? `$A\\langle 1, 0, 0 \\rangle = ${lambda}\\langle 1, 0, 0 \\rangle$，但 $A\\langle 0, 1, 0 \\rangle = \\langle ${a}, ${lambda}, 0 \\rangle$ 不是 $\\langle 0, 1, 0 \\rangle$ 的倍数，所以只有一个线性无关的特征向量。`
              : `$\\langle 1, 0, 0 \\rangle$ 和 $\\langle 0, 1, 0 \\rangle$ 都被映为自身的 $${lambda}$ 倍，所以有两个线性无关的特征向量。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: expectedGeoMult,
          solution,
          mistakes: [
            hasExtraPivot
              ? why(
                  2,
                  `That is the algebraic multiplicity; the entry $${a}$ above the diagonal makes $A${shiftStr}$ rank $2$, leaving one free variable.`,
                  `这是代数重数；对角线上方的元素 $${a}$ 使 $A${shiftStr}$ 的秩为 $2$，只剩一个自由变量。`,
                )
              : why(
                  1,
                  `With a zero above the diagonal, $A${shiftStr}$ has rank $1$, so two variables are free.`,
                  `对角线上方为零时，$A${shiftStr}$ 的秩为 $1$，所以有两个自由变量。`,
                ),
            why(
              rank,
              "That is the rank of $A - \\lambda I$; the geometric multiplicity is $3$ minus the rank.",
              "这是 $A - \\lambda I$ 的秩；几何重数是 $3$ 减去秩。",
            ),
            why(
              3,
              `The third row of $A${shiftStr}$ is not zero, since $${mu} \\ne ${lambda}$.`,
              `$A${shiftStr}$ 的第三行不为零，因为 $${mu} \\ne ${lambda}$。`,
            ),
            why(0, "Every eigenvalue has at least one eigenvector.", "每个特征值至少有一个特征向量。"),
          ].filter((w, i, all) => w.value !== expectedGeoMult && all.findIndex((o) => o.value === w.value) === i),
        });
      },
    },
    {
      id: "the-simple-eigenvector-beside-a-repeated-eigenvalue",
      title: t("The eigenvector of a simple eigenvalue beside a repeated one", "重特征值旁单特征值的特征向量"),
      explanation: t(
        "When $A$ has a repeated eigenvalue $\\lambda$ and a simple eigenvalue $\\mu$, the eigenvector for $\\mu$ is still found by solving $(A - \\mu I)\\mathbf{v} = \\mathbf{0}$. For an upper triangular $A$ with $\\mu$ in the last diagonal position, set $x_3 = 1$ and back-substitute: each row above gives one more coordinate, divided by $\\mu - \\lambda$. For example, for $A = \\begin{pmatrix} 1 & 1 & 0 \\\\ 0 & 1 & 2 \\\\ 0 & 0 & 3 \\end{pmatrix}$ and $\\mu = 3$, the second row gives $-2x_2 + 2 = 0$, so $x_2 = 1$, and the first gives $-2x_1 + 1 = 0$, so $x_1 = \\frac{1}{2}$.\n\n> **Watch out.** Solve the second row before the first: the first row contains $x_2$, so its term $a_{12}x_2$ must be included before dividing.",
        "当 $A$ 有重特征值 $\\lambda$ 和单特征值 $\\mu$ 时，$\\mu$ 的特征向量仍由解 $(A - \\mu I)\\mathbf{v} = \\mathbf{0}$ 得到。对 $\\mu$ 位于最后一个对角位置的上三角矩阵 $A$，令 $x_3 = 1$ 并回代：上面每一行给出一个坐标，要除以 $\\mu - \\lambda$。例如 $A = \\begin{pmatrix} 1 & 1 & 0 \\\\ 0 & 1 & 2 \\\\ 0 & 0 & 3 \\end{pmatrix}$，$\\mu = 3$ 时，第二行给出 $-2x_2 + 2 = 0$，所以 $x_2 = 1$；第一行给出 $-2x_1 + 1 = 0$，所以 $x_1 = \\frac{1}{2}$。\n\n> **注意。** 先解第二行，再解第一行：第一行含有 $x_2$，除之前必须把 $a_{12}x_2$ 这一项算进去。",
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
        const row1 = Q.of(lam).mul(x1).add(Q.of(c).mul(x2)).add(Q.of(a));
        const row2 = Q.of(lam).mul(x2).add(Q.of(b));
        const answer = vectorLatex([x1, x2, 1]);
        return withMistakes(
          pointProblem({
            prompt: t(
              `Find the eigenvector $\\langle x_1, x_2, 1 \\rangle$ of $A = ${mat3Latex(M)}$ for $\\lambda = ${mu}$.`,
              `求 $A = ${mat3Latex(M)}$ 对应于 $\\lambda = ${mu}$ 的特征向量 $\\langle x_1, x_2, 1 \\rangle$。`,
            ),
            answer: [x1, x2, 1],
            vector: true,
            vars: ["x_1", "x_2", "x_3"],
            solution: walked(
              [
                [
                  ["Subtract $\\mu I$", "减去 $\\mu I$"],
                  t("", ""),
                  [
                    `A - ${paren(mu)}I = ${mat3Latex([
                      [-g, c, a],
                      [0, -g, b],
                      [0, 0, 0],
                    ])}`,
                  ],
                ],
                [
                  ["Solve the second row", "解第二行"],
                  t("With $x_3 = 1$:", "取 $x_3 = 1$："),
                  [`${poly([-g, "x_2"], [b, ""])} = 0`, `x_2 = ${x2.toLatex()}`],
                ],
                [
                  ["Solve the first row", "解第一行"],
                  t("Substitute $x_2$:", "代入 $x_2$："),
                  [`${poly([-g, "x_1"])} + ${paren(c)} \\cdot ${paren(x2)} + ${paren(a)} = 0`, `x_1 = ${x1.toLatex()}`],
                ],
              ],
              t(
                `The first two entries of $A\\mathbf{v}$ are $${row1.toLatex()} = ${mu} \\cdot ${paren(x1)}$ and $${row2.toLatex()} = ${mu} \\cdot ${paren(x2)}$, and the third is $${mu}$, so $A\\mathbf{v} = ${mu}\\mathbf{v}$.`,
                `$A\\mathbf{v}$ 的前两个元素为 $${row1.toLatex()} = ${mu} \\cdot ${paren(x1)}$ 和 $${row2.toLatex()} = ${mu} \\cdot ${paren(x2)}$，第三个为 $${mu}$，所以 $A\\mathbf{v} = ${mu}\\mathbf{v}$。`,
              ),
            ),
          }),
          dedupeSaid(
            [
              say(
                vectorLatex([x1.neg(), x2.neg(), 1]),
                `The signs are flipped: the rows divide by $\\mu - \\lambda = ${g}$, not by $\\lambda - \\mu$.`,
                `符号反了：各行要除以 $\\mu - \\lambda = ${g}$，而不是 $\\lambda - \\mu$。`,
              ),
              say(
                vectorLatex([Q.of(a, g), x2, 1]),
                `The first row also contains $${paren(c)}x_2$; include it before dividing.`,
                `第一行还含有 $${paren(c)}x_2$；除之前要把它算进去。`,
              ),
              say(vectorLatex([x1, x2, 0]), "The question fixes $x_3 = 1$.", "题目要求 $x_3 = 1$。"),
            ],
            answer,
          ),
        );
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 2 & 4 \\\\ 1 & 2 \\end{pmatrix}$ has trace $4$ and determinant $0$, so its eigenvalues are $0$ and $4$. Because $0$ is an eigenvalue, some nonzero vector is sent to zero: $A\\langle 2, -1 \\rangle = \\langle 0, 0 \\rangle$. So $A$ is not invertible.\n\nCheck: $\\det A = 2 \\cdot 2 - 4 \\cdot 1 = 0$, which is the product of the eigenvalues $0 \\cdot 4$.\n\nIn this lesson we decide invertibility from the eigenvalues, and find the eigenvalues and determinant of an inverse from those of the matrix.",
    "矩阵 $A = \\begin{pmatrix} 2 & 4 \\\\ 1 & 2 \\end{pmatrix}$ 的迹为 $4$，行列式为 $0$，所以特征值为 $0$ 和 $4$。因为 $0$ 是特征值，某个非零向量被映为零：$A\\langle 2, -1 \\rangle = \\langle 0, 0 \\rangle$。所以 $A$ 不可逆。\n\n检验：$\\det A = 2 \\cdot 2 - 4 \\cdot 1 = 0$，正是特征值之积 $0 \\cdot 4$。\n\n本课我们由特征值判断可逆性，并由矩阵的特征值求出其逆矩阵的特征值和行列式。",
  ),
  prerequisites: ["calculating-the-eigenvectors-of-a-3x3-matrix-in-the-general-case"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "zero-eigenvalue-invertibility-test",
      title: t("Zero Eigenvalue Invertibility Test", "零特征值可逆性判据"),
      explanation: t(
        "Zero is an eigenvalue exactly when some nonzero vector is sent to zero, which is exactly when the matrix fails to be invertible. When $A$ is invertible, every eigenvalue $\\lambda$ is nonzero, and $A^{-1}$ has the same eigenvectors with eigenvalue $\\frac{1}{\\lambda}$. For example, if $A\\mathbf{v} = 4\\mathbf{v}$, then $A^{-1}\\mathbf{v} = \\frac{1}{4}\\mathbf{v}$.\n\n> **Watch out.** Inverting a matrix inverts its eigenvalues: the answer is the reciprocal $\\frac{1}{\\lambda}$, not the opposite $-\\lambda$, and the eigenvector stays the same.",
        "零是特征值当且仅当某个非零向量被映射到零，而这正是矩阵不可逆的情形。当 $A$ 可逆时，每个特征值 $\\lambda$ 都不为零，$A^{-1}$ 有相同的特征向量，特征值为 $\\frac{1}{\\lambda}$。例如若 $A\\mathbf{v} = 4\\mathbf{v}$，则 $A^{-1}\\mathbf{v} = \\frac{1}{4}\\mathbf{v}$。\n\n> **注意。** 求逆会把特征值取倒数：答案是倒数 $\\frac{1}{\\lambda}$，而不是相反数 $-\\lambda$，特征向量保持不变。",
      ),
      generate: (rng: Rng): Problem => {
        const l1 = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9])!;
        const n = rng.int(2, 6);
        const prompt = t(
          `Let $A$ be an invertible $${n} \\times ${n}$ matrix with known eigenvalue $\\lambda = ${l1}$. What is the corresponding eigenvalue of $A^{-1}$?`,
          `设 $A$ 为可逆的 $${n} \\times ${n}$ 矩阵，已知其具有特征值 $\\lambda = ${l1}$。求 $A^{-1}$ 对应的特征值。`,
        );
        const ans = Q.of(1, l1);
        return numberProblem({
          prompt,
          answer: ans,
          mistakes: (
            [
              [
                Q.of(-1, l1),
                "The sign is wrong: the reciprocal of a number has the same sign as the number.",
                "符号错了：一个数的倒数与它同号。",
              ],
              [
                Q.of(l1),
                "That is the eigenvalue of $A$; the eigenvalue of $A^{-1}$ is its reciprocal.",
                "这是 $A$ 的特征值；$A^{-1}$ 的特征值是它的倒数。",
              ],
              [
                Q.of(-l1),
                "That is the opposite; inverting the matrix takes the reciprocal of the eigenvalue.",
                "这是相反数；求逆矩阵要取特征值的倒数。",
              ],
              [
                Q.zero,
                "An invertible matrix never has the eigenvalue $0$, and neither does its inverse.",
                "可逆矩阵从不以 $0$ 为特征值，它的逆矩阵也不会。",
              ],
            ] as const
          )
            .filter(([v], i, all) => !v.eq(ans) && all.findIndex(([o]) => o.eq(v)) === i)
            .map(([v, en, zh]) => why(v, en, zh)),
          solution: walked(
            [
              [
                ["Apply $A^{-1}$ to both sides", "两边同乘 $A^{-1}$"],
                t(`Start from $A\\mathbf{v} = ${l1}\\mathbf{v}$:`, `从 $A\\mathbf{v} = ${l1}\\mathbf{v}$ 出发：`),
                [`\\mathbf{v} = ${l1}A^{-1}\\mathbf{v}`],
              ],
              [
                ["Divide by the eigenvalue", "除以特征值"],
                t(`Since $${l1} \\ne 0$:`, `因为 $${l1} \\ne 0$：`),
                [`A^{-1}\\mathbf{v} = ${ans.toLatex()}\\mathbf{v}`],
              ],
            ],
            t(
              `$A(A^{-1}\\mathbf{v}) = ${ans.toLatex()} \\cdot ${l1}\\mathbf{v} = \\mathbf{v}$, as it must be.`,
              `$A(A^{-1}\\mathbf{v}) = ${ans.toLatex()} \\cdot ${l1}\\mathbf{v} = \\mathbf{v}$，正应如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-determinant-of-an-inverse-from-eigenvalues",
      title: t("The determinant of an inverse from eigenvalues", "由特征值求逆矩阵的行列式"),
      explanation: t(
        "The determinant of a matrix is the product of its eigenvalues, so $A$ is invertible exactly when $0$ is not an eigenvalue. The eigenvalues of $A^{-1}$ are the reciprocals $\\frac{1}{\\lambda_i}$, with the same eigenvectors, so\n\n$$\\det(A^{-1}) = \\frac{1}{\\lambda_1\\lambda_2\\lambda_3} = \\frac{1}{\\det A}.$$\n\nFor example, eigenvalues $2$, $-1$ and $3$ give $\\det A = -6$ and $\\det(A^{-1}) = -\\frac{1}{6}$.\n\n> **Watch out.** Multiply the eigenvalues, do not add them: the sum is the trace. Keep the sign, which is negative when an odd number of eigenvalues are negative.",
        "矩阵的行列式等于其特征值之积，所以 $A$ 可逆当且仅当 $0$ 不是特征值。$A^{-1}$ 的特征值是倒数 $\\frac{1}{\\lambda_i}$，特征向量相同，所以\n\n$$\\det(A^{-1}) = \\frac{1}{\\lambda_1\\lambda_2\\lambda_3} = \\frac{1}{\\det A}.$$\n\n例如特征值 $2$、$-1$ 和 $3$ 给出 $\\det A = -6$，$\\det(A^{-1}) = -\\frac{1}{6}$。\n\n> **注意。** 要把特征值相乘，而不是相加：和是迹。保留符号，负特征值的个数为奇数时结果为负。",
      ),
      generate(rng: Rng): Problem {
        const nz = (): number => rng.int(1, 5) * rng.pick([-1, 1]);
        const [l1, l2, l3] = [nz(), nz(), nz()];
        const prod = l1 * l2 * l3;
        const sum = l1 + l2 + l3;
        const ans = Q.of(1, prod);
        const recips = [l1, l2, l3].map((l) => Q.of(1, l));
        return numberProblem({
          prompt: t(
            `A $3 \\times 3$ matrix $A$ has eigenvalues $${l1}$, $${l2}$ and $${l3}$. Find $\\det(A^{-1})$.`,
            `$3 \\times 3$ 矩阵 $A$ 的特征值为 $${l1}$、$${l2}$ 和 $${l3}$。求 $\\det(A^{-1})$。`,
          ),
          answer: ans,
          mistakes: (
            [
              [
                Q.of(prod),
                "That is $\\det A$; the determinant of the inverse is its reciprocal.",
                "这是 $\\det A$；逆矩阵的行列式是它的倒数。",
              ],
              ...(sum === 0
                ? []
                : ([
                    [
                      Q.of(1, sum),
                      "That uses the sum of the eigenvalues, which is the trace; the determinant is their product.",
                      "这用了特征值之和，即迹；行列式是它们的积。",
                    ],
                  ] as const)),
              [ans.neg(), "The sign is wrong: count the negative eigenvalues in the product.", "符号错了：数一数乘积中负特征值的个数。"],
            ] as const
          )
            .filter(([v], i, all) => !v.eq(ans) && all.findIndex(([o]) => o.eq(v)) === i)
            .map(([v, en, zh]) => why(v, en, zh)),
          solution: walked(
            [
              [
                ["Multiply the eigenvalues", "把特征值相乘"],
                t("", ""),
                [`\\det A = ${l1} \\cdot ${paren(l2)} \\cdot ${paren(l3)} = ${prod}`],
              ],
              [["Take the reciprocal", "取倒数"], t("", ""), [`\\det(A^{-1}) = \\frac{1}{\\det A} = ${ans.toLatex()}`]],
            ],
            t(
              `The eigenvalues of $A^{-1}$ are $${recips.map((r) => r.toLatex()).join("$, $")}$, and their product is $${recips[0]!.mul(recips[1]!).mul(recips[2]!).toLatex()}$, the same value.`,
              `$A^{-1}$ 的特征值为 $${recips.map((r) => r.toLatex()).join("$、$")}$，其积为 $${recips[0]!.mul(recips[1]!).mul(recips[2]!).toLatex()}$，结果相同。`,
            ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 3 \\end{pmatrix}$ has eigenvalues $1$ and $3$. For $1$ the eigenvector is $(1, 0)$; for $3$, the matrix $A - 3I = \\begin{pmatrix} -2 & 2 \\\\ 0 & 0 \\end{pmatrix}$ gives $(1, 1)$. Putting these as columns gives $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ and $D = \\begin{pmatrix} 1 & 0 \\\\ 0 & 3 \\end{pmatrix}$, so $A = PDP^{-1}$.\n\nCheck: $AP = \\begin{pmatrix} 1 & 3 \\\\ 0 & 3 \\end{pmatrix}$ and $PD = \\begin{pmatrix} 1 & 3 \\\\ 0 & 3 \\end{pmatrix}$, the same matrix.\n\nIn this lesson we diagonalize a $2 \\times 2$ matrix by putting its eigenvectors into $P$ and its eigenvalues into $D$ in the same order, and we multiply $PDP^{-1}$ back out to recover the matrix.",
    "矩阵 $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 3 \\end{pmatrix}$ 的特征值为 $1$ 和 $3$。对 $1$，特征向量是 $(1, 0)$；对 $3$，矩阵 $A - 3I = \\begin{pmatrix} -2 & 2 \\\\ 0 & 0 \\end{pmatrix}$ 给出 $(1, 1)$。把它们作为列，得 $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$，$D = \\begin{pmatrix} 1 & 0 \\\\ 0 & 3 \\end{pmatrix}$，于是 $A = PDP^{-1}$。\n\n检验：$AP = \\begin{pmatrix} 1 & 3 \\\\ 0 & 3 \\end{pmatrix}$，$PD = \\begin{pmatrix} 1 & 3 \\\\ 0 & 3 \\end{pmatrix}$，是同一个矩阵。\n\n本课我们把 $2 \\times 2$ 矩阵的特征向量放进 $P$、特征值按相同顺序放进 $D$ 来对角化它，并把 $PDP^{-1}$ 乘出来还原矩阵。",
  ),
  prerequisites: ["invertible-matrix-theorem-in-terms-of-eigenvalues"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "factorization-a-equals-pdp-inv-2x2",
      title: t("Factorization A = PDP^{-1} for 2x2 Matrices", "2x2 矩阵的 A = PDP^{-1} 分解"),
      explanation: t(
        "Put the eigenvectors as the columns of one matrix and the matching eigenvalues on the diagonal of another, keeping them in the same order. Form $P$ and $D$ such that $A = PDP^{-1}$ for a diagonalizable $2 \\times 2$ matrix. For example, $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 4 \\end{pmatrix}$ has eigenvectors $(1, 0)$ for $2$ and $(1, 2)$ for $4$, so $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 2 \\end{pmatrix}$ and $D = \\begin{pmatrix} 2 & 0 \\\\ 0 & 4 \\end{pmatrix}$.\n\n> **Watch out.** The $j$th column of $P$ must be an eigenvector for the $j$th diagonal entry of $D$. Swapping the columns of $P$ without swapping the entries of $D$ breaks $AP = PD$.",
        "把特征向量作为一个矩阵的列，把对应的特征值放在另一个矩阵的对角线上，并保持相同的顺序。构造矩阵 $P$ 与 $D$，使得可对角化的 $2 \\times 2$ 矩阵满足 $A = PDP^{-1}$。例如 $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 4 \\end{pmatrix}$ 对 $2$ 有特征向量 $(1, 0)$，对 $4$ 有特征向量 $(1, 2)$，所以 $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 2 \\end{pmatrix}$，$D = \\begin{pmatrix} 2 & 0 \\\\ 0 & 4 \\end{pmatrix}$。\n\n> **注意。** $P$ 的第 $j$ 列必须是 $D$ 的第 $j$ 个对角元的特征向量。只交换 $P$ 的列而不交换 $D$ 的对角元，$AP = PD$ 就不成立。",
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
        const both = (P: Mat2, D: Mat2) =>
          t(`$P = ${mat2Latex(P)}, \\; D = ${mat2Latex(D)}$`, `$P = ${mat2Latex(P)}, \\; D = ${mat2Latex(D)}$`);
        const wrong = [
          both(
            [
              [p12, p11],
              [p22, p21],
            ],
            matD,
          ),
          both(
            [
              [1, 0],
              [0, 1],
            ],
            matA,
          ),
          both(matP, [
            [l2, 0],
            [0, l1],
          ]),
          both(
            [
              [p21, p11],
              [p22, p12],
            ],
            matD,
          ),
        ];
        const solution = walked(
          [
            [
              ["Read the eigenvalues", "读出特征值"],
              t(
                `$A$ is triangular, so its eigenvalues are its diagonal entries $${l1}$ and $${l2}$.`,
                `$A$ 是三角矩阵，所以特征值是对角元 $${l1}$ 和 $${l2}$。`,
              ),
            ],
            [
              ["Find the eigenvectors", "求特征向量"],
              t(
                `For $${l1}$, $A - ${l1}I$ has zero first column, so $v_1 = (1, 0)$. For $${l2}$, $A - ${l2}I = ${mat2Latex([
                  [l1 - l2, b],
                  [0, 0],
                ])}$ gives $${poly([l1 - l2, "x_1"], [b, "x_2"])} = 0$, so $v_2 = (${p12}, ${p22})$.`,
                `对 $${l1}$，$A - ${l1}I$ 的第一列为零，所以 $v_1 = (1, 0)$。对 $${l2}$，$A - ${l2}I = ${mat2Latex([
                  [l1 - l2, b],
                  [0, 0],
                ])}$ 给出 $${poly([l1 - l2, "x_1"], [b, "x_2"])} = 0$，所以 $v_2 = (${p12}, ${p22})$。`,
              ),
            ],
            [
              ["Assemble $P$ and $D$", "组成 $P$ 和 $D$"],
              t(
                `Put $v_1, v_2$ as the columns of $P = ${mat2Latex(matP)}$ and $${l1}, ${l2}$ in the same order on the diagonal of $D$.`,
                `把 $v_1, v_2$ 作为 $P = ${mat2Latex(matP)}$ 的列，把 $${l1}, ${l2}$ 按相同顺序放在 $D$ 的对角线上。`,
              ),
            ],
          ],
          t(
            `$Av_2 = (${b * l2}, ${l2 * p22}) = ${l2}v_2$ and $Av_1 = ${l1}v_1$, so $AP = PD$.`,
            `$Av_2 = (${b * l2}, ${l2 * p22}) = ${l2}v_2$，$Av_1 = ${l1}v_1$，所以 $AP = PD$。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The columns of $P$ are swapped but $D$ is not, so each column no longer matches its eigenvalue.",
            "$P$ 的两列交换了而 $D$ 没有，所以每一列与其特征值不再对应。",
          ],
          [
            wrong[1]!.en,
            "$D$ must be diagonal, but $A$ has a nonzero entry off the diagonal.",
            "$D$ 必须是对角矩阵，但 $A$ 在对角线外有非零元。",
          ],
          [
            wrong[2]!.en,
            `The eigenvalues are in the wrong order: the first column $(1, 0)$ belongs to $${l1}$.`,
            `特征值的顺序错了：第一列 $(1, 0)$ 对应 $${l1}$。`,
          ],
          [
            wrong[3]!.en,
            `The first column $(0, ${p22})$ is not an eigenvector: $A$ sends it to $(${b * p22}, ${l2 * p22})$.`,
            `第一列 $(0, ${p22})$ 不是特征向量：$A$ 把它映为 $(${b * p22}, ${l2 * p22})$。`,
          ],
        ]);
      },
    },
    {
      id: "rebuilding-a-matrix-from-its-diagonalization",
      title: t("Rebuilding a matrix from its diagonalization", "由对角化还原矩阵"),
      explanation: t(
        "If $P$ has eigenvectors as columns and $D$ holds the matching eigenvalues, then $A = PDP^{-1}$. Multiplying out recovers $A$: first $PD$ scales each column of $P$ by its eigenvalue, then multiplying by $P^{-1}$ on the right gives $A$. For $P = \\begin{pmatrix} 1 & k \\\\ j & 1 + jk \\end{pmatrix}$, which has determinant $1$, $P^{-1} = \\begin{pmatrix} 1 + jk & -k \\\\ -j & 1 \\end{pmatrix}$. For example, $P = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$ and $D = \\operatorname{diag}(2, 3)$ give $PD = \\begin{pmatrix} 2 & 3 \\\\ 2 & 6 \\end{pmatrix}$ and $A = PD \\begin{pmatrix} 2 & -1 \\\\ -1 & 1 \\end{pmatrix} = \\begin{pmatrix} 1 & 1 \\\\ -2 & 4 \\end{pmatrix}$, with trace $5 = 2 + 3$.\n\n> **Watch out.** $PD$ is not yet $A$: it still has to be multiplied by $P^{-1}$ on the right. The diagonal entries of $A$ are not the eigenvalues unless $A$ is diagonal.",
        "若 $P$ 以特征向量为列，$D$ 含有对应的特征值，则 $A = PDP^{-1}$。乘出来就能还原 $A$：先用 $PD$ 把 $P$ 的每一列乘以其特征值，再右乘 $P^{-1}$ 得到 $A$。对行列式为 $1$ 的 $P = \\begin{pmatrix} 1 & k \\\\ j & 1 + jk \\end{pmatrix}$，$P^{-1} = \\begin{pmatrix} 1 + jk & -k \\\\ -j & 1 \\end{pmatrix}$。例如 $P = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$，$D = \\operatorname{diag}(2, 3)$ 给出 $PD = \\begin{pmatrix} 2 & 3 \\\\ 2 & 6 \\end{pmatrix}$，$A = PD \\begin{pmatrix} 2 & -1 \\\\ -1 & 1 \\end{pmatrix} = \\begin{pmatrix} 1 & 1 \\\\ -2 & 4 \\end{pmatrix}$，迹为 $5 = 2 + 3$。\n\n> **注意。** $PD$ 还不是 $A$：还要右乘 $P^{-1}$。除非 $A$ 是对角矩阵，否则 $A$ 的对角元不是特征值。",
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
        const Pinv: Mat2 = [
          [1 + j * k, -k],
          [-j, 1],
        ];
        const i = rng.int(0, 1);
        const c = rng.int(0, 1);
        const swapped = fromEigen2(l2, l1, j, k);
        const answer = A[i]![c]!;
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
          answer,
          mistakes: [
            why(swapped[i]![c]!, "The eigenvalues are matched with the wrong columns of $P$.", "特征值与 $P$ 的列配错了。"),
            why(
              PD[i]![c]!,
              "That is an entry of $PD$; it still has to be multiplied by $P^{-1}$ on the right.",
              "这是 $PD$ 的元素；还要右乘 $P^{-1}$。",
            ),
            i === c
              ? why(
                  i === 0 ? l1 : l2,
                  "That is an eigenvalue; the diagonal entries of $A$ equal the eigenvalues only when $A$ is diagonal.",
                  "这是特征值；只有 $A$ 是对角矩阵时，其对角元才等于特征值。",
                )
              : why(
                  0,
                  "$A$ is not diagonal, so its entries off the diagonal need not be zero.",
                  "$A$ 不是对角矩阵，所以对角线外的元不一定为零。",
                ),
          ].filter((w, n, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === n),
          solution: walked(
            [
              [["Scale the columns of $P$", "缩放 $P$ 的列"], t("", ""), [`PD = ${mat2Latex(PD)}`]],
              [["Invert $P$", "求 $P^{-1}$"], t("$\\det P = 1$, so:", "$\\det P = 1$，所以："), [`P^{-1} = ${mat2Latex(Pinv)}`]],
              [
                ["Multiply row by column", "行乘列"],
                t(
                  `Row $${i + 1}$ of $PD$ times column $${c + 1}$ of $P^{-1}$:`,
                  `$PD$ 的第 $${i + 1}$ 行乘以 $P^{-1}$ 的第 $${c + 1}$ 列：`,
                ),
                [`${PD[i]![0]!} \\cdot ${paren(Pinv[0][c]!)} + ${paren(PD[i]![1]!)} \\cdot ${paren(Pinv[1][c]!)} = ${answer}`],
              ],
            ],
            t(
              `The whole matrix is $A = ${mat2Latex(A)}$, whose trace $${A[0][0]} + ${paren(A[1][1])} = ${A[0][0] + A[1][1]}$ equals $${l1} + ${paren(l2)}$, the sum of the eigenvalues.`,
              `整个矩阵为 $A = ${mat2Latex(A)}$，其迹 $${A[0][0]} + ${paren(A[1][1])} = ${A[0][0] + A[1][1]}$ 等于特征值之和 $${l1} + ${paren(l2)}$。`,
            ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$ is $PDP^{-1}$ with $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ and $D = \\operatorname{diag}(2, 3)$. In $A^3 = PDP^{-1}PDP^{-1}PDP^{-1}$ the inner factors cancel, so $A^3 = PD^3P^{-1}$ with $D^3 = \\operatorname{diag}(8, 27)$, which gives $A^3 = \\begin{pmatrix} 8 & 19 \\\\ 0 & 27 \\end{pmatrix}$.\n\nCheck: $A^2 = \\begin{pmatrix} 4 & 5 \\\\ 0 & 9 \\end{pmatrix}$, and $A^2A = \\begin{pmatrix} 8 & 4 + 15 \\\\ 0 & 27 \\end{pmatrix}$, the same matrix.\n\nIn this lesson we use a diagonalization to compute powers of a matrix by raising only its eigenvalues to the power.",
    "矩阵 $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$ 等于 $PDP^{-1}$，其中 $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$，$D = \\operatorname{diag}(2, 3)$。在 $A^3 = PDP^{-1}PDP^{-1}PDP^{-1}$ 中，中间的因子相互抵消，所以 $A^3 = PD^3P^{-1}$，$D^3 = \\operatorname{diag}(8, 27)$，得 $A^3 = \\begin{pmatrix} 8 & 19 \\\\ 0 & 27 \\end{pmatrix}$。\n\n检验：$A^2 = \\begin{pmatrix} 4 & 5 \\\\ 0 & 9 \\end{pmatrix}$，$A^2A = \\begin{pmatrix} 8 & 4 + 15 \\\\ 0 & 27 \\end{pmatrix}$，是同一个矩阵。\n\n本课我们利用对角化，只把特征值取幂，来计算矩阵的幂。",
  ),
  prerequisites: ["diagonalizing-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "computing-matrix-powers-diagonalization",
      title: t("Computing Matrix Powers via Diagonalization", "通过对角化计算矩阵幂"),
      explanation: t(
        "In the factorization the inner factors cancel when multiplied repeatedly, so only the diagonal matrix is raised to the power, which just raises each entry. Apply $A^k = P D^k P^{-1}$ to compute high powers of a diagonalizable matrix. For example, $D = \\operatorname{diag}(2, -1)$ gives $D^3 = \\operatorname{diag}(8, -1)$.\n\n> **Watch out.** Raise each diagonal entry to the power; do not multiply it by the exponent. The entries stay in their places, and $P$ and $P^{-1}$ are not raised to the power.",
        "在分解式中反复相乘时，中间的因子相互抵消，所以只需对对角矩阵求幂，也就是对每个对角元素求幂。应用 $A^k = P D^k P^{-1}$ 计算可对角化矩阵的高次幂。例如 $D = \\operatorname{diag}(2, -1)$ 给出 $D^3 = \\operatorname{diag}(8, -1)$。\n\n> **注意。** 要把每个对角元取幂，而不是乘以指数。各元素位置不变，$P$ 和 $P^{-1}$ 不取幂。",
      ),
      generate: (rng: Rng): Problem => {
        const l1 = rng.int(2, 4);
        const l2 = rng.pick([-3, -2, 5])!;
        const k = rng.int(3, 7);
        const base2 = l2 < 0 ? `(${l2})` : `${l2}`;
        const prompt = t(
          `If a matrix $A$ is diagonalized as $A = P D P^{-1}$ with $D = \\begin{pmatrix} ${l1} & 0 \\\\ 0 & ${l2} \\end{pmatrix}$, what is the diagonal matrix $D^{${k}}$ used in computing $A^{${k}} = P D^{${k}} P^{-1}$?`,
          `若矩阵 $A$ 可对角化为 $A = P D P^{-1}$，其中 $D = \\begin{pmatrix} ${l1} & 0 \\\\ 0 & ${l2} \\end{pmatrix}$，求计算 $A^{${k}} = P D^{${k}} P^{-1}$ 时所用的对角矩阵 $D^{${k}}$。`,
        );
        const diag = (x: string | number, y: string | number) => {
          const s = `$\\begin{pmatrix} ${x} & 0 \\\\ 0 & ${y} \\end{pmatrix}$`;
          return t(s, s);
        };
        const right = diag(`${l1}^{${k}}`, `${base2}^{${k}}`);
        const wrong = [diag(k * l1, k * l2), diag(l1, l2), diag(`${base2}^{${k}}`, `${l1}^{${k}}`), diag(l1 + k, l2 + k)];
        const solution = walked(
          [
            [
              ["Cancel the inner factors", "消去中间的因子"],
              t(
                `In $(PDP^{-1})^{${k}}$ each $P^{-1}P$ in the middle is $I$, so only $D$ is multiplied by itself $${k}$ times.`,
                `在 $(PDP^{-1})^{${k}}$ 中，中间的每个 $P^{-1}P$ 都是 $I$，所以只有 $D$ 自乘 $${k}$ 次。`,
              ),
            ],
            [
              ["Raise each diagonal entry", "把每个对角元取幂"],
              t("A product of diagonal matrices multiplies matching diagonal entries:", "对角矩阵相乘时，对应的对角元相乘："),
              [`D^{${k}} = \\begin{pmatrix} ${l1}^{${k}} & 0 \\\\ 0 & ${base2}^{${k}} \\end{pmatrix}`],
            ],
          ],
          t(
            `The entries are $${l1 ** k}$ and $${l2 ** k}$; for $k = 2$ the same rule gives $D^2 = \\operatorname{diag}(${l1 * l1}, ${l2 * l2})$, which matches multiplying $D$ by itself.`,
            `这两个元素为 $${l1 ** k}$ 和 $${l2 ** k}$；对 $k = 2$，同样的规则给出 $D^2 = \\operatorname{diag}(${l1 * l1}, ${l2 * l2})$，与 $D$ 自乘的结果一致。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "Each entry is multiplied by the exponent; a power multiplies the entry by itself.",
            "每个元素乘以了指数；取幂是把元素自乘。",
          ],
          [wrong[1]!.en, "That is $D$ itself, not its power.", "这是 $D$ 本身，不是它的幂。"],
          [wrong[2]!.en, "The entries changed places; each stays in its own position.", "两个元素交换了位置；每个元素都留在原位。"],
          [
            wrong[3]!.en,
            "The exponent is added to each entry; a power multiplies the entry by itself.",
            "这把指数加到了每个元素上；取幂是把元素自乘。",
          ],
        ]);
      },
    },
    {
      id: "an-entry-of-a-power-through-diagonalization",
      title: t("An entry of a power through diagonalization", "通过对角化求幂的元素"),
      explanation: t(
        "Diagonalization turns powers into powers of numbers: $A^n = PD^nP^{-1}$, and $D^n$ just raises each eigenvalue to the $n$th power. For $A = \\begin{pmatrix} a & b - a \\\\ 0 & b \\end{pmatrix}$ the eigenvectors $(1, 0)$ and $(1, 1)$ give $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$, and\n\n$$A^n = \\begin{pmatrix} a^n & b^n - a^n \\\\ 0 & b^n \\end{pmatrix}.$$\n\nFor example, $a = 1$, $b = 2$ and $n = 3$ give the $(1, 2)$ entry $2^3 - 1^3 = 7$.\n\n> **Watch out.** The corner entry is $b^n - a^n$, not $(b - a)^n$: the power acts on the eigenvalues, not on the entries of $A$.",
        "对角化把矩阵的幂变成数的幂：$A^n = PD^nP^{-1}$，而 $D^n$ 只是把每个特征值取 $n$ 次方。对 $A = \\begin{pmatrix} a & b - a \\\\ 0 & b \\end{pmatrix}$，特征向量 $(1, 0)$ 和 $(1, 1)$ 给出 $P = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$，且\n\n$$A^n = \\begin{pmatrix} a^n & b^n - a^n \\\\ 0 & b^n \\end{pmatrix}.$$\n\n例如 $a = 1$，$b = 2$，$n = 3$ 给出 $(1, 2)$ 元 $2^3 - 1^3 = 7$。\n\n> **注意。** 右上角的元是 $b^n - a^n$，而不是 $(b - a)^n$：幂作用在特征值上，而不是 $A$ 的元素上。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 3);
        let b = rng.int(-3, 3);
        if (b === a) b = a + 1;
        const n = rng.int(3, 6);
        const ans = b ** n - a ** n;
        const P = mat2Latex([
          [1, 1],
          [0, 1],
        ]);
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
          mistakes: [
            why(
              (b - a) ** n,
              "That raises the entry $b - a$ itself to the power; the power acts on the eigenvalues.",
              "这把元素 $b - a$ 本身取了幂；幂作用在特征值上。",
            ),
            why(a ** n - b ** n, "The order is reversed: the entry is $b^n - a^n$.", "顺序反了：该元是 $b^n - a^n$。"),
            why(
              n * (b - a),
              "That multiplies the entry by the exponent; powers of a matrix do not work that way.",
              "这把元素乘以了指数；矩阵的幂不是这样算的。",
            ),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Diagonalize", "对角化"],
                t(
                  `The eigenvectors $(1, 0)$ for $${a}$ and $(1, 1)$ for $${b}$ give $P = ${P}$ and $D = \\operatorname{diag}(${a}, ${b})$.`,
                  `$${a}$ 的特征向量 $(1, 0)$ 和 $${b}$ 的特征向量 $(1, 1)$ 给出 $P = ${P}$，$D = \\operatorname{diag}(${a}, ${b})$。`,
                ),
              ],
              [
                ["Raise $D$ to the power", "把 $D$ 取幂"],
                t("Then $A^n = PD^nP^{-1}$:", "于是 $A^n = PD^nP^{-1}$："),
                [
                  `A^{${n}} = ${mat2StrLatex([
                    [`${paren(a)}^{${n}}`, `${paren(b)}^{${n}} - ${paren(a)}^{${n}}`],
                    ["0", `${paren(b)}^{${n}}`],
                  ])}`,
                ],
              ],
              [
                ["Evaluate the entry", "求该元"],
                t("", ""),
                [`${paren(b)}^{${n}} - ${paren(a)}^{${n}} = ${b ** n} - ${paren(a ** n)} = ${ans}`],
              ],
            ],
            t(
              `For $n = 2$ the same formula gives $${paren(b)}^2 - ${paren(a)}^2 = ${b * b - a * a}$, and the $(1, 2)$ entry of $A^2$ is $${paren(a)} \\cdot ${paren(b - a)} + ${paren(b - a)} \\cdot ${paren(b)} = ${b * b - a * a}$.`,
              `对 $n = 2$，同一公式给出 $${paren(b)}^2 - ${paren(a)}^2 = ${b * b - a * a}$，而 $A^2$ 的 $(1, 2)$ 元为 $${paren(a)} \\cdot ${paren(b - a)} + ${paren(b - a)} \\cdot ${paren(b)} = ${b * b - a * a}$。`,
            ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 1 & 1 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 3 \\end{pmatrix}$ has the distinct eigenvalues $1$, $2$ and $3$, with eigenvectors $(1, 0, 0)$, $(1, 1, 0)$ and $(0, 0, 1)$. So $P = \\begin{pmatrix} 1 & 1 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$ and $D = \\operatorname{diag}(1, 2, 3)$ give $A = PDP^{-1}$.\n\nCheck: $A(1, 1, 0) = (2, 2, 0) = 2(1, 1, 0)$, so the second column of $AP$ is $2$ times the second column of $P$, as in $PD$.\n\nIn this lesson we diagonalize $3 \\times 3$ matrices with three distinct eigenvalues, and use the diagonal form to find determinants of related matrices.",
    "矩阵 $A = \\begin{pmatrix} 1 & 1 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 3 \\end{pmatrix}$ 有互不相同的特征值 $1$、$2$、$3$，特征向量为 $(1, 0, 0)$、$(1, 1, 0)$、$(0, 0, 1)$。所以 $P = \\begin{pmatrix} 1 & 1 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$ 与 $D = \\operatorname{diag}(1, 2, 3)$ 给出 $A = PDP^{-1}$。\n\n检验：$A(1, 1, 0) = (2, 2, 0) = 2(1, 1, 0)$，所以 $AP$ 的第二列是 $P$ 第二列的 $2$ 倍，与 $PD$ 一致。\n\n本课我们对有三个互异特征值的 $3 \\times 3$ 矩阵进行对角化，并用对角形式求相关矩阵的行列式。",
  ),
  prerequisites: ["properties-of-diagonalization"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "diagonalizing-3x3-distinct-eigenvalues-kp",
      title: t("Diagonalizing 3x3 Matrices with Distinct Eigenvalues", "对角化具有相异特征值的 3x3 矩阵"),
      explanation: t(
        "Eigenvectors for distinct eigenvalues are always independent, so a three by three matrix with three distinct eigenvalues can always be diagonalized. Assemble the eigenvectors as the columns of $P$ so that $P^{-1} A P = D$. For example, if $Av_1 = 2v_1$, $Av_2 = -v_2$ and $Av_3 = 5v_3$, then $P = (v_1 \\; v_2 \\; v_3)$ gives $P^{-1}AP = \\operatorname{diag}(2, -1, 5)$.\n\n> **Watch out.** The eigenvalues sit on the diagonal in the same order as their eigenvectors in $P$, and every entry off the diagonal is $0$.",
        "属于不同特征值的特征向量总是线性无关的，所以有三个不同特征值的三阶矩阵总能对角化。将特征向量组合为 $P$ 的各列，使得 $P^{-1} A P = D$。例如若 $Av_1 = 2v_1$，$Av_2 = -v_2$，$Av_3 = 5v_3$，则 $P = (v_1 \\; v_2 \\; v_3)$ 给出 $P^{-1}AP = \\operatorname{diag}(2, -1, 5)$。\n\n> **注意。** 特征值在对角线上的顺序与其特征向量在 $P$ 中的顺序相同，对角线外的元全为 $0$。",
      ),
      generate: (rng: Rng): Problem => {
        const l1 = rng.int(1, 3);
        const l2 = rng.int(4, 6);
        const l3 = rng.int(-4, -1);
        const prompt = t(
          `A $3 \\times 3$ matrix $A$ has distinct eigenvalues $\\lambda_1 = ${l1}$, $\\lambda_2 = ${l2}$, and $\\lambda_3 = ${l3}$ with corresponding eigenvectors $v_1, v_2, v_3$. If $P = \\begin{pmatrix} v_1 & v_2 & v_3 \\end{pmatrix}$, what is $P^{-1} A P$?`,
          `$3 \\times 3$ 矩阵 $A$ 具有相异特征值 $\\lambda_1 = ${l1}$、$\\lambda_2 = ${l2}$ 与 $\\lambda_3 = ${l3}$，对应特征向量为 $v_1, v_2, v_3$。若 $P = \\begin{pmatrix} v_1 & v_2 & v_3 \\end{pmatrix}$，求 $P^{-1} A P$。`,
        );
        const m = (M: Mat3) => t(`$${mat3Latex(M)}$`, `$${mat3Latex(M)}$`);
        const D: Mat3 = [
          [l1, 0, 0],
          [0, l2, 0],
          [0, 0, l3],
        ];
        const right = m(D);
        const wrong = [
          m([
            [l3, 0, 0],
            [0, l2, 0],
            [0, 0, l1],
          ]),
          m([
            [l1, l2, l3],
            [0, 0, 0],
            [0, 0, 0],
          ]),
          m([
            [0, 0, l1],
            [0, l2, 0],
            [l3, 0, 0],
          ]),
          m([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
          ]),
        ];
        const solution = walked(
          [
            [
              ["Multiply $A$ by $P$ column by column", "逐列计算 $AP$"],
              t(
                `$AP = (Av_1 \\; Av_2 \\; Av_3) = (${l1}v_1 \\; ${l2}v_2 \\; ${l3}v_3) = PD$ with $D = \\operatorname{diag}(${l1}, ${l2}, ${l3})$.`,
                `$AP = (Av_1 \\; Av_2 \\; Av_3) = (${l1}v_1 \\; ${l2}v_2 \\; ${l3}v_3) = PD$，其中 $D = \\operatorname{diag}(${l1}, ${l2}, ${l3})$。`,
              ),
            ],
            [
              ["Multiply by $P^{-1}$", "左乘 $P^{-1}$"],
              t(
                "The eigenvectors are independent because the eigenvalues are distinct, so $P$ is invertible and:",
                "特征值互异，所以特征向量线性无关，$P$ 可逆，于是：",
              ),
              [`P^{-1}AP = ${mat3Latex(D)}`],
            ],
          ],
          t(
            `Similar matrices have the same trace, and $${l1} + ${l2} + ${paren(l3)} = ${l1 + l2 + l3}$ is the trace of $A$.`,
            `相似矩阵的迹相同，$${l1} + ${l2} + ${paren(l3)} = ${l1 + l2 + l3}$ 就是 $A$ 的迹。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The order is reversed: $v_1$ is the first column of $P$, so $\\lambda_1$ comes first.",
            "顺序反了：$v_1$ 是 $P$ 的第一列，所以 $\\lambda_1$ 排在最前。",
          ],
          [wrong[1]!.en, "The eigenvalues go on the diagonal, not across the first row.", "特征值应在对角线上，而不是排在第一行。"],
          [
            wrong[2]!.en,
            "The eigenvalues go on the main diagonal; the entries off it are all $0$.",
            "特征值应在主对角线上；其余元都为 $0$。",
          ],
          [
            wrong[3]!.en,
            "That would make $A = PIP^{-1} = I$; the diagonal holds the eigenvalues, not ones.",
            "那样会使 $A = PIP^{-1} = I$；对角线上是特征值，而不是 $1$。",
          ],
        ]);
      },
    },
    {
      id: "a-shifted-determinant-through-diagonalization",
      title: t("A shifted determinant through diagonalization", "通过对角化求平移后的行列式"),
      explanation: t(
        "If $A = PDP^{-1}$ with $D = \\operatorname{diag}(\\lambda_1, \\lambda_2, \\lambda_3)$, then $A + kI = P(D + kI)P^{-1}$, because $P(kI)P^{-1} = kI$. So $A + kI$ is diagonalized by the same $P$, with eigenvalues $\\lambda_i + k$, and\n\n$$\\det(A + kI) = (\\lambda_1 + k)(\\lambda_2 + k)(\\lambda_3 + k).$$\n\nThe determinant of a diagonalizable matrix is the product of its eigenvalues, so there is no need to form $A$ or multiply out any matrices. For example, $D = \\operatorname{diag}(1, 2, 3)$ and $k = 1$ give $\\det(A + I) = 2 \\cdot 3 \\cdot 4 = 24$.\n\n> **Watch out.** Add $k$ to each eigenvalue before multiplying; adding $k$ to $\\det A$ itself gives the wrong value. For $A - kI$ subtract $k$ instead.",
        "若 $A = PDP^{-1}$，$D = \\operatorname{diag}(\\lambda_1, \\lambda_2, \\lambda_3)$，则 $A + kI = P(D + kI)P^{-1}$，因为 $P(kI)P^{-1} = kI$。所以 $A + kI$ 由同一个 $P$ 对角化，特征值为 $\\lambda_i + k$，且\n\n$$\\det(A + kI) = (\\lambda_1 + k)(\\lambda_2 + k)(\\lambda_3 + k).$$\n\n可对角化矩阵的行列式等于其特征值之积，所以无需求出 $A$ 或做任何矩阵乘法。例如 $D = \\operatorname{diag}(1, 2, 3)$，$k = 1$ 给出 $\\det(A + I) = 2 \\cdot 3 \\cdot 4 = 24$。\n\n> **注意。** 先给每个特征值加上 $k$ 再相乘；把 $k$ 加到 $\\det A$ 上会得到错误的值。对 $A - kI$ 则是减去 $k$。",
      ),
      generate(rng: Rng): Problem {
        const l1 = rng.int(-4, 4);
        let l2 = rng.int(-4, 4);
        if (l2 === l1) l2 = l1 + 1;
        let l3 = rng.int(-4, 4);
        if (l3 === l1 || l3 === l2) l3 = Math.max(l1, l2) + 2;
        const k = rng.int(1, 3) * rng.pick([-1, 1]);
        const ans = (l1 + k) * (l2 + k) * (l3 + k);
        const shift = `A ${k < 0 ? "-" : "+"} ${Math.abs(k)}I`;
        const det = l1 * l2 * l3;
        return numberProblem({
          prompt: t(
            `A $3 \\times 3$ matrix is diagonalized as $A = PDP^{-1}$ with $D = \\operatorname{diag}(${l1}, ${l2}, ${l3})$. Find $\\det(${shift})$.`,
            `$3 \\times 3$ 矩阵对角化为 $A = PDP^{-1}$，$D = \\operatorname{diag}(${l1}, ${l2}, ${l3})$。求 $\\det(${shift})$。`,
          ),
          answer: ans,
          mistakes: [
            why(
              det + k,
              `That adds $${k}$ to $\\det A$; the shift is added to each eigenvalue.`,
              `这是把 $${k}$ 加到 $\\det A$ 上；平移应加到每个特征值上。`,
            ),
            why(
              det + k ** 3,
              "The product of sums is not the sum of the products; add the shift to each eigenvalue, then multiply.",
              "和的积不等于积的和；先给每个特征值加上平移量，再相乘。",
            ),
            why((l1 - k) * (l2 - k) * (l3 - k), "The shift has the wrong sign.", "平移的符号错了。"),
            why(det, "That is $\\det A$; the shift changes every eigenvalue.", "这是 $\\det A$；平移会改变每个特征值。"),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Shift the eigenvalues", "平移特征值"],
                t(
                  `$${shift} = P(D ${k < 0 ? "-" : "+"} ${Math.abs(k)}I)P^{-1}$, so its eigenvalues are $${l1 + k}$, $${l2 + k}$ and $${l3 + k}$.`,
                  `$${shift} = P(D ${k < 0 ? "-" : "+"} ${Math.abs(k)}I)P^{-1}$，所以它的特征值为 $${l1 + k}$、$${l2 + k}$ 和 $${l3 + k}$。`,
                ),
              ],
              [
                ["Multiply them", "把它们相乘"],
                t("", ""),
                [`\\det(${shift}) = ${l1 + k} \\cdot ${paren(l2 + k)} \\cdot ${paren(l3 + k)} = ${ans}`],
              ],
            ],
            t(
              `$\\det(P(D ${k < 0 ? "-" : "+"} ${Math.abs(k)}I)P^{-1}) = \\det P \\cdot \\det(D ${k < 0 ? "-" : "+"} ${Math.abs(k)}I) \\cdot \\frac{1}{\\det P}$, and the determinant of the diagonal matrix is the product of its diagonal entries, $${ans}$.`,
              `$\\det(P(D ${k < 0 ? "-" : "+"} ${Math.abs(k)}I)P^{-1}) = \\det P \\cdot \\det(D ${k < 0 ? "-" : "+"} ${Math.abs(k)}I) \\cdot \\frac{1}{\\det P}$，而对角矩阵的行列式是对角元之积 $${ans}$。`,
            ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 5 \\end{pmatrix}$ has the eigenvalue $2$ twice. But $A - 2I$ has rank $2$, so $2$ has only one independent eigenvector, and with the one for $5$ that makes two, one short of the three needed. So $A$ is not diagonalizable. Replacing the $1$ by $0$ makes $A - 2I$ rank $1$, and then $A$ is diagonal already.\n\nCheck: $A(0, 1, 0) = (1, 2, 0)$, which is not a multiple of $(0, 1, 0)$, so $(0, 1, 0)$ is not a second eigenvector for $2$.\n\nIn this lesson we decide whether a $3 \\times 3$ matrix with a repeated eigenvalue is diagonalizable, by comparing the geometric and algebraic multiplicity of each eigenvalue.",
    "矩阵 $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 5 \\end{pmatrix}$ 的特征值 $2$ 出现两次。但 $A - 2I$ 的秩为 $2$，所以 $2$ 只有一个线性无关的特征向量，加上 $5$ 的一个共两个，比所需的三个少一个。所以 $A$ 不可对角化。把 $1$ 换成 $0$，$A - 2I$ 的秩变为 $1$，此时 $A$ 本身就是对角矩阵。\n\n检验：$A(0, 1, 0) = (1, 2, 0)$，不是 $(0, 1, 0)$ 的倍数，所以 $(0, 1, 0)$ 不是 $2$ 的第二个特征向量。\n\n本课我们比较每个特征值的几何重数与代数重数，判断有重特征值的 $3 \\times 3$ 矩阵能否对角化。",
  ),
  prerequisites: ["diagonalizing-a-3x3-matrix-with-distinct-eigenvalues"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "diagonalizability-criterion-3x3",
      title: t("Diagonalizability Criterion for 3x3 Matrices", "3x3 矩阵可对角化判据"),
      explanation: t(
        "A matrix is diagonalizable when it has enough independent eigenvectors to form a basis, which fails if some repeated eigenvalue has too few. Check whether geometric multiplicity equals algebraic multiplicity for each eigenvalue. For example, $\\begin{pmatrix} 3 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$ is diagonalizable, while $\\begin{pmatrix} 3 & 1 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$ is not: there $A - 3I$ has rank $2$, so $3$ has geometric multiplicity $1 < 2$.\n\n> **Watch out.** A repeated eigenvalue does not by itself stop diagonalization, and being triangular does not guarantee it. Only the count of independent eigenvectors decides.",
        "当矩阵有足够多的线性无关特征向量构成一组基时，它就可以对角化；如果某个重复特征值的特征向量太少就不行。检验每个特征值的几何重数是否等于代数重数。例如 $\\begin{pmatrix} 3 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$ 可对角化，而 $\\begin{pmatrix} 3 & 1 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$ 不可以：那里 $A - 3I$ 的秩为 $2$，所以 $3$ 的几何重数为 $1 < 2$。\n\n> **注意。** 有重特征值本身并不妨碍对角化，是三角矩阵也不能保证可对角化。只有线性无关特征向量的个数说了算。",
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
        const geo = isDiag ? 2 : 1;
        const solution = walked(
          [
            [
              ["List the eigenvalues", "列出特征值"],
              t(
                `$A$ is triangular, so its eigenvalues are $${lambda}$ twice and $${mu}$ once.`,
                `$A$ 是三角矩阵，所以特征值为 $${lambda}$（两次）和 $${mu}$（一次）。`,
              ),
            ],
            [
              ["Count eigenvectors for the repeated eigenvalue", "数重特征值的特征向量"],
              t("", ""),
              [
                `A${shiftStr} = ${mat3Latex([
                  [0, a, 0],
                  [0, 0, 0],
                  [0, 0, mu - lambda],
                ])}`,
              ],
            ],
          ],
          t(
            isDiag
              ? `The rank is $1$, so $${lambda}$ has geometric multiplicity $3 - 1 = 2$, equal to its algebraic multiplicity. With one eigenvector for $${mu}$ there are $3$ independent eigenvectors, so $A$ is diagonalizable.`
              : `The rank is $2$, so $${lambda}$ has geometric multiplicity $3 - 2 = 1 < 2$. With one eigenvector for $${mu}$ there are only $2$ independent eigenvectors, fewer than $3$, so $A$ is not diagonalizable.`,
            isDiag
              ? `秩为 $1$，所以 $${lambda}$ 的几何重数为 $3 - 1 = 2$，等于代数重数。加上 $${mu}$ 的一个特征向量，共有 $3$ 个线性无关的特征向量，所以 $A$ 可对角化。`
              : `秩为 $2$，所以 $${lambda}$ 的几何重数为 $3 - 2 = 1 < 2$。加上 $${mu}$ 的一个特征向量，只有 $2$ 个线性无关的特征向量，少于 $3$ 个，所以 $A$ 不可对角化。`,
          ),
        );
        const reasons: [string, string, string][] = isDiag
          ? [
              [
                wrong[0]!.en,
                `A repeated eigenvalue is fine when its eigenspace is as large as its multiplicity, as here: $${lambda}$ has $${geo}$ independent eigenvectors.`,
                `只要特征空间的维数与重数一样大，重特征值就没有问题，这里正是如此：$${lambda}$ 有 $${geo}$ 个线性无关的特征向量。`,
              ],
              [
                wrong[1]!.en,
                "Diagonalizability does not depend on the determinant; a diagonal matrix can have determinant $0$.",
                "能否对角化与行列式无关；对角矩阵的行列式也可以为 $0$。",
              ],
              [
                wrong[2]!.en,
                "The eigenvalues and eigenvectors are all real, so $A$ is diagonalizable over $\\mathbb{R}$.",
                "特征值和特征向量都是实的，所以 $A$ 在 $\\mathbb{R}$ 上就可对角化。",
              ],
            ]
          : [
              [
                wrong[0]!.en,
                `Triangular matrices need not be diagonalizable; here $${lambda}$ has only one independent eigenvector.`,
                `三角矩阵不一定可对角化；这里 $${lambda}$ 只有一个线性无关的特征向量。`,
              ],
              [
                wrong[1]!.en,
                `The eigenvalues are $${lambda}$, $${lambda}$ and $${mu}$, so $${lambda}$ is repeated.`,
                `特征值为 $${lambda}$、$${lambda}$ 和 $${mu}$，所以 $${lambda}$ 是重特征值。`,
              ],
              [
                wrong[2]!.en,
                "The answer is right but the reason is not: the trace does not decide diagonalizability.",
                "结论对但理由不对：迹并不决定能否对角化。",
              ],
            ];
        return reasoned(oneOf(rng, prompt, right, wrong, solution), reasons);
      },
    },
    {
      id: "counting-independent-eigenvectors",
      title: t("Counting independent eigenvectors", "数线性无关的特征向量"),
      explanation: t(
        "A $3 \\times 3$ matrix is diagonalizable exactly when it has $3$ linearly independent eigenvectors. Eigenvectors for different eigenvalues are independent, and the eigenspace of $\\lambda$ contributes $3 - \\operatorname{rank}(A - \\lambda I)$ of them. So count, for each eigenvalue, the dimension of its eigenspace and add them up. For example, $\\begin{pmatrix} 2 & 1 & 4 \\\\ 0 & 2 & 3 \\\\ 0 & 0 & 5 \\end{pmatrix}$ has $\\operatorname{rank}(A - 2I) = 2$, giving one eigenvector for $2$, and one for $5$: two in all.\n\n> **Watch out.** Look at the entry above the repeated diagonal entry: if it is nonzero, the rank of $A - \\lambda I$ goes up and the eigenspace shrinks to a line. Entries in the last column do not change this count.",
        "$3 \\times 3$ 矩阵可对角化当且仅当它有 $3$ 个线性无关的特征向量。不同特征值的特征向量线性无关，$\\lambda$ 的特征空间提供 $3 - \\operatorname{rank}(A - \\lambda I)$ 个。所以对每个特征值求其特征空间的维数，再加起来。例如 $\\begin{pmatrix} 2 & 1 & 4 \\\\ 0 & 2 & 3 \\\\ 0 & 0 & 5 \\end{pmatrix}$ 有 $\\operatorname{rank}(A - 2I) = 2$，$2$ 有一个特征向量，$5$ 有一个：共两个。\n\n> **注意。** 看重复对角元上方的那个元：它不为零时，$A - \\lambda I$ 的秩增大，特征空间缩成一条直线。最后一列的元不改变这个个数。",
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
        const shifted: Mat3 = [
          [0, a, M[0][2]],
          [0, 0, M[1][2]],
          [0, 0, mu - lam],
        ];
        return numberProblem({
          prompt: t(
            `How many linearly independent eigenvectors does $A = ${mat3Latex(M)}$ have?`,
            `$A = ${mat3Latex(M)}$ 有多少个线性无关的特征向量？`,
          ),
          answer: ans,
          mistakes: [
            a === 0
              ? why(
                  2,
                  `With a zero above the repeated diagonal entry, $A${formatShift(lam, "I")}$ has rank $1$, so $${lam}$ alone has two eigenvectors.`,
                  `重复对角元上方为零时，$A${formatShift(lam, "I")}$ 的秩为 $1$，所以 $${lam}$ 就有两个特征向量。`,
                )
              : why(
                  3,
                  `The entry $${a}$ above the repeated diagonal entry makes $A${formatShift(lam, "I")}$ rank $2$, so $${lam}$ has only one eigenvector.`,
                  `重复对角元上方的元 $${a}$ 使 $A${formatShift(lam, "I")}$ 的秩为 $2$，所以 $${lam}$ 只有一个特征向量。`,
                ),
            why(
              1,
              `The simple eigenvalue $${mu}$ also has an eigenvector, independent of those for $${lam}$.`,
              `单特征值 $${mu}$ 也有一个特征向量，与 $${lam}$ 的特征向量线性无关。`,
            ),
            why(0, "Every eigenvalue has at least one eigenvector.", "每个特征值至少有一个特征向量。"),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                [`The repeated eigenvalue $${lam}$`, `重特征值 $${lam}$`],
                t(
                  `$A${formatShift(lam, "I")} = ${mat3Latex(shifted)}$ has rank $${3 - dimLam}$, so the eigenspace of $${lam}$ has dimension $${dimLam}$.`,
                  `$A${formatShift(lam, "I")} = ${mat3Latex(shifted)}$ 的秩为 $${3 - dimLam}$，所以 $${lam}$ 的特征空间维数为 $${dimLam}$。`,
                ),
              ],
              [
                [`The simple eigenvalue $${mu}$`, `单特征值 $${mu}$`],
                t(
                  `It adds one more eigenvector, for a total of $${dimLam} + 1 = ${ans}$.`,
                  `它再提供一个特征向量，共 $${dimLam} + 1 = ${ans}$ 个。`,
                ),
              ],
            ],
            t(
              ans === 3
                ? "Three independent eigenvectors form a basis of $\\mathbb{R}^3$, so $A$ is diagonalizable."
                : "Two independent eigenvectors cannot form a basis of $\\mathbb{R}^3$, so $A$ is not diagonalizable.",
              ans === 3
                ? "三个线性无关的特征向量构成 $\\mathbb{R}^3$ 的一组基，所以 $A$ 可对角化。"
                : "两个线性无关的特征向量不能构成 $\\mathbb{R}^3$ 的基，所以 $A$ 不可对角化。",
            ),
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
  intro: t(
    "The vector $\\mathbf{v} = (2 + 3i, -1 + 4i)$ splits entry by entry into $\\mathbf{v} = (2, -1) + i(3, 4)$, so $\\operatorname{Re}(\\mathbf{v}) = (2, -1)$ and $\\operatorname{Im}(\\mathbf{v}) = (3, 4)$. Its length uses absolute values: $\\|\\mathbf{v}\\|^2 = |2 + 3i|^2 + |-1 + 4i|^2 = 13 + 17 = 30$.\n\nCheck: $(2 + 3i)(2 - 3i) = 4 + 9 = 13$ and $(-1 + 4i)(-1 - 4i) = 1 + 16 = 17$, so multiplying each entry by its conjugate gives the same squares.\n\nIn this lesson we split complex vectors into real and imaginary parts and find their lengths in $\\mathbb{C}^n$.",
    "向量 $\\mathbf{v} = (2 + 3i, -1 + 4i)$ 逐分量拆开为 $\\mathbf{v} = (2, -1) + i(3, 4)$，所以 $\\operatorname{Re}(\\mathbf{v}) = (2, -1)$，$\\operatorname{Im}(\\mathbf{v}) = (3, 4)$。它的长度用绝对值计算：$\\|\\mathbf{v}\\|^2 = |2 + 3i|^2 + |-1 + 4i|^2 = 13 + 17 = 30$。\n\n检验：$(2 + 3i)(2 - 3i) = 4 + 9 = 13$，$(-1 + 4i)(-1 - 4i) = 1 + 16 = 17$，每个分量乘以其共轭得到相同的平方。\n\n本课我们把复向量拆成实部和虚部，并求它们在 $\\mathbb{C}^n$ 中的长度。",
  ),
  prerequisites: ["diagonalizing-a-3x3-matrix-in-the-general-case"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "complex-vector-decomposition",
      title: t("Complex Vector Decomposition", "复向量的分解"),
      explanation: t(
        "Splitting each entry into its real and imaginary parts writes a complex vector as a real vector plus $i$ times another real vector. Express a complex vector $\\mathbf{v} \\in \\mathbb{C}^n$ as $\\mathbf{v} = \\operatorname{Re}(\\mathbf{v}) + i \\operatorname{Im}(\\mathbf{v})$ and find its conjugate. For example, $(1 - 2i, 5i) = (1, 0) + i(-2, 5)$, and its conjugate is $(1 + 2i, -5i)$.\n\n> **Watch out.** The imaginary part is the real coefficient of $i$, sign included: $\\operatorname{Im}(1 - 2i) = -2$, not $-2i$ and not $2$. An entry with no $i$ has imaginary part $0$.",
        "把每个分量拆成实部和虚部，就把复向量写成一个实向量加上 $i$ 乘以另一个实向量。将复向量 $\\mathbf{v} \\in \\mathbb{C}^n$ 表示为 $\\mathbf{v} = \\operatorname{Re}(\\mathbf{v}) + i \\operatorname{Im}(\\mathbf{v})$ 并求其复共轭。例如 $(1 - 2i, 5i) = (1, 0) + i(-2, 5)$，其共轭为 $(1 + 2i, -5i)$。\n\n> **注意。** 虚部是 $i$ 的实系数，连同符号：$\\operatorname{Im}(1 - 2i) = -2$，不是 $-2i$，也不是 $2$。不含 $i$ 的分量虚部为 $0$。",
      ),
      generate: (rng: Rng): Problem => {
        const a = rng.int(-6, 6);
        const b = rng.pick([-5, -4, -3, 3, 4, 5])!;
        const c = rng.int(-6, 6);
        const d = rng.pick([-5, -4, -3, 3, 4, 5])!;
        const vStr: readonly [string, string] = [formatComplex(a, b), formatComplex(c, d)];
        const askRe = rng.bool();
        const split = t(
          `$\\mathbf{v} = ${vec2Latex([a, c])} + i${vec2Latex([b, d])}$, taking the real part and the coefficient of $i$ of each entry.`,
          `$\\mathbf{v} = ${vec2Latex([a, c])} + i${vec2Latex([b, d])}$，即取每个分量的实部和 $i$ 的系数。`,
        );
        const check = t(
          `$${vec2Latex([a, c])} + i${vec2Latex([b, d])}$ gives back the entries $${vStr[0]}$ and $${vStr[1]}$.`,
          `$${vec2Latex([a, c])} + i${vec2Latex([b, d])}$ 还原出分量 $${vStr[0]}$ 和 $${vStr[1]}$。`,
        );
        if (askRe) {
          const prompt = t(
            `Let $\\mathbf{v} = ${vec2Latex(vStr)} \\in \\mathbb{C}^2$. What is the real part $\\operatorname{Re}(\\mathbf{v})$? Enter your answer as a vector $\\langle x_1, x_2 \\rangle$.`,
            `设 $\\mathbf{v} = ${vec2Latex(vStr)} \\in \\mathbb{C}^2$。求其实部 $\\operatorname{Re}(\\mathbf{v})$。请以向量 $\\langle x_1, x_2 \\rangle$ 的形式作答。`,
          );
          const solution = walked(
            [
              [["Split each entry", "拆开每个分量"], split],
              [
                ["Take the real vector", "取实向量"],
                t(
                  `The real part is the vector of real parts, $\\langle ${a}, ${c} \\rangle$.`,
                  `实部是各分量实部组成的向量 $\\langle ${a}, ${c} \\rangle$。`,
                ),
              ],
            ],
            check,
          );
          return withMistakes(
            pointProblem({ prompt, answer: [a, c], vector: true, solution }),
            dedupeSaid(
              [
                say(vectorLatex([b, d]), "That is the imaginary part, the coefficients of $i$.", "这是虚部，即 $i$ 的系数。"),
                say(vectorLatex([-a, -c]), "The real parts keep their signs.", "实部要保留原来的符号。"),
                say(
                  vectorLatex([a, b]),
                  "These are the two parts of the first entry; take the real part of each entry.",
                  "这是第一个分量的两部分；应取每个分量的实部。",
                ),
                say(
                  vectorLatex([c, d]),
                  "These are the two parts of the second entry; take the real part of each entry.",
                  "这是第二个分量的两部分；应取每个分量的实部。",
                ),
              ],
              vectorLatex([a, c]),
            ),
          );
        }
        const prompt = t(
          `Let $\\mathbf{v} = ${vec2Latex(vStr)} \\in \\mathbb{C}^2$. What is the imaginary part $\\operatorname{Im}(\\mathbf{v})$? Enter your answer as a vector $\\langle y_1, y_2 \\rangle$.`,
          `设 $\\mathbf{v} = ${vec2Latex(vStr)} \\in \\mathbb{C}^2$。求其虚部 $\\operatorname{Im}(\\mathbf{v})$。请以向量 $\\langle y_1, y_2 \\rangle$ 的形式作答。`,
        );
        const solution = walked(
          [
            [["Split each entry", "拆开每个分量"], split],
            [
              ["Take the coefficients of $i$", "取 $i$ 的系数"],
              t(
                `The imaginary part is the real vector of coefficients of $i$, $\\langle ${b}, ${d} \\rangle$.`,
                `虚部是 $i$ 的系数组成的实向量 $\\langle ${b}, ${d} \\rangle$。`,
              ),
            ],
          ],
          check,
        );
        return withMistakes(
          pointProblem({ prompt, answer: [b, d], vector: true, solution }),
          dedupeSaid(
            [
              say(
                vectorLatex([a, c]),
                "That is the real part; the imaginary part is the coefficients of $i$.",
                "这是实部；虚部是 $i$ 的系数。",
              ),
              say(
                vectorLatex([-b, -d]),
                "The signs are flipped: that is the imaginary part of the conjugate.",
                "符号反了：这是共轭向量的虚部。",
              ),
              say(
                vectorLatex([a, b]),
                "These are the two parts of the first entry; take the coefficient of $i$ in each entry.",
                "这是第一个分量的两部分；应取每个分量中 $i$ 的系数。",
              ),
              say(
                vectorLatex([c, d]),
                "These are the two parts of the second entry; take the coefficient of $i$ in each entry.",
                "这是第二个分量的两部分；应取每个分量中 $i$ 的系数。",
              ),
            ],
            vectorLatex([b, d]),
          ),
        );
      },
    },
    {
      id: "the-length-of-a-complex-vector",
      title: t("The length of a complex vector", "复向量的长度"),
      explanation: t(
        "In $\\mathbb{C}^n$ the length is defined with absolute values, so that it is a non-negative real number:\n\n$$\\|\\mathbf{v}\\|^2 = |v_1|^2 + |v_2|^2, \\qquad |a + bi|^2 = a^2 + b^2.$$\n\nFor example, $\\mathbf{v} = (1 + 2i, 3)$ has $\\|\\mathbf{v}\\|^2 = (1 + 4) + 9 = 14$.\n\n> **Watch out.** Do not square the components themselves: that gives complex numbers, and for $(1, i)$ it gives $1 + i^2 = 0$ for a non-zero vector. Use $|a + bi|^2 = a^2 + b^2$, with a plus sign.",
        "在 $\\mathbb{C}^n$ 中长度用绝对值定义，使之成为非负实数：\n\n$$\\|\\mathbf{v}\\|^2 = |v_1|^2 + |v_2|^2, \\qquad |a + bi|^2 = a^2 + b^2.$$\n\n例如 $\\mathbf{v} = (1 + 2i, 3)$ 有 $\\|\\mathbf{v}\\|^2 = (1 + 4) + 9 = 14$。\n\n> **注意。** 不要直接把分量平方：那样得到的是复数，对 $(1, i)$ 会得到 $1 + i^2 = 0$，而它是非零向量。要用 $|a + bi|^2 = a^2 + b^2$，中间是加号。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c, d] = [rng.int(-5, 5), rng.int(-5, 5) || 1, rng.int(-5, 5), rng.int(-5, 5) || -2];
        const ans = a * a + b * b + c * c + d * d;
        const z1 = formatComplex(a, b);
        const z2 = formatComplex(c, d);
        return numberProblem({
          prompt: t(
            `Find $\\|\\mathbf{v}\\|^2$ for $\\mathbf{v} = ${vec2Latex([z1, z2])} \\in \\mathbb{C}^2$.`,
            `求 $\\mathbf{v} = ${vec2Latex([z1, z2])} \\in \\mathbb{C}^2$ 的 $\\|\\mathbf{v}\\|^2$。`,
          ),
          answer: ans,
          mistakes: [
            why(
              a * a - b * b + c * c - d * d,
              "That squares the entries themselves, so $i^2 = -1$ turns the imaginary parts negative; use $|a + bi|^2 = a^2 + b^2$.",
              "这是直接把分量平方，$i^2 = -1$ 使虚部变成负的；应使用 $|a + bi|^2 = a^2 + b^2$。",
            ),
            why(a * a + c * c, "The imaginary parts are left out; they count toward the length too.", "漏掉了虚部；虚部也计入长度。"),
            why(
              (a + c) ** 2 + (b + d) ** 2,
              "That adds the entries first; square the absolute value of each entry, then add.",
              "这是先把分量相加；应先求每个分量绝对值的平方，再相加。",
            ),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Square each absolute value", "求每个绝对值的平方"],
                t("", ""),
                [
                  `|${z1}|^2 = ${paren(a)}^2 + ${paren(b)}^2 = ${a * a + b * b}`,
                  `|${z2}|^2 = ${paren(c)}^2 + ${paren(d)}^2 = ${c * c + d * d}`,
                ],
              ],
              [["Add them", "相加"], t("", ""), [`\\|\\mathbf{v}\\|^2 = ${a * a + b * b} + ${c * c + d * d} = ${ans}`]],
            ],
            t(
              `$(${z1})(${formatComplex(a, -b)}) = ${a * a + b * b}$, so multiplying the first entry by its conjugate gives the same square.`,
              `$(${z1})(${formatComplex(a, -b)}) = ${a * a + b * b}$，第一个分量乘以其共轭得到相同的平方。`,
            ),
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
  intro: t(
    "For $A = \\begin{pmatrix} 1 & 2i \\\\ 3 - i & 4 \\end{pmatrix}$, the conjugate transpose $A^*$ swaps rows and columns and conjugates every entry: $A^* = \\begin{pmatrix} 1 & 3 + i \\\\ -2i & 4 \\end{pmatrix}$. The diagonal of $AA^*$ holds the squared lengths of the rows of $A$, so $\\operatorname{tr}(AA^*) = 1 + 4 + 10 + 16 = 31$.\n\nCheck: the $(1, 1)$ entry of $AA^*$ is $1 \\cdot 1 + 2i \\cdot (-2i) = 1 + 4 = 5$, the squared length of the first row.\n\nIn this lesson we take conjugate transposes of complex matrices and use them to find $\\operatorname{tr}(AA^*)$.",
    "对 $A = \\begin{pmatrix} 1 & 2i \\\\ 3 - i & 4 \\end{pmatrix}$，共轭转置 $A^*$ 交换行与列并对每个元素取共轭：$A^* = \\begin{pmatrix} 1 & 3 + i \\\\ -2i & 4 \\end{pmatrix}$。$AA^*$ 的对角线上是 $A$ 各行长度的平方，所以 $\\operatorname{tr}(AA^*) = 1 + 4 + 10 + 16 = 31$。\n\n检验：$AA^*$ 的 $(1, 1)$ 元为 $1 \\cdot 1 + 2i \\cdot (-2i) = 1 + 4 = 5$，即第一行长度的平方。\n\n本课我们求复矩阵的共轭转置，并用它求 $\\operatorname{tr}(AA^*)$。",
  ),
  prerequisites: ["vectors-over-the-complex-numbers"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "conjugate-transpose-complex-matrix",
      title: t("Conjugate Transpose of a Complex Matrix", "复矩阵的共轭转置"),
      explanation: t(
        "The conjugate transpose combines two operations: swap rows and columns, and replace every entry by its complex conjugate. Calculate the conjugate transpose $A^* = \\bar{A}^T$ of a $2 \\times 2$ complex matrix. For example, $A = \\begin{pmatrix} 2 & i \\\\ 5i & 1 \\end{pmatrix}$ has $A^* = \\begin{pmatrix} 2 & -5i \\\\ -i & 1 \\end{pmatrix}$.\n\n> **Watch out.** Do both steps. Transposing alone keeps the signs of the imaginary parts, and conjugating alone leaves the off-diagonal entries in place. Real entries do not change sign.",
        "共轭转置结合了两个操作：交换行与列，并把每个元素换成它的共轭复数。计算 $2 \\times 2$ 复矩阵的共轭转置 $A^* = \\bar{A}^T$。例如 $A = \\begin{pmatrix} 2 & i \\\\ 5i & 1 \\end{pmatrix}$ 有 $A^* = \\begin{pmatrix} 2 & -5i \\\\ -i & 1 \\end{pmatrix}$。\n\n> **注意。** 两步都要做。只转置会保留虚部的符号，只取共轭则非对角元不换位置。实数元素不变号。",
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
        const m = (M: readonly [readonly [string, string], readonly [string, string]]) => t(`$${mat2StrLatex(M)}$`, `$${mat2StrLatex(M)}$`);
        const right = m(mAdjStr);
        const wrong = [
          m([
            [mStr[0][0], mStr[1][0]],
            [mStr[0][1], mStr[1][1]],
          ]),
          m([
            [`${a}`, negBiStr],
            [negCiStr, `${d}`],
          ]),
          m([
            [`${-a}`, ciStr],
            [biStr, `${-d}`],
          ]),
          m([
            [`${a}`, biStr],
            [ciStr, `${d}`],
          ]),
        ];
        const solution = walked(
          [
            [
              ["Transpose", "转置"],
              t("", ""),
              [
                `A^T = ${mat2StrLatex([
                  [mStr[0][0], mStr[1][0]],
                  [mStr[0][1], mStr[1][1]],
                ])}`,
              ],
            ],
            [
              ["Conjugate every entry", "对每个元素取共轭"],
              t(
                `$\\overline{${ciStr}} = ${negCiStr}$ and $\\overline{${biStr}} = ${negBiStr}$; the real entries stay the same:`,
                `$\\overline{${ciStr}} = ${negCiStr}$，$\\overline{${biStr}} = ${negBiStr}$；实数元素不变：`,
              ),
              [`A^* = ${mat2StrLatex(mAdjStr)}`],
            ],
          ],
          t(
            `Taking the conjugate transpose of $A^*$ again gives back $A$: the $(1, 2)$ entry of $(A^*)^*$ is $\\overline{${negBiStr}} = ${biStr}$.`,
            `再对 $A^*$ 取共轭转置会还原 $A$：$(A^*)^*$ 的 $(1, 2)$ 元为 $\\overline{${negBiStr}} = ${biStr}$。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [wrong[0]!.en, "That is only the transpose; each entry must also be conjugated.", "这只是转置；每个元素还要取共轭。"],
          [
            wrong[1]!.en,
            "That is only the conjugate; the off-diagonal entries must also swap places.",
            "这只是取共轭；非对角元还要交换位置。",
          ],
          [
            wrong[2]!.en,
            "Conjugation does not change the sign of real entries; this is $-A^*$.",
            "取共轭不改变实数元素的符号；这是 $-A^*$。",
          ],
          [wrong[3]!.en, "That is $A$ itself, neither transposed nor conjugated.", "这是 $A$ 本身，既没有转置也没有取共轭。"],
        ]);
      },
    },
    {
      id: "the-trace-of-a-matrix-times-its-conjugate-transpose",
      title: t("The trace of a matrix times its conjugate transpose", "矩阵与其共轭转置之积的迹"),
      explanation: t(
        "For a complex matrix $A$, the diagonal entries of $AA^*$ are $\\sum_j a_{ij}\\overline{a_{ij}} = \\sum_j |a_{ij}|^2$, the squared lengths of the rows. So\n\n$$\\operatorname{tr}(AA^*) = \\sum_{i, j} |a_{ij}|^2,$$\n\nthe sum of the squared absolute values of all entries. It is always a non-negative real number, even though $A$ is complex. For example, $A = \\begin{pmatrix} 1 + i & 0 \\\\ 2 & -i \\end{pmatrix}$ gives $2 + 0 + 4 + 1 = 7$.\n\n> **Watch out.** Every entry counts, not only the diagonal ones, and each imaginary part adds its square: $|a + bi|^2 = a^2 + b^2$, never $a^2 - b^2$.",
        "对复矩阵 $A$，$AA^*$ 的对角元为 $\\sum_j a_{ij}\\overline{a_{ij}} = \\sum_j |a_{ij}|^2$，即各行长度的平方。所以\n\n$$\\operatorname{tr}(AA^*) = \\sum_{i, j} |a_{ij}|^2,$$\n\n即所有元素绝对值平方之和。即使 $A$ 是复矩阵，它也总是非负实数。例如 $A = \\begin{pmatrix} 1 + i & 0 \\\\ 2 & -i \\end{pmatrix}$ 给出 $2 + 0 + 4 + 1 = 7$。\n\n> **注意。** 所有元素都要算，不只是对角元；每个虚部都加上它的平方：$|a + bi|^2 = a^2 + b^2$，而不是 $a^2 - b^2$。",
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
          mistakes: [
            why(
              z.reduce((x, [a, b]) => x + a * a - b * b, 0),
              "That squares the entries themselves, so the imaginary parts count negatively; use $|a + bi|^2 = a^2 + b^2$.",
              "这是直接把元素平方，虚部被算成负的；应使用 $|a + bi|^2 = a^2 + b^2$。",
            ),
            why(
              z.reduce((x, [a]) => x + a * a, 0),
              "The imaginary parts are left out; each adds its square.",
              "漏掉了虚部；每个虚部都要加上它的平方。",
            ),
            why(
              sq[0]! + sq[3]!,
              "Only the diagonal entries of $A$ were used; every entry of $A$ contributes.",
              "只用了 $A$ 的对角元；$A$ 的每个元素都有贡献。",
            ),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Square the absolute value of each entry", "求每个元素绝对值的平方"],
                t("", ""),
                z.map(([a, b], n) => `|${ent[n]!}|^2 = ${paren(a)}^2 + ${paren(b)}^2 = ${sq[n]!}`),
              ],
              [["Add them", "相加"], t("", ""), [`\\operatorname{tr}(AA^*) = ${sq.join(" + ")} = ${ans}`]],
            ],
            t(
              `The diagonal entries of $AA^*$ are the squared row lengths $${sq[0]!} + ${sq[1]!} = ${sq[0]! + sq[1]!}$ and $${sq[2]!} + ${sq[3]!} = ${sq[2]! + sq[3]!}$, which add to $${ans}$.`,
              `$AA^*$ 的对角元是各行长度的平方 $${sq[0]!} + ${sq[1]!} = ${sq[0]! + sq[1]!}$ 和 $${sq[2]!} + ${sq[3]!} = ${sq[2]! + sq[3]!}$，相加得 $${ans}$。`,
            ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 1 & -2 \\\\ 2 & 1 \\end{pmatrix}$ has trace $2$ and determinant $5$, so its characteristic equation is $\\lambda^2 - 2\\lambda + 5 = 0$. The discriminant $4 - 20 = -16$ is negative, and the quadratic formula gives $\\lambda = \\frac{2 \\pm 4i}{2} = 1 \\pm 2i$.\n\nCheck: $(1 + 2i) + (1 - 2i) = 2$ is the trace and $(1 + 2i)(1 - 2i) = 1 + 4 = 5$ is the determinant.\n\nIn this lesson we find the complex conjugate eigenvalues of real $2 \\times 2$ matrices, and read their real part and modulus from the trace and determinant.",
    "矩阵 $A = \\begin{pmatrix} 1 & -2 \\\\ 2 & 1 \\end{pmatrix}$ 的迹为 $2$，行列式为 $5$，所以特征方程为 $\\lambda^2 - 2\\lambda + 5 = 0$。判别式 $4 - 20 = -16$ 为负，求根公式给出 $\\lambda = \\frac{2 \\pm 4i}{2} = 1 \\pm 2i$。\n\n检验：$(1 + 2i) + (1 - 2i) = 2$ 是迹，$(1 + 2i)(1 - 2i) = 1 + 4 = 5$ 是行列式。\n\n本课我们求实 $2 \\times 2$ 矩阵的共轭复特征值，并由迹和行列式读出它们的实部与模。",
  ),
  prerequisites: ["matrices-over-the-complex-numbers"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "computing-complex-eigenvalues-2x2-kp",
      title: t("Computing Complex Eigenvalues of 2x2 Matrices", "计算 2x2 矩阵的复特征值"),
      explanation: t(
        "When the characteristic quadratic has a negative discriminant, the quadratic formula gives a pair of complex conjugate eigenvalues. Solve the characteristic quadratic equation when $\\operatorname{tr}(A)^2 - 4\\det(A) < 0$. For example, $\\begin{pmatrix} 3 & -1 \\\\ 1 & 3 \\end{pmatrix}$ gives $(\\lambda - 3)^2 + 1 = 0$, so $\\lambda - 3 = \\pm i$ and $\\lambda = 3 \\pm i$.\n\n> **Watch out.** A negative square has imaginary roots: $(\\lambda - 3)^2 = -1$ gives $\\pm i$, not $\\pm 1$. The real part of the eigenvalues is half the trace.",
        "当特征二次方程的判别式为负时，求根公式给出一对共轭复特征值。在 $\\operatorname{tr}(A)^2 - 4\\det(A) < 0$ 时求解特征二次方程。例如 $\\begin{pmatrix} 3 & -1 \\\\ 1 & 3 \\end{pmatrix}$ 给出 $(\\lambda - 3)^2 + 1 = 0$，所以 $\\lambda - 3 = \\pm i$，$\\lambda = 3 \\pm i$。\n\n> **注意。** 负数的平方根是虚数：$(\\lambda - 3)^2 = -1$ 给出 $\\pm i$，而不是 $\\pm 1$。特征值的实部是迹的一半。",
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
        const root = a === 0 ? "\\lambda" : formatFactor("\\lambda", a);
        const iPart = b === 1 ? "i" : `${b}i`;
        const solution = walked(
          [
            [
              ["Write the characteristic equation", "写出特征方程"],
              t(
                `The diagonal entries of $A - \\lambda I$ are both $${a === 0 ? "-\\lambda" : `${a} - \\lambda`}$ and the off-diagonal ones multiply to $-${b * b}$, so $\\det(A - \\lambda I) = ${aPart} + ${b * b} = 0$.`,
                `$A - \\lambda I$ 的两个对角元都是 $${a === 0 ? "-\\lambda" : `${a} - \\lambda`}$，非对角元之积为 $-${b * b}$，所以 $\\det(A - \\lambda I) = ${aPart} + ${b * b} = 0$。`,
              ),
            ],
            [
              ["Take square roots", "开平方"],
              t(`$${aPart} = -${b * b}$ is negative, so the roots are imaginary:`, `$${aPart} = -${b * b}$ 是负数，所以根是虚数：`),
              [`${root} = \\pm ${iPart}`, `\\lambda = ${eigPair}`],
            ],
          ],
          t(
            `The two eigenvalues add to $${2 * a}$, the trace, and multiply to $${a * a} + ${b * b} = ${a * a + b * b}$, the determinant.`,
            `两个特征值之和为 $${2 * a}$，即迹；之积为 $${a * a} + ${b * b} = ${a * a + b * b}$，即行列式。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [wrong[0]!.en, "The real part has the wrong sign: it equals the diagonal entry.", "实部的符号错了：它等于对角元素。"],
          [
            wrong[1]!.en,
            `The real part is the diagonal entry $${a}$, and the size of the imaginary part is the off-diagonal $${b}$.`,
            `实部是对角元素 $${a}$，虚部的大小是非对角元素 $${b}$。`,
          ],
          [
            wrong[2]!.en,
            `The factor $i$ is lost: the square equals $-${b * b}$, which is negative, so the roots are not real.`,
            `丢了 $i$：平方等于 $-${b * b}$，是负数，所以根不是实数。`,
          ],
          [
            wrong[3]!.en,
            `The diagonal entry $${a}$ is dropped, but it is the real part of the eigenvalues.`,
            `这里丢掉了对角元素 $${a}$，而它正是特征值的实部。`,
          ],
        ]);
      },
    },
    {
      id: "the-modulus-and-real-part-of-complex-eigenvalues",
      title: t("The modulus and real part of complex eigenvalues", "复特征值的模与实部"),
      explanation: t(
        "When a real $2 \\times 2$ matrix has $(\\operatorname{tr} A)^2 < 4\\det A$, its eigenvalues are a conjugate pair $\\alpha \\pm \\beta i$. Their sum is the trace and their product is the determinant, so\n\n$$\\alpha = \\frac{\\operatorname{tr} A}{2}, \\qquad |\\lambda|^2 = \\alpha^2 + \\beta^2 = \\det A.$$\n\nBoth can be read off without solving the quadratic. For example, $\\begin{pmatrix} 1 & -1 \\\\ 5 & 3 \\end{pmatrix}$ has trace $4$ and determinant $8$, so $\\operatorname{Re}(\\lambda) = 2$ and $|\\lambda|^2 = 8$; indeed $\\lambda = 2 \\pm 2i$.\n\n> **Watch out.** The real part is half the trace, not the trace itself, and $|\\lambda|^2$ is the whole determinant $\\alpha^2 + \\beta^2$, not only $\\beta^2$.",
        "当实 $2 \\times 2$ 矩阵满足 $(\\operatorname{tr} A)^2 < 4\\det A$ 时，其特征值是一对共轭复数 $\\alpha \\pm \\beta i$。两者之和为迹，之积为行列式，所以\n\n$$\\alpha = \\frac{\\operatorname{tr} A}{2}, \\qquad |\\lambda|^2 = \\alpha^2 + \\beta^2 = \\det A.$$\n\n无需解二次方程就能读出两者。例如 $\\begin{pmatrix} 1 & -1 \\\\ 5 & 3 \\end{pmatrix}$ 的迹为 $4$，行列式为 $8$，所以 $\\operatorname{Re}(\\lambda) = 2$，$|\\lambda|^2 = 8$；确实 $\\lambda = 2 \\pm 2i$。\n\n> **注意。** 实部是迹的一半，而不是迹本身；$|\\lambda|^2$ 是整个行列式 $\\alpha^2 + \\beta^2$，而不只是 $\\beta^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-4, 4);
        const b = rng.int(1, 4);
        const A = complexEigenMatrix(rng, a, b);
        const wantMod = rng.int(0, 1) === 0;
        const det = a * a + b * b;
        const ans = wantMod ? det : a;
        const mistakes = wantMod
          ? [
              why(
                b * b,
                "That is only $\\beta^2$; the modulus squared also includes the square of the real part.",
                "这只是 $\\beta^2$；模的平方还包括实部的平方。",
              ),
              why(
                a * a - b * b,
                "$|\\alpha + \\beta i|^2 = \\alpha^2 + \\beta^2$, with a plus sign.",
                "$|\\alpha + \\beta i|^2 = \\alpha^2 + \\beta^2$，中间是加号。",
              ),
              why(
                2 * a,
                "That is the trace, the sum of the eigenvalues; the product is the determinant.",
                "这是迹，即特征值之和；之积才是行列式。",
              ),
            ]
          : [
              why(
                2 * a,
                "That is the trace, the sum of both eigenvalues; the real part is half of it.",
                "这是迹，即两个特征值之和；实部是它的一半。",
              ),
              why(b, "That is the imaginary part $\\beta$.", "这是虚部 $\\beta$。"),
              why(det, "That is the determinant, which equals $|\\lambda|^2$.", "这是行列式，它等于 $|\\lambda|^2$。"),
            ];
        return numberProblem({
          prompt: t(
            `The eigenvalues of $A = ${mat2Latex(A)}$ are a complex conjugate pair $\\lambda$, $\\bar{\\lambda}$. Find ${wantMod ? "$|\\lambda|^2$" : "$\\operatorname{Re}(\\lambda)$"}.`,
            `$A = ${mat2Latex(A)}$ 的特征值是一对共轭复数 $\\lambda$、$\\bar{\\lambda}$。求${wantMod ? " $|\\lambda|^2$" : " $\\operatorname{Re}(\\lambda)$"}。`,
          ),
          answer: ans,
          mistakes: mistakes.filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Find the trace and determinant", "求迹和行列式"],
                t("", ""),
                [
                  `\\operatorname{tr} A = ${A[0][0]} + ${paren(A[1][1])} = ${2 * a}`,
                  `\\det A = ${A[0][0]} \\cdot ${paren(A[1][1])} ${A[0][1] * A[1][0] < 0 ? "+" : "-"} ${Math.abs(A[0][1] * A[1][0])} = ${det}`,
                ],
              ],
              [
                [wantMod ? "Use the product" : "Use the sum", wantMod ? "利用乘积" : "利用和"],
                wantMod
                  ? t(
                      `$\\lambda\\bar{\\lambda} = |\\lambda|^2$ equals $\\det A = ${det}$.`,
                      `$\\lambda\\bar{\\lambda} = |\\lambda|^2$ 等于 $\\det A = ${det}$。`,
                    )
                  : t(
                      `$\\lambda + \\bar{\\lambda} = 2\\operatorname{Re}(\\lambda) = ${2 * a}$, so $\\operatorname{Re}(\\lambda) = ${a}$.`,
                      `$\\lambda + \\bar{\\lambda} = 2\\operatorname{Re}(\\lambda) = ${2 * a}$，所以 $\\operatorname{Re}(\\lambda) = ${a}$。`,
                    ),
              ],
            ],
            t(
              `Solving the quadratic gives $\\lambda = ${formatComplexPair(a, b)}$, with real part $${a}$ and $|\\lambda|^2 = ${a * a} + ${b * b} = ${det}$.`,
              `解二次方程得 $\\lambda = ${formatComplexPair(a, b)}$，实部为 $${a}$，$|\\lambda|^2 = ${a * a} + ${b * b} = ${det}$。`,
            ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 1 & -2 \\\\ 2 & 1 \\end{pmatrix}$ has the eigenvalue $\\lambda = 1 + 2i$. Then $A - \\lambda I = \\begin{pmatrix} -2i & -2 \\\\ 2 & -2i \\end{pmatrix}$, and its first row gives $-2iv_1 - 2v_2 = 0$, so $v_2 = -iv_1$. Taking $v_1 = 1$ gives the eigenvector $(1, -i)$.\n\nCheck: $A(1, -i) = (1 + 2i, 2 - i)$, and $(1 + 2i)(1, -i) = (1 + 2i, -i + 2)$, the same vector.\n\nIn this lesson we find complex eigenvectors of real $2 \\times 2$ matrices from one row of $A - \\lambda I$.",
    "矩阵 $A = \\begin{pmatrix} 1 & -2 \\\\ 2 & 1 \\end{pmatrix}$ 有特征值 $\\lambda = 1 + 2i$。于是 $A - \\lambda I = \\begin{pmatrix} -2i & -2 \\\\ 2 & -2i \\end{pmatrix}$，其第一行给出 $-2iv_1 - 2v_2 = 0$，所以 $v_2 = -iv_1$。取 $v_1 = 1$ 得特征向量 $(1, -i)$。\n\n检验：$A(1, -i) = (1 + 2i, 2 - i)$，而 $(1 + 2i)(1, -i) = (1 + 2i, -i + 2)$，是同一个向量。\n\n本课我们由 $A - \\lambda I$ 的一行求实 $2 \\times 2$ 矩阵的复特征向量。",
  ),
  prerequisites: ["finding-complex-eigenvalues-of-real-2x2-matrices"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "solving-for-complex-eigenvector-2x2-kp",
      title: t("Solving for Complex Eigenvectors of 2x2 Matrices", "求解 2x2 矩阵的复特征向量"),
      explanation: t(
        "The two rows of the shifted matrix are complex multiples of each other, so one row is enough to find an eigenvector. Find the nonzero solutions in $\\mathbb{C}^2$ of $(A - (a + bi)I)\\mathbf{v} = \\mathbf{0}$. For example, $A = \\begin{pmatrix} 0 & -3 \\\\ 3 & 0 \\end{pmatrix}$ and $\\lambda = 3i$ give the first row $-3iv_1 - 3v_2 = 0$, so $v_2 = -iv_1$ and $\\mathbf{v} = (1, -i)$.\n\n> **Watch out.** The conjugate eigenvalue has the conjugate eigenvector, so $(1, i)$ and $(1, -i)$ belong to different eigenvalues. Keep track of the sign of $i$ in $\\lambda$ when you subtract it.",
        "平移后的矩阵的两行互为复数倍，所以只用一行就能求出特征向量。在 $\\mathbb{C}^2$ 中求方程 $(A - (a + bi)I)\\mathbf{v} = \\mathbf{0}$ 的非零解。例如 $A = \\begin{pmatrix} 0 & -3 \\\\ 3 & 0 \\end{pmatrix}$，$\\lambda = 3i$ 给出第一行 $-3iv_1 - 3v_2 = 0$，所以 $v_2 = -iv_1$，$\\mathbf{v} = (1, -i)$。\n\n> **注意。** 共轭特征值对应共轭特征向量，所以 $(1, i)$ 与 $(1, -i)$ 属于不同的特征值。减去 $\\lambda$ 时要注意其中 $i$ 的符号。",
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
        const shifted = `\\begin{pmatrix} ${biStr} & -${b} \\\\ ${b} & ${biStr} \\end{pmatrix}`;
        const solution = walked(
          [
            [["Subtract $\\lambda$ on the diagonal", "在对角线上减去 $\\lambda$"], t("", ""), [`A - (${eigStr})I = ${shifted}`]],
            [
              ["Solve the first row", "解第一行"],
              t(
                `$${biStr} v_1 - ${v2Term} = 0$ gives $v_2 = ${si} v_1$. Choosing $v_1 = 1$ gives $\\mathbf{v} = ${vec2Latex(["1", si])}$.`,
                `$${biStr} v_1 - ${v2Term} = 0$ 给出 $v_2 = ${si} v_1$。取 $v_1 = 1$ 得 $\\mathbf{v} = ${vec2Latex(["1", si])}$。`,
              ),
            ],
          ],
          t(
            `The second row gives $${b} \\cdot 1 + (${biStr})(${si}) = ${b} - ${b} = 0$, so it holds too.`,
            `第二行给出 $${b} \\cdot 1 + (${biStr})(${si}) = ${b} - ${b} = 0$，也成立。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [wrong[0]!.en, "This is an eigenvector of the other, conjugate eigenvalue.", "这是另一个共轭特征值的特征向量。"],
          [
            wrong[1]!.en,
            `The first row needs the second entry to be $${si}$ times the first, and this has two equal entries.`,
            `第一行要求第二个分量是第一个的 $${si}$ 倍，而这里两个分量相等。`,
          ],
          [
            wrong[2]!.en,
            `The entries are swapped: the second entry must be $${si}$ times the first.`,
            `两个分量弄反了：第二个分量必须是第一个的 $${si}$ 倍。`,
          ],
          [
            wrong[3]!.en,
            `The first entry has the wrong sign: the second entry must be $${si}$ times the first.`,
            `第一个分量符号错了：第二个分量必须是第一个的 $${si}$ 倍。`,
          ],
        ]);
      },
    },
    {
      id: "a-complex-eigenvector-from-the-first-row",
      title: t("A complex eigenvector from the first row", "由第一行求复特征向量"),
      explanation: t(
        "For a complex eigenvalue $\\lambda$ of $A = \\begin{pmatrix} p & q \\\\ r & s \\end{pmatrix}$ with $q \\ne 0$, the first row of $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ is $(p - \\lambda)v_1 + qv_2 = 0$. It is solved by\n\n$$\\mathbf{v} = \\begin{pmatrix} q \\\\ \\lambda - p \\end{pmatrix}.$$\n\nThe second row is then satisfied automatically because $\\lambda$ is an eigenvalue. The eigenvector for $\\bar{\\lambda}$ is the conjugate $\\bar{\\mathbf{v}}$. For example, $A = \\begin{pmatrix} 2 & 1 \\\\ -5 & 0 \\end{pmatrix}$ has $\\lambda = 1 + 2i$, and $\\mathbf{v} = (1, -1 + 2i)$.\n\n> **Watch out.** The second entry is $\\lambda - p$, not $p - \\lambda$: check that $(p - \\lambda)q + q(\\lambda - p) = 0$. Using $\\bar{\\lambda}$ instead gives the eigenvector of the other eigenvalue.",
        "对 $A = \\begin{pmatrix} p & q \\\\ r & s \\end{pmatrix}$（$q \\ne 0$）的复特征值 $\\lambda$，$(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ 的第一行为 $(p - \\lambda)v_1 + qv_2 = 0$。它的一个解是\n\n$$\\mathbf{v} = \\begin{pmatrix} q \\\\ \\lambda - p \\end{pmatrix}.$$\n\n由于 $\\lambda$ 是特征值，第二行自动成立。$\\bar{\\lambda}$ 的特征向量是共轭 $\\bar{\\mathbf{v}}$。例如 $A = \\begin{pmatrix} 2 & 1 \\\\ -5 & 0 \\end{pmatrix}$ 有 $\\lambda = 1 + 2i$，$\\mathbf{v} = (1, -1 + 2i)$。\n\n> **注意。** 第二个分量是 $\\lambda - p$，不是 $p - \\lambda$：验证 $(p - \\lambda)q + q(\\lambda - p) = 0$。用 $\\bar{\\lambda}$ 会得到另一个特征值的特征向量。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 3);
        const b = rng.int(1, 4);
        const A = complexEigenMatrix(rng, a, b);
        const p = A[0][0];
        const q = A[0][1];
        const r = A[1][0];
        const opt = (x: string, y: string): Text => {
          const v = vec2Latex([x, y]);
          return t(`$${v}$`, `$${v}$`);
        };
        const right = opt(String(q), formatComplex(a - p, b));
        const wrong = [
          opt(String(q), formatComplex(a - p, -b)),
          opt(String(q), formatComplex(p - a, b)),
          opt(formatComplex(a - p, b), String(q)),
        ];
        const v2Part = q === 1 ? "+ v_2" : "- v_2";
        const v = vec2Latex([String(q), formatComplex(a - p, b)]);
        const solution = walked(
          [
            [
              ["Write the first row of $A - \\lambda I$", "写出 $A - \\lambda I$ 的第一行"],
              t(
                `$p - \\lambda = ${formatComplex(p - a, -b)}$, so the first row reads $(${formatComplex(p - a, -b)})v_1 ${v2Part} = 0$.`,
                `$p - \\lambda = ${formatComplex(p - a, -b)}$，所以第一行为 $(${formatComplex(p - a, -b)})v_1 ${v2Part} = 0$。`,
              ),
            ],
            [
              ["Solve it", "求解"],
              t(
                `Take $v_1 = q = ${q}$ and $v_2 = \\lambda - p = ${formatComplex(a - p, b)}$, which gives $\\mathbf{v} = ${v}$.`,
                `取 $v_1 = q = ${q}$，$v_2 = \\lambda - p = ${formatComplex(a - p, b)}$，得 $\\mathbf{v} = ${v}$。`,
              ),
            ],
          ],
          t(
            `The second row gives $r q + (s - \\lambda)(\\lambda - p) = ${r * q} + (${formatComplex(a - p, -b)})(${formatComplex(a - p, b)}) = ${r * q} + ${(a - p) ** 2 + b * b} = 0$.`,
            `第二行给出 $r q + (s - \\lambda)(\\lambda - p) = ${r * q} + (${formatComplex(a - p, -b)})(${formatComplex(a - p, b)}) = ${r * q} + ${(a - p) ** 2 + b * b} = 0$。`,
          ),
        );
        return reasoned(
          oneOf(
            rng,
            t(
              `Which vector is an eigenvector of $A = ${mat2Latex(A)}$ for $\\lambda = ${formatComplex(a, b)}$?`,
              `哪个向量是 $A = ${mat2Latex(A)}$ 对应于 $\\lambda = ${formatComplex(a, b)}$ 的特征向量？`,
            ),
            right,
            wrong,
            solution,
          ),
          [
            [
              wrong[0]!.en,
              "That is the conjugate vector, an eigenvector for $\\bar{\\lambda}$.",
              "这是共轭向量，是 $\\bar{\\lambda}$ 的特征向量。",
            ],
            [
              wrong[1]!.en,
              "The real part of the second entry has the wrong sign: it is $\\lambda - p$.",
              "第二个分量实部的符号错了：它应是 $\\lambda - p$。",
            ],
            [
              wrong[2]!.en,
              "The entries are swapped: the first row needs $v_1 = q$ and $v_2 = \\lambda - p$.",
              "两个分量交换了：第一行要求 $v_1 = q$，$v_2 = \\lambda - p$。",
            ],
          ],
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
  intro: t(
    "The matrix $C = \\begin{pmatrix} 3 & -3 \\\\ 3 & 3 \\end{pmatrix}$ has the form $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ with $(a, b) = (3, 3)$. Its scale factor is $r = \\sqrt{9 + 9} = 3\\sqrt{2}$, and the point $(3, 3)$ points at $45^{\\circ}$, so $C$ rotates by $45^{\\circ}$ and stretches by $3\\sqrt{2}$.\n\nCheck: $C(1, 0) = (3, 3)$ has length $3\\sqrt{2}$ and lies at $45^{\\circ}$, as a rotation by $45^{\\circ}$ followed by a stretch requires.\n\nIn this lesson we read the scale factor and the rotation angle of a rotation-scaling matrix from its entries.",
    "矩阵 $C = \\begin{pmatrix} 3 & -3 \\\\ 3 & 3 \\end{pmatrix}$ 具有 $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ 的形式，$(a, b) = (3, 3)$。其缩放因子为 $r = \\sqrt{9 + 9} = 3\\sqrt{2}$，点 $(3, 3)$ 的方向角为 $45^{\\circ}$，所以 $C$ 旋转 $45^{\\circ}$ 并伸长 $3\\sqrt{2}$ 倍。\n\n检验：$C(1, 0) = (3, 3)$ 的长度为 $3\\sqrt{2}$，方向为 $45^{\\circ}$，正符合先旋转 $45^{\\circ}$ 再伸长的结果。\n\n本课我们由旋转缩放矩阵的元素读出它的缩放因子和旋转角。",
  ),
  prerequisites: ["finding-complex-eigenvectors-of-real-2x2-matrices"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "rotation-scaling-scale-factor",
      figure: linearAlgebraDrawings1["rotation-scaling-matrices#rotation-scaling-scale-factor"],
      title: t("Rotation-Scaling Scale Factor", "旋转缩放矩阵的缩放因子"),
      explanation: t(
        "A rotation scaling matrix multiplies lengths by a fixed factor while it rotates, and that factor is the modulus of the complex eigenvalue. Compute the square of the scaling factor, $r^2 = a^2 + b^2$, for a rotation-scaling matrix. For example, $\\begin{pmatrix} 6 & -8 \\\\ 8 & 6 \\end{pmatrix}$ has $r = \\sqrt{36 + 64} = 10$.\n\n> **Watch out.** The scale factor is the square root $\\sqrt{a^2 + b^2}$, not $a^2 + b^2$ itself, and not $|a| + |b|$.",
        "旋转缩放矩阵在旋转的同时把长度乘以一个固定的因子，这个因子就是复特征值的模。计算旋转缩放矩阵缩放因子的平方 $r^2 = a^2 + b^2$。例如 $\\begin{pmatrix} 6 & -8 \\\\ 8 & 6 \\end{pmatrix}$ 有 $r = \\sqrt{36 + 64} = 10$。\n\n> **注意。** 缩放因子是平方根 $\\sqrt{a^2 + b^2}$，而不是 $a^2 + b^2$ 本身，也不是 $|a| + |b|$。",
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
          `A rotation-scaling matrix has the form $C = ${mat2Latex(mat)}$. What is its scaling factor $r$?`,
          `旋转缩放矩阵具有形式 $C = ${mat2Latex(mat)}$。求其缩放因子 $r$。`,
        );
        const solution = walked(
          [
            [
              ["Read $a$ and $b$", "读出 $a$ 和 $b$"],
              t(`The first column of $C$ is $(a, b) = (${a}, ${b})$.`, `$C$ 的第一列为 $(a, b) = (${a}, ${b})$。`),
            ],
            [["Take the length", "求长度"], t("", ""), [`r = \\sqrt{${paren(a)}^2 + ${paren(b)}^2} = \\sqrt{${a * a + b * b}} = ${r}`]],
          ],
          t(
            `$C$ sends $(1, 0)$ to $(${a}, ${b})$, whose length is $${r}$, so lengths are multiplied by $${r}$.`,
            `$C$ 把 $(1, 0)$ 映为 $(${a}, ${b})$，其长度为 $${r}$，所以长度都乘以 $${r}$。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: r,
          solution,
          mistakes: [
            why(r * r, "That is $r^2 = a^2 + b^2$; take the square root.", "这是 $r^2 = a^2 + b^2$；还要开平方。"),
            why(Math.abs(a), "That is only $|a|$; the scale factor uses both entries.", "这只是 $|a|$；缩放因子要用到两个元素。"),
            why(Math.abs(b), "That is only $|b|$; the scale factor uses both entries.", "这只是 $|b|$；缩放因子要用到两个元素。"),
            why(
              Math.abs(a) + Math.abs(b),
              "Lengths do not add this way; use $\\sqrt{a^2 + b^2}$.",
              "长度不能这样相加；应使用 $\\sqrt{a^2 + b^2}$。",
            ),
          ].filter((w, i, all) => w.value !== r && all.findIndex((o) => o.value === w.value) === i),
        });
      },
    },
    {
      id: "the-rotation-angle-of-a-rotation-scaling-matrix",
      figure: linearAlgebraDrawings1["rotation-scaling-matrices#the-rotation-angle-of-a-rotation-scaling-matrix"],
      title: t("The rotation angle of a rotation-scaling matrix", "旋转伸缩矩阵的旋转角"),
      explanation: t(
        "A rotation-scaling matrix $C = \\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ equals $r\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$ with $r = \\sqrt{a^2 + b^2}$. The angle $\\theta$ is the argument of the point $(a, b)$: find the quadrant from the signs of $a$ and $b$, then the reference angle from $\\tan\\theta = \\frac{b}{a}$. For example, $\\begin{pmatrix} -2 & -2 \\\\ 2 & -2 \\end{pmatrix}$ has $(a, b) = (-2, 2)$ in the second quadrant with reference angle $45^{\\circ}$, so $\\theta = 135^{\\circ}$.\n\n> **Watch out.** Read $b$ from the lower left entry, not the upper right one, which is $-b$. $\\tan\\theta$ alone cannot tell $45^{\\circ}$ from $225^{\\circ}$; the signs of $a$ and $b$ decide the quadrant.",
        "旋转伸缩矩阵 $C = \\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ 等于 $r\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$，其中 $r = \\sqrt{a^2 + b^2}$。角 $\\theta$ 是点 $(a, b)$ 的辐角：先由 $a$、$b$ 的符号确定象限，再由 $\\tan\\theta = \\frac{b}{a}$ 求参考角。例如 $\\begin{pmatrix} -2 & -2 \\\\ 2 & -2 \\end{pmatrix}$ 有 $(a, b) = (-2, 2)$，在第二象限，参考角 $45^{\\circ}$，所以 $\\theta = 135^{\\circ}$。\n\n> **注意。** $b$ 要从左下角的元读出，而不是右上角的元，那个是 $-b$。仅凭 $\\tan\\theta$ 分不清 $45^{\\circ}$ 和 $225^{\\circ}$；要由 $a$、$b$ 的符号确定象限。",
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
        const rStr = b === 0 || a === 0 ? `${k}` : `${k}\\sqrt{2}`;
        const where =
          a === 0 || b === 0
            ? t(
                `The point $(${a}, ${b})$ lies on an axis, in the direction of $${deg}^{\\circ}$.`,
                `点 $(${a}, ${b})$ 在坐标轴上，方向为 $${deg}^{\\circ}$。`,
              )
            : t(
                `The signs of $a = ${a}$ and $b = ${b}$ place $(a, b)$ in the quadrant of $${deg}^{\\circ}$, and $|b| = |a|$ gives the reference angle $45^{\\circ}$, so $\\theta = ${deg}^{\\circ}$.`,
                `$a = ${a}$ 与 $b = ${b}$ 的符号确定 $(a, b)$ 在 $${deg}^{\\circ}$ 所在的象限，$|b| = |a|$ 给出参考角 $45^{\\circ}$，所以 $\\theta = ${deg}^{\\circ}$。`,
              );
        const solution = walked(
          [
            [
              ["Read $a$ and $b$", "读出 $a$ 和 $b$"],
              t(`The first column of $C$ is $(a, b) = (${a}, ${b})$.`, `$C$ 的第一列为 $(a, b) = (${a}, ${b})$。`),
            ],
            [["Locate the point", "确定点的方向"], where],
          ],
          t(
            `With $r = ${rStr}$, $r\\cos ${deg}^{\\circ} = ${a}$ and $r\\sin ${deg}^{\\circ} = ${b}$, matching the first column.`,
            `取 $r = ${rStr}$，$r\\cos ${deg}^{\\circ} = ${a}$，$r\\sin ${deg}^{\\circ} = ${b}$，与第一列一致。`,
          ),
        );
        return reasoned(
          oneOf(
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
            solution,
          ),
          [
            ...others.map(
              (o) =>
                [
                  opt(o).en,
                  `The point $(a, b) = (${a}, ${b})$ does not lie in the direction of $${o}^{\\circ}$.`,
                  `点 $(a, b) = (${a}, ${b})$ 不在 $${o}^{\\circ}$ 的方向上。`,
                ] as const,
            ),
          ],
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 1 & -5 \\\\ 1 & -3 \\end{pmatrix}$ has trace $-2$ and determinant $2$, so its eigenvalues are $-1 \\pm i$. For $\\lambda = -1 - i$ the first row of $A - \\lambda I$ reads $(2 + i)x - 5y = 0$, so $\\mathbf{v} = (5, 2 + i)$, with real part $(5, 2)$ and imaginary part $(0, 1)$. Then $P = \\begin{pmatrix} 5 & 0 \\\\ 2 & 1 \\end{pmatrix}$ and $C = \\begin{pmatrix} -1 & -1 \\\\ 1 & -1 \\end{pmatrix}$.\n\nCheck: $AP = \\begin{pmatrix} -5 & -5 \\\\ -1 & -3 \\end{pmatrix}$ and $PC = \\begin{pmatrix} -5 & -5 \\\\ -1 & -3 \\end{pmatrix}$, so $AP = PC$ and $A = PCP^{-1}$.\n\nIn this lesson we build $P$ from the real and imaginary parts of a complex eigenvector and read off the scaling factor of the rotation-scaling form.",
    "矩阵 $A = \\begin{pmatrix} 1 & -5 \\\\ 1 & -3 \\end{pmatrix}$ 的迹为 $-2$，行列式为 $2$，所以特征值为 $-1 \\pm i$。对 $\\lambda = -1 - i$，$A - \\lambda I$ 的第一行为 $(2 + i)x - 5y = 0$，所以 $\\mathbf{v} = (5, 2 + i)$，实部为 $(5, 2)$，虚部为 $(0, 1)$。于是 $P = \\begin{pmatrix} 5 & 0 \\\\ 2 & 1 \\end{pmatrix}$，$C = \\begin{pmatrix} -1 & -1 \\\\ 1 & -1 \\end{pmatrix}$。\n\n检验：$AP = \\begin{pmatrix} -5 & -5 \\\\ -1 & -3 \\end{pmatrix}$，$PC = \\begin{pmatrix} -5 & -5 \\\\ -1 & -3 \\end{pmatrix}$，所以 $AP = PC$，$A = PCP^{-1}$。\n\n本课我们用复特征向量的实部和虚部构造 $P$，并读出旋转缩放形式的伸缩因子。",
  ),
  prerequisites: ["rotation-scaling-matrices"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "constructing-rotation-scaling-basis",
      figure: linearAlgebraDrawings1["reducing-real-2x2-matrices-to-rotation-scaling-form#constructing-rotation-scaling-basis"],
      title: t("Constructing the Rotation-Scaling Basis", "构造旋转缩放基"),
      explanation: t(
        "Using the real and imaginary parts of a complex eigenvector as a basis turns the matrix into a rotation scaling matrix with real entries. Assemble $P = \\begin{bmatrix} \\operatorname{Re}(\\mathbf{v}) & \\operatorname{Im}(\\mathbf{v}) \\end{bmatrix}$ for an eigenvector $\\mathbf{v}$ of the eigenvalue $a - bi$. For example, $A = \\begin{pmatrix} 1 & -5 \\\\ 1 & -3 \\end{pmatrix}$ has the eigenvector $\\mathbf{v} = (5, 2 + i)$ for $-1 - i$, so $P = \\begin{pmatrix} 5 & 0 \\\\ 2 & 1 \\end{pmatrix}$ and $A = PCP^{-1}$ with $C = \\begin{pmatrix} -1 & -1 \\\\ 1 & -1 \\end{pmatrix}$.\n\n> **Watch out.** The real part goes in the first column and the imaginary part in the second. Swapping the columns, or negating the imaginary part, turns $C$ into its transpose $\\begin{pmatrix} a & b \\\\ -b & a \\end{pmatrix}$.",
        "用复特征向量的实部和虚部作为基，就能把矩阵化为实元素的旋转缩放矩阵。利用特征值 $a - bi$ 的特征向量 $\\mathbf{v}$ 构造矩阵 $P = \\begin{bmatrix} \\operatorname{Re}(\\mathbf{v}) & \\operatorname{Im}(\\mathbf{v}) \\end{bmatrix}$。例如 $A = \\begin{pmatrix} 1 & -5 \\\\ 1 & -3 \\end{pmatrix}$ 对特征值 $-1 - i$ 有特征向量 $\\mathbf{v} = (5, 2 + i)$，所以 $P = \\begin{pmatrix} 5 & 0 \\\\ 2 & 1 \\end{pmatrix}$，且 $A = PCP^{-1}$，其中 $C = \\begin{pmatrix} -1 & -1 \\\\ 1 & -1 \\end{pmatrix}$。\n\n> **注意。** 实部放在第一列，虚部放在第二列。交换两列，或把虚部取相反数，都会把 $C$ 变成它的转置 $\\begin{pmatrix} a & b \\\\ -b & a \\end{pmatrix}$。",
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
        const re = "v_{\\text{re}}";
        const im = "v_{\\text{im}}";
        const solution = walked(
          [
            [
              ["Read $a$ and $b$", "读出 $a$ 和 $b$"],
              t(
                `The eigenvalue is $\\lambda = a - bi = ${eigStr}$, so $a = ${a}$ and $b = ${b}$, matching $C$.`,
                `特征值为 $\\lambda = a - bi = ${eigStr}$，所以 $a = ${a}$，$b = ${b}$，与 $C$ 一致。`,
              ),
            ],
            [
              ["Split $Av = \\lambda v$", "拆分 $Av = \\lambda v$"],
              t(
                "Taking real and imaginary parts of $A(v_{\\text{re}} + i v_{\\text{im}}) = (a - bi)(v_{\\text{re}} + i v_{\\text{im}})$ gives",
                "取 $A(v_{\\text{re}} + i v_{\\text{im}}) = (a - bi)(v_{\\text{re}} + i v_{\\text{im}})$ 的实部和虚部，得到",
              ),
              [`A ${re} = ${formatLinearComb2(a, re, b, im)}`, `A ${im} = ${formatLinearComb2(-b, re, a, im)}`],
            ],
            [
              ["Assemble $P$", "组成 $P$"],
              t(
                `These two equations are the two columns of $AP = PC$ for $P = \\begin{pmatrix} ${re} & ${im} \\end{pmatrix}$, since the columns of $C$ are $(${a}, ${b})$ and $(-${b}, ${a})$.`,
                `这两个等式正是 $P = \\begin{pmatrix} ${re} & ${im} \\end{pmatrix}$ 时 $AP = PC$ 的两列，因为 $C$ 的两列为 $(${a}, ${b})$ 和 $(-${b}, ${a})$。`,
              ),
            ],
          ],
          t(
            `The first column of $PC$ is $P(${a}, ${b}) = ${formatLinearComb2(a, re, b, im)}$, which is exactly $A ${re}$ from the real part.`,
            `$PC$ 的第一列为 $P(${a}, ${b}) = ${formatLinearComb2(a, re, b, im)}$，正是由实部得到的 $A ${re}$。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "With the columns swapped, $P^{-1}AP$ is the transpose $\\begin{pmatrix} a & b \\\\ -b & a \\end{pmatrix}$, not $C$.",
            "交换两列后，$P^{-1}AP$ 是转置 $\\begin{pmatrix} a & b \\\\ -b & a \\end{pmatrix}$，而不是 $C$。",
          ],
          [
            wrong[1]!.en,
            "Negating the second column also turns $C$ into its transpose $\\begin{pmatrix} a & b \\\\ -b & a \\end{pmatrix}$.",
            "把第二列取相反数同样会把 $C$ 变成它的转置 $\\begin{pmatrix} a & b \\\\ -b & a \\end{pmatrix}$。",
          ],
          [
            wrong[2]!.en,
            "This $P$ is complex and diagonalizes $A$ to $\\operatorname{diag}(\\lambda, \\bar{\\lambda})$; the rotation-scaling form needs a real $P$.",
            "这个 $P$ 是复矩阵，它把 $A$ 对角化为 $\\operatorname{diag}(\\lambda, \\bar{\\lambda})$；旋转缩放形式需要实矩阵 $P$。",
          ],
          [
            wrong[3]!.en,
            "Mixing the real and imaginary parts in each column no longer matches the two equations from $Av = \\lambda v$.",
            "每一列都混合实部和虚部，就不再符合由 $Av = \\lambda v$ 得到的两个等式。",
          ],
        ]);
      },
    },
    {
      id: "the-scaling-factor-of-a-real-matrix-with-complex-eigenvalues",
      figure:
        linearAlgebraDrawings1[
          "reducing-real-2x2-matrices-to-rotation-scaling-form#the-scaling-factor-of-a-real-matrix-with-complex-eigenvalues"
        ],
      title: t("The scaling factor of a real matrix with complex eigenvalues", "具有复特征值的实矩阵的伸缩因子"),
      explanation: t(
        "A real $2 \\times 2$ matrix with eigenvalues $\\alpha \\pm \\beta i$ is similar to the rotation-scaling matrix $C = \\begin{pmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{pmatrix}$. Similar matrices have the same determinant, so the scaling factor of $C$ is\n\n$$r = \\sqrt{\\alpha^2 + \\beta^2} = \\sqrt{\\det A}.$$\n\nRepeated multiplication by $A$ stretches vectors by roughly $r$ each time. For example, $A = \\begin{pmatrix} 2 & -5 \\\\ 5 & 8 \\end{pmatrix}$ has $\\det A = 16 + 25 = 41$ and trace $10$, so its eigenvalues are $5 \\pm 4i$ and $r = \\sqrt{41}$.\n\n> **Watch out.** The scaling factor is $\\sqrt{\\det A}$, not $\\det A$ itself, and not the sum $|\\alpha| + \\beta$.",
        "具有特征值 $\\alpha \\pm \\beta i$ 的实 $2 \\times 2$ 矩阵相似于旋转伸缩矩阵 $C = \\begin{pmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{pmatrix}$。相似矩阵行列式相同，所以 $C$ 的伸缩因子为\n\n$$r = \\sqrt{\\alpha^2 + \\beta^2} = \\sqrt{\\det A}.$$\n\n反复乘以 $A$ 时，向量每次大约被拉伸 $r$ 倍。例如 $A = \\begin{pmatrix} 2 & -5 \\\\ 5 & 8 \\end{pmatrix}$ 有 $\\det A = 16 + 25 = 41$，迹为 $10$，所以特征值为 $5 \\pm 4i$，$r = \\sqrt{41}$。\n\n> **注意。** 伸缩因子是 $\\sqrt{\\det A}$，而不是 $\\det A$ 本身，也不是和 $|\\alpha| + \\beta$。",
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
        const [[p, q], [s, d]] = A;
        return numberProblem({
          prompt: t(
            `The real matrix $A = ${mat2Latex(A)}$ is similar to a rotation-scaling matrix $C$. Find the scaling factor $r$ of $C$.`,
            `实矩阵 $A = ${mat2Latex(A)}$ 相似于旋转伸缩矩阵 $C$。求 $C$ 的伸缩因子 $r$。`,
          ),
          answer: r,
          mistakes: [
            why(r * r, "That is $\\det A = r^2$; take the square root.", "这是 $\\det A = r^2$；还要开平方。"),
            why(
              Math.abs(a) + b,
              "That adds the real and imaginary parts of the eigenvalues; the modulus is $\\sqrt{\\alpha^2 + \\beta^2}$.",
              "这是把特征值的实部和虚部相加；模应为 $\\sqrt{\\alpha^2 + \\beta^2}$。",
            ),
            why(b, "That is only the imaginary part $\\beta$ of the eigenvalues.", "这只是特征值的虚部 $\\beta$。"),
          ].filter((w, i, all) => w.value !== r && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Find the determinant", "求行列式"],
                t("Similar matrices share the determinant, so $\\det C = \\det A$:", "相似矩阵行列式相同，所以 $\\det C = \\det A$："),
                [`\\det A = ${p} \\cdot ${paren(d)} - ${paren(q)} \\cdot ${paren(s)} = ${r * r}`],
              ],
              [["Take the square root", "开平方"], t("", ""), [`r = \\sqrt{\\det C} = \\sqrt{${r * r}} = ${r}`]],
            ],
            t(
              `The trace is $${p + d}$, so the eigenvalues are $${formatComplexPair(a, b)}$, whose modulus is $\\sqrt{${a * a} + ${b * b}} = ${r}$.`,
              `迹为 $${p + d}$，所以特征值为 $${formatComplexPair(a, b)}$，其模为 $\\sqrt{${a * a} + ${b * b}} = ${r}$。`,
            ),
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
  intro: t(
    "A real $3 \\times 3$ matrix $A$ with eigenvalues $2$ and $1 \\pm 3i$ is similar to\n\n$$R = \\begin{pmatrix} 2 & 0 & 0 \\\\ 0 & 1 & -3 \\\\ 0 & 3 & 1 \\end{pmatrix},$$\n\na $1 \\times 1$ block for the real eigenvalue and a $2 \\times 2$ rotation-scaling block for the pair. So $\\operatorname{tr} A = 2 + 1 + 1 = 4$ and $\\det A = 2 \\cdot (1 + 9) = 20$.\n\nCheck: the eigenvalues add to $2 + (1 + 3i) + (1 - 3i) = 4$ and multiply to $2(1 + 3i)(1 - 3i) = 2 \\cdot 10 = 20$.\n\nIn this lesson we read the block structure of the real canonical form from the eigenvalues and use it to find the trace and the determinant.",
    "具有特征值 $2$ 和 $1 \\pm 3i$ 的实 $3 \\times 3$ 矩阵 $A$ 相似于\n\n$$R = \\begin{pmatrix} 2 & 0 & 0 \\\\ 0 & 1 & -3 \\\\ 0 & 3 & 1 \\end{pmatrix},$$\n\n即实特征值对应一个 $1 \\times 1$ 块，复特征值对对应一个 $2 \\times 2$ 旋转缩放块。所以 $\\operatorname{tr} A = 2 + 1 + 1 = 4$，$\\det A = 2 \\cdot (1 + 9) = 20$。\n\n检验：特征值之和为 $2 + (1 + 3i) + (1 - 3i) = 4$，之积为 $2(1 + 3i)(1 - 3i) = 2 \\cdot 10 = 20$。\n\n本课我们由特征值读出实标准型的分块结构，并用它求迹和行列式。",
  ),
  prerequisites: ["reducing-real-2x2-matrices-to-rotation-scaling-form"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "real-canonical-block-structure",
      figure: linearAlgebraDrawings2["block-diagonalization-of-nxn-matrices#real-canonical-block-structure"],
      title: t("Real Canonical Block Structure", "实标准型的分块结构"),
      explanation: t(
        "Each real eigenvalue gives a single diagonal entry, while each pair of complex conjugate eigenvalues gives a two by two rotation scaling block. Determine the block diagonal structure from real and complex conjugate pairs of eigenvalues. For example, a real $4 \\times 4$ matrix with eigenvalues $3$, $-1$ and $2 \\pm i$ has the form $R = \\begin{pmatrix} 3 & 0 & 0 & 0 \\\\ 0 & -1 & 0 & 0 \\\\ 0 & 0 & 2 & -1 \\\\ 0 & 0 & 1 & 2 \\end{pmatrix}$: two $1 \\times 1$ blocks and one $2 \\times 2$ block.\n\n> **Watch out.** A conjugate pair gives one $2 \\times 2$ block, not two $1 \\times 1$ blocks: a non-real eigenvalue cannot stand alone on the diagonal of a real matrix. The block sizes must add up to the size of $A$.",
        "每个实特征值给出一个对角元素，而每对共轭复特征值给出一个二阶旋转缩放块。根据实特征值与共轭复特征值对确定分块对角结构。例如特征值为 $3$、$-1$ 和 $2 \\pm i$ 的实 $4 \\times 4$ 矩阵的形式为 $R = \\begin{pmatrix} 3 & 0 & 0 & 0 \\\\ 0 & -1 & 0 & 0 \\\\ 0 & 0 & 2 & -1 \\\\ 0 & 0 & 1 & 2 \\end{pmatrix}$：两个 $1 \\times 1$ 块和一个 $2 \\times 2$ 块。\n\n> **注意。** 一对共轭复特征值给出一个 $2 \\times 2$ 块，而不是两个 $1 \\times 1$ 块：非实特征值不能单独出现在实矩阵的对角线上。各块的阶数之和必须等于 $A$ 的阶数。",
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
        const counts = [
          [3, 0],
          [1, 1],
          [0, 2],
          [2, 1],
        ] as const;
        const many = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
        const blocks = pairs.map(([a, b]) => `\\begin{pmatrix} ${a} & -${b} \\\\ ${b} & ${a} \\end{pmatrix}`).join(", ");
        const solution = walked(
          [
            [
              ["Sort the eigenvalues", "给特征值分类"],
              t(
                `$A$ has ${many(reals.length, "real eigenvalue")} and ${many(pairs.length, "conjugate pair")}.`,
                `$A$ 有 ${reals.length} 个实特征值和 ${pairs.length} 对共轭复特征值。`,
              ),
            ],
            [
              ["Assign the blocks", "分配各块"],
              t(
                `Each real eigenvalue gives a $1 \\times 1$ block, and each pair $a \\pm bi$ gives a $2 \\times 2$ rotation-scaling block $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$${pairs.length ? `, here $${blocks}$` : ""}. The form has ${options[kind]!.en.toLowerCase()}.`,
                `每个实特征值给出一个 $1 \\times 1$ 块，每对 $a \\pm bi$ 给出一个 $2 \\times 2$ 旋转缩放块 $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$${pairs.length ? `，这里是 $${blocks}$` : ""}。所以实标准型由${options[kind]!["zh-CN"]}组成。`,
              ),
            ],
          ],
          t(
            `The block sizes add up to $${reals.length} \\cdot 1 + ${pairs.length} \\cdot 2 = ${size}$, the size of $A$.`,
            `各块阶数之和为 $${reals.length} \\cdot 1 + ${pairs.length} \\cdot 2 = ${size}$，等于 $A$ 的阶数。`,
          ),
        );
        const reasons = counts.map(([ones, twos], i) => {
          const filled = ones + 2 * twos;
          return [
            options[i]!.en,
            filled !== size
              ? `These blocks fill a $${filled} \\times ${filled}$ matrix, but $A$ is $${size} \\times ${size}$.`
              : `That needs ${many(ones, "real eigenvalue")} and ${many(twos, "conjugate pair")}, but $A$ has ${many(reals.length, "real eigenvalue")} and ${many(pairs.length, "conjugate pair")}.`,
            filled !== size
              ? `这些块组成 $${filled} \\times ${filled}$ 矩阵，而 $A$ 是 $${size} \\times ${size}$ 矩阵。`
              : `那需要 ${ones} 个实特征值和 ${twos} 对共轭复特征值，而 $A$ 有 ${reals.length} 个实特征值和 ${pairs.length} 对共轭复特征值。`,
          ] as const;
        });
        return reasoned(choiceProblem({ prompt, options, correct: kind, solution }), reasons);
      },
    },
    {
      id: "invariants-of-a-real-block-diagonal-form",
      title: t("Invariants of a real block diagonal form", "实块对角形的不变量"),
      explanation: t(
        "A real $3 \\times 3$ matrix with a real eigenvalue $\\mu$ and a complex pair $\\alpha \\pm \\beta i$ is similar to the block diagonal matrix\n\n$$R = \\begin{pmatrix} \\mu & 0 & 0 \\\\ 0 & \\alpha & -\\beta \\\\ 0 & \\beta & \\alpha \\end{pmatrix}.$$\n\nSimilar matrices share trace and determinant, so $\\operatorname{tr} A = \\mu + 2\\alpha$ and $\\det A = \\mu(\\alpha^2 + \\beta^2)$, the determinant of a block diagonal matrix being the product of the block determinants. For example, eigenvalues $-3$ and $2 \\pm i$ give $\\operatorname{tr} A = -3 + 4 = 1$ and $\\det A = -3 \\cdot 5 = -15$.\n\n> **Watch out.** The pair contributes $2\\alpha$ to the trace, because both $\\alpha + \\beta i$ and $\\alpha - \\beta i$ count, and the imaginary parts cancel. Its block determinant is $\\alpha^2 + \\beta^2$, with a plus sign.",
        "具有实特征值 $\\mu$ 和复共轭对 $\\alpha \\pm \\beta i$ 的实 $3 \\times 3$ 矩阵相似于块对角矩阵\n\n$$R = \\begin{pmatrix} \\mu & 0 & 0 \\\\ 0 & \\alpha & -\\beta \\\\ 0 & \\beta & \\alpha \\end{pmatrix}.$$\n\n相似矩阵有相同的迹和行列式，所以 $\\operatorname{tr} A = \\mu + 2\\alpha$，$\\det A = \\mu(\\alpha^2 + \\beta^2)$，因为块对角矩阵的行列式是各块行列式之积。例如特征值 $-3$ 和 $2 \\pm i$ 给出 $\\operatorname{tr} A = -3 + 4 = 1$，$\\det A = -3 \\cdot 5 = -15$。\n\n> **注意。** 复特征值对给迹贡献 $2\\alpha$，因为 $\\alpha + \\beta i$ 和 $\\alpha - \\beta i$ 都要算，虚部相互抵消。它的块行列式是 $\\alpha^2 + \\beta^2$，中间是加号。",
      ),
      generate(rng: Rng): Problem {
        const mu = rng.int(-5, 5) || 2;
        const a = rng.int(-3, 3);
        const b = rng.int(1, 4);
        const wantDet = rng.int(0, 1) === 0;
        const ans = wantDet ? mu * (a * a + b * b) : mu + 2 * a;
        const mistakes = wantDet
          ? [
              why(
                mu * (a * a - b * b),
                "The block determinant is $\\alpha^2 + \\beta^2$, with a plus sign.",
                "块行列式是 $\\alpha^2 + \\beta^2$，中间是加号。",
              ),
              why(mu * a * a, "That drops $\\beta^2$ from the block determinant.", "这漏掉了块行列式中的 $\\beta^2$。"),
              why(
                2 * mu * (a * a + b * b),
                "The pair gives one block whose determinant $\\alpha^2 + \\beta^2$ already covers both eigenvalues.",
                "复特征值对只给出一个块，其行列式 $\\alpha^2 + \\beta^2$ 已包含两个特征值。",
              ),
            ]
          : [
              why(
                mu + a,
                "Both $\\alpha + \\beta i$ and $\\alpha - \\beta i$ count, so the pair adds $2\\alpha$.",
                "$\\alpha + \\beta i$ 和 $\\alpha - \\beta i$ 都要算，所以复特征值对贡献 $2\\alpha$。",
              ),
              why(mu + 2 * a + 2 * b, "The imaginary parts $\\pm \\beta i$ cancel in the trace.", "迹中的虚部 $\\pm \\beta i$ 相互抵消。"),
              why(2 * a, "That leaves out the real eigenvalue $\\mu$.", "这漏掉了实特征值 $\\mu$。"),
            ];
        const R = `\\begin{pmatrix} ${mu} & 0 & 0 \\\\ 0 & ${a} & -${b} \\\\ 0 & ${b} & ${a} \\end{pmatrix}`;
        return numberProblem({
          prompt: t(
            `A real $3 \\times 3$ matrix $A$ has eigenvalues $${mu}$ and $${formatComplexPair(a, b)}$. Find $${wantDet ? "\\det A" : "\\operatorname{tr} A"}$.`,
            `实 $3 \\times 3$ 矩阵 $A$ 的特征值为 $${mu}$ 和 $${formatComplexPair(a, b)}$。求 $${wantDet ? "\\det A" : "\\operatorname{tr} A"}$。`,
          ),
          answer: ans,
          mistakes: mistakes.filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [["Write the block form", "写出分块形式"], t("$A$ is similar to", "$A$ 相似于"), [`R = ${R}`]],
              wantDet
                ? [
                    ["Multiply the block determinants", "各块行列式相乘"],
                    t("", ""),
                    [`\\det A = \\det R = ${mu} \\cdot (${a * a} + ${b * b}) = ${ans}`],
                  ]
                : [
                    ["Add the diagonal", "对角元相加"],
                    t("", ""),
                    [`\\operatorname{tr} A = \\operatorname{tr} R = ${mu} + 2 \\cdot ${paren(a)} = ${ans}`],
                  ],
            ],
            wantDet
              ? t(
                  `The eigenvalues multiply to $${paren(mu)}(${formatComplex(a, b)})(${formatComplex(a, -b)}) = ${paren(mu)} \\cdot ${a * a + b * b} = ${ans}$.`,
                  `特征值之积为 $${paren(mu)}(${formatComplex(a, b)})(${formatComplex(a, -b)}) = ${paren(mu)} \\cdot ${a * a + b * b} = ${ans}$。`,
                )
              : t(
                  `The eigenvalues add to $${mu} + (${formatComplex(a, b)}) + (${formatComplex(a, -b)}) = ${ans}$.`,
                  `特征值之和为 $${mu} + (${formatComplex(a, b)}) + (${formatComplex(a, -b)}) = ${ans}$。`,
                ),
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
  intro: t(
    "The matrix $N = \\begin{pmatrix} 2 & 4 \\\\ -1 & -2 \\end{pmatrix}$ has trace $0$ and determinant $-4 + 4 = 0$, so its characteristic polynomial is $\\lambda^2$ and its only eigenvalue is $0$. The matrix $M = \\begin{pmatrix} 1 & 1 \\\\ 0 & 0 \\end{pmatrix}$ satisfies $M^2 = M$, and its eigenvalues are $1$ and $0$.\n\nCheck: $N^2 = \\begin{pmatrix} 4 - 4 & 8 - 8 \\\\ -2 + 2 & -4 + 4 \\end{pmatrix} = 0$, so $N$ is nilpotent, as an only eigenvalue of $0$ requires for a $2 \\times 2$ matrix.\n\nIn this lesson we find the eigenvalues of nilpotent and idempotent matrices and complete a $2 \\times 2$ matrix so that it is nilpotent.",
    "矩阵 $N = \\begin{pmatrix} 2 & 4 \\\\ -1 & -2 \\end{pmatrix}$ 的迹为 $0$，行列式为 $-4 + 4 = 0$，所以特征多项式为 $\\lambda^2$，唯一的特征值是 $0$。矩阵 $M = \\begin{pmatrix} 1 & 1 \\\\ 0 & 0 \\end{pmatrix}$ 满足 $M^2 = M$，特征值为 $1$ 和 $0$。\n\n检验：$N^2 = \\begin{pmatrix} 4 - 4 & 8 - 8 \\\\ -2 + 2 & -4 + 4 \\end{pmatrix} = 0$，所以 $N$ 是幂零矩阵，这正符合 $2 \\times 2$ 矩阵唯一特征值为 $0$ 的情形。\n\n本课我们求幂零矩阵和幂等矩阵的特征值，并补全一个 $2 \\times 2$ 矩阵使它成为幂零矩阵。",
  ),
  prerequisites: ["block-diagonalization-of-nxn-matrices"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "nilpotent-idempotent-eigenvalues",
      title: t("Eigenvalues of Nilpotent and Idempotent Matrices", "幂零与幂等矩阵的特征值"),
      explanation: t(
        "Applying the defining equation to an eigenvector turns it into an equation for the eigenvalue, which limits the values the eigenvalue can take. Recognize that nilpotent matrices have only eigenvalue 0, and idempotent matrices have only eigenvalues 0 and 1. For example, $N = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ satisfies $N^2 = 0$ and has only the eigenvalue $0$, while the projection $M = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$ satisfies $M^2 = M$ and has eigenvalues $1$ and $0$.\n\n> **Watch out.** A nilpotent matrix need not be the zero matrix, yet its only eigenvalue is $0$ whatever its index. $M^2 = M$ gives $\\lambda^2 = \\lambda$, so $-1$ is not possible; $\\lambda^2 = 1$ would describe $M^2 = I$ instead.",
        "把定义方程作用在特征向量上，就得到关于特征值的方程，从而限制了特征值可能的取值。认识到幂零矩阵的特征值只能为 0，而幂等矩阵的特征值只能为 0 或 1。例如 $N = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ 满足 $N^2 = 0$，只有特征值 $0$；投影 $M = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$ 满足 $M^2 = M$，特征值为 $1$ 和 $0$。\n\n> **注意。** 幂零矩阵不一定是零矩阵，但无论幂零指数是多少，它唯一的特征值都是 $0$。$M^2 = M$ 给出 $\\lambda^2 = \\lambda$，所以 $-1$ 不可能；$\\lambda^2 = 1$ 描述的是 $M^2 = I$。",
      ),
      generate: (rng: Rng): Problem => {
        const n = rng.int(3, 9);
        const k = rng.int(2, n);
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
        const solution = walked(
          [
            [
              [`Use $N^{${k}} = 0$`, `利用 $N^{${k}} = 0$`],
              t(
                `If $N v = \\lambda v$ with $v \\neq 0$, then $N^{${k}} v = \\lambda^{${k}} v = 0$, so $\\lambda^{${k}} = 0$ and $\\lambda = 0$.`,
                `若 $N v = \\lambda v$ 且 $v \\neq 0$，则 $N^{${k}} v = \\lambda^{${k}} v = 0$，所以 $\\lambda^{${k}} = 0$，$\\lambda = 0$。`,
              ),
            ],
            [
              ["Use $M^2 = M$", "利用 $M^2 = M$"],
              t(
                "If $M v = \\lambda v$ with $v \\neq 0$, then $M^2 v = \\lambda^2 v$ must equal $M v = \\lambda v$, so $\\lambda^2 - \\lambda = 0$ and $\\lambda = 0$ or $\\lambda = 1$.",
                "若 $M v = \\lambda v$ 且 $v \\neq 0$，则 $M^2 v = \\lambda^2 v$ 必须等于 $M v = \\lambda v$，所以 $\\lambda^2 - \\lambda = 0$，$\\lambda = 0$ 或 $\\lambda = 1$。",
              ),
            ],
          ],
          t(
            "The projection $\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$ has both eigenvalues $1$ and $0$, and $\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ has characteristic polynomial $\\lambda^2$, so these values do occur.",
            "投影 $\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$ 的特征值为 $1$ 和 $0$，$\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ 的特征多项式为 $\\lambda^2$，所以这些值确实会出现。",
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `$N^{${k}} = 0$ gives $\\lambda^{${k}} = 0$, so $N$ has eigenvalue $0$, and a projection can also have eigenvalue $1$.`,
            `$N^{${k}} = 0$ 给出 $\\lambda^{${k}} = 0$，所以 $N$ 的特征值为 $0$，而投影也可以有特征值 $1$。`,
          ],
          [
            wrong[1]!.en,
            "Each defining equation becomes an equation for $\\lambda$, which allows only a few values.",
            "每个定义方程都化为关于 $\\lambda$ 的方程，只允许少数几个值。",
          ],
          [
            wrong[2]!.en,
            `$\\lambda^{${k}} = 0$ allows only $\\lambda = 0$; $\\pm 1$ raised to a power is never $0$.`,
            `$\\lambda^{${k}} = 0$ 只允许 $\\lambda = 0$；$\\pm 1$ 的幂永远不是 $0$。`,
          ],
          [
            wrong[3]!.en,
            "$M^2 = M$ gives $\\lambda^2 = \\lambda$, not $\\lambda^2 = 1$, so $M$ has $0$ or $1$.",
            "$M^2 = M$ 给出 $\\lambda^2 = \\lambda$，而不是 $\\lambda^2 = 1$，所以 $M$ 的特征值为 $0$ 或 $1$。",
          ],
        ]);
      },
    },
    {
      id: "completing-a-nilpotent-2x2-matrix",
      title: t("Completing a nilpotent 2x2 matrix", "补全幂零 2x2 矩阵"),
      explanation: t(
        "A $2 \\times 2$ matrix is nilpotent exactly when both eigenvalues are $0$, that is when its trace and determinant are both $0$. A matrix with trace $0$ has the form $N = \\begin{pmatrix} a & b \\\\ c & -a \\end{pmatrix}$, and\n\n$$N^2 = (a^2 + bc)I.$$\n\nSo $N^2 = 0$ exactly when $a^2 + bc = 0$, which is the same as $\\det N = 0$. For example, $\\begin{pmatrix} 2 & 4 \\\\ c & -2 \\end{pmatrix}$ is nilpotent when $4 + 4c = 0$, that is $c = -1$.\n\n> **Watch out.** The condition is $a^2 + bc = 0$, with $a$ squared and a plus sign: the diagonal of $N^2$ is $a^2 + bc$.",
        "$2 \\times 2$ 矩阵是幂零的当且仅当两个特征值都是 $0$，即迹和行列式都为 $0$。迹为 $0$ 的矩阵形如 $N = \\begin{pmatrix} a & b \\\\ c & -a \\end{pmatrix}$，且\n\n$$N^2 = (a^2 + bc)I.$$\n\n所以 $N^2 = 0$ 当且仅当 $a^2 + bc = 0$，这与 $\\det N = 0$ 相同。例如 $\\begin{pmatrix} 2 & 4 \\\\ c & -2 \\end{pmatrix}$ 当 $4 + 4c = 0$ 即 $c = -1$ 时是幂零的。\n\n> **注意。** 条件是 $a^2 + bc = 0$：$a$ 要平方，中间是加号，因为 $N^2$ 的对角元是 $a^2 + bc$。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.pick([-4, -2, -1, 1, 2, 4]);
        const m = rng.int(1, 3) * rng.pick([-1, 1]);
        const a = b * m;
        const c = -b * m * m;
        const sum = formatLinearComb2(a * a, "", b, "c");
        return numberProblem({
          prompt: t(
            `Find $c$ so that $N = \\begin{pmatrix} ${a} & ${b} \\\\ c & ${-a} \\end{pmatrix}$ is nilpotent.`,
            `求 $c$，使 $N = \\begin{pmatrix} ${a} & ${b} \\\\ c & ${-a} \\end{pmatrix}$ 为幂零矩阵。`,
          ),
          answer: c,
          solveFor: "c",
          mistakes: [
            why(
              -c,
              "That solves $a^2 - bc = 0$; the diagonal of $N^2$ is $a^2 + bc$.",
              "这是解 $a^2 - bc = 0$ 的结果；$N^2$ 的对角元是 $a^2 + bc$。",
            ),
            why(-m, "That solves $a + bc = 0$; the condition uses $a^2$.", "这是解 $a + bc = 0$ 的结果；条件中是 $a^2$。"),
            why(a * a, "That is $a^2$ itself; solve $a^2 + bc = 0$ for $c$.", "这是 $a^2$ 本身；要由 $a^2 + bc = 0$ 解出 $c$。"),
          ].filter((w, i, all) => w.value !== c && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Square the matrix", "计算平方"],
                t("A matrix with trace $0$ squares to a multiple of $I$:", "迹为 $0$ 的矩阵的平方是 $I$ 的倍数："),
                [`N^2 = (${sum})I`],
              ],
              [["Solve for $c$", "解出 $c$"], t("$N^2 = 0$ needs", "$N^2 = 0$ 要求"), [`${sum} = 0`, `c = ${c}`]],
            ],
            t(
              `With $c = ${c}$, $\\operatorname{tr} N = 0$ and $\\det N = ${-a * a} - ${paren(b * c)} = 0$, so both eigenvalues are $0$.`,
              `取 $c = ${c}$，$\\operatorname{tr} N = 0$，$\\det N = ${-a * a} - ${paren(b * c)} = 0$，所以两个特征值都是 $0$。`,
            ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix}$ has the single eigenvalue $3$ but only the eigenvectors along $(1, 0)$. Take $\\mathbf{v} = (0, 1)$: $(A - 3I)\\mathbf{v} = (1, 0) \\neq \\mathbf{0}$, and $(A - 3I)^2\\mathbf{v} = (A - 3I)(1, 0) = \\mathbf{0}$. So $\\mathbf{v}$ is a generalized eigenvector of rank $2$.\n\nCheck: $A\\mathbf{v} = (1, 3)$ is not a multiple of $(0, 1)$, so $\\mathbf{v}$ is not an ordinary eigenvector, yet $(1, 0)$ and $(0, 1)$ together form a basis.\n\nIn this lesson we state the definition of a generalized eigenvector and find the power of $A - \\lambda I$ that sends every generalized eigenvector to $\\mathbf{0}$.",
    "矩阵 $A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix}$ 只有特征值 $3$，而特征向量只沿 $(1, 0)$ 方向。取 $\\mathbf{v} = (0, 1)$：$(A - 3I)\\mathbf{v} = (1, 0) \\neq \\mathbf{0}$，$(A - 3I)^2\\mathbf{v} = (A - 3I)(1, 0) = \\mathbf{0}$。所以 $\\mathbf{v}$ 是秩为 $2$ 的广义特征向量。\n\n检验：$A\\mathbf{v} = (1, 3)$ 不是 $(0, 1)$ 的倍数，所以 $\\mathbf{v}$ 不是普通特征向量，而 $(1, 0)$ 与 $(0, 1)$ 合起来构成一组基。\n\n本课我们给出广义特征向量的定义，并求出把每个广义特征向量都变为 $\\mathbf{0}$ 的 $A - \\lambda I$ 的幂次。",
  ),
  prerequisites: ["nilpotent-and-idempotent-matrices"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "generalized-eigenvector-definition-kp",
      title: t("Generalized Eigenvector Definition", "广义特征向量的定义"),
      explanation: t(
        "When there are too few eigenvectors, generalized eigenvectors are sent to zero by a higher power of the shifted matrix and fill out the basis. Identify the defining condition $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$ for a generalized eigenvector. For example, for $A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix}$ the vector $(0, 1)$ has $(A - 3I)(0, 1) = (1, 0) \\neq \\mathbf{0}$ and $(A - 3I)^2(0, 1) = \\mathbf{0}$, so it is a generalized eigenvector of rank $2$.\n\n> **Watch out.** The rank $k$ needs both conditions: the $k$-th power sends $\\mathbf{v}$ to $\\mathbf{0}$ and the $(k - 1)$-th power does not. The power is taken of $A - \\lambda I$, not of $A$.",
        "当特征向量不够时，广义特征向量会被平移矩阵的更高次幂映射到零，从而补足一组基。识别广义特征向量的定义条件 $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$。例如对 $A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix}$，向量 $(0, 1)$ 满足 $(A - 3I)(0, 1) = (1, 0) \\neq \\mathbf{0}$，$(A - 3I)^2(0, 1) = \\mathbf{0}$，所以它是秩为 $2$ 的广义特征向量。\n\n> **注意。** 秩 $k$ 需要两个条件：第 $k$ 次幂把 $\\mathbf{v}$ 变为 $\\mathbf{0}$，而第 $k - 1$ 次幂不能。取幂的是 $A - \\lambda I$，不是 $A$。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.nonZero(-5, 5);
        const k = rng.int(2, 6);
        const n = rng.int(k, k + 3);
        const prompt = t(
          `Let $A$ be ${article(n)} $${n} \\times ${n}$ matrix with eigenvalue $\\lambda = ${lambda}$. By definition, a non-zero vector $v$ is a generalized eigenvector of rank $k = ${k}$ corresponding to $\\lambda = ${lambda}$ if and only if:`,
          `设 $A$ 为 $${n} \\times ${n}$ 矩阵，其特征值为 $\\lambda = ${lambda}$。根据定义，非零向量 $v$ 是对应于 $\\lambda = ${lambda}$ 的 $k = ${k}$ 阶广义特征向量当且仅当：`,
        );
        const shiftStr = formatShift(lambda, "I");
        const right = t(
          `$(A${shiftStr})^{${k}} v = 0$ and $(A${shiftStr})^{${k - 1}} v \\neq 0$`,
          `$(A${shiftStr})^{${k}} v = 0$ 且 $(A${shiftStr})^{${k - 1}} v \\neq 0$`,
        );
        const wrong = [
          t(`$(A${shiftStr})^{${k}} v = v$`, `$(A${shiftStr})^{${k}} v = v$`),
          t(`$(A${shiftStr}) v = ${k} v$`, `$(A${shiftStr}) v = ${k} v$`),
          t(`$A^{${k}} v = (${lambda})^{${k}} v$`, `$A^{${k}} v = (${lambda})^{${k}} v$`),
          t(
            `$(A${shiftStr})^{${k}} v \\neq 0$ and $(A${shiftStr})^{${k + 1}} v = 0$`,
            `$(A${shiftStr})^{${k}} v \\neq 0$ 且 $(A${shiftStr})^{${k + 1}} v = 0$`,
          ),
        ];
        const solution = walked(
          [
            [
              ["Shift by the eigenvalue", "按特征值平移"],
              t(
                `For $\\lambda = ${lambda}$ the shifted matrix is $A - \\lambda I = A${shiftStr}$.`,
                `对 $\\lambda = ${lambda}$，平移后的矩阵为 $A - \\lambda I = A${shiftStr}$。`,
              ),
            ],
            [
              ["State both conditions", "写出两个条件"],
              t(
                `Rank $${k}$ means that the $${k}$-th power of $A${shiftStr}$ sends $v$ to $0$ while the power $${k - 1}$ does not: $(A${shiftStr})^{${k}} v = 0$ and $(A${shiftStr})^{${k - 1}} v \\neq 0$.`,
                `秩为 $${k}$ 指 $A${shiftStr}$ 的 $${k}$ 次幂把 $v$ 变为 $0$，而 $${k - 1}$ 次幂不能：$(A${shiftStr})^{${k}} v = 0$ 且 $(A${shiftStr})^{${k - 1}} v \\neq 0$。`,
              ),
            ],
          ],
          t(
            `For rank $1$ the same two conditions read $(A${shiftStr}) v = 0$ and $v \\neq 0$, which is the definition of an ordinary eigenvector.`,
            `对秩 $1$，同样的两个条件变成 $(A${shiftStr}) v = 0$ 且 $v \\neq 0$，正是普通特征向量的定义。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [wrong[0]!.en, "The power must send $v$ to $0$, not back to $v$.", "这个幂应把 $v$ 变成 $0$，而不是变回 $v$。"],
          [wrong[1]!.en, `The rank $${k}$ is an exponent, not a scalar multiplying $v$.`, `秩 $${k}$ 是指数，不是乘 $v$ 的标量。`],
          [
            wrong[2]!.en,
            "An ordinary eigenvector satisfies this, and the definition is about powers of the shifted matrix.",
            "普通特征向量满足这个式子，而定义说的是平移后矩阵的幂。",
          ],
          [wrong[3]!.en, `This describes rank $${k + 1}$, one more than asked.`, `这说的是秩 $${k + 1}$，比题目要求的多 1。`],
        ]);
      },
    },
    {
      id: "the-power-that-kills-every-generalized-eigenvector",
      title: t("The power that kills every generalized eigenvector", "消去所有广义特征向量的幂"),
      explanation: t(
        "Every generalized eigenvector for $\\lambda$ satisfies $(A - \\lambda I)^k\\mathbf{v} = \\mathbf{0}$ for some $k$. On a Jordan block $J_m(\\lambda)$, $(J - \\lambda I)$ shifts the basis vectors down one step, so it takes exactly $m$ applications to reach $\\mathbf{0}$. Hence the smallest $k$ that works for all generalized eigenvectors of $\\lambda$ is the size of the largest Jordan block for $\\lambda$. For example, for $J_3(2) \\oplus J_1(2) \\oplus J_2(5)$ the smallest such $k$ for $\\lambda = 2$ is $3$.\n\n> **Watch out.** Take the largest block for $\\lambda$; do not add the block sizes, and ignore the blocks of other eigenvalues.",
        "$\\lambda$ 的每个广义特征向量都对某个 $k$ 满足 $(A - \\lambda I)^k\\mathbf{v} = \\mathbf{0}$。在若尔当块 $J_m(\\lambda)$ 上，$(J - \\lambda I)$ 把基向量依次下移一步，恰好作用 $m$ 次才得到 $\\mathbf{0}$。所以对 $\\lambda$ 的所有广义特征向量都成立的最小 $k$ 就是 $\\lambda$ 的最大若尔当块的阶数。例如对 $J_3(2) \\oplus J_1(2) \\oplus J_2(5)$，$\\lambda = 2$ 对应的最小 $k$ 为 $3$。\n\n> **注意。** 要取 $\\lambda$ 的最大块；不要把各块阶数相加，也不要考虑其他特征值的块。",
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
          mistakes: [
            why(
              sizes[0]! + sizes[1]!,
              "That adds the block sizes, which gives the dimension of the generalized eigenspace; the largest block decides.",
              "这是把各块阶数相加，得到的是广义特征子空间的维数；起决定作用的是最大块。",
            ),
            why(
              Math.min(...sizes),
              "The smaller block is cleared sooner; every vector needs the largest block.",
              "较小的块更早变为零；要对所有向量成立须看最大块。",
            ),
            why(
              n,
              "That is the size of the whole matrix, including the block of another eigenvalue.",
              "这是整个矩阵的阶数，还包括了另一个特征值的块。",
            ),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Pick the blocks of $\\lambda$", "选出 $\\lambda$ 的块"],
                t(
                  `The blocks for $\\lambda = ${lam}$ have sizes $${sizes[0]}$ and $${sizes[1]}$; the block $J_{${other}}(${mu})$ belongs to another eigenvalue.`,
                  `$\\lambda = ${lam}$ 的块阶数为 $${sizes[0]}$ 和 $${sizes[1]}$；块 $J_{${other}}(${mu})$ 属于另一个特征值。`,
                ),
              ],
              [
                ["Take the largest", "取最大者"],
                t(
                  `A block of size $m$ needs exactly $m$ applications of $A - \\lambda I$, so all of them are cleared by $k = ${ans}$.`,
                  `阶数为 $m$ 的块恰好需要作用 $m$ 次 $A - \\lambda I$，所以 $k = ${ans}$ 能使它们全部变为零。`,
                ),
              ],
            ],
            t(
              `On $J_{${ans}}(${lam})$ the last basis vector needs all $${ans}$ steps to reach $\\mathbf{0}$, so no smaller power works.`,
              `在 $J_{${ans}}(${lam})$ 上，最后一个基向量要经过全部 $${ans}$ 步才变为 $\\mathbf{0}$，所以更小的幂不行。`,
            ),
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
  intro: t(
    "Let $A = \\begin{pmatrix} -1 & 2 & 1 \\\\ 0 & -1 & 3 \\\\ 0 & 0 & -1 \\end{pmatrix}$, so $N = A + I = \\begin{pmatrix} 0 & 2 & 1 \\\\ 0 & 0 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix}$. For $\\mathbf{v} = (1, 1, 1)$: $N\\mathbf{v} = (3, 3, 0)$, $N^2\\mathbf{v} = (6, 0, 0)$ and $N^3\\mathbf{v} = \\mathbf{0}$. So $\\mathbf{v}$ has rank $3$.\n\nCheck: $N(6, 0, 0) = \\mathbf{0}$ because the first column of $N$ is zero, while $N^2\\mathbf{v} = (6, 0, 0) \\neq \\mathbf{0}$ rules out rank $2$.\n\nIn this lesson we find the rank of a generalized eigenvector by applying $A - \\lambda I$ until the zero vector appears.",
    "设 $A = \\begin{pmatrix} -1 & 2 & 1 \\\\ 0 & -1 & 3 \\\\ 0 & 0 & -1 \\end{pmatrix}$，则 $N = A + I = \\begin{pmatrix} 0 & 2 & 1 \\\\ 0 & 0 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix}$。对 $\\mathbf{v} = (1, 1, 1)$：$N\\mathbf{v} = (3, 3, 0)$，$N^2\\mathbf{v} = (6, 0, 0)$，$N^3\\mathbf{v} = \\mathbf{0}$。所以 $\\mathbf{v}$ 的秩为 $3$。\n\n检验：$N$ 的第一列为零，所以 $N(6, 0, 0) = \\mathbf{0}$；而 $N^2\\mathbf{v} = (6, 0, 0) \\neq \\mathbf{0}$ 排除了秩 $2$。\n\n本课我们反复作用 $A - \\lambda I$ 直到出现零向量，以求广义特征向量的秩。",
  ),
  prerequisites: ["generalized-eigenvectors"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "determining-rank-of-generalized-vector",
      title: t("Determining the Rank of a Generalized Vector", "确定广义特征向量的阶"),
      explanation: t(
        "Apply the shifted matrix repeatedly to the vector and count how many applications it takes to reach the zero vector. Find the smallest positive integer $k$ such that $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$. For example, with $A - \\lambda I = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ and $\\mathbf{v} = (0, 2)$: $(A - \\lambda I)\\mathbf{v} = (2, 0) \\neq \\mathbf{0}$ and $(A - \\lambda I)^2\\mathbf{v} = \\mathbf{0}$, so the rank is $2$.\n\n> **Watch out.** Count the applications up to and including the one that gives $\\mathbf{0}$. A nonzero vector has rank at least $1$; an eigenvector has rank $1$, not $0$.",
        "反复用平移后的矩阵作用于这个向量，数出需要作用多少次才能得到零向量。求满足 $(A - \\lambda I)^k \\mathbf{v} = \\mathbf{0}$ 的最小正整数 $k$。例如 $A - \\lambda I = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$，$\\mathbf{v} = (0, 2)$：$(A - \\lambda I)\\mathbf{v} = (2, 0) \\neq \\mathbf{0}$，$(A - \\lambda I)^2\\mathbf{v} = \\mathbf{0}$，所以秩为 $2$。\n\n> **注意。** 要数到得出 $\\mathbf{0}$ 的那一次为止，并把它算在内。非零向量的秩至少为 $1$；特征向量的秩是 $1$，不是 $0$。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.nonZero(-3, 3);
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
        const shift = (x: Vec3): Vec3 => [x[1], x[2], 0];
        const powers: Vec3[] = [v];
        for (let j = 1; j <= rankCase; j++) powers.push(shift(powers[j - 1]!));
        const solution = walked(
          [
            [
              ["Shift by the eigenvalue", "按特征值平移"],
              t("", ""),
              [`N = A${shiftStr} = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix}`],
            ],
            [
              ["Apply $N$ until $\\mathbf{0}$", "作用 $N$ 直到得 $\\mathbf{0}$"],
              t("$N$ moves each entry up one place:", "$N$ 把每个分量上移一位："),
              powers.slice(1).map((p, j) => `N${j === 0 ? "" : `^{${j + 1}}`}v = ${vec3Latex(p)}`),
            ],
          ],
          t(
            `${rankCase === 1 ? "$v$ itself is nonzero" : `$N^{${rankCase - 1}}v = ${vec3Latex(powers[rankCase - 1]!)} \\neq 0$`} and $N^{${rankCase}}v = 0$, so the smallest power that reaches $0$ is $${rankCase}$.`,
            `${rankCase === 1 ? "$v$ 本身非零" : `$N^{${rankCase - 1}}v = ${vec3Latex(powers[rankCase - 1]!)} \\neq 0$`}，而 $N^{${rankCase}}v = 0$，所以得出 $0$ 的最小幂次为 $${rankCase}$。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: rankCase,
          solution,
          mistakes: [0, 1, 2, 3, 4]
            .filter((w) => w !== rankCase)
            .map((w) =>
              w === 0
                ? why(0, "A generalized eigenvector is nonzero, so its rank is at least $1$.", "广义特征向量非零，所以它的秩至少为 $1$。")
                : w < rankCase
                  ? why(w, `$N^{${w}}v = ${vec3Latex(powers[w]!)}$ is not yet $0$.`, `$N^{${w}}v = ${vec3Latex(powers[w]!)}$ 还不是 $0$。`)
                  : why(
                      w,
                      `$N^{${rankCase}}v$ is already $0$, so a smaller power works.`,
                      `$N^{${rankCase}}v$ 已经是 $0$，所以更小的幂就够了。`,
                    ),
            ),
        });
      },
    },
    {
      id: "the-rank-of-a-generalized-eigenvector-for-a-general-nilpotent-part",
      title: t("The rank of a generalized eigenvector", "广义特征向量的秩"),
      explanation: t(
        "A generalized eigenvector $\\mathbf{v}$ for $\\lambda$ has rank $k$ when $(A - \\lambda I)^k\\mathbf{v} = \\mathbf{0}$ but $(A - \\lambda I)^{k-1}\\mathbf{v} \\ne \\mathbf{0}$. To find it, apply $N = A - \\lambda I$ repeatedly and count the steps until the result is the zero vector. An ordinary eigenvector has rank $1$. For example, with $N = \\begin{pmatrix} 0 & 2 & 1 \\\\ 0 & 0 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix}$ and $\\mathbf{v} = (0, 1, 0)$: $N\\mathbf{v} = (2, 0, 0) \\ne \\mathbf{0}$ and $N^2\\mathbf{v} = \\mathbf{0}$, so the rank is $2$.\n\n> **Watch out.** Compute each power from the actual entries of $N$; a nonzero product at one step does not tell you how many steps remain.",
        "若 $(A - \\lambda I)^k\\mathbf{v} = \\mathbf{0}$ 而 $(A - \\lambda I)^{k-1}\\mathbf{v} \\ne \\mathbf{0}$，则 $\\lambda$ 的广义特征向量 $\\mathbf{v}$ 的秩为 $k$。要求秩，反复作用 $N = A - \\lambda I$，数到结果为零向量所需的步数。普通特征向量的秩为 $1$。例如 $N = \\begin{pmatrix} 0 & 2 & 1 \\\\ 0 & 0 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix}$，$\\mathbf{v} = (0, 1, 0)$：$N\\mathbf{v} = (2, 0, 0) \\ne \\mathbf{0}$，$N^2\\mathbf{v} = \\mathbf{0}$，所以秩为 $2$。\n\n> **注意。** 每一次幂都要用 $N$ 的实际元素计算；某一步的乘积非零，并不能说明还剩几步。",
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
        const powers = [v, Nv, N2v];
        const N = mat3Latex([
          [0, p, q],
          [0, 0, r],
          [0, 0, 0],
        ]);
        const lines = [`N\\mathbf{v} = ${vec3Latex(Nv)}`, ...(kind >= 2 ? [`N^2\\mathbf{v} = ${vec3Latex(N2v)}`] : [])];
        return numberProblem({
          prompt: t(
            `For $A = ${mat3Latex(A)}$ with eigenvalue $\\lambda = ${lam}$, find the rank of the generalized eigenvector $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `对特征值为 $\\lambda = ${lam}$ 的 $A = ${mat3Latex(A)}$，求广义特征向量 $\\mathbf{v} = ${vec3Latex(v)}$ 的秩。`,
          ),
          answer: kind,
          mistakes: [1, 2, 3]
            .filter((w) => w !== kind)
            .map((w) =>
              w < kind
                ? why(
                    w,
                    `$N^{${w}}\\mathbf{v} = ${vec3Latex(powers[w]!)}$ is not yet $\\mathbf{0}$.`,
                    `$N^{${w}}\\mathbf{v} = ${vec3Latex(powers[w]!)}$ 还不是 $\\mathbf{0}$。`,
                  )
                : why(
                    w,
                    `$N^{${kind}}\\mathbf{v}$ is already $\\mathbf{0}$, so a smaller power works.`,
                    `$N^{${kind}}\\mathbf{v}$ 已经是 $\\mathbf{0}$，所以更小的幂就够了。`,
                  ),
            ),
          solution: walked(
            [
              [["Shift by the eigenvalue", "按特征值平移"], t("", ""), [`N = A - \\lambda I = ${N}`]],
              [["Apply $N$ repeatedly", "反复作用 $N$"], t("", ""), lines],
            ],
            t(
              kind === 1
                ? "$N\\mathbf{v} = \\mathbf{0}$ with $\\mathbf{v} \\ne \\mathbf{0}$, so $\\mathbf{v}$ is an eigenvector: rank $1$."
                : kind === 2
                  ? "$N\\mathbf{v} \\ne \\mathbf{0}$ and $N^2\\mathbf{v} = \\mathbf{0}$, so the rank is $2$."
                  : "$N^2\\mathbf{v} \\ne \\mathbf{0}$, while $N^3 = 0$ for this strictly upper triangular $N$, so the rank is $3$.",
              kind === 1
                ? "$N\\mathbf{v} = \\mathbf{0}$ 且 $\\mathbf{v} \\ne \\mathbf{0}$，所以 $\\mathbf{v}$ 是特征向量：秩为 $1$。"
                : kind === 2
                  ? "$N\\mathbf{v} \\ne \\mathbf{0}$，$N^2\\mathbf{v} = \\mathbf{0}$，所以秩为 $2$。"
                  : "$N^2\\mathbf{v} \\ne \\mathbf{0}$，而对这个严格上三角的 $N$ 有 $N^3 = 0$，所以秩为 $3$。",
            ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 2 & 3 \\\\ 0 & 2 \\end{pmatrix}$ has eigenvalue $2$ with eigenvector $\\mathbf{v}_1 = (3, 0)$. To find a rank-$2$ vector, solve $(A - 2I)\\mathbf{v}_2 = \\mathbf{v}_1$: the system $\\begin{pmatrix} 0 & 3 \\\\ 0 & 0 \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 0 \\end{pmatrix}$ gives $y = 1$, so $\\mathbf{v}_2 = (0, 1)$ works.\n\nCheck: $(A - 2I)(0, 1) = (3, 0) = \\mathbf{v}_1 \\neq \\mathbf{0}$ and $(A - 2I)\\mathbf{v}_1 = \\mathbf{0}$, so $\\mathbf{v}_2$ has rank $2$.\n\nIn this lesson we solve for generalized eigenvectors of rank $2$ and build a Jordan chain down from a vector of rank $3$.",
    "矩阵 $A = \\begin{pmatrix} 2 & 3 \\\\ 0 & 2 \\end{pmatrix}$ 有特征值 $2$ 和特征向量 $\\mathbf{v}_1 = (3, 0)$。要找秩为 $2$ 的向量，解 $(A - 2I)\\mathbf{v}_2 = \\mathbf{v}_1$：方程组 $\\begin{pmatrix} 0 & 3 \\\\ 0 & 0 \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 0 \\end{pmatrix}$ 给出 $y = 1$，所以可取 $\\mathbf{v}_2 = (0, 1)$。\n\n检验：$(A - 2I)(0, 1) = (3, 0) = \\mathbf{v}_1 \\neq \\mathbf{0}$，且 $(A - 2I)\\mathbf{v}_1 = \\mathbf{0}$，所以 $\\mathbf{v}_2$ 的秩为 $2$。\n\n本课我们求秩为 $2$ 的广义特征向量，并由秩为 $3$ 的向量向下构造若尔当链。",
  ),
  prerequisites: ["ranks-of-generalized-eigenvectors"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "solving-for-rank-2-generalized-eigenvector-kp",
      title: t("Solving for Rank-2 Generalized Eigenvectors", "求解 2 阶广义特征向量"),
      explanation: t(
        "A generalized eigenvector of rank two is a vector that the shifted matrix sends to an ordinary eigenvector, so solve a linear system with that eigenvector on the right. Solve $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$, where $\\mathbf{v}_1$ is an ordinary eigenvector. For example, $A = \\begin{pmatrix} 2 & 3 \\\\ 0 & 2 \\end{pmatrix}$ has $\\mathbf{v}_1 = (3, 0)$, and $(A - 2I)\\mathbf{v}_2 = \\mathbf{v}_1$ reads $3y = 3$, so $\\mathbf{v}_2 = (0, 1)$.\n\n> **Watch out.** The right side is $\\mathbf{v}_1$, not $\\mathbf{0}$: solving $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ only gives eigenvectors again.",
        "二阶广义特征向量被平移矩阵映射为一个普通特征向量，所以要解右边为该特征向量的线性方程组。求解 $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$，其中 $\\mathbf{v}_1$ 为普通特征向量。例如 $A = \\begin{pmatrix} 2 & 3 \\\\ 0 & 2 \\end{pmatrix}$ 有 $\\mathbf{v}_1 = (3, 0)$，$(A - 2I)\\mathbf{v}_2 = \\mathbf{v}_1$ 化为 $3y = 3$，所以 $\\mathbf{v}_2 = (0, 1)$。\n\n> **注意。** 右边是 $\\mathbf{v}_1$，不是 $\\mathbf{0}$：解 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$ 只会再次得到特征向量。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.nonZero(-5, 5);
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
        const solution = walked(
          [
            [
              ["Write the system", "写出方程组"],
              t("", ""),
              [
                `\\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${k} \\\\ 0 \\end{pmatrix}`,
              ],
            ],
            [
              ["Solve", "求解"],
              t(
                `The first row requires $${k}y = ${k}$, so $y = 1$; the second row holds for every vector. With $x = 0$, $\\mathbf{v}_2 = \\langle 0, 1 \\rangle$.`,
                `第一行要求 $${k}y = ${k}$，所以 $y = 1$；第二行对任何向量都成立。取 $x = 0$，得 $\\mathbf{v}_2 = \\langle 0, 1 \\rangle$。`,
              ),
            ],
          ],
          t(
            `$(A${shiftStr})\\langle 0, 1 \\rangle = \\langle ${k}, 0 \\rangle = v_1 \\neq 0$ and $(A${shiftStr})v_1 = 0$, so $\\langle 0, 1 \\rangle$ has rank $2$.`,
            `$(A${shiftStr})\\langle 0, 1 \\rangle = \\langle ${k}, 0 \\rangle = v_1 \\neq 0$，且 $(A${shiftStr})v_1 = 0$，所以 $\\langle 0, 1 \\rangle$ 的秩为 $2$。`,
          ),
        );
        return withMistakes(
          pointProblem({ prompt, answer: [0, 1], vector: true, solution }),
          dedupeSaid(
            [
              say(
                vectorLatex([1, 0]),
                "That is an eigenvector: $A - \\lambda I$ sends it to $0$, not to $v_1$.",
                "这是特征向量：$A - \\lambda I$ 把它变为 $0$，而不是 $v_1$。",
              ),
              say(
                vectorLatex([1, 1]),
                "This solves the system, but its first component is $1$, not $0$.",
                "它满足方程组，但第一分量是 $1$，不是 $0$。",
              ),
              say(
                vectorLatex([0, k]),
                `$A - \\lambda I$ sends this to $\\langle ${k * k}, 0 \\rangle$, which is $${k}v_1$, not $v_1$.`,
                `$A - \\lambda I$ 把它变为 $\\langle ${k * k}, 0 \\rangle$，即 $${k}v_1$，而不是 $v_1$。`,
              ),
              say(
                vectorLatex([k, 0]),
                "That is $v_1$ itself, which $A - \\lambda I$ sends to $0$.",
                "这就是 $v_1$ 本身，$A - \\lambda I$ 把它变为 $0$。",
              ),
            ],
            vectorLatex([0, 1]),
          ),
        );
      },
    },
    {
      id: "building-a-jordan-chain-from-a-rank-3-generalized-eigenvector",
      title: t("Building a Jordan chain from a rank-3 vector", "由秩 3 向量构造若尔当链"),
      explanation: t(
        "Once a generalized eigenvector $\\mathbf{v}_3$ of rank $3$ is known, the rest of its Jordan chain follows by multiplication: $\\mathbf{v}_2 = (A - \\lambda I)\\mathbf{v}_3$ has rank $2$ and $\\mathbf{v}_1 = (A - \\lambda I)\\mathbf{v}_2$ has rank $1$, so it is an ordinary eigenvector. Each step lowers the rank by exactly one. For example, with $A - \\lambda I = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 2 \\\\ 0 & 0 & 0 \\end{pmatrix}$ and $\\mathbf{v}_3 = (0, 0, 1)$: $\\mathbf{v}_2 = (0, 2, 0)$ and $\\mathbf{v}_1 = (2, 0, 0)$.\n\n> **Watch out.** Multiply by $A - \\lambda I$, not by $A$. One multiplication gives $\\mathbf{v}_2$; the second gives the eigenvector $\\mathbf{v}_1$.",
        "一旦知道秩为 $3$ 的广义特征向量 $\\mathbf{v}_3$，其若尔当链的其余部分可由乘法得到：$\\mathbf{v}_2 = (A - \\lambda I)\\mathbf{v}_3$ 的秩为 $2$，$\\mathbf{v}_1 = (A - \\lambda I)\\mathbf{v}_2$ 的秩为 $1$，即普通特征向量。每一步秩恰好降低一。例如 $A - \\lambda I = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 2 \\\\ 0 & 0 & 0 \\end{pmatrix}$，$\\mathbf{v}_3 = (0, 0, 1)$：$\\mathbf{v}_2 = (0, 2, 0)$，$\\mathbf{v}_1 = (2, 0, 0)$。\n\n> **注意。** 要乘 $A - \\lambda I$，而不是 $A$。乘一次得到 $\\mathbf{v}_2$；乘第二次得到特征向量 $\\mathbf{v}_1$。",
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
        const answer = vectorLatex([v2[0], v2[1], v2[2]]);
        return withMistakes(
          pointProblem({
            prompt: t(
              `$A = ${mat3Latex(A)}$ has the single eigenvalue $\\lambda = ${lam}$, and $\\mathbf{v}_3 = ${vec3Latex(v3)}$ is a generalized eigenvector of rank $3$. Find $\\mathbf{v}_2 = (A - \\lambda I)\\mathbf{v}_3$.`,
              `$A = ${mat3Latex(A)}$ 只有特征值 $\\lambda = ${lam}$，$\\mathbf{v}_3 = ${vec3Latex(v3)}$ 是秩为 $3$ 的广义特征向量。求 $\\mathbf{v}_2 = (A - \\lambda I)\\mathbf{v}_3$。`,
            ),
            answer: [v2[0], v2[1], v2[2]],
            vector: true,
            solution: walked(
              [
                [
                  ["Shift by the eigenvalue", "按特征值平移"],
                  t("", ""),
                  [
                    `A - \\lambda I = ${mat3Latex([
                      [0, p, q],
                      [0, 0, r],
                      [0, 0, 0],
                    ])}`,
                  ],
                ],
                [
                  ["Multiply by $\\mathbf{v}_3$", "乘以 $\\mathbf{v}_3$"],
                  t("Row by row:", "逐行计算："),
                  [
                    `${paren(p)} \\cdot ${paren(v3[1])} + ${paren(q)} \\cdot ${paren(v3[2])} = ${v2[0]}`,
                    `${paren(r)} \\cdot ${paren(v3[2])} = ${v2[1]}`,
                    `\\mathbf{v}_2 = ${vec3Latex(v2)}`,
                  ],
                ],
              ],
              t(
                `One more step gives $\\mathbf{v}_1 = (A - \\lambda I)\\mathbf{v}_2 = ${vec3Latex(v1)} \\neq \\mathbf{0}$, and $(A - \\lambda I)\\mathbf{v}_1 = \\mathbf{0}$, so $\\mathbf{v}_1$ is an eigenvector and $\\mathbf{v}_2$ has rank $2$.`,
                `再作用一次得到 $\\mathbf{v}_1 = (A - \\lambda I)\\mathbf{v}_2 = ${vec3Latex(v1)} \\neq \\mathbf{0}$，且 $(A - \\lambda I)\\mathbf{v}_1 = \\mathbf{0}$，所以 $\\mathbf{v}_1$ 是特征向量，$\\mathbf{v}_2$ 的秩为 $2$。`,
              ),
            ),
          }),
          dedupeSaid(
            [
              say(
                vectorLatex([v1[0], 0, 0]),
                "That is $\\mathbf{v}_1 = (A - \\lambda I)^2\\mathbf{v}_3$, one step too far.",
                "这是 $\\mathbf{v}_1 = (A - \\lambda I)^2\\mathbf{v}_3$，多算了一步。",
              ),
              say(
                vectorLatex([q * v3[1] + p * v3[2], r * v3[2], 0]),
                "The entries of the first row were used in swapped places; multiply each entry by the matching component.",
                "第一行的元素用错了位置；每个元素要乘以对应的分量。",
              ),
              say(
                vectorLatex([p * v3[1] + q * v3[2] + lam * v3[0], r * v3[2] + lam * v3[1], lam * v3[2]]),
                "That is $A\\mathbf{v}_3$; subtract $\\lambda I$ first and multiply by $A - \\lambda I$.",
                "这是 $A\\mathbf{v}_3$；要先减去 $\\lambda I$，再乘以 $A - \\lambda I$。",
              ),
            ],
            answer,
          ),
        );
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
  intro: t(
    "The Jordan matrix $J = J_2(4) \\oplus J_1(4) = \\begin{pmatrix} 4 & 1 & 0 \\\\ 0 & 4 & 0 \\\\ 0 & 0 & 4 \\end{pmatrix}$ has two blocks for the eigenvalue $4$. Then $J - 4I = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$ has rank $1$, so the eigenspace of $4$ has dimension $3 - 1 = 2$, one direction per block.\n\nCheck: $(J - 4I)\\mathbf{e}_1 = \\mathbf{0}$ and $(J - 4I)\\mathbf{e}_3 = \\mathbf{0}$, two independent eigenvectors, while $(J - 4I)\\mathbf{e}_2 = \\mathbf{e}_1 \\neq \\mathbf{0}$.\n\nIn this lesson we recognize Jordan blocks and Jordan matrices and find the rank of $J - \\lambda I$ from the blocks.",
    "若尔当矩阵 $J = J_2(4) \\oplus J_1(4) = \\begin{pmatrix} 4 & 1 & 0 \\\\ 0 & 4 & 0 \\\\ 0 & 0 & 4 \\end{pmatrix}$ 对特征值 $4$ 有两个块。于是 $J - 4I = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$ 的秩为 $1$，所以 $4$ 的特征空间维数为 $3 - 1 = 2$，每个块一个方向。\n\n检验：$(J - 4I)\\mathbf{e}_1 = \\mathbf{0}$，$(J - 4I)\\mathbf{e}_3 = \\mathbf{0}$，是两个线性无关的特征向量；而 $(J - 4I)\\mathbf{e}_2 = \\mathbf{e}_1 \\neq \\mathbf{0}$。\n\n本课我们识别若尔当块与若尔当矩阵，并由各块求出 $J - \\lambda I$ 的秩。",
  ),
  prerequisites: ["finding-generalized-eigenvectors-of-specific-ranks"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "jordan-block-structure-definition",
      title: t("Jordan Block Structure Definition", "若尔当块的结构定义"),
      explanation: t(
        "A Jordan block has one eigenvalue repeated down the diagonal and ones just above it, and a Jordan matrix places such blocks along the diagonal. Identify Jordan blocks and block diagonal Jordan matrices. For example, $J_2(5) = \\begin{pmatrix} 5 & 1 \\\\ 0 & 5 \\end{pmatrix}$, and $J_2(5) \\oplus J_1(-1) = \\begin{pmatrix} 5 & 1 & 0 \\\\ 0 & 5 & 0 \\\\ 0 & 0 & -1 \\end{pmatrix}$.\n\n> **Watch out.** The ones sit on the superdiagonal, just above the diagonal, never below it and never further out. $\\lambda I$ has no ones at all: it is a sum of $1 \\times 1$ blocks, not one large block.",
        "若尔当块的对角线上是同一个重复的特征值，紧挨着对角线上方是 1，若尔当矩阵则把这样的块沿对角线排列。识别若尔当块及分块对角的若尔当矩阵。例如 $J_2(5) = \\begin{pmatrix} 5 & 1 \\\\ 0 & 5 \\end{pmatrix}$，$J_2(5) \\oplus J_1(-1) = \\begin{pmatrix} 5 & 1 & 0 \\\\ 0 & 5 & 0 \\\\ 0 & 0 & -1 \\end{pmatrix}$。\n\n> **注意。** 1 位于上对角线，紧挨在对角线上方，既不在下方，也不在更远处。$\\lambda I$ 中根本没有 1：它是若干 $1 \\times 1$ 块之和，而不是一个大块。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.int(-8, 8);
        const isDim2 = rng.bool();
        const m2 = (x: Mat2): Text => t(`$${mat2Latex(x)}$`, `$${mat2Latex(x)}$`);
        const m3 = (x: Mat3): Text => t(`$${mat3Latex(x)}$`, `$${mat3Latex(x)}$`);
        const size = isDim2 ? 2 : 3;
        const block = isDim2
          ? mat2Latex([
              [lambda, 1],
              [0, lambda],
            ])
          : mat3Latex([
              [lambda, 1, 0],
              [0, lambda, 1],
              [0, 0, lambda],
            ]);
        const prompt = t(
          `Which of the following matrices represents a $${size} \\times ${size}$ Jordan block $J_${size}(${lambda})$ associated with eigenvalue $\\lambda = ${lambda}$?`,
          `下列哪个矩阵表示对应特征值 $\\lambda = ${lambda}$ 的 $${size} \\times ${size}$ 若尔当块 $J_${size}(${lambda})$？`,
        );
        const right = t(`$${block}$`, `$${block}$`);
        const wrong = isDim2
          ? [
              m2([
                [lambda, 0],
                [1, lambda],
              ]),
              m2([
                [lambda, 0],
                [0, lambda],
              ]),
              m2([
                [1, lambda],
                [0, 1],
              ]),
              m2([
                [lambda, 1],
                [1, lambda],
              ]),
            ]
          : [
              m3([
                [lambda, 0, 0],
                [1, lambda, 0],
                [0, 1, lambda],
              ]),
              m3([
                [lambda, 0, 0],
                [0, lambda, 0],
                [0, 0, lambda],
              ]),
              m3([
                [1, lambda, 0],
                [0, 1, lambda],
                [0, 0, 1],
              ]),
              m3([
                [lambda, 1, 1],
                [0, lambda, 1],
                [0, 0, lambda],
              ]),
            ];
        const shifted = isDim2
          ? "\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}"
          : "\\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix}";
        const solution = walked(
          [
            [
              ["Fill the diagonal", "填对角线"],
              t(
                `Every diagonal entry of $J_${size}(${lambda})$ is the eigenvalue $${lambda}$.`,
                `$J_${size}(${lambda})$ 的每个对角元都是特征值 $${lambda}$。`,
              ),
            ],
            [
              ["Put ones just above it", "在其上方放 1"],
              t("The superdiagonal holds $1$s and every other entry is $0$:", "上对角线上为 $1$，其余元素都为 $0$："),
              [`J_${size}(${lambda}) = ${block}`],
            ],
          ],
          t(
            `$J_${size}(${lambda}) - ${paren(lambda)}I = ${shifted}$ has rank $${size - 1}$, so there is only one eigenvector direction, as a single block requires.`,
            `$J_${size}(${lambda}) - ${paren(lambda)}I = ${shifted}$ 的秩为 $${size - 1}$，所以只有一个特征向量方向，正符合单个块的要求。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The ones sit below the diagonal; in a Jordan block they sit just above it.",
            "这里的 1 在对角线下方；若尔当块中的 1 紧挨在对角线上方。",
          ],
          [
            wrong[1]!.en,
            `This is $${paren(lambda)}I$, a sum of $1 \\times 1$ blocks, with no ones above the diagonal.`,
            `这是 $${paren(lambda)}I$，是若干 $1 \\times 1$ 块之和，对角线上方没有 1。`,
          ],
          [
            wrong[2]!.en,
            "The eigenvalue and the ones are swapped: $\\lambda$ goes on the diagonal, $1$ just above it.",
            "特征值和 1 的位置互换了：$\\lambda$ 应在对角线上，$1$ 紧挨在其上方。",
          ],
          [
            wrong[3]!.en,
            isDim2 ? "The entry below the diagonal must be $0$." : "The corner entry must be $0$; only the superdiagonal holds ones.",
            isDim2 ? "对角线下方的元素必须是 $0$。" : "角上的元素必须是 $0$；只有上对角线上是 1。",
          ],
        ]);
      },
    },
    {
      id: "the-rank-of-a-shifted-jordan-matrix",
      title: t("The rank of a shifted Jordan matrix", "平移后若尔当矩阵的秩"),
      explanation: t(
        "Subtracting $\\lambda I$ from a Jordan matrix turns every block $J_m(\\lambda)$ into a nilpotent block of rank $m - 1$, while blocks for other eigenvalues stay invertible and keep full rank. Adding up, $\\operatorname{rank}(J - \\lambda I) = n - (\\text{number of blocks for } \\lambda)$. Equivalently, the number of blocks for $\\lambda$ equals the dimension of its eigenspace. For example, $J_2(3) \\oplus J_1(3) \\oplus J_2(1)$ is $5 \\times 5$ with two blocks for $3$, so $\\operatorname{rank}(J - 3I) = 5 - 2 = 3$.\n\n> **Watch out.** Subtract the number of blocks for $\\lambda$, not their total size, and leave the blocks of other eigenvalues at full rank.",
        "从若尔当矩阵中减去 $\\lambda I$，每个块 $J_m(\\lambda)$ 变成秩为 $m - 1$ 的幂零块，而其他特征值的块仍可逆、保持满秩。相加得 $\\operatorname{rank}(J - \\lambda I) = n - (\\lambda \\text{ 的块数})$。等价地，$\\lambda$ 的块数等于其特征空间的维数。例如 $J_2(3) \\oplus J_1(3) \\oplus J_2(1)$ 为 $5 \\times 5$ 矩阵，$3$ 有两个块，所以 $\\operatorname{rank}(J - 3I) = 5 - 2 = 3$。\n\n> **注意。** 要减去 $\\lambda$ 的块数，而不是这些块的总阶数；其他特征值的块保持满秩。",
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
          mistakes: [
            why(
              own.length,
              "That is the number of blocks for $\\lambda$, which is the nullity, not the rank.",
              "这是 $\\lambda$ 的块数，即零度，而不是秩。",
            ),
            why(
              n - ownSize,
              `That counts only the blocks of $${mu}$; each block $J_m(${lam})$ still keeps rank $m - 1$.`,
              `这只算了 $${mu}$ 的块；每个块 $J_m(${lam})$ 仍保留秩 $m - 1$。`,
            ),
            why(
              n - others.length,
              `That subtracts the blocks of $${mu}$, which stay invertible; subtract the blocks of $${lam}$.`,
              `这减去的是 $${mu}$ 的块，而它们仍可逆；应减去 $${lam}$ 的块。`,
            ),
            why(
              n,
              `The blocks for $${lam}$ become singular, so the rank drops below $${n}$.`,
              `$${lam}$ 的块变为奇异，所以秩小于 $${n}$。`,
            ),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Count the blocks", "数块"],
                t(
                  `$J$ is $${n} \\times ${n}$ and has $${own.length}$ block${own.length === 1 ? "" : "s"} for $\\lambda = ${lam}$.`,
                  `$J$ 为 $${n} \\times ${n}$ 矩阵，$\\lambda = ${lam}$ 有 $${own.length}$ 个块。`,
                ),
              ],
              [
                ["Lose one rank per block", "每块秩减一"],
                t(
                  `Each block $J_m(${lam})$ becomes nilpotent of rank $m - 1$, and the blocks of $${mu}$ keep full rank:`,
                  `每个块 $J_m(${lam})$ 变成秩为 $m - 1$ 的幂零块，$${mu}$ 的块保持满秩：`,
                ),
                [`\\operatorname{rank}(J${formatShift(lam)}) = ${n} - ${own.length} = ${ans}`],
              ],
            ],
            t(
              `The nullity is $${own.length}$, one eigenvector per block, and $${ans} + ${own.length} = ${n}$ as rank and nullity must add up to the size.`,
              `零度为 $${own.length}$，每个块一个特征向量；$${ans} + ${own.length} = ${n}$，秩与零度之和正等于阶数。`,
            ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 4 & 1 \\\\ -1 & 2 \\end{pmatrix}$ has trace $6$ and determinant $8 + 1 = 9$, so its characteristic polynomial is $(\\lambda - 3)^2$. The matrix $A - 3I = \\begin{pmatrix} 1 & 1 \\\\ -1 & -1 \\end{pmatrix}$ has rank $1$, so there is only one eigenvector direction and $J = \\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix}$.\n\nCheck: $\\operatorname{tr} J = 6$ and $\\det J = 9$ match $A$, and $A \\neq 3I$, so $A$ cannot be similar to the diagonal matrix $3I$.\n\nIn this lesson we decide whether a $2 \\times 2$ matrix with a repeated eigenvalue is diagonal or a single Jordan block, and find the eigenvalue in that block.",
    "矩阵 $A = \\begin{pmatrix} 4 & 1 \\\\ -1 & 2 \\end{pmatrix}$ 的迹为 $6$，行列式为 $8 + 1 = 9$，所以特征多项式为 $(\\lambda - 3)^2$。矩阵 $A - 3I = \\begin{pmatrix} 1 & 1 \\\\ -1 & -1 \\end{pmatrix}$ 的秩为 $1$，所以只有一个特征向量方向，$J = \\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix}$。\n\n检验：$\\operatorname{tr} J = 6$，$\\det J = 9$，与 $A$ 一致；而 $A \\neq 3I$，所以 $A$ 不可能相似于对角矩阵 $3I$。\n\n本课我们判断有重特征值的 $2 \\times 2$ 矩阵是对角形还是单个若尔当块，并求出该块中的特征值。",
  ),
  prerequisites: ["jordan-blocks-and-jordan-matrices"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "determining-jordan-form-2x2-kp",
      title: t("Determining the Jordan Form of a 2x2 Matrix", "确定 2x2 矩阵的若尔当标准型"),
      explanation: t(
        "A two by two matrix with a repeated eigenvalue is diagonalizable only if it is already a multiple of the identity; otherwise it is similar to a single Jordan block. Distinguish diagonalizable $2 \\times 2$ matrices from those similar to a single Jordan block $\\begin{bmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{bmatrix}$. For example, $\\begin{pmatrix} 2 & 5 \\\\ 0 & 2 \\end{pmatrix}$ is not $2I$, so its Jordan form is $\\begin{pmatrix} 2 & 1 \\\\ 0 & 2 \\end{pmatrix}$.\n\n> **Watch out.** The entry above the diagonal of a Jordan block is always $1$, whatever the corresponding entry of $A$, so $A$ itself is usually not its own Jordan form.",
        "有重复特征值的二阶矩阵只有本身就是单位矩阵的倍数时才能对角化，否则它与一个若尔当块相似。区分可对角化的 $2 \\times 2$ 矩阵与相似于单个若尔当块 $\\begin{bmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{bmatrix}$ 的矩阵。例如 $\\begin{pmatrix} 2 & 5 \\\\ 0 & 2 \\end{pmatrix}$ 不是 $2I$，所以它的若尔当形为 $\\begin{pmatrix} 2 & 1 \\\\ 0 & 2 \\end{pmatrix}$。\n\n> **注意。** 若尔当块对角线上方的元素总是 $1$，与 $A$ 中对应元素无关，所以 $A$ 本身通常不是自己的若尔当形。",
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
        const m2 = (x: Mat2): Text => t(`$${mat2Latex(x)}$`, `$${mat2Latex(x)}$`);
        const prompt = t(
          `Find the Jordan canonical form $J$ of the matrix $A = ${mat2Latex(matA)}$.`,
          `求矩阵 $A = ${mat2Latex(matA)}$ 的若尔当标准型 $J$。`,
        );
        const right = m2(matJ);
        const wrong = [
          m2([
            [lambda, 0],
            [0, lambda],
          ]),
          m2(matA),
          m2([
            [1, lambda],
            [0, 1],
          ]),
          m2([
            [lambda, 1],
            [1, lambda],
          ]),
        ];
        const shiftStr = formatShift(lambda, "I");
        const solution = walked(
          [
            [
              ["Find the eigenvalue", "求特征值"],
              t(
                `$A$ is triangular with both diagonal entries $${lambda}$, so $\\lambda = ${lambda}$ has algebraic multiplicity $2$.`,
                `$A$ 是三角矩阵，两个对角元都是 $${lambda}$，所以 $\\lambda = ${lambda}$ 的代数重数为 $2$。`,
              ),
            ],
            [
              ["Count the eigenvectors", "数特征向量"],
              t(
                `$A${shiftStr} = \\begin{pmatrix} 0 & ${a} \\\\ 0 & 0 \\end{pmatrix}$ has rank $1$, so the geometric multiplicity is $2 - 1 = 1 < 2$.`,
                `$A${shiftStr} = \\begin{pmatrix} 0 & ${a} \\\\ 0 & 0 \\end{pmatrix}$ 的秩为 $1$，所以几何重数为 $2 - 1 = 1 < 2$。`,
              ),
            ],
            [
              ["Write the Jordan form", "写出若尔当形"],
              t("One eigenvector means one $2 \\times 2$ block:", "只有一个特征向量，意味着一个 $2 \\times 2$ 块："),
              [`J = ${mat2Latex(matJ)}`],
            ],
          ],
          t(
            `$\\operatorname{tr} J = ${2 * lambda} = \\operatorname{tr} A$ and $\\det J = ${lambda * lambda} = \\det A$, as similar matrices require.`,
            `$\\operatorname{tr} J = ${2 * lambda} = \\operatorname{tr} A$，$\\det J = ${lambda * lambda} = \\det A$，正符合相似矩阵的要求。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `$A$ would have to equal $${paren(lambda)}I$ to be diagonalizable, but $A${shiftStr}$ has rank $1$.`,
            `$A$ 要可对角化必须等于 $${paren(lambda)}I$，但 $A${shiftStr}$ 的秩为 $1$。`,
          ],
          [
            wrong[1]!.en,
            `$A$ is similar to $J$, but the entry above the diagonal of a Jordan block is $1$, not $${a}$.`,
            `$A$ 与 $J$ 相似，但若尔当块对角线上方的元素是 $1$，不是 $${a}$。`,
          ],
          [
            wrong[2]!.en,
            "This matrix has eigenvalue $1$; the eigenvalue belongs on the diagonal and $1$ above it.",
            "这个矩阵的特征值是 $1$；特征值应在对角线上，$1$ 在其上方。",
          ],
          [
            wrong[3]!.en,
            `This symmetric matrix has eigenvalues $${lambda} \\pm 1$, not $${lambda}$ twice.`,
            `这个对称矩阵的特征值是 $${lambda} \\pm 1$，而不是两个 $${lambda}$。`,
          ],
        ]);
      },
    },
    {
      id: "the-eigenvalue-in-the-jordan-block-of-a-defective-2x2-matrix",
      title: t("The eigenvalue in a defective 2×2 Jordan block", "亏损 2×2 矩阵若尔当块中的特征值"),
      explanation: t(
        "A $2 \\times 2$ matrix that is not diagonalizable has one repeated eigenvalue $\\lambda$, and its Jordan form is $\\begin{pmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{pmatrix}$. Similar matrices have the same trace, so $2\\lambda = \\operatorname{tr} A$ and $\\lambda = \\tfrac{1}{2}\\operatorname{tr} A$. The determinant gives a check: $\\det A = \\lambda^2$. For example, $A = \\begin{pmatrix} 5 & 1 \\\\ -4 & 1 \\end{pmatrix}$ has trace $6$, so $\\lambda = 3$, and indeed $\\det A = 5 + 4 = 9 = 3^2$.\n\n> **Watch out.** $\\lambda$ is half the trace, not the trace itself, and the diagonal entries of $A$ need not be eigenvalues.",
        "不可对角化的 $2 \\times 2$ 矩阵只有一个重特征值 $\\lambda$，其若尔当形为 $\\begin{pmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{pmatrix}$。相似矩阵的迹相同，所以 $2\\lambda = \\operatorname{tr} A$，$\\lambda = \\tfrac{1}{2}\\operatorname{tr} A$。行列式可作检验：$\\det A = \\lambda^2$。例如 $A = \\begin{pmatrix} 5 & 1 \\\\ -4 & 1 \\end{pmatrix}$ 的迹为 $6$，所以 $\\lambda = 3$，而 $\\det A = 5 + 4 = 9 = 3^2$ 确实成立。\n\n> **注意。** $\\lambda$ 是迹的一半，不是迹本身；$A$ 的对角元也不一定是特征值。",
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
          mistakes: [
            why(2 * lam, "That is the trace $2\\lambda$; halve it.", "这是迹 $2\\lambda$；还要除以 2。"),
            why(
              lam + a,
              "That is the top-left entry of $A$, which need not be an eigenvalue.",
              "这是 $A$ 左上角的元素，它不一定是特征值。",
            ),
            why(
              lam - a,
              "That is the bottom-right entry of $A$, which need not be an eigenvalue.",
              "这是 $A$ 右下角的元素，它不一定是特征值。",
            ),
            why(
              -lam,
              "Check the sign: $\\lambda = \\tfrac{1}{2}\\operatorname{tr} A$.",
              "检查符号：$\\lambda = \\tfrac{1}{2}\\operatorname{tr} A$。",
            ),
          ].filter((w, i, all) => w.value !== lam && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Use the trace", "利用迹"],
                t(
                  "Similar matrices share the trace, so $\\operatorname{tr} A = 2\\lambda$:",
                  "相似矩阵的迹相同，所以 $\\operatorname{tr} A = 2\\lambda$：",
                ),
                [`\\operatorname{tr} A = ${lam + a} + ${paren(lam - a)} = ${2 * lam}`],
              ],
              [["Halve it", "除以 2"], t("", ""), [`\\lambda = \\frac{${2 * lam}}{2} = ${lam}`]],
            ],
            t(
              `$\\det A = ${(lam + a) * (lam - a)} - ${paren(b * c)} = ${det} = ${paren(lam)}^2$, as the Jordan form requires.`,
              `$\\det A = ${(lam + a) * (lam - a)} - ${paren(b * c)} = ${det} = ${paren(lam)}^2$，与若尔当形一致。`,
            ),
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
  intro: t(
    "For $A = \\begin{pmatrix} 3 & 2 \\\\ 0 & 3 \\end{pmatrix}$, the matrix $A - 3I = \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix}$ sends $(1, 0)$ to $\\mathbf{0}$, so take the eigenvector $\\mathbf{v}_1 = (2, 0)$. Solving $(A - 3I)\\mathbf{v}_2 = \\mathbf{v}_1$ gives $2y = 2$, so $\\mathbf{v}_2 = (0, 1)$ and $P = \\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}$.\n\nCheck: $AP = \\begin{pmatrix} 6 & 2 \\\\ 0 & 3 \\end{pmatrix}$ and $PJ = \\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}\\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix} = \\begin{pmatrix} 6 & 2 \\\\ 0 & 3 \\end{pmatrix}$, so $A = PJP^{-1}$.\n\nIn this lesson we build $P$ from a Jordan chain and multiply a Jordan decomposition back out to recover $A$.",
    "对 $A = \\begin{pmatrix} 3 & 2 \\\\ 0 & 3 \\end{pmatrix}$，矩阵 $A - 3I = \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix}$ 把 $(1, 0)$ 变为 $\\mathbf{0}$，所以取特征向量 $\\mathbf{v}_1 = (2, 0)$。解 $(A - 3I)\\mathbf{v}_2 = \\mathbf{v}_1$ 得 $2y = 2$，所以 $\\mathbf{v}_2 = (0, 1)$，$P = \\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}$。\n\n检验：$AP = \\begin{pmatrix} 6 & 2 \\\\ 0 & 3 \\end{pmatrix}$，$PJ = \\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}\\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix} = \\begin{pmatrix} 6 & 2 \\\\ 0 & 3 \\end{pmatrix}$，所以 $A = PJP^{-1}$。\n\n本课我们由若尔当链构造 $P$，并把若尔当分解乘开以还原 $A$。",
  ),
  prerequisites: ["jordan-canonical-form-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "jordan-decomposition-2x2-computation",
      title: t("Jordan Decomposition Computation for 2x2 Matrices", "2x2 矩阵的若尔当分解计算"),
      explanation: t(
        "The first column is an eigenvector and the second is a generalized eigenvector that the shifted matrix sends to the first, forming a chain. Find $P = \\begin{bmatrix} \\mathbf{v}_1 & \\mathbf{v}_2 \\end{bmatrix}$ satisfying $(A - \\lambda I)\\mathbf{v}_1 = \\mathbf{0}$ and $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$. For example, $A = \\begin{pmatrix} 3 & 2 \\\\ 0 & 3 \\end{pmatrix}$ has $\\mathbf{v}_1 = (2, 0)$ and $\\mathbf{v}_2 = (0, 1)$, so $P = \\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}$.\n\n> **Watch out.** The eigenvector goes in the first column, and $(A - \\lambda I)\\mathbf{v}_2$ must equal $\\mathbf{v}_1$ exactly; a multiple of $\\mathbf{v}_1$ puts that multiple above the diagonal of $J$ instead of $1$.",
        "第一列是特征向量，第二列是被平移矩阵映射到第一列的广义特征向量，它们构成一条链。求满足 $(A - \\lambda I)\\mathbf{v}_1 = \\mathbf{0}$ 与 $(A - \\lambda I)\\mathbf{v}_2 = \\mathbf{v}_1$ 的矩阵 $P = \\begin{bmatrix} \\mathbf{v}_1 & \\mathbf{v}_2 \\end{bmatrix}$。例如 $A = \\begin{pmatrix} 3 & 2 \\\\ 0 & 3 \\end{pmatrix}$ 有 $\\mathbf{v}_1 = (2, 0)$，$\\mathbf{v}_2 = (0, 1)$，所以 $P = \\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}$。\n\n> **注意。** 特征向量放在第一列，且 $(A - \\lambda I)\\mathbf{v}_2$ 必须恰好等于 $\\mathbf{v}_1$；若等于 $\\mathbf{v}_1$ 的倍数，$J$ 对角线上方的元素就成了那个倍数而不是 $1$。",
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
        const choice = (x: Mat2): Text => t(`$P = ${mat2Latex(x)}$`, `$P = ${mat2Latex(x)}$`);
        const prompt = t(
          `For the matrix $A = ${mat2Latex(matA)}$, find an invertible matrix $P$ such that $P^{-1} A P = J = \\begin{pmatrix} ${lambda} & 1 \\\\ 0 & ${lambda} \\end{pmatrix}$.`,
          `对于矩阵 $A = ${mat2Latex(matA)}$，求可逆矩阵 $P$，使得 $P^{-1} A P = J = \\begin{pmatrix} ${lambda} & 1 \\\\ 0 & ${lambda} \\end{pmatrix}$。`,
        );
        const right = choice(matP);
        const wrong = [
          choice([
            [1, 0],
            [0, k],
          ]),
          choice([
            [1, 1],
            [0, 1],
          ]),
          choice([
            [0, k],
            [1, 0],
          ]),
          choice([
            [k, 0],
            [0, -1],
          ]),
        ];
        const shiftStr = formatShift(lambda, "I");
        const solution = walked(
          [
            [
              ["Find an eigenvector", "求特征向量"],
              t(
                `$A${shiftStr} = \\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix}$ sends $(1, 0)$ to $0$; take the multiple $v_1 = ${vec2Latex([k, 0])}$.`,
                `$A${shiftStr} = \\begin{pmatrix} 0 & ${k} \\\\ 0 & 0 \\end{pmatrix}$ 把 $(1, 0)$ 变为 $0$；取它的倍数 $v_1 = ${vec2Latex([k, 0])}$。`,
              ),
            ],
            [
              ["Solve for $v_2$", "解出 $v_2$"],
              t(
                `$(A${shiftStr})v_2 = v_1$ reads $${k}y = ${k}$, so $y = 1$, and $v_2 = ${vec2Latex([0, 1])}$ works.`,
                `$(A${shiftStr})v_2 = v_1$ 化为 $${k}y = ${k}$，所以 $y = 1$，可取 $v_2 = ${vec2Latex([0, 1])}$。`,
              ),
            ],
            [["Assemble $P$", "组成 $P$"], t("The chain gives the columns in order:", "按链的顺序排列各列："), [`P = ${mat2Latex(matP)}`]],
          ],
          t(
            `$AP = ${mat2Latex([
              [lambda * k, k],
              [0, lambda],
            ])} = PJ$.`,
            `$AP = ${mat2Latex([
              [lambda * k, k],
              [0, lambda],
            ])} = PJ$。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `$(A${shiftStr})(0, ${k}) = (${k * k}, 0)$, which is $${k * k}$ times the first column, not the first column itself.`,
            `$(A${shiftStr})(0, ${k}) = (${k * k}, 0)$，是第一列的 $${k * k}$ 倍，而不是第一列本身。`,
          ],
          [
            wrong[1]!.en,
            `$(A${shiftStr})(1, 1) = (${k}, 0)$, which is $${k}$ times the first column $(1, 0)$, not the column itself.`,
            `$(A${shiftStr})(1, 1) = (${k}, 0)$，是第一列 $(1, 0)$ 的 $${k}$ 倍，而不是第一列本身。`,
          ],
          [
            wrong[2]!.en,
            `The first column $(0, 1)$ is not an eigenvector: $(A${shiftStr})(0, 1) = (${k}, 0) \\neq 0$.`,
            `第一列 $(0, 1)$ 不是特征向量：$(A${shiftStr})(0, 1) = (${k}, 0) \\neq 0$。`,
          ],
          [
            wrong[3]!.en,
            `$(A${shiftStr})(0, -1) = (-${k}, 0)$ is the negative of the first column, so $J$ would get $-1$ above the diagonal.`,
            `$(A${shiftStr})(0, -1) = (-${k}, 0)$ 是第一列的相反数，所以 $J$ 对角线上方会是 $-1$。`,
          ],
        ]);
      },
    },
    {
      id: "rebuilding-a-2x2-matrix-from-its-jordan-decomposition",
      title: t("Rebuilding a matrix from its Jordan decomposition", "由若尔当分解还原矩阵"),
      explanation: t(
        "A Jordan decomposition $A = PJP^{-1}$ can be multiplied out to recover $A$. With $J = \\lambda I + N$ and $N = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$, this is $A = \\lambda I + PNP^{-1}$, so only the nilpotent part needs to be conjugated. When $\\det P = 1$, the inverse is simply $P^{-1} = \\begin{pmatrix} s & -q \\\\ -r & p \\end{pmatrix}$ for $P = \\begin{pmatrix} p & q \\\\ r & s \\end{pmatrix}$. For example, $P = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$ and $\\lambda = 2$ give $PNP^{-1} = \\begin{pmatrix} -1 & 1 \\\\ -1 & 1 \\end{pmatrix}$, so $A = \\begin{pmatrix} 1 & 1 \\\\ -1 & 3 \\end{pmatrix}$.\n\n> **Watch out.** Keep the order $PNP^{-1}$; $P^{-1}NP$ is a different matrix. The diagonal of $A$ is not simply $\\lambda$, because $PNP^{-1}$ has diagonal entries of its own.",
        "若尔当分解 $A = PJP^{-1}$ 乘开即可还原 $A$。设 $J = \\lambda I + N$，$N = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$，则 $A = \\lambda I + PNP^{-1}$，只需对幂零部分作共轭。当 $\\det P = 1$ 时，对 $P = \\begin{pmatrix} p & q \\\\ r & s \\end{pmatrix}$ 有 $P^{-1} = \\begin{pmatrix} s & -q \\\\ -r & p \\end{pmatrix}$。例如 $P = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$，$\\lambda = 2$，得 $PNP^{-1} = \\begin{pmatrix} -1 & 1 \\\\ -1 & 1 \\end{pmatrix}$，所以 $A = \\begin{pmatrix} 1 & 1 \\\\ -1 & 3 \\end{pmatrix}$。\n\n> **注意。** 顺序是 $PNP^{-1}$；$P^{-1}NP$ 是另一个矩阵。$A$ 的对角元不只是 $\\lambda$，因为 $PNP^{-1}$ 自己也有对角元。",
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
        const ans = A[i]![j]!;
        const conj: Mat2 = [
          [-p * r, p * p],
          [-r * r, p * r],
        ];
        return numberProblem({
          prompt: t(
            `Let $P = ${mat2Latex(P)}$ and $J = \\begin{pmatrix} ${lam} & 1 \\\\ 0 & ${lam} \\end{pmatrix}$. Find the ${pos[0]} entry of $A = PJP^{-1}$.`,
            `设 $P = ${mat2Latex(P)}$，$J = \\begin{pmatrix} ${lam} & 1 \\\\ 0 & ${lam} \\end{pmatrix}$。求 $A = PJP^{-1}$ 的${pos[1]}元素。`,
          ),
          answer: ans,
          mistakes: [
            why(
              swapped[i]![j]!,
              "That comes from $P^{-1}JP$; the decomposition is $PJP^{-1}$, and the order matters.",
              "这是 $P^{-1}JP$ 的结果；分解是 $PJP^{-1}$，顺序不能换。",
            ),
            why(-ans, "That has the wrong sign; recheck the signs in $P^{-1}$.", "符号错了；检查 $P^{-1}$ 中的符号。"),
            i === j
              ? why(
                  lam,
                  "$\\lambda$ is only the diagonal of $\\lambda I$; $PNP^{-1}$ adds to the diagonal too.",
                  "$\\lambda$ 只是 $\\lambda I$ 的对角元；$PNP^{-1}$ 也会加到对角线上。",
                )
              : why(A[j]![i]!, "That is the entry in the transposed position.", "这是转置位置上的元素。"),
            i === j
              ? why(
                  ans - lam,
                  "That is the entry of $PNP^{-1}$ alone; add $\\lambda I$ back.",
                  "这只是 $PNP^{-1}$ 的元素；还要加上 $\\lambda I$。",
                )
              : why(
                  ans - lam,
                  "$\\lambda I$ adds nothing off the diagonal, so do not subtract $\\lambda$ here.",
                  "$\\lambda I$ 不影响非对角元，所以这里不要减去 $\\lambda$。",
                ),
          ].filter((w, k, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === k),
          solution: walked(
            [
              [
                ["Invert $P$", "求 $P^{-1}$"],
                t("$\\det P = 1$, so", "$\\det P = 1$，所以"),
                [
                  `P^{-1} = ${mat2Latex([
                    [s, -q],
                    [-r, p],
                  ])}`,
                ],
              ],
              [
                ["Conjugate the nilpotent part", "对幂零部分作共轭"],
                t(
                  "With $N = J - \\lambda I = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$:",
                  "取 $N = J - \\lambda I = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$：",
                ),
                [`PNP^{-1} = ${mat2Latex(conj)}`],
              ],
              [
                ["Add $\\lambda I$", "加上 $\\lambda I$"],
                t(
                  `$A = ${paren(lam)}I + PNP^{-1}$, whose ${pos[0]} entry is $${ans}$:`,
                  `$A = ${paren(lam)}I + PNP^{-1}$，其${pos[1]}元素为 $${ans}$：`,
                ),
                [`A = ${mat2Latex(A)}`],
              ],
            ],
            t(
              `$\\operatorname{tr} A = ${2 * lam}$ and $\\det A = ${lam * lam}$, the trace and determinant of $J$.`,
              `$\\operatorname{tr} A = ${2 * lam}$，$\\det A = ${lam * lam}$，正是 $J$ 的迹和行列式。`,
            ),
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
  intro: t(
    "The matrix $A = \\begin{pmatrix} 2 & 0 & 1 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 2 \\end{pmatrix}$ has characteristic polynomial $(\\lambda - 2)^3$. Here $A - 2I = \\begin{pmatrix} 0 & 0 & 1 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$ has rank $1$, so the nullity is $2$ and there are two blocks. Three dimensions in two blocks means sizes $2 + 1$: $J = J_2(2) \\oplus J_1(2)$.\n\nCheck: $(A - 2I)^2 = 0$ while $A - 2I \\neq 0$, so the largest block has size exactly $2$.\n\nIn this lesson we split a $3 \\times 3$ Jordan form into blocks from the rank of $A - \\lambda I$ and find the largest block of a triangular matrix.",
    "矩阵 $A = \\begin{pmatrix} 2 & 0 & 1 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 2 \\end{pmatrix}$ 的特征多项式为 $(\\lambda - 2)^3$。这里 $A - 2I = \\begin{pmatrix} 0 & 0 & 1 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$ 的秩为 $1$，所以零度为 $2$，共有两个块。三个维度分成两个块，阶数只能是 $2 + 1$：$J = J_2(2) \\oplus J_1(2)$。\n\n检验：$(A - 2I)^2 = 0$ 而 $A - 2I \\neq 0$，所以最大块的阶数恰为 $2$。\n\n本课我们由 $A - \\lambda I$ 的秩把 $3 \\times 3$ 若尔当形分块，并求三角矩阵的最大若尔当块。",
  ),
  prerequisites: ["jordan-canonical-decomposition-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "jordan-blocks-partition-3x3",
      title: t("Jordan Blocks Partition for 3x3 Matrices", "3x3 矩阵的若尔当块划分"),
      explanation: t(
        "The number of blocks equals the number of independent eigenvectors, so the geometric multiplicity tells you how the three dimensions split into blocks. Determine whether $J$ is $J_3(\\lambda)$, $\\operatorname{diag}(J_2(\\lambda), J_1(\\lambda))$, or $\\operatorname{diag}(J_1(\\lambda), J_1(\\lambda), J_1(\\lambda))$. For example, if $p(\\lambda) = (\\lambda - 2)^3$ and $\\operatorname{rank}(A - 2I) = 1$, the nullity is $2$, so there are two blocks, of sizes $2$ and $1$.\n\n> **Watch out.** The number of blocks is the nullity $3 - \\operatorname{rank}(A - \\lambda I)$, not the rank itself.",
        "块的个数等于线性无关特征向量的个数，所以几何重数告诉你三个维度怎样分成若干块。判定若尔当标准型 $J$ 是 $J_3(\\lambda)$、$\\operatorname{diag}(J_2(\\lambda), J_1(\\lambda))$ 还是 $\\operatorname{diag}(J_1(\\lambda), J_1(\\lambda), J_1(\\lambda))$。例如若 $p(\\lambda) = (\\lambda - 2)^3$ 且 $\\operatorname{rank}(A - 2I) = 1$，则零度为 $2$，共有两个块，阶数为 $2$ 和 $1$。\n\n> **注意。** 块数是零度 $3 - \\operatorname{rank}(A - \\lambda I)$，而不是秩本身。",
      ),
      generate: (rng: Rng): Problem => {
        const c = rng.nonZero(-9, 9);
        const rankCase = rng.pick([1, 2])!;
        // If rank(A - cI) = 1, nullity = 2 => 2 Jordan blocks => sizes 2 + 1.
        // If rank(A - cI) = 2, nullity = 1 => 1 Jordan block => size 3.
        const twoBlocks: Mat3 = [
          [c, 1, 0],
          [0, c, 0],
          [0, 0, c],
        ];
        const oneBlock: Mat3 = [
          [c, 1, 0],
          [0, c, 1],
          [0, 0, c],
        ];
        const matJ = rankCase === 1 ? twoBlocks : oneBlock;
        const m3 = (x: Mat3): Text => t(`$${mat3Latex(x)}$`, `$${mat3Latex(x)}$`);
        const polyFactor = formatFactor("\\lambda", c);
        const shiftStr = formatShift(c, "I");
        const prompt = t(
          `A $3 \\times 3$ matrix $A$ has characteristic polynomial $p(\\lambda) = (${polyFactor})^3$. If $\\operatorname{rank}(A${shiftStr}) = ${rankCase}$, what is the Jordan canonical form $J$ of $A$?`,
          `$3 \\times 3$ 矩阵 $A$ 的特征多项式为 $p(\\lambda) = (${polyFactor})^3$。若 $\\operatorname{rank}(A${shiftStr}) = ${rankCase}$，求 $A$ 的若尔当标准型 $J$。`,
        );
        const right = m3(matJ);
        const wrong = [
          m3([
            [c, 0, 0],
            [0, c, 0],
            [0, 0, c],
          ]),
          m3(rankCase === 1 ? oneBlock : twoBlocks),
          m3([
            [c, 0, 1],
            [0, c, 0],
            [0, 0, c],
          ]),
          m3([
            [c, 1, 1],
            [0, c, 1],
            [0, 0, c],
          ]),
        ];
        const solution = walked(
          [
            [
              ["Count the blocks", "数块"],
              t(
                `The number of Jordan blocks is the geometric multiplicity $\\operatorname{nullity}(A${shiftStr}) = 3 - ${rankCase} = ${3 - rankCase}$.`,
                `若尔当块的个数等于几何重数 $\\operatorname{nullity}(A${shiftStr}) = 3 - ${rankCase} = ${3 - rankCase}$。`,
              ),
            ],
            [
              ["Split the size $3$", "分配阶数 $3$"],
              rankCase === 1
                ? t(
                    `Two blocks of total size $3$ must have sizes $2 + 1$: $J = \\operatorname{diag}(J_2(${c}), J_1(${c}))$.`,
                    `总阶数为 $3$ 的两个块，阶数只能是 $2 + 1$：$J = \\operatorname{diag}(J_2(${c}), J_1(${c}))$。`,
                  )
                : t(`One block of size $3$: $J = J_3(${c})$.`, `一个阶数为 $3$ 的块：$J = J_3(${c})$。`),
              [`J = ${mat3Latex(matJ)}`],
            ],
          ],
          t(
            `$J${shiftStr}$ has $${rankCase}$ entr${rankCase === 1 ? "y" : "ies"} equal to $1$ above the diagonal, so its rank is $${rankCase}$, matching $\\operatorname{rank}(A${shiftStr})$.`,
            `$J${shiftStr}$ 对角线上方有 $${rankCase}$ 个 $1$，所以秩为 $${rankCase}$，与 $\\operatorname{rank}(A${shiftStr})$ 一致。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            `That is $${paren(c)}I$, which would need $\\operatorname{rank}(A${shiftStr}) = 0$.`,
            `这是 $${paren(c)}I$，需要 $\\operatorname{rank}(A${shiftStr}) = 0$。`,
          ],
          [
            wrong[1]!.en,
            rankCase === 1
              ? "A single block $J_3$ gives $\\operatorname{rank}(J - \\lambda I) = 2$, not $1$."
              : "Two blocks $J_2 \\oplus J_1$ give $\\operatorname{rank}(J - \\lambda I) = 1$, not $2$.",
            rankCase === 1
              ? "单个块 $J_3$ 给出 $\\operatorname{rank}(J - \\lambda I) = 2$，不是 $1$。"
              : "两个块 $J_2 \\oplus J_1$ 给出 $\\operatorname{rank}(J - \\lambda I) = 1$，不是 $2$。",
          ],
          [
            wrong[2]!.en,
            "The $1$ is not on the superdiagonal, so this is not a Jordan matrix.",
            "这个 $1$ 不在上对角线上，所以这不是若尔当矩阵。",
          ],
          [
            wrong[3]!.en,
            "The corner entry of a Jordan matrix is $0$; only the superdiagonal holds ones.",
            "若尔当矩阵的角元素是 $0$；只有上对角线上是 1。",
          ],
        ]);
      },
    },
    {
      id: "the-largest-jordan-block-of-a-triangular-3x3-matrix",
      title: t("The largest Jordan block of a triangular 3×3 matrix", "三角 3×3 矩阵的最大若尔当块"),
      explanation: t(
        "For $A = cI + N$ with $N$ strictly upper triangular, the only eigenvalue is $c$ and the size of the largest Jordan block is the smallest $k$ with $N^k = 0$. If $N = 0$ every block has size $1$. Otherwise check $N^2$: for $N = \\begin{pmatrix} 0 & p & q \\\\ 0 & 0 & r \\\\ 0 & 0 & 0 \\end{pmatrix}$ the only nonzero entry of $N^2$ is $pr$ in the corner, so the largest block has size $3$ when $pr \\ne 0$ and size $2$ when $pr = 0$. For example, $A = \\begin{pmatrix} 1 & 2 & 5 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$ has $p = 2$ and $r = 0$, so $N^2 = 0$ and the largest block has size $2$.\n\n> **Watch out.** The corner entry $q$ does not affect $N^2$; only the product $pr$ decides between sizes $2$ and $3$.",
        "对 $A = cI + N$（$N$ 为严格上三角），唯一特征值是 $c$，最大若尔当块的阶数是满足 $N^k = 0$ 的最小 $k$。若 $N = 0$，所有块阶数为 $1$。否则检查 $N^2$：对 $N = \\begin{pmatrix} 0 & p & q \\\\ 0 & 0 & r \\\\ 0 & 0 & 0 \\end{pmatrix}$，$N^2$ 唯一的非零元素是角上的 $pr$，所以 $pr \\ne 0$ 时最大块阶数为 $3$，$pr = 0$ 时为 $2$。例如 $A = \\begin{pmatrix} 1 & 2 & 5 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$ 有 $p = 2$，$r = 0$，所以 $N^2 = 0$，最大块阶数为 $2$。\n\n> **注意。** 角上的元素 $q$ 不影响 $N^2$；只有乘积 $pr$ 决定阶数是 $2$ 还是 $3$。",
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
        const N = mat3Latex([
          [0, p, q],
          [0, 0, r],
          [0, 0, 0],
        ]);
        const N2 = mat3Latex([
          [0, 0, p * r],
          [0, 0, 0],
          [0, 0, 0],
        ]);
        const shift = formatShift(c);
        return numberProblem({
          prompt: t(
            `What is the size of the largest Jordan block in the Jordan form of $A = ${mat3Latex(A)}$?`,
            `$A = ${mat3Latex(A)}$ 的若尔当形中最大若尔当块的阶数是多少？`,
          ),
          answer: kind,
          mistakes: [1, 2, 3]
            .filter((w) => w !== kind)
            .map((w) =>
              kind === 1
                ? why(
                    w,
                    `$A = ${paren(c)}I$, so $N = 0$ and every block has size $1$.`,
                    `$A = ${paren(c)}I$，所以 $N = 0$，每个块阶数都是 $1$。`,
                  )
                : w === 1
                  ? why(w, "$N \\ne 0$, so some block is larger than $1$.", "$N \\ne 0$，所以有块的阶数大于 $1$。")
                  : kind === 3
                    ? why(
                        w,
                        `$N^2$ has corner entry $pr = ${p * r} \\ne 0$, so $N^2 \\ne 0$ and size $2$ is too small.`,
                        `$N^2$ 的角元素 $pr = ${p * r} \\ne 0$，所以 $N^2 \\ne 0$，阶数 $2$ 太小。`,
                      )
                    : why(w, "$pr = 0$ makes $N^2 = 0$, so no block has size $3$.", "$pr = 0$ 使 $N^2 = 0$，所以没有阶数为 $3$ 的块。"),
            ),
          solution: walked(
            [
              [["Split off the diagonal", "分出对角部分"], t("", ""), [`N = A${shift} = ${N}`]],
              kind === 1
                ? [
                    ["Read the blocks", "读出各块"],
                    t(`$N = 0$, so $A = ${paren(c)}I$ is already diagonal.`, `$N = 0$，所以 $A = ${paren(c)}I$ 已是对角矩阵。`),
                  ]
                : [
                    ["Square $N$", "计算 $N^2$"],
                    t(
                      `$N \\ne 0$, and the only possible nonzero entry of $N^2$ is $pr = ${p * r}$:`,
                      `$N \\ne 0$，$N^2$ 唯一可能的非零元素为 $pr = ${p * r}$：`,
                    ),
                    [`N^2 = ${N2}`],
                  ],
            ],
            t(
              kind === 1
                ? "$A - cI = 0$ has nullity $3$: three blocks, each of size $1$."
                : kind === 3
                  ? "$N^2 \\ne 0$ while $N^3 = 0$ for every strictly upper triangular $3 \\times 3$ matrix, so the largest block has size exactly $3$."
                  : "$N \\ne 0$ rules out size $1$ only, and $N^2 = 0$ caps the blocks at size $2$.",
              kind === 1
                ? "$A - cI = 0$ 的零度为 $3$：三个块，每块阶数为 $1$。"
                : kind === 3
                  ? "$N^2 \\ne 0$，而每个严格上三角 $3 \\times 3$ 矩阵都有 $N^3 = 0$，所以最大块阶数恰为 $3$。"
                  : "$N \\ne 0$ 只排除了阶数 $1$，$N^2 = 0$ 使各块阶数至多为 $2$。",
            ),
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
  intro: t(
    "For $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 0 & 2 & 3 \\\\ 0 & 0 & 2 \\end{pmatrix}$, start from $\\mathbf{v}_3 = (0, 0, 1)$. Then $\\mathbf{v}_2 = (A - 2I)\\mathbf{v}_3 = (0, 3, 0)$ and $\\mathbf{v}_1 = (A - 2I)\\mathbf{v}_2 = (3, 0, 0)$, an eigenvector. So $P = \\begin{pmatrix} 3 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$ gives $A = PJ_3(2)P^{-1}$.\n\nCheck: the second column of $AP = PJ$ requires $A\\mathbf{v}_2 = \\mathbf{v}_1 + 2\\mathbf{v}_2$, and indeed $A(0, 3, 0) = (3, 6, 0) = (3, 0, 0) + (0, 6, 0)$.\n\nIn this lesson we read the chain relations among the columns of $P$ and use a Jordan decomposition to find determinants without computing $A$.",
    "对 $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 0 & 2 & 3 \\\\ 0 & 0 & 2 \\end{pmatrix}$，从 $\\mathbf{v}_3 = (0, 0, 1)$ 出发。则 $\\mathbf{v}_2 = (A - 2I)\\mathbf{v}_3 = (0, 3, 0)$，$\\mathbf{v}_1 = (A - 2I)\\mathbf{v}_2 = (3, 0, 0)$，是特征向量。所以 $P = \\begin{pmatrix} 3 & 0 & 0 \\\\ 0 & 3 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$ 使 $A = PJ_3(2)P^{-1}$。\n\n检验：$AP = PJ$ 的第二列要求 $A\\mathbf{v}_2 = \\mathbf{v}_1 + 2\\mathbf{v}_2$，而确实 $A(0, 3, 0) = (3, 6, 0) = (3, 0, 0) + (0, 6, 0)$。\n\n本课我们读出 $P$ 各列之间的链式关系，并利用若尔当分解在不算出 $A$ 的情况下求行列式。",
  ),
  prerequisites: ["jordan-canonical-form-of-a-3x3-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "jordan-chain-relations-3x3",
      title: t("Jordan Chain Relations for 3x3 Matrices", "3x3 矩阵若尔当链的关系"),
      explanation: t(
        "In a chain the shifted matrix sends each column to the one before it, and sends the first column, an ordinary eigenvector, to zero. Identify the relations between column vectors of P corresponding to a size-3 Jordan block. For example, with $A - 2I = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix}$ the columns $\\mathbf{v}_1 = (3, 0, 0)$, $\\mathbf{v}_2 = (0, 3, 0)$, $\\mathbf{v}_3 = (0, 0, 1)$ form a chain: $(A - 2I)\\mathbf{v}_3 = \\mathbf{v}_2$, $(A - 2I)\\mathbf{v}_2 = \\mathbf{v}_1$, $(A - 2I)\\mathbf{v}_1 = \\mathbf{0}$.\n\n> **Watch out.** The chain starts at the eigenvector in the first column; each later column is sent to the column before it, not to $\\mathbf{0}$.",
        "在一条链中，平移后的矩阵把每一列映射到前一列，并把第一列（一个普通特征向量）映射到零。识别对应 3 阶若尔当块的变换矩阵 P 各列向量之间的链式关系。例如 $A - 2I = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix}$ 时，列 $\\mathbf{v}_1 = (3, 0, 0)$、$\\mathbf{v}_2 = (0, 3, 0)$、$\\mathbf{v}_3 = (0, 0, 1)$ 构成一条链：$(A - 2I)\\mathbf{v}_3 = \\mathbf{v}_2$，$(A - 2I)\\mathbf{v}_2 = \\mathbf{v}_1$，$(A - 2I)\\mathbf{v}_1 = \\mathbf{0}$。\n\n> **注意。** 链从第一列的特征向量开始；后面每一列都被映射到前一列，而不是 $\\mathbf{0}$。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.nonZero(-15, 15);
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
        const plus = (name: string) => `${lambda < 0 ? "-" : "+"} ${Math.abs(lambda) === 1 ? "" : Math.abs(lambda)}${name}`;
        const solution = walked(
          [
            [
              ["Compare columns of $AP = PJ$", "比较 $AP = PJ$ 的各列"],
              t(`The columns of $PJ_3(${lambda})$ give`, `$PJ_3(${lambda})$ 的各列给出`),
              [`Av_1 = ${lambda}v_1`, `Av_2 = v_1 ${plus("v_2")}`, `Av_3 = v_2 ${plus("v_3")}`],
            ],
            [
              ["Move the eigenvalue terms", "移项"],
              t(
                `Subtracting $${lambda}v_j$ from both sides gives $(A${shiftStr})v_1 = 0$, $(A${shiftStr})v_2 = v_1$ and $(A${shiftStr})v_3 = v_2$.`,
                `两边减去 $${lambda}v_j$，得 $(A${shiftStr})v_1 = 0$、$(A${shiftStr})v_2 = v_1$、$(A${shiftStr})v_3 = v_2$。`,
              ),
            ],
          ],
          t(
            `Then $(A${shiftStr})^2 v_3 = v_1 \\neq 0$ and $(A${shiftStr})^3 v_3 = 0$, so $v_3$ has rank $3$, as the last column of a block of size $3$ must.`,
            `于是 $(A${shiftStr})^2 v_3 = v_1 \\neq 0$，$(A${shiftStr})^3 v_3 = 0$，所以 $v_3$ 的秩为 $3$，正符合 $3$ 阶块最后一列的要求。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "That makes every column an eigenvector, which describes three $1 \\times 1$ blocks, not $J_3$.",
            "这使每一列都是特征向量，描述的是三个 $1 \\times 1$ 块，而不是 $J_3$。",
          ],
          [
            wrong[1]!.en,
            "The chain runs the other way: the eigenvector is the first column $v_1$.",
            "链的方向反了：特征向量是第一列 $v_1$。",
          ],
          [
            wrong[2]!.en,
            `Only $v_1$ is an eigenvector; $v_2$ and $v_3$ are generalized eigenvectors of $${lambda}$, not eigenvectors for powers of $${lambda}$.`,
            `只有 $v_1$ 是特征向量；$v_2$ 和 $v_3$ 是 $${lambda}$ 的广义特征向量，而不是 $${lambda}$ 的幂的特征向量。`,
          ],
          [
            wrong[3]!.en,
            "The columns of an invertible $P$ are independent, so no such relation holds.",
            "可逆矩阵 $P$ 的各列线性无关，所以不会有这样的关系。",
          ],
        ]);
      },
    },
    {
      id: "a-determinant-from-a-3x3-jordan-decomposition",
      title: t("A determinant from a Jordan decomposition", "由若尔当分解求行列式"),
      explanation: t(
        "If $A = PJP^{-1}$, then $A - kI = P(J - kI)P^{-1}$, so $\\det(A - kI) = \\det(J - kI)$. The matrix $J - kI$ is upper triangular, so its determinant is the product of its diagonal entries. For $J = J_2(\\lambda) \\oplus J_1(\\mu)$ this gives $(\\lambda - k)^2(\\mu - k)$, without ever computing $A$. For example, $J = J_2(1) \\oplus J_1(4)$ and $k = 2$ give $\\det(A - 2I) = (-1)^2 \\cdot 2 = 2$.\n\n> **Watch out.** $\\lambda$ appears twice on the diagonal of $J_2(\\lambda)$, so its factor is squared. The $1$ above the diagonal does not change the determinant.",
        "若 $A = PJP^{-1}$，则 $A - kI = P(J - kI)P^{-1}$，所以 $\\det(A - kI) = \\det(J - kI)$。$J - kI$ 是上三角矩阵，其行列式等于对角元素之积。对 $J = J_2(\\lambda) \\oplus J_1(\\mu)$，结果为 $(\\lambda - k)^2(\\mu - k)$，无需算出 $A$。例如 $J = J_2(1) \\oplus J_1(4)$，$k = 2$，得 $\\det(A - 2I) = (-1)^2 \\cdot 2 = 2$。\n\n> **注意。** $\\lambda$ 在 $J_2(\\lambda)$ 的对角线上出现两次，所以它的因子要平方。对角线上方的 $1$ 不影响行列式。",
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
        const sub = `${k < 0 ? "+" : "-"} ${Math.abs(k)}`;
        return numberProblem({
          prompt: t(
            `$A = PJP^{-1}$ with $J = ${mat3Latex(J)}$. Find $\\det(A${formatShift(k)})$.`,
            `$A = PJP^{-1}$，其中 $J = ${mat3Latex(J)}$。求 $\\det(A${formatShift(k)})$。`,
          ),
          answer: ans,
          mistakes: [
            why(
              (lam - k) * (mu - k),
              "That counts $\\lambda$ once; $J_2(\\lambda)$ puts it on the diagonal twice.",
              "这里 $\\lambda$ 只算了一次；$J_2(\\lambda)$ 在对角线上放了两个 $\\lambda$。",
            ),
            why(
              (lam + k) ** 2 * (mu + k),
              "$A - kI$ subtracts $k$ from each diagonal entry; check the sign.",
              "$A - kI$ 是从每个对角元中减去 $k$；检查符号。",
            ),
            why(
              lam * lam * mu - k,
              "$\\det(A - kI)$ is not $\\det A - k$; subtract $k$ on the diagonal first.",
              "$\\det(A - kI)$ 不是 $\\det A - k$；要先在对角线上减去 $k$。",
            ),
            why(
              (lam - k) ** 2 * (mu - k) - (mu - k),
              "The $1$ above the diagonal does not change the determinant of a triangular matrix.",
              "对角线上方的 $1$ 不影响三角矩阵的行列式。",
            ),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Pass to $J$", "转到 $J$"],
                t(
                  `$A${formatShift(k)} = P(J${formatShift(k)})P^{-1}$, and similar matrices have the same determinant.`,
                  `$A${formatShift(k)} = P(J${formatShift(k)})P^{-1}$，而相似矩阵的行列式相同。`,
                ),
              ],
              [
                ["Multiply the diagonal", "对角元相乘"],
                t(`$J${formatShift(k)}$ is upper triangular:`, `$J${formatShift(k)}$ 是上三角矩阵：`),
                [`\\det(J${formatShift(k)}) = (${lam} ${sub})^2(${mu} ${sub}) = ${paren(lam - k)}^2 \\cdot ${paren(mu - k)} = ${ans}`],
              ],
            ],
            t(
              `The characteristic polynomial $\\det(A - xI) = (${lam} - x)^2(${mu} - x)$ at $x = ${k}$ gives the same value $${ans}$.`,
              `特征多项式 $\\det(A - xI) = (${lam} - x)^2(${mu} - x)$ 在 $x = ${k}$ 处的值也是 $${ans}$。`,
            ),
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
  intro: t(
    "For the Jordan block $J = \\begin{pmatrix} 2 & 1 \\\\ 0 & 2 \\end{pmatrix}$ and $f(x) = x^3$, the formula puts $f(2) = 8$ on the diagonal and $f'(2) = 3 \\cdot 2^2 = 12$ above it: $J^3 = \\begin{pmatrix} 8 & 12 \\\\ 0 & 8 \\end{pmatrix}$.\n\nCheck: $J^2 = \\begin{pmatrix} 4 & 4 \\\\ 0 & 4 \\end{pmatrix}$ and $J^3 = J^2 J = \\begin{pmatrix} 8 & 4 + 8 \\\\ 0 & 8 \\end{pmatrix} = \\begin{pmatrix} 8 & 12 \\\\ 0 & 8 \\end{pmatrix}$.\n\nIn this lesson we evaluate functions of Jordan blocks, with derivatives of $f$ above the diagonal.",
    "对若尔当块 $J = \\begin{pmatrix} 2 & 1 \\\\ 0 & 2 \\end{pmatrix}$ 和 $f(x) = x^3$，公式在对角线上放 $f(2) = 8$，在其上方放 $f'(2) = 3 \\cdot 2^2 = 12$：$J^3 = \\begin{pmatrix} 8 & 12 \\\\ 0 & 8 \\end{pmatrix}$。\n\n检验：$J^2 = \\begin{pmatrix} 4 & 4 \\\\ 0 & 4 \\end{pmatrix}$，$J^3 = J^2 J = \\begin{pmatrix} 8 & 4 + 8 \\\\ 0 & 8 \\end{pmatrix} = \\begin{pmatrix} 8 & 12 \\\\ 0 & 8 \\end{pmatrix}$。\n\n本课我们求若尔当块的函数，对角线上方是 $f$ 的各阶导数。",
  ),
  prerequisites: ["jordan-canonical-decomposition-of-a-3x3-matrix"],
  encompasses: [],
  xp: 14,
  knowledgePoints: [
    {
      id: "evaluating-functions-on-jordan-blocks-kp",
      title: t("Evaluating Functions on Jordan Blocks", "在若尔当块上求值矩阵函数"),
      explanation: t(
        "The one above the diagonal acts like a small step, so a function of a Jordan block brings in the derivative of the function above the diagonal, as in a Taylor expansion. Apply $f\\left(\\begin{bmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{bmatrix}\\right) = \\begin{bmatrix} f(\\lambda) & f'(\\lambda) \\\\ 0 & f(\\lambda) \\end{bmatrix}$. For example, with $f(x) = x^3$ and $\\lambda = 2$, $J^3 = \\begin{pmatrix} 8 & 12 \\\\ 0 & 8 \\end{pmatrix}$, since $f'(2) = 12$.\n\n> **Watch out.** The entry above the diagonal is $f'(\\lambda)$, not $1$ and not $f(\\lambda)$; for $f(x) = x^k$ it is $k\\lambda^{k-1}$.",
        "对角线上方的 1 像一个小步长，所以若尔当块的函数会在对角线上方引入函数的导数，就像泰勒展开一样。应用公式 $f\\left(\\begin{bmatrix} \\lambda & 1 \\\\ 0 & \\lambda \\end{bmatrix}\\right) = \\begin{bmatrix} f(\\lambda) & f'(\\lambda) \\\\ 0 & f(\\lambda) \\end{bmatrix}$。例如取 $f(x) = x^3$，$\\lambda = 2$，因为 $f'(2) = 12$，所以 $J^3 = \\begin{pmatrix} 8 & 12 \\\\ 0 & 8 \\end{pmatrix}$。\n\n> **注意。** 对角线上方的元素是 $f'(\\lambda)$，不是 $1$，也不是 $f(\\lambda)$；对 $f(x) = x^k$，它是 $k\\lambda^{k-1}$。",
      ),
      generate: (rng: Rng): Problem => {
        const lambda = rng.int(1, 8);
        const k = rng.int(2, 6);
        // Function f(x) = x^k
        // f(J) = [[lambda^k, k * lambda^(k-1)], [0, lambda^k]]
        const diagVal = lambda ** k;
        const superVal = k * lambda ** (k - 1);
        const m = (x: number, y: number, z: number): Text =>
          t(`$\\begin{pmatrix} ${x} & ${y} \\\\ 0 & ${z} \\end{pmatrix}$`, `$\\begin{pmatrix} ${x} & ${y} \\\\ 0 & ${z} \\end{pmatrix}$`);
        const prompt = t(
          `For the $2 \\times 2$ Jordan block $J = \\begin{pmatrix} ${lambda} & 1 \\\\ 0 & ${lambda} \\end{pmatrix}$, compute the matrix power $J^{${k}}$ by applying the matrix function formula $f(J) = \\begin{pmatrix} f(\\lambda) & f'(\\lambda) \\\\ 0 & f(\\lambda) \\end{pmatrix}$ with $f(x) = x^{${k}}$.`,
          `对于 $2 \\times 2$ 若尔当块 $J = \\begin{pmatrix} ${lambda} & 1 \\\\ 0 & ${lambda} \\end{pmatrix}$，应用矩阵函数公式 $f(J) = \\begin{pmatrix} f(\\lambda) & f'(\\lambda) \\\\ 0 & f(\\lambda) \\end{pmatrix}$（其中 $f(x) = x^{${k}}$）计算矩阵幂 $J^{${k}}$。`,
        );
        const right = m(diagVal, superVal, diagVal);
        const wrong = [m(diagVal, 1, diagVal), m(diagVal, 0, diagVal), m(diagVal, diagVal, diagVal), m(superVal, diagVal, superVal)];
        const derivative = `${k}${k === 2 ? "x" : ` x^{${k - 1}}`}`;
        const solution = walked(
          [
            [["Differentiate", "求导"], t("", ""), [`f(x) = x^{${k}}`, `f'(x) = ${derivative}`]],
            [
              ["Evaluate at $\\lambda$", "在 $\\lambda$ 处取值"],
              t("", ""),
              [`f(${lambda}) = ${lambda}^{${k}} = ${diagVal}`, `f'(${lambda}) = ${k} \\cdot ${lambda}^{${k - 1}} = ${superVal}`],
            ],
            [
              ["Fill in the formula", "代入公式"],
              t("", ""),
              [`J^{${k}} = \\begin{pmatrix} ${diagVal} & ${superVal} \\\\ 0 & ${diagVal} \\end{pmatrix}`],
            ],
          ],
          t(
            `$J = ${lambda}I + N$ with $N^2 = 0$, so the binomial theorem gives $J^{${k}} = ${lambda}^{${k}}I + ${k} \\cdot ${lambda}^{${k - 1}}N$, the same matrix.`,
            `$J = ${lambda}I + N$ 且 $N^2 = 0$，由二项式定理得 $J^{${k}} = ${lambda}^{${k}}I + ${k} \\cdot ${lambda}^{${k - 1}}N$，是同一个矩阵。`,
          ),
        );
        return reasoned(oneOf(rng, prompt, right, wrong, solution), [
          [
            wrong[0]!.en,
            "The $1$ above the diagonal becomes $f'(\\lambda)$; it does not stay $1$.",
            "对角线上方的 $1$ 会变成 $f'(\\lambda)$，而不是保持为 $1$。",
          ],
          [
            wrong[1]!.en,
            "That treats $J$ as diagonal; the power picks up $f'(\\lambda)$ above the diagonal.",
            "这是把 $J$ 当作对角矩阵；幂会在对角线上方产生 $f'(\\lambda)$。",
          ],
          [
            wrong[2]!.en,
            `The entry above the diagonal is $f'(\\lambda) = ${k} \\cdot ${lambda}^{${k - 1}}$, not $f(\\lambda)$.`,
            `对角线上方的元素是 $f'(\\lambda) = ${k} \\cdot ${lambda}^{${k - 1}}$，不是 $f(\\lambda)$。`,
          ],
          [
            wrong[3]!.en,
            "$f(\\lambda)$ goes on the diagonal and $f'(\\lambda)$ above it, not the other way round.",
            "$f(\\lambda)$ 在对角线上，$f'(\\lambda)$ 在其上方，不能反过来。",
          ],
        ]);
      },
    },
    {
      id: "the-corner-entry-of-a-power-of-a-3x3-jordan-block",
      title: t("The corner entry of a power of a 3×3 Jordan block", "3×3 若尔当块幂的角元素"),
      explanation: t(
        "For a Jordan block $J_3(\\lambda)$, a matrix function is $f(J) = \\begin{pmatrix} f(\\lambda) & f'(\\lambda) & \\tfrac{1}{2}f''(\\lambda) \\\\ 0 & f(\\lambda) & f'(\\lambda) \\\\ 0 & 0 & f(\\lambda) \\end{pmatrix}$. With $f(x) = x^n$ the corner entry is $\\tfrac{1}{2}n(n-1)\\lambda^{n-2} = \\binom{n}{2}\\lambda^{n-2}$. The same pattern comes from the binomial expansion of $(\\lambda I + N)^n$, which stops after $N^2$. For example, the corner entry of $J_3(2)^4$ is $\\binom{4}{2} \\cdot 2^2 = 24$.\n\n> **Watch out.** The corner is $\\tfrac{1}{2}f''(\\lambda)$: keep the factor $\\tfrac{1}{2}$, and the power of $\\lambda$ drops by two, to $n - 2$.",
        "对若尔当块 $J_3(\\lambda)$，矩阵函数为 $f(J) = \\begin{pmatrix} f(\\lambda) & f'(\\lambda) & \\tfrac{1}{2}f''(\\lambda) \\\\ 0 & f(\\lambda) & f'(\\lambda) \\\\ 0 & 0 & f(\\lambda) \\end{pmatrix}$。取 $f(x) = x^n$，角元素为 $\\tfrac{1}{2}n(n-1)\\lambda^{n-2} = \\binom{n}{2}\\lambda^{n-2}$。由 $(\\lambda I + N)^n$ 的二项展开（到 $N^2$ 为止）也得到同样的规律。例如 $J_3(2)^4$ 的角元素为 $\\binom{4}{2} \\cdot 2^2 = 24$。\n\n> **注意。** 角元素是 $\\tfrac{1}{2}f''(\\lambda)$：不要漏掉 $\\tfrac{1}{2}$，而且 $\\lambda$ 的指数降低二，变为 $n - 2$。",
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
          mistakes: [
            why(
              n * (n - 1) * lam ** (n - 2),
              "That is $f''(\\lambda)$; the corner entry is half of it.",
              "这是 $f''(\\lambda)$；角元素是它的一半。",
            ),
            why(
              n * lam ** (n - 1),
              "That is $f'(\\lambda)$, the entry just above the diagonal.",
              "这是 $f'(\\lambda)$，即紧挨在对角线上方的元素。",
            ),
            why(c2 * lam ** (n - 1), "The power of $\\lambda$ is $n - 2$, not $n - 1$.", "$\\lambda$ 的指数是 $n - 2$，不是 $n - 1$。"),
            why(lam ** n, "That is the diagonal entry $f(\\lambda)$.", "这是对角元 $f(\\lambda)$。"),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [["Differentiate twice", "求二阶导数"], t("", ""), [`f(x) = x^{${n}}`, `f''(x) = ${n * (n - 1)}x^{${n - 2}}`]],
              [
                ["Halve and evaluate", "取一半并代入"],
                t("", ""),
                [`\\tfrac{1}{2}f''(${lam}) = \\binom{${n}}{2}${paren(lam)}^{${n - 2}} = ${c2} \\cdot ${paren(lam ** (n - 2))} = ${ans}`],
              ],
            ],
            t(
              `$(\\lambda I + N)^{${n}} = \\lambda^{${n}}I + ${n}\\lambda^{${n - 1}}N + \\binom{${n}}{2}\\lambda^{${n - 2}}N^2$, and $N^2$ has a single $1$ in the corner, so the corner entry is $\\binom{${n}}{2}\\lambda^{${n - 2}} = ${ans}$.`,
              `$(\\lambda I + N)^{${n}} = \\lambda^{${n}}I + ${n}\\lambda^{${n - 1}}N + \\binom{${n}}{2}\\lambda^{${n - 2}}N^2$，而 $N^2$ 只在角上有一个 $1$，所以角元素为 $\\binom{${n}}{2}\\lambda^{${n - 2}} = ${ans}$。`,
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
