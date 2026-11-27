import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { algebraDrawings2 } from "../explanation-drawings-abstract-algebra-2.ts";

import { numberProblem, why } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { divisors, factProblem, gcd, lcm, mod, multiplicativeOrder, phi, texChoice, units } from "./abstract-algebra-common.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { range } from "./methods-of-proof-common.ts";

// Abstract Algebra unit 5: homomorphisms, kernels, images and the isomorphism theorems.

/** apart keeps the typical mistakes whose values differ from the answer, each value once. */
const apart = <T extends { readonly value: unknown }>(answer: unknown, list: readonly T[]): T[] =>
  list.filter((m, i) => m.value !== answer && list.findIndex((x) => x.value === m.value) === i);

/** over writes a/b as a fraction, or just a when b is 1. */
const over = (a: number | string, b: number) => (b === 1 ? `${a}` : `\\frac{${a}}{${b}}`);

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
  intro: t(
    "A homomorphism $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$ is fixed by $k = \\varphi(1)$, since then $\\varphi(x) = kx$. Because $12 = 0$ in $\\mathbb{Z}_{12}$, we need $12k \\equiv 0 \\pmod{18}$, which holds exactly when $k$ is a multiple of $\\frac{18}{\\gcd(12, 18)} = 3$. So $k$ can be $0, 3, 6, 9, 12, 15$, and there are $6 = \\gcd(12, 18)$ homomorphisms. With $k = 3$, for example, $\\varphi(5) = 15$.\n\nCheck: $12 \\cdot 3 = 36 = 2 \\cdot 18$, so $k = 3$ works, while $12 \\cdot 2 = 24$ leaves remainder $6$ modulo $18$, so $k = 2$ does not.\n\nIn this lesson we decide when a map between cyclic groups is a homomorphism and count the homomorphisms between two cyclic groups.",
    "同态 $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$ 由 $k = \\varphi(1)$ 决定，因为此时 $\\varphi(x) = kx$。由于在 $\\mathbb{Z}_{12}$ 中 $12 = 0$，需要 $12k \\equiv 0 \\pmod{18}$，这当且仅当 $k$ 是 $\\frac{18}{\\gcd(12, 18)} = 3$ 的倍数。所以 $k$ 可以取 $0, 3, 6, 9, 12, 15$，共有 $6 = \\gcd(12, 18)$ 个同态。例如取 $k = 3$，则 $\\varphi(5) = 15$。\n\n检验：$12 \\cdot 3 = 36 = 2 \\cdot 18$，所以 $k = 3$ 可以；而 $12 \\cdot 2 = 24$ 模 $18$ 余 $6$，所以 $k = 2$ 不行。\n\n本课我们判断循环群之间的映射何时是同态，并数出两个循环群之间的同态。",
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
        "A map from a cyclic group is fixed by the image of a generator, and it is well defined only if that image has an order dividing the group's order. A homomorphism $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{8}$ with $\\varphi(1) = k$ has $\\varphi(x) = kx$, and since $12 = 0$ in $\\mathbb{Z}_{12}$ we need $12k \\equiv 0 \\pmod 8$. So $k = 2$ works but $k = 1$ does not.\n\nCheck: $12 \\cdot 2 = 24 = 3 \\cdot 8$, while $12 \\cdot 1 = 12$ leaves remainder $4$ modulo $8$. Indeed $2$ has order $4$ in $\\mathbb{Z}_8$, which divides $12$, and $1$ has order $8$, which does not.\n\n> **Watch out.** The test uses the order of the group the map starts from: it is $mk \\equiv 0 \\pmod n$, not whether $k$ divides $n$. Here $1$ divides $8$, yet $\\varphi(1) = 1$ gives no homomorphism.",
        "从循环群出发的映射由生成元的像决定，只有当这个像的阶整除群的阶时，映射才是良定义的。同态 $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{8}$ 若 $\\varphi(1) = k$，则 $\\varphi(x) = kx$；由于在 $\\mathbb{Z}_{12}$ 中 $12 = 0$，需要 $12k \\equiv 0 \\pmod 8$。所以 $k = 2$ 可以，$k = 1$ 不行。\n\n检验：$12 \\cdot 2 = 24 = 3 \\cdot 8$，而 $12 \\cdot 1 = 12$ 模 $8$ 余 $4$。确实，$2$ 在 $\\mathbb{Z}_8$ 中的阶为 $4$，整除 $12$；$1$ 的阶为 $8$，不整除 $12$。\n\n> **注意。** 检验用的是出发的那个群的阶：条件是 $mk \\equiv 0 \\pmod n$，而不是 $k$ 是否整除 $n$。这里 $1$ 整除 $8$，但 $\\varphi(1) = 1$ 不给出同态。",
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
        "Each allowed image of the generator gives one homomorphism, and the number of allowed images is the gcd of the two orders. The homomorphisms $\\mathbb{Z}_{m} \\to \\mathbb{Z}_{n}$ correspond to the $k$ with $mk \\equiv 0 \\pmod n$, the multiples of $\\frac{n}{\\gcd(m, n)}$. There are $\\gcd(m, n)$ of them: $\\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$ has $6$.\n\nCheck: the multiples of $\\frac{18}{6} = 3$ in $\\mathbb{Z}_{18}$ are $0, 3, 6, 9, 12, 15$, six of them, and $12 \\cdot 3 = 36$ is a multiple of $18$.\n\n> **Watch out.** The count is the gcd, not the lcm, and it includes the zero map $\\varphi(1) = 0$.",
        "生成元的每个允许的像都给出一个同态，允许的像的个数等于两个阶的最大公因数。同态 $\\mathbb{Z}_{m} \\to \\mathbb{Z}_{n}$ 对应于满足 $mk \\equiv 0 \\pmod n$ 的 $k$，即 $\\frac{n}{\\gcd(m, n)}$ 的倍数，共 $\\gcd(m, n)$ 个：$\\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$ 有 $6$ 个。\n\n检验：$\\mathbb{Z}_{18}$ 中 $\\frac{18}{6} = 3$ 的倍数是 $0, 3, 6, 9, 12, 15$，共六个，而 $12 \\cdot 3 = 36$ 是 $18$ 的倍数。\n\n> **注意。** 个数是最大公因数而不是最小公倍数，并且包括零映射 $\\varphi(1) = 0$。",
      ),
      generate(rng) {
        // Orders with a common factor, since coprime orders only allow the zero map.
        for (;;) {
          const m = rng.int(2, 60);
          const n = rng.int(2, 60);
          if (gcd(m, n) === 1) continue;
          const g = gcd(m, n);
          const step = n / g;
          const mistakes = apart(g, [
            why(
              lcm(m, n),
              `That is $\\operatorname{lcm}(${m}, ${n})$; the allowed images are the multiples of $${step}$ in $${zTex(n)}$, and there are $\\gcd(${m}, ${n})$ of them.`,
              `那是 $\\operatorname{lcm}(${m}, ${n})$；允许的像是 $${zTex(n)}$ 中 $${step}$ 的倍数，共 $\\gcd(${m}, ${n})$ 个。`,
            ),
            why(
              n,
              `That allows every $k$ in $${zTex(n)}$, but $k$ must satisfy $${m} \\cdot k \\equiv 0 \\pmod{${n}}$.`,
              `那允许 $${zTex(n)}$ 中的每个 $k$，但 $k$ 必须满足 $${m} \\cdot k \\equiv 0 \\pmod{${n}}$。`,
            ),
            why(
              step,
              `That is the step between the allowed images, not the number of them.`,
              "那是相邻允许的像之间的间隔，而不是它们的个数。",
            ),
            why(
              g - 1,
              "That leaves out the zero map, $\\varphi(1) = 0$, which is a homomorphism too.",
              "那漏掉了零映射 $\\varphi(1) = 0$，它也是同态。",
            ),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(`How many homomorphisms $${zTex(m)} \\to ${zTex(n)}$ are there?`, `$${zTex(m)} \\to ${zTex(n)}$ 的同态有多少个？`),
            answer: g,
            form: "integer",
            mistakes,
            solution: walked(
              [
                [
                  ["Fix the generator", "看生成元"],
                  t(
                    `A homomorphism is fixed by $k = \\varphi(1)$, and it needs $${m} \\cdot k \\equiv 0 \\pmod{${n}}$.`,
                    `同态由 $k = \\varphi(1)$ 决定，并且需要 $${m} \\cdot k \\equiv 0 \\pmod{${n}}$。`,
                  ),
                ],
                [
                  ["Solve for k", "求 k"],
                  t(
                    `That holds exactly when $k$ is a multiple of $\\frac{${n}}{\\gcd(${m}, ${n})} = ${step}$.`,
                    `这当且仅当 $k$ 是 $\\frac{${n}}{\\gcd(${m}, ${n})} = ${step}$ 的倍数。`,
                  ),
                ],
                [
                  ["Count", "计数"],
                  t(
                    `There are $${over(n, step)}${step === 1 ? "" : ` = ${g}`}$ multiples of $${step}$ in $${zTex(n)}$, the zero map included.`,
                    `$${zTex(n)}$ 中 $${step}$ 的倍数有 $${over(n, step)}${step === 1 ? "" : ` = ${g}`}$ 个，包括零映射。`,
                  ),
                ],
              ],
              t(
                `$${m} \\cdot ${step} = ${m * step} = ${(m * step) / n} \\cdot ${n}$, so $k = ${step}$ is allowed, and so is every multiple of it.`,
                `$${m} \\cdot ${step} = ${m * step} = ${(m * step) / n} \\cdot ${n}$，所以 $k = ${step}$ 可以，它的每个倍数也都可以。`,
              ),
            ),
          });
        }
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
  intro: t(
    "Let $\\varphi: \\mathbb{Z}_{20} \\to \\mathbb{Z}_{30}$ be the homomorphism with $\\varphi(1) = 12$; it exists because $20 \\cdot 12 = 240 = 8 \\cdot 30$. Every element of $\\mathbb{Z}_{20}$ is a multiple of $1$, so the image is $\\langle 12 \\rangle$, the multiples of $\\gcd(12, 30) = 6$: $\\{0, 6, 12, 18, 24\\}$, with $\\frac{30}{6} = 5$ elements.\n\nCheck: $5$ divides both $20$ and $30$, as the size of an image of $\\mathbb{Z}_{20}$ inside $\\mathbb{Z}_{30}$ must, and $5 \\cdot 12 = 60 \\equiv 0 \\pmod{30}$, so $12$ has order $5$.\n\nIn this lesson we find the images of homomorphisms between cyclic groups and of power maps on groups of units.",
    "设 $\\varphi: \\mathbb{Z}_{20} \\to \\mathbb{Z}_{30}$ 是满足 $\\varphi(1) = 12$ 的同态；它存在，因为 $20 \\cdot 12 = 240 = 8 \\cdot 30$。$\\mathbb{Z}_{20}$ 的每个元素都是 $1$ 的倍数，所以像是 $\\langle 12 \\rangle$，即 $\\gcd(12, 30) = 6$ 的倍数：$\\{0, 6, 12, 18, 24\\}$，有 $\\frac{30}{6} = 5$ 个元素。\n\n检验：$5$ 同时整除 $20$ 和 $30$，这正是 $\\mathbb{Z}_{20}$ 在 $\\mathbb{Z}_{30}$ 中的像的大小必须满足的；并且 $5 \\cdot 12 = 60 \\equiv 0 \\pmod{30}$，所以 $12$ 的阶为 $5$。\n\n本课我们求循环群之间同态的像，以及单位群上幂映射的像。",
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
        "The image of a cyclic group is cyclic, generated by the image of the generator, so it is the subgroup that this image generates. For $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$ with $\\varphi(1) = 6$, the image is $\\langle 6 \\rangle = \\{0, 6, 12\\}$, of size $\\frac{18}{\\gcd(6, 18)} = 3$.\n\nCheck: $3 \\cdot 6 = 18 \\equiv 0 \\pmod{18}$, so $6$ has order $3$, and $3$ divides $12$, as the size of an image of $\\mathbb{Z}_{12}$ must.\n\n> **Watch out.** The size of the image is the order of $\\varphi(1)$, which is $\\frac{n}{\\gcd(k, n)}$; the gcd itself, here $6$, only names the generator $\\langle 6 \\rangle$.",
        "循环群的像是循环的，由生成元的像生成，所以它就是这个像生成的子群。对 $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$，$\\varphi(1) = 6$，像为 $\\langle 6 \\rangle = \\{0, 6, 12\\}$，大小为 $\\frac{18}{\\gcd(6, 18)} = 3$。\n\n检验：$3 \\cdot 6 = 18 \\equiv 0 \\pmod{18}$，所以 $6$ 的阶为 $3$；并且 $3$ 整除 $12$，这正是 $\\mathbb{Z}_{12}$ 的像的大小必须满足的。\n\n> **注意。** 像的大小是 $\\varphi(1)$ 的阶，即 $\\frac{n}{\\gcd(k, n)}$；最大公因数本身（这里是 $6$）只给出生成元 $\\langle 6 \\rangle$。",
      ),
      generate(rng) {
        for (;;) {
          const { m, n, k } = cyclicHom(rng);
          const g = gcd(k, n);
          const value = additiveOrder(k, n);
          const mistakes = apart(value, [
            why(
              g,
              `$\\gcd(${k}, ${n}) = ${g}$ generates the image, as $\\langle ${g} \\rangle$, but the image has $${over(n, g)}$ elements.`,
              `$\\gcd(${k}, ${n}) = ${g}$ 是像的生成元，即 $\\langle ${g} \\rangle$，但像有 $${over(n, g)}$ 个元素。`,
            ),
            why(m / value, "That is the size of the kernel, the elements sent to $0$.", "那是核的大小，即被送到 $0$ 的元素个数。"),
            why(
              n,
              `That is all of $${zTex(n)}$, but $\\varphi$ is onto only when $\\varphi(1)$ generates $${zTex(n)}$.`,
              `那是整个 $${zTex(n)}$，但只有当 $\\varphi(1)$ 生成 $${zTex(n)}$ 时 $\\varphi$ 才是满射。`,
            ),
            why(
              gcd(m, n),
              `That is $\\gcd(${m}, ${n})$, the number of homomorphisms $${zTex(m)} \\to ${zTex(n)}$, not the size of this image.`,
              `那是 $\\gcd(${m}, ${n})$，即 $${zTex(m)} \\to ${zTex(n)}$ 的同态个数，而不是这个像的大小。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `Let $\\varphi: ${zTex(m)} \\to ${zTex(n)}$ be the homomorphism with $\\varphi(1) = ${k}$. How many elements does its image have?`,
              `设 $\\varphi: ${zTex(m)} \\to ${zTex(n)}$ 是满足 $\\varphi(1) = ${k}$ 的同态。它的像有多少个元素？`,
            ),
            answer: value,
            form: "integer",
            mistakes,
            solution: walked(
              [
                [
                  ["Name the image", "写出像"],
                  t(
                    `Every element of $${zTex(m)}$ is a multiple of $1$, so the image is $\\langle ${k} \\rangle$ in $${zTex(n)}$.`,
                    `$${zTex(m)}$ 的每个元素都是 $1$ 的倍数，所以像是 $${zTex(n)}$ 中的 $\\langle ${k} \\rangle$。`,
                  ),
                ],
                [
                  ["Find its size", "求它的大小"],
                  t(
                    `$\\langle ${k} \\rangle = \\langle ${g} \\rangle$ has $\\frac{${n}}{\\gcd(${k}, ${n})}${g === 1 ? "" : ` = \\frac{${n}}{${g}}`} = ${value}$ elements.`,
                    `$\\langle ${k} \\rangle = \\langle ${g} \\rangle$ 有 $\\frac{${n}}{\\gcd(${k}, ${n})}${g === 1 ? "" : ` = \\frac{${n}}{${g}}`} = ${value}$ 个元素。`,
                  ),
                ],
              ],
              t(
                `$${value} \\cdot ${k} = ${value * k} = ${(value * k) / n} \\cdot ${n}$, so $${k}$ has order $${value}$, and $${value}$ divides $${m}$, as the size of an image of $${zTex(m)}$ must.`,
                `$${value} \\cdot ${k} = ${value * k} = ${(value * k) / n} \\cdot ${n}$，所以 $${k}$ 的阶为 $${value}$；并且 $${value}$ 整除 $${m}$，这正是 $${zTex(m)}$ 的像的大小必须满足的。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "images-of-power-maps",
      title: t("Images of power maps", "幂映射的像"),
      explanation: t(
        "In an abelian group raising to a power respects the operation, so its image is the set of all such powers, found by computing each one. In an abelian group, $x \\mapsto x^e$ is a homomorphism. On $U(15) = \\{1, 2, 4, 7, 8, 11, 13, 14\\}$, squaring gives $\\{1, 4\\}$, so the image has $2$ elements.\n\nCheck: the kernel, the solutions of $x^2 \\equiv 1$, is $\\{1, 4, 11, 14\\}$, and $2 \\cdot 4 = 8 = |U(15)|$, as the size of the image times the size of the kernel must be.\n\n> **Watch out.** Squaring does not always halve the group: here it cuts $8$ elements down to $2$, because the kernel has $4$ elements, not $2$.",
        "在阿贝尔群中升幂保持运算，所以它的像是所有这样的幂组成的集合，可以逐个计算求出。在阿贝尔群中，$x \\mapsto x^e$ 是同态。在 $U(15) = \\{1, 2, 4, 7, 8, 11, 13, 14\\}$ 上平方得 $\\{1, 4\\}$，所以像有 $2$ 个元素。\n\n检验：核即 $x^2 \\equiv 1$ 的解集，是 $\\{1, 4, 11, 14\\}$，而 $2 \\cdot 4 = 8 = |U(15)|$，正符合像的大小乘核的大小等于群的阶。\n\n> **注意。** 平方并不总是把群减半：这里它把 $8$ 个元素变成 $2$ 个，因为核有 $4$ 个元素，而不是 $2$ 个。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(7, 45);
          const e = rng.pick([2, 2, 3]);
          const image = powerImage(n, e).sort((a, b) => a - b);
          const value = image.length;
          const p = phi(n);
          const kernel = p / value;
          const power = e === 2 ? "squaring" : "cubing";
          const powerZh = e === 2 ? "平方" : "立方";
          const mistakes = apart(value, [
            why(
              kernel,
              `That is the size of the kernel, the $x$ with $x^{${e}} \\equiv 1$; the image has $${over(p, kernel)}$ elements.`,
              `那是核的大小，即满足 $x^{${e}} \\equiv 1$ 的 $x$ 的个数；像有 $${over(p, kernel)}$ 个元素。`,
            ),
            why(
              p,
              `That is all of $U(${n})$, but ${power} sends different units to the same value.`,
              `那是整个 $U(${n})$，但${powerZh}会把不同的单位映到同一个值。`,
            ),
            why(
              Math.floor(p / e),
              `That assumes ${power} is ${e}-to-one; it is $${kernel}$-to-one, the size of the kernel.`,
              `那是假设${powerZh}是 ${e} 对一的；它其实是 $${kernel}$ 对一的，即核的大小。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `How many elements does the image of $\\varphi: U(${n}) \\to U(${n})$, $\\varphi(x) = x^{${e}}$ have?`,
              `$\\varphi: U(${n}) \\to U(${n})$，$\\varphi(x) = x^{${e}}$ 的像有多少个元素？`,
            ),
            answer: value,
            form: "integer",
            mistakes,
            solution: walked(
              [
                [
                  ["List the units", "列出单位"],
                  t(`$U(${n})$ has $\\varphi(${n}) = ${p}$ elements.`, `$U(${n})$ 有 $\\varphi(${n}) = ${p}$ 个元素。`),
                ],
                [
                  ["Compute the powers", "计算幂"],
                  t(
                    `The distinct ${e === 2 ? "squares" : "cubes"} modulo ${n} are $${image.join(", ")}$.`,
                    `模 ${n} 的不同${powerZh}是 $${image.join(", ")}$。`,
                  ),
                ],
                [["Count", "计数"], t(`That is $${value}$ ${value === 1 ? "element" : "elements"}.`, `共 $${value}$ 个元素。`)],
              ],
              t(
                `The kernel, the solutions of $x^{${e}} \\equiv 1 \\pmod{${n}}$, has $${kernel}$ elements, and $${value} \\cdot ${kernel} = ${p} = |U(${n})|$.`,
                `核即 $x^{${e}} \\equiv 1 \\pmod{${n}}$ 的解集，有 $${kernel}$ 个元素，而 $${value} \\cdot ${kernel} = ${p} = |U(${n})|$。`,
              ),
            ),
          });
        }
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
  intro: t(
    "Take again $\\varphi: \\mathbb{Z}_{20} \\to \\mathbb{Z}_{30}$ with $\\varphi(1) = 12$, so $\\varphi(x) = 12x$. The kernel is the $x$ with $12x \\equiv 0 \\pmod{30}$, that is $30 \\mid 12x$, or $5 \\mid 2x$, or $5 \\mid x$. So $\\ker \\varphi = \\{0, 5, 10, 15\\}$, with $4$ elements.\n\nCheck: the image $\\langle 12 \\rangle$ has $5$ elements, and $4 \\cdot 5 = 20 = |\\mathbb{Z}_{20}|$, as the sizes of kernel and image must multiply to the order of the group.\n\nIn this lesson we find the kernels of homomorphisms between cyclic groups and of power maps on groups of units.",
    "仍取 $\\varphi: \\mathbb{Z}_{20} \\to \\mathbb{Z}_{30}$，$\\varphi(1) = 12$，所以 $\\varphi(x) = 12x$。核是满足 $12x \\equiv 0 \\pmod{30}$ 的 $x$，即 $30 \\mid 12x$，也就是 $5 \\mid 2x$，即 $5 \\mid x$。所以 $\\ker \\varphi = \\{0, 5, 10, 15\\}$，有 $4$ 个元素。\n\n检验：像 $\\langle 12 \\rangle$ 有 $5$ 个元素，而 $4 \\cdot 5 = 20 = |\\mathbb{Z}_{20}|$，正符合核与像的大小之积等于群的阶。\n\n本课我们求循环群之间同态的核，以及单位群上幂映射的核。",
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
        "The kernel is the set of elements sent to the identity, and its size is the group order divided by the size of the image. For $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$ with $\\varphi(1) = 6$, the image has $3$ elements, so the kernel has $\\frac{12}{3} = 4$: it is $\\{0, 3, 6, 9\\}$.\n\nCheck: $\\varphi(3) = 18 \\equiv 0 \\pmod{18}$, so $3$ and its multiples are in the kernel, while $\\varphi(1) = 6$ and $\\varphi(2) = 12$ are not $0$.\n\n> **Watch out.** Divide the order of the group the map starts from by the size of the image: $\\frac{12}{3}$, not $\\frac{18}{3}$, and not the size $3$ of the image itself.",
        "核是被送到单位元的元素组成的集合，它的大小等于群的阶除以像的大小。对 $\\varphi: \\mathbb{Z}_{12} \\to \\mathbb{Z}_{18}$，$\\varphi(1) = 6$，像有 $3$ 个元素，所以核有 $\\frac{12}{3} = 4$ 个：即 $\\{0, 3, 6, 9\\}$。\n\n检验：$\\varphi(3) = 18 \\equiv 0 \\pmod{18}$，所以 $3$ 及其倍数都在核中；而 $\\varphi(1) = 6$、$\\varphi(2) = 12$ 都不是 $0$。\n\n> **注意。** 要用出发的那个群的阶除以像的大小：是 $\\frac{12}{3}$，不是 $\\frac{18}{3}$，也不是像的大小 $3$ 本身。",
      ),
      generate(rng) {
        for (;;) {
          const { m, n, k } = cyclicHom(rng);
          const im = additiveOrder(k, n);
          const value = m / im;
          const mistakes = apart(value, [
            why(
              im,
              "That is the size of the image; the kernel has the order of the group divided by it.",
              "那是像的大小；核的大小是群的阶除以它。",
            ),
            why(
              n / im,
              `That divides $${n}$, the order of the target, by the size of the image; use $${m}$, the order of $${zTex(m)}$.`,
              `那是用目标群的阶 $${n}$ 除以像的大小；应该用 $${zTex(m)}$ 的阶 $${m}$。`,
            ),
            why(
              m,
              `That is all of $${zTex(m)}$, but $\\varphi(1) = ${k}$ is not $0$, so $1$ is not in the kernel.`,
              `那是整个 $${zTex(m)}$，但 $\\varphi(1) = ${k}$ 不是 $0$，所以 $1$ 不在核中。`,
            ),
            why(
              1,
              `That would make $\\varphi$ one-to-one, but $\\varphi(${im}) = ${im * k} \\equiv 0 \\pmod{${n}}$.`,
              `那意味着 $\\varphi$ 是单射，但 $\\varphi(${im}) = ${im * k} \\equiv 0 \\pmod{${n}}$。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `Let $\\varphi: ${zTex(m)} \\to ${zTex(n)}$ be the homomorphism with $\\varphi(1) = ${k}$. How many elements does its kernel have?`,
              `设 $\\varphi: ${zTex(m)} \\to ${zTex(n)}$ 是满足 $\\varphi(1) = ${k}$ 的同态。它的核有多少个元素？`,
            ),
            answer: value,
            form: "integer",
            mistakes,
            solution: walked(
              [
                [
                  ["Find the image", "求像"],
                  t(
                    `The image $\\langle ${k} \\rangle$ in $${zTex(n)}$ has $\\frac{${n}}{\\gcd(${k}, ${n})} = ${im}$ elements.`,
                    `像 $\\langle ${k} \\rangle$ 在 $${zTex(n)}$ 中有 $\\frac{${n}}{\\gcd(${k}, ${n})} = ${im}$ 个元素。`,
                  ),
                ],
                [
                  ["Divide", "相除"],
                  t(`$|\\ker \\varphi| = \\frac{${m}}{${im}} = ${value}$.`, `$|\\ker \\varphi| = \\frac{${m}}{${im}} = ${value}$。`),
                ],
              ],
              t(
                `The kernel is the multiples of $${im}$ in $${zTex(m)}$, since $${im} \\cdot ${k} = ${im * k}$ is a multiple of $${n}$, and there are $\\frac{${m}}{${im}} = ${value}$ of them.`,
                `核是 $${zTex(m)}$ 中 $${im}$ 的倍数，因为 $${im} \\cdot ${k} = ${im * k}$ 是 $${n}$ 的倍数，共有 $\\frac{${m}}{${im}} = ${value}$ 个。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "kernels-of-power-maps",
      title: t("Kernels of power maps", "幂映射的核"),
      explanation: t(
        "The kernel of a power map consists of the elements whose power is the identity, so solve that equation in the group. The kernel of $x \\mapsto x^2$ on $U(n)$ is the set of solutions of $x^2 \\equiv 1 \\pmod n$. On $U(15)$ these are $1, 4, 11, 14$.\n\nCheck: $4^2 = 16 = 15 + 1$, $11^2 = 121 = 8 \\cdot 15 + 1$ and $14^2 = 196 = 13 \\cdot 15 + 1$, while for example $2^2 = 4$ is not $1$.\n\n> **Watch out.** $x^2 \\equiv 1$ can have more than the two solutions $\\pm 1$ when $n$ is not prime: $U(15)$ has four.",
        "幂映射的核由那些幂等于单位元的元素组成，所以要在群中解这个方程。$U(n)$ 上 $x \\mapsto x^2$ 的核是 $x^2 \\equiv 1 \\pmod n$ 的解集。在 $U(15)$ 上为 $1, 4, 11, 14$。\n\n检验：$4^2 = 16 = 15 + 1$，$11^2 = 121 = 8 \\cdot 15 + 1$，$14^2 = 196 = 13 \\cdot 15 + 1$；而例如 $2^2 = 4$ 不是 $1$。\n\n> **注意。** 当 $n$ 不是素数时，$x^2 \\equiv 1$ 的解可以多于 $\\pm 1$ 这两个：$U(15)$ 中有四个。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(7, 45);
          const e = rng.pick([2, 2, 3]);
          const kernel = units(n).filter((x) => mod(x ** e, n) === 1);
          const value = kernel.length;
          const p = phi(n);
          const mistakes = apart(value, [
            why(
              e,
              `$x^{${e}} \\equiv 1$ need not have ${e} solutions modulo ${n}; check each unit.`,
              `模 ${n} 时 $x^{${e}} \\equiv 1$ 不一定有 ${e} 个解；要逐个检查单位。`,
            ),
            why(
              p / value,
              "That is the size of the image, the distinct powers; the kernel is the units whose power is $1$.",
              "那是像的大小，即不同的幂的个数；核是幂等于 $1$ 的单位。",
            ),
            why(
              1,
              `Not only $1$: for example $${kernel[kernel.length - 1]}^{${e}} \\equiv 1 \\pmod{${n}}$.`,
              `不只是 $1$：例如 $${kernel[kernel.length - 1]}^{${e}} \\equiv 1 \\pmod{${n}}$。`,
            ),
            why(
              p,
              `That is all of $U(${n})$, but for example $2^{${e}} = ${2 ** e}$ is not $1$ modulo ${n}.`,
              `那是整个 $U(${n})$，但例如 $2^{${e}} = ${2 ** e}$ 模 ${n} 不是 $1$。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
          const last = kernel[kernel.length - 1] as number;
          return numberProblem({
            prompt: t(
              `How many elements does the kernel of $\\varphi: U(${n}) \\to U(${n})$, $\\varphi(x) = x^{${e}}$ have?`,
              `$\\varphi: U(${n}) \\to U(${n})$，$\\varphi(x) = x^{${e}}$ 的核有多少个元素？`,
            ),
            answer: value,
            form: "integer",
            mistakes,
            solution: walked(
              [
                [
                  ["Set up the equation", "列方程"],
                  t(
                    `The kernel is the units $x$ with $x^{${e}} \\equiv 1 \\pmod{${n}}$.`,
                    `核是满足 $x^{${e}} \\equiv 1 \\pmod{${n}}$ 的单位 $x$。`,
                  ),
                ],
                [
                  ["Solve", "求解"],
                  t(
                    `Checking the $${p}$ units of $U(${n})$, the solutions are $${kernel.join(", ")}$.`,
                    `逐个检查 $U(${n})$ 的 $${p}$ 个单位，解为 $${kernel.join(", ")}$。`,
                  ),
                ],
                [["Count", "计数"], t(`That is $${value}$ ${value === 1 ? "element" : "elements"}.`, `共 $${value}$ 个元素。`)],
              ],
              last === 1
                ? t(
                    `Only $1$ solves it, so the ${e === 2 ? "squaring" : "cubing"} map is one-to-one and its image is all $${p}$ units.`,
                    `只有 $1$ 满足，所以${e === 2 ? "平方" : "立方"}映射是单射，它的像是全部 $${p}$ 个单位。`,
                  )
                : t(
                    `For example $${last}^{${e}} = ${last ** e} = ${(last ** e - 1) / n} \\cdot ${n} + 1$, so it is $1$ modulo ${n}.`,
                    `例如 $${last}^{${e}} = ${last ** e} = ${(last ** e - 1) / n} \\cdot ${n} + 1$，模 ${n} 为 $1$。`,
                  ),
            ),
          });
        }
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
  intro: t(
    "In $U(10) = \\{1, 3, 7, 9\\}$, the powers of $3$ are $3^1 = 3$, $3^2 = 9$, $3^3 = 27 \\equiv 7$ and $3^4 = 81 \\equiv 1$. So $3$ has order $4 = |U(10)|$, the group is cyclic, and $3^k \\mapsto k$ is an isomorphism $U(10) \\to \\mathbb{Z}_4$, sending $3, 9, 7, 1$ to $1, 2, 3, 0$.\n\nCheck: $7 \\cdot 9 = 63 \\equiv 3 \\pmod{10}$, and on the other side $3 + 2 = 5 \\equiv 1 \\pmod 4$, which is where $3$ goes, so the map turns products into sums.\n\nIn this lesson we decide when a group of units is cyclic and use the Chinese remainder isomorphism.",
    "在 $U(10) = \\{1, 3, 7, 9\\}$ 中，$3$ 的幂为 $3^1 = 3$、$3^2 = 9$、$3^3 = 27 \\equiv 7$、$3^4 = 81 \\equiv 1$。所以 $3$ 的阶为 $4 = |U(10)|$，这个群是循环群，$3^k \\mapsto k$ 是同构 $U(10) \\to \\mathbb{Z}_4$，把 $3, 9, 7, 1$ 送到 $1, 2, 3, 0$。\n\n检验：$7 \\cdot 9 = 63 \\equiv 3 \\pmod{10}$，而另一边 $3 + 2 = 5 \\equiv 1 \\pmod 4$，正是 $3$ 的像，所以这个映射把乘积变成和。\n\n本课我们判断单位群何时是循环群，并使用中国剩余同构。",
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
        "$U(n) \\cong \\mathbb{Z}_{\\varphi(n)}$ exactly when some unit has order $\\varphi(n)$. In $U(10)$, $3$ has order $4 = \\varphi(10)$, so $U(10) \\cong \\mathbb{Z}_4$. In $U(8)$ every element has order at most $2$, so $U(8) \\not\\cong \\mathbb{Z}_4$.\n\nCheck: in $U(10)$, $3^2 = 9$, $3^3 = 27 \\equiv 7$ and $3^4 = 81 \\equiv 1$, so the order of $3$ is exactly $4$. In $U(8)$, $3^2 = 9$, $5^2 = 25$ and $7^2 = 49$ are all $1$ modulo $8$.\n\n> **Watch out.** Having $\\varphi(n)$ elements is not enough: $U(8)$ has $4$ elements, like $\\mathbb{Z}_4$, but no element of order $4$, so it is not cyclic.",
        "$U(n) \\cong \\mathbb{Z}_{\\varphi(n)}$ 当且仅当某个单位的阶为 $\\varphi(n)$。在 $U(10)$ 中 $3$ 的阶为 $4 = \\varphi(10)$，所以 $U(10) \\cong \\mathbb{Z}_4$。在 $U(8)$ 中每个元素的阶至多为 $2$，所以 $U(8) \\not\\cong \\mathbb{Z}_4$。\n\n检验：在 $U(10)$ 中，$3^2 = 9$，$3^3 = 27 \\equiv 7$，$3^4 = 81 \\equiv 1$，所以 $3$ 的阶恰为 $4$。在 $U(8)$ 中，$3^2 = 9$、$5^2 = 25$、$7^2 = 49$ 模 $8$ 都是 $1$。\n\n> **注意。** 只有 $\\varphi(n)$ 个元素还不够：$U(8)$ 和 $\\mathbb{Z}_4$ 一样有 $4$ 个元素，但没有 $4$ 阶元素，所以不是循环群。",
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
        "When the moduli are coprime, a pair of remainders matches exactly one remainder modulo their product, which gives an isomorphism. $\\varphi: \\mathbb{Z}_3 \\times \\mathbb{Z}_5 \\to \\mathbb{Z}_{15}$ with $\\varphi(1, 1) = 1$ is an isomorphism. $\\varphi(2, 4)$ is the $x$ with $x \\equiv 2 \\pmod 3$ and $x \\equiv 4 \\pmod 5$: $x = 14$.\n\nCheck: $14 = 4 \\cdot 3 + 2$ and $14 = 2 \\cdot 5 + 4$, so $14$ leaves the remainders $2$ and $4$.\n\n> **Watch out.** $\\varphi(a, b)$ is neither $a + b$ nor $ab$: here $2 + 4 = 6$ leaves remainder $1$ modulo $5$, not $4$.",
        "当两个模互素时，一对余数恰好对应模它们乘积的一个余数，这给出了一个同构。$\\varphi: \\mathbb{Z}_3 \\times \\mathbb{Z}_5 \\to \\mathbb{Z}_{15}$，$\\varphi(1, 1) = 1$ 是同构。$\\varphi(2, 4)$ 是满足 $x \\equiv 2 \\pmod 3$、$x \\equiv 4 \\pmod 5$ 的 $x$：$x = 14$。\n\n检验：$14 = 4 \\cdot 3 + 2$，$14 = 2 \\cdot 5 + 4$，所以 $14$ 的余数正是 $2$ 和 $4$。\n\n> **注意。** $\\varphi(a, b)$ 既不是 $a + b$ 也不是 $ab$：这里 $2 + 4 = 6$ 模 $5$ 余 $1$，而不是 $4$。",
      ),
      generate(rng) {
        for (;;) {
          const m = rng.int(2, 9);
          const n = rng.int(3, 11);
          if (gcd(m, n) !== 1) continue;
          const a = rng.int(0, m - 1);
          const b = rng.int(0, n - 1);
          if (b === a) continue;
          const x = crt(a, b, m, n);
          const mistakes = apart(x, [
            why(
              a + b,
              `That adds the remainders, but $${a + b}$ leaves remainder $${(a + b) % m}$ modulo ${m} and $${(a + b) % n}$ modulo ${n}.`,
              `那是把余数相加，但 $${a + b}$ 模 ${m} 余 $${(a + b) % m}$，模 ${n} 余 $${(a + b) % n}$。`,
            ),
            why(
              mod(a * b, m * n),
              `That multiplies the remainders; $\\varphi(${a}, ${b})$ must leave remainder ${a} modulo ${m} and ${b} modulo ${n}.`,
              `那是把余数相乘；$\\varphi(${a}, ${b})$ 必须模 ${m} 余 ${a}，模 ${n} 余 ${b}。`,
            ),
            why(
              mod(a * n + b * m, m * n),
              `That weights each remainder by the other modulus, which gives remainder $${mod(a * n, m)}$ modulo ${m}, not ${a}.`,
              `那是把每个余数乘以另一个模，模 ${m} 余 $${mod(a * n, m)}$，而不是 ${a}。`,
            ),
            why(
              mod(a * m + b * n, m * n),
              `That weights each remainder by its own modulus, which gives remainder $${mod(b * n, m)}$ modulo ${m}, not ${a}.`,
              `那是把每个余数乘以它自己的模，模 ${m} 余 $${mod(b * n, m)}$，而不是 ${a}。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
          const climb = range(0, (x - b) / n).map((j) => b + j * n);
          return numberProblem({
            prompt: t(
              `$\\varphi: ${zTex(m)} \\times ${zTex(n)} \\to ${zTex(m * n)}$ is the isomorphism with $\\varphi(1, 1) = 1$. Find $\\varphi(${a}, ${b})$.`,
              `$\\varphi: ${zTex(m)} \\times ${zTex(n)} \\to ${zTex(m * n)}$ 是满足 $\\varphi(1, 1) = 1$ 的同构。求 $\\varphi(${a}, ${b})$。`,
            ),
            answer: x,
            form: "integer",
            mistakes,
            solution: walked(
              [
                [
                  ["Set up the conditions", "列条件"],
                  t(
                    `$\\varphi(${a}, ${b})$ is the $x$ in $${zTex(m * n)}$ with $x \\equiv ${a} \\pmod{${m}}$ and $x \\equiv ${b} \\pmod{${n}}$.`,
                    `$\\varphi(${a}, ${b})$ 是 $${zTex(m * n)}$ 中满足 $x \\equiv ${a} \\pmod{${m}}$ 与 $x \\equiv ${b} \\pmod{${n}}$ 的 $x$。`,
                  ),
                ],
                [
                  ["Step through the second condition", "按第二个条件逐个试"],
                  t(
                    `The numbers with remainder ${b} modulo ${n} are $${climb.join(", ")}, \\dots$, and the first with remainder ${a} modulo ${m} is $${x}$.`,
                    `模 ${n} 余 ${b} 的数依次是 $${climb.join(", ")}, \\dots$，其中第一个模 ${m} 余 ${a} 的是 $${x}$。`,
                  ),
                ],
              ],
              t(
                `$${x} = ${Math.floor(x / m)} \\cdot ${m} + ${a}$ and $${x} = ${Math.floor(x / n)} \\cdot ${n} + ${b}$.`,
                `$${x} = ${Math.floor(x / m)} \\cdot ${m} + ${a}$，$${x} = ${Math.floor(x / n)} \\cdot ${n} + ${b}$。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

/** CIRCLE is the circle group of complex numbers of absolute value 1. */
const CIRCLE = "\\{z \\in \\mathbb{C} : |z| = 1\\}";

/** POSITIVE_REALS is the group of positive real numbers under multiplication. */
const POSITIVE_REALS = "\\mathbb{R}_{>0}";

/** finiteOrder says, for each infinite group offered as an option, which of its elements have finite order. */
const finiteOrder: Readonly<Record<string, readonly [string, string]>> = {
  "\\mathbb{R}^*": ["$-1$ has order $2$, and no element has order $4$", "$-1$ 的阶为 $2$，没有 $4$ 阶元素"],
  [POSITIVE_REALS]: ["only $1$ has finite order", "只有 $1$ 的阶有限"],
  [CIRCLE]: ["$i$ has order $4$", "$i$ 的阶为 $4$"],
  "\\mathbb{R}": ["only $0$ has finite order, and no single element generates it", "只有 $0$ 的阶有限，也没有一个元素能生成它"],
  "\\mathbb{Z}": ["only $0$ has finite order, and $1$ generates it", "只有 $0$ 的阶有限，并且 $1$ 生成它"],
};

/** sizeOf gives the order of ℤₙ written as an option, or undefined for an infinite group. */
const sizeOf = (tex: string) => {
  const found = /^\\mathbb\{Z\}_\{(\d+)\}$/.exec(tex);
  return found ? Number(found[1]) : undefined;
};

/** contrast says why the option x is not isomorphic to the group r. */
function contrast(x: string, r: string): [string, string] {
  const [sx, sr] = [sizeOf(x), sizeOf(r)];
  if (sx !== undefined && sr !== undefined)
    return [`$${x}$ has ${sx} elements, but $${r}$ has ${sr}.`, `$${x}$ 有 ${sx} 个元素，而 $${r}$ 有 ${sr} 个。`];
  if (sx !== undefined) return [`$${x}$ is finite, but $${r}$ is infinite.`, `$${x}$ 是有限的，而 $${r}$ 是无限的。`];
  if (sr !== undefined) return [`$${x}$ is infinite, but $${r}$ has ${sr} elements.`, `$${x}$ 是无限的，而 $${r}$ 有 ${sr} 个元素。`];
  const [fx, fr] = [finiteOrder[x], finiteOrder[r]];
  return [`In $${x}$, ${fx?.[0]}, while in $${r}$, ${fr?.[0]}.`, `在 $${x}$ 中${fx?.[1]}，而在 $${r}$ 中${fr?.[1]}。`];
}

/** theFirstIsomorphismTheorem identifies quotients as images. */
export const theFirstIsomorphismTheorem: TopicDef = {
  id: "the-first-isomorphism-theorem",
  title: t("The First Isomorphism Theorem", "第一同构定理"),
  summary: t(
    "If $\\varphi: G \\to H$ is a homomorphism, then $G/\\ker\\varphi \\cong \\varphi(G)$, by $g\\ker\\varphi \\mapsto \\varphi(g)$. To identify a quotient $G/N$, find a homomorphism from $G$ onto a known group with kernel $N$; for example, $\\det: GL(2, \\mathbb{R}) \\to \\mathbb{R}^*$ shows $GL(2, \\mathbb{R})/SL(2, \\mathbb{R}) \\cong \\mathbb{R}^*$.",
    "若 $\\varphi: G \\to H$ 是同态，则 $G/\\ker\\varphi \\cong \\varphi(G)$，对应为 $g\\ker\\varphi \\mapsto \\varphi(g)$。要识别商群 $G/N$，可找一个从 $G$ 到已知群、核为 $N$ 的满同态；例如 $\\det: GL(2, \\mathbb{R}) \\to \\mathbb{R}^*$ 说明 $GL(2, \\mathbb{R})/SL(2, \\mathbb{R}) \\cong \\mathbb{R}^*$。",
  ),
  intro: t(
    "Reduction modulo $8$, $x \\mapsto x \\bmod 8$, is a homomorphism from $\\mathbb{Z}_{24}$ onto $\\mathbb{Z}_8$, because $8$ divides $24$. Its kernel is the elements that are multiples of $8$, $\\langle 8 \\rangle = \\{0, 8, 16\\}$. By the first isomorphism theorem, $\\mathbb{Z}_{24}/\\langle 8 \\rangle \\cong \\mathbb{Z}_8$, a group of $8$ elements.\n\nCheck: by Lagrange's theorem the quotient has $\\frac{24}{3} = 8$ elements, the cosets $0 + \\langle 8 \\rangle, 1 + \\langle 8 \\rangle, \\dots, 7 + \\langle 8 \\rangle$.\n\nIn this lesson we use the first isomorphism theorem to find the orders of quotients by kernels and to identify quotient groups.",
    "模 $8$ 约化 $x \\mapsto x \\bmod 8$ 是从 $\\mathbb{Z}_{24}$ 到 $\\mathbb{Z}_8$ 的满同态，因为 $8$ 整除 $24$。它的核是 $8$ 的倍数组成的 $\\langle 8 \\rangle = \\{0, 8, 16\\}$。由第一同构定理，$\\mathbb{Z}_{24}/\\langle 8 \\rangle \\cong \\mathbb{Z}_8$，是一个有 $8$ 个元素的群。\n\n检验：由拉格朗日定理，商群有 $\\frac{24}{3} = 8$ 个元素，即陪集 $0 + \\langle 8 \\rangle, 1 + \\langle 8 \\rangle, \\dots, 7 + \\langle 8 \\rangle$。\n\n本课我们用第一同构定理求对核的商群的阶，并识别商群。",
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
        "The first isomorphism theorem says the quotient by the kernel is isomorphic to the image, so its order is the size of the image. For $\\varphi: \\mathbb{Z}_4 \\times \\mathbb{Z}_{12} \\to \\mathbb{Z}_{12}$, $\\varphi(a, b) = 3b$, the image is $\\langle 3 \\rangle$ with $4$ elements, so $(\\mathbb{Z}_4 \\times \\mathbb{Z}_{12})/\\ker \\varphi \\cong \\mathbb{Z}_4$ has $4$ elements.\n\nCheck: the kernel is the pairs with $3b \\equiv 0 \\pmod{12}$, that is $\\mathbb{Z}_4 \\times \\langle 4 \\rangle$, with $4 \\cdot 3 = 12$ elements, and $\\frac{48}{12} = 4$.\n\n> **Watch out.** The order of the quotient is the size of the image, not of the kernel: the whole first factor $\\mathbb{Z}_4$ lies in the kernel, so it adds nothing to the quotient.",
        "第一同构定理说，商去核同构于像，所以它的阶就是像的大小。对 $\\varphi: \\mathbb{Z}_4 \\times \\mathbb{Z}_{12} \\to \\mathbb{Z}_{12}$，$\\varphi(a, b) = 3b$，像为 $\\langle 3 \\rangle$，有 $4$ 个元素，所以 $(\\mathbb{Z}_4 \\times \\mathbb{Z}_{12})/\\ker \\varphi \\cong \\mathbb{Z}_4$ 有 $4$ 个元素。\n\n检验：核是满足 $3b \\equiv 0 \\pmod{12}$ 的对，即 $\\mathbb{Z}_4 \\times \\langle 4 \\rangle$，有 $4 \\cdot 3 = 12$ 个元素，而 $\\frac{48}{12} = 4$。\n\n> **注意。** 商群的阶是像的大小，而不是核的大小：整个第一个因子 $\\mathbb{Z}_4$ 都在核中，对商群没有贡献。",
      ),
      generate(rng) {
        for (;;) {
          const m = rng.int(2, 9);
          const n = rng.int(6, 30);
          const k = rng.int(2, n - 1);
          const g = gcd(k, n);
          if (g === 1) continue;
          const value = additiveOrder(k, n);
          const mistakes = apart(value, [
            why(
              m * g,
              "That is the size of the kernel; the quotient by the kernel has the size of the image.",
              "那是核的大小；对核的商群的大小等于像的大小。",
            ),
            why(
              m * value,
              `That multiplies by $${m}$, but every $(a, 0)$ is in the kernel, so the first factor $${zTex(m)}$ adds nothing.`,
              `那乘上了 $${m}$，但每个 $(a, 0)$ 都在核中，所以第一个因子 $${zTex(m)}$ 没有贡献。`,
            ),
            why(
              g,
              `$\\gcd(${k}, ${n}) = ${g}$ generates the image, but the image has $\\frac{${n}}{${g}}$ elements.`,
              `$\\gcd(${k}, ${n}) = ${g}$ 生成像，但像有 $\\frac{${n}}{${g}}$ 个元素。`,
            ),
            why(
              n,
              `That is all of $${zTex(n)}$, but $\\varphi$ is onto only when $\\gcd(${k}, ${n}) = 1$.`,
              `那是整个 $${zTex(n)}$，但只有当 $\\gcd(${k}, ${n}) = 1$ 时 $\\varphi$ 才是满射。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
          return numberProblem({
            prompt: t(
              `Let $\\varphi: ${zTex(m)} \\times ${zTex(n)} \\to ${zTex(n)}$, $\\varphi(a, b) = ${k}b$. How many elements does $(${zTex(m)} \\times ${zTex(n)})/\\ker \\varphi$ have?`,
              `设 $\\varphi: ${zTex(m)} \\times ${zTex(n)} \\to ${zTex(n)}$，$\\varphi(a, b) = ${k}b$。$(${zTex(m)} \\times ${zTex(n)})/\\ker \\varphi$ 有多少个元素？`,
            ),
            answer: value,
            form: "integer",
            mistakes,
            solution: walked(
              [
                [
                  ["Apply the theorem", "用定理"],
                  t(
                    "By the first isomorphism theorem the quotient by the kernel is isomorphic to the image.",
                    "由第一同构定理，对核的商群同构于像。",
                  ),
                ],
                [
                  ["Find the image", "求像"],
                  t(
                    `The image is $\\langle ${k} \\rangle = \\langle ${g} \\rangle$ in $${zTex(n)}$, with $\\frac{${n}}{\\gcd(${k}, ${n})} = ${value}$ elements.`,
                    `像是 $${zTex(n)}$ 中的 $\\langle ${k} \\rangle = \\langle ${g} \\rangle$，有 $\\frac{${n}}{\\gcd(${k}, ${n})} = ${value}$ 个元素。`,
                  ),
                ],
              ],
              t(
                `The kernel is $${zTex(m)} \\times \\langle ${value} \\rangle$, with $${m} \\cdot ${g} = ${m * g}$ elements, and $\\frac{${m * n}}{${m * g}} = ${value}$.`,
                `核是 $${zTex(m)} \\times \\langle ${value} \\rangle$，有 $${m} \\cdot ${g} = ${m * g}$ 个元素，而 $\\frac{${m * n}}{${m * g}} = ${value}$。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "identifying-quotient-groups",
      figure: algebraDrawings2["the-first-isomorphism-theorem#identifying-quotient-groups"],
      title: t("Identifying quotient groups", "识别商群"),
      explanation: t(
        "To identify a quotient, find a surjective homomorphism whose kernel is the subgroup; the quotient is then isomorphic to the target. $\\mathbb{R}/\\mathbb{Z} \\cong \\{z \\in \\mathbb{C} : |z| = 1\\}$: the map $x \\mapsto e^{2\\pi i x}$ is a homomorphism from $\\mathbb{R}$ onto the circle with kernel $\\mathbb{Z}$.\n\nCheck: as drawn, $\\frac{1}{4}$ and $\\frac{5}{4}$ differ by the integer $1$, so they lie in the same coset of $\\mathbb{Z}$, and both land on $e^{\\pi i/2} = i$.\n\n> **Watch out.** The quotient is the target of the map, not the group you started from or the subgroup: $\\mathbb{R}/\\mathbb{Z}$ is neither $\\mathbb{R}$ nor $\\mathbb{Z}$. Make sure the map is onto and its kernel is exactly the subgroup.",
        "要确定一个商群，就找一个以该子群为核的满同态；这样商群就同构于目标群。$\\mathbb{R}/\\mathbb{Z} \\cong \\{z \\in \\mathbb{C} : |z| = 1\\}$：映射 $x \\mapsto e^{2\\pi i x}$ 是从 $\\mathbb{R}$ 到单位圆的满同态，核为 $\\mathbb{Z}$。\n\n检验：如图，$\\frac{1}{4}$ 与 $\\frac{5}{4}$ 相差整数 $1$，所以它们在 $\\mathbb{Z}$ 的同一个陪集中，并且都落在 $e^{\\pi i/2} = i$ 上。\n\n> **注意。** 商群是映射的目标群，而不是出发的群或那个子群：$\\mathbb{R}/\\mathbb{Z}$ 既不是 $\\mathbb{R}$ 也不是 $\\mathbb{Z}$。要确认映射是满射，并且核恰好是该子群。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const m = rng.int(2, 12);
        const N = rng.pick([12, 18, 20, 24, 30, 36]);
        const d = rng.pick(divisors(N).filter((x) => x > 1 && x < N));
        // Each case: the quotient, the group it is isomorphic to, the map in English and Chinese, and a check.
        const cases: [string, string, string, string, string, string][] = [
          [
            `S_{${n}}/A_{${n}}`,
            zTex(2),
            "the sign map $S_n \\to \\{\\pm 1\\}$",
            "符号映射 $S_n \\to \\{\\pm 1\\}$",
            `$A_{${n}}$ has half the $${n}!$ elements of $S_{${n}}$, so the quotient has $2$ elements.`,
            `$A_{${n}}$ 含 $S_{${n}}$ 的 $${n}!$ 个元素的一半，所以商群有 $2$ 个元素。`,
          ],
          [
            `D_{${n}}/\\langle r \\rangle`,
            zTex(2),
            "the map sending rotations to $0$ and reflections to $1$",
            "把旋转映为 $0$、反射映为 $1$ 的映射",
            `$D_{${n}}$ has $${2 * n}$ elements and $\\langle r \\rangle$ has $${n}$, so the quotient has $\\frac{${2 * n}}{${n}} = 2$ elements.`,
            `$D_{${n}}$ 有 $${2 * n}$ 个元素，$\\langle r \\rangle$ 有 $${n}$ 个，所以商群有 $\\frac{${2 * n}}{${n}} = 2$ 个元素。`,
          ],
          [
            "GL(2, \\mathbb{R})/SL(2, \\mathbb{R})",
            "\\mathbb{R}^*",
            "$\\det: GL(2, \\mathbb{R}) \\to \\mathbb{R}^*$",
            "$\\det: GL(2, \\mathbb{R}) \\to \\mathbb{R}^*$",
            "The diagonal matrix with entries $c$ and $1$ has determinant $c$, so every nonzero real is reached, and the matrices of determinant $1$ form $SL(2, \\mathbb{R})$.",
            "对角元为 $c$ 和 $1$ 的对角矩阵的行列式是 $c$，所以每个非零实数都能取到，而行列式为 $1$ 的矩阵组成 $SL(2, \\mathbb{R})$。",
          ],
          [
            "\\mathbb{R}^*/\\{\\pm 1\\}",
            POSITIVE_REALS,
            "$x \\mapsto |x|$",
            "$x \\mapsto |x|$",
            "Every positive real $r$ is $|r|$, and $|x| = 1$ exactly for $x = \\pm 1$.",
            "每个正实数 $r$ 都等于 $|r|$，而 $|x| = 1$ 当且仅当 $x = \\pm 1$。",
          ],
          [
            `\\mathbb{C}^*/${CIRCLE}`,
            POSITIVE_REALS,
            "$z \\mapsto |z|$",
            "$z \\mapsto |z|$",
            "Every positive real $r$ is $|r|$, and $|z| = 1$ exactly on the unit circle.",
            "每个正实数 $r$ 都等于 $|r|$，而 $|z| = 1$ 恰好在单位圆上。",
          ],
          [
            `\\mathbb{C}^*/${POSITIVE_REALS}`,
            CIRCLE,
            "$z \\mapsto \\frac{z}{|z|}$",
            "$z \\mapsto \\frac{z}{|z|}$",
            "A point $z$ of the circle is sent to itself, and $\\frac{z}{|z|} = 1$ exactly when $z$ is a positive real.",
            "单位圆上的点 $z$ 被送到它自己，而 $\\frac{z}{|z|} = 1$ 当且仅当 $z$ 是正实数。",
          ],
          [
            "\\mathbb{R}/\\mathbb{Z}",
            CIRCLE,
            "$x \\mapsto e^{2\\pi i x}$",
            "$x \\mapsto e^{2\\pi i x}$",
            "Every point of the circle is $e^{2\\pi i x}$ for some real $x$, and $e^{2\\pi i x} = 1$ exactly when $x$ is an integer.",
            "单位圆上的每个点都是某个实数 $x$ 的 $e^{2\\pi i x}$，而 $e^{2\\pi i x} = 1$ 当且仅当 $x$ 是整数。",
          ],
          [
            `\\mathbb{R}^*/${POSITIVE_REALS}`,
            zTex(2),
            "the map sending positive numbers to $0$ and negative numbers to $1$",
            "把正数映为 $0$、负数映为 $1$ 的映射",
            "A product of two numbers is negative exactly when one of them is, which matches adding in $\\mathbb{Z}_{2}$, and the positive numbers are the ones sent to $0$.",
            "两个数之积为负当且仅当恰有一个为负，这与 $\\mathbb{Z}_{2}$ 中的加法一致，而被送到 $0$ 的正是正数。",
          ],
          [
            `(${zTex(m)} \\times ${zTex(n)})/(${zTex(m)} \\times \\{0\\})`,
            zTex(n),
            "the projection $(a, b) \\mapsto b$",
            "投影 $(a, b) \\mapsto b$",
            `The quotient has $\\frac{${m * n}}{${m}} = ${n}$ elements, as $${zTex(n)}$ does.`,
            `商群有 $\\frac{${m * n}}{${m}} = ${n}$ 个元素，与 $${zTex(n)}$ 一样。`,
          ],
          [
            `${zTex(N)}/\\langle ${d} \\rangle`,
            zTex(d),
            `reduction modulo $${d}$`,
            `模 $${d}$ 约化`,
            `$\\langle ${d} \\rangle$ has $\\frac{${N}}{${d}} = ${N / d}$ elements, so the quotient has $\\frac{${N}}{${N / d}} = ${d}$, as $${zTex(d)}$ does.`,
            `$\\langle ${d} \\rangle$ 有 $\\frac{${N}}{${d}} = ${N / d}$ 个元素，所以商群有 $\\frac{${N}}{${N / d}} = ${d}$ 个，与 $${zTex(d)}$ 一样。`,
          ],
        ];
        const [q, right, en, zh, checkEn, checkZh] = rng.pick(cases);
        // ℝ is isomorphic to ℝ>0 by the exponential, so it is never offered against ℝ>0.
        const pool = [zTex(2), "\\mathbb{R}^*", POSITIVE_REALS, CIRCLE, zTex(n), zTex(m), "\\mathbb{R}", "\\mathbb{Z}"].filter(
          (x) => x !== right && !(right === POSITIVE_REALS && x === "\\mathbb{R}"),
        );
        const options = rng.shuffle(pool);
        const reasons = options.map((x): Reason => {
          const [cEn, cZh] = contrast(x, right);
          return [`$${x}$`, `The quotient is $${right}$, and ${cEn.charAt(0).toLowerCase()}${cEn.slice(1)}`, `商群是 $${right}$，而${cZh}`];
        });
        return reasoned(
          texChoice(
            rng,
            t(`Which group is $${q}$ isomorphic to?`, `$${q}$ 同构于哪个群？`),
            right,
            options,
            walked(
              [
                [
                  ["Find a map", "找映射"],
                  t(`${en.charAt(0).toUpperCase()}${en.slice(1)} is a homomorphism onto $${right}$.`, `${zh}是到 $${right}$ 的满同态。`),
                ],
                [["Check its kernel", "检查核"], t("Its kernel is exactly the subgroup being divided out.", "它的核恰好是被商掉的子群。")],
                [
                  ["Apply the theorem", "用定理"],
                  t(`By the first isomorphism theorem, $${q} \\cong ${right}$.`, `由第一同构定理，$${q} \\cong ${right}$。`),
                ],
              ],
              t(checkEn, checkZh),
            ),
          ),
          reasons,
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
  intro: t(
    "In $\\mathbb{Z}$, take $H = 6\\mathbb{Z}$ and $K = 9\\mathbb{Z}$. Their sum is $6\\mathbb{Z} + 9\\mathbb{Z} = \\gcd(6, 9)\\mathbb{Z} = 3\\mathbb{Z}$, and their intersection is $6\\mathbb{Z} \\cap 9\\mathbb{Z} = \\operatorname{lcm}(6, 9)\\mathbb{Z} = 18\\mathbb{Z}$. The theorem says $(H + K)/K = 3\\mathbb{Z}/9\\mathbb{Z}$ is isomorphic to $H/(H \\cap K) = 6\\mathbb{Z}/18\\mathbb{Z}$.\n\nCheck: $3\\mathbb{Z}/9\\mathbb{Z}$ has the $\\frac{9}{3} = 3$ cosets of $0, 3, 6$, and $6\\mathbb{Z}/18\\mathbb{Z}$ has the $\\frac{18}{6} = 3$ cosets of $0, 6, 12$, the same number.\n\nIn this lesson we use $HK/K \\cong H/(H \\cap K)$ in the integers and to find the sizes of sums of subgroups.",
    "在 $\\mathbb{Z}$ 中取 $H = 6\\mathbb{Z}$，$K = 9\\mathbb{Z}$。它们的和是 $6\\mathbb{Z} + 9\\mathbb{Z} = \\gcd(6, 9)\\mathbb{Z} = 3\\mathbb{Z}$，交是 $6\\mathbb{Z} \\cap 9\\mathbb{Z} = \\operatorname{lcm}(6, 9)\\mathbb{Z} = 18\\mathbb{Z}$。定理说 $(H + K)/K = 3\\mathbb{Z}/9\\mathbb{Z}$ 同构于 $H/(H \\cap K) = 6\\mathbb{Z}/18\\mathbb{Z}$。\n\n检验：$3\\mathbb{Z}/9\\mathbb{Z}$ 有 $0, 3, 6$ 的 $\\frac{9}{3} = 3$ 个陪集，$6\\mathbb{Z}/18\\mathbb{Z}$ 有 $0, 6, 12$ 的 $\\frac{18}{6} = 3$ 个陪集，个数相同。\n\n本课我们在整数中使用 $HK/K \\cong H/(H \\cap K)$，并用它求子群之和的大小。",
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
        "The second isomorphism theorem matches the quotient of a sum by one subgroup with the quotient of the other by the intersection. $(6\\mathbb{Z} + 4\\mathbb{Z})/4\\mathbb{Z} = 2\\mathbb{Z}/4\\mathbb{Z}$ has $2$ elements, and $6\\mathbb{Z}/(6\\mathbb{Z} \\cap 4\\mathbb{Z}) = 6\\mathbb{Z}/12\\mathbb{Z}$ also has $2$.\n\nCheck: $2\\mathbb{Z}/4\\mathbb{Z}$ is the cosets of $0$ and $2$, and $6\\mathbb{Z}/12\\mathbb{Z}$ is the cosets of $0$ and $6$: two each, as the theorem says.\n\n> **Watch out.** The sum $a\\mathbb{Z} + b\\mathbb{Z}$ is $\\gcd(a, b)\\mathbb{Z}$ and the intersection is $\\operatorname{lcm}(a, b)\\mathbb{Z}$, not the other way round: the sum is the larger subgroup.",
        "第二同构定理把和对其中一个子群的商，与另一个子群对交的商对应起来。$(6\\mathbb{Z} + 4\\mathbb{Z})/4\\mathbb{Z} = 2\\mathbb{Z}/4\\mathbb{Z}$ 有 $2$ 个元素，$6\\mathbb{Z}/(6\\mathbb{Z} \\cap 4\\mathbb{Z}) = 6\\mathbb{Z}/12\\mathbb{Z}$ 也有 $2$ 个。\n\n检验：$2\\mathbb{Z}/4\\mathbb{Z}$ 是 $0$ 与 $2$ 的陪集，$6\\mathbb{Z}/12\\mathbb{Z}$ 是 $0$ 与 $6$ 的陪集：各有两个，与定理一致。\n\n> **注意。** 和 $a\\mathbb{Z} + b\\mathbb{Z}$ 是 $\\gcd(a, b)\\mathbb{Z}$，交是 $\\operatorname{lcm}(a, b)\\mathbb{Z}$，不要弄反：和是较大的那个子群。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(2, 40);
          const b = rng.int(2, 40);
          if (a % b === 0 || b % a === 0 || gcd(a, b) === 1) continue;
          const g = gcd(a, b);
          const l = lcm(a, b);
          const value = b / g;
          const ask = rng.bool();
          const mistakes = apart(value, [
            why(
              a / g,
              ask
                ? `That is $\\frac{${a}}{${g}}$, the size of $(${a}\\mathbb{Z} + ${b}\\mathbb{Z})/${a}\\mathbb{Z}$; here the quotient is by $${b}\\mathbb{Z}$.`
                : `That is $\\frac{${l}}{${b}}$, the size of $${b}\\mathbb{Z}/(${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z})$; here the subgroup on top is $${a}\\mathbb{Z}$.`,
              ask
                ? `那是 $\\frac{${a}}{${g}}$，即 $(${a}\\mathbb{Z} + ${b}\\mathbb{Z})/${a}\\mathbb{Z}$ 的大小；这里是对 $${b}\\mathbb{Z}$ 取商。`
                : `那是 $\\frac{${l}}{${b}}$，即 $${b}\\mathbb{Z}/(${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z})$ 的大小；这里上面的子群是 $${a}\\mathbb{Z}$。`,
            ),
            why(
              g,
              ask
                ? `$${g}\\mathbb{Z}$ is the sum, but the question asks for the number of its cosets of $${b}\\mathbb{Z}$.`
                : `$${g} = \\gcd(${a}, ${b})$ gives the sum, not the intersection; the intersection is $${l}\\mathbb{Z}$.`,
              ask
                ? `$${g}\\mathbb{Z}$ 是和，但题目问的是它模 $${b}\\mathbb{Z}$ 的陪集个数。`
                : `$${g} = \\gcd(${a}, ${b})$ 给出的是和而不是交；交是 $${l}\\mathbb{Z}$。`,
            ),
            why(
              b,
              `That is the size of $\\mathbb{Z}/${b}\\mathbb{Z}$, which counts every integer, not just the multiples of $${ask ? g : a}$.`,
              `那是 $\\mathbb{Z}/${b}\\mathbb{Z}$ 的大小，它数的是所有整数，而不只是 $${ask ? g : a}$ 的倍数。`,
            ),
            why(
              a,
              `That is the size of $\\mathbb{Z}/${a}\\mathbb{Z}$, which is a different quotient.`,
              `那是 $\\mathbb{Z}/${a}\\mathbb{Z}$ 的大小，那是另一个商群。`,
            ),
          ]);
          if (mistakes.length < 2) continue;
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
            form: "integer",
            mistakes,
            solution: ask
              ? walked(
                  [
                    [
                      ["Find the sum", "求和"],
                      t(
                        `$${a}\\mathbb{Z} + ${b}\\mathbb{Z} = \\gcd(${a}, ${b})\\mathbb{Z} = ${g}\\mathbb{Z}$.`,
                        `$${a}\\mathbb{Z} + ${b}\\mathbb{Z} = \\gcd(${a}, ${b})\\mathbb{Z} = ${g}\\mathbb{Z}$。`,
                      ),
                    ],
                    [
                      ["Count the cosets", "数陪集"],
                      t(
                        `$${g}\\mathbb{Z}/${b}\\mathbb{Z}$ has $\\frac{${b}}{${g}} = ${value}$ elements.`,
                        `$${g}\\mathbb{Z}/${b}\\mathbb{Z}$ 有 $\\frac{${b}}{${g}} = ${value}$ 个元素。`,
                      ),
                    ],
                  ],
                  t(
                    `By the theorem this matches $${a}\\mathbb{Z}/(${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z}) = ${a}\\mathbb{Z}/${l}\\mathbb{Z}$, which has $\\frac{${l}}{${a}} = ${value}$ elements too.`,
                    `由定理，这与 $${a}\\mathbb{Z}/(${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z}) = ${a}\\mathbb{Z}/${l}\\mathbb{Z}$ 对应，它也有 $\\frac{${l}}{${a}} = ${value}$ 个元素。`,
                  ),
                )
              : walked(
                  [
                    [
                      ["Find the intersection", "求交"],
                      t(
                        `$${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z} = \\operatorname{lcm}(${a}, ${b})\\mathbb{Z} = ${l}\\mathbb{Z}$.`,
                        `$${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z} = \\operatorname{lcm}(${a}, ${b})\\mathbb{Z} = ${l}\\mathbb{Z}$。`,
                      ),
                    ],
                    [
                      ["Count the cosets", "数陪集"],
                      t(
                        `$${a}\\mathbb{Z}/${l}\\mathbb{Z}$ has $\\frac{${l}}{${a}} = ${value}$ elements.`,
                        `$${a}\\mathbb{Z}/${l}\\mathbb{Z}$ 有 $\\frac{${l}}{${a}} = ${value}$ 个元素。`,
                      ),
                    ],
                  ],
                  t(
                    `By the theorem this matches $(${a}\\mathbb{Z} + ${b}\\mathbb{Z})/${b}\\mathbb{Z} = ${g}\\mathbb{Z}/${b}\\mathbb{Z}$, which has $\\frac{${b}}{${g}} = ${value}$ elements too.`,
                    `由定理，这与 $(${a}\\mathbb{Z} + ${b}\\mathbb{Z})/${b}\\mathbb{Z} = ${g}\\mathbb{Z}/${b}\\mathbb{Z}$ 对应，它也有 $\\frac{${b}}{${g}} = ${value}$ 个元素。`,
                  ),
                ),
          });
        }
      },
    },
    {
      id: "sizes-of-sums-of-subgroups",
      title: t("Sizes of H + K", "H + K 的大小"),
      explanation: t(
        "The size of a sum of subgroups is the product of their sizes divided by the size of their intersection, which corrects for double counting. In $\\mathbb{Z}_{24}$, $H = \\langle 4 \\rangle$ has $6$ elements, $K = \\langle 6 \\rangle$ has $4$, and $H \\cap K$ has $2$, so $|H + K| = \\frac{6 \\cdot 4}{2} = 12$.\n\nCheck: $H + K = \\langle \\gcd(4, 6) \\rangle = \\langle 2 \\rangle$, the even residues, of which there are $\\frac{24}{2} = 12$.\n\n> **Watch out.** Do not just multiply or add the sizes: $H$ and $K$ share $H \\cap K = \\{0, 12\\}$, so $6 \\cdot 4 = 24$ counts each element of $H + K$ twice.",
        "子群之和的大小等于它们大小的乘积除以交的大小，这修正了重复计数。在 $\\mathbb{Z}_{24}$ 中，$H = \\langle 4 \\rangle$ 有 $6$ 个元素，$K = \\langle 6 \\rangle$ 有 $4$ 个，$H \\cap K$ 有 $2$ 个，所以 $|H + K| = \\frac{6 \\cdot 4}{2} = 12$。\n\n检验：$H + K = \\langle \\gcd(4, 6) \\rangle = \\langle 2 \\rangle$，即偶数剩余类，共 $\\frac{24}{2} = 12$ 个。\n\n> **注意。** 不要直接把大小相乘或相加：$H$ 与 $K$ 有公共部分 $H \\cap K = \\{0, 12\\}$，所以 $6 \\cdot 4 = 24$ 把 $H + K$ 的每个元素数了两次。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.pick([24, 30, 36, 40, 48, 60, 72, 84, 90, 120]);
          const a = rng.int(2, n - 1);
          const b = rng.int(2, n - 1);
          const h = additiveOrder(a, n);
          const k = additiveOrder(b, n);
          if (gcd(h, k) === 1 || h % k === 0 || k % h === 0) continue;
          const i = gcd(h, k);
          const value = (h * k) / i;
          const mistakes = apart(value, [
            why(
              h * k,
              `That multiplies the sizes, but $H$ and $K$ share $${i}$ elements, so divide by $|H \\cap K| = ${i}$.`,
              `那是把大小相乘，但 $H$ 与 $K$ 有 $${i}$ 个公共元素，所以要除以 $|H \\cap K| = ${i}$。`,
            ),
            why(
              h + k,
              "That adds the sizes, but $H + K$ holds all the sums $x + y$, not just the elements of $H$ and of $K$.",
              "那是把大小相加，但 $H + K$ 包含所有的和 $x + y$，而不只是 $H$ 和 $K$ 的元素。",
            ),
            why(
              i,
              "That is the size of $H \\cap K$; the sum is larger than either subgroup.",
              "那是 $H \\cap K$ 的大小；和比每个子群都大。",
            ),
            why(
              Math.max(h, k),
              "That is the larger of $H$ and $K$, but neither contains the other, so $H + K$ is larger still.",
              "那是 $H$ 与 $K$ 中较大的一个，但它们互不包含，所以 $H + K$ 还要更大。",
            ),
          ]).filter((x) => (x.value as number) <= n);
          if (mistakes.length < 2) continue;
          const all = gcd(gcd(a, b), n);
          return numberProblem({
            prompt: t(
              `In $${zTex(n)}$, let $H = \\langle ${a} \\rangle$ and $K = \\langle ${b} \\rangle$. How many elements does $H + K$ have?`,
              `在 $${zTex(n)}$ 中，设 $H = \\langle ${a} \\rangle$，$K = \\langle ${b} \\rangle$。$H + K$ 有多少个元素？`,
            ),
            answer: value,
            form: "integer",
            mistakes,
            solution: walked(
              [
                [
                  ["Find the sizes", "求大小"],
                  t(
                    `$|H| = \\frac{${n}}{\\gcd(${a}, ${n})} = ${h}$ and $|K| = \\frac{${n}}{\\gcd(${b}, ${n})} = ${k}$.`,
                    `$|H| = \\frac{${n}}{\\gcd(${a}, ${n})} = ${h}$，$|K| = \\frac{${n}}{\\gcd(${b}, ${n})} = ${k}$。`,
                  ),
                ],
                [
                  ["Find the intersection", "求交"],
                  t(
                    `In a cyclic group there is one subgroup of each order, so $H \\cap K$ has $\\gcd(${h}, ${k}) = ${i}$ elements.`,
                    `循环群中每个阶恰有一个子群，所以 $H \\cap K$ 有 $\\gcd(${h}, ${k}) = ${i}$ 个元素。`,
                  ),
                ],
                [
                  ["Divide", "相除"],
                  t(`$|H + K| = \\frac{${h} \\cdot ${k}}{${i}} = ${value}$.`, `$|H + K| = \\frac{${h} \\cdot ${k}}{${i}} = ${value}$。`),
                ],
              ],
              t(
                `$H + K = \\langle \\gcd(${a}, ${b}, ${n}) \\rangle = \\langle ${all} \\rangle$, which has $${all === 1 ? "" : `\\frac{${n}}{${all}} = `}${value}$ elements.`,
                `$H + K = \\langle \\gcd(${a}, ${b}, ${n}) \\rangle = \\langle ${all} \\rangle$，有 $${all === 1 ? "" : `\\frac{${n}}{${all}} = `}${value}$ 个元素。`,
              ),
            ),
          });
        }
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
  intro: t(
    "Since $24\\mathbb{Z} \\le 6\\mathbb{Z} \\le \\mathbb{Z}$, the third isomorphism theorem lets the $24\\mathbb{Z}$ cancel: $(\\mathbb{Z}/24\\mathbb{Z})/(6\\mathbb{Z}/24\\mathbb{Z}) \\cong \\mathbb{Z}/6\\mathbb{Z}$, a group of $6$ elements.\n\nCheck: $\\mathbb{Z}/24\\mathbb{Z}$ has $24$ elements and $6\\mathbb{Z}/24\\mathbb{Z}$ has the $\\frac{24}{6} = 4$ cosets of $0, 6, 12, 18$, so the quotient has $\\frac{24}{4} = 6$ elements, as $\\mathbb{Z}/6\\mathbb{Z}$ does.\n\nIn this lesson we cancel the common subgroup in a quotient of quotients, in the integers and in $\\mathbb{Z}_n$.",
    "由于 $24\\mathbb{Z} \\le 6\\mathbb{Z} \\le \\mathbb{Z}$，第三同构定理让 $24\\mathbb{Z}$ 约去：$(\\mathbb{Z}/24\\mathbb{Z})/(6\\mathbb{Z}/24\\mathbb{Z}) \\cong \\mathbb{Z}/6\\mathbb{Z}$，是一个有 $6$ 个元素的群。\n\n检验：$\\mathbb{Z}/24\\mathbb{Z}$ 有 $24$ 个元素，$6\\mathbb{Z}/24\\mathbb{Z}$ 有 $0, 6, 12, 18$ 的 $\\frac{24}{6} = 4$ 个陪集，所以商群有 $\\frac{24}{4} = 6$ 个元素，与 $\\mathbb{Z}/6\\mathbb{Z}$ 一样。\n\n本课我们在整数和 $\\mathbb{Z}_n$ 中，把商的商里共同的子群约去。",
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
        "The third isomorphism theorem says a quotient of quotients cancels the common subgroup, like cancelling in a fraction. $12\\mathbb{Z} \\le 3\\mathbb{Z}$, so $(\\mathbb{Z}/12\\mathbb{Z})/(3\\mathbb{Z}/12\\mathbb{Z}) \\cong \\mathbb{Z}/3\\mathbb{Z}$, with $3$ elements.\n\nCheck: $3\\mathbb{Z}/12\\mathbb{Z}$ is the $\\frac{12}{3} = 4$ cosets of $0, 3, 6, 9$, and $\\frac{12}{4} = 3$.\n\n> **Watch out.** The answer is $3$, from $\\mathbb{Z}/3\\mathbb{Z}$, not $4$: the $4$ is the size of the subgroup $3\\mathbb{Z}/12\\mathbb{Z}$ that is divided out.",
        "第三同构定理说，商的商可以把共同的子群约去，就像分数约分一样。$12\\mathbb{Z} \\le 3\\mathbb{Z}$，所以 $(\\mathbb{Z}/12\\mathbb{Z})/(3\\mathbb{Z}/12\\mathbb{Z}) \\cong \\mathbb{Z}/3\\mathbb{Z}$，有 $3$ 个元素。\n\n检验：$3\\mathbb{Z}/12\\mathbb{Z}$ 是 $0, 3, 6, 9$ 的 $\\frac{12}{3} = 4$ 个陪集，而 $\\frac{12}{4} = 3$。\n\n> **注意。** 答案是来自 $\\mathbb{Z}/3\\mathbb{Z}$ 的 $3$，而不是 $4$：$4$ 是被商掉的子群 $3\\mathbb{Z}/12\\mathbb{Z}$ 的大小。",
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
        const answer = ask ? b : c;
        const mistakes = apart(answer, [
          ask
            ? why(
                c,
                `That is the size of $${b}\\mathbb{Z}/${a}\\mathbb{Z}$, the subgroup being divided out, not of the quotient.`,
                `那是被商掉的子群 $${b}\\mathbb{Z}/${a}\\mathbb{Z}$ 的大小，而不是商群的大小。`,
              )
            : why(
                b,
                `That is the size of $\\mathbb{Z}/${b}\\mathbb{Z}$; the cosets here are of multiples of $${b}$ only.`,
                `那是 $\\mathbb{Z}/${b}\\mathbb{Z}$ 的大小；这里的陪集只来自 $${b}$ 的倍数。`,
              ),
          why(
            a,
            ask
              ? `That is the size of $\\mathbb{Z}/${a}\\mathbb{Z}$, before dividing by $${b}\\mathbb{Z}/${a}\\mathbb{Z}$.`
              : `That is the size of $\\mathbb{Z}/${a}\\mathbb{Z}$, which counts every integer modulo ${a}, not only the multiples of $${b}$.`,
            ask
              ? `那是 $\\mathbb{Z}/${a}\\mathbb{Z}$ 的大小，还没有除以 $${b}\\mathbb{Z}/${a}\\mathbb{Z}$。`
              : `那是 $\\mathbb{Z}/${a}\\mathbb{Z}$ 的大小，它数的是模 ${a} 的所有整数，而不只是 $${b}$ 的倍数。`,
          ),
        ]);
        return numberProblem({
          prompt: ask
            ? t(
                `How many elements does $(\\mathbb{Z}/${a}\\mathbb{Z})/(${b}\\mathbb{Z}/${a}\\mathbb{Z})$ have?`,
                `$(\\mathbb{Z}/${a}\\mathbb{Z})/(${b}\\mathbb{Z}/${a}\\mathbb{Z})$ 有多少个元素？`,
              )
            : t(`How many elements does $${b}\\mathbb{Z}/${a}\\mathbb{Z}$ have?`, `$${b}\\mathbb{Z}/${a}\\mathbb{Z}$ 有多少个元素？`),
          answer,
          form: "integer",
          mistakes,
          solution: ask
            ? walked(
                [
                  [
                    ["Check the chain", "检查包含关系"],
                    t(
                      `$${b}$ divides $${a}$, so $${a}\\mathbb{Z} \\le ${b}\\mathbb{Z} \\le \\mathbb{Z}$.`,
                      `$${b}$ 整除 $${a}$，所以 $${a}\\mathbb{Z} \\le ${b}\\mathbb{Z} \\le \\mathbb{Z}$。`,
                    ),
                  ],
                  [
                    ["Cancel", "约去"],
                    t(
                      `By the third isomorphism theorem the quotient is $\\mathbb{Z}/${b}\\mathbb{Z}$, with $${b}$ elements.`,
                      `由第三同构定理，商群为 $\\mathbb{Z}/${b}\\mathbb{Z}$，有 $${b}$ 个元素。`,
                    ),
                  ],
                ],
                t(
                  `$\\mathbb{Z}/${a}\\mathbb{Z}$ has $${a}$ elements and $${b}\\mathbb{Z}/${a}\\mathbb{Z}$ has $\\frac{${a}}{${b}} = ${c}$, and $\\frac{${a}}{${c}} = ${b}$.`,
                  `$\\mathbb{Z}/${a}\\mathbb{Z}$ 有 $${a}$ 个元素，$${b}\\mathbb{Z}/${a}\\mathbb{Z}$ 有 $\\frac{${a}}{${b}} = ${c}$ 个，而 $\\frac{${a}}{${c}} = ${b}$。`,
                ),
              )
            : walked(
                [
                  [
                    ["List the cosets", "列出陪集"],
                    t(
                      `The cosets are $${b} \\cdot j + ${a}\\mathbb{Z}$ for $j = 0, \\dots, ${c - 1}$.`,
                      `陪集为 $${b} \\cdot j + ${a}\\mathbb{Z}$，$j = 0, \\dots, ${c - 1}$。`,
                    ),
                  ],
                  [["Count", "计数"], t(`That is $\\frac{${a}}{${b}} = ${c}$ elements.`, `共 $\\frac{${a}}{${b}} = ${c}$ 个元素。`)],
                ],
                t(
                  `$|\\mathbb{Z}/${a}\\mathbb{Z}| = |\\mathbb{Z}/${b}\\mathbb{Z}| \\cdot |${b}\\mathbb{Z}/${a}\\mathbb{Z}|$: $${a} = ${b} \\cdot ${c}$.`,
                  `$|\\mathbb{Z}/${a}\\mathbb{Z}| = |\\mathbb{Z}/${b}\\mathbb{Z}| \\cdot |${b}\\mathbb{Z}/${a}\\mathbb{Z}|$：$${a} = ${b} \\cdot ${c}$。`,
                ),
              ),
        });
      },
    },
    {
      id: "the-third-isomorphism-theorem-in-zn",
      title: t("In $\\mathbb{Z}_n$", "在 $\\mathbb{Z}_n$ 中"),
      explanation: t(
        "Find each subgroup's generator by the gcd with the modulus, then the quotient of quotients is isomorphic to the group modulo the larger subgroup. In $\\mathbb{Z}_{24}$, $N = \\langle 16 \\rangle = \\langle 8 \\rangle$ lies in $K = \\langle 10 \\rangle = \\langle 2 \\rangle$, so $(\\mathbb{Z}_{24}/N)/(K/N) \\cong \\mathbb{Z}_{24}/\\langle 2 \\rangle \\cong \\mathbb{Z}_2$.\n\nCheck: $\\mathbb{Z}_{24}/N$ has $8$ elements and $K/N$ has $\\frac{12}{3} = 4$, so the quotient has $\\frac{8}{4} = 2$.\n\n> **Watch out.** Use $K$, the larger subgroup, and remember that $\\mathbb{Z}_n/\\langle d \\rangle \\cong \\mathbb{Z}_d$ for a divisor $d$ of $n$, not $\\mathbb{Z}_{n/d}$: here $\\mathbb{Z}_2$, not $\\mathbb{Z}_{12}$.",
        "用与模的最大公因数求出每个子群的生成元，于是商的商同构于群模较大的那个子群。在 $\\mathbb{Z}_{24}$ 中，$N = \\langle 16 \\rangle = \\langle 8 \\rangle$ 包含于 $K = \\langle 10 \\rangle = \\langle 2 \\rangle$，所以 $(\\mathbb{Z}_{24}/N)/(K/N) \\cong \\mathbb{Z}_{24}/\\langle 2 \\rangle \\cong \\mathbb{Z}_2$。\n\n检验：$\\mathbb{Z}_{24}/N$ 有 $8$ 个元素，$K/N$ 有 $\\frac{12}{3} = 4$ 个，所以商群有 $\\frac{8}{4} = 2$ 个元素。\n\n> **注意。** 要用较大的子群 $K$，并记住对 $n$ 的因数 $d$ 有 $\\mathbb{Z}_n/\\langle d \\rangle \\cong \\mathbb{Z}_d$，而不是 $\\mathbb{Z}_{n/d}$：这里是 $\\mathbb{Z}_2$，不是 $\\mathbb{Z}_{12}$。",
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
        const reasons: Reason[] = [
          [
            `$${zTex(d2)}$`,
            `That is $${zTex(n)}/N$ alone, using $N = \\langle ${d2} \\rangle$; the quotient by $K/N$ leaves $${zTex(n)}/K$.`,
            `那只是 $${zTex(n)}/N$，用的是 $N = \\langle ${d2} \\rangle$；再对 $K/N$ 取商，剩下的是 $${zTex(n)}/K$。`,
          ],
          [
            `$${zTex(d2 / d1)}$`,
            `That is $K/N$, with $\\frac{${d2}}{${d1}} = ${d2 / d1}$ elements, the subgroup being divided out.`,
            `那是被商掉的子群 $K/N$，有 $\\frac{${d2}}{${d1}} = ${d2 / d1}$ 个元素。`,
          ],
          [
            `$${zTex(n / d1)}$`,
            `That is $K = \\langle ${d1} \\rangle$ itself, with $\\frac{${n}}{${d1}} = ${n / d1}$ elements; the quotient $${zTex(n)}/K$ has $${d1}$.`,
            `那是 $K = \\langle ${d1} \\rangle$ 本身，有 $\\frac{${n}}{${d1}} = ${n / d1}$ 个元素；商群 $${zTex(n)}/K$ 有 $${d1}$ 个。`,
          ],
          [
            `$${zTex(n / d2)}$`,
            `That is $N = \\langle ${d2} \\rangle$ itself, with $\\frac{${n}}{${d2}} = ${n / d2}$ elements.`,
            `那是 $N = \\langle ${d2} \\rangle$ 本身，有 $\\frac{${n}}{${d2}} = ${n / d2}$ 个元素。`,
          ],
        ];
        return reasoned(
          texChoice(
            rng,
            t(
              `In $${zTex(n)}$, let $N = \\langle ${a} \\rangle$ and $K = \\langle ${b} \\rangle$, so $N \\le K$. Which group is $(${zTex(n)}/N)/(K/N)$ isomorphic to?`,
              `在 $${zTex(n)}$ 中，设 $N = \\langle ${a} \\rangle$，$K = \\langle ${b} \\rangle$，则 $N \\le K$。$(${zTex(n)}/N)/(K/N)$ 同构于哪个群？`,
            ),
            zTex(d1),
            [zTex(d2), zTex(d2 / d1), zTex(n / d1), zTex(n / d2)],
            walked(
              [
                [
                  ["Simplify the generators", "化简生成元"],
                  t(
                    `$\\gcd(${a}, ${n}) = ${d2}$ and $\\gcd(${b}, ${n}) = ${d1}$, so $N = \\langle ${d2} \\rangle$ and $K = \\langle ${d1} \\rangle$.`,
                    `$\\gcd(${a}, ${n}) = ${d2}$，$\\gcd(${b}, ${n}) = ${d1}$，所以 $N = \\langle ${d2} \\rangle$，$K = \\langle ${d1} \\rangle$。`,
                  ),
                ],
                [
                  ["Cancel N", "约去 N"],
                  t(
                    `By the third isomorphism theorem the quotient is $${zTex(n)}/K = ${zTex(n)}/\\langle ${d1} \\rangle \\cong ${zTex(d1)}$.`,
                    `由第三同构定理，商群为 $${zTex(n)}/K = ${zTex(n)}/\\langle ${d1} \\rangle \\cong ${zTex(d1)}$。`,
                  ),
                ],
              ],
              t(
                `$${zTex(n)}/N$ has $${d2}$ elements and $K/N$ has $\\frac{${d2}}{${d1}} = ${d2 / d1}$, and $\\frac{${d2}}{${d2 / d1}} = ${d1}$.`,
                `$${zTex(n)}/N$ 有 $${d2}$ 个元素，$K/N$ 有 $\\frac{${d2}}{${d1}} = ${d2 / d1}$ 个，而 $\\frac{${d2}}{${d2 / d1}} = ${d1}$。`,
              ),
            ),
          ),
          reasons,
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
