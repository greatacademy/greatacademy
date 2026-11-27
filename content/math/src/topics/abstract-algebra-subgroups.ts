import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { algebraDrawings1 } from "../explanation-drawings-abstract-algebra-1.ts";

import { numberProblem, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import {
  divisors,
  type Fact,
  factProblem,
  gcd,
  generated,
  lcm,
  mod,
  multiplicativeOrder,
  phi,
  signed,
  symmetricGroup3,
  texChoice,
  units,
} from "./abstract-algebra-common.ts";
import { ANHARMONIC, mul2, sameMobius } from "./abstract-algebra-groups.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { range } from "./methods-of-proof-common.ts";

/** apart keeps the explained mistakes that differ from the answer and from each other. */
const apart = <T extends { readonly value: unknown }>(answer: unknown, list: readonly T[]): T[] =>
  list.filter((m, i) => m.value !== answer && list.findIndex((x) => x.value === m.value) === i);

/** rPow writes the rotation rᵏ, without a redundant exponent. */
const rPow = (k: number) => (k === 0 ? "e" : k === 1 ? "r" : `r^{${k}}`);

// Abstract Algebra unit 2, modules 2.4 to 2.6: subgroups, cyclic groups, generating sets and presentations.

/** subgroupPrompt asks whether H is a subgroup of G. */
const subgroupPrompt = (h: string, g: string) => t(`Is $${h}$ a subgroup of $${g}$?`, `$${h}$ 是 $${g}$ 的子群吗？`);

/** subgroupsOfScalarGroups decides which sets of numbers are subgroups. */
export const subgroupsOfScalarGroups: TopicDef = {
  id: "subgroups-of-scalar-groups",
  title: t("Subgroups of Scalar Groups", "数集群的子群"),
  summary: t(
    "A subset H of a group G is a subgroup if it is a group under the same operation. By the subgroup test, it suffices that H is nonempty and ab⁻¹ ∈ H whenever a, b ∈ H. The subgroups of ℤ are exactly the sets nℤ.",
    "若群 G 的子集 H 在同一运算下构成群，则 H 是子群。由子群判别法，只需 H 非空，且当 a, b ∈ H 时 ab⁻¹ ∈ H。ℤ 的子群恰好是各个 nℤ。",
  ),
  intro: t(
    "Is $4\\mathbb{Z} = \\{\\dots, -8, -4, 0, 4, 8, \\dots\\}$ a subgroup of $(\\mathbb{Z}, +)$? It is nonempty, since it contains $0$. For $a = 4m$ and $b = 4n$ in it, $a - b = 4(m - n)$ is again a multiple of $4$. So by the subgroup test $4\\mathbb{Z}$ is a subgroup. The odd integers are not: $1 - 3 = -2$ is even.\n\nCheck: $12 - (-8) = 20 = 4 \\cdot 5$, a multiple of $4$, as the test promised.\n\nIn this lesson we test sets of numbers for being subgroups and find the intersection of two subgroups of $\\mathbb{Z}$.",
    "$4\\mathbb{Z} = \\{\\dots, -8, -4, 0, 4, 8, \\dots\\}$ 是 $(\\mathbb{Z}, +)$ 的子群吗？它非空，因为含 $0$。对其中的 $a = 4m$ 与 $b = 4n$，$a - b = 4(m - n)$ 仍是 $4$ 的倍数。所以由子群判别法，$4\\mathbb{Z}$ 是子群。奇数集不是：$1 - 3 = -2$ 是偶数。\n\n检验：$12 - (-8) = 20 = 4 \\cdot 5$，是 $4$ 的倍数，正如判别法所保证的。\n\n本课我们检验数集是否为子群，并求 $\\mathbb{Z}$ 的两个子群的交。",
  ),
  prerequisites: ["real-rational-and-complex-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-subgroups-of-scalar-groups",
      title: t("Recognizing subgroups", "识别子群"),
      explanation: t(
        "Check that $H$ contains the identity and is closed under the operation and inverses. $\\{\\pm 1\\}$ is a subgroup of $(\\mathbb{R}^*, \\cdot)$, but $\\mathbb{Z}^+$ is not a subgroup of $(\\mathbb{Z}, +)$: it lacks $0$ and inverses.\n\nFor $3\\mathbb{Z}$ in $(\\mathbb{Z}, +)$: it contains $0 = 3 \\cdot 0$, and $3a - 3b = 3(a - b)$ is again a multiple of $3$, so the subgroup test holds.\n\nCheck: $6 - 9 = -3$ lies in $3\\mathbb{Z}$, and $-3$ is the inverse of $3$ there.\n\n> **Watch out.** Test with the group's own operation and identity: $\\{3^n : n \\in \\mathbb{Z}\\}$ is a subgroup of $(\\mathbb{Q}^*, \\cdot)$, but not of $(\\mathbb{Q}, +)$, whose identity $0$ it lacks.",
        "检验 $H$ 含单位元，并对运算和求逆封闭。$\\{\\pm 1\\}$ 是 $(\\mathbb{R}^*, \\cdot)$ 的子群，但 $\\mathbb{Z}^+$ 不是 $(\\mathbb{Z}, +)$ 的子群：它缺少 $0$ 和逆元。\n\n对 $(\\mathbb{Z}, +)$ 中的 $3\\mathbb{Z}$：它含 $0 = 3 \\cdot 0$，且 $3a - 3b = 3(a - b)$ 仍是 $3$ 的倍数，所以子群判别法成立。\n\n检验：$6 - 9 = -3$ 属于 $3\\mathbb{Z}$，而 $-3$ 正是 $3$ 在其中的逆元。\n\n> **注意。** 要用这个群自己的运算和单位元来检验：$\\{3^n : n \\in \\mathbb{Z}\\}$ 是 $(\\mathbb{Q}^*, \\cdot)$ 的子群，却不是 $(\\mathbb{Q}, +)$ 的子群，因为它缺少后者的单位元 $0$。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const r = rng.int(1, k - 1);
        const facts: Fact[] = [
          {
            prompt: subgroupPrompt(`${k}\\mathbb{Z}`, "(\\mathbb{Z}, +)"),
            holds: true,
            reason: t(
              `Differences of multiples of $${k}$ are multiples of $${k}$, and $0 \\in ${k}\\mathbb{Z}$.`,
              `$${k}$ 的倍数之差仍是 $${k}$ 的倍数，且 $0 \\in ${k}\\mathbb{Z}$。`,
            ),
          },
          {
            prompt: subgroupPrompt(`\\{${k}n ${signed(r)} : n \\in \\mathbb{Z}\\}`, "(\\mathbb{Z}, +)"),
            holds: false,
            reason: t(
              `It does not contain the identity $0$, since $0$ is not $${r}$ more than a multiple of $${k}$.`,
              `它不含单位元 $0$，因为 $0$ 不是 $${k}$ 的倍数加 $${r}$。`,
            ),
          },
          {
            prompt: subgroupPrompt(`\\{${k}^n : n \\in \\mathbb{Z}\\}`, "(\\mathbb{Q}^*, \\cdot)"),
            holds: true,
            reason: t(`$${k}^m (${k}^n)^{-1} = ${k}^{m - n}$ is in the set.`, `$${k}^m (${k}^n)^{-1} = ${k}^{m - n}$ 在集合中。`),
          },
          {
            prompt: subgroupPrompt(`\\{${k}^n : n \\in \\mathbb{Z}\\}`, "(\\mathbb{Q}, +)"),
            holds: false,
            reason: t("It does not contain the additive identity $0$.", "它不含加法单位元 $0$。"),
          },
          {
            prompt: subgroupPrompt(`\\{z \\in \\mathbb{C} : z^{${k}} = 1\\}`, "(\\mathbb{C}^*, \\cdot)"),
            holds: true,
            reason: t(
              `If $z^{${k}} = w^{${k}} = 1$ then $(zw^{-1})^{${k}} = 1$.`,
              `若 $z^{${k}} = w^{${k}} = 1$，则 $(zw^{-1})^{${k}} = 1$。`,
            ),
          },
          {
            prompt: subgroupPrompt(`\\{z \\in \\mathbb{C} : |z| = ${k}\\}`, "(\\mathbb{C}^*, \\cdot)"),
            holds: false,
            reason: t("It does not contain the identity $1$.", "它不含单位元 $1$。"),
          },
          {
            prompt: subgroupPrompt(`\\{x \\in \\mathbb{Z} : x \\ge -${k}\\}`, "(\\mathbb{Z}, +)"),
            holds: false,
            reason: t(
              `$-${k} + (-${k}) = -${2 * k}$ is not in the set, so it is not closed.`,
              `$-${k} + (-${k}) = -${2 * k}$ 不在集合中，所以不封闭。`,
            ),
          },
          {
            prompt: subgroupPrompt(`\\{\\tfrac{m}{${k}} : m \\in \\mathbb{Z}\\}`, "(\\mathbb{Q}, +)"),
            holds: true,
            reason: t(
              `$\\frac{a}{${k}} - \\frac{b}{${k}} = \\frac{a - b}{${k}}$ is in the set.`,
              `$\\frac{a}{${k}} - \\frac{b}{${k}} = \\frac{a - b}{${k}}$ 在集合中。`,
            ),
          },
          {
            prompt: subgroupPrompt(`\\{1, -1, ${k}, -${k}\\}`, "(\\mathbb{Q}^*, \\cdot)"),
            holds: false,
            reason: t(`$${k} \\cdot ${k} = ${k * k}$ is not in the set.`, `$${k} \\cdot ${k} = ${k * k}$ 不在集合中。`),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "intersections-of-subgroups-of-the-integers",
      title: t("Intersections in $\\mathbb{Z}$", "$\\mathbb{Z}$ 中的交"),
      explanation: t(
        "An integer lies in both subgroups exactly when it is a multiple of both numbers, which means a multiple of their least common multiple. $a\\mathbb{Z} \\cap b\\mathbb{Z}$ is the set of common multiples of $a$ and $b$, which is $\\operatorname{lcm}(a, b)\\mathbb{Z}$. For example $4\\mathbb{Z} \\cap 6\\mathbb{Z} = 12\\mathbb{Z}$.\n\nThe positive multiples of $4$ are $4, 8, 12, 16, 20, 24, \\dots$ and those of $6$ are $6, 12, 18, 24, \\dots$; the common ones are $12, 24, \\dots$, the multiples of $12$.\n\nCheck: $\\operatorname{lcm}(4, 6) \\cdot \\gcd(4, 6) = 12 \\cdot 2 = 24 = 4 \\cdot 6$.\n\n> **Watch out.** The intersection uses the least common multiple, not the greatest common divisor: $\\gcd(4, 6)\\mathbb{Z} = 2\\mathbb{Z}$ is the larger subgroup $4\\mathbb{Z} + 6\\mathbb{Z}$.",
        "一个整数同时属于两个子群，当且仅当它是两个数的公倍数，也就是它们最小公倍数的倍数。$a\\mathbb{Z} \\cap b\\mathbb{Z}$ 是 $a$ 与 $b$ 的公倍数的集合，即 $\\operatorname{lcm}(a, b)\\mathbb{Z}$。例如 $4\\mathbb{Z} \\cap 6\\mathbb{Z} = 12\\mathbb{Z}$。\n\n$4$ 的正倍数为 $4, 8, 12, 16, 20, 24, \\dots$，$6$ 的正倍数为 $6, 12, 18, 24, \\dots$；公共的是 $12, 24, \\dots$，即 $12$ 的倍数。\n\n检验：$\\operatorname{lcm}(4, 6) \\cdot \\gcd(4, 6) = 12 \\cdot 2 = 24 = 4 \\cdot 6$。\n\n> **注意。** 交用的是最小公倍数，而不是最大公约数：$\\gcd(4, 6)\\mathbb{Z} = 2\\mathbb{Z}$ 是更大的子群 $4\\mathbb{Z} + 6\\mathbb{Z}$。",
      ),
      generate(rng) {
        const a = rng.int(2, 18);
        let b: number;
        do b = rng.int(2, 18);
        while (b === a);
        const value = lcm(a, b);
        const g = gcd(a, b);
        return numberProblem({
          prompt: t(
            `The intersection $${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z}$ is a subgroup $m\\mathbb{Z}$ of $\\mathbb{Z}$ with $m > 0$. Find $m$.`,
            `交 $${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z}$ 是 $\\mathbb{Z}$ 的子群 $m\\mathbb{Z}$，$m > 0$。求 $m$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              g,
              `This is $\\gcd(${a}, ${b})$, which gives the sum $${a}\\mathbb{Z} + ${b}\\mathbb{Z}$, not the intersection.`,
              `这是 $\\gcd(${a}, ${b})$，它给出的是和 $${a}\\mathbb{Z} + ${b}\\mathbb{Z}$，而不是交。`,
            ),
            why(
              a * b,
              `$${a * b}$ is a common multiple, but not the least one, since $\\gcd(${a}, ${b}) = ${g}$.`,
              `$${a * b}$ 是公倍数，但不是最小的，因为 $\\gcd(${a}, ${b}) = ${g}$。`,
            ),
            why(a + b, "Adding the two numbers does not give a common multiple.", "把两个数相加得不到公倍数。"),
          ]),
          solution: walked(
            [
              [
                ["Describe the intersection", "描述交"],
                t(
                  `An integer lies in both subgroups when it is a multiple of both $${a}$ and $${b}$.`,
                  `一个整数同时属于两个子群，当且仅当它同时是 $${a}$ 与 $${b}$ 的倍数。`,
                ),
              ],
              [
                ["Take the lcm", "取最小公倍数"],
                t(
                  `The common multiples are the multiples of $\\operatorname{lcm}(${a}, ${b}) = ${value}$, so $m = ${value}$.`,
                  `公倍数就是 $\\operatorname{lcm}(${a}, ${b}) = ${value}$ 的倍数，所以 $m = ${value}$。`,
                ),
              ],
            ],
            t(
              `$${value} = ${a} \\cdot ${value / a} = ${b} \\cdot ${value / b}$, and $${value} \\cdot ${g} = ${a * b} = ${a} \\cdot ${b}$.`,
              `$${value} = ${a} \\cdot ${value / a} = ${b} \\cdot ${value / b}$，且 $${value} \\cdot ${g} = ${a * b} = ${a} \\cdot ${b}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** rotationTex writes the rotation matrix through the angle 2πk/n. */
const rotationTex = (k: number, n: number) => {
  const g = gcd(k, n);
  const [a, b] = [(2 * k) / g, n / g];
  const angle = b === 1 ? `${a}\\pi` : `\\frac{${a === 1 ? "" : a}\\pi}{${b}}`;
  return `\\begin{pmatrix} \\cos ${angle} & -\\sin ${angle} \\\\ \\sin ${angle} & \\cos ${angle} \\end{pmatrix}`;
};

/** Matrix2 is a 2 × 2 integer matrix, written row by row. */
type Matrix2 = readonly [number, number, number, number];

/** matrixTex writes a 2 × 2 matrix. */
const matrixTex = ([a, b, c, d]: Matrix2) => `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;

/** times multiplies two 2 × 2 matrices. */
const times = ([a, b, c, d]: Matrix2, [p, q, r, s]: Matrix2): Matrix2 => [a * p + b * r, a * q + b * s, c * p + d * r, c * q + d * s];

/** FINITE_MATRICES are integer matrices of finite order, with their orders. */
const FINITE_MATRICES: readonly { entries: Matrix2; order: number }[] = [
  { entries: [0, -1, 1, 0], order: 4 },
  { entries: [0, 1, 1, 0], order: 2 },
  { entries: [-1, -1, 1, 0], order: 3 },
  { entries: [0, -1, 1, 1], order: 6 },
  { entries: [1, 1, -1, 0], order: 6 },
  { entries: [0, 1, -1, -1], order: 3 },
  { entries: [-1, 0, 0, 1], order: 2 },
  { entries: [0, 1, -1, 0], order: 4 },
];

/** subgroupsOfMatrixGroups decides subgroups of GL(2, ℝ) and finds orders of cyclic matrix subgroups. */
export const subgroupsOfMatrixGroups: TopicDef = {
  id: "subgroups-of-matrix-groups",
  title: t("Subgroups of Matrix Groups", "矩阵群的子群"),
  summary: t(
    "Important subgroups of GL(n, ℝ) include SL(n, ℝ), the orthogonal matrices, the invertible diagonal and upper triangular matrices, and finite subgroups generated by rotations. The subgroup generated by a matrix A consists of its powers Aᵏ.",
    "GL(n, ℝ) 的重要子群包括 SL(n, ℝ)、正交矩阵、可逆的对角矩阵与上三角矩阵，以及由旋转生成的有限子群。矩阵 A 生成的子群由它的幂 Aᵏ 组成。",
  ),
  intro: t(
    "In $GL_2(\\mathbb{R})$, take the matrices with determinant $1$. The identity has determinant $1$, and for $A$, $B$ in the set, $\\det(AB^{-1}) = \\frac{\\det A}{\\det B}$, which is $1$ because both determinants are $1$. So $SL_2(\\mathbb{R})$ is a subgroup. The matrices with determinant $2$ are not: $\\det(I) = 1$, so the identity is missing.\n\nCheck: $\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ and $\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ have determinant $1$, and their product $\\begin{pmatrix} 2 & 3 \\\\ 1 & 2 \\end{pmatrix}$ has determinant $4 - 3 = 1$.\n\nIn this lesson we decide which sets of matrices are subgroups and find the orders of cyclic subgroups of matrix groups.",
    "在 $GL_2(\\mathbb{R})$ 中取行列式为 $1$ 的矩阵。单位矩阵的行列式为 $1$；对集合中的 $A$、$B$，$\\det(AB^{-1}) = \\frac{\\det A}{\\det B}$，等于 $1$。所以 $SL_2(\\mathbb{R})$ 是子群。行列式为 $2$ 的矩阵不构成子群：$\\det(I) = 1$，缺少单位元。\n\n检验：$\\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ 与 $\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ 的行列式都为 $1$，它们的乘积 $\\begin{pmatrix} 2 & 3 \\\\ 1 & 2 \\end{pmatrix}$ 的行列式为 $4 - 3 = 1$。\n\n本课我们判断哪些矩阵集是子群，并求矩阵群中循环子群的阶。",
  ),
  prerequisites: ["matrix-groups", "subgroups-of-scalar-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-subgroups-of-matrix-groups",
      title: t("Recognizing subgroups", "识别子群"),
      explanation: t(
        "The orthogonal matrices form a subgroup of $GL(2, \\mathbb{R})$: if $A^TA = B^TB = I$ then $(AB^{-1})^T(AB^{-1}) = I$. The symmetric invertible matrices do not: a product of symmetric matrices need not be symmetric.\n\nFor $SL(2, \\mathbb{R})$, the matrices of determinant $1$: if $\\det A = \\det B = 1$, then $\\det(AB^{-1}) = \\frac{\\det A}{\\det B} = 1$, so the subgroup test holds.\n\nCheck: the identity is in it, since $\\det I = 1$, and so is every inverse, since $\\det A^{-1} = \\frac{1}{\\det A} = 1$.\n\n> **Watch out.** Look for the identity first: a set such as $\\{A : \\det A = 2\\}$ fails at once, because $\\det I = 1$.",
        "正交矩阵构成 $GL(2, \\mathbb{R})$ 的子群：若 $A^TA = B^TB = I$，则 $(AB^{-1})^T(AB^{-1}) = I$。可逆对称矩阵不构成子群：对称矩阵之积未必对称。\n\n对 $SL(2, \\mathbb{R})$，即行列式为 $1$ 的矩阵：若 $\\det A = \\det B = 1$，则 $\\det(AB^{-1}) = \\frac{\\det A}{\\det B} = 1$，所以子群判别法成立。\n\n检验：单位矩阵在其中，因为 $\\det I = 1$；每个逆矩阵也在其中，因为 $\\det A^{-1} = \\frac{1}{\\det A} = 1$。\n\n> **注意。** 先看单位矩阵：像 $\\{A : \\det A = 2\\}$ 这样的集合立刻不成立，因为 $\\det I = 1$。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const facts: Fact[] = [
          {
            prompt: subgroupPrompt("SL(2, \\mathbb{R})", "GL(2, \\mathbb{R})"),
            holds: true,
            reason: t("$\\det(AB^{-1}) = \\det A / \\det B = 1$.", "$\\det(AB^{-1}) = \\det A / \\det B = 1$。"),
          },
          {
            prompt: subgroupPrompt(`\\{A : \\det A = ${k}\\}`, "GL(2, \\mathbb{R})"),
            holds: false,
            reason: t("It does not contain $I$.", "它不含 $I$。"),
          },
          {
            prompt: subgroupPrompt(`\\{A : \\det A = ${k}^n, n \\in \\mathbb{Z}\\}`, "GL(2, \\mathbb{R})"),
            holds: true,
            reason: t(
              `$\\det(AB^{-1}) = ${k}^{m - n}$, and $\\det I = ${k}^0$.`,
              `$\\det(AB^{-1}) = ${k}^{m - n}$，且 $\\det I = ${k}^0$。`,
            ),
          },
          {
            prompt: subgroupPrompt("\\{A : A^T A = I\\}", "GL(2, \\mathbb{R})"),
            holds: true,
            reason: t(
              "$(AB^{-1})^T(AB^{-1}) = B A^TA B^{-1} = I$ when $B^{-1} = B^T$.",
              "当 $B^{-1} = B^T$ 时，$(AB^{-1})^T(AB^{-1}) = B A^TA B^{-1} = I$。",
            ),
          },
          {
            prompt: subgroupPrompt("\\{A : A = A^T, \\det A \\ne 0\\}", "GL(2, \\mathbb{R})"),
            holds: false,
            reason: t(
              `$\\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}\\begin{pmatrix} ${k} & 0 \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} ${k} & 1 \\\\ ${k} & 2 \\end{pmatrix}$ is not symmetric.`,
              `$\\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}\\begin{pmatrix} ${k} & 0 \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} ${k} & 1 \\\\ ${k} & 2 \\end{pmatrix}$ 不对称。`,
            ),
          },
          {
            prompt: subgroupPrompt(`\\{I, ${k}I\\}`, "GL(2, \\mathbb{R})"),
            holds: false,
            reason: t(`$(${k}I)^2 = ${k * k}I$ is not in the set.`, `$(${k}I)^2 = ${k * k}I$ 不在集合中。`),
          },
          {
            prompt: subgroupPrompt("\\{I, -I\\}", "GL(2, \\mathbb{R})"),
            holds: true,
            reason: t(
              "$(-I)^2 = I$, so the set is closed and each element is its own inverse.",
              "$(-I)^2 = I$，所以集合封闭，且每个元素都是自身的逆。",
            ),
          },
          {
            prompt: subgroupPrompt(`\\left\\{\\begin{pmatrix} a & 0 \\\\ 0 & b \\end{pmatrix} : a, b > 0\\right\\}`, "GL(2, \\mathbb{R})"),
            holds: true,
            reason: t("Products and inverses of positive diagonal entries are positive.", "正对角元的积与倒数仍为正。"),
          },
          {
            prompt: subgroupPrompt(
              `\\left\\{\\begin{pmatrix} a & 0 \\\\ 0 & b \\end{pmatrix} : a, b \\ge ${k}\\right\\}`,
              "GL(2, \\mathbb{R})",
            ),
            holds: false,
            reason: t("It does not contain $I$.", "它不含 $I$。"),
          },
          {
            prompt: subgroupPrompt(
              `\\left\\{\\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix} : a \\in ${k}\\mathbb{Z}\\right\\}`,
              "GL(2, \\mathbb{R})",
            ),
            holds: true,
            reason: t(
              "The matrices for $a$ and $b$ multiply to the matrix for $a + b$, and the inverse of the matrix for $a$ is the matrix for $-a$.",
              "$a$ 与 $b$ 对应的矩阵之积是 $a + b$ 对应的矩阵，$a$ 对应的矩阵的逆是 $-a$ 对应的矩阵。",
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "orders-of-cyclic-matrix-subgroups",
      figure: algebraDrawings1["subgroups-of-matrix-groups#orders-of-cyclic-matrix-subgroups"],
      title: t("Cyclic subgroups of matrices", "矩阵的循环子群"),
      explanation: t(
        "The subgroup generated by $A$ is $\\{I, A, A^2, \\dots\\}$; its size is the least $m \\ge 1$ with $A^m = I$. The rotation through $\\frac{2\\pi k}{n}$ generates a subgroup of size $\\frac{n}{\\gcd(k, n)}$. For $\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$ (rotation by $\\frac{\\pi}{2}$) the size is $4$.\n\nIts powers are $A$, then $A^2 = -I$, then $A^3 = -A$, and $A^4 = I$: four turns of a quarter each bring the point $(1, 0)$ back, so the subgroup is $\\{I, A, -I, -A\\}$.\n\nCheck: the formula gives $\\frac{2\\pi k}{n} = \\frac{\\pi}{2}$ for $k = 1$, $n = 4$, and $\\frac{4}{\\gcd(1, 4)} = 4$.\n\n> **Watch out.** The identity $I = A^0$ belongs to the subgroup, so count $I, A, \\dots, A^{m - 1}$; and reduce the angle first, since the size is $\\frac{n}{\\gcd(k, n)}$, not $n$.",
        "$A$ 生成的子群为 $\\{I, A, A^2, \\dots\\}$；它的大小是使 $A^m = I$ 的最小 $m \\ge 1$。旋转角为 $\\frac{2\\pi k}{n}$ 的旋转生成大小为 $\\frac{n}{\\gcd(k, n)}$ 的子群。对 $\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$（旋转 $\\frac{\\pi}{2}$），大小为 $4$。\n\n它的幂依次为 $A$、$A^2 = -I$、$A^3 = -A$、$A^4 = I$：每次转四分之一圈，转四次点 $(1, 0)$ 回到原处，所以子群为 $\\{I, A, -I, -A\\}$。\n\n检验：取 $k = 1$，$n = 4$，公式给出 $\\frac{2\\pi k}{n} = \\frac{\\pi}{2}$，且 $\\frac{4}{\\gcd(1, 4)} = 4$。\n\n> **注意。** 单位矩阵 $I = A^0$ 属于这个子群，所以要数 $I, A, \\dots, A^{m - 1}$；并且要先化简角度，因为大小是 $\\frac{n}{\\gcd(k, n)}$，而不是 $n$。",
      ),
      generate(rng) {
        if (rng.bool(0.3)) {
          const m = rng.pick(FINITE_MATRICES);
          const tex = matrixTex(m.entries);
          const powers: Matrix2[] = [m.entries];
          while (powers.length < m.order) powers.push(times(powers[powers.length - 1] as Matrix2, m.entries));
          const square = powers[1] as Matrix2;
          const last = m.order === 2 ? "A" : `A^{${m.order - 1}}`;
          const all = m.order === 2 ? "\\{I, A\\}" : `\\{I, A, \\dots, ${last}\\}`;
          return numberProblem({
            prompt: t(
              `How many elements does the subgroup of $GL(2, \\mathbb{R})$ generated by $${tex}$ have?`,
              `$GL(2, \\mathbb{R})$ 中由 $${tex}$ 生成的子群有多少个元素？`,
            ),
            answer: m.order,
            mistakes: apart(m.order, [
              why(
                m.order - 1,
                "This leaves out the identity $I = A^0$, which belongs to every subgroup.",
                "这漏掉了单位矩阵 $I = A^0$，它属于每个子群。",
              ),
              why(
                m.order + 1,
                `This counts $I$ twice, once as $A^0$ and once as $A^{${m.order}}$.`,
                `这把 $I$ 数了两次，一次作 $A^0$，一次作 $A^{${m.order}}$。`,
              ),
              why(
                2 * m.order,
                `The powers repeat after $A^{${m.order}} = I$, so no new elements appear.`,
                `在 $A^{${m.order}} = I$ 之后幂开始重复，不会出现新元素。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Compute a power", "计算一个幂"],
                  t(
                    `$A^2 = ${matrixTex(square)}$${m.order === 2 ? ", which is $I$" : ", which is not $I$"}.`,
                    `$A^2 = ${matrixTex(square)}$${m.order === 2 ? "，它是 $I$" : "，它不是 $I$"}。`,
                  ),
                ],
                [
                  ["Find the first return", "找第一次回到 I"],
                  t(
                    `Continuing, the first positive power equal to $I$ is $A^{${m.order}}$, so the subgroup $${all}$ has $${m.order}$ elements.`,
                    `继续计算，第一个等于 $I$ 的正整数次幂是 $A^{${m.order}}$，所以子群 $${all}$ 有 $${m.order}$ 个元素。`,
                  ),
                ],
              ],
              t(
                `$A^{${m.order}} = ${last} A = ${matrixTex(powers[m.order - 1] as Matrix2)}$, the identity matrix.`,
                `$A^{${m.order}} = ${last} A = ${matrixTex(powers[m.order - 1] as Matrix2)}$，即单位矩阵。`,
              ),
            ),
          });
        }
        const n = rng.int(3, 24);
        let k: number;
        do k = rng.int(1, n - 1);
        while (gcd(k, n) === n);
        const g = gcd(k, n);
        const value = n / g;
        return numberProblem({
          prompt: t(
            `How many elements does the subgroup of $GL(2, \\mathbb{R})$ generated by $${rotationTex(k, n)}$ have?`,
            `$GL(2, \\mathbb{R})$ 中由 $${rotationTex(k, n)}$ 生成的子群有多少个元素？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              n,
              `The angle reduces: $\\gcd(${k}, ${n}) = ${g}$, so the rotation returns to $I$ sooner.`,
              `角度可以约分：$\\gcd(${k}, ${n}) = ${g}$，所以旋转更早回到 $I$。`,
            ),
            why(g, `This is $\\gcd(${k}, ${n})$; the size is $${n}$ divided by it.`, `这是 $\\gcd(${k}, ${n})$；大小是 $${n}$ 除以它。`),
            why(
              2 * value,
              `The powers repeat after $${value}$ steps, so there are no more elements.`,
              `幂在 $${value}$ 步后开始重复，所以没有更多元素。`,
            ),
            why(value - 1, "This leaves out the identity $I$, which belongs to every subgroup.", "这漏掉了单位矩阵 $I$，它属于每个子群。"),
          ]),
          solution: walked(
            [
              [
                ["Reduce the angle", "化简角度"],
                t(
                  `The angle is $\\frac{2\\pi \\cdot ${k}}{${n}}${g === 1 ? "" : ` = \\frac{2\\pi \\cdot ${k / g}}{${value}}`}$, in lowest terms.`,
                  `角度为 $\\frac{2\\pi \\cdot ${k}}{${n}}${g === 1 ? "" : ` = \\frac{2\\pi \\cdot ${k / g}}{${value}}`}$，已是最简形式。`,
                ),
              ],
              [
                ["Count the powers", "数幂的个数"],
                t(
                  `The powers return to $I$ first after $${value}$ steps, so the subgroup has $${value}$ elements.`,
                  `幂第一次回到 $I$ 是在 $${value}$ 步后，所以子群有 $${value}$ 个元素。`,
                ),
              ],
            ],
            t(
              `$${value}$ turns through $\\frac{2\\pi \\cdot ${k / g}}{${value}}$ make ${k / g === 1 ? "one full turn" : `$${k / g}$ full turns`}, and $\\frac{${n}}{\\gcd(${k}, ${n})} = ${value}$.`,
              `转 $${value}$ 次 $\\frac{2\\pi \\cdot ${k / g}}{${value}}$ 恰好是 $${k / g}$ 整圈，且 $\\frac{${n}}{\\gcd(${k}, ${n})} = ${value}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** closureOfMobius lists the indices of the anharmonic functions in the subgroup generated by the given ones. */
function closureOfMobius(gens: readonly number[]): number[] {
  const found = [0];
  for (let i = 0; i < found.length; i++)
    for (const g of gens) {
      const m = mul2(ANHARMONIC[found[i]!]!.m, ANHARMONIC[g]!.m);
      const j = ANHARMONIC.findIndex((h) => sameMobius(h.m, m));
      if (!found.includes(j)) found.push(j);
    }
  return found;
}

/** subgroupsOfFunctionGroups decides subgroups of the affine group and generates subgroups of the anharmonic group. */
export const subgroupsOfFunctionGroups: TopicDef = {
  id: "subgroups-of-function-groups",
  title: t("Subgroups of Function Groups", "函数群的子群"),
  summary: t(
    "A set of functions in a function group is a subgroup when it contains the identity function and is closed under composition and inverses. In the group of maps x ↦ ax + b, the translations x ↦ x + b and the scalings x ↦ ax are subgroups.",
    "函数群中的一组函数若含恒等函数，并对复合与求逆封闭，就是子群。在映射 x ↦ ax + b 构成的群中，平移 x ↦ x + b 与伸缩 x ↦ ax 都构成子群。",
  ),
  intro: t(
    "Under composition, the maps $x + b$ with $b \\in \\mathbb{Z}$ form a subgroup of the affine maps $ax + b$: $(x + 2) \\circ (x + 5) = x + 7$ is again a shift by an integer, the identity is $x + 0$, and the inverse of $x + 2$ is $x - 2$.\n\nCheck: $(x + 2) \\circ (x - 2) = (x - 2) + 2 = x$, the identity map.\n\nIn this lesson we decide which sets of functions are subgroups under composition and find the size of the subgroup generated by given functions.",
    "在复合下，$b \\in \\mathbb{Z}$ 的映射 $x + b$ 构成仿射映射 $ax + b$ 的子群：$(x + 2) \\circ (x + 5) = x + 7$ 仍是整数平移，恒等映射为 $x + 0$，$x + 2$ 的逆为 $x - 2$。\n\n检验：$(x + 2) \\circ (x - 2) = (x - 2) + 2 = x$，即恒等映射。\n\n本课我们判断哪些函数集在复合下构成子群，并求由给定函数生成的子群的大小。",
  ),
  prerequisites: ["function-groups", "subgroups-of-scalar-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "subgroups-of-the-affine-group",
      title: t("Subgroups of the affine group", "仿射群的子群"),
      explanation: t(
        "Compose two maps of the given form and invert one. $(ax + b) \\circ (cx + d) = acx + (ad + b)$ and $(ax + b)^{-1} = \\frac{1}{a}x - \\frac{b}{a}$. So the maps with $a > 0$ form a subgroup, but the maps $x + b$ with $b \\ge 0$ do not (no inverses).\n\nFor the maps with $a > 0$: $(2x + 1) \\circ (3x - 1) = 2(3x - 1) + 1 = 6x - 1$, again with a positive coefficient, and the inverse of $2x + 1$ is $\\frac{1}{2}x - \\frac{1}{2}$, whose coefficient $\\frac{1}{2}$ is positive too.\n\nCheck: $(2x + 1) \\circ \\left(\\frac{1}{2}x - \\frac{1}{2}\\right) = (x - 1) + 1 = x$, the identity map.\n\n> **Watch out.** Closure under composition is not enough: the maps $x + b$ with $b \\ge 0$ are closed, but the inverse $x - 1$ of $x + 1$ is not among them.",
        "把两个给定形式的映射复合，并对其中一个求逆。$(ax + b) \\circ (cx + d) = acx + (ad + b)$，$(ax + b)^{-1} = \\frac{1}{a}x - \\frac{b}{a}$。所以 $a > 0$ 的映射构成子群，而 $b \\ge 0$ 的映射 $x + b$ 不构成子群（缺少逆）。\n\n对 $a > 0$ 的映射：$(2x + 1) \\circ (3x - 1) = 2(3x - 1) + 1 = 6x - 1$，系数仍为正；$2x + 1$ 的逆是 $\\frac{1}{2}x - \\frac{1}{2}$，系数 $\\frac{1}{2}$ 也为正。\n\n检验：$(2x + 1) \\circ \\left(\\frac{1}{2}x - \\frac{1}{2}\\right) = (x - 1) + 1 = x$，即恒等映射。\n\n> **注意。** 只对复合封闭是不够的：$b \\ge 0$ 的映射 $x + b$ 对复合封闭，但 $x + 1$ 的逆 $x - 1$ 不在其中。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const G = "\\{x \\mapsto ax + b : a \\ne 0\\}";
        const facts: Fact[] = [
          {
            prompt: subgroupPrompt(`\\{x \\mapsto x + b : b \\in ${k}\\mathbb{Z}\\}`, G),
            holds: true,
            reason: t(
              `$(x + b) \\circ (x + d)^{-1} = x + (b - d)$, and $b - d \\in ${k}\\mathbb{Z}$.`,
              `$(x + b) \\circ (x + d)^{-1} = x + (b - d)$，且 $b - d \\in ${k}\\mathbb{Z}$。`,
            ),
          },
          {
            prompt: subgroupPrompt(`\\{x \\mapsto x + b : b \\ge -${k}\\}`, G),
            holds: false,
            reason: t(
              `$x - ${k}$ composed with itself is $x - ${2 * k}$, which is not in the set.`,
              `$x - ${k}$ 与自身复合得 $x - ${2 * k}$，不在集合中。`,
            ),
          },
          {
            prompt: subgroupPrompt(`\\{x \\mapsto ${k}^n x : n \\in \\mathbb{Z}\\}`, G),
            holds: true,
            reason: t(`$${k}^m x \\circ (${k}^n x)^{-1} = ${k}^{m - n} x$.`, `$${k}^m x \\circ (${k}^n x)^{-1} = ${k}^{m - n} x$。`),
          },
          {
            prompt: subgroupPrompt(`\\{x \\mapsto ${k}x + b : b \\in \\mathbb{R}\\}`, G),
            holds: false,
            reason: t(
              `It does not contain the identity $x$, and composing two of its maps gives a coefficient $${k * k}$.`,
              `它不含恒等映射 $x$，且其中两个映射复合后系数为 $${k * k}$。`,
            ),
          },
          {
            prompt: subgroupPrompt("\\{x \\mapsto ax + b : a > 0\\}", G),
            holds: true,
            reason: t(
              "Composing multiplies the leading coefficients and inverting inverts them, keeping them positive.",
              "复合时首项系数相乘，求逆时首项系数取倒数，都保持为正。",
            ),
          },
          {
            prompt: subgroupPrompt("\\{x \\mapsto ax + b : a < 0\\}", G),
            holds: false,
            reason: t("Composing two such maps gives a positive leading coefficient.", "两个这样的映射复合后首项系数为正。"),
          },
          {
            prompt: subgroupPrompt(`\\{x \\mapsto ax + b : a \\in \\mathbb{Q}^*, b \\in ${k}\\mathbb{Z}\\}`, G),
            holds: false,
            reason: t(
              `$(\\tfrac{1}{2}x) \\circ (x + ${k}) = \\tfrac{1}{2}x + \\tfrac{${k}}{2}$, and $\\tfrac{${k}}{2} \\notin ${k}\\mathbb{Z}$.`,
              `$(\\tfrac{1}{2}x) \\circ (x + ${k}) = \\tfrac{1}{2}x + \\tfrac{${k}}{2}$，而 $\\tfrac{${k}}{2} \\notin ${k}\\mathbb{Z}$。`,
            ),
          },
          {
            prompt: subgroupPrompt(`\\{x \\mapsto \\pm x + b : b \\in ${k}\\mathbb{Z}\\}`, G),
            holds: true,
            reason: t(
              `Composing and inverting keep the coefficient $\\pm 1$ and the constant in $${k}\\mathbb{Z}$.`,
              `复合与求逆保持系数为 $\\pm 1$，常数项在 $${k}\\mathbb{Z}$ 中。`,
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "subgroups-of-the-anharmonic-group",
      title: t("Generated subgroups", "生成的子群"),
      explanation: t(
        "Keep composing the given functions until no new function appears. $1 - x$ composed with itself is $x$, so it generates $\\{x, 1 - x\\}$. Adding $\\frac{1}{x}$ produces all six functions.\n\nFor $f(x) = \\frac{1}{1 - x}$: $f \\circ f = \\frac{x - 1}{x}$, and $f \\circ f \\circ f = x$, so $f$ generates $\\left\\{x, \\frac{1}{1 - x}, \\frac{x - 1}{x}\\right\\}$, a subgroup of $3$ elements.\n\nCheck: at $x = 2$, applying $f$ three times gives $f(2) = -1$, $f(-1) = \\frac{1}{2}$ and $f\\left(\\frac{1}{2}\\right) = 2$, back where it started.\n\n> **Watch out.** Count the identity $x$ as well, and stop only when composing any two functions found so far gives nothing new.",
        "不断复合给定的函数，直到不再出现新函数。$1 - x$ 与自身复合得 $x$，所以它生成 $\\{x, 1 - x\\}$。再加上 $\\frac{1}{x}$ 就得到全部六个函数。\n\n对 $f(x) = \\frac{1}{1 - x}$：$f \\circ f = \\frac{x - 1}{x}$，$f \\circ f \\circ f = x$，所以 $f$ 生成 $\\left\\{x, \\frac{1}{1 - x}, \\frac{x - 1}{x}\\right\\}$，这是一个有 $3$ 个元素的子群。\n\n检验：在 $x = 2$ 处连用三次 $f$：$f(2) = -1$，$f(-1) = \\frac{1}{2}$，$f\\left(\\frac{1}{2}\\right) = 2$，回到了起点。\n\n> **注意。** 恒等函数 $x$ 也要算上；并且只有当已找到的任意两个函数复合都不再产生新函数时，才能停下。",
      ),
      generate(rng) {
        const f = rng.int(1, 5);
        const g = rng.int(0, 5);
        const gens = f === g ? [f] : [f, g];
        const sub = closureOfMobius(gens);
        const names = gens.map((i) => `$${ANHARMONIC[i]!.tex}$`);
        const list = sub.map((i) => ANHARMONIC[i]!.tex).join(", ");
        return numberProblem({
          prompt: t(
            `The six functions $x, \\frac{1}{x}, 1 - x, \\frac{1}{1 - x}, \\frac{x - 1}{x}, \\frac{x}{x - 1}$ form a group under composition. How many elements does the subgroup generated by ${names.join(" and ")} have?`,
            `六个函数 $x, \\frac{1}{x}, 1 - x, \\frac{1}{1 - x}, \\frac{x - 1}{x}, \\frac{x}{x - 1}$ 在复合下构成群。由 ${names.join(" 与 ")} 生成的子群有多少个元素？`,
          ),
          answer: sub.length,
          mistakes: apart(sub.length, [
            why(
              gens.length + 1,
              "This counts the identity and the generators but not the new functions their compositions produce.",
              "这数了恒等函数和生成元，却没算它们复合产生的新函数。",
            ),
            why(
              6,
              "Not every choice generates the whole group: keep only the functions that composing actually produces.",
              "并不是每种选择都能生成整个群：只算复合真正得到的函数。",
            ),
            why(
              2,
              "A subgroup of size 2 comes from a single function that is its own inverse, which is not the case here.",
              "大小为 2 的子群来自一个自身为逆的函数，这里不是这种情形。",
            ),
            why(
              3,
              "A subgroup of size 3 comes from a single function of order 3, which is not the case here.",
              "大小为 3 的子群来自一个阶为 3 的函数，这里不是这种情形。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Start", "起步"],
                t(`Begin with the identity $x$ and ${names.join(" and ")}.`, `从恒等函数 $x$ 与 ${names.join(" 与 ")} 开始。`),
              ],
              [
                ["Compose until closed", "复合直到封闭"],
                t(
                  `Composing repeatedly gives $${list}$, and nothing new after that: $${sub.length}$ functions.`,
                  `反复复合得到 $${list}$，之后不再出现新函数：共 $${sub.length}$ 个函数。`,
                ),
              ],
            ],
            t(
              `The size $${sub.length}$ divides $6$, the size of the whole group, as the size of a subgroup of a finite group must.`,
              `大小 $${sub.length}$ 整除整个群的大小 $6$，有限群的子群的大小必须如此。`,
            ),
          ),
        });
      },
    },
  ],
};

/** propertiesOfSubgroups works with unions of subgroups and subgroups generated by several elements. */
export const propertiesOfSubgroups: TopicDef = {
  id: "properties-of-subgroups",
  title: t("Properties of Subgroups", "子群的性质"),
  summary: t(
    "The intersection of subgroups is always a subgroup, so every subset S of a group lies in a smallest subgroup ⟨S⟩, the intersection of all subgroups containing it. A union of two subgroups is a subgroup only when one contains the other.",
    "子群的交总是子群，所以群的每个子集 S 都包含在一个最小的子群 ⟨S⟩ 中，即所有包含 S 的子群之交。两个子群的并是子群，当且仅当其中一个包含另一个。",
  ),
  intro: t(
    "The intersection $4\\mathbb{Z} \\cap 6\\mathbb{Z} = 12\\mathbb{Z}$ is a subgroup of $\\mathbb{Z}$, but the union $4\\mathbb{Z} \\cup 6\\mathbb{Z}$ is not: it contains $4$ and $6$ but not $10$. The smallest subgroup containing both $4$ and $6$ is $2\\mathbb{Z}$, since $\\gcd(4, 6) = 2$.\n\nCheck: $2 = 2 \\cdot 4 - 6$, so any subgroup containing $4$ and $6$ contains $2$, and $2\\mathbb{Z}$ contains both.\n\nIn this lesson we decide when a union of subgroups is a subgroup and find the smallest subgroup of $\\mathbb{Z}_n$ containing two elements.",
    "交 $4\\mathbb{Z} \\cap 6\\mathbb{Z} = 12\\mathbb{Z}$ 是 $\\mathbb{Z}$ 的子群，但并 $4\\mathbb{Z} \\cup 6\\mathbb{Z}$ 不是：它含 $4$ 和 $6$，却不含 $10$。同时包含 $4$ 与 $6$ 的最小子群是 $2\\mathbb{Z}$，因为 $\\gcd(4, 6) = 2$。\n\n检验：$2 = 2 \\cdot 4 - 6$，所以任何含 $4$ 与 $6$ 的子群都含 $2$，而 $2\\mathbb{Z}$ 同时含两者。\n\n本课我们判断子群的并何时是子群，并求 $\\mathbb{Z}_n$ 中包含两个元素的最小子群。",
  ),
  prerequisites: ["subgroups-of-scalar-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "unions-of-subgroups",
      title: t("Unions of subgroups", "子群的并"),
      explanation: t(
        "A union of two subgroups is usually not closed under the operation, and it is a subgroup only when one subgroup contains the other. $2\\mathbb{Z} \\cup 3\\mathbb{Z}$ is not a subgroup of $\\mathbb{Z}$: it contains $2$ and $3$ but not $2 + 3 = 5$. But $2\\mathbb{Z} \\cup 6\\mathbb{Z} = 2\\mathbb{Z}$ is, since $6\\mathbb{Z} \\subseteq 2\\mathbb{Z}$.\n\nFor $4\\mathbb{Z} \\cup 6\\mathbb{Z}$: neither $4$ nor $6$ divides the other, and the union contains $4$ and $6$ but not $4 + 6 = 10$.\n\nCheck: $10 \\div 4 = 2.5$ and $10 \\div 6 = \\frac{5}{3}$ are not integers, so $10$ is in neither subgroup.\n\n> **Watch out.** Each piece being a subgroup does not make the union one; the intersection of two subgroups, by contrast, is always a subgroup.",
        "两个子群的并通常对运算不封闭，只有当其中一个子群包含另一个时，它才是子群。$2\\mathbb{Z} \\cup 3\\mathbb{Z}$ 不是 $\\mathbb{Z}$ 的子群：它含 $2$ 和 $3$，但不含 $2 + 3 = 5$。而 $2\\mathbb{Z} \\cup 6\\mathbb{Z} = 2\\mathbb{Z}$ 是子群，因为 $6\\mathbb{Z} \\subseteq 2\\mathbb{Z}$。\n\n对 $4\\mathbb{Z} \\cup 6\\mathbb{Z}$：$4$ 与 $6$ 互不整除，并集含 $4$ 和 $6$，却不含 $4 + 6 = 10$。\n\n检验：$10 \\div 4 = 2.5$，$10 \\div 6 = \\frac{5}{3}$，都不是整数，所以 $10$ 不在任何一个子群中。\n\n> **注意。** 每一部分都是子群，并不能使并集成为子群；相反，两个子群的交总是子群。",
      ),
      generate(rng) {
        const a = rng.int(2, 9);
        const b = rng.bool() ? a * rng.int(2, 4) : rng.int(2, 15);
        const [x, y] = rng.bool() ? [a, b] : [b, a];
        const holds = x % y === 0 || y % x === 0;
        return factProblem({
          prompt: t(
            `Is $${x}\\mathbb{Z} \\cup ${y}\\mathbb{Z}$ a subgroup of $\\mathbb{Z}$?`,
            `$${x}\\mathbb{Z} \\cup ${y}\\mathbb{Z}$ 是 $\\mathbb{Z}$ 的子群吗？`,
          ),
          holds,
          reason: holds
            ? t(
                `One of the two subgroups contains the other, so the union is $${Math.min(x, y)}\\mathbb{Z}$.`,
                `两个子群中一个包含另一个，所以并为 $${Math.min(x, y)}\\mathbb{Z}$。`,
              )
            : t(
                `It contains $${x}$ and $${y}$ but not $${x + y}$, which is a multiple of neither.`,
                `它含 $${x}$ 与 $${y}$，但不含 $${x + y}$，因为它不是两者中任何一个的倍数。`,
              ),
        });
      },
    },
    {
      id: "the-subgroup-generated-by-two-elements-of-zn",
      title: t("Smallest subgroups", "最小子群"),
      explanation: t(
        "The smallest subgroup of $\\mathbb{Z}_n$ containing $a$ and $b$ consists of the multiples of $d = \\gcd(a, b, n)$, so it has $\\frac{n}{d}$ elements. In $\\mathbb{Z}_{24}$, the smallest subgroup containing $9$ and $15$ is generated by $3$ and has $8$ elements.\n\nIn $\\mathbb{Z}_{20}$ with $8$ and $14$: $\\gcd(8, 14) = 2$ and $\\gcd(2, 20) = 2$, so the subgroup is $\\{0, 2, 4, \\dots, 18\\}$ with $\\frac{20}{2} = 10$ elements.\n\nCheck: $2 \\cdot 8 - 14 = 2$, so $2$ really is reached from $8$ and $14$, and every element reached is even.\n\n> **Watch out.** Include $n$ in the gcd: in $\\mathbb{Z}_{15}$ the elements $6$ and $12$ have $\\gcd(6, 12) = 6$, yet the subgroup is generated by $\\gcd(6, 12, 15) = 3$.",
        "$\\mathbb{Z}_n$ 中包含 $a$ 与 $b$ 的最小子群由 $d = \\gcd(a, b, n)$ 的倍数组成，所以有 $\\frac{n}{d}$ 个元素。在 $\\mathbb{Z}_{24}$ 中，包含 $9$ 与 $15$ 的最小子群由 $3$ 生成，有 $8$ 个元素。\n\n在 $\\mathbb{Z}_{20}$ 中取 $8$ 与 $14$：$\\gcd(8, 14) = 2$，$\\gcd(2, 20) = 2$，所以该子群为 $\\{0, 2, 4, \\dots, 18\\}$，有 $\\frac{20}{2} = 10$ 个元素。\n\n检验：$2 \\cdot 8 - 14 = 2$，所以确实能由 $8$ 与 $14$ 得到 $2$，而得到的每个元素都是偶数。\n\n> **注意。** gcd 中要包含 $n$：在 $\\mathbb{Z}_{15}$ 中取 $6$ 与 $12$，$\\gcd(6, 12) = 6$，但子群由 $\\gcd(6, 12, 15) = 3$ 生成。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.pick([12, 18, 20, 24, 30, 36, 40, 42, 48, 60]);
          const a = rng.int(2, n - 1);
          const b = rng.int(2, n - 1);
          const g = gcd(a, b);
          const d = gcd(g, n);
          const size = n / d;
          const mistakes = apart(size, [
            why(d, "This is the generator of the subgroup, not the number of its elements.", "这是子群的生成元，而不是它的元素个数。"),
            why(
              n / gcd(a, n),
              `This is the size of the subgroup generated by $${a}$ alone; adding $${b}$ can make it larger.`,
              `这是只由 $${a}$ 生成的子群的大小；加上 $${b}$ 可能使它变大。`,
            ),
            why(
              n / gcd(b, n),
              `This is the size of the subgroup generated by $${b}$ alone; adding $${a}$ can make it larger.`,
              `这是只由 $${b}$ 生成的子群的大小；加上 $${a}$ 可能使它变大。`,
            ),
            why(
              n / gcd(a, n) + n / gcd(b, n),
              "Adding the sizes of the two cyclic subgroups double counts shared elements and misses sums of elements from both.",
              "把两个循环子群的大小相加，会重复计算公共元素，也漏掉两者元素之和。",
            ),
            why(n, "The subgroup is the whole group only when the gcd is $1$.", "只有当最大公约数为 $1$ 时，该子群才是整个群。"),
          ]);
          if (mistakes.length < 2) continue;
          const sizeTex = d === 1 ? `${n}` : `\\frac{${n}}{${d}} = ${size}`;
          return numberProblem({
            prompt: t(
              `How many elements does the smallest subgroup of $\\mathbb{Z}_{${n}}$ containing $${a}$ and $${b}$ have?`,
              `$\\mathbb{Z}_{${n}}$ 中包含 $${a}$ 与 $${b}$ 的最小子群有多少个元素？`,
            ),
            answer: size,
            mistakes,
            solution: walked(
              [
                [
                  ["Take the gcd", "求最大公约数"],
                  t(
                    `$\\gcd(${a}, ${b}) = ${g}$ and $\\gcd(${g}, ${n}) = ${d}$.`,
                    `$\\gcd(${a}, ${b}) = ${g}$，$\\gcd(${g}, ${n}) = ${d}$。`,
                  ),
                ],
                [
                  ["Count the multiples", "数倍数"],
                  t(
                    `The subgroup consists of the multiples of $${d}$ in $\\mathbb{Z}_{${n}}$, so it has $${sizeTex}$ elements.`,
                    `该子群由 $\\mathbb{Z}_{${n}}$ 中 $${d}$ 的倍数组成，所以有 $${sizeTex}$ 个元素。`,
                  ),
                ],
              ],
              t(
                `$${d}$ divides $${a}$, $${b}$ and $${n}$, and $${size} \\cdot ${d} = ${n}$.`,
                `$${d}$ 整除 $${a}$、$${b}$ 与 $${n}$，且 $${size} \\cdot ${d} = ${n}$。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

/** isCyclicUnits reports whether U(n) is cyclic, by looking for an element of order φ(n). */
const isCyclicUnits = (n: number) => units(n).some((a) => multiplicativeOrder(a, n) === phi(n));

/** finiteCyclicGroups decides whether groups of units are cyclic and finds generators. */
export const finiteCyclicGroups: TopicDef = {
  id: "finite-cyclic-groups",
  title: t("Finite Cyclic Groups", "有限循环群"),
  summary: t(
    "A group G is cyclic if G = ⟨g⟩ = {gᵏ : k ∈ ℤ} for some g, called a generator. A finite group of order n is cyclic exactly when it has an element of order n. ℤₙ is cyclic with generator 1; U(n) is cyclic for some n, such as U(7), and not for others, such as U(8).",
    "若存在 g 使 G = ⟨g⟩ = {gᵏ : k ∈ ℤ}，则群 G 是循环群，g 称为生成元。n 阶有限群是循环群当且仅当它有 n 阶元素。ℤₙ 是循环群，生成元为 1；U(n) 对某些 n 是循环群（如 U(7)），对另一些不是（如 U(8)）。",
  ),
  intro: t(
    "Is $U(5) = \\{1, 2, 3, 4\\}$ cyclic? The powers of $2$ modulo $5$ are $2, 4, 8 \\equiv 3, 6 \\equiv 1$, so $2$ has order $4 = |U(5)|$ and $U(5) = \\langle 2 \\rangle$. By contrast, in $U(8) = \\{1, 3, 5, 7\\}$ every element squares to $1$, so no element has order $4$.\n\nCheck: $2^4 = 16 = 3 \\cdot 5 + 1 \\equiv 1 \\pmod 5$, while $2^2 = 4 \\not\\equiv 1$.\n\nIn this lesson we decide whether groups of units are cyclic and find their smallest generators.",
    "$U(5) = \\{1, 2, 3, 4\\}$ 是循环群吗？$2$ 模 $5$ 的幂为 $2, 4, 8 \\equiv 3, 6 \\equiv 1$，所以 $2$ 的阶为 $4 = |U(5)|$，$U(5) = \\langle 2 \\rangle$。相反，在 $U(8) = \\{1, 3, 5, 7\\}$ 中每个元素的平方都是 $1$，没有 $4$ 阶元素。\n\n检验：$2^4 = 16 = 3 \\cdot 5 + 1 \\equiv 1 \\pmod 5$，而 $2^2 = 4 \\not\\equiv 1$。\n\n本课我们判断单位群是否为循环群，并求它们的最小生成元。",
  ),
  prerequisites: ["orders-of-group-elements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "cyclic-groups-of-units",
      title: t("Is U(n) cyclic?", "U(n) 是循环群吗？"),
      explanation: t(
        "$U(n)$ is cyclic exactly when some element has order $\\varphi(n)$. In $U(8) = \\{1, 3, 5, 7\\}$ every element squares to $1$, so no element has order $4$ and $U(8)$ is not cyclic. In $U(10)$, $3$ has order $4 = \\varphi(10)$.\n\nFor $U(9) = \\{1, 2, 4, 5, 7, 8\\}$: the powers of $2$ are $2, 4, 8, 7, 5, 1$, so $2$ has order $6 = \\varphi(9)$ and $U(9)$ is cyclic.\n\nCheck: $2^3 = 8 \\equiv -1 \\pmod 9$, so $2^6 \\equiv 1$ and no smaller power of $2$ is $1$.\n\n> **Watch out.** One element of small order proves nothing: in $U(9)$, $8$ has order $2$. Compare the largest order of an element with $\\varphi(n)$.",
        "$U(n)$ 是循环群当且仅当某个元素的阶为 $\\varphi(n)$。在 $U(8) = \\{1, 3, 5, 7\\}$ 中每个元素的平方都是 $1$，没有 $4$ 阶元素，所以 $U(8)$ 不是循环群。在 $U(10)$ 中，$3$ 的阶为 $4 = \\varphi(10)$。\n\n对 $U(9) = \\{1, 2, 4, 5, 7, 8\\}$：$2$ 的幂为 $2, 4, 8, 7, 5, 1$，所以 $2$ 的阶为 $6 = \\varphi(9)$，$U(9)$ 是循环群。\n\n检验：$2^3 = 8 \\equiv -1 \\pmod 9$，所以 $2^6 \\equiv 1$，而更小的 $2$ 的幂都不等于 $1$。\n\n> **注意。** 一个元素的阶小并不能说明什么：在 $U(9)$ 中 $8$ 的阶为 $2$。要拿元素的最大阶与 $\\varphi(n)$ 比较。",
      ),
      generate(rng) {
        const n = rng.int(5, 40);
        const yes = isCyclicUnits(n);
        const gen = units(n).find((a) => multiplicativeOrder(a, n) === phi(n));
        const maxOrder = Math.max(...units(n).map((a) => multiplicativeOrder(a, n)));
        return factProblem({
          prompt: t(`Is $U(${n})$ cyclic?`, `$U(${n})$ 是循环群吗？`),
          holds: yes,
          reason: yes
            ? t(
                `$${gen}$ has order $${phi(n)} = |U(${n})|$, so it generates $U(${n})$.`,
                `$${gen}$ 的阶为 $${phi(n)} = |U(${n})|$，所以它生成 $U(${n})$。`,
              )
            : t(
                `$|U(${n})| = ${phi(n)}$, but the largest order of an element is $${maxOrder}$.`,
                `$|U(${n})| = ${phi(n)}$，但元素的最大阶为 $${maxOrder}$。`,
              ),
        });
      },
    },
    {
      id: "smallest-generators-of-groups-of-units",
      title: t("Finding a generator", "寻找生成元"),
      explanation: t(
        "Test $2, 3, \\dots$ in turn and compute their orders. In $U(13)$, $2$ has powers $2, 4, 8, 3, 6, 12, 11, 9, 5, 10, 7, 1$, so its order is $12$ and $2$ generates $U(13)$.\n\nIn $U(7)$: $2$ has powers $2, 4, 1$, order $3$; $3$ has powers $3, 2, 6, 4, 5, 1$, order $6 = \\varphi(7)$. So the smallest generator is $3$.\n\nCheck: $3^3 = 27 = 3 \\cdot 7 + 6 \\equiv -1 \\pmod 7$, so the order of $3$ is not $3$, and it is not $2$ since $3^2 = 9 \\equiv 2$.\n\n> **Watch out.** A generator must reach every unit: $2$ is the smallest number greater than $1$, but in $U(7)$ it reaches only $1, 2, 4$.",
        "依次检验 $2, 3, \\dots$ 并计算它们的阶。在 $U(13)$ 中，$2$ 的幂为 $2, 4, 8, 3, 6, 12, 11, 9, 5, 10, 7, 1$，阶为 $12$，所以 $2$ 生成 $U(13)$。\n\n在 $U(7)$ 中：$2$ 的幂为 $2, 4, 1$，阶为 $3$；$3$ 的幂为 $3, 2, 6, 4, 5, 1$，阶为 $6 = \\varphi(7)$。所以最小生成元是 $3$。\n\n检验：$3^3 = 27 = 3 \\cdot 7 + 6 \\equiv -1 \\pmod 7$，所以 $3$ 的阶不是 $3$；又 $3^2 = 9 \\equiv 2$，阶也不是 $2$。\n\n> **注意。** 生成元必须能得到每个单位：$2$ 是大于 $1$ 的最小数，但在 $U(7)$ 中它只能得到 $1, 2, 4$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(5, 50);
        while (!isCyclicUnits(n) || phi(n) < 4);
        const gen = units(n).find((a) => multiplicativeOrder(a, n) === phi(n))!;
        const tried = units(n).filter((a) => a > 1 && a < gen);
        const second = units(n).find((a) => a > gen && multiplicativeOrder(a, n) === phi(n));
        const smallOrder = tried.find((a) => multiplicativeOrder(a, n) > 1);
        return numberProblem({
          prompt: t(
            `$U(${n})$ is cyclic. Find its smallest generator greater than $1$.`,
            `$U(${n})$ 是循环群。求它大于 $1$ 的最小生成元。`,
          ),
          answer: gen,
          mistakes: apart(gen, [
            ...(smallOrder === undefined
              ? []
              : [
                  why(
                    smallOrder,
                    `$${smallOrder}$ has order $${multiplicativeOrder(smallOrder, n)}$, less than $${phi(n)}$, so it does not reach every unit.`,
                    `$${smallOrder}$ 的阶为 $${multiplicativeOrder(smallOrder, n)}$，小于 $${phi(n)}$，所以不能得到每个单位。`,
                  ),
                ]),
            ...(second === undefined
              ? []
              : [why(second, `$${second}$ is a generator, but not the smallest one.`, `$${second}$ 是生成元，但不是最小的。`)]),
            why(
              n - 1,
              `$${n - 1} \\equiv -1$ has order $2$, so it generates only $\\{1, ${n - 1}\\}$.`,
              `$${n - 1} \\equiv -1$ 的阶为 $2$，只生成 $\\{1, ${n - 1}\\}$。`,
            ),
            why(phi(n), `$${phi(n)}$ is the order of the group, not a generator.`, `$${phi(n)}$ 是群的阶，而不是生成元。`),
          ]),
          solution: walked(
            [
              [
                ["Test in turn", "依次检验"],
                tried.length === 0
                  ? t(`$${gen}$ is the first candidate greater than $1$.`, `$${gen}$ 是大于 $1$ 的第一个候选。`)
                  : t(
                      `${tried.map((a) => `$${a}$ has order $${multiplicativeOrder(a, n)}$`).join(", ")}, all less than $${phi(n)}$.`,
                      `${tried.map((a) => `$${a}$ 的阶为 $${multiplicativeOrder(a, n)}$`).join("，")}，都小于 $${phi(n)}$。`,
                    ),
              ],
              [
                ["Find the generator", "找到生成元"],
                t(
                  `$${gen}$ has order $${phi(n)} = |U(${n})|$, so it is the smallest generator.`,
                  `$${gen}$ 的阶为 $${phi(n)} = |U(${n})|$，所以它是最小生成元。`,
                ),
              ],
            ],
            t(
              `$${gen}^{${phi(n)}} \\equiv 1 \\pmod{${n}}$, and the powers of $${gen}$ up to that exponent are $${phi(n)}$ different units.`,
              `$${gen}^{${phi(n)}} \\equiv 1 \\pmod{${n}}$，且 $${gen}$ 直到该指数的各次幂是 $${phi(n)}$ 个不同的单位。`,
            ),
          ),
        });
      },
    },
  ],
};

/** cyclicGroups decides which groups are cyclic and finds generators of subgroups of ℤ. */
export const cyclicGroups: TopicDef = {
  id: "cyclic-groups",
  title: t("Cyclic Groups", "循环群"),
  summary: t(
    "Every cyclic group is isomorphic to ℤ (if infinite) or to ℤₙ (if finite). ℤ and nℤ are infinite cyclic groups, while ℚ and ℝ under addition are not cyclic. Every cyclic group is abelian, and the subgroup of ℤ generated by a and b is gcd(a, b)ℤ.",
    "每个循环群都同构于 ℤ（若为无限群）或 ℤₙ（若为有限群）。ℤ 与 nℤ 是无限循环群，而加法群 ℚ 与 ℝ 不是循环群。每个循环群都是阿贝尔群，ℤ 中由 a 与 b 生成的子群为 gcd(a, b)ℤ。",
  ),
  intro: t(
    "The subgroup $\\langle 18, 30 \\rangle$ of $\\mathbb{Z}$ consists of all $18m + 30n$. Since $\\gcd(18, 30) = 6$ and $6 = 2 \\cdot 18 - 30$, it is $6\\mathbb{Z}$, a cyclic group with generator $6$. On the other hand, $(\\mathbb{Q}, +)$ is not cyclic: the multiples of any $\\frac{a}{b}$ miss $\\frac{a}{2b}$.\n\nCheck: $18 = 3 \\cdot 6$ and $30 = 5 \\cdot 6$ are multiples of $6$, so nothing outside $6\\mathbb{Z}$ can appear.\n\nIn this lesson we recognize cyclic groups and find generators of subgroups of $\\mathbb{Z}$ generated by two integers.",
    "$\\mathbb{Z}$ 的子群 $\\langle 18, 30 \\rangle$ 由所有 $18m + 30n$ 组成。由于 $\\gcd(18, 30) = 6$ 且 $6 = 2 \\cdot 18 - 30$，它等于 $6\\mathbb{Z}$，是以 $6$ 为生成元的循环群。另一方面，$(\\mathbb{Q}, +)$ 不是循环群：任意 $\\frac{a}{b}$ 的倍数中都没有 $\\frac{a}{2b}$。\n\n检验：$18 = 3 \\cdot 6$，$30 = 5 \\cdot 6$，都是 $6$ 的倍数，所以不会出现 $6\\mathbb{Z}$ 以外的元素。\n\n本课我们识别循环群，并求 $\\mathbb{Z}$ 中由两个整数生成的子群的生成元。",
  ),
  prerequisites: ["finite-cyclic-groups", "properties-of-subgroups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-cyclic-groups",
      title: t("Recognizing cyclic groups", "识别循环群"),
      explanation: t(
        "To show a group is cyclic, name a generator. $\\{3^n : n \\in \\mathbb{Z}\\}$ is generated by $3$. $(\\mathbb{Q}, +)$ is not cyclic: the multiples of $\\frac{a}{b}$ never include $\\frac{a}{2b}$.\n\nFor $(5\\mathbb{Z}, +)$: every element is $5k = k \\cdot 5$, so $5$ is a generator; so is $-5$.\n\nCheck: $-15 = (-3) \\cdot 5$ and $20 = 4 \\cdot 5$, both multiples of $5$, as every element of $5\\mathbb{Z}$ must be.\n\n> **Watch out.** Being abelian does not make a group cyclic: $(\\mathbb{Q}, +)$ and $U(8)$ are abelian but have no generator.",
        "要说明一个群是循环群，就给出一个生成元。$\\{3^n : n \\in \\mathbb{Z}\\}$ 由 $3$ 生成。$(\\mathbb{Q}, +)$ 不是循环群：$\\frac{a}{b}$ 的倍数中永远没有 $\\frac{a}{2b}$。\n\n对 $(5\\mathbb{Z}, +)$：每个元素都是 $5k = k \\cdot 5$，所以 $5$ 是生成元；$-5$ 也是。\n\n检验：$-15 = (-3) \\cdot 5$，$20 = 4 \\cdot 5$，都是 $5$ 的倍数，正如 $5\\mathbb{Z}$ 的每个元素那样。\n\n> **注意。** 阿贝尔群不一定是循环群：$(\\mathbb{Q}, +)$ 与 $U(8)$ 都是阿贝尔群，却没有生成元。",
      ),
      generate(rng) {
        const k = rng.int(2, 12);
        const facts: Fact[] = [
          {
            prompt: t(`Is $(${k}\\mathbb{Z}, +)$ cyclic?`, `$(${k}\\mathbb{Z}, +)$ 是循环群吗？`),
            holds: true,
            reason: t(`It is generated by $${k}$.`, `它由 $${k}$ 生成。`),
          },
          {
            prompt: t(
              `Is $(\\{${k}^n : n \\in \\mathbb{Z}\\}, \\cdot)$ cyclic?`,
              `$(\\{${k}^n : n \\in \\mathbb{Z}\\}, \\cdot)$ 是循环群吗？`,
            ),
            holds: true,
            reason: t(`It is generated by $${k}$.`, `它由 $${k}$ 生成。`),
          },
          {
            prompt: t(
              `Is $(\\{z \\in \\mathbb{C} : z^{${k}} = 1\\}, \\cdot)$ cyclic?`,
              `$(\\{z \\in \\mathbb{C} : z^{${k}} = 1\\}, \\cdot)$ 是循环群吗？`,
            ),
            holds: true,
            reason: t(`It is generated by $e^{2\\pi i / ${k}}$.`, `它由 $e^{2\\pi i / ${k}}$ 生成。`),
          },
          {
            prompt: t(
              `Is $(\\{\\frac{m}{${k}^n} : m, n \\in \\mathbb{Z}\\}, +)$ cyclic?`,
              `$(\\{\\frac{m}{${k}^n} : m, n \\in \\mathbb{Z}\\}, +)$ 是循环群吗？`,
            ),
            holds: false,
            reason: t(
              `The multiples of $\\frac{m}{${k}^n}$ never include $\\frac{1}{${k}^{n+1}}$.`,
              `$\\frac{m}{${k}^n}$ 的倍数中永远没有 $\\frac{1}{${k}^{n+1}}$。`,
            ),
          },
          {
            prompt: t(`Is $U(${k * 4})$ cyclic?`, `$U(${k * 4})$ 是循环群吗？`),
            holds: isCyclicUnits(k * 4),
            reason: isCyclicUnits(k * 4)
              ? t(
                  `$${units(k * 4).find((a) => multiplicativeOrder(a, k * 4) === phi(k * 4))}$ generates it.`,
                  `$${units(k * 4).find((a) => multiplicativeOrder(a, k * 4) === phi(k * 4))}$ 生成它。`,
                )
              : t(`No element has order $${phi(k * 4)}$.`, `没有阶为 $${phi(k * 4)}$ 的元素。`),
          },
          {
            prompt: t(
              "Is $(\\{x \\in \\mathbb{R} : x > 0\\}, \\cdot)$ cyclic?",
              `$(\\{x \\in \\mathbb{R} : x > 0\\}, \\cdot)$ 是循环群吗？`,
            ),
            holds: false,
            reason: t(
              "The powers of any $g > 0$ form a countable set, but the positive reals are uncountable.",
              "任意 $g > 0$ 的幂构成可数集，而正实数不可数。",
            ),
          },
          {
            prompt: t(`Is $(\\mathbb{Z}_{${k}}, +)$ cyclic?`, `$(\\mathbb{Z}_{${k}}, +)$ 是循环群吗？`),
            holds: true,
            reason: t("It is generated by $1$.", "它由 $1$ 生成。"),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "generators-of-subgroups-of-the-integers",
      title: t("Subgroups of $\\mathbb{Z}$ generated by two integers", "$\\mathbb{Z}$ 中由两个整数生成的子群"),
      explanation: t(
        "The subgroup of $\\mathbb{Z}$ generated by $a$ and $b$ is $\\{ma + nb\\}$, which by Bézout's identity is $d\\mathbb{Z}$ with $d = \\gcd(a, b)$. So $\\langle 12, 18 \\rangle = 6\\mathbb{Z}$ is cyclic with generator $6$.\n\nFor $\\langle 20, 35 \\rangle$: $\\gcd(20, 35) = 5$, so $\\langle 20, 35 \\rangle = 5\\mathbb{Z}$ with positive generator $5$.\n\nCheck: $2 \\cdot 20 - 35 = 5$, so $5$ really is in the subgroup, and $5$ divides both $20$ and $35$, so nothing smaller is.\n\n> **Watch out.** The generator is the gcd, not the lcm: the lcm generates the intersection $20\\mathbb{Z} \\cap 35\\mathbb{Z} = 140\\mathbb{Z}$.",
        "$\\mathbb{Z}$ 中由 $a$ 与 $b$ 生成的子群为 $\\{ma + nb\\}$，由裴蜀等式它等于 $d\\mathbb{Z}$，$d = \\gcd(a, b)$。所以 $\\langle 12, 18 \\rangle = 6\\mathbb{Z}$ 是以 $6$ 为生成元的循环群。\n\n对 $\\langle 20, 35 \\rangle$：$\\gcd(20, 35) = 5$，所以 $\\langle 20, 35 \\rangle = 5\\mathbb{Z}$，正生成元为 $5$。\n\n检验：$2 \\cdot 20 - 35 = 5$，所以 $5$ 确实在子群中；又 $5$ 整除 $20$ 与 $35$，所以没有更小的正元素。\n\n> **注意。** 生成元是最大公约数，而不是最小公倍数：最小公倍数生成的是交 $20\\mathbb{Z} \\cap 35\\mathbb{Z} = 140\\mathbb{Z}$。",
      ),
      generate(rng) {
        const d = rng.int(1, 9);
        let p: number;
        let q: number;
        do {
          p = rng.int(2, 12);
          q = rng.int(2, 12);
        } while (gcd(p, q) !== 1 || p === q);
        const [a, b] = [d * p, d * q];
        return numberProblem({
          prompt: t(
            `The subgroup $\\langle ${a}, ${b} \\rangle$ of $\\mathbb{Z}$ is cyclic. Find its positive generator.`,
            `$\\mathbb{Z}$ 的子群 $\\langle ${a}, ${b} \\rangle$ 是循环群。求它的正生成元。`,
          ),
          answer: d,
          mistakes: apart(d, [
            why(
              lcm(a, b),
              "The lcm generates the intersection of the two subgroups, not the subgroup generated by both.",
              "最小公倍数生成的是两个子群的交，而不是由两者生成的子群。",
            ),
            why(
              Math.min(a, b),
              `$${Math.min(a, b)}$ generates a subgroup that misses $${Math.max(a, b)}$.`,
              `$${Math.min(a, b)}$ 生成的子群不含 $${Math.max(a, b)}$。`,
            ),
            why(
              Math.abs(a - b),
              "The difference is in the subgroup, but it need not be its smallest positive element.",
              "差在子群中，但未必是其中最小的正元素。",
            ),
            why(a * b, "The product is a common multiple, which generates a smaller subgroup.", "乘积是公倍数，它生成的子群更小。"),
          ]),
          solution: walked(
            [
              [
                ["Use Bézout", "用裴蜀等式"],
                t(
                  `$\\langle ${a}, ${b} \\rangle = \\gcd(${a}, ${b})\\mathbb{Z}$.`,
                  `$\\langle ${a}, ${b} \\rangle = \\gcd(${a}, ${b})\\mathbb{Z}$。`,
                ),
              ],
              [
                ["Compute the gcd", "求最大公约数"],
                t(
                  `$${a} = ${d} \\cdot ${p}$ and $${b} = ${d} \\cdot ${q}$ with $\\gcd(${p}, ${q}) = 1$, so the generator is $${d}$.`,
                  `$${a} = ${d} \\cdot ${p}$，$${b} = ${d} \\cdot ${q}$，且 $\\gcd(${p}, ${q}) = 1$，所以生成元为 $${d}$。`,
                ),
              ],
            ],
            t(
              `$${d}$ divides both $${a}$ and $${b}$, and $${a} \\div ${d} = ${p}$ and $${b} \\div ${d} = ${q}$ share no factor.`,
              `$${d}$ 整除 $${a}$ 与 $${b}$，且 $${a} \\div ${d} = ${p}$ 与 $${b} \\div ${d} = ${q}$ 没有公因数。`,
            ),
          ),
        });
      },
    },
  ],
};

/** cyclicSubgroups lists elements of cyclic subgroups of ℤₙ and U(n). */
export const cyclicSubgroups: TopicDef = {
  id: "cyclic-subgroups",
  title: t("Cyclic Subgroups", "循环子群"),
  summary: t(
    "For any element a of a group, ⟨a⟩ = {aᵏ : k ∈ ℤ} is a subgroup, the cyclic subgroup generated by a; its order is the order of a. In ℤₙ, ⟨a⟩ consists of the multiples of gcd(a, n).",
    "对群中任意元素 a，⟨a⟩ = {aᵏ : k ∈ ℤ} 是子群，称为由 a 生成的循环子群；它的阶等于 a 的阶。在 ℤₙ 中，⟨a⟩ 由 gcd(a, n) 的倍数组成。",
  ),
  intro: t(
    "In $\\mathbb{Z}_{15}$, the cyclic subgroup generated by $6$ is $\\{0, 6, 12, 3, 9\\}$: keep adding $6$ modulo $15$ until $0$ returns. These are the multiples of $\\gcd(6, 15) = 3$, so $\\langle 6 \\rangle = \\langle 3 \\rangle$ has $5$ elements.\n\nCheck: $5 \\cdot 6 = 30 \\equiv 0 \\pmod{15}$, and no smaller positive multiple of $6$ is a multiple of $15$.\n\nIn this lesson we list the elements of cyclic subgroups of $\\mathbb{Z}_n$ and of $U(n)$.",
    "在 $\\mathbb{Z}_{15}$ 中，由 $6$ 生成的循环子群为 $\\{0, 6, 12, 3, 9\\}$：不断模 $15$ 加 $6$，直到回到 $0$。这些恰是 $\\gcd(6, 15) = 3$ 的倍数，所以 $\\langle 6 \\rangle = \\langle 3 \\rangle$ 有 $5$ 个元素。\n\n检验：$5 \\cdot 6 = 30 \\equiv 0 \\pmod{15}$，而 $6$ 的更小正倍数都不是 $15$ 的倍数。\n\n本课我们列出 $\\mathbb{Z}_n$ 与 $U(n)$ 的循环子群的元素。",
  ),
  prerequisites: ["cyclic-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "cyclic-subgroups-of-zn",
      title: t("Cyclic subgroups of $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 的循环子群"),
      explanation: t(
        "The multiples of an element modulo the order are exactly the multiples of their gcd, so that gcd generates the same subgroup. In $\\mathbb{Z}_{18}$, $\\langle 12 \\rangle = \\{0, 12, 6\\}$, the multiples of $\\gcd(12, 18) = 6$. An element belongs to $\\langle a \\rangle$ exactly when it is a multiple of $\\gcd(a, n)$.\n\nIn $\\mathbb{Z}_{20}$: $\\gcd(8, 20) = 4$, so $\\langle 8 \\rangle = \\{0, 4, 8, 12, 16\\}$, and $12$ lies in it while $6$ does not.\n\nCheck: $4 \\cdot 8 = 32 \\equiv 12 \\pmod{20}$, so $12$ really is a multiple of $8$ in $\\mathbb{Z}_{20}$.\n\n> **Watch out.** The subgroup holds more than the ordinary multiples of $a$ below $n$: in $\\mathbb{Z}_{20}$, $\\langle 8 \\rangle$ contains $4 \\equiv 3 \\cdot 8$ although $4 < 8$.",
        "一个元素模群阶的倍数恰好是它们最大公因数的倍数，所以这个最大公因数生成同一个子群。在 $\\mathbb{Z}_{18}$ 中，$\\langle 12 \\rangle = \\{0, 12, 6\\}$，即 $\\gcd(12, 18) = 6$ 的倍数。一个元素属于 $\\langle a \\rangle$ 当且仅当它是 $\\gcd(a, n)$ 的倍数。\n\n在 $\\mathbb{Z}_{20}$ 中：$\\gcd(8, 20) = 4$，所以 $\\langle 8 \\rangle = \\{0, 4, 8, 12, 16\\}$，$12$ 在其中，而 $6$ 不在。\n\n检验：$4 \\cdot 8 = 32 \\equiv 12 \\pmod{20}$，所以 $12$ 确实是 $\\mathbb{Z}_{20}$ 中 $8$ 的倍数。\n\n> **注意。** 该子群不只含 $a$ 在 $n$ 以下的普通倍数：在 $\\mathbb{Z}_{20}$ 中，$\\langle 8 \\rangle$ 含 $4 \\equiv 3 \\cdot 8$，尽管 $4 < 8$。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        let d: number;
        do {
          n = rng.int(8, 40);
          a = rng.int(2, n - 1);
          d = gcd(a, n);
        } while (d === 1 || d === n);
        const inside = range(1, n - 1).filter((x) => x % d === 0 && x !== a);
        const outside = range(1, n - 1).filter((x) => x % d !== 0);
        const right = rng.pick(inside.length > 0 ? inside : [a]);
        const others = rng.sample(outside, Math.min(3, outside.length));
        const k = range(1, n).find((j) => mod(j * a, n) === right)!;
        return reasoned(
          texChoice(
            rng,
            t(
              `Which of these elements of $\\mathbb{Z}_{${n}}$ lies in the cyclic subgroup $\\langle ${a} \\rangle$?`,
              `下列 $\\mathbb{Z}_{${n}}$ 的元素中，哪个属于循环子群 $\\langle ${a} \\rangle$？`,
            ),
            `${right}`,
            others.map(String),
            walked(
              [
                [
                  ["Take the gcd", "求最大公约数"],
                  t(
                    `$\\gcd(${a}, ${n}) = ${d}$, so $\\langle ${a} \\rangle$ consists of the multiples of $${d}$.`,
                    `$\\gcd(${a}, ${n}) = ${d}$，所以 $\\langle ${a} \\rangle$ 由 $${d}$ 的倍数组成。`,
                  ),
                ],
                [["Test the options", "检验选项"], t(`Only $${right}$ is a multiple of $${d}$.`, `只有 $${right}$ 是 $${d}$ 的倍数。`)],
              ],
              t(
                `$${k} \\cdot ${a} = ${k * a} \\equiv ${right} \\pmod{${n}}$.`,
                `$${k} \\cdot ${a} = ${k * a} \\equiv ${right} \\pmod{${n}}$。`,
              ),
            ),
          ),
          others.map((x) => [
            `$${x}$`,
            `$${x}$ is not a multiple of $\\gcd(${a}, ${n}) = ${d}$, so no multiple of $${a}$ modulo $${n}$ equals it.`,
            `$${x}$ 不是 $\\gcd(${a}, ${n}) = ${d}$ 的倍数，所以 $${a}$ 模 $${n}$ 的倍数都不等于它。`,
          ]),
        );
      },
    },
    {
      id: "cyclic-subgroups-of-groups-of-units",
      title: t("Cyclic subgroups of U(n)", "U(n) 的循环子群"),
      explanation: t(
        "The cyclic subgroup generated by an element consists of its powers, which repeat once a power equals the identity. List the powers of $a$ until you return to $1$. In $U(13)$, $\\langle 3 \\rangle = \\{1, 3, 9\\}$ since $3^3 = 27 \\equiv 1$.\n\nIn $U(11)$: the powers of $5$ are $5, 25 \\equiv 3, 15 \\equiv 4, 20 \\equiv 9, 45 \\equiv 1$, so $\\langle 5 \\rangle = \\{1, 3, 4, 5, 9\\}$.\n\nCheck: the subgroup has $5$ elements, and $5$ divides $|U(11)| = 10$, as it must.\n\n> **Watch out.** Multiply powers, do not add multiples: in $U(11)$, $5 + 5 = 10$ is not in $\\langle 5 \\rangle$.",
        "由一个元素生成的循环子群由它的幂组成，一旦某次幂等于单位元，这些幂就开始重复。列出 $a$ 的幂直到回到 $1$。在 $U(13)$ 中，$\\langle 3 \\rangle = \\{1, 3, 9\\}$，因为 $3^3 = 27 \\equiv 1$。\n\n在 $U(11)$ 中：$5$ 的幂为 $5, 25 \\equiv 3, 15 \\equiv 4, 20 \\equiv 9, 45 \\equiv 1$，所以 $\\langle 5 \\rangle = \\{1, 3, 4, 5, 9\\}$。\n\n检验：该子群有 $5$ 个元素，而 $5$ 整除 $|U(11)| = 10$，这是必然的。\n\n> **注意。** 要做幂（乘法），而不是加倍数：在 $U(11)$ 中，$5 + 5 = 10$ 不在 $\\langle 5 \\rangle$ 中。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        let pw: number[];
        do {
          n = rng.int(7, 40);
          a = rng.pick(units(n));
          pw = [];
          let x = 1;
          do {
            pw.push(x);
            x = mod(x * a, n);
          } while (x !== 1);
        } while (pw.length < 3 || pw.length === phi(n));
        const inside = pw.filter((x) => x !== 1 && x !== a);
        const outside = units(n).filter((x) => !pw.includes(x));
        const right = rng.pick(inside);
        const others = rng.sample(outside, Math.min(3, outside.length));
        const k = pw.indexOf(right);
        return reasoned(
          texChoice(
            rng,
            t(
              `Which of these elements of $U(${n})$ lies in the cyclic subgroup $\\langle ${a} \\rangle$?`,
              `下列 $U(${n})$ 的元素中，哪个属于循环子群 $\\langle ${a} \\rangle$？`,
            ),
            `${right}`,
            others.map(String),
            walked(
              [
                [
                  ["List the powers", "列出幂"],
                  t(
                    `The powers of $${a}$ modulo $${n}$ are $${pw.join(", ")}$, then they repeat.`,
                    `$${a}$ 模 $${n}$ 的幂为 $${pw.join(", ")}$，之后开始重复。`,
                  ),
                ],
                [
                  ["Test the options", "检验选项"],
                  t(`Of the options, only $${right}$ is on that list.`, `选项中只有 $${right}$ 在这个列表里。`),
                ],
              ],
              t(
                `$${a}^{${k}} \\equiv ${right} \\pmod{${n}}$, and the subgroup has $${pw.length}$ elements, which divides $|U(${n})| = ${phi(n)}$.`,
                `$${a}^{${k}} \\equiv ${right} \\pmod{${n}}$，且该子群有 $${pw.length}$ 个元素，整除 $|U(${n})| = ${phi(n)}$。`,
              ),
            ),
          ),
          others.map((x) => [
            `$${x}$`,
            `$${x}$ is a unit modulo $${n}$, but it is not among the powers $${pw.join(", ")}$ of $${a}$.`,
            `$${x}$ 是模 $${n}$ 的单位，但不在 $${a}$ 的幂 $${pw.join(", ")}$ 之中。`,
          ]),
        );
      },
    },
  ],
};

/** cyclicSubgroupsInTheComplexPlane finds orders of complex numbers and decides whether they are finite. */
export const cyclicSubgroupsInTheComplexPlane: TopicDef = {
  id: "cyclic-subgroups-in-the-complex-plane",
  title: t("Cyclic Subgroups in the Complex Plane", "复平面中的循环子群"),
  summary: t(
    "In $\\mathbb{C}^*$, the cyclic subgroup $\\langle z \\rangle$ is finite exactly when $z$ is a root of unity. The number $e^{2\\pi ik/n}$ generates a subgroup of order $\\frac{n}{\\gcd(k, n)}$, whose elements are equally spaced on the unit circle. If $|z| \\ne 1$, the powers of $z$ spiral in or out and $\\langle z \\rangle$ is infinite.",
    "在 $\\mathbb{C}^*$ 中，循环子群 $\\langle z \\rangle$ 有限当且仅当 $z$ 是单位根。$e^{2\\pi ik/n}$ 生成阶为 $\\frac{n}{\\gcd(k, n)}$ 的子群，其元素在单位圆上等距分布。若 $|z| \\ne 1$，$z$ 的幂螺旋向内或向外，$\\langle z \\rangle$ 为无限群。",
  ),
  intro: t(
    "The number $z = e^{2\\pi i \\cdot 3/12}$ turns $\\frac{3}{12} = \\frac{1}{4}$ of a full turn, so $z = i$ and $\\langle z \\rangle = \\{1, i, -1, -i\\}$ has $4$ elements, equally spaced on the unit circle. The number $2i$ is different: its powers have moduli $2, 4, 8, \\dots$, so $\\langle 2i \\rangle$ is infinite.\n\nCheck: $i^4 = (i^2)^2 = (-1)^2 = 1$, while $i^2 = -1 \\ne 1$.\n\nIn this lesson we find the orders of roots of unity and decide whether a cyclic subgroup of $\\mathbb{C}^*$ is finite.",
    "数 $z = e^{2\\pi i \\cdot 3/12}$ 转过整圈的 $\\frac{3}{12} = \\frac{1}{4}$，所以 $z = i$，$\\langle z \\rangle = \\{1, i, -1, -i\\}$ 有 $4$ 个元素，在单位圆上等距分布。$2i$ 则不同：它的幂的模为 $2, 4, 8, \\dots$，所以 $\\langle 2i \\rangle$ 无限。\n\n检验：$i^4 = (i^2)^2 = (-1)^2 = 1$，而 $i^2 = -1 \\ne 1$。\n\n本课我们求单位根的阶，并判断 $\\mathbb{C}^*$ 的循环子群是否有限。",
  ),
  prerequisites: ["cyclic-subgroups", "properties-of-roots-of-unity"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orders-of-roots-of-unity",
      figure: algebraDrawings1["cyclic-subgroups-in-the-complex-plane#orders-of-roots-of-unity"],
      title: t("Orders of roots of unity", "单位根的阶"),
      explanation: t(
        "A root of unity returns to one after as many steps as the denominator of its angle fraction in lowest terms. $e^{2\\pi i \\cdot 4/6} = e^{2\\pi i \\cdot 2/3}$ has order $3$: write the fraction $\\frac{k}{n}$ in lowest terms, and the order is the denominator $\\frac{n}{\\gcd(k, n)}$.\n\nCheck: in the drawing each step turns $\\frac{4}{6}$ of a full turn, so three steps turn $\\frac{12}{6} = 2$ full turns and land back on $1$, while one or two steps do not.\n\n> **Watch out.** Reduce the fraction first: $e^{2\\pi i \\cdot 4/6}$ is a $6$th root of unity, but its order is $3$, not $6$.",
        "一个单位根在若干步之后回到 1，步数等于它的角度分数化为最简后的分母。$e^{2\\pi i \\cdot 4/6} = e^{2\\pi i \\cdot 2/3}$ 的阶为 $3$：把分数 $\\frac{k}{n}$ 化为最简，阶就是分母 $\\frac{n}{\\gcd(k, n)}$。\n\n检验：图中每一步转过整圈的 $\\frac{4}{6}$，所以三步转过 $\\frac{12}{6} = 2$ 整圈，回到 $1$；而一步或两步都回不到。\n\n> **注意。** 先约分：$e^{2\\pi i \\cdot 4/6}$ 是 $6$ 次单位根，但它的阶是 $3$，不是 $6$。",
      ),
      generate(rng) {
        const n = rng.int(3, 30);
        const k = rng.int(2, n - 1);
        const value = n / gcd(k, n);
        const polar = rng.bool();
        const z = polar ? `\\cos \\frac{${2 * k}\\pi}{${n}} + i \\sin \\frac{${2 * k}\\pi}{${n}}` : `e^{${2 * k}\\pi i / ${n}}`;
        return numberProblem({
          prompt: t(
            `How many elements does the cyclic subgroup of $\\mathbb{C}^*$ generated by $${z}$ have?`,
            `$\\mathbb{C}^*$ 中由 $${z}$ 生成的循环子群有多少个元素？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              n,
              `$${n}$ is the denominator before reducing; $\\frac{${k}}{${n}}$ reduces since $\\gcd(${k}, ${n}) = ${gcd(k, n)}$.`,
              `$${n}$ 是约分前的分母；由于 $\\gcd(${k}, ${n}) = ${gcd(k, n)}$，$\\frac{${k}}{${n}}$ 还能约分。`,
            ),
            why(
              gcd(k, n),
              "This is the gcd used to reduce the fraction, not the reduced denominator.",
              "这是约分用的最大公约数，而不是约分后的分母。",
            ),
            why(
              n / gcd(2 * k, n),
              `This reduces $\\frac{${2 * k}}{${n}}$, but a full turn is $2\\pi$, so the fraction of a turn is $\\frac{${k}}{${n}}$.`,
              `这约分的是 $\\frac{${2 * k}}{${n}}$，但整圈是 $2\\pi$，所以转过整圈的比例是 $\\frac{${k}}{${n}}$。`,
            ),
            why(
              k,
              "The numerator tells how far each step turns, not how many steps it takes to return to $1$.",
              "分子说明每一步转多远，而不是回到 $1$ 需要几步。",
            ),
            why(
              k / gcd(k, n),
              "This is the reduced numerator: the number of full turns, not the number of steps.",
              "这是约分后的分子：转过的整圈数，而不是步数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Read the fraction of a turn", "读出转过的比例"],
                t(
                  `The angle $\\frac{${2 * k}\\pi}{${n}}$ is $2\\pi \\cdot \\frac{${k}}{${n}}$, so each power turns $\\frac{${k}}{${n}}$ of a full turn.`,
                  `角 $\\frac{${2 * k}\\pi}{${n}}$ 等于 $2\\pi \\cdot \\frac{${k}}{${n}}$，所以每次乘方转过整圈的 $\\frac{${k}}{${n}}$。`,
                ),
              ],
              [
                ["Reduce", "约分"],
                t(
                  `$\\gcd(${k}, ${n}) = ${gcd(k, n)}$, so $\\frac{${k}}{${n}} = \\frac{${k / gcd(k, n)}}{${value}}$ in lowest terms and the order is $${value}$.`,
                  `$\\gcd(${k}, ${n}) = ${gcd(k, n)}$，所以 $\\frac{${k}}{${n}}$ 的最简形式为 $\\frac{${k / gcd(k, n)}}{${value}}$，阶为 $${value}$。`,
                ),
              ],
            ],
            t(
              `$${value}$ steps turn $${value} \\cdot \\frac{${k / gcd(k, n)}}{${value}} = ${k / gcd(k, n)}$ full turns, a whole number, and no fewer steps do.`,
              `$${value}$ 步转过 $${value} \\cdot \\frac{${k / gcd(k, n)}}{${value}} = ${k / gcd(k, n)}$ 整圈，是整数，更少的步数都不行。`,
            ),
          ),
        });
      },
    },
    {
      id: "finite-and-infinite-cyclic-subgroups-of-c",
      title: t("Finite or infinite", "有限还是无限"),
      explanation: t(
        "If $|z| \\ne 1$ then $|z^k| = |z|^k$ never returns to $1$, so $\\langle z \\rangle$ is infinite. If $|z| = 1$, $\\langle z \\rangle$ is finite only when the argument of $z$ is a rational multiple of $2\\pi$. For example $\\frac{3 + 4i}{5}$ has modulus $1$ but infinite order.\n\nFor $z = 2i$: $|z| = 2$, so the powers have moduli $2, 4, 8, \\dots$ and $\\langle 2i \\rangle$ is infinite. For $z = i$: $i^2 = -1$, $i^3 = -i$, $i^4 = 1$, so $\\langle i \\rangle$ has $4$ elements.\n\nCheck: $(2i)^4 = 16i^4 = 16 \\ne 1$, while $i^4 = 1$.\n\n> **Watch out.** Modulus $1$ is necessary but not enough: the argument must also be a rational multiple of $2\\pi$.",
        "若 $|z| \\ne 1$，则 $|z^k| = |z|^k$ 永远不回到 $1$，所以 $\\langle z \\rangle$ 无限。若 $|z| = 1$，则仅当 $z$ 的辐角是 $2\\pi$ 的有理数倍时 $\\langle z \\rangle$ 有限。例如 $\\frac{3 + 4i}{5}$ 的模为 $1$，但阶为无穷。\n\n对 $z = 2i$：$|z| = 2$，所以各次幂的模为 $2, 4, 8, \\dots$，$\\langle 2i \\rangle$ 无限。对 $z = i$：$i^2 = -1$，$i^3 = -i$，$i^4 = 1$，所以 $\\langle i \\rangle$ 有 $4$ 个元素。\n\n检验：$(2i)^4 = 16i^4 = 16 \\ne 1$，而 $i^4 = 1$。\n\n> **注意。** 模为 $1$ 是必要条件，但不充分：辐角还必须是 $2\\pi$ 的有理数倍。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const k = rng.int(2, 5);
        const unit = rng.pick(["\\frac{3 + 4i}{5}", "\\frac{5 + 12i}{13}", "\\frac{8 + 15i}{17}"]);
        const facts: Fact[] = [
          {
            prompt: t(
              `Is the cyclic subgroup of $\\mathbb{C}^*$ generated by $e^{2\\pi i / ${n}}$ finite?`,
              `$\\mathbb{C}^*$ 中由 $e^{2\\pi i / ${n}}$ 生成的循环子群有限吗？`,
            ),
            holds: true,
            reason: t(`It is a root of unity of order $${n}$.`, `它是 $${n}$ 阶单位根。`),
          },
          {
            prompt: t(
              `Is the cyclic subgroup of $\\mathbb{C}^*$ generated by $${k}e^{2\\pi i / ${n}}$ finite?`,
              `$\\mathbb{C}^*$ 中由 $${k}e^{2\\pi i / ${n}}$ 生成的循环子群有限吗？`,
            ),
            holds: false,
            reason: t(
              `Its modulus is $${k} \\ne 1$, so the moduli $${k}^m$ of its powers never repeat.`,
              `它的模为 $${k} \\ne 1$，所以它的幂的模 $${k}^m$ 互不相同。`,
            ),
          },
          {
            prompt: t(
              `Is the cyclic subgroup of $\\mathbb{C}^*$ generated by $e^{${k}i}$ finite?`,
              `$\\mathbb{C}^*$ 中由 $e^{${k}i}$ 生成的循环子群有限吗？`,
            ),
            holds: false,
            reason: t(
              `$e^{${k}mi} = 1$ would need $${k}m$ to be a multiple of $2\\pi$, impossible since $\\pi$ is irrational.`,
              `$e^{${k}mi} = 1$ 要求 $${k}m$ 是 $2\\pi$ 的倍数，由于 $\\pi$ 是无理数，这不可能。`,
            ),
          },
          {
            prompt: t(
              `Is the cyclic subgroup of $\\mathbb{C}^*$ generated by $${unit}$ finite?`,
              `$\\mathbb{C}^*$ 中由 $${unit}$ 生成的循环子群有限吗？`,
            ),
            holds: false,
            reason: t(
              "It has modulus $1$, but it is not a root of unity: its argument is not a rational multiple of $2\\pi$.",
              "它的模为 $1$，但不是单位根：它的辐角不是 $2\\pi$ 的有理数倍。",
            ),
          },
          {
            prompt: t(
              `Is the cyclic subgroup of $\\mathbb{C}^*$ generated by $\\frac{1}{${k}} + \\frac{1}{${k}}i$ finite?`,
              `$\\mathbb{C}^*$ 中由 $\\frac{1}{${k}} + \\frac{1}{${k}}i$ 生成的循环子群有限吗？`,
            ),
            holds: false,
            reason: t(`Its modulus is $\\frac{\\sqrt{2}}{${k}} \\ne 1$.`, `它的模为 $\\frac{\\sqrt{2}}{${k}} \\ne 1$。`),
          },
          {
            prompt: t(
              `Is the cyclic subgroup of $\\mathbb{C}^*$ generated by $\\cos \\frac{2\\pi}{${n}} - i \\sin \\frac{2\\pi}{${n}}$ finite?`,
              `$\\mathbb{C}^*$ 中由 $\\cos \\frac{2\\pi}{${n}} - i \\sin \\frac{2\\pi}{${n}}$ 生成的循环子群有限吗？`,
            ),
            holds: true,
            reason: t(
              `It is $e^{-2\\pi i / ${n}}$, a root of unity of order $${n}$.`,
              `它等于 $e^{-2\\pi i / ${n}}$，是 $${n}$ 阶单位根。`,
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
  ],
};

/** generatorsOfCyclicGroups counts and recognizes generators of ℤₙ. */
export const generatorsOfCyclicGroups: TopicDef = {
  id: "generators-of-cyclic-groups",
  title: t("Generators of Cyclic Groups", "循环群的生成元"),
  summary: t(
    "If G = ⟨g⟩ has order n, then gᵏ generates G exactly when gcd(k, n) = 1. So a cyclic group of order n has φ(n) generators; the generators of ℤₙ are the residues coprime to n. An infinite cyclic group has exactly two generators, g and g⁻¹.",
    "若 G = ⟨g⟩ 的阶为 n，则 gᵏ 生成 G 当且仅当 gcd(k, n) = 1。所以 n 阶循环群有 φ(n) 个生成元；ℤₙ 的生成元是与 n 互素的剩余。无限循环群恰有两个生成元 g 与 g⁻¹。",
  ),
  intro: t(
    "Which elements generate $\\mathbb{Z}_{10}$? An element $a$ generates exactly when $\\gcd(a, 10) = 1$, so the generators are $1, 3, 7, 9$: $\\varphi(10) = 4$ of them. The element $4$ is not one: $\\langle 4 \\rangle = \\{0, 4, 8, 2, 6\\}$ has only $5$ elements.\n\nCheck: the multiples of $3$ modulo $10$ are $3, 6, 9, 2, 5, 8, 1, 4, 7, 0$, all ten elements.\n\nIn this lesson we count the generators of cyclic groups and recognize the generators of $\\mathbb{Z}_n$.",
    "哪些元素生成 $\\mathbb{Z}_{10}$？元素 $a$ 是生成元当且仅当 $\\gcd(a, 10) = 1$，所以生成元为 $1, 3, 7, 9$，共 $\\varphi(10) = 4$ 个。$4$ 不是：$\\langle 4 \\rangle = \\{0, 4, 8, 2, 6\\}$ 只有 $5$ 个元素。\n\n检验：$3$ 模 $10$ 的倍数为 $3, 6, 9, 2, 5, 8, 1, 4, 7, 0$，恰是全部十个元素。\n\n本课我们数循环群的生成元，并识别 $\\mathbb{Z}_n$ 的生成元。",
  ),
  prerequisites: ["cyclic-subgroups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-generators-of-cyclic-groups",
      title: t("Counting generators", "数生成元"),
      explanation: t(
        "An element generates a cyclic group exactly when its exponent is coprime to the order, so the generators are counted by Euler's totient. $\\mathbb{Z}_{12}$ has $\\varphi(12) = 4$ generators: $1, 5, 7, 11$. A cyclic group of order $n$ written multiplicatively, $\\langle g \\rangle$, likewise has $\\varphi(n)$ generators $g^k$ with $\\gcd(k, n) = 1$.\n\nFor $\\mathbb{Z}_{18}$: $18 = 2 \\cdot 3^2$, so $\\varphi(18) = 18 \\cdot \\frac{1}{2} \\cdot \\frac{2}{3} = 6$, and the generators are $1, 5, 7, 11, 13, 17$.\n\nCheck: listing the numbers from $1$ to $17$ that are neither even nor multiples of $3$ gives exactly those $6$.\n\n> **Watch out.** Count the residues coprime to $n$, not the divisors of $n$: $18$ has $6$ divisors too, but they are $1, 2, 3, 6, 9, 18$, a different set that only happens to have the same size.",
        "一个元素生成循环群，当且仅当它的指数与群阶互素，所以生成元的个数由欧拉函数给出。$\\mathbb{Z}_{12}$ 有 $\\varphi(12) = 4$ 个生成元：$1, 5, 7, 11$。乘法记号下的 $n$ 阶循环群 $\\langle g \\rangle$ 同样有 $\\varphi(n)$ 个生成元 $g^k$，其中 $\\gcd(k, n) = 1$。\n\n对 $\\mathbb{Z}_{18}$：$18 = 2 \\cdot 3^2$，所以 $\\varphi(18) = 18 \\cdot \\frac{1}{2} \\cdot \\frac{2}{3} = 6$，生成元为 $1, 5, 7, 11, 13, 17$。\n\n检验：在 $1$ 到 $17$ 中列出既非偶数也非 $3$ 的倍数的数，恰好是这 $6$ 个。\n\n> **注意。** 要数与 $n$ 互素的剩余，而不是 $n$ 的因数：$18$ 也有 $6$ 个因数，但它们是 $1, 2, 3, 6, 9, 18$，是另一个集合，只是大小碰巧相同。",
      ),
      generate(rng) {
        const n = rng.int(6, 60);
        const value = phi(n);
        const coprime = units(n);
        const roots = rng.bool();
        return numberProblem({
          prompt: roots
            ? t(
                `How many elements generate the group of $${n}$th roots of unity under multiplication?`,
                `$${n}$ 次单位根在乘法下构成的群有多少个生成元？`,
              )
            : t(`How many generators does $\\mathbb{Z}_{${n}}$ have?`, `$\\mathbb{Z}_{${n}}$ 有多少个生成元？`),
          answer: value,
          mistakes: apart(value, [
            why(
              divisors(n).length,
              `This counts the divisors of $${n}$, which give the subgroups, not the generators.`,
              `这数的是 $${n}$ 的因数，它们对应子群，而不是生成元。`,
            ),
            why(
              n - 1,
              `Not every nonzero exponent gives a generator: only those coprime to $${n}$ do.`,
              `并不是每个非零指数都给出生成元：只有与 $${n}$ 互素的才行。`,
            ),
            why(
              1,
              "A cyclic group usually has several generators, one for each exponent coprime to its order.",
              "循环群通常有多个生成元，每个与群阶互素的指数对应一个。",
            ),
            why(
              n - value,
              `This counts the exponents that share a factor with $${n}$, the ones that do not generate.`,
              `这数的是与 $${n}$ 有公因数的指数，正是那些不能生成的。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Use the coprime exponents", "用互素的指数"],
                t(
                  `$g^k$ generates exactly when $\\gcd(k, ${n}) = 1$, for $0 \\le k < ${n}$.`,
                  `当 $0 \\le k < ${n}$ 时，$g^k$ 是生成元当且仅当 $\\gcd(k, ${n}) = 1$。`,
                ),
              ],
              [
                ["Count them", "计数"],
                t(
                  `These $k$ are $${coprime.join(", ")}$: $\\varphi(${n}) = ${value}$ of them.`,
                  `这些 $k$ 为 $${coprime.join(", ")}$：共 $\\varphi(${n}) = ${value}$ 个。`,
                ),
              ],
            ],
            t(
              `$${value}$ coprime exponents and $${n - value}$ others make up all $${n}$ exponents.`,
              `$${value}$ 个互素指数与其余 $${n - value}$ 个指数合起来，正好是全部 $${n}$ 个指数。`,
            ),
          ),
        });
      },
    },
    {
      id: "recognizing-generators-of-zn",
      title: t("Recognizing generators", "识别生成元"),
      explanation: t(
        "An element generates the whole group exactly when its multiples reach one, which happens when it shares no factor with the modulus. $a$ generates $\\mathbb{Z}_n$ exactly when $\\gcd(a, n) = 1$. In $\\mathbb{Z}_{20}$, $7$ is a generator but $8$ is not, since $\\gcd(8, 20) = 4$ and $\\langle 8 \\rangle$ has only $5$ elements.\n\nCheck: $3 \\cdot 7 = 21 \\equiv 1 \\pmod{20}$, so the multiples of $7$ reach $1$, and from $1$ they reach everything.\n\n> **Watch out.** An odd number need not be a generator: in $\\mathbb{Z}_{20}$, $15$ is odd but $\\gcd(15, 20) = 5$.",
        "一个元素生成整个群，当且仅当它的倍数能得到 1，这发生在它与模没有公因数的时候。$a$ 生成 $\\mathbb{Z}_n$ 当且仅当 $\\gcd(a, n) = 1$。在 $\\mathbb{Z}_{20}$ 中，$7$ 是生成元而 $8$ 不是，因为 $\\gcd(8, 20) = 4$，$\\langle 8 \\rangle$ 只有 $5$ 个元素。\n\n检验：$3 \\cdot 7 = 21 \\equiv 1 \\pmod{20}$，所以 $7$ 的倍数能得到 $1$，再由 $1$ 得到一切。\n\n> **注意。** 奇数不一定是生成元：在 $\\mathbb{Z}_{20}$ 中，$15$ 是奇数，但 $\\gcd(15, 20) = 5$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(12, 60);
        while (phi(n) === n - 1);
        const gens = units(n).filter((a) => a > 1);
        const non = range(2, n - 1).filter((a) => gcd(a, n) > 1);
        const right = rng.pick(gens);
        const others = rng.sample(non, 3);
        const inverse = units(n).find((x) => mod(x * right, n) === 1)!;
        return reasoned(
          texChoice(
            rng,
            t(`Which of these elements generates $\\mathbb{Z}_{${n}}$?`, `下列哪个元素生成 $\\mathbb{Z}_{${n}}$？`),
            `${right}`,
            others.map(String),
            walked(
              [
                [
                  ["Use the gcd test", "用最大公约数判别"],
                  t(
                    `$a$ generates $\\mathbb{Z}_{${n}}$ exactly when $\\gcd(a, ${n}) = 1$.`,
                    `$a$ 生成 $\\mathbb{Z}_{${n}}$ 当且仅当 $\\gcd(a, ${n}) = 1$。`,
                  ),
                ],
                [
                  ["Test the options", "检验选项"],
                  t(
                    `$\\gcd(${right}, ${n}) = 1$, while ${others.map((x) => `$\\gcd(${x}, ${n}) = ${gcd(x, n)}$`).join(", ")}.`,
                    `$\\gcd(${right}, ${n}) = 1$，而 ${others.map((x) => `$\\gcd(${x}, ${n}) = ${gcd(x, n)}$`).join("，")}。`,
                  ),
                ],
              ],
              t(
                `$${inverse} \\cdot ${right} = ${inverse * right} \\equiv 1 \\pmod{${n}}$, so the multiples of $${right}$ reach $1$.`,
                `$${inverse} \\cdot ${right} = ${inverse * right} \\equiv 1 \\pmod{${n}}$，所以 $${right}$ 的倍数能得到 $1$。`,
              ),
            ),
          ),
          others.map((x) => [
            `$${x}$`,
            `$\\gcd(${x}, ${n}) = ${gcd(x, n)}$, so $\\langle ${x} \\rangle$ has only $${n / gcd(x, n)}$ elements.`,
            `$\\gcd(${x}, ${n}) = ${gcd(x, n)}$，所以 $\\langle ${x} \\rangle$ 只有 $${n / gcd(x, n)}$ 个元素。`,
          ]),
        );
      },
    },
  ],
};

/** propertiesOfCyclicGroups counts subgroups and elements of each order in ℤₙ. */
export const propertiesOfCyclicGroups: TopicDef = {
  id: "properties-of-cyclic-groups",
  title: t("Properties of Cyclic Groups", "循环群的性质"),
  summary: t(
    "Every subgroup of a cyclic group is cyclic. In a cyclic group of order n there is exactly one subgroup of each order d dividing n, and no others, and exactly φ(d) elements of order d.",
    "循环群的每个子群都是循环群。在 n 阶循环群中，对 n 的每个因数 d 恰有一个 d 阶子群，没有其他子群，并且 d 阶元素恰有 φ(d) 个。",
  ),
  intro: t(
    "$\\mathbb{Z}_{18}$ has one subgroup for each divisor of $18$: the divisors $1, 2, 3, 6, 9, 18$ give $6$ subgroups, the one of order $d$ being $\\langle \\frac{18}{d} \\rangle$. Its elements of order $6$ generate the subgroup $\\langle 3 \\rangle$ of order $6$, so there are $\\varphi(6) = 2$ of them: $3$ and $15$.\n\nCheck: $6 \\cdot 15 = 90 = 5 \\cdot 18$, while $2 \\cdot 15 = 30$ and $3 \\cdot 15 = 45$ are not multiples of $18$, so $15$ has order $6$.\n\nIn this lesson we count the subgroups of cyclic groups and the elements of a given order.",
    "$\\mathbb{Z}_{18}$ 对 $18$ 的每个因数各有一个子群：因数 $1, 2, 3, 6, 9, 18$ 给出 $6$ 个子群，$d$ 阶子群为 $\\langle \\frac{18}{d} \\rangle$。它的 $6$ 阶元素生成 $6$ 阶子群 $\\langle 3 \\rangle$，所以共有 $\\varphi(6) = 2$ 个：$3$ 与 $15$。\n\n检验：$6 \\cdot 15 = 90 = 5 \\cdot 18$，而 $2 \\cdot 15 = 30$ 与 $3 \\cdot 15 = 45$ 都不是 $18$ 的倍数，所以 $15$ 的阶为 $6$。\n\n本课我们数循环群的子群以及给定阶的元素。",
  ),
  prerequisites: ["generators-of-cyclic-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-subgroups-of-cyclic-groups",
      title: t("Counting subgroups", "数子群"),
      explanation: t(
        "$\\mathbb{Z}_{12}$ has one subgroup for each divisor of $12$: orders $1, 2, 3, 4, 6, 12$, so $6$ subgroups. The subgroup of order $d$ is generated by $\\frac{12}{d}$.\n\nFor $\\mathbb{Z}_{20}$: the divisors of $20$ are $1, 2, 4, 5, 10, 20$, so $\\mathbb{Z}_{20}$ has $6$ subgroups, such as $\\langle 4 \\rangle = \\{0, 4, 8, 12, 16\\}$ of order $5$.\n\nCheck: $20 = 2^2 \\cdot 5$ has $(2 + 1)(1 + 1) = 6$ divisors.\n\n> **Watch out.** Count the trivial subgroup $\\{0\\}$ and the whole group too: they belong to the divisors $1$ and $n$.",
        "$\\mathbb{Z}_{12}$ 对 $12$ 的每个因数各有一个子群：阶为 $1, 2, 3, 4, 6, 12$，共 $6$ 个子群。$d$ 阶子群由 $\\frac{12}{d}$ 生成。\n\n对 $\\mathbb{Z}_{20}$：$20$ 的因数为 $1, 2, 4, 5, 10, 20$，所以 $\\mathbb{Z}_{20}$ 有 $6$ 个子群，例如 $5$ 阶子群 $\\langle 4 \\rangle = \\{0, 4, 8, 12, 16\\}$。\n\n检验：$20 = 2^2 \\cdot 5$ 有 $(2 + 1)(1 + 1) = 6$ 个因数。\n\n> **注意。** 平凡子群 $\\{0\\}$ 与整个群也要算上：它们对应因数 $1$ 与 $n$。",
      ),
      generate(rng) {
        const n = rng.int(6, 100);
        const ds = divisors(n);
        const proper = ds.length - 2;
        return numberProblem({
          prompt: t(`How many subgroups does $\\mathbb{Z}_{${n}}$ have?`, `$\\mathbb{Z}_{${n}}$ 有多少个子群？`),
          answer: ds.length,
          mistakes: apart(ds.length, [
            why(
              proper,
              `This leaves out the trivial subgroup and $\\mathbb{Z}_{${n}}$ itself.`,
              `这漏掉了平凡子群和 $\\mathbb{Z}_{${n}}$ 本身。`,
            ),
            why(
              ds.length - 1,
              "This leaves out one of the two subgroups at the ends: the trivial one or the whole group.",
              "这漏掉了两端的子群之一：平凡子群或整个群。",
            ),
            why(
              phi(n),
              `$\\varphi(${n})$ counts the generators of $\\mathbb{Z}_{${n}}$, not its subgroups.`,
              `$\\varphi(${n})$ 数的是 $\\mathbb{Z}_{${n}}$ 的生成元，而不是子群。`,
            ),
            why(
              ds.length + 1,
              "Each divisor gives exactly one subgroup; nothing extra is added.",
              "每个因数恰好对应一个子群，没有额外的。",
            ),
          ]),
          solution: walked(
            [
              [
                ["One subgroup per divisor", "每个因数一个子群"],
                t(
                  `$\\mathbb{Z}_{${n}}$ is cyclic, so it has exactly one subgroup of each order dividing $${n}$.`,
                  `$\\mathbb{Z}_{${n}}$ 是循环群，所以对 $${n}$ 的每个因数恰有一个该阶的子群。`,
                ),
              ],
              [
                ["List the divisors", "列出因数"],
                t(
                  `The divisors of $${n}$ are $${ds.join(", ")}$: $${ds.length}$ subgroups.`,
                  `$${n}$ 的因数为 $${ds.join(", ")}$：共 $${ds.length}$ 个子群。`,
                ),
              ],
            ],
            t(
              `Each divisor $d$ pairs with $\\frac{${n}}{d}$, which generates the subgroup of order $d$; the list runs from $1$ to $${n}$.`,
              `每个因数 $d$ 对应 $\\frac{${n}}{d}$，它生成 $d$ 阶子群；列表从 $1$ 到 $${n}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "counting-elements-of-a-given-order",
      title: t("Elements of a given order", "给定阶的元素"),
      explanation: t(
        "In $\\mathbb{Z}_{n}$, the elements of order $d$ (for $d$ dividing $n$) are the generators of the unique subgroup of order $d$, so there are $\\varphi(d)$ of them. $\\mathbb{Z}_{24}$ has $\\varphi(8) = 4$ elements of order $8$: $3, 9, 15, 21$.\n\nCheck: each of them is $3k$ with $k = 1, 3, 5, 7$ coprime to $8$, and for example $8 \\cdot 9 = 72 = 3 \\cdot 24$, while $4 \\cdot 9 = 36$ is not a multiple of $24$.\n\n> **Watch out.** Use $\\varphi(d)$ for the order $d$, not $\\varphi(n)$ for the group, and not $\\frac{n}{d}$, which is the generator of that subgroup.",
        "在 $\\mathbb{Z}_{n}$ 中，$d$ 阶元素（$d$ 整除 $n$）就是唯一的 $d$ 阶子群的生成元，所以共有 $\\varphi(d)$ 个。$\\mathbb{Z}_{24}$ 有 $\\varphi(8) = 4$ 个 $8$ 阶元素：$3, 9, 15, 21$。\n\n检验：它们都是 $3k$，$k = 1, 3, 5, 7$ 与 $8$ 互素；例如 $8 \\cdot 9 = 72 = 3 \\cdot 24$，而 $4 \\cdot 9 = 36$ 不是 $24$ 的倍数。\n\n> **注意。** 要用阶 $d$ 的 $\\varphi(d)$，而不是整个群的 $\\varphi(n)$，也不是 $\\frac{n}{d}$——那是该子群的生成元。",
      ),
      generate(rng) {
        let n: number;
        let ds: number[];
        do {
          n = rng.int(12, 100);
          ds = divisors(n).filter((d) => d > 2 && d < n);
        } while (ds.length === 0);
        const d = rng.pick(ds);
        const value = phi(d);
        return numberProblem({
          prompt: t(`How many elements of order $${d}$ does $\\mathbb{Z}_{${n}}$ have?`, `$\\mathbb{Z}_{${n}}$ 有多少个 $${d}$ 阶元素？`),
          answer: value,
          mistakes: apart(value, [
            why(
              phi(n),
              `$\\varphi(${n})$ counts the elements of order $${n}$, the generators of the whole group.`,
              `$\\varphi(${n})$ 数的是 $${n}$ 阶元素，即整个群的生成元。`,
            ),
            why(
              n / d,
              `$${n / d}$ generates the subgroup of order $${d}$; it is one element, not the count.`,
              `$${n / d}$ 生成 $${d}$ 阶子群；它是一个元素，而不是个数。`,
            ),
            why(
              d,
              `The subgroup of order $${d}$ has $${d}$ elements, but not all of them have order $${d}$.`,
              `$${d}$ 阶子群有 $${d}$ 个元素，但并非都是 $${d}$ 阶。`,
            ),
            why(1, "There is one subgroup of that order, but it has several generators.", "该阶的子群只有一个，但它有多个生成元。"),
          ]),
          solution: walked(
            [
              [
                ["Find the subgroup", "找出子群"],
                t(
                  `The unique subgroup of order $${d}$ is $\\langle ${n / d} \\rangle$, and every element of order $${d}$ lies in it.`,
                  `唯一的 $${d}$ 阶子群为 $\\langle ${n / d} \\rangle$，每个 $${d}$ 阶元素都在其中。`,
                ),
              ],
              [
                ["Count its generators", "数它的生成元"],
                t(
                  `The elements of order $${d}$ are its generators, so there are $\\varphi(${d}) = ${value}$.`,
                  `$${d}$ 阶元素就是它的生成元，所以有 $\\varphi(${d}) = ${value}$ 个。`,
                ),
              ],
            ],
            t(
              `They are $${units(d)
                .map((k) => k * (n / d))
                .join(", ")}$, the multiples $${n / d} \\cdot k$ with $\\gcd(k, ${d}) = 1$.`,
              `它们是 $${units(d)
                .map((k) => k * (n / d))
                .join(", ")}$，即满足 $\\gcd(k, ${d}) = 1$ 的倍数 $${n / d} \\cdot k$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** S3 is the symmetric group on three symbols with elements e, r, r², s, rs, r²s. */
const S3 = symmetricGroup3();

/** generatingSets finds the subgroups generated by sets of elements. */
export const generatingSets: TopicDef = {
  id: "generating-sets",
  title: t("Generating Sets", "生成集"),
  summary: t(
    "A subset S generates a group G if ⟨S⟩ = G, that is, every element of G is a product of elements of S and their inverses. In a finite group, ⟨S⟩ can be found by multiplying elements of S together until no new elements appear.",
    "若 ⟨S⟩ = G，即 G 的每个元素都是 S 中元素及其逆的乘积，则称子集 S 生成群 G。在有限群中，可以把 S 中的元素不断相乘，直到不再出现新元素，从而求出 ⟨S⟩。",
  ),
  intro: t(
    "Does $\\{4, 6\\}$ generate $\\mathbb{Z}_{12}$? Every combination $4m + 6n$ is even, so the two elements generate only $\\langle 2 \\rangle = \\{0, 2, 4, 6, 8, 10\\}$. Adding $3$ helps: $\\gcd(4, 6, 3) = 1$, so $\\{4, 6, 3\\}$ generates all of $\\mathbb{Z}_{12}$.\n\nCheck: $4 - 3 = 1$, and $1$ generates $\\mathbb{Z}_{12}$.\n\nIn this lesson we decide whether sets generate $\\mathbb{Z}_n$ and find the subgroups of $S_3$ generated by two elements.",
    "$\\{4, 6\\}$ 生成 $\\mathbb{Z}_{12}$ 吗？每个组合 $4m + 6n$ 都是偶数，所以这两个元素只生成 $\\langle 2 \\rangle = \\{0, 2, 4, 6, 8, 10\\}$。加上 $3$ 就行了：$\\gcd(4, 6, 3) = 1$，所以 $\\{4, 6, 3\\}$ 生成整个 $\\mathbb{Z}_{12}$。\n\n检验：$4 - 3 = 1$，而 $1$ 生成 $\\mathbb{Z}_{12}$。\n\n本课我们判断集合是否生成 $\\mathbb{Z}_n$，并求 $S_3$ 中由两个元素生成的子群。",
  ),
  prerequisites: ["properties-of-cyclic-groups", "cayley-tables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "generating-sets-of-zn",
      title: t("Generating sets of $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 的生成集"),
      explanation: t(
        "$\\{a, b\\}$ generates $\\mathbb{Z}_n$ exactly when $\\gcd(a, b, n) = 1$, even if neither element generates alone. In $\\mathbb{Z}_{30}$, $\\{6, 10\\}$ generates the subgroup $\\langle 2 \\rangle$ of order $15$, and $\\{6, 10, 15\\}$ generates all of $\\mathbb{Z}_{30}$.\n\nCheck: $6 + 10 - 15 = 1$, so $1$ is a combination of $6$, $10$ and $15$, and $1$ generates $\\mathbb{Z}_{30}$.\n\n> **Watch out.** Elements that are pairwise not coprime can still generate together: no two of $6$, $10$, $15$ are coprime, yet $\\gcd(6, 10, 15) = 1$.",
        "$\\{a, b\\}$ 生成 $\\mathbb{Z}_n$ 当且仅当 $\\gcd(a, b, n) = 1$，即使两者单独都不是生成元。在 $\\mathbb{Z}_{30}$ 中，$\\{6, 10\\}$ 生成 $15$ 阶子群 $\\langle 2 \\rangle$，$\\{6, 10, 15\\}$ 生成整个 $\\mathbb{Z}_{30}$。\n\n检验：$6 + 10 - 15 = 1$，所以 $1$ 是 $6$、$10$、$15$ 的组合，而 $1$ 生成 $\\mathbb{Z}_{30}$。\n\n> **注意。** 两两不互素的元素合起来仍可能生成整个群：$6$、$10$、$15$ 中任意两个都不互素，但 $\\gcd(6, 10, 15) = 1$。",
      ),
      generate(rng) {
        const n = rng.pick([30, 42, 60, 66, 70, 78, 84, 90, 105]);
        const ps = divisors(n).filter((d) => d > 1 && d < n);
        const gens = rng.sample(ps, 3);
        const d = gens.reduce((g, x) => gcd(g, x), n);
        return factProblem({
          prompt: t(
            `Does $\\{${gens.join(", ")}\\}$ generate $\\mathbb{Z}_{${n}}$?`,
            `$\\{${gens.join(", ")}\\}$ 生成 $\\mathbb{Z}_{${n}}$ 吗？`,
          ),
          holds: d === 1,
          reason:
            d === 1
              ? t(
                  `$\\gcd(${gens.join(", ")}, ${n}) = 1$, so some combination of them equals $1$, which generates $\\mathbb{Z}_{${n}}$.`,
                  `$\\gcd(${gens.join(", ")}, ${n}) = 1$，所以它们的某个组合等于 $1$，而 $1$ 生成 $\\mathbb{Z}_{${n}}$。`,
                )
              : t(
                  `Every element is a multiple of $${d}$, so they generate only $\\langle ${d} \\rangle$.`,
                  `每个元素都是 $${d}$ 的倍数，所以它们只生成 $\\langle ${d} \\rangle$。`,
                ),
        });
      },
    },
    {
      id: "subgroups-of-s3-generated-by-two-elements",
      figure: algebraDrawings1["generating-sets#subgroups-of-s3-generated-by-two-elements"],
      title: t("Generated subgroups of $S_3$", "$S_3$ 中生成的子群"),
      explanation: t(
        "In $S_3 = \\{e, r, r^2, s, rs, r^2s\\}$, where $r^3 = s^2 = e$ and $sr = r^2s$: $r$ generates $\\{e, r, r^2\\}$, $s$ generates $\\{e, s\\}$, and any rotation together with any reflection generates all of $S_3$.\n\nFor $\\langle s, rs \\rangle$: $(rs)s = r$, so the subgroup contains $r$ and $s$, and therefore all six elements.\n\nCheck: the lattice in the drawing shows the subgroups of $S_3$ with $1$, $2$, $3$ and $6$ elements; a subgroup containing two different reflections contains two of the subgroups of order $2$, and in the lattice only $S_3$ lies above more than one of them.\n\n> **Watch out.** Two elements of order $2$ do not generate a subgroup of order $4$: $4$ does not divide $6$, and here they generate the whole group.",
        "在 $S_3 = \\{e, r, r^2, s, rs, r^2s\\}$ 中（$r^3 = s^2 = e$，$sr = r^2s$）：$r$ 生成 $\\{e, r, r^2\\}$，$s$ 生成 $\\{e, s\\}$，任一旋转与任一反射一起生成整个 $S_3$。\n\n对 $\\langle s, rs \\rangle$：$(rs)s = r$，所以该子群含 $r$ 与 $s$，从而含全部六个元素。\n\n检验：图中的格展示了 $S_3$ 中元素个数为 $1$、$2$、$3$、$6$ 的子群；含两个不同反射的子群包含两个 $2$ 阶子群，而在格中只有 $S_3$ 位于不止一个 $2$ 阶子群之上。\n\n> **注意。** 两个 $2$ 阶元素不会生成 $4$ 阶子群：$4$ 不整除 $6$，这里它们生成的是整个群。",
      ),
      generate(rng) {
        const x = rng.int(1, 5);
        let y: number;
        do y = rng.int(0, 5);
        while (y === x);
        const sub = generated(S3, [x, y]);
        const L = S3.labels;
        return numberProblem({
          prompt: t(
            `In $S_3 = \\{e, r, r^2, s, rs, r^2s\\}$, where $r^3 = s^2 = e$ and $sr = r^2s$, how many elements does the subgroup $\\langle ${L[x]}, ${L[y]} \\rangle$ have?`,
            `在 $S_3 = \\{e, r, r^2, s, rs, r^2s\\}$ 中（$r^3 = s^2 = e$，$sr = r^2s$），子群 $\\langle ${L[x]}, ${L[y]} \\rangle$ 有多少个元素？`,
          ),
          answer: sub.length,
          mistakes: apart(sub.length, [
            why(
              4,
              "No subgroup of $S_3$ has $4$ elements: the size of a subgroup must divide $6$.",
              "$S_3$ 没有 $4$ 个元素的子群：子群的大小必须整除 $6$。",
            ),
            why(
              3,
              "This counts the identity and the two generators, but their products can give more.",
              "这数了单位元和两个生成元，但它们的乘积可能给出更多元素。",
            ),
            why(
              6,
              "Not every pair generates $S_3$: two rotations, or an element with $e$, stay inside a smaller subgroup.",
              "并不是每一对都生成 $S_3$：两个旋转，或某元素与 $e$，都停留在更小的子群中。",
            ),
            why(
              2,
              "A subgroup of $2$ elements is generated by a single reflection, possibly with $e$.",
              "$2$ 个元素的子群由单个反射生成（可能再加上 $e$）。",
            ),
          ]),
          solution: walked(
            [
              [["Start", "起步"], t(`Begin with $e$, $${L[x]}$ and $${L[y]}$.`, `从 $e$、$${L[x]}$ 与 $${L[y]}$ 开始。`)],
              [
                ["Multiply until closed", "相乘直到封闭"],
                t(
                  `Multiplying until no new elements appear gives $\\{${sub.map((i) => L[i]).join(", ")}\\}$: $${sub.length}$ elements.`,
                  `不断相乘直到不再出现新元素，得到 $\\{${sub.map((i) => L[i]).join(", ")}\\}$：共 $${sub.length}$ 个元素。`,
                ),
              ],
            ],
            t(
              `$${sub.length}$ divides $6 = |S_3|$, and it is one of the sizes $1, 2, 3, 6$ in the lattice of $S_3$.`,
              `$${sub.length}$ 整除 $6 = |S_3|$，并且是 $S_3$ 子群格中的大小 $1, 2, 3, 6$ 之一。`,
            ),
          ),
        });
      },
    },
  ],
};

/** Letter is a generator a or b of a free group with exponent ±1. */
type Letter = readonly ["a" | "b", 1 | -1];

/** reduceWord cancels adjacent inverse pairs until none remain. */
function reduceWord(w: readonly Letter[]): Letter[] {
  const out: Letter[] = [];
  for (const l of w) {
    const top = out[out.length - 1];
    if (top && top[0] === l[0] && top[1] === -l[1]) out.pop();
    else out.push(l);
  }
  return out;
}

/** wordTex writes a word, collecting runs of a letter into powers. */
function wordTex(w: readonly Letter[]): string {
  if (w.length === 0) return "e";
  const runs: [string, number][] = [];
  for (const [x, e] of w) {
    const last = runs[runs.length - 1];
    if (last && last[0] === x && Math.sign(last[1]) === e) last[1] += e;
    else runs.push([x, e]);
  }
  return runs.map(([x, e]) => (e === 1 ? x : `${x}^{${e}}`)).join("");
}

/** randomWord builds a random word of length n in a, b and their inverses. */
const randomWord = (rng: Rng, n: number): Letter[] => range(1, n).map(() => [rng.pick(["a", "b"] as const), rng.pick([1, -1] as const)]);

/** freeGroups reduces and multiplies words in the free group on two generators. */
export const freeGroups: TopicDef = {
  id: "free-groups",
  title: t("Free Groups", "自由群"),
  summary: t(
    "The free group F(a, b) consists of the reduced words in a, b, a⁻¹ and b⁻¹: words with no letter next to its inverse. Words are multiplied by writing them one after the other and cancelling adjacent inverse pairs. Distinct reduced words are distinct elements: no relations hold beyond the group axioms.",
    "自由群 F(a, b) 由 a、b、a⁻¹、b⁻¹ 组成的既约字构成：既约字中没有字母与它的逆相邻。字的乘法是把它们依次写下并消去相邻的互逆对。不同的既约字是不同的元素：除群公理外不成立任何关系。",
  ),
  intro: t(
    "In $F(a, b)$, multiply $ab^{-1}a$ by $a^{-1}ba$: write them side by side as $ab^{-1}aa^{-1}ba$, cancel $aa^{-1}$ to get $ab^{-1}ba$, then cancel $b^{-1}b$ to get $aa = a^2$.\n\nCheck: the six letters lost two cancelled pairs, and $6 - 2 \\cdot 2 = 2$ letters remain, as in $a^2$.\n\nIn this lesson we reduce words in free groups and find their inverses.",
    "在 $F(a, b)$ 中，把 $ab^{-1}a$ 乘以 $a^{-1}ba$：并排写成 $ab^{-1}aa^{-1}ba$，消去 $aa^{-1}$ 得 $ab^{-1}ba$，再消去 $b^{-1}b$ 得 $aa = a^2$。\n\n检验：六个字母消去了两对，剩下 $6 - 2 \\cdot 2 = 2$ 个字母，正是 $a^2$。\n\n本课我们约化自由群中的字，并求它们的逆。",
  ),
  prerequisites: ["generating-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "reducing-words-in-free-groups",
      title: t("Reducing words", "约化字"),
      explanation: t(
        "Cancel adjacent pairs $xx^{-1}$ and $x^{-1}x$ repeatedly. $ab^{-1}ba^{2}b^{-1}$ becomes $aa^{2}b^{-1} = a^{3}b^{-1}$, a reduced word of length $4$. The order of cancellation does not matter.\n\nFor $aba^{-1}ab^{-1}b$: cancel $a^{-1}a$ to get $abb^{-1}b$, then cancel $bb^{-1}$ to get $ab$, which has $2$ letters.\n\nCheck: cancelling $b^{-1}b$ at the end first gives $aba^{-1}a$, then $ab$ again, and each cancellation removes exactly $2$ letters: $6 - 2 \\cdot 2 = 2$.\n\n> **Watch out.** After one cancellation, look again: new inverse pairs can become adjacent, as $bb^{-1}$ did above.",
        "反复消去相邻的 $xx^{-1}$ 与 $x^{-1}x$。$ab^{-1}ba^{2}b^{-1}$ 化为 $aa^{2}b^{-1} = a^{3}b^{-1}$，是长度为 $4$ 的既约字。消去的顺序不影响结果。\n\n对 $aba^{-1}ab^{-1}b$：消去 $a^{-1}a$ 得 $abb^{-1}b$，再消去 $bb^{-1}$ 得 $ab$，共 $2$ 个字母。\n\n检验：先消去末尾的 $b^{-1}b$ 得 $aba^{-1}a$，再得 $ab$，结果相同；每次消去恰好去掉 $2$ 个字母：$6 - 2 \\cdot 2 = 2$。\n\n> **注意。** 消去一次之后要再看一遍：新的互逆对可能变得相邻，如上面的 $bb^{-1}$。",
      ),
      generate(rng) {
        let w: Letter[];
        let r: Letter[];
        do {
          w = randomWord(rng, rng.int(7, 11));
          r = reduceWord(w);
        } while (r.length === w.length);
        const letters = w.map(([x, e]) => (e === 1 ? x : `${x}^{-1}`)).join("");
        return numberProblem({
          prompt: t(
            `In the free group $F(a, b)$, how many letters does the reduced form of $${letters}$ have?`,
            `在自由群 $F(a, b)$ 中，$${letters}$ 的既约形式有多少个字母？`,
          ),
          answer: r.length,
          mistakes: apart(r.length, [
            why(w.length, "This is the length before any cancellation.", "这是消去之前的长度。"),
            why(
              r.length + 2,
              "One inverse pair was left in place; after each cancellation, look again for pairs that became adjacent.",
              "还留下了一对互逆字母；每次消去之后，要再找新变得相邻的互逆对。",
            ),
            why(
              Math.abs(r.length - 2),
              "One pair too many was cancelled: only a letter next to its own inverse cancels.",
              "多消去了一对：只有与自身的逆相邻的字母才能消去。",
            ),
            why(
              w.length - 2,
              "Only the first inverse pair was cancelled; keep going until none is left.",
              "只消去了第一对互逆字母；要一直消到一对也不剩。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Cancel pairs", "消去互逆对"],
                t(
                  `Cancel adjacent pairs $xx^{-1}$ and $x^{-1}x$ in $${letters}$, looking again after each one.`,
                  `在 $${letters}$ 中消去相邻的 $xx^{-1}$ 与 $x^{-1}x$，每次之后再看一遍。`,
                ),
              ],
              [
                ["Count", "计数"],
                t(`What remains is $${wordTex(r)}$, which has $${r.length}$ letters.`, `剩下 $${wordTex(r)}$，共 $${r.length}$ 个字母。`),
              ],
            ],
            t(
              `$${(w.length - r.length) / 2}$ pairs were cancelled, and $${w.length} - 2 \\cdot ${(w.length - r.length) / 2} = ${r.length}$; no letter of $${wordTex(r)}$ stands next to its inverse.`,
              `共消去 $${(w.length - r.length) / 2}$ 对，$${w.length} - 2 \\cdot ${(w.length - r.length) / 2} = ${r.length}$；$${wordTex(r)}$ 中没有字母与它的逆相邻。`,
            ),
          ),
        });
      },
    },
    {
      id: "inverses-in-free-groups",
      title: t("Inverses of words", "字的逆"),
      explanation: t(
        "To undo a product, undo its last factor first, so the inverse of a word reverses the order and inverts each letter. The inverse of a product is the product of the inverses in reverse order: $(a^2b^{-1}a)^{-1} = a^{-1}ba^{-2}$.\n\nFor $ab^2a^{-1}$: reversing gives the letters $a^{-1}, b, b, a$, and inverting each gives $(ab^2a^{-1})^{-1} = ab^{-2}a^{-1}$.\n\nCheck: $ab^2a^{-1} \\cdot ab^{-2}a^{-1} = ab^2b^{-2}a^{-1} = aa^{-1} = e$.\n\n> **Watch out.** Inverting the letters without reversing them is wrong in a non-abelian group: $a^{-1}b^{-1}$ is not the inverse of $ab$, since $ab \\cdot a^{-1}b^{-1}$ does not reduce to $e$.",
        "要撤销一个乘积，先撤销最后一个因子，所以一个词的逆把顺序反过来并把每个字母取逆。乘积的逆是各因子的逆按相反顺序相乘：$(a^2b^{-1}a)^{-1} = a^{-1}ba^{-2}$。\n\n对 $ab^2a^{-1}$：倒序得字母 $a^{-1}, b, b, a$，再逐个取逆得 $(ab^2a^{-1})^{-1} = ab^{-2}a^{-1}$。\n\n检验：$ab^2a^{-1} \\cdot ab^{-2}a^{-1} = ab^2b^{-2}a^{-1} = aa^{-1} = e$。\n\n> **注意。** 在非阿贝尔群中，只取逆而不倒序是错的：$a^{-1}b^{-1}$ 不是 $ab$ 的逆，因为 $ab \\cdot a^{-1}b^{-1}$ 约化不到 $e$。",
      ),
      generate(rng) {
        let w: Letter[];
        // A word that reads the same backward would make two of the options coincide.
        do w = reduceWord(randomWord(rng, rng.int(5, 8)));
        while (w.length < 4 || wordTex(w) === wordTex([...w].reverse()));
        const inv = [...w].reverse().map(([x, e]) => [x, -e] as Letter);
        const noReverse = w.map(([x, e]) => [x, -e] as Letter);
        const noInvert = [...w].reverse();
        return reasoned(
          texChoice(
            rng,
            t(`In the free group $F(a, b)$, what is $(${wordTex(w)})^{-1}$?`, `在自由群 $F(a, b)$ 中，$(${wordTex(w)})^{-1}$ 是什么？`),
            wordTex(inv),
            [wordTex(noReverse), wordTex(noInvert), wordTex(w)],
            walked(
              [
                [
                  ["Reverse", "倒序"],
                  t(
                    `Write the letters of $${wordTex(w)}$ in reverse order: $${wordTex(noInvert)}$.`,
                    `把 $${wordTex(w)}$ 的字母倒序写出：$${wordTex(noInvert)}$。`,
                  ),
                ],
                [["Invert each letter", "逐个取逆"], t(`Invert each letter: $${wordTex(inv)}$.`, `把每个字母取逆：$${wordTex(inv)}$。`)],
              ],
              t(
                `Multiplying $${wordTex(w)}$ by $${wordTex(inv)}$ cancels the letters in pairs from the middle outward and leaves $e$.`,
                `$${wordTex(w)}$ 乘以 $${wordTex(inv)}$ 时，字母从中间向外成对消去，最后剩下 $e$。`,
              ),
            ),
          ),
          [
            [
              `$${wordTex(noReverse)}$`,
              "This inverts each letter but keeps the order; the last letter must be undone first.",
              "这把每个字母取逆却保留了顺序；最后一个字母必须最先撤销。",
            ],
            [`$${wordTex(noInvert)}$`, "This reverses the order but does not invert the letters.", "这把顺序倒过来了，却没有把字母取逆。"],
            [
              `$${wordTex(w)}$`,
              "This is the word itself; a reduced word that is not $e$ is never its own inverse in a free group.",
              "这是原字本身；在自由群中，不等于 $e$ 的既约字从来不是自己的逆。",
            ],
          ],
        );
      },
    },
  ],
};

/** exponentSum is the total exponent of a letter in a word. */
const exponentSum = (w: readonly Letter[], x: "a" | "b") => w.filter((l) => l[0] === x).reduce((s, l) => s + l[1], 0);

/** universalPropertyOfFreeGroups evaluates homomorphisms from free groups. */
export const universalPropertyOfFreeGroups: TopicDef = {
  id: "universal-property-of-free-groups",
  title: t("Universal Property of Free Groups", "自由群的泛性质"),
  summary: t(
    "For any group G and any elements g, h of G, there is exactly one homomorphism φ: F(a, b) → G with φ(a) = g and φ(b) = h: replace each letter of a word by its image and multiply in G. So every group generated by two elements is a quotient of F(a, b).",
    "对任意群 G 及其中任意元素 g、h，恰有一个同态 φ: F(a, b) → G 满足 φ(a) = g、φ(b) = h：把字中每个字母换成它的像，再在 G 中相乘。所以每个由两个元素生成的群都是 F(a, b) 的商群。",
  ),
  intro: t(
    "Let $\\varphi: F(a, b) \\to \\mathbb{Z}_5$ send $a$ to $3$ and $b$ to $1$. Then $\\varphi(a^2b^{-1}a) = 3 + 3 - 1 + 3 = 8 \\equiv 3$: replace each letter by its image, with an inverse letter giving the negative, and add.\n\nCheck: the exponents of $a$ add up to $3$ and those of $b$ to $-1$, and $3 \\cdot 3 - 1 = 8 \\equiv 3 \\pmod 5$.\n\nIn this lesson we evaluate homomorphisms from free groups to $\\mathbb{Z}_n$ and to $S_3$.",
    "设 $\\varphi: F(a, b) \\to \\mathbb{Z}_5$ 把 $a$ 映到 $3$、$b$ 映到 $1$。则 $\\varphi(a^2b^{-1}a) = 3 + 3 - 1 + 3 = 8 \\equiv 3$：把每个字母换成它的像（逆字母取相反数）再相加。\n\n检验：$a$ 的指数和为 $3$，$b$ 的指数和为 $-1$，而 $3 \\cdot 3 - 1 = 8 \\equiv 3 \\pmod 5$。\n\n本课我们计算从自由群到 $\\mathbb{Z}_n$ 与 $S_3$ 的同态的值。",
  ),
  prerequisites: ["free-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "homomorphisms-from-free-groups-to-zn",
      title: t("Maps to $\\mathbb{Z}_n$", "到 $\\mathbb{Z}_n$ 的映射"),
      explanation: t(
        "If $\\varphi(a) = 2$ and $\\varphi(b) = 5$ in $\\mathbb{Z}_7$, then $\\varphi(a^3b^{-1}a^{-1}) = 3 \\cdot 2 - 5 - 2 = -1 \\equiv 6$. Since $\\mathbb{Z}_n$ is abelian, only the total exponent of each letter matters.\n\nCheck: letter by letter, $2 + 2 + 2 - 5 - 2 = -1$, and $-1 + 7 = 6$ lies between $0$ and $6$.\n\n> **Watch out.** An inverse letter contributes the negative of its image: $\\varphi(b^{-1}) = -5$, not $5$.",
        "若在 $\\mathbb{Z}_7$ 中 $\\varphi(a) = 2$、$\\varphi(b) = 5$，则 $\\varphi(a^3b^{-1}a^{-1}) = 3 \\cdot 2 - 5 - 2 = -1 \\equiv 6$。由于 $\\mathbb{Z}_n$ 是阿贝尔群，只有每个字母的指数和起作用。\n\n检验：逐个字母相加，$2 + 2 + 2 - 5 - 2 = -1$，而 $-1 + 7 = 6$ 在 $0$ 到 $6$ 之间。\n\n> **注意。** 逆字母贡献的是其像的相反数：$\\varphi(b^{-1}) = -5$，而不是 $5$。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(5, 13);
          const g = rng.int(1, n - 1);
          const h = rng.int(1, n - 1);
          let w: Letter[];
          do w = reduceWord(randomWord(rng, rng.int(6, 10)));
          while (w.length < 4);
          const [ea, eb] = [exponentSum(w, "a"), exponentSum(w, "b")];
          const value = mod(ea * g + eb * h, n);
          const [ca, cb] = [w.filter((l) => l[0] === "a").length, w.filter((l) => l[0] === "b").length];
          const mistakes = apart(value, [
            why(
              mod(ca * g + cb * h, n),
              "This counts every letter as $+1$; an inverse letter contributes the negative of its image.",
              "这把每个字母都算作 $+1$；逆字母贡献的是其像的相反数。",
            ),
            why(
              mod(ea * h + eb * g, n),
              `This swaps the images: $\\varphi(a) = ${g}$ and $\\varphi(b) = ${h}$.`,
              `这把像弄反了：$\\varphi(a) = ${g}$，$\\varphi(b) = ${h}$。`,
            ),
            why(mod(Math.abs(ea) * g + Math.abs(eb) * h, n), "A negative exponent sum must stay negative.", "负的指数和必须保持为负。"),
            why(ea * g + eb * h, `The value must be reduced to lie between $0$ and $${n - 1}$.`, `结果必须化到 $0$ 与 $${n - 1}$ 之间。`),
          ]);
          if (mistakes.length < 2) continue;
          const sum = ea * g + eb * h;
          return numberProblem({
            prompt: t(
              `$\\varphi: F(a, b) \\to \\mathbb{Z}_{${n}}$ is the homomorphism with $\\varphi(a) = ${g}$ and $\\varphi(b) = ${h}$. Find $\\varphi(${wordTex(w)})$, between $0$ and $${n - 1}$.`,
              `$\\varphi: F(a, b) \\to \\mathbb{Z}_{${n}}$ 是满足 $\\varphi(a) = ${g}$、$\\varphi(b) = ${h}$ 的同态。求 $\\varphi(${wordTex(w)})$，取 $0$ 到 $${n - 1}$ 之间的值。`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["Add the exponents", "求指数和"],
                  t(
                    `The exponents of $a$ add up to $${ea}$ and those of $b$ to $${eb}$.`,
                    `$a$ 的指数和为 $${ea}$，$b$ 的指数和为 $${eb}$。`,
                  ),
                ],
                [
                  ["Apply the images", "代入像"],
                  t(
                    `$\\varphi = ${ea} \\cdot ${g} + ${eb < 0 ? `(${eb})` : eb} \\cdot ${h} = ${sum} \\equiv ${value} \\pmod{${n}}$.`,
                    `$\\varphi = ${ea} \\cdot ${g} + ${eb < 0 ? `(${eb})` : eb} \\cdot ${h} = ${sum} \\equiv ${value} \\pmod{${n}}$。`,
                  ),
                ],
              ],
              t(
                `$${sum} - ${value} = ${sum - value}$ is a multiple of $${n}$, and $${value}$ lies between $0$ and $${n - 1}$.`,
                `$${sum} - ${value} = ${sum - value}$ 是 $${n}$ 的倍数，且 $${value}$ 在 $0$ 与 $${n - 1}$ 之间。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "homomorphisms-from-free-groups-to-s3",
      title: t("Maps to $S_3$", "到 $S_3$ 的映射"),
      explanation: t(
        "A homomorphism from a free group is fixed by where the generators go, and the image of a word is the product of their images in the same order. In a non-abelian group the order of the letters matters. With $\\varphi(a) = r$ and $\\varphi(b) = s$ in $S_3$, $\\varphi(ab) = rs$ but $\\varphi(ba) = sr = r^2s$.\n\nFor $\\varphi(a^{-1}b)$ with the same images: $\\varphi(a^{-1}) = r^{-1} = r^2$, so $\\varphi(a^{-1}b) = r^2s$.\n\nCheck: $\\varphi(a) \\cdot \\varphi(a^{-1}b) = r \\cdot r^2s = r^3s = s = \\varphi(b)$, as it must be, since $a \\cdot a^{-1}b = b$.\n\n> **Watch out.** Keep the letters in their order: multiplying the images in reverse order gives $\\varphi$ of the reversed word, which is usually different.",
        "从自由群出发的同态由生成元的去向决定，一个词的像就是生成元的像按相同顺序的乘积。在非阿贝尔群中字母的顺序很重要。若在 $S_3$ 中 $\\varphi(a) = r$、$\\varphi(b) = s$，则 $\\varphi(ab) = rs$，而 $\\varphi(ba) = sr = r^2s$。\n\n在同样的像下求 $\\varphi(a^{-1}b)$：$\\varphi(a^{-1}) = r^{-1} = r^2$，所以 $\\varphi(a^{-1}b) = r^2s$。\n\n检验：$\\varphi(a) \\cdot \\varphi(a^{-1}b) = r \\cdot r^2s = r^3s = s = \\varphi(b)$，这是必然的，因为 $a \\cdot a^{-1}b = b$。\n\n> **注意。** 保持字母的顺序：把像倒序相乘，得到的是倒序字的像，通常不同。",
      ),
      generate(rng) {
        const g = rng.int(1, 5);
        let h: number;
        do h = rng.int(1, 5);
        while (h === g);
        let w: Letter[];
        do w = reduceWord(randomWord(rng, rng.int(3, 5)));
        while (w.length < 3);
        const inv = (x: number) => range(0, 5).find((y) => S3.op(x, y) === 0)!;
        const img = (l: Letter) => (l[1] === 1 ? (l[0] === "a" ? g : h) : inv(l[0] === "a" ? g : h));
        const value = w.reduce((acc, l) => S3.op(acc, img(l)), 0);
        const reversed = [...w].reverse().reduce((acc, l) => S3.op(acc, img(l)), 0);
        const noInverse = w.reduce((acc, l) => S3.op(acc, l[0] === "a" ? g : h), 0);
        const swapped = w.reduce((acc, l) => S3.op(acc, img([l[0] === "a" ? "b" : "a", l[1]])), 0);
        const L = S3.labels;
        const images = w.map((l) => L[img(l)]!);
        const running: string[] = [];
        w.reduce((acc, l) => {
          const next = S3.op(acc, img(l));
          running.push(L[next]!);
          return next;
        }, 0);
        const said = new Set<number>([value]);
        const reasons: [string, string, string][] = [];
        const add = (x: number, en: string, zh: string) => {
          if (said.has(x)) return;
          said.add(x);
          reasons.push([`$${L[x]}$`, en, zh]);
        };
        add(
          reversed,
          "This multiplies the images in reverse order; in $S_3$ the order matters.",
          "这把像倒序相乘了；在 $S_3$ 中顺序很重要。",
        );
        add(
          noInverse,
          "This uses the image of $a$ or $b$ for an inverse letter; an inverse letter maps to the inverse image.",
          "这对逆字母用了 $a$ 或 $b$ 的像；逆字母应映到像的逆。",
        );
        add(
          swapped,
          `This swaps the images: $\\varphi(a) = ${L[g]}$ and $\\varphi(b) = ${L[h]}$.`,
          `这把像弄反了：$\\varphi(a) = ${L[g]}$，$\\varphi(b) = ${L[h]}$。`,
        );
        for (let x = 0; x < 6; x++)
          add(
            x,
            `Multiplying the images letter by letter from left to right gives $${L[value]}$, not this.`,
            `把像逐个字母从左到右相乘得到 $${L[value]}$，而不是这个。`,
          );
        return reasoned(
          texChoice(
            rng,
            t(
              `In $S_3 = \\{e, r, r^2, s, rs, r^2s\\}$, where $r^3 = s^2 = e$ and $sr = r^2s$, let $\\varphi: F(a, b) \\to S_3$ be the homomorphism with $\\varphi(a) = ${L[g]}$ and $\\varphi(b) = ${L[h]}$. Find $\\varphi(${wordTex(w)})$.`,
              `在 $S_3 = \\{e, r, r^2, s, rs, r^2s\\}$ 中（$r^3 = s^2 = e$，$sr = r^2s$），设 $\\varphi: F(a, b) \\to S_3$ 是满足 $\\varphi(a) = ${L[g]}$、$\\varphi(b) = ${L[h]}$ 的同态。求 $\\varphi(${wordTex(w)})$。`,
            ),
            L[value]!,
            [L[reversed]!, L[noInverse]!, L[swapped]!, ...rng.shuffle([...L])],
            walked(
              [
                [
                  ["Replace the letters", "替换字母"],
                  t(`The letters map, in order, to $${images.join(", ")}$.`, `各字母依次映到 $${images.join(", ")}$。`),
                ],
                [
                  ["Multiply from left to right", "从左到右相乘"],
                  t(
                    `The running products are $${running.join(", ")}$, so the result is $${L[value]}$.`,
                    `逐步的乘积为 $${running.join(", ")}$，所以结果为 $${L[value]}$。`,
                  ),
                ],
              ],
              t(
                `Multiplying $${L[value]}$ on the right by the inverses of the images, last letter first, steps back through $${[...running].reverse().slice(1).join(", ")}${running.length > 1 ? ", " : ""}e$.`,
                `把 $${L[value]}$ 从右边依次乘以各像的逆（从最后一个字母开始），会倒着经过 $${[...running].reverse().slice(1).join(", ")}${running.length > 1 ? ", " : ""}e$。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
  ],
};

/** presentationsOfGroups finds orders of presented groups and simplifies words using relations. */
export const presentationsOfGroups: TopicDef = {
  id: "presentations-of-groups",
  title: t("Presentations of Groups", "群的表示"),
  summary: t(
    "A presentation ⟨generators | relations⟩ describes the group generated by the generators in which the relations, and their consequences, hold. ⟨a | aⁿ = e⟩ is cyclic of order n; ⟨a, b | aᵐ = bⁿ = e, ab = ba⟩ has order mn; ⟨r, s | rⁿ = s² = e, srs = r⁻¹⟩ is the dihedral group of order 2n.",
    "表示 ⟨生成元 | 关系⟩ 描述由生成元生成、并满足这些关系（及其推论）的群。⟨a | aⁿ = e⟩ 是 n 阶循环群；⟨a, b | aᵐ = bⁿ = e, ab = ba⟩ 的阶为 mn；⟨r, s | rⁿ = s² = e, srs = r⁻¹⟩ 是 2n 阶二面体群。",
  ),
  intro: t(
    "In $\\langle r, s \\mid r^4 = s^2 = e, srs = r^{-1} \\rangle$, simplify $r s r^3$: moving $s$ to the right past $r^3$ inverts it, so $r s r^3 = r r^{-3} s = r^{-2} s = r^2 s$. Every element can be brought to the form $r^i$ or $r^i s$ with $0 \\le i < 4$, so the group has $8$ elements.\n\nCheck: $r^{-2} = r^{-2} r^4 = r^2$, since $r^4 = e$.\n\nIn this lesson we find the orders of groups given by presentations and simplify words using their relations.",
    "在 $\\langle r, s \\mid r^4 = s^2 = e, srs = r^{-1} \\rangle$ 中化简 $r s r^3$：把 $s$ 右移越过 $r^3$ 会使它取逆，所以 $r s r^3 = r r^{-3} s = r^{-2} s = r^2 s$。每个元素都能化为 $r^i$ 或 $r^i s$（$0 \\le i < 4$），所以该群有 $8$ 个元素。\n\n检验：由于 $r^4 = e$，$r^{-2} = r^{-2} r^4 = r^2$。\n\n本课我们求由表示给出的群的阶，并用关系化简字。",
  ),
  prerequisites: ["universal-property-of-free-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orders-of-presented-groups",
      title: t("Orders of presented groups", "被表示群的阶"),
      explanation: t(
        "In $\\langle a, b \\mid a^4 = b^3 = e, ab = ba \\rangle$ every element can be written $a^ib^j$ with $0 \\le i < 4$, $0 \\le j < 3$, so the order is $12$. In $\\langle r, s \\mid r^5 = s^2 = e, srs = r^{-1} \\rangle$ every element is $r^i$ or $r^is$, giving $10$ elements.\n\nCheck: in the first group the $12$ words $a^ib^j$ are all different, since $\\mathbb{Z}_4 \\times \\mathbb{Z}_3$ satisfies the relations and gives them $12$ different values; in the second, the rotations and reflections of a regular pentagon satisfy the relations and give $10$ different symmetries.\n\n> **Watch out.** A presentation can collapse more than it seems: listing words only gives an upper bound, so check that some group with that many elements satisfies the relations.",
        "在 $\\langle a, b \\mid a^4 = b^3 = e, ab = ba \\rangle$ 中，每个元素都可写成 $a^ib^j$（$0 \\le i < 4$，$0 \\le j < 3$），所以阶为 $12$。在 $\\langle r, s \\mid r^5 = s^2 = e, srs = r^{-1} \\rangle$ 中，每个元素都是 $r^i$ 或 $r^is$，共 $10$ 个元素。\n\n检验：在第一个群中，$12$ 个字 $a^ib^j$ 互不相同，因为 $\\mathbb{Z}_4 \\times \\mathbb{Z}_3$ 满足这些关系，并给它们 $12$ 个不同的值；在第二个群中，正五边形的旋转与反射满足这些关系，给出 $10$ 个不同的对称。\n\n> **注意。** 一个表示可能比看上去塌缩得更多：列出字只给出上界，还要验证有某个那么多元素的群满足这些关系。",
      ),
      generate(rng) {
        const m = rng.int(2, 12);
        const n = rng.int(2, 9);
        const kind = rng.int(0, 2);
        const powers = m === 2 ? "e, a" : m === 3 ? "e, a, a^{2}" : `e, a, \\dots, a^{${m - 1}}`;
        const [tex, value, how] =
          kind === 0
            ? [
                `\\langle a \\mid a^{${m}} = e \\rangle`,
                m,
                t(`It is cyclic, with elements $${powers}$.`, `它是循环群，元素为 $${powers}$。`),
              ]
            : kind === 1
              ? [
                  `\\langle a, b \\mid a^{${m}} = b^{${n}} = e, ab = ba \\rangle`,
                  m * n,
                  t(
                    `Every element is $a^ib^j$ with $0 \\le i < ${m}$ and $0 \\le j < ${n}$.`,
                    `每个元素都是 $a^ib^j$，$0 \\le i < ${m}$，$0 \\le j < ${n}$。`,
                  ),
                ]
              : [
                  `\\langle r, s \\mid r^{${m + 1}} = s^2 = e, srs = r^{-1} \\rangle`,
                  2 * (m + 1),
                  t(
                    `Every element is $r^i$ or $r^is$ with $0 \\le i < ${m + 1}$.`,
                    `每个元素都是 $r^i$ 或 $r^is$，$0 \\le i < ${m + 1}$。`,
                  ),
                ];
        const mistakes =
          kind === 0
            ? [
                why(m - 1, "This leaves out the identity $e = a^0$.", "这漏掉了单位元 $e = a^0$。"),
                why(m + 1, `$a^{${m}}$ equals $e$, so it is not a new element.`, `$a^{${m}}$ 等于 $e$，不是新元素。`),
                why(
                  2 * m,
                  "There is only one generator, so there are no extra elements beyond its powers.",
                  "只有一个生成元，所以除了它的幂没有其他元素。",
                ),
              ]
            : kind === 1
              ? [
                  why(
                    m + n,
                    `This adds the orders; each of the $${m}$ powers of $a$ pairs with each of the $${n}$ powers of $b$.`,
                    `这把阶相加了；$a$ 的 $${m}$ 个幂与 $b$ 的 $${n}$ 个幂两两配对。`,
                  ),
                  why(
                    lcm(m, n),
                    "The lcm is the largest order of an element, not the number of elements.",
                    "最小公倍数是元素的最大阶，而不是元素个数。",
                  ),
                  why(
                    2 * m * n,
                    "Since $ab = ba$, the words $a^ib^j$ and $b^ja^i$ are the same element and are counted once.",
                    "由于 $ab = ba$，字 $a^ib^j$ 与 $b^ja^i$ 是同一元素，只算一次。",
                  ),
                ]
              : [
                  why(
                    m + 1,
                    `This counts only the rotations $r^i$; the reflections $r^is$ add $${m + 1}$ more.`,
                    `这只数了旋转 $r^i$；反射 $r^is$ 还有 $${m + 1}$ 个。`,
                  ),
                  why(
                    m + 3,
                    "This adds $s$ and $e$ to the rotations instead of pairing every rotation with $s$.",
                    "这只是在旋转之外加上 $s$ 与 $e$，而没有把每个旋转都与 $s$ 配对。",
                  ),
                  why(
                    4 * (m + 1),
                    "The relation $srs = r^{-1}$ moves every $s$ to the right, so $s$ never needs to appear twice.",
                    "关系 $srs = r^{-1}$ 能把每个 $s$ 移到右边，所以 $s$ 不必出现两次。",
                  ),
                ];
        const normal =
          kind === 0
            ? t(
                "Every word in $a$ reduces to a power of $a$ with exponent from $0$ to the order minus $1$.",
                "$a$ 的每个字都化为指数在 $0$ 到阶减 $1$ 之间的 $a$ 的幂。",
              )
            : kind === 1
              ? t(
                  "Since $ab = ba$, every word can be rearranged as a power of $a$ times a power of $b$.",
                  "由于 $ab = ba$，每个字都可重排为 $a$ 的幂乘 $b$ 的幂。",
                )
              : t(
                  "Using $sr = r^{-1}s$, every $s$ moves to the right, and $s^2 = e$ leaves at most one.",
                  "利用 $sr = r^{-1}s$，每个 $s$ 都可移到右边，而 $s^2 = e$ 使之最多剩一个。",
                );
        const model =
          kind === 0
            ? t(
                `$\\mathbb{Z}_{${m}}$ satisfies the relation with $a = 1$ and has $${m}$ elements, so none of them coincide.`,
                `$\\mathbb{Z}_{${m}}$ 在 $a = 1$ 时满足该关系，且有 $${m}$ 个元素，所以这些元素互不相同。`,
              )
            : kind === 1
              ? t(
                  `$\\mathbb{Z}_{${m}} \\times \\mathbb{Z}_{${n}}$ satisfies the relations and has $${m * n}$ elements, so none of the words coincide.`,
                  `$\\mathbb{Z}_{${m}} \\times \\mathbb{Z}_{${n}}$ 满足这些关系且有 $${m * n}$ 个元素，所以这些字互不相同。`,
                )
              : t(
                  `The symmetries of a regular $${m + 1}$-gon satisfy the relations and number $${2 * (m + 1)}$, so none of the words coincide.`,
                  `正 $${m + 1}$ 边形的对称满足这些关系，共 $${2 * (m + 1)}$ 个，所以这些字互不相同。`,
                );
        return numberProblem({
          prompt: t(`Find the order of the group $${tex}$.`, `求群 $${tex}$ 的阶。`),
          answer: value,
          mistakes: apart(value, mistakes),
          solution: walked(
            [
              [["Find a normal form", "找出标准形式"], normal],
              [["Count", "计数"], t(`${how.en} So the order is $${value}$.`, `${how["zh-CN"]}所以阶为 $${value}$。`)],
            ],
            model,
          ),
        });
      },
    },
    {
      id: "simplifying-words-using-relations",
      title: t("Simplifying with relations", "用关系化简"),
      explanation: t(
        "In $\\langle r, s \\mid r^n = s^2 = e, srs = r^{-1} \\rangle$, the relation gives $sr^k s = r^{-k}$, so $sr^k = r^{-k}s$: moving $s$ past $r^k$ inverts it. Then reduce exponents of $r$ modulo $n$: with $n = 6$, $r^4 s r^5 = r^4 r^{-5} s = r^{-1}s = r^5 s$.\n\nCheck: $r^5 s \\cdot s = r^5$, and $r^4 s r^5 s = r^4 r^{-5} = r^{-1} = r^5$ by the same rule, so both sides agree after multiplying by $s$.\n\n> **Watch out.** Moving $s$ to the right flips the sign of the exponent it passes: $sr^5 = r^{-5}s$, not $r^5 s$.",
        "在 $\\langle r, s \\mid r^n = s^2 = e, srs = r^{-1} \\rangle$ 中，由关系得 $sr^k s = r^{-k}$，所以 $sr^k = r^{-k}s$：把 $s$ 移过 $r^k$ 会使它取逆。再把 $r$ 的指数模 $n$ 约化：当 $n = 6$ 时，$r^4 s r^5 = r^4 r^{-5} s = r^{-1}s = r^5 s$。\n\n检验：$r^5 s \\cdot s = r^5$；而按同样的规则 $r^4 s r^5 s = r^4 r^{-5} = r^{-1} = r^5$，所以两边右乘 $s$ 后一致。\n\n> **注意。** 把 $s$ 移到右边时，它越过的指数要变号：$sr^5 = r^{-5}s$，而不是 $r^5 s$。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(4, 12);
          const i = rng.int(1, n - 1);
          const j = rng.int(1, n - 1);
          const value = mod(i - j, n);
          const mistakes = apart(value, [
            why(
              mod(i + j, n),
              `Moving $s$ past $${rPow(j)}$ inverts it, so the exponent $${j}$ is subtracted, not added.`,
              `把 $s$ 移过 $${rPow(j)}$ 会使它取逆，所以指数 $${j}$ 要减去，而不是加上。`,
            ),
            why(mod(j - i, n), `The subtraction is the wrong way round: it is $${i} - ${j}$.`, `减法方向反了：应为 $${i} - ${j}$。`),
            why(
              i - j,
              `$k$ must lie between $0$ and $${n - 1}$, so reduce the exponent modulo $${n}$.`,
              `$k$ 必须在 $0$ 与 $${n - 1}$ 之间，所以要把指数模 $${n}$ 约化。`,
            ),
            why(
              i,
              `The factor $${rPow(j)}$ does not disappear when $s$ moves past it; it becomes $r^{-${j}}$.`,
              `$s$ 越过 $${rPow(j)}$ 时它不会消失，而是变为 $r^{-${j}}$。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `In $\\langle r, s \\mid r^{${n}} = s^2 = e, srs = r^{-1} \\rangle$, the element $${rPow(i)} s ${rPow(j)}$ equals $r^k s$ with $0 \\le k < ${n}$. Find $k$.`,
              `在 $\\langle r, s \\mid r^{${n}} = s^2 = e, srs = r^{-1} \\rangle$ 中，元素 $${rPow(i)} s ${rPow(j)}$ 等于 $r^k s$，$0 \\le k < ${n}$。求 $k$。`,
            ),
            answer: value,
            mistakes,
            solution: walked(
              [
                [
                  ["Move $s$ to the right", "把 $s$ 移到右边"],
                  t(
                    `$s${rPow(j)} = r^{-${j}}s$, so $${rPow(i)} s ${rPow(j)} = r^{${i} - ${j}} s$.`,
                    `$s${rPow(j)} = r^{-${j}}s$，所以 $${rPow(i)} s ${rPow(j)} = r^{${i} - ${j}} s$。`,
                  ),
                ],
                [
                  [`Reduce modulo $${n}$`, `模 $${n}$ 约化`],
                  t(
                    `$${i} - ${j} = ${i - j} \\equiv ${value} \\pmod{${n}}$, so the element is $${rPow(value)} s$ and $k = ${value}$.`,
                    `$${i} - ${j} = ${i - j} \\equiv ${value} \\pmod{${n}}$，所以该元素为 $${rPow(value)} s$，$k = ${value}$。`,
                  ),
                ],
              ],
              t(
                `Multiplying both by $s$ on the right: $${rPow(i)} s ${rPow(j)} s = ${rPow(i)} r^{-${j}}$ and $${rPow(value)} s s = ${rPow(value)}$, and $${i} - ${j} \\equiv ${value} \\pmod{${n}}$.`,
                `两边右乘 $s$：$${rPow(i)} s ${rPow(j)} s = ${rPow(i)} r^{-${j}}$，$${rPow(value)} s s = ${rPow(value)}$，且 $${i} - ${j} \\equiv ${value} \\pmod{${n}}$。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

/** abstractAlgebraSubgroupTopics are the topics of Abstract Algebra modules 2.4 to 2.6. */
export const abstractAlgebraSubgroupTopics: readonly TopicDef[] = [
  subgroupsOfScalarGroups,
  subgroupsOfMatrixGroups,
  subgroupsOfFunctionGroups,
  propertiesOfSubgroups,
  finiteCyclicGroups,
  cyclicGroups,
  cyclicSubgroups,
  cyclicSubgroupsInTheComplexPlane,
  generatorsOfCyclicGroups,
  propertiesOfCyclicGroups,
  generatingSets,
  freeGroups,
  universalPropertyOfFreeGroups,
  presentationsOfGroups,
];
