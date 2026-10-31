import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { choiceProblem } from "../problems.ts";

// Precalculus Unit 6 Part 2: Matrix Inverses, Systems, and Linear Transformations in the Plane
// Modules 6.24 and 6.25 (17 topics total).

type Mat2 = readonly [readonly [number, number], readonly [number, number]];
type Vec2 = readonly [number, number];
type Mat3 = readonly [readonly [number, number, number], readonly [number, number, number], readonly [number, number, number]];
type Vec3 = readonly [number, number, number];

function mat2Latex(m: Mat2): string {
  return `\\begin{pmatrix} ${m[0][0]} & ${m[0][1]} \\\\ ${m[1][0]} & ${m[1][1]} \\end{pmatrix}`;
}

function mat2QLatex(m: readonly [readonly [Q, Q], readonly [Q, Q]]): string {
  return `\\begin{pmatrix} ${m[0][0].toLatex()} & ${m[0][1].toLatex()} \\\\ ${m[1][0].toLatex()} & ${m[1][1].toLatex()} \\end{pmatrix}`;
}

function vec2Latex(v: Vec2): string {
  return `\\begin{pmatrix} ${v[0]} \\\\ ${v[1]} \\end{pmatrix}`;
}

function mat3Latex(m: Mat3): string {
  return `\\begin{pmatrix} ${m[0][0]} & ${m[0][1]} & ${m[0][2]} \\\\ ${m[1][0]} & ${m[1][1]} & ${m[1][2]} \\\\ ${m[2][0]} & ${m[2][1]} & ${m[2][2]} \\end{pmatrix}`;
}

function vec3Latex(v: Vec3): string {
  return `\\begin{pmatrix} ${v[0]} \\\\ ${v[1]} \\\\ ${v[2]} \\end{pmatrix}`;
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
// MODULE 6.24: THE INVERSE OF A MATRIX
// ════════════════════════════════════════════════════════════════════════════

/** introductionToTheInverseOfAMatrix covers inverse matrix definition and invertibility conditions. */
export const introductionToTheInverseOfAMatrix: TopicDef = {
  id: "introduction-to-the-inverse-of-a-matrix",
  title: t("Introduction to the Inverse of a Matrix", "逆矩阵的概念"),
  summary: t(
    "Understand the definition of a matrix inverse, identity matrices, and the condition under which a square matrix is invertible.",
    "理解逆矩阵的定义、单位矩阵的性质，以及方阵可逆的充要条件与行列式判别法。",
  ),
  prerequisites: ["the-determinant-of-a-2x2-matrix"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.10"],
  knowledgePoints: [
    {
      id: "matrix-inverse-definition",
      title: t("Definition of a matrix inverse", "逆矩阵的定义与单位矩阵"),
      explanation: t(
        "For a square matrix $A$, if there exists a matrix $B$ such that $AB = BA = I$, then $B$ is the multiplicative inverse of $A$, denoted $A^{-1}$. Here $I$ is the identity matrix.",
        "对于方阵 $A$，若存在方阵 $B$ 使得 $AB = BA = I$，则称 $B$ 为 $A$ 的乘法逆矩阵，记作 $A^{-1}$。其中 $I$ 为单位矩阵。",
      ),
      generate(rng) {
        const candidates: [number, number, number, number][] = [
          [2, 1, 1, 1],
          [3, 2, 1, 1],
          [4, 1, 3, 1],
          [5, 2, 2, 1],
          [1, 2, 3, 7],
          [2, 3, 1, 2],
          [3, 5, 1, 2],
          [4, 7, 1, 2],
          [2, 5, 1, 3],
          [3, 4, 2, 3],
          [5, 3, 3, 2],
          [1, 3, 2, 7],
          [3, 1, 2, 1],
          [4, 3, 1, 1],
          [5, 4, 1, 1],
          [2, 1, 3, 2],
          [3, 2, 4, 3],
          [1, 4, 2, 9],
          [2, 7, 1, 4],
          [3, 8, 1, 3],
          [5, 2, 7, 3],
          [4, 3, 5, 4],
          [3, 1, 5, 2],
          [2, 3, 3, 5],
          [1, 1, 2, 4],
          [2, 2, 1, 2],
          [3, 1, 1, 1],
          [4, 2, 1, 1],
          [1, 2, 1, 4],
          [2, 1, 2, 2],
          [3, 3, 1, 2],
          [5, 1, 2, 1],
        ];
        const cand = rng.pick(candidates);
        const s1 = rng.pick([1, -1]);
        const s2 = rng.pick([1, -1]);
        const a = cand[0] * s1;
        const b = cand[1] * s2;
        const c = cand[2] * s2;
        const d = cand[3] * s1;
        let D = a * d - b * c;
        if (D === 0) {
          D = 1;
        }
        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const invA: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(d, D), Q.of(-b, D)],
          [Q.of(-c, D), Q.of(a, D)],
        ];

        const w1: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(a, D), Q.of(b, D)],
          [Q.of(c, D), Q.of(d, D)],
        ];
        const w2: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(-d, D), Q.of(b, D)],
          [Q.of(c, D), Q.of(-a, D)],
        ];
        const w3: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(d, D), Q.of(b, D)],
          [Q.of(c, D), Q.of(a, D)],
        ];
        const w4: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(-d, D), Q.of(-b, D)],
          [Q.of(-c, D), Q.of(-a, D)],
        ];

        const rightLatex = mat2QLatex(invA);
        const aLatex = mat2Latex(A);

        return oneOf(
          rng,
          t(`Which matrix is the inverse $A^{-1}$ of the matrix $A = ${aLatex}$?`, `下列哪一个是矩阵 $A = ${aLatex}$ 的逆矩阵 $A^{-1}$？`),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2QLatex(w1)}$`, `$${mat2QLatex(w1)}$`),
            t(`$${mat2QLatex(w2)}$`, `$${mat2QLatex(w2)}$`),
            t(`$${mat2QLatex(w3)}$`, `$${mat2QLatex(w3)}$`),
            t(`$${mat2QLatex(w4)}$`, `$${mat2QLatex(w4)}$`),
          ],
          t(
            `The inverse matrix satisfies $A A^{-1} = I$. Using the $2 \\times 2$ formula $A^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$ with $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${D}$, we obtain $A^{-1} = ${rightLatex}$.`,
            `逆矩阵满足 $A A^{-1} = I$。由二阶逆矩阵公式 $A^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$，其中 $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${D}$，计算得 $A^{-1} = ${rightLatex}$。`,
          ),
        );
      },
    },
    {
      id: "invertibility-and-determinant-condition",
      title: t("Condition for invertibility of a matrix", "矩阵可逆与行列式条件"),
      explanation: t(
        "A square matrix $A$ is invertible if and only if $\\det(A) \\ne 0$. If $\\det(A) = 0$, the matrix is singular and has no multiplicative inverse.",
        "方阵 $A$ 可逆的充要条件是 $\\det(A) \\ne 0$。若 $\\det(A) = 0$，则称该矩阵是奇异的（退化的），它没有乘法逆矩阵。",
      ),
      generate(rng) {
        const a = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const m = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const b = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const c = a * m;
        const kSingular = b * m;

        const w1 = kSingular + rng.pick([1, 2, 3]);
        const w2 = kSingular - rng.pick([1, 2, 3]);
        const w3 = -kSingular;
        const w4 = kSingular + 4;

        return oneOf(
          rng,
          t(
            `For what value of $k$ is the matrix $M = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & k \\end{pmatrix}$ singular (not invertible)?`,
            `当 $k$ 取何值时，矩阵 $M = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & k \\end{pmatrix}$ 是奇异矩阵（不可逆）？`,
          ),
          t(`$k = ${kSingular}$`, `$k = ${kSingular}$`),
          [
            t(`$k = ${w1}$`, `$k = ${w1}$`),
            t(`$k = ${w2}$`, `$k = ${w2}$`),
            t(`$k = ${w3}$`, `$k = ${w3}$`),
            t(`$k = ${w4}$`, `$k = ${w4}$`),
          ],
          t(
            `A matrix is singular if and only if its determinant is zero:\n\n$$\\det(M) = (${a})(k) - (${b})(${c}) = 0 \\implies ${a}k = ${b * c} \\implies k = ${kSingular}$$.`,
            `方阵为奇异矩阵当且仅当其行列式为零：\n\n$$\\det(M) = (${a})(k) - (${b})(${c}) = 0 \\implies ${a}k = ${b * c} \\implies k = ${kSingular}$$。\n满足条件。`,
          ),
        );
      },
    },
  ],
};

/** inversesOf2x2Matrices covers computing inverses of 2x2 matrices. */
export const inversesOf2x2Matrices: TopicDef = {
  id: "inverses-of-2x2-matrices",
  title: t("Inverses of 2x2 Matrices", "二阶逆矩阵的公式与计算"),
  summary: t(
    "Compute the inverse of a 2x2 matrix using the determinant and adjugate formula.",
    "利用行列式和伴随矩阵公式计算二阶矩阵的逆矩阵。",
  ),
  prerequisites: ["introduction-to-the-inverse-of-a-matrix"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.10"],
  knowledgePoints: [
    {
      id: "formula-for-inverse-of-2x2-matrix",
      title: t("Formula for the inverse of a 2x2 matrix", "二阶逆矩阵的计算公式"),
      explanation: t(
        "For $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, the adjugate is $\\text{adj}(A) = \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$, and the inverse is $A^{-1} = \\frac{1}{\\det(A)}\\text{adj}(A) = \\frac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$.",
        "对于二阶矩阵 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$，其伴随矩阵为 $\\text{adj}(A) = \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$，逆矩阵为 $A^{-1} = \\frac{1}{\\det(A)}\\text{adj}(A) = \\frac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$。",
      ),
      generate(rng) {
        const a = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const c = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const d = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        if (a * d === b * c) {
          return this.generate(rng);
        }

        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const adj: Mat2 = [
          [d, -b],
          [-c, a],
        ];
        const w1: Mat2 = [
          [a, -b],
          [-c, d],
        ];
        const w2: Mat2 = [
          [-d, b],
          [c, -a],
        ];
        const w3: Mat2 = [
          [d, b],
          [c, a],
        ];
        const w4: Mat2 = [
          [-a, c],
          [b, -d],
        ];

        const ALatex = mat2Latex(A);
        const adjLatex = mat2Latex(adj);

        return oneOf(
          rng,
          t(
            `What is the adjugate matrix $\\text{adj}(A)$ of $A = ${ALatex}$?`,
            `矩阵 $A = ${ALatex}$ 的伴随矩阵 $\\text{adj}(A)$ 是什么？`,
          ),
          t(`$${adjLatex}$`, `$${adjLatex}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          t(
            `To form the adjugate of a $2 \\times 2$ matrix $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, swap the main diagonal entries and negate the off-diagonal entries: $\\text{adj}(A) = \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} = ${adjLatex}$.`,
            `求二阶方阵 $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 的伴随矩阵时，交换主对角线元素，并对副对角线元素取相反数：$\\text{adj}(A) = \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} = ${adjLatex}$。`,
          ),
        );
      },
    },
    {
      id: "calculating-inverse-of-2x2-matrix",
      title: t("Calculating the inverse of a 2x2 matrix", "计算二阶矩阵的逆矩阵"),
      explanation: t(
        "To find the inverse of $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, calculate $\\det(A) = ad - bc$, verify $\\det(A) \\ne 0$, and scale the adjugate matrix by $\\frac{1}{\\det(A)}$.",
        "求二阶矩阵 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 的逆矩阵，先计算 $\\det(A) = ad - bc$，确认 $\\det(A) \\ne 0$，再将伴随矩阵乘以 $\\frac{1}{\\det(A)}$。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const d = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const det = a * d - b * c;
        if (det === 0) return this.generate(rng);

        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const invA: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(d, det), Q.of(-b, det)],
          [Q.of(-c, det), Q.of(a, det)],
        ];

        const w1: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(a, det), Q.of(-b, det)],
          [Q.of(-c, det), Q.of(d, det)],
        ];
        const w2: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(-d, det), Q.of(b, det)],
          [Q.of(c, det), Q.of(-a, det)],
        ];
        const w3: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(d, det), Q.of(b, det)],
          [Q.of(c, det), Q.of(a, det)],
        ];
        const w4: readonly [readonly [Q, Q], readonly [Q, Q]] = [
          [Q.of(c, det), Q.of(d, det)],
          [Q.of(a, det), Q.of(b, det)],
        ];

        const ALatex = mat2Latex(A);
        const rightLatex = mat2QLatex(invA);

        return oneOf(
          rng,
          t(`Find the inverse matrix $A^{-1}$ for $A = ${ALatex}$.`, `求矩阵 $A = ${ALatex}$ 的逆矩阵 $A^{-1}$。`),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2QLatex(w1)}$`, `$${mat2QLatex(w1)}$`),
            t(`$${mat2QLatex(w2)}$`, `$${mat2QLatex(w2)}$`),
            t(`$${mat2QLatex(w3)}$`, `$${mat2QLatex(w3)}$`),
            t(`$${mat2QLatex(w4)}$`, `$${mat2QLatex(w4)}$`),
          ],
          t(
            `Calculate the determinant: $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det}$.\n\nThen compute $A^{-1} = \\frac{1}{${det}}\\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix} = ${rightLatex}$.`,
            `计算行列式：$\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det}$。\n\n因此 $A^{-1} = \\frac{1}{${det}}\\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix} = ${rightLatex}$。`,
          ),
        );
      },
    },
  ],
};

/** calculatingTheInverseOfA3x3MatrixUsingTheCofactorMethod covers 3x3 matrix inverses via adjugate. */
export const calculatingTheInverseOfA3x3MatrixUsingTheCofactorMethod: TopicDef = {
  id: "calculating-the-inverse-of-a-3x3-matrix-using-the-cofactor-method",
  title: t("Calculating the Inverse of a 3x3 Matrix Using the Cofactor Method", "利用伴随矩阵法求三阶逆矩阵"),
  summary: t(
    "Find the inverse of a 3x3 matrix using the matrix of cofactors, the adjugate matrix, and the determinant.",
    "利用代数余子式矩阵、伴随矩阵与行列式求解三阶逆矩阵。",
  ),
  prerequisites: ["the-determinant-of-a-3x3-matrix", "inverses-of-2x2-matrices"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.VM.C.10"],
  knowledgePoints: [
    {
      id: "cofactor-and-adjugate-matrix-3x3",
      title: t("Cofactors and the adjugate of a 3x3 matrix", "三阶矩阵的代数余子式与伴随矩阵"),
      explanation: t(
        "For a $3 \\times 3$ matrix $A$, the cofactor of element $a_{ij}$ is $C_{ij} = (-1)^{i+j} M_{ij}$, where $M_{ij}$ is the determinant of the $2 \\times 2$ submatrix after deleting row $i$ and column $j$. The adjugate matrix is the transpose of the cofactor matrix: $\\text{adj}(A) = C^T$.",
        "对于三阶矩阵 $A$，元素 $a_{ij}$ 的代数余子式为 $C_{ij} = (-1)^{i+j} M_{ij}$，其中 $M_{ij}$ 是划去第 $i$ 行和第 $j$ 列后的二阶子式。伴随矩阵为代数余子式矩阵的转置：$\\text{adj}(A) = C^T$。",
      ),
      generate(rng) {
        const pool: Mat3[] = [
          [
            [1, 2, 0],
            [0, 3, 1],
            [2, 1, 4],
          ],
          [
            [2, 0, 1],
            [1, 3, 2],
            [0, 4, 1],
          ],
          [
            [1, 1, 2],
            [2, 0, 1],
            [1, 3, 1],
          ],
          [
            [3, 1, 0],
            [2, 2, 1],
            [1, 0, 4],
          ],
          [
            [1, 0, 3],
            [2, 1, 1],
            [0, 2, 2],
          ],
          [
            [2, 1, 3],
            [1, 0, 2],
            [3, 2, 1],
          ],
          [
            [1, 2, 1],
            [0, 1, 3],
            [2, 0, 2],
          ],
          [
            [3, 0, 2],
            [1, 2, 1],
            [2, 1, 3],
          ],
          [
            [2, 2, 0],
            [1, 3, 1],
            [0, 1, 2],
          ],
          [
            [1, 3, 2],
            [2, 1, 0],
            [1, 0, 3],
          ],
        ];
        const A = rng.pick(pool);
        const row = rng.pick([0, 1, 2]);
        const col = rng.pick([0, 1, 2]);

        const subR = [0, 1, 2].filter((r) => r !== row);
        const subC = [0, 1, 2].filter((c) => c !== col);
        const m00 = A[subR[0]!]![subC[0]!]!;
        const m01 = A[subR[0]!]![subC[1]!]!;
        const m10 = A[subR[1]!]![subC[0]!]!;
        const m11 = A[subR[1]!]![subC[1]!]!;
        const minor = m00 * m11 - m01 * m10;
        const sign = (row + col) % 2 === 0 ? 1 : -1;
        const cofactor = sign * minor;

        const w1 = -cofactor;
        const w2 = minor;
        const w3 = cofactor + (minor === 0 ? 2 : 1);
        const w4 = -minor + 1;

        const ALatex = mat3Latex(A);
        const entryVal = A[row]![col]!;

        return oneOf(
          rng,
          t(
            `For the matrix $A = ${ALatex}$, find the cofactor $C_{${row + 1}${col + 1}}$ corresponding to entry $a_{${row + 1}${col + 1}} = ${entryVal}$.`,
            `对于矩阵 $A = ${ALatex}$，求元素 $a_{${row + 1}${col + 1}} = ${entryVal}$ 对应的代数余子式 $C_{${row + 1}${col + 1}}$。`,
          ),
          t(`$C_{${row + 1}${col + 1}} = ${cofactor}$`, `$C_{${row + 1}${col + 1}} = ${cofactor}$`),
          [
            t(`$C_{${row + 1}${col + 1}} = ${w1}$`, `$C_{${row + 1}${col + 1}} = ${w1}$`),
            t(`$C_{${row + 1}${col + 1}} = ${w2}$`, `$C_{${row + 1}${col + 1}} = ${w2}$`),
            t(`$C_{${row + 1}${col + 1}} = ${w3}$`, `$C_{${row + 1}${col + 1}} = ${w3}$`),
            t(`$C_{${row + 1}${col + 1}} = ${w4}$`, `$C_{${row + 1}${col + 1}} = ${w4}$`),
          ],
          t(
            `Delete row ${row + 1} and column ${col + 1} to get the submatrix $\\begin{pmatrix} ${m00} & ${m01} \\\\ ${m10} & ${m11} \\end{pmatrix}$.\n\nIts determinant is $M_{${row + 1}${col + 1}} = (${m00})(${m11}) - (${m01})(${m10}) = ${minor}$.\n\nThe sign is $(-1)^{${row + 1} + ${col + 1}} = ${sign > 0 ? "+1" : "-1"}$, so $C_{${row + 1}${col + 1}} = ${cofactor}$.`,
            `划去第 ${row + 1} 行与第 ${col + 1} 列，得到子矩阵 $\\begin{pmatrix} ${m00} & ${m01} \\\\ ${m10} & ${m11} \\end{pmatrix}$。\n\n其行列式为 $M_{${row + 1}${col + 1}} = (${m00})(${m11}) - (${m01})(${m10}) = ${minor}$。\n\n符号为 $(-1)^{${row + 1} + ${col + 1}} = ${sign > 0 ? "+1" : "-1"}$，故 $C_{${row + 1}${col + 1}} = ${cofactor}$。`,
          ),
        );
      },
    },
    {
      id: "inverse-of-3x3-matrix-by-cofactors",
      title: t("Computing the inverse of a 3x3 matrix using cofactors", "伴随矩阵法求解三阶逆矩阵"),
      explanation: t(
        "For an invertible $3 \\times 3$ matrix $A$, its inverse is given by $A^{-1} = \\frac{1}{\\det(A)}\\text{adj}(A)$, where the $(i, j)$ entry of $\\text{adj}(A)$ is the cofactor $C_{ji}$.",
        "对于可逆的三阶方阵 $A$，其逆矩阵公式为 $A^{-1} = \\frac{1}{\\det(A)}\\text{adj}(A)$，其中伴随矩阵 $\\text{adj}(A)$ 的第 $(i, j)$ 个元素为代数余子式 $C_{ji}$。",
      ),
      generate(rng) {
        const isUpper = rng.pick([true, false]);
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const b = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);

        let A: Mat3;
        let inv: Mat3;
        if (isUpper) {
          A = [
            [1, a, b],
            [0, 1, c],
            [0, 0, 1],
          ];
          inv = [
            [1, -a, a * c - b],
            [0, 1, -c],
            [0, 0, 1],
          ];
        } else {
          A = [
            [1, 0, 0],
            [a, 1, 0],
            [b, c, 1],
          ];
          inv = [
            [1, 0, 0],
            [-a, 1, 0],
            [a * c - b, -c, 1],
          ];
        }

        const ALatex = mat3Latex(A);
        const invLatex = mat3Latex(inv);

        const w1: Mat3 = [
          [inv[0][0], -inv[0][1], inv[0][2]],
          [inv[1][0], inv[1][1], -inv[1][2]],
          [inv[2][0], inv[2][1], inv[2][2]],
        ];
        const w2: Mat3 = [
          [inv[0][0], inv[1][0], inv[2][0]],
          [inv[0][1], inv[1][1], inv[2][1]],
          [inv[0][2], inv[1][2], inv[2][2]],
        ];
        const w3: Mat3 = [
          [-inv[0][0], -inv[0][1], -inv[0][2]],
          [-inv[1][0], -inv[1][1], -inv[1][2]],
          [-inv[2][0], -inv[2][1], -inv[2][2]],
        ];
        const w4: Mat3 = [
          [A[0][0], A[0][1], A[0][2]],
          [A[1][0], A[1][0], A[1][2]],
          [A[2][0], A[2][1], A[2][2]],
        ];

        return oneOf(
          rng,
          t(
            `Find the inverse matrix $A^{-1}$ for the $3 \\times 3$ matrix $A = ${ALatex}$.`,
            `求三阶矩阵 $A = ${ALatex}$ 的逆矩阵 $A^{-1}$。`,
          ),
          t(`$${invLatex}$`, `$${invLatex}$`),
          [
            t(`$${mat3Latex(w1)}$`, `$${mat3Latex(w1)}$`),
            t(`$${mat3Latex(w2)}$`, `$${mat3Latex(w2)}$`),
            t(`$${mat3Latex(w3)}$`, `$${mat3Latex(w3)}$`),
            t(`$${mat3Latex(w4)}$`, `$${mat3Latex(w4)}$`),
          ],
          t(
            `The determinant of the triangular matrix is the product of its diagonal entries: $\\det(A) = 1$. Computing the cofactor matrix $C$ and taking its transpose gives $\\text{adj}(A) = C^T = ${invLatex}$. Hence $A^{-1} = \\frac{1}{1}\\text{adj}(A) = ${invLatex}$.`,
            `三角形矩阵的行列式为其主对角线元素的乘积：$\\det(A) = 1$。计算代数余子式矩阵 $C$ 并转置得到伴随矩阵 $\\text{adj}(A) = C^T = ${invLatex}$。因此 $A^{-1} = \\frac{1}{1}\\text{adj}(A) = ${invLatex}$。`,
          ),
        );
      },
    },
  ],
};

/** solving2x2SystemsOfEquationsUsingInverseMatrices covers solving 2x2 systems via A^(-1)b. */
export const solving2x2SystemsOfEquationsUsingInverseMatrices: TopicDef = {
  id: "solving-2x2-systems-of-equations-using-inverse-matrices",
  title: t("Solving 2x2 Systems of Equations Using Inverse Matrices", "利用二阶逆矩阵求解二元一次方程组"),
  summary: t(
    "Formulate a system of two linear equations as a matrix equation and solve it using the inverse matrix.",
    "将二元一次方程组表示为矩阵方程，并利用逆矩阵求解未知向量。",
  ),
  prerequisites: ["inverses-of-2x2-matrices", "representing-2x2-systems-of-equations-using-a-matrix-product"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSA.REI.C.8", "CCSS.HSA.REI.C.9"],
  knowledgePoints: [
    {
      id: "matrix-inversion-form-for-2x2-system",
      title: t("Matrix equation form and inverse solution expression", "矩阵方程形式与逆矩阵表达式"),
      explanation: t(
        "A system $\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}$ is represented as $A\\mathbf{x} = \\mathbf{b}$, where $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, $\\mathbf{x} = \\begin{pmatrix} x \\\\ y \\end{pmatrix}$, and $\\mathbf{b} = \\begin{pmatrix} e \\\\ f \\end{pmatrix}$. Left-multiplying by $A^{-1}$ yields $\\mathbf{x} = A^{-1}\\mathbf{b}$.",
        "线性方程组 $\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}$ 可以写成矩阵方程 $A\\mathbf{x} = \\mathbf{b}$。两边左乘逆矩阵 $A^{-1}$，可得解向量 $\\mathbf{x} = A^{-1}\\mathbf{b}$。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5]);
        const b = rng.pick([1, 2, 3]);
        const c = rng.pick([1, 2, 3]);
        const d = rng.pick([2, 3, 4]);
        if (a * d === b * c) return this.generate(rng);
        const e = rng.pick([-7, -5, -3, 2, 4, 6, 8]);
        const f = rng.pick([-6, -4, -1, 3, 5, 7]);

        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const ALatex = mat2Latex(A);
        const bVec: Vec2 = [e, f];
        const bLatex = vec2Latex(bVec);

        return oneOf(
          rng,
          t(
            `Which matrix expression gives the solution $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$ to the system $\\begin{cases} ${a}x + ${b}y = ${e} \\\\ ${c}x + ${d}y = ${f} \\end{cases}$?`,
            `哪一个矩阵表达式给出了方程组 $\\begin{cases} ${a}x + ${b}y = ${e} \\\\ ${c}x + ${d}y = ${f} \\end{cases}$ 的解 $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$？`,
          ),
          t(`$${ALatex}^{-1} ${bLatex}$`, `$${ALatex}^{-1} ${bLatex}$`),
          [
            t(`$${bLatex} ${ALatex}^{-1}$`, `$${bLatex} ${ALatex}^{-1}$`),
            t(`$${ALatex} ${bLatex}$`, `$${ALatex} ${bLatex}$`),
            t(`$${bLatex}^{-1} ${ALatex}$`, `$${bLatex}^{-1} ${ALatex}$`),
            t(`$(${ALatex} ${bLatex})^{-1}$`, `$(${ALatex} ${bLatex})^{-1}$`),
          ],
          t(
            `Writing the system as $A \\mathbf{x} = \\mathbf{b}$ with $A = ${ALatex}$ and $\\mathbf{b} = ${bLatex}$, left-multiplying both sides by $A^{-1}$ gives $\\mathbf{x} = A^{-1}\\mathbf{b} = ${ALatex}^{-1} ${bLatex}$. Notice matrix multiplication is not commutative, so $A^{-1}$ must be on the left.`,
            `将方程组写为 $A \\mathbf{x} = \\mathbf{b}$，其中 $A = ${ALatex}$，$\\mathbf{b} = ${bLatex}$。两边左乘 $A^{-1}$ 得 $\\mathbf{x} = A^{-1}\\mathbf{b} = ${ALatex}^{-1} ${bLatex}$。注意矩阵乘法不满足交换律，因此 $A^{-1}$ 必须在左侧。`,
          ),
        );
      },
    },
    {
      id: "solving-2x2-system-via-inverse-matrix",
      title: t("Solving a 2x2 linear system using the inverse matrix", "利用逆矩阵求解二元线性方程组"),
      explanation: t(
        "To solve $A\\mathbf{x} = \\mathbf{b}$, calculate $A^{-1} = \\frac{1}{\\det(A)}\\text{adj}(A)$ and multiply by $\\mathbf{b}$ to obtain $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$.",
        "求解 $A\\mathbf{x} = \\mathbf{b}$ 时，先求出逆矩阵 $A^{-1} = \\frac{1}{\\det(A)}\\text{adj}(A)$，再计算矩阵乘积 $A^{-1}\\mathbf{b}$ 即可得到 $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$。",
      ),
      generate(rng) {
        const x0 = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const y0 = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const candA: Mat2[] = [
          [
            [1, 2],
            [3, 5],
          ],
          [
            [2, 1],
            [5, 3],
          ],
          [
            [3, 1],
            [4, 2],
          ],
          [
            [2, 3],
            [1, 2],
          ],
          [
            [3, 2],
            [1, 1],
          ],
          [
            [4, 1],
            [3, 1],
          ],
          [
            [1, -1],
            [2, 1],
          ],
          [
            [2, -1],
            [1, 1],
          ],
          [
            [3, -2],
            [1, 1],
          ],
          [
            [1, 3],
            [2, 7],
          ],
          [
            [2, 5],
            [1, 3],
          ],
          [
            [5, 2],
            [2, 1],
          ],
          [
            [3, 4],
            [1, 2],
          ],
          [
            [4, 3],
            [1, 1],
          ],
          [
            [2, 1],
            [3, 2],
          ],
        ];
        const A = rng.pick(candA);
        const e = A[0][0] * x0 + A[0][1] * y0;
        const f = A[1][0] * x0 + A[1][1] * y0;

        const w1: Vec2 = [y0, x0];
        const w2: Vec2 = [-x0, y0];
        const w3: Vec2 = [x0, -y0];
        const w4: Vec2 = [x0 + 1, y0 - 1];

        return oneOf(
          rng,
          t(
            `Use inverse matrices to solve the system of equations:\n\n$$\\begin{cases} ${A[0][0]}x + ${A[0][1]}y = ${e} \\\\ ${A[1][0]}x + ${A[1][1]}y = ${f} \\end{cases}$$`,
            `利用逆矩阵求解下列方程组：\n\n$$\\begin{cases} ${A[0][0]}x + ${A[0][1]}y = ${e} \\\\ ${A[1][0]}x + ${A[1][1]}y = ${f} \\end{cases}$$`,
          ),
          t(`$x = ${x0},\\; y = ${y0}$`, `$x = ${x0},\\; y = ${y0}$`),
          [
            t(`$x = ${w1[0]},\\; y = ${w1[1]}$`, `$x = ${w1[0]},\\; y = ${w1[1]}$`),
            t(`$x = ${w2[0]},\\; y = ${w2[1]}$`, `$x = ${w2[0]},\\; y = ${w2[1]}$`),
            t(`$x = ${w3[0]},\\; y = ${w3[1]}$`, `$x = ${w3[0]},\\; y = ${w3[1]}$`),
            t(`$x = ${w4[0]},\\; y = ${w4[1]}$`, `$x = ${w4[0]},\\; y = ${w4[1]}$`),
          ],
          t(
            `Coefficient matrix $A = ${mat2Latex(A)}$ has determinant $\\det(A) = (${A[0][0]})(${A[1][1]}) - (${A[0][1]})(${A[1][0]}) = ${A[0][0] * A[1][1] - A[0][1] * A[1][0]}$.\n\nMultiplying $\\mathbf{x} = A^{-1}\\mathbf{b}$ gives $x = ${x0},\\; y = ${y0}$.`,
            `系数矩阵 $A = ${mat2Latex(A)}$ 的行列式为 $\\det(A) = (${A[0][0]})(${A[1][1]}) - (${A[0][1]})(${A[1][0]}) = ${A[0][0] * A[1][1] - A[0][1] * A[1][0]}$。\n\n计算 $\\mathbf{x} = A^{-1}\\mathbf{b}$ 可得 $x = ${x0},\\; y = ${y0}$。`,
          ),
        );
      },
    },
  ],
};

/** solvingSystemsOfEquationsUsingInverseMatrices covers uniqueness, solvability and 3x3 systems. */
export const solvingSystemsOfEquationsUsingInverseMatrices: TopicDef = {
  id: "solving-systems-of-equations-using-inverse-matrices",
  title: t("Solving Systems of Equations Using Inverse Matrices", "利用逆矩阵求解线性方程组"),
  summary: t(
    "Understand when systems have unique solutions via invertibility, and solve systems given an inverse matrix.",
    "理解利用矩阵可逆性判断线性方程组解的唯一性，并利用已知逆矩阵求解方程组。",
  ),
  prerequisites: ["solving-2x2-systems-of-equations-using-inverse-matrices"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSA.REI.C.8", "CCSS.HSA.REI.C.9"],
  knowledgePoints: [
    {
      id: "solvability-and-invertibility-of-linear-systems",
      title: t("Uniqueness of solutions and matrix invertibility", "矩阵可逆性与解的存在唯一性"),
      explanation: t(
        "A square linear system $A\\mathbf{x} = \\mathbf{b}$ has a unique solution $\\mathbf{x} = A^{-1}\\mathbf{b}$ if and only if $A$ is invertible (i.e. $\\det(A) \\ne 0$). If $\\det(A) = 0$, the system either has no solution or infinitely many solutions.",
        "线性方程组 $A\\mathbf{x} = \\mathbf{b}$ 存在唯一解 $\\mathbf{x} = A^{-1}\\mathbf{b}$ 的充要条件是系数矩阵 $A$ 可逆（即 $\\det(A) \\ne 0$）。若 $\\det(A) = 0$，则方程组无解或有无穷多解。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5]);
        const b = rng.pick([1, 2, 3, 4]);
        const m = rng.pick([2, 3, -2, -3]);
        const c = a * m;
        const d = b * m;

        const isSingular = rng.pick([true, false]);
        const actualD = isSingular ? d : d + rng.pick([1, -1, 2, -2]);
        const det = a * actualD - b * c;
        const A: Mat2 = [
          [a, b],
          [c, actualD],
        ];
        const ALatex = mat2Latex(A);

        if (det === 0) {
          return oneOf(
            rng,
            t(
              `Does the matrix equation $${ALatex} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$ have a unique solution?`,
              `矩阵方程 $${ALatex} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$ 是否有唯一解？`,
            ),
            t(`No, because $\\det(A) = 0$, so the matrix is not invertible.`, `否，因为 $\\det(A) = 0$，系数矩阵不可逆。`),
            [
              t(`Yes, because $\\det(A) \\ne 0$, so $A^{-1}$ exists.`, `是，因为 $\\det(A) \\ne 0$，逆矩阵存在。`),
              t(`Yes, because every linear system has a unique solution.`, `是，因为任何线性方程组都有唯一解。`),
              t(`No, because the right-hand vector has non-zero entries.`, `否，因为等号右侧常数向量非零。`),
            ],
            t(
              `Calculate the determinant: $\\det(A) = (${a})(${actualD}) - (${b})(${c}) = 0$. Since $\\det(A) = 0$, $A$ is singular (not invertible), so the system does not have a unique solution.`,
              `计算系数矩阵的行列式：$\\det(A) = (${a})(${actualD}) - (${b})(${c}) = 0$。由于 $\\det(A) = 0$，矩阵 $A$ 奇异不可逆，因此方程组不存在唯一解。`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `Does the matrix equation $${ALatex} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 5 \\end{pmatrix}$ have a unique solution?`,
            `矩阵方程 $${ALatex} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 5 \\end{pmatrix}$ 是否有唯一解？`,
          ),
          t(`Yes, because $\\det(A) = ${det} \\ne 0$, so $A$ is invertible.`, `是，因为 $\\det(A) = ${det} \\ne 0$，系数矩阵可逆。`),
          [
            t(`No, because $\\det(A) = 0$, so the matrix is singular.`, `否，因为 $\\det(A) = 0$，矩阵奇异。`),
            t(`No, because $2 \\times 2$ systems never have unique solutions.`, `否，因为二阶系统从无唯一解。`),
            t(`Yes, but only if the right-hand side is the zero vector.`, `是，但仅当常数项为零向量时才成立。`),
          ],
          t(
            `Calculate the determinant: $\\det(A) = (${a})(${actualD}) - (${b})(${c}) = ${det} \\ne 0$. Because $\\det(A) \\ne 0$, the matrix $A$ is invertible, guaranteeing the unique solution $\\mathbf{x} = A^{-1}\\mathbf{b}$.`,
            `计算行列式：$\\det(A) = (${a})(${actualD}) - (${b})(${c}) = ${det} \\ne 0$。因为 $\\det(A) \\ne 0$，矩阵 $A$ 可逆，因此保证存在唯一解 $\\mathbf{x} = A^{-1}\\mathbf{b}$。`,
          ),
        );
      },
    },
    {
      id: "solving-systems-given-matrix-inverse",
      title: t("Solving a 3x3 system using a given inverse matrix", "利用已知逆矩阵求解三阶线性方程组"),
      explanation: t(
        "When the inverse matrix $A^{-1}$ of a system $A\\mathbf{x} = \\mathbf{b}$ is already known, we directly calculate the solution vector by matrix-vector multiplication: $\\mathbf{x} = A^{-1}\\mathbf{b}$.",
        "当方程组 $A\\mathbf{x} = \\mathbf{b}$ 的逆矩阵 $A^{-1}$ 已知时，直接通过矩阵与向量的乘积求解未知向量：$\\mathbf{x} = A^{-1}\\mathbf{b}$。",
      ),
      generate(rng) {
        const a = rng.pick([-2, -1, 1, 2]);
        const bVal = rng.pick([-2, -1, 1, 2]);
        const c = rng.pick([-2, -1, 1, 2]);
        const isUpper = rng.pick([true, false]);

        let inv: Mat3;
        if (isUpper) {
          inv = [
            [1, a, bVal],
            [0, 1, c],
            [0, 0, 1],
          ];
        } else {
          inv = [
            [1, 0, 0],
            [a, 1, 0],
            [bVal, c, 1],
          ];
        }

        const b: Vec3 = [
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
          rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]),
        ];
        const x = inv[0][0] * b[0] + inv[0][1] * b[1] + inv[0][2] * b[2];
        const y = inv[1][0] * b[0] + inv[1][1] * b[1] + inv[1][2] * b[2];
        const z = inv[2][0] * b[0] + inv[2][1] * b[1] + inv[2][2] * b[2];

        const invLatex = mat3Latex(inv);
        const bLatex = vec3Latex(b);

        const w1: Vec3 = [x + 1, y - 1, z];
        const w2: Vec3 = [z, y, x];
        const w3: Vec3 = [-x, y, z];
        const w4: Vec3 = [x, -y, z];

        return oneOf(
          rng,
          t(
            `Given that the inverse of the coefficient matrix $A$ is $A^{-1} = ${invLatex}$, solve the system $A\\mathbf{x} = ${bLatex}$ for $\\mathbf{x} = \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}$.`,
            `已知系数矩阵 $A$ 的逆矩阵为 $A^{-1} = ${invLatex}$，求解方程组 $A\\mathbf{x} = ${bLatex}$ 中的未知向量 $\\mathbf{x} = \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}$。`,
          ),
          t(
            `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex([x, y, z])}$`,
            `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex([x, y, z])}$`,
          ),
          [
            t(
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w1)}$`,
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w1)}$`,
            ),
            t(
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w2)}$`,
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w2)}$`,
            ),
            t(
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w3)}$`,
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w3)}$`,
            ),
            t(
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w4)}$`,
              `$\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${vec3Latex(w4)}$`,
            ),
          ],
          t(
            `Compute the matrix-vector product $\\mathbf{x} = A^{-1}\\mathbf{b}$:\n\n$$\\mathbf{x} = ${invLatex} ${bLatex} = ${vec3Latex([x, y, z])}$$.`,
            `计算矩阵与向量的乘积 $\\mathbf{x} = A^{-1}\\mathbf{b}$：\n\n$$\\mathbf{x} = ${invLatex} ${bLatex} = ${vec3Latex([x, y, z])}$$.`,
          ),
        );
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 6.25: LINEAR TRANSFORMATIONS (PART 1: TOPICS 6 TO 11)
// ════════════════════════════════════════════════════════════════════════════

/** introductionToLinearTransformations introduces linear maps in R^2 and their defining properties. */
export const introductionToLinearTransformations: TopicDef = {
  id: "introduction-to-linear-transformations",
  title: t("Introduction to Linear Transformations", "线性变换的概念"),
  summary: t(
    "Understand maps from R^2 to R^2 that satisfy additivity and scalar homogeneity.",
    "理解平面到平面的映射，掌握线性变换的加法可加性与数乘齐次性。",
  ),
  prerequisites: ["multiplying-a-matrix-by-a-column-vector"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.11"],
  knowledgePoints: [
    {
      id: "definition-and-properties-of-linear-transformations",
      title: t("Properties and linearity tests", "线性变换的性质与判定"),
      explanation: t(
        "A transformation $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ is linear if and only if for all vectors $\\mathbf{u}, \\mathbf{v}$ and scalars $c$:\n1. $T(\\mathbf{u} + \\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$ (additivity)\n2. $T(c\\mathbf{u}) = c T(\\mathbf{u})$ (homogeneity)\nIn particular, every linear transformation maps the origin to itself: $T(\\mathbf{0}) = \\mathbf{0}$.",
        "映射 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 是线性变换，当且仅当对任意向量 $\\mathbf{u}, \\mathbf{v}$ 及标量 $c$ 满足：\n1. $T(\\mathbf{u} + \\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$（可加性）\n2. $T(c\\mathbf{u}) = c T(\\mathbf{u})$（齐次性）\n特别地，所有线性变换必将原点映射到原点：$T(\\mathbf{0}) = \\mathbf{0}$。",
      ),
      generate(rng) {
        const isLinear = rng.pick([true, false]);
        const a = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const c = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const d = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const k = rng.pick([2, 3, 4, 5]);

        let formula = "";
        let reasonEn = "";
        let reasonZh = "";

        if (isLinear) {
          formula = `(${a}x + ${b}y, \\; ${c}x + ${d}y)`;
          reasonEn = `Each component is a linear combination of $x$ and $y$ with no constants or non-linear terms. It satisfies $T(\\mathbf{u} + \\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$ and $T(c\\mathbf{u}) = cT(\\mathbf{u})$.`;
          reasonZh = `每个坐标分量都是 $x$ 与 $y$ 的齐次一次线性组合，满足可加性与齐次性。`;
        } else {
          const nonlinType = rng.pick(["offset", "square", "product", "abs"]);
          if (nonlinType === "offset") {
            formula = `(${a}x + ${b}y + ${k}, \\; ${c}x + ${d}y)`;
            reasonEn = `It includes a constant offset $+${k}$, so $T(\\mathbf{0}) = (${k}, 0) \\ne \\mathbf{0}$, violating linearity.`;
            reasonZh = `含有非零常数偏移 $+${k}$，导致 $T(\\mathbf{0}) \\ne \\mathbf{0}$，因此不是线性变换。`;
          } else if (nonlinType === "square") {
            formula = `(x^2 + ${b}y, \\; ${c}x)`;
            reasonEn = `It contains a quadratic term $x^2$, violating homogeneity: $T(c\\mathbf{u}) \\ne cT(\\mathbf{u})$.`;
            reasonZh = `含有平方项 $x^2$，破坏了齐次性。`;
          } else if (nonlinType === "product") {
            formula = `(xy, \\; ${c}x + ${d}y)`;
            reasonEn = `It contains the product term $xy$, violating additivity.`;
            reasonZh = `含有乘积项 $xy$，不满足可加性。`;
          } else {
            formula = `(|x|, \\; ${c}y)`;
            reasonEn = `It contains an absolute value $|x|$, violating linearity.`;
            reasonZh = `含有绝对值 $|x|$，不是线性变换。`;
          }
        }

        const rightAnswer = isLinear
          ? t("Yes, it is a linear transformation", "是，它是线性变换")
          : t("No, it is not a linear transformation", "否，它不是线性变换");

        const wrong1 = isLinear
          ? t("No, it is not a linear transformation", "否，它不是线性变换")
          : t("Yes, it is a linear transformation", "是，它是线性变换");

        const wrong2 = t("It is linear only when $x > 0$ and $y > 0$", "仅当 $x > 0$ 且 $y > 0$ 时才是线性变换");
        const wrong3 = t("Linearity cannot be determined from coordinate formulas", "仅凭坐标表达式无法判断是否线性");

        return oneOf(
          rng,
          t(
            `Determine whether the mapping $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ defined by $T(x, y) = ${formula}$ is a linear transformation.`,
            `判断由公式 $T(x, y) = ${formula}$ 定义的映射 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 是否为线性变换。`,
          ),
          rightAnswer,
          [wrong1, wrong2, wrong3],
          t(
            `A transformation is linear if and only if each coordinate formula is of the form $ax + by$ with no constants, products, powers, or non-linear operations.\n\n${reasonEn}`,
            `平面映射是线性的，当且仅当各个坐标分量均为形如 $ax + by$ 的齐次一次式，且不含常数偏置、乘积、乘方或非线性函数。\n\n${reasonZh}`,
          ),
        );
      },
    },
    {
      id: "evaluating-linear-transformations-on-vectors",
      title: t("Evaluating linear transformations on linear combinations", "在线性组合上计算线性变换"),
      explanation: t(
        "By linearity, for any vectors $\\mathbf{u}, \\mathbf{v}$ and constants $c_1, c_2$, we have $T(c_1\\mathbf{u} + c_2\\mathbf{v}) = c_1 T(\\mathbf{u}) + c_2 T(\\mathbf{v})$.",
        "根据线性性质，对任意向量 $\\mathbf{u}, \\mathbf{v}$ 和常数 $c_1, c_2$，均有 $T(c_1\\mathbf{u} + c_2\\mathbf{v}) = c_1 T(\\mathbf{u}) + c_2 T(\\mathbf{v})$。",
      ),
      generate(rng) {
        const uImg: Vec2 = [rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]), rng.pick([-4, -3, -2, -1, 1, 2, 3, 4])];
        const vImg: Vec2 = [rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]), rng.pick([-4, -3, -2, -1, 1, 2, 3, 4])];
        const c1 = rng.pick([-3, -2, 2, 3]);
        const c2 = rng.pick([-3, -2, 2, 3]);

        const rx = c1 * uImg[0] + c2 * vImg[0];
        const ry = c1 * uImg[1] + c2 * vImg[1];
        const rightVec: Vec2 = [rx, ry];

        const w1: Vec2 = [rx + 1, ry - 1];
        const w2: Vec2 = [c1 * uImg[0] - c2 * vImg[0], c1 * uImg[1] - c2 * vImg[1]];
        const w3: Vec2 = [c2 * uImg[0] + c1 * vImg[0], c2 * uImg[1] + c1 * vImg[1]];
        const w4: Vec2 = [-rx, -ry];

        const uLatex = vec2Latex(uImg);
        const vLatex = vec2Latex(vImg);
        const rightLatex = vec2Latex(rightVec);

        return oneOf(
          rng,
          t(
            `Let $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ be a linear transformation such that $T(\\mathbf{u}) = ${uLatex}$ and $T(\\mathbf{v}) = ${vLatex}$. Find $T(${c1}\\mathbf{u} + ${c2}\\mathbf{v})$.`,
            `设 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 是线性变换，且 $T(\\mathbf{u}) = ${uLatex}$，$T(\\mathbf{v}) = ${vLatex}$。求 $T(${c1}\\mathbf{u} + ${c2}\\mathbf{v})$ 的值。`,
          ),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${vec2Latex(w1)}$`, `$${vec2Latex(w1)}$`),
            t(`$${vec2Latex(w2)}$`, `$${vec2Latex(w2)}$`),
            t(`$${vec2Latex(w3)}$`, `$${vec2Latex(w3)}$`),
            t(`$${vec2Latex(w4)}$`, `$${vec2Latex(w4)}$`),
          ],
          t(
            `By the linearity property:\n\n$$T(${c1}\\mathbf{u} + ${c2}\\mathbf{v}) = ${c1}T(\\mathbf{u}) + ${c2}T(\\mathbf{v}) = ${c1}${uLatex} + ${c2}${vLatex} = ${rightLatex}$$.`,
            `由线性变换的基本性质：\n\n$$T(${c1}\\mathbf{u} + ${c2}\\mathbf{v}) = ${c1}T(\\mathbf{u}) + ${c2}T(\\mathbf{v}) = ${c1}${uLatex} + ${c2}${vLatex} = ${rightLatex}$$.`,
          ),
        );
      },
    },
  ],
};

/** theStandardMatrixOfALinearTransformation constructs standard matrices from basis vector images. */
export const theStandardMatrixOfALinearTransformation: TopicDef = {
  id: "the-standard-matrix-of-a-linear-transformation",
  title: t("The Standard Matrix of a Linear Transformation", "线性变换的标准矩阵"),
  summary: t(
    "Construct the standard matrix of a linear transformation using the images of the standard basis vectors.",
    "利用标准基向量的像构造线性变换的标准矩阵。",
  ),
  prerequisites: ["introduction-to-linear-transformations"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.11"],
  knowledgePoints: [
    {
      id: "constructing-standard-matrix-from-basis-images",
      title: t("Standard matrix from images of basis vectors", "由基向量的像构造标准矩阵"),
      explanation: t(
        "Every linear transformation $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ can be represented as multiplication by a unique matrix $A = [T(\\mathbf{e}_1) \\mid T(\\mathbf{e}_2)]$, whose columns are the images of the standard basis vectors $\\mathbf{e}_1 = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ and $\\mathbf{e}_2 = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$.",
        "每个线性变换 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 都可以表示为乘以唯一的标准矩阵 $A = [T(\\mathbf{e}_1) \\mid T(\\mathbf{e}_2)]$，该矩阵的各列分别是标准基向量 $\\mathbf{e}_1 = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ 与 $\\mathbf{e}_2 = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$ 的像。",
      ),
      generate(rng) {
        const a = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const c = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const b = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const d = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);

        const Te1: Vec2 = [a, c];
        const Te2: Vec2 = [b, d];
        const A: Mat2 = [
          [a, b],
          [c, d],
        ];

        const w1: Mat2 = [
          [a, c],
          [b, d],
        ];
        const w2: Mat2 = [
          [b, a],
          [d, c],
        ];
        const w3: Mat2 = [
          [-a, -b],
          [-c, -d],
        ];
        const w4: Mat2 = [
          [d, b],
          [c, a],
        ];

        const rightLatex = mat2Latex(A);
        const e1Latex = vec2Latex(Te1);
        const e2Latex = vec2Latex(Te2);

        return oneOf(
          rng,
          t(
            `A linear transformation $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ satisfies $T\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = ${e1Latex}$ and $T\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = ${e2Latex}$. What is the standard matrix $A$ of $T$?`,
            `线性变换 $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ 满足 $T\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = ${e1Latex}$ 和 $T\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = ${e2Latex}$。$T$ 的标准矩阵 $A$ 是什么？`,
          ),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          t(
            `The columns of the standard matrix are precisely $T(\\mathbf{e}_1)$ and $T(\\mathbf{e}_2)$:\n\n$$A = [T(\\mathbf{e}_1) \\mid T(\\mathbf{e}_2)] = ${rightLatex}$$.`,
            `标准矩阵的各列正是标准基向量的像 $T(\\mathbf{e}_1)$ 与 $T(\\mathbf{e}_2)$：\n\n$$A = [T(\\mathbf{e}_1) \\mid T(\\mathbf{e}_2)] = ${rightLatex}$$.`,
          ),
        );
      },
    },
    {
      id: "finding-standard-matrix-from-formula",
      title: t("Finding standard matrix from algebraic formulas", "由代数表达式求标准矩阵"),
      explanation: t(
        "If a linear transformation is given by $T\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}$, its standard matrix is $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$.",
        "若线性变换的坐标公式为 $T\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}$，则其标准矩阵为 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$。",
      ),
      generate(rng) {
        const a = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const b = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const c = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const d = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);

        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const w1: Mat2 = [
          [a, c],
          [b, d],
        ];
        const w2: Mat2 = [
          [b, a],
          [d, c],
        ];
        const w3: Mat2 = [
          [a, -b],
          [-c, d],
        ];
        const w4: Mat2 = [
          [c, d],
          [a, b],
        ];

        const rightLatex = mat2Latex(A);

        return oneOf(
          rng,
          t(
            `Find the standard matrix of the linear transformation defined by $T\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${a}x + ${b}y \\\\ ${c}x + ${d}y \\end{pmatrix}$.`,
            `求线性变换 $T\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${a}x + ${b}y \\\\ ${c}x + ${d}y \\end{pmatrix}$ 的标准矩阵。`,
          ),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          t(
            `Evaluating $T$ at the unit basis vectors:\n$T\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} ${a} \\\\ ${c} \\end{pmatrix}$ and $T\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} ${b} \\\\ ${d} \\end{pmatrix}$.\nArranging these as columns yields $A = ${rightLatex}$.`,
            `计算单位基向量的像：\n$T\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} ${a} \\\\ ${c} \\end{pmatrix}$，$T\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} ${b} \\\\ ${d} \\end{pmatrix}$。\n将它们作为矩阵的列，可得标准矩阵 $A = ${rightLatex}$。`,
          ),
        );
      },
    },
  ],
};

/** linearTransformationsOfPointsAndLinesInThePlane covers transforming points and lines. */
export const linearTransformationsOfPointsAndLinesInThePlane: TopicDef = {
  id: "linear-transformations-of-points-and-lines-in-the-plane",
  title: t("Linear Transformations of Points and Lines in the Plane", "平面上线与点的线性变换"),
  summary: t(
    "Apply matrix transformations to points and find how lines in the plane are mapped.",
    "对点应用矩阵变换，并研究平面直线在线性变换下的像。",
  ),
  prerequisites: ["the-standard-matrix-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.11", "CCSS.HSN.VM.C.12"],
  knowledgePoints: [
    {
      id: "transforming-points-in-the-plane",
      title: t("Transforming points under a linear transformation", "线性变换作用下的点变换"),
      explanation: t(
        "A point $P(x, y)$ represented by column vector $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$ transforms to $P'(x', y') = A \\begin{pmatrix} x \\\\ y \\end{pmatrix}$.",
        "平面上的点 $P(x, y)$ 对应列向量 $\\begin{pmatrix} x \\\\ y \\end{pmatrix}$，在线性变换 $A$ 作用下的像为 $P'(x', y') = A \\begin{pmatrix} x \\\\ y \\end{pmatrix}$。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const c = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const d = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const x = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const y = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);

        const xp = a * x + b * y;
        const yp = c * x + d * y;

        const w1: Vec2 = [yp, xp];
        const w2: Vec2 = [-xp, yp];
        const w3: Vec2 = [xp, -yp];
        const w4: Vec2 = [a * x - b * y, c * x - d * y];

        const ALatex = mat2Latex([
          [a, b],
          [c, d],
        ]);

        return oneOf(
          rng,
          t(
            `Find the coordinates of the image of point $P(${x}, ${y})$ under the linear transformation with standard matrix $A = ${ALatex}$.`,
            `求点 $P(${x}, ${y})$ 在标准矩阵为 $A = ${ALatex}$ 的线性变换作用下的像点坐标。`,
          ),
          t(`$(${xp}, ${yp})$`, `$(${xp}, ${yp})$`),
          [
            t(`$(${w1[0]}, ${w1[1]})$`, `$(${w1[0]}, ${w1[1]})$`),
            t(`$(${w2[0]}, ${w2[1]})$`, `$(${w2[0]}, ${w2[1]})$`),
            t(`$(${w3[0]}, ${w3[1]})$`, `$(${w3[0]}, ${w3[1]})$`),
            t(`$(${w4[0]}, ${w4[1]})$`, `$(${w4[0]}, ${w4[1]})$`),
          ],
          t(
            `Multiply the matrix by the point vector:\n\n$$A\\begin{pmatrix} x \\\\ y \\end{pmatrix} = ${ALatex}\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix} = \\begin{pmatrix} (${a})(${x}) + (${b})(${y}) \\\\ (${c})(${x}) + (${d})(${y}) \\end{pmatrix} = \\begin{pmatrix} ${xp} \\\\ ${yp} \\end{pmatrix}$$.\n\nSo the image point is $(${xp}, ${yp})$.`,
            `将标准矩阵与点的坐标列向量相乘：\n\n$$A\\begin{pmatrix} x \\\\ y \\end{pmatrix} = ${ALatex}\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix} = \\begin{pmatrix} (${a})(${x}) + (${b})(${y}) \\\\ (${c})(${x}) + (${d})(${y}) \\end{pmatrix} = \\begin{pmatrix} ${xp} \\\\ ${yp} \\end{pmatrix}$$.\n\n故像点坐标为 $(${xp}, ${yp})$。`,
          ),
        );
      },
    },
    {
      id: "transforming-lines-through-origin",
      title: t("Images of lines under linear transformations", "直线的线性变换与像方程"),
      explanation: t(
        "A line through the origin with direction vector $\\mathbf{v} = \\begin{pmatrix} 1 \\\\ m \\end{pmatrix}$ transforms under matrix $A$ to a line through the origin directed along $A\\mathbf{v} = \\begin{pmatrix} u \\\\ v \\end{pmatrix}$. If $u \\ne 0$, its equation is $y = \\frac{v}{u}x$.",
        "过原点且方向向量为 $\\mathbf{v} = \\begin{pmatrix} 1 \\\\ m \\end{pmatrix}$ 的直线 $y = mx$，在矩阵 $A$ 作用下的像仍为过原点的直线，其方向向量为 $A\\mathbf{v} = \\begin{pmatrix} u \\\\ v \\end{pmatrix}$。若 $u \\ne 0$，其方程为 $y = \\frac{v}{u}x$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, 4]);
        const d = rng.pick([1, 2, 3, 4]);
        const b = rng.pick([0, 1, 2]);
        const c = rng.pick([0, 1, 2]);
        const m = rng.pick([1, 2, 3, -1, -2]);

        const u = a + b * m;
        const v = c + d * m;
        if (u === 0 || v === 0) return this.generate(rng);

        const slopeQ = Q.of(v, u);
        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const ALatex = mat2Latex(A);
        const rightEq = `y = ${slopeQ.toLatex()}x`;
        const w1 = `y = ${slopeQ.neg().toLatex()}x`;
        const w2 = `y = ${Q.of(u, v).toLatex()}x`;
        const w3 = `y = ${m}x`;
        const w4 = `y = ${slopeQ.add(Q.one).toLatex()}x`;

        return oneOf(
          rng,
          t(
            `Find the equation of the line that is the image of the line $y = ${m}x$ under the linear transformation with standard matrix $A = ${ALatex}$.`,
            `求直线 $y = ${m}x$ 在标准矩阵为 $A = ${ALatex}$ 的线性变换下的像方程。`,
          ),
          t(`$${rightEq}$`, `$${rightEq}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `A point on $y = ${m}x$ has direction vector $\\mathbf{v} = \\begin{pmatrix} 1 \\\\ ${m} \\end{pmatrix}$. Applying the matrix transformation:\n\n$$A\\mathbf{v} = ${ALatex}\\begin{pmatrix} 1 \\\\ ${m} \\end{pmatrix} = \\begin{pmatrix} ${u} \\\\ ${v} \\end{pmatrix}$$.\n\nSince the line passes through the origin $(0, 0)$, its slope is $\\frac{${v}}{${u}} = ${slopeQ.toLatex()}$, giving the equation $${rightEq}$.`,
            `直线 $y = ${m}x$ 的方向向量为 $\\mathbf{v} = \\begin{pmatrix} 1 \\\\ ${m} \\end{pmatrix}$。对方向向量作用矩阵变换：\n\n$$A\\mathbf{v} = ${ALatex}\\begin{pmatrix} 1 \\\\ ${m} \\end{pmatrix} = \\begin{pmatrix} ${u} \\\\ ${v} \\end{pmatrix}$$.\n\n由于像过原点 $(0, 0)$，斜率为 $\\frac{${v}}{${u}} = ${slopeQ.toLatex()}$，故像方程为 $${rightEq}$。`,
          ),
        );
      },
    },
  ],
};

/** linearTransformationsOfObjectsInThePlane covers transforming polygons and centroid preservation. */
export const linearTransformationsOfObjectsInThePlane: TopicDef = {
  id: "linear-transformations-of-objects-in-the-plane",
  title: t("Linear Transformations of Objects in the Plane", "平面几何图形的线性变换"),
  summary: t(
    "Transform geometric figures such as triangles and polygons by transforming their vertices.",
    "通过变换几何图形的顶点，研究三角形与多边形在平面线性变换下的像。",
  ),
  prerequisites: ["linear-transformations-of-points-and-lines-in-the-plane"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  knowledgePoints: [
    {
      id: "transforming-vertices-of-polygons",
      title: t("Transforming polygon vertices", "变换多边形的各个顶点"),
      explanation: t(
        "Because linear transformations map line segments to line segments, the image of a polygon is the polygon whose vertices are the transformed original vertices.",
        "由于线性变换将线段映射为线段，因此多边形在线性变换下的像，就是以变换后的原顶点为新顶点的多边形。",
      ),
      generate(rng) {
        const A: Mat2 = [
          [rng.pick([-2, -1, 1, 2, 3]), rng.pick([-2, -1, 0, 1, 2])],
          [rng.pick([-2, -1, 0, 1, 2]), rng.pick([-2, -1, 1, 2, 3])],
        ];
        const vA: Vec2 = [rng.pick([1, 2, 3]), rng.pick([0, 1, 2])];
        const vB: Vec2 = [rng.pick([3, 4, 5]), rng.pick([1, 2, 3])];
        const vC: Vec2 = [rng.pick([1, 2]), rng.pick([4, 5, 6])];

        const targetVertex = rng.pick(["A", "B", "C"]);
        const orig = targetVertex === "A" ? vA : targetVertex === "B" ? vB : vC;
        const xp = A[0][0] * orig[0] + A[0][1] * orig[1];
        const yp = A[1][0] * orig[0] + A[1][1] * orig[1];

        const w1: Vec2 = [yp, xp];
        const w2: Vec2 = [-xp, yp];
        const w3: Vec2 = [xp + 1, yp - 1];
        const w4: Vec2 = [orig[0] + 1, orig[1] + 1];

        const MLatex = mat2Latex(A);

        return oneOf(
          rng,
          t(
            `A triangle has vertices $A(${vA[0]}, ${vA[1]})$, $B(${vB[0]}, ${vB[1]})$, and $C(${vC[0]}, ${vC[1]})$. Under the linear transformation with standard matrix $M = ${MLatex}$, what are the coordinates of the image vertex $${targetVertex}'$?`,
            `三角形的三个顶点为 $A(${vA[0]}, ${vA[1]})$、$B(${vB[0]}, ${vB[1]})$ 和 $C(${vC[0]}, ${vC[1]})$。在标准矩阵为 $M = ${MLatex}$ 的线性变换作用下，像顶点 $${targetVertex}'$ 的坐标是多少？`,
          ),
          t(`$${targetVertex}'(${xp}, ${yp})$`, `$${targetVertex}'(${xp}, ${yp})$`),
          [
            t(`$${targetVertex}'(${w1[0]}, ${w1[1]})$`, `$${targetVertex}'(${w1[0]}, ${w1[1]})$`),
            t(`$${targetVertex}'(${w2[0]}, ${w2[1]})$`, `$${targetVertex}'(${w2[0]}, ${w2[1]})$`),
            t(`$${targetVertex}'(${w3[0]}, ${w3[1]})$`, `$${targetVertex}'(${w3[0]}, ${w3[1]})$`),
            t(`$${targetVertex}'(${w4[0]}, ${w4[1]})$`, `$${targetVertex}'(${w4[0]}, ${w4[1]})$`),
          ],
          t(
            `Multiply the transformation matrix $M$ by the column vector of vertex $${targetVertex}(${orig[0]}, ${orig[1]})$:\n\n$$M \\begin{pmatrix} ${orig[0]} \\\\ ${orig[1]} \\end{pmatrix} = ${MLatex}\\begin{pmatrix} ${orig[0]} \\\\ ${orig[1]} \\end{pmatrix} = \\begin{pmatrix} ${xp} \\\\ ${yp} \\end{pmatrix}$$.\n\nThus $${targetVertex}'$ has coordinates $(${xp}, ${yp})$.`,
            `将变换矩阵 $M$ 与顶点 $${targetVertex}(${orig[0]}, ${orig[1]})$ 的坐标列向量相乘：\n\n$$M \\begin{pmatrix} ${orig[0]} \\\\ ${orig[1]} \\end{pmatrix} = ${MLatex}\\begin{pmatrix} ${orig[0]} \\\\ ${orig[1]} \\end{pmatrix} = \\begin{pmatrix} ${xp} \\\\ ${yp} \\end{pmatrix}$$.\n\n故 $${targetVertex}'$ 的坐标为 $(${xp}, ${yp})$。`,
          ),
        );
      },
    },
    {
      id: "centroid-and-midpoints-of-transformed-shapes",
      title: t("Centroid preservation under linear transformations", "线性变换下重心的保真性"),
      explanation: t(
        "Linear transformations preserve barycentric combinations and centroids: the centroid of the transformed figure $T(S)$ is the image of the centroid of $S$, i.e., $G' = T(G)$.",
        "线性变换保持重心坐标与形心：变换后图形 $T(S)$ 的重心，就是原图形 $S$ 重心的像，即 $G' = T(G)$。",
      ),
      generate(rng) {
        const gx = rng.pick([-3, -2, -1, 1, 2, 3]);
        const gy = rng.pick([-3, -2, -1, 1, 2, 3]);
        const M: Mat2 = [
          [rng.pick([1, 2, -1, -2]), rng.pick([0, 1, -1])],
          [rng.pick([0, 1, -1]), rng.pick([1, 2, -1, -2])],
        ];

        const gpx = M[0][0] * gx + M[0][1] * gy;
        const gpy = M[1][0] * gx + M[1][1] * gy;

        const w1: Vec2 = [gpy, gpx];
        const w2: Vec2 = [-gpx, gpy];
        const w3: Vec2 = [gpx + 1, gpy - 1];
        const w4: Vec2 = [gx, gy];

        const MLatex = mat2Latex(M);

        return oneOf(
          rng,
          t(
            `A triangle has centroid $G(${gx}, ${gy})$. What is the centroid $G'$ of the image triangle under the linear transformation with matrix $M = ${MLatex}$?`,
            `某三角形的重心为 $G(${gx}, ${gy})$。在矩阵为 $M = ${MLatex}$ 的线性变换作用下，像三角形的重心 $G'$ 的坐标是多少？`,
          ),
          t(`$G'(${gpx}, ${gpy})$`, `$G'(${gpx}, ${gpy})$`),
          [
            t(`$G'(${w1[0]}, ${w1[1]})$`, `$G'(${w1[0]}, ${w1[1]})$`),
            t(`$G'(${w2[0]}, ${w2[1]})$`, `$G'(${w2[0]}, ${w2[1]})$`),
            t(`$G'(${w3[0]}, ${w3[1]})$`, `$G'(${w3[0]}, ${w3[1]})$`),
            t(`$G'(${w4[0]}, ${w4[1]})$`, `$G'(${w4[0]}, ${w4[1]})$`),
          ],
          t(
            `Because linear transformations preserve centroids, $G' = M G$:\n\n$$G' = ${MLatex}\\begin{pmatrix} ${gx} \\\\ ${gy} \\end{pmatrix} = \\begin{pmatrix} ${gpx} \\\\ ${gpy} \\end{pmatrix}$$.\n\nSo $G' = (${gpx}, ${gpy})$.`,
            `由于线性变换保持图形的重心性质，$G' = M G$：\n\n$$G' = ${MLatex}\\begin{pmatrix} ${gx} \\\\ ${gy} \\end{pmatrix} = \\begin{pmatrix} ${gpx} \\\\ ${gpy} \\end{pmatrix}$$.\n\n因此 $G' = (${gpx}, ${gpy})$。`,
          ),
        );
      },
    },
  ],
};

/** dilationsAndReflectionsAsLinearTransformations covers dilations and reflections in the plane. */
export const dilationsAndReflectionsAsLinearTransformations: TopicDef = {
  id: "dilations-and-reflections-as-linear-transformations",
  title: t("Dilations and Reflections as Linear Transformations", "伸缩与反射线性变换"),
  summary: t(
    "Represent uniform dilations and reflections across the coordinate axes and y = x as matrix transformations.",
    "用矩阵表示平面的均匀伸缩变换以及关于坐标轴与 y = x 的反射变换。",
  ),
  prerequisites: ["the-standard-matrix-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  knowledgePoints: [
    {
      id: "dilation-matrices-in-the-plane",
      title: t("Dilation matrices in the plane", "平面中的位似伸缩矩阵"),
      explanation: t(
        "A uniform dilation with scale factor $k$ centered at the origin maps $(x, y) \\mapsto (kx, ky)$. Its standard matrix is $D_k = \\begin{pmatrix} k & 0 \\\\ 0 & k \\end{pmatrix} = k I$.",
        "以原点为中心的缩放比例为 $k$ 的均匀位似伸缩变换将 $(x, y) \\mapsto (kx, ky)$。其标准矩阵为 $D_k = \\begin{pmatrix} k & 0 \\\\ 0 & k \\end{pmatrix} = k I$。",
      ),
      generate(rng) {
        const askPoint = rng.pick([true, false]);
        const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5, 6]);

        if (askPoint) {
          const x = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
          const y = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
          const xp = k * x;
          const yp = k * y;

          const w1: Vec2 = [yp, xp];
          const w2: Vec2 = [-xp, yp];
          const w3: Vec2 = [xp, -yp];
          const w4: Vec2 = [x + k, y + k];

          return oneOf(
            rng,
            t(
              `Find the coordinates of the image of point $P(${x}, ${y})$ under a uniform dilation centered at the origin with scale factor $k = ${k}$.`,
              `求点 $P(${x}, ${y})$ 在以原点为中心、缩放比例为 $k = ${k}$ 的位似伸缩变换下的像点坐标。`,
            ),
            t(`$(${xp}, ${yp})$`, `$(${xp}, ${yp})$`),
            [
              t(`$(${w1[0]}, ${w1[1]})$`, `$(${w1[0]}, ${w1[1]})$`),
              t(`$(${w2[0]}, ${w2[1]})$`, `$(${w2[0]}, ${w2[1]})$`),
              t(`$(${w3[0]}, ${w3[1]})$`, `$(${w3[0]}, ${w3[1]})$`),
              t(`$(${w4[0]}, ${w4[1]})$`, `$(${w4[0]}, ${w4[1]})$`),
            ],
            t(
              `The dilation scales both coordinates by $k = ${k}$:\n\n$$(${k} \\times ${x}, \\; ${k} \\times ${y}) = (${xp}, ${yp})$$.`,
              `位似变换将每个坐标均缩放 $k = ${k}$ 倍：\n\n$$(${k} \\times ${x}, \\; ${k} \\times ${y}) = (${xp}, ${yp})$$。`,
            ),
          );
        }

        const D: Mat2 = [
          [k, 0],
          [0, k],
        ];
        const w1: Mat2 = [
          [k, 0],
          [0, 1],
        ];
        const w2: Mat2 = [
          [1, 0],
          [0, k],
        ];
        const w3: Mat2 = [
          [0, k],
          [k, 0],
        ];
        const w4: Mat2 = [
          [k, k],
          [0, 0],
        ];

        return oneOf(
          rng,
          t(
            `What is the standard matrix of a uniform dilation centered at the origin with scale factor $k = ${k}$?`,
            `以原点为中心、缩放比例为 $k = ${k}$ 的均匀伸缩变换的标准矩阵是什么？`,
          ),
          t(`$${mat2Latex(D)}$`, `$${mat2Latex(D)}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          t(
            `A dilation scales both basis vectors $\\mathbf{e}_1$ and $\\mathbf{e}_2$ by $k$:\n$T\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} ${k} \\\\ 0 \\end{pmatrix}$ and $T\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ ${k} \\end{pmatrix}$.\nThus the matrix is $${mat2Latex(D)}$.`,
            `均匀伸缩变换将两个基向量同时缩放 $k$ 倍：\n$T\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} ${k} \\\\ 0 \\end{pmatrix}$，$T\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ ${k} \\end{pmatrix}$。\n因此矩阵为 $${mat2Latex(D)}$。`,
          ),
        );
      },
    },
    {
      id: "reflection-matrices-in-the-plane",
      title: t("Reflection matrices in the plane", "平面中的反射变换矩阵"),
      explanation: t(
        "Standard reflection matrices:\n- Across the $x$-axis: $\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$\n- Across the $y$-axis: $\\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$\n- Across the line $y = x$: $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$\n- Across the line $y = -x$: $\\begin{pmatrix} 0 & -1 \\\\ -1 & 0 \\end{pmatrix}$",
        "常见的平面反射变换矩阵：\n- 关于 $x$ 轴反射：$\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$\n- 关于 $y$ 轴反射：$\\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$\n- 关于直线 $y = x$ 反射：$\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$\n- 关于直线 $y = -x$ 反射：$\\begin{pmatrix} 0 & -1 \\\\ -1 & 0 \\end{pmatrix}$",
      ),
      generate(rng) {
        const types: { lineEn: string; lineZh: string; mat: Mat2 }[] = [
          {
            lineEn: "the $x$-axis",
            lineZh: "$x$ 轴",
            mat: [
              [1, 0],
              [0, -1],
            ],
          },
          {
            lineEn: "the $y$-axis",
            lineZh: "$y$ 轴",
            mat: [
              [-1, 0],
              [0, 1],
            ],
          },
          {
            lineEn: "the line $y = x$",
            lineZh: "直线 $y = x$",
            mat: [
              [0, 1],
              [1, 0],
            ],
          },
          {
            lineEn: "the line $y = -x$",
            lineZh: "直线 $y = -x$",
            mat: [
              [0, -1],
              [-1, 0],
            ],
          },
        ];
        const item = rng.pick(types);
        const x = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const y = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);

        const xp = item.mat[0][0] * x + item.mat[0][1] * y;
        const yp = item.mat[1][0] * x + item.mat[1][1] * y;

        const w1: Vec2 = [-xp, yp];
        const w2: Vec2 = [xp, -yp];
        const w3: Vec2 = [-xp, -yp];
        const w4: Vec2 = [yp, xp];

        return oneOf(
          rng,
          t(
            `Find the coordinates of the image of point $P(${x}, ${y})$ after reflection across ${item.lineEn}.`,
            `求点 $P(${x}, ${y})$ 关于${item.lineZh}反射后的像点坐标。`,
          ),
          t(`$(${xp}, ${yp})$`, `$(${xp}, ${yp})$`),
          [
            t(`$(${w1[0]}, ${w1[1]})$`, `$(${w1[0]}, ${w1[1]})$`),
            t(`$(${w2[0]}, ${w2[1]})$`, `$(${w2[0]}, ${w2[1]})$`),
            t(`$(${w3[0]}, ${w3[1]})$`, `$(${w3[0]}, ${w3[1]})$`),
            t(`$(${w4[0]}, ${w4[1]})$`, `$(${w4[0]}, ${w4[1]})$`),
          ],
          t(
            `The reflection matrix across ${item.lineEn} is $R = ${mat2Latex(item.mat)}$.\nMultiplying by $\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$ yields $(${xp}, ${yp})$.`,
            `关于${item.lineZh}反射的标准矩阵为 $R = ${mat2Latex(item.mat)}$。\n乘以坐标列向量 $\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$ 可得 $(${xp}, ${yp})$。`,
          ),
        );
      },
    },
  ],
};

/** shearAndStretchAsLinearTransformations covers shear and directional axis stretches. */
export const shearAndStretchAsLinearTransformations: TopicDef = {
  id: "shear-and-stretch-as-linear-transformations",
  title: t("Shear and Stretch as Linear Transformations", "切变与拉伸变换"),
  summary: t(
    "Analyze horizontal and vertical shear transformations and directional axis stretches.",
    "分析水平切变、垂直切变以及沿坐标轴的拉伸与压缩变换。",
  ),
  prerequisites: ["dilations-and-reflections-as-linear-transformations"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  knowledgePoints: [
    {
      id: "shear-transformations-in-the-plane",
      title: t("Horizontal and vertical shears", "水平与垂直切变变换"),
      explanation: t(
        "A horizontal shear with factor $k$ preserves $y$-coordinates and maps $(x, y) \\mapsto (x + ky, y)$, represented by $\\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$. A vertical shear with factor $k$ preserves $x$-coordinates and maps $(x, y) \\mapsto (x, kx + y)$, represented by $\\begin{pmatrix} 1 & 0 \\\\ k & 1 \\end{pmatrix}$.",
        "水平切变（切变因子为 $k$）保持 $y$ 坐标不变并将 $(x, y) \\mapsto (x + ky, y)$，矩阵为 $\\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$。垂直切变（切变因子为 $k$）保持 $x$ 坐标不变并将 $(x, y) \\mapsto (x, kx + y)$，矩阵为 $\\begin{pmatrix} 1 & 0 \\\\ k & 1 \\end{pmatrix}$。",
      ),
      generate(rng) {
        const isHorizontal = rng.pick([true, false]);
        const k = rng.pick([-4, -3, -2, 2, 3, 4]);
        const x = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const y = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);

        const xp = isHorizontal ? x + k * y : x;
        const yp = isHorizontal ? y : k * x + y;
        const dirEn = isHorizontal ? "horizontal" : "vertical";
        const dirZh = isHorizontal ? "水平" : "垂直";
        const mat: Mat2 = isHorizontal
          ? [
              [1, k],
              [0, 1],
            ]
          : [
              [1, 0],
              [k, 1],
            ];

        const w1: Vec2 = [yp, xp];
        const w2: Vec2 = isHorizontal ? [x - k * y, y] : [x, -k * x + y];
        const w3: Vec2 = isHorizontal ? [x, k * x + y] : [x + k * y, y];
        const w4: Vec2 = [x + k, y + k];

        return oneOf(
          rng,
          t(
            `Find the coordinates of point $P(${x}, ${y})$ under a ${dirEn} shear with shear factor $k = ${k}$.`,
            `求点 $P(${x}, ${y})$ 在切变因子为 $k = ${k}$ 的${dirZh}切变变换下的像点坐标。`,
          ),
          t(`$(${xp}, ${yp})$`, `$(${xp}, ${yp})$`),
          [
            t(`$(${w1[0]}, ${w1[1]})$`, `$(${w1[0]}, ${w1[1]})$`),
            t(`$(${w2[0]}, ${w2[1]})$`, `$(${w2[0]}, ${w2[1]})$`),
            t(`$(${w3[0]}, ${w3[1]})$`, `$(${w3[0]}, ${w3[1]})$`),
            t(`$(${w4[0]}, ${w4[1]})$`, `$(${w4[0]}, ${w4[1]})$`),
          ],
          t(
            `The standard matrix for a ${dirEn} shear of factor $k = ${k}$ is $S = ${mat2Latex(mat)}$.\nMultiplying by $\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$ gives $\\begin{pmatrix} ${xp} \\\\ ${yp} \\end{pmatrix}$.`,
            `切变因子为 $k = ${k}$ 的${dirZh}切变标准矩阵为 $S = ${mat2Latex(mat)}$。\n乘以坐标列向量 $\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$ 得到 $\\begin{pmatrix} ${xp} \\\\ ${yp} \\end{pmatrix}$。`,
          ),
        );
      },
    },
    {
      id: "axis-stretches-and-compressions",
      title: t("Axis stretches and compressions", "沿坐标轴的拉伸与压缩"),
      explanation: t(
        "A transformation that scales along the $x$-axis by factor $s_x$ and along the $y$-axis by factor $s_y$ is represented by the diagonal matrix $\\begin{pmatrix} s_x & 0 \\\\ 0 & s_y \\end{pmatrix}$.",
        "沿 $x$ 轴缩放 $s_x$ 倍且沿 $y$ 轴缩放 $s_y$ 倍的平面变换，其标准矩阵为对角矩阵 $\\begin{pmatrix} s_x & 0 \\\\ 0 & s_y \\end{pmatrix}$。",
      ),
      generate(rng) {
        const sx = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const sy = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);

        const mat: Mat2 = [
          [sx, 0],
          [0, sy],
        ];
        const w1: Mat2 = [
          [sy, 0],
          [0, sx],
        ];
        const w2: Mat2 = [
          [sx, sy],
          [0, 0],
        ];
        const w3: Mat2 = [
          [0, sx],
          [sy, 0],
        ];
        const w4: Mat2 = [
          [1, sx],
          [0, sy],
        ];

        return oneOf(
          rng,
          t(
            `What is the standard matrix representing a stretch by factor $s_x = ${sx}$ along the $x$-axis and by factor $s_y = ${sy}$ along the $y$-axis?`,
            `沿 $x$ 轴拉伸 $s_x = ${sx}$ 倍，且沿 $y$ 轴拉伸 $s_y = ${sy}$ 倍的线性变换的标准矩阵是什么？`,
          ),
          t(`$${mat2Latex(mat)}$`, `$${mat2Latex(mat)}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          t(
            `The unit vector $\\mathbf{e}_1 = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ is mapped to $\\begin{pmatrix} ${sx} \\\\ 0 \\end{pmatrix}$ and $\\mathbf{e}_2 = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$ is mapped to $\\begin{pmatrix} 0 \\\\ ${sy} \\end{pmatrix}$.\nHence the standard matrix is $${mat2Latex(mat)}$.`,
            `单位基向量 $\\mathbf{e}_1 = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ 映射为 $\\begin{pmatrix} ${sx} \\\\ 0 \\end{pmatrix}$，$\\mathbf{e}_2 = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$ 映射为 $\\begin{pmatrix} 0 \\\\ ${sy} \\end{pmatrix}$。\n因此标准矩阵为 $${mat2Latex(mat)}$。`,
          ),
        );
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE 6.25: LINEAR TRANSFORMATIONS (PART 2: TOPICS 12 TO 17)
// ════════════════════════════════════════════════════════════════════════════

/** rightAngleRotationsAsLinearTransformations covers rotations by 90, 180, and 270 degrees. */
export const rightAngleRotationsAsLinearTransformations: TopicDef = {
  id: "right-angle-rotations-as-linear-transformations",
  title: t("Right-Angle Rotations as Linear Transformations", "直角旋转变换"),
  summary: t(
    "Represent rotations by multiples of 90 degrees about the origin using 2x2 matrices.",
    "用二阶矩阵表示绕原点旋转 90°、180° 与 270° 的直角旋转变换。",
  ),
  prerequisites: ["the-standard-matrix-of-a-linear-transformation"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  knowledgePoints: [
    {
      id: "matrices-for-right-angle-rotations",
      title: t("Matrices for right-angle rotations", "直角旋转的标准矩阵"),
      explanation: t(
        "Standard counterclockwise rotation matrices about the origin:\n- By $90^\\circ$: $R_{90^\\circ} = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$\n- By $180^\\circ$: $R_{180^\\circ} = \\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix} = -I$\n- By $270^\\circ$: $R_{270^\\circ} = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$",
        "绕原点逆时针直角旋转的标准矩阵：\n- 逆时针旋转 $90^\\circ$：$R_{90^\\circ} = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$\n- 逆时针旋转 $180^\\circ$：$R_{180^\\circ} = \\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix} = -I$\n- 逆时针旋转 $270^\\circ$：$R_{270^\\circ} = \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$",
      ),
      generate(rng) {
        const pool: { angle: number; rad: string; mat: Mat2 }[] = [
          {
            angle: 90,
            rad: "\\frac{\\pi}{2}",
            mat: [
              [0, -1],
              [1, 0],
            ],
          },
          {
            angle: 180,
            rad: "\\pi",
            mat: [
              [-1, 0],
              [0, -1],
            ],
          },
          {
            angle: 270,
            rad: "\\frac{3\\pi}{2}",
            mat: [
              [0, 1],
              [-1, 0],
            ],
          },
          {
            angle: -90,
            rad: "-\\frac{\\pi}{2}",
            mat: [
              [0, 1],
              [-1, 0],
            ],
          },
          {
            angle: -180,
            rad: "-\\pi",
            mat: [
              [-1, 0],
              [0, -1],
            ],
          },
          {
            angle: -270,
            rad: "-\\frac{3\\pi}{2}",
            mat: [
              [0, -1],
              [1, 0],
            ],
          },
          {
            angle: 360,
            rad: "2\\pi",
            mat: [
              [1, 0],
              [0, 1],
            ],
          },
          {
            angle: 450,
            rad: "\\frac{5\\pi}{2}",
            mat: [
              [0, -1],
              [1, 0],
            ],
          },
          {
            angle: 540,
            rad: "3\\pi",
            mat: [
              [-1, 0],
              [0, -1],
            ],
          },
          {
            angle: 630,
            rad: "\\frac{7\\pi}{2}",
            mat: [
              [0, 1],
              [-1, 0],
            ],
          },
          {
            angle: 720,
            rad: "4\\pi",
            mat: [
              [1, 0],
              [0, 1],
            ],
          },
          {
            angle: -360,
            rad: "-2\\pi",
            mat: [
              [1, 0],
              [0, 1],
            ],
          },
          {
            angle: -450,
            rad: "-\\frac{5\\pi}{2}",
            mat: [
              [0, 1],
              [-1, 0],
            ],
          },
          {
            angle: -540,
            rad: "-3\\pi",
            mat: [
              [-1, 0],
              [0, -1],
            ],
          },
        ];
        const item = rng.pick(pool);
        const useRad = rng.pick([true, false]);
        const angleStr = useRad ? `$${item.rad}$ radians` : `$${item.angle}^\\circ$`;
        const angleStrZh = useRad ? `$${item.rad}$ 弧度` : `$${item.angle}^\\circ$`;
        const phrasing = rng.pick(["standard", "linear_map"]);

        const w1: Mat2 = [
          [0, 1],
          [1, 0],
        ];
        const w2: Mat2 = [
          [item.mat[1][1], item.mat[1][0]],
          [item.mat[0][1], item.mat[0][0]],
        ];
        const w3: Mat2 = [
          [1, 0],
          [0, -1],
        ];
        const w4: Mat2 = [
          [-item.mat[0][0], -item.mat[0][1]],
          [-item.mat[1][0], -item.mat[1][1]],
        ];

        const rightLatex = mat2Latex(item.mat);

        const promptEn =
          phrasing === "standard"
            ? `Which matrix represents a rotation by ${angleStr} about the origin?`
            : `Find the standard matrix of the linear transformation representing a rotation by ${angleStr} centered at the origin.`;
        const promptZh =
          phrasing === "standard"
            ? `下列哪个矩阵表示绕原点旋转 ${angleStrZh} 的线性变换？`
            : `求以原点为中心旋转 ${angleStrZh} 的线性变换的标准矩阵。`;

        return oneOf(
          rng,
          t(promptEn, promptZh),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          t(
            `For a rotation by angle $\\theta$, the matrix is $\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$. For $\\theta = ${item.angle}^\\circ$, evaluating sine and cosine gives $${rightLatex}$.`,
            `旋转角为 $\\theta$ 的矩阵为 $\\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$。代入 $\\theta = ${item.angle}^\\circ$，计算正弦与余弦值可得 $${rightLatex}$。`,
          ),
        );
      },
    },
    {
      id: "applying-right-angle-rotations-to-vectors",
      title: t("Rotating points and vectors by right angles", "直角旋转作用于向量与点"),
      explanation: t(
        "Applying right-angle counterclockwise rotations to point $(x, y)$:\n- $90^\\circ$: $(x, y) \\mapsto (-y, x)$\n- $180^\\circ$: $(x, y) \\mapsto (-x, -y)$\n- $270^\\circ$: $(x, y) \\mapsto (y, -x)$",
        "对点 $(x, y)$ 进行绕原点的逆时针直角旋转：\n- 旋转 $90^\\circ$：$(x, y) \\mapsto (-y, x)$\n- 旋转 $180^\\circ$：$(x, y) \\mapsto (-x, -y)$\n- 旋转 $270^\\circ$：$(x, y) \\mapsto (y, -x)$",
      ),
      generate(rng) {
        const x = rng.pick([-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]);
        const y = rng.pick([-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]);
        const angles = [90, 180, 270];
        const angle = rng.pick(angles);

        let xp = 0;
        let yp = 0;
        if (angle === 90) {
          xp = -y;
          yp = x;
        } else if (angle === 180) {
          xp = -x;
          yp = -y;
        } else {
          xp = y;
          yp = -x;
        }

        const w1: Vec2 = [yp, xp];
        const w2: Vec2 = [-xp, yp];
        const w3: Vec2 = [xp, -yp];
        const w4: Vec2 = [-xp, -yp];

        return oneOf(
          rng,
          t(
            `Find the coordinates of the image of point $P(${x}, ${y})$ after a counterclockwise rotation of $${angle}^\\circ$ about the origin.`,
            `求点 $P(${x}, ${y})$ 绕原点逆时针旋转 $${angle}^\\circ$ 后的像点坐标。`,
          ),
          t(`$(${xp}, ${yp})$`, `$(${xp}, ${yp})$`),
          [
            t(`$(${w1[0]}, ${w1[1]})$`, `$(${w1[0]}, ${w1[1]})$`),
            t(`$(${w2[0]}, ${w2[1]})$`, `$(${w2[0]}, ${w2[1]})$`),
            t(`$(${w3[0]}, ${w3[1]})$`, `$(${w3[0]}, ${w3[1]})$`),
            t(`$(${w4[0]}, ${w4[1]})$`, `$(${w4[0]}, ${w4[1]})$`),
          ],
          t(
            `Under a $${angle}^\\circ$ counterclockwise rotation, $(x, y) \\mapsto (${angle === 90 ? "-y, x" : angle === 180 ? "-x, -y" : "y, -x"})$.\nSubstituting $x = ${x}, y = ${y}$ yields $(${xp}, ${yp})$.`,
            `在逆时针旋转 $${angle}^\\circ$ 变换下，$(x, y) \\mapsto (${angle === 90 ? "-y, x" : angle === 180 ? "-x, -y" : "y, -x"})$。\n代入 $x = ${x}, y = ${y}$，得到像点坐标 $(${xp}, ${yp})$。`,
          ),
        );
      },
    },
  ],
};

/** rotationsAsLinearTransformations covers general rotation matrices and arbitrary angles. */
export const rotationsAsLinearTransformations: TopicDef = {
  id: "rotations-as-linear-transformations",
  title: t("Rotations as Linear Transformations", "任意角度的平面旋转矩阵"),
  summary: t(
    "Formulate the general rotation matrix R_theta and apply it to rotate points and vectors.",
    "推导任意角度的平面旋转矩阵 R_theta，并将其应用于旋转点和向量。",
  ),
  prerequisites: ["right-angle-rotations-as-linear-transformations"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  knowledgePoints: [
    {
      id: "general-rotation-matrix-formula",
      title: t("General rotation matrix formula", "平面旋转矩阵的一般公式"),
      explanation: t(
        "A counterclockwise rotation by angle $\\theta$ about the origin is represented by the matrix $R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$.",
        "绕原点逆时针旋转角度 $\\theta$ 的平面旋转矩阵为 $R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$。",
      ),
      generate(rng) {
        const pool: { deg: number; rad: string; cosStr: string; sinStr: string }[] = [
          { deg: 30, rad: "\\frac{\\pi}{6}", cosStr: "\\frac{\\sqrt{3}}{2}", sinStr: "\\frac{1}{2}" },
          { deg: 45, rad: "\\frac{\\pi}{4}", cosStr: "\\frac{\\sqrt{2}}{2}", sinStr: "\\frac{\\sqrt{2}}{2}" },
          { deg: 60, rad: "\\frac{\\pi}{3}", cosStr: "\\frac{1}{2}", sinStr: "\\frac{\\sqrt{3}}{2}" },
          { deg: 120, rad: "\\frac{2\\pi}{3}", cosStr: "-\\frac{1}{2}", sinStr: "\\frac{\\sqrt{3}}{2}" },
          { deg: 135, rad: "\\frac{3\\pi}{4}", cosStr: "-\\frac{\\sqrt{2}}{2}", sinStr: "\\frac{\\sqrt{2}}{2}" },
          { deg: 150, rad: "\\frac{5\\pi}{6}", cosStr: "-\\frac{\\sqrt{3}}{2}", sinStr: "\\frac{1}{2}" },
          { deg: 210, rad: "\\frac{7\\pi}{6}", cosStr: "-\\frac{\\sqrt{3}}{2}", sinStr: "-\\frac{1}{2}" },
          { deg: 225, rad: "\\frac{5\\pi}{4}", cosStr: "-\\frac{\\sqrt{2}}{2}", sinStr: "-\\frac{\\sqrt{2}}{2}" },
          { deg: 240, rad: "\\frac{4\\pi}{3}", cosStr: "-\\frac{1}{2}", sinStr: "-\\frac{\\sqrt{3}}{2}" },
          { deg: 300, rad: "\\frac{5\\pi}{3}", cosStr: "\\frac{1}{2}", sinStr: "-\\frac{\\sqrt{3}}{2}" },
          { deg: 315, rad: "\\frac{7\\pi}{4}", cosStr: "\\frac{\\sqrt{2}}{2}", sinStr: "-\\frac{\\sqrt{2}}{2}" },
          { deg: 330, rad: "\\frac{11\\pi}{6}", cosStr: "\\frac{\\sqrt{3}}{2}", sinStr: "-\\frac{1}{2}" },
          { deg: -30, rad: "-\\frac{\\pi}{6}", cosStr: "\\frac{\\sqrt{3}}{2}", sinStr: "-\\frac{1}{2}" },
          { deg: -45, rad: "-\\frac{\\pi}{4}", cosStr: "\\frac{\\sqrt{2}}{2}", sinStr: "-\\frac{\\sqrt{2}}{2}" },
          { deg: -60, rad: "-\\frac{\\pi}{3}", cosStr: "\\frac{1}{2}", sinStr: "-\\frac{\\sqrt{3}}{2}" },
          { deg: -120, rad: "-\\frac{2\\pi}{3}", cosStr: "-\\frac{1}{2}", sinStr: "-\\frac{\\sqrt{3}}{2}" },
          { deg: -135, rad: "-\\frac{3\\pi}{4}", cosStr: "-\\frac{\\sqrt{2}}{2}", sinStr: "-\\frac{\\sqrt{2}}{2}" },
          { deg: -150, rad: "-\\frac{5\\pi}{6}", cosStr: "-\\frac{\\sqrt{3}}{2}", sinStr: "-\\frac{1}{2}" },
        ];
        const item = rng.pick(pool);
        const useRad = rng.pick([true, false]);
        const angleStr = useRad ? `$${item.rad}$ radians` : `$${item.deg}^\\circ$`;
        const angleStrZh = useRad ? `$${item.rad}$ 弧度` : `$${item.deg}^\\circ$`;

        const cosVal = item.cosStr;
        const sinVal = item.sinStr;
        const negSinVal = sinVal.startsWith("-") ? sinVal.slice(1) : `-${sinVal}`;

        const rightLatex = `\\begin{pmatrix} ${cosVal} & ${negSinVal} \\\\ ${sinVal} & ${cosVal} \\end{pmatrix}`;
        const w1 = `\\begin{pmatrix} ${cosVal} & ${sinVal} \\\\ ${negSinVal} & ${cosVal} \\end{pmatrix}`;
        const w2 = `\\begin{pmatrix} ${sinVal} & ${cosVal} \\\\ ${cosVal} & ${sinVal} \\end{pmatrix}`;
        const w3 = `\\begin{pmatrix} ${cosVal} & ${negSinVal} \\\\ ${negSinVal} & ${cosVal} \\end{pmatrix}`;
        const w4 = `\\begin{pmatrix} ${sinVal} & -${cosVal} \\\\ ${cosVal} & ${sinVal} \\end{pmatrix}`;

        return oneOf(
          rng,
          t(
            `What is the exact standard matrix for a counterclockwise rotation by ${angleStr} about the origin?`,
            `求绕原点逆时针旋转 ${angleStrZh} 的精确标准矩阵。`,
          ),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `Using $R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$ with $\\cos(${item.deg}^\\circ) = ${cosVal}$ and $\\sin(${item.deg}^\\circ) = ${sinVal}$, we obtain $${rightLatex}$.`,
            `代入旋转公式 $R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$，由 $\\cos(${item.deg}^\\circ) = ${cosVal}$ 及 $\\sin(${item.deg}^\\circ) = ${sinVal}$，得到 $${rightLatex}$。`,
          ),
        );
      },
    },
    {
      id: "rotating-points-and-vectors-by-arbitrary-angles",
      title: t("Rotating points and vectors by special angles", "特殊角度下的点与向量旋转"),
      explanation: t(
        "To rotate a point $P(x, y)$ by $\\theta$, compute $R_\\theta \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x\\cos\\theta - y\\sin\\theta \\\\ x\\sin\\theta + y\\cos\\theta \\end{pmatrix}$.",
        "旋转点 $P(x, y)$ 角度 $\\theta$ 时，计算矩阵乘法 $R_\\theta \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x\\cos\\theta - y\\sin\\theta \\\\ x\\sin\\theta + y\\cos\\theta \\end{pmatrix}$。",
      ),
      generate(rng) {
        const pool: { deg: number; pt: [number, number]; imgLatex: string; w1: string; w2: string; w3: string; w4: string }[] = [
          {
            deg: 60,
            pt: [4, 0],
            imgLatex: "(2, \\; 2\\sqrt{3})",
            w1: "(2\\sqrt{3}, \\; 2)",
            w2: "(-2, \\; 2\\sqrt{3})",
            w3: "(2, \\; -2\\sqrt{3})",
            w4: "(4, \\; 4\\sqrt{3})",
          },
          {
            deg: 30,
            pt: [6, 0],
            imgLatex: "(3\\sqrt{3}, \\; 3)",
            w1: "(3, \\; 3\\sqrt{3})",
            w2: "(-3\\sqrt{3}, \\; 3)",
            w3: "(3\\sqrt{3}, \\; -3)",
            w4: "(6\\sqrt{3}, \\; 3)",
          },
          {
            deg: 45,
            pt: [2, 0],
            imgLatex: "(\\sqrt{2}, \\; \\sqrt{2})",
            w1: "(-\\sqrt{2}, \\; \\sqrt{2})",
            w2: "(\\sqrt{2}, \\; -\\sqrt{2})",
            w3: "(2\\sqrt{2}, \\; 2\\sqrt{2})",
            w4: "(1, \\; 1)",
          },
          {
            deg: 120,
            pt: [4, 0],
            imgLatex: "(-2, \\; 2\\sqrt{3})",
            w1: "(2, \\; 2\\sqrt{3})",
            w2: "(-2\\sqrt{3}, \\; 2)",
            w3: "(-2, \\; -2\\sqrt{3})",
            w4: "(-4, \\; 2\\sqrt{3})",
          },
          {
            deg: 135,
            pt: [2, 0],
            imgLatex: "(-\\sqrt{2}, \\; \\sqrt{2})",
            w1: "(\\sqrt{2}, \\; \\sqrt{2})",
            w2: "(\\sqrt{2}, \\; -\\sqrt{2})",
            w3: "(-2\\sqrt{2}, \\; \\sqrt{2})",
            w4: "(-1, \\; 1)",
          },
          {
            deg: 30,
            pt: [0, 4],
            imgLatex: "(-2, \\; 2\\sqrt{3})",
            w1: "(2\\sqrt{3}, \\; 2)",
            w2: "(2, \\; 2\\sqrt{3})",
            w3: "(-2\\sqrt{3}, \\; 2)",
            w4: "(-2, \\; -2\\sqrt{3})",
          },
          {
            deg: 60,
            pt: [0, 6],
            imgLatex: "(-3\\sqrt{3}, \\; 3)",
            w1: "(3, \\; 3\\sqrt{3})",
            w2: "(-3, \\; 3\\sqrt{3})",
            w3: "(3\\sqrt{3}, \\; 3)",
            w4: "(-3\\sqrt{3}, \\; -3)",
          },
          {
            deg: 45,
            pt: [8, 0],
            imgLatex: "(4\\sqrt{2}, \\; 4\\sqrt{2})",
            w1: "(-4\\sqrt{2}, \\; 4\\sqrt{2})",
            w2: "(4\\sqrt{2}, \\; -4\\sqrt{2})",
            w3: "(8\\sqrt{2}, \\; 8\\sqrt{2})",
            w4: "(4, \\; 4)",
          },
          {
            deg: 150,
            pt: [4, 0],
            imgLatex: "(-2\\sqrt{3}, \\; 2)",
            w1: "(2\\sqrt{3}, \\; 2)",
            w2: "(-2, \\; 2\\sqrt{3})",
            w3: "(-2\\sqrt{3}, \\; -2)",
            w4: "(-4\\sqrt{3}, \\; 2)",
          },
          {
            deg: 225,
            pt: [2, 0],
            imgLatex: "(-\\sqrt{2}, \\; -\\sqrt{2})",
            w1: "(\\sqrt{2}, \\; -\\sqrt{2})",
            w2: "(-\\sqrt{2}, \\; \\sqrt{2})",
            w3: "(\\sqrt{2}, \\; \\sqrt{2})",
            w4: "(-2, \\; -2)",
          },
          {
            deg: 240,
            pt: [6, 0],
            imgLatex: "(-3, \\; -3\\sqrt{3})",
            w1: "(3, \\; -3\\sqrt{3})",
            w2: "(-3\\sqrt{3}, \\; -3)",
            w3: "(-3, \\; 3\\sqrt{3})",
            w4: "(-6, \\; -3\\sqrt{3})",
          },
          {
            deg: 300,
            pt: [4, 0],
            imgLatex: "(2, \\; -2\\sqrt{3})",
            w1: "(-2, \\; 2\\sqrt{3})",
            w2: "(2\\sqrt{3}, \\; -2)",
            w3: "(-2, \\; -2\\sqrt{3})",
            w4: "(2, \\; 2\\sqrt{3})",
          },
          {
            deg: 60,
            pt: [2, 0],
            imgLatex: "(1, \\; \\sqrt{3})",
            w1: "(\\sqrt{3}, \\; 1)",
            w2: "(-1, \\; \\sqrt{3})",
            w3: "(1, \\; -\\sqrt{3})",
            w4: "(2, \\; 2\\sqrt{3})",
          },
          {
            deg: 30,
            pt: [4, 0],
            imgLatex: "(2\\sqrt{3}, \\; 2)",
            w1: "(2, \\; 2\\sqrt{3})",
            w2: "(-2\\sqrt{3}, \\; 2)",
            w3: "(2\\sqrt{3}, \\; -2)",
            w4: "(4\\sqrt{3}, \\; 2)",
          },
          {
            deg: 45,
            pt: [4, 0],
            imgLatex: "(2\\sqrt{2}, \\; 2\\sqrt{2})",
            w1: "(-2\\sqrt{2}, \\; 2\\sqrt{2})",
            w2: "(2\\sqrt{2}, \\; -2\\sqrt{2})",
            w3: "(4\\sqrt{2}, \\; 4\\sqrt{2})",
            w4: "(2, \\; 2)",
          },
          {
            deg: 120,
            pt: [2, 0],
            imgLatex: "(-1, \\; \\sqrt{3})",
            w1: "(1, \\; \\sqrt{3})",
            w2: "(\\sqrt{3}, \\; -1)",
            w3: "(-1, \\; -\\sqrt{3})",
            w4: "(-2, \\; \\sqrt{3})",
          },
          {
            deg: 135,
            pt: [4, 0],
            imgLatex: "(-2\\sqrt{2}, \\; 2\\sqrt{2})",
            w1: "(2\\sqrt{2}, \\; 2\\sqrt{2})",
            w2: "(2\\sqrt{2}, \\; -2\\sqrt{2})",
            w3: "(-4\\sqrt{2}, \\; 2\\sqrt{2})",
            w4: "(-2, \\; 2)",
          },
          {
            deg: 150,
            pt: [2, 0],
            imgLatex: "(-\\sqrt{3}, \\; 1)",
            w1: "(\\sqrt{3}, \\; 1)",
            w2: "(-1, \\; \\sqrt{3})",
            w3: "(-\\sqrt{3}, \\; -1)",
            w4: "(-2\\sqrt{3}, \\; 1)",
          },
          {
            deg: 30,
            pt: [0, 6],
            imgLatex: "(-3, \\; 3\\sqrt{3})",
            w1: "(3\\sqrt{3}, \\; 3)",
            w2: "(3, \\; 3\\sqrt{3})",
            w3: "(-3\\sqrt{3}, \\; 3)",
            w4: "(-3, \\; -3\\sqrt{3})",
          },
          {
            deg: 45,
            pt: [6, 0],
            imgLatex: "(3\\sqrt{2}, \\; 3\\sqrt{2})",
            w1: "(-3\\sqrt{2}, \\; 3\\sqrt{2})",
            w2: "(3\\sqrt{2}, \\; -3\\sqrt{2})",
            w3: "(6\\sqrt{2}, \\; 6\\sqrt{2})",
            w4: "(3, \\; 3)",
          },
          {
            deg: 60,
            pt: [6, 0],
            imgLatex: "(3, \\; 3\\sqrt{3})",
            w1: "(3\\sqrt{3}, \\; 3)",
            w2: "(-3, \\; 3\\sqrt{3})",
            w3: "(3, \\; -3\\sqrt{3})",
            w4: "(6, \\; 6\\sqrt{3})",
          },
          {
            deg: 30,
            pt: [8, 0],
            imgLatex: "(4\\sqrt{3}, \\; 4)",
            w1: "(4, \\; 4\\sqrt{3})",
            w2: "(-4\\sqrt{3}, \\; 4)",
            w3: "(4\\sqrt{3}, \\; -4)",
            w4: "(8\\sqrt{3}, \\; 4)",
          },
          {
            deg: 120,
            pt: [6, 0],
            imgLatex: "(-3, \\; 3\\sqrt{3})",
            w1: "(3, \\; 3\\sqrt{3})",
            w2: "(-3\\sqrt{3}, \\; 3)",
            w3: "(-3, \\; -3\\sqrt{3})",
            w4: "(-6, \\; 3\\sqrt{3})",
          },
          {
            deg: 150,
            pt: [6, 0],
            imgLatex: "(-3\\sqrt{3}, \\; 3)",
            w1: "(3\\sqrt{3}, \\; 3)",
            w2: "(-3, \\; 3\\sqrt{3})",
            w3: "(-3\\sqrt{3}, \\; -3)",
            w4: "(-6\\sqrt{3}, \\; 3)",
          },
          {
            deg: 45,
            pt: [10, 0],
            imgLatex: "(5\\sqrt{2}, \\; 5\\sqrt{2})",
            w1: "(-5\\sqrt{2}, \\; 5\\sqrt{2})",
            w2: "(5\\sqrt{2}, \\; -5\\sqrt{2})",
            w3: "(10\\sqrt{2}, \\; 10\\sqrt{2})",
            w4: "(5, \\; 5)",
          },
          {
            deg: 60,
            pt: [8, 0],
            imgLatex: "(4, \\; 4\\sqrt{3})",
            w1: "(4\\sqrt{3}, \\; 4)",
            w2: "(-4, \\; 4\\sqrt{3})",
            w3: "(4, \\; -4\\sqrt{3})",
            w4: "(8, \\; 8\\sqrt{3})",
          },
        ];
        const item = rng.pick(pool);
        const { deg, pt, imgLatex, w1, w2, w3, w4 } = item;

        const phrasing = rng.pick([1, 2]);
        const qEn =
          phrasing === 1
            ? `Find the coordinates of the image of point $P(${pt[0]}, ${pt[1]})$ after a counterclockwise rotation of $${deg}^\\circ$ about the origin.`
            : `Under a counterclockwise rotation by $${deg}^\\circ$ about the origin, what are the coordinates of the image of point $P(${pt[0]}, ${pt[1]})$?`;
        const qZh =
          phrasing === 1
            ? `求点 $P(${pt[0]}, ${pt[1]})$ 绕原点逆时针旋转 $${deg}^\\circ$ 后的像点坐标。`
            : `在绕原点逆时针旋转 $${deg}^\\circ$ 的变换下，点 $P(${pt[0]}, ${pt[1]})$ 的像点坐标是多少？`;
        return oneOf(
          rng,
          t(qEn, qZh),
          t(`$${imgLatex}$`, `$${imgLatex}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `Multiply the rotation matrix $R_{${deg}^\\circ}$ by the column vector $\\begin{pmatrix} ${pt[0]} \\\\ ${pt[1]} \\end{pmatrix}$ to get $${imgLatex}$.`,
            `将旋转矩阵 $R_{${deg}^\\circ}$ 与坐标列向量 $\\begin{pmatrix} ${pt[0]} \\\\ ${pt[1]} \\end{pmatrix}$ 相乘，计算得到像点坐标 $${imgLatex}$。`,
          ),
        );
      },
    },
  ],
};

/** combiningLinearTransformationsUsing2x2Matrices covers composing transformations and matrix order. */
export const combiningLinearTransformationsUsing2x2Matrices: TopicDef = {
  id: "combining-linear-transformations-using-2x2-matrices",
  title: t("Combining Linear Transformations Using 2x2 Matrices", "利用矩阵乘法复合线性变换"),
  summary: t(
    "Compose linear transformations in the plane and represent them by matrix products in the correct order.",
    "复合平面线性变换，并按正确顺序用矩阵乘积表示合成变换。",
  ),
  prerequisites: ["rotations-as-linear-transformations", "multiplying-square-matrices"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.8", "CCSS.HSN.VM.C.12"],
  knowledgePoints: [
    {
      id: "matrix-product-order-in-composition",
      title: t("Order of matrix multiplication in composition", "复合变换中的矩阵乘法顺序"),
      explanation: t(
        "When transformation $T_1$ (with matrix $A_1$) is applied first, followed by transformation $T_2$ (with matrix $A_2$), the composite transformation $T = T_2 \\circ T_1$ has matrix product $M = A_2 A_1$, because $T(\\mathbf{x}) = T_2(T_1(\\mathbf{x})) = A_2(A_1\\mathbf{x}) = (A_2 A_1)\\mathbf{x}$.",
        "当先进行变换 $T_1$（矩阵为 $A_1$），再进行变换 $T_2$（矩阵为 $A_2$）时，复合变换 $T = T_2 \\circ T_1$ 的标准矩阵为 $M = A_2 A_1$。这是因为 $T(\\mathbf{x}) = T_2(T_1(\\mathbf{x})) = A_2(A_1\\mathbf{x}) = (A_2 A_1)\\mathbf{x}$。",
      ),
      generate(rng) {
        const A: Mat2 = [
          [rng.pick([1, 2, 3]), rng.pick([-2, -1, 0, 1])],
          [rng.pick([-1, 0, 1]), rng.pick([1, 2, 3])],
        ];
        const B: Mat2 = [
          [rng.pick([0, 1, 2]), rng.pick([-1, 1, 2])],
          [rng.pick([1, -1, 2]), rng.pick([1, 2, 0])],
        ];

        const ALatex = mat2Latex(A);
        const BLatex = mat2Latex(B);

        return oneOf(
          rng,
          t(
            `A transformation $T_1$ has standard matrix $A = ${ALatex}$, and transformation $T_2$ has standard matrix $B = ${BLatex}$. Which expression gives the standard matrix of the composite transformation formed by applying $T_1$ first, followed by $T_2$?`,
            `变换 $T_1$ 的标准矩阵为 $A = ${ALatex}$，变换 $T_2$ 的标准矩阵为 $B = ${BLatex}$。先进行变换 $T_1$，再进行变换 $T_2$ 的复合变换的标准矩阵由哪一个表达式给出？`,
          ),
          t(`$B A$`, `$B A$`),
          [t(`$A B$`, `$A B$`), t(`$A + B$`, `$A + B$`), t(`$A^{-1} B$`, `$A^{-1} B$`), t(`$B^{-1} A$`, `$B^{-1} A$`)],
          t(
            `Applying $T_1$ first maps $\\mathbf{x}$ to $A\\mathbf{x}$. Then applying $T_2$ maps this result to $B(A\\mathbf{x}) = (BA)\\mathbf{x}$. Therefore, the composite matrix is $BA$. Note that because matrix multiplication is non-commutative, $BA \\ne AB$ in general.`,
            `先进行 $T_1$ 将 $\\mathbf{x}$ 映射为 $A\\mathbf{x}$，随后进行 $T_2$ 将其映射为 $B(A\\mathbf{x}) = (BA)\\mathbf{x}$。因此复合矩阵为 $BA$。注意矩阵乘法一般不满足交换律，故 $BA \\ne AB$。`,
          ),
        );
      },
    },
    {
      id: "evaluating-composite-linear-transformations",
      title: t("Evaluating composite transformation matrices", "计算复合线性变换的合成矩阵"),
      explanation: t(
        "To find the standard matrix of a combined transformation, multiply the individual transformation matrices in reverse chronological order: $M = A_2 A_1$.",
        "求解复合变换的标准矩阵时，按变换发生顺序的逆序计算矩阵乘积：$M = A_2 A_1$。",
      ),
      generate(rng) {
        // Element pool for T1
        const t1Choices: { nameEn: string; nameZh: string; mat: Mat2 }[] = [
          {
            nameEn: "reflection across the $x$-axis",
            nameZh: "关于 $x$ 轴反射",
            mat: [
              [1, 0],
              [0, -1],
            ],
          },
          {
            nameEn: "reflection across the $y$-axis",
            nameZh: "关于 $y$ 轴反射",
            mat: [
              [-1, 0],
              [0, 1],
            ],
          },
          {
            nameEn: "reflection across the line $y = x$",
            nameZh: "关于直线 $y = x$ 反射",
            mat: [
              [0, 1],
              [1, 0],
            ],
          },
          {
            nameEn: "counterclockwise rotation by $90^\\circ$",
            nameZh: "绕原点逆时针旋转 $90^\\circ$",
            mat: [
              [0, -1],
              [1, 0],
            ],
          },
          {
            nameEn: "counterclockwise rotation by $180^\\circ$",
            nameZh: "绕原点逆时针旋转 $180^\\circ$",
            mat: [
              [-1, 0],
              [0, -1],
            ],
          },
          {
            nameEn: "counterclockwise rotation by $270^\\circ$",
            nameZh: "绕原点逆时针旋转 $270^\\circ$",
            mat: [
              [0, 1],
              [-1, 0],
            ],
          },
          {
            nameEn: "horizontal shear with factor $2$",
            nameZh: "切变因子为 $2$ 的水平切变",
            mat: [
              [1, 2],
              [0, 1],
            ],
          },
          {
            nameEn: "horizontal shear with factor $-2$",
            nameZh: "切变因子为 $-2$ 的水平切变",
            mat: [
              [1, -2],
              [0, 1],
            ],
          },
          {
            nameEn: "horizontal shear with factor $3$",
            nameZh: "切变因子为 $3$ 的水平切变",
            mat: [
              [1, 3],
              [0, 1],
            ],
          },
          {
            nameEn: "vertical shear with factor $1$",
            nameZh: "切变因子为 $1$ 的垂直切变",
            mat: [
              [1, 0],
              [1, 1],
            ],
          },
          {
            nameEn: "vertical shear with factor $-1$",
            nameZh: "切变因子为 $-1$ 的垂直切变",
            mat: [
              [1, 0],
              [-1, 1],
            ],
          },
          {
            nameEn: "vertical shear with factor $2$",
            nameZh: "切变因子为 $2$ 的垂直切变",
            mat: [
              [1, 0],
              [2, 1],
            ],
          },
          {
            nameEn: "dilation by scale factor $2$",
            nameZh: "缩放比例为 $2$ 的位似伸缩",
            mat: [
              [2, 0],
              [0, 2],
            ],
          },
          {
            nameEn: "dilation by scale factor $3$",
            nameZh: "缩放比例为 $3$ 的位似伸缩",
            mat: [
              [3, 0],
              [0, 3],
            ],
          },
        ];
        const t2Choices: { nameEn: string; nameZh: string; mat: Mat2 }[] = [
          {
            nameEn: "reflection across the $x$-axis",
            nameZh: "关于 $x$ 轴反射",
            mat: [
              [1, 0],
              [0, -1],
            ],
          },
          {
            nameEn: "reflection across the $y$-axis",
            nameZh: "关于 $y$ 轴反射",
            mat: [
              [-1, 0],
              [0, 1],
            ],
          },
          {
            nameEn: "reflection across the line $y = x$",
            nameZh: "关于直线 $y = x$ 反射",
            mat: [
              [0, 1],
              [1, 0],
            ],
          },
          {
            nameEn: "counterclockwise rotation by $90^\\circ$",
            nameZh: "绕原点逆时针旋转 $90^\\circ$",
            mat: [
              [0, -1],
              [1, 0],
            ],
          },
          {
            nameEn: "counterclockwise rotation by $180^\\circ$",
            nameZh: "绕原点逆时针旋转 $180^\\circ$",
            mat: [
              [-1, 0],
              [0, -1],
            ],
          },
          {
            nameEn: "horizontal stretch by factor $2$",
            nameZh: "沿 $x$ 轴拉伸 $2$ 倍",
            mat: [
              [2, 0],
              [0, 1],
            ],
          },
          {
            nameEn: "vertical stretch by factor $3$",
            nameZh: "沿 $y$ 轴拉伸 $3$ 倍",
            mat: [
              [1, 0],
              [0, 3],
            ],
          },
          {
            nameEn: "vertical stretch by factor $4$",
            nameZh: "沿 $y$ 轴拉伸 $4$ 倍",
            mat: [
              [1, 0],
              [0, 4],
            ],
          },
          {
            nameEn: "horizontal shear with factor $1$",
            nameZh: "切变因子为 $1$ 的水平切变",
            mat: [
              [1, 1],
              [0, 1],
            ],
          },
          {
            nameEn: "horizontal shear with factor $-3$",
            nameZh: "切变因子为 $-3$ 的水平切变",
            mat: [
              [1, -3],
              [0, 1],
            ],
          },
          {
            nameEn: "vertical shear with factor $2$",
            nameZh: "切变因子为 $2$ 的垂直切变",
            mat: [
              [1, 0],
              [2, 1],
            ],
          },
          {
            nameEn: "dilation by scale factor $2$",
            nameZh: "缩放比例为 $2$ 的位似伸缩",
            mat: [
              [2, 0],
              [0, 2],
            ],
          },
        ];

        const item1 = rng.pick(t1Choices);
        const item2 = rng.pick(t2Choices);
        const A1 = item1.mat;
        const A2 = item2.mat;

        const M: Mat2 = [
          [A2[0][0] * A1[0][0] + A2[0][1] * A1[1][0], A2[0][0] * A1[0][1] + A2[0][1] * A1[1][1]],
          [A2[1][0] * A1[0][0] + A2[1][1] * A1[1][0], A2[1][0] * A1[0][1] + A2[1][1] * A1[1][1]],
        ];
        const wrongOrder: Mat2 = [
          [A1[0][0] * A2[0][0] + A1[0][1] * A2[1][0], A1[0][0] * A2[0][1] + A1[0][1] * A2[1][1]],
          [A1[1][0] * A2[0][0] + A1[1][1] * A2[1][0], A1[1][0] * A2[0][1] + A1[1][1] * A2[1][1]],
        ];

        const w1: Mat2 = wrongOrder;
        const w2: Mat2 = [
          [-M[0][0], M[0][1]],
          [M[1][0], -M[1][1]],
        ];
        const w3: Mat2 = [
          [M[1][1], M[1][0]],
          [M[0][1], M[0][0]],
        ];
        const w4: Mat2 = [
          [M[0][0] + 1, M[0][1]],
          [M[1][0], M[1][1] - 1],
        ];

        const rightLatex = mat2Latex(M);

        return oneOf(
          rng,
          t(
            `Find the single standard matrix that represents ${item1.nameEn} followed by ${item2.nameEn}.`,
            `求表示“先进行${item1.nameZh}，再进行${item2.nameZh}”的复合变换的唯一标准矩阵。`,
          ),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          t(
            `Let $A_1 = ${mat2Latex(A1)}$ and $A_2 = ${mat2Latex(A2)}$.\nThe composite matrix is $M = A_2 A_1 = ${rightLatex}$.`,
            `设 $A_1 = ${mat2Latex(A1)}$，$A_2 = ${mat2Latex(A2)}$。\n复合变换的标准矩阵为 $M = A_2 A_1 = ${rightLatex}$。`,
          ),
        );
      },
    },
  ],
};

/** invertingLinearTransformations covers finding inverse transformations and preimages. */
export const invertingLinearTransformations: TopicDef = {
  id: "inverting-linear-transformations",
  title: t("Inverting Linear Transformations", "线性变换的逆变换"),
  summary: t(
    "Find the inverse of a linear transformation and use the inverse matrix to recover preimages.",
    "求解线性变换的逆变换，并利用逆矩阵恢复原像点。",
  ),
  prerequisites: ["inverses-of-2x2-matrices", "combining-linear-transformations-using-2x2-matrices"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.10", "CCSS.HSN.VM.C.12"],
  knowledgePoints: [
    {
      id: "matrix-of-inverse-linear-transformation",
      title: t("Standard matrix of an inverse linear transformation", "逆线性变换的标准矩阵"),
      explanation: t(
        "If a linear transformation $T$ has standard matrix $A$, its inverse transformation $T^{-1}$ reverses the action of $T$ and has standard matrix $A^{-1}$. For instance, the inverse of rotation $R_\\theta$ is $R_{-\\theta}$, and the inverse of reflection across a line is the reflection itself.",
        "若线性变换 $T$ 的标准矩阵为 $A$，则其逆变换 $T^{-1}$ 撤销 $T$ 的几何效果，且其标准矩阵为 $A^{-1}$。例如，旋转 $R_\\theta$ 的逆变换为反向旋转 $R_{-\\theta}$，反射变换的逆变换为其自身。",
      ),
      generate(rng) {
        const type = rng.pick(["shearH", "shearV", "rotation", "reflection", "matrix"]);
        let opEn = "";
        let opZh = "";
        let A: Mat2 = [
          [1, 0],
          [0, 1],
        ];
        let invA: Mat2 = [
          [1, 0],
          [0, 1],
        ];

        if (type === "shearH") {
          const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
          opEn = `horizontal shear with factor $${k}$`;
          opZh = `切变因子为 $${k}$ 的水平切变`;
          A = [
            [1, k],
            [0, 1],
          ];
          invA = [
            [1, -k],
            [0, 1],
          ];
        } else if (type === "shearV") {
          const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
          opEn = `vertical shear with factor $${k}$`;
          opZh = `切变因子为 $${k}$ 的垂直切变`;
          A = [
            [1, 0],
            [k, 1],
          ];
          invA = [
            [1, 0],
            [-k, 1],
          ];
        } else if (type === "rotation") {
          const rotChoices = [
            {
              deg: 90,
              A: [
                [0, -1],
                [1, 0],
              ] as Mat2,
              invA: [
                [0, 1],
                [-1, 0],
              ] as Mat2,
            },
            {
              deg: 180,
              A: [
                [-1, 0],
                [0, -1],
              ] as Mat2,
              invA: [
                [-1, 0],
                [0, -1],
              ] as Mat2,
            },
            {
              deg: 270,
              A: [
                [0, 1],
                [-1, 0],
              ] as Mat2,
              invA: [
                [0, -1],
                [1, 0],
              ] as Mat2,
            },
            {
              deg: -90,
              A: [
                [0, 1],
                [-1, 0],
              ] as Mat2,
              invA: [
                [0, -1],
                [1, 0],
              ] as Mat2,
            },
          ];
          const pickRot = rng.pick(rotChoices);
          opEn = `counterclockwise rotation by $${pickRot.deg}^\\circ$`;
          opZh = `绕原点逆时针旋转 $${pickRot.deg}^\\circ$`;
          A = pickRot.A;
          invA = pickRot.invA;
        } else if (type === "reflection") {
          const refChoices = [
            {
              lineEn: "the $x$-axis",
              lineZh: "$x$ 轴",
              mat: [
                [1, 0],
                [0, -1],
              ] as Mat2,
            },
            {
              lineEn: "the $y$-axis",
              lineZh: "$y$ 轴",
              mat: [
                [-1, 0],
                [0, 1],
              ] as Mat2,
            },
            {
              lineEn: "the line $y = x$",
              lineZh: "直线 $y = x$",
              mat: [
                [0, 1],
                [1, 0],
              ] as Mat2,
            },
            {
              lineEn: "the line $y = -x$",
              lineZh: "直线 $y = -x$",
              mat: [
                [0, -1],
                [-1, 0],
              ] as Mat2,
            },
          ];
          const pickRef = rng.pick(refChoices);
          opEn = `reflection across ${pickRef.lineEn}`;
          opZh = `关于${pickRef.lineZh}反射`;
          A = pickRef.mat;
          invA = pickRef.mat;
        } else {
          // general invertible matrix
          const a = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
          const d = rng.pick([-3, -2, -1, 1, 2, 3]);
          const b = rng.pick([-2, -1, 1, 2]);
          const prod = a * d - 1;
          const c = prod % b === 0 ? prod / b : a * d > 0 ? 1 : -1;
          const det = a * d - b * c;
          if (det === 1) {
            A = [
              [a, b],
              [c, d],
            ];
            invA = [
              [d, -b],
              [-c, a],
            ];
          } else if (det === -1) {
            A = [
              [a, b],
              [c, d],
            ];
            invA = [
              [-d, b],
              [c, -a],
            ];
          } else {
            A = [
              [2, 1],
              [1, 1],
            ];
            invA = [
              [1, -1],
              [-1, 2],
            ];
          }
          opEn = `linear transformation with standard matrix $A = ${mat2Latex(A)}$`;
          opZh = `标准矩阵为 $A = ${mat2Latex(A)}$ 的线性变换`;
        }

        const ALatex = mat2Latex(A);
        const rightLatex = mat2Latex(invA);
        const w1: Mat2 = [
          [-invA[0][0], invA[0][1]],
          [invA[1][0], -invA[1][1]],
        ];
        const w2: Mat2 = [
          [-A[0][0], -A[0][1]],
          [-A[1][0], -A[1][1]],
        ];
        const w3: Mat2 = [
          [invA[1][0], invA[1][1]],
          [invA[0][0], invA[0][1]],
        ];
        const w4: Mat2 = [
          [invA[0][0], -invA[0][1]],
          [-invA[1][0], invA[1][1]],
        ];

        return oneOf(
          rng,
          t(
            `Find the standard matrix of the inverse transformation $T^{-1}$ for the transformation: ${opEn} (standard matrix $A = ${ALatex}$).`,
            `求下列几何变换的逆变换 $T^{-1}$ 的标准矩阵：${opZh}（标准矩阵 $A = ${ALatex}$）。`,
          ),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${mat2Latex(w1)}$`, `$${mat2Latex(w1)}$`),
            t(`$${mat2Latex(w2)}$`, `$${mat2Latex(w2)}$`),
            t(`$${mat2Latex(w3)}$`, `$${mat2Latex(w3)}$`),
            t(`$${mat2Latex(w4)}$`, `$${mat2Latex(w4)}$`),
          ],
          t(
            `The inverse transformation reverses the effect of $T$, corresponding to the inverse matrix $A^{-1} = ${rightLatex}$.`,
            `逆变换抵消 $T$ 的几何变换效果，对应逆矩阵 $A^{-1} = ${rightLatex}$。`,
          ),
        );
      },
    },
    {
      id: "recovering-original-points-using-inverse-transformation",
      title: t("Recovering preimages using inverse transformations", "利用逆变换求原像点"),
      explanation: t(
        "If a point $P(x, y)$ is mapped to $P'(x', y')$ by linear transformation $T$ with invertible matrix $A$, the original point is recovered using the inverse transformation: $\\begin{pmatrix} x \\\\ y \\end{pmatrix} = A^{-1} \\begin{pmatrix} x' \\\\ y' \\end{pmatrix}$.",
        "若点 $P(x, y)$ 在可逆矩阵为 $A$ 的线性变换 $T$ 作用下映射为 $P'(x', y')$，则可通过逆变换恢复原点：$\\begin{pmatrix} x \\\\ y \\end{pmatrix} = A^{-1} \\begin{pmatrix} x' \\\\ y' \\end{pmatrix}$。",
      ),
      generate(rng) {
        const x = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const y = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);

        const candA: Mat2[] = [
          [
            [1, 2],
            [3, 5],
          ],
          [
            [2, 1],
            [5, 3],
          ],
          [
            [3, 1],
            [4, 2],
          ],
          [
            [2, 3],
            [1, 2],
          ],
          [
            [3, 2],
            [1, 1],
          ],
          [
            [4, 1],
            [3, 1],
          ],
          [
            [1, -1],
            [2, 1],
          ],
          [
            [2, -1],
            [1, 1],
          ],
          [
            [3, -2],
            [1, 1],
          ],
          [
            [2, 5],
            [1, 3],
          ],
          [
            [5, 2],
            [2, 1],
          ],
          [
            [3, 4],
            [1, 2],
          ],
        ];
        const A = rng.pick(candA);
        const xp = A[0][0] * x + A[0][1] * y;
        const yp = A[1][0] * x + A[1][1] * y;

        const w1: Vec2 = [y, x];
        const w2: Vec2 = [-x, y];
        const w3: Vec2 = [x, -y];
        const w4: Vec2 = [x + 1, y - 1];

        const ALatex = mat2Latex(A);

        return oneOf(
          rng,
          t(
            `A linear transformation with standard matrix $A = ${ALatex}$ maps an unknown point $P(x, y)$ to $P'(${xp}, ${yp})$. Find the coordinates of the original point $P$.`,
            `标准矩阵为 $A = ${ALatex}$ 的线性变换将未知点 $P(x, y)$ 映射为 $P'(${xp}, ${yp})$。求原像点 $P$ 的坐标。`,
          ),
          t(`$P(${x}, ${y})$`, `$P(${x}, ${y})$`),
          [
            t(`$P(${w1[0]}, ${w1[1]})$`, `$P(${w1[0]}, ${w1[1]})$`),
            t(`$P(${w2[0]}, ${w2[1]})$`, `$P(${w2[0]}, ${w2[1]})$`),
            t(`$P(${w3[0]}, ${w3[1]})$`, `$P(${w3[0]}, ${w3[1]})$`),
            t(`$P(${w4[0]}, ${w4[1]})$`, `$P(${w4[0]}, ${w4[1]})$`),
          ],
          t(
            `Multiply the transformed point by the inverse matrix $A^{-1}$:\n\n$$\\begin{pmatrix} x \\\\ y \\end{pmatrix} = A^{-1}\\begin{pmatrix} ${xp} \\\\ ${yp} \\end{pmatrix} = \\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$$.\n\nThus $P = (${x}, ${y})$.`,
            `将像点坐标向量左乘逆矩阵 $A^{-1}$：\n\n$$\\begin{pmatrix} x \\\\ y \\end{pmatrix} = A^{-1}\\begin{pmatrix} ${xp} \\\\ ${yp} \\end{pmatrix} = \\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$$.\n\n故原像点为 $P = (${x}, ${y})$。`,
          ),
        );
      },
    },
  ],
};

/** areaScaleFactorsOfLinearTransformations covers area scaling by |det(A)| and orientation. */
export const areaScaleFactorsOfLinearTransformations: TopicDef = {
  id: "area-scale-factors-of-linear-transformations",
  title: t("Area Scale Factors of Linear Transformations", "线性变换的面积缩放因子"),
  summary: t(
    "Interpret the determinant as the area scale factor of a transformation and determine whether orientation is preserved.",
    "将行列式解释为变换的面积缩放因子，并根据行列式符号判断定向是否保持。",
  ),
  prerequisites: ["the-geometric-interpretation-of-the-2x2-determinant", "combining-linear-transformations-using-2x2-matrices"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  knowledgePoints: [
    {
      id: "area-scaling-by-absolute-determinant",
      title: t("Area scaling by absolute determinant", "面积缩放因子与行列式绝对值"),
      explanation: t(
        "Under a $2 \\times 2$ linear transformation with standard matrix $A$, the area of any planar region $S$ scales by the absolute value of the determinant: $\\text{Area}(T(S)) = |\\det(A)| \\times \\text{Area}(S)$.",
        "在标准矩阵为 $A$ 的二阶线性变换作用下，任意平面图形 $S$ 的面积缩放倍数为行列式的绝对值：$\\text{Area}(T(S)) = |\\det(A)| \\times \\text{Area}(S)$。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const d = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-3, -2, -1, 0, 1, 2, 3]);
        const c = rng.pick([-3, -2, -1, 0, 1, 2, 3]);
        const det = a * d - b * c;
        if (det === 0) return this.generate(rng);

        const absDet = Math.abs(det);
        const origArea = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20]);
        const newArea = absDet * origArea;

        const w1 = origArea * (absDet + 1);
        const w2 = Math.abs(det) === 1 ? origArea + 2 : (absDet - 1) * origArea;
        const w3 = (a + d) * origArea;
        const w4 = Math.round(origArea / absDet);

        const ALatex = mat2Latex([
          [a, b],
          [c, d],
        ]);

        return oneOf(
          rng,
          t(
            `A geometric shape in the plane has an area of $${origArea}$. What is the area of its image under the linear transformation with matrix $A = ${ALatex}$?`,
            `平面上某几何图形的面积为 $${origArea}$。在矩阵为 $A = ${ALatex}$ 的线性变换作用下，其像图形的面积是多少？`,
          ),
          t(`$${newArea}$`, `$${newArea}$`),
          [t(`$${w1}$`, `$${w1}$`), t(`$${w2}$`, `$${w2}$`), t(`$${w3}$`, `$${w3}$`), t(`$${w4}$`, `$${w4}$`)],
          t(
            `Calculate the determinant: $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det}$.\nThe area scale factor is $|\\det(A)| = |${det}| = ${absDet}$.\nThus, the transformed area is ${absDet} \\times ${origArea} = ${newArea}.`,
            `计算行列式：$\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det}$。\n面积缩放因子为 $|\\det(A)| = |${det}| = ${absDet}$。\n因此变换后的面积为 ${absDet} \\times ${origArea} = ${newArea}。`,
          ),
        );
      },
    },
    {
      id: "orientation-and-sign-of-determinant",
      title: t("Orientation and sign of the determinant", "图形定向与行列式符号"),
      explanation: t(
        "The sign of $\\det(A)$ governs orientation:\n- If $\\det(A) > 0$, the transformation preserves orientation (counterclockwise loops remain counterclockwise).\n- If $\\det(A) < 0$, the transformation reverses orientation (counterclockwise loops become clockwise, as in a reflection).",
        "行列式 $\\det(A)$ 的符号决定图形的定向：\n- 若 $\\det(A) > 0$，变换保持定向不变（逆时针路径仍为逆时针）。\n- 若 $\\det(A) < 0$，变换反转定向（逆时针路径变为顺时针，如同镜像反射）。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const d = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-3, -2, -1, 0, 1, 2, 3]);
        const c = rng.pick([-3, -2, -1, 0, 1, 2, 3]);
        const det = a * d - b * c;
        if (det === 0) return this.generate(rng);

        const preserves = det > 0;
        const A: Mat2 = [
          [a, b],
          [c, d],
        ];
        const ALatex = mat2Latex(A);

        const rightText = preserves
          ? t(`Preserves orientation, because $\\det(A) = ${det} > 0$`, `保持定向，因为 $\\det(A) = ${det} > 0$`)
          : t(`Reverses orientation, because $\\det(A) = ${det} < 0$`, `反转定向，因为 $\\det(A) = ${det} < 0$`);

        const wrong1 = preserves
          ? t(`Reverses orientation, because $\\det(A) = ${det} > 0$`, `反转定向，因为 $\\det(A) = ${det} > 0$`)
          : t(`Preserves orientation, because $\\det(A) = ${det} < 0$`, `保持定向，因为 $\\det(A) = ${det} < 0$`);

        const wrong2 = t(`Orientation is preserved if and only if $\\det(A) = 0$`, `当且仅当 $\\det(A) = 0$ 时保持定向`);
        const wrong3 = t(`Orientation cannot be determined from the determinant alone`, `仅凭行列式无法判断定向是否改变`);

        return oneOf(
          rng,
          t(
            `A linear transformation has standard matrix $A = ${ALatex}$. Does this transformation preserve or reverse orientation in the plane?`,
            `某线性变换的标准矩阵为 $A = ${ALatex}$。该变换在平面上是保持定向还是反转定向？`,
          ),
          rightText,
          [wrong1, wrong2, wrong3],
          t(
            `Calculate $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det}$. Since the determinant is ${det > 0 ? "positive" : "negative"}, the transformation ${preserves ? "preserves" : "reverses"} orientation.`,
            `计算行列式 $\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det}$。由于行列式为${det > 0 ? "正" : "负"}，该变换${preserves ? "保持" : "反转"}平面图形的定向。`,
          ),
        );
      },
    },
  ],
};

/** singularLinearTransformationsInThePlane covers transformations where det(A) = 0. */
export const singularLinearTransformationsInThePlane: TopicDef = {
  id: "singular-linear-transformations-in-the-plane",
  title: t("Singular Linear Transformations in the Plane", "奇异（退化）线性变换"),
  summary: t(
    "Examine singular linear transformations where det(A) = 0, causing the plane to collapse onto a line or point.",
    "研究行列式为零的奇异线性变换，分析其导致平面坍缩为直线或原点以及不可逆的性质。",
  ),
  prerequisites: ["area-scale-factors-of-linear-transformations"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.12"],
  knowledgePoints: [
    {
      id: "geometric-collapse-under-singular-transformations",
      title: t("Dimension reduction and geometric collapse", "降维坍缩与面积为零"),
      explanation: t(
        "When $\\det(A) = 0$, the transformation is singular (degenerate). The area scaling factor is $|\\det(A)| = 0$, so every 2D region collapses to zero area: the entire plane is squashed onto a single line through the origin (or onto the origin if $A = 0$).",
        "当 $\\det(A) = 0$ 时，变换是奇异的（退化的）。面积缩放因子 $|\\det(A)| = 0$，因此所有二维图形均坍缩为零面积：整个平面被压缩到一条过原点的直线上（若 $A = 0$ 则坍缩为原点）。",
      ),
      generate(rng) {
        const u = rng.pick([-3, -2, -1, 1, 2, 3]);
        const v = rng.pick([-3, -2, -1, 1, 2, 3]);
        const k1 = rng.pick([1, 2, -1, -2]);
        const k2 = rng.pick([1, 2, -1, -2]);
        const A: Mat2 = [
          [k1 * u, k2 * u],
          [k1 * v, k2 * v],
        ];

        const slopeQ = Q.of(v, u);
        const lineEq = `y = ${slopeQ.toLatex()}x`;
        const ALatex = mat2Latex(A);

        const w1 = `y = ${slopeQ.neg().toLatex()}x`;
        const w2 = `y = ${Q.of(u, v).toLatex()}x`;
        const w3 = "The unit circle $x^2 + y^2 = 1$";
        const w4 = "The entire Cartesian plane $\\mathbb{R}^2$";

        const w3Zh = "单位圆 $x^2 + y^2 = 1$";
        const w4Zh = "整个二维笛卡尔平面 $\\mathbb{R}^2$";

        return oneOf(
          rng,
          t(
            `The linear transformation with standard matrix $A = ${ALatex}$ is singular because $\\det(A) = 0$. Onto which geometric figure is the entire Cartesian plane $\\mathbb{R}^2$ mapped?`,
            `标准矩阵为 $A = ${ALatex}$ 的线性变换因 $\\det(A) = 0$ 而奇异。整个笛卡尔平面 $\\mathbb{R}^2$ 被映射到了哪种几何图形上？`,
          ),
          t(`A line through the origin with equation $${lineEq}$`, `过原点的直线 $${lineEq}$`),
          [t(`A line with equation $${w1}$`, `直线 $${w1}$`), t(`A line with equation $${w2}$`, `直线 $${w2}$`), t(w3, w3Zh), t(w4, w4Zh)],
          t(
            `Both column vectors of $A$ are parallel to $\\begin{pmatrix} ${u} \\\\ ${v} \\end{pmatrix}$. Every vector $A\\mathbf{x}$ is a scalar multiple of this direction vector. Hence the image of the entire plane is the line through the origin with direction vector $\\begin{pmatrix} ${u} \\\\ ${v} \\end{pmatrix}$, having equation $${lineEq}$.`,
            `矩阵 $A$ 的两个列向量均平行于 $\\begin{pmatrix} ${u} \\\\ ${v} \\end{pmatrix}$。所有像向量 $A\\mathbf{x}$ 都是该方向向量的数乘倍数。因此整个平面的像为过原点且方向向量为 $\\begin{pmatrix} ${u} \\\\ ${v} \\end{pmatrix}$ 的直线，其方程为 $${lineEq}$。`,
          ),
        );
      },
    },
    {
      id: "non-invertibility-and-kernel-of-singular-transformations",
      title: t("Non-invertibility and non-trivial kernel", "奇异变换的不可逆性与非零核"),
      explanation: t(
        "A singular matrix $A$ has a non-trivial kernel (nullspace): there exist nonzero vectors $\\mathbf{v} \\ne \\mathbf{0}$ such that $A\\mathbf{v} = \\mathbf{0}$. Because distinct vectors are squashed to the same point, the transformation is not one-to-one and cannot be inverted.",
        "奇异矩阵 $A$ 拥有非平凡的核（零空间）：存在非零向量 $\\mathbf{v} \\ne \\mathbf{0}$ 满足 $A\\mathbf{v} = \\mathbf{0}$。由于不同向量被压缩至同一点，该变换不是单射，因而不可逆。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3, -1, -2, -3]);
        const b = rng.pick([1, 2, 3, 4, -1, -2, -3]);
        const m = rng.pick([2, -2, 3, -3, 1, -1]);
        const c = a * m;
        const d = b * m;
        const A: Mat2 = [
          [a, b],
          [c, d],
        ];

        const vKer: Vec2 = [-b, a];
        const rightLatex = vec2Latex(vKer);

        const w1: Vec2 = [a, b];
        const w2: Vec2 = [b, a];
        const w3: Vec2 = [1, 1];
        const w4: Vec2 = [-a, b];

        const ALatex = mat2Latex(A);

        return oneOf(
          rng,
          t(
            `Which of the following nonzero vectors is mapped to the origin $\\mathbf{0} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$ by the singular matrix $A = ${ALatex}$?`,
            `下列哪一个非零向量在奇异矩阵 $A = ${ALatex}$ 的作用下被映射为零向量 $\\mathbf{0} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$？`,
          ),
          t(`$${rightLatex}$`, `$${rightLatex}$`),
          [
            t(`$${vec2Latex(w1)}$`, `$${vec2Latex(w1)}$`),
            t(`$${vec2Latex(w2)}$`, `$${vec2Latex(w2)}$`),
            t(`$${vec2Latex(w3)}$`, `$${vec2Latex(w3)}$`),
            t(`$${vec2Latex(w4)}$`, `$${vec2Latex(w4)}$`),
          ],
          t(
            `Multiplying $A$ by $\\mathbf{v} = ${rightLatex}$ gives:\n\n$$${ALatex} ${rightLatex} = \\begin{pmatrix} (${a})(${-b}) + (${b})(${a}) \\\\ (${c})(${-b}) + (${d})(${a}) \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$$.\n\nBecause $A\\mathbf{v} = \\mathbf{0}$ for a nonzero vector $\\mathbf{v}$, the transformation collapses this direction and is not invertible.`,
            `将矩阵 $A$ 与向量 $\\mathbf{v} = ${rightLatex}$ 相乘：\n\n$$${ALatex} ${rightLatex} = \\begin{pmatrix} (${a})(${-b}) + (${b})(${a}) \\\\ (${c})(${-b}) + (${d})(${a}) \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$$.\n\n由于非零向量 $\\mathbf{v}$ 被映射为零向量，变换在此方向上发生坍缩，因而不可逆。`,
          ),
        );
      },
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// ALL TOPICS EXPORT ARRAY
// ════════════════════════════════════════════════════════════════════════════

/** precalculusLinearTransformationTopics contains all 17 topics of Precalculus Unit 6 Part 2. */
export const precalculusLinearTransformationTopics: readonly TopicDef[] = [
  introductionToTheInverseOfAMatrix,
  inversesOf2x2Matrices,
  calculatingTheInverseOfA3x3MatrixUsingTheCofactorMethod,
  solving2x2SystemsOfEquationsUsingInverseMatrices,
  solvingSystemsOfEquationsUsingInverseMatrices,
  introductionToLinearTransformations,
  theStandardMatrixOfALinearTransformation,
  linearTransformationsOfPointsAndLinesInThePlane,
  linearTransformationsOfObjectsInThePlane,
  dilationsAndReflectionsAsLinearTransformations,
  shearAndStretchAsLinearTransformations,
  rightAngleRotationsAsLinearTransformations,
  rotationsAsLinearTransformations,
  combiningLinearTransformationsUsing2x2Matrices,
  invertingLinearTransformations,
  areaScaleFactorsOfLinearTransformations,
  singularLinearTransformationsInThePlane,
];
