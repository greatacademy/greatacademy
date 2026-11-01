import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem } from "../problems.ts";
import { divisors, factProblem, texChoice } from "./abstract-algebra-common.ts";
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

/** pGroups recognizes p-groups and uses the class equation to find their centers. */
export const pGroups: TopicDef = {
  id: "p-groups",
  title: t("P-Groups", "p-群"),
  summary: t(
    "A p-group is a group whose order is a power of a prime p. Every conjugacy class of a p-group has size a power of p, so the class equation |G| = |Z(G)| + Σ [G : C(xᵢ)] forces p to divide |Z(G)|: a nontrivial p-group has a nontrivial center. Consequently every group of order p² is abelian.",
    "阶为素数 p 的幂的群称为 p-群。p-群的每个共轭类大小都是 p 的幂，所以类方程 |G| = |Z(G)| + Σ [G : C(xᵢ)] 迫使 p 整除 |Z(G)|：非平凡 p-群的中心非平凡。由此，每个 p² 阶群都是阿贝尔群。",
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
        "A group of order $243 = 3^5$ is a $3$-group. A group of order $200 = 2^3 \\cdot 5^2$ is not a $p$-group, though it contains $2$-subgroups and $5$-subgroups.",
        "$243 = 3^5$ 阶群是 $3$-群。$200 = 2^3 \\cdot 5^2$ 阶群不是 $p$-群，尽管它含有 $2$-子群与 $5$-子群。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7, 11, 13]);
        const n = rng.bool()
          ? p ** rng.int(2, p === 2 ? 9 : p === 3 ? 5 : 3)
          : p ** rng.int(1, 3) * rng.pick([2, 3, 5, 7].filter((q) => q !== p)) * rng.int(1, 3);
        const holds = isPrimePower(n);
        return factProblem({
          prompt: t(`Is every group of order $${n}$ a $p$-group for some prime $p$?`, `是否每个 $${n}$ 阶群都是某个素数 $p$ 的 $p$-群？`),
          holds,
          reason: t(
            `$${n} = ${factorTex(n)}$${holds ? " is a prime power" : " has more than one prime factor"}.`,
            `$${n} = ${factorTex(n)}$ ${holds ? "是素数幂" : "有不止一个素因子"}。`,
          ),
        });
      },
    },
    {
      id: "centers-from-class-equations-of-p-groups",
      title: t("Centers of p-groups", "p-群的中心"),
      explanation: t(
        "If a group of order $27$ has $8$ conjugacy classes of size $3$ besides the central elements, then $|Z(G)| = 27 - 8 \\cdot 3 = 3$.",
        "若 $27$ 阶群除中心元素外有 $8$ 个大小为 $3$ 的共轭类，则 $|Z(G)| = 27 - 8 \\cdot 3 = 3$。",
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
        return numberProblem({
          prompt: t(
            `A group $G$ of order $${powerTex(p, k)}$ has ${classes}, and every other class has one element. Find $|Z(G)|$.`,
            `$${powerTex(p, k)}$ 阶群 $G$ 有${classesZh}，其余共轭类都只有一个元素。求 $|Z(G)|$。`,
          ),
          answer: z,
          wrong: [c, c + d, p, z * p, 1].filter((x) => x !== z),
          solution: t(
            `The one-element classes are the central elements: $|Z(G)| = ${p ** k} - ${c} \\cdot ${p}${d === 0 ? "" : ` - ${d} \\cdot ${p * p}`} = ${z}$.`,
            `单元素共轭类恰为中心元素：$|Z(G)| = ${p ** k} - ${c} \\cdot ${p}${d === 0 ? "" : ` - ${d} \\cdot ${p * p}`} = ${z}$。`,
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
  prerequisites: ["p-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "orders-of-sylow-subgroups",
      title: t("Orders of Sylow subgroups", "西罗子群的阶"),
      explanation: t(
        "$|G| = 360 = 2^3 \\cdot 3^2 \\cdot 5$, so the Sylow $3$-subgroups of $G$ have order $9$.",
        "$|G| = 360 = 2^3 \\cdot 3^2 \\cdot 5$，所以 $G$ 的西罗 $3$-子群的阶为 $9$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(12, 1000);
        while (primesOf(n).length < 2);
        const p = rng.pick(primesOf(n));
        const value = sylowOrder(n, p);
        return numberProblem({
          prompt: t(
            `A group $G$ has order $${n}$. What is the order of a Sylow $${p}$-subgroup of $G$?`,
            `群 $G$ 的阶为 $${n}$。$G$ 的西罗 $${p}$-子群的阶是多少？`,
          ),
          answer: value,
          wrong: [p, n / value, value * p, Math.round(Math.log(value) / Math.log(p))].filter((x) => x !== value),
          solution: t(
            `$${n} = ${factorTex(n)}$, so the largest power of $${p}$ dividing $${n}$ is $${value}$.`,
            `$${n} = ${factorTex(n)}$，所以整除 $${n}$ 的 $${p}$ 的最高次幂为 $${value}$。`,
          ),
        });
      },
    },
    {
      id: "subgroups-guaranteed-by-sylow",
      title: t("Guaranteed subgroups", "必然存在的子群"),
      explanation: t(
        "Every group of order $72 = 2^3 \\cdot 3^2$ has subgroups of orders $2, 4, 8, 3, 9$. The theorem says nothing about orders $6$ or $12$, which are not prime powers.",
        "每个 $72 = 2^3 \\cdot 3^2$ 阶群都有 $2, 4, 8, 3, 9$ 阶子群。对 $6$ 或 $12$ 这样不是素数幂的阶，定理没有结论。",
      ),
      generate(rng) {
        let n: number;
        let others: number[];
        do {
          n = rng.int(24, 600);
          others = divisors(n).filter((d) => d > 1 && d < n && !isPrimePower(d));
        } while (primesOf(n).length < 2 || others.length < 3);
        const right = rng.pick(divisors(n).filter((d) => isPrimePower(d) && d > 2));
        return texChoice(
          rng,
          t(
            `For which of these orders does the first Sylow theorem guarantee that every group of order $${n}$ has a subgroup?`,
            `第一西罗定理保证每个 $${n}$ 阶群都有下列哪个阶的子群？`,
          ),
          `${right}`,
          rng.sample(others, 3).map(String),
          t(
            `$${n} = ${factorTex(n)}$ and $${right}$ is a prime power dividing $${n}$, so the first Sylow theorem guarantees such a subgroup. The other orders are not prime powers, so the theorem says nothing about them.`,
            `$${n} = ${factorTex(n)}$，$${right}$ 是整除 $${n}$ 的素数幂，所以第一西罗定理保证存在这样的子群。其余各阶都不是素数幂，定理对它们没有结论。`,
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

/** theSecondSylowTheorem counts Sylow subgroups of familiar groups and sizes their normalizers. */
export const theSecondSylowTheorem: TopicDef = {
  id: "the-second-sylow-theorem",
  title: t("The Second Sylow Theorem", "第二西罗定理"),
  summary: t(
    "Any two Sylow p-subgroups of a finite group are conjugate, and every p-subgroup lies in some Sylow p-subgroup. So G acts transitively on its Sylow p-subgroups by conjugation, and their number is n_p = [G : N(P)]. In particular a Sylow p-subgroup is normal exactly when it is the only one.",
    "有限群的任意两个西罗 p-子群共轭，且每个 p-子群都包含在某个西罗 p-子群中。所以 G 通过共轭传递地作用于它的西罗 p-子群，其个数为 n_p = [G : N(P)]。特别地，西罗 p-子群正规当且仅当它是唯一的。",
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
        "In $D_{6}$ of order $12$, the Sylow $2$-subgroups have order $4$; each is $\\{e, r^3, r^ks, r^{k+3}s\\}$, so there are $3$. The Sylow $3$-subgroup $\\langle r^2 \\rangle$ is unique, hence normal.",
        "在 $12$ 阶的 $D_{6}$ 中，西罗 $2$-子群的阶为 $4$，形如 $\\{e, r^3, r^ks, r^{k+3}s\\}$，共 $3$ 个。西罗 $3$-子群 $\\langle r^2 \\rangle$ 唯一，因而正规。",
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
        return numberProblem({
          prompt: t(
            `How many Sylow $${p}$-subgroups does $${name}$ (of order $${order}$) have?`,
            `$${name}$（阶为 $${order}$）有多少个西罗 $${p}$-子群？`,
          ),
          answer: value,
          wrong: [...allowed.filter((x) => x !== value), sylowOrder(order, p), order / sylowOrder(order, p)].filter((x) => x !== value),
          solution: name.startsWith("D")
            ? p === 2
              ? t(
                  `With $${order / 2} = ${sylowOrder(order, 2) / 2} \\cdot ${value}$, a Sylow $2$-subgroup is $\\langle r^{${value}}, r^ks \\rangle$ of order $${sylowOrder(order, 2)}$, containing the reflections $r^js$ with $j \\equiv k \\pmod{${value}}$. So there is one for each $k$ modulo $${value}$: $${value}$ in all.`,
                  `由 $${order / 2} = ${sylowOrder(order, 2) / 2} \\cdot ${value}$，西罗 $2$-子群为 $\\langle r^{${value}}, r^ks \\rangle$，阶为 $${sylowOrder(order, 2)}$，含满足 $j \\equiv k \\pmod{${value}}$ 的反射 $r^js$。所以每个模 $${value}$ 的 $k$ 对应一个：共 $${value}$ 个。`,
                )
              : t(
                  `The Sylow $${p}$-subgroup consists of rotations, and the rotation group is cyclic, so it is unique.`,
                  `西罗 $${p}$-子群由旋转组成，而旋转群是循环群，所以它唯一。`,
                )
            : t(`$${name}$ has $${value}$ Sylow $${p}$-subgroups.`, `$${name}$ 有 $${value}$ 个西罗 $${p}$-子群。`),
        });
      },
    },
    {
      id: "normalizers-of-sylow-subgroups",
      title: t("Normalizers of Sylow subgroups", "西罗子群的正规化子"),
      explanation: t(
        "$A_5$ has order $60$ and $6$ Sylow $5$-subgroups. They are all conjugate, so $6 = [A_5 : N(P)]$ and $|N(P)| = 10$.",
        "$A_5$ 的阶为 $60$，有 $6$ 个西罗 $5$-子群。它们彼此共轭，所以 $6 = [A_5 : N(P)]$，$|N(P)| = 10$。",
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
        return numberProblem({
          prompt: t(
            `A group $G$ of order $${n}$ has $${np}$ Sylow $${p}$-subgroups. What is the order of the normalizer of one of them?`,
            `$${n}$ 阶群 $G$ 有 $${np}$ 个西罗 $${p}$-子群。其中一个的正规化子的阶是多少？`,
          ),
          answer: value,
          wrong: [sylowOrder(n, p), n - np, np * sylowOrder(n, p), n / sylowOrder(n, p)].filter((x) => x !== value),
          solution: t(
            `$G$ acts transitively on its Sylow $${p}$-subgroups by conjugation, with stabilizer $N(P)$, so $|N(P)| = \\frac{${n}}{${np}} = ${value}$.`,
            `$G$ 通过共轭传递地作用于它的西罗 $${p}$-子群，稳定子为 $N(P)$，所以 $|N(P)| = \\frac{${n}}{${np}} = ${value}$。`,
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
    "If |G| = pᵏm with p ∤ m, the number n_p of Sylow p-subgroups satisfies n_p ≡ 1 (mod p) and n_p | m. When these force n_p = 1, the Sylow p-subgroup is normal, so G is not simple; for example every group of order 15 has a normal subgroup of order 5 and of order 3, and is cyclic.",
    "若 |G| = pᵏm 且 p ∤ m，则西罗 p-子群的个数 n_p 满足 n_p ≡ 1 (mod p) 且 n_p | m。当这些条件迫使 n_p = 1 时，西罗 p-子群正规，G 不是单群；例如每个 15 阶群都有 5 阶与 3 阶正规子群，并且是循环群。",
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
        "For $|G| = 60 = 2^2 \\cdot 15$, $n_2$ divides $15$ and is odd: $1, 3, 5, 15$. For $p = 5$, $n_5$ divides $12$ and is $\\equiv 1 \\pmod 5$: $1$ or $6$.",
        "对 $|G| = 60 = 2^2 \\cdot 15$，$n_2$ 整除 $15$ 且为奇数：$1, 3, 5, 15$。对 $p = 5$，$n_5$ 整除 $12$ 且 $\\equiv 1 \\pmod 5$：$1$ 或 $6$。",
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
        return texChoice(
          rng,
          t(
            `A group $G$ has order $${n}$. Which of these could be the number of Sylow $${p}$-subgroups of $G$?`,
            `群 $G$ 的阶为 $${n}$。下列哪个可能是 $G$ 的西罗 $${p}$-子群的个数？`,
          ),
          `${right}`,
          rng.shuffle(bad.filter((x) => x > 1)).map(String),
          t(
            `$${n} = ${sylowOrder(n, p)} \\cdot ${m}$, so $n_{${p}}$ divides $${m}$ and is $\\equiv 1 \\pmod{${p}}$. Of the options, only $${right}$ qualifies.`,
            `$${n} = ${sylowOrder(n, p)} \\cdot ${m}$，所以 $n_{${p}}$ 整除 $${m}$ 且 $\\equiv 1 \\pmod{${p}}$。选项中只有 $${right}$ 满足。`,
          ),
        );
      },
    },
    {
      id: "forced-normal-sylow-subgroups",
      title: t("Forced normal Sylow subgroups", "必然正规的西罗子群"),
      explanation: t(
        "In a group of order $45 = 3^2 \\cdot 5$, $n_5$ divides $9$ and is $\\equiv 1 \\pmod 5$, so $n_5 = 1$: the Sylow $5$-subgroup is normal. $n_3$ divides $5$ and is $\\equiv 1 \\pmod 3$, so $n_3 = 1$ too.",
        "在 $45 = 3^2 \\cdot 5$ 阶群中，$n_5$ 整除 $9$ 且 $\\equiv 1 \\pmod 5$，所以 $n_5 = 1$：西罗 $5$-子群正规。$n_3$ 整除 $5$ 且 $\\equiv 1 \\pmod 3$，所以也有 $n_3 = 1$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(10, 500);
        while (primesOf(n).length < 2);
        const p = rng.pick(primesOf(n));
        const allowed = sylowCounts(n, p);
        const m = n / sylowOrder(n, p);
        const holds = allowed.length === 1;
        return factProblem({
          prompt: t(
            `For a group of order $${n}$, do the conditions of the third Sylow theorem force $n_{${p}} = 1$, so that the Sylow $${p}$-subgroup is normal?`,
            `对 $${n}$ 阶群，第三西罗定理的条件是否迫使 $n_{${p}} = 1$，从而西罗 $${p}$-子群正规？`,
          ),
          holds,
          reason: holds
            ? t(
                `$n_{${p}}$ divides $${m}$ and is $\\equiv 1 \\pmod{${p}}$, which forces $n_{${p}} = 1$.`,
                `$n_{${p}}$ 整除 $${m}$ 且 $\\equiv 1 \\pmod{${p}}$，这迫使 $n_{${p}} = 1$。`,
              )
            : t(
                `The conditions $n_{${p}} \\mid ${m}$ and $n_{${p}} \\equiv 1 \\pmod{${p}}$ allow $n_{${p}} = ${allowed.join(", ")}$.`,
                `条件 $n_{${p}} \\mid ${m}$ 与 $n_{${p}} \\equiv 1 \\pmod{${p}}$ 允许 $n_{${p}} = ${allowed.join(", ")}$。`,
              ),
        });
      },
    },
  ],
};

/** abstractAlgebraSylowTopics are the topics of Abstract Algebra unit 7. */
export const abstractAlgebraSylowTopics: readonly TopicDef[] = [pGroups, theFirstSylowTheorem, theSecondSylowTheorem, theThirdSylowTheorem];
