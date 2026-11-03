import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";

import { article, choiceProblem, numberProblem, pointProblem } from "../problems.ts";

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
        "For the system $\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}$, let $D = \\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$. If $D \\ne 0$, the unique solution is given by $x = \\frac{D_x}{D}$ and $y = \\frac{D_y}{D}$, where $D_x = \\det\\begin{pmatrix} e & b \\\\ f & d \\end{pmatrix} = ed - bf$ and $D_y = \\det\\begin{pmatrix} a & e \\\\ c & f \\end{pmatrix} = af - ec$.",
        "对于方程组 $\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}$，记系数行列式 $D = \\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$。若 $D \\ne 0$，则方程组有唯一解：$x = \\frac{D_x}{D}$ 与 $y = \\frac{D_y}{D}$，其中 $D_x = \\det\\begin{pmatrix} e & b \\\\ f & d \\end{pmatrix} = ed - bf$，$D_y = \\det\\begin{pmatrix} a & e \\\\ c & f \\end{pmatrix} = af - ec$。",
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
            `First compute the coefficient determinant: $D = (${a})(${d}) - (${b})(${c}) = ${D}$. Next compute $D_${varName} = ${askX ? Dx : Dy}$. Therefore, $${varName} = \\frac{D_${varName}}{D} = \\frac{${askX ? Dx : Dy}}{${D}} = ${ansVal}$.`,
            `首先计算系数行列式：$D = (${a})(${d}) - (${b})(${c}) = ${D}$。接着计算 $D_${varName} = ${askX ? Dx : Dy}$。因此 $${varName} = \\frac{D_${varName}}{D} = \\frac{${askX ? Dx : Dy}}{${D}} = ${ansVal}$。`,
          ),
          wrong: [otherVal, -ansVal, ansVal + 1, ansVal - 1, askX ? Dx : Dy],
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
    "Apply Cramer's rule to 3x3 systems of equations using column replacement matrices A_i(b).",
    "利用列替换矩阵 A_i(b) 将克莱姆法则应用于三元一次方程组。",
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

Which matrix is $A_${colIdx}(\\mathbf{b})$, used in Cramer's rule to compute $${varStr} = \\frac{\\det(A_${colIdx}(\\mathbf{b}))}{\\det(A)}$?`,
          `考虑 $3 \\times 3$ 线性系统 $A\\mathbf{x} = \\mathbf{b}$，其中

$$A = ${matLatex(A)}, \\quad \\mathbf{b} = ${colVecLatex(bVec)}$$

在克莱姆法则中用于计算 $${varStr} = \\frac{\\det(A_${colIdx}(\\mathbf{b}))}{\\det(A)}$ 的替换矩阵 $A_${colIdx}(\\mathbf{b})$ 是哪一个？`,
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
            `In Cramer's rule, $A_${colIdx}(\\mathbf{b})$ is obtained by replacing column ${colIdx} of $A$ with the constant vector $\\mathbf{b}$. Thus column ${colIdx} becomes $\\begin{pmatrix} ${b1} \\\\ ${b2} \\\\ ${b3} \\end{pmatrix}$ while the other columns remain unchanged.`,
            `在克莱姆法则中，$A_${colIdx}(\\mathbf{b})$ 是通过将 $A$ 的第 ${colIdx} 列替换为常数向量 $\\mathbf{b}$ 得到的。因此第 ${colIdx} 列变为 $\\begin{pmatrix} ${b1} \\\\ ${b2} \\\\ ${b3} \\end{pmatrix}$，其余列保持不变。`,
          ),
        );
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
            `$\\text{inv}(\\sigma) = ${invCount}$, so $\\text{sgn}(\\sigma) = ${signStr}$ (${parityEn})`,
            `$\\text{inv}(\\sigma) = ${invCount}$，故 $\\text{sgn}(\\sigma) = ${signStr}$（${parityZh}置换）`,
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
  ],
};

// ─── 2.4.5 Basic Properties of Determinants ───────────────────────────────────

/** basicPropertiesOfDeterminants covers transpose, products, and scalar multiplication. */
export const basicPropertiesOfDeterminants: TopicDef = {
  id: "basic-properties-of-determinants",
  title: t("Basic Properties of Determinants", "行列式的基本性质"),
  summary: t(
    "Use key properties: det(A^T) = det(A), det(AB) = det(A)det(B), and det(kA) = k^n det(A).",
    "运用行列式基本性质：det(A^T) = det(A)、det(AB) = det(A)det(B) 以及 det(kA) = k^n det(A)。",
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
        "For $n \\times n$ square matrices $A$ and $B$, and scalar $k$: (1) $\\det(A^T) = \\det(A)$; (2) $\\det(AB) = \\det(A)\\det(B)$; (3) $\\det(kA) = k^n \\det(A)$, since factor $k$ scales all $n$ rows.",
        "对于 $n \\times n$ 方阵 $A$ 和 $B$ 以及标量 $k$：(1) $\\det(A^T) = \\det(A)$；(2) $\\det(AB) = \\det(A)\\det(B)$；(3) $\\det(kA) = k^n \\det(A)$，因为数乘 $k$ 会将矩阵的全部 $n$ 行同时乘以 $k$。",
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
  ],
};

// ─── 2.4.6 Further Properties of Determinants ─────────────────────────────────

/** furtherPropertiesOfDeterminants covers determinant of inverses, powers, and invertibility. */
export const furtherPropertiesOfDeterminants: TopicDef = {
  id: "further-properties-of-determinants",
  title: t("Further Properties of Determinants", "行列式的进阶乘法与可逆性性质"),
  summary: t(
    "Compute determinants of matrix inverses det(A^-1) = 1/det(A) and powers det(A^k) = (det A)^k.",
    "掌握逆矩阵的行列式 det(A^-1) = 1/det(A) 以及幂矩阵的行列式 det(A^k) = (det A)^k 的计算。",
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
          `Which of the following matrices has a determinant equal to $0$ without carrying out a full Laplace expansion?

$$M = ${matLatex(singularMat)}$$`,
          `无需进行完整的拉普拉斯展开，下列哪个矩阵的行列式必然等于 $0$？

$$M = ${matLatex(singularMat)}$$`,
        );

        return oneOf(
          rng,
          prompt,
          t(`$$${matLatex(singularMat)}$$`, `$$${matLatex(singularMat)}$$`),
          [
            t(`$$${matLatex(inv1)}$$`, `$$${matLatex(inv1)}$$`),
            t(`$$${matLatex(inv2)}$$`, `$$${matLatex(inv2)}$$`),
            t(`$$${matLatex(inv3)}$$`, `$$${matLatex(inv3)}$$`),
          ],
          t(
            `In matrix $M$, row 2 is exactly $${factor}$ times row 1: $R_2 = ${factor} R_1$. When two rows of a square matrix are linearly dependent (proportional), subtracting $${factor} R_1$ from $R_2$ produces a row of zeros without changing the determinant. Hence $\\det(M) = 0$. The other three matrices are triangular with non-zero diagonals, so their determinants are non-zero.`,
            `在矩阵 $M$ 中，第 2 行恰好是第 1 行的 $${factor}$ 倍：$R_2 = ${factor} R_1$。当方阵的两行线性相关（成比例）时，将第 1 行的 $${factor}$ 倍从第 2 行减去后，将产生一个全零行且不改变行列式的值，因此 $\\det(M) = 0$。其余三个矩阵均为对角元非零的三角矩阵，行列式均不为零。`,
          ),
        );
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

        return oneOf(
          rng,
          prompt,
          t(`$$${matLatex(correctMat)}$$`, `$$${matLatex(correctMat)}$$`),
          [
            t(`$$${matLatex(wrongMat1)}$$`, `$$${matLatex(wrongMat1)}$$`),
            t(`$$${matLatex(wrongMat2)}$$`, `$$${matLatex(wrongMat2)}$$`),
            t(`$$${matLatex(wrongMat3)}$$`, `$$${matLatex(wrongMat3)}$$`),
          ],
          t(
            `The operation $${opStr}$ replaces row 2 by row 2 minus $${k}$ times row 1 entry by entry:
$[${r2.join(", ")}] - ${paren(k)}[${r1.join(", ")}] = [${newR2.join(", ")}]$. Rows 1 and 3 are unchanged.`,
            `变换 $${opStr}$ 将第 2 行替换为第 2 行减去第 1 行的 $${k}$ 倍：
$[${r2.join(", ")}] - ${paren(k)}[${r1.join(", ")}] = [${newR2.join(", ")}]$。第 1 行与第 3 行保持不变。`,
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
    "Choose multipliers and row operations R_i - (a_ij / a_pj) R_p -> R_i to introduce zeros.",
    "选取恰当的消元倍数，利用行变换 R_i - (a_ij / a_pj) R_p -> R_i 制造零元。",
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

        return oneOf(
          rng,
          prompt,
          t(`$${rightOp}$`, `$${rightOp}$`),
          [t(`$${wrongOp1}$`, `$${wrongOp1}$`), t(`$${wrongOp2}$`, `$${wrongOp2}$`), t(`$${wrongOp3}$`, `$${wrongOp3}$`)],
          t(
            `The required multiplier is $c = \\frac{a_{21}}{a_{11}} = \\frac{${targetVal}}{${pivot}} = ${mult}$. Subtracting $${mult}$ times row 1 from row 2 gives $${targetVal} - (${mult})(${pivot}) = 0$, so the correct operation is $${rightOp}$.`,
            `所需的消元乘子为 $c = \\frac{a_{21}}{a_{11}} = \\frac{${targetVal}}{${pivot}} = ${mult}$。从第 2 行减去第 1 行的 $${mult}$ 倍即可得到 $${targetVal} - (${mult})(${pivot}) = 0$，故正确的行变换为 $${rightOp}$。`,
          ),
        );
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
  ],
};

// ─── 2.5.10 Solving 3x3 Singular Systems of Equations ─────────────────────────

/** solving3x3SingularSystemsOfEquationsUsingGaussianElimination covers parametric form. */
export const solving3x3SingularSystemsOfEquationsUsingGaussianElimination: TopicDef = {
  id: "solving-3x3-singular-systems-of-equations-using-gaussian-elimination",
  title: t("Solving 3x3 Singular Systems of Equations Using Gaussian Elimination", "三元奇异方程组的解（参数形式）"),
  summary: t(
    "Express general solutions of singular consistent 3x3 systems in parametric vector form x = x_p + t v.",
    "将有无穷多解的三元奇异相容线性方程组表示为参数向量形式 x = x_p + t v。",
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
          `Which of the following $3 \\times 4$ matrices with non-pivot entries $c_1 = ${c1}$ and $c_2 = ${c2}$ is in **Reduced Row Echelon Form (RREF)**?`,
          `下列包含非主元参数 $c_1 = ${c1}$ 与 $c_2 = ${c2}$ 的 $3 \\times 4$ 矩阵中，哪一个是**简化行阶梯形矩阵 (RREF)**？`,
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
  ],
};

// ─── 2.6.2 Row Operations as Products of Elementary Matrices (2x2) ───────────

/** rowOperationsOn2x2MatricesAsProductsOfElementaryMatrices covers left-multiplication EA. */
export const rowOperationsOn2x2MatricesAsProductsOfElementaryMatrices: TopicDef = {
  id: "row-operations-on-2x2-matrices-as-products-of-elementary-matrices",
  title: t("Row Operations on 2x2 Matrices as Products of Elementary Matrices", "初等变换的矩阵乘积表示 (2x2)"),
  summary: t(
    "Express row operations on 2x2 matrices as matrix multiplication on the left by E: E * A.",
    "将二阶矩阵的初等行变换表示为在左侧乘以初等矩阵：E * A。",
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
          c > 0 ? `R_${targetRow} + ${c} R_${sourceRow} \\to R_${targetRow}` : `R_${targetRow} - ${-c} R_${sourceRow} \\to R_${targetRow}`;

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
  ],
};

// ─── 2.6.4 Row Operations as Products of Elementary Matrices (3x3) ───────────

/** rowOperationsOn3x3MatricesAsProductsOfElementaryMatrices covers sequential reduction products. */
export const rowOperationsOn3x3MatricesAsProductsOfElementaryMatrices: TopicDef = {
  id: "row-operations-on-3x3-matrices-as-products-of-elementary-matrices",
  title: t("Row Operations on 3x3 Matrices as Products of Elementary Matrices", "初等变换的矩阵乘积表示 (3x3)"),
  summary: t(
    "Express a sequence of row operations as a product of elementary matrices: E_k ... E_1 A = R.",
    "将连续多次初等行变换表示为初等矩阵的相乘形式：E_k ... E_1 A = R。",
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
          `Let $E_1$ represent the row operation $R_2 + (${c1}) R_1 \\to R_2$ and $E_2$ represent $R_3 + (${c2}) R_1 \\to R_3$. What single matrix $M = E_2 E_1$ performs both operations simultaneously on any $3 \\times 3$ matrix $A$?`,
          `设 $E_1$ 表示行变换 $R_2 + (${c1}) R_1 \\to R_2$，$E_2$ 表示行变换 $R_3 + (${c2}) R_1 \\to R_3$。对任意 $3 \\times 3$ 矩阵 $A$，能够同时执行这两个行变换的矩阵乘积 $M = E_2 E_1$ 是哪一个？`,
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
        const c = rng.pick([2, -1, 3]);
        const d = rng.pick([4, 5, -2]);

        const detA = a * d - b * c;
        const isInvertible = detA !== 0;

        const A: Mat = [
          [a, b],
          [c, d],
        ];

        const prompt = t(
          `Consider the matrix $A = ${matLatex(A)}$ with $\\det(A) = ${detA}$. According to the Invertible Matrix Theorem, what is the solution set to the homogeneous system $A\\mathbf{x} = \\mathbf{0}$?`,
          `考虑矩阵 $A = ${matLatex(A)}$，已知 $\\det(A) = ${detA}$。根据可逆矩阵定理，齐次线性系统 $A\\mathbf{x} = \\mathbf{0}$ 的解集是怎样的？`,
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
              ? `Since $\\det(A) = ${detA} \\ne 0$, matrix $A$ is invertible. By the Invertible Matrix Theorem, $A\\mathbf{x} = \\mathbf{0} \\iff \\mathbf{x} = A^{-1}\\mathbf{0} = \\mathbf{0}$, meaning it has only the trivial solution.`
              : `Since $\\det(A) = ${detA} = 0$, matrix $A$ is singular (not invertible). Thus the system has free variables and possesses infinitely many non-trivial solutions.`,
            isInvertible
              ? `由于 $\\det(A) = ${detA} \\ne 0$，矩阵 $A$ 可逆。根据可逆矩阵定理，$A\\mathbf{x} = \\mathbf{0} \\iff \\mathbf{x} = A^{-1}\\mathbf{0} = \\mathbf{0}$，因此只有平凡零解。`
              : `由于 $\\det(A) = ${detA} = 0$，矩阵 $A$ 奇异不可逆。因此该齐次系统存在自由变量，包含无穷多非零解。`,
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
    "Compute the inverse of an invertible 2x2 matrix using Gauss-Jordan elimination on [A | I_2].",
    "利用高斯-约当消元法对增广矩阵 [A | I_2] 进行初等行变换，求出二阶逆矩阵 A^-1。",
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
  ],
};

// ─── 2.7.3 Finding Inverse of 3x3 Matrix Using Row Operations ─────────────────

/** findingTheInverseOfA3x3MatrixUsingRowOperations covers Gauss-Jordan on [A | I_3]. */
export const findingTheInverseOfA3x3MatrixUsingRowOperations: TopicDef = {
  id: "finding-the-inverse-of-a-3x3-matrix-using-row-operations",
  title: t("Finding the Inverse of a 3x3 Matrix Using Row Operations", "初等行变换求三阶逆矩阵"),
  summary: t(
    "Use Gauss-Jordan elimination on [A | I_3] to determine the inverse of a 3x3 matrix.",
    "通过高斯-约当消元法对增广矩阵 [A | I_3] 实施行变换，求出三阶逆矩阵 A^-1。",
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
        );
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
        const prompt = t(
          `During the Gauss-Jordan inversion of ${article(n)} $${n} \\times ${n}$ matrix $A$ with first row $[${a1}, ${a2}, ${a3}, \\dots]$, forward elimination produces a row of zeros in the left block of $[A \\mid I_{${n}}]$. What conclusion must follow?`,
          `在对首行为 $[${a1}, ${a2}, ${a3}, \\dots]$ 的 $${n} \\times ${n}$ 矩阵 $A$ 实施高斯-约当求逆消元 $[A \\mid I_{${n}}]$ 的过程中，若左侧部分出现了一行全零行，可以得出什么结论？`,
        );
        const rightText = t("Matrix $A$ is singular and has no inverse", "矩阵 $A$ 是奇异矩阵，没有逆矩阵（不可逆）");
        const wrongTexts = [
          t("Matrix $A$ has infinitely many inverses", "矩阵 $A$ 拥有无穷多个逆矩阵"),
          t("The inverse matrix $A^{-1}$ has a row of zeros", "逆矩阵 $A^{-1}$ 必然包含一个全零行"),
          t("Matrix $A$ is orthogonal", "矩阵 $A$ 是正交矩阵"),
        ];
        return oneOf(
          rng,
          prompt,
          rightText,
          wrongTexts,
          t(
            `If a row of zeros appears in the left block during row reduction, $\\text{rank}(A) < ${n}$. Since an $n \\times n$ matrix is invertible if and only if $\\text{rank}(A) = n$, $A$ cannot be transformed into the identity matrix $I_{${n}}$. Therefore, $A$ is singular and has no inverse.`,
            `若行化简过程中左侧块出现全零行，说明 $\\text{rank}(A) < ${n}$。因为 $n \\times n$ 矩阵可逆当且仅当其满秩（$\\text{rank}(A) = n$），故 $A$ 无法化为单位矩阵 $I_{${n}}$，因此 $A$ 必然是奇异矩阵，没有逆矩阵。`,
          ),
        );
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
    "Invert special matrices directly: diagonal D^-1 = diag(1/d_i) and orthogonal Q^-1 = Q^T.",
    "直接求解特殊矩阵的逆：对角矩阵 D^-1 = diag(1/d_i) 以及正交矩阵 Q^-1 = Q^T。",
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
        "For a $2 \\times 2$ matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ with $a \\ne 0$, Gaussian elimination uses multiplier $l_{21} = \\frac{c}{a}$ in the operation $R_2 - l_{21} R_1 \\to R_2$. This yields $A = L U$, where $L = \\begin{pmatrix} 1 & 0 \\\\ l_{21} & 1 \\end{pmatrix}$ and $U = \\begin{pmatrix} a & b \\\\ 0 & d - l_{21} b \\end{pmatrix}$.",
        "对于 $a \\ne 0$ 的二阶矩阵 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$，高斯消元法利用乘子 $l_{21} = \\frac{c}{a}$ 进行行变换 $R_2 - l_{21} R_1 \\to R_2$。这给出分解 $A = L U$，其中 $L = \\begin{pmatrix} 1 & 0 \\\\ l_{21} & 1 \\end{pmatrix}$，$U = \\begin{pmatrix} a & b \\\\ 0 & d - l_{21} b \\end{pmatrix}$。",
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
        // Construct 3x3 matrix with zero in (1, 1) position so row swap is needed
        const a12 = rng.pick([2, 3, 4]);
        const a13 = rng.pick([1, -2, 5]);

        const a21 = rng.pick([1, 2, 3]);
        const a22 = rng.pick([-1, 4, 2]);
        const a23 = rng.pick([3, 1, -2]);

        const a31 = rng.pick([2, -1, 4]);
        const a32 = rng.pick([1, 0, -3]);
        const a33 = rng.pick([5, 2, 1]);

        const A: Mat = [
          [0, a12, a13],
          [a21, a22, a23],
          [a31, a32, a33],
        ];

        // Swapping row 1 and row 2 gives P
        const P: Mat = [
          [0, 1, 0],
          [1, 0, 0],
          [0, 0, 1],
        ];

        const prompt = t(
          `Matrix $A$ has a zero in the $(1, 1)$ entry:

$$A = ${matLatex(A)}$$

To compute the $PA = LU$ factorization, rows 1 and 2 must be interchanged ($R_1 \\leftrightarrow R_2$). What is the permutation matrix $P$?`,
          `矩阵 $A$ 的 $(1, 1)$ 位置为零：

$$A = ${matLatex(A)}$$

为了进行 $PA = LU$ 分解，需要交换第 1 行与第 2 行（$R_1 \\leftrightarrow R_2$）。对应的置换矩阵 $P$ 是哪一个？`,
        );

        const wrongP1: Mat = [
          [1, 0, 0],
          [0, 0, 1],
          [0, 1, 0],
        ]; // R2 <-> R3
        const wrongP2: Mat = [
          [0, 0, 1],
          [0, 1, 0],
          [1, 0, 0],
        ]; // R1 <-> R3
        const wrongP3: Mat = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ]; // Identity

        return oneOf(
          rng,
          prompt,
          t(`$$${matLatex(P)}$$`, `$$${matLatex(P)}$$`),
          [
            t(`$$${matLatex(wrongP1)}$$`, `$$${matLatex(wrongP1)}$$`),
            t(`$$${matLatex(wrongP2)}$$`, `$$${matLatex(wrongP2)}$$`),
            t(`$$${matLatex(wrongP3)}$$`, `$$${matLatex(wrongP3)}$$`),
          ],
          t(
            `Because $a_{11} = 0$, elimination cannot proceed without swapping rows. Swapping row 1 and row 2 of the identity matrix $I_3$ creates the permutation matrix $P = ${matLatex(P)}$. Multiplying $P A$ puts the non-zero pivot $${a21}$ into the $(1, 1)$ position, enabling the $PA = LU$ factorization.`,
            `因为 $a_{11} = 0$，如果不交换行就无法进行前向消元。对单位矩阵 $I_3$ 交换第 1 行与第 2 行即得到置换矩阵 $P = ${matLatex(P)}$。计算 $P A$ 会将非零主元 $${a21}$ 换到 $(1, 1)$ 位置，从而保证 $PA = LU$ 分解顺利进行。`,
          ),
        );
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
