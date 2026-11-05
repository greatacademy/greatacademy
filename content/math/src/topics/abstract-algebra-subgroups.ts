import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem } from "../problems.ts";
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
import { range } from "./methods-of-proof-common.ts";

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
  prerequisites: ["real-rational-and-complex-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-subgroups-of-scalar-groups",
      title: t("Recognizing subgroups", "识别子群"),
      explanation: t(
        "Check that $H$ contains the identity and is closed under the operation and inverses. $\\{\\pm 1\\}$ is a subgroup of $(\\mathbb{R}^*, \\cdot)$, but $\\mathbb{Z}^+$ is not a subgroup of $(\\mathbb{Z}, +)$: it lacks $0$ and inverses.",
        "检验 $H$ 含单位元，并对运算和求逆封闭。$\\{\\pm 1\\}$ 是 $(\\mathbb{R}^*, \\cdot)$ 的子群，但 $\\mathbb{Z}^+$ 不是 $(\\mathbb{Z}, +)$ 的子群：它缺少 $0$ 和逆元。",
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
        "An integer lies in both subgroups exactly when it is a multiple of both numbers, which means a multiple of their least common multiple. $a\\mathbb{Z} \\cap b\\mathbb{Z}$ is the set of common multiples of $a$ and $b$, which is $\\operatorname{lcm}(a, b)\\mathbb{Z}$. For example $4\\mathbb{Z} \\cap 6\\mathbb{Z} = 12\\mathbb{Z}$.",
        "一个整数同时属于两个子群，当且仅当它是两个数的公倍数，也就是它们最小公倍数的倍数。$a\\mathbb{Z} \\cap b\\mathbb{Z}$ 是 $a$ 与 $b$ 的公倍数的集合，即 $\\operatorname{lcm}(a, b)\\mathbb{Z}$。例如 $4\\mathbb{Z} \\cap 6\\mathbb{Z} = 12\\mathbb{Z}$。",
      ),
      generate(rng) {
        const a = rng.int(2, 18);
        let b: number;
        do b = rng.int(2, 18);
        while (b === a);
        const value = lcm(a, b);
        return numberProblem({
          prompt: t(
            `The intersection $${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z}$ is a subgroup $m\\mathbb{Z}$ of $\\mathbb{Z}$ with $m > 0$. Find $m$.`,
            `交 $${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z}$ 是 $\\mathbb{Z}$ 的子群 $m\\mathbb{Z}$，$m > 0$。求 $m$。`,
          ),
          answer: value,
          wrong: [gcd(a, b), a * b, a + b],
          solution: t(
            `The common multiples of $${a}$ and $${b}$ are the multiples of $\\operatorname{lcm}(${a}, ${b}) = ${value}$.`,
            `$${a}$ 与 $${b}$ 的公倍数就是 $\\operatorname{lcm}(${a}, ${b}) = ${value}$ 的倍数。`,
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

/** FINITE_MATRICES are integer matrices of finite order, with their orders. */
const FINITE_MATRICES: readonly { tex: string; order: number }[] = [
  { tex: "\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}", order: 4 },
  { tex: "\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}", order: 2 },
  { tex: "\\begin{pmatrix} -1 & -1 \\\\ 1 & 0 \\end{pmatrix}", order: 3 },
  { tex: "\\begin{pmatrix} 0 & -1 \\\\ 1 & 1 \\end{pmatrix}", order: 6 },
  { tex: "\\begin{pmatrix} 1 & 1 \\\\ -1 & 0 \\end{pmatrix}", order: 6 },
  { tex: "\\begin{pmatrix} 0 & 1 \\\\ -1 & -1 \\end{pmatrix}", order: 3 },
  { tex: "\\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}", order: 2 },
  { tex: "\\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}", order: 4 },
];

/** subgroupsOfMatrixGroups decides subgroups of GL(2, ℝ) and finds orders of cyclic matrix subgroups. */
export const subgroupsOfMatrixGroups: TopicDef = {
  id: "subgroups-of-matrix-groups",
  title: t("Subgroups of Matrix Groups", "矩阵群的子群"),
  summary: t(
    "Important subgroups of GL(n, ℝ) include SL(n, ℝ), the orthogonal matrices, the invertible diagonal and upper triangular matrices, and finite subgroups generated by rotations. The subgroup generated by a matrix A consists of its powers Aᵏ.",
    "GL(n, ℝ) 的重要子群包括 SL(n, ℝ)、正交矩阵、可逆的对角矩阵与上三角矩阵，以及由旋转生成的有限子群。矩阵 A 生成的子群由它的幂 Aᵏ 组成。",
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
        "The orthogonal matrices form a subgroup of $GL(2, \\mathbb{R})$: if $A^TA = B^TB = I$ then $(AB^{-1})^T(AB^{-1}) = I$. The symmetric invertible matrices do not: a product of symmetric matrices need not be symmetric.",
        "正交矩阵构成 $GL(2, \\mathbb{R})$ 的子群：若 $A^TA = B^TB = I$，则 $(AB^{-1})^T(AB^{-1}) = I$。可逆对称矩阵不构成子群：对称矩阵之积未必对称。",
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
      title: t("Cyclic subgroups of matrices", "矩阵的循环子群"),
      explanation: t(
        "The subgroup generated by $A$ is $\\{I, A, A^2, \\dots\\}$; its size is the least $m \\ge 1$ with $A^m = I$. The rotation through $\\frac{2\\pi k}{n}$ generates a subgroup of size $\\frac{n}{\\gcd(k, n)}$. For $\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$ (rotation by $\\frac{\\pi}{2}$) the size is $4$.",
        "$A$ 生成的子群为 $\\{I, A, A^2, \\dots\\}$；它的大小是使 $A^m = I$ 的最小 $m \\ge 1$。旋转角为 $\\frac{2\\pi k}{n}$ 的旋转生成大小为 $\\frac{n}{\\gcd(k, n)}$ 的子群。对 $\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$（旋转 $\\frac{\\pi}{2}$），大小为 $4$。",
      ),
      generate(rng) {
        if (rng.bool(0.3)) {
          const m = rng.pick(FINITE_MATRICES);
          return numberProblem({
            prompt: t(
              `How many elements does the subgroup of $GL(2, \\mathbb{R})$ generated by $${m.tex}$ have?`,
              `$GL(2, \\mathbb{R})$ 中由 $${m.tex}$ 生成的子群有多少个元素？`,
            ),
            answer: m.order,
            wrong: [m.order === 4 ? 2 : 4, m.order + 1, 2 * m.order],
            solution: t(
              `Computing powers, $A^{${m.order}} = I$ and no smaller positive power is $I$, so the subgroup has $${m.order}$ elements.`,
              `计算各次幂，$A^{${m.order}} = I$，且更小的正整数次幂都不是 $I$，所以该子群有 $${m.order}$ 个元素。`,
            ),
          });
        }
        const n = rng.int(3, 24);
        let k: number;
        do k = rng.int(1, n - 1);
        while (gcd(k, n) === n);
        const value = n / gcd(k, n);
        return numberProblem({
          prompt: t(
            `How many elements does the subgroup of $GL(2, \\mathbb{R})$ generated by $${rotationTex(k, n)}$ have?`,
            `$GL(2, \\mathbb{R})$ 中由 $${rotationTex(k, n)}$ 生成的子群有多少个元素？`,
          ),
          answer: value,
          wrong: [n, gcd(k, n), 2 * value],
          solution: t(
            `This is the rotation through $\\frac{2\\pi \\cdot ${k / gcd(k, n)}}{${value}}$, whose powers return to $I$ after $${value}$ steps.`,
            `这是旋转角为 $\\frac{2\\pi \\cdot ${k / gcd(k, n)}}{${value}}$ 的旋转，它的幂在 $${value}$ 步后回到 $I$。`,
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
  prerequisites: ["function-groups", "subgroups-of-scalar-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "subgroups-of-the-affine-group",
      title: t("Subgroups of the affine group", "仿射群的子群"),
      explanation: t(
        "Compose two maps of the given form and invert one. $(ax + b) \\circ (cx + d) = acx + (ad + b)$ and $(ax + b)^{-1} = \\frac{1}{a}x - \\frac{b}{a}$. So the maps with $a > 0$ form a subgroup, but the maps $x + b$ with $b \\ge 0$ do not (no inverses).",
        "把两个给定形式的映射复合，并对其中一个求逆。$(ax + b) \\circ (cx + d) = acx + (ad + b)$，$(ax + b)^{-1} = \\frac{1}{a}x - \\frac{b}{a}$。所以 $a > 0$ 的映射构成子群，而 $b \\ge 0$ 的映射 $x + b$ 不构成子群（缺少逆）。",
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
        "Keep composing the given functions until no new function appears. $1 - x$ composed with itself is $x$, so it generates $\\{x, 1 - x\\}$. Adding $\\frac{1}{x}$ produces all six functions.",
        "不断复合给定的函数，直到不再出现新函数。$1 - x$ 与自身复合得 $x$，所以它生成 $\\{x, 1 - x\\}$。再加上 $\\frac{1}{x}$ 就得到全部六个函数。",
      ),
      generate(rng) {
        const f = rng.int(1, 5);
        const g = rng.int(0, 5);
        const gens = f === g ? [f] : [f, g];
        const sub = closureOfMobius(gens);
        const names = gens.map((i) => `$${ANHARMONIC[i]!.tex}$`);
        return numberProblem({
          prompt: t(
            `The six functions $x, \\frac{1}{x}, 1 - x, \\frac{1}{1 - x}, \\frac{x - 1}{x}, \\frac{x}{x - 1}$ form a group under composition. How many elements does the subgroup generated by ${names.join(" and ")} have?`,
            `六个函数 $x, \\frac{1}{x}, 1 - x, \\frac{1}{1 - x}, \\frac{x - 1}{x}, \\frac{x}{x - 1}$ 在复合下构成群。由 ${names.join(" 与 ")} 生成的子群有多少个元素？`,
          ),
          answer: sub.length,
          wrong: [6, 2, 3, gens.length + 1].filter((x) => x !== sub.length),
          solution: t(
            `Composing repeatedly gives $${sub.map((i) => ANHARMONIC[i]!.tex).join(", ")}$: $${sub.length}$ functions.`,
            `反复复合得到 $${sub.map((i) => ANHARMONIC[i]!.tex).join(", ")}$：共 $${sub.length}$ 个函数。`,
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
  prerequisites: ["subgroups-of-scalar-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "unions-of-subgroups",
      title: t("Unions of subgroups", "子群的并"),
      explanation: t(
        "A union of two subgroups is usually not closed under the operation, and it is a subgroup only when one subgroup contains the other. $2\\mathbb{Z} \\cup 3\\mathbb{Z}$ is not a subgroup of $\\mathbb{Z}$: it contains $2$ and $3$ but not $2 + 3 = 5$. But $2\\mathbb{Z} \\cup 6\\mathbb{Z} = 2\\mathbb{Z}$ is, since $6\\mathbb{Z} \\subseteq 2\\mathbb{Z}$.",
        "两个子群的并通常对运算不封闭，只有当其中一个子群包含另一个时，它才是子群。$2\\mathbb{Z} \\cup 3\\mathbb{Z}$ 不是 $\\mathbb{Z}$ 的子群：它含 $2$ 和 $3$，但不含 $2 + 3 = 5$。而 $2\\mathbb{Z} \\cup 6\\mathbb{Z} = 2\\mathbb{Z}$ 是子群，因为 $6\\mathbb{Z} \\subseteq 2\\mathbb{Z}$。",
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
        "The smallest subgroup of $\\mathbb{Z}_n$ containing $a$ and $b$ consists of the multiples of $d = \\gcd(a, b, n)$, so it has $\\frac{n}{d}$ elements. In $\\mathbb{Z}_{24}$, the smallest subgroup containing $9$ and $15$ is generated by $3$ and has $8$ elements.",
        "$\\mathbb{Z}_n$ 中包含 $a$ 与 $b$ 的最小子群由 $d = \\gcd(a, b, n)$ 的倍数组成，所以有 $\\frac{n}{d}$ 个元素。在 $\\mathbb{Z}_{24}$ 中，包含 $9$ 与 $15$ 的最小子群由 $3$ 生成，有 $8$ 个元素。",
      ),
      generate(rng) {
        const n = rng.pick([12, 18, 20, 24, 30, 36, 40, 42, 48, 60]);
        const a = rng.int(2, n - 1);
        const b = rng.int(2, n - 1);
        const d = gcd(gcd(a, b), n);
        return numberProblem({
          prompt: t(
            `How many elements does the smallest subgroup of $\\mathbb{Z}_{${n}}$ containing $${a}$ and $${b}$ have?`,
            `$\\mathbb{Z}_{${n}}$ 中包含 $${a}$ 与 $${b}$ 的最小子群有多少个元素？`,
          ),
          answer: n / d,
          wrong: [d, n / gcd(a, n), n / gcd(b, n), n / gcd(a, n) + n / gcd(b, n)],
          solution: t(
            `$\\gcd(${a}, ${b}, ${n}) = ${d}$, so the subgroup is generated by $${d}$ and has $\\frac{${n}}{${d}} = ${n / d}$ elements.`,
            `$\\gcd(${a}, ${b}, ${n}) = ${d}$，所以该子群由 $${d}$ 生成，有 $\\frac{${n}}{${d}} = ${n / d}$ 个元素。`,
          ),
        });
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
  prerequisites: ["orders-of-group-elements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "cyclic-groups-of-units",
      title: t("Is U(n) cyclic?", "U(n) 是循环群吗？"),
      explanation: t(
        "$U(n)$ is cyclic exactly when some element has order $\\varphi(n)$. In $U(8) = \\{1, 3, 5, 7\\}$ every element squares to $1$, so no element has order $4$ and $U(8)$ is not cyclic. In $U(10)$, $3$ has order $4 = \\varphi(10)$.",
        "$U(n)$ 是循环群当且仅当某个元素的阶为 $\\varphi(n)$。在 $U(8) = \\{1, 3, 5, 7\\}$ 中每个元素的平方都是 $1$，没有 $4$ 阶元素，所以 $U(8)$ 不是循环群。在 $U(10)$ 中，$3$ 的阶为 $4 = \\varphi(10)$。",
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
        "Test $2, 3, \\dots$ in turn and compute their orders. In $U(13)$, $2$ has powers $2, 4, 8, 3, 6, 12, 11, 9, 5, 10, 7, 1$, so its order is $12$ and $2$ generates $U(13)$.",
        "依次检验 $2, 3, \\dots$ 并计算它们的阶。在 $U(13)$ 中，$2$ 的幂为 $2, 4, 8, 3, 6, 12, 11, 9, 5, 10, 7, 1$，阶为 $12$，所以 $2$ 生成 $U(13)$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(5, 50);
        while (!isCyclicUnits(n));
        const gen = units(n).find((a) => multiplicativeOrder(a, n) === phi(n))!;
        const tried = units(n).filter((a) => a > 1 && a < gen);
        return numberProblem({
          prompt: t(
            `$U(${n})$ is cyclic. Find its smallest generator greater than $1$.`,
            `$U(${n})$ 是循环群。求它大于 $1$ 的最小生成元。`,
          ),
          answer: gen,
          wrong: [2, 3, units(n)[1]!, n - 1, gen + 1],
          solution: t(
            tried.length === 0
              ? `$${gen}$ has order $${phi(n)} = |U(${n})|$, so it is a generator.`
              : `${tried.map((a) => `$${a}$ has order $${multiplicativeOrder(a, n)}$`).join(", ")}, while $${gen}$ has order $${phi(n)} = |U(${n})|$.`,
            tried.length === 0
              ? `$${gen}$ 的阶为 $${phi(n)} = |U(${n})|$，所以它是生成元。`
              : `${tried.map((a) => `$${a}$ 的阶为 $${multiplicativeOrder(a, n)}$`).join("，")}，而 $${gen}$ 的阶为 $${phi(n)} = |U(${n})|$。`,
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
  prerequisites: ["finite-cyclic-groups", "properties-of-subgroups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-cyclic-groups",
      title: t("Recognizing cyclic groups", "识别循环群"),
      explanation: t(
        "To show a group is cyclic, name a generator. $\\{3^n : n \\in \\mathbb{Z}\\}$ is generated by $3$. $(\\mathbb{Q}, +)$ is not cyclic: the multiples of $\\frac{a}{b}$ never include $\\frac{a}{2b}$.",
        "要说明一个群是循环群，就给出一个生成元。$\\{3^n : n \\in \\mathbb{Z}\\}$ 由 $3$ 生成。$(\\mathbb{Q}, +)$ 不是循环群：$\\frac{a}{b}$ 的倍数中永远没有 $\\frac{a}{2b}$。",
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
        "The subgroup of $\\mathbb{Z}$ generated by $a$ and $b$ is $\\{ma + nb\\}$, which by Bézout's identity is $d\\mathbb{Z}$ with $d = \\gcd(a, b)$. So $\\langle 12, 18 \\rangle = 6\\mathbb{Z}$ is cyclic with generator $6$.",
        "$\\mathbb{Z}$ 中由 $a$ 与 $b$ 生成的子群为 $\\{ma + nb\\}$，由裴蜀等式它等于 $d\\mathbb{Z}$，$d = \\gcd(a, b)$。所以 $\\langle 12, 18 \\rangle = 6\\mathbb{Z}$ 是以 $6$ 为生成元的循环群。",
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
          wrong: [lcm(a, b), Math.min(a, b), Math.abs(a - b) === d ? a + b : Math.abs(a - b)],
          solution: t(
            `$\\langle ${a}, ${b} \\rangle = \\gcd(${a}, ${b})\\mathbb{Z} = ${d}\\mathbb{Z}$.`,
            `$\\langle ${a}, ${b} \\rangle = \\gcd(${a}, ${b})\\mathbb{Z} = ${d}\\mathbb{Z}$。`,
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
  prerequisites: ["cyclic-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "cyclic-subgroups-of-zn",
      title: t("Cyclic subgroups of $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 的循环子群"),
      explanation: t(
        "The multiples of an element modulo the order are exactly the multiples of their gcd, so that gcd generates the same subgroup. In $\\mathbb{Z}_{18}$, $\\langle 12 \\rangle = \\{0, 12, 6\\}$, the multiples of $\\gcd(12, 18) = 6$. An element belongs to $\\langle a \\rangle$ exactly when it is a multiple of $\\gcd(a, n)$.",
        "一个元素模群阶的倍数恰好是它们最大公因数的倍数，所以这个最大公因数生成同一个子群。在 $\\mathbb{Z}_{18}$ 中，$\\langle 12 \\rangle = \\{0, 12, 6\\}$，即 $\\gcd(12, 18) = 6$ 的倍数。一个元素属于 $\\langle a \\rangle$ 当且仅当它是 $\\gcd(a, n)$ 的倍数。",
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
        return texChoice(
          rng,
          t(
            `Which of these elements of $\\mathbb{Z}_{${n}}$ lies in the cyclic subgroup $\\langle ${a} \\rangle$?`,
            `下列 $\\mathbb{Z}_{${n}}$ 的元素中，哪个属于循环子群 $\\langle ${a} \\rangle$？`,
          ),
          `${right}`,
          rng.sample(outside, Math.min(3, outside.length)).map(String),
          t(
            `$\\langle ${a} \\rangle$ consists of the multiples of $\\gcd(${a}, ${n}) = ${d}$, and $${right}$ is one.`,
            `$\\langle ${a} \\rangle$ 由 $\\gcd(${a}, ${n}) = ${d}$ 的倍数组成，$${right}$ 就是其中之一。`,
          ),
        );
      },
    },
    {
      id: "cyclic-subgroups-of-groups-of-units",
      title: t("Cyclic subgroups of U(n)", "U(n) 的循环子群"),
      explanation: t(
        "The cyclic subgroup generated by an element consists of its powers, which repeat once a power equals the identity. List the powers of $a$ until you return to $1$. In $U(13)$, $\\langle 3 \\rangle = \\{1, 3, 9\\}$ since $3^3 = 27 \\equiv 1$.",
        "由一个元素生成的循环子群由它的幂组成，一旦某次幂等于单位元，这些幂就开始重复。列出 $a$ 的幂直到回到 $1$。在 $U(13)$ 中，$\\langle 3 \\rangle = \\{1, 3, 9\\}$，因为 $3^3 = 27 \\equiv 1$。",
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
        return texChoice(
          rng,
          t(
            `Which of these elements of $U(${n})$ lies in the cyclic subgroup $\\langle ${a} \\rangle$?`,
            `下列 $U(${n})$ 的元素中，哪个属于循环子群 $\\langle ${a} \\rangle$？`,
          ),
          `${right}`,
          rng.sample(outside, Math.min(3, outside.length)).map(String),
          t(`The powers of $${a}$ modulo $${n}$ are $${pw.join(", ")}$.`, `$${a}$ 模 $${n}$ 的幂为 $${pw.join(", ")}$。`),
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
  prerequisites: ["cyclic-subgroups", "properties-of-roots-of-unity"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orders-of-roots-of-unity",
      title: t("Orders of roots of unity", "单位根的阶"),
      explanation: t(
        "A root of unity returns to one after as many steps as the denominator of its angle fraction in lowest terms. $e^{2\\pi i \\cdot 4/6} = e^{2\\pi i \\cdot 2/3}$ has order $3$: write the fraction $\\frac{k}{n}$ in lowest terms, and the order is the denominator $\\frac{n}{\\gcd(k, n)}$.",
        "一个单位根在若干步之后回到 1，步数等于它的角度分数化为最简后的分母。$e^{2\\pi i \\cdot 4/6} = e^{2\\pi i \\cdot 2/3}$ 的阶为 $3$：把分数 $\\frac{k}{n}$ 化为最简，阶就是分母 $\\frac{n}{\\gcd(k, n)}$。",
      ),
      generate(rng) {
        const n = rng.int(3, 30);
        const k = rng.int(1, n - 1);
        const value = n / gcd(k, n);
        const polar = rng.bool();
        const z = polar ? `\\cos \\frac{${2 * k}\\pi}{${n}} + i \\sin \\frac{${2 * k}\\pi}{${n}}` : `e^{${2 * k}\\pi i / ${n}}`;
        return numberProblem({
          prompt: t(
            `How many elements does the cyclic subgroup of $\\mathbb{C}^*$ generated by $${z}$ have?`,
            `$\\mathbb{C}^*$ 中由 $${z}$ 生成的循环子群有多少个元素？`,
          ),
          answer: value,
          wrong: [n, k, gcd(k, n), 2 * value],
          solution: t(
            `$\\frac{${2 * k}\\pi}{${n}} = 2\\pi \\cdot \\frac{${k / gcd(k, n)}}{${value}}$ in lowest terms, so the order is $${value}$.`,
            `化为最简得 $\\frac{${2 * k}\\pi}{${n}} = 2\\pi \\cdot \\frac{${k / gcd(k, n)}}{${value}}$，所以阶为 $${value}$。`,
          ),
        });
      },
    },
    {
      id: "finite-and-infinite-cyclic-subgroups-of-c",
      title: t("Finite or infinite", "有限还是无限"),
      explanation: t(
        "If $|z| \\ne 1$ then $|z^k| = |z|^k$ never returns to $1$, so $\\langle z \\rangle$ is infinite. If $|z| = 1$, $\\langle z \\rangle$ is finite only when the argument of $z$ is a rational multiple of $2\\pi$. For example $\\frac{3 + 4i}{5}$ has modulus $1$ but infinite order.",
        "若 $|z| \\ne 1$，则 $|z^k| = |z|^k$ 永远不回到 $1$，所以 $\\langle z \\rangle$ 无限。若 $|z| = 1$，则仅当 $z$ 的辐角是 $2\\pi$ 的有理数倍时 $\\langle z \\rangle$ 有限。例如 $\\frac{3 + 4i}{5}$ 的模为 $1$，但阶为无穷。",
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
  prerequisites: ["cyclic-subgroups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-generators-of-cyclic-groups",
      title: t("Counting generators", "数生成元"),
      explanation: t(
        "An element generates a cyclic group exactly when its exponent is coprime to the order, so the generators are counted by Euler's totient. $\\mathbb{Z}_{12}$ has $\\varphi(12) = 4$ generators: $1, 5, 7, 11$. A cyclic group of order $n$ written multiplicatively, $\\langle g \\rangle$, likewise has $\\varphi(n)$ generators $g^k$ with $\\gcd(k, n) = 1$.",
        "一个元素生成循环群，当且仅当它的指数与群阶互素，所以生成元的个数由欧拉函数给出。$\\mathbb{Z}_{12}$ 有 $\\varphi(12) = 4$ 个生成元：$1, 5, 7, 11$。乘法记号下的 $n$ 阶循环群 $\\langle g \\rangle$ 同样有 $\\varphi(n)$ 个生成元 $g^k$，其中 $\\gcd(k, n) = 1$。",
      ),
      generate(rng) {
        const n = rng.int(6, 60);
        const value = phi(n);
        const roots = rng.bool();
        return numberProblem({
          prompt: roots
            ? t(
                `How many elements generate the group of $${n}$th roots of unity under multiplication?`,
                `$${n}$ 次单位根在乘法下构成的群有多少个生成元？`,
              )
            : t(`How many generators does $\\mathbb{Z}_{${n}}$ have?`, `$\\mathbb{Z}_{${n}}$ 有多少个生成元？`),
          answer: value,
          wrong: [n - 1, divisors(n).length, value + 1, 1],
          solution: t(
            `The generators correspond to the $k$ with $\\gcd(k, ${n}) = 1$: there are $\\varphi(${n}) = ${value}$.`,
            `生成元对应满足 $\\gcd(k, ${n}) = 1$ 的 $k$：共 $\\varphi(${n}) = ${value}$ 个。`,
          ),
        });
      },
    },
    {
      id: "recognizing-generators-of-zn",
      title: t("Recognizing generators", "识别生成元"),
      explanation: t(
        "An element generates the whole group exactly when its multiples reach one, which happens when it shares no factor with the modulus. $a$ generates $\\mathbb{Z}_n$ exactly when $\\gcd(a, n) = 1$. In $\\mathbb{Z}_{20}$, $7$ is a generator but $8$ is not, since $\\gcd(8, 20) = 4$ and $\\langle 8 \\rangle$ has only $5$ elements.",
        "一个元素生成整个群，当且仅当它的倍数能得到 1，这发生在它与模没有公因数的时候。$a$ 生成 $\\mathbb{Z}_n$ 当且仅当 $\\gcd(a, n) = 1$。在 $\\mathbb{Z}_{20}$ 中，$7$ 是生成元而 $8$ 不是，因为 $\\gcd(8, 20) = 4$，$\\langle 8 \\rangle$ 只有 $5$ 个元素。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(12, 60);
        while (phi(n) === n - 1);
        const gens = units(n).filter((a) => a > 1);
        const non = range(2, n - 1).filter((a) => gcd(a, n) > 1);
        const right = rng.pick(gens);
        return texChoice(
          rng,
          t(`Which of these elements generates $\\mathbb{Z}_{${n}}$?`, `下列哪个元素生成 $\\mathbb{Z}_{${n}}$？`),
          `${right}`,
          rng.sample(non, 3).map(String),
          t(
            `$\\gcd(${right}, ${n}) = 1$, while each other option shares a factor with $${n}$.`,
            `$\\gcd(${right}, ${n}) = 1$，而其他选项都与 $${n}$ 有公因数。`,
          ),
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
  prerequisites: ["generators-of-cyclic-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-subgroups-of-cyclic-groups",
      title: t("Counting subgroups", "数子群"),
      explanation: t(
        "$\\mathbb{Z}_{12}$ has one subgroup for each divisor of $12$: orders $1, 2, 3, 4, 6, 12$, so $6$ subgroups. The subgroup of order $d$ is generated by $\\frac{12}{d}$.",
        "$\\mathbb{Z}_{12}$ 对 $12$ 的每个因数各有一个子群：阶为 $1, 2, 3, 4, 6, 12$，共 $6$ 个子群。$d$ 阶子群由 $\\frac{12}{d}$ 生成。",
      ),
      generate(rng) {
        const n = rng.int(6, 100);
        const ds = divisors(n);
        return numberProblem({
          prompt: t(`How many subgroups does $\\mathbb{Z}_{${n}}$ have?`, `$\\mathbb{Z}_{${n}}$ 有多少个子群？`),
          answer: ds.length,
          wrong: [ds.length - 2, phi(n), ds.length - 1],
          solution: t(
            `There is one subgroup for each divisor of $${n}$: $${ds.join(", ")}$, so $${ds.length}$ subgroups.`,
            `$${n}$ 的每个因数对应一个子群：$${ds.join(", ")}$，共 $${ds.length}$ 个子群。`,
          ),
        });
      },
    },
    {
      id: "counting-elements-of-a-given-order",
      title: t("Elements of a given order", "给定阶的元素"),
      explanation: t(
        "In $\\mathbb{Z}_{n}$, the elements of order $d$ (for $d$ dividing $n$) are the generators of the unique subgroup of order $d$, so there are $\\varphi(d)$ of them. $\\mathbb{Z}_{24}$ has $\\varphi(8) = 4$ elements of order $8$: $3, 9, 15, 21$.",
        "在 $\\mathbb{Z}_{n}$ 中，$d$ 阶元素（$d$ 整除 $n$）就是唯一的 $d$ 阶子群的生成元，所以共有 $\\varphi(d)$ 个。$\\mathbb{Z}_{24}$ 有 $\\varphi(8) = 4$ 个 $8$ 阶元素：$3, 9, 15, 21$。",
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
          wrong: [1, d, n / d, phi(n)],
          solution: t(
            `They generate the unique subgroup of order $${d}$, so there are $\\varphi(${d}) = ${value}$.`,
            `它们是唯一的 $${d}$ 阶子群的生成元，所以有 $\\varphi(${d}) = ${value}$ 个。`,
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
  prerequisites: ["properties-of-cyclic-groups", "cayley-tables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "generating-sets-of-zn",
      title: t("Generating sets of $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 的生成集"),
      explanation: t(
        "$\\{a, b\\}$ generates $\\mathbb{Z}_n$ exactly when $\\gcd(a, b, n) = 1$, even if neither element generates alone. In $\\mathbb{Z}_{30}$, $\\{6, 10\\}$ generates the subgroup $\\langle 2 \\rangle$ of order $15$, and $\\{6, 10, 15\\}$ generates all of $\\mathbb{Z}_{30}$.",
        "$\\{a, b\\}$ 生成 $\\mathbb{Z}_n$ 当且仅当 $\\gcd(a, b, n) = 1$，即使两者单独都不是生成元。在 $\\mathbb{Z}_{30}$ 中，$\\{6, 10\\}$ 生成 $15$ 阶子群 $\\langle 2 \\rangle$，$\\{6, 10, 15\\}$ 生成整个 $\\mathbb{Z}_{30}$。",
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
      title: t("Generated subgroups of $S_3$", "$S_3$ 中生成的子群"),
      explanation: t(
        "In $S_3 = \\{e, r, r^2, s, rs, r^2s\\}$, where $r^3 = s^2 = e$ and $sr = r^2s$: $r$ generates $\\{e, r, r^2\\}$, $s$ generates $\\{e, s\\}$, and any rotation together with any reflection generates all of $S_3$.",
        "在 $S_3 = \\{e, r, r^2, s, rs, r^2s\\}$ 中（$r^3 = s^2 = e$，$sr = r^2s$）：$r$ 生成 $\\{e, r, r^2\\}$，$s$ 生成 $\\{e, s\\}$，任一旋转与任一反射一起生成整个 $S_3$。",
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
          wrong: [2, 3, 6, 4].filter((v) => v !== sub.length),
          solution: t(
            `Multiplying until no new elements appear gives $\\{${sub.map((i) => L[i]).join(", ")}\\}$: $${sub.length}$ elements.`,
            `不断相乘直到不再出现新元素，得到 $\\{${sub.map((i) => L[i]).join(", ")}\\}$：共 $${sub.length}$ 个元素。`,
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
  prerequisites: ["generating-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "reducing-words-in-free-groups",
      title: t("Reducing words", "约化字"),
      explanation: t(
        "Cancel adjacent pairs $xx^{-1}$ and $x^{-1}x$ repeatedly. $ab^{-1}ba^{2}b^{-1}$ becomes $aa^{2}b^{-1} = a^{3}b^{-1}$, a reduced word of length $4$. The order of cancellation does not matter.",
        "反复消去相邻的 $xx^{-1}$ 与 $x^{-1}x$。$ab^{-1}ba^{2}b^{-1}$ 化为 $aa^{2}b^{-1} = a^{3}b^{-1}$，是长度为 $4$ 的既约字。消去的顺序不影响结果。",
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
          wrong: [w.length, r.length + 2, Math.abs(r.length - 2)],
          solution: t(
            `Cancelling adjacent inverse pairs leaves $${wordTex(r)}$, which has $${r.length}$ letters.`,
            `消去相邻的互逆对后剩下 $${wordTex(r)}$，共 $${r.length}$ 个字母。`,
          ),
        });
      },
    },
    {
      id: "inverses-in-free-groups",
      title: t("Inverses of words", "字的逆"),
      explanation: t(
        "To undo a product, undo its last factor first, so the inverse of a word reverses the order and inverts each letter. The inverse of a product is the product of the inverses in reverse order: $(a^2b^{-1}a)^{-1} = a^{-1}ba^{-2}$.",
        "要撤销一个乘积，先撤销最后一个因子，所以一个词的逆把顺序反过来并把每个字母取逆。乘积的逆是各因子的逆按相反顺序相乘：$(a^2b^{-1}a)^{-1} = a^{-1}ba^{-2}$。",
      ),
      generate(rng) {
        let w: Letter[];
        // A word that reads the same backward would make two of the options coincide.
        do w = reduceWord(randomWord(rng, rng.int(5, 8)));
        while (w.length < 4 || wordTex(w) === wordTex([...w].reverse()));
        const inv = [...w].reverse().map(([x, e]) => [x, -e] as Letter);
        const noReverse = w.map(([x, e]) => [x, -e] as Letter);
        const noInvert = [...w].reverse();
        return texChoice(
          rng,
          t(`In the free group $F(a, b)$, what is $(${wordTex(w)})^{-1}$?`, `在自由群 $F(a, b)$ 中，$(${wordTex(w)})^{-1}$ 是什么？`),
          wordTex(inv),
          [wordTex(noReverse), wordTex(noInvert), wordTex(w)],
          t(
            `Reverse the order of the letters and invert each one: $${wordTex(inv)}$.`,
            `把字母顺序反过来，并把每个字母取逆：$${wordTex(inv)}$。`,
          ),
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
  prerequisites: ["free-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "homomorphisms-from-free-groups-to-zn",
      title: t("Maps to $\\mathbb{Z}_n$", "到 $\\mathbb{Z}_n$ 的映射"),
      explanation: t(
        "If $\\varphi(a) = 2$ and $\\varphi(b) = 5$ in $\\mathbb{Z}_7$, then $\\varphi(a^3b^{-1}a^{-1}) = 3 \\cdot 2 - 5 - 2 = -1 \\equiv 6$. Since $\\mathbb{Z}_n$ is abelian, only the total exponent of each letter matters.",
        "若在 $\\mathbb{Z}_7$ 中 $\\varphi(a) = 2$、$\\varphi(b) = 5$，则 $\\varphi(a^3b^{-1}a^{-1}) = 3 \\cdot 2 - 5 - 2 = -1 \\equiv 6$。由于 $\\mathbb{Z}_n$ 是阿贝尔群，只有每个字母的指数和起作用。",
      ),
      generate(rng) {
        const n = rng.int(5, 13);
        const g = rng.int(1, n - 1);
        const h = rng.int(1, n - 1);
        let w: Letter[];
        do w = reduceWord(randomWord(rng, rng.int(6, 10)));
        while (w.length < 4);
        const [ea, eb] = [exponentSum(w, "a"), exponentSum(w, "b")];
        const value = mod(ea * g + eb * h, n);
        return numberProblem({
          prompt: t(
            `$\\varphi: F(a, b) \\to \\mathbb{Z}_{${n}}$ is the homomorphism with $\\varphi(a) = ${g}$ and $\\varphi(b) = ${h}$. Find $\\varphi(${wordTex(w)})$, between $0$ and $${n - 1}$.`,
            `$\\varphi: F(a, b) \\to \\mathbb{Z}_{${n}}$ 是满足 $\\varphi(a) = ${g}$、$\\varphi(b) = ${h}$ 的同态。求 $\\varphi(${wordTex(w)})$，取 $0$ 到 $${n - 1}$ 之间的值。`,
          ),
          answer: value,
          wrong: [
            mod(Math.abs(ea) * g + Math.abs(eb) * h, n),
            mod(w.filter((l) => l[0] === "a").length * g + w.filter((l) => l[0] === "b").length * h, n),
            mod(ea * h + eb * g, n),
          ],
          solution: t(
            `The exponents of $a$ and $b$ add up to $${ea}$ and $${eb}$, so $\\varphi = ${ea} \\cdot ${g} + ${eb < 0 ? `(${eb})` : eb} \\cdot ${h} \\equiv ${value}$.`,
            `$a$ 与 $b$ 的指数和分别为 $${ea}$ 与 $${eb}$，所以 $\\varphi = ${ea} \\cdot ${g} + ${eb < 0 ? `(${eb})` : eb} \\cdot ${h} \\equiv ${value}$。`,
          ),
        });
      },
    },
    {
      id: "homomorphisms-from-free-groups-to-s3",
      title: t("Maps to $S_3$", "到 $S_3$ 的映射"),
      explanation: t(
        "A homomorphism from a free group is fixed by where the generators go, and the image of a word is the product of their images in the same order. In a non-abelian group the order of the letters matters. With $\\varphi(a) = r$ and $\\varphi(b) = s$ in $S_3$, $\\varphi(ab) = rs$ but $\\varphi(ba) = sr = r^2s$.",
        "从自由群出发的同态由生成元的去向决定，一个词的像就是生成元的像按相同顺序的乘积。在非阿贝尔群中字母的顺序很重要。若在 $S_3$ 中 $\\varphi(a) = r$、$\\varphi(b) = s$，则 $\\varphi(ab) = rs$，而 $\\varphi(ba) = sr = r^2s$。",
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
        const L = S3.labels;
        return texChoice(
          rng,
          t(
            `In $S_3 = \\{e, r, r^2, s, rs, r^2s\\}$, where $r^3 = s^2 = e$ and $sr = r^2s$, let $\\varphi: F(a, b) \\to S_3$ be the homomorphism with $\\varphi(a) = ${L[g]}$ and $\\varphi(b) = ${L[h]}$. Find $\\varphi(${wordTex(w)})$.`,
            `在 $S_3 = \\{e, r, r^2, s, rs, r^2s\\}$ 中（$r^3 = s^2 = e$，$sr = r^2s$），设 $\\varphi: F(a, b) \\to S_3$ 是满足 $\\varphi(a) = ${L[g]}$、$\\varphi(b) = ${L[h]}$ 的同态。求 $\\varphi(${wordTex(w)})$。`,
          ),
          L[value]!,
          [L[reversed]!, ...rng.shuffle([...L])],
          t(
            `Replace each letter by its image and multiply from left to right in $S_3$: the result is $${L[value]}$.`,
            `把每个字母换成它的像，在 $S_3$ 中从左到右相乘：结果为 $${L[value]}$。`,
          ),
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
  prerequisites: ["universal-property-of-free-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orders-of-presented-groups",
      title: t("Orders of presented groups", "被表示群的阶"),
      explanation: t(
        "In $\\langle a, b \\mid a^4 = b^3 = e, ab = ba \\rangle$ every element can be written $a^ib^j$ with $0 \\le i < 4$, $0 \\le j < 3$, so the order is $12$. In $\\langle r, s \\mid r^5 = s^2 = e, srs = r^{-1} \\rangle$ every element is $r^i$ or $r^is$, giving $10$ elements.",
        "在 $\\langle a, b \\mid a^4 = b^3 = e, ab = ba \\rangle$ 中，每个元素都可写成 $a^ib^j$（$0 \\le i < 4$，$0 \\le j < 3$），所以阶为 $12$。在 $\\langle r, s \\mid r^5 = s^2 = e, srs = r^{-1} \\rangle$ 中，每个元素都是 $r^i$ 或 $r^is$，共 $10$ 个元素。",
      ),
      generate(rng) {
        const m = rng.int(2, 12);
        const n = rng.int(2, 9);
        const kind = rng.int(0, 2);
        const [tex, value, how] =
          kind === 0
            ? [
                `\\langle a \\mid a^{${m}} = e \\rangle`,
                m,
                t(`It is cyclic, with elements $e, a, \\dots, a^{${m - 1}}$.`, `它是循环群，元素为 $e, a, \\dots, a^{${m - 1}}$。`),
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
        return numberProblem({
          prompt: t(`Find the order of the group $${tex}$.`, `求群 $${tex}$ 的阶。`),
          answer: value,
          wrong: kind === 0 ? [m - 1, m + 1, 2 * m] : kind === 1 ? [m + n, lcm(m, n), m * n * 2] : [m + 1, m + 3, 4 * (m + 1)],
          solution: t(`${how.en} So the order is $${value}$.`, `${how["zh-CN"]}所以阶为 $${value}$。`),
        });
      },
    },
    {
      id: "simplifying-words-using-relations",
      title: t("Simplifying with relations", "用关系化简"),
      explanation: t(
        "In $\\langle r, s \\mid r^n = s^2 = e, srs = r^{-1} \\rangle$, the relation gives $sr^k s = r^{-k}$, so $sr^k = r^{-k}s$: moving $s$ past $r^k$ inverts it. Then reduce exponents of $r$ modulo $n$: with $n = 6$, $r^4 s r^5 = r^4 r^{-5} s = r^{-1}s = r^5 s$.",
        "在 $\\langle r, s \\mid r^n = s^2 = e, srs = r^{-1} \\rangle$ 中，由关系得 $sr^k s = r^{-k}$，所以 $sr^k = r^{-k}s$：把 $s$ 移过 $r^k$ 会使它取逆。再把 $r$ 的指数模 $n$ 约化：当 $n = 6$ 时，$r^4 s r^5 = r^4 r^{-5} s = r^{-1}s = r^5 s$。",
      ),
      generate(rng) {
        const n = rng.int(4, 12);
        const i = rng.int(1, n - 1);
        const j = rng.int(1, n - 1);
        const value = mod(i - j, n);
        return numberProblem({
          prompt: t(
            `In $\\langle r, s \\mid r^{${n}} = s^2 = e, srs = r^{-1} \\rangle$, the element $${rPow(i)} s ${rPow(j)}$ equals $r^k s$ with $0 \\le k < ${n}$. Find $k$.`,
            `在 $\\langle r, s \\mid r^{${n}} = s^2 = e, srs = r^{-1} \\rangle$ 中，元素 $${rPow(i)} s ${rPow(j)}$ 等于 $r^k s$，$0 \\le k < ${n}$。求 $k$。`,
          ),
          answer: value,
          wrong: [mod(i + j, n), mod(j - i, n), i * j === value ? i : mod(i * j, n)],
          solution: t(
            `$s${rPow(j)} = r^{-${j}}s$, so $${rPow(i)} s ${rPow(j)} = r^{${i} - ${j}} s = r^{${value}} s$.`,
            `$s${rPow(j)} = r^{-${j}}s$，所以 $${rPow(i)} s ${rPow(j)} = r^{${i} - ${j}} s = r^{${value}} s$。`,
          ),
        });
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
