import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { differentialEquationsDrawings1 } from "../explanation-drawings-differential-equations-1.ts";
import { choiceProblem, numberProblem, why, yesNo } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** par wraps a negative number in parentheses for use as a factor. */
const par = (n: number): string => (n < 0 ? `(${n})` : String(n));

/** signed writes a number as a following term: "+ 3" or "- 3". */
const signed = (n: number): string => (n < 0 ? `- ${-n}` : `+ ${n}`);

/** parQ wraps a negative rational number in parentheses for use as a factor. */
const parQ = (q: Q): string => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());

/** Mistake is a wrong value with what to say about it. */
type Mistake = { readonly value: number | Q; readonly why: Text };

/** apart drops the mistakes whose value is the answer or repeats an earlier one. */
const apart = (answer: number | Q, mistakes: readonly Mistake[]): Mistake[] => {
  const key = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v).toLatex();
  return mistakes.filter((m, i, all) => key(m.value) !== key(answer) && all.findIndex((x) => key(x.value) === key(m.value)) === i);
};

/** cf writes a coefficient before a symbol: "" for 1 and "-" for -1. */
const cf = (n: number): string => (n === 1 ? "" : n === -1 ? "-" : String(n));

/** mat writes a 2 by 2 matrix in LaTeX. */
const mat = (a: number | string, b: number | string, c: number | string, d: number | string): string =>
  `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;

/** vec writes a column vector with two entries in LaTeX. */
const vec = (p: number | string, q: number | string): string => `\\begin{pmatrix} ${p} \\\\ ${q} \\end{pmatrix}`;

/** ex writes the exponent kt, with "t" for k = 1 and "-t" for k = -1. */
const ex = (k: number): string => (k === 1 ? "t" : k === -1 ? "-t" : `${k}t`);

/** piLatex writes a positive rational multiple of pi: "\\frac{3\\pi}{4}". */
const piLatex = (v: Q): string => {
  const n = v.n === 1n ? "" : String(v.n);
  return v.isInteger() ? `${n}\\pi` : `\\frac{${n}\\pi}{${v.d}}`;
};

/** fromEigen builds the integer matrix with eigenvalues l1, l2 and eigenvectors (1, m1), (1, m2), where m2 - m1 is 1 or -1. */
function fromEigen(l1: number, l2: number, m1: number, m2: number): [number, number, number, number] {
  const det = m2 - m1;
  return [(l1 * m2 - l2 * m1) / det, (l2 - l1) / det, (m1 * m2 * (l1 - l2)) / det, (m2 * l2 - m1 * l1) / det];
}

// ---------------------------------------------------------------------------
// 4.13 Systems of ODEs
// ---------------------------------------------------------------------------

/** introductionToSystemsOfLinearOdes introduces the matrix form x' = A x. */
export const introductionToSystemsOfLinearOdes: TopicDef = {
  id: "introduction-to-systems-of-linear-odes",
  title: t("Introduction to Systems of Linear ODEs", "线性微分方程组简介"),
  summary: t(
    "A first-order linear system $x_1' = ax_1 + bx_2$, $x_2' = cx_1 + dx_2$ is written in matrix form as $\\mathbf{x}' = A\\mathbf{x}$ and characterized by the trace and determinant of $A$.",
    "一阶线性方程组 $x_1' = ax_1 + bx_2$，$x_2' = cx_1 + dx_2$ 可写成矩阵形式 $\\mathbf{x}' = A\\mathbf{x}$，由 $A$ 的迹与行列式刻画。",
  ),
  intro: t(
    "Two tanks exchange salt so that $x_1' = 2x_1 + x_2$ and $x_2' = x_1 + 2x_2$. Collecting the coefficients gives $\\mathbf{x}' = A\\mathbf{x}$ with $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$, whose trace is $2 + 2 = 4$ and determinant $4 - 1 = 3$. At the state $\\mathbf{x} = (1, 0)$ the velocity is $A\\mathbf{x} = (2, 1)$.\n\nCheck: $\\det(A - \\lambda I) = \\lambda^2 - 4\\lambda + 3 = (\\lambda - 1)(\\lambda - 3)$, and the eigenvalues $1$ and $3$ add to the trace $4$ and multiply to the determinant $3$.\n\nIn this lesson we write linear systems in matrix form, read off the trace and determinant, and compute the velocity at a given state.",
    "两个水箱交换盐分，使 $x_1' = 2x_1 + x_2$，$x_2' = x_1 + 2x_2$。把系数汇集起来得 $\\mathbf{x}' = A\\mathbf{x}$，$A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$，其迹为 $2 + 2 = 4$，行列式为 $4 - 1 = 3$。在状态 $\\mathbf{x} = (1, 0)$ 处，速度为 $A\\mathbf{x} = (2, 1)$。\n\n检验：$\\det(A - \\lambda I) = \\lambda^2 - 4\\lambda + 3 = (\\lambda - 1)(\\lambda - 3)$，特征值 $1$ 与 $3$ 之和为迹 $4$，之积为行列式 $3$。\n\n本课我们把线性方程组写成矩阵形式，读出迹与行列式，并求给定状态下的速度。",
  ),
  prerequisites: ["general-solutions-of-linear-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "matrix-form-of-first-order-linear-systems",
      title: t("Trace of the coefficient matrix in a linear system", "线性系统系数矩阵的迹"),
      explanation: t(
        "A linear system collects the coefficients into a matrix, and the trace of that matrix equals the sum of its eigenvalues. For a $2 \\times 2$ system $\\mathbf{x}' = A \\mathbf{x}$ where $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, the trace is $\\operatorname{tr}(A) = a + d$. For $x_1' = 3x_1 + 5x_2$, $x_2' = 2x_1 + 4x_2$ the trace is $3 + 4 = 7$.\n\n> **Watch out.** The trace adds the diagonal entries, the coefficient of $x_1$ in the first equation and of $x_2$ in the second; it is not the determinant $ad - bc$, and the off-diagonal entries $b$ and $c$ play no part.",
        "线性方程组把系数汇集成一个矩阵，这个矩阵的迹等于其特征值之和。对于二阶线性常微分方程组 $\\mathbf{x}' = A \\mathbf{x}$（系数矩阵 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$），其主对角线元素之和称为迹：$\\operatorname{tr}(A) = a + d$。对 $x_1' = 3x_1 + 5x_2$，$x_2' = 2x_1 + 4x_2$，迹为 $3 + 4 = 7$。\n\n> **注意。** 迹是对角线元素之和，即第一个方程中 $x_1$ 的系数与第二个方程中 $x_2$ 的系数之和；它不是行列式 $ad - bc$，非对角元素 $b$、$c$ 不参与。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 15);
        const d = rng.int(1, 15);
        const b = rng.int(1, 8);
        const c = rng.int(1, 8);
        const ans = a + d;
        return numberProblem({
          prompt: t(
            `Consider the linear system of differential equations $x_1' = ${poly([a, "x_1"], [b, "x_2"])}$ and $x_2' = ${poly([c, "x_1"], [d, "x_2"])}$. Find the trace $\\operatorname{tr}(A)$ of the coefficient matrix $A$.`,
            `考虑线性微分方程组 $x_1' = ${poly([a, "x_1"], [b, "x_2"])}$ 与 $x_2' = ${poly([c, "x_1"], [d, "x_2"])}$。求其系数矩阵 $A$ 的迹 $\\operatorname{tr}(A)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              a * d - b * c,
              "That is the determinant $ad - bc$; the trace adds the diagonal.",
              "这是行列式 $ad - bc$；迹是对角线元素之和。",
            ),
            why(a * d, "That multiplies the diagonal entries; the trace adds them.", "这是把对角线元素相乘；迹是相加。"),
            why(b + c, "That adds the off-diagonal entries; the trace uses the diagonal.", "这是把非对角元素相加；迹用的是对角线元素。"),
            why(
              a + b,
              "That adds the first row; the trace takes one entry from each row, on the diagonal.",
              "这是把第一行相加；迹是每行取对角线上的一个元素。",
            ),
          ]),
          solution: walked(
            [
              [["Write the matrix", "写出矩阵"], t("", ""), [`A = ${mat(a, b, c, d)}`]],
              [["Add the diagonal", "对角线相加"], t("", ""), [`\\operatorname{tr}(A) = ${a} + ${d} = ${ans}`]],
            ],
            t(
              `$\\det(A - \\lambda I) = ${poly([1, "\\lambda^2"], [-ans, "\\lambda"], [a * d - b * c, ""])}$, so the eigenvalues add to $${ans}$, the trace.`,
              `$\\det(A - \\lambda I) = ${poly([1, "\\lambda^2"], [-ans, "\\lambda"], [a * d - b * c, ""])}$，所以特征值之和为 $${ans}$，即迹。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-initial-velocity-of-a-linear-system",
      title: t("The initial velocity of a linear system", "线性方程组的初始速度"),
      explanation: t(
        "Reading the system as $\\mathbf{x}' = A\\mathbf{x}$ tells you the velocity at any state: multiply $A$ by the state vector. At $t = 0$,\n\n$$\\mathbf{x}'(0) = A\\mathbf{x}(0), \\qquad x_2'(0) = cx_1(0) + dx_2(0)$$\n\nfor $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$. Each row of $A$ gives one component, so use the second row for $x_2'$. For $x_2' = 3x_1 - x_2$ at $\\mathbf{x}(0) = (2, 5)$: $x_2'(0) = 6 - 5 = 1$.\n\n> **Watch out.** Pair each coefficient with its own variable: $c$ multiplies $x_1(0)$ and $d$ multiplies $x_2(0)$; the first row gives $x_1'$, not $x_2'$.",
        "把方程组看作 $\\mathbf{x}' = A\\mathbf{x}$，就能得到任意状态下的速度：用 $A$ 乘以状态向量。在 $t = 0$ 时，对 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$，\n\n$$\\mathbf{x}'(0) = A\\mathbf{x}(0), \\qquad x_2'(0) = cx_1(0) + dx_2(0).$$\n\n$A$ 的每一行给出一个分量，所以求 $x_2'$ 要用第二行。对 $x_2' = 3x_1 - x_2$，$\\mathbf{x}(0) = (2, 5)$：$x_2'(0) = 6 - 5 = 1$。\n\n> **注意。** 每个系数要乘它自己的变量：$c$ 乘 $x_1(0)$，$d$ 乘 $x_2(0)$；第一行给出的是 $x_1'$，不是 $x_2'$。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c, d] = [rng.int(-6, 6), rng.int(-6, 6), rng.int(-6, 6) || 2, rng.int(-6, 6)];
        const p = rng.int(-5, 5) || 1;
        const q = rng.int(-5, 5) || -2;
        const ans = c * p + d * q;
        const first = a * p + b * q;
        return numberProblem({
          prompt: t(
            `$x_1' = ${poly([a, "x_1"], [b, "x_2"])}$, $x_2' = ${poly([c, "x_1"], [d, "x_2"])}$ with $x_1(0) = ${p}$ and $x_2(0) = ${q}$. Find $x_2'(0)$.`,
            `$x_1' = ${poly([a, "x_1"], [b, "x_2"])}$，$x_2' = ${poly([c, "x_1"], [d, "x_2"])}$，$x_1(0) = ${p}$，$x_2(0) = ${q}$。求 $x_2'(0)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(first, "That uses the first equation, which gives $x_1'(0)$.", "这是用了第一个方程，它给出的是 $x_1'(0)$。"),
            why(
              c * q + d * p,
              "That swaps the initial values: $c$ goes with $x_1(0)$ and $d$ with $x_2(0)$.",
              "这是把初值交换了：$c$ 对应 $x_1(0)$，$d$ 对应 $x_2(0)$。",
            ),
            why(c + d, "That adds the coefficients without multiplying by the state.", "这是把系数直接相加，没有乘以状态。"),
          ]),
          solution: walked(
            [
              [["Take the second row", "取第二行"], t("", ""), [`x_2'(0) = c\\,x_1(0) + d\\,x_2(0)`]],
              [["Substitute", "代入"], t("", ""), [`x_2'(0) = ${par(c)} \\cdot ${par(p)} + ${par(d)} \\cdot ${par(q)} = ${ans}`]],
            ],
            t(
              `$A\\mathbf{x}(0) = ${mat(a, b, c, d)}${vec(p, q)} = ${vec(first, ans)}$, whose second entry is $${ans}$.`,
              `$A\\mathbf{x}(0) = ${mat(a, b, c, d)}${vec(p, q)} = ${vec(first, ans)}$，第二个分量为 $${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** expressingHomogeneousOdesAsFirstOrderSystems constructs the companion matrix. */
export const expressingHomogeneousOdesAsFirstOrderSystems: TopicDef = {
  id: "expressing-homogeneous-odes-as-first-order-systems",
  title: t("Expressing Homogeneous ODEs as First-Order Systems", "将高阶齐次常微分方程转化为一阶微分方程组"),
  summary: t(
    "With the state variables $x_1 = y$, $x_2 = y'$, the second-order ODE $y'' + py' + qy = 0$ becomes the first-order system $\\mathbf{x}' = A\\mathbf{x}$ with a companion matrix.",
    "取状态变量 $x_1 = y$，$x_2 = y'$，二阶方程 $y'' + py' + qy = 0$ 化为以友矩阵为系数的一阶系统 $\\mathbf{x}' = A\\mathbf{x}$。",
  ),
  intro: t(
    "Take $y'' + 3y' + 2y = 0$ and set $x_1 = y$, $x_2 = y'$. Then $x_1' = x_2$ and $x_2' = y'' = -2x_1 - 3x_2$, so $\\mathbf{x}' = A\\mathbf{x}$ with the companion matrix $A = \\begin{pmatrix} 0 & 1 \\\\ -2 & -3 \\end{pmatrix}$.\n\nCheck: $\\det(A - \\lambda I) = \\lambda(\\lambda + 3) + 2 = \\lambda^2 + 3\\lambda + 2$, the characteristic polynomial of the original equation, with roots $-1$ and $-2$.\n\nIn this lesson we rewrite higher-order homogeneous equations as first-order systems and read the companion matrix.",
    "考虑 $y'' + 3y' + 2y = 0$，令 $x_1 = y$，$x_2 = y'$。则 $x_1' = x_2$，$x_2' = y'' = -2x_1 - 3x_2$，所以 $\\mathbf{x}' = A\\mathbf{x}$，友矩阵为 $A = \\begin{pmatrix} 0 & 1 \\\\ -2 & -3 \\end{pmatrix}$。\n\n检验：$\\det(A - \\lambda I) = \\lambda(\\lambda + 3) + 2 = \\lambda^2 + 3\\lambda + 2$，正是原方程的特征多项式，根为 $-1$ 和 $-2$。\n\n本课我们把高阶齐次方程改写为一阶方程组，并读出友矩阵。",
  ),
  prerequisites: ["introduction-to-systems-of-linear-odes"],
  encompasses: [{ topic: "introduction-to-systems-of-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "companion-matrix-of-scalar-homogeneous-odes",
      title: t("Companion matrix representation of a second-order ODE", "二阶常微分方程的友矩阵表示"),
      explanation: t(
        "Introducing the derivative as a second unknown turns one second order equation into a system of two first order equations. Setting $x_1 = y, x_2 = y'$ for $y'' + p y' + q y = 0$ yields $x_1' = x_2$ and $x_2' = -q x_1 - p x_2$. The determinant of the companion matrix is $\\det(A) = q$. For $y'' + 3y' + 2y = 0$, $A = \\begin{pmatrix} 0 & 1 \\\\ -2 & -3 \\end{pmatrix}$ and $\\det(A) = 0 - (-2) = 2$.\n\n> **Watch out.** $\\det(A) = (0)(-p) - (1)(-q)$: the two minus signs cancel, so the determinant is $+q$, and $p$ does not enter it.",
        "把导数作为第二个未知函数引入，就把一个二阶方程化为两个一阶方程组成的方程组。对于方程 $y'' + p y' + q y = 0$，设 $x_1 = y, x_2 = y'$，得 $x_1' = x_2$ 且 $x_2' = -q x_1 - p x_2$。友矩阵 $\\begin{pmatrix} 0 & 1 \\\\ -q & -p \\end{pmatrix}$ 的行列式为 $\\det(A) = q$。对 $y'' + 3y' + 2y = 0$，$A = \\begin{pmatrix} 0 & 1 \\\\ -2 & -3 \\end{pmatrix}$，$\\det(A) = 0 - (-2) = 2$。\n\n> **注意。** $\\det(A) = (0)(-p) - (1)(-q)$：两个负号相消，所以行列式是 $+q$，$p$ 不参与。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(1, 10);
        const q = rng.int(2, 35);
        const ans = q;
        return numberProblem({
          prompt: t(
            `Convert the second-order linear ODE $${poly([1, "y''"], [p, "y'"], [q, "y"])} = 0$ into a first-order system $\\mathbf{x}' = A \\mathbf{x}$ using $x_1 = y$ and $x_2 = y'$. Find the determinant $\\det(A)$ of the resulting companion matrix $A$.`,
            `通过令 $x_1 = y$ 与 $x_2 = y'$，将二阶线性微分方程 $${poly([1, "y''"], [p, "y'"], [q, "y"])} = 0$ 转化为一阶微分方程组 $\\mathbf{x}' = A \\mathbf{x}$。求友矩阵 $A$ 的行列式 $\\det(A)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(-q, "The sign is off: $-(1)(-q) = +q$.", "符号错了：$-(1)(-q) = +q$。"),
            why(
              p,
              "That is the coefficient of $y'$, which sits in the trace, not the determinant.",
              "这是 $y'$ 的系数，它出现在迹中，而不是行列式中。",
            ),
            why(-p, "That is the trace $-p$ of the companion matrix.", "这是友矩阵的迹 $-p$。"),
            why(
              q - p,
              "That mixes the coefficient $p$ in; the entry $0$ removes it from the determinant.",
              "这是把 $p$ 也算进去了；元素 $0$ 使它不出现在行列式中。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Build the system", "建立方程组"],
                t("Solve the equation for $y''$:", "从方程解出 $y''$："),
                [`x_1' = x_2, \\qquad x_2' = ${poly([-q, "x_1"], [-p, "x_2"])}`, `A = ${mat(0, 1, -q, -p)}`],
              ],
              [["Take the determinant", "求行列式"], t("", ""), [`\\det(A) = (0)(${-p}) - (1)(${-q}) = ${ans}`]],
            ],
            t(
              `$\\det(A - \\lambda I) = \\lambda^2 + ${p === 1 ? "" : p}\\lambda + ${q}$, the characteristic polynomial of the equation, whose constant term is $\\det(A) = ${q}$.`,
              `$\\det(A - \\lambda I) = \\lambda^2 + ${p === 1 ? "" : p}\\lambda + ${q}$，正是方程的特征多项式，其常数项为 $\\det(A) = ${q}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-companion-matrix-of-a-third-order-equation",
      title: t("The companion matrix of a third-order equation", "三阶方程的伴随矩阵"),
      explanation: t(
        "For $y''' + ay'' + by' + cy = 0$, set $x_1 = y$, $x_2 = y'$, $x_3 = y''$. Then $x_1' = x_2$, $x_2' = x_3$ and $x_3' = -cx_1 - bx_2 - ax_3$, so\n\n$$A = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ -c & -b & -a \\end{pmatrix}.$$\n\nThe last row holds the coefficients with their signs changed, in the order $y, y', y''$. For $y''' + 2y'' - 5y' + 3y = 0$ the last row is $(-3, 5, -2)$.\n\n> **Watch out.** The order is reversed from the way the equation is written: $A_{31}$ goes with $y$, so it is $-c$, and $A_{33}$ goes with $y''$; each sign is changed because the terms move to the other side.",
        "对 $y''' + ay'' + by' + cy = 0$，令 $x_1 = y$，$x_2 = y'$，$x_3 = y''$。则 $x_1' = x_2$，$x_2' = x_3$，$x_3' = -cx_1 - bx_2 - ax_3$，所以\n\n$$A = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ -c & -b & -a \\end{pmatrix}.$$\n\n最后一行是改变符号后的系数，按 $y, y', y''$ 的顺序排列。对 $y''' + 2y'' - 5y' + 3y = 0$，最后一行为 $(-3, 5, -2)$。\n\n> **注意。** 顺序与方程的书写顺序相反：$A_{31}$ 对应 $y$，所以是 $-c$，$A_{33}$ 对应 $y''$；因为各项移到等号另一边，每个符号都要改变。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-6, 9) || 2;
        const b = rng.int(-6, 9) || 3;
        const c = rng.int(-6, 9) || 5;
        const col = rng.int(1, 3);
        const ans = col === 1 ? -c : col === 2 ? -b : -a;
        const named = col === 1 ? "y" : col === 2 ? "y'" : "y''";
        return numberProblem({
          prompt: t(
            `Write $${poly([1, "y'''"], [a, "y''"], [b, "y'"], [c, "y"])} = 0$ as $\\mathbf{x}' = A\\mathbf{x}$ with $\\mathbf{x} = (y, y', y'')$. Find the entry $A_{3${col}}$.`,
            `把 $${poly([1, "y'''"], [a, "y''"], [b, "y'"], [c, "y"])} = 0$ 写成 $\\mathbf{x}' = A\\mathbf{x}$，其中 $\\mathbf{x} = (y, y', y'')$。求元素 $A_{3${col}}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              -ans,
              "That keeps the sign from the equation; moving the term across changes it.",
              "这是保留了方程中的符号；移项后符号要改变。",
            ),
            why(
              col === 1 ? -a : -c,
              "That reads the coefficients in the order written; column $1$ goes with $y$ and column $3$ with $y''$.",
              "这是按书写顺序读系数；第 $1$ 列对应 $y$，第 $3$ 列对应 $y''$。",
            ),
            why(col === 2 ? -a : -b, "That takes the coefficient of a different derivative.", "这是取了另一个导数的系数。"),
            ...(col === 1
              ? []
              : [
                  why(
                    0,
                    "That is an entry of the first two rows; the third row holds the coefficients.",
                    "这是前两行中的元素；系数在第三行。",
                  ),
                ]),
          ]),
          solution: walked(
            [
              [
                ["Solve for the highest derivative", "解出最高阶导数"],
                t("", ""),
                [`x_3' = y''' = ${poly([-c, "x_1"], [-b, "x_2"], [-a, "x_3"])}`],
              ],
              [
                ["Read the third row", "读出第三行"],
                t(`Column ${col} goes with $${named}$:`, `第 ${col} 列对应 $${named}$：`),
                [`(${-c}, ${-b}, ${-a}), \\qquad A_{3${col}} = ${ans}`],
              ],
            ],
            t(
              `Moving the third row back across: $${poly([1, "y'''"], [a, "y''"], [b, "y'"], [c, "y"])} = 0$, the original equation.`,
              `把第三行移回等号另一边：$${poly([1, "y'''"], [a, "y''"], [b, "y'"], [c, "y"])} = 0$，正是原方程。`,
            ),
          ),
        });
      },
    },
  ],
};

/** expressingInhomogeneousOdesAsFirstOrderSystems adds the forcing vector g(t). */
export const expressingInhomogeneousOdesAsFirstOrderSystems: TopicDef = {
  id: "expressing-inhomogeneous-odes-as-first-order-systems",
  title: t("Expressing Inhomogeneous ODEs as First-Order Systems", "将高阶非齐次常微分方程转化为一阶微分方程组"),
  summary: t(
    "An inhomogeneous ODE $y'' + py' + qy = f(t)$ becomes $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}(t)$, where $\\mathbf{g}(t) = (0, f(t))^T$ carries the forcing.",
    "非齐次方程 $y'' + py' + qy = f(t)$ 化为 $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}(t)$，外力集中在 $\\mathbf{g}(t) = (0, f(t))^T$ 中。",
  ),
  intro: t(
    "Take $y'' + 3y' + 2y = e^{t}$ with $y(0) = 1$, $y'(0) = 0$. With $x_1 = y$ and $x_2 = y'$, the system is $x_1' = x_2$ and $x_2' = -2x_1 - 3x_2 + e^{t}$, that is $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}(t)$ with $\\mathbf{g}(t) = (0, e^{t})$. At $t = 0$, $x_2'(0) = -2 - 0 + 1 = -1$.\n\nCheck: the original equation gives $y''(0) = e^{0} - 3y'(0) - 2y(0) = 1 - 0 - 2 = -1$.\n\nIn this lesson we carry a forcing term into the first-order system as a forcing vector.",
    "考虑 $y'' + 3y' + 2y = e^{t}$，$y(0) = 1$，$y'(0) = 0$。取 $x_1 = y$，$x_2 = y'$，方程组为 $x_1' = x_2$，$x_2' = -2x_1 - 3x_2 + e^{t}$，即 $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}(t)$，$\\mathbf{g}(t) = (0, e^{t})$。在 $t = 0$ 时，$x_2'(0) = -2 - 0 + 1 = -1$。\n\n检验：由原方程得 $y''(0) = e^{0} - 3y'(0) - 2y(0) = 1 - 0 - 2 = -1$。\n\n本课我们把强迫项作为强迫向量带入一阶方程组。",
  ),
  prerequisites: ["expressing-homogeneous-odes-as-first-order-systems"],
  encompasses: [
    {
      topic: "expressing-homogeneous-odes-as-first-order-systems",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "forcing-vector-in-first-order-companion-systems",
      title: t("Forcing vector in first-order companion systems", "一阶伴随系统中的外力激励向量"),
      explanation: t(
        "The forcing term of the original equation appears only in the equation for the highest derivative, so it occupies the last entry of the forcing vector. For $y'' + p y' + q y = K t^2$, state variables $x_1 = y, x_2 = y'$ yield $\\mathbf{x}' = A \\mathbf{x} + \\begin{pmatrix} 0 \\\\ K t^2 \\end{pmatrix}$. At $t = 2$, the second component is $4K$; for $K = 5$ it is $20$.\n\n> **Watch out.** The first component of $\\mathbf{g}$ is $0$, because $x_1' = x_2$ has no forcing; and evaluate $t^{2}$, not $t$, at the given time.",
        "原方程的强迫项只出现在最高阶导数的方程中，所以它位于强迫向量的最后一个分量。对于 $y'' + p y' + q y = K t^2$，转化为状态空间形式后外力激励向量为 $\\mathbf{g}(t) = \\begin{pmatrix} 0 \\\\ K t^2 \\end{pmatrix}$。在 $t = 2$ 处第二分量为 $4K$；$K = 5$ 时为 $20$。\n\n> **注意。** $\\mathbf{g}$ 的第一个分量是 $0$，因为 $x_1' = x_2$ 没有强迫项；在给定时刻要计算 $t^{2}$ 而不是 $t$。",
      ),
      generate(rng: Rng): Problem {
        const K = rng.int(2, 40);
        const ans = 4 * K;
        return numberProblem({
          prompt: t(
            `When the inhomogeneous differential equation $y'' + 3y' + 2y = ${K}t^2$ is expressed as a first-order system $\\mathbf{x}' = A \\mathbf{x} + \\mathbf{g}(t)$ with $\\mathbf{x} = \\begin{pmatrix} y \\\\ y' \\end{pmatrix}$, evaluate the second component $g_2(2)$ at $t = 2$.`,
            `将非齐次常微分方程 $y'' + 3y' + 2y = ${K}t^2$ 化为一阶微分方程组 $\\mathbf{x}' = A \\mathbf{x} + \\mathbf{g}(t)$（其中状态向量 $\\mathbf{x} = \\begin{pmatrix} y \\\\ y' \\end{pmatrix}$）。求激励向量第二分量在 $t = 2$ 处的值 $g_2(2)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(K, "That is the coefficient alone; evaluate $t^{2}$ at $t = 2$.", "这只是系数；还要在 $t = 2$ 处计算 $t^{2}$。"),
            why(2 * K, "That uses $t$ in place of $t^{2}$.", "这是用 $t$ 代替了 $t^{2}$。"),
            why(0, "That is $g_1$; the forcing sits in the second component.", "这是 $g_1$；强迫项在第二个分量中。"),
          ]),
          solution: walked(
            [
              [
                ["Build the system", "建立方程组"],
                t("", ""),
                [`x_1' = x_2, \\qquad x_2' = -2x_1 - 3x_2 + ${K}t^2`, `\\mathbf{g}(t) = ${vec(0, `${K}t^2`)}`],
              ],
              [["Evaluate", "求值"], t("", ""), [`g_2(2) = ${K} \\cdot 2^2 = ${ans}`]],
            ],
            t(
              `The original equation has $y'' = ${K}t^2 - 3y' - 2y$, whose forcing part at $t = 2$ is $${K} \\cdot 4 = ${ans}$.`,
              `原方程给出 $y'' = ${K}t^2 - 3y' - 2y$，其强迫部分在 $t = 2$ 处为 $${K} \\cdot 4 = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-state-velocity-of-a-forced-equation",
      title: t("The state velocity of a forced equation", "受迫方程的状态速度"),
      explanation: t(
        "With $x_1 = y$ and $x_2 = y'$, the forced equation $y'' + py' + qy = g(t)$ becomes\n\n$$x_1' = x_2, \\qquad x_2' = -qx_1 - px_2 + g(t).$$\n\nThe forcing enters only the last equation, and it is evaluated at the same time as the state. So the velocity of $x_2$ at time $t_0$ uses $y(t_0)$, $y'(t_0)$ and $g(t_0)$ together. For $y'' + y' + 2y = 3t$ with $y(1) = 1$, $y'(1) = 2$: $x_2'(1) = -2 - 2 + 3 = -1$.\n\n> **Watch out.** Moving $py'$ and $qy$ across changes their signs, but the forcing stays positive; and $g$ is evaluated at $t_0$, not at $0$.",
        "令 $x_1 = y$，$x_2 = y'$，受迫方程 $y'' + py' + qy = g(t)$ 化为\n\n$$x_1' = x_2, \\qquad x_2' = -qx_1 - px_2 + g(t).$$\n\n强迫项只出现在最后一个方程中，并且与状态在同一时刻取值。所以 $t_0$ 时刻 $x_2$ 的变化率要同时用到 $y(t_0)$、$y'(t_0)$ 和 $g(t_0)$。对 $y'' + y' + 2y = 3t$，$y(1) = 1$，$y'(1) = 2$：$x_2'(1) = -2 - 2 + 3 = -1$。\n\n> **注意。** 把 $py'$ 和 $qy$ 移项时符号改变，但强迫项保持正号；$g$ 要在 $t_0$ 而不是 $0$ 处取值。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(-5, 6) || 2;
        const q = rng.int(-5, 8) || 3;
        const m = rng.int(-6, 6) || 4;
        const k = rng.int(-6, 6);
        const y1 = rng.int(-4, 4);
        const v1 = rng.int(-4, 4) || 1;
        const g = m + k;
        const ans = g - q * y1 - p * v1;
        return numberProblem({
          prompt: t(
            `Write $${poly([1, "y''"], [p, "y'"], [q, "y"])} = ${poly([m, "t"], [k, ""])}$ as a system with $x_1 = y$, $x_2 = y'$. If $y(1) = ${y1}$ and $y'(1) = ${v1}$, find $x_2'(1)$.`,
            `取 $x_1 = y$，$x_2 = y'$，把 $${poly([1, "y''"], [p, "y'"], [q, "y"])} = ${poly([m, "t"], [k, ""])}$ 写成方程组。若 $y(1) = ${y1}$，$y'(1) = ${v1}$，求 $x_2'(1)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(-q * y1 - p * v1, "That leaves out the forcing $g(1)$.", "这里漏掉了强迫项 $g(1)$。"),
            why(
              g + q * y1 + p * v1,
              "That keeps the signs of $py'$ and $qy$; moving them across changes them.",
              "这是保留了 $py'$ 和 $qy$ 的符号；移项后符号要改变。",
            ),
            why(
              k - q * y1 - p * v1,
              "That evaluates the forcing at $t = 0$ instead of $t = 1$.",
              "这是在 $t = 0$ 而不是 $t = 1$ 处计算强迫项。",
            ),
            why(v1, "That is $x_1'(1) = y'(1)$, the other component.", "这是另一个分量 $x_1'(1) = y'(1)$。"),
          ]),
          solution: walked(
            [
              [
                ["Build the system", "建立方程组"],
                t("", ""),
                [`x_1' = x_2, \\qquad x_2' = ${poly([-q, "x_1"], [-p, "x_2"])} + g(t)`, `g(1) = ${poly([m, ""], [k, ""])} = ${g}`],
              ],
              [
                ["Substitute at t = 1", "在 t = 1 处代入"],
                t("", ""),
                [`x_2'(1) = ${par(-q)} \\cdot ${par(y1)} + ${par(-p)} \\cdot ${par(v1)} + ${par(g)} = ${ans}`],
              ],
            ],
            t(
              `In the original equation: $${ans} ${signed(p)} \\cdot ${par(v1)} ${signed(q)} \\cdot ${par(y1)} = ${g} = g(1)$.`,
              `代回原方程：$${ans} ${signed(p)} \\cdot ${par(v1)} ${signed(q)} \\cdot ${par(y1)} = ${g} = g(1)$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** linearIndependenceForHomogeneousSystemsOfOdes tests Wronskian of vector solutions. */
export const linearIndependenceForHomogeneousSystemsOfOdes: TopicDef = {
  id: "linear-independence-for-homogeneous-systems-of-odes",
  title: t("Linear Independence for Homogeneous Systems of ODEs", "齐次线性微分方程组解向量的线性相关性与无关性"),
  summary: t(
    "Vector solutions $\\mathbf{x}_1(t), \\mathbf{x}_2(t)$ are linearly independent if and only if their Wronskian $W(t) = \\det\\begin{pmatrix} \\mathbf{x}_1(t) & \\mathbf{x}_2(t) \\end{pmatrix}$ is non-zero.",
    "向量解 $\\mathbf{x}_1(t), \\mathbf{x}_2(t)$ 线性无关当且仅当其朗斯基行列式 $W(t) = \\det\\begin{pmatrix} \\mathbf{x}_1(t) & \\mathbf{x}_2(t) \\end{pmatrix}$ 不为零。",
  ),
  intro: t(
    "The system $\\mathbf{x}' = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}\\mathbf{x}$ has the solutions $\\mathbf{x}_1 = e^{t}(1, 1)$ and $\\mathbf{x}_2 = e^{-t}(1, -1)$. Their Wronskian is $W(t) = \\det\\begin{pmatrix} e^{t} & e^{-t} \\\\ e^{t} & -e^{-t} \\end{pmatrix} = -1 - 1 = -2$, which is never zero, so the two solutions are independent.\n\nCheck: the trace of the matrix is $0$, and Abel's formula gives $W(t) = W(0)e^{0 \\cdot t} = -2$ for every $t$.\n\nIn this lesson we test vector solutions for independence with the Wronskian and follow how it changes in time.",
    "方程组 $\\mathbf{x}' = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}\\mathbf{x}$ 有解 $\\mathbf{x}_1 = e^{t}(1, 1)$ 和 $\\mathbf{x}_2 = e^{-t}(1, -1)$。它们的朗斯基行列式为 $W(t) = \\det\\begin{pmatrix} e^{t} & e^{-t} \\\\ e^{t} & -e^{-t} \\end{pmatrix} = -1 - 1 = -2$，始终不为零，所以两个解线性无关。\n\n检验：矩阵的迹为 $0$，阿贝尔公式给出对每个 $t$ 都有 $W(t) = W(0)e^{0 \\cdot t} = -2$。\n\n本课我们用朗斯基行列式检验向量解的线性无关性，并研究它随时间的变化。",
  ),
  prerequisites: ["expressing-homogeneous-odes-as-first-order-systems"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "wronskian-of-vector-solutions",
      title: t("Wronskian determinant of vector solutions", "向量解组的朗斯基行列式"),
      explanation: t(
        "For vector solutions the Wronskian is the determinant of the matrix whose columns are the solutions, and it tests whether they are independent. For $\\mathbf{x}_1(t) = \\begin{pmatrix} 1 \\\\ a \\end{pmatrix}e^{\\lambda_1 t}$ and $\\mathbf{x}_2(t) = \\begin{pmatrix} 1 \\\\ b \\end{pmatrix}e^{\\lambda_2 t}$, the Wronskian at $t = 0$ is $\\det \\begin{pmatrix} 1 & 1 \\\\ a & b \\end{pmatrix} = b - a$. For $a = 2$ and $b = 7$ it is $5$.\n\n> **Watch out.** The solutions are the columns, so $W(0) = (1)(b) - (1)(a)$: the second solution's entry comes first, and the exponentials are all $1$ at $t = 0$.",
        "对于向量解，朗斯基行列式是以这些解为列的矩阵的行列式，用来检验它们是否线性无关。对于向量解 $\\mathbf{x}_1(t) = \\begin{pmatrix} 1 \\\\ a \\end{pmatrix}e^{\\lambda_1 t}$ 与 $\\mathbf{x}_2(t) = \\begin{pmatrix} 1 \\\\ b \\end{pmatrix}e^{\\lambda_2 t}$，在 $t = 0$ 处的朗斯基行列式为 $\\det \\begin{pmatrix} 1 & 1 \\\\ a & b \\end{pmatrix} = b - a$。对 $a = 2$，$b = 7$，它是 $5$。\n\n> **注意。** 解是列，所以 $W(0) = (1)(b) - (1)(a)$：第二个解的分量在前；在 $t = 0$ 时所有指数都等于 $1$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 10);
        const diff = rng.int(2, 25);
        const b = a + diff;
        const ans = diff;
        return numberProblem({
          prompt: t(
            `Calculate the initial Wronskian $W(0) = \\det(\\mathbf{x}_1(0), \\mathbf{x}_2(0))$ for the two vector solutions $\\mathbf{x}_1(t) = \\begin{pmatrix} 1 \\\\ ${a} \\end{pmatrix}e^{2t}$ and $\\mathbf{x}_2(t) = \\begin{pmatrix} 1 \\\\ ${b} \\end{pmatrix}e^{-3t}$.`,
            `计算两个向量解 $\\mathbf{x}_1(t) = \\begin{pmatrix} 1 \\\\ ${a} \\end{pmatrix}e^{2t}$ 与 $\\mathbf{x}_2(t) = \\begin{pmatrix} 1 \\\\ ${b} \\end{pmatrix}e^{-3t}$ 在 $t = 0$ 处的初始朗斯基行列式 $W(0) = \\det(\\mathbf{x}_1(0), \\mathbf{x}_2(0))$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(-ans, "The order is reversed; $W(0) = (1)(b) - (1)(a)$.", "顺序反了；$W(0) = (1)(b) - (1)(a)$。"),
            why(a + b, "That adds the products; a determinant subtracts them.", "这是把乘积相加；行列式是相减。"),
            why(
              a * b,
              "That multiplies the lower entries; the determinant is $1 \\cdot b - 1 \\cdot a$.",
              "这是把下面两个分量相乘；行列式是 $1 \\cdot b - 1 \\cdot a$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Evaluate at t = 0", "在 t = 0 处求值"],
                t("The exponentials are $1$, and the solutions form the columns:", "指数都等于 $1$，解作为各列："),
                [`X(0) = ${mat(1, 1, a, b)}`],
              ],
              [["Take the determinant", "求行列式"], t("", ""), [`W(0) = (1)(${b}) - (1)(${a}) = ${ans}`]],
            ],
            t(
              `$W(0) = ${ans} \\ne 0$, and indeed $(1, ${a})$ is not a multiple of $(1, ${b})$, so the solutions are independent.`,
              `$W(0) = ${ans} \\ne 0$；确实 $(1, ${a})$ 不是 $(1, ${b})$ 的倍数，所以两个解线性无关。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-growth-rate-of-the-wronskian",
      title: t("The growth rate of the Wronskian", "朗斯基行列式的增长率"),
      explanation: t(
        "Abel's formula says how the Wronskian of two solutions of $\\mathbf{x}' = A\\mathbf{x}$ changes in time without solving the system:\n\n$$W(t) = W(0)\\,e^{\\operatorname{tr}(A)\\,t}.$$\n\nThe exponential never vanishes, so the Wronskian is either zero for all $t$ or zero for no $t$. Solutions that are independent at one time stay independent, and the rate in the exponent is the trace, not the determinant. For $A = \\begin{pmatrix} 3 & 1 \\\\ 2 & -5 \\end{pmatrix}$ the rate is $3 - 5 = -2$.\n\n> **Watch out.** The exponent uses the trace $a + d$; the determinant, the difference $a - d$ and the product $ad$ are all different numbers.",
        "阿贝尔公式不用解方程组就说明了 $\\mathbf{x}' = A\\mathbf{x}$ 两个解的朗斯基行列式如何随时间变化：\n\n$$W(t) = W(0)\\,e^{\\operatorname{tr}(A)\\,t}.$$\n\n指数函数从不为零，所以朗斯基行列式要么恒为零，要么处处不为零。在某一时刻线性无关的解始终线性无关，指数中的速率是迹而不是行列式。对 $A = \\begin{pmatrix} 3 & 1 \\\\ 2 & -5 \\end{pmatrix}$，速率为 $3 - 5 = -2$。\n\n> **注意。** 指数用的是迹 $a + d$；行列式、差 $a - d$ 和积 $ad$ 都是不同的数。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c, d] = [rng.int(-7, 7), rng.int(-7, 7) || 1, rng.int(-7, 7), rng.int(-7, 7)];
        const w0 = rng.int(2, 9);
        const ans = a + d;
        return numberProblem({
          prompt: t(
            `Two solutions of $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ have Wronskian $W(0) = ${w0}$. Then $W(t) = ${w0}e^{kt}$. Find $k$.`,
            `$\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ 的两个解满足 $W(0) = ${w0}$，于是 $W(t) = ${w0}e^{kt}$。求 $k$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(a * d - b * c, "That is the determinant; Abel's formula uses the trace.", "这是行列式；阿贝尔公式用的是迹。"),
            why(a - d, "That subtracts the diagonal entries; the trace adds them.", "这是把对角线元素相减；迹是相加。"),
            why(-ans, "The sign is flipped; $W' = \\operatorname{tr}(A)W$.", "符号反了；$W' = \\operatorname{tr}(A)W$。"),
            why(a * d, "That multiplies the diagonal entries; the trace adds them.", "这是把对角线元素相乘；迹是相加。"),
          ]),
          solution: walked(
            [
              [["Use Abel's formula", "用阿贝尔公式"], t("", ""), [`W(t) = W(0)\\,e^{\\operatorname{tr}(A)\\,t}`]],
              [["Take the trace", "求迹"], t("", ""), [`k = ${a} ${signed(d)} = ${ans}`]],
            ],
            t(
              `The eigenvalues of $A$ add to the trace $${ans}$, and the Wronskian of two eigen-solutions $e^{\\lambda_1 t}\\mathbf{v}_1$, $e^{\\lambda_2 t}\\mathbf{v}_2$ carries $e^{(\\lambda_1 + \\lambda_2)t}$.`,
              `$A$ 的特征值之和为迹 $${ans}$，两个特征解 $e^{\\lambda_1 t}\\mathbf{v}_1$、$e^{\\lambda_2 t}\\mathbf{v}_2$ 的朗斯基行列式含因子 $e^{(\\lambda_1 + \\lambda_2)t}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** generalSolutionsOfFirstOrderLinearSystemsOfOdes superposes fundamental solutions. */
export const generalSolutionsOfFirstOrderLinearSystemsOfOdes: TopicDef = {
  id: "general-solutions-of-first-order-linear-systems-of-odes",
  title: t("General Solutions of First-Order Linear Systems of ODEs", "一阶线性微分方程组的通解结构"),
  summary: t(
    "The general solution of $\\mathbf{x}' = A\\mathbf{x}$ is $\\mathbf{x}(t) = c_1 \\mathbf{x}_1(t) + c_2 \\mathbf{x}_2(t)$, and an initial condition $\\mathbf{x}(0) = \\mathbf{x}_0$ fixes the constants.",
    "$\\mathbf{x}' = A\\mathbf{x}$ 的通解为 $\\mathbf{x}(t) = c_1 \\mathbf{x}_1(t) + c_2 \\mathbf{x}_2(t)$，初值条件 $\\mathbf{x}(0) = \\mathbf{x}_0$ 唯一确定常数。",
  ),
  intro: t(
    "The system $\\mathbf{x}' = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}\\mathbf{x}$ has the general solution $\\mathbf{x} = c_1e^{t}(1, 1) + c_2e^{-t}(1, -1)$. For $\\mathbf{x}(0) = (3, 1)$, setting $t = 0$ gives $c_1 + c_2 = 3$ and $c_1 - c_2 = 1$, so $c_1 = 2$ and $c_2 = 1$.\n\nCheck: $2(1, 1) + 1(1, -1) = (3, 1)$.\n\nIn this lesson we combine independent solutions into the general solution and fit its constants to an initial state.",
    "方程组 $\\mathbf{x}' = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}\\mathbf{x}$ 的通解为 $\\mathbf{x} = c_1e^{t}(1, 1) + c_2e^{-t}(1, -1)$。对 $\\mathbf{x}(0) = (3, 1)$，令 $t = 0$ 得 $c_1 + c_2 = 3$，$c_1 - c_2 = 1$，所以 $c_1 = 2$，$c_2 = 1$。\n\n检验：$2(1, 1) + 1(1, -1) = (3, 1)$。\n\n本课我们把线性无关的解组合成通解，并用初始状态确定其中的常数。",
  ),
  prerequisites: ["linear-independence-for-homogeneous-systems-of-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "fundamental-set-and-superposition-of-vector-solutions",
      title: t("Superposition and initial condition coefficients", "基本解组线性组合与初值系数确定"),
      explanation: t(
        "When the solutions start at the standard unit vectors, the coefficients needed for any initial condition are simply the entries of the initial vector. If $\\mathbf{x}_1(0) = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ and $\\mathbf{x}_2(0) = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$, then $\\mathbf{x}(0) = \\begin{pmatrix} c_1 \\\\ c_2 \\end{pmatrix}$. For initial vector $\\begin{pmatrix} u_0 \\\\ v_0 \\end{pmatrix}$, the coefficients are $c_1 = u_0$ and $c_2 = v_0$. For $\\mathbf{x}(0) = (4, 9)$, $c_1 = 4$ and $c_2 = 9$.\n\n> **Watch out.** Each coefficient matches one entry: $c_1$ is the first entry and $c_2$ the second; they are not multiplied together.",
        "当各个解从标准单位向量出发时，任意初始条件所需的系数就是初始向量的各个分量。若规范化基本解在初值处满足 $\\mathbf{x}_1(0) = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ 且 $\\mathbf{x}_2(0) = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$，则任意初值 $\\begin{pmatrix} u_0 \\\\ v_0 \\end{pmatrix}$ 的组合系数直接为 $c_1 = u_0$ 与 $c_2 = v_0$。对 $\\mathbf{x}(0) = (4, 9)$，$c_1 = 4$，$c_2 = 9$。\n\n> **注意。** 每个系数对应一个分量：$c_1$ 是第一个分量，$c_2$ 是第二个；它们不相乘。",
      ),
      generate(rng: Rng): Problem {
        const u0 = rng.int(2, 20);
        const v0 = rng.int(2, 20);
        const ans = u0 + v0;
        return numberProblem({
          prompt: t(
            `Suppose a fundamental set of solutions satisfies $\\mathbf{x}_1(0) = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ and $\\mathbf{x}_2(0) = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$. The general solution $\\mathbf{x}(t) = c_1 \\mathbf{x}_1(t) + c_2 \\mathbf{x}_2(t)$ satisfies the initial condition $\\mathbf{x}(0) = \\begin{pmatrix} ${u0} \\\\ ${v0} \\end{pmatrix}$. Find the sum of coefficients $c_1 + c_2$.`,
            `设某齐次系统的基本解组满足规范化初值 $\\mathbf{x}_1(0) = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$ 与 $\\mathbf{x}_2(0) = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$。通解 $\\mathbf{x}(t) = c_1 \\mathbf{x}_1(t) + c_2 \\mathbf{x}_2(t)$ 满足初始条件 $\\mathbf{x}(0) = \\begin{pmatrix} ${u0} \\\\ ${v0} \\end{pmatrix}$。求系数之和 $c_1 + c_2$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(u0 * v0, "That multiplies the coefficients; the question asks for their sum.", "这是把系数相乘；题目要求的是和。"),
            why(Math.abs(u0 - v0), "That subtracts the coefficients; add them.", "这是把系数相减；应当相加。"),
            why(u0, "That is $c_1$ alone; add $c_2$.", "这只是 $c_1$；还要加上 $c_2$。"),
          ]),
          solution: walked(
            [
              [
                ["Evaluate at t = 0", "在 t = 0 处求值"],
                t("", ""),
                [`\\mathbf{x}(0) = c_1${vec(1, 0)} + c_2${vec(0, 1)} = ${vec("c_1", "c_2")} = ${vec(u0, v0)}`],
              ],
              [["Add", "相加"], t("", ""), [`c_1 + c_2 = ${u0} + ${v0} = ${ans}`]],
            ],
            t(
              `$${u0}${vec(1, 0)} + ${v0}${vec(0, 1)} = ${vec(u0, v0)}$, the given initial state.`,
              `$${u0}${vec(1, 0)} + ${v0}${vec(0, 1)} = ${vec(u0, v0)}$，正是给定的初始状态。`,
            ),
          ),
        });
      },
    },
    {
      id: "fitting-the-general-solution-to-an-initial-state",
      title: t("Fitting the general solution to an initial state", "用初始状态确定通解"),
      explanation: t(
        "The general solution $\\mathbf{x}(t) = c_1 e^{\\lambda_1 t}\\mathbf{v}_1 + c_2 e^{\\lambda_2 t}\\mathbf{v}_2$ reduces at $t = 0$ to $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2 = \\mathbf{x}(0)$, because every exponential equals $1$ there. That is a linear system for the constants. With $\\mathbf{v}_1 = (1, m_1)$ and $\\mathbf{v}_2 = (1, m_2)$,\n\n$$c_1 + c_2 = x_1(0), \\qquad m_1c_1 + m_2c_2 = x_2(0).$$\n\nFor $\\mathbf{v}_1 = (1, 1)$, $\\mathbf{v}_2 = (1, 2)$ and $\\mathbf{x}(0) = (5, 7)$: subtracting gives $c_2 = 2$, then $c_1 = 3$.\n\n> **Watch out.** To eliminate $c_1$, subtract $m_1$ times the first equation, not the first equation itself; and divide by $m_2 - m_1$ at the end.",
        "通解 $\\mathbf{x}(t) = c_1 e^{\\lambda_1 t}\\mathbf{v}_1 + c_2 e^{\\lambda_2 t}\\mathbf{v}_2$ 在 $t = 0$ 时化为 $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2 = \\mathbf{x}(0)$，因为那时每个指数都等于 $1$。这是关于常数的线性方程组。当 $\\mathbf{v}_1 = (1, m_1)$，$\\mathbf{v}_2 = (1, m_2)$ 时，\n\n$$c_1 + c_2 = x_1(0), \\qquad m_1c_1 + m_2c_2 = x_2(0).$$\n\n对 $\\mathbf{v}_1 = (1, 1)$，$\\mathbf{v}_2 = (1, 2)$，$\\mathbf{x}(0) = (5, 7)$：相减得 $c_2 = 2$，于是 $c_1 = 3$。\n\n> **注意。** 消去 $c_1$ 时要减去第一个方程的 $m_1$ 倍，而不是第一个方程本身；最后还要除以 $m_2 - m_1$。",
      ),
      generate(rng: Rng): Problem {
        const l1 = rng.nonZero(-4, 4);
        const l2raw = l1 + rng.int(1, 4);
        const l2 = l2raw === 0 ? 1 : l2raw;
        const m1 = rng.nonZero(-4, 4);
        const m2 = m1 + rng.pick([-2, -1, 1, 2]);
        const c1 = rng.int(-5, 5) || 2;
        const c2 = rng.int(-5, 5) || -3;
        const p = c1 + c2;
        const q = m1 * c1 + m2 * c2;
        return numberProblem({
          prompt: t(
            `The general solution of a system is $\\mathbf{x}(t) = c_1 e^{${ex(l1)}}${vec(1, m1)} + c_2 e^{${ex(l2)}}${vec(1, m2)}$. Find $c_2$ for $\\mathbf{x}(0) = ${vec(p, q)}$.`,
            `某方程组的通解为 $\\mathbf{x}(t) = c_1 e^{${ex(l1)}}${vec(1, m1)} + c_2 e^{${ex(l2)}}${vec(1, m2)}$。当 $\\mathbf{x}(0) = ${vec(p, q)}$ 时求 $c_2$。`,
          ),
          answer: c2,
          mistakes: apart(c2, [
            why(c1, "That is $c_1$, the coefficient of the other solution.", "这是另一个解的系数 $c_1$。"),
            why(-c2, "The sign is flipped in the elimination.", "消元时符号弄反了。"),
            why(
              q - p,
              "That subtracts the first equation itself; subtract $m_1$ times it.",
              "这是直接减去第一个方程；应减去它的 $m_1$ 倍。",
            ),
            why(p, "That is $c_1 + c_2$, the first equation's total.", "这是 $c_1 + c_2$，第一个方程的右边。"),
          ]),
          solution: walked(
            [
              [
                ["Set t = 0", "令 t = 0"],
                t("Every exponential is $1$:", "每个指数都等于 $1$："),
                [`c_1 + c_2 = ${p}`, `${poly([m1, "c_1"], [m2, "c_2"])} = ${q}`],
              ],
              [
                ["Eliminate c_1", "消去 c_1"],
                t(`Subtract $${par(m1)}$ times the first equation:`, `减去第一个方程的 $${par(m1)}$ 倍：`),
                [...(m2 - m1 === 1 ? [] : [`${poly([m2 - m1, "c_2"])} = ${q - m1 * p}`]), `c_2 = ${c2}`],
              ],
            ],
            t(
              `With $c_1 = ${c1}$ and $c_2 = ${c2}$: $${cf(c1)}${vec(1, m1)} ${c2 < 0 ? "-" : "+"} ${cf(Math.abs(c2))}${vec(1, m2)} = ${vec(p, q)}$.`,
              `取 $c_1 = ${c1}$，$c_2 = ${c2}$：$${cf(c1)}${vec(1, m1)} ${c2 < 0 ? "-" : "+"} ${cf(Math.abs(c2))}${vec(1, m2)} = ${vec(p, q)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.14 Solving Systems of Linear ODEs
// ---------------------------------------------------------------------------

/** solvingDecoupledHomogeneousSystemsOfOdes solves diagonal systems. */
export const solvingDecoupledHomogeneousSystemsOfOdes: TopicDef = {
  id: "solving-decoupled-homogeneous-systems-of-odes",
  title: t("Solving Decoupled Homogeneous Systems of ODEs", "求解解耦的齐次线性微分方程组"),
  summary: t(
    "A decoupled system $x_1' = \\lambda_1 x_1$, $x_2' = \\lambda_2 x_2$ is two independent equations with solutions $x_1 = c_1 e^{\\lambda_1 t}$, $x_2 = c_2 e^{\\lambda_2 t}$.",
    "解耦方程组 $x_1' = \\lambda_1 x_1$，$x_2' = \\lambda_2 x_2$ 是两个独立的方程，解为 $x_1 = c_1 e^{\\lambda_1 t}$，$x_2 = c_2 e^{\\lambda_2 t}$。",
  ),
  intro: t(
    "Solve $x_1' = 2x_1$, $x_2' = -x_2$ with $x_1(0) = 3$ and $x_2(0) = 4$. Each equation contains only its own unknown, so each is solved alone: $x_1 = 3e^{2t}$ and $x_2 = 4e^{-t}$. At $t = \\ln 2$ the exponentials become powers of two, so $x_1 = 3 \\cdot 4 = 12$ and $x_2 = 4 \\cdot \\tfrac{1}{2} = 2$.\n\nCheck: $x_1' = 6e^{2t} = 2x_1$ and $x_2' = -4e^{-t} = -x_2$, and at $t = 0$ the solutions give $3$ and $4$.\n\nIn this lesson we solve systems whose matrix is diagonal, one component at a time.",
    "解 $x_1' = 2x_1$，$x_2' = -x_2$，$x_1(0) = 3$，$x_2(0) = 4$。每个方程只含自己的未知函数，所以分别求解：$x_1 = 3e^{2t}$，$x_2 = 4e^{-t}$。在 $t = \\ln 2$ 时指数变成 $2$ 的幂，所以 $x_1 = 3 \\cdot 4 = 12$，$x_2 = 4 \\cdot \\tfrac{1}{2} = 2$。\n\n检验：$x_1' = 6e^{2t} = 2x_1$，$x_2' = -4e^{-t} = -x_2$，且在 $t = 0$ 时两个解分别为 $3$ 和 $4$。\n\n本课我们求解矩阵为对角矩阵的方程组，一次处理一个分量。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-systems-of-odes"],
  encompasses: [
    {
      topic: "general-solutions-of-first-order-linear-systems-of-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "independent-exponential-solutions-of-diagonal-systems",
      title: t("Initial velocity in decoupled linear systems", "解耦系统的初始演化导数值"),
      explanation: t(
        "In a decoupled system each equation involves only its own unknown, so each component grows or decays exponentially at its own rate. For decoupled equations $x_1' = \\lambda_1 x_1$, the initial derivative is $x_1'(0) = \\lambda_1 x_1(0)$. For $x_1' = 4x_1$ with $x_1(0) = 3$, $x_1'(0) = 12$.\n\n> **Watch out.** The rate of $x_1$ multiplies $x_1(0)$ only; the second equation and $x_2(0)$ play no part in $x_1'(0)$.",
        "在解耦的方程组中，每个方程只含自己的未知函数，所以每个分量按各自的速率指数增长或衰减。在解耦系统 $x_1' = \\lambda_1 x_1$ 中，初始演化速度直接由 $x_1'(0) = \\lambda_1 x_1(0)$ 计算得到。对 $x_1' = 4x_1$，$x_1(0) = 3$，$x_1'(0) = 12$。\n\n> **注意。** $x_1$ 的速率只乘 $x_1(0)$；第二个方程和 $x_2(0)$ 与 $x_1'(0)$ 无关。",
      ),
      generate(rng: Rng): Problem {
        const lambda = rng.int(2, 12);
        const x0 = rng.int(2, 15);
        const ans = lambda * x0;
        return numberProblem({
          prompt: t(
            `Consider the decoupled linear system $x_1' = ${lambda}x_1$ and $x_2' = -5x_2$ with initial values $x_1(0) = ${x0}$ and $x_2(0) = 4$. Find the initial derivative $x_1'(0)$.`,
            `考虑解耦线性微分方程组 $x_1' = ${lambda}x_1$ 与 $x_2' = -5x_2$，初值为 $x_1(0) = ${x0}$ 和 $x_2(0) = 4$。求导数值 $x_1'(0)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(x0, "That is $x_1(0)$ itself; multiply it by the rate.", "这是 $x_1(0)$ 本身；还要乘以速率。"),
            why(lambda, "That is the rate alone; multiply it by $x_1(0)$.", "这只是速率；还要乘以 $x_1(0)$。"),
            why(-20, "That is $x_2'(0)$, from the other equation.", "这是另一个方程给出的 $x_2'(0)$。"),
            why(4 * lambda, "That multiplies the rate of $x_1$ by $x_2(0)$.", "这是用 $x_1$ 的速率乘了 $x_2(0)$。"),
          ]),
          solution: walked(
            [
              [
                ["Use the first equation", "用第一个方程"],
                t("It involves $x_1$ alone:", "它只含 $x_1$："),
                [`x_1'(0) = ${lambda}\\,x_1(0)`],
              ],
              [["Substitute", "代入"], t("", ""), [`x_1'(0) = ${lambda} \\cdot ${x0} = ${ans}`]],
            ],
            t(
              `The solution is $x_1 = ${x0}e^{${lambda}t}$, whose derivative $${ans}e^{${lambda}t}$ equals $${ans}$ at $t = 0$.`,
              `解为 $x_1 = ${x0}e^{${lambda}t}$，其导数 $${ans}e^{${lambda}t}$ 在 $t = 0$ 时等于 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "evaluating-a-decoupled-solution",
      title: t("Evaluating a decoupled solution", "求解耦方程组的解在某时刻的值"),
      explanation: t(
        "In a decoupled system each equation involves one unknown, so each solves on its own: $x_1' = ax_1$ gives $x_1 = x_1(0)e^{at}$ and $x_2' = bx_2$ gives $x_2 = x_2(0)e^{bt}$. At $t = \\ln 2$ the exponentials become powers of two, since\n\n$$e^{a\\ln 2} = 2^a.$$\n\nA negative rate gives a fraction such as $2^{-2} = \\tfrac{1}{4}$. For $x_1' = 3x_1$ with $x_1(0) = 5$: $x_1(\\ln 2) = 5 \\cdot 8 = 40$.\n\n> **Watch out.** $e^{a\\ln 2}$ is $2^a$, not $a$ or $2a$; and each component keeps its own rate, so do not swap them.",
        "在解耦方程组中，每个方程只含一个未知函数，因此可以分别求解：$x_1' = ax_1$ 得 $x_1 = x_1(0)e^{at}$，$x_2' = bx_2$ 得 $x_2 = x_2(0)e^{bt}$。在 $t = \\ln 2$ 时指数变成 $2$ 的幂，因为\n\n$$e^{a\\ln 2} = 2^a.$$\n\n负的速率给出分数，例如 $2^{-2} = \\tfrac{1}{4}$。对 $x_1' = 3x_1$，$x_1(0) = 5$：$x_1(\\ln 2) = 5 \\cdot 8 = 40$。\n\n> **注意。** $e^{a\\ln 2}$ 等于 $2^a$，不是 $a$ 或 $2a$；每个分量保留自己的速率，不要交换。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 3) || 2;
        const b = rng.int(-3, 3) || -1;
        const p = rng.int(-6, 6) || 3;
        const q = rng.int(-6, 6) || 5;
        const two = Q.of(2);
        const ans = Q.of(p)
          .mul(two.pow(a))
          .add(Q.of(q).mul(two.pow(b)));
        return numberProblem({
          prompt: t(
            `Solve $x_1' = ${poly([a, "x_1"])}$, $x_2' = ${poly([b, "x_2"])}$ with $x_1(0) = ${p}$, $x_2(0) = ${q}$, and find $x_1(\\ln 2) + x_2(\\ln 2)$.`,
            `解 $x_1' = ${poly([a, "x_1"])}$，$x_2' = ${poly([b, "x_2"])}$，$x_1(0) = ${p}$，$x_2(0) = ${q}$，并求 $x_1(\\ln 2) + x_2(\\ln 2)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              p * a + q * b,
              "That multiplies by the rates; the exponentials become $2^{a}$ and $2^{b}$.",
              "这是乘以速率；指数应变成 $2^{a}$ 与 $2^{b}$。",
            ),
            why(
              Q.of(p)
                .mul(two.pow(-a))
                .add(Q.of(q).mul(two.pow(-b))),
              "The signs of the exponents are flipped.",
              "指数的符号弄反了。",
            ),
            why(p + q, "That is the value at $t = 0$, not at $t = \\ln 2$.", "这是 $t = 0$ 时的值，不是 $t = \\ln 2$ 时的值。"),
            why(
              Q.of(p)
                .mul(two.pow(b))
                .add(Q.of(q).mul(two.pow(a))),
              "That swaps the rates of the two components.",
              "这是把两个分量的速率交换了。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Solve each equation", "分别求解"],
                t("", ""),
                [`x_1 = ${poly([p, `e^{${ex(a)}}`])}, \\qquad x_2 = ${poly([q, `e^{${ex(b)}}`])}`],
              ],
              [
                ["Evaluate at t = ln 2", "在 t = ln 2 处求值"],
                t("Use $e^{k\\ln 2} = 2^k$:", "用 $e^{k\\ln 2} = 2^k$："),
                [
                  `${p} \\cdot 2^{${a}} + ${par(q)} \\cdot 2^{${b}} = ${p} \\cdot ${two.pow(a).toLatex()} + ${par(q)} \\cdot ${parQ(two.pow(b))} = ${ans.toLatex()}`,
                ],
              ],
            ],
            t(
              `At $t = 0$ the solutions give $${p}$ and $${q}$, the initial values, and $x_1' = ${poly([a * p, `e^{${ex(a)}}`])} = ${poly([a, "x_1"])}$ as required.`,
              `在 $t = 0$ 时两个解分别为 $${p}$ 和 $${q}$，正是初值；且 $x_1' = ${poly([a * p, `e^{${ex(a)}}`])} = ${poly([a, "x_1"])}$，符合方程。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingHomogeneousSystemsOfOdesWithDistinctEigenvalues finds eigenvalues. */
export const solvingHomogeneousSystemsOfOdesWithDistinctEigenvalues: TopicDef = {
  id: "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues",
  title: t("Solving Homogeneous Systems of ODEs With Distinct Eigenvalues", "具有互异实特征值的齐次线性微分方程组求解"),
  summary: t(
    "When $A$ has distinct real eigenvalues $\\lambda_1 \\ne \\lambda_2$ with eigenvectors $\\mathbf{v}_1, \\mathbf{v}_2$, the general solution is $\\mathbf{x}(t) = c_1 e^{\\lambda_1 t}\\mathbf{v}_1 + c_2 e^{\\lambda_2 t}\\mathbf{v}_2$.",
    "当 $A$ 有互异实特征值 $\\lambda_1 \\ne \\lambda_2$ 及特征向量 $\\mathbf{v}_1, \\mathbf{v}_2$ 时，通解为 $\\mathbf{x}(t) = c_1 e^{\\lambda_1 t}\\mathbf{v}_1 + c_2 e^{\\lambda_2 t}\\mathbf{v}_2$。",
  ),
  intro: t(
    "Take $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$. Its characteristic polynomial is $(1 - \\lambda)^2 - 4 = (\\lambda - 3)(\\lambda + 1)$, so the eigenvalues are $3$ and $-1$, with eigenvectors $(1, 1)$ and $(1, -1)$. The general solution of $\\mathbf{x}' = A\\mathbf{x}$ is $\\mathbf{x} = c_1e^{3t}(1, 1) + c_2e^{-t}(1, -1)$.\n\nCheck: $A(1, 1) = (3, 3) = 3(1, 1)$ and $A(1, -1) = (-1, 1) = -(1, -1)$.\n\nIn this lesson we find eigenvalues and eigenvectors and build the general solution from them.",
    "取 $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$。其特征多项式为 $(1 - \\lambda)^2 - 4 = (\\lambda - 3)(\\lambda + 1)$，所以特征值为 $3$ 和 $-1$，特征向量为 $(1, 1)$ 和 $(1, -1)$。$\\mathbf{x}' = A\\mathbf{x}$ 的通解为 $\\mathbf{x} = c_1e^{3t}(1, 1) + c_2e^{-t}(1, -1)$。\n\n检验：$A(1, 1) = (3, 3) = 3(1, 1)$，$A(1, -1) = (-1, 1) = -(1, -1)$。\n\n本课我们求特征值与特征向量，并由它们构造通解。",
  ),
  prerequisites: ["solving-decoupled-homogeneous-systems-of-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "eigenvalue-eigenvector-method-for-linear-systems",
      title: t("Eigenvalues of a triangular coefficient matrix", "三角系数矩阵的特征值"),
      explanation: t(
        "The eigenvalues of a triangular matrix are its diagonal entries, and each eigenvalue with its eigenvector gives an exponential solution of the system. For a triangular matrix $A = \\begin{pmatrix} a & 0 \\\\ c & d \\end{pmatrix}$, the eigenvalues are the diagonal entries $\\lambda = a$ and $\\lambda = d$. For $A = \\begin{pmatrix} 2 & 0 \\\\ 7 & 5 \\end{pmatrix}$ they are $2$ and $5$.\n\n> **Watch out.** The zero above the diagonal makes $\\det(A - \\lambda I) = (a - \\lambda)(d - \\lambda)$, so the entry $c$ has no effect; the eigenvalues are not the trace or the determinant.",
        "三角矩阵的特征值就是它的对角元素，每个特征值及其特征向量给出方程组的一个指数解。对于下三角矩阵 $A = \\begin{pmatrix} a & 0 \\\\ c & d \\end{pmatrix}$，特征值即为其主对角线上的元素 $\\lambda = a$ 与 $\\lambda = d$。对 $A = \\begin{pmatrix} 2 & 0 \\\\ 7 & 5 \\end{pmatrix}$，它们是 $2$ 和 $5$。\n\n> **注意。** 对角线上方的零使 $\\det(A - \\lambda I) = (a - \\lambda)(d - \\lambda)$，所以元素 $c$ 不起作用；特征值不是迹，也不是行列式。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 10);
        const diff = rng.int(2, 20);
        const d = a + diff;
        const c = rng.int(1, 8);
        const ans = d;
        return numberProblem({
          prompt: t(
            `Find the larger eigenvalue $\\lambda$ of the system coefficient matrix $A = \\begin{pmatrix} ${a} & 0 \\\\ ${c} & ${d} \\end{pmatrix}$.`,
            `求系统系数矩阵 $A = \\begin{pmatrix} ${a} & 0 \\\\ ${c} & ${d} \\end{pmatrix}$ 中较大的特征值 $\\lambda$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(a, "That is the smaller of the two eigenvalues.", "这是两个特征值中较小的一个。"),
            why(a + d, "That is the trace, the sum of the eigenvalues.", "这是迹，即特征值之和。"),
            why(a * d, "That is the determinant, the product of the eigenvalues.", "这是行列式，即特征值之积。"),
            why(
              c,
              "That is the entry below the diagonal, which does not enter the characteristic polynomial.",
              "这是对角线下方的元素，它不出现在特征多项式中。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Form the characteristic polynomial", "写出特征多项式"],
                t("The zero entry removes the product of the off-diagonal entries:", "零元素使非对角元素之积消失："),
                [`\\det(A - \\lambda I) = (${a} - \\lambda)(${d} - \\lambda) - 0 \\cdot ${c} = (${a} - \\lambda)(${d} - \\lambda)`],
              ],
              [["Read the roots", "读出根"], t("", ""), [`\\lambda_1 = ${a}, \\qquad \\lambda_2 = ${d}`, `\\lambda = ${ans}`]],
            ],
            t(
              `$A - ${d}I = \\begin{pmatrix} ${a - d} & 0 \\\\ ${c} & 0 \\end{pmatrix}$ has a column of zeros, so its determinant is $0$ and $${d}$ is an eigenvalue.`,
              `$A - ${d}I = \\begin{pmatrix} ${a - d} & 0 \\\\ ${c} & 0 \\end{pmatrix}$ 有一列全为零，行列式为 $0$，所以 $${d}$ 是特征值。`,
            ),
          ),
        });
      },
    },
    {
      id: "finding-an-eigenvector-of-the-coefficient-matrix",
      title: t("Finding an eigenvector of the coefficient matrix", "求系数矩阵的特征向量"),
      explanation: t(
        "Each eigenvalue $\\lambda$ of $A$ gives a solution $e^{\\lambda t}\\mathbf{v}$, where $\\mathbf{v}$ solves $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$. Because $A - \\lambda I$ is singular, its two rows are proportional and one row is enough. Writing $\\mathbf{v} = (1, m)$, the first row of $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ gives\n\n$$(a - \\lambda) + bm = 0, \\qquad m = \\frac{\\lambda - a}{b}.$$\n\nFor $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$ and $\\lambda = 3$: $-2 + 2m = 0$, so $m = 1$.\n\n> **Watch out.** Subtract $\\lambda$ from the diagonal entry $a$ only, and move $a - \\lambda$ across before dividing: $m = (\\lambda - a)/b$, not $(a - \\lambda)/b$.",
        "$A$ 的每个特征值 $\\lambda$ 给出一个解 $e^{\\lambda t}\\mathbf{v}$，其中 $\\mathbf{v}$ 满足 $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$。由于 $A - \\lambda I$ 奇异，它的两行成比例，只用一行就够了。设 $\\mathbf{v} = (1, m)$，由 $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ 的第一行得\n\n$$(a - \\lambda) + bm = 0, \\qquad m = \\frac{\\lambda - a}{b}.$$\n\n对 $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$，$\\lambda = 3$：$-2 + 2m = 0$，所以 $m = 1$。\n\n> **注意。** 只从对角元素 $a$ 中减去 $\\lambda$，并且先把 $a - \\lambda$ 移项再除：$m = (\\lambda - a)/b$，而不是 $(a - \\lambda)/b$。",
      ),
      generate(rng: Rng): Problem {
        const l1 = rng.nonZero(-5, 5);
        const l2 = l1 + rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const m1 = rng.int(-4, 4);
        const m2 = m1 + rng.pick([-1, 1]);
        const [a, b, c, d] = fromEigen(l1, l2, m1, m2);
        return numberProblem({
          prompt: t(
            `One eigenvalue of $A = ${mat(a, b, c, d)}$ is $\\lambda = ${l1}$. Find $m$ so that $${vec(1, "m")}$ is an eigenvector for it, giving the solution $e^{${ex(l1)}}${vec(1, "m")}$ of $\\mathbf{x}' = A\\mathbf{x}$.`,
            `$A = ${mat(a, b, c, d)}$ 的一个特征值为 $\\lambda = ${l1}$。求 $m$，使 $${vec(1, "m")}$ 是对应的特征向量，从而 $e^{${ex(l1)}}${vec(1, "m")}$ 是 $\\mathbf{x}' = A\\mathbf{x}$ 的解。`,
          ),
          answer: m1,
          mistakes: apart(m1, [
            why(m2, "That is the eigenvector of the other eigenvalue.", "这是另一个特征值的特征向量。"),
            why(
              -m1,
              "The sign is off: move $a - \\lambda$ across before dividing by $b$.",
              "符号错了：先把 $a - \\lambda$ 移项，再除以 $b$。",
            ),
            why(l1 - a, "That forgets to divide by the entry $b$.", "这是忘了除以元素 $b$。"),
            why(l2, "That is the other eigenvalue, not an eigenvector entry.", "这是另一个特征值，而不是特征向量的分量。"),
          ]),
          solution: walked(
            [
              [
                ["Subtract the eigenvalue", "减去特征值"],
                t("The first row of $A - \\lambda I$:", "$A - \\lambda I$ 的第一行："),
                [`(${a} - ${par(l1)}, ${b}) = (${a - l1}, ${b})`],
              ],
              [["Solve for m", "解出 m"], t("", ""), [`${poly([a - l1, ""], [b, "m"])} = 0`, `m = ${m1}`]],
            ],
            t(
              `The second row agrees: $${c} + ${par(d - l1)} \\cdot ${par(m1)} = 0$.`,
              `第二行也成立：$${c} + ${par(d - l1)} \\cdot ${par(m1)} = 0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingHomogeneousSystemsOfOdesWithDistinctEigenvaluesAndInitialConditions solves IVP. */
export const solvingHomogeneousSystemsOfOdesWithDistinctEigenvaluesAndInitialConditions: TopicDef = {
  id: "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues-and-initial-conditions",
  title: t("Solving Homogeneous Systems of ODEs With Distinct Eigenvalues and Initial Conditions", "带初值条件的互异特征值齐次系统求解"),
  summary: t(
    "For $\\mathbf{x}' = A\\mathbf{x}$ with $\\mathbf{x}(0) = \\mathbf{x}_0$, find the constants by solving $c_1 \\mathbf{v}_1 + c_2 \\mathbf{v}_2 = \\mathbf{x}_0$.",
    "对 $\\mathbf{x}' = A\\mathbf{x}$，$\\mathbf{x}(0) = \\mathbf{x}_0$，通过解 $c_1 \\mathbf{v}_1 + c_2 \\mathbf{v}_2 = \\mathbf{x}_0$ 确定常数。",
  ),
  intro: t(
    "Solve $\\mathbf{x}' = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}\\mathbf{x}$ with $\\mathbf{x}(0) = (5, 1)$. The eigenvalues are $3$ and $-1$ with eigenvectors $(1, 1)$ and $(1, -1)$. At $t = 0$: $c_1 + c_2 = 5$ and $c_1 - c_2 = 1$, so $c_1 = 3$, $c_2 = 2$, and $\\mathbf{x} = 3e^{3t}(1, 1) + 2e^{-t}(1, -1)$.\n\nCheck: at $t = 0$ this gives $(3 + 2, 3 - 2) = (5, 1)$.\n\nIn this lesson we solve initial value problems for systems with distinct eigenvalues and read the long-run behavior of the solution.",
    "解 $\\mathbf{x}' = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}\\mathbf{x}$，$\\mathbf{x}(0) = (5, 1)$。特征值为 $3$ 和 $-1$，特征向量为 $(1, 1)$ 和 $(1, -1)$。在 $t = 0$ 时：$c_1 + c_2 = 5$，$c_1 - c_2 = 1$，所以 $c_1 = 3$，$c_2 = 2$，$\\mathbf{x} = 3e^{3t}(1, 1) + 2e^{-t}(1, -1)$。\n\n检验：在 $t = 0$ 时得 $(3 + 2, 3 - 2) = (5, 1)$。\n\n本课我们求解互异特征值方程组的初值问题，并读出解的长期行为。",
  ),
  prerequisites: ["solving-homogeneous-systems-of-odes-with-distinct-eigenvalues"],
  encompasses: [
    {
      topic: "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "initial-value-problems-for-diagonalizable-systems",
      title: t("Initial rate of change in diagonalized systems", "对角化系统中的初始变化率"),
      explanation: t(
        "The system itself gives the derivative at the start: multiply the coefficient matrix by the initial vector. For $\\mathbf{x}' = A \\mathbf{x}$, the initial derivative vector is $\\mathbf{x}'(0) = A \\mathbf{x}(0)$. For $A = \\operatorname{diag}(3, 5)$ and $\\mathbf{x}(0) = (2, 4)$, $\\mathbf{x}'(0) = (6, 20)$.\n\n> **Watch out.** With a diagonal matrix the first row is $(\\lambda_1, 0)$, so $x_1'(0) = \\lambda_1 x_1(0)$: pair the first eigenvalue with the first entry of $\\mathbf{x}(0)$.",
        "方程组本身给出了初始时刻的导数：用系数矩阵乘以初始向量。对于系统 $\\mathbf{x}' = A \\mathbf{x}$，初值处的演化导数向量为 $\\mathbf{x}'(0) = A \\mathbf{x}(0)$。对 $A = \\operatorname{diag}(3, 5)$，$\\mathbf{x}(0) = (2, 4)$，$\\mathbf{x}'(0) = (6, 20)$。\n\n> **注意。** 对角矩阵的第一行是 $(\\lambda_1, 0)$，所以 $x_1'(0) = \\lambda_1 x_1(0)$：第一个特征值要与 $\\mathbf{x}(0)$ 的第一个分量配对。",
      ),
      generate(rng: Rng): Problem {
        const lambda1 = rng.int(2, 10);
        const lambda2 = rng.int(2, 10);
        const x0 = rng.int(2, 15);
        const y0 = rng.int(2, 15);
        const ans = lambda1 * x0;
        return numberProblem({
          prompt: t(
            `A diagonal linear system satisfies $\\mathbf{x}' = \\begin{pmatrix} ${lambda1} & 0 \\\\ 0 & ${lambda2} \\end{pmatrix} \\mathbf{x}$ with initial state $\\mathbf{x}(0) = \\begin{pmatrix} ${x0} \\\\ ${y0} \\end{pmatrix}$. Find the initial rate of change $x_1'(0)$ of the first state variable.`,
            `对角线性微分方程组满足 $\\mathbf{x}' = \\begin{pmatrix} ${lambda1} & 0 \\\\ 0 & ${lambda2} \\end{pmatrix} \\mathbf{x}$，初始状态为 $\\mathbf{x}(0) = \\begin{pmatrix} ${x0} \\\\ ${y0} \\end{pmatrix}$。求第一状态变量的初始变化率 $x_1'(0)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(lambda2 * y0, "That is $x_2'(0)$, from the second row.", "这是由第二行得到的 $x_2'(0)$。"),
            why(lambda1 * y0, "That pairs the first eigenvalue with $x_2(0)$.", "这是把第一个特征值与 $x_2(0)$ 配对。"),
            why(x0 + y0, "That adds the initial values without the matrix.", "这是不经矩阵直接把初值相加。"),
            why(lambda1, "That is the rate alone; multiply it by $x_1(0)$.", "这只是速率；还要乘以 $x_1(0)$。"),
          ]),
          solution: walked(
            [
              [["Take the first row", "取第一行"], t("", ""), [`x_1' = ${lambda1}x_1 + 0 \\cdot x_2`]],
              [["Evaluate at t = 0", "在 t = 0 处求值"], t("", ""), [`x_1'(0) = ${lambda1} \\cdot ${x0} = ${ans}`]],
            ],
            t(
              `The solution has $x_1 = ${x0}e^{${lambda1}t}$, whose derivative at $t = 0$ is $${lambda1} \\cdot ${x0} = ${ans}$.`,
              `解中 $x_1 = ${x0}e^{${lambda1}t}$，其在 $t = 0$ 处的导数为 $${lambda1} \\cdot ${x0} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-long-run-direction-of-a-solution",
      title: t("The long-run direction of a solution", "解的长期方向"),
      explanation: t(
        "For $\\mathbf{x}(t) = c_1e^{\\lambda_1 t}\\mathbf{v}_1 + c_2e^{\\lambda_2 t}\\mathbf{v}_2$ with $\\lambda_1 > \\lambda_2$, the term with the larger eigenvalue dominates as $t \\to \\infty$ whenever $c_1 \\ne 0$. The ratio $x_2/x_1$ then tends to the slope of $\\mathbf{v}_1$. If the initial state lies on the line of $\\mathbf{v}_2$, then $c_1 = 0$ and the solution keeps the direction of $\\mathbf{v}_2$ forever. So find the constants from $\\mathbf{x}(0)$ before deciding. For $\\mathbf{x} = 3e^{3t}(1, 1) + 2e^{-t}(1, -1)$ the ratio tends to $1$.\n\n> **Watch out.** The ratio at $t = 0$ is not the long-run ratio, since the two terms grow at different rates; and the answer is a slope of an eigenvector, not an eigenvalue.",
        "对 $\\mathbf{x}(t) = c_1e^{\\lambda_1 t}\\mathbf{v}_1 + c_2e^{\\lambda_2 t}\\mathbf{v}_2$（$\\lambda_1 > \\lambda_2$），只要 $c_1 \\ne 0$，当 $t \\to \\infty$ 时含较大特征值的项占主导，比值 $x_2/x_1$ 趋于 $\\mathbf{v}_1$ 的斜率。若初始状态落在 $\\mathbf{v}_2$ 所在直线上，则 $c_1 = 0$，解始终保持 $\\mathbf{v}_2$ 的方向。所以先由 $\\mathbf{x}(0)$ 求出常数再下结论。对 $\\mathbf{x} = 3e^{3t}(1, 1) + 2e^{-t}(1, -1)$，比值趋于 $1$。\n\n> **注意。** $t = 0$ 时的比值不是长期比值，因为两项增长速率不同；答案是特征向量的斜率，而不是特征值。",
      ),
      generate(rng: Rng): Problem {
        // Neither eigenvalue is 0, so no solution step writes e^{0t}.
        const l2 = rng.pick([-5, -4, -3, -2, -1, 1, 2]);
        const l1 = rng.pick([1, 2, 3, 4].map((gap) => l2 + gap).filter((v) => v !== 0));
        const m1 = rng.int(-4, 4);
        const m2 = m1 + rng.pick([-1, 1]);
        const [a, b, c, d] = fromEigen(l1, l2, m1, m2);
        const c1 = rng.pick([0, 1, 2, -1, -2, 3]);
        const c2 = rng.pick([1, 2, -1, -3]);
        const p = c1 + c2;
        const q = m1 * c1 + m2 * c2;
        const ans = c1 === 0 ? m2 : m1;
        return numberProblem({
          prompt: t(
            `Solve $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ with $\\mathbf{x}(0) = ${vec(p, q)}$. Find $\\lim_{t \\to \\infty} \\frac{x_2(t)}{x_1(t)}$.`,
            `解 $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$，$\\mathbf{x}(0) = ${vec(p, q)}$。求 $\\lim_{t \\to \\infty} \\frac{x_2(t)}{x_1(t)}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            c1 === 0
              ? why(m1, "Here $c_1 = 0$, so the growing term is absent and cannot dominate.", "这里 $c_1 = 0$，增长项不存在，无法占主导。")
              : why(
                  m2,
                  "That is the slope of the decaying direction; the term with the larger eigenvalue dominates.",
                  "这是衰减方向的斜率；含较大特征值的项占主导。",
                ),
            why(l1, "That is an eigenvalue, not the slope of an eigenvector.", "这是特征值，而不是特征向量的斜率。"),
            ...(p === 0
              ? []
              : [
                  why(
                    Q.of(q, p),
                    "That is the ratio at $t = 0$, which changes as the terms grow at different rates.",
                    "这是 $t = 0$ 时的比值；由于两项增长速率不同，比值会变化。",
                  ),
                ]),
          ]),
          solution: walked(
            [
              [
                ["Find the eigenpairs", "求特征对"],
                t("", ""),
                [`\\lambda_1 = ${l1},\\ \\mathbf{v}_1 = ${vec(1, m1)}, \\qquad \\lambda_2 = ${l2},\\ \\mathbf{v}_2 = ${vec(1, m2)}`],
              ],
              [
                ["Fit the constants", "确定常数"],
                t("", ""),
                [`c_1 + c_2 = ${p}, \\qquad ${poly([m1, "c_1"], [m2, "c_2"])} = ${q}`, `c_1 = ${c1}, \\qquad c_2 = ${c2}`],
              ],
              [
                ["Find the dominant term", "找出主导项"],
                c1 === 0
                  ? t(
                      `Since $c_1 = 0$, the solution stays on the line of $${vec(1, m2)}$:`,
                      `因为 $c_1 = 0$，解始终在 $${vec(1, m2)}$ 所在直线上：`,
                    )
                  : t(`Since $c_1 \\ne 0$, the term $e^{${ex(l1)}}$ dominates:`, `因为 $c_1 \\ne 0$，$e^{${ex(l1)}}$ 项占主导：`),
                [`\\lim_{t \\to \\infty} \\frac{x_2}{x_1} = ${ans}`],
              ],
            ],
            c1 === 0
              ? t(
                  `$\\mathbf{x}(t) = ${cf(c2)}e^{${ex(l2)}}${vec(1, m2)}$, so $x_2/x_1 = ${m2}$ for every $t$.`,
                  `$\\mathbf{x}(t) = ${cf(c2)}e^{${ex(l2)}}${vec(1, m2)}$，所以对每个 $t$ 都有 $x_2/x_1 = ${m2}$。`,
                )
              : t(
                  `Dividing $x_1$ and $x_2$ by $e^{${ex(l1)}}$ leaves $${poly([c1, ""], [c2, `e^{${ex(l2 - l1)}}`])}$ and $${poly([m1 * c1, ""], [m2 * c2, `e^{${ex(l2 - l1)}}`])}$, which tend to $${c1}$ and $${m1 * c1}$; their ratio is $${m1}$.`,
                  `把 $x_1$ 与 $x_2$ 都除以 $e^{${ex(l1)}}$，得 $${poly([c1, ""], [c2, `e^{${ex(l2 - l1)}}`])}$ 与 $${poly([m1 * c1, ""], [m2 * c2, `e^{${ex(l2 - l1)}}`])}$，它们分别趋于 $${c1}$ 与 $${m1 * c1}$，比值为 $${m1}$。`,
                ),
          ),
        });
      },
    },
  ],
};

/** solvingHomogeneousSystemsOfOdesWithRepeatedEigenvalues finds generalized eigenvectors. */
export const solvingHomogeneousSystemsOfOdesWithRepeatedEigenvalues: TopicDef = {
  id: "solving-homogeneous-systems-of-odes-with-repeated-eigenvalues",
  title: t("Solving Homogeneous Systems of ODEs With Repeated Eigenvalues", "具有重特征值的齐次线性微分方程组求解"),
  summary: t(
    "When $A$ has a repeated eigenvalue $\\lambda$ with only one eigenvector $\\mathbf{v}$, a generalized eigenvector $\\mathbf{w}$ with $(A - \\lambda I)\\mathbf{w} = \\mathbf{v}$ gives $\\mathbf{x}(t) = e^{\\lambda t}(c_1 \\mathbf{v} + c_2(t\\mathbf{v} + \\mathbf{w}))$.",
    "当 $A$ 有二重特征值 $\\lambda$ 且只有一个特征向量 $\\mathbf{v}$ 时，取满足 $(A - \\lambda I)\\mathbf{w} = \\mathbf{v}$ 的广义特征向量 $\\mathbf{w}$，得 $\\mathbf{x}(t) = e^{\\lambda t}(c_1 \\mathbf{v} + c_2(t\\mathbf{v} + \\mathbf{w}))$。",
  ),
  intro: t(
    "Take $A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix}$. Its characteristic polynomial is $(\\lambda - 3)^2$, and $A - 3I = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ has only the eigenvector $\\mathbf{v} = (1, 0)$. The vector $\\mathbf{w} = (0, 1)$ satisfies $(A - 3I)\\mathbf{w} = \\mathbf{v}$, so $\\mathbf{x} = e^{3t}\\big(c_1(1, 0) + c_2(t(1, 0) + (0, 1))\\big)$.\n\nCheck: $x_2 = c_2e^{3t}$ solves $x_2' = 3x_2$, and $x_1 = (c_1 + c_2t)e^{3t}$ has $x_1' = 3x_1 + c_2e^{3t} = 3x_1 + x_2$.\n\nIn this lesson we solve systems with a repeated eigenvalue and a single eigenvector, where a factor of $t$ appears.",
    "取 $A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix}$。其特征多项式为 $(\\lambda - 3)^2$，而 $A - 3I = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ 只有特征向量 $\\mathbf{v} = (1, 0)$。向量 $\\mathbf{w} = (0, 1)$ 满足 $(A - 3I)\\mathbf{w} = \\mathbf{v}$，所以 $\\mathbf{x} = e^{3t}\\big(c_1(1, 0) + c_2(t(1, 0) + (0, 1))\\big)$。\n\n检验：$x_2 = c_2e^{3t}$ 满足 $x_2' = 3x_2$，$x_1 = (c_1 + c_2t)e^{3t}$ 满足 $x_1' = 3x_1 + c_2e^{3t} = 3x_1 + x_2$。\n\n本课我们求解有重特征值且只有一个特征向量的方程组，此时解中出现因子 $t$。",
  ),
  prerequisites: ["solving-homogeneous-systems-of-odes-with-distinct-eigenvalues"],
  encompasses: [
    {
      topic: "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "generalized-eigenvectors-for-defective-systems",
      title: t("Generalized eigenvectors for defective systems", "亏损矩阵的广义特征向量"),
      explanation: t(
        "When a matrix lacks enough eigenvectors, a generalized eigenvector provides a second solution that includes a factor of time. For a Jordan block $A = \\begin{pmatrix} \\lambda & k \\\\ 0 & \\lambda \\end{pmatrix}$, $(A - \\lambda I) = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$. If the eigenvector is $\\mathbf{v} = \\begin{pmatrix} k \\\\ 0 \\end{pmatrix}$, then $\\mathbf{w} = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$ satisfies $(A - \\lambda I)\\mathbf{w} = \\mathbf{v}$. A repeated eigenvalue $\\lambda$ makes the characteristic polynomial $(r - \\lambda)^2$, so a trace of $2\\lambda$ and a determinant of $\\lambda^2$. For $A = \\begin{pmatrix} 5 & 1 \\\\ -1 & 3 \\end{pmatrix}$: trace $8$, determinant $16$, so $\\lambda = 4$.\n\n> **Watch out.** When the matrix is not triangular its diagonal entries are not the eigenvalues; the repeated eigenvalue is half the trace.",
        "当矩阵的特征向量不够时，广义特征向量提供了含有时间因子的第二个解。对于若尔当块矩阵 $A = \\begin{pmatrix} \\lambda & k \\\\ 0 & \\lambda \\end{pmatrix}$，有 $(A - \\lambda I) = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$。若特征向量为 $\\mathbf{v} = \\begin{pmatrix} k \\\\ 0 \\end{pmatrix}$，则广义特征向量 $\\mathbf{w} = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$ 满足 $(A - \\lambda I)\\mathbf{w} = \\mathbf{v}$。 二重特征值 $\\lambda$ 使特征多项式为 $(r - \\lambda)^2$，所以迹为 $2\\lambda$，行列式为 $\\lambda^2$。对 $A = \\begin{pmatrix} 5 & 1 \\\\ -1 & 3 \\end{pmatrix}$：迹为 $8$，行列式为 $16$，所以 $\\lambda = 4$。\n\n> **注意。** 矩阵不是三角矩阵时，对角元素不是特征值；二重特征值等于迹的一半。",
      ),
      generate(rng: Rng): Problem {
        const lambda = rng.int(2, 12);
        const u = rng.int(1, 3);
        const v = rng.int(1, 3);
        const a = rng.pick([1, -1]) * u * v;
        const s = rng.pick([1, -1]);
        const b = s * u * u;
        const c = -s * v * v;
        const ans = lambda;
        const p = lambda + a;
        const q = lambda - a;
        return numberProblem({
          prompt: t(
            `Find the repeated eigenvalue $\\lambda$ of the defective system matrix $A = \\begin{pmatrix} ${p} & ${b} \\\\ ${c} & ${q} \\end{pmatrix}$.`,
            `求亏损系统矩阵 $A = \\begin{pmatrix} ${p} & ${b} \\\\ ${c} & ${q} \\end{pmatrix}$ 的二重特征值 $\\lambda$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(2 * lambda, "That is the trace; a repeated eigenvalue is half of it.", "这是迹；二重特征值是它的一半。"),
            why(p, "That is a diagonal entry; this matrix is not triangular.", "这是一个对角元素；这个矩阵不是三角矩阵。"),
            why(q, "That is a diagonal entry; this matrix is not triangular.", "这是一个对角元素；这个矩阵不是三角矩阵。"),
            why(lambda * lambda, "That is the determinant, the square of the eigenvalue.", "这是行列式，即特征值的平方。"),
          ]),
          solution: walked(
            [
              [
                ["Find the trace and determinant", "求迹与行列式"],
                t("", ""),
                [
                  `\\operatorname{tr}(A) = ${p} + ${par(q)} = ${2 * lambda}`,
                  `\\det(A) = ${par(p)} \\cdot ${par(q)} - ${par(b)} \\cdot ${par(c)} = ${lambda * lambda}`,
                ],
              ],
              [
                ["Factor", "因式分解"],
                t("", ""),
                [`\\lambda^2 - ${2 * lambda}\\lambda + ${lambda * lambda} = (\\lambda - ${lambda})^2`, `\\lambda = ${ans}`],
              ],
            ],
            t(
              `The discriminant is $${2 * lambda}^2 - 4 \\cdot ${lambda * lambda} = 0$, so the root is repeated, and $A - ${lambda}I = ${mat(a, b, c, -a)}$ is not zero, so there is only one eigenvector.`,
              `判别式为 $${2 * lambda}^2 - 4 \\cdot ${lambda * lambda} = 0$，所以是重根；而 $A - ${lambda}I = ${mat(a, b, c, -a)}$ 不为零矩阵，所以只有一个特征向量。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-secular-term-of-a-defective-system",
      title: t("The secular term of a defective system", "亏损方程组的长期项"),
      explanation: t(
        "When $A$ has a repeated eigenvalue $\\lambda = \\tfrac{1}{2}\\operatorname{tr}(A)$ but only one eigenvector, the matrix $N = A - \\lambda I$ satisfies $N^2 = 0$. Then $e^{At} = e^{\\lambda t}(I + tN)$, so\n\n$$\\mathbf{x}(t) = e^{\\lambda t}\\big(\\mathbf{x}(0) + t\\,\\mathbf{w}\\big), \\qquad \\mathbf{w} = (A - \\lambda I)\\mathbf{x}(0).$$\n\nThe vector $\\mathbf{w}$ multiplies the extra factor $t$ that appears only in the repeated case. For $A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix}$ and $\\mathbf{x}(0) = (2, 5)$: $\\mathbf{w} = (5, 0)$.\n\n> **Watch out.** Multiply by $A - \\lambda I$, not by $A$: subtract $\\lambda$ from both diagonal entries first.",
        "当 $A$ 有重特征值 $\\lambda = \\tfrac{1}{2}\\operatorname{tr}(A)$ 而只有一个特征向量时，矩阵 $N = A - \\lambda I$ 满足 $N^2 = 0$。于是 $e^{At} = e^{\\lambda t}(I + tN)$，从而\n\n$$\\mathbf{x}(t) = e^{\\lambda t}\\big(\\mathbf{x}(0) + t\\,\\mathbf{w}\\big), \\qquad \\mathbf{w} = (A - \\lambda I)\\mathbf{x}(0).$$\n\n向量 $\\mathbf{w}$ 乘的是只在重根情形出现的额外因子 $t$。对 $A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix}$，$\\mathbf{x}(0) = (2, 5)$：$\\mathbf{w} = (5, 0)$。\n\n> **注意。** 要乘 $A - \\lambda I$ 而不是 $A$：先从两个对角元素中减去 $\\lambda$。",
      ),
      generate(rng: Rng): Problem {
        const l = rng.int(-4, 4);
        const u = rng.int(-2, 2) || 1;
        const v = rng.pick([-2, -1, 1, 2]);
        const [n11, n12, n21, n22] = [u * v, -u * u, v * v, -u * v];
        const p = rng.int(-4, 4) || 2;
        const q = rng.int(-4, 4) || -1;
        const comp = rng.int(1, 2);
        const w1 = n11 * p + n12 * q;
        const w2 = n21 * p + n22 * q;
        const ans = comp === 1 ? w1 : w2;
        const [a, b, c, d] = [l + n11, n12, n21, l + n22];
        return numberProblem({
          prompt: t(
            `The matrix $A = ${mat(a, b, c, d)}$ has a repeated eigenvalue. The solution of $\\mathbf{x}' = A\\mathbf{x}$ with $\\mathbf{x}(0) = ${vec(p, q)}$ has the form $e^{\\lambda t}(\\mathbf{x}(0) + t\\mathbf{w})$. Find $w_{${comp}}$.`,
            `矩阵 $A = ${mat(a, b, c, d)}$ 有重特征值。$\\mathbf{x}' = A\\mathbf{x}$ 满足 $\\mathbf{x}(0) = ${vec(p, q)}$ 的解形如 $e^{\\lambda t}(\\mathbf{x}(0) + t\\mathbf{w})$。求 $w_{${comp}}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              comp === 1 ? a * p + b * q : c * p + d * q,
              "That multiplies by $A$; subtract $\\lambda I$ first.",
              "这是乘了 $A$；要先减去 $\\lambda I$。",
            ),
            why(-ans, "The sign is flipped.", "符号反了。"),
            why(comp === 1 ? w2 : w1, "That is the other component of $\\mathbf{w}$.", "这是 $\\mathbf{w}$ 的另一个分量。"),
            why(
              comp === 1 ? p : q,
              "That is the entry of $\\mathbf{x}(0)$; $\\mathbf{w}$ is $(A - \\lambda I)\\mathbf{x}(0)$.",
              "这是 $\\mathbf{x}(0)$ 的分量；$\\mathbf{w}$ 是 $(A - \\lambda I)\\mathbf{x}(0)$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the eigenvalue", "求特征值"],
                t("", ""),
                [
                  `\\lambda = \\tfrac{1}{2}\\operatorname{tr}(A) = \\tfrac{1}{2}(${a} + ${par(d)}) = ${l}`,
                  `A - ${par(l)}I = ${mat(n11, n12, n21, n22)}`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                t("", ""),
                [`\\mathbf{w} = ${mat(n11, n12, n21, n22)}${vec(p, q)} = ${vec(w1, w2)}`, `w_{${comp}} = ${ans}`],
              ],
            ],
            t(
              `Since $N^2 = 0$, $N\\mathbf{w} = N^2\\mathbf{x}(0)$ must vanish, and indeed $${mat(n11, n12, n21, n22)}${vec(w1, w2)} = ${vec(0, 0)}$.`,
              `由于 $N^2 = 0$，$N\\mathbf{w} = N^2\\mathbf{x}(0)$ 必为零；确实 $${mat(n11, n12, n21, n22)}${vec(w1, w2)} = ${vec(0, 0)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingHomogeneousSystemsOfOdesWithComplexEigenvalues converts to real solutions. */
export const solvingHomogeneousSystemsOfOdesWithComplexEigenvalues: TopicDef = {
  id: "solving-homogeneous-systems-of-odes-with-complex-eigenvalues",
  title: t("Solving Homogeneous Systems of ODEs With Complex Eigenvalues", "具有复特征值的齐次线性微分方程组求解"),
  summary: t(
    "Complex eigenvalues $\\alpha \\pm i\\beta$ give spiraling solutions with angular frequency $\\beta$ inside the envelope $e^{\\alpha t}$.",
    "共轭复特征值 $\\alpha \\pm i\\beta$ 给出角频率为 $\\beta$、包络为 $e^{\\alpha t}$ 的螺旋解。",
  ),
  intro: t(
    "Take $A = \\begin{pmatrix} 1 & -2 \\\\ 2 & 1 \\end{pmatrix}$. Its characteristic polynomial is $(1 - \\lambda)^2 + 4$, so $\\lambda = 1 \\pm 2i$. The real solutions are $e^{t}$ times combinations of $\\cos 2t$ and $\\sin 2t$, for example $\\mathbf{x} = e^{t}(\\cos 2t, \\sin 2t)$: a spiral turning at angular frequency $2$ while its size grows like $e^{t}$.\n\nCheck: the trace $2$ is $2\\alpha$ and the determinant $5$ is $\\alpha^2 + \\beta^2 = 1 + 4$.\n\nIn this lesson we turn complex eigenvalues into real oscillating solutions and read their frequency and growth rate.",
    "取 $A = \\begin{pmatrix} 1 & -2 \\\\ 2 & 1 \\end{pmatrix}$。其特征多项式为 $(1 - \\lambda)^2 + 4$，所以 $\\lambda = 1 \\pm 2i$。实解是 $e^{t}$ 乘以 $\\cos 2t$ 与 $\\sin 2t$ 的组合，例如 $\\mathbf{x} = e^{t}(\\cos 2t, \\sin 2t)$：以角频率 $2$ 旋转、尺寸按 $e^{t}$ 增长的螺旋线。\n\n检验：迹 $2$ 等于 $2\\alpha$，行列式 $5$ 等于 $\\alpha^2 + \\beta^2 = 1 + 4$。\n\n本课我们把复特征值化为实的振荡解，并读出其频率与增长率。",
  ),
  prerequisites: ["solving-homogeneous-systems-of-odes-with-distinct-eigenvalues"],
  encompasses: [
    {
      topic: "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "real-solutions-from-complex-eigenvalues",
      figure:
        differentialEquationsDrawings1[
          "solving-homogeneous-systems-of-odes-with-complex-eigenvalues#real-solutions-from-complex-eigenvalues"
        ],
      title: t("Angular frequency from complex eigenvalues", "复特征值的旋转角频率"),
      explanation: t(
        "A pair of complex eigenvalues produces rotating solutions, with the real part controlling growth and the imaginary part setting the angular frequency. For $A = \\begin{pmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{pmatrix}$, the characteristic roots are $\\lambda = \\alpha \\pm i\\beta$, producing trajectories oscillating with angular speed $\\beta$. For $A = \\begin{pmatrix} 2 & -5 \\\\ 5 & 2 \\end{pmatrix}$ the frequency is $5$.\n\n> **Watch out.** The real part $\\alpha$ is the growth rate, not the frequency; and the frequency is $\\beta$ itself, not $\\beta^2$ from the characteristic equation.",
        "一对复特征值产生旋转的解，实部控制增长，虚部决定角频率。对于标准旋转伸缩矩阵 $A = \\begin{pmatrix} \\alpha & -\\beta \\\\ \\beta & \\alpha \\end{pmatrix}$，其特征值为 $\\lambda = \\alpha \\pm i\\beta$，轨迹具有旋转角频率 $\\beta$。对 $A = \\begin{pmatrix} 2 & -5 \\\\ 5 & 2 \\end{pmatrix}$，频率为 $5$。\n\n> **注意。** 实部 $\\alpha$ 是增长率，不是频率；频率是 $\\beta$ 本身，而不是特征方程中的 $\\beta^2$。",
      ),
      generate(rng: Rng): Problem {
        const alpha = rng.int(1, 10);
        const beta = rng.int(2, 35);
        const ans = beta;
        return numberProblem({
          prompt: t(
            `Find the angular frequency $\\beta > 0$ of the oscillating solution components for the linear system $\\mathbf{x}' = \\begin{pmatrix} ${alpha} & -${beta} \\\\ ${beta} & ${alpha} \\end{pmatrix} \\mathbf{x}$.`,
            `求线性微分方程组 $\\mathbf{x}' = \\begin{pmatrix} ${alpha} & -${beta} \\\\ ${beta} & ${alpha} \\end{pmatrix} \\mathbf{x}$ 的解向量振荡角频率 $\\beta > 0$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(alpha, "That is the real part, which sets the growth rate.", "这是实部，它决定增长率。"),
            why(
              beta * beta,
              "That is $\\beta^2$ from the characteristic equation; take its square root.",
              "这是特征方程中的 $\\beta^2$；还要开平方。",
            ),
            why(
              alpha + beta,
              "That adds the real and imaginary parts; the frequency is the imaginary part alone.",
              "这是把实部与虚部相加；频率只是虚部。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Form the characteristic equation", "写出特征方程"],
                t("", ""),
                [`\\det(A - \\lambda I) = (${alpha} - \\lambda)^2 + ${beta * beta} = 0`],
              ],
              [
                ["Solve", "求解"],
                t("", ""),
                [`(\\lambda - ${alpha})^2 = -${beta * beta}, \\qquad \\lambda = ${alpha} \\pm ${beta}i`, `\\beta = ${ans}`],
              ],
            ],
            t(
              `The trace $${2 * alpha}$ is $2\\alpha$ and the determinant $${alpha * alpha + beta * beta}$ is $${alpha}^2 + ${beta}^2$, as the roots $${alpha} \\pm ${beta}i$ require.`,
              `迹 $${2 * alpha}$ 等于 $2\\alpha$，行列式 $${alpha * alpha + beta * beta}$ 等于 $${alpha}^2 + ${beta}^2$，与根 $${alpha} \\pm ${beta}i$ 相符。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-frequency-of-a-general-oscillating-system",
      title: t("The frequency of a general oscillating system", "一般振荡方程组的频率"),
      explanation: t(
        "The eigenvalues of a $2 \\times 2$ matrix are $\\lambda = \\alpha \\pm \\beta i$ with\n\n$$\\alpha = \\tfrac{1}{2}\\operatorname{tr}(A), \\qquad \\beta^2 = \\det(A) - \\alpha^2,$$\n\nwhenever the right side of the second formula is positive. The real solutions are then $e^{\\alpha t}$ times combinations of $\\cos \\beta t$ and $\\sin \\beta t$. The frequency comes from both the trace and the determinant, not from an off-diagonal entry alone. For $A = \\begin{pmatrix} 3 & -5 \\\\ 2 & -1 \\end{pmatrix}$: $\\alpha = 1$, $\\det(A) = 7$, $\\beta^2 = 6$, so $\\beta = \\sqrt{6}$.\n\n> **Watch out.** Subtract $\\alpha^2$ from the determinant before taking the square root, and give $\\beta$, not $\\beta^2$.",
        "$2 \\times 2$ 矩阵的特征值为 $\\lambda = \\alpha \\pm \\beta i$，其中\n\n$$\\alpha = \\tfrac{1}{2}\\operatorname{tr}(A), \\qquad \\beta^2 = \\det(A) - \\alpha^2,$$\n\n前提是第二个式子右边为正。此时实解是 $e^{\\alpha t}$ 乘以 $\\cos \\beta t$ 与 $\\sin \\beta t$ 的组合。频率同时由迹和行列式决定，而不是仅由某个非对角元素决定。对 $A = \\begin{pmatrix} 3 & -5 \\\\ 2 & -1 \\end{pmatrix}$：$\\alpha = 1$，$\\det(A) = 7$，$\\beta^2 = 6$，所以 $\\beta = \\sqrt{6}$。\n\n> **注意。** 先从行列式中减去 $\\alpha^2$ 再开平方，答案是 $\\beta$ 而不是 $\\beta^2$。",
      ),
      generate(rng: Rng): Problem {
        const al = rng.int(-3, 3);
        const be = rng.int(1, 5);
        const u = rng.int(-3, 3);
        const n = u * u + be * be;
        const divs = Array.from({ length: n }, (_, i) => i + 1).filter((k) => n % k === 0);
        const v = rng.pick(divs) * rng.pick([-1, 1]);
        const w = n / v;
        const [a, b, c, d] = [al + u, -v, w, al - u];
        const det = a * d - b * c;
        return numberProblem({
          prompt: t(
            `The real solutions of $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ are $e^{\\alpha t}$ times combinations of $\\cos \\beta t$ and $\\sin \\beta t$ with $\\beta > 0$. Find $\\beta$.`,
            `$\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ 的实解是 $e^{\\alpha t}$ 乘以 $\\cos \\beta t$ 与 $\\sin \\beta t$ 的组合，其中 $\\beta > 0$。求 $\\beta$。`,
          ),
          answer: be,
          mistakes: apart(be, [
            why(be * be, "That is $\\beta^2$; take its square root.", "这是 $\\beta^2$；还要开平方。"),
            why(
              Math.abs(v),
              "That reads an off-diagonal entry; the frequency comes from the trace and determinant.",
              "这是读了非对角元素；频率由迹和行列式决定。",
            ),
            why(al, "That is $\\alpha$, the growth rate.", "这是增长率 $\\alpha$。"),
            why(
              det,
              "That is the determinant before subtracting $\\alpha^2$ and taking the root.",
              "这是行列式，还没有减去 $\\alpha^2$ 并开平方。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the trace and determinant", "求迹与行列式"],
                t("", ""),
                [`\\operatorname{tr}(A) = ${2 * al}, \\qquad \\det(A) = ${det}, \\qquad \\alpha = ${al}`],
              ],
              [["Find beta", "求 beta"], t("", ""), [`\\beta^2 = ${det} - ${par(al)}^2 = ${be * be}`, `\\beta = ${be}`]],
            ],
            t(
              `The roots $${al === 0 ? "" : `${al} `}\\pm ${be === 1 ? "" : be}i$ have sum $${2 * al}$, the trace, and product $${al * al} + ${be * be} = ${det}$, the determinant.`,
              `根 $${al === 0 ? "" : `${al} `}\\pm ${be === 1 ? "" : be}i$ 之和为 $${2 * al}$，即迹；之积为 $${al * al} + ${be * be} = ${det}$，即行列式。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingInhomogeneousSystemsOfOdes finds steady-state particular vectors. */
export const solvingInhomogeneousSystemsOfOdes: TopicDef = {
  id: "solving-inhomogeneous-systems-of-odes",
  title: t("Solving Inhomogeneous Systems of ODEs", "非齐次线性微分方程组求解"),
  summary: t(
    "For $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{b}$ with a constant vector $\\mathbf{b}$ and invertible $A$, the constant particular solution is $\\mathbf{x}_p = -A^{-1}\\mathbf{b}$.",
    "对常向量激励 $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{b}$ 且 $A$ 可逆，常数特解为 $\\mathbf{x}_p = -A^{-1}\\mathbf{b}$。",
  ),
  intro: t(
    "Find the constant solution of $x_1' = -2x_1 + x_2 + 1$, $x_2' = x_1 - 2x_2 + 4$. A constant solution has zero derivative, so $-2x_1 + x_2 = -1$ and $x_1 - 2x_2 = -4$. Doubling the second and adding gives $-3x_2 = -9$, so $x_2 = 3$ and $x_1 = 2$. The general solution is this constant plus the solution of the homogeneous system.\n\nCheck: $-4 + 3 + 1 = 0$ and $2 - 6 + 4 = 0$.\n\nIn this lesson we find the constant particular solution of a system with constant forcing.",
    "求 $x_1' = -2x_1 + x_2 + 1$，$x_2' = x_1 - 2x_2 + 4$ 的常数解。常数解的导数为零，所以 $-2x_1 + x_2 = -1$，$x_1 - 2x_2 = -4$。把第二式乘 $2$ 后相加得 $-3x_2 = -9$，所以 $x_2 = 3$，$x_1 = 2$。通解是这个常数解加上齐次方程组的解。\n\n检验：$-4 + 3 + 1 = 0$，$2 - 6 + 4 = 0$。\n\n本课我们求常数强迫项方程组的常数特解。",
  ),
  prerequisites: ["solving-homogeneous-systems-of-odes-with-distinct-eigenvalues"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "undetermined-coefficients-for-constant-forcing-vectors",
      title: t("Steady-state particular solution for constant forcing", "常数激励下的稳态特解向量"),
      explanation: t(
        "With constant forcing, try a constant particular solution; setting the derivative to zero leaves a linear system for the steady state. For $\\mathbf{x}' = A \\mathbf{x} + \\mathbf{b}$ where $A = \\operatorname{diag}(a, d)$, setting $\\mathbf{x}_p = \\mathbf{c}$ gives $A \\mathbf{c} + \\mathbf{b} = \\mathbf{0} \\implies c_1 = -b_1 / a$. For $x_1' = -4x_1 + 12$ the steady state is $x_1 = 3$.\n\n> **Watch out.** At the steady state the derivative is zero, not $x_1$; so solve $-ax_1 + b_1 = 0$ by dividing $b_1$ by $a$, not by subtracting.",
        "当强迫项是常数时，试探常数特解；令导数为零，就得到关于稳态的线性方程组。对于对角系统 $\\mathbf{x}' = A \\mathbf{x} + \\mathbf{b}$，设常数特解 $\\mathbf{x}_p = \\mathbf{c}$，代入平衡条件 $A \\mathbf{c} + \\mathbf{b} = \\mathbf{0}$，得第一分量为 $c_1 = -b_1 / a$。对 $x_1' = -4x_1 + 12$，稳态为 $x_1 = 3$。\n\n> **注意。** 稳态时为零的是导数，而不是 $x_1$；解 $-ax_1 + b_1 = 0$ 要用 $b_1$ 除以 $a$，而不是相减。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const c1 = rng.int(2, 25);
        const b1 = a * c1;
        const ans = c1;
        return numberProblem({
          prompt: t(
            `Find the magnitude of the steady-state value $|x_1|$ for the decoupled inhomogeneous system $x_1' = -${a}x_1 + ${b1}$.`,
            `求非齐次一阶常微分方程 $x_1' = -${a}x_1 + ${b1}$ 的稳态平衡值 $|x_1|$ 的大小。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(b1, "That is the forcing term; divide it by the rate.", "这是强迫项；还要除以速率。"),
            why(a, "That is the rate, not the steady state.", "这是速率，不是稳态值。"),
            why(
              b1 - a,
              "That subtracts the rate; solving $-ax_1 + b_1 = 0$ divides by it.",
              "这是减去速率；解 $-ax_1 + b_1 = 0$ 应除以速率。",
            ),
          ]),
          solution: walked(
            [
              [["Set the derivative to zero", "令导数为零"], t("", ""), [`-${a}x_1 + ${b1} = 0`]],
              [["Solve", "求解"], t("", ""), [`x_1 = \\frac{${b1}}{${a}} = ${ans}`]],
            ],
            t(
              `$-${a} \\cdot ${ans} + ${b1} = 0$, so $x_1 = ${ans}$ makes the derivative vanish.`,
              `$-${a} \\cdot ${ans} + ${b1} = 0$，所以 $x_1 = ${ans}$ 使导数为零。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-equilibrium-of-a-coupled-forced-system",
      title: t("The equilibrium of a coupled forced system", "耦合受迫方程组的平衡解"),
      explanation: t(
        "For $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{b}$ with a constant vector $\\mathbf{b}$, a constant particular solution $\\mathbf{x}_p$ must have zero derivative, so\n\n$$A\\mathbf{x}_p + \\mathbf{b} = \\mathbf{0}, \\qquad \\mathbf{x}_p = -A^{-1}\\mathbf{b}.$$\n\nWhen the system is coupled this is a genuine linear system: solve both equations together rather than dividing each forcing term by a diagonal entry. For $x_1' = -2x_1 + x_2 + 1$, $x_2' = x_1 - 2x_2 + 4$ the equilibrium is $(2, 3)$.\n\n> **Watch out.** Move the constants across with their signs changed: $A\\mathbf{x}_p = -\\mathbf{b}$; and dividing $-b_1$ by $a$ ignores the coupling term.",
        "对 $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{b}$（$\\mathbf{b}$ 为常向量），常数特解 $\\mathbf{x}_p$ 的导数为零，所以\n\n$$A\\mathbf{x}_p + \\mathbf{b} = \\mathbf{0}, \\qquad \\mathbf{x}_p = -A^{-1}\\mathbf{b}.$$\n\n方程组耦合时这是一个真正的线性方程组：要把两个方程联立求解，而不是把各强迫项分别除以对角元素。对 $x_1' = -2x_1 + x_2 + 1$，$x_2' = x_1 - 2x_2 + 4$，平衡解为 $(2, 3)$。\n\n> **注意。** 常数移项时要变号：$A\\mathbf{x}_p = -\\mathbf{b}$；用 $a$ 去除 $-b_1$ 忽略了耦合项。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c, d] = rng.pick([
          [2, 1, 1, 1],
          [-3, 1, 2, -1],
          [1, 2, 1, 3],
          [-2, 3, 1, -2],
          [3, 2, 1, 1],
          [-1, -2, 1, 1],
        ] as const);
        const x = rng.int(-5, 5);
        const y = rng.int(-5, 5) || 2;
        const b1 = -(a * x + b * y);
        const b2 = -(c * x + d * y);
        const comp = rng.int(1, 2);
        const ans = comp === 1 ? x : y;
        return numberProblem({
          prompt: t(
            `Find the constant solution of $x_1' = ${poly([a, "x_1"], [b, "x_2"], [b1, ""])}$, $x_2' = ${poly([c, "x_1"], [d, "x_2"], [b2, ""])}$ and give its component $x_{${comp}}$.`,
            `求 $x_1' = ${poly([a, "x_1"], [b, "x_2"], [b1, ""])}$，$x_2' = ${poly([c, "x_1"], [d, "x_2"], [b2, ""])}$ 的常数解，并给出分量 $x_{${comp}}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(comp === 1 ? y : x, "That is the other component.", "这是另一个分量。"),
            why(-ans, "The sign is flipped: the constants change sign when moved across.", "符号反了：常数移项时要变号。"),
            why(
              comp === 1 ? Q.of(-b1, a) : Q.of(-b2, d),
              "That divides by the diagonal entry and ignores the coupling term.",
              "这是除以对角元素，忽略了耦合项。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Set both derivatives to zero", "令两个导数为零"],
                t("", ""),
                [`${poly([a, "x_1"], [b, "x_2"])} = ${-b1}`, `${poly([c, "x_1"], [d, "x_2"])} = ${-b2}`],
              ],
              [
                ["Solve together", "联立求解"],
                t(`The determinant is $${a * d - b * c}$, so Cramer's rule gives:`, `行列式为 $${a * d - b * c}$，由克拉默法则得：`),
                [
                  `x_1 = ${par(-b1)} \\cdot ${par(d)} - ${par(b)} \\cdot ${par(-b2)} = ${x}`,
                  `x_2 = ${par(a)} \\cdot ${par(-b2)} - ${par(c)} \\cdot ${par(-b1)} = ${y}`,
                  `x_{${comp}} = ${ans}`,
                ],
              ],
            ],
            t(
              `$${par(a)} \\cdot ${par(x)} + ${par(b)} \\cdot ${par(y)} ${signed(b1)} = 0$ and $${par(c)} \\cdot ${par(x)} + ${par(d)} \\cdot ${par(y)} ${signed(b2)} = 0$.`,
              `$${par(a)} \\cdot ${par(x)} + ${par(b)} \\cdot ${par(y)} ${signed(b1)} = 0$，$${par(c)} \\cdot ${par(x)} + ${par(d)} \\cdot ${par(y)} ${signed(b2)} = 0$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.15 Phase Portraits for Systems of Linear ODEs
// ---------------------------------------------------------------------------

/** phasePlanesAndPhasePortraits analyzes trajectory slopes dy/dx. */
export const phasePlanesAndPhasePortraits: TopicDef = {
  id: "phase-planes-and-phase-portraits",
  title: t("Phase Planes and Phase Portraits", "相平面与相图"),
  summary: t(
    "In the phase plane (x, y), trajectories follow the vector field (x', y'), with trajectory slope dy/dx = y'/x' defining phase curves.",
    "在相平面 (x, y) 中，状态轨迹沿向量场 (x', y') 演化流动，其相曲线的切线斜率由 dy/dx = y'/x' 确定。",
  ),
  intro: t(
    "For $x' = y$, $y' = -4x$ the velocity at $(1, 2)$ is $(2, -4)$, so the trajectory through that point has slope $\\frac{dy}{dx} = \\frac{-4}{2} = -2$. Dividing the equations removes time: $\\frac{dy}{dx} = -\\frac{4x}{y}$, so $y\\,dy = -4x\\,dx$ and $4x^2 + y^2 = C$. Through $(1, 2)$, $C = 8$: the trajectory is an ellipse.\n\nCheck: $\\frac{d}{dt}(4x^2 + y^2) = 8xy + 2y(-4x) = 0$, so the quantity is indeed constant.\n\nIn this lesson we draw trajectories in the phase plane from their slopes and from quantities they conserve.",
    "对 $x' = y$，$y' = -4x$，在 $(1, 2)$ 处速度为 $(2, -4)$，所以过该点的轨线斜率为 $\\frac{dy}{dx} = \\frac{-4}{2} = -2$。两式相除消去时间：$\\frac{dy}{dx} = -\\frac{4x}{y}$，于是 $y\\,dy = -4x\\,dx$，$4x^2 + y^2 = C$。过 $(1, 2)$ 时 $C = 8$：轨线是一个椭圆。\n\n检验：$\\frac{d}{dt}(4x^2 + y^2) = 8xy + 2y(-4x) = 0$，所以这个量确实保持不变。\n\n本课我们根据斜率和守恒量在相平面上画出轨线。",
  ),
  prerequisites: ["solving-decoupled-homogeneous-systems-of-odes"],
  encompasses: [
    {
      topic: "solving-decoupled-homogeneous-systems-of-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "direction-fields-and-trajectories-in-the-phase-plane",
      title: t("Trajectory slope in the phase plane", "相平面上状态轨迹的切线斜率"),
      explanation: t(
        "A phase trajectory hides time and shows only the path, and its slope is the ratio of the vertical rate to the horizontal rate. The slope of a phase trajectory is $\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}$. For $x' = a x$ and $y' = b y$, $\\frac{dy}{dx} = \\frac{b y}{a x}$. For $x' = 2x$, $y' = 3y$ at $(1, 4)$ the slope is $\\frac{12}{2} = 6$.\n\n> **Watch out.** The vertical rate $y'$ goes on top; and evaluate both rates at the point, not just their coefficients.",
        "相轨线隐去了时间，只显示路径，它的斜率是竖直变化率与水平变化率之比。相轨迹的斜率由链式法则给出：$\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}$。对于系统 $x' = a x, y' = b y$，切线斜率为 $\\frac{dy}{dx} = \\frac{b y}{a x}$。对 $x' = 2x$，$y' = 3y$，在 $(1, 4)$ 处斜率为 $\\frac{12}{2} = 6$。\n\n> **注意。** 竖直变化率 $y'$ 在分子上；要在该点计算两个变化率，而不只是用它们的系数。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 6);
        const b = rng.int(2, 12);
        const x0 = rng.nonZero(-4, 5);
        const y0 = rng.nonZero(-5, 5);
        const ans = Q.of(b * y0, a * x0);
        const xp = poly([a, "x"]);
        return numberProblem({
          prompt: t(
            `For the linear autonomous system $x' = ${xp}$ and $y' = ${b}y$, evaluate the trajectory slope $\\frac{dy}{dx}$ at the point $(x, y) = (${x0}, ${y0})$ in the phase plane.`,
            `对于线性自治方程组 $x' = ${xp}$ 与 $y' = ${b}y$，计算相平面上在点 $(x, y) = (${x0}, ${y0})$ 处的轨迹切线斜率 $\\frac{dy}{dx}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(Q.of(a * x0, b * y0), "That is upside down: $y'$ goes on top.", "上下颠倒了：$y'$ 在分子上。"),
            why(Q.of(b, a), "That uses only the coefficients; evaluate the rates at the point.", "这里只用了系数；要在该点计算变化率。"),
            why(Q.of(y0, x0), "That leaves out the rates $${b}$ and $${a}$.", "这里漏掉了速率 $${b}$ 与 $${a}$。"),
            why(Q.of(b * x0, a * y0), "That swaps the coordinates of the point.", "这是把点的坐标交换了。"),
          ]),
          solution: walked(
            [
              [["Divide the rates", "两个变化率相除"], t("", ""), [`\\frac{dy}{dx} = \\frac{y'}{x'} = \\frac{${b}y}{${xp}}`]],
              [
                ["Substitute the point", "代入该点"],
                t("", ""),
                [`\\frac{dy}{dx} = \\frac{${b} \\cdot ${par(y0)}}{${a} \\cdot ${par(x0)}} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `The velocity at the point is $(${a * x0}, ${b * y0})$, and rise over run is $${b * y0} \\div ${par(a * x0)} = ${ans.toLatex()}$.`,
              `该点的速度为 $(${a * x0}, ${b * y0})$，纵向比横向为 $${b * y0} \\div ${par(a * x0)} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-conserved-quantity-along-a-trajectory",
      title: t("The conserved quantity along a trajectory", "沿轨线守恒的量"),
      explanation: t(
        "Dividing $y' = -kx$ by $x' = y$ removes time and gives the trajectory equation $\\frac{dy}{dx} = -\\frac{kx}{y}$. Separating, $y\\,dy = -kx\\,dx$, so\n\n$$kx^2 + y^2 = C$$\n\nstays constant along each trajectory. The trajectories are ellipses around the origin, and the starting point fixes which ellipse: substitute it to find $C$. For $k = 4$ through $(1, 2)$: $C = 4 + 4 = 8$.\n\n> **Watch out.** The factor $k$ goes with $x^2$, not $y^2$, and both coordinates are squared, so a negative coordinate still adds.",
        "用 $y' = -kx$ 除以 $x' = y$ 消去时间，得到轨线方程 $\\frac{dy}{dx} = -\\frac{kx}{y}$。分离变量，$y\\,dy = -kx\\,dx$，所以\n\n$$kx^2 + y^2 = C$$\n\n沿每条轨线保持不变。轨线是绕原点的椭圆，起点决定是哪一个椭圆：代入起点求出 $C$。对 $k = 4$ 过 $(1, 2)$：$C = 4 + 4 = 8$。\n\n> **注意。** 因子 $k$ 乘的是 $x^2$ 而不是 $y^2$；两个坐标都要平方，所以负坐标仍然是加上去的。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 9);
        const p = rng.int(-5, 5) || 1;
        const q = rng.int(-5, 5);
        const ans = k * p * p + q * q;
        return numberProblem({
          prompt: t(
            `The trajectory of $x' = y$, $y' = -${k}x$ through $(${p}, ${q})$ is $${k}x^2 + y^2 = C$. Find $C$.`,
            `$x' = y$，$y' = -${k}x$ 过点 $(${p}, ${q})$ 的轨线为 $${k}x^2 + y^2 = C$。求 $C$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(p * p + q * q, "That leaves out the factor $k$ on $x^2$.", "这里漏掉了 $x^2$ 前的因子 $k$。"),
            why(k * p * p - q * q, "The squares add: $y^2$ is never negative.", "平方项是相加的：$y^2$ 不会为负。"),
            why(k * p + q, "That forgets to square the coordinates.", "这里忘了把坐标平方。"),
            why(p * p + k * q * q, "That puts $k$ on $y^2$ instead of $x^2$.", "这是把 $k$ 放在了 $y^2$ 而不是 $x^2$ 前。"),
          ]),
          solution: walked(
            [
              [
                ["Separate the variables", "分离变量"],
                t("", ""),
                [`\\frac{dy}{dx} = -\\frac{${k}x}{y}, \\qquad y\\,dy = -${k}x\\,dx, \\qquad ${k}x^2 + y^2 = C`],
              ],
              [["Substitute the point", "代入该点"], t("", ""), [`C = ${k} \\cdot ${par(p)}^2 + ${par(q)}^2 = ${ans}`]],
            ],
            t(
              `Along any solution $\\frac{d}{dt}(${k}x^2 + y^2) = ${2 * k}xy + 2y(-${k}x) = 0$, so $C$ keeps the value $${ans}$ found at the start.`,
              `沿任意解 $\\frac{d}{dt}(${k}x^2 + y^2) = ${2 * k}xy + 2y(-${k}x) = 0$，所以 $C$ 始终保持起点处的值 $${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** equilibriumPointsAndStabilityForSystemsOfOdes checks critical points. */
export const equilibriumPointsAndStabilityForSystemsOfOdes: TopicDef = {
  id: "equilibrium-points-and-stability-for-systems-of-odes",
  title: t("Equilibrium Points and Stability for Systems of ODEs", "微分方程组的平衡点与稳定性"),
  summary: t(
    "Equilibrium points satisfy $A\\mathbf{x}_0 = \\mathbf{0}$. When $\\det A \\ne 0$, the origin is the only equilibrium, classified by the trace and determinant.",
    "平衡点满足 $A\\mathbf{x}_0 = \\mathbf{0}$。当 $\\det A \\ne 0$ 时，原点是唯一的平衡点，其类型由迹与行列式确定。",
  ),
  intro: t(
    "Take $\\mathbf{x}' = A\\mathbf{x}$ with $A = \\begin{pmatrix} -3 & 1 \\\\ 1 & -2 \\end{pmatrix}$. The determinant is $6 - 1 = 5 \\ne 0$, so the origin is the only equilibrium. The trace is $-5 < 0$ and the determinant is positive, so both eigenvalues have negative real parts and every solution tends to the origin: it is asymptotically stable.\n\nCheck: the eigenvalues solve $\\lambda^2 + 5\\lambda + 5 = 0$, so $\\lambda = \\frac{-5 \\pm \\sqrt{5}}{2}$, and both are negative.\n\nIn this lesson we find the equilibria of linear systems and decide their stability from the trace and determinant.",
    "取 $\\mathbf{x}' = A\\mathbf{x}$，$A = \\begin{pmatrix} -3 & 1 \\\\ 1 & -2 \\end{pmatrix}$。行列式为 $6 - 1 = 5 \\ne 0$，所以原点是唯一的平衡点。迹为 $-5 < 0$ 且行列式为正，所以两个特征值的实部都为负，每个解都趋于原点：原点渐近稳定。\n\n检验：特征值满足 $\\lambda^2 + 5\\lambda + 5 = 0$，所以 $\\lambda = \\frac{-5 \\pm \\sqrt{5}}{2}$，两者都为负。\n\n本课我们求线性方程组的平衡点，并由迹与行列式判断其稳定性。",
  ),
  prerequisites: ["phase-planes-and-phase-portraits"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "classification-of-isolated-critical-points",
      title: t("Determinant test for isolated critical points", "孤立平衡点的行列式判定准则"),
      explanation: t(
        "The origin is the only equilibrium of a linear system exactly when the matrix is invertible, that is, when its determinant is not zero. A linear system $A \\mathbf{x} = \\mathbf{0}$ has an isolated critical point at the origin if and only if $\\det(A) \\ne 0$. For $A = \\begin{pmatrix} 4 & 2 \\\\ 3 & 5 \\end{pmatrix}$, $\\det(A) = 20 - 6 = 14$, so the origin is isolated.\n\n> **Watch out.** The determinant subtracts the product of the off-diagonal entries: $ad - bc$, not $ad + bc$ and not the trace $a + d$.",
        "线性方程组只有原点一个平衡点，当且仅当矩阵可逆，也就是行列式不为零。线性系统 $A \\mathbf{x} = \\mathbf{0}$ 在原点具有孤立平衡点当且仅当系数矩阵行列式 $\\det(A) \\ne 0$。对 $A = \\begin{pmatrix} 4 & 2 \\\\ 3 & 5 \\end{pmatrix}$，$\\det(A) = 20 - 6 = 14$，所以原点是孤立的。\n\n> **注意。** 行列式要减去非对角元素之积：$ad - bc$，不是 $ad + bc$，也不是迹 $a + d$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 8);
        const d = rng.int(2, 8);
        const b = rng.int(1, 4);
        const c = rng.int(1, 4);
        const ans = a * d - b * c;
        return numberProblem({
          prompt: t(
            `Calculate the determinant $\\det(A)$ for $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$ to verify that the origin is an isolated equilibrium point.`,
            `计算矩阵 $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$ 的行列式 $\\det(A)$，以判定原点是否为孤立平衡点。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(a + d, "That is the trace, the sum of the diagonal entries.", "这是迹，即对角线元素之和。"),
            why(a * d, "That leaves out the product $bc$ of the off-diagonal entries.", "这里漏掉了非对角元素之积 $bc$。"),
            why(a * d + b * c, "The off-diagonal product is subtracted, not added.", "非对角元素之积要减去，而不是加上。"),
          ]),
          solution: walked(
            [
              [["Use the formula", "用公式"], t("", ""), [`\\det(A) = ad - bc`]],
              [["Substitute", "代入"], t("", ""), [`\\det(A) = ${a} \\cdot ${d} - ${b} \\cdot ${c} = ${a * d} - ${b * c} = ${ans}`]],
            ],
            ans === 0
              ? t(
                  `With $\\det(A) = 0$ the rows are proportional, so the equilibria fill a line through the origin and the origin is not isolated.`,
                  `$\\det(A) = 0$ 时两行成比例，平衡点充满一条过原点的直线，原点不是孤立的。`,
                )
              : t(
                  `Since $\\det(A) = ${ans} \\ne 0$, the only solution of $A\\mathbf{x} = \\mathbf{0}$ is $\\mathbf{x} = \\mathbf{0}$, so the origin is the unique, isolated equilibrium.`,
                  `由于 $\\det(A) = ${ans} \\ne 0$，$A\\mathbf{x} = \\mathbf{0}$ 只有解 $\\mathbf{x} = \\mathbf{0}$，所以原点是唯一的孤立平衡点。`,
                ),
          ),
        });
      },
    },
    {
      id: "deciding-asymptotic-stability-from-trace-and-determinant",
      title: t("Deciding asymptotic stability from trace and determinant", "由迹和行列式判断渐近稳定性"),
      explanation: t(
        "The origin of $\\mathbf{x}' = A\\mathbf{x}$ is asymptotically stable exactly when both eigenvalues have negative real parts. For a $2 \\times 2$ matrix that is equivalent to\n\n$$\\operatorname{tr}(A) < 0 \\quad\\text{and}\\quad \\det(A) > 0.$$\n\nA negative determinant means a saddle, which is unstable even if the trace is negative, and a positive trace means growth. For $A = \\begin{pmatrix} -1 & 3 \\\\ 2 & -2 \\end{pmatrix}$ the trace is $-3$ but the determinant is $2 - 6 = -4$, so the origin is an unstable saddle.\n\n> **Watch out.** A negative trace alone is not enough; check the sign of the determinant too.",
        "$\\mathbf{x}' = A\\mathbf{x}$ 的原点渐近稳定，当且仅当两个特征值的实部都为负。对 $2 \\times 2$ 矩阵，这等价于\n\n$$\\operatorname{tr}(A) < 0 \\quad\\text{且}\\quad \\det(A) > 0.$$\n\n行列式为负意味着鞍点，即使迹为负也不稳定；迹为正则意味着增长。对 $A = \\begin{pmatrix} -1 & 3 \\\\ 2 & -2 \\end{pmatrix}$，迹为 $-3$，但行列式为 $2 - 6 = -4$，所以原点是不稳定的鞍点。\n\n> **注意。** 仅有迹为负是不够的；还要检查行列式的符号。",
      ),
      generate(rng: Rng): Problem {
        let [a, b, c, d] = [0, 0, 0, 0];
        do {
          [a, b, c, d] = [rng.int(-6, 4), rng.int(-5, 5), rng.int(-5, 5), rng.int(-6, 4)];
        } while (a + d === 0 || a * d - b * c === 0);
        const tr = a + d;
        const det = a * d - b * c;
        const stable = tr < 0 && det > 0;
        const problem = choiceProblem({
          prompt: t(
            `Is the origin an asymptotically stable equilibrium of $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$?`,
            `原点是 $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ 的渐近稳定平衡点吗？`,
          ),
          options: yesNo,
          correct: stable ? 0 : 1,
          solution: walked(
            [
              [
                ["Find the trace and determinant", "求迹与行列式"],
                t("", ""),
                [
                  `\\operatorname{tr}(A) = ${a} ${signed(d)} = ${tr}`,
                  `\\det(A) = ${par(a)} \\cdot ${par(d)} - ${par(b)} \\cdot ${par(c)} = ${det}`,
                ],
              ],
              [
                ["Apply the test", "应用判别法"],
                stable
                  ? t(
                      "Both $\\operatorname{tr}(A) < 0$ and $\\det(A) > 0$ hold, so the origin is asymptotically stable.",
                      "$\\operatorname{tr}(A) < 0$ 与 $\\det(A) > 0$ 都成立，所以原点渐近稳定。",
                    )
                  : det < 0
                    ? t("The determinant is negative, so the origin is a saddle and is unstable.", "行列式为负，原点是鞍点，不稳定。")
                    : t("The trace is positive, so solutions grow and the origin is unstable.", "迹为正，解会增长，原点不稳定。"),
              ],
            ],
            t(
              `The eigenvalues solve $${poly([1, "\\lambda^2"], [-tr, "\\lambda"], [det, ""])} = 0$: their sum is $${tr}$ and their product is $${det}$, ${stable ? "so both real parts are negative" : det < 0 ? "so they are real with opposite signs" : "so their real parts add to a positive number"}.`,
              `特征值满足 $${poly([1, "\\lambda^2"], [-tr, "\\lambda"], [det, ""])} = 0$：它们之和为 $${tr}$，之积为 $${det}$，${stable ? "所以两个实部都为负" : det < 0 ? "所以它们是符号相反的实数" : "所以它们的实部之和为正"}。`,
            ),
          ),
        });
        return reasoned(problem, [
          [
            "Yes",
            det < 0
              ? "A negative determinant makes the origin a saddle, which is unstable whatever the trace."
              : "A positive trace means the eigenvalues have a positive real part, so solutions grow.",
            det < 0 ? "行列式为负使原点成为鞍点，无论迹如何都不稳定。" : "迹为正意味着特征值有正的实部，解会增长。",
          ],
          [
            "No",
            "A negative trace together with a positive determinant gives eigenvalues with negative real parts.",
            "迹为负且行列式为正，特征值的实部都为负。",
          ],
        ]);
      },
    },
  ],
};

/** phasePortraitsForDecoupledLinearSystems connects powers in trajectory equations. */
export const phasePortraitsForDecoupledLinearSystems: TopicDef = {
  id: "phase-portraits-for-decoupled-linear-systems",
  title: t("Phase Portraits for Decoupled Linear Systems", "解耦线性系统的相图"),
  summary: t(
    "For $x' = \\lambda_1 x$ and $y' = \\lambda_2 y$, integrating $\\frac{dy}{dx} = \\frac{\\lambda_2 y}{\\lambda_1 x}$ gives the trajectories $y = Cx^{\\lambda_2/\\lambda_1}$.",
    "对 $x' = \\lambda_1 x$ 与 $y' = \\lambda_2 y$，积分 $\\frac{dy}{dx} = \\frac{\\lambda_2 y}{\\lambda_1 x}$ 得轨线 $y = Cx^{\\lambda_2/\\lambda_1}$。",
  ),
  intro: t(
    "Take $x' = 2x$ and $y' = 6y$. Dividing the rates removes time: $\\frac{dy}{dx} = \\frac{6y}{2x} = \\frac{3y}{x}$. Separating, $\\frac{dy}{y} = 3\\frac{dx}{x}$, so $\\ln|y| = 3\\ln|x| + c$ and the trajectories are the cubics $y = Cx^3$. The one through $(1, 2)$ is $y = 2x^3$.\n\nCheck: the solution through $(1, 2)$ is $x = e^{2t}$, $y = 2e^{6t}$, and $2e^{6t} = 2(e^{2t})^3 = 2x^3$.\n\nIn this lesson we draw the phase portraits of decoupled systems as power curves and follow a trajectory from one point to another.",
    "取 $x' = 2x$ 与 $y' = 6y$。两个变化率相除消去时间：$\\frac{dy}{dx} = \\frac{6y}{2x} = \\frac{3y}{x}$。分离变量，$\\frac{dy}{y} = 3\\frac{dx}{x}$，所以 $\\ln|y| = 3\\ln|x| + c$，轨线是三次曲线 $y = Cx^3$。过 $(1, 2)$ 的一条是 $y = 2x^3$。\n\n检验：过 $(1, 2)$ 的解为 $x = e^{2t}$，$y = 2e^{6t}$，而 $2e^{6t} = 2(e^{2t})^3 = 2x^3$。\n\n本课我们把解耦方程组的相图画成幂曲线，并沿轨线从一点追踪到另一点。",
  ),
  prerequisites: ["phase-planes-and-phase-portraits"],
  encompasses: [{ topic: "phase-planes-and-phase-portraits", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "trajectories-of-decoupled-systems",
      title: t("Power exponent of decoupled phase trajectories", "解耦系统相曲线的幂指数"),
      explanation: t(
        "Separating the variables in the trajectory equation shows that the path is a power curve whose exponent is the ratio of the two rates. For $\\frac{dy}{dx} = \\frac{\\lambda_2 y}{\\lambda_1 x}$, separation of variables yields $\\ln|y| = \\frac{\\lambda_2}{\\lambda_1}\\ln|x| + C \\implies y = K x^p$ where $p = \\frac{\\lambda_2}{\\lambda_1}$.\n\n> **Watch out.** The exponent is the rate of $y$ over the rate of $x$, not the other way up. For $x' = 2x$ and $y' = 6y$ it is $p = \\frac{6}{2} = 3$, not $\\frac{1}{3}$.",
        "对轨线方程分离变量可以看出，路径是一条幂曲线，指数是两个速率之比。对于 $\\frac{dy}{dx} = \\frac{\\lambda_2 y}{\\lambda_1 x}$，分离变量积分可得 $\\ln|y| = \\frac{\\lambda_2}{\\lambda_1}\\ln|x| + C \\implies y = K x^p$，其中幂指数 $p = \\frac{\\lambda_2}{\\lambda_1}$。\n\n> **注意。** 指数是 $y$ 的速率除以 $x$ 的速率，不能颠倒。对 $x' = 2x$ 与 $y' = 6y$，$p = \\frac{6}{2} = 3$，而不是 $\\frac{1}{3}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 7);
        const p = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const b = a * p;
        return numberProblem({
          prompt: t(
            `In the phase plane for $x' = ${a}x$ and $y' = ${b}y$, trajectories follow power curves $y = C x^p$ (for $x > 0$). Find the power exponent $p$.`,
            `在相平面上，微分方程组 $x' = ${a}x$ 与 $y' = ${b}y$ 的状态轨迹服从幂函数曲线 $y = C x^p$（$x > 0$）。求幂指数 $p$ 的值。`,
          ),
          answer: p,
          mistakes: apart(p, [
            why(Q.of(a, b), "That is upside down: the rate of $y$ goes on top.", "上下颠倒了：$y$ 的速率在分子上。"),
            why(b, "That is the rate of $y$ alone; divide it by the rate of $x$.", "这只是 $y$ 的速率；还要除以 $x$ 的速率。"),
            why(-p, "The sign is lost: the ratio keeps the signs of both rates.", "符号丢了：比值保留两个速率的符号。"),
            why(a, "That is the rate of $x$, not the ratio of the rates.", "这是 $x$ 的速率，不是两个速率之比。"),
          ]),
          solution: walked(
            [
              [
                ["Divide the rates", "两个变化率相除"],
                t("", ""),
                [`\\frac{dy}{dx} = \\frac{y'}{x'} = \\frac{${b}y}{${a}x} = \\frac{${p}y}{x}`],
              ],
              [
                ["Separate and integrate", "分离变量并积分"],
                t("", ""),
                [`\\frac{dy}{y} = ${p}\\,\\frac{dx}{x}, \\qquad \\ln|y| = ${p}\\ln x + c, \\qquad y = Cx^{${p}}`, `p = ${p}`],
              ],
            ],
            t(
              `The solution through $(1, C)$ is $x = e^{${a}t}$, $y = Ce^{${b}t}$, and $Ce^{${b}t} = C\\left(e^{${a}t}\\right)^{${p}} = Cx^{${p}}$.`,
              `过 $(1, C)$ 的解为 $x = e^{${a}t}$，$y = Ce^{${b}t}$，而 $Ce^{${b}t} = C\\left(e^{${a}t}\\right)^{${p}} = Cx^{${p}}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "following-a-trajectory-of-a-decoupled-system",
      title: t("Following a trajectory of a decoupled system", "沿解耦方程组的轨线追踪"),
      explanation: t(
        "For $x' = ax$, $y' = by$ with $x > 0$, eliminating time from $x = x_0e^{at}$ and $y = y_0e^{bt}$ gives\n\n$$y = y_0\\left(\\frac{x}{x_0}\\right)^{b/a}.$$\n\nThe exponent is the ratio of the rates, which can be a fraction or negative. A fractional exponent bends the curve toward one axis, and a negative one gives hyperbola-like curves of a saddle.\n\n> **Watch out.** Raise $\\frac{x}{x_0}$ to the power $\\frac{b}{a}$; do not multiply by it. For $x' = 2x$ and $y' = y$, from $(1, 3)$ to $x = 4$: $y = 3 \\cdot 4^{1/2} = 6$, not $3 \\cdot 4 \\cdot \\frac{1}{2}$.",
        "对 $x' = ax$，$y' = by$（$x > 0$），由 $x = x_0e^{at}$ 与 $y = y_0e^{bt}$ 消去时间得\n\n$$y = y_0\\left(\\frac{x}{x_0}\\right)^{b/a}.$$\n\n指数是两个速率之比，可以是分数或负数。分数指数使曲线向某一坐标轴弯曲，负指数则给出鞍点那种类似双曲线的曲线。\n\n> **注意。** 要把 $\\frac{x}{x_0}$ 升到 $\\frac{b}{a}$ 次幂，而不是乘以它。对 $x' = 2x$，$y' = y$，从 $(1, 3)$ 到 $x = 4$：$y = 3 \\cdot 4^{1/2} = 6$，而不是 $3 \\cdot 4 \\cdot \\frac{1}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const [a, b] = rng.pick([
          [2, 1],
          [-2, -1],
          [2, -1],
          [-2, 1],
          [2, 3],
          [-2, -3],
          [1, 2],
          [-1, -2],
          [1, -1],
          [-1, 1],
          [2, -3],
          [4, 2],
          [-4, 6],
        ] as const);
        const q = rng.int(-6, 6) || 3;
        const r = Q.of(b, a);
        const e = r.mul(Q.of(2)).toNumber();
        const power = Q.of(2).pow(e);
        const ans = Q.of(q).mul(power);
        return numberProblem({
          prompt: t(
            `A trajectory of $x' = ${poly([a, "x"])}$, $y' = ${poly([b, "y"])}$ passes through $(1, ${q})$. Find $y$ where it reaches $x = 4$.`,
            `$x' = ${poly([a, "x"])}$，$y' = ${poly([b, "y"])}$ 的一条轨线经过 $(1, ${q})$。求它到达 $x = 4$ 时的 $y$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(q * 4),
              "That treats the trajectory as a straight line through the origin; the exponent is not $1$.",
              "这是把轨线当成过原点的直线；指数不是 $1$。",
            ),
            why(
              Q.of(q).mul(Q.of(4)).mul(r),
              "That multiplies by the exponent instead of raising $4$ to it.",
              "这是乘以指数，而不是把 $4$ 升到该次幂。",
            ),
            why(
              Q.of(q).mul(Q.of(2).pow(-e)),
              "The exponent has the wrong sign; it is the rate of $y$ over the rate of $x$.",
              "指数的符号错了；它是 $y$ 的速率除以 $x$ 的速率。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Eliminate time", "消去时间"],
                t("", ""),
                [
                  `x = e^{${ex(a)}}, \\qquad y = ${q}e^{${ex(b)}} = ${q}\\left(e^{${ex(a)}}\\right)^{${r.toLatex()}} = ${poly([q, `x^{${r.toLatex()}}`])}`,
                ],
              ],
              [
                ["Substitute $x = 4$", "代入 $x = 4$"],
                t("", ""),
                [`y = ${q} \\cdot 4^{${r.toLatex()}} = ${q} \\cdot ${power.toLatex()} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `At $x = 1$ the curve gives $y = ${q}$, the starting point, and $4^{${r.toLatex()}} = ${power.toLatex()}$ because $${power.toLatex()}$ raised to the power $${Q.of(a, b).toLatex()}$ is $4$.`,
              `在 $x = 1$ 处曲线给出 $y = ${q}$，正是起点；并且 $4^{${r.toLatex()}} = ${power.toLatex()}$，因为 $${power.toLatex()}$ 的 $${Q.of(a, b).toLatex()}$ 次幂是 $4$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** phasePortraitsForLinearSystemsWithRealDistinctEigenvalues classifies nodes and saddles. */
export const phasePortraitsForLinearSystemsWithRealDistinctEigenvalues: TopicDef = {
  id: "phase-portraits-for-linear-systems-with-real-distinct-eigenvalues",
  title: t("Phase Portraits for Linear Systems With Real Distinct Eigenvalues", "具有互异实特征值的线性系统相图"),
  summary: t(
    "When the eigenvalues have opposite signs ($\\lambda_1 < 0 < \\lambda_2$), the origin is an unstable saddle; when they have the same sign, it is a stable or unstable node.",
    "当特征值异号（$\\lambda_1 < 0 < \\lambda_2$）时原点为不稳定的鞍点；同号时为稳定或不稳定的结点。",
  ),
  intro: t(
    "Take $\\mathbf{x}' = A\\mathbf{x}$ with $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$. The trace is $2$ and the determinant is $1 - 4 = -3 < 0$, so the eigenvalues have opposite signs: they are $3$, along $(1, 1)$, and $-1$, along $(1, -1)$. The origin is a saddle: trajectories come in along $(1, -1)$ and leave along $(1, 1)$.\n\nCheck: $A\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 3 \\end{pmatrix}$ and $A\\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} -1 \\\\ 1 \\end{pmatrix}$, so the two eigenvalues are $3$ and $-1$, with product $-3$.\n\nIn this lesson we tell saddles from stable and unstable nodes by the signs of real eigenvalues.",
    "取 $\\mathbf{x}' = A\\mathbf{x}$，$A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}$。迹为 $2$，行列式为 $1 - 4 = -3 < 0$，所以特征值异号：它们是沿 $(1, 1)$ 的 $3$ 与沿 $(1, -1)$ 的 $-1$。原点是鞍点：轨线沿 $(1, -1)$ 进入，沿 $(1, 1)$ 离开。\n\n检验：$A\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 3 \\end{pmatrix}$，$A\\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} -1 \\\\ 1 \\end{pmatrix}$，所以两个特征值为 $3$ 与 $-1$，积为 $-3$。\n\n本课我们根据实特征值的符号区分鞍点与稳定、不稳定结点。",
  ),
  prerequisites: ["phase-portraits-for-decoupled-linear-systems"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "saddle-points-and-nodes-classification",
      title: t("Determinant condition for a saddle point", "鞍点的行列式负判定条件"),
      explanation: t(
        "The determinant is the product of the eigenvalues, so a negative determinant means one eigenvalue is positive and one negative, which makes a saddle. A saddle point occurs when the eigenvalues have opposite signs, which is equivalent to $\\det(A) = \\lambda_1 \\lambda_2 < 0$.\n\n> **Watch out.** The determinant is the product of the eigenvalues, not their sum: for $\\lambda_1 = -3$ and $\\lambda_2 = 5$ it is $-15$, while $2$ is the trace.",
        "行列式是特征值之积，所以行列式为负意味着一个特征值为正、一个为负，这就是鞍点。当特征值异号时系统在原点形成鞍点，其等价充要代数条件为行列式 $\\det(A) = \\lambda_1 \\lambda_2 < 0$。\n\n> **注意。** 行列式是特征值之积而不是之和：对 $\\lambda_1 = -3$ 与 $\\lambda_2 = 5$，它是 $-15$，而 $2$ 是迹。",
      ),
      generate(rng: Rng): Problem {
        const lambda1 = rng.int(2, 10);
        const lambda2 = rng.int(2, 10);
        const ans = -lambda1 * lambda2;
        return numberProblem({
          prompt: t(
            `A $2 \\times 2$ system matrix has real eigenvalues $\\lambda_1 = -${lambda1}$ and $\\lambda_2 = ${lambda2}$. Compute the determinant $\\det(A) = \\lambda_1 \\lambda_2$ characterizing this saddle point.`,
            `某二阶系统矩阵具有实特征值 $\\lambda_1 = -${lambda1}$ 与 $\\lambda_2 = ${lambda2}$。计算刻画该鞍点的行列式 $\\det(A) = \\lambda_1 \\lambda_2$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(-ans, "The sign is lost: a negative eigenvalue times a positive one is negative.", "符号丢了：负特征值乘正特征值得负数。"),
            why(
              lambda2 - lambda1,
              "That is the sum $\\lambda_1 + \\lambda_2$, the trace, not the product.",
              "这是和 $\\lambda_1 + \\lambda_2$，即迹，而不是积。",
            ),
            why(lambda1 + lambda2, "That adds the sizes of the eigenvalues; multiply them.", "这是把特征值的大小相加；应当相乘。"),
          ]),
          solution: walked(
            [
              [["Use the product rule", "用乘积关系"], t("", ""), [`\\det(A) = \\lambda_1 \\lambda_2`]],
              [["Substitute", "代入"], t("", ""), [`\\det(A) = (-${lambda1})(${lambda2}) = ${ans}`]],
            ],
            t(
              `The characteristic polynomial is $(\\lambda + ${lambda1})(\\lambda - ${lambda2}) = ${poly([1, "\\lambda^2"], [lambda1 - lambda2, "\\lambda"], [ans, ""])}$, whose constant term is $\\det(A) = ${ans} < 0$, so the origin is a saddle.`,
              `特征多项式为 $(\\lambda + ${lambda1})(\\lambda - ${lambda2}) = ${poly([1, "\\lambda^2"], [lambda1 - lambda2, "\\lambda"], [ans, ""])}$，常数项为 $\\det(A) = ${ans} < 0$，所以原点是鞍点。`,
            ),
          ),
        });
      },
    },
    {
      id: "classifying-a-node-or-saddle",
      title: t("Classifying a node or saddle", "判别结点或鞍点"),
      explanation: t(
        "With real distinct eigenvalues the signs decide the portrait. Both negative: a stable node, with every trajectory entering the origin. Both positive: an unstable node. Opposite signs: a saddle, where only the two trajectories along the stable eigenvector reach the origin. You can read the signs without the eigenvalues: $\\det(A) = \\lambda_1\\lambda_2 < 0$ means a saddle, and otherwise the sign of $\\operatorname{tr}(A) = \\lambda_1 + \\lambda_2$ decides.\n\n> **Watch out.** Look at the determinant before the trace: $A = \\begin{pmatrix} -3 & 2 \\\\ 2 & 1 \\end{pmatrix}$ has trace $-2$, yet $\\det(A) = -7 < 0$ makes it a saddle, not a stable node.",
        "特征值为互异实数时，由它们的符号决定相图。都为负：稳定结点，所有轨线都进入原点。都为正：不稳定结点。符号相反：鞍点，只有沿稳定特征向量的两条轨线到达原点。不求特征值也能读出符号：$\\det(A) = \\lambda_1\\lambda_2 < 0$ 表示鞍点，否则由 $\\operatorname{tr}(A) = \\lambda_1 + \\lambda_2$ 的符号决定。\n\n> **注意。** 先看行列式再看迹：$A = \\begin{pmatrix} -3 & 2 \\\\ 2 & 1 \\end{pmatrix}$ 的迹为 $-2$，但 $\\det(A) = -7 < 0$ 使它成为鞍点，而不是稳定结点。",
      ),
      generate(rng: Rng): Problem {
        const kind = rng.int(0, 2);
        const [l1, l2] =
          kind === 0 ? [-rng.int(1, 3), -rng.int(4, 6)] : kind === 1 ? [rng.int(1, 3), rng.int(4, 6)] : [-rng.int(1, 5), rng.int(1, 5)];
        const m1 = rng.int(-3, 3);
        const m2 = m1 + rng.pick([-1, 1]);
        const [a, b, c, d] = fromEigen(l1, l2, m1, m2);
        const tr = a + d;
        const det = a * d - b * c;
        const problem = choiceProblem({
          prompt: t(
            `Classify the origin for $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$.`,
            `判断 $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ 的原点类型。`,
          ),
          options: [t("Stable node", "稳定结点"), t("Unstable node", "不稳定结点"), t("Saddle", "鞍点")],
          correct: kind,
          solution: walked(
            [
              [
                ["Find the trace and determinant", "求迹与行列式"],
                t("", ""),
                [
                  `\\operatorname{tr}(A) = ${a} ${signed(d)} = ${tr}`,
                  `\\det(A) = ${par(a)} \\cdot ${par(d)} - ${par(b)} \\cdot ${par(c)} = ${det}`,
                ],
              ],
              [
                ["Find the eigenvalues", "求特征值"],
                t("", ""),
                [`${poly([1, "\\lambda^2"], [-tr, "\\lambda"], [det, ""])} = 0, \\qquad \\lambda = ${l1}, \\; ${l2}`],
              ],
              [
                ["Read the signs", "看符号"],
                kind === 2
                  ? t("The eigenvalues have opposite signs, so the origin is a saddle.", "特征值异号，所以原点是鞍点。")
                  : kind === 0
                    ? t("Both eigenvalues are negative, so the origin is a stable node.", "两个特征值都为负，所以原点是稳定结点。")
                    : t("Both eigenvalues are positive, so the origin is an unstable node.", "两个特征值都为正，所以原点是不稳定结点。"),
                [],
              ],
            ],
            t(
              `The eigenvalues add to $${l1} ${signed(l2)} = ${tr}$, the trace, and multiply to $${par(l1)} \\cdot ${par(l2)} = ${det}$, the determinant.`,
              `特征值之和为 $${l1} ${signed(l2)} = ${tr}$，等于迹；之积为 $${par(l1)} \\cdot ${par(l2)} = ${det}$，等于行列式。`,
            ),
          ),
        });
        const notSaddle: [string, string] = [
          `A saddle needs $\\det(A) < 0$, but here $\\det(A) = ${det}$.`,
          `鞍点要求 $\\det(A) < 0$，而这里 $\\det(A) = ${det}$。`,
        ];
        const isSaddle: [string, string] = [
          `$\\det(A) = ${det} < 0$, so the eigenvalues have opposite signs and the origin is not a node.`,
          `$\\det(A) = ${det} < 0$，特征值异号，原点不是结点。`,
        ];
        return reasoned(problem, [
          [
            "Stable node",
            ...(kind === 2
              ? isSaddle
              : ([
                  `With $\\det(A) > 0$, the trace $${tr} > 0$ makes both eigenvalues positive.`,
                  `$\\det(A) > 0$ 时，迹 $${tr} > 0$ 使两个特征值都为正。`,
                ] as const)),
          ],
          [
            "Unstable node",
            ...(kind === 2
              ? isSaddle
              : ([
                  `With $\\det(A) > 0$, the trace $${tr} < 0$ makes both eigenvalues negative.`,
                  `$\\det(A) > 0$ 时，迹 $${tr} < 0$ 使两个特征值都为负。`,
                ] as const)),
          ],
          ["Saddle", ...notSaddle],
        ]);
      },
    },
  ],
};

/** phasePortraitsForLinearSystemsWithRepeatedEigenvalues examines star and degenerate nodes. */
export const phasePortraitsForLinearSystemsWithRepeatedEigenvalues: TopicDef = {
  id: "phase-portraits-for-linear-systems-with-repeated-eigenvalues",
  title: t("Phase Portraits for Linear Systems With Repeated Eigenvalues", "具有重特征值的线性系统相图"),
  summary: t(
    "Repeated eigenvalues produce a star node when two eigenvectors exist (A = λ I), or a degenerate node when only one independent eigenvector exists.",
    "重特征值在具有两个独立特征向量（A = λ I）时形成星形对称结点；在仅有一个独立特征向量时形成退化结点。",
  ),
  intro: t(
    "Take $A = \\begin{pmatrix} -2 & 1 \\\\ 0 & -2 \\end{pmatrix}$. The trace is $-4$ and the determinant is $4$, so $\\operatorname{tr}(A)^2 - 4\\det(A) = 16 - 16 = 0$ and $\\lambda = -2$ is repeated. Since $A + 2I = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix} \\ne 0$, there is only one eigenvector line, along $(1, 0)$: the origin is a stable degenerate node, and trajectories enter it tangent to the $x$-axis.\n\nCheck: $A\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} -2 \\\\ 0 \\end{pmatrix}$ is $-2$ times $(1, 0)$, but $A\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ -2 \\end{pmatrix}$ is not a multiple of $(0, 1)$.\n\nIn this lesson we tell star nodes, where every direction is an eigenvector, from degenerate nodes, where only one is.",
    "取 $A = \\begin{pmatrix} -2 & 1 \\\\ 0 & -2 \\end{pmatrix}$。迹为 $-4$，行列式为 $4$，所以 $\\operatorname{tr}(A)^2 - 4\\det(A) = 16 - 16 = 0$，$\\lambda = -2$ 是重根。由于 $A + 2I = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix} \\ne 0$，只有一条沿 $(1, 0)$ 的特征向量直线：原点是稳定退化结点，轨线与 $x$ 轴相切地进入原点。\n\n检验：$A\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} -2 \\\\ 0 \\end{pmatrix}$ 是 $(1, 0)$ 的 $-2$ 倍，而 $A\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ -2 \\end{pmatrix}$ 不是 $(0, 1)$ 的倍数。\n\n本课我们区分星形结点（每个方向都是特征向量）与退化结点（只有一个方向是）。",
  ),
  prerequisites: ["phase-portraits-for-linear-systems-with-real-distinct-eigenvalues"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "degenerate-nodes-and-proper-nodes",
      title: t("Radial ray trajectories of star nodes", "星形结点的径向射线轨迹"),
      explanation: t(
        "For $A = -k I$ with $k > 0$, every vector is an eigenvector, so every trajectory is a straight line ray entering the origin as $t \\to \\infty$.\n\n> **Watch out.** Both coordinates shrink by the same factor, so the ratio $\\frac{y}{x}$ never changes; the rate $k$ only says how fast. From $(6, 9)$ to $x = 2$ the factor is $\\frac{1}{3}$, so $y = 3$, whatever $k$ is.",
        "对于数量矩阵 $A = -k I$（$k > 0$），平面上任意向量均为特征向量，所有相轨迹均为当 $t \\to \\infty$ 时直线趋向原点的径向射线。\n\n> **注意。** 两个坐标按同一因子缩小，所以比值 $\\frac{y}{x}$ 不变；速率 $k$ 只决定快慢。从 $(6, 9)$ 到 $x = 2$，因子为 $\\frac{1}{3}$，所以 $y = 3$，与 $k$ 无关。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 9);
        const m = rng.int(2, 5);
        const d = rng.nonZero(-4, 4);
        const p = m * d;
        const q = rng.nonZero(-9, 9);
        const ans = Q.of(q, m);
        return numberProblem({
          prompt: t(
            `A trajectory of the star node system $\\mathbf{x}' = \\begin{pmatrix} -${k} & 0 \\\\ 0 & -${k} \\end{pmatrix} \\mathbf{x}$ starts at $(x, y) = (${p}, ${q})$. Find $y$ at the moment when $x = ${d}$.`,
            `星形稳定结点系统 $\\mathbf{x}' = \\begin{pmatrix} -${k} & 0 \\\\ 0 & -${k} \\end{pmatrix} \\mathbf{x}$ 的一条轨迹从 $(x, y) = (${p}, ${q})$ 出发。求 $x = ${d}$ 时的 $y$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(Q.of(q), "That keeps $y$ at its starting value; $y$ shrinks with $x$.", "这是让 $y$ 保持初值；$y$ 会随 $x$ 一起缩小。"),
            why(
              Q.of(q * m),
              "That grows $y$ while $x$ shrinks; both change by the same factor.",
              "这是让 $y$ 变大而 $x$ 变小；两者按同一因子变化。",
            ),
            why(
              Q.of(q, k),
              "That divides by the rate $k$; the factor comes from how much $x$ shrank.",
              "这是除以速率 $k$；因子来自 $x$ 缩小了多少。",
            ),
            why(
              Q.of(q - p + d),
              "That moves both coordinates by the same amount; they shrink by the same factor.",
              "这是两个坐标减去相同的量；它们是按同一因子缩小。",
            ),
          ]),
          solution: walked(
            [
              [["Solve each equation", "分别求解"], t("", ""), [`x = ${p}e^{-${k}t}, \\qquad y = ${q}e^{-${k}t}`]],
              [["Find the factor", "求缩小因子"], t("", ""), [`e^{-${k}t} = ${d} \\div ${par(p)} = \\frac{1}{${m}}`]],
              [["Apply it to $y$", "作用于 $y$"], t("", ""), [`y = ${q} \\cdot \\frac{1}{${m}} = ${ans.toLatex()}`]],
            ],
            t(
              `The point stays on the ray through the start: $\\frac{y}{x} = ${Q.of(q, p).toLatex()}$ at $(${p}, ${q})$, and $${ans.toLatex()} \\div ${par(d)} = ${ans.div(Q.of(d)).toLatex()}$ too.`,
              `该点始终在过起点的射线上：在 $(${p}, ${q})$ 处 $\\frac{y}{x} = ${Q.of(q, p).toLatex()}$，而 $${ans.toLatex()} \\div ${par(d)} = ${ans.div(Q.of(d)).toLatex()}$ 也一样。`,
            ),
          ),
        });
      },
    },
    {
      id: "telling-a-star-node-from-a-degenerate-node",
      figure:
        differentialEquationsDrawings1[
          "phase-portraits-for-linear-systems-with-repeated-eigenvalues#telling-a-star-node-from-a-degenerate-node"
        ],
      title: t("Telling a star node from a degenerate node", "区分星形结点与退化结点"),
      explanation: t(
        "A repeated eigenvalue $\\lambda$ gives two different portraits. If $A = \\lambda I$, every vector is an eigenvector and trajectories are straight rays: a star (proper) node. Otherwise $A - \\lambda I \\ne 0$, there is only one eigenvector line, and trajectories curve to become tangent to it: a degenerate (improper) node. In both cases the node is stable when $\\lambda < 0$ and unstable when $\\lambda > 0$.\n\n> **Watch out.** A repeated eigenvalue alone does not make a star node. $A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix}$ has $\\lambda = 3$ twice, but $A - 3I \\ne 0$, so it is an unstable degenerate node.",
        "重特征值 $\\lambda$ 对应两种不同的相图。若 $A = \\lambda I$，每个向量都是特征向量，轨线是直的射线：星形（正常）结点。否则 $A - \\lambda I \\ne 0$，只有一条特征向量直线，轨线弯曲并与之相切：退化（非正常）结点。两种情形下，$\\lambda < 0$ 时结点稳定，$\\lambda > 0$ 时不稳定。\n\n> **注意。** 仅有重特征值并不能说明是星形结点。$A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix}$ 的 $\\lambda = 3$ 是二重根，但 $A - 3I \\ne 0$，所以它是不稳定退化结点。",
      ),
      generate(rng: Rng): Problem {
        const l = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const star = rng.int(0, 2) === 0;
        const u = rng.pick([-2, -1, 1, 2]);
        const v = rng.pick([-2, -1, 0, 1, 2]);
        const [a, b, c, d] = star ? [l, 0, 0, l] : [l + u * v, -u * u, v * v, l - u * v];
        const correct = (l < 0 ? 0 : 1) + (star ? 0 : 2);
        const options = [
          t("Stable star node", "稳定星形结点"),
          t("Unstable star node", "不稳定星形结点"),
          t("Stable degenerate node", "稳定退化结点"),
          t("Unstable degenerate node", "不稳定退化结点"),
        ];
        const problem = choiceProblem({
          prompt: t(
            `Classify the origin for $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$.`,
            `判断 $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ 的原点类型。`,
          ),
          options,
          correct,
          solution: walked(
            [
              [
                ["Find the eigenvalue", "求特征值"],
                t("", ""),
                [
                  `\\operatorname{tr}(A) = ${2 * l}, \\qquad \\det(A) = ${l * l}`,
                  `${poly([1, "\\lambda^2"], [-2 * l, "\\lambda"], [l * l, ""])} = (\\lambda ${l < 0 ? "+" : "-"} ${Math.abs(l)})^2, \\qquad \\lambda = ${l}`,
                ],
              ],
              [
                ["Compare $A$ with $\\lambda I$", "比较 $A$ 与 $\\lambda I$"],
                star
                  ? t(
                      "Every entry of $A - \\lambda I$ is zero, so every vector is an eigenvector: a star node.",
                      "$A - \\lambda I$ 的每个元素都为零，每个向量都是特征向量：星形结点。",
                    )
                  : t(
                      "$A - \\lambda I$ is not zero, so there is a single eigenvector line: a degenerate node.",
                      "$A - \\lambda I$ 不为零，只有一条特征向量直线：退化结点。",
                    ),
                [`A - ${par(l)}I = ${mat(a - l, b, c, d - l)}`],
              ],
              [
                ["Read the sign", "看符号"],
                l < 0
                  ? t(`$\\lambda = ${l} < 0$, so the node is stable.`, `$\\lambda = ${l} < 0$，所以结点稳定。`)
                  : t(`$\\lambda = ${l} > 0$, so the node is unstable.`, `$\\lambda = ${l} > 0$，所以结点不稳定。`),
                [],
              ],
            ],
            t(
              `The trace squared minus four times the determinant is $${par(2 * l)}^2 - 4 \\cdot ${l * l} = 0$, which confirms that the eigenvalue $${l}$ is repeated.`,
              `迹的平方减去行列式的四倍为 $${par(2 * l)}^2 - 4 \\cdot ${l * l} = 0$，确认特征值 $${l}$ 是重根。`,
            ),
          ),
        });
        const reason = (i: number): [string, string, string] => {
          const en = options[i]?.en ?? "";
          if (i >= 2 !== !star)
            return star
              ? [
                  en,
                  "A degenerate node needs $A - \\lambda I \\ne 0$, but here $A = \\lambda I$ and every vector is an eigenvector.",
                  "退化结点要求 $A - \\lambda I \\ne 0$，而这里 $A = \\lambda I$，每个向量都是特征向量。",
                ]
              : [
                  en,
                  "A star node needs $A = \\lambda I$, but $A - \\lambda I$ has nonzero entries here.",
                  "星形结点要求 $A = \\lambda I$，而这里 $A - \\lambda I$ 有非零元素。",
                ];
          return l < 0
            ? [en, `$\\lambda = ${l}$ is negative, so trajectories approach the origin.`, `$\\lambda = ${l}$ 为负，所以轨线趋向原点。`]
            : [en, `$\\lambda = ${l}$ is positive, so trajectories leave the origin.`, `$\\lambda = ${l}$ 为正，所以轨线离开原点。`];
        };
        return reasoned(problem, [0, 1, 2, 3].map(reason));
      },
    },
  ],
};

/** phasePortraitsForLinearSystemsWithZeroEigenvalues examines lines of equilibria. */
export const phasePortraitsForLinearSystemsWithZeroEigenvalues: TopicDef = {
  id: "phase-portraits-for-linear-systems-with-zero-eigenvalues",
  title: t("Phase Portraits for Linear Systems With Zero Eigenvalues", "具有零特征值的线性系统相图"),
  summary: t(
    "When det(A) = 0, λ = 0 is an eigenvalue, and the nullspace ker(A) forms an entire continuous line of non-isolated equilibrium points.",
    "当 det(A) = 0 时，λ = 0 是特征值，零空间 ker(A) 形成一整条非孤立平衡点构成的平衡线。",
  ),
  intro: t(
    "Take $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$. Its determinant is $4 - 4 = 0$, so $\\lambda = 0$ is an eigenvalue and every point of the line $x + 2y = 0$ is an equilibrium. The other eigenvalue is the trace, $5$, with eigenvector $(1, 2)$: every other trajectory is a straight line parallel to $(1, 2)$, moving away from the line of equilibria because $5 > 0$.\n\nCheck: $A\\begin{pmatrix} 2 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$, so $(2, -1)$ is on the line of equilibria, and $A\\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 10 \\end{pmatrix} = 5\\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$.\n\nIn this lesson we find the line of equilibria of a singular system and the nonzero eigenvalue that moves the other trajectories.",
    "取 $A = \\begin{pmatrix} 1 & 2 \\\\ 2 & 4 \\end{pmatrix}$。其行列式为 $4 - 4 = 0$，所以 $\\lambda = 0$ 是特征值，直线 $x + 2y = 0$ 上的每一点都是平衡点。另一个特征值等于迹 $5$，特征向量为 $(1, 2)$：其余每条轨线都是平行于 $(1, 2)$ 的直线，因为 $5 > 0$，它们远离平衡点直线。\n\n检验：$A\\begin{pmatrix} 2 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$，所以 $(2, -1)$ 在平衡点直线上；$A\\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 10 \\end{pmatrix} = 5\\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$。\n\n本课我们求奇异方程组的平衡点直线，以及推动其余轨线的非零特征值。",
  ),
  prerequisites: ["phase-portraits-for-linear-systems-with-real-distinct-eigenvalues"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "lines-of-equilibria-when-determinant-is-zero",
      title: t("Lines of equilibria when determinant is zero", "零特征值系统的平衡线方程"),
      explanation: t(
        "A zero determinant means the matrix sends a whole line of vectors to zero, so every point of that line is an equilibrium. For $A = \\begin{pmatrix} a & b \\\\ 2a & 2b \\end{pmatrix}$, $\\det(A) = 0$. The equilibrium points satisfy $a x + b y = 0$.\n\n> **Watch out.** Solving $ax + y = 0$ for $y$ flips the sign: $y = -ax$. For $A = \\begin{pmatrix} 3 & 1 \\\\ 6 & 2 \\end{pmatrix}$ the line is $y = -3x$, not $y = 3x$.",
        "行列式为零意味着矩阵把一整条直线上的向量都映射到零，所以这条直线上的每一点都是平衡点。对于秩为 1 的矩阵 $A = \\begin{pmatrix} a & b \\\\ 2a & 2b \\end{pmatrix}$，$\\det(A) = 0$。其平衡点轨迹构成直线 $a x + b y = 0$。\n\n> **注意。** 由 $ax + y = 0$ 解出 $y$ 时符号要变：$y = -ax$。对 $A = \\begin{pmatrix} 3 & 1 \\\\ 6 & 2 \\end{pmatrix}$，直线是 $y = -3x$，而不是 $y = 3x$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 35);
        const ans = -a;
        return numberProblem({
          prompt: t(
            `For the linear system $\\mathbf{x}' = \\begin{pmatrix} ${a} & 1 \\\\ ${2 * a} & 2 \\end{pmatrix} \\mathbf{x}$, the equilibrium points form a line $y = mx$. Find $m$.`,
            `对于线性系统 $\\mathbf{x}' = \\begin{pmatrix} ${a} & 1 \\\\ ${2 * a} & 2 \\end{pmatrix} \\mathbf{x}$，其平衡点构成直线 $y = mx$。求 $m$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(a, "The sign is lost when $y$ is moved to its own side.", "把 $y$ 单独移到一边时丢了符号。"),
            why(
              -2 * a,
              "That reads the entry $2a$ as the slope; the second row is just twice the first.",
              "这是把元素 $2a$ 当成斜率；第二行只是第一行的两倍。",
            ),
            why(
              Q.of(-1, a),
              "That solves for $x$ in terms of $y$; the line is asked as $y = mx$.",
              "这是用 $y$ 表示 $x$；题目要的是 $y = mx$。",
            ),
            why(1, "That is the coefficient of $y$, not the slope of the line.", "这是 $y$ 的系数，不是直线的斜率。"),
          ]),
          solution: walked(
            [
              [
                ["Set $A\\mathbf{x} = \\mathbf{0}$", "令 $A\\mathbf{x} = \\mathbf{0}$"],
                t("", ""),
                [`${a}x + y = 0, \\qquad ${2 * a}x + 2y = 0`],
              ],
              [
                ["Solve for $y$", "解出 $y$"],
                t("The second equation is twice the first, so one equation is left.", "第二个方程是第一个的两倍，只剩一个方程。"),
                [`y = ${ans}x, \\qquad m = ${ans}`],
              ],
            ],
            t(
              `The point $(1, ${ans})$ gives $A\\begin{pmatrix} 1 \\\\ ${ans} \\end{pmatrix} = \\begin{pmatrix} ${a} - ${a} \\\\ ${2 * a} - ${2 * a} \\end{pmatrix} = \\mathbf{0}$, so it is an equilibrium.`,
              `点 $(1, ${ans})$ 给出 $A\\begin{pmatrix} 1 \\\\ ${ans} \\end{pmatrix} = \\begin{pmatrix} ${a} - ${a} \\\\ ${2 * a} - ${2 * a} \\end{pmatrix} = \\mathbf{0}$，所以它是平衡点。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-nonzero-eigenvalue-of-a-singular-system",
      figure:
        differentialEquationsDrawings1[
          "phase-portraits-for-linear-systems-with-zero-eigenvalues#the-nonzero-eigenvalue-of-a-singular-system"
        ],
      title: t("The nonzero eigenvalue of a singular system", "奇异方程组的非零特征值"),
      explanation: t(
        "If $\\det(A) = 0$ then $0$ is an eigenvalue, and the other eigenvalue equals the trace because the eigenvalues add up to $\\operatorname{tr}(A)$. Its eigenvector gives the direction of the parallel straight trajectories, and its sign decides the motion. If $\\operatorname{tr}(A) < 0$ trajectories move toward the line of equilibria; if $\\operatorname{tr}(A) > 0$ they move away from it.\n\n> **Watch out.** The trace adds only the diagonal entries. For $A = \\begin{pmatrix} 2 & 4 \\\\ 1 & 2 \\end{pmatrix}$ the nonzero eigenvalue is $2 + 2 = 4$, not $2 - 2$ and not the sum of all four entries.",
        "若 $\\det(A) = 0$，则 $0$ 是一个特征值，另一个特征值等于迹，因为特征值之和为 $\\operatorname{tr}(A)$。它的特征向量给出平行直线轨线的方向，它的符号决定运动方向。若 $\\operatorname{tr}(A) < 0$，轨线趋向平衡点直线；若 $\\operatorname{tr}(A) > 0$，轨线远离它。\n\n> **注意。** 迹只把对角线元素相加。对 $A = \\begin{pmatrix} 2 & 4 \\\\ 1 & 2 \\end{pmatrix}$，非零特征值为 $2 + 2 = 4$，不是 $2 - 2$，也不是四个元素之和。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-5, 5) || 1;
        const c = rng.int(-5, 5);
        const k = rng.pick([-3, -2, -1, 1, 2, 3]);
        const [b, d] = [k * a, k * c];
        const ans = a + d;
        return numberProblem({
          prompt: t(
            `$A = ${mat(a, b, c, d)}$ has $\\det(A) = 0$. Find the nonzero eigenvalue of $A$, or $0$ if both eigenvalues are zero.`,
            `$A = ${mat(a, b, c, d)}$ 满足 $\\det(A) = 0$。求 $A$ 的非零特征值；若两个特征值都为零，填 $0$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(a - d, "The diagonal entries are added, not subtracted.", "对角线元素要相加，而不是相减。"),
            why(-ans, "The sign is flipped: the eigenvalues add up to the trace itself.", "符号反了：特征值之和就是迹本身。"),
            why(a, "That takes only the first diagonal entry; the trace adds both.", "这里只取了第一个对角元素；迹是两个之和。"),
            why(b + c, "That adds the off-diagonal entries; the trace uses the diagonal.", "这是非对角元素之和；迹用的是对角线。"),
          ]),
          solution: walked(
            [
              [
                ["Write the characteristic polynomial", "写出特征多项式"],
                t("With $\\det(A) = 0$ the constant term vanishes.", "由于 $\\det(A) = 0$，常数项为零。"),
                [`\\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det(A) = \\lambda\\left(\\lambda - \\operatorname{tr}(A)\\right)`],
              ],
              [
                ["Read the eigenvalues", "读出特征值"],
                t("", ""),
                [`\\lambda = 0, \\qquad \\lambda = \\operatorname{tr}(A) = ${a} ${signed(d)} = ${ans}`],
              ],
            ],
            t(
              `The first column is an eigenvector for it: $A${vec(a, c)} = ${vec(a * a + b * c, c * a + d * c)} = ${ans === 0 ? "\\mathbf{0}" : `${cf(ans)}${vec(a, c)}`}$.`,
              `第一列就是它的特征向量：$A${vec(a, c)} = ${vec(a * a + b * c, c * a + d * c)} = ${ans === 0 ? "\\mathbf{0}" : `${cf(ans)}${vec(a, c)}`}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** phasePortraitsForLinearSystemsWithComplexEigenvalues classifies centers and spirals. */
export const phasePortraitsForLinearSystemsWithComplexEigenvalues: TopicDef = {
  id: "phase-portraits-for-linear-systems-with-complex-eigenvalues",
  title: t("Phase Portraits for Linear Systems With Complex Eigenvalues", "具有复特征值的线性系统相图"),
  summary: t(
    "When eigenvalues are purely imaginary (α = 0), the origin is a center surrounded by closed concentric elliptical orbits; when α ≠ 0, trajectories spiral.",
    "当特征值为纯虚数（α = 0）时，原点为被封闭同心椭圆轨道包围的中心点；当实部 α ≠ 0 时，相轨迹向内或向外螺旋发散。",
  ),
  intro: t(
    "Take $A = \\begin{pmatrix} -1 & -2 \\\\ 2 & -1 \\end{pmatrix}$. The trace is $-2$ and the determinant is $1 + 4 = 5$, so $\\operatorname{tr}(A)^2 = 4 < 20 = 4\\det(A)$ and the eigenvalues are complex, $-1 \\pm 2i$. The real part $-1$ makes trajectories spiral into the origin: a stable spiral. At $(1, 0)$ the velocity is the first column $(-1, 2)$, which points upward, so the turning is counterclockwise.\n\nCheck: $\\lambda^2 + 2\\lambda + 5 = 0$ gives $\\lambda = \\frac{-2 \\pm \\sqrt{4 - 20}}{2} = -1 \\pm 2i$.\n\nIn this lesson we classify centers and spirals and read their direction of turning.",
    "取 $A = \\begin{pmatrix} -1 & -2 \\\\ 2 & -1 \\end{pmatrix}$。迹为 $-2$，行列式为 $1 + 4 = 5$，所以 $\\operatorname{tr}(A)^2 = 4 < 20 = 4\\det(A)$，特征值为复数 $-1 \\pm 2i$。实部 $-1$ 使轨线螺旋地进入原点：稳定焦点。在 $(1, 0)$ 处速度为第一列 $(-1, 2)$，指向上方，所以是逆时针旋转。\n\n检验：$\\lambda^2 + 2\\lambda + 5 = 0$ 给出 $\\lambda = \\frac{-2 \\pm \\sqrt{4 - 20}}{2} = -1 \\pm 2i$。\n\n本课我们判别中心与焦点，并读出它们的旋转方向。",
  ),
  prerequisites: ["phase-portraits-for-linear-systems-with-real-distinct-eigenvalues"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "centers-and-spiral-points",
      figure: differentialEquationsDrawings1["phase-portraits-for-linear-systems-with-complex-eigenvalues#centers-and-spiral-points"],
      title: t("Frequency of closed orbits around a center", "中心点周围封闭轨道的循环频率"),
      explanation: t(
        "Purely imaginary eigenvalues give closed orbits that circle the origin forever, and their frequency is the imaginary part. For $A = \\begin{pmatrix} 0 & -\\omega \\\\ \\omega & 0 \\end{pmatrix}$, eigenvalues are $\\pm i\\omega$, producing a center with angular frequency $\\omega$. More generally, $\\begin{pmatrix} 0 & a \\\\ b & 0 \\end{pmatrix}$ with $ab < 0$ has eigenvalues $\\pm i\\sqrt{-ab}$.\n\n> **Watch out.** The frequency is the square root of $-ab$, not $-ab$ itself. For $\\begin{pmatrix} 0 & -4 \\\\ 9 & 0 \\end{pmatrix}$, $\\omega = \\sqrt{36} = 6$.",
        "纯虚特征值给出永远绕原点运行的闭轨道，频率就是虚部。对于系统 $A = \\begin{pmatrix} 0 & -\\omega \\\\ \\omega & 0 \\end{pmatrix}$，特征值为纯虚根 $\\pm i\\omega$，原点为中心点，闭轨道的角频率为 $\\omega$。 更一般地，当 $ab < 0$ 时，$\\begin{pmatrix} 0 & a \\\\ b & 0 \\end{pmatrix}$ 的特征值为 $\\pm i\\sqrt{-ab}$。\n\n> **注意。** 频率是 $-ab$ 的平方根，而不是 $-ab$ 本身。对 $\\begin{pmatrix} 0 & -4 \\\\ 9 & 0 \\end{pmatrix}$，$\\omega = \\sqrt{36} = 6$。",
      ),
      generate(rng: Rng): Problem {
        const u = rng.int(1, 6);
        const v = u + rng.int(1, 5);
        const flip = rng.pick([1, -1]);
        const a = flip * u * u;
        const b = -flip * v * v;
        const ans = u * v;
        const product = u * u * v * v;
        return numberProblem({
          prompt: t(
            `The phase portrait of $\\mathbf{x}' = \\begin{pmatrix} 0 & ${a} \\\\ ${b} & 0 \\end{pmatrix} \\mathbf{x}$ consists of closed elliptical orbits around a center. Find the angular frequency $\\omega$ of the motion on these orbits.`,
            `系统 $\\mathbf{x}' = \\begin{pmatrix} 0 & ${a} \\\\ ${b} & 0 \\end{pmatrix} \\mathbf{x}$ 的相图由围绕中心的封闭椭圆轨道组成。求轨道上运动的角频率 $\\omega$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(product, "That is $\\omega^2$; take the square root.", "这是 $\\omega^2$；还要开平方。"),
            why(
              u * u + v * v,
              "That adds the sizes of the entries; $\\omega^2$ is minus their product.",
              "这是把元素的大小相加；$\\omega^2$ 是它们之积的相反数。",
            ),
            why(
              u * u,
              "That uses only one off-diagonal entry; both enter $\\omega^2 = -ab$.",
              "这里只用了一个非对角元素；两个都要进入 $\\omega^2 = -ab$。",
            ),
            why(
              v * v,
              "That uses only one off-diagonal entry; both enter $\\omega^2 = -ab$.",
              "这里只用了一个非对角元素；两个都要进入 $\\omega^2 = -ab$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the characteristic equation", "写出特征方程"],
                t("", ""),
                [`\\det(A - \\lambda I) = \\lambda^2 - ${par(a)} \\cdot ${par(b)} = \\lambda^2 + ${product} = 0`],
              ],
              [
                ["Read the frequency", "读出频率"],
                t(
                  "Purely imaginary roots $\\pm \\omega i$ give motion with $\\cos\\omega t$ and $\\sin\\omega t$.",
                  "纯虚根 $\\pm \\omega i$ 对应含 $\\cos\\omega t$ 与 $\\sin\\omega t$ 的运动。",
                ),
                [`\\lambda = \\pm ${ans}i, \\qquad \\omega = ${ans}`],
              ],
            ],
            t(
              `Squaring back, $\\omega^2 = ${ans}^2 = ${product} = -(${a})(${b})$, as required.`,
              `平方回去，$\\omega^2 = ${ans}^2 = ${product} = -(${a})(${b})$，符合要求。`,
            ),
          ),
        });
      },
    },
    {
      id: "classifying-a-spiral-or-center",
      title: t("Classifying a spiral or center", "判别焦点或中心"),
      explanation: t(
        "When $\\operatorname{tr}(A)^2 < 4\\det(A)$ the eigenvalues $\\alpha \\pm \\beta i$ are complex and trajectories turn around the origin. The real part $\\alpha = \\tfrac{1}{2}\\operatorname{tr}(A)$ decides the rest: $\\alpha < 0$ gives a stable spiral, $\\alpha > 0$ an unstable spiral, and $\\alpha = 0$ a center with closed orbits. The direction of turning is read from $A$ at the point $(1, 0)$: the velocity there is the first column of $A$, so a positive entry $A_{21}$ means counterclockwise motion.\n\n> **Watch out.** The direction comes from the lower-left entry $A_{21}$, not the upper-right one. For $A = \\begin{pmatrix} -1 & -2 \\\\ 2 & -1 \\end{pmatrix}$, $A_{21} = 2 > 0$, so the stable spiral turns counterclockwise.",
        "当 $\\operatorname{tr}(A)^2 < 4\\det(A)$ 时，特征值 $\\alpha \\pm \\beta i$ 为复数，轨线绕原点旋转。实部 $\\alpha = \\tfrac{1}{2}\\operatorname{tr}(A)$ 决定其余性质：$\\alpha < 0$ 为稳定焦点，$\\alpha > 0$ 为不稳定焦点，$\\alpha = 0$ 为中心，轨道闭合。旋转方向可在点 $(1, 0)$ 处读出：那里的速度是 $A$ 的第一列，所以 $A_{21}$ 为正表示逆时针运动。\n\n> **注意。** 方向由左下角元素 $A_{21}$ 决定，而不是右上角。对 $A = \\begin{pmatrix} -1 & -2 \\\\ 2 & -1 \\end{pmatrix}$，$A_{21} = 2 > 0$，所以这个稳定焦点逆时针旋转。",
      ),
      generate(rng: Rng): Problem {
        const al = rng.pick([-2, -1, 0, 0, 1, 2]);
        const be = rng.int(1, 4);
        const u = rng.int(-2, 2);
        const n = u * u + be * be;
        const divs = Array.from({ length: n }, (_, i) => i + 1).filter((k) => n % k === 0);
        const v = rng.pick(divs) * rng.pick([-1, 1]);
        const w = n / v;
        const [a, b, c, d] = [al + u, -v, w, al - u];
        const kind = al < 0 ? 0 : al > 0 ? 1 : 2;
        const ccw = c > 0;
        const correct = kind * 2 + (ccw ? 0 : 1);
        const names = [
          t("Stable spiral, counterclockwise", "稳定焦点，逆时针"),
          t("Stable spiral, clockwise", "稳定焦点，顺时针"),
          t("Unstable spiral, counterclockwise", "不稳定焦点，逆时针"),
          t("Unstable spiral, clockwise", "不稳定焦点，顺时针"),
          t("Center, counterclockwise", "中心，逆时针"),
          t("Center, clockwise", "中心，顺时针"),
        ];
        const tr = a + d;
        const det = a * d - b * c;
        const roots = `${al === 0 ? "" : `${al} `}\\pm ${be === 1 ? "" : be}i`;
        const problem = choiceProblem({
          prompt: t(
            `Classify the origin for $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ and give the direction of rotation.`,
            `判断 $\\mathbf{x}' = ${mat(a, b, c, d)}\\mathbf{x}$ 的原点类型，并给出旋转方向。`,
          ),
          options: names,
          correct,
          solution: walked(
            [
              [
                ["Find the eigenvalues", "求特征值"],
                t("", ""),
                [
                  `\\operatorname{tr}(A) = ${tr}, \\qquad \\det(A) = ${det}`,
                  `${poly([1, "\\lambda^2"], [-tr, "\\lambda"], [det, ""])} = 0, \\qquad \\lambda = ${roots}`,
                ],
              ],
              [
                ["Read the real part", "看实部"],
                kind === 0
                  ? t(`The real part $${al}$ is negative: a stable spiral.`, `实部 $${al}$ 为负：稳定焦点。`)
                  : kind === 1
                    ? t(`The real part $${al}$ is positive: an unstable spiral.`, `实部 $${al}$ 为正：不稳定焦点。`)
                    : t("The real part is zero: a center.", "实部为零：中心。"),
                [],
              ],
              [
                ["Find the direction", "判断方向"],
                t(
                  `At $(1, 0)$ the velocity is $(${a}, ${c})$, which points ${ccw ? "up, so the motion is counterclockwise" : "down, so the motion is clockwise"}.`,
                  `在 $(1, 0)$ 处速度为 $(${a}, ${c})$，指向${ccw ? "上方，所以逆时针运动" : "下方，所以顺时针运动"}。`,
                ),
                [],
              ],
            ],
            t(
              `$\\operatorname{tr}(A)^2 - 4\\det(A) = ${tr * tr} - ${4 * det} = ${tr * tr - 4 * det} < 0$, which confirms complex eigenvalues with real part $\\frac{1}{2}\\operatorname{tr}(A) = ${al}$.`,
              `$\\operatorname{tr}(A)^2 - 4\\det(A) = ${tr * tr} - ${4 * det} = ${tr * tr - 4 * det} < 0$，确认特征值为复数，实部为 $\\frac{1}{2}\\operatorname{tr}(A) = ${al}$。`,
            ),
          ),
        });
        const reason = (i: number): [string, string, string] => {
          const en = names[i]?.en ?? "";
          const k = Math.floor(i / 2);
          if (k !== kind)
            return kind === 2
              ? [
                  en,
                  "The trace is zero, so the real part is zero and the orbits close: a center.",
                  "迹为零，所以实部为零，轨道闭合：中心。",
                ]
              : [
                  en,
                  `The real part is $\\frac{1}{2}\\operatorname{tr}(A) = ${al}$, which is ${al < 0 ? "negative, so trajectories spiral in" : "positive, so trajectories spiral out"}.`,
                  `实部为 $\\frac{1}{2}\\operatorname{tr}(A) = ${al}$，${al < 0 ? "为负，所以轨线螺旋进入" : "为正，所以轨线螺旋离开"}。`,
                ];
          return [
            en,
            `At $(1, 0)$ the velocity $(${a}, ${c})$ has ${ccw ? "a positive" : "a negative"} second entry, so the turning is ${ccw ? "counterclockwise" : "clockwise"}.`,
            `在 $(1, 0)$ 处速度 $(${a}, ${c})$ 的第二个分量${ccw ? "为正" : "为负"}，所以${ccw ? "逆时针" : "顺时针"}旋转。`,
          ];
        };
        return reasoned(problem, [0, 1, 2, 3, 4, 5].map(reason));
      },
    },
  ],
};

/** shiftedSystemsOfOdes translates equilibria away from the origin. */
export const shiftedSystemsOfOdes: TopicDef = {
  id: "shifted-systems-of-odes",
  title: t("Shifted Systems of ODEs", "平移线性微分方程组"),
  summary: t(
    "A shifted system $\\mathbf{x}' = A(\\mathbf{x} - \\mathbf{x}_*)$ moves the phase portrait to the equilibrium $\\mathbf{x}_*$; the substitution $\\mathbf{u} = \\mathbf{x} - \\mathbf{x}_*$ moves it back to the origin.",
    "平移系统 $\\mathbf{x}' = A(\\mathbf{x} - \\mathbf{x}_*)$ 把相图平移到平衡点 $\\mathbf{x}_*$；代换 $\\mathbf{u} = \\mathbf{x} - \\mathbf{x}_*$ 可化回原点形式。",
  ),
  intro: t(
    "Take $x' = x + y - 3$, $y' = x - y - 1$. Setting both rates to zero gives $x + y = 3$ and $x - y = 1$, so the equilibrium is $(2, 1)$. With $u = x - 2$ and $v = y - 1$ the constants cancel: $u' = u + v$, $v' = u - v$. The matrix $\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$ has determinant $-2 < 0$, so $(2, 1)$ is a saddle.\n\nCheck: at $(2, 1)$, $2 + 1 - 3 = 0$ and $2 - 1 - 1 = 0$, and $u + v = (x - 2) + (y - 1) = x + y - 3$.\n\nIn this lesson we move the equilibrium of a system with constant terms to the origin and classify it there.",
    "取 $x' = x + y - 3$，$y' = x - y - 1$。令两个变化率为零得 $x + y = 3$ 与 $x - y = 1$，所以平衡点为 $(2, 1)$。令 $u = x - 2$，$v = y - 1$，常数项抵消：$u' = u + v$，$v' = u - v$。矩阵 $\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$ 的行列式为 $-2 < 0$，所以 $(2, 1)$ 是鞍点。\n\n检验：在 $(2, 1)$ 处，$2 + 1 - 3 = 0$，$2 - 1 - 1 = 0$；并且 $u + v = (x - 2) + (y - 1) = x + y - 3$。\n\n本课我们把带常数项的方程组的平衡点移到原点，并在那里判断其类型。",
  ),
  prerequisites: ["equilibrium-points-and-stability-for-systems-of-odes"],
  encompasses: [
    {
      topic: "equilibrium-points-and-stability-for-systems-of-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "translation-of-equilibrium-to-the-origin",
      title: t("Coordinates of a shifted equilibrium point", "平移平衡点的空间坐标"),
      explanation: t(
        "Shifting the variable by the equilibrium value moves the equilibrium to the origin, where the standard analysis applies. For $x' = -a(x - x_*)$, the equilibrium point is located at $x = x_*$. So $x' = -ax + b$ has its equilibrium where $-ax + b = 0$.\n\n> **Watch out.** Solving $-ax + b = 0$ gives $x_* = \\frac{b}{a}$, with no minus sign. For $x' = -3x + 12$, $x_* = 4$, not $-4$ and not $12$.",
        "把变量平移一个平衡值，就把平衡点移到原点，在那里可以使用标准的分析方法。对于方程 $x' = -a(x - x_*)$，系统的稳定平衡点位于 $x = x_*$。 所以 $x' = -ax + b$ 的平衡点满足 $-ax + b = 0$。\n\n> **注意。** 解 $-ax + b = 0$ 得 $x_* = \\frac{b}{a}$，没有负号。对 $x' = -3x + 12$，$x_* = 4$，不是 $-4$，也不是 $12$。",
      ),
      generate(rng: Rng): Problem {
        const xStar = rng.nonZero(-9, 12);
        const a = rng.int(2, 8);
        const b = a * xStar;
        const rhs = poly([-a, "x"], [b, ""]);
        return numberProblem({
          prompt: t(
            `The substitution $z = x - x_*$ moves the equilibrium of $x' = ${rhs}$ to the origin. Find $x_*$.`,
            `代换 $z = x - x_*$ 把 $x' = ${rhs}$ 的平衡点移到原点。求 $x_*$。`,
          ),
          answer: xStar,
          mistakes: apart(xStar, [
            why(b, "That is the constant term; divide it by the rate $a$.", "这是常数项；还要除以速率 $a$。"),
            why(a, "That is the rate of decay, not the place where the rate is zero.", "这是衰减速率，不是变化率为零的位置。"),
            why(-xStar, "The sign is flipped when the term in $x$ is moved across.", "把含 $x$ 的项移到另一边时符号弄反了。"),
            why(Q.of(a, b), "That divides the wrong way: $x_* = \\frac{b}{a}$.", "除反了：$x_* = \\frac{b}{a}$。"),
          ]),
          solution: walked(
            [
              [["Set the rate to zero", "令变化率为零"], t("", ""), [`${rhs} = 0`]],
              [["Solve for $x$", "解出 $x$"], t("", ""), [`x_* = ${b} \\div ${a} = ${xStar}`]],
            ],
            t(
              `Substituting, $-${a} \\cdot ${par(xStar)} ${signed(b)} = 0$, and with $z = x - ${par(xStar)}$ the equation becomes $z' = -${a}z$, whose equilibrium is $z = 0$.`,
              `代入得 $-${a} \\cdot ${par(xStar)} ${signed(b)} = 0$；令 $z = x - ${par(xStar)}$，方程化为 $z' = -${a}z$，其平衡点为 $z = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-equilibrium-of-a-shifted-coupled-system",
      title: t("The equilibrium of a shifted coupled system", "平移耦合方程组的平衡点"),
      explanation: t(
        "A system $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{b}$ with $\\det(A) \\ne 0$ has one equilibrium $\\mathbf{x}_*$, found by solving $A\\mathbf{x}_* = -\\mathbf{b}$. Shifting to $\\mathbf{u} = \\mathbf{x} - \\mathbf{x}_*$ gives $\\mathbf{u}' = A\\mathbf{u}$, so the portrait is the one of $A$ moved to $\\mathbf{x}_*$. Then the eigenvalues of $A$ also classify the equilibrium $\\mathbf{x}_*$.\n\n> **Watch out.** The constants move to the right-hand side with their signs flipped: $x' = x + y - 3$, $y' = x - y - 1$ leads to $x + y = 3$ and $x - y = 1$, so the equilibrium is $(2, 1)$.",
        "当 $\\det(A) \\ne 0$ 时，方程组 $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{b}$ 有唯一平衡点 $\\mathbf{x}_*$，由 $A\\mathbf{x}_* = -\\mathbf{b}$ 解出。平移 $\\mathbf{u} = \\mathbf{x} - \\mathbf{x}_*$ 后得 $\\mathbf{u}' = A\\mathbf{u}$，所以相图就是 $A$ 的相图平移到 $\\mathbf{x}_*$。于是 $A$ 的特征值同样判定平衡点 $\\mathbf{x}_*$ 的类型。\n\n> **注意。** 常数项移到右边时要变号：$x' = x + y - 3$，$y' = x - y - 1$ 化为 $x + y = 3$ 与 $x - y = 1$，所以平衡点为 $(2, 1)$。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c, d] = rng.pick([
          [1, 1, 1, 2],
          [-1, 2, 1, -3],
          [2, -1, 3, -1],
          [-3, 2, -2, 1],
          [1, -2, 1, -1],
          [-2, 1, 1, -1],
        ] as const);
        const x = rng.int(-5, 5) || 3;
        const y = rng.int(-5, 5);
        const e = -(a * x + b * y);
        const f = -(c * x + d * y);
        const comp = rng.int(1, 2);
        const ans = comp === 1 ? x : y;
        return numberProblem({
          prompt: t(
            `Shift $x' = ${poly([a, "x"], [b, "y"], [e, ""])}$, $y' = ${poly([c, "x"], [d, "y"], [f, ""])}$ to its equilibrium $(x_*, y_*)$. Find $${comp === 1 ? "x_*" : "y_*"}$.`,
            `把 $x' = ${poly([a, "x"], [b, "y"], [e, ""])}$，$y' = ${poly([c, "x"], [d, "y"], [f, ""])}$ 平移到平衡点 $(x_*, y_*)$。求 $${comp === 1 ? "x_*" : "y_*"}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(comp === 1 ? y : x, "That is the other coordinate of the equilibrium.", "这是平衡点的另一个坐标。"),
            why(-ans, "The constants were moved across without flipping their signs.", "常数项移到另一边时没有变号。"),
            why(
              comp === 1 ? e : f,
              "That is a constant term of the system, not a coordinate of the equilibrium.",
              "这是方程组的常数项，不是平衡点的坐标。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Set both rates to zero", "令两个变化率为零"],
                t("", ""),
                [`${poly([a, "x"], [b, "y"])} = ${-e}, \\qquad ${poly([c, "x"], [d, "y"])} = ${-f}`],
              ],
              [
                ["Solve the pair", "解这组方程"],
                t(
                  "The determinant of the coefficients is $1$, so Cramer's rule needs no division.",
                  "系数行列式为 $1$，所以克拉默法则不需要除法。",
                ),
                [
                  `x_* = ${par(-e)} \\cdot ${par(d)} - ${par(b)} \\cdot ${par(-f)} = ${x}`,
                  `y_* = ${par(a)} \\cdot ${par(-f)} - ${par(c)} \\cdot ${par(-e)} = ${y}`,
                ],
              ],
            ],
            t(
              `At $(${x}, ${y})$: $${a} \\cdot ${par(x)} ${signed(b)} \\cdot ${par(y)} ${signed(e)} = 0$ and $${c} \\cdot ${par(x)} ${signed(d)} \\cdot ${par(y)} ${signed(f)} = 0$.`,
              `在 $(${x}, ${y})$ 处：$${a} \\cdot ${par(x)} ${signed(b)} \\cdot ${par(y)} ${signed(e)} = 0$，$${c} \\cdot ${par(x)} ${signed(d)} \\cdot ${par(y)} ${signed(f)} = 0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** linearApproximationsNearEquilibria uses the Jacobian matrix. */
export const linearApproximationsNearEquilibria: TopicDef = {
  id: "linear-approximations-near-equilibria",
  title: t("Linear Approximations Near Equilibria", "平衡点附近的线性化近似"),
  summary: t(
    "Near an equilibrium $\\mathbf{x}_*$, a nonlinear system $\\mathbf{x}' = F(\\mathbf{x})$ is approximated by $\\mathbf{u}' = J(\\mathbf{x}_*)\\mathbf{u}$, where $J$ is the Jacobian matrix.",
    "在平衡点 $\\mathbf{x}_*$ 附近，非线性系统 $\\mathbf{x}' = F(\\mathbf{x})$ 可用 $\\mathbf{u}' = J(\\mathbf{x}_*)\\mathbf{u}$ 近似，其中 $J$ 为雅可比矩阵。",
  ),
  intro: t(
    "Take $x' = 4x - x^2$, $y' = -y$. The equilibria are $(0, 0)$ and $(4, 0)$. The Jacobian is $J = \\begin{pmatrix} 4 - 2x & 0 \\\\ 0 & -1 \\end{pmatrix}$, which at $(4, 0)$ is $\\begin{pmatrix} -4 & 0 \\\\ 0 & -1 \\end{pmatrix}$. Both eigenvalues are negative, so $(4, 0)$ is a stable node.\n\nCheck: with $x = 4 + u$, $4x - x^2 = x(4 - x) = (4 + u)(-u) = -4u - u^2 \\approx -4u$ for small $u$, matching $J_{11} = -4$.\n\nIn this lesson we linearize a nonlinear system at an equilibrium with its Jacobian and use it to classify the equilibrium.",
    "取 $x' = 4x - x^2$，$y' = -y$。平衡点为 $(0, 0)$ 与 $(4, 0)$。雅可比矩阵为 $J = \\begin{pmatrix} 4 - 2x & 0 \\\\ 0 & -1 \\end{pmatrix}$，在 $(4, 0)$ 处为 $\\begin{pmatrix} -4 & 0 \\\\ 0 & -1 \\end{pmatrix}$。两个特征值都为负，所以 $(4, 0)$ 是稳定结点。\n\n检验：令 $x = 4 + u$，$4x - x^2 = x(4 - x) = (4 + u)(-u) = -4u - u^2$，$u$ 很小时约为 $-4u$，与 $J_{11} = -4$ 一致。\n\n本课我们用雅可比矩阵在平衡点处线性化非线性方程组，并据此判断平衡点类型。",
  ),
  prerequisites: ["shifted-systems-of-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "jacobian-matrix-and-local-linearization",
      title: t("Jacobian entry of a nonlinear system", "非线性系统在平衡点处的雅可比矩阵元素"),
      explanation: t(
        "Near an equilibrium a nonlinear system behaves like its linearization, whose matrix is the Jacobian of partial derivatives evaluated there. For $x' = f(x, y) = a x - x^2$, the partial derivative $\\frac{\\partial f}{\\partial x} = a - 2x$. At the origin $(0, 0)$, $J_{11} = a$. At the other equilibrium $(a, 0)$, $J_{11} = a - 2a = -a$.\n\n> **Watch out.** Differentiate first, then substitute the point. For $f = 6x - 2x^2$ at $x = 3$, $f_x = 6 - 4x = -6$, while the value of $f$ itself there is $0$.",
        "在平衡点附近，非线性方程组的行为与它的线性化相似，其矩阵是在该点处求值的偏导数雅可比矩阵。对于 $x' = f(x, y) = a x - x^2$，偏导数为 $\\frac{\\partial f}{\\partial x} = a - 2x$。在原点平衡点 $(0, 0)$ 处，雅可比元素为 $J_{11} = a$。 在另一个平衡点 $(a, 0)$ 处，$J_{11} = a - 2a = -a$。\n\n> **注意。** 先求导，再代入该点。对 $f = 6x - 2x^2$ 在 $x = 3$ 处，$f_x = 6 - 4x = -6$，而 $f$ 本身在该点的值是 $0$。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.int(1, 5);
        const e = rng.int(2, 9);
        const a = b * e;
        const ans = -a;
        const f1 = poly([a, "x"], [-b, "x^2"]);
        const fx = poly([a, ""], [-2 * b, "x"]);
        return numberProblem({
          prompt: t(
            `Consider the nonlinear system $x' = ${f1}$ and $y' = -y$. Evaluate the entry $J_{11} = \\frac{\\partial f_1}{\\partial x}$ of the Jacobian matrix at the equilibrium $(x, y) = (${e}, 0)$.`,
            `考虑非线性动力系统 $x' = ${f1}$ 与 $y' = -y$。计算在平衡点 $(x, y) = (${e}, 0)$ 处雅可比矩阵的元素 $J_{11} = \\frac{\\partial f_1}{\\partial x}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(a, "That is the entry at the origin; substitute the given equilibrium.", "这是原点处的元素；要代入给定的平衡点。"),
            why(a - 2 * b, "That substitutes $x = 1$ instead of the equilibrium value.", "这里代入的是 $x = 1$，而不是平衡点的值。"),
            why(a - b * e * e, "That leaves $x^2$ undifferentiated; its derivative is $2x$.", "这里没有对 $x^2$ 求导；它的导数是 $2x$。"),
            why(2 * a, "The sign is lost in the term $-2bx$.", "在 $-2bx$ 这一项中丢了符号。"),
          ]),
          solution: walked(
            [
              [["Differentiate", "求偏导"], t("", ""), [`\\frac{\\partial f_1}{\\partial x} = ${fx}`]],
              [["Substitute the point", "代入该点"], t("", ""), [`J_{11} = ${a} - ${2 * b} \\cdot ${e} = ${ans}`]],
            ],
            t(
              `With $x = ${e} + u$: $${f1} = x(${poly([a, ""], [-b, "x"])}) = (${e} + u)(${cf(-b)}u) \\approx -${a}u$ for small $u$, so $J_{11} = ${ans}$.`,
              `令 $x = ${e} + u$：$${f1} = x(${poly([a, ""], [-b, "x"])}) = (${e} + u)(${cf(-b)}u)$，$u$ 很小时约为 $-${a}u$，所以 $J_{11} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-jacobian-at-an-interior-equilibrium",
      title: t("The Jacobian at an interior equilibrium", "内部平衡点处的雅可比矩阵"),
      explanation: t(
        "Near an equilibrium $(x_*, y_*)$ of $x' = f(x, y)$, $y' = g(x, y)$, the system behaves like $\\mathbf{u}' = J\\mathbf{u}$ with\n\n$$J = \\begin{pmatrix} f_x & f_y \\\\ g_x & g_y \\end{pmatrix}\\Bigg|_{(x_*, y_*)}.$$\n\nFind the equilibrium first, then differentiate, then substitute: the partial derivatives of a product such as $xy$ depend on the point. The trace and determinant of $J$ classify the equilibrium when the linearization is not a borderline case.\n\n> **Watch out.** Match each partial derivative to its variable: for $f = 6 - xy$ at $(2, 3)$, $f_x = -y = -3$ and $f_y = -x = -2$, not the other way round.",
        "在 $x' = f(x, y)$，$y' = g(x, y)$ 的平衡点 $(x_*, y_*)$ 附近，方程组的行为类似 $\\mathbf{u}' = J\\mathbf{u}$，其中\n\n$$J = \\begin{pmatrix} f_x & f_y \\\\ g_x & g_y \\end{pmatrix}\\Bigg|_{(x_*, y_*)}.$$\n\n先求平衡点，再求偏导，最后代入：像 $xy$ 这样的乘积，其偏导数与点有关。线性化不属于临界情形时，$J$ 的迹和行列式就能判定平衡点类型。\n\n> **注意。** 每个偏导数要对应正确的变量：对 $f = 6 - xy$ 在 $(2, 3)$ 处，$f_x = -y = -3$，$f_y = -x = -2$，不能颠倒。",
      ),
      generate(rng: Rng): Problem {
        const qv = rng.int(1, 6);
        const r = rng.int(1, 6);
        const k = rng.int(1, 4);
        const p = qv * r;
        const askTrace = rng.int(0, 1) === 0;
        const ans = askTrace ? -r : k * qv;
        const what = askTrace ? "\\operatorname{tr}(J)" : "\\det(J)";
        const g = poly([k, "x"], [-k * qv, ""]);
        return numberProblem({
          prompt: t(
            `Linearize $x' = ${p} - xy$, $y' = ${g}$ at its equilibrium. Find $${what}$ for the Jacobian $J$ there.`,
            `在平衡点处线性化 $x' = ${p} - xy$，$y' = ${g}$。求该点处雅可比矩阵 $J$ 的 $${what}$。`,
          ),
          answer: ans,
          mistakes: apart(
            ans,
            askTrace
              ? [
                  why(r, "The sign is lost: $f_x = -y$.", "符号丢了：$f_x = -y$。"),
                  why(
                    -qv,
                    "That uses $-x$ for $f_x$; the derivative of $-xy$ in $x$ is $-y$.",
                    "这里把 $f_x$ 写成了 $-x$；$-xy$ 对 $x$ 的偏导是 $-y$。",
                  ),
                  why(-r - qv, "That adds $f_y$ as well; the trace uses only the diagonal.", "这里把 $f_y$ 也加上了；迹只用对角线。"),
                  why(0, "That takes only $g_y$; the trace adds $f_x$ too.", "这里只取了 $g_y$；迹还要加上 $f_x$。"),
                ]
              : [
                  why(
                    -k * qv,
                    "The sign is lost: $\\det(J) = (-y_*)(0) - (-x_*)(k)$ is positive.",
                    "符号丢了：$\\det(J) = (-y_*)(0) - (-x_*)(k)$ 为正。",
                  ),
                  why(k * r, "That uses $y_*$ where $f_y = -x$ needs $x_*$.", "这里用了 $y_*$，而 $f_y = -x$ 需要 $x_*$。"),
                  why(qv, "That leaves out the factor $k$ from $g_x$.", "这里漏掉了 $g_x$ 中的因子 $k$。"),
                  why(
                    r * qv,
                    "That multiplies the coordinates of the equilibrium instead of taking the determinant.",
                    "这是把平衡点的坐标相乘，而不是求行列式。",
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Find the equilibrium", "求平衡点"],
                t("", ""),
                [`y' = 0 \\implies x_* = ${qv}`, `${p} - ${cf(qv)}y = 0 \\implies y_* = ${r}`],
              ],
              [["Differentiate", "求偏导"], t("", ""), [`J = ${mat("-y", "-x", k, 0)}`]],
              [
                ["Substitute and compute", "代入并计算"],
                t("", ""),
                [
                  `J = ${mat(-r, -qv, k, 0)}`,
                  askTrace ? `\\operatorname{tr}(J) = -${r} + 0 = ${ans}` : `\\det(J) = (-${r})(0) - (-${qv})(${k}) = ${ans}`,
                ],
              ],
            ],
            t(
              `At $(${qv}, ${r})$: $${p} - ${qv} \\cdot ${r} = 0$ and $${k} \\cdot ${qv} - ${k * qv} = 0$, so it is an equilibrium; and $\\det(J - \\lambda I) = ${poly([1, "\\lambda^2"], [r, "\\lambda"], [k * qv, ""])}$ shows $\\operatorname{tr}(J) = ${-r}$ and $\\det(J) = ${k * qv}$.`,
              `在 $(${qv}, ${r})$ 处：$${p} - ${qv} \\cdot ${r} = 0$，$${k} \\cdot ${qv} - ${k * qv} = 0$，所以它是平衡点；并且 $\\det(J - \\lambda I) = ${poly([1, "\\lambda^2"], [r, "\\lambda"], [k * qv, ""])}$，说明 $\\operatorname{tr}(J) = ${-r}$，$\\det(J) = ${k * qv}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.16 Solving Systems of ODEs Using Matrix Methods
// ---------------------------------------------------------------------------

/** matrixExponentials computes e^{At} for nilpotent matrices. */
export const matrixExponentials: TopicDef = {
  id: "matrix-exponentials",
  title: t("Matrix Exponentials", "矩阵指数"),
  summary: t(
    "The matrix exponential $e^{At} = \\sum_{k=0}^{\\infty} \\frac{(At)^k}{k!}$ solves $\\mathbf{x}' = A\\mathbf{x}$; when $A^2 = 0$ the series stops at $I + At$.",
    "矩阵指数 $e^{At} = \\sum_{k=0}^{\\infty} \\frac{(At)^k}{k!}$ 给出 $\\mathbf{x}' = A\\mathbf{x}$ 的解；当 $A^2 = 0$ 时级数截断为 $I + At$。",
  ),
  intro: t(
    "Take $A = \\begin{pmatrix} 0 & 3 \\\\ 0 & 0 \\end{pmatrix}$. Then $A^2 = 0$, so the series $e^{At} = I + At + \\frac{(At)^2}{2!} + \\cdots$ stops after two terms: $e^{At} = \\begin{pmatrix} 1 & 3t \\\\ 0 & 1 \\end{pmatrix}$. With $\\mathbf{x}(0) = (1, 2)$ this gives $\\mathbf{x}(t) = e^{At}\\mathbf{x}(0) = (1 + 6t, 2)$.\n\nCheck: $\\mathbf{x}' = (6, 0)$, and $A\\mathbf{x} = (3 \\cdot 2, 0) = (6, 0)$.\n\nIn this lesson we compute $e^{At}$ for matrices whose powers vanish and for the generator of rotations.",
    "取 $A = \\begin{pmatrix} 0 & 3 \\\\ 0 & 0 \\end{pmatrix}$。则 $A^2 = 0$，所以级数 $e^{At} = I + At + \\frac{(At)^2}{2!} + \\cdots$ 在两项后终止：$e^{At} = \\begin{pmatrix} 1 & 3t \\\\ 0 & 1 \\end{pmatrix}$。取 $\\mathbf{x}(0) = (1, 2)$，得 $\\mathbf{x}(t) = e^{At}\\mathbf{x}(0) = (1 + 6t, 2)$。\n\n检验：$\\mathbf{x}' = (6, 0)$，而 $A\\mathbf{x} = (3 \\cdot 2, 0) = (6, 0)$。\n\n本课我们对幂会变为零的矩阵以及旋转生成矩阵计算 $e^{At}$。",
  ),
  prerequisites: ["solving-homogeneous-systems-of-odes-with-distinct-eigenvalues"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "definition-and-properties-of-matrix-exponentials",
      title: t("Matrix exponential of a nilpotent shear matrix", "幂零剪切矩阵的矩阵指数"),
      explanation: t(
        "The matrix exponential is defined by the same power series as the ordinary exponential, and when a power of the matrix is zero, the series stops. For $A = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$, $A^2 = 0$. Thus $e^{At} = I + At = \\begin{pmatrix} 1 & kt \\\\ 0 & 1 \\end{pmatrix}$. At $t = 1$, the upper right entry is $k$.\n\n> **Watch out.** The upper right entry is $kt$: one factor of $k$ and one of $t$, with no $t^2$ term. For $A = \\begin{pmatrix} 0 & 5 \\\\ 0 & 0 \\end{pmatrix}$ at $t = 3$ it is $15$, not $45$ and not $5$.",
        "矩阵指数由与普通指数相同的幂级数定义，当矩阵的某次幂为零时，级数就终止了。对于矩阵 $A = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$，有 $A^2 = 0$。因此 $e^{At} = I + At = \\begin{pmatrix} 1 & kt \\\\ 0 & 1 \\end{pmatrix}$。在 $t = 1$ 处右上角元素即为 $k$。\n\n> **注意。** 右上角元素是 $kt$：一个因子 $k$ 与一个因子 $t$，没有 $t^2$ 项。对 $A = \\begin{pmatrix} 0 & 5 \\\\ 0 & 0 \\end{pmatrix}$，在 $t = 3$ 处它是 $15$，不是 $45$，也不是 $5$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 12);
        const T = rng.int(2, 6);
        const ans = k * T;
        const A = mat(0, k, 0, 0);
        return numberProblem({
          prompt: t(
            `For the nilpotent matrix $A = ${A}$, calculate the upper right entry of the matrix exponential $e^{At}$ at $t = ${T}$.`,
            `对于幂零矩阵 $A = ${A}$，计算矩阵指数 $e^{At}$ 在 $t = ${T}$ 时的右上角元素。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              k,
              "That is the entry of $A$ itself; in $e^{At}$ it is multiplied by $t$.",
              "这是 $A$ 自身的元素；在 $e^{At}$ 中它还要乘以 $t$。",
            ),
            why(
              k * T * T,
              "There is no $t^2$ term, because $A^2 = 0$ ends the series after $At$.",
              "没有 $t^2$ 项，因为 $A^2 = 0$ 使级数在 $At$ 之后终止。",
            ),
            why(k * k * T, "The entry of $A$ appears once in $At$; it is not squared.", "$A$ 的元素在 $At$ 中只出现一次，不需要平方。"),
            why(1, "That is a diagonal entry of $e^{At}$, which comes from $I$.", "这是 $e^{At}$ 的对角元素，来自 $I$。"),
          ]),
          solution: walked(
            [
              [["Square $A$", "计算 $A^2$"], t("", ""), [`A^2 = ${A}${A} = ${mat(0, 0, 0, 0)}`]],
              [
                ["Stop the series", "截断级数"],
                t("Every higher power is zero as well, so only $I + At$ is left.", "更高次幂也都为零，只剩下 $I + At$。"),
                [`e^{At} = I + At = ${mat(1, `${k}t`, 0, 1)}`],
              ],
              [[`Set $t = ${T}$`, `令 $t = ${T}$`], t("", ""), [`e^{${T}A} = ${mat(1, `${k} \\cdot ${T}`, 0, 1)} = ${mat(1, ans, 0, 1)}`]],
            ],
            t(
              `The derivative of $${mat(1, `${k}t`, 0, 1)}$ is $${A}$, and $Ae^{At} = ${A}${mat(1, `${k}t`, 0, 1)} = ${A}$ too, so $\\frac{d}{dt}e^{At} = Ae^{At}$ holds.`,
              `$${mat(1, `${k}t`, 0, 1)}$ 的导数为 $${A}$，而 $Ae^{At} = ${A}${mat(1, `${k}t`, 0, 1)} = ${A}$，所以 $\\frac{d}{dt}e^{At} = Ae^{At}$ 成立。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-matrix-exponential-of-a-rotation-generator",
      figure: differentialEquationsDrawings1["matrix-exponentials#the-matrix-exponential-of-a-rotation-generator"],
      title: t("The matrix exponential of a rotation generator", "旋转生成矩阵的矩阵指数"),
      explanation: t(
        "For $A = \\begin{pmatrix} 0 & -\\omega \\\\ \\omega & 0 \\end{pmatrix}$ we have $A^2 = -\\omega^2 I$, so the even powers in $\\sum A^nt^n/n!$ build a cosine and the odd powers a sine:\n\n$$e^{At} = \\begin{pmatrix} \\cos \\omega t & -\\sin \\omega t \\\\ \\sin \\omega t & \\cos \\omega t \\end{pmatrix}.$$\n\nThis matrix rotates a vector counterclockwise by the angle $\\omega t$. Entry by entry, the sine sits below the diagonal with a plus sign and above it with a minus sign.\n\n> **Watch out.** The angle is $\\omega t$, not $t$, and $\\omega$ stays inside the sine. For $\\omega = 2$ at $t = \\frac{\\pi}{12}$ the angle is $\\frac{\\pi}{6}$, so $(e^{At})_{21} = \\sin \\frac{\\pi}{6} = \\frac{1}{2}$, not $2 \\cdot \\frac{1}{2} = 1$.",
        "对 $A = \\begin{pmatrix} 0 & -\\omega \\\\ \\omega & 0 \\end{pmatrix}$ 有 $A^2 = -\\omega^2 I$，所以级数 $\\sum A^nt^n/n!$ 中的偶次幂组成余弦，奇次幂组成正弦：\n\n$$e^{At} = \\begin{pmatrix} \\cos \\omega t & -\\sin \\omega t \\\\ \\sin \\omega t & \\cos \\omega t \\end{pmatrix}.$$\n\n这个矩阵把向量逆时针旋转角度 $\\omega t$。逐个元素看，正弦在对角线下方带正号，在上方带负号。\n\n> **注意。** 角度是 $\\omega t$，不是 $t$，并且 $\\omega$ 留在正弦里面。对 $\\omega = 2$，在 $t = \\frac{\\pi}{12}$ 处角度为 $\\frac{\\pi}{6}$，所以 $(e^{At})_{21} = \\sin \\frac{\\pi}{6} = \\frac{1}{2}$，不是 $2 \\cdot \\frac{1}{2} = 1$。",
      ),
      generate(rng: Rng): Problem {
        const w = rng.int(2, 4);
        const k = rng.pick([1, 3, 5, 7, 9, 11]);
        const sin = Q.of([1, 1, 1, -1, -1, -1][(k - 1) / 2] ?? 1, k === 3 || k === 9 ? 1 : 2);
        const lower = rng.int(0, 1) === 0;
        const ans = lower ? sin : sin.neg();
        const tt = Q.of(k, 6 * w);
        const tLatex = piLatex(tt);
        const angle = piLatex(Q.of(k, 6));
        const entry = lower ? "21" : "12";
        const sign = lower ? "" : "-";
        const above = sin.sign() > 0;
        return numberProblem({
          prompt: t(
            `For $A = ${mat(0, -w, w, 0)}$, find the entry $(e^{At})_{${entry}}$ at $t = ${tLatex}$.`,
            `对 $A = ${mat(0, -w, w, 0)}$，求 $t = ${tLatex}$ 时的元素 $(e^{At})_{${entry}}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              ans.neg(),
              lower
                ? "That uses the minus sign of the entry above the diagonal; below the diagonal the sine has a plus sign."
                : "That uses the plus sign of the entry below the diagonal; above the diagonal the sine has a minus sign.",
              lower ? "这用了对角线上方元素的负号；对角线下方的正弦带正号。" : "这用了对角线下方元素的正号；对角线上方的正弦带负号。",
            ),
            why(
              Q.of(w).mul(ans),
              "That multiplies the sine by $\\omega$; $\\omega$ belongs inside the sine, as part of the angle $\\omega t$.",
              "这把正弦乘以了 $\\omega$；$\\omega$ 应在正弦里面，作为角度 $\\omega t$ 的一部分。",
            ),
            ...(k === 3 || k === 9
              ? [
                  why(
                    Q.zero,
                    "That is $\\cos \\omega t$, the diagonal entry, not the off-diagonal sine.",
                    "这是 $\\cos \\omega t$，即对角元素，而不是非对角的正弦。",
                  ),
                ]
              : []),
          ]),
          solution: walked(
            [
              [["Write the entry", "写出该元素"], t("", ""), [`(e^{At})_{${entry}} = ${sign}\\sin ${w}t`]],
              [["Find the angle", "求出角度"], t("", ""), [`${w}t = ${w} \\cdot ${tLatex} = ${angle}`]],
              [["Evaluate the sine", "计算正弦"], t("", ""), [`${sign}\\sin ${angle} = ${ans.toLatex()}`]],
            ],
            t(
              `On the unit circle the angle $${angle}$ ends ${above ? "above" : "below"} the horizontal axis, so $\\sin ${angle} = ${sin.toLatex()}$ is ${above ? "positive" : "negative"}, and the entry ${lower ? "keeps" : "flips"} that sign.`,
              `在单位圆上角 $${angle}$ 的终边在横轴${above ? "上方" : "下方"}，所以 $\\sin ${angle} = ${sin.toLatex()}$ 为${above ? "正" : "负"}，该元素${lower ? "保持" : "改变"}这个符号。`,
            ),
          ),
        });
      },
    },
  ],
};

/** fundamentalMatrices constructs Φ(t) satisfying Φ' = A Φ. */
export const fundamentalMatrices: TopicDef = {
  id: "fundamental-matrices",
  title: t("Fundamental Matrices", "基本解矩阵"),
  summary: t(
    "A fundamental matrix $\\Phi(t)$ has linearly independent solutions as columns, satisfies $\\Phi' = A\\Phi$, and gives $e^{At} = \\Phi(t)\\Phi(0)^{-1}$.",
    "基本解矩阵 $\\Phi(t)$ 的各列是线性无关的解，满足 $\\Phi' = A\\Phi$，且 $e^{At} = \\Phi(t)\\Phi(0)^{-1}$。",
  ),
  intro: t(
    "Take $x_1' = 2x_1$, $x_2' = -x_2$. The solutions $(e^{2t}, 0)$ and $(0, e^{-t})$ are independent, so they form the columns of the fundamental matrix $\\Phi(t) = \\begin{pmatrix} e^{2t} & 0 \\\\ 0 & e^{-t} \\end{pmatrix}$, with $\\det \\Phi(t) = e^{2t}e^{-t} = e^{t}$. Since $\\Phi(0) = I$, this $\\Phi$ is $e^{At}$ itself.\n\nCheck: $\\Phi' = \\begin{pmatrix} 2e^{2t} & 0 \\\\ 0 & -e^{-t} \\end{pmatrix} = \\begin{pmatrix} 2 & 0 \\\\ 0 & -1 \\end{pmatrix}\\Phi$, and $\\det \\Phi(t) = e^{t}$ is never zero.\n\nIn this lesson we build fundamental matrices from solutions and use them to recover the coefficient matrix.",
    "取 $x_1' = 2x_1$，$x_2' = -x_2$。解 $(e^{2t}, 0)$ 与 $(0, e^{-t})$ 线性无关，所以它们组成基本矩阵 $\\Phi(t) = \\begin{pmatrix} e^{2t} & 0 \\\\ 0 & e^{-t} \\end{pmatrix}$ 的两列，且 $\\det \\Phi(t) = e^{2t}e^{-t} = e^{t}$。因为 $\\Phi(0) = I$，这个 $\\Phi$ 就是 $e^{At}$ 本身。\n\n检验：$\\Phi' = \\begin{pmatrix} 2e^{2t} & 0 \\\\ 0 & -e^{-t} \\end{pmatrix} = \\begin{pmatrix} 2 & 0 \\\\ 0 & -1 \\end{pmatrix}\\Phi$，且 $\\det \\Phi(t) = e^{t}$ 永不为零。\n\n本课我们由解构造基本矩阵，并用它还原系数矩阵。",
  ),
  prerequisites: ["matrix-exponentials"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "the-fundamental-matrix-solution",
      title: t("Initial determinant of a fundamental matrix", "基本解矩阵的初值行列式"),
      explanation: t(
        "A fundamental matrix has independent solutions as its columns, and its determinant at any time is the Wronskian of those solutions. For $\\Phi(t) = \\begin{pmatrix} e^{a t} & 0 \\\\ 0 & e^{b t} \\end{pmatrix}$, evaluating at $t = 0$ gives $\\Phi(0) = I$, with determinant $\\det(\\Phi(0)) = 1$. For scaled columns, $\\det(\\Phi(0)) = u v$.\n\n> **Watch out.** The determinant multiplies the diagonal entries; it does not add them. For initial columns $(3, 0)$ and $(0, 4)$, $\\det(\\Phi(0)) = 3 \\cdot 4 = 12$, not $3 + 4 = 7$.",
        "基本矩阵以线性无关的解为列，它在任意时刻的行列式就是这些解的朗斯基行列式。对 $\\Phi(t) = \\begin{pmatrix} e^{a t} & 0 \\\\ 0 & e^{b t} \\end{pmatrix}$，在 $t = 0$ 处 $\\Phi(0) = I$，行列式 $\\det(\\Phi(0)) = 1$。若两列分别放大为 $u$ 倍与 $v$ 倍，则 $\\det(\\Phi(0)) = u v$。\n\n> **注意。** 行列式是把对角元素相乘，而不是相加。初始列为 $(3, 0)$ 与 $(0, 4)$ 时，$\\det(\\Phi(0)) = 3 \\cdot 4 = 12$，不是 $3 + 4 = 7$。",
      ),
      generate(rng: Rng): Problem {
        const u = rng.int(2, 10);
        const v = rng.int(2, 15);
        const ans = u * v;
        return numberProblem({
          prompt: t(
            `A fundamental matrix for a $2 \\times 2$ system has initial columns $\\mathbf{x}_1(0) = ${vec(u, 0)}$ and $\\mathbf{x}_2(0) = ${vec(0, v)}$. Evaluate the determinant $\\det(\\Phi(0))$.`,
            `某二阶系统的基本解矩阵在初值处的两列向量分别为 $\\mathbf{x}_1(0) = ${vec(u, 0)}$ 与 $\\mathbf{x}_2(0) = ${vec(0, v)}$。计算行列式 $\\det(\\Phi(0))$ 的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(u + v, "That adds the diagonal entries; the determinant multiplies them.", "这把对角元素相加了；行列式要把它们相乘。"),
            why(u, "That uses only the first column; the determinant involves both columns.", "这只用了第一列；行列式要用到两列。"),
            why(v, "That uses only the second column; the determinant involves both columns.", "这只用了第二列；行列式要用到两列。"),
          ]),
          solution: walked(
            [
              [
                ["Assemble $\\Phi(0)$", "写出 $\\Phi(0)$"],
                t("The initial vectors are the columns.", "初始向量就是各列。"),
                [`\\Phi(0) = ${mat(u, 0, 0, v)}`],
              ],
              [["Take the determinant", "计算行列式"], t("", ""), [`\\det(\\Phi(0)) = ${u} \\cdot ${v} - 0 \\cdot 0 = ${ans}`]],
            ],
            t(
              `Dividing back, $${ans} \\div ${u} = ${v}$, and since $${ans} \\ne 0$ the two columns are independent, as a fundamental matrix requires.`,
              `反过来 $${ans} \\div ${u} = ${v}$；又因 $${ans} \\ne 0$，两列线性无关，符合基本矩阵的要求。`,
            ),
          ),
        });
      },
    },
    {
      id: "recovering-the-coefficient-matrix-from-a-fundamental-matrix",
      title: t("Recovering the coefficient matrix from a fundamental matrix", "由基本矩阵还原系数矩阵"),
      explanation: t(
        "A fundamental matrix satisfies $\\Phi'(t) = A\\Phi(t)$ and is invertible, so the coefficient matrix can be read off at any time, most simply at $t = 0$:\n\n$$A = \\Phi'(0)\\,\\Phi(0)^{-1}.$$\n\nDifferentiate each column, set $t = 0$, and multiply by the inverse of $\\Phi(0)$. For a $2 \\times 2$ matrix $\\begin{pmatrix} p & q \\\\ r & s \\end{pmatrix}$ the inverse is $\\frac{1}{ps - qr}\\begin{pmatrix} s & -q \\\\ -r & p \\end{pmatrix}$.\n\n> **Watch out.** $\\Phi'(0)$ alone is $A$ only when $\\Phi(0) = I$, and the inverse goes on the right. For the columns $(e^{t}, e^{t})$ and $(e^{2t}, 2e^{2t})$, $\\Phi'(0) = \\begin{pmatrix} 1 & 2 \\\\ 1 & 4 \\end{pmatrix}$, but $A = \\Phi'(0)\\Phi(0)^{-1} = \\begin{pmatrix} 0 & 1 \\\\ -2 & 3 \\end{pmatrix}$.",
        "基本矩阵满足 $\\Phi'(t) = A\\Phi(t)$ 且可逆，所以可以在任意时刻读出系数矩阵，最简单的是 $t = 0$：\n\n$$A = \\Phi'(0)\\,\\Phi(0)^{-1}.$$\n\n对每一列求导，令 $t = 0$，再乘以 $\\Phi(0)$ 的逆。对 $2 \\times 2$ 矩阵 $\\begin{pmatrix} p & q \\\\ r & s \\end{pmatrix}$，其逆为 $\\frac{1}{ps - qr}\\begin{pmatrix} s & -q \\\\ -r & p \\end{pmatrix}$。\n\n> **注意。** 只有当 $\\Phi(0) = I$ 时 $\\Phi'(0)$ 本身才是 $A$，并且逆矩阵要乘在右边。对列 $(e^{t}, e^{t})$ 与 $(e^{2t}, 2e^{2t})$，$\\Phi'(0) = \\begin{pmatrix} 1 & 2 \\\\ 1 & 4 \\end{pmatrix}$，但 $A = \\Phi'(0)\\Phi(0)^{-1} = \\begin{pmatrix} 0 & 1 \\\\ -2 & 3 \\end{pmatrix}$。",
      ),
      generate(rng: Rng): Problem {
        const l1 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const l2 = rng.pick([-4, -2, 2, 4, 5].filter((x) => x !== l1));
        const m1 = rng.int(-3, 3);
        const m2 = m1 + rng.pick([-1, 1]);
        const A = fromEigen(l1, l2, m1, m2);
        const i = rng.int(0, 3);
        const ans = A[i] ?? 0;
        const entry = ["11", "12", "21", "22"][i] ?? "11";
        const s = m2 - m1;
        const inv: [number, number, number, number] = [m2 * s, -s, -m1 * s, s];
        const P: [number, number, number, number] = [l1, l2, m1 * l1, m2 * l2];
        const mul = (X: readonly number[], Y: readonly number[]): number[] => {
          const [x0 = 0, x1 = 0, x2 = 0, x3 = 0] = X;
          const [y0 = 0, y1 = 0, y2 = 0, y3 = 0] = Y;
          return [x0 * y0 + x1 * y2, x0 * y1 + x1 * y3, x2 * y0 + x3 * y2, x2 * y1 + x3 * y3];
        };
        const swapped = mul(inv, P);
        const col = (l: number, m: number) =>
          `$\\begin{pmatrix} e^{${ex(l)}} \\\\ ${m === 0 ? "0" : `${cf(m)}e^{${ex(l)}}`} \\end{pmatrix}$`;
        const image = [A[0] + A[1] * m1, A[2] + A[3] * m1];
        return numberProblem({
          prompt: t(
            `The columns ${col(l1, m1)} and ${col(l2, m2)} form a fundamental matrix of $\\mathbf{x}' = A\\mathbf{x}$. Find $A_{${entry}}$.`,
            `列向量 ${col(l1, m1)} 与 ${col(l2, m2)} 组成 $\\mathbf{x}' = A\\mathbf{x}$ 的基本矩阵。求 $A_{${entry}}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              P[i] ?? 0,
              "That is an entry of $\\Phi'(0)$; it still has to be multiplied by $\\Phi(0)^{-1}$.",
              "这是 $\\Phi'(0)$ 的元素；还要乘以 $\\Phi(0)^{-1}$。",
            ),
            why(
              swapped[i] ?? 0,
              "That multiplies in the wrong order; the inverse goes on the right: $A = \\Phi'(0)\\Phi(0)^{-1}$.",
              "乘法顺序反了；逆矩阵应乘在右边：$A = \\Phi'(0)\\Phi(0)^{-1}$。",
            ),
            ...(s === -1
              ? [
                  why(
                    -ans,
                    "That leaves out the factor $\\frac{1}{\\det \\Phi(0)} = -1$ of the inverse.",
                    "这漏掉了逆矩阵中的因子 $\\frac{1}{\\det \\Phi(0)} = -1$。",
                  ),
                ]
              : []),
            why(
              A[3 - i] ?? 0,
              `That is the entry in the opposite corner; $A_{${entry}}$ sits in row ${entry[0]}, column ${entry[1]}.`,
              `这是对角位置上的另一个元素；$A_{${entry}}$ 位于第 ${entry[0]} 行第 ${entry[1]} 列。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Evaluate at $t = 0$", "在 $t = 0$ 处取值"],
                t("Differentiate each column before setting $t = 0$.", "先对每一列求导，再令 $t = 0$。"),
                [`\\Phi(0) = ${mat(1, 1, m1, m2)}, \\qquad \\Phi'(0) = ${mat(...P)}`],
              ],
              [
                ["Invert $\\Phi(0)$", "求 $\\Phi(0)$ 的逆"],
                t("", ""),
                [`\\det \\Phi(0) = ${m2} - ${par(m1)} = ${s}`, `\\Phi(0)^{-1} = ${mat(...inv)}`],
              ],
              [["Multiply", "相乘"], t("", ""), [`A = \\Phi'(0)\\Phi(0)^{-1} = ${mat(...A)}`, `A_{${entry}} = ${ans}`]],
            ],
            t(
              `$A${vec(1, m1)} = ${vec(image[0] ?? 0, image[1] ?? 0)} = ${cf(l1)}${vec(1, m1)}$, which is what the column $e^{${ex(l1)}}${vec(1, m1)}$ needs to solve $\\mathbf{x}' = A\\mathbf{x}$.`,
              `$A${vec(1, m1)} = ${vec(image[0] ?? 0, image[1] ?? 0)} = ${cf(l1)}${vec(1, m1)}$，这正是列 $e^{${ex(l1)}}${vec(1, m1)}$ 满足 $\\mathbf{x}' = A\\mathbf{x}$ 所需要的。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingHomogeneousSystemsOfOdesUsingMatrixMethods evaluates x(t) = e^{At} x0. */
export const solvingHomogeneousSystemsOfOdesUsingMatrixMethods: TopicDef = {
  id: "solving-homogeneous-systems-of-odes-using-matrix-methods",
  title: t("Solving Homogeneous Systems of ODEs Using Matrix Methods", "应用矩阵方法求解齐次微分方程组"),
  summary: t(
    "With the matrix exponential, the solution of $\\mathbf{x}' = A\\mathbf{x}$, $\\mathbf{x}(0) = \\mathbf{x}_0$ is $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0$.",
    "利用矩阵指数，初值问题 $\\mathbf{x}' = A\\mathbf{x}$，$\\mathbf{x}(0) = \\mathbf{x}_0$ 的解为 $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0$。",
  ),
  intro: t(
    "Take $A = \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix}$ and $\\mathbf{x}(0) = (1, 3)$. Since $A^2 = 0$, $e^{At} = I + At$, so $\\mathbf{x}(t) = e^{At}\\mathbf{x}(0) = (1 + 6t, 3)$; at $t = 2$ this is $(13, 3)$.\n\nCheck: $\\mathbf{x}(0) = (1, 3)$, and $\\mathbf{x}' = (6, 0) = A\\mathbf{x}$ because $2 \\cdot 3 = 6$.\n\nIn this lesson we solve initial value problems by multiplying the initial vector by $e^{At}$.",
    "取 $A = \\begin{pmatrix} 0 & 2 \\\\ 0 & 0 \\end{pmatrix}$，$\\mathbf{x}(0) = (1, 3)$。因为 $A^2 = 0$，$e^{At} = I + At$，所以 $\\mathbf{x}(t) = e^{At}\\mathbf{x}(0) = (1 + 6t, 3)$；在 $t = 2$ 处为 $(13, 3)$。\n\n检验：$\\mathbf{x}(0) = (1, 3)$，并且 $\\mathbf{x}' = (6, 0) = A\\mathbf{x}$，因为 $2 \\cdot 3 = 6$。\n\n本课我们用 $e^{At}$ 乘以初始向量来解初值问题。",
  ),
  prerequisites: ["fundamental-matrices"],
  encompasses: [{ topic: "fundamental-matrices", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "solution-via-matrix-exponential",
      title: t("Initial state evaluation via matrix exponential", "矩阵指数解在初始状态下的验证"),
      explanation: t(
        "Multiplying the matrix exponential by the initial vector solves the system, and at time zero the exponential is the identity, so the initial condition holds. Since $e^{A \\cdot 0} = I$, the solution $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0$ satisfies $\\mathbf{x}(0) = I \\mathbf{x}_0 = \\mathbf{x}_0$. Differentiating gives $\\mathbf{x}'(t) = Ae^{At}\\mathbf{x}_0$, so $\\mathbf{x}'(0) = A\\mathbf{x}_0$.\n\n> **Watch out.** The first coordinate of $A\\mathbf{x}_0$ uses the first row of $A$. For $A = \\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$ and $\\mathbf{x}_0 = (5, -1)$, $x_1'(0) = 2 \\cdot 5 + 1 \\cdot (-1) = 9$, not $2 \\cdot 5 + 3 \\cdot (-1) = 7$ from the first column.",
        "用矩阵指数乘以初始向量就解出了方程组，在零时刻指数是单位矩阵，所以初始条件成立。因为 $e^{A \\cdot 0} = I$，解向量 $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0$ 在 $t = 0$ 处满足 $\\mathbf{x}(0) = I \\mathbf{x}_0 = \\mathbf{x}_0$。 求导得 $\\mathbf{x}'(t) = Ae^{At}\\mathbf{x}_0$，所以 $\\mathbf{x}'(0) = A\\mathbf{x}_0$。\n\n> **注意。** $A\\mathbf{x}_0$ 的第一个坐标用的是 $A$ 的第一行。对 $A = \\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$ 与 $\\mathbf{x}_0 = (5, -1)$，$x_1'(0) = 2 \\cdot 5 + 1 \\cdot (-1) = 9$，不是用第一列算出的 $2 \\cdot 5 + 3 \\cdot (-1) = 7$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 5);
        const b = rng.nonZero(-4, 5);
        const c = rng.nonZero(-4, 5);
        const d = rng.nonZero(-4, 5);
        const x0 = rng.nonZero(-5, 6);
        const y0 = rng.nonZero(-5, 6);
        const ans = a * x0 + b * y0;
        const second = c * x0 + d * y0;
        const A = mat(a, b, c, d);
        const v = vec(x0, y0);
        return numberProblem({
          prompt: t(
            `Let $\\mathbf{x}(t) = e^{At}${v}$ with $A = ${A}$. Find $x_1'(0)$, the rate of change of the first coordinate at $t = 0$.`,
            `设 $\\mathbf{x}(t) = e^{At}${v}$，其中 $A = ${A}$。求第一个坐标在 $t = 0$ 时的变化率 $x_1'(0)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              a * x0 + c * y0,
              "That uses the first column of $A$; the first coordinate comes from the first row.",
              "这用了 $A$ 的第一列；第一个坐标来自第一行。",
            ),
            why(second, "That is the second coordinate, $x_2'(0)$.", "这是第二个坐标 $x_2'(0)$。"),
            why(x0, "That is $x_1(0)$, the starting position, not its rate of change.", "这是 $x_1(0)$，即起始位置，不是它的变化率。"),
            why(
              a * y0 + b * x0,
              "That pairs the entries of the row with the wrong coordinates of $\\mathbf{x}_0$.",
              "这把行中的元素与 $\\mathbf{x}_0$ 的坐标配错了。",
            ),
          ]),
          solution: walked(
            [
              [["Differentiate", "求导"], t("", ""), [`\\mathbf{x}'(t) = Ae^{At}${v}`]],
              [
                ["Set $t = 0$", "令 $t = 0$"],
                t("Since $e^{A \\cdot 0} = I$, the exponential drops out.", "因为 $e^{A \\cdot 0} = I$，指数项消失。"),
                [`\\mathbf{x}'(0) = A${v}`],
              ],
              [
                ["Take the first row", "取第一行"],
                t("", ""),
                [`x_1'(0) = ${par(a)} \\cdot ${par(x0)} + ${par(b)} \\cdot ${par(y0)} = ${ans}`],
              ],
            ],
            t(
              `By columns, $${par(x0)} \\cdot ${vec(a, c)} + ${par(y0)} \\cdot ${vec(b, d)} = ${vec(ans, second)}$, whose first entry is again $${ans}$.`,
              `按列计算，$${par(x0)} \\cdot ${vec(a, c)} + ${par(y0)} \\cdot ${vec(b, d)} = ${vec(ans, second)}$，第一个元素同样是 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-a-nilpotent-three-dimensional-system",
      title: t("Solving a nilpotent three-dimensional system", "求解三维幂零方程组"),
      explanation: t(
        "If some power of $A$ is zero, the series for $e^{At}$ stops. For a strictly upper triangular $3 \\times 3$ matrix $A^3 = 0$, so\n\n$$e^{At} = I + tA + \\frac{t^2}{2}A^2, \\qquad \\mathbf{x}(t) = e^{At}\\mathbf{x}(0).$$\n\nOnly the corner entry of $A^2$ is nonzero: for $A = \\begin{pmatrix} 0 & p & q \\\\ 0 & 0 & r \\\\ 0 & 0 & 0 \\end{pmatrix}$ it is $(A^2)_{13} = pr$. Keep the factor $\\tfrac{1}{2}$ from $2!$.\n\n> **Watch out.** The $t^2$ term carries $\\frac{1}{2}$ from $2!$. At $t = 2$ its factor is $\\frac{2^2}{2} = 2$, not $4$; with $pr = 3$ and $x_3(0) = 1$ it adds $6$ to $x_1(2)$, not $12$.",
        "如果 $A$ 的某个幂为零，$e^{At}$ 的级数就会截断。对严格上三角的 $3 \\times 3$ 矩阵有 $A^3 = 0$，所以\n\n$$e^{At} = I + tA + \\frac{t^2}{2}A^2, \\qquad \\mathbf{x}(t) = e^{At}\\mathbf{x}(0).$$\n\n$A^2$ 只有角上的元素非零：对 $A = \\begin{pmatrix} 0 & p & q \\\\ 0 & 0 & r \\\\ 0 & 0 & 0 \\end{pmatrix}$，$(A^2)_{13} = pr$。别忘了来自 $2!$ 的因子 $\\tfrac{1}{2}$。\n\n> **注意。** $t^2$ 项带有来自 $2!$ 的 $\\frac{1}{2}$。在 $t = 2$ 处它的因子是 $\\frac{2^2}{2} = 2$，不是 $4$；若 $pr = 3$、$x_3(0) = 1$，它给 $x_1(2)$ 加上 $6$，而不是 $12$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(-3, 3) || 1;
        const q = rng.int(-3, 3);
        const r = rng.int(-3, 3) || 2;
        const u = rng.int(-4, 4);
        const v = rng.int(-4, 4);
        const w = rng.int(-3, 3) || 1;
        const lin = p * v + q * w;
        const prw = p * r * w;
        const ans = u + 2 * lin + 2 * prw;
        return numberProblem({
          prompt: t(
            `Solve $\\mathbf{x}' = \\begin{pmatrix} 0 & ${p} & ${q} \\\\ 0 & 0 & ${r} \\\\ 0 & 0 & 0 \\end{pmatrix}\\mathbf{x}$ with $\\mathbf{x}(0) = (${u}, ${v}, ${w})$. Find $x_1(2)$.`,
            `解 $\\mathbf{x}' = \\begin{pmatrix} 0 & ${p} & ${q} \\\\ 0 & 0 & ${r} \\\\ 0 & 0 & 0 \\end{pmatrix}\\mathbf{x}$，$\\mathbf{x}(0) = (${u}, ${v}, ${w})$。求 $x_1(2)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              u + 2 * lin,
              "That drops the $\\frac{t^2}{2}A^2$ term; here $A^2 \\ne 0$.",
              "这漏掉了 $\\frac{t^2}{2}A^2$ 项；这里 $A^2 \\ne 0$。",
            ),
            why(u + 2 * lin + 4 * prw, "That forgets to divide $t^2$ by $2!$.", "这忘了把 $t^2$ 除以 $2!$。"),
            why(u + lin + prw, "That evaluates the series at $t = 1$ instead of $t = 2$.", "这是在 $t = 1$ 而不是 $t = 2$ 处求级数的值。"),
            why(u, "That is $x_1(0)$; the solution moves away from its starting value.", "这是 $x_1(0)$；解会离开它的初始值。"),
          ]),
          solution: walked(
            [
              [
                ["Compute $A\\mathbf{x}(0)$", "计算 $A\\mathbf{x}(0)$"],
                t("", ""),
                [`(A\\mathbf{x}(0))_1 = ${par(p)} \\cdot ${par(v)} + ${par(q)} \\cdot ${par(w)} = ${lin}`],
              ],
              [
                ["Compute $A^2\\mathbf{x}(0)$", "计算 $A^2\\mathbf{x}(0)$"],
                t("Only the corner entry $(A^2)_{13} = pr$ is nonzero.", "只有角上的元素 $(A^2)_{13} = pr$ 非零。"),
                [`(A^2\\mathbf{x}(0))_1 = ${par(p)} \\cdot ${par(r)} \\cdot ${par(w)} = ${prw}`],
              ],
              [
                ["Sum the series at $t = 2$", "在 $t = 2$ 处求和"],
                t("", ""),
                [`x_1(2) = ${u} + 2 \\cdot ${par(lin)} + \\frac{2^2}{2} \\cdot ${par(prw)} = ${ans}`],
              ],
            ],
            t(
              `Directly, $x_3 = ${w}$ and $x_2 = ${poly([v, ""], [r * w, "t"])}$, so $x_1' = ${poly([lin, ""], [prw, "t"])}$ and $x_1 = ${poly([u, ""], [lin, "t"], [Q.of(prw, 2), "t^2"])}$, which is $${ans}$ at $t = 2$.`,
              `直接求解：$x_3 = ${w}$，$x_2 = ${poly([v, ""], [r * w, "t"])}$，所以 $x_1' = ${poly([lin, ""], [prw, "t"])}$，$x_1 = ${poly([u, ""], [lin, "t"], [Q.of(prw, 2), "t^2"])}$，在 $t = 2$ 处为 $${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingInhomogeneousSystemsOfOdesUsingMatrixMethods evaluates convolution integral. */
export const solvingInhomogeneousSystemsOfOdesUsingMatrixMethods: TopicDef = {
  id: "solving-inhomogeneous-systems-of-odes-using-matrix-methods",
  title: t("Solving Inhomogeneous Systems of ODEs Using Matrix Methods", "应用矩阵方法求解非齐次微分方程组"),
  summary: t(
    "The formula $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0 + \\int_0^t e^{A(t - s)}\\mathbf{g}(s)\\,ds$ solves inhomogeneous linear systems.",
    "公式 $\\mathbf{x}(t) = e^{At}\\mathbf{x}_0 + \\int_0^t e^{A(t - s)}\\mathbf{g}(s)\\,ds$ 给出非齐次线性方程组的解。",
  ),
  intro: t(
    "Take $x_1' = x_2 + 1$, $x_2' = 2$ with $\\mathbf{x}(0) = \\mathbf{0}$. Here $A = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$, $e^{At} = I + tA$ and $\\mathbf{g} = (1, 2)$, so $\\mathbf{x}(t) = \\int_0^t e^{A(t - s)}\\mathbf{g}\\,ds = \\left(tI + \\frac{t^2}{2}A\\right)\\mathbf{g} = (t + t^2, 2t)$.\n\nCheck: $x_2 = 2t$ has $x_2' = 2$, and $x_1 = t + t^2$ has $x_1' = 1 + 2t = x_2 + 1$; both start at $0$.\n\nIn this lesson we add the effect of the forcing to the matrix exponential solution through the convolution integral.",
    "取 $x_1' = x_2 + 1$，$x_2' = 2$，$\\mathbf{x}(0) = \\mathbf{0}$。这里 $A = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$，$e^{At} = I + tA$，$\\mathbf{g} = (1, 2)$，所以 $\\mathbf{x}(t) = \\int_0^t e^{A(t - s)}\\mathbf{g}\\,ds = \\left(tI + \\frac{t^2}{2}A\\right)\\mathbf{g} = (t + t^2, 2t)$。\n\n检验：$x_2 = 2t$ 满足 $x_2' = 2$；$x_1 = t + t^2$ 满足 $x_1' = 1 + 2t = x_2 + 1$；两者都从 $0$ 出发。\n\n本课我们通过卷积积分把强迫项的作用加到矩阵指数解上。",
  ),
  prerequisites: ["solving-homogeneous-systems-of-odes-using-matrix-methods"],
  encompasses: [
    {
      topic: "solving-homogeneous-systems-of-odes-using-matrix-methods",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "matrix-variation-of-parameters-formula",
      title: t("Initial rate of change of the convolution integral", "卷积特解在初始时刻的变化率"),
      explanation: t(
        "The particular solution adds up the effect of the forcing at each earlier time, carried forward by the matrix exponential to the present. For $\\mathbf{x}_p(t) = \\int_0^t e^{A(t-s)}\\mathbf{g}(s)\\,ds$, differentiating by Leibniz's rule yields $\\mathbf{x}_p'(0) = \\mathbf{g}(0)$.\n\n> **Watch out.** At $t = 0$ the integral itself is $\\mathbf{0}$, but its derivative is $\\mathbf{g}(0)$, not $\\mathbf{0}$. For $\\mathbf{g}(t) = (7, 4t)$, $\\mathbf{x}_p'(0) = (7, 0)$.",
        "特解把之前每个时刻强迫项的作用加起来，并由矩阵指数传递到当前时刻。对于卷积特解 $\\mathbf{x}_p(t) = \\int_0^t e^{A(t-s)}\\mathbf{g}(s)\\,ds$，根据含参变限积分莱布尼茨求导法则，在 $t = 0$ 处满足 $\\mathbf{x}_p'(0) = \\mathbf{g}(0)$。\n\n> **注意。** 在 $t = 0$ 处积分本身为 $\\mathbf{0}$，但它的导数是 $\\mathbf{g}(0)$，不是 $\\mathbf{0}$。对 $\\mathbf{g}(t) = (7, 4t)$，$\\mathbf{x}_p'(0) = (7, 0)$。",
      ),
      generate(rng: Rng): Problem {
        const g1 = rng.int(2, 35);
        const ans = g1;
        return numberProblem({
          prompt: t(
            `Let $\\mathbf{x}_p(t) = \\int_0^t e^{A(t-s)} \\mathbf{g}(s)\\,ds$ be the particular solution to an inhomogeneous system with forcing $\\mathbf{g}(t) = ${vec(g1, "4t")}$. Find the initial derivative $x_{p,1}'(0)$ of the first component.`,
            `设 $\\mathbf{x}_p(t) = \\int_0^t e^{A(t-s)} \\mathbf{g}(s)\\,ds$ 是外力激励为 $\\mathbf{g}(t) = ${vec(g1, "4t")}$ 的非齐次系统的特解。求第一分量的初始导数值 $x_{p,1}'(0)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              0,
              "That is $x_{p,1}(0)$, the value of the integral at $t = 0$; its derivative is not zero.",
              "这是 $x_{p,1}(0)$，即积分在 $t = 0$ 处的值；它的导数不为零。",
            ),
            why(
              4,
              "That is the coefficient of $t$ in the second component of $\\mathbf{g}$.",
              "这是 $\\mathbf{g}$ 第二分量中 $t$ 的系数。",
            ),
            why(
              2 * g1,
              "That counts the forcing twice; the rule gives $\\mathbf{g}(t)$ once, and $A\\mathbf{x}_p(0) = \\mathbf{0}$ adds nothing.",
              "这把强迫项算了两次；法则只给出一次 $\\mathbf{g}(t)$，而 $A\\mathbf{x}_p(0) = \\mathbf{0}$ 不贡献任何量。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate the integral", "对积分求导"],
                t(
                  "By Leibniz's rule, the upper limit contributes $\\mathbf{g}(t)$ and the integrand contributes $A\\mathbf{x}_p$.",
                  "由莱布尼茨法则，上限贡献 $\\mathbf{g}(t)$，被积函数贡献 $A\\mathbf{x}_p$。",
                ),
                [`\\mathbf{x}_p'(t) = A\\mathbf{x}_p(t) + \\mathbf{g}(t)`],
              ],
              [
                ["Set $t = 0$", "令 $t = 0$"],
                t(
                  "The integral over $[0, 0]$ is zero, so $\\mathbf{x}_p(0) = \\mathbf{0}$.",
                  "在 $[0, 0]$ 上的积分为零，所以 $\\mathbf{x}_p(0) = \\mathbf{0}$。",
                ),
                [`\\mathbf{x}_p'(0) = \\mathbf{g}(0) = ${vec(g1, 0)}`, `x_{p,1}'(0) = ${ans}`],
              ],
            ],
            t(
              `For small $t$, $\\mathbf{x}_p(t) \\approx \\int_0^t \\mathbf{g}(s)\\,ds = (${g1}t, 2t^2)$, whose first component has slope $${g1}$ at $t = 0$.`,
              `$t$ 很小时，$\\mathbf{x}_p(t) \\approx \\int_0^t \\mathbf{g}(s)\\,ds = (${g1}t, 2t^2)$，其第一分量在 $t = 0$ 处的斜率为 $${g1}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-forced-response-of-a-shear-system",
      title: t("The forced response of a shear system", "剪切方程组的受迫响应"),
      explanation: t(
        "The solution of $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}$ is\n\n$$\\mathbf{x}(t) = e^{At}\\mathbf{x}(0) + \\int_0^t e^{A(t - s)}\\mathbf{g}(s)\\,ds.$$\n\nFor the shear matrix $A = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$, $e^{At} = I + tA$. With a constant $\\mathbf{g}$ the integral is $\\int_0^t (I + (t - s)A)\\,ds\\,\\mathbf{g} = (tI + \\tfrac{t^2}{2}A)\\mathbf{g}$. So the forcing in the second equation reaches $x_1$ through the factor $\\tfrac{t^2}{2}k$.\n\n> **Watch out.** At $t = 2$ the factor $\\frac{t^2}{2}k$ is $2k$, not $4k$. For $x_1' = 3x_2$, $x_2' = 1$ starting from rest, $x_1(2) = \\frac{2^2}{2} \\cdot 3 = 6$.",
        "$\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}$ 的解为\n\n$$\\mathbf{x}(t) = e^{At}\\mathbf{x}(0) + \\int_0^t e^{A(t - s)}\\mathbf{g}(s)\\,ds.$$\n\n对剪切矩阵 $A = \\begin{pmatrix} 0 & k \\\\ 0 & 0 \\end{pmatrix}$，$e^{At} = I + tA$。$\\mathbf{g}$ 为常向量时，积分为 $\\int_0^t (I + (t - s)A)\\,ds\\,\\mathbf{g} = (tI + \\tfrac{t^2}{2}A)\\mathbf{g}$。所以第二个方程中的强迫项通过因子 $\\tfrac{t^2}{2}k$ 影响 $x_1$。\n\n> **注意。** 在 $t = 2$ 处因子 $\\frac{t^2}{2}k$ 等于 $2k$，不是 $4k$。对 $x_1' = 3x_2$，$x_2' = 1$，从静止出发，$x_1(2) = \\frac{2^2}{2} \\cdot 3 = 6$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(-3, 3) || 2;
        const p = rng.int(-4, 4);
        const q = rng.int(-4, 4) || 1;
        const g1 = rng.int(-4, 4);
        const g2 = rng.int(-4, 4) || 3;
        const ans = p + 2 * k * q + 2 * g1 + 2 * k * g2;
        const half = Q.of(k * g2, 2);
        return numberProblem({
          prompt: t(
            `Solve $x_1' = ${poly([k, "x_2"], [g1, ""])}$, $x_2' = ${g2}$ with $x_1(0) = ${p}$, $x_2(0) = ${q}$, and find $x_1(2)$.`,
            `解 $x_1' = ${poly([k, "x_2"], [g1, ""])}$，$x_2' = ${g2}$，$x_1(0) = ${p}$，$x_2(0) = ${q}$，并求 $x_1(2)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              p + 2 * k * q + 2 * g1 + 4 * k * g2,
              "That forgets to divide $t^2$ by $2$ in the forced term.",
              "这在强迫项中忘了把 $t^2$ 除以 $2$。",
            ),
            why(
              p + 2 * k * q + 2 * g1,
              "That leaves out the forcing of the second equation, which reaches $x_1$ through $x_2$.",
              "这漏掉了第二个方程的强迫项，它通过 $x_2$ 影响 $x_1$。",
            ),
            why(
              p + 2 * g1 + 2 * k * g2,
              "That leaves out the starting value $x_2(0)$, which $e^{At}$ carries into $x_1$.",
              "这漏掉了初始值 $x_2(0)$，$e^{At}$ 会把它带入 $x_1$。",
            ),
            why(2 * k * q + 2 * g1 + 2 * k * g2, "That leaves out the starting value $x_1(0)$.", "这漏掉了初始值 $x_1(0)$。"),
          ]),
          solution: walked(
            [
              [
                ["Apply $e^{At}$ to $\\mathbf{x}(0)$", "用 $e^{At}$ 作用于 $\\mathbf{x}(0)$"],
                t(
                  `Here $A = ${mat(0, k, 0, 0)}$ and $A^2 = 0$, so $e^{At} = I + tA$.`,
                  `这里 $A = ${mat(0, k, 0, 0)}$，$A^2 = 0$，所以 $e^{At} = I + tA$。`,
                ),
                [`\\left(e^{At}\\mathbf{x}(0)\\right)_1 = ${poly([p, ""], [k * q, "t"])}`],
              ],
              [
                ["Integrate the forcing", "对强迫项积分"],
                t(
                  `With $\\mathbf{g} = (${g1}, ${g2})$ constant, the integral is $\\left(tI + \\frac{t^2}{2}A\\right)\\mathbf{g}$.`,
                  `$\\mathbf{g} = (${g1}, ${g2})$ 为常向量，积分为 $\\left(tI + \\frac{t^2}{2}A\\right)\\mathbf{g}$。`,
                ),
                [`\\left(\\left(tI + \\tfrac{t^2}{2}A\\right)\\mathbf{g}\\right)_1 = ${poly([g1, "t"], [half, "t^2"])}`],
              ],
              [
                ["Set $t = 2$", "令 $t = 2$"],
                t("", ""),
                [`x_1(2) = ${p} + ${par(k * q)} \\cdot 2 + ${par(g1)} \\cdot 2 + ${parQ(half)} \\cdot 4 = ${ans}`],
              ],
            ],
            t(
              `Directly, $x_2 = ${poly([q, ""], [g2, "t"])}$, so $x_1' = ${poly([k * q + g1, ""], [k * g2, "t"])}$ and $x_1 = ${poly([p, ""], [k * q + g1, "t"], [half, "t^2"])}$, which is $${ans}$ at $t = 2$.`,
              `直接求解：$x_2 = ${poly([q, ""], [g2, "t"])}$，所以 $x_1' = ${poly([k * q + g1, ""], [k * g2, "t"])}$，$x_1 = ${poly([p, ""], [k * q + g1, "t"], [half, "t^2"])}$，在 $t = 2$ 处为 $${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** solvingSystemsOfOdesUsingVariationOfParameters solves Φ u' = g. */
export const solvingSystemsOfOdesUsingVariationOfParameters: TopicDef = {
  id: "solving-systems-of-odes-using-variation-of-parameters",
  title: t("Solving Systems of ODEs Using Variation of Parameters", "利用常数变易法求解微分方程组"),
  summary: t(
    "Setting $\\mathbf{x} = \\Phi(t)\\mathbf{u}(t)$ turns the inhomogeneous system into $\\Phi\\mathbf{u}' = \\mathbf{g}$, so $\\mathbf{u}' = \\Phi^{-1}\\mathbf{g}$.",
    "设 $\\mathbf{x} = \\Phi(t)\\mathbf{u}(t)$，非齐次方程组化为 $\\Phi\\mathbf{u}' = \\mathbf{g}$，从而 $\\mathbf{u}' = \\Phi^{-1}\\mathbf{g}$。",
  ),
  intro: t(
    "Take $x_1' = x_1 + e^{t}$, $x_2' = -x_2$, with fundamental matrix $\\Phi = \\begin{pmatrix} e^{t} & 0 \\\\ 0 & e^{-t} \\end{pmatrix}$. Writing $\\mathbf{x}_p = \\Phi\\mathbf{u}$ turns the system into $\\Phi\\mathbf{u}' = \\mathbf{g}$: $e^{t}u_1' = e^{t}$ and $e^{-t}u_2' = 0$. So $u_1 = t$, $u_2 = 0$ and $\\mathbf{x}_p = (te^{t}, 0)$.\n\nCheck: $(te^{t})' = e^{t} + te^{t}$, which is $x_1 + e^{t}$ with $x_1 = te^{t}$.\n\nIn this lesson we find particular solutions of forced systems by letting the constants of the homogeneous solution vary.",
    "取 $x_1' = x_1 + e^{t}$，$x_2' = -x_2$，基本矩阵为 $\\Phi = \\begin{pmatrix} e^{t} & 0 \\\\ 0 & e^{-t} \\end{pmatrix}$。设 $\\mathbf{x}_p = \\Phi\\mathbf{u}$，方程组化为 $\\Phi\\mathbf{u}' = \\mathbf{g}$：$e^{t}u_1' = e^{t}$，$e^{-t}u_2' = 0$。所以 $u_1 = t$，$u_2 = 0$，$\\mathbf{x}_p = (te^{t}, 0)$。\n\n检验：$(te^{t})' = e^{t} + te^{t}$，当 $x_1 = te^{t}$ 时正是 $x_1 + e^{t}$。\n\n本课我们让齐次解中的常数变化起来，求受迫方程组的特解。",
  ),
  prerequisites: ["solving-inhomogeneous-systems-of-odes-using-matrix-methods"],
  encompasses: [
    {
      topic: "solving-inhomogeneous-systems-of-odes-using-matrix-methods",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "vector-variation-of-parameters-system",
      title: t("Parameter derivative vector in variation of parameters", "常数变易法中的参数导数向量"),
      explanation: t(
        "Writing the solution as the fundamental matrix times an unknown vector leads to an equation for the derivative of that vector. For $\\Phi(0) = I$, the parameter derivative at $t = 0$ is $\\mathbf{u}'(0) = \\Phi(0)^{-1}\\mathbf{g}(0) = \\mathbf{g}(0)$. For any other $\\Phi(0)$, solve the linear system $\\Phi(0)\\mathbf{u}'(0) = \\mathbf{g}(0)$.\n\n> **Watch out.** Read $\\mathbf{u}'(0)$ off $\\mathbf{g}(0)$ only when $\\Phi(0) = I$; otherwise solve the system. For $\\Phi(0) = \\begin{pmatrix} 1 & 1 \\\\ 0 & 2 \\end{pmatrix}$ and $\\mathbf{g}(0) = (3, 4)$, $u_2'(0) = 2$, not $4$.",
        "把解写成基本矩阵乘以一个未知向量，就得到关于这个向量导数的方程。当规范化基本解矩阵满足 $\\Phi(0) = I$ 时，在 $t = 0$ 处的参数导数向量为 $\\mathbf{u}'(0) = \\Phi(0)^{-1}\\mathbf{g}(0) = \\mathbf{g}(0)$。 对其他 $\\Phi(0)$，解线性方程组 $\\Phi(0)\\mathbf{u}'(0) = \\mathbf{g}(0)$。\n\n> **注意。** 只有 $\\Phi(0) = I$ 时才能直接从 $\\mathbf{g}(0)$ 读出 $\\mathbf{u}'(0)$；否则要解方程组。对 $\\Phi(0) = \\begin{pmatrix} 1 & 1 \\\\ 0 & 2 \\end{pmatrix}$ 与 $\\mathbf{g}(0) = (3, 4)$，$u_2'(0) = 2$，不是 $4$。",
      ),
      generate(rng: Rng): Problem {
        for (;;) {
          const a = rng.nonZero(-4, 5);
          const b = rng.nonZero(-4, 5);
          const c = rng.nonZero(-4, 5);
          const d = rng.nonZero(-4, 5);
          const g1 = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
          const g2 = rng.nonZero(-6, 6);
          const det = a * d - b * c;
          if (det === 0) continue;
          const num = a * g2 - c * g1;
          const ans = Q.of(num, det);
          const u1 = Q.of(d * g1 - b * g2, det);
          const phi = mat(a, b, c, d);
          return numberProblem({
            prompt: t(
              `In solving a system by variation of parameters $\\mathbf{x} = \\Phi(t)\\mathbf{u}$, the fundamental matrix satisfies $\\Phi(0) = ${phi}$ and the forcing vector is $\\mathbf{g}(t) = ${vec(`${g1}e^t`, g2)}$. Find the second parameter derivative component $u_2'(0)$.`,
              `用常数变易法 $\\mathbf{x} = \\Phi(t)\\mathbf{u}$ 求解系统，已知基本矩阵满足 $\\Phi(0) = ${phi}$，激励向量为 $\\mathbf{g}(t) = ${vec(`${g1}e^t`, g2)}$。求参数导数第二分量在 $t = 0$ 处的值 $u_2'(0)$。`,
            ),
            answer: ans,
            mistakes: apart(ans, [
              why(
                g2,
                "That reads $u_2'(0)$ straight from $\\mathbf{g}(0)$, which is right only when $\\Phi(0) = I$.",
                "这直接从 $\\mathbf{g}(0)$ 读出 $u_2'(0)$，只有 $\\Phi(0) = I$ 时才对。",
              ),
              why(u1, "That is $u_1'(0)$, the first component.", "这是第一分量 $u_1'(0)$。"),
              why(
                Q.of(g2, d),
                "That drops the term with $u_1'(0)$ from the second equation; the two equations are coupled.",
                "这从第二个方程中丢掉了含 $u_1'(0)$ 的项；两个方程是耦合的。",
              ),
              why(
                Q.of(-num, det),
                "The sign is flipped: Cramer's rule keeps the order $a g_2 - c g_1$ over $\\det \\Phi(0)$.",
                "符号反了：克拉默法则的分子是 $a g_2 - c g_1$，分母是 $\\det \\Phi(0)$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Set up the equations at $t = 0$", "写出 $t = 0$ 处的方程"],
                  t(`Since $e^{0} = 1$, $\\mathbf{g}(0) = (${g1}, ${g2})$.`, `因为 $e^{0} = 1$，$\\mathbf{g}(0) = (${g1}, ${g2})$。`),
                  [`${phi}\\mathbf{u}'(0) = ${vec(g1, g2)}`],
                ],
                [
                  ["Find the determinant", "求行列式"],
                  t("", ""),
                  [`\\det \\Phi(0) = ${par(a)} \\cdot ${par(d)} - ${par(b)} \\cdot ${par(c)} = ${det}`],
                ],
                [
                  ["Use Cramer's rule", "用克拉默法则"],
                  t("Replace the second column of $\\Phi(0)$ by $\\mathbf{g}(0)$.", "把 $\\Phi(0)$ 的第二列换成 $\\mathbf{g}(0)$。"),
                  [
                    `u_2'(0) = \\left(${par(a)} \\cdot ${par(g2)} - ${par(c)} \\cdot ${par(g1)}\\right) \\div ${par(det)} = ${ans.toLatex()}`,
                  ],
                ],
              ],
              t(
                `With $u_1'(0) = ${u1.toLatex()}$, the first row gives $${par(a)} \\cdot ${parQ(u1)} + ${par(b)} \\cdot ${parQ(ans)} = ${g1}$ and the second row gives $${par(c)} \\cdot ${parQ(u1)} + ${par(d)} \\cdot ${parQ(ans)} = ${g2}$.`,
                `取 $u_1'(0) = ${u1.toLatex()}$，第一行得 $${par(a)} \\cdot ${parQ(u1)} + ${par(b)} \\cdot ${parQ(ans)} = ${g1}$，第二行得 $${par(c)} \\cdot ${parQ(u1)} + ${par(d)} \\cdot ${parQ(ans)} = ${g2}$。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "a-particular-solution-by-variation-of-parameters",
      title: t("A particular solution by variation of parameters", "用参数变易法求特解"),
      explanation: t(
        "Variation of parameters looks for $\\mathbf{x}_p = \\Phi(t)\\mathbf{u}(t)$, which turns $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}$ into $\\Phi\\mathbf{u}' = \\mathbf{g}$. For the diagonal system $A = \\operatorname{diag}(a, b)$ with $\\Phi = \\operatorname{diag}(e^{at}, e^{bt})$ this reads\n\n$$u_1' = e^{-at}g_1(t), \\qquad u_2' = e^{-bt}g_2(t).$$\n\nIntegrate and multiply back by $\\Phi$. A forcing term $ke^{at}$ that matches the rate $a$ gives $u_1' = k$, so it produces the resonant term $kte^{at}$; a forcing $me^{ct}$ with $c \\ne b$ produces $\\frac{m}{c - b}e^{ct}$.\n\n> **Watch out.** For a forcing at the system's own rate, $u_1' = k$ is a constant, so nothing is divided by $a$. For $x_1' = 2x_1 + 5e^{2t}$ the coefficient of $te^{2t}$ is $5$, not $\\frac{5}{2}$.",
        "参数变易法设 $\\mathbf{x}_p = \\Phi(t)\\mathbf{u}(t)$，它把 $\\mathbf{x}' = A\\mathbf{x} + \\mathbf{g}$ 化为 $\\Phi\\mathbf{u}' = \\mathbf{g}$。对对角方程组 $A = \\operatorname{diag}(a, b)$，取 $\\Phi = \\operatorname{diag}(e^{at}, e^{bt})$，即\n\n$$u_1' = e^{-at}g_1(t), \\qquad u_2' = e^{-bt}g_2(t).$$\n\n积分后再乘回 $\\Phi$。与速率 $a$ 相同的强迫项 $ke^{at}$ 给出 $u_1' = k$，从而产生共振项 $kte^{at}$；强迫项 $me^{ct}$（$c \\ne b$）产生 $\\frac{m}{c - b}e^{ct}$。\n\n> **注意。** 强迫项的速率与方程组自身相同时，$u_1' = k$ 是常数，不需要除以 $a$。对 $x_1' = 2x_1 + 5e^{2t}$，$te^{2t}$ 的系数是 $5$，不是 $\\frac{5}{2}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const b = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c = rng.pick([-4, -2, 0, 2, 4, 5].filter((x) => x !== b));
        const k = rng.int(-6, 6) || 2;
        const m = rng.int(-6, 6) || 3;
        const first = rng.int(0, 1) === 0;
        const M = Q.of(m, c - b);
        const ans = first ? Q.of(k) : M;
        const rhs1 = poly([a, "x_1"], [k, `e^{${ex(a)}}`]);
        const g2 = poly([m, c === 0 ? "" : `e^{${ex(c)}}`]);
        const rhs2 = poly([b, "x_2"], [m, c === 0 ? "" : `e^{${ex(c)}}`]);
        const mistakes = first
          ? apart(ans, [
              why(
                Q.of(k, a),
                "That divides by the rate $a$, as if integrating an exponential; but $u_1'$ is a constant.",
                "这除以了速率 $a$，好像在对指数函数积分；但 $u_1'$ 是常数。",
              ),
              why(-k, "The sign is flipped; $e^{-at}$ times $ke^{at}$ is $+k$.", "符号反了；$e^{-at}$ 乘以 $ke^{at}$ 得 $+k$。"),
              why(
                k * a,
                "That multiplies by the rate $a$ instead of integrating the constant $u_1'$.",
                "这乘以了速率 $a$，而不是对常数 $u_1'$ 积分。",
              ),
              why(
                0,
                "A forcing at the rate $a$ does produce a $te^{at}$ term, because $u_1'$ is a nonzero constant.",
                "速率为 $a$ 的强迫项确实会产生 $te^{at}$ 项，因为 $u_1'$ 是非零常数。",
              ),
            ])
          : apart(ans, [
              why(
                Q.of(m, b - c),
                "The denominator is reversed: $e^{(c - b)t}$ integrates to $\\frac{1}{c - b}e^{(c - b)t}$.",
                "分母颠倒了：$e^{(c - b)t}$ 的积分是 $\\frac{1}{c - b}e^{(c - b)t}$。",
              ),
              why(
                m,
                "That keeps the forcing coefficient without integrating $e^{(c - b)t}$.",
                "这保留了强迫项系数，没有对 $e^{(c - b)t}$ 积分。",
              ),
              ...(c === 0
                ? []
                : [
                    why(
                      Q.of(m, c),
                      "That divides by $c$ alone; after the factor $e^{-bt}$ the rate is $c - b$.",
                      "这只除以了 $c$；乘上因子 $e^{-bt}$ 后速率是 $c - b$。",
                    ),
                  ]),
              ...(c + b === 0
                ? []
                : [
                    why(
                      Q.of(m, c + b),
                      "That adds the rates; the factor $e^{-bt}$ subtracts $b$.",
                      "这把速率相加了；因子 $e^{-bt}$ 要减去 $b$。",
                    ),
                  ]),
            ]);
        const term1 = `e^{${ex(a)}}`;
        const term2 = c === 0 ? "" : `e^{${ex(c)}}`;
        return numberProblem({
          prompt: t(
            `Use variation of parameters on $x_1' = ${rhs1}$, $x_2' = ${rhs2}$ with $\\mathbf{u}(0) = \\mathbf{0}$. ${first ? `Find the coefficient of $te^{${ex(a)}}$ in $x_{p,1}$.` : `Find the coefficient of ${c === 0 ? "the constant term" : `$e^{${ex(c)}}$`} in $x_{p,2}$.`}`,
            `对 $x_1' = ${rhs1}$，$x_2' = ${rhs2}$ 用参数变易法，取 $\\mathbf{u}(0) = \\mathbf{0}$。${first ? `求 $x_{p,1}$ 中 $te^{${ex(a)}}$ 的系数。` : `求 $x_{p,2}$ 中${c === 0 ? "常数项" : ` $e^{${ex(c)}}$ `}的系数。`}`,
          ),
          answer: ans,
          mistakes,
          solution: first
            ? walked(
                [
                  [
                    ["Write $u_1'$", "写出 $u_1'$"],
                    t(
                      `With $\\Phi = \\operatorname{diag}(e^{${ex(a)}}, e^{${ex(b)}})$, $u_1' = e^{${ex(-a)}}g_1$.`,
                      `取 $\\Phi = \\operatorname{diag}(e^{${ex(a)}}, e^{${ex(b)}})$，$u_1' = e^{${ex(-a)}}g_1$。`,
                    ),
                    [`u_1' = e^{${ex(-a)}}\\left(${poly([k, term1])}\\right) = ${k}`],
                  ],
                  [["Integrate", "积分"], t("Start from $u_1(0) = 0$.", "从 $u_1(0) = 0$ 出发。"), [`u_1 = ${poly([k, "t"])}`]],
                  [[`Multiply by $${term1}$`, `乘以 $${term1}$`], t("", ""), [`x_{p,1} = u_1${term1} = ${poly([k, `t${term1}`])}`]],
                ],
                t(
                  `$\\left(${poly([k, `t${term1}`])}\\right)' = ${poly([k, term1], [k * a, `t${term1}`])}$, which is $${poly([a, "x_{p,1}"], [k, term1])}$, so the first equation holds.`,
                  `$\\left(${poly([k, `t${term1}`])}\\right)' = ${poly([k, term1], [k * a, `t${term1}`])}$，即 $${poly([a, "x_{p,1}"], [k, term1])}$，所以第一个方程成立。`,
                ),
              )
            : walked(
                [
                  [
                    ["Write $u_2'$", "写出 $u_2'$"],
                    t(
                      `With $\\Phi = \\operatorname{diag}(e^{${ex(a)}}, e^{${ex(b)}})$, $u_2' = e^{${ex(-b)}}g_2$.`,
                      `取 $\\Phi = \\operatorname{diag}(e^{${ex(a)}}, e^{${ex(b)}})$，$u_2' = e^{${ex(-b)}}g_2$。`,
                    ),
                    [`u_2' = e^{${ex(-b)}}\\left(${g2}\\right) = ${poly([m, `e^{${ex(c - b)}}`])}`],
                  ],
                  [
                    ["Integrate", "积分"],
                    t(
                      "The constant of integration only adds a homogeneous term, so it does not change the coefficient.",
                      "积分常数只添加一个齐次项，不改变所求系数。",
                    ),
                    [`u_2 = ${poly([M, `e^{${ex(c - b)}}`])} + C`],
                  ],
                  [[`Multiply by $e^{${ex(b)}}$`, `乘以 $e^{${ex(b)}}$`], t("", ""), [`x_{p,2} = ${poly([M, term2])} + Ce^{${ex(b)}}`]],
                ],
                t(
                  `For the term $${poly([M, term2])}$, the derivative minus $${b}$ times the term has coefficient $\\left(${c} - ${par(b)}\\right) \\cdot ${parQ(M)} = ${m}$, which matches the forcing $${g2}$.`,
                  `对项 $${poly([M, term2])}$，它的导数减去 $${b}$ 倍该项，系数为 $\\left(${c} - ${par(b)}\\right) \\cdot ${parQ(M)} = ${m}$，与强迫项 $${g2}$ 相符。`,
                ),
              ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.17 Modeling With Systems of Linear ODEs
// ---------------------------------------------------------------------------

/** theLotkaVolterraPredatorPreyModel finds coexistence equilibrium. */
export const theLotkaVolterraPredatorPreyModel: TopicDef = {
  id: "the-lotka-volterra-predator-prey-model",
  title: t("The Lotka-Volterra Predator-Prey Model", "洛特卡-沃尔泰拉捕食者-猎物模型"),
  summary: t(
    "The Lotka-Volterra model $x' = \\alpha x - \\beta xy$, $y' = -\\gamma y + \\delta xy$ describes predator and prey populations, with coexistence equilibrium $(x_*, y_*) = \\left(\\frac{\\gamma}{\\delta}, \\frac{\\alpha}{\\beta}\\right)$.",
    "洛特卡-沃尔泰拉模型 $x' = \\alpha x - \\beta xy$，$y' = -\\gamma y + \\delta xy$ 描述捕食者与猎物种群，其共存平衡点为 $(x_*, y_*) = \\left(\\frac{\\gamma}{\\delta}, \\frac{\\alpha}{\\beta}\\right)$。",
  ),
  intro: t(
    "Take $x' = 4x - 2xy$ for the prey and $y' = -3y + xy$ for the predators. Setting $y' = y(-3 + x) = 0$ with $y \\ne 0$ gives $x_* = 3$; setting $x' = x(4 - 2y) = 0$ with $x \\ne 0$ gives $y_* = 2$. So the two populations can coexist at $(3, 2)$.\n\nCheck: at $(3, 2)$, $4 \\cdot 3 - 2 \\cdot 3 \\cdot 2 = 0$ and $-3 \\cdot 2 + 3 \\cdot 2 = 0$.\n\nIn this lesson we find the coexistence equilibrium of the Lotka-Volterra model and the frequency of the cycles around it.",
    "取猎物方程 $x' = 4x - 2xy$ 与捕食者方程 $y' = -3y + xy$。令 $y' = y(-3 + x) = 0$ 且 $y \\ne 0$，得 $x_* = 3$；令 $x' = x(4 - 2y) = 0$ 且 $x \\ne 0$，得 $y_* = 2$。所以两个种群可以在 $(3, 2)$ 共存。\n\n检验：在 $(3, 2)$ 处，$4 \\cdot 3 - 2 \\cdot 3 \\cdot 2 = 0$，$-3 \\cdot 2 + 3 \\cdot 2 = 0$。\n\n本课我们求洛特卡-沃尔泰拉模型的共存平衡点以及围绕它的循环的频率。",
  ),
  prerequisites: ["linear-approximations-near-equilibria"],
  encompasses: [{ topic: "linear-approximations-near-equilibria", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "coexistence-equilibrium-in-predator-prey-systems",
      title: t("Prey equilibrium population in the Lotka-Volterra model", "洛特卡-沃尔泰拉模型中的猎物平衡种群数量"),
      explanation: t(
        "Setting predator growth rate to zero: $-\\gamma y + \\delta x y = 0 \\implies y(-\\gamma + \\delta x) = 0$. For non-zero predator population $y \\ne 0$, the equilibrium prey population is $x_* = \\frac{\\gamma}{\\delta}$.\n\n> **Watch out.** The prey level comes from the predator equation and is the ratio $\\frac{\\gamma}{\\delta}$, not $\\gamma$ alone and not $\\frac{\\delta}{\\gamma}$. For $y' = -12y + 3xy$, $x_* = 4$.",
        "令捕食者变化率为零：$-\\gamma y + \\delta x y = 0 \\implies y(-\\gamma + \\delta x) = 0$。在两物种共存非零平衡态下，猎物平衡种群数量为 $x_* = \\frac{\\gamma}{\\delta}$。\n\n> **注意。** 猎物水平来自捕食者方程，是比值 $\\frac{\\gamma}{\\delta}$，不是单独的 $\\gamma$，也不是 $\\frac{\\delta}{\\gamma}$。对 $y' = -12y + 3xy$，$x_* = 4$。",
      ),
      generate(rng: Rng): Problem {
        const delta = rng.int(2, 6);
        const xStar = rng.int(10, 50);
        const gamma = delta * xStar;
        const ans = xStar;
        return numberProblem({
          prompt: t(
            `In a Lotka-Volterra predator-prey ecosystem, the predator population $y(t)$ satisfies $\\frac{dy}{dt} = -${gamma}y + ${delta}xy$, where $x(t)$ is the prey population. Find the equilibrium prey population $x_*$ required for the predator population to remain in dynamic balance.`,
            `在洛特卡-沃尔泰拉捕食者-猎物生态系统中，捕食者种群数量 $y(t)$ 满足方程 $\\frac{dy}{dt} = -${gamma}y + ${delta}xy$（$x(t)$ 为猎物数量）。求使得捕食者种群维持动态平衡的共存猎物种群数量 $x_*$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              gamma,
              "That is the predators' death rate $\\gamma$; it still has to be divided by $\\delta$.",
              "这是捕食者的死亡率 $\\gamma$；还要除以 $\\delta$。",
            ),
            why(delta, "That is the conversion rate $\\delta$, which is the divisor.", "这是转化率 $\\delta$，它是除数。"),
            why(
              Q.of(delta, gamma),
              "That divides the wrong way: $x_* = \\frac{\\gamma}{\\delta}$.",
              "除反了：$x_* = \\frac{\\gamma}{\\delta}$。",
            ),
          ]),
          solution: walked(
            [
              [["Set the predator rate to zero", "令捕食者变化率为零"], t("", ""), [`-${gamma}y + ${delta}xy = 0`]],
              [
                ["Factor out $y$", "提出 $y$"],
                t("Coexistence means $y \\ne 0$, so the bracket must vanish.", "共存意味着 $y \\ne 0$，所以括号必须为零。"),
                [`y\\left(-${gamma} + ${delta}x\\right) = 0`],
              ],
              [["Solve for $x$", "解出 $x$"], t("", ""), [`x_* = ${gamma} \\div ${delta} = ${ans}`]],
            ],
            t(
              `At $x = ${ans}$: $-${gamma}y + ${delta} \\cdot ${ans} \\cdot y = (-${gamma} + ${delta * ans})y = 0$ for every $y$.`,
              `在 $x = ${ans}$ 处：$-${gamma}y + ${delta} \\cdot ${ans} \\cdot y = (-${gamma} + ${delta * ans})y = 0$，对任何 $y$ 都成立。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-frequency-of-small-predator-prey-cycles",
      title: t("The frequency of small predator-prey cycles", "小幅捕食者-猎物循环的频率"),
      explanation: t(
        "For $x' = ax - bxy$, $y' = -cy + dxy$, the coexistence equilibrium is $\\left(\\frac{c}{d}, \\frac{a}{b}\\right)$. There the Jacobian is\n\n$$J = \\begin{pmatrix} 0 & -\\frac{bc}{d} \\\\ \\frac{ad}{b} & 0 \\end{pmatrix}, \\qquad \\lambda^2 = -ac.$$\n\nThe eigenvalues are $\\pm i\\sqrt{ac}$, so small oscillations of both populations have angular frequency $\\omega = \\sqrt{ac}$ and period $2\\pi/\\sqrt{ac}$. The interaction rates $b$ and $d$ set the equilibrium but not the frequency.\n\n> **Watch out.** $\\omega$ is the square root of the product $ac$. For $x' = 2x - xy$, $y' = -8y + 3xy$, $\\omega = \\sqrt{2 \\cdot 8} = 4$, not $16$ and not $2 + 8 = 10$.",
        "对 $x' = ax - bxy$，$y' = -cy + dxy$，共存平衡点为 $\\left(\\frac{c}{d}, \\frac{a}{b}\\right)$。该点处的雅可比矩阵为\n\n$$J = \\begin{pmatrix} 0 & -\\frac{bc}{d} \\\\ \\frac{ad}{b} & 0 \\end{pmatrix}, \\qquad \\lambda^2 = -ac.$$\n\n特征值为 $\\pm i\\sqrt{ac}$，所以两种群小幅振荡的角频率为 $\\omega = \\sqrt{ac}$，周期为 $2\\pi/\\sqrt{ac}$。相互作用率 $b$ 与 $d$ 决定平衡点，但不影响频率。\n\n> **注意。** $\\omega$ 是乘积 $ac$ 的平方根。对 $x' = 2x - xy$，$y' = -8y + 3xy$，$\\omega = \\sqrt{2 \\cdot 8} = 4$，不是 $16$，也不是 $2 + 8 = 10$。",
      ),
      generate(rng: Rng): Problem {
        const w = rng.int(1, 6);
        const divs = Array.from({ length: w * w }, (_, i) => i + 1).filter((k) => (w * w) % k === 0);
        const a = rng.pick(divs);
        const c = (w * w) / a;
        const b = rng.int(1, 5);
        const d = rng.int(1, 5);
        const J12 = Q.of(-b * c, d);
        const J21 = Q.of(a * d, b);
        return numberProblem({
          prompt: t(
            `Linearize $x' = ${poly([a, "x"], [-b, "xy"])}$, $y' = ${poly([-c, "y"], [d, "xy"])}$ at its coexistence equilibrium. Find the angular frequency $\\omega$ of small oscillations.`,
            `在共存平衡点处线性化 $x' = ${poly([a, "x"], [-b, "xy"])}$，$y' = ${poly([-c, "y"], [d, "xy"])}$。求小幅振荡的角频率 $\\omega$。`,
          ),
          answer: w,
          mistakes: apart(w, [
            why(w * w, "That is $\\omega^2 = ac$; take its square root.", "这是 $\\omega^2 = ac$；还要开平方。"),
            why(
              a + c,
              "That adds the two rates; the eigenvalues satisfy $\\lambda^2 = -ac$, a product.",
              "这把两个速率相加了；特征值满足 $\\lambda^2 = -ac$，是乘积。",
            ),
            why(
              Q.of(c, d),
              "That is the prey level $x_*$ at the equilibrium, not a frequency.",
              "这是平衡点处的猎物水平 $x_*$，不是频率。",
            ),
            why(
              Q.of(a, b),
              "That is the predator level $y_*$ at the equilibrium, not a frequency.",
              "这是平衡点处的捕食者水平 $y_*$，不是频率。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the equilibrium", "求平衡点"],
                t("Divide $y' = 0$ by $y$ and $x' = 0$ by $x$.", "把 $y' = 0$ 除以 $y$，把 $x' = 0$ 除以 $x$。"),
                [`x_* = ${c} \\div ${d} = ${Q.of(c, d).toLatex()}, \\qquad y_* = ${a} \\div ${b} = ${Q.of(a, b).toLatex()}`],
              ],
              [
                ["Linearize", "线性化"],
                t("The diagonal entries of the Jacobian vanish at the equilibrium.", "在平衡点处雅可比矩阵的对角元素为零。"),
                [`J = ${mat(0, J12.toLatex(), J21.toLatex(), 0)}`],
              ],
              [
                ["Find the eigenvalues", "求特征值"],
                t("", ""),
                [
                  `\\lambda^2 = ${parQ(J12)} \\cdot ${parQ(J21)} = -${w * w}`,
                  `\\lambda = \\pm ${w === 1 ? "" : w}i, \\qquad \\omega = ${w}`,
                ],
              ],
            ],
            t(
              `$\\omega^2 = ${a} \\cdot ${c} = ${w * w}$ directly from the formula $\\omega = \\sqrt{ac}$; the interaction rates $${b}$ and $${d}$ cancel in the product of the off-diagonal entries.`,
              `由公式 $\\omega = \\sqrt{ac}$ 直接得 $\\omega^2 = ${a} \\cdot ${c} = ${w * w}$；相互作用率 $${b}$ 与 $${d}$ 在非对角元素的乘积中相互抵消。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theLotkaVolterraModelWithCarryingCapacity adds logistic prey limits. */
export const theLotkaVolterraModelWithCarryingCapacity: TopicDef = {
  id: "the-lotka-volterra-model-with-carrying-capacity",
  title: t("The Lotka-Volterra Model With Carrying Capacity", "带环境容纳量的洛特卡-沃尔泰拉模型"),
  summary: t(
    "Incorporating carrying capacity K into prey dynamics dx/dt = r x (1 - x/K) - β x y stabilizes the predator-prey system against unbounded growth.",
    "在猎物动力学中引入环境容纳量 K：dx/dt = r x (1 - x/K) - β x y，防止由于无限制指数增长带来的生态崩溃并增强系统稳定性。",
  ),
  intro: t(
    "Take $x' = 3x\\left(1 - \\frac{x}{10}\\right) - xy$, $y' = -4y + 2xy$. The predator equation gives $x_* = 2$, and the prey equation divided by $x$ gives $3\\left(1 - \\frac{2}{10}\\right) - y = 0$, so $y_* = \\frac{12}{5}$, below the value $3$ the model would give without a carrying capacity.\n\nCheck: at $\\left(2, \\frac{12}{5}\\right)$, $3 \\cdot 2 \\cdot \\frac{8}{10} - 2 \\cdot \\frac{12}{5} = \\frac{24}{5} - \\frac{24}{5} = 0$ and $-4 \\cdot \\frac{12}{5} + 2 \\cdot 2 \\cdot \\frac{12}{5} = 0$.\n\nIn this lesson we give the prey a carrying capacity and see how it lowers the predator level at coexistence.",
    "取 $x' = 3x\\left(1 - \\frac{x}{10}\\right) - xy$，$y' = -4y + 2xy$。捕食者方程给出 $x_* = 2$；猎物方程除以 $x$ 得 $3\\left(1 - \\frac{2}{10}\\right) - y = 0$，所以 $y_* = \\frac{12}{5}$，低于没有环境容纳量时的 $3$。\n\n检验：在 $\\left(2, \\frac{12}{5}\\right)$ 处，$3 \\cdot 2 \\cdot \\frac{8}{10} - 2 \\cdot \\frac{12}{5} = \\frac{24}{5} - \\frac{24}{5} = 0$，$-4 \\cdot \\frac{12}{5} + 2 \\cdot 2 \\cdot \\frac{12}{5} = 0$。\n\n本课我们给猎物加上环境容纳量，看它如何降低共存时的捕食者水平。",
  ),
  prerequisites: ["the-lotka-volterra-predator-prey-model"],
  encompasses: [{ topic: "the-lotka-volterra-predator-prey-model", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "predator-prey-dynamics-with-logistic-prey-growth",
      title: t("Carrying capacity of prey in predator-prey systems", "捕食系统中猎物的环境容纳量"),
      explanation: t(
        "In the absence of predators ($y = 0$), prey dynamics reduce to logistic growth $\\frac{dx}{dt} = r x \\left(1 - \\frac{x}{K}\\right)$, converging to carrying capacity $x = K$. Written out, this is $\\frac{dx}{dt} = rx - \\frac{r}{K}x^2$, and $K$ is the non-zero value of $x$ where the rate is $0$.\n\n> **Watch out.** For $\\frac{dx}{dt} = rx - sx^2$ the carrying capacity is $\\frac{r}{s}$, not $\\frac{s}{r}$ and not $r$. For $\\frac{dx}{dt} = 60x - 3x^2 = 3x(20 - x)$, $K = 20$.",
        "在没有捕食者（$y = 0$）的情况下，猎物种群演化退化为逻辑斯谛增长 $\\frac{dx}{dt} = r x \\left(1 - \\frac{x}{K}\\right)$，其极限稳态即为环境容纳量 $x = K$。 展开后为 $\\frac{dx}{dt} = rx - \\frac{r}{K}x^2$，$K$ 是使变化率为 $0$ 的非零 $x$ 值。\n\n> **注意。** 对 $\\frac{dx}{dt} = rx - sx^2$，环境容纳量是 $\\frac{r}{s}$，不是 $\\frac{s}{r}$，也不是 $r$。对 $\\frac{dx}{dt} = 60x - 3x^2 = 3x(20 - x)$，$K = 20$。",
      ),
      generate(rng: Rng): Problem {
        const K = rng.int(1, 8) * 10;
        const s = rng.int(2, 9);
        const r = s * K;
        const rhs = poly([r, "x"], [-s, "x^2"]);
        const ans = K;
        return numberProblem({
          prompt: t(
            `In an ecosystem with logistic prey dynamics, prey population $x(t)$ in the absence of predators follows $\\frac{dx}{dt} = ${rhs}$. What is the carrying capacity $K$ of the prey population?`,
            `在具有逻辑斯谛猎物增长的生态系统中，当无捕食者存在时猎物种群满足 $\\frac{dx}{dt} = ${rhs}$。求猎物种群的环境容纳量 $K$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(r, "That is the growth rate $r$; it still has to be divided by $s$.", "这是增长率 $r$；还要除以 $s$。"),
            why(s, "That is the crowding coefficient of $x^2$.", "这是 $x^2$ 的拥挤系数。"),
            why(
              K / 2,
              "That is where the growth is fastest, halfway to the carrying capacity.",
              "这是增长最快的位置，位于环境容纳量的一半。",
            ),
            why(Q.of(s, r), "That divides the wrong way: $K = \\frac{r}{s}$.", "除反了：$K = \\frac{r}{s}$。"),
          ]),
          solution: walked(
            [
              [["Set the rate to zero", "令变化率为零"], t("", ""), [`${rhs} = 0`]],
              [
                ["Factor", "因式分解"],
                t(
                  "The root $x = 0$ is extinction; the other root is the carrying capacity.",
                  "根 $x = 0$ 表示灭绝；另一个根是环境容纳量。",
                ),
                [`${s}x(${K} - x) = 0`, `K = ${K}`],
              ],
            ],
            t(
              `$${r} \\cdot ${K} - ${s} \\cdot ${K}^2 = ${r * K} - ${s * K * K} = 0$, and the rate is positive for $0 < x < ${K}$, so the prey grow toward $${K}$.`,
              `$${r} \\cdot ${K} - ${s} \\cdot ${K}^2 = ${r * K} - ${s * K * K} = 0$，且当 $0 < x < ${K}$ 时变化率为正，所以猎物增长趋向 $${K}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-predator-level-at-coexistence-with-limited-prey",
      title: t("The predator level at coexistence with limited prey", "猎物受限时共存状态的捕食者数量"),
      explanation: t(
        "For $x' = ax\\left(1 - \\frac{x}{K}\\right) - bxy$, $y' = -cy + dxy$, the predator equation is unchanged, so coexistence still needs $x_* = \\frac{c}{d}$. Substituting into the prey equation and dividing by $x$ gives\n\n$$y_* = \\frac{a}{b}\\left(1 - \\frac{x_*}{K}\\right).$$\n\nThe logistic limit lowers the predator level below $\\frac{a}{b}$, and when $x_* \\ge K$ the predators cannot survive at all.\n\n> **Watch out.** Keep the factor $1 - \\frac{x_*}{K}$, not $\\frac{x_*}{K}$. For $a = 3$, $b = 1$, $x_* = 2$ and $K = 10$, $y_* = 3 \\cdot \\frac{8}{10} = \\frac{12}{5}$, not $3$ and not $\\frac{3}{5}$.",
        "对 $x' = ax\\left(1 - \\frac{x}{K}\\right) - bxy$，$y' = -cy + dxy$，捕食者方程没有变化，所以共存仍要求 $x_* = \\frac{c}{d}$。代入猎物方程并除以 $x$ 得\n\n$$y_* = \\frac{a}{b}\\left(1 - \\frac{x_*}{K}\\right).$$\n\nLogistic 限制使捕食者数量低于 $\\frac{a}{b}$；当 $x_* \\ge K$ 时捕食者根本无法存活。\n\n> **注意。** 因子是 $1 - \\frac{x_*}{K}$，不是 $\\frac{x_*}{K}$。对 $a = 3$，$b = 1$，$x_* = 2$，$K = 10$，$y_* = 3 \\cdot \\frac{8}{10} = \\frac{12}{5}$，不是 $3$，也不是 $\\frac{3}{5}$。",
      ),
      generate(rng: Rng): Problem {
        const d = rng.int(1, 4);
        const xs = rng.int(1, 8);
        const c = d * xs;
        const K = xs + rng.int(1, 12);
        const a = rng.int(1, 6);
        const b = rng.int(1, 5);
        const ans = Q.of(a * (K - xs), b * K);
        const aPart = Q.of(a * (K - xs), K);
        return numberProblem({
          prompt: t(
            `Find the predator level $y_*$ at the coexistence equilibrium of $x' = ${cf(a)}x\\left(1 - \\frac{x}{${K}}\\right) - ${cf(b)}xy$, $y' = ${poly([-c, "y"], [d, "xy"])}$.`,
            `求 $x' = ${cf(a)}x\\left(1 - \\frac{x}{${K}}\\right) - ${cf(b)}xy$，$y' = ${poly([-c, "y"], [d, "xy"])}$ 的共存平衡点处的捕食者数量 $y_*$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(a, b),
              "That is the predator level without the carrying capacity; the factor $1 - \\frac{x_*}{K}$ lowers it.",
              "这是没有环境容纳量时的捕食者水平；因子 $1 - \\frac{x_*}{K}$ 会把它降低。",
            ),
            why(aPart, "That forgets to divide by the predation rate $b$.", "这忘了除以捕食率 $b$。"),
            why(
              Q.of(a * (K - xs), b),
              "That uses $K - x_*$ instead of $1 - \\frac{x_*}{K}$; it still has to be divided by $K$.",
              "这用了 $K - x_*$ 而不是 $1 - \\frac{x_*}{K}$；还要除以 $K$。",
            ),
            why(
              Q.of(a * xs, b * K),
              "That uses $\\frac{x_*}{K}$ instead of $1 - \\frac{x_*}{K}$.",
              "这用了 $\\frac{x_*}{K}$ 而不是 $1 - \\frac{x_*}{K}$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Use the predator equation", "用捕食者方程"],
                t("Divide $y' = 0$ by $y$.", "把 $y' = 0$ 除以 $y$。"),
                [`${poly([-c, ""], [d, "x"])} = 0, \\qquad x_* = ${c} \\div ${d} = ${xs}`],
              ],
              [
                ["Use the prey equation", "用猎物方程"],
                t("Divide $x' = 0$ by $x$ and put in $x_*$.", "把 $x' = 0$ 除以 $x$，再代入 $x_*$。"),
                [
                  `${cf(a)}\\left(1 - \\frac{${xs}}{${K}}\\right) - ${cf(b)}y = 0`,
                  `y_* = \\frac{${a} \\cdot (${K} - ${xs})}{${b} \\cdot ${K}} = ${ans.toLatex()}`,
                ],
              ],
            ],
            t(
              `$${a} \\cdot \\frac{${K - xs}}{${K}} = ${aPart.toLatex()}$ and $${b} \\cdot ${ans.toLatex()} = ${aPart.toLatex()}$, so the prey rate is zero at $\\left(${xs}, ${ans.toLatex()}\\right)$.`,
              `$${a} \\cdot \\frac{${K - xs}}{${K}} = ${aPart.toLatex()}$，$${b} \\cdot ${ans.toLatex()} = ${aPart.toLatex()}$，所以在 $\\left(${xs}, ${ans.toLatex()}\\right)$ 处猎物变化率为零。`,
            ),
          ),
        });
      },
    },
  ],
};

/** differentialEquationsSystemsTopics gathers all 27 Unit 4 topics. */
export const differentialEquationsSystemsTopics: TopicDef[] = [
  introductionToSystemsOfLinearOdes,
  expressingHomogeneousOdesAsFirstOrderSystems,
  expressingInhomogeneousOdesAsFirstOrderSystems,
  linearIndependenceForHomogeneousSystemsOfOdes,
  generalSolutionsOfFirstOrderLinearSystemsOfOdes,
  solvingDecoupledHomogeneousSystemsOfOdes,
  solvingHomogeneousSystemsOfOdesWithDistinctEigenvalues,
  solvingHomogeneousSystemsOfOdesWithDistinctEigenvaluesAndInitialConditions,
  solvingHomogeneousSystemsOfOdesWithRepeatedEigenvalues,
  solvingHomogeneousSystemsOfOdesWithComplexEigenvalues,
  solvingInhomogeneousSystemsOfOdes,
  phasePlanesAndPhasePortraits,
  equilibriumPointsAndStabilityForSystemsOfOdes,
  phasePortraitsForDecoupledLinearSystems,
  phasePortraitsForLinearSystemsWithRealDistinctEigenvalues,
  phasePortraitsForLinearSystemsWithRepeatedEigenvalues,
  phasePortraitsForLinearSystemsWithZeroEigenvalues,
  phasePortraitsForLinearSystemsWithComplexEigenvalues,
  shiftedSystemsOfOdes,
  linearApproximationsNearEquilibria,
  matrixExponentials,
  fundamentalMatrices,
  solvingHomogeneousSystemsOfOdesUsingMatrixMethods,
  solvingInhomogeneousSystemsOfOdesUsingMatrixMethods,
  solvingSystemsOfOdesUsingVariationOfParameters,
  theLotkaVolterraPredatorPreyModel,
  theLotkaVolterraModelWithCarryingCapacity,
];
