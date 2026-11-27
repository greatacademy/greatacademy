import type { Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem, why } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { divisors, texChoice } from "./abstract-algebra-common.ts";
import { apart, because, decide } from "./abstract-algebra-quotients.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { range } from "./methods-of-proof-common.ts";

// Abstract Algebra unit 7: p-groups and the Sylow theorems.

/** primesOf lists the distinct primes dividing n. */
const primesOf = (n: number) => range(2, n).filter((p) => n % p === 0 && range(2, p - 1).every((d) => p % d !== 0));

/** sylowOrder is the largest power of p dividing n. */
function sylowOrder(n: number, p: number): number {
  let q = 1;
  while (n % (q * p) === 0) q *= p;
  return q;
}

/** isPrimePower reports whether n > 1 is a power of a single prime. */
const isPrimePower = (n: number) => n > 1 && primesOf(n).length === 1;

/** sylowCounts lists the numbers allowed for n_p by the third Sylow theorem in a group of order n. */
const sylowCounts = (n: number, p: number) => divisors(n / sylowOrder(n, p)).filter((d) => d % p === 1);

/** powerTex writes pᵏ, or p when k = 1. */
const powerTex = (p: number, k: number) => (k === 1 ? `${p}` : `${p}^{${k}}`);

/** factorTex writes the prime factorization of n. */
const factorTex = (n: number) =>
  primesOf(n)
    .map((p) => powerTex(p, Math.round(Math.log(sylowOrder(n, p)) / Math.log(p))))
    .join(" \\cdot ");

/** timesTex writes k copies of a class size, as "c \cdot s", or just "s" when k = 1. */
const timesTex = (k: number, size: number) => (k === 1 ? `${size}` : `${k} \\cdot ${size}`);

/** pGroups recognizes p-groups and uses the class equation to find their centers. */
export const pGroups: TopicDef = {
  id: "p-groups",
  title: t("P-Groups", "p-群"),
  summary: t(
    "A p-group is a group whose order is a power of a prime p. Every conjugacy class of a p-group has size a power of p, so the class equation |G| = |Z(G)| + Σ [G : C(xᵢ)] forces p to divide |Z(G)|: a nontrivial p-group has a nontrivial center. Consequently every group of order p² is abelian.",
    "阶为素数 p 的幂的群称为 p-群。p-群的每个共轭类大小都是 p 的幂，所以类方程 |G| = |Z(G)| + Σ [G : C(xᵢ)] 迫使 p 整除 |Z(G)|：非平凡 p-群的中心非平凡。由此，每个 p² 阶群都是阿贝尔群。",
  ),
  intro: t(
    "A group of order $16 = 2^4$ is a $2$-group. Suppose it has $3$ conjugacy classes of size $4$ and every other class has one element. The class equation gives $|Z(G)| = 16 - 3 \\cdot 4 = 4$.\n\nCheck: $4$ is a power of $2$ greater than $1$, as the center of a nontrivial $2$-group must be.\n\nIn this lesson we recognize $p$-groups and use the class equation to find their centers.",
    "$16 = 2^4$ 阶群是 $2$-群。设它有 $3$ 个大小为 $4$ 的共轭类，其余共轭类都只有一个元素。类方程给出 $|Z(G)| = 16 - 3 \\cdot 4 = 4$。\n\n检验：$4$ 是大于 $1$ 的 $2$ 的幂，非平凡 $2$-群的中心理应如此。\n\n本课我们识别 $p$-群，并用类方程求它们的中心。",
  ),
  prerequisites: ["conjugation-and-conjugacy-classes"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-p-groups",
      title: t("Recognizing p-groups", "识别 p-群"),
      explanation: t(
        "A group of order $243 = 3^5$ is a $3$-group. A group of order $200 = 2^3 \\cdot 5^2$ is not a $p$-group, though it contains $2$-subgroups and $5$-subgroups.\n\nA group of order $1024$ is a $2$-group: halving $1024$ ten times reaches $1$, so $1024 = 2^{10}$.\n\nCheck: $2^{10} = 32 \\cdot 32 = 1024$.\n\n> **Watch out.** Containing $p$-subgroups does not make a group a $p$-group: a group of order $12$ has subgroups of order $4$ and $3$, but $12 = 2^2 \\cdot 3$ is not a prime power.",
        "$243 = 3^5$ 阶群是 $3$-群。$200 = 2^3 \\cdot 5^2$ 阶群不是 $p$-群，尽管它含有 $2$-子群与 $5$-子群。\n\n$1024$ 阶群是 $2$-群：把 $1024$ 连续减半十次得到 $1$，所以 $1024 = 2^{10}$。\n\n检验：$2^{10} = 32 \\cdot 32 = 1024$。\n\n> **注意。** 含有 $p$-子群并不使群成为 $p$-群：$12$ 阶群有 $4$ 阶和 $3$ 阶子群，但 $12 = 2^2 \\cdot 3$ 不是素数幂。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7, 11, 13]);
        const n = rng.bool()
          ? p ** rng.int(2, p === 2 ? 9 : p === 3 ? 5 : 3)
          : p ** rng.int(1, 3) * rng.pick([2, 3, 5, 7].filter((q) => q !== p)) * rng.int(1, 3);
        const holds = isPrimePower(n);
        const ps = primesOf(n);
        const [a = p, b = p] = ps;
        return decide({
          prompt: t(`Is every group of order $${n}$ a $p$-group for some prime $p$?`, `是否每个 $${n}$ 阶群都是某个素数 $p$ 的 $p$-群？`),
          holds,
          steps: [
            [["Factor the order", "分解阶"], t(`$${n} = ${factorTex(n)}$.`, `$${n} = ${factorTex(n)}$。`)],
            [
              ["Compare with the definition", "对照定义"],
              holds
                ? t(
                    `This is a power of the single prime ${a}, so every group of order $${n}$ is a $${a}$-group.`,
                    `这是单个素数 ${a} 的幂，所以每个 $${n}$ 阶群都是 $${a}$-群。`,
                  )
                : t(
                    `The primes ${ps.join(", ")} all divide $${n}$, so it is not a power of a single prime.`,
                    `素数 ${ps.join("、")} 都整除 $${n}$，所以它不是单个素数的幂。`,
                  ),
            ],
          ],
          check: holds
            ? t(
                `Dividing $${n}$ by ${a} again and again reaches $1$ with no other factor left.`,
                `把 $${n}$ 反复除以 ${a}，最后得到 $1$，没有其他因子。`,
              )
            : t(
                `$\\frac{${n}}{${a}} = ${n / a}$ and $\\frac{${n}}{${b}} = ${n / b}$ are whole numbers.`,
                `$\\frac{${n}}{${a}} = ${n / a}$ 与 $\\frac{${n}}{${b}} = ${n / b}$ 都是整数。`,
              ),
          wrong: holds
            ? t(
                `$${n}$ is a power of ${a}, so every group of this order is a $${a}$-group.`,
                `$${n}$ 是 ${a} 的幂，所以这个阶的每个群都是 $${a}$-群。`,
              )
            : t(
                `By Cauchy's theorem a group of order $${n}$ has elements of order ${a} and of order ${b}, so its order is not a power of one prime.`,
                `由柯西定理，$${n}$ 阶群有 ${a} 阶元素和 ${b} 阶元素，所以它的阶不是单个素数的幂。`,
              ),
        });
      },
    },
    {
      id: "centers-from-class-equations-of-p-groups",
      title: t("Centers of p-groups", "p-群的中心"),
      explanation: t(
        "The class equation says the group order is the size of the center plus the sizes of the other classes, so subtract those to find the center. If a group of order $27$ has $8$ conjugacy classes of size $3$ besides the central elements, then $|Z(G)| = 27 - 8 \\cdot 3 = 3$.\n\nIf a group of order $128$ has $28$ classes of size $2$ and $16$ of size $4$ besides the central elements, then $|Z(G)| = 128 - 56 - 64 = 8$.\n\nCheck: $8 + 56 + 64 = 128$, and $8$ is a power of $2$.\n\n> **Watch out.** Subtract the sizes of the classes, not their number: $28$ classes of size $2$ hold $56$ elements, not $28$.",
        "类方程说群的阶等于中心的大小加上其他类的大小，所以减去后者就得到中心的大小。若 $27$ 阶群除中心元素外有 $8$ 个大小为 $3$ 的共轭类，则 $|Z(G)| = 27 - 8 \\cdot 3 = 3$。\n\n若 $128$ 阶群除中心元素外有 $28$ 个大小为 $2$ 的类和 $16$ 个大小为 $4$ 的类，则 $|Z(G)| = 128 - 56 - 64 = 8$。\n\n检验：$8 + 56 + 64 = 128$，且 $8$ 是 $2$ 的幂。\n\n> **注意。** 减去的是各类的大小，而不是类的个数：$28$ 个大小为 $2$ 的类含 $56$ 个元素，而不是 $28$ 个。",
      ),
      generate(rng) {
        const p = rng.pick([2, 2, 3, 3, 5]);
        const k = rng.int(3, p === 2 ? 6 : 4);
        const z = p ** rng.int(1, k - 2);
        const rest = p ** k - z;
        const d = k >= 4 ? rng.int(0, Math.floor(rest / p ** 2 / 2)) : 0;
        const c = (rest - d * p ** 2) / p;
        const classes =
          d === 0 ? `$${c}$ conjugacy classes of size $${p}$` : `$${c}$ conjugacy classes of size $${p}$ and $${d}$ of size $${p * p}$`;
        const classesZh =
          d === 0 ? `$${c}$ 个大小为 $${p}$ 的共轭类` : `$${c}$ 个大小为 $${p}$ 的共轭类和 $${d}$ 个大小为 $${p * p}$ 的共轭类`;
        const sizes = `${timesTex(c, p)}${d === 0 ? "" : ` + ${timesTex(d, p * p)}`}`;
        return numberProblem({
          prompt: t(
            `A group $G$ of order $${powerTex(p, k)}$ has ${classes}, and every other class has one element. Find $|Z(G)|$.`,
            `$${powerTex(p, k)}$ 阶群 $G$ 有${classesZh}，其余共轭类都只有一个元素。求 $|Z(G)|$。`,
          ),
          answer: z,
          mistakes: apart(z, [
            why(
              c,
              `${c} is the number of classes of size ${p}, not the number of central elements.`,
              `${c} 是大小为 ${p} 的类的个数，不是中心元素的个数。`,
            ),
            why(
              c + d,
              "That counts the larger classes, not the elements left over for the center.",
              "这数的是较大的类，而不是留给中心的元素。",
            ),
            why(
              p,
              `${p} is only the smallest the center can be; subtract the class sizes from $${p ** k}$ to find it.`,
              `${p} 只是中心可能的最小值；要从 $${p ** k}$ 中减去各类的大小。`,
            ),
            why(
              z * p,
              `The class sizes add up to $${rest}$, which leaves $${p ** k} - ${rest} = ${z}$, not $${z * p}$.`,
              `各类大小之和是 $${rest}$，剩下 $${p ** k} - ${rest} = ${z}$，而不是 $${z * p}$。`,
            ),
            why(
              1,
              `A nontrivial ${p}-group has a center larger than $1$: ${p} divides $|Z(G)|$.`,
              `非平凡 ${p}-群的中心大于 $1$：${p} 整除 $|Z(G)|$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Add the larger classes", "求较大类的总大小"],
                t(`They hold $${sizes} = ${rest}$ elements.`, `它们共含 $${sizes} = ${rest}$ 个元素。`),
              ],
              [
                ["Subtract from the order", "从阶中减去"],
                t(
                  `The one-element classes are the central elements: $|Z(G)| = ${p ** k} - ${rest} = ${z}$.`,
                  `单元素共轭类恰为中心元素：$|Z(G)| = ${p ** k} - ${rest} = ${z}$。`,
                ),
              ],
            ],
            t(`$${z} + ${rest} = ${p ** k}$, the order of $G$.`, `$${z} + ${rest} = ${p ** k}$，正是 $G$ 的阶。`),
          ),
        });
      },
    },
  ],
};

/** theFirstSylowTheorem finds orders of Sylow subgroups and the prime-power subgroups a group must have. */
export const theFirstSylowTheorem: TopicDef = {
  id: "the-first-sylow-theorem",
  title: t("The First Sylow Theorem", "第一西罗定理"),
  summary: t(
    "If |G| = pᵏm with p prime and p ∤ m, then G has a subgroup of order pⁱ for every i ≤ k; those of order pᵏ are the Sylow p-subgroups. So the converse of Lagrange's theorem holds for prime powers, though not in general: A₄ has order 12 but no subgroup of order 6.",
    "若 |G| = pᵏm，p 为素数且 p ∤ m，则对每个 i ≤ k，G 都有 pⁱ 阶子群；pᵏ 阶子群称为西罗 p-子群。所以拉格朗日定理的逆对素数幂成立，但一般不成立：A₄ 的阶为 12，却没有 6 阶子群。",
  ),
  intro: t(
    "A group of order $200 = 2^3 \\cdot 5^2$ has Sylow $2$-subgroups of order $8$ and Sylow $5$-subgroups of order $25$. It also has subgroups of orders $2$, $4$ and $5$.\n\nCheck: $8 \\cdot 25 = 200$, and $\\frac{200}{8} = 25$ is odd while $\\frac{200}{25} = 8$ is not divisible by $5$.\n\nIn this lesson we find the orders of Sylow subgroups and the prime-power subgroups every group of a given order has.",
    "$200 = 2^3 \\cdot 5^2$ 阶群的西罗 $2$-子群阶为 $8$，西罗 $5$-子群阶为 $25$。它还有 $2$、$4$、$5$ 阶子群。\n\n检验：$8 \\cdot 25 = 200$，$\\frac{200}{8} = 25$ 是奇数，$\\frac{200}{25} = 8$ 不被 $5$ 整除。\n\n本课我们求西罗子群的阶，以及给定阶的每个群都有的素数幂阶子群。",
  ),
  prerequisites: ["p-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orders-of-sylow-subgroups",
      title: t("Orders of Sylow subgroups", "西罗子群的阶"),
      explanation: t(
        "A Sylow subgroup has the largest power of the prime that divides the group order, so read it off the prime factorization. $|G| = 360 = 2^3 \\cdot 3^2 \\cdot 5$, so the Sylow $3$-subgroups of $G$ have order $9$.\n\nFor $|G| = 5040 = 2^4 \\cdot 3^2 \\cdot 5 \\cdot 7$, the Sylow $2$-subgroups have order $16$.\n\nCheck: $\\frac{5040}{16} = 315$ is odd, so no larger power of $2$ divides $5040$.\n\n> **Watch out.** The order is the power, not the exponent: for $|G| = 360$ the Sylow $2$-subgroups have order $2^3 = 8$, not $3$.",
        "西罗子群的阶是整除群阶的该素数的最高次幂，所以从素因数分解中直接读出。$|G| = 360 = 2^3 \\cdot 3^2 \\cdot 5$，所以 $G$ 的西罗 $3$-子群的阶为 $9$。\n\n对 $|G| = 5040 = 2^4 \\cdot 3^2 \\cdot 5 \\cdot 7$，西罗 $2$-子群的阶为 $16$。\n\n检验：$\\frac{5040}{16} = 315$ 是奇数，所以没有更高的 $2$ 的幂整除 $5040$。\n\n> **注意。** 阶是幂本身，不是指数：$|G| = 360$ 时西罗 $2$-子群的阶是 $2^3 = 8$，而不是 $3$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(12, 1000);
        while (primesOf(n).length < 2);
        const p = rng.pick(primesOf(n));
        const value = sylowOrder(n, p);
        const exponent = Math.round(Math.log(value) / Math.log(p));
        return numberProblem({
          prompt: t(
            `A group $G$ has order $${n}$. What is the order of a Sylow $${p}$-subgroup of $G$?`,
            `群 $G$ 的阶为 $${n}$。$G$ 的西罗 $${p}$-子群的阶是多少？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              p,
              `A Sylow subgroup takes the whole power of ${p} in $${n}$, not a single factor.`,
              `西罗子群取 $${n}$ 中 ${p} 的全部幂，而不只是一个因子。`,
            ),
            why(
              n / value,
              `That is the part of $${n}$ coprime to ${p}, the index of a Sylow subgroup.`,
              `那是 $${n}$ 中与 ${p} 互素的部分，即西罗子群的指数。`,
            ),
            why(
              value * p,
              `$${value * p}$ does not divide $${n}$, so no subgroup has that order.`,
              `$${value * p}$ 不整除 $${n}$，所以没有这个阶的子群。`,
            ),
            why(
              exponent,
              `${exponent} is the exponent of ${p}; the order is the power itself.`,
              `${exponent} 是 ${p} 的指数；阶是幂本身。`,
            ),
          ]),
          solution: walked(
            [
              [["Factor the order", "分解阶"], t(`$${n} = ${factorTex(n)}$.`, `$${n} = ${factorTex(n)}$。`)],
              [
                ["Read off the power", "读出幂"],
                t(`The largest power of $${p}$ dividing $${n}$ is $${value}$.`, `整除 $${n}$ 的 $${p}$ 的最高次幂为 $${value}$。`),
              ],
            ],
            t(
              `$\\frac{${n}}{${value}} = ${n / value}$ is not divisible by ${p}, so no larger power of ${p} divides $${n}$.`,
              `$\\frac{${n}}{${value}} = ${n / value}$ 不被 ${p} 整除，所以没有更高的 ${p} 的幂整除 $${n}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "subgroups-guaranteed-by-sylow",
      title: t("Guaranteed subgroups", "必然存在的子群"),
      explanation: t(
        "Every group of order $72 = 2^3 \\cdot 3^2$ has subgroups of orders $2, 4, 8, 3, 9$. The theorem says nothing about orders $6$ or $12$, which are not prime powers.\n\nEvery group of order $1000 = 2^3 \\cdot 5^3$ has subgroups of orders $2, 4, 8, 5, 25$ and $125$.\n\nCheck: each of these is a power of $2$ or of $5$ that divides $1000$, since $8 \\cdot 125 = 1000$.\n\n> **Watch out.** For orders that are not prime powers, a subgroup may really be missing: $A_4$ has order $12$ but no subgroup of order $6$.",
        "每个 $72 = 2^3 \\cdot 3^2$ 阶群都有 $2, 4, 8, 3, 9$ 阶子群。对 $6$ 或 $12$ 这样不是素数幂的阶，定理没有结论。\n\n每个 $1000 = 2^3 \\cdot 5^3$ 阶群都有 $2, 4, 8, 5, 25, 125$ 阶子群。\n\n检验：这些都是整除 $1000$ 的 $2$ 的幂或 $5$ 的幂，因为 $8 \\cdot 125 = 1000$。\n\n> **注意。** 对不是素数幂的阶，子群可能真的不存在：$A_4$ 的阶为 $12$，却没有 $6$ 阶子群。",
      ),
      generate(rng) {
        let n: number;
        let others: number[];
        do {
          n = rng.int(24, 600);
          others = divisors(n).filter((d) => d > 1 && d < n && !isPrimePower(d));
        } while (primesOf(n).length < 2 || others.length < 3);
        const right = rng.pick(divisors(n).filter((d) => isPrimePower(d) && d > 2));
        const prime = primesOf(right).length === 1 && primesOf(right)[0] === right;
        return reasoned(
          texChoice(
            rng,
            t(
              `For which of these orders does the first Sylow theorem guarantee that every group of order $${n}$ has a subgroup?`,
              `第一西罗定理保证每个 $${n}$ 阶群都有下列哪个阶的子群？`,
            ),
            `${right}`,
            rng.sample(others, 3).map(String),
            walked(
              [
                [["Factor the order", "分解阶"], t(`$${n} = ${factorTex(n)}$.`, `$${n} = ${factorTex(n)}$。`)],
                [
                  ["Find the prime power", "找出素数幂"],
                  prime
                    ? t(
                        `$${right}$ is a prime dividing $${n}$, so the first Sylow theorem guarantees a subgroup of order $${right}$.`,
                        `$${right}$ 是整除 $${n}$ 的素数，所以第一西罗定理保证存在 $${right}$ 阶子群。`,
                      )
                    : t(
                        `$${right} = ${factorTex(right)}$ is a power of a prime dividing $${n}$, so the first Sylow theorem guarantees a subgroup of order $${right}$.`,
                        `$${right} = ${factorTex(right)}$ 是整除 $${n}$ 的素数的幂，所以第一西罗定理保证存在 $${right}$ 阶子群。`,
                      ),
                ],
              ],
              t(
                `$\\frac{${n}}{${right}} = ${n / right}$ is a whole number, so $${right}$ divides $${n}$.`,
                `$\\frac{${n}}{${right}} = ${n / right}$ 是整数，所以 $${right}$ 整除 $${n}$。`,
              ),
            ),
          ),
          others.map((d) =>
            because(
              `${d}`,
              `$${d} = ${factorTex(d)}$ is not a prime power, so the theorem says nothing about it.`,
              `$${d} = ${factorTex(d)}$ 不是素数幂，所以定理对它没有结论。`,
            ),
          ),
        );
      },
    },
  ],
};

/** dihedralSylowCount is the number of Sylow p-subgroups of the dihedral group Dₙ of order 2n. */
function dihedralSylowCount(n: number, p: number): number {
  if (p !== 2) return 1;
  let m = n;
  while (m % 2 === 0) m /= 2;
  return m;
}

/** KNOWN_SYLOW_COUNTS are numbers of Sylow subgroups of some small groups. */
const KNOWN_SYLOW_COUNTS: readonly [string, number, number, number][] = [
  ["S_3", 6, 2, 3],
  ["S_3", 6, 3, 1],
  ["A_4", 12, 2, 1],
  ["A_4", 12, 3, 4],
  ["S_4", 24, 2, 3],
  ["S_4", 24, 3, 4],
  ["A_5", 60, 2, 5],
  ["A_5", 60, 3, 10],
  ["A_5", 60, 5, 6],
  ["S_5", 120, 3, 10],
  ["S_5", 120, 5, 6],
  ["S_5", 120, 2, 15],
];

/** knownSylowReason says why a group of KNOWN_SYLOW_COUNTS has its number of Sylow p-subgroups. */
function knownSylowReason(name: string, p: number): Text {
  const key = `${name} ${p}`;
  if (key === "S_3 2")
    return t("Each of the $3$ transpositions generates its own subgroup of order $2$.", "$3$ 个对换各生成一个 $2$ 阶子群。");
  if (key === "S_3 3")
    return t("$A_3$ holds both $3$-cycles, so it is the only subgroup of order $3$.", "$A_3$ 含两个 $3$-轮换，所以它是唯一的 $3$ 阶子群。");
  if (key === "A_4 2")
    return t(
      "The Klein group $V$ is normal in $A_4$, so it is the only subgroup of order $4$.",
      "克莱因群 $V$ 在 $A_4$ 中正规，所以它是唯一的 $4$ 阶子群。",
    );
  if (key === "S_4 2")
    return t(
      "Each Sylow $2$-subgroup is a dihedral group of order $8$, one for each of the $3$ ways to split the four points into two pairs.",
      "每个西罗 $2$-子群都是 $8$ 阶二面体群，四个点分成两对的 $3$ 种分法各对应一个。",
    );
  if (key === "A_5 2")
    return t(
      "Each Sylow $2$-subgroup is a Klein group fixing one of the $5$ points, one for each point.",
      "每个西罗 $2$-子群都是固定 $5$ 个点之一的克莱因群，每个点对应一个。",
    );
  if (key === "S_5 2")
    return t(
      "Each Sylow $2$-subgroup is a dihedral group of order $8$ on four points, fixing the fifth: $5$ choices of the fixed point, with $3$ subgroups for each.",
      "每个西罗 $2$-子群都是作用在四个点上、固定第五个点的 $8$ 阶二面体群：固定点有 $5$ 种选法，每种对应 $3$ 个子群。",
    );
  if (p === 3)
    return name === "A_4" || name === "S_4"
      ? t(
          "The $8$ three-cycles fall into subgroups of order $3$, two in each, which makes $4$.",
          "$8$ 个 $3$-轮换分属各个 $3$ 阶子群，每个含两个，共 $4$ 个。",
        )
      : t(
          "The $20$ three-cycles fall into subgroups of order $3$, two in each, which makes $10$.",
          "$20$ 个 $3$-轮换分属各个 $3$ 阶子群，每个含两个，共 $10$ 个。",
        );
  return t(
    "The $24$ five-cycles fall into subgroups of order $5$, four in each, which makes $6$.",
    "$24$ 个 $5$-轮换分属各个 $5$ 阶子群，每个含四个，共 $6$ 个。",
  );
}

/** theSecondSylowTheorem counts Sylow subgroups of familiar groups and sizes their normalizers. */
export const theSecondSylowTheorem: TopicDef = {
  id: "the-second-sylow-theorem",
  title: t("The Second Sylow Theorem", "第二西罗定理"),
  summary: t(
    "Any two Sylow $p$-subgroups of a finite group are conjugate, and every $p$-subgroup lies in some Sylow $p$-subgroup. So $G$ acts transitively on its Sylow $p$-subgroups by conjugation, and their number is $n_p = [G : N(P)]$. In particular a Sylow $p$-subgroup is normal exactly when it is the only one.",
    "有限群的任意两个西罗 $p$-子群共轭，且每个 $p$-子群都包含在某个西罗 $p$-子群中。所以 $G$ 通过共轭传递地作用于它的西罗 $p$-子群，其个数为 $n_p = [G : N(P)]$。特别地，西罗 $p$-子群正规当且仅当它是唯一的。",
  ),
  intro: t(
    "$S_4$ has order $24$ and $4$ Sylow $3$-subgroups. They are all conjugate, so $4 = [S_4 : N(P)]$ and $|N(P)| = \\frac{24}{4} = 6$.\n\nCheck: $N(P)$ contains $P$, and $6$ is a multiple of $|P| = 3$.\n\nIn this lesson we count the Sylow subgroups of familiar groups and find the orders of their normalizers.",
    "$S_4$ 的阶为 $24$，有 $4$ 个西罗 $3$-子群。它们彼此共轭，所以 $4 = [S_4 : N(P)]$，$|N(P)| = \\frac{24}{4} = 6$。\n\n检验：$N(P)$ 包含 $P$，而 $6$ 是 $|P| = 3$ 的倍数。\n\n本课我们数常见群的西罗子群，并求它们的正规化子的阶。",
  ),
  prerequisites: ["the-first-sylow-theorem", "conjugacy-of-group-subsets-and-subgroups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-sylow-subgroups-of-familiar-groups",
      title: t("Sylow subgroups of familiar groups", "常见群的西罗子群"),
      explanation: t(
        "In $D_{6}$ of order $12$, the Sylow $2$-subgroups have order $4$; each is $\\{e, r^3, r^ks, r^{k+3}s\\}$, so there are $3$. The Sylow $3$-subgroup $\\langle r^2 \\rangle$ is unique, hence normal.\n\nIn $D_{40}$ of order $80$, the Sylow $2$-subgroups have order $16$. Each is $\\langle r^5, r^ks \\rangle$, with one for each $k$ modulo $5$, so there are $5$.\n\nCheck: $5$ is odd and divides $\\frac{80}{16} = 5$, as the third Sylow theorem requires.\n\n> **Watch out.** The divisibility conditions only narrow the count down: in $A_5$ they allow $n_5 = 1$ or $6$, and the actual $6$ comes from counting the $24$ five-cycles.",
        "在 $12$ 阶的 $D_{6}$ 中，西罗 $2$-子群的阶为 $4$，形如 $\\{e, r^3, r^ks, r^{k+3}s\\}$，共 $3$ 个。西罗 $3$-子群 $\\langle r^2 \\rangle$ 唯一，因而正规。\n\n在 $80$ 阶的 $D_{40}$ 中，西罗 $2$-子群的阶为 $16$。每个都是 $\\langle r^5, r^ks \\rangle$，每个模 $5$ 的 $k$ 对应一个，共 $5$ 个。\n\n检验：$5$ 是奇数且整除 $\\frac{80}{16} = 5$，符合第三西罗定理。\n\n> **注意。** 整除条件只能缩小范围：在 $A_5$ 中它们允许 $n_5 = 1$ 或 $6$，实际的 $6$ 来自数 $24$ 个 $5$-轮换。",
      ),
      generate(rng) {
        let name: string;
        let order: number;
        let p: number;
        let value: number;
        if (rng.bool(0.6)) {
          const n = rng.int(3, 30);
          p = rng.pick(primesOf(2 * n));
          [name, order, value] = [`D_{${n}}`, 2 * n, dihedralSylowCount(n, p)];
        } else [name, order, p, value] = rng.pick(KNOWN_SYLOW_COUNTS);
        const allowed = sylowCounts(order, p);
        const power = sylowOrder(order, p);
        const identify = name.startsWith("D")
          ? p === 2
            ? value === 1
              ? t(
                  `$${order}$ is a power of $2$, so $${name}$ itself is its only Sylow $2$-subgroup.`,
                  `$${order}$ 是 $2$ 的幂，所以 $${name}$ 本身就是它唯一的西罗 $2$-子群。`,
                )
              : power === 2
                ? t(
                    `A Sylow $2$-subgroup has order $2$, so it is $\\{e, r^ks\\}$ for one of the $${value}$ reflections: $${value}$ in all.`,
                    `西罗 $2$-子群的阶为 $2$，所以它是 $\\{e, r^ks\\}$，对应 $${value}$ 个反射之一：共 $${value}$ 个。`,
                  )
                : t(
                    `A Sylow $2$-subgroup is $\\langle r^{${value}}, r^ks \\rangle$ of order $${power}$, containing the reflections $r^js$ with $j \\equiv k \\pmod{${value}}$. So there is one for each $k$ modulo $${value}$: $${value}$ in all.`,
                    `西罗 $2$-子群为 $\\langle r^{${value}}, r^ks \\rangle$，阶为 $${power}$，含满足 $j \\equiv k \\pmod{${value}}$ 的反射 $r^js$。所以每个模 $${value}$ 的 $k$ 对应一个：共 $${value}$ 个。`,
                  )
            : t(
                `The Sylow $${p}$-subgroup consists of rotations, and the rotation group is cyclic, so it is unique.`,
                `西罗 $${p}$-子群由旋转组成，而旋转群是循环群，所以它唯一。`,
              )
          : knownSylowReason(name, p);
        return numberProblem({
          prompt: t(
            `How many Sylow $${p}$-subgroups does $${name}$ (of order $${order}$) have?`,
            `$${name}$（阶为 $${order}$）有多少个西罗 $${p}$-子群？`,
          ),
          answer: value,
          mistakes: apart(value, [
            ...allowed.map((x) =>
              why(
                x,
                `The third Sylow theorem allows ${x}, but it does not decide the count; the structure of $${name}$ does.`,
                `第三西罗定理允许 ${x}，但它不决定个数；决定个数的是 $${name}$ 的结构。`,
              ),
            ),
            why(
              power,
              `${power} is the order of one Sylow subgroup, not how many there are.`,
              `${power} 是一个西罗子群的阶，不是它们的个数。`,
            ),
            why(
              order / power,
              `${order / power} is the index of a Sylow subgroup; the number of Sylow subgroups only divides it.`,
              `${order / power} 是西罗子群的指数；西罗子群的个数只是整除它。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["List the allowed counts", "列出允许的个数"],
                t(
                  `The third Sylow theorem allows $n_{${p}} = ${allowed.join(", ")}$.`,
                  `第三西罗定理允许 $n_{${p}} = ${allowed.join(", ")}$。`,
                ),
              ],
              [["Use the structure", "利用结构"], identify],
            ],
            t(
              `$${value}$ divides $${order / power}$ and leaves remainder $1$ on division by ${p}, as it must.`,
              `$${value}$ 整除 $${order / power}$，且除以 ${p} 余 $1$，理应如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "normalizers-of-sylow-subgroups",
      title: t("Normalizers of Sylow subgroups", "西罗子群的正规化子"),
      explanation: t(
        "All Sylow subgroups for one prime are conjugate, so their number equals the index of the normalizer of any one of them. $A_5$ has order $60$ and $6$ Sylow $5$-subgroups. They are all conjugate, so $6 = [A_5 : N(P)]$ and $|N(P)| = 10$.\n\n$S_6$ has order $720$ and $36$ Sylow $5$-subgroups, since its $144$ five-cycles fall four to a subgroup. So $|N(P)| = \\frac{720}{36} = 20$.\n\nCheck: $20$ is a multiple of $|P| = 5$, as it must be since $P$ lies in $N(P)$.\n\n> **Watch out.** The count is an index, so divide: $|N(P)| = \\frac{|G|}{n_p}$, not $|G| - n_p$.",
        "同一个素数的所有西罗子群都共轭，所以它们的个数等于其中任一个的正规化子的指数。$A_5$ 的阶为 $60$，有 $6$ 个西罗 $5$-子群。它们彼此共轭，所以 $6 = [A_5 : N(P)]$，$|N(P)| = 10$。\n\n$S_6$ 的阶为 $720$，有 $36$ 个西罗 $5$-子群，因为它的 $144$ 个 $5$-轮换每四个属于一个子群。所以 $|N(P)| = \\frac{720}{36} = 20$。\n\n检验：$20$ 是 $|P| = 5$ 的倍数，理应如此，因为 $P$ 包含于 $N(P)$。\n\n> **注意。** 个数是指数，所以要相除：$|N(P)| = \\frac{|G|}{n_p}$，而不是 $|G| - n_p$。",
      ),
      generate(rng) {
        let n: number;
        let p: number;
        let allowed: number[];
        do {
          n = rng.int(12, 400);
          p = rng.pick(primesOf(n));
          allowed = sylowCounts(n, p).filter((x) => x > 1);
        } while (primesOf(n).length < 2 || allowed.length === 0);
        const np = rng.pick(allowed);
        const value = n / np;
        const power = sylowOrder(n, p);
        return numberProblem({
          prompt: t(
            `A group $G$ of order $${n}$ has $${np}$ Sylow $${p}$-subgroups. What is the order of the normalizer of one of them?`,
            `$${n}$ 阶群 $G$ 有 $${np}$ 个西罗 $${p}$-子群。其中一个的正规化子的阶是多少？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              power,
              `$P$ lies in $N(P)$, but $N(P)$ has index ${np}, so it is larger than $P$.`,
              `$P$ 包含于 $N(P)$，但 $N(P)$ 的指数是 ${np}，所以它比 $P$ 大。`,
            ),
            why(
              n - np,
              "The count is an index, so divide the order by it rather than subtract.",
              "个数是指数，所以要用它去除阶，而不是相减。",
            ),
            why(
              np * power,
              `The order of $N(P)$ is $${n}$ divided by ${np}, not ${np} times $|P|$.`,
              `$N(P)$ 的阶是 $${n}$ 除以 ${np}，而不是 ${np} 乘以 $|P|$。`,
            ),
            why(
              n / power,
              `${n / power} is the index of $P$; the index of $N(P)$ is ${np}.`,
              `${n / power} 是 $P$ 的指数；$N(P)$ 的指数是 ${np}。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Use conjugation", "利用共轭"],
                t(
                  `$G$ acts transitively on its Sylow $${p}$-subgroups by conjugation, with stabilizer $N(P)$, so $${np} = [G : N(P)]$.`,
                  `$G$ 通过共轭传递地作用于它的西罗 $${p}$-子群，稳定子为 $N(P)$，所以 $${np} = [G : N(P)]$。`,
                ),
              ],
              [["Divide", "相除"], t(`$|N(P)| = \\frac{${n}}{${np}} = ${value}$.`, `$|N(P)| = \\frac{${n}}{${np}} = ${value}$。`)],
            ],
            t(
              `$${value}$ is a multiple of $|P| = ${power}$, as it must be since $P$ lies in $N(P)$.`,
              `$${value}$ 是 $|P| = ${power}$ 的倍数，理应如此，因为 $P$ 包含于 $N(P)$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theThirdSylowTheorem finds the possible numbers of Sylow subgroups. */
export const theThirdSylowTheorem: TopicDef = {
  id: "the-third-sylow-theorem",
  title: t("The Third Sylow Theorem", "第三西罗定理"),
  summary: t(
    "If $|G| = p^k m$ with $p \\nmid m$, the number $n_p$ of Sylow $p$-subgroups satisfies $n_p \\equiv 1 \\pmod{p}$ and $n_p \\mid m$. When these force $n_p = 1$, the Sylow $p$-subgroup is normal, so $G$ is not simple; for example every group of order $15$ has normal subgroups of orders $5$ and $3$, and is cyclic.",
    "若 $|G| = p^k m$ 且 $p \\nmid m$，则西罗 $p$-子群的个数 $n_p$ 满足 $n_p \\equiv 1 \\pmod{p}$ 且 $n_p \\mid m$。当这些条件迫使 $n_p = 1$ 时，西罗 $p$-子群正规，$G$ 不是单群；例如每个 $15$ 阶群都有 $5$ 阶与 $3$ 阶正规子群，并且是循环群。",
  ),
  intro: t(
    "In a group of order $35 = 5 \\cdot 7$, $n_7$ divides $5$ and is $\\equiv 1 \\pmod 7$, so $n_7 = 1$. Likewise $n_5$ divides $7$ and is $\\equiv 1 \\pmod 5$, so $n_5 = 1$.\n\nCheck: the only other divisors, $5$ and $7$, leave remainders $5$ and $2$ on division by $7$ and $5$.\n\nIn this lesson we list the possible numbers of Sylow subgroups and decide when they force a normal one.",
    "在 $35 = 5 \\cdot 7$ 阶群中，$n_7$ 整除 $5$ 且 $\\equiv 1 \\pmod 7$，所以 $n_7 = 1$。同样，$n_5$ 整除 $7$ 且 $\\equiv 1 \\pmod 5$，所以 $n_5 = 1$。\n\n检验：其余的因数 $5$ 和 $7$ 分别除以 $7$ 和 $5$，余数是 $5$ 和 $2$。\n\n本课我们列出西罗子群个数的可能值，并判断它们何时迫使西罗子群正规。",
  ),
  prerequisites: ["the-second-sylow-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "possible-numbers-of-sylow-subgroups",
      title: t("Possible values of n_p", "n_p 的可能取值"),
      explanation: t(
        "The number of Sylow subgroups divides the part of the order coprime to the prime and leaves remainder one when divided by the prime. For $|G| = 60 = 2^2 \\cdot 15$, $n_2$ divides $15$ and is odd: $1, 3, 5, 15$. For $p = 5$, $n_5$ divides $12$ and is $\\equiv 1 \\pmod 5$: $1$ or $6$.\n\nFor $|G| = 1000 = 2^3 \\cdot 125$, $n_2$ divides $125$ and is odd, so it is $1$, $5$, $25$ or $125$.\n\nCheck: $125 = 5^3$ has exactly the divisors $1, 5, 25, 125$, all odd.\n\n> **Watch out.** Both conditions are needed: for $|G| = 24 = 8 \\cdot 3$, $7 \\equiv 1 \\pmod 3$ but $7$ does not divide $8$, and $2$ divides $8$ but $2 \\not\\equiv 1 \\pmod 3$. Only $1$ and $4$ remain for $n_3$.",
        "西罗子群的个数整除群阶中与该素数互素的部分，而且除以该素数余 1。对 $|G| = 60 = 2^2 \\cdot 15$，$n_2$ 整除 $15$ 且为奇数：$1, 3, 5, 15$。对 $p = 5$，$n_5$ 整除 $12$ 且 $\\equiv 1 \\pmod 5$：$1$ 或 $6$。\n\n对 $|G| = 1000 = 2^3 \\cdot 125$，$n_2$ 整除 $125$ 且为奇数，所以是 $1$、$5$、$25$ 或 $125$。\n\n检验：$125 = 5^3$ 的因数恰为 $1, 5, 25, 125$，都是奇数。\n\n> **注意。** 两个条件缺一不可：对 $|G| = 24 = 8 \\cdot 3$，$7 \\equiv 1 \\pmod 3$ 但 $7$ 不整除 $8$；$2$ 整除 $8$ 但 $2 \\not\\equiv 1 \\pmod 3$。$n_3$ 只剩 $1$ 和 $4$。",
      ),
      generate(rng) {
        let n: number;
        let p: number;
        let allowed: number[];
        let bad: number[];
        do {
          n = rng.int(20, 600);
          p = rng.pick(primesOf(n));
          allowed = sylowCounts(n, p).filter((x) => x > 1);
          const m = n / sylowOrder(n, p);
          bad = [
            ...divisors(m).filter((d) => d % p !== 1),
            ...range(1, 8)
              .map((j) => j * p + 1)
              .filter((x) => m % x !== 0),
          ];
        } while (primesOf(n).length < 2 || allowed.length === 0);
        const right = rng.pick(allowed);
        const m = n / sylowOrder(n, p);
        const reasons: Reason[] = bad.map((x) =>
          m % x === 0
            ? because(
                `${x}`,
                `${x} divides $${m}$, but it leaves remainder ${x % p} on division by ${p}, not $1$.`,
                `${x} 整除 $${m}$，但它除以 ${p} 余 ${x % p}，而不是 $1$。`,
              )
            : because(
                `${x}`,
                `${x} leaves remainder $1$ on division by ${p}, but it does not divide $${m}$.`,
                `${x} 除以 ${p} 余 $1$，但它不整除 $${m}$。`,
              ),
        );
        return reasoned(
          texChoice(
            rng,
            t(
              `A group $G$ has order $${n}$. Which of these could be the number of Sylow $${p}$-subgroups of $G$?`,
              `群 $G$ 的阶为 $${n}$。下列哪个可能是 $G$ 的西罗 $${p}$-子群的个数？`,
            ),
            `${right}`,
            rng.shuffle(bad.filter((x) => x > 1)).map(String),
            walked(
              [
                [
                  ["Split off the power of the prime", "分出素数的幂"],
                  t(
                    `$${n} = ${sylowOrder(n, p)} \\cdot ${m}$, so $n_{${p}}$ divides $${m}$ and is $\\equiv 1 \\pmod{${p}}$.`,
                    `$${n} = ${sylowOrder(n, p)} \\cdot ${m}$，所以 $n_{${p}}$ 整除 $${m}$ 且 $\\equiv 1 \\pmod{${p}}$。`,
                  ),
                ],
                [
                  ["List the allowed values", "列出允许的值"],
                  t(
                    `The divisors of $${m}$ that leave remainder $1$ are $${sylowCounts(n, p).join(", ")}$. Of the options, only $${right}$ qualifies.`,
                    `$${m}$ 的因数中余 $1$ 的是 $${sylowCounts(n, p).join(", ")}$。选项中只有 $${right}$ 满足。`,
                  ),
                ],
              ],
              t(
                `$\\frac{${m}}{${right}} = ${m / right}$, and $${right} - 1 = ${right - 1}$ is a multiple of ${p}.`,
                `$\\frac{${m}}{${right}} = ${m / right}$，且 $${right} - 1 = ${right - 1}$ 是 ${p} 的倍数。`,
              ),
            ),
          ),
          reasons,
        );
      },
    },
    {
      id: "forced-normal-sylow-subgroups",
      title: t("Forced normal Sylow subgroups", "必然正规的西罗子群"),
      explanation: t(
        "In a group of order $45 = 3^2 \\cdot 5$, $n_5$ divides $9$ and is $\\equiv 1 \\pmod 5$, so $n_5 = 1$: the Sylow $5$-subgroup is normal. $n_3$ divides $5$ and is $\\equiv 1 \\pmod 3$, so $n_3 = 1$ too.\n\nIn a group of order $1001 = 7 \\cdot 11 \\cdot 13$, $n_{13}$ divides $77$, whose divisors are $1, 7, 11, 77$. Only $1$ leaves remainder $1$ on division by $13$, so the Sylow $13$-subgroup is normal.\n\nCheck: $7$, $11$ and $77 = 5 \\cdot 13 + 12$ leave remainders $7$, $11$ and $12$.\n\n> **Watch out.** When the conditions allow several values, the theorem does not force normality, but it does not rule it out either: a cyclic group of any order has normal Sylow subgroups.",
        "在 $45 = 3^2 \\cdot 5$ 阶群中，$n_5$ 整除 $9$ 且 $\\equiv 1 \\pmod 5$，所以 $n_5 = 1$：西罗 $5$-子群正规。$n_3$ 整除 $5$ 且 $\\equiv 1 \\pmod 3$，所以也有 $n_3 = 1$。\n\n在 $1001 = 7 \\cdot 11 \\cdot 13$ 阶群中，$n_{13}$ 整除 $77$，而 $77$ 的因数是 $1, 7, 11, 77$。其中只有 $1$ 除以 $13$ 余 $1$，所以西罗 $13$-子群正规。\n\n检验：$7$、$11$ 和 $77 = 5 \\cdot 13 + 12$ 的余数分别是 $7$、$11$、$12$。\n\n> **注意。** 条件允许多个值时，定理不能迫使西罗子群正规，但也不排除这种可能：任何阶的循环群的西罗子群都正规。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(10, 500);
        while (primesOf(n).length < 2);
        const p = rng.pick(primesOf(n));
        const allowed = sylowCounts(n, p);
        const m = n / sylowOrder(n, p);
        const holds = allowed.length === 1;
        const other = allowed[1] ?? 1;
        return decide({
          prompt: t(
            `For a group of order $${n}$, do the conditions of the third Sylow theorem force $n_{${p}} = 1$, so that the Sylow $${p}$-subgroup is normal?`,
            `对 $${n}$ 阶群，第三西罗定理的条件是否迫使 $n_{${p}} = 1$，从而西罗 $${p}$-子群正规？`,
          ),
          holds,
          steps: [
            [
              ["Split off the power of the prime", "分出素数的幂"],
              t(
                `$${n} = ${sylowOrder(n, p)} \\cdot ${m}$, so $n_{${p}}$ divides $${m}$ and is $\\equiv 1 \\pmod{${p}}$.`,
                `$${n} = ${sylowOrder(n, p)} \\cdot ${m}$，所以 $n_{${p}}$ 整除 $${m}$ 且 $\\equiv 1 \\pmod{${p}}$。`,
              ),
            ],
            [
              ["Test the divisors", "检验各因数"],
              holds
                ? t(
                    `Of the divisors $${divisors(m).join(", ")}$, only $1$ leaves remainder $1$ on division by ${p}, so $n_{${p}} = 1$.`,
                    `在因数 $${divisors(m).join(", ")}$ 中，只有 $1$ 除以 ${p} 余 $1$，所以 $n_{${p}} = 1$。`,
                  )
                : t(
                    `The conditions allow $n_{${p}} = ${allowed.join(", ")}$, so they do not force $n_{${p}} = 1$.`,
                    `条件允许 $n_{${p}} = ${allowed.join(", ")}$，所以它们不能迫使 $n_{${p}} = 1$。`,
                  ),
            ],
          ],
          check: holds
            ? t(
                `Every divisor of $${m}$ other than $1$ leaves a remainder other than $1$ on division by ${p}.`,
                `$${m}$ 除 $1$ 以外的每个因数除以 ${p} 的余数都不是 $1$。`,
              )
            : t(
                `$\\frac{${m}}{${other}} = ${m / other}$, and $${other} - 1 = ${other - 1}$ is a multiple of ${p}.`,
                `$\\frac{${m}}{${other}} = ${m / other}$，且 $${other} - 1 = ${other - 1}$ 是 ${p} 的倍数。`,
              ),
          wrong: holds
            ? t(
                `No divisor of $${m}$ other than $1$ is $\\equiv 1 \\pmod{${p}}$, so the conditions do force $n_{${p}} = 1$.`,
                `$${m}$ 除 $1$ 以外没有因数 $\\equiv 1 \\pmod{${p}}$，所以条件确实迫使 $n_{${p}} = 1$。`,
              )
            : t(
                `$${other}$ also divides $${m}$ and is $\\equiv 1 \\pmod{${p}}$, so the conditions do not force $n_{${p}} = 1$.`,
                `$${other}$ 也整除 $${m}$ 且 $\\equiv 1 \\pmod{${p}}$，所以条件不能迫使 $n_{${p}} = 1$。`,
              ),
        });
      },
    },
  ],
};

/** abstractAlgebraSylowTopics are the topics of Abstract Algebra unit 7. */
export const abstractAlgebraSylowTopics: readonly TopicDef[] = [pGroups, theFirstSylowTheorem, theSecondSylowTheorem, theThirdSylowTheorem];
