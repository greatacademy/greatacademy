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

/** expansion3 writes the cofactor expansion of a 3x3 determinant along its first row, ending with its value. */
function expansion3(m: Mat): string {
  const [a, b, c] = m[0]!;
  const [d, e, f] = m[1]!;
  const [g, h, i] = m[2]!;
  const m1 = e! * i! - f! * h!;
  const m2 = d! * i! - f! * g!;
  const m3 = d! * h! - e! * g!;
  return `${a} \\cdot ${paren(m1)} - ${paren(b!)} \\cdot ${paren(m2)} + ${paren(c!)} \\cdot ${paren(m3)} = ${det3(m)}`;
}

/** replacement writes the row operation R_target - m R_source -> R_target. */
const replacement = (target: number, m: number, source: number) => `${poly([1, `R_${target}`], [-m, `R_${source}`])} \\to R_${target}`;

/** findingDeterminantsUsingRowAndColumnOperations covers reducing matrices to triangular form. */
export const findingDeterminantsUsingRowAndColumnOperations: TopicDef = {
  id: "finding-determinants-using-row-and-column-operations",
  title: t("Finding Determinants Using Row and Column Operations", "化上三角法计算行列式"),
  summary: t(
    "Evaluate determinants by reducing matrices to upper triangular form using elementary row operations.",
    "通过初等行变换将矩阵化为上三角形式，进而高效计算行列式的值。",
  ),
  intro: t(
    "Take $A = \\begin{pmatrix} 2 & 1 & 3 \\\\ 4 & 5 & 7 \\\\ -2 & 2 & 1 \\end{pmatrix}$. The replacements $R_2 - 2R_1 \\to R_2$ and $R_3 + R_1 \\to R_3$ give $\\begin{pmatrix} 2 & 1 & 3 \\\\ 0 & 3 & 1 \\\\ 0 & 3 & 4 \\end{pmatrix}$, and $R_3 - R_2 \\to R_3$ gives the triangular $\\begin{pmatrix} 2 & 1 & 3 \\\\ 0 & 3 & 1 \\\\ 0 & 0 & 3 \\end{pmatrix}$. Replacements never change a determinant, so $\\det A = 2 \\cdot 3 \\cdot 3 = 18$.\n\nCheck: expanding $A$ along its first row gives $2(5 - 14) - 1(4 + 14) + 3(8 + 10) = -18 - 18 + 54 = 18$.\n\nIn this lesson we compute determinants by eliminating to triangular form, keeping track of every swap and scaling on the way.",
    "取 $A = \\begin{pmatrix} 2 & 1 & 3 \\\\ 4 & 5 & 7 \\\\ -2 & 2 & 1 \\end{pmatrix}$。倍加变换 $R_2 - 2R_1 \\to R_2$ 与 $R_3 + R_1 \\to R_3$ 得到 $\\begin{pmatrix} 2 & 1 & 3 \\\\ 0 & 3 & 1 \\\\ 0 & 3 & 4 \\end{pmatrix}$，再做 $R_3 - R_2 \\to R_3$ 得到三角矩阵 $\\begin{pmatrix} 2 & 1 & 3 \\\\ 0 & 3 & 1 \\\\ 0 & 0 & 3 \\end{pmatrix}$。倍加变换从不改变行列式，所以 $\\det A = 2 \\cdot 3 \\cdot 3 = 18$。\n\n检验：把 $A$ 按第一行展开，$2(5 - 14) - 1(4 + 14) + 3(8 + 10) = -18 - 18 + 54 = 18$。\n\n本课我们通过消元化为三角形来计算行列式，并记下途中的每一次交换与数乘。",
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
        "Using elementary row operations, any square matrix can be reduced to an upper triangular matrix $U$. If $s$ row swaps were performed and no rows were scaled, $\\det(A) = (-1)^s \\det(U) = (-1)^s \\prod_{i=1}^n u_{ii}$, where $u_{ii}$ are the diagonal entries of $U$. For $\\begin{pmatrix} 1 & 2 \\\\ 3 & 10 \\end{pmatrix}$, $R_2 - 3R_1 \\to R_2$ gives $\\begin{pmatrix} 1 & 2 \\\\ 0 & 4 \\end{pmatrix}$, so the determinant is $1 \\cdot 4 = 4$.\n\n> **Watch out.** Read the pivots off $U$, not off $A$: the diagonal of $A$ changes during elimination. And the determinant is the product of the pivots, not their sum.",
        "通过初等行变换，任意方阵均可化为上三角矩阵 $U$。若整个消元过程中进行了 $s$ 次行交换且未对行进行数乘缩放，则 $\\det(A) = (-1)^s \\det(U) = (-1)^s \\prod_{i=1}^n u_{ii}$，其中 $u_{ii}$ 为 $U$ 的主对角线元素。对 $\\begin{pmatrix} 1 & 2 \\\\ 3 & 10 \\end{pmatrix}$，$R_2 - 3R_1 \\to R_2$ 得 $\\begin{pmatrix} 1 & 2 \\\\ 0 & 4 \\end{pmatrix}$，所以行列式为 $1 \\cdot 4 = 4$。\n\n> **注意。** 主元要从 $U$ 上读，而不是从 $A$ 上读：消元过程中 $A$ 的对角线会改变。行列式是主元之积，不是主元之和。",
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

        // A = L U, so the replacements with multipliers l21, l31 and l32 reduce A to U.
        const r1 = [u11, u12, u13];
        const r2 = [l21 * u11, l21 * u12 + u22, l21 * u13 + u23];
        const r3 = [l31 * u11, l31 * u12 + l32 * u22, l31 * u13 + l32 * u23 + u33];

        const A: Mat = [r1, r2, r3];
        const mid: Mat = [r1, [0, u22, u23], [0, l32 * u22, l32 * u23 + u33]];
        const U: Mat = [r1, [0, u22, u23], [0, 0, u33]];
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
          solution: walked(
            [
              [
                ["Clear column 1", "消去第 1 列"],
                t(
                  `$${replacement(2, l21, 1)}$ and $${replacement(3, l31, 1)}$ give $${matLatex(mid)}$.`,
                  `$${replacement(2, l21, 1)}$ 与 $${replacement(3, l31, 1)}$ 得到 $${matLatex(mid)}$。`,
                ),
              ],
              [
                ["Clear column 2", "消去第 2 列"],
                t(
                  `$${replacement(3, l32, 2)}$ gives the upper triangular $U = ${matLatex(U)}$.`,
                  `$${replacement(3, l32, 2)}$ 得到上三角矩阵 $U = ${matLatex(U)}$。`,
                ),
              ],
              [
                ["Multiply the pivots", "主元相乘"],
                t("Only replacements were used, so the determinant did not change.", "只用了倍加变换，所以行列式没有改变。"),
                [`\\det A = \\det U = ${u11} \\cdot ${paren(u22)} \\cdot ${u33} = ${detA}`],
              ],
            ],
            t(`Expanding $A$ along its first row: $${expansion3(A)}$.`, `把 $A$ 按第一行展开：$${expansion3(A)}$。`),
          ),
          mistakes: [
            why(
              -detA,
              "The sign is flipped. Only a row swap changes the sign, and this reduction needs no swap.",
              "符号反了。只有交换两行才改变符号，而这次消元不需要交换。",
            ),
            why(
              u11 + u22 + u33,
              "That adds the pivots; the determinant of a triangular matrix is the product of its diagonal.",
              "这是把主元相加；三角矩阵的行列式是对角线元素之积。",
            ),
            why(
              A[0]![0]! * A[1]![1]! * A[2]![2]!,
              "That multiplies the diagonal of $A$ itself. $A$ is not triangular; its diagonal changes during elimination.",
              "这是把 $A$ 本身的对角线相乘。$A$ 不是三角矩阵，消元时它的对角线会改变。",
            ),
            why(
              detA * l21 * l31 * l32,
              "The multipliers of row replacements do not enter the determinant; replacements leave it unchanged.",
              "倍加变换的乘数不进入行列式；倍加变换不改变行列式。",
            ),
          ].filter((m, i, all) => m.value !== detA && all.findIndex((x) => x.value === m.value) === i),
        });
      },
    },
    {
      id: "a-determinant-by-elimination-without-swaps",
      title: t("A determinant by elimination without swaps", "无需换行的消元求行列式"),
      explanation: t(
        "Row replacements $R_i - mR_j \\to R_i$ do not change the determinant. If elimination reaches an upper triangular matrix $U$ using only replacements, then $\\det A = \\det U$, the product of the pivots on the diagonal. Swaps or scalings, if used, must be accounted for separately. For $\\begin{pmatrix} 2 & 4 \\\\ -1 & 1 \\end{pmatrix}$, $R_2 + \\frac{1}{2}R_1 \\to R_2$ gives $\\begin{pmatrix} 2 & 4 \\\\ 0 & 3 \\end{pmatrix}$ and $\\det = 6$.\n\n> **Watch out.** A replacement subtracts a multiple of another row; it never scales the row being changed. Writing $2R_2 - R_1 \\to R_2$ instead doubles the determinant, and that factor must then be divided out.",
        "行的倍加变换 $R_i - mR_j \\to R_i$ 不改变行列式。若只用倍加变换就把 $A$ 化为上三角矩阵 $U$，则 $\\det A = \\det U$，即对角线上主元之积。若用了交换或数乘，则须另外计入。对 $\\begin{pmatrix} 2 & 4 \\\\ -1 & 1 \\end{pmatrix}$，$R_2 + \\frac{1}{2}R_1 \\to R_2$ 得 $\\begin{pmatrix} 2 & 4 \\\\ 0 & 3 \\end{pmatrix}$，$\\det = 6$。\n\n> **注意。** 倍加变换是减去另一行的倍数，从不缩放被改变的那一行。若写成 $2R_2 - R_1 \\to R_2$，行列式就变成两倍，必须再把这个因子除掉。",
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
        const first = [...(l[0] !== 0 ? [replacement(2, l[0]!, 1)] : []), ...(l[1] !== 0 ? [replacement(3, l[1]!, 1)] : [])];
        const mid = matMul(
          [
            [1, 0, 0],
            [0, 1, 0],
            [0, l[2]!, 1],
          ],
          U,
        );
        const joined = (ops: readonly string[], and: string) => ops.map((o) => `$${o}$`).join(and);
        return numberProblem({
          prompt: t(`Find $\\det A$ for $A = ${matLatex(A)}$.`, `求 $A = ${matLatex(A)}$ 的 $\\det A$。`),
          answer: ans,
          mistakes: [
            why(
              -ans,
              "The sign is flipped. Row replacements never change the sign of a determinant; only swaps do.",
              "符号反了。倍加变换从不改变行列式的符号，只有交换才会。",
            ),
            why(
              piv[0]! + piv[1]! + piv[2]!,
              "That adds the pivots; the determinant of a triangular matrix is the product of its diagonal.",
              "这是把主元相加；三角矩阵的行列式是对角线元素之积。",
            ),
            why(
              A[0]![0]! * A[1]![1]! * A[2]![2]!,
              "That multiplies the diagonal of $A$ before elimination; only the diagonal of the triangular form gives the determinant.",
              "这是把消元前 $A$ 的对角线相乘；只有三角形的对角线才给出行列式。",
            ),
            why(
              piv[0]! * piv[1]!,
              "The last pivot is missing: all three diagonal entries of the triangular form are multiplied.",
              "漏了最后一个主元：三角形的三个对角元都要相乘。",
            ),
          ].filter((m, i, all) => m.value !== ans && all.findIndex((x) => x.value === m.value) === i),
          solution: walked(
            [
              [
                ["Clear column 1", "消去第 1 列"],
                first.length > 0
                  ? t(
                      `${joined(first, " and ")} ${first.length === 1 ? "gives" : "give"} $${matLatex(mid)}$.`,
                      `${joined(first, " 与 ")} 得到 $${matLatex(mid)}$。`,
                    )
                  : t("Column 1 already has zeros below the first pivot.", "第 1 列在第一个主元下方已经是零。"),
              ],
              [
                ["Clear column 2", "消去第 2 列"],
                l[2] !== 0
                  ? t(
                      `$${replacement(3, l[2]!, 2)}$ gives $U = ${matLatex(U)}$.`,
                      `$${replacement(3, l[2]!, 2)}$ 得到 $U = ${matLatex(U)}$。`,
                    )
                  : t(
                      `Column 2 already has a zero below the second pivot, so $U = ${matLatex(U)}$.`,
                      `第 2 列在第二个主元下方已经是零，所以 $U = ${matLatex(U)}$。`,
                    ),
              ],
              [
                ["Multiply the pivots", "主元相乘"],
                t("", ""),
                [`\\det A = \\det U = ${piv[0]} \\cdot ${paren(piv[1]!)} \\cdot ${paren(piv[2]!)} = ${ans}`],
              ],
            ],
            t(`Expanding $A$ along its first row: $${expansion3(A)}$.`, `把 $A$ 按第一行展开：$${expansion3(A)}$。`),
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
  intro: t(
    "Cut $M = \\begin{pmatrix} 2 & 1 & 5 & 7 \\\\ 1 & 3 & 4 & 6 \\\\ 0 & 0 & 4 & 1 \\\\ 0 & 0 & 2 & 1 \\end{pmatrix}$ after its second row and column. It becomes $\\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}$ with $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$ and $D = \\begin{pmatrix} 4 & 1 \\\\ 2 & 1 \\end{pmatrix}$. Because the lower left block is zero, $\\det M = \\det A \\cdot \\det D = 5 \\cdot 2 = 10$, and the block $B$ plays no part.\n\nCheck: expanding $M$ down its first column gives $2 \\cdot 3 \\cdot 2 - 1 \\cdot 1 \\cdot 2 = 12 - 2 = 10$, since each $3 \\times 3$ minor is triangular by blocks too.\n\nIn this lesson we split matrices into blocks, multiply them block by block, and find determinants and inverses of block triangular matrices.",
    "把 $M = \\begin{pmatrix} 2 & 1 & 5 & 7 \\\\ 1 & 3 & 4 & 6 \\\\ 0 & 0 & 4 & 1 \\\\ 0 & 0 & 2 & 1 \\end{pmatrix}$ 在第二行、第二列之后切开，它就成为 $\\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}$，其中 $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix}$，$D = \\begin{pmatrix} 4 & 1 \\\\ 2 & 1 \\end{pmatrix}$。左下块为零，所以 $\\det M = \\det A \\cdot \\det D = 5 \\cdot 2 = 10$，块 $B$ 不起作用。\n\n检验：把 $M$ 沿第一列展开，每个 $3 \\times 3$ 余子式也是分块三角的，得 $2 \\cdot 3 \\cdot 2 - 1 \\cdot 1 \\cdot 2 = 12 - 2 = 10$。\n\n本课我们把矩阵分成块，逐块相乘，并求分块三角矩阵的行列式与逆。",
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
        "For a block triangular matrix $M = \\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}$ or $M = \\begin{pmatrix} A & 0 \\\\ C & D \\end{pmatrix}$, where $A$ is $k \\times k$ and $D$ is $m \\times m$, the determinant is the product of the determinants of the diagonal blocks: $\\det(M) = \\det(A)\\det(D)$. With $\\det A = 3$ and $\\det D = -2$, $\\det M = -6$ whatever the block $B$ is.\n\n> **Watch out.** The formula needs a zero block off the diagonal. It is a product of the two determinants, not a sum, and the off-diagonal block $B$ or $C$ never enters it.",
        "对于分块三角矩阵 $M = \\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}$ 或 $M = \\begin{pmatrix} A & 0 \\\\ C & D \\end{pmatrix}$，其中 $A$ 为 $k \\times k$ 方阵，$D$ 为 $m \\times m$ 方阵，其行列式等于对角块行列式的乘积：$\\det(M) = \\det(A)\\det(D)$。若 $\\det A = 3$，$\\det D = -2$，则不论块 $B$ 是什么，$\\det M = -6$。\n\n> **注意。** 这个公式要求对角线外有一个零块。它是两个行列式之积，不是之和，非对角块 $B$ 或 $C$ 从不进入公式。",
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
        const detB = b1 * b4 - b2 * b3;

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
          solution: walked(
            [
              [
                ["Split into blocks", "分块"],
                t(
                  `The lower left $2 \\times 2$ block is zero, so $M = \\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}$ with $A = ${matLatex(
                    [
                      [a1, a2],
                      [a3, a4],
                    ],
                  )}$ and $D = ${matLatex([
                    [d1, d2],
                    [d3, d4],
                  ])}$, and $\\det M = \\det A \\det D$.`,
                  `左下的 $2 \\times 2$ 块为零，所以 $M = \\begin{pmatrix} A & B \\\\ 0 & D \\end{pmatrix}$，其中 $A = ${matLatex([
                    [a1, a2],
                    [a3, a4],
                  ])}$，$D = ${matLatex([
                    [d1, d2],
                    [d3, d4],
                  ])}$，且 $\\det M = \\det A \\det D$。`,
                ),
              ],
              [
                ["Find the two determinants", "求两个行列式"],
                t("", ""),
                [
                  `\\det A = ${a1} \\cdot ${a4} - ${paren(a2)} \\cdot ${paren(a3)} = ${detA}`,
                  `\\det D = ${d1} \\cdot ${d4} - ${paren(d2)} \\cdot ${d3} = ${detD}`,
                ],
              ],
              [["Multiply", "相乘"], t("", ""), [`\\det M = ${paren(detA)} \\cdot ${paren(detD)} = ${ans}`]],
            ],
            t(
              `Expanding $M$ down its first column, each $3 \\times 3$ minor keeps the zero block and equals an entry of $A$ times $\\det D$: $${a1} \\cdot ${a4} \\cdot ${paren(detD)} - ${paren(a3)} \\cdot ${paren(a2)} \\cdot ${paren(detD)} = ${ans}$.`,
              `把 $M$ 沿第一列展开，每个 $3 \\times 3$ 余子式都保留零块，等于 $A$ 的一个元素乘以 $\\det D$：$${a1} \\cdot ${a4} \\cdot ${paren(detD)} - ${paren(a3)} \\cdot ${paren(a2)} \\cdot ${paren(detD)} = ${ans}$。`,
            ),
          ),
          mistakes: [
            why(
              detA + detD,
              "That adds the two determinants; for a block triangular matrix they are multiplied.",
              "这是把两个行列式相加；分块三角矩阵的行列式是二者相乘。",
            ),
            why(
              -ans,
              "The sign is flipped. With the zero block below the diagonal, no sign appears in the product.",
              "符号反了。零块在对角线下方时，乘积中不出现负号。",
            ),
            why(
              ans - detB,
              "The block $B$ above the zero block does not enter the determinant; this is not a $2 \\times 2$ rule with blocks for entries.",
              "零块上方的块 $B$ 不进入行列式；这不是把块当元素用的二阶公式。",
            ),
            why(
              detA,
              "That is only the determinant of the top left block; the other diagonal block counts too.",
              "这只是左上块的行列式；另一个对角块也要算进去。",
            ),
          ].filter((m, i, all) => m.value !== ans && all.findIndex((x) => x.value === m.value) === i),
        });
      },
    },
    {
      id: "inverting-a-block-unit-upper-triangular-matrix",
      title: t("Inverting a block unit upper triangular matrix", "求分块单位上三角矩阵的逆"),
      explanation: t(
        "Block matrices multiply like ordinary matrices, with blocks in place of entries. For $M = \\begin{pmatrix} I & B \\\\ 0 & I \\end{pmatrix}$ the product $\\begin{pmatrix} I & B \\\\ 0 & I \\end{pmatrix}\\begin{pmatrix} I & -B \\\\ 0 & I \\end{pmatrix} = \\begin{pmatrix} I & -B + B \\\\ 0 & I \\end{pmatrix} = I$, so\n\n$$M^{-1} = \\begin{pmatrix} I & -B \\\\ 0 & I \\end{pmatrix}.$$\n\nOnly the sign of the off-diagonal block changes. With $B = \\begin{pmatrix} 2 & 0 \\\\ 1 & 3 \\end{pmatrix}$, the top right block of $M^{-1}$ is $\\begin{pmatrix} -2 & 0 \\\\ -1 & -3 \\end{pmatrix}$.\n\n> **Watch out.** The block $B$ keeps its place and its shape: negate it, do not transpose it or invert it. The diagonal blocks stay $I$.",
        "分块矩阵的乘法与普通矩阵相同，只是以块代替元素。对 $M = \\begin{pmatrix} I & B \\\\ 0 & I \\end{pmatrix}$，乘积 $\\begin{pmatrix} I & B \\\\ 0 & I \\end{pmatrix}\\begin{pmatrix} I & -B \\\\ 0 & I \\end{pmatrix} = \\begin{pmatrix} I & -B + B \\\\ 0 & I \\end{pmatrix} = I$，所以\n\n$$M^{-1} = \\begin{pmatrix} I & -B \\\\ 0 & I \\end{pmatrix}$$\n\n只有非对角块的符号改变。若 $B = \\begin{pmatrix} 2 & 0 \\\\ 1 & 3 \\end{pmatrix}$，$M^{-1}$ 的右上块是 $\\begin{pmatrix} -2 & 0 \\\\ -1 & -3 \\end{pmatrix}$。\n\n> **注意。** 块 $B$ 的位置和形状都不变：只取相反数，不要转置，也不要求逆。对角块仍是 $I$。",
      ),
      generate(rng: Rng): Problem {
        const B = [
          [rng.nonZero(-5, 5), rng.nonZero(-5, 5)],
          [rng.nonZero(-5, 5), rng.nonZero(-5, 5)],
        ];
        const M = [
          [1, 0, B[0]![0]!, B[0]![1]!],
          [0, 1, B[1]![0]!, B[1]![1]!],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ];
        const i = rng.int(1, 2);
        const j = rng.int(3, 4);
        const b = B[i - 1]![j - 3]!;
        const ans = -b;
        const negB = B.map((r) => r.map((x) => -x));
        return numberProblem({
          prompt: t(
            `Find the $(${i}, ${j})$ entry of $M^{-1}$ for $M = ${matLatex(M)}$.`,
            `求 $M = ${matLatex(M)}$ 的逆矩阵 $M^{-1}$ 的 $(${i}, ${j})$ 元素。`,
          ),
          answer: ans,
          mistakes: [
            why(
              b,
              "That is the entry of $M$ itself; the off-diagonal block of the inverse has the opposite sign.",
              "这是 $M$ 本身的元素；逆矩阵的非对角块符号相反。",
            ),
            why(
              -B[j - 3]![i - 1]!,
              "That entry comes from the transpose of $B$; the block keeps its shape, only its sign changes.",
              "这个元素来自 $B$ 的转置；块的形状不变，只是符号改变。",
            ),
            why(
              0,
              "The top right block of $M^{-1}$ is not zero: it must cancel $B$ in the product $MM^{-1}$.",
              "$M^{-1}$ 的右上块不是零：它要在乘积 $MM^{-1}$ 中抵消 $B$。",
            ),
          ].filter((m, k, all) => m.value !== ans && all.findIndex((x) => x.value === m.value) === k),
          solution: walked(
            [
              [
                ["See the blocks", "看出分块"],
                t(
                  `$M = \\begin{pmatrix} I & B \\\\ 0 & I \\end{pmatrix}$ with $B = ${matLatex(B)}$, so $M^{-1} = \\begin{pmatrix} I & -B \\\\ 0 & I \\end{pmatrix}$.`,
                  `$M = \\begin{pmatrix} I & B \\\\ 0 & I \\end{pmatrix}$，$B = ${matLatex(B)}$，所以 $M^{-1} = \\begin{pmatrix} I & -B \\\\ 0 & I \\end{pmatrix}$。`,
                ),
              ],
              [
                ["Read the entry", "读出元素"],
                t(
                  `$-B = ${matLatex(negB)}$ fills rows $1$–$2$ and columns $3$–$4$, so the $(${i}, ${j})$ entry is $${ans}$.`,
                  `$-B = ${matLatex(negB)}$ 占第 $1$–$2$ 行、第 $3$–$4$ 列，所以 $(${i}, ${j})$ 元素是 $${ans}$。`,
                ),
              ],
            ],
            t(
              `Row $${i}$ of $M$ times column $${j}$ of $M^{-1}$ is $${paren(ans)} + ${paren(b)} = 0$, the $(${i}, ${j})$ entry of $I$.`,
              `$M$ 的第 $${i}$ 行乘以 $M^{-1}$ 的第 $${j}$ 列得 $${paren(ans)} + ${paren(b)} = 0$，正是 $I$ 的 $(${i}, ${j})$ 元素。`,
            ),
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
  intro: t(
    "Eliminate in $x + 2y = 3$, $2x + 4y = 6$: the operation $R_2 - 2R_1 \\to R_2$ turns the second row into $[0 \\quad 0 \\mid 0]$, the true statement $0 = 0$. Only one equation is left, so $y$ is free and there are infinitely many solutions. Had the second equation been $2x + 4y = 7$, the same step would give $[0 \\quad 0 \\mid 1]$, the false statement $0 = 1$, and no solution.\n\nCheck: $(3, 0)$ and $(1, 1)$ both solve the first system, since $3 + 0 = 3$, $6 + 0 = 6$ and $1 + 2 = 3$, $2 + 4 = 6$.\n\nIn this lesson we recognise singular $2 \\times 2$ systems by elimination and decide between no solution and infinitely many.",
    "在 $x + 2y = 3$，$2x + 4y = 6$ 中消元：变换 $R_2 - 2R_1 \\to R_2$ 把第二行化为 $[0 \\quad 0 \\mid 0]$，即恒真的 $0 = 0$。只剩一个方程，$y$ 是自由的，所以有无穷多解。若第二个方程是 $2x + 4y = 7$，同样的步骤得到 $[0 \\quad 0 \\mid 1]$，即不成立的 $0 = 1$，于是无解。\n\n检验：$(3, 0)$ 和 $(1, 1)$ 都是第一个方程组的解，因为 $3 + 0 = 3$，$6 + 0 = 6$，且 $1 + 2 = 3$，$2 + 4 = 6$。\n\n本课我们用消元认出奇异的 $2 \\times 2$ 方程组，并判断它无解还是有无穷多解。",
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
        "When row reduction yields a second row with zero coefficients: (1) $[0 \\quad 0 \\mid 0]$ represents the identity $0 = 0$, meaning the equations are dependent and the system has infinitely many solutions; (2) $[0 \\quad 0 \\mid c]$ with $c \\ne 0$ represents the contradiction $0 = c$, so the system is inconsistent and has no solution. For rows $(1, 3 \\mid 2)$ and $(2, 6 \\mid 5)$, $R_2 - 2R_1$ gives $(0, 0 \\mid 1)$: no solution.\n\n> **Watch out.** A zero row of coefficients alone decides nothing: look at its right-hand entry. And the right-hand sides are never the values of $x$ and $y$.",
        "当行化简使第二行系数全为零时：(1) 若形如 $[0 \\quad 0 \\mid 0]$，对应恒等式 $0 = 0$，说明方程线性相关，系统有无穷多解；(2) 若形如 $[0 \\quad 0 \\mid c]$（其中 $c \\ne 0$），对应矛盾式 $0 = c$，说明系统矛盾，因而无解。对行 $(1, 3 \\mid 2)$ 与 $(2, 6 \\mid 5)$，$R_2 - 2R_1$ 得 $(0, 0 \\mid 1)$：无解。\n\n> **注意。** 只看系数全为零的行还不能下结论：要看它右端的元素。而右端常数从来不是 $x$、$y$ 的值。",
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
        const r = c2 - m * c1;

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

        const infinite = t("Infinitely many solutions", "有无穷多解");
        const none = t("Has no solution (inconsistent)", "无解（矛盾方程组）");
        const origin = t("A unique solution $(x, y) = (0, 0)$", "唯一解 $(x, y) = (0, 0)$");
        const constants = t(`A unique solution $(x, y) = (${c1}, ${c2})$`, `唯一解 $(x, y) = (${c1}, ${c2})$`);

        return reasoned(
          oneOf(
            rng,
            prompt,
            isDependent ? infinite : none,
            [isDependent ? none : infinite, origin, constants],
            walked(
              [
                [
                  ["Clear the $(2, 1)$ entry", "消去 $(2, 1)$ 元素"],
                  t(
                    `Row $2$ of the coefficients is $${m}$ times row $1$, so $R_2 - ${paren(m)}R_1 \\to R_2$ gives`,
                    `系数的第 $2$ 行是第 $1$ 行的 $${m}$ 倍，所以 $R_2 - ${paren(m)}R_1 \\to R_2$ 得`,
                  ),
                  [
                    augLatex(
                      [
                        [a1, b1],
                        [0, 0],
                      ],
                      [c1, r],
                    ),
                  ],
                ],
                [
                  ["Read the last row", "读最后一行"],
                  isDependent
                    ? t(
                        "The last row says $0 = 0$, which is always true. One equation remains for two unknowns, so there are infinitely many solutions.",
                        "最后一行是 $0 = 0$，总成立。两个未知数只剩一个方程，所以有无穷多解。",
                      )
                    : t(
                        `The last row says $0 = ${r}$, which is never true, so the system has no solution.`,
                        `最后一行是 $0 = ${r}$，永不成立，所以方程组无解。`,
                      ),
                ],
              ],
              isDependent
                ? t(
                    `Multiplying the first equation by $${m}$ gives right side $${m} \\cdot ${paren(c1)} = ${c2}$, exactly the second equation, so the two describe one line.`,
                    `把第一个方程乘以 $${m}$，右端为 $${m} \\cdot ${paren(c1)} = ${c2}$，恰是第二个方程，所以两者是同一条直线。`,
                  )
                : t(
                    `Multiplying the first equation by $${m}$ gives right side $${m} \\cdot ${paren(c1)} = ${m * c1}$, not $${c2}$: the lines are parallel and never meet.`,
                    `把第一个方程乘以 $${m}$，右端为 $${m} \\cdot ${paren(c1)} = ${m * c1}$，不是 $${c2}$：两直线平行，永不相交。`,
                  ),
            ),
          ),
          [
            [
              none.en,
              "The last row reads $0 = 0$, which is always true; a contradiction needs a nonzero entry on the right.",
              "最后一行是 $0 = 0$，总成立；只有右端非零才是矛盾。",
            ],
            [
              infinite.en,
              `The last row reads $0 = ${r}$, which no values of $x$ and $y$ make true.`,
              `最后一行是 $0 = ${r}$，任何 $x$、$y$ 都不能使它成立。`,
            ],
            [
              origin.en,
              "A row of zero coefficients rules out a unique solution, and $(0, 0)$ does not even satisfy the first equation.",
              "系数全为零的行排除了唯一解，而且 $(0, 0)$ 连第一个方程都不满足。",
            ],
            [
              constants.en,
              "The right-hand sides are not the values of $x$ and $y$, and a row of zero coefficients rules out a unique solution.",
              "右端常数不是 $x$、$y$ 的值，而且系数全为零的行排除了唯一解。",
            ],
          ],
        );
      },
    },
    {
      id: "the-constant-that-makes-a-singular-system-consistent",
      title: t("The constant that makes a singular system consistent", "使奇异方程组相容的常数"),
      explanation: t(
        "When the second row of the coefficient matrix is $m$ times the first, elimination with $R_2 - mR_1 \\to R_2$ turns the second equation into $0 = k - me$. The system has infinitely many solutions if $k = me$ and no solution otherwise. So consistency depends only on the right-hand side. For $x + y = 2$ and $3x + 3y = k$: $k = 3 \\cdot 2 = 6$.\n\n> **Watch out.** The constant must be scaled by the same $m$ as the coefficients: $k = me$, not $k = e$ and not $m + e$.",
        "当系数矩阵的第二行是第一行的 $m$ 倍时，用 $R_2 - mR_1 \\to R_2$ 消元后第二个方程变为 $0 = k - me$。若 $k = me$ 则有无穷多解，否则无解。所以是否相容只取决于右端常数。对 $x + y = 2$ 与 $3x + 3y = k$：$k = 3 \\cdot 2 = 6$。\n\n> **注意。** 常数必须与系数乘以同一个 $m$：$k = me$，不是 $k = e$，也不是 $m + e$。",
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
          mistakes: [
            why(
              e,
              `The coefficients of the second equation are $${m}$ times those of the first, so its constant must be scaled by $${m}$ too.`,
              `第二个方程的系数是第一个的 $${m}$ 倍，所以它的常数也必须乘以 $${m}$。`,
            ),
            why(-ans, "The sign is flipped: the factor between the rows keeps its sign.", "符号反了：两行之间的倍数要连同符号。"),
            why(m + e, `The constant is multiplied by $${m}$, not increased by it.`, `常数是乘以 $${m}$，不是加上它。`),
            why(
              0,
              `With $k = 0$ the last row becomes $0 = ${-ans}$, a contradiction, so there would be no solution.`,
              `$k = 0$ 时最后一行变为 $0 = ${-ans}$，是矛盾，方程组将无解。`,
            ),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Eliminate", "消元"],
                t(
                  `Row $2$ of the coefficients is $${m}$ times row $1$. After $R_2 - ${paren(m)}R_1 \\to R_2$ the second equation is $0 = k - ${paren(m)} \\cdot ${paren(e)}$.`,
                  `系数的第 $2$ 行是第 $1$ 行的 $${m}$ 倍。经 $R_2 - ${paren(m)}R_1 \\to R_2$ 后第二个方程为 $0 = k - ${paren(m)} \\cdot ${paren(e)}$。`,
                ),
              ],
              [
                ["Make the last row true", "使最后一行成立"],
                t("Infinitely many solutions need the last row to read $0 = 0$:", "要有无穷多解，最后一行必须是 $0 = 0$："),
                [`k - ${paren(m)} \\cdot ${paren(e)} = 0 \\implies k = ${ans}`],
              ],
            ],
            t(
              `Multiplying the first equation by $${m}$ gives $${formatLinear2(m * a, m * b)} = ${ans}$, exactly the second equation, so both describe one line.`,
              `把第一个方程乘以 $${m}$ 得 $${formatLinear2(m * a, m * b)} = ${ans}$，恰是第二个方程，所以两者描述同一条直线。`,
            ),
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
  intro: t(
    "Solve $x + y + z = 6$, $2x + 3y + z = 11$, $x + 2y + 3z = 14$. The operations $R_2 - 2R_1 \\to R_2$ and $R_3 - R_1 \\to R_3$ give $y - z = -1$ and $y + 2z = 8$; then $R_3 - R_2 \\to R_3$ gives $3z = 9$. So $z = 3$, then $y = -1 + 3 = 2$, then $x = 6 - 2 - 3 = 1$.\n\nCheck: in the third original equation, $1 + 2 \\cdot 2 + 3 \\cdot 3 = 14$.\n\nIn this lesson we solve $3 \\times 3$ systems by clearing column $1$, then column $2$, and substituting back from the last row.",
    "解 $x + y + z = 6$，$2x + 3y + z = 11$，$x + 2y + 3z = 14$。变换 $R_2 - 2R_1 \\to R_2$ 与 $R_3 - R_1 \\to R_3$ 得 $y - z = -1$ 与 $y + 2z = 8$；再用 $R_3 - R_2 \\to R_3$ 得 $3z = 9$。所以 $z = 3$，然后 $y = -1 + 3 = 2$，再得 $x = 6 - 2 - 3 = 1$。\n\n检验：代入原来的第三个方程，$1 + 2 \\cdot 2 + 3 \\cdot 3 = 14$。\n\n本课我们先消去第 $1$ 列、再消去第 $2$ 列，然后从最后一行回代，求解 $3 \\times 3$ 方程组。",
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
        "To solve $A\\mathbf{x} = \\mathbf{b}$ for $3 \\times 3$: (1) Use row 1 pivot to clear entries in column 1 of rows 2 and 3; (2) Use row 2 pivot to clear entry in column 2 of row 3, achieving REF; (3) Solve for $z, y, x$ by back substitution. For example, an echelon form with rows $(1, 1, 1 \\mid 4)$, $(0, 1, 2 \\mid 5)$, $(0, 0, 2 \\mid 4)$ gives $z = 2$, $y = 1$, $x = 1$.\n\n> **Watch out.** Every row operation acts on the right-hand side too. In back substitution, move each known term across with its sign: $y + 2z = 5$ with $z = 2$ gives $y = 5 - 4$.",
        "求解 $3 \\times 3$ 系统 $A\\mathbf{x} = \\mathbf{b}$：(1) 利用第 1 行主元消去第 2、3 行第 1 列元素；(2) 利用第 2 行主元消去第 3 行第 2 列元素，得到行阶梯形 REF；(3) 依次回代求出 $z, y, x$。例如行阶梯形各行为 $(1, 1, 1 \\mid 4)$、$(0, 1, 2 \\mid 5)$、$(0, 0, 2 \\mid 4)$，得 $z = 2$，$y = 1$，$x = 1$。\n\n> **注意。** 每个行变换也要作用于右端。回代时把每个已知项连同符号移过去：$y + 2z = 5$ 且 $z = 2$ 时 $y = 5 - 4$。",
      ),
      generate(rng) {
        const x = rng.pick([-2, -1, 1, 2]);
        const y = rng.pick([-3, -1, 2, 3]);
        const z = rng.pick([-2, 1, 2, 3]);

        // Upper triangular REF entries
        const u12 = rng.pick([1, 2, -1]);
        const u13 = rng.pick([-2, 1, 2]);
        const u23 = rng.pick([2, -1, 3]);
        const u33 = rng.pick([1, 2, -1]);

        // Build A with simple multipliers m21, m31, m32
        const m21 = rng.pick([2, 3]);
        const m31 = rng.pick([1, -1]);
        const m32 = rng.pick([2, 1]);

        const U: Mat = [
          [1, u12, u13],
          [0, 1, u23],
          [0, 0, u33],
        ];
        const c = U.map((row) => row[0]! * x + row[1]! * y + row[2]! * z);
        const r1 = U[0]!;
        const r2 = [m21, m21 * u12 + 1, m21 * u13 + u23];
        const r3 = [m31, m31 * u12 + m32, m31 * u13 + m32 * u23 + u33];

        const A: Mat = [r1, r2, r3];
        const bVec = A.map((row) => row[0]! * x + row[1]! * y + row[2]! * z);
        const mid: Mat = [r1, [0, 1, u23], [0, m32, m32 * u23 + u33]];
        const midB = [c[0]!, c[1]!, m32 * c[1]! + c[2]!];

        const prompt = t(
          `Solve the $3 \\times 3$ system of equations using Gaussian elimination:

$$${augLatex(A, bVec)}$$`,
          `利用高斯消元法求解下列三元一次方程组：

$$${augLatex(A, bVec)}$$`,
        );

        const answer = pointLatex([x, y, z]);
        return withMistakes(
          pointProblem({
            prompt,
            answer: [x, y, z],
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Clear column 1", "消去第 1 列"],
                  t(
                    `$${replacement(2, m21, 1)}$ and $${replacement(3, m31, 1)}$ give`,
                    `$${replacement(2, m21, 1)}$ 与 $${replacement(3, m31, 1)}$ 得`,
                  ),
                  [augLatex(mid, midB)],
                ],
                [
                  ["Clear column 2", "消去第 2 列"],
                  t(`$${replacement(3, m32, 2)}$ gives the echelon form`, `$${replacement(3, m32, 2)}$ 得到行阶梯形`),
                  [augLatex(U, c)],
                ],
                [
                  ["Substitute back", "回代"],
                  t("", ""),
                  [
                    `${formatLinearTerm(u33, "z", true)} = ${c[2]} \\implies z = ${z}`,
                    `y = ${c[1]} - ${paren(u23)} \\cdot ${paren(z)} = ${y}`,
                    `x = ${c[0]} - ${paren(u12)} \\cdot ${paren(y)} - ${paren(u13)} \\cdot ${paren(z)} = ${x}`,
                  ],
                ],
              ],
              t(
                `In the third original equation, $${paren(r3[0]!)} \\cdot ${paren(x)} + ${paren(r3[1]!)} \\cdot ${paren(y)} + ${paren(r3[2]!)} \\cdot ${paren(z)} = ${bVec[2]}$.`,
                `代入原来的第三个方程：$${paren(r3[0]!)} \\cdot ${paren(x)} + ${paren(r3[1]!)} \\cdot ${paren(y)} + ${paren(r3[2]!)} \\cdot ${paren(z)} = ${bVec[2]}$。`,
              ),
            ),
          }),
          [
            say(
              pointLatex([y, x, z]),
              "The values of $x$ and $y$ are exchanged: write the answer in the order $(x, y, z)$.",
              "$x$ 和 $y$ 的值对调了：答案要按 $(x, y, z)$ 的顺序写。",
            ),
            say(
              pointLatex([x, y, -z]),
              "The sign of $z$ is wrong: divide the last constant by the last pivot, keeping both signs.",
              "$z$ 的符号错了：用最后的常数除以最后的主元，两者的符号都要保留。",
            ),
            say(
              pointLatex([x, c[1]! + u23 * z, z]),
              "The term with $z$ was moved across row $2$ without changing its sign.",
              "把含 $z$ 的项移过第 $2$ 行时没有变号。",
            ),
            say(
              pointLatex([c[0]! - u12 * y + u13 * z, y, z]),
              "In row $1$ both known terms move across with a minus sign; one of them kept its plus sign.",
              "在第 $1$ 行，两个已知项都要变号移过去；其中一个保留了加号。",
            ),
          ].filter((w, i, all) => w.response !== answer && all.findIndex((o) => o.response === w.response) === i),
        );
      },
    },
    {
      id: "finding-one-unknown-of-a-3x3-system-by-elimination",
      title: t("Finding one unknown of a 3×3 system by elimination", "用消元法求 3×3 方程组的一个未知数"),
      explanation: t(
        "Gaussian elimination brings $[A \\mid \\mathbf{b}]$ to upper triangular form, after which the last row gives $z$ directly. To find $z$ alone, eliminate $x$ from rows $2$ and $3$, then eliminate $y$ from row $3$; the remaining equation $u_{33}z = c_3$ gives $z = \\frac{c_3}{u_{33}}$. A check by substituting into one original equation catches arithmetic slips. If elimination ends with the row $(0, 0, 2 \\mid -6)$, then $z = -3$.\n\n> **Watch out.** Dividing an original equation by its $z$-coefficient does not give $z$: $x$ and $y$ are still in it. Only after both eliminations does the last row contain $z$ alone.",
        "高斯消元把 $[A \\mid \\mathbf{b}]$ 化为上三角形后，最后一行直接给出 $z$。只求 $z$ 时，先从第 $2$、$3$ 行消去 $x$，再从第 $3$ 行消去 $y$，剩下的方程 $u_{33}z = c_3$ 给出 $z = \\frac{c_3}{u_{33}}$。代回一个原方程检验可以发现计算错误。若消元最后得到行 $(0, 0, 2 \\mid -6)$，则 $z = -3$。\n\n> **注意。** 用原方程除以它的 $z$ 系数得不到 $z$：其中还有 $x$ 和 $y$。只有两次消元之后，最后一行才只含 $z$。",
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
        const z = sol[2]!;
        const mistakes = [
          why(
            sol[0]!,
            "That is the value of $x$; the last row of the echelon form gives $z$.",
            "这是 $x$ 的值；行阶梯形的最后一行给出 $z$。",
          ),
          why(
            sol[1]!,
            "That is the value of $y$; the last row of the echelon form gives $z$.",
            "这是 $y$ 的值；行阶梯形的最后一行给出 $z$。",
          ),
          why(
            -z,
            "The sign is wrong: divide the last constant by the last pivot, keeping both signs.",
            "符号错了：用最后的常数除以最后的主元，两者的符号都要保留。",
          ),
          ...(A[2]![2]! !== 0
            ? [
                why(
                  Q.of(b[2]!, A[2]![2]!),
                  "That divides the third original equation by its $z$-coefficient, but $x$ and $y$ are still in it; eliminate them first.",
                  "这是用原来第三个方程除以它的 $z$ 系数，但其中仍有 $x$ 和 $y$；要先把它们消去。",
                ),
              ]
            : []),
        ].filter((w, i, all) => !asQ(w.value).eq(Q.of(z)) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i);
        return numberProblem({
          prompt: t(`Solve $${augLatex(A, b)}$ and give $z$.`, `求解 $${augLatex(A, b)}$，给出 $z$。`),
          answer: z,
          solveFor: "z",
          mistakes,
          solution: walked(
            [
              [
                ["Eliminate", "消元"],
                t(
                  "Clearing column $1$ below the first pivot and then column $2$ below the second gives",
                  "先消去第一个主元下方的第 $1$ 列元素，再消去第二个主元下方的第 $2$ 列元素，得",
                ),
                [augLatex(U, c)],
              ],
              [["Solve the last row", "解最后一行"], t("", ""), [`${formatLinearTerm(U[2]![2]!, "z", true)} = ${c[2]} \\implies z = ${z}`]],
            ],
            t(
              `Back substitution then gives $y = ${sol[1]}$ and $x = ${sol[0]}$, and the first original equation holds: $${paren(A[0]![0]!)} \\cdot ${paren(sol[0]!)} + ${paren(A[0]![1]!)} \\cdot ${paren(sol[1]!)} + ${paren(A[0]![2]!)} \\cdot ${paren(z)} = ${b[0]}$.`,
              `继续回代得 $y = ${sol[1]}$，$x = ${sol[0]}$，原来的第一个方程成立：$${paren(A[0]![0]!)} \\cdot ${paren(sol[0]!)} + ${paren(A[0]![1]!)} \\cdot ${paren(sol[1]!)} + ${paren(A[0]![2]!)} \\cdot ${paren(z)} = ${b[0]}$。`,
            ),
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
  intro: t(
    "In the echelon matrix $\\begin{pmatrix} 2 & 1 & 0 & 3 \\\\ 0 & 0 & 5 & 1 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}$ the first nonzero entry of row $1$ is in column $1$ and that of row $2$ is in column $3$; row $3$ has none. So columns $1$ and $3$ are the pivot columns, and columns $2$ and $4$ belong to free variables.\n\nCheck: there are $2$ nonzero rows and $2$ pivots, and the $2$ pivot columns and $2$ free columns make up all $4$ columns.\n\nIn this lesson we find the pivots of a matrix, name its pivot columns and tell basic variables from free ones.",
    "在阶梯形矩阵 $\\begin{pmatrix} 2 & 1 & 0 & 3 \\\\ 0 & 0 & 5 & 1 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}$ 中，第 $1$ 行第一个非零元素在第 $1$ 列，第 $2$ 行的在第 $3$ 列，第 $3$ 行没有。所以第 $1$、$3$ 列是主元列，第 $2$、$4$ 列对应自由变量。\n\n检验：非零行有 $2$ 行，主元有 $2$ 个，$2$ 个主元列与 $2$ 个自由列合起来正好是全部 $4$ 列。\n\n本课我们找出矩阵的主元，指出主元列，并区分基本变量与自由变量。",
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
        "A column of a matrix that contains a leading entry (pivot) in row echelon form is a pivot column, and its variable is a basic variable. Columns that do not contain a pivot correspond to free variables, which can take any value in the solution set. In $\\begin{pmatrix} 1 & 4 & 2 \\\\ 0 & 0 & 3 \\end{pmatrix}$ the pivots are in columns $1$ and $3$, so there are $2$ pivots and column $2$ is free.\n\n> **Watch out.** Count leading entries, one per nonzero row; do not count rows that are all zero, and do not count every nonzero entry.",
        "在行阶梯形矩阵中，包含首非零元（主元）的列称为主元列，对应的未知数称为基本变量；不包含主元的列对应自由变量，在解集中可以任意取值。在 $\\begin{pmatrix} 1 & 4 & 2 \\\\ 0 & 0 & 3 \\end{pmatrix}$ 中，主元在第 $1$、$3$ 列，所以有 $2$ 个主元，第 $2$ 列是自由列。\n\n> **注意。** 数的是首元，每个非零行一个；不要数全零的行，也不要把每个非零元素都算上。",
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

        const listEn = pivotCols.map((c, i) => `row $${i + 1}$ in column $${c + 1}$`).join(", ");
        const listZh = pivotCols.map((c, i) => `第 $${i + 1}$ 行在第 $${c + 1}$ 列`).join("，");
        const zeroRows = rows - numPivots;
        const nonzeroEntries = M.flat().filter((v) => v !== 0).length;

        return numberProblem({
          prompt,
          answer: numPivots,
          solution: walked(
            [
              [
                ["Find each leading entry", "找出每行的首元"],
                t(
                  `The first nonzero entry of each nonzero row is: ${listEn}.${zeroRows > 0 ? ` The last $${zeroRows}$ row${zeroRows > 1 ? "s are" : " is"} all zeros and ${zeroRows > 1 ? "have" : "has"} no pivot.` : ""}`,
                  `各非零行的第一个非零元素：${listZh}。${zeroRows > 0 ? `最后 $${zeroRows}$ 行全为零，没有主元。` : ""}`,
                ),
              ],
              [
                ["Count them", "计数"],
                t(
                  `Each leading entry is one pivot, so $A$ has $${numPivots}$ pivots.`,
                  `每个首元是一个主元，所以 $A$ 有 $${numPivots}$ 个主元。`,
                ),
              ],
            ],
            t(
              `The pivot columns $${pivotCols.map((c) => c + 1).join(", ")}$ move strictly to the right going down, as echelon form requires, and the other $${cols - numPivots}$ columns are free: $${numPivots} + ${cols - numPivots} = ${cols}$ columns in all.`,
              `主元列 $${pivotCols.map((c) => c + 1).join(", ")}$ 自上而下严格右移，符合阶梯形的要求，其余 $${cols - numPivots}$ 列是自由列：共 $${numPivots} + ${cols - numPivots} = ${cols}$ 列。`,
            ),
          ),
          mistakes: [
            why(
              rows,
              "That counts every row, including the rows of zeros, which hold no pivot.",
              "这是把每一行都算上了，包括没有主元的全零行。",
            ),
            why(
              cols,
              "That counts every column; only the columns holding a leading entry have a pivot.",
              "这是把每一列都算上了；只有含首元的列才有主元。",
            ),
            why(cols - numPivots, "That counts the columns without a pivot, the free columns.", "这是没有主元的列数，即自由列的个数。"),
            why(
              nonzeroEntries,
              "That counts every nonzero entry; each nonzero row has only one pivot, its first nonzero entry.",
              "这是把每个非零元素都算上了；每个非零行只有一个主元，即它的第一个非零元素。",
            ),
          ].filter((w, i, all) => w.value !== numPivots && all.findIndex((o) => o.value === w.value) === i),
        });
      },
    },
    {
      id: "naming-the-pivot-columns-of-an-echelon-matrix",
      title: t("Naming the pivot columns of an echelon matrix", "指出阶梯形矩阵的主元列"),
      explanation: t(
        "In row echelon form the pivot of each nonzero row is its leading entry, and a pivot column is a column that contains a pivot. Read each nonzero row from the left and record the column of its first nonzero entry. Columns without a pivot correspond to free variables. In $\\begin{pmatrix} 0 & 3 & 1 & 2 \\\\ 0 & 0 & 0 & 4 \\end{pmatrix}$ the pivot columns are $2$ and $4$.\n\n> **Watch out.** A column can contain nonzero entries and still not be a pivot column: only the first nonzero entry of a row is a pivot.",
        "在行阶梯形中，每个非零行的主元就是其首元，含有主元的列称为主元列。从左向右读每个非零行，记下第一个非零元素所在的列。没有主元的列对应自由变量。在 $\\begin{pmatrix} 0 & 3 & 1 & 2 \\\\ 0 & 0 & 0 & 4 \\end{pmatrix}$ 中，主元列是第 $2$、$4$ 列。\n\n> **注意。** 一列可以含有非零元素却不是主元列：只有每行的第一个非零元素才是主元。",
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
        const named = cols.map((x) => x + 1).join(", ");
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
            walked(
              [
                [
                  ["Read each nonzero row", "读每个非零行"],
                  t(
                    `${cols.map((c, r) => `Row $${r + 1}$ starts in column $${c + 1}$`).join("; ")}${k < 3 ? "; row $3$ is all zeros" : ""}.`,
                    `${cols.map((c, r) => `第 $${r + 1}$ 行从第 $${c + 1}$ 列开始`).join("；")}${k < 3 ? "；第 $3$ 行全为零" : ""}。`,
                  ),
                ],
                [
                  ["Name the pivot columns", "指出主元列"],
                  t(
                    `The leading entries lie in columns $${named}$, so these are the pivot columns.`,
                    `首元位于第 $${named}$ 列，所以这些就是主元列。`,
                  ),
                ],
              ],
              t(
                `There are $${k}$ nonzero rows and $${k}$ pivot columns, and each pivot lies to the right of the one above it.`,
                `非零行有 $${k}$ 行，主元列有 $${k}$ 列，且每个主元都在上一个主元的右边。`,
              ),
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
  intro: t(
    "Suppose elimination leaves $x + y + z = 3$, $y + 2z = 1$ and a row $[0 \\quad 0 \\quad 0 \\mid 0]$. There is no pivot for $z$, so set $z = t$. Row $2$ gives $y = 1 - 2t$, and row $1$ gives $x = 3 - (1 - 2t) - t = 2 + t$. So every solution is $(x, y, z) = (2, 1, 0) + t(1, -2, 1)$.\n\nCheck: $t = 1$ gives $(3, -1, 1)$, and $3 - 1 + 1 = 3$, $-1 + 2 \\cdot 1 = 1$.\n\nIn this lesson we solve singular $3 \\times 3$ systems, decide when they have solutions, and write infinitely many solutions in parametric vector form.",
    "设消元后剩下 $x + y + z = 3$，$y + 2z = 1$ 以及一行 $[0 \\quad 0 \\quad 0 \\mid 0]$。$z$ 没有主元，所以令 $z = t$。第 $2$ 行给出 $y = 1 - 2t$，第 $1$ 行给出 $x = 3 - (1 - 2t) - t = 2 + t$。所以每个解都是 $(x, y, z) = (2, 1, 0) + t(1, -2, 1)$。\n\n检验：$t = 1$ 给出 $(3, -1, 1)$，而 $3 - 1 + 1 = 3$，$-1 + 2 \\cdot 1 = 1$。\n\n本课我们求解奇异的 $3 \\times 3$ 方程组，判断它何时有解，并把无穷多个解写成参数向量形式。",
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
        "When an augmented matrix of a consistent $3 \\times 3$ system has rank 2, row 3 is all zeros $[0 \\quad 0 \\quad 0 \\mid 0]$. With $z = t$ as the free variable, expressing basic variables $x$ and $y$ in terms of $t$ gives the parametric vector form: $\\mathbf{x} = \\mathbf{x}_p + t \\mathbf{v}$. From $y + z = 2$ and $x - z = 1$: $y = 2 - t$, $x = 1 + t$, so $\\mathbf{x} = (1, 2, 0) + t(1, -1, 1)$.\n\n> **Watch out.** Moving a $t$-term across the equals sign changes its sign, and $\\mathbf{v}$ collects the coefficients of $t$ after substitution, not the entries of the echelon form.",
        "当相容的三元线性方程组增广矩阵秩为 2 时，第 3 行全为零 $[0 \\quad 0 \\quad 0 \\mid 0]$。取自由变量 $z = t$，通过回代将基本变量 $x$ 和 $y$ 用 $t$ 表示，即可得到解的参数向量形式：$\\mathbf{x} = \\mathbf{x}_p + t \\mathbf{v}$。由 $y + z = 2$ 与 $x - z = 1$：$y = 2 - t$，$x = 1 + t$，所以 $\\mathbf{x} = (1, 2, 0) + t(1, -1, 1)$。\n\n> **注意。** 把含 $t$ 的项移到等号另一边要变号，而 $\\mathbf{v}$ 收集的是回代后 $t$ 的系数，不是阶梯形中的元素。",
      ),
      generate(rng) {
        const u12 = rng.pick([1, -1, 2]);
        const u13 = rng.pick([-2, 1, 3]);
        const u23 = rng.pick([2, -1, -2]);

        const y0 = rng.pick([1, 2, -2, 3]);
        const x0 = rng.pick([2, -1, 3, -3]);

        const b2 = y0;
        const b1 = x0 + u12 * y0;

        // z = t, y = y0 - u23 t, x = b1 - u12 y - u13 t = x0 + (u12 u23 - u13) t.
        const vx = u12 * u23 - u13;
        const vy = -u23;

        const U: Mat = [
          [1, u12, u13],
          [0, 1, u23],
          [0, 0, 0],
        ];
        const bVec = [b1, b2, 0];

        const prompt = t(
          `Find the parametric vector form of the solution $\\mathbf{x} = \\mathbf{x}_p + t\\mathbf{v}$ for the system with free parameter $z = t$:

$$${augLatex(U, bVec)}$$`,
          `设自由参数 $z = t$，求下列线性方程组解的参数向量形式 $\\mathbf{x} = \\mathbf{x}_p + t\\mathbf{v}$：

$$${augLatex(U, bVec)}$$`,
        );

        const form = (p: readonly number[], v: readonly number[]) =>
          `\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = ${colVecLatex(p)} + t ${colVecLatex(v)}`;
        const rightStr = form([x0, y0, 0], [vx, vy, 1]);
        const wrong1Str = form([x0, y0, 0], [-vx, vy, 1]);
        const wrong2Str = form([-x0, y0, 0], [vx, vy, 1]);
        const wrong3Str = form([b1, b2, 0], [u13, u23, 1]);
        const shown = (s: string) => t(`$$${s}$$`, `$$${s}$$`);
        const x1 = x0 + vx;
        const y1 = y0 + vy;

        return reasoned(
          oneOf(
            rng,
            prompt,
            shown(rightStr),
            [shown(wrong1Str), shown(wrong2Str), shown(wrong3Str)],
            walked(
              [
                [
                  ["Solve row 2 for $y$", "由第 2 行求 $y$"],
                  t(
                    `With $z = t$, row $2$ reads $${poly([1, "y"], [u23, "t"])} = ${b2}$:`,
                    `令 $z = t$，第 $2$ 行为 $${poly([1, "y"], [u23, "t"])} = ${b2}$：`,
                  ),
                  [`y = ${poly([y0, ""], [vy, "t"])}`],
                ],
                [
                  ["Substitute into row 1", "代入第 1 行"],
                  t(
                    `Row $1$ reads $x + ${paren(u12)}(${poly([y0, ""], [vy, "t"])}) + ${paren(u13)}t = ${b1}$:`,
                    `第 $1$ 行为 $x + ${paren(u12)}(${poly([y0, ""], [vy, "t"])}) + ${paren(u13)}t = ${b1}$：`,
                  ),
                  [`x = ${poly([x0, ""], [vx, "t"])}`],
                ],
                [
                  ["Write the vector form", "写成向量形式"],
                  t(
                    "The constants form $\\mathbf{x}_p$ and the coefficients of $t$ form $\\mathbf{v}$:",
                    "常数组成 $\\mathbf{x}_p$，$t$ 的系数组成 $\\mathbf{v}$：",
                  ),
                  [rightStr],
                ],
              ],
              t(
                `$t = 1$ gives $(${x1}, ${y1}, 1)$; row $1$: $${x1} + ${paren(u12)} \\cdot ${paren(y1)} + ${paren(u13)} \\cdot 1 = ${b1}$, and row $2$: $${y1} + ${paren(u23)} \\cdot 1 = ${b2}$.`,
                `$t = 1$ 给出 $(${x1}, ${y1}, 1)$；第 $1$ 行：$${x1} + ${paren(u12)} \\cdot ${paren(y1)} + ${paren(u13)} \\cdot 1 = ${b1}$，第 $2$ 行：$${y1} + ${paren(u23)} \\cdot 1 = ${b2}$。`,
              ),
            ),
          ),
          [
            [
              shown(wrong1Str).en,
              "The $x$-entry of $\\mathbf{v}$ has the wrong sign: after substituting $y$, collect the coefficient of $t$ with its sign.",
              "$\\mathbf{v}$ 的 $x$ 分量符号错了：代入 $y$ 后，要连同符号收集 $t$ 的系数。",
            ],
            [
              shown(wrong2Str).en,
              "The $x$-entry of $\\mathbf{x}_p$ has the wrong sign: put $t = 0$ in row $1$ and solve for $x$.",
              "$\\mathbf{x}_p$ 的 $x$ 分量符号错了：在第 $1$ 行中令 $t = 0$ 再解出 $x$。",
            ],
            [
              shown(wrong3Str).en,
              "This copies the right-hand side and the third column of the echelon form; the rows must be solved for $x$ and $y$ first.",
              "这是照抄了阶梯形的右端与第三列；必须先由各行解出 $x$ 和 $y$。",
            ],
          ],
        );
      },
    },
    {
      id: "counting-solutions-from-an-echelon-form-with-a-zero-row",
      title: t("Counting solutions from an echelon form with a zero row", "由含零行的阶梯形判断解的个数"),
      explanation: t(
        "If elimination on a $3 \\times 3$ system produces a row $[0\\ 0\\ 0 \\mid f]$, the system is singular. When $f \\ne 0$ that row says $0 = f$, so there is no solution. When $f = 0$ the row carries no information, one variable is free, and there are infinitely many solutions. A singular square system never has exactly one solution. A last row $[0\\ 0\\ 0 \\mid 4]$ means no solution; $[0\\ 0\\ 0 \\mid 0]$ means infinitely many.\n\n> **Watch out.** The zero row of coefficients is the same in both cases; only its last entry decides between none and infinitely many.",
        "若对 $3 \\times 3$ 方程组消元得到一行 $[0\\ 0\\ 0 \\mid f]$，则方程组是奇异的。当 $f \\ne 0$ 时该行表示 $0 = f$，无解。当 $f = 0$ 时该行不提供信息，有一个自由变量，解有无穷多个。奇异方阵方程组绝不会恰有一个解。最后一行为 $[0\\ 0\\ 0 \\mid 4]$ 表示无解；$[0\\ 0\\ 0 \\mid 0]$ 表示无穷多解。\n\n> **注意。** 两种情况下系数都是零行；只有它最后一个元素决定是无解还是无穷多解。",
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
            walked(
              [
                [
                  ["Read the last row", "读最后一行"],
                  f === 0
                    ? t("The last row reads $0 = 0$, which is always true.", "最后一行为 $0 = 0$，总成立。")
                    : t(`The last row reads $0 = ${f}$, which is never true.`, `最后一行为 $0 = ${f}$，永不成立。`),
                ],
                [
                  ["Decide", "下结论"],
                  f === 0
                    ? t(
                        "Rows $1$ and $2$ have pivots in columns $1$ and $2$, so $z$ is free and each value of $z$ gives a solution: infinitely many.",
                        "第 $1$、$2$ 行的主元在第 $1$、$2$ 列，所以 $z$ 是自由变量，$z$ 的每个值都给出一个解：无穷多解。",
                      )
                    : t(
                        "No values of $x$, $y$, $z$ satisfy that row, so there is no solution.",
                        "没有 $x$、$y$、$z$ 能满足这一行，所以无解。",
                      ),
                ],
              ],
              f === 0
                ? t(
                    "Count: $2$ pivots for $3$ unknowns leaves $3 - 2 = 1$ free variable, and the right-hand column holds no pivot.",
                    "计数：$3$ 个未知数、$2$ 个主元，剩下 $3 - 2 = 1$ 个自由变量，且右端列不含主元。",
                  )
                : t(
                    "The right-hand column holds a pivot, so $\\operatorname{rank} [A \\mid \\mathbf{b}] = 3 > 2 = \\operatorname{rank} A$: inconsistent.",
                    "右端列含主元，所以 $\\operatorname{rank} [A \\mid \\mathbf{b}] = 3 > 2 = \\operatorname{rank} A$：不相容。",
                  ),
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
  intro: t(
    "The echelon form $\\left[\\begin{array}{cc|c} 1 & 2 & 5 \\\\ 0 & 1 & 2 \\end{array}\\right]$ still needs back substitution. One more operation, $R_1 - 2R_2 \\to R_1$, clears the entry above the second pivot and gives $\\left[\\begin{array}{cc|c} 1 & 0 & 1 \\\\ 0 & 1 & 2 \\end{array}\\right]$, which reads off $x = 1$ and $y = 2$ directly.\n\nCheck: in the first row of the echelon form, $1 + 2 \\cdot 2 = 5$.\n\nIn this lesson we recognise reduced row echelon form, reach it by clearing above each pivot, and read solutions from it.",
    "阶梯形 $\\left[\\begin{array}{cc|c} 1 & 2 & 5 \\\\ 0 & 1 & 2 \\end{array}\\right]$ 还需要回代。再做一次变换 $R_1 - 2R_2 \\to R_1$，消去第二个主元上方的元素，得 $\\left[\\begin{array}{cc|c} 1 & 0 & 1 \\\\ 0 & 1 & 2 \\end{array}\\right]$，直接读出 $x = 1$，$y = 2$。\n\n检验：代入阶梯形的第一行，$1 + 2 \\cdot 2 = 5$。\n\n本课我们认识简化行阶梯形，通过消去每个主元上方的元素得到它，并从中读出解。",
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
        "A matrix is in Reduced Row Echelon Form (RREF) if: (1) It is in Row Echelon Form; (2) Every leading entry (pivot) is equal to 1; (3) Each pivot is the ONLY non-zero entry in its entire column (zeros both below and above each pivot). Every matrix has a unique RREF. So $\\begin{pmatrix} 1 & 0 & 4 \\\\ 0 & 1 & -2 \\end{pmatrix}$ is in RREF, but $\\begin{pmatrix} 1 & 3 & 4 \\\\ 0 & 1 & -2 \\end{pmatrix}$ is not.\n\n> **Watch out.** Nonzero entries are allowed in columns without a pivot. Only the pivot columns must be all zeros apart from the pivot $1$.",
        "矩阵处于简化行阶梯形 (RREF) 当且仅当：(1) 它满足行阶梯形 (REF) 条件；(2) 每个主元均等于 1；(3) 每个主元是其所在列中唯一的非零元素（主元的上方和下方均为零）。每个矩阵的 RREF 都是唯一确定的。所以 $\\begin{pmatrix} 1 & 0 & 4 \\\\ 0 & 1 & -2 \\end{pmatrix}$ 是 RREF，而 $\\begin{pmatrix} 1 & 3 & 4 \\\\ 0 & 1 & -2 \\end{pmatrix}$ 不是。\n\n> **注意。** 不含主元的列可以有非零元素。只有主元列除主元 $1$ 外必须全为零。",
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
        const shown = (m: Mat) => t(`$$${matLatex(m)}$$`, `$$${matLatex(m)}$$`);

        return reasoned(
          oneOf(
            rng,
            prompt,
            shown(rrefMat),
            [shown(notRref1), shown(notRref2), shown(notRref3)],
            walked(
              [
                [
                  ["Find the pivots", "找主元"],
                  t(
                    `In $${matLatex(rrefMat)}$ the leading entries are at $(1, 1)$, $(2, 2)$ and $(3, 4)$, each further right going down, and each equals $1$.`,
                    `在 $${matLatex(rrefMat)}$ 中，首元位于 $(1, 1)$、$(2, 2)$、$(3, 4)$，自上而下依次右移，且都等于 $1$。`,
                  ),
                ],
                [
                  ["Check the pivot columns", "检查主元列"],
                  t(
                    `Columns $1$, $2$ and $4$ have zeros everywhere except at their pivot. Column $3$ holds no pivot, so its entries $${c1}$ and $${c2}$ are allowed.`,
                    `第 $1$、$2$、$4$ 列除主元外全为零。第 $3$ 列不含主元，所以其中的 $${c1}$ 与 $${c2}$ 是允许的。`,
                  ),
                ],
              ],
              t(
                "The pivot columns $1$, $2$ and $4$ are exactly the columns of the $3 \\times 3$ identity, as in every matrix in RREF.",
                "主元列第 $1$、$2$、$4$ 列恰是 $3 \\times 3$ 单位矩阵的各列，所有 RREF 矩阵都是如此。",
              ),
            ),
          ),
          [
            [
              shown(notRref1).en,
              "Its first pivot is $2$; in RREF every pivot equals $1$.",
              "它的第一个主元是 $2$；RREF 中每个主元都等于 $1$。",
            ],
            [
              shown(notRref2).en,
              "Column $4$ holds a pivot but has a $3$ above it; a pivot must be the only nonzero entry of its column.",
              "第 $4$ 列含主元，但它上方有 $3$；主元必须是所在列唯一的非零元素。",
            ],
            [
              shown(notRref3).en,
              "Column $2$ holds a pivot but has a $2$ above it; a pivot must be the only nonzero entry of its column.",
              "第 $2$ 列含主元，但它上方有 $2$；主元必须是所在列唯一的非零元素。",
            ],
          ],
        );
      },
    },
    {
      id: "reading-a-solution-from-rref-with-a-free-variable",
      title: t("Reading a solution from RREF with a free variable", "从含自由变量的简化阶梯形读出解"),
      explanation: t(
        "In reduced row echelon form each pivot is $1$ and is the only nonzero entry in its column, so each row expresses one pivot variable in terms of the free variables. For $\\left[\\begin{array}{ccc|c} 1 & 0 & p & q \\\\ 0 & 1 & r & s \\end{array}\\right]$ with $z$ free, the rows read $x = q - pz$ and $y = s - rz$. Choosing a value of $z$ gives one particular solution. For the row $(1, 0, 2 \\mid 5)$ and $z = 3$: $x = 5 - 6 = -1$.\n\n> **Watch out.** The row says $x + pz = q$, so the $z$-term moves across with a minus sign. And use the row whose pivot belongs to the variable asked for.",
        "在简化行阶梯形中，每个主元都是 $1$，且是其所在列唯一的非零元素，所以每一行都把一个主元变量用自由变量表示。对 $z$ 为自由变量的 $\\left[\\begin{array}{ccc|c} 1 & 0 & p & q \\\\ 0 & 1 & r & s \\end{array}\\right]$，各行给出 $x = q - pz$，$y = s - rz$。给定 $z$ 的值就得到一个特解。对行 $(1, 0, 2 \\mid 5)$ 与 $z = 3$：$x = 5 - 6 = -1$。\n\n> **注意。** 该行表示 $x + pz = q$，所以 $z$ 项要带负号移过去。并且要用主元属于所求变量的那一行。",
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
        const [coef, rhs, row] = which === 0 ? [p, q, 1] : [r, s, 2];
        const otherAns = which === 0 ? s - r * z : q - p * z;
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
          mistakes: [
            why(rhs + coef * z, "The $z$-term was moved across without changing its sign.", "$z$ 项移过去时没有变号。"),
            why(
              rhs,
              `That leaves out the free variable: with $z = ${z}$ the $z$-term still counts.`,
              `这忽略了自由变量：$z = ${z}$ 时 $z$ 项仍要计入。`,
            ),
            why(
              otherAns,
              `That comes from the other row, which gives the other pivot variable; $${v}$ comes from row $${row}$.`,
              `这来自另一行，它给出的是另一个主元变量；$${v}$ 要由第 $${row}$ 行求出。`,
            ),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                [`Write row ${row} as an equation`, `把第 ${row} 行写成方程`],
                t(
                  `Row $${row}$ says $${poly([1, v], [coef, "z"])} = ${rhs}$, so $${v} = ${rhs} - ${paren(coef)}z$.`,
                  `第 $${row}$ 行表示 $${poly([1, v], [coef, "z"])} = ${rhs}$，所以 $${v} = ${rhs} - ${paren(coef)}z$。`,
                ),
              ],
              [[`Substitute $z = ${z}$`, `代入 $z = ${z}$`], t("", ""), [`${v} = ${rhs} - ${paren(coef)} \\cdot ${paren(z)} = ${ans}`]],
            ],
            t(
              `Row $${row}$ holds: $${ans} + ${paren(coef)} \\cdot ${paren(z)} = ${rhs}$.`,
              `第 $${row}$ 行成立：$${ans} + ${paren(coef)} \\cdot ${paren(z)} = ${rhs}$。`,
            ),
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
  intro: t(
    "The system $x_1 + 2x_2 + x_4 = 3$, $x_3 - x_4 = 1$ has $2$ equations in $4$ unknowns and is already in reduced form. Its pivots are in columns $1$ and $3$, so the rank is $2$ and $x_2 = s$, $x_4 = u$ are free: $x_1 = 3 - 2s - u$ and $x_3 = 1 + u$. There are $4 - 2 = 2$ free variables.\n\nCheck: $s = u = 0$ gives $(3, 0, 1, 0)$, and $3 + 0 + 0 = 3$, $1 - 0 = 1$.\n\nIn this lesson we eliminate in systems of any shape and use ranks to decide whether a solution exists and how many free variables it has.",
    "方程组 $x_1 + 2x_2 + x_4 = 3$，$x_3 - x_4 = 1$ 有 $2$ 个方程、$4$ 个未知数，已经是简化形。它的主元在第 $1$、$3$ 列，所以秩为 $2$，$x_2 = s$、$x_4 = u$ 是自由变量：$x_1 = 3 - 2s - u$，$x_3 = 1 + u$。共有 $4 - 2 = 2$ 个自由变量。\n\n检验：$s = u = 0$ 给出 $(3, 0, 1, 0)$，而 $3 + 0 + 0 = 3$，$1 - 0 = 1$。\n\n本课我们对任意形状的方程组消元，并用秩判断是否有解以及有多少个自由变量。",
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
        "For an $m \\times n$ linear system with augmented matrix $[A \\mid \\mathbf{b}]$: (1) It is consistent if and only if the last column of $[A \\mid \\mathbf{b}]$ is not a pivot column; (2) If consistent with rank $r = \\text{rank}(A)$, the number of basic variables is $r$ and the number of free variables is $n - r$. An underdetermined consistent system ($m < n$) always has infinitely many solutions. With $3$ equations, $5$ unknowns and rank $2$ there are $5 - 2 = 3$ free variables.\n\n> **Watch out.** Free variables come from the unknowns, $n - r$; the number of equations $m$ does not enter, and $r$ itself counts the basic variables.",
        "对于增广矩阵为 $[A \\mid \\mathbf{b}]$ 的 $m \\times n$ 线性方程组：(1) 系统相容当且仅当常数列不包含主元；(2) 若系统相容且系数矩阵秩为 $r = \\text{rank}(A)$，则基本变量数为 $r$，自由变量数为 $n - r$。未知数多于方程数的相容欠定方程组（$m < n$）必然有无穷多解。$3$ 个方程、$5$ 个未知数、秩为 $2$ 时，有 $5 - 2 = 3$ 个自由变量。\n\n> **注意。** 自由变量由未知数个数决定，即 $n - r$；方程个数 $m$ 不参与，而 $r$ 本身是基本变量的个数。",
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
          solution: walked(
            [
              [
                ["Count the basic variables", "数基本变量"],
                t(
                  `In ${article(m)} $${m} \\times ${n}$ system with rank $${r}$, there are $${r}$ pivot columns, one for each basic variable.`,
                  `在秩为 $${r}$ 的 $${m} \\times ${n}$ 系统中，有 $${r}$ 个主元列，每列对应一个基本变量。`,
                ),
              ],
              [
                ["Count the rest", "数其余的列"],
                t("The other columns of $A$ belong to free variables:", "$A$ 的其余各列对应自由变量："),
                [`n - r = ${n} - ${r} = ${freeCount}`],
              ],
            ],
            t(
              `The $${r}$ basic and $${freeCount}$ free variables account for all $${r} + ${freeCount} = ${n}$ unknowns.`,
              `$${r}$ 个基本变量与 $${freeCount}$ 个自由变量合起来正好是全部 $${r} + ${freeCount} = ${n}$ 个未知数。`,
            ),
          ),
          mistakes: [
            why(
              r,
              "That is the rank, the number of basic variables; the free variables are the rest.",
              "这是秩，即基本变量的个数；自由变量是其余的。",
            ),
            why(
              m - r,
              "That subtracts the rank from the number of equations; free variables come from the number of unknowns.",
              "这是用方程个数减秩；自由变量要用未知数个数来算。",
            ),
            why(
              n - m,
              "That subtracts the number of equations; subtract the rank, since some equations may be redundant.",
              "这是减去方程个数；应减去秩，因为有些方程可能是多余的。",
            ),
          ].filter((w, i, all) => w.value !== freeCount && (w.value as number) >= 0 && all.findIndex((o) => o.value === w.value) === i),
        });
      },
    },
    {
      id: "the-rank-from-the-dimension-of-the-solution-set",
      title: t("The rank from the dimension of the solution set", "由解集维数求秩"),
      explanation: t(
        "For an $m \\times n$ matrix $A$, every column is either a pivot column or corresponds to a free variable. The number of pivots is the rank $r$, and the number of free variables in the solution of $A\\mathbf{x} = \\mathbf{0}$ is $n - r$. So if the solution set of $A\\mathbf{x} = \\mathbf{0}$ has $d$ free parameters, the rank is $r = n - d$. The number of rows $m$ only limits how large $r$ can be. A $4 \\times 6$ matrix whose null solutions have $2$ parameters has rank $6 - 2 = 4$.\n\n> **Watch out.** Subtract from the number of columns $n$, not the number of rows $m$: each free parameter is an unknown without a pivot.",
        "对 $m \\times n$ 矩阵 $A$，每一列要么是主元列，要么对应一个自由变量。主元个数就是秩 $r$，$A\\mathbf{x} = \\mathbf{0}$ 的解中自由变量个数为 $n - r$。所以若 $A\\mathbf{x} = \\mathbf{0}$ 的解集有 $d$ 个自由参数，则秩为 $r = n - d$。行数 $m$ 只限制 $r$ 的最大值。一个 $4 \\times 6$ 矩阵，若齐次解有 $2$ 个参数，则秩为 $6 - 2 = 4$。\n\n> **注意。** 要用列数 $n$ 去减，而不是行数 $m$：每个自由参数都是一个没有主元的未知数。",
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
          mistakes: [
            why(
              m - d,
              "That subtracts from the number of rows; free parameters are unknowns, so subtract from the number of columns.",
              "这是用行数去减；自由参数是未知数，所以要用列数去减。",
            ),
            why(d, "That is the number of free parameters, not the number of pivots.", "这是自由参数的个数，不是主元的个数。"),
            why(n + d, "The free parameters are subtracted from the number of columns, not added.", "自由参数要从列数中减去，而不是加上。"),
            why(m, "The number of rows only bounds the rank from above; it does not fix it.", "行数只给出秩的上界，并不决定秩。"),
          ].filter((w, i, all) => w.value !== r && (w.value as number) >= 0 && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Split the columns", "把列分开"],
                t(
                  `Each of the $${n}$ columns of $A$ is either a pivot column or the column of a free variable, so $\\operatorname{rank} A + ${d} = ${n}$.`,
                  `$A$ 的 $${n}$ 列中每列要么是主元列，要么对应一个自由变量，所以 $\\operatorname{rank} A + ${d} = ${n}$。`,
                ),
              ],
              [["Solve for the rank", "求秩"], t("", ""), [`\\operatorname{rank} A = ${n} - ${d} = ${r}`]],
            ],
            t(
              `$${r} \\le ${Math.min(m, n)}$, the smaller of the numbers of rows and columns, as every rank must be.`,
              `$${r} \\le ${Math.min(m, n)}$，即不超过行数与列数中较小者，任何秩都必须如此。`,
            ),
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
  intro: t(
    "Applying $R_2 + 3R_1 \\to R_2$ to the identity gives $E = \\begin{pmatrix} 1 & 0 \\\\ 3 & 1 \\end{pmatrix}$. The operation is undone by $R_2 - 3R_1 \\to R_2$, so $E^{-1} = \\begin{pmatrix} 1 & 0 \\\\ -3 & 1 \\end{pmatrix}$.\n\nCheck: in $EE^{-1}$ row $2$ is $(3 \\cdot 1 + 1 \\cdot (-3), 1) = (0, 1)$, so $EE^{-1} = I$.\n\nIn this lesson we build the elementary matrix of each row operation and invert it by undoing the operation.",
    "对单位矩阵做 $R_2 + 3R_1 \\to R_2$，得到 $E = \\begin{pmatrix} 1 & 0 \\\\ 3 & 1 \\end{pmatrix}$。撤销这一步用 $R_2 - 3R_1 \\to R_2$，所以 $E^{-1} = \\begin{pmatrix} 1 & 0 \\\\ -3 & 1 \\end{pmatrix}$。\n\n检验：$EE^{-1}$ 的第 $2$ 行为 $(3 \\cdot 1 + 1 \\cdot (-3), 1) = (0, 1)$，所以 $EE^{-1} = I$。\n\n本课我们写出每种行变换的初等矩阵，并通过撤销变换求它的逆。",
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
        "An elementary matrix $E$ is obtained by applying a single elementary row operation to the identity matrix $I$. Every elementary matrix is invertible, and its inverse $E^{-1}$ is the elementary matrix corresponding to the reverse row operation: (1) Swap: $E^{-1} = E$; (2) Scaling: $(k R_i)^{-1} \\implies \\frac{1}{k} R_i$; (3) Addition: $(R_i + c R_j)^{-1} \\implies R_i - c R_j$. For example, $R_1 + 4R_2 \\to R_1$ gives $\\begin{pmatrix} 1 & 4 \\\\ 0 & 1 \\end{pmatrix}$, whose inverse is $\\begin{pmatrix} 1 & -4 \\\\ 0 & 1 \\end{pmatrix}$.\n\n> **Watch out.** Undoing a replacement flips only the sign of the multiplier; it stays in the same position, so do not move it across the diagonal.",
        "初等矩阵 $E$ 是由单位矩阵 $I$ 经一次初等行变换得到的矩阵。初等矩阵均可逆，其逆矩阵 $E^{-1}$ 就是对应该行变换的逆操作所生成的初等矩阵：(1) 对调行：$E^{-1} = E$；(2) 数乘行：$(k R_i)^{-1} \\implies \\frac{1}{k} R_i$；(3) 行倍加：$(R_i + c R_j)^{-1} \\implies R_i - c R_j$。例如 $R_1 + 4R_2 \\to R_1$ 给出 $\\begin{pmatrix} 1 & 4 \\\\ 0 & 1 \\end{pmatrix}$，它的逆为 $\\begin{pmatrix} 1 & -4 \\\\ 0 & 1 \\end{pmatrix}$。\n\n> **注意。** 撤销倍加只改变乘数的符号，乘数的位置不变，不要把它移到对角线另一侧。",
      ),
      generate(rng) {
        const c = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const isRow2 = rng.bool(); // R2 + c*R1 -> R2 vs R1 + c*R2 -> R1
        const [target, source] = isRow2 ? [2, 1] : [1, 2];
        const opStr = replacement(target, -c, source);
        const undo = replacement(target, c, source);

        const at = (v: number, transpose: boolean): Mat =>
          isRow2 !== transpose
            ? [
                [1, 0],
                [v, 1],
              ]
            : [
                [1, v],
                [0, 1],
              ];
        const E = at(c, false);
        const E_inv = at(-c, false);
        const moved = at(-c, true);
        const swap: Mat = [
          [0, 1],
          [1, 0],
        ];
        const show = (m: Mat) => t(`$$${matLatex(m)}$$`, `$$${matLatex(m)}$$`);

        const prompt = t(
          `What is the inverse $E^{-1}$ of the elementary matrix $E$ representing the row operation $${opStr}$?

$$E = ${matLatex(E)}$$`,
          `初等矩阵 $E$ 表示行变换 $${opStr}$，其逆矩阵 $E^{-1}$ 是哪一个？

$$E = ${matLatex(E)}$$`,
        );

        return reasoned(
          oneOf(
            rng,
            prompt,
            show(E_inv),
            [show(E), show(moved), show(swap)],
            walked(
              [
                [
                  ["Undo the operation", "撤销这一变换"],
                  t(
                    `$E$ adds $${c}$ times row ${source} to row ${target}. To undo it, subtract that multiple again: $${undo}$.`,
                    `$E$ 把第 ${source} 行的 $${c}$ 倍加到第 ${target} 行。撤销它就是再减去这个倍数：$${undo}$。`,
                  ),
                ],
                [
                  ["Write its matrix", "写出其矩阵"],
                  t(
                    `Applying $${undo}$ to $I$ puts $${-c}$ where $E$ has $${c}$:`,
                    `对 $I$ 做 $${undo}$，在 $E$ 中 $${c}$ 的位置放上 $${-c}$：`,
                  ),
                  [`E^{-1} = ${matLatex(E_inv)}`],
                ],
              ],
              t(
                `$${matLatex(E)}${matLatex(E_inv)} = ${matLatex(swap.map((r, i) => r.map((_, j) => (i === j ? 1 : 0))))}$, since the off-diagonal entry is $${c} + ${paren(-c)} = 0$.`,
                `$${matLatex(E)}${matLatex(E_inv)} = ${matLatex(swap.map((r, i) => r.map((_, j) => (i === j ? 1 : 0))))}$，因为非对角元素为 $${c} + ${paren(-c)} = 0$。`,
              ),
            ),
          ),
          [
            [
              `$$${matLatex(E)}$$`,
              `This is $E$ itself. Adding $${c}$ times the row again doubles the change instead of undoing it.`,
              `这就是 $E$ 本身。再加一次 $${c}$ 倍只会把变化加倍，而不是撤销它。`,
            ],
            [
              `$$${matLatex(moved)}$$`,
              `The sign is right but the multiplier moved across the diagonal, so this matrix changes row ${source}, not row ${target}.`,
              `符号对了，但乘数移到了对角线另一侧，这个矩阵改变的是第 ${source} 行，而不是第 ${target} 行。`,
            ],
            [
              `$$${matLatex(swap)}$$`,
              "That swaps the two rows. A replacement is undone by another replacement, not by a swap.",
              "这是交换两行的矩阵。倍加要用另一次倍加撤销，而不是交换。",
            ],
          ],
        );
      },
    },
    {
      id: "an-entry-of-the-inverse-of-an-elementary-2x2-matrix",
      title: t("An entry of the inverse of an elementary 2×2 matrix", "2×2 初等矩阵逆的元素"),
      explanation: t(
        "The inverse of an elementary matrix is the elementary matrix of the reverse operation. The inverse of $\\begin{pmatrix} 1 & 0 \\\\ c & 1 \\end{pmatrix}$ (add $c$ times row $1$ to row $2$) is $\\begin{pmatrix} 1 & 0 \\\\ -c & 1 \\end{pmatrix}$. The inverse of $\\begin{pmatrix} 1 & 0 \\\\ 0 & k \\end{pmatrix}$ (scale row $2$ by $k$) is $\\begin{pmatrix} 1 & 0 \\\\ 0 & \\frac{1}{k} \\end{pmatrix}$, and a swap matrix is its own inverse. For example, the inverse of $\\begin{pmatrix} 5 & 0 \\\\ 0 & 1 \\end{pmatrix}$ has $(1, 1)$ entry $\\frac{1}{5}$.\n\n> **Watch out.** A replacement is undone by the negative multiplier, a scaling by the reciprocal; mixing them up gives $-k$ or $\\frac{1}{c}$.",
        "初等矩阵的逆是逆向变换对应的初等矩阵。$\\begin{pmatrix} 1 & 0 \\\\ c & 1 \\end{pmatrix}$（把第 $1$ 行的 $c$ 倍加到第 $2$ 行）的逆为 $\\begin{pmatrix} 1 & 0 \\\\ -c & 1 \\end{pmatrix}$。$\\begin{pmatrix} 1 & 0 \\\\ 0 & k \\end{pmatrix}$（第 $2$ 行乘以 $k$）的逆为 $\\begin{pmatrix} 1 & 0 \\\\ 0 & \\frac{1}{k} \\end{pmatrix}$，交换矩阵的逆是它本身。例如 $\\begin{pmatrix} 5 & 0 \\\\ 0 & 1 \\end{pmatrix}$ 的逆的 $(1, 1)$ 元素为 $\\frac{1}{5}$。\n\n> **注意。** 倍加用相反的乘数撤销，数乘用倒数撤销；两者混淆就会得到 $-k$ 或 $\\frac{1}{c}$。",
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
        const inv = E.map((r, i) => r.map((v, j) => (i + 1 === pos[0] && j + 1 === pos[1] ? ans.toLatex() : String(v))));
        const mistakes =
          kind === 0
            ? [
                why(
                  Q.of(c),
                  "That is the entry of $E$ itself; the inverse subtracts the multiple, so the sign flips.",
                  "这是 $E$ 本身的元素；逆变换要减去这个倍数，所以符号相反。",
                ),
                why(
                  Q.of(1, c),
                  "A replacement is undone by the opposite multiplier, not by the reciprocal.",
                  "倍加要用相反的乘数撤销，而不是倒数。",
                ),
                why(Q.of(-1, c), "Only the sign flips; the multiplier is not inverted.", "只有符号改变，乘数本身不取倒数。"),
              ]
            : [
                why(
                  Q.of(c),
                  "That is the entry of $E$ itself; scaling by $k$ is undone by scaling by $\\frac{1}{k}$.",
                  "这是 $E$ 本身的元素；乘以 $k$ 要用乘以 $\\frac{1}{k}$ 来撤销。",
                ),
                why(Q.of(-c), "A scaling is undone by the reciprocal, not by the negative.", "数乘要用倒数撤销，而不是相反数。"),
                why(
                  Q.of(-1, c),
                  "The reciprocal keeps the sign: $k \\cdot \\frac{1}{k} = 1$.",
                  "倒数保持符号不变：$k \\cdot \\frac{1}{k} = 1$。",
                ),
              ];
        return numberProblem({
          prompt: t(
            `Find the $(${pos[0]}, ${pos[1]})$ entry of $E^{-1}$ for $E = ${matLatex(E)}$.`,
            `求 $E = ${matLatex(E)}$ 的逆矩阵 $E^{-1}$ 的 $(${pos[0]}, ${pos[1]})$ 元素。`,
          ),
          answer: ans,
          mistakes: mistakes.filter((w, i, all) => !asQ(w.value).eq(ans) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i),
          solution: walked(
            [
              [
                ["Name the operation", "说出这一变换"],
                kind === 0
                  ? t(
                      `$E$ adds $${c}$ times row ${3 - pos[0]!} to row ${pos[0]}.`,
                      `$E$ 把第 ${3 - pos[0]!} 行的 $${c}$ 倍加到第 ${pos[0]} 行。`,
                    )
                  : t(`$E$ multiplies row ${pos[0]} by $${c}$.`, `$E$ 把第 ${pos[0]} 行乘以 $${c}$。`),
              ],
              [
                ["Undo it", "撤销它"],
                kind === 0
                  ? t(`The inverse adds $${-c}$ times instead:`, `逆变换改为加 $${-c}$ 倍：`)
                  : t(`The inverse multiplies the same row by $${ans.toLatex()}$:`, `逆变换把同一行乘以 $${ans.toLatex()}$：`),
                [`E^{-1} = ${matLatex(inv)}`],
              ],
            ],
            kind === 0
              ? t(
                  `In $EE^{-1}$ the off-diagonal entry is $${c} + ${paren(-c)} = 0$, so $EE^{-1} = I$.`,
                  `$EE^{-1}$ 的非对角元素为 $${c} + ${paren(-c)} = 0$，所以 $EE^{-1} = I$。`,
                )
              : t(
                  `In $EE^{-1}$ the scaled diagonal entry is $${c} \\cdot ${ans.toLatex()} = 1$, so $EE^{-1} = I$.`,
                  `$EE^{-1}$ 中被数乘的对角元素为 $${c} \\cdot ${ans.toLatex()} = 1$，所以 $EE^{-1} = I$。`,
                ),
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
  intro: t(
    "The matrix of $R_2 - 2R_1 \\to R_2$ is $E = \\begin{pmatrix} 1 & 0 \\\\ -2 & 1 \\end{pmatrix}$. For $A = \\begin{pmatrix} 1 & 3 \\\\ 2 & 5 \\end{pmatrix}$, the product is $EA = \\begin{pmatrix} 1 & 3 \\\\ 0 & -1 \\end{pmatrix}$: row $1$ stays, and row $2$ becomes $(2 - 2 \\cdot 1, 5 - 2 \\cdot 3)$.\n\nCheck: doing $R_2 - 2R_1 \\to R_2$ on $A$ directly also gives row $2$ equal to $(0, -1)$.\n\nIn this lesson we carry out row operations by multiplying on the left by elementary matrices and combine two operations into one matrix.",
    "$R_2 - 2R_1 \\to R_2$ 的矩阵是 $E = \\begin{pmatrix} 1 & 0 \\\\ -2 & 1 \\end{pmatrix}$。对 $A = \\begin{pmatrix} 1 & 3 \\\\ 2 & 5 \\end{pmatrix}$，乘积 $EA = \\begin{pmatrix} 1 & 3 \\\\ 0 & -1 \\end{pmatrix}$：第 $1$ 行不变，第 $2$ 行变为 $(2 - 2 \\cdot 1, 5 - 2 \\cdot 3)$。\n\n检验：直接对 $A$ 做 $R_2 - 2R_1 \\to R_2$，第 $2$ 行同样是 $(0, -1)$。\n\n本课我们用左乘初等矩阵来实现行变换，并把两次变换合成一个矩阵。",
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
        "Applying an elementary row operation to a matrix $A$ is equivalent to multiplying $A$ on the left by the elementary matrix $E$ resulting from performing the same operation on the identity matrix $I$: $\\text{RowOp}(A) = E A$. For example, $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} = \\begin{pmatrix} 3 & 4 \\\\ 1 & 2 \\end{pmatrix}$: the swap matrix swaps the rows.\n\n> **Watch out.** Multiplying on the right, $AE$, acts on the columns of $A$ instead; for a row operation $E$ must stand on the left.",
        "对矩阵 $A$ 实施某一初等行变换，等价于用对单位矩阵 $I$ 实施相同变换得到的初等矩阵 $E$ 在左侧乘以 $A$：$\\text{RowOp}(A) = E A$。例如 $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix} = \\begin{pmatrix} 3 & 4 \\\\ 1 & 2 \\end{pmatrix}$：交换矩阵交换了两行。\n\n> **注意。** 右乘 $AE$ 作用在 $A$ 的列上；要做行变换，$E$ 必须在左边。",
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
        const op = replacement(2, k, 1);
        const detA = a11 * a22 - a12 * a21;
        const show = (m: Mat) => t(`$$${matLatex(m)}$$`, `$$${matLatex(m)}$$`);

        const prompt = t(
          `Compute the matrix product $E A$ where:

$$E = ${matLatex(E)}, \\quad A = ${matLatex(A)}$$`,
          `计算矩阵乘积 $E A$，其中：

$$E = ${matLatex(E)}, \\quad A = ${matLatex(A)}$$`,
        );

        return reasoned(
          oneOf(
            rng,
            prompt,
            show(EA),
            [show(AE), show(wrongAdd), show(wrongR1)],
            walked(
              [
                [
                  ["Read the operation", "读出变换"],
                  t(
                    `$E$ is $I$ with $${-k}$ in row 2, column 1, so left-multiplying by $E$ performs $${op}$. Row 1 is unchanged.`,
                    `$E$ 是在第 2 行第 1 列放上 $${-k}$ 的单位矩阵，所以左乘 $E$ 就是做 $${op}$。第 1 行不变。`,
                  ),
                ],
                [
                  ["Compute row 2", "计算第 2 行"],
                  t("", ""),
                  [
                    `${a21} - ${paren(k)} \\cdot ${paren(a11)} = ${a21 - k * a11}`,
                    `${a22} - ${paren(k)} \\cdot ${paren(a12)} = ${a22 - k * a12}`,
                    `EA = ${matLatex(EA)}`,
                  ],
                ],
              ],
              t(
                `$\\det E = 1$, so $\\det(EA)$ must equal $\\det A = ${detA}$: indeed $${paren(a11)} \\cdot ${paren(a22 - k * a12)} - ${paren(a12)} \\cdot ${paren(a21 - k * a11)} = ${detA}$.`,
                `$\\det E = 1$，所以 $\\det(EA)$ 应等于 $\\det A = ${detA}$：确实 $${paren(a11)} \\cdot ${paren(a22 - k * a12)} - ${paren(a12)} \\cdot ${paren(a21 - k * a11)} = ${detA}$。`,
              ),
            ),
          ),
          [
            [
              `$$${matLatex(AE)}$$`,
              "This is $AE$: multiplying on the right combines the columns of $A$, not its rows.",
              "这是 $AE$：右乘组合的是 $A$ 的列，而不是行。",
            ],
            [
              `$$${matLatex(wrongAdd)}$$`,
              `The sign is wrong: the $(2, 1)$ entry of $E$ is $${-k}$, so row 2 gets $${-k}$ times row 1, not $${k}$ times.`,
              `符号错了：$E$ 的 $(2, 1)$ 元素是 $${-k}$，所以第 2 行加上的是第 1 行的 $${-k}$ 倍，而不是 $${k}$ 倍。`,
            ],
            [
              `$$${matLatex(wrongR1)}$$`,
              "This changes row 1. The off-diagonal entry of $E$ sits in row 2, so row 2 is the one that changes.",
              "这改变了第 1 行。$E$ 的非对角元素在第 2 行，所以改变的是第 2 行。",
            ],
          ],
        );
      },
    },
    {
      id: "the-product-of-two-elementary-2x2-matrices",
      title: t("The product of two elementary 2×2 matrices", "两个 2×2 初等矩阵的乘积"),
      explanation: t(
        "Performing two row operations in turn multiplies by their elementary matrices from the left, the first one closest to $A$: the operation $E_1$ followed by $E_2$ is $E_2E_1A$. The product $E_2E_1$ is the single matrix doing both. For $E_1 = \\begin{pmatrix} 1 & 0 \\\\ a & 1 \\end{pmatrix}$ and $E_2 = \\begin{pmatrix} 1 & b \\\\ 0 & 1 \\end{pmatrix}$,\n\n$$E_2E_1 = \\begin{pmatrix} 1 + ab & b \\\\ a & 1 \\end{pmatrix}.$$\n\nWith $a = 2$ and $b = 3$ this is $\\begin{pmatrix} 7 & 3 \\\\ 2 & 1 \\end{pmatrix}$.\n\n> **Watch out.** The order matters: $E_1E_2 = \\begin{pmatrix} 1 & b \\\\ a & 1 + ab \\end{pmatrix}$ is a different matrix, so the first operation goes on the right.",
        "依次进行两个行变换就是从左边依次乘以它们的初等矩阵，第一个最靠近 $A$：先 $E_1$ 后 $E_2$ 即 $E_2E_1A$。乘积 $E_2E_1$ 是同时完成两步的单个矩阵。对 $E_1 = \\begin{pmatrix} 1 & 0 \\\\ a & 1 \\end{pmatrix}$，$E_2 = \\begin{pmatrix} 1 & b \\\\ 0 & 1 \\end{pmatrix}$，\n\n$$E_2E_1 = \\begin{pmatrix} 1 + ab & b \\\\ a & 1 \\end{pmatrix}$$\n\n取 $a = 2$，$b = 3$ 时为 $\\begin{pmatrix} 7 & 3 \\\\ 2 & 1 \\end{pmatrix}$。\n\n> **注意。** 顺序很重要：$E_1E_2 = \\begin{pmatrix} 1 & b \\\\ a & 1 + ab \\end{pmatrix}$ 是另一个矩阵，所以第一个变换放在右边。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-5, 5);
        const kl = (v: number) => (v < 0 ? `- ${-v === 1 ? "" : -v}` : `+ ${v === 1 ? "" : v}`);
        const ans = 1 + a * b;
        const E1 = [
          [1, 0],
          [a, 1],
        ];
        const E2 = [
          [1, b],
          [0, 1],
        ];
        return numberProblem({
          prompt: t(
            `First $R_2 ${kl(a)}R_1 \\to R_2$, then $R_1 ${kl(b)}R_2 \\to R_1$. Find the $(1, 1)$ entry of the single matrix $E$ that performs both operations.`,
            `先做 $R_2 ${kl(a)}R_1 \\to R_2$，再做 $R_1 ${kl(b)}R_2 \\to R_1$。求同时完成这两步的矩阵 $E$ 的 $(1, 1)$ 元素。`,
          ),
          answer: ans,
          mistakes: [
            why(
              1,
              "That is the $(1, 1)$ entry of $E_1E_2$, the wrong order. The first operation goes on the right: $E = E_2E_1$.",
              "这是 $E_1E_2$ 的 $(1, 1)$ 元素，顺序反了。第一个变换放在右边：$E = E_2E_1$。",
            ),
            why(
              a * b,
              `The $1$ from the identity part is missing: the entry is $1 \\cdot 1 + ${paren(b)} \\cdot ${paren(a)}$.`,
              `漏掉了单位矩阵部分的 $1$：该元素为 $1 \\cdot 1 + ${paren(b)} \\cdot ${paren(a)}$。`,
            ),
            why(1 - a * b, "The sign of $ab$ is wrong; both terms of the dot product are added.", "$ab$ 的符号错了；点积的两项是相加的。"),
            why(a + b, "The multipliers are multiplied together in the product, not added.", "在乘积中两个乘数是相乘，而不是相加。"),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Write the two matrices", "写出两个矩阵"],
                t("The first operation is $E_1$, the second $E_2$:", "第一个变换是 $E_1$，第二个是 $E_2$："),
                [`E_1 = ${matLatex(E1)}, \\quad E_2 = ${matLatex(E2)}`],
              ],
              [
                ["Multiply in the right order", "按正确顺序相乘"],
                t(
                  "The first operation stands next to $A$, so $E = E_2E_1$. Row 1 of $E_2$ times column 1 of $E_1$:",
                  "第一个变换紧挨 $A$，所以 $E = E_2E_1$。$E_2$ 的第 1 行乘 $E_1$ 的第 1 列：",
                ),
                [`1 \\cdot 1 + ${paren(b)} \\cdot ${paren(a)} = ${ans}`, `E = ${matLatex([[ans, b], E1[1]!])}`],
              ],
            ],
            t(
              `Apply both operations to $I$ directly. After the first, row 2 is $(${a}, 1)$; then row 1 becomes $(1, 0) + ${paren(b)}(${a}, 1) = (${ans}, ${b})$.`,
              `直接对 $I$ 做这两步。第一步后第 2 行为 $(${a}, 1)$；然后第 1 行变为 $(1, 0) + ${paren(b)}(${a}, 1) = (${ans}, ${b})$。`,
            ),
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
  intro: t(
    "Applying $R_3 - 4R_1 \\to R_3$ to $I_3$ puts $-4$ in row $3$, column $1$:\n\n$$E = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ -4 & 0 & 1 \\end{pmatrix}.$$\n\nIt is triangular with ones on the diagonal, so $\\det E = 1$.\n\nCheck: $E$ times the column $(1, 0, 4)$ has third entry $-4 \\cdot 1 + 4 = 0$, exactly what $R_3 - 4R_1$ does to that column.\n\nIn this lesson we build the $3 \\times 3$ elementary matrices of swaps, scalings and replacements and read off their determinants.",
    "对 $I_3$ 做 $R_3 - 4R_1 \\to R_3$，在第 $3$ 行第 $1$ 列放上 $-4$：\n\n$$E = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ -4 & 0 & 1 \\end{pmatrix}$$\n\n它是对角线全为 $1$ 的三角矩阵，所以 $\\det E = 1$。\n\n检验：$E$ 乘列向量 $(1, 0, 4)$，第三个分量为 $-4 \\cdot 1 + 4 = 0$，正是 $R_3 - 4R_1$ 对这一列的作用。\n\n本课我们构造交换、数乘与倍加的 $3 \\times 3$ 初等矩阵，并读出它们的行列式。",
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
        "A $3 \\times 3$ elementary matrix performs an elementary row operation on $3$-row matrices when multiplied from the left: (1) $P_{ij}$ swaps rows $i$ and $j$; (2) $M_i(k)$ scales row $i$ by $k$; (3) $E_{ij}(c)$ adds $c$ times row $j$ to row $i$ (placing $c$ in row $i$, column $j$ of the identity matrix). For example, $R_1 + 2R_3 \\to R_1$ is the identity with $2$ in position $(1, 3)$.\n\n> **Watch out.** For $R_i + cR_j \\to R_i$ the multiplier goes in row $i$ (the row that changes) and column $j$ (the row that is added), not in position $(j, i)$.",
        "三阶初等矩阵左乘任何 3 行矩阵时均执行对应的初等行变换：(1) 对调矩阵 $P_{ij}$ 交换第 $i$ 行与第 $j$ 行；(2) 倍乘矩阵 $M_i(k)$ 将第 $i$ 行乘以 $k$；(3) 倍加矩阵 $E_{ij}(c)$ 将第 $j$ 行的 $c$ 倍加到第 $i$ 行（即在单位矩阵的第 $i$ 行第 $j$ 列填入 $c$）。例如 $R_1 + 2R_3 \\to R_1$ 就是在 $(1, 3)$ 位置放上 $2$ 的单位矩阵。\n\n> **注意。** 对 $R_i + cR_j \\to R_i$，乘数放在第 $i$ 行（被改变的行）第 $j$ 列（被加上的行），而不是 $(j, i)$ 位置。",
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
        const opStr = replacement(targetRow, -c, sourceRow);

        const I3: Mat = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ];
        const put = (i0: number, j0: number, v: number): Mat =>
          I3.map((row, i) => row.map((val, j) => (i === i0 - 1 && j === j0 - 1 ? v : val)));
        const correctMat = put(targetRow, sourceRow, c);
        const wrongTrans = put(sourceRow, targetRow, c);
        const wrongNeg = put(targetRow, sourceRow, -c);
        const wrongSwap: Mat = [
          [0, 1, 0],
          [1, 0, 0],
          [0, 0, 1],
        ];
        const show = (m: Mat) => t(`$$${matLatex(m)}$$`, `$$${matLatex(m)}$$`);

        const prompt = t(
          `Which $3 \\times 3$ elementary matrix $E$ performs the row operation $${opStr}$?`,
          `哪一个 $3 \\times 3$ 初等矩阵 $E$ 对应初等行变换 $${opStr}$？`,
        );

        return reasoned(
          oneOf(
            rng,
            prompt,
            show(correctMat),
            [show(wrongTrans), show(wrongNeg), show(wrongSwap)],
            walked(
              [
                [
                  ["Apply the operation to $I_3$", "对 $I_3$ 做这一变换"],
                  t(
                    `Row ${targetRow} of $I_3$ is the unit row with $1$ in column ${targetRow}. Adding $${c}$ times row ${sourceRow} puts $${c}$ in column ${sourceRow}; the other rows stay.`,
                    `$I_3$ 的第 ${targetRow} 行是第 ${targetRow} 列为 $1$ 的单位行。加上第 ${sourceRow} 行的 $${c}$ 倍，就在第 ${sourceRow} 列放上 $${c}$；其余各行不变。`,
                  ),
                ],
                [["Write the matrix", "写出矩阵"], t("", ""), [`E = ${matLatex(correctMat)}`]],
              ],
              t(
                `Row ${targetRow} of $E$ times a column $(x_1, x_2, x_3)$ gives $${poly([1, `x_${targetRow}`], [c, `x_${sourceRow}`])}$, which is what $${opStr}$ does.`,
                `$E$ 的第 ${targetRow} 行乘列向量 $(x_1, x_2, x_3)$ 得 $${poly([1, `x_${targetRow}`], [c, `x_${sourceRow}`])}$，正是 $${opStr}$ 的作用。`,
              ),
            ),
          ),
          [
            [
              `$$${matLatex(wrongTrans)}$$`,
              `The multiplier is in position $(${sourceRow}, ${targetRow})$: this matrix adds $${c}$ times row ${targetRow} to row ${sourceRow}.`,
              `乘数放在了 $(${sourceRow}, ${targetRow})$ 位置：这个矩阵是把第 ${targetRow} 行的 $${c}$ 倍加到第 ${sourceRow} 行。`,
            ],
            [
              `$$${matLatex(wrongNeg)}$$`,
              "The sign is flipped: this is the matrix of the reverse operation, the inverse of $E$.",
              "符号反了：这是逆变换的矩阵，即 $E$ 的逆。",
            ],
            [
              `$$${matLatex(wrongSwap)}$$`,
              "That swaps rows 1 and 2. A replacement keeps every diagonal entry of the identity equal to $1$.",
              "这是交换第 1、2 行的矩阵。倍加矩阵保持单位矩阵的对角元素全为 $1$。",
            ],
          ],
        );
      },
    },
    {
      id: "the-determinant-of-an-elementary-3x3-matrix",
      title: t("The determinant of an elementary 3×3 matrix", "3×3 初等矩阵的行列式"),
      explanation: t(
        "An elementary matrix is the identity with one row operation applied, so its determinant records the effect of that operation. A replacement matrix is triangular with ones on the diagonal and has determinant $1$. A scaling matrix has determinant $k$. A swap matrix has determinant $-1$. Then $\\det(EA) = \\det E \\cdot \\det A$ for every $A$. For example, the matrix that multiplies row $3$ by $-2$ has determinant $-2$.\n\n> **Watch out.** A swap matrix has zeros on its diagonal but is not triangular, so its determinant is $-1$, not $0$.",
        "初等矩阵是对单位矩阵做一次行变换得到的，所以其行列式记录了该变换的效果。倍加矩阵是对角线全为 $1$ 的三角矩阵，行列式为 $1$。数乘矩阵行列式为 $k$。交换矩阵行列式为 $-1$。于是对任意 $A$ 有 $\\det(EA) = \\det E \\cdot \\det A$。例如把第 $3$ 行乘以 $-2$ 的矩阵，行列式为 $-2$。\n\n> **注意。** 交换矩阵的对角线上有零，但它不是三角矩阵，所以行列式是 $-1$，而不是 $0$。",
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
        const mistakes = [
          [
            why(
              k,
              `The off-diagonal $${k}$ does not enter: the matrix is triangular, so the determinant is the product of its diagonal $1$s.`,
              `非对角元素 $${k}$ 不起作用：矩阵是三角矩阵，行列式是对角线上各个 $1$ 的乘积。`,
            ),
            why(
              0,
              "A triangular matrix has the product of its diagonal as determinant, and every diagonal entry is $1$.",
              "三角矩阵的行列式是对角元素之积，而对角元素都是 $1$。",
            ),
            why(-1, "Only a swap changes the sign; adding a multiple of a row does not.", "只有交换才改变符号；倍加不会。"),
          ],
          [
            why(
              1,
              `The diagonal holds $${k}$, and the determinant of a diagonal matrix is the product of its diagonal.`,
              `对角线上有 $${k}$，对角矩阵的行列式是对角元素之积。`,
            ),
            why(Q.of(1, k), "That is the determinant of $E^{-1}$, which undoes the scaling.", "这是 $E^{-1}$ 的行列式，它撤销了数乘。"),
            why(
              -k,
              "Scaling a row by $k$ multiplies the determinant by $k$; no sign change comes with it.",
              "某行乘以 $k$ 使行列式乘以 $k$；不会附带改变符号。",
            ),
          ],
          [
            why(1, "Swapping two rows of $I$ reverses the sign of $\\det I = 1$.", "交换 $I$ 的两行使 $\\det I = 1$ 变号。"),
            why(
              0,
              "The diagonal has zeros, but the matrix is not triangular, so the determinant is not the product of the diagonal.",
              "对角线上有零，但矩阵不是三角矩阵，所以行列式不是对角元素之积。",
            ),
          ],
        ][kind]!;
        return numberProblem({
          prompt: t(`Find $\\det E$ for the elementary matrix $E = ${matLatex(E)}$.`, `求初等矩阵 $E = ${matLatex(E)}$ 的 $\\det E$。`),
          answer: ans,
          mistakes: mistakes.filter(
            (w, n, all) => !asQ(w.value).eq(Q.of(ans)) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === n,
          ),
          solution: walked(
            [
              [
                ["Name the operation", "说出这一变换"],
                [
                  t(`$E$ adds $${k}$ times row ${j + 1} to row ${i + 1}.`, `$E$ 把第 ${j + 1} 行的 $${k}$ 倍加到第 ${i + 1} 行。`),
                  t(`$E$ multiplies row ${i + 1} by $${k}$.`, `$E$ 把第 ${i + 1} 行乘以 $${k}$。`),
                  t(
                    `$E$ swaps rows ${Math.min(i, j) + 1} and ${Math.max(i, j) + 1}.`,
                    `$E$ 交换第 ${Math.min(i, j) + 1} 行与第 ${Math.max(i, j) + 1} 行。`,
                  ),
                ][kind]!,
              ],
              [
                ["Read off the determinant", "读出行列式"],
                [
                  t(
                    `A replacement leaves the determinant of $I$ unchanged, so $\\det E = 1$.`,
                    `倍加不改变 $I$ 的行列式，所以 $\\det E = 1$。`,
                  ),
                  t(
                    `Scaling a row multiplies the determinant by $${k}$, so $\\det E = ${k}$.`,
                    `某行乘以 $${k}$ 使行列式乘以 $${k}$，所以 $\\det E = ${k}$。`,
                  ),
                  t("A swap reverses the sign, so $\\det E = -1$.", "交换使行列式变号，所以 $\\det E = -1$。"),
                ][kind]!,
              ],
            ],
            t(`Expanding along row $1$: $${expansion3(E)}$.`, `按第 $1$ 行展开：$${expansion3(E)}$。`),
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
  intro: t(
    "Clearing column $1$ with $R_2 - 2R_1 \\to R_2$ and then $R_3 + R_1 \\to R_3$ multiplies by $E_1$ and then by $E_2$. The single matrix doing both is\n\n$$E_2E_1 = \\begin{pmatrix} 1 & 0 & 0 \\\\ -2 & 1 & 0 \\\\ 1 & 0 & 1 \\end{pmatrix},$$\n\nwith each multiplier in its own place.\n\nCheck: $E_2E_1$ times the column $(1, 2, -1)$ is $(1, 2 - 2, -1 + 1) = (1, 0, 0)$, so column $1$ is cleared.\n\nIn this lesson we write a sequence of row operations as one product of elementary matrices and undo it with the inverse product.",
    "先用 $R_2 - 2R_1 \\to R_2$、再用 $R_3 + R_1 \\to R_3$ 消去第 $1$ 列，就是先乘 $E_1$ 再乘 $E_2$。同时完成两步的矩阵是\n\n$$E_2E_1 = \\begin{pmatrix} 1 & 0 & 0 \\\\ -2 & 1 & 0 \\\\ 1 & 0 & 1 \\end{pmatrix}$$\n\n每个乘数各在自己的位置上。\n\n检验：$E_2E_1$ 乘列向量 $(1, 2, -1)$ 得 $(1, 2 - 2, -1 + 1) = (1, 0, 0)$，第 $1$ 列被消去了。\n\n本课我们把一串行变换写成初等矩阵的乘积，并用逆矩阵的乘积撤销它。",
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
        "When successive elementary row operations $op_1, op_2, \\dots, op_k$ are applied to matrix $A$, the resulting matrix is $R = E_k \\cdots E_2 E_1 A$, where each $E_i$ is the elementary matrix for $op_i$. Note that the matrices are multiplied on the left in the exact chronological order of the operations. For example, $R_2 + 3R_1 \\to R_2$ followed by $R_3 - R_1 \\to R_3$ is $E_2E_1$ with $3$ at $(2, 1)$ and $-1$ at $(3, 1)$.\n\n> **Watch out.** The multipliers keep the signs of the operations as written; flipping them gives the inverse, which undoes the operations instead.",
        "当对矩阵 $A$ 依次实施初等行变换 $op_1, op_2, \\dots, op_k$ 时，最终得到的矩阵为 $R = E_k \\cdots E_2 E_1 A$，其中每个 $E_i$ 为对应 $op_i$ 的初等矩阵。请注意初等矩阵是按施加顺序从右向左依次在左侧相乘。例如先 $R_2 + 3R_1 \\to R_2$ 再 $R_3 - R_1 \\to R_3$，对应 $E_2E_1$，其 $(2, 1)$ 元素为 $3$，$(3, 1)$ 元素为 $-1$。\n\n> **注意。** 乘数保持变换中写出的符号；把符号取反得到的是逆矩阵，它撤销这些变换。",
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
        const E2E1: Mat = [
          [1, 0, 0],
          [c1, 1, 0],
          [c2, 0, 1],
        ];
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
        const show = (m: Mat) => t(`$$${matLatex(m)}$$`, `$$${matLatex(m)}$$`);

        const prompt = t(
          `Let $E_1$ represent the row operation $${rowOp(2, c1)} \\to R_2$ and $E_2$ represent $${rowOp(3, c2)} \\to R_3$. What single matrix $M = E_2 E_1$ performs both operations simultaneously on any $3 \\times 3$ matrix $A$?`,
          `设 $E_1$ 表示行变换 $${rowOp(2, c1)} \\to R_2$，$E_2$ 表示行变换 $${rowOp(3, c2)} \\to R_3$。对任意 $3 \\times 3$ 矩阵 $A$，能够同时执行这两个行变换的矩阵乘积 $M = E_2 E_1$ 是哪一个？`,
        );

        return reasoned(
          oneOf(
            rng,
            prompt,
            show(E2E1),
            [show(wrongProduct1), show(wrongProduct2), show(wrongProduct3)],
            walked(
              [
                [
                  ["Write each elementary matrix", "写出每个初等矩阵"],
                  t("Each multiplier goes in the row that changes, column 1:", "每个乘数放在被改变的行、第 1 列："),
                  [`E_1 = ${matLatex(E1)}, \\quad E_2 = ${matLatex(E2)}`],
                ],
                [
                  ["Multiply", "相乘"],
                  t(
                    `$E_2$ adds $${c2}$ times row 1 of $E_1$, which is $(1, 0, 0)$, to row 3 of $E_1$, which is $(0, 0, 1)$:`,
                    `$E_2$ 把 $E_1$ 的第 1 行 $(1, 0, 0)$ 的 $${c2}$ 倍加到 $E_1$ 的第 3 行 $(0, 0, 1)$ 上：`,
                  ),
                  [`M = E_2E_1 = ${matLatex(E2E1)}`],
                ],
              ],
              t(
                `$M$ should clear column 1 of a matrix whose first column is $(1, ${-c1}, ${-c2})$: $${matLatex(E2E1)}${colVecLatex([1, -c1, -c2])} = ${colVecLatex([1, 0, 0])}$, since $${c1} + ${paren(-c1)} = 0$ and $${c2} + ${paren(-c2)} = 0$.`,
                `$M$ 应消去首列为 $(1, ${-c1}, ${-c2})$ 的矩阵的第 1 列：$${matLatex(E2E1)}${colVecLatex([1, -c1, -c2])} = ${colVecLatex([1, 0, 0])}$，因为 $${c1} + ${paren(-c1)} = 0$，$${c2} + ${paren(-c2)} = 0$。`,
              ),
            ),
          ),
          [
            [
              `$$${matLatex(wrongProduct1)}$$`,
              "The signs are flipped: that is $(E_2E_1)^{-1}$, which undoes both operations.",
              "符号反了：这是 $(E_2E_1)^{-1}$，它撤销这两个变换。",
            ],
            [
              `$$${matLatex(wrongProduct2)}$$`,
              "The multipliers are above the diagonal, so this adds multiples of rows 2 and 3 to row 1.",
              "乘数放在了对角线上方，这是把第 2、3 行的倍数加到第 1 行。",
            ],
            [`$$${matLatex(wrongProduct3)}$$`, "The identity performs no operation at all.", "单位矩阵什么变换也不做。"],
          ],
        );
      },
    },
    {
      id: "inverting-a-product-of-elimination-matrices",
      title: t("Inverting a product of elimination matrices", "求消元矩阵乘积的逆"),
      explanation: t(
        "Clearing column $1$ with $R_2 - aR_1 \\to R_2$ and $R_3 - bR_1 \\to R_3$ is multiplication by $E = \\begin{pmatrix} 1 & 0 & 0 \\\\ -a & 1 & 0 \\\\ -b & 0 & 1 \\end{pmatrix}$. Its inverse undoes both operations by adding the multiples back:\n\n$$E^{-1} = \\begin{pmatrix} 1 & 0 & 0 \\\\ a & 1 & 0 \\\\ b & 0 & 1 \\end{pmatrix}.$$\n\nThe multipliers appear with their signs flipped, which is exactly how $L$ is built in an $LU$ factorization. For $R_2 - 4R_1$ and $R_3 + 2R_1$, the inverse has $4$ at $(2, 1)$ and $-2$ at $(3, 1)$.\n\n> **Watch out.** The entries of $E^{-1}$ are the multipliers $a, b$ themselves; the entries of $E$ are their negatives.",
        "用 $R_2 - aR_1 \\to R_2$ 和 $R_3 - bR_1 \\to R_3$ 消去第 $1$ 列，相当于乘以 $E = \\begin{pmatrix} 1 & 0 & 0 \\\\ -a & 1 & 0 \\\\ -b & 0 & 1 \\end{pmatrix}$。其逆通过把倍数加回来撤销这两步：\n\n$$E^{-1} = \\begin{pmatrix} 1 & 0 & 0 \\\\ a & 1 & 0 \\\\ b & 0 & 1 \\end{pmatrix}$$\n\n乘数以相反的符号出现，这正是 $LU$ 分解中构造 $L$ 的方式。对 $R_2 - 4R_1$ 与 $R_3 + 2R_1$，逆矩阵的 $(2, 1)$ 元素为 $4$，$(3, 1)$ 元素为 $-2$。\n\n> **注意。** $E^{-1}$ 的元素就是乘数 $a, b$ 本身；$E$ 的元素才是它们的相反数。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-6, 6);
        const row = rng.int(2, 3);
        const ans = row === 2 ? a : b;
        const other = row === 2 ? b : a;
        const kl = (v: number) => (v < 0 ? `+ ${v === -1 ? "" : -v}` : `- ${v === 1 ? "" : v}`);
        const E = [
          [1, 0, 0],
          [-a, 1, 0],
          [-b, 0, 1],
        ];
        const Einv = [
          [1, 0, 0],
          [a, 1, 0],
          [b, 0, 1],
        ];
        return numberProblem({
          prompt: t(
            `$E$ performs $R_2 ${kl(a)}R_1 \\to R_2$ and $R_3 ${kl(b)}R_1 \\to R_3$. Find the $(${row}, 1)$ entry of $E^{-1}$.`,
            `$E$ 完成 $R_2 ${kl(a)}R_1 \\to R_2$ 和 $R_3 ${kl(b)}R_1 \\to R_3$。求 $E^{-1}$ 的 $(${row}, 1)$ 元素。`,
          ),
          answer: ans,
          mistakes: [
            why(
              -ans,
              "That is the entry of $E$ itself; the inverse adds the multiple back, so the sign flips.",
              "这是 $E$ 本身的元素；逆矩阵把倍数加回来，所以符号相反。",
            ),
            why(other, `That multiplier belongs to row ${5 - row}, not row ${row}.`, `这个乘数属于第 ${5 - row} 行，而不是第 ${row} 行。`),
            why(
              -other,
              `That is the entry of $E$ in row ${5 - row}; read row ${row} of $E^{-1}$.`,
              `这是 $E$ 第 ${5 - row} 行的元素；要读 $E^{-1}$ 的第 ${row} 行。`,
            ),
            why(
              1,
              "Only the diagonal entries are $1$; the $(r, 1)$ entry below it carries a multiplier.",
              "只有对角元素是 $1$；对角线下方的 $(r, 1)$ 元素是乘数。",
            ),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Write $E$", "写出 $E$"],
                t("Each operation puts the negative of its multiplier below the pivot:", "每个变换在主元下方放上其乘数的相反数："),
                [`E = ${matLatex(E)}`],
              ],
              [
                ["Undo the operations", "撤销这些变换"],
                t("$E^{-1}$ adds the multiples back, so the signs flip:", "$E^{-1}$ 把倍数加回来，所以符号取反："),
                [`E^{-1} = ${matLatex(Einv)}`],
              ],
            ],
            t(
              `Row ${row} of $E$ times column 1 of $E^{-1}$ is $${paren(-ans)} \\cdot 1 + 1 \\cdot ${paren(ans)} = 0$, the $(${row}, 1)$ entry of $I$.`,
              `$E$ 的第 ${row} 行乘 $E^{-1}$ 的第 1 列为 $${paren(-ans)} \\cdot 1 + 1 \\cdot ${paren(ans)} = 0$，正是 $I$ 的 $(${row}, 1)$ 元素。`,
            ),
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
  intro: t(
    "For $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 6 \\end{pmatrix}$, $\\det A = 1 \\cdot 6 - 2 \\cdot 3 = 0$, so $A$ is not invertible and $A\\mathbf{x} = \\mathbf{0}$ has a nonzero solution, $\\mathbf{x} = (2, -1)$. Changing the $6$ to $7$ gives $\\det A = 1 \\ne 0$, and then $\\mathbf{x} = \\mathbf{0}$ is the only solution.\n\nCheck: $1 \\cdot 2 + 2 \\cdot (-1) = 0$ and $3 \\cdot 2 + 6 \\cdot (-1) = 0$.\n\nIn this lesson we link the determinant, invertibility and the number of solutions of $2 \\times 2$ systems.",
    "对 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 6 \\end{pmatrix}$，$\\det A = 1 \\cdot 6 - 2 \\cdot 3 = 0$，所以 $A$ 不可逆，$A\\mathbf{x} = \\mathbf{0}$ 有非零解 $\\mathbf{x} = (2, -1)$。把 $6$ 改成 $7$，$\\det A = 1 \\ne 0$，这时 $\\mathbf{x} = \\mathbf{0}$ 是唯一解。\n\n检验：$1 \\cdot 2 + 2 \\cdot (-1) = 0$，$3 \\cdot 2 + 6 \\cdot (-1) = 0$。\n\n本课我们把行列式、可逆性与 $2 \\times 2$ 方程组解的个数联系起来。",
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
        "For a $2 \\times 2$ square matrix $A$, the following statements are logically equivalent: (1) $A$ is invertible ($A^{-1}$ exists); (2) $\\det(A) \\ne 0$; (3) The homogeneous system $A\\mathbf{x} = \\mathbf{0}$ has only the trivial solution $\\mathbf{x} = \\mathbf{0}$; (4) The reduced row echelon form of $A$ is the identity matrix $I_2$; (5) The linear system $A\\mathbf{x} = \\mathbf{b}$ has a unique solution for every $\\mathbf{b}$. For example, $\\begin{pmatrix} 2 & 1 \\\\ 4 & 2 \\end{pmatrix}$ has determinant $0$, so $A\\mathbf{x} = \\mathbf{0}$ has nonzero solutions such as $(1, -2)$.\n\n> **Watch out.** $A\\mathbf{x} = \\mathbf{0}$ always has the solution $\\mathbf{x} = \\mathbf{0}$, so it is never without solutions; the question is only whether there are others.",
        "对于二阶方阵 $A$，下列命题在逻辑上相互等价：(1) $A$ 是可逆矩阵（$A^{-1}$ 存在）；(2) $\\det(A) \\ne 0$；(3) 齐次方程组 $A\\mathbf{x} = \\mathbf{0}$ 仅有零解 $\\mathbf{x} = \\mathbf{0}$；(4) $A$ 的简化行阶梯形为二阶单位矩阵 $I_2$；(5) 对任意向量 $\\mathbf{b}$，方程组 $A\\mathbf{x} = \\mathbf{b}$ 均有唯一解。例如 $\\begin{pmatrix} 2 & 1 \\\\ 4 & 2 \\end{pmatrix}$ 的行列式为 $0$，所以 $A\\mathbf{x} = \\mathbf{0}$ 有非零解，如 $(1, -2)$。\n\n> **注意。** $A\\mathbf{x} = \\mathbf{0}$ 总有解 $\\mathbf{x} = \\mathbf{0}$，所以不可能无解；问题只在于是否还有别的解。",
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

        const trivial = t("Only the trivial solution $\\mathbf{x} = \\mathbf{0}$", "仅有平凡零解 $\\mathbf{x} = \\mathbf{0}$");
        const many = t("Infinitely many non-trivial solutions", "有无穷多非零解");
        const none = t("No solution at all", "完全无解");
        const two = t("Exactly two distinct solutions $\\mathbf{x}_1, \\mathbf{x}_2$", "恰好有两个不同的解 $\\mathbf{x}_1, \\mathbf{x}_2$");
        const det = `\\det A = ${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${detA}`;

        return reasoned(
          oneOf(
            rng,
            prompt,
            isInvertible ? trivial : many,
            [isInvertible ? many : trivial, none, two],
            walked(
              [
                [["Compute the determinant", "计算行列式"], t("", ""), [det]],
                [
                  ["Apply the theorem", "应用定理"],
                  isInvertible
                    ? t(
                        `$${detA} \\ne 0$, so $A$ is invertible and $\\mathbf{x} = A^{-1}\\mathbf{0} = \\mathbf{0}$ is the only solution.`,
                        `$${detA} \\ne 0$，所以 $A$ 可逆，$\\mathbf{x} = A^{-1}\\mathbf{0} = \\mathbf{0}$ 是唯一解。`,
                      )
                    : t(
                        "The determinant is $0$, so $A$ is singular: elimination leaves a free variable, and every value of it gives a solution.",
                        "行列式为 $0$，所以 $A$ 奇异：消元后留下一个自由变量，它的每个取值都给出一个解。",
                      ),
                ],
              ],
              isInvertible
                ? t(
                    `Reducing $A$ gives $I_2$: the first column has the pivot $${a}$, and after clearing below it the second pivot is $\\frac{${detA}}{${a}} = ${Q.of(detA, a).toLatex()} \\ne 0$.`,
                    `化简 $A$ 得 $I_2$：第一列主元为 $${a}$，消去其下方后第二个主元为 $\\frac{${detA}}{${a}} = ${Q.of(detA, a).toLatex()} \\ne 0$。`,
                  )
                : t(
                    `$\\mathbf{x} = (${b}, ${-a})$ is a nonzero solution: $${a} \\cdot ${paren(b)} + ${paren(b)} \\cdot ${paren(-a)} = 0$ and $${c} \\cdot ${paren(b)} + ${paren(d)} \\cdot ${paren(-a)} = 0$.`,
                    `$\\mathbf{x} = (${b}, ${-a})$ 是非零解：$${a} \\cdot ${paren(b)} + ${paren(b)} \\cdot ${paren(-a)} = 0$，$${c} \\cdot ${paren(b)} + ${paren(d)} \\cdot ${paren(-a)} = 0$。`,
                  ),
            ),
          ),
          [
            [
              trivial.en,
              "The determinant is $0$, so $A$ is not invertible, and then $A\\mathbf{x} = \\mathbf{0}$ has solutions other than $\\mathbf{0}$.",
              "行列式为 $0$，所以 $A$ 不可逆，于是 $A\\mathbf{x} = \\mathbf{0}$ 有 $\\mathbf{0}$ 以外的解。",
            ],
            [
              many.en,
              "The determinant is nonzero, so $A$ is invertible and $\\mathbf{x} = A^{-1}\\mathbf{0} = \\mathbf{0}$ is forced.",
              "行列式不为零，所以 $A$ 可逆，必有 $\\mathbf{x} = A^{-1}\\mathbf{0} = \\mathbf{0}$。",
            ],
            [
              none.en,
              "$\\mathbf{x} = \\mathbf{0}$ always solves a homogeneous system.",
              "$\\mathbf{x} = \\mathbf{0}$ 总是齐次方程组的解。",
            ],
            [
              two.en,
              "If $\\mathbf{x}$ solves $A\\mathbf{x} = \\mathbf{0}$, so does every multiple $t\\mathbf{x}$, so there are never exactly two solutions.",
              "若 $\\mathbf{x}$ 满足 $A\\mathbf{x} = \\mathbf{0}$，则它的每个倍数 $t\\mathbf{x}$ 也满足，所以不可能恰有两个解。",
            ],
          ],
        );
      },
    },
    {
      id: "does-every-right-hand-side-give-a-unique-solution",
      title: t("Does every right-hand side give a unique solution?", "每个右端项都有唯一解吗？"),
      explanation: t(
        "By the Invertible Matrix Theorem, for a square matrix $A$ the following are equivalent: $\\det A \\ne 0$, $A$ is invertible, and $A\\mathbf{x} = \\mathbf{b}$ has exactly one solution for every $\\mathbf{b}$. So a single determinant decides the question for all right-hand sides at once. If $\\det A = 0$, some $\\mathbf{b}$ give no solution and the others give infinitely many. For $x + 2y = b_1$, $2x + 4y = b_2$, $\\det A = 4 - 4 = 0$, so the answer is no.\n\n> **Watch out.** A singular system can still be solvable for some $\\mathbf{b}$, but then it has infinitely many solutions, never exactly one.",
        "由可逆矩阵定理，对方阵 $A$ 以下各条等价：$\\det A \\ne 0$；$A$ 可逆；对每个 $\\mathbf{b}$，$A\\mathbf{x} = \\mathbf{b}$ 恰有一个解。所以一个行列式就能同时判定所有右端项的情形。若 $\\det A = 0$，则某些 $\\mathbf{b}$ 无解，其余的有无穷多解。对 $x + 2y = b_1$，$2x + 4y = b_2$，$\\det A = 4 - 4 = 0$，所以答案是否。\n\n> **注意。** 奇异方程组对某些 $\\mathbf{b}$ 仍可能有解，但那时有无穷多解，绝不会恰有一个。",
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
        const A = [
          [a, b],
          [c, d],
        ];
        const adj = [
          [d, -b],
          [-c, a],
        ];
        return reasoned(
          oneOf(
            rng,
            t(
              `Does $\\begin{cases} ${formatLinear2(a, b)} = b_1 \\\\ ${formatLinear2(c, d)} = b_2 \\end{cases}$ have exactly one solution for every choice of $b_1$ and $b_2$?`,
              `对任意 $b_1$、$b_2$，$\\begin{cases} ${formatLinear2(a, b)} = b_1 \\\\ ${formatLinear2(c, d)} = b_2 \\end{cases}$ 都恰有一个解吗？`,
            ),
            right,
            [wrong],
            walked(
              [
                [
                  ["Compute the determinant", "计算行列式"],
                  t(`The coefficient matrix is $A = ${matLatex(A)}$:`, `系数矩阵为 $A = ${matLatex(A)}$：`),
                  [`\\det A = ${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}`],
                ],
                [
                  ["Apply the theorem", "应用定理"],
                  det !== 0
                    ? t(
                        "The determinant is nonzero, so $A$ is invertible and every system has the unique solution $A^{-1}\\mathbf{b}$.",
                        "行列式不为零，所以 $A$ 可逆，每个方程组都有唯一解 $A^{-1}\\mathbf{b}$。",
                      )
                    : t(
                        "The determinant is $0$, so $A$ is singular and no right-hand side gives a unique solution.",
                        "行列式为 $0$，所以 $A$ 奇异，没有哪个右端项给出唯一解。",
                      ),
                ],
              ],
              det !== 0
                ? t(
                    `$${matLatex(A)}${matLatex(adj)} = ${matLatex([
                      [det, 0],
                      [0, det],
                    ])}$, so dividing the second matrix by $${det}$ gives $A^{-1}$.`,
                    `$${matLatex(A)}${matLatex(adj)} = ${matLatex([
                      [det, 0],
                      [0, det],
                    ])}$，所以第二个矩阵除以 $${det}$ 就是 $A^{-1}$。`,
                  )
                : t(
                    `The left side of the second equation is $${m}$ times the first. With $b_1 = 1$ and $b_2 = 0$ it would need $0 = ${m}$, so that system has no solution at all.`,
                    `第二个方程的左边是第一个的 $${m}$ 倍。取 $b_1 = 1$，$b_2 = 0$ 时需要 $0 = ${m}$，所以这个方程组根本无解。`,
                  ),
            ),
          ),
          [
            [
              "Yes",
              "The determinant is $0$, so $A$ is singular: some right-hand sides give no solution and the others infinitely many.",
              "行列式为 $0$，所以 $A$ 奇异：某些右端项无解，其余的有无穷多解。",
            ],
            [
              "No",
              "The determinant is nonzero, so $A$ is invertible and $\\mathbf{x} = A^{-1}\\mathbf{b}$ is the one solution for every $\\mathbf{b}$.",
              "行列式不为零，所以 $A$ 可逆，对每个 $\\mathbf{b}$，$\\mathbf{x} = A^{-1}\\mathbf{b}$ 都是唯一解。",
            ],
          ],
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
  intro: t(
    "To invert $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 7 \\end{pmatrix}$, reduce $[A \\mid I]$. $R_2 - 3R_1 \\to R_2$ gives $\\left[\\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\\\ 0 & 1 & -3 & 1 \\end{array}\\right]$, and $R_1 - 2R_2 \\to R_1$ gives $\\left[\\begin{array}{cc|cc} 1 & 0 & 7 & -2 \\\\ 0 & 1 & -3 & 1 \\end{array}\\right]$. So $A^{-1} = \\begin{pmatrix} 7 & -2 \\\\ -3 & 1 \\end{pmatrix}$.\n\nCheck: the rows of $AA^{-1}$ are $(7 - 6, -2 + 2) = (1, 0)$ and $(21 - 21, -6 + 7) = (0, 1)$.\n\nIn this lesson we find $2 \\times 2$ inverses by reducing $[A \\mid I]$ to $[I \\mid A^{-1}]$ and read single entries of the result.",
    "求 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 7 \\end{pmatrix}$ 的逆，化简 $[A \\mid I]$。$R_2 - 3R_1 \\to R_2$ 得 $\\left[\\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\\\ 0 & 1 & -3 & 1 \\end{array}\\right]$，$R_1 - 2R_2 \\to R_1$ 得 $\\left[\\begin{array}{cc|cc} 1 & 0 & 7 & -2 \\\\ 0 & 1 & -3 & 1 \\end{array}\\right]$。所以 $A^{-1} = \\begin{pmatrix} 7 & -2 \\\\ -3 & 1 \\end{pmatrix}$。\n\n检验：$AA^{-1}$ 的两行为 $(7 - 6, -2 + 2) = (1, 0)$ 和 $(21 - 21, -6 + 7) = (0, 1)$。\n\n本课我们把 $[A \\mid I]$ 化为 $[I \\mid A^{-1}]$ 来求 $2 \\times 2$ 逆矩阵，并读出结果中的单个元素。",
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
        "To find $A^{-1}$, form the augmented matrix $[A \\mid I_2]$. Apply row operations to transform the left block $A$ into $I_2$. The right block will simultaneously transform into $A^{-1}$: $[A \\mid I_2] \\to [I_2 \\mid A^{-1}]$. For $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ the result is $\\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$.\n\n> **Watch out.** Every row operation acts on the whole row of $[A \\mid I]$, both blocks at once; changing only the left block loses the inverse.",
        "求逆矩阵 $A^{-1}$ 时，构造增广矩阵 $[A \\mid I_2]$。通过初等行变换将左侧的 $A$ 化为单位矩阵 $I_2$，右侧的单位矩阵将随之同步转化为逆矩阵 $A^{-1}$：$[A \\mid I_2] \\to [I_2 \\mid A^{-1}]$。对 $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$，结果为 $\\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$。\n\n> **注意。** 每个行变换都作用于 $[A \\mid I]$ 的整行，两块同时变；只变左块就得不到逆矩阵。",
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
        const c = factors.length > 0 ? prod / b + 0 : a * d - 1;

        const A: Mat = [
          [a, b],
          [c, d],
        ];
        const detA = a * d - b * c; // detA is 1

        const invA: Mat = [
          [d, -b],
          [-c + 0, a],
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
        const show = (m: Mat) => t(`$$${matLatex(m)}$$`, `$$${matLatex(m)}$$`);

        const prompt = t(
          `Find the inverse $A^{-1}$ using Gauss-Jordan row elimination on $[A \\mid I_2]$:

$$A = ${matLatex(A)}$$`,
          `利用高斯-约当消元法对 $[A \\mid I_2]$ 实施初等行变换，求 $A$ 的逆矩阵 $A^{-1}$：

$$A = ${matLatex(A)}$$`,
        );

        return reasoned(
          oneOf(
            rng,
            prompt,
            show(invA),
            [show(wrong1), show(wrong2), show(wrong3)],
            walked(
              [
                [
                  ["Set up $[A \\mid I_2]$", "写出 $[A \\mid I_2]$"],
                  t("Place the identity beside $A$:", "把单位矩阵放在 $A$ 旁边："),
                  [`\\left[\\begin{array}{cc|cc} ${a} & ${b} & 1 & 0 \\\\ ${c} & ${d} & 0 & 1 \\end{array}\\right]`],
                ],
                [
                  ["Reduce the left block to $I_2$", "把左块化为 $I_2$"],
                  t(
                    `Eliminating and scaling the rows turns the left block into $I_2$; for every $2 \\times 2$ matrix the right block then ends as $\\frac{1}{\\det A}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$. Here $\\det A = ${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${detA}$:`,
                    `通过消元与数乘把左块化为 $I_2$；对任意 $2 \\times 2$ 矩阵，右块最终为 $\\frac{1}{\\det A}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$。这里 $\\det A = ${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${detA}$：`,
                  ),
                  [`A^{-1} = ${matLatex(invA)}`],
                ],
              ],
              t(
                `$${matLatex(A)}${matLatex(invA)} = ${matLatex([
                  [1, 0],
                  [0, 1],
                ])}$: for example, row 1 times column 1 is $${a} \\cdot ${paren(d)} + ${paren(b)} \\cdot ${paren(-c)} = 1$.`,
                `$${matLatex(A)}${matLatex(invA)} = ${matLatex([
                  [1, 0],
                  [0, 1],
                ])}$：例如第 1 行乘第 1 列为 $${a} \\cdot ${paren(d)} + ${paren(b)} \\cdot ${paren(-c)} = 1$。`,
              ),
            ),
          ),
          [
            [
              `$$${matLatex(wrong1)}$$`,
              "This is $A$ itself; $A \\cdot A$ is not the identity.",
              "这就是 $A$ 本身；$A \\cdot A$ 不是单位矩阵。",
            ],
            [
              `$$${matLatex(wrong2)}$$`,
              "Every sign is flipped: this is $-A^{-1}$, and its product with $A$ is $-I$.",
              "所有符号都反了：这是 $-A^{-1}$，它与 $A$ 的积是 $-I$。",
            ],
            [
              `$$${matLatex(wrong3)}$$`,
              "The diagonal entries are swapped, but the off-diagonal entries also need their signs changed.",
              "对角元素交换了，但非对角元素还要变号。",
            ],
          ],
        );
      },
    },
    {
      id: "an-off-diagonal-entry-of-a-2x2-inverse",
      title: t("An off-diagonal entry of a 2×2 inverse", "2×2 逆矩阵的非对角元素"),
      explanation: t(
        "Row reducing $[A \\mid I]$ for $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ always ends with\n\n$$A^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}.$$\n\nThe diagonal entries swap places, the off-diagonal entries change sign, and everything is divided by the determinant. Knowing the result lets you check each row reduction. For $\\begin{pmatrix} 2 & 3 \\\\ 1 & 4 \\end{pmatrix}$, $\\det = 5$ and the $(1, 2)$ entry of the inverse is $-\\frac{3}{5}$.\n\n> **Watch out.** The off-diagonal entries stay in place: the $(1, 2)$ entry of $A^{-1}$ comes from $b$, not $c$, and it is still divided by $\\det A$.",
        "对 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 把 $[A \\mid I]$ 作行化简，结果总是\n\n$$A^{-1} = \\frac{1}{ad - bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$\n\n对角元素互换位置，非对角元素变号，全部除以行列式。知道结果可以检验每一步行化简。对 $\\begin{pmatrix} 2 & 3 \\\\ 1 & 4 \\end{pmatrix}$，$\\det = 5$，逆矩阵的 $(1, 2)$ 元素为 $-\\frac{3}{5}$。\n\n> **注意。** 非对角元素位置不变：$A^{-1}$ 的 $(1, 2)$ 元素来自 $b$ 而不是 $c$，而且仍要除以 $\\det A$。",
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
        const where = top ? "1, 2" : "2, 1";
        const entry = top ? b : c;
        return numberProblem({
          prompt: t(
            `Find the $(${where})$ entry of $A^{-1}$ for $A = ${matLatex([
              [a, b],
              [c, d],
            ])}$.`,
            `求 $A = ${matLatex([
              [a, b],
              [c, d],
            ])}$ 的逆矩阵 $A^{-1}$ 的 $(${where})$ 元素。`,
          ),
          answer: ans,
          mistakes: [
            why(
              ans.neg(),
              "The off-diagonal entries change sign in the inverse; this keeps the original sign.",
              "逆矩阵中非对角元素要变号；这里保留了原来的符号。",
            ),
            why(
              Q.of(top ? -c : -b, det),
              `That is the other off-diagonal entry; the $(${where})$ entry comes from $${entry}$.`,
              `这是另一个非对角元素；$(${where})$ 元素来自 $${entry}$。`,
            ),
            why(Q.of(-entry), `The division by $\\det A = ${det}$ is missing.`, `漏了除以 $\\det A = ${det}$。`),
            why(
              Q.of(1, entry),
              "An inverse is not found entry by entry: the reciprocal of one entry is not an entry of $A^{-1}$.",
              "逆矩阵不能逐个元素求：某个元素的倒数不是 $A^{-1}$ 的元素。",
            ),
          ].filter((w, i, all) => !asQ(w.value).eq(ans) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i),
          solution: walked(
            [
              [
                ["Compute the determinant", "计算行列式"],
                t("", ""),
                [`\\det A = ${paren(a)} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det}`],
              ],
              [
                ["Read the entry from the formula", "由公式读出元素"],
                t(
                  `In $\\frac{1}{\\det A}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$ the $(${where})$ entry is $\\frac{${top ? "-b" : "-c"}}{\\det A}$:`,
                  `在 $\\frac{1}{\\det A}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$ 中，$(${where})$ 元素为 $\\frac{${top ? "-b" : "-c"}}{\\det A}$：`,
                ),
                [`\\frac{${-entry}}{${det}} = ${ans.toLatex()}`],
              ],
            ],
            top
              ? t(
                  `Row 1 of $A$ times column 2 of $A^{-1}$ must be $0$: $\\frac{1}{${det}}\\left(${paren(a)} \\cdot ${paren(-b)} + ${paren(b)} \\cdot ${paren(a)}\\right) = 0$.`,
                  `$A$ 的第 1 行乘 $A^{-1}$ 的第 2 列必须为 $0$：$\\frac{1}{${det}}\\left(${paren(a)} \\cdot ${paren(-b)} + ${paren(b)} \\cdot ${paren(a)}\\right) = 0$。`,
                )
              : t(
                  `Row 2 of $A$ times column 1 of $A^{-1}$ must be $0$: $\\frac{1}{${det}}\\left(${paren(c)} \\cdot ${paren(d)} + ${paren(d)} \\cdot ${paren(-c)}\\right) = 0$.`,
                  `$A$ 的第 2 行乘 $A^{-1}$ 的第 1 列必须为 $0$：$\\frac{1}{${det}}\\left(${paren(c)} \\cdot ${paren(d)} + ${paren(d)} \\cdot ${paren(-c)}\\right) = 0$。`,
                ),
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
  intro: t(
    "For $U = \\begin{pmatrix} 1 & 2 & 0 \\\\ 0 & 1 & 3 \\\\ 0 & 0 & 1 \\end{pmatrix}$, reduce $[U \\mid I_3]$ from the bottom up: $R_2 - 3R_3 \\to R_2$ makes row $2$ of the right block $(0, 1, -3)$, then $R_1 - 2R_2 \\to R_1$ makes row $1$ equal to $(1, 0, 0) - 2(0, 1, -3) = (1, -2, 6)$. So\n\n$$U^{-1} = \\begin{pmatrix} 1 & -2 & 6 \\\\ 0 & 1 & -3 \\\\ 0 & 0 & 1 \\end{pmatrix}.$$\n\nCheck: row $1$ of $U$ times column $3$ of $U^{-1}$ is $1 \\cdot 6 + 2 \\cdot (-3) + 0 \\cdot 1 = 0$, the $(1, 3)$ entry of $I$.\n\nIn this lesson we invert $3 \\times 3$ matrices by reducing $[A \\mid I_3]$ to $[I_3 \\mid A^{-1}]$.",
    "对 $U = \\begin{pmatrix} 1 & 2 & 0 \\\\ 0 & 1 & 3 \\\\ 0 & 0 & 1 \\end{pmatrix}$，自下而上化简 $[U \\mid I_3]$：$R_2 - 3R_3 \\to R_2$ 使右块第 $2$ 行为 $(0, 1, -3)$，再用 $R_1 - 2R_2 \\to R_1$ 使第 $1$ 行为 $(1, 0, 0) - 2(0, 1, -3) = (1, -2, 6)$。所以\n\n$$U^{-1} = \\begin{pmatrix} 1 & -2 & 6 \\\\ 0 & 1 & -3 \\\\ 0 & 0 & 1 \\end{pmatrix}$$\n\n检验：$U$ 的第 $1$ 行乘 $U^{-1}$ 的第 $3$ 列为 $1 \\cdot 6 + 2 \\cdot (-3) + 0 \\cdot 1 = 0$，正是 $I$ 的 $(1, 3)$ 元素。\n\n本课我们把 $[A \\mid I_3]$ 化为 $[I_3 \\mid A^{-1}]$ 来求 $3 \\times 3$ 逆矩阵。",
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
        "For an invertible $3 \\times 3$ matrix $A$, augment with the identity: $[A \\mid I_3]$. Use forward elimination to create an upper triangular block, scale diagonals to 1, and backward elimination to clear entries above each pivot: $[A \\mid I_3] \\to [I_3 \\mid A^{-1}]$. For a diagonal matrix such as $\\operatorname{diag}(2, 4, 5)$ only the scaling is needed, and the inverse is $\\operatorname{diag}(\\frac{1}{2}, \\frac{1}{4}, \\frac{1}{5})$.\n\n> **Watch out.** Negating the entries above the diagonal is not enough: clearing column $2$ after column $3$ also changes the corner of the right block.",
        "对于可逆的三阶方阵 $A$，将其与单位矩阵拼接成增广矩阵 $[A \\mid I_3]$。先通过前向消元将其化为上三角形式，将主对角线元素化为 1，再通过反向消元消去主元上方的全部非零元素：$[A \\mid I_3] \\to [I_3 \\mid A^{-1}]$。对角矩阵如 $\\operatorname{diag}(2, 4, 5)$ 只需数乘，其逆为 $\\operatorname{diag}(\\frac{1}{2}, \\frac{1}{4}, \\frac{1}{5})$。\n\n> **注意。** 只把对角线上方的元素变号是不够的：消去第 $3$ 列后再消第 $2$ 列，会改变右块的角元素。",
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
        const middle: Mat = [
          [1, 0, -u13],
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
        const show = (m: Mat) => t(`$$${matLatex(m)}$$`, `$$${matLatex(m)}$$`);

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
            show(invA),
            [show(wrong1), show(wrong2), show(wrong3)],
            walked(
              [
                [
                  ["Clear column 3", "消去第 3 列"],
                  t(
                    `$A$ is already upper triangular with $1$s on the diagonal. Apply $${replacement(2, u23, 3)}$ and $${replacement(1, u13, 3)}$ to both blocks; the right block becomes`,
                    `$A$ 已是对角线为 $1$ 的上三角矩阵。对两块同时做 $${replacement(2, u23, 3)}$ 和 $${replacement(1, u13, 3)}$；右块变为`,
                  ),
                  [matLatex(middle)],
                ],
                [
                  ["Clear column 2", "消去第 2 列"],
                  t(
                    `Apply $${replacement(1, u12, 2)}$. Row 1 of the right block becomes $(1, 0, ${-u13}) - ${paren(u12)}(0, 1, ${-u23})$:`,
                    `再做 $${replacement(1, u12, 2)}$。右块第 1 行变为 $(1, 0, ${-u13}) - ${paren(u12)}(0, 1, ${-u23})$：`,
                  ),
                  [`A^{-1} = ${matLatex(invA)}`],
                ],
              ],
              t(
                `Row 1 of $A$ times column 3 of $A^{-1}$ is $1 \\cdot ${paren(u12 * u23 - u13)} + ${paren(u12)} \\cdot ${paren(-u23)} + ${paren(u13)} \\cdot 1 = 0$, the $(1, 3)$ entry of $I_3$.`,
                `$A$ 的第 1 行乘 $A^{-1}$ 的第 3 列为 $1 \\cdot ${paren(u12 * u23 - u13)} + ${paren(u12)} \\cdot ${paren(-u23)} + ${paren(u13)} \\cdot 1 = 0$，正是 $I_3$ 的 $(1, 3)$ 元素。`,
              ),
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
        "For $U = \\begin{pmatrix} 1 & a & b \\\\ 0 & 1 & c \\\\ 0 & 0 & 1 \\end{pmatrix}$, row reducing $[U \\mid I]$ from the bottom up clears column $3$ with $R_2 - cR_3$ and $R_1 - bR_3$, then column $2$ with $R_1 - aR_2$. The result is\n\n$$U^{-1} = \\begin{pmatrix} 1 & -a & ac - b \\\\ 0 & 1 & -c \\\\ 0 & 0 & 1 \\end{pmatrix}.$$\n\nThe corner entry is not simply $-b$, because clearing column $2$ also changes column $3$ of the right block. With $a = 2$, $b = 1$, $c = 3$ the corner is $2 \\cdot 3 - 1 = 5$.\n\n> **Watch out.** The step $R_1 - aR_2$ subtracts $a$ times the $-c$ already in row $2$, which adds $ac$; forgetting it leaves $-b$.",
        "对 $U = \\begin{pmatrix} 1 & a & b \\\\ 0 & 1 & c \\\\ 0 & 0 & 1 \\end{pmatrix}$，自下而上化简 $[U \\mid I]$：先用 $R_2 - cR_3$ 和 $R_1 - bR_3$ 消去第 $3$ 列，再用 $R_1 - aR_2$ 消去第 $2$ 列。结果为\n\n$$U^{-1} = \\begin{pmatrix} 1 & -a & ac - b \\\\ 0 & 1 & -c \\\\ 0 & 0 & 1 \\end{pmatrix}$$\n\n角元素并不只是 $-b$，因为消去第 $2$ 列时右侧块的第 $3$ 列也随之改变。取 $a = 2$，$b = 1$，$c = 3$，角元素为 $2 \\cdot 3 - 1 = 5$。\n\n> **注意。** $R_1 - aR_2$ 这一步减去的是 $a$ 乘第 $2$ 行中已有的 $-c$，因而多出 $ac$；忘了它就只剩 $-b$。",
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
          mistakes: [
            why(
              -b,
              `That stops after clearing column 3. The step $${replacement(1, a, 2)}$ also changes the corner, adding $${paren(a)} \\cdot ${paren(c)}$.`,
              `这只做到消去第 3 列。$${replacement(1, a, 2)}$ 这一步也改变角元素，多出 $${paren(a)} \\cdot ${paren(c)}$。`,
            ),
            why(
              b - a * c,
              `Every sign is flipped: the corner is $${paren(a)} \\cdot ${paren(c)} - ${paren(b)} = ${ans}$.`,
              `符号全反了：角元素是 $${paren(a)} \\cdot ${paren(c)} - ${paren(b)} = ${ans}$。`,
            ),
            why(
              -a * c - b,
              `The extra term has the wrong sign: subtracting $${paren(a)}$ times $${paren(-c)}$ adds $${a * c}$.`,
              `多出的一项符号错了：减去 $${paren(a)}$ 乘 $${paren(-c)}$ 就是加上 $${a * c}$。`,
            ),
            why(a * c, `The $${paren(-b)}$ from clearing column 3 is missing.`, `漏了消去第 3 列时得到的 $${paren(-b)}$。`),
          ].filter((w, i, all) => w.value !== ans && all.findIndex((o) => o.value === w.value) === i),
          solution: walked(
            [
              [
                ["Clear column 3", "消去第 3 列"],
                b === 0
                  ? t(
                      `Row 1 already has $0$ in column 3, so only $${replacement(2, c, 3)}$ is needed. Rows 1 and 2 of the right block become $(1, 0, 0)$ and $(0, 1, ${-c})$.`,
                      `第 1 行第 3 列已是 $0$，只需 $${replacement(2, c, 3)}$。右块第 1、2 行为 $(1, 0, 0)$ 与 $(0, 1, ${-c})$。`,
                    )
                  : t(
                      `$${replacement(2, c, 3)}$ and $${replacement(1, b, 3)}$ make rows 1 and 2 of the right block $(1, 0, ${-b})$ and $(0, 1, ${-c})$.`,
                      `$${replacement(2, c, 3)}$ 与 $${replacement(1, b, 3)}$ 使右块第 1、2 行为 $(1, 0, ${-b})$ 与 $(0, 1, ${-c})$。`,
                    ),
              ],
              [
                ["Clear column 2", "消去第 2 列"],
                t(`$${replacement(1, a, 2)}$ changes the corner of row 1:`, `$${replacement(1, a, 2)}$ 改变第 1 行的角元素：`),
                [`${paren(-b)} - ${paren(a)} \\cdot ${paren(-c)} = ${ans}`],
              ],
            ],
            t(
              `Row 1 of $U$ times column 3 of $U^{-1}$ is $1 \\cdot ${paren(ans)} + ${paren(a)} \\cdot ${paren(-c)} + ${paren(b)} \\cdot 1 = 0$, the $(1, 3)$ entry of $I$.`,
              `$U$ 的第 1 行乘 $U^{-1}$ 的第 3 列为 $1 \\cdot ${paren(ans)} + ${paren(a)} \\cdot ${paren(-c)} + ${paren(b)} \\cdot 1 = 0$，正是 $I$ 的 $(1, 3)$ 元素。`,
            ),
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
