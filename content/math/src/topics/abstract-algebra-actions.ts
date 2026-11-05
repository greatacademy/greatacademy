import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem } from "../problems.ts";
import { divisors, type Fact, factProblem, gcd, mod, phi, texChoice, units } from "./abstract-algebra-common.ts";
import {
  composePerm,
  cyclePerm,
  cyclesOf,
  invertPerm,
  type Perm,
  permCycleTex,
  productOfCycles,
  randomDisjointCycles,
} from "./abstract-algebra-permutations.ts";
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
  prerequisites: ["group-homomorphisms"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "acting-by-products-of-permutations",
      title: t("Acting by permutations", "置换的作用"),
      explanation: t(
        "In an action the product acts by doing the right factor first and then the left factor, consistent with composition of functions. With $\\sigma = (1\\;3\\;5)$ and $\\tau = (1\\;2)(3\\;4)$: $(\\sigma\\tau) \\cdot 2 = \\sigma(\\tau(2)) = \\sigma(1) = 3$.",
        "在作用中，乘积先作用右边的因子再作用左边的因子，与函数的复合一致。设 $\\sigma = (1\\;3\\;5)$，$\\tau = (1\\;2)(3\\;4)$：$(\\sigma\\tau) \\cdot 2 = \\sigma(\\tau(2)) = \\sigma(1) = 3$。",
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
        return numberProblem({
          prompt: t(
            `In $S_{${n}}$, let $\\sigma = ${permCycleTex(s)}$ and $\\tau = ${permCycleTex(tau)}$. Find $(\\sigma\\tau) \\cdot ${i + 1}$.`,
            `在 $S_{${n}}$ 中，设 $\\sigma = ${permCycleTex(s)}$，$\\tau = ${permCycleTex(tau)}$。求 $(\\sigma\\tau) \\cdot ${i + 1}$。`,
          ),
          answer: value,
          wrong: [tau[s[i]!]! + 1, s[i]! + 1, tau[i]! + 1],
          solution: t(
            `$\\tau(${i + 1}) = ${tau[i]! + 1}$ and $\\sigma(${tau[i]! + 1}) = ${value}$.`,
            `$\\tau(${i + 1}) = ${tau[i]! + 1}$，$\\sigma(${tau[i]! + 1}) = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "dihedral-groups-acting-on-vertices",
      title: t("Dihedral groups on vertices", "二面体群作用于顶点"),
      explanation: t(
        "Rotations shift the vertex labels and reflections reverse them, so a product acts by applying its factors one after another from the right. In $D_8$ with vertices $0, \\dots, 7$: $r^3s \\cdot 5 = r^3 \\cdot (s \\cdot 5) = r^3 \\cdot 3 = 6$, which agrees with $3 - 5 \\equiv 6 \\pmod 8$.",
        "旋转平移顶点标号，反射使标号反向，所以乘积通过从右向左依次作用各个因子来作用。在 $D_8$ 中，顶点为 $0, \\dots, 7$：$r^3s \\cdot 5 = r^3 \\cdot (s \\cdot 5) = r^3 \\cdot 3 = 6$，与 $3 - 5 \\equiv 6 \\pmod 8$ 一致。",
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
          wrong: [mod(k + v, n), mod(v - k, n), mod(-k - v, n)],
          solution: t(
            `$s \\cdot ${v} = ${mod(-v, n)}$, then $${rPow(k)}$ adds $${k}$: $${mod(-v, n)} + ${k} \\equiv ${value} \\pmod{${n}}$.`,
            `$s \\cdot ${v} = ${mod(-v, n)}$，再由 $${rPow(k)}$ 加 $${k}$：$${mod(-v, n)} + ${k} \\equiv ${value} \\pmod{${n}}$。`,
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
  prerequisites: ["natural-actions-of-symmetric-and-dihedral-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "translation-actions-of-cyclic-groups",
      title: t("Translation actions", "平移作用"),
      explanation: t(
        "$k \\cdot x = x + 4k$ defines an action of $\\mathbb{Z}_6$ on $\\mathbb{Z}_{12}$ only if it is well defined: $k$ and $k + 6$ must act the same, so $4 \\cdot 6 = 24 \\equiv 0 \\pmod{12}$ is needed, and it holds.",
        "$k \\cdot x = x + 4k$ 定义 $\\mathbb{Z}_6$ 在 $\\mathbb{Z}_{12}$ 上的作用，前提是良定义：$k$ 与 $k + 6$ 的作用必须相同，所以需要 $4 \\cdot 6 = 24 \\equiv 0 \\pmod{12}$，此式成立。",
      ),
      generate(rng) {
        const m = rng.int(2, 12);
        const n = rng.int(4, 24);
        const step = n / gcd(m, n);
        const c = rng.bool() && step < n ? step * rng.int(1, gcd(m, n) - 1) : rng.int(1, n - 1);
        const holds = mod(m * c, n) === 0;
        return factProblem({
          prompt: t(
            `Does $k \\cdot x = x + ${c}k$ define an action of $${zTex(m)}$ on $${zTex(n)}$?`,
            `$k \\cdot x = x + ${c}k$ 是否定义了 $${zTex(m)}$ 在 $${zTex(n)}$ 上的作用？`,
          ),
          holds,
          reason: holds
            ? t(
                `$${m} \\cdot ${c} \\equiv 0 \\pmod{${n}}$, so the rule is well defined, and $0 \\cdot x = x$, $(j + k) \\cdot x = j \\cdot (k \\cdot x)$.`,
                `$${m} \\cdot ${c} \\equiv 0 \\pmod{${n}}$，所以规则良定义，且 $0 \\cdot x = x$，$(j + k) \\cdot x = j \\cdot (k \\cdot x)$。`,
              )
            : t(
                `$0$ and $${m}$ are the same element of $${zTex(m)}$, but $x + ${c} \\cdot ${m} \\not\\equiv x \\pmod{${n}}$.`,
                `$0$ 与 $${m}$ 是 $${zTex(m)}$ 中的同一元素，但 $x + ${c} \\cdot ${m} \\not\\equiv x \\pmod{${n}}$。`,
              ),
        });
      },
    },
    {
      id: "checking-the-action-axioms",
      title: t("Checking the axioms", "检验公理"),
      explanation: t(
        "A rule is an action when the identity fixes every point and acting by a product equals acting by the factors in turn. $a \\cdot x = a^2x$ is an action of $\\mathbb{R}^*$ on $\\mathbb{R}$: $1 \\cdot x = x$ and $(ab)^2x = a^2(b^2x)$. But $a \\cdot x = 2ax$ is not: $1 \\cdot x = 2x \\ne x$.",
        "如果单位元固定每个点，并且用乘积作用等于依次用各因子作用，这个规则就是一个作用。$a \\cdot x = a^2x$ 是 $\\mathbb{R}^*$ 在 $\\mathbb{R}$ 上的作用：$1 \\cdot x = x$，且 $(ab)^2x = a^2(b^2x)$。但 $a \\cdot x = 2ax$ 不是：$1 \\cdot x = 2x \\ne x$。",
      ),
      generate(rng) {
        const c = rng.int(2, 9);
        const facts: Fact[] = [
          {
            prompt: t(
              `Does $t \\cdot (x, y) = (x + ${c}t, y)$ define an action of $\\mathbb{R}$ on $\\mathbb{R}^2$?`,
              `$t \\cdot (x, y) = (x + ${c}t, y)$ 是否定义了 $\\mathbb{R}$ 在 $\\mathbb{R}^2$ 上的作用？`,
            ),
            holds: true,
            reason: t(
              `$0$ acts trivially and $(s + t) \\cdot (x, y) = (x + ${c}s + ${c}t, y) = s \\cdot (t \\cdot (x, y))$.`,
              `$0$ 的作用平凡，且 $(s + t) \\cdot (x, y) = (x + ${c}s + ${c}t, y) = s \\cdot (t \\cdot (x, y))$。`,
            ),
          },
          {
            prompt: t(
              `Does $t \\cdot (x, y) = (x + t, y + ${c}t^2)$ define an action of $\\mathbb{R}$ on $\\mathbb{R}^2$?`,
              `$t \\cdot (x, y) = (x + t, y + ${c}t^2)$ 是否定义了 $\\mathbb{R}$ 在 $\\mathbb{R}^2$ 上的作用？`,
            ),
            holds: false,
            reason: t(
              `$(s + t) \\cdot$ adds $${c}(s + t)^2$ to $y$, but $s \\cdot (t \\cdot)$ adds $${c}s^2 + ${c}t^2$.`,
              `$(s + t) \\cdot$ 给 $y$ 加上 $${c}(s + t)^2$，而 $s \\cdot (t \\cdot)$ 加上 $${c}s^2 + ${c}t^2$。`,
            ),
          },
          {
            prompt: t(
              `Does $a \\cdot x = a^{${c}}x$ define an action of $\\mathbb{R}^*$ on $\\mathbb{R}$?`,
              `$a \\cdot x = a^{${c}}x$ 是否定义了 $\\mathbb{R}^*$ 在 $\\mathbb{R}$ 上的作用？`,
            ),
            holds: true,
            reason: t(
              `$1^{${c}}x = x$ and $(ab)^{${c}}x = a^{${c}}(b^{${c}}x)$.`,
              `$1^{${c}}x = x$，且 $(ab)^{${c}}x = a^{${c}}(b^{${c}}x)$。`,
            ),
          },
          {
            prompt: t(
              `Does $a \\cdot x = ${c}ax$ define an action of $\\mathbb{R}^*$ on $\\mathbb{R}$?`,
              `$a \\cdot x = ${c}ax$ 是否定义了 $\\mathbb{R}^*$ 在 $\\mathbb{R}$ 上的作用？`,
            ),
            holds: false,
            reason: t(`The identity $1$ gives $1 \\cdot x = ${c}x \\ne x$.`, `单位元 $1$ 给出 $1 \\cdot x = ${c}x \\ne x$。`),
          },
          {
            prompt: t(
              `Does $n \\cdot x = ${c}^n x$ define an action of $\\mathbb{Z}$ on $\\mathbb{R}$?`,
              `$n \\cdot x = ${c}^n x$ 是否定义了 $\\mathbb{Z}$ 在 $\\mathbb{R}$ 上的作用？`,
            ),
            holds: true,
            reason: t(`$${c}^0x = x$ and $${c}^{m + n}x = ${c}^m(${c}^nx)$.`, `$${c}^0x = x$，且 $${c}^{m + n}x = ${c}^m(${c}^nx)$。`),
          },
          {
            prompt: t(
              `Does $n \\cdot x = x + ${c}n^2$ define an action of $\\mathbb{Z}$ on $\\mathbb{R}$?`,
              `$n \\cdot x = x + ${c}n^2$ 是否定义了 $\\mathbb{Z}$ 在 $\\mathbb{R}$ 上的作用？`,
            ),
            holds: false,
            reason: t(
              `$2 \\cdot x = x + ${4 * c}$, but $1 \\cdot (1 \\cdot x) = x + ${2 * c}$.`,
              `$2 \\cdot x = x + ${4 * c}$，而 $1 \\cdot (1 \\cdot x) = x + ${2 * c}$。`,
            ),
          },
          {
            prompt: t(
              `Does $a \\cdot x = x + ${c}(a - 1)$ define an action of $\\mathbb{R}^*$ on $\\mathbb{R}$?`,
              `$a \\cdot x = x + ${c}(a - 1)$ 是否定义了 $\\mathbb{R}^*$ 在 $\\mathbb{R}$ 上的作用？`,
            ),
            holds: false,
            reason: t(
              `$(2 \\cdot 2) \\cdot x = x + ${3 * c}$, but $2 \\cdot (2 \\cdot x) = x + ${2 * c}$.`,
              `$(2 \\cdot 2) \\cdot x = x + ${3 * c}$，而 $2 \\cdot (2 \\cdot x) = x + ${2 * c}$。`,
            ),
          },
          {
            prompt: t(
              `Does $n \\cdot x = x + ${c}n$ define an action of $\\mathbb{Z}$ on $\\mathbb{R}$?`,
              `$n \\cdot x = x + ${c}n$ 是否定义了 $\\mathbb{Z}$ 在 $\\mathbb{R}$ 上的作用？`,
            ),
            holds: true,
            reason: t(
              `$0 \\cdot x = x$ and $(m + n) \\cdot x = x + ${c}m + ${c}n = m \\cdot (n \\cdot x)$.`,
              `$0 \\cdot x = x$，且 $(m + n) \\cdot x = x + ${c}m + ${c}n = m \\cdot (n \\cdot x)$。`,
            ),
          },
        ];
        return factProblem(rng.pick(facts));
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
  prerequisites: ["group-actions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orbits-of-cyclic-groups-of-permutations",
      title: t("Orbits of a permutation", "置换的轨道"),
      explanation: t(
        "The orbits under the group generated by a permutation are the sets of points in each of its cycles, including fixed points on their own. $\\langle (1\\;4\\;2)(3\\;5) \\rangle$ acting on $\\{1, \\dots, 7\\}$ has orbits $\\{1, 2, 4\\}$, $\\{3, 5\\}$, $\\{6\\}$ and $\\{7\\}$: $4$ orbits.",
        "由一个置换生成的群作用下的轨道就是它的各个轮换中的点集，不动点各自单独成一个轨道。$\\langle (1\\;4\\;2)(3\\;5) \\rangle$ 作用于 $\\{1, \\dots, 7\\}$ 时的轨道为 $\\{1, 2, 4\\}$、$\\{3, 5\\}$、$\\{6\\}$、$\\{7\\}$：共 $4$ 个轨道。",
      ),
      generate(rng) {
        const n = rng.int(6, 10);
        const s = randomCyclePerm(rng, n);
        const cs = cyclesOf(s);
        const fixed = n - cs.reduce((a, c) => a + c.length, 0);
        const value = cs.length + fixed;
        return numberProblem({
          prompt: t(
            `How many orbits does $\\langle ${permCycleTex(s)} \\rangle$ have, acting on $\\{1, \\dots, ${n}\\}$?`,
            `$\\langle ${permCycleTex(s)} \\rangle$ 作用于 $\\{1, \\dots, ${n}\\}$ 时有多少个轨道？`,
          ),
          answer: value,
          wrong: [cs.length, fixed, value + 1, n - cs.length],
          solution: t(
            `The orbits are the cycles of the permutation ($${cs.length}$) and its fixed points ($${fixed}$): $${value}$ orbits.`,
            `轨道是 $${cs.length}$ 个轮换与 $${fixed}$ 个不动点：共 $${value}$ 个轨道。`,
          ),
        });
      },
    },
    {
      id: "orbits-of-units-acting-by-multiplication",
      title: t("Orbits of multiplication", "乘法作用的轨道"),
      explanation: t(
        "The orbit of a point collects everything the group can move it to, and the orbits split the whole set into disjoint pieces. $H = \\langle 2 \\rangle = \\{1, 2, 4\\} \\le U(7)$ acts on $\\mathbb{Z}_7$ by multiplication. The orbits are $\\{0\\}$, $\\{1, 2, 4\\}$ and $\\{3, 6, 5\\}$.",
        "一个点的轨道收集了群能把它移动到的所有点，各个轨道把整个集合分成不相交的部分。$H = \\langle 2 \\rangle = \\{1, 2, 4\\} \\le U(7)$ 通过乘法作用于 $\\mathbb{Z}_7$。轨道为 $\\{0\\}$、$\\{1, 2, 4\\}$ 与 $\\{3, 6, 5\\}$。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(7, 30);
          a = rng.pick(units(n));
        } while (a === 1);
        const os = orbitsOfUnits(a, n);
        return numberProblem({
          prompt: t(
            `$H = \\langle ${a} \\rangle \\le U(${n})$ acts on $${zTex(n)}$ by $h \\cdot x = hx$. How many orbits are there?`,
            `$H = \\langle ${a} \\rangle \\le U(${n})$ 通过 $h \\cdot x = hx$ 作用于 $${zTex(n)}$。共有多少个轨道？`,
          ),
          answer: os.length,
          wrong: [os.length - 1, Math.floor(n / os[1]!.length), os.length + 1],
          solution: t(
            `The orbits are $${os.map((o) => `\\{${o.join(", ")}\\}`).join(", ")}$: $${os.length}$ in all.`,
            `轨道为 $${os.map((o) => `\\{${o.join(", ")}\\}`).join(", ")}$：共 $${os.length}$ 个。`,
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
  prerequisites: ["orbits"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "stabilizers-of-vertices-in-dihedral-groups",
      title: t("Stabilizers of vertices", "顶点的稳定子"),
      explanation: t(
        "The stabilizer of a vertex contains the group elements that fix it, which are the identity and the reflection through that vertex. With $r^ks \\cdot v = k - v$, the reflection $r^ks$ fixes $v$ when $k \\equiv 2v \\pmod n$. In $D_8$, vertex $3$ is fixed by $r^6s$, so its stabilizer is $\\{e, r^6s\\}$.",
        "一个顶点的稳定子包含固定它的群元素，也就是恒等元和经过该顶点的反射。由 $r^ks \\cdot v = k - v$，反射 $r^ks$ 固定 $v$ 当且仅当 $k \\equiv 2v \\pmod n$。在 $D_8$ 中，顶点 $3$ 被 $r^6s$ 固定，所以它的稳定子为 $\\{e, r^6s\\}$。",
      ),
      generate(rng) {
        const n = rng.int(5, 14);
        const v = rng.int(1, n - 1);
        const k = mod(2 * v, n);
        return texChoice(
          rng,
          t(
            `$D_{${n}}$ acts on the vertices $0, \\dots, ${n - 1}$ of a regular ${n}-gon with $r \\cdot v = v + 1$ and $s \\cdot v = -v$. Which element is in the stabilizer of vertex $${v}$?`,
            `$D_{${n}}$ 作用于正 ${n} 边形的顶点 $0, \\dots, ${n - 1}$，$r \\cdot v = v + 1$，$s \\cdot v = -v$。哪个元素属于顶点 $${v}$ 的稳定子？`,
          ),
          rsTex(k),
          [rsTex(v), rsTex(mod(-v, n)), rsTex(mod(k + 1, n)), `r^{${v}}`, "s"].filter((x) => x !== rsTex(k)),
          t(
            `$r^ks \\cdot ${v} = k - ${v}$ equals $${v}$ when $k \\equiv ${2 * v === k ? k : `${2 * v} \\equiv ${k}`} \\pmod{${n}}$.`,
            `$r^ks \\cdot ${v} = k - ${v}$ 等于 $${v}$ 当且仅当 $k \\equiv ${2 * v === k ? k : `${2 * v} \\equiv ${k}`} \\pmod{${n}}$。`,
          ),
        );
      },
    },
    {
      id: "stabilizers-in-symmetric-groups",
      title: t("Stabilizers in $S_n$", "$S_n$ 中的稳定子"),
      explanation: t(
        "In $S_6$ acting on subsets of $\\{1, \\dots, 6\\}$, the stabilizer of $\\{1, 2\\}$ permutes $\\{1, 2\\}$ and $\\{3, 4, 5, 6\\}$ separately: $2! \\cdot 4! = 48$ elements. The permutations fixing both $1$ and $2$ number $4! = 24$.",
        "在 $S_6$ 作用于 $\\{1, \\dots, 6\\}$ 的子集时，$\\{1, 2\\}$ 的稳定子分别置换 $\\{1, 2\\}$ 与 $\\{3, 4, 5, 6\\}$：共 $2! \\cdot 4! = 48$ 个元素。同时固定 $1$ 和 $2$ 的置换有 $4! = 24$ 个。",
      ),
      generate(rng) {
        const n = rng.int(4, 8);
        const set = rng.bool();
        const k = rng.int(set ? 1 : 2, Math.min(4, n - 2));
        const pts = rng.sample(range(1, n), k).sort((a, b) => a - b);
        const value = set ? factorial(k) * factorial(n - k) : factorial(n - k);
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
          wrong: set
            ? [factorial(n - k), factorial(n) / factorial(k), choose(n, k)]
            : [factorial(k) * factorial(n - k), factorial(n) / factorial(n - k), n - k],
          solution: set
            ? t(
                `The stabilizer permutes the $${k}$ chosen points among themselves and the other $${n - k}$ among themselves: $${k}! \\cdot ${n - k}! = ${value}$.`,
                `稳定子在选定的 $${k}$ 个点之间置换，在其余 $${n - k}$ 个点之间置换：$${k}! \\cdot ${n - k}! = ${value}$。`,
              )
            : t(
                `The stabilizer fixes each of the $${k}$ points and permutes the other $${n - k}$ freely: $${n - k}! = ${value}$.`,
                `稳定子固定这 $${k}$ 个点中的每一个，并任意置换其余 $${n - k}$ 个点：$${n - k}! = ${value}$。`,
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
  prerequisites: ["stabilizers", "lagranges-theorem", "the-symmetry-group-of-a-cube-rotations-and-reflections"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orbit-stabilizer-for-rotations-of-solids",
      title: t("Rotations of solids", "多面体的旋转"),
      explanation: t(
        "The rotation group of a regular dodecahedron has $60$ elements and can carry any face to any of the $12$ faces, so the stabilizer of a face has $\\frac{60}{12} = 5$ rotations, the rotations about the axis through its center.",
        "正十二面体的旋转群有 $60$ 个元素，可把任一面转到 $12$ 个面中的任何一个，所以一个面的稳定子有 $\\frac{60}{12} = 5$ 个旋转，即绕过该面中心的轴的旋转。",
      ),
      generate(rng) {
        const solid = rng.pick(SOLIDS);
        const i = rng.int(0, 2);
        const [one, many, zh] = PARTS[i]!;
        const count = solid.parts[i]!;
        const stab = solid.order / count;
        const askStab = rng.bool();
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
          wrong: askStab ? [count, solid.order - count, stab + 1, 2 * stab] : [count + stab, 2 * solid.order, solid.order / 2],
          solution: t(
            `By the orbit-stabilizer theorem, $|G| = ${count} \\cdot ${stab} = ${solid.order}$.`,
            `由轨道-稳定子定理，$|G| = ${count} \\cdot ${stab} = ${solid.order}$。`,
          ),
        });
      },
    },
    {
      id: "orbit-sizes-from-stabilizers",
      title: t("Orbit sizes", "轨道的大小"),
      explanation: t(
        "If a group of order $60$ acts on a set and the stabilizer of $x$ has order $4$, the orbit of $x$ has $\\frac{60}{4} = 15$ elements.",
        "若 $60$ 阶群作用于某集合，$x$ 的稳定子阶为 $4$，则 $x$ 的轨道有 $\\frac{60}{4} = 15$ 个元素。",
      ),
      generate(rng) {
        let g: number;
        do g = rng.int(12, 200);
        while (divisors(g).length < 6);
        const s = rng.pick(divisors(g).filter((d) => d > 1 && d < g));
        const o = g / s;
        const askOrbit = rng.bool();
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
          answer: askOrbit ? o : s,
          wrong: askOrbit ? [g - s, s, g * s] : [g - o, o, g * o],
          solution: t(
            `$|G \\cdot x| \\cdot |G_x| = |G|$, and $${o} \\cdot ${s} = ${g}$.`,
            `$|G \\cdot x| \\cdot |G_x| = |G|$，且 $${o} \\cdot ${s} = ${g}$。`,
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
  prerequisites: ["the-orbit-stabilizer-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-orbits-from-fixed-points",
      title: t("Averaging fixed points", "平均不动点"),
      explanation: t(
        "A group of order $4$ acts on $16$ colorings: the identity fixes all $16$, one element fixes $4$, and the other two fix $2$ each. There are $\\frac{16 + 4 + 2 + 2}{4} = 6$ orbits.",
        "$4$ 阶群作用于 $16$ 种着色：单位元固定全部 $16$ 种，一个元素固定 $4$ 种，另外两个各固定 $2$ 种。轨道数为 $\\frac{16 + 4 + 2 + 2}{4} = 6$。",
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
        const value = (size + a * fa + b * fb) / g;
        return numberProblem({
          prompt: t(
            `A group $G$ of order $${g}$ acts on a set of $${size}$ elements. Besides the identity, $${a}$ elements of $G$ fix $${fa}$ points each and the other $${b}$ fix $${fb}$ points each. How many orbits are there?`,
            `$${g}$ 阶群 $G$ 作用于一个 $${size}$ 元集合。除单位元外，$G$ 中有 $${a}$ 个元素各固定 $${fa}$ 个点，其余 $${b}$ 个各固定 $${fb}$ 个点。共有多少个轨道？`,
          ),
          answer: value,
          wrong: [Math.floor(size / g), Math.floor((size + fa + fb) / g), value + 1, size + a * fa + b * fb],
          solution: t(
            `By Burnside's lemma: $\\frac{${size} + ${a} \\cdot ${fa} + ${b} \\cdot ${fb}}{${g}} = \\frac{${size + a * fa + b * fb}}{${g}} = ${value}$.`,
            `由伯恩赛德引理：$\\frac{${size} + ${a} \\cdot ${fa} + ${b} \\cdot ${fb}}{${g}} = \\frac{${size + a * fa + b * fb}}{${g}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "counting-colorings-up-to-symmetry",
      title: t("Counting colorings", "计数着色"),
      explanation: t(
        "Color the vertices of a square with $k$ colors up to rotation. The identity fixes $k^4$ colorings, the half-turn $k^2$, and each quarter-turn $k$, so there are $\\frac{k^4 + k^2 + 2k}{4}$; for $k = 2$, that is $6$.",
        "用 $k$ 种颜色给正方形顶点着色，旋转视为相同。单位元固定 $k^4$ 种着色，半圈旋转固定 $k^2$ 种，每个四分之一圈旋转固定 $k$ 种，所以共有 $\\frac{k^4 + k^2 + 2k}{4}$ 种；$k = 2$ 时为 $6$。",
      ),
      generate(rng) {
        const fig = rng.pick(COLORING_FIGURES);
        const k = rng.int(2, 7);
        const order = fig.terms.reduce((s, [c]) => s + c, 0);
        const total = fig.terms.reduce((s, [c, e]) => s + c * k ** e, 0);
        const value = total / order;
        const top = fig.terms[0]![1];
        const sum = fig.terms.map(([c, e]) => (c === 1 ? `${k}^{${e}}` : `${c} \\cdot ${k}^{${e}}`)).join(" + ");
        return numberProblem({
          prompt: t(
            `How many ways are there to color ${fig.en}, with $${k}$ colors available?`,
            `用 $${k}$ 种颜色给${fig.zh}着色，共有多少种方法？`,
          ),
          answer: value,
          wrong: [k ** top, Math.floor(k ** top / order), value + k, choose(k + top - 1, top)],
          solution: t(
            `The symmetry group has $${order}$ elements, and an element with $c$ cycles fixes $${k}^c$ colorings: $\\frac{${sum}}{${order}} = ${value}$.`,
            `对称群有 $${order}$ 个元素，有 $c$ 个轮换的元素固定 $${k}^c$ 种着色：$\\frac{${sum}}{${order}} = ${value}$。`,
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
  prerequisites: ["the-orbit-stabilizer-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "fixed-points-of-p-group-actions",
      title: t("Fixed points of p-groups", "p-群作用的不动点"),
      explanation: t(
        "A group of order $27$ acting on $41$ points has orbits of sizes $1, 3, 9, 27$, so the number of fixed points is $\\equiv 41 \\equiv 2 \\pmod 3$. There are at least $2$ fixed points.",
        "$27$ 阶群作用于 $41$ 个点时，轨道大小只能是 $1, 3, 9, 27$，所以不动点个数 $\\equiv 41 \\equiv 2 \\pmod 3$。至少有 $2$ 个不动点。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const k = rng.int(2, p === 2 ? 6 : 3);
        let n: number;
        do n = rng.int(p + 1, 80);
        while (n % p === 0);
        const value = n % p;
        return numberProblem({
          prompt: t(
            `A group of order $${p}^{${k}}$ acts on a set of $${n}$ elements. What is the least possible number of fixed points?`,
            `$${p}^{${k}}$ 阶群作用于一个 $${n}$ 元集合。不动点个数最少可能是多少？`,
          ),
          answer: value,
          wrong: [0, p - value, Math.floor(n / p), value + p],
          solution: t(
            `Every orbit that is not a fixed point has size divisible by $${p}$, so the number of fixed points is $\\equiv ${n} \\equiv ${value} \\pmod{${p}}$; orbits of size $${p}$ achieve $${value}$.`,
            `不是不动点的轨道大小都被 $${p}$ 整除，所以不动点个数 $\\equiv ${n} \\equiv ${value} \\pmod{${p}}$；取若干大小为 $${p}$ 的轨道即可达到 $${value}$。`,
          ),
        });
      },
    },
    {
      id: "actions-without-fixed-points",
      title: t("Actions without fixed points", "无不动点的作用"),
      explanation: t(
        "Can a group of order $16$ act on $10$ points without fixed points? The orbits would have sizes $2, 4, 8, 16$ summing to $10$, e.g. $2 + 8$: yes. On $11$ points it cannot, since $11$ is odd.",
        "$16$ 阶群能否无不动点地作用于 $10$ 个点？轨道大小只能取 $2, 4, 8, 16$，和为 $10$，例如 $2 + 8$：可以。作用于 $11$ 个点则不行，因为 $11$ 是奇数。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const k = rng.int(1, p === 2 ? 5 : 3);
        const n = rng.int(p + 1, 60);
        const holds = n % p === 0;
        return factProblem({
          prompt: t(
            `Can a group of order $${p}^{${k}}$ act on a set of $${n}$ elements with no fixed points?`,
            `$${p}^{${k}}$ 阶群能否无不动点地作用于一个 $${n}$ 元集合？`,
          ),
          holds,
          reason: holds
            ? t(
                `$${n}$ is a multiple of $${p}$, so $${n / p}$ orbits of size $${p}$ (for instance through a homomorphism onto $${zTex(p)}$) work.`,
                `$${n}$ 是 $${p}$ 的倍数，所以取 $${n / p}$ 个大小为 $${p}$ 的轨道即可（例如通过到 $${zTex(p)}$ 的满同态）。`,
              )
            : t(
                `The number of fixed points is $\\equiv ${n} \\equiv ${n % p} \\pmod{${p}}$, so it cannot be $0$.`,
                `不动点个数 $\\equiv ${n} \\equiv ${n % p} \\pmod{${p}}$，所以不可能为 $0$。`,
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
  prerequisites: ["the-class-equation-of-a-group-action", "the-centralizer-of-a-subgroup"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sizes-of-conjugacy-classes-in-dihedral-groups",
      title: t("Class sizes in $D_n$", "$D_n$ 中共轭类的大小"),
      explanation: t(
        "The size of a conjugacy class is the group order divided by the order of the centralizer of any element in it. In $D_6$ of order $12$, $C(rs)$ has $4$ elements, so the class of $rs$ has $\\frac{12}{4} = 3$: $\\{rs, r^3s, r^5s\\}$. The class of $r^2$ is $\\{r^2, r^4\\}$.",
        "共轭类的大小等于群的阶除以类中任一元素的中心化子的阶。在 $12$ 阶的 $D_6$ 中，$C(rs)$ 有 $4$ 个元素，所以 $rs$ 的共轭类有 $\\frac{12}{4} = 3$ 个元素：$\\{rs, r^3s, r^5s\\}$。$r^2$ 的共轭类为 $\\{r^2, r^4\\}$。",
      ),
      generate(rng) {
        const n = rng.int(3, 20);
        const reflection = rng.bool();
        const k = n % 2 === 0 && rng.bool(0.25) ? n / 2 : rng.int(1, n - 1);
        const h = reflection ? rsTex(k) : `${rPow(k)}`;
        const value = reflection ? (n % 2 === 0 ? n / 2 : n) : mod(2 * k, n) === 0 ? 1 : 2;
        return numberProblem({
          prompt: t(
            `In the dihedral group $D_{${n}}$ of order $${2 * n}$, how many elements does the conjugacy class of $${h}$ have?`,
            `在 $${2 * n}$ 阶二面体群 $D_{${n}}$ 中，$${h}$ 的共轭类有多少个元素？`,
          ),
          answer: value,
          wrong: [1, 2, n, n / 2, 2 * n].filter((x) => x !== value && Number.isInteger(x)),
          solution: reflection
            ? n % 2 === 0
              ? t(
                  `$${n}$ is even, so the reflections $r^js$ split into two classes by the parity of $j$, each with $${n / 2}$ elements.`,
                  `$${n}$ 为偶数，所以反射 $r^js$ 按 $j$ 的奇偶分成两个类，各有 $${n / 2}$ 个元素。`,
                )
              : t(`$${n}$ is odd, so all $${n}$ reflections are conjugate.`, `$${n}$ 为奇数，所以全部 $${n}$ 个反射互相共轭。`)
            : value === 1
              ? t(
                  `$${rPow(k)}$ is central, so its class is $\\{${rPow(k)}\\}$.`,
                  `$${rPow(k)}$ 在中心中，所以它的共轭类为 $\\{${rPow(k)}\\}$。`,
                )
              : t(
                  `The class is $\\{${rPow(k)}, ${rPow(n - k)}\\}$, since $s${rPow(k)}s^{-1} = r^{-${k}}$.`,
                  `共轭类为 $\\{${rPow(k)}, ${rPow(n - k)}\\}$，因为 $s${rPow(k)}s^{-1} = r^{-${k}}$。`,
                ),
        });
      },
    },
    {
      id: "counting-conjugacy-classes-of-dihedral-groups",
      title: t("Number of classes of $D_n$", "$D_n$ 的共轭类个数"),
      explanation: t(
        "Rotations pair up with their inverses, and the reflections form one class or two depending on whether the number of sides is odd or even. $D_5$: $\\{e\\}$, $\\{r, r^4\\}$, $\\{r^2, r^3\\}$ and the $5$ reflections: $4$ classes. $D_6$: $\\{e\\}$, $\\{r^3\\}$, $\\{r, r^5\\}$, $\\{r^2, r^4\\}$ and two classes of reflections: $6$ classes.",
        "旋转与它们的逆配成一对，而反射组成一类还是两类，取决于边数是奇数还是偶数。$D_5$：$\\{e\\}$、$\\{r, r^4\\}$、$\\{r^2, r^3\\}$ 以及 $5$ 个反射：共 $4$ 个类。$D_6$：$\\{e\\}$、$\\{r^3\\}$、$\\{r, r^5\\}$、$\\{r^2, r^4\\}$ 以及两类反射：共 $6$ 个类。",
      ),
      generate(rng) {
        const n = rng.int(3, 40);
        const value = n % 2 === 1 ? (n + 3) / 2 : (n + 6) / 2;
        return numberProblem({
          prompt: t(
            `How many conjugacy classes does the dihedral group $D_{${n}}$ of order $${2 * n}$ have?`,
            `$${2 * n}$ 阶二面体群 $D_{${n}}$ 有多少个共轭类？`,
          ),
          answer: value,
          wrong: [n + 1, Math.floor(n / 2) + 1, value + 1, value - 1, 2 * n],
          solution:
            n % 2 === 1
              ? t(
                  `$\\{e\\}$, $${(n - 1) / 2}$ pairs $\\{r^k, r^{-k}\\}$, and one class of reflections: $${value}$.`,
                  `$\\{e\\}$、$${(n - 1) / 2}$ 对 $\\{r^k, r^{-k}\\}$，以及一类反射：共 $${value}$ 个。`,
                )
              : t(
                  `$\\{e\\}$, $\\{r^{${n / 2}}\\}$, $${(n - 2) / 2}$ pairs $\\{r^k, r^{-k}\\}$, and two classes of reflections: $${value}$.`,
                  `$\\{e\\}$、$\\{r^{${n / 2}}\\}$、$${(n - 2) / 2}$ 对 $\\{r^k, r^{-k}\\}$，以及两类反射：共 $${value}$ 个。`,
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
  prerequisites: ["conjugation-and-conjugacy-classes"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-conjugate-subgroups",
      title: t("Counting conjugate subgroups", "数共轭子群"),
      explanation: t(
        "The number of subgroups conjugate to a given one is the group order divided by the order of its normalizer. In $S_5$, $N(\\langle (1\\;2) \\rangle)$ has $2! \\cdot 3! = 12$ elements, so $\\langle (1\\;2) \\rangle$ has $\\frac{120}{12} = 10$ conjugates, one for each transposition.",
        "与给定子群共轭的子群个数等于群的阶除以它的正规化子的阶。在 $S_5$ 中，$N(\\langle (1\\;2) \\rangle)$ 有 $2! \\cdot 3! = 12$ 个元素，所以 $\\langle (1\\;2) \\rangle$ 有 $\\frac{120}{12} = 10$ 个共轭子群，每个对换对应一个。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 2) {
          const n = rng.int(3, 30);
          const k = rng.int(0, n - 1);
          const value = n % 2 === 0 ? n / 2 : n;
          return numberProblem({
            prompt: t(
              `In the dihedral group $D_{${n}}$ of order $${2 * n}$, how many conjugates does $\\langle ${rsTex(k)} \\rangle$ have?`,
              `在 $${2 * n}$ 阶二面体群 $D_{${n}}$ 中，$\\langle ${rsTex(k)} \\rangle$ 有多少个共轭子群？`,
            ),
            answer: value,
            wrong: [n % 2 === 0 ? n : n / 2, 2, 2 * n, 1].filter((x) => Number.isInteger(x) && x !== value),
            solution: t(
              `Its normalizer has $${n % 2 === 0 ? 4 : 2}$ elements, so there are $\\frac{${2 * n}}{${n % 2 === 0 ? 4 : 2}} = ${value}$ conjugates.`,
              `它的正规化子有 $${n % 2 === 0 ? 4 : 2}$ 个元素，所以共有 $\\frac{${2 * n}}{${n % 2 === 0 ? 4 : 2}} = ${value}$ 个共轭子群。`,
            ),
          });
        }
        const n = rng.int(4, 9);
        const k = kind + 2;
        const value = choose(n, k);
        const c = range(1, k);
        return numberProblem({
          prompt: t(
            `How many conjugates does $\\langle (${c.join("\\;")}) \\rangle$ have in $S_{${n}}$?`,
            `$\\langle (${c.join("\\;")}) \\rangle$ 在 $S_{${n}}$ 中有多少个共轭子群？`,
          ),
          answer: value,
          wrong: [value * (k - 1), factorial(n) / k, factorial(n - k), n],
          solution: t(
            `Its normalizer, the permutations mapping $\\{${c.join(", ")}\\}$ to itself, has $${k}! \\cdot ${n - k}!$ elements, so there are $\\frac{${n}!}{${k}! \\cdot ${n - k}!} = ${value}$ conjugates.`,
            `它的正规化子由把 $\\{${c.join(", ")}\\}$ 映到自身的置换组成，有 $${k}! \\cdot ${n - k}!$ 个元素，所以共有 $\\frac{${n}!}{${k}! \\cdot ${n - k}!} = ${value}$ 个共轭子群。`,
          ),
        });
      },
    },
    {
      id: "conjugating-cyclic-subgroups",
      title: t("Conjugating a cyclic subgroup", "共轭一个循环子群"),
      explanation: t(
        "Conjugating a cyclic subgroup element by element gives the cyclic subgroup generated by the conjugate of its generator. $\\sigma\\langle \\tau \\rangle\\sigma^{-1} = \\langle \\sigma\\tau\\sigma^{-1} \\rangle$. With $\\sigma = (1\\;4)$ and $\\tau = (1\\;2\\;3)$: $\\sigma\\langle \\tau \\rangle\\sigma^{-1} = \\langle (4\\;2\\;3) \\rangle$.",
        "共轭一个循环子群，得到的是由其生成元的共轭所生成的循环子群。$\\sigma\\langle \\tau \\rangle\\sigma^{-1} = \\langle \\sigma\\tau\\sigma^{-1} \\rangle$。设 $\\sigma = (1\\;4)$，$\\tau = (1\\;2\\;3)$：$\\sigma\\langle \\tau \\rangle\\sigma^{-1} = \\langle (4\\;2\\;3) \\rangle$。",
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
        return texChoice(
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
          t(
            `$\\sigma H \\sigma^{-1} = \\langle \\sigma\\tau\\sigma^{-1} \\rangle$, and relabeling the cycle of $\\tau$ by $\\sigma$ gives $${permCycleTex(c)}$.`,
            `$\\sigma H \\sigma^{-1} = \\langle \\sigma\\tau\\sigma^{-1} \\rangle$，用 $\\sigma$ 重新标记 $\\tau$ 的轮换得 $${permCycleTex(c)}$。`,
          ),
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

/** cycleTypesOfPermutations counts permutations of a cycle type and decides conjugacy. */
export const cycleTypesOfPermutations: TopicDef = {
  id: "cycle-types-of-permutations",
  title: t("Cycle Types of Permutations", "置换的轮换型"),
  summary: t(
    "The cycle type of $\\sigma \\in S_n$ lists the lengths of its disjoint cycles, fixed points included; it is a partition of $n$. Two permutations are conjugate in $S_n$ exactly when they have the same cycle type, so the conjugacy classes of $S_n$ correspond to partitions of $n$. If the type has $m_k$ cycles of length $k$, the class has $\\frac{n!}{\\prod_k k^{m_k} m_k!}$ elements.",
    "$\\sigma \\in S_n$ 的轮换型列出它的各不相交轮换的长度（包括不动点）；它是 $n$ 的一个分拆。两个置换在 $S_n$ 中共轭当且仅当轮换型相同，所以 $S_n$ 的共轭类与 $n$ 的分拆一一对应。若轮换型中长度为 $k$ 的轮换有 $m_k$ 个，则该类有 $\\frac{n!}{\\prod_k k^{m_k} m_k!}$ 个元素。",
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
        "Arrange all the points, then divide by the rotations within each cycle and by the reorderings of cycles of equal length. The permutations of $S_6$ of type $(2, 2, 1, 1)$ number $\\frac{6!}{2^2 \\cdot 2! \\cdot 1^2 \\cdot 2!} = 45$.",
        "先排列所有的点，再除以每个轮换内部的旋转数以及等长轮换之间的重排数。$S_6$ 中轮换型为 $(2, 2, 1, 1)$ 的置换有 $\\frac{6!}{2^2 \\cdot 2! \\cdot 1^2 \\cdot 2!} = 45$ 个。",
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
        return numberProblem({
          prompt: t(
            `How many permutations in $S_{${n}}$ have cycle type $(${type.join(", ")})$?`,
            `$S_{${n}}$ 中轮换型为 $(${type.join(", ")})$ 的置换有多少个？`,
          ),
          answer: value,
          wrong: [naive, value * 2, Math.floor(value / 2), factorial(n) / factorial(type.length)].filter((x) => Number.isInteger(x)),
          solution: t(
            `Divide $${n}!$ by $k^{m_k} m_k!$ for each cycle length $k$ occurring $m_k$ times: $${value}$.`,
            `用 $${n}!$ 除以每个出现 $m_k$ 次的轮换长度 $k$ 对应的 $k^{m_k} m_k!$：$${value}$。`,
          ),
        });
      },
    },
    {
      id: "deciding-conjugacy-in-symmetric-groups",
      title: t("Conjugate or not", "是否共轭"),
      explanation: t(
        "Two permutations are conjugate in a symmetric group exactly when they have the same cycle type, since conjugation only relabels points. $(1\\;2\\;3)(4\\;5)$ and $(1\\;5)(2\\;4\\;6)$ are conjugate in $S_6$: both have type $(3, 2, 1)$. $(1\\;2)(3\\;4)$ and $(1\\;2\\;3)$ are not.",
        "两个置换在对称群中共轭，当且仅当它们有相同的轮换型，因为共轭只是给点重新命名。$(1\\;2\\;3)(4\\;5)$ 与 $(1\\;5)(2\\;4\\;6)$ 在 $S_6$ 中共轭：二者轮换型都是 $(3, 2, 1)$。$(1\\;2)(3\\;4)$ 与 $(1\\;2\\;3)$ 不共轭。",
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
        return factProblem({
          prompt: t(
            `Are $${permCycleTex(a)}$ and $${permCycleTex(b)}$ conjugate in $S_{${n}}$?`,
            `$${permCycleTex(a)}$ 与 $${permCycleTex(b)}$ 在 $S_{${n}}$ 中共轭吗？`,
          ),
          holds,
          reason: t(
            `Their cycle types are $(${ta.join(", ")})$ and $(${tb.join(", ")})$.`,
            `它们的轮换型分别为 $(${ta.join(", ")})$ 与 $(${tb.join(", ")})$。`,
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
  prerequisites: ["cycle-types-of-permutations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "cycles-of-rotations-of-polygons",
      title: t("Rotations of polygons", "多边形的旋转"),
      explanation: t(
        "In $D_{12}$, $r^8$ moves each vertex $8$ steps around, so it has order $3$ and splits the $12$ vertices into $\\gcd(8, 12) = 4$ cycles of length $3$.",
        "在 $D_{12}$ 中，$r^8$ 把每个顶点沿多边形移动 $8$ 步，所以阶为 $3$，把 $12$ 个顶点分成 $\\gcd(8, 12) = 4$ 个长度为 $3$ 的轮换。",
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
          wrong: askCount ? [n / g, k, n - k] : [g, k, n / k > 1 ? Math.floor(n / k) : n],
          solution: t(
            `$\\gcd(${k}, ${n}) = ${g}$, so there are $${g}$ cycles of length $\\frac{${n}}{${g}} = ${n / g}$.`,
            `$\\gcd(${k}, ${n}) = ${g}$，所以有 $${g}$ 个长度为 $\\frac{${n}}{${g}} = ${n / g}$ 的轮换。`,
          ),
        });
      },
    },
    {
      id: "cycles-of-reflections-of-polygons",
      title: t("Reflections of polygons", "多边形的反射"),
      explanation: t(
        "With $r^ks \\cdot v = k - v$ on the vertices $0, \\dots, 7$ of an octagon, $r^3s$ fixes no vertex ($2v \\equiv 3$ has no solution), so it is a product of $4$ transpositions; $r^2s$ fixes $1$ and $5$ and is a product of $3$ transpositions.",
        "在八边形顶点 $0, \\dots, 7$ 上 $r^ks \\cdot v = k - v$，$r^3s$ 不固定任何顶点（$2v \\equiv 3$ 无解），所以是 $4$ 个对换之积；$r^2s$ 固定 $1$ 与 $5$，是 $3$ 个对换之积。",
      ),
      generate(rng) {
        const n = rng.int(5, 20);
        const k = rng.int(0, n - 1);
        const fixed = range(0, n - 1).filter((v) => mod(k - v, n) === v);
        const value = (n - fixed.length) / 2;
        return numberProblem({
          prompt: t(
            `$D_{${n}}$ acts on the vertices $0, \\dots, ${n - 1}$ of a regular ${n}-gon with $r \\cdot v = v + 1$ and $s \\cdot v = -v$. How many transpositions are in the cycle decomposition of $${rsTex(k)}$?`,
            `$D_{${n}}$ 作用于正 ${n} 边形的顶点 $0, \\dots, ${n - 1}$，$r \\cdot v = v + 1$，$s \\cdot v = -v$。$${rsTex(k)}$ 的轮换分解中有多少个对换？`,
          ),
          answer: value,
          wrong: [Math.floor(n / 2), Math.floor((n - 1) / 2), Math.floor((n - 2) / 2), n].filter((x) => x !== value),
          solution: t(
            `$${rsTex(k)}$ fixes $${fixed.length}$ vertices${fixed.length > 0 ? ` ($${fixed.join(", ")}$)` : ""} and swaps the other $${n - fixed.length}$ in pairs: $${value}$ transpositions.`,
            `$${rsTex(k)}$ 固定 $${fixed.length}$ 个顶点${fixed.length > 0 ? `（$${fixed.join(", ")}$）` : ""}，其余 $${n - fixed.length}$ 个两两对换：共 $${value}$ 个对换。`,
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

/** permutationActionsOnSetsOfWords finds orbits and stabilizers of Sₙ permuting the letters of words. */
export const permutationActionsOnSetsOfWords: TopicDef = {
  id: "permutation-actions-on-sets-of-words",
  title: t("Permutation Actions on Sets of Words", "置换在单词集合上的作用"),
  summary: t(
    "Sₙ acts on the words of length n by permuting positions. The orbit of a word consists of its rearrangements, and its stabilizer permutes equal letters among themselves. If the letters occur m₁, …, mₖ times, the stabilizer has m₁! ⋯ mₖ! elements, so by the orbit-stabilizer theorem there are n!/(m₁! ⋯ mₖ!) rearrangements.",
    "Sₙ 通过置换位置作用于长度为 n 的单词。单词的轨道由它的所有重排组成，稳定子只在相同字母之间置换。若各字母分别出现 m₁, …, mₖ 次，则稳定子有 m₁! ⋯ mₖ! 个元素，由轨道-稳定子定理，重排共有 n!/(m₁! ⋯ mₖ!) 种。",
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
        "Permuting the letters of a word reaches every rearrangement, so the orbit size is the number of distinct arrangements of its letters. The orbit of $\\text{LEVEL}$ under $S_5$ has $\\frac{5!}{2! \\cdot 2! \\cdot 1!} = 30$ words, since L and E each occur twice.",
        "置换一个词的字母可以得到它的每一种重排，所以轨道的大小就是这些字母不同排列的个数。$\\text{LEVEL}$ 在 $S_5$ 下的轨道有 $\\frac{5!}{2! \\cdot 2! \\cdot 1!} = 30$ 个单词，因为 L 与 E 各出现两次。",
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
          wrong: [factorial(w.length), stab, ms.length ** w.length, value * 2],
          solution: t(
            `The stabilizer has $${ms.map((m) => `${m}!`).join(" \\cdot ")} = ${stab}$ elements, so the orbit has $\\frac{${w.length}!}{${stab}} = ${value}$ words.`,
            `稳定子有 $${ms.map((m) => `${m}!`).join(" \\cdot ")} = ${stab}$ 个元素，所以轨道有 $\\frac{${w.length}!}{${stab}} = ${value}$ 个单词。`,
          ),
        });
      },
    },
    {
      id: "stabilizers-of-words",
      title: t("Stabilizers of words", "单词的稳定子"),
      explanation: t(
        "A permutation of positions fixes $\\text{ABBA}$ exactly when it sends the positions of A to themselves and those of B to themselves: $2! \\cdot 2! = 4$ permutations.",
        "一个位置置换固定 $\\text{ABBA}$ 当且仅当它把 A 的位置映到自身、把 B 的位置映到自身：共 $2! \\cdot 2! = 4$ 个置换。",
      ),
      generate(rng) {
        const w = randomWord(rng);
        const ms = letterCounts(w);
        const value = ms.reduce((a, m) => a * factorial(m), 1);
        return numberProblem({
          prompt: t(
            `$S_{${w.length}}$ acts on words of length ${w.length} by permuting positions. How many elements does the stabilizer of $\\text{${w}}$ have?`,
            `$S_{${w.length}}$ 通过置换位置作用于长度为 ${w.length} 的单词。$\\text{${w}}$ 的稳定子有多少个元素？`,
          ),
          answer: value,
          wrong: [ms.reduce((a, m) => a * m, 1), factorial(w.length) / value, value + 1, ms.reduce((a, m) => a + factorial(m), 0)].filter(
            (x) => x !== value,
          ),
          solution: t(
            `Equal letters may be permuted among themselves: $${ms.map((m) => `${m}!`).join(" \\cdot ")} = ${value}$.`,
            `相同字母之间可任意置换：$${ms.map((m) => `${m}!`).join(" \\cdot ")} = ${value}$。`,
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
  prerequisites: ["burnsides-lemma", "cycle-types-of-permutations-of-some-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-necklaces-up-to-rotation",
      title: t("Necklaces up to rotation", "旋转意义下的项链"),
      explanation: t(
        "Burnside's lemma counts the orbits by averaging, over all rotations, the number of colorings that each rotation leaves unchanged. With $6$ beads and $2$ colors: $\\frac{1}{6}(2^6 + 2^3 + 2 \\cdot 2^2 + 2 \\cdot 2^1) = \\frac{64 + 8 + 8 + 4}{6} = 14$ necklaces.",
        "伯恩赛德引理通过对所有旋转求平均来计数轨道，平均的是每个旋转保持不变的着色数。$6$ 颗珠子、$2$ 种颜色：$\\frac{1}{6}(2^6 + 2^3 + 2 \\cdot 2^2 + 2 \\cdot 2^1) = \\frac{64 + 8 + 8 + 4}{6} = 14$ 种项链。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const k = rng.int(2, n > 8 ? 3 : 4);
        const value = necklaces(n, k);
        const terms = divisors(n).map((d) => `${phi(d) === 1 ? "" : `${phi(d)} \\cdot `}${k}^{${n / d}}`);
        return numberProblem({
          prompt: t(
            `How many necklaces of $${n}$ beads can be made with $${k}$ colors, counting rotations of a necklace as the same?`,
            `用 $${k}$ 种颜色制作 $${n}$ 颗珠子的项链，旋转后相同的视为同一种，共有多少种？`,
          ),
          answer: value,
          wrong: [Math.floor(k ** n / n), k ** n, Math.round(bracelets(n, k)), value + 1].filter((x) => x !== value),
          solution: t(`$\\frac{1}{${n}}(${terms.join(" + ")}) = ${value}$.`, `$\\frac{1}{${n}}(${terms.join(" + ")}) = ${value}$。`),
        });
      },
    },
    {
      id: "counting-bracelets",
      title: t("Necklaces that can be turned over", "可翻转的项链"),
      explanation: t(
        "With $5$ beads and $2$ colors: there are $8$ necklaces up to rotation, and each of the $5$ reflections fixes $2^3 = 8$ colorings, so there are $\\frac{40 + 5 \\cdot 8}{10} = 8$ up to rotation and reflection.",
        "$5$ 颗珠子、$2$ 种颜色：旋转意义下有 $8$ 种项链，$5$ 个反射各固定 $2^3 = 8$ 种着色，所以在旋转与反射意义下有 $\\frac{40 + 5 \\cdot 8}{10} = 8$ 种。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const k = rng.int(2, n > 9 ? 3 : n > 6 ? 4 : 5);
        const value = bracelets(n, k);
        const rot = necklaces(n, k) * n;
        const refl =
          n % 2 === 1 ? `${n} \\cdot ${k}^{${(n + 1) / 2}}` : `${n / 2} \\cdot ${k}^{${n / 2 + 1}} + ${n / 2} \\cdot ${k}^{${n / 2}}`;
        return numberProblem({
          prompt: t(
            `How many necklaces of $${n}$ beads can be made with $${k}$ colors, counting two as the same if one can be rotated or turned over to give the other?`,
            `用 $${k}$ 种颜色制作 $${n}$ 颗珠子的项链，若一条经旋转或翻转可得到另一条则视为相同，共有多少种？`,
          ),
          answer: value,
          wrong: [necklaces(n, k), Math.floor(necklaces(n, k) / 2), value + 1].filter((x) => x !== value),
          solution: t(
            `The rotations fix $${rot}$ colorings in total and the reflections fix $${refl}$, so there are $\\frac{${rot} + ${refl}}{${2 * n}} = ${value}$.`,
            `各旋转共固定 $${rot}$ 种着色，各反射共固定 $${refl}$ 种，所以共有 $\\frac{${rot} + ${refl}}{${2 * n}} = ${value}$ 种。`,
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
