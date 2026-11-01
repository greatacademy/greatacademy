import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem } from "../problems.ts";
import { divisors, factProblem, gcd, lcm, mod, multiplicativeOrder, phi, texChoice, units } from "./abstract-algebra-common.ts";
import { range } from "./methods-of-proof-common.ts";

// Abstract Algebra unit 5: homomorphisms, kernels, images and the isomorphism theorems.

/** zTex writes ℤₙ. */
const zTex = (n: number) => `\\mathbb{Z}_{${n}}`;

/** additiveOrder is the order of a in ℤₙ. */
const additiveOrder = (a: number, n: number) => n / gcd(a, n);

/** cyclicHom is a homomorphism ℤₘ → ℤₙ, 1 ↦ k, with a nontrivial image. */
function cyclicHom(rng: Rng): { m: number; n: number; k: number } {
  let m: number;
  let n: number;
  do {
    m = rng.int(4, 40);
    n = rng.int(4, 40);
  } while (gcd(m, n) < 3);
  const step = n / gcd(m, n);
  return { m, n, k: step * rng.int(1, gcd(m, n) - 1) };
}

/** powerImage lists the distinct values of xᵉ for x in U(n). */
const powerImage = (n: number, e: number) => [...new Set(units(n).map((x) => mod(x ** e, n)))];

/** groupHomomorphisms decides which maps between cyclic groups are homomorphisms and counts them. */
export const groupHomomorphisms: TopicDef = {
  id: "group-homomorphisms",
  title: t("Group Homomorphisms", "群同态"),
  summary: t(
    "A homomorphism φ: G → H satisfies φ(ab) = φ(a)φ(b). It sends the identity to the identity and inverses to inverses, and the order of φ(a) divides the order of a. A homomorphism from a cyclic group ⟨g⟩ is determined by φ(g); a map ℤₘ → ℤₙ with 1 ↦ k is well defined exactly when mk ≡ 0 (mod n), so there are gcd(m, n) homomorphisms ℤₘ → ℤₙ.",
    "同态 φ: G → H 满足 φ(ab) = φ(a)φ(b)。它把单位元映为单位元、逆元映为逆元，且 φ(a) 的阶整除 a 的阶。从循环群 ⟨g⟩ 出发的同态由 φ(g) 决定；映射 ℤₘ → ℤₙ，1 ↦ k 良定义当且仅当 mk ≡ 0 (mod n)，所以 ℤₘ → ℤₙ 的同态共有 gcd(m, n) 个。",
  ),
  prerequisites: ["normal-subgroups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "well-defined-homomorphisms-between-cyclic-groups",
      title: t("Homomorphisms between cyclic groups", "循环群之间的同态"),
      explanation: t(
        "A homomorphism $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{8}$ with $\\varphi(1) = k$ has $\\varphi(x) = kx$, and since $12 = 0$ in $\\mathbb{Z}_{12}$ we need $12k \\equiv 0 \\pmod 8$. So $k = 2$ works but $k = 1$ does not.",
        "同态 $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{8}$ 若 $\\varphi(1) = k$，则 $\\varphi(x) = kx$；由于在 $\\mathbb{Z}_{12}$ 中 $12 = 0$，需要 $12k \\equiv 0 \\pmod 8$。所以 $k = 2$ 可以，$k = 1$ 不行。",
      ),
      generate(rng) {
        const m = rng.int(2, 30);
        const n = rng.int(3, 30);
        const step = n / gcd(m, n);
        const k = rng.bool() && step < n ? step * rng.int(1, gcd(m, n) - 1) : rng.int(1, n - 1);
        const holds = mod(m * k, n) === 0;
        return factProblem({
          prompt: t(
            `Is there a homomorphism $\\varphi: ${zTex(m)} \\to ${zTex(n)}$ with $\\varphi(1) = ${k}$?`,
            `是否存在同态 $\\varphi: ${zTex(m)} \\to ${zTex(n)}$ 使 $\\varphi(1) = ${k}$？`,
          ),
          holds,
          reason: t(
            `We need $${m} \\cdot ${k} = ${m * k} \\equiv 0 \\pmod{${n}}$, which ${holds ? "holds" : "fails"}.`,
            `需要 $${m} \\cdot ${k} = ${m * k} \\equiv 0 \\pmod{${n}}$，此条件${holds ? "成立" : "不成立"}。`,
          ),
        });
      },
    },
    {
      id: "counting-homomorphisms-between-cyclic-groups",
      title: t("Counting homomorphisms", "数同态"),
      explanation: t(
        "The homomorphisms $\\mathbb{Z}_{m} \\to \\mathbb{Z}_{n}$ correspond to the $k$ with $mk \\equiv 0 \\pmod n$, the multiples of $\\frac{n}{\\gcd(m, n)}$. There are $\\gcd(m, n)$ of them: $\\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$ has $6$.",
        "同态 $\\mathbb{Z}_{m} \\to \\mathbb{Z}_{n}$ 对应于满足 $mk \\equiv 0 \\pmod n$ 的 $k$，即 $\\frac{n}{\\gcd(m, n)}$ 的倍数，共 $\\gcd(m, n)$ 个：$\\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$ 有 $6$ 个。",
      ),
      generate(rng) {
        const m = rng.int(2, 60);
        const n = rng.int(2, 60);
        const g = gcd(m, n);
        return numberProblem({
          prompt: t(`How many homomorphisms $${zTex(m)} \\to ${zTex(n)}$ are there?`, `$${zTex(m)} \\to ${zTex(n)}$ 的同态有多少个？`),
          answer: g,
          wrong: [lcm(m, n), Math.min(m, n), n / g, g + 1],
          solution: t(
            `$\\varphi(1) = k$ must satisfy $${m}k \\equiv 0 \\pmod{${n}}$, so $k$ is a multiple of $${n / g}$: there are $\\gcd(${m}, ${n}) = ${g}$ choices.`,
            `$\\varphi(1) = k$ 须满足 $${m}k \\equiv 0 \\pmod{${n}}$，所以 $k$ 是 $${n / g}$ 的倍数：共 $\\gcd(${m}, ${n}) = ${g}$ 种选择。`,
          ),
        });
      },
    },
  ],
};

/** theImageOfAGroupHomomorphism finds the sizes of images. */
export const theImageOfAGroupHomomorphism: TopicDef = {
  id: "the-image-of-a-group-homomorphism",
  title: t("The Image of a Group Homomorphism", "群同态的像"),
  summary: t(
    "The image φ(G) = {φ(g) : g ∈ G} of a homomorphism φ: G → H is a subgroup of H. If G = ⟨g⟩ is cyclic, then φ(G) = ⟨φ(g)⟩, so its size is the order of φ(g). φ is onto exactly when φ(G) = H.",
    "同态 φ: G → H 的像 φ(G) = {φ(g) : g ∈ G} 是 H 的子群。若 G = ⟨g⟩ 是循环群，则 φ(G) = ⟨φ(g)⟩，其大小等于 φ(g) 的阶。φ 是满射当且仅当 φ(G) = H。",
  ),
  prerequisites: ["group-homomorphisms"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "images-of-homomorphisms-between-cyclic-groups",
      title: t("Images from cyclic groups", "循环群的同态像"),
      explanation: t(
        "For $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$ with $\\varphi(1) = 6$, the image is $\\langle 6 \\rangle = \\{0, 6, 12\\}$, of size $\\frac{18}{\\gcd(6, 18)} = 3$.",
        "对 $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$，$\\varphi(1) = 6$，像为 $\\langle 6 \\rangle = \\{0, 6, 12\\}$，大小为 $\\frac{18}{\\gcd(6, 18)} = 3$。",
      ),
      generate(rng) {
        const { m, n, k } = cyclicHom(rng);
        const value = additiveOrder(k, n);
        return numberProblem({
          prompt: t(
            `Let $\\varphi: ${zTex(m)} \\to ${zTex(n)}$ be the homomorphism with $\\varphi(1) = ${k}$. How many elements does its image have?`,
            `设 $\\varphi: ${zTex(m)} \\to ${zTex(n)}$ 是满足 $\\varphi(1) = ${k}$ 的同态。它的像有多少个元素？`,
          ),
          answer: value,
          wrong: [m / value, gcd(k, n), gcd(m, n), n],
          solution: t(
            `The image is $\\langle ${k} \\rangle$ in $${zTex(n)}$, of size $\\frac{${n}}{\\gcd(${k}, ${n})} = ${value}$.`,
            `像为 $${zTex(n)}$ 中的 $\\langle ${k} \\rangle$，大小为 $\\frac{${n}}{\\gcd(${k}, ${n})} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "images-of-power-maps",
      title: t("Images of power maps", "幂映射的像"),
      explanation: t(
        "In an abelian group, $x \\mapsto x^e$ is a homomorphism. On $U(15) = \\{1, 2, 4, 7, 8, 11, 13, 14\\}$, squaring gives $\\{1, 4\\}$, so the image has $2$ elements.",
        "在阿贝尔群中，$x \\mapsto x^e$ 是同态。在 $U(15) = \\{1, 2, 4, 7, 8, 11, 13, 14\\}$ 上平方得 $\\{1, 4\\}$，所以像有 $2$ 个元素。",
      ),
      generate(rng) {
        const n = rng.int(7, 45);
        const e = rng.pick([2, 2, 3]);
        const image = powerImage(n, e).sort((a, b) => a - b);
        const value = image.length;
        return numberProblem({
          prompt: t(
            `How many elements does the image of $\\varphi: U(${n}) \\to U(${n})$, $\\varphi(x) = x^{${e}}$ have?`,
            `$\\varphi: U(${n}) \\to U(${n})$，$\\varphi(x) = x^{${e}}$ 的像有多少个元素？`,
          ),
          answer: value,
          wrong: [Math.floor(phi(n) / e), phi(n), phi(n) / value === value ? value + 1 : phi(n) / value, value + 1],
          solution: t(
            `The ${e === 2 ? "squares" : "cubes"} in $U(${n})$ are $${image.join(", ")}$: $${value}$ elements.`,
            `$U(${n})$ 中的${e === 2 ? "平方" : "立方"}为 $${image.join(", ")}$：共 $${value}$ 个元素。`,
          ),
        });
      },
    },
  ],
};

/** theKernelOfAGroupHomomorphism finds the sizes of kernels. */
export const theKernelOfAGroupHomomorphism: TopicDef = {
  id: "the-kernel-of-a-group-homomorphism",
  title: t("The Kernel of a Group Homomorphism", "群同态的核"),
  summary: t(
    "The kernel ker φ = {g ∈ G : φ(g) = e} of a homomorphism is a normal subgroup of G. φ is one-to-one exactly when ker φ = {e}. Each element of the image has exactly |ker φ| preimages, a coset of the kernel, so |G| = |ker φ| · |φ(G)| for finite G.",
    "同态的核 ker φ = {g ∈ G : φ(g) = e} 是 G 的正规子群。φ 是单射当且仅当 ker φ = {e}。像中每个元素恰有 |ker φ| 个原像，构成核的一个陪集，所以对有限群 G 有 |G| = |ker φ| · |φ(G)|。",
  ),
  prerequisites: ["the-image-of-a-group-homomorphism"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "kernels-of-homomorphisms-between-cyclic-groups",
      title: t("Kernels from cyclic groups", "循环群同态的核"),
      explanation: t(
        "For $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$ with $\\varphi(1) = 6$, the image has $3$ elements, so the kernel has $\\frac{12}{3} = 4$: it is $\\{0, 3, 6, 9\\}$.",
        "对 $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$，$\\varphi(1) = 6$，像有 $3$ 个元素，所以核有 $\\frac{12}{3} = 4$ 个：即 $\\{0, 3, 6, 9\\}$。",
      ),
      generate(rng) {
        const { m, n, k } = cyclicHom(rng);
        const im = additiveOrder(k, n);
        const value = m / im;
        return numberProblem({
          prompt: t(
            `Let $\\varphi: ${zTex(m)} \\to ${zTex(n)}$ be the homomorphism with $\\varphi(1) = ${k}$. How many elements does its kernel have?`,
            `设 $\\varphi: ${zTex(m)} \\to ${zTex(n)}$ 是满足 $\\varphi(1) = ${k}$ 的同态。它的核有多少个元素？`,
          ),
          answer: value,
          wrong: [im, n / im, gcd(k, n), gcd(m, k), m, value + 1],
          solution: t(
            `The image $\\langle ${k} \\rangle$ has $${im}$ elements, so $|\\ker \\varphi| = \\frac{${m}}{${im}} = ${value}$.`,
            `像 $\\langle ${k} \\rangle$ 有 $${im}$ 个元素，所以 $|\\ker \\varphi| = \\frac{${m}}{${im}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "kernels-of-power-maps",
      title: t("Kernels of power maps", "幂映射的核"),
      explanation: t(
        "The kernel of $x \\mapsto x^2$ on $U(n)$ is the set of solutions of $x^2 \\equiv 1 \\pmod n$. On $U(15)$ these are $1, 4, 11, 14$.",
        "$U(n)$ 上 $x \\mapsto x^2$ 的核是 $x^2 \\equiv 1 \\pmod n$ 的解集。在 $U(15)$ 上为 $1, 4, 11, 14$。",
      ),
      generate(rng) {
        const n = rng.int(7, 45);
        const e = rng.pick([2, 2, 3]);
        const kernel = units(n).filter((x) => mod(x ** e, n) === 1);
        const value = kernel.length;
        return numberProblem({
          prompt: t(
            `How many elements does the kernel of $\\varphi: U(${n}) \\to U(${n})$, $\\varphi(x) = x^{${e}}$ have?`,
            `$\\varphi: U(${n}) \\to U(${n})$，$\\varphi(x) = x^{${e}}$ 的核有多少个元素？`,
          ),
          answer: value,
          wrong: [e, phi(n) / value === value ? value + 1 : phi(n) / value, 1, value + 2].filter((x) => x !== value),
          solution: t(
            `The solutions of $x^{${e}} \\equiv 1 \\pmod{${n}}$ in $U(${n})$ are $${kernel.join(", ")}$: $${value}$ elements.`,
            `$U(${n})$ 中 $x^{${e}} \\equiv 1 \\pmod{${n}}$ 的解为 $${kernel.join(", ")}$：共 $${value}$ 个元素。`,
          ),
        });
      },
    },
  ],
};

/** crt is the x in [0, mn) with x ≡ a (mod m) and x ≡ b (mod n), for coprime m and n. */
const crt = (a: number, b: number, m: number, n: number) => range(0, m * n - 1).find((x) => x % m === a && x % n === b)!;

/** groupIsomorphisms recognizes cyclic groups of units and evaluates the Chinese remainder isomorphism. */
export const groupIsomorphisms: TopicDef = {
  id: "group-isomorphisms",
  title: t("Group Isomorphisms", "群同构"),
  summary: t(
    "An isomorphism is a bijective homomorphism; isomorphic groups G ≅ H have the same structure, so they agree in order, in the orders of their elements, in being abelian or cyclic. Every cyclic group of order n is isomorphic to ℤₙ; U(n) is cyclic exactly when n is 2, 4, pᵏ or 2pᵏ for an odd prime p. For coprime m and n, x ↦ (x mod m, x mod n) is an isomorphism ℤₘₙ → ℤₘ × ℤₙ.",
    "同构是双射的同态；同构的群 G ≅ H 结构相同，因此阶、元素的阶、是否阿贝尔、是否循环都一致。每个 n 阶循环群都同构于 ℤₙ；U(n) 是循环群当且仅当 n 为 2、4、pᵏ 或 2pᵏ（p 为奇素数）。当 m、n 互素时，x ↦ (x mod m, x mod n) 是同构 ℤₘₙ → ℤₘ × ℤₙ。",
  ),
  prerequisites: ["group-homomorphisms", "cyclic-direct-product-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-cyclic-groups-of-units",
      title: t("Is U(n) cyclic?", "U(n) 是循环群吗？"),
      explanation: t(
        "$U(n) \\cong \\mathbb{Z}_{\\varphi(n)}$ exactly when some unit has order $\\varphi(n)$. In $U(10)$, $3$ has order $4 = \\varphi(10)$, so $U(10) \\cong \\mathbb{Z}_4$. In $U(8)$ every element has order at most $2$, so $U(8) \\not\\cong \\mathbb{Z}_4$.",
        "$U(n) \\cong \\mathbb{Z}_{\\varphi(n)}$ 当且仅当某个单位的阶为 $\\varphi(n)$。在 $U(10)$ 中 $3$ 的阶为 $4 = \\varphi(10)$，所以 $U(10) \\cong \\mathbb{Z}_4$。在 $U(8)$ 中每个元素的阶至多为 $2$，所以 $U(8) \\not\\cong \\mathbb{Z}_4$。",
      ),
      generate(rng) {
        const n = rng.int(5, 60);
        const p = phi(n);
        const orders = units(n).map((x) => multiplicativeOrder(x, n));
        const top = Math.max(...orders);
        const holds = top === p;
        const g = units(n).find((x) => multiplicativeOrder(x, n) === p);
        return factProblem({
          prompt: t(`Is $U(${n}) \\cong ${zTex(p)}$?`, `$U(${n}) \\cong ${zTex(p)}$ 吗？`),
          holds,
          reason: holds
            ? t(
                `$${g}$ has order $${p} = |U(${n})|$, so $U(${n})$ is cyclic.`,
                `$${g}$ 的阶为 $${p} = |U(${n})|$，所以 $U(${n})$ 是循环群。`,
              )
            : t(
                `Every element of $U(${n})$ has order at most $${top} < ${p}$, so $U(${n})$ is not cyclic.`,
                `$U(${n})$ 中每个元素的阶至多为 $${top} < ${p}$，所以 $U(${n})$ 不是循环群。`,
              ),
        });
      },
    },
    {
      id: "the-chinese-remainder-isomorphism",
      title: t("The Chinese remainder isomorphism", "中国剩余同构"),
      explanation: t(
        "$\\varphi: \\mathbb{Z}_3 \\times \\mathbb{Z}_5 \\to \\mathbb{Z}_{15}$ with $\\varphi(1, 1) = 1$ is an isomorphism. $\\varphi(2, 4)$ is the $x$ with $x \\equiv 2 \\pmod 3$ and $x \\equiv 4 \\pmod 5$: $x = 14$.",
        "$\\varphi: \\mathbb{Z}_3 \\times \\mathbb{Z}_5 \\to \\mathbb{Z}_{15}$，$\\varphi(1, 1) = 1$ 是同构。$\\varphi(2, 4)$ 是满足 $x \\equiv 2 \\pmod 3$、$x \\equiv 4 \\pmod 5$ 的 $x$：$x = 14$。",
      ),
      generate(rng) {
        let m: number;
        let n: number;
        do {
          m = rng.int(2, 9);
          n = rng.int(3, 11);
        } while (gcd(m, n) !== 1);
        const a = rng.int(0, m - 1);
        let b: number;
        do b = rng.int(0, n - 1);
        while (b === a);
        const x = crt(a, b, m, n);
        return numberProblem({
          prompt: t(
            `$\\varphi: ${zTex(m)} \\times ${zTex(n)} \\to ${zTex(m * n)}$ is the isomorphism with $\\varphi(1, 1) = 1$. Find $\\varphi(${a}, ${b})$.`,
            `$\\varphi: ${zTex(m)} \\times ${zTex(n)} \\to ${zTex(m * n)}$ 是满足 $\\varphi(1, 1) = 1$ 的同构。求 $\\varphi(${a}, ${b})$。`,
          ),
          answer: x,
          wrong: [mod(a * b, m * n), a + b, mod(a * n + b * m, m * n), mod(a * m + b * n, m * n)].filter((w) => w !== x),
          solution: t(
            `$\\varphi(${a}, ${b})$ is the $x$ with $x \\equiv ${a} \\pmod{${m}}$ and $x \\equiv ${b} \\pmod{${n}}$, which is $${x}$.`,
            `$\\varphi(${a}, ${b})$ 是满足 $x \\equiv ${a} \\pmod{${m}}$ 与 $x \\equiv ${b} \\pmod{${n}}$ 的 $x$，即 $${x}$。`,
          ),
        });
      },
    },
  ],
};

/** CIRCLE is the circle group of complex numbers of absolute value 1. */
const CIRCLE = "\\{z \\in \\mathbb{C} : |z| = 1\\}";

/** POSITIVE_REALS is the group of positive real numbers under multiplication. */
const POSITIVE_REALS = "\\mathbb{R}_{>0}";

/** theFirstIsomorphismTheorem identifies quotients as images. */
export const theFirstIsomorphismTheorem: TopicDef = {
  id: "the-first-isomorphism-theorem",
  title: t("The First Isomorphism Theorem", "第一同构定理"),
  summary: t(
    "If φ: G → H is a homomorphism, then G/ker φ ≅ φ(G), by gker φ ↦ φ(g). To identify a quotient G/N, find a homomorphism from G that is onto a known group and has kernel N; for example, det: GL(2, ℝ) → ℝ* shows GL(2, ℝ)/SL(2, ℝ) ≅ ℝ*.",
    "若 φ: G → H 是同态，则 G/ker φ ≅ φ(G)，对应为 gker φ ↦ φ(g)。要识别商群 G/N，可找一个从 G 到已知群的满同态，使其核为 N；例如 det: GL(2, ℝ) → ℝ* 说明 GL(2, ℝ)/SL(2, ℝ) ≅ ℝ*。",
  ),
  prerequisites: ["the-kernel-of-a-group-homomorphism", "group-isomorphisms", "quotient-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orders-of-quotients-by-kernels",
      title: t("Quotients by kernels", "对核的商群"),
      explanation: t(
        "For $\\varphi: \\mathbb{Z}_4 \\times \\mathbb{Z}_{12} \\to \\mathbb{Z}_{12}$, $\\varphi(a, b) = 3b$, the image is $\\langle 3 \\rangle$ with $4$ elements, so $(\\mathbb{Z}_4 \\times \\mathbb{Z}_{12})/\\ker \\varphi \\cong \\mathbb{Z}_4$ has $4$ elements.",
        "对 $\\varphi: \\mathbb{Z}_4 \\times \\mathbb{Z}_{12} \\to \\mathbb{Z}_{12}$，$\\varphi(a, b) = 3b$，像为 $\\langle 3 \\rangle$，有 $4$ 个元素，所以 $(\\mathbb{Z}_4 \\times \\mathbb{Z}_{12})/\\ker \\varphi \\cong \\mathbb{Z}_4$ 有 $4$ 个元素。",
      ),
      generate(rng) {
        const m = rng.int(2, 9);
        let n: number;
        let k: number;
        do {
          n = rng.int(6, 30);
          k = rng.int(2, n - 1);
        } while (gcd(k, n) === 1);
        const value = additiveOrder(k, n);
        return numberProblem({
          prompt: t(
            `Let $\\varphi: ${zTex(m)} \\times ${zTex(n)} \\to ${zTex(n)}$, $\\varphi(a, b) = ${k}b$. How many elements does $(${zTex(m)} \\times ${zTex(n)})/\\ker \\varphi$ have?`,
            `设 $\\varphi: ${zTex(m)} \\times ${zTex(n)} \\to ${zTex(n)}$，$\\varphi(a, b) = ${k}b$。$(${zTex(m)} \\times ${zTex(n)})/\\ker \\varphi$ 有多少个元素？`,
          ),
          answer: value,
          wrong: [m * value, m * gcd(k, n), gcd(k, n), n],
          solution: t(
            `By the first isomorphism theorem the quotient is isomorphic to the image $\\langle ${k} \\rangle$ in $${zTex(n)}$, which has $\\frac{${n}}{\\gcd(${k}, ${n})} = ${value}$ elements.`,
            `由第一同构定理，商群同构于像 $\\langle ${k} \\rangle \\le ${zTex(n)}$，它有 $\\frac{${n}}{\\gcd(${k}, ${n})} = ${value}$ 个元素。`,
          ),
        });
      },
    },
    {
      id: "identifying-quotient-groups",
      title: t("Identifying quotient groups", "识别商群"),
      explanation: t(
        "$\\mathbb{R}/\\mathbb{Z} \\cong \\{z \\in \\mathbb{C} : |z| = 1\\}$: the map $x \\mapsto e^{2\\pi i x}$ is a homomorphism from $\\mathbb{R}$ onto the circle with kernel $\\mathbb{Z}$.",
        "$\\mathbb{R}/\\mathbb{Z} \\cong \\{z \\in \\mathbb{C} : |z| = 1\\}$：映射 $x \\mapsto e^{2\\pi i x}$ 是从 $\\mathbb{R}$ 到单位圆的满同态，核为 $\\mathbb{Z}$。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const m = rng.int(2, 12);
        const N = rng.pick([12, 18, 20, 24, 30, 36]);
        const d = rng.pick(divisors(N).filter((x) => x > 1 && x < N));
        const cases: [string, string, string, string][] = [
          [`S_{${n}}/A_{${n}}`, zTex(2), "the sign map $S_n \\to \\{\\pm 1\\}$", "符号映射 $S_n \\to \\{\\pm 1\\}$"],
          [
            `D_{${n}}/\\langle r \\rangle`,
            zTex(2),
            "the map sending rotations to $0$ and reflections to $1$",
            "把旋转映为 $0$、反射映为 $1$ 的映射",
          ],
          [
            "GL(2, \\mathbb{R})/SL(2, \\mathbb{R})",
            "\\mathbb{R}^*",
            "$\\det: GL(2, \\mathbb{R}) \\to \\mathbb{R}^*$",
            "$\\det: GL(2, \\mathbb{R}) \\to \\mathbb{R}^*$",
          ],
          ["\\mathbb{R}^*/\\{\\pm 1\\}", POSITIVE_REALS, "$x \\mapsto |x|$", "$x \\mapsto |x|$"],
          [`\\mathbb{C}^*/${CIRCLE}`, POSITIVE_REALS, "$z \\mapsto |z|$", "$z \\mapsto |z|$"],
          [`\\mathbb{C}^*/${POSITIVE_REALS}`, CIRCLE, "$z \\mapsto \\frac{z}{|z|}$", "$z \\mapsto \\frac{z}{|z|}$"],
          ["\\mathbb{R}/\\mathbb{Z}", CIRCLE, "$x \\mapsto e^{2\\pi i x}$", "$x \\mapsto e^{2\\pi i x}$"],
          [
            `\\mathbb{R}^*/${POSITIVE_REALS}`,
            zTex(2),
            "the map sending positive numbers to $0$ and negative numbers to $1$",
            "把正数映为 $0$、负数映为 $1$ 的映射",
          ],
          [
            `(${zTex(m)} \\times ${zTex(n)})/(${zTex(m)} \\times \\{0\\})`,
            zTex(n),
            "the projection $(a, b) \\mapsto b$",
            "投影 $(a, b) \\mapsto b$",
          ],
          [`${zTex(N)}/\\langle ${d} \\rangle`, zTex(d), `reduction modulo $${d}$`, `模 $${d}$ 约化`],
        ];
        const [q, right, en, zh] = rng.pick(cases);
        const pool = [zTex(2), "\\mathbb{R}^*", POSITIVE_REALS, CIRCLE, zTex(n), zTex(m), "\\mathbb{R}", "\\mathbb{Z}"].filter(
          (x) => x !== right,
        );
        return texChoice(
          rng,
          t(`Which group is $${q}$ isomorphic to?`, `$${q}$ 同构于哪个群？`),
          right,
          rng.shuffle(pool),
          t(
            `${en.charAt(0).toUpperCase()}${en.slice(1)} is a homomorphism onto $${right}$ whose kernel is the subgroup, so by the first isomorphism theorem $${q} \\cong ${right}$.`,
            `${zh}是到 $${right}$ 的满同态，其核恰为该子群，由第一同构定理 $${q} \\cong ${right}$。`,
          ),
        );
      },
    },
  ],
};

/** theSecondIsomorphismTheorem applies HK/K ≅ H/(H ∩ K) in ℤ and ℤₙ. */
export const theSecondIsomorphismTheorem: TopicDef = {
  id: "the-second-isomorphism-theorem",
  title: t("The Second Isomorphism Theorem", "第二同构定理"),
  summary: t(
    "If H ≤ G and K ⊴ G, then HK is a subgroup, H ∩ K ⊴ H, and HK/K ≅ H/(H ∩ K). In particular |HK| = |H||K|/|H ∩ K| for finite subgroups. In ℤ, aℤ + bℤ = gcd(a, b)ℤ and aℤ ∩ bℤ = lcm(a, b)ℤ.",
    "若 H ≤ G 且 K ⊴ G，则 HK 是子群，H ∩ K ⊴ H，且 HK/K ≅ H/(H ∩ K)。特别地，对有限子群有 |HK| = |H||K|/|H ∩ K|。在 ℤ 中，aℤ + bℤ = gcd(a, b)ℤ，aℤ ∩ bℤ = lcm(a, b)ℤ。",
  ),
  prerequisites: ["the-first-isomorphism-theorem", "internal-direct-products"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-second-isomorphism-theorem-in-the-integers",
      title: t("In the integers", "在整数中"),
      explanation: t(
        "$(6\\mathbb{Z} + 4\\mathbb{Z})/4\\mathbb{Z} = 2\\mathbb{Z}/4\\mathbb{Z}$ has $2$ elements, and $6\\mathbb{Z}/(6\\mathbb{Z} \\cap 4\\mathbb{Z}) = 6\\mathbb{Z}/12\\mathbb{Z}$ also has $2$.",
        "$(6\\mathbb{Z} + 4\\mathbb{Z})/4\\mathbb{Z} = 2\\mathbb{Z}/4\\mathbb{Z}$ 有 $2$ 个元素，$6\\mathbb{Z}/(6\\mathbb{Z} \\cap 4\\mathbb{Z}) = 6\\mathbb{Z}/12\\mathbb{Z}$ 也有 $2$ 个。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(2, 40);
          b = rng.int(2, 40);
        } while (a % b === 0 || b % a === 0 || gcd(a, b) === 1);
        const g = gcd(a, b);
        const value = b / g;
        const ask = rng.bool();
        return numberProblem({
          prompt: ask
            ? t(
                `How many elements does $(${a}\\mathbb{Z} + ${b}\\mathbb{Z})/${b}\\mathbb{Z}$ have?`,
                `$(${a}\\mathbb{Z} + ${b}\\mathbb{Z})/${b}\\mathbb{Z}$ 有多少个元素？`,
              )
            : t(
                `How many elements does $${a}\\mathbb{Z}/(${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z})$ have?`,
                `$${a}\\mathbb{Z}/(${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z})$ 有多少个元素？`,
              ),
          answer: value,
          wrong: [a / g, g, b, lcm(a, b) / b],
          solution: ask
            ? t(
                `$${a}\\mathbb{Z} + ${b}\\mathbb{Z} = ${g}\\mathbb{Z}$, and $${g}\\mathbb{Z}/${b}\\mathbb{Z}$ has $\\frac{${b}}{${g}} = ${value}$ elements.`,
                `$${a}\\mathbb{Z} + ${b}\\mathbb{Z} = ${g}\\mathbb{Z}$，而 $${g}\\mathbb{Z}/${b}\\mathbb{Z}$ 有 $\\frac{${b}}{${g}} = ${value}$ 个元素。`,
              )
            : t(
                `$${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z} = ${lcm(a, b)}\\mathbb{Z}$, and $${a}\\mathbb{Z}/${lcm(a, b)}\\mathbb{Z}$ has $\\frac{${lcm(a, b)}}{${a}} = ${value}$ elements.`,
                `$${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z} = ${lcm(a, b)}\\mathbb{Z}$，而 $${a}\\mathbb{Z}/${lcm(a, b)}\\mathbb{Z}$ 有 $\\frac{${lcm(a, b)}}{${a}} = ${value}$ 个元素。`,
              ),
        });
      },
    },
    {
      id: "sizes-of-sums-of-subgroups",
      title: t("Sizes of H + K", "H + K 的大小"),
      explanation: t(
        "In $\\mathbb{Z}_{24}$, $H = \\langle 4 \\rangle$ has $6$ elements, $K = \\langle 6 \\rangle$ has $4$, and $H \\cap K$ has $2$, so $|H + K| = \\frac{6 \\cdot 4}{2} = 12$.",
        "在 $\\mathbb{Z}_{24}$ 中，$H = \\langle 4 \\rangle$ 有 $6$ 个元素，$K = \\langle 6 \\rangle$ 有 $4$ 个，$H \\cap K$ 有 $2$ 个，所以 $|H + K| = \\frac{6 \\cdot 4}{2} = 12$。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        let b: number;
        let h: number;
        let k: number;
        do {
          n = rng.pick([24, 30, 36, 40, 48, 60, 72, 84, 90, 120]);
          a = rng.int(2, n - 1);
          b = rng.int(2, n - 1);
          h = additiveOrder(a, n);
          k = additiveOrder(b, n);
        } while (gcd(h, k) === 1 || h % k === 0 || k % h === 0);
        const i = gcd(h, k);
        const value = (h * k) / i;
        return numberProblem({
          prompt: t(
            `In $${zTex(n)}$, let $H = \\langle ${a} \\rangle$ and $K = \\langle ${b} \\rangle$. How many elements does $H + K$ have?`,
            `在 $${zTex(n)}$ 中，设 $H = \\langle ${a} \\rangle$，$K = \\langle ${b} \\rangle$。$H + K$ 有多少个元素？`,
          ),
          answer: value,
          wrong: [h * k, h + k, i, Math.max(h, k)].filter((x) => x !== value && x <= n),
          solution: t(
            `$|H| = ${h}$, $|K| = ${k}$ and $|H \\cap K| = \\gcd(${h}, ${k}) = ${i}$, so $|H + K| = \\frac{${h} \\cdot ${k}}{${i}} = ${value}$.`,
            `$|H| = ${h}$，$|K| = ${k}$，$|H \\cap K| = \\gcd(${h}, ${k}) = ${i}$，所以 $|H + K| = \\frac{${h} \\cdot ${k}}{${i}} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** theThirdIsomorphismTheorem applies (G/N)/(K/N) ≅ G/K in ℤ and ℤₙ. */
export const theThirdIsomorphismTheorem: TopicDef = {
  id: "the-third-isomorphism-theorem",
  title: t("The Third Isomorphism Theorem", "第三同构定理"),
  summary: t(
    "If N ≤ K are normal subgroups of G, then K/N is a normal subgroup of G/N and (G/N)/(K/N) ≅ G/K: the N cancels. For example (ℤ/12ℤ)/(3ℤ/12ℤ) ≅ ℤ/3ℤ.",
    "若 N ≤ K 都是 G 的正规子群，则 K/N 是 G/N 的正规子群，且 (G/N)/(K/N) ≅ G/K：N 可以「约去」。例如 (ℤ/12ℤ)/(3ℤ/12ℤ) ≅ ℤ/3ℤ。",
  ),
  prerequisites: ["the-first-isomorphism-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-third-isomorphism-theorem-in-the-integers",
      title: t("In the integers", "在整数中"),
      explanation: t(
        "$12\\mathbb{Z} \\le 3\\mathbb{Z}$, so $(\\mathbb{Z}/12\\mathbb{Z})/(3\\mathbb{Z}/12\\mathbb{Z}) \\cong \\mathbb{Z}/3\\mathbb{Z}$, with $3$ elements.",
        "$12\\mathbb{Z} \\le 3\\mathbb{Z}$，所以 $(\\mathbb{Z}/12\\mathbb{Z})/(3\\mathbb{Z}/12\\mathbb{Z}) \\cong \\mathbb{Z}/3\\mathbb{Z}$，有 $3$ 个元素。",
      ),
      generate(rng) {
        let b: number;
        let c: number;
        do {
          b = rng.int(2, 15);
          c = rng.int(2, 9);
        } while (b === c);
        const a = b * c;
        const ask = rng.bool();
        return numberProblem({
          prompt: ask
            ? t(
                `How many elements does $(\\mathbb{Z}/${a}\\mathbb{Z})/(${b}\\mathbb{Z}/${a}\\mathbb{Z})$ have?`,
                `$(\\mathbb{Z}/${a}\\mathbb{Z})/(${b}\\mathbb{Z}/${a}\\mathbb{Z})$ 有多少个元素？`,
              )
            : t(`How many elements does $${b}\\mathbb{Z}/${a}\\mathbb{Z}$ have?`, `$${b}\\mathbb{Z}/${a}\\mathbb{Z}$ 有多少个元素？`),
          answer: ask ? b : c,
          wrong: ask ? [c, a, a - b] : [b, a, a - b],
          solution: ask
            ? t(
                `By the third isomorphism theorem the quotient is $\\mathbb{Z}/${b}\\mathbb{Z}$, with $${b}$ elements.`,
                `由第三同构定理，商群为 $\\mathbb{Z}/${b}\\mathbb{Z}$，有 $${b}$ 个元素。`,
              )
            : t(
                `The cosets are $${b}k + ${a}\\mathbb{Z}$ for $k = 0, \\dots, ${c - 1}$: $\\frac{${a}}{${b}} = ${c}$ elements.`,
                `陪集为 $${b}k + ${a}\\mathbb{Z}$，$k = 0, \\dots, ${c - 1}$：共 $\\frac{${a}}{${b}} = ${c}$ 个元素。`,
              ),
        });
      },
    },
    {
      id: "the-third-isomorphism-theorem-in-zn",
      title: t("In ℤₙ", "在 ℤₙ 中"),
      explanation: t(
        "In $\\mathbb{Z}_{24}$, $N = \\langle 16 \\rangle = \\langle 8 \\rangle$ lies in $K = \\langle 10 \\rangle = \\langle 2 \\rangle$, so $(\\mathbb{Z}_{24}/N)/(K/N) \\cong \\mathbb{Z}_{24}/\\langle 2 \\rangle \\cong \\mathbb{Z}_2$.",
        "在 $\\mathbb{Z}_{24}$ 中，$N = \\langle 16 \\rangle = \\langle 8 \\rangle$ 包含于 $K = \\langle 10 \\rangle = \\langle 2 \\rangle$，所以 $(\\mathbb{Z}_{24}/N)/(K/N) \\cong \\mathbb{Z}_{24}/\\langle 2 \\rangle \\cong \\mathbb{Z}_2$。",
      ),
      generate(rng) {
        const n = rng.pick([24, 30, 36, 40, 48, 60, 72, 90, 96, 120]);
        const ds = divisors(n).filter((d) => d > 1 && d < n);
        let d1: number;
        let d2: number;
        do {
          d1 = rng.pick(ds);
          d2 = rng.pick(ds);
        } while (d2 === d1 || d2 % d1 !== 0);
        const disguise = (d: number) => mod(d * rng.pick(units(n / d)), n);
        const [a, b] = [disguise(d2), disguise(d1)];
        return texChoice(
          rng,
          t(
            `In $${zTex(n)}$, let $N = \\langle ${a} \\rangle$ and $K = \\langle ${b} \\rangle$, so $N \\le K$. Which group is $(${zTex(n)}/N)/(K/N)$ isomorphic to?`,
            `在 $${zTex(n)}$ 中，设 $N = \\langle ${a} \\rangle$，$K = \\langle ${b} \\rangle$，则 $N \\le K$。$(${zTex(n)}/N)/(K/N)$ 同构于哪个群？`,
          ),
          zTex(d1),
          [zTex(d2), zTex(d2 / d1), zTex(n / d1), zTex(n / d2)],
          t(
            `$K = \\langle ${d1} \\rangle$, so by the third isomorphism theorem the quotient is $${zTex(n)}/\\langle ${d1} \\rangle \\cong ${zTex(d1)}$.`,
            `$K = \\langle ${d1} \\rangle$，由第三同构定理，商群为 $${zTex(n)}/\\langle ${d1} \\rangle \\cong ${zTex(d1)}$。`,
          ),
        );
      },
    },
  ],
};

/** abstractAlgebraHomomorphismTopics are the topics of Abstract Algebra unit 5. */
export const abstractAlgebraHomomorphismTopics: readonly TopicDef[] = [
  groupHomomorphisms,
  theImageOfAGroupHomomorphism,
  theKernelOfAGroupHomomorphism,
  groupIsomorphisms,
  theFirstIsomorphismTheorem,
  theSecondIsomorphismTheorem,
  theThirdIsomorphismTheorem,
];
