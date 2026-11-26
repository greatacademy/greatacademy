import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";

import { article, choiceProblem, numberProblem, pointLatex, pointProblem, say, why, withMistakes } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

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

/** asQ turns a coefficient into a rational number so that mistakes can be compared with the answer. */
const asQ = (c: number | Q): Q => (typeof c === "number" ? Q.of(c) : c);

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
  intro: t(
    "Two equations such as $2x + y = 7$ and $x - y = 2$ can be solved without eliminating anything, using determinants only. The coefficient determinant is $D = (2)(-1) - (1)(1) = -3$. Replacing the $x$ column by the constants gives $D_x = (7)(-1) - (1)(2) = -9$, so $x = \\frac{-9}{-3} = 3$; replacing the $y$ column gives $D_y = (2)(2) - (7)(1) = -3$, so $y = 1$.\n\nCheck: $2(3) + 1 = 7$ and $3 - 1 = 2$, so $(3, 1)$ satisfies both equations.\n\nIn this lesson we solve two equations in two unknowns with Cramer's rule, one unknown at a time.",
    "像 $2x + y = 7$ 和 $x - y = 2$ 这样的两个方程，可以不做消元、只用行列式求解。系数行列式是 $D = (2)(-1) - (1)(1) = -3$。把 $x$ 的系数列换成常数，得 $D_x = (7)(-1) - (1)(2) = -9$，所以 $x = \\frac{-9}{-3} = 3$；把 $y$ 的系数列换成常数，得 $D_y = (2)(2) - (7)(1) = -3$，所以 $y = 1$。\n\n检验：$2(3) + 1 = 7$，$3 - 1 = 2$，所以 $(3, 1)$ 满足两个方程。\n\n本课我们用克莱姆法则求解二元一次方程组，一次求一个未知数。",
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
        "Each variable equals a ratio of determinants, where the top determinant replaces that variable's column of coefficients by the column of constants. For the system $\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}$, let $D = \\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$. If $D \\ne 0$, the unique solution is given by $x = \\frac{D_x}{D}$ and $y = \\frac{D_y}{D}$, where $D_x = \\det\\begin{pmatrix} e & b \\\\ f & d \\end{pmatrix} = ed - bf$ and $D_y = \\det\\begin{pmatrix} a & e \\\\ c & f \\end{pmatrix} = af - ec$. For $x + y = 5$, $x - y = 1$: $D = -2$, $D_x = -6$, so $x = 3$.\n\n> **Watch out.** The constants replace the column of the variable you want: the first column for $x$, the second for $y$. And the answer is $D_x$ divided by $D$, not $D_x$ itself.",
        "每个变量都等于两个行列式之比，分子的行列式是把该变量的系数列换成常数列得到的。对于方程组 $\\begin{cases} ax + by = e \\\\ cx + dy = f \\end{cases}$，记系数行列式 $D = \\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$。若 $D \\ne 0$，则方程组有唯一解：$x = \\frac{D_x}{D}$ 与 $y = \\frac{D_y}{D}$，其中 $D_x = \\det\\begin{pmatrix} e & b \\\\ f & d \\end{pmatrix} = ed - bf$，$D_y = \\det\\begin{pmatrix} a & e \\\\ c & f \\end{pmatrix} = af - ec$。对 $x + y = 5$，$x - y = 1$：$D = -2$，$D_x = -6$，所以 $x = 3$。\n\n> **注意。** 常数替换的是所求变量的那一列：求 $x$ 换第一列，求 $y$ 换第二列。答案是 $D_x$ 除以 $D$，而不是 $D_x$ 本身。",
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
        const top = askX ? Dx : Dy;
        const topLatex = askX
          ? `\\begin{vmatrix} ${e} & ${b} \\\\ ${f} & ${d} \\end{vmatrix} = (${e})(${d}) - (${b})(${f}) = ${Dx}`
          : `\\begin{vmatrix} ${a} & ${e} \\\\ ${c} & ${f} \\end{vmatrix} = (${a})(${f}) - (${e})(${c}) = ${Dy}`;

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
          solution: walked(
            [
              [["Compute the coefficient determinant", "计算系数行列式"], t("", ""), [`D = (${a})(${d}) - (${b})(${c}) = ${D}`]],
              [
                [`Replace the $${varName}$ column by the constants`, `把 $${varName}$ 的系数列换成常数`],
                t("", ""),
                [`D_{${varName}} = ${topLatex}`],
              ],
              [
                ["Divide", "相除"],
                t(
                  `$${varName} = \\frac{D_{${varName}}}{D} = \\frac{${top}}{${D}} = ${ansVal}$.`,
                  `$${varName} = \\frac{D_{${varName}}}{D} = \\frac{${top}}{${D}} = ${ansVal}$。`,
                ),
              ],
            ],
            t(
              `With $x = ${xVal}$ and $y = ${yVal}$: $(${a})(${xVal}) + (${b})(${yVal}) = ${e}$ and $(${c})(${xVal}) + (${d})(${yVal}) = ${f}$, so both equations hold.`,
              `取 $x = ${xVal}$，$y = ${yVal}$：$(${a})(${xVal}) + (${b})(${yVal}) = ${e}$，$(${c})(${xVal}) + (${d})(${yVal}) = ${f}$，两个方程都成立。`,
            ),
          ),
          mistakes: [
            why(
              otherVal,
              `That is the value of the other unknown: for $${varName}$, the constants replace the $${varName}$ column.`,
              `这是另一个未知数的值：求 $${varName}$ 时，常数替换的是 $${varName}$ 那一列。`,
            ),
            why(
              -ansVal,
              "The sign is flipped: check the order $ad - bc$ in each determinant.",
              "符号反了：检查每个行列式中 $ad - bc$ 的顺序。",
            ),
            why(top, `That is $D_{${varName}}$ itself; divide it by $D = ${D}$.`, `这是 $D_{${varName}}$ 本身；还要除以 $D = ${D}$。`),
          ].filter((m, i, all) => m.value !== ansVal && all.findIndex((x) => x.value === m.value) === i),
        });
      },
    },
    {
      id: "solving-for-y-with-cramers-rule",
      title: t("Solving for $y$ with Cramer's rule", "用克拉默法则求 $y$"),
      explanation: t(
        "For the system $ax + by = e$, $cx + dy = f$ with $D = ad - bc \\ne 0$, Cramer's rule gives $y = \\frac{D_y}{D}$, where $D_y$ is the determinant of the coefficient matrix with its second column replaced by the constants:\n\n$$D_y = \\begin{vmatrix} a & e \\\\ c & f \\end{vmatrix} = af - ce.$$\n\nThe answer may be a fraction even when every coefficient is an integer. For $2x + y = 1$, $x + 3y = 2$: $D = 5$, $D_y = 4 - 1 = 3$, so $y = \\frac{3}{5}$.\n\n> **Watch out.** For $y$ the constants go into the second column; putting them in the first gives $D_x$ and the value of $x$. Keep the fraction $\\frac{D_y}{D}$ the right way up.",
        "对方程组 $ax + by = e$，$cx + dy = f$，若 $D = ad - bc \\ne 0$，克拉默法则给出 $y = \\frac{D_y}{D}$，其中 $D_y$ 是把系数矩阵第二列换成常数项后的行列式：\n\n$$D_y = \\begin{vmatrix} a & e \\\\ c & f \\end{vmatrix} = af - ce$$\n\n即使所有系数都是整数，答案也可能是分数。对 $2x + y = 1$，$x + 3y = 2$：$D = 5$，$D_y = 4 - 1 = 3$，所以 $y = \\frac{3}{5}$。\n\n> **注意。** 求 $y$ 时常数放在第二列；放在第一列得到的是 $D_x$ 和 $x$ 的值。分数 $\\frac{D_y}{D}$ 不要上下颠倒。",
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
        const xAns = Q.of(Dx, D);
        const yLatex = `\\frac{${Dy}}{${D}}${ans.toLatex() === `\\frac{${Dy}}{${D}}` ? "" : ` = ${ans.toLatex()}`}`;
        return numberProblem({
          prompt: t(
            `Use Cramer's rule to find $y$: $\\begin{cases} ${formatLinear2(a, b)} = ${e} \\\\ ${formatLinear2(c, d)} = ${f} \\end{cases}$`,
            `用克拉默法则求 $y$：$\\begin{cases} ${formatLinear2(a, b)} = ${e} \\\\ ${formatLinear2(c, d)} = ${f} \\end{cases}$`,
          ),
          answer: ans,
          mistakes: [
            why(
              xAns,
              "That is $\\frac{D_x}{D}$, the value of $x$: for $y$ the constants replace the second column.",
              "这是 $\\frac{D_x}{D}$，即 $x$ 的值：求 $y$ 时常数替换第二列。",
            ),
            why(Q.of(-Dy, D), "The sign is flipped: $D_y = af - ce$, in that order.", "符号反了：$D_y = af - ce$，顺序不能换。"),
            why(Q.of(D, Dy === 0 ? 1 : Dy), "The fraction is upside down: $y = \\frac{D_y}{D}$.", "分数上下颠倒了：$y = \\frac{D_y}{D}$。"),
            why(Q.of(Dy), `That is $D_y$ itself; divide it by $D = ${D}$.`, `这是 $D_y$ 本身；还要除以 $D = ${D}$。`),
          ].filter((m, i, all) => !asQ(m.value).eq(ans) && all.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i),
          solution: walked(
            [
              [
                ["Compute the two determinants", "计算两个行列式"],
                t("", ""),
                [
                  `D = ${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${D}`,
                  `D_y = ${a} \\cdot ${paren(f)} - ${paren(c)} \\cdot ${paren(e)} = ${Dy}`,
                ],
              ],
              [["Divide", "相除"], t(`$y = ${yLatex}$.`, `$y = ${yLatex}$。`)],
            ],
            t(
              `$x = \\frac{D_x}{D} = ${xAns.toLatex()}$ with this $y$ gives $${a} \\cdot \\left(${xAns.toLatex()}\\right) + ${paren(b)} \\cdot \\left(${ans.toLatex()}\\right) = ${xAns
                .mul(Q.of(a))
                .add(ans.mul(Q.of(b)))
                .toLatex()}$, which is $${e}$, the first constant.`,
              `$x = \\frac{D_x}{D} = ${xAns.toLatex()}$ 与这个 $y$ 一起给出 $${a} \\cdot \\left(${xAns.toLatex()}\\right) + ${paren(b)} \\cdot \\left(${ans.toLatex()}\\right) = ${xAns
                .mul(Q.of(a))
                .add(ans.mul(Q.of(b)))
                .toLatex()}$，正是第一个常数 $${e}$。`,
            ),
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
  intro: t(
    "Cramer's rule works the same way for three equations. For $x + y + z = 6$, $y + z = 5$, $z = 3$, the coefficient matrix is upper triangular with $\\det A = 1$. Replacing its first column by $\\mathbf{b} = (6, 5, 3)$ gives $\\det A_1(\\mathbf{b}) = 1$, so $x = \\frac{1}{1} = 1$.\n\nCheck: back substitution gives $z = 3$, $y = 5 - 3 = 2$ and $x = 6 - 2 - 3 = 1$, the same value.\n\nIn this lesson we build the column replacement matrices of a $3 \\times 3$ system and use them to find one unknown.",
    "克莱姆法则对三个方程同样适用。对 $x + y + z = 6$，$y + z = 5$，$z = 3$，系数矩阵是上三角矩阵，$\\det A = 1$。把它的第一列换成 $\\mathbf{b} = (6, 5, 3)$，得 $\\det A_1(\\mathbf{b}) = 1$，所以 $x = \\frac{1}{1} = 1$。\n\n检验：回代得 $z = 3$，$y = 5 - 3 = 2$，$x = 6 - 2 - 3 = 1$，结果相同。\n\n本课我们构造 $3 \\times 3$ 方程组的列替换矩阵，并用它们求一个未知数。",
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
        "For a $3 \\times 3$ system $A\\mathbf{x} = \\mathbf{b}$, Cramer's rule states that if $\\det(A) \\ne 0$, then $x_i = \\frac{\\det(A_i(\\mathbf{b}))}{\\det(A)}$, where $A_i(\\mathbf{b})$ is the matrix formed by replacing the $i$-th column of $A$ with the constant column vector $\\mathbf{b}$. For $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{pmatrix}$ and $\\mathbf{b} = (0, 1, 0)$, $A_2(\\mathbf{b}) = \\begin{pmatrix} 1 & 0 & 3 \\\\ 4 & 1 & 6 \\\\ 7 & 0 & 9 \\end{pmatrix}$.\n\n> **Watch out.** $\\mathbf{b}$ replaces a column, read down, not a row, and only column $i$ changes. Each entry of $\\mathbf{b}$ stays in its own row.",
        "对于 $3 \\times 3$ 方程组 $A\\mathbf{x} = \\mathbf{b}$，克莱姆法则指出若 $\\det(A) \\ne 0$，则 $x_i = \\frac{\\det(A_i(\\mathbf{b}))}{\\det(A)}$，其中 $A_i(\\mathbf{b})$ 是将 $A$ 的第 $i$ 列替换为常数列向量 $\\mathbf{b}$ 得到的矩阵。对 $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{pmatrix}$ 和 $\\mathbf{b} = (0, 1, 0)$，$A_2(\\mathbf{b}) = \\begin{pmatrix} 1 & 0 & 3 \\\\ 4 & 1 & 6 \\\\ 7 & 0 & 9 \\end{pmatrix}$。\n\n> **注意。** $\\mathbf{b}$ 替换的是竖着的一列，不是一行，而且只有第 $i$ 列改变。$\\mathbf{b}$ 的每个分量留在它自己的那一行。",
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
        const option = (m: Mat) => t(`$$${matLatex(m)}$$`, `$$${matLatex(m)}$$`);

        const varStr = colIdx === 1 ? "x_1" : colIdx === 2 ? "x_2" : "x_3";
        const prompt = t(
          `Consider the $3 \\times 3$ system $A\\mathbf{x} = \\mathbf{b}$ with

$$A = ${matLatex(A)}, \\quad \\mathbf{b} = ${colVecLatex(bVec)}$$

Which matrix is $A_{${colIdx}}(\\mathbf{b})$, used in Cramer's rule to compute $${varStr} = \\frac{\\det(A_{${colIdx}}(\\mathbf{b}))}{\\det(A)}$?`,
          `考虑 $3 \\times 3$ 线性系统 $A\\mathbf{x} = \\mathbf{b}$，其中

$$A = ${matLatex(A)}, \\quad \\mathbf{b} = ${colVecLatex(bVec)}$$

在克莱姆法则中用于计算 $${varStr} = \\frac{\\det(A_{${colIdx}}(\\mathbf{b}))}{\\det(A)}$ 的替换矩阵 $A_{${colIdx}}(\\mathbf{b})$ 是哪一个？`,
        );

        return reasoned(
          oneOf(
            rng,
            prompt,
            option(A_correct),
            [option(A_wrong1), option(A_wrong2), option(A_wrong3)],
            walked(
              [
                [
                  ["Find the column to replace", "找出要替换的列"],
                  t(
                    `$A_{${colIdx}}(\\mathbf{b})$ replaces column ${colIdx} of $A$, the coefficients of $${varStr}$.`,
                    `$A_{${colIdx}}(\\mathbf{b})$ 替换 $A$ 的第 ${colIdx} 列，即 $${varStr}$ 的系数。`,
                  ),
                ],
                [
                  ["Put $\\mathbf{b}$ in that column", "把 $\\mathbf{b}$ 放进这一列"],
                  t("", ""),
                  [`A_{${colIdx}}(\\mathbf{b}) = ${matLatex(A_correct)}`],
                ],
              ],
              t(
                `Column ${colIdx} now reads $${b1}, ${b2}, ${b3}$ from top to bottom, the entries of $\\mathbf{b}$ in order, and the other two columns are the same as in $A$.`,
                `第 ${colIdx} 列从上到下现在是 $${b1}, ${b2}, ${b3}$，正是 $\\mathbf{b}$ 的各分量依次排列，其余两列与 $A$ 相同。`,
              ),
            ),
          ),
          [
            [
              option(A_wrong1).en,
              `That replaces column ${wrongCol}, which gives $x_${wrongCol}$; for $${varStr}$ replace column ${colIdx}.`,
              `这替换的是第 ${wrongCol} 列，得到的是 $x_${wrongCol}$；求 $${varStr}$ 要替换第 ${colIdx} 列。`,
            ],
            [
              option(A_wrong2).en,
              `That replaces column ${wrongCol2}, which gives $x_${wrongCol2}$; for $${varStr}$ replace column ${colIdx}.`,
              `这替换的是第 ${wrongCol2} 列，得到的是 $x_${wrongCol2}$；求 $${varStr}$ 要替换第 ${colIdx} 列。`,
            ],
            [
              option(A_wrong3).en,
              `That writes $\\mathbf{b}$ across row ${colIdx}; Cramer's rule replaces a column.`,
              `这是把 $\\mathbf{b}$ 横着写进第 ${colIdx} 行；克莱姆法则替换的是列。`,
            ],
          ],
        );
      },
    },
    {
      id: "computing-one-unknown-of-a-3x3-system-with-cramers-rule",
      title: t("Computing one unknown of a 3×3 system with Cramer's rule", "用克拉默法则求 3×3 方程组的一个未知数"),
      explanation: t(
        "Cramer's rule gives each unknown separately: $x_i = \\frac{\\det A_i(\\mathbf{b})}{\\det A}$, where $A_i(\\mathbf{b})$ is $A$ with column $i$ replaced by $\\mathbf{b}$. To find a single unknown of a $3 \\times 3$ system you only need two $3 \\times 3$ determinants, which is often quicker than full elimination when just one value is wanted. With $\\det A = 2$ and $\\det A_3(\\mathbf{b}) = -6$, $x_3 = -3$.\n\n> **Watch out.** Divide by $\\det A$, the determinant of the original matrix; $\\det A_i(\\mathbf{b})$ alone is not the answer. Keep the fraction the right way up.",
        "克拉默法则可以单独求每个未知数：$x_i = \\frac{\\det A_i(\\mathbf{b})}{\\det A}$，其中 $A_i(\\mathbf{b})$ 是把 $A$ 的第 $i$ 列换成 $\\mathbf{b}$ 后的矩阵。要求 $3 \\times 3$ 方程组的某一个未知数，只需两个 $3 \\times 3$ 行列式；只要一个值时，这往往比完整消元更快。若 $\\det A = 2$，$\\det A_3(\\mathbf{b}) = -6$，则 $x_3 = -3$。\n\n> **注意。** 要除以原矩阵的行列式 $\\det A$；单独的 $\\det A_i(\\mathbf{b})$ 不是答案。分数不要上下颠倒。",
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
        const j = (i + 1) % 3;
        const Dj = det3(A.map((row, r) => row.map((x, cIdx) => (cIdx === j ? b[r]! : x))));
        return numberProblem({
          prompt: t(
            `Use Cramer's rule to find $${name}$ for $A\\mathbf{x} = \\mathbf{b}$ with $A = ${matLatex(A)}$ and $\\mathbf{b} = ${colVecLatex(b)}$.`,
            `用克拉默法则求 $A\\mathbf{x} = \\mathbf{b}$ 的 $${name}$，其中 $A = ${matLatex(A)}$，$\\mathbf{b} = ${colVecLatex(b)}$。`,
          ),
          answer: ans,
          mistakes: [
            why(
              Q.of(-Di, D),
              "The sign is flipped: recheck the signs of the cofactor expansion, $+, -, +$ along the first row.",
              "符号反了：重新检查按第一行展开的符号 $+, -, +$。",
            ),
            why(
              Q.of(Di),
              `That is $\\det A_{${i + 1}}(\\mathbf{b})$ itself; divide it by $\\det A = ${D}$.`,
              `这是 $\\det A_{${i + 1}}(\\mathbf{b})$ 本身；还要除以 $\\det A = ${D}$。`,
            ),
            why(
              Q.of(D, Di === 0 ? 1 : Di),
              "The fraction is upside down: the replaced determinant goes on top.",
              "分数上下颠倒了：替换后的行列式在分子上。",
            ),
            why(
              Q.of(Dj, D),
              `That replaces column ${j + 1}, which gives $x_${j + 1}$; for $${name}$ replace column ${i + 1}.`,
              `这替换的是第 ${j + 1} 列，得到的是 $x_${j + 1}$；求 $${name}$ 要替换第 ${i + 1} 列。`,
            ),
          ].filter((m, k, all) => !asQ(m.value).eq(ans) && all.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === k),
          solution: walked(
            [
              [
                ["Compute $\\det A$", "计算 $\\det A$"],
                t(`Expanding along the first row, $\\det A = ${D}$.`, `按第一行展开，$\\det A = ${D}$。`),
              ],
              [
                [`Replace column ${i + 1} by $\\mathbf{b}$`, `把第 ${i + 1} 列换成 $\\mathbf{b}$`],
                t("", ""),
                [`\\det A_{${i + 1}}(\\mathbf{b}) = \\det ${matLatex(Ai)} = ${Di}`],
              ],
              [
                ["Divide", "相除"],
                t(`$${name} = \\frac{${Di}}{${D}} = ${ans.toLatex()}$.`, `$${name} = \\frac{${Di}}{${D}} = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `$${name} \\cdot \\det A = ${ans.toLatex()} \\cdot ${paren(D)} = ${Di}$, which is $\\det A_{${i + 1}}(\\mathbf{b})$, as Cramer's rule requires.`,
              `$${name} \\cdot \\det A = ${ans.toLatex()} \\cdot ${paren(D)} = ${Di}$，正是 $\\det A_{${i + 1}}(\\mathbf{b})$，与克莱姆法则一致。`,
            ),
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
  intro: t(
    "The $2 \\times 2$ formula $ad - bc$ already has the pattern of every determinant: pick one entry from each row, all in different columns, multiply, and attach a sign. The product $ad$ takes columns in the order $(1, 2)$, with no pair out of order, so its sign is $+$; the product $bc$ takes them in the order $(2, 1)$, with one pair out of order, so its sign is $-$.\n\nCheck: for $\\begin{pmatrix} 3 & 1 \\\\ 4 & 2 \\end{pmatrix}$ the two signed products give $6 - 4 = 2$, the same as $ad - bc$.\n\nIn this lesson we count the inversions of a permutation to find its sign, the sign of its term in the determinant, and use this to find the determinant of a permutation matrix.",
    "$2 \\times 2$ 的公式 $ad - bc$ 已经具有所有行列式的模式：每行取一个元素，各在不同的列，相乘，再配上符号。乘积 $ad$ 依次取第 $(1, 2)$ 列，没有一对顺序颠倒，符号为 $+$；乘积 $bc$ 依次取第 $(2, 1)$ 列，有一对顺序颠倒，符号为 $-$。\n\n检验：对 $\\begin{pmatrix} 3 & 1 \\\\ 4 & 2 \\end{pmatrix}$，两个带符号的乘积给出 $6 - 4 = 2$，与 $ad - bc$ 相同。\n\n本课我们数排列的逆序来求它的符号，也就是它在行列式中那一项的符号，并用它求置换矩阵的行列式。",
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
        "For an $n \\times n$ matrix $A = (a_{ij})$, the determinant is defined by the Leibniz formula: $\\det(A) = \\sum_{\\sigma \\in S_n} \\text{sgn}(\\sigma) \\prod_{i=1}^n a_{i, \\sigma(i)}$, where $S_n$ is the symmetric group of $n!$ permutations. The signature $\\text{sgn}(\\sigma) = (-1)^{\\text{inv}(\\sigma)}$, where $\\text{inv}(\\sigma)$ is the number of inversions (pairs $i < j$ with $\\sigma(i) > \\sigma(j)$). The permutation $(2, 3, 1)$ has the inversions $(2, 1)$ and $(3, 1)$, so it is even, with sign $+1$.\n\n> **Watch out.** Count every pair, not only neighbours: in $(3, 1, 2)$ the $3$ is ahead of both $1$ and $2$, so there are $2$ inversions. An even count gives $+1$ and an odd count $-1$.",
        "对于 $n \\times n$ 矩阵 $A = (a_{ij})$，其行列式由莱布尼茨公式定义：$\\det(A) = \\sum_{\\sigma \\in S_n} \\text{sgn}(\\sigma) \\prod_{i=1}^n a_{i, \\sigma(i)}$，其中 $S_n$ 为包含 $n!$ 个置换的对称群。置换的符号 $\\text{sgn}(\\sigma) = (-1)^{\\text{inv}(\\sigma)}$，其中 $\\text{inv}(\\sigma)$ 为逆序数（即满足 $i < j$ 且 $\\sigma(i) > \\sigma(j)$ 的数对个数）。置换 $(2, 3, 1)$ 的逆序是 $(2, 1)$ 和 $(3, 1)$，所以是偶置换，符号为 $+1$。\n\n> **注意。** 要数所有的数对，而不只是相邻的：在 $(3, 1, 2)$ 中，$3$ 排在 $1$ 和 $2$ 的前面，所以有 $2$ 个逆序。偶数个得 $+1$，奇数个得 $-1$。",
      ),
      generate(rng) {
        const n = rng.pick([4, 5]);
        const p = rng.shuffle(Array.from({ length: n }, (_, i) => i + 1));
        let invCount = 0;
        const ahead: number[] = [];
        for (let i = 0; i < p.length; i++) {
          let c = 0;
          for (let j = i + 1; j < p.length; j++) {
            if (p[i]! > p[j]!) c++;
          }
          ahead.push(c);
          invCount += c;
        }
        const sgn = invCount % 2 === 0 ? 1 : -1;
        const signStr = sgn > 0 ? "+1" : "-1";
        const flip = sgn > 0 ? "-1" : "+1";
        const parityEn = invCount % 2 === 0 ? "even" : "odd";
        const parityZh = invCount % 2 === 0 ? "偶" : "奇";
        const opt = (inv: number, s: string) =>
          t(
            `$\\text{inv}(\\sigma) = ${inv}$, so $\\text{sgn}(\\sigma) = ${s}$`,
            `$\\text{inv}(\\sigma) = ${inv}$，故 $\\text{sgn}(\\sigma) = ${s}$`,
          );

        const prompt = t(
          `In the Leibniz formula for the determinant of ${article(n)} $${n} \\times ${n}$ matrix $A = (a_{ij})$, consider the permutation $\\sigma = (${p.join(", ")})$. What is its number of inversions $\\text{inv}(\\sigma)$ and signature $\\text{sgn}(\\sigma)$?`,
          `在 $${n} \\times ${n}$ 矩阵 $A = (a_{ij})$ 的行列式莱布尼茨展开式中，考虑置换 $\\sigma = (${p.join(", ")})$。它的逆序数 $\\text{inv}(\\sigma)$ 和符号 $\\text{sgn}(\\sigma)$ 分别是多少？`,
        );

        return reasoned(
          oneOf(
            rng,
            prompt,
            opt(invCount, signStr),
            [opt(invCount, flip), opt(invCount + 1, flip), opt(Math.max(0, invCount - 1), flip), opt(invCount + 2, signStr)],
            walked(
              [
                [
                  ["Count the inversions entry by entry", "逐个数逆序"],
                  t(
                    `For each entry, count the smaller entries after it: $${ahead.join(" + ")} = ${invCount}$.`,
                    `对每个数，数排在它后面且比它小的数：$${ahead.join(" + ")} = ${invCount}$。`,
                  ),
                ],
                [
                  ["Read the sign", "读出符号"],
                  t(
                    `$(-1)^{${invCount}} = ${signStr}$, so $\\sigma$ is ${parityEn}.`,
                    `$(-1)^{${invCount}} = ${signStr}$，所以 $\\sigma$ 是${parityZh}置换。`,
                  ),
                ],
              ],
              t(
                `The sign always matches the parity of the count: $${invCount}$ is ${parityEn}, and $\\text{sgn}(\\sigma) = ${signStr}$.`,
                `符号总与逆序数的奇偶一致：$${invCount}$ 是${parityZh}数，$\\text{sgn}(\\sigma) = ${signStr}$。`,
              ),
            ),
          ),
          [
            [
              opt(invCount, flip).en,
              `The count is right but the sign is not: $(-1)^{${invCount}} = ${signStr}$.`,
              `逆序数对了，符号不对：$(-1)^{${invCount}} = ${signStr}$。`,
            ],
            [
              opt(invCount + 1, flip).en,
              "One inversion too many: count each pair $i < j$ with $\\sigma(i) > \\sigma(j)$ exactly once.",
              "多数了一个逆序：每个满足 $i < j$ 且 $\\sigma(i) > \\sigma(j)$ 的数对只数一次。",
            ],
            [
              opt(Math.max(0, invCount - 1), flip).en,
              "One inversion is missing: compare each entry with every later entry, not only its neighbour.",
              "少数了一个逆序：每个数要与后面所有的数比较，而不只是相邻的那个。",
            ],
            [
              opt(invCount + 2, signStr).en,
              "Two inversions too many; the sign happens to agree, but the count does not.",
              "多数了两个逆序；符号碰巧一致，但逆序数不对。",
            ],
          ],
        );
      },
    },
    {
      id: "the-determinant-of-a-permutation-matrix",
      title: t("The determinant of a permutation matrix", "置换矩阵的行列式"),
      explanation: t(
        "A permutation matrix has exactly one $1$ in each row and column. In the Leibniz formula only the term for its own permutation $\\sigma$ is nonzero, and that term is $\\operatorname{sgn}(\\sigma) \\cdot 1$. So the determinant is $(-1)^k$, where $k$ is the number of inversions of $\\sigma$, the pairs $i < j$ with $\\sigma(i) > \\sigma(j)$. The matrix with rows $e_2, e_1, e_3$ has $\\sigma = (2, 1, 3)$, one inversion, and determinant $-1$.\n\n> **Watch out.** The determinant is $+1$ or $-1$, never $0$ and never the number of inversions itself. Read $\\sigma(i)$ as the column of the $1$ in row $i$.",
        "置换矩阵每行每列恰有一个 $1$。在莱布尼茨公式中只有对应其自身置换 $\\sigma$ 的项非零，该项为 $\\operatorname{sgn}(\\sigma) \\cdot 1$。所以行列式为 $(-1)^k$，其中 $k$ 是 $\\sigma$ 的逆序数，即满足 $i < j$ 且 $\\sigma(i) > \\sigma(j)$ 的对数。各行依次为 $e_2, e_1, e_3$ 的矩阵有 $\\sigma = (2, 1, 3)$，一个逆序，行列式为 $-1$。\n\n> **注意。** 行列式是 $+1$ 或 $-1$，永远不是 $0$，也不是逆序数本身。$\\sigma(i)$ 读作第 $i$ 行中 $1$ 所在的列。",
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
          mistakes: [
            why(
              -ans,
              `The sign is wrong: $${inv}$ is ${inv % 2 === 0 ? "even" : "odd"}, so $(-1)^{${inv}} = ${ans}$.`,
              `符号错了：$${inv}$ 是${inv % 2 === 0 ? "偶" : "奇"}数，所以 $(-1)^{${inv}} = ${ans}$。`,
            ),
            why(
              0,
              "A permutation matrix is invertible: exactly one term of the Leibniz formula is nonzero, so the determinant is $\\pm 1$.",
              "置换矩阵可逆：莱布尼茨公式中恰有一项非零，所以行列式是 $\\pm 1$。",
            ),
            why(
              n,
              "That is the size of the matrix; the determinant is the sign $(-1)^k$ of the permutation.",
              "这是矩阵的阶数；行列式是置换的符号 $(-1)^k$。",
            ),
            why(
              inv,
              "That is the number of inversions; the determinant is $(-1)$ raised to it.",
              "这是逆序数；行列式是 $(-1)$ 的这个次方。",
            ),
          ].filter((m, i, all) => m.value !== ans && all.findIndex((x) => x.value === m.value) === i),
          solution: walked(
            [
              [
                ["Read the permutation", "读出置换"],
                t(
                  `Row $i$ has its $1$ in column $\\sigma(i)$, so $\\sigma = (${sigma.join(", ")})$.`,
                  `第 $i$ 行的 $1$ 在第 $\\sigma(i)$ 列，所以 $\\sigma = (${sigma.join(", ")})$。`,
                ),
              ],
              [
                ["Count inversions and take the sign", "数逆序并取符号"],
                t(
                  `It has $${inv}$ inversion${inv === 1 ? "" : "s"}, so $\\det P = (-1)^{${inv}} = ${ans}$.`,
                  `它有 $${inv}$ 个逆序，所以 $\\det P = (-1)^{${inv}} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Each inversion corresponds to undoing one swap of rows on the way back to $I$, and every swap changes the sign, so $${inv}$ swaps turn $\\det I = 1$ into $${ans}$.`,
              `可以用 $${inv}$ 次相邻两行的交换把 $P$ 还原为 $I$，每次交换改变一次符号，所以 $\\det I = 1$ 变为 $${ans}$。`,
            ),
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
  intro: t(
    "A determinant can be expanded along any row or column, and a row full of zeros makes the work short. In $\\begin{pmatrix} 2 & 5 & 1 \\\\ 0 & 3 & 0 \\\\ 4 & 7 & 1 \\end{pmatrix}$ the middle row has one nonzero entry, $3$, in position $(2, 2)$ with sign $+$. Deleting its row and column leaves $\\begin{pmatrix} 2 & 1 \\\\ 4 & 1 \\end{pmatrix}$, whose determinant is $-2$, so the determinant is $3 \\cdot (-2) = -6$.\n\nCheck: expanding along the first row instead gives $2(3 - 0) - 5(0 - 0) + 1(0 - 12) = 6 - 12 = -6$.\n\nIn this lesson we compute cofactors and expand determinants along the row or column with the most zeros.",
    "行列式可以按任意一行或一列展开，含很多零的行会让计算变短。在 $\\begin{pmatrix} 2 & 5 & 1 \\\\ 0 & 3 & 0 \\\\ 4 & 7 & 1 \\end{pmatrix}$ 中，中间一行只有一个非零元 $3$，位于 $(2, 2)$，符号为 $+$。划去它所在的行和列剩下 $\\begin{pmatrix} 2 & 1 \\\\ 4 & 1 \\end{pmatrix}$，行列式为 $-2$，所以原行列式为 $3 \\cdot (-2) = -6$。\n\n检验：改按第一行展开，得 $2(3 - 0) - 5(0 - 0) + 1(0 - 12) = 6 - 12 = -6$。\n\n本课我们计算代数余子式，并沿含零最多的行或列展开行列式。",
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
        "By Laplace's expansion theorem, $\\det(A) = \\sum_{j=1}^n a_{ij} C_{ij} = \\sum_{i=1}^n a_{ij} C_{ij}$, where cofactor $C_{ij} = (-1)^{i+j} M_{ij}$ and $M_{ij}$ is the determinant of the $(n-1) \\times (n-1)$ submatrix obtained by deleting row $i$ and column $j$. Choosing a row or column with the maximum number of zeros reduces computation. A row $(0, 0, 5, 0)$ leaves only $5 \\cdot C_{i3}$.\n\n> **Watch out.** The entry is multiplied by its cofactor, which carries the sign $(-1)^{i+j}$; position $(2, 3)$ has sign $-$. Leaving the sign out, or forgetting the entry itself, gives a wrong value.",
        "根据拉普拉斯展开定理，$\\det(A) = \\sum_{j=1}^n a_{ij} C_{ij} = \\sum_{i=1}^n a_{ij} C_{ij}$，其中代数余子式 $C_{ij} = (-1)^{i+j} M_{ij}$，$M_{ij}$ 是划去第 $i$ 行和第 $j$ 列后得到的余子式。选择含有最多零的行或列进行展开，可以大幅减少计算量。一行 $(0, 0, 5, 0)$ 只留下 $5 \\cdot C_{i3}$。\n\n> **注意。** 元素要乘以它的代数余子式，而代数余子式带符号 $(-1)^{i+j}$；位置 $(2, 3)$ 的符号是 $-$。漏掉符号或漏乘元素本身，结果都不对。",
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
        const minor: Mat = [
          [m11, m12, m13],
          [m21, m22, m23],
          [m31, m32, m33],
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
          solution: walked(
            [
              [
                ["Expand along row 2", "沿第 2 行展开"],
                t(
                  `Row 2 has one nonzero entry, $a_{23} = ${k}$, with sign $(-1)^{2+3} = -1$:`,
                  `第 2 行只有一个非零元 $a_{23} = ${k}$，符号为 $(-1)^{2+3} = -1$：`,
                ),
                [`\\det(A) = a_{23} C_{23} = -(${k}) M_{23}`],
              ],
              [
                ["Compute the minor", "计算余子式"],
                t(
                  `Deleting row 2 and column 3 leaves an upper triangular matrix, so $M_{23} = ${m11} \\cdot ${m22} \\cdot ${m33} = ${minorDet}$.`,
                  `划去第 2 行和第 3 列，剩下上三角矩阵，所以 $M_{23} = ${m11} \\cdot ${m22} \\cdot ${m33} = ${minorDet}$。`,
                ),
                [`M_{23} = \\det ${matLatex(minor)} = ${minorDet}`],
              ],
              [["Multiply", "相乘"], t(`$\\det(A) = -(${k})(${minorDet}) = ${ans}$.`, `$\\det(A) = -(${k})(${minorDet}) = ${ans}$。`)],
            ],
            t(
              `Column 3 is the only one where row 2 is nonzero, and the sign pattern of row 2 is $-, +, -, +$, so position $(2, 3)$ is indeed $-$, and $-(${k})(${minorDet}) = ${ans}$.`,
              `第 2 行只在第 3 列非零，而第 2 行的符号依次为 $-, +, -, +$，所以位置 $(2, 3)$ 确实是 $-$，$-(${k})(${minorDet}) = ${ans}$。`,
            ),
          ),
          mistakes: [
            why(
              -ans,
              "The sign of the cofactor is missing: position $(2, 3)$ has sign $(-1)^{2+3} = -1$.",
              "漏了代数余子式的符号：位置 $(2, 3)$ 的符号是 $(-1)^{2+3} = -1$。",
            ),
            why(
              sign * minorDet,
              `That is the cofactor $C_{23}$ alone; multiply it by the entry $a_{23} = ${k}$.`,
              `这只是代数余子式 $C_{23}$；还要乘以元素 $a_{23} = ${k}$。`,
            ),
            why(
              ans + k,
              "That is not a product of the entry and its cofactor; with only one nonzero entry in row 2, the determinant is that single product.",
              "这不是元素与其代数余子式的乘积；第 2 行只有一个非零元，行列式就是这一个乘积。",
            ),
          ].filter((m, i, all) => m.value !== ans && all.findIndex((x) => x.value === m.value) === i),
        });
      },
    },
    {
      id: "computing-a-cofactor-of-a-3x3-matrix",
      title: t("Computing a cofactor of a 3×3 matrix", "计算 3×3 矩阵的余子式"),
      explanation: t(
        "The cofactor $C_{ij}$ of $A$ is $(-1)^{i+j}M_{ij}$, where the minor $M_{ij}$ is the determinant of the matrix left after deleting row $i$ and column $j$. The sign follows a checkerboard pattern starting with $+$ in the top-left corner. Laplace expansion along a row adds up $a_{ij}C_{ij}$ across that row. For $\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 0 \\end{pmatrix}$: $M_{12} = 4 \\cdot 0 - 6 \\cdot 7 = -42$, and $C_{12} = -M_{12} = 42$.\n\n> **Watch out.** The minor is a determinant, $ad - bc$ with a minus sign, and the cofactor then adds the checkerboard sign. The cofactor does not include the entry $a_{ij}$ itself.",
        "$A$ 的代数余子式 $C_{ij}$ 为 $(-1)^{i+j}M_{ij}$，其中余子式 $M_{ij}$ 是删去第 $i$ 行和第 $j$ 列后所得矩阵的行列式。符号按棋盘格交替，左上角为 $+$。沿某行的拉普拉斯展开就是把该行的 $a_{ij}C_{ij}$ 相加。对 $\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 0 \\end{pmatrix}$：$M_{12} = 4 \\cdot 0 - 6 \\cdot 7 = -42$，$C_{12} = -M_{12} = 42$。\n\n> **注意。** 余子式是行列式 $ad - bc$，中间是减号；代数余子式再加上棋盘格的符号。代数余子式不包括元素 $a_{ij}$ 本身。",
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
          mistakes: [
            why(
              -ans,
              `The checkerboard sign is wrong or missing: $(-1)^{${i}+${j}} = ${sign}$.`,
              `棋盘格符号错了或漏了：$(-1)^{${i}+${j}} = ${sign}$。`,
            ),
            why(
              sign * (sub[0]![0]! * sub[1]![1]! + sub[0]![1]! * sub[1]![0]!),
              "The minor was computed as $ad + bc$; a $2 \\times 2$ determinant is $ad - bc$.",
              "余子式算成了 $ad + bc$；$2 \\times 2$ 行列式是 $ad - bc$。",
            ),
            why(
              A[i - 1]![j - 1]! * ans,
              `That multiplies by the entry $a_{${i}${j}}$; the cofactor itself does not include it.`,
              `这乘上了元素 $a_{${i}${j}}$；代数余子式本身不包括它。`,
            ),
          ].filter((m, k, all) => m.value !== ans && all.findIndex((x) => x.value === m.value) === k),
          solution: walked(
            [
              [
                [`Delete row ${i} and column ${j}`, `划去第 ${i} 行和第 ${j} 列`],
                t("", ""),
                [`M_{${i}${j}} = \\det ${matLatex(sub)} = (${sub[0]![0]})(${sub[1]![1]}) - (${sub[0]![1]})(${sub[1]![0]}) = ${M}`],
              ],
              [
                ["Attach the sign", "加上符号"],
                t(
                  `The sign is $(-1)^{${i + j}} = ${sign}$, so $C_{${i}${j}} = ${ans}$.`,
                  `符号为 $(-1)^{${i + j}} = ${sign}$，所以 $C_{${i}${j}} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `In the checkerboard $+ - +$, $- + -$, $+ - +$, row ${i} column ${j} carries $${sign > 0 ? "+" : "-"}$, and $${sign} \\cdot ${paren(M)} = ${ans}$.`,
              `在棋盘格 $+ - +$，$- + -$，$+ - +$ 中，第 ${i} 行第 ${j} 列是 $${sign > 0 ? "+" : "-"}$，$${sign} \\cdot ${paren(M)} = ${ans}$。`,
            ),
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
  intro: t(
    "Doubling a $2 \\times 2$ matrix doubles both of its rows, and each row scales the determinant once. For $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$, $\\det A = -2$, while $2A = \\begin{pmatrix} 2 & 4 \\\\ 6 & 8 \\end{pmatrix}$ has $\\det(2A) = 16 - 24 = -8 = 2^2 \\cdot (-2)$.\n\nCheck: $\\det A^T = \\det \\begin{pmatrix} 1 & 3 \\\\ 2 & 4 \\end{pmatrix} = 4 - 6 = -2$, the same as $\\det A$.\n\nIn this lesson we use the rules for transposes, products, inverses and scalar multiples to find determinants without computing any matrix.",
    "把 $2 \\times 2$ 矩阵乘以 $2$，两行都乘以 $2$，而每一行都使行列式乘一次。对 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$，$\\det A = -2$，而 $2A = \\begin{pmatrix} 2 & 4 \\\\ 6 & 8 \\end{pmatrix}$ 有 $\\det(2A) = 16 - 24 = -8 = 2^2 \\cdot (-2)$。\n\n检验：$\\det A^T = \\det \\begin{pmatrix} 1 & 3 \\\\ 2 & 4 \\end{pmatrix} = 4 - 6 = -2$，与 $\\det A$ 相同。\n\n本课我们用转置、乘积、逆矩阵和数乘的法则求行列式，而不必算出任何矩阵。",
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
        "Multiplying a whole matrix by a scalar multiplies every row by it, so the determinant picks up one factor of the scalar for each row. For $n \\times n$ square matrices $A$ and $B$, and scalar $k$: (1) $\\det(A^T) = \\det(A)$; (2) $\\det(AB) = \\det(A)\\det(B)$; (3) $\\det(kA) = k^n \\det(A)$, since factor $k$ scales all $n$ rows. For $3 \\times 3$ matrices with $\\det A = 2$: $\\det(3A) = 27 \\cdot 2 = 54$.\n\n> **Watch out.** A scalar in front of an $n \\times n$ matrix comes out as $k^n$, not $k$. And the determinant of a product is the product of the determinants, not their sum.",
        "用一个数乘整个矩阵相当于每一行都乘以它，所以行列式对每一行都多出一个这样的因子。对于 $n \\times n$ 方阵 $A$ 和 $B$ 以及标量 $k$：(1) $\\det(A^T) = \\det(A)$；(2) $\\det(AB) = \\det(A)\\det(B)$；(3) $\\det(kA) = k^n \\det(A)$，因为数乘 $k$ 会将矩阵的全部 $n$ 行同时乘以 $k$。对 $\\det A = 2$ 的 $3 \\times 3$ 矩阵：$\\det(3A) = 27 \\cdot 2 = 54$。\n\n> **注意。** $n \\times n$ 矩阵前面的数提出来是 $k^n$，不是 $k$。乘积的行列式等于行列式之积，不是之和。",
      ),
      generate(rng) {
        const n = rng.pick([2, 3, 4]);
        const detA = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const detB = rng.pick([-4, -3, -2, 2, 3, 4]);
        const k = rng.pick([2, 3, -2]);

        const kn = k ** n;
        const ans = kn * detA * detB;

        const prompt = t(
          `Let $A$ and $B$ be $${n} \\times ${n}$ matrices such that $\\det(A) = ${detA}$ and $\\det(B) = ${detB}$. What is $\\det(${k} A^T B)$?`,
          `设 $A$ 和 $B$ 均为 $${n} \\times ${n}$ 矩阵，已知 $\\det(A) = ${detA}$ 且 $\\det(B) = ${detB}$。求 $\\det(${k} A^T B)$ 的值。`,
        );

        return numberProblem({
          prompt,
          answer: ans,
          solution: walked(
            [
              [
                ["Take the scalar out", "提出数乘因子"],
                t(
                  `The matrices are $${n} \\times ${n}$, so the scalar comes out as $(${k})^{${n}} = ${kn}$.`,
                  `矩阵是 $${n} \\times ${n}$ 阶，所以数乘因子提出来是 $(${k})^{${n}} = ${kn}$。`,
                ),
              ],
              [
                ["Use the transpose and product rules", "用转置与乘积法则"],
                t("", ""),
                [`\\det(${k} A^T B) = ${kn} \\cdot \\det(A^T) \\det(B) = ${kn} \\cdot (${detA})(${detB}) = ${ans}`],
              ],
            ],
            t(
              `Each of the $${n}$ rows of $${k} A^T B$ carries one factor $${k}$, giving $(${k})^{${n}} = ${kn}$, and $\\det(A^T B) = (${detA})(${detB}) = ${detA * detB}$; $${kn} \\cdot ${paren(detA * detB)} = ${ans}$.`,
              `$${k} A^T B$ 的 $${n}$ 行各带一个因子 $${k}$，共 $(${k})^{${n}} = ${kn}$，而 $\\det(A^T B) = (${detA})(${detB}) = ${detA * detB}$；$${kn} \\cdot ${paren(detA * detB)} = ${ans}$。`,
            ),
          ),
          mistakes: [
            why(
              k * detA * detB,
              `The scalar comes out once for each row: $(${k})^{${n}}$, not $${k}$.`,
              `数乘因子每一行提出一次：是 $(${k})^{${n}}$，不是 $${k}$。`,
            ),
            why(
              k ** (n - 1) * detA * detB,
              `The scalar comes out once for each of the $${n}$ rows, so the power is $${n}$.`,
              `数乘因子对 $${n}$ 行各提出一次，所以指数是 $${n}$。`,
            ),
            why(-ans, "The sign is flipped: transposing does not change the determinant.", "符号反了：转置不改变行列式。"),
            why(
              kn * (detA + detB),
              "The determinant of a product is the product of the determinants, not their sum.",
              "乘积的行列式是行列式之积，不是之和。",
            ),
          ].filter((m, i, all) => m.value !== ans && all.findIndex((x) => x.value === m.value) === i),
        });
      },
    },
    {
      id: "the-determinant-of-a-product-with-an-inverse",
      title: t("The determinant of a product with an inverse", "含逆矩阵乘积的行列式"),
      explanation: t(
        "The determinant is multiplicative, $\\det(AB) = \\det A \\det B$, and $\\det(B^{-1}) = \\frac{1}{\\det B}$. Together these give\n\n$$\\det(A^2B^{-1}) = \\frac{(\\det A)^2}{\\det B}.$$\n\nThe order of the factors does not matter for the determinant, even though $AB \\ne BA$ in general. With $\\det A = 3$ and $\\det B = 2$: $\\det(A^2B^{-1}) = \\frac{9}{2}$.\n\n> **Watch out.** $\\det(A^2) = (\\det A)^2$, a square, not $2 \\det A$. And $B^{-1}$ divides by $\\det B$; it does not multiply or change the sign.",
        "行列式具有乘性，$\\det(AB) = \\det A \\det B$，且 $\\det(B^{-1}) = \\frac{1}{\\det B}$。合起来得\n\n$$\\det(A^2B^{-1}) = \\frac{(\\det A)^2}{\\det B}$$\n\n虽然一般 $AB \\ne BA$，但因子的次序不影响行列式。若 $\\det A = 3$，$\\det B = 2$：$\\det(A^2B^{-1}) = \\frac{9}{2}$。\n\n> **注意。** $\\det(A^2) = (\\det A)^2$ 是平方，不是 $2 \\det A$。$B^{-1}$ 是除以 $\\det B$，不是乘以它，也不是改变符号。",
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
          mistakes: [
            why(
              Q.of(2 * dA, dB),
              "$\\det(A^2)$ is $(\\det A)^2$, a square, not $2 \\det A$.",
              "$\\det(A^2)$ 是 $(\\det A)^2$，是平方，不是 $2 \\det A$。",
            ),
            why(
              Q.of(dA * dA * dB),
              "That multiplies by $\\det B$; the inverse divides: $\\det(B^{-1}) = \\frac{1}{\\det B}$.",
              "这是乘以 $\\det B$；逆矩阵是除以它：$\\det(B^{-1}) = \\frac{1}{\\det B}$。",
            ),
            why(
              Q.of(dA * dA, -dB),
              "The sign is flipped: inverting divides by $\\det B$ and keeps its sign.",
              "符号反了：求逆是除以 $\\det B$，保留它的符号。",
            ),
            why(
              Q.of(dA, dB),
              "That uses $\\det A$ once; $A^2$ contributes $(\\det A)^2$.",
              "这只用了一次 $\\det A$；$A^2$ 贡献的是 $(\\det A)^2$。",
            ),
          ].filter((m, i, all) => !asQ(m.value).eq(ans) && all.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i),
          solution: walked(
            [
              [
                ["Split the product", "拆开乘积"],
                t("", ""),
                [`\\det(A^2B^{-1}) = \\det(A)^2 \\cdot \\det(B^{-1}) = (${dA})^2 \\cdot \\frac{1}{${dB}}`],
              ],
              [
                ["Simplify", "化简"],
                t(`$\\frac{${dA * dA}}{${dB}} = ${ans.toLatex()}$.`, `$\\frac{${dA * dA}}{${dB}} = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `Multiplying back by $B$ must give $\\det(A^2) = ${dA * dA}$: $${ans.toLatex()} \\cdot ${paren(dB)} = ${dA * dA}$.`,
              `再乘回 $B$ 应得 $\\det(A^2) = ${dA * dA}$：$${ans.toLatex()} \\cdot ${paren(dB)} = ${dA * dA}$。`,
            ),
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
  intro: t(
    "Since $AA^{-1} = I$ and $\\det I = 1$, the product rule forces $\\det A \\cdot \\det A^{-1} = 1$. For $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$, $\\det A = 1$, and for $B = \\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$, $\\det B = 6$, so $\\det B^{-1} = \\frac{1}{6}$ and $\\det B^2 = 36$.\n\nCheck: $B^{-1} = \\begin{pmatrix} \\frac{1}{2} & 0 \\\\ 0 & \\frac{1}{3} \\end{pmatrix}$ has determinant $\\frac{1}{6}$, and $B^2 = \\begin{pmatrix} 4 & 0 \\\\ 0 & 9 \\end{pmatrix}$ has determinant $36$.\n\nIn this lesson we find the determinants of inverses, powers, scalar multiples and adjugates from $\\det A$ alone.",
    "由于 $AA^{-1} = I$ 且 $\\det I = 1$，乘积法则迫使 $\\det A \\cdot \\det A^{-1} = 1$。对 $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$，$\\det A = 1$；对 $B = \\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$，$\\det B = 6$，所以 $\\det B^{-1} = \\frac{1}{6}$，$\\det B^2 = 36$。\n\n检验：$B^{-1} = \\begin{pmatrix} \\frac{1}{2} & 0 \\\\ 0 & \\frac{1}{3} \\end{pmatrix}$ 的行列式是 $\\frac{1}{6}$，$B^2 = \\begin{pmatrix} 4 & 0 \\\\ 0 & 9 \\end{pmatrix}$ 的行列式是 $36$。\n\n本课我们只用 $\\det A$ 求逆矩阵、幂、数乘和伴随矩阵的行列式。",
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
        "A square matrix $A$ is invertible if and only if $\\det(A) \\ne 0$. For an invertible $n \\times n$ matrix $A$: (1) $\\det(A^{-1}) = \\frac{1}{\\det(A)}$; (2) $\\det(A^k) = (\\det A)^k$ for any integer $k$; (3) $\\det((cA)^{-1}) = \\frac{1}{c^n \\det(A)}$. With $\\det A = -2$: $\\det(A^3) = -8$, and for $3 \\times 3$ matrices $\\det((2A)^{-1}) = \\frac{1}{8 \\cdot (-2)} = -\\frac{1}{16}$.\n\n> **Watch out.** A power of $A$ raises the determinant to that power; it does not multiply it. Inverting takes the reciprocal and keeps the sign, and the scalar comes out as $c^n$ before inverting.",
        "方阵 $A$ 可逆当且仅当 $\\det(A) \\ne 0$。对于可逆的 $n \\times n$ 矩阵 $A$：(1) $\\det(A^{-1}) = \\frac{1}{\\det(A)}$；(2) 对任意整数 $k$，$\\det(A^k) = (\\det A)^k$；(3) $\\det((cA)^{-1}) = \\frac{1}{c^n \\det(A)}$。若 $\\det A = -2$：$\\det(A^3) = -8$；对 $3 \\times 3$ 矩阵，$\\det((2A)^{-1}) = \\frac{1}{8 \\cdot (-2)} = -\\frac{1}{16}$。\n\n> **注意。** $A$ 的幂使行列式取同样的幂，而不是相乘。求逆是取倒数并保留符号；数乘因子在求逆之前先提出为 $c^n$。",
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
            solution: walked(
              [
                [
                  [`Find $\\det(${c}A)$`, `求 $\\det(${c}A)$`],
                  t("", ""),
                  [`\\det(${c}A) = (${c})^{${n}} \\det(A) = ${cn} \\cdot (${d}) = ${denom}`],
                ],
                [
                  ["Take the reciprocal", "取倒数"],
                  t(
                    `$\\det((${c}A)^{-1}) = \\frac{1}{\\det(${c}A)} = ${ansQ.toLatex()}$.`,
                    `$\\det((${c}A)^{-1}) = \\frac{1}{\\det(${c}A)} = ${ansQ.toLatex()}$。`,
                  ),
                ],
              ],
              t(
                `$\\det(${c}A) \\cdot \\det((${c}A)^{-1}) = ${denom} \\cdot \\left(${ansQ.toLatex()}\\right) = 1 = \\det I$.`,
                `$\\det(${c}A) \\cdot \\det((${c}A)^{-1}) = ${denom} \\cdot \\left(${ansQ.toLatex()}\\right) = 1 = \\det I$。`,
              ),
            ),
            mistakes: [
              why(
                Q.of(-1, denom),
                "The sign is flipped: the reciprocal keeps the sign of $\\det(cA)$.",
                "符号反了：取倒数保留 $\\det(cA)$ 的符号。",
              ),
              why(
                Q.of(1, c * d),
                `The scalar comes out once for each of the $${n}$ rows: $(${c})^{${n}}$, not $${c}$.`,
                `数乘因子对 $${n}$ 行各提出一次：是 $(${c})^{${n}}$，不是 $${c}$。`,
              ),
              why(
                denom,
                `That is $\\det(${c}A)$; the inverse has the reciprocal determinant.`,
                `这是 $\\det(${c}A)$；逆矩阵的行列式是它的倒数。`,
              ),
              why(d, "That is $\\det A$ itself; both the scalar and the inverse change it.", "这是 $\\det A$ 本身；数乘和求逆都会改变它。"),
            ].filter((m, i, all) => !asQ(m.value).eq(ansQ) && all.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i),
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
          solution: walked(
            [
              [
                ["Use the product rule", "用乘积法则"],
                t(
                  `$A^{${power}}$ is a product of $${power}$ copies of $A$, and $\\det(AB) = \\det(A)\\det(B)$.`,
                  `$A^{${power}}$ 是 $${power}$ 个 $A$ 的乘积，而 $\\det(AB) = \\det(A)\\det(B)$。`,
                ),
              ],
              [["Raise to the power", "取幂"], t("", ""), [`\\det(A^{${power}}) = (\\det A)^{${power}} = (${d})^{${power}} = ${ans}`]],
            ],
            t(
              `$${Array(power).fill(paren(d)).join(" \\cdot ")} = ${ans}$, one factor $\\det A$ for each copy of $A$.`,
              `$${Array(power).fill(paren(d)).join(" \\cdot ")} = ${ans}$，每个 $A$ 贡献一个因子 $\\det A$。`,
            ),
          ),
          mistakes: [
            why(
              power * d,
              `The power multiplies the determinant $${power}$ times by itself; it does not multiply it by $${power}$.`,
              `幂是把行列式自乘 $${power}$ 次，而不是乘以 $${power}$。`,
            ),
            why(
              -ans,
              `The sign is wrong: $(${d})^{${power}}$ is ${ans > 0 ? "positive" : "negative"}.`,
              `符号错了：$(${d})^{${power}}$ 是${ans > 0 ? "正" : "负"}数。`,
            ),
            why(d ** (power - 1), `One factor is missing: there are $${power}$ copies of $A$.`, `少了一个因子：共有 $${power}$ 个 $A$。`),
          ].filter((m, i, all) => m.value !== ans && all.findIndex((x) => x.value === m.value) === i),
        });
      },
    },
    {
      id: "the-determinant-of-the-adjugate",
      title: t("The determinant of the adjugate", "伴随矩阵的行列式"),
      explanation: t(
        "The adjugate satisfies $A\\operatorname{adj}(A) = (\\det A)I_n$. Taking determinants of both sides gives $\\det A \\cdot \\det(\\operatorname{adj} A) = (\\det A)^n$, so for invertible $A$\n\n$$\\det(\\operatorname{adj} A) = (\\det A)^{n-1}.$$\n\nThe exponent is $n - 1$, not $n$, because one factor of $\\det A$ cancels. For a $3 \\times 3$ matrix with $\\det A = 2$: $\\det(\\operatorname{adj} A) = 2^2 = 4$.\n\n> **Watch out.** $(\\det A) I_n$ has determinant $(\\det A)^n$, since all $n$ rows carry the factor. Dividing by $\\det A$ leaves the power $n - 1$.",
        "伴随矩阵满足 $A\\operatorname{adj}(A) = (\\det A)I_n$。两边取行列式得 $\\det A \\cdot \\det(\\operatorname{adj} A) = (\\det A)^n$，所以对可逆的 $A$\n\n$$\\det(\\operatorname{adj} A) = (\\det A)^{n-1}$$\n\n指数是 $n - 1$ 而不是 $n$，因为约去了一个 $\\det A$。对 $\\det A = 2$ 的 $3 \\times 3$ 矩阵：$\\det(\\operatorname{adj} A) = 2^2 = 4$。\n\n> **注意。** $(\\det A) I_n$ 的行列式是 $(\\det A)^n$，因为 $n$ 行都带这个因子。再除以 $\\det A$，剩下的指数是 $n - 1$。",
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
          mistakes: [
            why(
              d ** n,
              "That is $\\det((\\det A) I_n)$; one factor of $\\det A$ cancels against $\\det A$ on the left.",
              "这是 $\\det((\\det A) I_n)$；还要与左边的 $\\det A$ 约去一个因子。",
            ),
            why(
              d,
              `That is $\\det A$ itself; the adjugate's determinant is $(\\det A)^{${n} - 1}$.`,
              `这是 $\\det A$ 本身；伴随矩阵的行列式是 $(\\det A)^{${n} - 1}$。`,
            ),
            why(
              Q.of(1, d),
              "That is the determinant of $A^{-1}$; the adjugate is $(\\det A) A^{-1}$, not $A^{-1}$.",
              "这是 $A^{-1}$ 的行列式；伴随矩阵是 $(\\det A) A^{-1}$，不是 $A^{-1}$。",
            ),
            why(d ** (n - 2), "One factor too few: the power is $n - 1$.", "少了一个因子：指数是 $n - 1$。"),
          ].filter((m, i, all) => !asQ(m.value).eq(asQ(ans)) && all.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i),
          solution: walked(
            [
              [
                ["Take determinants of $A \\operatorname{adj}(A) = (\\det A) I$", "对 $A \\operatorname{adj}(A) = (\\det A) I$ 取行列式"],
                t("", ""),
                [`${paren(d)} \\cdot \\det(\\operatorname{adj} A) = ${paren(d)}^{${n}}`],
              ],
              [
                ["Divide by $\\det A$", "除以 $\\det A$"],
                t(
                  `$\\det(\\operatorname{adj} A) = ${paren(d)}^{${n - 1}} = ${ans}$.`,
                  `$\\det(\\operatorname{adj} A) = ${paren(d)}^{${n - 1}} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `$${paren(d)} \\cdot ${paren(ans)} = ${d ** n} = ${paren(d)}^{${n}}$, the determinant of $${d} I_{${n}}$.`,
              `$${paren(d)} \\cdot ${paren(ans)} = ${d ** n} = ${paren(d)}^{${n}}$，正是 $${d} I_{${n}}$ 的行列式。`,
            ),
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
  intro: t(
    "Start with $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$, whose determinant is $-2$. Swapping its rows gives $\\begin{pmatrix} 3 & 4 \\\\ 1 & 2 \\end{pmatrix}$, with determinant $6 - 4 = 2$: the sign changed. Adding $-3$ times row $1$ to row $2$ instead gives $\\begin{pmatrix} 1 & 2 \\\\ 0 & -2 \\end{pmatrix}$, with determinant $-2$: no change at all.\n\nCheck: doubling row $1$ gives $\\begin{pmatrix} 2 & 4 \\\\ 3 & 4 \\end{pmatrix}$, with determinant $8 - 12 = -4$, twice the original.\n\nIn this lesson we track how swaps, scalings and row or column additions change a determinant.",
    "从 $\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ 开始，它的行列式是 $-2$。交换两行得 $\\begin{pmatrix} 3 & 4 \\\\ 1 & 2 \\end{pmatrix}$，行列式为 $6 - 4 = 2$：符号变了。改为把第 $1$ 行的 $-3$ 倍加到第 $2$ 行，得 $\\begin{pmatrix} 1 & 2 \\\\ 0 & -2 \\end{pmatrix}$，行列式为 $-2$：完全不变。\n\n检验：把第 $1$ 行乘以 $2$，得 $\\begin{pmatrix} 2 & 4 \\\\ 3 & 4 \\end{pmatrix}$，行列式为 $8 - 12 = -4$，是原来的两倍。\n\n本课我们追踪交换、数乘以及行或列的倍加如何改变行列式。",
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
        "For any square matrix: (1) Swapping two rows (or columns) multiplies the determinant by $-1$; (2) Multiplying a single row (or column) by a scalar $c$ multiplies the determinant by $c$; (3) Adding a scalar multiple of one row (or column) to another row (or column) leaves the determinant unchanged. From $\\det A = 5$, a swap and then tripling a row give $(-1)(3)(5) = -15$.\n\n> **Watch out.** Adding a multiple of a row changes nothing, however large the multiple. Scaling one row by $c$ contributes $c$ once, not $c^n$: only scaling the whole matrix gives $c^n$.",
        "对任意方阵：(1) 交换两行（或两列），行列式的值变号，即乘以 $-1$；(2) 将某一行（或某一列）乘以标量 $c$，行列式的值乘以 $c$；(3) 将一行的倍数加到另一行（或列），行列式的值保持不变。由 $\\det A = 5$ 出发，先交换再把某行乘以 $3$，得 $(-1)(3)(5) = -15$。\n\n> **注意。** 把一行的倍数加到另一行，不论倍数多大，行列式都不变。只把一行乘以 $c$，只贡献一个 $c$，而不是 $c^n$：只有整个矩阵乘以 $c$ 才得 $c^n$。",
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
          solution: walked(
            [
              [
                ["Find the factor of each operation", "求每个变换的因子"],
                t(
                  `The swap gives $-1$, scaling row 3 by $${k}$ gives $${k}$, and adding $${c} R_1$ to $R_3$ gives $1$.`,
                  `交换给出 $-1$，第 3 行乘以 $${k}$ 给出 $${k}$，把 $${c} R_1$ 加到 $R_3$ 给出 $1$。`,
                ),
              ],
              [
                ["Multiply the factors into $\\det A$", "把因子乘到 $\\det A$ 上"],
                t("", ""),
                [`\\det(B) = (-1) \\cdot (${k}) \\cdot 1 \\cdot (${d}) = ${finalDet}`],
              ],
            ],
            t(
              `Undoing the operations in reverse order, $\\det(B) = ${finalDet}$ is unchanged by the row addition, divided by $${k}$ to give $${-d}$, and changes sign with the swap back to $${d} = \\det(A)$.`,
              `按相反顺序撤销这些变换：撤销倍加后 $\\det = ${finalDet}$ 不变，除以 $${k}$ 得 $${-d}$，再交换回来变号得 $${d} = \\det(A)$。`,
            ),
          ),
          mistakes: [
            why(
              -finalDet,
              "The swap of two rows is missing: it multiplies the determinant by $-1$.",
              "漏了两行交换：它使行列式乘以 $-1$。",
            ),
            why(k * d, "The swap changes the sign; that factor $-1$ is missing.", "交换会改变符号；漏了因子 $-1$。"),
            why(
              finalDet * c,
              `Adding $${c}$ times a row to another leaves the determinant unchanged; it does not multiply by $${c}$.`,
              `把一行的 $${c}$ 倍加到另一行不改变行列式，不是乘以 $${c}$。`,
            ),
            why(
              -(k ** 3) * d,
              `Scaling one row by $${k}$ contributes $${k}$ once; $(${k})^3$ would mean scaling all three rows.`,
              `只把一行乘以 $${k}$，只贡献一个 $${k}$；$(${k})^3$ 意味着三行都乘以它。`,
            ),
          ].filter((m, i, all) => m.value !== finalDet && all.findIndex((x) => x.value === m.value) === i),
        });
      },
    },
    {
      id: "the-effect-of-column-operations-on-a-determinant",
      title: t("The effect of column operations on a determinant", "列变换对行列式的影响"),
      explanation: t(
        "Since $\\det A^T = \\det A$, column operations affect the determinant exactly as row operations do. Adding a multiple of one column to another leaves it unchanged, swapping two columns changes its sign, and multiplying a column by $k$ multiplies it by $k$. Track only the swaps and the scalings. From $\\det A = 4$, adding $2$ times column $1$ to column $2$ and then swapping two columns gives $-4$.\n\n> **Watch out.** The multiple in a column addition never enters the answer. Only swaps, each a factor $-1$, and scalings, each a factor $k$, change the determinant.",
        "由于 $\\det A^T = \\det A$，列变换对行列式的影响与行变换完全相同。把一列的倍数加到另一列不改变行列式，交换两列改变符号，某列乘以 $k$ 使行列式乘以 $k$。只需记录交换与数乘。由 $\\det A = 4$ 出发，把第 $1$ 列的 $2$ 倍加到第 $2$ 列，再交换两列，得 $-4$。\n\n> **注意。** 列倍加中的倍数从不进入答案。只有交换（每次因子 $-1$）和数乘（每次因子 $k$）改变行列式。",
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
          mistakes: [
            why(
              -ans,
              swap
                ? "The swap of two columns is missing: it multiplies the determinant by $-1$."
                : "There is no swap here, so the sign changes only through the scaling.",
              swap ? "漏了两列交换：它使行列式乘以 $-1$。" : "这里没有交换，符号只随数乘改变。",
            ),
            why(
              ans * c,
              `Adding $${c}$ times a column to another leaves the determinant unchanged; $${c}$ does not enter the answer.`,
              `把一列的 $${c}$ 倍加到另一列不改变行列式；$${c}$ 不进入答案。`,
            ),
            why(
              d * (swap ? -1 : 1),
              `Multiplying column $2$ by $${k}$ multiplies the determinant by $${k}$.`,
              `第 $2$ 列乘以 $${k}$，行列式乘以 $${k}$。`,
            ),
            why(
              d + k,
              `Scaling a column multiplies the determinant by $${k}$; it does not add $${k}$.`,
              `某列乘以 $${k}$ 是使行列式乘以 $${k}$，不是加上 $${k}$。`,
            ),
          ].filter((m, i, all) => m.value !== ans && all.findIndex((x) => x.value === m.value) === i),
          solution: walked(
            [
              [
                ["Find the factor of each operation", "求每个变换的因子"],
                t(
                  `The column addition gives $1$, scaling column $2$ gives $${k}$${swap ? ", and the swap gives $-1$" : ""}.`,
                  `列倍加给出 $1$，第 $2$ 列乘以 $${k}$ 给出 $${k}$${swap ? "，交换给出 $-1$" : ""}。`,
                ),
              ],
              [
                ["Multiply the factors into $\\det A$", "把因子乘到 $\\det A$ 上"],
                t("", ""),
                [`\\det B = 1 \\cdot (${k})${swap ? " \\cdot (-1)" : ""} \\cdot (${d}) = ${ans}`],
              ],
            ],
            t(
              `Transposing turns each column operation into the same row operation, and $\\det B^T = \\det B$, so the row rules give the same $${ans}$.`,
              `转置把每个列变换变成同样的行变换，而 $\\det B^T = \\det B$，所以按行变换的规则同样得到 $${ans}$。`,
            ),
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
  intro: t(
    "Some determinants are zero at a glance. In $\\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 0 & 1 & 5 \\end{pmatrix}$ row $2$ is twice row $1$; subtracting $2R_1$ from $R_2$ does not change the determinant and leaves a row of zeros, so the determinant is $0$.\n\nCheck: expanding along the first row gives $1(20 - 6) - 2(10 - 0) + 3(2 - 0) = 14 - 20 + 6 = 0$.\n\nIn this lesson we recognise zero determinants from zero, equal or proportional rows, and find the value that makes the rows dependent.",
    "有些行列式一眼就能看出为零。在 $\\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 0 & 1 & 5 \\end{pmatrix}$ 中，第 $2$ 行是第 $1$ 行的两倍；从 $R_2$ 减去 $2R_1$ 不改变行列式，却留下一个全零行，所以行列式为 $0$。\n\n检验：按第一行展开，$1(20 - 6) - 2(10 - 0) + 3(2 - 0) = 14 - 20 + 6 = 0$。\n\n本课我们从全零行、相同的行或成比例的行认出为零的行列式，并求出使各行线性相关的值。",
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
        "A determinant $\\det(A) = 0$ if and only if $A$ is singular (not invertible). Common visual conditions include: (1) an entire row or column of zeros; (2) two identical rows or columns; (3) one row (or column) is a scalar multiple of another (proportional rows). For example, $\\begin{pmatrix} 3 & 1 \\\\ 6 & 2 \\end{pmatrix}$ has $R_2 = 2R_1$ and determinant $6 - 6 = 0$.\n\n> **Watch out.** A zero entry, even several, does not make a determinant zero: a triangular matrix with nonzero diagonal has nonzero determinant. What matters is a whole row of zeros or rows that are multiples of each other.",
        "行列式 $\\det(A) = 0$ 当且仅当 $A$ 为奇异矩阵（不可逆）。直观判定条件包括：(1) 某一行或列全为零；(2) 存在两行或两列完全相同；(3) 某一行（或列）是另一行（或列）的常数倍（即两行对应成比例）。例如 $\\begin{pmatrix} 3 & 1 \\\\ 6 & 2 \\end{pmatrix}$ 有 $R_2 = 2R_1$，行列式为 $6 - 6 = 0$。\n\n> **注意。** 有零元素，哪怕好几个，也不会使行列式为零：对角元非零的三角矩阵行列式不为零。关键是整行为零，或两行成倍数关系。",
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
            walked(
              [
                [
                  ["Look for proportional rows", "找成比例的行"],
                  t(
                    `In $M = ${matLatex(singularMat)}$, row 2 is $${factor}$ times row 1: $R_2 = ${factor} R_1$.`,
                    `在 $M = ${matLatex(singularMat)}$ 中，第 2 行是第 1 行的 $${factor}$ 倍：$R_2 = ${factor} R_1$。`,
                  ),
                ],
                [
                  ["Make a zero row", "化出全零行"],
                  t(
                    `Replacing $R_2$ by $R_2 - ${paren(factor)} R_1$ leaves the determinant unchanged and gives a row of zeros, so $\\det(M) = 0$.`,
                    `把 $R_2$ 换成 $R_2 - ${paren(factor)} R_1$ 不改变行列式，却得到一个全零行，所以 $\\det(M) = 0$。`,
                  ),
                ],
              ],
              t(
                "The other three matrices are triangular with nonzero diagonals, so each determinant is a product of nonzero numbers and cannot be $0$.",
                "其余三个矩阵都是对角元非零的三角矩阵，行列式是非零数之积，不可能为 $0$。",
              ),
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
        "A determinant is zero when the rows are linearly dependent. If row $3$ equals row $1$ plus row $2$ in every entry but one, and that entry is the unknown $k$, then the determinant is a linear function of $k$ that vanishes exactly when row $3$ becomes the sum of the other two, provided rows $1$ and $2$ are independent. So $k$ is the sum of the corresponding entries of rows $1$ and $2$. With rows $(1, 0, 2)$, $(0, 1, 3)$ and $(1, 1, k)$: $k = 2 + 3 = 5$.\n\n> **Watch out.** Row $3$ must be the sum of the other two, so $k$ is their sum in that column, not their difference. Check the known entries first to see that the pattern is a sum.",
        "当各行线性相关时行列式为零。若第 $3$ 行除一个元素外都等于第 $1$ 行与第 $2$ 行之和，而那个元素是未知数 $k$，则在第 $1$、$2$ 行线性无关时，行列式是 $k$ 的一次函数，恰在第 $3$ 行成为另两行之和时为零。所以 $k$ 等于第 $1$、$2$ 行对应元素之和。对各行 $(1, 0, 2)$、$(0, 1, 3)$、$(1, 1, k)$：$k = 2 + 3 = 5$。\n\n> **注意。** 第 $3$ 行必须是另两行之和，所以 $k$ 是那一列两数之和，不是之差。先检查已知元素，确认规律是求和。",
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
        const o = others[0]!;
        return numberProblem({
          prompt: t(`Find $k$ such that $\\det ${matLatex([r1, r2, r3])} = 0$.`, `求 $k$，使 $\\det ${matLatex([r1, r2, r3])} = 0$。`),
          answer: ans,
          solveFor: "k",
          mistakes: [
            why(
              r1[j]! - r2[j]!,
              "That is the difference of the entries; the other entries of row $3$ are sums, so $k$ must be a sum too.",
              "这是两数之差；第 $3$ 行的其他元素都是和，所以 $k$ 也必须是和。",
            ),
            why(
              -ans,
              "The sign is flipped: row $3$ is $R_1 + R_2$, not $-(R_1 + R_2)$.",
              "符号反了：第 $3$ 行是 $R_1 + R_2$，不是 $-(R_1 + R_2)$。",
            ),
            why(
              r1[j]!,
              "That copies the entry of row $1$ alone; row $3$ is the sum of rows $1$ and $2$.",
              "这只照抄了第 $1$ 行的元素；第 $3$ 行是第 $1$、$2$ 行之和。",
            ),
            why(
              0,
              "A zero entry does not make the determinant zero; row $3$ must be a combination of the other rows.",
              "零元素不会使行列式为零；第 $3$ 行必须是其他行的组合。",
            ),
          ].filter((m, i, all) => m.value !== ans && all.findIndex((x) => x.value === m.value) === i),
          solution: walked(
            [
              [
                ["Spot the pattern", "找出规律"],
                t(
                  `In column ${o + 1}, row $3$ has $${r1[o]! + r2[o]!} = ${r1[o]} + ${paren(r2[o]!)}$, and the same holds in the other known column: row $3$ is $R_1 + R_2$ apart from $k$.`,
                  `在第 ${o + 1} 列，第 $3$ 行是 $${r1[o]! + r2[o]!} = ${r1[o]} + ${paren(r2[o]!)}$，另一个已知列也一样：除 $k$ 外，第 $3$ 行就是 $R_1 + R_2$。`,
                ),
              ],
              [
                ["Make the rows dependent", "使各行线性相关"],
                t(
                  `The determinant is $0$ exactly when $R_3 = R_1 + R_2$, so $k = ${r1[j]} + ${paren(r2[j]!)} = ${ans}$.`,
                  `当且仅当 $R_3 = R_1 + R_2$ 时行列式为 $0$，所以 $k = ${r1[j]} + ${paren(r2[j]!)} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `With $k = ${ans}$, replacing $R_3$ by $R_3 - R_1 - R_2$ gives a row of zeros without changing the determinant, so the determinant is $0$.`,
              `$k = ${ans}$ 时，把 $R_3$ 换成 $R_3 - R_1 - R_2$ 得到全零行而不改变行列式，所以行列式为 $0$。`,
            ),
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
  intro: t(
    "The system $2x - y = 3$, $x + 4y = -1$ is fixed by its numbers alone. Writing the coefficients of each equation in a row and the constant after a bar gives the augmented matrix $\\left(\\begin{array}{cc|c} 2 & -1 & 3 \\\\ 1 & 4 & -1 \\end{array}\\right)$.\n\nCheck: reading row $2$ back gives $1x + 4y = -1$, the second equation.\n\nIn this lesson we write a system as an augmented matrix and read the equations back from one.",
    "方程组 $2x - y = 3$，$x + 4y = -1$ 完全由它的数确定。把每个方程的系数写成一行，再在竖线后写常数，就得到增广矩阵 $\\left(\\begin{array}{cc|c} 2 & -1 & 3 \\\\ 1 & 4 & -1 \\end{array}\\right)$。\n\n检验：读回第 $2$ 行得 $1x + 4y = -1$，正是第二个方程。\n\n本课我们把方程组写成增广矩阵，并从增广矩阵读回方程。",
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
        "For a system of $m$ linear equations in $n$ variables $A\\mathbf{x} = \\mathbf{b}$, the augmented matrix $[A \\mid \\mathbf{b}]$ is formed by adjoining the column of constants $\\mathbf{b}$ to the coefficient matrix $A$. The resulting matrix has dimension $m \\times (n+1)$. For $x + 2z = 5$ the row is $(1, 0, 2 \\mid 5)$: the missing $y$ gets a $0$.\n\n> **Watch out.** Every equation must list its variables in the same order, $x$, $y$, $z$, with a $0$ for a missing one. The constants go in with the sign they have on the right-hand side.",
        "对于包含 $n$ 个变量的 $m$ 个线性方程组 $A\\mathbf{x} = \\mathbf{b}$，增广矩阵 $[A \\mid \\mathbf{b}]$ 是由系数矩阵 $A$ 并在其右侧附加上常数列向量 $\\mathbf{b}$ 构成的，其维度为 $m \\times (n+1)$。对 $x + 2z = 5$，这一行是 $(1, 0, 2 \\mid 5)$：缺少的 $y$ 记为 $0$。\n\n> **注意。** 每个方程都要按同样的顺序 $x$、$y$、$z$ 列出变量，缺少的记 $0$。常数按它在等号右边的符号写入。",
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

        return reasoned(
          oneOf(
            rng,
            prompt,
            t(`$$${correctAug}$$`, `$$${correctAug}$$`),
            [
              t(`$$${wrongAug1}$$`, `$$${wrongAug1}$$`),
              t(`$$${wrongAug2}$$`, `$$${wrongAug2}$$`),
              t(`$$${wrongAug3}$$`, `$$${wrongAug3}$$`),
            ],
            walked(
              [
                [
                  ["Write one row per equation", "每个方程写一行"],
                  t(
                    "List the coefficients of $x$, $y$, $z$ in that order, with $0$ for a missing variable, then the constant after the bar.",
                    "按 $x$、$y$、$z$ 的顺序列出系数，缺少的变量记 $0$，再在竖线后写常数。",
                  ),
                ],
                [["Stack the rows", "把各行叠起来"], t("", ""), [correctAug]],
              ],
              t(
                `Reading row $1$ back gives $${formatLinear3(a1, b1, c1)} = ${d1}$, the first equation.`,
                `读回第 $1$ 行得 $${formatLinear3(a1, b1, c1)} = ${d1}$，正是第一个方程。`,
              ),
            ),
          ),
          [
            [
              `$$${wrongAug1}$$`,
              "The columns of $y$ and $z$ are exchanged: the columns follow $x$, $y$, $z$.",
              "$y$ 列与 $z$ 列对调了：各列依次是 $x$、$y$、$z$。",
            ],
            [
              `$$${wrongAug2}$$`,
              "The constants have the wrong sign: they go in as they stand on the right-hand side.",
              "常数的符号错了：它们按等号右边原样写入。",
            ],
            [
              `$$${wrongAug3}$$`,
              "The third row is all zeros, but the third equation has nonzero coefficients.",
              "第三行全为零，但第三个方程的系数不为零。",
            ],
          ],
        );
      },
    },
    {
      id: "reading-an-equation-from-an-augmented-matrix",
      title: t("Reading an equation from an augmented matrix", "从增广矩阵读出方程"),
      explanation: t(
        "Each row of an augmented matrix $[A \\mid \\mathbf{b}]$ is one equation. The entries left of the bar are the coefficients of $x$, $y$ and $z$ in order, and the entry right of the bar is the constant on the right-hand side. A zero entry means that variable is missing from the equation. The row $(3, 0, -1 \\mid 4)$ is $3x - z = 4$.\n\n> **Watch out.** Read the coefficients and the constant from the same row, left to right. The constant keeps its sign; nothing moves across the equals sign.",
        "增广矩阵 $[A \\mid \\mathbf{b}]$ 的每一行是一个方程。竖线左边的元素依次是 $x$、$y$、$z$ 的系数，竖线右边的元素是等号右边的常数。某个元素为零表示该方程中不含那个变量。行 $(3, 0, -1 \\mid 4)$ 就是 $3x - z = 4$。\n\n> **注意。** 系数和常数要从同一行从左到右读。常数保留原来的符号，没有任何项移到等号另一边。",
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
            walked(
              [
                [
                  ["Read the coefficients", "读出系数"],
                  t(
                    `Left of the bar, row $${r + 1}$ has $${row.join(", ")}$: the coefficients of $x$, $y$, $z$.`,
                    `竖线左边，第 $${r + 1}$ 行是 $${row.join(", ")}$：即 $x$、$y$、$z$ 的系数。`,
                  ),
                ],
                [
                  ["Read the constant", "读出常数"],
                  t(
                    `Right of the bar it has $${b[r]}$, so the equation is ${eq(row, b[r]!).en}.`,
                    `竖线右边是 $${b[r]}$，所以方程是 ${eq(row, b[r]!)["zh-CN"]}。`,
                  ),
                ],
              ],
              t(
                `Writing ${eq(row, b[r]!).en} back as a row gives $(${row.join(", ")} \\mid ${b[r]})$, row $${r + 1}$ again.`,
                `把 ${eq(row, b[r]!)["zh-CN"]} 写回成一行得 $(${row.join(", ")} \\mid ${b[r]})$，又是第 $${r + 1}$ 行。`,
              ),
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
  intro: t(
    "In $\\begin{pmatrix} 2 & 1 & 5 \\\\ 0 & 3 & -1 \\\\ 0 & 0 & 4 \\end{pmatrix}$ the first nonzero entries of the rows, $2$, $3$ and $4$, sit in columns $1$, $2$ and $3$: each is one step to the right of the one above, like a staircase. Such a system can be solved from the bottom up.\n\nCheck: below each of these leading entries every entry is $0$.\n\nIn this lesson we recognise row echelon form and say which condition a matrix breaks when it is not.",
    "在 $\\begin{pmatrix} 2 & 1 & 5 \\\\ 0 & 3 & -1 \\\\ 0 & 0 & 4 \\end{pmatrix}$ 中，各行的第一个非零元 $2$、$3$、$4$ 分别在第 $1$、$2$、$3$ 列：每个都比上一行的右移一格，像台阶一样。这样的方程组可以自下而上求解。\n\n检验：每个首元下方的元素都是 $0$。\n\n本课我们识别行阶梯形，并在矩阵不是行阶梯形时指出它违反了哪个条件。",
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
        "A matrix is in Row Echelon Form (REF) if: (1) All zero rows are at the bottom; (2) In each non-zero row, the leading entry (first non-zero entry, called pivot) is strictly to the right of the leading entry of the row above it; (3) All entries in a column below a pivot are zero. For example, $\\begin{pmatrix} 1 & 4 \\\\ 0 & 2 \\end{pmatrix}$ is in REF, while $\\begin{pmatrix} 0 & 2 \\\\ 1 & 4 \\end{pmatrix}$ is not.\n\n> **Watch out.** Look at where each row's first nonzero entry sits, not at the size of the entries. A zero row in the middle breaks the form even if the rest is a staircase.",
        "矩阵处于行阶梯形 (REF) 当且仅当：(1) 所有全零行均位于矩阵的最底端；(2) 每个非零行的首个非零元（主元）严格位于上一行主元的右侧；(3) 主元所在列其下方所有元素均为零。例如 $\\begin{pmatrix} 1 & 4 \\\\ 0 & 2 \\end{pmatrix}$ 是行阶梯形，而 $\\begin{pmatrix} 0 & 2 \\\\ 1 & 4 \\end{pmatrix}$ 不是。\n\n> **注意。** 要看每行第一个非零元的位置，而不是元素的大小。即使其余部分是台阶形，中间夹着一个零行也不行。",
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

        return reasoned(
          oneOf(
            rng,
            prompt,
            t(`$$${matLatex(refMat)}$$`, `$$${matLatex(refMat)}$$`),
            [
              t(`$$${matLatex(nonRef1)}$$`, `$$${matLatex(nonRef1)}$$`),
              t(`$$${matLatex(nonRef2)}$$`, `$$${matLatex(nonRef2)}$$`),
              t(`$$${matLatex(nonRef3)}$$`, `$$${matLatex(nonRef3)}$$`),
            ],
            walked(
              [
                [
                  ["Find each leading entry", "找出各行首元"],
                  t(
                    `In $${matLatex(refMat)}$ the leading entries $${p1}$, $${p2}$, $${p3}$ sit in columns $1$, $2$, $3$.`,
                    `在 $${matLatex(refMat)}$ 中，首元 $${p1}$、$${p2}$、$${p3}$ 分别在第 $1$、$2$、$3$ 列。`,
                  ),
                ],
                [
                  ["Check the conditions", "检查各条件"],
                  t(
                    "Each leading entry is strictly right of the one above, every entry below a leading entry is $0$, and there is no zero row.",
                    "每个首元都严格位于上一行首元的右侧，首元下方都是 $0$，且没有零行。",
                  ),
                ],
              ],
              t(
                "Each other option breaks one condition: a zero row above a nonzero row, a leading entry left of the one above, or a nonzero entry below a pivot.",
                "其余每个选项都违反一个条件：零行在非零行之上、首元在上一行首元的左侧，或主元下方有非零元。",
              ),
            ),
          ),
          [
            [
              `$$${matLatex(nonRef1)}$$`,
              "Row $2$ is a zero row lying above the nonzero row $3$.",
              "第 $2$ 行是零行，却位于非零的第 $3$ 行之上。",
            ],
            [
              `$$${matLatex(nonRef2)}$$`,
              "The leading entry of row $2$ is in column $1$, left of row $1$'s leading entry in column $2$.",
              "第 $2$ 行的首元在第 $1$ 列，位于第 $1$ 行首元（第 $2$ 列）的左侧。",
            ],
            [
              `$$${matLatex(nonRef3)}$$`,
              "Row $3$ has the nonzero entry $3$ below the pivot of row $2$.",
              "第 $3$ 行在第 $2$ 行主元的下方有非零元 $3$。",
            ],
          ],
        );
      },
    },
    {
      id: "deciding-whether-a-matrix-is-in-row-echelon-form",
      title: t("Deciding whether a matrix is in row echelon form", "判断矩阵是否为行阶梯形"),
      explanation: t(
        "A matrix is in row echelon form when all zero rows are at the bottom and each leading entry (the first nonzero entry of a row) lies strictly to the right of the leading entry in the row above. The leading entries need not equal $1$, and the entries above them need not be zero. Checking the column of each leading entry row by row is enough. Leading entries in columns $1, 2, 4$ give row echelon form; columns $1, 3, 2$ do not.\n\n> **Watch out.** Leading entries other than $1$ and nonzero entries above them are allowed. The columns of the leading entries must strictly increase from row to row.",
        "当所有零行都在底部，且每行的首元（该行第一个非零元素）严格位于上一行首元的右侧时，矩阵是行阶梯形。首元不必等于 $1$，首元上方的元素也不必为零。逐行检查各首元所在的列即可。首元在第 $1, 2, 4$ 列时是行阶梯形；在第 $1, 3, 2$ 列时不是。\n\n> **注意。** 首元不等于 $1$、首元上方有非零元，都是允许的。各行首元所在的列必须逐行严格增大。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(0, 2);
        const lead = kind === 0 ? [0, rng.int(1, 2), 3] : kind === 1 ? [0, 2, rng.int(1, 2)] : [0, 4, rng.int(1, 3)];
        const M = lead.map((c) => [0, 1, 2, 3].map((j) => (c < 4 && j === c ? rng.nonZero(-4, 4) : c < 4 && j > c ? rng.int(-5, 5) : 0)));
        const yes = kind === 0;
        const [right, wrong] = yesNoText(yes);
        const cols = lead.map((c) => (c < 4 ? String(c + 1) : "-")).join(", ");
        return reasoned(
          oneOf(
            rng,
            t(`Is $${matLatex(M)}$ in row echelon form?`, `$${matLatex(M)}$ 是行阶梯形吗？`),
            right,
            [wrong],
            walked(
              [
                [
                  ["Find each leading entry", "找出各行首元"],
                  t(
                    kind === 2
                      ? `Row $1$ leads in column $1$, row $2$ is a zero row, and row $3$ leads in column $${lead[2]! + 1}$.`
                      : `The leading entries are in columns $${cols}$.`,
                    kind === 2
                      ? `第 $1$ 行首元在第 $1$ 列，第 $2$ 行是零行，第 $3$ 行首元在第 $${lead[2]! + 1}$ 列。`
                      : `各行首元依次在第 $${cols}$ 列。`,
                  ),
                ],
                [
                  ["Check the conditions", "检查各条件"],
                  t(
                    yes
                      ? "The columns increase strictly and there are no zero rows, so the matrix is in row echelon form."
                      : kind === 1
                        ? `The leading entry of row $3$ is in column $${lead[2]! + 1}$, which is not to the right of row $2$'s leading entry in column $3$.`
                        : "Row $2$ is a zero row lying above the nonzero row $3$.",
                    yes
                      ? "各列严格增大且没有零行，所以矩阵是行阶梯形。"
                      : kind === 1
                        ? `第 $3$ 行的首元在第 $${lead[2]! + 1}$ 列，不在第 $2$ 行首元（第 $3$ 列）的右侧。`
                        : "第 $2$ 行是零行，却位于非零的第 $3$ 行之上。",
                  ),
                ],
              ],
              t(
                yes
                  ? "Below each leading entry every entry is $0$, as the staircase requires."
                  : "One broken condition is enough for the answer to be no.",
                yes ? "每个首元下方都是 $0$，符合台阶形的要求。" : "只要违反一个条件，答案就是否。",
              ),
            ),
          ),
          [
            [
              wrong.en,
              yes
                ? "Leading entries other than $1$ and nonzero entries above them are allowed; only the positions of the leading entries matter."
                : kind === 1
                  ? "Look at the column of each leading entry: they must move strictly to the right from row to row."
                  : "A zero row must lie below every nonzero row.",
              yes
                ? "首元不为 $1$、首元上方有非零元都是允许的；只看首元的位置。"
                : kind === 1
                  ? "看每个首元所在的列：它们必须逐行严格右移。"
                  : "零行必须在所有非零行的下方。",
            ],
          ],
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
  intro: t(
    "The system $x + 2y = 7$, $3y = 6$ is easy because its last equation has one unknown: $y = 2$. Putting $y = 2$ into the first gives $x + 4 = 7$, so $x = 3$.\n\nCheck: $3 + 2 \\cdot 2 = 7$ and $3 \\cdot 2 = 6$.\n\nIn this lesson we solve triangular systems from the bottom row up, and lower triangular ones from the top row down.",
    "方程组 $x + 2y = 7$，$3y = 6$ 很容易，因为最后一个方程只有一个未知数：$y = 2$。把 $y = 2$ 代入第一个方程得 $x + 4 = 7$，所以 $x = 3$。\n\n检验：$3 + 2 \\cdot 2 = 7$，$3 \\cdot 2 = 6$。\n\n本课我们自下而上求解上三角方程组，并自上而下求解下三角方程组。",
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
        "When an augmented matrix is in upper triangular / REF form, solve the bottom equation for the last variable first, then substitute it into the row above to solve for the previous variable, continuing upward until all variables are found. From $(1, 1 \\mid 5)$ and $(0, 2 \\mid 4)$: $y = 2$, then $x + 2 = 5$ gives $x = 3$.\n\n> **Watch out.** Substitute the value with its sign, in brackets, and move the known terms across before dividing by the pivot. Each row gives exactly one new unknown.",
        "当增广矩阵处于上三角或行阶梯形时，首先由最底部的方程直接求出最后一个未知数的值，然后将其代入上一行方程求解前一个未知数，依次自底向上回代，直至求出全部未知数。由 $(1, 1 \\mid 5)$ 与 $(0, 2 \\mid 4)$：$y = 2$，再由 $x + 2 = 5$ 得 $x = 3$。\n\n> **注意。** 代入时连同符号加括号，先把已知项移到另一边，再除以主元。每一行恰好求出一个新的未知数。",
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

        const answer = pointLatex([x, y, z]);
        return withMistakes(
          pointProblem({
            prompt,
            answer: [x, y, z],
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [["Solve row 3", "解第 3 行"], t("", ""), [`${formatLinearTerm(u33, "z", true)} = ${b3} \\implies z = ${z}`]],
                [
                  ["Substitute into row 2", "代入第 2 行"],
                  t("", ""),
                  [
                    `${formatLinearTerm(u22, "y", true)} + (${u23})(${z}) = ${b2} \\implies ${formatLinearTerm(u22, "y", true)} = ${b2 - u23 * z} \\implies y = ${y}`,
                  ],
                ],
                [
                  ["Substitute into row 1", "代入第 1 行"],
                  t("", ""),
                  [
                    `${formatLinearTerm(u11, "x", true)} + (${u12})(${y}) + (${u13})(${z}) = ${b1} \\implies ${formatLinearTerm(u11, "x", true)} = ${b1 - u12 * y - u13 * z} \\implies x = ${x}`,
                  ],
                ],
              ],
              t(
                `Row 1: $${u11} \\cdot ${paren(x)} + ${paren(u12)} \\cdot ${paren(y)} + ${paren(u13)} \\cdot ${paren(z)} = ${b1}$, so $(x, y, z) = (${x}, ${y}, ${z})$ satisfies the top equation as well as the two used to find it.`,
                `第 1 行：$${u11} \\cdot ${paren(x)} + ${paren(u12)} \\cdot ${paren(y)} + ${paren(u13)} \\cdot ${paren(z)} = ${b1}$，所以 $(x, y, z) = (${x}, ${y}, ${z})$ 既满足求解时用到的两个方程，也满足最上面的方程。`,
              ),
            ),
          }),
          [
            say(
              pointLatex([x, y, -z]),
              "The sign of $z$ is wrong: divide the constant of row 3 by its pivot, keeping both signs.",
              "$z$ 的符号错了：用第 3 行的常数除以主元，两者的符号都要保留。",
            ),
            say(
              pointLatex([y, x, z]),
              "The values of $x$ and $y$ are exchanged: row 2 gives $y$ and row 1 gives $x$.",
              "$x$ 与 $y$ 的值对调了：第 2 行求出 $y$，第 1 行求出 $x$。",
            ),
            say(
              pointLatex([b1, y, z]),
              "That is the constant of row 1; the known terms still have to be moved across and the pivot divided out.",
              "这是第 1 行的常数；还要把已知项移过去，再除以主元。",
            ),
          ].filter((m, i, all) => m.response !== answer && all.findIndex((o) => o.response === m.response) === i),
        );
      },
    },
    {
      id: "forward-substitution-in-a-lower-triangular-system",
      title: t("Forward substitution in a lower triangular system", "下三角方程组的前代法"),
      explanation: t(
        "A lower triangular system is solved from the top down. The first equation involves only $x_1$, the second only $x_1$ and $x_2$, and so on. Substituting each value as soon as it is found, the last unknown is\n\n$$x_3 = \\frac{b_3 - l_{31}x_1 - l_{32}x_2}{l_{33}}.$$\n\nFrom $2x_1 = 4$ and $x_1 + x_2 = 5$: $x_1 = 2$, then $x_2 = 3$.\n\n> **Watch out.** $x_3$ is not $\\frac{b_3}{l_{33}}$: the terms with $x_1$ and $x_2$ must be subtracted first. Use the values found above, with their signs.",
        "下三角方程组自上而下求解。第一个方程只含 $x_1$，第二个只含 $x_1$ 与 $x_2$，依此类推。每求出一个值就立刻代入，最后一个未知数为\n\n$$x_3 = \\frac{b_3 - l_{31}x_1 - l_{32}x_2}{l_{33}}$$\n\n由 $2x_1 = 4$ 与 $x_1 + x_2 = 5$：$x_1 = 2$，于是 $x_2 = 3$。\n\n> **注意。** $x_3$ 不是 $\\frac{b_3}{l_{33}}$：要先减去含 $x_1$、$x_2$ 的项。用上面求出的值，连同符号代入。",
      ),
      generate(rng: Rng): Problem {
        const x = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
        const L = [
          [rng.nonZero(-3, 3), 0, 0],
          [rng.int(-3, 3), rng.nonZero(-3, 3), 0],
          [rng.int(-3, 3), rng.int(-3, 3), rng.nonZero(-3, 3)],
        ];
        const b = L.map((row) => row.reduce((s, v, k) => s + v * x[k]!, 0));
        const ans = x[2]!;
        return numberProblem({
          prompt: t(
            `Solve the system with augmented matrix $${augLatex(L, b)}$ and give $x_3$.`,
            `求解增广矩阵为 $${augLatex(L, b)}$ 的方程组，给出 $x_3$。`,
          ),
          answer: ans,
          solveFor: "x_3",
          mistakes: [
            why(
              Q.of(b[2]!, L[2]![2]!),
              "That divides $b_3$ by $l_{33}$ alone; the terms with $x_1$ and $x_2$ must be subtracted first.",
              "这只用 $b_3$ 除以 $l_{33}$；要先减去含 $x_1$、$x_2$ 的项。",
            ),
            why(x[0]!, "That is $x_1$, from row $1$; $x_3$ comes from row $3$.", "这是由第 $1$ 行得到的 $x_1$；$x_3$ 来自第 $3$ 行。"),
            why(x[1]!, "That is $x_2$, from row $2$; $x_3$ comes from row $3$.", "这是由第 $2$ 行得到的 $x_2$；$x_3$ 来自第 $3$ 行。"),
            why(
              -ans,
              "The sign is flipped: keep the signs of the coefficients when moving the known terms across.",
              "符号反了：移项时要保留系数的符号。",
            ),
          ].filter((m, i, all) => !asQ(m.value).eq(asQ(ans)) && all.findIndex((o) => asQ(o.value).eq(asQ(m.value))) === i),
          solution: walked(
            [
              [["Solve row 1", "解第 1 行"], t("", ""), [`x_1 = \\frac{${b[0]}}{${L[0]![0]}} = ${x[0]}`]],
              [
                ["Substitute into row 2", "代入第 2 行"],
                t("", ""),
                [`x_2 = \\frac{${b[1]} - ${paren(L[1]![0]!)} \\cdot ${paren(x[0]!)}}{${L[1]![1]}} = ${x[1]}`],
              ],
              [
                ["Substitute into row 3", "代入第 3 行"],
                t("", ""),
                [
                  `x_3 = \\frac{${b[2]} - ${paren(L[2]![0]!)} \\cdot ${paren(x[0]!)} - ${paren(L[2]![1]!)} \\cdot ${paren(x[1]!)}}{${L[2]![2]}} = ${x[2]}`,
                ],
              ],
            ],
            t(
              `Row 3: $${paren(L[2]![0]!)} \\cdot ${paren(x[0]!)} + ${paren(L[2]![1]!)} \\cdot ${paren(x[1]!)} + ${paren(L[2]![2]!)} \\cdot ${paren(x[2]!)} = ${b[2]}$.`,
              `第 3 行：$${paren(L[2]![0]!)} \\cdot ${paren(x[0]!)} + ${paren(L[2]![1]!)} \\cdot ${paren(x[1]!)} + ${paren(L[2]![2]!)} \\cdot ${paren(x[2]!)} = ${b[2]}$。`,
            ),
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
  intro: t(
    "The equations $x + y = 3$ and $2x + y = 4$ can be swapped, multiplied by a nonzero number, or one can be added to a multiple of the other, without changing which $(x, y)$ solve them. Subtracting $2$ times the first from the second gives $-y = -2$, so $y = 2$ and then $x = 1$.\n\nCheck: $1 + 2 = 3$ and $2 \\cdot 1 + 2 = 4$.\n\nIn this lesson we carry out the three elementary row operations on matrices and undo each of them.",
    "方程 $x + y = 3$ 与 $2x + y = 4$ 可以交换次序、乘以非零数，或把一个方程的倍数加到另一个上，都不改变哪些 $(x, y)$ 是它们的解。从第二个方程减去第一个的 $2$ 倍得 $-y = -2$，所以 $y = 2$，于是 $x = 1$。\n\n检验：$1 + 2 = 3$，$2 \\cdot 1 + 2 = 4$。\n\n本课我们对矩阵实施三种初等行变换，并撤销每一种变换。",
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
        "There are three elementary row operations: (1) Row swap $R_i \\leftrightarrow R_j$; (2) Row scaling $k R_i \\to R_i$ ($k \\ne 0$); (3) Row addition $R_i + k R_j \\to R_i$. These operations do not change the solution set of the linear system. For example, $R_2 - 2R_1 \\to R_2$ turns rows $(1, 3)$ and $(2, 5)$ into $(1, 3)$ and $(0, -1)$.\n\n> **Watch out.** The row after the arrow is the only row that changes; the other row only supplies the multiple. Apply the multiple to every entry, with the sign the operation shows.",
        "三种初等行变换分别为：(1) 对调两行：$R_i \\leftrightarrow R_j$；(2) 数乘某行：$k R_i \\to R_i$（$k \\ne 0$）；(3) 行倍加：$R_i + k R_j \\to R_i$。初等行变换不改变线性方程组的解集。例如 $R_2 - 2R_1 \\to R_2$ 把行 $(1, 3)$ 与 $(2, 5)$ 变为 $(1, 3)$ 与 $(0, -1)$。\n\n> **注意。** 只有箭头后面的那一行会改变；另一行只提供倍数。倍数要作用于每个元素，并带上变换所示的符号。",
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
            walked(
              [
                [
                  ["Compute the new row 2", "计算新的第 2 行"],
                  t(
                    `Row 2 becomes row 2 ${k > 0 ? "minus" : "plus"} $${Math.abs(k)}$ times row 1, entry by entry:`,
                    `第 2 行变为第 2 行${k > 0 ? "减去" : "加上"}第 1 行的 $${Math.abs(k)}$ 倍，逐个元素计算：`,
                  ),
                  [`[${r2.join(", ")}] - ${paren(k)}[${r1.join(", ")}] = [${newR2.join(", ")}]`],
                ],
                [
                  ["Keep the other rows", "其余行不变"],
                  t("Rows 1 and 3 are unchanged:", "第 1 行与第 3 行保持不变："),
                  [matLatex(correctMat)],
                ],
              ],
              t(
                `Undoing with $R_2 + ${paren(k)} R_1 \\to R_2$ gives $[${newR2.join(", ")}] + ${paren(k)}[${r1.join(", ")}] = [${r2.join(", ")}]$, the original row 2.`,
                `用 $R_2 + ${paren(k)} R_1 \\to R_2$ 撤销，得 $[${newR2.join(", ")}] + ${paren(k)}[${r1.join(", ")}] = [${r2.join(", ")}]$，正是原来的第 2 行。`,
              ),
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
        "Every elementary row operation can be undone by another operation of the same kind. A swap $R_i \\leftrightarrow R_j$ is undone by the same swap. A scaling $cR_i \\to R_i$ is undone by $\\frac{1}{c}R_i \\to R_i$. A replacement $R_i + kR_j \\to R_i$ is undone by $R_i - kR_j \\to R_i$. This is why row operations never change the solution set of a system. For example, $3R_2 \\to R_2$ is undone by $\\frac{1}{3}R_2 \\to R_2$.\n\n> **Watch out.** The inverse acts on the same row and uses the same other row. A scaling is undone by the reciprocal, not the negative, and a replacement by the opposite multiple.",
        "每个初等行变换都能用同类的另一个变换撤销。交换 $R_i \\leftrightarrow R_j$ 由同一交换撤销。数乘 $cR_i \\to R_i$ 由 $\\frac{1}{c}R_i \\to R_i$ 撤销。倍加 $R_i + kR_j \\to R_i$ 由 $R_i - kR_j \\to R_i$ 撤销。这就是行变换从不改变方程组解集的原因。例如 $3R_2 \\to R_2$ 由 $\\frac{1}{3}R_2 \\to R_2$ 撤销。\n\n> **注意。** 逆变换作用于同一行，并使用同一个另外的行。数乘由倒数撤销，而不是相反数；倍加由相反的倍数撤销。",
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
        const reasons = [
          [
            [
              "That is a replacement; a swap is undone only by swapping the same two rows back.",
              "这是倍加；交换只能由再次交换同样两行来撤销。",
            ],
            [
              "That scales a row; a swap is undone only by swapping the same two rows back.",
              "这是数乘；交换只能由再次交换同样两行来撤销。",
            ],
            [
              "That is a replacement; a swap is undone only by swapping the same two rows back.",
              "这是倍加；交换只能由再次交换同样两行来撤销。",
            ],
          ],
          [
            [
              "Scaling by the negative does not restore the row; the inverse of a scaling uses the reciprocal.",
              "乘以相反数不能还原该行；数乘的逆用倒数。",
            ],
            [
              "That is a replacement; a scaling is undone by another scaling of the same row.",
              "这是倍加；数乘要由对同一行的另一次数乘撤销。",
            ],
            ["That scales a different row; the inverse must act on the same row.", "这是对另一行数乘；逆变换必须作用于同一行。"],
          ],
          [
            [
              "That repeats the operation and adds the multiple a second time; the inverse uses the opposite multiple.",
              "这是重复同一变换，又加了一次倍数；逆变换用相反的倍数。",
            ],
            [
              "That changes the other row; the inverse must change the same row as the operation.",
              "这改变的是另一行；逆变换必须改变与原变换同一行。",
            ],
            [
              "That is a scaling; a replacement is undone by a replacement with the opposite multiple.",
              "这是数乘；倍加要由相反倍数的倍加撤销。",
            ],
          ],
        ][kind]!;
        return reasoned(
          oneOf(
            rng,
            t(`Which row operation undoes $${op}$?`, `哪个行变换可以撤销 $${op}$？`),
            o(inv),
            wrong.map(o),
            walked(
              [
                [
                  ["Name the operation", "认出变换类型"],
                  t(
                    [`$${op}$ is a swap.`, `$${op}$ scales row $${i}$ by $${k}$.`, `$${op}$ adds $${k}$ times row $${j}$ to row $${i}$.`][
                      kind
                    ]!,
                    [`$${op}$ 是交换。`, `$${op}$ 把第 $${i}$ 行乘以 $${k}$。`, `$${op}$ 把第 $${j}$ 行的 $${k}$ 倍加到第 $${i}$ 行。`][
                      kind
                    ]!,
                  ),
                ],
                [
                  ["Reverse it", "反向操作"],
                  t(
                    [
                      `A swap is its own inverse: $${inv}$.`,
                      `Scaling by $${k}$ is undone by scaling by $${Q.of(1, k).toLatex()}$: $${inv}$.`,
                      `Adding $${k}R_{${j}}$ is undone by subtracting it again: $${inv}$.`,
                    ][kind]!,
                    [
                      `交换的逆就是它本身：$${inv}$。`,
                      `乘以 $${k}$ 由乘以 $${Q.of(1, k).toLatex()}$ 撤销：$${inv}$。`,
                      `加上 $${k}R_{${j}}$ 由再减去它撤销：$${inv}$。`,
                    ][kind]!,
                  ),
                ],
              ],
              t(
                [
                  "Swapping twice puts both rows back where they started.",
                  `Row $${i}$ becomes $${Q.of(1, k).toLatex()} \\cdot ${k} R_{${i}} = R_{${i}}$ again.`,
                  `Row $${i}$ becomes $R_{${i}} + ${paren(k)}R_{${j}} - ${paren(k)}R_{${j}} = R_{${i}}$ again, since row $${j}$ never changed.`,
                ][kind]!,
                [
                  "交换两次，两行都回到原位。",
                  `第 $${i}$ 行又变成 $${Q.of(1, k).toLatex()} \\cdot ${k} R_{${i}} = R_{${i}}$。`,
                  `第 $${i}$ 行又变成 $R_{${i}} + ${paren(k)}R_{${j}} - ${paren(k)}R_{${j}} = R_{${i}}$，因为第 $${j}$ 行从未改变。`,
                ][kind]!,
              ),
            ),
          ),
          wrong.map((w, n): [string, string, string] => [o(w).en, reasons[n]![0]!, reasons[n]![1]!]),
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
  intro: t(
    "In $\\begin{pmatrix} 2 & 1 \\\\ 6 & 5 \\end{pmatrix}$ the entry $6$ sits below the pivot $2$. Since $6 = 3 \\cdot 2$, the operation $R_2 - 3R_1 \\to R_2$ turns row $2$ into $(6 - 6, 5 - 3) = (0, 2)$.\n\nCheck: the multiplier is $\\frac{6}{2} = 3$, and $6 - 3 \\cdot 2 = 0$.\n\nIn this lesson we find the multiplier and the row operation that put a zero below a pivot.",
    "在 $\\begin{pmatrix} 2 & 1 \\\\ 6 & 5 \\end{pmatrix}$ 中，元素 $6$ 在主元 $2$ 的下方。由于 $6 = 3 \\cdot 2$，变换 $R_2 - 3R_1 \\to R_2$ 把第 $2$ 行变为 $(6 - 6, 5 - 3) = (0, 2)$。\n\n检验：乘数是 $\\frac{6}{2} = 3$，且 $6 - 3 \\cdot 2 = 0$。\n\n本课我们求出在主元下方制造零的乘数与行变换。",
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
        "To eliminate entry $a_{ij}$ in row $i$ using pivot entry $a_{pj}$ in row $p$, apply the row operation $R_i - \\frac{a_{ij}}{a_{pj}} R_p \\to R_i$. The multiplier is $c = \\frac{a_{ij}}{a_{pj}}$. With pivot $2$ and entry $-8$ below it, $c = -4$ and the operation is $R_i + 4R_p \\to R_i$.\n\n> **Watch out.** The multiplier is the entry divided by the pivot, not the other way round, and it is subtracted. The row being cleared is the one after the arrow.",
        "为了利用位于第 $p$ 行的主元 $a_{pj}$ 消去第 $i$ 行中的元素 $a_{ij}$，实施行变换 $R_i - \\frac{a_{ij}}{a_{pj}} R_p \\to R_i$。对应的乘子为 $c = \\frac{a_{ij}}{a_{pj}}$。主元为 $2$、下方元素为 $-8$ 时，$c = -4$，变换为 $R_i + 4R_p \\to R_i$。\n\n> **注意。** 乘子是该元素除以主元，不是反过来，而且是减去它的倍数。被消元的是箭头后面的那一行。",
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
            walked(
              [
                [["Find the multiplier", "求乘子"], t("", ""), [`c = \\frac{a_{21}}{a_{11}} = \\frac{${targetVal}}{${pivot}} = ${mult}`]],
                [["Subtract $c$ times row 1 from row 2", "从第 2 行减去第 1 行的 $c$ 倍"], t(`That is $${rightOp}$.`, `即 $${rightOp}$。`)],
              ],
              t(
                `The new $(2, 1)$ entry is $${targetVal} - ${paren(mult)} \\cdot ${pivot} = 0$.`,
                `新的 $(2, 1)$ 元素为 $${targetVal} - ${paren(mult)} \\cdot ${pivot} = 0$。`,
              ),
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
        "To clear the entry $a_{i1}$ below the pivot $a_{11}$, use $R_i - mR_1 \\to R_i$ with $m = \\frac{a_{i1}}{a_{11}}$. The new entry is $a_{i1} - m\\,a_{11} = 0$. The multiplier can be a fraction or negative, and the same $m$ is applied to every entry of the row. With $a_{11} = 4$ and $a_{31} = -6$: $m = -\\frac{3}{2}$.\n\n> **Watch out.** Divide the entry to be cleared by the pivot, keeping both signs. A difference of the two entries does not clear anything.",
        "要消去主元 $a_{11}$ 下方的元素 $a_{i1}$，用 $R_i - mR_1 \\to R_i$，其中 $m = \\frac{a_{i1}}{a_{11}}$。新元素为 $a_{i1} - m\\,a_{11} = 0$。乘数可以是分数或负数，且同一个 $m$ 作用于该行的每个元素。$a_{11} = 4$、$a_{31} = -6$ 时：$m = -\\frac{3}{2}$。\n\n> **注意。** 用要消去的元素除以主元，两者的符号都要保留。两个元素之差并不能消去任何东西。",
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
          mistakes: [
            why(
              Q.of(a11, a31),
              "The fraction is upside down: divide the entry to be cleared by the pivot.",
              "分数颠倒了：要用被消去的元素除以主元。",
            ),
            why(
              m.neg(),
              "The sign is flipped: with $R_3 - mR_1$, $m$ has the sign of $\\frac{a_{31}}{a_{11}}$.",
              "符号反了：用 $R_3 - mR_1$ 时，$m$ 与 $\\frac{a_{31}}{a_{11}}$ 同号。",
            ),
            why(Q.of(a31 - a11), "That subtracts the entries; the multiplier is their quotient.", "这是两元素之差；乘数是它们的商。"),
          ].filter((w, i, all) => !asQ(w.value).eq(m) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i),
          solution: walked(
            [
              [
                ["Divide the entry by the pivot", "用该元素除以主元"],
                t("", ""),
                [`m = \\frac{a_{31}}{a_{11}} = \\frac{${a31}}{${a11}} = ${m.toLatex()}`],
              ],
              [
                ["Apply it to the whole row", "作用于整行"],
                t(
                  `The new row $3$ then has $(3, 2)$ entry $${A[2]![1]} - ${paren(m)} \\cdot ${paren(A[0]![1]!)} = ${a32.toLatex()}$.`,
                  `此时新的第 $3$ 行 $(3, 2)$ 元素为 $${A[2]![1]} - ${paren(m)} \\cdot ${paren(A[0]![1]!)} = ${a32.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The $(3, 1)$ entry becomes $${a31} - ${paren(m)} \\cdot ${paren(a11)} = 0$.`,
              `$(3, 1)$ 元素变为 $${a31} - ${paren(m)} \\cdot ${paren(a11)} = 0$。`,
            ),
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
  intro: t(
    "For $x + 2y = 5$, $3x + 4y = 11$, the operation $R_2 - 3R_1 \\to R_2$ removes $x$ from the second equation: $-2y = -4$, so $y = 2$. Then $x + 4 = 5$ gives $x = 1$.\n\nCheck: $1 + 2 \\cdot 2 = 5$ and $3 \\cdot 1 + 4 \\cdot 2 = 11$.\n\nIn this lesson we solve $2 \\times 2$ systems by eliminating below the first pivot and substituting back.",
    "对 $x + 2y = 5$，$3x + 4y = 11$，变换 $R_2 - 3R_1 \\to R_2$ 从第二个方程中消去 $x$：$-2y = -4$，所以 $y = 2$。再由 $x + 4 = 5$ 得 $x = 1$。\n\n检验：$1 + 2 \\cdot 2 = 5$，$3 \\cdot 1 + 4 \\cdot 2 = 11$。\n\n本课我们通过消去第一个主元下方的元素再回代，求解 $2 \\times 2$ 方程组。",
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
        "For a $2 \\times 2$ augmented matrix $[A \\mid \\mathbf{b}]$, Gaussian elimination uses the row operation $R_2 - \\frac{a_{21}}{a_{11}} R_1 \\to R_2$ to create a zero in position $(2, 1)$, producing an upper triangular system that is solved by back substitution. For rows $(1, 1 \\mid 3)$ and $(2, 3 \\mid 8)$: $R_2 - 2R_1$ gives $(0, 1 \\mid 2)$, so $y = 2$ and $x = 1$.\n\n> **Watch out.** Apply the operation to the constant too, not only to the coefficients. Then find $y$ first from row $2$, and $x$ from row $1$.",
        "对于 $2 \\times 2$ 增广矩阵 $[A \\mid \\mathbf{b}]$，高斯消元法通过行变换 $R_2 - \\frac{a_{21}}{a_{11}} R_1 \\to R_2$ 在 $(2, 1)$ 位置产生零元，得到上三角系统，随后通过回代法求解未知数。对行 $(1, 1 \\mid 3)$ 与 $(2, 3 \\mid 8)$：$R_2 - 2R_1$ 得 $(0, 1 \\mid 2)$，所以 $y = 2$，$x = 1$。\n\n> **注意。** 变换也要作用于常数，而不只是系数。然后先由第 $2$ 行求 $y$，再由第 $1$ 行求 $x$。",
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

        const answer = pointLatex([x, y]);
        return withMistakes(
          pointProblem({
            prompt,
            answer: [x, y],
            vars: ["x", "y"],
            solution: walked(
              [
                [
                  ["Clear the $(2, 1)$ entry", "消去 $(2, 1)$ 元素"],
                  t(`Apply $R_2 - ${paren(m)} R_1 \\to R_2$:`, `执行 $R_2 - ${paren(m)} R_1 \\to R_2$：`),
                  [`\\left[\\begin{array}{cc|c} 1 & ${a12} & ${b1} \\\\ 0 & ${u22} & ${u22 * y} \\end{array}\\right]`],
                ],
                [["Solve row 2", "解第 2 行"], t("", ""), [`${formatLinearTerm(u22, "y", true)} = ${u22 * y} \\implies y = ${y}`]],
                [["Substitute into row 1", "代入第 1 行"], t("", ""), [`x + (${a12})(${y}) = ${b1} \\implies x = ${x}`]],
              ],
              t(
                `In the second original equation, $${a21} \\cdot ${paren(x)} + ${paren(a22)} \\cdot ${paren(y)} = ${b2}$.`,
                `代入原来的第二个方程：$${a21} \\cdot ${paren(x)} + ${paren(a22)} \\cdot ${paren(y)} = ${b2}$。`,
              ),
            ),
          }),
          [
            say(
              pointLatex([y, x]),
              "The values are exchanged: row 2 gives $y$ and row 1 gives $x$.",
              "两个值对调了：第 2 行求出 $y$，第 1 行求出 $x$。",
            ),
            say(
              pointLatex([x, -y]),
              "The sign of $y$ is wrong: divide the new constant of row 2 by its pivot, keeping both signs.",
              "$y$ 的符号错了：用第 2 行新的常数除以主元，两者的符号都要保留。",
            ),
            say(
              pointLatex([-x, y]),
              "The sign of $x$ is wrong: move the term with $y$ across with its sign before solving.",
              "$x$ 的符号错了：先把含 $y$ 的项连同符号移过去，再求解。",
            ),
            say(
              pointLatex([b1, y]),
              "That is the constant of row 1; the $y$-term still has to be moved across.",
              "这是第 1 行的常数；还要把含 $y$ 的项移过去。",
            ),
          ].filter((w, i, all) => w.response !== answer && all.findIndex((o) => o.response === w.response) === i),
        );
      },
    },
    {
      id: "the-second-pivot-after-eliminating-a-2x2-system",
      title: t("The second pivot after eliminating a 2×2 system", "2×2 方程组消元后的第二个主元"),
      explanation: t(
        "Eliminating below the first pivot of $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ uses $R_2 - \\frac{c}{a}R_1 \\to R_2$. The second pivot is then\n\n$$d - \\frac{c}{a}\\,b = \\frac{ad - bc}{a}.$$\n\nThis shows the product of the pivots, $a \\cdot \\frac{ad - bc}{a}$, is the determinant, and the system has a unique solution exactly when the second pivot is nonzero. For $\\begin{pmatrix} 2 & 1 \\\\ 4 & 5 \\end{pmatrix}$ the second pivot is $5 - 2 \\cdot 1 = 3$.\n\n> **Watch out.** The second pivot is the determinant divided by the first pivot, not the determinant itself. The multiplier $\\frac{c}{a}$ multiplies $b$ and is subtracted from $d$.",
        "对 $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 消去第一个主元下方的元素，用 $R_2 - \\frac{c}{a}R_1 \\to R_2$。第二个主元为\n\n$$d - \\frac{c}{a}\\,b = \\frac{ad - bc}{a}$$\n\n由此可见两主元之积 $a \\cdot \\frac{ad - bc}{a}$ 就是行列式，且方程组有唯一解当且仅当第二个主元非零。对 $\\begin{pmatrix} 2 & 1 \\\\ 4 & 5 \\end{pmatrix}$，第二个主元为 $5 - 2 \\cdot 1 = 3$。\n\n> **注意。** 第二个主元是行列式除以第一个主元，而不是行列式本身。乘数 $\\frac{c}{a}$ 乘以 $b$，再从 $d$ 中减去。",
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
          mistakes: [
            why(
              Q.of(a * d - b * c),
              "That is the determinant $ad - bc$; the second pivot is the determinant divided by the first pivot.",
              "这是行列式 $ad - bc$；第二个主元是行列式除以第一个主元。",
            ),
            why(
              Q.of(a * d + b * c, a),
              "The sign is wrong: the multiple of $b$ is subtracted from $d$.",
              "符号错了：$b$ 的倍数要从 $d$ 中减去。",
            ),
            why(
              Q.of(d * c - b * a, c),
              "The multiplier is upside down: it is $\\frac{c}{a}$, the entry divided by the pivot.",
              "乘数颠倒了：它是 $\\frac{c}{a}$，即该元素除以主元。",
            ),
            why(Q.of(d), "That is the original $y$-coefficient; the elimination changes it too.", "这是原来的 $y$ 系数；消元也会改变它。"),
          ].filter((w, i, all) => !asQ(w.value).eq(ans) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i),
          solution: walked(
            [
              [
                ["Find the multiplier", "求乘数"],
                t(
                  `The multiplier is $\\frac{c}{a} = ${Q.of(c, a).toLatex()}$, so use $R_2 - ${paren(Q.of(c, a))}R_1 \\to R_2$.`,
                  `乘数为 $\\frac{c}{a} = ${Q.of(c, a).toLatex()}$，所以用 $R_2 - ${paren(Q.of(c, a))}R_1 \\to R_2$。`,
                ),
              ],
              [
                ["Compute the new $y$-coefficient", "计算新的 $y$ 系数"],
                t("", ""),
                [`${d} - ${paren(Q.of(c, a))} \\cdot ${paren(b)} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `The product of the pivots is $${a} \\cdot ${paren(ans)} = ${a * d - b * c}$, which is the determinant $${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)}$.`,
              `两主元之积为 $${a} \\cdot ${paren(ans)} = ${a * d - b * c}$，正是行列式 $${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)}$。`,
            ),
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
