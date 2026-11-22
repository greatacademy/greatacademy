import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { precalculusDrawings2 } from "../explanation-drawings-precalculus-2.ts";
import { article, choiceProblem, numberProblem } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

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

/** NUMBER matches the whole numbers of an answer, leaving out subscripts and braces. */
const NUMBER = /(?<![_{\\\w^])-?\d+/g;

/** nearMiss changes one number of an answer, which gives a wrong answer of the same form. */
function nearMiss(right: Text, index: number, delta: number): Text {
  const change = (text: string) => {
    let seen = -1;
    return text.replace(NUMBER, (found) => {
      seen++;
      return seen === index ? String(Number(found) + delta) : found;
    });
  };
  return t(change(right.en), change(right["zh-CN"]));
}

/** missWhy is what is said about a wrong option that changes one number of the answer. */
const missWhy = t("One number here is off. Work that entry out again.", "这里有一个数不对。把那个数重新算一遍。");

/**
 * oneOf builds a multiple-choice problem with options shuffled and deduplicated; whys say, at the same positions as wrong,
 * what mistake leads to each wrong option, and an option filled in by changing one number of the answer is told so.
 */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text, whys: readonly Text[] = []): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
      if (rest.length === 3) break;
    }
  }
  const count = right.en.match(NUMBER)?.length ?? 0;
  const start = rest.length < 3 && count > 0 ? rng.int(0, count - 1) : 0;
  for (let step = 0; step < 3 * count && rest.length < 3; step++) {
    const miss = nearMiss(right, (start + step) % count, [1, -1, 2][Math.floor(step / count)]!);
    if (!seen.has(miss.en)) {
      seen.add(miss.en);
      rest.push(miss);
    }
  }
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  const given: Reason[] = wrong.flatMap((w, i) => {
    const why = whys[i];
    return why ? [[w.en, why.en, why["zh-CN"]] as const] : [];
  });
  const filled: Reason[] = rest.filter((r) => !wrong.some((w) => w.en === r.en)).map((r) => [r.en, missWhy.en, missWhy["zh-CN"]] as const);
  return reasoned(choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution }), [
    ...given,
    ...filled,
  ]);
}

/** label writes the bold start of step i, followed by a space in English. */
function label(i: number, en: string, zh: string): Text {
  const s = stepLabel(i, en, zh);
  return t(`${s.en} `, s["zh-CN"]);
}

/** join puts texts one after another in each locale. */
const join = (...parts: readonly Text[]): Text => t(parts.map((p) => p.en).join(""), parts.map((p) => p["zh-CN"]).join(""));

/** para starts a new paragraph. */
const para = t("\n\n", "\n\n");

/** checked turns a text into a closing check paragraph. */
const checked = (c: Text) => t(`\n\n**Check.** ${c.en}`, `\n\n**检验。**${c["zh-CN"]}`);

/** shown is displayed math, one equation to a line, that closes a paragraph. */
const shown = (...lines: readonly string[]) => {
  const tex = `\n\n${lines.map((l) => `$$${l}$$`).join("\n\n")}`;
  return t(tex, tex);
};

/** paren writes a negative number in parentheses, for use inside a sum or a product. */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** sumOf writes numbers added one after another, with a negative one written as a subtraction. */
const sumOf = (ns: readonly number[]) => ns.map((n, i) => (i === 0 ? `${n}` : n < 0 ? ` - ${-n}` : ` + ${n}`)).join("");

/** dot writes a row times a column as a sum of products, its terms and its value: "2 \cdot 3 + (-1) \cdot 4 = 6 - 4 = 2". */
function dot(row: readonly number[], col: readonly number[]): string {
  const terms = row.map((r, k) => r * col[k]!);
  return `${row.map((r, k) => `${paren(r)} \\cdot ${paren(col[k]!)}`).join(" + ")} = ${sumOf(terms)} = ${terms.reduce((a, b) => a + b, 0)}`;
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
  intro: t(
    "You can work with numbers and expressions one at a time. A matrix keeps many numbers together in a rectangle, so that a whole table, such as the sales of several items over several days, can be handled as one object. Its size is given by how many rows run across it and how many columns run down it.\n\nThe sales of three items over two days might be\n\n$$S = \\begin{pmatrix} 3 & 0 & 5 \\\\ 1 & 2 & 4 \\end{pmatrix}$$\n\nwith one row for each day and one column for each item. It has $2$ rows and $3$ columns, so it is a $2 \\times 3$ matrix, and it holds $2 \\cdot 3 = 6$ numbers. The number $4$ sits in row $2$ and column $3$: on day $2$, four of the third item were sold.",
    "你会一个一个地处理数和式子。矩阵把许多数排成一个矩形放在一起，这样一整张表（比如几种商品在几天里的销量）就能当作一个对象来处理。它的大小由横着的行数和竖着的列数给出。\n\n三种商品两天的销量可以写成\n\n$$S = \\begin{pmatrix} 3 & 0 & 5 \\\\ 1 & 2 & 4 \\end{pmatrix}$$\n\n每天占一行，每种商品占一列。它有 $2$ 行 $3$ 列，所以是 $2 \\times 3$ 矩阵，共有 $2 \\cdot 3 = 6$ 个数。数 $4$ 在第 $2$ 行第 $3$ 列：第 $2$ 天第三种商品卖出了四件。",
  ),
  knowledgePoints: [
    {
      id: "matrix-dimensions-and-order",
      title: t("Matrix dimensions and order", "矩阵的维度与阶数"),
      explanation: t(
        "A matrix is a rectangular array of numbers arranged in rows (horizontal) and columns (vertical). A matrix with $m$ rows and $n$ columns has dimensions (or order) $m \\times n$, read '$m$ by $n$'.\n\n> **Watch out.** Rows run across and columns run down, and the rows come first. A matrix with $2$ rows and $3$ columns is $2 \\times 3$, not $3 \\times 2$.",
        "矩阵是由数排成的矩形阵列，由若干横行（row）和纵列（column）组成。具有 $m$ 行和 $n$ 列的矩阵其维度（或阶数）记作 $m \\times n$，读作“$m$ 乘 $n$”。\n\n> **注意。** 行是横的，列是竖的，行数写在前面。$2$ 行 $3$ 列的矩阵是 $2 \\times 3$，而不是 $3 \\times 2$。",
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
          join(
            label(1, "Count the rows", "数行数"),
            t(`Matrix $A$ has $${m}$ horizontal ${m === 1 ? "row" : "rows"}.`, `矩阵 $A$ 有 $${m}$ 个横行。`),
            para,
            label(2, "Count the columns", "数列数"),
            t(
              `It has $${n}$ vertical ${n === 1 ? "column" : "columns"}. Dimensions are written as rows $\\times$ columns, so $A$ is $${m} \\times ${n}$.`,
              `它有 $${n}$ 个纵列。维度写成“行数 $\\times$ 列数”，所以 $A$ 是 $${m} \\times ${n}$ 矩阵。`,
            ),
            checked(
              t(
                `Each row of $A$ holds $${n}$ ${n === 1 ? "entry" : "entries"}, one in each column, and each column holds $${m}$, one in each row. So there are $${m}$ rows and $${n}$ columns.`,
                `$A$ 的每一行有 $${n}$ 个元素（每列一个），每一列有 $${m}$ 个元素（每行一个）。所以有 $${m}$ 行、$${n}$ 列。`,
              ),
            ),
          ),
          [
            t(
              "This lists the columns first, but dimensions are rows $\\times$ columns.",
              "这里把列数写在前面，但维度是“行数 $\\times$ 列数”。",
            ),
            t(`$A$ has $${m}$ rows, not $${m + 1}$.`, `$A$ 有 $${m}$ 行，不是 $${m + 1}$ 行。`),
            t(`$A$ has $${n}$ columns, not $${n + 1}$.`, `$A$ 有 $${n}$ 列，不是 $${n + 1}$ 列。`),
            t(`$A$ has $${m}$ rows, not $${m - 1}$.`, `$A$ 有 $${m}$ 行，不是 $${m - 1}$ 行。`),
            t(`$A$ has $${n}$ columns, not $${n - 1}$.`, `$A$ 有 $${n}$ 列，不是 $${n - 1}$ 列。`),
          ],
        );
      },
    },
    {
      id: "number-of-entries-in-a-matrix",
      title: t("Number of entries in a matrix", "矩阵中元素的总数"),
      explanation: t(
        "A matrix of dimension $m \\times n$ contains a total of $m \\cdot n$ entries (or elements). An $m \\times 1$ matrix is called a column matrix (or column vector), and a $1 \\times n$ matrix is called a row matrix (or row vector).\n\n> **Watch out.** Multiply the two dimensions, do not add them. A $2 \\times 3$ matrix has $6$ entries, not $5$.",
        "一个 $m \\times n$ 阶的矩阵共包含 $m \\cdot n$ 个元素。只有一列的 $m \\times 1$ 矩阵称为列矩阵（或列向量），只有一行的 $1 \\times n$ 矩阵称为行矩阵（或行向量）。\n\n> **注意。** 两个维度要相乘，不是相加。$2 \\times 3$ 矩阵有 $6$ 个元素，而不是 $5$ 个。",
      ),
      generate(rng) {
        const m = rng.pick([2, 3, 4, 5]);
        const n = rng.pick([2, 3, 4]);
        const pool = [-9, -8, -6, -5, -3, -2, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const A: Mat = Array.from({ length: m }, () => Array.from({ length: n }, () => rng.pick(pool)));
        const aLatex = matLatex(A);
        const total = m * n;
        const rows = Array.from({ length: m }, () => n).join(" + ");

        return numberProblem({
          prompt: t(
            `How many total entries (elements) are in the matrix $A$?\n\n$$A = ${aLatex}$$`,
            `矩阵 $A$ 中总共包含多少个元素？\n\n$$A = ${aLatex}$$`,
          ),
          answer: total,
          wrong: [m + n, 2 * (m + n), total + 1, Math.max(1, total - 1), total + 2],
          solution: join(
            label(1, "Read the dimensions", "读出维度"),
            t(`Matrix $A$ has $${m}$ rows and $${n}$ columns.`, `矩阵 $A$ 有 $${m}$ 行、$${n}$ 列。`),
            para,
            label(2, "Multiply", "相乘"),
            t(
              `The number of entries is the row count times the column count: $${m} \\times ${n} = ${total}$.`,
              `元素个数等于行数乘列数：$${m} \\times ${n} = ${total}$。`,
            ),
            checked(
              t(
                `Add the rows one at a time. Each holds $${n}$ entries, and $${rows} = ${total}$.`,
                `逐行相加。每行有 $${n}$ 个元素，$${rows} = ${total}$。`,
              ),
            ),
          ),
        });
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
    "Use double-subscript notation $a_{ij}$ to locate and evaluate the entry in row $i$ and column $j$ of a matrix.",
    "用双下标记号 $a_{ij}$ 定位并计算矩阵第 $i$ 行第 $j$ 列的元素。",
  ),
  prerequisites: ["introduction-to-matrices"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.6"],
  intro: t(
    "You know that a matrix has rows and columns. To talk about one of its numbers, or to describe all of them by a rule, each entry gets a name with two indices: $a_{ij}$ is the entry of $A$ in row $i$ and column $j$. This is how a spreadsheet names a cell by its row and column.\n\nFor\n\n$$B = \\begin{pmatrix} 4 & -1 & 7 \\\\ 2 & 0 & 5 \\end{pmatrix}$$\n\nthe entry $b_{13}$ is in row $1$ and column $3$, so $b_{13} = 7$, while $b_{21} = 2$. There is no entry $b_{31}$, because $B$ has only $2$ rows.",
    "你知道矩阵有行和列。为了说出其中的某一个数，或者用一条规则描述所有的数，每个元素都用两个下标命名：$a_{ij}$ 是 $A$ 中第 $i$ 行第 $j$ 列的元素。这就像电子表格用行和列来命名一个单元格。\n\n对于\n\n$$B = \\begin{pmatrix} 4 & -1 & 7 \\\\ 2 & 0 & 5 \\end{pmatrix}$$\n\n元素 $b_{13}$ 在第 $1$ 行第 $3$ 列，所以 $b_{13} = 7$，而 $b_{21} = 2$。没有元素 $b_{31}$，因为 $B$ 只有 $2$ 行。",
  ),
  knowledgePoints: [
    {
      id: "identifying-matrix-entries-by-index",
      title: t("Identifying matrix entries by index", "根据下标确定矩阵元素"),
      explanation: t(
        "In a matrix $A = [a_{ij}]$, the first subscript $i$ indicates the row number and the second subscript $j$ indicates the column number. For example, $a_{23}$ is the entry in row 2 and column 3.\n\n> **Watch out.** The row index comes first. $a_{23}$ and $a_{32}$ are different entries: one is in row $2$, the other in row $3$.",
        "在矩阵 $A = [a_{ij}]$ 中，第一个下标 $i$ 表示行号，第二个下标 $j$ 表示列号。例如，$a_{23}$ 表示位于第 2 行第 3 列的元素。\n\n> **注意。** 行下标在前。$a_{23}$ 和 $a_{32}$ 是不同的元素：一个在第 $2$ 行，另一个在第 $3$ 行。",
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

        return numberProblem({
          prompt: t(
            `In the matrix $A$, what is the entry $a_{${i}${j}}$?\n\n$$A = ${aLatex}$$`,
            `在矩阵 $A$ 中，元素 $a_{${i}${j}}$ 的值是多少？\n\n$$A = ${aLatex}$$`,
          ),
          answer: target,
          wrong: wrongVals,
          solution: join(
            label(1, "Find the row", "找行"),
            t(
              `The first index is the row: row $${i}$ of $A$ is $${A[i - 1]!.join(", ")}$.`,
              `第一个下标是行号：$A$ 的第 $${i}$ 行是 $${A[i - 1]!.join(", ")}$。`,
            ),
            para,
            label(2, "Find the column", "找列"),
            t(
              `The second index is the column: entry number $${j}$ of that row is $${target}$, so $a_{${i}${j}} = ${target}$.`,
              `第二个下标是列号：这一行的第 $${j}$ 个元素是 $${target}$，所以 $a_{${i}${j}} = ${target}$。`,
            ),
            checked(
              t(
                `Read down column $${j}$ instead. It is $${A.map((r) => r[j - 1]!).join(", ")}$, and entry number $${i}$ is $${target}$.`,
                `改为沿第 $${j}$ 列向下读。这一列是 $${A.map((r) => r[j - 1]!).join(", ")}$，第 $${i}$ 个元素是 $${target}$。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "evaluating-entries-from-index-formula",
      title: t("Evaluating entries from index formulas", "根据下标公式计算矩阵元素"),
      explanation: t(
        "A matrix is often defined by a general formula for its entries $a_{ij} = f(i, j)$. To find a specific entry $a_{ij}$, substitute the row number $i$ and column number $j$ into the formula.\n\n> **Watch out.** Put the row number in for $i$ and the column number in for $j$. Swapping them gives $a_{ji}$, which is usually a different entry.",
        "矩阵的元素常由一般代数公式 $a_{ij} = f(i, j)$ 给出。要求出特定元素 $a_{ij}$，只需将行号 $i$ 与列号 $j$ 代入公式计算即可。\n\n> **注意。** 行号代入 $i$，列号代入 $j$。两者交换得到的是 $a_{ji}$，通常是另一个元素。",
      ),
      generate(rng) {
        const mode = rng.pick([0, 1, 2, 3]);
        const i = rng.pick([1, 2, 3]);
        const j = rng.pick([1, 2, 3]);

        let formulaLatex = "";
        let formulaZh = "";
        let val = 0;
        let altVal = 0;
        let entry = (_r: number, _s: number) => 0;
        let subst = "";

        if (mode === 0) {
          const c1 = rng.pick([-3, -2, -1, 1, 2, 3]);
          const c2 = rng.pick([-3, -2, -1, 1, 2, 3]);
          formulaLatex = `${c1 === 1 ? "" : c1 === -1 ? "-" : c1}i ${c2 < 0 ? "-" : "+"} ${Math.abs(c2) === 1 ? "" : Math.abs(c2)}j`;
          formulaZh = formulaLatex;
          val = c1 * i + c2 * j;
          altVal = c1 * j + c2 * i;
          entry = (r, s) => c1 * r + c2 * s;
          subst = `${paren(c1)} \\cdot ${i} + ${paren(c2)} \\cdot ${j}`;
        } else if (mode === 1) {
          const c = rng.pick([1, 2, 3]);
          formulaLatex = `i^2 - ${c === 1 ? "" : c}j`;
          formulaZh = formulaLatex;
          val = i * i - c * j;
          altVal = j * j - c * i;
          entry = (r, s) => r * r - c * s;
          subst = `${i}^2 - ${c} \\cdot ${j}`;
        } else if (mode === 2) {
          const c = rng.pick([2, 3, 4]);
          formulaLatex = `${c}i - j^2`;
          formulaZh = formulaLatex;
          val = c * i - j * j;
          altVal = c * j - i * i;
          entry = (r, s) => c * r - s * s;
          subst = `${c} \\cdot ${i} - ${j}^2`;
        } else {
          const c = rng.pick([1, 2]);
          formulaLatex = `(-1)^{i+j}(i + ${c === 1 ? "" : c}j)`;
          formulaZh = formulaLatex;
          val = ((i + j) % 2 === 0 ? 1 : -1) * (i + c * j);
          altVal = -val;
          entry = (r, s) => ((r + s) % 2 === 0 ? 1 : -1) * (r + c * s);
          subst = `(-1)^{${i + j}}(${i} + ${c} \\cdot ${j})`;
        }

        const row = [1, 2, 3].map((s) => entry(i, s));
        return numberProblem({
          prompt: t(
            `A $3 \\times 3$ matrix $A = [a_{ij}]$ has entries given by $a_{ij} = ${formulaLatex}$. Find the entry $a_{${i}${j}}$.`,
            `一个 $3 \\times 3$ 矩阵 $A = [a_{ij}]$ 的元素由 $a_{ij} = ${formulaZh}$ 给出。求元素 $a_{${i}${j}}$ 的值。`,
          ),
          answer: val,
          wrong: [altVal, -val, val + 1, val - 2, val + 3],
          solution: join(
            label(1, "Substitute", "代入"),
            t(
              `Put the row index $i = ${i}$ and the column index $j = ${j}$ into $a_{ij} = ${formulaLatex}$:`,
              `把行下标 $i = ${i}$ 和列下标 $j = ${j}$ 代入 $a_{ij} = ${formulaZh}$，得`,
            ),
            shown(`a_{${i}${j}} = ${subst}`),
            para,
            label(2, "Evaluate", "计算"),
            t(`This gives $a_{${i}${j}} = ${val}$.`, `结果是 $a_{${i}${j}} = ${val}$。`),
            checked(
              t(
                `Write out row $${i}$ from the rule. The entries $a_{${i}1}, a_{${i}2}, a_{${i}3}$ are $${row.join(", ")}$, and entry number $${j}$ is $${val}$.`,
                `由规则写出第 $${i}$ 行。元素 $a_{${i}1}, a_{${i}2}, a_{${i}3}$ 依次是 $${row.join(", ")}$，第 $${j}$ 个是 $${val}$。`,
              ),
            ),
          ),
        });
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
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.8"],
  intro: t(
    "You know how to read the size and the entries of a matrix. Two tables of the same shape, such as the sales of the same items in two weeks, combine entry by entry: the totals for both weeks are the sums of the matching entries. This is matrix addition, and subtraction works the same way.\n\nFor example,\n\n$$\\begin{pmatrix} 1 & 4 \\\\ 0 & -2 \\end{pmatrix} + \\begin{pmatrix} 3 & -1 \\\\ 5 & 2 \\end{pmatrix} = \\begin{pmatrix} 4 & 3 \\\\ 5 & 0 \\end{pmatrix}$$\n\nEach entry of the result comes from the entries in the same place: the top left is $1 + 3 = 4$, and the bottom right is $-2 + 2 = 0$. Matrices of different sizes have entries with no partner, so they cannot be added.",
    "你会读矩阵的大小和元素。形状相同的两张表（比如同样几种商品两周的销量）可以逐个元素合并：两周的总量就是对应元素之和。这就是矩阵加法，减法也一样。\n\n例如\n\n$$\\begin{pmatrix} 1 & 4 \\\\ 0 & -2 \\end{pmatrix} + \\begin{pmatrix} 3 & -1 \\\\ 5 & 2 \\end{pmatrix} = \\begin{pmatrix} 4 & 3 \\\\ 5 & 0 \\end{pmatrix}$$\n\n结果的每个元素都来自同一位置上的元素：左上是 $1 + 3 = 4$，右下是 $-2 + 2 = 0$。大小不同的矩阵有些元素找不到对应的元素，所以不能相加。",
  ),
  knowledgePoints: [
    {
      id: "matrix-addition-and-subtraction-computations",
      title: t("Adding and subtracting matrices of the same dimension", "同型矩阵的加法与减法计算"),
      explanation: t(
        "To add (or subtract) two matrices of the same dimensions, add (or subtract) corresponding entries: $(A \\pm B)_{ij} = a_{ij} \\pm b_{ij}$.\n\n> **Watch out.** Subtract each entry of $B$ with its sign: $3 - (-2) = 5$, not $1$.",
        "两个同型矩阵相加（或相减）时，只需将对应位置上的元素分别相加（或相减）：$(A \\pm B)_{ij} = a_{ij} \\pm b_{ij}$。\n\n> **注意。** 减去 $B$ 的元素时要连同符号：$3 - (-2) = 5$，而不是 $1$。",
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
        const work = A.map((r, i) => r.map((v, j) => `${v} ${opSymbol} ${paren(B[i]![j]!)}`));
        const back = isAdd ? matSub(C, B) : matAdd(C, B);

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
          join(
            label(1, "Check the dimensions", "检查维度"),
            t(
              `Both matrices are $${m} \\times ${n}$, so $A ${opSymbol} B$ is defined and is also $${m} \\times ${n}$.`,
              `两个矩阵都是 $${m} \\times ${n}$，所以 $A ${opSymbol} B$ 有定义，也是 $${m} \\times ${n}$ 矩阵。`,
            ),
            para,
            label(2, isAdd ? "Add matching entries" : "Subtract matching entries", isAdd ? "对应元素相加" : "对应元素相减"),
            t(`Each entry of the result is $a_{ij} ${opSymbol} b_{ij}$.`, `结果的每个元素是 $a_{ij} ${opSymbol} b_{ij}$。`),
            shown(`A ${opSymbol} B = ${matLatex(work)} = ${cLatex}`),
            checked(
              t(
                `${isAdd ? "Subtracting $B$ from the result" : "Adding $B$ to the result"} gives $${matLatex(back)}$. This is $A$ again.`,
                `${isAdd ? "结果减去 $B$" : "结果加上 $B$"}得 $${matLatex(back)}$。这正是 $A$。`,
              ),
            ),
          ),
          [
            isAdd
              ? t("This subtracts the entries instead of adding them.", "这里把元素相减了，应该相加。")
              : t("This adds the entries instead of subtracting them.", "这里把元素相加了，应该相减。"),
            isAdd
              ? t("This is $B - A$, a difference, not the sum.", "这是 $B - A$，是差而不是和。")
              : t("This subtracts in the wrong order: it is $B - A$.", "减法次序反了：这是 $B - A$。"),
            t(`The top left entry should be $${C[0]![0]!}$.`, `左上元素应该是 $${C[0]![0]!}$。`),
            t(`The bottom right entry should be $${C[m - 1]![n - 1]!}$.`, `右下元素应该是 $${C[m - 1]![n - 1]!}$。`),
          ],
        );
      },
    },
    {
      id: "matrix-addition-compatibility",
      title: t("Compatibility for matrix addition and subtraction", "矩阵加减法的条件与未定义情形"),
      explanation: t(
        "Matrix addition and subtraction are only defined for matrices of the exact same dimensions. If two matrices have different dimensions, their sum or difference is not defined.\n\n> **Watch out.** The same number of entries is not enough. A $2 \\times 3$ and a $3 \\times 2$ matrix both have $6$ entries, but they cannot be added.",
        "矩阵的加法与减法仅在两个矩阵具有完全相同的维度时才有定义。若两个矩阵维度不同，则它们的和或差是未定义的。\n\n> **注意。** 元素个数相同还不够。$2 \\times 3$ 矩阵和 $3 \\times 2$ 矩阵都有 $6$ 个元素，但它们不能相加。",
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
          n1 = chosen[1];
          m2 = chosen[0];
          n2 = chosen[1];
        }

        const pool = [-5, -4, -2, -1, 1, 2, 4, 5];
        const A: Mat = Array.from({ length: m1 }, () => Array.from({ length: n1 }, () => rng.pick(pool)));
        const B: Mat = Array.from({ length: m2 }, () => Array.from({ length: n2 }, () => rng.pick(pool)));

        const aBigger = m1 > m2 || n1 > n2;
        const owner = aBigger ? "A" : "B";
        const other = aBigger ? "B" : "A";
        const lone = aBigger ? `a_{${m1}${n1}}` : `b_{${m2}${n2}}`;
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
              t(`Defined; the sum has dimensions $${m1 + m2} \\times ${n1}$.`, `有定义；和矩阵的维度为 $${m1 + m2} \\times ${n1}$。`),
            ],
            join(
              label(1, "Read the dimensions", "读出维度"),
              t(
                `$A$ is $${m1} \\times ${n1}$ and $B$ is $${m2} \\times ${n2}$.`,
                `$A$ 是 $${m1} \\times ${n1}$，$B$ 是 $${m2} \\times ${n2}$。`,
              ),
              para,
              label(2, "Compare them", "比较维度"),
              t(
                `The dimensions are the same, so $A + B$ is defined and produces ${article(m1)} $${m1} \\times ${n1}$ matrix.`,
                `维度完全相同，所以 $A + B$ 有定义，结果是 $${m1} \\times ${n1}$ 矩阵。`,
              ),
              checked(
                t(
                  `Every position of $A$, from row $1$ to row $${m1}$ and column $1$ to column $${n1}$, also holds an entry of $B$. So each entry has exactly one partner, and the sum keeps the shape $${m1} \\times ${n1}$.`,
                  `$A$ 的每个位置（第 $1$ 行到第 $${m1}$ 行、第 $1$ 列到第 $${n1}$ 列）上 $B$ 也都有元素。所以每个元素恰好有一个对应元素，和保持 $${m1} \\times ${n1}$ 的形状。`,
                ),
              ),
            ),
            [
              t(`Both are $${m1} \\times ${n1}$, so the dimensions do match.`, `两者都是 $${m1} \\times ${n1}$，维度是相同的。`),
              t("The sum has the same shape as the two matrices; nothing is turned around.", "和与两个矩阵形状相同，行列不会互换。"),
              t("Adding matrices adds their entries, not their dimensions.", "矩阵相加是元素相加，不是维度相加。"),
              t("Adding matrices adds their entries, not their dimensions.", "矩阵相加是元素相加，不是维度相加。"),
            ],
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
            t(
              `Defined; the sum has dimensions $${m1 + m2} \\times ${n1 + n2}$.`,
              `有定义；和矩阵的维度为 $${m1 + m2} \\times ${n1 + n2}$。`,
            ),
          ],
          join(
            label(1, "Read the dimensions", "读出维度"),
            t(
              `$A$ is $${m1} \\times ${n1}$ and $B$ is $${m2} \\times ${n2}$.`,
              `$A$ 是 $${m1} \\times ${n1}$，$B$ 是 $${m2} \\times ${n2}$。`,
            ),
            para,
            label(2, "Compare them", "比较维度"),
            t("The dimensions are not identical, so addition is not defined.", "维度不相同，所以加法没有定义。"),
            checked(
              t(
                `Try pairing the entries. The entry $${lone}$ of $${owner}$ has no entry in the same position of $${other}$, so it has nothing to be added to.`,
                `试着把元素配对。$${owner}$ 的元素 $${lone}$ 在 $${other}$ 的同一位置上没有元素，没有可以与它相加的数。`,
              ),
            ),
          ),
          [
            t(
              `No size works: $${m1} \\times ${n1}$ and $${m2} \\times ${n2}$ are different dimensions.`,
              `任何大小都不对：$${m1} \\times ${n1}$ 和 $${m2} \\times ${n2}$ 是不同的维度。`,
            ),
            t(
              `No size works: $${m1} \\times ${n1}$ and $${m2} \\times ${n2}$ are different dimensions.`,
              `任何大小都不对：$${m1} \\times ${n1}$ 和 $${m2} \\times ${n2}$ 是不同的维度。`,
            ),
            t(
              "Padding the smaller matrix is not allowed: the dimensions must already be equal.",
              "不能把较小的矩阵补齐：维度必须本来就相同。",
            ),
            t(
              "Adding matrices adds their entries, not their dimensions, and here the dimensions differ.",
              "矩阵相加是元素相加，不是维度相加，而这里维度不同。",
            ),
          ],
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
  intro: t(
    "You can add matrices of the same size entry by entry. Because each entry is an ordinary sum of numbers, the rules of addition for numbers carry over: the order and the grouping do not matter, adding the zero matrix changes nothing, and every matrix has an opposite. These rules let you rearrange and solve matrix equations the way you do with numbers.\n\nFor example,\n\n$$\\begin{pmatrix} 2 & -1 \\\\ 0 & 3 \\end{pmatrix} + \\begin{pmatrix} 4 & 5 \\\\ -2 & 1 \\end{pmatrix} = \\begin{pmatrix} 6 & 4 \\\\ -2 & 4 \\end{pmatrix}$$\n\nand adding in the other order gives the same matrix, since $2 + 4 = 4 + 2$, $-1 + 5 = 5 + (-1)$, and so on for every entry.",
    "你会把同样大小的矩阵逐个元素相加。由于每个元素都是普通的数相加，数的加法规则也就沿用过来：次序和结合方式都不影响结果，加上零矩阵不改变矩阵，每个矩阵都有相反矩阵。有了这些规则，就能像处理数那样整理和求解矩阵方程。\n\n例如\n\n$$\\begin{pmatrix} 2 & -1 \\\\ 0 & 3 \\end{pmatrix} + \\begin{pmatrix} 4 & 5 \\\\ -2 & 1 \\end{pmatrix} = \\begin{pmatrix} 6 & 4 \\\\ -2 & 4 \\end{pmatrix}$$\n\n换个次序相加得到同一个矩阵，因为 $2 + 4 = 4 + 2$，$-1 + 5 = 5 + (-1)$，每个元素都是这样。",
  ),
  knowledgePoints: [
    {
      id: "commutative-and-associative-properties-of-matrix-addition",
      title: t("Commutative and associative properties", "矩阵加法的交换律与结合律"),
      explanation: t(
        "Matrix addition satisfies the commutative property $A + B = B + A$ and associative property $(A + B) + C = A + (B + C)$ for all matrices of the same dimension.\n\n> **Watch out.** To find an unknown entry, subtract the known entry with its sign: from $-3 + x = 5$, $x = 5 - (-3) = 8$, not $2$.",
        "同型矩阵的加法满足交换律 $A + B = B + A$ 与结合律 $(A + B) + C = A + (B + C)$。\n\n> **注意。** 求未知元素时，要连同符号减去已知元素：由 $-3 + x = 5$ 得 $x = 5 - (-3) = 8$，而不是 $2$。",
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
        const aVal = A[targetRow]![targetCol]!;
        const cVal = C[targetRow]![targetCol]!;

        const bDisplay: (readonly (number | string)[])[] = B.map((row, r) =>
          row.map((val, c) => (r === targetRow && c === targetCol ? "x" : val)),
        );

        return numberProblem({
          prompt: t(
            `Find the value of $x$ that satisfies the matrix equation:\n\n$$${matLatex(A)} + ${matLatex(bDisplay)} = ${matLatex(C)}$$`,
            `求满足下列矩阵方程的未知数 $x$ 的值：\n\n$$${matLatex(A)} + ${matLatex(bDisplay)} = ${matLatex(C)}$$`,
          ),
          solveFor: "x",
          answer: x,
          wrong: [-x, x + 1, x - 2, cVal + aVal],
          solution: join(
            label(1, "Match the entry", "对应元素"),
            t(
              `The unknown sits in row $${targetRow + 1}$, column $${targetCol + 1}$. Matching entries are added, so $${aVal} + x = ${cVal}$.`,
              `未知数在第 $${targetRow + 1}$ 行第 $${targetCol + 1}$ 列。对应元素相加，所以 $${aVal} + x = ${cVal}$。`,
            ),
            para,
            label(2, "Solve", "求解"),
            t(
              `Subtract $${aVal}$ from both sides: $x = ${cVal} - ${paren(aVal)} = ${x}$.`,
              `两边减去 $${aVal}$：$x = ${cVal} - ${paren(aVal)} = ${x}$。`,
            ),
            checked(
              t(
                `Add in the other order, $B + A$. The same entry is $${x} + ${paren(aVal)} = ${cVal}$, the entry of the right side.`,
                `换成 $B + A$ 的次序相加。同一位置的元素是 $${x} + ${paren(aVal)} = ${cVal}$，正是右边的元素。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "additive-identity-and-additive-inverse",
      title: t("Additive identity and additive inverse", "加法单位元与加法逆元"),
      explanation: t(
        "The zero matrix $O$ has all entries equal to 0 and acts as the additive identity: $A + O = A$. The additive inverse of $A$ is $-A$, satisfying $A + (-A) = O$.\n\n> **Watch out.** Negate every entry, the negative ones too: the opposite of $-3$ is $3$.",
        "零矩阵 $O$ 的所有元素均为 0，是矩阵加法的单位元，满足 $A + O = A$。矩阵 $A$ 的加法逆元是其相反矩阵 $-A$，满足 $A + (-A) = O$。\n\n> **注意。** 每个元素都要取相反数，负的也一样：$-3$ 的相反数是 $3$。",
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
          join(
            label(1, "Cancel each entry", "抵消每个元素"),
            t(
              "Each entry of $X$ must cancel the entry of $A$ in the same place, so that the sum there is $0$.",
              "$X$ 的每个元素都必须抵消 $A$ 同一位置的元素，使那里的和为 $0$。",
            ),
            para,
            label(2, "Negate", "取相反数"),
            t("So every entry of $A$ changes sign, and $X = -A$:", "所以 $A$ 的每个元素都变号，$X = -A$："),
            shown(`X = ${matLatex(negA)}`),
            checked(
              t(
                `Add $X$ to $A$ entry by entry: $${matLatex(A.map((r, i) => r.map((v, j) => `${v} + ${paren(negA[i]![j]!)}`)))} = O$. This is the zero matrix.`,
                `把 $X$ 与 $A$ 逐个元素相加：$${matLatex(A.map((r, i) => r.map((v, j) => `${v} + ${paren(negA[i]![j]!)}`)))} = O$。这正是零矩阵。`,
              ),
            ),
          ),
          [
            t("This is $A$ itself, and $A + A = 2A$, not $O$.", "这是 $A$ 本身，而 $A + A = 2A$，不是 $O$。"),
            t(
              "This is the transpose of $A$. Its entries are moved, not made opposite.",
              "这是 $A$ 的转置。它的元素只是换了位置，没有变成相反数。",
            ),
            t(`The top right entry has the wrong sign: it should be $${negA[0]![1]!}$.`, `右上元素的符号错了：应该是 $${negA[0]![1]!}$。`),
            t(
              "Adding a matrix of ones raises every entry by $1$; it does not cancel $A$.",
              "加上全是 $1$ 的矩阵只会让每个元素增加 $1$，不能抵消 $A$。",
            ),
          ],
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
  encompasses: [],
  xp: 11,
  standards: ["CCSS.HSN.VM.C.7", "CCSS.HSN.VM.C.8"],
  intro: t(
    "You can add matrices entry by entry. Adding a matrix to itself several times multiplies each entry by the same number, and this is scalar multiplication: a price list scaled by a tax rate, or a recipe table doubled, changes every entry by one factor. With it and addition, you can build combinations such as $2A - 3B$.\n\nFor example,\n\n$$3 \\begin{pmatrix} 2 & -1 \\\\ 0 & 4 \\end{pmatrix} = \\begin{pmatrix} 6 & -3 \\\\ 0 & 12 \\end{pmatrix}$$\n\nEvery entry is multiplied by $3$. This is the same as adding the matrix to itself three times, since $2 + 2 + 2 = 6$ and $-1 + (-1) + (-1) = -3$.",
    "你会把矩阵逐个元素相加。把一个矩阵自己加几次，每个元素都乘上同一个数，这就是数乘：按税率调整价目表，或把配方表加倍，都是让每个元素变化同一个倍数。有了数乘和加法，就能构造 $2A - 3B$ 这样的组合。\n\n例如\n\n$$3 \\begin{pmatrix} 2 & -1 \\\\ 0 & 4 \\end{pmatrix} = \\begin{pmatrix} 6 & -3 \\\\ 0 & 12 \\end{pmatrix}$$\n\n每个元素都乘以 $3$。这与把矩阵自己加三次相同，因为 $2 + 2 + 2 = 6$，$-1 + (-1) + (-1) = -3$。",
  ),
  knowledgePoints: [
    {
      id: "computing-scalar-multiplication",
      title: t("Computing scalar multiples of matrices", "计算矩阵的数乘"),
      explanation: t(
        "Multiplying a matrix by a number changes every entry in the same way, so the result has the same size as the original matrix. To multiply a matrix $A$ by a scalar $k$, multiply every entry in $A$ by $k$: $(k A)_{ij} = k \\cdot a_{ij}$.\n\n> **Watch out.** The sign of $k$ reaches every entry: $-2 \\cdot (-3) = 6$, so a negative scalar turns negative entries positive.",
        "用一个数乘矩阵时，每个元素都按同样的方式改变，所以结果与原矩阵的大小相同。用标量（实数）$k$ 乘以矩阵 $A$ 时，需要将矩阵 $A$ 中的每一个元素都乘以 $k$：$(k A)_{ij} = k \\cdot a_{ij}$。\n\n> **注意。** $k$ 的符号作用到每个元素：$-2 \\cdot (-3) = 6$，所以负的标量会把负元素变成正的。",
      ),
      generate(rng) {
        const k = rng.pick([-4, -3, -2, 2, 3, 4, 5]);
        const pool = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
        const A: Mat = [
          [rng.pick(pool), rng.pick(pool)],
          [rng.pick(pool), rng.pick(pool)],
        ];
        const i = rng.pick([1, 2]);
        const j = rng.pick([1, 2]);
        const aVal = A[i - 1]![j - 1]!;
        const val = k * aVal;
        const repeated = Array.from({ length: Math.abs(k) }, () => paren(aVal)).join(" + ");

        return numberProblem({
          prompt: t(
            `For the matrix $A$, compute the entry in row $${i}$, column $${j}$ of the scalar multiple $${k}A$:\n\n$$A = ${matLatex(A)}$$`,
            `对于矩阵 $A$，计算数乘矩阵 $${k}A$ 中位于第 $${i}$ 行第 $${j}$ 列的元素：\n\n$$A = ${matLatex(A)}$$`,
          ),
          answer: val,
          wrong: [aVal, -val, k + aVal, val + k, val - k],
          solution: join(
            label(1, "Find the entry", "找出元素"),
            t(
              `The entry of $A$ in row $${i}$, column $${j}$ is $a_{${i}${j}} = ${aVal}$.`,
              `$A$ 中第 $${i}$ 行第 $${j}$ 列的元素是 $a_{${i}${j}} = ${aVal}$。`,
            ),
            para,
            label(2, "Multiply", "相乘"),
            t(
              `Multiply it by the scalar $k = ${k}$: $(${k} A)_{${i}${j}} = ${k} \\cdot ${paren(aVal)} = ${val}$.`,
              `把它乘以标量 $k = ${k}$：$(${k} A)_{${i}${j}} = ${k} \\cdot ${paren(aVal)} = ${val}$。`,
            ),
            checked(
              k > 0
                ? t(
                    `Adding $A$ to itself $${k}$ times gives the same entry: $${repeated} = ${val}$.`,
                    `把 $A$ 自己加 $${k}$ 次，得到同一个元素：$${repeated} = ${val}$。`,
                  )
                : t(
                    `$${k}A$ is the opposite of $A$ added to itself $${-k}$ times: $-(${repeated}) = -${paren(-val)} = ${val}$.`,
                    `$${k}A$ 是把 $A$ 自己加 $${-k}$ 次再取相反数：$-(${repeated}) = -${paren(-val)} = ${val}$。`,
                  ),
            ),
          ),
        });
      },
    },
    {
      id: "distributive-properties-of-scalar-multiplication",
      title: t("Distributive properties of scalar multiplication", "数乘矩阵的分配律与线性组合"),
      explanation: t(
        "Scalar multiplication distributes over matrix addition: $k(A + B) = kA + kB$, and $(c + d)A = cA + dA$. A linear combination of matrices is an expression of the form $c_1 A + c_2 B$.\n\n> **Watch out.** A minus sign in front of a term multiplies every entry of that matrix: in $2A - 3B$, each entry of $B$ is multiplied by $-3$, the negative ones too.",
        "数乘对矩阵加法满足分配律：$k(A + B) = kA + kB$ 以及 $(c + d)A = cA + dA$。形如 $c_1 A + c_2 B$ 的式子称为矩阵的线性组合。\n\n> **注意。** 一项前面的减号会乘到那个矩阵的每个元素上：在 $2A - 3B$ 中，$B$ 的每个元素都乘以 $-3$，负的元素也一样。",
      ),
      generate(rng) {
        const c1 = rng.pick([2, 3, 4]);
        const c2 = rng.pick([-3, -2, 2, 3]);
        const pool = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
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
        const aVal = A[i - 1]![j - 1]!;
        const bVal = B[i - 1]![j - 1]!;
        const val = c1 * aVal + c2 * bVal;
        const signStr = c2 < 0 ? `- ${-c2}` : `+ ${c2}`;

        const wrongSignVal = c1 * aVal - c2 * bVal;
        const swappedVal = c2 * aVal + c1 * bVal;

        const term1 = c1 * aVal;
        const term2 = c2 * bVal;
        const step2 = term2 < 0 ? `${term1} - ${-term2}` : `${term1} + ${term2}`;

        return numberProblem({
          prompt: t(
            `For the matrices $A$ and $B$, compute the entry in row $${i}$, column $${j}$ of the linear combination $C = ${c1}A ${signStr} B$:\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
            `对于矩阵 $A$ 与 $B$，计算线性组合 $C = ${c1}A ${signStr} B$ 中位于第 $${i}$ 行第 $${j}$ 列的元素 $c_{${i}${j}}$：\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
          ),
          answer: val,
          wrong: [wrongSignVal, swappedVal, -val, val + 1, val - 2],
          solution: join(
            label(1, "Pick out the entries", "取出元素"),
            t(
              `In row $${i}$, column $${j}$, the entries are $a_{${i}${j}} = ${aVal}$ and $b_{${i}${j}} = ${bVal}$.`,
              `第 $${i}$ 行第 $${j}$ 列的元素是 $a_{${i}${j}} = ${aVal}$ 和 $b_{${i}${j}} = ${bVal}$。`,
            ),
            para,
            label(2, "Combine them", "组合"),
            t("Scale each entry and add:", "把每个元素数乘后相加："),
            shown(`c_{${i}${j}} = ${c1}(${aVal}) ${c2 < 0 ? "-" : "+"} ${Math.abs(c2)}(${bVal}) = ${step2} = ${val}`),
            checked(
              t(
                `Regroup as $${c1}(A + B) + ${paren(c2 - c1)}B$. The entry of $A + B$ is $${aVal + bVal}$, so the entry is $${c1} \\cdot ${paren(aVal + bVal)} + ${paren(c2 - c1)} \\cdot ${paren(bVal)} = ${sumOf([c1 * (aVal + bVal), (c2 - c1) * bVal])} = ${val}$.`,
                `改写成 $${c1}(A + B) + ${paren(c2 - c1)}B$。$A + B$ 的这个元素是 $${aVal + bVal}$，所以所求元素为 $${c1} \\cdot ${paren(aVal + bVal)} + ${paren(c2 - c1)} \\cdot ${paren(bVal)} = ${sumOf([c1 * (aVal + bVal), (c2 - c1) * bVal])} = ${val}$。`,
              ),
            ),
          ),
        });
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
  encompasses: [{ topic: "introduction-to-matrices", weight: 0.2 }],
  xp: 11,
  standards: ["CCSS.HSN.VM.C.6", "CCSS.HSN.VM.C.10"],
  intro: t(
    "You can read the size and the entries of a matrix. A few shapes come up so often that they have names: square matrices, whose rows and columns are equally many; diagonal matrices, which are square with zeros off the main diagonal; the identity matrix, a diagonal matrix with ones on the diagonal; and the zero matrix, all of whose entries are $0$. The identity and the zero matrix play the parts of $1$ and $0$ in matrix arithmetic.\n\nThe matrix\n\n$$D = \\begin{pmatrix} 5 & 0 & 0 \\\\ 0 & -2 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$\n\nis square, $3 \\times 3$, and every entry off the main diagonal is $0$, so it is diagonal. It is not the identity $I_3$, because its diagonal entries $5$ and $-2$ are not $1$.",
    "你会读矩阵的大小和元素。有几种形状经常出现，所以有专门的名字：方阵的行数和列数相等；对角矩阵是主对角线以外都是零的方阵；单位矩阵是对角线上全为一的对角矩阵；零矩阵的所有元素都是 $0$。在矩阵运算中，单位矩阵和零矩阵分别起着 $1$ 和 $0$ 的作用。\n\n矩阵\n\n$$D = \\begin{pmatrix} 5 & 0 & 0 \\\\ 0 & -2 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$\n\n是 $3 \\times 3$ 方阵，主对角线以外的元素都是 $0$，所以是对角矩阵。它不是单位矩阵 $I_3$，因为对角元素 $5$ 和 $-2$ 不是 $1$。",
  ),
  knowledgePoints: [
    {
      id: "classifying-special-matrices",
      title: t("Classifying special types of matrices", "特殊矩阵的分类与识别"),
      explanation: t(
        "A square matrix has $m = n$ (equal rows and columns). A diagonal matrix is a square matrix whose entries outside the main diagonal are all 0 ($a_{ij} = 0$ for $i \\ne j$). The identity matrix $I_n$ is a diagonal matrix whose main diagonal entries are all 1.\n\n> **Watch out.** A diagonal matrix may have any numbers on its diagonal, even different ones; only the identity needs them all to be $1$. Every diagonal matrix is square, but a square matrix need not be diagonal.",
        "方阵是行数等于列数（$m = n$）的矩阵。对角矩阵是主对角线之外所有元素均为 0（即当 $i \\ne j$ 时 $a_{ij} = 0$）的方阵。单位矩阵 $I_n$ 是主对角线上所有元素均为 1 的对角矩阵。\n\n> **注意。** 对角矩阵的对角线上可以是任何数，也可以各不相同；只有单位矩阵要求它们都是 $1$。对角矩阵一定是方阵，但方阵不一定是对角矩阵。",
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
            join(
              label(1, "Check the shape", "看形状"),
              t("$A$ has $2$ rows and $2$ columns, so it is square.", "$A$ 有 $2$ 行 $2$ 列，所以是方阵。"),
              para,
              label(2, "Look off the diagonal", "看对角线以外"),
              t(
                "Both entries off the main diagonal are $0$, so $A$ is a diagonal matrix.",
                "主对角线以外的两个元素都是 $0$，所以 $A$ 是对角矩阵。",
              ),
              checked(
                t(
                  `Test the other names. The diagonal entries $${d1}$ and $${d2}$ are not $1$, so $A$ is not the identity, and they are not $0$, so $A$ is not the zero matrix. Of the names offered, only diagonal fits.`,
                  `逐一检验其他名称。对角元素 $${d1}$ 和 $${d2}$ 不是 $1$，所以 $A$ 不是单位矩阵；它们也不是 $0$，所以 $A$ 不是零矩阵。在给出的名称中只有对角矩阵符合。`,
                ),
              ),
            ),
            [
              t(
                `The identity needs $1$ on the diagonal, but here the diagonal entries are $${d1}$ and $${d2}$.`,
                `单位矩阵的对角线上必须是 $1$，而这里的对角元素是 $${d1}$ 和 $${d2}$。`,
              ),
              t(
                "A zero matrix has every entry $0$, but the diagonal entries here are not $0$.",
                "零矩阵的每个元素都是 $0$，而这里的对角元素不是 $0$。",
              ),
              t("A row matrix has a single row, and $A$ has $2$.", "行矩阵只有一行，而 $A$ 有 $2$ 行。"),
              t("$A$ has $2$ rows and $2$ columns, so it is square.", "$A$ 有 $2$ 行 $2$ 列，所以是方阵。"),
            ],
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
            join(
              label(1, "Check the shape", "看形状"),
              t("$A$ has $2$ rows and $2$ columns, so it is square.", "$A$ 有 $2$ 行 $2$ 列，所以是方阵。"),
              para,
              label(2, "Look off the diagonal", "看对角线以外"),
              t(
                `The entries off the main diagonal are $a_{12} = ${A[0]![1]!}$ and $a_{21} = ${A[1]![0]!}$, which are not $0$. So $A$ is square but not diagonal.`,
                `主对角线以外的元素是 $a_{12} = ${A[0]![1]!}$ 和 $a_{21} = ${A[1]![0]!}$，不是 $0$。所以 $A$ 是方阵，但不是对角矩阵。`,
              ),
              checked(
                t(
                  `Test the other names. A diagonal matrix, the identity and the zero matrix all need $0$ off the main diagonal, and $a_{12} = ${A[0]![1]!}$ is not $0$. A column vector has one column, and $A$ has $2$. Only square fits.`,
                  `逐一检验其他名称。对角矩阵、单位矩阵和零矩阵都要求主对角线以外为 $0$，而 $a_{12} = ${A[0]![1]!}$ 不是 $0$。列向量只有一列，而 $A$ 有 $2$ 列。只有方阵符合。`,
                ),
              ),
            ),
            [
              t(
                `$a_{12} = ${A[0]![1]!}$ is off the diagonal and not $0$, so $A$ is not diagonal.`,
                `$a_{12} = ${A[0]![1]!}$ 在对角线以外且不是 $0$，所以 $A$ 不是对角矩阵。`,
              ),
              t("The identity needs $0$ off the diagonal and $1$ on it.", "单位矩阵要求对角线以外为 $0$，对角线上为 $1$。"),
              t("A zero matrix has every entry $0$, and these entries are not.", "零矩阵的每个元素都是 $0$，而这里的元素不是。"),
              t("A column vector has a single column, and $A$ has $2$.", "列向量只有一列，而 $A$ 有 $2$ 列。"),
            ],
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
          join(
            label(1, "Count rows and columns", "数行和列"),
            t(`$A$ has $${m}$ rows and $${n}$ columns.`, `$A$ 有 $${m}$ 行 $${n}$ 列。`),
            para,
            label(2, "Compare them", "比较"),
            t(
              `Since $${m} \\ne ${n}$, $A$ is not square. It is a rectangular $${m} \\times ${n}$ matrix.`,
              `由于 $${m} \\ne ${n}$，$A$ 不是方阵。它是 $${m} \\times ${n}$ 的矩形矩阵。`,
            ),
            checked(
              t(
                `Test the other names. Diagonal matrices and the identity are square by definition, so they are ruled out with square. A zero matrix has every entry $0$, but $a_{11} = ${A[0]![0]!}$. Only rectangular fits.`,
                `逐一检验其他名称。对角矩阵和单位矩阵按定义都是方阵，所以和方阵一起被排除。零矩阵的每个元素都是 $0$，而 $a_{11} = ${A[0]![0]!}$。只有矩形矩阵符合。`,
              ),
            ),
          ),
          [
            t(
              `A square matrix has as many rows as columns, but $A$ has $${m}$ rows and $${n}$ columns.`,
              `方阵的行数等于列数，而 $A$ 有 $${m}$ 行 $${n}$ 列。`,
            ),
            t("A diagonal matrix must be square.", "对角矩阵必须是方阵。"),
            t("The identity matrix must be square.", "单位矩阵必须是方阵。"),
            t(`A zero matrix has every entry $0$, but $a_{11} = ${A[0]![0]!}$.`, `零矩阵的每个元素都是 $0$，而 $a_{11} = ${A[0]![0]!}$。`),
          ],
        );
      },
    },
    {
      id: "properties-of-identity-and-diagonal-matrices",
      title: t("Entries of diagonal and identity matrices", "对角矩阵与单位矩阵的未知数求解"),
      explanation: t(
        "For a matrix to be a diagonal matrix, all non-diagonal entries must be 0. For it to be the $2 \\times 2$ identity matrix $I_2$, the diagonal entries must equal 1 and the non-diagonal entries must equal 0.\n\n> **Watch out.** Only the entries off the diagonal must be $0$; the diagonal entries of a diagonal matrix can be any numbers. Solve $x - 3 = 0$ as $x = 3$, keeping track of the sign.",
        "若一个方阵是对角矩阵，则其所有非对角线上的元素必须为 0。若为 $2 \\times 2$ 单位矩阵 $I_2$，则主对角线元素必须全为 1，非对角线元素必须全为 0。\n\n> **注意。** 只有对角线以外的元素必须是 $0$；对角矩阵的对角元素可以是任何数。解 $x - 3 = 0$ 得 $x = 3$，注意符号。",
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
          join(
            label(1, "Set the off-diagonal entries to 0", "令对角线以外的元素为 0"),
            t(
              `In a diagonal matrix every entry off the main diagonal is $0$, so $x ${signC1} = 0$ and $y ${signC2} = 0$.`,
              `对角矩阵主对角线以外的元素都是 $0$，所以 $x ${signC1} = 0$，$y ${signC2} = 0$。`,
            ),
            para,
            label(2, "Solve", "求解"),
            t(`These give $x = ${xAns}$ and $y = ${yAns}$.`, `解得 $x = ${xAns}$，$y = ${yAns}$。`),
            checked(
              t(
                `Put the values back. The top right entry becomes $${xAns} ${signC1} = 0$ and the bottom left entry becomes $${yAns} ${signC2} = 0$, while the diagonal entries $${d1}$ and $${d2}$ may be anything. So $M$ is diagonal.`,
                `把值代回去。右上元素变成 $${xAns} ${signC1} = 0$，左下元素变成 $${yAns} ${signC2} = 0$，对角元素 $${d1}$ 和 $${d2}$ 可以是任何数。所以 $M$ 是对角矩阵。`,
              ),
            ),
          ),
          [
            t("Both values have the wrong sign.", "两个值的符号都错了。"),
            t(`$y$ has the wrong sign: $y ${signC2} = 0$ gives $y = ${yAns}$.`, `$y$ 的符号错了：由 $y ${signC2} = 0$ 得 $y = ${yAns}$。`),
            t(`$x$ has the wrong sign: $x ${signC1} = 0$ gives $x = ${xAns}$.`, `$x$ 的符号错了：由 $x ${signC1} = 0$ 得 $x = ${xAns}$。`),
            t(
              `With $x = 0$ the top right entry is $0 ${signC1} = ${-c1}$, not $0$.`,
              `$x = 0$ 时右上元素是 $0 ${signC1} = ${-c1}$，不是 $0$。`,
            ),
          ],
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
    "Find the transpose $A^T$ of an $m \\times n$ matrix, see that it is $n \\times m$, and identify symmetric matrices.",
    "求 $m \\times n$ 矩阵的转置 $A^T$，理解它是 $n \\times m$ 矩阵，并掌握对称矩阵的概念。",
  ),
  prerequisites: ["index-notation-for-matrices"],
  encompasses: [],
  xp: 11,
  standards: ["CCSS.HSN.VM.C.6"],
  intro: t(
    "You can name each entry of a matrix by its row and column, $a_{ij}$. The transpose swaps these two roles: the entry in row $i$ and column $j$ moves to row $j$ and column $i$. A table with one row for each day and one column for each item becomes a table with one row for each item, and the transpose is needed later for symmetric matrices and for fitting products together.\n\nFor example,\n\n$$\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}^T = \\begin{pmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{pmatrix}$$\n\nThe first row $1, 2, 3$ has become the first column, and the $2 \\times 3$ matrix has become $3 \\times 2$.",
    "你会用行号和列号给矩阵的元素命名，$a_{ij}$。转置把这两个角色互换：第 $i$ 行第 $j$ 列的元素移到第 $j$ 行第 $i$ 列。每天一行、每种商品一列的表，变成每种商品一行的表。以后研究对称矩阵、让乘积的形状相配时都要用到转置。\n\n例如\n\n$$\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}^T = \\begin{pmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{pmatrix}$$\n\n第一行 $1, 2, 3$ 变成了第一列，$2 \\times 3$ 矩阵变成了 $3 \\times 2$ 矩阵。",
  ),
  knowledgePoints: [
    {
      id: "computing-the-transpose-of-a-matrix",
      title: t("Computing the transpose of a matrix", "求矩阵的转置"),
      explanation: t(
        "The transpose of an $m \\times n$ matrix $A$, denoted $A^T$, is the $n \\times m$ matrix formed by interchanging its rows and columns: $(A^T)_{ij} = a_{ji}$.\n\n> **Watch out.** Transposing only moves entries. It does not reverse the order of the rows or change any sign, and an $m \\times n$ matrix becomes $n \\times m$.",
        "$m \\times n$ 矩阵 $A$ 的转置记作 $A^T$，是一个 $n \\times m$ 矩阵，通过交换 $A$ 的行与列得到：$(A^T)_{ij} = a_{ji}$。\n\n> **注意。** 转置只移动元素的位置，不会把行的次序倒过来，也不改变符号；$m \\times n$ 矩阵变成 $n \\times m$ 矩阵。",
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
          join(
            label(1, "Find the size", "确定大小"),
            t(
              `$A$ is $${m} \\times ${n}$, so $A^T$ is $${n} \\times ${m}$.`,
              `$A$ 是 $${m} \\times ${n}$ 矩阵，所以 $A^T$ 是 $${n} \\times ${m}$ 矩阵。`,
            ),
            para,
            label(2, "Turn rows into columns", "行变成列"),
            t(`Row $i$ of $A$ becomes column $i$ of $A^T$:`, `$A$ 的第 $i$ 行变成 $A^T$ 的第 $i$ 列：`),
            shown(`A^T = ${atLatex}`),
            checked(
              t(
                `Read down the columns of $A$ instead. They are $${A[0]!.map((_, j) => `(${A.map((r) => r[j]!).join(", ")})`).join(", ")}$, and these are the rows of $A^T$ in order, as $(A^T)_{ij} = a_{ji}$ requires.`,
                `改为沿 $A$ 的各列向下读。它们是 $${A[0]!.map((_, j) => `(${A.map((r) => r[j]!).join(", ")})`).join(", ")}$，正好依次是 $A^T$ 的各行，符合 $(A^T)_{ij} = a_{ji}$。`,
              ),
            ),
          ),
          [
            t("This is $A$ unchanged: its rows have not been turned into columns.", "这是没有变化的 $A$：它的行没有变成列。"),
            t("This takes the rows of $A$ in reverse order before turning them into columns.", "这里先把 $A$ 的行倒序，再变成列。"),
            t("Transposing moves entries but does not change their signs.", "转置只移动元素，不改变符号。"),
          ],
        );
      },
    },
    {
      id: "symmetric-and-skew-symmetric-matrices",
      title: t("Symmetric matrices and transpose properties", "对称矩阵与转置的性质"),
      explanation: t(
        "The transpose flips a matrix across its main diagonal, so a symmetric matrix is one that looks the same after this reflection. A square matrix $A$ is symmetric if $A^T = A$, meaning $a_{ij} = a_{ji}$ for all $i$ and $j$. For all compatible matrices, $(A^T)^T = A$ and $(A + B)^T = A^T + B^T$.\n\n> **Watch out.** Only entries in mirror positions must match, such as $a_{12}$ and $a_{21}$. The diagonal entries, such as $a_{11}$ and $a_{22}$, need not equal each other.",
        "转置把矩阵沿主对角线翻转，所以对称矩阵就是翻转后保持不变的矩阵。若方阵 $A$ 满足 $A^T = A$，则称 $A$ 为对称矩阵，这意味着对所有的 $i$ 和 $j$ 均有 $a_{ij} = a_{ji}$。对于任何相容矩阵，恒有 $(A^T)^T = A$ 以及 $(A + B)^T = A^T + B^T$。\n\n> **注意。** 只有镜像位置上的元素必须相等，比如 $a_{12}$ 和 $a_{21}$。对角元素（比如 $a_{11}$ 和 $a_{22}$）不必彼此相等。",
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

        const rhsStep = offDiagVal - c2;
        const solveStep =
          c1 === 1 ? `x = ${x}` : c1 === -1 ? `-x = ${rhsStep} \\implies x = ${x}` : `${c1}x = ${rhsStep} \\implies x = ${x}`;

        return numberProblem({
          prompt: t(
            `Find the value of $x$ such that the matrix $A$ is symmetric:\n\n$$A = ${matLatex(M)}$$`,
            `求使得矩阵 $A$ 为对称矩阵的未知数 $x$ 的值：\n\n$$A = ${matLatex(M)}$$`,
          ),
          solveFor: "x",
          answer: x,
          wrong: [-x, x + 1, x - 2, x + 3],
          solution: join(
            label(1, "Match the mirror entries", "镜像元素相等"),
            t(
              `A symmetric matrix has $a_{12} = a_{21}$, so $${expr} = ${offDiagVal}$.`,
              `对称矩阵满足 $a_{12} = a_{21}$，所以 $${expr} = ${offDiagVal}$。`,
            ),
            para,
            label(2, "Solve", "求解"),
            t(`This gives $${solveStep}$.`, `解得 $${solveStep}$。`),
            checked(
              t(
                `With $x = ${x}$ the top right entry is $${c1} \\cdot ${paren(x)} ${c2Str} = ${offDiagVal}$. This equals the bottom left entry, so flipping $A$ across its diagonal leaves it unchanged and $A^T = A$.`,
                `$x = ${x}$ 时右上元素是 $${c1} \\cdot ${paren(x)} ${c2Str} = ${offDiagVal}$。它等于左下元素，所以把 $A$ 沿对角线翻转后不变，$A^T = A$。`,
              ),
            ),
          ),
        });
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
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSN.VM.C.8"],
  intro: t(
    "You can scale and add vectors and matrices. Multiplying a matrix by a column vector combines both: each row of the matrix is multiplied entry by entry with the vector and the products are added. This is how a table of prices times a list of quantities gives the totals, and it is the first step toward multiplying matrices.\n\nFor example,\n\n$$\\begin{pmatrix} 2 & 1 \\\\ -1 & 3 \\end{pmatrix} \\begin{pmatrix} 4 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 9 \\\\ -1 \\end{pmatrix}$$\n\nsince row $1$ gives $2 \\cdot 4 + 1 \\cdot 1 = 9$ and row $2$ gives $-1 \\cdot 4 + 3 \\cdot 1 = -1$. The same vector is $4$ times the first column plus $1$ times the second: $4 \\cdot 2 + 1 = 9$ and $4 \\cdot (-1) + 3 = -1$.",
    "你会把向量和矩阵数乘、相加。矩阵乘列向量把两者结合起来：矩阵的每一行与向量对应元素相乘，再把乘积相加。价目表乘数量清单得到总价就是这样，这也是学习矩阵乘法的第一步。\n\n例如\n\n$$\\begin{pmatrix} 2 & 1 \\\\ -1 & 3 \\end{pmatrix} \\begin{pmatrix} 4 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 9 \\\\ -1 \\end{pmatrix}$$\n\n因为第 $1$ 行给出 $2 \\cdot 4 + 1 \\cdot 1 = 9$，第 $2$ 行给出 $-1 \\cdot 4 + 3 \\cdot 1 = -1$。同一个向量也是第一列的 $4$ 倍加第二列的 $1$ 倍：$4 \\cdot 2 + 1 = 9$，$4 \\cdot (-1) + 3 = -1$。",
  ),
  knowledgePoints: [
    {
      id: "computing-matrix-vector-products",
      title: t("Computing matrix-vector products", "计算矩阵与列向量的乘积"),
      explanation: t(
        "To multiply an $m \\times n$ matrix $A$ by an $n \\times 1$ column vector $\\mathbf{x}$, take the dot product of each row of $A$ with $\\mathbf{x}$:\n\n$$(A \\mathbf{x})_i = \\sum_{j=1}^n a_{ij} x_j$$\n\n> **Watch out.** Entry $i$ of the result comes from row $i$ of $A$, and the result is a column with one entry for each row of $A$.",
        "一个 $m \\times n$ 矩阵 $A$ 与 $n \\times 1$ 列向量 $\\mathbf{x}$ 相乘时，用 $A$ 的每一行与 $\\mathbf{x}$ 作点积（对应元素相乘再相加）：\n\n$$(A \\mathbf{x})_i = \\sum_{j=1}^n a_{ij} x_j$$\n\n> **注意。** 结果的第 $i$ 个元素来自 $A$ 的第 $i$ 行，结果是一个列向量，$A$ 有几行它就有几个元素。",
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

        const t00 = A[0]![0]! * v[0]!;
        const t01 = A[0]![1]! * v[1]!;
        const t10 = A[1]![0]! * v[0]!;
        const t11 = A[1]![1]! * v[1]!;

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
          join(
            label(1, "Row 1", "第 1 行"),
            t(
              "Multiply row $1$ of $A$ with $\\mathbf{v}$ entry by entry and add:",
              "把 $A$ 的第 $1$ 行与 $\\mathbf{v}$ 对应元素相乘再相加：",
            ),
            shown(`(A\\mathbf{v})_1 = ${dot(A[0]!, v)}`),
            para,
            label(2, "Row 2", "第 2 行"),
            t("Do the same with row $2$:", "第 $2$ 行也一样："),
            shown(`(A\\mathbf{v})_2 = ${dot(A[1]!, v)}`),
            para,
            t(`So $A\\mathbf{v} = ${ansLatex}$.`, `所以 $A\\mathbf{v} = ${ansLatex}$。`),
            checked(
              t(
                `Combine the columns of $A$ with the weights $${v[0]!}$ and $${v[1]!}$ instead:`,
                `改为用权重 $${v[0]!}$ 和 $${v[1]!}$ 组合 $A$ 的各列：`,
              ),
            ),
            shown(
              `${v[0]!}${colVecLatex([A[0]![0]!, A[1]![0]!])} + ${paren(v[1]!)}${colVecLatex([A[0]![1]!, A[1]![1]!])} = ${colVecLatex([t00, t10])} + ${colVecLatex([t01, t11])} = ${ansLatex}`,
            ),
            para,
            t("This is the same vector.", "得到同一个向量。"),
          ),
          [
            t("The two entries are swapped: the first entry comes from row $1$.", "两个元素位置反了：第一个元素来自第 $1$ 行。"),
            t(`The first entry has the wrong sign: row $1$ gives $${res0}$.`, `第一个元素的符号错了：第 $1$ 行给出 $${res0}$。`),
            t("A matrix times a column vector gives a column vector, not a row.", "矩阵乘列向量得到的是列向量，不是行向量。"),
            t("Both entries are off. Work out each row again.", "两个元素都不对。把每一行重新算一遍。"),
          ],
        );
      },
    },
    {
      id: "matrix-vector-product-as-linear-combination",
      title: t("Matrix-vector products as linear combinations of columns", "矩阵与列向量乘积的列线性组合形式"),
      explanation: t(
        "A matrix-vector product $A \\mathbf{x}$ equals a linear combination of the column vectors of $A$ scaled by the entries of $\\mathbf{x}$:\n\n$$A \\mathbf{x} = x_1 \\mathbf{a}_1 + x_2 \\mathbf{a}_2 + \\dots + x_n \\mathbf{a}_n$$\n\n> **Watch out.** The weights multiply the columns of $A$, not its rows, and $x_1$ goes with the first column.",
        "矩阵与列向量的乘积 $A \\mathbf{x}$ 等于矩阵 $A$ 的各列向量以 $\\mathbf{x}$ 的分量为权重的线性组合：\n\n$$A \\mathbf{x} = x_1 \\mathbf{a}_1 + x_2 \\mathbf{a}_2 + \\dots + x_n \\mathbf{a}_n$$\n\n> **注意。** 权重乘的是 $A$ 的列，不是行，并且 $x_1$ 对应第一列。",
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
        const lin = (p: number, q: number) =>
          `${p === 1 ? "" : p === -1 ? "-" : p}x_1 ${q < 0 ? "-" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}x_2`;

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
          join(
            label(1, "Read the columns", "读出各列"),
            t("The first and second columns of $A$ are", "$A$ 的第一列和第二列是"),
            shown(`\\mathbf{a}_1 = ${col1}, \\quad \\mathbf{a}_2 = ${col2}`),
            para,
            label(2, "Weight them", "加权"),
            t(
              "Multiplying by the vector weights each column by the matching entry, the first column by $x_1$ and the second by $x_2$:",
              "乘以这个向量，就是用对应的分量给每一列加权，第一列乘 $x_1$，第二列乘 $x_2$：",
            ),
            shown(`x_1 \\mathbf{a}_1 + x_2 \\mathbf{a}_2 = x_1 ${col1} + x_2 ${col2}`),
            checked(
              t(
                `Multiply row by column instead. Row $1$ gives $${lin(a11, a12)}$ and row $2$ gives $${lin(a21, a22)}$. The combination has the same entries: its top entry is $x_1 \\cdot ${paren(a11)} + x_2 \\cdot ${paren(a12)}$ and its bottom entry is $x_1 \\cdot ${paren(a21)} + x_2 \\cdot ${paren(a22)}$.`,
                `改为按行乘列计算。第 $1$ 行给出 $${lin(a11, a12)}$，第 $2$ 行给出 $${lin(a21, a22)}$。这个组合的元素相同：上面的元素是 $x_1 \\cdot ${paren(a11)} + x_2 \\cdot ${paren(a12)}$，下面的元素是 $x_1 \\cdot ${paren(a21)} + x_2 \\cdot ${paren(a22)}$。`,
              ),
            ),
          ),
          [
            t("The weights are swapped: $x_1$ goes with the first column.", "权重反了：$x_1$ 对应第一列。"),
            t(
              "These are the rows of $A$ written as columns, but the product weights the columns.",
              "这是把 $A$ 的行写成了列，但乘积是给列加权。",
            ),
            t("These are the rows of $A$, and the weights are swapped as well.", "这是 $A$ 的行，而且权重也反了。"),
          ],
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
  intro: t(
    "You can multiply a matrix by a column vector, row by column. A second matrix is just several columns side by side, so multiplying two matrices multiplies the first by each column of the second. Products of matrices describe doing one change after another, such as two steps of a process or two moves of the plane.\n\nFor example,\n\n$$\\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} 3 & 0 \\\\ 1 & 2 \\end{pmatrix} = \\begin{pmatrix} 5 & 4 \\\\ 1 & 2 \\end{pmatrix}$$\n\nThe top left entry is row $1$ times column $1$, $1 \\cdot 3 + 2 \\cdot 1 = 5$, and the top right entry is row $1$ times column $2$, $1 \\cdot 0 + 2 \\cdot 2 = 4$. The bottom row comes from row $2$ in the same way.",
    "你会按行乘列把矩阵乘以列向量。第二个矩阵就是几个并排的列，所以两个矩阵相乘，就是用第一个矩阵去乘第二个矩阵的每一列。矩阵的乘积描述一个变化接着另一个变化，比如一个过程的两个步骤，或平面的两次变换。\n\n例如\n\n$$\\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} 3 & 0 \\\\ 1 & 2 \\end{pmatrix} = \\begin{pmatrix} 5 & 4 \\\\ 1 & 2 \\end{pmatrix}$$\n\n左上元素是第 $1$ 行乘第 $1$ 列，$1 \\cdot 3 + 2 \\cdot 1 = 5$；右上元素是第 $1$ 行乘第 $2$ 列，$1 \\cdot 0 + 2 \\cdot 2 = 4$。下面一行同样由第 $2$ 行得到。",
  ),
  knowledgePoints: [
    {
      id: "multiplying-2x2-matrices",
      title: t("Multiplying 2x2 matrices", "二阶方阵相乘"),
      explanation: t(
        "To multiply two $2 \\times 2$ matrices $A$ and $B$, entry $(AB)_{ij}$ is the dot product of row $i$ of $A$ and column $j$ of $B$:\n\n$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix} = \\begin{pmatrix} ae + bg & af + bh \\\\ ce + dg & cf + dh \\end{pmatrix}$$\n\n> **Watch out.** Each entry is a row of the first matrix times a column of the second. Multiplying matching entries of $A$ and $B$ is not the matrix product, and $BA$ is usually not $AB$.",
        "两个 $2 \\times 2$ 矩阵 $A$ 与 $B$ 相乘时，乘积中第 $i$ 行第 $j$ 列的元素是 $A$ 的第 $i$ 行与 $B$ 的第 $j$ 列的点积：\n\n$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix} = \\begin{pmatrix} ae + bg & af + bh \\\\ ce + dg & cf + dh \\end{pmatrix}$$\n\n> **注意。** 每个元素都是第一个矩阵的一行乘第二个矩阵的一列。把 $A$ 和 $B$ 的对应元素相乘不是矩阵乘积，而且 $BA$ 通常不等于 $AB$。",
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
        const colA = (j: number) => A.map((r) => r[j]!);
        const colB = (j: number) => B.map((r) => r[j]!);
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
          join(
            label(1, "The top row", "上面一行"),
            t("Row $1$ of $A$ times each column of $B$:", "$A$ 的第 $1$ 行乘 $B$ 的每一列："),
            shown(`(AB)_{11} = ${dot(A[0]!, colB(0))}`, `(AB)_{12} = ${dot(A[0]!, colB(1))}`),
            para,
            label(2, "The bottom row", "下面一行"),
            t("Row $2$ of $A$ times each column of $B$:", "$A$ 的第 $2$ 行乘 $B$ 的每一列："),
            shown(`(AB)_{21} = ${dot(A[1]!, colB(0))}`, `(AB)_{22} = ${dot(A[1]!, colB(1))}`),
            para,
            t(`So $AB = ${matLatex(AB)}$.`, `所以 $AB = ${matLatex(AB)}$。`),
            checked(
              t(
                "Build each column of $AB$ from the columns of $A$, weighted by the entries of the matching column of $B$:",
                "用 $A$ 的各列组合出 $AB$ 的每一列，权重是 $B$ 对应列的元素：",
              ),
            ),
            shown(
              ...[0, 1].map(
                (j) =>
                  `${B[0]![j]!}${colVecLatex(colA(0))} + ${paren(B[1]![j]!)}${colVecLatex(colA(1))} = ${colVecLatex(AB.map((r) => r[j]!))}`,
              ),
            ),
            para,
            t("These are the columns found above.", "这正是上面求出的两列。"),
          ),
          [
            t("This is $BA$: a matrix product depends on the order of the factors.", "这是 $BA$：矩阵乘积与因子的次序有关。"),
            t(
              "This multiplies matching entries, but each entry of $AB$ is a row times a column.",
              "这里把对应元素相乘了，但 $AB$ 的每个元素是一行乘一列。",
            ),
            t(`The top right entry has the wrong sign: it is $${AB[0]![1]!}$.`, `右上元素的符号错了：应该是 $${AB[0]![1]!}$。`),
          ],
        );
      },
    },
    {
      id: "specific-entries-in-matrix-products",
      title: t("Finding specific entries in square matrix products", "计算方阵乘积中的特定元素"),
      explanation: t(
        "To find a single entry $(AB)_{ij}$ of a matrix product, you only need to multiply row $i$ of matrix $A$ by column $j$ of matrix $B$, without computing the entire product.\n\n> **Watch out.** Use row $i$ of the first matrix and column $j$ of the second. Taking row $j$ and column $i$ instead gives the entry $(AB)_{ji}$.",
        "要求矩阵乘积中的某一指定元素 $(AB)_{ij}$，只需用矩阵 $A$ 的第 $i$ 行与矩阵 $B$ 的第 $j$ 列相乘求和，无需算出整个乘积矩阵。\n\n> **注意。** 用第一个矩阵的第 $i$ 行和第二个矩阵的第 $j$ 列。改用第 $j$ 行和第 $i$ 列，得到的是元素 $(AB)_{ji}$。",
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

        const r1 = A[i - 1]![0]!;
        const r2 = A[i - 1]![1]!;
        const c1 = B[0]![j - 1]!;
        const c2 = B[1]![j - 1]!;
        const rowC = AB[i - 1]!;

        return numberProblem({
          prompt: t(
            `For the matrices $A$ and $B$, compute the entry in row $${i}$, column $${j}$ of the product $C = AB$:\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
            `对于矩阵 $A$ 与 $B$，计算乘积 $C = AB$ 中位于第 $${i}$ 行第 $${j}$ 列的元素 $c_{${i}${j}}$：\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
          ),
          answer: val,
          wrong: [swappedVal, -val, val + 2, val - 3, val + 1],
          solution: join(
            label(1, "Pick the row and the column", "取出行和列"),
            t(
              `Row $${i}$ of $A$ is $${r1}, ${r2}$ and column $${j}$ of $B$ is $${c1}, ${c2}$.`,
              `$A$ 的第 $${i}$ 行是 $${r1}, ${r2}$，$B$ 的第 $${j}$ 列是 $${c1}, ${c2}$。`,
            ),
            para,
            label(2, "Multiply and add", "相乘再相加"),
            t("Multiply matching entries and add:", "对应元素相乘再相加："),
            shown(`c_{${i}${j}} = ${dot([r1, r2], [c1, c2])}`),
            checked(
              t(
                `Find the whole row $${i}$ of $AB$ instead, as $${r1}$ times row $1$ of $B$ plus $${paren(r2)}$ times row $2$ of $B$. It is $${rowC.join(", ")}$, and entry number $${j}$ is $${val}$.`,
                `改为求出 $AB$ 的整个第 $${i}$ 行：$B$ 第 $1$ 行的 $${r1}$ 倍加第 $2$ 行的 $${paren(r2)}$ 倍。它是 $${rowC.join(", ")}$，第 $${j}$ 个元素是 $${val}$。`,
              ),
            ),
          ),
        });
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
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSN.VM.C.8"],
  intro: t(
    "You can multiply square matrices, row by column. For that to work with any matrices, each row of the first must have as many entries as each column of the second, so that they pair up. This tells you before any arithmetic whether a product exists and how large it is.\n\nIf $A$ is $2 \\times 3$ and $B$ is $3 \\times 4$, write the sizes side by side as $(2 \\times 3)(3 \\times 4)$. The inner numbers are both $3$, so $AB$ exists, and the outer numbers give its size, $2 \\times 4$. In the other order, $(3 \\times 4)(2 \\times 3)$ has inner numbers $4$ and $2$, so $BA$ does not exist.",
    "你会按行乘列把方阵相乘。要让任意矩阵都能这样相乘，第一个矩阵的每一行必须和第二个矩阵的每一列有同样多的元素，才能一一配对。这样在做任何计算之前，就能知道乘积是否存在、有多大。\n\n若 $A$ 是 $2 \\times 3$，$B$ 是 $3 \\times 4$，把大小并排写成 $(2 \\times 3)(3 \\times 4)$。里面的两个数都是 $3$，所以 $AB$ 存在，外面的两个数给出它的大小 $2 \\times 4$。换个次序，$(3 \\times 4)(2 \\times 3)$ 里面的数是 $4$ 和 $2$，所以 $BA$ 不存在。",
  ),
  knowledgePoints: [
    {
      id: "dimension-conformability-conditions",
      title: t("Determining if a matrix product is defined", "判断矩阵乘法是否相容可行"),
      explanation: t(
        "Matrix multiplication $AB$ is defined if and only if the number of columns in $A$ equals the number of rows in $B$. That is, if $A$ is $m \\times k$ and $B$ is $k \\times n$, the product $AB$ is defined and has dimension $m \\times n$.\n\n> **Watch out.** Compare the two inner numbers, the columns of the first matrix and the rows of the second. The outer numbers give the size of the product and play no part in whether it exists.",
        "矩阵乘法 $AB$ 有定义当且仅当矩阵 $A$ 的列数等于矩阵 $B$ 的行数（内侧维度相等）。即若 $A$ 为 $m \\times k$，而 $B$ 为 $k \\times n$，则乘积 $AB$ 有定义，其维度为 $m \\times n$。\n\n> **注意。** 比较里面的两个数，即第一个矩阵的列数和第二个矩阵的行数。外面的两个数给出乘积的大小，与乘积是否存在无关。",
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
            join(
              label(1, "Write the sizes", "写出大小"),
              t(
                `Side by side the sizes are $(${m} \\times ${k})(${p} \\times ${n})$.`,
                `把大小并排写成 $(${m} \\times ${k})(${p} \\times ${n})$。`,
              ),
              para,
              label(2, "Compare the inner numbers", "比较里面的数"),
              t(
                `The inner numbers are $${k}$ and $${p}$, which are equal, so $AB$ is defined. The outer numbers give its size, $${m} \\times ${n}$.`,
                `里面的数是 $${k}$ 和 $${p}$，相等，所以 $AB$ 有定义。外面的数给出它的大小 $${m} \\times ${n}$。`,
              ),
              checked(
                t(
                  `Each entry of $AB$ pairs a row of $A$, which has $${k}$ ${k === 1 ? "entry" : "entries"}, with a column of $B$, which has $${p}$, so the entries pair up. There are $${m}$ rows of $A$ and $${n}$ ${n === 1 ? "column" : "columns"} of $B$ to choose, so $AB$ has $${m}$ rows and $${n}$ ${n === 1 ? "column" : "columns"}.`,
                  `$AB$ 的每个元素把 $A$ 的一行（有 $${k}$ 个元素）与 $B$ 的一列（有 $${p}$ 个元素）配对，元素正好一一对应。$A$ 有 $${m}$ 行、$B$ 有 $${n}$ 列可选，所以 $AB$ 有 $${m}$ 行 $${n}$ 列。`,
                ),
              ),
            ),
            [
              t(`The inner numbers are both $${k}$, so they do match.`, `里面的两个数都是 $${k}$，是相等的。`),
              t(
                "These are the inner numbers, but the size of the product comes from the outer ones.",
                "这是里面的两个数，但乘积的大小由外面的数决定。",
              ),
              t("The outer numbers are in the wrong order: the rows of $A$ come first.", "外面的数次序反了：$A$ 的行数在前。"),
            ],
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
          join(
            label(1, "Write the sizes", "写出大小"),
            t(
              `Side by side the sizes are $(${m} \\times ${k})(${p} \\times ${n})$.`,
              `把大小并排写成 $(${m} \\times ${k})(${p} \\times ${n})$。`,
            ),
            para,
            label(2, "Compare the inner numbers", "比较里面的数"),
            t(
              `$A$ has $${k}$ ${k === 1 ? "column" : "columns"}, but $B$ has $${p}$ ${p === 1 ? "row" : "rows"}. Because $${k} \\ne ${p}$, $AB$ is not defined.`,
              `$A$ 有 $${k}$ 列，而 $B$ 有 $${p}$ 行。由于 $${k} \\ne ${p}$，$AB$ 没有定义。`,
            ),
            checked(
              t(
                `Try to form one entry. A row of $A$ has $${k}$ ${k === 1 ? "entry" : "entries"} and a column of $B$ has $${p}$, so they cannot be paired off one to one.`,
                `试着算一个元素。$A$ 的一行有 $${k}$ 个元素，$B$ 的一列有 $${p}$ 个元素，无法一一配对。`,
              ),
            ),
          ),
          [
            t(
              `The outer numbers would give $${m} \\times ${n}$, but first the inner numbers $${k}$ and $${p}$ must match.`,
              `外面的数会给出 $${m} \\times ${n}$，但先要里面的数 $${k}$ 和 $${p}$ 相等。`,
            ),
            t("These are the inner numbers, and they do not match.", "这是里面的两个数，而且它们不相等。"),
            t("These are the inner numbers, and they do not match.", "这是里面的两个数，而且它们不相等。"),
          ],
        );
      },
    },
    {
      id: "multiplication-order-and-dimension-compatibility",
      title: t("Order and compatibility of products", "矩阵乘法次序与相容性"),
      explanation: t(
        "Even when $AB$ is defined, $BA$ might not be defined. If $A$ is $m \\times n$ and $B$ is $n \\times p$ with $m \\ne p$, $AB$ is defined ($m \\times p$), but $BA$ is not defined because $p \\ne m$.\n\n> **Watch out.** Check $AB$ and $BA$ separately. For $BA$ the inner numbers are the columns of $B$ and the rows of $A$.",
        "即使乘积 $AB$ 有定义，$BA$ 也不一定有定义。若 $A$ 为 $m \\times n$ 而 $B$ 为 $n \\times p$（且 $m \\ne p$），则 $AB$ 有定义（为 $m \\times p$），但 $BA$ 未定义（因为 $p \\ne m$）。\n\n> **注意。** 要分别检查 $AB$ 和 $BA$。对 $BA$ 来说，里面的数是 $B$ 的列数和 $A$ 的行数。",
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
          join(
            label(1, "Check $AB$", "检查 $AB$"),
            t(
              `The sizes are $(${m} \\times ${n})(${n} \\times ${p})$. The inner numbers are both $${n}$, so $AB$ is defined and is $${m} \\times ${p}$.`,
              `大小是 $(${m} \\times ${n})(${n} \\times ${p})$。里面的数都是 $${n}$，所以 $AB$ 有定义，是 $${m} \\times ${p}$ 矩阵。`,
            ),
            para,
            label(2, "Check $BA$", "检查 $BA$"),
            t(
              `The sizes are $(${n} \\times ${p})(${m} \\times ${n})$. The inner numbers are $${p}$ and $${m}$, and $${p} \\ne ${m}$, so $BA$ is not defined.`,
              `大小是 $(${n} \\times ${p})(${m} \\times ${n})$。里面的数是 $${p}$ 和 $${m}$，而 $${p} \\ne ${m}$，所以 $BA$ 没有定义。`,
            ),
            checked(
              t(
                `Try to pair entries. In $BA$ a row of $B$ has $${p}$ ${p === 1 ? "entry" : "entries"} and a column of $A$ has $${m}$, so they cannot be paired. In $AB$ a row of $A$ and a column of $B$ both have $${n}$ entries.`,
                `试着配对元素。在 $BA$ 中，$B$ 的一行有 $${p}$ 个元素，$A$ 的一列有 $${m}$ 个，无法配对。在 $AB$ 中，$A$ 的一行和 $B$ 的一列都有 $${n}$ 个元素。`,
              ),
            ),
          ),
          [
            t(`$BA$ would need $${p} = ${m}$, and these differ.`, `$BA$ 需要 $${p} = ${m}$，而两者不同。`),
            t(`$AB$ is defined: its inner numbers are both $${n}$.`, `$AB$ 有定义：它里面的数都是 $${n}$。`),
            t("This swaps the two products: $AB$ is the one whose inner numbers match.", "这把两个乘积弄反了：里面的数相等的是 $AB$。"),
          ],
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

        const r1 = A[i - 1]![0]!;
        const r2 = A[i - 1]![1]!;
        const r3 = A[i - 1]![2]!;
        const c1 = B[0]![j - 1]!;
        const c2 = B[1]![j - 1]!;
        const c3 = B[2]![j - 1]!;
        const t1 = r1 * c1;
        const t2 = r2 * c2;
        const t3 = r3 * c3;
        const step = `${t1} ${t2 < 0 ? `- ${-t2}` : `+ ${t2}`} ${t3 < 0 ? `- ${-t3}` : `+ ${t3}`}`;

        return numberProblem({
          prompt: t(
            `Given matrices $A$ ($2 \\times 3$) and $B$ ($3 \\times 3$), find the entry in row $${i}$, column $${j}$ of $AB$:\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
            `给定矩阵 $A$（$2 \\times 3$）与 $B$（$3 \\times 3$），求乘积 $AB$ 中位于第 $${i}$ 行第 $${j}$ 列的元素：\n\n$$A = ${matLatex(A)}, \\quad B = ${matLatex(B)}$$`,
          ),
          answer: val,
          wrong: [-val, val + 3, val - 2, val + 1],
          solution: t(
            `Multiply row $${i}$ of $A$ by column $${j}$ of $B$:\n\n$$(${r1})(${c1}) + (${r2})(${c2}) + (${r3})(${c3}) = ${step} = ${val}$$`,
            `将 $A$ 的第 $${i}$ 行与 $B$ 的第 $${j}$ 列对应相乘求和：\n\n$$(${r1})(${c1}) + (${r2})(${c2}) + (${r3})(${c3}) = ${step} = ${val}$$`,
          ),
        });
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
    "Compute positive integer powers $A^2$, $A^3$ of square matrices, including diagonal and shear matrices.",
    "计算方阵的正整数次幂 $A^2$、$A^3$，包括对角矩阵和剪切矩阵的幂。",
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
        "Most powers of matrices take repeated multiplication, but some special matrices follow a pattern that you can spot after computing the first few powers. For a diagonal matrix $D = \\begin{pmatrix} d_1 & 0 \\\\ 0 & d_2 \\end{pmatrix}$, powers are given by $D^k = \\begin{pmatrix} d_1^k & 0 \\\\ 0 & d_2^k \\end{pmatrix}$. For a shear matrix $S = \\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}$, $S^k = \\begin{pmatrix} 1 & k a \\\\ 0 & 1 \\end{pmatrix}$.",
        "大多数矩阵的幂需要反复相乘，但一些特殊矩阵有规律可循，算出前几个幂后就能看出规律。对于对角矩阵 $D = \\begin{pmatrix} d_1 & 0 \\\\ 0 & d_2 \\end{pmatrix}$，其 $k$ 次幂为 $D^k = \\begin{pmatrix} d_1^k & 0 \\\\ 0 & d_2^k \\end{pmatrix}$。对于剪切矩阵 $S = \\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix}$，有 $S^k = \\begin{pmatrix} 1 & k a \\\\ 0 & 1 \\end{pmatrix}$。",
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
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSN.VM.C.10"],
  knowledgePoints: [
    {
      id: "identity-matrix-multiplication-property",
      title: t("Multiplication by the identity matrix", "与单位矩阵相乘的性质"),
      explanation: t(
        "The identity matrix has ones on its main diagonal and zeros elsewhere, and multiplying by it on either side leaves a matrix unchanged. The identity matrix $I$ acts like the number 1 in matrix algebra: for any $m \\times n$ matrix $A$, $I_m A = A$ and $A I_n = A$.",
        "单位矩阵的主对角线上都是 1，其余都是 0，无论从哪一边乘它，矩阵都不变。单位矩阵 $I$ 在矩阵代数中的作用相当于数字 1：对于任意 $m \\times n$ 矩阵 $A$，均有 $I_m A = A$ 以及 $A I_n = A$。",
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
              t(`$I_{${m + 1}}$, and the product is not defined.`, `$I_{${m + 1}}$，且该乘积未定义。`),
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
            t(`$I_{${n + 1}}$, and the product is not defined.`, `$I_{${n + 1}}$，且该乘积未定义。`),
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
  encompasses: [{ topic: "multiplying-a-matrix-by-a-column-vector", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSA.REI.C.8"],
  knowledgePoints: [
    {
      id: "system-to-matrix-equation-2x2",
      title: t("Converting a 2x2 system to matrix form", "将二元一次方程组转化为矩阵方程"),
      explanation: t(
        "The coefficients of the variables form the matrix, the variables form a column vector, and the constants on the right form another column vector. A system of linear equations $\\begin{cases} a x + b y = e \\\\ c x + d y = f \\end{cases}$ can be written in matrix form as $A \\mathbf{x} = \\mathbf{b}$:\n\n$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} e \\\\ f \\end{pmatrix}$$",
        "变量的系数组成矩阵，变量组成一个列向量，右边的常数组成另一个列向量。线性方程组 $\\begin{cases} a x + b y = e \\\\ c x + d y = f \\end{cases}$ 可以写成矩阵方程 $A \\mathbf{x} = \\mathbf{b}$ 的形式：\n\n$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} e \\\\ f \\end{pmatrix}$$",
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
        "Each row of the matrix times the column of variables gives the left side of one equation, so multiplying out recovers the whole system. Multiplying out the matrix equation $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} e \\\\ f \\end{pmatrix}$ restores the original system: $\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}$.",
        "矩阵的每一行乘以变量列向量得到一个方程的左边，所以把乘积展开就还原出整个方程组。展开矩阵方程 $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} e \\\\ f \\end{pmatrix}$ 即可还原原本的方程组：$\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}$。",
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
            `将下列方程组表示为矩阵形式 $A \\mathbf{x} = \\mathbf{b}$：\n\n$$\\begin{cases} ${eq1} \\\\ ${eq2} \\\\ ${eq3} \\end{cases}$$`,
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

        return numberProblem({
          prompt: t(
            `In the matrix equation $A \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\mathbf{b}$ representing a linear system, what is the entry $a_{${i}${j}}$ of the coefficient matrix $A$?\n\n$$A = ${matLatex(A)}, \\quad \\mathbf{b} = ${colVecLatex(b)}$$`,
            `在线性方程组的矩阵方程 $A \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\mathbf{b}$ 中，系数矩阵 $A$ 的元素 $a_{${i}${j}}$ 是多少？\n\n$$A = ${matLatex(A)}, \\quad \\mathbf{b} = ${colVecLatex(b)}$$`,
          ),
          answer: targetVal,
          wrong: [-targetVal, b[i - 1]!, A[j - 1]![i - 1]!, targetVal + 1, targetVal - 1],
          solution: t(
            `Entry $a_{${i}${j}}$ is the coefficient in equation (row) $${i}$ for variable $j$ (column $${j}$). In matrix $A$, that entry is $${targetVal}$.`,
            `元素 $a_{${i}${j}}$ 对应第 $${i}$ 个方程（第 $${i}$ 行）中第 $${j}$ 个未知数（第 $${j}$ 列）的系数。在矩阵 $A$ 中，该元素为 $${targetVal}$。`,
          ),
        });
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
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSN.VM.C.10", "CCSS.HSN.VM.C.12"],
  knowledgePoints: [
    {
      id: "evaluating-2x2-determinants",
      title: t("Evaluating determinants of 2x2 matrices", "计算二阶矩阵的行列式"),
      explanation: t(
        "The determinant of a $2 \\times 2$ matrix is the product of the main diagonal minus the product of the other diagonal. Watch the signs of negative entries.\n\nThe determinant of a $2 \\times 2$ matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ is denoted $\\det(A)$ or $\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}$ and is defined as:\n\n$$\\det(A) = ad - bc$$",
        "$2 \\times 2$ 矩阵的行列式等于主对角线上两数之积减去另一条对角线上两数之积。注意负数元素的符号。\n\n$2 \\times 2$ 矩阵 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 的行列式记作 $\\det(A)$ 或 $\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}$，其计算公式为：\n\n$$\\det(A) = ad - bc$$",
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

        const ad = a * d;
        const bc = b * c;
        const step = bc < 0 ? `${ad} - (${bc}) = ${ad} + ${-bc}` : `${ad} - ${bc}`;

        return numberProblem({
          prompt: t(
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
          answer: val,
          wrong: [wrongSign, -val, wrongCols, val + 2, val - 2],
          solution: t(
            `Use the formula $\\det(A) = ad - bc$:\n\n$$\\det(A) = (${a})(${d}) - (${b})(${c}) = ${step} = ${val}$$`,
            `根据计算公式 $\\det(A) = ad - bc$：\n\n$$\\det(A) = (${a})(${d}) - (${b})(${c}) = ${step} = ${val}$$`,
          ),
        });
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

        const bc = b * c;
        const dStr = d === 1 ? "" : d === -1 ? "-" : `${d}`;
        const rhs = k + bc;
        const subStep = bc < 0 ? `+ ${-bc}` : `- ${bc}`;

        return numberProblem({
          prompt: t(
            `Solve for $x$ in the determinant equation:\n\n$$${detLatex(M)} = ${k}$$`,
            `解下列关于未知数 $x$ 的行列式方程：\n\n$$${detLatex(M)} = ${k}$$`,
          ),
          solveFor: "x",
          answer: x,
          wrong: [-x, x + 1, x - 2, x + 3],
          solution: t(
            `Expand the determinant: $x(${d}) - (${b})(${c}) = ${k}$.\n\n$$${dStr}x ${subStep} = ${k} \\implies ${dStr}x = ${rhs} \\implies x = ${x}$$`,
            `展开行列式：$x(${d}) - (${b})(${c}) = ${k}$。\n\n$$${dStr}x ${subStep} = ${k} \\implies ${dStr}x = ${rhs} \\implies x = ${x}$$`,
          ),
        });
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
      figure: precalculusDrawings2["the-geometric-interpretation-of-the-2x2-determinant#area-of-parallelogram-spanned-by-vectors"],
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

        return numberProblem({
          prompt: t(
            `Find the area of the parallelogram spanned by the vectors $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ and $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$ in the Cartesian plane.`,
            `求直角坐标平面中由向量 $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ 与 $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$ 张成的平行四边形的面积。`,
          ),
          answer: area,
          wrong: [Math.abs(u1 * v1 + u2 * v2), Math.abs(u1 * v2 + u2 * v1), area + 4, Math.max(1, area - 2)],
          solution: t(
            `The area is the absolute value of the determinant:\n\n$$\\text{Area} = |\\det \\begin{pmatrix} ${u1} & ${v1} \\\\ ${u2} & ${v2} \\end{pmatrix}| = |(${u1})(${v2}) - (${u2})(${v1})| = |${detVal}| = ${area}$$`,
            `平行四边形面积等于二阶行列式的绝对值：\n\n$$\\text{Area} = |\\det \\begin{pmatrix} ${u1} & ${v1} \\\\ ${u2} & ${v2} \\end{pmatrix}| = |(${u1})(${v2}) - (${u2})(${v1})| = |${detVal}| = ${area}$$`,
          ),
        });
      },
    },
    {
      id: "sign-of-determinant-and-orientation",
      figure: precalculusDrawings2["the-geometric-interpretation-of-the-2x2-determinant#sign-of-determinant-and-orientation"],
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
    "Find minors $M_{ij}$ by deleting row $i$ and column $j$, and compute cofactors $C_{ij} = (-1)^{i+j} M_{ij}$ with the checkerboard sign pattern.",
    "划去第 $i$ 行与第 $j$ 列求余子式 $M_{ij}$，并按棋盘符号规律求代数余子式 $C_{ij} = (-1)^{i+j} M_{ij}$。",
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

        const a11 = sub[0]![0]!;
        const a22 = sub[1]![1]!;
        const a12 = sub[0]![1]!;
        const a21 = sub[1]![0]!;
        const p1 = a11 * a22;
        const p2 = a12 * a21;
        const step = p2 < 0 ? `${p1} - (${p2}) = ${p1} + ${-p2}` : `${p1} - ${p2}`;

        return numberProblem({
          prompt: t(
            `Find the minor $M_{${i}${j}}$ of the matrix $A$:\n\n$$A = ${matLatex(A)}$$`,
            `求矩阵 $A$ 的余子式 $M_{${i}${j}}$：\n\n$$A = ${matLatex(A)}$$`,
          ),
          answer: mVal,
          wrong: [-mVal, p1 + p2, mVal + 3, mVal - 4],
          solution: t(
            `Delete row $${i}$ and column $${j}$ to get the $2 \\times 2$ submatrix:\n\n$$M_{${i}${j}} = ${detLatex(sub)} = (${a11})(${a22}) - (${a12})(${a21}) = ${step} = ${mVal}$$`,
            `划去第 $${i}$ 行与第 $${j}$ 列得到 $2 \\times 2$ 子矩阵：\n\n$$M_{${i}${j}} = ${detLatex(sub)} = (${a11})(${a22}) - (${a12})(${a21}) = ${step} = ${mVal}$$`,
          ),
        });
      },
    },
    {
      id: "calculating-cofactors-of-a-3x3-matrix",
      title: t("Calculating cofactors of a 3x3 matrix", "计算三阶矩阵的代数余子式"),
      explanation: t(
        "A cofactor is a minor with a sign attached, and the sign depends only on the position of the entry, alternating like the squares of a chessboard. The cofactor $C_{ij}$ is the signed minor: $C_{ij} = (-1)^{i+j} M_{ij}$. The signs follow a checkerboard pattern:\n\n$$\\begin{pmatrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{pmatrix}$$",
        "余子式加上符号就是代数余子式，符号只取决于元素的位置，像棋盘的格子一样交替变化。代数余子式 $C_{ij}$ 是带有符号的余子式：$C_{ij} = (-1)^{i+j} M_{ij}$。符号遵循棋盘状正负交错规律：\n\n$$\\begin{pmatrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{pmatrix}$$",
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

        return numberProblem({
          prompt: t(
            `Find the cofactor $C_{${i}${j}}$ of the matrix $A$:\n\n$$A = ${matLatex(A)}$$`,
            `求矩阵 $A$ 的代数余子式 $C_{${i}${j}}$：\n\n$$A = ${matLatex(A)}$$`,
          ),
          answer: cVal,
          wrong: [-cVal, mVal, cVal + 2, cVal - 3],
          solution: t(
            `First find the minor $M_{${i}${j}} = ${mVal}$. Since $i + j = ${i} + ${j} = ${i + j}$, the sign factor is $(-1)^{${i + j}} = ${sign === "+" ? "1" : "-1"}$. Thus $C_{${i}${j}} = ${cVal}$.`,
            `首先求得余子式 $M_{${i}${j}} = ${mVal}$。由于 $i + j = ${i} + ${j} = ${i + j}$，符号因子为 $(-1)^{${i + j}} = ${sign === "+" ? "1" : "-1"}$。因此 $C_{${i}${j}} = ${cVal}$。`,
          ),
        });
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
        const a11 = A[0]![0]!;
        const a13 = A[0]![2]!;
        const c11 = cofactor3(A, 0, 0);
        const c13 = cofactor3(A, 0, 2);
        const t1 = a11 * c11;
        const t3 = a13 * c13;
        const step = t3 < 0 ? `${t1} - ${-t3}` : `${t1} + ${t3}`;

        return numberProblem({
          prompt: t(
            `Evaluate the $3 \\times 3$ determinant by expanding along row 1:\n\n$$\\det ${matLatex(A)} = ${detLatex(A)}$$`,
            `利用第一行拉普拉斯展开计算该三阶行列式的值：\n\n$$\\det ${matLatex(A)} = ${detLatex(A)}$$`,
          ),
          answer: val,
          wrong: [-val, val + 4, val - 6, val + 10],
          solution: t(
            `Expand along the first row:\n\n$$\\det(A) = (${a11}) C_{11} + (0) C_{12} + (${a13}) C_{13} = (${a11})(${c11}) + (${a13})(${c13}) = ${step} = ${val}$$`,
            `沿第一行展开：\n\n$$\\det(A) = (${a11}) C_{11} + (0) C_{12} + (${a13}) C_{13} = (${a11})(${c11}) + (${a13})(${c13}) = ${step} = ${val}$$`,
          ),
        });
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

        const pTermsStr = `${p1} ${p2 < 0 ? `- ${-p2}` : `+ ${p2}`} ${p3 < 0 ? `- ${-p3}` : `+ ${p3}`}`;
        const mTermsStr = `${m1} ${m2 < 0 ? `- ${-m2}` : `+ ${m2}`} ${m3 < 0 ? `- ${-m3}` : `+ ${m3}`}`;
        const finalStep = sumM < 0 ? `${sumP} - (${sumM}) = ${sumP} + ${-sumM}` : `${sumP} - ${sumM}`;

        return numberProblem({
          prompt: t(`Evaluate the $3 \\times 3$ determinant:\n\n$$${detLatex(A)}$$`, `计算该三阶行列式的值：\n\n$$${detLatex(A)}$$`),
          answer: val,
          wrong: [-val, val + 6, val - 6, sumP + sumM],
          solution: t(
            `Using Sarrus' rule:\n\nDownward products: $${pTermsStr} = ${sumP}$\nUpward products: $${mTermsStr} = ${sumM}$\n\n$$\\det(A) = ${finalStep} = ${val}$$`,
            `利用沙鲁对角线法则：\n\n主对角线三项乘积之和：$${pTermsStr} = ${sumP}$\n副对角线三项乘积之和：$${mTermsStr} = ${sumM}$\n\n$$\\det(A) = ${finalStep} = ${val}$$`,
          ),
        });
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
