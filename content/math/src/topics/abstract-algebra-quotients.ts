import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, Q } from "@ga/subject-math";
import { algebraDrawings2 } from "../explanation-drawings-abstract-algebra-2.ts";

import { article, choiceProblem, numberProblem, why, withMistakes, yesNo } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { divisors, gcd, lcm, mod, modInverse, multiplicativeOrder, phi, texChoice, units } from "./abstract-algebra-common.ts";
import { type Mat2, mat2Tex, mul2 } from "./abstract-algebra-groups.ts";
import { composePerm, cyclePerm, invertPerm, type Perm, permCycleTex } from "./abstract-algebra-permutations.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";
import { range } from "./methods-of-proof-common.ts";

// Abstract Algebra unit 4: direct products, cosets, normal subgroups and quotient groups.

/** apart keeps the explained mistakes that differ from the answer and from each other. */
export const apart = <T extends { readonly value: Coefficient }>(answer: Coefficient, list: readonly T[]): T[] => {
  const asQ = (v: Coefficient) => (typeof v === "number" ? Q.of(v) : v);
  return list.filter((m, i) => !asQ(m.value).eq(asQ(answer)) && list.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
};

/** Decision is a yes-or-no question worked in steps, with what is wrong with the other answer. */
export interface Decision {
  readonly prompt: Text;
  readonly holds: boolean;
  readonly steps: readonly Step[];
  readonly check: Text;
  /** wrong says what is wrong with the answer that does not hold. */
  readonly wrong: Text;
}

/** decide asks a yes-or-no question, works the answer in steps, and says what is wrong with the other answer. */
export const decide = (d: Decision): Problem =>
  withMistakes(choiceProblem({ prompt: d.prompt, options: yesNo, correct: d.holds ? 0 : 1, solution: walked(d.steps, d.check) }), [
    { response: (yesNo[d.holds ? 1 : 0] as Text).en, why: d.wrong },
  ]);

/** because explains a wrong option of a LaTeX choice. */
export const because = (option: string, en: string, zh: string): Reason => [`$${option}$`, en, zh];

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
  intro: t(
    "In $\\mathbb{Z}_4 \\times \\mathbb{Z}_6$, pairs add coordinate by coordinate: $(3, 5) + (2, 4) = (5, 9) = (1, 3)$, reducing modulo $4$ and modulo $6$. The element $(2, 3)$ has order $2$: $2$ has order $2$ in $\\mathbb{Z}_4$ and $3$ has order $2$ in $\\mathbb{Z}_6$, and $\\operatorname{lcm}(2, 2) = 2$.\n\nCheck: $(2, 3) + (2, 3) = (4, 6) = (0, 0)$, while $(2, 3)$ itself is not $(0, 0)$.\n\nIn this lesson we find the orders and the inverses of elements of direct products.",
    "在 $\\mathbb{Z}_4 \\times \\mathbb{Z}_6$ 中，有序对按坐标相加：$(3, 5) + (2, 4) = (5, 9) = (1, 3)$，分别模 $4$ 和模 $6$ 约化。元素 $(2, 3)$ 的阶为 $2$：$2$ 在 $\\mathbb{Z}_4$ 中的阶为 $2$，$3$ 在 $\\mathbb{Z}_6$ 中的阶为 $2$，而 $\\operatorname{lcm}(2, 2) = 2$。\n\n检验：$(2, 3) + (2, 3) = (4, 6) = (0, 0)$，而 $(2, 3)$ 本身不是 $(0, 0)$。\n\n本课我们求直积中元素的阶与逆。",
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
        "An element of a direct product returns to the identity only when every coordinate does, so its order is the least common multiple of their orders. In $\\mathbb{Z}_{12} \\times \\mathbb{Z}_{18}$, $8$ has order $3$ in $\\mathbb{Z}_{12}$ and $4$ has order $9$ in $\\mathbb{Z}_{18}$, so $(8, 4)$ has order $\\operatorname{lcm}(3, 9) = 9$.\n\nIn $\\mathbb{Z}_{30} \\times \\mathbb{Z}_{28}$, $6$ has order $\\frac{30}{\\gcd(6, 30)} = 5$ and $7$ has order $\\frac{28}{\\gcd(7, 28)} = 4$, so $(6, 7)$ has order $\\operatorname{lcm}(5, 4) = 20$.\n\nCheck: $20(6, 7) = (120, 140)$, and $120 = 4(30)$ and $140 = 5(28)$, so both coordinates are $0$.\n\n> **Watch out.** The order is the least common multiple of the coordinate orders, not their product: $(8, 4)$ has order $9$, not $3 \\cdot 9 = 27$. Nor is it $\\operatorname{lcm}(12, 18) = 36$, which uses the moduli instead of the orders.",
        "直积中的元素只有在每个坐标都回到单位元时才回到单位元，所以它的阶是各坐标阶的最小公倍数。在 $\\mathbb{Z}_{12} \\times \\mathbb{Z}_{18}$ 中，$8$ 在 $\\mathbb{Z}_{12}$ 中的阶为 $3$，$4$ 在 $\\mathbb{Z}_{18}$ 中的阶为 $9$，所以 $(8, 4)$ 的阶为 $\\operatorname{lcm}(3, 9) = 9$。\n\n在 $\\mathbb{Z}_{30} \\times \\mathbb{Z}_{28}$ 中，$6$ 的阶为 $\\frac{30}{\\gcd(6, 30)} = 5$，$7$ 的阶为 $\\frac{28}{\\gcd(7, 28)} = 4$，所以 $(6, 7)$ 的阶为 $\\operatorname{lcm}(5, 4) = 20$。\n\n检验：$20(6, 7) = (120, 140)$，而 $120 = 4(30)$，$140 = 5(28)$，所以两个坐标都是 $0$。\n\n> **注意。** 阶是各坐标阶的最小公倍数，而不是它们的积：$(8, 4)$ 的阶是 $9$，不是 $3 \\cdot 9 = 27$。也不是 $\\operatorname{lcm}(12, 18) = 36$，那用的是模而不是阶。",
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
          mistakes: apart(value, [
            why(
              oa * ob,
              `That multiplies the orders $${oa}$ and $${ob}$; the order is their least common multiple.`,
              `那是把阶 $${oa}$ 与 $${ob}$ 相乘；阶应是它们的最小公倍数。`,
            ),
            why(
              lcm(m, n),
              `That is $\\operatorname{lcm}(${m}, ${n})$, the order of $(1, 1)$; use the orders of $${a}$ and $${b}$ instead.`,
              `那是 $\\operatorname{lcm}(${m}, ${n})$，即 $(1, 1)$ 的阶；应使用 $${a}$ 与 $${b}$ 的阶。`,
            ),
            why(
              Math.max(oa, ob),
              "That is the order of one coordinate only; both coordinates must return to $0$ together.",
              "那只是一个坐标的阶；两个坐标必须同时回到 $0$。",
            ),
            why(m * n, "That is the number of elements of the whole group.", "那是整个群的元素个数。"),
          ]),
          solution: walked(
            [
              [
                ["Find the order of each coordinate", "求各坐标的阶"],
                t(
                  `$${a}$ has order $\\frac{${m}}{\\gcd(${a}, ${m})} = ${oa}$ in $${zTex(m)}$, and $${b}$ has order $\\frac{${n}}{\\gcd(${b}, ${n})} = ${ob}$ in $${zTex(n)}$.`,
                  `$${a}$ 在 $${zTex(m)}$ 中的阶为 $\\frac{${m}}{\\gcd(${a}, ${m})} = ${oa}$，$${b}$ 在 $${zTex(n)}$ 中的阶为 $\\frac{${n}}{\\gcd(${b}, ${n})} = ${ob}$。`,
                ),
              ],
              [
                ["Take the least common multiple", "取最小公倍数"],
                t(
                  `The order of $${pairTex(a, b)}$ is $\\operatorname{lcm}(${oa}, ${ob}) = ${value}$.`,
                  `$${pairTex(a, b)}$ 的阶为 $\\operatorname{lcm}(${oa}, ${ob}) = ${value}$。`,
                ),
              ],
            ],
            t(
              `$${value}(${a}) = ${value * a}$ is a multiple of $${m}$, and $${value}(${b}) = ${value * b}$ is a multiple of $${n}$.`,
              `$${value}(${a}) = ${value * a}$ 是 $${m}$ 的倍数，$${value}(${b}) = ${value * b}$ 是 $${n}$ 的倍数。`,
            ),
          ),
        });
      },
    },
    {
      id: "inverses-in-direct-products",
      title: t("Inverses in direct products", "直积中的逆"),
      explanation: t(
        "The operation in a direct product acts coordinate by coordinate, so the inverse takes the inverse in each coordinate's own group. Invert in each coordinate with that coordinate's operation. In $U(10) \\times \\mathbb{Z}_8$, the inverse of $(3, 5)$ is $(7, 3)$: $3 \\cdot 7 \\equiv 1 \\pmod{10}$ and $5 + 3 \\equiv 0 \\pmod 8$.\n\nIn $U(35) \\times \\mathbb{Z}_{24}$, the inverse of $(2, 5)$ is $(18, 19)$: $2 \\cdot 18 = 36 \\equiv 1 \\pmod{35}$ and $5 + 19 = 24 \\equiv 0 \\pmod{24}$.\n\nCheck: $(2, 5)(18, 19) = (36, 24) = (1, 0)$, the identity of $U(35) \\times \\mathbb{Z}_{24}$.\n\n> **Watch out.** $U(n)$ is a group under multiplication, so the inverse of $2$ there is $18$, not the additive inverse $35 - 2 = 33$. And the second coordinate must be inverted too: keeping $5$ gives $(18, 5)$, which is wrong.",
        "直积中的运算逐个坐标进行，所以逆元在每个坐标所属的群中分别取逆。在每个坐标上用该坐标的运算求逆。在 $U(10) \\times \\mathbb{Z}_8$ 中，$(3, 5)$ 的逆为 $(7, 3)$：$3 \\cdot 7 \\equiv 1 \\pmod{10}$，$5 + 3 \\equiv 0 \\pmod 8$。\n\n在 $U(35) \\times \\mathbb{Z}_{24}$ 中，$(2, 5)$ 的逆为 $(18, 19)$：$2 \\cdot 18 = 36 \\equiv 1 \\pmod{35}$，$5 + 19 = 24 \\equiv 0 \\pmod{24}$。\n\n检验：$(2, 5)(18, 19) = (36, 24) = (1, 0)$，正是 $U(35) \\times \\mathbb{Z}_{24}$ 的单位元。\n\n> **注意。** $U(n)$ 在乘法下成群，所以 $2$ 在其中的逆是 $18$，而不是加法逆元 $35 - 2 = 33$。第二个坐标也要取逆：保留 $5$ 得到 $(18, 5)$，是错的。",
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
        return reasoned(
          texChoice(
            rng,
            t(
              `Find the inverse of $${pairTex(a, b)}$ in $U(${m}) \\times ${zTex(n)}$.`,
              `求 $${pairTex(a, b)}$ 在 $U(${m}) \\times ${zTex(n)}$ 中的逆。`,
            ),
            pairTex(ai, n - b),
            [pairTex(m - a, n - b), pairTex(ai, b), pairTex(a, n - b), pairTex(m - a, b)],
            walked(
              [
                [
                  ["Invert in the group of units", "在单位群中求逆"],
                  t(
                    `$U(${m})$ is a group under multiplication, and $${a} \\cdot ${ai} = ${a * ai} \\equiv 1 \\pmod{${m}}$, so the first coordinate is $${ai}$.`,
                    `$U(${m})$ 在乘法下成群，而 $${a} \\cdot ${ai} = ${a * ai} \\equiv 1 \\pmod{${m}}$，所以第一个坐标为 $${ai}$。`,
                  ),
                ],
                [
                  ["Invert in the additive group", "在加法群中求逆"],
                  t(
                    `$${zTex(n)}$ is a group under addition, and $${b} + ${n - b} = ${n} \\equiv 0$, so the second coordinate is $${n - b}$.`,
                    `$${zTex(n)}$ 在加法下成群，而 $${b} + ${n - b} = ${n} \\equiv 0$，所以第二个坐标为 $${n - b}$。`,
                  ),
                ],
              ],
              t(
                `$${pairTex(a, b)}${pairTex(ai, n - b)} = ${pairTex(a * ai, n)} = (1, 0)$, the identity.`,
                `$${pairTex(a, b)}${pairTex(ai, n - b)} = ${pairTex(a * ai, n)} = (1, 0)$，正是单位元。`,
              ),
            ),
          ),
          [
            because(
              pairTex(m - a, n - b),
              `$${m - a}$ is the additive inverse of $${a}$; in $U(${m})$ the inverse is multiplicative, $${ai}$.`,
              `$${m - a}$ 是 $${a}$ 的加法逆元；在 $U(${m})$ 中要取乘法逆元 $${ai}$。`,
            ),
            because(
              pairTex(ai, b),
              `The second coordinate is left as $${b}$; its inverse in $${zTex(n)}$ is $${n - b}$.`,
              `第二个坐标保留成了 $${b}$；它在 $${zTex(n)}$ 中的逆是 $${n - b}$。`,
            ),
            because(
              pairTex(a, n - b),
              `The first coordinate is left as $${a}$; its inverse in $U(${m})$ is $${ai}$.`,
              `第一个坐标保留成了 $${a}$；它在 $U(${m})$ 中的逆是 $${ai}$。`,
            ),
            because(
              pairTex(m - a, b),
              `Neither coordinate is inverted correctly: the inverse is $${pairTex(ai, n - b)}$.`,
              `两个坐标都没有正确求逆：逆应为 $${pairTex(ai, n - b)}$。`,
            ),
          ],
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
  intro: t(
    "$\\mathbb{Z}_3 \\times \\mathbb{Z}_4$ is cyclic: $\\gcd(3, 4) = 1$, so $(1, 1)$ has order $\\operatorname{lcm}(3, 4) = 12$, the size of the group. $\\mathbb{Z}_2 \\times \\mathbb{Z}_4$ is not: every element has order dividing $\\operatorname{lcm}(2, 4) = 4$, less than its $8$ elements.\n\nCheck: $4(1, 1) = (4, 4) = (1, 0)$ and $6(1, 1) = (0, 2)$ in $\\mathbb{Z}_3 \\times \\mathbb{Z}_4$, neither $(0, 0)$, while $12(1, 1) = (0, 0)$.\n\nIn this lesson we decide when a product of cyclic groups is cyclic, and count its elements of a given order.",
    "$\\mathbb{Z}_3 \\times \\mathbb{Z}_4$ 是循环群：$\\gcd(3, 4) = 1$，所以 $(1, 1)$ 的阶为 $\\operatorname{lcm}(3, 4) = 12$，等于群的大小。$\\mathbb{Z}_2 \\times \\mathbb{Z}_4$ 不是：每个元素的阶都整除 $\\operatorname{lcm}(2, 4) = 4$，小于它的 $8$ 个元素。\n\n检验：在 $\\mathbb{Z}_3 \\times \\mathbb{Z}_4$ 中，$4(1, 1) = (4, 4) = (1, 0)$，$6(1, 1) = (0, 2)$，都不是 $(0, 0)$，而 $12(1, 1) = (0, 0)$。\n\n本课我们判断循环群的直积何时是循环群，并数出其中给定阶的元素。",
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
        "A product of two cyclic groups is cyclic exactly when their orders are coprime, because only then does some element reach the full order. $\\mathbb{Z}_4 \\times \\mathbb{Z}_9$ is cyclic since $\\gcd(4, 9) = 1$: $(1, 1)$ has order $36$. $\\mathbb{Z}_6 \\times \\mathbb{Z}_4$ is not: every element has order dividing $\\operatorname{lcm}(6, 4) = 12 < 24$.\n\n$\\mathbb{Z}_{27} \\times \\mathbb{Z}_{32}$ is cyclic, since $\\gcd(27, 32) = 1$ and $(1, 1)$ has order $864$. $\\mathbb{Z}_{30} \\times \\mathbb{Z}_{45}$ is not, since $\\gcd(30, 45) = 15$ and every order divides $\\operatorname{lcm}(30, 45) = 90 < 1350$.\n\nCheck: $27 \\cdot 32 = 864$, so $(1, 1)$ reaches the size of the group.\n\n> **Watch out.** With three or more factors the moduli must be coprime in every pair, not just have no common factor overall: $\\mathbb{Z}_2 \\times \\mathbb{Z}_3 \\times \\mathbb{Z}_4$ is not cyclic, because $\\gcd(2, 4) = 2$, even though $\\gcd(2, 3, 4) = 1$.",
        "两个循环群的直积是循环群，当且仅当它们的阶互素，因为只有这时才有元素达到全部的阶。$\\mathbb{Z}_4 \\times \\mathbb{Z}_9$ 是循环群，因为 $\\gcd(4, 9) = 1$：$(1, 1)$ 的阶为 $36$。$\\mathbb{Z}_6 \\times \\mathbb{Z}_4$ 不是：每个元素的阶都整除 $\\operatorname{lcm}(6, 4) = 12 < 24$。\n\n$\\mathbb{Z}_{27} \\times \\mathbb{Z}_{32}$ 是循环群，因为 $\\gcd(27, 32) = 1$，$(1, 1)$ 的阶为 $864$。$\\mathbb{Z}_{30} \\times \\mathbb{Z}_{45}$ 不是，因为 $\\gcd(30, 45) = 15$，每个阶都整除 $\\operatorname{lcm}(30, 45) = 90 < 1350$。\n\n检验：$27 \\cdot 32 = 864$，所以 $(1, 1)$ 的阶达到群的大小。\n\n> **注意。** 有三个或更多因子时，模必须两两互素，而不只是整体没有公因子：$\\mathbb{Z}_2 \\times \\mathbb{Z}_3 \\times \\mathbb{Z}_4$ 不是循环群，因为 $\\gcd(2, 4) = 2$，尽管 $\\gcd(2, 3, 4) = 1$。",
      ),
      generate(rng) {
        const ns = range(1, rng.bool(0.7) ? 2 : 3).map(() => rng.int(2, 25));
        const coprime = ns.every((x, i) => ns.every((y, j) => i === j || gcd(x, y) === 1));
        const tex = ns.map(zTex).join(" \\times ");
        const size = ns.reduce((a, b) => a * b, 1);
        const top = ns.reduce((a, b) => lcm(a, b), 1);
        const pairs = ns.flatMap((x, i) => ns.slice(i + 1).map((y) => [x, y] as const));
        const shared = pairs.find(([x, y]) => gcd(x, y) > 1);
        const ones = `(${ns.map(() => 1).join(", ")})`;
        return decide({
          prompt: t(`Is $${tex}$ cyclic?`, `$${tex}$ 是循环群吗？`),
          holds: coprime,
          steps: [
            [
              ["Compare the moduli in pairs", "两两比较各模"],
              shared
                ? t(
                    `$\\gcd(${shared[0]}, ${shared[1]}) = ${gcd(shared[0], shared[1])} > 1$, so the moduli are not pairwise coprime.`,
                    `$\\gcd(${shared[0]}, ${shared[1]}) = ${gcd(shared[0], shared[1])} > 1$，所以各模不是两两互素。`,
                  )
                : t(
                    `$${pairs.map(([x, y]) => `\\gcd(${x}, ${y}) = 1`).join("$, $")}$, so the moduli are pairwise coprime.`,
                    `$${pairs.map(([x, y]) => `\\gcd(${x}, ${y}) = 1`).join("$，$")}$，所以各模两两互素。`,
                  ),
            ],
            [
              ["Compare the largest order with the size", "比较最大的阶与群的大小"],
              coprime
                ? t(
                    `So $${ones}$ has order $\\operatorname{lcm}(${ns.join(", ")}) = ${size}$, the size of the group, and generates it: yes, it is cyclic.`,
                    `所以 $${ones}$ 的阶为 $\\operatorname{lcm}(${ns.join(", ")}) = ${size}$，等于群的大小，并生成整个群：是循环群。`,
                  )
                : t(
                    `So every element has order dividing $\\operatorname{lcm}(${ns.join(", ")}) = ${top}$, and no element can generate all $${size}$ elements: no, it is not cyclic.`,
                    `所以每个元素的阶都整除 $\\operatorname{lcm}(${ns.join(", ")}) = ${top}$，没有元素能生成全部 $${size}$ 个元素：不是循环群。`,
                  ),
            ],
          ],
          check: coprime
            ? t(
                `$${ns.join(" \\cdot ")} = ${size}$ equals $\\operatorname{lcm}(${ns.join(", ")})$, as it must when no two moduli share a factor.`,
                `$${ns.join(" \\cdot ")} = ${size}$ 等于 $\\operatorname{lcm}(${ns.join(", ")})$，任意两个模都没有公因子时理应如此。`,
              )
            : t(`$${top} < ${ns.join(" \\cdot ")} = ${size}$.`, `$${top} < ${ns.join(" \\cdot ")} = ${size}$。`),
          wrong: coprime
            ? t(
                `The moduli are pairwise coprime, so $${ones}$ has order $${size}$ and generates the group.`,
                `各模两两互素，所以 $${ones}$ 的阶为 $${size}$，生成整个群。`,
              )
            : t(
                `No element has order more than $${top}$, so none generates all $${size}$ elements.`,
                `没有元素的阶超过 $${top}$，所以没有元素能生成全部 $${size}$ 个元素。`,
              ),
        });
      },
    },
    {
      id: "counting-elements-of-a-given-order-in-direct-products",
      title: t("Counting elements of a given order", "数给定阶的元素"),
      explanation: t(
        "Since the order is a least common multiple, count the pairs of coordinate orders whose least common multiple is the target. In $\\mathbb{Z}_2 \\times \\mathbb{Z}_4$, the elements of order $2$ are those $(a, b) \\ne (0, 0)$ with $2a = 0$ and $2b = 0$: $(1, 0), (0, 2), (1, 2)$. So there are $3$.\n\nIn $\\mathbb{Z}_{15} \\times \\mathbb{Z}_{20}$, an element has order $5$ when both coordinate orders divide $5$ and they are not both $1$. Each factor has $5$ elements of order dividing $5$, so there are $5 \\cdot 5 - 1 = 24$ elements of order $5$.\n\nCheck: by coordinate orders, $(5, 5)$ gives $4 \\cdot 4 = 16$ elements, $(5, 1)$ gives $4$ and $(1, 5)$ gives $4$, and $16 + 4 + 4 = 24$.\n\n> **Watch out.** $\\varphi(d)$ counts the elements of order $d$ in a cyclic group only. $\\mathbb{Z}_2 \\times \\mathbb{Z}_4$ has $3$ elements of order $2$, not $\\varphi(2) = 1$.",
        "由于阶是最小公倍数，所以要数出那些坐标阶的组合，使它们的最小公倍数等于目标值。在 $\\mathbb{Z}_2 \\times \\mathbb{Z}_4$ 中，$2$ 阶元素是满足 $2a = 0$、$2b = 0$ 且 $(a, b) \\ne (0, 0)$ 的元素：$(1, 0), (0, 2), (1, 2)$。所以共 $3$ 个。\n\n在 $\\mathbb{Z}_{15} \\times \\mathbb{Z}_{20}$ 中，元素的阶为 $5$，当且仅当两个坐标的阶都整除 $5$ 且不都为 $1$。每个因子都有 $5$ 个阶整除 $5$ 的元素，所以 $5$ 阶元素共有 $5 \\cdot 5 - 1 = 24$ 个。\n\n检验：按坐标的阶分类，$(5, 5)$ 给出 $4 \\cdot 4 = 16$ 个，$(5, 1)$ 给出 $4$ 个，$(1, 5)$ 给出 $4$ 个，而 $16 + 4 + 4 = 24$。\n\n> **注意。** $\\varphi(d)$ 只在循环群中计数 $d$ 阶元素。$\\mathbb{Z}_2 \\times \\mathbb{Z}_4$ 有 $3$ 个 $2$ 阶元素，而不是 $\\varphi(2) = 1$ 个。",
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
        const terms = divisors(m).flatMap((r) =>
          divisors(n)
            .filter((s) => lcm(r, s) === d)
            .map((s) => [r, s, phi(r) * phi(s)] as const),
        );
        return numberProblem({
          prompt: t(
            `How many elements of order $${d}$ does $${zTex(m)} \\times ${zTex(n)}$ have?`,
            `$${zTex(m)} \\times ${zTex(n)}$ 有多少个 $${d}$ 阶元素？`,
          ),
          answer: count,
          mistakes: apart(count, [
            why(
              phi(d),
              `That is $\\varphi(${d})$, the count in a cyclic group; here count the pairs of coordinate orders.`,
              `那是 $\\varphi(${d})$，即循环群中的个数；这里要按坐标阶的组合来数。`,
            ),
            why(
              gcd(d, m) * gcd(d, n),
              `That counts every element whose order divides $${d}$, including those of smaller order.`,
              `那数的是阶整除 $${d}$ 的所有元素，包括阶更小的元素。`,
            ),
            why(d, "That is the order itself, not the number of elements with that order.", "那是阶本身，而不是具有该阶的元素个数。"),
          ]),
          solution: walked(
            [
              [
                ["List the coordinate orders", "列出坐标的阶"],
                t(
                  `$(a, b)$ has order $\\operatorname{lcm}(|a|, |b|)$, where $|a|$ divides $${m}$ and $|b|$ divides $${n}$; each factor $${zTex(m)}$ has $\\varphi(r)$ elements of each order $r$ dividing $${m}$.`,
                  `$(a, b)$ 的阶为 $\\operatorname{lcm}(|a|, |b|)$，其中 $|a|$ 整除 $${m}$，$|b|$ 整除 $${n}$；对整除 $${m}$ 的每个 $r$，因子 $${zTex(m)}$ 中恰有 $\\varphi(r)$ 个 $r$ 阶元素。`,
                ),
              ],
              [
                ["Add the pairs whose lcm is the order", "把最小公倍数等于该阶的组合相加"],
                t(
                  `${terms.map(([r, s, c]) => `$(${r}, ${s})$ gives $${c}$`).join(", ")}, so there are $${terms.map(([, , c]) => c).join(" + ")} = ${count}$ elements of order $${d}$.`,
                  `${terms.map(([r, s, c]) => `$(${r}, ${s})$ 给出 $${c}$ 个`).join("，")}，所以 $${d}$ 阶元素共有 $${terms.map(([, , c]) => c).join(" + ")} = ${count}$ 个。`,
                ),
              ],
            ],
            t(
              `The elements whose order divides $${d}$ number $\\gcd(${d}, ${m}) \\gcd(${d}, ${n}) = ${gcd(d, m) * gcd(d, n)}$, at least the $${count}$ found.`,
              `阶整除 $${d}$ 的元素共有 $\\gcd(${d}, ${m}) \\gcd(${d}, ${n}) = ${gcd(d, m) * gcd(d, n)}$ 个，不少于求得的 $${count}$ 个。`,
            ),
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
  intro: t(
    "In $\\mathbb{Z} \\times \\mathbb{Z}_4$, the element $(0, 2)$ is a torsion element of order $2$, while $(1, 0)$ has infinite order. The torsion subgroup is $\\{0\\} \\times \\mathbb{Z}_4$, with $4$ elements.\n\nCheck: $2(0, 2) = (0, 4) = (0, 0)$, while $m(1, 0) = (m, 0)$ is never $(0, 0)$ for $m \\ne 0$.\n\nIn this lesson we recognize elements of finite order and count the elements of torsion subgroups.",
    "在 $\\mathbb{Z} \\times \\mathbb{Z}_4$ 中，$(0, 2)$ 是阶为 $2$ 的挠元，而 $(1, 0)$ 的阶是无限的。挠子群为 $\\{0\\} \\times \\mathbb{Z}_4$，有 $4$ 个元素。\n\n检验：$2(0, 2) = (0, 4) = (0, 0)$，而当 $m \\ne 0$ 时 $m(1, 0) = (m, 0)$ 永远不是 $(0, 0)$。\n\n本课我们识别有限阶元素，并数出挠子群的元素个数。",
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
        "$(0, 3)$ has finite order in $\\mathbb{Z} \\times \\mathbb{Z}_6$, but $(2, 3)$ does not: its first coordinate never returns to $0$. In $\\mathbb{R}^* \\times \\mathbb{Z}_n$, the first coordinate must be $\\pm 1$.\n\nAn element of a product has finite order exactly when every coordinate does. In $\\mathbb{C}^* \\times \\mathbb{Z}_{20}$, $(e^{2\\pi i / 12}, 15)$ has finite order $\\operatorname{lcm}(12, 4) = 12$, but $(2i, 15)$ does not, since $|2i| = 2$.\n\nCheck: $12 \\cdot 15 = 180 = 9(20)$, and $(e^{2\\pi i / 12})^{12} = 1$.\n\n> **Watch out.** One coordinate of infinite order makes the whole element of infinite order, however small the order of the others. And $-1$ in $\\mathbb{R}^*$ does have finite order, $2$.",
        "$(0, 3)$ 在 $\\mathbb{Z} \\times \\mathbb{Z}_6$ 中是有限阶，而 $(2, 3)$ 不是：它的第一个坐标永远回不到 $0$。在 $\\mathbb{R}^* \\times \\mathbb{Z}_n$ 中，第一个坐标必须是 $\\pm 1$。\n\n直积中的元素是有限阶，当且仅当每个坐标都是有限阶。在 $\\mathbb{C}^* \\times \\mathbb{Z}_{20}$ 中，$(e^{2\\pi i / 12}, 15)$ 是有限阶，阶为 $\\operatorname{lcm}(12, 4) = 12$；而 $(2i, 15)$ 不是，因为 $|2i| = 2$。\n\n检验：$12 \\cdot 15 = 180 = 9(20)$，而 $(e^{2\\pi i / 12})^{12} = 1$。\n\n> **注意。** 只要有一个坐标是无限阶，整个元素就是无限阶，不论其他坐标的阶多小。而 $\\mathbb{R}^*$ 中的 $-1$ 确实是有限阶，阶为 $2$。",
      ),
      generate(rng) {
        const n = rng.int(3, 15);
        const b = rng.int(1, n - 1);
        const k = rng.int(2, 9);
        const ob = additiveOrder(b, n);
        const [l2, lk] = [lcm(2, ob), lcm(k, ob)];
        const facts: Decision[] = [
          {
            prompt: t(
              `Does $${pairTex(0, b)}$ have finite order in $\\mathbb{Z} \\times ${zTex(n)}$?`,
              `$${pairTex(0, b)}$ 在 $\\mathbb{Z} \\times ${zTex(n)}$ 中是有限阶吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Look at the first coordinate", "看第一个坐标"],
                t("$0$ is the identity of $\\mathbb{Z}$, of order $1$.", "$0$ 是 $\\mathbb{Z}$ 的单位元，阶为 $1$。"),
              ],
              [
                ["Look at the second coordinate", "看第二个坐标"],
                t(
                  `$${b}$ has order $${ob}$ in $${zTex(n)}$, so the pair has order $${ob}$: yes, it has finite order.`,
                  `$${b}$ 在 $${zTex(n)}$ 中的阶为 $${ob}$，所以这个有序对的阶为 $${ob}$：是有限阶。`,
                ),
              ],
            ],
            check: t(
              `$${ob}${pairTex(0, b)} = ${pairTex(0, ob * b)}$, and $${ob * b}$ is a multiple of $${n}$, so this is $(0, 0)$.`,
              `$${ob}${pairTex(0, b)} = ${pairTex(0, ob * b)}$，而 $${ob * b}$ 是 $${n}$ 的倍数，所以它等于 $(0, 0)$。`,
            ),
            wrong: t("Both coordinates have finite order, so the pair does too.", "两个坐标都是有限阶，所以有序对也是有限阶。"),
          },
          {
            prompt: t(
              `Does $${pairTex(k, b)}$ have finite order in $\\mathbb{Z} \\times ${zTex(n)}$?`,
              `$${pairTex(k, b)}$ 在 $\\mathbb{Z} \\times ${zTex(n)}$ 中是有限阶吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Look at the first coordinate", "看第一个坐标"],
                t(`In $\\mathbb{Z}$, $${k}m \\ne 0$ for every $m \\ne 0$.`, `在 $\\mathbb{Z}$ 中，对每个 $m \\ne 0$ 都有 $${k}m \\ne 0$。`),
              ],
              [
                ["Decide", "作出判断"],
                t(
                  "So no nonzero multiple of the pair is $(0, 0)$: no, it has infinite order.",
                  "所以这个有序对的非零倍数都不是 $(0, 0)$：不是有限阶，它的阶是无限的。",
                ),
              ],
            ],
            check: t(
              `Even $${ob}${pairTex(k, b)} = ${pairTex(ob * k, 0)}$, where the second coordinate is back at $0$, leaves the first at $${ob * k}$.`,
              `即使在 $${ob}${pairTex(k, b)} = ${pairTex(ob * k, 0)}$ 中第二个坐标已回到 $0$，第一个坐标仍是 $${ob * k}$。`,
            ),
            wrong: t(
              `The first coordinate $${k}$ never returns to $0$ in $\\mathbb{Z}$, whatever the second does.`,
              `第一个坐标 $${k}$ 在 $\\mathbb{Z}$ 中永远回不到 $0$，不论第二个坐标如何。`,
            ),
          },
          {
            prompt: t(
              `Does $${pairTex(-1, b)}$ have finite order in $\\mathbb{R}^* \\times ${zTex(n)}$?`,
              `$${pairTex(-1, b)}$ 在 $\\mathbb{R}^* \\times ${zTex(n)}$ 中是有限阶吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Look at the first coordinate", "看第一个坐标"],
                t("$(-1)^2 = 1$, so $-1$ has order $2$ in $\\mathbb{R}^*$.", "$(-1)^2 = 1$，所以 $-1$ 在 $\\mathbb{R}^*$ 中的阶为 $2$。"),
              ],
              [
                ["Take the least common multiple", "取最小公倍数"],
                t(
                  `$${b}$ has order $${ob}$ in $${zTex(n)}$, so the pair has order $\\operatorname{lcm}(2, ${ob}) = ${l2}$: yes, it has finite order.`,
                  `$${b}$ 在 $${zTex(n)}$ 中的阶为 $${ob}$，所以有序对的阶为 $\\operatorname{lcm}(2, ${ob}) = ${l2}$：是有限阶。`,
                ),
              ],
            ],
            check: t(
              `$(-1)^{${l2}} = 1$ since $${l2}$ is even, and $${l2}(${b}) = ${l2 * b}$ is a multiple of $${n}$.`,
              `$(-1)^{${l2}} = 1$，因为 $${l2}$ 是偶数，而 $${l2}(${b}) = ${l2 * b}$ 是 $${n}$ 的倍数。`,
            ),
            wrong: t(
              "$-1$ has order $2$ in $\\mathbb{R}^*$, so both coordinates have finite order.",
              "$-1$ 在 $\\mathbb{R}^*$ 中的阶为 $2$，所以两个坐标都是有限阶。",
            ),
          },
          {
            prompt: t(
              `Does $${pairTex(-k, b)}$ have finite order in $\\mathbb{R}^* \\times ${zTex(n)}$?`,
              `$${pairTex(-k, b)}$ 在 $\\mathbb{R}^* \\times ${zTex(n)}$ 中是有限阶吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Look at the size of the powers", "看幂的绝对值"],
                t(`$|(-${k})^m| = ${k}^m$, which is not $1$ for $m \\ne 0$.`, `$|(-${k})^m| = ${k}^m$，当 $m \\ne 0$ 时不等于 $1$。`),
              ],
              [
                ["Decide", "作出判断"],
                t(
                  "So the first coordinate never returns to $1$: no, the pair has infinite order.",
                  "所以第一个坐标永远回不到 $1$：不是有限阶，有序对的阶是无限的。",
                ),
              ],
            ],
            check: t(
              `$(-${k})^2 = ${k * k}$ and $(-${k})^{-2} = \\frac{1}{${k * k}}$, both away from $1$.`,
              `$(-${k})^2 = ${k * k}$，$(-${k})^{-2} = \\frac{1}{${k * k}}$，都不等于 $1$。`,
            ),
            wrong: t(
              `Only $\\pm 1$ have finite order in $\\mathbb{R}^*$, and $-${k}$ is neither.`,
              `在 $\\mathbb{R}^*$ 中只有 $\\pm 1$ 是有限阶，而 $-${k}$ 两者都不是。`,
            ),
          },
          {
            prompt: t(
              `Does $(e^{2\\pi i / ${k}}, ${b})$ have finite order in $\\mathbb{C}^* \\times ${zTex(n)}$?`,
              `$(e^{2\\pi i / ${k}}, ${b})$ 在 $\\mathbb{C}^* \\times ${zTex(n)}$ 中是有限阶吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Look at the first coordinate", "看第一个坐标"],
                t(`$e^{2\\pi i / ${k}}$ is a root of unity of order $${k}$.`, `$e^{2\\pi i / ${k}}$ 是阶为 $${k}$ 的单位根。`),
              ],
              [
                ["Take the least common multiple", "取最小公倍数"],
                t(
                  `$${b}$ has order $${ob}$, so the pair has order $\\operatorname{lcm}(${k}, ${ob}) = ${lk}$: yes, it has finite order.`,
                  `$${b}$ 的阶为 $${ob}$，所以有序对的阶为 $\\operatorname{lcm}(${k}, ${ob}) = ${lk}$：是有限阶。`,
                ),
              ],
            ],
            check: t(
              `$(e^{2\\pi i / ${k}})^{${lk}} = e^{2\\pi i (${lk / k})} = 1$, and $${lk}(${b}) = ${lk * b}$ is a multiple of $${n}$.`,
              `$(e^{2\\pi i / ${k}})^{${lk}} = e^{2\\pi i (${lk / k})} = 1$，而 $${lk}(${b}) = ${lk * b}$ 是 $${n}$ 的倍数。`,
            ),
            wrong: t(
              `$e^{2\\pi i / ${k}}$ is a root of unity of order $${k}$, so both coordinates have finite order.`,
              `$e^{2\\pi i / ${k}}$ 是 $${k}$ 阶单位根，所以两个坐标都是有限阶。`,
            ),
          },
          {
            prompt: t(
              `Does $(${k}i, ${b})$ have finite order in $\\mathbb{C}^* \\times ${zTex(n)}$?`,
              `$(${k}i, ${b})$ 在 $\\mathbb{C}^* \\times ${zTex(n)}$ 中是有限阶吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Look at the modulus", "看模"],
                t(
                  `$|${k}i| = ${k}$, so $|(${k}i)^m| = ${k}^m \\ne 1$ for $m \\ne 0$.`,
                  `$|${k}i| = ${k}$，所以当 $m \\ne 0$ 时 $|(${k}i)^m| = ${k}^m \\ne 1$。`,
                ),
              ],
              [
                ["Decide", "作出判断"],
                t(
                  `So no nonzero power of $${k}i$ is $1$: no, the pair has infinite order.`,
                  `所以 $${k}i$ 的任何非零次幂都不是 $1$：不是有限阶，有序对的阶是无限的。`,
                ),
              ],
            ],
            check: t(`$(${k}i)^4 = ${k ** 4}$, not $1$, although $i^4 = 1$.`, `$(${k}i)^4 = ${k ** 4}$，不是 $1$，尽管 $i^4 = 1$。`),
            wrong: t(
              `A complex number of finite order has modulus $1$, and $|${k}i| = ${k}$.`,
              `有限阶的复数模为 $1$，而 $|${k}i| = ${k}$。`,
            ),
          },
        ];
        return decide(rng.pick(facts));
      },
    },
    {
      id: "sizes-of-torsion-subgroups",
      title: t("Torsion subgroups", "挠子群"),
      explanation: t(
        "The torsion subgroup collects the elements of finite order, and in a product with free parts only the finite factors contribute. The torsion subgroup of $\\mathbb{Z}^2 \\times \\mathbb{Z}_4 \\times \\mathbb{Z}_6$ is $\\{0\\} \\times \\{0\\} \\times \\mathbb{Z}_4 \\times \\mathbb{Z}_6$, with $24$ elements. In $\\mathbb{R}^*$ the torsion subgroup is $\\{\\pm 1\\}$.\n\nThe torsion subgroup of $\\mathbb{Q}^* \\times \\mathbb{Z}^3 \\times \\mathbb{Z}_{20}$ is $\\{\\pm 1\\} \\times \\{0\\} \\times \\mathbb{Z}_{20}$, with $2 \\cdot 20 = 40$ elements.\n\nCheck: an element with a nonzero coordinate in $\\mathbb{Z}^3$, or a first coordinate other than $\\pm 1$, has infinite order, so nothing else belongs.\n\n> **Watch out.** $\\mathbb{Z}^k$ contributes only $\\{0\\}$, one element, and $\\mathbb{R}^*$ or $\\mathbb{Q}^*$ contributes $\\{\\pm 1\\}$, two elements, not one. Multiply the sizes of the parts; do not add them.",
        "挠子群由有限阶元素组成，在含有自由部分的直积中，只有有限因子作出贡献。$\\mathbb{Z}^2 \\times \\mathbb{Z}_4 \\times \\mathbb{Z}_6$ 的挠子群为 $\\{0\\} \\times \\{0\\} \\times \\mathbb{Z}_4 \\times \\mathbb{Z}_6$，有 $24$ 个元素。$\\mathbb{R}^*$ 的挠子群为 $\\{\\pm 1\\}$。\n\n$\\mathbb{Q}^* \\times \\mathbb{Z}^3 \\times \\mathbb{Z}_{20}$ 的挠子群为 $\\{\\pm 1\\} \\times \\{0\\} \\times \\mathbb{Z}_{20}$，有 $2 \\cdot 20 = 40$ 个元素。\n\n检验：在 $\\mathbb{Z}^3$ 中有非零坐标的元素，或第一个坐标不是 $\\pm 1$ 的元素，都是无限阶，所以不再有别的元素属于挠子群。\n\n> **注意。** $\\mathbb{Z}^k$ 只贡献 $\\{0\\}$ 这一个元素，$\\mathbb{R}^*$ 或 $\\mathbb{Q}^*$ 贡献 $\\{\\pm 1\\}$ 两个元素，而不是一个。各部分的大小要相乘，不是相加。",
      ),
      generate(rng) {
        const m = rng.int(2, 15);
        const n = rng.int(2, 15);
        const k = rng.int(1, 4);
        const kind = rng.int(0, 3);
        const free = k === 1 ? "\\mathbb{Z}" : `\\mathbb{Z}^{${k}}`;
        const add = t("That adds the sizes of the parts; multiply them.", "那是把各部分的大小相加；应相乘。");
        const [tex, value, part, mistakes] = [
          [
            `${free} \\times ${zTex(m)} \\times ${zTex(n)}`,
            m * n,
            t(
              `$${free}$ contributes only $\\{0\\}$, and the finite factors $${zTex(m)}$ and $${zTex(n)}$ are torsion, so the torsion subgroup is $\\{0\\} \\times ${zTex(m)} \\times ${zTex(n)}$.`,
              `$${free}$ 只贡献 $\\{0\\}$，有限因子 $${zTex(m)}$ 与 $${zTex(n)}$ 都是挠的，所以挠子群为 $\\{0\\} \\times ${zTex(m)} \\times ${zTex(n)}$。`,
            ),
            [
              { value: m + n, why: add },
              why(
                m * n * k,
                `That counts $${free}$ as contributing $${k}$ elements; it contributes only $0$.`,
                `那把 $${free}$ 算作贡献 $${k}$ 个元素；它只贡献 $0$。`,
              ),
            ],
          ],
          [
            `\\mathbb{R}^* \\times ${zTex(m)}`,
            2 * m,
            t(
              `In $\\mathbb{R}^*$ only $\\pm 1$ have finite order, so the torsion subgroup is $\\{\\pm 1\\} \\times ${zTex(m)}$.`,
              `在 $\\mathbb{R}^*$ 中只有 $\\pm 1$ 是有限阶，所以挠子群为 $\\{\\pm 1\\} \\times ${zTex(m)}$。`,
            ),
            [
              why(m, "That leaves out $-1$, which has order $2$ in $\\mathbb{R}^*$.", "那漏掉了 $-1$，它在 $\\mathbb{R}^*$ 中的阶为 $2$。"),
              { value: m + 2, why: add },
            ],
          ],
          [
            `\\mathbb{Q}^* \\times ${free} \\times ${zTex(m)} \\times ${zTex(n)}`,
            2 * m * n,
            t(
              `In $\\mathbb{Q}^*$ only $\\pm 1$ have finite order and $${free}$ contributes only $\\{0\\}$, so the torsion subgroup is $\\{\\pm 1\\} \\times \\{0\\} \\times ${zTex(m)} \\times ${zTex(n)}$.`,
              `在 $\\mathbb{Q}^*$ 中只有 $\\pm 1$ 是有限阶，$${free}$ 只贡献 $\\{0\\}$，所以挠子群为 $\\{\\pm 1\\} \\times \\{0\\} \\times ${zTex(m)} \\times ${zTex(n)}$。`,
            ),
            [
              why(
                m * n,
                "That leaves out $-1$, which has order $2$ in $\\mathbb{Q}^*$.",
                "那漏掉了 $-1$，它在 $\\mathbb{Q}^*$ 中的阶为 $2$。",
              ),
              { value: 2 + m + n, why: add },
            ],
          ],
          [
            `${free} \\times U(${m + 2})`,
            phi(m + 2),
            t(
              `$${free}$ contributes only $\\{0\\}$ and $U(${m + 2})$ is finite, so the torsion subgroup is $\\{0\\} \\times U(${m + 2})$, of order $\\varphi(${m + 2})$.`,
              `$${free}$ 只贡献 $\\{0\\}$，$U(${m + 2})$ 是有限的，所以挠子群为 $\\{0\\} \\times U(${m + 2})$，阶为 $\\varphi(${m + 2})$。`,
            ),
            [
              why(
                m + 2,
                `That counts all of $${zTex(m + 2)}$; $U(${m + 2})$ holds only the residues coprime to $${m + 2}$.`,
                `那数的是整个 $${zTex(m + 2)}$；$U(${m + 2})$ 只含与 $${m + 2}$ 互素的剩余。`,
              ),
              why(
                m + 1,
                `That counts every nonzero residue; $U(${m + 2})$ holds only those coprime to $${m + 2}$.`,
                `那数的是所有非零剩余；$U(${m + 2})$ 只含与 $${m + 2}$ 互素的剩余。`,
              ),
            ],
          ],
        ][kind] as [string, number, Text, { value: number; why: Text }[]];
        return numberProblem({
          prompt: t(`How many elements does the torsion subgroup of $${tex}$ have?`, `$${tex}$ 的挠子群有多少个元素？`),
          answer: value,
          mistakes: apart(value, mistakes),
          solution: walked(
            [
              [["Find the torsion in each factor", "求各因子中的挠元"], part],
              [
                ["Multiply the sizes", "把大小相乘"],
                t(`So the torsion subgroup has $${value}$ elements.`, `所以挠子群有 $${value}$ 个元素。`),
              ],
            ],
            t(
              "Any element with a coordinate of infinite order has infinite order, so no other element belongs.",
              "任何含有无限阶坐标的元素都是无限阶，所以没有别的元素属于挠子群。",
            ),
          ),
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
  intro: t(
    "$12 = 2^2 \\cdot 3$. The exponent $2$ splits as $2$ or as $1 + 1$, and the exponent $1$ only as $1$, so the abelian groups of order $12$ are $\\mathbb{Z}_4 \\times \\mathbb{Z}_3$ and $\\mathbb{Z}_2 \\times \\mathbb{Z}_2 \\times \\mathbb{Z}_3$: there are $2$ of them.\n\nCheck: they really differ, since $\\mathbb{Z}_4 \\times \\mathbb{Z}_3$ has the element $(1, 1)$ of order $12$, while every element of $\\mathbb{Z}_2 \\times \\mathbb{Z}_2 \\times \\mathbb{Z}_3$ has order at most $6$.\n\nIn this lesson we count the abelian groups of a given order and decide when two products of cyclic groups are isomorphic.",
    "$12 = 2^2 \\cdot 3$。指数 $2$ 可分拆为 $2$ 或 $1 + 1$，指数 $1$ 只能是 $1$，所以阶为 $12$ 的阿贝尔群是 $\\mathbb{Z}_4 \\times \\mathbb{Z}_3$ 与 $\\mathbb{Z}_2 \\times \\mathbb{Z}_2 \\times \\mathbb{Z}_3$：共 $2$ 个。\n\n检验：它们确实不同，因为 $\\mathbb{Z}_4 \\times \\mathbb{Z}_3$ 有阶为 $12$ 的元素 $(1, 1)$，而 $\\mathbb{Z}_2 \\times \\mathbb{Z}_2 \\times \\mathbb{Z}_3$ 中每个元素的阶至多为 $6$。\n\n本课我们数出给定阶的阿贝尔群，并判断两个循环群的直积何时同构。",
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
        "$72 = 2^3 \\cdot 3^2$. The exponent $3$ has $3$ partitions ($3$, $2 + 1$, $1 + 1 + 1$) and $2$ has $2$, so there are $3 \\cdot 2 = 6$ abelian groups of order $72$ up to isomorphism.\n\n$2592 = 2^5 \\cdot 3^4$, and $p(5) = 7$ and $p(4) = 5$, so there are $7 \\cdot 5 = 35$ abelian groups of order $2592$.\n\nCheck: the $5$ partitions of $4$ are $4$, $3 + 1$, $2 + 2$, $2 + 1 + 1$ and $1 + 1 + 1 + 1$, giving the $3$-parts $\\mathbb{Z}_{81}$, $\\mathbb{Z}_{27} \\times \\mathbb{Z}_3$, $\\mathbb{Z}_9 \\times \\mathbb{Z}_9$, $\\mathbb{Z}_9 \\times \\mathbb{Z}_3 \\times \\mathbb{Z}_3$ and $\\mathbb{Z}_3^4$.\n\n> **Watch out.** Count the partitions of each exponent, not the exponent itself: $2^5$ allows $p(5) = 7$ choices, not $5$. Then multiply across the primes; adding gives $7 + 5 = 12$, which is too few.",
        "$72 = 2^3 \\cdot 3^2$。指数 $3$ 有 $3$ 个分拆（$3$、$2 + 1$、$1 + 1 + 1$），$2$ 有 $2$ 个，所以在同构意义下阶为 $72$ 的阿贝尔群有 $3 \\cdot 2 = 6$ 个。\n\n$2592 = 2^5 \\cdot 3^4$，而 $p(5) = 7$，$p(4) = 5$，所以阶为 $2592$ 的阿贝尔群有 $7 \\cdot 5 = 35$ 个。\n\n检验：$4$ 的 $5$ 个分拆是 $4$、$3 + 1$、$2 + 2$、$2 + 1 + 1$ 和 $1 + 1 + 1 + 1$，对应的 $3$-部分为 $\\mathbb{Z}_{81}$、$\\mathbb{Z}_{27} \\times \\mathbb{Z}_3$、$\\mathbb{Z}_9 \\times \\mathbb{Z}_9$、$\\mathbb{Z}_9 \\times \\mathbb{Z}_3 \\times \\mathbb{Z}_3$ 和 $\\mathbb{Z}_3^4$。\n\n> **注意。** 要数每个指数的分拆数，而不是指数本身：$2^5$ 有 $p(5) = 7$ 种选择，不是 $5$ 种。然后对各素数相乘；相加得到 $7 + 5 = 12$，太少了。",
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
        const big = parts.filter((x) => x > 1);
        return numberProblem({
          prompt: t(
            `How many abelian groups of order $${n}$ are there, up to isomorphism?`,
            `在同构意义下，阶为 $${n}$ 的阿贝尔群有多少个？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              f.reduce((s, [, e]) => s * e, 1),
              "That multiplies the exponents themselves; count the partitions of each exponent instead.",
              "那是把指数本身相乘；应数每个指数的分拆数。",
            ),
            why(
              f.reduce((s, [, e]) => s + e, 0),
              "That adds the exponents; count their partitions and multiply.",
              "那是把指数相加；应数它们的分拆数再相乘。",
            ),
            why(
              parts.reduce((a, b) => a + b, 0),
              "That adds the numbers of partitions; the choices for different primes multiply.",
              "那是把分拆数相加；不同素数的选择应相乘。",
            ),
            why(divisors(n).length, `That counts the divisors of $${n}$, not the groups.`, `那数的是 $${n}$ 的因数，不是群。`),
          ]),
          solution: walked(
            [
              [["Factor the order", "分解阶"], t(`$${n} = ${fac}$.`, `$${n} = ${fac}$。`)],
              [
                ["Count the partitions of each exponent", "数每个指数的分拆"],
                t(
                  `The prime powers allow ${f.map(([p, e]) => `$p(${e}) = ${PARTITIONS[e]}$ for $${p}$`).join(", ")}.`,
                  `各素数的分拆数为：${f.map(([p, e]) => `$${p}$ 为 $p(${e}) = ${PARTITIONS[e]}$`).join("，")}。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `So there are $${big.length > 1 ? `${big.join(" \\cdot ")} = ` : ""}${value}$ abelian groups of order $${n}$.`,
                  `所以阶为 $${n}$ 的阿贝尔群有 $${big.length > 1 ? `${big.join(" \\cdot ")} = ` : ""}${value}$ 个。`,
                ),
              ],
            ],
            t(
              `Each choice gives a different list of prime powers; taking every exponent whole gives the cyclic group $${zTex(n)}$, one of the $${value}$.`,
              `每种选择给出不同的素数幂列表；每个指数都不拆开，得到循环群 $${zTex(n)}$，它是这 $${value}$ 个之一。`,
            ),
          ),
        });
      },
    },
    {
      id: "isomorphic-products-of-cyclic-groups",
      title: t("Isomorphic products", "同构的直积"),
      explanation: t(
        "Split each factor into prime powers and compare. $\\mathbb{Z}_6 \\times \\mathbb{Z}_{10} \\cong \\mathbb{Z}_2 \\times \\mathbb{Z}_3 \\times \\mathbb{Z}_2 \\times \\mathbb{Z}_5 \\cong \\mathbb{Z}_2 \\times \\mathbb{Z}_{30}$, but it is not isomorphic to $\\mathbb{Z}_{60}$, whose only $2$-part is $\\mathbb{Z}_4$.\n\n$\\mathbb{Z}_{36} \\times \\mathbb{Z}_{50}$ splits into $\\mathbb{Z}_2 \\times \\mathbb{Z}_4 \\times \\mathbb{Z}_9 \\times \\mathbb{Z}_{25}$, and so does $\\mathbb{Z}_{18} \\times \\mathbb{Z}_{100}$, so the two are isomorphic. $\\mathbb{Z}_6 \\times \\mathbb{Z}_{300}$ splits into $\\mathbb{Z}_2 \\times \\mathbb{Z}_3 \\times \\mathbb{Z}_3 \\times \\mathbb{Z}_4 \\times \\mathbb{Z}_{25}$, which has $\\mathbb{Z}_3 \\times \\mathbb{Z}_3$ in place of $\\mathbb{Z}_9$, so it is not.\n\nCheck: all three groups have $1800$ elements, so the order alone could not tell them apart.\n\n> **Watch out.** Equal orders do not make groups isomorphic, and $\\mathbb{Z}_m \\times \\mathbb{Z}_n \\cong \\mathbb{Z}_{mn}$ only when $\\gcd(m, n) = 1$. $\\mathbb{Z}_9$ and $\\mathbb{Z}_3 \\times \\mathbb{Z}_3$ are different prime-power lists.",
        "把每个因子分解为素数幂再比较。$\\mathbb{Z}_6 \\times \\mathbb{Z}_{10} \\cong \\mathbb{Z}_2 \\times \\mathbb{Z}_3 \\times \\mathbb{Z}_2 \\times \\mathbb{Z}_5 \\cong \\mathbb{Z}_2 \\times \\mathbb{Z}_{30}$，但它与 $\\mathbb{Z}_{60}$ 不同构，后者的 $2$-部分只有 $\\mathbb{Z}_4$。\n\n$\\mathbb{Z}_{36} \\times \\mathbb{Z}_{50}$ 分解为 $\\mathbb{Z}_2 \\times \\mathbb{Z}_4 \\times \\mathbb{Z}_9 \\times \\mathbb{Z}_{25}$，$\\mathbb{Z}_{18} \\times \\mathbb{Z}_{100}$ 也是，所以两者同构。$\\mathbb{Z}_6 \\times \\mathbb{Z}_{300}$ 分解为 $\\mathbb{Z}_2 \\times \\mathbb{Z}_3 \\times \\mathbb{Z}_3 \\times \\mathbb{Z}_4 \\times \\mathbb{Z}_{25}$，其中是 $\\mathbb{Z}_3 \\times \\mathbb{Z}_3$ 而不是 $\\mathbb{Z}_9$，所以不同构。\n\n检验：三个群都有 $1800$ 个元素，所以仅凭阶无法区分它们。\n\n> **注意。** 阶相等并不意味着同构，而且只有当 $\\gcd(m, n) = 1$ 时才有 $\\mathbb{Z}_m \\times \\mathbb{Z}_n \\cong \\mathbb{Z}_{mn}$。$\\mathbb{Z}_9$ 与 $\\mathbb{Z}_3 \\times \\mathbb{Z}_3$ 是不同的素数幂列表。",
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
        return decide({
          prompt: t(`Is $${left} \\cong ${right}$?`, `$${left} \\cong ${right}$ 吗？`),
          holds: iso,
          steps: [
            [["Split the left side", "分解左边"], t(`$${left} \\cong ${list(ed)}$.`, `$${left} \\cong ${list(ed)}$。`)],
            [["Split the right side", "分解右边"], t(`$${right} \\cong ${list(ed2)}$.`, `$${right} \\cong ${list(ed2)}$。`)],
            [
              ["Compare the prime powers", "比较素数幂"],
              iso
                ? t("The two lists are the same: yes, the groups are isomorphic.", "两个列表相同：两个群同构。")
                : t("The two lists differ: no, the groups are not isomorphic.", "两个列表不同：两个群不同构。"),
            ],
          ],
          check: t(
            `Both sides have $${a * b}$ elements, so the order alone cannot decide; the prime powers do.`,
            `两边都有 $${a * b}$ 个元素，所以仅凭阶无法判断；要看素数幂。`,
          ),
          wrong: iso
            ? t("The two sides split into the same prime powers, so they are isomorphic.", "两边分解出相同的素数幂，所以同构。")
            : t("Equal orders are not enough: the two sides split into different prime powers.", "阶相等还不够：两边分解出的素数幂不同。"),
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
  intro: t(
    "The vectors $(2, 3)$ and $(3, 5)$ have determinant $2 \\cdot 5 - 3 \\cdot 3 = 1$, so they form a basis of $\\mathbb{Z}^2$: every integer vector is an integer combination of them.\n\nCheck: $(1, 0) = 5(2, 3) - 3(3, 5) = (10 - 9, 15 - 15)$, and $(0, 1) = -3(2, 3) + 2(3, 5) = (-6 + 6, -9 + 10)$.\n\nIn this lesson we find the index of the subgroup two vectors generate in $\\mathbb{Z}^2$, and decide when they form a basis.",
    "向量 $(2, 3)$ 与 $(3, 5)$ 的行列式为 $2 \\cdot 5 - 3 \\cdot 3 = 1$，所以它们构成 $\\mathbb{Z}^2$ 的基：每个整数向量都是它们的整系数组合。\n\n检验：$(1, 0) = 5(2, 3) - 3(3, 5) = (10 - 9, 15 - 15)$，而 $(0, 1) = -3(2, 3) + 2(3, 5) = (-6 + 6, -9 + 10)$。\n\n本课我们求两个向量在 $\\mathbb{Z}^2$ 中生成的子群的指数，并判断它们何时构成基。",
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
        "The index of the subgroup generated by two vectors in the integer plane is the absolute value of their determinant, the area of their parallelogram. $(2, 1)$ and $(1, 3)$ generate a subgroup of $\\mathbb{Z}^2$ of index $|(2)(3) - (1)(1)| = 5$: the quotient has $5$ elements.\n\n$(7, 2)$ and $(3, 8)$ generate a subgroup of index $|(7)(8) - (2)(3)| = |56 - 6| = 50$.\n\nCheck: listing the vectors the other way round gives $(3)(2) - (8)(7) = -50$, the same up to sign, as it must.\n\n> **Watch out.** The determinant subtracts the cross products: $(7)(8) + (2)(3) = 62$ is not the index. And the index is the absolute value, so a determinant of $-50$ still gives $50$.",
        "整数平面中由两个向量生成的子群的指数等于它们行列式的绝对值，也就是它们所成平行四边形的面积。$(2, 1)$ 与 $(1, 3)$ 生成 $\\mathbb{Z}^2$ 中指数为 $|(2)(3) - (1)(1)| = 5$ 的子群：商群有 $5$ 个元素。\n\n$(7, 2)$ 与 $(3, 8)$ 生成指数为 $|(7)(8) - (2)(3)| = |56 - 6| = 50$ 的子群。\n\n检验：把两个向量的顺序反过来，得到 $(3)(2) - (8)(7) = -50$，只差一个符号，理应如此。\n\n> **注意。** 行列式是交叉乘积相减：$(7)(8) + (2)(3) = 62$ 不是指数。而且指数取绝对值，所以行列式为 $-50$ 时指数仍是 $50$。",
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
          mistakes: apart(Math.abs(det), [
            why(
              Math.abs(a * d + b * c),
              "That adds the cross products; the determinant subtracts them.",
              "那是把交叉乘积相加；行列式要相减。",
            ),
            why(
              Math.abs(a * c + b * d),
              "That is the dot product of the vectors, not their determinant.",
              "那是两个向量的点积，不是行列式。",
            ),
            why(det, "The index is the absolute value of the determinant.", "指数是行列式的绝对值。"),
          ]),
          solution: walked(
            [
              [
                ["Take the determinant", "求行列式"],
                t(
                  `$(${a})(${d}) - (${b})(${c}) = ${a * d} ${b * c < 0 ? "+" : "-"} ${Math.abs(b * c)} = ${det}$.`,
                  `$(${a})(${d}) - (${b})(${c}) = ${a * d} ${b * c < 0 ? "+" : "-"} ${Math.abs(b * c)} = ${det}$。`,
                ),
              ],
              [
                ["Take the absolute value", "取绝对值"],
                t(`The index is $|${det}| = ${Math.abs(det)}$.`, `指数为 $|${det}| = ${Math.abs(det)}$。`),
              ],
            ],
            t(
              `In the other order, $(${c})(${b}) - (${d})(${a}) = ${-det}$, the same up to sign.`,
              `换一个顺序，$(${c})(${b}) - (${d})(${a}) = ${-det}$，只差一个符号。`,
            ),
          ),
        });
      },
    },
    {
      id: "bases-of-z2",
      title: t("Bases of $\\mathbb{Z}^2$", "$\\mathbb{Z}^2$ 的基"),
      explanation: t(
        "$\\{(3, 2), (4, 3)\\}$ is a basis of $\\mathbb{Z}^2$ since $3 \\cdot 3 - 2 \\cdot 4 = 1$. $\\{(2, 0), (0, 1)\\}$ is not: it is linearly independent but generates only a subgroup of index $2$.\n\n$\\{(11, 4), (8, 3)\\}$ is a basis, since $11 \\cdot 3 - 4 \\cdot 8 = 33 - 32 = 1$.\n\nCheck: $3(11, 4) - 4(8, 3) = (33 - 32, 12 - 12) = (1, 0)$, so $(1, 0)$ is an integer combination of the two.\n\n> **Watch out.** Linear independence is not enough over the integers: the determinant must be $\\pm 1$. A determinant of $-1$ counts, while $2$ leaves out half of $\\mathbb{Z}^2$.",
        "$\\{(3, 2), (4, 3)\\}$ 是 $\\mathbb{Z}^2$ 的基，因为 $3 \\cdot 3 - 2 \\cdot 4 = 1$。$\\{(2, 0), (0, 1)\\}$ 不是：它线性无关，但只生成指数为 $2$ 的子群。\n\n$\\{(11, 4), (8, 3)\\}$ 是基，因为 $11 \\cdot 3 - 4 \\cdot 8 = 33 - 32 = 1$。\n\n检验：$3(11, 4) - 4(8, 3) = (33 - 32, 12 - 12) = (1, 0)$，所以 $(1, 0)$ 是这两个向量的整系数组合。\n\n> **注意。** 在整数上，线性无关还不够：行列式必须是 $\\pm 1$。行列式为 $-1$ 也可以，而为 $2$ 时会漏掉 $\\mathbb{Z}^2$ 的一半。",
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
        const unit = Math.abs(det) === 1;
        const coefficient = (v: number) => (v < 0 ? `(${v})` : `${v}`);
        return decide({
          prompt: t(
            `Is $\\{${pairTex(a, b)}, ${pairTex(c, d)}\\}$ a basis of $\\mathbb{Z}^2$?`,
            `$\\{${pairTex(a, b)}, ${pairTex(c, d)}\\}$ 是 $\\mathbb{Z}^2$ 的基吗？`,
          ),
          holds: unit,
          steps: [
            [
              ["Take the determinant", "求行列式"],
              t(`$(${a})(${d}) - (${b})(${c}) = ${det}$.`, `$(${a})(${d}) - (${b})(${c}) = ${det}$。`),
            ],
            [
              ["Compare it with ±1", "与 ±1 比较"],
              unit
                ? t("The determinant is $\\pm 1$: yes, the vectors form a basis.", "行列式为 $\\pm 1$：这两个向量构成基。")
                : t(
                    `The vectors generate ${det === 0 ? "a subgroup of infinite index" : `a subgroup of index $${Math.abs(det)}$`}: no, they do not form a basis.`,
                    `这两个向量生成${det === 0 ? "指数无限的子群" : `指数为 $${Math.abs(det)}$ 的子群`}：不构成基。`,
                  ),
            ],
          ],
          check: unit
            ? t(
                `$${coefficient(d * det)}${pairTex(a, b)} + ${coefficient(-b * det)}${pairTex(c, d)} = (1, 0)$, an integer combination.`,
                `$${coefficient(d * det)}${pairTex(a, b)} + ${coefficient(-b * det)}${pairTex(c, d)} = (1, 0)$，是整系数组合。`,
              )
            : t(
                `The parallelogram on the two vectors has area $${Math.abs(det)}$, while a basis spans a parallelogram of area $1$.`,
                `以这两个向量为边的平行四边形面积为 $${Math.abs(det)}$，而基所成平行四边形的面积为 $1$。`,
              ),
          wrong: unit
            ? t("The determinant is $\\pm 1$, so the two vectors do form a basis.", "行列式为 $\\pm 1$，所以这两个向量确实构成基。")
            : t(
                `The determinant is $${det}$, not $\\pm 1$, so some integer vectors are not integer combinations of these two.`,
                `行列式为 $${det}$，不是 $\\pm 1$，所以有些整数向量不是这两个向量的整系数组合。`,
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
  intro: t(
    "In $\\mathbb{Z}_6$, $\\langle 2 \\rangle = \\{0, 2, 4\\}$ has order $3$ and $\\langle 3 \\rangle = \\{0, 3\\}$ has order $2$. They meet only in $0$, and $3 \\cdot 2 = 6$, so $\\mathbb{Z}_6$ is their internal direct product.\n\nCheck: every element is a sum of one from each: $1 = 4 + 3$, $5 = 2 + 3$, $3 = 0 + 3$.\n\nIn this lesson we decide when $\\mathbb{Z}_n$ is the internal direct product of two cyclic subgroups, and find the size of their intersection.",
    "在 $\\mathbb{Z}_6$ 中，$\\langle 2 \\rangle = \\{0, 2, 4\\}$ 的阶为 $3$，$\\langle 3 \\rangle = \\{0, 3\\}$ 的阶为 $2$。它们只交于 $0$，且 $3 \\cdot 2 = 6$，所以 $\\mathbb{Z}_6$ 是它们的内直积。\n\n检验：每个元素都是两者各取一个之和：$1 = 4 + 3$，$5 = 2 + 3$，$3 = 0 + 3$。\n\n本课我们判断 $\\mathbb{Z}_n$ 何时是两个循环子群的内直积，并求它们交的大小。",
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
        "In $\\mathbb{Z}_{12}$, $\\langle 4 \\rangle$ has order $3$ and $\\langle 3 \\rangle$ has order $4$. Their orders are coprime, so they meet only in $0$, and $3 \\cdot 4 = 12$. So $\\mathbb{Z}_{12}$ is their internal direct product.\n\nIn $\\mathbb{Z}_{77}$, $\\langle 7 \\rangle$ has order $11$ and $\\langle 11 \\rangle$ has order $7$, so $\\mathbb{Z}_{77}$ is their internal direct product. In $\\mathbb{Z}_{100}$, $\\langle 10 \\rangle$ of order $10$ and $\\langle 25 \\rangle$ of order $4$ share $\\{0, 50\\}$, so $\\mathbb{Z}_{100}$ is not theirs.\n\nCheck: $11 \\cdot 7 = 77$ and $\\gcd(11, 7) = 1$, while $\\gcd(10, 4) = 2$.\n\n> **Watch out.** Both conditions are needed: the subgroups must meet only in $0$ and their orders must multiply to $n$. In $\\mathbb{Z}_{12}$, $\\langle 4 \\rangle$ and $\\langle 6 \\rangle$ meet only in $0$, but $3 \\cdot 2 = 6 < 12$.",
        "在 $\\mathbb{Z}_{12}$ 中，$\\langle 4 \\rangle$ 的阶为 $3$，$\\langle 3 \\rangle$ 的阶为 $4$。它们的阶互素，所以只交于 $0$，且 $3 \\cdot 4 = 12$。所以 $\\mathbb{Z}_{12}$ 是它们的内直积。\n\n在 $\\mathbb{Z}_{77}$ 中，$\\langle 7 \\rangle$ 的阶为 $11$，$\\langle 11 \\rangle$ 的阶为 $7$，所以 $\\mathbb{Z}_{77}$ 是它们的内直积。在 $\\mathbb{Z}_{100}$ 中，阶为 $10$ 的 $\\langle 10 \\rangle$ 与阶为 $4$ 的 $\\langle 25 \\rangle$ 共有 $\\{0, 50\\}$，所以 $\\mathbb{Z}_{100}$ 不是它们的内直积。\n\n检验：$11 \\cdot 7 = 77$ 且 $\\gcd(11, 7) = 1$，而 $\\gcd(10, 4) = 2$。\n\n> **注意。** 两个条件缺一不可：两个子群只交于 $0$，且它们的阶之积等于 $n$。在 $\\mathbb{Z}_{12}$ 中，$\\langle 4 \\rangle$ 与 $\\langle 6 \\rangle$ 只交于 $0$，但 $3 \\cdot 2 = 6 < 12$。",
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
        const g = gcd(h, k);
        const split = range(0, h - 1)
          .map((i) => (i * a) % n)
          .flatMap((x) => range(0, k - 1).map((j) => [x, (j * b) % n] as const))
          .find(([x, y]) => (x + y) % n === 1);
        return decide({
          prompt: t(
            `Is $${zTex(n)}$ the internal direct product of $\\langle ${a} \\rangle$ and $\\langle ${b} \\rangle$?`,
            `$${zTex(n)}$ 是 $\\langle ${a} \\rangle$ 与 $\\langle ${b} \\rangle$ 的内直积吗？`,
          ),
          holds,
          steps: [
            [
              ["Find the orders", "求阶"],
              t(
                `$|\\langle ${a} \\rangle| = \\frac{${n}}{\\gcd(${a}, ${n})} = ${h}$ and $|\\langle ${b} \\rangle| = \\frac{${n}}{\\gcd(${b}, ${n})} = ${k}$.`,
                `$|\\langle ${a} \\rangle| = \\frac{${n}}{\\gcd(${a}, ${n})} = ${h}$，$|\\langle ${b} \\rangle| = \\frac{${n}}{\\gcd(${b}, ${n})} = ${k}$。`,
              ),
            ],
            [
              ["Test the two conditions", "检验两个条件"],
              t(
                `${g === 1 ? "The orders are coprime, so the subgroups meet only in $0$" : `They share the subgroup of order $\\gcd(${h}, ${k}) = ${g}$`}, and $${h} \\cdot ${k} ${h * k === n ? "=" : "\\ne"} ${n}$: ${holds ? "yes, it is their internal direct product" : "no, it is not their internal direct product"}.`,
                `${g === 1 ? "两个阶互素，所以子群只交于 $0$" : `它们共有阶为 $\\gcd(${h}, ${k}) = ${g}$ 的子群`}，且 $${h} \\cdot ${k} ${h * k === n ? "=" : "\\ne"} ${n}$：${holds ? "是它们的内直积" : "不是它们的内直积"}。`,
              ),
            ],
          ],
          check:
            holds && split
              ? t(
                  `$1 = ${split[0]} + ${split[1]}$ with $${split[0]} \\in \\langle ${a} \\rangle$ and $${split[1]} \\in \\langle ${b} \\rangle$, so the generator $1$ of $${zTex(n)}$ is a sum from the two subgroups.`,
                  `$1 = ${split[0]} + ${split[1]}$，其中 $${split[0]} \\in \\langle ${a} \\rangle$，$${split[1]} \\in \\langle ${b} \\rangle$，所以 $${zTex(n)}$ 的生成元 $1$ 是两个子群元素之和。`,
                )
              : g > 1
                ? t(
                    `$${n / g}$ has order $${g}$, which divides both $${h}$ and $${k}$, so it lies in both subgroups.`,
                    `$${n / g}$ 的阶为 $${g}$，它整除 $${h}$ 与 $${k}$，所以 $${n / g}$ 同时属于两个子群。`,
                  )
                : t(
                    `The sums from the two subgroups give at most $${h} \\cdot ${k} = ${h * k}$ elements, not $${n}$.`,
                    `两个子群元素之和至多给出 $${h} \\cdot ${k} = ${h * k}$ 个元素，而不是 $${n}$ 个。`,
                  ),
          wrong: holds
            ? t(
                `The subgroups meet only in $0$ and $${h} \\cdot ${k} = ${n}$, so both conditions hold.`,
                `两个子群只交于 $0$，且 $${h} \\cdot ${k} = ${n}$，两个条件都成立。`,
              )
            : g > 1
              ? t(
                  `The subgroups share more than $0$: both contain the subgroup of order $${g}$.`,
                  `两个子群的交不止 $0$：它们都含有 $${g}$ 阶子群。`,
                )
              : t(`The orders multiply to $${h * k}$, not $${n}$.`, `两个阶之积为 $${h * k}$，而不是 $${n}$。`),
        });
      },
    },
    {
      id: "intersections-of-cyclic-subgroups-of-zn",
      title: t("Intersections of subgroups", "子群的交"),
      explanation: t(
        "In $\\mathbb{Z}_{24}$, $\\langle 4 \\rangle$ has order $6$ and $\\langle 6 \\rangle$ has order $4$. Their intersection is the unique subgroup of order $\\gcd(6, 4) = 2$, namely $\\{0, 12\\}$.\n\nIn $\\mathbb{Z}_{100}$, $\\langle 8 \\rangle$ has order $25$ and $\\langle 30 \\rangle$ has order $10$, so their intersection has $\\gcd(25, 10) = 5$ elements: $\\{0, 20, 40, 60, 80\\}$.\n\nCheck: $\\langle 8 \\rangle = \\langle 4 \\rangle$ holds the multiples of $4$ and $\\langle 30 \\rangle = \\langle 10 \\rangle$ the multiples of $10$; the common ones are the multiples of $20$, and there are $5$ of them.\n\n> **Watch out.** Take the gcd of the orders, not of the generators: $\\gcd(8, 30) = 2$ is wrong. And $\\operatorname{lcm}(25, 10) = 50$ is the size of $\\langle 8 \\rangle + \\langle 30 \\rangle$, not of the intersection.",
        "在 $\\mathbb{Z}_{24}$ 中，$\\langle 4 \\rangle$ 的阶为 $6$，$\\langle 6 \\rangle$ 的阶为 $4$。它们的交是唯一的 $\\gcd(6, 4) = 2$ 阶子群，即 $\\{0, 12\\}$。\n\n在 $\\mathbb{Z}_{100}$ 中，$\\langle 8 \\rangle$ 的阶为 $25$，$\\langle 30 \\rangle$ 的阶为 $10$，所以它们的交有 $\\gcd(25, 10) = 5$ 个元素：$\\{0, 20, 40, 60, 80\\}$。\n\n检验：$\\langle 8 \\rangle = \\langle 4 \\rangle$ 由 $4$ 的倍数组成，$\\langle 30 \\rangle = \\langle 10 \\rangle$ 由 $10$ 的倍数组成；公共元素是 $20$ 的倍数，共 $5$ 个。\n\n> **注意。** 要取两个阶的最大公因数，而不是生成元的：$\\gcd(8, 30) = 2$ 是错的。而 $\\operatorname{lcm}(25, 10) = 50$ 是 $\\langle 8 \\rangle + \\langle 30 \\rangle$ 的大小，不是交的大小。",
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
          mistakes: apart(value, [
            why(
              lcm(h, k),
              `That is $\\operatorname{lcm}(${h}, ${k})$, the size of $\\langle ${a} \\rangle + \\langle ${b} \\rangle$, not of the intersection.`,
              `那是 $\\operatorname{lcm}(${h}, ${k})$，即 $\\langle ${a} \\rangle + \\langle ${b} \\rangle$ 的大小，不是交的大小。`,
            ),
            why(
              gcd(a, b),
              `That is the gcd of the generators $${a}$ and $${b}$; take the gcd of the orders.`,
              `那是生成元 $${a}$ 与 $${b}$ 的最大公因数；应取两个阶的最大公因数。`,
            ),
            why(
              Math.min(h, k),
              "That is the order of the smaller subgroup; it need not lie inside the larger one.",
              "那是较小子群的阶；它不一定包含在较大的子群中。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the orders", "求阶"],
                t(
                  `$|\\langle ${a} \\rangle| = \\frac{${n}}{\\gcd(${a}, ${n})} = ${h}$ and $|\\langle ${b} \\rangle| = \\frac{${n}}{\\gcd(${b}, ${n})} = ${k}$.`,
                  `$|\\langle ${a} \\rangle| = \\frac{${n}}{\\gcd(${a}, ${n})} = ${h}$，$|\\langle ${b} \\rangle| = \\frac{${n}}{\\gcd(${b}, ${n})} = ${k}$。`,
                ),
              ],
              [
                ["Take the gcd of the orders", "取两个阶的最大公因数"],
                t(
                  `$${zTex(n)}$ has one subgroup of each order dividing $${n}$, so the intersection is the subgroup of order $\\gcd(${h}, ${k}) = ${value}$.`,
                  `$${zTex(n)}$ 对整除 $${n}$ 的每个阶恰有一个子群，所以交是阶为 $\\gcd(${h}, ${k}) = ${value}$ 的子群。`,
                ),
              ],
            ],
            t(
              `$\\langle ${a} \\rangle$ holds the multiples of $${gcd(a, n)}$ and $\\langle ${b} \\rangle$ those of $${gcd(b, n)}$; the common ones are the multiples of $${lcm(gcd(a, n), gcd(b, n))}$, and there are $\\frac{${n}}{${lcm(gcd(a, n), gcd(b, n))}} = ${value}$ of them.`,
              `$\\langle ${a} \\rangle$ 由 $${gcd(a, n)}$ 的倍数组成，$\\langle ${b} \\rangle$ 由 $${gcd(b, n)}$ 的倍数组成；公共元素是 $${lcm(gcd(a, n), gcd(b, n))}$ 的倍数，共 $\\frac{${n}}{${lcm(gcd(a, n), gcd(b, n))}} = ${value}$ 个。`,
            ),
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
  intro: t(
    "In $\\mathbb{Z}_6$, take $H = \\langle 2 \\rangle = \\{0, 2, 4\\}$. Adding $1$ to each element gives the coset $1 + H = \\{1, 3, 5\\}$, and adding $2$ gives $H$ back. So $H$ has two cosets, the even and the odd residues.\n\nCheck: the two cosets have $3$ elements each, and $3 + 3 = 6 = |\\mathbb{Z}_6|$.\n\nIn this lesson we count the cosets of a cyclic subgroup of $\\mathbb{Z}_n$ and decide which elements lie in a given coset.",
    "在 $\\mathbb{Z}_6$ 中取 $H = \\langle 2 \\rangle = \\{0, 2, 4\\}$。把 $1$ 加到每个元素上得到陪集 $1 + H = \\{1, 3, 5\\}$，加 $2$ 又回到 $H$。所以 $H$ 有两个陪集：偶剩余与奇剩余。\n\n检验：两个陪集各有 $3$ 个元素，且 $3 + 3 = 6 = |\\mathbb{Z}_6|$。\n\n本课我们数 $\\mathbb{Z}_n$ 的循环子群的陪集个数，并判断哪些元素属于给定的陪集。",
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
        "The cosets of a subgroup all have the same size, so their number is the order of the group divided by the order of the subgroup. In $\\mathbb{Z}_{20}$, $\\langle 8 \\rangle = \\langle 4 \\rangle$ has $5$ elements, so there are $\\frac{20}{5} = 4$ cosets: $0 + H, 1 + H, 2 + H, 3 + H$.\n\nIn $\\mathbb{Z}_{90}$, $\\langle 75 \\rangle$ has $\\frac{90}{\\gcd(75, 90)} = \\frac{90}{15} = 6$ elements, so there are $\\frac{90}{6} = 15$ cosets, one for each residue modulo $15$.\n\nCheck: $\\langle 75 \\rangle = \\langle 15 \\rangle = \\{0, 15, 30, 45, 60, 75\\}$, and $15$ cosets of $6$ elements make $90$.\n\n> **Watch out.** The number of cosets is $\\gcd(a, n)$, not the order $\\frac{n}{\\gcd(a, n)}$ of the subgroup, and not $a$ itself: $\\langle 75 \\rangle$ has $15$ cosets, not $6$ or $75$.",
        "一个子群的所有陪集大小都相同，所以陪集的个数等于群的阶除以子群的阶。在 $\\mathbb{Z}_{20}$ 中，$\\langle 8 \\rangle = \\langle 4 \\rangle$ 有 $5$ 个元素，所以共有 $\\frac{20}{5} = 4$ 个陪集：$0 + H, 1 + H, 2 + H, 3 + H$。\n\n在 $\\mathbb{Z}_{90}$ 中，$\\langle 75 \\rangle$ 有 $\\frac{90}{\\gcd(75, 90)} = \\frac{90}{15} = 6$ 个元素，所以共有 $\\frac{90}{6} = 15$ 个陪集，模 $15$ 的每个剩余各对应一个。\n\n检验：$\\langle 75 \\rangle = \\langle 15 \\rangle = \\{0, 15, 30, 45, 60, 75\\}$，$15$ 个各含 $6$ 个元素的陪集共 $90$ 个元素。\n\n> **注意。** 陪集个数是 $\\gcd(a, n)$，不是子群的阶 $\\frac{n}{\\gcd(a, n)}$，也不是 $a$ 本身：$\\langle 75 \\rangle$ 有 $15$ 个陪集，不是 $6$ 个或 $75$ 个。",
      ),
      generate(rng) {
        let n: number;
        let a: number;
        do {
          n = rng.int(8, 60);
          a = rng.int(2, n - 1);
        } while (gcd(a, n) === 1);
        const d = gcd(a, n);
        const listed =
          d <= 4
            ? range(0, d - 1)
                .map((i) => `${i} + H`)
                .join(", ")
            : `0 + H, 1 + H, \\ldots, ${d - 1} + H`;
        return numberProblem({
          prompt: t(
            `How many distinct cosets does $H = \\langle ${a} \\rangle$ have in $${zTex(n)}$?`,
            `$H = \\langle ${a} \\rangle$ 在 $${zTex(n)}$ 中有多少个不同的陪集？`,
          ),
          answer: d,
          mistakes: apart(d, [
            why(
              n / d,
              "That is the order of $H$, the size of each coset, not the number of cosets.",
              "那是 $H$ 的阶，即每个陪集的大小，不是陪集的个数。",
            ),
            why(
              a,
              `That is the generator $${a}$; the number of cosets is $\\gcd(${a}, ${n})$.`,
              `那是生成元 $${a}$；陪集个数是 $\\gcd(${a}, ${n})$。`,
            ),
            why(n, `That is the order of $${zTex(n)}$; divide it by $|H|$.`, `那是 $${zTex(n)}$ 的阶；应再除以 $|H|$。`),
          ]),
          solution: walked(
            [
              [
                ["Find the order of the subgroup", "求子群的阶"],
                t(
                  `$|H| = \\frac{${n}}{\\gcd(${a}, ${n})} = \\frac{${n}}{${d}} = ${n / d}$.`,
                  `$|H| = \\frac{${n}}{\\gcd(${a}, ${n})} = \\frac{${n}}{${d}} = ${n / d}$。`,
                ),
              ],
              [
                ["Divide the group order by it", "用群的阶除以它"],
                t(
                  `All cosets have $${n / d}$ elements, so there are $\\frac{${n}}{${n / d}} = ${d}$ cosets.`,
                  `每个陪集都有 $${n / d}$ 个元素，所以共有 $\\frac{${n}}{${n / d}} = ${d}$ 个陪集。`,
                ),
              ],
            ],
            t(
              `$H$ holds the multiples of $${d}$, so the cosets are $${listed}$, one for each residue modulo $${d}$: $${d}$ of them.`,
              `$H$ 由 $${d}$ 的倍数组成，所以陪集为 $${listed}$，模 $${d}$ 的每个剩余各一个：共 $${d}$ 个。`,
            ),
          ),
        });
      },
    },
    {
      id: "elements-of-cosets-in-zn",
      title: t("Elements of a coset", "陪集的元素"),
      explanation: t(
        "A coset is the subgroup shifted by one element, so add that element to every member of the subgroup. In $\\mathbb{Z}_{18}$ with $H = \\langle 12 \\rangle = \\{0, 6, 12\\}$, the coset $5 + H = \\{5, 11, 17\\}$. An element $x$ lies in $b + H$ exactly when $x - b \\in H$.\n\nIn $\\mathbb{Z}_{120}$ with $H = \\langle 84 \\rangle$, $\\gcd(84, 120) = 12$, so $H$ holds the multiples of $12$. Then $101$ lies in $5 + H$, because $101 - 5 = 96 = 8 \\cdot 12$, while $100$ does not, because $100 - 5 = 95$ is not a multiple of $12$.\n\nCheck: $5 + 8 \\cdot 12 = 101$.\n\n> **Watch out.** $H = \\langle a \\rangle$ holds the multiples of $\\gcd(a, n)$, not only the multiples of $a$ below $n$ that you write first. Test $x - b$ against $\\gcd(a, n)$, and test the difference, not $x$ itself.",
        "陪集是把子群平移一个元素，所以把这个元素加到子群的每个成员上。在 $\\mathbb{Z}_{18}$ 中，$H = \\langle 12 \\rangle = \\{0, 6, 12\\}$，陪集 $5 + H = \\{5, 11, 17\\}$。元素 $x$ 属于 $b + H$ 当且仅当 $x - b \\in H$。\n\n在 $\\mathbb{Z}_{120}$ 中取 $H = \\langle 84 \\rangle$，$\\gcd(84, 120) = 12$，所以 $H$ 由 $12$ 的倍数组成。于是 $101$ 属于 $5 + H$，因为 $101 - 5 = 96 = 8 \\cdot 12$；而 $100$ 不属于，因为 $100 - 5 = 95$ 不是 $12$ 的倍数。\n\n检验：$5 + 8 \\cdot 12 = 101$。\n\n> **注意。** $H = \\langle a \\rangle$ 由 $\\gcd(a, n)$ 的倍数组成，而不只是先写出的那几个 $a$ 的倍数。要用 $\\gcd(a, n)$ 检验 $x - b$，检验的是差，而不是 $x$ 本身。",
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
        const others = rng.sample(outside, 3);
        const diff = (x: number) => (x >= b ? `${x} - ${b} = ${x - b}` : `${x} - ${b} = ${x - b} \\equiv ${mod(x - b, n)}`);
        const sum = b + mod(right - b, n);
        const shift = `${b} + ${mod(right - b, n)} = ${sum}${sum === right ? "" : ` \\equiv ${right}`}`;
        return reasoned(
          texChoice(
            rng,
            t(
              `Let $H = \\langle ${a} \\rangle$ in $${zTex(n)}$. Which element lies in the coset $${b} + H$?`,
              `设 $H = \\langle ${a} \\rangle \\le ${zTex(n)}$。哪个元素属于陪集 $${b} + H$？`,
            ),
            `${right}`,
            others.map(String),
            walked(
              [
                [
                  ["Describe the subgroup", "描述子群"],
                  t(
                    `$\\gcd(${a}, ${n}) = ${d}$, so $H$ consists of the multiples of $${d}$ in $${zTex(n)}$.`,
                    `$\\gcd(${a}, ${n}) = ${d}$，所以 $H$ 由 $${zTex(n)}$ 中 $${d}$ 的倍数组成。`,
                  ),
                ],
                [
                  ["Test the difference", "检验差"],
                  t(
                    `$${diff(right)}$ is a multiple of $${d}$, so $${right} \\in ${b} + H$.`,
                    `$${diff(right)}$ 是 $${d}$ 的倍数，所以 $${right} \\in ${b} + H$。`,
                  ),
                ],
              ],
              t(`$${shift}$ with $${mod(right - b, n)} \\in H$.`, `$${shift}$，其中 $${mod(right - b, n)} \\in H$。`),
            ),
          ),
          others.map((x) =>
            because(
              `${x}`,
              `$${diff(x)}$ is not a multiple of $${d}$, so $${x}$ is in another coset.`,
              `$${diff(x)}$ 不是 $${d}$ 的倍数，所以 $${x}$ 在另一个陪集中。`,
            ),
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
  intro: t(
    "In $U(7) = \\{1, 2, 3, 4, 5, 6\\}$, take $H = \\langle 2 \\rangle = \\{1, 2, 4\\}$. Multiplying each element by $3$ gives $3H = \\{3, 6, 12 \\bmod 7\\} = \\{3, 6, 5\\}$. So $H$ has two cosets, $H$ and $3H$.\n\nCheck: $\\frac{|U(7)|}{|H|} = \\frac{6}{3} = 2$, and the two cosets together hold all six units.\n\nIn this lesson we count the cosets of a cyclic subgroup of $U(n)$ and find the elements of a given coset.",
    "在 $U(7) = \\{1, 2, 3, 4, 5, 6\\}$ 中取 $H = \\langle 2 \\rangle = \\{1, 2, 4\\}$。把每个元素乘以 $3$ 得 $3H = \\{3, 6, 12 \\bmod 7\\} = \\{3, 6, 5\\}$。所以 $H$ 有两个陪集：$H$ 与 $3H$。\n\n检验：$\\frac{|U(7)|}{|H|} = \\frac{6}{3} = 2$，两个陪集合起来恰含全部六个单位。\n\n本课我们数 $U(n)$ 的循环子群的陪集个数，并求给定陪集的元素。",
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
        "Lagrange's theorem applies to every finite group, so the number of cosets is again the group order divided by the subgroup order. In $U(13)$, $\\langle 3 \\rangle = \\{1, 3, 9\\}$ has $3$ elements, so there are $\\frac{12}{3} = 4$ cosets.\n\nIn $U(100)$, which has $\\varphi(100) = 40$ elements, the powers of $7$ are $7, 49, 343 \\bmod 100 = 43, 301 \\bmod 100 = 1$. So $\\langle 7 \\rangle = \\{1, 7, 49, 43\\}$ has $4$ elements, and there are $\\frac{40}{4} = 10$ cosets.\n\nCheck: $7^4 = 2401 \\equiv 1 \\pmod{100}$, and $10 \\cdot 4 = 40$.\n\n> **Watch out.** The group has $\\varphi(n)$ elements, not $n$: dividing $100$ by $4$ gives $25$, which is wrong. And the order of the subgroup is the order of $7$, found by taking powers until you reach $1$.",
        "拉格朗日定理适用于每个有限群，所以陪集的个数仍是群的阶除以子群的阶。在 $U(13)$ 中，$\\langle 3 \\rangle = \\{1, 3, 9\\}$ 有 $3$ 个元素，所以共有 $\\frac{12}{3} = 4$ 个陪集。\n\n$U(100)$ 有 $\\varphi(100) = 40$ 个元素，$7$ 的幂依次为 $7, 49, 343 \\bmod 100 = 43, 301 \\bmod 100 = 1$。所以 $\\langle 7 \\rangle = \\{1, 7, 49, 43\\}$ 有 $4$ 个元素，共有 $\\frac{40}{4} = 10$ 个陪集。\n\n检验：$7^4 = 2401 \\equiv 1 \\pmod{100}$，且 $10 \\cdot 4 = 40$。\n\n> **注意。** 群有 $\\varphi(n)$ 个元素，而不是 $n$ 个：用 $100$ 除以 $4$ 得 $25$，是错的。子群的阶就是 $7$ 的阶，要一直取幂直到得到 $1$。",
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
          mistakes: apart(value, [
            why(
              h,
              "That is the order of $H$, the size of each coset, not the number of cosets.",
              "那是 $H$ 的阶，即每个陪集的大小，不是陪集的个数。",
            ),
            why(phi(n), `That is $|U(${n})|$; divide it by $|H| = ${h}$.`, `那是 $|U(${n})|$；应再除以 $|H| = ${h}$。`),
            ...(n % h === 0
              ? [
                  why(
                    n / h,
                    `That divides $${n}$ by $${h}$, but $U(${n})$ has $\\varphi(${n}) = ${phi(n)}$ elements, not $${n}$.`,
                    `那是用 $${n}$ 除以 $${h}$，但 $U(${n})$ 有 $\\varphi(${n}) = ${phi(n)}$ 个元素，而不是 $${n}$ 个。`,
                  ),
                ]
              : []),
          ]),
          solution: walked(
            [
              [
                ["List the subgroup", "列出子群"],
                t(
                  `The powers of $${a}$ modulo $${n}$ are $${powersMod(a, n).join(", ")}$, so $H$ has $${h}$ elements.`,
                  `$${a}$ 模 $${n}$ 的幂为 $${powersMod(a, n).join(", ")}$，所以 $H$ 有 $${h}$ 个元素。`,
                ),
              ],
              [
                ["Divide the group order by it", "用群的阶除以它"],
                t(
                  `$|U(${n})| = \\varphi(${n}) = ${phi(n)}$, so there are $\\frac{${phi(n)}}{${h}} = ${value}$ cosets.`,
                  `$|U(${n})| = \\varphi(${n}) = ${phi(n)}$，所以共有 $\\frac{${phi(n)}}{${h}} = ${value}$ 个陪集。`,
                ),
              ],
            ],
            t(
              `$${value} \\cdot ${h} = ${phi(n)}$: the $${value}$ cosets of $${h}$ elements each fill $U(${n})$.`,
              `$${value} \\cdot ${h} = ${phi(n)}$：$${value}$ 个各含 $${h}$ 个元素的陪集恰好填满 $U(${n})$。`,
            ),
          ),
        });
      },
    },
    {
      id: "elements-of-cosets-in-groups-of-units",
      title: t("Elements of a coset", "陪集的元素"),
      explanation: t(
        "In a multiplicative group a coset is the subgroup multiplied by one element, with every product reduced modulo the number. In $U(13)$ with $H = \\langle 3 \\rangle = \\{1, 3, 9\\}$, the coset $2H = \\{2, 6, 18 \\bmod 13\\} = \\{2, 6, 5\\}$.\n\nIn $U(100)$ with $H = \\langle 7 \\rangle = \\{1, 7, 49, 43\\}$, the coset $3H = \\{3, 21, 147 \\bmod 100, 129 \\bmod 100\\} = \\{3, 21, 47, 29\\}$.\n\nCheck: $47 \\cdot 7 = 329 \\equiv 29$ and $29 \\cdot 7 = 203 \\equiv 3$, so multiplying by $7$ moves around the coset and comes back to $3$.\n\n> **Watch out.** Multiply, do not add: $3 + H = \\{4, 10, 52, 46\\}$ is not a coset in $U(100)$. And reduce every product modulo $n$ before comparing it with the options.",
        "在乘法群中，陪集是子群乘以一个元素，每个乘积都要模这个数约化。在 $U(13)$ 中，$H = \\langle 3 \\rangle = \\{1, 3, 9\\}$，陪集 $2H = \\{2, 6, 18 \\bmod 13\\} = \\{2, 6, 5\\}$。\n\n在 $U(100)$ 中取 $H = \\langle 7 \\rangle = \\{1, 7, 49, 43\\}$，陪集 $3H = \\{3, 21, 147 \\bmod 100, 129 \\bmod 100\\} = \\{3, 21, 47, 29\\}$。\n\n检验：$47 \\cdot 7 = 329 \\equiv 29$，$29 \\cdot 7 = 203 \\equiv 3$，所以乘以 $7$ 在陪集内循环并回到 $3$。\n\n> **注意。** 要相乘而不是相加：$3 + H = \\{4, 10, 52, 46\\}$ 不是 $U(100)$ 中的陪集。每个乘积都要先模 $n$ 约化，再与选项比较。",
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
        const others = rng.sample(outside, Math.min(3, outside.length));
        const k = h[coset.indexOf(right)] as number;
        const products = h.map((x) => (b * x < n ? `${b * x}` : `${b * x} \\bmod ${n}`)).join(", ");
        return reasoned(
          texChoice(
            rng,
            t(
              `Let $H = \\langle ${a} \\rangle$ in $U(${n})$. Which element lies in the coset $${b}H$?`,
              `设 $H = \\langle ${a} \\rangle \\le U(${n})$。哪个元素属于陪集 $${b}H$？`,
            ),
            `${right}`,
            others.map(String),
            walked(
              [
                [
                  ["List the subgroup", "列出子群"],
                  t(
                    `The powers of $${a}$ modulo $${n}$ give $H = \\{${h.join(", ")}\\}$.`,
                    `$${a}$ 模 $${n}$ 的幂给出 $H = \\{${h.join(", ")}\\}$。`,
                  ),
                ],
                [
                  ["Multiply by the representative", "乘以代表元"],
                  t(
                    `$${b}H = \\{${products}\\} = \\{${coset.join(", ")}\\}$, which contains $${right}$.`,
                    `$${b}H = \\{${products}\\} = \\{${coset.join(", ")}\\}$，其中含有 $${right}$。`,
                  ),
                ],
              ],
              t(
                `$${b} \\cdot ${k} = ${b * k < n ? right : `${b * k} \\equiv ${right} \\pmod{${n}}`}$ with $${k} \\in H$.`,
                `$${b} \\cdot ${k} = ${b * k < n ? right : `${b * k} \\equiv ${right} \\pmod{${n}}`}$，其中 $${k} \\in H$。`,
              ),
            ),
          ),
          others.map((x) =>
            because(
              `${x}`,
              `$${x}$ is not among $${b}H = \\{${coset.join(", ")}\\}$; it lies in another coset.`,
              `$${x}$ 不在 $${b}H = \\{${coset.join(", ")}\\}$ 中；它属于另一个陪集。`,
            ),
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
  intro: t(
    "In $\\mathbb{Z}$, the coset $2 + 5\\mathbb{Z}$ is $\\{\\ldots, -8, -3, 2, 7, 12, \\ldots\\}$: every integer that leaves remainder $2$ on division by $5$. So $12$ and $-3$ lie in the same coset of $5\\mathbb{Z}$, and $12$ and $4$ do not.\n\nCheck: $12 - (-3) = 15 \\in 5\\mathbb{Z}$, while $12 - 4 = 8 \\notin 5\\mathbb{Z}$.\n\nIn this lesson we decide when two numbers share a coset of $n\\mathbb{Z}$, of $\\mathbb{Z}$ in $\\mathbb{Q}$, or of the positive reals in $\\mathbb{R}^*$, and name each coset of $\\mathbb{Z}$ in $\\mathbb{Q}$ by its number in $[0, 1)$.",
    "在 $\\mathbb{Z}$ 中，陪集 $2 + 5\\mathbb{Z}$ 是 $\\{\\ldots, -8, -3, 2, 7, 12, \\ldots\\}$：所有除以 $5$ 余 $2$ 的整数。所以 $12$ 与 $-3$ 在 $5\\mathbb{Z}$ 的同一陪集中，而 $12$ 与 $4$ 不在。\n\n检验：$12 - (-3) = 15 \\in 5\\mathbb{Z}$，而 $12 - 4 = 8 \\notin 5\\mathbb{Z}$。\n\n本课我们判断两个数是否在 $n\\mathbb{Z}$、$\\mathbb{Z}$ 于 $\\mathbb{Q}$ 中或正实数于 $\\mathbb{R}^*$ 中的同一陪集里，并用 $[0, 1)$ 中的数来表示 $\\mathbb{Z}$ 在 $\\mathbb{Q}$ 中的每个陪集。",
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
        "$x$ and $y$ lie in the same coset of $H$ exactly when $x - y \\in H$ (or $xy^{-1} \\in H$ multiplicatively). $17$ and $-3$ lie in the same coset of $5\\mathbb{Z}$, since $20 \\in 5\\mathbb{Z}$; $\\frac{7}{3}$ and $\\frac{1}{3}$ lie in the same coset of $\\mathbb{Z}$ in $\\mathbb{Q}$.\n\nFor larger numbers the test is the same. $1000$ and $-176$ lie in the same coset of $12\\mathbb{Z}$, since $1000 - (-176) = 1176 = 98 \\cdot 12$. $\\frac{45}{7}$ and $-\\frac{11}{7}$ lie in the same coset of $\\mathbb{Z}$, since their difference is $\\frac{56}{7} = 8$. And $-250$ and $-0.5$ lie in the same coset of the positive reals in $\\mathbb{R}^*$, since $\\frac{-250}{-0.5} = 500 > 0$.\n\nCheck: $1000 = 83 \\cdot 12 + 4$ and $-176 = -15 \\cdot 12 + 4$ leave the same remainder $4$.\n\n> **Watch out.** Use the operation of the group. In $\\mathbb{R}^*$ the test is the quotient $xy^{-1}$, not the difference: $-250 - (-0.5)$ is negative, yet the two numbers share a coset. And subtract a negative number with brackets: $1000 - (-176)$ is $1176$, not $824$.",
        "$x$ 与 $y$ 在 $H$ 的同一陪集中当且仅当 $x - y \\in H$（乘法记号下为 $xy^{-1} \\in H$）。$17$ 与 $-3$ 在 $5\\mathbb{Z}$ 的同一陪集中，因为 $20 \\in 5\\mathbb{Z}$；$\\frac{7}{3}$ 与 $\\frac{1}{3}$ 在 $\\mathbb{Z}$ 于 $\\mathbb{Q}$ 中的同一陪集中。\n\n数大一些时检验方法相同。$1000$ 与 $-176$ 在 $12\\mathbb{Z}$ 的同一陪集中，因为 $1000 - (-176) = 1176 = 98 \\cdot 12$。$\\frac{45}{7}$ 与 $-\\frac{11}{7}$ 在 $\\mathbb{Z}$ 的同一陪集中，因为它们的差为 $\\frac{56}{7} = 8$。$-250$ 与 $-0.5$ 在正实数于 $\\mathbb{R}^*$ 中的同一陪集中，因为 $\\frac{-250}{-0.5} = 500 > 0$。\n\n检验：$1000 = 83 \\cdot 12 + 4$，$-176 = -15 \\cdot 12 + 4$，余数同为 $4$。\n\n> **注意。** 要用群自身的运算。在 $\\mathbb{R}^*$ 中检验的是商 $xy^{-1}$ 而不是差：$-250 - (-0.5)$ 是负数，但这两个数在同一陪集中。减去负数时要加括号：$1000 - (-176)$ 等于 $1176$，不是 $824$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const n = rng.int(3, 12);
          const x = rng.int(-40, 40);
          const y = rng.bool() ? x + n * rng.nonZero(-5, 5) : x + rng.int(1, n - 1) + n * rng.int(-3, 3);
          const holds = mod(x - y, n) === 0;
          const minus = `${x} - ${y < 0 ? `(${y})` : y} = ${x - y}`;
          return decide({
            prompt: t(
              `Do $${x}$ and $${y}$ lie in the same coset of $${n}\\mathbb{Z}$ in $\\mathbb{Z}$?`,
              `$${x}$ 与 $${y}$ 在 $${n}\\mathbb{Z}$ 于 $\\mathbb{Z}$ 中的同一陪集中吗？`,
            ),
            holds,
            steps: [
              [["Subtract", "相减"], t(`$${minus}$.`, `$${minus}$。`)],
              [
                ["Test the difference", "检验差"],
                t(
                  `$${x - y}$ is ${holds ? "" : "not "}a multiple of $${n}$, so the two numbers ${holds ? "lie" : "do not lie"} in the same coset.`,
                  `$${x - y}$ ${holds ? "是" : "不是"} $${n}$ 的倍数，所以两个数${holds ? "在" : "不在"}同一陪集中。`,
                ),
              ],
            ],
            check: holds
              ? t(`Both leave remainder $${mod(x, n)}$ on division by $${n}$.`, `两个数除以 $${n}$ 的余数都是 $${mod(x, n)}$。`)
              : t(
                  `$${x}$ leaves remainder $${mod(x, n)}$ and $${y}$ leaves remainder $${mod(y, n)}$ on division by $${n}$.`,
                  `$${x}$ 除以 $${n}$ 余 $${mod(x, n)}$，$${y}$ 除以 $${n}$ 余 $${mod(y, n)}$。`,
                ),
            wrong: holds
              ? t(
                  `$${x - y}$ is a multiple of $${n}$, so the difference lies in $${n}\\mathbb{Z}$.`,
                  `$${x - y}$ 是 $${n}$ 的倍数，所以差属于 $${n}\\mathbb{Z}$。`,
                )
              : t(
                  `$${x - y}$ is not a multiple of $${n}$, so the difference is not in $${n}\\mathbb{Z}$.`,
                  `$${x - y}$ 不是 $${n}$ 的倍数，所以差不属于 $${n}\\mathbb{Z}$。`,
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
          const [u, v] = [Q.of(p, q).toLatex(), Q.of(p2, q).toLatex()];
          const minus = `${u} - ${p2 < 0 ? `\\left(${v}\\right)` : v} = ${diff.toLatex()}`;
          return decide({
            prompt: t(
              `Do $${u}$ and $${v}$ lie in the same coset of $\\mathbb{Z}$ in $\\mathbb{Q}$?`,
              `$${u}$ 与 $${v}$ 在 $\\mathbb{Z}$ 于 $\\mathbb{Q}$ 中的同一陪集中吗？`,
            ),
            holds: same,
            steps: [
              [["Subtract", "相减"], t(`$${minus}$.`, `$${minus}$。`)],
              [
                ["Test the difference", "检验差"],
                t(
                  `$${diff.toLatex()}$ is ${same ? "" : "not "}an integer, so the two numbers ${same ? "lie" : "do not lie"} in the same coset.`,
                  `$${diff.toLatex()}$ ${same ? "是" : "不是"}整数，所以两个数${same ? "在" : "不在"}同一陪集中。`,
                ),
              ],
            ],
            check: same
              ? t(
                  `Both have the part $${Q.of(mod(p, q), q).toLatex()}$ in $[0, 1)$ after removing an integer.`,
                  `去掉整数部分后，两个数在 $[0, 1)$ 中的部分都是 $${Q.of(mod(p, q), q).toLatex()}$。`,
                )
              : t(
                  `After removing an integer, $${u}$ leaves $${Q.of(mod(p, q), q).toLatex()}$ and $${v}$ leaves $${Q.of(mod(p2, q), q).toLatex()}$ in $[0, 1)$.`,
                  `去掉整数部分后，$${u}$ 剩下 $${Q.of(mod(p, q), q).toLatex()}$，$${v}$ 剩下 $${Q.of(mod(p2, q), q).toLatex()}$，都在 $[0, 1)$ 中。`,
                ),
            wrong: same
              ? t(
                  `The difference $${diff.toLatex()}$ is an integer, so it lies in $\\mathbb{Z}$.`,
                  `差 $${diff.toLatex()}$ 是整数，所以属于 $\\mathbb{Z}$。`,
                )
              : t(
                  `The difference $${diff.toLatex()}$ is not an integer, so it is not in $\\mathbb{Z}$.`,
                  `差 $${diff.toLatex()}$ 不是整数，所以不属于 $\\mathbb{Z}$。`,
                ),
          });
        }
        const x = rng.nonZero(-20, 20);
        const y = rng.nonZero(-20, 20);
        const same = x * y > 0;
        const sign = (z: number) => (z > 0 ? t("positive", "正数") : t("negative", "负数"));
        return decide({
          prompt: t(
            `Let $H$ be the positive reals, a subgroup of $\\mathbb{R}^*$. Do $${x}$ and $${y}$ lie in the same coset of $H$?`,
            `设 $H$ 为正实数集，它是 $\\mathbb{R}^*$ 的子群。$${x}$ 与 $${y}$ 在 $H$ 的同一陪集中吗？`,
          ),
          holds: same,
          steps: [
            [
              ["Form the quotient", "求商"],
              t(
                `The group operation is multiplication, so test the quotient $xy^{-1} = \\frac{${x}}{${y}}$.`,
                `群的运算是乘法，所以检验商 $xy^{-1} = \\frac{${x}}{${y}}$。`,
              ),
            ],
            [
              ["Read its sign", "看符号"],
              t(
                `$\\frac{${x}}{${y}}$ is ${same ? "positive, so it lies in $H$" : "negative, so it is not in $H$"}.`,
                `$\\frac{${x}}{${y}}$ 为${same ? "正，所以属于 $H$" : "负，所以不属于 $H$"}。`,
              ),
            ],
          ],
          check: t(
            `The cosets of $H$ are the positive and the negative reals; $${x}$ is ${sign(x).en} and $${y}$ is ${sign(y).en}.`,
            `$H$ 的陪集是正实数集与负实数集；$${x}$ 是${sign(x)["zh-CN"]}，$${y}$ 是${sign(y)["zh-CN"]}。`,
          ),
          wrong: same
            ? t(
                `$${x}$ and $${y}$ have the same sign, so their quotient is positive and lies in $H$.`,
                `$${x}$ 与 $${y}$ 同号，所以商为正，属于 $H$。`,
              )
            : t(
                `$${x}$ and $${y}$ have opposite signs, so their quotient is negative and not in $H$.`,
                `$${x}$ 与 $${y}$ 异号，所以商为负，不属于 $H$。`,
              ),
        });
      },
    },
    {
      id: "representatives-of-cosets-of-z-in-q",
      title: t("Coset representatives", "陪集代表元"),
      explanation: t(
        "Two rationals lie in the same coset when they differ by an integer, so each coset is named by the fractional part of any member. Every coset $x + \\mathbb{Z}$ in $\\mathbb{Q}$ contains exactly one number in $[0, 1)$. For $x = -\\frac{17}{5} = -4 + \\frac{3}{5}$, it is $\\frac{3}{5}$.\n\nFor $x = -\\frac{250}{11}$, divide: $250 = 22 \\cdot 11 + 8$, so $-\\frac{250}{11} = -23 + \\frac{3}{11}$, and the representative is $\\frac{3}{11}$.\n\nCheck: $-23 + \\frac{3}{11} = \\frac{-253 + 3}{11} = -\\frac{250}{11}$, and $0 \\le \\frac{3}{11} < 1$.\n\n> **Watch out.** For a negative number, round down to the next integer below, not toward zero: $-\\frac{250}{11} = -22 - \\frac{8}{11}$, but $-\\frac{8}{11}$ is not in $[0, 1)$, and $\\frac{8}{11}$ is in a different coset.",
        "两个有理数相差一个整数时属于同一个陪集，所以每个陪集可以用其中任一成员的小数部分来表示。$\\mathbb{Q}$ 中每个陪集 $x + \\mathbb{Z}$ 恰含一个 $[0, 1)$ 中的数。对 $x = -\\frac{17}{5} = -4 + \\frac{3}{5}$，这个数是 $\\frac{3}{5}$。\n\n对 $x = -\\frac{250}{11}$，先做除法：$250 = 22 \\cdot 11 + 8$，所以 $-\\frac{250}{11} = -23 + \\frac{3}{11}$，代表元为 $\\frac{3}{11}$。\n\n检验：$-23 + \\frac{3}{11} = \\frac{-253 + 3}{11} = -\\frac{250}{11}$，且 $0 \\le \\frac{3}{11} < 1$。\n\n> **注意。** 负数要向下取到更小的整数，而不是向零取整：$-\\frac{250}{11} = -22 - \\frac{8}{11}$，但 $-\\frac{8}{11}$ 不在 $[0, 1)$ 中，而 $\\frac{8}{11}$ 在另一个陪集里。",
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
          mistakes: apart(value, [
            ...(p < 0
              ? [
                  why(
                    Q.of(Math.abs(p) % q, q),
                    "That drops the sign and keeps the remainder of the numerator; for a negative number, round down instead.",
                    "那是去掉符号后分子的余数；负数要向下取整。",
                  ),
                  why(
                    Q.of(-(Math.abs(p) % q), q),
                    "That rounds toward zero; the leftover is negative, so it is not in $[0, 1)$.",
                    "那是向零取整；剩下的部分是负数，不在 $[0, 1)$ 中。",
                  ),
                ]
              : []),
            why(
              Q.of(q - mod(p, q), q),
              "That is $1$ minus the representative; it lies in a different coset.",
              "那是 $1$ 减去代表元；它在另一个陪集中。",
            ),
            why(Q.of((Math.abs(p) % q) + q, q), "That is not in $[0, 1)$: it is at least $1$.", "它不在 $[0, 1)$ 中：它至少为 $1$。"),
          ]),
          solution: walked(
            [
              [
                ["Find the integer below", "求下方的整数"],
                t(
                  `$${Q.of(p, q).toLatex()}$ lies between $${Math.floor(p / q)}$ and $${Math.floor(p / q) + 1}$, so subtract $${Math.floor(p / q)}$.`,
                  `$${Q.of(p, q).toLatex()}$ 介于 $${Math.floor(p / q)}$ 与 $${Math.floor(p / q) + 1}$ 之间，所以减去 $${Math.floor(p / q)}$。`,
                ),
              ],
              [
                ["Read off the representative", "读出代表元"],
                t(
                  `$${Q.of(p, q).toLatex()} = ${Math.floor(p / q)} + ${value.toLatex()}$, so the representative is $${value.toLatex()}$.`,
                  `$${Q.of(p, q).toLatex()} = ${Math.floor(p / q)} + ${value.toLatex()}$，所以代表元为 $${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `$\\frac{${Math.floor(p / q) * q} + ${mod(p, q)}}{${q}} = ${Q.of(p, q).toLatex()}$, and $0 \\le ${value.toLatex()} < 1$.`,
              `$\\frac{${Math.floor(p / q) * q} + ${mod(p, q)}}{${q}} = ${Q.of(p, q).toLatex()}$，且 $0 \\le ${value.toLatex()} < 1$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** det2 is the determinant of a 2 × 2 matrix. */
const det2 = (m: Mat2) => m[0] * m[3] - m[1] * m[2];

/** detLine works out the determinant of a 2 × 2 matrix as (a)(d) - (b)(c). */
const detLine = (m: Mat2) => `(${m[0]})(${m[3]}) - (${m[1]})(${m[2]}) = ${det2(m)}`;

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
  intro: t(
    "Take $A = \\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}$, with $\\det A = 2$, and $S = \\begin{pmatrix} 1 & 3 \\\\ 0 & 1 \\end{pmatrix}$ in $SL(2, \\mathbb{R})$. Then $AS = \\begin{pmatrix} 2 & 6 \\\\ 0 & 1 \\end{pmatrix}$ lies in the coset $A \\cdot SL(2, \\mathbb{R})$, and its determinant is again $2$.\n\nCheck: $\\det(AS) = (2)(1) - (6)(0) = 2 = \\det A \\cdot \\det S$.\n\nIn this lesson we decide when two matrices share a coset of $SL(2, \\mathbb{R})$ and pick out the members of a given coset by their determinants.",
    "取 $A = \\begin{pmatrix} 2 & 0 \\\\ 0 & 1 \\end{pmatrix}$，$\\det A = 2$，并取 $SL(2, \\mathbb{R})$ 中的 $S = \\begin{pmatrix} 1 & 3 \\\\ 0 & 1 \\end{pmatrix}$。则 $AS = \\begin{pmatrix} 2 & 6 \\\\ 0 & 1 \\end{pmatrix}$ 属于陪集 $A \\cdot SL(2, \\mathbb{R})$，它的行列式仍为 $2$。\n\n检验：$\\det(AS) = (2)(1) - (6)(0) = 2 = \\det A \\cdot \\det S$。\n\n本课我们判断两个矩阵何时在 $SL(2, \\mathbb{R})$ 的同一陪集中，并用行列式挑出给定陪集的成员。",
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
        "Two matrices share a coset of the matrices with determinant one exactly when their determinants are equal, because the determinant is multiplicative. $A$ and $B$ lie in the same left coset of $SL(2, \\mathbb{R})$ exactly when $A^{-1}B \\in SL(2, \\mathbb{R})$, that is, $\\det B = \\det A$.\n\nWith larger entries, $A = \\begin{pmatrix} 20 & 7 \\\\ 9 & 4 \\end{pmatrix}$ has $\\det A = 80 - 63 = 17$ and $B = \\begin{pmatrix} 5 & 12 \\\\ 1 & 6 \\end{pmatrix}$ has $\\det B = 30 - 12 = 18$, so they lie in different cosets, even though their entries look alike in size.\n\nCheck: $\\det(A^{-1}B) = \\frac{18}{17} \\ne 1$, so $A^{-1}B \\notin SL(2, \\mathbb{R})$.\n\n> **Watch out.** Compare determinants, not entries: two matrices with no entry in common can share a coset. And the determinant is $ad - bc$, not $ad + bc$ or $ab - cd$.",
        "两个矩阵属于行列式为 1 的矩阵所成子群的同一个陪集，当且仅当它们的行列式相等，因为行列式是积性的。$A$ 与 $B$ 在 $SL(2, \\mathbb{R})$ 的同一左陪集中当且仅当 $A^{-1}B \\in SL(2, \\mathbb{R})$，即 $\\det B = \\det A$。\n\n元素较大时，$A = \\begin{pmatrix} 20 & 7 \\\\ 9 & 4 \\end{pmatrix}$ 的 $\\det A = 80 - 63 = 17$，$B = \\begin{pmatrix} 5 & 12 \\\\ 1 & 6 \\end{pmatrix}$ 的 $\\det B = 30 - 12 = 18$，所以它们在不同的陪集中，尽管元素的大小看起来相近。\n\n检验：$\\det(A^{-1}B) = \\frac{18}{17} \\ne 1$，所以 $A^{-1}B \\notin SL(2, \\mathbb{R})$。\n\n> **注意。** 要比较行列式，而不是比较元素：没有一个元素相同的两个矩阵也可能在同一陪集中。行列式是 $ad - bc$，不是 $ad + bc$ 或 $ab - cd$。",
      ),
      generate(rng) {
        const a = randomIntMatrix(rng);
        const b = rng.bool() ? mul2(a, randomSL2(rng)) : randomIntMatrix(rng);
        const same = det2(a) === det2(b);
        return decide({
          prompt: t(
            `Do $A = ${mat2Tex(a)}$ and $B = ${mat2Tex(b)}$ lie in the same left coset of $SL(2, \\mathbb{R})$ in $GL(2, \\mathbb{R})$?`,
            `$A = ${mat2Tex(a)}$ 与 $B = ${mat2Tex(b)}$ 在 $SL(2, \\mathbb{R})$ 于 $GL(2, \\mathbb{R})$ 中的同一左陪集中吗？`,
          ),
          holds: same,
          steps: [
            [
              ["Compute the determinants", "计算行列式"],
              t(`$\\det A = ${detLine(a)}$ and $\\det B = ${detLine(b)}$.`, `$\\det A = ${detLine(a)}$，$\\det B = ${detLine(b)}$。`),
            ],
            [
              ["Compare them", "比较"],
              t(
                `The determinants are ${same ? "equal, so $A$ and $B$ lie in the same coset" : "different, so $A$ and $B$ lie in different cosets"}.`,
                `两个行列式${same ? "相等，所以 $A$ 与 $B$ 在同一陪集中" : "不相等，所以 $A$ 与 $B$ 在不同的陪集中"}。`,
              ),
            ],
          ],
          check: t(
            `$\\det(A^{-1}B) = \\frac{\\det B}{\\det A} = ${Q.of(det2(b), det2(a)).toLatex()}$, which ${same ? "is" : "is not"} $1$.`,
            `$\\det(A^{-1}B) = \\frac{\\det B}{\\det A} = ${Q.of(det2(b), det2(a)).toLatex()}$，${same ? "等于" : "不等于"} $1$。`,
          ),
          wrong: same
            ? t(
                `Both determinants are $${det2(a)}$, so $A^{-1}B$ has determinant $1$.`,
                `两个行列式都是 $${det2(a)}$，所以 $A^{-1}B$ 的行列式为 $1$。`,
              )
            : t(
                `The determinants $${det2(a)}$ and $${det2(b)}$ differ, so $A^{-1}B$ does not have determinant $1$.`,
                `行列式 $${det2(a)}$ 与 $${det2(b)}$ 不相等，所以 $A^{-1}B$ 的行列式不为 $1$。`,
              ),
        });
      },
    },
    {
      id: "elements-of-cosets-of-sl2",
      title: t("Elements of a coset", "陪集的元素"),
      explanation: t(
        "$A \\cdot SL(2, \\mathbb{R})$ contains $AS$ for every $S$ of determinant $1$, and nothing else. With $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 1 \\end{pmatrix}$, every matrix of determinant $2$ is in the coset.\n\nWith $A = \\begin{pmatrix} 9 & 4 \\\\ 7 & 3 \\end{pmatrix}$, $\\det A = 27 - 28 = -1$. So $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$, of determinant $-1$, lies in $A \\cdot SL(2, \\mathbb{R})$, while $\\begin{pmatrix} 9 & 4 \\\\ -7 & -3 \\end{pmatrix}$, of determinant $1$, does not.\n\nCheck: $A^{-1} = \\begin{pmatrix} -3 & 4 \\\\ 7 & -9 \\end{pmatrix}$, and $A^{-1}\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} 4 & -3 \\\\ -9 & 7 \\end{pmatrix}$ has determinant $28 - 27 = 1$.\n\n> **Watch out.** Negating a row, or swapping the columns, changes the sign of the determinant, so such a matrix leaves the coset unless $\\det A = 0$, which cannot happen in $GL(2, \\mathbb{R})$.",
        "$A \\cdot SL(2, \\mathbb{R})$ 由所有 $AS$（$S$ 的行列式为 $1$）组成。若 $A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 1 \\end{pmatrix}$，则每个行列式为 $2$ 的矩阵都在该陪集中。\n\n取 $A = \\begin{pmatrix} 9 & 4 \\\\ 7 & 3 \\end{pmatrix}$，$\\det A = 27 - 28 = -1$。所以行列式为 $-1$ 的 $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$ 属于 $A \\cdot SL(2, \\mathbb{R})$，而行列式为 $1$ 的 $\\begin{pmatrix} 9 & 4 \\\\ -7 & -3 \\end{pmatrix}$ 不属于。\n\n检验：$A^{-1} = \\begin{pmatrix} -3 & 4 \\\\ 7 & -9 \\end{pmatrix}$，而 $A^{-1}\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} 4 & -3 \\\\ -9 & 7 \\end{pmatrix}$ 的行列式为 $28 - 27 = 1$。\n\n> **注意。** 把一行取负或交换两列都会改变行列式的符号，所以这样得到的矩阵离开了该陪集，除非 $\\det A = 0$，而这在 $GL(2, \\mathbb{R})$ 中不可能。",
      ),
      generate(rng) {
        const a = randomIntMatrix(rng);
        const d = det2(a);
        let right: Mat2;
        let s: Mat2;
        do {
          s = randomSL2(rng);
          right = mul2(a, s);
        } while (right.every((x, i) => x === a[i]));
        const wrongs: Mat2[] = [];
        while (wrongs.length < 5) {
          const m = randomIntMatrix(rng);
          if (det2(m) !== d) wrongs.push(m);
        }
        const candidates: Mat2[] = [[a[0], a[1], -a[2], -a[3]], [a[1], a[0], a[3], a[2]], ...wrongs];
        const shown: Mat2[] = [];
        for (const m of candidates) {
          if (shown.length === 3) break;
          if (mat2Tex(m) !== mat2Tex(right) && !shown.some((x) => mat2Tex(x) === mat2Tex(m))) shown.push(m);
        }
        return reasoned(
          texChoice(
            rng,
            t(
              `Let $A = ${mat2Tex(a)}$. Which matrix lies in the left coset $A \\cdot SL(2, \\mathbb{R})$?`,
              `设 $A = ${mat2Tex(a)}$。哪个矩阵属于左陪集 $A \\cdot SL(2, \\mathbb{R})$？`,
            ),
            mat2Tex(right),
            candidates.map(mat2Tex),
            walked(
              [
                [
                  ["Find the determinant of the coset", "求陪集的行列式"],
                  t(
                    `$\\det A = ${detLine(a)}$, and the coset consists of the matrices of determinant $${d}$.`,
                    `$\\det A = ${detLine(a)}$，该陪集由行列式为 $${d}$ 的矩阵组成。`,
                  ),
                ],
                [
                  ["Test the options", "检验选项"],
                  t(
                    `$\\det ${mat2Tex(right)} = ${detLine(right)}$, so this matrix lies in the coset.`,
                    `$\\det ${mat2Tex(right)} = ${detLine(right)}$，所以这个矩阵属于该陪集。`,
                  ),
                ],
              ],
              t(
                `$${mat2Tex(right)} = A${mat2Tex(s)}$, and $\\det ${mat2Tex(s)} = ${detLine(s)}$.`,
                `$${mat2Tex(right)} = A${mat2Tex(s)}$，且 $\\det ${mat2Tex(s)} = ${detLine(s)}$。`,
              ),
            ),
          ),
          shown.map((m) =>
            because(mat2Tex(m), `Its determinant is $${detLine(m)}$, not $${d}$.`, `它的行列式为 $${detLine(m)}$，不是 $${d}$。`),
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
  intro: t(
    "In $S_3$, take $H = \\{e, (1\\;2)\\}$ and $\\sigma = (1\\;3)$, composing from right to left. Then $\\sigma H = \\{(1\\;3), (1\\;3)(1\\;2)\\} = \\{(1\\;3), (1\\;2\\;3)\\}$, but $H\\sigma = \\{(1\\;3), (1\\;2)(1\\;3)\\} = \\{(1\\;3), (1\\;3\\;2)\\}$. The left and right cosets of $\\sigma$ differ.\n\nCheck: $(1\\;3)(1\\;2)$ sends $1 \\to 2 \\to 2$, $2 \\to 1 \\to 3$ and $3 \\to 3 \\to 1$, which is $(1\\;2\\;3)$.\n\nIn this lesson we find left cosets in $S_n$ and decide when the left and right cosets of an element agree.",
    "在 $S_3$ 中取 $H = \\{e, (1\\;2)\\}$，$\\sigma = (1\\;3)$，乘积从右向左复合。则 $\\sigma H = \\{(1\\;3), (1\\;3)(1\\;2)\\} = \\{(1\\;3), (1\\;2\\;3)\\}$，而 $H\\sigma = \\{(1\\;3), (1\\;2)(1\\;3)\\} = \\{(1\\;3), (1\\;3\\;2)\\}$。$\\sigma$ 的左陪集与右陪集不同。\n\n检验：$(1\\;3)(1\\;2)$ 把 $1 \\to 2 \\to 2$，$2 \\to 1 \\to 3$，$3 \\to 3 \\to 1$，正是 $(1\\;2\\;3)$。\n\n本课我们求 $S_n$ 中的左陪集，并判断一个元素的左陪集与右陪集何时相同。",
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
        "A left coset multiplies the fixed element on the left of every subgroup element, so compute each of those products. Multiply $\\sigma$ by each element of $H$ on the right. With $H = \\{e, (1\\;2)\\}$ and $\\sigma = (1\\;3)$: $\\sigma e = (1\\;3)$ and $\\sigma(1\\;2) = (1\\;2\\;3)$, so $\\sigma H = \\{(1\\;3), (1\\;2\\;3)\\}$.\n\nIn $S_5$, take $H = \\langle (1\\;2\\;3) \\rangle = \\{e, (1\\;2\\;3), (1\\;3\\;2)\\}$ and $\\sigma = (3\\;4\\;5)$. Then $\\sigma(1\\;2\\;3) = (1\\;2\\;4\\;5\\;3)$ and $\\sigma(1\\;3\\;2) = (1\\;4\\;5\\;3\\;2)$, so $\\sigma H = \\{(3\\;4\\;5), (1\\;2\\;4\\;5\\;3), (1\\;4\\;5\\;3\\;2)\\}$.\n\nCheck: $\\sigma^{-1}(1\\;2\\;4\\;5\\;3) = (5\\;4\\;3)(1\\;2\\;4\\;5\\;3) = (1\\;2\\;3) \\in H$.\n\n> **Watch out.** The order of the factors matters. $(1\\;2\\;3)(3\\;4\\;5) = (1\\;2\\;3\\;4\\;5)$ lies in the right coset $H\\sigma$, not in $\\sigma H$. And compose from right to left: the factor on the right acts first.",
        "左陪集是把固定元素乘在每个子群元素的左边，所以要计算每个这样的乘积。用 $\\sigma$ 右乘 $H$ 的每个元素。设 $H = \\{e, (1\\;2)\\}$，$\\sigma = (1\\;3)$：$\\sigma e = (1\\;3)$，$\\sigma(1\\;2) = (1\\;2\\;3)$，所以 $\\sigma H = \\{(1\\;3), (1\\;2\\;3)\\}$。\n\n在 $S_5$ 中取 $H = \\langle (1\\;2\\;3) \\rangle = \\{e, (1\\;2\\;3), (1\\;3\\;2)\\}$，$\\sigma = (3\\;4\\;5)$。则 $\\sigma(1\\;2\\;3) = (1\\;2\\;4\\;5\\;3)$，$\\sigma(1\\;3\\;2) = (1\\;4\\;5\\;3\\;2)$，所以 $\\sigma H = \\{(3\\;4\\;5), (1\\;2\\;4\\;5\\;3), (1\\;4\\;5\\;3\\;2)\\}$。\n\n检验：$\\sigma^{-1}(1\\;2\\;4\\;5\\;3) = (5\\;4\\;3)(1\\;2\\;4\\;5\\;3) = (1\\;2\\;3) \\in H$。\n\n> **注意。** 因子的顺序很重要。$(1\\;2\\;3)(3\\;4\\;5) = (1\\;2\\;3\\;4\\;5)$ 属于右陪集 $H\\sigma$，而不属于 $\\sigma H$。要从右向左复合：右边的因子先作用。",
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
        const products = h.elements
          .slice(1)
          .map((x, i) => `$\\sigma${permCycleTex(x)} = ${permCycleTex(left[i + 1] as Perm)}$`)
          .join(", ");
        const g = permCycleTex(h.gen);
        return reasoned(
          texChoice(
            rng,
            t(
              `In $S_{${n}}$, let $H = \\langle ${g} \\rangle$ and $\\sigma = ${permCycleTex(s)}$. Products are composed from right to left. Find the left coset $\\sigma H$.`,
              `在 $S_{${n}}$ 中，设 $H = \\langle ${g} \\rangle$，$\\sigma = ${permCycleTex(s)}$。乘积从右向左复合。求左陪集 $\\sigma H$。`,
            ),
            setTex(left),
            [setTex(right), setTex(other), setTex([s, h.gen])],
            walked(
              [
                [["List the subgroup", "列出子群"], t(`$H = ${setTex(h.elements)}$.`, `$H = ${setTex(h.elements)}$。`)],
                [
                  ["Multiply by sigma on the left", "在左边乘以 σ"],
                  t(
                    `$\\sigma e = ${permCycleTex(s)}$ and ${products}, so $\\sigma H = ${setTex(left)}$.`,
                    `$\\sigma e = ${permCycleTex(s)}$，${products}，所以 $\\sigma H = ${setTex(left)}$。`,
                  ),
                ],
              ],
              t(
                `$\\sigma^{-1} \\cdot ${permCycleTex(left[1] as Perm)} = ${g} \\in H$, and the coset has $${h.elements.length}$ elements, as many as $H$.`,
                `$\\sigma^{-1} \\cdot ${permCycleTex(left[1] as Perm)} = ${g} \\in H$，且该陪集有 $${h.elements.length}$ 个元素，与 $H$ 一样多。`,
              ),
            ),
          ),
          [
            because(
              setTex(right),
              "That is the right coset $H\\sigma$, with $\\sigma$ on the right of each element; here it differs from $\\sigma H$.",
              "那是右陪集 $H\\sigma$，$\\sigma$ 乘在每个元素的右边；这里它与 $\\sigma H$ 不同。",
            ),
            because(
              setTex(other),
              "That is $\\sigma^{-1}H$: it multiplies by $\\sigma^{-1}$ instead of $\\sigma$.",
              "那是 $\\sigma^{-1}H$：乘的是 $\\sigma^{-1}$ 而不是 $\\sigma$。",
            ),
            because(
              setTex([s, h.gen]),
              `That lists $\\sigma$ and the generator side by side instead of multiplying them: $\\sigma${g} = ${permCycleTex(left[1] as Perm)}$.`,
              `那是把 $\\sigma$ 与生成元并列，而没有相乘：$\\sigma${g} = ${permCycleTex(left[1] as Perm)}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "comparing-left-and-right-cosets",
      title: t("Left versus right cosets", "左陪集与右陪集"),
      explanation: t(
        "Left and right cosets of an element agree exactly when conjugating by that element leaves the subgroup unchanged. $\\sigma H = H\\sigma$ exactly when $\\sigma H \\sigma^{-1} = H$. With $H = \\langle (1\\;2\\;3) \\rangle$ in $S_3$, every $\\sigma$ satisfies this; with $H = \\langle (1\\;2) \\rangle$, $\\sigma = (1\\;3)$ does not.\n\nIn $S_5$, take $H = \\langle (1\\;2\\;3) \\rangle$. For $\\sigma = (4\\;5)$, which moves none of $1, 2, 3$, $\\sigma$ commutes with every element of $H$, so $\\sigma H = H\\sigma$. For $\\sigma = (3\\;4)$, relabelling gives $\\sigma(1\\;2\\;3)\\sigma^{-1} = (1\\;2\\;4) \\notin H$, so $\\sigma H \\ne H\\sigma$.\n\nCheck: $(3\\;4)(1\\;2\\;3) = (1\\;2\\;4\\;3)$ lies in $\\sigma H$, but $H\\sigma = \\{(3\\;4), (1\\;2\\;3)(3\\;4), (1\\;3\\;2)(3\\;4)\\} = \\{(3\\;4), (1\\;2\\;3\\;4), (1\\;3\\;4\\;2)\\}$ does not contain it.\n\n> **Watch out.** $\\sigma H = H\\sigma$ is an equality of sets; it does not need $\\sigma h = h\\sigma$ for each $h$. In $S_3$, $(1\\;2)\\langle (1\\;2\\;3) \\rangle = \\langle (1\\;2\\;3) \\rangle (1\\;2)$, although $(1\\;2)(1\\;2\\;3) \\ne (1\\;2\\;3)(1\\;2)$.",
        "一个元素的左陪集和右陪集相同，当且仅当用这个元素共轭后子群保持不变。$\\sigma H = H\\sigma$ 当且仅当 $\\sigma H \\sigma^{-1} = H$。在 $S_3$ 中取 $H = \\langle (1\\;2\\;3) \\rangle$，每个 $\\sigma$ 都满足；取 $H = \\langle (1\\;2) \\rangle$，$\\sigma = (1\\;3)$ 不满足。\n\n在 $S_5$ 中取 $H = \\langle (1\\;2\\;3) \\rangle$。对 $\\sigma = (4\\;5)$，它不移动 $1, 2, 3$ 中任何一个，与 $H$ 的每个元素可交换，所以 $\\sigma H = H\\sigma$。对 $\\sigma = (3\\;4)$，重新标记得 $\\sigma(1\\;2\\;3)\\sigma^{-1} = (1\\;2\\;4) \\notin H$，所以 $\\sigma H \\ne H\\sigma$。\n\n检验：$(3\\;4)(1\\;2\\;3) = (1\\;2\\;4\\;3)$ 属于 $\\sigma H$，但 $H\\sigma = \\{(3\\;4), (1\\;2\\;3)(3\\;4), (1\\;3\\;2)(3\\;4)\\} = \\{(3\\;4), (1\\;2\\;3\\;4), (1\\;3\\;4\\;2)\\}$ 不含它。\n\n> **注意。** $\\sigma H = H\\sigma$ 是集合相等；并不要求对每个 $h$ 都有 $\\sigma h = h\\sigma$。在 $S_3$ 中，$(1\\;2)\\langle (1\\;2\\;3) \\rangle = \\langle (1\\;2\\;3) \\rangle (1\\;2)$，尽管 $(1\\;2)(1\\;2\\;3) \\ne (1\\;2\\;3)(1\\;2)$。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const h = randomSmallSubgroup(rng, n);
        const s = cyclePerm(n, rng.sample(range(0, n - 1), rng.int(2, Math.min(n, 4))));
        const left = h.elements.map((x) => composePerm(s, x));
        const right = h.elements.map((x) => composePerm(x, s));
        const same = sameSet(left, right);
        const g = permCycleTex(h.gen);
        const c = permCycleTex(conjugatePerm(s, h.gen));
        return decide({
          prompt: t(
            `In $S_{${n}}$, let $H = \\langle ${g} \\rangle$ and $\\sigma = ${permCycleTex(s)}$. Is $\\sigma H = H\\sigma$?`,
            `在 $S_{${n}}$ 中，设 $H = \\langle ${g} \\rangle$，$\\sigma = ${permCycleTex(s)}$。$\\sigma H = H\\sigma$ 吗？`,
          ),
          holds: same,
          steps: [
            [["Find the left coset", "求左陪集"], t(`$\\sigma H = ${setTex(left)}$.`, `$\\sigma H = ${setTex(left)}$。`)],
            [
              ["Find the right coset and compare", "求右陪集并比较"],
              t(
                `$H\\sigma = ${setTex(right)}$, which is ${same ? "the same set" : "a different set"}.`,
                `$H\\sigma = ${setTex(right)}$，${same ? "是同一个集合" : "是不同的集合"}。`,
              ),
            ],
          ],
          check: t(
            `Relabelling the points of $${g}$ by $\\sigma$ gives $\\sigma${g}\\sigma^{-1} = ${c}$, which ${same ? "lies" : "does not lie"} in $H$.`,
            `用 $\\sigma$ 重新标记 $${g}$ 的点得 $\\sigma${g}\\sigma^{-1} = ${c}$，它${same ? "属于" : "不属于"} $H$。`,
          ),
          wrong: same
            ? t("The two sets have the same elements, listed in a different order at most.", "两个集合的元素相同，至多是排列顺序不同。")
            : t("The two sets differ: some element of one is missing from the other.", "两个集合不同：其中一个的某个元素不在另一个中。"),
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
  intro: t(
    "In $S_3$, take $N = A_3 = \\{e, (1\\;2\\;3), (1\\;3\\;2)\\}$. Conjugating $(1\\;2\\;3)$ by $(1\\;2)$ relabels its points: $(1\\;2)(1\\;2\\;3)(1\\;2)^{-1} = (2\\;1\\;3) = (1\\;3\\;2)$, which is again in $N$. Every conjugate of every element of $N$ stays in $N$, so $N$ is normal.\n\nCheck: $N$ has index $\\frac{6}{3} = 2$, and a subgroup of index $2$ is always normal.\n\nIn this lesson we decide which subgroups are normal and conjugate permutations by relabelling their cycles.",
    "在 $S_3$ 中取 $N = A_3 = \\{e, (1\\;2\\;3), (1\\;3\\;2)\\}$。用 $(1\\;2)$ 共轭 $(1\\;2\\;3)$ 就是重新标记它的点：$(1\\;2)(1\\;2\\;3)(1\\;2)^{-1} = (2\\;1\\;3) = (1\\;3\\;2)$，仍在 $N$ 中。$N$ 中每个元素的每个共轭都留在 $N$ 中，所以 $N$ 是正规子群。\n\n检验：$N$ 的指数为 $\\frac{6}{3} = 2$，而指数为 $2$ 的子群总是正规的。\n\n本课我们判断哪些子群是正规的，并通过重新标记轮换来共轭置换。",
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
        "A subgroup is normal when every conjugate of it is itself; subgroups of index two and kernels of homomorphisms are always normal. $A_n \\trianglelefteq S_n$ since it has index $2$, and $SL(2, \\mathbb{R}) \\trianglelefteq GL(2, \\mathbb{R})$ since $\\det(ASA^{-1}) = \\det S$. But $\\langle (1\\;2) \\rangle$ is not normal in $S_3$: $(1\\;3)(1\\;2)(1\\;3)^{-1} = (2\\;3)$.\n\nIn $D_{50}$, the rotations $\\langle r \\rangle$ form a subgroup of order $50$ and index $\\frac{100}{50} = 2$, so they are normal. The subgroup $\\langle s \\rangle = \\{e, s\\}$ is not: $rsr^{-1} = r^2s$, which is neither $e$ nor $s$.\n\nCheck: $srs^{-1} = r^{-1} = r^{49}$ lies in $\\langle r \\rangle$, as normality requires.\n\n> **Watch out.** Normal does not mean that every element commutes with the subgroup's elements: $sr = r^{-1}s \\ne rs$, yet $\\langle r \\rangle$ is normal. What must hold is that each conjugate $ghg^{-1}$ lands back in the subgroup.",
        "如果一个子群的每个共轭都等于它自己，它就是正规子群；指数为 2 的子群和同态的核总是正规的。$A_n \\trianglelefteq S_n$，因为它的指数为 $2$；$SL(2, \\mathbb{R}) \\trianglelefteq GL(2, \\mathbb{R})$，因为 $\\det(ASA^{-1}) = \\det S$。但 $\\langle (1\\;2) \\rangle$ 在 $S_3$ 中不正规：$(1\\;3)(1\\;2)(1\\;3)^{-1} = (2\\;3)$。\n\n在 $D_{50}$ 中，旋转 $\\langle r \\rangle$ 构成阶为 $50$、指数为 $\\frac{100}{50} = 2$ 的子群，所以是正规的。子群 $\\langle s \\rangle = \\{e, s\\}$ 不是：$rsr^{-1} = r^2s$，它既不是 $e$ 也不是 $s$。\n\n检验：$srs^{-1} = r^{-1} = r^{49}$ 属于 $\\langle r \\rangle$，符合正规性的要求。\n\n> **注意。** 正规并不意味着每个元素都与子群的元素可交换：$sr = r^{-1}s \\ne rs$，但 $\\langle r \\rangle$ 仍是正规的。必须成立的是每个共轭 $ghg^{-1}$ 都落回子群中。",
      ),
      generate(rng) {
        const n = rng.int(3, 12);
        const k = rng.int(2, 9);
        const indexTwo = t(
          "A subgroup of index $2$ is always normal: its left and right cosets are both the subgroup and its complement.",
          "指数为 $2$ 的子群总是正规的：它的左陪集和右陪集都是该子群本身与其补集。",
        );
        const decisions: Decision[] = [
          {
            prompt: t(`Is $A_{${n}}$ normal in $S_{${n}}$?`, `$A_{${n}}$ 在 $S_{${n}}$ 中正规吗？`),
            holds: true,
            steps: [
              [
                ["Find the index", "求指数"],
                t(
                  `$A_{${n}}$ holds the even permutations, half of the $${n}!$ elements, so its index is $2$.`,
                  `$A_{${n}}$ 由偶置换组成，占 $${n}!$ 个元素的一半，所以指数为 $2$。`,
                ),
              ],
              [["Use the index", "利用指数"], indexTwo],
            ],
            check: t(
              "Conjugation keeps the parity of a permutation, so a conjugate of an even permutation is even.",
              "共轭不改变置换的奇偶性，所以偶置换的共轭仍是偶置换。",
            ),
            wrong: t(
              "$A_n$ has index $2$ in $S_n$, and a subgroup of index $2$ is normal.",
              "$A_n$ 在 $S_n$ 中的指数为 $2$，而指数为 $2$ 的子群是正规的。",
            ),
          },
          {
            prompt: t(`Is $\\langle (1\\;2) \\rangle$ normal in $S_{${n}}$?`, `$\\langle (1\\;2) \\rangle$ 在 $S_{${n}}$ 中正规吗？`),
            holds: false,
            steps: [
              [
                ["Conjugate the generator", "共轭生成元"],
                t(
                  "Relabelling $1$ as $3$ gives $(1\\;3)(1\\;2)(1\\;3)^{-1} = (3\\;2) = (2\\;3)$.",
                  "把 $1$ 重新标记为 $3$，得 $(1\\;3)(1\\;2)(1\\;3)^{-1} = (3\\;2) = (2\\;3)$。",
                ),
              ],
              [
                ["Compare with the subgroup", "与子群比较"],
                t(
                  "$\\langle (1\\;2) \\rangle = \\{e, (1\\;2)\\}$ does not contain $(2\\;3)$, so it is not normal.",
                  "$\\langle (1\\;2) \\rangle = \\{e, (1\\;2)\\}$ 不含 $(2\\;3)$，所以不正规。",
                ),
              ],
            ],
            check: t(
              "$(1\\;3)H = \\{(1\\;3), (1\\;2\\;3)\\}$ but $H(1\\;3) = \\{(1\\;3), (1\\;3\\;2)\\}$: the left and right cosets differ.",
              "$(1\\;3)H = \\{(1\\;3), (1\\;2\\;3)\\}$，而 $H(1\\;3) = \\{(1\\;3), (1\\;3\\;2)\\}$：左陪集与右陪集不同。",
            ),
            wrong: t(
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
            steps: [
              [
                ["Find the index", "求指数"],
                t(
                  `$|D_{${n}}| = ${2 * n}$ and $|\\langle r \\rangle| = ${n}$, so the index is $\\frac{${2 * n}}{${n}} = 2$.`,
                  `$|D_{${n}}| = ${2 * n}$，$|\\langle r \\rangle| = ${n}$，所以指数为 $\\frac{${2 * n}}{${n}} = 2$。`,
                ),
              ],
              [["Use the index", "利用指数"], indexTwo],
            ],
            check: t(`$srs^{-1} = r^{-1} = r^{${n - 1}}$ is again a rotation.`, `$srs^{-1} = r^{-1} = r^{${n - 1}}$ 仍是旋转。`),
            wrong: t(
              "The rotations have index $2$ in $D_n$, so they form a normal subgroup.",
              "旋转在 $D_n$ 中的指数为 $2$，所以构成正规子群。",
            ),
          },
          {
            prompt: t(
              `Is $\\langle s \\rangle$, generated by a reflection, normal in $D_{${n}}$?`,
              `由一个反射生成的 $\\langle s \\rangle$ 在 $D_{${n}}$ 中正规吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Conjugate the reflection", "共轭反射"],
                t("$sr^{-1} = rs$, so $rsr^{-1} = r(rs) = r^2s$.", "$sr^{-1} = rs$，所以 $rsr^{-1} = r(rs) = r^2s$。"),
              ],
              [
                ["Compare with the subgroup", "与子群比较"],
                t(
                  `$r^2 \\ne e$ in $D_{${n}}$, so $r^2s \\ne s$, and $r^2s \\notin \\{e, s\\}$: the subgroup is not normal.`,
                  `在 $D_{${n}}$ 中 $r^2 \\ne e$，所以 $r^2s \\ne s$，$r^2s \\notin \\{e, s\\}$：该子群不正规。`,
                ),
              ],
            ],
            check: t(
              `$r\\langle s \\rangle = \\{r, rs\\}$ but $\\langle s \\rangle r = \\{r, sr\\} = \\{r, r^{${n - 1}}s\\}$, and $rs \\ne r^{${n - 1}}s$.`,
              `$r\\langle s \\rangle = \\{r, rs\\}$，而 $\\langle s \\rangle r = \\{r, sr\\} = \\{r, r^{${n - 1}}s\\}$，且 $rs \\ne r^{${n - 1}}s$。`,
            ),
            wrong: t("$rsr^{-1} = r^2s$ is not in $\\{e, s\\}$.", "$rsr^{-1} = r^2s$ 不在 $\\{e, s\\}$ 中。"),
          },
          {
            prompt: t(
              `Is $\\langle ${k} \\rangle$ normal in $\\mathbb{Z}_{${n + k}}$?`,
              `$\\langle ${k} \\rangle$ 在 $\\mathbb{Z}_{${n + k}}$ 中正规吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Note the group is abelian", "注意群是阿贝尔群"],
                t(`Addition in $\\mathbb{Z}_{${n + k}}$ is commutative.`, `$\\mathbb{Z}_{${n + k}}$ 中的加法可交换。`),
              ],
              [
                ["Conjugate", "共轭"],
                t(
                  `For any $a$ and $h$, $a + h - a = h$, so every conjugate of $\\langle ${k} \\rangle$ is itself: it is normal.`,
                  `对任意 $a$ 与 $h$，$a + h - a = h$，所以 $\\langle ${k} \\rangle$ 的每个共轭都是它自己：它是正规的。`,
                ),
              ],
            ],
            check: t(
              `$a + \\langle ${k} \\rangle = \\langle ${k} \\rangle + a$ for every $a$, since addition commutes.`,
              `对每个 $a$ 都有 $a + \\langle ${k} \\rangle = \\langle ${k} \\rangle + a$，因为加法可交换。`,
            ),
            wrong: t("Every subgroup of an abelian group is normal.", "阿贝尔群的每个子群都正规。"),
          },
          {
            prompt: t("Is $SL(2, \\mathbb{R})$ normal in $GL(2, \\mathbb{R})$?", "$SL(2, \\mathbb{R})$ 在 $GL(2, \\mathbb{R})$ 中正规吗？"),
            holds: true,
            steps: [
              [
                ["Take determinants", "取行列式"],
                t(
                  "For $S \\in SL(2, \\mathbb{R})$, $\\det(ASA^{-1}) = \\det A \\det S (\\det A)^{-1} = \\det S$.",
                  "对 $S \\in SL(2, \\mathbb{R})$，$\\det(ASA^{-1}) = \\det A \\det S (\\det A)^{-1} = \\det S$。",
                ),
              ],
              [
                ["Conclude", "得出结论"],
                t(
                  "$\\det S = 1$, so $ASA^{-1} \\in SL(2, \\mathbb{R})$: the subgroup is normal.",
                  "$\\det S = 1$，所以 $ASA^{-1} \\in SL(2, \\mathbb{R})$：该子群正规。",
                ),
              ],
            ],
            check: t(
              "$SL(2, \\mathbb{R})$ is the kernel of the homomorphism $\\det$, and kernels are normal.",
              "$SL(2, \\mathbb{R})$ 是同态 $\\det$ 的核，而核都是正规的。",
            ),
            wrong: t(
              "$\\det(ASA^{-1}) = \\det S = 1$, so every conjugate stays in $SL(2, \\mathbb{R})$.",
              "$\\det(ASA^{-1}) = \\det S = 1$，所以每个共轭都留在 $SL(2, \\mathbb{R})$ 中。",
            ),
          },
          {
            prompt: t(
              `Is the subgroup of upper triangular matrices $\\begin{pmatrix} a & b \\\\ 0 & d \\end{pmatrix}$ normal in $GL(2, \\mathbb{R})$?`,
              `上三角矩阵 $\\begin{pmatrix} a & b \\\\ 0 & d \\end{pmatrix}$ 构成的子群在 $GL(2, \\mathbb{R})$ 中正规吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Conjugate one element", "共轭一个元素"],
                t(
                  `With $P = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} = P^{-1}$, $P\\begin{pmatrix} 1 & ${k} \\\\ 0 & 1 \\end{pmatrix}P^{-1} = \\begin{pmatrix} 1 & 0 \\\\ ${k} & 1 \\end{pmatrix}$.`,
                  `取 $P = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} = P^{-1}$，则 $P\\begin{pmatrix} 1 & ${k} \\\\ 0 & 1 \\end{pmatrix}P^{-1} = \\begin{pmatrix} 1 & 0 \\\\ ${k} & 1 \\end{pmatrix}$。`,
                ),
              ],
              [
                ["Compare with the subgroup", "与子群比较"],
                t(
                  `The result has the entry $${k}$ below the diagonal, so it is not upper triangular: the subgroup is not normal.`,
                  `结果在对角线下方有元素 $${k}$，不是上三角矩阵：该子群不正规。`,
                ),
              ],
            ],
            check: t(
              `$P\\begin{pmatrix} 1 & ${k} \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 0 & 1 \\\\ 1 & ${k} \\end{pmatrix}$, and multiplying on the right by $P$ swaps the columns to give $\\begin{pmatrix} 1 & 0 \\\\ ${k} & 1 \\end{pmatrix}$.`,
              `$P\\begin{pmatrix} 1 & ${k} \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 0 & 1 \\\\ 1 & ${k} \\end{pmatrix}$，再右乘 $P$ 交换两列，得 $\\begin{pmatrix} 1 & 0 \\\\ ${k} & 1 \\end{pmatrix}$。`,
            ),
            wrong: t(
              "A conjugate of an upper triangular matrix can have a nonzero entry below the diagonal.",
              "上三角矩阵的共轭可能在对角线下方有非零元素。",
            ),
          },
          {
            prompt: t(
              `Is the subgroup $\\{${k}^m I : m \\in \\mathbb{Z}\\}$ of scalar matrices normal in $GL(2, \\mathbb{R})$?`,
              `数量矩阵子群 $\\{${k}^m I : m \\in \\mathbb{Z}\\}$ 在 $GL(2, \\mathbb{R})$ 中正规吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Note that scalars commute", "注意数量矩阵可交换"],
                t("For any scalar $c$ and matrix $A$, $A(cI) = cA = (cI)A$.", "对任意数 $c$ 与矩阵 $A$，$A(cI) = cA = (cI)A$。"),
              ],
              [
                ["Conjugate", "共轭"],
                t(
                  `So $A(${k}^m I)A^{-1} = ${k}^m AA^{-1} = ${k}^m I$: every conjugate is itself, and the subgroup is normal.`,
                  `所以 $A(${k}^m I)A^{-1} = ${k}^m AA^{-1} = ${k}^m I$：每个共轭都是它自己，该子群正规。`,
                ),
              ],
            ],
            check: t(
              `For example, $A(${k}I)A^{-1} = ${k}I$ for every invertible $A$.`,
              `例如对每个可逆矩阵 $A$ 都有 $A(${k}I)A^{-1} = ${k}I$。`,
            ),
            wrong: t(
              "Scalar matrices commute with every matrix, so $A(cI)A^{-1} = cI$.",
              "数量矩阵与每个矩阵可交换，所以 $A(cI)A^{-1} = cI$。",
            ),
          },
        ];
        return decide(rng.pick(decisions));
      },
    },
    {
      id: "conjugating-permutations",
      title: t("Conjugating permutations", "共轭置换"),
      explanation: t(
        "Conjugating a permutation relabels its points, so apply the conjugating permutation to every entry in the cycles. To find $\\sigma\\tau\\sigma^{-1}$, apply $\\sigma$ to each point in the cycles of $\\tau$. With $\\sigma = (1\\;2\\;4)$ and $\\tau = (1\\;3)(2\\;5)$: $\\sigma\\tau\\sigma^{-1} = (\\sigma(1)\\;\\sigma(3))(\\sigma(2)\\;\\sigma(5)) = (2\\;3)(4\\;5)$.\n\nIn $S_8$, with $\\sigma = (1\\;5\\;8)$ and $\\tau = (1\\;2\\;3)(4\\;5\\;6\\;7\\;8)$: $\\sigma$ sends $1 \\to 5$, $5 \\to 8$, $8 \\to 1$ and fixes the rest, so $\\sigma\\tau\\sigma^{-1} = (5\\;2\\;3)(4\\;8\\;6\\;7\\;1) = (1\\;4\\;8\\;6\\;7)(2\\;3\\;5)$.\n\nCheck: $\\sigma\\tau\\sigma^{-1}$ sends $\\sigma(1) = 5$ to $\\sigma(\\tau(1)) = \\sigma(2) = 2$, and in $(2\\;3\\;5)$, $5 \\to 2$. The cycle lengths $3$ and $5$ are kept.\n\n> **Watch out.** Relabel by $\\sigma$, not by $\\sigma^{-1}$: $\\sigma^{-1}\\tau\\sigma = (1\\;6\\;7\\;5\\;4)(2\\;3\\;8)$ is a different permutation. And a conjugate always has the same cycle lengths as $\\tau$; the product $\\sigma\\tau$ usually does not.",
        "共轭一个置换相当于给它的点重新命名，所以把共轭用的置换作用到轮换中的每一项上。求 $\\sigma\\tau\\sigma^{-1}$ 时，对 $\\tau$ 的轮换中每个点作用 $\\sigma$。设 $\\sigma = (1\\;2\\;4)$，$\\tau = (1\\;3)(2\\;5)$：$\\sigma\\tau\\sigma^{-1} = (\\sigma(1)\\;\\sigma(3))(\\sigma(2)\\;\\sigma(5)) = (2\\;3)(4\\;5)$。\n\n在 $S_8$ 中，设 $\\sigma = (1\\;5\\;8)$，$\\tau = (1\\;2\\;3)(4\\;5\\;6\\;7\\;8)$：$\\sigma$ 把 $1 \\to 5$，$5 \\to 8$，$8 \\to 1$，其余不动，所以 $\\sigma\\tau\\sigma^{-1} = (5\\;2\\;3)(4\\;8\\;6\\;7\\;1) = (1\\;4\\;8\\;6\\;7)(2\\;3\\;5)$。\n\n检验：$\\sigma\\tau\\sigma^{-1}$ 把 $\\sigma(1) = 5$ 送到 $\\sigma(\\tau(1)) = \\sigma(2) = 2$，而在 $(2\\;3\\;5)$ 中 $5 \\to 2$。轮换长度 $3$ 与 $5$ 保持不变。\n\n> **注意。** 要用 $\\sigma$ 而不是 $\\sigma^{-1}$ 重新标记：$\\sigma^{-1}\\tau\\sigma = (1\\;6\\;7\\;5\\;4)(2\\;3\\;8)$ 是另一个置换。共轭总与 $\\tau$ 有相同的轮换长度；乘积 $\\sigma\\tau$ 通常没有。",
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
        const moved = range(0, n - 1).filter((i) => tau[i] !== i);
        const images = moved.map((i) => `\\sigma(${i + 1}) = ${(s[i] as number) + 1}`).join(", ");
        const a = moved[0] as number;
        const [sa, sta] = [(s[a] as number) + 1, (s[tau[a] as number] as number) + 1];
        return reasoned(
          texChoice(
            rng,
            t(
              `In $S_{${n}}$, let $\\sigma = ${permCycleTex(s)}$ and $\\tau = ${permCycleTex(tau)}$. Find $\\sigma\\tau\\sigma^{-1}$.`,
              `在 $S_{${n}}$ 中，设 $\\sigma = ${permCycleTex(s)}$，$\\tau = ${permCycleTex(tau)}$。求 $\\sigma\\tau\\sigma^{-1}$。`,
            ),
            permCycleTex(c),
            [permCycleTex(other), permCycleTex(tau), permCycleTex(invertPerm(c)), permCycleTex(composePerm(s, tau))],
            walked(
              [
                [["Apply sigma to the points of tau", "对 τ 的点作用 σ"], t(`$${images}$.`, `$${images}$。`)],
                [
                  ["Relabel the cycle", "重新标记轮换"],
                  t(
                    `Replace each point of $\\tau$ by its image: $\\sigma\\tau\\sigma^{-1} = ${permCycleTex(c)}$.`,
                    `把 $\\tau$ 的每个点换成它的像：$\\sigma\\tau\\sigma^{-1} = ${permCycleTex(c)}$。`,
                  ),
                ],
              ],
              t(
                `$\\sigma\\tau\\sigma^{-1}$ sends $\\sigma(${a + 1}) = ${sa}$ to $\\sigma(\\tau(${a + 1})) = ${sta}$, and $${permCycleTex(c)}$ sends $${sa}$ to $${sta}$.`,
                `$\\sigma\\tau\\sigma^{-1}$ 把 $\\sigma(${a + 1}) = ${sa}$ 送到 $\\sigma(\\tau(${a + 1})) = ${sta}$，而 $${permCycleTex(c)}$ 也把 $${sa}$ 送到 $${sta}$。`,
              ),
            ),
          ),
          [
            because(
              permCycleTex(other),
              "That is $\\sigma^{-1}\\tau\\sigma$: it relabels by $\\sigma^{-1}$ instead of $\\sigma$.",
              "那是 $\\sigma^{-1}\\tau\\sigma$：它用 $\\sigma^{-1}$ 而不是 $\\sigma$ 重新标记。",
            ),
            because(
              permCycleTex(tau),
              "That is $\\tau$ itself; conjugating by $\\sigma$ moves its points.",
              "那是 $\\tau$ 本身；用 $\\sigma$ 共轭会改变它的点。",
            ),
            because(
              permCycleTex(invertPerm(c)),
              "That is the inverse of the conjugate: its cycle runs the other way.",
              "那是共轭的逆：它的轮换方向相反。",
            ),
            because(
              permCycleTex(composePerm(s, tau)),
              "That is the product $\\sigma\\tau$, without the factor $\\sigma^{-1}$ on the right.",
              "那是乘积 $\\sigma\\tau$，少了右边的因子 $\\sigma^{-1}$。",
            ),
          ],
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
  intro: t(
    "In $\\mathbb{Z}_{12}$, the subgroup $\\langle 4 \\rangle = \\{0, 4, 8\\}$ lies inside $\\langle 2 \\rangle = \\{0, 2, 4, 6, 8, 10\\}$, which is a proper subgroup, so $\\langle 4 \\rangle$ is not maximal. But nothing lies strictly between $\\langle 2 \\rangle$ and $\\mathbb{Z}_{12}$, because its index $2$ is prime.\n\nCheck: the subgroups of $\\mathbb{Z}_{12}$ containing $\\langle 2 \\rangle$ are $\\langle d \\rangle$ for the divisors $d$ of $2$, namely $\\langle 2 \\rangle$ and $\\langle 1 \\rangle = \\mathbb{Z}_{12}$.\n\nIn this lesson we count and recognize the maximal normal subgroups of $\\mathbb{Z}_n$.",
    "在 $\\mathbb{Z}_{12}$ 中，子群 $\\langle 4 \\rangle = \\{0, 4, 8\\}$ 包含在真子群 $\\langle 2 \\rangle = \\{0, 2, 4, 6, 8, 10\\}$ 中，所以 $\\langle 4 \\rangle$ 不是极大的。而 $\\langle 2 \\rangle$ 与 $\\mathbb{Z}_{12}$ 之间严格地没有别的子群，因为它的指数 $2$ 是素数。\n\n检验：$\\mathbb{Z}_{12}$ 中包含 $\\langle 2 \\rangle$ 的子群是 $\\langle d \\rangle$，$d$ 取遍 $2$ 的因数，即 $\\langle 2 \\rangle$ 与 $\\langle 1 \\rangle = \\mathbb{Z}_{12}$。\n\n本课我们数出并识别 $\\mathbb{Z}_n$ 的极大正规子群。",
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
        "Subgroups of a cyclic group match the divisors of its order, and the maximal ones come from dividing by a single prime. $\\mathbb{Z}_{60}$ has one maximal subgroup for each prime factor of $60 = 2^2 \\cdot 3 \\cdot 5$: $\\langle 2 \\rangle$, $\\langle 3 \\rangle$ and $\\langle 5 \\rangle$.\n\nFor $\\mathbb{Z}_{720}$, factor $720 = 2^4 \\cdot 3^2 \\cdot 5$. The distinct primes are $2$, $3$ and $5$, so there are $3$ maximal subgroups: $\\langle 2 \\rangle$, $\\langle 3 \\rangle$ and $\\langle 5 \\rangle$, of indices $2$, $3$ and $5$.\n\nCheck: any other proper subgroup $\\langle d \\rangle$ has $d$ with a prime factor $p < d$, and then $\\langle d \\rangle \\subsetneq \\langle p \\rangle$; for example $\\langle 6 \\rangle \\subsetneq \\langle 2 \\rangle$.\n\n> **Watch out.** Count the distinct primes, not the primes with multiplicity: $4 + 2 + 1 = 7$ is wrong. And do not count every proper nontrivial subgroup: $720$ has $30$ divisors, but only $3$ of them give maximal subgroups.",
        "循环群的子群与它的阶的因数一一对应，极大子群来自于除以单个素数。$\\mathbb{Z}_{60}$ 对 $60 = 2^2 \\cdot 3 \\cdot 5$ 的每个素因子各有一个极大子群：$\\langle 2 \\rangle$、$\\langle 3 \\rangle$ 与 $\\langle 5 \\rangle$。\n\n对 $\\mathbb{Z}_{720}$，分解 $720 = 2^4 \\cdot 3^2 \\cdot 5$。不同的素数为 $2$、$3$、$5$，所以共有 $3$ 个极大子群：$\\langle 2 \\rangle$、$\\langle 3 \\rangle$、$\\langle 5 \\rangle$，指数分别为 $2$、$3$、$5$。\n\n检验：其他任一真子群 $\\langle d \\rangle$ 的 $d$ 有素因子 $p < d$，于是 $\\langle d \\rangle \\subsetneq \\langle p \\rangle$；例如 $\\langle 6 \\rangle \\subsetneq \\langle 2 \\rangle$。\n\n> **注意。** 要数不同的素数，而不是按重数计的素因子：$4 + 2 + 1 = 7$ 是错的。也不要把每个非平凡真子群都算上：$720$ 有 $30$ 个因数，但只有 $3$ 个给出极大子群。",
      ),
      generate(rng) {
        let n: number;
        let f: [number, number][];
        do {
          n = rng.int(6, 400);
          f = factorize(n);
        } while (f.length === 1 && f[0]![1] === 1);
        const value = f.length;
        const product = f.map(([p, e]) => (e === 1 ? p : `${p}^{${e}}`)).join(" \\cdot ");
        const primes = f.map(([p]) => p);
        return numberProblem({
          prompt: t(`How many maximal normal subgroups does $${zTex(n)}$ have?`, `$${zTex(n)}$ 有多少个极大正规子群？`),
          answer: value,
          mistakes: apart(value, [
            why(
              divisors(n).length - 2,
              "That counts every proper nontrivial subgroup; only those of prime index are maximal.",
              "那是把每个非平凡真子群都算上了；只有指数为素数的才是极大的。",
            ),
            why(
              f.reduce((s, [, e]) => s + e, 0),
              "That counts the prime factors with multiplicity; each distinct prime gives one maximal subgroup.",
              "那是按重数数素因子；每个不同的素数只给出一个极大子群。",
            ),
            why(
              divisors(n).length - 1,
              "That counts every proper subgroup, including the trivial one.",
              "那是把每个真子群都算上了，包括平凡子群。",
            ),
          ]),
          solution: walked(
            [
              [["Factor the order", "分解阶"], t(`$${n} = ${product}$.`, `$${n} = ${product}$。`)],
              [
                ["Take one subgroup per prime", "每个素数取一个子群"],
                t(
                  `The distinct primes are $${primes.join(", ")}$, giving the maximal subgroups $${primes.map((p) => `\\langle ${p} \\rangle`).join(", ")}$: $${value}$ of them.`,
                  `不同的素数为 $${primes.join(", ")}$，给出极大子群 $${primes.map((p) => `\\langle ${p} \\rangle`).join(", ")}$：共 $${value}$ 个。`,
                ),
              ],
            ],
            t(
              `Each $\\langle p \\rangle$ has prime index $p$, so nothing lies strictly between it and $${zTex(n)}$.`,
              `每个 $\\langle p \\rangle$ 的指数是素数 $p$，所以它与 $${zTex(n)}$ 之间严格地没有别的子群。`,
            ),
          ),
        });
      },
    },
    {
      id: "recognizing-maximal-subgroups-of-zn",
      title: t("Recognizing maximal subgroups", "识别极大子群"),
      explanation: t(
        "$\\langle a \\rangle$ has index $\\gcd(a, n)$ in $\\mathbb{Z}_n$. In $\\mathbb{Z}_{36}$, $\\langle 15 \\rangle = \\langle 3 \\rangle$ has index $3$, a prime, so it is maximal; $\\langle 6 \\rangle$ has index $6$ and lies inside $\\langle 2 \\rangle$.\n\nIn $\\mathbb{Z}_{1000}$, $\\gcd(998, 1000) = 2$, so $\\langle 998 \\rangle = \\langle 2 \\rangle$ has prime index and is maximal. But $\\gcd(350, 1000) = 50$, so $\\langle 350 \\rangle = \\langle 50 \\rangle$ lies strictly inside $\\langle 2 \\rangle$ and is not maximal.\n\nCheck: $\\langle 50 \\rangle$ has $\\frac{1000}{50} = 20$ elements and $\\langle 2 \\rangle$ has $500$, and every multiple of $50$ is even.\n\n> **Watch out.** Test $\\gcd(a, n)$, not $a$: $998$ is not prime, yet $\\langle 998 \\rangle$ is maximal, while $\\langle 7 \\rangle$ in $\\mathbb{Z}_{1000}$ is all of $\\mathbb{Z}_{1000}$ and so not a maximal subgroup.",
        "$\\langle a \\rangle$ 在 $\\mathbb{Z}_n$ 中的指数为 $\\gcd(a, n)$。在 $\\mathbb{Z}_{36}$ 中，$\\langle 15 \\rangle = \\langle 3 \\rangle$ 的指数为素数 $3$，所以是极大子群；$\\langle 6 \\rangle$ 的指数为 $6$，它包含在 $\\langle 2 \\rangle$ 中。\n\n在 $\\mathbb{Z}_{1000}$ 中，$\\gcd(998, 1000) = 2$，所以 $\\langle 998 \\rangle = \\langle 2 \\rangle$ 的指数为素数，是极大子群。而 $\\gcd(350, 1000) = 50$，所以 $\\langle 350 \\rangle = \\langle 50 \\rangle$ 严格包含在 $\\langle 2 \\rangle$ 中，不是极大的。\n\n检验：$\\langle 50 \\rangle$ 有 $\\frac{1000}{50} = 20$ 个元素，$\\langle 2 \\rangle$ 有 $500$ 个，且 $50$ 的每个倍数都是偶数。\n\n> **注意。** 要检验 $\\gcd(a, n)$，而不是 $a$：$998$ 不是素数，但 $\\langle 998 \\rangle$ 是极大子群；而 $\\mathbb{Z}_{1000}$ 中的 $\\langle 7 \\rangle$ 就是整个 $\\mathbb{Z}_{1000}$，所以不是极大子群。",
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
        const same = a === d ? `\\langle ${a} \\rangle` : `\\langle ${a} \\rangle = \\langle ${d} \\rangle`;
        return decide({
          prompt: t(
            `Is $\\langle ${a} \\rangle$ a maximal normal subgroup of $${zTex(n)}$?`,
            `$\\langle ${a} \\rangle$ 是 $${zTex(n)}$ 的极大正规子群吗？`,
          ),
          holds: prime,
          steps: [
            [
              ["Find the index", "求指数"],
              t(
                `$\\gcd(${a}, ${n}) = ${d}$, so $${same}$ has index $${d}$.`,
                `$\\gcd(${a}, ${n}) = ${d}$，所以 $${same}$ 的指数为 $${d}$。`,
              ),
            ],
            [
              ["Test the index", "检验指数"],
              prime
                ? t(`$${d}$ is prime, so the subgroup is maximal.`, `$${d}$ 是素数，所以该子群是极大的。`)
                : t(
                    `$${d} = ${p} \\cdot ${d / p}$ is not prime, so $\\langle ${d} \\rangle \\subsetneq \\langle ${p} \\rangle \\subsetneq ${zTex(n)}$: not maximal.`,
                    `$${d} = ${p} \\cdot ${d / p}$ 不是素数，所以 $\\langle ${d} \\rangle \\subsetneq \\langle ${p} \\rangle \\subsetneq ${zTex(n)}$：不是极大的。`,
                  ),
            ],
          ],
          check: prime
            ? t(
                `The subgroups containing $\\langle ${d} \\rangle$ are $\\langle m \\rangle$ for the divisors $m$ of $${d}$, which are only $\\langle ${d} \\rangle$ and $\\langle 1 \\rangle = ${zTex(n)}$.`,
                `包含 $\\langle ${d} \\rangle$ 的子群是 $\\langle m \\rangle$，$m$ 取遍 $${d}$ 的因数，只有 $\\langle ${d} \\rangle$ 与 $\\langle 1 \\rangle = ${zTex(n)}$。`,
              )
            : t(
                `$\\langle ${d} \\rangle$ has $${n / d}$ elements and $\\langle ${p} \\rangle$ has $${n / p}$, and every multiple of $${d}$ is a multiple of $${p}$.`,
                `$\\langle ${d} \\rangle$ 有 $${n / d}$ 个元素，$\\langle ${p} \\rangle$ 有 $${n / p}$ 个，且 $${d}$ 的每个倍数都是 $${p}$ 的倍数。`,
              ),
          wrong: prime
            ? t(`The index $${d}$ is prime, so no subgroup lies strictly in between.`, `指数 $${d}$ 是素数，所以中间严格地没有别的子群。`)
            : t(
                `$\\langle ${d} \\rangle$ lies strictly inside $\\langle ${p} \\rangle$.`,
                `$\\langle ${d} \\rangle$ 严格包含在 $\\langle ${p} \\rangle$ 中。`,
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

/** rPow writes the rotation r^j of a dihedral group, as e, r or r^{j}. */
const rPow = (j: number) => (j === 0 ? "e" : j === 1 ? "r" : `r^{${j}}`);

/** rRefl writes the reflection r^j s of a dihedral group, as s, rs or r^{j}s. */
const rRefl = (j: number) => (j === 0 ? "s" : j === 1 ? "rs" : `r^{${j}}s`);

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
  intro: t(
    "In $S_3$, take $H = \\langle (1\\;2) \\rangle = \\{e, (1\\;2)\\}$. Conjugating by $(1\\;3)$ gives $(1\\;3)(1\\;2)(1\\;3)^{-1} = (3\\;2)$, which is not in $H$, so $(1\\;3) \\notin N(H)$. Conjugating by $(1\\;2)$ gives $(1\\;2)$ back. So $N(H) = \\{e, (1\\;2)\\}$.\n\nCheck: $(2\\;3)$ and the $3$-cycles also move the set $\\{1, 2\\}$, so none of them normalizes $H$.\n\nIn this lesson we find the size of the normalizer of a small subgroup of $D_n$ or $S_n$.",
    "在 $S_3$ 中取 $H = \\langle (1\\;2) \\rangle = \\{e, (1\\;2)\\}$。用 $(1\\;3)$ 共轭得 $(1\\;3)(1\\;2)(1\\;3)^{-1} = (3\\;2)$，不在 $H$ 中，所以 $(1\\;3) \\notin N(H)$。用 $(1\\;2)$ 共轭则得回 $(1\\;2)$。所以 $N(H) = \\{e, (1\\;2)\\}$。\n\n检验：$(2\\;3)$ 与各个 $3$-轮换也都移动集合 $\\{1, 2\\}$，所以它们都不正规化 $H$。\n\n本课我们求 $D_n$ 或 $S_n$ 中小子群的正规化子的大小。",
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
        "In $D_n$, $\\langle r^k s \\rangle = \\{e, r^ks\\}$. Conjugating by $r$ gives $r^{k+2}s$, so only rotations $r^j$ with $2j \\equiv 0$ normalize it. For $n$ odd, $N(\\langle r^ks \\rangle) = \\{e, r^ks\\}$; for $n$ even it also contains $r^{n/2}$ and $r^{k + n/2}s$, giving $4$ elements. Rotation subgroups are normal, with normalizer all of $D_n$.\n\nThe figure shows $n = 6$: conjugating by $r$ turns the mirror line of $s$ to that of $r^2s$, so $r$ does not normalize $\\langle s \\rangle$, but the half turn $r^3$ brings the line back onto itself. So $N(\\langle s \\rangle) = \\{e, r^3, s, r^3s\\}$ in $D_6$.\n\nIn $D_{100}$, take $\\langle r^7s \\rangle$. Since $100$ is even, $N(\\langle r^7s \\rangle) = \\{e, r^{50}, r^7s, r^{57}s\\}$, with $4$ elements, out of $200$.\n\nCheck: $r^{50}(r^7s)r^{-50} = r^{7 + 100}s = r^7s$, so the half turn does normalize it.\n\n> **Watch out.** The answer does not grow with $n$: a reflection subgroup has a normalizer of $2$ or $4$ elements, depending only on whether $n$ is odd or even. Only a rotation subgroup, which is normal, has all $2n$ elements.",
        "在 $D_n$ 中，$\\langle r^k s \\rangle = \\{e, r^ks\\}$。用 $r$ 共轭得 $r^{k+2}s$，所以只有满足 $2j \\equiv 0$ 的旋转 $r^j$ 正规化它。$n$ 为奇数时，$N(\\langle r^ks \\rangle) = \\{e, r^ks\\}$；$n$ 为偶数时还含 $r^{n/2}$ 与 $r^{k + n/2}s$，共 $4$ 个元素。旋转子群是正规的，正规化子为整个 $D_n$。\n\n图中 $n = 6$：用 $r$ 共轭把 $s$ 的镜像线转到 $r^2s$ 的镜像线，所以 $r$ 不正规化 $\\langle s \\rangle$；而半周旋转 $r^3$ 把这条线转回自身。所以在 $D_6$ 中 $N(\\langle s \\rangle) = \\{e, r^3, s, r^3s\\}$。\n\n在 $D_{100}$ 中取 $\\langle r^7s \\rangle$。由于 $100$ 是偶数，$N(\\langle r^7s \\rangle) = \\{e, r^{50}, r^7s, r^{57}s\\}$，在 $200$ 个元素中只有 $4$ 个。\n\n检验：$r^{50}(r^7s)r^{-50} = r^{7 + 100}s = r^7s$，所以半周旋转确实正规化它。\n\n> **注意。** 答案不随 $n$ 增大：反射子群的正规化子只有 $2$ 或 $4$ 个元素，只取决于 $n$ 是奇数还是偶数。只有旋转子群是正规的，正规化子才有全部 $2n$ 个元素。",
      ),
      generate(rng) {
        const n = rng.int(3, 30);
        const k = rng.int(0, n - 1);
        const rotation = rng.bool(0.3);
        const h = rotation ? rPow(k === 0 ? 1 : k) : rRefl(k);
        const value = rotation ? 2 * n : n % 2 === 0 ? 4 : 2;
        const normalizer = n % 2 === 0 ? `e, r^{${n / 2}}, ${h}, ${rRefl(mod(k + n / 2, n))}` : `e, ${h}`;
        const inverse = rPow(n - (k === 0 ? 1 : k));
        const shifted = k === 0 ? "r^{2j}s" : `r^{${k} + 2j}s`;
        const back = k === 0 ? "r^{2m}s" : `r^{2m - ${k}}s`;
        const steps: Step[] = rotation
          ? [
              [
                ["Conjugate by rotations", "用旋转共轭"],
                t(`Rotations commute with each other, so $r^j${h}r^{-j} = ${h}$.`, `旋转彼此可交换，所以 $r^j${h}r^{-j} = ${h}$。`),
              ],
              [
                ["Conjugate by reflections", "用反射共轭"],
                t(
                  `A reflection turns a rotation into its inverse: $s${h}s^{-1} = ${inverse} \\in \\langle ${h} \\rangle$. So the subgroup is normal and its normalizer is all of $D_{${n}}$, with $${value}$ elements.`,
                  `反射把旋转变成它的逆：$s${h}s^{-1} = ${inverse} \\in \\langle ${h} \\rangle$。所以该子群正规，正规化子是整个 $D_{${n}}$，有 $${value}$ 个元素。`,
                ),
              ],
            ]
          : [
              [
                ["Test the rotations", "检验旋转"],
                t(
                  `$r^j(${h})r^{-j} = ${shifted}$, which equals $${h}$ only when $2j \\equiv 0 \\pmod{${n}}$: ${n % 2 === 0 ? `$j = 0$ or $j = ${n / 2}$` : "only $j = 0$"}.`,
                  `$r^j(${h})r^{-j} = ${shifted}$，仅当 $2j \\equiv 0 \\pmod{${n}}$ 时等于 $${h}$：${n % 2 === 0 ? `$j = 0$ 或 $j = ${n / 2}$` : "只有 $j = 0$"}。`,
                ),
              ],
              [
                ["Test the reflections", "检验反射"],
                t(
                  `$(r^ms)(${h})(r^ms)^{-1} = ${back}$, which equals $${h}$ only when $2m \\equiv ${mod(2 * k, n)} \\pmod{${n}}$: ${n % 2 === 0 ? `$${h}$ and $${rRefl(mod(k + n / 2, n))}$` : `only $${h}$`}. So the normalizer is $\\{${normalizer}\\}$, with $${value}$ elements.`,
                  `$(r^ms)(${h})(r^ms)^{-1} = ${back}$，仅当 $2m \\equiv ${mod(2 * k, n)} \\pmod{${n}}$ 时等于 $${h}$：${n % 2 === 0 ? `$${h}$ 与 $${rRefl(mod(k + n / 2, n))}$` : `只有 $${h}$`}。所以正规化子为 $\\{${normalizer}\\}$，有 $${value}$ 个元素。`,
                ),
              ],
            ];
        return numberProblem({
          prompt: t(
            `In the dihedral group $D_{${n}}$ of order $${2 * n}$, how many elements does the normalizer of $\\langle ${h} \\rangle$ have?`,
            `在 $${2 * n}$ 阶二面体群 $D_{${n}}$ 中，$\\langle ${h} \\rangle$ 的正规化子有多少个元素？`,
          ),
          answer: value,
          mistakes: apart(
            value,
            rotation
              ? [
                  why(
                    n,
                    "That counts only the rotations; the reflections normalize a rotation subgroup too.",
                    "那只数了旋转；反射也正规化旋转子群。",
                  ),
                  why(
                    2,
                    "That counts only the identity and one element; a rotation subgroup is normal.",
                    "那只数了单位元与一个元素；旋转子群是正规的。",
                  ),
                ]
              : [
                  why(
                    n % 2 === 0 ? 2 : 4,
                    n % 2 === 0
                      ? `$${n}$ is even, so the half turn $r^{${n / 2}}$ and one more reflection also normalize the subgroup.`
                      : `$${n}$ is odd, so there is no half turn: only $e$ and $${h}$ normalize the subgroup.`,
                    n % 2 === 0
                      ? `$${n}$ 是偶数，所以半周旋转 $r^{${n / 2}}$ 与另一个反射也正规化该子群。`
                      : `$${n}$ 是奇数，没有半周旋转：只有 $e$ 与 $${h}$ 正规化该子群。`,
                  ),
                  why(n, "That counts the rotations, but most rotations move the mirror line.", "那数的是旋转，但大多数旋转会移动镜像线。"),
                  why(2 * n, "That is the whole group; a reflection subgroup is not normal.", "那是整个群；反射子群不是正规的。"),
                ],
          ),
          solution: walked(
            steps,
            rotation
              ? t(
                  `$|D_{${n}}| = 2 \\cdot ${n} = ${2 * n}$, the normalizer of a normal subgroup.`,
                  `$|D_{${n}}| = 2 \\cdot ${n} = ${2 * n}$，正是正规子群的正规化子的大小。`,
                )
              : t(
                  `$${value}$ divides $${2 * n}$, as the order of a subgroup must, and the normalizer contains $\\langle ${h} \\rangle$ itself.`,
                  `$${value}$ 整除 $${2 * n}$，符合子群阶的要求，且正规化子包含 $\\langle ${h} \\rangle$ 本身。`,
                ),
          ),
        });
      },
    },
    {
      id: "normalizers-in-symmetric-groups",
      title: t("Normalizers in $S_n$", "$S_n$ 中的正规化子"),
      explanation: t(
        "$\\sigma$ normalizes $\\langle (a\\;b) \\rangle$ exactly when $\\sigma$ maps $\\{a, b\\}$ to itself: $2 \\cdot (n - 2)!$ permutations. It normalizes $\\langle (a\\;b\\;c) \\rangle$ exactly when it maps $\\{a, b, c\\}$ to itself, since both $(a\\;b\\;c)$ and its inverse lie in the subgroup: $6 \\cdot (n - 3)!$ permutations.\n\nIn $S_{10}$, the normalizer of $\\langle (2\\;5\\;7) \\rangle$ has $3! \\cdot 7! = 6 \\cdot 5040 = 30240$ elements: any arrangement of $\\{2, 5, 7\\}$ times any arrangement of the other $7$ points.\n\nCheck: $\\frac{10!}{30240} = \\frac{3628800}{30240} = 120 = \\binom{10}{3}$, the number of conjugates of the subgroup, one for each set of $3$ points.\n\n> **Watch out.** A permutation can normalize the subgroup without commuting with the cycle: $(5\\;7)$ turns $(2\\;5\\;7)$ into $(2\\;7\\;5)$, its inverse, which is still in the subgroup. So count all $3!$ arrangements of the three points, not only the $3$ powers of the cycle.",
        "$\\sigma$ 正规化 $\\langle (a\\;b) \\rangle$ 当且仅当 $\\sigma$ 把 $\\{a, b\\}$ 映到自身：共 $2 \\cdot (n - 2)!$ 个置换。它正规化 $\\langle (a\\;b\\;c) \\rangle$ 当且仅当它把 $\\{a, b, c\\}$ 映到自身，因为 $(a\\;b\\;c)$ 及其逆都在该子群中：共 $6 \\cdot (n - 3)!$ 个置换。\n\n在 $S_{10}$ 中，$\\langle (2\\;5\\;7) \\rangle$ 的正规化子有 $3! \\cdot 7! = 6 \\cdot 5040 = 30240$ 个元素：$\\{2, 5, 7\\}$ 的任一排列乘以其余 $7$ 个点的任一排列。\n\n检验：$\\frac{10!}{30240} = \\frac{3628800}{30240} = 120 = \\binom{10}{3}$，正是该子群的共轭个数，每个 $3$ 点集各一个。\n\n> **注意。** 一个置换可以正规化该子群而不与轮换可交换：$(5\\;7)$ 把 $(2\\;5\\;7)$ 变成它的逆 $(2\\;7\\;5)$，仍在子群中。所以要数三个点的全部 $3!$ 种排列，而不只是轮换的 $3$ 个幂。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const k = rng.int(2, 3);
        const c = sortedCycle(rng.sample(range(1, n), k));
        const value = factorial(k) * factorial(n - k);
        const binom = factorial(n) / value;
        return numberProblem({
          prompt: t(
            `How many elements does the normalizer of $\\langle ${cycleListTex(c)} \\rangle$ in $S_{${n}}$ have?`,
            `$\\langle ${cycleListTex(c)} \\rangle$ 在 $S_{${n}}$ 中的正规化子有多少个元素？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              k * factorial(n - k),
              "That counts only the powers of the cycle on its points; every arrangement of those points normalizes the subgroup.",
              "那只数了轮换在其点上的幂；这些点的每种排列都正规化该子群。",
            ),
            why(
              factorial(n - k),
              `That counts only the permutations fixing each of $${c.join(", ")}$; they may also be rearranged.`,
              `那只数了固定 $${c.join(", ")}$ 中每个点的置换；这些点也可以重新排列。`,
            ),
            why(factorial(n) / k, `That divides $${n}!$ by the order of the subgroup instead.`, `那是用 $${n}!$ 除以子群的阶。`),
            why(factorial(n) / 2, `That is $|A_{${n}}|$, not the normalizer.`, `那是 $|A_{${n}}|$，不是正规化子。`),
          ]),
          solution: walked(
            [
              [
                ["Describe the normalizer", "描述正规化子"],
                t(
                  `$\\sigma${cycleListTex(c)}\\sigma^{-1}$ relabels the points of the cycle by $\\sigma$, and it lies in $\\langle ${cycleListTex(c)} \\rangle$ exactly when $\\sigma$ maps $\\{${c.join(", ")}\\}$ to itself.`,
                  `$\\sigma${cycleListTex(c)}\\sigma^{-1}$ 用 $\\sigma$ 重新标记轮换的点，它属于 $\\langle ${cycleListTex(c)} \\rangle$ 当且仅当 $\\sigma$ 把 $\\{${c.join(", ")}\\}$ 映到自身。`,
                ),
              ],
              [
                ["Count", "计数"],
                t(
                  `Arrange the $${k}$ points in $${k}!$ ways and the other $${n - k}$ in $${n - k}!$ ways: $${k}! \\cdot ${n - k}! = ${value}$.`,
                  `这 $${k}$ 个点有 $${k}!$ 种排法，其余 $${n - k}$ 个点有 $${n - k}!$ 种：$${k}! \\cdot ${n - k}! = ${value}$。`,
                ),
              ],
            ],
            t(
              `$\\frac{${n}!}{${value}} = ${binom} = \\binom{${n}}{${k}}$, the number of conjugates of the subgroup, one for each set of $${k}$ points.`,
              `$\\frac{${n}!}{${value}} = ${binom} = \\binom{${n}}{${k}}$，正是该子群的共轭个数，每个 $${k}$ 点集各一个。`,
            ),
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
  intro: t(
    "In $D_4$, the symmetries of a square, the half turn $r^2$ commutes with everything: with each rotation, and with $s$ since $sr^2 = r^{-2}s = r^2s$. The quarter turn $r$ does not, since $sr = r^{-1}s = r^3s \\ne rs$. So $Z(D_4) = \\{e, r^2\\}$.\n\nCheck: a reflection $r^ks$ does not commute with $r$, since $r \\cdot r^ks = r^{k+1}s$ but $r^ks \\cdot r = r^{k-1}s$.\n\nIn this lesson we find the centers of dihedral, symmetric, matrix and product groups, and decide which elements of $D_n$ are central.",
    "在正方形的对称群 $D_4$ 中，半周旋转 $r^2$ 与每个元素都可交换：与每个旋转可交换，与 $s$ 也可交换，因为 $sr^2 = r^{-2}s = r^2s$。四分之一周旋转 $r$ 则不行，因为 $sr = r^{-1}s = r^3s \\ne rs$。所以 $Z(D_4) = \\{e, r^2\\}$。\n\n检验：反射 $r^ks$ 不与 $r$ 可交换，因为 $r \\cdot r^ks = r^{k+1}s$，而 $r^ks \\cdot r = r^{k-1}s$。\n\n本课我们求二面体群、对称群、矩阵群与直积的中心，并判断 $D_n$ 的哪些元素属于中心。",
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
        "The center of a direct product is the product of the centers, so find the center of each factor and multiply their sizes. $Z(D_6 \\times \\mathbb{Z}_5) = Z(D_6) \\times \\mathbb{Z}_5 = \\{e, r^3\\} \\times \\mathbb{Z}_5$, with $10$ elements. $Z(GL(2, \\mathbb{Z}_7))$ is the $6$ nonzero scalar matrices.\n\nFor larger groups the same rules apply. $Z(D_{40} \\times \\mathbb{Z}_{25}) = \\{e, r^{20}\\} \\times \\mathbb{Z}_{25}$ has $2 \\cdot 25 = 50$ elements, and $Z(GL(2, \\mathbb{Z}_{101}))$ has $100$ elements, the matrices $cI$ with $c \\ne 0$.\n\nCheck: $(r^{20}, a)$ commutes with every $(g, b)$, because $r^{20}$ is central in $D_{40}$ and $\\mathbb{Z}_{25}$ is abelian.\n\n> **Watch out.** An abelian factor is central in full, so it contributes all its elements, not just its identity. And the scalar matrix $0I$ is not invertible, so $GL(2, \\mathbb{Z}_p)$ has $p - 1$ central elements, not $p$.",
        "直积的中心等于各因子中心的直积，所以求出每个因子的中心，再把它们的大小相乘。$Z(D_6 \\times \\mathbb{Z}_5) = Z(D_6) \\times \\mathbb{Z}_5 = \\{e, r^3\\} \\times \\mathbb{Z}_5$，有 $10$ 个元素。$Z(GL(2, \\mathbb{Z}_7))$ 是 $6$ 个非零数量矩阵。\n\n群更大时规则相同。$Z(D_{40} \\times \\mathbb{Z}_{25}) = \\{e, r^{20}\\} \\times \\mathbb{Z}_{25}$ 有 $2 \\cdot 25 = 50$ 个元素；$Z(GL(2, \\mathbb{Z}_{101}))$ 有 $100$ 个元素，即 $c \\ne 0$ 的矩阵 $cI$。\n\n检验：$(r^{20}, a)$ 与每个 $(g, b)$ 都可交换，因为 $r^{20}$ 在 $D_{40}$ 中属于中心，而 $\\mathbb{Z}_{25}$ 是阿贝尔群。\n\n> **注意。** 阿贝尔因子整个属于中心，所以它贡献全部元素，而不只是单位元。数量矩阵 $0I$ 不可逆，所以 $GL(2, \\mathbb{Z}_p)$ 有 $p - 1$ 个中心元素，而不是 $p$ 个。",
      ),
      generate(rng) {
        const n = rng.int(3, 20);
        const k = rng.int(2, 12);
        const kind = rng.int(0, 3);
        const zd = n % 2 === 0 ? 2 : 1;
        const p = rng.pick([2, 3, 5, 7, 11, 13, 17, 19, 23]);
        const m = Math.min(n, 9);
        const zdTex = n % 2 === 0 ? `\\{e, r^{${n / 2}}\\}` : "\\{e\\}";
        const count: Text = [
          t(`$${zdTex}$ has $${zd}$ element${zd === 1 ? "" : "s"}.`, `$${zdTex}$ 有 $${zd}$ 个元素。`),
          zd === 1
            ? t(`$\\{e\\} \\times ${zTex(k)}$ has $${k}$ elements.`, `$\\{e\\} \\times ${zTex(k)}$ 有 $${k}$ 个元素。`)
            : t(
                `$|${zdTex} \\times ${zTex(k)}| = 2 \\cdot ${k} = ${2 * k}$.`,
                `$|${zdTex} \\times ${zTex(k)}| = 2 \\cdot ${k} = ${2 * k}$。`,
              ),
          t(`$\\{e\\} \\times ${zTex(k)}$ has $${k}$ elements.`, `$\\{e\\} \\times ${zTex(k)}$ 有 $${k}$ 个元素。`),
          p === 2
            ? t(
                "$c$ must be $1$, the only nonzero element of $\\mathbb{Z}_{2}$, so the center is $\\{I\\}$.",
                "$c$ 只能是 $\\mathbb{Z}_{2}$ 中唯一的非零元素 $1$，所以中心为 $\\{I\\}$。",
              )
            : t(
                `$c$ can be any of the $${p - 1}$ nonzero elements of $${zTex(p)}$.`,
                `$c$ 可取 $${zTex(p)}$ 中 $${p - 1}$ 个非零元素中的任一个。`,
              ),
        ][kind] as Text;
        const check: Text = [
          n % 2 === 0
            ? t(
                `$sr^{${n / 2}} = r^{-${n / 2}}s = r^{${n / 2}}s$, since $2 \\cdot ${n / 2} = ${n}$, so the half turn commutes with $s$.`,
                `$sr^{${n / 2}} = r^{-${n / 2}}s = r^{${n / 2}}s$，因为 $2 \\cdot ${n / 2} = ${n}$，所以半周旋转与 $s$ 可交换。`,
              )
            : t(
                `For $0 < j < ${n}$, $sr^j = r^{-j}s \\ne r^js$, since $2j$ is not a multiple of the odd number $${n}$.`,
                `对 $0 < j < ${n}$，$sr^j = r^{-j}s \\ne r^js$，因为 $2j$ 不是奇数 $${n}$ 的倍数。`,
              ),
          t(
            `$(z, a)$ is central exactly when $z$ is central in $D_{${n}}$, because $${zTex(k)}$ is abelian.`,
            `$(z, a)$ 属于中心当且仅当 $z$ 属于 $D_{${n}}$ 的中心，因为 $${zTex(k)}$ 是阿贝尔群。`,
          ),
          t(
            `$${zTex(k)}$ is abelian, so all of it is central, while in $S_{${m}}$, $(1\\;2)$ and $(1\\;3)$ do not commute, and no nonidentity permutation commutes with every transposition.`,
            `$${zTex(k)}$ 是阿贝尔群，整个属于中心；而在 $S_{${m}}$ 中 $(1\\;2)$ 与 $(1\\;3)$ 不可交换，也没有非恒等置换与每个对换都可交换。`,
          ),
          t(
            "$(cI)A = cA = A(cI)$ for every matrix $A$, and $c = 0$ is excluded because $0I$ is not invertible.",
            "对每个矩阵 $A$ 都有 $(cI)A = cA = A(cI)$，而 $c = 0$ 被排除，因为 $0I$ 不可逆。",
          ),
        ][kind] as Text;
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
          mistakes: apart(
            value,
            [
              [
                why(
                  3 - zd,
                  `That mixes up the cases: $${n}$ is ${n % 2 === 0 ? "even" : "odd"}.`,
                  `那是弄混了两种情况：$${n}$ 是${n % 2 === 0 ? "偶数" : "奇数"}。`,
                ),
                why(2 * n, "That is the whole group; $D_n$ is not abelian.", "那是整个群；$D_n$ 不是阿贝尔群。"),
                why(
                  n,
                  "That counts all the rotations; most rotations do not commute with $s$.",
                  "那数的是全部旋转；大多数旋转不与 $s$ 可交换。",
                ),
              ],
              [
                why(
                  zd,
                  `That leaves out $${zTex(k)}$, which is abelian and central in full.`,
                  `那漏掉了 $${zTex(k)}$，它是阿贝尔群，整个属于中心。`,
                ),
                why(
                  (3 - zd) * k,
                  `That mixes up the cases for $D_{${n}}$: $${n}$ is ${n % 2 === 0 ? "even" : "odd"}.`,
                  `那是弄混了 $D_{${n}}$ 的两种情况：$${n}$ 是${n % 2 === 0 ? "偶数" : "奇数"}。`,
                ),
                why(2 * n * k, "That is the whole group, which is not abelian.", "那是整个群，它不是阿贝尔群。"),
              ],
              [
                why(
                  1,
                  `That leaves out $${zTex(k)}$, which is abelian and central in full.`,
                  `那漏掉了 $${zTex(k)}$，它是阿贝尔群，整个属于中心。`,
                ),
                why(2 * k, `$Z(S_{${m}})$ is trivial, not of order $2$.`, `$Z(S_{${m}})$ 是平凡的，阶不是 $2$。`),
              ],
              [
                why(p, "That includes $c = 0$, but $0I$ is not invertible.", "那把 $c = 0$ 也算进去了，但 $0I$ 不可逆。"),
                why(
                  (p - 1) ** 2,
                  "That counts the invertible diagonal matrices; only the scalar ones commute with everything.",
                  "那数的是可逆对角矩阵；只有数量矩阵与所有矩阵可交换。",
                ),
                why(
                  1,
                  "The identity is not the only central matrix: every nonzero scalar matrix is central.",
                  "单位矩阵不是唯一的中心元素：每个非零数量矩阵都属于中心。",
                ),
              ],
            ][kind] as ReturnType<typeof why>[],
          ),
          solution: walked(
            [
              [["Find the center", "求中心"], how],
              [["Count its elements", "数元素"], count],
            ],
            check,
          ),
        });
      },
    },
    {
      id: "central-elements-of-dihedral-groups",
      figure: algebraDrawings2["the-center-of-a-group#central-elements-of-dihedral-groups"],
      title: t("Central elements of $D_n$", "$D_n$ 的中心元素"),
      explanation: t(
        "A rotation is central only when it equals its own inverse, which happens for the identity and for the half turn when there is one. Since $sr^k = r^{-k}s$, the rotation $r^k$ commutes with $s$ only when $r^k = r^{-k}$, that is, $2k \\equiv 0 \\pmod n$. A reflection $r^ks$ never commutes with $r$ when $n \\ge 3$.\n\nThe figure shows a hexagon, $n = 6$, following vertex $1$. Applying $r$ then $s$ takes it to $2$ then $4$, while $s$ then $r$ takes it to $5$ then $0$, so $r$ is not central. The half turn $r^3$ then $s$ gives $4$ then $2$, and $s$ then $r^3$ gives $5$ then $2$: the half turn commutes with $s$.\n\nIn $D_{90}$, the rotation $r^{45}$ is central, since $2 \\cdot 45 = 90$, but $r^{30}$ is not: $sr^{30} = r^{-30}s = r^{60}s \\ne r^{30}s$.\n\nCheck: $Z(D_{90}) = \\{e, r^{45}\\}$, because $45$ is the only $k$ with $0 < k < 90$ and $2k \\equiv 0 \\pmod{90}$.\n\n> **Watch out.** Commuting with all rotations is not enough: every rotation does that. A central element must also commute with $s$, and when $n$ is odd only $e$ does.",
        "一个旋转只有在等于自己的逆时才属于中心，这对恒等元成立，对存在的半周旋转也成立。由于 $sr^k = r^{-k}s$，旋转 $r^k$ 仅当 $r^k = r^{-k}$，即 $2k \\equiv 0 \\pmod n$ 时与 $s$ 可交换。$n \\ge 3$ 时反射 $r^ks$ 从不与 $r$ 可交换。\n\n图中是正六边形，$n = 6$，跟踪顶点 $1$。先作用 $r$ 再作用 $s$，它依次到 $2$ 和 $4$；先 $s$ 再 $r$，依次到 $5$ 和 $0$，所以 $r$ 不属于中心。半周旋转 $r^3$ 后接 $s$ 得 $4$ 然后 $2$，$s$ 后接 $r^3$ 得 $5$ 然后 $2$：半周旋转与 $s$ 可交换。\n\n在 $D_{90}$ 中，旋转 $r^{45}$ 属于中心，因为 $2 \\cdot 45 = 90$；而 $r^{30}$ 不属于：$sr^{30} = r^{-30}s = r^{60}s \\ne r^{30}s$。\n\n检验：$Z(D_{90}) = \\{e, r^{45}\\}$，因为在 $0 < k < 90$ 中只有 $k = 45$ 满足 $2k \\equiv 0 \\pmod{90}$。\n\n> **注意。** 与所有旋转可交换还不够：每个旋转都做得到。中心元素还必须与 $s$ 可交换，而 $n$ 为奇数时只有 $e$ 满足。",
      ),
      generate(rng) {
        const holds = rng.bool();
        const n = holds ? 2 * rng.int(2, 12) : rng.int(3, 24);
        const reflection = !holds && rng.bool(0.4);
        let k = holds ? n / 2 : rng.int(1, n - 1);
        while (!holds && !reflection && mod(2 * k, n) === 0) k = rng.int(1, n - 1);
        const g = reflection ? rRefl(k) : rPow(k);
        const steps: Step[] = reflection
          ? [
              [
                ["Multiply by r on the left", "在左边乘以 r"],
                t(`$r \\cdot ${g} = ${rRefl(mod(k + 1, n))}$.`, `$r \\cdot ${g} = ${rRefl(mod(k + 1, n))}$。`),
              ],
              [
                ["Multiply by r on the right", "在右边乘以 r"],
                t(
                  `$${g} \\cdot r = ${rRefl(k - 1)}$, which differs from $${rRefl(mod(k + 1, n))}$: the reflection does not commute with $r$.`,
                  `$${g} \\cdot r = ${rRefl(k - 1)}$，与 $${rRefl(mod(k + 1, n))}$ 不同：该反射不与 $r$ 可交换。`,
                ),
              ],
            ]
          : [
              [
                ["Compare with the rotations", "与旋转比较"],
                t(`$${g}$ commutes with every rotation, since rotations commute.`, `$${g}$ 与每个旋转都可交换，因为旋转彼此可交换。`),
              ],
              [
                ["Compare with s", "与 s 比较"],
                holds
                  ? t(
                      `$s${g} = r^{-${k}}s = ${g}s$, since $2 \\cdot ${k} = ${n}$: it is central.`,
                      `$s${g} = r^{-${k}}s = ${g}s$，因为 $2 \\cdot ${k} = ${n}$：它属于中心。`,
                    )
                  : t(
                      `$s${g} = r^{-${k}}s = ${rRefl(n - k)}$, which is not $${g}s$, since $${k} + ${k} = ${2 * k}$ is not a multiple of $${n}$: it is not central.`,
                      `$s${g} = r^{-${k}}s = ${rRefl(n - k)}$，不等于 $${g}s$，因为 $${k} + ${k} = ${2 * k}$ 不是 $${n}$ 的倍数：它不属于中心。`,
                    ),
              ],
            ];
        return decide({
          prompt: t(
            `Is $${g}$ in the center of the dihedral group $D_{${n}}$ of order $${2 * n}$?`,
            `$${g}$ 在 $${2 * n}$ 阶二面体群 $D_{${n}}$ 的中心中吗？`,
          ),
          holds,
          steps,
          check: reflection
            ? t(
                `The two products differ by $r^2$, and $r^2 \\ne e$ because $${n} \\ge 3$.`,
                `两个乘积相差 $r^2$，而 $r^2 \\ne e$，因为 $${n} \\ge 3$。`,
              )
            : holds
              ? t(
                  `$${g}$ commutes with the generators $r$ and $s$, so with every element of $D_{${n}}$.`,
                  `$${g}$ 与生成元 $r$、$s$ 都可交换，所以与 $D_{${n}}$ 的每个元素可交换。`,
                )
              : t(`$r^{-${k}} = ${rPow(n - k)}$, and $${n - k} \\ne ${k}$.`, `$r^{-${k}} = ${rPow(n - k)}$，而 $${n - k} \\ne ${k}$。`),
          wrong: reflection
            ? t(
                `$r \\cdot ${g} \\ne ${g} \\cdot r$, so the reflection is not central.`,
                `$r \\cdot ${g} \\ne ${g} \\cdot r$，所以该反射不属于中心。`,
              )
            : holds
              ? t(
                  `$2 \\cdot ${k} = ${n}$, so $${g}$ is its own inverse and commutes with $s$.`,
                  `$2 \\cdot ${k} = ${n}$，所以 $${g}$ 是自己的逆，与 $s$ 可交换。`,
                )
              : t(
                  `$s${g} = r^{-${k}}s \\ne ${g}s$, so $${g}$ is not central.`,
                  `$s${g} = r^{-${k}}s \\ne ${g}s$，所以 $${g}$ 不属于中心。`,
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
  intro: t(
    "In $S_3$, the centralizer of $(1\\;2\\;3)$ contains its powers $e$, $(1\\;2\\;3)$ and $(1\\;3\\;2)$. It does not contain $(1\\;2)$: conjugating relabels $1$ and $2$, so $(1\\;2)(1\\;2\\;3)(1\\;2)^{-1} = (2\\;1\\;3) = (1\\;3\\;2) \\ne (1\\;2\\;3)$. So $C((1\\;2\\;3)) = \\{e, (1\\;2\\;3), (1\\;3\\;2)\\}$.\n\nCheck: $S_3$ has two $3$-cycles, and $\\frac{6}{2} = 3$ is the size of the centralizer.\n\nIn this lesson we count the elements that commute with a given element of $D_n$ or $S_n$.",
    "在 $S_3$ 中，$(1\\;2\\;3)$ 的中心化子包含它的幂 $e$、$(1\\;2\\;3)$ 与 $(1\\;3\\;2)$。它不含 $(1\\;2)$：共轭会把 $1$ 与 $2$ 互换标记，所以 $(1\\;2)(1\\;2\\;3)(1\\;2)^{-1} = (2\\;1\\;3) = (1\\;3\\;2) \\ne (1\\;2\\;3)$。所以 $C((1\\;2\\;3)) = \\{e, (1\\;2\\;3), (1\\;3\\;2)\\}$。\n\n检验：$S_3$ 有两个 $3$-轮换，而 $\\frac{6}{2} = 3$ 正是中心化子的大小。\n\n本课我们数出与 $D_n$ 或 $S_n$ 中给定元素可交换的元素个数。",
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
        "In $D_n$, a rotation $r^k$ commutes with all rotations, and with the reflections only if $2k \\equiv 0 \\pmod n$; so $|C(r^k)|$ is $2n$ or $n$. A reflection $r^ks$ commutes with $e$, itself, and when $n$ is even with $r^{n/2}$ and $r^{k+n/2}s$.\n\nIn $D_{30}$, of order $60$: $C(r^{15}) = D_{30}$ has $60$ elements, $C(r^4) = \\langle r \\rangle$ has $30$, and $C(r^7s) = \\{e, r^{15}, r^7s, r^{22}s\\}$ has $4$.\n\nCheck: $(r^{22}s)(r^7s) = r^{22 - 7} = r^{15}$ and $(r^7s)(r^{22}s) = r^{7 - 22} = r^{-15} = r^{15}$, so $r^{22}s$ commutes with $r^7s$.\n\n> **Watch out.** The centralizer of an element is not the normalizer of the subgroup it generates. $\\langle r^4 \\rangle$ is normal, so its normalizer is all of $D_{30}$, but $r^4$ itself commutes with no reflection: $C(r^4)$ has only $30$ elements.",
        "在 $D_n$ 中，旋转 $r^k$ 与所有旋转可交换，仅当 $2k \\equiv 0 \\pmod n$ 时才与反射可交换；所以 $|C(r^k)|$ 为 $2n$ 或 $n$。反射 $r^ks$ 与 $e$、自身可交换，$n$ 为偶数时还与 $r^{n/2}$ 及 $r^{k+n/2}s$ 可交换。\n\n在 $60$ 阶的 $D_{30}$ 中：$C(r^{15}) = D_{30}$ 有 $60$ 个元素，$C(r^4) = \\langle r \\rangle$ 有 $30$ 个，$C(r^7s) = \\{e, r^{15}, r^7s, r^{22}s\\}$ 有 $4$ 个。\n\n检验：$(r^{22}s)(r^7s) = r^{22 - 7} = r^{15}$，$(r^7s)(r^{22}s) = r^{7 - 22} = r^{-15} = r^{15}$，所以 $r^{22}s$ 与 $r^7s$ 可交换。\n\n> **注意。** 元素的中心化子不是它生成的子群的正规化子。$\\langle r^4 \\rangle$ 是正规的，所以它的正规化子是整个 $D_{30}$；但 $r^4$ 本身不与任何反射可交换：$C(r^4)$ 只有 $30$ 个元素。",
      ),
      generate(rng) {
        const n = rng.int(3, 24);
        const reflection = rng.bool(0.4);
        const k = n % 2 === 0 && rng.bool(0.3) ? n / 2 : rng.int(1, n - 1);
        const value = reflection ? (n % 2 === 0 ? 4 : 2) : mod(2 * k, n) === 0 ? 2 * n : n;
        const h = reflection ? rRefl(k) : rPow(k);
        const even = n % 2 === 0;
        const members = even ? `e, r^{${n / 2}}, ${h}, ${rRefl(mod(k + n / 2, n))}` : `e, ${h}`;
        const steps: Step[] = reflection
          ? [
              [
                ["Test the rotations", "检验旋转"],
                t(
                  `$r^j(${h}) = r^{${k} + j}s$ and $(${h})r^j = r^{${k} - j}s$, equal only when $2j \\equiv 0 \\pmod{${n}}$: ${even ? `$e$ and $r^{${n / 2}}$` : "only $e$"}.`,
                  `$r^j(${h}) = r^{${k} + j}s$，$(${h})r^j = r^{${k} - j}s$，仅当 $2j \\equiv 0 \\pmod{${n}}$ 时相等：${even ? `$e$ 与 $r^{${n / 2}}$` : "只有 $e$"}。`,
                ),
              ],
              [
                ["Test the reflections", "检验反射"],
                t(
                  `$(r^ms)(${h}) = r^{m - ${k}}$ and $(${h})(r^ms) = r^{${k} - m}$, equal only when $2(m - ${k}) \\equiv 0 \\pmod{${n}}$: ${even ? `$${h}$ and $${rRefl(mod(k + n / 2, n))}$` : `only $${h}$`}. So $C(${h}) = \\{${members}\\}$, with $${value}$ elements.`,
                  `$(r^ms)(${h}) = r^{m - ${k}}$，$(${h})(r^ms) = r^{${k} - m}$，仅当 $2(m - ${k}) \\equiv 0 \\pmod{${n}}$ 时相等：${even ? `$${h}$ 与 $${rRefl(mod(k + n / 2, n))}$` : `只有 $${h}$`}。所以 $C(${h}) = \\{${members}\\}$，有 $${value}$ 个元素。`,
                ),
              ],
            ]
          : [
              [
                ["Test the rotations", "检验旋转"],
                t(
                  `Rotations commute with each other, so all $${n}$ rotations lie in $C(${h})$.`,
                  `旋转彼此可交换，所以全部 $${n}$ 个旋转都属于 $C(${h})$。`,
                ),
              ],
              [
                ["Test the reflections", "检验反射"],
                value === 2 * n
                  ? t(
                      `$(r^ms)${h} = r^{m - ${k}}s$ and $${h}(r^ms) = r^{m + ${k}}s$ agree, since $2 \\cdot ${k} = ${n}$: every reflection commutes with $${h}$, and $|C(${h})| = ${value}$.`,
                      `$(r^ms)${h} = r^{m - ${k}}s$ 与 $${h}(r^ms) = r^{m + ${k}}s$ 相等，因为 $2 \\cdot ${k} = ${n}$：每个反射都与 $${h}$ 可交换，$|C(${h})| = ${value}$。`,
                    )
                  : t(
                      `$(r^ms)${h} = r^{m - ${k}}s$ and $${h}(r^ms) = r^{m + ${k}}s$ differ, since $${k} + ${k} = ${2 * k}$ is not a multiple of $${n}$: no reflection commutes with $${h}$, and $|C(${h})| = ${value}$.`,
                      `$(r^ms)${h} = r^{m - ${k}}s$ 与 $${h}(r^ms) = r^{m + ${k}}s$ 不同，因为 $${k} + ${k} = ${2 * k}$ 不是 $${n}$ 的倍数：没有反射与 $${h}$ 可交换，$|C(${h})| = ${value}$。`,
                    ),
              ],
            ];
        return numberProblem({
          prompt: t(
            `In the dihedral group $D_{${n}}$ of order $${2 * n}$, how many elements does the centralizer of $${h}$ have?`,
            `在 $${2 * n}$ 阶二面体群 $D_{${n}}$ 中，$${h}$ 的中心化子有多少个元素？`,
          ),
          answer: value,
          mistakes: apart(
            value,
            reflection
              ? [
                  why(
                    even ? 2 : 4,
                    even
                      ? `$${n}$ is even, so the half turn and one more reflection commute with $${h}$ too.`
                      : `$${n}$ is odd, so there is no half turn to add.`,
                    even ? `$${n}$ 是偶数，所以半周旋转与另一个反射也与 $${h}$ 可交换。` : `$${n}$ 是奇数，没有半周旋转可以加入。`,
                  ),
                  why(
                    n,
                    "That counts the rotations, but most rotations do not commute with a reflection.",
                    "那数的是旋转，但大多数旋转不与反射可交换。",
                  ),
                  why(2 * n, "That is the whole group; a reflection is not central.", "那是整个群；反射不属于中心。"),
                ]
              : [
                  why(
                    value === n ? 2 * n : n,
                    value === n
                      ? `That is the whole group, but $${h}$ does not commute with the reflections, since $${2 * k}$ is not a multiple of $${n}$.`
                      : `That counts only the rotations; since $2 \\cdot ${k} = ${n}$, the reflections commute with $${h}$ too.`,
                    value === n
                      ? `那是整个群，但 $${h}$ 不与反射可交换，因为 $${2 * k}$ 不是 $${n}$ 的倍数。`
                      : `那只数了旋转；由于 $2 \\cdot ${k} = ${n}$，反射也与 $${h}$ 可交换。`,
                  ),
                  why(
                    2,
                    "That is the answer for a reflection in odd $D_n$; a rotation commutes with all rotations.",
                    "那是奇数 $n$ 时反射的答案；旋转与所有旋转都可交换。",
                  ),
                  why(
                    4,
                    "That is the answer for a reflection in even $D_n$; a rotation commutes with all rotations.",
                    "那是偶数 $n$ 时反射的答案；旋转与所有旋转都可交换。",
                  ),
                ],
          ),
          solution: walked(
            steps,
            t(
              `$${value}$ divides $|D_{${n}}| = ${2 * n}$, as the order of the subgroup $C(${h})$ must.`,
              `$${value}$ 整除 $|D_{${n}}| = ${2 * n}$，符合子群 $C(${h})$ 的阶的要求。`,
            ),
          ),
        });
      },
    },
    {
      id: "centralizers-in-symmetric-groups",
      title: t("Centralizers in $S_n$", "$S_n$ 中的中心化子"),
      explanation: t(
        "$\\sigma$ commutes with $(a\\;b)$ exactly when it maps $\\{a, b\\}$ to itself: $2 \\cdot (n - 2)!$ permutations. $\\sigma$ commutes with the $3$-cycle $(a\\;b\\;c)$ exactly when it acts on $\\{a, b, c\\}$ as a power of the cycle: $3 \\cdot (n - 3)!$ permutations. An $n$-cycle commutes only with its own $n$ powers.\n\nIn $S_9$, the centralizer of $(1\\;4\\;7)$ has $3 \\cdot 6! = 3 \\cdot 720 = 2160$ elements: a power of the cycle on $\\{1, 4, 7\\}$ times any arrangement of the other $6$ points.\n\nCheck: $S_9$ has $\\binom{9}{3} \\cdot 2 = 168$ three-cycles, all conjugate, and $\\frac{9!}{168} = \\frac{362880}{168} = 2160$.\n\n> **Watch out.** Mapping the three points to themselves is not enough: $(4\\;7)$ turns $(1\\;4\\;7)$ into $(1\\;7\\;4)$, so it normalizes $\\langle (1\\;4\\;7) \\rangle$ without commuting with $(1\\;4\\;7)$. Count $3$ choices on the cycle's points, not $3! = 6$.",
        "$\\sigma$ 与 $(a\\;b)$ 可交换当且仅当它把 $\\{a, b\\}$ 映到自身：共 $2 \\cdot (n - 2)!$ 个置换。$\\sigma$ 与 $3$-轮换 $(a\\;b\\;c)$ 可交换当且仅当它在 $\\{a, b, c\\}$ 上的作用是该轮换的幂：共 $3 \\cdot (n - 3)!$ 个置换。$n$-轮换只与它自己的 $n$ 个幂可交换。\n\n在 $S_9$ 中，$(1\\;4\\;7)$ 的中心化子有 $3 \\cdot 6! = 3 \\cdot 720 = 2160$ 个元素：在 $\\{1, 4, 7\\}$ 上取轮换的一个幂，再乘以其余 $6$ 个点的任一排列。\n\n检验：$S_9$ 有 $\\binom{9}{3} \\cdot 2 = 168$ 个 $3$-轮换，彼此共轭，而 $\\frac{9!}{168} = \\frac{362880}{168} = 2160$。\n\n> **注意。** 只把这三个点映到自身还不够：$(4\\;7)$ 把 $(1\\;4\\;7)$ 变成 $(1\\;7\\;4)$，所以它正规化 $\\langle (1\\;4\\;7) \\rangle$，却不与 $(1\\;4\\;7)$ 可交换。在轮换的点上只有 $3$ 种选择，而不是 $3! = 6$ 种。",
      ),
      generate(rng) {
        const n = rng.int(5, 8);
        const k = rng.pick([2, 3, n]);
        const c = sortedCycle(rng.sample(range(1, n), k));
        const value = k === n ? n : k * factorial(n - k);
        const cycles = factorial(n) / value;
        const full = k === n;
        return numberProblem({
          prompt: t(
            `How many elements does the centralizer of $${cycleListTex(c)}$ in $S_{${n}}$ have?`,
            `$${cycleListTex(c)}$ 在 $S_{${n}}$ 中的中心化子有多少个元素？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              factorial(k) * factorial(n - k),
              full
                ? `That is all of $S_{${n}}$; ${article(n, false)} $${n}$-cycle does not commute with every permutation.`
                : "That allows every arrangement of the cycle's points, which only normalizes the subgroup; just the powers of the cycle commute with it.",
              full
                ? `那是整个 $S_{${n}}$；$${n}$-轮换并不与每个置换可交换。`
                : "那允许轮换的点任意排列，这只正规化该子群；只有轮换的幂才与它可交换。",
            ),
            why(
              factorial(n - k),
              full
                ? "The cycle commutes at least with its own powers."
                : "That counts only the permutations fixing each point of the cycle; the powers of the cycle commute with it too.",
              full ? "该轮换至少与它自己的幂可交换。" : "那只数了固定轮换每个点的置换；轮换的幂也与它可交换。",
            ),
            why(
              k,
              `That counts only the powers of the cycle; the permutations of the other $${n - k}$ points commute with it too.`,
              `那只数了轮换的幂；其余 $${n - k}$ 个点的置换也与它可交换。`,
            ),
            why(
              factorial(n) / k,
              `That divides $${n}!$ by the length of the cycle; divide by the number of ${k === 2 ? "transpositions" : `$${k}$-cycles`} instead.`,
              `那是用 $${n}!$ 除以轮换的长度；应除以${k === 2 ? "对换" : ` $${k}$-轮换`}的个数。`,
            ),
          ]),
          solution: walked(
            full
              ? [
                  [
                    ["Relabel the cycle", "重新标记轮换"],
                    t(
                      `$\\sigma$ commutes with $${cycleListTex(c)}$ exactly when relabelling its points by $\\sigma$ gives the same cycle back, so $\\sigma$ is fixed by where it sends $${c[0]}$: $${n}$ choices.`,
                      `$\\sigma$ 与 $${cycleListTex(c)}$ 可交换当且仅当用 $\\sigma$ 重新标记它的点后得回同一个轮换，所以 $\\sigma$ 由它把 $${c[0]}$ 送到哪里决定：共 $${n}$ 种选择。`,
                    ),
                  ],
                  [
                    ["Name them", "写出它们"],
                    t(
                      `These are the $${n}$ powers of the cycle, so the centralizer has $${n}$ elements.`,
                      `这些正是该轮换的 $${n}$ 个幂，所以中心化子有 $${n}$ 个元素。`,
                    ),
                  ],
                ]
              : [
                  [
                    ["On the cycle's points", "在轮换的点上"],
                    t(
                      `$\\sigma$ must map $\\{${c.join(", ")}\\}$ to itself and act there as a power of the cycle: $${k}$ ways.`,
                      `$\\sigma$ 必须把 $\\{${c.join(", ")}\\}$ 映到自身，并在其上作用为轮换的幂：共 $${k}$ 种。`,
                    ),
                  ],
                  [
                    ["On the other points", "在其余点上"],
                    t(
                      `It may permute the other $${n - k}$ points freely, in $${n - k}!$ ways: $${k} \\cdot ${n - k}! = ${value}$.`,
                      `其余 $${n - k}$ 个点可以任意排列，共 $${n - k}!$ 种：$${k} \\cdot ${n - k}! = ${value}$。`,
                    ),
                  ],
                ],
            t(
              `$S_{${n}}$ has $${cycles}$ ${k === 2 ? "transpositions" : `$${k}$-cycles`}, all conjugate, and $\\frac{${n}!}{${cycles}} = ${value}$.`,
              `$S_{${n}}$ 有 $${cycles}$ 个${k === 2 ? "对换" : ` $${k}$-轮换`}，彼此共轭，而 $\\frac{${n}!}{${cycles}} = ${value}$。`,
            ),
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
  intro: t(
    "In $\\mathbb{Z}_6$, take $N = \\langle 2 \\rangle = \\{0, 2, 4\\}$. Its cosets are $N$ and $1 + N = \\{1, 3, 5\\}$, and adding cosets by representatives gives $(1 + N) + (1 + N) = 2 + N = N$. So $\\mathbb{Z}_6/N$ is a group of order $2$, and the coset $1 + N$ has order $2$.\n\nCheck: $\\frac{|\\mathbb{Z}_6|}{|N|} = \\frac{6}{3} = 2$ cosets.\n\nIn this lesson we find the order of a quotient group and the order of a coset in it.",
    "在 $\\mathbb{Z}_6$ 中取 $N = \\langle 2 \\rangle = \\{0, 2, 4\\}$。它的陪集是 $N$ 与 $1 + N = \\{1, 3, 5\\}$，按代表元相加得 $(1 + N) + (1 + N) = 2 + N = N$。所以 $\\mathbb{Z}_6/N$ 是 $2$ 阶群，陪集 $1 + N$ 的阶为 $2$。\n\n检验：$\\frac{|\\mathbb{Z}_6|}{|N|} = \\frac{6}{3} = 2$ 个陪集。\n\n本课我们求商群的阶以及其中陪集的阶。",
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
        "The order of a quotient is the order of the group divided by the order of the subgroup, and the order of a cyclic subgroup is its generator's order. $(\\mathbb{Z}_4 \\times \\mathbb{Z}_6)/\\langle (2, 3) \\rangle$: $(2, 3)$ has order $\\operatorname{lcm}(2, 2) = 2$, so the quotient has $\\frac{24}{2} = 12$ elements.\n\nFor $(\\mathbb{Z}_{30} \\times \\mathbb{Z}_{45})/\\langle (6, 9) \\rangle$: $6$ has order $\\frac{30}{6} = 5$ in $\\mathbb{Z}_{30}$ and $9$ has order $\\frac{45}{9} = 5$ in $\\mathbb{Z}_{45}$, so $(6, 9)$ has order $\\operatorname{lcm}(5, 5) = 5$, and the quotient has $\\frac{1350}{5} = 270$ elements.\n\nCheck: $5 \\cdot (6, 9) = (30, 45) = (0, 0)$, and no smaller multiple is $(0, 0)$, since $6k \\equiv 0 \\pmod{30}$ needs $5 \\mid k$.\n\n> **Watch out.** The order of a pair is the lcm of the orders, not their product: $5 \\cdot 5 = 25$ would give $\\frac{1350}{25} = 54$, which is wrong. And divide the group order by the order of the pair, not the other way round.",
        "商群的阶等于群的阶除以子群的阶，而循环子群的阶就是它的生成元的阶。$(\\mathbb{Z}_4 \\times \\mathbb{Z}_6)/\\langle (2, 3) \\rangle$：$(2, 3)$ 的阶为 $\\operatorname{lcm}(2, 2) = 2$，所以商群有 $\\frac{24}{2} = 12$ 个元素。\n\n对 $(\\mathbb{Z}_{30} \\times \\mathbb{Z}_{45})/\\langle (6, 9) \\rangle$：$6$ 在 $\\mathbb{Z}_{30}$ 中的阶为 $\\frac{30}{6} = 5$，$9$ 在 $\\mathbb{Z}_{45}$ 中的阶为 $\\frac{45}{9} = 5$，所以 $(6, 9)$ 的阶为 $\\operatorname{lcm}(5, 5) = 5$，商群有 $\\frac{1350}{5} = 270$ 个元素。\n\n检验：$5 \\cdot (6, 9) = (30, 45) = (0, 0)$，且没有更小的倍数等于 $(0, 0)$，因为 $6k \\equiv 0 \\pmod{30}$ 要求 $5 \\mid k$。\n\n> **注意。** 有序对的阶是各阶的最小公倍数，不是乘积：用 $5 \\cdot 5 = 25$ 会得到 $\\frac{1350}{25} = 54$，是错的。还要用群的阶除以有序对的阶，不要反过来。",
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
        const [oa, ob] = [additiveOrder(a, m), additiveOrder(b, n)];
        return numberProblem({
          prompt: t(
            `How many elements does $(${zTex(m)} \\times ${zTex(n)})/\\langle ${pairTex(a, b)} \\rangle$ have?`,
            `$(${zTex(m)} \\times ${zTex(n)})/\\langle ${pairTex(a, b)} \\rangle$ 有多少个元素？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              o,
              `That is the order of $${pairTex(a, b)}$, the size of the subgroup; divide $${m * n}$ by it.`,
              `那是 $${pairTex(a, b)}$ 的阶，即子群的大小；应用 $${m * n}$ 除以它。`,
            ),
            why(
              (m * n) / (oa * ob),
              `That divides by $${oa} \\cdot ${ob}$, the product of the orders; the order of a pair is their lcm, $${o}$.`,
              `那是除以两个阶之积 $${oa} \\cdot ${ob}$；有序对的阶是它们的最小公倍数 $${o}$。`,
            ),
            why(m * n, "That is the order of the whole group; the quotient is smaller.", "那是整个群的阶；商群更小。"),
          ]),
          solution: walked(
            [
              [
                ["Find the order of each coordinate", "求每个坐标的阶"],
                t(
                  `$${a}$ has order $${oa}$ in $${zTex(m)}$ and $${b}$ has order $${ob}$ in $${zTex(n)}$.`,
                  `$${a}$ 在 $${zTex(m)}$ 中的阶为 $${oa}$，$${b}$ 在 $${zTex(n)}$ 中的阶为 $${ob}$。`,
                ),
              ],
              [
                ["Take the lcm", "取最小公倍数"],
                t(
                  `$${pairTex(a, b)}$ has order $\\operatorname{lcm}(${oa}, ${ob}) = ${o}$.`,
                  `$${pairTex(a, b)}$ 的阶为 $\\operatorname{lcm}(${oa}, ${ob}) = ${o}$。`,
                ),
              ],
              [
                ["Divide", "相除"],
                t(
                  `The group has $${m} \\cdot ${n} = ${m * n}$ elements, so the quotient has $\\frac{${m * n}}{${o}} = ${value}$.`,
                  `群有 $${m} \\cdot ${n} = ${m * n}$ 个元素，所以商群有 $\\frac{${m * n}}{${o}} = ${value}$ 个。`,
                ),
              ],
            ],
            t(
              `$${value} \\cdot ${o} = ${m * n}$: the $${value}$ cosets of $${o}$ elements each fill the group.`,
              `$${value} \\cdot ${o} = ${m * n}$：$${value}$ 个各含 $${o}$ 个元素的陪集恰好填满整个群。`,
            ),
          ),
        });
      },
    },
    {
      id: "orders-of-elements-of-quotient-groups",
      title: t("Orders of cosets", "陪集的阶"),
      explanation: t(
        "A coset has order equal to the smallest multiple of its representative that falls into the subgroup. In $\\mathbb{Z}_{24}/\\langle 8 \\rangle$, the coset $6 + \\langle 8 \\rangle$ has order the least $k$ with $6k \\in \\langle 8 \\rangle$, that is, $8 \\mid 6k$ modulo $24$: $k = 4$.\n\nIn $\\mathbb{Z}_{100}/\\langle 70 \\rangle$, first $\\langle 70 \\rangle = \\langle \\gcd(70, 100) \\rangle = \\langle 10 \\rangle$. The coset $24 + \\langle 70 \\rangle$ has order the least $k$ with $10 \\mid 24k$, that is, $k = \\frac{10}{\\gcd(24, 10)} = 5$.\n\nCheck: $24, 48, 72, 96$ are not multiples of $10$, but $5 \\cdot 24 = 120 \\equiv 20$ is.\n\n> **Watch out.** This is not the order of $24$ in $\\mathbb{Z}_{100}$, which is $25$, and not the order $10$ of the quotient itself. The order of a coset only divides the order of the quotient.",
        "一个陪集的阶等于使它的代表元落入子群的最小倍数。在 $\\mathbb{Z}_{24}/\\langle 8 \\rangle$ 中，陪集 $6 + \\langle 8 \\rangle$ 的阶是使 $6k \\in \\langle 8 \\rangle$ 的最小 $k$，即模 $24$ 下 $8 \\mid 6k$：$k = 4$。\n\n在 $\\mathbb{Z}_{100}/\\langle 70 \\rangle$ 中，先有 $\\langle 70 \\rangle = \\langle \\gcd(70, 100) \\rangle = \\langle 10 \\rangle$。陪集 $24 + \\langle 70 \\rangle$ 的阶是使 $10 \\mid 24k$ 的最小 $k$，即 $k = \\frac{10}{\\gcd(24, 10)} = 5$。\n\n检验：$24, 48, 72, 96$ 都不是 $10$ 的倍数，而 $5 \\cdot 24 = 120 \\equiv 20$ 是。\n\n> **注意。** 这不是 $24$ 在 $\\mathbb{Z}_{100}$ 中的阶 $25$，也不是商群本身的阶 $10$。陪集的阶只整除商群的阶。",
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
          mistakes: apart(value, [
            why(
              additiveOrder(x, n),
              `That is the order of $${x}$ in $${zTex(n)}$; in the quotient you stop as soon as a multiple lands in $\\langle ${d} \\rangle$.`,
              `那是 $${x}$ 在 $${zTex(n)}$ 中的阶；在商群中，只要某个倍数落入 $\\langle ${d} \\rangle$ 就停止。`,
            ),
            why(d, "That is the order of the quotient; the order of a coset only divides it.", "那是商群的阶；陪集的阶只是它的因数。"),
            why(n / d, `That is the order of the subgroup $\\langle ${a} \\rangle$.`, `那是子群 $\\langle ${a} \\rangle$ 的阶。`),
            why(gcd(x, d), `That is $\\gcd(${x}, ${d})$; divide $${d}$ by it.`, `那是 $\\gcd(${x}, ${d})$；应用 $${d}$ 除以它。`),
          ]),
          solution: walked(
            [
              [
                ["Simplify the subgroup", "化简子群"],
                t(
                  `$\\gcd(${a}, ${n}) = ${d}$, so $\\langle ${a} \\rangle = \\langle ${d} \\rangle$.`,
                  `$\\gcd(${a}, ${n}) = ${d}$，所以 $\\langle ${a} \\rangle = \\langle ${d} \\rangle$。`,
                ),
              ],
              [
                ["Find the least multiple", "求最小倍数"],
                t(
                  `We need the least $k$ with $${d} \\mid ${x}k$: $k = \\frac{${d}}{\\gcd(${x}, ${d})} = \\frac{${d}}{${gcd(x, d)}} = ${value}$.`,
                  `要找使 $${d} \\mid ${x}k$ 的最小 $k$：$k = \\frac{${d}}{\\gcd(${x}, ${d})} = \\frac{${d}}{${gcd(x, d)}} = ${value}$。`,
                ),
              ],
            ],
            t(
              `The first multiple of $${x}$ that $${d}$ divides is $${value * x}$, and $\\frac{${value * x}}{${x}} = ${value}$.`,
              `$${x}$ 的倍数中第一个能被 $${d}$ 整除的是 $${value * x}$，而 $\\frac{${value * x}}{${x}} = ${value}$。`,
            ),
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
  intro: t(
    "A group of order $15$ splits into cosets of any subgroup $H$, all of size $|H|$, so $|H|$ divides $15$. Its subgroups can only have $1$, $3$, $5$ or $15$ elements, and none has $6$.\n\nCheck: $\\mathbb{Z}_{15}$ has $\\langle 5 \\rangle = \\{0, 5, 10\\}$ of order $3$ and $\\langle 3 \\rangle$ of order $5$, and $3 \\cdot 5 = 15$.\n\nIn this lesson we use Lagrange's theorem to rule out orders of subgroups and elements, and to find indices in a tower of subgroups.",
    "$15$ 阶群可以划分成任一子群 $H$ 的陪集，每个陪集都有 $|H|$ 个元素，所以 $|H|$ 整除 $15$。它的子群只能有 $1$、$3$、$5$ 或 $15$ 个元素，不会有 $6$ 个。\n\n检验：$\\mathbb{Z}_{15}$ 有 $3$ 阶子群 $\\langle 5 \\rangle = \\{0, 5, 10\\}$ 与 $5$ 阶子群 $\\langle 3 \\rangle$，且 $3 \\cdot 5 = 15$。\n\n本课我们用拉格朗日定理排除子群与元素不可能的阶，并求子群链中的指数。",
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
        "A group of order $36$ can only have subgroups and elements of orders dividing $36$: $1, 2, 3, 4, 6, 9, 12, 18, 36$. No subgroup of order $8$ is possible.\n\nA group of order $1001 = 7 \\cdot 11 \\cdot 13$ can only have subgroups and elements of orders $1, 7, 11, 13, 77, 91, 143, 1001$. So no element has order $3$, and no subgroup has order $100$.\n\nCheck: $1001 = 7 \\cdot 143 = 11 \\cdot 91 = 13 \\cdot 77$, while $1001 \\div 3$ leaves remainder $2$.\n\n> **Watch out.** Lagrange's theorem only rules orders out. A divisor need not occur: $A_4$ has order $12$ but no subgroup of order $6$. What is certain is that a non-divisor never occurs.",
        "$36$ 阶群的子群与元素的阶只能是 $36$ 的因数：$1, 2, 3, 4, 6, 9, 12, 18, 36$。不可能有 $8$ 阶子群。\n\n$1001 = 7 \\cdot 11 \\cdot 13$ 阶群的子群与元素的阶只能是 $1, 7, 11, 13, 77, 91, 143, 1001$。所以没有元素的阶为 $3$，也没有 $100$ 阶子群。\n\n检验：$1001 = 7 \\cdot 143 = 11 \\cdot 91 = 13 \\cdot 77$，而 $1001 \\div 3$ 余 $2$。\n\n> **注意。** 拉格朗日定理只能排除某些阶。因数不一定出现：$A_4$ 的阶为 $12$，却没有 $6$ 阶子群。可以确定的是，不是因数的阶一定不出现。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(12, 120);
        while (divisors(n).length < 6);
        const ds = divisors(n).filter((d) => d > 1 && d < n);
        const non = range(2, n - 1).filter((d) => n % d !== 0 && d < n / 2 + 4);
        const right = rng.pick(ds);
        const element = rng.bool();
        const others = rng.sample(non, 3);
        const what = element ? t("an element", "元素") : t("a subgroup", "子群");
        return reasoned(
          texChoice(
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
            others.map(String),
            walked(
              [
                [
                  ["Apply Lagrange's theorem", "应用拉格朗日定理"],
                  t(`The order of ${what.en} of $G$ must divide $|G| = ${n}$.`, `$G$ 中${what["zh-CN"]}的阶必须整除 $|G| = ${n}$。`),
                ],
                [
                  ["Test the options", "检验选项"],
                  t(
                    `$${n} = ${right} \\cdot ${n / right}$, so $${right}$ is possible.`,
                    `$${n} = ${right} \\cdot ${n / right}$，所以 $${right}$ 是可能的。`,
                  ),
                ],
              ],
              t(
                `The divisors of $${n}$ are $${divisors(n).join(", ")}$, and $${right}$ is among them.`,
                `$${n}$ 的因数为 $${divisors(n).join(", ")}$，$${right}$ 在其中。`,
              ),
            ),
          ),
          others.map((w) =>
            because(
              `${w}`,
              `$${w}$ does not divide $${n}$: $${n} \\div ${w}$ leaves remainder $${n % w}$.`,
              `$${w}$ 不整除 $${n}$：$${n} \\div ${w}$ 余 $${n % w}$。`,
            ),
          ),
        );
      },
    },
    {
      id: "indices-in-towers-of-subgroups",
      title: t("Indices in towers", "子群链中的指数"),
      explanation: t(
        "Indices multiply along a tower of subgroups, which follows from Lagrange's theorem applied at each level. If $|G| = 120$, $H \\le K \\le G$, $[G : K] = 5$ and $|H| = 4$, then $|K| = 24$ and $[K : H] = 6$; also $[G : H] = 30 = 5 \\cdot 6$.\n\nIf $|G| = 5040$, $[G : K] = 7$ and $|H| = 30$, then $|K| = \\frac{5040}{7} = 720$ and $[K : H] = \\frac{720}{30} = 24$.\n\nCheck: $[G : H] = \\frac{5040}{30} = 168 = 7 \\cdot 24$.\n\n> **Watch out.** $[K : H]$ is $\\frac{|K|}{|H|}$, not $\\frac{|G|}{|H|}$: dividing $5040$ by $30$ gives $168$, which is $[G : H]$.",
        "沿着子群链，指数相乘，这可以由在每一层应用拉格朗日定理得到。若 $|G| = 120$，$H \\le K \\le G$，$[G : K] = 5$，$|H| = 4$，则 $|K| = 24$，$[K : H] = 6$；且 $[G : H] = 30 = 5 \\cdot 6$。\n\n若 $|G| = 5040$，$[G : K] = 7$，$|H| = 30$，则 $|K| = \\frac{5040}{7} = 720$，$[K : H] = \\frac{720}{30} = 24$。\n\n检验：$[G : H] = \\frac{5040}{30} = 168 = 7 \\cdot 24$。\n\n> **注意。** $[K : H]$ 是 $\\frac{|K|}{|H|}$，不是 $\\frac{|G|}{|H|}$：用 $5040$ 除以 $30$ 得 $168$，那是 $[G : H]$。",
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
          mistakes: apart(
            ask === 0 ? j : h,
            ask === 0
              ? [
                  why(
                    n / h,
                    `That is $[G : H] = \\frac{${n}}{${h}}$, not $[K : H]$.`,
                    `那是 $[G : H] = \\frac{${n}}{${h}}$，不是 $[K : H]$。`,
                  ),
                  why(h * j, "That is $|K|$; divide it by $|H|$.", "那是 $|K|$；应再除以 $|H|$。"),
                  why(i, "That is $[G : K]$, the index one level up.", "那是上一层的指数 $[G : K]$。"),
                ]
              : [
                  why(i * j, "That is $[G : H]$; divide $|G|$ by it.", "那是 $[G : H]$；应用 $|G|$ 除以它。"),
                  why(n / i, "That is $|K|$; $H$ is smaller still.", "那是 $|K|$；$H$ 还要更小。"),
                  why(
                    n / j,
                    `That divides $${n}$ by $[K : H]$ alone; divide by $[G : H] = ${i * j}$.`,
                    `那是只用 $[K : H]$ 去除 $${n}$；应除以 $[G : H] = ${i * j}$。`,
                  ),
                ],
          ),
          solution: walked(
            ask === 0
              ? [
                  [
                    ["Find the order of the middle subgroup", "求中间子群的阶"],
                    t(
                      `$|K| = \\frac{|G|}{[G : K]} = \\frac{${n}}{${i}} = ${h * j}$.`,
                      `$|K| = \\frac{|G|}{[G : K]} = \\frac{${n}}{${i}} = ${h * j}$。`,
                    ),
                  ],
                  [
                    ["Divide by the order of the smaller subgroup", "除以较小子群的阶"],
                    t(`$[K : H] = \\frac{${h * j}}{${h}} = ${j}$.`, `$[K : H] = \\frac{${h * j}}{${h}} = ${j}$。`),
                  ],
                ]
              : [
                  [
                    ["Multiply the indices", "指数相乘"],
                    t(
                      `$[G : H] = [G : K][K : H] = ${i} \\cdot ${j} = ${i * j}$.`,
                      `$[G : H] = [G : K][K : H] = ${i} \\cdot ${j} = ${i * j}$。`,
                    ),
                  ],
                  [
                    ["Divide the group order", "用群的阶相除"],
                    t(`$|H| = \\frac{${n}}{${i * j}} = ${h}$.`, `$|H| = \\frac{${n}}{${i * j}} = ${h}$。`),
                  ],
                ],
            t(
              `$|H| \\cdot [K : H] \\cdot [G : K] = ${h} \\cdot ${j} \\cdot ${i} = ${n} = |G|$.`,
              `$|H| \\cdot [K : H] \\cdot [G : K] = ${h} \\cdot ${j} \\cdot ${i} = ${n} = |G|$。`,
            ),
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
  intro: t(
    "$\\mathbb{Z}_7$ has prime order, so by Lagrange's theorem its only subgroups are $\\{0\\}$ and $\\mathbb{Z}_7$: it is simple. $\\mathbb{Z}_6$ is not, because $\\langle 2 \\rangle = \\{0, 2, 4\\}$ is a normal subgroup that is neither $\\{0\\}$ nor all of $\\mathbb{Z}_6$.\n\nCheck: $\\langle 2 \\rangle$ has $3$ elements, and $3$ divides $6$ without being $1$ or $6$.\n\nIn this lesson we decide which groups are simple and which quotients of $\\mathbb{Z}_n$ are simple.",
    "$\\mathbb{Z}_7$ 的阶是素数，由拉格朗日定理，它的子群只有 $\\{0\\}$ 与 $\\mathbb{Z}_7$：它是单群。$\\mathbb{Z}_6$ 不是，因为 $\\langle 2 \\rangle = \\{0, 2, 4\\}$ 是正规子群，既不是 $\\{0\\}$ 也不是整个 $\\mathbb{Z}_6$。\n\n检验：$\\langle 2 \\rangle$ 有 $3$ 个元素，$3$ 整除 $6$，又不等于 $1$ 或 $6$。\n\n本课我们判断哪些群是单群，以及 $\\mathbb{Z}_n$ 的哪些商群是单群。",
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
        "$\\mathbb{Z}_{15}$ is not simple: $\\langle 3 \\rangle$ is a proper nontrivial normal subgroup. $S_n$ ($n \\ge 3$) is not simple since $A_n \\trianglelefteq S_n$, and $A_4$ has the normal subgroup $\\{e, (1\\;2)(3\\;4), (1\\;3)(2\\;4), (1\\;4)(2\\;3)\\}$. $A_5$ is simple.\n\n$\\mathbb{Z}_{91}$ is not simple: $91 = 7 \\cdot 13$, and $\\langle 7 \\rangle$ has $13$ elements. $A_{20}$ is simple, because $20 \\ge 5$.\n\nCheck: $\\langle 7 \\rangle = \\{0, 7, 14, \\dots, 84\\}$, and $\\frac{84}{7} + 1 = 13$.\n\n> **Watch out.** A simple group inside a group does not make the bigger group simple: $A_5$ is simple, but $S_5$ is not, because $A_5$ itself is a proper nontrivial normal subgroup of $S_5$.",
        "$\\mathbb{Z}_{15}$ 不是单群：$\\langle 3 \\rangle$ 是真非平凡正规子群。$S_n$（$n \\ge 3$）不是单群，因为 $A_n \\trianglelefteq S_n$；$A_4$ 有正规子群 $\\{e, (1\\;2)(3\\;4), (1\\;3)(2\\;4), (1\\;4)(2\\;3)\\}$。$A_5$ 是单群。\n\n$\\mathbb{Z}_{91}$ 不是单群：$91 = 7 \\cdot 13$，$\\langle 7 \\rangle$ 有 $13$ 个元素。$A_{20}$ 是单群，因为 $20 \\ge 5$。\n\n检验：$\\langle 7 \\rangle = \\{0, 7, 14, \\dots, 84\\}$，且 $\\frac{84}{7} + 1 = 13$。\n\n> **注意。** 群里含有单群，并不说明这个大群是单群：$A_5$ 是单群，但 $S_5$ 不是，因为 $A_5$ 本身就是 $S_5$ 的真非平凡正规子群。",
      ),
      generate(rng) {
        const n = rng.int(2, 60);
        const k = rng.int(5, 12);
        const m = rng.int(3, 12);
        const p = factorize(n)[0]![0];
        const zm = `${zTex(m)} \\times \\{0\\}`;
        const decisions: Decision[] = [
          isPrime(n)
            ? {
                prompt: t(`Is $${zTex(n)}$ simple?`, `$${zTex(n)}$ 是单群吗？`),
                holds: true,
                steps: [
                  [
                    ["Apply Lagrange's theorem", "应用拉格朗日定理"],
                    t(`$${n}$ is prime, so every subgroup has order $1$ or $${n}$.`, `$${n}$ 是素数，所以每个子群的阶为 $1$ 或 $${n}$。`),
                  ],
                  [
                    ["List the normal subgroups", "列出正规子群"],
                    t(
                      `The only subgroups are $\\{0\\}$ and $${zTex(n)}$, so the group is simple.`,
                      `子群只有 $\\{0\\}$ 与 $${zTex(n)}$，所以它是单群。`,
                    ),
                  ],
                ],
                check: t(`$${n}$ has no divisors other than $1$ and $${n}$.`, `$${n}$ 除 $1$ 与 $${n}$ 外没有因数。`),
                wrong: t(
                  "A group of prime order has no subgroups besides the trivial one and itself, so it has no proper nontrivial normal subgroup.",
                  "素数阶群除平凡子群与自身外没有子群，所以没有真非平凡正规子群。",
                ),
              }
            : {
                prompt: t(`Is $${zTex(n)}$ simple?`, `$${zTex(n)}$ 是单群吗？`),
                holds: false,
                steps: [
                  [
                    ["Find a prime factor", "找一个素因数"],
                    t(`$${n}$ is not prime; its smallest prime factor is $${p}$.`, `$${n}$ 不是素数；它最小的素因数是 $${p}$。`),
                  ],
                  [
                    ["Find a normal subgroup", "找一个正规子群"],
                    t(
                      `$\\langle ${p} \\rangle$ has $\\frac{${n}}{${p}} = ${n / p}$ elements, more than $1$ and fewer than $${n}$, and it is normal because $${zTex(n)}$ is abelian.`,
                      `$\\langle ${p} \\rangle$ 有 $\\frac{${n}}{${p}} = ${n / p}$ 个元素，多于 $1$ 个且少于 $${n}$ 个；又因 $${zTex(n)}$ 是阿贝尔群，它是正规子群。`,
                    ),
                  ],
                ],
                check: t(`$${p} \\cdot ${n / p} = ${n}$.`, `$${p} \\cdot ${n / p} = ${n}$。`),
                wrong: t(
                  `$\\langle ${p} \\rangle$ is a proper nontrivial normal subgroup.`,
                  `$\\langle ${p} \\rangle$ 是真非平凡正规子群。`,
                ),
              },
          {
            prompt: t(`Is $A_{${k}}$ simple?`, `$A_{${k}}$ 是单群吗？`),
            holds: true,
            steps: [
              [["Compare with five", "与五比较"], t(`Here $n = ${k} \\ge 5$.`, `这里 $n = ${k} \\ge 5$。`)],
              [
                ["Apply the theorem", "应用定理"],
                t(
                  `$A_n$ is simple for every $n \\ge 5$, so $A_{${k}}$ is simple.`,
                  `对每个 $n \\ge 5$，$A_n$ 是单群，所以 $A_{${k}}$ 是单群。`,
                ),
              ],
            ],
            check: t(
              `The theorem starts at $A_5$, of order $60$, and $${k} \\ge 5$; the exception $A_4$ lies below it.`,
              `定理从阶为 $60$ 的 $A_5$ 开始，且 $${k} \\ge 5$；例外 $A_4$ 在它之下。`,
            ),
            wrong: t("$A_n$ is simple for every $n \\ge 5$.", "对每个 $n \\ge 5$，$A_n$ 是单群。"),
          },
          {
            prompt: t(`Is $S_{${m}}$ simple?`, `$S_{${m}}$ 是单群吗？`),
            holds: false,
            steps: [
              [
                ["Take the even permutations", "取偶置换"],
                t(`$A_{${m}}$ has index $2$ in $S_{${m}}$, so it is normal.`, `$A_{${m}}$ 在 $S_{${m}}$ 中的指数为 $2$，所以是正规子群。`),
              ],
              [
                ["Check it is proper and nontrivial", "验证它是真非平凡子群"],
                t(
                  `$A_{${m}}$ contains the $3$-cycle $(1\\;2\\;3)$ but not the transposition $(1\\;2)$.`,
                  `$A_{${m}}$ 含有 $3$-轮换 $(1\\;2\\;3)$，但不含对换 $(1\\;2)$。`,
                ),
              ],
            ],
            check: t(`$|A_{${m}}| = \\frac{${m}!}{2}$, half of $|S_{${m}}|$.`, `$|A_{${m}}| = \\frac{${m}!}{2}$，是 $|S_{${m}}|$ 的一半。`),
            wrong: t(`$A_{${m}}$ is a proper nontrivial normal subgroup.`, `$A_{${m}}$ 是真非平凡正规子群。`),
          },
          {
            prompt: t(`Is the dihedral group $D_{${m}}$ simple?`, `二面体群 $D_{${m}}$ 是单群吗？`),
            holds: false,
            steps: [
              [
                ["Take the rotations", "取旋转"],
                t(
                  `The rotations form $\\langle r \\rangle$, with $${m}$ of the $${2 * m}$ elements.`,
                  `旋转构成 $\\langle r \\rangle$，占 $${2 * m}$ 个元素中的 $${m}$ 个。`,
                ),
              ],
              [
                ["Use the index", "利用指数"],
                t(
                  "$\\langle r \\rangle$ has index $2$, so it is normal, and it is neither trivial nor everything.",
                  "$\\langle r \\rangle$ 的指数为 $2$，所以是正规子群，且既不平凡也不是整个群。",
                ),
              ],
            ],
            check: t(`$\\frac{${2 * m}}{${m}} = 2$.`, `$\\frac{${2 * m}}{${m}} = 2$。`),
            wrong: t(
              "The rotation subgroup $\\langle r \\rangle$ has index $2$, so it is normal.",
              "旋转子群 $\\langle r \\rangle$ 的指数为 $2$，所以是正规子群。",
            ),
          },
          {
            prompt: t(`Is $${zTex(m)} \\times ${zTex(k)}$ simple?`, `$${zTex(m)} \\times ${zTex(k)}$ 是单群吗？`),
            holds: false,
            steps: [
              [["Take one factor", "取一个因子"], t(`$${zm}$ is a subgroup with $${m}$ elements.`, `$${zm}$ 是有 $${m}$ 个元素的子群。`)],
              [
                ["Use commutativity", "利用交换性"],
                t(
                  `The product is abelian, so $${zm}$ is normal, and $1 < ${m} < ${m * k}$.`,
                  `直积是阿贝尔群，所以 $${zm}$ 是正规子群，且 $1 < ${m} < ${m * k}$。`,
                ),
              ],
            ],
            check: t(`$${m}$ divides $${m} \\cdot ${k} = ${m * k}$.`, `$${m}$ 整除 $${m} \\cdot ${k} = ${m * k}$。`),
            wrong: t(`$${zm}$ is a proper nontrivial normal subgroup.`, `$${zm}$ 是真非平凡正规子群。`),
          },
        ];
        return decide(rng.pick(decisions));
      },
    },
    {
      id: "simple-quotients-of-zn",
      title: t("Simple quotients", "单商群"),
      explanation: t(
        "$\\mathbb{Z}_n/\\langle a \\rangle \\cong \\mathbb{Z}_d$ with $d = \\gcd(a, n)$, so the quotient is simple exactly when $d$ is prime, that is, when $\\langle a \\rangle$ is maximal.\n\nIn $\\mathbb{Z}_{100}$: $\\gcd(30, 100) = 10$, so $\\mathbb{Z}_{100}/\\langle 30 \\rangle \\cong \\mathbb{Z}_{10}$ is not simple; $\\gcd(35, 100) = 5$, so $\\mathbb{Z}_{100}/\\langle 35 \\rangle \\cong \\mathbb{Z}_5$ is simple.\n\nCheck: $\\langle 35 \\rangle$ has $\\frac{100}{5} = 20$ elements, and $\\frac{100}{20} = 5$.\n\n> **Watch out.** Look at $\\gcd(a, n)$, not at $a$: $35$ is not prime yet gives a simple quotient, while $7$ is prime but $\\gcd(7, 100) = 1$ gives the trivial quotient, which is not simple.",
        "$\\mathbb{Z}_n/\\langle a \\rangle \\cong \\mathbb{Z}_d$，其中 $d = \\gcd(a, n)$，所以商群是单群当且仅当 $d$ 是素数，即 $\\langle a \\rangle$ 是极大子群。\n\n在 $\\mathbb{Z}_{100}$ 中：$\\gcd(30, 100) = 10$，所以 $\\mathbb{Z}_{100}/\\langle 30 \\rangle \\cong \\mathbb{Z}_{10}$ 不是单群；$\\gcd(35, 100) = 5$，所以 $\\mathbb{Z}_{100}/\\langle 35 \\rangle \\cong \\mathbb{Z}_5$ 是单群。\n\n检验：$\\langle 35 \\rangle$ 有 $\\frac{100}{5} = 20$ 个元素，且 $\\frac{100}{20} = 5$。\n\n> **注意。** 要看 $\\gcd(a, n)$，而不是 $a$：$35$ 不是素数，却给出单商群；$7$ 是素数，但 $\\gcd(7, 100) = 1$，给出平凡商群，它不是单群。",
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
          mistakes: apart(count, [
            why(4 - count, "That counts the quotients that are not simple.", "那是不是单群的商群个数。"),
            why(
              as.filter((a) => isPrime(a)).length,
              "That counts the $a$ that are prime; what matters is whether $\\gcd(a, n)$ is prime.",
              "那是素数 $a$ 的个数；关键在于 $\\gcd(a, n)$ 是否为素数。",
            ),
            why(
              count + 1,
              "Recount: $\\mathbb{Z}_d$ is simple only for prime $d$, so composite $d$ such as $4$ or $6$ do not count.",
              "重新数一数：只有 $d$ 为素数时 $\\mathbb{Z}_d$ 才是单群，像 $4$ 或 $6$ 这样的合数不算。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find each quotient", "求出每个商群"],
                t(
                  `$\\mathbb{Z}_{${n}}/\\langle a \\rangle \\cong \\mathbb{Z}_{\\gcd(a, ${n})}$, which gives $${as.map((a) => zTex(gcd(a, n))).join(", ")}$.`,
                  `$\\mathbb{Z}_{${n}}/\\langle a \\rangle \\cong \\mathbb{Z}_{\\gcd(a, ${n})}$，得到 $${as.map((a) => zTex(gcd(a, n))).join(", ")}$。`,
                ),
              ],
              [
                ["Keep the prime orders", "保留素数阶"],
                t(
                  `${count === 0 ? "None has" : `$${count}$ of them have`} prime order, so the answer is $${count}$.`,
                  `其中${count === 0 ? "没有一个" : `有 $${count}$ 个`}的阶为素数，所以答案是 $${count}$。`,
                ),
              ],
            ],
            t(
              `For $a = ${as[0]}$: $\\langle ${as[0]} \\rangle$ has $\\frac{${n}}{${gcd(as[0]!, n)}} = ${n / gcd(as[0]!, n)}$ elements, so the quotient has $\\frac{${n}}{${n / gcd(as[0]!, n)}} = ${gcd(as[0]!, n)}$ elements.`,
              `对 $a = ${as[0]}$：$\\langle ${as[0]} \\rangle$ 有 $\\frac{${n}}{${gcd(as[0]!, n)}} = ${n / gcd(as[0]!, n)}$ 个元素，所以商群有 $\\frac{${n}}{${n / gcd(as[0]!, n)}} = ${gcd(as[0]!, n)}$ 个元素。`,
            ),
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
