import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";

import { article, choiceProblem, numberProblem, pointProblem } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";

// Linear Algebra Unit 2: Matrices, Gaussian Elimination, Determinants,
// Elementary Matrices, and LU Factorization (Modules 2.4, 2.5, 2.6, 2.7, 2.8).

type Mat = readonly (readonly number[])[];

/** matLatex formats a numeric 2D matrix as a LaTeX pmatrix. */
function matLatex(m: readonly (readonly (number | string)[])[]): string {
  return `\\begin{pmatrix} ${m.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
}

/** detLatex formats a numeric 2D matrix as a LaTeX vmatrix (determinant). */
function _detLatex(m: readonly (readonly (number | string)[])[]): string {
  return `\\begin{vmatrix} ${m.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{vmatrix}`;
}

/** colVecLatex formats an array as a column vector LaTeX pmatrix. */
function colVecLatex(v: readonly (number | string)[]): string {
  return `\\begin{pmatrix} ${v.join(" \\\\ ")} \\end{pmatrix}`;
}

/** augLatex formats an augmented matrix [A | b] as a LaTeX array. */
function augLatex(a: Mat, b: readonly (number | string)[]): string {
  const cols = a[0]!.length;
  const colSpec = `${"c".repeat(cols)}|c`;
  const rows = a.map((row, i) => `${row.join(" & ")} & ${b[i]}`);
  return `\\left[\\begin{array}{${colSpec}} ${rows.join(" \\\\ ")} \\end{array}\\right]`;
}

/** formatLinearTerm formats coeff * variable, e.g. 1x -> x, -1x -> -x, 3x -> 3x, -3x -> -3x. */
function formatLinearTerm(coeff: number, variable: string, isFirst = false): string {
  if (coeff === 0) return "";
  const abs = Math.abs(coeff);
  const coeffStr = abs === 1 ? "" : `${abs}`;
  if (isFirst) {
    return coeff < 0 ? `-${coeffStr}${variable}` : `${coeffStr}${variable}`;
  }
  return coeff < 0 ? `- ${coeffStr}${variable}` : `+ ${coeffStr}${variable}`;
}

/** formatLinear2 formats a 2-variable linear expression ax + by with proper signs. */
function formatLinear2(a: number, b: number): string {
  const t1 = formatLinearTerm(a, "x", true);
  const t2 = formatLinearTerm(b, "y", !t1);
  return [t1, t2].filter(Boolean).join(" ") || "0";
}

/** formatLinear3 formats a 3-variable linear expression ax + by + cz with proper signs. */
function formatLinear3(a: number, b: number, c: number): string {
  const t1 = formatLinearTerm(a, "x", true);
  const t2 = formatLinearTerm(b, "y", !t1);
  const t3 = formatLinearTerm(c, "z", !t1 && !t2);
  return [t1, t2, t3].filter(Boolean).join(" ") || "0";
}

/** formatConst formats a constant with leading sign, e.g. + 3 or - 3. */
function formatConst(c: number): string {
  return c >= 0 ? `+ ${c}` : `- ${-c}`;
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

/** det3 is the determinant of a 3x3 matrix by cofactor expansion along the first row. */
function det3(m: Mat): number {
  const [a, b, c] = m[0]!;
  const [d, e, f] = m[1]!;
  const [g, h, i] = m[2]!;
  return a! * (e! * i! - f! * h!) - b! * (d! * i! - f! * g!) + c! * (d! * h! - e! * g!);
}

/** matMul multiplies two matrices of compatible sizes. */
function matMul(a: Mat, b: Mat): number[][] {
  return a.map((row) => b[0]!.map((_, j) => row.reduce((s, x, k) => s + x * b[k]![j]!, 0)));
}

/** yesNoText is the pair of choice labels for a yes-or-no question, the right one first. */
function yesNoText(yes: boolean): [Text, Text] {
  const y = t("Yes", "是");
  const n = t("No", "否");
  return yes ? [y, n] : [n, y];
}

// ─── Module 2.4. Determinants ────────────────────────────────────────────────

// ─── 2.4.1 Cramer's Rule for 2x2 Systems ──────────────────────────────────────

/** cramersRuleFor2x2SystemsOfLinearEquations teaches Cramer's rule for 2x2 systems. */
export const cramersRuleFor2x2SystemsOfLinearEquations: TopicDef = {
  id: "cramers-rule-for-2x2-systems-of-linear-equations",
  title: t("Cramer's Rule for 2x2 Systems of Linear Equations", "克莱姆法则求解二元一次方程组"),
  summary: t(
    "Solve 2x2 systems of linear equations using determinants and Cramer's rule when det(A) is non-zero.",
    "当系数矩阵行列式非零时，利用行列式和克莱姆法则求解二元一次方程组。",
  ),
  prerequisites: ["the-determinant-of-a-2x2-matrix"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "cramers-rule-2x2-solution",
      title: t("Cramer's rule for 2x2 systems", "克莱姆法则求解二元系统"),
      explanation: t(
        "Each variable equals a ratio of determinants, where the top determinant replaces that variable's column of coefficients by the column of constants. For the system $\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}$, let $D = \\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$. If $D \\ne 0$, the unique solution is given by $x = \\frac{D_x}{D}$ and $y = \\frac{D_y}{D}$, where $D_x = \\det\\begin{pmatrix} e & b \\\\ f & d \\end{pmatrix} = ed - bf$ and $D_y = \\det\\begin{pmatrix} a & e \\\\ c & f \\end{pmatrix} = af - ec$.",
        "每个变量都等于两个行列式之比，分子的行列式是把该变量的系数列换成常数列得到的。对于方程组 $\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}$，记系数行列式 $D = \\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$。若 $D \\ne 0$，则方程组有唯一解：$x = \\frac{D_x}{D}$ 与 $y = \\frac{D_y}{D}$，其中 $D_x = \\det\\begin{pmatrix} e & b \\\\ f & d \\end{pmatrix} = ed - bf$，$D_y = \\det\\begin{pmatrix} a & e \\\\ c & f \\end{pmatrix} = af - ec$。",
      ),
      generate(rng) {
        const xVal = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const yVal = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const a = rng.pick([1, 2, 3, 4, -1, -2, -3]);
        const b = rng.pick([1, 2, 3, -1, -2, -3]);
        const c = rng.pick([1, 2, -1, -2]);
        // pick d such that ad - bc != 0
        const badD = (b * c) % a === 0 ? (b * c) / a : 999;
        const dChoices = [1, 2, 3, 4, -1, -2, -3, -4].filter((v) => v !== badD);
        const d = rng.pick(dChoices);

        const D = a * d - b * c;
        const e = a * xVal + b * yVal;
        const f = c * xVal + d * yVal;
        const Dx = e * d - b * f;
        const Dy = a * f - e * c;

        const askX = rng.bool();
        const varName = askX ? "x" : "y";
        const ansVal = askX ? xVal : yVal;
        const otherVal = askX ? yVal : xVal;

        const eq1 = `${formatLinear2(a, b)} = ${e}`;
        const eq2 = `${formatLinear2(c, d)} = ${f}`;
        const prompt = t(
          `Use Cramer's rule to solve for $${varName}$ in the system of linear equations:

$$\\begin{cases} ${eq1} \\\\ ${eq2} \\end{cases}$$`,
          `利用克莱姆法则求解下列线性方程组中的 $${varName}$：

$$\\begin{cases} ${eq1} \\\\ ${eq2} \\end{cases}$$`,
        );

        return numberProblem({
          prompt,
          answer: ansVal,
          solveFor: varName,
          solution: t(
            `First compute the coefficient determinant: $D = (${a})(${d}) - (${b})(${c}) = ${D}$. Next compute $D_{${varName}} = ${askX ? Dx : Dy}$. Therefore, $${varName} = \\frac{D_{${varName}}}{D} = \\frac{${askX ? Dx : Dy}}{${D}} = ${ansVal}$.`,
            `首先计算系数行列式：$D = (${a})(${d}) - (${b})(${c}) = ${D}$。接着计算 $D_{${varName}} = ${askX ? Dx : Dy}$。因此 $${varName} = \\frac{D_{${varName}}}{D} = \\frac{${askX ? Dx : Dy}}{${D}} = ${ansVal}$。`,
          ),
          wrong: [otherVal, -ansVal, ansVal + 1, ansVal - 1, askX ? Dx : Dy],
        });
      },
    },
    {
      id: "solving-for-y-with-cramers-rule",
      title: t("Solving for $y$ with Cramer's rule", "用克拉默法则求 $y$"),
      explanation: t(
        "For the system $ax + by = e$, $cx + dy = f$ with $D = ad - bc \\ne 0$, Cramer's rule gives $y = \\frac{D_y}{D}$, where $D_y$ is the determinant of the coefficient matrix with its second column replaced by the constants:\n\n$$D_y = \\begin{vmatrix} a & e \\\\ c & f \\end{vmatrix} = af - ce.$$\n\nThe answer may be a fraction even when every coefficient is an integer.",
        "对方程组 $ax + by = e$，$cx + dy = f$，若 $D = ad - bc \\ne 0$，克拉默法则给出 $y = \\frac{D_y}{D}$，其中 $D_y$ 是把系数矩阵第二列换成常数项后的行列式：\n\n$$D_y = \\begin{vmatrix} a & e \\\\ c & f \\end{vmatrix} = af - ce$$\n\n即使所有系数都是整数，答案也可能是分数。",
      ),
      generate(rng: Rng): Problem {
        let a = 0;
        let b = 0;
        let c = 0;
        let d = 0;
        while (a * d - b * c === 0) {
          a = rng.nonZero(-5, 5);
          b = rng.nonZero(-5, 5);
          c = rng.nonZero(-5, 5);
          d = rng.nonZero(-5, 5);
        }
        const e = rng.int(-9, 9);
        const f = rng.int(-9, 9);
        const D = a * d - b * c;
        const Dy = a * f - c * e;
        const Dx = e * d - b * f;
        const ans = Q.of(Dy, D);
        return numberProblem({
          prompt: t(
            `Use Cramer's rule to find $y$: $\\begin{cases} ${formatLinear2(a, b)} = ${e} \\\\ ${formatLinear2(c, d)} = ${f} \\end{cases}$`,
            `用克拉默法则求 $y$：$\\begin{cases} ${formatLinear2(a, b)} = ${e} \\\\ ${formatLinear2(c, d)} = ${f} \\end{cases}$`,
          ),
          answer: ans,
          wrong: [Q.of(Dx, D), Q.of(-Dy, D), Q.of(D, Dy === 0 ? 1 : Dy), Q.of(Dy)],
          solution: t(
            `$D = ${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${D}$ and $D_y = ${a} \\cdot ${paren(f)} - ${paren(c)} \\cdot ${paren(e)} = ${Dy}$, so $y = \\frac{${Dy}}{${D}}${ans.toLatex() === `\\frac{${Dy}}{${D}}` ? "" : ` = ${ans.toLatex()}`}$.`,
            `$D = ${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${D}$，$D_y = ${a} \\cdot ${paren(f)} - ${paren(c)} \\cdot ${paren(e)} = ${Dy}$，所以 $y = \\frac{${Dy}}{${D}}${ans.toLatex() === `\\frac{${Dy}}{${D}}` ? "" : ` = ${ans.toLatex()}`}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.4.2 Cramer's Rule for 3x3 Systems ──────────────────────────────────────

/** cramersRuleFor3x3Systems teaches column replacement matrices and Cramer's rule for 3x3. */
export const cramersRuleFor3x3Systems: TopicDef = {
  id: "cramers-rule-for-3x3-systems",
  title: t("Cramer's Rule for 3x3 Systems", "克莱姆法则求解三元一次方程组"),
  summary: t(
    "Apply Cramer's rule to $3 \\times 3$ systems of equations using the column replacement matrices $A_i(\\mathbf{b})$.",
    "利用列替换矩阵 $A_i(\\mathbf{b})$ 将克莱姆法则应用于 $3 \\times 3$ 方程组。",
  ),
  prerequisites: ["the-determinant-of-a-3x3-matrix", "cramers-rule-for-2x2-systems-of-linear-equations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "cramers-rule-3x3-solution",
      title: t("Column replacement and 3x3 Cramer's rule", "列替换与三元克莱姆法则"),
      explanation: t(
        "For a $3 \\times 3$ system $A\\mathbf{x} = \\mathbf{b}$, Cramer's rule states that if $\\det(A) \\ne 0$, then $x_i = \\frac{\\det(A_i(\\mathbf{b}))}{\\det(A)}$, where $A_i(\\mathbf{b})$ is the matrix formed by replacing the $i$-th column of $A$ with the constant column vector $\\mathbf{b}$.",
        "对于 $3 \\times 3$ 方程组 $A\\mathbf{x} = \\mathbf{b}$，克莱姆法则指出若 $\\det(A) \\ne 0$，则 $x_i = \\frac{\\det(A_i(\\mathbf{b}))}{\\det(A)}$，其中 $A_i(\\mathbf{b})$ 是将 $A$ 的第 $i$ 列替换为常数列向量 $\\mathbf{b}$ 得到的矩阵。",
      ),
      generate(rng) {
        const colIdx = rng.pick([1, 2, 3]);
        const a11 = rng.pick([1, 2, 3]);
        const a12 = rng.pick([-2, -1, 1, 2]);
        const a13 = rng.pick([-3, 1, 2]);
        const a21 = rng.pick([-1, 0, 1]);
        const a22 = rng.pick([2, 3, 4]);
        const a23 = rng.pick([-2, 1, 3]);
        const a31 = rng.pick([0, 1, -1]);
        const a32 = rng.pick([-1, 1, 2]);
        const a33 = rng.pick([1, 2, 3]);

        const A: Mat = [
          [a11, a12, a13],
          [a21, a22, a23],
          [a31, a32, a33],
        ];

        const b1 = rng.pick([2, 3, 5, 7]);
        const b2 = rng.pick([-1, 4, 6]);
        const b3 = rng.pick([1, -3, 8]);
        const bVec = [b1, b2, b3];

        const replaceCol = (m: Mat, c: number, v: number[]): Mat => m.map((row, r) => row.map((val, j) => (j === c - 1 ? v[r]! : val)));

        const A_correct = replaceCol(A, colIdx, bVec);
        const wrongCol = colIdx === 1 ? 2 : colIdx === 2 ? 3 : 1;
        const A_wrong1 = replaceCol(A, wrongCol, bVec);
        const wrongCol2 = 6 - colIdx - wrongCol;
        const A_wrong2 = replaceCol(A, wrongCol2, bVec);
        // Row replacement distractor
        const A_wrong3: Mat = A.map((row, r) => (r === colIdx - 1 ? [...bVec] : row));

        const varStr = colIdx === 1 ? "x_1" : colIdx === 2 ? "x_2" : "x_3";
        const prompt = t(
          `Consider the $3 \\times 3$ system $A\\mathbf{x} = \\mathbf{b}$ with

$$A = ${matLatex(A)}, \\quad \\mathbf{b} = ${colVecLatex(bVec)}$$

Which matrix is $A_{${colIdx}}(\\mathbf{b})$, used in Cramer's rule to compute $${varStr} = \\frac{\\det(A_{${colIdx}}(\\mathbf{b}))}{\\det(A)}$?`,
          `考虑 $3 \\times 3$ 线性系统 $A\\mathbf{x} = \\mathbf{b}$，其中

$$A = ${matLatex(A)}, \\quad \\mathbf{b} = ${colVecLatex(bVec)}$$

在克莱姆法则中用于计算 $${varStr} = \\frac{\\det(A_{${colIdx}}(\\mathbf{b}))}{\\det(A)}$ 的替换矩阵 $A_{${colIdx}}(\\mathbf{b})$ 是哪一个？`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$$${matLatex(A_correct)}$$`, `$$${matLatex(A_correct)}$$`),
          [
            t(`$$${matLatex(A_wrong1)}$$`, `$$${matLatex(A_wrong1)}$$`),
            t(`$$${matLatex(A_wrong2)}$$`, `$$${matLatex(A_wrong2)}$$`),
            t(`$$${matLatex(A_wrong3)}$$`, `$$${matLatex(A_wrong3)}$$`),
          ],
          t(
            `In Cramer's rule, $A_{${colIdx}}(\\mathbf{b})$ is obtained by replacing column ${colIdx} of $A$ with the constant vector $\\mathbf{b}$. Thus column ${colIdx} becomes $\\begin{pmatrix} ${b1} \\\\ ${b2} \\\\ ${b3} \\end{pmatrix}$ while the other columns remain unchanged.`,
            `在克莱姆法则中，$A_{${colIdx}}(\\mathbf{b})$ 是通过将 $A$ 的第 ${colIdx} 列替换为常数向量 $\\mathbf{b}$ 得到的。因此第 ${colIdx} 列变为 $\\begin{pmatrix} ${b1} \\\\ ${b2} \\\\ ${b3} \\end{pmatrix}$，其余列保持不变。`,
          ),
        );
      },
    },
    {
      id: "computing-one-unknown-of-a-3x3-system-with-cramers-rule",
      title: t("Computing one unknown of a 3×3 system with Cramer's rule", "用克拉默法则求 3×3 方程组的一个未知数"),
      explanation: t(
        "Cramer's rule gives each unknown separately: $x_i = \\frac{\\det A_i(\\mathbf{b})}{\\det A}$, where $A_i(\\mathbf{b})$ is $A$ with column $i$ replaced by $\\mathbf{b}$. To find a single unknown of a $3 \\times 3$ system you only need two $3 \\times 3$ determinants, which is often quicker than full elimination when just one value is wanted.",
        "克拉默法则可以单独求每个未知数：$x_i = \\frac{\\det A_i(\\mathbf{b})}{\\det A}$，其中 $A_i(\\mathbf{b})$ 是把 $A$ 的第 $i$ 列换成 $\\mathbf{b}$ 后的矩阵。要求 $3 \\times 3$ 方程组的某一个未知数，只需两个 $3 \\times 3$ 行列式；只要一个值时，这往往比完整消元更快。",
      ),
      generate(rng: Rng): Problem {
        let A: number[][] = [];
        let D = 0;
        while (D === 0) {
          A = [0, 1, 2].map(() => [0, 1, 2].map(() => rng.int(-3, 3)));
          D = det3(A);
        }
        const b = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6)];
        const i = rng.int(0, 2);
        const Ai = A.map((row, r) => row.map((x, cIdx) => (cIdx === i ? b[r]! : x)));
        const Di = det3(Ai);
        const ans = Q.of(Di, D);
        const name = ["x_1", "x_2", "x_3"][i]!;
        return numberProblem({
          prompt: t(
            `Use Cramer's rule to find $${name}$ for $A\\mathbf{x} = \\mathbf{b}$ with $A = ${matLatex(A)}$ and $\\mathbf{b} = ${colVecLatex(b)}$.`,
            `用克拉默法则求 $A\\mathbf{x} = \\mathbf{b}$ 的 $${name}$，其中 $A = ${matLatex(A)}$，$\\mathbf{b} = ${colVecLatex(b)}$。`,
          ),
          answer: ans,
          wrong: [
            Q.of(-Di, D),
            Q.of(Di),
            Q.of(D, Di === 0 ? 1 : Di),
            Q.of(det3(A.map((row, r) => row.map((x, cIdx) => (cIdx === (i + 1) % 3 ? b[r]! : x)))), D),
          ],
          solution: t(
            `$\\det A = ${D}$ and $\\det A_{${i + 1}}(\\mathbf{b}) = \\det ${matLatex(Ai)} = ${Di}$, so $${name} = \\frac{${Di}}{${D}} = ${ans.toLatex()}$.`,
            `$\\det A = ${D}$，$\\det A_{${i + 1}}(\\mathbf{b}) = \\det ${matLatex(Ai)} = ${Di}$，所以 $${name} = \\frac{${Di}}{${D}} = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.4.3 The Determinant of an NxN Matrix ──────────────────────────────────

/** theDeterminantOfAnNxnMatrix introduces the general Leibniz formula and permutations. */
export const theDeterminantOfAnNxnMatrix: TopicDef = {
  id: "the-determinant-of-an-nxn-matrix",
  title: t("The Determinant of an NxN Matrix", "N 阶行列式的定义"),
  summary: t(
    "Define determinants of nxn matrices using the Leibniz permutation formula and permutation signatures.",
    "通过全排列及其逆序数（莱布尼茨公式）定义 n 阶行列式。",
  ),
  prerequisites: ["the-determinant-of-a-3x3-matrix"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "leibniz-formula-permutations",
      title: t("Leibniz formula and permutation signature", "莱布尼茨公式与排列奇偶性"),
      explanation: t(
        "For an $n \\times n$ matrix $A = (a_{ij})$, the determinant is defined by the Leibniz formula: $\\det(A) = \\sum_{\\sigma \\in S_n} \\text{sgn}(\\sigma) \\prod_{i=1}^n a_{i, \\sigma(i)}$, where $S_n$ is the symmetric group of $n!$ permutations. The signature $\\text{sgn}(\\sigma) = (-1)^{\\text{inv}(\\sigma)}$, where $\\text{inv}(\\sigma)$ is the number of inversions (pairs $i < j$ with $\\sigma(i) > \\sigma(j)$).",
        "对于 $n \\times n$ 矩阵 $A = (a_{ij})$，其行列式由莱布尼茨公式定义：$\\det(A) = \\sum_{\\sigma \\in S_n} \\text{sgn}(\\sigma) \\prod_{i=1}^n a_{i, \\sigma(i)}$，其中 $S_n$ 为包含 $n!$ 个置换的对称群。置换的符号 $\\text{sgn}(\\sigma) = (-1)^{\\text{inv}(\\sigma)}$，其中 $\\text{inv}(\\sigma)$ 为逆序数（即满足 $i < j$ 且 $\\sigma(i) > \\sigma(j)$ 的数对个数）。",
      ),
      generate(rng) {
        const n = rng.pick([4, 5]);
        const p = rng.shuffle(Array.from({ length: n }, (_, i) => i + 1));
        let invCount = 0;
        for (let i = 0; i < p.length; i++) {
          for (let j = i + 1; j < p.length; j++) {
            if (p[i]! > p[j]!) invCount++;
          }
        }
        const sgn = invCount % 2 === 0 ? 1 : -1;
        const signStr = sgn > 0 ? "+1" : "-1";
        const parityEn = invCount % 2 === 0 ? "even" : "odd";
        const parityZh = invCount % 2 === 0 ? "偶" : "奇";

        const prompt = t(
          `In the Leibniz formula for the determinant of ${article(n)} $${n} \\times ${n}$ matrix $A = (a_{ij})$, consider the permutation $\\sigma = (${p.join(", ")})$. What is its number of inversions $\\text{inv}(\\sigma)$ and signature $\\text{sgn}(\\sigma)$?`,
          `在 $${n} \\times ${n}$ 矩阵 $A = (a_{ij})$ 的行列式莱布尼茨展开式中，考虑置换 $\\sigma = (${p.join(", ")})$。它的逆序数 $\\text{inv}(\\sigma)$ 和符号 $\\text{sgn}(\\sigma)$ 分别是多少？`,
        );

        return oneOf(
          rng,
          prompt,
          t(
            `$\\text{inv}(\\sigma) = ${invCount}$, so $\\text{sgn}(\\sigma) = ${signStr}$`,
            `$\\text{inv}(\\sigma) = ${invCount}$，故 $\\text{sgn}(\\sigma) = ${signStr}$`,
          ),
          [
            t(
              `$\\text{inv}(\\sigma) = ${invCount}$, so $\\text{sgn}(\\sigma) = ${sgn > 0 ? "-1" : "+1"}$`,
              `$\\text{inv}(\\sigma) = ${invCount}$，故 $\\text{sgn}(\\sigma) = ${sgn > 0 ? "-1" : "+1"}$`,
            ),
            t(
              `$\\text{inv}(\\sigma) = ${invCount + 1}$, so $\\text{sgn}(\\sigma) = ${sgn > 0 ? "-1" : "+1"}$`,
              `$\\text{inv}(\\sigma) = ${invCount + 1}$，故 $\\text{sgn}(\\sigma) = ${sgn > 0 ? "-1" : "+1"}$`,
            ),
            t(
              `$\\text{inv}(\\sigma) = ${Math.max(0, invCount - 1)}$, so $\\text{sgn}(\\sigma) = ${sgn > 0 ? "-1" : "+1"}$`,
              `$\\text{inv}(\\sigma) = ${Math.max(0, invCount - 1)}$，故 $\\text{sgn}(\\sigma) = ${sgn > 0 ? "-1" : "+1"}$`,
            ),
            t(
              `$\\text{inv}(\\sigma) = ${invCount + 2}$, so $\\text{sgn}(\\sigma) = ${signStr}$`,
              `$\\text{inv}(\\sigma) = ${invCount + 2}$，故 $\\text{sgn}(\\sigma) = ${signStr}$`,
            ),
          ],
          t(
            `Counting pairs $(i, j)$ with $i < j$ and $\\sigma(i) > \\sigma(j)$ gives exactly $${invCount}$ inversions. Since $(-1)^{${invCount}} = ${signStr}$, the permutation is ${parityEn} and $\\text{sgn}(\\sigma) = ${signStr}$.`,
            `统计所有满足 $i < j$ 且 $\\sigma(i) > \\sigma(j)$ 的数对，共有 $${invCount}$ 个逆序。因为 $(-1)^{${invCount}} = ${signStr}$，所以该置换为${parityZh}置换，符号 $\\text{sgn}(\\sigma) = ${signStr}$。`,
          ),
        );
      },
    },
    {
      id: "the-determinant-of-a-permutation-matrix",
      title: t("The determinant of a permutation matrix", "置换矩阵的行列式"),
      explanation: t(
        "A permutation matrix has exactly one $1$ in each row and column. In the Leibniz formula only the term for its own permutation $\\sigma$ is nonzero, and that term is $\\operatorname{sgn}(\\sigma) \\cdot 1$. So the determinant is $(-1)^k$, where $k$ is the number of inversions of $\\sigma$, the pairs $i < j$ with $\\sigma(i) > \\sigma(j)$.",
        "置换矩阵每行每列恰有一个 $1$。在莱布尼茨公式中只有对应其自身置换 $\\sigma$ 的项非零，该项为 $\\operatorname{sgn}(\\sigma) \\cdot 1$。所以行列式为 $(-1)^k$，其中 $k$ 是 $\\sigma$ 的逆序数，即满足 $i < j$ 且 $\\sigma(i) > \\sigma(j)$ 的对数。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(3, 5);
        let sigma = rng.shuffle(Array.from({ length: n }, (_, i) => i + 1));
        if (sigma.every((s, i) => s === i + 1)) sigma = [...sigma.slice(1), sigma[0]!];
        let inv = 0;
        for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (sigma[i]! > sigma[j]!) inv++;
        const P = sigma.map((s) => Array.from({ length: n }, (_, j) => (j + 1 === s ? 1 : 0)));
        const ans = inv % 2 === 0 ? 1 : -1;
        return numberProblem({
          prompt: t(`Find $\\det P$ for the permutation matrix $P = ${matLatex(P)}$.`, `求置换矩阵 $P = ${matLatex(P)}$ 的 $\\det P$。`),
          answer: ans,
          wrong: [-ans, 0, n, inv],
          solution: t(
            `Row $i$ has its $1$ in column $\\sigma(i)$, with $\\sigma = (${sigma.join(", ")})$. It has $${inv}$ inversion${inv === 1 ? "" : "s"}, so $\\det P = (-1)^{${inv}} = ${ans}$.`,
            `第 $i$ 行的 $1$ 在第 $\\sigma(i)$ 列，$\\sigma = (${sigma.join(", ")})$。它有 $${inv}$ 个逆序，所以 $\\det P = (-1)^{${inv}} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.4.4 Finding Determinants Using Laplace Expansions ───────────────────────

/** findingDeterminantsUsingLaplaceExpansions covers cofactor expansions along optimal rows/cols. */
export const findingDeterminantsUsingLaplaceExpansions: TopicDef = {
  id: "finding-determinants-using-laplace-expansions",
  title: t("Finding Determinants Using Laplace Expansions", "按行或按列的拉普拉斯展开定理"),
  summary: t(
    "Calculate determinants efficiently using Laplace expansions along rows or columns with many zeros.",
    "通过沿含有较多零的行或列进行拉普拉斯展开，高效计算行列式的值。",
  ),
  prerequisites: ["the-determinant-of-an-nxn-matrix"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "laplace-expansion-cofactors",
      title: t("Laplace expansion along a row or column", "按行或按列的拉普拉斯展开"),
      explanation: t(
        "By Laplace's expansion theorem, $\\det(A) = \\sum_{j=1}^n a_{ij} C_{ij} = \\sum_{i=1}^n a_{ij} C_{ij}$, where cofactor $C_{ij} = (-1)^{i+j} M_{ij}$ and $M_{ij}$ is the determinant of the $(n-1) \\times (n-1)$ submatrix obtained by deleting row $i$ and column $j$. Choosing a row or column with the maximum number of zeros reduces computation.",
        "根据拉普拉斯展开定理，$\\det(A) = \\sum_{j=1}^n a_{ij} C_{ij} = \\sum_{i=1}^n a_{ij} C_{ij}$，其中代数余子式 $C_{ij} = (-1)^{i+j} M_{ij}$，$M_{ij}$ 是划去第 $i$ 行和第 $j$ 列后得到的余子式。选择含有最多零的行或列进行展开，可以大幅减少计算量。",
      ),
      generate(rng) {
        // Create a 4x4 matrix where row 2 has three zeros and one non-zero entry k at col 3 (1-indexed row 2, col 3)
        const k = rng.pick([-4, -3, -2, 2, 3, 4]);
        // 3x3 remaining entries
        const m11 = rng.pick([1, 2, 3]);
        const m12 = rng.pick([-1, 0, 1]);
        const m13 = rng.pick([1, 2]);
        const m21 = 0;
        const m22 = rng.pick([2, 3]);
        const m23 = rng.pick([-2, 1]);
        const m31 = 0;
        const m32 = 0;
        const m33 = rng.pick([1, 2, 4]);

        const minorDet = m11 * m22 * m33; // upper triangular 3x3 minor
        // Position is row 2, col 3: sign is (-1)^(2+3) = -1
        const sign = -1;
        const ans = sign * k * minorDet;

        const A: Mat = [
          [m11, m12, rng.pick([3, 5]), m13],
          [0, 0, k, 0],
          [m21, m22, rng.pick([-1, 4]), m23],
          [m31, m32, rng.pick([2, -3]), m33],
        ];

        const prompt = t(
          `Evaluate the determinant of the $4 \\times 4$ matrix $A$ by expanding along the row with the most zeros:

$$A = ${matLatex(A)}$$`,
          `沿含零最多的行展开，计算 $4 \\times 4$ 矩阵 $A$ 的行列式：

$$A = ${matLatex(A)}$$`,
        );

        return numberProblem({
          prompt,
          answer: ans,
          solution: t(
            `Row 2 has three zeros and only one non-zero entry $a_{23} = ${k}$. Expanding along row 2 gives $\\det(A) = a_{23} C_{23} = (${k})(-1)^{2+3} M_{23} = -(${k}) M_{23}$. The minor $M_{23}$ is upper triangular with diagonal entries $${m11}, ${m22}, ${m33}$, so $M_{23} = ${minorDet}$. Thus $\\det(A) = -(${k})(${minorDet}) = ${ans}$.`,
            `第 2 行有三个零，仅在第 3 列有一个非零元 $a_{23} = ${k}$。沿第 2 行展开得到 $\\det(A) = a_{23} C_{23} = (${k})(-1)^{2+3} M_{23} = -(${k}) M_{23}$。余子式 $M_{23}$ 是上三角矩阵，主对角线元素为 $${m11}, ${m22}, ${m33}$，其行列式为 $${minorDet}$。因此 $\\det(A) = -(${k})(${minorDet}) = ${ans}$。`,
          ),
          wrong: [-ans, ans + k, ans - k, k * minorDet],
        });
      },
    },
    {
      id: "computing-a-cofactor-of-a-3x3-matrix",
      title: t("Computing a cofactor of a 3×3 matrix", "计算 3×3 矩阵的余子式"),
      explanation: t(
        "The cofactor $C_{ij}$ of $A$ is $(-1)^{i+j}M_{ij}$, where the minor $M_{ij}$ is the determinant of the matrix left after deleting row $i$ and column $j$. The sign follows a checkerboard pattern starting with $+$ in the top-left corner. Laplace expansion along a row adds up $a_{ij}C_{ij}$ across that row.",
        "$A$ 的代数余子式 $C_{ij}$ 为 $(-1)^{i+j}M_{ij}$，其中余子式 $M_{ij}$ 是删去第 $i$ 行和第 $j$ 列后所得矩阵的行列式。符号按棋盘格交替，左上角为 $+$。沿某行的拉普拉斯展开就是把该行的 $a_{ij}C_{ij}$ 相加。",
      ),
      generate(rng: Rng): Problem {
        const A = [0, 1, 2].map(() => [0, 1, 2].map(() => rng.int(-5, 5)));
        const i = rng.int(1, 3);
        const j = rng.int(1, 3);
        const sub = A.filter((_, r) => r !== i - 1).map((row) => row.filter((_, c) => c !== j - 1));
        const M = sub[0]![0]! * sub[1]![1]! - sub[0]![1]! * sub[1]![0]!;
        const sign = (i + j) % 2 === 0 ? 1 : -1;
        const ans = sign * M;
        return numberProblem({
          prompt: t(`Find the cofactor $C_{${i}${j}}$ of $A = ${matLatex(A)}$.`, `求 $A = ${matLatex(A)}$ 的代数余子式 $C_{${i}${j}}$。`),
          answer: ans,
          wrong: [-ans, sub[0]![0]! * sub[1]![1]! + sub[0]![1]! * sub[1]![0]!, A[i - 1]![j - 1]! * ans],
          solution: t(
            `Deleting row $${i}$ and column $${j}$ leaves $${matLatex(sub)}$, so $M_{${i}${j}} = ${M}$. The sign is $(-1)^{${i + j}} = ${sign}$, so $C_{${i}${j}} = ${ans}$.`,
            `删去第 $${i}$ 行和第 $${j}$ 列得 $${matLatex(sub)}$，所以 $M_{${i}${j}} = ${M}$。符号为 $(-1)^{${i + j}} = ${sign}$，所以 $C_{${i}${j}} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.4.5 Basic Properties of Determinants ───────────────────────────────────

/** basicPropertiesOfDeterminants covers transpose, products, and scalar multiplication. */
export const basicPropertiesOfDeterminants: TopicDef = {
  id: "basic-properties-of-determinants",
  title: t("Basic Properties of Determinants", "行列式的基本性质"),
  summary: t(
    "Use key properties: $\\det(A^T) = \\det(A)$, $\\det(AB) = \\det(A)\\det(B)$, and $\\det(kA) = k^n \\det(A)$.",
    "运用行列式基本性质：$\\det(A^T) = \\det(A)$、$\\det(AB) = \\det(A)\\det(B)$ 以及 $\\det(kA) = k^n \\det(A)$。",
  ),
  prerequisites: ["the-determinant-of-an-nxn-matrix"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "determinant-basic-properties",
      title: t("Properties of determinants: transpose, product, and scaling", "转置、矩阵乘积与数乘的行列式性质"),
      explanation: t(
        "Multiplying a whole matrix by a scalar multiplies every row by it, so the determinant picks up one factor of the scalar for each row. For $n \\times n$ square matrices $A$ and $B$, and scalar $k$: (1) $\\det(A^T) = \\det(A)$; (2) $\\det(AB) = \\det(A)\\det(B)$; (3) $\\det(kA) = k^n \\det(A)$, since factor $k$ scales all $n$ rows.",
        "用一个数乘整个矩阵相当于每一行都乘以它，所以行列式对每一行都多出一个这样的因子。对于 $n \\times n$ 方阵 $A$ 和 $B$ 以及标量 $k$：(1) $\\det(A^T) = \\det(A)$；(2) $\\det(AB) = \\det(A)\\det(B)$；(3) $\\det(kA) = k^n \\det(A)$，因为数乘 $k$ 会将矩阵的全部 $n$ 行同时乘以 $k$。",
      ),
      generate(rng) {
        const n = rng.pick([2, 3, 4]);
        const detA = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const detB = rng.pick([-4, -3, -2, 2, 3, 4]);
        const k = rng.pick([2, 3, -2]);

        const kn = k ** n;
        const ans = kn * detA * detB;
        const wrongNoKn = k * detA * detB;
        const wrongKnMinus1 = k ** (n - 1) * detA * detB;
        const wrongSign = -ans;

        const prompt = t(
          `Let $A$ and $B$ be $${n} \\times ${n}$ matrices such that $\\det(A) = ${detA}$ and $\\det(B) = ${detB}$. What is $\\det(${k} A^T B)$?`,
          `设 $A$ 和 $B$ 均为 $${n} \\times ${n}$ 矩阵，已知 $\\det(A) = ${detA}$ 且 $\\det(B) = ${detB}$。求 $\\det(${k} A^T B)$ 的值。`,
        );

        return numberProblem({
          prompt,
          answer: ans,
          solution: t(
            `Using properties of determinants: $\\det(${k} A^T B) = (${k})^n \\det(A^T)\\det(B)$. Since the matrices are $${n} \\times ${n}$, $(${k})^n = (${k})^{${n}} = ${kn}$. Since $\\det(A^T) = \\det(A) = ${detA}$, we have $\\det(${k} A^T B) = (${kn})(${detA})(${detB}) = ${ans}$.`,
            `利用行列式的性质：$\\det(${k} A^T B) = (${k})^n \\det(A^T)\\det(B)$。由于矩阵为 $${n} \\times ${n}$ 阶，所以 $(${k})^n = (${k})^{${n}} = ${kn}$。又因为 $\\det(A^T) = \\det(A) = ${detA}$，故 $\\det(${k} A^T B) = (${kn})(${detA})(${detB}) = ${ans}$。`,
          ),
          wrong: [wrongNoKn, wrongKnMinus1, wrongSign, kn * (detA + detB)],
        });
      },
    },
    {
      id: "the-determinant-of-a-product-with-an-inverse",
      title: t("The determinant of a product with an inverse", "含逆矩阵乘积的行列式"),
      explanation: t(
        "The determinant is multiplicative, $\\det(AB) = \\det A \\det B$, and $\\det(B^{-1}) = \\frac{1}{\\det B}$. Together these give\n\n$$\\det(A^2B^{-1}) = \\frac{(\\det A)^2}{\\det B}.$$\n\nThe order of the factors does not matter for the determinant, even though $AB \\ne BA$ in general.",
        "行列式具有乘性，$\\det(AB) = \\det A \\det B$，且 $\\det(B^{-1}) = \\frac{1}{\\det B}$。合起来得\n\n$$\\det(A^2B^{-1}) = \\frac{(\\det A)^2}{\\det B}$$\n\n虽然一般 $AB \\ne BA$，但因子的次序不影响行列式。",
      ),
      generate(rng: Rng): Problem {
        const dA = rng.nonZero(-5, 5);
        const dB = rng.pick([-4, -3, -2, 2, 3, 4, 5, 6]);
        const n = rng.int(2, 4);
        const ans = Q.of(dA * dA, dB);
        return numberProblem({
          prompt: t(
            `$A$ and $B$ are $${n} \\times ${n}$ matrices with $\\det A = ${dA}$ and $\\det B = ${dB}$. Find $\\det(A^2B^{-1})$.`,
            `$A$、$B$ 为 $${n} \\times ${n}$ 矩阵，$\\det A = ${dA}$，$\\det B = ${dB}$。求 $\\det(A^2B^{-1})$。`,
          ),
          answer: ans,
          wrong: [Q.of(2 * dA, dB), Q.of(dA * dA * dB), Q.of(dA * dA, -dB), Q.of(dA, dB)],
          solution: t(
            `$\\det(A^2B^{-1}) = \\frac{(\\det A)^2}{\\det B} = \\frac{${dA * dA}}{${dB}} = ${ans.toLatex()}$.`,
            `$\\det(A^2B^{-1}) = \\frac{(\\det A)^2}{\\det B} = \\frac{${dA * dA}}{${dB}} = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.4.6 Further Properties of Determinants ─────────────────────────────────

/** furtherPropertiesOfDeterminants covers determinant of inverses, powers, and invertibility. */
export const furtherPropertiesOfDeterminants: TopicDef = {
  id: "further-properties-of-determinants",
  title: t("Further Properties of Determinants", "行列式的进阶乘法与可逆性性质"),
  summary: t(
    "Compute determinants of inverses, $\\det(A^{-1}) = \\frac{1}{\\det(A)}$, and of powers, $\\det(A^k) = (\\det A)^k$.",
    "掌握逆矩阵的行列式 $\\det(A^{-1}) = \\frac{1}{\\det(A)}$ 以及幂矩阵的行列式 $\\det(A^k) = (\\det A)^k$ 的计算。",
  ),
  prerequisites: ["basic-properties-of-determinants"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "determinant-inverse-and-powers",
      title: t("Determinant of inverses and powers", "逆矩阵与幂矩阵的行列式"),
      explanation: t(
        "A square matrix $A$ is invertible if and only if $\\det(A) \\ne 0$. For an invertible $n \\times n$ matrix $A$: (1) $\\det(A^{-1}) = \\frac{1}{\\det(A)}$; (2) $\\det(A^k) = (\\det A)^k$ for any integer $k$; (3) $\\det((cA)^{-1}) = \\frac{1}{c^n \\det(A)}$.",
        "方阵 $A$ 可逆当且仅当 $\\det(A) \\ne 0$。对于可逆的 $n \\times n$ 矩阵 $A$：(1) $\\det(A^{-1}) = \\frac{1}{\\det(A)}$；(2) 对任意整数 $k$，$\\det(A^k) = (\\det A)^k$；(3) $\\det((cA)^{-1}) = \\frac{1}{c^n \\det(A)}$。",
      ),
      generate(rng) {
        const n = rng.pick([2, 3]);
        const d = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const power = rng.pick([2, 3]);
        const askInverse = rng.bool();

        if (askInverse) {
          const c = rng.pick([2, 3]);
          const cn = c ** n;
          const denom = cn * d;

          const prompt = t(
            `Let $A$ be an invertible $${n} \\times ${n}$ matrix with $\\det(A) = ${d}$. What is $\\det((${c}A)^{-1})$?`,
            `设 $A$ 为 $${n} \\times ${n}$ 可逆矩阵，且 $\\det(A) = ${d}$。求 $\\det((${c}A)^{-1})$ 的值。`,
          );

          const ansQ = Q.of(1, denom);

          return numberProblem({
            prompt,
            answer: ansQ,
            solution: t(
              `First, $\\det(${c}A) = (${c})^{${n}} \\det(A) = ${cn} \\cdot (${d}) = ${denom}$. Next, $\\det((${c}A)^{-1}) = \\frac{1}{\\det(${c}A)} = ${ansQ.toLatex()}$.`,
              `首先，$\\det(${c}A) = (${c})^{${n}} \\det(A) = ${cn} \\cdot (${d}) = ${denom}$。进而，$\\det((${c}A)^{-1}) = \\frac{1}{\\det(${c}A)} = ${ansQ.toLatex()}$。`,
            ),
            wrong: [Q.of(-1, denom), Q.of(1, c * d), denom, d],
          });
        }

        const ans = d ** power;
        const prompt = t(
          `Let $A$ be a square matrix with $\\det(A) = ${d}$. What is $\\det(A^{${power}})$?`,
          `设方阵 $A$ 满足 $\\det(A) = ${d}$。求 $\\det(A^{${power}})$ 的值。`,
        );

        return numberProblem({
          prompt,
          answer: ans,
          solution: t(
            `Since $\\det(AB) = \\det(A)\\det(B)$, by induction $\\det(A^{${power}}) = (\\det A)^{${power}} = (${d})^{${power}} = ${ans}$.`,
            `因为 $\\det(AB) = \\det(A)\\det(B)$，由归纳法可得 $\\det(A^{${power}}) = (\\det A)^{${power}} = (${d})^{${power}} = ${ans}$。`,
          ),
          wrong: [power * d, -ans, d ** (power - 1), d ** power + 1],
        });
      },
    },
    {
      id: "the-determinant-of-the-adjugate",
      title: t("The determinant of the adjugate", "伴随矩阵的行列式"),
      explanation: t(
        "The adjugate satisfies $A\\operatorname{adj}(A) = (\\det A)I_n$. Taking determinants of both sides gives $\\det A \\cdot \\det(\\operatorname{adj} A) = (\\det A)^n$, so for invertible $A$\n\n$$\\det(\\operatorname{adj} A) = (\\det A)^{n-1}.$$\n\nThe exponent is $n - 1$, not $n$, because one factor of $\\det A$ cancels.",
        "伴随矩阵满足 $A\\operatorname{adj}(A) = (\\det A)I_n$。两边取行列式得 $\\det A \\cdot \\det(\\operatorname{adj} A) = (\\det A)^n$，所以对可逆的 $A$\n\n$$\\det(\\operatorname{adj} A) = (\\det A)^{n-1}$$\n\n指数是 $n - 1$ 而不是 $n$，因为约去了一个 $\\det A$。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(2, 5);
        const d = rng.pick([-4, -3, -2, 2, 3, 4, 5, 6]);
        const ans = d ** (n - 1);
        return numberProblem({
          prompt: t(
            `$A$ is a $${n} \\times ${n}$ matrix with $\\det A = ${d}$. Find $\\det(\\operatorname{adj} A)$.`,
            `$A$ 为 $${n} \\times ${n}$ 矩阵，$\\det A = ${d}$。求 $\\det(\\operatorname{adj} A)$。`,
          ),
          answer: ans,
          wrong: [d ** n, d, Q.of(1, d), d ** (n - 2)],
          solution: t(
            `$\\det(\\operatorname{adj} A) = (\\det A)^{n-1} = ${paren(d)}^{${n - 1}} = ${ans}$.`,
            `$\\det(\\operatorname{adj} A) = (\\det A)^{n-1} = ${paren(d)}^{${n - 1}} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.4.7 Row and Column Operations on Determinants ──────────────────────────

/** rowAndColumnOperationsOnDeterminants covers how elementary operations scale/change det. */
export const rowAndColumnOperationsOnDeterminants: TopicDef = {
  id: "row-and-column-operations-on-determinants",
  title: t("Row and Column Operations on Determinants", "初等变换对行列式值的影响"),
  summary: t(
    "Analyze how swapping rows, scaling a row, and row additions alter the value of a determinant.",
    "分析交换两行、数乘某行以及行倍加变换对行列式值的影响规律。",
  ),
  prerequisites: ["basic-properties-of-determinants"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "elementary-operations-effect-on-determinant",
      title: t("Effect of row and column operations on determinants", "初等变换对行列式的影响"),
      explanation: t(
        "For any square matrix: (1) Swapping two rows (or columns) multiplies the determinant by $-1$; (2) Multiplying a single row (or column) by a scalar $c$ multiplies the determinant by $c$; (3) Adding a scalar multiple of one row (or column) to another row (or column) leaves the determinant unchanged.",
        "对任意方阵：(1) 交换两行（或两列），行列式的值变号，即乘以 $-1$；(2) 将某一行（或某一列）乘以标量 $c$，行列式的值乘以 $c$；(3) 将一行的倍数加到另一行（或列），行列式的值保持不变。",
      ),
      generate(rng) {
        const d = rng.pick([-8, -7, -6, -5, -4, -3, 3, 4, 5, 6, 7, 8]);
        const k = rng.pick([2, 3, -2, -3]);
        const c = rng.pick([2, 4, 5]);

        // Sequence: Swap R1 <-> R2 (factor -1), scale R3 by k (factor k), add c*R1 to R3 (factor 1)
        const finalDet = -1 * k * d;

        const prompt = t(
          `Let $A$ be a $3 \\times 3$ matrix with $\\det(A) = ${d}$. Matrix $B$ is obtained from $A$ by applying three successive operations:
1. Swap row 1 and row 2 ($R_1 \\leftrightarrow R_2$)
2. Multiply row 3 by $${k}$ ($${k} R_3 \\to R_3$)
3. Add $${c}$ times row 1 to row 3 ($R_3 + ${c} R_1 \\to R_3$)

What is $\\det(B)$?`,
          `设 $A$ 为 $3 \\times 3$ 矩阵，且 $\\det(A) = ${d}$。矩阵 $B$ 是对 $A$ 依次实施下列三个变换得到的：
1. 交换第 1 行与第 2 行（$R_1 \\leftrightarrow R_2$）
2. 将第 3 行乘以 $${k}$（$${k} R_3 \\to R_3$）
3. 将第 1 行的 $${c}$ 倍加到第 3 行（$R_3 + ${c} R_1 \\to R_3$）

求 $\\det(B)$ 的值。`,
        );

        return numberProblem({
          prompt,
          answer: finalDet,
          solution: t(
            `Operation 1 (row swap) multiplies the determinant by $-1$. Operation 2 (scaling one row by $${k}$) multiplies the determinant by $${k}$. Operation 3 (adding a multiple of one row to another) leaves the determinant unchanged. Therefore, $\\det(B) = (-1) \\cdot (${k}) \\cdot (1) \\cdot \\det(A) = (${-k})(${d}) = ${finalDet}$.`,
            `变换 1（交换两行）使行列式乘以 $-1$。变换 2（将某一行乘以 $${k}$）使行列式乘以 $${k}$。变换 3（行倍加）不改变行列式的值。因此，$\\det(B) = (-1) \\cdot (${k}) \\cdot (1) \\cdot \\det(A) = (${-k})(${d}) = ${finalDet}$。`,
          ),
          wrong: [-finalDet, k * d, finalDet + c, k ** 3 * d],
        });
      },
    },
    {
      id: "the-effect-of-column-operations-on-a-determinant",
      title: t("The effect of column operations on a determinant", "列变换对行列式的影响"),
      explanation: t(
        "Since $\\det A^T = \\det A$, column operations affect the determinant exactly as row operations do. Adding a multiple of one column to another leaves it unchanged, swapping two columns changes its sign, and multiplying a column by $k$ multiplies it by $k$. Track only the swaps and the scalings.",
        "由于 $\\det A^T = \\det A$，列变换对行列式的影响与行变换完全相同。把一列的倍数加到另一列不改变行列式，交换两列改变符号，某列乘以 $k$ 使行列式乘以 $k$。只需记录交换与数乘。",
      ),
      generate(rng: Rng): Problem {
        const d = rng.nonZero(-6, 6);
        const c = rng.nonZero(-4, 4);
        const k = rng.pick([-3, -2, 2, 3, 4]);
        const swap = rng.int(0, 1) === 1;
        const ans = d * k * (swap ? -1 : 1);
        const ops = [
          t(`add $${c}$ times column $1$ to column $3$`, `把第 $1$ 列的 $${c}$ 倍加到第 $3$ 列`),
          t(`multiply column $2$ by $${k}$`, `把第 $2$ 列乘以 $${k}$`),
          ...(swap ? [t("swap columns $1$ and $3$", "交换第 $1$ 列与第 $3$ 列")] : []),
        ];
        return numberProblem({
          prompt: t(
            `$\\det A = ${d}$ for a $3 \\times 3$ matrix $A$. Matrix $B$ is obtained from $A$ as follows: ${ops.map((o) => o.en).join(", then ")}. Find $\\det B$.`,
            `$3 \\times 3$ 矩阵 $A$ 的 $\\det A = ${d}$。矩阵 $B$ 由 $A$ 依次如下得到：${ops.map((o) => o["zh-CN"]).join("，然后")}。求 $\\det B$。`,
          ),
          answer: ans,
          wrong: [-ans, d * k * c, d, d * (swap ? -1 : 1), d + k],
          solution: t(
            `The column replacement leaves the determinant at $${d}$, scaling column $2$ multiplies it by $${k}$${swap ? ", and the swap changes the sign" : ""}. So $\\det B = ${ans}$.`,
            `列的倍加不改变行列式，仍为 $${d}$；第 $2$ 列乘以 $${k}$ 使其乘以 $${k}$${swap ? "；交换改变符号" : ""}。所以 $\\det B = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.4.8 Conditions When a Determinant Equals Zero ──────────────────────────

/** conditionsWhenADeterminantEqualsZero covers singularity criteria for determinants. */
export const conditionsWhenADeterminantEqualsZero: TopicDef = {
  id: "conditions-when-a-determinant-equals-zero",
  title: t("Conditions When a Determinant Equals Zero", "行列式为零的判定条件"),
  summary: t(
    "Identify when det(A) = 0: zero rows, identical rows, or linearly dependent rows.",
    "判定行列式为零的条件：含有全零行/列、相同行/列，或行/列线性相关（成比例）。",
  ),
  prerequisites: ["row-and-column-operations-on-determinants"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "determinant-zero-conditions",
      title: t("Conditions for a zero determinant", "行列式为零的充分条件"),
      explanation: t(
        "A determinant $\\det(A) = 0$ if and only if $A$ is singular (not invertible). Common visual conditions include: (1) an entire row or column of zeros; (2) two identical rows or columns; (3) one row (or column) is a scalar multiple of another (proportional rows).",
        "行列式 $\\det(A) = 0$ 当且仅当 $A$ 为奇异矩阵（不可逆）。直观判定条件包括：(1) 某一行或列全为零；(2) 存在两行或两列完全相同；(3) 某一行（或列）是另一行（或列）的常数倍（即两行对应成比例）。",
      ),
      generate(rng) {
        const factor = rng.pick([2, 3, -2, -3]);
        const r1 = [rng.pick([1, 2, 3]), rng.pick([-2, -1, 1]), rng.pick([2, 3, 4])];
        const r2 = [r1[0]! * factor, r1[1]! * factor, r1[2]! * factor];
        const r3 = [rng.pick([1, 4]), rng.pick([2, 5]), rng.pick([3, 6])];

        const singularMat: Mat = [r1, r2, r3];

        // 3 non-singular invertible matrices
        const inv1: Mat = [
          [1, 0, 0],
          [2, 3, 0],
          [4, 5, 2],
        ];
        const inv2: Mat = [
          [2, 1, 0],
          [0, 3, 4],
          [0, 0, 1],
        ];
        const inv3: Mat = [
          [1, 0, 2],
          [0, 2, 1],
          [0, 0, 3],
        ];

        const prompt = t(
          `Without carrying out a full Laplace expansion, decide which of the following matrices has a determinant equal to $0$.`,
          `无需进行完整的拉普拉斯展开，判断下列哪个矩阵的行列式等于 $0$。`,
        );
        return reasoned(
          oneOf(
            rng,
            prompt,
            t(`$$${matLatex(singularMat)}$$`, `$$${matLatex(singularMat)}$$`),
            [
              t(`$$${matLatex(inv1)}$$`, `$$${matLatex(inv1)}$$`),
              t(`$$${matLatex(inv2)}$$`, `$$${matLatex(inv2)}$$`),
              t(`$$${matLatex(inv3)}$$`, `$$${matLatex(inv3)}$$`),
            ],
            t(
              `In the matrix $M = ${matLatex(singularMat)}$, row 2 is exactly $${factor}$ times row 1: $R_2 = ${factor} R_1$. When two rows of a square matrix are linearly dependent (proportional), subtracting $${factor} R_1$ from $R_2$ produces a row of zeros without changing the determinant. Hence $\\det(M) = 0$. The other three matrices are triangular with non-zero diagonals, so their determinants are non-zero.`,
              `在矩阵 $M = ${matLatex(singularMat)}$ 中，第 2 行恰好是第 1 行的 $${factor}$ 倍：$R_2 = ${factor} R_1$。当方阵的两行线性相关（成比例）时，将第 1 行的 $${factor}$ 倍从第 2 行减去后，将产生一个全零行且不改变行列式的值，因此 $\\det(M) = 0$。其余三个矩阵均为对角元非零的三角矩阵，行列式均不为零。`,
            ),
          ),
          [
            [
              `$$${matLatex(inv1)}$$`,
              "This matrix is triangular, so its determinant is the product of the diagonal, $1 \\cdot 3 \\cdot 2 = 6$.",
              "这是三角矩阵，行列式等于对角线之积 $1 \\cdot 3 \\cdot 2 = 6$。",
            ],
            [
              `$$${matLatex(inv2)}$$`,
              "This matrix is triangular, so its determinant is the product of the diagonal, $2 \\cdot 3 \\cdot 1 = 6$.",
              "这是三角矩阵，行列式等于对角线之积 $2 \\cdot 3 \\cdot 1 = 6$。",
            ],
            [
              `$$${matLatex(inv3)}$$`,
              "This matrix is triangular, so its determinant is the product of the diagonal, $1 \\cdot 2 \\cdot 3 = 6$.",
              "这是三角矩阵，行列式等于对角线之积 $1 \\cdot 2 \\cdot 3 = 6$。",
            ],
          ],
        );
      },
    },
    {
      id: "the-value-that-makes-one-row-a-sum-of-two-others",
      title: t("The value that makes one row the sum of two others", "使一行等于另两行之和的值"),
      explanation: t(
        "A determinant is zero when the rows are linearly dependent. If row $3$ equals row $1$ plus row $2$ in every entry but one, and that entry is the unknown $k$, then the determinant is a linear function of $k$ that vanishes exactly when row $3$ becomes the sum of the other two, provided rows $1$ and $2$ are independent. So $k$ is the sum of the corresponding entries of rows $1$ and $2$.",
        "当各行线性相关时行列式为零。若第 $3$ 行除一个元素外都等于第 $1$ 行与第 $2$ 行之和，而那个元素是未知数 $k$，则在第 $1$、$2$ 行线性无关时，行列式是 $k$ 的一次函数，恰在第 $3$ 行成为另两行之和时为零。所以 $k$ 等于第 $1$、$2$ 行对应元素之和。",
      ),
      generate(rng: Rng): Problem {
        let r1: number[] = [];
        let r2: number[] = [];
        const j = rng.int(0, 2);
        const others = [0, 1, 2].filter((x) => x !== j);
        while (true) {
          r1 = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
          r2 = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
          const minor = r1[others[0]!]! * r2[others[1]!]! - r1[others[1]!]! * r2[others[0]!]!;
          if (minor !== 0) break;
        }
        const ans = r1[j]! + r2[j]!;
        const r3 = [0, 1, 2].map((c) => (c === j ? "k" : String(r1[c]! + r2[c]!)));
        return numberProblem({
          prompt: t(`Find $k$ such that $\\det ${matLatex([r1, r2, r3])} = 0$.`, `求 $k$，使 $\\det ${matLatex([r1, r2, r3])} = 0$。`),
          answer: ans,
          solveFor: "k",
          wrong: [r1[j]! - r2[j]!, -ans, r1[j]!, 0],
          solution: t(
            `The other entries of row $3$ are the sums of rows $1$ and $2$. The determinant vanishes when row $3$ is exactly that sum, so $k = ${r1[j]} + ${paren(r2[j]!)} = ${ans}$.`,
            `第 $3$ 行的其他元素都是第 $1$、$2$ 行之和。当第 $3$ 行恰为该和时行列式为零，所以 $k = ${r1[j]} + ${paren(r2[j]!)} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.4.9 Finding Determinants Using Row and Column Operations ───────────────

/** findingDeterminantsUsingRowAndColumnOperations covers reducing matrices to triangular form. */
export const findingDeterminantsUsingRowAndColumnOperations: TopicDef = {
  id: "finding-determinants-using-row-and-column-operations",
  title: t("Finding Determinants Using Row and Column Operations", "化上三角法计算行列式"),
  summary: t(
    "Evaluate determinants by reducing matrices to upper triangular form using elementary row operations.",
    "通过初等行变换将矩阵化为上三角形式，进而高效计算行列式的值。",
  ),
  prerequisites: ["row-and-column-operations-on-determinants"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "determinant-via-row-reduction",
      title: t("Row reduction to upper triangular form", "化为上三角矩阵求行列式"),
      explanation: t(
        "Using elementary row operations, any square matrix can be reduced to an upper triangular matrix $U$. If $s$ row swaps were performed and no rows were scaled, $\\det(A) = (-1)^s \\det(U) = (-1)^s \\prod_{i=1}^n u_{ii}$, where $u_{ii}$ are the diagonal entries of $U$.",
        "通过初等行变换，任意方阵均可化为上三角矩阵 $U$。若整个消元过程中进行了 $s$ 次行交换且未对行进行数乘缩放，则 $\\det(A) = (-1)^s \\det(U) = (-1)^s \\prod_{i=1}^n u_{ii}$，其中 $u_{ii}$ 为 $U$ 的主对角线元素。",
      ),
      generate(rng) {
        const u11 = rng.pick([1, 2]);
        const u12 = rng.pick([-2, -1, 1, 3]);
        const u13 = rng.pick([-1, 2, 4]);
        const u22 = rng.pick([2, 3, -2]);
        const u23 = rng.pick([-3, 1, 2]);
        const u33 = rng.pick([2, 3, 4]);

        const l21 = rng.pick([1, 2, 3]);
        const l31 = rng.pick([-2, 1, 2]);
        const l32 = rng.pick([1, -1, 2]);

        // Construct A = L * U
        // Row 1: [u11, u12, u13]
        const r1 = [u11, u12, u13];
        // Row 2 = l21*r1 + [0, u22, u23]
        const r2 = [l21 * u11, l21 * u12 + u22, l21 * u13 + u23];
        // Row 3 = l31*r1 + l32*[0, u22, u23] + [0, 0, u33]
        const r3 = [l31 * u11, l31 * u12 + l32 * u22, l31 * u13 + l32 * u23 + u33];

        const A: Mat = [r1, r2, r3];
        const detA = u11 * u22 * u33;

        const prompt = t(
          `Calculate the determinant of the $3 \\times 3$ matrix $A$ by reducing it to upper triangular form:

$$A = ${matLatex(A)}$$`,
          `通过初等行变换将 $3 \\times 3$ 矩阵 $A$ 化为上三角形式，求其行列式：

$$A = ${matLatex(A)}$$`,
        );

        return numberProblem({
          prompt,
          answer: detA,
          solution: t(
            `Performing row operations $R_2 - (${l21}) R_1 \\to R_2$ and $R_3 - (${l31}) R_1 \\to R_3$, followed by $R_3 - (${l32}) R_2 \\to R_3$, reduces $A$ to the upper triangular matrix $U = \\begin{pmatrix} ${u11} & ${u12} & ${u13} \\\\ 0 & ${u22} & ${u23} \\\\ 0 & 0 & ${u33} \\end{pmatrix}$. Since row addition operations do not change the determinant, $\\det(A) = \\det(U) = (${u11})(${u22})(${u33}) = ${detA}$.`,
            `执行行变换 $R_2 - (${l21}) R_1 \\to R_2$ 和 $R_3 - (${l31}) R_1 \\to R_3$，随后执行 $R_3 - (${l32}) R_2 \\to R_3$，可将 $A$ 化为上三角矩阵 $U = \\begin{pmatrix} ${u11} & ${u12} & ${u13} \\\\ 0 & ${u22} & ${u23} \\\\ 0 & 0 & ${u33} \\end{pmatrix}$。由于行倍加变换不改变行列式的值，因此 $\\det(A) = \\det(U) = (${u11})(${u22})(${u33}) = ${detA}$。`,
          ),
          wrong: [-detA, detA + u11, detA - u22, u11 * u22 + u33],
        });
      },
    },
    {
      id: "a-determinant-by-elimination-without-swaps",
      title: t("A determinant by elimination without swaps", "无需换行的消元求行列式"),
      explanation: t(
        "Row replacements $R_i - mR_j \\to R_i$ do not change the determinant. If elimination reaches an upper triangular matrix $U$ using only replacements, then $\\det A = \\det U$, the product of the pivots on the diagonal. Swaps or scalings, if used, must be accounted for separately.",
        "行的倍加变换 $R_i - mR_j \\to R_i$ 不改变行列式。若只用倍加变换就把 $A$ 化为上三角矩阵 $U$，则 $\\det A = \\det U$，即对角线上主元之积。若用了交换或数乘，则须另外计入。",
      ),
      generate(rng: Rng): Problem {
        const l = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];
        const L = [
          [1, 0, 0],
          [l[0]!, 1, 0],
          [l[1]!, l[2]!, 1],
        ];
        const piv = [rng.nonZero(-3, 3), rng.nonZero(-3, 3), rng.nonZero(-3, 3)];
        const U = [
          [piv[0]!, rng.int(-3, 3), rng.int(-3, 3)],
          [0, piv[1]!, rng.int(-3, 3)],
          [0, 0, piv[2]!],
        ];
        const A = matMul(L, U);
        const ans = piv[0]! * piv[1]! * piv[2]!;
        return numberProblem({
          prompt: t(`Find $\\det A$ for $A = ${matLatex(A)}$.`, `求 $A = ${matLatex(A)}$ 的 $\\det A$。`),
          answer: ans,
          wrong: [-ans, piv[0]! + piv[1]! + piv[2]!, A[0]![0]! * A[1]![1]! * A[2]![2]!],
          solution: t(
            `Row replacements reduce $A$ to $U = ${matLatex(U)}$ without changing the determinant. So $\\det A = ${piv[0]} \\cdot ${paren(piv[1]!)} \\cdot ${paren(piv[2]!)} = ${ans}$.`,
            `用倍加变换把 $A$ 化为 $U = ${matLatex(U)}$，行列式不变。所以 $\\det A = ${piv[0]} \\cdot ${paren(piv[1]!)} \\cdot ${paren(piv[2]!)} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.4.10 Partitioned and Block Matrices ───────────────────────────────────

/** partitionedAndBlockMatrices covers determinants of block triangular matrices. */
export const partitionedAndBlockMatrices: TopicDef = {
  id: "partitioned-and-block-matrices",
  title: t("Partitioned and Block Matrices", "分块矩阵的行列式与乘法"),
  summary: t(
    "Compute determinants of block triangular matrices: det([A, B; 0, D]) = det(A)det(D).",
    "掌握分块（上/下）三角矩阵的行列式计算公式：det([A, B; 0, D]) = det(A)det(D)。",
  ),
  prerequisites: ["basic-properties-of-determinants"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "block-matrix-determinant",
      title: t("Determinant of block triangular matrices", "分块三角矩阵的行列式"),
      explanation: t(
        "For a block triangular matrix $M = \\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}$ or $M = \\begin{pmatrix} A & 0 \\\\ C & D \\end{pmatrix}$, where $A$ is $k \\times k$ and $D$ is $m \\times m$, the determinant is the product of the determinants of the diagonal blocks: $\\det(M) = \\det(A)\\det(D)$.",
        "对于分块三角矩阵 $M = \\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}$ 或 $M = \\begin{pmatrix} A & 0 \\\\ C & D \\end{pmatrix}$，其中 $A$ 为 $k \\times k$ 方阵，$D$ 为 $m \\times m$ 方阵，其行列式等于对角块行列式的乘积：$\\det(M) = \\det(A)\\det(D)$。",
      ),
      generate(rng) {
        const a1 = rng.pick([1, 2, 3]);
        const a2 = rng.pick([-2, 1, 2]);
        const a3 = rng.pick([-1, 0, 1]);
        const a4 = rng.pick([2, 3, 4]);
        const detA = a1 * a4 - a2 * a3;

        const d1 = rng.pick([1, 2, 3]);
        const d2 = rng.pick([-3, 1, 2]);
        const d3 = rng.pick([0, 1, 2]);
        const d4 = rng.pick([2, 3, 5]);
        const detD = d1 * d4 - d2 * d3;

        const b1 = rng.pick([-3, 4]);
        const b2 = rng.pick([2, -5]);
        const b3 = rng.pick([1, 3]);
        const b4 = rng.pick([-2, 6]);

        const M: Mat = [
          [a1, a2, b1, b2],
          [a3, a4, b3, b4],
          [0, 0, d1, d2],
          [0, 0, d3, d4],
        ];

        const ans = detA * detD;
        const prompt = t(
          `Compute the determinant of the $4 \\times 4$ block matrix $M$:

$$M = ${matLatex(M)}$$`,
          `计算下列 $4 \\times 4$ 分块矩阵 $M$ 的行列式：

$$M = ${matLatex(M)}$$`,
        );

        return numberProblem({
          prompt,
          answer: ans,
          solution: t(
            `The matrix $M$ is block upper triangular of the form $\\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}$ with $2 \\times 2$ blocks $A = \\begin{pmatrix} ${a1} & ${a2} \\\\ ${a3} & ${a4} \\end{pmatrix}$ and $D = \\begin{pmatrix} ${d1} & ${d2} \\\\ ${d3} & ${d4} \\end{pmatrix}$. By the block triangular determinant formula, $\\det(M) = \\det(A)\\det(D)$. Here $\\det(A) = (${a1})(${a4}) - (${a2})(${a3}) = ${detA}$ and $\\det(D) = (${d1})(${d4}) - (${d2})(${d3}) = ${detD}$. Thus $\\det(M) = (${detA})(${detD}) = ${ans}$.`,
            `矩阵 $M$ 是形如 $\\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}$ 的分块上三角矩阵，其中 $2 \\times 2$ 对角块分别为 $A = \\begin{pmatrix} ${a1} & ${a2} \\\\ ${a3} & ${a4} \\end{pmatrix}$ 和 $D = \\begin{pmatrix} ${d1} & ${d2} \\\\ ${d3} & ${d4} \\end{pmatrix}$。根据分块三角矩阵行列式公式，$\\det(M) = \\det(A)\\det(D)$。此处 $\\det(A) = (${a1})(${a4}) - (${a2})(${a3}) = ${detA}$，$\\det(D) = (${d1})(${d4}) - (${d2})(${d3}) = ${detD}$。因此 $\\det(M) = (${detA})(${detD}) = ${ans}$。`,
          ),
          wrong: [detA + detD, -ans, ans + detA, ans - detD],
        });
      },
    },
    {
      id: "inverting-a-block-unit-upper-triangular-matrix",
      title: t("Inverting a block unit upper triangular matrix", "求分块单位上三角矩阵的逆"),
      explanation: t(
        "Block matrices multiply like ordinary matrices, with blocks in place of entries. For $M = \\begin{pmatrix} I & B \\\\ 0 & I \\end{pmatrix}$ the product $\\begin{pmatrix} I & B \\\\ 0 & I \\end{pmatrix}\\begin{pmatrix} I & -B \\\\ 0 & I \\end{pmatrix} = \\begin{pmatrix} I & -B + B \\\\ 0 & I \\end{pmatrix} = I$, so\n\n$$M^{-1} = \\begin{pmatrix} I & -B \\\\ 0 & I \\end{pmatrix}.$$\n\nOnly the sign of the off-diagonal block changes.",
        "分块矩阵的乘法与普通矩阵相同，只是以块代替元素。对 $M = \\begin{pmatrix} I & B \\\\ 0 & I \\end{pmatrix}$，乘积 $\\begin{pmatrix} I & B \\\\ 0 & I \\end{pmatrix}\\begin{pmatrix} I & -B \\\\ 0 & I \\end{pmatrix} = \\begin{pmatrix} I & -B + B \\\\ 0 & I \\end{pmatrix} = I$，所以\n\n$$M^{-1} = \\begin{pmatrix} I & -B \\\\ 0 & I \\end{pmatrix}$$\n\n只有非对角块的符号改变。",
      ),
      generate(rng: Rng): Problem {
        const B = [
          [rng.int(-5, 5), rng.int(-5, 5)],
          [rng.int(-5, 5), rng.int(-5, 5)],
        ];
        const M = [
          [1, 0, B[0]![0]!, B[0]![1]!],
          [0, 1, B[1]![0]!, B[1]![1]!],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ];
        const i = rng.int(1, 2);
        const j = rng.int(3, 4);
        const ans = -B[i - 1]![j - 3]!;
        return numberProblem({
          prompt: t(
            `Find the $(${i}, ${j})$ entry of $M^{-1}$ for $M = ${matLatex(M)}$.`,
            `求 $M = ${matLatex(M)}$ 的逆矩阵 $M^{-1}$ 的 $(${i}, ${j})$ 元素。`,
          ),
          answer: ans,
          wrong: [-ans, B[j - 3]![i - 1]!, -B[j - 3]![i - 1]!, 0],
          solution: t(
            `$M = \\begin{pmatrix} I & B \\\\ 0 & I \\end{pmatrix}$ with $B = ${matLatex(B)}$, so $M^{-1} = \\begin{pmatrix} I & -B \\\\ 0 & I \\end{pmatrix}$ and the $(${i}, ${j})$ entry is $${ans}$.`,
            `$M = \\begin{pmatrix} I & B \\\\ 0 & I \\end{pmatrix}$，$B = ${matLatex(B)}$，所以 $M^{-1} = \\begin{pmatrix} I & -B \\\\ 0 & I \\end{pmatrix}$，其 $(${i}, ${j})$ 元素为 $${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── Module 2.5. Gaussian Elimination ────────────────────────────────────────

// ─── 2.5.1 Systems of Equations as Augmented Matrices ────────────────────────

/** systemsOfEquationsAsAugmentedMatrices introduces augmented matrix representation [A | b]. */
export const systemsOfEquationsAsAugmentedMatrices: TopicDef = {
  id: "systems-of-equations-as-augmented-matrices",
  title: t("Systems of Equations as Augmented Matrices", "增广矩阵的概念"),
  summary: t(
    "Represent linear systems as augmented matrices [A | b] and extract linear systems from them.",
    "将线性方程组表示为增广矩阵 [A | b]，并能从增广矩阵中还原线性方程组。",
  ),
  prerequisites: ["representing-3x3-systems-of-equations-using-a-matrix-product"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "augmented-matrix-representation",
      title: t("Augmented matrix of a linear system", "线性系统的增广矩阵表示"),
      explanation: t(
        "For a system of $m$ linear equations in $n$ variables $A\\mathbf{x} = \\mathbf{b}$, the augmented matrix $[A \\mid \\mathbf{b}]$ is formed by adjoining the column of constants $\\mathbf{b}$ to the coefficient matrix $A$. The resulting matrix has dimension $m \\times (n+1)$.",
        "对于包含 $n$ 个变量的 $m$ 个线性方程组 $A\\mathbf{x} = \\mathbf{b}$，增广矩阵 $[A \\mid \\mathbf{b}]$ 是由系数矩阵 $A$ 并在其右侧附加上常数列向量 $\\mathbf{b}$ 构成的，其维度为 $m \\times (n+1)$。",
      ),
      generate(rng) {
        const a1 = rng.pick([1, 2, 3]);
        const b1 = rng.pick([-3, -2, 1, 2]);
        const c1 = rng.pick([-1, 1, 4]);
        const d1 = rng.pick([5, 8, -4]);

        const a2 = rng.pick([2, -1, 4]);
        const b2 = rng.pick([1, 3, 5]);
        const c2 = rng.pick([-2, 0, 3]);
        const d2 = rng.pick([-1, 7, 11]);

        const a3 = rng.pick([-2, 1, 3]);
        const b3 = rng.pick([0, -2, 4]);
        const c3 = rng.pick([1, 2, 5]);
        const d3 = rng.pick([3, -6, 9]);

        const A: Mat = [
          [a1, b1, c1],
          [a2, b2, c2],
          [a3, b3, c3],
        ];
        const bVec = [d1, d2, d3];
        const correctAug = augLatex(A, bVec);

        const wrongAug1 = augLatex(
          [
            [a1, c1, b1],
            [a2, c2, b2],
            [a3, c3, b3],
          ],
          bVec,
        );
        const wrongAug2 = augLatex(A, [-d1, -d2, -d3]);
        const wrongAug3 = augLatex(
          [
            [a1, b1, c1],
            [a2, b2, c2],
            [0, 0, 0],
          ],
          bVec,
        );

        const prompt = t(
          `What is the augmented matrix $[A \\mid \\mathbf{b}]$ for the following system of linear equations?

$$\\begin{cases} ${formatLinear3(a1, b1, c1)} = ${d1} \\\\ ${formatLinear3(a2, b2, c2)} = ${d2} \\\\ ${formatLinear3(a3, b3, c3)} = ${d3} \\end{cases}$$`,
          `下列线性方程组对应的增广矩阵 $[A \\mid \\mathbf{b}]$ 是哪一个？

$$\\begin{cases} ${formatLinear3(a1, b1, c1)} = ${d1} \\\\ ${formatLinear3(a2, b2, c2)} = ${d2} \\\\ ${formatLinear3(a3, b3, c3)} = ${d3} \\end{cases}$$`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$$${correctAug}$$`, `$$${correctAug}$$`),
          [t(`$$${wrongAug1}$$`, `$$${wrongAug1}$$`), t(`$$${wrongAug2}$$`, `$$${wrongAug2}$$`), t(`$$${wrongAug3}$$`, `$$${wrongAug3}$$`)],
          t(
            `Each row of the augmented matrix corresponds to one linear equation, with entries listing the coefficients of $x, y, z$ followed by the constant on the right-hand side. Thus the augmented matrix is $$${correctAug}$$.`,
            `增广矩阵的每一行对应一个线性方程，其各列元素依次排列 $x, y, z$ 的系数，最右侧一列为等号右端的常数项。因此增广矩阵为 $$${correctAug}$$。`,
          ),
        );
      },
    },
    {
      id: "reading-an-equation-from-an-augmented-matrix",
      title: t("Reading an equation from an augmented matrix", "从增广矩阵读出方程"),
      explanation: t(
        "Each row of an augmented matrix $[A \\mid \\mathbf{b}]$ is one equation. The entries left of the bar are the coefficients of $x$, $y$ and $z$ in order, and the entry right of the bar is the constant on the right-hand side. A zero entry means that variable is missing from the equation.",
        "增广矩阵 $[A \\mid \\mathbf{b}]$ 的每一行是一个方程。竖线左边的元素依次是 $x$、$y$、$z$ 的系数，竖线右边的元素是等号右边的常数。某个元素为零表示该方程中不含那个变量。",
      ),
      generate(rng: Rng): Problem {
        const A: number[][] = [0, 1, 2].map(() => [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)]);
        const b = [rng.int(-9, 9), rng.int(-9, 9), rng.int(-9, 9)];
        const r = rng.int(0, 2);
        const row = A[r]!;
        if (!row.some((x) => x !== 0)) row[0] = 1;
        const eq = (c: readonly number[], rhs: number) =>
          t(`$${formatLinear3(c[0]!, c[1]!, c[2]!)} = ${rhs}$`, `$${formatLinear3(c[0]!, c[1]!, c[2]!)} = ${rhs}$`);
        return reasoned(
          oneOf(
            rng,
            t(
              `Which equation does row $${r + 1}$ of $${augLatex(A, b)}$ represent?`,
              `$${augLatex(A, b)}$ 的第 $${r + 1}$ 行表示哪个方程？`,
            ),
            eq(row, b[r]!),
            [eq([row[2]!, row[1]!, row[0]!], b[r]!), eq(row, -b[r]!), eq(A[(r + 1) % 3]!, b[r]!), eq([row[1]!, row[0]!, row[2]!], b[r]!)],
            t(
              `The coefficients of $x$, $y$, $z$ are $${row.join(", ")}$ and the constant is $${b[r]}$.`,
              `$x$、$y$、$z$ 的系数为 $${row.join(", ")}$，常数为 $${b[r]}$。`,
            ),
          ),
          [
            [
              eq([row[2]!, row[1]!, row[0]!], b[r]!).en,
              "The coefficients are in reverse order: the columns are $x$, $y$, $z$ from left to right.",
              "系数顺序反了：从左到右各列依次是 $x$、$y$、$z$。",
            ],
            [
              eq(row, -b[r]!).en,
              "The constant keeps its sign: it is not moved across the equals sign.",
              "常数的符号不变：它没有被移到等号另一边。",
            ],
            [
              eq(A[(r + 1) % 3]!, b[r]!).en,
              "These coefficients come from a different row than the constant.",
              "这些系数和常数不在同一行。",
            ],
            [
              eq([row[1]!, row[0]!, row[2]!], b[r]!).en,
              "The first two coefficients are exchanged: the first column belongs to $x$.",
              "前两个系数弄反了：第一列对应 $x$。",
            ],
          ],
        );
      },
    },
  ],
};

// ─── 2.5.2 Row Echelon Form ───────────────────────────────────────────────────

/** rowEchelonForm defines the criteria for Row Echelon Form (REF). */
export const rowEchelonForm: TopicDef = {
  id: "row-echelon-form",
  title: t("Row Echelon Form", "行阶梯形矩阵 (REF)"),
  summary: t(
    "Identify matrices in Row Echelon Form (REF): staircase pivots and zero rows at bottom.",
    "识别行阶梯形矩阵 (REF)：主元呈阶梯状递进，全零行位于矩阵底部。",
  ),
  prerequisites: ["systems-of-equations-as-augmented-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "identifying-row-echelon-form",
      title: t("Criteria for row echelon form", "行阶梯形矩阵的判定准则"),
      explanation: t(
        "A matrix is in Row Echelon Form (REF) if: (1) All zero rows are at the bottom; (2) In each non-zero row, the leading entry (first non-zero entry, called pivot) is strictly to the right of the leading entry of the row above it; (3) All entries in a column below a pivot are zero.",
        "矩阵处于行阶梯形 (REF) 当且仅当：(1) 所有全零行均位于矩阵的最底端；(2) 每个非零行的首个非零元（主元）严格位于上一行主元的右侧；(3) 主元所在列其下方所有元素均为零。",
      ),
      generate(rng) {
        const p1 = rng.pick([1, 2, 3, 4, 5]);
        const r12 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const r13 = rng.pick([-2, 0, 2, 4]);
        const r14 = rng.pick([1, 3, 5, 7]);
        const p2 = rng.pick([1, 4, -2]);
        const p3 = rng.pick([2, 5, 1]);

        const refMat: Mat = [
          [p1, r12, r13, r14],
          [0, p2, rng.pick([1, 4]), rng.pick([-2, 3])],
          [0, 0, p3, rng.pick([7, 1])],
        ];

        // Non-REF: zero row not at bottom
        const nonRef1: Mat = [
          [p1, 2, 1, 4],
          [0, 0, 0, 0],
          [0, p2, 3, 5],
        ];

        // Non-REF: pivot not to the right
        const nonRef2: Mat = [
          [0, p1, 2, 3],
          [p2, 1, 4, 0],
          [0, 0, p3, 2],
        ];

        // Non-REF: non-zero below pivot
        const nonRef3: Mat = [
          [p1, 2, 3, 1],
          [0, p2, 1, 4],
          [0, 3, p3, 5],
        ];

        const prompt = t(
          `Which of the following $3 \\times 4$ matrices with first row $[${p1}, ${r12}, ${r13}, ${r14}]$ is in **Row Echelon Form (REF)**?`,
          `下列首行为 $[${p1}, ${r12}, ${r13}, ${r14}]$ 的 $3 \\times 4$ 矩阵中，哪一个是**行阶梯形矩阵 (REF)**？`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$$${matLatex(refMat)}$$`, `$$${matLatex(refMat)}$$`),
          [
            t(`$$${matLatex(nonRef1)}$$`, `$$${matLatex(nonRef1)}$$`),
            t(`$$${matLatex(nonRef2)}$$`, `$$${matLatex(nonRef2)}$$`),
            t(`$$${matLatex(nonRef3)}$$`, `$$${matLatex(nonRef3)}$$`),
          ],
          t(
            `A matrix is in REF when: (1) all zero rows are at the bottom; (2) each leading entry is strictly to the right of the one above it; (3) all entries below a leading entry are zero. Only $$${matLatex(refMat)}$$ satisfies all three conditions.`,
            `矩阵处于行阶梯形 (REF) 的条件为：(1) 全零行位于最底端；(2) 每个非零行的首个非零元严格位于上一行主元的右方；(3) 主元下方的元素全为零。仅有 $$${matLatex(refMat)}$$ 同时满足这三个条件。`,
          ),
        );
      },
    },
    {
      id: "deciding-whether-a-matrix-is-in-row-echelon-form",
      title: t("Deciding whether a matrix is in row echelon form", "判断矩阵是否为行阶梯形"),
      explanation: t(
        "A matrix is in row echelon form when all zero rows are at the bottom and each leading entry (the first nonzero entry of a row) lies strictly to the right of the leading entry in the row above. The leading entries need not equal $1$, and the entries above them need not be zero. Checking the column of each leading entry row by row is enough.",
        "当所有零行都在底部，且每行的首元（该行第一个非零元素）严格位于上一行首元的右侧时，矩阵是行阶梯形。首元不必等于 $1$，首元上方的元素也不必为零。逐行检查各首元所在的列即可。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(0, 2);
        const lead = kind === 0 ? [0, rng.int(1, 2), 3] : kind === 1 ? [0, 2, rng.int(1, 2)] : [0, 4, rng.int(1, 3)];
        const M = lead.map((c) => [0, 1, 2, 3].map((j) => (c < 4 && j === c ? rng.nonZero(-4, 4) : c < 4 && j > c ? rng.int(-5, 5) : 0)));
        const yes = kind === 0;
        const [right, wrong] = yesNoText(yes);
        return oneOf(
          rng,
          t(`Is $${matLatex(M)}$ in row echelon form?`, `$${matLatex(M)}$ 是行阶梯形吗？`),
          right,
          [wrong],
          t(
            yes
              ? `The leading entries are in columns $${lead.map((c) => c + 1).join(", ")}$, moving strictly right, and there are no zero rows above nonzero rows.`
              : kind === 1
                ? `The leading entry of row $3$ is in column $${lead[2]! + 1}$, which is not to the right of row $2$'s leading entry in column $3$.`
                : "Row $2$ is a zero row lying above the nonzero row $3$.",
            yes
              ? `首元依次在第 $${lead.map((c) => c + 1).join(", ")}$ 列，严格向右，且没有零行位于非零行之上。`
              : kind === 1
                ? `第 $3$ 行的首元在第 $${lead[2]! + 1}$ 列，不在第 $2$ 行首元（第 $3$ 列）的右侧。`
                : "第 $2$ 行是零行，却位于非零的第 $3$ 行之上。",
          ),
        );
      },
    },
  ],
};

// ─── 2.5.3 Solving Systems of Equations Using Back Substitution ───────────────

/** solvingSystemsOfEquationsUsingBackSubstitution covers solving REF systems. */
export const solvingSystemsOfEquationsUsingBackSubstitution: TopicDef = {
  id: "solving-systems-of-equations-using-back-substitution",
  title: t("Solving Systems of Equations Using Back Substitution", "回代法求解行阶梯形方程组"),
  summary: t(
    "Solve triangular linear systems in REF starting from the bottom row using back substitution.",
    "通过回代法从最底行开始自底向上求解处于行阶梯形（上三角）的线性方程组。",
  ),
  prerequisites: ["row-echelon-form"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "back-substitution-algorithm",
      title: t("Back substitution for upper triangular systems", "上三角系统的回代法求解"),
      explanation: t(
        "When an augmented matrix is in upper triangular / REF form, solve the bottom equation for the last variable first, then substitute it into the row above to solve for the previous variable, continuing upward until all variables are found.",
        "当增广矩阵处于上三角或行阶梯形时，首先由最底部的方程直接求出最后一个未知数的值，然后将其代入上一行方程求解前一个未知数，依次自底向上回代，直至求出全部未知数。",
      ),
      generate(rng) {
        const z = rng.pick([-3, -2, -1, 1, 2, 3]);
        const y = rng.pick([-4, -2, 1, 2, 3]);
        const x = rng.pick([-3, -1, 1, 2, 4]);

        const u33 = rng.pick([1, 2, 3, -1]);
        const b3 = u33 * z;

        const u22 = rng.pick([1, 2, -2]);
        const u23 = rng.pick([-3, 1, 2]);
        const b2 = u22 * y + u23 * z;

        const u11 = rng.pick([1, 2]);
        const u12 = rng.pick([-2, 1, 3]);
        const u13 = rng.pick([1, -1, 2]);
        const b1 = u11 * x + u12 * y + u13 * z;

        const U: Mat = [
          [u11, u12, u13],
          [0, u22, u23],
          [0, 0, u33],
        ];
        const bVec = [b1, b2, b3];

        const prompt = t(
          `Use back substitution to solve the system represented by the upper triangular augmented matrix:

$$${augLatex(U, bVec)}$$`,
          `利用回代法求解下列上三角增广矩阵所表示的方程组：

$$${augLatex(U, bVec)}$$`,
        );

        return pointProblem({
          prompt,
          answer: [x, y, z],
          vars: ["x", "y", "z"],
          solution: t(
            `From row 3: $${formatLinearTerm(u33, "z", true)} = ${b3} \\implies z = ${z}$.
Substitute into row 2: $${formatLinearTerm(u22, "y", true)} + (${u23})(${z}) = ${b2} \\implies ${formatLinearTerm(u22, "y", true)} ${formatConst(u23 * z)} = ${b2} \\implies y = ${y}$.
Substitute into row 1: $${formatLinearTerm(u11, "x", true)} + (${u12})(${y}) + (${u13})(${z}) = ${b1} \\implies x = ${x}$.
Thus $(x, y, z) = (${x}, ${y}, ${z})$.`,
            `由第 3 行方程：$${formatLinearTerm(u33, "z", true)} = ${b3} \\implies z = ${z}$。
代入第 2 行方程：$${formatLinearTerm(u22, "y", true)} + (${u23})(${z}) = ${b2} \\implies ${formatLinearTerm(u22, "y", true)} ${formatConst(u23 * z)} = ${b2} \\implies y = ${y}$。
代入第 1 行方程：$${formatLinearTerm(u11, "x", true)} + (${u12})(${y}) + (${u13})(${z}) = ${b1} \\implies x = ${x}$。
因此 $(x, y, z) = (${x}, ${y}, ${z})$。`,
          ),
          wrong: [
            [x, y, -z],
            [y, x, z],
            [x + 1, y, z],
            [x, y + 1, z],
          ],
        });
      },
    },
    {
      id: "forward-substitution-in-a-lower-triangular-system",
      title: t("Forward substitution in a lower triangular system", "下三角方程组的前代法"),
      explanation: t(
        "A lower triangular system is solved from the top down. The first equation involves only $x_1$, the second only $x_1$ and $x_2$, and so on. Substituting each value as soon as it is found, the last unknown is\n\n$$x_3 = \\frac{b_3 - l_{31}x_1 - l_{32}x_2}{l_{33}}.$$",
        "下三角方程组自上而下求解。第一个方程只含 $x_1$，第二个只含 $x_1$ 与 $x_2$，依此类推。每求出一个值就立刻代入，最后一个未知数为\n\n$$x_3 = \\frac{b_3 - l_{31}x_1 - l_{32}x_2}{l_{33}}$$",
      ),
      generate(rng: Rng): Problem {
        const x = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
        const L = [
          [rng.nonZero(-3, 3), 0, 0],
          [rng.int(-3, 3), rng.nonZero(-3, 3), 0],
          [rng.int(-3, 3), rng.int(-3, 3), rng.nonZero(-3, 3)],
        ];
        const b = L.map((row) => row.reduce((s, v, k) => s + v * x[k]!, 0));
        return numberProblem({
          prompt: t(
            `Solve the system with augmented matrix $${augLatex(L, b)}$ and give $x_3$.`,
            `求解增广矩阵为 $${augLatex(L, b)}$ 的方程组，给出 $x_3$。`,
          ),
          answer: x[2]!,
          solveFor: "x_3",
          wrong: [x[0]!, x[1]!, Q.of(b[2]!, L[2]![2]!), -x[2]!],
          solution: t(
            `Row $1$: $x_1 = \\frac{${b[0]}}{${L[0]![0]}} = ${x[0]}$. Row $2$: $x_2 = \\frac{${b[1]} - ${paren(L[1]![0]!)} \\cdot ${paren(x[0]!)}}{${L[1]![1]}} = ${x[1]}$. Row $3$: $x_3 = \\frac{${b[2]} - ${paren(L[2]![0]!)} \\cdot ${paren(x[0]!)} - ${paren(L[2]![1]!)} \\cdot ${paren(x[1]!)}}{${L[2]![2]}} = ${x[2]}$.`,
            `第 $1$ 行：$x_1 = \\frac{${b[0]}}{${L[0]![0]}} = ${x[0]}$。第 $2$ 行：$x_2 = \\frac{${b[1]} - ${paren(L[1]![0]!)} \\cdot ${paren(x[0]!)}}{${L[1]![1]}} = ${x[1]}$。第 $3$ 行：$x_3 = \\frac{${b[2]} - ${paren(L[2]![0]!)} \\cdot ${paren(x[0]!)} - ${paren(L[2]![1]!)} \\cdot ${paren(x[1]!)}}{${L[2]![2]}} = ${x[2]}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.5.4 Elementary Row Operations ──────────────────────────────────────────

/** elementaryRowOperations covers row swaps, row scaling, and row addition. */
export const elementaryRowOperations: TopicDef = {
  id: "elementary-row-operations",
  title: t("Elementary Row Operations", "三种初等行变换"),
  summary: t(
    "Perform the three elementary row operations: row swapping, scaling, and row additions.",
    "熟练运用三种初等行变换：对调两行、数乘某行，以及某行的常数倍加到另一行。",
  ),
  prerequisites: ["row-echelon-form"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "three-elementary-row-operations",
      title: t("The three types of elementary row operations", "三种初等行变换的操作"),
      explanation: t(
        "There are three elementary row operations: (1) Row swap $R_i \\leftrightarrow R_j$; (2) Row scaling $k R_i \\to R_i$ ($k \\ne 0$); (3) Row addition $R_i + k R_j \\to R_i$. These operations do not change the solution set of the linear system.",
        "三种初等行变换分别为：(1) 对调两行：$R_i \\leftrightarrow R_j$；(2) 数乘某行：$k R_i \\to R_i$（$k \\ne 0$）；(3) 行倍加：$R_i + k R_j \\to R_i$。初等行变换不改变线性方程组的解集。",
      ),
      generate(rng) {
        const k = rng.pick([2, 3, -2, -3]);
        const r1 = [rng.pick([1, 2]), rng.pick([-2, 1]), rng.pick([3, 4])];
        const r2 = [rng.pick([3, 4]), rng.pick([2, 5]), rng.pick([-1, 0])];
        const r3 = [rng.pick([1, 0]), rng.pick([2, 3]), rng.pick([4, -2])];

        const A: Mat = [r1, r2, r3];
        // Operation: R2 - k * R1 -> R2
        const newR2 = [r2[0]! - k * r1[0]!, r2[1]! - k * r1[1]!, r2[2]! - k * r1[2]!];
        const correctMat: Mat = [r1, newR2, r3];

        // Distractor: R2 + k * R1 -> R2
        const wrongR2_1 = [r2[0]! + k * r1[0]!, r2[1]! + k * r1[1]!, r2[2]! + k * r1[2]!];
        const wrongMat1: Mat = [r1, wrongR2_1, r3];

        // Distractor: R1 - k * R2 -> R1
        const wrongR1 = [r1[0]! - k * r2[0]!, r1[1]! - k * r2[1]!, r1[2]! - k * r2[2]!];
        const wrongMat2: Mat = [wrongR1, r2, r3];

        // Distractor: Swapped rows
        const wrongMat3: Mat = [r2, r1, r3];

        const opStr = k > 0 ? `R_2 - ${k} R_1 \\to R_2` : `R_2 + ${-k} R_1 \\to R_2`;

        const prompt = t(
          `Apply the elementary row operation $${opStr}$ to the matrix:

$$A = ${matLatex(A)}$$`,
          `对矩阵实施初等行变换 $${opStr}$：

$$A = ${matLatex(A)}$$`,
        );
        return reasoned(
          oneOf(
            rng,
            prompt,
            t(`$$${matLatex(correctMat)}$$`, `$$${matLatex(correctMat)}$$`),
            [
              t(`$$${matLatex(wrongMat1)}$$`, `$$${matLatex(wrongMat1)}$$`),
              t(`$$${matLatex(wrongMat2)}$$`, `$$${matLatex(wrongMat2)}$$`),
              t(`$$${matLatex(wrongMat3)}$$`, `$$${matLatex(wrongMat3)}$$`),
            ],
            t(
              `The operation $${opStr}$ replaces row 2 by row 2 ${k > 0 ? "minus" : "plus"} $${Math.abs(k)}$ times row 1 entry by entry:
$[${r2.join(", ")}] - ${paren(k)}[${r1.join(", ")}] = [${newR2.join(", ")}]$. Rows 1 and 3 are unchanged.`,
              `变换 $${opStr}$ 将第 2 行替换为第 2 行${k > 0 ? "减去" : "加上"}第 1 行的 $${Math.abs(k)}$ 倍：
$[${r2.join(", ")}] - ${paren(k)}[${r1.join(", ")}] = [${newR2.join(", ")}]$。第 1 行与第 3 行保持不变。`,
            ),
          ),
          [
            [
              `$$${matLatex(wrongMat1)}$$`,
              "The sign is reversed: this adds where the operation subtracts, or subtracts where it adds.",
              "符号反了：运算要减的地方这里加了，或者要加的地方这里减了。",
            ],
            [
              `$$${matLatex(wrongMat2)}$$`,
              "This changes row 1, but the arrow says row 2 is the one replaced.",
              "这里改变的是第 1 行，但箭头表示被替换的是第 2 行。",
            ],
            [
              `$$${matLatex(wrongMat3)}$$`,
              "This swaps the two rows, which is a different elementary operation.",
              "这里交换了两行，那是另一种初等行变换。",
            ],
          ],
        );
      },
    },
    {
      id: "undoing-an-elementary-row-operation",
      title: t("Undoing an elementary row operation", "撤销初等行变换"),
      explanation: t(
        "Every elementary row operation can be undone by another operation of the same kind. A swap $R_i \\leftrightarrow R_j$ is undone by the same swap. A scaling $cR_i \\to R_i$ is undone by $\\frac{1}{c}R_i \\to R_i$. A replacement $R_i + kR_j \\to R_i$ is undone by $R_i - kR_j \\to R_i$. This is why row operations never change the solution set of a system.",
        "每个初等行变换都能用同类的另一个变换撤销。交换 $R_i \\leftrightarrow R_j$ 由同一交换撤销。数乘 $cR_i \\to R_i$ 由 $\\frac{1}{c}R_i \\to R_i$ 撤销。倍加 $R_i + kR_j \\to R_i$ 由 $R_i - kR_j \\to R_i$ 撤销。这就是行变换从不改变方程组解集的原因。",
      ),
      generate(rng: Rng): Problem {
        const i = rng.int(1, 4);
        const j = rng.pick([1, 2, 3, 4].filter((x) => x !== i));
        const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const kind = rng.int(0, 2);
        const o = (s: string) => t(`$${s}$`, `$${s}$`);
        const kl = (v: number) => (v < 0 ? `- ${-v}` : `+ ${v}`);
        const op = [`R_{${i}} \\leftrightarrow R_{${j}}`, `${k}R_{${i}} \\to R_{${i}}`, `R_{${i}} ${kl(k)}R_{${j}} \\to R_{${i}}`][kind]!;
        const inv = [
          `R_{${i}} \\leftrightarrow R_{${j}}`,
          `${Q.of(1, k).toLatex()}R_{${i}} \\to R_{${i}}`,
          `R_{${i}} ${kl(-k)}R_{${j}} \\to R_{${i}}`,
        ][kind]!;
        const wrong = [
          [`R_{${j}} ${kl(1)}R_{${i}} \\to R_{${j}}`, `-R_{${i}} \\to R_{${i}}`, `R_{${i}} ${kl(-1)}R_{${j}} \\to R_{${i}}`],
          [`${-k}R_{${i}} \\to R_{${i}}`, `R_{${i}} ${kl(-k)}R_{${j}} \\to R_{${i}}`, `${Q.of(1, k).toLatex()}R_{${j}} \\to R_{${j}}`],
          [
            `R_{${i}} ${kl(k)}R_{${j}} \\to R_{${i}}`,
            `R_{${j}} ${kl(-k)}R_{${i}} \\to R_{${j}}`,
            `${Q.of(1, k).toLatex()}R_{${i}} \\to R_{${i}}`,
          ],
        ][kind]!;
        return oneOf(
          rng,
          t(`Which row operation undoes $${op}$?`, `哪个行变换可以撤销 $${op}$？`),
          o(inv),
          wrong.map(o),
          t(
            [
              `A swap is its own inverse.`,
              `Scaling by $${k}$ is undone by scaling by $${Q.of(1, k).toLatex()}$.`,
              `Adding $${k}R_{${j}}$ is undone by subtracting it again.`,
            ][kind]!,
            [`交换的逆就是它本身。`, `乘以 $${k}$ 由乘以 $${Q.of(1, k).toLatex()}$ 撤销。`, `加上 $${k}R_{${j}}$ 由再减去它撤销。`][kind]!,
          ),
        );
      },
    },
  ],
};

// ─── 2.5.5 Creating Rows/Cols Containing Zeros ────────────────────────────────

/** creatingRowsOrColumnsContainingZerosUsingGaussianElimination covers pivot elimination. */
export const creatingRowsOrColumnsContainingZerosUsingGaussianElimination: TopicDef = {
  id: "creating-rows-or-columns-containing-zeros-using-gaussian-elimination",
  title: t("Creating Rows or Columns Containing Zeros Using Gaussian Elimination", "高斯消元法消元技巧"),
  summary: t(
    "Choose multipliers and row operations $R_i - \\frac{a_{ij}}{a_{pj}} R_p \\to R_i$ to introduce zeros.",
    "选取恰当的消元倍数，利用行变换 $R_i - \\frac{a_{ij}}{a_{pj}} R_p \\to R_i$ 制造零元。",
  ),
  prerequisites: ["elementary-row-operations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "clearing-entries-below-pivot",
      title: t("Eliminating entries beneath a pivot", "消去主元下方的元素"),
      explanation: t(
        "To eliminate entry $a_{ij}$ in row $i$ using pivot entry $a_{pj}$ in row $p$, apply the row operation $R_i - \\frac{a_{ij}}{a_{pj}} R_p \\to R_i$. The multiplier is $c = \\frac{a_{ij}}{a_{pj}}$.",
        "为了利用位于第 $p$ 行的主元 $a_{pj}$ 消去第 $i$ 行中的元素 $a_{ij}$，实施行变换 $R_i - \\frac{a_{ij}}{a_{pj}} R_p \\to R_i$。对应的乘子为 $c = \\frac{a_{ij}}{a_{pj}}$。",
      ),
      generate(rng) {
        const pivot = rng.pick([1, 2, 3]);
        const mult = rng.pick([2, 3, 4, 5, -2, -3]);
        const targetVal = pivot * mult;

        const r1 = [pivot, rng.pick([2, 3, -1]), rng.pick([4, 1])];
        const r2 = [targetVal, rng.pick([-2, 1, 5]), rng.pick([0, 3])];
        const r3 = [rng.pick([1, -2]), rng.pick([3, 4]), rng.pick([2, 6])];

        const A: Mat = [r1, r2, r3];

        const rightOp = mult > 0 ? `R_2 - ${mult} R_1 \\to R_2` : `R_2 + ${-mult} R_1 \\to R_2`;
        const wrongOp1 = mult > 0 ? `R_2 + ${mult} R_1 \\to R_2` : `R_2 - ${-mult} R_1 \\to R_2`;
        const wrongOp2 = mult > 0 ? `R_1 - ${mult} R_2 \\to R_1` : `R_1 + ${-mult} R_2 \\to R_1`;
        const wrongOp3 = `R_2 - \\frac{1}{${Math.abs(mult)}} R_1 \\to R_2`;

        const prompt = t(
          `In the matrix below, which elementary row operation eliminates the entry $a_{21} = ${targetVal}$ using the pivot in row 1 ($a_{11} = ${pivot}$)?

$$A = ${matLatex(A)}$$`,
          `在下列矩阵中，哪一个初等行变换能利用第 1 行的主元（$a_{11} = ${pivot}$）消去第 2 行首个元素 $a_{21} = ${targetVal}$？

$$A = ${matLatex(A)}$$`,
        );
        return reasoned(
          oneOf(
            rng,
            prompt,
            t(`$${rightOp}$`, `$${rightOp}$`),
            [t(`$${wrongOp1}$`, `$${wrongOp1}$`), t(`$${wrongOp2}$`, `$${wrongOp2}$`), t(`$${wrongOp3}$`, `$${wrongOp3}$`)],
            t(
              `The required multiplier is $c = \\frac{a_{21}}{a_{11}} = \\frac{${targetVal}}{${pivot}} = ${mult}$. Subtracting $${mult}$ times row 1 from row 2 gives $${targetVal} - (${mult})(${pivot}) = 0$, so the correct operation is $${rightOp}$.`,
              `所需的消元乘子为 $c = \\frac{a_{21}}{a_{11}} = \\frac{${targetVal}}{${pivot}} = ${mult}$。从第 2 行减去第 1 行的 $${mult}$ 倍即可得到 $${targetVal} - (${mult})(${pivot}) = 0$，故正确的行变换为 $${rightOp}$。`,
            ),
          ),
          [
            [
              `$${wrongOp1}$`,
              `The sign is wrong: this makes the entry $${2 * targetVal}$ instead of $0$.`,
              `符号错了：这样该元素变成 $${2 * targetVal}$，而不是 $0$。`,
            ],
            [
              `$${wrongOp2}$`,
              "This replaces row 1 and leaves row 2 as it was, so the entry in row 2 stays.",
              "这里替换的是第 1 行，第 2 行没有变，所以第 2 行的元素还在。",
            ],
            [`$${wrongOp3}$`, "The multiplier is upside down: it is the entry divided by the pivot.", "乘子颠倒了：应该是该元素除以主元。"],
          ],
        );
      },
    },
    {
      id: "the-multiplier-that-clears-an-entry-below-a-pivot",
      title: t("The multiplier that clears an entry below a pivot", "消去主元下方元素的乘数"),
      explanation: t(
        "To clear the entry $a_{i1}$ below the pivot $a_{11}$, use $R_i - mR_1 \\to R_i$ with $m = \\frac{a_{i1}}{a_{11}}$. The new entry is $a_{i1} - m\\,a_{11} = 0$. The multiplier can be a fraction or negative, and the same $m$ is applied to every entry of the row.",
        "要消去主元 $a_{11}$ 下方的元素 $a_{i1}$，用 $R_i - mR_1 \\to R_i$，其中 $m = \\frac{a_{i1}}{a_{11}}$。新元素为 $a_{i1} - m\\,a_{11} = 0$。乘数可以是分数或负数，且同一个 $m$ 作用于该行的每个元素。",
      ),
      generate(rng: Rng): Problem {
        const a11 = rng.pick([-4, -3, -2, 2, 3, 4, 5]);
        const A = [
          [a11, rng.int(-5, 5), rng.int(-5, 5)],
          [rng.int(-6, 6), rng.int(-5, 5), rng.int(-5, 5)],
          [rng.nonZero(-6, 6), rng.int(-5, 5), rng.int(-5, 5)],
        ];
        const a31 = A[2]![0]!;
        const m = Q.of(a31, a11);
        const a32 = Q.of(A[2]![1]!).sub(m.mul(Q.of(A[0]![1]!)));
        return numberProblem({
          prompt: t(
            `For $A = ${matLatex(A)}$, find $m$ so that $R_3 - mR_1 \\to R_3$ makes the $(3, 1)$ entry zero.`,
            `对 $A = ${matLatex(A)}$，求 $m$，使 $R_3 - mR_1 \\to R_3$ 把 $(3, 1)$ 元素变为零。`,
          ),
          answer: m,
          solveFor: "m",
          wrong: [Q.of(a11, a31), m.neg(), Q.of(a31 - a11)],
          solution: t(
            `$m = \\frac{a_{31}}{a_{11}} = \\frac{${a31}}{${a11}} = ${m.toLatex()}$. The new row $3$ then has $(3, 2)$ entry $${a32.toLatex()}$.`,
            `$m = \\frac{a_{31}}{a_{11}} = \\frac{${a31}}{${a11}} = ${m.toLatex()}$。此时新的第 $3$ 行 $(3, 2)$ 元素为 $${a32.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.5.6 Solving 2x2 Systems of Equations Using Gaussian Elimination ────────

/** solving2x2SystemsOfEquationsUsingGaussianElimination covers 2x2 forward and back sub. */
export const solving2x2SystemsOfEquationsUsingGaussianElimination: TopicDef = {
  id: "solving-2x2-systems-of-equations-using-gaussian-elimination",
  title: t("Solving 2x2 Systems of Equations Using Gaussian Elimination", "高斯消元法求解二元一次方程组"),
  summary: t(
    "Solve 2x2 linear systems by forward elimination to REF and back substitution.",
    "通过前向消元化为行阶梯形并利用回代法求解二元一次方程组。",
  ),
  prerequisites: ["elementary-row-operations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "gaussian-elimination-2x2",
      title: t("Gaussian elimination for 2x2 systems", "二元系统的高斯消元法"),
      explanation: t(
        "For a $2 \\times 2$ augmented matrix $[A \\mid \\mathbf{b}]$, Gaussian elimination uses the row operation $R_2 - \\frac{a_{21}}{a_{11}} R_1 \\to R_2$ to create a zero in position $(2, 1)$, producing an upper triangular system that is solved by back substitution.",
        "对于 $2 \\times 2$ 增广矩阵 $[A \\mid \\mathbf{b}]$，高斯消元法通过行变换 $R_2 - \\frac{a_{21}}{a_{11}} R_1 \\to R_2$ 在 $(2, 1)$ 位置产生零元，得到上三角系统，随后通过回代法求解未知数。",
      ),
      generate(rng) {
        const x = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const y = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const a11 = 1;
        const a12 = rng.pick([2, 3, -1, -2]);
        const m = rng.pick([2, 3, 4, -2]);
        const a21 = m * a11;
        const u22 = rng.pick([1, 2, 3, -1, -2]);
        const a22 = m * a12 + u22;

        const b1 = a11 * x + a12 * y;
        const b2 = a21 * x + a22 * y;

        const A: Mat = [
          [a11, a12],
          [a21, a22],
        ];
        const bVec = [b1, b2];

        const prompt = t(
          `Solve the system of equations using Gaussian elimination:

$$${augLatex(A, bVec)}$$`,
          `利用高斯消元法求解下列线性方程组：

$$${augLatex(A, bVec)}$$`,
        );

        return pointProblem({
          prompt,
          answer: [x, y],
          vars: ["x", "y"],
          solution: t(
            `Apply $R_2 - (${m}) R_1 \\to R_2$:
$$\\left[\\begin{array}{cc|c} 1 & ${a12} & ${b1} \\\\ 0 & ${u22} & ${u22 * y} \\end{array}\\right]$$
Back substitution: $${formatLinearTerm(u22, "y", true)} = ${u22 * y} \\implies y = ${y}$. Then $x + (${a12})(${y}) = ${b1} \\implies x = ${x}$. Thus $(x, y) = (${x}, ${y})$.`,
            `执行行变换 $R_2 - (${m}) R_1 \\to R_2$：
$$\\left[\\begin{array}{cc|c} 1 & ${a12} & ${b1} \\\\ 0 & ${u22} & ${u22 * y} \\end{array}\\right]$$
回代求解：$${formatLinearTerm(u22, "y", true)} = ${u22 * y} \\implies y = ${y}$。接着 $x + (${a12})(${y}) = ${b1} \\implies x = ${x}$。因此 $(x, y) = (${x}, ${y})$。`,
          ),
          wrong: [
            [y, x],
            [-x, y],
            [x, -y],
            [x + 1, y],
          ],
        });
      },
    },
    {
      id: "the-second-pivot-after-eliminating-a-2x2-system",
      title: t("The second pivot after eliminating a 2×2 system", "2×2 方程组消元后的第二个主元"),
      explanation: t(
        "Eliminating below the first pivot of $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ uses $R_2 - \\frac{c}{a}R_1 \\to R_2$. The second pivot is then\n\n$$d - \\frac{c}{a}\\,b = \\frac{ad - bc}{a}.$$\n\nThis shows the product of the pivots, $a \\cdot \\frac{ad - bc}{a}$, is the determinant, and the system has a unique solution exactly when the second pivot is nonzero.",
        "对 $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 消去第一个主元下方的元素，用 $R_2 - \\frac{c}{a}R_1 \\to R_2$。第二个主元为\n\n$$d - \\frac{c}{a}\\,b = \\frac{ad - bc}{a}$$\n\n由此可见两主元之积 $a \\cdot \\frac{ad - bc}{a}$ 就是行列式，且方程组有唯一解当且仅当第二个主元非零。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.pick([-3, -2, 2, 3, 4]);
        const b = rng.int(-5, 5);
        const c = rng.nonZero(-6, 6);
        const d = rng.int(-6, 6);
        const ans = Q.of(a * d - b * c, a);
        return numberProblem({
          prompt: t(
            `Gaussian elimination is applied to $\\begin{cases} ${formatLinear2(a, b)} = 1 \\\\ ${formatLinear2(c, d)} = 0 \\end{cases}$. Find the pivot in row $2$ after clearing the $x$-term below the first pivot.`,
            `对 $\\begin{cases} ${formatLinear2(a, b)} = 1 \\\\ ${formatLinear2(c, d)} = 0 \\end{cases}$ 作高斯消元。消去第一个主元下方的 $x$ 项后，求第 $2$ 行的主元。`,
          ),
          answer: ans,
          wrong: [Q.of(a * d - b * c), Q.of(a * d + b * c, a), Q.of(d * c - b * a, c), Q.of(d)],
          solution: t(
            `Use $R_2 - ${paren(Q.of(c, a))}R_1 \\to R_2$. The new $y$-coefficient is $${d} - ${paren(Q.of(c, a))} \\cdot ${paren(b)} = ${ans.toLatex()}$.`,
            `用 $R_2 - ${paren(Q.of(c, a))}R_1 \\to R_2$。新的 $y$ 系数为 $${d} - ${paren(Q.of(c, a))} \\cdot ${paren(b)} = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.5.7 Solving 2x2 Singular Systems of Equations ──────────────────────────

/** solving2x2SingularSystemsOfEquationsUsingGaussianElimination covers inconsistency/infinity. */
export const solving2x2SingularSystemsOfEquationsUsingGaussianElimination: TopicDef = {
  id: "solving-2x2-singular-systems-of-equations-using-gaussian-elimination",
  title: t("Solving 2x2 Singular Systems of Equations Using Gaussian Elimination", "高斯消元法处理二元奇异（无解/无穷解）系统"),
  summary: t(
    "Detect singular 2x2 systems: row [0 0 | 0] (infinitely many solutions) vs [0 0 | c] (no solution).",
    "判定二元奇异线性系统：出现 [0 0 | 0] 行表示有无穷多解，出现 [0 0 | c] 行（c ≠ 0）表示无解。",
  ),
  prerequisites: ["solving-2x2-systems-of-equations-using-gaussian-elimination"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "singular-2x2-systems",
      title: t("Inconsistent vs dependent singular 2x2 systems", "二元奇异系统的无解与无穷多解判定"),
      explanation: t(
        "When row reduction yields a second row with zero coefficients: (1) $[0 \\quad 0 \\mid 0]$ represents the identity $0 = 0$, meaning the equations are dependent and the system has infinitely many solutions; (2) $[0 \\quad 0 \\mid c]$ with $c \\ne 0$ represents the contradiction $0 = c$, so the system is inconsistent and has no solution.",
        "当行化简使第二行系数全为零时：(1) 若形如 $[0 \\quad 0 \\mid 0]$，对应恒等式 $0 = 0$，说明方程线性相关，系统有无穷多解；(2) 若形如 $[0 \\quad 0 \\mid c]$（其中 $c \\ne 0$），对应矛盾式 $0 = c$，说明系统矛盾，因而无解。",
      ),
      generate(rng) {
        const a1 = rng.pick([1, 2, 3]);
        const b1 = rng.pick([2, -3, 4, -1]);
        const c1 = rng.pick([3, 5, 7, -2]);
        const m = rng.pick([2, 3, -2]);

        const isDependent = rng.bool();
        const a2 = m * a1;
        const b2 = m * b1;
        const c2 = isDependent ? m * c1 : m * c1 + rng.pick([1, 2, -1]);

        const A: Mat = [
          [a1, b1],
          [a2, b2],
        ];
        const bVec = [c1, c2];

        const prompt = t(
          `Determine the number of solutions to the system of equations using Gaussian elimination:

$$${augLatex(A, bVec)}$$`,
          `利用高斯消元法判定下列方程组的解的情况：

$$${augLatex(A, bVec)}$$`,
        );

        const rightText = isDependent
          ? t("Infinitely many solutions", "有无穷多解")
          : t("Has no solution (inconsistent)", "无解（矛盾方程组）");

        const wrongTexts = isDependent
          ? [
              t("Has no solution (inconsistent)", "无解（矛盾方程组）"),
              t("A unique solution $(x, y) = (0, 0)$", "唯一解 $(x, y) = (0, 0)$"),
              t(`A unique solution $(x, y) = (${c1}, ${c2})$`, `唯一解 $(x, y) = (${c1}, ${c2})$`),
            ]
          : [
              t("Infinitely many solutions", "有无穷多解"),
              t("A unique solution $(x, y) = (0, 0)$", "唯一解 $(x, y) = (0, 0)$"),
              t(`A unique solution $(x, y) = (${c1}, ${c2})$`, `唯一解 $(x, y) = (${c1}, ${c2})$`),
            ];

        return oneOf(
          rng,
          prompt,
          rightText,
          wrongTexts,
          t(
            isDependent
              ? `Since the entire row is zero ($0 = 0$), the two equations are multiples of each other, giving infinitely many solutions.`
              : `Since $0x + 0y = ${c2 - m * c1} \\ne 0$ is a contradiction ($0 = ${c2 - m * c1}$), the system is inconsistent and has no solution.`,
            isDependent
              ? `由于整行为全零（对应 $0 = 0$），两方程成比例重合，故系统有无穷多解。`
              : `由于 $0x + 0y = ${c2 - m * c1} \\ne 0$ 产生矛盾（$0 = ${c2 - m * c1}$），故系统矛盾无解。`,
          ),
        );
      },
    },
    {
      id: "the-constant-that-makes-a-singular-system-consistent",
      title: t("The constant that makes a singular system consistent", "使奇异方程组相容的常数"),
      explanation: t(
        "When the second row of the coefficient matrix is $m$ times the first, elimination with $R_2 - mR_1 \\to R_2$ turns the second equation into $0 = k - me$. The system has infinitely many solutions if $k = me$ and no solution otherwise. So consistency depends only on the right-hand side.",
        "当系数矩阵的第二行是第一行的 $m$ 倍时，用 $R_2 - mR_1 \\to R_2$ 消元后第二个方程变为 $0 = k - me$。若 $k = me$ 则有无穷多解，否则无解。所以是否相容只取决于右端常数。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const m = rng.pick([-3, -2, 2, 3, 4]);
        const e = rng.nonZero(-6, 6);
        const ans = m * e;
        return numberProblem({
          prompt: t(
            `Find $k$ so that $\\begin{cases} ${formatLinear2(a, b)} = ${e} \\\\ ${formatLinear2(m * a, m * b)} = k \\end{cases}$ has infinitely many solutions.`,
            `求 $k$，使 $\\begin{cases} ${formatLinear2(a, b)} = ${e} \\\\ ${formatLinear2(m * a, m * b)} = k \\end{cases}$ 有无穷多解。`,
          ),
          answer: ans,
          solveFor: "k",
          wrong: [e, -ans, m + e, 0],
          solution: t(
            `Row $2$ of the coefficients is $${m}$ times row $1$. After $R_2 - ${paren(m)}R_1 \\to R_2$ the second equation is $0 = k - ${paren(m)} \\cdot ${paren(e)}$, so $k = ${ans}$.`,
            `系数的第 $2$ 行是第 $1$ 行的 $${m}$ 倍。经 $R_2 - ${paren(m)}R_1 \\to R_2$ 后第二个方程为 $0 = k - ${paren(m)} \\cdot ${paren(e)}$，所以 $k = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.5.8 Solving 3x3 Systems of Equations Using Gaussian Elimination ────────

/** solving3x3SystemsOfEquationsUsingGaussianElimination covers 3x3 elimination. */
export const solving3x3SystemsOfEquationsUsingGaussianElimination: TopicDef = {
  id: "solving-3x3-systems-of-equations-using-gaussian-elimination",
  title: t("Solving 3x3 Systems of Equations Using Gaussian Elimination", "高斯消元法求解三元一次方程组"),
  summary: t(
    "Execute full Gaussian elimination on a 3x3 system to obtain REF, then solve by back substitution.",
    "对三元一次方程组执行完整的高斯消元法得到行阶梯形，并通过回代求解未知数。",
  ),
  prerequisites: ["solving-2x2-systems-of-equations-using-gaussian-elimination"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "gaussian-elimination-3x3",
      title: t("Forward elimination and back substitution for 3x3 systems", "三元系统的前向消元与回代求解"),
      explanation: t(
        "To solve $A\\mathbf{x} = \\mathbf{b}$ for $3 \\times 3$: (1) Use row 1 pivot to clear entries in column 1 of rows 2 and 3; (2) Use row 2 pivot to clear entry in column 2 of row 3, achieving REF; (3) Solve for $z, y, x$ by back substitution.",
        "求解 $3 \\times 3$ 系统 $A\\mathbf{x} = \\mathbf{b}$：(1) 利用第 1 行主元消去第 2、3 行第 1 列元素；(2) 利用第 2 行主元消去第 3 行第 2 列元素，得到行阶梯形 REF；(3) 依次回代求出 $z, y, x$。",
      ),
      generate(rng) {
        const x = rng.pick([-2, -1, 1, 2]);
        const y = rng.pick([-3, -1, 2, 3]);
        const z = rng.pick([-2, 1, 2, 3]);

        // Upper triangular REF entries
        const u11 = 1;
        const u12 = rng.pick([1, 2, -1]);
        const u13 = rng.pick([-2, 1, 2]);

        const u22 = 1;
        const u23 = rng.pick([2, -1, 3]);

        const u33 = rng.pick([1, 2, -1]);

        // Build A with simple multipliers m21, m31, m32
        const m21 = rng.pick([2, 3]);
        const m31 = rng.pick([1, -1]);
        const m32 = rng.pick([2, 1]);

        const r1 = [u11, u12, u13];
        const r2 = [m21 * u11, m21 * u12 + u22, m21 * u13 + u23];
        const r3 = [m31 * u11, m31 * u12 + m32 * u22, m31 * u13 + m32 * u23 + u33];

        const A: Mat = [r1, r2, r3];
        const bVec = [r1[0]! * x + r1[1]! * y + r1[2]! * z, r2[0]! * x + r2[1]! * y + r2[2]! * z, r3[0]! * x + r3[1]! * y + r3[2]! * z];

        const prompt = t(
          `Solve the $3 \\times 3$ system of equations using Gaussian elimination:

$$${augLatex(A, bVec)}$$`,
          `利用高斯消元法求解下列三元一次方程组：

$$${augLatex(A, bVec)}$$`,
        );

        return pointProblem({
          prompt,
          answer: [x, y, z],
          vars: ["x", "y", "z"],
          solution: t(
            `Performing forward elimination clears column 1 with $R_2 - (${m21}) R_1 \\to R_2$ and $R_3 - (${m31}) R_1 \\to R_3$, then clears column 2 with $R_3 - (${m32}) R_2 \\to R_3$. Back substitution gives $z = ${z}$, then $y = ${y}$, then $x = ${x}$. Thus $(x, y, z) = (${x}, ${y}, ${z})$.`,
            `前向消元：执行 $R_2 - (${m21}) R_1 \\to R_2$ 与 $R_3 - (${m31}) R_1 \\to R_3$ 消去第 1 列，随后执行 $R_3 - (${m32}) R_2 \\to R_3$ 消去第 2 列得到上三角矩阵。回代求解依次得到 $z = ${z}$，$y = ${y}$，$x = ${x}$。因此 $(x, y, z) = (${x}, ${y}, ${z})$。`,
          ),
          wrong: [
            [y, x, z],
            [x, -y, z],
            [x, y, -z],
            [x + 1, y, z],
          ],
        });
      },
    },
    {
      id: "finding-one-unknown-of-a-3x3-system-by-elimination",
      title: t("Finding one unknown of a 3×3 system by elimination", "用消元法求 3×3 方程组的一个未知数"),
      explanation: t(
        "Gaussian elimination brings $[A \\mid \\mathbf{b}]$ to upper triangular form, after which the last row gives $z$ directly. To find $z$ alone, eliminate $x$ from rows $2$ and $3$, then eliminate $y$ from row $3$; the remaining equation $u_{33}z = c_3$ gives $z = \\frac{c_3}{u_{33}}$. A check by substituting into one original equation catches arithmetic slips.",
        "高斯消元把 $[A \\mid \\mathbf{b}]$ 化为上三角形后，最后一行直接给出 $z$。只求 $z$ 时，先从第 $2$、$3$ 行消去 $x$，再从第 $3$ 行消去 $y$，剩下的方程 $u_{33}z = c_3$ 给出 $z = \\frac{c_3}{u_{33}}$。代回一个原方程检验可以发现计算错误。",
      ),
      generate(rng: Rng): Problem {
        const sol = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
        const l = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];
        const L = [
          [1, 0, 0],
          [l[0]!, 1, 0],
          [l[1]!, l[2]!, 1],
        ];
        const U = [
          [rng.pick([1, -1, 2]), rng.int(-3, 3), rng.int(-3, 3)],
          [0, rng.pick([1, -1, 2, -2]), rng.int(-3, 3)],
          [0, 0, rng.pick([1, -1, 2, 3])],
        ];
        const A = matMul(L, U);
        const b = A.map((row) => row.reduce((s, v, k) => s + v * sol[k]!, 0));
        const c = U.map((row) => row.reduce((s, v, k) => s + v * sol[k]!, 0));
        return numberProblem({
          prompt: t(`Solve $${augLatex(A, b)}$ and give $z$.`, `求解 $${augLatex(A, b)}$，给出 $z$。`),
          answer: sol[2]!,
          solveFor: "z",
          wrong: [sol[0]!, sol[1]!, -sol[2]!, Q.of(b[2]!, A[2]![2]! || 1)],
          solution: t(
            `Elimination gives $${augLatex(U, c)}$. The last row is $${formatLinearTerm(U[2]![2]!, "z", true)} = ${c[2]}$, so $z = ${sol[2]}$.`,
            `消元得 $${augLatex(U, c)}$。最后一行为 $${formatLinearTerm(U[2]![2]!, "z", true)} = ${c[2]}$，所以 $z = ${sol[2]}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.5.9 Identifying the Pivot Columns of a Matrix ──────────────────────────

/** identifyingThePivotColumnsOfAMatrix covers pivot vs free columns in REF. */
export const identifyingThePivotColumnsOfAMatrix: TopicDef = {
  id: "identifying-the-pivot-columns-of-a-matrix",
  title: t("Identifying the Pivot Columns of a Matrix", "确定矩阵的主元列与自由变量"),
  summary: t(
    "Identify pivot columns (basic variables) and non-pivot columns (free variables) from REF.",
    "根据行阶梯形矩阵确定主元列（对应基本变量）和非主元列（对应自由变量）。",
  ),
  prerequisites: ["row-echelon-form"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "pivot-and-free-columns",
      title: t("Pivot columns and free variables", "主元列与自由变量的判定"),
      explanation: t(
        "A column of a matrix that contains a leading entry (pivot) in row echelon form is a pivot column, and its variable is a basic variable. Columns that do not contain a pivot correspond to free variables, which can take any value in the solution set.",
        "在行阶梯形矩阵中，包含首非零元（主元）的列称为主元列，对应的未知数称为基本变量；不包含主元的列对应自由变量，在解集中可以任意取值。",
      ),
      generate(rng) {
        const rows = rng.pick([3, 4]);
        const cols = rows === 3 ? rng.pick([4, 5]) : rng.pick([5, 6]);
        const numPivots = rng.pick(rows === 3 ? [1, 2, 3] : [1, 2, 3, 4]);

        const pivotCols: number[] = [];
        let minCol = 0;
        for (let i = 0; i < numPivots; i++) {
          const remainingPivots = numPivots - 1 - i;
          const maxCol = cols - 1 - remainingPivots;
          const choices: number[] = [];
          for (let c = minCol; c <= maxCol; c++) {
            choices.push(c);
          }
          const chosen = rng.pick(choices);
          pivotCols.push(chosen);
          minCol = chosen + 1;
        }

        const M: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
        for (let i = 0; i < rows; i++) {
          if (i < numPivots) {
            const pCol = pivotCols[i]!;
            M[i]![pCol] = rng.pick([1, 2, 3, 4, 5]);
            for (let j = pCol + 1; j < cols; j++) {
              M[i]![j] = rng.pick([-4, -3, -2, -1, 0, 1, 2, 3, 4, 5]);
            }
          }
        }

        const prompt = t(
          `Matrix $A$ is in Row Echelon Form:

$$A = ${matLatex(M)}$$

How many pivots does matrix $A$ have?`,
          `矩阵 $A$ 处于行阶梯形：

$$A = ${matLatex(M)}$$

矩阵 $A$ 共有多少个主元（主元列）？`,
        );

        const pivotColNamesEn = pivotCols.map((c) => `column ${c + 1}`).join(", ");
        const pivotColNamesZh = pivotCols.map((c) => `第 ${c + 1} 列`).join("、");
        const zeroRowsNoteEn = numPivots < rows ? ` The remaining row(s) are all zeros.` : "";
        const zeroRowsNoteZh = numPivots < rows ? ` 其余行均为全零行。` : "";

        return numberProblem({
          prompt,
          answer: numPivots,
          solution: t(
            `In row echelon form, each non-zero row contains exactly one pivot (its first non-zero entry). Here, the pivots are in ${pivotColNamesEn}.${zeroRowsNoteEn} Therefore, matrix $A$ has exactly $${numPivots}$ pivots.`,
            `在行阶梯形矩阵中，每个非零行恰好包含一个主元（首非零元）。此处各行主元分别位于 ${pivotColNamesZh}。${zeroRowsNoteZh}因此矩阵 $A$ 共有 $${numPivots}$ 个主元。`,
          ),
          wrong: [numPivots + 1, numPivots - 1, rows, cols].filter((w) => w >= 0 && w !== numPivots),
        });
      },
    },
    {
      id: "naming-the-pivot-columns-of-an-echelon-matrix",
      title: t("Naming the pivot columns of an echelon matrix", "指出阶梯形矩阵的主元列"),
      explanation: t(
        "In row echelon form the pivot of each nonzero row is its leading entry, and a pivot column is a column that contains a pivot. Read each nonzero row from the left and record the column of its first nonzero entry. Columns without a pivot correspond to free variables.",
        "在行阶梯形中，每个非零行的主元就是其首元，含有主元的列称为主元列。从左向右读每个非零行，记下第一个非零元素所在的列。没有主元的列对应自由变量。",
      ),
      generate(rng: Rng): Problem {
        const n = 5;
        const k = rng.int(2, 3);
        const cols = rng
          .shuffle([0, 1, 2, 3, 4])
          .slice(0, k)
          .sort((x, y) => x - y);
        const M = [0, 1, 2].map((r) =>
          Array.from({ length: n }, (_, j) => (r < k && j === cols[r] ? rng.nonZero(-4, 4) : r < k && j > cols[r]! ? rng.int(-4, 4) : 0)),
        );
        const label = (c: readonly number[]) =>
          t(`Columns $${c.map((x) => x + 1).join(", ")}$`, `第 $${c.map((x) => x + 1).join(", ")}$ 列`);
        const nonPivot = [0, 1, 2, 3, 4].filter((x) => !cols.includes(x));
        return reasoned(
          oneOf(
            rng,
            t(`Which columns of $${matLatex(M)}$ are pivot columns?`, `$${matLatex(M)}$ 的哪些列是主元列？`),
            label(cols),
            [
              label(nonPivot.slice(0, k)),
              label([0, 1, 2].slice(0, k)),
              label(cols.map((c) => Math.min(c + 1, 4))),
              label([...cols, nonPivot[0]!].sort((x, y) => x - y)),
            ],
            t(
              `The leading entries of the nonzero rows are in columns $${cols.map((x) => x + 1).join(", ")}$.`,
              `各非零行的首元位于第 $${cols.map((x) => x + 1).join(", ")}$ 列。`,
            ),
          ),
          [
            [label(nonPivot.slice(0, k)).en, "These columns hold no leading entry of a nonzero row.", "这些列不含非零行的首元。"],
            [
              label([0, 1, 2].slice(0, k)).en,
              "Pivot columns are found from the leading entries, not by taking the first columns.",
              "主元列要看首元的位置，不是取最前面几列。",
            ],
            [
              label(cols.map((c) => Math.min(c + 1, 4))).en,
              "Not every one of these holds a leading entry: find the first nonzero entry of each nonzero row.",
              "这些列不都含首元：要找每个非零行的第一个非零元素。",
            ],
            [
              label([...cols, nonPivot[0]!].sort((x, y) => x - y)).en,
              `There are only $${k}$ nonzero rows, so there are $${k}$ pivot columns.`,
              `非零行只有 $${k}$ 行，所以主元列只有 $${k}$ 列。`,
            ],
          ],
        );
      },
    },
  ],
};

// ─── 2.5.10 Solving 3x3 Singular Systems of Equations ─────────────────────────

/** solving3x3SingularSystemsOfEquationsUsingGaussianElimination covers parametric form. */
export const solving3x3SingularSystemsOfEquationsUsingGaussianElimination: TopicDef = {
  id: "solving-3x3-singular-systems-of-equations-using-gaussian-elimination",
  title: t("Solving 3x3 Singular Systems of Equations Using Gaussian Elimination", "三元奇异方程组的解（参数形式）"),
  summary: t(
    "Express general solutions of singular consistent $3 \\times 3$ systems in parametric vector form $\\mathbf{x} = \\mathbf{x}_p + t\\mathbf{v}$.",
    "将有无穷多解的 $3 \\times 3$ 奇异相容方程组表示为参数向量形式 $\\mathbf{x} = \\mathbf{x}_p + t\\mathbf{v}$。",
  ),
  prerequisites: ["solving-3x3-systems-of-equations-using-gaussian-elimination", "identifying-the-pivot-columns-of-a-matrix"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "parametric-vector-form-3x3",
      title: t("Parametric vector solution of consistent singular systems", "相容奇异系统的参数向量解"),
      explanation: t(
        "When an augmented matrix of a consistent $3 \\times 3$ system has rank 2, row 3 is all zeros $[0 \\quad 0 \\quad 0 \\mid 0]$. With $z = t$ as the free variable, expressing basic variables $x$ and $y$ in terms of $t$ gives the parametric vector form: $\\mathbf{x} = \\mathbf{x}_p + t \\mathbf{v}$.",
        "当相容的三元线性方程组增广矩阵秩为 2 时，第 3 行全为零 $[0 \\quad 0 \\quad 0 \\mid 0]$。取自由变量 $z = t$，通过回代将基本变量 $x$ 和 $y$ 用 $t$ 表示，即可得到解的参数向量形式：$\\mathbf{x} = \\mathbf{x}_p + t \\mathbf{v}$。",
      ),
      generate(rng) {
        // Upper triangular REF with rank 2:
        // Row 1: x + u12*y + u13*z = b1
        // Row 2: y + u23*z = b2
        // Row 3: 0 = 0
        const u12 = rng.pick([1, -1, 2]);
        const u13 = rng.pick([-2, 1, 3]);
        const u23 = rng.pick([2, -1, -2]);

        const y0 = rng.pick([1, 2, -2, 3]);
        const x0 = rng.pick([2, -1, 3, -3]);

        const b2 = y0;
        const b1 = x0 + u12 * y0;

        // z = t
        // y = b2 - u23*t = y0 - u23*t
        // x = b1 - u12*y - u13*t = b1 - u12(y0 - u23*t) - u13*t = x0 + (u12*u23 - u13)*t
        const vx = u12 * u23 - u13;
        const vy = -u23;
        const vz = 1;

        const U: Mat = [
          [1, u12, u13],
          [0, 1, u23],
          [0, 0, 0],
        ];
        const bVec = [b1, b2, 0];

        const vyStr = formatLinearTerm(vy, "t");
        const vxStr = formatLinearTerm(vx, "t");
        const prompt = t(
          `Find the parametric vector form of the solution $\\mathbf{x} = \\mathbf{x}_p + t\\mathbf{v}$ for the system with free parameter $z = t$:

$$${augLatex(U, bVec)}$$`,
          `设自由参数 $z = t$，求下列线性方程组解的参数向量形式 $\\mathbf{x} = \\mathbf{x}_p + t\\mathbf{v}$：

$$${augLatex(U, bVec)}$$`,
        );

        const _xp = [x0, y0, 0];
        const _v = [vx, vy, vz];

        const rightStr = `\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} ${x0} \\\\ ${y0} \\\\ 0 \\end{pmatrix} + t \\begin{pmatrix} ${vx} \\\\ ${vy} \\\\ 1 \\end{pmatrix}`;
        const wrong1Str = `\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} ${x0} \\\\ ${y0} \\\\ 0 \\end{pmatrix} + t \\begin{pmatrix} ${-vx} \\\\ ${vy} \\\\ 1 \\end{pmatrix}`;
        const wrong2Str = `\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} ${-x0} \\\\ ${y0} \\\\ 0 \\end{pmatrix} + t \\begin{pmatrix} ${vx} \\\\ ${vy} \\\\ 1 \\end{pmatrix}`;
        const wrong3Str = `\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} ${b1} \\\\ ${b2} \\\\ 0 \\end{pmatrix} + t \\begin{pmatrix} ${u13} \\\\ ${u23} \\\\ 1 \\end{pmatrix}`;

        return oneOf(
          rng,
          prompt,
          t(`$$${rightStr}$$`, `$$${rightStr}$$`),
          [t(`$$${wrong1Str}$$`, `$$${wrong1Str}$$`), t(`$$${wrong2Str}$$`, `$$${wrong2Str}$$`), t(`$$${wrong3Str}$$`, `$$${wrong3Str}$$`)],
          t(
            `With free variable $z = t$, row 2 gives $y + (${u23})t = ${b2} \\implies y = ${y0} ${vyStr}$.
Substituting into row 1 gives $x + (${u12})(${poly([y0, ""], [-u23, "t"])}) + (${u13})t = ${b1} \\implies x = ${x0} ${vxStr}$.
Writing in vector form gives $$${rightStr}$$.`,
            `设自由变量 $z = t$，由第 2 行得 $y + (${u23})t = ${b2} \\implies y = ${y0} ${vyStr}$。
代入第 1 行得 $x + (${u12})(${poly([y0, ""], [-u23, "t"])}) + (${u13})t = ${b1} \\implies x = ${x0} ${vxStr}$。
整理成向量形式即为 $$${rightStr}$$。`,
          ),
        );
      },
    },
    {
      id: "counting-solutions-from-an-echelon-form-with-a-zero-row",
      title: t("Counting solutions from an echelon form with a zero row", "由含零行的阶梯形判断解的个数"),
      explanation: t(
        "If elimination on a $3 \\times 3$ system produces a row $[0\\ 0\\ 0 \\mid f]$, the system is singular. When $f \\ne 0$ that row says $0 = f$, so there is no solution. When $f = 0$ the row carries no information, one variable is free, and there are infinitely many solutions. A singular square system never has exactly one solution.",
        "若对 $3 \\times 3$ 方程组消元得到一行 $[0\\ 0\\ 0 \\mid f]$，则方程组是奇异的。当 $f \\ne 0$ 时该行表示 $0 = f$，无解。当 $f = 0$ 时该行不提供信息，有一个自由变量，解有无穷多个。奇异方阵方程组绝不会恰有一个解。",
      ),
      generate(rng: Rng): Problem {
        const U = [
          [1, rng.int(-4, 4), rng.int(-4, 4)],
          [0, rng.nonZero(-3, 3), rng.int(-4, 4)],
          [0, 0, 0],
        ];
        const f = rng.pick([0, 0, rng.nonZero(-5, 5)]);
        const c = [rng.int(-6, 6), rng.int(-6, 6), f];
        const none = t("No solution", "无解");
        const inf = t("Infinitely many solutions", "无穷多解");
        const one = t("Exactly one solution", "恰有一个解");
        const two = t("Exactly two solutions", "恰有两个解");
        return reasoned(
          oneOf(
            rng,
            t(
              `Elimination of a system gives $${augLatex(U, c)}$. How many solutions does the system have?`,
              `某方程组消元后得 $${augLatex(U, c)}$。该方程组有几个解？`,
            ),
            f === 0 ? inf : none,
            [f === 0 ? none : inf, one, two],
            t(
              f === 0
                ? "The last row reads $0 = 0$, so $z$ is free and there are infinitely many solutions."
                : `The last row reads $0 = ${f}$, which is impossible, so there is no solution.`,
              f === 0 ? "最后一行为 $0 = 0$，所以 $z$ 是自由变量，有无穷多解。" : `最后一行为 $0 = ${f}$，不可能成立，所以无解。`,
            ),
          ),
          [
            [
              (f === 0 ? none : inf).en,
              f === 0
                ? "The last row reads $0 = 0$, which is no contradiction, so a solution exists."
                : `The last row reads $0 = ${f}$, and no choice of variables makes that true.`,
              f === 0 ? "最后一行是 $0 = 0$，并不矛盾，所以解存在。" : `最后一行是 $0 = ${f}$，变量取什么值都不能使它成立。`,
            ],
            [
              "Exactly one solution",
              f === 0
                ? "The zero row leaves $z$ free, and each value of $z$ gives a different solution."
                : `The last row reads $0 = ${f}$, so there is no solution at all.`,
              f === 0 ? "零行使 $z$ 成为自由变量，$z$ 的每个值都给出一个不同的解。" : `最后一行是 $0 = ${f}$，所以根本没有解。`,
            ],
            [
              "Exactly two solutions",
              "A linear system never has exactly two solutions: two solutions would put a whole line of solutions between them.",
              "线性方程组不可能恰有两个解：有两个解就会有经过它们的一整条直线的解。",
            ],
          ],
        );
      },
    },
  ],
};

// ─── 2.5.11 Reduced Row Echelon Form ──────────────────────────────────────────

/** reducedRowEchelonForm defines RREF and its uniqueness. */
export const reducedRowEchelonForm: TopicDef = {
  id: "reduced-row-echelon-form",
  title: t("Reduced Row Echelon Form", "简化行阶梯形矩阵 (RREF)"),
  summary: t(
    "Define Reduced Row Echelon Form (RREF): pivots equal 1 and are the only non-zero in their column.",
    "掌握简化行阶梯形矩阵 (RREF) 的定义与唯一性：主元均为 1 且为主元列中唯一的非零元素。",
  ),
  prerequisites: ["row-echelon-form"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "properties-of-rref",
      title: t("Criteria for Reduced Row Echelon Form", "简化行阶梯形矩阵的判定"),
      explanation: t(
        "A matrix is in Reduced Row Echelon Form (RREF) if: (1) It is in Row Echelon Form; (2) Every leading entry (pivot) is equal to 1; (3) Each pivot is the ONLY non-zero entry in its entire column (zeros both below and above each pivot). Every matrix has a unique RREF.",
        "矩阵处于简化行阶梯形 (RREF) 当且仅当：(1) 它满足行阶梯形 (REF) 条件；(2) 每个主元均等于 1；(3) 每个主元是其所在列中唯一的非零元素（主元的上方和下方均为零）。每个矩阵的 RREF 都是唯一确定的。",
      ),
      generate(rng) {
        const c1 = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const c2 = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);

        const rrefMat: Mat = [
          [1, 0, c1, 0],
          [0, 1, c2, 0],
          [0, 0, 0, 1],
        ];

        // REF but not RREF: pivot not 1
        const notRref1: Mat = [
          [2, 0, c1, 0],
          [0, 1, c2, 0],
          [0, 0, 0, 1],
        ];

        // REF but not RREF: non-zero above pivot in col 4
        const notRref2: Mat = [
          [1, 0, c1, 3],
          [0, 1, c2, 0],
          [0, 0, 0, 1],
        ];

        // REF but not RREF: non-zero above pivot in col 2
        const notRref3: Mat = [
          [1, 2, c1, 0],
          [0, 1, c2, 0],
          [0, 0, 0, 1],
        ];

        const prompt = t(
          `Which of the following $3 \\times 4$ matrices is in **Reduced Row Echelon Form (RREF)**?`,
          `下列 $3 \\times 4$ 矩阵中，哪一个是**简化行阶梯形矩阵 (RREF)**？`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$$${matLatex(rrefMat)}$$`, `$$${matLatex(rrefMat)}$$`),
          [
            t(`$$${matLatex(notRref1)}$$`, `$$${matLatex(notRref1)}$$`),
            t(`$$${matLatex(notRref2)}$$`, `$$${matLatex(notRref2)}$$`),
            t(`$$${matLatex(notRref3)}$$`, `$$${matLatex(notRref3)}$$`),
          ],
          t(
            `A matrix is in RREF if: (1) it is in REF; (2) every pivot is 1; (3) each pivot is the only non-zero entry in its column. In $$${matLatex(rrefMat)}$$, pivots are at $(1, 1), (2, 2), (3, 4)$, all equal 1, and have zeros everywhere else in their columns.`,
            `矩阵处于 RREF 的条件为：(1) 满足 REF 条件；(2) 每个主元均为 1；(3) 每个主元是其所在列的唯一非零元。在矩阵 $$${matLatex(rrefMat)}$$ 中，主元位于 $(1, 1), (2, 2), (3, 4)$，均为 1 且所在列其余元素均为零。`,
          ),
        );
      },
    },
    {
      id: "reading-a-solution-from-rref-with-a-free-variable",
      title: t("Reading a solution from RREF with a free variable", "从含自由变量的简化阶梯形读出解"),
      explanation: t(
        "In reduced row echelon form each pivot is $1$ and is the only nonzero entry in its column, so each row expresses one pivot variable in terms of the free variables. For $\\left[\\begin{array}{ccc|c} 1 & 0 & p & q \\\\ 0 & 1 & r & s \\end{array}\\right]$ with $z$ free, the rows read $x = q - pz$ and $y = s - rz$. Choosing a value of $z$ gives one particular solution.",
        "在简化行阶梯形中，每个主元都是 $1$，且是其所在列唯一的非零元素，所以每一行都把一个主元变量用自由变量表示。对 $z$ 为自由变量的 $\\left[\\begin{array}{ccc|c} 1 & 0 & p & q \\\\ 0 & 1 & r & s \\end{array}\\right]$，各行给出 $x = q - pz$，$y = s - rz$。给定 $z$ 的值就得到一个特解。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.nonZero(-4, 4);
        const q = rng.int(-6, 6);
        const r = rng.nonZero(-4, 4);
        const s = rng.int(-6, 6);
        const z = rng.nonZero(-3, 3);
        const which = rng.int(0, 1);
        const ans = which === 0 ? q - p * z : s - r * z;
        const v = which === 0 ? "x" : "y";
        return numberProblem({
          prompt: t(
            `A system has RREF $${augLatex(
              [
                [1, 0, p],
                [0, 1, r],
              ],
              [q, s],
            )}$ with $z$ free. Find $${v}$ when $z = ${z}$.`,
            `某方程组的简化阶梯形为 $${augLatex(
              [
                [1, 0, p],
                [0, 1, r],
              ],
              [q, s],
            )}$，$z$ 为自由变量。求 $z = ${z}$ 时的 $${v}$。`,
          ),
          answer: ans,
          solveFor: v,
          wrong: which === 0 ? [q + p * z, q, s - r * z] : [s + r * z, s, q - p * z],
          solution: t(
            which === 0
              ? `Row $1$ gives $x = ${q} - ${paren(p)}z = ${q} - ${paren(p)} \\cdot ${paren(z)} = ${ans}$.`
              : `Row $2$ gives $y = ${s} - ${paren(r)}z = ${s} - ${paren(r)} \\cdot ${paren(z)} = ${ans}$.`,
            which === 0
              ? `第 $1$ 行给出 $x = ${q} - ${paren(p)}z = ${q} - ${paren(p)} \\cdot ${paren(z)} = ${ans}$。`
              : `第 $2$ 行给出 $y = ${s} - ${paren(r)}z = ${s} - ${paren(r)} \\cdot ${paren(z)} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.5.12 Gaussian Elimination For NxM Systems of Equations ─────────────────

/** gaussianEliminationForNxmSystemsOfEquations covers general nxm analysis. */
export const gaussianEliminationForNxmSystemsOfEquations: TopicDef = {
  id: "gaussian-elimination-for-nxm-systems-of-equations",
  title: t("Gaussian Elimination For NxM Systems of Equations", "一般 NxM 线性方程组的高斯-约当消元法"),
  summary: t(
    "Analyze general m x n linear systems: rank, consistency, and number of free variables n - r.",
    "分析一般的 m x n 线性系统：矩阵的秩、相容性判别以及自由变量数 n - r。",
  ),
  prerequisites: ["reduced-row-echelon-form"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "general-nxm-systems",
      title: t("Dimension of solution space for m x n systems", "m x n 系统的解空间维度与自由变量数"),
      explanation: t(
        "For an $m \\times n$ linear system with augmented matrix $[A \\mid \\mathbf{b}]$: (1) It is consistent if and only if the last column of $[A \\mid \\mathbf{b}]$ is not a pivot column; (2) If consistent with rank $r = \\text{rank}(A)$, the number of basic variables is $r$ and the number of free variables is $n - r$. An underdetermined consistent system ($m < n$) always has infinitely many solutions.",
        "对于增广矩阵为 $[A \\mid \\mathbf{b}]$ 的 $m \\times n$ 线性方程组：(1) 系统相容当且仅当常数列不包含主元；(2) 若系统相容且系数矩阵秩为 $r = \\text{rank}(A)$，则基本变量数为 $r$，自由变量数为 $n - r$。未知数多于方程数的相容欠定方程组（$m < n$）必然有无穷多解。",
      ),
      generate(rng) {
        const m = rng.pick([3, 4, 5, 6]);
        const n = rng.pick([4, 5, 6, 7, 8]);
        const maxRank = Math.min(m, n) - 1;
        const r = rng.pick([2, Math.min(3, maxRank), maxRank]);
        const freeCount = n - r;

        const prompt = t(
          `A consistent system of $${m}$ linear equations in $${n}$ variables has a coefficient matrix $A$ of rank $r = ${r}$. How many free variables (degrees of freedom) does the general solution have?`,
          `一个由 $${m}$ 个方程与 $${n}$ 个未知数组成的相容线性方程组，其系数矩阵 $A$ 的秩为 $r = ${r}$。该方程组的通解包含多少个自由变量（自由度）？`,
        );

        return numberProblem({
          prompt,
          answer: freeCount,
          solution: t(
            `In ${article(m)} $${m} \\times ${n}$ system with rank $r = ${r}$, the number of pivot columns (basic variables) is $r = ${r}$. The remaining $n - r$ columns correspond to free variables. Here $n = ${n}$ and $r = ${r}$, so the number of free variables is $n - r = ${n} - ${r} = ${freeCount}$.`,
            `在秩为 $r = ${r}$ 的 $${m} \\times ${n}$ 系统中，主元列（基本变量）的个数为 $r = ${r}$。其余 $n - r$ 列均对应自由变量。此处 $n = ${n}$ 且 $r = ${r}$，故自由变量个数为 $n - r = ${n} - ${r} = ${freeCount}$。`,
          ),
          wrong: [r, m - r, n - m, freeCount + 1, Math.max(0, freeCount - 1)],
        });
      },
    },
    {
      id: "the-rank-from-the-dimension-of-the-solution-set",
      title: t("The rank from the dimension of the solution set", "由解集维数求秩"),
      explanation: t(
        "For an $m \\times n$ matrix $A$, every column is either a pivot column or corresponds to a free variable. The number of pivots is the rank $r$, and the number of free variables in the solution of $A\\mathbf{x} = \\mathbf{0}$ is $n - r$. So if the solution set of $A\\mathbf{x} = \\mathbf{0}$ has $d$ free parameters, the rank is $r = n - d$. The number of rows $m$ only limits how large $r$ can be.",
        "对 $m \\times n$ 矩阵 $A$，每一列要么是主元列，要么对应一个自由变量。主元个数就是秩 $r$，$A\\mathbf{x} = \\mathbf{0}$ 的解中自由变量个数为 $n - r$。所以若 $A\\mathbf{x} = \\mathbf{0}$ 的解集有 $d$ 个自由参数，则秩为 $r = n - d$。行数 $m$ 只限制 $r$ 的最大值。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(2, 6);
        const n = rng.int(3, 8);
        const r = rng.int(1, Math.min(m, n));
        const d = n - r;
        return numberProblem({
          prompt: t(
            `$A$ is a $${m} \\times ${n}$ matrix, and the general solution of $A\\mathbf{x} = \\mathbf{0}$ has $${d}$ free parameter${d === 1 ? "" : "s"}. Find $\\operatorname{rank} A$.`,
            `$A$ 是 $${m} \\times ${n}$ 矩阵，$A\\mathbf{x} = \\mathbf{0}$ 的通解含 $${d}$ 个自由参数。求 $\\operatorname{rank} A$。`,
          ),
          answer: r,
          wrong: [m - d, d, n + d, m],
          solution: t(
            `Each of the $${n}$ columns is a pivot column or a free variable, so $\\operatorname{rank} A = ${n} - ${d} = ${r}$.`,
            `$${n}$ 列中每列要么是主元列要么对应自由变量，所以 $\\operatorname{rank} A = ${n} - ${d} = ${r}$。`,
          ),
        });
      },
    },
  ],
};

// ─── Module 2.6. Elementary Matrices ─────────────────────────────────────────

// ─── 2.6.1 Elementary 2x2 Matrices ───────────────────────────────────────────

/** elementary2x2Matrices defines 2x2 elementary matrices and their inverses. */
export const elementary2x2Matrices: TopicDef = {
  id: "elementary-2x2-matrices",
  title: t("Elementary 2x2 Matrices", "二阶初等矩阵"),
  summary: t(
    "Define 2x2 elementary matrices corresponding to the three row operations and compute their inverses.",
    "掌握对应于三种初等行变换的二阶初等矩阵及其逆矩阵的构造与计算。",
  ),
  prerequisites: ["multiplying-square-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "elementary-matrices-2x2-definition",
      title: t("Definition and inverses of 2x2 elementary matrices", "二阶初等矩阵与逆矩阵"),
      explanation: t(
        "An elementary matrix $E$ is obtained by applying a single elementary row operation to the identity matrix $I$. Every elementary matrix is invertible, and its inverse $E^{-1}$ is the elementary matrix corresponding to the reverse row operation: (1) Swap: $E^{-1} = E$; (2) Scaling: $(k R_i)^{-1} \\implies \\frac{1}{k} R_i$; (3) Addition: $(R_i + c R_j)^{-1} \\implies R_i - c R_j$.",
        "初等矩阵 $E$ 是由单位矩阵 $I$ 经一次初等行变换得到的矩阵。初等矩阵均可逆，其逆矩阵 $E^{-1}$ 就是对应该行变换的逆操作所生成的初等矩阵：(1) 对调行：$E^{-1} = E$；(2) 数乘行：$(k R_i)^{-1} \\implies \\frac{1}{k} R_i$；(3) 行倍加：$(R_i + c R_j)^{-1} \\implies R_i - c R_j$。",
      ),
      generate(rng) {
        const c = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const isRow2 = rng.bool(); // R2 + c*R1 -> R2 vs R1 + c*R2 -> R1

        const opStr = isRow2
          ? c > 0
            ? `R_2 + ${c} R_1 \\to R_2`
            : `R_2 - ${-c} R_1 \\to R_2`
          : c > 0
            ? `R_1 + ${c} R_2 \\to R_1`
            : `R_1 - ${-c} R_2 \\to R_1`;

        const E: Mat = isRow2
          ? [
              [1, 0],
              [c, 1],
            ]
          : [
              [1, c],
              [0, 1],
            ];

        const E_inv: Mat = isRow2
          ? [
              [1, 0],
              [-c, 1],
            ]
          : [
              [1, -c],
              [0, 1],
            ];

        // Distractors for E_inv
        const wrongInv1: Mat = isRow2
          ? [
              [1, 0],
              [c, 1],
            ]
          : [
              [1, c],
              [0, 1],
            ];
        const wrongInv2: Mat = isRow2
          ? [
              [1, -c],
              [0, 1],
            ]
          : [
              [1, 0],
              [-c, 1],
            ];
        const wrongInv3: Mat = [
          [0, 1],
          [1, 0],
        ];

        const prompt = t(
          `What is the inverse $E^{-1}$ of the elementary matrix $E$ representing the row operation $${opStr}$?

$$E = ${matLatex(E)}$$`,
          `初等矩阵 $E$ 表示行变换 $${opStr}$，其逆矩阵 $E^{-1}$ 是哪一个？

$$E = ${matLatex(E)}$$`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$$${matLatex(E_inv)}$$`, `$$${matLatex(E_inv)}$$`),
          [
            t(`$$${matLatex(wrongInv1)}$$`, `$$${matLatex(wrongInv1)}$$`),
            t(`$$${matLatex(wrongInv2)}$$`, `$$${matLatex(wrongInv2)}$$`),
            t(`$$${matLatex(wrongInv3)}$$`, `$$${matLatex(wrongInv3)}$$`),
          ],
          t(
            `The row operation is $${opStr}$. Its inverse operation reverses the addition: replace $${c}$ with $-(${c}) = ${-c}$. Therefore, $E^{-1} = ${matLatex(E_inv)}$.`,
            `该初等行变换为 $${opStr}$。它的逆变换是将其倍数取相反数：将 $${c}$ 替换为 $-(${c}) = ${-c}$。因此逆矩阵为 $E^{-1} = ${matLatex(E_inv)}$。`,
          ),
        );
      },
    },
    {
      id: "an-entry-of-the-inverse-of-an-elementary-2x2-matrix",
      title: t("An entry of the inverse of an elementary 2×2 matrix", "2×2 初等矩阵逆的元素"),
      explanation: t(
        "The inverse of an elementary matrix is the elementary matrix of the reverse operation. The inverse of $\\begin{pmatrix} 1 & 0 \\\\ c & 1 \\end{pmatrix}$ (add $c$ times row $1$ to row $2$) is $\\begin{pmatrix} 1 & 0 \\\\ -c & 1 \\end{pmatrix}$. The inverse of $\\begin{pmatrix} 1 & 0 \\\\ 0 & k \\end{pmatrix}$ (scale row $2$ by $k$) is $\\begin{pmatrix} 1 & 0 \\\\ 0 & \\frac{1}{k} \\end{pmatrix}$, and a swap matrix is its own inverse.",
        "初等矩阵的逆是逆向变换对应的初等矩阵。$\\begin{pmatrix} 1 & 0 \\\\ c & 1 \\end{pmatrix}$（把第 $1$ 行的 $c$ 倍加到第 $2$ 行）的逆为 $\\begin{pmatrix} 1 & 0 \\\\ -c & 1 \\end{pmatrix}$。$\\begin{pmatrix} 1 & 0 \\\\ 0 & k \\end{pmatrix}$（第 $2$ 行乘以 $k$）的逆为 $\\begin{pmatrix} 1 & 0 \\\\ 0 & \\frac{1}{k} \\end{pmatrix}$，交换矩阵的逆是它本身。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(0, 1);
        const c = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
        const lower = rng.int(0, 1) === 1;
        const E =
          kind === 0
            ? lower
              ? [
                  [1, 0],
                  [c, 1],
                ]
              : [
                  [1, c],
                  [0, 1],
                ]
            : lower
              ? [
                  [1, 0],
                  [0, c],
                ]
              : [
                  [c, 0],
                  [0, 1],
                ];
        const pos = kind === 0 ? (lower ? [2, 1] : [1, 2]) : lower ? [2, 2] : [1, 1];
        const ans = kind === 0 ? Q.of(-c) : Q.of(1, c);
        return numberProblem({
          prompt: t(
            `Find the $(${pos[0]}, ${pos[1]})$ entry of $E^{-1}$ for $E = ${matLatex(E)}$.`,
            `求 $E = ${matLatex(E)}$ 的逆矩阵 $E^{-1}$ 的 $(${pos[0]}, ${pos[1]})$ 元素。`,
          ),
          answer: ans,
          wrong: [Q.of(c), Q.of(-1, c), Q.of(1, c), Q.of(-c), Q.of(1)],
          solution: t(
            kind === 0
              ? `$E$ adds $${c}$ times one row to another; the inverse adds $${-c}$ times instead, so the entry is $${-c}$.`
              : `$E$ scales a row by $${c}$; the inverse scales it by $${ans.toLatex()}$, so the entry is $${ans.toLatex()}$.`,
            kind === 0
              ? `$E$ 把一行的 $${c}$ 倍加到另一行；逆变换改为加 $${-c}$ 倍，所以该元素为 $${-c}$。`
              : `$E$ 把一行乘以 $${c}$；逆变换乘以 $${ans.toLatex()}$，所以该元素为 $${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.6.2 Row Operations as Products of Elementary Matrices (2x2) ───────────

/** rowOperationsOn2x2MatricesAsProductsOfElementaryMatrices covers left-multiplication EA. */
export const rowOperationsOn2x2MatricesAsProductsOfElementaryMatrices: TopicDef = {
  id: "row-operations-on-2x2-matrices-as-products-of-elementary-matrices",
  title: t("Row Operations on 2x2 Matrices as Products of Elementary Matrices", "初等变换的矩阵乘积表示 (2x2)"),
  summary: t(
    "Express row operations on $2 \\times 2$ matrices as multiplication on the left by an elementary matrix: $EA$.",
    "将 $2 \\times 2$ 矩阵的初等行变换表示为在左侧乘以初等矩阵：$EA$。",
  ),
  prerequisites: ["elementary-2x2-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "elementary-matrix-multiplication-2x2",
      title: t("Row operations via left multiplication", "左乘初等矩阵实现初等行变换"),
      explanation: t(
        "Applying an elementary row operation to a matrix $A$ is equivalent to multiplying $A$ on the left by the elementary matrix $E$ resulting from performing the same operation on the identity matrix $I$: $\\text{RowOp}(A) = E A$.",
        "对矩阵 $A$ 实施某一初等行变换，等价于用对单位矩阵 $I$ 实施相同变换得到的初等矩阵 $E$ 在左侧乘以 $A$：$\\text{RowOp}(A) = E A$。",
      ),
      generate(rng) {
        const k = rng.pick([2, 3, 4, -2, -3]);
        const E: Mat = [
          [1, 0],
          [-k, 1],
        ]; // R2 - k*R1 -> R2

        const a11 = rng.pick([1, 2]);
        const a12 = rng.pick([3, -2, 4]);
        const a21 = rng.pick([4, 5, -1]);
        const a22 = rng.pick([2, 1, 3]);

        const A: Mat = [
          [a11, a12],
          [a21, a22],
        ];

        // E * A: row 1 is unchanged, row 2 is r2 - k*r1
        const EA: Mat = [
          [a11, a12],
          [a21 - k * a11, a22 - k * a12],
        ];

        // Distractor: A * E (column operation instead)
        const AE: Mat = [
          [a11 - k * a12, a12],
          [a21 - k * a22, a22],
        ];
        // Distractor: R2 + k*R1
        const wrongAdd: Mat = [
          [a11, a12],
          [a21 + k * a11, a22 + k * a12],
        ];
        // Distractor: R1 - k*R2
        const wrongR1: Mat = [
          [a11 - k * a21, a12 - k * a22],
          [a21, a22],
        ];

        const prompt = t(
          `Compute the matrix product $E A$ where:

$$E = ${matLatex(E)}, \\quad A = ${matLatex(A)}$$`,
          `计算矩阵乘积 $E A$，其中：

$$E = ${matLatex(E)}, \\quad A = ${matLatex(A)}$$`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$$${matLatex(EA)}$$`, `$$${matLatex(EA)}$$`),
          [
            t(`$$${matLatex(AE)}$$`, `$$${matLatex(AE)}$$`),
            t(`$$${matLatex(wrongAdd)}$$`, `$$${matLatex(wrongAdd)}$$`),
            t(`$$${matLatex(wrongR1)}$$`, `$$${matLatex(wrongR1)}$$`),
          ],
          t(
            `Left-multiplying by $E = \\begin{pmatrix} 1 & 0 \\\\ ${-k} & 1 \\end{pmatrix}$ executes the row operation $${poly([1, "R_2"], [-k, "R_1"])} \\to R_2$ on matrix $A$:
Row 2 becomes $[${a21} - (${k})(${a11}), ${a22} - (${k})(${a12})] = [${a21 - k * a11}, ${a22 - k * a12}]$. Thus $E A = ${matLatex(EA)}$.`,
            `左乘矩阵 $E = \\begin{pmatrix} 1 & 0 \\\\ ${-k} & 1 \\end{pmatrix}$ 等价于对矩阵 $A$ 实施行变换 $${poly([1, "R_2"], [-k, "R_1"])} \\to R_2$：
第 2 行变为 $[${a21} - (${k})(${a11}), ${a22} - (${k})(${a12})] = [${a21 - k * a11}, ${a22 - k * a12}]$。因此 $E A = ${matLatex(EA)}$。`,
          ),
        );
      },
    },
    {
      id: "the-product-of-two-elementary-2x2-matrices",
      title: t("The product of two elementary 2×2 matrices", "两个 2×2 初等矩阵的乘积"),
      explanation: t(
        "Performing two row operations in turn multiplies by their elementary matrices from the left, the first one closest to $A$: the operation $E_1$ followed by $E_2$ is $E_2E_1A$. The product $E_2E_1$ is the single matrix doing both. For $E_1 = \\begin{pmatrix} 1 & 0 \\\\ a & 1 \\end{pmatrix}$ and $E_2 = \\begin{pmatrix} 1 & b \\\\ 0 & 1 \\end{pmatrix}$,\n\n$$E_2E_1 = \\begin{pmatrix} 1 + ab & b \\\\ a & 1 \\end{pmatrix}.$$",
        "依次进行两个行变换就是从左边依次乘以它们的初等矩阵，第一个最靠近 $A$：先 $E_1$ 后 $E_2$ 即 $E_2E_1A$。乘积 $E_2E_1$ 是同时完成两步的单个矩阵。对 $E_1 = \\begin{pmatrix} 1 & 0 \\\\ a & 1 \\end{pmatrix}$，$E_2 = \\begin{pmatrix} 1 & b \\\\ 0 & 1 \\end{pmatrix}$，\n\n$$E_2E_1 = \\begin{pmatrix} 1 + ab & b \\\\ a & 1 \\end{pmatrix}$$",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const kl = (v: number) => (v < 0 ? `- ${-v === 1 ? "" : -v}` : `+ ${v === 1 ? "" : v}`);
        const ans = 1 + a * b;
        return numberProblem({
          prompt: t(
            `First $R_2 ${kl(a)}R_1 \\to R_2$, then $R_1 ${kl(b)}R_2 \\to R_1$. Find the $(1, 1)$ entry of the single matrix $E$ that performs both operations.`,
            `先做 $R_2 ${kl(a)}R_1 \\to R_2$，再做 $R_1 ${kl(b)}R_2 \\to R_1$。求同时完成这两步的矩阵 $E$ 的 $(1, 1)$ 元素。`,
          ),
          answer: ans,
          wrong: [1, a * b, 1 - a * b, a + b],
          solution: t(
            `$E = E_2E_1 = ${matLatex([
              [1, b],
              [0, 1],
            ])}${matLatex([
              [1, 0],
              [a, 1],
            ])} = ${matLatex([
              [ans, b],
              [a, 1],
            ])}$, so the $(1, 1)$ entry is $${ans}$.`,
            `$E = E_2E_1 = ${matLatex([
              [1, b],
              [0, 1],
            ])}${matLatex([
              [1, 0],
              [a, 1],
            ])} = ${matLatex([
              [ans, b],
              [a, 1],
            ])}$，所以 $(1, 1)$ 元素为 $${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.6.3 Elementary 3x3 Matrices ───────────────────────────────────────────

/** elementary3x3Matrices defines 3x3 elementary matrices for the three operations. */
export const elementary3x3Matrices: TopicDef = {
  id: "elementary-3x3-matrices",
  title: t("Elementary 3x3 Matrices", "三阶初等矩阵"),
  summary: t(
    "Construct 3x3 elementary matrices for row addition, scaling, and row transposition.",
    "构造并识别对应于行倍加、行数乘以及行对调的三阶初等矩阵。",
  ),
  prerequisites: ["elementary-2x2-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "elementary-matrices-3x3-definition",
      title: t("3x3 elementary matrices construction", "三阶初等矩阵的构造"),
      explanation: t(
        "A $3 \\times 3$ elementary matrix performs an elementary row operation on $3$-row matrices when multiplied from the left: (1) $P_{ij}$ swaps rows $i$ and $j$; (2) $M_i(k)$ scales row $i$ by $k$; (3) $E_{ij}(c)$ adds $c$ times row $j$ to row $i$ (placing $c$ in row $i$, column $j$ of the identity matrix).",
        "三阶初等矩阵左乘任何 3 行矩阵时均执行对应的初等行变换：(1) 对调矩阵 $P_{ij}$ 交换第 $i$ 行与第 $j$ 行；(2) 倍乘矩阵 $M_i(k)$ 将第 $i$ 行乘以 $k$；(3) 倍加矩阵 $E_{ij}(c)$ 将第 $j$ 行的 $c$ 倍加到第 $i$ 行（即在单位矩阵的第 $i$ 行第 $j$ 列填入 $c$）。",
      ),
      generate(rng) {
        const c = rng.pick([-7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
        const rowPairs: readonly (readonly [number, number])[] = [
          [2, 1],
          [3, 1],
          [3, 2],
          [1, 2],
          [1, 3],
          [2, 3],
        ];
        const [targetRow, sourceRow] = rng.pick(rowPairs);

        const opStr =
          c > 0
            ? `R_{${targetRow}} + ${c} R_{${sourceRow}} \\to R_{${targetRow}}`
            : `R_{${targetRow}} - ${-c} R_{${sourceRow}} \\to R_{${targetRow}}`;

        // Create 3x3 identity with c at (targetRow-1, sourceRow-1)
        const E: Mat = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ];
        const correctMat: Mat = E.map((row, i) => row.map((val, j) => (i === targetRow - 1 && j === sourceRow - 1 ? c : val)));

        // Distractor: transpose (c in (sourceRow, targetRow))
        const wrongTrans: Mat = E.map((row, i) => row.map((val, j) => (i === sourceRow - 1 && j === targetRow - 1 ? c : val)));
        // Distractor: -c
        const wrongNeg: Mat = E.map((row, i) => row.map((val, j) => (i === targetRow - 1 && j === sourceRow - 1 ? -c : val)));
        // Distractor: swap matrix
        const wrongSwap: Mat = [
          [0, 1, 0],
          [1, 0, 0],
          [0, 0, 1],
        ];

        const prompt = t(
          `Which $3 \\times 3$ elementary matrix $E$ performs the row operation $${opStr}$?`,
          `哪一个 $3 \\times 3$ 初等矩阵 $E$ 对应初等行变换 $${opStr}$？`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$$${matLatex(correctMat)}$$`, `$$${matLatex(correctMat)}$$`),
          [
            t(`$$${matLatex(wrongTrans)}$$`, `$$${matLatex(wrongTrans)}$$`),
            t(`$$${matLatex(wrongNeg)}$$`, `$$${matLatex(wrongNeg)}$$`),
            t(`$$${matLatex(wrongSwap)}$$`, `$$${matLatex(wrongSwap)}$$`),
          ],
          t(
            `Applying $${opStr}$ to the $3 \\times 3$ identity matrix $I_3$ places the entry $${c}$ into row ${targetRow}, column ${sourceRow}, with 1s along the main diagonal and 0s elsewhere: $$${matLatex(correctMat)}$$.`,
            `对 $3 \\times 3$ 单位矩阵 $I_3$ 实施初等行变换 $${opStr}$，会在第 ${targetRow} 行第 ${sourceRow} 列生成元素 $${c}$，而主对角线其余元素均为 1，其余位置均为 0：$$${matLatex(correctMat)}$$。`,
          ),
        );
      },
    },
    {
      id: "the-determinant-of-an-elementary-3x3-matrix",
      title: t("The determinant of an elementary 3×3 matrix", "3×3 初等矩阵的行列式"),
      explanation: t(
        "An elementary matrix is the identity with one row operation applied, so its determinant records the effect of that operation. A replacement matrix is triangular with ones on the diagonal and has determinant $1$. A scaling matrix has determinant $k$. A swap matrix has determinant $-1$. Then $\\det(EA) = \\det E \\cdot \\det A$ for every $A$.",
        "初等矩阵是对单位矩阵做一次行变换得到的，所以其行列式记录了该变换的效果。倍加矩阵是对角线全为 $1$ 的三角矩阵，行列式为 $1$。数乘矩阵行列式为 $k$。交换矩阵行列式为 $-1$。于是对任意 $A$ 有 $\\det(EA) = \\det E \\cdot \\det A$。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(0, 2);
        const i = rng.int(0, 2);
        const j = rng.pick([0, 1, 2].filter((x) => x !== i));
        const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const E: number[][] = [0, 1, 2].map((r) => [0, 1, 2].map((c) => (r === c ? 1 : 0)));
        if (kind === 0) E[i]![j] = k;
        else if (kind === 1) E[i]![i] = k;
        else {
          E[i]![i] = 0;
          E[j]![j] = 0;
          E[i]![j] = 1;
          E[j]![i] = 1;
        }
        const ans = [1, k, -1][kind]!;
        return numberProblem({
          prompt: t(`Find $\\det E$ for the elementary matrix $E = ${matLatex(E)}$.`, `求初等矩阵 $E = ${matLatex(E)}$ 的 $\\det E$。`),
          answer: ans,
          wrong: [k, 1, -1, 0, -k],
          solution: t(
            [
              `$E$ adds $${k}$ times one row to another, a triangular matrix with unit diagonal, so $\\det E = 1$.`,
              `$E$ scales a row by $${k}$, so $\\det E = ${k}$.`,
              "$E$ swaps two rows, so $\\det E = -1$.",
            ][kind]!,
            [
              `$E$ 把一行的 $${k}$ 倍加到另一行，是对角线全为 $1$ 的三角矩阵，所以 $\\det E = 1$。`,
              `$E$ 把一行乘以 $${k}$，所以 $\\det E = ${k}$。`,
              "$E$ 交换两行，所以 $\\det E = -1$。",
            ][kind]!,
          ),
        });
      },
    },
  ],
};

// ─── 2.6.4 Row Operations as Products of Elementary Matrices (3x3) ───────────

/** rowOperationsOn3x3MatricesAsProductsOfElementaryMatrices covers sequential reduction products. */
export const rowOperationsOn3x3MatricesAsProductsOfElementaryMatrices: TopicDef = {
  id: "row-operations-on-3x3-matrices-as-products-of-elementary-matrices",
  title: t("Row Operations on 3x3 Matrices as Products of Elementary Matrices", "初等变换的矩阵乘积表示 (3x3)"),
  summary: t(
    "Express a sequence of row operations as a product of elementary matrices: $E_k \\cdots E_1 A = R$.",
    "将连续多次初等行变换表示为初等矩阵的乘积：$E_k \\cdots E_1 A = R$。",
  ),
  prerequisites: ["elementary-3x3-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "elementary-matrix-reduction-3x3",
      title: t("Sequential row operations as products of elementary matrices", "连续初等变换的矩阵乘积"),
      explanation: t(
        "When successive elementary row operations $op_1, op_2, \\dots, op_k$ are applied to matrix $A$, the resulting matrix is $R = E_k \\cdots E_2 E_1 A$, where each $E_i$ is the elementary matrix for $op_i$. Note that the matrices are multiplied on the left in the exact chronological order of the operations.",
        "当对矩阵 $A$ 依次实施初等行变换 $op_1, op_2, \\dots, op_k$ 时，最终得到的矩阵为 $R = E_k \\cdots E_2 E_1 A$，其中每个 $E_i$ 为对应 $op_i$ 的初等矩阵。请注意初等矩阵是按施加顺序从右向左依次在左侧相乘。",
      ),
      generate(rng) {
        const c1 = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const c2 = rng.pick([-5, -4, -3, -1, 1, 2, 3, 4, 5]);
        const rowOp = (row: number, c: number) => `R_${row} ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}R_1`;

        const E1: Mat = [
          [1, 0, 0],
          [c1, 1, 0],
          [0, 0, 1],
        ];
        const E2: Mat = [
          [1, 0, 0],
          [0, 1, 0],
          [c2, 0, 1],
        ];

        // Product E2 * E1:
        // E2 * E1 = [[1, 0, 0], [c1, 1, 0], [c2, 0, 1]]
        const E2E1: Mat = [
          [1, 0, 0],
          [c1, 1, 0],
          [c2, 0, 1],
        ];

        const _op1Str = c1 > 0 ? `R_2 - ${c1} R_1 \\to R_2` : `R_2 + ${-c1} R_1 \\to R_2`;
        const _op2Str = c2 > 0 ? `R_3 - ${c2} R_1 \\to R_3` : `R_3 + ${-c2} R_1 \\to R_3`;

        const wrongProduct1: Mat = [
          [1, 0, 0],
          [-c1, 1, 0],
          [-c2, 0, 1],
        ];
        const wrongProduct2: Mat = [
          [1, c1, c2],
          [0, 1, 0],
          [0, 0, 1],
        ];
        const wrongProduct3: Mat = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ];

        const prompt = t(
          `Let $E_1$ represent the row operation $${rowOp(2, c1)} \\to R_2$ and $E_2$ represent $${rowOp(3, c2)} \\to R_3$. What single matrix $M = E_2 E_1$ performs both operations simultaneously on any $3 \\times 3$ matrix $A$?`,
          `设 $E_1$ 表示行变换 $${rowOp(2, c1)} \\to R_2$，$E_2$ 表示行变换 $${rowOp(3, c2)} \\to R_3$。对任意 $3 \\times 3$ 矩阵 $A$，能够同时执行这两个行变换的矩阵乘积 $M = E_2 E_1$ 是哪一个？`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$$${matLatex(E2E1)}$$`, `$$${matLatex(E2E1)}$$`),
          [
            t(`$$${matLatex(wrongProduct1)}$$`, `$$${matLatex(wrongProduct1)}$$`),
            t(`$$${matLatex(wrongProduct2)}$$`, `$$${matLatex(wrongProduct2)}$$`),
            t(`$$${matLatex(wrongProduct3)}$$`, `$$${matLatex(wrongProduct3)}$$`),
          ],
          t(
            `Since $E_1 = ${matLatex(E1)}$ and $E_2 = ${matLatex(E2)}$, multiplying them yields $M = E_2 E_1 = ${matLatex(E2E1)}$. This unit lower triangular matrix clears both column 1 positions beneath the pivot in a single step.`,
            `因为 $E_1 = ${matLatex(E1)}$ 且 $E_2 = ${matLatex(E2)}$，两者相乘得到 $M = E_2 E_1 = ${matLatex(E2E1)}$。该单位下三角矩阵能够一步实现对第 1 列主元下方两个位置的消元。`,
          ),
        );
      },
    },
    {
      id: "inverting-a-product-of-elimination-matrices",
      title: t("Inverting a product of elimination matrices", "求消元矩阵乘积的逆"),
      explanation: t(
        "Clearing column $1$ with $R_2 - aR_1 \\to R_2$ and $R_3 - bR_1 \\to R_3$ is multiplication by $E = \\begin{pmatrix} 1 & 0 & 0 \\\\ -a & 1 & 0 \\\\ -b & 0 & 1 \\end{pmatrix}$. Its inverse undoes both operations by adding the multiples back:\n\n$$E^{-1} = \\begin{pmatrix} 1 & 0 & 0 \\\\ a & 1 & 0 \\\\ b & 0 & 1 \\end{pmatrix}.$$\n\nThe multipliers appear with their signs flipped, which is exactly how $L$ is built in an $LU$ factorization.",
        "用 $R_2 - aR_1 \\to R_2$ 和 $R_3 - bR_1 \\to R_3$ 消去第 $1$ 列，相当于乘以 $E = \\begin{pmatrix} 1 & 0 & 0 \\\\ -a & 1 & 0 \\\\ -b & 0 & 1 \\end{pmatrix}$。其逆通过把倍数加回来撤销这两步：\n\n$$E^{-1} = \\begin{pmatrix} 1 & 0 & 0 \\\\ a & 1 & 0 \\\\ b & 0 & 1 \\end{pmatrix}$$\n\n乘数以相反的符号出现，这正是 $LU$ 分解中构造 $L$ 的方式。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-6, 6);
        const row = rng.int(2, 3);
        const ans = row === 2 ? a : b;
        const kl = (v: number) => (v < 0 ? `+ ${v === -1 ? "" : -v}` : `- ${v === 1 ? "" : v}`);
        return numberProblem({
          prompt: t(
            `$E$ performs $R_2 ${kl(a)}R_1 \\to R_2$ and $R_3 ${kl(b)}R_1 \\to R_3$. Find the $(${row}, 1)$ entry of $E^{-1}$.`,
            `$E$ 完成 $R_2 ${kl(a)}R_1 \\to R_2$ 和 $R_3 ${kl(b)}R_1 \\to R_3$。求 $E^{-1}$ 的 $(${row}, 1)$ 元素。`,
          ),
          answer: ans,
          wrong: [-ans, row === 2 ? b : a, row === 2 ? -b : -a, 1],
          solution: t(
            `$E = ${matLatex([
              [1, 0, 0],
              [-a, 1, 0],
              [-b, 0, 1],
            ])}$ and $E^{-1}$ adds the multiples back, so its $(${row}, 1)$ entry is $${ans}$.`,
            `$E = ${matLatex([
              [1, 0, 0],
              [-a, 1, 0],
              [-b, 0, 1],
            ])}$，$E^{-1}$ 把倍数加回，所以其 $(${row}, 1)$ 元素为 $${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── Module 2.7. The Inverse of a Matrix ─────────────────────────────────────

// ─── 2.7.1 The Invertible Matrix Theorem (2x2) ────────────────────────────────

/** theInvertibleMatrixTheoremInTermsOf2x2SystemsOfEquations covers IMT equivalences. */
export const theInvertibleMatrixTheoremInTermsOf2x2SystemsOfEquations: TopicDef = {
  id: "the-invertible-matrix-theorem-in-terms-of-2x2-systems-of-equations",
  title: t("The Invertible Matrix Theorem in Terms of 2x2 Systems of Equations", "可逆矩阵等价命题（二阶情形）"),
  summary: t(
    "Connect invertibility: det(A) != 0 <=> A is invertible <=> Ax = 0 has only the trivial solution.",
    "掌握二阶可逆矩阵定理的等价条件：det(A) != 0 <=> A 可逆 <=> Ax = 0 仅有零解 <=> RREF(A) = I。",
  ),
  prerequisites: ["the-determinant-of-a-2x2-matrix"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "invertible-matrix-theorem-2x2",
      title: t("Equivalences of the Invertible Matrix Theorem (2x2)", "二阶可逆矩阵的等价条件"),
      explanation: t(
        "For a $2 \\times 2$ square matrix $A$, the following statements are logically equivalent: (1) $A$ is invertible ($A^{-1}$ exists); (2) $\\det(A) \\ne 0$; (3) The homogeneous system $A\\mathbf{x} = \\mathbf{0}$ has only the trivial solution $\\mathbf{x} = \\mathbf{0}$; (4) The reduced row echelon form of $A$ is the identity matrix $I_2$; (5) The linear system $A\\mathbf{x} = \\mathbf{b}$ has a unique solution for every $\\mathbf{b}$.",
        "对于二阶方阵 $A$，下列命题在逻辑上相互等价：(1) $A$ 是可逆矩阵（$A^{-1}$ 存在）；(2) $\\det(A) \\ne 0$；(3) 齐次方程组 $A\\mathbf{x} = \\mathbf{0}$ 仅有零解 $\\mathbf{x} = \\mathbf{0}$；(4) $A$ 的简化行阶梯形为二阶单位矩阵 $I_2$；(5) 对任意向量 $\\mathbf{b}$，方程组 $A\\mathbf{x} = \\mathbf{b}$ 均有唯一解。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3]);
        const b = rng.pick([-2, 1, 2]);
        // Half of the matrices have proportional rows, so that both outcomes occur.
        const singular = rng.bool();
        const m = rng.pick([-2, 2, 3]);
        const c = singular ? m * a : rng.pick([2, -1, 3]);
        const d = singular ? m * b : rng.pick([4, 5, -2]);

        const detA = a * d - b * c;
        const isInvertible = detA !== 0;

        const A: Mat = [
          [a, b],
          [c, d],
        ];

        const prompt = t(
          `Consider the matrix $A = ${matLatex(A)}$. According to the Invertible Matrix Theorem, what is the solution set to the homogeneous system $A\\mathbf{x} = \\mathbf{0}$?`,
          `考虑矩阵 $A = ${matLatex(A)}$。根据可逆矩阵定理，齐次线性系统 $A\\mathbf{x} = \\mathbf{0}$ 的解集是怎样的？`,
        );

        const rightText = isInvertible
          ? t("Only the trivial solution $\\mathbf{x} = \\mathbf{0}$", "仅有平凡零解 $\\mathbf{x} = \\mathbf{0}$")
          : t("Infinitely many non-trivial solutions", "有无穷多非零解");

        const wrongTexts = isInvertible
          ? [
              t("Infinitely many non-trivial solutions", "有无穷多非零解"),
              t("No solution at all", "完全无解"),
              t(`Exactly two distinct solutions $\\mathbf{x}_1, \\mathbf{x}_2$`, "恰好有两个不同的解 $\\mathbf{x}_1, \\mathbf{x}_2$"),
            ]
          : [
              t("Only the trivial solution $\\mathbf{x} = \\mathbf{0}$", "仅有平凡零解 $\\mathbf{x} = \\mathbf{0}$"),
              t("No solution at all", "完全无解"),
              t(`Exactly two distinct solutions $\\mathbf{x}_1, \\mathbf{x}_2$`, "恰好有两个不同的解 $\\mathbf{x}_1, \\mathbf{x}_2$"),
            ];

        return oneOf(
          rng,
          prompt,
          rightText,
          wrongTexts,
          t(
            isInvertible
              ? `Since $\\det(A) = ${a}(${d}) - (${b})(${c}) = ${detA} \\ne 0$, matrix $A$ is invertible. By the Invertible Matrix Theorem, $A\\mathbf{x} = \\mathbf{0} \\iff \\mathbf{x} = A^{-1}\\mathbf{0} = \\mathbf{0}$, meaning it has only the trivial solution.`
              : `Since $\\det(A) = ${a}(${d}) - (${b})(${c}) = 0$, matrix $A$ is singular (not invertible). Thus the system has free variables and possesses infinitely many non-trivial solutions.`,
            isInvertible
              ? `由于 $\\det(A) = ${a}(${d}) - (${b})(${c}) = ${detA} \\ne 0$，矩阵 $A$ 可逆。根据可逆矩阵定理，$A\\mathbf{x} = \\mathbf{0} \\iff \\mathbf{x} = A^{-1}\\mathbf{0} = \\mathbf{0}$，因此只有平凡零解。`
              : `由于 $\\det(A) = ${a}(${d}) - (${b})(${c}) = 0$，矩阵 $A$ 奇异不可逆。因此该齐次系统存在自由变量，包含无穷多非零解。`,
          ),
        );
      },
    },
    {
      id: "does-every-right-hand-side-give-a-unique-solution",
      title: t("Does every right-hand side give a unique solution?", "每个右端项都有唯一解吗？"),
      explanation: t(
        "By the Invertible Matrix Theorem, for a square matrix $A$ the following are equivalent: $\\det A \\ne 0$, $A$ is invertible, and $A\\mathbf{x} = \\mathbf{b}$ has exactly one solution for every $\\mathbf{b}$. So a single determinant decides the question for all right-hand sides at once. If $\\det A = 0$, some $\\mathbf{b}$ give no solution and the others give infinitely many.",
        "由可逆矩阵定理，对方阵 $A$ 以下各条等价：$\\det A \\ne 0$；$A$ 可逆；对每个 $\\mathbf{b}$，$A\\mathbf{x} = \\mathbf{b}$ 恰有一个解。所以一个行列式就能同时判定所有右端项的情形。若 $\\det A = 0$，则某些 $\\mathbf{b}$ 无解，其余的有无穷多解。",
      ),
      generate(rng: Rng): Problem {
        const singular = rng.int(0, 1) === 1;
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const m = rng.pick([-3, -2, 2, 3]);
        const c = singular ? m * a : rng.nonZero(-5, 5);
        let d = singular ? m * b : rng.int(-5, 5);
        if (!singular && a * d - b * c === 0) d += 1;
        const det = a * d - b * c;
        const [right, wrong] = yesNoText(det !== 0);
        return oneOf(
          rng,
          t(
            `Does $\\begin{cases} ${formatLinear2(a, b)} = b_1 \\\\ ${formatLinear2(c, d)} = b_2 \\end{cases}$ have exactly one solution for every choice of $b_1$ and $b_2$?`,
            `对任意 $b_1$、$b_2$，$\\begin{cases} ${formatLinear2(a, b)} = b_1 \\\\ ${formatLinear2(c, d)} = b_2 \\end{cases}$ 都恰有一个解吗？`,
          ),
          right,
          [wrong],
          t(
            `$\\det A = ${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$, ${det !== 0 ? "which is nonzero, so $A$ is invertible and every system has a unique solution." : "so $A$ is singular and the solution is never unique."}`,
            `$\\det A = ${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}$，${det !== 0 ? "非零，所以 $A$ 可逆，每个方程组都有唯一解。" : "所以 $A$ 奇异，解永远不唯一。"}`,
          ),
        );
      },
    },
  ],
};

// ─── 2.7.2 Finding Inverse of 2x2 Matrix Using Row Operations ─────────────────

/** findingTheInverseOfA2x2MatrixUsingRowOperations covers Gauss-Jordan [A | I] -> [I | A^-1]. */
export const findingTheInverseOfA2x2MatrixUsingRowOperations: TopicDef = {
  id: "finding-the-inverse-of-a-2x2-matrix-using-row-operations",
  title: t("Finding the Inverse of a 2x2 Matrix Using Row Operations", "初等行变换求二阶逆矩阵"),
  summary: t(
    "Compute the inverse of an invertible $2 \\times 2$ matrix using Gauss-Jordan elimination on $[A \\mid I_2]$.",
    "利用高斯-约当消元法对增广矩阵 $[A \\mid I_2]$ 进行初等行变换，求出 $2 \\times 2$ 矩阵的逆 $A^{-1}$。",
  ),
  prerequisites: ["row-operations-on-2x2-matrices-as-products-of-elementary-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "gauss-jordan-inverse-2x2",
      title: t("Gauss-Jordan inversion algorithm for 2x2 matrices", "二阶矩阵的高斯-约当求逆算法"),
      explanation: t(
        "To find $A^{-1}$, form the augmented matrix $[A \\mid I_2]$. Apply row operations to transform the left block $A$ into $I_2$. The right block will simultaneously transform into $A^{-1}$: $[A \\mid I_2] \\to [I_2 \\mid A^{-1}]$.",
        "求逆矩阵 $A^{-1}$ 时，构造增广矩阵 $[A \\mid I_2]$。通过初等行变换将左侧的 $A$ 化为单位矩阵 $I_2$，右侧的单位矩阵将随之同步转化为逆矩阵 $A^{-1}$：$[A \\mid I_2] \\to [I_2 \\mid A^{-1}]$。",
      ),
      generate(rng) {
        // Construct 2x2 matrix with integer inverse:
        // det = 1 or -1
        const a = rng.pick([1, 2, 3, -1, -2]);
        const d = rng.pick([1, 2, 3, -1, -2]);
        // ad - bc = 1 => bc = ad - 1
        const prod = a * d - 1;
        // find factors of prod
        const factors = [-4, -3, -2, -1, 1, 2, 3, 4].filter((b) => b !== 0 && prod % b === 0);
        const b = factors.length > 0 ? rng.pick(factors) : 1;
        const c = factors.length > 0 ? prod / b : a * d - 1;

        const A: Mat = [
          [a, b],
          [c, d],
        ];
        const detA = a * d - b * c; // detA is 1

        const invA: Mat = [
          [d, -b],
          [-c, a],
        ];

        const wrong1: Mat = [
          [a, b],
          [c, d],
        ];
        const wrong2: Mat = [
          [-d, b],
          [c, -a],
        ];
        const wrong3: Mat = [
          [d, b],
          [c, a],
        ];

        const prompt = t(
          `Find the inverse $A^{-1}$ using Gauss-Jordan row elimination on $[A \\mid I_2]$:

$$A = ${matLatex(A)}$$`,
          `利用高斯-约当消元法对 $[A \\mid I_2]$ 实施初等行变换，求 $A$ 的逆矩阵 $A^{-1}$：

$$A = ${matLatex(A)}$$`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$$${matLatex(invA)}$$`, `$$${matLatex(invA)}$$`),
          [
            t(`$$${matLatex(wrong1)}$$`, `$$${matLatex(wrong1)}$$`),
            t(`$$${matLatex(wrong2)}$$`, `$$${matLatex(wrong2)}$$`),
            t(`$$${matLatex(wrong3)}$$`, `$$${matLatex(wrong3)}$$`),
          ],
          t(
            `Setting up the augmented matrix $[A \\mid I_2] = \\left[\\begin{array}{cc|cc} ${a} & ${b} & 1 & 0 \\\\ ${c} & ${d} & 0 & 1 \\end{array}\\right]$ and reducing the left side to $I_2$ yields $[I_2 \\mid A^{-1}]$. Since $\\det(A) = ${detA}$, $A^{-1} = \\frac{1}{${detA}} \\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix} = ${matLatex(invA)}$.`,
            `构造增广矩阵 $[A \\mid I_2] = \\left[\\begin{array}{cc|cc} ${a} & ${b} & 1 & 0 \\\\ ${c} & ${d} & 0 & 1 \\end{array}\\right]$，并通过初等行变换将左侧化为 $I_2$，右侧即为 $A^{-1}$。由 $\\det(A) = ${detA}$ 得 $A^{-1} = \\frac{1}{${detA}} \\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix} = ${matLatex(invA)}$。`,
          ),
        );
      },
    },
    {
      id: "an-off-diagonal-entry-of-a-2x2-inverse",
      title: t("An off-diagonal entry of a 2×2 inverse", "2×2 逆矩阵的非对角元素"),
      explanation: t(
        "Row reducing $[A \\mid I]$ for $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ always ends with\n\n$$A^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}.$$\n\nThe diagonal entries swap places, the off-diagonal entries change sign, and everything is divided by the determinant. Knowing the result lets you check each row reduction.",
        "对 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 把 $[A \\mid I]$ 作行化简，结果总是\n\n$$A^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$\n\n对角元素互换位置，非对角元素变号，全部除以行列式。知道结果可以检验每一步行化简。",
      ),
      generate(rng: Rng): Problem {
        let a = 0;
        let b = 0;
        let c = 0;
        let d = 0;
        while (a * d - b * c === 0) {
          a = rng.int(-5, 5);
          b = rng.nonZero(-5, 5);
          c = rng.nonZero(-5, 5);
          d = rng.int(-5, 5);
        }
        const det = a * d - b * c;
        const top = rng.int(0, 1) === 0;
        const ans = Q.of(top ? -b : -c, det);
        return numberProblem({
          prompt: t(
            `Find the $(${top ? "1, 2" : "2, 1"})$ entry of $A^{-1}$ for $A = ${matLatex([
              [a, b],
              [c, d],
            ])}$.`,
            `求 $A = ${matLatex([
              [a, b],
              [c, d],
            ])}$ 的逆矩阵 $A^{-1}$ 的 $(${top ? "1, 2" : "2, 1"})$ 元素。`,
          ),
          answer: ans,
          wrong: [ans.neg(), Q.of(top ? -c : -b, det), Q.of(top ? b : c), Q.of(1, top ? b : c)],
          solution: t(
            `$\\det A = ${det}$, and the $(${top ? "1, 2" : "2, 1"})$ entry of $A^{-1}$ is $\\frac{${top ? -b : -c}}{${det}} = ${ans.toLatex()}$.`,
            `$\\det A = ${det}$，$A^{-1}$ 的 $(${top ? "1, 2" : "2, 1"})$ 元素为 $\\frac{${top ? -b : -c}}{${det}} = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.7.3 Finding Inverse of 3x3 Matrix Using Row Operations ─────────────────

/** findingTheInverseOfA3x3MatrixUsingRowOperations covers Gauss-Jordan on [A | I_3]. */
export const findingTheInverseOfA3x3MatrixUsingRowOperations: TopicDef = {
  id: "finding-the-inverse-of-a-3x3-matrix-using-row-operations",
  title: t("Finding the Inverse of a 3x3 Matrix Using Row Operations", "初等行变换求三阶逆矩阵"),
  summary: t(
    "Use Gauss-Jordan elimination on $[A \\mid I_3]$ to find the inverse of a $3 \\times 3$ matrix.",
    "通过高斯-约当消元法对增广矩阵 $[A \\mid I_3]$ 实施行变换，求出 $3 \\times 3$ 矩阵的逆 $A^{-1}$。",
  ),
  prerequisites: [
    "finding-the-inverse-of-a-2x2-matrix-using-row-operations",
    "row-operations-on-3x3-matrices-as-products-of-elementary-matrices",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "gauss-jordan-inverse-3x3",
      title: t("Gauss-Jordan inversion for 3x3 matrices", "三阶矩阵的高斯-约当求逆"),
      explanation: t(
        "For an invertible $3 \\times 3$ matrix $A$, augment with the identity: $[A \\mid I_3]$. Use forward elimination to create an upper triangular block, scale diagonals to 1, and backward elimination to clear entries above each pivot: $[A \\mid I_3] \\to [I_3 \\mid A^{-1}]$.",
        "对于可逆的三阶方阵 $A$，将其与单位矩阵拼接成增广矩阵 $[A \\mid I_3]$。先通过前向消元将其化为上三角形式，将主对角线元素化为 1，再通过反向消元消去主元上方的全部非零元素：$[A \\mid I_3] \\to [I_3 \\mid A^{-1}]$。",
      ),
      generate(rng) {
        // Construct unit upper triangular matrix with integer inverse
        const u12 = rng.pick([1, 2, -1]);
        const u13 = rng.pick([-2, 1, 3]);
        const u23 = rng.pick([2, -1, 1]);

        const A: Mat = [
          [1, u12, u13],
          [0, 1, u23],
          [0, 0, 1],
        ];

        // Inverse of unit upper triangular matrix:
        // A^-1 = [[1, -u12, u12*u23 - u13], [0, 1, -u23], [0, 0, 1]]
        const invA: Mat = [
          [1, -u12, u12 * u23 - u13],
          [0, 1, -u23],
          [0, 0, 1],
        ];

        const wrong1: Mat = [
          [1, -u12, -u13],
          [0, 1, -u23],
          [0, 0, 1],
        ];
        const wrong2: Mat = [
          [1, u12, u13],
          [0, 1, u23],
          [0, 0, 1],
        ];
        const wrong3: Mat = [
          [1, 0, 0],
          [-u12, 1, 0],
          [-u13, -u23, 1],
        ];

        const prompt = t(
          `Find the inverse $A^{-1}$ using Gauss-Jordan row operations on $[A \\mid I_3]$:

$$A = ${matLatex(A)}$$`,
          `利用高斯-约当行变换对 $[A \\mid I_3]$ 进行消元，求 $A$ 的逆矩阵 $A^{-1}$：

$$A = ${matLatex(A)}$$`,
        );
        return reasoned(
          oneOf(
            rng,
            prompt,
            t(`$$${matLatex(invA)}$$`, `$$${matLatex(invA)}$$`),
            [
              t(`$$${matLatex(wrong1)}$$`, `$$${matLatex(wrong1)}$$`),
              t(`$$${matLatex(wrong2)}$$`, `$$${matLatex(wrong2)}$$`),
              t(`$$${matLatex(wrong3)}$$`, `$$${matLatex(wrong3)}$$`),
            ],
            t(
              `Augmenting with $I_3$ gives $[A \\mid I_3]$. Since $A$ is already in upper triangular form with 1s on the diagonal, backward elimination clears entries above the pivots:
1. $R_2 - (${u23}) R_3 \\to R_2$
2. $R_1 - (${u13}) R_3 \\to R_1$
3. $R_1 - (${u12}) R_2 \\to R_1$
This transforms the right block into $A^{-1} = ${matLatex(invA)}$.`,
              `增广单位矩阵得到 $[A \\mid I_3]$。由于 $A$ 已经是对角线为 1 的上三角矩阵，只需执行反向消元消去主元上方的元素：
1. $R_2 - (${u23}) R_3 \\to R_2$
2. $R_1 - (${u13}) R_3 \\to R_1$
3. $R_1 - (${u12}) R_2 \\to R_1$
右侧对应的矩阵即为 $A^{-1} = ${matLatex(invA)}$。`,
            ),
          ),
          [
            [
              `$$${matLatex(wrong1)}$$`,
              "Negating each entry works for the first row's middle entry but not its corner: the corner also collects a term from the two row operations.",
              "把每个元素变号对第一行中间的元素可行，但对右上角不行：右上角还要加上两次行变换带来的一项。",
            ],
            [
              `$$${matLatex(wrong2)}$$`,
              "This is $A$ itself: its product with $A$ is not the identity.",
              "这就是 $A$ 本身：它与 $A$ 的积不是单位矩阵。",
            ],
            [
              `$$${matLatex(wrong3)}$$`,
              "The inverse of an upper triangular matrix is upper triangular, and this is lower triangular.",
              "上三角矩阵的逆也是上三角的，而这个是下三角的。",
            ],
          ],
        );
      },
    },
    {
      id: "the-corner-entry-of-the-inverse-of-a-unit-upper-triangular-matrix",
      title: t("The corner entry of a unit upper triangular inverse", "单位上三角矩阵逆的角元素"),
      explanation: t(
        "For $U = \\begin{pmatrix} 1 & a & b \\\\ 0 & 1 & c \\\\ 0 & 0 & 1 \\end{pmatrix}$, row reducing $[U \\mid I]$ from the bottom up clears column $3$ with $R_2 - cR_3$ and $R_1 - bR_3$, then column $2$ with $R_1 - aR_2$. The result is\n\n$$U^{-1} = \\begin{pmatrix} 1 & -a & ac - b \\\\ 0 & 1 & -c \\\\ 0 & 0 & 1 \\end{pmatrix}.$$\n\nThe corner entry is not simply $-b$, because clearing column $2$ also changes column $3$ of the right block.",
        "对 $U = \\begin{pmatrix} 1 & a & b \\\\ 0 & 1 & c \\\\ 0 & 0 & 1 \\end{pmatrix}$，自下而上化简 $[U \\mid I]$：先用 $R_2 - cR_3$ 和 $R_1 - bR_3$ 消去第 $3$ 列，再用 $R_1 - aR_2$ 消去第 $2$ 列。结果为\n\n$$U^{-1} = \\begin{pmatrix} 1 & -a & ac - b \\\\ 0 & 1 & -c \\\\ 0 & 0 & 1 \\end{pmatrix}$$\n\n角元素并不只是 $-b$，因为消去第 $2$ 列时右侧块的第 $3$ 列也随之改变。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.int(-5, 5);
        const c = rng.nonZero(-5, 5);
        const ans = a * c - b;
        const U = [
          [1, a, b],
          [0, 1, c],
          [0, 0, 1],
        ];
        return numberProblem({
          prompt: t(
            `Find the $(1, 3)$ entry of $U^{-1}$ for $U = ${matLatex(U)}$.`,
            `求 $U = ${matLatex(U)}$ 的逆矩阵 $U^{-1}$ 的 $(1, 3)$ 元素。`,
          ),
          answer: ans,
          wrong: [-b, b - a * c, -a * c - b, a * c],
          solution: t(
            `Using the formula, the $(1, 3)$ entry is $ac - b = ${paren(a)} \\cdot ${paren(c)} - ${paren(b)} = ${ans}$.`,
            `由公式，$(1, 3)$ 元素为 $ac - b = ${paren(a)} \\cdot ${paren(c)} - ${paren(b)} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.7.4 Finding Inverse of NxN Square Matrix Using Row Operations ──────────

/** findingTheInverseOfAnNxnSquareMatrixUsingRowOperations covers general inversion. */
export const findingTheInverseOfAnNxnSquareMatrixUsingRowOperations: TopicDef = {
  id: "finding-the-inverse-of-an-nxn-square-matrix-using-row-operations",
  title: t("Finding the Inverse of an NxN Square Matrix Using Row Operations", "高斯-约当消元法求 N 阶逆矩阵"),
  summary: t(
    "Master the general Gauss-Jordan inversion algorithm and detect singularity when a zero row appears.",
    "掌握高斯-约当求逆通法，并在消元过程中左侧出现全零行时判定方阵不可逆（奇异）。",
  ),
  prerequisites: ["finding-the-inverse-of-a-3x3-matrix-using-row-operations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "gauss-jordan-inversion-algorithm",
      title: t("General Gauss-Jordan inversion and singularity detection", "高斯-约当求逆通法与奇异性判定"),
      explanation: t(
        "For an $n \\times n$ matrix $A$, row reducing $[A \\mid I_n]$ either produces $[I_n \\mid A^{-1}]$ if $\\text{rank}(A) = n$, or produces a row of zeros in the left block if $\\text{rank}(A) < n$. If a row of zeros appears in the left block, $A$ cannot be reduced to $I_n$ and therefore has no inverse (it is not invertible).",
        "对于 $n \\times n$ 矩阵 $A$，对 $[A \\mid I_n]$ 进行行化简：若 $\\text{rank}(A) = n$，则可化为 $[I_n \\mid A^{-1}]$；若 $\\text{rank}(A) < n$，则左侧必然出现全零行。一旦左侧出现全零行，说明 $A$ 无法化为单位矩阵，因此矩阵不可逆（没有逆矩阵）。",
      ),
      generate(rng) {
        const n = rng.pick([3, 4, 5]);
        const a1 = rng.pick([1, 2, 3, 4, 5]);
        const a2 = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const a3 = rng.pick([-3, -1, 2, 5]);
        const singular = rng.bool();
        const outcome = singular
          ? t("forward elimination produces a row of zeros in the left block", "左侧部分出现了一行全零行")
          : t(`the left block becomes $I_{${n}}$`, `左侧部分化成了 $I_{${n}}$`);
        const prompt = t(
          `During the Gauss-Jordan inversion of ${article(n)} $${n} \\times ${n}$ matrix $A$ with first row $[${a1}, ${a2}, ${a3}, \\dots]$, ${outcome.en} of $[A \\mid I_{${n}}]$. What conclusion must follow?`,
          `在对首行为 $[${a1}, ${a2}, ${a3}, \\dots]$ 的 $${n} \\times ${n}$ 矩阵 $A$ 实施高斯-约当求逆消元 $[A \\mid I_{${n}}]$ 的过程中，若${outcome["zh-CN"]}，可以得出什么结论？`,
        );
        const options = [
          t("Matrix $A$ is singular and has no inverse", "矩阵 $A$ 是奇异矩阵，没有逆矩阵（不可逆）"),
          t("$A$ is invertible, and the right block is $A^{-1}$", "$A$ 可逆，右侧部分就是 $A^{-1}$"),
          t("The inverse matrix $A^{-1}$ has a row of zeros", "逆矩阵 $A^{-1}$ 必然包含一个全零行"),
          t("Matrix $A$ has infinitely many inverses", "矩阵 $A$ 拥有无穷多个逆矩阵"),
        ];
        return choiceProblem({
          prompt,
          options,
          correct: singular ? 0 : 1,
          solution: singular
            ? t(
                `If a row of zeros appears in the left block during row reduction, $\\text{rank}(A) < ${n}$. Since an $n \\times n$ matrix is invertible if and only if $\\text{rank}(A) = n$, $A$ cannot be transformed into the identity matrix $I_{${n}}$. Therefore, $A$ is singular and has no inverse.`,
                `若行化简过程中左侧块出现全零行，说明 $\\text{rank}(A) < ${n}$。因为 $n \\times n$ 矩阵可逆当且仅当其满秩（$\\text{rank}(A) = n$），故 $A$ 无法化为单位矩阵 $I_{${n}}$，因此 $A$ 必然是奇异矩阵，没有逆矩阵。`,
              )
            : t(
                `The row operations amount to multiplying on the left by one invertible matrix $E$. If $EA = I_{${n}}$, then $E = A^{-1}$, and the right block is $EI_{${n}} = A^{-1}$. An inverse is unique, and it is invertible itself, so it has no row of zeros.`,
                `行变换相当于左乘一个可逆矩阵 $E$。若 $EA = I_{${n}}$，则 $E = A^{-1}$，右侧部分为 $EI_{${n}} = A^{-1}$。逆矩阵是唯一的，且本身可逆，所以没有全零行。`,
              ),
        });
      },
    },
    {
      id: "the-inverse-of-a-bidiagonal-matrix",
      title: t("The inverse of a bidiagonal matrix", "双对角矩阵的逆"),
      explanation: t(
        "Let $B$ be the $n \\times n$ matrix with $1$ on the diagonal and $-a$ directly above it, so $B = I - aN$ where $N$ shifts entries one place. Since $N^n = 0$, the geometric series stops:\n\n$$B^{-1} = I + aN + a^2N^2 + \\dots + a^{n-1}N^{n-1}.$$\n\nSo the $(i, j)$ entry of $B^{-1}$ for $j \\ge i$ is $a^{j-i}$, and in particular the top-right entry is $a^{n-1}$. Gauss-Jordan elimination on $[B \\mid I]$ gives the same result row by row.",
        "设 $B$ 是对角线为 $1$、紧邻上方为 $-a$ 的 $n \\times n$ 矩阵，即 $B = I - aN$，其中 $N$ 把元素平移一位。由于 $N^n = 0$，几何级数终止：\n\n$$B^{-1} = I + aN + a^2N^2 + \\dots + a^{n-1}N^{n-1}$$\n\n所以当 $j \\ge i$ 时 $B^{-1}$ 的 $(i, j)$ 元素为 $a^{j-i}$，特别地右上角元素为 $a^{n-1}$。对 $[B \\mid I]$ 作高斯-若尔当消元逐行得到同样结果。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(3, 5);
        const a = rng.pick([-3, -2, 2, 3]);
        const B = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : j === i + 1 ? -a : 0)));
        const i = 1;
        const j = rng.int(2, n);
        const ans = a ** (j - i);
        return numberProblem({
          prompt: t(
            `Find the $(${i}, ${j})$ entry of $B^{-1}$ for $B = ${matLatex(B)}$.`,
            `求 $B = ${matLatex(B)}$ 的逆矩阵 $B^{-1}$ 的 $(${i}, ${j})$ 元素。`,
          ),
          answer: ans,
          wrong: [-ans, (-a) ** (j - i), a * (j - i), j === 2 ? 0 : a ** (j - i - 1)],
          solution: t(
            `$B = I - ${paren(a)}N$, so $B^{-1} = \\sum_k ${paren(a)}^kN^k$ and the $(${i}, ${j})$ entry is $${paren(a)}^{${j - i}} = ${ans}$.`,
            `$B = I - ${paren(a)}N$，所以 $B^{-1} = \\sum_k ${paren(a)}^kN^k$，其 $(${i}, ${j})$ 元素为 $${paren(a)}^{${j - i}} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.7.5 Matrices With Easy-to-Find Inverses ────────────────────────────────

/** matricesWithEasyToFindInverses covers diagonal, orthogonal, and block diagonal. */
export const matricesWithEasyToFindInverses: TopicDef = {
  id: "matrices-with-easy-to-find-inverses",
  title: t("Matrices With Easy-to-Find Inverses", "特殊矩阵的逆矩阵"),
  summary: t(
    "Invert special matrices directly: a diagonal matrix has $D^{-1} = \\operatorname{diag}(1/d_i)$, and an orthogonal matrix has $Q^{-1} = Q^T$.",
    "直接求特殊矩阵的逆：对角矩阵 $D^{-1} = \\operatorname{diag}(1/d_i)$，正交矩阵 $Q^{-1} = Q^T$。",
  ),
  prerequisites: ["finding-the-inverse-of-an-nxn-square-matrix-using-row-operations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "special-matrix-inverses",
      title: t("Inverses of diagonal and orthogonal matrices", "对角矩阵与正交矩阵的求逆"),
      explanation: t(
        "Special matrix families have immediate formulas for their inverses: (1) Diagonal matrix: $\\text{diag}(d_1, \\dots, d_n)^{-1} = \\text{diag}(1/d_1, \\dots, 1/d_n)$; (2) Orthogonal matrix ($Q^T Q = I$): $Q^{-1} = Q^T$; (3) Block diagonal matrix: $\\text{diag}(A, B)^{-1} = \\text{diag}(A^{-1}, B^{-1})$.",
        "某些特殊矩阵类可以直接写出逆矩阵：(1) 对角矩阵：$\\text{diag}(d_1, \\dots, d_n)^{-1} = \\text{diag}(1/d_1, \\dots, 1/d_n)$；(2) 正交矩阵（$Q^T Q = I$）：$Q^{-1} = Q^T$；(3) 分块对角矩阵：$\\text{diag}(A, B)^{-1} = \\text{diag}(A^{-1}, B^{-1})$。",
      ),
      generate(rng) {
        const d1 = rng.pick([2, 3, 4, 5]);
        const d2 = rng.pick([-2, -3, -4]);
        const d3 = rng.pick([1, 2, 6]);

        const D: Mat = [
          [d1, 0, 0],
          [0, d2, 0],
          [0, 0, d3],
        ];

        const invDStr = `\\begin{pmatrix} \\frac{1}{${d1}} & 0 & 0 \\\\ 0 & -\\frac{1}{${-d2}} & 0 \\\\ 0 & 0 & ${d3 === 1 ? "1" : `\\frac{1}{${d3}}`} \\end{pmatrix}`;
        const wrong1Str = `\\begin{pmatrix} -${d1} & 0 & 0 \\\\ 0 & ${-d2} & 0 \\\\ 0 & 0 & -${d3} \\end{pmatrix}`;
        const wrong2Str = `\\begin{pmatrix} ${d3} & 0 & 0 \\\\ 0 & ${d2} & 0 \\\\ 0 & 0 & ${d1} \\end{pmatrix}`;
        const wrong3Str = `\\begin{pmatrix} \\frac{1}{${d1}} & \\frac{1}{${d2}} & \\frac{1}{${d3}} \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}`;

        const prompt = t(
          `What is the inverse of the diagonal matrix $D$?

$$D = ${matLatex(D)}$$`,
          `下列对角矩阵 $D$ 的逆矩阵 $D^{-1}$ 是哪一个？

$$D = ${matLatex(D)}$$`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$$${invDStr}$$`, `$$${invDStr}$$`),
          [t(`$$${wrong1Str}$$`, `$$${wrong1Str}$$`), t(`$$${wrong2Str}$$`, `$$${wrong2Str}$$`), t(`$$${wrong3Str}$$`, `$$${wrong3Str}$$`)],
          t(
            `For any diagonal matrix $D = \\text{diag}(d_1, d_2, d_3)$ with non-zero entries, its inverse is obtained by simply reciprocating each diagonal entry: $D^{-1} = \\text{diag}(1/d_1, 1/d_2, 1/d_3) = ${invDStr}$.`,
            `对任意主对角线非零的对角矩阵 $D = \\text{diag}(d_1, d_2, d_3)$，其逆矩阵只需将对角线上的每个元素分别取倒数：$D^{-1} = \\text{diag}(1/d_1, 1/d_2, 1/d_3) = ${invDStr}$。`,
          ),
        );
      },
    },
    {
      id: "the-inverse-of-a-permutation-matrix-is-its-transpose",
      title: t("The inverse of a permutation matrix is its transpose", "置换矩阵的逆是其转置"),
      explanation: t(
        "A permutation matrix $P$ has orthonormal columns, so $P^TP = I$ and $P^{-1} = P^T$. To find where the $1$ in row $i$ of $P^{-1}$ sits, read column $i$ of $P$: if its $1$ is in row $k$, then row $i$ of $P^{-1}$ has its $1$ in column $k$. No row reduction is needed.",
        "置换矩阵 $P$ 的各列标准正交，所以 $P^TP = I$，$P^{-1} = P^T$。要找 $P^{-1}$ 第 $i$ 行中 $1$ 的位置，只需看 $P$ 的第 $i$ 列：若其 $1$ 在第 $k$ 行，则 $P^{-1}$ 的第 $i$ 行的 $1$ 在第 $k$ 列。无需行化简。",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(3, 5);
        let sigma = rng.shuffle(Array.from({ length: n }, (_, i) => i));
        if (sigma.every((s, i) => s === i)) sigma = [...sigma.slice(1), sigma[0]!];
        const P = sigma.map((s) => Array.from({ length: n }, (_, j) => (j === s ? 1 : 0)));
        const i = rng.int(0, n - 1);
        const k = sigma.indexOf(i);
        return numberProblem({
          prompt: t(
            `For $P = ${matLatex(P)}$, in which column is the $1$ in row $${i + 1}$ of $P^{-1}$?`,
            `对 $P = ${matLatex(P)}$，$P^{-1}$ 第 $${i + 1}$ 行中的 $1$ 在第几列？`,
          ),
          answer: k + 1,
          wrong: [sigma[i]! + 1, i + 1, n - k],
          solution: t(
            `$P^{-1} = P^T$, so row $${i + 1}$ of $P^{-1}$ is column $${i + 1}$ of $P$, whose $1$ is in row $${k + 1}$. The answer is column $${k + 1}$.`,
            `$P^{-1} = P^T$，所以 $P^{-1}$ 的第 $${i + 1}$ 行就是 $P$ 的第 $${i + 1}$ 列，其 $1$ 在第 $${k + 1}$ 行。答案是第 $${k + 1}$ 列。`,
          ),
        });
      },
    },
  ],
};

// ─── Module 2.8. LU Factorization ────────────────────────────────────────────

// ─── 2.8.1 Triangular Matrices ───────────────────────────────────────────────

/** triangularMatrices defines upper, lower, and unit triangular matrix properties. */
export const triangularMatrices: TopicDef = {
  id: "triangular-matrices",
  title: t("Triangular Matrices", "上三角与下三角矩阵"),
  summary: t(
    "Identify upper, lower, and unit triangular matrices and compute their determinants and products.",
    "理解上三角矩阵、下三角矩阵及单位三角矩阵的性质，计算其行列式与矩阵乘积。",
  ),
  prerequisites: ["gaussian-elimination-for-nxm-systems-of-equations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "triangular-matrices-properties",
      title: t("Properties of upper and lower triangular matrices", "三角矩阵的基本性质与行列式"),
      explanation: t(
        "A square matrix $U$ is upper triangular if $u_{ij} = 0$ for all $i > j$. A square matrix $L$ is lower triangular if $l_{ij} = 0$ for all $i < j$. A unit triangular matrix additionally has all 1s on its main diagonal. Key properties: (1) The product of two upper (lower) triangular matrices is upper (lower) triangular; (2) The determinant of any triangular matrix is simply the product of its diagonal entries.",
        "若方阵 $U$ 满足对所有 $i > j$ 均有 $u_{ij} = 0$，则称其为上三角矩阵。若方阵 $L$ 满足对所有 $i < j$ 均有 $l_{ij} = 0$，则称其为下三角矩阵。主对角线元素全为 1 的三角矩阵称为单位三角矩阵。关键性质：(1) 两个上（下）三角矩阵的乘积仍为上（下）三角矩阵；(2) 任意三角矩阵的行列式直接等于其主对角线上所有元素的乘积。",
      ),
      generate(rng) {
        const d1 = rng.pick([2, 3, 4, -2]);
        const d2 = rng.pick([1, 2, 3, -1]);
        const d3 = rng.pick([3, 4, -3]);

        const u12 = rng.pick([-2, 1, 3]);
        const u13 = rng.pick([1, -4, 2]);
        const u23 = rng.pick([-1, 2, 5]);

        const U: Mat = [
          [d1, u12, u13],
          [0, d2, u23],
          [0, 0, d3],
        ];

        const detU = d1 * d2 * d3;

        const prompt = t(
          `What is the determinant of the upper triangular matrix $U$?

$$U = ${matLatex(U)}$$`,
          `下列上三角矩阵 $U$ 的行列式是多少？

$$U = ${matLatex(U)}$$`,
        );

        return numberProblem({
          prompt,
          answer: detU,
          solution: t(
            `For any triangular matrix (upper or lower), the determinant equals the product of its diagonal entries: $\\det(U) = (${d1}) \\cdot (${d2}) \\cdot (${d3}) = ${detU}$.`,
            `对任意三角矩阵（无论上三角或下三角），其行列式直接等于主对角线元素的乘积：$\\det(U) = (${d1}) \\cdot (${d2}) \\cdot (${d3}) = ${detU}$。`,
          ),
          wrong: [d1 + d2 + d3, -detU, detU + u12, d1 * d2 + d3],
        });
      },
    },
    {
      id: "an-entry-of-a-product-of-upper-triangular-matrices",
      title: t("An entry of a product of upper triangular matrices", "上三角矩阵乘积的元素"),
      explanation: t(
        "The product of two upper triangular matrices is upper triangular. In the $(i, j)$ entry $\\sum_k u_{ik}v_{kj}$, the term is zero unless $i \\le k \\le j$, so only a few products survive. For example the $(1, 2)$ entry of $UV$ is $u_{11}v_{12} + u_{12}v_{22}$, and the diagonal entries are just $u_{ii}v_{ii}$.",
        "两个上三角矩阵的乘积仍是上三角矩阵。在 $(i, j)$ 元素 $\\sum_k u_{ik}v_{kj}$ 中，除非 $i \\le k \\le j$，否则该项为零，所以只剩下少数几项。例如 $UV$ 的 $(1, 2)$ 元素为 $u_{11}v_{12} + u_{12}v_{22}$，对角元素就是 $u_{ii}v_{ii}$。",
      ),
      generate(rng: Rng): Problem {
        const up = () => [
          [rng.nonZero(-3, 3), rng.int(-4, 4), rng.int(-4, 4)],
          [0, rng.nonZero(-3, 3), rng.int(-4, 4)],
          [0, 0, rng.nonZero(-3, 3)],
        ];
        const U = up();
        const V = up();
        const W = matMul(U, V);
        const [i, j] = rng.pick([
          [1, 2],
          [2, 3],
          [1, 3],
        ] as const);
        const ans = W[i - 1]![j - 1]!;
        const terms = Array.from({ length: j - i + 1 }, (_, s) => i + s).map(
          (k) => `${paren(U[i - 1]![k - 1]!)} \\cdot ${paren(V[k - 1]![j - 1]!)}`,
        );
        return numberProblem({
          prompt: t(
            `Find the $(${i}, ${j})$ entry of $UV$ for $U = ${matLatex(U)}$ and $V = ${matLatex(V)}$.`,
            `对 $U = ${matLatex(U)}$ 和 $V = ${matLatex(V)}$，求 $UV$ 的 $(${i}, ${j})$ 元素。`,
          ),
          answer: ans,
          wrong: [U[i - 1]![j - 1]! * V[i - 1]![j - 1]!, matMul(V, U)[i - 1]![j - 1]!, U[i - 1]![j - 1]! + V[i - 1]![j - 1]!, -ans],
          solution: t(
            `Only $k$ from $${i}$ to $${j}$ contribute: $${terms.join(" + ")} = ${ans}$.`,
            `只有 $k$ 从 $${i}$ 到 $${j}$ 的项有贡献：$${terms.join(" + ")} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.8.2 LU Factorization of 2x2 Matrices ───────────────────────────────────

/** luFactorizationOf2x2Matrices covers A = LU factoring for 2x2. */
export const luFactorizationOf2x2Matrices: TopicDef = {
  id: "lu-factorization-of-2x2-matrices",
  title: t("LU Factorization of 2x2 Matrices", "二阶矩阵的 LU 分解"),
  summary: t(
    "Factor 2x2 matrices into A = LU with unit lower triangular L and upper triangular U.",
    "将二阶矩阵分解为 A = LU，其中 L 为单位下三角矩阵，U 为上三角矩阵。",
  ),
  prerequisites: ["triangular-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "lu-factorization-2x2",
      title: t("Computing the LU factorization of a 2x2 matrix", "二阶矩阵的 LU 分解计算"),
      explanation: t(
        "The lower factor records the multiplier used to eliminate the entry below the pivot, and the upper factor is the matrix left after elimination. For a $2 \\times 2$ matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ with $a \\ne 0$, Gaussian elimination uses multiplier $l_{21} = \\frac{c}{a}$ in the operation $R_2 - l_{21} R_1 \\to R_2$. This yields $A = L U$, where $L = \\begin{pmatrix} 1 & 0 \\\\ l_{21} & 1 \\end{pmatrix}$ and $U = \\begin{pmatrix} a & b \\\\ 0 & d - l_{21} b \\end{pmatrix}$.",
        "下三角因子记录了消去主元下方元素时用的乘数，上三角因子是消元后剩下的矩阵。对于 $a \\ne 0$ 的二阶矩阵 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$，高斯消元法利用乘子 $l_{21} = \\frac{c}{a}$ 进行行变换 $R_2 - l_{21} R_1 \\to R_2$。这给出分解 $A = L U$，其中 $L = \\begin{pmatrix} 1 & 0 \\\\ l_{21} & 1 \\end{pmatrix}$，$U = \\begin{pmatrix} a & b \\\\ 0 & d - l_{21} b \\end{pmatrix}$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 2, 3]);
        const b = rng.pick([-2, 1, 3, 4]);
        const l21 = rng.pick([2, 3, 4, -2, -3]);
        const c = l21 * a;
        const u22 = rng.pick([1, 2, 3, -1, -2]);
        const d = l21 * b + u22;

        const A: Mat = [
          [a, b],
          [c, d],
        ];
        const L: Mat = [
          [1, 0],
          [l21, 1],
        ];
        const U: Mat = [
          [a, b],
          [0, u22],
        ];

        const rightStr = `L = ${matLatex(L)}, \\quad U = ${matLatex(U)}`;
        const wrong1Str = `L = ${matLatex([
          [1, 0],
          [-l21, 1],
        ])}, \\quad U = ${matLatex(U)}`;
        const wrong2Str = `L = ${matLatex(U)}, \\quad U = ${matLatex(L)}`;
        const wrong3Str = `L = ${matLatex([
          [1, l21],
          [0, 1],
        ])}, \\quad U = ${matLatex(U)}`;

        const prompt = t(
          `Find the $LU$ factorization ($A = LU$) of the matrix $A$ where $L$ is unit lower triangular and $U$ is upper triangular:

$$A = ${matLatex(A)}$$`,
          `求矩阵 $A$ 的 $LU$ 分解（$A = LU$），其中 $L$ 为单位下三角矩阵，$U$ 为上三角矩阵：

$$A = ${matLatex(A)}$$`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$$${rightStr}$$`, `$$${rightStr}$$`),
          [t(`$$${wrong1Str}$$`, `$$${wrong1Str}$$`), t(`$$${wrong2Str}$$`, `$$${wrong2Str}$$`), t(`$$${wrong3Str}$$`, `$$${wrong3Str}$$`)],
          t(
            `The pivot in row 1 is $a_{11} = ${a}$. The multiplier to eliminate $a_{21} = ${c}$ is $l_{21} = \\frac{${c}}{${a}} = ${l21}$. Subtracting $${l21} R_1$ from $R_2$ produces $u_{22} = ${d} - (${l21})(${b}) = ${u22}$. Thus $L = ${matLatex(L)}$ and $U = ${matLatex(U)}$.`,
            `第 1 行的主元为 $a_{11} = ${a}$。消去 $a_{21} = ${c}$ 所需的乘子为 $l_{21} = \\frac{${c}}{${a}} = ${l21}$。从第 2 行减去第 1 行的 $${l21}$ 倍得到 $u_{22} = ${d} - (${l21})(${b}) = ${u22}$。因此 $L = ${matLatex(L)}$ 且 $U = ${matLatex(U)}$。`,
          ),
        );
      },
    },
    {
      id: "the-second-pivot-in-a-2x2-lu-factorization",
      title: t("The second pivot in a 2×2 $LU$ factorization", "2×2 $LU$ 分解中的第二个主元"),
      explanation: t(
        "For $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ with $a \\ne 0$, the factorization $A = LU$ with $L$ unit lower triangular is\n\n$$L = \\begin{pmatrix} 1 & 0 \\\\ \\frac{c}{a} & 1 \\end{pmatrix}, \\quad U = \\begin{pmatrix} a & b \\\\ 0 & d - \\frac{c}{a}b \\end{pmatrix}.$$\n\nThe multiplier $\\ell_{21} = \\frac{c}{a}$ goes into $L$ and the second pivot $u_{22} = d - \\ell_{21}b$ goes into $U$. Their product with $a$ recovers $\\det A$.",
        "对 $a \\ne 0$ 的 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$，$L$ 为单位下三角矩阵的分解 $A = LU$ 为\n\n$$L = \\begin{pmatrix} 1 & 0 \\\\ \\frac{c}{a} & 1 \\end{pmatrix}, \\quad U = \\begin{pmatrix} a & b \\\\ 0 & d - \\frac{c}{a}b \\end{pmatrix}$$\n\n乘数 $\\ell_{21} = \\frac{c}{a}$ 放入 $L$，第二个主元 $u_{22} = d - \\ell_{21}b$ 放入 $U$。它与 $a$ 之积就是 $\\det A$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.pick([-4, -3, -2, 2, 3, 4, 5]);
        const b = rng.nonZero(-5, 5);
        const c = rng.nonZero(-6, 6);
        const d = rng.int(-6, 6);
        const l = Q.of(c, a);
        const ans = Q.of(d).sub(l.mul(Q.of(b)));
        return numberProblem({
          prompt: t(
            `Find $u_{22}$ in the factorization $A = LU$ ($L$ unit lower triangular) of $A = ${matLatex([
              [a, b],
              [c, d],
            ])}$.`,
            `求 $A = ${matLatex([
              [a, b],
              [c, d],
            ])}$ 的分解 $A = LU$（$L$ 为单位下三角矩阵）中的 $u_{22}$。`,
          ),
          answer: ans,
          wrong: [Q.of(d).add(l.mul(Q.of(b))), l, Q.of(a * d - b * c), Q.of(d)],
          solution: t(
            `$\\ell_{21} = \\frac{${c}}{${a}} = ${l.toLatex()}$, so $u_{22} = ${d} - ${paren(l)} \\cdot ${paren(b)} = ${ans.toLatex()}$.`,
            `$\\ell_{21} = \\frac{${c}}{${a}} = ${l.toLatex()}$，所以 $u_{22} = ${d} - ${paren(l)} \\cdot ${paren(b)} = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.8.3 LU Factorization of 3x3 Matrices ───────────────────────────────────

/** luFactorizationOf3x3Matrices covers Gaussian elimination multipliers forming L. */
export const luFactorizationOf3x3Matrices: TopicDef = {
  id: "lu-factorization-of-3x3-matrices",
  title: t("LU Factorization of 3x3 Matrices", "三阶矩阵的 LU 分解"),
  summary: t(
    "Compute 3x3 LU factorizations: elimination multipliers form L and the final REF forms U.",
    "掌握三阶矩阵的 LU 分解：高斯消元的乘子构成单位下三角矩阵 L，消元结果为上三角矩阵 U。",
  ),
  prerequisites: ["lu-factorization-of-2x2-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "lu-factorization-3x3",
      title: t("Multipliers and LU factorization of 3x3 matrices", "三阶矩阵消元乘子与 LU 分解"),
      explanation: t(
        "For a $3 \\times 3$ matrix $A$ requiring no row swaps: (1) The multipliers $l_{21} = \\frac{a_{21}}{a_{11}}$, $l_{31} = \\frac{a_{31}}{a_{11}}$, and $l_{32} = \\frac{a'_{32}}{a'_{22}}$ from Gaussian elimination record the row additions; (2) Placing these multipliers into the lower triangle gives the unit lower triangular matrix $L$; (3) The resulting row echelon form is $U$, giving $A = LU$.",
        "对于消元过程中无需行交换的三阶矩阵 $A$：(1) 高斯消元过程中的乘子 $l_{21} = \\frac{a_{21}}{a_{11}}$、$l_{31} = \\frac{a_{31}}{a_{11}}$ 以及 $l_{32} = \\frac{a'_{32}}{a'_{22}}$ 记录了行变换的倍数；(2) 将这些乘子填入下三角部分即可得到单位下三角矩阵 $L$；(3) 消元最终得到的上三角阶梯形矩阵即为 $U$，满足 $A = LU$。",
      ),
      generate(rng) {
        const l21 = rng.pick([2, 3, -1]);
        const l31 = rng.pick([1, -2, 3]);
        const l32 = rng.pick([2, -1, 1]);

        const u11 = 1;
        const u12 = rng.pick([2, -1, 3]);
        const u13 = rng.pick([-2, 1, 4]);

        const u22 = 1;
        const u23 = rng.pick([3, -1, 2]);

        const u33 = rng.pick([2, 3, 4]);

        // Construct A = L * U
        const L: Mat = [
          [1, 0, 0],
          [l21, 1, 0],
          [l31, l32, 1],
        ];
        const _U: Mat = [
          [u11, u12, u13],
          [0, u22, u23],
          [0, 0, u33],
        ];

        // Compute A = L * U
        const r1 = [u11, u12, u13];
        const r2 = [l21 * u11, l21 * u12 + u22, l21 * u13 + u23];
        const r3 = [l31 * u11, l31 * u12 + l32 * u22, l31 * u13 + l32 * u23 + u33];
        const A: Mat = [r1, r2, r3];

        const prompt = t(
          `In the $LU$ factorization ($A = LU$) of matrix $A$ where $L$ is unit lower triangular, what is the matrix $L$?

$$A = ${matLatex(A)}$$`,
          `在矩阵 $A$ 的 $LU$ 分解（$A = LU$）中，若 $L$ 为单位下三角矩阵，则矩阵 $L$ 是哪一个？

$$A = ${matLatex(A)}$$`,
        );

        const wrongL1: Mat = [
          [1, 0, 0],
          [-l21, 1, 0],
          [-l31, -l32, 1],
        ];
        const wrongL2: Mat = [
          [1, l21, l31],
          [0, 1, l32],
          [0, 0, 1],
        ];
        const wrongL3: Mat = [
          [1, 0, 0],
          [l21, 1, 0],
          [l31, 0, 1],
        ];

        return oneOf(
          rng,
          prompt,
          t(`$$${matLatex(L)}$$`, `$$${matLatex(L)}$$`),
          [
            t(`$$${matLatex(wrongL1)}$$`, `$$${matLatex(wrongL1)}$$`),
            t(`$$${matLatex(wrongL2)}$$`, `$$${matLatex(wrongL2)}$$`),
            t(`$$${matLatex(wrongL3)}$$`, `$$${matLatex(wrongL3)}$$`),
          ],
          t(
            `The multipliers from forward elimination are:
- $l_{21} = \\frac{a_{21}}{a_{11}} = ${l21}$
- $l_{31} = \\frac{a_{31}}{a_{11}} = ${l31}$
- After clearing column 1, row 2 becomes $[0, 1, ${u23}]$ and row 3 becomes $[0, ${l32}, ${l32 * u23 + u33}]$, giving $l_{32} = ${l32}$.
Placing these multipliers into the unit lower triangular matrix gives $L = ${matLatex(L)}$.`,
            `前向消元的乘子分别为：
- $l_{21} = \\frac{a_{21}}{a_{11}} = ${l21}$
- $l_{31} = \\frac{a_{31}}{a_{11}} = ${l31}$
- 消去第 1 列后，第 2 行变为 $[0, 1, ${u23}]$，第 3 行变为 $[0, ${l32}, ${l32 * u23 + u33}]$，故 $l_{32} = ${l32}$。
将各乘子填入单位下三角矩阵即得 $L = ${matLatex(L)}$。`,
          ),
        );
      },
    },
    {
      id: "the-last-pivot-in-a-3x3-lu-factorization",
      title: t("The last pivot in a 3×3 $LU$ factorization", "3×3 $LU$ 分解中的最后一个主元"),
      explanation: t(
        "In $A = LU$ the diagonal of $U$ holds the pivots of Gaussian elimination without row swaps. Since $\\det L = 1$, the product of the pivots is $\\det A$. So once the first two pivots are found, the last one is\n\n$$u_{33} = \\frac{\\det A}{u_{11}u_{22}},$$\n\nwhich gives a quick check on the elimination.",
        "在 $A = LU$ 中，$U$ 的对角线就是不换行的高斯消元的主元。由于 $\\det L = 1$，主元之积等于 $\\det A$。所以求出前两个主元后，最后一个主元为\n\n$$u_{33} = \\frac{\\det A}{u_{11}u_{22}},$$\n\n这可以快速检验消元结果。",
      ),
      generate(rng: Rng): Problem {
        const L = [
          [1, 0, 0],
          [rng.int(-2, 2), 1, 0],
          [rng.int(-2, 2), rng.int(-2, 2), 1],
        ];
        const piv = [rng.pick([1, -1, 2, -2]), rng.pick([1, -1, 2, 3]), rng.nonZero(-4, 4)];
        const U = [
          [piv[0]!, rng.int(-3, 3), rng.int(-3, 3)],
          [0, piv[1]!, rng.int(-3, 3)],
          [0, 0, piv[2]!],
        ];
        const A = matMul(L, U);
        return numberProblem({
          prompt: t(
            `Find $u_{33}$ in the factorization $A = LU$ ($L$ unit lower triangular) of $A = ${matLatex(A)}$.`,
            `求 $A = ${matLatex(A)}$ 的分解 $A = LU$（$L$ 为单位下三角矩阵）中的 $u_{33}$。`,
          ),
          answer: piv[2]!,
          wrong: [A[2]![2]!, -piv[2]!, piv[0]! * piv[1]! * piv[2]!, A[2]![2]! - L[2]![0]! * U[0]![2]!],
          solution: t(
            `Elimination gives $U = ${matLatex(U)}$, so $u_{33} = ${piv[2]}$. Check: $\\det A = ${det3(A)} = ${piv[0]} \\cdot ${paren(piv[1]!)} \\cdot ${paren(piv[2]!)}$.`,
            `消元得 $U = ${matLatex(U)}$，所以 $u_{33} = ${piv[2]}$。检验：$\\det A = ${det3(A)} = ${piv[0]} \\cdot ${paren(piv[1]!)} \\cdot ${paren(piv[2]!)}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.8.4 LU Factorization of NxN Matrices ───────────────────────────────────

/** luFactorizationOfNxnMatrices covers partial pivoting and PLU factorization. */
export const luFactorizationOfNxnMatrices: TopicDef = {
  id: "lu-factorization-of-nxn-matrices",
  title: t("LU Factorization of NxN Matrices", "一般方阵的 LU 分解与 PLU 分解"),
  summary: t(
    "Understand when LU factorization requires partial pivoting, giving the PA = LU factorization.",
    "理解当消元遇到零主元时需要进行行交换（部分主元法），从而得到 PLU 分解：PA = LU。",
  ),
  prerequisites: ["lu-factorization-of-3x3-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "plu-factorization-general",
      title: t("Partial pivoting and PLU factorization", "部分主元法与 PLU 分解"),
      explanation: t(
        "A matrix $A$ may not have a standard $A = LU$ factorization if a zero appears in a pivot position during Gaussian elimination. By interchanging rows using a permutation matrix $P$, every invertible matrix has a factorization $PA = LU$, where $P$ is a permutation matrix, $L$ is unit lower triangular, and $U$ is upper triangular.",
        "若在高斯消元过程中主元位置出现零，则矩阵可能无法直接进行标准的 $A = LU$ 分解。通过使用置换矩阵 $P$ 交换各行，任意可逆方阵均存在分解 $PA = LU$，其中 $P$ 为置换矩阵，$L$ 为单位下三角矩阵，$U$ 为上三角矩阵。",
      ),
      generate(rng) {
        // a_{11} = 0, so a row swap is needed; partial pivoting brings up the entry of largest absolute value in column 1.
        const a21 = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const a31 = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((x) => Math.abs(x) !== Math.abs(a21)));
        const A: Mat = [
          [0, rng.pick([2, 3, 4]), rng.pick([1, -2, 5])],
          [a21, rng.pick([-1, 4, 2]), rng.pick([3, 1, -2])],
          [a31, rng.pick([1, 0, -3]), rng.pick([5, 2, 1])],
        ];
        const pivotRow = Math.abs(a21) > Math.abs(a31) ? 2 : 3;
        const swap = (r: number, s: number): Mat =>
          [0, 1, 2].map((row) => {
            const from = row === r - 1 ? s - 1 : row === s - 1 ? r - 1 : row;
            return [0, 1, 2].map((col) => (col === from ? 1 : 0));
          });
        const P = swap(1, pivotRow);
        const pivot = pivotRow === 2 ? a21 : a31;
        const other = pivotRow === 2 ? a31 : a21;
        const prompt = t(
          `Matrix $A$ has a zero in the $(1, 1)$ entry:

$$A = ${matLatex(A)}$$

Using partial pivoting, the first step of the $PA = LU$ factorization swaps row 1 with the row whose entry in column 1 has the largest absolute value. What is the permutation matrix $P$ for this step?`,
          `矩阵 $A$ 的 $(1, 1)$ 位置为零：

$$A = ${matLatex(A)}$$

采用部分主元法，$PA = LU$ 分解的第一步把第 1 行与第 1 列中绝对值最大的元素所在的行交换。这一步的置换矩阵 $P$ 是哪一个？`,
        );
        const mat = (m: Mat) => t(`$$${matLatex(m)}$$`, `$$${matLatex(m)}$$`);
        return oneOf(
          rng,
          prompt,
          mat(P),
          [mat(swap(1, 5 - pivotRow)), mat(swap(2, 3)), mat(swap(1, 1))],
          t(
            `In column 1, $|${pivot}| > |${other}|$, so partial pivoting swaps rows 1 and ${pivotRow}. Swapping those rows of $I_3$ gives $P = ${matLatex(P)}$, and $PA$ has the pivot $${pivot}$ in the $(1, 1)$ position.`,
            `第 1 列中 $|${pivot}| > |${other}|$，所以部分主元法交换第 1 行与第 ${pivotRow} 行。对 $I_3$ 交换这两行得 $P = ${matLatex(P)}$，$PA$ 的 $(1, 1)$ 位置为主元 $${pivot}$。`,
          ),
        );
      },
    },
    {
      id: "a-determinant-from-a-pa-equals-lu-factorization",
      title: t("A determinant from $PA = LU$", "由 $PA = LU$ 求行列式"),
      explanation: t(
        "Taking determinants of $PA = LU$ gives $\\det P \\det A = \\det L \\det U$. Here $\\det L = 1$, $\\det U$ is the product of its diagonal entries, and $\\det P = (-1)^s$ where $s$ is the number of row swaps recorded in $P$. So\n\n$$\\det A = (-1)^s\\,u_{11}u_{22}\\cdots u_{nn}.$$",
        "对 $PA = LU$ 取行列式得 $\\det P \\det A = \\det L \\det U$。其中 $\\det L = 1$，$\\det U$ 是其对角元素之积，$\\det P = (-1)^s$，$s$ 为 $P$ 记录的换行次数。所以\n\n$$\\det A = (-1)^s\\,u_{11}u_{22}\\cdots u_{nn}$$",
      ),
      generate(rng: Rng): Problem {
        const n = rng.int(3, 4);
        const s = rng.int(1, 3);
        const diag = Array.from({ length: n }, () => rng.nonZero(-3, 3));
        const prod = diag.reduce((x, y) => x * y, 1);
        const ans = (s % 2 === 0 ? 1 : -1) * prod;
        return numberProblem({
          prompt: t(
            `For a $${n} \\times ${n}$ matrix $A$, partial pivoting gives $PA = LU$ after $${s}$ row swap${s === 1 ? "" : "s"}, with $L$ unit lower triangular and $U$ having diagonal entries $${diag.join(", ")}$. Find $\\det A$.`,
            `对 $${n} \\times ${n}$ 矩阵 $A$，部分主元法经 $${s}$ 次换行得到 $PA = LU$，$L$ 为单位下三角矩阵，$U$ 的对角元素为 $${diag.join(", ")}$。求 $\\det A$。`,
          ),
          answer: ans,
          wrong: [-ans, prod * s, diag.reduce((x, y) => x + y, 0)],
          solution: t(
            `$\\det P = (-1)^{${s}} = ${s % 2 === 0 ? 1 : -1}$ and $\\det U = ${prod}$, so $\\det A = ${ans}$.`,
            `$\\det P = (-1)^{${s}} = ${s % 2 === 0 ? 1 : -1}$，$\\det U = ${prod}$，所以 $\\det A = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 2.8.5 Solving Systems of Equations Using LU Factorization ────────────────

/** solvingSystemsOfEquationsUsingLuFactorization covers Ly = b then Ux = y. */
export const solvingSystemsOfEquationsUsingLuFactorization: TopicDef = {
  id: "solving-systems-of-equations-using-lu-factorization",
  title: t("Solving Systems of Equations Using LU Factorization", "利用 LU 分解求解线性方程组"),
  summary: t(
    "Solve Ax = b via LU: forward substitution Ly = b, then back substitution Ux = y.",
    "利用 LU 分解求解线性方程组：先前向回代解 Ly = b，再反向回代解 Ux = y。",
  ),
  prerequisites: ["lu-factorization-of-3x3-matrices"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "solving-via-lu",
      title: t("Two-step solution algorithm using LU factorization", "LU 分解的两步法求解"),
      explanation: t(
        "To solve $A\\mathbf{x} = \\mathbf{b}$ given $A = LU$: (1) Forward substitution: Solve $L\\mathbf{y} = \\mathbf{b}$ for $\\mathbf{y}$; (2) Back substitution: Solve $U\\mathbf{x} = \\mathbf{y}$ for $\\mathbf{x}$. Since both $L$ and $U$ are triangular, each step takes only $O(n^2)$ arithmetic operations, making this highly efficient when solving for multiple right-hand sides $\\mathbf{b}$.",
        "已知矩阵分解 $A = LU$，求解方程组 $A\\mathbf{x} = \\mathbf{b}$：(1) 前向回代：求解三角系统 $L\\mathbf{y} = \\mathbf{b}$ 得到中间向量 $\\mathbf{y}$；(2) 反向回代：求解三角系统 $U\\mathbf{x} = \\mathbf{y}$ 得到最终解 $\\mathbf{x}$。由于 $L$ 与 $U$ 均为三角矩阵，每步仅需 $O(n^2)$ 次运算，在处理多个不同右端项 $\\mathbf{b}$ 时极具效率优势。",
      ),
      generate(rng) {
        // Integer solutions
        const y1 = rng.pick([2, 3, 4, 5]);
        const y2 = rng.pick([-2, -1, 1, 2, 3]);
        const y3 = rng.pick([-3, 1, 2, 4]);

        const l21 = rng.pick([2, 3, -1]);
        const l31 = rng.pick([1, -2]);
        const l32 = rng.pick([2, -1]);

        const L: Mat = [
          [1, 0, 0],
          [l21, 1, 0],
          [l31, l32, 1],
        ];

        // Ly = b:
        // b1 = y1
        // b2 = l21*y1 + y2
        // b3 = l31*y1 + l32*y2 + y3
        const b1 = y1;
        const b2 = l21 * y1 + y2;
        const b3 = l31 * y1 + l32 * y2 + y3;
        const bVec = [b1, b2, b3];

        const prompt = t(
          `In solving $A\\mathbf{x} = \\mathbf{b}$ using $A = LU$, step 1 is to solve $L\\mathbf{y} = \\mathbf{b}$ by forward substitution. For

$$L = ${matLatex(L)}, \\quad \\mathbf{b} = ${colVecLatex(bVec)}$$

what is the intermediate vector $\\mathbf{y} = \\begin{pmatrix} y_1 \\\\ y_2 \\\\ y_3 \\end{pmatrix}$?`,
          `利用 $A = LU$ 求解 $A\\mathbf{x} = \\mathbf{b}$ 时，第 1 步为通过前向回代求解 $L\\mathbf{y} = \\mathbf{b}$。已知

$$L = ${matLatex(L)}, \\quad \\mathbf{b} = ${colVecLatex(bVec)}$$

求中间向量 $\\mathbf{y} = \\begin{pmatrix} y_1 \\\\ y_2 \\\\ y_3 \\end{pmatrix}$。`,
        );

        const yVec = [y1, y2, y3];
        const rightStr = colVecLatex(yVec);
        const wrong1Str = colVecLatex([y1, -y2, y3]);
        const wrong2Str = colVecLatex([b1, b2, b3]);
        const wrong3Str = colVecLatex([y1, y2, -y3]);

        return oneOf(
          rng,
          prompt,
          t(`$$\\mathbf{y} = ${rightStr}$$`, `$$\\mathbf{y} = ${rightStr}$$`),
          [
            t(`$$\\mathbf{y} = ${wrong1Str}$$`, `$$\\mathbf{y} = ${wrong1Str}$$`),
            t(`$$\\mathbf{y} = ${wrong2Str}$$`, `$$\\mathbf{y} = ${wrong2Str}$$`),
            t(`$$\\mathbf{y} = ${wrong3Str}$$`, `$$\\mathbf{y} = ${wrong3Str}$$`),
          ],
          t(
            `From row 1: $y_1 = ${b1}$.
From row 2: $(${l21})y_1 + y_2 = ${b2} \\implies (${l21})(${y1}) + y_2 = ${b2} \\implies y_2 = ${y2}$.
From row 3: $(${l31})y_1 + (${l32})y_2 + y_3 = ${b3} \\implies y_3 = ${y3}$.
Thus $\\mathbf{y} = ${rightStr}$.`,
            `由第 1 行：$y_1 = ${b1}$。
由第 2 行：$(${l21})y_1 + y_2 = ${b2} \\implies (${l21})(${y1}) + y_2 = ${b2} \\implies y_2 = ${y2}$。
由第 3 行：$(${l31})y_1 + (${l32})y_2 + y_3 = ${b3} \\implies y_3 = ${y3}$。
因此 $\\mathbf{y} = ${rightStr}$。`,
          ),
        );
      },
    },
    {
      id: "back-substitution-in-the-second-stage-of-an-lu-solve",
      title: t("Back substitution in the second stage of an $LU$ solve", "$LU$ 求解第二步中的回代"),
      explanation: t(
        "Solving $A\\mathbf{x} = \\mathbf{b}$ with $A = LU$ takes two triangular solves. First $L\\mathbf{y} = \\mathbf{b}$ by forward substitution, then $U\\mathbf{x} = \\mathbf{y}$ by back substitution, starting from the last row: $x_3 = \\frac{y_3}{u_{33}}$, then $x_2 = \\frac{y_2 - u_{23}x_3}{u_{22}}$, then $x_1$. Each triangular solve costs far less than eliminating $A$ again.",
        "用 $A = LU$ 求解 $A\\mathbf{x} = \\mathbf{b}$ 需要两次三角求解。先用前代法解 $L\\mathbf{y} = \\mathbf{b}$，再用回代法解 $U\\mathbf{x} = \\mathbf{y}$，从最后一行开始：$x_3 = \\frac{y_3}{u_{33}}$，然后 $x_2 = \\frac{y_2 - u_{23}x_3}{u_{22}}$，再求 $x_1$。每次三角求解的代价远小于重新对 $A$ 消元。",
      ),
      generate(rng: Rng): Problem {
        const x = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
        const U = [
          [rng.pick([1, -1, 2]), rng.int(-3, 3), rng.int(-3, 3)],
          [0, rng.pick([1, -1, 2, -2]), rng.int(-3, 3)],
          [0, 0, rng.pick([1, -1, 2, 3])],
        ];
        const y = U.map((row) => row.reduce((s, v, k) => s + v * x[k]!, 0));
        const which = rng.int(0, 1);
        return numberProblem({
          prompt: t(
            `In solving $A\\mathbf{x} = \\mathbf{b}$ with $A = LU$, the first stage gave $\\mathbf{y} = ${colVecLatex(y)}$. With $U = ${matLatex(U)}$, find $${which === 0 ? "x_1" : "x_2"}$.`,
            `用 $A = LU$ 求解 $A\\mathbf{x} = \\mathbf{b}$ 时，第一步得到 $\\mathbf{y} = ${colVecLatex(y)}$。已知 $U = ${matLatex(U)}$，求 $${which === 0 ? "x_1" : "x_2"}$。`,
          ),
          answer: x[which]!,
          solveFor: which === 0 ? "x_1" : "x_2",
          wrong: [x[2]!, x[1 - which]!, Q.of(y[which]!, U[which]![which]!), -x[which]!],
          solution: t(
            `Back substitution: $x_3 = \\frac{${y[2]}}{${U[2]![2]}} = ${x[2]}$, $x_2 = \\frac{${y[1]} - ${paren(U[1]![2]!)} \\cdot ${paren(x[2]!)}}{${U[1]![1]}} = ${x[1]}$, $x_1 = \\frac{${y[0]} - ${paren(U[0]![1]!)} \\cdot ${paren(x[1]!)} - ${paren(U[0]![2]!)} \\cdot ${paren(x[2]!)}}{${U[0]![0]}} = ${x[0]}$.`,
            `回代：$x_3 = \\frac{${y[2]}}{${U[2]![2]}} = ${x[2]}$，$x_2 = \\frac{${y[1]} - ${paren(U[1]![2]!)} \\cdot ${paren(x[2]!)}}{${U[1]![1]}} = ${x[1]}$，$x_1 = \\frac{${y[0]} - ${paren(U[0]![1]!)} \\cdot ${paren(x[1]!)} - ${paren(U[0]![2]!)} \\cdot ${paren(x[2]!)}}{${U[0]![0]}} = ${x[0]}$。`,
          ),
        });
      },
    },
  ],
};

// ─── Exported Topic Definitions ──────────────────────────────────────────────

/** linearAlgebraMatrixTopics defines all 36 topics for Linear Algebra Unit 2: Matrices. */
export const linearAlgebraMatrixTopics: readonly TopicDef[] = [
  // Module 2.4. Determinants
  cramersRuleFor2x2SystemsOfLinearEquations,
  cramersRuleFor3x3Systems,
  theDeterminantOfAnNxnMatrix,
  findingDeterminantsUsingLaplaceExpansions,
  basicPropertiesOfDeterminants,
  furtherPropertiesOfDeterminants,
  rowAndColumnOperationsOnDeterminants,
  conditionsWhenADeterminantEqualsZero,
  findingDeterminantsUsingRowAndColumnOperations,
  partitionedAndBlockMatrices,

  // Module 2.5. Gaussian Elimination
  systemsOfEquationsAsAugmentedMatrices,
  rowEchelonForm,
  solvingSystemsOfEquationsUsingBackSubstitution,
  elementaryRowOperations,
  creatingRowsOrColumnsContainingZerosUsingGaussianElimination,
  solving2x2SystemsOfEquationsUsingGaussianElimination,
  solving2x2SingularSystemsOfEquationsUsingGaussianElimination,
  solving3x3SystemsOfEquationsUsingGaussianElimination,
  identifyingThePivotColumnsOfAMatrix,
  solving3x3SingularSystemsOfEquationsUsingGaussianElimination,
  reducedRowEchelonForm,
  gaussianEliminationForNxmSystemsOfEquations,

  // Module 2.6. Elementary Matrices
  elementary2x2Matrices,
  rowOperationsOn2x2MatricesAsProductsOfElementaryMatrices,
  elementary3x3Matrices,
  rowOperationsOn3x3MatricesAsProductsOfElementaryMatrices,

  // Module 2.7. The Inverse of a Matrix
  theInvertibleMatrixTheoremInTermsOf2x2SystemsOfEquations,
  findingTheInverseOfA2x2MatrixUsingRowOperations,
  findingTheInverseOfA3x3MatrixUsingRowOperations,
  findingTheInverseOfAnNxnSquareMatrixUsingRowOperations,
  matricesWithEasyToFindInverses,

  // Module 2.8. LU Factorization
  triangularMatrices,
  luFactorizationOf2x2Matrices,
  luFactorizationOf3x3Matrices,
  luFactorizationOfNxnMatrices,
  solvingSystemsOfEquationsUsingLuFactorization,
];
