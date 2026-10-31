import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { choiceProblem } from "../problems.ts";

// Precalculus unit 6: Matrices (Part 1: Matrix Algebra and Determinants,
// modules 6.21, 6.22, and 6.23).

type Mat = readonly (readonly number[])[];

/** matLatex formats a numeric or string 2D matrix as a LaTeX pmatrix. */
function matLatex(m: readonly (readonly (number | string)[])[]): string {
  return `\\begin{pmatrix} ${m.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
}

/** detLatex formats a numeric or string 2D matrix as a LaTeX vmatrix (determinant). */
function detLatex(m: readonly (readonly (number | string)[])[]): string {
  return `\\begin{vmatrix} ${m.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{vmatrix}`;
}

/** colVecLatex formats an array as a column vector LaTeX pmatrix. */
function colVecLatex(v: readonly (number | string)[]): string {
  return `\\begin{pmatrix} ${v.join(" \\\\ ")} \\end{pmatrix}`;
}

/** matAdd computes the entrywise sum of two matrices of equal dimensions. */
function matAdd(a: Mat, b: Mat): Mat {
  return a.map((row, i) => row.map((val, j) => val + b[i]![j]!));
}

/** matSub computes the entrywise difference of two matrices of equal dimensions. */
function matSub(a: Mat, b: Mat): Mat {
  return a.map((row, i) => row.map((val, j) => val - b[i]![j]!));
}

/** matScale multiplies each entry of a matrix by scalar k. */
function matScale(k: number, a: Mat): Mat {
  return a.map((row) => row.map((val) => k * val));
}

/** matTranspose transposes an m x n matrix into an n x m matrix. */
function matTranspose(a: Mat): Mat {
  const rows = a.length;
  const cols = a[0]!.length;
  return Array.from({ length: cols }, (_, j) => Array.from({ length: rows }, (_, i) => a[i]![j]!));
}

/** matMul computes matrix product A * B. */
function matMul(a: Mat, b: Mat): Mat {
  const rowsA = a.length;
  const colsA = a[0]!.length;
  const colsB = b[0]!.length;
  return Array.from({ length: rowsA }, (_, i) =>
    Array.from({ length: colsB }, (_, j) => {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += a[i]![k]! * b[k]![j]!;
      }
      return sum;
    }),
  );
}

/** det2 evaluates the determinant of a 2x2 matrix. */
function det2(m: Mat): number {
  return m[0]![0]! * m[1]![1]! - m[0]![1]! * m[1]![0]!;
}

/** submatrix3 returns the 2x2 submatrix obtained by deleting row r and col c from 3x3 matrix m. */
function submatrix3(m: Mat, r: number, c: number): Mat {
  return m.filter((_, i) => i !== r).map((row) => row.filter((_, j) => j !== c));
}

/** minor3 computes the (r, c) minor of a 3x3 matrix (0-indexed). */
function minor3(m: Mat, r: number, c: number): number {
  return det2(submatrix3(m, r, c));
}

/** cofactor3 computes the (r, c) cofactor of a 3x3 matrix (0-indexed). */
function cofactor3(m: Mat, r: number, c: number): number {
  const sign = (r + c) % 2 === 0 ? 1 : -1;
  return sign * minor3(m, r, c);
}

/** det3 evaluates the determinant of a 3x3 matrix via row 0 Laplace expansion. */
function det3(m: Mat): number {
  return m[0]![0]! * cofactor3(m, 0, 0) + m[0]![1]! * cofactor3(m, 0, 1) + m[0]![2]! * cofactor3(m, 0, 2);
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
  let fallbackCount = 1;
  while (rest.length < 3) {
    const fb = t(`None of the other options (${fallbackCount})`, `以上选项均不正确 (${fallbackCount})`);
    if (!seen.has(fb.en)) {
      seen.add(fb.en);
      rest.push(fb);
    }
    fallbackCount++;
  }
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

// ─── Module 6.21. Introduction to Matrices ───────────────────────────────────

// ─── 6.21.1 Introduction to Matrices ─────────────────────────────────────────

/** introductionToMatrices introduces matrix definition, dimensions, rows, columns, and entries. */
export const introductionToMatrices: TopicDef = {
  id: "introduction-to-matrices",
  title: t("Introduction to Matrices", "矩阵的概念与维度"),
  summary: t(
    "Understand what a matrix is, determine its dimensions m x n, and identify row and column counts.",
    "理解矩阵的定义，确定其 m x n 的维度，并识别行数与列数。",
  ),
  prerequisites: ["evaluating-expressions"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.6"],
  knowledgePoints: [
    {
      id: "matrix-dimensions-and-order",
      title: t("Matrix dimensions and order", "矩阵的维度与阶数"),
      explanation: t(
        "A matrix is a rectangular array of numbers arranged in rows (horizontal) and columns (vertical). A matrix with $m$ rows and $n$ columns has dimensions (or order) $m \\times n$, read '$m$ by $n$'.",
        "矩阵是由数排成的矩形阵列，由若干横行（row）和纵列（column）组成。具有 $m$ 行和 $n$ 列的矩阵其维度（或阶数）记作 $m \\times n$，读作“$m$ 乘 $n$”。",
      ),
      generate(rng) {
        const pairs: readonly (readonly [number, number])[] = [
          [1, 2],
          [1, 3],
          [1, 4],
          [2, 1],
          [2, 2],
          [2, 3],
          [2, 4],
          [3, 1],
          [3, 2],
          [3, 3],
          [3, 4],
          [4, 1],
          [4, 2],
          [4, 3],
        ];
        const [m, n] = rng.pick(pairs);
        const pool = [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
        const A: Mat = Array.from({ length: m }, () => Array.from({ length: n }, () => rng.pick(pool)));
        const aLatex = matLatex(A);

        return oneOf(
          rng,
          t(
            `What are the dimensions (rows $\\times$ columns) of the matrix $A$?\n\n$$A = ${aLatex}$$`,
            `矩阵 $A$ 的维度（行数 $\\times$ 列数）是多少？\n\n$$A = ${aLatex}$$`,
          ),
          t(`$${m} \\times ${n}$`, `$${m} \\times ${n}$`),
          [
            t(`$${n} \\times ${m}$`, `$${n} \\times ${m}$`),
            t(`$${m + 1} \\times ${n}$`, `$${m + 1} \\times ${n}$`),
            t(`$${m} \\times ${n + 1}$`, `$${m} \\times ${n + 1}$`),
            t(`$${Math.max(1, m - 1)} \\times ${n}$`, `$${Math.max(1, m - 1)} \\times ${n}$`),
            t(`$${m} \\times ${Math.max(1, n - 1)}$`, `$${m} \\times ${Math.max(1, n - 1)}$`),
          ],
          t(
            `Dimensions are always written as $\\text{number of rows} \\times \\text{number of columns}$. Matrix $A$ has $${m}$ horizontal rows and $${n}$ vertical columns, so its dimensions are $${m} \\times ${n}$.`,
            `矩阵的维度总是表示为“行数 $\\times$ 列数”。矩阵 $A$ 共有 $${m}$ 个横行和 $${n}$ 个纵列，因此其维度为 $${m} \\times ${n}$。`,
          ),
        );
      },
    },
    {
      id: "number-of-entries-in-a-matrix",
      title: t("Number of entries in a matrix", "矩阵中元素的总数"),
      explanation: t(
        "A matrix of dimension $m \\times n$ contains a total of $m \\cdot n$ entries (or elements). An $m \\times 1$ matrix is called a column matrix (or column vector), and a $1 \\times n$ matrix is called a row matrix (or row vector).",
        "一个 $m \\times n$ 阶的矩阵共包含 $m \\cdot n$ 个元素。只有一列的 $m \\times 1$ 矩阵称为列矩阵（或列向量），只有一行的 $1 \\times n$ 矩阵称为行矩阵（或行向量）。",
      ),
      generate(rng) {
        const m = rng.pick([2, 3, 4, 5]);
        const n = rng.pick([2, 3, 4]);
        const pool = [-9, -8, -6, -5, -3, -2, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const A: Mat = Array.from({ length: m }, () => Array.from({ length: n }, () => rng.pick(pool)));
        const aLatex = matLatex(A);
        const total = m * n;

        return oneOf(
          rng,
          t(
            `How many total entries (elements) are in the matrix $A$?\n\n$$A = ${aLatex}$$`,
            `矩阵 $A$ 中总共包含多少个元素？\n\n$$A = ${aLatex}$$`,
          ),
          t(`$${total}$`, `$${total}$`),
          [
            t(`$${m + n}$`, `$${m + n}$`),
            t(`$${2 * (m + n)}$`, `$${2 * (m + n)}$`),
            t(`$${total + 1}$`, `$${total + 1}$`),
            t(`$${total - 1}$`, `$${total - 1}$`),
            t(`$${total + 2}$`, `$${total + 2}$`),
          ],
          t(
            `Matrix $A$ has $${m}$ rows and $${n}$ columns. The total number of entries is the product of the row count and column count: $${m} \\times ${n} = ${total}$.`,
            `矩阵 $A$ 包含 $${m}$ 行与 $${n}$ 列。元素的总数等于行数与列数的乘积：$${m} \\times ${n} = ${total}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.21.2 Index Notation for Matrices ──────────────────────────────────────

/** indexNotationForMatrices introduces entry notation a_ij where i is row and j is col. */
export const indexNotationForMatrices: TopicDef = {
  id: "index-notation-for-matrices",
  title: t("Index Notation for Matrices", "矩阵的下标表示法"),
  summary: t(
    "Use double-subscript index notation a_ij to locate and evaluate entries in row i and column j of a matrix.",
    "用双下标表示法 a_ij 定位并计算矩阵中位于第 i 行第 j 列的元素。",
  ),
  prerequisites: ["introduction-to-matrices"],
  encompasses: [{ topic: "introduction-to-matrices", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.6"],
  knowledgePoints: [
    {
      id: "identifying-matrix-entries-by-index",
      title: t("Identifying matrix entries by index", "根据下标确定矩阵元素"),
      explanation: t(
        "In a matrix $A = [a_{ij}]$, the first subscript $i$ indicates the row number and the second subscript $j$ indicates the column number. For example, $a_{23}$ is the entry in row 2 and column 3.",
        "在矩阵 $A = [a_{ij}]$ 中，第一个下标 $i$ 表示行号，第二个下标 $j$ 表示列号。例如，$a_{23}$ 表示位于第 2 行第 3 列的元素。",
      ),
      generate(rng) {
        const shapes: readonly (readonly [number, number])[] = [
          [2, 3],
          [3, 2],
          [3, 3],
          [3, 4],
          [2, 4],
        ];
        const [m, n] = rng.pick(shapes);
        const pool = [-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const A: Mat = Array.from({ length: m }, () => Array.from({ length: n }, () => rng.pick(pool)));
        const i = rng.pick(Array.from({ length: m }, (_, idx) => idx + 1));
        const j = rng.pick(Array.from({ length: n }, (_, idx) => idx + 1));
        const target = A[i - 1]![j - 1]!;
        const aLatex = matLatex(A);

        const wrongVals: number[] = [];
        // Swapped indices if within bounds
        if (j <= m && i <= n && (i !== j || A[j - 1]![i - 1] !== target)) {
          wrongVals.push(A[j - 1]![i - 1]!);
        }
        wrongVals.push(-target, target + 1, target - 1, target + 2);
        // Other entries in row or column
        for (let c = 0; c < n; c++) {
          if (c !== j - 1) wrongVals.push(A[i - 1]![c]!);
        }
        for (let r = 0; r < m; r++) {
          if (r !== i - 1) wrongVals.push(A[r]![j - 1]!);
        }

        return oneOf(
          rng,
          t(
            `In the matrix $A$, what is the entry $a_{${i}${j}}$?\n\n$$A = ${aLatex}$$`,
            `在矩阵 $A$ 中，元素 $a_{${i}${j}}$ 的值是多少？\n\n$$A = ${aLatex}$$`,
          ),
          t(`$${target}$`, `$${target}$`),
          wrongVals.map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `The entry $a_{${i}${j}}$ is located at row $${i}$ and column $${j}$. Looking across row $${i}$ to column $${j}$, the entry is $${target}$.`,
            `元素 $a_{${i}${j}}$ 位于第 $${i}$ 行第 $${j}$ 列。沿第 $${i}$ 行数至第 $${j}$ 列，该元素为 $${target}$。`,
          ),
        );
      },
    },
    {
      id: "evaluating-entries-from-index-formula",
      title: t("Evaluating entries from index formulas", "根据下标公式计算矩阵元素"),
      explanation: t(
        "A matrix is often defined by a general formula for its entries $a_{ij} = f(i, j)$. To find a specific entry $a_{ij}$, substitute the row number $i$ and column number $j$ into the formula.",
        "矩阵的元素常由一般代数公式 $a_{ij} = f(i, j)$ 给出。要求出特定元素 $a_{ij}$，只需将行号 $i$ 与列号 $j$ 代入公式计算即可。",
      ),
      generate(rng) {
        const mode = rng.pick([0, 1, 2, 3]);
        const i = rng.pick([1, 2, 3]);
        const j = rng.pick([1, 2, 3]);

        let formulaLatex = "";
        let formulaZh = "";
        let val = 0;
        let altVal = 0;

        if (mode === 0) {
          const c1 = rng.pick([-3, -2, -1, 1, 2, 3]);
          const c2 = rng.pick([-3, -2, -1, 1, 2, 3]);
          formulaLatex = `${c1 === 1 ? "" : c1 === -1 ? "-" : c1}i ${c2 < 0 ? "-" : "+"} ${Math.abs(c2) === 1 ? "" : Math.abs(c2)}j`;
          formulaZh = formulaLatex;
          val = c1 * i + c2 * j;
          altVal = c1 * j + c2 * i;
        } else if (mode === 1) {
          const c = rng.pick([1, 2, 3]);
          formulaLatex = `i^2 - ${c === 1 ? "" : c}j`;
          formulaZh = formulaLatex;
          val = i * i - c * j;
          altVal = j * j - c * i;
        } else if (mode === 2) {
          const c = rng.pick([2, 3, 4]);
          formulaLatex = `${c}i - j^2`;
          formulaZh = formulaLatex;
          val = c * i - j * j;
          altVal = c * j - i * i;
        } else {
          const c = rng.pick([1, 2]);
          formulaLatex = `(-1)^{i+j}(i + ${c === 1 ? "" : c}j)`;
          formulaZh = formulaLatex;
          val = ((i + j) % 2 === 0 ? 1 : -1) * (i + c * j);
          altVal = -val;
        }

        return oneOf(
          rng,
          t(
            `A $3 \\times 3$ matrix $A = [a_{ij}]$ has entries given by $a_{ij} = ${formulaLatex}$. Find the entry $a_{${i}${j}}$.`,
            `一个 $3 \\times 3$ 矩阵 $A = [a_{ij}]$ 的元素由 $a_{ij} = ${formulaZh}$ 给出。求元素 $a_{${i}${j}}$ 的值。`,
          ),
          t(`$${val}$`, `$${val}$`),
          [
            t(`$${altVal}$`, `$${altVal}$`),
            t(`$${-val}$`, `$${-val}$`),
            t(`$${val + 1}$`, `$${val + 1}$`),
            t(`$${val - 2}$`, `$${val - 2}$`),
            t(`$${val + 3}$`, `$${val + 3}$`),
          ],
          t(
            `Substitute row index $i = ${i}$ and column index $j = ${j}$ into the definition: $a_{${i}${j}} = ${val}$.`,
            `将行下标 $i = ${i}$ 和列下标 $j = ${j}$ 代入定义式中，得到 $a_{${i}${j}} = ${val}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.21.3 Adding and Subtracting Matrices ──────────────────────────────────

/** addingAndSubtractingMatrices covers entrywise addition and subtraction. */
export const addingAndSubtractingMatrices: TopicDef = {
  id: "adding-and-subtracting-matrices",
  title: t("Adding and Subtracting Matrices", "矩阵的加法与减法"),
  summary: t(
    "Add and subtract matrices of the same dimensions entry by entry, and recognize when operations are not defined.",
    "对同型矩阵按对应元素进行加法与减法运算，并识别运算未定义的情形。",
  ),
  prerequisites: ["introduction-to-matrices"],
  encompasses: [{ topic: "introduction-to-matrices", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.8"],
  knowledgePoints: [
    {
      id: "matrix-addition-and-subtraction-computations",
      title: t("Adding and subtracting matrices of the same dimension", "同型矩阵的加法与减法计算"),
      explanation: t(
        "To add (or subtract) two matrices of the same dimensions, add (or subtract) corresponding entries: $(A \\pm B)_{ij} = a_{ij} \\pm b_{ij}$.",
        "两个同型矩阵相加（或相减）时，只需将对应位置上的元素分别相加（或相减）：$(A \\pm B)_{ij} = a_{ij} \\pm b_{ij}$。",
      ),
      generate(rng) {
        const isAdd = rng.bool();
        const dims: readonly (readonly [number, number])[] = [
          [2, 2],
          [2, 3],
        ];
        const [m, n] = rng.pick(dims);
        const pool = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
        const A: Mat = Array.from({ length: m }, () => Array.from({ length: n }, () => rng.pick(pool)));
        const B: Mat = Array.from({ length: m }, () => Array.from({ length: n }, () => rng.pick(pool)));
        const C = isAdd ? matAdd(A, B) : matSub(A, B);
        const wrongC = isAdd ? matSub(A, B) : matAdd(A, B);
        const reversedSub = matSub(B, A);

        const aLatex = matLatex(A);
        const bLatex = matLatex(B);
        const cLatex = matLatex(C);
        const opSymbol = isAdd ? "+" : "-";

        return oneOf(
          rng,
          t(
            `Compute $A ${opSymbol} B$, where:\n\n$$A = ${aLatex}, \\quad B = ${bLatex}$$`,
            `计算 $A ${opSymbol} B$，其中：\n\n$$A = ${aLatex}, \\quad B = ${bLatex}$$`,
          ),
          t(`$${cLatex}$`, `$${cLatex}$`),
          [
            t(`$${matLatex(wrongC)}$`, `$${matLatex(wrongC)}$`),
            t(`$${matLatex(reversedSub)}$`, `$${matLatex(reversedSub)}$`),
            t(
              `$${matLatex(C.map((r, i) => r.map((v, j) => (i === 0 && j === 0 ? v + 1 : v))))}$`,
              `$${matLatex(C.map((r, i) => r.map((v, j) => (i === 0 && j === 0 ? v + 1 : v))))}$`,
            ),
            t(
              `$${matLatex(C.map((r, i) => r.map((v, j) => (i === m - 1 && j === n - 1 ? v - 2 : v))))}$`,
              `$${matLatex(C.map((r, i) => r.map((v, j) => (i === m - 1 && j === n - 1 ? v - 2 : v))))}$`,
            ),
          ],
          t(
            `Perform entry-by-entry ${isAdd ? "addition" : "subtraction"}: $(A ${opSymbol} B)_{ij} = a_{ij} ${opSymbol} b_{ij}$. Result is $${cLatex}$.`,
            `将对应位置上的元素分别进行${isAdd ? "加法" : "减法"}计算：$(A ${opSymbol} B)_{ij} = a_{ij} ${opSymbol} b_{ij}$。得到结果为 $${cLatex}$。`,
          ),
        );
      },
    },
    {
      id: "matrix-addition-compatibility",
      title: t("Compatibility for matrix addition and subtraction", "矩阵加减法的条件与未定义情形"),
      explanation: t(
        "Matrix addition and subtraction are only defined for matrices of the exact same dimensions. If two matrices have different dimensions, their sum or difference is not defined.",
        "矩阵的加法与减法仅在两个矩阵具有完全相同的维度时才有定义。若两个矩阵维度不同，则它们的和或差是未定义的。",
      ),
      generate(rng) {
        const isCompatible = rng.bool();
        let m1 = 2;
        let n1 = 3;
        let m2 = 2;
        let n2 = 3;

        if (!isCompatible) {
          const mismatchPairs: readonly (readonly [number, number, number, number])[] = [
            [2, 3, 3, 2],
            [2, 2, 2, 3],
            [3, 1, 1, 3],
            [3, 2, 3, 3],
            [1, 4, 2, 4],
          ];
          const chosen = rng.pick(mismatchPairs);
          m1 = chosen[0];
          n1 = chosen[1];
          m2 = chosen[2];
          n2 = chosen[3];
        } else {
          const matchPairs: readonly (readonly [number, number])[] = [
            [2, 2],
            [2, 3],
            [3, 2],
            [3, 3],
          ];
          const chosen = rng.pick(matchPairs);
          m1 = chosen[0];
          n1 = chosen[0];
          m2 = chosen[0];
          n2 = chosen[0];
        }

        const pool = [-5, -4, -2, -1, 1, 2, 4, 5];
        const A: Mat = Array.from({ length: m1 }, () => Array.from({ length: n1 }, () => rng.pick(pool)));
        const B: Mat = Array.from({ length: m2 }, () => Array.from({ length: n2 }, () => rng.pick(pool)));

        if (isCompatible) {
          return oneOf(
            rng,
            t(
              `Given matrix $A$ of dimension $${m1} \\times ${n1}$ and matrix $B$ of dimension $${m2} \\times ${n2}$, is $A + B$ defined? If so, what are its dimensions?\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
              `给定维度为 $${m1} \\times ${n1}$ 的矩阵 $A$ 和维度为 $${m2} \\times ${n2}$ 的矩阵 $B$，$A + B$ 是否有定义？若是，其结果维度是多少？\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
            ),
            t(`Defined; the sum has dimensions $${m1} \\times ${n1}$.`, `有定义；和矩阵的维度为 $${m1} \\times ${n1}$。`),
            [
              t("Not defined; dimensions do not match.", "未定义；维度不匹配。"),
              t(`Defined; the sum has dimensions $${n1} \\times ${m1}$.`, `有定义；和矩阵的维度为 $${n1} \\times ${m1}$。`),
              t(
                `Defined; the sum has dimensions $${m1 + m2} \\times ${n1 + n2}$.`,
                `有定义；和矩阵的维度为 $${m1 + m2} \\times ${n1 + n2}$。`,
              ),
            ],
            t(
              `Both matrices have dimension $${m1} \\times ${n1}$. Since their dimensions match, $A + B$ is defined and produces an $${m1} \\times ${n1}$ matrix.`,
              `两个矩阵的维度均为 $${m1} \\times ${n1}$。由于维度完全相同，因此 $A + B$ 有定义，运算结果为 $${m1} \\times ${n1}$ 矩阵。`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `Given matrix $A$ of dimension $${m1} \\times ${n1}$ and matrix $B$ of dimension $${m2} \\times ${n2}$, is $A + B$ defined? If so, what are its dimensions?\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
            `给定维度为 $${m1} \\times ${n1}$ 的矩阵 $A$ 和维度为 $${m2} \\times ${n2}$ 的矩阵 $B$，$A + B$ 是否有定义？若是，其结果维度是多少？\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
          ),
          t("Not defined; matrices must have identical dimensions to be added.", "未定义；只有维度完全相同的矩阵才能进行相加。"),
          [
            t(`Defined; the sum has dimensions $${m1} \\times ${n2}$.`, `有定义；和矩阵的维度为 $${m1} \\times ${n2}$。`),
            t(`Defined; the sum has dimensions $${m2} \\times ${n1}$.`, `有定义；和矩阵的维度为 $${m2} \\times ${n1}$。`),
            t(
              `Defined; the sum has dimensions $${Math.max(m1, m2)} \\times ${Math.max(n1, n2)}$.`,
              `有定义；和矩阵的维度为 $${Math.max(m1, m2)} \\times ${Math.max(n1, n2)}$。`,
            ),
          ],
          t(
            `Matrix $A$ is $${m1} \\times ${n1}$ while matrix $B$ is $${m2} \\times ${n2}$. Because the dimensions are not identical, addition is not defined.`,
            `矩阵 $A$ 的维度为 $${m1} \\times ${n1}$，而矩阵 $B$ 的维度为 $${m2} \\times ${n2}$。由于维度不相同，加法运算未定义。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.21.4 Properties of Matrix Addition ────────────────────────────────────

/** propertiesOfMatrixAddition covers commutativity, associativity, and the additive identity O. */
export const propertiesOfMatrixAddition: TopicDef = {
  id: "properties-of-matrix-addition",
  title: t("Properties of Matrix Addition", "矩阵加法的运算律"),
  summary: t(
    "Understand the commutative and associative properties of matrix addition, and the additive identity zero matrix O.",
    "理解矩阵加法的交换律、结合律，以及加法单位元（零矩阵 O）。",
  ),
  prerequisites: ["adding-and-subtracting-matrices"],
  encompasses: [{ topic: "adding-and-subtracting-matrices", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.8", "CCSS.HSN.VM.C.10"],
  knowledgePoints: [
    {
      id: "commutative-and-associative-properties-of-matrix-addition",
      title: t("Commutative and associative properties", "矩阵加法的交换律与结合律"),
      explanation: t(
        "Matrix addition satisfies the commutative property $A + B = B + A$ and associative property $(A + B) + C = A + (B + C)$ for all matrices of the same dimension.",
        "同型矩阵的加法满足交换律 $A + B = B + A$ 与结合律 $(A + B) + C = A + (B + C)$。",
      ),
      generate(rng) {
        const pool = [-8, -6, -4, -3, -2, -1, 1, 2, 3, 4, 6, 8];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const B: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const C = matAdd(A, B);

        // Hide one entry in B as x
        const targetRow = rng.pick([0, 1]);
        const targetCol = rng.pick([0, 1]);
        const x = B[targetRow]![targetCol]!;

        const bDisplay: (readonly (number | string)[])[] = B.map((row, r) =>
          row.map((val, c) => (r === targetRow && c === targetCol ? "x" : val)),
        );

        return oneOf(
          rng,
          t(
            `Find the value of $x$ that satisfies the matrix equation:\n\n$$${matLatex(A)} + ${matLatex(bDisplay)} = ${matLatex(C)}$$`,
            `求满足下列矩阵方程的未知数 $x$ 的值：\n\n$$${matLatex(A)} + ${matLatex(bDisplay)} = ${matLatex(C)}$$`,
          ),
          t(`$${x}$`, `$${x}$`),
          [
            t(`$${-x}$`, `$${-x}$`),
            t(`$${x + 1}$`, `$${x + 1}$`),
            t(`$${x - 2}$`, `$${x - 2}$`),
            t(`$${C[targetRow]![targetCol]! + A[targetRow]![targetCol]!}$`, `$${C[targetRow]![targetCol]! + A[targetRow]![targetCol]!}$`),
          ],
          t(
            `From entrywise addition at row $${targetRow + 1}$, column $${targetCol + 1}$: $${A[targetRow]![targetCol]!} + x = ${C[targetRow]![targetCol]!}$, so $x = ${C[targetRow]![targetCol]!} - (${A[targetRow]![targetCol]!}) = ${x}$.`,
            `根据第 $${targetRow + 1}$ 行第 $${targetCol + 1}$ 列的对应元素相加关系：$${A[targetRow]![targetCol]!} + x = ${C[targetRow]![targetCol]!}$，解得 $x = ${C[targetRow]![targetCol]!} - (${A[targetRow]![targetCol]!}) = ${x}$。`,
          ),
        );
      },
    },
    {
      id: "additive-identity-and-additive-inverse",
      title: t("Additive identity and additive inverse", "加法单位元与加法逆元"),
      explanation: t(
        "The zero matrix $O$ has all entries equal to 0 and acts as the additive identity: $A + O = A$. The additive inverse of $A$ is $-A$, satisfying $A + (-A) = O$.",
        "零矩阵 $O$ 的所有元素均为 0，是矩阵加法的单位元，满足 $A + O = A$。矩阵 $A$ 的加法逆元是其相反矩阵 $-A$，满足 $A + (-A) = O$。",
      ),
      generate(rng) {
        const pool = [-9, -7, -5, -3, -2, 1, 2, 4, 6, 8];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const negA = matScale(-1, A);

        return oneOf(
          rng,
          t(
            `What is the additive inverse matrix $X$ such that $A + X = O$, where:\n\n$$A = ${matLatex(A)}, \\quad O = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$$`,
            `求满足 $A + X = O$ 的加法逆元矩阵 $X$（即相反矩阵 $-A$），其中：\n\n$$A = ${matLatex(A)}, \\quad O = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$$`,
          ),
          t(`$${matLatex(negA)}$`, `$${matLatex(negA)}$`),
          [
            t(`$${matLatex(A)}$`, `$${matLatex(A)}$`),
            t(`$${matLatex(matTranspose(A))}$`, `$${matLatex(matTranspose(A))}$`),
            t(
              `$${matLatex(negA.map((r, i) => r.map((v, j) => (i === 0 && j === 1 ? -v : v))))}$`,
              `$${matLatex(negA.map((r, i) => r.map((v, j) => (i === 0 && j === 1 ? -v : v))))}$`,
            ),
            t(`$\\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}$`, `$\\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix}$`),
          ],
          t(
            `The additive inverse of matrix $A$ is $-A$, obtained by negating every entry: $X = -A = ${matLatex(negA)}$.`,
            `矩阵 $A$ 的加法逆元是相反矩阵 $-A$，由将 $A$ 的每个元素取相反数得到：$X = -A = ${matLatex(negA)}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.21.5 Scalar Multiplication of Matrices ───────────────────────────────

/** scalarMultiplicationOfMatrices covers scaling each entry and distributive properties. */
export const scalarMultiplicationOfMatrices: TopicDef = {
  id: "scalar-multiplication-of-matrices",
  title: t("Scalar Multiplication of Matrices", "矩阵的数乘运算"),
  summary: t(
    "Multiply a matrix by a scalar by multiplying every entry, and apply distributive properties of scalar multiplication.",
    "通过将矩阵的每个元素乘以标量来进行数乘运算，并掌握数乘的分配律。",
  ),
  prerequisites: ["adding-and-subtracting-matrices"],
  encompasses: [{ topic: "adding-and-subtracting-matrices", weight: 0.4 }],
  xp: 11,
  standards: ["CCSS.HSN.VM.C.7", "CCSS.HSN.VM.C.8"],
  knowledgePoints: [
    {
      id: "computing-scalar-multiplication",
      title: t("Computing scalar multiples of matrices", "计算矩阵的数乘"),
      explanation: t(
        "To multiply a matrix $A$ by a scalar $k$, multiply every entry in $A$ by $k$: $(k A)_{ij} = k \\cdot a_{ij}$.",
        "用标量（实数）$k$ 乘以矩阵 $A$ 时，需要将矩阵 $A$ 中的每一个元素都乘以 $k$：$(k A)_{ij} = k \\cdot a_{ij}$。",
      ),
      generate(rng) {
        const k = rng.pick([-4, -3, -2, 2, 3, 4, 5]);
        const pool = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const kA = matScale(k, A);

        // Distractor: only scaled first row
        const row1Only: Mat = [kA[0]!, A[1]!];
        // Distractor: scaled with wrong sign
        const negKA = matScale(-k, A);
        // Distractor: added scalar instead of multiplying
        const addedK: Mat = A.map((row) => row.map((v) => v + k));

        return oneOf(
          rng,
          t(
            `Compute the scalar product $${k}A$, where:\n\n$$A = ${matLatex(A)}$$`,
            `计算数乘矩阵 $${k}A$，其中：\n\n$$A = ${matLatex(A)}$$`,
          ),
          t(`$${matLatex(kA)}$`, `$${matLatex(kA)}$`),
          [
            t(`$${matLatex(row1Only)}$`, `$${matLatex(row1Only)}$`),
            t(`$${matLatex(negKA)}$`, `$${matLatex(negKA)}$`),
            t(`$${matLatex(addedK)}$`, `$${matLatex(addedK)}$`),
            t(
              `$${matLatex(kA.map((r, i) => r.map((v, j) => (i === 1 && j === 1 ? v + 1 : v))))}$`,
              `$${matLatex(kA.map((r, i) => r.map((v, j) => (i === 1 && j === 1 ? v + 1 : v))))}$`,
            ),
          ],
          t(
            `Multiply every entry of $A$ by $${k}$:\n\n$$${k} ${matLatex(A)} = ${matLatex(kA)}$$`,
            `将矩阵 $A$ 中的每个元素都乘以 $${k}$：\n\n$$${k} ${matLatex(A)} = ${matLatex(kA)}$$`,
          ),
        );
      },
    },
    {
      id: "distributive-properties-of-scalar-multiplication",
      title: t("Distributive properties of scalar multiplication", "数乘矩阵的分配律与线性组合"),
      explanation: t(
        "Scalar multiplication distributes over matrix addition: $k(A + B) = kA + kB$, and $(c + d)A = cA + dA$. A linear combination of matrices is an expression of the form $c_1 A + c_2 B$.",
        "数乘对矩阵加法满足分配律：$k(A + B) = kA + kB$ 以及 $(c + d)A = cA + dA$。形如 $c_1 A + c_2 B$ 的式子称为矩阵的线性组合。",
      ),
      generate(rng) {
        const c1 = rng.pick([2, 3, 4]);
        const c2 = rng.pick([-3, -2, 2, 3]);
        const pool = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const B: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const ans = matAdd(matScale(c1, A), matScale(c2, B));
        const signStr = c2 < 0 ? `- ${-c2}` : `+ ${c2}`;

        // Distractor: flipped sign on c2
        const wrongSign = matAdd(matScale(c1, A), matScale(-c2, B));
        // Distractor: swapped coefficients
        const swapped = matAdd(matScale(c2, A), matScale(c1, B));

        return oneOf(
          rng,
          t(
            `Compute $${c1}A ${signStr} B$, where:\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
            `计算 $${c1}A ${signStr} B$，其中：\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
          ),
          t(`$${matLatex(ans)}$`, `$${matLatex(ans)}$`),
          [
            t(`$${matLatex(wrongSign)}$`, `$${matLatex(wrongSign)}$`),
            t(`$${matLatex(swapped)}$`, `$${matLatex(swapped)}$`),
            t(
              `$${matLatex(ans.map((r, i) => r.map((v, j) => (i === 0 && j === 0 ? v + 1 : v))))}$`,
              `$${matLatex(ans.map((r, i) => r.map((v, j) => (i === 0 && j === 0 ? v + 1 : v))))}$`,
            ),
          ],
          t(
            `Compute $${c1}A = ${matLatex(matScale(c1, A))}$ and $${c2}B = ${matLatex(matScale(c2, B))}$. Adding these gives $${matLatex(ans)}$.`,
            `计算 $${c1}A = ${matLatex(matScale(c1, A))}$ 与 $${c2}B = ${matLatex(matScale(c2, B))}$，将二者相加得到 $${matLatex(ans)}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.21.6 Zero, Square, Diagonal and Identity Matrices ─────────────────────

/** zeroSquareDiagonalAndIdentityMatrices covers special matrix definitions. */
export const zeroSquareDiagonalAndIdentityMatrices: TopicDef = {
  id: "zero-square-diagonal-and-identity-matrices",
  title: t("Zero, Square, Diagonal and Identity Matrices", "零矩阵、方阵、对角矩阵与单位矩阵"),
  summary: t(
    "Distinguish square, zero, diagonal, and identity matrices, and recognize their structural properties.",
    "区分方阵、零矩阵、对角矩阵与单位矩阵，并掌握其结构特征。",
  ),
  prerequisites: ["introduction-to-matrices"],
  encompasses: [{ topic: "introduction-to-matrices", weight: 0.4 }],
  xp: 11,
  standards: ["CCSS.HSN.VM.C.6", "CCSS.HSN.VM.C.10"],
  knowledgePoints: [
    {
      id: "classifying-special-matrices",
      title: t("Classifying special types of matrices", "特殊矩阵的分类与识别"),
      explanation: t(
        "A square matrix has $m = n$ (equal rows and columns). A diagonal matrix is a square matrix whose entries outside the main diagonal are all 0 ($a_{ij} = 0$ for $i \\ne j$). The identity matrix $I_n$ is a diagonal matrix whose main diagonal entries are all 1.",
        "方阵是行数等于列数（$m = n$）的矩阵。对角矩阵是主对角线之外所有元素均为 0（即当 $i \\ne j$ 时 $a_{ij} = 0$）的方阵。单位矩阵 $I_n$ 是主对角线上所有元素均为 1 的对角矩阵。",
      ),
      generate(rng) {
        const pool = [-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9];
        const kind = rng.pick([0, 1, 2]);

        if (kind === 0) {
          // Diagonal matrix with varied non-zero diagonal entries
          const d1 = rng.pick(pool);
          const d2 = rng.pick(pool);
          const A: Mat = [
            [d1, 0],
            [0, d2],
          ];
          const aLatex = matLatex(A);
          return oneOf(
            rng,
            t(
              `Which term best classifies the matrix $A$?\n\n$$A = ${aLatex}$$`,
              `下列哪个术语最准确地分类了矩阵 $A$？\n\n$$A = ${aLatex}$$`,
            ),
            t("Diagonal matrix", "对角矩阵"),
            [
              t("Identity matrix", "单位矩阵"),
              t("Zero matrix", "零矩阵"),
              t("Row matrix only", "仅为行矩阵"),
              t("Non-square matrix", "非方阵"),
            ],
            t(
              `Matrix $A$ is a square matrix whose off-diagonal entries are all 0, so it is a diagonal matrix.`,
              `矩阵 $A$ 是一个非对角线元素全为 0 的方阵，因此它是对角矩阵。`,
            ),
          );
        }

        if (kind === 1) {
          // General square matrix (non-diagonal)
          const A: Mat = [
            [rng.pick(pool), rng.pick(pool)],
            [rng.pick(pool), rng.pick(pool)],
          ];
          const aLatex = matLatex(A);
          return oneOf(
            rng,
            t(
              `Which term best classifies the matrix $A$?\n\n$$A = ${aLatex}$$`,
              `下列哪个术语最准确地分类了矩阵 $A$？\n\n$$A = ${aLatex}$$`,
            ),
            t("Square matrix (non-diagonal)", "方阵（非对角矩阵）"),
            [
              t("Diagonal matrix", "对角矩阵"),
              t("Identity matrix", "单位矩阵"),
              t("Zero matrix", "零矩阵"),
              t("Column vector only", "仅为列向量"),
            ],
            t(
              `Matrix $A$ has 2 rows and 2 columns ($2 \\times 2$), making it a square matrix, but its off-diagonal entries are non-zero so it is not diagonal.`,
              `矩阵 $A$ 包含 2 行 2 列（$2 \\times 2$），因此是方阵；但其非主对角线上有非零元素，所以不是对角矩阵。`,
            ),
          );
        }

        // Rectangular matrix
        const m = rng.pick([2, 3]);
        const n = rng.pick([3, 4].filter((c) => c !== m));
        const A: Mat = Array.from({ length: m }, () => Array.from({ length: n }, () => rng.pick(pool)));
        const aLatex = matLatex(A);
        return oneOf(
          rng,
          t(`Which term best classifies the matrix $A$?\n\n$$A = ${aLatex}$$`, `下列哪个术语最准确地分类了矩阵 $A$？\n\n$$A = ${aLatex}$$`),
          t(`Rectangular matrix of dimension $${m} \\times ${n}$`, `维度为 $${m} \\times ${n}$ 的矩形矩阵`),
          [t("Square matrix", "方阵"), t("Diagonal matrix", "对角矩阵"), t("Identity matrix", "单位矩阵"), t("Zero matrix", "零矩阵")],
          t(
            `Because the row count $${m}$ does not equal the column count $${n}$, matrix $A$ is a rectangular matrix, not a square or diagonal matrix.`,
            `因为行数 $${m}$ 不等于列数 $${n}$，所以矩阵 $A$ 是矩形矩阵，不是方阵或对角矩阵。`,
          ),
        );
      },
    },
    {
      id: "properties-of-identity-and-diagonal-matrices",
      title: t("Entries of diagonal and identity matrices", "对角矩阵与单位矩阵的未知数求解"),
      explanation: t(
        "For a matrix to be a diagonal matrix, all non-diagonal entries must be 0. For it to be the $2 \\times 2$ identity matrix $I_2$, the diagonal entries must equal 1 and the non-diagonal entries must equal 0.",
        "若一个方阵是对角矩阵，则其所有非对角线上的元素必须为 0。若为 $2 \\times 2$ 单位矩阵 $I_2$，则主对角线元素必须全为 1，非对角线元素必须全为 0。",
      ),
      generate(rng) {
        const c1 = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const c2 = rng.pick([-6, -5, -1, 1, 5, 6]);
        const d1 = rng.pick([2, 3, 5, 7]);
        const d2 = rng.pick([-4, -2, 4, 6]);

        // Matrix: [[d1, x - c1], [y + c2, d2]] is diagonal -> x = c1, y = -c2
        const signC1 = c1 < 0 ? `+ ${-c1}` : `- ${c1}`;
        const signC2 = c2 < 0 ? `- ${-c2}` : `+ ${c2}`;
        const M_display: (readonly (string | number)[])[] = [
          [d1, `x ${signC1}`],
          [`y ${signC2}`, d2],
        ];

        const xAns = c1;
        const yAns = -c2;

        return oneOf(
          rng,
          t(
            `For what values of $x$ and $y$ is the matrix $M$ a diagonal matrix?\n\n$$M = ${matLatex(M_display)}$$`,
            `当 $x$ 和 $y$ 为何值时，矩阵 $M$ 为对角矩阵？\n\n$$M = ${matLatex(M_display)}$$`,
          ),
          t(`$x = ${xAns}, \\; y = ${yAns}$`, `$x = ${xAns}, \\; y = ${yAns}$`),
          [
            t(`$x = ${-xAns}, \\; y = ${-yAns}$`, `$x = ${-xAns}, \\; y = ${-yAns}$`),
            t(`$x = ${xAns}, \\; y = ${-yAns}$`, `$x = ${xAns}, \\; y = ${-yAns}$`),
            t(`$x = ${-xAns}, \\; y = ${yAns}$`, `$x = ${-xAns}, \\; y = ${yAns}$`),
            t(`$x = 0, \\; y = 0$`, `$x = 0, \\; y = 0$`),
          ],
          t(
            `In a diagonal matrix, all off-diagonal entries are 0. Thus $x ${signC1} = 0 \\implies x = ${xAns}$, and $y ${signC2} = 0 \\implies y = ${yAns}$.`,
            `对角矩阵要求所有非对角线元素均为 0。因此 $x ${signC1} = 0 \\implies x = ${xAns}$，且 $y ${signC2} = 0 \\implies y = ${yAns}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.21.7 The Transpose of a Matrix ────────────────────────────────────────

/** theTransposeOfAMatrix covers transposition and symmetric matrices. */
export const theTransposeOfAMatrix: TopicDef = {
  id: "the-transpose-of-a-matrix",
  title: t("The Transpose of a Matrix", "矩阵的转置"),
  summary: t(
    "Find the transpose A^T of an m x n matrix, observe dimension reversal to n x m, and identify symmetric matrices.",
    "求 m x n 矩阵的转置矩阵 A^T，理解维度变为 n x m，并掌握对称矩阵的概念。",
  ),
  prerequisites: ["index-notation-for-matrices"],
  encompasses: [{ topic: "index-notation-for-matrices", weight: 0.4 }],
  xp: 11,
  standards: ["CCSS.HSN.VM.C.6"],
  knowledgePoints: [
    {
      id: "computing-the-transpose-of-a-matrix",
      title: t("Computing the transpose of a matrix", "求矩阵的转置"),
      explanation: t(
        "The transpose of an $m \\times n$ matrix $A$, denoted $A^T$, is the $n \\times m$ matrix formed by interchanging its rows and columns: $(A^T)_{ij} = a_{ji}$.",
        "$m \\times n$ 矩阵 $A$ 的转置记作 $A^T$，是一个 $n \\times m$ 矩阵，通过交换 $A$ 的行与列得到：$(A^T)_{ij} = a_{ji}$。",
      ),
      generate(rng) {
        const shapes: readonly (readonly [number, number])[] = [
          [2, 3],
          [3, 2],
          [2, 2],
          [1, 3],
          [3, 1],
        ];
        const [m, n] = rng.pick(shapes);
        const pool = [-8, -7, -5, -3, -2, -1, 1, 2, 3, 5, 7, 8];
        const A: Mat = Array.from({ length: m }, () => Array.from({ length: n }, () => rng.pick(pool)));
        const AT = matTranspose(A);

        const aLatex = matLatex(A);
        const atLatex = matLatex(AT);

        // Distractor: reversed rows
        const revRows = matTranspose(A.slice().reverse());
        // Distractor: negative transpose
        const negAT = matScale(-1, AT);

        return oneOf(
          rng,
          t(`Find the transpose $A^T$ of the matrix:\n\n$$A = ${aLatex}$$`, `求矩阵 $A$ 的转置矩阵 $A^T$：\n\n$$A = ${aLatex}$$`),
          t(`$${atLatex}$`, `$${atLatex}$`),
          [
            t(`$${aLatex}$`, `$${aLatex}$`),
            t(`$${matLatex(revRows)}$`, `$${matLatex(revRows)}$`),
            t(`$${matLatex(negAT)}$`, `$${matLatex(negAT)}$`),
          ],
          t(
            `Row $i$ of $A$ becomes column $i$ of $A^T$. The $${m} \\times ${n}$ matrix transposes into an $${n} \\times ${m}$ matrix: $A^T = ${atLatex}$.`,
            `矩阵 $A$ 的第 $i$ 行变为 $A^T$ 的第 $i$ 列。$${m} \\times ${n}$ 矩阵转置后成为 $${n} \\times ${m}$ 矩阵：$A^T = ${atLatex}$。`,
          ),
        );
      },
    },
    {
      id: "symmetric-and-skew-symmetric-matrices",
      title: t("Symmetric matrices and transpose properties", "对称矩阵与转置的性质"),
      explanation: t(
        "A square matrix $A$ is symmetric if $A^T = A$, meaning $a_{ij} = a_{ji}$ for all $i$ and $j$. For all compatible matrices, $(A^T)^T = A$ and $(A + B)^T = A^T + B^T$.",
        "若方阵 $A$ 满足 $A^T = A$，则称 $A$ 为对称矩阵，这意味着对所有的 $i$ 和 $j$ 均有 $a_{ij} = a_{ji}$。对于任何相容矩阵，恒有 $(A^T)^T = A$ 以及 $(A + B)^T = A^T + B^T$。",
      ),
      generate(rng) {
        const x = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const c1 = rng.pick([-3, -2, 2, 3]);
        const c2 = rng.pick([-6, -5, -4, -2, 2, 4, 5, 6]);
        const offDiagVal = c1 * x + c2;

        const a11 = rng.pick([1, 2, 3, 4, 5]);
        const a22 = rng.pick([-5, -4, -3, 6, 7]);

        const c1Str = c1 === 1 ? "" : c1 === -1 ? "-" : `${c1}`;
        const c2Str = c2 < 0 ? `- ${-c2}` : `+ ${c2}`;
        const expr = `${c1Str}x ${c2Str}`;

        const M: (readonly (string | number)[])[] = [
          [a11, expr],
          [offDiagVal, a22],
        ];

        return oneOf(
          rng,
          t(
            `Find the value of $x$ such that the matrix $A$ is symmetric:\n\n$$A = ${matLatex(M)}$$`,
            `求使得矩阵 $A$ 为对称矩阵的未知数 $x$ 的值：\n\n$$A = ${matLatex(M)}$$`,
          ),
          t(`$${x}$`, `$${x}$`),
          [t(`$${-x}$`, `$${-x}$`), t(`$${x + 1}$`, `$${x + 1}$`), t(`$${x - 2}$`, `$${x - 2}$`), t(`$${x + 3}$`, `$${x + 3}$`)],
          t(
            `For $A$ to be symmetric, $a_{12} = a_{21}$. Setting $${expr} = ${offDiagVal}$ yields $${c1}x = ${offDiagVal - c2}$, so $x = ${x}$.`,
            `对称矩阵要求 $a_{12} = a_{21}$。令 $${expr} = ${offDiagVal}$，得 $${c1}x = ${offDiagVal - c2}$，解得 $x = ${x}$。`,
          ),
        );
      },
    },
  ],
};

// ─── Module 6.22. Matrix Multiplication ─────────────────────────────────────

// ─── 6.22.1 Multiplying a Matrix by a Column Vector ─────────────────────────

/** multiplyingAMatrixByAColumnVector covers row-by-column product and linear combination of columns. */
export const multiplyingAMatrixByAColumnVector: TopicDef = {
  id: "multiplying-a-matrix-by-a-column-vector",
  title: t("Multiplying a Matrix by a Column Vector", "矩阵与列向量的乘法"),
  summary: t(
    "Multiply a matrix by a column vector using the row-by-column rule and view it as a linear combination of columns.",
    "通过行与列对应相乘求和计算矩阵与列向量的乘积，并理解其为列向量的线性组合。",
  ),
  prerequisites: ["scalar-multiplication-of-matrices"],
  encompasses: [{ topic: "scalar-multiplication-of-matrices", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.HSN.VM.C.8"],
  knowledgePoints: [
    {
      id: "computing-matrix-vector-products",
      title: t("Computing matrix-vector products", "计算矩阵与列向量的乘积"),
      explanation: t(
        "To multiply an $m \\times n$ matrix $A$ by an $n \\times 1$ column vector $\\mathbf{x}$, take the dot product of each row of $A$ with $\\mathbf{x}$:\n\n$$(A \\mathbf{x})_i = \\sum_{j=1}^n a_{ij} x_j$$",
        "一个 $m \\times n$ 矩阵 $A$ 与 $n \\times 1$ 列向量 $\\mathbf{x}$ 相乘时，用 $A$ 的每一行与 $\\mathbf{x}$ 作点积（对应元素相乘再相加）：\n\n$$(A \\mathbf{x})_i = \\sum_{j=1}^n a_{ij} x_j$$",
      ),
      generate(rng) {
        const pool = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const v = [rng.pick(pool), rng.pick(pool)];
        const res0 = A[0]![0]! * v[0]! + A[0]![1]! * v[1]!;
        const res1 = A[1]![0]! * v[0]! + A[1]![1]! * v[1]!;

        const aLatex = matLatex(A);
        const vLatex = colVecLatex(v);
        const ansLatex = colVecLatex([res0, res1]);

        return oneOf(
          rng,
          t(
            `Compute the matrix-vector product $A \\mathbf{v}$, where:\n\n$$A = ${aLatex}, \\quad \\mathbf{v} = ${vLatex}$$`,
            `计算矩阵与列向量的乘积 $A \\mathbf{v}$，其中：\n\n$$A = ${aLatex}, \\quad \\mathbf{v} = ${vLatex}$$`,
          ),
          t(`$${ansLatex}$`, `$${ansLatex}$`),
          [
            t(`$${colVecLatex([res1, res0])}$`, `$${colVecLatex([res1, res0])}$`),
            t(`$${colVecLatex([-res0, res1])}$`, `$${colVecLatex([-res0, res1])}$`),
            t(`$\\begin{pmatrix} ${res0} & ${res1} \\end{pmatrix}$`, `$\\begin{pmatrix} ${res0} & ${res1} \\end{pmatrix}$`),
            t(`$${colVecLatex([res0 + 2, res1 - 1])}$`, `$${colVecLatex([res0 + 2, res1 - 1])}$`),
          ],
          t(
            `Multiply row by column:\n\n$$(A\\mathbf{v})_1 = (${A[0]![0]!})(${v[0]!}) + (${A[0]![1]!})(${v[1]!}) = ${res0}$$\n$$(A\\mathbf{v})_2 = (${A[1]![0]!})(${v[0]!}) + (${A[1]![1]!})(${v[1]!}) = ${res1}$$\n\nResult is $${ansLatex}$.`,
            `按行与列相乘求和：\n\n$$(A\\mathbf{v})_1 = (${A[0]![0]!})(${v[0]!}) + (${A[0]![1]!})(${v[1]!}) = ${res0}$$\n$$(A\\mathbf{v})_2 = (${A[1]![0]!})(${v[0]!}) + (${A[1]![1]!})(${v[1]!}) = ${res1}$$\n\n结果为 $${ansLatex}$。`,
          ),
        );
      },
    },
    {
      id: "matrix-vector-product-as-linear-combination",
      title: t("Matrix-vector products as linear combinations of columns", "矩阵与列向量乘积的列线性组合形式"),
      explanation: t(
        "A matrix-vector product $A \\mathbf{x}$ equals a linear combination of the column vectors of $A$ scaled by the entries of $\\mathbf{x}$:\n\n$$A \\mathbf{x} = x_1 \\mathbf{a}_1 + x_2 \\mathbf{a}_2 + \\dots + x_n \\mathbf{a}_n$$",
        "矩阵与列向量的乘积 $A \\mathbf{x}$ 等于矩阵 $A$ 的各列向量以 $\\mathbf{x}$ 的分量为权重的线性组合：\n\n$$A \\mathbf{x} = x_1 \\mathbf{a}_1 + x_2 \\mathbf{a}_2 + \\dots + x_n \\mathbf{a}_n$$",
      ),
      generate(rng) {
        const pool = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
        const a11 = rng.pick(pool);
        const a12 = rng.pick(pool);
        const a21 = rng.pick(pool);
        const a22 = rng.pick(pool);
        const A: Mat = [
          [a11, a12],
          [a21, a22],
        ];

        const col1 = colVecLatex([a11, a21]);
        const col2 = colVecLatex([a12, a22]);
        const row1 = colVecLatex([a11, a12]);
        const row2 = colVecLatex([a21, a22]);

        return oneOf(
          rng,
          t(
            `Express the product $A \\begin{pmatrix} x_1 \\\\ x_2 \\end{pmatrix}$ as a linear combination of the columns of $A$, where:\n\n$$A = ${matLatex(A)}$$`,
            `将矩阵乘积 $A \\begin{pmatrix} x_1 \\\\ x_2 \\end{pmatrix}$ 表示为 $A$ 的列向量的线性组合，其中：\n\n$$A = ${matLatex(A)}$$`,
          ),
          t(`$x_1 ${col1} + x_2 ${col2}$`, `$x_1 ${col1} + x_2 ${col2}$`),
          [
            t(`$x_1 ${col2} + x_2 ${col1}$`, `$x_1 ${col2} + x_2 ${col1}$`),
            t(`$x_1 ${row1} + x_2 ${row2}$`, `$x_1 ${row1} + x_2 ${row2}$`),
            t(`$x_2 ${row1} + x_1 ${row2}$`, `$x_2 ${row1} + x_1 ${row2}$`),
          ],
          t(
            `The columns of $A$ are $\\mathbf{a}_1 = ${col1}$ and $\\mathbf{a}_2 = ${col2}$. Multiplying by $\\begin{pmatrix} x_1 \\\\ x_2 \\end{pmatrix}$ weights these columns: $x_1 \\mathbf{a}_1 + x_2 \\mathbf{a}_2 = x_1 ${col1} + x_2 ${col2}$.`,
            `矩阵 $A$ 的两列分别为 $\\mathbf{a}_1 = ${col1}$ 和 $\\mathbf{a}_2 = ${col2}$。乘以 $\\begin{pmatrix} x_1 \\\\ x_2 \\end{pmatrix}$ 即为这两列的加权和：$x_1 \\mathbf{a}_1 + x_2 \\mathbf{a}_2 = x_1 ${col1} + x_2 ${col2}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.22.2 Multiplying Square Matrices ─────────────────────────────────────

/** multiplyingSquareMatrices covers 2x2 matrix multiplication. */
export const multiplyingSquareMatrices: TopicDef = {
  id: "multiplying-square-matrices",
  title: t("Multiplying Square Matrices", "方阵相乘"),
  summary: t("Multiply 2x2 square matrices using row-by-column dot products.", "通过行乘列点积的方法计算 2x2 方阵的乘积。"),
  prerequisites: ["multiplying-a-matrix-by-a-column-vector"],
  encompasses: [{ topic: "multiplying-a-matrix-by-a-column-vector", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.HSN.VM.C.8"],
  knowledgePoints: [
    {
      id: "multiplying-2x2-matrices",
      title: t("Multiplying 2x2 matrices", "二阶方阵相乘"),
      explanation: t(
        "To multiply two $2 \\times 2$ matrices $A$ and $B$, entry $(AB)_{ij}$ is the dot product of row $i$ of $A$ and column $j$ of $B$:\n\n$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix} = \\begin{pmatrix} ae + bg & af + bh \\\\ ce + dg & cf + dh \\end{pmatrix}$$",
        "两个 $2 \\times 2$ 矩阵 $A$ 与 $B$ 相乘时，乘积中第 $i$ 行第 $j$ 列的元素是 $A$ 的第 $i$ 行与 $B$ 的第 $j$ 列的点积：\n\n$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix} = \\begin{pmatrix} ae + bg & af + bh \\\\ ce + dg & cf + dh \\end{pmatrix}$$",
      ),
      generate(rng) {
        const pool = [-4, -3, -2, -1, 1, 2, 3, 4];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const B: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const AB = matMul(A, B);
        const BA = matMul(B, A);
        // Hadamard elementwise product
        const hadamard: Mat = [
          [A[0]![0]! * B[0]![0]!, A[0]![1]! * B[0]![1]!],
          [A[1]![0]! * B[1]![0]!, A[1]![1]! * B[1]![1]!],
        ];

        return oneOf(
          rng,
          t(
            `Compute the matrix product $AB$, where:\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
            `计算矩阵乘积 $AB$，其中：\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
          ),
          t(`$${matLatex(AB)}$`, `$${matLatex(AB)}$`),
          [
            t(`$${matLatex(BA)}$`, `$${matLatex(BA)}$`),
            t(`$${matLatex(hadamard)}$`, `$${matLatex(hadamard)}$`),
            t(
              `$${matLatex(AB.map((r, i) => r.map((v, j) => (i === 0 && j === 1 ? -v : v))))}$`,
              `$${matLatex(AB.map((r, i) => r.map((v, j) => (i === 0 && j === 1 ? -v : v))))}$`,
            ),
          ],
          t(
            `Calculate each entry via row-by-column inner product:\n\n$$(AB)_{11} = (${A[0]![0]!})(${B[0]![0]!}) + (${A[0]![1]!})(${B[1]![0]!}) = ${AB[0]![0]!}$$\n$$(AB)_{12} = (${A[0]![0]!})(${B[0]![1]!}) + (${A[0]![1]!})(${B[1]![1]!}) = ${AB[0]![1]!}$$\n$$(AB)_{21} = (${A[1]![0]!})(${B[0]![0]!}) + (${A[1]![1]!})(${B[1]![0]!}) = ${AB[1]![0]!}$$\n$$(AB)_{22} = (${A[1]![0]!})(${B[0]![1]!}) + (${A[1]![1]!})(${B[1]![1]!}) = ${AB[1]![1]!}$$\n\nResult is $${matLatex(AB)}$.`,
            `按行与列相乘求和：\n\n$$(AB)_{11} = (${A[0]![0]!})(${B[0]![0]!}) + (${A[0]![1]!})(${B[1]![0]!}) = ${AB[0]![0]!}$$\n$$(AB)_{12} = (${A[0]![0]!})(${B[0]![1]!}) + (${A[0]![1]!})(${B[1]![1]!}) = ${AB[0]![1]!}$$\n$$(AB)_{21} = (${A[1]![0]!})(${B[0]![0]!}) + (${A[1]![1]!})(${B[1]![0]!}) = ${AB[1]![0]!}$$\n$$(AB)_{22} = (${A[1]![0]!})(${B[0]![1]!}) + (${A[1]![1]!})(${B[1]![1]!}) = ${AB[1]![1]!}$$\n\n最终结果为 $${matLatex(AB)}$。`,
          ),
        );
      },
    },
    {
      id: "specific-entries-in-matrix-products",
      title: t("Finding specific entries in square matrix products", "计算方阵乘积中的特定元素"),
      explanation: t(
        "To find a single entry $(AB)_{ij}$ of a matrix product, you only need to multiply row $i$ of matrix $A$ by column $j$ of matrix $B$, without computing the entire product.",
        "要求矩阵乘积中的某一指定元素 $(AB)_{ij}$，只需用矩阵 $A$ 的第 $i$ 行与矩阵 $B$ 的第 $j$ 列相乘求和，无需算出整个乘积矩阵。",
      ),
      generate(rng) {
        const pool = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const B: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const i = rng.pick([1, 2]);
        const j = rng.pick([1, 2]);
        const AB = matMul(A, B);
        const val = AB[i - 1]![j - 1]!;
        const swappedVal = AB[j - 1]![i - 1]!;

        return oneOf(
          rng,
          t(
            `For the matrices $A$ and $B$, compute the entry in row $${i}$, column $${j}$ of the product $C = AB$:\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
            `对于矩阵 $A$ 与 $B$，计算乘积 $C = AB$ 中位于第 $${i}$ 行第 $${j}$ 列的元素 $c_{${i}${j}}$：\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
          ),
          t(`$${val}$`, `$${val}$`),
          [
            t(`$${swappedVal}$`, `$${swappedVal}$`),
            t(`$${-val}$`, `$${-val}$`),
            t(`$${val + 2}$`, `$${val + 2}$`),
            t(`$${val - 3}$`, `$${val - 3}$`),
          ],
          t(
            `Take row $${i}$ of $A$ and column $${j}$ of $B$: $(${A[i - 1]![0]!})(${B[0]![j - 1]!}) + (${A[i - 1]![1]!})(${B[1]![j - 1]!}) = ${val}$.`,
            `取 $A$ 的第 $${i}$ 行与 $B$ 的第 $${j}$ 列相乘求和：$(${A[i - 1]![0]!})(${B[0]![j - 1]!}) + (${A[i - 1]![1]!})(${B[1]![j - 1]!}) = ${val}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.22.3 Conformability for Matrix Multiplication ─────────────────────────

/** conformabilityForMatrixMultiplication covers inner dimension conditions. */
export const conformabilityForMatrixMultiplication: TopicDef = {
  id: "conformability-for-matrix-multiplication",
  title: t("Conformability for Matrix Multiplication", "矩阵乘法的相容性与维度条件"),
  summary: t(
    "Determine whether two matrices can be multiplied by checking matching inner dimensions, and find the dimension of the product.",
    "通过判断内侧维度是否相等来确定两矩阵是否可乘，并求出乘积矩阵的维度。",
  ),
  prerequisites: ["multiplying-square-matrices"],
  encompasses: [{ topic: "multiplying-square-matrices", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.HSN.VM.C.8"],
  knowledgePoints: [
    {
      id: "dimension-conformability-conditions",
      title: t("Determining if a matrix product is defined", "判断矩阵乘法是否相容可行"),
      explanation: t(
        "Matrix multiplication $AB$ is defined if and only if the number of columns in $A$ equals the number of rows in $B$. That is, if $A$ is $m \\times k$ and $B$ is $k \\times n$, the product $AB$ is defined and has dimension $m \\times n$.",
        "矩阵乘法 $AB$ 有定义当且仅当矩阵 $A$ 的列数等于矩阵 $B$ 的行数（内侧维度相等）。即若 $A$ 为 $m \\times k$，而 $B$ 为 $k \\times n$，则乘积 $AB$ 有定义，其维度为 $m \\times n$。",
      ),
      generate(rng) {
        const isDefined = rng.bool();
        const m = rng.pick([2, 3, 4]);
        const k = rng.pick([1, 2, 3, 4]);
        const n = rng.pick([1, 2, 3, 4]);
        const p = isDefined ? k : rng.pick([1, 2, 3, 4].filter((x) => x !== k));

        if (isDefined) {
          return oneOf(
            rng,
            t(
              `Matrix $A$ has dimensions $${m} \\times ${k}$ and matrix $B$ has dimensions $${p} \\times ${n}$. Is the product $AB$ defined? If so, what are its dimensions?`,
              `矩阵 $A$ 的维度为 $${m} \\times ${k}$，矩阵 $B$ 的维度为 $${p} \\times ${n}$。乘积 $AB$ 是否有定义？若是，其结果维度是多少？`,
            ),
            t(`Defined; dimensions of $AB$ are $${m} \\times ${n}$.`, `有定义；$AB$ 的维度为 $${m} \\times ${n}$。`),
            [
              t("Not defined; inner dimensions do not match.", "未定义；内侧维度不匹配。"),
              t(`Defined; dimensions of $AB$ are $${k} \\times ${p}$.`, `有定义；$AB$ 的维度为 $${k} \\times ${p}$。`),
              t(`Defined; dimensions of $AB$ are $${n} \\times ${m}$.`, `有定义；$AB$ 的维度为 $${n} \\times ${m}$。`),
            ],
            t(
              `The inner dimensions match ($${k} = ${p}$). Therefore $AB$ is defined, with outer dimensions $${m} \\times ${n}$.`,
              `内侧维度相等（$${k} = ${p}$）。因此 $AB$ 有定义，其外侧维度决定了结果矩阵维度为 $${m} \\times ${n}$。`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `Matrix $A$ has dimensions $${m} \\times ${k}$ and matrix $B$ has dimensions $${p} \\times ${n}$. Is the product $AB$ defined? If so, what are its dimensions?`,
            `矩阵 $A$ 的维度为 $${m} \\times ${k}$，矩阵 $B$ 的维度为 $${p} \\times ${n}$。乘积 $AB$ 是否有定义？若是，其结果维度是多少？`,
          ),
          t("Not defined; the number of columns in $A$ does not equal the number of rows in $B$.", "未定义；$A$ 的列数不等于 $B$ 的行数。"),
          [
            t(`Defined; dimensions of $AB$ are $${m} \\times ${n}$.`, `有定义；$AB$ 的维度为 $${m} \\times ${n}$。`),
            t(`Defined; dimensions of $AB$ are $${k} \\times ${p}$.`, `有定义；$AB$ 的维度为 $${k} \\times ${p}$。`),
            t(`Defined; dimensions of $AB$ are $${p} \\times ${k}$.`, `有定义；$AB$ 的维度为 $${p} \\times ${k}$。`),
          ],
          t(
            `Matrix $A$ has $${k}$ columns, but matrix $B$ has $${p}$ rows. Because $${k} \\ne ${p}$, the inner dimensions do not match and $AB$ is not defined.`,
            `矩阵 $A$ 有 $${k}$ 列，而矩阵 $B$ 有 $${p}$ 行。由于 $${k} \\ne ${p}$，内侧维度不相等，故乘积 $AB$ 未定义。`,
          ),
        );
      },
    },
    {
      id: "multiplication-order-and-dimension-compatibility",
      title: t("Order and compatibility of products", "矩阵乘法次序与相容性"),
      explanation: t(
        "Even when $AB$ is defined, $BA$ might not be defined. If $A$ is $m \\times n$ and $B$ is $n \\times p$ with $m \\ne p$, $AB$ is defined ($m \\times p$), but $BA$ is not defined because $p \\ne m$.",
        "即使乘积 $AB$ 有定义，$BA$ 也不一定有定义。若 $A$ 为 $m \\times n$ 而 $B$ 为 $n \\times p$（且 $m \\ne p$），则 $AB$ 有定义（为 $m \\times p$），但 $BA$ 未定义（因为 $p \\ne m$）。",
      ),
      generate(rng) {
        const m = rng.pick([2, 3, 4, 5, 6]);
        const n = rng.pick([2, 3, 4, 5, 6]);
        const p = rng.pick([1, 2, 3, 4, 5, 6, 7].filter((x) => x !== m));

        return oneOf(
          rng,
          t(
            `Matrix $A$ has dimensions $${m} \\times ${n}$ and matrix $B$ has dimensions $${n} \\times ${p}$. Which statement correctly describes the products $AB$ and $BA$?`,
            `矩阵 $A$ 的维度为 $${m} \\times ${n}$，矩阵 $B$ 的维度为 $${n} \\times ${p}$。下列哪一陈述正确描述了乘积 $AB$ 和 $BA$？`,
          ),
          t(
            `$AB$ is defined (dimension $${m} \\times ${p}$), but $BA$ is not defined.`,
            `$AB$ 有定义（维度为 $${m} \\times ${p}$），但 $BA$ 未定义。`,
          ),
          [
            t("Both $AB$ and $BA$ are defined.", "乘积 $AB$ 与 $BA$ 均有定义。"),
            t("Neither $AB$ nor $BA$ is defined.", "$AB$ 与 $BA$ 均未定义。"),
            t(
              `$BA$ is defined (dimension $${p} \\times ${m}$), but $AB$ is not defined.`,
              `$BA$ 有定义（维度为 $${p} \\times ${m}$），但 $AB$ 未定义。`,
            ),
          ],
          t(
            `For $AB$: inner dimensions match ($${n} = ${n}$), so $AB$ is defined with dimensions $${m} \\times ${p}$. For $BA$: dimensions are $(n \\times p)(m \\times n)$, and inner dimensions $${p} \\ne ${m}$, so $BA$ is not defined.`,
            `对于 $AB$：内侧维度匹配（$${n} = ${n}$），故 $AB$ 有定义且维度为 $${m} \\times ${p}$。对于 $BA$：维度为 $(n \\times p)(m \\times n)$，内侧维度 $${p} \\ne ${m}$，因此 $BA$ 未定义。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.22.4 Multiplying Matrices ─────────────────────────────────────────────

/** multiplyingMatrices covers general rectangular matrix multiplication. */
export const multiplyingMatrices: TopicDef = {
  id: "multiplying-matrices",
  title: t("Multiplying Matrices", "一般矩阵乘法"),
  summary: t(
    "Multiply rectangular matrices of compatible dimensions using the general row-by-column method.",
    "通过通用的行乘列方法计算相容矩形矩阵的乘积。",
  ),
  prerequisites: ["conformability-for-matrix-multiplication"],
  encompasses: [{ topic: "conformability-for-matrix-multiplication", weight: 0.4 }],
  xp: 13,
  standards: ["CCSS.HSN.VM.C.8"],
  knowledgePoints: [
    {
      id: "multiplying-rectangular-matrices",
      title: t("Multiplying rectangular matrices", "矩形矩阵相乘"),
      explanation: t(
        "To multiply an $m \\times k$ matrix $A$ by a $k \\times n$ matrix $B$, each entry $(AB)_{ij}$ is the sum of products of corresponding entries from row $i$ of $A$ and column $j$ of $B$:\n\n$$(AB)_{ij} = \\sum_{r=1}^k a_{ir} b_{rj}$$",
        "将 $m \\times k$ 矩阵 $A$ 与 $k \\times n$ 矩阵 $B$ 相乘时，乘积中第 $i$ 行第 $j$ 列的元素为 $A$ 的第 $i$ 行与 $B$ 的第 $j$ 列对应元素的乘积之和：\n\n$$(AB)_{ij} = \\sum_{r=1}^k a_{ir} b_{rj}$$",
      ),
      generate(rng) {
        const pool = [-3, -2, -1, 1, 2, 3];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
        ];
        const B: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const C = matMul(A, B);

        return oneOf(
          rng,
          t(
            `Compute the matrix product $AB$, where:\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
            `计算矩阵乘积 $AB$，其中：\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
          ),
          t(`$${matLatex(C)}$`, `$${matLatex(C)}$`),
          [
            t(`$${matLatex(matTranspose(C))}$`, `$${matLatex(matTranspose(C))}$`),
            t(
              `$${matLatex(C.map((r, i) => r.map((v, j) => (i === 0 && j === 0 ? v + 2 : v))))}$`,
              `$${matLatex(C.map((r, i) => r.map((v, j) => (i === 0 && j === 0 ? v + 2 : v))))}$`,
            ),
            t(
              `$${matLatex(C.map((r, i) => r.map((v, j) => (i === 1 && j === 1 ? -v : v))))}$`,
              `$${matLatex(C.map((r, i) => r.map((v, j) => (i === 1 && j === 1 ? -v : v))))}$`,
            ),
          ],
          t(
            `Matrix $A$ is $2 \\times 3$ and $B$ is $3 \\times 2$, producing a $2 \\times 2$ product:\n\n$$AB = ${matLatex(C)}$$`,
            `矩阵 $A$ 维度为 $2 \\times 3$，$B$ 维度为 $3 \\times 2$，乘积为 $2 \\times 2$ 矩阵：\n\n$$AB = ${matLatex(C)}$$`,
          ),
        );
      },
    },
    {
      id: "row-by-column-entry-calculations",
      title: t("Calculating specific entries in general matrix products", "计算一般矩阵乘积中的指定元素"),
      explanation: t(
        "To evaluate entry $(AB)_{ij}$ of a matrix product, take the dot product of the $i$-th row of $A$ and the $j$-th column of $B$.",
        "要计算矩阵乘积中的元素 $(AB)_{ij}$，只需对 $A$ 的第 $i$ 行与 $B$ 的第 $j$ 列进行对应相乘求和。",
      ),
      generate(rng) {
        const pool = [-4, -3, -2, -1, 1, 2, 3, 4];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
        ];
        const B: Mat = [
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
        ];
        const i = rng.pick([1, 2]);
        const j = rng.pick([1, 2, 3]);
        const AB = matMul(A, B);
        const val = AB[i - 1]![j - 1]!;

        return oneOf(
          rng,
          t(
            `Given matrices $A$ ($2 \\times 3$) and $B$ ($3 \\times 3$), find the entry in row $${i}$, column $${j}$ of $AB$:\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
            `给定矩阵 $A$（$2 \\times 3$）与 $B$（$3 \\times 3$），求乘积 $AB$ 中位于第 $${i}$ 行第 $${j}$ 列的元素：\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
          ),
          t(`$${val}$`, `$${val}$`),
          [
            t(`$${-val}$`, `$${-val}$`),
            t(`$${val + 3}$`, `$${val + 3}$`),
            t(`$${val - 2}$`, `$${val - 2}$`),
            t(`$${val + 1}$`, `$${val + 1}$`),
          ],
          t(
            `Multiply row $${i}$ of $A$ by column $${j}$ of $B$:\n\n$$(${A[i - 1]![0]!})(${B[0]![j - 1]!}) + (${A[i - 1]![1]!})(${B[1]![j - 1]!}) + (${A[i - 1]![2]!})(${B[2]![j - 1]!}) = ${val}$$`,
            `将 $A$ 的第 $${i}$ 行与 $B$ 的第 $${j}$ 列对应相乘求和：\n\n$$(${A[i - 1]![0]!})(${B[0]![j - 1]!}) + (${A[i - 1]![1]!})(${B[1]![j - 1]!}) + (${A[i - 1]![2]!})(${B[2]![j - 1]!}) = ${val}$$`,
          ),
        );
      },
    },
  ],
};

// ─── 6.22.5 Powers of Matrices ───────────────────────────────────────────────

/** powersOfMatrices covers positive integer powers of square matrices. */
export const powersOfMatrices: TopicDef = {
  id: "powers-of-matrices",
  title: t("Powers of Matrices", "方阵的幂"),
  summary: t(
    "Compute positive integer powers A^2, A^3 of square matrices, including diagonal and shear matrices.",
    "计算方阵的正整数次幂 A^2、A^3，包括对角矩阵和特殊剪切矩阵的幂。",
  ),
  prerequisites: ["multiplying-square-matrices"],
  encompasses: [{ topic: "multiplying-square-matrices", weight: 0.4 }],
  xp: 13,
  standards: ["CCSS.HSN.VM.C.8"],
  knowledgePoints: [
    {
      id: "computing-powers-of-2x2-matrices",
      title: t("Squaring and cubing 2x2 matrices", "二阶方阵的平方与立方计算"),
      explanation: t(
        "For a square matrix $A$, powers are defined by repeated multiplication: $A^2 = A \\cdot A$, $A^3 = A^2 \\cdot A$. Note that $A^2$ is NOT obtained by simply squaring each individual entry.",
        "对于方阵 $A$，其正整数次幂定义为矩阵的连续乘法：$A^2 = A \\cdot A$，$A^3 = A^2 \\cdot A$。特别注意：$A^2$ 绝不是简单地把每个元素分别平方。",
      ),
      generate(rng) {
        const pool = [-3, -2, -1, 1, 2, 3];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const A2 = matMul(A, A);
        // Distractor: entrywise square
        const entrySq: Mat = [
          [A[0]![0]! ** 2, A[0]![1]! ** 2],
          [A[1]![0]! ** 2, A[1]![1]! ** 2],
        ];
        // Distractor: 2 * A
        const twoA = matScale(2, A);

        return oneOf(
          rng,
          t(`Compute the matrix square $A^2$, where:\n\n$$A = ${matLatex(A)}$$`, `计算方阵的平方 $A^2$，其中：\n\n$$A = ${matLatex(A)}$$`),
          t(`$${matLatex(A2)}$`, `$${matLatex(A2)}$`),
          [
            t(`$${matLatex(entrySq)}$`, `$${matLatex(entrySq)}$`),
            t(`$${matLatex(twoA)}$`, `$${matLatex(twoA)}$`),
            t(
              `$${matLatex(A2.map((r, i) => r.map((v, j) => (i === 0 && j === 1 ? -v : v))))}$`,
              `$${matLatex(A2.map((r, i) => r.map((v, j) => (i === 0 && j === 1 ? -v : v))))}$`,
            ),
          ],
          t(
            `Multiply $A$ by itself using matrix multiplication: $A^2 = A \\cdot A = ${matLatex(A2)}$.`,
            `用矩阵乘法计算 $A$ 与自身的乘积：$A^2 = A \\cdot A = ${matLatex(A2)}$。`,
          ),
        );
      },
    },
    {
      id: "powers-of-diagonal-and-pattern-matrices",
      title: t("Powers of diagonal and pattern matrices", "对角矩阵与特殊矩阵的幂"),
      explanation: t(
        "For a diagonal matrix $D = \\begin{pmatrix} d_1 & 0 \\\\ 0 & d_2 \\end{pmatrix}$, powers are given by $D^k = \\begin{pmatrix} d_1^k & 0 \\\\ 0 & d_2^k \\end{pmatrix}$. For a shear matrix $S = \\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}$, $S^k = \\begin{pmatrix} 1 & k a \\\\ 0 & 1 \\end{pmatrix}$.",
        "对于对角矩阵 $D = \\begin{pmatrix} d_1 & 0 \\\\ 0 & d_2 \\end{pmatrix}$，其 $k$ 次幂为 $D^k = \\begin{pmatrix} d_1^k & 0 \\\\ 0 & d_2^k \\end{pmatrix}$。对于剪切矩阵 $S = \\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}$，有 $S^k = \\begin{pmatrix} 1 & k a \\\\ 0 & 1 \\end{pmatrix}$。",
      ),
      generate(rng) {
        const isDiag = rng.bool();
        if (isDiag) {
          const d1 = rng.pick([-3, -2, 2, 3]);
          const d2 = rng.pick([-2, 2, 3]);
          const k = rng.pick([3, 4, 5]);
          const D: Mat = [
            [d1, 0],
            [0, d2],
          ];
          const Dk: Mat = [
            [d1 ** k, 0],
            [0, d2 ** k],
          ];

          return oneOf(
            rng,
            t(
              `Compute $D^{${k}}$ for the diagonal matrix:\n\n$$D = ${matLatex(D)}$$`,
              `计算对角矩阵的 $${k}$ 次幂 $D^{${k}}$：\n\n$$D = ${matLatex(D)}$$`,
            ),
            t(`$${matLatex(Dk)}$`, `$${matLatex(Dk)}$`),
            [
              t(
                `$${matLatex([
                  [k * d1, 0],
                  [0, k * d2],
                ])}$`,
                `$${matLatex([
                  [k * d1, 0],
                  [0, k * d2],
                ])}$`,
              ),
              t(
                `$${matLatex([
                  [d1 ** k, 1],
                  [0, d2 ** k],
                ])}$`,
                `$${matLatex([
                  [d1 ** k, 1],
                  [0, d2 ** k],
                ])}$`,
              ),
              t(
                `$${matLatex([
                  [d1, 0],
                  [0, d2],
                ])}$`,
                `$${matLatex([
                  [d1, 0],
                  [0, d2],
                ])}$`,
              ),
            ],
            t(
              `For any diagonal matrix, $D^k$ is obtained by raising each diagonal entry to the power $k$:\n\n$$D^{${k}} = \\begin{pmatrix} (${d1})^{${k}} & 0 \\\\ 0 & (${d2})^{${k}} \\end{pmatrix} = ${matLatex(Dk)}$$`,
              `对角矩阵的幂运算等价于对主对角线上的每个元素分别求幂：\n\n$$D^{${k}} = \\begin{pmatrix} (${d1})^{${k}} & 0 \\\\ 0 & (${d2})^{${k}} \\end{pmatrix} = ${matLatex(Dk)}$$`,
            ),
          );
        }

        const a = rng.pick([-4, -3, -2, 2, 3, 4]);
        const k = rng.pick([4, 5, 10, 20]);
        const S: Mat = [
          [1, a],
          [0, 1],
        ];
        const Sk: Mat = [
          [1, k * a],
          [0, 1],
        ];

        return oneOf(
          rng,
          t(
            `Compute $S^{${k}}$ for the upper triangular matrix:\n\n$$S = ${matLatex(S)}$$`,
            `计算上三角矩阵的 $${k}$ 次幂 $S^{${k}}$：\n\n$$S = ${matLatex(S)}$$`,
          ),
          t(`$${matLatex(Sk)}$`, `$${matLatex(Sk)}$`),
          [
            t(
              `$${matLatex([
                [1, a ** k],
                [0, 1],
              ])}$`,
              `$${matLatex([
                [1, a ** k],
                [0, 1],
              ])}$`,
            ),
            t(
              `$${matLatex([
                [k, k * a],
                [0, k],
              ])}$`,
              `$${matLatex([
                [k, k * a],
                [0, k],
              ])}$`,
            ),
            t(
              `$${matLatex([
                [1, a],
                [0, 1],
              ])}$`,
              `$${matLatex([
                [1, a],
                [0, 1],
              ])}$`,
            ),
          ],
          t(
            `Notice that $\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}^2 = \\begin{pmatrix} 1 & 2a \\\\ 0 & 1 \\end{pmatrix}$. By induction, $S^k = \\begin{pmatrix} 1 & ka \\\\ 0 & 1 \\end{pmatrix} = ${matLatex(Sk)}$.`,
            `观察发现 $\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}^2 = \\begin{pmatrix} 1 & 2a \\\\ 0 & 1 \\end{pmatrix}$。由归纳法可知，$S^k = \\begin{pmatrix} 1 & ka \\\\ 0 & 1 \\end{pmatrix} = ${matLatex(Sk)}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.22.6 Multiplying a Matrix by the Identity Matrix ──────────────────────

/** multiplyingAMatrixByTheIdentityMatrix covers AI = A and IA = A. */
export const multiplyingAMatrixByTheIdentityMatrix: TopicDef = {
  id: "multiplying-a-matrix-by-the-identity-matrix",
  title: t("Multiplying a Matrix by the Identity Matrix", "矩阵与单位矩阵的乘法"),
  summary: t(
    "Understand that the identity matrix acts as the multiplicative identity: A I = A and I A = A.",
    "理解单位矩阵在乘法中充当单位元：A I = A 以及 I A = A。",
  ),
  prerequisites: ["zero-square-diagonal-and-identity-matrices", "multiplying-matrices"],
  encompasses: [{ topic: "zero-square-diagonal-and-identity-matrices", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSN.VM.C.10"],
  knowledgePoints: [
    {
      id: "identity-matrix-multiplication-property",
      title: t("Multiplication by the identity matrix", "与单位矩阵相乘的性质"),
      explanation: t(
        "The identity matrix $I$ acts like the number 1 in matrix algebra: for any $m \\times n$ matrix $A$, $I_m A = A$ and $A I_n = A$.",
        "单位矩阵 $I$ 在矩阵代数中的作用相当于数字 1：对于任意 $m \\times n$ 矩阵 $A$，均有 $I_m A = A$ 以及 $A I_n = A$。",
      ),
      generate(rng) {
        const m = rng.pick([2, 3]);
        const n = rng.pick([2, 3]);
        const pool = [-6, -4, -3, -1, 1, 2, 4, 5, 7];
        const A: Mat = Array.from({ length: m }, () => Array.from({ length: n }, () => rng.pick(pool)));

        const isRight = rng.bool();
        if (isRight) {
          return oneOf(
            rng,
            t(
              `Given the $${m} \\times ${n}$ matrix $A = ${matLatex(A)}$, which identity matrix $I$ satisfies $A I = A$, and what is the resulting product?`,
              `给定 $${m} \\times ${n}$ 矩阵 $A = ${matLatex(A)}$，哪个单位矩阵 $I$ 满足 $A I = A$，且所得乘积是什么？`,
            ),
            t(
              `$I_{${n}}$ (dimension $${n} \\times ${n}$), and $A I_{${n}} = A$.`,
              `$I_{${n}}$（维度为 $${n} \\times ${n}$），且 $A I_{${n}} = A$。`,
            ),
            [
              t(
                `$I_{${m}}$ (dimension $${m} \\times ${m}$), and $A I_{${m}} = A$.`,
                `$I_{${m}}$（维度为 $${m} \\times ${m}$），且 $A I_{${m}} = A$。`,
              ),
              t(
                `$I_{${n}}$ (dimension $${n} \\times ${n}$), but the product is $I_{${n}}$.`,
                `$I_{${n}}$（维度为 $${n} \\times ${n}$），但乘积为 $I_{${n}}$。`,
              ),
              t(`$I_{${m + n}}$, and the product is not defined.`, `$I_{${m + n}}$，且该乘积未定义。`),
            ],
            t(
              `To multiply $A$ on the right by $I$, the number of rows of $I$ must match the $${n}$ columns of $A$. Hence $I$ must be $I_{${n}}$, and multiplying any matrix by the identity leaves it unchanged: $A I_{${n}} = A$.`,
              `若在右侧乘以单位矩阵 $I$，$I$ 的行数必须等于 $A$ 的列数 $${n}$。因此该单位矩阵必须是 $I_{${n}}$，且任何矩阵乘以单位矩阵保持不变：$A I_{${n}} = A$。`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `Given the $${m} \\times ${n}$ matrix $A = ${matLatex(A)}$, which identity matrix $I$ satisfies $I A = A$, and what is the resulting product?`,
            `给定 $${m} \\times ${n}$ 矩阵 $A = ${matLatex(A)}$，哪个单位矩阵 $I$ 满足 $I A = A$，且所得乘积是什么？`,
          ),
          t(
            `$I_{${m}}$ (dimension $${m} \\times ${m}$), and $I_{${m}} A = A$.`,
            `$I_{${m}}$（维度为 $${m} \\times ${m}$），且 $I_{${m}} A = A$。`,
          ),
          [
            t(
              `$I_{${n}}$ (dimension $${n} \\times ${n}$), and $I_{${n}} A = A$.`,
              `$I_{${n}}$（维度为 $${n} \\times ${n}$），且 $I_{${n}} A = A$。`,
            ),
            t(
              `$I_{${m}}$ (dimension $${m} \\times ${m}$), but the product is $I_{${m}}$.`,
              `$I_{${m}}$（维度为 $${m} \\times ${m}$），但乘积为 $I_{${m}}$。`,
            ),
            t(`$I_{${m} \\times ${n}}$, and the product is $O$.`, `$I_{${m} \\times ${n}}$，且乘积为零矩阵 $O$。`),
          ],
          t(
            `To multiply $A$ on the left by $I$, the number of columns of $I$ must match the $${m}$ rows of $A$. Hence $I$ must be $I_{${m}}$, and $I_{${m}} A = A$.`,
            `若在左侧乘以单位矩阵 $I$，$I$ 的列数必须等于 $A$ 的行数 $${m}$。因此该单位矩阵必须是 $I_{${m}}$，且 $I_{${m}} A = A$。`,
          ),
        );
      },
    },
    {
      id: "algebraic-simplification-with-identity-matrix",
      title: t("Algebraic expressions with the identity matrix", "含单位矩阵的代数式化简"),
      explanation: t(
        "Because $A I = I A = A$, multiplying by $I$ commutes with any square matrix $A$. Consequently, expressions such as $(A + I)^2$ expand cleanly as $A^2 + 2A + I$, and $(A - I)(A + I) = A^2 - I$.",
        "因为对任意方阵 $A$ 恒有 $A I = I A = A$，单位矩阵 $I$ 与 $A$ 可交换。因此类似 $(A + I)^2$ 的表达式可展开为 $A^2 + 2A + I$，而 $(A - I)(A + I) = A^2 - I$。",
      ),
      generate(rng) {
        const c1 = rng.pick([2, 3, 4, 5, 6, 7, 8]);
        const c2 = rng.pick([2, 3, 4, 5, 6, 7, 8]);
        const mode = rng.pick([0, 1]);

        if (mode === 0) {
          const sum = c1 + c2;
          return oneOf(
            rng,
            t(
              `Simplify the matrix expression $${c1}(A I) + ${c2}(I A)$ for an $n \\times n$ matrix $A$ and identity matrix $I$.`,
              `化简矩阵表达式 $${c1}(A I) + ${c2}(I A)$，其中 $A$ 为 $n \\times n$ 矩阵，$I$ 为同阶单位矩阵。`,
            ),
            t(`$${sum}A$`, `$${sum}A$`),
            [
              t(`$${c1 * c2}A$`, `$${c1 * c2}A$`),
              t(`$${sum}I$`, `$${sum}I$`),
              t(`$${c1}A + ${c2}I$`, `$${c1}A + ${c2}I$`),
              t(`$${Math.abs(c1 - c2)}A$`, `$${Math.abs(c1 - c2)}A$`),
            ],
            t(
              `Since $A I = A$ and $I A = A$, we have $${c1}(A) + ${c2}(A) = (${c1} + ${c2})A = ${sum}A$.`,
              `因为 $A I = A$ 且 $I A = A$，所以原式可化为 $${c1}(A) + ${c2}(A) = (${c1} + ${c2})A = ${sum}A$。`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `Expand and simplify the expression $${c1}(A + I)(A - I)$ for an $n \\times n$ matrix $A$ and identity matrix $I$.`,
            `展开并化简表达式 $${c1}(A + I)(A - I)$，其中 $A$ 为 $n \\times n$ 矩阵，$I$ 为同阶单位矩阵。`,
          ),
          t(`$${c1}A^2 - ${c1}I$`, `$${c1}A^2 - ${c1}I$`),
          [
            t(`$${c1}A^2 - ${c1}$`, `$${c1}A^2 - ${c1}$`),
            t(`$${c1}A^2 + ${2 * c1}A - ${c1}I$`, `$${c1}A^2 + ${2 * c1}A - ${c1}I$`),
            t(`$${c1}A^2 - I$`, `$${c1}A^2 - I$`),
            t(`$${c1}A^2 + ${c1}I$`, `$${c1}A^2 + ${c1}I$`),
          ],
          t(
            `Since $A I = I A = A$, the cross terms cancel: $(A + I)(A - I) = A^2 - AI + IA - I = A^2 - I$. Multiplying by $${c1}$ gives $${c1}A^2 - ${c1}I$.`,
            `因为 $A I = I A = A$，交叉项对消：$(A + I)(A - I) = A^2 - AI + IA - I = A^2 - I$。乘以 $${c1}$ 得到 $${c1}A^2 - ${c1}I$。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.22.7 Properties of Matrix Multiplication ─────────────────────────────

/** propertiesOfMatrixMultiplication covers non-commutativity, associativity, and distributivity. */
export const propertiesOfMatrixMultiplication: TopicDef = {
  id: "properties-of-matrix-multiplication",
  title: t("Properties of Matrix Multiplication", "矩阵乘法的性质与非交换性"),
  summary: t(
    "Understand that matrix multiplication is not commutative in general (AB != BA), but is associative and distributive.",
    "理解矩阵乘法通常不满足交换律（AB != BA），但满足结合律与分配律。",
  ),
  prerequisites: ["multiplying-matrices"],
  encompasses: [{ topic: "multiplying-matrices", weight: 0.4 }],
  xp: 13,
  standards: ["CCSS.HSN.VM.C.9"],
  knowledgePoints: [
    {
      id: "non-commutativity-of-matrix-multiplication",
      title: t("Non-commutativity of matrix multiplication", "矩阵乘法的非交换性"),
      explanation: t(
        "In general, matrix multiplication is not commutative: $AB \\ne BA$. The commutator $[A, B] = AB - BA$ measures the extent to which two matrices fail to commute.",
        "通常情况下，矩阵乘法不满足交换律：$AB \\ne BA$。对易子 $[A, B] = AB - BA$ 衡量了两个矩阵不可交换的程度。",
      ),
      generate(rng) {
        const pool = [-3, -2, -1, 1, 2, 3];
        let A: Mat;
        let B: Mat;
        let AB: Mat;
        let BA: Mat;
        do {
          A = [
            [rng.pick(pool), rng.pick(pool)],
            [rng.pick(pool), rng.pick(pool)],
          ];
          B = [
            [rng.pick(pool), rng.pick(pool)],
            [rng.pick(pool), rng.pick(pool)],
          ];
          AB = matMul(A, B);
          BA = matMul(B, A);
        } while (AB[0]![0] === BA[0]![0] && AB[0]![1] === BA[0]![1] && AB[1]![0] === BA[1]![0] && AB[1]![1] === BA[1]![1]);
        const diff = matSub(AB, BA);

        return oneOf(
          rng,
          t(
            `Compute the commutator $AB - BA$ for the matrices:\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
            `计算下列矩阵的对易差 $AB - BA$：\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
          ),
          t(`$${matLatex(diff)}$`, `$${matLatex(diff)}$`),
          [
            t("$\\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$", "$\\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$"),
            t(`$${matLatex(matAdd(AB, BA))}$`, `$${matLatex(matAdd(AB, BA))}$`),
            t(`$${matLatex(matScale(-1, diff))}$`, `$${matLatex(matScale(-1, diff))}$`),
          ],
          t(
            `Compute $AB = ${matLatex(AB)}$ and $BA = ${matLatex(BA)}$. Subtracting gives $AB - BA = ${matLatex(diff)} \\ne O$, demonstrating that matrix multiplication is not commutative.`,
            `计算得 $AB = ${matLatex(AB)}$ 且 $BA = ${matLatex(BA)}$。相减得 $AB - BA = ${matLatex(diff)} \\ne O$，这说明矩阵乘法通常不满足交换律。`,
          ),
        );
      },
    },
    {
      id: "associative-and-distributive-properties",
      title: t("Associative, distributive, and transpose properties", "结合律、分配律与转置性质"),
      explanation: t(
        "Matrix multiplication is associative: $(AB)C = A(BC)$. It distributes over addition: $A(B + C) = AB + AC$ and $(A + B)C = AC + BC$. The transpose of a product reverses order: $(AB)^T = B^T A^T$.",
        "矩阵乘法满足结合律：$(AB)C = A(BC)$；满足分配律：$A(B + C) = AB + AC$ 与 $(A + B)C = AC + BC$。乘积的转置会颠倒次序：$(AB)^T = B^T A^T$。",
      ),
      generate(rng) {
        const c1 = rng.pick([2, 3, 4, 5, 6, 7]);
        const m = rng.pick([2, 3, 4]);
        const k = rng.pick([2, 3, 4, 5]);
        const n = rng.pick([2, 3, 4, 6]);

        const mode = rng.pick([0, 1]);
        if (mode === 0) {
          return oneOf(
            rng,
            t(
              `Simplify the matrix expression $${c1}A(B + C) - ${c1}AB$ for compatible matrices $A$, $B$, and $C$.`,
              `化简矩阵表达式 $${c1}A(B + C) - ${c1}AB$，其中 $A$、$B$、$C$ 为相容维度的矩阵。`,
            ),
            t(`$${c1}AC$`, `$${c1}AC$`),
            [t(`$${c1}CA$`, `$${c1}CA$`), t(`$${c1}AB + ${c1}AC$`, `$${c1}AB + ${c1}AC$`), t("$O$", "$O$"), t(`$${c1}A$`, `$${c1}A$`)],
            t(
              `Apply the left distributive property: $${c1}A(B + C) = ${c1}AB + ${c1}AC$. Subtracting $${c1}AB$ leaves $${c1}AC$.`,
              `应用左分配律：$${c1}A(B + C) = ${c1}AB + ${c1}AC$。减去 $${c1}AB$ 剩下 $${c1}AC$。`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `Matrix $A$ has dimension $${m} \\times ${k}$ and matrix $B$ has dimension $${k} \\times ${n}$. Which expression equals $(AB)^T$?`,
            `矩阵 $A$ 的维度为 $${m} \\times ${k}$，矩阵 $B$ 的维度为 $${k} \\times ${n}$。下列哪个表达式等于 $(AB)^T$？`,
          ),
          t("$B^T A^T$", "$B^T A^T$"),
          [t("$A^T B^T$", "$A^T B^T$"), t("$-(B^T A^T)$", "$-(B^T A^T)$"), t("$AB$", "$AB$"), t("$BA$", "$BA$")],
          t(
            `The transpose of a matrix product reverses the order of factors: $(AB)^T = B^T A^T$. Notice that $B^T$ is $${n} \\times ${k}$ and $A^T$ is $${k} \\times ${m}$, so their product $B^T A^T$ is $${n} \\times ${m}$, which matches the dimension of $(AB)^T$.`,
            `矩阵乘积的转置必须反转乘积次序：$(AB)^T = B^T A^T$。注意 $B^T$ 为 $${n} \\times ${k}$ 而 $A^T$ 为 $${k} \\times ${m}$，它们的乘积 $B^T A^T$ 维度为 $${n} \\times ${m}$，恰好与 $(AB)^T$ 的维度一致。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.22.8 Representing 2x2 Systems of Equations Using a Matrix Product ────

/** representing2x2SystemsOfEquationsUsingAMatrixProduct covers writing 2x2 systems as Ax = b. */
export const representing2x2SystemsOfEquationsUsingAMatrixProduct: TopicDef = {
  id: "representing-2x2-systems-of-equations-using-a-matrix-product",
  title: t("Representing 2x2 Systems of Equations Using a Matrix Product", "用矩阵乘积表示二元一次方程组"),
  summary: t(
    "Represent a system of two linear equations in two variables as a single matrix equation A x = b.",
    "将二元一次方程组表示为单一矩阵方程 A x = b 的形式。",
  ),
  prerequisites: ["multiplying-a-matrix-by-a-column-vector"],
  encompasses: [{ topic: "multiplying-a-matrix-by-a-column-vector", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.HSA.REI.C.8"],
  knowledgePoints: [
    {
      id: "system-to-matrix-equation-2x2",
      title: t("Converting a 2x2 system to matrix form", "将二元一次方程组转化为矩阵方程"),
      explanation: t(
        "A system of linear equations $\\begin{cases} a x + b y = e \\\\ c x + d y = f \\end{cases}$ can be written in matrix form as $A \\mathbf{x} = \\mathbf{b}$:\n\n$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} e \\\\ f \\end{pmatrix}$$",
        "线性方程组 $\\begin{cases} a x + b y = e \\\\ c x + d y = f \\end{cases}$ 可以写成矩阵方程 $A \\mathbf{x} = \\mathbf{b}$ 的形式：\n\n$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} e \\\\ f \\end{pmatrix}$$",
      ),
      generate(rng) {
        const pool = [-7, -5, -4, -3, -2, 2, 3, 4, 5, 7];
        const a = rng.pick(pool);
        const b = rng.pick(pool);
        const c = rng.pick(pool);
        const d = rng.pick(pool);
        const e = rng.pick([-9, -6, 1, 6, 9]);
        const f = rng.pick([-8, -4, 2, 5, 8]);

        const eq1 = `${a === 1 ? "" : a === -1 ? "-" : a}x ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}y = ${e}`;
        const eq2 = `${c === 1 ? "" : c === -1 ? "-" : c}x ${d < 0 ? "-" : "+"} ${Math.abs(d) === 1 ? "" : Math.abs(d)}y = ${f}`;

        const A: Mat = [
          [a, b],
          [c, d],
        ];
        const AT = matTranspose(A);

        const correctLatex = `${matLatex(A)} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${e} \\\\ ${f} \\end{pmatrix}`;
        const transLatex = `${matLatex(AT)} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${e} \\\\ ${f} \\end{pmatrix}`;
        const swappedLatex = `${matLatex(A)} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${f} \\\\ ${e} \\end{pmatrix}`;
        const negLatex = `${matLatex(matScale(-1, A))} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${e} \\\\ ${f} \\end{pmatrix}`;

        return oneOf(
          rng,
          t(
            `Write the system of equations in matrix form $A \\mathbf{x} = \\mathbf{b}$:\n\n$$\\begin{cases} ${eq1} \\\\ ${eq2} \\end{cases}$$`,
            `将下列方程组表示为矩阵形式 $A \\mathbf{x} = \\mathbf{b}$：\n\n$$\\begin{cases} ${eq1} \\\\ ${eq2} \\end{cases}$$`,
          ),
          t(`$${correctLatex}$`, `$${correctLatex}$`),
          [t(`$${transLatex}$`, `$${transLatex}$`), t(`$${swappedLatex}$`, `$${swappedLatex}$`), t(`$${negLatex}$`, `$${negLatex}$`)],
          t(
            `The coefficient matrix $A$ contains the coefficients of $x$ and $y$ row by row: $A = ${matLatex(A)}$. The constant vector is $\\mathbf{b} = \\begin{pmatrix} ${e} \\\\ ${f} \\end{pmatrix}$. Thus the matrix equation is $${correctLatex}$.`,
            `系数矩阵 $A$ 按行排列 $x$ 与 $y$ 的系数：$A = ${matLatex(A)}$。常数项向量为 $\\mathbf{b} = \\begin{pmatrix} ${e} \\\\ ${f} \\end{pmatrix}$。因此矩阵方程为 $${correctLatex}$。`,
          ),
        );
      },
    },
    {
      id: "matrix-equation-to-system-2x2",
      title: t("Expanding a 2x2 matrix equation into a system", "将二元矩阵方程还原为线性方程组"),
      explanation: t(
        "Multiplying out the matrix equation $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} e \\\\ f \\end{pmatrix}$ restores the original system: $\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}$.",
        "展开矩阵方程 $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} e \\\\ f \\end{pmatrix}$ 即可还原原本的方程组：$\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}$。",
      ),
      generate(rng) {
        const pool = [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6];
        const a = rng.pick(pool);
        const b = rng.pick(pool);
        const c = rng.pick(pool);
        const d = rng.pick(pool);
        const e = rng.pick([-7, -3, 3, 7]);
        const f = rng.pick([-5, -1, 4, 8]);

        const A: Mat = [
          [a, b],
          [c, d],
        ];
        const formatEq = (c1: number, c2: number, rhs: number) =>
          `${c1 === 1 ? "" : c1 === -1 ? "-" : c1}x ${c2 < 0 ? "-" : "+"} ${Math.abs(c2) === 1 ? "" : Math.abs(c2)}y = ${rhs}`;

        const correctSys = `\\begin{cases} ${formatEq(a, b, e)} \\\\ ${formatEq(c, d, f)} \\end{cases}`;
        const transSys = `\\begin{cases} ${formatEq(a, c, e)} \\\\ ${formatEq(b, d, f)} \\end{cases}`;
        const swappedRhsSys = `\\begin{cases} ${formatEq(a, b, f)} \\\\ ${formatEq(c, d, e)} \\end{cases}`;

        return oneOf(
          rng,
          t(
            `Which system of equations corresponds to the matrix equation:\n\n$$${matLatex(A)} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${e} \\\\ ${f} \\end{pmatrix}$$`,
            `下列哪个方程组与该矩阵方程相对应：\n\n$$${matLatex(A)} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${e} \\\\ ${f} \\end{pmatrix}$$`,
          ),
          t(`$${correctSys}$`, `$${correctSys}$`),
          [
            t(`$${transSys}$`, `$${transSys}$`),
            t(`$${swappedRhsSys}$`, `$${swappedRhsSys}$`),
            t(
              `$\\begin{cases} ${formatEq(-a, b, e)} \\\\ ${formatEq(c, -d, f)} \\end{cases}$`,
              `$\\begin{cases} ${formatEq(-a, b, e)} \\\\ ${formatEq(c, -d, f)} \\end{cases}$`,
            ),
          ],
          t(
            `Multiply row 1 by column vector: $(${a})x + (${b})y = ${e}$. Multiply row 2 by column vector: $(${c})x + (${d})y = ${f}$. This gives $${correctSys}$.`,
            `第 1 行与未知数列向量相乘：$(${a})x + (${b})y = ${e}$。第 2 行与列向量相乘：$(${c})x + (${d})y = ${f}$。即得到方程组 $${correctSys}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.22.9 Representing 3x3 Systems of Equations Using a Matrix Product ────

/** representing3x3SystemsOfEquationsUsingAMatrixProduct covers 3x3 systems in matrix form. */
export const representing3x3SystemsOfEquationsUsingAMatrixProduct: TopicDef = {
  id: "representing-3x3-systems-of-equations-using-a-matrix-product",
  title: t("Representing 3x3 Systems of Equations Using a Matrix Product", "用矩阵乘积表示三元一次方程组"),
  summary: t(
    "Represent a system of three linear equations in three variables as a matrix equation A x = b, paying attention to zero coefficients.",
    "将三元一次方程组表示为矩阵方程 A x = b，特别注意未知数缺项时对应系数为 0。",
  ),
  prerequisites: ["representing-2x2-systems-of-equations-using-a-matrix-product"],
  encompasses: [{ topic: "representing-2x2-systems-of-equations-using-a-matrix-product", weight: 0.4 }],
  xp: 13,
  standards: ["CCSS.HSA.REI.C.8"],
  knowledgePoints: [
    {
      id: "system-to-matrix-equation-3x3",
      title: t("Converting a 3x3 system to matrix equation", "将三元一次方程组转化为矩阵方程"),
      explanation: t(
        "A $3 \\times 3$ system of equations is represented as $A \\mathbf{x} = \\mathbf{b}$ where $A$ is the $3 \\times 3$ coefficient matrix, $\\mathbf{x} = \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}$, and $\\mathbf{b}$ is the $3 \\times 1$ constant vector. If a variable is missing in an equation, its coefficient in $A$ is 0.",
        "三元一次方程组可表示为 $A \\mathbf{x} = \\mathbf{b}$，其中 $A$ 为 $3 \\times 3$ 系数矩阵，$\\mathbf{x} = \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}$，$\\mathbf{b}$ 为 $3 \\times 1$ 常数项向量。若某方程缺少某个未知数，则对应系数为 0。",
      ),
      generate(rng) {
        const pool = [-5, -4, -3, -2, 2, 3, 4, 5];
        const a1 = rng.pick(pool);
        const b1 = rng.pick(pool);
        const c1 = rng.pick(pool);
        const a2 = rng.pick(pool);
        const b2 = 0; // missing y in second equation
        const c2 = rng.pick(pool);
        const a3 = rng.pick(pool);
        const b3 = rng.pick(pool);
        const c3 = rng.pick(pool);

        const r1 = rng.pick([-6, -2, 3, 7]);
        const r2 = rng.pick([-4, 1, 5, 8]);
        const r3 = rng.pick([-7, -1, 2, 9]);

        const eq1 = `${a1}x ${b1 < 0 ? "-" : "+"} ${Math.abs(b1)}y ${c1 < 0 ? "-" : "+"} ${Math.abs(c1)}z = ${r1}`;
        const eq2 = `${a2}x ${c2 < 0 ? "-" : "+"} ${Math.abs(c2)}z = ${r2}`;
        const eq3 = `${a3}x ${b3 < 0 ? "-" : "+"} ${Math.abs(b3)}y ${c3 < 0 ? "-" : "+"} ${Math.abs(c3)}z = ${r3}`;

        const A: Mat = [
          [a1, b1, c1],
          [a2, b2, c2],
          [a3, b3, c3],
        ];

        // Distractor: put 1 instead of 0 for missing variable
        const wrongA: Mat = [
          [a1, b1, c1],
          [a2, 1, c2],
          [a3, b3, c3],
        ];

        const xVec = colVecLatex(["x", "y", "z"]);
        const bVec = colVecLatex([r1, r2, r3]);

        const correctAns = `${matLatex(A)} ${xVec} = ${bVec}`;
        const wrongAns1 = `${matLatex(wrongA)} ${xVec} = ${bVec}`;
        const wrongAns2 = `${matLatex(matTranspose(A))} ${xVec} = ${bVec}`;

        return oneOf(
          rng,
          t(
            `Represent the system of equations in matrix form $A \\mathbf{x} = \\mathbf{b}$:\n\n$$\\begin{cases} ${eq1} \\\\ ${eq2} \\\\ ${eq3} \\end{cases}$$`,
            `将下列方程组表示为矩阵形式 $A \\mathbf{x} = \\mathbf{b}$：\n\n$$\\begin{cases} ${eq1} \\\\ ${eq2} \\end{cases}$$`,
          ),
          t(`$${correctAns}$`, `$${correctAns}$`),
          [
            t(`$${wrongAns1}$`, `$${wrongAns1}$`),
            t(`$${wrongAns2}$`, `$${wrongAns2}$`),
            t(`$${matLatex(A)} ${xVec} = ${colVecLatex([r3, r2, r1])}$`, `$${matLatex(A)} ${xVec} = ${colVecLatex([r3, r2, r1])}$`),
          ],
          t(
            `Notice that the second equation $${eq2}$ has no $y$ term, so the coefficient of $y$ in row 2 is 0. The matrix equation is $${correctAns}$.`,
            `注意第二个方程 $${eq2}$ 不含 $y$ 项，因此第 2 行中 $y$ 的系数为 0。该矩阵方程为 $${correctAns}$。`,
          ),
        );
      },
    },
    {
      id: "identifying-components-of-3x3-matrix-equations",
      title: t("Identifying components of 3x3 matrix equations", "识别三元矩阵方程的系数矩阵、未知数与常数向量"),
      explanation: t(
        "In the matrix equation $A \\mathbf{x} = \\mathbf{b}$, $A$ is the coefficient matrix, $\\mathbf{x}$ is the column vector of variables, and $\\mathbf{b}$ is the column vector of constants on the right-hand side.",
        "在矩阵方程 $A \\mathbf{x} = \\mathbf{b}$ 中，$A$ 是系数矩阵，$\\mathbf{x}$ 是未知数列向量，$\\mathbf{b}$ 是由方程右端常数组成的列向量。",
      ),
      generate(rng) {
        const pool = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
        ];
        const b = [rng.pick(pool), rng.pick(pool), rng.pick(pool)];

        const i = rng.pick([1, 2, 3]);
        const j = rng.pick([1, 2, 3]);
        const targetVal = A[i - 1]![j - 1]!;

        return oneOf(
          rng,
          t(
            `In the matrix equation $A \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\mathbf{b}$ representing a linear system, what is the entry $a_{${i}${j}}$ of the coefficient matrix $A$?\n\n$$A = ${matLatex(A)}, \\quad \\mathbf{b} = ${colVecLatex(b)}$$`,
            `在线性方程组的矩阵方程 $A \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\mathbf{b}$ 中，系数矩阵 $A$ 的元素 $a_{${i}${j}}$ 是多少？\n\n$$A = ${matLatex(A)}, \\quad \\mathbf{b} = ${colVecLatex(b)}$$`,
          ),
          t(`$${targetVal}$`, `$${targetVal}$`),
          [
            t(`$${-targetVal}$`, `$${-targetVal}$`),
            t(`$${b[i - 1]!}$`, `$${b[i - 1]!}$`),
            t(`$${A[j - 1]![i - 1]!}$`, `$${A[j - 1]![i - 1]!}$`),
            t(`$${targetVal + 1}$`, `$${targetVal + 1}$`),
          ],
          t(
            `Entry $a_{${i}${j}}$ is the coefficient in equation (row) $${i}$ for variable $j$ (column $${j}$). In matrix $A$, that entry is $${targetVal}$.`,
            `元素 $a_{${i}${j}}$ 对应第 $${i}$ 个方程（第 $${i}$ 行）中第 $${j}$ 个未知数（第 $${j}$ 列）的系数。在矩阵 $A$ 中，该元素为 $${targetVal}$。`,
          ),
        );
      },
    },
  ],
};

// ─── Module 6.23. Determinants ──────────────────────────────────────────────

// ─── 6.23.1 The Determinant of a 2x2 Matrix ─────────────────────────────────

/** theDeterminantOfA2x2Matrix covers evaluating 2x2 determinants ad - bc. */
export const theDeterminantOfA2x2Matrix: TopicDef = {
  id: "the-determinant-of-a-2x2-matrix",
  title: t("The Determinant of a 2x2 Matrix", "二阶行列式的计算"),
  summary: t(
    "Calculate the determinant of a 2x2 matrix using ad - bc, and solve equations involving determinants.",
    "使用对角线乘积差 ad - bc 计算二阶行列式的值，并求解含行列式的方程。",
  ),
  prerequisites: ["multiplying-square-matrices"],
  encompasses: [{ topic: "multiplying-square-matrices", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.HSN.VM.C.10", "CCSS.HSN.VM.C.12"],
  knowledgePoints: [
    {
      id: "evaluating-2x2-determinants",
      title: t("Evaluating determinants of 2x2 matrices", "计算二阶矩阵的行列式"),
      explanation: t(
        "The determinant of a $2 \\times 2$ matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ is denoted $\\det(A)$ or $\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}$ and is defined as:\n\n$$\\det(A) = ad - bc$$",
        "$2 \\times 2$ 矩阵 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 的行列式记作 $\\det(A)$ 或 $\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}$，其计算公式为：\n\n$$\\det(A) = ad - bc$$",
      ),
      generate(rng) {
        const pool = [-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const a = rng.pick(pool);
        const b = rng.pick(pool);
        const c = rng.pick(pool);
        const d = rng.pick(pool);
        const val = a * d - b * c;

        // Distractor: ad + bc
        const wrongSign = a * d + b * c;
        // Distractor: ac - bd
        const wrongCols = a * c - b * d;

        return oneOf(
          rng,
          t(
            `Evaluate the determinant:\n\n$$\\det ${matLatex([
              [a, b],
              [c, d],
            ])} = ${detLatex([
              [a, b],
              [c, d],
            ])}$$`,
            `计算行列式的值：\n\n$$\\det ${matLatex([
              [a, b],
              [c, d],
            ])} = ${detLatex([
              [a, b],
              [c, d],
            ])}$$`,
          ),
          t(`$${val}$`, `$${val}$`),
          [
            t(`$${wrongSign}$`, `$${wrongSign}$`),
            t(`$${-val}$`, `$${-val}$`),
            t(`$${wrongCols}$`, `$${wrongCols}$`),
            t(`$${val + 2}$`, `$${val + 2}$`),
          ],
          t(
            `Use the formula $\\det(A) = ad - bc$:\n\n$$\\det(A) = (${a})(${d}) - (${b})(${c}) = ${a * d} - (${b * c}) = ${val}$$`,
            `根据计算公式 $\\det(A) = ad - bc$：\n\n$$\\det(A) = (${a})(${d}) - (${b})(${c}) = ${a * d} - (${b * c}) = ${val}$$`,
          ),
        );
      },
    },
    {
      id: "solving-for-unknowns-in-2x2-determinants",
      title: t("Solving for an unknown in a 2x2 determinant equation", "解含未知数的二阶行列式方程"),
      explanation: t(
        "An equation of the form $\\det\\begin{pmatrix} x & b \\\\ c & d \\end{pmatrix} = k$ translates to the linear equation $d x - b c = k$, which can be solved for $x = \\frac{k + bc}{d}$.",
        "形如 $\\det\\begin{pmatrix} x & b \\\\ c & d \\end{pmatrix} = k$ 的方程对应于一次方程 $d x - b c = k$，解得 $x = \\frac{k + bc}{d}$。",
      ),
      generate(rng) {
        const x = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const d = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const b = rng.pick([-6, -4, -2, 1, 3, 5]);
        const c = rng.pick([-5, -3, 2, 4, 6]);
        const k = x * d - b * c;

        const M: (readonly (string | number)[])[] = [
          ["x", b],
          [c, d],
        ];

        return oneOf(
          rng,
          t(
            `Solve for $x$ in the determinant equation:\n\n$$${detLatex(M)} = ${k}$$`,
            `解下列关于未知数 $x$ 的行列式方程：\n\n$$${detLatex(M)} = ${k}$$`,
          ),
          t(`$${x}$`, `$${x}$`),
          [t(`$${-x}$`, `$${-x}$`), t(`$${x + 1}$`, `$${x + 1}$`), t(`$${x - 2}$`, `$${x - 2}$`), t(`$${x + 3}$`, `$${x + 3}$`)],
          t(
            `Expand the determinant: $x(${d}) - (${b})(${c}) = ${k}$.\n\n$$${d}x - (${b * c}) = ${k} \\implies ${d}x = ${k + b * c} \\implies x = ${x}$$`,
            `展开行列式：$x(${d}) - (${b})(${c}) = ${k}$。\n\n$$${d}x - (${b * c}) = ${k} \\implies ${d}x = ${k + b * c} \\implies x = ${x}$$`,
          ),
        );
      },
    },
  ],
};

// ─── 6.23.2 The Geometric Interpretation of the 2x2 Determinant ─────────────

/** theGeometricInterpretationOfThe2x2Determinant covers area and orientation. */
export const theGeometricInterpretationOfThe2x2Determinant: TopicDef = {
  id: "the-geometric-interpretation-of-the-2x2-determinant",
  title: t("The Geometric Interpretation of the 2x2 Determinant", "二阶行列式的几何意义"),
  summary: t(
    "Understand that |ad - bc| gives the area of the parallelogram spanned by two column vectors, with sign indicating orientation.",
    "理解二阶行列式绝对值 |ad - bc| 表示由两列向量张成的平行四边形面积，其符号代表平面定向。",
  ),
  prerequisites: ["the-determinant-of-a-2x2-matrix"],
  encompasses: [{ topic: "the-determinant-of-a-2x2-matrix", weight: 0.4 }],
  xp: 13,
  standards: ["CCSS.HSN.VM.C.12"],
  knowledgePoints: [
    {
      id: "area-of-parallelogram-spanned-by-vectors",
      title: t("Area of parallelogram via 2x2 determinant", "由向量张成的平行四边形面积与行列式"),
      explanation: t(
        "The area of the parallelogram spanned by two vectors $\\mathbf{u} = \\langle u_1, u_2 \\rangle$ and $\\mathbf{v} = \\langle v_1, v_2 \\rangle$ in $\\mathbb{R}^2$ equals the absolute value of the determinant of the matrix formed by the vectors:\n\n$$\\text{Area} = |\\det[\\mathbf{u} \\quad \\mathbf{v}]| = |u_1 v_2 - u_2 v_1|$$",
        "在 $\\mathbb{R}^2$ 平面中，由向量 $\\mathbf{u} = \\langle u_1, u_2 \\rangle$ 与 $\\mathbf{v} = \\langle v_1, v_2 \\rangle$ 所张成的平行四边形面积等于由这两个向量组成的矩阵行列式的绝对值：\n\n$$\\text{Area} = |\\det[\\mathbf{u} \\quad \\mathbf{v}]| = |u_1 v_2 - u_2 v_1|$$",
      ),
      generate(rng) {
        const pool = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
        let u1 = rng.pick(pool);
        let u2 = rng.pick(pool);
        let v1 = rng.pick(pool);
        let v2 = rng.pick(pool);
        let detVal = u1 * v2 - u2 * v1;
        while (detVal === 0) {
          u1 = rng.pick(pool);
          u2 = rng.pick(pool);
          v1 = rng.pick(pool);
          v2 = rng.pick(pool);
          detVal = u1 * v2 - u2 * v1;
        }
        const area = Math.abs(detVal);

        return oneOf(
          rng,
          t(
            `Find the area of the parallelogram spanned by the vectors $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ and $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$ in the Cartesian plane.`,
            `求直角坐标平面中由向量 $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ 与 $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$ 张成的平行四边形的面积。`,
          ),
          t(`$${area}$`, `$${area}$`),
          [
            t(`$${detVal < 0 ? detVal : -area}$`, `$${detVal < 0 ? detVal : -area}$`),
            t(`$${u1 * v1 + u2 * v2}$`, `$${u1 * v1 + u2 * v2}$`),
            t(`$${Math.round(area / 2)}$`, `$${Math.round(area / 2)}$`),
            t(`$${area + 4}$`, `$${area + 4}$`),
          ],
          t(
            `The area is the absolute value of the determinant:\n\n$$\\text{Area} = |\\det \\begin{pmatrix} ${u1} & ${v1} \\\\ ${u2} & ${v2} \\end{pmatrix}| = |(${u1})(${v2}) - (${u2})(${v1})| = |${detVal}| = ${area}$$`,
            `平行四边形面积等于二阶行列式的绝对值：\n\n$$\\text{Area} = |\\det \\begin{pmatrix} ${u1} & ${v1} \\\\ ${u2} & ${v2} \\end{pmatrix}| = |(${u1})(${v2}) - (${u2})(${v1})| = |${detVal}| = ${area}$$`,
          ),
        );
      },
    },
    {
      id: "sign-of-determinant-and-orientation",
      title: t("Orientation and sign of the 2x2 determinant", "行列式的正负符号与向量定向"),
      explanation: t(
        "The sign of $\\det[\\mathbf{u} \\; \\mathbf{v}]$ encodes geometric orientation: if $\\det > 0$, turning from $\\mathbf{u}$ to $\\mathbf{v}$ through the smaller angle is counterclockwise (positive orientation); if $\\det < 0$, it is clockwise (negative orientation); if $\\det = 0$, the vectors are collinear (linearly dependent, area is 0).",
        "行列式 $\\det[\\mathbf{u} \\; \\mathbf{v}]$ 的符号反映了几何定向：若 $\\det > 0$，从 $\\mathbf{u}$ 沿劣角转向 $\\mathbf{v}$ 为逆时针方向（正定向）；若 $\\det < 0$，转向为顺时针方向（负定向）；若 $\\det = 0$，则两向量共线（线性相关，面积为 0）。",
      ),
      generate(rng) {
        const type = rng.pick([0, 1, 2]);
        let u1 = 1;
        let u2 = 0;
        let v1 = 0;
        let v2 = 1;

        if (type === 0) {
          // positive orientation
          u1 = rng.pick([2, 3, 4]);
          u2 = rng.pick([0, 1]);
          v1 = rng.pick([-1, 0, 1]);
          v2 = rng.pick([3, 4, 5]);
        } else if (type === 1) {
          // negative orientation
          u1 = rng.pick([2, 3, 4]);
          u2 = rng.pick([3, 4]);
          v1 = rng.pick([4, 5]);
          v2 = rng.pick([1, 2]);
        } else {
          // collinear
          const k = rng.pick([-2, -1, 2, 3]);
          u1 = rng.pick([1, 2, 3]);
          u2 = rng.pick([2, 3, 4]);
          v1 = k * u1;
          v2 = k * u2;
        }
        const detVal = u1 * v2 - u2 * v1;

        if (detVal > 0) {
          return oneOf(
            rng,
            t(
              `The ordered pair of vectors $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ and $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$ has $\\det[\\mathbf{u} \\; \\mathbf{v}] = ${detVal} > 0$. What does this positive determinant indicate about the orientation from $\\mathbf{u}$ to $\\mathbf{v}$?`,
              `有序向量对 $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ 与 $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$ 的行列式 $\\det[\\mathbf{u} \\; \\mathbf{v}] = ${detVal} > 0$。该正行列式说明从 $\\mathbf{u}$ 到 $\\mathbf{v}$ 的平面定向是什么？`,
            ),
            t("Counterclockwise (positive orientation).", "逆时针方向（正定向）。"),
            [
              t("Clockwise (negative orientation).", "顺时针方向（负定向）。"),
              t("The vectors are collinear.", "两向量互相共线。"),
              t("The vectors are perpendicular.", "两向量必定互相垂直。"),
            ],
            t(
              `A positive $2 \\times 2$ determinant indicates that turning from $\\mathbf{u}$ to $\\mathbf{v}$ through the smaller angle proceeds counterclockwise (standard positive orientation).`,
              `二阶行列式为正表示从 $\\mathbf{u}$ 沿较小夹角转向 $\\mathbf{v}$ 是逆时针方向（标准正定向）。`,
            ),
          );
        }

        if (detVal < 0) {
          return oneOf(
            rng,
            t(
              `The ordered pair of vectors $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ and $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$ has $\\det[\\mathbf{u} \\; \\mathbf{v}] = ${detVal} < 0$. What does this negative determinant indicate about the orientation from $\\mathbf{u}$ to $\\mathbf{v}$?`,
              `有序向量对 $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ 与 $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$ 的行列式 $\\det[\\mathbf{u} \\; \\mathbf{v}] = ${detVal} < 0$。该负行列式说明从 $\\mathbf{u}$ 到 $\\mathbf{v}$ 的平面定向是什么？`,
            ),
            t("Clockwise (negative orientation).", "顺时针方向（负定向）。"),
            [
              t("Counterclockwise (positive orientation).", "逆时针方向（正定向）。"),
              t("The vectors are collinear.", "两向量互相共线。"),
              t("The vectors span an infinite area.", "两向量张成的面积无限大。"),
            ],
            t(
              `A negative $2 \\times 2$ determinant indicates that turning from $\\mathbf{u}$ to $\\mathbf{v}$ proceeds clockwise (negative orientation).`,
              `二阶行列式为负表示从 $\\mathbf{u}$ 到 $\\mathbf{v}$ 的转向为顺时针方向（负定向）。`,
            ),
          );
        }

        return oneOf(
          rng,
          t(
            `The vectors $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ and $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$ have determinant $\\det[\\mathbf{u} \\; \\mathbf{v}] = 0$. What is the geometric relationship between these two vectors?`,
            `向量 $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ 与 $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$ 的行列式为 $\\det[\\mathbf{u} \\; \\mathbf{v}] = 0$。这两个向量之间的几何关系是什么？`,
          ),
          t("They are collinear (the parallelogram degenerates to area 0).", "它们互相共线（张成的平行四边形退化，面积为 0）。"),
          [
            t("They are perpendicular.", "它们互相垂直。"),
            t("They form a standard counterclockwise basis.", "它们构成标准的逆时针基底。"),
            t("They have equal magnitudes.", "它们具有相等的模长。"),
          ],
          t(
            `When the determinant is zero, the column vectors are linearly dependent (collinear), meaning the parallelogram they span is squashed into a line segment with area 0.`,
            `当行列式等于 0 时，两列向量线性相关（共线），说明它们张成的平行四边形退化为一条线段，面积为 0。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.23.3 The Minors of a 3x3 Matrix ──────────────────────────────────────

/** theMinorsOfA3x3Matrix covers minor M_ij and cofactor C_ij = (-1)^{i+j} M_ij. */
export const theMinorsOfA3x3Matrix: TopicDef = {
  id: "the-minors-of-a-3x3-matrix",
  title: t("The Minors of a 3x3 Matrix", "三阶矩阵的余子式与代数余子式"),
  summary: t(
    "Find minors M_ij by deleting row i and col j, and compute cofactors C_ij = (-1)^(i+j) M_ij with the checkerboard sign pattern.",
    "通过划去第 i 行与第 j 列计算余子式 M_ij，并利用棋盘符号法则求代数余子式 C_ij = (-1)^(i+j) M_ij。",
  ),
  prerequisites: ["the-determinant-of-a-2x2-matrix"],
  encompasses: [{ topic: "the-determinant-of-a-2x2-matrix", weight: 0.4 }],
  xp: 13,
  standards: ["CCSS.HSN.VM.C.10"],
  knowledgePoints: [
    {
      id: "calculating-minors-of-a-3x3-matrix",
      title: t("Calculating minors of a 3x3 matrix", "计算三阶矩阵的余子式"),
      explanation: t(
        "The minor $M_{ij}$ of an entry $a_{ij}$ in a $3 \\times 3$ matrix $A$ is the determinant of the $2 \\times 2$ submatrix formed by deleting row $i$ and column $j$ of $A$.",
        "三阶矩阵 $A$ 中元素 $a_{ij}$ 的余子式 $M_{ij}$，是指划去 $A$ 中第 $i$ 行和第 $j$ 列后剩下的 $2 \\times 2$ 子矩阵的行列式。",
      ),
      generate(rng) {
        const pool = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
        ];
        const i = rng.pick([1, 2, 3]);
        const j = rng.pick([1, 2, 3]);
        const sub = submatrix3(A, i - 1, j - 1);
        const mVal = minor3(A, i - 1, j - 1);

        return oneOf(
          rng,
          t(
            `Find the minor $M_{${i}${j}}$ of the matrix $A$:\n\n$$A = ${matLatex(A)}$$`,
            `求矩阵 $A$ 的余子式 $M_{${i}${j}}$：\n\n$$A = ${matLatex(A)}$$`,
          ),
          t(`$${mVal}$`, `$${mVal}$`),
          [
            t(`$${-mVal}$`, `$${-mVal}$`),
            t(`$${sub[0]![0]! * sub[1]![1]! + sub[0]![1]! * sub[1]![0]!}$`, `$${sub[0]![0]! * sub[1]![1]! + sub[0]![1]! * sub[1]![0]!}$`),
            t(`$${mVal + 3}$`, `$${mVal + 3}$`),
            t(`$${mVal - 4}$`, `$${mVal - 4}$`),
          ],
          t(
            `Delete row $${i}$ and column $${j}$ to get the $2 \\times 2$ submatrix:\n\n$$M_{${i}${j}} = ${detLatex(sub)} = (${sub[0]![0]!})(${sub[1]![1]!}) - (${sub[0]![1]!})(${sub[1]![0]!}) = ${mVal}$$`,
            `划去第 $${i}$ 行与第 $${j}$ 列得到 $2 \\times 2$ 子矩阵：\n\n$$M_{${i}${j}} = ${detLatex(sub)} = (${sub[0]![0]!})(${sub[1]![1]!}) - (${sub[0]![1]!})(${sub[1]![0]!}) = ${mVal}$$`,
          ),
        );
      },
    },
    {
      id: "calculating-cofactors-of-a-3x3-matrix",
      title: t("Calculating cofactors of a 3x3 matrix", "计算三阶矩阵的代数余子式"),
      explanation: t(
        "The cofactor $C_{ij}$ is the signed minor: $C_{ij} = (-1)^{i+j} M_{ij}$. The signs follow a checkerboard pattern:\n\n$$\\begin{pmatrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{pmatrix}$$",
        "代数余子式 $C_{ij}$ 是带有符号的余子式：$C_{ij} = (-1)^{i+j} M_{ij}$。符号遵循棋盘状正负交错规律：\n\n$$\\begin{pmatrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{pmatrix}$$",
      ),
      generate(rng) {
        const pool = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
        ];
        const i = rng.pick([1, 2, 3]);
        const j = rng.pick([1, 2, 3]);
        const mVal = minor3(A, i - 1, j - 1);
        const cVal = cofactor3(A, i - 1, j - 1);
        const sign = (i + j) % 2 === 0 ? "+" : "-";

        return oneOf(
          rng,
          t(
            `Find the cofactor $C_{${i}${j}}$ of the matrix $A$:\n\n$$A = ${matLatex(A)}$$`,
            `求矩阵 $A$ 的代数余子式 $C_{${i}${j}}$：\n\n$$A = ${matLatex(A)}$$`,
          ),
          t(`$${cVal}$`, `$${cVal}$`),
          [
            t(`$${-cVal}$`, `$${-cVal}$`),
            t(`$${mVal}$`, `$${mVal}$`),
            t(`$${cVal + 2}$`, `$${cVal + 2}$`),
            t(`$${cVal - 3}$`, `$${cVal - 3}$`),
          ],
          t(
            `First find the minor $M_{${i}${j}} = ${mVal}$. Since $i + j = ${i} + ${j} = ${i + j}$, the sign factor is $(-1)^{${i + j}} = ${sign === "+" ? "1" : "-1"}$. Thus $C_{${i}${j}} = ${cVal}$.`,
            `首先求得余子式 $M_{${i}${j}} = ${mVal}$。由于 $i + j = ${i} + ${j} = ${i + j}$，符号因子为 $(-1)^{${i + j}} = ${sign === "+" ? "1" : "-1"}$。因此 $C_{${i}${j}} = ${cVal}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 6.23.4 The Determinant of a 3x3 Matrix ─────────────────────────────────

/** theDeterminantOfA3x3Matrix covers Laplace cofactor expansion and the rule of Sarrus. */
export const theDeterminantOfA3x3Matrix: TopicDef = {
  id: "the-determinant-of-a-3x3-matrix",
  title: t("The Determinant of a 3x3 Matrix", "三阶行列式的计算（按行/列展开）"),
  summary: t(
    "Evaluate 3x3 determinants using Laplace cofactor expansion along any row/column, or by the diagonal rule of Sarrus.",
    "通过拉普拉斯按行/按列代数余子式展开，或利用沙鲁对角线法则计算三阶行列式的值。",
  ),
  prerequisites: ["the-minors-of-a-3x3-matrix"],
  encompasses: [{ topic: "the-minors-of-a-3x3-matrix", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSN.VM.C.10"],
  knowledgePoints: [
    {
      id: "evaluating-3x3-determinants-by-cofactor-expansion",
      title: t("Evaluating 3x3 determinants by cofactor expansion", "利用代数余子式展开计算三阶行列式"),
      explanation: t(
        "By Laplace's expansion theorem, the determinant of a $3 \\times 3$ matrix $A$ can be computed by expanding along any row or column. Expanding along the first row gives:\n\n$$\\det(A) = a_{11} C_{11} + a_{12} C_{12} + a_{13} C_{13} = a_{11} M_{11} - a_{12} M_{12} + a_{13} M_{13}$$",
        "根据拉普拉斯展开定理，三阶矩阵 $A$ 的行列式可以通过沿任意一行或一列展开来计算。沿第一行展开公式为：\n\n$$\\det(A) = a_{11} C_{11} + a_{12} C_{12} + a_{13} C_{13} = a_{11} M_{11} - a_{12} M_{12} + a_{13} M_{13}$$",
      ),
      generate(rng) {
        const pool = [-4, -3, -2, -1, 1, 2, 3, 4];
        // Ensure at least one zero in row 0 or col 0 to encourage strategic expansion
        const A: Mat = [
          [rng.pick(pool), 0, rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
        ];
        const val = det3(A);

        return oneOf(
          rng,
          t(
            `Evaluate the $3 \\times 3$ determinant by expanding along row 1:\n\n$$\\det ${matLatex(A)} = ${detLatex(A)}$$`,
            `利用第一行拉普拉斯展开计算该三阶行列式的值：\n\n$$\\det ${matLatex(A)} = ${detLatex(A)}$$`,
          ),
          t(`$${val}$`, `$${val}$`),
          [
            t(`$${-val}$`, `$${-val}$`),
            t(`$${val + 4}$`, `$${val + 4}$`),
            t(`$${val - 6}$`, `$${val - 6}$`),
            t(`$${val + 10}$`, `$${val + 10}$`),
          ],
          t(
            `Expand along the first row:\n\n$$\\det(A) = (${A[0]![0]!}) C_{11} + (0) C_{12} + (${A[0]![2]!}) C_{13}$$\n\nEvaluating the $2 \\times 2$ minors gives $\\det(A) = ${val}$.`,
            `沿第一行展开：\n\n$$\\det(A) = (${A[0]![0]!}) C_{11} + (0) C_{12} + (${A[0]![2]!}) C_{13}$$\n\n分别计算各 $2 \\times 2$ 余子式后代入，得到 $\\det(A) = ${val}$。`,
          ),
        );
      },
    },
    {
      id: "evaluating-3x3-determinants-rule-of-sarrus",
      title: t("Evaluating 3x3 determinants using the rule of Sarrus", "利用沙鲁法则（对角线法则）计算三阶行列式"),
      explanation: t(
        "The rule of Sarrus calculates the determinant as the sum of three downward diagonal products minus the sum of three upward diagonal products:\n\n$$\\det(A) = (a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32}) - (a_{13}a_{22}a_{31} + a_{11}a_{23}a_{32} + a_{12}a_{21}a_{33})$$",
        "沙鲁法则（对角线法则）通过计算三条主对角线方向乘积之和减去三条副对角线方向乘积之和来求行列式：\n\n$$\\det(A) = (a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32}) - (a_{13}a_{22}a_{31} + a_{11}a_{23}a_{32} + a_{12}a_{21}a_{33})$$",
      ),
      generate(rng) {
        const pool = [-4, -3, -2, -1, 1, 2, 3, 4];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool), rng.pick(pool)],
        ];
        const val = det3(A);

        const p1 = A[0]![0]! * A[1]![1]! * A[2]![2]!;
        const p2 = A[0]![1]! * A[1]![2]! * A[2]![0]!;
        const p3 = A[0]![2]! * A[1]![0]! * A[2]![1]!;
        const sumP = p1 + p2 + p3;

        const m1 = A[0]![2]! * A[1]![1]! * A[2]![0]!;
        const m2 = A[0]![0]! * A[1]![2]! * A[2]![1]!;
        const m3 = A[0]![1]! * A[1]![0]! * A[2]![2]!;
        const sumM = m1 + m2 + m3;

        return oneOf(
          rng,
          t(`Evaluate the $3 \\times 3$ determinant:\n\n$$${detLatex(A)}$$`, `计算该三阶行列式的值：\n\n$$${detLatex(A)}$$`),
          t(`$${val}$`, `$${val}$`),
          [
            t(`$${-val}$`, `$${-val}$`),
            t(`$${val + 6}$`, `$${val + 6}$`),
            t(`$${val - 6}$`, `$${val - 6}$`),
            t(`$${sumP + sumM}$`, `$${sumP + sumM}$`),
          ],
          t(
            `Using Sarrus' rule:\n\nDownward products: $(${p1}) + (${p2}) + (${p3}) = ${sumP}$\nUpward products: $(${m1}) + (${m2}) + (${m3}) = ${sumM}$\n\n$$\\det(A) = ${sumP} - (${sumM}) = ${val}$$`,
            `利用沙鲁对角线法则：\n\n主对角线三项乘积之和：$(${p1}) + (${p2}) + (${p3}) = ${sumP}$\n副对角线三项乘积之和：$(${m1}) + (${m2}) + (${m3}) = ${sumM}$\n\n$$\\det(A) = ${sumP} - (${sumM}) = ${val}$$`,
          ),
        );
      },
    },
  ],
};

// ─── Export array: all 20 topics, modules 6.21–6.23 ──────────────────────────

/** precalculusMatrixTopics collects the 20 topics of Modules 6.21, 6.22, and 6.23. */
export const precalculusMatrixTopics: readonly TopicDef[] = [
  introductionToMatrices,
  indexNotationForMatrices,
  addingAndSubtractingMatrices,
  propertiesOfMatrixAddition,
  scalarMultiplicationOfMatrices,
  zeroSquareDiagonalAndIdentityMatrices,
  theTransposeOfAMatrix,
  multiplyingAMatrixByAColumnVector,
  multiplyingSquareMatrices,
  conformabilityForMatrixMultiplication,
  multiplyingMatrices,
  powersOfMatrices,
  multiplyingAMatrixByTheIdentityMatrix,
  propertiesOfMatrixMultiplication,
  representing2x2SystemsOfEquationsUsingAMatrixProduct,
  representing3x3SystemsOfEquationsUsingAMatrixProduct,
  theDeterminantOfA2x2Matrix,
  theGeometricInterpretationOfThe2x2Determinant,
  theMinorsOfA3x3Matrix,
  theDeterminantOfA3x3Matrix,
];
