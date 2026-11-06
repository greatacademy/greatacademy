import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { algebraDrawings2 } from "../explanation-drawings-abstract-algebra-2.ts";

import { article, numberProblem } from "../problems.ts";
import {
  divisors,
  type Fact,
  factProblem,
  gcd,
  lcm,
  mod,
  modInverse,
  multiplicativeOrder,
  phi,
  texChoice,
  units,
} from "./abstract-algebra-common.ts";
import { type Mat2, mat2Tex, mul2 } from "./abstract-algebra-groups.ts";
import { composePerm, cyclePerm, invertPerm, type Perm, permCycleTex } from "./abstract-algebra-permutations.ts";
import { range } from "./methods-of-proof-common.ts";

// Abstract Algebra unit 4: direct products, cosets, normal subgroups and quotient groups.

/** additiveOrder is the order of a in ℤₙ. */
const additiveOrder = (a: number, n: number) => n / gcd(a, n);

/** factorize lists the prime factorization of n as [prime, exponent] pairs. */
function factorize(n: number): [number, number][] {
  const out: [number, number][] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    let e = 0;
    while (m % p === 0) {
      m /= p;
      e++;
    }
    if (e > 0) out.push([p, e]);
  }
  if (m > 1) out.push([m, 1]);
  return out;
}

/** elementaryDivisors lists the prime powers in the decomposition of ℤ_{a₁} × ⋯ × ℤ_{aₖ}, sorted. */
const elementaryDivisors = (ns: readonly number[]) => ns.flatMap((n) => factorize(n).map(([p, e]) => p ** e)).sort((x, y) => x - y);

/** PARTITIONS are the numbers of partitions of 0, 1, …, 6. */
const PARTITIONS = [1, 1, 2, 3, 5, 7, 11];

/** zTex writes ℤₙ. */
const zTex = (n: number) => `\\mathbb{Z}_{${n}}`;

/** pairTex writes an ordered pair. */
const pairTex = (a: number | string, b: number | string) => `(${a}, ${b})`;

/** externalDirectProducts finds orders and inverses in direct products. */
export const externalDirectProducts: TopicDef = {
  id: "external-direct-products",
  title: t("External Direct Products", "外直积"),
  summary: t(
    "The direct product G × H of two groups is the set of pairs (g, h) with the operation done in each coordinate: (g, h)(g′, h′) = (gg′, hh′). Its identity is (e, e), the inverse of (g, h) is (g⁻¹, h⁻¹), |G × H| = |G||H|, and the order of (g, h) is the lcm of the orders of g and h.",
    "两个群的直积 G × H 是有序对 (g, h) 的集合，运算按坐标分别进行：(g, h)(g′, h′) = (gg′, hh′)。它的单位元为 (e, e)，(g, h) 的逆为 (g⁻¹, h⁻¹)，|G × H| = |G||H|，(g, h) 的阶是 g 与 h 的阶的最小公倍数。",
  ),
  prerequisites: ["general-groups", "cyclic-subgroups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orders-of-elements-of-direct-products",
      title: t("Orders of elements", "元素的阶"),
      explanation: t(
        "An element of a direct product returns to the identity only when every coordinate does, so its order is the least common multiple of their orders. In $\\mathbb{Z}_{12} \\times \\mathbb{Z}_{18}$, $8$ has order $3$ in $\\mathbb{Z}_{12}$ and $4$ has order $9$ in $\\mathbb{Z}_{18}$, so $(8, 4)$ has order $\\operatorname{lcm}(3, 9) = 9$.",
        "直积中的元素只有在每个坐标都回到单位元时才回到单位元，所以它的阶是各坐标阶的最小公倍数。在 $\\mathbb{Z}_{12} \\times \\mathbb{Z}_{18}$ 中，$8$ 在 $\\mathbb{Z}_{12}$ 中的阶为 $3$，$4$ 在 $\\mathbb{Z}_{18}$ 中的阶为 $9$，所以 $(8, 4)$ 的阶为 $\\operatorname{lcm}(3, 9) = 9$。",
      ),
      generate(rng) {
        const m = rng.int(4, 24);
        const n = rng.int(4, 24);
        const a = rng.int(1, m - 1);
        const b = rng.int(1, n - 1);
        const [oa, ob] = [additiveOrder(a, m), additiveOrder(b, n)];
        const value = lcm(oa, ob);
        return numberProblem({
          prompt: t(
            `Find the order of $${pairTex(a, b)}$ in $${zTex(m)} \\times ${zTex(n)}$.`,
            `求 $${pairTex(a, b)}$ 在 $${zTex(m)} \\times ${zTex(n)}$ 中的阶。`,
          ),
          answer: value,
          wrong: [oa * ob, lcm(m, n), Math.max(oa, ob), m * n],
          solution: t(
            `$${a}$ has order $${oa}$ in $${zTex(m)}$ and $${b}$ has order $${ob}$ in $${zTex(n)}$, so the order is $\\operatorname{lcm}(${oa}, ${ob}) = ${value}$.`,
            `$${a}$ 在 $${zTex(m)}$ 中的阶为 $${oa}$，$${b}$ 在 $${zTex(n)}$ 中的阶为 $${ob}$，所以阶为 $\\operatorname{lcm}(${oa}, ${ob}) = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "inverses-in-direct-products",
      title: t("Inverses in direct products", "直积中的逆"),
      explanation: t(
        "The operation in a direct product acts coordinate by coordinate, so the inverse takes the inverse in each coordinate's own group. Invert in each coordinate with that coordinate's operation. In $U(10) \\times \\mathbb{Z}_8$, the inverse of $(3, 5)$ is $(7, 3)$: $3 \\cdot 7 \\equiv 1 \\pmod{10}$ and $5 + 3 \\equiv 0 \\pmod 8$.",
        "直积中的运算逐个坐标进行，所以逆元在每个坐标所属的群中分别取逆。在每个坐标上用该坐标的运算求逆。在 $U(10) \\times \\mathbb{Z}_8$ 中，$(3, 5)$ 的逆为 $(7, 3)$：$3 \\cdot 7 \\equiv 1 \\pmod{10}$，$5 + 3 \\equiv 0 \\pmod 8$。",
      ),
      generate(rng) {
        let m: number;
        let a: number;
        do {
          m = rng.int(7, 30);
          a = rng.pick(units(m));
        } while (a === 1 || modInverse(a, m) === a);
        const n = rng.int(5, 20);
        let b: number;
        do b = rng.int(1, n - 1);
        while (2 * b === n);
        const ai = modInverse(a, m);
        return texChoice(
          rng,
          t(
            `Find the inverse of $${pairTex(a, b)}$ in $U(${m}) \\times ${zTex(n)}$.`,
            `求 $${pairTex(a, b)}$ 在 $U(${m}) \\times ${zTex(n)}$ 中的逆。`,
          ),
          pairTex(ai, n - b),
          [pairTex(m - a, n - b), pairTex(ai, b), pairTex(a, n - b), pairTex(m - a, b)],
          t(
            `In $U(${m})$, $${a} \\cdot ${ai} \\equiv 1$; in $${zTex(n)}$, $${b} + ${n - b} \\equiv 0$. So the inverse is $${pairTex(ai, n - b)}$.`,
            `在 $U(${m})$ 中 $${a} \\cdot ${ai} \\equiv 1$；在 $${zTex(n)}$ 中 $${b} + ${n - b} \\equiv 0$。所以逆为 $${pairTex(ai, n - b)}$。`,
          ),
        );
      },
    },
  ],
};

/** cyclicDirectProductGroups decides when ℤₘ × ℤₙ is cyclic and counts elements of a given order. */
export const cyclicDirectProductGroups: TopicDef = {
  id: "cyclic-direct-product-groups",
  title: t("Cyclic Direct Product Groups", "循环直积群"),
  summary: t(
    "$\\mathbb{Z}_m \\times \\mathbb{Z}_n$ is cyclic, and isomorphic to $\\mathbb{Z}_{mn}$, exactly when $\\gcd(m, n) = 1$; otherwise every element has order at most $\\operatorname{lcm}(m, n) < mn$. More generally $\\mathbb{Z}_{n_1} \\times \\cdots \\times \\mathbb{Z}_{n_k}$ is cyclic exactly when the $n_i$ are pairwise coprime.",
    "$\\mathbb{Z}_m \\times \\mathbb{Z}_n$ 是循环群（且同构于 $\\mathbb{Z}_{mn}$）当且仅当 $\\gcd(m, n) = 1$；否则每个元素的阶至多为 $\\operatorname{lcm}(m, n) < mn$。更一般地，$\\mathbb{Z}_{n_1} \\times \\cdots \\times \\mathbb{Z}_{n_k}$ 是循环群当且仅当各 $n_i$ 两两互素。",
  ),
  prerequisites: ["external-direct-products", "properties-of-cyclic-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-cyclic-direct-products",
      title: t("Is the product cyclic?", "直积是循环群吗？"),
      explanation: t(
        "A product of two cyclic groups is cyclic exactly when their orders are coprime, because only then does some element reach the full order. $\\mathbb{Z}_4 \\times \\mathbb{Z}_9$ is cyclic since $\\gcd(4, 9) = 1$: $(1, 1)$ has order $36$. $\\mathbb{Z}_6 \\times \\mathbb{Z}_4$ is not: every element has order dividing $\\operatorname{lcm}(6, 4) = 12 < 24$.",
        "两个循环群的直积是循环群，当且仅当它们的阶互素，因为只有这时才有元素达到全部的阶。$\\mathbb{Z}_4 \\times \\mathbb{Z}_9$ 是循环群，因为 $\\gcd(4, 9) = 1$：$(1, 1)$ 的阶为 $36$。$\\mathbb{Z}_6 \\times \\mathbb{Z}_4$ 不是：每个元素的阶都整除 $\\operatorname{lcm}(6, 4) = 12 < 24$。",
      ),
      generate(rng) {
        const ns = range(1, rng.bool(0.7) ? 2 : 3).map(() => rng.int(2, 25));
        const coprime = ns.every((x, i) => ns.every((y, j) => i === j || gcd(x, y) === 1));
        const tex = ns.map(zTex).join(" \\times ");
        const size = ns.reduce((a, b) => a * b, 1);
        const top = ns.reduce((a, b) => lcm(a, b), 1);
        return factProblem({
          prompt: t(`Is $${tex}$ cyclic?`, `$${tex}$ 是循环群吗？`),
          holds: coprime,
          reason: coprime
            ? t(
                `The moduli are pairwise coprime, so $(${ns.map(() => 1).join(", ")})$ has order $${size}$.`,
                `各模两两互素，所以 $(${ns.map(() => 1).join(", ")})$ 的阶为 $${size}$。`,
              )
            : t(
                `Every element has order dividing $\\operatorname{lcm}(${ns.join(", ")}) = ${top} < ${size}$.`,
                `每个元素的阶都整除 $\\operatorname{lcm}(${ns.join(", ")}) = ${top} < ${size}$。`,
              ),
        });
      },
    },
    {
      id: "counting-elements-of-a-given-order-in-direct-products",
      title: t("Counting elements of a given order", "数给定阶的元素"),
      explanation: t(
        "Since the order is a least common multiple, count the pairs of coordinate orders whose least common multiple is the target. In $\\mathbb{Z}_2 \\times \\mathbb{Z}_4$, the elements of order $2$ are those $(a, b) \\ne (0, 0)$ with $2a = 0$ and $2b = 0$: $(1, 0), (0, 2), (1, 2)$. So there are $3$.",
        "由于阶是最小公倍数，所以要数出那些坐标阶的组合，使它们的最小公倍数等于目标值。在 $\\mathbb{Z}_2 \\times \\mathbb{Z}_4$ 中，$2$ 阶元素是满足 $2a = 0$、$2b = 0$ 且 $(a, b) \\ne (0, 0)$ 的元素：$(1, 0), (0, 2), (1, 2)$。所以共 $3$ 个。",
      ),
      generate(rng) {
        let m: number;
        let n: number;
        let d: number;
        let count: number;
        do {
          m = rng.int(2, 12);
          n = rng.int(2, 12);
          const orders = range(0, m - 1).flatMap((a) => range(0, n - 1).map((b) => lcm(additiveOrder(a, m), additiveOrder(b, n))));
          d = rng.pick(orders.filter((o) => o > 1));
          count = orders.filter((o) => o === d).length;
        } while (gcd(m, n) === 1 && rng.bool(0.7));
        return numberProblem({
          prompt: t(
            `How many elements of order $${d}$ does $${zTex(m)} \\times ${zTex(n)}$ have?`,
            `$${zTex(m)} \\times ${zTex(n)}$ 有多少个 $${d}$ 阶元素？`,
          ),
          answer: count,
          wrong: [phi(d), count + 1, d, Math.max(1, count - 1)],
          solution: t(
            `$(a, b)$ has order $\\operatorname{lcm}(|a|, |b|)$. Counting the pairs with $\\operatorname{lcm}(|a|, |b|) = ${d}$ gives $${count}$.`,
            `$(a, b)$ 的阶为 $\\operatorname{lcm}(|a|, |b|)$。数出满足 $\\operatorname{lcm}(|a|, |b|) = ${d}$ 的有序对，共 $${count}$ 个。`,
          ),
        });
      },
    },
  ],
};

/** torsionGroups finds elements of finite order and torsion subgroups. */
export const torsionGroups: TopicDef = {
  id: "torsion-groups",
  title: t("Torsion Groups", "挠群"),
  summary: t(
    "An element of finite order is a torsion element. In an abelian group the torsion elements form a subgroup, the torsion subgroup. A group is a torsion group if every element has finite order, and torsion-free if only the identity does. The torsion subgroup of a direct product is the product of the torsion subgroups.",
    "有限阶元素称为挠元。在阿贝尔群中，挠元构成子群，称为挠子群。若每个元素都是有限阶，则称该群为挠群；若只有单位元是有限阶，则称为无挠群。直积的挠子群是各因子挠子群的直积。",
  ),
  prerequisites: ["external-direct-products", "cyclic-subgroups-in-the-complex-plane"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-torsion-elements",
      title: t("Torsion elements", "挠元"),
      explanation: t(
        "$(0, 3)$ has finite order in $\\mathbb{Z} \\times \\mathbb{Z}_6$, but $(2, 3)$ does not: its first coordinate never returns to $0$. In $\\mathbb{R}^* \\times \\mathbb{Z}_n$, the first coordinate must be $\\pm 1$.",
        "$(0, 3)$ 在 $\\mathbb{Z} \\times \\mathbb{Z}_6$ 中是有限阶，而 $(2, 3)$ 不是：它的第一个坐标永远回不到 $0$。在 $\\mathbb{R}^* \\times \\mathbb{Z}_n$ 中，第一个坐标必须是 $\\pm 1$。",
      ),
      generate(rng) {
        const n = rng.int(3, 15);
        const b = rng.int(1, n - 1);
        const k = rng.int(2, 9);
        const facts: Fact[] = [
          {
            prompt: t(
              `Does $${pairTex(0, b)}$ have finite order in $\\mathbb{Z} \\times ${zTex(n)}$?`,
              `$${pairTex(0, b)}$ 在 $\\mathbb{Z} \\times ${zTex(n)}$ 中是有限阶吗？`,
            ),
            holds: true,
            reason: t(
              `Its order is the order of $${b}$ in $${zTex(n)}$, $${additiveOrder(b, n)}$.`,
              `它的阶等于 $${b}$ 在 $${zTex(n)}$ 中的阶 $${additiveOrder(b, n)}$。`,
            ),
          },
          {
            prompt: t(
              `Does $${pairTex(k, b)}$ have finite order in $\\mathbb{Z} \\times ${zTex(n)}$?`,
              `$${pairTex(k, b)}$ 在 $\\mathbb{Z} \\times ${zTex(n)}$ 中是有限阶吗？`,
            ),
            holds: false,
            reason: t(
              `The first coordinate of $m${pairTex(k, b)}$ is $${k}m \\ne 0$ for $m \\ne 0$.`,
              `当 $m \\ne 0$ 时，$m${pairTex(k, b)}$ 的第一个坐标 $${k}m \\ne 0$。`,
            ),
          },
          {
            prompt: t(
              `Does $${pairTex(-1, b)}$ have finite order in $\\mathbb{R}^* \\times ${zTex(n)}$?`,
              `$${pairTex(-1, b)}$ 在 $\\mathbb{R}^* \\times ${zTex(n)}$ 中是有限阶吗？`,
            ),
            holds: true,
            reason: t(
              `$-1$ has order $2$ and $${b}$ has order $${additiveOrder(b, n)}$, so the order is $${lcm(2, additiveOrder(b, n))}$.`,
              `$-1$ 的阶为 $2$，$${b}$ 的阶为 $${additiveOrder(b, n)}$，所以阶为 $${lcm(2, additiveOrder(b, n))}$。`,
            ),
          },
          {
            prompt: t(
              `Does $${pairTex(-k, b)}$ have finite order in $\\mathbb{R}^* \\times ${zTex(n)}$?`,
              `$${pairTex(-k, b)}$ 在 $\\mathbb{R}^* \\times ${zTex(n)}$ 中是有限阶吗？`,
            ),
            holds: false,
            reason: t(`$|(-${k})^m| = ${k}^m \\ne 1$ for $m \\ne 0$.`, `当 $m \\ne 0$ 时，$|(-${k})^m| = ${k}^m \\ne 1$。`),
          },
          {
            prompt: t(
              `Does $(e^{2\\pi i / ${k}}, ${b})$ have finite order in $\\mathbb{C}^* \\times ${zTex(n)}$?`,
              `$(e^{2\\pi i / ${k}}, ${b})$ 在 $\\mathbb{C}^* \\times ${zTex(n)}$ 中是有限阶吗？`,
            ),
            holds: true,
            reason: t(
              `The orders are $${k}$ and $${additiveOrder(b, n)}$, so the order is $${lcm(k, additiveOrder(b, n))}$.`,
              `两个坐标的阶为 $${k}$ 与 $${additiveOrder(b, n)}$，所以阶为 $${lcm(k, additiveOrder(b, n))}$。`,
            ),
          },
          {
            prompt: t(
              `Does $(${k}i, ${b})$ have finite order in $\\mathbb{C}^* \\times ${zTex(n)}$?`,
              `$(${k}i, ${b})$ 在 $\\mathbb{C}^* \\times ${zTex(n)}$ 中是有限阶吗？`,
            ),
            holds: false,
            reason: t(
              `$|${k}i| = ${k} \\ne 1$, so no power of $${k}i$ is $1$.`,
              `$|${k}i| = ${k} \\ne 1$，所以 $${k}i$ 的任何幂都不是 $1$。`,
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "sizes-of-torsion-subgroups",
      title: t("Torsion subgroups", "挠子群"),
      explanation: t(
        "The torsion subgroup collects the elements of finite order, and in a product with free parts only the finite factors contribute. The torsion subgroup of $\\mathbb{Z}^2 \\times \\mathbb{Z}_4 \\times \\mathbb{Z}_6$ is $\\{0\\} \\times \\{0\\} \\times \\mathbb{Z}_4 \\times \\mathbb{Z}_6$, with $24$ elements. In $\\mathbb{R}^*$ the torsion subgroup is $\\{\\pm 1\\}$.",
        "挠子群由有限阶元素组成，在含有自由部分的直积中，只有有限因子作出贡献。$\\mathbb{Z}^2 \\times \\mathbb{Z}_4 \\times \\mathbb{Z}_6$ 的挠子群为 $\\{0\\} \\times \\{0\\} \\times \\mathbb{Z}_4 \\times \\mathbb{Z}_6$，有 $24$ 个元素。$\\mathbb{R}^*$ 的挠子群为 $\\{\\pm 1\\}$。",
      ),
      generate(rng) {
        const m = rng.int(2, 15);
        const n = rng.int(2, 15);
        const k = rng.int(1, 4);
        const kind = rng.int(0, 3);
        const [tex, value, how] = [
          [
            `\\mathbb{Z}^{${k}} \\times ${zTex(m)} \\times ${zTex(n)}`,
            m * n,
            t(`Only the finite factors contribute: $${m} \\cdot ${n}$.`, `只有有限因子有贡献：$${m} \\cdot ${n}$。`),
          ],
          [
            `\\mathbb{R}^* \\times ${zTex(m)}`,
            2 * m,
            t(`The torsion subgroup is $\\{\\pm 1\\} \\times ${zTex(m)}$.`, `挠子群为 $\\{\\pm 1\\} \\times ${zTex(m)}$。`),
          ],
          [
            `\\mathbb{Q}^* \\times \\mathbb{Z}^{${k}} \\times ${zTex(m)} \\times ${zTex(n)}`,
            2 * m * n,
            t(
              `The torsion subgroup is $\\{\\pm 1\\} \\times \\{0\\} \\times ${zTex(m)} \\times ${zTex(n)}$.`,
              `挠子群为 $\\{\\pm 1\\} \\times \\{0\\} \\times ${zTex(m)} \\times ${zTex(n)}$。`,
            ),
          ],
          [
            `\\mathbb{Z}^{${k}} \\times U(${m + 2})`,
            phi(m + 2),
            t(
              `The torsion subgroup is $\\{0\\} \\times U(${m + 2})$, of order $\\varphi(${m + 2})$.`,
              `挠子群为 $\\{0\\} \\times U(${m + 2})$，阶为 $\\varphi(${m + 2})$。`,
            ),
          ],
        ][kind] as [string, number, Text];
        return numberProblem({
          prompt: t(`How many elements does the torsion subgroup of $${tex}$ have?`, `$${tex}$ 的挠子群有多少个元素？`),
          answer: value,
          wrong: [m * n === value ? m + n : m * n, 2 * value, value + 1, m],
          solution: t(`${how.en} So it has $${value}$ elements.`, `${how["zh-CN"]}所以它有 $${value}$ 个元素。`),
        });
      },
    },
  ],
};

/** finitelyGeneratedAbelianGroups classifies finite abelian groups. */
export const finitelyGeneratedAbelianGroups: TopicDef = {
  id: "finitely-generated-abelian-groups",
  title: t("Finitely Generated Abelian Groups", "有限生成阿贝尔群"),
  summary: t(
    "Every finitely generated abelian group is isomorphic to $\\mathbb{Z}^r \\times \\mathbb{Z}_{q_1} \\times \\cdots \\times \\mathbb{Z}_{q_k}$, where the $q_i$ are prime powers; $r$ and the $q_i$ (the elementary divisors) are unique. So the abelian groups of order $p_1^{e_1} \\cdots p_m^{e_m}$ correspond to choices of a partition of each $e_i$, and there are $p(e_1) \\cdots p(e_m)$ of them up to isomorphism.",
    "每个有限生成阿贝尔群都同构于 $\\mathbb{Z}^r \\times \\mathbb{Z}_{q_1} \\times \\cdots \\times \\mathbb{Z}_{q_k}$，其中各 $q_i$ 为素数幂；$r$ 与各 $q_i$（初等因子）是唯一的。所以阶为 $p_1^{e_1} \\cdots p_m^{e_m}$ 的阿贝尔群对应于每个 $e_i$ 的一个分拆，在同构意义下共有 $p(e_1) \\cdots p(e_m)$ 个。",
  ),
  prerequisites: ["cyclic-direct-product-groups", "torsion-groups", "abelian-groups", "partitions-of-natural-numbers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-abelian-groups-of-a-given-order",
      title: t("Counting abelian groups", "数阿贝尔群"),
      explanation: t(
        "$72 = 2^3 \\cdot 3^2$. The exponent $3$ has $3$ partitions ($3$, $2 + 1$, $1 + 1 + 1$) and $2$ has $2$, so there are $3 \\cdot 2 = 6$ abelian groups of order $72$ up to isomorphism.",
        "$72 = 2^3 \\cdot 3^2$。指数 $3$ 有 $3$ 个分拆（$3$、$2 + 1$、$1 + 1 + 1$），$2$ 有 $2$ 个，所以在同构意义下阶为 $72$ 的阿贝尔群有 $3 \\cdot 2 = 6$ 个。",
      ),
      generate(rng) {
        let n: number;
        let f: [number, number][];
        do {
          n = rng.int(12, 2000);
          f = factorize(n);
        } while (f.some(([, e]) => e > 6) || f.every(([, e]) => e === 1));
        const parts = f.map(([, e]) => PARTITIONS[e]!);
        const value = parts.reduce((a, b) => a * b, 1);
        const fac = f.map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join(" \\cdot ");
        return numberProblem({
          prompt: t(
            `How many abelian groups of order $${n}$ are there, up to isomorphism?`,
            `在同构意义下，阶为 $${n}$ 的阿贝尔群有多少个？`,
          ),
          answer: value,
          wrong: [f.reduce((s, [, e]) => s + e, 0), f.reduce((s, [, e]) => s * e, 1), value + 1, divisors(n).length],
          solution: t(
            `$${n} = ${fac}$, and the exponents have $${parts.join(", ")}$ partitions, so there are $${parts.join(" \\cdot ")} = ${value}$ groups.`,
            `$${n} = ${fac}$，各指数的分拆数为 $${parts.join(", ")}$，所以共有 $${parts.join(" \\cdot ")} = ${value}$ 个群。`,
          ),
        });
      },
    },
    {
      id: "isomorphic-products-of-cyclic-groups",
      title: t("Isomorphic products", "同构的直积"),
      explanation: t(
        "Split each factor into prime powers and compare. $\\mathbb{Z}_6 \\times \\mathbb{Z}_{10} \\cong \\mathbb{Z}_2 \\times \\mathbb{Z}_3 \\times \\mathbb{Z}_2 \\times \\mathbb{Z}_5 \\cong \\mathbb{Z}_2 \\times \\mathbb{Z}_{30}$, but it is not isomorphic to $\\mathbb{Z}_{60}$, whose only $2$-part is $\\mathbb{Z}_4$.",
        "把每个因子分解为素数幂再比较。$\\mathbb{Z}_6 \\times \\mathbb{Z}_{10} \\cong \\mathbb{Z}_2 \\times \\mathbb{Z}_3 \\times \\mathbb{Z}_2 \\times \\mathbb{Z}_5 \\cong \\mathbb{Z}_2 \\times \\mathbb{Z}_{30}$，但它与 $\\mathbb{Z}_{60}$ 不同构，后者的 $2$-部分只有 $\\mathbb{Z}_4$。",
      ),
      generate(rng) {
        const a = rng.int(2, 30);
        const b = rng.int(2, 30);
        const ed = elementaryDivisors([a, b]);
        let c = 1;
        let d = 1;
        if (rng.bool()) {
          for (const q of rng.shuffle(ed)) {
            const p = factorize(q)[0]![0];
            if (c % p !== 0 && (d % p === 0 || rng.bool())) c *= q;
            else if (d % p !== 0) d *= q;
            else c *= q;
          }
        } else {
          c = rng.pick(divisors(a * b).filter((x) => x > 1 && x < a * b));
          d = (a * b) / c;
        }
        const left = `${zTex(a)} \\times ${zTex(b)}`;
        const right = c === 1 || d === 1 ? zTex(c * d) : `${zTex(c)} \\times ${zTex(d)}`;
        const ed2 = elementaryDivisors([c, d]);
        const iso = ed.join() === ed2.join();
        const list = (xs: number[]) => xs.map(zTex).join(" \\times ");
        return factProblem({
          prompt: t(`Is $${left} \\cong ${right}$?`, `$${left} \\cong ${right}$ 吗？`),
          holds: iso,
          reason: t(
            `In prime powers, the left side is $${list(ed)}$ and the right side is $${list(ed2)}$${iso ? ", the same" : ", which differ"}.`,
            `分解为素数幂后，左边为 $${list(ed)}$，右边为 $${list(ed2)}$${iso ? "，两者相同" : "，两者不同"}。`,
          ),
        });
      },
    },
  ],
};

/** bezoutPair finds integers x, y with ax − by = 1, given gcd(a, b) = 1. */
function bezoutPair(a: number, b: number): [number, number] {
  for (let y = -30; y <= 30; y++) {
    const x = (1 + b * y) / a;
    if (Number.isInteger(x)) return [x, y];
  }
  return [1, 0];
}

/** freeAbelianGroups finds indices of subgroups of ℤ² and decides which pairs are bases. */
export const freeAbelianGroups: TopicDef = {
  id: "free-abelian-groups",
  title: t("Free Abelian Groups", "自由阿贝尔群"),
  summary: t(
    "A free abelian group of rank n is isomorphic to ℤⁿ; a basis is a set of elements such that every element is a unique integer combination of them. Vectors v₁, v₂ form a basis of ℤ² exactly when the matrix with columns v₁, v₂ has determinant ±1, and in general they generate a subgroup of index |det|.",
    "秩为 n 的自由阿贝尔群同构于 ℤⁿ；基是这样一组元素：每个元素都唯一地写成它们的整系数组合。向量 v₁、v₂ 构成 ℤ² 的基当且仅当以它们为列的矩阵行列式为 ±1；一般地，它们生成的子群指数为 |det|。",
  ),
  prerequisites: ["finitely-generated-abelian-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "indices-of-subgroups-of-z2",
      figure: algebraDrawings2["free-abelian-groups#indices-of-subgroups-of-z2"],
      title: t("Indices in $\\mathbb{Z}^2$", "$\\mathbb{Z}^2$ 中的指数"),
      explanation: t(
        "The index of the subgroup generated by two vectors in the integer plane is the absolute value of their determinant, the area of their parallelogram. $(2, 1)$ and $(1, 3)$ generate a subgroup of $\\mathbb{Z}^2$ of index $|2 \\cdot 3 - 1 \\cdot 1| = 5$: the quotient has $5$ elements.",
        "整数平面中由两个向量生成的子群的指数等于它们行列式的绝对值，也就是它们所成平行四边形的面积。$(2, 1)$ 与 $(1, 3)$ 生成 $\\mathbb{Z}^2$ 中指数为 $|2 \\cdot 3 - 1 \\cdot 1| = 5$ 的子群：商群有 $5$ 个元素。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        let c: number;
        let d: number;
        do {
          [a, b, c, d] = range(1, 4).map(() => rng.int(-6, 6)) as [number, number, number, number];
        } while (a * d - b * c === 0 || Math.abs(a * d - b * c) > 40);
        const det = a * d - b * c;
        return numberProblem({
          prompt: t(
            `Find the index in $\\mathbb{Z}^2$ of the subgroup generated by $${pairTex(a, b)}$ and $${pairTex(c, d)}$.`,
            `求由 $${pairTex(a, b)}$ 与 $${pairTex(c, d)}$ 生成的子群在 $\\mathbb{Z}^2$ 中的指数。`,
          ),
          answer: Math.abs(det),
          wrong: [Math.abs(a * d + b * c), Math.abs(a * c + b * d), Math.abs(det) + 1],
          solution: t(
            `The index is $|${a} \\cdot ${d < 0 ? `(${d})` : d} - ${b < 0 ? `(${b})` : b} \\cdot ${c < 0 ? `(${c})` : c}| = ${Math.abs(det)}$.`,
            `指数为 $|${a} \\cdot ${d < 0 ? `(${d})` : d} - ${b < 0 ? `(${b})` : b} \\cdot ${c < 0 ? `(${c})` : c}| = ${Math.abs(det)}$。`,
          ),
        });
      },
    },
    {
      id: "bases-of-z2",
      title: t("Bases of $\\mathbb{Z}^2$", "$\\mathbb{Z}^2$ 的基"),
      explanation: t(
        "$\\{(3, 2), (4, 3)\\}$ is a basis of $\\mathbb{Z}^2$ since $3 \\cdot 3 - 2 \\cdot 4 = 1$. $\\{(2, 0), (0, 1)\\}$ is not: it is linearly independent but generates only a subgroup of index $2$.",
        "$\\{(3, 2), (4, 3)\\}$ 是 $\\mathbb{Z}^2$ 的基，因为 $3 \\cdot 3 - 2 \\cdot 4 = 1$。$\\{(2, 0), (0, 1)\\}$ 不是：它线性无关，但只生成指数为 $2$ 的子群。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(1, 9);
          b = rng.int(-9, 9);
        } while (gcd(a, b) !== 1 || b === 0);
        // a·x − b·y = 1, so (y, x) completes (a, b) to a basis.
        let [d, c] = bezoutPair(a, b);
        const k = rng.int(-2, 2);
        [c, d] = [c + k * a, d + k * b];
        if (rng.bool()) {
          const m = rng.pick([2, 3, -2]);
          [c, d] = rng.bool() ? [m * c, m * d] : [c + a, d + b + 1];
        }
        const det = a * d - b * c;
        return factProblem({
          prompt: t(
            `Is $\\{${pairTex(a, b)}, ${pairTex(c, d)}\\}$ a basis of $\\mathbb{Z}^2$?`,
            `$\\{${pairTex(a, b)}, ${pairTex(c, d)}\\}$ 是 $\\mathbb{Z}^2$ 的基吗？`,
          ),
          holds: Math.abs(det) === 1,
          reason: t(
            `The determinant is $${det}$${Math.abs(det) === 1 ? ", which is $\\pm 1$" : `, so the vectors generate ${det === 0 ? "a subgroup of infinite index" : `a subgroup of index $${Math.abs(det)}$`}`}.`,
            `行列式为 $${det}$${Math.abs(det) === 1 ? "，等于 $\\pm 1$" : `，所以它们生成${det === 0 ? "指数无限的子群" : `指数为 $${Math.abs(det)}$ 的子群`}`}。`,
          ),
        });
      },
    },
  ],
};

/** internalDirectProducts decides when ℤₙ is the internal direct product of two cyclic subgroups. */
export const internalDirectProducts: TopicDef = {
  id: "internal-direct-products",
  title: t("Internal Direct Products", "内直积"),
  summary: t(
    "A group G is the internal direct product of normal subgroups H and K if H ∩ K = {e} and HK = G; then G ≅ H × K. In an abelian group every subgroup is normal, so it suffices that the subgroups meet trivially and |H||K| = |G|. In ℤₙ, subgroups of orders a and b meet in the subgroup of order gcd(a, b).",
    "若群 G 的正规子群 H、K 满足 H ∩ K = {e} 且 HK = G，则 G 是 H 与 K 的内直积，此时 G ≅ H × K。阿贝尔群的每个子群都正规，所以只需两个子群的交平凡且 |H||K| = |G|。在 ℤₙ 中，阶为 a 与 b 的子群之交是阶为 gcd(a, b) 的子群。",
  ),
  prerequisites: ["cyclic-direct-product-groups", "generating-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-internal-direct-products",
      title: t("Recognizing internal direct products", "识别内直积"),
      explanation: t(
        "In $\\mathbb{Z}_{12}$, $\\langle 4 \\rangle$ has order $3$ and $\\langle 3 \\rangle$ has order $4$. Their orders are coprime, so they meet only in $0$, and $3 \\cdot 4 = 12$. So $\\mathbb{Z}_{12}$ is their internal direct product.",
        "在 $\\mathbb{Z}_{12}$ 中，$\\langle 4 \\rangle$ 的阶为 $3$，$\\langle 3 \\rangle$ 的阶为 $4$。它们的阶互素，所以只交于 $0$，且 $3 \\cdot 4 = 12$。所以 $\\mathbb{Z}_{12}$ 是它们的内直积。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        let b: number;
        if (rng.bool()) {
          let m: number;
          let k: number;
          do {
            m = rng.int(2, 9);
            k = rng.int(2, 9);
          } while (gcd(m, k) !== 1);
          n = m * k;
          a = (k * rng.pick(units(m))) % n;
          b = (m * rng.pick(units(k))) % n;
        } else {
          n = rng.pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 60]);
          a = rng.pick(divisors(n).filter((d) => d > 1 && d < n));
          b = rng.pick(divisors(n).filter((d) => d > 1 && d < n && d !== a));
        }
        const [h, k] = [additiveOrder(a, n), additiveOrder(b, n)];
        const holds = h * k === n && gcd(h, k) === 1;
        return factProblem({
          prompt: t(
            `Is $${zTex(n)}$ the internal direct product of $\\langle ${a} \\rangle$ and $\\langle ${b} \\rangle$?`,
            `$${zTex(n)}$ 是 $\\langle ${a} \\rangle$ 与 $\\langle ${b} \\rangle$ 的内直积吗？`,
          ),
          holds,
          reason: t(
            `The subgroups have orders $${h}$ and $${k}$; ${gcd(h, k) === 1 ? "they meet only in $0$" : `they share the subgroup of order $${gcd(h, k)}$`}, and $${h} \\cdot ${k} ${h * k === n ? "=" : "\\ne"} ${n}$.`,
            `两个子群的阶为 $${h}$ 与 $${k}$；${gcd(h, k) === 1 ? "它们只交于 $0$" : `它们共有 $${gcd(h, k)}$ 阶子群`}，且 $${h} \\cdot ${k} ${h * k === n ? "=" : "\\ne"} ${n}$。`,
          ),
        });
      },
    },
    {
      id: "intersections-of-cyclic-subgroups-of-zn",
      title: t("Intersections of subgroups", "子群的交"),
      explanation: t(
        "In $\\mathbb{Z}_{24}$, $\\langle 4 \\rangle$ has order $6$ and $\\langle 6 \\rangle$ has order $4$. Their intersection is the unique subgroup of order $\\gcd(6, 4) = 2$, namely $\\{0, 12\\}$.",
        "在 $\\mathbb{Z}_{24}$ 中，$\\langle 4 \\rangle$ 的阶为 $6$，$\\langle 6 \\rangle$ 的阶为 $4$。它们的交是唯一的 $\\gcd(6, 4) = 2$ 阶子群，即 $\\{0, 12\\}$。",
      ),
      generate(rng) {
        const n = rng.pick([12, 18, 20, 24, 30, 36, 40, 42, 48, 60, 72, 84, 90]);
        const a = rng.int(2, n - 1);
        let b: number;
        do b = rng.int(2, n - 1);
        while (b === a);
        const [h, k] = [additiveOrder(a, n), additiveOrder(b, n)];
        const value = gcd(h, k);
        return numberProblem({
          prompt: t(
            `How many elements does $\\langle ${a} \\rangle \\cap \\langle ${b} \\rangle$ have in $${zTex(n)}$?`,
            `在 $${zTex(n)}$ 中，$\\langle ${a} \\rangle \\cap \\langle ${b} \\rangle$ 有多少个元素？`,
          ),
          answer: value,
          wrong: [lcm(h, k), gcd(a, b), Math.min(h, k)],
          solution: t(
            `$|\\langle ${a} \\rangle| = ${h}$ and $|\\langle ${b} \\rangle| = ${k}$, so the intersection is the subgroup of order $\\gcd(${h}, ${k}) = ${value}$.`,
            `$|\\langle ${a} \\rangle| = ${h}$，$|\\langle ${b} \\rangle| = ${k}$，所以交是 $\\gcd(${h}, ${k}) = ${value}$ 阶子群。`,
          ),
        });
      },
    },
  ],
};

/** cosetsOfTheAdditiveGroupsOfIntegersModuloN counts and lists cosets of subgroups of ℤₙ. */
export const cosetsOfTheAdditiveGroupsOfIntegersModuloN: TopicDef = {
  id: "cosets-of-the-additive-groups-of-integers-modulo-n",
  title: t("Cosets of the Additive Groups of Integers Modulo N", "模 n 整数加法群的陪集"),
  summary: t(
    "For a subgroup H of G and g ∈ G, the coset g + H (written additively) is {g + h : h ∈ H}. Two cosets are equal or disjoint, and all have |H| elements, so they partition G. In ℤₙ, the cosets of ⟨a⟩ are the classes of residues modulo d = gcd(a, n); there are d of them.",
    "设 H 是 G 的子群，g ∈ G，陪集 g + H（加法记号）为 {g + h : h ∈ H}。两个陪集要么相等要么不交，且都有 |H| 个元素，所以它们划分 G。在 ℤₙ 中，⟨a⟩ 的陪集就是模 d = gcd(a, n) 的剩余类，共 d 个。",
  ),
  prerequisites: ["cyclic-subgroups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-cosets-in-zn",
      title: t("Counting cosets", "数陪集"),
      explanation: t(
        "The cosets of a subgroup all have the same size, so their number is the order of the group divided by the order of the subgroup. In $\\mathbb{Z}_{20}$, $\\langle 8 \\rangle = \\langle 4 \\rangle$ has $5$ elements, so there are $\\frac{20}{5} = 4$ cosets: $0 + H, 1 + H, 2 + H, 3 + H$.",
        "一个子群的所有陪集大小都相同，所以陪集的个数等于群的阶除以子群的阶。在 $\\mathbb{Z}_{20}$ 中，$\\langle 8 \\rangle = \\langle 4 \\rangle$ 有 $5$ 个元素，所以共有 $\\frac{20}{5} = 4$ 个陪集：$0 + H, 1 + H, 2 + H, 3 + H$。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(8, 60);
          a = rng.int(2, n - 1);
        } while (gcd(a, n) === 1);
        const d = gcd(a, n);
        return numberProblem({
          prompt: t(
            `How many distinct cosets does $H = \\langle ${a} \\rangle$ have in $${zTex(n)}$?`,
            `$H = \\langle ${a} \\rangle$ 在 $${zTex(n)}$ 中有多少个不同的陪集？`,
          ),
          answer: d,
          wrong: [n / d, a, n - a],
          solution: t(
            `$|H| = \\frac{${n}}{\\gcd(${a}, ${n})} = ${n / d}$, so there are $\\frac{${n}}{${n / d}} = ${d}$ cosets.`,
            `$|H| = \\frac{${n}}{\\gcd(${a}, ${n})} = ${n / d}$，所以共有 $\\frac{${n}}{${n / d}} = ${d}$ 个陪集。`,
          ),
        });
      },
    },
    {
      id: "elements-of-cosets-in-zn",
      title: t("Elements of a coset", "陪集的元素"),
      explanation: t(
        "A coset is the subgroup shifted by one element, so add that element to every member of the subgroup. In $\\mathbb{Z}_{18}$ with $H = \\langle 12 \\rangle = \\{0, 6, 12\\}$, the coset $5 + H = \\{5, 11, 17\\}$. An element $x$ lies in $b + H$ exactly when $x - b \\in H$.",
        "陪集是把子群平移一个元素，所以把这个元素加到子群的每个成员上。在 $\\mathbb{Z}_{18}$ 中，$H = \\langle 12 \\rangle = \\{0, 6, 12\\}$，陪集 $5 + H = \\{5, 11, 17\\}$。元素 $x$ 属于 $b + H$ 当且仅当 $x - b \\in H$。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        let d: number;
        do {
          n = rng.int(10, 48);
          a = rng.int(2, n - 1);
          d = gcd(a, n);
        } while (d < 3 || d === n);
        const b = rng.int(1, d - 1) + d * rng.int(0, n / d - 1);
        const inside = range(0, n - 1).filter((x) => mod(x - b, d) === 0 && x !== b);
        const outside = range(0, n - 1).filter((x) => mod(x - b, d) !== 0);
        const right = rng.pick(inside);
        return texChoice(
          rng,
          t(
            `Let $H = \\langle ${a} \\rangle$ in $${zTex(n)}$. Which element lies in the coset $${b} + H$?`,
            `设 $H = \\langle ${a} \\rangle \\le ${zTex(n)}$。哪个元素属于陪集 $${b} + H$？`,
          ),
          `${right}`,
          rng.sample(outside, 3).map(String),
          t(
            `$H$ consists of the multiples of $${d}$, and $${right} - ${b}$ is a multiple of $${d}$.`,
            `$H$ 由 $${d}$ 的倍数组成，而 $${right} - ${b}$ 是 $${d}$ 的倍数。`,
          ),
        );
      },
    },
  ],
};

/** powersMod lists the powers of a modulo n, starting with 1. */
function powersMod(a: number, n: number): number[] {
  const out = [1];
  for (let x = mod(a, n); x !== 1; x = mod(x * a, n)) out.push(x);
  return out;
}

/** cosetsOfTheMultiplicativeGroupsOfIntegersModuloN counts and lists cosets of subgroups of U(n). */
export const cosetsOfTheMultiplicativeGroupsOfIntegersModuloN: TopicDef = {
  id: "cosets-of-the-multiplicative-groups-of-integers-modulo-n",
  title: t("Cosets of the Multiplicative Groups of Integers Modulo N", "模 n 整数乘法群的陪集"),
  summary: t(
    "In U(n), the cosets of H = ⟨a⟩ are the sets bH = {bh : h ∈ H}. Each has |H| elements, the order of a, so there are φ(n)/|H| cosets.",
    "在 U(n) 中，H = ⟨a⟩ 的陪集是集合 bH = {bh : h ∈ H}。每个陪集有 |H| 个元素（即 a 的阶），所以共有 φ(n)/|H| 个陪集。",
  ),
  prerequisites: ["cosets-of-the-additive-groups-of-integers-modulo-n"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-cosets-in-groups-of-units",
      title: t("Counting cosets", "数陪集"),
      explanation: t(
        "Lagrange's theorem applies to every finite group, so the number of cosets is again the group order divided by the subgroup order. In $U(13)$, $\\langle 3 \\rangle = \\{1, 3, 9\\}$ has $3$ elements, so there are $\\frac{12}{3} = 4$ cosets.",
        "拉格朗日定理适用于每个有限群，所以陪集的个数仍是群的阶除以子群的阶。在 $U(13)$ 中，$\\langle 3 \\rangle = \\{1, 3, 9\\}$ 有 $3$ 个元素，所以共有 $\\frac{12}{3} = 4$ 个陪集。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(7, 50);
          a = rng.pick(units(n));
        } while (a === 1 || multiplicativeOrder(a, n) === phi(n));
        const h = multiplicativeOrder(a, n);
        const value = phi(n) / h;
        return numberProblem({
          prompt: t(
            `How many distinct cosets does $H = \\langle ${a} \\rangle$ have in $U(${n})$?`,
            `$H = \\langle ${a} \\rangle$ 在 $U(${n})$ 中有多少个不同的陪集？`,
          ),
          answer: value,
          wrong: [h, n / gcd(a, n) === n ? phi(n) : n / gcd(a, n), gcd(a, n), value + 1],
          solution: t(
            `$H = \\{${powersMod(a, n).join(", ")}\\}$ has $${h}$ elements and $|U(${n})| = ${phi(n)}$, so there are $\\frac{${phi(n)}}{${h}} = ${value}$ cosets.`,
            `$H = \\{${powersMod(a, n).join(", ")}\\}$ 有 $${h}$ 个元素，$|U(${n})| = ${phi(n)}$，所以共有 $\\frac{${phi(n)}}{${h}} = ${value}$ 个陪集。`,
          ),
        });
      },
    },
    {
      id: "elements-of-cosets-in-groups-of-units",
      title: t("Elements of a coset", "陪集的元素"),
      explanation: t(
        "In a multiplicative group a coset is the subgroup multiplied by one element, with every product reduced modulo the number. In $U(13)$ with $H = \\langle 3 \\rangle = \\{1, 3, 9\\}$, the coset $2H = \\{2, 6, 18 \\bmod 13\\} = \\{2, 6, 5\\}$.",
        "在乘法群中，陪集是子群乘以一个元素，每个乘积都要模这个数约化。在 $U(13)$ 中，$H = \\langle 3 \\rangle = \\{1, 3, 9\\}$，陪集 $2H = \\{2, 6, 18 \\bmod 13\\} = \\{2, 6, 5\\}$。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        let h: number[];
        do {
          n = rng.int(7, 50);
          a = rng.pick(units(n));
          h = powersMod(a, n);
        } while (h.length < 2 || phi(n) / h.length < 3);
        let b: number;
        do b = rng.pick(units(n));
        while (h.includes(b));
        const coset = h.map((x) => mod(b * x, n));
        const inside = coset.filter((x) => x !== b);
        const outside = units(n).filter((x) => !coset.includes(x));
        const right = rng.pick(inside);
        return texChoice(
          rng,
          t(
            `Let $H = \\langle ${a} \\rangle$ in $U(${n})$. Which element lies in the coset $${b}H$?`,
            `设 $H = \\langle ${a} \\rangle \\le U(${n})$。哪个元素属于陪集 $${b}H$？`,
          ),
          `${right}`,
          rng.sample(outside, Math.min(3, outside.length)).map(String),
          t(
            `$H = \\{${h.join(", ")}\\}$, so $${b}H = \\{${coset.join(", ")}\\}$.`,
            `$H = \\{${h.join(", ")}\\}$，所以 $${b}H = \\{${coset.join(", ")}\\}$。`,
          ),
        );
      },
    },
  ],
};

/** cosetsOfInfiniteScalarGroups works with cosets of nℤ in ℤ and of ℤ in ℚ. */
export const cosetsOfInfiniteScalarGroups: TopicDef = {
  id: "cosets-of-infinite-scalar-groups",
  title: t("Cosets of Infinite Scalar Groups", "无限数集群的陪集"),
  summary: t(
    "The cosets of $n\\mathbb{Z}$ in $\\mathbb{Z}$ are the $n$ residue classes modulo $n$. The cosets of $\\mathbb{Z}$ in $\\mathbb{Q}$ or $\\mathbb{R}$ are the sets $x + \\mathbb{Z}$, determined by the fractional part of $x$. The cosets of the positive reals in $\\mathbb{R}^*$ are the positive and the negative reals.",
    "$n\\mathbb{Z}$ 在 $\\mathbb{Z}$ 中的陪集就是模 $n$ 的 $n$ 个剩余类。$\\mathbb{Z}$ 在 $\\mathbb{Q}$ 或 $\\mathbb{R}$ 中的陪集是集合 $x + \\mathbb{Z}$，由 $x$ 的小数部分决定。正实数在 $\\mathbb{R}^*$ 中的陪集是正实数集与负实数集。",
  ),
  prerequisites: ["cosets-of-the-additive-groups-of-integers-modulo-n"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "same-coset-in-infinite-groups",
      title: t("Same coset or not", "是否在同一陪集"),
      explanation: t(
        "$x$ and $y$ lie in the same coset of $H$ exactly when $x - y \\in H$ (or $xy^{-1} \\in H$ multiplicatively). $17$ and $-3$ lie in the same coset of $5\\mathbb{Z}$, since $20 \\in 5\\mathbb{Z}$; $\\frac{7}{3}$ and $\\frac{1}{3}$ lie in the same coset of $\\mathbb{Z}$ in $\\mathbb{Q}$.",
        "$x$ 与 $y$ 在 $H$ 的同一陪集中当且仅当 $x - y \\in H$（乘法记号下为 $xy^{-1} \\in H$）。$17$ 与 $-3$ 在 $5\\mathbb{Z}$ 的同一陪集中，因为 $20 \\in 5\\mathbb{Z}$；$\\frac{7}{3}$ 与 $\\frac{1}{3}$ 在 $\\mathbb{Z}$ 于 $\\mathbb{Q}$ 中的同一陪集中。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const n = rng.int(3, 12);
          const x = rng.int(-40, 40);
          const y = rng.bool() ? x + n * rng.nonZero(-5, 5) : x + rng.int(1, n - 1) + n * rng.int(-3, 3);
          return factProblem({
            prompt: t(
              `Do $${x}$ and $${y}$ lie in the same coset of $${n}\\mathbb{Z}$ in $\\mathbb{Z}$?`,
              `$${x}$ 与 $${y}$ 在 $${n}\\mathbb{Z}$ 于 $\\mathbb{Z}$ 中的同一陪集中吗？`,
            ),
            holds: mod(x - y, n) === 0,
            reason: t(
              `$${x} - ${y < 0 ? `(${y})` : y} = ${x - y}$ is ${mod(x - y, n) === 0 ? "" : "not "}a multiple of $${n}$.`,
              `$${x} - ${y < 0 ? `(${y})` : y} = ${x - y}$ ${mod(x - y, n) === 0 ? "是" : "不是"} $${n}$ 的倍数。`,
            ),
          });
        }
        if (kind === 1) {
          const q = rng.int(2, 9);
          let p: number;
          do p = rng.int(-30, 30);
          while (gcd(p, q) !== 1);
          const p2 = rng.bool() ? p + q * rng.nonZero(-4, 4) : p + rng.int(1, q - 1);
          const diff = Q.of(p - p2, q);
          const same = mod(p - p2, q) === 0;
          return factProblem({
            prompt: t(
              `Do $${Q.of(p, q).toLatex()}$ and $${Q.of(p2, q).toLatex()}$ lie in the same coset of $\\mathbb{Z}$ in $\\mathbb{Q}$?`,
              `$${Q.of(p, q).toLatex()}$ 与 $${Q.of(p2, q).toLatex()}$ 在 $\\mathbb{Z}$ 于 $\\mathbb{Q}$ 中的同一陪集中吗？`,
            ),
            holds: same,
            reason: t(
              `Their difference is $${diff.toLatex()}$, which is ${same ? "" : "not "}an integer.`,
              `它们的差为 $${diff.toLatex()}$，${same ? "是" : "不是"}整数。`,
            ),
          });
        }
        const x = rng.nonZero(-20, 20);
        const y = rng.nonZero(-20, 20);
        const same = x * y > 0;
        return factProblem({
          prompt: t(
            `Let $H$ be the positive reals, a subgroup of $\\mathbb{R}^*$. Do $${x}$ and $${y}$ lie in the same coset of $H$?`,
            `设 $H$ 为正实数集，它是 $\\mathbb{R}^*$ 的子群。$${x}$ 与 $${y}$ 在 $H$ 的同一陪集中吗？`,
          ),
          holds: same,
          reason: t(
            `$${x} \\cdot (${y})^{-1}$ is ${same ? "positive" : "negative"}.`,
            `$${x} \\cdot (${y})^{-1}$ 为${same ? "正" : "负"}。`,
          ),
        });
      },
    },
    {
      id: "representatives-of-cosets-of-z-in-q",
      title: t("Coset representatives", "陪集代表元"),
      explanation: t(
        "Two rationals lie in the same coset when they differ by an integer, so each coset is named by the fractional part of any member. Every coset $x + \\mathbb{Z}$ in $\\mathbb{Q}$ contains exactly one number in $[0, 1)$. For $x = -\\frac{17}{5} = -4 + \\frac{3}{5}$, it is $\\frac{3}{5}$.",
        "两个有理数相差一个整数时属于同一个陪集，所以每个陪集可以用其中任一成员的小数部分来表示。$\\mathbb{Q}$ 中每个陪集 $x + \\mathbb{Z}$ 恰含一个 $[0, 1)$ 中的数。对 $x = -\\frac{17}{5} = -4 + \\frac{3}{5}$，这个数是 $\\frac{3}{5}$。",
      ),
      generate(rng) {
        const q = rng.int(2, 12);
        let p: number;
        do p = rng.int(-60, 60);
        while (gcd(p, q) !== 1 || Math.abs(p) < q);
        const value = Q.of(mod(p, q), q);
        return numberProblem({
          prompt: t(
            `The coset $${Q.of(p, q).toLatex()} + \\mathbb{Z}$ in $\\mathbb{Q}$ contains exactly one number in $[0, 1)$. Find it.`,
            `$\\mathbb{Q}$ 中的陪集 $${Q.of(p, q).toLatex()} + \\mathbb{Z}$ 恰含一个 $[0, 1)$ 中的数。求这个数。`,
          ),
          answer: value,
          wrong: [Q.of(Math.abs(p) % q, q), Q.of(q - mod(p, q), q), Q.of(1, q), Q.of(-mod(p, q), q), Q.of((Math.abs(p) % q) + q, q)],
          solution: t(
            `$${Q.of(p, q).toLatex()} = ${Math.floor(p / q)} + ${value.toLatex()}$, so the representative is $${value.toLatex()}$.`,
            `$${Q.of(p, q).toLatex()} = ${Math.floor(p / q)} + ${value.toLatex()}$，所以代表元为 $${value.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** det2 is the determinant of a 2 × 2 matrix. */
const det2 = (m: Mat2) => m[0] * m[3] - m[1] * m[2];

/** randomIntMatrix is a random integer matrix with nonzero determinant of absolute value at most 12. */
function randomIntMatrix(rng: Rng): Mat2 {
  let m: Mat2;
  do m = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
  while (det2(m) === 0 || Math.abs(det2(m)) > 12);
  return m;
}

/** randomSL2 is a random integer matrix of determinant 1 other than the identity. */
function randomSL2(rng: Rng): Mat2 {
  const k = rng.nonZero(-3, 3);
  const l = rng.int(-2, 2);
  return mul2([1, k, 0, 1], [1, 0, l, 1]);
}

/** leftAndRightCosetsInMatrixGroups works with cosets of SL(2, ℝ) in GL(2, ℝ). */
export const leftAndRightCosetsInMatrixGroups: TopicDef = {
  id: "left-and-right-cosets-in-matrix-groups",
  title: t("Left and Right Cosets in Matrix Groups", "矩阵群中的左陪集与右陪集"),
  summary: t(
    "In a non-abelian group the left coset gH = {gh} and the right coset Hg = {hg} can differ. For H = SL(2, ℝ) in GL(2, ℝ) they agree: both AH and HA are the set of matrices with determinant det A, so A and B lie in the same coset exactly when det A = det B.",
    "在非阿贝尔群中，左陪集 gH = {gh} 与右陪集 Hg = {hg} 可能不同。对 GL(2, ℝ) 中的 H = SL(2, ℝ)，二者相同：AH 与 HA 都是行列式等于 det A 的矩阵之集，所以 A 与 B 在同一陪集中当且仅当 det A = det B。",
  ),
  prerequisites: ["cosets-of-infinite-scalar-groups", "subgroups-of-matrix-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "same-coset-of-sl2",
      title: t("Cosets of $SL(2, \\mathbb{R})$", "$SL(2, \\mathbb{R})$ 的陪集"),
      explanation: t(
        "Two matrices share a coset of the matrices with determinant one exactly when their determinants are equal, because the determinant is multiplicative. $A$ and $B$ lie in the same left coset of $SL(2, \\mathbb{R})$ exactly when $A^{-1}B \\in SL(2, \\mathbb{R})$, that is, $\\det B = \\det A$.",
        "两个矩阵属于行列式为 1 的矩阵所成子群的同一个陪集，当且仅当它们的行列式相等，因为行列式是积性的。$A$ 与 $B$ 在 $SL(2, \\mathbb{R})$ 的同一左陪集中当且仅当 $A^{-1}B \\in SL(2, \\mathbb{R})$，即 $\\det B = \\det A$。",
      ),
      generate(rng) {
        const a = randomIntMatrix(rng);
        const b = rng.bool() ? mul2(a, randomSL2(rng)) : randomIntMatrix(rng);
        const same = det2(a) === det2(b);
        return factProblem({
          prompt: t(
            `Do $A = ${mat2Tex(a)}$ and $B = ${mat2Tex(b)}$ lie in the same left coset of $SL(2, \\mathbb{R})$ in $GL(2, \\mathbb{R})$?`,
            `$A = ${mat2Tex(a)}$ 与 $B = ${mat2Tex(b)}$ 在 $SL(2, \\mathbb{R})$ 于 $GL(2, \\mathbb{R})$ 中的同一左陪集中吗？`,
          ),
          holds: same,
          reason: t(`$\\det A = ${det2(a)}$ and $\\det B = ${det2(b)}$.`, `$\\det A = ${det2(a)}$，$\\det B = ${det2(b)}$。`),
        });
      },
    },
    {
      id: "elements-of-cosets-of-sl2",
      title: t("Elements of a coset", "陪集的元素"),
      explanation: t(
        "$A \\cdot SL(2, \\mathbb{R})$ contains $AS$ for every $S$ of determinant $1$, and nothing else. With $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 1 \\end{pmatrix}$, every matrix of determinant $2$ is in the coset.",
        "$A \\cdot SL(2, \\mathbb{R})$ 由所有 $AS$（$S$ 的行列式为 $1$）组成。若 $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 1 \\end{pmatrix}$，则每个行列式为 $2$ 的矩阵都在该陪集中。",
      ),
      generate(rng) {
        const a = randomIntMatrix(rng);
        const d = det2(a);
        let right: Mat2;
        do right = mul2(a, randomSL2(rng));
        while (right.every((x, i) => x === a[i]));
        const wrongs: Mat2[] = [];
        while (wrongs.length < 5) {
          const m = randomIntMatrix(rng);
          if (det2(m) !== d) wrongs.push(m);
        }
        return texChoice(
          rng,
          t(
            `Let $A = ${mat2Tex(a)}$. Which matrix lies in the left coset $A \\cdot SL(2, \\mathbb{R})$?`,
            `设 $A = ${mat2Tex(a)}$。哪个矩阵属于左陪集 $A \\cdot SL(2, \\mathbb{R})$？`,
          ),
          mat2Tex(right),
          [mat2Tex([a[0], a[1], -a[2], -a[3]]), mat2Tex([a[1], a[0], a[3], a[2]]), ...wrongs.map(mat2Tex)],
          t(
            `The coset consists of the matrices of determinant $\\det A = ${d}$, and $${mat2Tex(right)}$ is the only option with determinant $${d}$.`,
            `该陪集由行列式等于 $\\det A = ${d}$ 的矩阵组成，只有 $${mat2Tex(right)}$ 的行列式为 $${d}$。`,
          ),
        );
      },
    },
  ],
};

/** setTex writes a set of permutations in cycle notation. */
const setTex = (ps: readonly Perm[]) => `\\{${ps.map(permCycleTex).join(", ")}\\}`;

/** cyclicPerms lists the powers of a permutation. */
function cyclicPerms(p: Perm): Perm[] {
  const out: Perm[] = [range(0, p.length - 1)];
  for (let x = p; permCycleTex(x) !== "e"; x = composePerm(x, p)) out.push(x);
  return out;
}

/** sameSet reports whether two lists of permutations contain the same permutations. */
const sameSet = (a: readonly Perm[], b: readonly Perm[]) => {
  const key = (ps: readonly Perm[]) => ps.map(permCycleTex).sort().join("|");
  return key(a) === key(b);
};

/** randomSmallSubgroup is ⟨h⟩ for a random transposition or 3-cycle h in Sₙ. */
function randomSmallSubgroup(rng: Rng, n: number): { gen: Perm; elements: Perm[] } {
  const gen = cyclePerm(n, rng.sample(range(0, n - 1), rng.int(2, 3)));
  return { gen, elements: cyclicPerms(gen) };
}

/** leftAndRightCosetsInPermutationGroups finds left and right cosets of small subgroups of Sₙ. */
export const leftAndRightCosetsInPermutationGroups: TopicDef = {
  id: "left-and-right-cosets-in-permutation-groups",
  title: t("Left and Right Cosets in Permutation Groups", "置换群中的左陪集与右陪集"),
  summary: t(
    "In Sₙ, the left coset σH = {σh : h ∈ H} and the right coset Hσ = {hσ : h ∈ H} often differ. For example, with H = ⟨(1 2)⟩ in S₃, (1 3)H = {(1 3), (1 2 3)} but H(1 3) = {(1 3), (1 3 2)}.",
    "在 Sₙ 中，左陪集 σH = {σh : h ∈ H} 与右陪集 Hσ = {hσ : h ∈ H} 往往不同。例如在 S₃ 中取 H = ⟨(1 2)⟩，则 (1 3)H = {(1 3), (1 2 3)}，而 H(1 3) = {(1 3), (1 3 2)}。",
  ),
  prerequisites: ["cosets-of-the-additive-groups-of-integers-modulo-n", "the-symmetric-group-on-n-symbols"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "left-cosets-in-symmetric-groups",
      title: t("Finding a left coset", "求左陪集"),
      explanation: t(
        "A left coset multiplies the fixed element on the left of every subgroup element, so compute each of those products. Multiply $\\sigma$ by each element of $H$ on the right. With $H = \\{e, (1\\;2)\\}$ and $\\sigma = (1\\;3)$: $\\sigma e = (1\\;3)$ and $\\sigma(1\\;2) = (1\\;2\\;3)$, so $\\sigma H = \\{(1\\;3), (1\\;2\\;3)\\}$.",
        "左陪集是把固定元素乘在每个子群元素的左边，所以要计算每个这样的乘积。用 $\\sigma$ 右乘 $H$ 的每个元素。设 $H = \\{e, (1\\;2)\\}$，$\\sigma = (1\\;3)$：$\\sigma e = (1\\;3)$，$\\sigma(1\\;2) = (1\\;2\\;3)$，所以 $\\sigma H = \\{(1\\;3), (1\\;2\\;3)\\}$。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        let h: { gen: Perm; elements: Perm[] };
        let s: Perm;
        let left: Perm[];
        let right: Perm[];
        do {
          h = randomSmallSubgroup(rng, n);
          s = cyclePerm(n, rng.sample(range(0, n - 1), rng.int(2, Math.min(n, 4))));
          left = h.elements.map((x) => composePerm(s, x));
          right = h.elements.map((x) => composePerm(x, s));
        } while (sameSet(left, right));
        const other = h.elements.map((x) => composePerm(invertPerm(s), x));
        return texChoice(
          rng,
          t(
            `In $S_{${n}}$, let $H = \\langle ${permCycleTex(h.gen)} \\rangle$ and $\\sigma = ${permCycleTex(s)}$. Products are composed from right to left. Find the left coset $\\sigma H$.`,
            `在 $S_{${n}}$ 中，设 $H = \\langle ${permCycleTex(h.gen)} \\rangle$，$\\sigma = ${permCycleTex(s)}$。乘积从右向左复合。求左陪集 $\\sigma H$。`,
          ),
          setTex(left),
          [setTex(right), setTex(other), setTex([s, h.gen])],
          t(
            `$\\sigma H = \\{${h.elements.map((x) => `\\sigma${permCycleTex(x) === "e" ? "" : permCycleTex(x)}`).join(", ")}\\} = ${setTex(left)}$.`,
            `$\\sigma H = \\{${h.elements.map((x) => `\\sigma${permCycleTex(x) === "e" ? "" : permCycleTex(x)}`).join(", ")}\\} = ${setTex(left)}$。`,
          ),
        );
      },
    },
    {
      id: "comparing-left-and-right-cosets",
      title: t("Left versus right cosets", "左陪集与右陪集"),
      explanation: t(
        "Left and right cosets of an element agree exactly when conjugating by that element leaves the subgroup unchanged. $\\sigma H = H\\sigma$ exactly when $\\sigma H \\sigma^{-1} = H$. With $H = \\langle (1\\;2\\;3) \\rangle$ in $S_3$, every $\\sigma$ satisfies this; with $H = \\langle (1\\;2) \\rangle$, $\\sigma = (1\\;3)$ does not.",
        "一个元素的左陪集和右陪集相同，当且仅当用这个元素共轭后子群保持不变。$\\sigma H = H\\sigma$ 当且仅当 $\\sigma H \\sigma^{-1} = H$。在 $S_3$ 中取 $H = \\langle (1\\;2\\;3) \\rangle$，每个 $\\sigma$ 都满足；取 $H = \\langle (1\\;2) \\rangle$，$\\sigma = (1\\;3)$ 不满足。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const h = randomSmallSubgroup(rng, n);
        const s = cyclePerm(n, rng.sample(range(0, n - 1), rng.int(2, Math.min(n, 4))));
        const left = h.elements.map((x) => composePerm(s, x));
        const right = h.elements.map((x) => composePerm(x, s));
        const same = sameSet(left, right);
        return factProblem({
          prompt: t(
            `In $S_{${n}}$, let $H = \\langle ${permCycleTex(h.gen)} \\rangle$ and $\\sigma = ${permCycleTex(s)}$. Is $\\sigma H = H\\sigma$?`,
            `在 $S_{${n}}$ 中，设 $H = \\langle ${permCycleTex(h.gen)} \\rangle$，$\\sigma = ${permCycleTex(s)}$。$\\sigma H = H\\sigma$ 吗？`,
          ),
          holds: same,
          reason: t(
            `$\\sigma H = ${setTex(left)}$ and $H\\sigma = ${setTex(right)}$.`,
            `$\\sigma H = ${setTex(left)}$，$H\\sigma = ${setTex(right)}$。`,
          ),
        });
      },
    },
  ],
};

/** conjugateCycles relabels each point of the cycles by σ: σ(a₁ … aₖ)σ⁻¹ = (σ(a₁) … σ(aₖ)). */
const conjugatePerm = (s: Perm, p: Perm) => composePerm(composePerm(s, p), invertPerm(s));

/** normalSubgroups decides normality and computes conjugates. */
export const normalSubgroups: TopicDef = {
  id: "normal-subgroups",
  title: t("Normal Subgroups", "正规子群"),
  summary: t(
    "A subgroup N of G is normal, N ⊴ G, if gNg⁻¹ = N for every g ∈ G; equivalently gN = Ng for every g. Every subgroup of an abelian group is normal, every subgroup of index 2 is normal, and kernels of homomorphisms are normal. In Sₙ, conjugating a cycle relabels its points: σ(a₁ … aₖ)σ⁻¹ = (σ(a₁) … σ(aₖ)).",
    "若对每个 g ∈ G 都有 gNg⁻¹ = N，则子群 N 是 G 的正规子群，记作 N ⊴ G；等价地，对每个 g 有 gN = Ng。阿贝尔群的每个子群都正规，指数为 2 的子群都正规，同态的核也正规。在 Sₙ 中，共轭一个轮换就是重新标记它的点：σ(a₁ … aₖ)σ⁻¹ = (σ(a₁) … σ(aₖ))。",
  ),
  prerequisites: ["left-and-right-cosets-in-permutation-groups", "left-and-right-cosets-in-matrix-groups", "dihedral-group"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-normal-subgroups",
      title: t("Recognizing normal subgroups", "识别正规子群"),
      explanation: t(
        "A subgroup is normal when every conjugate of it is itself; subgroups of index two and kernels of homomorphisms are always normal. $A_n \\trianglelefteq S_n$ since it has index $2$, and $SL(2, \\mathbb{R}) \\trianglelefteq GL(2, \\mathbb{R})$ since $\\det(ASA^{-1}) = \\det S$. But $\\langle (1\\;2) \\rangle$ is not normal in $S_3$: $(1\\;3)(1\\;2)(1\\;3)^{-1} = (2\\;3)$.",
        "如果一个子群的每个共轭都等于它自己，它就是正规子群；指数为 2 的子群和同态的核总是正规的。$A_n \\trianglelefteq S_n$，因为它的指数为 $2$；$SL(2, \\mathbb{R}) \\trianglelefteq GL(2, \\mathbb{R})$，因为 $\\det(ASA^{-1}) = \\det S$。但 $\\langle (1\\;2) \\rangle$ 在 $S_3$ 中不正规：$(1\\;3)(1\\;2)(1\\;3)^{-1} = (2\\;3)$。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const k = rng.int(2, 9);
        const facts: Fact[] = [
          {
            prompt: t(`Is $A_{${n}}$ normal in $S_{${n}}$?`, `$A_{${n}}$ 在 $S_{${n}}$ 中正规吗？`),
            holds: true,
            reason: t(
              "It has index $2$, and a subgroup of index $2$ is normal: its left and right cosets are both the subgroup and its complement.",
              "它的指数为 $2$，而指数为 $2$ 的子群是正规的：它的左陪集和右陪集都是该子群本身与其补集。",
            ),
          },
          {
            prompt: t(`Is $\\langle (1\\;2) \\rangle$ normal in $S_{${n}}$?`, `$\\langle (1\\;2) \\rangle$ 在 $S_{${n}}$ 中正规吗？`),
            holds: false,
            reason: t(
              "$(1\\;3)(1\\;2)(1\\;3)^{-1} = (2\\;3)$ is not in the subgroup.",
              "$(1\\;3)(1\\;2)(1\\;3)^{-1} = (2\\;3)$ 不在该子群中。",
            ),
          },
          {
            prompt: t(
              `Is the rotation subgroup $\\langle r \\rangle$ normal in $D_{${n}}$?`,
              `旋转子群 $\\langle r \\rangle$ 在 $D_{${n}}$ 中正规吗？`,
            ),
            holds: true,
            reason: t(
              "It has index $2$, and a subgroup of index $2$ is normal: its left and right cosets are both the subgroup and its complement.",
              "它的指数为 $2$，而指数为 $2$ 的子群是正规的：它的左陪集和右陪集都是该子群本身与其补集。",
            ),
          },
          {
            prompt: t(
              `Is $\\langle s \\rangle$, generated by a reflection, normal in $D_{${n}}$?`,
              `由一个反射生成的 $\\langle s \\rangle$ 在 $D_{${n}}$ 中正规吗？`,
            ),
            holds: false,
            reason: t("$rsr^{-1} = r^2s \\ne s$ is not in the subgroup.", "$rsr^{-1} = r^2s \\ne s$ 不在该子群中。"),
          },
          {
            prompt: t(
              `Is $\\langle ${k} \\rangle$ normal in $\\mathbb{Z}_{${n + k}}$?`,
              `$\\langle ${k} \\rangle$ 在 $\\mathbb{Z}_{${n + k}}$ 中正规吗？`,
            ),
            holds: true,
            reason: t("Every subgroup of an abelian group is normal.", "阿贝尔群的每个子群都正规。"),
          },
          {
            prompt: t("Is $SL(2, \\mathbb{R})$ normal in $GL(2, \\mathbb{R})$?", "$SL(2, \\mathbb{R})$ 在 $GL(2, \\mathbb{R})$ 中正规吗？"),
            holds: true,
            reason: t("$\\det(ASA^{-1}) = \\det S = 1$.", "$\\det(ASA^{-1}) = \\det S = 1$。"),
          },
          {
            prompt: t(
              `Is the subgroup of upper triangular matrices $\\begin{pmatrix} a & b \\\\ 0 & d \\end{pmatrix}$ normal in $GL(2, \\mathbb{R})$?`,
              `上三角矩阵 $\\begin{pmatrix} a & b \\\\ 0 & d \\end{pmatrix}$ 构成的子群在 $GL(2, \\mathbb{R})$ 中正规吗？`,
            ),
            holds: false,
            reason: t(
              `Conjugating $\\begin{pmatrix} 1 & ${k} \\\\ 0 & 1 \\end{pmatrix}$ by $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$ gives $\\begin{pmatrix} 1 & 0 \\\\ ${k} & 1 \\end{pmatrix}$.`,
              `用 $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$ 共轭 $\\begin{pmatrix} 1 & ${k} \\\\ 0 & 1 \\end{pmatrix}$ 得 $\\begin{pmatrix} 1 & 0 \\\\ ${k} & 1 \\end{pmatrix}$。`,
            ),
          },
          {
            prompt: t(
              `Is the subgroup $\\{${k}^m I : m \\in \\mathbb{Z}\\}$ of scalar matrices normal in $GL(2, \\mathbb{R})$?`,
              `数量矩阵子群 $\\{${k}^m I : m \\in \\mathbb{Z}\\}$ 在 $GL(2, \\mathbb{R})$ 中正规吗？`,
            ),
            holds: true,
            reason: t(
              "Scalar matrices commute with every matrix, so $A(cI)A^{-1} = cI$.",
              "数量矩阵与每个矩阵可交换，所以 $A(cI)A^{-1} = cI$。",
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "conjugating-permutations",
      title: t("Conjugating permutations", "共轭置换"),
      explanation: t(
        "Conjugating a permutation relabels its points, so apply the conjugating permutation to every entry in the cycles. To find $\\sigma\\tau\\sigma^{-1}$, apply $\\sigma$ to each point in the cycles of $\\tau$. With $\\sigma = (1\\;2\\;4)$ and $\\tau = (1\\;3)(2\\;5)$: $\\sigma\\tau\\sigma^{-1} = (\\sigma(1)\\;\\sigma(3))(\\sigma(2)\\;\\sigma(5)) = (2\\;3)(4\\;5)$.",
        "共轭一个置换相当于给它的点重新命名，所以把共轭用的置换作用到轮换中的每一项上。求 $\\sigma\\tau\\sigma^{-1}$ 时，对 $\\tau$ 的轮换中每个点作用 $\\sigma$。设 $\\sigma = (1\\;2\\;4)$，$\\tau = (1\\;3)(2\\;5)$：$\\sigma\\tau\\sigma^{-1} = (\\sigma(1)\\;\\sigma(3))(\\sigma(2)\\;\\sigma(5)) = (2\\;3)(4\\;5)$。",
      ),
      generate(rng) {
        const n = rng.int(5, 7);
        let s: Perm;
        let tau: Perm;
        let c: Perm;
        do {
          s = cyclePerm(n, rng.sample(range(0, n - 1), rng.int(2, 4)));
          tau = cyclePerm(n, rng.sample(range(0, n - 1), rng.int(3, 5)));
          c = conjugatePerm(s, tau);
        } while (permCycleTex(c) === permCycleTex(tau));
        const other = conjugatePerm(invertPerm(s), tau);
        return texChoice(
          rng,
          t(
            `In $S_{${n}}$, let $\\sigma = ${permCycleTex(s)}$ and $\\tau = ${permCycleTex(tau)}$. Find $\\sigma\\tau\\sigma^{-1}$.`,
            `在 $S_{${n}}$ 中，设 $\\sigma = ${permCycleTex(s)}$，$\\tau = ${permCycleTex(tau)}$。求 $\\sigma\\tau\\sigma^{-1}$。`,
          ),
          permCycleTex(c),
          [permCycleTex(other), permCycleTex(tau), permCycleTex(invertPerm(c)), permCycleTex(composePerm(s, tau))],
          t(
            `Apply $\\sigma$ to each point in the cycle of $\\tau$: $\\sigma\\tau\\sigma^{-1} = ${permCycleTex(c)}$.`,
            `对 $\\tau$ 的轮换中每个点作用 $\\sigma$：$\\sigma\\tau\\sigma^{-1} = ${permCycleTex(c)}$。`,
          ),
        );
      },
    },
  ],
};

/** maximalNormalSubgroups finds maximal subgroups of ℤₙ. */
export const maximalNormalSubgroups: TopicDef = {
  id: "maximal-normal-subgroups",
  title: t("Maximal Normal Subgroups", "极大正规子群"),
  summary: t(
    "A normal subgroup M ≠ G is maximal if no normal subgroup lies strictly between M and G. In ℤₙ the maximal subgroups are ⟨p⟩ for the primes p dividing n, of index p; so ⟨a⟩ is maximal exactly when gcd(a, n) is prime.",
    "若正规子群 M ≠ G，且 M 与 G 之间严格地不存在其他正规子群，则称 M 是极大正规子群。在 ℤₙ 中，极大子群是 ⟨p⟩，p 取遍 n 的素因子，其指数为 p；所以 ⟨a⟩ 是极大子群当且仅当 gcd(a, n) 是素数。",
  ),
  prerequisites: ["normal-subgroups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-maximal-subgroups-of-zn",
      title: t("Counting maximal subgroups", "数极大子群"),
      explanation: t(
        "Subgroups of a cyclic group match the divisors of its order, and the maximal ones come from dividing by a single prime. $\\mathbb{Z}_{60}$ has one maximal subgroup for each prime factor of $60 = 2^2 \\cdot 3 \\cdot 5$: $\\langle 2 \\rangle$, $\\langle 3 \\rangle$ and $\\langle 5 \\rangle$.",
        "循环群的子群与它的阶的因数一一对应，极大子群来自于除以单个素数。$\\mathbb{Z}_{60}$ 对 $60 = 2^2 \\cdot 3 \\cdot 5$ 的每个素因子各有一个极大子群：$\\langle 2 \\rangle$、$\\langle 3 \\rangle$ 与 $\\langle 5 \\rangle$。",
      ),
      generate(rng) {
        let n: number;
        let f: [number, number][];
        do {
          n = rng.int(6, 400);
          f = factorize(n);
        } while (f.length === 1 && f[0]![1] === 1);
        return numberProblem({
          prompt: t(`How many maximal normal subgroups does $${zTex(n)}$ have?`, `$${zTex(n)}$ 有多少个极大正规子群？`),
          answer: f.length,
          wrong: [divisors(n).length - 2, f.reduce((s, [, e]) => s + e, 0), f.length + 1],
          solution: t(
            `$${n} = ${f.map(([p, e]) => (e === 1 ? p : `${p}^{${e}}`)).join(" \\cdot ")}$ has the distinct prime factors $${f.map(([p]) => p).join(", ")}$, each giving a maximal subgroup $\\langle p \\rangle$.`,
            `$${n} = ${f.map(([p, e]) => (e === 1 ? p : `${p}^{${e}}`)).join(" \\cdot ")}$ 的不同素因子为 $${f.map(([p]) => p).join(", ")}$，每个给出一个极大子群 $\\langle p \\rangle$。`,
          ),
        });
      },
    },
    {
      id: "recognizing-maximal-subgroups-of-zn",
      title: t("Recognizing maximal subgroups", "识别极大子群"),
      explanation: t(
        "$\\langle a \\rangle$ has index $\\gcd(a, n)$ in $\\mathbb{Z}_n$. In $\\mathbb{Z}_{36}$, $\\langle 15 \\rangle = \\langle 3 \\rangle$ has index $3$, a prime, so it is maximal; $\\langle 6 \\rangle$ has index $6$ and lies inside $\\langle 2 \\rangle$.",
        "$\\langle a \\rangle$ 在 $\\mathbb{Z}_n$ 中的指数为 $\\gcd(a, n)$。在 $\\mathbb{Z}_{36}$ 中，$\\langle 15 \\rangle = \\langle 3 \\rangle$ 的指数为素数 $3$，所以是极大子群；$\\langle 6 \\rangle$ 的指数为 $6$，它包含在 $\\langle 2 \\rangle$ 中。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(12, 100);
          a = rng.int(2, n - 1);
        } while (gcd(a, n) === 1);
        const d = gcd(a, n);
        const prime = factorize(d).length === 1 && factorize(d)[0]![1] === 1;
        const p = factorize(d)[0]![0];
        return factProblem({
          prompt: t(
            `Is $\\langle ${a} \\rangle$ a maximal normal subgroup of $${zTex(n)}$?`,
            `$\\langle ${a} \\rangle$ 是 $${zTex(n)}$ 的极大正规子群吗？`,
          ),
          holds: prime,
          reason: prime
            ? t(
                `$\\langle ${a} \\rangle = \\langle ${d} \\rangle$ has prime index $${d}$.`,
                `$\\langle ${a} \\rangle = \\langle ${d} \\rangle$ 的指数为素数 $${d}$。`,
              )
            : t(
                `$\\langle ${a} \\rangle = \\langle ${d} \\rangle$ lies strictly inside $\\langle ${p} \\rangle$.`,
                `$\\langle ${a} \\rangle = \\langle ${d} \\rangle$ 严格包含在 $\\langle ${p} \\rangle$ 中。`,
              ),
        });
      },
    },
  ],
};

/** factorial is n!. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

/** cycleListTex writes a cycle given by one-based points. */
const cycleListTex = (c: readonly number[]) => `(${c.join("\\;")})`;

/** sortedCycle rotates a cycle so that it starts at its smallest point. */
function sortedCycle(c: readonly number[]): number[] {
  const i = c.indexOf(Math.min(...c));
  return [...c.slice(i), ...c.slice(0, i)];
}

/** theNormalizerOfASubgroup finds sizes of normalizers in dihedral and symmetric groups. */
export const theNormalizerOfASubgroup: TopicDef = {
  id: "the-normalizer-of-a-subgroup",
  title: t("The Normalizer of a Subgroup", "子群的正规化子"),
  summary: t(
    "The normalizer of a subgroup $H$ in $G$ is $N_G(H) = \\{g \\in G : gHg^{-1} = H\\}$. It is the largest subgroup of $G$ in which $H$ is normal, so $H \\trianglelefteq G$ exactly when $N_G(H) = G$.",
    "子群 $H$ 在 $G$ 中的正规化子为 $N_G(H) = \\{g \\in G : gHg^{-1} = H\\}$。它是 $G$ 中使 $H$ 正规的最大子群，所以 $H \\trianglelefteq G$ 当且仅当 $N_G(H) = G$。",
  ),
  prerequisites: ["normal-subgroups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "normalizers-in-dihedral-groups",
      figure: algebraDrawings2["the-normalizer-of-a-subgroup#normalizers-in-dihedral-groups"],
      title: t("Normalizers in $D_n$", "$D_n$ 中的正规化子"),
      explanation: t(
        "In $D_n$, $\\langle r^k s \\rangle = \\{e, r^ks\\}$. Conjugating by $r$ gives $r^{k+2}s$, so only rotations $r^j$ with $2j \\equiv 0$ normalize it. For $n$ odd, $N(\\langle r^ks \\rangle) = \\{e, r^ks\\}$; for $n$ even it also contains $r^{n/2}$ and $r^{k + n/2}s$, giving $4$ elements. Rotation subgroups are normal, with normalizer all of $D_n$.",
        "在 $D_n$ 中，$\\langle r^k s \\rangle = \\{e, r^ks\\}$。用 $r$ 共轭得 $r^{k+2}s$，所以只有满足 $2j \\equiv 0$ 的旋转 $r^j$ 正规化它。$n$ 为奇数时，$N(\\langle r^ks \\rangle) = \\{e, r^ks\\}$；$n$ 为偶数时还含 $r^{n/2}$ 与 $r^{k + n/2}s$，共 $4$ 个元素。旋转子群是正规的，正规化子为整个 $D_n$。",
      ),
      generate(rng) {
        const n = rng.int(3, 30);
        const k = rng.int(0, n - 1);
        const rotation = rng.bool(0.3);
        const h = rotation ? `r^{${k === 0 ? 1 : k}}` : k === 0 ? "s" : `r^{${k}}s`;
        const value = rotation ? 2 * n : n % 2 === 0 ? 4 : 2;
        return numberProblem({
          prompt: t(
            `In the dihedral group $D_{${n}}$ of order $${2 * n}$, how many elements does the normalizer of $\\langle ${h} \\rangle$ have?`,
            `在 $${2 * n}$ 阶二面体群 $D_{${n}}$ 中，$\\langle ${h} \\rangle$ 的正规化子有多少个元素？`,
          ),
          answer: value,
          wrong: rotation ? [n, 2, 4] : [n % 2 === 0 ? 2 : 4, n, 2 * n],
          solution: rotation
            ? t(
                "Every subgroup of the rotations is normal in $D_n$, so the normalizer is all of $D_n$.",
                "旋转群的每个子群在 $D_n$ 中都正规，所以正规化子是整个 $D_n$。",
              )
            : n % 2 === 0
              ? t(
                  `$${n}$ is even, so the normalizer is $\\{e, r^{${n / 2}}, ${h}, r^{${mod(k + n / 2, n)}}s\\}$.`,
                  `$${n}$ 为偶数，所以正规化子为 $\\{e, r^{${n / 2}}, ${h}, r^{${mod(k + n / 2, n)}}s\\}$。`,
                )
              : t(`$${n}$ is odd, so the normalizer is just $\\{e, ${h}\\}$.`, `$${n}$ 为奇数，所以正规化子就是 $\\{e, ${h}\\}$。`),
        });
      },
    },
    {
      id: "normalizers-in-symmetric-groups",
      title: t("Normalizers in $S_n$", "$S_n$ 中的正规化子"),
      explanation: t(
        "$\\sigma$ normalizes $\\langle (a\\;b) \\rangle$ exactly when $\\sigma$ maps $\\{a, b\\}$ to itself: $2 \\cdot (n - 2)!$ permutations. It normalizes $\\langle (a\\;b\\;c) \\rangle$ exactly when it maps $\\{a, b, c\\}$ to itself, since both $(a\\;b\\;c)$ and its inverse lie in the subgroup: $6 \\cdot (n - 3)!$ permutations.",
        "$\\sigma$ 正规化 $\\langle (a\\;b) \\rangle$ 当且仅当 $\\sigma$ 把 $\\{a, b\\}$ 映到自身：共 $2 \\cdot (n - 2)!$ 个置换。它正规化 $\\langle (a\\;b\\;c) \\rangle$ 当且仅当它把 $\\{a, b, c\\}$ 映到自身，因为 $(a\\;b\\;c)$ 及其逆都在该子群中：共 $6 \\cdot (n - 3)!$ 个置换。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const k = rng.int(2, 3);
        const c = sortedCycle(rng.sample(range(1, n), k));
        const value = factorial(k) * factorial(n - k);
        return numberProblem({
          prompt: t(
            `How many elements does the normalizer of $\\langle ${cycleListTex(c)} \\rangle$ in $S_{${n}}$ have?`,
            `$\\langle ${cycleListTex(c)} \\rangle$ 在 $S_{${n}}$ 中的正规化子有多少个元素？`,
          ),
          answer: value,
          wrong: [k * factorial(n - k), factorial(n - k), factorial(n) / k, factorial(n) / 2],
          solution: t(
            `The normalizer consists of the permutations mapping $\\{${c.join(", ")}\\}$ to itself: $${k}! \\cdot ${n - k}! = ${value}$.`,
            `正规化子由把 $\\{${c.join(", ")}\\}$ 映到自身的置换组成：$${k}! \\cdot ${n - k}! = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** theCenterOfAGroup finds centers of dihedral, symmetric and matrix groups. */
export const theCenterOfAGroup: TopicDef = {
  id: "the-center-of-a-group",
  title: t("The Center of a Group", "群的中心"),
  summary: t(
    "The center $Z(G) = \\{z \\in G : zg = gz \\text{ for all } g \\in G\\}$ is a normal subgroup; $G$ is abelian exactly when $Z(G) = G$. $Z(S_n)$ is trivial for $n \\ge 3$; $Z(D_n)$ is trivial for $n$ odd and $\\{e, r^{n/2}\\}$ for $n$ even; $Z(GL(2, F))$ consists of the nonzero scalar matrices; and $Z(G \\times H) = Z(G) \\times Z(H)$.",
    "中心 $Z(G) = \\{z \\in G : zg = gz,\\ \\forall g \\in G\\}$ 是正规子群；$G$ 是阿贝尔群当且仅当 $Z(G) = G$。$n \\ge 3$ 时 $Z(S_n)$ 平凡；$n$ 为奇数时 $Z(D_n)$ 平凡，$n$ 为偶数时 $Z(D_n) = \\{e, r^{n/2}\\}$；$Z(GL(2, F))$ 由非零数量矩阵组成；且 $Z(G \\times H) = Z(G) \\times Z(H)$。",
  ),
  prerequisites: ["normal-subgroups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sizes-of-centers",
      title: t("Sizes of centers", "中心的大小"),
      explanation: t(
        "The center of a direct product is the product of the centers, so find the center of each factor and multiply their sizes. $Z(D_6 \\times \\mathbb{Z}_5) = Z(D_6) \\times \\mathbb{Z}_5 = \\{e, r^3\\} \\times \\mathbb{Z}_5$, with $10$ elements. $Z(GL(2, \\mathbb{Z}_7))$ is the $6$ nonzero scalar matrices.",
        "直积的中心等于各因子中心的直积，所以求出每个因子的中心，再把它们的大小相乘。$Z(D_6 \\times \\mathbb{Z}_5) = Z(D_6) \\times \\mathbb{Z}_5 = \\{e, r^3\\} \\times \\mathbb{Z}_5$，有 $10$ 个元素。$Z(GL(2, \\mathbb{Z}_7))$ 是 $6$ 个非零数量矩阵。",
      ),
      generate(rng) {
        const n = rng.int(3, 20);
        const k = rng.int(2, 12);
        const kind = rng.int(0, 3);
        const zd = n % 2 === 0 ? 2 : 1;
        const p = rng.pick([2, 3, 5, 7, 11, 13, 17, 19, 23]);
        const [tex, value, how] = [
          [
            `D_{${n}}`,
            zd,
            t(
              `$${n}$ is ${n % 2 === 0 ? `even, so $Z(D_{${n}}) = \\{e, r^{${n / 2}}\\}$` : `odd, so $Z(D_{${n}})$ is trivial`}.`,
              `$${n}$ 为${n % 2 === 0 ? `偶数，所以 $Z(D_{${n}}) = \\{e, r^{${n / 2}}\\}$` : `奇数，所以 $Z(D_{${n}})$ 平凡`}。`,
            ),
          ],
          [
            `D_{${n}} \\times ${zTex(k)}`,
            zd * k,
            t(
              `$Z(D_{${n}} \\times ${zTex(k)}) = Z(D_{${n}}) \\times ${zTex(k)}$, and $|Z(D_{${n}})| = ${zd}$.`,
              `$Z(D_{${n}} \\times ${zTex(k)}) = Z(D_{${n}}) \\times ${zTex(k)}$，且 $|Z(D_{${n}})| = ${zd}$。`,
            ),
          ],
          [
            `S_{${Math.min(n, 9)}} \\times ${zTex(k)}`,
            k,
            t(
              `$Z(S_{${Math.min(n, 9)}})$ is trivial, so the center is $\\{e\\} \\times ${zTex(k)}$.`,
              `$Z(S_{${Math.min(n, 9)}})$ 平凡，所以中心为 $\\{e\\} \\times ${zTex(k)}$。`,
            ),
          ],
          [
            `GL(2, ${zTex(p)})`,
            p - 1,
            t(`The center is the nonzero scalar matrices $cI$, $c \\in ${zTex(p)}^*$.`, `中心是非零数量矩阵 $cI$，$c \\in ${zTex(p)}^*$。`),
          ],
        ][kind] as [string, number, Text];
        return numberProblem({
          prompt: t(`How many elements does the center of $${tex}$ have?`, `$${tex}$ 的中心有多少个元素？`),
          answer: value,
          wrong: kind === 3 ? [p, 1, (p - 1) ** 2] : [value === 1 ? 2 : 1, 2 * value, value + k],
          solution: t(`${how.en} So it has $${value}$ elements.`, `${how["zh-CN"]}所以它有 $${value}$ 个元素。`),
        });
      },
    },
    {
      id: "central-elements-of-dihedral-groups",
      figure: algebraDrawings2["the-center-of-a-group#central-elements-of-dihedral-groups"],
      title: t("Central elements of $D_n$", "$D_n$ 的中心元素"),
      explanation: t(
        "A rotation is central only when it equals its own inverse, which happens for the identity and for the half turn when there is one. Since $sr^k = r^{-k}s$, the rotation $r^k$ commutes with $s$ only when $r^k = r^{-k}$, that is, $2k \\equiv 0 \\pmod n$. A reflection $r^ks$ never commutes with $r$ when $n \\ge 3$.",
        "一个旋转只有在等于自己的逆时才属于中心，这对恒等元成立，对存在的半周旋转也成立。由于 $sr^k = r^{-k}s$，旋转 $r^k$ 仅当 $r^k = r^{-k}$，即 $2k \\equiv 0 \\pmod n$ 时与 $s$ 可交换。$n \\ge 3$ 时反射 $r^ks$ 从不与 $r$ 可交换。",
      ),
      generate(rng) {
        const holds = rng.bool();
        const n = holds ? 2 * rng.int(2, 12) : rng.int(3, 24);
        const reflection = !holds && rng.bool(0.4);
        let k = holds ? n / 2 : rng.int(1, n - 1);
        while (!holds && !reflection && mod(2 * k, n) === 0) k = rng.int(1, n - 1);
        return factProblem({
          prompt: t(
            `Is $${reflection ? `r^{${k}}s` : `r^{${k}}`}$ in the center of the dihedral group $D_{${n}}$ of order $${2 * n}$?`,
            `$${reflection ? `r^{${k}}s` : `r^{${k}}`}$ 在 $${2 * n}$ 阶二面体群 $D_{${n}}$ 的中心中吗？`,
          ),
          holds,
          reason: reflection
            ? t(
                `$r \\cdot r^{${k}}s = r^{${k + 1}}s$ but $r^{${k}}s \\cdot r = r^{${k - 1}}s$.`,
                `$r \\cdot r^{${k}}s = r^{${k + 1}}s$，而 $r^{${k}}s \\cdot r = r^{${k - 1}}s$。`,
              )
            : holds
              ? t(
                  `$r^{${k}} = r^{-${k}}$ since $2 \\cdot ${k} = ${n}$, so it commutes with $s$ as well as with the rotations.`,
                  `由于 $2 \\cdot ${k} = ${n}$，$r^{${k}} = r^{-${k}}$，所以它与 $s$ 以及各旋转都可交换。`,
                )
              : t(
                  `$sr^{${k}} = r^{-${k}}s \\ne r^{${k}}s$, since $2 \\cdot ${k} \\not\\equiv 0 \\pmod{${n}}$.`,
                  `$sr^{${k}} = r^{-${k}}s \\ne r^{${k}}s$，因为 $2 \\cdot ${k} \\not\\equiv 0 \\pmod{${n}}$。`,
                ),
        });
      },
    },
  ],
};

/** theCentralizerOfASubgroup finds sizes of centralizers in dihedral and symmetric groups. */
export const theCentralizerOfASubgroup: TopicDef = {
  id: "the-centralizer-of-a-subgroup",
  title: t("The Centralizer of a Subgroup", "子群的中心化子"),
  summary: t(
    "The centralizer of a subset $H$ of $G$ is $C_G(H) = \\{g \\in G : gh = hg \\text{ for all } h \\in H\\}$, a subgroup of the normalizer of $H$. The centralizer of a single element $a$ is $C(a) = \\{g : ga = ag\\}$; the center is the intersection of all centralizers.",
    "群 $G$ 的子集 $H$ 的中心化子为 $C_G(H) = \\{g \\in G : gh = hg,\\ \\forall h \\in H\\}$，它是 $H$ 的正规化子的子群。单个元素 $a$ 的中心化子为 $C(a) = \\{g : ga = ag\\}$；中心是所有中心化子之交。",
  ),
  prerequisites: ["the-center-of-a-group", "the-normalizer-of-a-subgroup"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "centralizers-in-dihedral-groups",
      title: t("Centralizers in $D_n$", "$D_n$ 中的中心化子"),
      explanation: t(
        "In $D_n$, a rotation $r^k$ commutes with all rotations, and with the reflections only if $2k \\equiv 0 \\pmod n$; so $|C(r^k)|$ is $2n$ or $n$. A reflection $r^ks$ commutes with $e$, itself, and when $n$ is even with $r^{n/2}$ and $r^{k+n/2}s$.",
        "在 $D_n$ 中，旋转 $r^k$ 与所有旋转可交换，仅当 $2k \\equiv 0 \\pmod n$ 时才与反射可交换；所以 $|C(r^k)|$ 为 $2n$ 或 $n$。反射 $r^ks$ 与 $e$、自身可交换，$n$ 为偶数时还与 $r^{n/2}$ 及 $r^{k+n/2}s$ 可交换。",
      ),
      generate(rng) {
        const n = rng.int(3, 24);
        const reflection = rng.bool(0.4);
        const k = n % 2 === 0 && rng.bool(0.3) ? n / 2 : rng.int(1, n - 1);
        const value = reflection ? (n % 2 === 0 ? 4 : 2) : mod(2 * k, n) === 0 ? 2 * n : n;
        const h = reflection ? `r^{${k}}s` : `r^{${k}}`;
        return numberProblem({
          prompt: t(
            `In the dihedral group $D_{${n}}$ of order $${2 * n}$, how many elements does the centralizer of $${h}$ have?`,
            `在 $${2 * n}$ 阶二面体群 $D_{${n}}$ 中，$${h}$ 的中心化子有多少个元素？`,
          ),
          answer: value,
          wrong: [n, 2 * n, 2, 4].filter((x) => x !== value),
          solution: reflection
            ? t(
                `$${h}$ commutes with $e$ and itself${n % 2 === 0 ? `, and since $${n}$ is even also with $r^{${n / 2}}$ and $r^{${mod(k + n / 2, n)}}s$` : ""}: $${value}$ elements.`,
                `$${h}$ 与 $e$ 及自身可交换${n % 2 === 0 ? `，由于 $${n}$ 为偶数，还与 $r^{${n / 2}}$ 及 $r^{${mod(k + n / 2, n)}}s$ 可交换` : ""}：共 $${value}$ 个元素。`,
              )
            : value === 2 * n
              ? t(
                  `$2 \\cdot ${k} \\equiv 0 \\pmod{${n}}$, so $${h}$ is central: the centralizer is all of $D_{${n}}$.`,
                  `$2 \\cdot ${k} \\equiv 0 \\pmod{${n}}$，所以 $${h}$ 在中心中：中心化子为整个 $D_{${n}}$。`,
                )
              : t(
                  `$${h}$ commutes with the $${n}$ rotations but with no reflection.`,
                  `$${h}$ 与 $${n}$ 个旋转可交换，但与任何反射都不可交换。`,
                ),
        });
      },
    },
    {
      id: "centralizers-in-symmetric-groups",
      title: t("Centralizers in $S_n$", "$S_n$ 中的中心化子"),
      explanation: t(
        "$\\sigma$ commutes with $(a\\;b)$ exactly when it maps $\\{a, b\\}$ to itself: $2 \\cdot (n - 2)!$ permutations. $\\sigma$ commutes with the $3$-cycle $(a\\;b\\;c)$ exactly when it acts on $\\{a, b, c\\}$ as a power of the cycle: $3 \\cdot (n - 3)!$ permutations. An $n$-cycle commutes only with its own $n$ powers.",
        "$\\sigma$ 与 $(a\\;b)$ 可交换当且仅当它把 $\\{a, b\\}$ 映到自身：共 $2 \\cdot (n - 2)!$ 个置换。$\\sigma$ 与 $3$-轮换 $(a\\;b\\;c)$ 可交换当且仅当它在 $\\{a, b, c\\}$ 上的作用是该轮换的幂：共 $3 \\cdot (n - 3)!$ 个置换。$n$-轮换只与它自己的 $n$ 个幂可交换。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const k = rng.pick([2, 3, n]);
        const c = sortedCycle(rng.sample(range(1, n), k));
        const value = k === n ? n : k * factorial(n - k);
        return numberProblem({
          prompt: t(
            `How many elements does the centralizer of $${cycleListTex(c)}$ in $S_{${n}}$ have?`,
            `$${cycleListTex(c)}$ 在 $S_{${n}}$ 中的中心化子有多少个元素？`,
          ),
          answer: value,
          wrong: [factorial(k) * factorial(n - k), factorial(n - k), k, factorial(n) / k].filter((x) => x !== value),
          solution:
            k === n
              ? t(
                  `${article(n, true)} $${n}$-cycle in $S_{${n}}$ commutes only with its $${n}$ powers.`,
                  `$S_{${n}}$ 中的 $${n}$-轮换只与它的 $${n}$ 个幂可交换。`,
                )
              : t(
                  `The centralizer acts on $\\{${c.join(", ")}\\}$ as a power of the cycle ($${k}$ ways) and arbitrarily on the other $${n - k}$ points: $${k} \\cdot ${n - k}! = ${value}$.`,
                  `中心化子在 $\\{${c.join(", ")}\\}$ 上的作用是该轮换的幂（$${k}$ 种），在其余 $${n - k}$ 个点上任意：$${k} \\cdot ${n - k}! = ${value}$。`,
                ),
        });
      },
    },
  ],
};

/** quotientGroups finds orders in quotients of cyclic groups and their products. */
export const quotientGroups: TopicDef = {
  id: "quotient-groups",
  title: t("Quotient Groups", "商群"),
  summary: t(
    "If N ⊴ G, the cosets of N form a group G/N under (aN)(bN) = abN, the quotient group, of order [G : N] = |G|/|N|. The order of aN in G/N is the least k ≥ 1 with aᵏ ∈ N. For example ℤₙ/⟨a⟩ is cyclic of order gcd(a, n).",
    "若 N ⊴ G，则 N 的陪集在运算 (aN)(bN) = abN 下构成群 G/N，称为商群，阶为 [G : N] = |G|/|N|。aN 在 G/N 中的阶是使 aᵏ ∈ N 的最小 k ≥ 1。例如 ℤₙ/⟨a⟩ 是 gcd(a, n) 阶循环群。",
  ),
  prerequisites: ["normal-subgroups", "cyclic-direct-product-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orders-of-quotients-of-direct-products",
      title: t("Orders of quotient groups", "商群的阶"),
      explanation: t(
        "The order of a quotient is the order of the group divided by the order of the subgroup, and the order of a cyclic subgroup is its generator's order. $(\\mathbb{Z}_4 \\times \\mathbb{Z}_6)/\\langle (2, 3) \\rangle$: $(2, 3)$ has order $\\operatorname{lcm}(2, 2) = 2$, so the quotient has $\\frac{24}{2} = 12$ elements.",
        "商群的阶等于群的阶除以子群的阶，而循环子群的阶就是它的生成元的阶。$(\\mathbb{Z}_4 \\times \\mathbb{Z}_6)/\\langle (2, 3) \\rangle$：$(2, 3)$ 的阶为 $\\operatorname{lcm}(2, 2) = 2$，所以商群有 $\\frac{24}{2} = 12$ 个元素。",
      ),
      generate(rng) {
        let m: number;
        let n: number;
        let a: number;
        let b: number;
        let o: number;
        do {
          m = rng.int(2, 12);
          n = rng.int(2, 12);
          a = rng.int(0, m - 1);
          b = rng.int(0, n - 1);
          o = lcm(additiveOrder(a, m), additiveOrder(b, n));
        } while (o === 1 || o === m * n);
        const value = (m * n) / o;
        return numberProblem({
          prompt: t(
            `How many elements does $(${zTex(m)} \\times ${zTex(n)})/\\langle ${pairTex(a, b)} \\rangle$ have?`,
            `$(${zTex(m)} \\times ${zTex(n)})/\\langle ${pairTex(a, b)} \\rangle$ 有多少个元素？`,
          ),
          answer: value,
          wrong: [o, (m * n) / (additiveOrder(a, m) * additiveOrder(b, n)) || 1, m * n, value * 2],
          solution: t(
            `$${pairTex(a, b)}$ has order $${o}$, so the quotient has $\\frac{${m * n}}{${o}} = ${value}$ elements.`,
            `$${pairTex(a, b)}$ 的阶为 $${o}$，所以商群有 $\\frac{${m * n}}{${o}} = ${value}$ 个元素。`,
          ),
        });
      },
    },
    {
      id: "orders-of-elements-of-quotient-groups",
      title: t("Orders of cosets", "陪集的阶"),
      explanation: t(
        "A coset has order equal to the smallest multiple of its representative that falls into the subgroup. In $\\mathbb{Z}_{24}/\\langle 8 \\rangle$, the coset $6 + \\langle 8 \\rangle$ has order the least $k$ with $6k \\in \\langle 8 \\rangle$, that is, $8 \\mid 6k$ modulo $24$: $k = 4$.",
        "一个陪集的阶等于使它的代表元落入子群的最小倍数。在 $\\mathbb{Z}_{24}/\\langle 8 \\rangle$ 中，陪集 $6 + \\langle 8 \\rangle$ 的阶是使 $6k \\in \\langle 8 \\rangle$ 的最小 $k$，即模 $24$ 下 $8 \\mid 6k$：$k = 4$。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        let d: number;
        do {
          n = rng.int(12, 60);
          a = rng.int(2, n - 1);
          d = gcd(a, n);
        } while (d < 4 || a === d);
        let x: number;
        do x = rng.int(1, n - 1);
        while (x % d === 0);
        const value = d / gcd(x, d);
        return numberProblem({
          prompt: t(
            `Find the order of $${x} + \\langle ${a} \\rangle$ in $${zTex(n)}/\\langle ${a} \\rangle$.`,
            `求 $${x} + \\langle ${a} \\rangle$ 在 $${zTex(n)}/\\langle ${a} \\rangle$ 中的阶。`,
          ),
          answer: value,
          wrong: [additiveOrder(x, n), d, n / d, gcd(x, d)].filter((v) => v !== value),
          solution: t(
            `$\\langle ${a} \\rangle = \\langle ${d} \\rangle$, so we need the least $k$ with $${d} \\mid ${x}k$: $k = \\frac{${d}}{\\gcd(${x}, ${d})} = ${value}$.`,
            `$\\langle ${a} \\rangle = \\langle ${d} \\rangle$，所以要找使 $${d} \\mid ${x}k$ 的最小 $k$：$k = \\frac{${d}}{\\gcd(${x}, ${d})} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** lagrangesTheorem applies Lagrange's theorem to orders and indices. */
export const lagrangesTheorem: TopicDef = {
  id: "lagranges-theorem",
  title: t("Lagrange's Theorem", "拉格朗日定理"),
  summary: t(
    "If H is a subgroup of a finite group G, then |H| divides |G|, and the index [G : H] = |G|/|H| is the number of cosets. So the order of every element divides |G|, and a group of prime order is cyclic. Indices multiply: if H ≤ K ≤ G then [G : H] = [G : K][K : H].",
    "若 H 是有限群 G 的子群，则 |H| 整除 |G|，指数 [G : H] = |G|/|H| 是陪集的个数。所以每个元素的阶都整除 |G|，素数阶群是循环群。指数可相乘：若 H ≤ K ≤ G，则 [G : H] = [G : K][K : H]。",
  ),
  prerequisites: ["left-and-right-cosets-in-permutation-groups", "cosets-of-the-multiplicative-groups-of-integers-modulo-n"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "possible-orders-of-subgroups",
      title: t("Possible orders", "可能的阶"),
      explanation: t(
        "A group of order $36$ can only have subgroups and elements of orders dividing $36$: $1, 2, 3, 4, 6, 9, 12, 18, 36$. No subgroup of order $8$ is possible.",
        "$36$ 阶群的子群与元素的阶只能是 $36$ 的因数：$1, 2, 3, 4, 6, 9, 12, 18, 36$。不可能有 $8$ 阶子群。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(12, 120);
        while (divisors(n).length < 6);
        const ds = divisors(n).filter((d) => d > 1 && d < n);
        const non = range(2, n - 1).filter((d) => n % d !== 0 && d < n / 2 + 4);
        const right = rng.pick(ds);
        const element = rng.bool();
        return texChoice(
          rng,
          element
            ? t(
                `A group $G$ has order $${n}$. Which of these could be the order of an element of $G$?`,
                `群 $G$ 的阶为 $${n}$。下列哪个可能是 $G$ 中某个元素的阶？`,
              )
            : t(
                `A group $G$ has order $${n}$. Which of these could be the order of a subgroup of $G$?`,
                `群 $G$ 的阶为 $${n}$。下列哪个可能是 $G$ 的某个子群的阶？`,
              ),
          `${right}`,
          rng.sample(non, 3).map(String),
          t(
            `By Lagrange's theorem the order must divide $${n}$; only $${right}$ does.`,
            `由拉格朗日定理，阶必须整除 $${n}$；只有 $${right}$ 满足。`,
          ),
        );
      },
    },
    {
      id: "indices-in-towers-of-subgroups",
      title: t("Indices in towers", "子群链中的指数"),
      explanation: t(
        "Indices multiply along a tower of subgroups, which follows from Lagrange's theorem applied at each level. If $|G| = 120$, $H \\le K \\le G$, $[G : K] = 5$ and $|H| = 4$, then $|K| = 24$ and $[K : H] = 6$; also $[G : H] = 30 = 5 \\cdot 6$.",
        "沿着子群链，指数相乘，这可以由在每一层应用拉格朗日定理得到。若 $|G| = 120$，$H \\le K \\le G$，$[G : K] = 5$，$|H| = 4$，则 $|K| = 24$，$[K : H] = 6$；且 $[G : H] = 30 = 5 \\cdot 6$。",
      ),
      generate(rng) {
        const h = rng.int(2, 8);
        const j = rng.int(2, 8);
        const i = rng.int(2, 8);
        const n = h * j * i;
        const ask = rng.int(0, 1);
        return numberProblem({
          prompt:
            ask === 0
              ? t(
                  `A group $G$ has order $${n}$, and $H \\le K \\le G$ with $[G : K] = ${i}$ and $|H| = ${h}$. Find $[K : H]$.`,
                  `群 $G$ 的阶为 $${n}$，$H \\le K \\le G$，$[G : K] = ${i}$，$|H| = ${h}$。求 $[K : H]$。`,
                )
              : t(
                  `A group $G$ has order $${n}$, and $H \\le K \\le G$ with $[G : K] = ${i}$ and $[K : H] = ${j}$. Find $|H|$.`,
                  `群 $G$ 的阶为 $${n}$，$H \\le K \\le G$，$[G : K] = ${i}$，$[K : H] = ${j}$。求 $|H|$。`,
                ),
          answer: ask === 0 ? j : h,
          wrong: ask === 0 ? [n / h, j * i, h * j] : [i * j, n / i, n / j],
          solution:
            ask === 0
              ? t(
                  `$|K| = \\frac{${n}}{${i}} = ${h * j}$, so $[K : H] = \\frac{${h * j}}{${h}} = ${j}$.`,
                  `$|K| = \\frac{${n}}{${i}} = ${h * j}$，所以 $[K : H] = \\frac{${h * j}}{${h}} = ${j}$。`,
                )
              : t(
                  `$[G : H] = ${i} \\cdot ${j} = ${i * j}$, so $|H| = \\frac{${n}}{${i * j}} = ${h}$.`,
                  `$[G : H] = ${i} \\cdot ${j} = ${i * j}$，所以 $|H| = \\frac{${n}}{${i * j}} = ${h}$。`,
                ),
        });
      },
    },
  ],
};

/** isPrime reports whether n is prime. */
const isPrime = (n: number) => n > 1 && factorize(n).length === 1 && factorize(n)[0]![1] === 1;

/** simpleGroups decides which groups are simple. */
export const simpleGroups: TopicDef = {
  id: "simple-groups",
  title: t("Simple Groups", "单群"),
  summary: t(
    "A nontrivial group is simple if its only normal subgroups are {e} and itself. An abelian group is simple exactly when it has prime order, so the abelian simple groups are the ℤₚ. Aₙ is simple for n ≥ 5, while Sₙ (n ≥ 3), Dₙ and A₄ are not. A normal subgroup M is maximal exactly when G/M is simple.",
    "若一个非平凡群的正规子群只有 {e} 与它自身，则称它是单群。阿贝尔群是单群当且仅当它的阶是素数，所以阿贝尔单群就是各 ℤₚ。n ≥ 5 时 Aₙ 是单群，而 Sₙ（n ≥ 3）、Dₙ 与 A₄ 不是。正规子群 M 是极大的当且仅当 G/M 是单群。",
  ),
  prerequisites: ["maximal-normal-subgroups", "lagranges-theorem", "the-alternating-group-on-n-symbols"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-simple-groups",
      title: t("Recognizing simple groups", "识别单群"),
      explanation: t(
        "$\\mathbb{Z}_{15}$ is not simple: $\\langle 3 \\rangle$ is a proper nontrivial normal subgroup. $S_n$ ($n \\ge 3$) is not simple since $A_n \\trianglelefteq S_n$, and $A_4$ has the normal subgroup $\\{e, (1\\;2)(3\\;4), (1\\;3)(2\\;4), (1\\;4)(2\\;3)\\}$. $A_5$ is simple.",
        "$\\mathbb{Z}_{15}$ 不是单群：$\\langle 3 \\rangle$ 是真非平凡正规子群。$S_n$（$n \\ge 3$）不是单群，因为 $A_n \\trianglelefteq S_n$；$A_4$ 有正规子群 $\\{e, (1\\;2)(3\\;4), (1\\;3)(2\\;4), (1\\;4)(2\\;3)\\}$。$A_5$ 是单群。",
      ),
      generate(rng) {
        const n = rng.int(2, 60);
        const k = rng.int(5, 12);
        const m = rng.int(3, 12);
        const facts: Fact[] = [
          {
            prompt: t(`Is $${zTex(n)}$ simple?`, `$${zTex(n)}$ 是单群吗？`),
            holds: isPrime(n),
            reason: isPrime(n)
              ? t(`It has prime order $${n}$, so its only subgroups are trivial.`, `它的阶为素数 $${n}$，所以只有平凡子群。`)
              : t(
                  `$\\langle ${factorize(n)[0]![0]} \\rangle$ is a proper nontrivial normal subgroup.`,
                  `$\\langle ${factorize(n)[0]![0]} \\rangle$ 是真非平凡正规子群。`,
                ),
          },
          {
            prompt: t(`Is $A_{${k}}$ simple?`, `$A_{${k}}$ 是单群吗？`),
            holds: true,
            reason: t("$A_n$ is simple for every $n \\ge 5$.", "对每个 $n \\ge 5$，$A_n$ 是单群。"),
          },
          {
            prompt: t(`Is $S_{${m}}$ simple?`, `$S_{${m}}$ 是单群吗？`),
            holds: false,
            reason: t(`$A_{${m}}$ is a proper nontrivial normal subgroup.`, `$A_{${m}}$ 是真非平凡正规子群。`),
          },
          {
            prompt: t(`Is the dihedral group $D_{${m}}$ simple?`, `二面体群 $D_{${m}}$ 是单群吗？`),
            holds: false,
            reason: t(
              "The rotation subgroup $\\langle r \\rangle$ has index $2$, so it is normal.",
              "旋转子群 $\\langle r \\rangle$ 的指数为 $2$，所以是正规子群。",
            ),
          },
          {
            prompt: t(`Is $${zTex(m)} \\times ${zTex(k)}$ simple?`, `$${zTex(m)} \\times ${zTex(k)}$ 是单群吗？`),
            holds: false,
            reason: t(
              `$${zTex(m)} \\times \\{0\\}$ is a proper nontrivial normal subgroup.`,
              `$${zTex(m)} \\times \\{0\\}$ 是真非平凡正规子群。`,
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "simple-quotients-of-zn",
      title: t("Simple quotients", "单商群"),
      explanation: t(
        "$\\mathbb{Z}_n/\\langle a \\rangle \\cong \\mathbb{Z}_d$ with $d = \\gcd(a, n)$, so the quotient is simple exactly when $d$ is prime, that is, when $\\langle a \\rangle$ is maximal.",
        "$\\mathbb{Z}_n/\\langle a \\rangle \\cong \\mathbb{Z}_d$，其中 $d = \\gcd(a, n)$，所以商群是单群当且仅当 $d$ 是素数，即 $\\langle a \\rangle$ 是极大子群。",
      ),
      generate(rng) {
        const n = rng.pick([24, 30, 36, 40, 42, 48, 60, 72, 84, 90, 96]);
        const as = rng.sample(
          range(2, n - 1).filter((a) => gcd(a, n) > 1),
          4,
        );
        const count = as.filter((a) => isPrime(gcd(a, n))).length;
        return numberProblem({
          prompt: t(
            `For how many of $a = ${as.join(", ")}$ is the quotient $${zTex(n)}/\\langle a \\rangle$ simple?`,
            `对 $a = ${as.join(", ")}$ 中的多少个，商群 $${zTex(n)}/\\langle a \\rangle$ 是单群？`,
          ),
          answer: count,
          wrong: [4 - count, as.filter((a) => isPrime(a)).length, count + 1].filter((v) => v !== count),
          solution: t(
            `The quotients are $${as.map((a) => zTex(gcd(a, n))).join(", ")}$; ${count === 0 ? "none has" : `$${count}$ of them have`} prime order.`,
            `各商群为 $${as.map((a) => zTex(gcd(a, n))).join(", ")}$；其中${count === 0 ? "没有一个" : `有 $${count}$ 个`}的阶为素数。`,
          ),
        });
      },
    },
  ],
};

/** abstractAlgebraQuotientTopics are the topics of Abstract Algebra unit 4. */
export const abstractAlgebraQuotientTopics: readonly TopicDef[] = [
  externalDirectProducts,
  cyclicDirectProductGroups,
  torsionGroups,
  finitelyGeneratedAbelianGroups,
  freeAbelianGroups,
  internalDirectProducts,
  cosetsOfTheAdditiveGroupsOfIntegersModuloN,
  cosetsOfTheMultiplicativeGroupsOfIntegersModuloN,
  cosetsOfInfiniteScalarGroups,
  leftAndRightCosetsInMatrixGroups,
  leftAndRightCosetsInPermutationGroups,
  normalSubgroups,
  maximalNormalSubgroups,
  theNormalizerOfASubgroup,
  theCenterOfAGroup,
  theCentralizerOfASubgroup,
  quotientGroups,
  lagrangesTheorem,
  simpleGroups,
];
