import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { algebraDrawings2 } from "../explanation-drawings-abstract-algebra-2.ts";

import { numberProblem, why } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { divisors, gcd, mod, phi, texChoice, units } from "./abstract-algebra-common.ts";
import {
  composePerm,
  cyclePerm,
  cyclesOf,
  invertPerm,
  type Perm,
  permCycleTex,
  permOrder,
  productOfCycles,
  randomDisjointCycles,
} from "./abstract-algebra-permutations.ts";
import { apart, because, type Decision, decide } from "./abstract-algebra-quotients.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { range } from "./methods-of-proof-common.ts";

/** rPow writes the rotation rᵏ, without a redundant exponent. */
const rPow = (k: number) => (k === 0 ? "e" : k === 1 ? "r" : `r^{${k}}`);

// Abstract Algebra unit 6: group actions, orbits, stabilizers, Burnside's lemma and conjugacy.

/** factorial is n!. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

/** choose is the binomial coefficient C(n, k). */
const choose = (n: number, k: number) => factorial(n) / (factorial(k) * factorial(n - k));

/** zTex writes ℤₙ. */
const zTex = (n: number) => `\\mathbb{Z}_{${n}}`;

/** rsTex writes the dihedral element rᵏs. */
const rsTex = (k: number) => (k === 0 ? "s" : k === 1 ? "rs" : `${rPow(k)}s`);

/** pw writes kᵉ, or k when e = 1. */
const pw = (k: number, e: number) => (e === 1 ? `${k}` : `${k}^{${e}}`);

/** times writes c · x, or x alone when c = 1. */
const times = (c: number, x: string) => (c === 1 ? x : `${c} \\cdot ${x}`);

/** plural picks the singular or plural English noun for a count. */
const plural = (count: number, one: string, many: string) => (count === 1 ? one : many);

/** randomCyclePerm is a product of one or two disjoint cycles among n points, with its cycles. */
function randomCyclePerm(rng: Rng, n: number): Perm {
  const lengths = rng.bool() ? [rng.int(2, Math.min(n, 5))] : [rng.int(2, 3), 2];
  return productOfCycles(n, randomDisjointCycles(rng, n, lengths));
}

/** naturalActionsOfSymmetricAndDihedralGroups applies permutations to points and dihedral elements to vertices. */
export const naturalActionsOfSymmetricAndDihedralGroups: TopicDef = {
  id: "natural-actions-of-symmetric-and-dihedral-groups",
  title: t("Natural Actions of Symmetric and Dihedral Groups", "对称群与二面体群的自然作用"),
  summary: t(
    "Sₙ acts on {1, …, n} by σ · i = σ(i), and Dₙ acts on the vertices of a regular n-gon. Number the vertices 0, 1, …, n − 1 around the polygon, let r be the rotation v ↦ v + 1 and s the reflection v ↦ −v (mod n) fixing vertex 0; then rᵏ · v = v + k and rᵏs · v = k − v. Acting by a product means acting by the right factor first: (gh) · x = g · (h · x).",
    "Sₙ 通过 σ · i = σ(i) 作用于 {1, …, n}，Dₙ 作用于正 n 边形的顶点。把顶点沿多边形依次编号为 0, 1, …, n − 1，令 r 为旋转 v ↦ v + 1，s 为固定顶点 0 的反射 v ↦ −v (mod n)；则 rᵏ · v = v + k，rᵏs · v = k − v。用乘积作用时先作用右边的因子：(gh) · x = g · (h · x)。",
  ),
  intro: t(
    "In $S_5$ let $\\sigma = (1\\;2\\;3)$ and $\\tau = (2\\;4)$. Acting by $\\sigma\\tau$ means acting by $\\tau$ first: $(\\sigma\\tau) \\cdot 4 = \\sigma(\\tau(4)) = \\sigma(2) = 3$.\n\nCheck: written as one permutation, $\\sigma\\tau = (1\\;2\\;4\\;3)$, which also sends $4$ to $3$.\n\nIn this lesson we act on points by products of permutations and on the vertices of a regular polygon by dihedral elements.",
    "在 $S_5$ 中设 $\\sigma = (1\\;2\\;3)$，$\\tau = (2\\;4)$。用 $\\sigma\\tau$ 作用就是先用 $\\tau$ 作用：$(\\sigma\\tau) \\cdot 4 = \\sigma(\\tau(4)) = \\sigma(2) = 3$。\n\n检验：写成一个置换，$\\sigma\\tau = (1\\;2\\;4\\;3)$，它同样把 $4$ 映到 $3$。\n\n本课我们用置换的乘积作用于点，用二面体群的元素作用于正多边形的顶点。",
  ),
  prerequisites: ["group-homomorphisms"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "acting-by-products-of-permutations",
      title: t("Acting by permutations", "置换的作用"),
      explanation: t(
        "In an action the product acts by doing the right factor first and then the left factor, consistent with composition of functions. With $\\sigma = (1\\;3\\;5)$ and $\\tau = (1\\;2)(3\\;4)$: $(\\sigma\\tau) \\cdot 2 = \\sigma(\\tau(2)) = \\sigma(1) = 3$.\n\nWith $\\sigma = (1\\;2\\;4)$ and $\\tau = (2\\;3)$: $(\\sigma\\tau) \\cdot 3 = \\sigma(\\tau(3)) = \\sigma(2) = 4$.\n\nCheck: written as one permutation, $\\sigma\\tau = (1\\;2\\;3\\;4)$, which sends $3$ to $4$.\n\n> **Watch out.** Act by the right factor first: $(\\sigma\\tau) \\cdot i$ is $\\sigma(\\tau(i))$, not $\\tau(\\sigma(i))$. In the example above the wrong order gives $\\tau(\\sigma(3)) = \\tau(3) = 2$.",
        "在作用中，乘积先作用右边的因子再作用左边的因子，与函数的复合一致。设 $\\sigma = (1\\;3\\;5)$，$\\tau = (1\\;2)(3\\;4)$：$(\\sigma\\tau) \\cdot 2 = \\sigma(\\tau(2)) = \\sigma(1) = 3$。\n\n设 $\\sigma = (1\\;2\\;4)$，$\\tau = (2\\;3)$：$(\\sigma\\tau) \\cdot 3 = \\sigma(\\tau(3)) = \\sigma(2) = 4$。\n\n检验：写成一个置换，$\\sigma\\tau = (1\\;2\\;3\\;4)$，它把 $3$ 映到 $4$。\n\n> **注意。** 先作用右边的因子：$(\\sigma\\tau) \\cdot i$ 是 $\\sigma(\\tau(i))$，而不是 $\\tau(\\sigma(i))$。上例中顺序弄反会得到 $\\tau(\\sigma(3)) = \\tau(3) = 2$。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        let s: Perm;
        let tau: Perm;
        let i: number;
        do {
          s = randomCyclePerm(rng, n);
          tau = randomCyclePerm(rng, n);
          i = rng.int(0, n - 1);
        } while (tau[i] === i || s[tau[i]!] === tau[i] || s[tau[i]!] === tau[s[i]!]);
        const value = s[tau[i]!]! + 1;
        const mid = tau[i]! + 1;
        return numberProblem({
          prompt: t(
            `In $S_{${n}}$, let $\\sigma = ${permCycleTex(s)}$ and $\\tau = ${permCycleTex(tau)}$. Find $(\\sigma\\tau) \\cdot ${i + 1}$.`,
            `在 $S_{${n}}$ 中，设 $\\sigma = ${permCycleTex(s)}$，$\\tau = ${permCycleTex(tau)}$。求 $(\\sigma\\tau) \\cdot ${i + 1}$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              tau[s[i]!]! + 1,
              `That acts by $\\sigma$ first; in $\\sigma\\tau$ the right factor $\\tau$ acts first.`,
              `这是先用 $\\sigma$ 作用；在 $\\sigma\\tau$ 中先作用的是右边的因子 $\\tau$。`,
            ),
            why(s[i]! + 1, `That applies only $\\sigma$ and leaves out $\\tau$.`, `这只用了 $\\sigma$，漏掉了 $\\tau$。`),
            why(
              mid,
              `That applies only $\\tau$; $\\sigma$ must then act on $${mid}$.`,
              `这只用了 $\\tau$；接着还要用 $\\sigma$ 作用于 $${mid}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Apply the right factor", "先作用右边的因子"],
                t(
                  `$\\tau = ${permCycleTex(tau)}$ sends $${i + 1}$ to $${mid}$.`,
                  `$\\tau = ${permCycleTex(tau)}$ 把 $${i + 1}$ 映到 $${mid}$。`,
                ),
              ],
              [
                ["Then apply the left factor", "再作用左边的因子"],
                t(
                  `$\\sigma = ${permCycleTex(s)}$ sends $${mid}$ to $${value}$.`,
                  `$\\sigma = ${permCycleTex(s)}$ 把 $${mid}$ 映到 $${value}$。`,
                ),
              ],
            ],
            t(
              `Written as one permutation, $\\sigma\\tau = ${permCycleTex(composePerm(s, tau))}$, which also sends $${i + 1}$ to $${value}$.`,
              `写成一个置换，$\\sigma\\tau = ${permCycleTex(composePerm(s, tau))}$，它同样把 $${i + 1}$ 映到 $${value}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "dihedral-groups-acting-on-vertices",
      figure: algebraDrawings2["natural-actions-of-symmetric-and-dihedral-groups#dihedral-groups-acting-on-vertices"],
      title: t("Dihedral groups on vertices", "二面体群作用于顶点"),
      explanation: t(
        "Rotations shift the vertex labels and reflections reverse them, so a product acts by applying its factors one after another from the right. In $D_8$ with vertices $0, \\dots, 7$: $r^3s \\cdot 5 = r^3 \\cdot (s \\cdot 5) = r^3 \\cdot 3 = 6$, which agrees with $3 - 5 \\equiv 6 \\pmod 8$.\n\nIn $D_6$ with vertices $0, \\dots, 5$: $r^4s \\cdot 1 = r^4 \\cdot (s \\cdot 1) = r^4 \\cdot 5 = 9 \\equiv 3 \\pmod 6$.\n\nCheck: the formula $r^ks \\cdot v = k - v$ gives $4 - 1 = 3$.\n\n> **Watch out.** In $r^ks$ the reflection $s$ acts first. Rotating first and then reflecting gives $-(v + k)$, here $-5 \\equiv 1$, a different vertex.",
        "旋转平移顶点标号，反射使标号反向，所以乘积通过从右向左依次作用各个因子来作用。在 $D_8$ 中，顶点为 $0, \\dots, 7$：$r^3s \\cdot 5 = r^3 \\cdot (s \\cdot 5) = r^3 \\cdot 3 = 6$，与 $3 - 5 \\equiv 6 \\pmod 8$ 一致。\n\n在 $D_6$ 中，顶点为 $0, \\dots, 5$：$r^4s \\cdot 1 = r^4 \\cdot (s \\cdot 1) = r^4 \\cdot 5 = 9 \\equiv 3 \\pmod 6$。\n\n检验：公式 $r^ks \\cdot v = k - v$ 给出 $4 - 1 = 3$。\n\n> **注意。** 在 $r^ks$ 中先作用的是反射 $s$。先旋转再反射得到的是 $-(v + k)$，这里是 $-5 \\equiv 1$，是另一个顶点。",
      ),
      generate(rng) {
        const n = rng.int(5, 12);
        const k = rng.int(1, n - 1);
        let v: number;
        do v = rng.int(1, n - 1);
        while (mod(k - v, n) === mod(k + v, n));
        const value = mod(k - v, n);
        return numberProblem({
          prompt: t(
            `$D_{${n}}$ acts on the vertices $0, 1, \\dots, ${n - 1}$ of a regular ${n}-gon, where $r \\cdot v = v + 1$ and $s \\cdot v = -v \\pmod{${n}}$. Find $${rsTex(k)} \\cdot ${v}$.`,
            `$D_{${n}}$ 作用于正 ${n} 边形的顶点 $0, 1, \\dots, ${n - 1}$，其中 $r \\cdot v = v + 1$，$s \\cdot v = -v \\pmod{${n}}$。求 $${rsTex(k)} \\cdot ${v}$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(mod(k + v, n), `That rotates vertex $${v}$ without reflecting it first.`, `这是直接旋转顶点 $${v}$，没有先作反射。`),
            why(
              mod(v - k, n),
              `That subtracts $${k}$ from $${v}$; the reflection sends $${v}$ to $-${v}$ and the rotation then adds $${k}$.`,
              `这是从 $${v}$ 中减去 $${k}$；反射把 $${v}$ 变为 $-${v}$，然后旋转再加上 $${k}$。`,
            ),
            why(
              mod(-k - v, n),
              "That rotates first and then reflects; in $r^ks$ the reflection acts first.",
              "这是先旋转再反射；在 $r^ks$ 中先作用的是反射。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Reflect first", "先作反射"],
                t(
                  `$s \\cdot ${v} = -${v} \\equiv ${mod(-v, n)} \\pmod{${n}}$.`,
                  `$s \\cdot ${v} = -${v} \\equiv ${mod(-v, n)} \\pmod{${n}}$。`,
                ),
              ],
              [
                ["Then rotate", "再旋转"],
                t(
                  `$${rPow(k)}$ adds $${k}$: $${mod(-v, n)} + ${k} \\equiv ${value} \\pmod{${n}}$.`,
                  `$${rPow(k)}$ 加上 $${k}$：$${mod(-v, n)} + ${k} \\equiv ${value} \\pmod{${n}}$。`,
                ),
              ],
            ],
            t(
              `The formula $r^ks \\cdot v = k - v$ gives $${k} - ${v} \\equiv ${value} \\pmod{${n}}$.`,
              `公式 $r^ks \\cdot v = k - v$ 给出 $${k} - ${v} \\equiv ${value} \\pmod{${n}}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** groupActions decides which rules define group actions. */
export const groupActions: TopicDef = {
  id: "group-actions",
  title: t("Group Actions", "群作用"),
  summary: t(
    "An action of a group G on a set X assigns to each g ∈ G and x ∈ X an element g · x ∈ X such that e · x = x and (gh) · x = g · (h · x). Equivalently, it is a homomorphism from G to the group of permutations of X. Examples: a group acts on itself by left multiplication and by conjugation g · x = gxg⁻¹.",
    "群 G 在集合 X 上的作用对每个 g ∈ G、x ∈ X 指定 g · x ∈ X，使得 e · x = x 且 (gh) · x = g · (h · x)。等价地，它是从 G 到 X 的置换群的同态。例如：群通过左乘以及共轭 g · x = gxg⁻¹ 作用于自身。",
  ),
  intro: t(
    "Does $k \\cdot x = x + 3k$ define an action of $\\mathbb{Z}_4$ on $\\mathbb{Z}_{12}$? The elements $0$ and $4$ of $\\mathbb{Z}_4$ are equal, and they act alike because $3 \\cdot 4 = 12 \\equiv 0 \\pmod{12}$. Then $0 \\cdot x = x$ and $(j + k) \\cdot x = j \\cdot (k \\cdot x)$, so it is an action.\n\nCheck: $1 \\cdot 5 = 8$ and $5 \\cdot 5 = 5 + 15 = 20 \\equiv 8 \\pmod{12}$, the same, as $1 = 5$ in $\\mathbb{Z}_4$.\n\nIn this lesson we decide whether a rule defines a group action by checking that it is well defined and satisfies the two axioms.",
    "$k \\cdot x = x + 3k$ 是否定义了 $\\mathbb{Z}_4$ 在 $\\mathbb{Z}_{12}$ 上的作用？$\\mathbb{Z}_4$ 的元素 $0$ 与 $4$ 相等，而因为 $3 \\cdot 4 = 12 \\equiv 0 \\pmod{12}$，它们的作用相同。又 $0 \\cdot x = x$，$(j + k) \\cdot x = j \\cdot (k \\cdot x)$，所以这是一个作用。\n\n检验：$1 \\cdot 5 = 8$，而 $5 \\cdot 5 = 5 + 15 = 20 \\equiv 8 \\pmod{12}$，结果相同，正如在 $\\mathbb{Z}_4$ 中 $1 = 5$。\n\n本课我们通过检验规则是否良定义、是否满足两条公理，来判断它是否定义了群作用。",
  ),
  prerequisites: ["natural-actions-of-symmetric-and-dihedral-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "translation-actions-of-cyclic-groups",
      figure: algebraDrawings2["group-actions#translation-actions-of-cyclic-groups"],
      title: t("Translation actions", "平移作用"),
      explanation: t(
        "$k \\cdot x = x + 4k$ defines an action of $\\mathbb{Z}_6$ on $\\mathbb{Z}_{12}$ only if it is well defined: $k$ and $k + 6$ must act the same, so $4 \\cdot 6 = 24 \\equiv 0 \\pmod{12}$ is needed, and it holds.\n\n$k \\cdot x = x + 3k$ does not define an action of $\\mathbb{Z}_6$ on $\\mathbb{Z}_{12}$: $0$ and $6$ are the same element of $\\mathbb{Z}_6$, but $3 \\cdot 6 = 18 \\not\\equiv 0 \\pmod{12}$, so they would move $x$ differently.\n\nCheck: the rule sends $0 \\cdot 1$ to $1$ but $6 \\cdot 1$ to $19 \\equiv 7 \\pmod{12}$.\n\n> **Watch out.** For a rule on $\\mathbb{Z}_m$ the two axioms are not enough: $k$ and $k + m$ name the same element, so the rule must give them the same result, which needs $m \\cdot c \\equiv 0 \\pmod n$.",
        "$k \\cdot x = x + 4k$ 定义 $\\mathbb{Z}_6$ 在 $\\mathbb{Z}_{12}$ 上的作用，前提是良定义：$k$ 与 $k + 6$ 的作用必须相同，所以需要 $4 \\cdot 6 = 24 \\equiv 0 \\pmod{12}$，此式成立。\n\n$k \\cdot x = x + 3k$ 不定义 $\\mathbb{Z}_6$ 在 $\\mathbb{Z}_{12}$ 上的作用：$0$ 与 $6$ 是 $\\mathbb{Z}_6$ 中的同一元素，但 $3 \\cdot 6 = 18 \\not\\equiv 0 \\pmod{12}$，所以它们会以不同方式移动 $x$。\n\n检验：按此规则 $0 \\cdot 1$ 得 $1$，而 $6 \\cdot 1$ 得 $19 \\equiv 7 \\pmod{12}$。\n\n> **注意。** 对 $\\mathbb{Z}_m$ 上的规则，只验证两条公理还不够：$k$ 与 $k + m$ 表示同一元素，规则必须给出相同结果，这需要 $m \\cdot c \\equiv 0 \\pmod n$。",
      ),
      generate(rng) {
        const m = rng.int(2, 12);
        const n = rng.int(4, 24);
        const step = n / gcd(m, n);
        const c = rng.bool() && step < n ? step * rng.int(1, gcd(m, n) - 1) : rng.int(1, n - 1);
        const holds = mod(m * c, n) === 0;
        const shift = c === 1 ? `${m}` : `${m} \\cdot ${c} = ${m * c}`;
        return decide({
          prompt: t(
            `Does $k \\cdot x = x + ${c}k$ define an action of $${zTex(m)}$ on $${zTex(n)}$?`,
            `$k \\cdot x = x + ${c}k$ 是否定义了 $${zTex(m)}$ 在 $${zTex(n)}$ 上的作用？`,
          ),
          holds,
          steps: [
            [
              ["Compare equal elements", "比较相等的元素"],
              t(
                `$k$ and $k + ${m}$ are the same element of $${zTex(m)}$, so they must act alike; their shifts differ by $${shift}$.`,
                `$k$ 与 $k + ${m}$ 是 $${zTex(m)}$ 中的同一元素，所以作用必须相同；它们的平移量相差 $${shift}$。`,
              ),
            ],
            [
              ["Reduce the difference", "约简差值"],
              holds
                ? t(
                    `$${m * c} \\equiv 0 \\pmod{${n}}$, so the rule is well defined; $0 \\cdot x = x$ and $(j + k) \\cdot x = j \\cdot (k \\cdot x)$ hold because addition is associative.`,
                    `$${m * c} \\equiv 0 \\pmod{${n}}$，所以规则良定义；又因加法满足结合律，$0 \\cdot x = x$ 与 $(j + k) \\cdot x = j \\cdot (k \\cdot x)$ 成立。`,
                  )
                : t(
                    `$${m * c} \\equiv ${mod(m * c, n)} \\pmod{${n}}$, not $0$, so $0$ and $${m}$ would move $x$ differently.`,
                    `$${m * c} \\equiv ${mod(m * c, n)} \\pmod{${n}}$，不是 $0$，所以 $0$ 与 $${m}$ 会以不同方式移动 $x$。`,
                  ),
            ],
          ],
          check: holds
            ? t(
                `Acting by $${m}$ moves $0$ to $${m * c} \\equiv 0$, just as acting by $0$ does.`,
                `用 $${m}$ 作用把 $0$ 移到 $${m * c} \\equiv 0$，与用 $0$ 作用相同。`,
              )
            : t(
                `Acting by $0$ leaves $0$ in place, but acting by $${m}$, the same element, moves it to $${mod(m * c, n)}$.`,
                `用 $0$ 作用使 $0$ 保持不动，而用同一元素 $${m}$ 作用却把它移到 $${mod(m * c, n)}$。`,
              ),
          wrong: holds
            ? t(
                `The rule is well defined, since $${m * c}$ is a multiple of $${n}$, and both axioms hold.`,
                `规则是良定义的，因为 $${m * c}$ 是 $${n}$ 的倍数，并且两条公理都成立。`,
              )
            : t(
                `The axioms look fine, but $0$ and $${m}$ are equal in $${zTex(m)}$ and act differently, so the rule is not well defined.`,
                `两条公理看似成立，但 $0$ 与 $${m}$ 在 $${zTex(m)}$ 中相等却作用不同，所以规则不是良定义的。`,
              ),
        });
      },
    },
    {
      id: "checking-the-action-axioms",
      title: t("Checking the axioms", "检验公理"),
      explanation: t(
        "A rule is an action when the identity fixes every point and acting by a product equals acting by the factors in turn. $a \\cdot x = a^2x$ is an action of $\\mathbb{R}^*$ on $\\mathbb{R}$: $1 \\cdot x = x$ and $(ab)^2x = a^2(b^2x)$. But $a \\cdot x = 2ax$ is not: $1 \\cdot x = 2x \\ne x$.\n\n$n \\cdot x = x + 3n$ is an action of $\\mathbb{Z}$ on $\\mathbb{R}$: $0 \\cdot x = x$, and $(m + n) \\cdot x = x + 3m + 3n = m \\cdot (n \\cdot x)$.\n\nCheck: $2 \\cdot (1 \\cdot 0) = 2 \\cdot 3 = 9$, and $3 \\cdot 0 = 9$ as well.\n\n> **Watch out.** Test both axioms. A rule can let the identity fix every point and still fail on products, like $n \\cdot x = x + n^2$, where $2 \\cdot x = x + 4$ but acting by $1$ twice gives $x + 2$.",
        "如果单位元固定每个点，并且用乘积作用等于依次用各因子作用，这个规则就是一个作用。$a \\cdot x = a^2x$ 是 $\\mathbb{R}^*$ 在 $\\mathbb{R}$ 上的作用：$1 \\cdot x = x$，且 $(ab)^2x = a^2(b^2x)$。但 $a \\cdot x = 2ax$ 不是：$1 \\cdot x = 2x \\ne x$。\n\n$n \\cdot x = x + 3n$ 是 $\\mathbb{Z}$ 在 $\\mathbb{R}$ 上的作用：$0 \\cdot x = x$，且 $(m + n) \\cdot x = x + 3m + 3n = m \\cdot (n \\cdot x)$。\n\n检验：$2 \\cdot (1 \\cdot 0) = 2 \\cdot 3 = 9$，而 $3 \\cdot 0 = 9$，两者相同。\n\n> **注意。** 两条公理都要检验。规则可能让单位元固定每个点，却在乘积上不成立，例如 $n \\cdot x = x + n^2$：$2 \\cdot x = x + 4$，而用 $1$ 作用两次得到 $x + 2$。",
      ),
      generate(rng) {
        const c = rng.int(2, 9);
        const identity = ["Check the identity", "检验单位元"] as const;
        const products = ["Check products", "检验乘积"] as const;
        const facts: Decision[] = [
          {
            prompt: t(
              `Does $t \\cdot (x, y) = (x + ${c}t, y)$ define an action of $\\mathbb{R}$ on $\\mathbb{R}^2$?`,
              `$t \\cdot (x, y) = (x + ${c}t, y)$ 是否定义了 $\\mathbb{R}$ 在 $\\mathbb{R}^2$ 上的作用？`,
            ),
            holds: true,
            steps: [
              [identity, t("$0 \\cdot (x, y) = (x, y)$.", "$0 \\cdot (x, y) = (x, y)$。")],
              [
                products,
                t(
                  `$(s + t) \\cdot (x, y) = (x + ${c}s + ${c}t, y) = s \\cdot (t \\cdot (x, y))$.`,
                  `$(s + t) \\cdot (x, y) = (x + ${c}s + ${c}t, y) = s \\cdot (t \\cdot (x, y))$。`,
                ),
              ],
            ],
            check: t(
              `$2 \\cdot (3 \\cdot (0, 0)) = 2 \\cdot (${3 * c}, 0) = (${5 * c}, 0) = 5 \\cdot (0, 0)$.`,
              `$2 \\cdot (3 \\cdot (0, 0)) = 2 \\cdot (${3 * c}, 0) = (${5 * c}, 0) = 5 \\cdot (0, 0)$。`,
            ),
            wrong: t(
              "Both axioms hold: $0$ acts trivially, and acting by $s + t$ is acting by $t$ and then by $s$.",
              "两条公理都成立：$0$ 的作用平凡，用 $s + t$ 作用等于先用 $t$ 再用 $s$ 作用。",
            ),
          },
          {
            prompt: t(
              `Does $t \\cdot (x, y) = (x + t, y + ${c}t^2)$ define an action of $\\mathbb{R}$ on $\\mathbb{R}^2$?`,
              `$t \\cdot (x, y) = (x + t, y + ${c}t^2)$ 是否定义了 $\\mathbb{R}$ 在 $\\mathbb{R}^2$ 上的作用？`,
            ),
            holds: false,
            steps: [
              [identity, t("$0 \\cdot (x, y) = (x, y)$, so the identity is fine.", "$0 \\cdot (x, y) = (x, y)$，单位元没有问题。")],
              [
                products,
                t(
                  `$(s + t) \\cdot$ adds $${c}(s + t)^2$ to $y$, but acting by $t$ and then by $s$ adds $${c}s^2 + ${c}t^2$.`,
                  `$(s + t) \\cdot$ 给 $y$ 加上 $${c}(s + t)^2$，而先用 $t$ 再用 $s$ 作用加上的是 $${c}s^2 + ${c}t^2$。`,
                ),
              ],
            ],
            check: t(
              `With $s = t = 2$: $4 \\cdot (0, 0) = (4, ${16 * c})$, but $2 \\cdot (2 \\cdot (0, 0)) = (4, ${8 * c})$.`,
              `取 $s = t = 2$：$4 \\cdot (0, 0) = (4, ${16 * c})$，而 $2 \\cdot (2 \\cdot (0, 0)) = (4, ${8 * c})$。`,
            ),
            wrong: t(
              "The identity acts trivially, but products fail, since $(s + t)^2 \\ne s^2 + t^2$ in general.",
              "单位元的作用平凡，但乘积不满足，因为一般 $(s + t)^2 \\ne s^2 + t^2$。",
            ),
          },
          {
            prompt: t(
              `Does $a \\cdot x = a^{${c}}x$ define an action of $\\mathbb{R}^*$ on $\\mathbb{R}$?`,
              `$a \\cdot x = a^{${c}}x$ 是否定义了 $\\mathbb{R}^*$ 在 $\\mathbb{R}$ 上的作用？`,
            ),
            holds: true,
            steps: [
              [identity, t(`$1^{${c}}x = x$.`, `$1^{${c}}x = x$。`)],
              [products, t(`$(ab)^{${c}}x = a^{${c}}(b^{${c}}x)$.`, `$(ab)^{${c}}x = a^{${c}}(b^{${c}}x)$。`)],
            ],
            check: t(
              `$2 \\cdot (3 \\cdot x) = 2^{${c}}3^{${c}}x = 6^{${c}}x = 6 \\cdot x$.`,
              `$2 \\cdot (3 \\cdot x) = 2^{${c}}3^{${c}}x = 6^{${c}}x = 6 \\cdot x$。`,
            ),
            wrong: t(
              `Both axioms hold, since powers multiply: $(ab)^{${c}} = a^{${c}}b^{${c}}$.`,
              `两条公理都成立，因为幂可以相乘：$(ab)^{${c}} = a^{${c}}b^{${c}}$。`,
            ),
          },
          {
            prompt: t(
              `Does $a \\cdot x = ${c}ax$ define an action of $\\mathbb{R}^*$ on $\\mathbb{R}$?`,
              `$a \\cdot x = ${c}ax$ 是否定义了 $\\mathbb{R}^*$ 在 $\\mathbb{R}$ 上的作用？`,
            ),
            holds: false,
            steps: [
              [identity, t(`The identity $1$ sends $x$ to $${c}x$, not to $x$.`, `单位元 $1$ 把 $x$ 映到 $${c}x$，而不是 $x$。`)],
              [
                products,
                t(
                  `Products fail too: $(ab) \\cdot x = ${c}abx$, but $a \\cdot (b \\cdot x) = ${c * c}abx$.`,
                  `乘积也不满足：$(ab) \\cdot x = ${c}abx$，而 $a \\cdot (b \\cdot x) = ${c * c}abx$。`,
                ),
              ],
            ],
            check: t(`The identity sends $5$ to $${5 * c}$, not to $5$.`, `单位元把 $5$ 映到 $${5 * c}$，而不是 $5$。`),
            wrong: t(
              `An action must let the identity fix every point, and here it multiplies by $${c}$.`,
              `作用必须使单位元固定每个点，而这里单位元乘以 $${c}$。`,
            ),
          },
          {
            prompt: t(
              `Does $n \\cdot x = ${c}^n x$ define an action of $\\mathbb{Z}$ on $\\mathbb{R}$?`,
              `$n \\cdot x = ${c}^n x$ 是否定义了 $\\mathbb{Z}$ 在 $\\mathbb{R}$ 上的作用？`,
            ),
            holds: true,
            steps: [
              [identity, t(`$${c}^0x = x$.`, `$${c}^0x = x$。`)],
              [products, t(`$${c}^{m + n}x = ${c}^m(${c}^nx)$.`, `$${c}^{m + n}x = ${c}^m(${c}^nx)$。`)],
            ],
            check: t(
              `$2 \\cdot (3 \\cdot x) = ${c}^2 \\cdot ${c}^3x = ${c}^5x = 5 \\cdot x$.`,
              `$2 \\cdot (3 \\cdot x) = ${c}^2 \\cdot ${c}^3x = ${c}^5x = 5 \\cdot x$。`,
            ),
            wrong: t(
              `Both axioms hold, since exponents add: $${c}^{m + n} = ${c}^m \\cdot ${c}^n$.`,
              `两条公理都成立，因为指数相加：$${c}^{m + n} = ${c}^m \\cdot ${c}^n$。`,
            ),
          },
          {
            prompt: t(
              `Does $n \\cdot x = x + ${c}n^2$ define an action of $\\mathbb{Z}$ on $\\mathbb{R}$?`,
              `$n \\cdot x = x + ${c}n^2$ 是否定义了 $\\mathbb{Z}$ 在 $\\mathbb{R}$ 上的作用？`,
            ),
            holds: false,
            steps: [
              [identity, t("$0 \\cdot x = x$, so the identity is fine.", "$0 \\cdot x = x$，单位元没有问题。")],
              [
                products,
                t(
                  `$2 \\cdot x = x + ${4 * c}$, but acting by $1$ twice gives $x + ${2 * c}$.`,
                  `$2 \\cdot x = x + ${4 * c}$，而用 $1$ 作用两次得到 $x + ${2 * c}$。`,
                ),
              ],
            ],
            check: t(
              `$${c}(1 + 1)^2 = ${4 * c}$, while $${c} + ${c} = ${2 * c}$.`,
              `$${c}(1 + 1)^2 = ${4 * c}$，而 $${c} + ${c} = ${2 * c}$。`,
            ),
            wrong: t(
              "The identity acts trivially, but products fail, since $(m + n)^2 \\ne m^2 + n^2$ in general.",
              "单位元的作用平凡，但乘积不满足，因为一般 $(m + n)^2 \\ne m^2 + n^2$。",
            ),
          },
          {
            prompt: t(
              `Does $a \\cdot x = x + ${c}(a - 1)$ define an action of $\\mathbb{R}^*$ on $\\mathbb{R}$?`,
              `$a \\cdot x = x + ${c}(a - 1)$ 是否定义了 $\\mathbb{R}^*$ 在 $\\mathbb{R}$ 上的作用？`,
            ),
            holds: false,
            steps: [
              [
                identity,
                t(
                  `The identity $1$ adds $${c}(1 - 1) = 0$, so it fixes every point.`,
                  `单位元 $1$ 加上 $${c}(1 - 1) = 0$，所以固定每个点。`,
                ),
              ],
              [
                products,
                t(
                  `$(2 \\cdot 2) \\cdot x$ adds $${c}(4 - 1) = ${3 * c}$, but acting by $2$ twice adds $${c} + ${c} = ${2 * c}$.`,
                  `$(2 \\cdot 2) \\cdot x$ 加上 $${c}(4 - 1) = ${3 * c}$，而用 $2$ 作用两次加上 $${c} + ${c} = ${2 * c}$。`,
                ),
              ],
            ],
            check: t(
              `Starting from $0$: $4 \\cdot 0 = ${3 * c}$, but $2 \\cdot (2 \\cdot 0) = 2 \\cdot ${c} = ${2 * c}$.`,
              `从 $0$ 出发：$4 \\cdot 0 = ${3 * c}$，而 $2 \\cdot (2 \\cdot 0) = 2 \\cdot ${c} = ${2 * c}$。`,
            ),
            wrong: t(
              "The identity acts trivially, but products fail: the rule adds amounts for a sum, while the group multiplies.",
              "单位元的作用平凡，但乘积不满足：规则对和相加，而群运算是乘法。",
            ),
          },
          {
            prompt: t(
              `Does $n \\cdot x = x + ${c}n$ define an action of $\\mathbb{Z}$ on $\\mathbb{R}$?`,
              `$n \\cdot x = x + ${c}n$ 是否定义了 $\\mathbb{Z}$ 在 $\\mathbb{R}$ 上的作用？`,
            ),
            holds: true,
            steps: [
              [identity, t("$0 \\cdot x = x$.", "$0 \\cdot x = x$。")],
              [
                products,
                t(
                  `$(m + n) \\cdot x = x + ${c}m + ${c}n = m \\cdot (n \\cdot x)$.`,
                  `$(m + n) \\cdot x = x + ${c}m + ${c}n = m \\cdot (n \\cdot x)$。`,
                ),
              ],
            ],
            check: t(
              `$2 \\cdot (3 \\cdot 0) = 2 \\cdot ${3 * c} = ${5 * c}$, and $5 \\cdot 0 = ${5 * c}$ as well.`,
              `$2 \\cdot (3 \\cdot 0) = 2 \\cdot ${3 * c} = ${5 * c}$，而 $5 \\cdot 0 = ${5 * c}$，两者相同。`,
            ),
            wrong: t(
              "Both axioms hold: $0$ adds nothing, and the shifts for $m$ and $n$ add up to the shift for $m + n$.",
              "两条公理都成立：$0$ 不加任何量，$m$ 与 $n$ 的平移量之和等于 $m + n$ 的平移量。",
            ),
          },
        ];
        return decide(rng.pick(facts));
      },
    },
  ],
};

/** orbitsOfUnits lists the orbits of ⟨a⟩ ≤ U(n) acting on ℤₙ by multiplication. */
function orbitsOfUnits(a: number, n: number): number[][] {
  const seen = new Set<number>();
  const out: number[][] = [];
  for (let x = 0; x < n; x++) {
    if (seen.has(x)) continue;
    const orbit: number[] = [];
    for (let y = x; !seen.has(y); y = mod(y * a, n)) {
      seen.add(y);
      orbit.push(y);
    }
    out.push(orbit);
  }
  return out;
}

/** orbits finds orbits of cyclic groups of permutations and of units. */
export const orbits: TopicDef = {
  id: "orbits",
  title: t("Orbits", "轨道"),
  summary: t(
    "The orbit of x under an action of G is G · x = {g · x : g ∈ G}. Orbits partition X: x and y lie in the same orbit exactly when y = g · x for some g. Under ⟨σ⟩ ≤ Sₙ acting on {1, …, n}, the orbits are the cycles of σ, including its fixed points.",
    "x 在 G 作用下的轨道为 G · x = {g · x : g ∈ G}。轨道划分 X：x 与 y 在同一轨道中当且仅当存在 g 使 y = g · x。在 ⟨σ⟩ ≤ Sₙ 作用于 {1, …, n} 时，轨道就是 σ 的轮换（包括不动点）。",
  ),
  intro: t(
    "$\\langle (1\\;3)(2\\;5\\;4) \\rangle$ acting on $\\{1, \\dots, 6\\}$ has orbits $\\{1, 3\\}$, $\\{2, 4, 5\\}$ and $\\{6\\}$: $3$ orbits.\n\nCheck: the orbits hold $2 + 3 + 1 = 6$ points, every point exactly once.\n\nIn this lesson we find the orbits of a cyclic group of permutations and of a group of units acting by multiplication.",
    "$\\langle (1\\;3)(2\\;5\\;4) \\rangle$ 作用于 $\\{1, \\dots, 6\\}$ 时的轨道为 $\\{1, 3\\}$、$\\{2, 4, 5\\}$ 与 $\\{6\\}$：共 $3$ 个轨道。\n\n检验：这些轨道共含 $2 + 3 + 1 = 6$ 个点，每个点恰好出现一次。\n\n本课我们求置换生成的循环群的轨道，以及单位群通过乘法作用时的轨道。",
  ),
  prerequisites: ["group-actions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orbits-of-cyclic-groups-of-permutations",
      title: t("Orbits of a permutation", "置换的轨道"),
      explanation: t(
        "The orbits under the group generated by a permutation are the sets of points in each of its cycles, including fixed points on their own. $\\langle (1\\;4\\;2)(3\\;5) \\rangle$ acting on $\\{1, \\dots, 7\\}$ has orbits $\\{1, 2, 4\\}$, $\\{3, 5\\}$, $\\{6\\}$ and $\\{7\\}$: $4$ orbits.\n\n$\\langle (2\\;6)(3\\;5\\;7) \\rangle$ acting on $\\{1, \\dots, 8\\}$ has orbits $\\{2, 6\\}$, $\\{3, 5, 7\\}$, $\\{1\\}$, $\\{4\\}$ and $\\{8\\}$: $5$ orbits.\n\nCheck: the orbits hold $2 + 3 + 1 + 1 + 1 = 8$ points, each once.\n\n> **Watch out.** Every point the permutation leaves alone is an orbit of its own, so count the fixed points as well as the cycles.",
        "由一个置换生成的群作用下的轨道就是它的各个轮换中的点集，不动点各自单独成一个轨道。$\\langle (1\\;4\\;2)(3\\;5) \\rangle$ 作用于 $\\{1, \\dots, 7\\}$ 时的轨道为 $\\{1, 2, 4\\}$、$\\{3, 5\\}$、$\\{6\\}$、$\\{7\\}$：共 $4$ 个轨道。\n\n$\\langle (2\\;6)(3\\;5\\;7) \\rangle$ 作用于 $\\{1, \\dots, 8\\}$ 时的轨道为 $\\{2, 6\\}$、$\\{3, 5, 7\\}$、$\\{1\\}$、$\\{4\\}$ 与 $\\{8\\}$：共 $5$ 个轨道。\n\n检验：这些轨道共含 $2 + 3 + 1 + 1 + 1 = 8$ 个点，每个点一次。\n\n> **注意。** 置换不动的每个点都单独构成一个轨道，所以除了轮换，还要数不动点。",
      ),
      generate(rng) {
        const n = rng.int(6, 10);
        const s = randomCyclePerm(rng, n);
        const cs = cyclesOf(s);
        const fixed = n - cs.reduce((a, c) => a + c.length, 0);
        const value = cs.length + fixed;
        const sets = cs
          .map(
            (c) =>
              `\\{${[...c]
                .sort((a, b) => a - b)
                .map((x) => x + 1)
                .join(", ")}\\}`,
          )
          .join(", ");
        const sizes = [...cs.map((c) => c.length), ...Array<number>(fixed).fill(1)].join(" + ");
        return numberProblem({
          prompt: t(
            `How many orbits does $\\langle ${permCycleTex(s)} \\rangle$ have, acting on $\\{1, \\dots, ${n}\\}$?`,
            `$\\langle ${permCycleTex(s)} \\rangle$ 作用于 $\\{1, \\dots, ${n}\\}$ 时有多少个轨道？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(cs.length, "That counts only the cycles; each fixed point is an orbit too.", "这只数了轮换；每个不动点也是一个轨道。"),
            why(fixed, "That counts only the fixed points; each cycle is an orbit too.", "这只数了不动点；每个轮换也是一个轨道。"),
            why(
              value + 1,
              "There is one orbit for each cycle and one for each fixed point, and no more.",
              "每个轮换是一个轨道，每个不动点也是一个轨道，没有别的轨道。",
            ),
            why(
              n - cs.length,
              "That subtracts the number of cycles from the number of points; add the cycles and the fixed points instead.",
              "这是用点数减去轮换个数；应当把轮换个数与不动点个数相加。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Read off the cycles", "读出轮换"],
                t(
                  `The cycles of $${permCycleTex(s)}$ give the ${plural(cs.length, "orbit", "orbits")} $${sets}$: $${cs.length}$.`,
                  `$${permCycleTex(s)}$ 的轮换给出轨道 $${sets}$：共 $${cs.length}$ 个。`,
                ),
              ],
              [
                ["Add the fixed points", "加上不动点"],
                t(
                  `${fixed === 1 ? "The remaining point is fixed and is an orbit" : `The other $${fixed}$ points are fixed, each an orbit`} of its own: $${cs.length} + ${fixed} = ${value}$.`,
                  `其余 $${fixed}$ 个点都是不动点，各自单独成一个轨道：$${cs.length} + ${fixed} = ${value}$。`,
                ),
              ],
            ],
            t(`The orbits hold $${sizes} = ${n}$ points, each point once.`, `这些轨道共含 $${sizes} = ${n}$ 个点，每个点一次。`),
          ),
        });
      },
    },
    {
      id: "orbits-of-units-acting-by-multiplication",
      title: t("Orbits of multiplication", "乘法作用的轨道"),
      explanation: t(
        "The orbit of a point collects everything the group can move it to, and the orbits split the whole set into disjoint pieces. $H = \\langle 2 \\rangle = \\{1, 2, 4\\} \\le U(7)$ acts on $\\mathbb{Z}_7$ by multiplication. The orbits are $\\{0\\}$, $\\{1, 2, 4\\}$ and $\\{3, 6, 5\\}$.\n\n$H = \\langle 4 \\rangle = \\{1, 4\\} \\le U(5)$ acting on $\\mathbb{Z}_5$ has orbits $\\{0\\}$, $\\{1, 4\\}$ and $\\{2, 3\\}$: $3$ orbits, since $2 \\cdot 4 = 8 \\equiv 3$.\n\nCheck: the orbits hold $1 + 2 + 2 = 5$ elements, all of $\\mathbb{Z}_5$.\n\n> **Watch out.** $h \\cdot 0 = 0$ for every $h$, so $\\{0\\}$ is always an orbit on its own; do not leave it out.",
        "一个点的轨道收集了群能把它移动到的所有点，各个轨道把整个集合分成不相交的部分。$H = \\langle 2 \\rangle = \\{1, 2, 4\\} \\le U(7)$ 通过乘法作用于 $\\mathbb{Z}_7$。轨道为 $\\{0\\}$、$\\{1, 2, 4\\}$ 与 $\\{3, 6, 5\\}$。\n\n$H = \\langle 4 \\rangle = \\{1, 4\\} \\le U(5)$ 作用于 $\\mathbb{Z}_5$ 时的轨道为 $\\{0\\}$、$\\{1, 4\\}$ 与 $\\{2, 3\\}$：共 $3$ 个，因为 $2 \\cdot 4 = 8 \\equiv 3$。\n\n检验：这些轨道共含 $1 + 2 + 2 = 5$ 个元素，正是整个 $\\mathbb{Z}_5$。\n\n> **注意。** 对每个 $h$ 都有 $h \\cdot 0 = 0$，所以 $\\{0\\}$ 总是单独成一个轨道；不要漏掉它。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(7, 30);
          a = rng.pick(units(n));
        } while (a === 1);
        const os = orbitsOfUnits(a, n);
        const h = os[1]!;
        const list = os.map((o) => `\\{${o.join(", ")}\\}`).join(", ");
        return numberProblem({
          prompt: t(
            `$H = \\langle ${a} \\rangle \\le U(${n})$ acts on $${zTex(n)}$ by $h \\cdot x = hx$. How many orbits are there?`,
            `$H = \\langle ${a} \\rangle \\le U(${n})$ 通过 $h \\cdot x = hx$ 作用于 $${zTex(n)}$。共有多少个轨道？`,
          ),
          answer: os.length,
          mistakes: apart(os.length, [
            why(
              os.length - 1,
              "That leaves out the orbit $\\{0\\}$: every unit fixes $0$.",
              "这漏掉了轨道 $\\{0\\}$：每个单位都固定 $0$。",
            ),
            why(
              Math.floor(n / h.length),
              `That divides $${n}$ by the size of the orbit of $1$, but the orbits need not all have that size, and $\\{0\\}$ has one element.`,
              `这是用 $${n}$ 除以 $1$ 的轨道大小，但各轨道不一定都是这个大小，而且 $\\{0\\}$ 只有一个元素。`,
            ),
            why(
              os.length + 1,
              "Each element lies in exactly one orbit, so there are no further orbits.",
              "每个元素恰好属于一个轨道，所以没有更多的轨道。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the subgroup", "求子群"],
                t(
                  `The powers of $${a}$ modulo $${n}$ give $H = \\{${h.join(", ")}\\}$, which is also the orbit of $1$.`,
                  `$${a}$ 模 $${n}$ 的各次幂给出 $H = \\{${h.join(", ")}\\}$，这也是 $1$ 的轨道。`,
                ),
              ],
              [
                ["List the orbits", "列出轨道"],
                t(
                  `Multiplying each point by the elements of $H$ gives the orbits $${list}$: $${os.length}$ in all.`,
                  `用 $H$ 的元素去乘每个点，得到轨道 $${list}$：共 $${os.length}$ 个。`,
                ),
              ],
            ],
            t(
              `The orbit sizes add up to $${os.map((o) => o.length).join(" + ")} = ${n}$, every element of $${zTex(n)}$ once.`,
              `各轨道大小之和为 $${os.map((o) => o.length).join(" + ")} = ${n}$，$${zTex(n)}$ 的每个元素恰好一次。`,
            ),
          ),
        });
      },
    },
  ],
};

/** stabilizers finds stabilizers in dihedral and symmetric groups. */
export const stabilizers: TopicDef = {
  id: "stabilizers",
  title: t("Stabilizers", "稳定子"),
  summary: t(
    "The stabilizer of $x$ is $G_x = \\{g \\in G : g \\cdot x = x\\}$, a subgroup of $G$. In $D_n$ acting on the vertices of an $n$-gon, the stabilizer of a vertex is $\\{e, s\\}$, where $s$ is the reflection through it. In $S_n$, the stabilizer of a $k$-element subset has $k!(n - k)!$ elements, and the permutations fixing $k$ given points one by one form a copy of $S_{n-k}$.",
    "$x$ 的稳定子为 $G_x = \\{g \\in G : g \\cdot x = x\\}$，它是 $G$ 的子群。在 $D_n$ 作用于 $n$ 边形顶点时，一个顶点的稳定子为 $\\{e, s\\}$，其中 $s$ 是过该顶点的反射。在 $S_n$ 中，$k$ 元子集的稳定子有 $k!(n - k)!$ 个元素，逐点固定 $k$ 个给定点的置换构成 $S_{n-k}$ 的一个拷贝。",
  ),
  intro: t(
    "$S_5$ acts on the subsets of $\\{1, \\dots, 5\\}$. The stabilizer of $\\{1, 2, 3\\}$ permutes $\\{1, 2, 3\\}$ among themselves and $\\{4, 5\\}$ among themselves: $3! \\cdot 2! = 12$ elements.\n\nCheck: $S_5$ moves $\\{1, 2, 3\\}$ to any of the $\\binom{5}{3} = 10$ three-element subsets, and $10 \\cdot 12 = 120 = 5!$.\n\nIn this lesson we find the stabilizers of vertices in dihedral groups and of points and subsets in symmetric groups.",
    "$S_5$ 作用于 $\\{1, \\dots, 5\\}$ 的子集。$\\{1, 2, 3\\}$ 的稳定子在 $\\{1, 2, 3\\}$ 之间置换，在 $\\{4, 5\\}$ 之间置换：共 $3! \\cdot 2! = 12$ 个元素。\n\n检验：$S_5$ 能把 $\\{1, 2, 3\\}$ 移到 $\\binom{5}{3} = 10$ 个三元子集中的任何一个，且 $10 \\cdot 12 = 120 = 5!$。\n\n本课我们求二面体群中顶点的稳定子，以及对称群中点和子集的稳定子。",
  ),
  prerequisites: ["orbits"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "stabilizers-of-vertices-in-dihedral-groups",
      figure: algebraDrawings2["stabilizers#stabilizers-of-vertices-in-dihedral-groups"],
      title: t("Stabilizers of vertices", "顶点的稳定子"),
      explanation: t(
        "The stabilizer of a vertex contains the group elements that fix it, which are the identity and the reflection through that vertex. With $r^ks \\cdot v = k - v$, the reflection $r^ks$ fixes $v$ when $k \\equiv 2v \\pmod n$. In $D_8$, vertex $3$ is fixed by $r^6s$, so its stabilizer is $\\{e, r^6s\\}$.\n\nIn $D_5$, vertex $4$ is fixed by $r^ks$ when $k \\equiv 8 \\equiv 3 \\pmod 5$, so its stabilizer is $\\{e, r^3s\\}$.\n\nCheck: $r^3s \\cdot 4 = 3 - 4 \\equiv 4 \\pmod 5$.\n\n> **Watch out.** The reflection through vertex $v$ is $r^{2v}s$, not $r^vs$: solve $k - v \\equiv v$, which gives $k \\equiv 2v$.",
        "一个顶点的稳定子包含固定它的群元素，也就是恒等元和经过该顶点的反射。由 $r^ks \\cdot v = k - v$，反射 $r^ks$ 固定 $v$ 当且仅当 $k \\equiv 2v \\pmod n$。在 $D_8$ 中，顶点 $3$ 被 $r^6s$ 固定，所以它的稳定子为 $\\{e, r^6s\\}$。\n\n在 $D_5$ 中，$r^ks$ 固定顶点 $4$ 当且仅当 $k \\equiv 8 \\equiv 3 \\pmod 5$，所以它的稳定子为 $\\{e, r^3s\\}$。\n\n检验：$r^3s \\cdot 4 = 3 - 4 \\equiv 4 \\pmod 5$。\n\n> **注意。** 经过顶点 $v$ 的反射是 $r^{2v}s$，而不是 $r^vs$：解 $k - v \\equiv v$ 得 $k \\equiv 2v$。",
      ),
      generate(rng) {
        const n = rng.int(5, 14);
        const v = rng.int(1, n - 1);
        const k = mod(2 * v, n);
        const reasons: Reason[] = [
          because(
            rsTex(v),
            `$${rsTex(v)} \\cdot ${v} = ${v} - ${v} = 0$, so it moves vertex $${v}$ to $0$.`,
            `$${rsTex(v)} \\cdot ${v} = ${v} - ${v} = 0$，它把顶点 $${v}$ 移到 $0$。`,
          ),
          because(
            rsTex(mod(-v, n)),
            `$${rsTex(mod(-v, n))} \\cdot ${v} \\equiv -${2 * v} \\equiv ${mod(-2 * v, n)} \\pmod{${n}}$, not $${v}$.`,
            `$${rsTex(mod(-v, n))} \\cdot ${v} \\equiv -${2 * v} \\equiv ${mod(-2 * v, n)} \\pmod{${n}}$，不是 $${v}$。`,
          ),
          because(
            rsTex(mod(k + 1, n)),
            `$${rsTex(mod(k + 1, n))}$ sends vertex $${v}$ to $${mod(v + 1, n)}$, one step past it.`,
            `$${rsTex(mod(k + 1, n))}$ 把顶点 $${v}$ 移到 $${mod(v + 1, n)}$，差了一步。`,
          ),
          because(
            rPow(v),
            `The rotation $${rPow(v)}$ moves every vertex $${v}$ ${plural(v, "step", "steps")}; only the identity rotation fixes a vertex.`,
            `旋转 $${rPow(v)}$ 把每个顶点移动 $${v}$ 步；只有恒等旋转才固定顶点。`,
          ),
          because(
            "s",
            `$s \\cdot ${v} = -${v} \\equiv ${mod(-v, n)} \\pmod{${n}}$, not $${v}$.`,
            `$s \\cdot ${v} = -${v} \\equiv ${mod(-v, n)} \\pmod{${n}}$，不是 $${v}$。`,
          ),
        ];
        return reasoned(
          texChoice(
            rng,
            t(
              `$D_{${n}}$ acts on the vertices $0, \\dots, ${n - 1}$ of a regular ${n}-gon with $r \\cdot v = v + 1$ and $s \\cdot v = -v$. Which element is in the stabilizer of vertex $${v}$?`,
              `$D_{${n}}$ 作用于正 ${n} 边形的顶点 $0, \\dots, ${n - 1}$，$r \\cdot v = v + 1$，$s \\cdot v = -v$。哪个元素属于顶点 $${v}$ 的稳定子？`,
            ),
            rsTex(k),
            [rsTex(v), rsTex(mod(-v, n)), rsTex(mod(k + 1, n)), rPow(v), "s"].filter((x) => x !== rsTex(k)),
            walked(
              [
                [
                  ["Rule out rotations", "排除旋转"],
                  t(
                    `A rotation other than $e$ moves every vertex, so apart from $e$ only a reflection can fix vertex $${v}$.`,
                    `除 $e$ 以外的旋转移动每个顶点，所以除 $e$ 外只有反射可能固定顶点 $${v}$。`,
                  ),
                ],
                [
                  ["Solve for the reflection", "求出反射"],
                  t(
                    `$r^ks \\cdot ${v} = k - ${v}$ equals $${v}$ when $k \\equiv ${2 * v === k ? k : `${2 * v} \\equiv ${k}`} \\pmod{${n}}$: the element is $${rsTex(k)}$.`,
                    `$r^ks \\cdot ${v} = k - ${v}$ 等于 $${v}$ 当且仅当 $k \\equiv ${2 * v === k ? k : `${2 * v} \\equiv ${k}`} \\pmod{${n}}$：这个元素是 $${rsTex(k)}$。`,
                  ),
                ],
              ],
              t(
                `$${rsTex(k)} \\cdot ${v} = ${k} - ${v} \\equiv ${v} \\pmod{${n}}$.`,
                `$${rsTex(k)} \\cdot ${v} = ${k} - ${v} \\equiv ${v} \\pmod{${n}}$。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "stabilizers-in-symmetric-groups",
      title: t("Stabilizers in $S_n$", "$S_n$ 中的稳定子"),
      explanation: t(
        "In $S_6$ acting on subsets of $\\{1, \\dots, 6\\}$, the stabilizer of $\\{1, 2\\}$ permutes $\\{1, 2\\}$ and $\\{3, 4, 5, 6\\}$ separately: $2! \\cdot 4! = 48$ elements. The permutations fixing both $1$ and $2$ number $4! = 24$.\n\nIn $S_7$, the stabilizer of the triple $(1, 2, 3)$ fixes each of $1, 2, 3$ and permutes $4, 5, 6, 7$: $4! = 24$ elements. The stabilizer of the set $\\{1, 2, 3\\}$ has $3! \\cdot 4! = 144$.\n\nCheck: $S_7$ sends $(1, 2, 3)$ to any of the $7 \\cdot 6 \\cdot 5 = 210$ ordered triples of distinct points, and $210 \\cdot 24 = 5040 = 7!$.\n\n> **Watch out.** A set may be rearranged within itself and a tuple may not, so the stabilizer of a $k$-element set has an extra factor $k!$.",
        "在 $S_6$ 作用于 $\\{1, \\dots, 6\\}$ 的子集时，$\\{1, 2\\}$ 的稳定子分别置换 $\\{1, 2\\}$ 与 $\\{3, 4, 5, 6\\}$：共 $2! \\cdot 4! = 48$ 个元素。同时固定 $1$ 和 $2$ 的置换有 $4! = 24$ 个。\n\n在 $S_7$ 中，三元组 $(1, 2, 3)$ 的稳定子固定 $1, 2, 3$ 中的每一个，并置换 $4, 5, 6, 7$：共 $4! = 24$ 个元素。集合 $\\{1, 2, 3\\}$ 的稳定子有 $3! \\cdot 4! = 144$ 个元素。\n\n检验：$S_7$ 能把 $(1, 2, 3)$ 移到 $7 \\cdot 6 \\cdot 5 = 210$ 个由不同点组成的有序三元组中的任何一个，且 $210 \\cdot 24 = 5040 = 7!$。\n\n> **注意。** 集合可以在自身内部重排，元组不能，所以 $k$ 元集合的稳定子多出一个因子 $k!$。",
      ),
      generate(rng) {
        const n = rng.int(4, 8);
        const set = rng.bool();
        const k = rng.int(set ? 1 : 2, Math.min(4, n - 2));
        const pts = rng.sample(range(1, n), k).sort((a, b) => a - b);
        const value = set ? factorial(k) * factorial(n - k) : factorial(n - k);
        const orbit = factorial(n) / value;
        return numberProblem({
          prompt: set
            ? t(
                `$S_{${n}}$ acts on the subsets of $\\{1, \\dots, ${n}\\}$ by $\\sigma \\cdot A = \\sigma(A)$. How many elements does the stabilizer of $\\{${pts.join(", ")}\\}$ have?`,
                `$S_{${n}}$ 通过 $\\sigma \\cdot A = \\sigma(A)$ 作用于 $\\{1, \\dots, ${n}\\}$ 的子集。$\\{${pts.join(", ")}\\}$ 的稳定子有多少个元素？`,
              )
            : t(
                `$S_{${n}}$ acts on ${k}-tuples of points by $\\sigma \\cdot (x_1, \\dots) = (\\sigma(x_1), \\dots)$. How many elements does the stabilizer of $(${pts.join(", ")})$ have?`,
                `$S_{${n}}$ 通过 $\\sigma \\cdot (x_1, \\dots) = (\\sigma(x_1), \\dots)$ 作用于 ${k} 元组。$(${pts.join(", ")})$ 的稳定子有多少个元素？`,
              ),
          answer: value,
          mistakes: apart(
            value,
            set
              ? [
                  why(
                    factorial(n - k),
                    `That fixes each chosen point; a set may also be rearranged within itself, a further factor of $${k}!$.`,
                    `这是逐点固定选定的点；集合还可以在内部重排，还要乘以 $${k}!$。`,
                  ),
                  why(
                    factorial(n) / factorial(k),
                    `That divides $${n}!$ by $${k}!$; the stabilizer is the product $${k}! \\cdot ${n - k}!$.`,
                    `这是用 $${n}!$ 除以 $${k}!$；稳定子的大小是乘积 $${k}! \\cdot ${n - k}!$。`,
                  ),
                  why(
                    choose(n, k),
                    `That is the number of ${k}-element subsets, the size of the orbit, not of the stabilizer.`,
                    `这是 ${k} 元子集的个数，即轨道的大小，而不是稳定子的大小。`,
                  ),
                ]
              : [
                  why(
                    factorial(k) * factorial(n - k),
                    "That lets the chosen points be rearranged, but each entry of a tuple must stay where it is.",
                    "这允许选定的点相互重排，但元组的每个分量都必须保持不动。",
                  ),
                  why(
                    factorial(n) / factorial(n - k),
                    `That is the number of ${k}-tuples of distinct points, the size of the orbit, not of the stabilizer.`,
                    `这是由不同点组成的 ${k} 元组的个数，即轨道的大小，而不是稳定子的大小。`,
                  ),
                  why(
                    n - k,
                    `That counts the points left free, not the permutations of them, which number $${n - k}!$.`,
                    `这数的是剩下可动的点，而不是它们的置换；置换有 $${n - k}!$ 个。`,
                  ),
                ],
          ),
          solution: set
            ? walked(
                [
                  [
                    ["Rearrange the chosen points", "重排选定的点"],
                    t(
                      k === 1
                        ? "The chosen point must stay where it is: $1! = 1$ way."
                        : `The $${k}$ chosen points may be permuted among themselves in $${k}!$ ways.`,
                      k === 1 ? "选定的点必须保持不动：$1! = 1$ 种方式。" : `选定的 $${k}$ 个点可以在它们之间任意置换，有 $${k}!$ 种方式。`,
                    ),
                  ],
                  [
                    ["Rearrange the others", "重排其余的点"],
                    t(
                      `The other $${n - k}$ points may be permuted in $${n - k}!$ ways: $${k}! \\cdot ${n - k}! = ${value}$.`,
                      `其余 $${n - k}$ 个点可以有 $${n - k}!$ 种置换方式：$${k}! \\cdot ${n - k}! = ${value}$。`,
                    ),
                  ],
                ],
                t(
                  `The orbit has $\\binom{${n}}{${k}} = ${orbit}$ subsets, and $${orbit} \\cdot ${value} = ${factorial(n)} = ${n}!$.`,
                  `轨道有 $\\binom{${n}}{${k}} = ${orbit}$ 个子集，且 $${orbit} \\cdot ${value} = ${factorial(n)} = ${n}!$。`,
                ),
              )
            : walked(
                [
                  [
                    ["Fix the chosen points", "固定选定的点"],
                    t(`Each of the points $${pts.join(", ")}$ must stay where it is.`, `点 $${pts.join(", ")}$ 中的每一个都必须保持不动。`),
                  ],
                  [
                    ["Permute the rest", "置换其余的点"],
                    t(
                      `The other $${n - k}$ points may be permuted freely: $${n - k}! = ${value}$.`,
                      `其余 $${n - k}$ 个点可以任意置换：$${n - k}! = ${value}$。`,
                    ),
                  ],
                ],
                t(
                  `There are $\\frac{${n}!}{${n - k}!} = ${orbit}$ ordered ${k}-tuples of distinct points, and $${orbit} \\cdot ${value} = ${factorial(n)} = ${n}!$.`,
                  `由不同点组成的有序 ${k} 元组共有 $\\frac{${n}!}{${n - k}!} = ${orbit}$ 个，且 $${orbit} \\cdot ${value} = ${factorial(n)} = ${n}!$。`,
                ),
              ),
        });
      },
    },
  ],
};

/** SOLIDS are the Platonic solids with their numbers of vertices, edges and faces and the order of their rotation groups. */
const SOLIDS = [
  { en: "regular tetrahedron", zh: "正四面体", order: 12, parts: [4, 6, 4] },
  { en: "cube", zh: "立方体", order: 24, parts: [8, 12, 6] },
  { en: "regular octahedron", zh: "正八面体", order: 24, parts: [6, 12, 8] },
  { en: "regular dodecahedron", zh: "正十二面体", order: 60, parts: [20, 30, 12] },
  { en: "regular icosahedron", zh: "正二十面体", order: 60, parts: [12, 30, 20] },
] as const;

/** PARTS name vertices, edges and faces. */
const PARTS = [
  ["vertex", "vertices", "顶点"],
  ["edge", "edges", "棱"],
  ["face", "faces", "面"],
] as const;

/** theOrbitStabilizerTheorem relates orbit sizes, stabilizer sizes and group orders. */
export const theOrbitStabilizerTheorem: TopicDef = {
  id: "the-orbit-stabilizer-theorem",
  title: t("The Orbit-Stabilizer Theorem", "轨道-稳定子定理"),
  summary: t(
    "If a finite group $G$ acts on $X$, then $|G \\cdot x| \\cdot |G_x| = |G|$ for every $x$: $g \\cdot x = h \\cdot x$ exactly when $g$ and $h$ lie in the same left coset of $G_x$, so the orbit has $[G : G_x]$ elements. For instance the $24$ rotations of a cube move a face to any of the $6$ faces, so each face is fixed by $4$ rotations.",
    "若有限群 $G$ 作用于 $X$，则对每个 $x$ 有 $|G \\cdot x| \\cdot |G_x| = |G|$：$g \\cdot x = h \\cdot x$ 当且仅当 $g$、$h$ 属于 $G_x$ 的同一左陪集，所以轨道有 $[G : G_x]$ 个元素。例如立方体的 $24$ 个旋转能把一个面转到 $6$ 个面中的任何一个，所以每个面被 $4$ 个旋转固定。",
  ),
  intro: t(
    "The $24$ rotations of a cube carry a vertex to any of the $8$ vertices, so $\\frac{24}{8} = 3$ rotations fix a given vertex: the turns about the diagonal through it.\n\nCheck: those turns are by $0°$, $120°$ and $240°$, three of them.\n\nIn this lesson we use $|G \\cdot x| \\cdot |G_x| = |G|$ to find orbit sizes, stabilizer orders and group orders.",
    "立方体的 $24$ 个旋转能把一个顶点转到 $8$ 个顶点中的任何一个，所以有 $\\frac{24}{8} = 3$ 个旋转固定给定的顶点：绕过该顶点的体对角线的旋转。\n\n检验：这些旋转的角度是 $0°$、$120°$ 与 $240°$，恰好三个。\n\n本课我们用 $|G \\cdot x| \\cdot |G_x| = |G|$ 求轨道的大小、稳定子的阶和群的阶。",
  ),
  prerequisites: ["stabilizers", "lagranges-theorem", "the-symmetry-group-of-a-cube-rotations-and-reflections"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orbit-stabilizer-for-rotations-of-solids",
      figure: algebraDrawings2["the-orbit-stabilizer-theorem#orbit-stabilizer-for-rotations-of-solids"],
      title: t("Rotations of solids", "多面体的旋转"),
      explanation: t(
        "The rotation group of a regular dodecahedron has $60$ elements and can carry any face to any of the $12$ faces, so the stabilizer of a face has $\\frac{60}{12} = 5$ rotations, the rotations about the axis through its center.\n\nThe $12$ rotations of a regular tetrahedron carry an edge to any of its $6$ edges, so $\\frac{12}{6} = 2$ rotations fix a given edge: the identity and the half-turn about the axis through its midpoint.\n\nCheck: $6 \\cdot 2 = 12$, the order of the group.\n\n> **Watch out.** Divide the order of the group by the size of the orbit; do not subtract. The stabilizer has $\\frac{|G|}{|G \\cdot x|}$ elements.",
        "正十二面体的旋转群有 $60$ 个元素，可把任一面转到 $12$ 个面中的任何一个，所以一个面的稳定子有 $\\frac{60}{12} = 5$ 个旋转，即绕过该面中心的轴的旋转。\n\n正四面体的 $12$ 个旋转能把一条棱转到 $6$ 条棱中的任何一条，所以有 $\\frac{12}{6} = 2$ 个旋转固定给定的棱：恒等旋转，以及绕过该棱中点的轴的半圈旋转。\n\n检验：$6 \\cdot 2 = 12$，正是群的阶。\n\n> **注意。** 要用群的阶除以轨道的大小，而不是相减。稳定子有 $\\frac{|G|}{|G \\cdot x|}$ 个元素。",
      ),
      generate(rng) {
        const solid = rng.pick(SOLIDS);
        const i = rng.int(0, 2);
        const [one, many, zh] = PARTS[i]!;
        const count = solid.parts[i]!;
        const stab = solid.order / count;
        const askStab = rng.bool();
        const orbitStep = [
          ["Find the orbit", "求轨道"],
          t(
            `The rotations carry a given ${one} to each of the $${count}$ ${many}, so the orbit has $${count}$ elements.`,
            `这些旋转能把给定的${zh}转到 $${count}$ 个${zh}中的每一个，所以轨道有 $${count}$ 个元素。`,
          ),
        ] as const;
        return numberProblem({
          prompt: askStab
            ? t(
                `The rotation group of a ${solid.en} has $${solid.order}$ elements and acts transitively on its $${count}$ ${many}. How many rotations fix a given ${one}?`,
                `${solid.zh}的旋转群有 $${solid.order}$ 个元素，可传递地作用于它的 $${count}$ 个${zh}。有多少个旋转固定某个给定的${zh}？`,
              )
            : t(
                `The rotation group of a ${solid.en} acts transitively on its $${count}$ ${many}, and exactly $${stab}$ rotations fix a given ${one}. How many rotations are there?`,
                `${solid.zh}的旋转群可传递地作用于它的 $${count}$ 个${zh}，恰有 $${stab}$ 个旋转固定某个给定的${zh}。共有多少个旋转？`,
              ),
          answer: askStab ? stab : solid.order,
          mistakes: askStab
            ? apart(stab, [
                why(count, "That is the size of the orbit, not of the stabilizer.", "这是轨道的大小，而不是稳定子的大小。"),
                why(
                  solid.order - count,
                  "Subtracting does not give the stabilizer; divide the order of the group by the size of the orbit.",
                  "相减得不到稳定子；要用群的阶除以轨道的大小。",
                ),
                why(
                  stab + 1,
                  `$${count} \\cdot ${stab + 1} = ${count * (stab + 1)}$, not $${solid.order}$.`,
                  `$${count} \\cdot ${stab + 1} = ${count * (stab + 1)}$，不是 $${solid.order}$。`,
                ),
                why(
                  2 * stab,
                  `$${count} \\cdot ${2 * stab} = ${2 * solid.order}$, twice the order of the group.`,
                  `$${count} \\cdot ${2 * stab} = ${2 * solid.order}$，是群的阶的两倍。`,
                ),
              ])
            : apart(solid.order, [
                why(
                  count + stab,
                  "Adding does not give the order; multiply the size of the orbit by the order of the stabilizer.",
                  "相加得不到群的阶；要用轨道的大小乘以稳定子的阶。",
                ),
                why(
                  2 * solid.order,
                  `That doubles $${count} \\cdot ${stab}$, as if reflections were counted; only rotations are.`,
                  `这是把 $${count} \\cdot ${stab}$ 翻了一倍，像是把反射也算进去了；这里只算旋转。`,
                ),
                why(
                  solid.order / 2,
                  `That is half of $${count} \\cdot ${stab} = ${solid.order}$.`,
                  `这是 $${count} \\cdot ${stab} = ${solid.order}$ 的一半。`,
                ),
              ]),
          solution: askStab
            ? walked(
                [
                  orbitStep,
                  [
                    ["Divide", "相除"],
                    t(
                      `By the orbit-stabilizer theorem, $|G_x| = \\frac{${solid.order}}{${count}} = ${stab}$.`,
                      `由轨道-稳定子定理，$|G_x| = \\frac{${solid.order}}{${count}} = ${stab}$。`,
                    ),
                  ],
                ],
                t(
                  `$${count} \\cdot ${stab} = ${solid.order}$, the order of the group.`,
                  `$${count} \\cdot ${stab} = ${solid.order}$，正是群的阶。`,
                ),
              )
            : walked(
                [
                  orbitStep,
                  [
                    ["Multiply", "相乘"],
                    t(
                      `By the orbit-stabilizer theorem, $|G| = ${count} \\cdot ${stab} = ${solid.order}$.`,
                      `由轨道-稳定子定理，$|G| = ${count} \\cdot ${stab} = ${solid.order}$。`,
                    ),
                  ],
                ],
                t(
                  `$\\frac{${solid.order}}{${count}} = ${stab}$, the number of rotations fixing a ${one}.`,
                  `$\\frac{${solid.order}}{${count}} = ${stab}$，正是固定一个${zh}的旋转个数。`,
                ),
              ),
        });
      },
    },
    {
      id: "orbit-sizes-from-stabilizers",
      title: t("Orbit sizes", "轨道的大小"),
      explanation: t(
        "If a group of order $60$ acts on a set and the stabilizer of $x$ has order $4$, the orbit of $x$ has $\\frac{60}{4} = 15$ elements.\n\nIf a group of order $48$ acts on a set and the orbit of $x$ has $16$ elements, the stabilizer of $x$ has order $\\frac{48}{16} = 3$.\n\nCheck: $16 \\cdot 3 = 48$.\n\n> **Watch out.** The size of the orbit and the order of the stabilizer multiply to the order of the group; they do not add up to it.",
        "若 $60$ 阶群作用于某集合，$x$ 的稳定子阶为 $4$，则 $x$ 的轨道有 $\\frac{60}{4} = 15$ 个元素。\n\n若 $48$ 阶群作用于某集合，$x$ 的轨道有 $16$ 个元素，则 $x$ 的稳定子阶为 $\\frac{48}{16} = 3$。\n\n检验：$16 \\cdot 3 = 48$。\n\n> **注意。** 轨道的大小与稳定子的阶相乘等于群的阶，而不是相加。",
      ),
      generate(rng) {
        let g: number;
        do g = rng.int(12, 200);
        while (divisors(g).length < 6);
        const s = rng.pick(divisors(g).filter((d) => d > 1 && d < g));
        const o = g / s;
        const askOrbit = rng.bool();
        const [given, found] = askOrbit ? [s, o] : [o, s];
        return numberProblem({
          prompt: askOrbit
            ? t(
                `A group of order $${g}$ acts on a set $X$, and the stabilizer of $x \\in X$ has order $${s}$. How many elements does the orbit of $x$ have?`,
                `$${g}$ 阶群作用于集合 $X$，$x \\in X$ 的稳定子阶为 $${s}$。$x$ 的轨道有多少个元素？`,
              )
            : t(
                `A group of order $${g}$ acts on a set $X$, and the orbit of $x \\in X$ has $${o}$ elements. What is the order of the stabilizer of $x$?`,
                `$${g}$ 阶群作用于集合 $X$，$x \\in X$ 的轨道有 $${o}$ 个元素。$x$ 的稳定子的阶是多少？`,
              ),
          answer: found,
          mistakes: apart(found, [
            why(
              g - given,
              "Subtracting does not work: the orbit size and the stabilizer order multiply to the group order.",
              "相减不对：轨道的大小与稳定子的阶相乘才等于群的阶。",
            ),
            why(
              given,
              askOrbit
                ? "That is the order of the stabilizer, not the size of the orbit."
                : "That is the size of the orbit, not the order of the stabilizer.",
              askOrbit ? "这是稳定子的阶，而不是轨道的大小。" : "这是轨道的大小，而不是稳定子的阶。",
            ),
            why(
              g * given,
              `Multiplying by $${given}$ overshoots; divide $${g}$ by it.`,
              `乘以 $${given}$ 就过头了；应当用 $${g}$ 除以它。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["State the theorem", "写出定理"],
                t(`$|G \\cdot x| \\cdot |G_x| = |G| = ${g}$.`, `$|G \\cdot x| \\cdot |G_x| = |G| = ${g}$。`),
              ],
              [
                ["Divide", "相除"],
                askOrbit
                  ? t(`$|G \\cdot x| = \\frac{${g}}{${s}} = ${o}$.`, `$|G \\cdot x| = \\frac{${g}}{${s}} = ${o}$。`)
                  : t(`$|G_x| = \\frac{${g}}{${o}} = ${s}$.`, `$|G_x| = \\frac{${g}}{${o}} = ${s}$。`),
              ],
            ],
            t(`$${o} \\cdot ${s} = ${g}$, the order of the group.`, `$${o} \\cdot ${s} = ${g}$，正是群的阶。`),
          ),
        });
      },
    },
  ],
};

/** COLORING_FIGURES are figures with the cycle index of their symmetry group, as [element count, number of cycles] pairs. */
const COLORING_FIGURES = [
  {
    en: "the vertices of a square, up to rotation",
    zh: "正方形的顶点（旋转视为相同）",
    terms: [
      [1, 4],
      [1, 2],
      [2, 1],
    ],
  },
  {
    en: "the vertices of a square, up to rotation and reflection",
    zh: "正方形的顶点（旋转与反射视为相同）",
    terms: [
      [1, 4],
      [1, 2],
      [2, 1],
      [2, 3],
      [2, 2],
    ],
  },
  {
    en: "the vertices of an equilateral triangle, up to rotation and reflection",
    zh: "正三角形的顶点（旋转与反射视为相同）",
    terms: [
      [1, 3],
      [2, 1],
      [3, 2],
    ],
  },
  {
    en: "the faces of a cube, up to rotation",
    zh: "立方体的面（旋转视为相同）",
    terms: [
      [1, 6],
      [6, 3],
      [3, 4],
      [8, 2],
      [6, 3],
    ],
  },
  {
    en: "the faces of a regular tetrahedron, up to rotation",
    zh: "正四面体的面（旋转视为相同）",
    terms: [
      [1, 4],
      [8, 2],
      [3, 2],
    ],
  },
] as const;

/** burnsidesLemma counts orbits by averaging fixed points. */
export const burnsidesLemma: TopicDef = {
  id: "burnsides-lemma",
  title: t("Burnside's Lemma", "伯恩赛德引理"),
  summary: t(
    "The number of orbits of a finite group $G$ acting on a finite set $X$ is the average number of fixed points: $\\frac{1}{|G|}\\sum_{g \\in G} |\\operatorname{Fix}(g)|$. To count colorings with $k$ colors up to symmetry, note that a coloring is fixed by $g$ exactly when it is constant on each cycle of $g$, so $|\\operatorname{Fix}(g)| = k^{c(g)}$, where $c(g)$ is the number of cycles.",
    "有限群 $G$ 作用于有限集 $X$ 时，轨道数等于不动点个数的平均值：$\\frac{1}{|G|}\\sum_{g \\in G} |\\operatorname{Fix}(g)|$。用 $k$ 种颜色计数对称意义下不同的着色时，着色被 $g$ 固定当且仅当它在 $g$ 的每个轮换上取同一颜色，所以 $|\\operatorname{Fix}(g)| = k^{c(g)}$，其中 $c(g)$ 为轮换个数。",
  ),
  intro: t(
    "Color the $3$ vertices of an equilateral triangle with $2$ colors, up to rotation. The identity fixes all $2^3 = 8$ colorings, and each of the two turns fixes only the $2$ one-color ones, so there are $\\frac{8 + 2 + 2}{3} = 4$ colorings.\n\nCheck: sorted by the number of black vertices, $0$, $1$, $2$ or $3$, there are $4$ colorings.\n\nIn this lesson we count orbits by averaging fixed points, and use this to count colorings up to symmetry.",
    "用 $2$ 种颜色给正三角形的 $3$ 个顶点着色，旋转视为相同。单位元固定全部 $2^3 = 8$ 种着色，两个旋转各只固定 $2$ 种单色着色，所以共有 $\\frac{8 + 2 + 2}{3} = 4$ 种着色。\n\n检验：按黑色顶点的个数 $0$、$1$、$2$ 或 $3$ 分类，恰好 $4$ 种着色。\n\n本课我们通过对不动点个数取平均来计数轨道，并用它计数对称意义下的着色。",
  ),
  prerequisites: ["the-orbit-stabilizer-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-orbits-from-fixed-points",
      title: t("Averaging fixed points", "平均不动点"),
      explanation: t(
        "A group of order $4$ acts on $16$ colorings: the identity fixes all $16$, one element fixes $4$, and the other two fix $2$ each. There are $\\frac{16 + 4 + 2 + 2}{4} = 6$ orbits.\n\nA group of order $6$ acts on $20$ points; besides the identity, $2$ elements fix $2$ points each and $3$ fix $4$ points each. There are $\\frac{20 + 2 \\cdot 2 + 3 \\cdot 4}{6} = \\frac{36}{6} = 6$ orbits.\n\nCheck: $2 + 3$ elements besides the identity make $6$, the order of the group.\n\n> **Watch out.** Count the identity: it fixes every point, so the size of the whole set belongs in the sum.",
        "$4$ 阶群作用于 $16$ 种着色：单位元固定全部 $16$ 种，一个元素固定 $4$ 种，另外两个各固定 $2$ 种。轨道数为 $\\frac{16 + 4 + 2 + 2}{4} = 6$。\n\n$6$ 阶群作用于 $20$ 个点；除单位元外，$2$ 个元素各固定 $2$ 个点，$3$ 个元素各固定 $4$ 个点。轨道数为 $\\frac{20 + 2 \\cdot 2 + 3 \\cdot 4}{6} = \\frac{36}{6} = 6$。\n\n检验：单位元以外的 $2 + 3$ 个元素加上单位元共 $6$ 个，正是群的阶。\n\n> **注意。** 别漏了单位元：它固定每个点，所以整个集合的大小也要计入和中。",
      ),
      generate(rng) {
        const g = rng.pick([6, 8, 10, 12]);
        const a = rng.int(2, g - 3);
        const b = g - 1 - a;
        const fa = rng.int(0, 8);
        let fb: number;
        do fb = rng.int(0, 8);
        while (fb === fa);
        let size = Math.max(fa, fb) + rng.int(4, 20);
        while ((size + a * fa + b * fb) % g !== 0) size++;
        const total = size + a * fa + b * fb;
        const value = total / g;
        const term = (c: number, f: number) => (f === 1 ? `${c}` : `${c} \\cdot ${f}`);
        return numberProblem({
          prompt: t(
            `A group $G$ of order $${g}$ acts on a set of $${size}$ elements. Besides the identity, $${a}$ elements of $G$ fix $${fa}$ points each and the other $${b}$ fix $${fb}$ points each. How many orbits are there?`,
            `$${g}$ 阶群 $G$ 作用于一个 $${size}$ 元集合。除单位元外，$G$ 中有 $${a}$ 个元素各固定 $${fa}$ 个点，其余 $${b}$ 个各固定 $${fb}$ 个点。共有多少个轨道？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              Math.floor(size / g),
              "That divides only the size of the set, leaving out the points fixed by the other elements.",
              "这只用集合的大小去除，漏掉了其他元素固定的点。",
            ),
            why(
              Math.floor((size + fa + fb) / g),
              `That counts one element of each kind, but $${a}$ elements fix $${fa}$ points each and $${b}$ fix $${fb}$ each.`,
              `这对每类元素只算了一个，但有 $${a}$ 个元素各固定 $${fa}$ 个点，$${b}$ 个各固定 $${fb}$ 个点。`,
            ),
            why(
              value + 1,
              `The average of the fixed points is exactly $\\frac{${total}}{${g}} = ${value}$; nothing more is added.`,
              `不动点个数的平均值恰为 $\\frac{${total}}{${g}} = ${value}$；不需要再加什么。`,
            ),
            why(
              total,
              `That is the total number of fixed points; Burnside's lemma divides it by the order $${g}$.`,
              `这是不动点的总数；伯恩赛德引理还要除以群的阶 $${g}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Add the fixed points", "求不动点之和"],
                t(
                  `The identity fixes all $${size}$ points, so the total is $${size} + ${term(a, fa)} + ${term(b, fb)} = ${total}$.`,
                  `单位元固定全部 $${size}$ 个点，所以总和为 $${size} + ${term(a, fa)} + ${term(b, fb)} = ${total}$。`,
                ),
              ],
              [
                ["Divide by the order", "除以群的阶"],
                t(
                  `By Burnside's lemma there are $\\frac{${total}}{${g}} = ${value}$ orbits.`,
                  `由伯恩赛德引理，共有 $\\frac{${total}}{${g}} = ${value}$ 个轨道。`,
                ),
              ],
            ],
            value === 1
              ? t(
                  `The sum $${total}$ equals the order $${g}$, so there is exactly one orbit.`,
                  `总和 $${total}$ 等于群的阶 $${g}$，所以恰有一个轨道。`,
                )
              : t(`$${value} \\cdot ${g} = ${total}$, the sum of the fixed points.`, `$${value} \\cdot ${g} = ${total}$，正是不动点之和。`),
          ),
        });
      },
    },
    {
      id: "counting-colorings-up-to-symmetry",
      figure: algebraDrawings2["burnsides-lemma#counting-colorings-up-to-symmetry"],
      title: t("Counting colorings", "计数着色"),
      explanation: t(
        "Color the vertices of a square with $k$ colors up to rotation. The identity fixes $k^4$ colorings, the half-turn $k^2$, and each quarter-turn $k$, so there are $\\frac{k^4 + k^2 + 2k}{4}$; for $k = 2$, that is $6$.\n\nColor the vertices of an equilateral triangle with $3$ colors up to rotation and reflection. The identity fixes $3^3$ colorings, the two turns $3$ each and the three reflections $3^2$ each: $\\frac{27 + 2 \\cdot 3 + 3 \\cdot 9}{6} = \\frac{60}{6} = 10$.\n\nCheck: sorted by the colors used, there are $3$ one-color colorings, $6$ using two colors (one color twice, another once) and $1$ using all three: $10$.\n\n> **Watch out.** A symmetry fixes a coloring when the coloring is constant on each of its cycles, so it fixes $k^c$ colorings, where $c$ counts its cycles, not the vertices it moves.",
        "用 $k$ 种颜色给正方形顶点着色，旋转视为相同。单位元固定 $k^4$ 种着色，半圈旋转固定 $k^2$ 种，每个四分之一圈旋转固定 $k$ 种，所以共有 $\\frac{k^4 + k^2 + 2k}{4}$ 种；$k = 2$ 时为 $6$。\n\n用 $3$ 种颜色给正三角形顶点着色，旋转与反射视为相同。单位元固定 $3^3$ 种着色，两个旋转各固定 $3$ 种，三个反射各固定 $3^2$ 种：$\\frac{27 + 2 \\cdot 3 + 3 \\cdot 9}{6} = \\frac{60}{6} = 10$。\n\n检验：按所用颜色分类，单色着色有 $3$ 种，用两种颜色（一种用两次、另一种用一次）的有 $6$ 种，三种颜色都用的有 $1$ 种：共 $10$ 种。\n\n> **注意。** 对称固定一个着色，当且仅当着色在它的每个轮换上取同一颜色，所以它固定 $k^c$ 种着色，其中 $c$ 是轮换的个数，而不是它移动的顶点数。",
      ),
      generate(rng) {
        const fig = rng.pick(COLORING_FIGURES);
        const k = rng.int(2, 7);
        const order = fig.terms.reduce((s, [c]) => s + c, 0);
        const total = fig.terms.reduce((s, [c, e]) => s + c * k ** e, 0);
        const value = total / order;
        const top = fig.terms[0]![1];
        const sum = fig.terms.map(([c, e]) => times(c, pw(k, e))).join(" + ");
        return numberProblem({
          prompt: t(
            `How many ways are there to color ${fig.en}, with $${k}$ colors available?`,
            `用 $${k}$ 种颜色给${fig.zh}着色，共有多少种方法？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              k ** top,
              "That counts all colorings, without treating symmetric ones as the same.",
              "这数的是全部着色，没有把对称的着色视为相同。",
            ),
            why(
              Math.floor(k ** top / order),
              "Dividing all colorings by the order assumes no coloring is fixed by a symmetry other than the identity; Burnside's average corrects for that.",
              "用全部着色数除以群的阶，相当于假设除单位元外没有对称固定任何着色；伯恩赛德引理的平均修正了这一点。",
            ),
            why(
              value + k,
              `That adds $${k}$, as if the one-color colorings were counted again; the average already includes them.`,
              `这多加了 $${k}$，像是把单色着色又数了一遍；平均值已经包含它们。`,
            ),
            why(
              choose(k + top - 1, top),
              "That counts colorings only by how many times each color is used, ignoring where the colors sit.",
              "这只按每种颜色用了几次来计数，忽略了颜色所在的位置。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Count the fixed colorings", "数被固定的着色"],
                t(
                  `An element with $c$ cycles fixes $${k}^c$ colorings, so the fixed colorings add up to $${sum} = ${total}$.`,
                  `有 $c$ 个轮换的元素固定 $${k}^c$ 种着色，所以被固定的着色共计 $${sum} = ${total}$。`,
                ),
              ],
              [
                ["Average over the group", "对群取平均"],
                t(
                  `The symmetry group has $${order}$ elements: $\\frac{${total}}{${order}} = ${value}$.`,
                  `对称群有 $${order}$ 个元素：$\\frac{${total}}{${order}} = ${value}$。`,
                ),
              ],
            ],
            t(
              `$${value} \\cdot ${order} = ${total}$, and $${value}$ lies between $\\frac{${k ** top}}{${order}}$ and the $${k ** top}$ colorings in all.`,
              `$${value} \\cdot ${order} = ${total}$，且 $${value}$ 介于 $\\frac{${k ** top}}{${order}}$ 与全部着色数 $${k ** top}$ 之间。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theClassEquationOfAGroupAction relates fixed points to orbits for actions of p-groups. */
export const theClassEquationOfAGroupAction: TopicDef = {
  id: "the-class-equation-of-a-group-action",
  title: t("The Class Equation of a Group Action", "群作用的类方程"),
  summary: t(
    "Splitting $X$ into orbits gives the class equation $|X| = |X^G| + \\sum [G : G_{x_i}]$, where $X^G$ is the set of fixed points and the $x_i$ represent the orbits of size greater than $1$. If $|G| = p^n$ for a prime $p$, every such orbit has size divisible by $p$, so $|X| \\equiv |X^G| \\pmod{p}$.",
    "把 $X$ 分解为轨道得到类方程 $|X| = |X^G| + \\sum [G : G_{x_i}]$，其中 $X^G$ 是不动点集，$x_i$ 代表大小大于 $1$ 的各轨道。若 $|G| = p^n$（$p$ 为素数），则每个这样的轨道大小都被 $p$ 整除，所以 $|X| \\equiv |X^G| \\pmod{p}$。",
  ),
  intro: t(
    "A group of order $8$ acts on $13$ points. An orbit that is not a fixed point has $2$, $4$ or $8$ points, so the number of fixed points is $\\equiv 13 \\equiv 1 \\pmod 2$: there is at least $1$.\n\nCheck: $13 = 1 + 4 + 8$, so exactly $1$ fixed point is possible.\n\nIn this lesson we use the class equation of an action of a $p$-group to count its fixed points.",
    "$8$ 阶群作用于 $13$ 个点。不是不动点的轨道有 $2$、$4$ 或 $8$ 个点，所以不动点个数 $\\equiv 13 \\equiv 1 \\pmod 2$：至少有 $1$ 个。\n\n检验：$13 = 1 + 4 + 8$，所以恰有 $1$ 个不动点是可能的。\n\n本课我们用 $p$-群作用的类方程来计数不动点。",
  ),
  prerequisites: ["the-orbit-stabilizer-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "fixed-points-of-p-group-actions",
      title: t("Fixed points of p-groups", "p-群作用的不动点"),
      explanation: t(
        "A group of order $27$ acting on $41$ points has orbits of sizes $1, 3, 9, 27$, so the number of fixed points is $\\equiv 41 \\equiv 2 \\pmod 3$. There are at least $2$ fixed points.\n\nA group of order $25$ acting on $33$ points has orbits of sizes $1$, $5$ and $25$, so the number of fixed points is $\\equiv 33 \\equiv 3 \\pmod 5$: at least $3$.\n\nCheck: $33 = 3 + 5 + 25$, so exactly $3$ fixed points are possible.\n\n> **Watch out.** The number of fixed points is congruent to $|X|$ modulo $p$, so the least possible number is the remainder of $|X|$, not $0$ and not $p$ minus the remainder.",
        "$27$ 阶群作用于 $41$ 个点时，轨道大小只能是 $1, 3, 9, 27$，所以不动点个数 $\\equiv 41 \\equiv 2 \\pmod 3$。至少有 $2$ 个不动点。\n\n$25$ 阶群作用于 $33$ 个点时，轨道大小只能是 $1$、$5$ 与 $25$，所以不动点个数 $\\equiv 33 \\equiv 3 \\pmod 5$：至少 $3$ 个。\n\n检验：$33 = 3 + 5 + 25$，所以恰有 $3$ 个不动点是可能的。\n\n> **注意。** 不动点个数与 $|X|$ 模 $p$ 同余，所以最少可能的个数是 $|X|$ 除以 $p$ 的余数，而不是 $0$，也不是 $p$ 减去余数。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const k = rng.int(2, p === 2 ? 6 : 3);
        let n: number;
        do n = rng.int(p + 1, 80);
        while (n % p === 0);
        const value = n % p;
        const q = (n - value) / p;
        return numberProblem({
          prompt: t(
            `A group of order $${p}^{${k}}$ acts on a set of $${n}$ elements. What is the least possible number of fixed points?`,
            `$${p}^{${k}}$ 阶群作用于一个 $${n}$ 元集合。不动点个数最少可能是多少？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              0,
              `$${n}$ is not a multiple of $${p}$, so orbits whose sizes are multiples of $${p}$ cannot cover every point.`,
              `$${n}$ 不是 $${p}$ 的倍数，所以大小为 $${p}$ 的倍数的轨道不可能覆盖所有点。`,
            ),
            why(
              p - value,
              `That is how far $${n}$ is from the next multiple of $${p}$, not the remainder of $${n}$.`,
              `这是 $${n}$ 到下一个 $${p}$ 的倍数的距离，而不是 $${n}$ 的余数。`,
            ),
            why(
              Math.floor(n / p),
              `That is how many orbits of size $${p}$ fit, not the number of points left over.`,
              `这是能放下的大小为 $${p}$ 的轨道个数，而不是剩下的点数。`,
            ),
            why(
              value + p,
              `That many is possible, but $${value}$ fixed points is possible too, and fewer.`,
              `这个个数是可能的，但 $${value}$ 个不动点也是可能的，而且更少。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the orbit sizes", "求轨道大小"],
                t(
                  `Every orbit has size dividing $${p}^{${k}}$, so a point that is not fixed lies in an orbit whose size is a multiple of $${p}$.`,
                  `每个轨道的大小都整除 $${p}^{${k}}$，所以不是不动点的点所在的轨道大小是 $${p}$ 的倍数。`,
                ),
              ],
              [
                ["Reduce modulo the prime", "对素数取模"],
                t(
                  `So the number of fixed points is $\\equiv ${n} \\equiv ${value} \\pmod{${p}}$, and the least such number is $${value}$.`,
                  `所以不动点个数 $\\equiv ${n} \\equiv ${value} \\pmod{${p}}$，满足此条件的最小个数是 $${value}$。`,
                ),
              ],
            ],
            t(
              `$${n} = ${value} + ${times(q, `${p}`)}$: $${q}$ ${plural(q, "orbit", "orbits")} of size $${p}$ and $${value}$ ${plural(value, "fixed point", "fixed points")} make an action with exactly $${value}$.`,
              `$${n} = ${value} + ${times(q, `${p}`)}$：$${q}$ 个大小为 $${p}$ 的轨道加上 $${value}$ 个不动点，就得到恰有 $${value}$ 个不动点的作用。`,
            ),
          ),
        });
      },
    },
    {
      id: "actions-without-fixed-points",
      title: t("Actions without fixed points", "无不动点的作用"),
      explanation: t(
        "Can a group of order $16$ act on $10$ points without fixed points? The orbits would have sizes $2, 4, 8, 16$ summing to $10$, e.g. $2 + 8$: yes. On $11$ points it cannot, since $11$ is odd.\n\nA group of order $9$ cannot act on $13$ points without fixed points: $13 \\equiv 1 \\pmod 3$, so at least one point is fixed. On $12$ points it can, with four orbits of size $3$.\n\nCheck: $4 \\cdot 3 = 12$.\n\n> **Watch out.** What matters is $|X|$ modulo $p$, not whether $|X|$ divides the order of the group: a group of order $16$ acts on $10$ points without fixed points, as $2 + 8$.",
        "$16$ 阶群能否无不动点地作用于 $10$ 个点？轨道大小只能取 $2, 4, 8, 16$，和为 $10$，例如 $2 + 8$：可以。作用于 $11$ 个点则不行，因为 $11$ 是奇数。\n\n$9$ 阶群不能无不动点地作用于 $13$ 个点：$13 \\equiv 1 \\pmod 3$，所以至少有一个不动点。作用于 $12$ 个点则可以，取四个大小为 $3$ 的轨道。\n\n检验：$4 \\cdot 3 = 12$。\n\n> **注意。** 关键是 $|X|$ 模 $p$ 的余数，而不是 $|X|$ 是否整除群的阶：$16$ 阶群可以按 $2 + 8$ 无不动点地作用于 $10$ 个点。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const k = rng.int(1, p === 2 ? 5 : 3);
        const n = rng.int(p + 1, 60);
        const holds = n % p === 0;
        return decide({
          prompt: t(
            `Can a group of order $${pw(p, k)}$ act on a set of $${n}$ elements with no fixed points?`,
            `$${pw(p, k)}$ 阶群能否无不动点地作用于一个 $${n}$ 元集合？`,
          ),
          holds,
          steps: [
            [
              ["Find the orbit sizes", "求轨道大小"],
              t(
                `An orbit that is not a fixed point has size a power of $${p}$ greater than $1$, so a multiple of $${p}$.`,
                `不是不动点的轨道，大小是大于 $1$ 的 $${p}$ 的幂，因而是 $${p}$ 的倍数。`,
              ),
            ],
            holds
              ? [
                  ["Build the action", "构造作用"],
                  t(
                    `$${n}$ is a multiple of $${p}$, so $${n / p}$ orbits of size $${p}$ work, for instance through a homomorphism onto $${zTex(p)}$.`,
                    `$${n}$ 是 $${p}$ 的倍数，所以取 $${n / p}$ 个大小为 $${p}$ 的轨道即可，例如通过到 $${zTex(p)}$ 的满同态。`,
                  ),
                ]
              : [
                  ["Reduce modulo the prime", "对素数取模"],
                  t(
                    `The number of fixed points is $\\equiv ${n} \\equiv ${n % p} \\pmod{${p}}$, so it cannot be $0$.`,
                    `不动点个数 $\\equiv ${n} \\equiv ${n % p} \\pmod{${p}}$，所以不可能为 $0$。`,
                  ),
                ],
          ],
          check: holds
            ? t(
                `$${n / p} \\cdot ${p} = ${n}$, so the orbits cover every point.`,
                `$${n / p} \\cdot ${p} = ${n}$，所以这些轨道覆盖了所有点。`,
              )
            : t(`$${n}$ divided by $${p}$ leaves the remainder $${n % p}$, not $0$.`, `$${n}$ 除以 $${p}$ 余 $${n % p}$，不是 $0$。`),
          wrong: holds
            ? t(
                `Nothing forces a fixed point: $${n}$ is a multiple of $${p}$, so every point can lie in an orbit of size $${p}$.`,
                `没有什么迫使出现不动点：$${n}$ 是 $${p}$ 的倍数，所以每个点都可以位于大小为 $${p}$ 的轨道中。`,
              )
            : t(
                `Orbits whose sizes are multiples of $${p}$ cannot add up to $${n}$, which is not a multiple of $${p}$.`,
                `大小为 $${p}$ 的倍数的轨道，加起来不可能等于不是 $${p}$ 的倍数的 $${n}$。`,
              ),
        });
      },
    },
  ],
};

/** conjugationAndConjugacyClasses finds conjugacy classes in dihedral groups. */
export const conjugationAndConjugacyClasses: TopicDef = {
  id: "conjugation-and-conjugacy-classes",
  title: t("Conjugation and Conjugacy Classes", "共轭与共轭类"),
  summary: t(
    "G acts on itself by conjugation, g · x = gxg⁻¹. The orbits are the conjugacy classes, and the stabilizer of x is its centralizer, so the class of x has [G : C(x)] elements; x is central exactly when its class is {x}. In Dₙ, rᵏ is conjugate to r⁻ᵏ only, and the reflections form one class if n is odd and two classes of n/2 if n is even.",
    "G 通过共轭 g · x = gxg⁻¹ 作用于自身。轨道是共轭类，x 的稳定子是它的中心化子，所以 x 的共轭类有 [G : C(x)] 个元素；x 在中心中当且仅当它的共轭类为 {x}。在 Dₙ 中，rᵏ 只与 r⁻ᵏ 共轭；n 为奇数时所有反射构成一个类，n 为偶数时构成两个各含 n/2 个元素的类。",
  ),
  intro: t(
    "In $D_4$ of order $8$, the class of $r$ is $\\{r, r^3\\}$, since $srs^{-1} = r^{-1} = r^3$. The class of $r^2$ is $\\{r^2\\}$, as $r^2$ is central.\n\nCheck: $C(r) = \\{e, r, r^2, r^3\\}$ has $4$ elements, and $\\frac{8}{4} = 2$ is the size of the class of $r$.\n\nIn this lesson we find the sizes of the conjugacy classes of dihedral groups and count those classes.",
    "在 $8$ 阶的 $D_4$ 中，$r$ 的共轭类为 $\\{r, r^3\\}$，因为 $srs^{-1} = r^{-1} = r^3$。$r^2$ 的共轭类为 $\\{r^2\\}$，因为 $r^2$ 在中心中。\n\n检验：$C(r) = \\{e, r, r^2, r^3\\}$ 有 $4$ 个元素，而 $\\frac{8}{4} = 2$ 正是 $r$ 的共轭类的大小。\n\n本课我们求二面体群的共轭类的大小，并数出共轭类的个数。",
  ),
  prerequisites: ["the-class-equation-of-a-group-action", "the-centralizer-of-a-subgroup"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sizes-of-conjugacy-classes-in-dihedral-groups",
      title: t("Class sizes in $D_n$", "$D_n$ 中共轭类的大小"),
      explanation: t(
        "The size of a conjugacy class is the group order divided by the order of the centralizer of any element in it. In $D_6$ of order $12$, $C(rs)$ has $4$ elements, so the class of $rs$ has $\\frac{12}{4} = 3$: $\\{rs, r^3s, r^5s\\}$. The class of $r^2$ is $\\{r^2, r^4\\}$.\n\nIn $D_5$ of order $10$, $C(s) = \\{e, s\\}$, so the class of $s$ has $\\frac{10}{2} = 5$ elements: all five reflections.\n\nCheck: the classes of $D_5$ have sizes $1 + 2 + 2 + 5 = 10$, the order of the group.\n\n> **Watch out.** The reflections split into two classes only when $n$ is even; when $n$ is odd all $n$ of them are conjugate.",
        "共轭类的大小等于群的阶除以类中任一元素的中心化子的阶。在 $12$ 阶的 $D_6$ 中，$C(rs)$ 有 $4$ 个元素，所以 $rs$ 的共轭类有 $\\frac{12}{4} = 3$ 个元素：$\\{rs, r^3s, r^5s\\}$。$r^2$ 的共轭类为 $\\{r^2, r^4\\}$。\n\n在 $10$ 阶的 $D_5$ 中，$C(s) = \\{e, s\\}$，所以 $s$ 的共轭类有 $\\frac{10}{2} = 5$ 个元素：全部五个反射。\n\n检验：$D_5$ 的各共轭类大小之和为 $1 + 2 + 2 + 5 = 10$，正是群的阶。\n\n> **注意。** 只有 $n$ 为偶数时反射才分成两个类；$n$ 为奇数时全部 $n$ 个反射互相共轭。",
      ),
      generate(rng) {
        const n = rng.int(3, 20);
        const reflection = rng.bool();
        const k = n % 2 === 0 && rng.bool(0.25) ? n / 2 : rng.int(1, n - 1);
        const h = reflection ? rsTex(k) : `${rPow(k)}`;
        const value = reflection ? (n % 2 === 0 ? n / 2 : n) : mod(2 * k, n) === 0 ? 1 : 2;
        const centralizer = (2 * n) / value;
        return numberProblem({
          prompt: t(
            `In the dihedral group $D_{${n}}$ of order $${2 * n}$, how many elements does the conjugacy class of $${h}$ have?`,
            `在 $${2 * n}$ 阶二面体群 $D_{${n}}$ 中，$${h}$ 的共轭类有多少个元素？`,
          ),
          answer: value,
          mistakes: apart(
            value,
            [
              reflection
                ? why(
                    1,
                    `$${h}$ is not central: conjugating it by $r$ gives $${rsTex(mod(k + 2, n))}$.`,
                    `$${h}$ 不在中心中：用 $r$ 共轭它得到 $${rsTex(mod(k + 2, n))}$。`,
                  )
                : why(
                    1,
                    `$${h}$ is not central: conjugating it by $s$ gives $${rPow(n - k)}$.`,
                    `$${h}$ 不在中心中：用 $s$ 共轭它得到 $${rPow(n - k)}$。`,
                  ),
              reflection
                ? why(
                    2,
                    `Only a rotation and its inverse form a class of $2$; the reflections form classes of $${value}$.`,
                    `只有旋转与它的逆才构成大小为 $2$ 的类；反射构成的类大小为 $${value}$。`,
                  )
                : why(
                    2,
                    `Here $${h}$ is its own inverse, so conjugating by $s$ gives $${h}$ back.`,
                    `这里 $${h}$ 是它自身的逆，所以用 $s$ 共轭仍得到 $${h}$。`,
                  ),
              reflection
                ? why(
                    n,
                    `That counts all the reflections, but for even $${n}$ they split into two classes by the parity of the exponent.`,
                    `这数的是全部反射，但 $${n}$ 为偶数时，反射按指数的奇偶分成两个类。`,
                  )
                : why(
                    n,
                    `That counts all the rotations, but conjugation only sends $${h}$ to itself or its inverse.`,
                    `这数的是全部旋转，但共轭只把 $${h}$ 变为它自身或它的逆。`,
                  ),
              why(
                n / 2,
                `$\\frac{${n}}{2}$ is the size of a class of reflections when $n$ is even, not of a class of rotations.`,
                `$\\frac{${n}}{2}$ 是 $n$ 为偶数时一类反射的大小，而不是一类旋转的大小。`,
              ),
              why(2 * n, "That is the order of the whole group, not the size of one class.", "这是整个群的阶，而不是一个类的大小。"),
            ].filter((m) => Number.isInteger(m.value)),
          ),
          solution: reflection
            ? walked(
                [
                  [
                    ["Find the centralizer", "求中心化子"],
                    n % 2 === 0
                      ? t(
                          `$C(${h})$ has $4$ elements: $e$, $${rPow(n / 2)}$, $${h}$ and $${rsTex(mod(k + n / 2, n))}$.`,
                          `$C(${h})$ 有 $4$ 个元素：$e$、$${rPow(n / 2)}$、$${h}$ 与 $${rsTex(mod(k + n / 2, n))}$。`,
                        )
                      : t(`$C(${h}) = \\{e, ${h}\\}$ has $2$ elements.`, `$C(${h}) = \\{e, ${h}\\}$ 有 $2$ 个元素。`),
                  ],
                  [
                    ["Divide", "相除"],
                    t(
                      `The class has $\\frac{${2 * n}}{${centralizer}} = ${value}$ elements.`,
                      `共轭类有 $\\frac{${2 * n}}{${centralizer}} = ${value}$ 个元素。`,
                    ),
                  ],
                ],
                n % 2 === 0
                  ? t(
                      `$${n}$ is even, so the reflections $r^js$ split into two classes by the parity of $j$, each with $${n / 2}$ elements.`,
                      `$${n}$ 为偶数，所以反射 $r^js$ 按 $j$ 的奇偶分成两个类，各有 $${n / 2}$ 个元素。`,
                    )
                  : t(`$${n}$ is odd, so all $${n}$ reflections are conjugate.`, `$${n}$ 为奇数，所以全部 $${n}$ 个反射互相共轭。`),
              )
            : walked(
                [
                  [
                    ["Conjugate by a reflection", "用反射共轭"],
                    t(
                      `$s${rPow(k)}s^{-1} = ${rPow(n - k)}$, and conjugating by a rotation changes nothing.`,
                      `$s${rPow(k)}s^{-1} = ${rPow(n - k)}$，而用旋转共轭不改变它。`,
                    ),
                  ],
                  [
                    ["List the class", "写出共轭类"],
                    value === 1
                      ? t(
                          `$${rPow(n - k)} = ${h}$, so the class is $\\{${h}\\}$: $1$ element.`,
                          `$${rPow(n - k)} = ${h}$，所以共轭类为 $\\{${h}\\}$：$1$ 个元素。`,
                        )
                      : t(
                          `The class is $\\{${h}, ${rPow(n - k)}\\}$: $2$ elements.`,
                          `共轭类为 $\\{${h}, ${rPow(n - k)}\\}$：$2$ 个元素。`,
                        ),
                  ],
                ],
                value === 1
                  ? t(
                      `$2 \\cdot ${k} = ${n}$, so $${h}$ is its own inverse and lies in the center.`,
                      `$2 \\cdot ${k} = ${n}$，所以 $${h}$ 是它自身的逆，位于中心中。`,
                    )
                  : t(
                      `$C(${h})$ consists of the $${n}$ rotations, and $\\frac{${2 * n}}{${n}} = 2$.`,
                      `$C(${h})$ 由 $${n}$ 个旋转组成，且 $\\frac{${2 * n}}{${n}} = 2$。`,
                    ),
              ),
        });
      },
    },
    {
      id: "counting-conjugacy-classes-of-dihedral-groups",
      figure: algebraDrawings2["conjugation-and-conjugacy-classes#counting-conjugacy-classes-of-dihedral-groups"],
      title: t("Number of classes of $D_n$", "$D_n$ 的共轭类个数"),
      explanation: t(
        "Rotations pair up with their inverses, and the reflections form one class or two depending on whether the number of sides is odd or even. $D_5$: $\\{e\\}$, $\\{r, r^4\\}$, $\\{r^2, r^3\\}$ and the $5$ reflections: $4$ classes. $D_6$: $\\{e\\}$, $\\{r^3\\}$, $\\{r, r^5\\}$, $\\{r^2, r^4\\}$ and two classes of reflections: $6$ classes.\n\n$D_8$: $\\{e\\}$, $\\{r^4\\}$, the three pairs $\\{r, r^7\\}$, $\\{r^2, r^6\\}$, $\\{r^3, r^5\\}$ and two classes of reflections: $7$ classes.\n\nCheck: the class sizes $1 + 1 + 3 \\cdot 2 + 2 \\cdot 4 = 16$ add up to the order of $D_8$.\n\n> **Watch out.** When $n$ is even, $r^{n/2}$ equals its own inverse and forms a class of its own; do not pair it with another rotation.",
        "旋转与它们的逆配成一对，而反射组成一类还是两类，取决于边数是奇数还是偶数。$D_5$：$\\{e\\}$、$\\{r, r^4\\}$、$\\{r^2, r^3\\}$ 以及 $5$ 个反射：共 $4$ 个类。$D_6$：$\\{e\\}$、$\\{r^3\\}$、$\\{r, r^5\\}$、$\\{r^2, r^4\\}$ 以及两类反射：共 $6$ 个类。\n\n$D_8$：$\\{e\\}$、$\\{r^4\\}$、三对 $\\{r, r^7\\}$、$\\{r^2, r^6\\}$、$\\{r^3, r^5\\}$ 以及两类反射：共 $7$ 个类。\n\n检验：各类大小之和 $1 + 1 + 3 \\cdot 2 + 2 \\cdot 4 = 16$，正是 $D_8$ 的阶。\n\n> **注意。** $n$ 为偶数时，$r^{n/2}$ 等于它自身的逆，单独构成一个类；不要把它与别的旋转配对。",
      ),
      generate(rng) {
        const n = rng.int(3, 40);
        const value = n % 2 === 1 ? (n + 3) / 2 : (n + 6) / 2;
        const rotations = Math.floor(n / 2) + 1;
        const pairs = n % 2 === 1 ? (n - 1) / 2 : (n - 2) / 2;
        return numberProblem({
          prompt: t(
            `How many conjugacy classes does the dihedral group $D_{${n}}$ of order $${2 * n}$ have?`,
            `$${2 * n}$ 阶二面体群 $D_{${n}}$ 有多少个共轭类？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              n + 1,
              "That makes each rotation a class of its own, but $r^k$ and $r^{-k}$ are conjugate.",
              "这把每个旋转都当作单独的类，但 $r^k$ 与 $r^{-k}$ 共轭。",
            ),
            why(
              rotations,
              "That counts only the classes of rotations; the reflections add one or two more.",
              "这只数了旋转的共轭类；反射还要再加一个或两个类。",
            ),
            n % 2 === 1
              ? why(value + 1, `For odd $${n}$ all the reflections form a single class.`, `$${n}$ 为奇数时，全部反射构成一个类。`)
              : why(
                  value + 1,
                  `For even $${n}$ the reflections form exactly two classes, by the parity of the exponent.`,
                  `$${n}$ 为偶数时，反射按指数的奇偶恰好构成两个类。`,
                ),
            n % 2 === 1
              ? why(
                  value - 1,
                  "That leaves out a class; count $\\{e\\}$, the pairs of rotations and the class of reflections.",
                  "这漏掉了一个类；要数 $\\{e\\}$、各对旋转以及反射构成的类。",
                )
              : why(
                  value - 1,
                  `That puts all the reflections in one class, but for even $${n}$ they form two.`,
                  `这把全部反射放进一个类，但 $${n}$ 为偶数时它们构成两个类。`,
                ),
            why(
              2 * n,
              "That is the order of the group; conjugacy classes group its elements together.",
              "这是群的阶；共轭类是把元素归并在一起的。",
            ),
          ]),
          solution:
            n % 2 === 1
              ? walked(
                  [
                    [
                      ["Count the rotation classes", "数旋转的共轭类"],
                      t(
                        `$\\{e\\}$ and the $${pairs}$ ${plural(pairs, "pair", "pairs")} $\\{r^k, r^{-k}\\}$: $${rotations}$ classes.`,
                        `$\\{e\\}$ 与 $${pairs}$ 对 $\\{r^k, r^{-k}\\}$：共 $${rotations}$ 个类。`,
                      ),
                    ],
                    [
                      ["Count the reflection classes", "数反射的共轭类"],
                      t(
                        `$${n}$ is odd, so the reflections form one class: $${rotations} + 1 = ${value}$.`,
                        `$${n}$ 为奇数，所以反射构成一个类：$${rotations} + 1 = ${value}$。`,
                      ),
                    ],
                  ],
                  t(
                    `The class sizes $1 + ${times(pairs, "2")} + ${n}$ add up to $${2 * n}$, the order of the group.`,
                    `各类大小之和 $1 + ${times(pairs, "2")} + ${n}$ 等于 $${2 * n}$，正是群的阶。`,
                  ),
                )
              : walked(
                  [
                    [
                      ["Count the rotation classes", "数旋转的共轭类"],
                      t(
                        `$\\{e\\}$, $\\{${rPow(n / 2)}\\}$ and the $${pairs}$ ${plural(pairs, "pair", "pairs")} $\\{r^k, r^{-k}\\}$: $${rotations}$ classes.`,
                        `$\\{e\\}$、$\\{${rPow(n / 2)}\\}$ 与 $${pairs}$ 对 $\\{r^k, r^{-k}\\}$：共 $${rotations}$ 个类。`,
                      ),
                    ],
                    [
                      ["Count the reflection classes", "数反射的共轭类"],
                      t(
                        `$${n}$ is even, so the reflections form two classes: $${rotations} + 2 = ${value}$.`,
                        `$${n}$ 为偶数，所以反射构成两个类：$${rotations} + 2 = ${value}$。`,
                      ),
                    ],
                  ],
                  t(
                    `The class sizes $1 + 1 + ${times(pairs, "2")} + 2 \\cdot ${n / 2}$ add up to $${2 * n}$, the order of the group.`,
                    `各类大小之和 $1 + 1 + ${times(pairs, "2")} + 2 \\cdot ${n / 2}$ 等于 $${2 * n}$，正是群的阶。`,
                  ),
                ),
        });
      },
    },
  ],
};

/** conjugacyOfGroupSubsetsAndSubgroups counts conjugate subgroups and conjugates cyclic subgroups. */
export const conjugacyOfGroupSubsetsAndSubgroups: TopicDef = {
  id: "conjugacy-of-group-subsets-and-subgroups",
  title: t("Conjugacy of Group Subsets and Subgroups", "群的子集与子群的共轭"),
  summary: t(
    "G acts by conjugation on its subsets and on its subgroups: g · H = gHg⁻¹, and g⟨x⟩g⁻¹ = ⟨gxg⁻¹⟩. The stabilizer of H is its normalizer, so H has [G : N(H)] conjugates, and H is normal exactly when it has only one.",
    "G 通过共轭作用于它的子集和子群：g · H = gHg⁻¹，且 g⟨x⟩g⁻¹ = ⟨gxg⁻¹⟩。H 的稳定子是它的正规化子，所以 H 有 [G : N(H)] 个共轭子群，H 正规当且仅当它只有一个共轭。",
  ),
  intro: t(
    "In $S_4$, $N(\\langle (1\\;2) \\rangle)$ consists of the permutations mapping $\\{1, 2\\}$ to itself: $2! \\cdot 2! = 4$ elements. So $\\langle (1\\;2) \\rangle$ has $\\frac{24}{4} = 6$ conjugates.\n\nCheck: $S_4$ has $\\binom{4}{2} = 6$ transpositions, and each generates one conjugate.\n\nIn this lesson we count the conjugates of a subgroup and conjugate cyclic subgroups.",
    "在 $S_4$ 中，$N(\\langle (1\\;2) \\rangle)$ 由把 $\\{1, 2\\}$ 映到自身的置换组成：共 $2! \\cdot 2! = 4$ 个元素。所以 $\\langle (1\\;2) \\rangle$ 有 $\\frac{24}{4} = 6$ 个共轭子群。\n\n检验：$S_4$ 有 $\\binom{4}{2} = 6$ 个对换，每个对换生成一个共轭子群。\n\n本课我们数一个子群的共轭子群，并求循环子群的共轭。",
  ),
  prerequisites: ["conjugation-and-conjugacy-classes"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-conjugate-subgroups",
      title: t("Counting conjugate subgroups", "数共轭子群"),
      explanation: t(
        "The number of subgroups conjugate to a given one is the group order divided by the order of its normalizer. In $S_5$, $N(\\langle (1\\;2) \\rangle)$ has $2! \\cdot 3! = 12$ elements, so $\\langle (1\\;2) \\rangle$ has $\\frac{120}{12} = 10$ conjugates, one for each transposition.\n\nIn $S_6$, $N(\\langle (1\\;2\\;3) \\rangle)$ consists of the permutations mapping $\\{1, 2, 3\\}$ to itself: $3! \\cdot 3! = 36$ elements. So $\\langle (1\\;2\\;3) \\rangle$ has $\\frac{720}{36} = 20$ conjugates.\n\nCheck: $\\{1, \\dots, 6\\}$ has $\\binom{6}{3} = 20$ three-element subsets, and each carries exactly one subgroup generated by a $3$-cycle.\n\n> **Watch out.** Count subgroups, not elements: $(1\\;2\\;3)$ and $(1\\;3\\;2)$ generate the same subgroup, so $S_6$ has $40$ three-cycles but only $20$ such subgroups.",
        "与给定子群共轭的子群个数等于群的阶除以它的正规化子的阶。在 $S_5$ 中，$N(\\langle (1\\;2) \\rangle)$ 有 $2! \\cdot 3! = 12$ 个元素，所以 $\\langle (1\\;2) \\rangle$ 有 $\\frac{120}{12} = 10$ 个共轭子群，每个对换对应一个。\n\n在 $S_6$ 中，$N(\\langle (1\\;2\\;3) \\rangle)$ 由把 $\\{1, 2, 3\\}$ 映到自身的置换组成：共 $3! \\cdot 3! = 36$ 个元素。所以 $\\langle (1\\;2\\;3) \\rangle$ 有 $\\frac{720}{36} = 20$ 个共轭子群。\n\n检验：$\\{1, \\dots, 6\\}$ 有 $\\binom{6}{3} = 20$ 个三元子集，每个子集上恰有一个由 $3$-轮换生成的子群。\n\n> **注意。** 数的是子群而不是元素：$(1\\;2\\;3)$ 与 $(1\\;3\\;2)$ 生成同一个子群，所以 $S_6$ 有 $40$ 个 $3$-轮换，却只有 $20$ 个这样的子群。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 2) {
          const n = rng.int(3, 30);
          const k = rng.int(0, n - 1);
          const value = n % 2 === 0 ? n / 2 : n;
          const size = n % 2 === 0 ? 4 : 2;
          return numberProblem({
            prompt: t(
              `In the dihedral group $D_{${n}}$ of order $${2 * n}$, how many conjugates does $\\langle ${rsTex(k)} \\rangle$ have?`,
              `在 $${2 * n}$ 阶二面体群 $D_{${n}}$ 中，$\\langle ${rsTex(k)} \\rangle$ 有多少个共轭子群？`,
            ),
            answer: value,
            mistakes: apart(
              value,
              [
                why(
                  n,
                  `That is the number of reflections, but for even $${n}$ only those $r^js$ with $j$ of the same parity as $${k}$ are conjugate to $${rsTex(k)}$.`,
                  `这是反射的个数，但 $${n}$ 为偶数时，只有 $j$ 与 $${k}$ 奇偶相同的 $r^js$ 才与 $${rsTex(k)}$ 共轭。`,
                ),
                why(
                  n / 2,
                  `For odd $${n}$ all the reflections are conjugate, so there is one conjugate for each of the $${n}$ reflections.`,
                  `$${n}$ 为奇数时全部反射互相共轭，所以 $${n}$ 个反射各对应一个共轭子群。`,
                ),
                why(2, "That is the order of the subgroup, not the number of its conjugates.", "这是子群的阶，而不是共轭子群的个数。"),
                why(
                  2 * n,
                  "That is the order of the group; divide it by the order of the normalizer.",
                  "这是群的阶；还要除以正规化子的阶。",
                ),
                why(
                  1,
                  "Only a normal subgroup has a single conjugate, and a subgroup generated by a reflection is not normal here.",
                  "只有正规子群才只有一个共轭子群，而这里由反射生成的子群不是正规的。",
                ),
              ].filter((m) => Number.isInteger(m.value)),
            ),
            solution: walked(
              [
                [
                  ["Find the normalizer", "求正规化子"],
                  n % 2 === 0
                    ? t(
                        `$N(\\langle ${rsTex(k)} \\rangle) = \\{e, ${rPow(n / 2)}, ${rsTex(k)}, ${rsTex(mod(k + n / 2, n))}\\}$ has $4$ elements.`,
                        `$N(\\langle ${rsTex(k)} \\rangle) = \\{e, ${rPow(n / 2)}, ${rsTex(k)}, ${rsTex(mod(k + n / 2, n))}\\}$ 有 $4$ 个元素。`,
                      )
                    : t(
                        `$N(\\langle ${rsTex(k)} \\rangle) = \\{e, ${rsTex(k)}\\}$ has $2$ elements.`,
                        `$N(\\langle ${rsTex(k)} \\rangle) = \\{e, ${rsTex(k)}\\}$ 有 $2$ 个元素。`,
                      ),
                ],
                [
                  ["Divide", "相除"],
                  t(
                    `There are $\\frac{${2 * n}}{${size}} = ${value}$ conjugates.`,
                    `共有 $\\frac{${2 * n}}{${size}} = ${value}$ 个共轭子群。`,
                  ),
                ],
              ],
              n % 2 === 0
                ? t(
                    `The conjugates are the subgroups $\\langle r^js \\rangle$ with $j$ of the same parity as $${k}$: $${n / 2}$ of them.`,
                    `共轭子群是 $j$ 与 $${k}$ 奇偶相同的子群 $\\langle r^js \\rangle$：共 $${n / 2}$ 个。`,
                  )
                : t(`Each of the $${n}$ reflections generates one conjugate.`, `$${n}$ 个反射各生成一个共轭子群。`),
            ),
          });
        }
        const n = rng.int(4, 9);
        const k = kind + 2;
        const value = choose(n, k);
        const c = range(1, k);
        const normalizer = factorial(k) * factorial(n - k);
        const normalizerTex = n - k === 1 ? `${k}!` : `${k}! \\cdot ${n - k}!`;
        return numberProblem({
          prompt: t(
            `How many conjugates does $\\langle (${c.join("\\;")}) \\rangle$ have in $S_{${n}}$?`,
            `$\\langle (${c.join("\\;")}) \\rangle$ 在 $S_{${n}}$ 中有多少个共轭子群？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              value * (k - 1),
              `That counts the ${k}-cycles, but $${k - 1}$ of them generate each subgroup.`,
              `这数的是 ${k}-轮换，但每个子群由其中 $${k - 1}$ 个生成。`,
            ),
            why(
              factorial(n) / k,
              "That divides by the order of the subgroup, not by the order of its normalizer.",
              "这是除以子群的阶，而不是除以它的正规化子的阶。",
            ),
            why(
              factorial(n - k),
              `That is the number of permutations fixing $${c.join(", ")}$ one by one, only part of the normalizer.`,
              `这是逐点固定 $${c.join(", ")}$ 的置换个数，只是正规化子的一部分。`,
            ),
            why(
              n,
              `The conjugates correspond to the ${k}-element subsets of $\\{1, \\dots, ${n}\\}$, not to its points.`,
              `共轭子群对应于 $\\{1, \\dots, ${n}\\}$ 的 ${k} 元子集，而不是它的点。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the normalizer", "求正规化子"],
                t(
                  `The normalizer consists of the permutations mapping $\\{${c.join(", ")}\\}$ to itself: $${normalizerTex} = ${normalizer}$ elements.`,
                  `正规化子由把 $\\{${c.join(", ")}\\}$ 映到自身的置换组成：共 $${normalizerTex} = ${normalizer}$ 个元素。`,
                ),
              ],
              [
                ["Divide", "相除"],
                t(
                  `There are $\\frac{${n}!}{${normalizer}} = \\frac{${factorial(n)}}{${normalizer}} = ${value}$ conjugates.`,
                  `共有 $\\frac{${n}!}{${normalizer}} = \\frac{${factorial(n)}}{${normalizer}} = ${value}$ 个共轭子群。`,
                ),
              ],
            ],
            t(
              `The conjugates correspond to the ${k}-element subsets of $\\{1, \\dots, ${n}\\}$, and $\\binom{${n}}{${k}} = ${value}$.`,
              `共轭子群对应于 $\\{1, \\dots, ${n}\\}$ 的 ${k} 元子集，且 $\\binom{${n}}{${k}} = ${value}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "conjugating-cyclic-subgroups",
      title: t("Conjugating a cyclic subgroup", "共轭一个循环子群"),
      explanation: t(
        "Conjugating a cyclic subgroup element by element gives the cyclic subgroup generated by the conjugate of its generator. $\\sigma\\langle \\tau \\rangle\\sigma^{-1} = \\langle \\sigma\\tau\\sigma^{-1} \\rangle$. With $\\sigma = (1\\;4)$ and $\\tau = (1\\;2\\;3)$: $\\sigma\\langle \\tau \\rangle\\sigma^{-1} = \\langle (4\\;2\\;3) \\rangle$.\n\nWith $\\sigma = (2\\;5)$ and $\\tau = (1\\;2\\;3)$: relabeling $2$ as $5$ in the cycle of $\\tau$ gives $\\sigma\\langle \\tau \\rangle\\sigma^{-1} = \\langle (1\\;5\\;3) \\rangle$.\n\nCheck: $\\sigma\\tau\\sigma^{-1}$ sends $5$ to $\\sigma(\\tau(2)) = \\sigma(3) = 3$, as $(1\\;5\\;3)$ does.\n\n> **Watch out.** Conjugating by $\\sigma$ applies $\\sigma$ to the entries of the cycle of $\\tau$; it is not the product $\\sigma\\tau$.",
        "共轭一个循环子群，得到的是由其生成元的共轭所生成的循环子群。$\\sigma\\langle \\tau \\rangle\\sigma^{-1} = \\langle \\sigma\\tau\\sigma^{-1} \\rangle$。设 $\\sigma = (1\\;4)$，$\\tau = (1\\;2\\;3)$：$\\sigma\\langle \\tau \\rangle\\sigma^{-1} = \\langle (4\\;2\\;3) \\rangle$。\n\n设 $\\sigma = (2\\;5)$，$\\tau = (1\\;2\\;3)$：在 $\\tau$ 的轮换中把 $2$ 换成 $5$，得 $\\sigma\\langle \\tau \\rangle\\sigma^{-1} = \\langle (1\\;5\\;3) \\rangle$。\n\n检验：$\\sigma\\tau\\sigma^{-1}$ 把 $5$ 映到 $\\sigma(\\tau(2)) = \\sigma(3) = 3$，与 $(1\\;5\\;3)$ 一致。\n\n> **注意。** 用 $\\sigma$ 共轭是把 $\\sigma$ 作用于 $\\tau$ 的轮换中的各个数，而不是求乘积 $\\sigma\\tau$。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        let s: Perm;
        let tau: Perm;
        let c: Perm;
        do {
          s = randomCyclePerm(rng, n);
          tau = cyclePerm(n, rng.sample(range(0, n - 1), rng.int(3, 4)));
          c = composePerm(composePerm(s, tau), invertPerm(s));
        } while (permCycleTex(c) === permCycleTex(tau) || permCycleTex(c) === permCycleTex(invertPerm(tau)));
        const other = composePerm(composePerm(invertPerm(s), tau), s);
        const gen = (p: Perm) => `\\langle ${permCycleTex(p)} \\rangle`;
        const a = cyclesOf(tau)[0]![0]!;
        const reasons: Reason[] = [
          because(
            gen(other),
            "That is $\\sigma^{-1}H\\sigma$, conjugating the other way round.",
            "这是 $\\sigma^{-1}H\\sigma$，共轭的方向反了。",
          ),
          because(
            gen(tau),
            "That is $H$ itself, but $\\sigma$ moves points of the cycle of $\\tau$.",
            "这是 $H$ 本身，但 $\\sigma$ 移动了 $\\tau$ 的轮换中的点。",
          ),
          because(
            gen(composePerm(s, tau)),
            "That uses the product $\\sigma\\tau$, not the conjugate $\\sigma\\tau\\sigma^{-1}$.",
            "这用的是乘积 $\\sigma\\tau$，而不是共轭 $\\sigma\\tau\\sigma^{-1}$。",
          ),
          because(
            gen(composePerm(tau, s)),
            "That uses the product $\\tau\\sigma$, not a conjugate of $\\tau$.",
            "这用的是乘积 $\\tau\\sigma$，而不是 $\\tau$ 的共轭。",
          ),
        ];
        return reasoned(
          texChoice(
            rng,
            t(
              `In $S_{${n}}$, let $\\sigma = ${permCycleTex(s)}$ and $H = ${gen(tau)}$. Find $\\sigma H \\sigma^{-1}$.`,
              `在 $S_{${n}}$ 中，设 $\\sigma = ${permCycleTex(s)}$，$H = ${gen(tau)}$。求 $\\sigma H \\sigma^{-1}$。`,
            ),
            gen(c),
            [
              permCycleTex(other) === permCycleTex(c) || permCycleTex(other) === permCycleTex(invertPerm(c))
                ? gen(composePerm(s, tau))
                : gen(other),
              gen(tau),
              gen(composePerm(s, tau)),
              gen(composePerm(tau, s)),
            ],
            walked(
              [
                [
                  ["Conjugate the generator", "共轭生成元"],
                  t(
                    "$\\sigma H \\sigma^{-1} = \\langle \\sigma\\tau\\sigma^{-1} \\rangle$, since conjugation by $\\sigma$ is a homomorphism.",
                    "$\\sigma H \\sigma^{-1} = \\langle \\sigma\\tau\\sigma^{-1} \\rangle$，因为用 $\\sigma$ 共轭是一个同态。",
                  ),
                ],
                [
                  ["Relabel the cycle", "重新标记轮换"],
                  t(
                    `Replacing each entry $i$ of $\\tau = ${permCycleTex(tau)}$ by $\\sigma(i)$ gives $${permCycleTex(c)}$.`,
                    `把 $\\tau = ${permCycleTex(tau)}$ 中的每个数 $i$ 换成 $\\sigma(i)$，得到 $${permCycleTex(c)}$。`,
                  ),
                ],
              ],
              t(
                `$\\sigma\\tau\\sigma^{-1}$ sends $${s[a]! + 1}$ to $\\sigma(\\tau(${a + 1})) = ${s[tau[a]!]! + 1}$, as $${permCycleTex(c)}$ does.`,
                `$\\sigma\\tau\\sigma^{-1}$ 把 $${s[a]! + 1}$ 映到 $\\sigma(\\tau(${a + 1})) = ${s[tau[a]!]! + 1}$，与 $${permCycleTex(c)}$ 一致。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
  ],
};

/** cycleType lists the cycle lengths of a permutation of n points, fixed points included, in decreasing order. */
function cycleType(p: Perm): number[] {
  const ls = cyclesOf(p).map((c) => c.length);
  const fixed = p.length - ls.reduce((a, b) => a + b, 0);
  return [...ls, ...Array<number>(fixed).fill(1)].sort((a, b) => b - a);
}

/** classSize is the number of permutations of the given cycle type. */
function classSize(type: readonly number[]): number {
  const n = type.reduce((a, b) => a + b, 0);
  let d = 1;
  for (const k of new Set(type)) {
    const m = type.filter((x) => x === k).length;
    d *= k ** m * factorial(m);
  }
  return factorial(n) / d;
}

/** classDenominatorTex writes the product of kᵐ m! over the cycle lengths k occurring m times, leaving out factors equal to 1. */
function classDenominatorTex(type: readonly number[]): string {
  const parts: string[] = [];
  for (const k of new Set(type)) {
    const m = type.filter((x) => x === k).length;
    if (k > 1) parts.push(pw(k, m));
    if (m > 1) parts.push(`${m}!`);
  }
  return parts.join(" \\cdot ");
}

/** cycleTypesOfPermutations counts permutations of a cycle type and decides conjugacy. */
export const cycleTypesOfPermutations: TopicDef = {
  id: "cycle-types-of-permutations",
  title: t("Cycle Types of Permutations", "置换的轮换型"),
  summary: t(
    "The cycle type of $\\sigma \\in S_n$ lists the lengths of its disjoint cycles, fixed points included; it is a partition of $n$. Two permutations are conjugate in $S_n$ exactly when they have the same cycle type, so the conjugacy classes of $S_n$ correspond to partitions of $n$. If the type has $m_k$ cycles of length $k$, the class has $\\frac{n!}{\\prod_k k^{m_k} m_k!}$ elements.",
    "$\\sigma \\in S_n$ 的轮换型列出它的各不相交轮换的长度（包括不动点）；它是 $n$ 的一个分拆。两个置换在 $S_n$ 中共轭当且仅当轮换型相同，所以 $S_n$ 的共轭类与 $n$ 的分拆一一对应。若轮换型中长度为 $k$ 的轮换有 $m_k$ 个，则该类有 $\\frac{n!}{\\prod_k k^{m_k} m_k!}$ 个元素。",
  ),
  intro: t(
    "The permutations of $S_5$ of type $(3, 2)$ number $\\frac{5!}{3 \\cdot 2} = 20$: divide by $3$ for the rotations of the $3$-cycle and by $2$ for those of the transposition.\n\nCheck: choose the transposition in $\\binom{5}{2} = 10$ ways, then the $3$-cycle on the other three points in $2$ ways: $10 \\cdot 2 = 20$.\n\nIn this lesson we count the permutations of a cycle type and decide conjugacy in symmetric groups by cycle type.",
    "$S_5$ 中轮换型为 $(3, 2)$ 的置换有 $\\frac{5!}{3 \\cdot 2} = 20$ 个：除以 $3$ 是因为 $3$-轮换的旋转，除以 $2$ 是因为对换的旋转。\n\n检验：先选对换，有 $\\binom{5}{2} = 10$ 种方式，再在其余三个点上取 $3$-轮换，有 $2$ 种方式：$10 \\cdot 2 = 20$。\n\n本课我们数给定轮换型的置换，并用轮换型判断对称群中的共轭。",
  ),
  prerequisites: ["conjugation-and-conjugacy-classes", "partitions-of-natural-numbers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-permutations-of-a-cycle-type",
      title: t("Counting a cycle type", "数某一轮换型"),
      explanation: t(
        "Arrange all the points, then divide by the rotations within each cycle and by the reorderings of cycles of equal length. The permutations of $S_6$ of type $(2, 2, 1, 1)$ number $\\frac{6!}{2^2 \\cdot 2! \\cdot 1^2 \\cdot 2!} = 45$.\n\nThe permutations of $S_7$ of type $(3, 3, 1)$ number $\\frac{7!}{3^2 \\cdot 2!} = \\frac{5040}{18} = 280$; the single fixed point divides by nothing.\n\nCheck: choose the points of the two $3$-cycles in $\\frac{1}{2}\\binom{7}{3}\\binom{4}{3} = 70$ ways, and each $3$-cycle in $2$ ways: $70 \\cdot 4 = 280$.\n\n> **Watch out.** Also divide by $m_k!$ for cycles of equal length: swapping two cycles of the same length gives the same permutation.",
        "先排列所有的点，再除以每个轮换内部的旋转数以及等长轮换之间的重排数。$S_6$ 中轮换型为 $(2, 2, 1, 1)$ 的置换有 $\\frac{6!}{2^2 \\cdot 2! \\cdot 1^2 \\cdot 2!} = 45$ 个。\n\n$S_7$ 中轮换型为 $(3, 3, 1)$ 的置换有 $\\frac{7!}{3^2 \\cdot 2!} = \\frac{5040}{18} = 280$ 个；唯一的不动点不需要除。\n\n检验：选两个 $3$-轮换的点有 $\\frac{1}{2}\\binom{7}{3}\\binom{4}{3} = 70$ 种方式，每个 $3$-轮换有 $2$ 种写法：$70 \\cdot 4 = 280$。\n\n> **注意。** 等长的轮换还要除以 $m_k!$：交换两个等长的轮换得到的是同一个置换。",
      ),
      generate(rng) {
        const n = rng.int(4, 8);
        let type: number[];
        do {
          type = [];
          let left = n;
          while (left > 0) {
            const k = rng.int(1, Math.min(left, 5));
            type.push(k);
            left -= k;
          }
          type.sort((a, b) => b - a);
        } while (type[0] === 1);
        const value = classSize(type);
        const naive = factorial(n) / type.reduce((a, k) => a * k, 1);
        const den = factorial(n) / value;
        return numberProblem({
          prompt: t(
            `How many permutations in $S_{${n}}$ have cycle type $(${type.join(", ")})$?`,
            `$S_{${n}}$ 中轮换型为 $(${type.join(", ")})$ 的置换有多少个？`,
          ),
          answer: value,
          mistakes: apart(
            value,
            [
              why(
                naive,
                "That divides only by the cycle lengths; also divide by $m_k!$ for each length that repeats.",
                "这只除以了各轮换的长度；对重复出现的长度还要除以 $m_k!$。",
              ),
              why(
                value * 2,
                `That is twice the count; $${n}!$ divided by $${den}$ is $${value}$.`,
                `这是正确个数的两倍；$${n}!$ 除以 $${den}$ 得 $${value}$。`,
              ),
              why(
                Math.floor(value / 2),
                `That divides by an extra $2$; $${n}!$ divided by $${den}$ is $${value}$.`,
                `这多除了一个 $2$；$${n}!$ 除以 $${den}$ 得 $${value}$。`,
              ),
              why(
                factorial(n) / factorial(type.length),
                "That divides by the reorderings of all the cycles, instead of the rotations within each cycle and the reorderings of equal ones.",
                "这除以的是全部轮换的重排数，而应除以每个轮换内部的旋转数和等长轮换之间的重排数。",
              ),
            ].filter((m) => Number.isInteger(m.value)),
          ),
          solution: walked(
            [
              [
                ["Write the denominator", "写出分母"],
                t(
                  `Each cycle length $k$ occurring $m_k$ times contributes $k^{m_k} m_k!$: $${classDenominatorTex(type)} = ${den}$.`,
                  `每个出现 $m_k$ 次的轮换长度 $k$ 贡献 $k^{m_k} m_k!$：$${classDenominatorTex(type)} = ${den}$。`,
                ),
              ],
              [
                ["Divide", "相除"],
                t(
                  `$\\frac{${n}!}{${den}} = \\frac{${factorial(n)}}{${den}} = ${value}$.`,
                  `$\\frac{${n}!}{${den}} = \\frac{${factorial(n)}}{${den}} = ${value}$。`,
                ),
              ],
            ],
            t(`$${value} \\cdot ${den} = ${factorial(n)} = ${n}!$.`, `$${value} \\cdot ${den} = ${factorial(n)} = ${n}!$。`),
          ),
        });
      },
    },
    {
      id: "deciding-conjugacy-in-symmetric-groups",
      title: t("Conjugate or not", "是否共轭"),
      explanation: t(
        "Two permutations are conjugate in a symmetric group exactly when they have the same cycle type, since conjugation only relabels points. $(1\\;2\\;3)(4\\;5)$ and $(1\\;5)(2\\;4\\;6)$ are conjugate in $S_6$: both have type $(3, 2, 1)$. $(1\\;2)(3\\;4)$ and $(1\\;2\\;3)$ are not.\n\n$(1\\;2\\;3\\;4)$ and $(1\\;3)(2\\;4)$ are not conjugate in $S_4$: their types are $(4)$ and $(2, 2)$, though both move all four points.\n\nCheck: $(1\\;2\\;3\\;4)$ has order $4$ and $(1\\;3)(2\\;4)$ has order $2$, and conjugate elements have equal orders.\n\n> **Watch out.** Compare the full cycle types, fixed points included; moving the same number of points is not enough.",
        "两个置换在对称群中共轭，当且仅当它们有相同的轮换型，因为共轭只是给点重新命名。$(1\\;2\\;3)(4\\;5)$ 与 $(1\\;5)(2\\;4\\;6)$ 在 $S_6$ 中共轭：二者轮换型都是 $(3, 2, 1)$。$(1\\;2)(3\\;4)$ 与 $(1\\;2\\;3)$ 不共轭。\n\n$(1\\;2\\;3\\;4)$ 与 $(1\\;3)(2\\;4)$ 在 $S_4$ 中不共轭：它们的轮换型分别为 $(4)$ 与 $(2, 2)$，尽管二者都移动全部四个点。\n\n检验：$(1\\;2\\;3\\;4)$ 的阶为 $4$，$(1\\;3)(2\\;4)$ 的阶为 $2$，而共轭的元素阶相同。\n\n> **注意。** 要比较完整的轮换型（包括不动点）；移动的点数相同还不够。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const lengthsA = rng.pick(
          [[2, 2], [3, 2], [3], [4], [2], [4, 2], [3, 3], [2, 2, 2]].filter((l) => l.reduce((a, b) => a + b, 0) <= n),
        );
        const lengthsB = rng.bool()
          ? lengthsA
          : rng.pick([[2, 2], [3, 2], [3], [4], [2], [4, 2], [3, 3], [2, 2, 2]].filter((l) => l.reduce((a, b) => a + b, 0) <= n));
        const a = productOfCycles(n, randomDisjointCycles(rng, n, lengthsA));
        const b = productOfCycles(n, randomDisjointCycles(rng, n, lengthsB));
        const [ta, tb] = [cycleType(a), cycleType(b)];
        const holds = ta.join() === tb.join();
        const [oa, ob] = [permOrder(a), permOrder(b)];
        return decide({
          prompt: t(
            `Are $${permCycleTex(a)}$ and $${permCycleTex(b)}$ conjugate in $S_{${n}}$?`,
            `$${permCycleTex(a)}$ 与 $${permCycleTex(b)}$ 在 $S_{${n}}$ 中共轭吗？`,
          ),
          holds,
          steps: [
            [
              ["Find the first cycle type", "求第一个轮换型"],
              t(`$${permCycleTex(a)}$ has cycle type $(${ta.join(", ")})$.`, `$${permCycleTex(a)}$ 的轮换型为 $(${ta.join(", ")})$。`),
            ],
            [
              ["Find the second cycle type", "求第二个轮换型"],
              t(
                `$${permCycleTex(b)}$ has cycle type $(${tb.join(", ")})$, so the two are ${holds ? "" : "not "}conjugate.`,
                `$${permCycleTex(b)}$ 的轮换型为 $(${tb.join(", ")})$，所以二者${holds ? "" : "不"}共轭。`,
              ),
            ],
          ],
          check: holds
            ? t(`Both have order $${oa}$, as conjugate elements must.`, `二者的阶都是 $${oa}$，共轭元素理应如此。`)
            : oa === ob
              ? t(
                  `Both have order $${oa}$, but equal orders do not make permutations conjugate: the numbers of fixed points, $${ta.filter((x) => x === 1).length}$ and $${tb.filter((x) => x === 1).length}$, differ.`,
                  `二者的阶都是 $${oa}$，但阶相同并不意味着共轭：它们的不动点个数 $${ta.filter((x) => x === 1).length}$ 与 $${tb.filter((x) => x === 1).length}$ 不同。`,
                )
              : t(
                  `Their orders are $${oa}$ and $${ob}$, and conjugate elements have equal orders.`,
                  `它们的阶分别为 $${oa}$ 与 $${ob}$，而共轭元素的阶相同。`,
                ),
          wrong: holds
            ? t(
                "Permutations of the same cycle type are conjugate: relabeling the points cycle by cycle turns one into the other.",
                "轮换型相同的置换共轭：逐个轮换地重新命名点，就能把一个变成另一个。",
              )
            : t(
                `Conjugation keeps the cycle type, and $(${ta.join(", ")})$ differs from $(${tb.join(", ")})$.`,
                `共轭保持轮换型，而 $(${ta.join(", ")})$ 与 $(${tb.join(", ")})$ 不同。`,
              ),
        });
      },
    },
  ],
};

/** cycleTypesOfPermutationsOfSomeGroups finds the cycle structure of dihedral symmetries acting on vertices. */
export const cycleTypesOfPermutationsOfSomeGroups: TopicDef = {
  id: "cycle-types-of-permutations-of-some-groups",
  title: t("Cycle Types of Permutations of Some Groups", "某些群的置换的轮换型"),
  summary: t(
    "A symmetry of a figure permutes its vertices (or faces, or edges), and its cycle type records how. Acting on the vertices of a regular n-gon, the rotation rᵏ splits them into gcd(k, n) cycles of length n/gcd(k, n). A reflection fixes 1 vertex if n is odd; if n is even it fixes 2 or none, depending on whether its axis passes through vertices; the remaining vertices are swapped in pairs.",
    "图形的对称置换它的顶点（或面、棱），其轮换型记录了置换的方式。作用于正 n 边形的顶点时，旋转 rᵏ 把顶点分成 gcd(k, n) 个长度为 n/gcd(k, n) 的轮换。n 为奇数时反射固定 1 个顶点；n 为偶数时，视对称轴是否经过顶点，固定 2 个或 0 个顶点；其余顶点两两对换。",
  ),
  intro: t(
    "In $D_6$ acting on the vertices $0, \\dots, 5$ of a hexagon, $r^2$ splits them into $\\gcd(2, 6) = 2$ cycles of length $3$: $(0\\;2\\;4)(1\\;3\\;5)$.\n\nCheck: $r^2$ has order $3$, the length of each cycle, and $2 \\cdot 3 = 6$ vertices.\n\nIn this lesson we find the cycle types of the rotations and reflections of a regular polygon acting on its vertices.",
    "在 $D_6$ 作用于六边形顶点 $0, \\dots, 5$ 时，$r^2$ 把它们分成 $\\gcd(2, 6) = 2$ 个长度为 $3$ 的轮换：$(0\\;2\\;4)(1\\;3\\;5)$。\n\n检验：$r^2$ 的阶为 $3$，正是每个轮换的长度，且 $2 \\cdot 3 = 6$ 个顶点。\n\n本课我们求正多边形的旋转与反射作用于顶点时的轮换型。",
  ),
  prerequisites: ["cycle-types-of-permutations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "cycles-of-rotations-of-polygons",
      figure: algebraDrawings2["cycle-types-of-permutations-of-some-groups#cycles-of-rotations-of-polygons"],
      title: t("Rotations of polygons", "多边形的旋转"),
      explanation: t(
        "In $D_{12}$, $r^8$ moves each vertex $8$ steps around, so it has order $3$ and splits the $12$ vertices into $\\gcd(8, 12) = 4$ cycles of length $3$.\n\nIn $D_{10}$, $r^4$ splits the $10$ vertices into $\\gcd(4, 10) = 2$ cycles of length $5$, such as $0, 4, 8, 2, 6$.\n\nCheck: $2 \\cdot 5 = 10$ vertices, and $r^4$ has order $5$.\n\n> **Watch out.** The number of cycles is $\\gcd(k, n)$ and their length is $\\frac{n}{\\gcd(k, n)}$; do not swap the two, and do not use $k$ itself.",
        "在 $D_{12}$ 中，$r^8$ 把每个顶点沿多边形移动 $8$ 步，所以阶为 $3$，把 $12$ 个顶点分成 $\\gcd(8, 12) = 4$ 个长度为 $3$ 的轮换。\n\n在 $D_{10}$ 中，$r^4$ 把 $10$ 个顶点分成 $\\gcd(4, 10) = 2$ 个长度为 $5$ 的轮换，例如 $0, 4, 8, 2, 6$。\n\n检验：$2 \\cdot 5 = 10$ 个顶点，且 $r^4$ 的阶为 $5$。\n\n> **注意。** 轮换的个数是 $\\gcd(k, n)$，长度是 $\\frac{n}{\\gcd(k, n)}$；不要把两者弄反，也不要直接用 $k$。",
      ),
      generate(rng) {
        let n: number;
        let k: number;
        do {
          n = rng.int(6, 24);
          k = rng.int(2, n - 1);
        } while (gcd(k, n) === 1);
        const g = gcd(k, n);
        const askCount = rng.bool();
        return numberProblem({
          prompt: askCount
            ? t(
                `Into how many cycles does $${rPow(k)}$ split the vertices of a regular ${n}-gon?`,
                `$${rPow(k)}$ 把正 ${n} 边形的顶点分成多少个轮换？`,
              )
            : t(
                `How long are the cycles of $${rPow(k)}$ acting on the vertices of a regular ${n}-gon?`,
                `$${rPow(k)}$ 作用于正 ${n} 边形的顶点时，各轮换的长度是多少？`,
              ),
          answer: askCount ? g : n / g,
          mistakes: askCount
            ? apart(g, [
                why(n / g, "That is the length of each cycle, not the number of cycles.", "这是每个轮换的长度，而不是轮换的个数。"),
                why(
                  k,
                  `The rotation moves each vertex $${k}$ steps, but the number of cycles is $\\gcd(${k}, ${n})$.`,
                  `旋转把每个顶点移动 $${k}$ 步，但轮换的个数是 $\\gcd(${k}, ${n})$。`,
                ),
                why(
                  n - k,
                  `That is the step of the inverse rotation, which has the same $\\gcd(${k}, ${n})$ cycles.`,
                  `这是逆旋转的步数，而逆旋转有同样的 $\\gcd(${k}, ${n})$ 个轮换。`,
                ),
              ])
            : apart(n / g, [
                why(g, "That is the number of cycles, not their length.", "这是轮换的个数，而不是它们的长度。"),
                why(
                  k,
                  `The rotation moves each vertex $${k}$ steps, but a cycle closes after $\\frac{${n}}{\\gcd(${k}, ${n})}$ steps.`,
                  `旋转把每个顶点移动 $${k}$ 步，但一个轮换要走 $\\frac{${n}}{\\gcd(${k}, ${n})}$ 步才回到起点。`,
                ),
                why(
                  n / k > 1 ? Math.floor(n / k) : n,
                  n / k > 1
                    ? `Dividing $${n}$ by $${k}$ ignores going round more than once; the length is $\\frac{${n}}{\\gcd(${k}, ${n})}$.`
                    : `Only a rotation with $\\gcd(k, n) = 1$ has a single cycle of length $${n}$.`,
                  n / k > 1
                    ? `用 $${n}$ 除以 $${k}$ 忽略了绕多圈的情况；长度是 $\\frac{${n}}{\\gcd(${k}, ${n})}$。`
                    : `只有 $\\gcd(k, n) = 1$ 的旋转才有一个长度为 $${n}$ 的轮换。`,
                ),
              ]),
          solution: walked(
            [
              [["Find the gcd", "求最大公约数"], t(`$\\gcd(${k}, ${n}) = ${g}$.`, `$\\gcd(${k}, ${n}) = ${g}$。`)],
              [
                ["Read off the cycles", "读出轮换"],
                t(
                  `So $${rPow(k)}$ has $${g}$ cycles of length $\\frac{${n}}{${g}} = ${n / g}$.`,
                  `所以 $${rPow(k)}$ 有 $${g}$ 个长度为 $\\frac{${n}}{${g}} = ${n / g}$ 的轮换。`,
                ),
              ],
            ],
            t(
              `$${g} \\cdot ${n / g} = ${n}$ vertices, and $${rPow(k)}$ has order $${n / g}$, the length of each cycle.`,
              `$${g} \\cdot ${n / g} = ${n}$ 个顶点，且 $${rPow(k)}$ 的阶为 $${n / g}$，正是每个轮换的长度。`,
            ),
          ),
        });
      },
    },
    {
      id: "cycles-of-reflections-of-polygons",
      figure: algebraDrawings2["cycle-types-of-permutations-of-some-groups#cycles-of-reflections-of-polygons"],
      title: t("Reflections of polygons", "多边形的反射"),
      explanation: t(
        "With $r^ks \\cdot v = k - v$ on the vertices $0, \\dots, 7$ of an octagon, $r^3s$ fixes no vertex ($2v \\equiv 3$ has no solution), so it is a product of $4$ transpositions; $r^2s$ fixes $1$ and $5$ and is a product of $3$ transpositions.\n\nIn $D_7$, $r^3s$ fixes the vertex $v$ with $2v \\equiv 3 \\pmod 7$, that is $v = 5$, and swaps the other $6$ vertices in $3$ pairs.\n\nCheck: $r^3s \\cdot 5 = 3 - 5 \\equiv 5 \\pmod 7$.\n\n> **Watch out.** For odd $n$ every reflection fixes exactly one vertex; for even $n$ it fixes two or none, depending on the parity of $k$.",
        "在八边形顶点 $0, \\dots, 7$ 上 $r^ks \\cdot v = k - v$，$r^3s$ 不固定任何顶点（$2v \\equiv 3$ 无解），所以是 $4$ 个对换之积；$r^2s$ 固定 $1$ 与 $5$，是 $3$ 个对换之积。\n\n在 $D_7$ 中，$r^3s$ 固定满足 $2v \\equiv 3 \\pmod 7$ 的顶点 $v$，即 $v = 5$，并把其余 $6$ 个顶点两两对换，成 $3$ 对。\n\n检验：$r^3s \\cdot 5 = 3 - 5 \\equiv 5 \\pmod 7$。\n\n> **注意。** $n$ 为奇数时每个反射恰好固定一个顶点；$n$ 为偶数时固定两个或零个顶点，取决于 $k$ 的奇偶。",
      ),
      generate(rng) {
        const n = rng.int(5, 20);
        const k = rng.int(0, n - 1);
        const fixed = range(0, n - 1).filter((v) => mod(k - v, n) === v);
        const value = (n - fixed.length) / 2;
        const assumed = (x: number) =>
          why(
            x,
            `That assumes $${rsTex(k)}$ fixes $${n - 2 * x}$ ${plural(n - 2 * x, "vertex", "vertices")}, but it fixes $${fixed.length}$.`,
            `这相当于假设 $${rsTex(k)}$ 固定 $${n - 2 * x}$ 个顶点，但它固定 $${fixed.length}$ 个。`,
          );
        return numberProblem({
          prompt: t(
            `$D_{${n}}$ acts on the vertices $0, \\dots, ${n - 1}$ of a regular ${n}-gon with $r \\cdot v = v + 1$ and $s \\cdot v = -v$. How many transpositions are in the cycle decomposition of $${rsTex(k)}$?`,
            `$D_{${n}}$ 作用于正 ${n} 边形的顶点 $0, \\dots, ${n - 1}$，$r \\cdot v = v + 1$，$s \\cdot v = -v$。$${rsTex(k)}$ 的轮换分解中有多少个对换？`,
          ),
          answer: value,
          mistakes: apart(value, [
            assumed(Math.floor(n / 2)),
            assumed(Math.floor((n - 1) / 2)),
            assumed(Math.floor((n - 2) / 2)),
            why(
              n,
              `Each transposition swaps two vertices, so there are at most $${Math.floor(n / 2)}$.`,
              `每个对换交换两个顶点，所以最多有 $${Math.floor(n / 2)}$ 个。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the fixed vertices", "求不动的顶点"],
                t(
                  `$${rsTex(k)} \\cdot v = ${k} - v$ equals $v$ when $2v \\equiv ${k} \\pmod{${n}}$: ${fixed.length === 0 ? "no vertex" : `the ${plural(fixed.length, "vertex", "vertices")} $${fixed.join(", ")}$`}.`,
                  `$${rsTex(k)} \\cdot v = ${k} - v$ 等于 $v$ 当且仅当 $2v \\equiv ${k} \\pmod{${n}}$：${fixed.length === 0 ? "没有这样的顶点" : `顶点 $${fixed.join(", ")}$`}。`,
                ),
              ],
              [
                ["Pair up the rest", "其余两两配对"],
                t(
                  `The other $${n - fixed.length}$ vertices are swapped in pairs: $\\frac{${n - fixed.length}}{2} = ${value}$ transpositions.`,
                  `其余 $${n - fixed.length}$ 个顶点两两对换：$\\frac{${n - fixed.length}}{2} = ${value}$ 个对换。`,
                ),
              ],
            ],
            t(
              `$${fixed.length} + 2 \\cdot ${value} = ${n}$, every vertex accounted for.`,
              `$${fixed.length} + 2 \\cdot ${value} = ${n}$，每个顶点都算到了。`,
            ),
          ),
        });
      },
    },
  ],
};

/** randomWord is a word of length n over a few letters with some repeated. */
function randomWord(rng: Rng): string {
  let w: string;
  do {
    const n = rng.int(4, 9);
    const letters = rng.sample(["A", "B", "C", "D", "E", "L", "M", "N", "O", "P", "R", "S", "T"], rng.int(2, 4));
    w = range(1, n)
      .map(() => rng.pick(letters))
      .join("");
  } while (new Set(w).size === w.length || new Set(w).size === 1);
  return w;
}

/** letterCounts lists how often each letter occurs in a word. */
const letterCounts = (w: string) => [...new Set(w)].map((c) => [...w].filter((x) => x === c).length);

/** stabilizerTex writes the product of m! over the letters occurring m > 1 times. */
const stabilizerTex = (ms: readonly number[]) =>
  ms
    .filter((m) => m > 1)
    .map((m) => `${m}!`)
    .join(" \\cdot ");

/** permutationActionsOnSetsOfWords finds orbits and stabilizers of Sₙ permuting the letters of words. */
export const permutationActionsOnSetsOfWords: TopicDef = {
  id: "permutation-actions-on-sets-of-words",
  title: t("Permutation Actions on Sets of Words", "置换在单词集合上的作用"),
  summary: t(
    "Sₙ acts on the words of length n by permuting positions. The orbit of a word consists of its rearrangements, and its stabilizer permutes equal letters among themselves. If the letters occur m₁, …, mₖ times, the stabilizer has m₁! ⋯ mₖ! elements, so by the orbit-stabilizer theorem there are n!/(m₁! ⋯ mₖ!) rearrangements.",
    "Sₙ 通过置换位置作用于长度为 n 的单词。单词的轨道由它的所有重排组成，稳定子只在相同字母之间置换。若各字母分别出现 m₁, …, mₖ 次，则稳定子有 m₁! ⋯ mₖ! 个元素，由轨道-稳定子定理，重排共有 n!/(m₁! ⋯ mₖ!) 种。",
  ),
  intro: t(
    "The orbit of $\\text{NOON}$ under $S_4$ has $\\frac{4!}{2! \\cdot 2!} = 6$ words: $\\text{NNOO}$, $\\text{NONO}$, $\\text{NOON}$, $\\text{ONNO}$, $\\text{ONON}$ and $\\text{OONN}$.\n\nCheck: the stabilizer has $2! \\cdot 2! = 4$ elements, and $6 \\cdot 4 = 24 = 4!$.\n\nIn this lesson we find the orbits and stabilizers of words under the permutations of their positions.",
    "$\\text{NOON}$ 在 $S_4$ 下的轨道有 $\\frac{4!}{2! \\cdot 2!} = 6$ 个单词：$\\text{NNOO}$、$\\text{NONO}$、$\\text{NOON}$、$\\text{ONNO}$、$\\text{ONON}$ 与 $\\text{OONN}$。\n\n检验：稳定子有 $2! \\cdot 2! = 4$ 个元素，且 $6 \\cdot 4 = 24 = 4!$。\n\n本课我们求单词在位置置换下的轨道与稳定子。",
  ),
  prerequisites: ["the-orbit-stabilizer-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orbits-of-words",
      title: t("Orbits of words", "单词的轨道"),
      explanation: t(
        "Permuting the letters of a word reaches every rearrangement, so the orbit size is the number of distinct arrangements of its letters. The orbit of $\\text{LEVEL}$ under $S_5$ has $\\frac{5!}{2! \\cdot 2! \\cdot 1!} = 30$ words, since L and E each occur twice.\n\nThe orbit of $\\text{BANANA}$ under $S_6$ has $\\frac{6!}{3! \\cdot 2!} = 60$ words, as $\\text{A}$ occurs three times and $\\text{N}$ twice.\n\nCheck: place the three $\\text{A}$'s in $\\binom{6}{3} = 20$ ways and the two $\\text{N}$'s among the other three places in $3$ ways: $20 \\cdot 3 = 60$.\n\n> **Watch out.** Divide by $m!$ for every repeated letter, not only for one of them.",
        "置换一个词的字母可以得到它的每一种重排，所以轨道的大小就是这些字母不同排列的个数。$\\text{LEVEL}$ 在 $S_5$ 下的轨道有 $\\frac{5!}{2! \\cdot 2! \\cdot 1!} = 30$ 个单词，因为 L 与 E 各出现两次。\n\n$\\text{BANANA}$ 在 $S_6$ 下的轨道有 $\\frac{6!}{3! \\cdot 2!} = 60$ 个单词，因为 $\\text{A}$ 出现三次，$\\text{N}$ 出现两次。\n\n检验：三个 $\\text{A}$ 的位置有 $\\binom{6}{3} = 20$ 种选法，两个 $\\text{N}$ 在其余三个位置中有 $3$ 种选法：$20 \\cdot 3 = 60$。\n\n> **注意。** 每个重复的字母都要除以 $m!$，而不是只除一个。",
      ),
      generate(rng) {
        const w = randomWord(rng);
        const ms = letterCounts(w);
        const stab = ms.reduce((a, m) => a * factorial(m), 1);
        const value = factorial(w.length) / stab;
        return numberProblem({
          prompt: t(
            `$S_{${w.length}}$ acts on words of length ${w.length} by permuting positions. How many words are in the orbit of $\\text{${w}}$?`,
            `$S_{${w.length}}$ 通过置换位置作用于长度为 ${w.length} 的单词。$\\text{${w}}$ 的轨道中有多少个单词？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              factorial(w.length),
              "That counts all permutations of the positions, but permuting equal letters gives the same word.",
              "这数的是全部位置置换，但置换相同的字母得到的是同一个单词。",
            ),
            why(stab, "That is the size of the stabilizer, not of the orbit.", "这是稳定子的大小，而不是轨道的大小。"),
            why(
              ms.length ** w.length,
              "That counts all words of this length over these letters, not only the rearrangements of this one.",
              "这数的是用这些字母组成的所有该长度的单词，而不只是这个单词的重排。",
            ),
            why(
              value * 2,
              `That is twice the number of rearrangements; $${w.length}!$ divided by $${stab}$ is $${value}$.`,
              `这是重排个数的两倍；$${w.length}!$ 除以 $${stab}$ 得 $${value}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the stabilizer", "求稳定子"],
                t(
                  `Equal letters may be permuted among themselves: $${stabilizerTex(ms)} = ${stab}$ elements.`,
                  `相同字母之间可以任意置换：共 $${stabilizerTex(ms)} = ${stab}$ 个元素。`,
                ),
              ],
              [
                ["Divide", "相除"],
                t(
                  `By the orbit-stabilizer theorem the orbit has $\\frac{${w.length}!}{${stab}} = ${value}$ words.`,
                  `由轨道-稳定子定理，轨道有 $\\frac{${w.length}!}{${stab}} = ${value}$ 个单词。`,
                ),
              ],
            ],
            t(
              `$${value} \\cdot ${stab} = ${factorial(w.length)} = ${w.length}!$.`,
              `$${value} \\cdot ${stab} = ${factorial(w.length)} = ${w.length}!$。`,
            ),
          ),
        });
      },
    },
    {
      id: "stabilizers-of-words",
      title: t("Stabilizers of words", "单词的稳定子"),
      explanation: t(
        "A permutation of positions fixes $\\text{ABBA}$ exactly when it sends the positions of A to themselves and those of B to themselves: $2! \\cdot 2! = 4$ permutations.\n\nIn $\\text{SASSAS}$ the letter $\\text{S}$ occurs four times and $\\text{A}$ twice, so the stabilizer has $4! \\cdot 2! = 48$ elements.\n\nCheck: the orbit has $\\frac{720}{48} = 15 = \\binom{6}{2}$ words, one for each choice of the two places of $\\text{A}$.\n\n> **Watch out.** Multiply the factorials $m!$, not the counts $m$: three equal letters can be arranged among their places in $3! = 6$ ways.",
        "一个位置置换固定 $\\text{ABBA}$ 当且仅当它把 A 的位置映到自身、把 B 的位置映到自身：共 $2! \\cdot 2! = 4$ 个置换。\n\n在 $\\text{SASSAS}$ 中，$\\text{S}$ 出现四次，$\\text{A}$ 出现两次，所以稳定子有 $4! \\cdot 2! = 48$ 个元素。\n\n检验：轨道有 $\\frac{720}{48} = 15 = \\binom{6}{2}$ 个单词，每种选取 $\\text{A}$ 的两个位置的方式对应一个。\n\n> **注意。** 要把阶乘 $m!$ 相乘，而不是把次数 $m$ 相乘：三个相同的字母在它们的位置之间有 $3! = 6$ 种排法。",
      ),
      generate(rng) {
        const w = randomWord(rng);
        const ms = letterCounts(w);
        const value = ms.reduce((a, m) => a * factorial(m), 1);
        const letters = [...new Set(w)];
        const repeated = letters.filter((_, i) => ms[i]! > 1);
        const orbit = factorial(w.length) / value;
        return numberProblem({
          prompt: t(
            `$S_{${w.length}}$ acts on words of length ${w.length} by permuting positions. How many elements does the stabilizer of $\\text{${w}}$ have?`,
            `$S_{${w.length}}$ 通过置换位置作用于长度为 ${w.length} 的单词。$\\text{${w}}$ 的稳定子有多少个元素？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              ms.reduce((a, m) => a * m, 1),
              "That multiplies the counts of the letters, not their factorials.",
              "这是把各字母出现的次数相乘，而不是把它们的阶乘相乘。",
            ),
            why(orbit, "That is the size of the orbit, not of the stabilizer.", "这是轨道的大小，而不是稳定子的大小。"),
            why(
              value + 1,
              `The identity is already one of the $${value}$ permutations; do not count it again.`,
              `恒等置换已经是这 $${value}$ 个置换之一；不要再数一遍。`,
            ),
            why(
              ms.reduce((a, m) => a + factorial(m), 0),
              "That adds the factorials, but the choices for different letters combine, so multiply them.",
              "这是把阶乘相加，但不同字母的选择要组合起来，所以应当相乘。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the repeated letters", "找出重复的字母"],
                t(
                  `In $\\text{${w}}$, ${repeated.map((c) => `$\\text{${c}}$ occurs $${ms[letters.indexOf(c)]}$ times`).join(", ")}; the stabilizer may permute the places of each letter among themselves.`,
                  `在 $\\text{${w}}$ 中，${repeated.map((c) => `$\\text{${c}}$ 出现 $${ms[letters.indexOf(c)]}$ 次`).join("，")}；稳定子可以在每个字母的位置之间任意置换。`,
                ),
              ],
              [["Multiply the factorials", "把阶乘相乘"], t(`$${stabilizerTex(ms)} = ${value}$.`, `$${stabilizerTex(ms)} = ${value}$。`)],
            ],
            t(
              `The orbit then has $\\frac{${w.length}!}{${value}} = ${orbit}$ words, and $${orbit} \\cdot ${value} = ${factorial(w.length)}$.`,
              `于是轨道有 $\\frac{${w.length}!}{${value}} = ${orbit}$ 个单词，且 $${orbit} \\cdot ${value} = ${factorial(w.length)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** necklaces is the number of necklaces of n beads in k colors, up to rotation. */
const necklaces = (n: number, k: number) => divisors(n).reduce((s, d) => s + phi(d) * k ** (n / d), 0) / n;

/** bracelets is the number of necklaces of n beads in k colors, up to rotation and reflection. */
const bracelets = (n: number, k: number) =>
  n % 2 === 1 ? (necklaces(n, k) + k ** ((n + 1) / 2)) / 2 : necklaces(n, k) / 2 + (k ** (n / 2) + k ** (n / 2 + 1)) / 4;

/** coloringsOfNecklaces counts necklaces and bracelets with Burnside's lemma. */
export const coloringsOfNecklaces: TopicDef = {
  id: "colorings-of-necklaces",
  title: t("Colorings of Necklaces", "项链的着色"),
  summary: t(
    "A necklace of $n$ beads in $k$ colors is a coloring of the vertices of an $n$-gon up to rotation. The rotation $r^j$ has $\\gcd(j, n)$ cycles, so by Burnside's lemma there are $\\frac{1}{n}\\sum_{d \\mid n} \\varphi(d)\\,k^{n/d}$ necklaces. Allowing reflections as well (a bracelet, which can be turned over) adds the reflections' fixed colorings and divides by $2n$.",
    "$n$ 颗珠子、$k$ 种颜色的项链是正 $n$ 边形顶点在旋转意义下的着色。旋转 $r^j$ 有 $\\gcd(j, n)$ 个轮换，所以由伯恩赛德引理，项链共有 $\\frac{1}{n}\\sum_{d \\mid n} \\varphi(d)\\,k^{n/d}$ 种。若还允许反射（可翻转的手链），则加上各反射固定的着色数并除以 $2n$。",
  ),
  intro: t(
    "With $4$ beads and $2$ colors, the rotations by $0, 1, 2, 3$ beads have $4, 1, 2, 1$ cycles, so there are $\\frac{2^4 + 2 + 2^2 + 2}{4} = \\frac{24}{4} = 6$ necklaces.\n\nCheck: sorted by the black beads, there are the necklaces with none, one, two adjacent, two opposite, three and four: $6$.\n\nIn this lesson we count necklaces up to rotation, and up to rotation and reflection, with Burnside's lemma.",
    "$4$ 颗珠子、$2$ 种颜色时，转过 $0, 1, 2, 3$ 颗珠子的旋转分别有 $4, 1, 2, 1$ 个轮换，所以共有 $\\frac{2^4 + 2 + 2^2 + 2}{4} = \\frac{24}{4} = 6$ 种项链。\n\n检验：按黑色珠子分类，有没有黑珠、一颗、两颗相邻、两颗相对、三颗和四颗：共 $6$ 种。\n\n本课我们用伯恩赛德引理计数旋转意义下的项链，以及旋转与翻转意义下的项链。",
  ),
  prerequisites: ["burnsides-lemma", "cycle-types-of-permutations-of-some-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-necklaces-up-to-rotation",
      figure: algebraDrawings2["colorings-of-necklaces#counting-necklaces-up-to-rotation"],
      title: t("Necklaces up to rotation", "旋转意义下的项链"),
      explanation: t(
        "Burnside's lemma counts the orbits by averaging, over all rotations, the number of colorings that each rotation leaves unchanged. With $6$ beads and $2$ colors: $\\frac{1}{6}(2^6 + 2^3 + 2 \\cdot 2^2 + 2 \\cdot 2^1) = \\frac{64 + 8 + 8 + 4}{6} = 14$ necklaces.\n\nWith $4$ beads and $3$ colors: $\\frac{1}{4}(3^4 + 3^2 + 2 \\cdot 3) = \\frac{81 + 9 + 6}{4} = 24$ necklaces.\n\nCheck: of the $81$ colorings, $3$ use one color, $6$ more repeat after two beads and come in pairs, and the other $72$ come in fours: $3 + 3 + 18 = 24$.\n\n> **Watch out.** Average over all $n$ rotations, the identity included, and give the rotation by $j$ beads $\\gcd(j, n)$ cycles, not $j$.",
        "伯恩赛德引理通过对所有旋转求平均来计数轨道，平均的是每个旋转保持不变的着色数。$6$ 颗珠子、$2$ 种颜色：$\\frac{1}{6}(2^6 + 2^3 + 2 \\cdot 2^2 + 2 \\cdot 2^1) = \\frac{64 + 8 + 8 + 4}{6} = 14$ 种项链。\n\n$4$ 颗珠子、$3$ 种颜色：$\\frac{1}{4}(3^4 + 3^2 + 2 \\cdot 3) = \\frac{81 + 9 + 6}{4} = 24$ 种项链。\n\n检验：$81$ 种着色中，$3$ 种是单色的，另有 $6$ 种每隔两颗重复、两两成对，其余 $72$ 种四个一组：$3 + 3 + 18 = 24$。\n\n> **注意。** 要对全部 $n$ 个旋转（包括单位元）取平均，并且转过 $j$ 颗珠子的旋转有 $\\gcd(j, n)$ 个轮换，而不是 $j$ 个。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const k = rng.int(2, n > 8 ? 3 : 4);
        const value = necklaces(n, k);
        const terms = divisors(n).map((d) => `${phi(d) === 1 ? "" : `${phi(d)} \\cdot `}${pw(k, n / d)}`);
        return numberProblem({
          prompt: t(
            `How many necklaces of $${n}$ beads can be made with $${k}$ colors, counting rotations of a necklace as the same?`,
            `用 $${k}$ 种颜色制作 $${n}$ 颗珠子的项链，旋转后相同的视为同一种，共有多少种？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              Math.floor(k ** n / n),
              `Dividing all $${k ** n}$ colorings by $${n}$ assumes every necklace has $${n}$ different rotations, but symmetric ones have fewer.`,
              `用全部 $${k ** n}$ 种着色除以 $${n}$，相当于假设每条项链都有 $${n}$ 个不同的旋转，但对称的项链旋转更少。`,
            ),
            why(
              k ** n,
              "That counts colorings, not necklaces: rotations of a coloring count as the same.",
              "这数的是着色而不是项链：一个着色的各个旋转视为相同。",
            ),
            why(
              Math.round(bracelets(n, k)),
              "That also treats mirror images as the same; here only rotations do.",
              "这还把镜像视为相同；这里只有旋转才视为相同。",
            ),
            why(
              value + 1,
              `Burnside's average is exactly $${value}$; nothing is added for the one-color necklaces.`,
              `伯恩赛德引理的平均值恰为 $${value}$；不需要为单色项链再加什么。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Count the fixed colorings", "数被固定的着色"],
                t(
                  `For each divisor $d$ of $${n}$, $\\varphi(d)$ rotations have $\\frac{${n}}{d}$ cycles, so the fixed colorings add up to $${terms.join(" + ")} = ${n * value}$.`,
                  `对 $${n}$ 的每个因数 $d$，有 $\\varphi(d)$ 个旋转各有 $\\frac{${n}}{d}$ 个轮换，所以被固定的着色共计 $${terms.join(" + ")} = ${n * value}$。`,
                ),
              ],
              [
                ["Average over the rotations", "对旋转取平均"],
                t(`$\\frac{${n * value}}{${n}} = ${value}$ necklaces.`, `$\\frac{${n * value}}{${n}} = ${value}$ 种项链。`),
              ],
            ],
            t(
              `Each necklace stands for at most $${n}$ colorings, so there are at least $\\frac{${k ** n}}{${n}}$ necklaces, and indeed $${value} \\ge \\frac{${k ** n}}{${n}}$.`,
              `每条项链至多对应 $${n}$ 种着色，所以项链至少有 $\\frac{${k ** n}}{${n}}$ 种，确实 $${value} \\ge \\frac{${k ** n}}{${n}}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "counting-bracelets",
      figure: algebraDrawings2["colorings-of-necklaces#counting-bracelets"],
      title: t("Necklaces that can be turned over", "可翻转的项链"),
      explanation: t(
        "With $5$ beads and $2$ colors: there are $8$ necklaces up to rotation, and each of the $5$ reflections fixes $2^3 = 8$ colorings, so there are $\\frac{40 + 5 \\cdot 8}{10} = 8$ up to rotation and reflection.\n\nWith $4$ beads and $2$ colors: the rotations fix $16 + 2 + 4 + 2 = 24$ colorings; the $2$ reflections through opposite beads fix $2^3 = 8$ each and the $2$ through opposite edges fix $2^2 = 4$ each, so there are $\\frac{24 + 16 + 8}{8} = 6$.\n\nCheck: up to rotation there are $6$ necklaces as well, since each of them is its own mirror image.\n\n> **Watch out.** For even $n$ the reflections come in two kinds: half pass through two beads and fix $k^{n/2 + 1}$ colorings, and half pass between beads and fix $k^{n/2}$.",
        "$5$ 颗珠子、$2$ 种颜色：旋转意义下有 $8$ 种项链，$5$ 个反射各固定 $2^3 = 8$ 种着色，所以在旋转与反射意义下有 $\\frac{40 + 5 \\cdot 8}{10} = 8$ 种。\n\n$4$ 颗珠子、$2$ 种颜色：各旋转共固定 $16 + 2 + 4 + 2 = 24$ 种着色；过相对两颗珠子的 $2$ 个反射各固定 $2^3 = 8$ 种，过相对两条边的 $2$ 个反射各固定 $2^2 = 4$ 种，所以共有 $\\frac{24 + 16 + 8}{8} = 6$ 种。\n\n检验：旋转意义下也恰有 $6$ 种项链，因为每一种都是自己的镜像。\n\n> **注意。** $n$ 为偶数时反射分两类：一半经过两颗珠子，固定 $k^{n/2 + 1}$ 种着色；另一半从珠子之间穿过，固定 $k^{n/2}$ 种。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const k = rng.int(2, n > 9 ? 3 : n > 6 ? 4 : 5);
        const value = bracelets(n, k);
        const neck = necklaces(n, k);
        const rot = neck * n;
        const refl =
          n % 2 === 1 ? `${n} \\cdot ${k}^{${(n + 1) / 2}}` : `${n / 2} \\cdot ${k}^{${n / 2 + 1}} + ${n / 2} \\cdot ${k}^{${n / 2}}`;
        const reflValue = 2 * n * value - rot;
        return numberProblem({
          prompt: t(
            `How many necklaces of $${n}$ beads can be made with $${k}$ colors, counting two as the same if one can be rotated or turned over to give the other?`,
            `用 $${k}$ 种颜色制作 $${n}$ 颗珠子的项链，若一条经旋转或翻转可得到另一条则视为相同，共有多少种？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              neck,
              "That counts up to rotation only; turning over makes more necklaces the same.",
              "这只考虑了旋转；翻转会使更多项链视为相同。",
            ),
            why(
              Math.floor(neck / 2),
              "Halving the necklaces assumes none of them is its own mirror image, but many are.",
              "把项链数减半相当于假设没有项链是自己的镜像，但很多项链是。",
            ),
            why(
              value + 1,
              `Burnside's average is exactly $${value}$; nothing more is added.`,
              `伯恩赛德引理的平均值恰为 $${value}$；不需要再加什么。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Count the rotations' fixed colorings", "数各旋转固定的着色"],
                t(
                  `The $${n}$ rotations fix $${rot}$ colorings in total, $${n}$ times the $${neck}$ necklaces up to rotation.`,
                  `$${n}$ 个旋转共固定 $${rot}$ 种着色，是旋转意义下 $${neck}$ 种项链的 $${n}$ 倍。`,
                ),
              ],
              [
                ["Count the reflections' fixed colorings", "数各反射固定的着色"],
                n % 2 === 1
                  ? t(
                      `Each reflection passes through one bead and has $${(n + 1) / 2}$ cycles: $${refl} = ${reflValue}$.`,
                      `每个反射经过一颗珠子，有 $${(n + 1) / 2}$ 个轮换：$${refl} = ${reflValue}$。`,
                    )
                  : t(
                      `Half the reflections pass through two beads and half between beads: $${refl} = ${reflValue}$.`,
                      `一半反射经过两颗珠子，另一半从珠子之间穿过：$${refl} = ${reflValue}$。`,
                    ),
              ],
              [
                ["Average over the group", "对群取平均"],
                t(`$\\frac{${rot} + ${reflValue}}{${2 * n}} = ${value}$.`, `$\\frac{${rot} + ${reflValue}}{${2 * n}} = ${value}$。`),
              ],
            ],
            t(
              `$${value}$ lies between half of the $${neck}$ necklaces and all of them, as it must: turning over joins at most two necklaces into one.`,
              `$${value}$ 介于 $${neck}$ 种项链的一半与全部之间，理应如此：翻转至多把两条项链合为一种。`,
            ),
          ),
        });
      },
    },
  ],
};

/** abstractAlgebraActionTopics are the topics of Abstract Algebra unit 6. */
export const abstractAlgebraActionTopics: readonly TopicDef[] = [
  naturalActionsOfSymmetricAndDihedralGroups,
  groupActions,
  orbits,
  stabilizers,
  theOrbitStabilizerTheorem,
  burnsidesLemma,
  theClassEquationOfAGroupAction,
  conjugationAndConjugacyClasses,
  conjugacyOfGroupSubsetsAndSubgroups,
  cycleTypesOfPermutations,
  cycleTypesOfPermutationsOfSomeGroups,
  permutationActionsOnSetsOfWords,
  coloringsOfNecklaces,
];
