// Further knowledge points for topics of Linear Algebra, each a skill the topic's
// own points leave out: working backwards from a condition, a parameter that
// changes the answer, or a fact used in a new setting. See `deeperLinearAlgebraPoints`.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem, pointProblem } from "../problems.ts";
import { pickChoice } from "./grade-4-fractions.ts";

/** Grid is a matrix of numbers written by rows. */
type Grid = readonly (readonly number[])[];

/** mat writes a matrix by rows. */
const mat = (rows: readonly (readonly (number | string)[])[]) =>
  `\\begin{pmatrix} ${rows.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
/** col writes a column vector. */
const col = (...v: readonly (number | string)[]) => `\\begin{pmatrix} ${v.join(" \\\\ ")} \\end{pmatrix}`;
/** both writes the same formula as an option in both languages. */
const both = (latex: string): Text => t(`$${latex}$`, `$${latex}$`);
/** frac writes a rational number. */
const frac = (n: number, d = 1) => Q.of(n, d).toLatex();
/** nonzero picks a nonzero integer from -r to r. */
const nonzero = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** dot multiplies two vectors entry by entry and adds. */
const dot = (a: readonly number[], b: readonly number[]) => a.reduce((s, x, i) => s + x * b[i]!, 0);
/** linear writes the left side of a linear equation in x, y and z. */
const linear = ([a, b, c]: readonly number[]) => poly([a!, "x"], [b!, "y"], [c!, "z"]);
/** inParens puts a negative number in parentheses, for use inside a sum. */
const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** det computes a determinant by expansion along the first row. */
function det(m: Grid): number {
  if (m.length === 1) return m[0]![0]!;
  return m[0]!.reduce((sum, x, j) => {
    const minor = m.slice(1).map((r) => r.filter((_, k) => k !== j));
    return sum + (j % 2 === 0 ? 1 : -1) * x * det(minor);
  }, 0);
}

/** times multiplies two matrices. */
function times(a: Grid, b: Grid): number[][] {
  return a.map((r) => b[0]!.map((_, j) => r.reduce((s, x, k) => s + x * b[k]![j]!, 0)));
}

/** unimodular gives a matrix with determinant 1, so that its inverse has integer entries. */
function unimodular(rng: Rng): number[][] {
  const p = nonzero(rng, 3);
  const q = nonzero(rng, 2);
  return [
    [1 + p * q, p],
    [q, 1],
  ];
}

/** inverse2 inverts a two-by-two matrix with determinant 1. */
const inverse2 = (m: Grid): number[][] => [
  [m[1]![1]!, -m[0]![1]!],
  [-m[1]![0]!, m[0]![0]!],
];

/** withEigenvalues builds a full integer two-by-two matrix with the given eigenvalues. */
function withEigenvalues(rng: Rng, l1: number, l2: number): number[][] {
  for (;;) {
    const a = rng.int(-4, 6);
    const d = l1 + l2 - a;
    const product = a * d - l1 * l2;
    if (product === 0) continue;
    const b = rng.pick([1, -1, 2, -2].filter((x) => product % x === 0));
    return [
      [a, b],
      [product / b, d],
    ];
  }
}

// ---------------------------------------------------------------------------
// Lines and planes
// ---------------------------------------------------------------------------

const perpendicularPlanes: KnowledgePointDef = {
  id: "the-parameter-that-makes-two-planes-perpendicular",
  title: t("The parameter that makes two planes perpendicular", "使两平面垂直的参数"),
  explanation: t(
    "The angle between two planes is the angle between their normal vectors. So two planes are perpendicular exactly when the dot product of their normals is zero, which gives one linear equation for an unknown coefficient.",
    "两平面的夹角就是它们法向量的夹角。所以两平面垂直，当且仅当法向量的数量积为零，这就给未知系数列出一个一次方程。",
  ),
  generate(rng) {
    const n = [nonzero(rng, 4), nonzero(rng, 4), rng.pick([1, -1])];
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 4);
    const k = -(n[0]! * p + n[1]! * q) * n[2]!;
    return numberProblem({
      prompt: t(
        `The planes $${linear(n)} = 3$ and $${poly([p, "x"], [q, "y"], [1, "kz"])} = 1$ are perpendicular. Find $k$.`,
        `平面 $${linear(n)} = 3$ 与 $${poly([p, "x"], [q, "y"], [1, "kz"])} = 1$ 互相垂直。求 $k$。`,
      ),
      answer: k,
      solveFor: "k",
      wrong: [-k, n[0]! * p + n[1]! * q + n[2]!],
      solution: t(
        `The normals $(${n.join(", ")})$ and $(${p}, ${q}, k)$ must have dot product zero: $${dot(n, [p, q, 0])} + ${inParens(n[2]!)}k = 0$. So $k = ${k}$.`,
        `法向量 $(${n.join(", ")})$ 与 $(${p}, ${q}, k)$ 的数量积必须为零：$${dot(n, [p, q, 0])} + ${inParens(n[2]!)}k = 0$。所以 $k = ${k}$。`,
      ),
    });
  },
};

const parallelPlaneThroughPoint: KnowledgePointDef = {
  id: "the-plane-through-a-point-parallel-to-a-plane",
  title: t("The plane through a point parallel to a plane", "过一点且与已知平面平行的平面"),
  explanation: t(
    "Parallel planes share a normal vector, so their equations differ only in the constant on the right. To find the plane through a given point, keep the left side and substitute the point to get the new constant.",
    "平行平面有相同的法向量，所以它们的方程只有右边的常数不同。要求过某点的平行平面，保留左边不变，把点代入得到新的常数。",
  ),
  generate(rng) {
    const n = [nonzero(rng, 5), nonzero(rng, 5), nonzero(rng, 5)];
    const P = [nonzero(rng, 4), nonzero(rng, 4), nonzero(rng, 4)];
    const old = dot(n, P) + rng.pick([-7, -3, 2, 5, 9]);
    const d = dot(n, P);
    return numberProblem({
      prompt: t(
        `The plane $${linear(n)} = d$ is parallel to $${linear(n)} = ${old}$ and passes through $(${P.join(", ")})$. Find $d$.`,
        `平面 $${linear(n)} = d$ 与 $${linear(n)} = ${old}$ 平行，且过点 $(${P.join(", ")})$。求 $d$。`,
      ),
      answer: d,
      solveFor: "d",
      wrong: [old, -d, d + old],
      solution: t(
        `Substitute the point into the left side: $${n[0]}(${P[0]}) + ${inParens(n[1]!)}(${P[1]}) + ${inParens(n[2]!)}(${P[2]}) = ${d}$. The old constant plays no part, because it only places the other plane.`,
        `把点代入左边：$${n[0]}(${P[0]}) + ${inParens(n[1]!)}(${P[1]}) + ${inParens(n[2]!)}(${P[2]}) = ${d}$。原来的常数不起作用，它只决定另一个平面的位置。`,
      ),
    });
  },
};

const footOfPerpendicular: KnowledgePointDef = {
  id: "the-foot-of-the-perpendicular-on-a-plane",
  title: t("The foot of the perpendicular on a plane", "平面上的垂足"),
  explanation: t(
    "The nearest point of a plane to a point $P$ lies on the line through $P$ along the normal $\\mathbf{n}$. Substitute $P + s\\mathbf{n}$ into the plane's equation, solve for $s$, and the point at that $s$ is the foot of the perpendicular.",
    "平面上离点 $P$ 最近的点，在过 $P$ 且沿法向量 $\\mathbf{n}$ 的直线上。把 $P + s\\mathbf{n}$ 代入平面方程，解出 $s$，对应的点就是垂足。",
  ),
  generate(rng) {
    const n = rng.pick([
      [1, 2, 2],
      [2, 1, 2],
      [1, 1, 1],
      [1, -1, 2],
      [2, -2, 1],
    ]);
    const foot = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
    const s = nonzero(rng, 2);
    const P = foot.map((x, i) => x - s * n[i]!);
    const d = dot(n, foot);
    return pointProblem({
      prompt: t(
        `Find the point of the plane $${linear(n)} = ${d}$ nearest to $P = (${P.join(", ")})$. Answer as $(x, y, z)$.`,
        `求平面 $${linear(n)} = ${d}$ 上离点 $P = (${P.join(", ")})$ 最近的点，写成 $(x, y, z)$。`,
      ),
      answer: foot,
      vars: ["x", "y", "z"],
      wrong: [P, foot.map((x, i) => x + s * n[i]!)],
      solution: t(
        `Follow the normal: $(${P.join(", ")}) + s(${n.join(", ")})$ lies on the plane when $${dot(n, P)} + ${dot(n, n)}s = ${d}$, so $s = ${s}$. The nearest point is $(${foot.join(", ")})$.`,
        `沿法向量走：$(${P.join(", ")}) + s(${n.join(", ")})$ 在平面上，要求 $${dot(n, P)} + ${dot(n, n)}s = ${d}$，所以 $s = ${s}$。最近的点是 $(${foot.join(", ")})$。`,
      ),
    });
  },
};

const lineParallelToPlane: KnowledgePointDef = {
  id: "the-parameter-that-makes-a-line-parallel-to-a-plane",
  title: t("The parameter that makes a line parallel to a plane", "使直线与平面平行的参数"),
  explanation: t(
    "A line is parallel to a plane, or lies in it, exactly when its direction is perpendicular to the plane's normal. Setting the dot product of the direction and the normal to zero gives an equation for an unknown component of the direction.",
    "直线与平面平行或在平面内，当且仅当直线的方向与平面的法向量垂直。令方向与法向量的数量积为零，就得到方向中未知分量的方程。",
  ),
  generate(rng) {
    const n = [nonzero(rng, 3), rng.pick([1, -1]), nonzero(rng, 3)];
    const a = nonzero(rng, 4);
    const c = nonzero(rng, 4);
    const k = -(n[0]! * a + n[2]! * c) * n[1]!;
    const d = dot(n, [1, 0, 2]) + rng.pick([3, 5, 8]);
    return numberProblem({
      prompt: t(
        `The line $\\mathbf{r} = (1, 0, 2) + s(${a}, k, ${c})$ does not meet the plane $${linear(n)} = ${d}$. Find $k$.`,
        `直线 $\\mathbf{r} = (1, 0, 2) + s(${a}, k, ${c})$ 与平面 $${linear(n)} = ${d}$ 没有公共点。求 $k$。`,
      ),
      answer: k,
      solveFor: "k",
      wrong: [-k, d, a + c],
      solution: t(
        `A line that misses a plane is parallel to it, so its direction is perpendicular to the normal: $${n[0]}(${a}) + ${inParens(n[1]!)}k + ${inParens(n[2]!)}(${c}) = 0$. So $k = ${k}$.`,
        `与平面没有公共点的直线和平面平行，所以方向与法向量垂直：$${n[0]}(${a}) + ${inParens(n[1]!)}k + ${inParens(n[2]!)}(${c}) = 0$。所以 $k = ${k}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Determinants
// ---------------------------------------------------------------------------

/** factorial multiplies the integers from 1 to n. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

const countingLeibnizTerms: KnowledgePointDef = {
  id: "counting-the-terms-of-the-leibniz-formula",
  title: t("Counting the terms of the Leibniz formula", "数莱布尼茨公式的项"),
  explanation: t(
    "Each term of the Leibniz formula takes exactly one entry from every row and every column, so an $n \\times n$ determinant has $n!$ terms. Once some entries are fixed, the remaining rows and columns can still be matched in any order: fixing $r$ entries in different rows and columns leaves $(n-r)!$ terms.",
    "莱布尼茨公式的每一项都从每行每列各取一个元素，所以 $n$ 阶行列式有 $n!$ 项。固定一些元素后，其余的行和列仍可任意配对：固定不同行不同列的 $r$ 个元素，还剩 $(n-r)!$ 项。",
  ),
  generate(rng) {
    const n = rng.int(4, 7);
    const r = rng.int(1, 2);
    const i = rng.int(1, n);
    const j = rng.int(1, n);
    const k = i === n ? 1 : i + 1;
    const l = j === n ? 1 : j + 1;
    const entries = r === 1 ? `a_{${i}${j}}` : `a_{${i}${j}}$ and $a_{${k}${l}}`;
    const entriesZh = r === 1 ? `a_{${i}${j}}` : `a_{${i}${j}}$ 和 $a_{${k}${l}}`;
    const answer = factorial(n - r);
    return numberProblem({
      prompt: t(
        `In the Leibniz formula for a ${n}×${n} determinant, how many terms contain $${entries}$?`,
        `在 ${n} 阶行列式的莱布尼茨公式中，有多少项含有 $${entriesZh}$？`,
      ),
      answer,
      form: "integer",
      wrong: [factorial(n), factorial(n - r + 1), n - r],
      solution: t(
        `${r === 1 ? "Fixing one entry uses up one row and one column" : "Fixing two entries uses up two rows and two columns"}. The other ${n - r} rows can be matched with the other ${n - r} columns in $${n - r}! = ${answer}$ ways.`,
        `固定 ${r} 个元素用去 ${r} 行和 ${r} 列。其余 ${n - r} 行与其余 ${n - r} 列有 $${n - r}! = ${answer}$ 种配法。`,
      ),
    });
  },
};

const expandingAlongASparseRow: KnowledgePointDef = {
  id: "expanding-a-4x4-determinant-along-a-sparse-row",
  title: t("Expanding a 4×4 determinant along a sparse row", "沿零多的行展开四阶行列式"),
  explanation: t(
    "Laplace expansion may use any row or column, and each zero removes a term. When a row has one nonzero entry, the determinant is that entry times its cofactor, a single $3 \\times 3$ determinant. Remember the sign $(-1)^{i+j}$ of the position.",
    "拉普拉斯展开可以沿任何一行或一列，每个零都少一项。若某行只有一个非零元素，行列式就等于该元素乘它的代数余子式，也就是一个三阶行列式。别忘了位置的符号 $(-1)^{i+j}$。",
  ),
  generate(rng) {
    const row = rng.int(0, 3);
    const column = rng.int(0, 3);
    const v = nonzero(rng, 3);
    const m = [0, 1, 2, 3].map((i) =>
      [0, 1, 2, 3].map((j) => {
        if (i !== row) return rng.int(-2, 3);
        return j === column ? v : 0;
      }),
    );
    const minor = det(m.filter((_, i) => i !== row).map((r) => r.filter((_, j) => j !== column)));
    const sign = (row + column) % 2 === 0 ? 1 : -1;
    const answer = sign * v * minor;
    return numberProblem({
      prompt: t(`Find $\\det ${mat(m)}$.`, `求 $\\det ${mat(m)}$。`),
      answer,
      form: "integer",
      wrong: [-answer, minor, v * minor],
      solution: t(
        `Row ${row + 1} has one nonzero entry, $${v}$, in column ${column + 1}. Its sign is $(-1)^{${row + 1}+${column + 1}} = ${sign}$, and deleting its row and column leaves a determinant of $${minor}$. So the value is $${sign} \\cdot ${inParens(v)} \\cdot ${inParens(minor)} = ${answer}$.`,
        `第 ${row + 1} 行只有一个非零元素 $${v}$，在第 ${column + 1} 列。它的符号是 $(-1)^{${row + 1}+${column + 1}} = ${sign}$，删去所在行列后的行列式为 $${minor}$。所以值为 $${sign} \\cdot ${inParens(v)} \\cdot ${inParens(minor)} = ${answer}$。`,
      ),
    });
  },
};

const whenCramerFails: KnowledgePointDef = {
  id: "the-parameter-where-cramers-rule-does-not-apply",
  title: t("The parameter where Cramer's rule does not apply", "克拉默法则失效时的参数"),
  explanation: t(
    "Cramer's rule divides by the determinant of the coefficient matrix, so it applies only when that determinant is not zero. For a system with a parameter, write the determinant in terms of the parameter and find where it vanishes.",
    "克拉默法则要除以系数矩阵的行列式，所以只有行列式不为零时才适用。对含参数的方程组，把行列式写成参数的式子，找出它为零的位置。",
  ),
  generate(rng) {
    const a = rng.pick([1, 2, -1, -2]);
    const b = 2 * nonzero(rng, 3);
    const c = nonzero(rng, 5);
    const k = (b * c) / a;
    const [e, f] = [rng.int(1, 9), rng.int(1, 9)];
    return numberProblem({
      prompt: t(
        `For which value of $k$ can Cramer's rule not be used on the system $${poly([a, "x"], [b, "y"])} = ${e}$, $${poly([c, "x"], [1, "ky"])} = ${f}$?`,
        `$k$ 取何值时，方程组 $${poly([a, "x"], [b, "y"])} = ${e}$，$${poly([c, "x"], [1, "ky"])} = ${f}$ 不能用克拉默法则？`,
      ),
      answer: k,
      solveFor: "k",
      wrong: [-k, b * c, a * c],
      solution: t(
        `The determinant of the coefficient matrix is $${a}k - ${inParens(b)}(${c})$. It is zero when $k = ${k}$, and the rule would then divide by zero.`,
        `系数矩阵的行列式是 $${a}k - ${inParens(b)}(${c})$。当 $k = ${k}$ 时它为零，这时法则要除以零。`,
      ),
    });
  },
};

const determinantOfACombination: KnowledgePointDef = {
  id: "the-determinant-of-a-product-of-a-scalar-a-transpose-and-an-inverse",
  title: t("The determinant of a scaled product with a transpose and an inverse", "含数乘、转置和逆的乘积的行列式"),
  explanation: t(
    "Determinants multiply, a transpose keeps the determinant, and an inverse takes its reciprocal. A scalar multiplies every row, so for an $n \\times n$ matrix $\\det(cA) = c^n \\det A$, with the power $n$ and not $1$.",
    "行列式对乘积可乘，转置不改变行列式，取逆则变为倒数。数乘作用于每一行，所以 $n$ 阶矩阵满足 $\\det(cA) = c^n \\det A$，指数是 $n$ 而不是 $1$。",
  ),
  generate(rng) {
    const n = rng.int(2, 4);
    const c = rng.pick([2, 3, -2, -1]);
    const a = nonzero(rng, 5);
    const b = rng.pick([1, -1, 2, -2, 4]);
    const answer = Q.of(c ** n * a, b);
    return numberProblem({
      prompt: t(
        `$A$ and $B$ are ${n}×${n} matrices with $\\det A = ${a}$ and $\\det B = ${b}$. Find $\\det(${c}A^{T}B^{-1})$.`,
        `$A$、$B$ 是 ${n} 阶矩阵，$\\det A = ${a}$，$\\det B = ${b}$。求 $\\det(${c}A^{T}B^{-1})$。`,
      ),
      answer,
      wrong: [Q.of(c * a, b), c ** n * a * b, Q.of(c ** n * b, a)],
      solution: t(
        `The scalar contributes $(${c})^{${n}} = ${c ** n}$, the transpose keeps $${a}$, and the inverse gives $\\frac{1}{${b}}$. Together that is $${answer.toLatex()}$.`,
        `数乘贡献 $(${c})^{${n}} = ${c ** n}$，转置保持 $${a}$，取逆得 $\\frac{1}{${b}}$。合起来是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const multiplyingBlocks: KnowledgePointDef = {
  id: "multiplying-partitioned-matrices",
  title: t("Multiplying partitioned matrices", "分块矩阵的乘法"),
  explanation: t(
    "Blocks multiply like entries as long as the sizes match, keeping the order of each product. So the top right block of $\\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}\\begin{pmatrix} E & G \\\\ 0 & H \\end{pmatrix}$ is $AG + BH$.",
    "只要尺寸相配，分块矩阵可以像数一样相乘，但每个乘积的顺序要保持。所以 $\\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}\\begin{pmatrix} E & G \\\\ 0 & H \\end{pmatrix}$ 的右上块是 $AG + BH$。",
  ),
  generate(rng) {
    const small = (): number[][] => [
      [rng.int(-2, 3), rng.int(-2, 3)],
      [rng.int(-2, 3), rng.int(-2, 3)],
    ];
    const [A, B, G, H] = [small(), small(), small(), small()];
    const AG = times(A, G);
    const BH = times(B, H);
    const i = rng.int(0, 1);
    const j = rng.int(0, 1);
    const answer = AG[i]![j]! + BH[i]![j]!;
    return numberProblem({
      prompt: t(
        `Let $M = \\begin{pmatrix} A & B \\\\ 0 & I \\end{pmatrix}$ and $N = \\begin{pmatrix} I & G \\\\ 0 & H \\end{pmatrix}$, with $A = ${mat(A)}$, $B = ${mat(B)}$, $G = ${mat(G)}$ and $H = ${mat(H)}$. Find the entry in row ${i + 1}, column ${j + 1} of the top right block of $MN$.`,
        `设 $M = \\begin{pmatrix} A & B \\\\ 0 & I \\end{pmatrix}$，$N = \\begin{pmatrix} I & G \\\\ 0 & H \\end{pmatrix}$，其中 $A = ${mat(A)}$，$B = ${mat(B)}$，$G = ${mat(G)}$，$H = ${mat(H)}$。求 $MN$ 右上块第 ${i + 1} 行第 ${j + 1} 列的元素。`,
      ),
      answer,
      form: "integer",
      wrong: [AG[i]![j]!, BH[i]![j]!, times(G, A)[i]![j]! + times(H, B)[i]![j]!],
      solution: t(
        `The top right block is $AG + BH$. Its entry is $${AG[i]![j]!} + ${inParens(BH[i]![j]!)} = ${answer}$.`,
        `右上块是 $AG + BH$。该元素为 $${AG[i]![j]!} + ${inParens(BH[i]![j]!)} = ${answer}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Elimination, inverses and LU
// ---------------------------------------------------------------------------

const consistent3x3: KnowledgePointDef = {
  id: "the-constant-that-makes-a-singular-3x3-system-consistent",
  title: t("The constant that makes a singular 3×3 system consistent", "使奇异三阶方程组相容的常数"),
  explanation: t(
    "When elimination turns a row of the coefficient matrix to zero, the same steps act on the right side, and the system has solutions only if that side also becomes zero. This condition fixes the missing constant.",
    "消元把系数矩阵的某一行化为零时，同样的步骤也作用在右边，只有右边也变成零，方程组才有解。这个条件决定了缺少的常数。",
  ),
  generate(rng) {
    const r1 = [1, nonzero(rng, 3), nonzero(rng, 3)];
    const r2 = [0, 1, nonzero(rng, 3)].map((x, i) => x + nonzero(rng, 2) * r1[i]!);
    const alpha = nonzero(rng, 2);
    const beta = nonzero(rng, 2);
    const r3 = r1.map((x, i) => alpha * x + beta * r2[i]!);
    const e1 = rng.int(-5, 6);
    const e2 = rng.int(-5, 6);
    const k = alpha * e1 + beta * e2;
    const system = `${linear(r1)} = ${e1},\\quad ${linear(r2)} = ${e2},\\quad ${linear(r3)} = k`;
    return numberProblem({
      prompt: t(`For which $k$ does the system $${system}$ have a solution?`, `$k$ 取何值时，方程组 $${system}$ 有解？`),
      answer: k,
      solveFor: "k",
      wrong: [e1 + e2, alpha * e2 + beta * e1, 0],
      solution: t(
        `On the left, row 3 equals $${alpha}$ times row 1 plus $${beta}$ times row 2. The right side must follow the same relation: $k = ${alpha}(${e1}) + ${inParens(beta)}(${e2}) = ${k}$.`,
        `左边第 3 行等于第 1 行的 $${alpha}$ 倍加第 2 行的 $${beta}$ 倍。右边必须满足同样的关系：$k = ${alpha}(${e1}) + ${inParens(beta)}(${e2}) = ${k}$。`,
      ),
    });
  },
};

const clearingAbovePivot: KnowledgePointDef = {
  id: "clearing-above-a-pivot-to-reach-rref",
  title: t("Clearing above a pivot to reach reduced form", "清除主元上方的元素得到简化阶梯形"),
  explanation: t(
    "From echelon form, reduced form takes one more pass: starting at the last pivot, subtract multiples of its row from the rows above until each pivot is the only nonzero entry of its column. This also changes the entries in the free columns.",
    "从阶梯形到简化阶梯形还要再做一轮：从最后一个主元开始，从上方各行减去该行的倍数，直到每个主元是所在列唯一的非零元素。这也会改变自由列中的元素。",
  ),
  generate(rng) {
    const a = nonzero(rng, 4);
    const b = rng.int(-5, 6);
    const c = nonzero(rng, 4);
    const answer = b - a * c;
    return numberProblem({
      prompt: t(
        `Reduce $${mat([
          [1, a, b],
          [0, 1, c],
        ])}$ to reduced row echelon form. What is the entry in row 1, column 3?`,
        `把 $${mat([
          [1, a, b],
          [0, 1, c],
        ])}$ 化为简化行阶梯形。第 1 行第 3 列的元素是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [b, b + a * c, c],
      solution: t(
        `Row 1 needs a zero in column 2, so replace it by row 1 minus $${a}$ times row 2. The last entry becomes $${b} - ${inParens(a)}(${c}) = ${answer}$.`,
        `第 1 行第 2 列要变成零，所以用第 1 行减去第 2 行的 $${a}$ 倍。最后一个元素变成 $${b} - ${inParens(a)}(${c}) = ${answer}$。`,
      ),
    });
  },
};

const solvingWithAnInverse: KnowledgePointDef = {
  id: "solving-a-system-from-a-given-inverse",
  title: t("Solving a system from a given inverse", "由已知的逆矩阵解方程组"),
  explanation: t(
    "If the inverse of $A$ is known, there is no need to eliminate: multiplying $A\\mathbf{x} = \\mathbf{b}$ on the left by $A^{-1}$ gives $\\mathbf{x} = A^{-1}\\mathbf{b}$. The answer comes from one matrix-vector product with the inverse, not with $A$.",
    "已知 $A$ 的逆就不必消元：在 $A\\mathbf{x} = \\mathbf{b}$ 两边左乘 $A^{-1}$，得 $\\mathbf{x} = A^{-1}\\mathbf{b}$。答案来自逆矩阵与向量的一次乘法，而不是 $A$ 与向量的乘法。",
  ),
  generate(rng) {
    const inverse = unimodular(rng);
    const b = [rng.int(-4, 5), rng.int(-4, 5)];
    if (b[0] === 0 && b[1] === 0) b[0] = 1;
    const x = [dot(inverse[0]!, b), dot(inverse[1]!, b)];
    const A = inverse2(inverse);
    return pointProblem({
      prompt: t(
        `The matrix $A$ has $A^{-1} = ${mat(inverse)}$. Solve $A\\mathbf{x} = ${col(b[0]!, b[1]!)}$. Answer as $(x_1, x_2)$.`,
        `矩阵 $A$ 满足 $A^{-1} = ${mat(inverse)}$。解 $A\\mathbf{x} = ${col(b[0]!, b[1]!)}$，写成 $(x_1, x_2)$。`,
      ),
      answer: x,
      vars: ["x_1", "x_2"],
      wrong: [[dot(A[0]!, b), dot(A[1]!, b)], b, [x[1]!, x[0]!]],
      solution: t(
        `$\\mathbf{x} = A^{-1}\\mathbf{b}$, so $x_1 = ${inverse[0]![0]}(${b[0]}) + ${inParens(inverse[0]![1]!)}(${b[1]}) = ${x[0]}$ and $x_2 = ${inverse[1]![0]}(${b[0]}) + ${inParens(inverse[1]![1]!)}(${b[1]}) = ${x[1]}$.`,
        `$\\mathbf{x} = A^{-1}\\mathbf{b}$，所以 $x_1 = ${inverse[0]![0]}(${b[0]}) + ${inParens(inverse[0]![1]!)}(${b[1]}) = ${x[0]}$，$x_2 = ${inverse[1]![0]}(${b[0]}) + ${inParens(inverse[1]![1]!)}(${b[1]}) = ${x[1]}$。`,
      ),
    });
  },
};

const inverseOfAProduct: KnowledgePointDef = {
  id: "the-inverse-of-a-product-reverses-the-order",
  title: t("The inverse of a product reverses the order", "乘积的逆要交换顺序"),
  explanation: t(
    "Since $AB(B^{-1}A^{-1}) = I$, the inverse of a product is the product of the inverses in the opposite order. Matrices seldom commute, so $A^{-1}B^{-1}$ is usually a different matrix and gives wrong entries.",
    "因为 $AB(B^{-1}A^{-1}) = I$，乘积的逆是各自的逆按相反顺序相乘。矩阵很少可交换，所以 $A^{-1}B^{-1}$ 通常是另一个矩阵，算出的元素是错的。",
  ),
  generate(rng) {
    let Ai: number[][];
    let Bi: number[][];
    let right: number[][];
    let wrongOrder: number[][];
    do {
      Ai = unimodular(rng);
      Bi = unimodular(rng);
      right = times(Bi, Ai);
      wrongOrder = times(Ai, Bi);
    } while (right[0]![1] === wrongOrder[0]![1]);
    return numberProblem({
      prompt: t(
        `$A^{-1} = ${mat(Ai)}$ and $B^{-1} = ${mat(Bi)}$. Find the entry in row 1, column 2 of $(AB)^{-1}$.`,
        `$A^{-1} = ${mat(Ai)}$，$B^{-1} = ${mat(Bi)}$。求 $(AB)^{-1}$ 第 1 行第 2 列的元素。`,
      ),
      answer: right[0]![1]!,
      form: "integer",
      wrong: [wrongOrder[0]![1]!, right[1]![0]!, Ai[0]![1]! * Bi[0]![1]!],
      solution: t(
        `$(AB)^{-1} = B^{-1}A^{-1}$. Row 1 of $B^{-1}$ times column 2 of $A^{-1}$ is $${Bi[0]![0]}(${Ai[0]![1]}) + ${inParens(Bi[0]![1]!)}(${Ai[1]![1]}) = ${right[0]![1]}$.`,
        `$(AB)^{-1} = B^{-1}A^{-1}$。$B^{-1}$ 的第 1 行乘 $A^{-1}$ 的第 2 列，得 $${Bi[0]![0]}(${Ai[0]![1]}) + ${inParens(Bi[0]![1]!)}(${Ai[1]![1]}) = ${right[0]![1]}$。`,
      ),
    });
  },
};

const whenLuFails: KnowledgePointDef = {
  id: "the-parameter-where-lu-needs-a-row-swap",
  title: t("The parameter where LU needs a row swap", "LU 分解需要换行时的参数"),
  explanation: t(
    "Elimination without row swaps divides by each pivot in turn. If the first entry is zero and the entry below it is not, no multiple of the first row can clear that entry, so no factorization $A = LU$ exists until the rows are swapped.",
    "不换行的消元要依次除以各个主元。如果第一个元素为零而它下方的元素不为零，第一行的任何倍数都消不掉下方的元素，所以不换行就不存在 $A = LU$ 分解。",
  ),
  generate(rng) {
    const q = nonzero(rng, 6);
    const b = nonzero(rng, 5);
    const c = nonzero(rng, 5);
    const d = nonzero(rng, 5);
    const entry = poly([1, "k"], [q, ""]);
    return numberProblem({
      prompt: t(
        `For which value of $k$ does $${mat([
          [entry, b],
          [c, d],
        ])}$ have no factorization $LU$ without a row swap?`,
        `$k$ 取何值时，$${mat([
          [entry, b],
          [c, d],
        ])}$ 不换行就没有 $LU$ 分解？`,
      ),
      answer: -q,
      solveFor: "k",
      wrong: [q, c, Q.of(b * c, d).sub(Q.of(q))],
      solution: t(
        `The first pivot is $${entry}$. When it is zero, that is at $k = ${-q}$, the nonzero entry $${c}$ below it cannot be cleared. Any other $k$ gives a pivot to divide by, even if the matrix is singular.`,
        `第一个主元是 $${entry}$。当它为零，即 $k = ${-q}$ 时，下方的非零元素 $${c}$ 消不掉。其他任何 $k$ 都有主元可除，即使矩阵是奇异的。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Vector spaces
// ---------------------------------------------------------------------------

const parameterInSpan: KnowledgePointDef = {
  id: "the-component-that-puts-a-vector-in-a-span",
  title: t("The component that puts a vector in a span", "使向量落在张成空间中的分量"),
  explanation: t(
    "To decide what a missing component must be, use the known components to find the coefficients of the combination, then let those coefficients fix the last component. A plane in space leaves exactly one value free of choice for each pair of other components.",
    "要确定缺少的分量，先用已知分量求出线性组合的系数，再由这些系数决定最后一个分量。空间中的平面对其余两个分量的每一组取值，只留下一个可能的值。",
  ),
  generate(rng) {
    const u = [1, rng.int(1, 3), nonzero(rng, 4)];
    const v = [1, u[1]! + 1, nonzero(rng, 4)];
    const c1 = nonzero(rng, 3);
    const c2 = nonzero(rng, 3);
    const w = u.map((x, i) => c1 * x + c2 * v[i]!);
    return numberProblem({
      prompt: t(
        `The vector $${col(w[0]!, w[1]!, "k")}$ lies in the span of $${col(...u)}$ and $${col(...v)}$. Find $k$.`,
        `向量 $${col(w[0]!, w[1]!, "k")}$ 在 $${col(...u)}$ 和 $${col(...v)}$ 的张成空间中。求 $k$。`,
      ),
      answer: w[2]!,
      solveFor: "k",
      wrong: [u[2]! + v[2]!, c2 * u[2]! + c1 * v[2]!, w[0]! + w[1]!],
      solution: t(
        `Solve $c_1 + c_2 = ${w[0]}$ and $${u[1]}c_1 + ${v[1]}c_2 = ${w[1]}$ to get $c_1 = ${c1}$ and $c_2 = ${c2}$. Then $k = ${c1}(${u[2]}) + ${inParens(c2)}(${v[2]}) = ${w[2]}$.`,
        `解 $c_1 + c_2 = ${w[0]}$ 和 $${u[1]}c_1 + ${v[1]}c_2 = ${w[1]}$，得 $c_1 = ${c1}$，$c_2 = ${c2}$。于是 $k = ${c1}(${u[2]}) + ${inParens(c2)}(${v[2]}) = ${w[2]}$。`,
      ),
    });
  },
};

const parameterForDependence: KnowledgePointDef = {
  id: "the-parameter-that-makes-two-vectors-dependent",
  title: t("The parameter that makes two vectors dependent", "使两个向量相关的参数"),
  explanation: t(
    "Two vectors in the plane are dependent exactly when the determinant of the matrix with those columns is zero. A parameter that appears twice makes this a quadratic equation, and so there can be two values.",
    "平面上两个向量线性相关，当且仅当以它们为列的矩阵行列式为零。参数出现两次时，这就成了二次方程，所以可能有两个值。",
  ),
  generate(rng) {
    const m = rng.int(2, 12);
    const a = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== m && (m * m) % x === 0));
    const positive = rng.int(0, 1) === 0;
    const answer = positive ? m : -m;
    const b = (m * m) / a;
    return numberProblem({
      prompt: t(
        `The vectors $${col("k", a)}$ and $${col(b, "k")}$ are linearly dependent, and $k$ is ${positive ? "positive" : "negative"}. Find $k$.`,
        `向量 $${col("k", a)}$ 和 $${col(b, "k")}$ 线性相关，且 $k$ 为${positive ? "正" : "负"}数。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      wrong: [m * m, a + b, -answer],
      solution: t(
        `The determinant is $k^2 - ${a * b}$. It is zero at $k = \\pm ${m}$, and the ${positive ? "positive" : "negative"} value is $${answer}$.`,
        `行列式是 $k^2 - ${a * b}$。它在 $k = \\pm ${m}$ 时为零，取${positive ? "正" : "负"}值 $${answer}$。`,
      ),
    });
  },
};

const planeOfAColumnSpace: KnowledgePointDef = {
  id: "the-equation-of-a-column-space",
  title: t("The equation of a column space", "列空间的方程"),
  explanation: t(
    "The column space of a matrix with two independent columns in $\\mathbb{R}^3$ is a plane through the origin. Its normal is perpendicular to both columns, so the cross product of the columns gives the equation of the plane.",
    "$\\mathbb{R}^3$ 中有两个独立列的矩阵，其列空间是过原点的平面。法向量与两列都垂直，所以两列的向量积给出平面方程。",
  ),
  generate(rng) {
    let u: number[];
    let v: number[];
    let n: number[];
    do {
      u = [rng.int(1, 3), rng.int(-2, 3), rng.int(-2, 3)];
      v = [rng.int(-2, 3), rng.int(1, 3), rng.int(-2, 3)];
      n = [u[1]! * v[2]! - u[2]! * v[1]!, u[2]! * v[0]! - u[0]! * v[2]!, u[0]! * v[1]! - u[1]! * v[0]!];
    } while (n.some((x) => x === 0) || new Set(n.map(Math.abs)).size < 3);
    return pickChoice(
      rng,
      t(
        `Which equation describes the column space of $${mat([
          [u[0]!, v[0]!],
          [u[1]!, v[1]!],
          [u[2]!, v[2]!],
        ])}$?`,
        `哪个方程描述 $${mat([
          [u[0]!, v[0]!],
          [u[1]!, v[1]!],
          [u[2]!, v[2]!],
        ])}$ 的列空间？`,
      ),
      both(`${linear(n)} = 0`),
      [`${linear([n[1]!, n[0]!, n[2]!])} = 0`, `${linear([n[0]!, -n[1]!, n[2]!])} = 0`, `${linear([n[2]!, n[1]!, n[0]!])} = 0`].map(both),
      t(
        `The normal is the cross product of the columns, $(${n.join(", ")})$. It has zero dot product with each column, so every combination of the columns satisfies $${linear(n)} = 0$.`,
        `法向量是两列的向量积 $(${n.join(", ")})$。它与每一列的数量积都为零，所以两列的任何线性组合都满足 $${linear(n)} = 0$。`,
      ),
    );
  },
};

const parameterForRankOne: KnowledgePointDef = {
  id: "the-entry-that-makes-the-rank-one",
  title: t("The entry that makes the rank one", "使秩为 1 的元素"),
  explanation: t(
    "A nonzero matrix has rank one exactly when every row is a multiple of a single row. The known entries of a second row show which multiple it must be, and that multiple fixes the unknown entry.",
    "非零矩阵的秩为 1，当且仅当每一行都是同一行的倍数。第二行的已知元素说明了倍数是多少，这个倍数决定了未知元素。",
  ),
  generate(rng) {
    const a = nonzero(rng, 4);
    const b = nonzero(rng, 4);
    const c = nonzero(rng, 4);
    const k = c * b;
    return numberProblem({
      prompt: t(
        `The matrix $${mat([
          [1, a, b],
          [c, c * a, "k"],
        ])}$ has rank 1. Find $k$.`,
        `矩阵 $${mat([
          [1, a, b],
          [c, c * a, "k"],
        ])}$ 的秩为 1。求 $k$。`,
      ),
      answer: k,
      solveFor: "k",
      wrong: [b, c + b, a * b],
      solution: t(
        `Row 2 starts with $${c}$ times row 1, so it must be that multiple throughout: $k = ${c}(${b}) = ${k}$.`,
        `第 2 行开头是第 1 行的 $${c}$ 倍，所以整行都是这个倍数：$k = ${c}(${b}) = ${k}$。`,
      ),
    });
  },
};

const betweenTwoBases: KnowledgePointDef = {
  id: "coordinates-from-one-basis-to-another",
  title: t("Coordinates from one basis to another", "从一组基的坐标到另一组基的坐标"),
  explanation: t(
    "To pass from coordinates in a basis $\\mathcal{B}$ to coordinates in a basis $\\mathcal{C}$, go through the vector itself: multiply by the matrix $P_{\\mathcal{B}}$ to get the vector, then solve with $P_{\\mathcal{C}}$. So $[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C}}^{-1}P_{\\mathcal{B}}[\\mathbf{x}]_{\\mathcal{B}}$.",
    "要从基 $\\mathcal{B}$ 下的坐标得到基 $\\mathcal{C}$ 下的坐标，先经过向量本身：乘 $P_{\\mathcal{B}}$ 得到向量，再用 $P_{\\mathcal{C}}$ 求解。所以 $[\\mathbf{x}]_{\\mathcal{C}} = P_{\\mathcal{C}}^{-1}P_{\\mathcal{B}}[\\mathbf{x}]_{\\mathcal{B}}$。",
  ),
  generate(rng) {
    const C = unimodular(rng);
    const Bm = [
      [rng.int(1, 3), nonzero(rng, 2)],
      [nonzero(rng, 2), rng.int(1, 4)],
    ];
    if (det(Bm) === 0) Bm[1]![1]! += 1;
    const coords = [nonzero(rng, 3), nonzero(rng, 3)];
    const x = [dot(Bm[0]!, coords), dot(Bm[1]!, coords)];
    const answer = times(inverse2(C), [[x[0]!], [x[1]!]]).map((r) => r[0]!);
    const column = (m: number[][], j: number) => col(m[0]![j]!, m[1]![j]!);
    return pointProblem({
      prompt: t(
        `A vector has coordinates $(${coords.join(", ")})$ in the basis $\\mathcal{B} = \\{${column(Bm, 0)}, ${column(Bm, 1)}\\}$. Find its coordinates in the basis $\\mathcal{C} = \\{${column(C, 0)}, ${column(C, 1)}\\}$.`,
        `一个向量在基 $\\mathcal{B} = \\{${column(Bm, 0)}, ${column(Bm, 1)}\\}$ 下的坐标是 $(${coords.join(", ")})$。求它在基 $\\mathcal{C} = \\{${column(C, 0)}, ${column(C, 1)}\\}$ 下的坐标。`,
      ),
      answer,
      wrong: [coords, x, times(C, [[x[0]!], [x[1]!]]).map((r) => r[0]!)],
      solution: t(
        `The vector itself is $${coords[0]}$ times the first vector of $\\mathcal{B}$ plus $${coords[1]}$ times the second, which is $(${x.join(", ")})$. Solving $P_{\\mathcal{C}}\\mathbf{c} = (${x.join(", ")})$ gives $(${answer.join(", ")})$.`,
        `向量本身是 $\\mathcal{B}$ 的第一个向量的 $${coords[0]}$ 倍加第二个向量的 $${coords[1]}$ 倍，即 $(${x.join(", ")})$。解 $P_{\\mathcal{C}}\\mathbf{c} = (${x.join(", ")})$，得 $(${answer.join(", ")})$。`,
      ),
    });
  },
};

const dimensionOfFamilies: KnowledgePointDef = {
  id: "the-dimension-of-a-family-of-matrices-or-polynomials",
  title: t("The dimension of a family of matrices or polynomials", "矩阵族或多项式族的维数"),
  explanation: t(
    "Count the free choices. A symmetric $n \\times n$ matrix is fixed by its entries on and above the diagonal, a skew-symmetric one by those strictly above it. Each independent linear condition, such as a zero trace or a prescribed root, removes one dimension.",
    "数一数自由选择的个数。$n$ 阶对称矩阵由对角线及其上方的元素决定，反对称矩阵由严格上方的元素决定。每个独立的线性条件，比如迹为零或指定一个根，都减少一维。",
  ),
  generate(rng) {
    const n = rng.int(2, 5);
    const a = nonzero(rng, 3);
    const b = a + rng.int(1, 3);
    const families: readonly [Text, number, string, string][] = [
      [
        t(`symmetric ${n}×${n} matrices`, `${n} 阶对称矩阵`),
        (n * (n + 1)) / 2,
        `$${n}$ entries on the diagonal and $${(n * (n - 1)) / 2}$ above it are free.`,
        `对角线上 $${n}$ 个、上方 $${(n * (n - 1)) / 2}$ 个元素是自由的。`,
      ],
      [
        t(`skew-symmetric ${n}×${n} matrices`, `${n} 阶反对称矩阵`),
        (n * (n - 1)) / 2,
        `The diagonal must be zero, so only the $${(n * (n - 1)) / 2}$ entries above it are free.`,
        `对角线必须为零，所以只有上方的 $${(n * (n - 1)) / 2}$ 个元素是自由的。`,
      ],
      [
        t(`${n}×${n} matrices with trace zero`, `迹为零的 ${n} 阶矩阵`),
        n * n - 1,
        `All $${n * n}$ entries are subject to one linear condition.`,
        `$${n * n}$ 个元素满足一个线性条件。`,
      ],
      [
        t(`polynomials $p$ of degree at most ${n} with $p(${a}) = 0$`, `次数不超过 ${n} 且 $p(${a}) = 0$ 的多项式 $p$`),
        n,
        `The $${n + 1}$ coefficients are subject to one linear condition.`,
        `$${n + 1}$ 个系数满足一个线性条件。`,
      ],
      [
        t(`polynomials $p$ of degree at most ${n} with $p(${a}) = p(${b}) = 0$`, `次数不超过 ${n} 且 $p(${a}) = p(${b}) = 0$ 的多项式 $p$`),
        n - 1,
        `The $${n + 1}$ coefficients are subject to two independent linear conditions.`,
        `$${n + 1}$ 个系数满足两个独立的线性条件。`,
      ],
    ];
    const [family, answer, why, whyZh] = rng.pick(families);
    return numberProblem({
      prompt: t(`What is the dimension of the space of ${family.en}?`, `由${family["zh-CN"]}组成的空间是多少维？`),
      answer,
      form: "integer",
      wrong: [n * n, n, n + 1, answer + 1].filter((x) => x !== answer),
      solution: t(`${why} So the dimension is $${answer}$.`, `${whyZh}所以维数是 $${answer}$。`),
    });
  },
};

const coordinatesAroundAPoint: KnowledgePointDef = {
  id: "coordinates-in-powers-of-x-minus-a",
  title: t("Coordinates in powers of $x - a$", "以 $x - a$ 的幂为基的坐标"),
  explanation: t(
    "The polynomials $1$, $x-a$ and $(x-a)^2$ form a basis of the polynomials of degree at most two. Coordinates in this basis come from rewriting the polynomial: the coefficient of $x^2$ is the last coordinate, then subtract and continue downward.",
    "多项式 $1$、$x-a$、$(x-a)^2$ 构成次数不超过二的多项式空间的一组基。这组基下的坐标来自改写多项式：$x^2$ 的系数是最后一个坐标，然后减去这一项再继续往下。",
  ),
  generate(rng) {
    const a = nonzero(rng, 3);
    const c2 = nonzero(rng, 3);
    const c1 = nonzero(rng, 4);
    const c0 = nonzero(rng, 5);
    const p1 = c1 - 2 * a * c2;
    const p0 = c0 - a * c1 + a * a * c2;
    const base = a > 0 ? `x - ${a}` : `x + ${-a}`;
    return pointProblem({
      prompt: t(
        `Write $${poly([c2, "x^2"], [p1, "x"], [p0, ""])}$ as $c_0 + c_1(${base}) + c_2(${base})^2$. Answer as $(c_0, c_1, c_2)$.`,
        `把 $${poly([c2, "x^2"], [p1, "x"], [p0, ""])}$ 写成 $c_0 + c_1(${base}) + c_2(${base})^2$，答案写成 $(c_0, c_1, c_2)$。`,
      ),
      answer: [c0, c1, c2],
      vars: ["c_0", "c_1", "c_2"],
      wrong: [
        [p0, p1, c2],
        [c2, c1, c0],
      ],
      solution: t(
        `The coefficient of $x^2$ gives $c_2 = ${c2}$. Matching $x$ gives $c_1 - ${inParens(2 * a * c2)} = ${p1}$, so $c_1 = ${c1}$. Setting $x = ${a}$ leaves $c_0 = ${c0}$.`,
        `$x^2$ 的系数给出 $c_2 = ${c2}$。比较 $x$ 的系数得 $c_1 - ${inParens(2 * a * c2)} = ${p1}$，所以 $c_1 = ${c1}$。令 $x = ${a}$ 得 $c_0 = ${c0}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Transformations and eigenvalues
// ---------------------------------------------------------------------------

/** moves are the transformations of the plane that a composition question draws on. */
const moves: readonly (readonly [Text, Grid])[] = [
  [
    t("a rotation by 90° counterclockwise", "逆时针旋转 90°"),
    [
      [0, -1],
      [1, 0],
    ],
  ],
  [
    t("a reflection in the $x$-axis", "关于 $x$ 轴的反射"),
    [
      [1, 0],
      [0, -1],
    ],
  ],
  [
    t("a reflection in the $y$-axis", "关于 $y$ 轴的反射"),
    [
      [-1, 0],
      [0, 1],
    ],
  ],
  [
    t("a reflection in the line $y = x$", "关于直线 $y = x$ 的反射"),
    [
      [0, 1],
      [1, 0],
    ],
  ],
  [
    t("a horizontal shear by $x \\mapsto x + 2y$", "水平剪切 $x \\mapsto x + 2y$"),
    [
      [1, 2],
      [0, 1],
    ],
  ],
  [
    t("a rotation by 90° clockwise", "顺时针旋转 90°"),
    [
      [0, 1],
      [-1, 0],
    ],
  ],
  [
    t("a reflection in the line $y = -x$", "关于直线 $y = -x$ 的反射"),
    [
      [0, -1],
      [-1, 0],
    ],
  ],
  [
    t("a vertical shear by $y \\mapsto y + 3x$", "竖直剪切 $y \\mapsto y + 3x$"),
    [
      [1, 0],
      [3, 1],
    ],
  ],
];

const composingTransformations: KnowledgePointDef = {
  id: "the-matrix-of-a-composition-of-two-transformations",
  title: t("The matrix of a composition of two transformations", "两个变换复合的矩阵"),
  explanation: t(
    "Applying $S$ first and then $T$ sends $\\mathbf{x}$ to $T(S\\mathbf{x})$, so the matrix of the composition is $TS$: the transformation applied first stands on the right. Reversing the factors usually gives a different transformation.",
    "先作 $S$ 再作 $T$，把 $\\mathbf{x}$ 变成 $T(S\\mathbf{x})$，所以复合的矩阵是 $TS$：先作用的变换写在右边。交换因子通常得到另一个变换。",
  ),
  generate(rng) {
    let first: (typeof moves)[number];
    let second: (typeof moves)[number];
    let right: number[][];
    let reversed: number[][];
    do {
      [first, second] = rng.shuffle(moves) as unknown as [(typeof moves)[number], (typeof moves)[number]];
      right = times(second[1], first[1]);
      reversed = times(first[1], second[1]);
    } while (JSON.stringify(right) === JSON.stringify(reversed));
    return pickChoice(
      rng,
      t(
        `A transformation of the plane is ${first[0].en}, followed by ${second[0].en}. What is its standard matrix?`,
        `平面上的一个变换是先作${first[0]["zh-CN"]}，再作${second[0]["zh-CN"]}。它的标准矩阵是什么？`,
      ),
      both(mat(right)),
      [both(mat(reversed)), both(mat(first[1])), both(mat(second[1]))],
      t(
        `The transformation applied first stands on the right, so the matrix is $${mat(second[1])}${mat(first[1])} = ${mat(right)}$.`,
        `先作用的变换写在右边，所以矩阵是 $${mat(second[1])}${mat(first[1])} = ${mat(right)}$。`,
      ),
    );
  },
};

const otherEigenvalue: KnowledgePointDef = {
  id: "the-other-eigenvalue-from-the-trace",
  title: t("The other eigenvalue from the trace", "由迹求另一个特征值"),
  explanation: t(
    "The eigenvalues of a $2 \\times 2$ matrix add up to its trace and multiply to its determinant. So once one eigenvalue is known, the other follows from the trace, with no need to solve the characteristic equation.",
    "二阶矩阵的特征值之和等于迹，之积等于行列式。所以知道一个特征值后，由迹就能得到另一个，不必再解特征方程。",
  ),
  generate(rng) {
    const l1 = nonzero(rng, 5);
    let l2 = nonzero(rng, 5);
    if (l2 === l1) l2 = l1 + 1 === 0 ? 2 : l1 + 1;
    const A = withEigenvalues(rng, l1, l2);
    const trace = l1 + l2;
    return numberProblem({
      prompt: t(`One eigenvalue of $${mat(A)}$ is $${l1}$. Find the other.`, `$${mat(A)}$ 的一个特征值是 $${l1}$。求另一个。`),
      answer: l2,
      form: "integer",
      wrong: [l1 - trace, trace, l1 * l2],
      solution: t(
        `The trace is $${A[0]![0]} + ${inParens(A[1]![1]!)} = ${trace}$, and the eigenvalues add up to it. So the other is $${trace} - ${inParens(l1)} = ${l2}$.`,
        `迹是 $${A[0]![0]} + ${inParens(A[1]![1]!)} = ${trace}$，特征值之和等于它。所以另一个是 $${trace} - ${inParens(l1)} = ${l2}$。`,
      ),
    });
  },
};

const eigenvalueOfAPolynomial: KnowledgePointDef = {
  id: "the-eigenvalue-of-a-polynomial-in-a-matrix",
  title: t("The eigenvalue of a polynomial in a matrix", "矩阵多项式的特征值"),
  explanation: t(
    "If $A\\mathbf{v} = \\lambda\\mathbf{v}$, then $A^2\\mathbf{v} = \\lambda^2\\mathbf{v}$ and $I\\mathbf{v} = \\mathbf{v}$, and if $A$ is invertible, $A^{-1}\\mathbf{v} = \\lambda^{-1}\\mathbf{v}$. So any such combination of $A$ has the same eigenvector, with the same combination of $\\lambda$ as its eigenvalue.",
    "若 $A\\mathbf{v} = \\lambda\\mathbf{v}$，则 $A^2\\mathbf{v} = \\lambda^2\\mathbf{v}$，$I\\mathbf{v} = \\mathbf{v}$；若 $A$ 可逆，还有 $A^{-1}\\mathbf{v} = \\lambda^{-1}\\mathbf{v}$。所以 $A$ 的这类组合有相同的特征向量，特征值是 $\\lambda$ 的同样组合。",
  ),
  generate(rng) {
    const l = nonzero(rng, 4);
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 6);
    if (rng.int(0, 1) === 0) {
      const matrix = poly([1, "A^2"], [p, "A"], [q, "I"]);
      const answer = l * l + p * l + q;
      return numberProblem({
        prompt: t(
          `$A\\mathbf{v} = ${l}\\mathbf{v}$ for a nonzero vector $\\mathbf{v}$. The vector is also an eigenvector of $${matrix}$. Find the eigenvalue.`,
          `对某个非零向量 $\\mathbf{v}$ 有 $A\\mathbf{v} = ${l}\\mathbf{v}$。它也是 $${matrix}$ 的特征向量。求对应的特征值。`,
        ),
        answer,
        form: "integer",
        wrong: [l * l + p * l, answer - 2 * p * l, l + p + q],
        solution: t(
          `Apply each term to $\\mathbf{v}$: $(${l})^2 + ${inParens(p)}(${l}) + ${inParens(q)} = ${answer}$.`,
          `把每一项作用在 $\\mathbf{v}$ 上：$(${l})^2 + ${inParens(p)}(${l}) + ${inParens(q)} = ${answer}$。`,
        ),
      });
    }
    const matrix = poly([p, "A^{-1}"], [q, "I"]);
    const answer = Q.of(p, l).add(Q.of(q));
    return numberProblem({
      prompt: t(
        `$A$ is invertible and $A\\mathbf{v} = ${l}\\mathbf{v}$ for a nonzero vector $\\mathbf{v}$. The vector is also an eigenvector of $${matrix}$. Find the eigenvalue.`,
        `$A$ 可逆，且对某个非零向量 $\\mathbf{v}$ 有 $A\\mathbf{v} = ${l}\\mathbf{v}$。它也是 $${matrix}$ 的特征向量。求对应的特征值。`,
      ),
      answer,
      wrong: [p * l + q, Q.of(p, l), Q.of(-p, l).add(Q.of(q))],
      solution: t(
        `$A^{-1}\\mathbf{v} = \\frac{1}{${l}}\\mathbf{v}$, so the eigenvalue is $${frac(p, l)} + ${inParens(q)} = ${answer.toLatex()}$.`,
        `$A^{-1}\\mathbf{v} = \\frac{1}{${l}}\\mathbf{v}$，所以特征值是 $${frac(p, l)} + ${inParens(q)} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const inverseFromCayleyHamilton: KnowledgePointDef = {
  id: "the-inverse-from-cayley-hamilton",
  title: t("The inverse from Cayley–Hamilton", "由凯莱–哈密顿定理求逆"),
  explanation: t(
    "A $2 \\times 2$ matrix satisfies $A^2 - (\\operatorname{tr}A)A + (\\det A)I = 0$. When $\\det A \\ne 0$, multiply by $A^{-1}$ and rearrange: $A^{-1} = \\frac{1}{\\det A}\\left((\\operatorname{tr}A)I - A\\right)$. So the inverse of any invertible matrix of this size is a combination of the matrix itself and the identity, and no elimination is needed to find it.",
    "二阶矩阵满足 $A^2 - (\\operatorname{tr}A)A + (\\det A)I = 0$。当 $\\det A \\ne 0$ 时，乘 $A^{-1}$ 再移项，得 $A^{-1} = \\frac{1}{\\det A}\\left((\\operatorname{tr}A)I - A\\right)$。所以这种大小的可逆矩阵，其逆都是矩阵本身与单位矩阵的组合，求逆时不需要消元。",
  ),
  generate(rng) {
    let A: number[][];
    let trace: number;
    let d: number;
    do {
      A = [
        [rng.int(-3, 5), nonzero(rng, 3)],
        [nonzero(rng, 3), rng.int(-3, 5)],
      ];
      trace = A[0]![0]! + A[1]![1]!;
      d = det(A);
    } while (d === 0 || trace === 0);
    const answer = Q.of(trace, d);
    return numberProblem({
      prompt: t(
        `Write the inverse of $A = ${mat(A)}$ as $A^{-1} = pA + qI$. Find $q$.`,
        `把 $A = ${mat(A)}$ 的逆写成 $A^{-1} = pA + qI$。求 $q$。`,
      ),
      answer,
      solveFor: "q",
      wrong: [Q.of(-trace, d), Q.of(d, trace), trace],
      solution: t(
        `Here $\\operatorname{tr}A = ${trace}$ and $\\det A = ${d}$, so $A^2 - ${inParens(trace)}A + ${inParens(d)}I = 0$. Dividing by $${d}A$ gives $A^{-1} = ${frac(-1, d)}A + \\left(${answer.toLatex()}\\right)I$.`,
        `这里 $\\operatorname{tr}A = ${trace}$，$\\det A = ${d}$，所以 $A^2 - ${inParens(trace)}A + ${inParens(d)}I = 0$。除以 $${d}A$ 得 $A^{-1} = ${frac(-1, d)}A + \\left(${answer.toLatex()}\\right)I$。`,
      ),
    });
  },
};

const traceOfAPower: KnowledgePointDef = {
  id: "the-trace-of-a-power-from-the-eigenvalues",
  title: t("The trace of a power from the eigenvalues", "由特征值求幂的迹"),
  explanation: t(
    "Diagonalizing $A$ gives $A^n = PD^nP^{-1}$, and similar matrices have the same trace. So the trace of $A^n$ is the sum of the $n$th powers of the eigenvalues, which is much less work than multiplying the matrix out.",
    "对角化 $A$ 得 $A^n = PD^nP^{-1}$，而相似矩阵的迹相同。所以 $A^n$ 的迹是各特征值 $n$ 次幂之和，比把矩阵乘出来省事得多。",
  ),
  generate(rng) {
    const l1 = rng.pick([-3, -2, -1, 1, 2, 3]);
    const l2 = rng.pick([-3, -2, -1, 1, 2, 3].filter((x) => x !== l1));
    const A = withEigenvalues(rng, l1, l2);
    const n = rng.int(3, 4);
    const answer = l1 ** n + l2 ** n;
    return numberProblem({
      prompt: t(
        `The matrix $A = ${mat(A)}$ has eigenvalues $${l1}$ and $${l2}$. Find the trace of $A^{${n}}$.`,
        `矩阵 $A = ${mat(A)}$ 的特征值是 $${l1}$ 和 $${l2}$。求 $A^{${n}}$ 的迹。`,
      ),
      answer,
      form: "integer",
      wrong: [(l1 + l2) ** n, n * (l1 + l2), (l1 * l2) ** n],
      solution: t(
        `$A^{${n}}$ is similar to a diagonal matrix with entries $(${l1})^{${n}}$ and $(${l2})^{${n}}$, so its trace is $${l1 ** n} + ${inParens(l2 ** n)} = ${answer}$.`,
        `$A^{${n}}$ 相似于对角元为 $(${l1})^{${n}}$ 和 $(${l2})^{${n}}$ 的对角矩阵，所以迹是 $${l1 ** n} + ${inParens(l2 ** n)} = ${answer}$。`,
      ),
    });
  },
};

const lengthUnderRotationScaling: KnowledgePointDef = {
  id: "the-length-of-a-vector-under-a-power-of-a-rotation-scaling",
  title: t("Lengths under powers of a rotation-scaling matrix", "旋转缩放矩阵的幂下的长度"),
  explanation: t(
    "The matrix $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ rotates and multiplies every length by $r = \\sqrt{a^2+b^2}$. Rotation does not change length, so its $n$th power multiplies every length by $r^n$, whatever the direction of the vector.",
    "矩阵 $\\begin{pmatrix} a & -b \\\\ b & a \\end{pmatrix}$ 作旋转，并把所有长度乘以 $r = \\sqrt{a^2+b^2}$。旋转不改变长度，所以它的 $n$ 次幂把所有长度乘以 $r^n$，与向量的方向无关。",
  ),
  generate(rng) {
    const [p, q, r] = rng.pick([
      [3, 4, 5],
      [4, 3, 5],
      [6, 8, 10],
      [5, 12, 13],
      [0, 2, 2],
      [0, 3, 3],
    ] as const);
    const a = p * rng.pick([1, -1]);
    const b = q * rng.pick([1, -1]);
    const n = rng.int(2, 3);
    const length = rng.int(2, 7);
    const answer = length * r ** n;
    return numberProblem({
      prompt: t(
        `Let $A = ${mat([
          [a, -b],
          [b, a],
        ])}$. A vector $\\mathbf{v}$ has length $${length}$. What is the length of $A^{${n}}\\mathbf{v}$?`,
        `设 $A = ${mat([
          [a, -b],
          [b, a],
        ])}$。向量 $\\mathbf{v}$ 的长度为 $${length}$。$A^{${n}}\\mathbf{v}$ 的长度是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [length * r * n, length * r, length * (p * p + q * q) ** n],
      solution: t(
        `Each application multiplies length by $\\sqrt{${a * a} + ${b * b}} = ${r}$. After ${n} applications the length is $${length} \\cdot ${r}^{${n}} = ${answer}$.`,
        `每作用一次，长度乘以 $\\sqrt{${a * a} + ${b * b}} = ${r}$。作用 ${n} 次后长度是 $${length} \\cdot ${r}^{${n}} = ${answer}$。`,
      ),
    });
  },
};

const inverseOfIPlusNilpotent: KnowledgePointDef = {
  id: "the-inverse-of-the-identity-plus-a-nilpotent-matrix",
  title: t("The inverse of the identity plus a nilpotent matrix", "单位矩阵加幂零矩阵的逆"),
  explanation: t(
    "If $N^3 = 0$, then $(I+N)(I - N + N^2) = I + N^3 = I$, so $(I+N)^{-1} = I - N + N^2$. The series for $\\frac{1}{1+x}$ stops after finitely many terms because high powers of $N$ vanish.",
    "若 $N^3 = 0$，则 $(I+N)(I - N + N^2) = I + N^3 = I$，所以 $(I+N)^{-1} = I - N + N^2$。$\\frac{1}{1+x}$ 的级数在有限项后就停止，因为 $N$ 的高次幂为零。",
  ),
  generate(rng) {
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 4);
    const r = nonzero(rng, 5);
    const answer = p * q - r;
    return numberProblem({
      prompt: t(
        `Find the entry in row 1, column 3 of the inverse of $${mat([
          [1, p, r],
          [0, 1, q],
          [0, 0, 1],
        ])}$.`,
        `求 $${mat([
          [1, p, r],
          [0, 1, q],
          [0, 0, 1],
        ])}$ 的逆第 1 行第 3 列的元素。`,
      ),
      answer,
      form: "integer",
      wrong: [-r, r - p * q, p * q],
      solution: t(
        `The matrix is $I + N$ with $N$ strictly upper triangular, so the inverse is $I - N + N^2$. In that corner $N$ has $${r}$ and $N^2$ has $${p}(${q}) = ${p * q}$, giving $${-r} + ${inParens(p * q)} = ${answer}$.`,
        `矩阵是 $I + N$，$N$ 严格上三角，所以逆是 $I - N + N^2$。在该位置 $N$ 为 $${r}$，$N^2$ 为 $${p}(${q}) = ${p * q}$，得 $${-r} + ${inParens(p * q)} = ${answer}$。`,
      ),
    });
  },
};

const blocksFromNullities: KnowledgePointDef = {
  id: "counting-jordan-blocks-from-nullities",
  title: t("Counting Jordan blocks from nullities", "由零度数若尔当块"),
  explanation: t(
    "Let $N = A - \\lambda I$. The nullity of $N$ counts the Jordan blocks for $\\lambda$, because each block has one eigenvector. Each further power gains one dimension for every block that is long enough, so the nullity of $N^2$ minus the nullity of $N$ counts the blocks of size at least two.",
    "设 $N = A - \\lambda I$。$N$ 的零度等于 $\\lambda$ 的若尔当块个数，因为每块有一个特征向量。再乘一次，每个足够长的块都多一维，所以 $N^2$ 的零度减 $N$ 的零度，就是大小至少为二的块数。",
  ),
  generate(rng) {
    const sizes = rng.pick([
      [3, 1],
      [2, 2],
      [2, 1, 1],
      [3, 2],
      [3, 1, 1],
      [2, 2, 1],
      [4, 2],
      [3, 2, 1],
      [2, 1, 1, 1],
      [2, 2, 2],
    ]);
    const nullity = (k: number) => sizes.reduce((s, x) => s + Math.min(x, k), 0);
    const [n1, n2] = [nullity(1), nullity(2)];
    const total = sizes.reduce((s, x) => s + x, 0);
    const l = nonzero(rng, 4);
    const singles = sizes.filter((x) => x === 1).length;
    const askSingles = rng.int(0, 1) === 0;
    const answer = askSingles ? singles : n2 - n1;
    const given = `$A$ is a ${total}×${total} matrix whose only eigenvalue is $${l}$. With $N = A - (${l})I$, the nullity of $N$ is $${n1}$ and the nullity of $N^2$ is $${n2}$.`;
    const givenZh = `$A$ 是 ${total} 阶矩阵，唯一的特征值是 $${l}$。设 $N = A - (${l})I$，$N$ 的零度是 $${n1}$，$N^2$ 的零度是 $${n2}$。`;
    return numberProblem({
      prompt: askSingles
        ? t(`${given} How many Jordan blocks have size exactly 1?`, `${givenZh}大小恰为 1 的若尔当块有多少个？`)
        : t(`${given} How many Jordan blocks have size at least 2?`, `${givenZh}大小至少为 2 的若尔当块有多少个？`),
      answer,
      form: "integer",
      wrong: [n1, n2, askSingles ? n2 - n1 : singles, answer + 1].filter((x) => x !== answer),
      solution: t(
        `There are $${n1}$ blocks in all, and $${n2} - ${n1} = ${n2 - n1}$ of them have size at least 2.${askSingles ? ` That leaves $${n1} - ${n2 - n1} = ${singles}$ of size 1.` : ""}`,
        `一共有 $${n1}$ 个块，其中 $${n2} - ${n1} = ${n2 - n1}$ 个大小至少为 2。${askSingles ? `剩下 $${n1} - ${n2 - n1} = ${singles}$ 个大小为 1。` : ""}`,
      ),
    });
  },
};

const exponentialOfJordanBlock: KnowledgePointDef = {
  id: "the-exponential-of-a-2x2-jordan-block",
  title: t("The exponential of a 2×2 Jordan block", "二阶若尔当块的指数"),
  explanation: t(
    "Write $A = \\lambda I + N$ with $N^2 = 0$. Since $\\lambda I$ and $N$ commute, $e^{At} = e^{\\lambda t}e^{Nt} = e^{\\lambda t}(I + tN)$. The exponential series for $N$ stops after two terms, and so a factor of $t$ appears beside the exponential.",
    "把 $A$ 写成 $\\lambda I + N$，其中 $N^2 = 0$。因为 $\\lambda I$ 与 $N$ 可交换，$e^{At} = e^{\\lambda t}e^{Nt} = e^{\\lambda t}(I + tN)$。$N$ 的指数级数两项后就停止，所以指数旁边出现因子 $t$。",
  ),
  generate(rng) {
    const l = nonzero(rng, 5);
    const c = nonzero(rng, 4);
    const off = c === 1 ? "t" : c === -1 ? "-t" : `${c}t`;
    const lt = l === 1 ? "t" : l === -1 ? "-t" : `${l}t`;
    const exp = `e^{${lt}}`;
    return pickChoice(
      rng,
      t(
        `What is $e^{At}$ for $A = ${mat([
          [l, c],
          [0, l],
        ])}$?`,
        `$A = ${mat([
          [l, c],
          [0, l],
        ])}$ 时，$e^{At}$ 是什么？`,
      ),
      both(
        `${exp}${mat([
          [1, off],
          [0, 1],
        ])}`,
      ),
      [
        both(
          mat([
            [exp, `e^{${off}}`],
            [0, exp],
          ]),
        ),
        both(
          `${exp}${mat([
            [1, c],
            [0, 1],
          ])}`,
        ),
        both(
          mat([
            [exp, off],
            [0, exp],
          ]),
        ),
      ],
      t(
        `Here $A = ${l}I + N$ with $N = ${mat([
          [0, c],
          [0, 0],
        ])}$ and $N^2 = 0$. So $e^{At} = ${exp}(I + tN)$, which has $${off}$ in the corner, multiplied by the exponential like every other entry.`,
        `这里 $A = ${l}I + N$，$N = ${mat([
          [0, c],
          [0, 0],
        ])}$，$N^2 = 0$。所以 $e^{At} = ${exp}(I + tN)$，角上是 $${off}$，它和其他元素一样乘以指数。`,
      ),
    );
  },
};

// ---------------------------------------------------------------------------
// Orthogonality and projections
// ---------------------------------------------------------------------------

/** triples are Pythagorean triples, for orthogonal matrices with rational entries. */
const triples = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
] as const;

const completingARotation: KnowledgePointDef = {
  id: "completing-an-orthogonal-matrix",
  title: t("Completing an orthogonal matrix", "补全正交矩阵"),
  explanation: t(
    "The columns of an orthogonal matrix are perpendicular unit vectors. In the plane, a unit vector $(a, b)$ leaves two perpendicular unit vectors, $(-b, a)$ and $(b, -a)$. The determinant decides between them: $+1$ gives a rotation and $-1$ a reflection.",
    "正交矩阵的列是互相垂直的单位向量。在平面上，单位向量 $(a, b)$ 只有两个垂直的单位向量：$(-b, a)$ 和 $(b, -a)$。行列式决定选哪一个：$+1$ 是旋转，$-1$ 是反射。",
  ),
  generate(rng) {
    const [p, q, r] = rng.pick(triples);
    const sa = rng.pick([1, -1]);
    const sb = rng.pick([1, -1]);
    const a = Q.of(sa * p, r);
    const b = Q.of(sb * q, r);
    const rotation = rng.int(0, 1) === 0;
    const x = rotation ? b.mul(Q.of(-1)) : b;
    const y = rotation ? a : a.mul(Q.of(-1));
    const answer = x.add(y);
    const matrix = mat([
      [a.toLatex(), "x"],
      [b.toLatex(), "y"],
    ]);
    return numberProblem({
      prompt: t(
        `The matrix $${matrix}$ is orthogonal with determinant $${rotation ? 1 : -1}$. Find $x + y$.`,
        `矩阵 $${matrix}$ 是正交矩阵，行列式为 $${rotation ? 1 : -1}$。求 $x + y$。`,
      ),
      answer,
      wrong: [answer.mul(Q.of(-1)), a.add(b), x.sub(y)],
      solution: t(
        `The second column is a unit vector perpendicular to the first, so $(x, y)$ is $\\pm(${b.mul(Q.of(-1)).toLatex()}, ${a.toLatex()})$. The determinant $${rotation ? 1 : -1}$ picks $x = ${x.toLatex()}$ and $y = ${y.toLatex()}$, whose sum is $${answer.toLatex()}$.`,
        `第二列是与第一列垂直的单位向量，所以 $(x, y)$ 是 $\\pm(${b.mul(Q.of(-1)).toLatex()}, ${a.toLatex()})$。行列式 $${rotation ? 1 : -1}$ 确定 $x = ${x.toLatex()}$，$y = ${y.toLatex()}$，它们的和是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const reflectionFromProjection: KnowledgePointDef = {
  id: "the-reflection-matrix-from-a-projection",
  title: t("The reflection matrix from a projection", "由投影矩阵得反射矩阵"),
  explanation: t(
    "To reflect $\\mathbf{x}$ in a line, move to its projection $P\\mathbf{x}$ and go the same distance again, which gives $2P\\mathbf{x} - \\mathbf{x}$. So the reflection matrix is $R = 2P - I$, where $P = \\frac{\\mathbf{u}\\mathbf{u}^T}{\\mathbf{u}^T\\mathbf{u}}$ is the projection onto the line along $\\mathbf{u}$.",
    "要把 $\\mathbf{x}$ 关于直线反射，先走到投影 $P\\mathbf{x}$，再走同样的距离，得到 $2P\\mathbf{x} - \\mathbf{x}$。所以反射矩阵是 $R = 2P - I$，其中 $P = \\frac{\\mathbf{u}\\mathbf{u}^T}{\\mathbf{u}^T\\mathbf{u}}$ 是到方向 $\\mathbf{u}$ 的直线上的投影。",
  ),
  generate(rng) {
    const p = nonzero(rng, 5);
    const q = rng.pick([1, 2, 3, 4, 5].filter((x) => x !== Math.abs(p)));
    const uu = p * p + q * q;
    const corner = rng.int(0, 1) === 0;
    const answer = corner ? Q.of(p * p - q * q, uu) : Q.of(2 * p * q, uu);
    return numberProblem({
      prompt: t(
        `$R$ is the matrix of the reflection in the line through the origin along $${col(p, q)}$. Find the entry in row 1, column ${corner ? 1 : 2} of $R$.`,
        `$R$ 是关于过原点、方向为 $${col(p, q)}$ 的直线的反射矩阵。求 $R$ 第 1 行第 ${corner ? 1 : 2} 列的元素。`,
      ),
      answer,
      wrong: corner
        ? [Q.of(p * p, uu), Q.of(2 * p * p, uu), Q.of(q * q - p * p, uu)]
        : [Q.of(p * q, uu), Q.of(-2 * p * q, uu), Q.of(2 * p * q)],
      solution: t(
        `$P$ has entry $${frac(corner ? p * p : p * q, uu)}$ in that place. Then $R = 2P - I$ gives $${corner ? `2\\left(${frac(p * p, uu)}\\right) - 1` : `2\\left(${frac(p * q, uu)}\\right)`} = ${answer.toLatex()}$.`,
        `$P$ 在该位置的元素是 $${frac(corner ? p * p : p * q, uu)}$。由 $R = 2P - I$ 得 $${corner ? `2\\left(${frac(p * p, uu)}\\right) - 1` : `2\\left(${frac(p * q, uu)}\\right)`} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const leastSquaresError: KnowledgePointDef = {
  id: "the-smallest-squared-error-of-a-least-squares-fit",
  title: t("The smallest squared error of a least-squares fit", "最小二乘拟合的最小平方误差"),
  explanation: t(
    "After finding the least-squares solution, the size of the fit is the length of the residual $\\mathbf{b} - A\\hat{\\mathbf{x}}$. The residual is perpendicular to the column space, so by Pythagoras $\\|\\mathbf{b} - A\\hat{\\mathbf{x}}\\|^2 = \\|\\mathbf{b}\\|^2 - \\|A\\hat{\\mathbf{x}}\\|^2$.",
    "求出最小二乘解后，拟合的好坏由残差 $\\mathbf{b} - A\\hat{\\mathbf{x}}$ 的长度衡量。残差与列空间垂直，所以由勾股定理，$\\|\\mathbf{b} - A\\hat{\\mathbf{x}}\\|^2 = \\|\\mathbf{b}\\|^2 - \\|A\\hat{\\mathbf{x}}\\|^2$。",
  ),
  generate(rng) {
    const a = [nonzero(rng, 3), nonzero(rng, 3), nonzero(rng, 3)];
    let b: number[];
    do b = [rng.int(-4, 5), rng.int(-4, 5), rng.int(-4, 5)];
    while (dot(a, b) === 0 || a[0]! * b[1]! === a[1]! * b[0]! || a[1]! * b[2]! === a[2]! * b[1]!);
    const [aa, ab, bb] = [dot(a, a), dot(a, b), dot(b, b)];
    const xhat = Q.of(ab, aa);
    const answer = Q.of(bb * aa - ab * ab, aa);
    return numberProblem({
      prompt: t(
        `Find the smallest possible value of $\\|A x - \\mathbf{b}\\|^2$ over all numbers $x$, for $A = ${col(...a)}$ and $\\mathbf{b} = ${col(...b)}$.`,
        `$A = ${col(...a)}$，$\\mathbf{b} = ${col(...b)}$。对所有数 $x$，求 $\\|A x - \\mathbf{b}\\|^2$ 的最小值。`,
      ),
      answer,
      wrong: [bb, Q.of(ab * ab, aa), xhat],
      solution: t(
        `The best $x$ is $\\frac{A^T\\mathbf{b}}{A^TA} = ${xhat.toLatex()}$. The fit has squared length $\\frac{(${ab})^2}{${aa}}$, and the rest of $\\|\\mathbf{b}\\|^2 = ${bb}$ is the error: $${bb} - ${Q.of(ab * ab, aa).toLatex()} = ${answer.toLatex()}$.`,
        `最佳的 $x$ 是 $\\frac{A^T\\mathbf{b}}{A^TA} = ${xhat.toLatex()}$。拟合部分的长度平方是 $\\frac{(${ab})^2}{${aa}}$，$\\|\\mathbf{b}\\|^2 = ${bb}$ 中其余部分就是误差：$${bb} - ${Q.of(ab * ab, aa).toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Symmetric matrices, quadratic forms and the SVD
// ---------------------------------------------------------------------------

const perpendicularEigenvectors: KnowledgePointDef = {
  id: "the-second-eigenvector-of-a-symmetric-matrix",
  title: t("The second eigenvector of a symmetric matrix", "对称矩阵的第二个特征向量"),
  explanation: t(
    "Eigenvectors of a symmetric matrix that belong to different eigenvalues are perpendicular. So knowing one eigenvector is enough to fix the direction of the other in the plane, with no need to know the matrix.",
    "对称矩阵属于不同特征值的特征向量互相垂直。所以在平面上，知道一个特征向量就确定了另一个的方向，甚至不需要知道矩阵本身。",
  ),
  generate(rng) {
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 4);
    const w = nonzero(rng, 5);
    const l1 = nonzero(rng, 5);
    const l2 = l1 > 0 ? l1 + rng.int(1, 4) : l1 - rng.int(1, 4);
    const answer = Q.of(-w * q, p);
    return numberProblem({
      prompt: t(
        `A symmetric matrix $A$ has $A${col(p, q)} = ${l1}${col(p, q)}$ and $A${col("k", w)} = ${l2}${col("k", w)}$. Find $k$.`,
        `对称矩阵 $A$ 满足 $A${col(p, q)} = ${l1}${col(p, q)}$，$A${col("k", w)} = ${l2}${col("k", w)}$。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      wrong: [Q.of(w * q, p), Q.of(-w * p, q), Q.of(w * p, q)],
      solution: t(
        `The eigenvalues differ, so the eigenvectors are perpendicular: $${p}k + ${inParens(q)}(${w}) = 0$. So $k = ${answer.toLatex()}$.`,
        `特征值不同，所以特征向量垂直：$${p}k + ${inParens(q)}(${w}) = 0$。所以 $k = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const evaluatingAQuadraticForm: KnowledgePointDef = {
  id: "evaluating-a-quadratic-form-from-its-matrix",
  title: t("Evaluating a quadratic form from its matrix", "由矩阵计算二次型的值"),
  explanation: t(
    "The value $\\mathbf{x}^TA\\mathbf{x}$ is a number. Compute $A\\mathbf{x}$ first and then take the dot product with $\\mathbf{x}$. Written out, each off-diagonal entry counts twice, because $a_{ij}x_ix_j$ and $a_{ji}x_jx_i$ are both present.",
    "$\\mathbf{x}^TA\\mathbf{x}$ 的值是一个数。先算 $A\\mathbf{x}$，再与 $\\mathbf{x}$ 作数量积。展开时，每个非对角元都算两次，因为 $a_{ij}x_ix_j$ 和 $a_{ji}x_jx_i$ 都出现。",
  ),
  generate(rng) {
    const [a, b, c] = [rng.int(-3, 4), rng.int(-3, 4), rng.int(-3, 4)];
    const [d, e, f] = [nonzero(rng, 3), nonzero(rng, 3), nonzero(rng, 3)];
    const A = [
      [a, d, e],
      [d, b, f],
      [e, f, c],
    ];
    const x = [nonzero(rng, 2), nonzero(rng, 2), nonzero(rng, 2)];
    const Ax = A.map((r) => dot(r, x));
    const answer = dot(x, Ax);
    const diagonal = a * x[0]! ** 2 + b * x[1]! ** 2 + c * x[2]! ** 2;
    return numberProblem({
      prompt: t(
        `Find $\\mathbf{x}^TA\\mathbf{x}$ for $A = ${mat(A)}$ and $\\mathbf{x} = ${col(...x)}$.`,
        `$A = ${mat(A)}$，$\\mathbf{x} = ${col(...x)}$。求 $\\mathbf{x}^TA\\mathbf{x}$。`,
      ),
      answer,
      form: "integer",
      wrong: [diagonal, (answer + diagonal) / 2, dot(Ax, [1, 1, 1])],
      solution: t(
        `First $A\\mathbf{x} = (${Ax.join(", ")})$. Its dot product with $\\mathbf{x}$ is $${answer}$.`,
        `先算 $A\\mathbf{x} = (${Ax.join(", ")})$。它与 $\\mathbf{x}$ 的数量积是 $${answer}$。`,
      ),
    });
  },
};

const definiteRange: KnowledgePointDef = {
  id: "the-largest-entry-that-keeps-a-form-positive-definite",
  title: t("The largest entry that keeps a form positive definite", "保持二次型正定的最大元素"),
  explanation: t(
    "A symmetric $\\begin{pmatrix} a & k \\\\ k & b \\end{pmatrix}$ is positive definite exactly when $a > 0$ and $ab - k^2 > 0$. The second inequality is strict, so when $ab$ is a perfect square the value $k = \\sqrt{ab}$ is not allowed: the matrix would be singular.",
    "对称矩阵 $\\begin{pmatrix} a & k \\\\ k & b \\end{pmatrix}$ 正定，当且仅当 $a > 0$ 且 $ab - k^2 > 0$。第二个不等式是严格的，所以 $ab$ 是完全平方数时不能取 $k = \\sqrt{ab}$：那时矩阵是奇异的。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = rng.int(2, 9);
    const ab = a * b;
    let answer = Math.floor(Math.sqrt(ab));
    if (answer * answer === ab) answer -= 1;
    return numberProblem({
      prompt: t(
        `What is the largest integer $k$ for which $${mat([
          [a, "k"],
          ["k", b],
        ])}$ is positive definite?`,
        `使 $${mat([
          [a, "k"],
          ["k", b],
        ])}$ 正定的最大整数 $k$ 是多少？`,
      ),
      answer,
      solveFor: "k",
      wrong: [answer + 1, ab, ab - 1],
      solution: t(
        `The leading entry $${a}$ is positive, so we need $k^2 < ${ab}$. Now $${answer}^2 = ${answer * answer}$ is below $${ab}$, and $${answer + 1}^2 = ${(answer + 1) ** 2}$ is not.`,
        `首元素 $${a}$ 为正，所以需要 $k^2 < ${ab}$。而 $${answer}^2 = ${answer * answer}$ 小于 $${ab}$，$${answer + 1}^2 = ${(answer + 1) ** 2}$ 则不小于。`,
      ),
    });
  },
};

const conditionNumber: KnowledgePointDef = {
  id: "the-condition-number-from-singular-values",
  title: t("The condition number from singular values", "由奇异值求条件数"),
  explanation: t(
    "The condition number of an invertible matrix is the largest singular value divided by the smallest. It measures how much the matrix can magnify relative errors. When the columns are orthogonal, the singular values are simply the lengths of the columns.",
    "可逆矩阵的条件数是最大奇异值除以最小奇异值，它衡量矩阵会把相对误差放大多少。各列正交时，奇异值就是各列的长度。",
  ),
  generate(rng) {
    const [p, q, r] = rng.pick(triples);
    const s = rng.int(1, 4);
    let u = rng.int(1, 4);
    if (u === s) u += 1;
    const big = Math.max(s, u);
    const small = Math.min(s, u);
    const A = [
      [p * s, -q * u],
      [q * s, p * u],
    ];
    return numberProblem({
      prompt: t(
        `The columns of $${mat(A)}$ are orthogonal. Find the condition number of this matrix, the ratio of its largest singular value to its smallest.`,
        `$${mat(A)}$ 的各列正交。求它的条件数，即最大奇异值与最小奇异值之比。`,
      ),
      answer: Q.of(big, small),
      wrong: [Q.of(small, big), r * big, Q.of(big * big, small * small)],
      solution: t(
        `The singular values are the column lengths, $${r * s}$ and $${r * u}$. The ratio of the larger to the smaller is $${frac(big, small)}$.`,
        `奇异值是各列的长度，$${r * s}$ 和 $${r * u}$。较大者与较小者之比是 $${frac(big, small)}$。`,
      ),
    });
  },
};

const pseudoinverseOfADiagonal: KnowledgePointDef = {
  id: "the-pseudoinverse-of-a-diagonal-matrix",
  title: t("The pseudoinverse of a diagonal matrix", "对角矩阵的伪逆"),
  explanation: t(
    "The pseudoinverse of a diagonal matrix inverts each nonzero entry and leaves each zero as zero. A singular matrix has no true inverse, but on the directions it does not kill, its pseudoinverse undoes it.",
    "对角矩阵的伪逆把每个非零元素取倒数，零仍然是零。奇异矩阵没有真正的逆，但在它不压缩为零的方向上，伪逆能把它还原。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    let b = nonzero(rng, 5);
    if (b === -a) b = a;
    const zeros = rng.int(0, 2);
    const diagonal = [a, b, 0];
    const entries = [diagonal[zeros % 3]!, diagonal[(zeros + 1) % 3]!, diagonal[(zeros + 2) % 3]!];
    const answer = Q.of(1, a).add(Q.of(1, b));
    return numberProblem({
      prompt: t(
        `Find the trace of the pseudoinverse of $${mat([
          [entries[0]!, 0, 0],
          [0, entries[1]!, 0],
          [0, 0, entries[2]!],
        ])}$.`,
        `求 $${mat([
          [entries[0]!, 0, 0],
          [0, entries[1]!, 0],
          [0, 0, entries[2]!],
        ])}$ 的伪逆的迹。`,
      ),
      answer,
      wrong: [a + b, Q.of(1, a + b === 0 ? 1 : a + b), Q.of(1, a * b)],
      solution: t(
        `Invert the nonzero entries and keep the zero: the diagonal holds $${frac(1, a)}$, $${frac(1, b)}$ and $0$. The trace is their sum, $${answer.toLatex()}$.`,
        `非零元素取倒数，零保持不变：对角线上是 $${frac(1, a)}$、$${frac(1, b)}$ 和 $0$。迹是它们的和，$${answer.toLatex()}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

const rateOfConvergence: KnowledgePointDef = {
  id: "how-fast-a-two-state-chain-settles",
  title: t("How fast a two-state chain settles", "两状态马尔可夫链的收敛速度"),
  explanation: t(
    "A $2 \\times 2$ stochastic matrix has the eigenvalue $1$, and since the eigenvalues add up to the trace, its other eigenvalue is the trace minus one. Each step multiplies the distance from the steady state by this second eigenvalue, so a value near zero means the chain settles quickly.",
    "二阶随机矩阵有特征值 $1$，又因为特征值之和等于迹，另一个特征值是迹减一。每走一步，到稳态的距离就乘以这第二个特征值，所以它接近零时，链很快稳定。",
  ),
  generate(rng) {
    const p = rng.int(1, 8);
    const q = rng.int(1, 9 - p);
    const stay1 = 10 - p;
    const stay2 = 10 - q;
    const answer = Q.of(10 - p - q, 10);
    return numberProblem({
      prompt: t(
        `Each step of a Markov chain multiplies the state by $P = ${mat([
          [Q.of(stay1, 10).toLatex(), Q.of(q, 10).toLatex()],
          [Q.of(p, 10).toLatex(), Q.of(stay2, 10).toLatex()],
        ])}$. By what factor does each step multiply the distance from the steady state?`,
        `马尔可夫链每一步把状态乘以 $P = ${mat([
          [Q.of(stay1, 10).toLatex(), Q.of(q, 10).toLatex()],
          [Q.of(p, 10).toLatex(), Q.of(stay2, 10).toLatex()],
        ])}$。每一步把到稳态的距离乘以多少？`,
      ),
      answer,
      wrong: [1, Q.of(p + q, 10), Q.of(stay1 * stay2, 100)],
      solution: t(
        `One eigenvalue is $1$, and the trace is $${Q.of(stay1 + stay2, 10).toLatex()}$. So the other is $${Q.of(stay1 + stay2, 10).toLatex()} - 1 = ${answer.toLatex()}$, and this is the factor.`,
        `一个特征值是 $1$，迹是 $${Q.of(stay1 + stay2, 10).toLatex()}$。所以另一个是 $${Q.of(stay1 + stay2, 10).toLatex()} - 1 = ${answer.toLatex()}$，这就是所求的倍数。`,
      ),
    });
  },
};

const slopeFromNormalEquations: KnowledgePointDef = {
  id: "the-slope-from-the-normal-equations",
  title: t("The slope of a regression line from the normal equations", "由正规方程求回归直线的斜率"),
  explanation: t(
    "For the line $y = b_0 + b_1x$ the matrix $X$ has a column of ones and a column of $x$ values. Solving $X^TX\\mathbf{b} = X^T\\mathbf{y}$ for the slope gives $b_1 = \\frac{n\\sum xy - \\sum x\\sum y}{n\\sum x^2 - (\\sum x)^2}$, which counts the data points $n$ and uses each of the sums.",
    "对直线 $y = b_0 + b_1x$，矩阵 $X$ 有一列 1 和一列 $x$ 值。由 $X^TX\\mathbf{b} = X^T\\mathbf{y}$ 解出斜率，得 $b_1 = \\frac{n\\sum xy - \\sum x\\sum y}{n\\sum x^2 - (\\sum x)^2}$，其中 $n$ 是数据点的个数，每个和都要用到。",
  ),
  generate(rng) {
    const n = 4;
    const start = rng.int(-2, 3);
    const xs = [start, start + 1, start + 2, start + 4];
    const ys = xs.map(() => rng.int(-3, 8));
    if (new Set(ys).size === 1) ys[0]! += 1;
    const [sx, sy, sxx, sxy] = [xs.reduce((a, b) => a + b, 0), ys.reduce((a, b) => a + b, 0), dot(xs, xs), dot(xs, ys)];
    const denominator = n * sxx - sx * sx;
    const numerator = n * sxy - sx * sy;
    const answer = Q.of(numerator, denominator);
    const points = xs.map((x, i) => `(${x}, ${ys[i]})`).join(", ");
    return numberProblem({
      prompt: t(`Find the slope of the least-squares line through the points $${points}$.`, `求过点 $${points}$ 的最小二乘直线的斜率。`),
      answer,
      wrong: [sxx === 0 ? 1 : Q.of(sxy, sxx), Q.of(sy, sx === 0 ? 1 : sx), Q.of(denominator, numerator === 0 ? 1 : numerator)],
      solution: t(
        `Here $\\sum x = ${sx}$, $\\sum y = ${sy}$, $\\sum x^2 = ${sxx}$ and $\\sum xy = ${sxy}$. So $b_1 = \\frac{${n}(${sxy}) - (${sx})(${sy})}{${n}(${sxx}) - (${sx})^2} = ${answer.toLatex()}$.`,
        `这里 $\\sum x = ${sx}$，$\\sum y = ${sy}$，$\\sum x^2 = ${sxx}$，$\\sum xy = ${sxy}$。所以 $b_1 = \\frac{${n}(${sxy}) - (${sx})(${sy})}{${n}(${sxx}) - (${sx})^2} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Second pass
// ---------------------------------------------------------------------------

/** signedTerm writes an integer as a term to be added, with its sign and a space. */
const signedTerm = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`);
/** det3 expands the determinant of a 3 by 3 matrix along its first row. */
const det3 = ([[a, b, c], [d, e, f], [g, h, i]]: [[number, number, number], [number, number, number], [number, number, number]]) =>
  a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
/** withCoefficient writes a positive coefficient before a symbol, leaving out 1. */
const withCoefficient = (n: number, symbol: string) => `${n === 1 ? "" : n}${symbol}`;
/** shiftTerm writes a multiple of the identity as a term to be added, leaving out a coefficient of 1. */
const shiftTerm = (n: number) => `${n < 0 ? "-" : "+"} ${withCoefficient(Math.abs(n), "I")}`;
/** binomial2 counts the ways to choose two things from n. */
const binomial2 = (n: number) => (n * (n - 1)) / 2;

const lineMeetsHorizontalPlane: KnowledgePointDef = {
  id: "where-a-line-meets-a-plane-of-constant-height",
  title: t("Where a line meets a plane of constant height", "直线与等高平面的交点"),
  explanation: t(
    "A point lies on a parametric line for exactly one value of the parameter, so a condition on one coordinate decides the whole point. To find where a line meets the plane $z = k$, solve the $z$ equation for $t$, then put that value of $t$ into the other coordinates. All three coordinates must use the same value of the parameter.",
    "参数直线上的一个点恰好对应一个参数值，所以对一个坐标的条件就决定了整个点。要求直线与平面 $z = k$ 的交点，先从 $z$ 的方程解出 $t$，再把这个 $t$ 代入其他坐标。三个坐标必须使用同一个参数值。",
  ),
  generate(rng) {
    const a = rng.int(-5, 5);
    const b = rng.int(-5, 5);
    const c = rng.int(-5, 5);
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 4);
    const r = nonzero(rng, 4);
    const k = rng.pick([...Array(21).keys()].map((i) => i - 10).filter((v) => v !== c));
    const time = Q.of(k - c, r);
    const answer = Q.of(a).add(time.mul(Q.of(p)));
    return numberProblem({
      prompt: t(
        `The line $x = ${poly([a, ""], [p, "t"])}$, $y = ${poly([b, ""], [q, "t"])}$, $z = ${poly([c, ""], [r, "t"])}$ meets the plane $z = ${k}$. Find the $x$-coordinate of that point.`,
        `直线 $x = ${poly([a, ""], [p, "t"])}$，$y = ${poly([b, ""], [q, "t"])}$，$z = ${poly([c, ""], [r, "t"])}$ 与平面 $z = ${k}$ 相交。求交点的 $x$ 坐标。`,
      ),
      answer,
      wrong: [time, Q.of(a + p * (k - c)), Q.of(a).add(Q.of(k, r).mul(Q.of(p))), Q.of(a).sub(time.mul(Q.of(p))), answer.add(Q.of(1))],
      solution: t(
        `Setting $z = ${k}$ gives $t = ${time.toLatex()}$. Then $x = ${poly([a, ""], [p, "t"])} = ${answer.toLatex()}$.`,
        `令 $z = ${k}$，得 $t = ${time.toLatex()}$。于是 $x = ${poly([a, ""], [p, "t"])} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const pointOnSymmetricLine: KnowledgePointDef = {
  id: "a-point-on-a-line-in-symmetric-form",
  title: t("A point on a line in symmetric form", "对称式直线上的点"),
  explanation: t(
    "In the symmetric form of a line, the three fractions share one value, and that shared value is the parameter $t$. So once one coordinate is known, its fraction gives $t$, and every other coordinate follows by solving its own fraction. There is no need to convert to parametric equations first, although the working is exactly the same.",
    "在直线的对称式中，三个分式取同一个值，这个共同的值就是参数 $t$。所以一旦知道一个坐标，它的分式就给出 $t$，其他坐标都可以由各自的分式解出。不需要先化成参数方程，尽管计算实质上是一样的。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 6);
    const c = nonzero(rng, 6);
    const p = rng.int(2, 6);
    const q = rng.int(2, 6);
    const r = rng.int(2, 6);
    const x = rng.pick([...Array(21).keys()].map((i) => i - 10).filter((v) => v !== a));
    const shift = Q.of(q * (x - a), p);
    const answer = Q.of(b).add(shift);
    const line = `\\frac{x ${signedTerm(-a)}}{${p}} = \\frac{y ${signedTerm(-b)}}{${q}} = \\frac{z ${signedTerm(-c)}}{${r}}`;
    const value = Q.of(x - a, p);
    return numberProblem({
      prompt: t(
        `A point on the line $${line}$ has $x = ${x}$. Find its $y$-coordinate.`,
        `直线 $${line}$ 上的一点满足 $x = ${x}$。求它的 $y$ 坐标。`,
      ),
      answer,
      wrong: [shift, Q.of(b).sub(shift), Q.of(b).add(Q.of(p * (x - a), q)), value],
      solution: t(
        `The common value of the fractions is $${value.toLatex()}$. So $y = ${b} + ${q} \\cdot \\left(${value.toLatex()}\\right) = ${answer.toLatex()}$.`,
        `这些分式的共同值是 $${value.toLatex()}$。所以 $y = ${b} + ${q} \\cdot \\left(${value.toLatex()}\\right) = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const planeIntercept: KnowledgePointDef = {
  id: "the-intercept-of-a-plane-on-an-axis",
  title: t("The intercept of a plane on an axis", "平面在坐标轴上的截距"),
  explanation: t(
    "Every point on the $x$-axis has the form $(x, 0, 0)$. Putting this into the equation $\\mathbf{n} \\cdot \\mathbf{r} = d$ leaves only the term with the first component of the normal, so $n_1 x = d$. The intercept therefore divides $d$ by that one component. The other two components of the normal affect the other two intercepts instead.",
    "$x$ 轴上的每个点都形如 $(x, 0, 0)$。把它代入方程 $\\mathbf{n} \\cdot \\mathbf{r} = d$，只留下含法向量第一个分量的项，所以 $n_1 x = d$。因此截距就是 $d$ 除以这一个分量。法向量的另外两个分量影响的是另外两个截距。",
  ),
  generate(rng) {
    const n1 = nonzero(rng, 9);
    const n2 = nonzero(rng, 9);
    const n3 = nonzero(rng, 9);
    const d = nonzero(rng, 20);
    const answer = Q.of(d, n1);
    return numberProblem({
      prompt: t(
        `A plane has equation $\\langle ${n1}, ${n2}, ${n3} \\rangle \\cdot \\mathbf{r} = ${d}$. Find the $x$-coordinate of the point where it meets the $x$-axis.`,
        `一个平面的方程是 $\\langle ${n1}, ${n2}, ${n3} \\rangle \\cdot \\mathbf{r} = ${d}$。求它与 $x$ 轴交点的 $x$ 坐标。`,
      ),
      answer,
      wrong: [Q.of(n1, d), Q.of(d, n2), answer.neg(), Q.of(d), answer.add(Q.of(1))],
      solution: t(
        `At $(x, 0, 0)$, the equation becomes $${poly([n1, "x"])} = ${d}$, so $x = ${answer.toLatex()}$.`,
        `在 $(x, 0, 0)$ 处，方程变成 $${poly([n1, "x"])} = ${d}$，所以 $x = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const planeConstantFromSpan: KnowledgePointDef = {
  id: "the-scalar-equation-from-a-parametric-plane",
  title: t("The scalar equation from a parametric plane", "由参数平面求标量方程"),
  explanation: t(
    "Both spanning vectors of a plane are perpendicular to its normal, so their cross product $\\mathbf{n} = \\mathbf{u} \\times \\mathbf{v}$ is a normal. The value $\\mathbf{n} \\cdot \\mathbf{r}$ is the same at every point of the plane, because moving along $\\mathbf{u}$ or $\\mathbf{v}$ does not change it. So the base point supplies the constant $d = \\mathbf{n} \\cdot \\mathbf{p}$.",
    "平面的两个张成向量都垂直于法向量，所以它们的叉积 $\\mathbf{n} = \\mathbf{u} \\times \\mathbf{v}$ 就是法向量。$\\mathbf{n} \\cdot \\mathbf{r}$ 的值在平面上每一点都相同，因为沿 $\\mathbf{u}$ 或 $\\mathbf{v}$ 移动都不改变它。所以基点给出常数 $d = \\mathbf{n} \\cdot \\mathbf{p}$。",
  ),
  generate(rng) {
    const point = [nonzero(rng, 5), nonzero(rng, 5), nonzero(rng, 5)];
    const u = [1, nonzero(rng, 3), nonzero(rng, 3)] as const;
    const v = [0, 1, nonzero(rng, 3)] as const;
    const normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const answer = dot(normal, point);
    return numberProblem({
      prompt: t(
        `A plane has equation $\\mathbf{r}(s, t) = \\langle ${point.join(", ")} \\rangle + s\\langle ${u.join(", ")} \\rangle + t\\langle ${v.join(", ")} \\rangle$. With $\\mathbf{n}$ the cross product of the first spanning vector with the second, write the plane as $\\mathbf{n} \\cdot \\mathbf{r} = d$. Find $d$.`,
        `一个平面的方程是 $\\mathbf{r}(s, t) = \\langle ${point.join(", ")} \\rangle + s\\langle ${u.join(", ")} \\rangle + t\\langle ${v.join(", ")} \\rangle$。设 $\\mathbf{n}$ 是第一个张成向量与第二个张成向量的叉积，把平面写成 $\\mathbf{n} \\cdot \\mathbf{r} = d$。求 $d$。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, dot(u, point), dot(v, point), answer + 1],
      solution: t(
        `The cross product is $\\mathbf{n} = \\langle ${normal.join(", ")} \\rangle$. Its dot product with the base point is $${answer}$.`,
        `叉积是 $\\mathbf{n} = \\langle ${normal.join(", ")} \\rangle$。它与基点的点积是 $${answer}$。`,
      ),
    });
  },
};

const vandermonde: KnowledgePointDef = {
  id: "the-determinant-of-a-vandermonde-matrix",
  title: t("The determinant of a Vandermonde matrix", "范德蒙德矩阵的行列式"),
  explanation: t(
    "A matrix with rows $(1, a, a^2)$, $(1, b, b^2)$ and $(1, c, c^2)$ has a determinant that factors completely. Subtracting the first row from the others clears the first column, and each new row then has a common factor, such as $b - a$. What remains gives $(b - a)(c - a)(c - b)$. It vanishes exactly when two of the numbers coincide.",
    "行为 $(1, a, a^2)$、$(1, b, b^2)$、$(1, c, c^2)$ 的矩阵，行列式可以完全分解。从其他行减去第一行，就清除了第一列，每个新行都有公因子，例如 $b - a$。剩下的部分给出 $(b - a)(c - a)(c - b)$。它为零，当且仅当有两个数相等。",
  ),
  generate(rng) {
    const pool = [...Array(12).keys()].map((i) => i - 5);
    const a = rng.pick(pool);
    const b = rng.pick(pool.filter((v) => v !== a));
    const c = rng.pick(pool.filter((v) => v !== a && v !== b));
    const answer = (b - a) * (c - a) * (c - b);
    return numberProblem({
      prompt: t(
        `Find the determinant of $${mat([
          [1, a, a * a],
          [1, b, b * b],
          [1, c, c * c],
        ])}$.`,
        `求 $${mat([
          [1, a, a * a],
          [1, b, b * b],
          [1, c, c * c],
        ])}$ 的行列式。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, a * b * c, b - a + (c - a) + (c - b)],
      solution: t(
        `This is a Vandermonde matrix with $a = ${a}$, $b = ${b}$, $c = ${c}$, so its determinant is $(b - a)(c - a)(c - b) = ${inParens(b - a)} \\cdot ${inParens(c - a)} \\cdot ${inParens(c - b)} = ${answer}$.`,
        `这是 $a = ${a}$，$b = ${b}$，$c = ${c}$ 的范德蒙德矩阵，所以行列式是 $(b - a)(c - a)(c - b) = ${inParens(b - a)} \\cdot ${inParens(c - a)} \\cdot ${inParens(c - b)} = ${answer}$。`,
      ),
    });
  },
};

const powerOfElementary: KnowledgePointDef = {
  id: "a-power-of-an-elementary-matrix",
  title: t("A power of an elementary matrix", "初等矩阵的幂"),
  explanation: t(
    "Multiplying by the elementary matrix for $R_3 + kR_1 \\to R_3$ performs that row operation. Doing it $n$ times adds $k$ times the first row to the third row $n$ times, and the first row never changes. So the total effect is $R_3 + nkR_1 \\to R_3$. The entry grows by adding, not by multiplying, even though the matrix is being raised to a power.",
    "乘以 $R_3 + kR_1 \\to R_3$ 的初等矩阵，就是执行这个行运算。做 $n$ 次，就是把第一行的 $k$ 倍加到第三行 $n$ 次，而第一行始终不变。所以总效果是 $R_3 + nkR_1 \\to R_3$。尽管矩阵在求幂，这个元素却是按加法增长，而不是按乘法。",
  ),
  generate(rng) {
    const k = nonzero(rng, 9);
    const n = rng.int(2, 9);
    const answer = n * k;
    return numberProblem({
      prompt: t(
        `Let $E = ${mat([
          [1, 0, 0],
          [0, 1, 0],
          [k, 0, 1],
        ])}$. Find the $(3, 1)$ entry of $E^{${n}}$.`,
        `设 $E = ${mat([
          [1, 0, 0],
          [0, 1, 0],
          [k, 0, 1],
        ])}$。求 $E^{${n}}$ 的 $(3, 1)$ 元素。`,
      ),
      answer,
      form: "integer",
      wrong: [k ** n, k + n, k, (n + 1) * k],
      solution: t(
        `Each factor adds $${k}$ times row 1 to row 3, and row 1 stays fixed. After ${n} factors, the entry is $${n} \\cdot ${inParens(k)} = ${answer}$.`,
        `每个因子把第 1 行的 $${k}$ 倍加到第 3 行，第 1 行保持不变。${n} 个因子之后，这个元素是 $${n} \\cdot ${inParens(k)} = ${answer}$。`,
      ),
    });
  },
};

const scalarForEntry: KnowledgePointDef = {
  id: "the-scalar-that-gives-a-combination-a-chosen-entry",
  title: t("The scalar that gives a combination a chosen entry", "使组合取得指定分量的标量"),
  explanation: t(
    "Vector operations in $\\mathbb{R}^n$ act on each entry separately, so a single entry of $\\mathbf{u} + c\\mathbf{v}$ depends on $c$ through one ordinary linear equation. Solving it fixes $c$, and that decides all the other entries too. Entries of $\\mathbf{v}$ that are zero would make the corresponding entry independent of $c$, which is why a nonzero entry must be used.",
    "$\\mathbb{R}^n$ 中的向量运算分别作用于每个分量，所以 $\\mathbf{u} + c\\mathbf{v}$ 的一个分量通过一个普通的线性方程依赖于 $c$。解这个方程就确定了 $c$，也决定了其他所有分量。如果 $\\mathbf{v}$ 的某个分量为零，相应分量就与 $c$ 无关，所以必须用非零分量。",
  ),
  generate(rng) {
    const u = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9)];
    const v = [nonzero(rng, 6), nonzero(rng, 6), nonzero(rng, 6), nonzero(rng, 6)];
    const c = nonzero(rng, 6);
    const position = rng.int(1, 4);
    const uEntry = u[position - 1] ?? 0;
    const vEntry = v[position - 1] ?? 1;
    const target = uEntry + c * vEntry;
    return numberProblem({
      prompt: t(
        `Let $\\mathbf{u} = ${col(...u)}$ and $\\mathbf{v} = ${col(...v)}$ in $\\mathbb{R}^4$. Find $c$ so that entry ${position} of $\\mathbf{u} + c\\mathbf{v}$ equals $${target}$.`,
        `设 $\\mathbb{R}^4$ 中的 $\\mathbf{u} = ${col(...u)}$，$\\mathbf{v} = ${col(...v)}$。求 $c$，使 $\\mathbf{u} + c\\mathbf{v}$ 的第 ${position} 个分量等于 $${target}$。`,
      ),
      answer: c,
      wrong: [-c, Q.of(target, vEntry), Q.of(target + uEntry, vEntry), c + 1],
      solution: t(
        `Entry ${position} gives $${poly([uEntry, ""], [vEntry, "c"])} = ${target}$, so $c = ${c}$.`,
        `第 ${position} 个分量给出 $${poly([uEntry, ""], [vEntry, "c"])} = ${target}$，所以 $c = ${c}$。`,
      ),
    });
  },
};

const entryInNullSpace: KnowledgePointDef = {
  id: "the-entry-that-puts-a-vector-in-a-null-space",
  title: t("The entry that puts a vector in a null space", "使向量属于零空间的分量"),
  explanation: t(
    "A vector lies in the null space of a matrix exactly when its dot product with every row is zero. So membership gives one equation for each row. If one entry of the vector is unknown, an equation containing it can be solved for that entry. The other rows must then also hold, and the choice of the vector here makes them hold.",
    "向量属于矩阵的零空间，当且仅当它与每一行的点积都为零。所以属于关系为每一行给出一个方程。如果向量有一个未知分量，就可以从含它的方程中解出这个分量。其他行也必须成立，这里向量的选取保证了这一点。",
  ),
  generate(rng) {
    const a = nonzero(rng, 4);
    const b = nonzero(rng, 4);
    const c = nonzero(rng, 4);
    const z = nonzero(rng, 4);
    const y = -c * z;
    const answer = -(a * y + b * z);
    return numberProblem({
      prompt: t(
        `Let $A = ${mat([
          [1, a, b],
          [0, 1, c],
        ])}$. Find $k$ so that $${col("k", y, z)}$ lies in the null space of $A$.`,
        `设 $A = ${mat([
          [1, a, b],
          [0, 1, c],
        ])}$。求 $k$，使 $${col("k", y, z)}$ 属于 $A$ 的零空间。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, a * y + 2 * b * z, a * y, b * z],
      solution: t(
        `Row 1 requires $k + ${inParens(a)} \\cdot ${inParens(y)} + ${inParens(b)} \\cdot ${inParens(z)} = 0$, so $k = ${answer}$. Row 2 also holds, since $${inParens(y)} + ${inParens(c)} \\cdot ${inParens(z)} = 0$.`,
        `第 1 行要求 $k + ${inParens(a)} \\cdot ${inParens(y)} + ${inParens(b)} \\cdot ${inParens(z)} = 0$，所以 $k = ${answer}$。第 2 行也成立，因为 $${inParens(y)} + ${inParens(c)} \\cdot ${inParens(z)} = 0$。`,
      ),
    });
  },
};

const nullityOfTranspose: KnowledgePointDef = {
  id: "the-nullity-of-a-transpose",
  title: t("The nullity of a transpose", "转置矩阵的零化度"),
  explanation: t(
    "A matrix and its transpose have the same rank, because row rank equals column rank. Their nullities generally differ, since the transpose has as many columns as the original has rows. Rank-nullity applied to the transpose of an $m \\times n$ matrix of rank $r$ gives $m - r$, while the matrix itself has nullity $n - r$. The two agree only for square matrices.",
    "矩阵和它的转置有相同的秩，因为行秩等于列秩。它们的零化度一般不同，因为转置的列数等于原矩阵的行数。对秩为 $r$ 的 $m \\times n$ 矩阵的转置用秩-零化度定理，得 $m - r$，而矩阵本身的零化度是 $n - r$。只有方阵的两者才相等。",
  ),
  generate(rng) {
    const m = rng.int(3, 12);
    const n = rng.int(3, 12);
    const r = rng.int(1, Math.min(m, n));
    const answer = m - r;
    return numberProblem({
      prompt: t(
        `A matrix $A$ has ${m} rows, ${n} columns and rank ${r}. Find the nullity of $A^T$.`,
        `矩阵 $A$ 有 ${m} 行、${n} 列，秩是 ${r}。求 $A^T$ 的零化度。`,
      ),
      answer,
      form: "integer",
      wrong: [n - r, r, m + n - r, n],
      solution: t(
        `The transpose has ${m} columns and rank ${r}, so its nullity is $${m} - ${r} = ${answer}$.`,
        `转置有 ${m} 列，秩是 ${r}，所以零化度是 $${m} - ${r} = ${answer}$。`,
      ),
    });
  },
};

const smallestNullity: KnowledgePointDef = {
  id: "the-smallest-possible-nullity-of-a-matrix",
  title: t("The smallest possible nullity of a matrix", "矩阵零化度的最小可能值"),
  explanation: t(
    "The rank of a matrix cannot exceed its number of rows or its number of columns. Rank-nullity then bounds the nullity from below: it is at least the number of columns minus the largest possible rank. So a matrix with more columns than rows always has a nontrivial null space, while with at least as many rows as columns the nullity can be zero.",
    "矩阵的秩不能超过行数，也不能超过列数。于是秩-零化度定理给出零化度的下界：它至少是列数减去最大可能的秩。所以列数多于行数的矩阵总有非平凡的零空间，而行数不少于列数时，零化度可以为零。",
  ),
  generate(rng) {
    const m = rng.int(2, 20);
    const n = rng.pick([...Array(19).keys()].map((i) => i + 2).filter((v) => v !== m));
    const answer = Math.max(n - m, 0);
    return numberProblem({
      prompt: t(
        `What is the smallest possible nullity of a matrix with ${m} rows and ${n} columns?`,
        `一个 ${m} 行 ${n} 列的矩阵，零化度最小可能是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [m, n, Math.abs(n - m) + 1, Math.min(m, n), Math.max(m, n) - 1],
      solution: t(
        `The rank is at most $${Math.min(m, n)}$, so the nullity is at least $${n} - ${Math.min(m, n)} = ${answer}$, and a matrix of largest rank reaches it.`,
        `秩最多是 $${Math.min(m, n)}$，所以零化度至少是 $${n} - ${Math.min(m, n)} = ${answer}$，秩最大的矩阵达到这个值。`,
      ),
    });
  },
};

const symmetrizationRank: KnowledgePointDef = {
  id: "the-rank-of-the-symmetrizing-map",
  title: t("The rank of the symmetrizing map", "对称化映射的秩"),
  explanation: t(
    "The map $T(A) = A + A^T$ on $n \\times n$ matrices sends everything to symmetric matrices, and its kernel is the set of matrices with $A^T = -A$, the skew-symmetric ones. Those have dimension $\\frac{n(n - 1)}{2}$. Rank-nullity then gives the rank as $n^2$ minus this number, which matches the dimension of the symmetric matrices, so the map is onto them.",
    "$n \\times n$ 矩阵上的映射 $T(A) = A + A^T$ 把一切都映到对称矩阵，它的核是满足 $A^T = -A$ 的矩阵，即反对称矩阵。它们的维数是 $\\frac{n(n - 1)}{2}$。于是秩-零化度定理给出秩等于 $n^2$ 减去这个数，这正是对称矩阵的维数，所以映射是到对称矩阵上的满射。",
  ),
  generate(rng) {
    const n = rng.int(2, 30);
    const kernel = binomial2(n);
    const answer = n * n - kernel;
    return numberProblem({
      prompt: t(
        `Let $T: M_{${n} \\times ${n}} \\to M_{${n} \\times ${n}}$ be $T(A) = A + A^T$. Find the rank of $T$.`,
        `设 $T: M_{${n} \\times ${n}} \\to M_{${n} \\times ${n}}$ 为 $T(A) = A + A^T$。求 $T$ 的秩。`,
      ),
      answer,
      form: "integer",
      wrong: [kernel, n * n, n],
      solution: t(
        `The kernel is the skew-symmetric matrices, of dimension $${kernel}$. So the rank is $${n * n} - ${kernel} = ${answer}$.`,
        `核是反对称矩阵，维数是 $${kernel}$。所以秩是 $${n * n} - ${kernel} = ${answer}$。`,
      ),
    });
  },
};

const inverseMapValue: KnowledgePointDef = {
  id: "a-value-of-the-inverse-of-a-linear-map",
  title: t("A value of the inverse of a linear map", "线性映射逆映射的值"),
  explanation: t(
    "An invertible linear map has an inverse that is itself linear, and its standard matrix is the inverse of the original matrix. So $T^{-1}(\\mathbf{b})$ is the unique solution of $A\\mathbf{x} = \\mathbf{b}$. When the determinant is 1, the two by two inverse swaps the diagonal and negates the other entries, and the arithmetic stays in whole numbers.",
    "可逆线性映射的逆本身也是线性的，它的标准矩阵就是原矩阵的逆。所以 $T^{-1}(\\mathbf{b})$ 是 $A\\mathbf{x} = \\mathbf{b}$ 的唯一解。当行列式为 1 时，二阶逆矩阵就是交换对角元、把其他元素取负，计算一直停留在整数范围内。",
  ),
  generate(rng) {
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 4);
    const x = nonzero(rng, 6);
    const y = nonzero(rng, 6);
    const d = 1 + p * q;
    const answer = d * x - p * y;
    const inverse = mat([
      [d, -p],
      [-q, 1],
    ]);
    return numberProblem({
      prompt: t(
        `Let $T(\\mathbf{x}) = A\\mathbf{x}$ with $A = ${mat([
          [1, p],
          [q, d],
        ])}$. Find the first entry of $T^{-1}\\left(${col(x, y)}\\right)$.`,
        `设 $T(\\mathbf{x}) = A\\mathbf{x}$，$A = ${mat([
          [1, p],
          [q, d],
        ])}$。求 $T^{-1}\\left(${col(x, y)}\\right)$ 的第一个分量。`,
      ),
      answer,
      form: "integer",
      wrong: [x + p * y, y - q * x, -answer, d * x + p * y],
      solution: t(
        `Since $\\det A = 1$, the inverse matrix is $${inverse}$. The first entry of the image is $${inParens(d)} \\cdot ${inParens(x)} + ${inParens(-p)} \\cdot ${inParens(y)} = ${answer}$.`,
        `由于 $\\det A = 1$，逆矩阵是 $${inverse}$。像的第一个分量是 $${inParens(d)} \\cdot ${inParens(x)} + ${inParens(-p)} \\cdot ${inParens(y)} = ${answer}$。`,
      ),
    });
  },
};

const determinantInNewBasis: KnowledgePointDef = {
  id: "the-determinant-does-not-depend-on-the-basis",
  title: t("The determinant does not depend on the basis", "行列式不依赖于基"),
  explanation: t(
    "Matrices of one operator relative to different bases are similar: $[T]_C = P^{-1}[T]_BP$. Taking determinants, the factors $\\det P^{-1}$ and $\\det P$ cancel, because the determinant of a product is the product of the determinants. So the determinant belongs to the operator and not to the basis, and the change of basis matrix need not be used at all.",
    "同一算子在不同基下的矩阵是相似的：$[T]_C = P^{-1}[T]_BP$。取行列式后，因子 $\\det P^{-1}$ 和 $\\det P$ 相消，因为乘积的行列式等于行列式的乘积。所以行列式属于算子，而不属于基，根本用不着基变换矩阵。",
  ),
  generate(rng) {
    const a = rng.int(-6, 6);
    const b = rng.int(-6, 6);
    const c = rng.int(-6, 6);
    const d = rng.int(-6, 6);
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 4);
    const answer = a * d - b * c;
    return numberProblem({
      prompt: t(
        `An operator has $[T]_B = ${mat([
          [a, b],
          [c, d],
        ])}$, and $[T]_C = P^{-1}[T]_BP$ with $P = ${mat([
          [1, p],
          [q, 1 + p * q],
        ])}$. Find $\\det [T]_C$.`,
        `一个算子的 $[T]_B = ${mat([
          [a, b],
          [c, d],
        ])}$，且 $[T]_C = P^{-1}[T]_BP$，其中 $P = ${mat([
          [1, p],
          [q, 1 + p * q],
        ])}$。求 $\\det [T]_C$。`,
      ),
      answer,
      form: "integer",
      wrong: [a + d, -answer, answer + 1, answer - 1, a * d + b * c],
      solution: t(
        `Similar matrices have equal determinants, so the value is $\\det [T]_B = ${inParens(a)} \\cdot ${inParens(d)} - ${inParens(b)} \\cdot ${inParens(c)} = ${answer}$.`,
        `相似矩阵的行列式相等，所以值是 $\\det [T]_B = ${inParens(a)} \\cdot ${inParens(d)} - ${inParens(b)} \\cdot ${inParens(c)} = ${answer}$。`,
      ),
    });
  },
};

const evaluationKernel: KnowledgePointDef = {
  id: "the-kernel-of-evaluation-at-two-points",
  title: t("The kernel of evaluation at two points", "两点求值映射的核"),
  explanation: t(
    "The map $p \\mapsto (p(a), p(b))$, with $a \\ne b$, goes from $P_n$ to $\\mathbb{R}^2$. It is onto when $n \\ge 1$, because a line can be drawn with any values at two different points. So its rank is 2, and rank-nullity gives a kernel of dimension $n + 1 - 2$. The kernel is the set of multiples of $(x - a)(x - b)$.",
    "映射 $p \\mapsto (p(a), p(b))$（$a \\ne b$）从 $P_n$ 到 $\\mathbb{R}^2$。当 $n \\ge 1$ 时它是满射，因为可以画一条直线在两个不同的点上取任意值。所以它的秩是 2，秩-零化度定理给出核的维数 $n + 1 - 2$。核就是 $(x - a)(x - b)$ 的倍式的集合。",
  ),
  generate(rng) {
    const n = rng.int(2, 30);
    const a = rng.int(-5, 5);
    const b = rng.pick([...Array(11).keys()].map((i) => i - 5).filter((v) => v !== a));
    const answer = n - 1;
    return numberProblem({
      prompt: t(
        `Let $T: P_{${n}} \\to \\mathbb{R}^2$ be $T(p) = (p(${a}), p(${b}))$. Find the dimension of the kernel of $T$.`,
        `设 $T: P_{${n}} \\to \\mathbb{R}^2$ 为 $T(p) = (p(${a}), p(${b}))$。求 $T$ 的核的维数。`,
      ),
      answer,
      form: "integer",
      wrong: [n, n + 1, n - 2, 2],
      solution: t(
        `The space $P_{${n}}$ has dimension ${n + 1}, and the map is onto $\\mathbb{R}^2$. So the kernel has dimension $${n + 1} - 2 = ${answer}$.`,
        `空间 $P_{${n}}$ 的维数是 ${n + 1}，映射是到 $\\mathbb{R}^2$ 上的满射。所以核的维数是 $${n + 1} - 2 = ${answer}$。`,
      ),
    });
  },
};

const characteristicConstant: KnowledgePointDef = {
  id: "the-constant-term-of-a-characteristic-polynomial",
  title: t("The constant term of a characteristic polynomial", "特征多项式的常数项"),
  explanation: t(
    "Setting $\\lambda = 0$ in $\\det(\\lambda I - A)$ leaves $\\det(-A)$, and this is the constant term of the characteristic polynomial. Pulling the sign out of each of the $n$ rows gives $(-1)^n\\det A$. So for a $3 \\times 3$ matrix, the constant term is $-\\det A$. There is no need to expand the whole polynomial to find it.",
    "在 $\\det(\\lambda I - A)$ 中令 $\\lambda = 0$，得到 $\\det(-A)$，这就是特征多项式的常数项。从 $n$ 行中各提出一个负号，得 $(-1)^n\\det A$。所以对 $3 \\times 3$ 矩阵，常数项是 $-\\det A$。不需要展开整个多项式就能求出它。",
  ),
  generate(rng) {
    const grid: [[number, number, number], [number, number, number], [number, number, number]] = [
      [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)],
      [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)],
      [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)],
    ];
    const det = det3(grid);
    const trace = grid[0][0] + grid[1][1] + grid[2][2];
    return numberProblem({
      prompt: t(
        `Find the constant term of $\\det(\\lambda I - A)$ for $A = ${mat(grid)}$.`,
        `对 $A = ${mat(grid)}$，求 $\\det(\\lambda I - A)$ 的常数项。`,
      ),
      answer: -det,
      form: "integer",
      wrong: [det, trace, -trace, det + 1],
      solution: t(
        `The constant term is $\\det(-A) = -\\det A$. Here $\\det A = ${det}$, so the term is $${-det}$.`,
        `常数项是 $\\det(-A) = -\\det A$。这里 $\\det A = ${det}$，所以常数项是 $${-det}$。`,
      ),
    });
  },
};

const inverseShiftEigenvalue: KnowledgePointDef = {
  id: "an-eigenvalue-of-a-shifted-inverse",
  title: t("An eigenvalue of a shifted inverse", "平移逆矩阵的特征值"),
  explanation: t(
    "If $A\\mathbf{v} = \\lambda\\mathbf{v}$ with $A$ invertible, then $A^{-1}\\mathbf{v} = \\frac{1}{\\lambda}\\mathbf{v}$, so the same eigenvector works for the inverse. Adding $cI$ just adds $c\\mathbf{v}$. So $A^{-1} + cI$ has eigenvalue $\\frac{1}{\\lambda} + c$. Order matters: inverting after the shift would give a different number, $\\frac{1}{\\lambda + c}$.",
    "如果 $A\\mathbf{v} = \\lambda\\mathbf{v}$ 且 $A$ 可逆，那么 $A^{-1}\\mathbf{v} = \\frac{1}{\\lambda}\\mathbf{v}$，所以同一个特征向量对逆矩阵也适用。加上 $cI$ 只是加上 $c\\mathbf{v}$。所以 $A^{-1} + cI$ 有特征值 $\\frac{1}{\\lambda} + c$。顺序很重要：平移后再求逆，会得到另一个数 $\\frac{1}{\\lambda + c}$。",
  ),
  generate(rng) {
    const lambda = nonzero(rng, 9);
    const c = nonzero(rng, 5);
    const answer = Q.of(1, lambda).add(Q.of(c));
    return numberProblem({
      prompt: t(
        `An invertible matrix $A$ has eigenvalue $${lambda}$. Find the corresponding eigenvalue of $A^{-1} ${shiftTerm(c)}$.`,
        `可逆矩阵 $A$ 有特征值 $${lambda}$。求 $A^{-1} ${shiftTerm(c)}$ 相应的特征值。`,
      ),
      answer,
      wrong: [Q.of(lambda + c), Q.of(1, lambda).sub(Q.of(c)), lambda + c === 0 ? Q.of(c, lambda) : Q.of(1, lambda + c), Q.of(c, lambda)],
      solution: t(
        `The inverse has eigenvalue $${frac(1, lambda)}$ on the same eigenvector, and the shift adds $${c}$. The sum is $${answer.toLatex()}$.`,
        `逆矩阵在同一个特征向量上的特征值是 $${frac(1, lambda)}$，平移再加上 $${c}$。和是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const powerOfDiagonalized: KnowledgePointDef = {
  id: "an-entry-of-a-power-from-a-diagonalization",
  title: t("An entry of a power from a diagonalization", "由对角化求幂的元素"),
  explanation: t(
    "Writing $A = PDP^{-1}$ makes powers simple, because the inner factors cancel: $A^k = PD^kP^{-1}$. Only the diagonal entries of $D$ need raising to the power. The work that remains is two matrix products, and the $P$ here has a simple inverse. Multiplying $A$ by itself repeatedly would be far slower when $k$ is large.",
    "写成 $A = PDP^{-1}$ 后，求幂就很简单，因为中间的因子相消：$A^k = PD^kP^{-1}$。只需要对 $D$ 的对角元求幂。剩下的工作是两次矩阵乘法，而这里的 $P$ 的逆很简单。当 $k$ 很大时，反复用 $A$ 自乘要慢得多。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const pool = [-3, -2, -1, 1, 2, 3];
    const p = rng.pick(pool);
    const q = rng.pick(pool.filter((v) => v !== p));
    const k = rng.int(3, 5);
    const pk = p ** k;
    const qk = q ** k;
    const answer = a * (qk - pk);
    const factor = a === 1 ? "" : a === -1 ? "-" : `${a}`;
    return numberProblem({
      prompt: t(
        `Let $A = PDP^{-1}$ with $P = ${mat([
          [1, a],
          [0, 1],
        ])}$ and $D = ${mat([
          [p, 0],
          [0, q],
        ])}$. Find the $(1, 2)$ entry of $A^{${k}}$.`,
        `设 $A = PDP^{-1}$，其中 $P = ${mat([
          [1, a],
          [0, 1],
        ])}$，$D = ${mat([
          [p, 0],
          [0, q],
        ])}$。求 $A^{${k}}$ 的 $(1, 2)$ 元素。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, a * (q - p), qk - pk, a * (qk + pk), answer + a],
      solution: t(
        `Here $D^{${k}}$ has diagonal $${pk}$, $${qk}$, and $P^{-1} = ${mat([
          [1, -a],
          [0, 1],
        ])}$. Multiplying out, the entry is $${factor}\\left(${qk} - ${inParens(pk)}\\right) = ${answer}$.`,
        `这里 $D^{${k}}$ 的对角元是 $${pk}$、$${qk}$，$P^{-1} = ${mat([
          [1, -a],
          [0, 1],
        ])}$。乘开后，这个元素是 $${factor}\\left(${qk} - ${inParens(pk)}\\right) = ${answer}$。`,
      ),
    });
  },
};

const hermitianDeterminant: KnowledgePointDef = {
  id: "the-determinant-of-a-hermitian-matrix",
  title: t("The determinant of a Hermitian matrix", "埃尔米特矩阵的行列式"),
  explanation: t(
    "A Hermitian matrix equals its own conjugate transpose, so its diagonal is real and the entries across the diagonal are conjugates. The two by two determinant then subtracts a complex number times its conjugate, which is the real number $|z|^2$. So the determinant comes out real, in agreement with the fact that a Hermitian matrix has real eigenvalues.",
    "埃尔米特矩阵等于自身的共轭转置，所以对角元是实数，关于对角线对称的元素互为共轭。于是二阶行列式减去的是一个复数乘以它的共轭，也就是实数 $|z|^2$。所以行列式是实数，这与埃尔米特矩阵的特征值都是实数这一事实相符。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const d = nonzero(rng, 9);
    const re = rng.int(1, 6);
    const im = rng.int(1, 6);
    const tail = withCoefficient(im, "i");
    const answer = a * d - re * re - im * im;
    return numberProblem({
      prompt: t(
        `Find the determinant of the Hermitian matrix $${mat([
          [a, `${re} + ${tail}`],
          [`${re} - ${tail}`, d],
        ])}$.`,
        `求埃尔米特矩阵 $${mat([
          [a, `${re} + ${tail}`],
          [`${re} - ${tail}`, d],
        ])}$ 的行列式。`,
      ),
      answer,
      form: "integer",
      wrong: [a * d + re * re + im * im, a * d - re * re + im * im, a * d - (re + im) ** 2],
      solution: t(
        `The product of the off-diagonal entries is $${re}^2 + ${im}^2 = ${re * re + im * im}$. So the determinant is $${a * d} - ${re * re + im * im} = ${answer}$.`,
        `非对角元之积是 $${re}^2 + ${im}^2 = ${re * re + im * im}$。所以行列式是 $${a * d} - ${re * re + im * im} = ${answer}$。`,
      ),
    });
  },
};

const blockDeterminant: KnowledgePointDef = {
  id: "the-determinant-from-a-real-and-a-complex-pair-of-eigenvalues",
  title: t("The determinant from a real eigenvalue and a complex pair", "由实特征值与共轭复特征值求行列式"),
  explanation: t(
    "A real $3 \\times 3$ matrix with a real eigenvalue and a complex pair is similar to a block diagonal matrix, with a $1 \\times 1$ block and a rotation-scaling block. The determinant of a block diagonal matrix is the product of the block determinants, and the rotation-scaling block has determinant $a^2 + b^2$. This is the same as multiplying all three eigenvalues.",
    "具有一个实特征值和一对复特征值的实 $3 \\times 3$ 矩阵，相似于一个分块对角矩阵，含一个 $1 \\times 1$ 块和一个旋转缩放块。分块对角矩阵的行列式是各块行列式之积，旋转缩放块的行列式是 $a^2 + b^2$。这与三个特征值相乘是一样的。",
  ),
  generate(rng) {
    const r = nonzero(rng, 6);
    const a = nonzero(rng, 6);
    const b = rng.int(1, 6);
    const answer = r * (a * a + b * b);
    return numberProblem({
      prompt: t(
        `A real $3 \\times 3$ matrix has eigenvalues $${r}$ and $${a} \\pm ${withCoefficient(b, "i")}$. Find its determinant.`,
        `一个实 $3 \\times 3$ 矩阵的特征值是 $${r}$ 和 $${a} \\pm ${withCoefficient(b, "i")}$。求它的行列式。`,
      ),
      answer,
      form: "integer",
      wrong: [r * (a * a - b * b), r + 2 * a, r * a * b, -answer],
      solution: t(
        `The complex pair multiplies to $${inParens(a)}^2 + ${b}^2 = ${a * a + b * b}$. Multiplying by $${r}$ gives $${answer}$.`,
        `这对复特征值之积是 $${inParens(a)}^2 + ${b}^2 = ${a * a + b * b}$。乘以 $${r}$，得 $${answer}$。`,
      ),
    });
  },
};

const rankOfNilpotentPower: KnowledgePointDef = {
  id: "the-rank-of-a-power-of-a-jordan-block-minus-its-eigenvalue",
  title: t("The rank of a power of a shifted Jordan block", "平移若尔当块的幂的秩"),
  explanation: t(
    "For a single Jordan block, $N = J - \\lambda I$ has ones just above the diagonal and shifts the basis vectors down a chain. Each power pushes the line of ones one place further from the diagonal and removes one of them. So the rank of $N^k$ is $n - k$ until it reaches zero, and this is what the ranks of generalized eigenvectors measure.",
    "对单个若尔当块，$N = J - \\lambda I$ 在对角线正上方有一串 1，并把基向量沿一条链移动。每求一次幂，这串 1 就离对角线更远一格，并少掉一个。所以 $N^k$ 的秩是 $n - k$，直到变成零，这正是广义特征向量的秩所度量的。",
  ),
  generate(rng) {
    const n = rng.int(3, 12);
    const k = rng.int(2, n - 1);
    const lambda = nonzero(rng, 6);
    const answer = n - k;
    return numberProblem({
      prompt: t(
        `Let $J$ be a single Jordan block of size ${n} with eigenvalue $${lambda}$. Find the rank of $(J ${shiftTerm(-lambda)})^{${k}}$.`,
        `设 $J$ 是大小为 ${n}、特征值为 $${lambda}$ 的单个若尔当块。求 $(J ${shiftTerm(-lambda)})^{${k}}$ 的秩。`,
      ),
      answer,
      form: "integer",
      wrong: [k, n - k + 1, n, n - k - 1],
      solution: t(
        `The power moves the line of ones ${k} places from the main diagonal, which leaves $${n} - ${k} = ${answer}$ ones in independent rows.`,
        `这个幂把那串 1 从主对角线移开 ${k} 格，留下 $${n} - ${k} = ${answer}$ 个位于独立行中的 1。`,
      ),
    });
  },
};

const powerOfTwoBlock: KnowledgePointDef = {
  id: "an-entry-of-a-power-of-a-2x2-jordan-block",
  title: t("An entry of a power of a 2×2 Jordan block", "二阶若尔当块的幂的元素"),
  explanation: t(
    "Write the block as $J = \\lambda I + N$, where $N$ has a single 1 above the diagonal and $N^2 = 0$. Since $\\lambda I$ commutes with $N$, the binomial theorem applies and stops after two terms: $J^k = \\lambda^kI + k\\lambda^{k - 1}N$. So the top right entry grows like $k\\lambda^{k - 1}$, which is the derivative of $\\lambda^k$.",
    "把块写成 $J = \\lambda I + N$，其中 $N$ 在对角线上方有一个 1，且 $N^2 = 0$。由于 $\\lambda I$ 与 $N$ 可交换，二项式定理适用，并且两项后就停止：$J^k = \\lambda^kI + k\\lambda^{k - 1}N$。所以右上角元素按 $k\\lambda^{k - 1}$ 增长，这正是 $\\lambda^k$ 的导数。",
  ),
  generate(rng) {
    const lambda = nonzero(rng, 5);
    const k = rng.int(3, 7);
    const answer = k * lambda ** (k - 1);
    return numberProblem({
      prompt: t(
        `Let $J = ${mat([
          [lambda, 1],
          [0, lambda],
        ])}$. Find the top right entry of $J^{${k}}$.`,
        `设 $J = ${mat([
          [lambda, 1],
          [0, lambda],
        ])}$。求 $J^{${k}}$ 右上角的元素。`,
      ),
      answer,
      form: "integer",
      wrong: [lambda ** k, k * lambda ** k, lambda ** (k - 1), k, answer + lambda, answer - 1],
      solution: t(
        `The entry is $k\\lambda^{k - 1} = ${k} \\cdot ${inParens(lambda)}^{${k - 1}} = ${answer}$.`,
        `这个元素是 $k\\lambda^{k - 1} = ${k} \\cdot ${inParens(lambda)}^{${k - 1}} = ${answer}$。`,
      ),
    });
  },
};

const powerOfThreeBlock: KnowledgePointDef = {
  id: "the-corner-entry-of-a-power-of-a-3x3-jordan-block",
  title: t("The corner entry of a power of a 3×3 Jordan block", "三阶若尔当块的幂的角元素"),
  explanation: t(
    "For a block of size three, $J = \\lambda I + N$ with $N^3 = 0$, so the binomial theorem gives three terms: $J^k = \\lambda^kI + k\\lambda^{k - 1}N + \\binom{k}{2}\\lambda^{k - 2}N^2$. Only $N^2$ reaches the top right corner. That corner entry is therefore $\\binom{k}{2}\\lambda^{k - 2}$, and it is half of the second derivative of $\\lambda^k$.",
    "对大小为三的块，$J = \\lambda I + N$，$N^3 = 0$，所以二项式定理给出三项：$J^k = \\lambda^kI + k\\lambda^{k - 1}N + \\binom{k}{2}\\lambda^{k - 2}N^2$。只有 $N^2$ 能到达右上角。所以这个角元素是 $\\binom{k}{2}\\lambda^{k - 2}$，它是 $\\lambda^k$ 二阶导数的一半。",
  ),
  generate(rng) {
    const lambda = nonzero(rng, 4);
    const k = rng.int(4, 8);
    const choose = binomial2(k);
    const answer = choose * lambda ** (k - 2);
    return numberProblem({
      prompt: t(
        `Let $J = ${mat([
          [lambda, 1, 0],
          [0, lambda, 1],
          [0, 0, lambda],
        ])}$. Find the top right entry of $J^{${k}}$.`,
        `设 $J = ${mat([
          [lambda, 1, 0],
          [0, lambda, 1],
          [0, 0, lambda],
        ])}$。求 $J^{${k}}$ 右上角的元素。`,
      ),
      answer,
      form: "integer",
      wrong: [k * lambda ** (k - 1), k * (k - 1) * lambda ** (k - 2), lambda ** (k - 2), choose],
      solution: t(
        `The entry is $\\binom{${k}}{2}\\lambda^{${k - 2}} = ${choose} \\cdot ${inParens(lambda)}^{${k - 2}} = ${answer}$.`,
        `这个元素是 $\\binom{${k}}{2}\\lambda^{${k - 2}} = ${choose} \\cdot ${inParens(lambda)}^{${k - 2}} = ${answer}$。`,
      ),
    });
  },
};

const cosineFromDot: KnowledgePointDef = {
  id: "the-cosine-of-an-angle-from-norms-and-a-dot-product",
  title: t("The cosine of an angle from norms and a dot product", "由范数和点积求夹角余弦"),
  explanation: t(
    "In $\\mathbb{R}^n$, the angle between two nonzero vectors is defined through the formula $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$. The Cauchy-Schwarz inequality guarantees that the resulting cosine lies between $-1$ and $1$. So a dot product divided by the two norms gives the cosine, even in dimensions where no picture of the angle can be drawn.",
    "在 $\\mathbb{R}^n$ 中，两个非零向量的夹角由公式 $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\|\\|\\mathbf{v}\\|\\cos\\theta$ 定义。柯西-施瓦茨不等式保证得到的余弦在 $-1$ 和 $1$ 之间。所以点积除以两个范数就得到余弦，即使在无法画出夹角的高维空间也是如此。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const size = rng.int(1, a * b - 1);
    const c = rng.pick([size, -size]);
    const answer = Q.of(c, a * b);
    return numberProblem({
      prompt: t(
        `In $\\mathbb{R}^n$, $\\|\\mathbf{u}\\| = ${a}$, $\\|\\mathbf{v}\\| = ${b}$ and $\\mathbf{u} \\cdot \\mathbf{v} = ${c}$. Find the cosine of the angle between them.`,
        `在 $\\mathbb{R}^n$ 中，$\\|\\mathbf{u}\\| = ${a}$，$\\|\\mathbf{v}\\| = ${b}$，$\\mathbf{u} \\cdot \\mathbf{v} = ${c}$。求它们夹角的余弦。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(c, a + b), Q.of(c, a * a * b * b), Q.of(a * b, c)],
      solution: t(
        `The cosine is $\\frac{${c}}{${a} \\cdot ${b}} = ${answer.toLatex()}$.`,
        `余弦是 $\\frac{${c}}{${a} \\cdot ${b}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const unitVectorEntry: KnowledgePointDef = {
  id: "an-entry-of-a-unit-vector",
  title: t("An entry of a unit vector", "单位向量的分量"),
  explanation: t(
    "Dividing a nonzero vector by its norm gives a vector of length one in the same direction. Each entry is divided by the same number, so the ratios between entries do not change. These entries are the direction cosines of the vector, the cosines of its angles with the coordinate axes, and their squares always add to one.",
    "把非零向量除以它的范数，就得到同方向的单位长度向量。每个分量都除以同一个数，所以分量之间的比不变。这些分量是向量的方向余弦，即它与各坐标轴夹角的余弦，它们的平方和总是 1。",
  ),
  generate(rng) {
    const [x, y, z, norm] = rng.pick([
      [1, 2, 2, 3],
      [2, 3, 6, 7],
      [1, 4, 8, 9],
      [4, 4, 7, 9],
      [2, 6, 9, 11],
      [6, 6, 7, 11],
      [3, 4, 12, 13],
      [2, 5, 14, 15],
    ]) as [number, number, number, number];
    const scale = rng.int(1, 4);
    const sign = rng.pick([1, -1]);
    const position = rng.int(1, 3);
    const entries = [sign * x * scale, y * scale, z * scale];
    const entry = entries[position - 1] ?? 1;
    const answer = Q.of(entry, norm * scale);
    return numberProblem({
      prompt: t(
        `Let $\\mathbf{v} = ${col(...entries)}$. Find entry ${position} of the unit vector in the direction of $\\mathbf{v}$.`,
        `设 $\\mathbf{v} = ${col(...entries)}$。求 $\\mathbf{v}$ 方向的单位向量的第 ${position} 个分量。`,
      ),
      answer,
      wrong: [Q.of(entry), Q.of(entry, norm * norm * scale * scale), answer.neg(), Q.of(norm * scale, entry)],
      solution: t(
        `The norm is $${norm * scale}$, and dividing $${entry}$ by it gives $${answer.toLatex()}$.`,
        `范数是 $${norm * scale}$，用它除 $${entry}$，得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const monomialNorm: KnowledgePointDef = {
  id: "the-norm-of-a-power-function",
  title: t("The norm of a power function", "幂函数的范数"),
  explanation: t(
    "With the inner product $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$, the squared norm of $f$ is the integral of $f^2$. For $f(t) = ct^n$ this squares both factors, giving $c^2t^{2n}$, which integrates to $\\frac{c^2}{2n + 1}$. Note that the exponent doubles before integrating, which is why the denominator is $2n + 1$ and not $n + 1$.",
    "用内积 $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$，$f$ 的范数平方是 $f^2$ 的积分。对 $f(t) = ct^n$，两个因子都要平方，得 $c^2t^{2n}$，积分后是 $\\frac{c^2}{2n + 1}$。注意指数在积分前先翻倍，所以分母是 $2n + 1$，而不是 $n + 1$。",
  ),
  generate(rng) {
    const c = rng.int(2, 12);
    const n = rng.int(2, 12);
    const answer = Q.of(c * c, 2 * n + 1);
    return numberProblem({
      prompt: t(
        `With $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$, find $\\|f\\|^2$ for $f(t) = ${c}t^{${n}}$.`,
        `用 $\\langle f, g \\rangle = \\int_0^1 f(t)g(t)\\,dt$，对 $f(t) = ${c}t^{${n}}$ 求 $\\|f\\|^2$。`,
      ),
      answer,
      wrong: [Q.of(c * c, n + 1), Q.of(c, 2 * n + 1), Q.of(c * c, 2 * n), Q.of(c, n + 1)],
      solution: t(
        `The square of $f$ is $${c * c}t^{${2 * n}}$, and its integral over $[0, 1]$ is $${answer.toLatex()}$.`,
        `$f$ 的平方是 $${c * c}t^{${2 * n}}$，它在 $[0, 1]$ 上的积分是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const triangleBounds: KnowledgePointDef = {
  id: "the-range-of-a-norm-from-the-triangle-inequality",
  title: t("The range of a norm from the triangle inequality", "由三角不等式求范数的范围"),
  explanation: t(
    "The triangle inequality gives an upper bound, $\\|\\mathbf{u} + \\mathbf{v}\\| \\le \\|\\mathbf{u}\\| + \\|\\mathbf{v}\\|$, reached when the vectors point the same way. Applying it again to $\\mathbf{u} = (\\mathbf{u} + \\mathbf{v}) - \\mathbf{v}$ gives the lower bound $\\big|\\|\\mathbf{u}\\| - \\|\\mathbf{v}\\|\\big|$, reached when they point opposite ways. Orthogonal vectors give a value strictly in between.",
    "三角不等式给出上界 $\\|\\mathbf{u} + \\mathbf{v}\\| \\le \\|\\mathbf{u}\\| + \\|\\mathbf{v}\\|$，当两个向量同向时达到。对 $\\mathbf{u} = (\\mathbf{u} + \\mathbf{v}) - \\mathbf{v}$ 再用一次，得到下界 $\\big|\\|\\mathbf{u}\\| - \\|\\mathbf{v}\\|\\big|$，当它们反向时达到。正交向量给出的值严格介于两者之间。",
  ),
  generate(rng) {
    const a = rng.int(1, 30);
    const b = rng.pick([...Array(30).keys()].map((i) => i + 1).filter((v) => v !== a));
    const largest = rng.pick([true, false]);
    const answer = largest ? a + b : Math.abs(a - b);
    const other = largest ? Math.abs(a - b) : a + b;
    return numberProblem({
      prompt: t(
        `In an inner product space, $\\|\\mathbf{u}\\| = ${a}$ and $\\|\\mathbf{v}\\| = ${b}$. What is the ${largest ? "largest" : "smallest"} possible value of $\\|\\mathbf{u} + \\mathbf{v}\\|$?`,
        `在内积空间中，$\\|\\mathbf{u}\\| = ${a}$，$\\|\\mathbf{v}\\| = ${b}$。$\\|\\mathbf{u} + \\mathbf{v}\\|$ ${largest ? "最大" : "最小"}可能是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [other, a * b, a * a + b * b, Math.max(a, b)],
      solution: t(
        `The norm lies between $|${a} - ${b}| = ${Math.abs(a - b)}$ and $${a} + ${b} = ${a + b}$. The value $${answer}$ is reached when the vectors point ${largest ? "the same way" : "opposite ways"}.`,
        `范数介于 $|${a} - ${b}| = ${Math.abs(a - b)}$ 和 $${a} + ${b} = ${a + b}$ 之间。值 $${answer}$ 在两个向量${largest ? "同向" : "反向"}时达到。`,
      ),
    });
  },
};

const trigonometricNorm: KnowledgePointDef = {
  id: "the-norm-of-a-sum-of-orthogonal-trigonometric-functions",
  title: t("The norm of a sum of orthogonal trigonometric functions", "正交三角函数之和的范数"),
  explanation: t(
    "On $[-\\pi, \\pi]$ with the integral inner product, $\\sin mt$ and $\\cos nt$ are orthogonal for all positive whole $m$ and $n$, since their product is an odd function. Each has squared norm $\\pi$. The Pythagorean theorem then applies to any combination of them, so the squared norm is found without squaring and integrating the whole expression.",
    "在 $[-\\pi, \\pi]$ 上用积分内积，对所有正整数 $m$、$n$，$\\sin mt$ 和 $\\cos nt$ 都正交，因为它们的积是奇函数。它们的范数平方都是 $\\pi$。于是勾股定理适用于它们的任何组合，所以不必把整个式子平方再积分，就能求出范数平方。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    const m = rng.int(1, 9);
    const n = rng.int(1, 9);
    const answer = a * a + b * b;
    const first = withCoefficient(a, `\\sin ${withCoefficient(m, "t")}`);
    const second = withCoefficient(b, `\\cos ${withCoefficient(n, "t")}`);
    return numberProblem({
      prompt: t(
        `With $\\langle f, g \\rangle = \\int_{-\\pi}^{\\pi} f(t)g(t)\\,dt$, the function $f(t) = ${first} + ${second}$ has $\\|f\\|^2 = c\\pi$. Find $c$.`,
        `用 $\\langle f, g \\rangle = \\int_{-\\pi}^{\\pi} f(t)g(t)\\,dt$，函数 $f(t) = ${first} + ${second}$ 满足 $\\|f\\|^2 = c\\pi$。求 $c$。`,
      ),
      answer,
      form: "integer",
      wrong: [(a + b) ** 2, 2 * answer, a + b, Math.abs(a * a - b * b) + 1],
      solution: t(
        `The two terms are orthogonal, and each basic function has squared norm $\\pi$. So $c = ${a}^2 + ${b}^2 = ${answer}$.`,
        `两项正交，每个基本函数的范数平方都是 $\\pi$。所以 $c = ${a}^2 + ${b}^2 = ${answer}$。`,
      ),
    });
  },
};

/** deeperLinearAlgebraPoints gives, by topic id, the knowledge points added after a Linear Algebra topic's own. */
export const deeperLinearAlgebraPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-intersection-of-two-planes": [perpendicularPlanes],
  "the-cartesian-equation-of-a-plane": [parallelPlaneThroughPoint],
  "the-shortest-distance-between-a-plane-and-a-point": [footOfPerpendicular],
  "the-intersection-between-a-line-and-a-plane": [lineParallelToPlane],
  "the-determinant-of-an-nxn-matrix": [countingLeibnizTerms],
  "finding-determinants-using-laplace-expansions": [expandingAlongASparseRow],
  "cramers-rule-for-2x2-systems-of-linear-equations": [whenCramerFails],
  "further-properties-of-determinants": [determinantOfACombination],
  "partitioned-and-block-matrices": [multiplyingBlocks],
  "solving-3x3-singular-systems-of-equations-using-gaussian-elimination": [consistent3x3],
  "reduced-row-echelon-form": [clearingAbovePivot],
  "finding-the-inverse-of-a-2x2-matrix-using-row-operations": [solvingWithAnInverse],
  "matrices-with-easy-to-find-inverses": [inverseOfAProduct],
  "lu-factorization-of-2x2-matrices": [whenLuFails],
  "linear-span-of-vectors-in-n-dimensional-euclidean-space": [parameterInSpan],
  "linear-dependence-and-independence": [parameterForDependence],
  "the-column-space-of-a-matrix": [planeOfAColumnSpace],
  "the-rank-of-a-matrix": [parameterForRankOne],
  "changing-a-basis-using-the-change-of-coordinates-matrix": [betweenTwoBases],
  "dimension-in-abstract-vector-spaces": [dimensionOfFamilies],
  "the-coordinates-of-a-vector-relative-to-a-basis-in-abstract-vector-spaces": [coordinatesAroundAPoint],
  "standard-matrix-of-a-linear-transformation-in-terms-of-the-standard-basis": [composingTransformations],
  "calculating-the-eigenvalues-of-a-2x2-matrix": [otherEigenvalue],
  "eigenvalues-and-eigenvectors-of-a-2x2-matrix": [eigenvalueOfAPolynomial],
  "cayley-hamilton-theorem": [inverseFromCayleyHamilton],
  "properties-of-diagonalization": [traceOfAPower],
  "rotation-scaling-matrices": [lengthUnderRotationScaling],
  "nilpotent-and-idempotent-matrices": [inverseOfIPlusNilpotent],
  "jordan-blocks-and-jordan-matrices": [blocksFromNullities],
  "matrix-functions": [exponentialOfJordanBlock],
  "orthogonal-matrices": [completingARotation],
  "projection-matrices-linear-transformations-and-their-properties": [reflectionFromProjection],
  "least-squares-solution-of-a-linear-system-without-collinearity": [leastSquaresError],
  "symmetric-matrices": [perpendicularEigenvectors],
  "quadratic-forms": [evaluatingAQuadraticForm],
  "positive-definite-and-negative-definite-quadratic-forms": [definiteRange],
  "computing-the-singular-values-of-a-matrix": [conditionNumber],
  "singular-value-decomposition-and-the-pseudoinverse-matrix": [pseudoinverseOfADiagonal],
  "steady-state-vectors": [rateOfConvergence],
  "linear-regression-with-matrices": [slopeFromNormalEquations],
  "the-parametric-equations-of-a-line": [lineMeetsHorizontalPlane],
  "the-cartesian-equation-of-a-line": [pointOnSymmetricLine],
  "the-vector-equation-of-a-plane": [planeIntercept],
  "the-parametric-equations-of-a-plane": [planeConstantFromSpan],
  "finding-determinants-using-row-and-column-operations": [vandermonde],
  "elementary-3x3-matrices": [powerOfElementary],
  "vectors-in-n-dimensional-euclidean-space": [scalarForEntry],
  "the-null-space-of-a-matrix": [entryInNullSpace],
  "the-dimension-of-the-null-space-of-a-matrix": [nullityOfTranspose],
  "the-rank-nullity-theorem": [smallestNullity],
  "rank-nullity-theorem-in-terms-of-linear-transformations": [symmetrizationRank],
  "invertible-matrix-theorem-in-terms-of-linear-transformations": [inverseMapValue],
  "connections-between-matrix-representations-of-a-linear-transformation": [determinantInNewBasis],
  "linear-maps-between-two-different-vector-spaces": [evaluationKernel],
  "characteristic-equation-of-a-matrix": [characteristicConstant],
  "invertible-matrix-theorem-in-terms-of-eigenvalues": [inverseShiftEigenvalue],
  "diagonalizing-a-2x2-matrix": [powerOfDiagonalized],
  "matrices-over-the-complex-numbers": [hermitianDeterminant],
  "block-diagonalization-of-nxn-matrices": [blockDeterminant],
  "ranks-of-generalized-eigenvectors": [rankOfNilpotentPower],
  "jordan-canonical-form-of-a-2x2-matrix": [powerOfTwoBlock],
  "jordan-canonical-decomposition-of-a-3x3-matrix": [powerOfThreeBlock],
  "dot-product-in-n-dimensional-euclidean-space": [cosineFromDot],
  "norm-of-a-vector-in-n-dimensional-euclidean-space": [unitVectorEntry],
  "norm-of-a-vector-in-inner-product-spaces": [monomialNorm],
  "pythagorean-theorem-and-triangle-inequality-in-inner-product-spaces": [triangleBounds],
  "orthogonal-vectors-in-inner-product-spaces": [trigonometricNorm],
};
