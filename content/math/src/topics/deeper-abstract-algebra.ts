// Further knowledge points for topics of Abstract Algebra, each a skill the topic's own
// points leave out. See `deeperAbstractAlgebraPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { algebraDrawings1 } from "../explanation-drawings-abstract-algebra-1.ts";
import { algebraDrawings2 } from "../explanation-drawings-abstract-algebra-2.ts";

import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** gcd gives the greatest common divisor of two positive integers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
/** lcm gives the least common multiple of two positive integers. */
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
/** range lists the integers from lo to hi. */
const range = (lo: number, hi: number) => [...Array(hi - lo + 1).keys()].map((i) => i + lo);
/** divisors lists the positive divisors of n in increasing order. */
const divisors = (n: number) => range(1, n).filter((d) => n % d === 0);
/** primes lists the distinct prime divisors of n in increasing order. */
const primes = (n: number) => divisors(n).filter((d) => d > 1 && divisors(d).length === 2);
/** radical multiplies the distinct prime divisors of n. */
const radical = (n: number) => primes(n).reduce((a, b) => a * b, 1);
/** totient gives the number of integers from 1 to n coprime to n. */
const totient = (n: number) => range(1, n).filter((k) => gcd(n, k) === 1).length;
/** sum adds a list of numbers. */
const sum = (list: readonly number[]) => list.reduce((a, b) => a + b, 0);
/** nonsquarefree lists the integers up to hi that a square greater than one divides. */
const nonsquarefree = (hi: number) => range(4, hi).filter((n) => radical(n) !== n);
/** Zn writes the integers modulo n. */
const Zn = (n: number) => `\\mathbb{Z}_{${n}}`;
/** pickNonzero picks a nonzero integer from -r to r. */
const pickNonzero = (rng: Rng, r: number) => rng.pick(range(-r, r).filter((i) => i !== 0));
/** valueKey writes a number or a rational as a string, so that equal values compare equal. */
const valueKey = (v: unknown) =>
  typeof v === "object" && v !== null && "toLatex" in v ? (v as { toLatex(): string }).toLatex() : String(v);
/** apart keeps the explained mistakes whose values differ from the answer and from each other. */
const apart = <T extends { readonly value: unknown }>(answer: unknown, list: readonly T[]): T[] =>
  list.filter((m, i) => valueKey(m.value) !== valueKey(answer) && list.findIndex((x) => valueKey(x.value) === valueKey(m.value)) === i);

const largestIntersection: KnowledgePointDef = {
  id: "the-largest-possible-intersection-of-two-subgroups",
  title: t("The largest possible intersection of two subgroups", "两个子群交集的最大可能阶"),
  explanation: t(
    "The intersection of two subgroups is a subgroup of each. So by Lagrange's theorem its order divides both of their orders, and therefore divides their greatest common divisor. Inside a cyclic group this bound is reached. In particular, two subgroups whose orders are coprime share only the identity element.\n\nIf $|H| = 84$ and $|K| = 120$, then $|H \\cap K|$ divides $\\gcd(84, 120) = 12$. In $\\mathbb{Z}_{840}$ the subgroups $\\langle 10 \\rangle$ and $\\langle 7 \\rangle$ have these orders and meet in $\\langle 70 \\rangle$, of order $12$.\n\nCheck: $\\frac{840}{10} = 84$, $\\frac{840}{7} = 120$ and $\\frac{840}{70} = 12$.\n\n> **Watch out.** The bound is the gcd, not the smaller order: a subgroup of order $84$ cannot lie inside one of order $120$, because $84$ does not divide $120$.",
    "两个子群的交集是它们各自的子群。所以由拉格朗日定理，它的阶同时整除两个子群的阶，因而整除它们的最大公因数。在循环群中这个上界可以达到。特别地，阶互素的两个子群只有单位元这一个公共元素。\n\n若 $|H| = 84$，$|K| = 120$，则 $|H \\cap K|$ 整除 $\\gcd(84, 120) = 12$。在 $\\mathbb{Z}_{840}$ 中，子群 $\\langle 10 \\rangle$ 与 $\\langle 7 \\rangle$ 恰有这两个阶，它们交于 $12$ 阶子群 $\\langle 70 \\rangle$。\n\n检验：$\\frac{840}{10} = 84$，$\\frac{840}{7} = 120$，$\\frac{840}{70} = 12$。\n\n> **注意。** 上界是最大公因数，而不是较小的阶：$84$ 阶子群不可能含于 $120$ 阶子群中，因为 $84$ 不整除 $120$。",
  ),
  generate(rng) {
    const g = rng.int(2, 12);
    const [x, y] = rng.pick(
      range(1, 9)
        .flatMap((i) => range(1, 9).map((j) => [i, j] as const))
        .filter(([i, j]) => i !== j && gcd(i, j) === 1),
    );
    const a = g * x;
    const b = g * y;
    return numberProblem({
      prompt: t(
        `Subgroups $H$ and $K$ of a finite group have orders ${a} and ${b}. What is the largest possible order of $H \\cap K$?`,
        `有限群的子群 $H$ 和 $K$ 的阶分别是 ${a} 和 ${b}。$H \\cap K$ 的阶最大可能是多少？`,
      ),
      answer: g,
      form: "integer",
      mistakes: apart(g, [
        why(
          Math.min(a, b),
          `That would put one subgroup inside the other, but $${Math.min(a, b)}$ does not divide $${Math.max(a, b)}$.`,
          `那要求一个子群含于另一个之中，但 $${Math.min(a, b)}$ 不整除 $${Math.max(a, b)}$。`,
        ),
        why(
          lcm(a, b),
          "An intersection is no bigger than either subgroup; that is the least common multiple.",
          "交集不会比任一子群大；那是最小公倍数。",
        ),
        why(
          1,
          "Only coprime orders force a trivial intersection; these orders share a factor.",
          "只有阶互素时交集才必为平凡；这两个阶有公因数。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Bound the order", "给出上界"],
            t(
              `The order of $H \\cap K$ divides both $${a}$ and $${b}$, so it divides $\\gcd(${a}, ${b}) = ${g}$.`,
              `$H \\cap K$ 的阶同时整除 $${a}$ 和 $${b}$，所以整除 $\\gcd(${a}, ${b}) = ${g}$。`,
            ),
          ],
          [
            ["Reach the bound", "达到上界"],
            t(
              `In a cyclic group of order $${lcm(a, b)}$, the subgroups of these orders meet in a subgroup of order exactly $${g}$.`,
              `在 $${lcm(a, b)}$ 阶循环群中，这两个阶的子群的交集恰好是 $${g}$ 阶子群。`,
            ),
          ],
        ],
        t(
          `$\\frac{${a}}{${g}} = ${x}$ and $\\frac{${b}}{${g}} = ${y}$ are coprime, so no larger common divisor exists.`,
          `$\\frac{${a}}{${g}} = ${x}$ 与 $\\frac{${b}}{${g}} = ${y}$ 互素，所以没有更大的公因数。`,
        ),
      ),
    });
  },
};

const orderOfAPower: KnowledgePointDef = {
  id: "the-order-of-a-power-of-an-element",
  title: t("The order of a power of an element", "元素的幂的阶"),
  explanation: t(
    "If $g$ has order $n$, then $(g^k)^m$ is the identity exactly when $n$ divides $km$. The smallest such $m$ is $\\frac{n}{\\gcd(n, k)}$, which is the order of $g^k$. This holds in every group, and it depends only on $n$ and $k$, not on which group $g$ belongs to.\n\nIf $g$ has order $12$, then $g^8$ has order $\\frac{12}{\\gcd(12, 8)} = \\frac{12}{4} = 3$.\n\nCheck: $(g^8)^3 = g^{24} = (g^{12})^2$ is the identity, while $(g^8)^2 = g^{16} = g^4$ is not.\n\n> **Watch out.** Divide $n$ by the gcd, not by $k$, and do not keep the order $n$ of $g$: $\\frac{12}{8}$ is not even a whole number, and $g^8$ does not have order $12$.",
    "如果 $g$ 的阶是 $n$，那么 $(g^k)^m$ 是单位元，当且仅当 $n$ 整除 $km$。这样的最小 $m$ 是 $\\frac{n}{\\gcd(n, k)}$，它就是 $g^k$ 的阶。这在任何群中都成立，而且只取决于 $n$ 和 $k$，与 $g$ 属于哪个群无关。\n\n若 $g$ 的阶为 $12$，则 $g^8$ 的阶为 $\\frac{12}{\\gcd(12, 8)} = \\frac{12}{4} = 3$。\n\n检验：$(g^8)^3 = g^{24} = (g^{12})^2$ 是单位元，而 $(g^8)^2 = g^{16} = g^4$ 不是。\n\n> **注意。** 要用 $n$ 除以最大公因数，不是除以 $k$，也不要照搬 $g$ 的阶 $n$：$\\frac{12}{8}$ 甚至不是整数，而 $g^8$ 的阶也不是 $12$。",
  ),
  generate(rng) {
    for (;;) {
      const n = rng.pick([12, 18, 20, 24, 30, 36, 40, 42, 48, 60, 72, 84, 90, 100, 120]);
      const k = rng.pick(range(2, n - 1).filter((i) => gcd(n, i) > 1));
      const g = gcd(n, k);
      const mistakes = apart(n / g, [
        why(n, `This is the order of $g$ itself; a power of $g$ can have a smaller order.`, `这是 $g$ 本身的阶；$g$ 的幂的阶可以更小。`),
        why(g, `This is $\\gcd(${n}, ${k})$ itself; the order is ${n} divided by it.`, `这是 $\\gcd(${n}, ${k})$ 本身；阶是 ${n} 除以它。`),
        why(k, "This is the exponent, not the order.", "这是指数，不是阶。"),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `An element $g$ of a group has order ${n}. What is the order of $g^{${k}}$?`,
          `群中元素 $g$ 的阶是 ${n}。$g^{${k}}$ 的阶是多少？`,
        ),
        answer: n / g,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [["Find the gcd", "求最大公因数"], t(`$\\gcd(${n}, ${k}) = ${g}$.`, `$\\gcd(${n}, ${k}) = ${g}$。`)],
            [
              ["Divide", "相除"],
              t(`The order of $g^{${k}}$ is $\\frac{${n}}{${g}} = ${n / g}$.`, `$g^{${k}}$ 的阶是 $\\frac{${n}}{${g}} = ${n / g}$。`),
            ],
          ],
          t(
            `$(g^{${k}})^{${n / g}} = g^{${k * (n / g)}}${k === g ? "" : ` = (g^{${n}})^{${k / g}}`}$ is the identity, and $${n}$ divides $${k}m$ for no smaller positive $m$.`,
            `$(g^{${k}})^{${n / g}} = g^{${k * (n / g)}}${k === g ? "" : ` = (g^{${n}})^{${k / g}}`}$ 是单位元，而没有更小的正整数 $m$ 使 $${n}$ 整除 $${k}m$。`,
          ),
        ),
      });
    }
  },
};

const productOfCoprimeOrders: KnowledgePointDef = {
  id: "the-order-of-a-product-in-an-abelian-group",
  title: t("The order of a product in an abelian group", "交换群中乘积的阶"),
  explanation: t(
    "In an abelian group, $(ab)^k = a^kb^k$. If the orders of $a$ and $b$ are coprime, then $a^kb^k$ can be the identity only when both factors are, since $\\langle a \\rangle$ and $\\langle b \\rangle$ share only the identity. So the order of $ab$ is the product of the two orders. Without commutativity this fails.\n\nIf $a$ has order $4$ and $b$ has order $9$, then $ab$ has order $4 \\cdot 9 = 36$.\n\nCheck: $(ab)^{36} = a^{36}b^{36} = (a^4)^9(b^9)^4$ is the identity, and $(ab)^{12} = a^{12}b^{12} = b^3$ is not, since $9$ does not divide $12$.\n\n> **Watch out.** The rule needs coprime orders. In $\\mathbb{Z}_6$, $2$ and $4$ both have order $3$, but $2 + 4 = 0$ has order $1$, not $9$.",
    "在交换群中，$(ab)^k = a^kb^k$。如果 $a$ 和 $b$ 的阶互素，那么由于 $\\langle a \\rangle$ 和 $\\langle b \\rangle$ 只有单位元这一个公共元素，$a^kb^k$ 是单位元时两个因子都必须是单位元。所以 $ab$ 的阶是两个阶的乘积。没有交换性时这个结论不成立。\n\n若 $a$ 的阶为 $4$，$b$ 的阶为 $9$，则 $ab$ 的阶为 $4 \\cdot 9 = 36$。\n\n检验：$(ab)^{36} = a^{36}b^{36} = (a^4)^9(b^9)^4$ 是单位元，而 $(ab)^{12} = a^{12}b^{12} = b^3$ 不是，因为 $9$ 不整除 $12$。\n\n> **注意。** 这个规则要求两个阶互素。在 $\\mathbb{Z}_6$ 中，$2$ 与 $4$ 的阶都是 $3$，但 $2 + 4 = 0$ 的阶是 $1$，不是 $9$。",
  ),
  generate(rng) {
    const [m, n] = rng.pick(
      range(2, 20)
        .flatMap((i) => range(i + 1, 21).map((j) => [i, j] as const))
        .filter(([i, j]) => gcd(i, j) === 1),
    );
    return numberProblem({
      prompt: t(
        `In an abelian group, $a$ has order ${m} and $b$ has order ${n}. What is the order of $ab$?`,
        `在交换群中，$a$ 的阶是 ${m}，$b$ 的阶是 ${n}。$ab$ 的阶是多少？`,
      ),
      answer: m * n,
      form: "integer",
      mistakes: apart(m * n, [
        why(m + n, "This adds the orders; for coprime orders they multiply.", "这把两个阶相加了；阶互素时应相乘。"),
        why(
          n,
          "This keeps only the larger order; $ab$ must be raised to a multiple of both.",
          "这只取了较大的阶；$ab$ 的指数必须同时是两个阶的倍数。",
        ),
        why(
          1,
          "This assumes the two elements cancel; with coprime orders only the identity is shared.",
          "这假设两个元素相互抵消；阶互素时它们只共有单位元。",
        ),
      ]),
      solution: walked(
        [
          [["Check the orders are coprime", "检验阶互素"], t(`$\\gcd(${m}, ${n}) = 1$.`, `$\\gcd(${m}, ${n}) = 1$。`)],
          [
            ["Multiply", "相乘"],
            t(
              `In an abelian group the order of $ab$ is then $${m} \\cdot ${n} = ${m * n}$.`,
              `在交换群中，$ab$ 的阶就是 $${m} \\cdot ${n} = ${m * n}$。`,
            ),
          ],
        ],
        t(
          `$(ab)^k = a^kb^k$ is the identity exactly when ${m} and ${n} both divide $k$, and the least such $k$ is $\\operatorname{lcm}(${m}, ${n}) = ${m * n}$.`,
          `$(ab)^k = a^kb^k$ 是单位元当且仅当 ${m} 与 ${n} 都整除 $k$，这样的最小 $k$ 是 $\\operatorname{lcm}(${m}, ${n}) = ${m * n}$。`,
        ),
      ),
    });
  },
};

const rootsTogether: KnowledgePointDef = {
  id: "the-subgroup-generated-by-two-roots-of-unity",
  figure: algebraDrawings1["cyclic-subgroups-in-the-complex-plane#the-subgroup-generated-by-two-roots-of-unity"],
  title: t("The subgroup generated by two roots of unity", "两个单位根生成的子群"),
  explanation: t(
    "The roots of unity of a given order form a cyclic group. Two primitive roots, of orders $m$ and $n$, both lie among the roots of order $\\operatorname{lcm}(m, n)$, and together they generate all of these. So the subgroup they generate has $\\operatorname{lcm}(m, n)$ elements, which are evenly spaced on the unit circle.\n\nIn the drawing, $e^{2\\pi i/3}$ and $e^{2\\pi i/4}$ have orders $3$ and $4$, and $\\operatorname{lcm}(3, 4) = 12$, so together they generate the $12$ twelfth roots of unity.\n\nCheck: $e^{2\\pi i/3} \\cdot \\left(e^{2\\pi i/4}\\right)^{-1} = e^{2\\pi i(1/3 - 1/4)} = e^{2\\pi i/12}$, a root of order $12$, so the subgroup really contains a generator of all twelve.\n\n> **Watch out.** The answer is the lcm, not the product: $e^{2\\pi i/4}$ and $e^{2\\pi i/6}$ generate only the $12$ twelfth roots of unity, not $24$ elements.",
    "给定次数的单位根构成循环群。阶为 $m$ 和 $n$ 的两个本原单位根，都在 $\\operatorname{lcm}(m, n)$ 次单位根之中，而且它们合起来能生成所有这些单位根。所以它们生成的子群有 $\\operatorname{lcm}(m, n)$ 个元素，这些元素在单位圆上均匀分布。\n\n图中 $e^{2\\pi i/3}$ 与 $e^{2\\pi i/4}$ 的阶为 $3$ 与 $4$，$\\operatorname{lcm}(3, 4) = 12$，所以它们一起生成 $12$ 个 $12$ 次单位根。\n\n检验：$e^{2\\pi i/3} \\cdot \\left(e^{2\\pi i/4}\\right)^{-1} = e^{2\\pi i(1/3 - 1/4)} = e^{2\\pi i/12}$，是 $12$ 阶单位根，所以该子群确实含有生成全部十二个单位根的元素。\n\n> **注意。** 答案是最小公倍数，而不是乘积：$e^{2\\pi i/4}$ 与 $e^{2\\pi i/6}$ 只生成 $12$ 个 $12$ 次单位根，而不是 $24$ 个元素。",
  ),
  generate(rng) {
    const m = rng.int(2, 24);
    const n = rng.pick(range(2, 24).filter((i) => i !== m));
    const l = lcm(m, n);
    return numberProblem({
      prompt: t(
        `How many elements has the subgroup of $\\mathbb{C}^\\times$ generated by $e^{2\\pi i/${m}}$ and $e^{2\\pi i/${n}}$?`,
        `$\\mathbb{C}^\\times$ 中由 $e^{2\\pi i/${m}}$ 和 $e^{2\\pi i/${n}}$ 生成的子群有多少个元素？`,
      ),
      answer: l,
      form: "integer",
      mistakes: apart(l, [
        why(
          m * n,
          `The product overcounts: $\\gcd(${m}, ${n}) = ${gcd(m, n)}$, so the two cyclic groups share roots.`,
          `乘积算多了：$\\gcd(${m}, ${n}) = ${gcd(m, n)}$，两个循环群有公共的单位根。`,
        ),
        why(
          m + n,
          "Adding the orders counts elements of the two cyclic subgroups, not of the subgroup they generate together.",
          "把阶相加数的是两个循环子群的元素，而不是它们一起生成的子群的元素。",
        ),
        why(Math.max(m, n), "The larger cyclic subgroup need not contain the other generator.", "较大的循环子群不一定含另一个生成元。"),
        why(
          gcd(m, n),
          "The gcd gives the roots the two subgroups share, which is their intersection.",
          "最大公约数给出的是两个子群共有的单位根，即它们的交。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find a common order", "找公共的次数"],
            t(
              `Both generators are $${l}$th roots of unity, since $${m}$ and $${n}$ divide $\\operatorname{lcm}(${m}, ${n}) = ${l}$.`,
              `两个生成元都是 $${l}$ 次单位根，因为 $${m}$ 与 $${n}$ 都整除 $\\operatorname{lcm}(${m}, ${n}) = ${l}$。`,
            ),
          ],
          [
            ["Generate them all", "生成全部"],
            t(
              `Together they generate a root of order $${l}$, so they generate all $${l}$ of them.`,
              `它们一起能生成一个 $${l}$ 阶单位根，所以生成全部 $${l}$ 个。`,
            ),
          ],
        ],
        t(
          `$${l}$ is a multiple of both $${m}$ and $${n}$, and $${l} \\cdot ${gcd(m, n)} = ${m * n} = ${m} \\cdot ${n}$.`,
          `$${l}$ 是 $${m}$ 与 $${n}$ 的公倍数，且 $${l} \\cdot ${gcd(m, n)} = ${m * n} = ${m} \\cdot ${n}$。`,
        ),
      ),
    });
  },
};

const smallestGeneratingSet: KnowledgePointDef = {
  id: "the-smallest-generating-set-of-a-product-of-cyclic-groups",
  title: t("The smallest generating set of a product of cyclic groups", "循环群之积的最小生成集"),
  explanation: t(
    "Each factor of a product of cyclic groups splits into cyclic groups of prime power order. For one prime, the part with $c$ nontrivial factors needs exactly $c$ generators. Different primes do not compete, since their parts can share generators. So the smallest generating set has as many elements as the largest number of factors that one prime divides.\n\nFor $\\mathbb{Z}_{6} \\times \\mathbb{Z}_{10} \\times \\mathbb{Z}_{9}$: the prime $2$ divides $6$ and $10$, the prime $3$ divides $6$ and $9$, and $5$ divides only $10$. No prime divides all three, so $2$ generators are needed and enough.\n\nCheck: the elements of order dividing $2$ form $\\mathbb{Z}_2 \\times \\mathbb{Z}_2$, which needs $2$ generators, so one generator cannot do.\n\n> **Watch out.** Count factors per prime, not factors in total: $\\mathbb{Z}_{2} \\times \\mathbb{Z}_{3} \\times \\mathbb{Z}_{5}$ has three factors but is cyclic.",
    "循环群之积的每个因子都能分解成素数幂阶的循环群。对一个素数，有 $c$ 个非平凡因子的部分恰好需要 $c$ 个生成元。不同素数互不冲突，它们的部分可以共用生成元。所以最小生成集的元素个数，等于同一个素数最多整除的因子个数。\n\n对 $\\mathbb{Z}_{6} \\times \\mathbb{Z}_{10} \\times \\mathbb{Z}_{9}$：素数 $2$ 整除 $6$ 与 $10$，素数 $3$ 整除 $6$ 与 $9$，$5$ 只整除 $10$。没有素数整除全部三个，所以需要且只需 $2$ 个生成元。\n\n检验：阶整除 $2$ 的元素构成 $\\mathbb{Z}_2 \\times \\mathbb{Z}_2$，它需要 $2$ 个生成元，所以一个生成元不够。\n\n> **注意。** 要按素数数因子，而不是数因子总数：$\\mathbb{Z}_{2} \\times \\mathbb{Z}_{3} \\times \\mathbb{Z}_{5}$ 有三个因子，却是循环群。",
  ),
  generate(rng) {
    const a = rng.int(2, 36);
    const b = rng.int(2, 36);
    const c = rng.int(2, 36);
    const all = [a, b, c];
    const candidates = primes(a).concat(primes(b), primes(c));
    const count = (p: number) => all.filter((m) => m % p === 0).length;
    const p = candidates.reduce((best, q) => (count(q) > count(best) ? q : best));
    const answer = count(p);
    const group = all.map(Zn).join(" \\times ");
    return numberProblem({
      prompt: t(`What is the smallest number of elements that generate $${group}$?`, `生成 $${group}$ 最少需要多少个元素？`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          1,
          `One generator is enough only when no prime divides two of the orders, but $${p}$ divides $${answer}$ of them.`,
          `只有当没有素数整除其中两个阶时一个生成元才够，但 $${p}$ 整除其中 $${answer}$ 个。`,
        ),
        why(
          2,
          answer === 1
            ? "No prime divides two of the orders, so the product is cyclic and one generator is enough."
            : `$${p}$ divides all three orders, so the elements of order dividing $${p}$ need three generators.`,
          answer === 1
            ? "没有素数整除其中两个阶，所以这个积是循环群，一个生成元就够了。"
            : `$${p}$ 整除全部三个阶，所以阶整除 $${p}$ 的元素需要三个生成元。`,
        ),
        why(
          3,
          "Three factors do not force three generators: only a prime dividing all three orders does.",
          "三个因子并不意味着需要三个生成元：只有当某个素数整除全部三个阶时才需要。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Count per prime", "按素数计数"],
            answer === 1
              ? t(`No prime divides two of $${a}$, $${b}$, $${c}$.`, `没有素数同时整除 $${a}$、$${b}$、$${c}$ 中的两个。`)
              : t(
                  `The prime $${p}$ divides $${answer}$ of the orders $${a}$, $${b}$, $${c}$, and no prime divides more.`,
                  `素数 $${p}$ 整除阶 $${a}$、$${b}$、$${c}$ 中的 $${answer}$ 个，没有素数整除更多。`,
                ),
          ],
          [
            ["Conclude", "得出结论"],
            answer === 1
              ? t("So the product is cyclic and one generator is enough.", "所以这个积是循环群，一个生成元就够了。")
              : t(
                  `So $${answer}$ generators are needed, and by the Chinese remainder theorem $${answer}$ are enough.`,
                  `所以需要 $${answer}$ 个生成元，而由中国剩余定理，$${answer}$ 个就够了。`,
                ),
          ],
        ],
        answer === 1
          ? t(
              `The orders are pairwise coprime, so the product is cyclic of order $${a * b * c}$.`,
              `各阶两两互素，所以这个积是 $${a * b * c}$ 阶循环群。`,
            )
          : t(
              `The elements of order dividing $${p}$ form $\\mathbb{Z}_{${p}}^{${answer}}$, which cannot be generated by fewer than $${answer}$ elements.`,
              `阶整除 $${p}$ 的元素构成 $\\mathbb{Z}_{${p}}^{${answer}}$，它不能由少于 $${answer}$ 个元素生成。`,
            ),
      ),
    });
  },
};

const reducedWords: KnowledgePointDef = {
  id: "counting-reduced-words-of-a-given-length",
  title: t("Counting reduced words of a given length", "数给定长度的既约字"),
  explanation: t(
    "A reduced word in a free group on $k$ generators never has a letter next to its own inverse. Its first letter can be any of the $2k$ generators and inverses. Every later letter can be anything except the inverse of the letter before it, which leaves $2k - 1$ choices. Multiplying these choices counts the elements of each length.\n\nWith $k = 2$ generators $a, b$ and length $3$: $4$ choices for the first letter and $3$ for each of the other two, so $4 \\cdot 3^2 = 36$ reduced words.\n\nCheck: for length $2$ the count is $4 \\cdot 3 = 12$, which is the $16$ two-letter words minus the $4$ that cancel, $aa^{-1}$, $a^{-1}a$, $bb^{-1}$ and $b^{-1}b$.\n\n> **Watch out.** Only the inverse of the letter just before is excluded: repeating a letter, as in $aa$, is allowed.",
    "$k$ 个生成元的自由群中，既约字里不会有字母紧挨着自己的逆。第一个字母可以是 $2k$ 个生成元和逆中的任何一个。之后每个字母只要不是前一个字母的逆就行，还有 $2k - 1$ 种选择。把这些选择相乘，就数出了每种长度的元素个数。\n\n当 $k = 2$（生成元 $a, b$）、长度为 $3$ 时：第一个字母有 $4$ 种选择，其余两个各有 $3$ 种，共 $4 \\cdot 3^2 = 36$ 个既约字。\n\n检验：长度为 $2$ 时个数为 $4 \\cdot 3 = 12$，正是 $16$ 个两字母字减去会消去的 $4$ 个：$aa^{-1}$、$a^{-1}a$、$bb^{-1}$、$b^{-1}b$。\n\n> **注意。** 只排除紧挨着的前一个字母的逆：重复同一个字母，如 $aa$，是允许的。",
  ),
  generate(rng) {
    const k = rng.int(2, 8);
    const n = rng.int(2, 6);
    const answer = 2 * k * (2 * k - 1) ** (n - 1);
    const product = `${2 * k} \\cdot ${2 * k - 1}${n === 2 ? "" : `^{${n - 1}}`}`;
    return numberProblem({
      prompt: t(
        `How many reduced words of length ${n} does the free group on ${k} generators have?`,
        `${k} 个生成元的自由群有多少个长度为 ${n} 的既约字？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          (2 * k) ** n,
          "This counts every word, including those with a letter next to its inverse.",
          "这数了所有的字，包括有字母紧挨着自己的逆的字。",
        ),
        why(k ** n, "This forgets the inverse letters: each generator comes with its inverse.", "这忘了逆字母：每个生成元都带着它的逆。"),
        why(
          (2 * k - 1) ** n,
          `The first letter has no letter before it, so it has all $${2 * k}$ choices.`,
          `第一个字母前面没有字母，所以它有全部 $${2 * k}$ 种选择。`,
        ),
        why(
          2 * k * (2 * k - 2) ** (n - 1),
          "Only the inverse of the previous letter is excluded; repeating the previous letter is allowed.",
          "只排除前一个字母的逆；重复前一个字母是允许的。",
        ),
      ]),
      solution: walked(
        [
          [
            ["The first letter", "第一个字母"],
            t(`It can be any of the $${2 * k}$ generators and inverses.`, `它可以是 $${2 * k}$ 个生成元与逆中的任何一个。`),
          ],
          [
            ["The other letters", "其余字母"],
            t(
              `${n === 2 ? "The second letter" : `Each of the other $${n - 1}$ letters`} can be anything but the inverse of the letter before: $${2 * k - 1}$ choices.`,
              `${n === 2 ? "第二个字母" : `其余 $${n - 1}$ 个字母中的每一个`}只要不是前一个字母的逆即可：$${2 * k - 1}$ 种选择。`,
            ),
          ],
          [["Multiply", "相乘"], t(`$${product} = ${answer}$.`, `$${product} = ${answer}$。`)],
        ],
        t(
          `For length $1$ the same count gives the $${2 * k}$ single letters, and each further letter multiplies by $${2 * k - 1}$.`,
          `长度为 $1$ 时同样的计数给出 $${2 * k}$ 个单字母字，此后每多一个字母就乘以 $${2 * k - 1}$。`,
        ),
      ),
    });
  },
};

const smallestSymmetricGroup: KnowledgePointDef = {
  id: "the-smallest-symmetric-group-with-an-element-of-a-given-order",
  title: t("The smallest symmetric group with an element of a given order", "含给定阶元素的最小对称群"),
  explanation: t(
    "The order of a permutation is the least common multiple of its cycle lengths. To reach a given order with as few symbols as possible, use one cycle for each prime power in the factorization, because splitting a composite length into coprime parts never uses more symbols. So the smallest number of symbols is the sum of those prime powers.\n\nFor order $12 = 4 \\cdot 3$: the cycles $(1\\;2\\;3\\;4)(5\\;6\\;7)$ have order $\\operatorname{lcm}(4, 3) = 12$ and use $4 + 3 = 7$ symbols, so the answer is $S_7$.\n\nCheck: an element of order $12$ needs a cycle length divisible by $4$ and one divisible by $3$; one cycle doing both is a $12$-cycle, and two separate cycles need at least $4 + 3 = 7$ symbols, so $S_6$ has no such element.\n\n> **Watch out.** Do not split a prime power: $(1\\;2)(3\\;4)(5\\;6\\;7)$ uses $7$ symbols too, but has order $\\operatorname{lcm}(2, 2, 3) = 6$, not $12$.",
    "置换的阶是各循环长度的最小公倍数。要用尽量少的符号达到给定的阶，就让分解式中的每个素数幂各对应一个循环，因为把合数长度拆成互素的部分不会用更多符号。所以最少的符号数就是这些素数幂之和。\n\n对阶 $12 = 4 \\cdot 3$：循环 $(1\\;2\\;3\\;4)(5\\;6\\;7)$ 的阶为 $\\operatorname{lcm}(4, 3) = 12$，用了 $4 + 3 = 7$ 个符号，所以答案是 $S_7$。\n\n检验：$12$ 阶元素需要一个长度被 $4$ 整除的循环和一个长度被 $3$ 整除的循环；一个循环同时满足就是 $12$-循环，分成两个循环至少要 $4 + 3 = 7$ 个符号，所以 $S_6$ 中没有这样的元素。\n\n> **注意。** 不要拆开素数幂：$(1\\;2)(3\\;4)(5\\;6\\;7)$ 也用 $7$ 个符号，但阶是 $\\operatorname{lcm}(2, 2, 3) = 6$，不是 $12$。",
  ),
  generate(rng) {
    const parts = [rng.pick([2, 4, 8, 16]), rng.pick([3, 9, 27]), rng.pick([1, 5, 7, 11, 13, 25])].filter((n) => n > 1);
    const order = parts.reduce((x, y) => x * y, 1);
    const answer = sum(parts);
    const smallPrimes = sum(primes(order));
    return numberProblem({
      prompt: t(
        `What is the smallest $n$ for which the symmetric group $S_n$ contains an element of order ${order}?`,
        `使对称群 $S_n$ 含有 ${order} 阶元素的最小 $n$ 是多少？`,
      ),
      answer,
      solveFor: "n",
      form: "integer",
      mistakes: apart(answer, [
        why(
          order,
          `That uses one cycle of length $${order}$; disjoint cycles of coprime lengths reach the same order with fewer symbols.`,
          `那是用一个长度为 $${order}$ 的循环；长度互素的不相交循环用更少的符号就能达到同样的阶。`,
        ),
        why(
          smallPrimes,
          `That uses one cycle per prime, but then the order is only $${primes(order).reduce((x, y) => x * y, 1)}$; each prime needs its full prime power.`,
          `那是每个素数用一个循环，但这样阶只有 $${primes(order).reduce((x, y) => x * y, 1)}$；每个素数都要用它完整的素数幂。`,
        ),
        why(
          Math.max(...parts),
          "That is the longest cycle alone; the other prime powers need cycles of their own.",
          "那只是最长的循环；其他素数幂也需要各自的循环。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Factor the order", "分解阶"],
            t(
              `$${order} = ${parts.join(" \\cdot ")}$, a product of coprime prime powers.`,
              `$${order} = ${parts.join(" \\cdot ")}$，是互素的素数幂之积。`,
            ),
          ],
          [
            ["One cycle per prime power", "每个素数幂一个循环"],
            t(
              `Disjoint cycles of lengths ${parts.join(", ")} have order $${order}$ and use $${parts.join(" + ")} = ${answer}$ symbols.`,
              `长度为 ${parts.join("、")} 的不相交循环阶为 $${order}$，共用 $${parts.join(" + ")} = ${answer}$ 个符号。`,
            ),
          ],
        ],
        t(
          `$\\operatorname{lcm}(${parts.join(", ")}) = ${order}$, and each prime power must divide some cycle length, so no fewer than $${answer}$ symbols will do.`,
          `$\\operatorname{lcm}(${parts.join(", ")}) = ${order}$，而每个素数幂都必须整除某个循环长度，所以符号不能少于 $${answer}$ 个。`,
        ),
      ),
    });
  },
};

const evenPartOfACyclicGroup: KnowledgePointDef = {
  id: "the-even-permutations-in-a-cyclic-subgroup",
  title: t("The even permutations in a cyclic subgroup", "循环子群中的偶置换"),
  explanation: t(
    "A cycle of length $\\ell$ is a product of $\\ell - 1$ transpositions, which gives the parity of any permutation. If a generator is even, all of its powers are even. If it is odd, the even and odd powers alternate, so exactly half of the subgroup lies in $A_n$. A subgroup is therefore either inside $A_n$ or half inside it.\n\nFor $\\sigma = (1\\;2)(3\\;4\\;5)$ in $S_5$: it has order $6$ and is a product of $1 + 2 = 3$ transpositions, so it is odd, and $\\langle \\sigma \\rangle \\cap A_5$ has $\\frac{6}{2} = 3$ elements.\n\nCheck: those are $e$, $\\sigma^2 = (3\\;5\\;4)$ and $\\sigma^4 = (3\\;4\\;5)$, the even powers, each a product of an even number of transpositions.\n\n> **Watch out.** An odd generator does not leave only the identity in $A_n$: every even power of it, such as $\\sigma^2$, is even.",
    "长度为 $\\ell$ 的循环是 $\\ell - 1$ 个对换之积，由此可得任何置换的奇偶性。如果生成元是偶置换，它的所有幂都是偶置换。如果它是奇置换，偶次幂和奇次幂交替出现，所以子群恰好有一半在 $A_n$ 中。因此子群要么全在 $A_n$ 中，要么恰有一半在其中。\n\n对 $S_5$ 中的 $\\sigma = (1\\;2)(3\\;4\\;5)$：它的阶为 $6$，是 $1 + 2 = 3$ 个对换之积，是奇置换，所以 $\\langle \\sigma \\rangle \\cap A_5$ 有 $\\frac{6}{2} = 3$ 个元素。\n\n检验：它们是 $e$、$\\sigma^2 = (3\\;5\\;4)$ 与 $\\sigma^4 = (3\\;4\\;5)$，即偶次幂，每个都是偶数个对换之积。\n\n> **注意。** 奇置换生成元在 $A_n$ 中留下的不只是恒等置换：它的每个偶次幂（如 $\\sigma^2$）都是偶置换。",
  ),
  generate(rng) {
    const a = rng.int(2, 10);
    const b = rng.int(a, 11);
    const order = lcm(a, b);
    const odd = (a + b) % 2 === 1;
    const answer = odd ? order / 2 : order;
    return numberProblem({
      prompt: t(
        `A permutation $\\sigma$ in $S_{${a + b}}$ is a product of two disjoint cycles, of lengths ${a} and ${b}. What is the order of $\\langle \\sigma \\rangle \\cap A_{${a + b}}$?`,
        `$S_{${a + b}}$ 中的置换 $\\sigma$ 是长度为 ${a} 和 ${b} 的两个不相交循环之积。$\\langle \\sigma \\rangle \\cap A_{${a + b}}$ 的阶是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        ...(odd
          ? [
              why(
                order,
                `That counts every power of $\\sigma$, but $\\sigma$ is odd, so only the even powers lie in $A_{${a + b}}$.`,
                `那数的是 $\\sigma$ 的全部幂，但 $\\sigma$ 是奇置换，只有偶次幂属于 $A_{${a + b}}$。`,
              ),
            ]
          : order % 2 === 0
            ? [
                why(
                  order / 2,
                  `That keeps only half the powers, but $\\sigma$ is even, so every power lies in $A_{${a + b}}$.`,
                  `那只留下一半的幂，但 $\\sigma$ 是偶置换，所以每个幂都属于 $A_{${a + b}}$。`,
                ),
              ]
            : []),
        why(
          a * b,
          `That multiplies the lengths; the order of $\\sigma$ is $\\operatorname{lcm}(${a}, ${b}) = ${order}$.`,
          `那是把长度相乘；$\\sigma$ 的阶是 $\\operatorname{lcm}(${a}, ${b}) = ${order}$。`,
        ),
        why(
          2 * order,
          `$\\langle \\sigma \\rangle$ has only $${order}$ elements, so the intersection cannot be larger.`,
          `$\\langle \\sigma \\rangle$ 只有 $${order}$ 个元素，交集不可能更大。`,
        ),
        why(1, "Not just the identity: the even powers of any permutation are even.", "不只是恒等置换：任何置换的偶次幂都是偶置换。"),
      ]),
      solution: walked(
        [
          [
            ["Find the order", "求阶"],
            t(
              `$\\sigma$ has order $\\operatorname{lcm}(${a}, ${b}) = ${order}$.`,
              `$\\sigma$ 的阶为 $\\operatorname{lcm}(${a}, ${b}) = ${order}$。`,
            ),
          ],
          [
            ["Find the parity", "判断奇偶"],
            t(
              `It is a product of $${a - 1} + ${b - 1} = ${a + b - 2}$ transpositions, so it is ${odd ? "odd" : "even"}.`,
              `它是 $${a - 1} + ${b - 1} = ${a + b - 2}$ 个对换之积，所以是${odd ? "奇" : "偶"}置换。`,
            ),
          ],
          odd
            ? [
                ["Keep the even powers", "保留偶次幂"],
                t(
                  `Only the even powers are even: $\\frac{${order}}{2} = ${answer}$ of them.`,
                  `只有偶次幂是偶置换：共 $\\frac{${order}}{2} = ${answer}$ 个。`,
                ),
              ]
            : [
                ["Keep every power", "保留全部幂"],
                t(
                  `Every power of an even permutation is even, so all $${answer}$ powers lie in $A_{${a + b}}$.`,
                  `偶置换的每个幂都是偶置换，所以全部 $${answer}$ 个幂都属于 $A_{${a + b}}$。`,
                ),
              ],
        ],
        odd
          ? t(
              `$\\sigma^k$ is a product of $${a + b - 2} \\cdot k$ transpositions, which is even exactly when $k$ is even, and half of $0, 1, \\dots, ${order - 1}$ are even.`,
              `$\\sigma^k$ 是 $${a + b - 2} \\cdot k$ 个对换之积，它为偶数当且仅当 $k$ 为偶数，而 $0, 1, \\dots, ${order - 1}$ 中恰有一半是偶数。`,
            )
          : t(
              `$\\sigma^k$ is a product of $${a + b - 2} \\cdot k$ transpositions, an even number for every $k$.`,
              `$\\sigma^k$ 是 $${a + b - 2} \\cdot k$ 个对换之积，对每个 $k$ 都是偶数。`,
            ),
      ),
    });
  },
};

const dihedralSubgroups: KnowledgePointDef = {
  id: "counting-the-subgroups-of-a-dihedral-group",
  figure: algebraDrawings1["dihedral-group#counting-the-subgroups-of-a-dihedral-group"],
  title: t("Counting the subgroups of a dihedral group", "数二面体群的子群"),
  explanation: t(
    "A subgroup of $D_n$ either contains only rotations or also contains reflections. The rotations form a cyclic group, with one subgroup for each divisor of $n$. A subgroup with reflections is fixed by its rotation part, of index $d$ in the rotations, together with one of $d$ families of reflections. So there are $\\sigma(n)$ of these, the sum of the divisors.\n\nFor $D_4$, the symmetries of a square, as drawn: $4$ has the $3$ divisors $1, 2, 4$, giving $3$ subgroups of rotations, and $1 + 2 + 4 = 7$ subgroups with reflections, so $10$ in all.\n\nCheck: the $7$ with reflections are the $4$ subgroups $\\langle s \\rangle$, $\\langle rs \\rangle$, $\\langle r^2s \\rangle$, $\\langle r^3s \\rangle$ of size $2$, the $2$ subgroups $\\langle r^2, s \\rangle$ and $\\langle r^2, rs \\rangle$ of size $4$, and $D_4$ itself: $4 + 2 + 1 = 7$.\n\n> **Watch out.** Add the two kinds: the answer is the number of divisors plus their sum, not either one alone.",
    "$D_n$ 的子群要么只含旋转，要么还含反射。旋转构成循环群，$n$ 的每个因数对应一个子群。含反射的子群由它的旋转部分（在旋转群中指数为 $d$）和 $d$ 族反射之一确定。所以这样的子群有 $\\sigma(n)$ 个，即因数之和。\n\n对图中正方形的对称群 $D_4$：$4$ 有 $1, 2, 4$ 这 $3$ 个因数，给出 $3$ 个只含旋转的子群；含反射的子群有 $1 + 2 + 4 = 7$ 个；共 $10$ 个。\n\n检验：含反射的 $7$ 个是大小为 $2$ 的 $4$ 个子群 $\\langle s \\rangle$、$\\langle rs \\rangle$、$\\langle r^2s \\rangle$、$\\langle r^3s \\rangle$，大小为 $4$ 的 $2$ 个子群 $\\langle r^2, s \\rangle$ 与 $\\langle r^2, rs \\rangle$，以及 $D_4$ 本身：$4 + 2 + 1 = 7$。\n\n> **注意。** 两类要相加：答案是因数的个数加上因数之和，而不是其中之一。",
  ),
  generate(rng) {
    const n = rng.int(3, 40);
    const list = divisors(n);
    const tau = list.length;
    const sigma = sum(list);
    const answer = tau + sigma;
    return numberProblem({
      prompt: t(
        `How many subgroups does the dihedral group of symmetries of a regular ${n}-gon have, counting the trivial subgroup and the whole group?`,
        `正 ${n} 边形的二面体对称群有多少个子群（包括平凡子群和整个群）？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          tau,
          "That counts only the subgroups of rotations; the subgroups containing reflections count too.",
          "那只数了只含旋转的子群；含反射的子群也要算。",
        ),
        why(
          sigma,
          "That counts only the subgroups containing reflections; the subgroups of rotations count too.",
          "那只数了含反射的子群；只含旋转的子群也要算。",
        ),
        why(
          tau + n,
          `That allows only the $${n}$ subgroups $\\langle r^ks \\rangle$ of size $2$ among those with reflections, leaving out the larger ones.`,
          `那在含反射的子群中只算了 $${n}$ 个大小为 $2$ 的子群 $\\langle r^ks \\rangle$，漏掉了更大的。`,
        ),
        why(tau + 1, "That allows only one subgroup with reflections, the whole group.", "那在含反射的子群中只算了整个群这一个。"),
      ]),
      solution: walked(
        [
          [
            ["List the divisors", "列出因数"],
            t(`The divisors of ${n} are ${list.join(", ")}: there are ${tau}.`, `${n} 的因数是 ${list.join("、")}：共 ${tau} 个。`),
          ],
          [
            ["Subgroups of rotations", "只含旋转的子群"],
            t(`One cyclic subgroup of rotations for each divisor: ${tau}.`, `每个因数对应一个旋转循环子群：${tau} 个。`),
          ],
          [["Subgroups with reflections", "含反射的子群"], t(`$${list.join(" + ")} = ${sigma}$.`, `$${list.join(" + ")} = ${sigma}$。`)],
        ],
        t(
          `In all $${tau} + ${sigma} = ${answer}$. Among those with reflections, the divisor $${n}$ gives the $${n}$ subgroups $\\langle r^ks \\rangle$ of size $2$, and the divisor $1$ gives the whole group.`,
          `共 $${tau} + ${sigma} = ${answer}$ 个。在含反射的子群中，因数 $${n}$ 给出 $${n}$ 个大小为 $2$ 的子群 $\\langle r^ks \\rangle$，因数 $1$ 给出整个群。`,
        ),
      ),
    });
  },
};

const largestOrderInAProduct: KnowledgePointDef = {
  id: "the-largest-order-of-an-element-of-a-product",
  title: t("The largest order of an element of a product", "直积中元素的最大阶"),
  explanation: t(
    "An element of a product of cyclic groups has as its order the least common multiple of the orders of its components. That is largest when each component is a generator, which gives the least common multiple of all the factors' orders. In a finite abelian group, every element's order divides this largest order.\n\nIn $\\mathbb{Z}_{30} \\times \\mathbb{Z}_{42} \\times \\mathbb{Z}_{35}$ the largest order is $\\operatorname{lcm}(30, 42, 35) = 210$, reached by $(1, 1, 1)$.\n\nCheck: $\\frac{210}{30} = 7$, $\\frac{210}{42} = 5$ and $\\frac{210}{35} = 6$ are whole, and no smaller number is a multiple of all three.\n\n> **Watch out.** The product $30 \\cdot 42 \\cdot 35 = 44100$ is the size of the group, not the order of an element. They agree only when the orders are pairwise coprime, which is when the product is cyclic.",
    "循环群之积中元素的阶，是各分量阶的最小公倍数。当每个分量都是生成元时它最大，这时得到所有因子阶的最小公倍数。在有限交换群中，每个元素的阶都整除这个最大阶。\n\n在 $\\mathbb{Z}_{30} \\times \\mathbb{Z}_{42} \\times \\mathbb{Z}_{35}$ 中，最大阶是 $\\operatorname{lcm}(30, 42, 35) = 210$，由 $(1, 1, 1)$ 达到。\n\n检验：$\\frac{210}{30} = 7$、$\\frac{210}{42} = 5$、$\\frac{210}{35} = 6$ 都是整数，且没有更小的数同时是三者的倍数。\n\n> **注意。** 乘积 $30 \\cdot 42 \\cdot 35 = 44100$ 是群的大小，不是元素的阶。只有各阶两两互素，即直积是循环群时，两者才相等。",
  ),
  generate(rng) {
    const a = rng.int(2, 24);
    const b = rng.int(2, 24);
    const c = rng.int(2, 24);
    const answer = lcm(lcm(a, b), c);
    const group = [a, b, c].map(Zn).join(" \\times ");
    return numberProblem({
      prompt: t(`What is the largest order of an element of $${group}$?`, `$${group}$ 中元素的最大阶是多少？`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          a * b * c,
          "That is the size of the group; an element's order is a least common multiple.",
          "那是群的大小；元素的阶是最小公倍数。",
        ),
        why(
          Math.max(a, b, c),
          "That is the largest factor alone; a generator in every factor does better.",
          "那只是最大的因子；每个因子都取生成元会更大。",
        ),
        why(a + b + c, "Orders of components combine by least common multiple, not by adding.", "各分量的阶按最小公倍数合成，不是相加。"),
      ]),
      solution: walked(
        [
          [
            ["Take generators", "取生成元"],
            t(
              `$(1, 1, 1)$ has components of orders $${a}$, $${b}$ and $${c}$, the largest each factor allows.`,
              `$(1, 1, 1)$ 的各分量阶为 $${a}$、$${b}$、$${c}$，是每个因子允许的最大值。`,
            ),
          ],
          [
            ["Take the lcm", "取最小公倍数"],
            t(
              `Its order is $\\operatorname{lcm}(${a}, ${b}, ${c}) = ${answer}$.`,
              `它的阶是 $\\operatorname{lcm}(${a}, ${b}, ${c}) = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$\\frac{${answer}}{${a}} = ${answer / a}$, $\\frac{${answer}}{${b}} = ${answer / b}$ and $\\frac{${answer}}{${c}} = ${answer / c}$ are all whole numbers.`,
          `$\\frac{${answer}}{${a}} = ${answer / a}$、$\\frac{${answer}}{${b}} = ${answer / b}$、$\\frac{${answer}}{${c}} = ${answer / c}$ 都是整数。`,
        ),
      ),
    });
  },
};

const latticeSubgroups: KnowledgePointDef = {
  id: "counting-subgroups-of-a-given-index-in-z2",
  title: t("Counting subgroups of a given index in $\\mathbb{Z}^2$", "数 $\\mathbb{Z}^2$ 中给定指数的子群"),
  explanation: t(
    "Every subgroup of index $n$ in $\\mathbb{Z}^2$ has a unique basis of the form $(a, b)$, $(0, d)$ with $ad = n$ and $0 \\le b < d$. This is the integer form of row reduction. Each divisor $d$ of $n$ allows $d$ values of $b$. So the number of such subgroups is the sum of the divisors of $n$.\n\nFor index $100$ the divisors are $1, 2, 4, 5, 10, 20, 25, 50, 100$, so $\\mathbb{Z}^2$ has $1 + 2 + 4 + 5 + 10 + 20 + 25 + 50 + 100 = 217$ subgroups of index $100$.\n\nCheck: the sum of divisors multiplies over coprime parts, and $(1 + 2 + 4)(1 + 5 + 25) = 7 \\cdot 31 = 217$.\n\n> **Watch out.** Each divisor $d$ contributes $d$ subgroups, one for each $b$ with $0 \\le b < d$, not just one. Counting the divisors alone would give $9$.",
    "$\\mathbb{Z}^2$ 中指数为 $n$ 的子群都有唯一的形如 $(a, b)$、$(0, d)$ 的基，其中 $ad = n$，$0 \\le b < d$。这就是整数上的行化简。$n$ 的每个因数 $d$ 允许 $b$ 取 $d$ 个值。所以这样的子群个数是 $n$ 的因数之和。\n\n指数为 $100$ 时，因数为 $1, 2, 4, 5, 10, 20, 25, 50, 100$，所以 $\\mathbb{Z}^2$ 有 $1 + 2 + 4 + 5 + 10 + 20 + 25 + 50 + 100 = 217$ 个指数为 $100$ 的子群。\n\n检验：因数和对互素的部分可乘，$(1 + 2 + 4)(1 + 5 + 25) = 7 \\cdot 31 = 217$。\n\n> **注意。** 每个因数 $d$ 贡献 $d$ 个子群，对应满足 $0 \\le b < d$ 的每个 $b$，而不只是一个。只数因数会得到 $9$。",
  ),
  generate(rng) {
    const n = rng.int(2, 60);
    const list = divisors(n);
    const answer = sum(list);
    return numberProblem({
      prompt: t(`How many subgroups of index ${n} does $\\mathbb{Z}^2$ have?`, `$\\mathbb{Z}^2$ 有多少个指数为 ${n} 的子群？`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          list.length,
          "That counts the divisors $d$; each one allows $d$ choices of $b$.",
          "那是因数 $d$ 的个数；每个 $d$ 允许 $b$ 有 $d$ 种取法。",
        ),
        why(n, "That is only the $d = n$ part, the subgroups with $a = 1$.", "那只是 $d = n$ 的部分，即 $a = 1$ 的子群。"),
        why(n * n, "That is the index of $n\\mathbb{Z}^2$, not a count of subgroups.", "那是 $n\\mathbb{Z}^2$ 的指数，不是子群的个数。"),
      ]),
      solution: walked(
        [
          [
            ["List the divisors", "列出因数"],
            t(`The divisors of $${n}$ are $${list.join(", ")}$.`, `$${n}$ 的因数为 $${list.join(", ")}$。`),
          ],
          [
            ["Add them", "相加"],
            t(
              `Each divisor $d$ gives $d$ subgroups, so the count is $${list.join(" + ")} = ${answer}$.`,
              `每个因数 $d$ 给出 $d$ 个子群，所以个数是 $${list.join(" + ")} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The divisor $d = ${n}$ alone gives the $${n}$ subgroups with $a = 1$, and the rest add $${answer - n}$.`,
          `仅因数 $d = ${n}$ 就给出 $a = 1$ 的 $${n}$ 个子群，其余的再加 $${answer - n}$ 个。`,
        ),
      ),
    });
  },
};

const dihedralNormalSubgroups: KnowledgePointDef = {
  id: "counting-the-normal-subgroups-of-a-dihedral-group",
  figure: algebraDrawings2["normal-subgroups#counting-the-normal-subgroups-of-a-dihedral-group"],
  title: t("Counting the normal subgroups of a dihedral group", "数二面体群的正规子群"),
  explanation: t(
    "In $D_n$ with $n \\ge 3$, every subgroup of rotations is normal, because conjugating a rotation gives a power of it. A normal subgroup containing a reflection must contain all of its conjugates. For odd $n$ that forces the whole group. For even $n$ the reflections form two classes, which adds two subgroups of index 2.\n\nThe figure shows $D_4$: the $3$ rotation subgroups $\\langle r \\rangle$, $\\langle r^2 \\rangle$ and $\\{e\\}$, the $2$ subgroups $\\langle r^2, s \\rangle$ and $\\langle r^2, rs \\rangle$ of index $2$, and $D_4$ itself, $6$ normal subgroups in all. For $D_{45}$, the divisors $1, 3, 5, 9, 15, 45$ give $6$ rotation subgroups, and $45$ is odd, so only $D_{45}$ itself is added: $7$.\n\nCheck: $45 = 3^2 \\cdot 5$ has $(2 + 1)(1 + 1) = 6$ divisors.\n\n> **Watch out.** The whole group is not one of the rotation subgroups, so add it separately; the trivial subgroup $\\{e\\}$ is already the rotation subgroup for the divisor $1$.",
    "在 $n \\ge 3$ 的 $D_n$ 中，旋转构成的子群都是正规的，因为旋转的共轭仍是它的幂。含反射的正规子群必须含这个反射的所有共轭。$n$ 为奇数时这就迫使它是整个群。$n$ 为偶数时反射分成两个共轭类，于是多出两个指数为 2 的子群。\n\n图中是 $D_4$：$3$ 个旋转子群 $\\langle r \\rangle$、$\\langle r^2 \\rangle$、$\\{e\\}$，$2$ 个指数为 $2$ 的子群 $\\langle r^2, s \\rangle$、$\\langle r^2, rs \\rangle$，以及 $D_4$ 本身，共 $6$ 个正规子群。对 $D_{45}$，因数 $1, 3, 5, 9, 15, 45$ 给出 $6$ 个旋转子群，而 $45$ 是奇数，只再加上 $D_{45}$ 本身：共 $7$ 个。\n\n检验：$45 = 3^2 \\cdot 5$ 有 $(2 + 1)(1 + 1) = 6$ 个因数。\n\n> **注意。** 整个群不在旋转子群之中，要另外加上；平凡子群 $\\{e\\}$ 已经是因数 $1$ 对应的旋转子群。",
  ),
  generate(rng) {
    const n = rng.int(3, 40);
    const tau = divisors(n).length;
    const even = n % 2 === 0;
    const answer = tau + (even ? 3 : 1);
    return numberProblem({
      prompt: t(
        `How many normal subgroups does the dihedral group of symmetries of a regular ${n}-gon have, counting the trivial subgroup and the whole group?`,
        `正 ${n} 边形的二面体对称群有多少个正规子群（包括平凡子群和整个群）？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          tau,
          even
            ? "That counts only the rotation subgroups; add the whole group and the two subgroups of index $2$."
            : "That counts only the rotation subgroups; the whole group is normal too.",
          even ? "那只数了旋转子群；还要加上整个群和两个指数为 $2$ 的子群。" : "那只数了旋转子群；整个群也是正规的。",
        ),
        why(
          even ? tau + 1 : tau + 3,
          even
            ? "That leaves out the two subgroups of index $2$ that contain reflections."
            : `The two extra subgroups of index $2$ exist only for even $n$, and $${n}$ is odd.`,
          even ? "那漏掉了两个含反射的指数为 $2$ 的子群。" : `多出的两个指数为 $2$ 的子群只在 $n$ 为偶数时存在，而 $${n}$ 是奇数。`,
        ),
        why(tau + sum(divisors(n)), "That counts every subgroup, not only the normal ones.", "那数的是所有子群，不只是正规子群。"),
      ]),
      solution: walked(
        [
          [
            ["Count the rotation subgroups", "数旋转子群"],
            t(
              `The divisors of $${n}$ are $${divisors(n).join(", ")}$, which give $${tau}$ subgroups of rotations, all normal.`,
              `$${n}$ 的因数为 $${divisors(n).join(", ")}$，给出 $${tau}$ 个旋转子群，都是正规的。`,
            ),
          ],
          even
            ? [
                ["Add the subgroups with reflections", "加上含反射的子群"],
                t(
                  `Since $${n}$ is even, the whole group and two subgroups of index $2$ are also normal: $${tau} + 3 = ${answer}$.`,
                  `由于 $${n}$ 是偶数，整个群和两个指数为 $2$ 的子群也是正规的：$${tau} + 3 = ${answer}$。`,
                ),
              ]
            : [
                ["Add the whole group", "加上整个群"],
                t(
                  `Since $${n}$ is odd, the only other normal subgroup is the whole group: $${tau} + 1 = ${answer}$.`,
                  `由于 $${n}$ 是奇数，其余的正规子群只有整个群：$${tau} + 1 = ${answer}$。`,
                ),
              ],
        ],
        even
          ? t(
              `Each subgroup of index $2$ has $${n}$ of the $${2 * n}$ elements: half the rotations and half the reflections.`,
              `每个指数为 $2$ 的子群含 $${2 * n}$ 个元素中的 $${n}$ 个：一半旋转与一半反射。`,
            )
          : t(
              `All $${n}$ reflections are conjugate when $${n}$ is odd, and with $e$ they generate the whole group.`,
              `$${n}$ 为奇数时 $${n}$ 个反射全都共轭，它们与 $e$ 一起生成整个群。`,
            ),
      ),
    });
  },
};

/** totientTex writes φ(n) by the product formula, as n · (p − 1)/p · … = φ(n). */
const totientTex = (n: number) =>
  `\\varphi(${n}) = ${n} \\cdot ${primes(n)
    .map((p) => `\\frac{${p - 1}}{${p}}`)
    .join(" \\cdot ")} = ${totient(n)}`;

const surjectiveHomomorphisms: KnowledgePointDef = {
  id: "counting-surjective-homomorphisms-between-cyclic-groups",
  title: t("Counting surjective homomorphisms between cyclic groups", "数循环群之间的满同态"),
  explanation: t(
    "A homomorphism out of a cyclic group is fixed by the image of a generator. When $n$ divides $m$, any element of $\\mathbb{Z}_n$ can be that image. The homomorphism is surjective exactly when the image generates $\\mathbb{Z}_n$, and there are $\\varphi(n)$ generators. For $\\mathbb{Z}_{12} \\to \\mathbb{Z}_4$, the generators of $\\mathbb{Z}_4$ are $1$ and $3$, so there are $\\varphi(4) = 2$ surjective homomorphisms.\n\nCheck: $12 \\cdot 3 = 36 = 9 \\cdot 4$, so $1 \\mapsto 3$ is allowed, and its image $\\{0, 3, 2, 1\\}$ is all of $\\mathbb{Z}_4$. The map $1 \\mapsto 2$ is allowed too, but its image is only $\\{0, 2\\}$.\n\n> **Watch out.** Count the generators of the target $\\mathbb{Z}_n$, not of the source $\\mathbb{Z}_m$: the size of $m$ does not matter beyond being a multiple of $n$.",
    "循环群出发的同态由生成元的像确定。当 $n$ 整除 $m$ 时，$\\mathbb{Z}_n$ 的任何元素都可以作这个像。同态是满射，当且仅当这个像生成 $\\mathbb{Z}_n$，而生成元有 $\\varphi(n)$ 个。对 $\\mathbb{Z}_{12} \\to \\mathbb{Z}_4$，$\\mathbb{Z}_4$ 的生成元是 $1$ 和 $3$，所以满同态有 $\\varphi(4) = 2$ 个。\n\n检验：$12 \\cdot 3 = 36 = 9 \\cdot 4$，所以 $1 \\mapsto 3$ 是允许的，它的像 $\\{0, 3, 2, 1\\}$ 是整个 $\\mathbb{Z}_4$。映射 $1 \\mapsto 2$ 也是允许的，但它的像只有 $\\{0, 2\\}$。\n\n> **注意。** 要数目标群 $\\mathbb{Z}_n$ 的生成元，而不是源群 $\\mathbb{Z}_m$ 的：$m$ 的大小除了是 $n$ 的倍数以外没有影响。",
  ),
  generate(rng) {
    for (;;) {
      const n = rng.int(3, 20);
      const m = n * rng.int(2, 9);
      const answer = totient(n);
      const gens = range(1, n - 1).filter((k) => gcd(k, n) === 1);
      const mistakes = apart(answer, [
        why(
          n,
          `That counts every homomorphism, but $\\varphi(1) = k$ gives a surjection only when $k$ generates $${Zn(n)}$.`,
          `那数的是所有同态，但只有当 $k$ 生成 $${Zn(n)}$ 时，$\\varphi(1) = k$ 才给出满射。`,
        ),
        why(
          totient(m),
          `That counts the generators of $${Zn(m)}$, the source; the image of $1$ has to generate the target $${Zn(n)}$.`,
          `那数的是源群 $${Zn(m)}$ 的生成元；$1$ 的像必须生成目标群 $${Zn(n)}$。`,
        ),
        why(
          n - 1,
          `That counts every nonzero $k$, but for example $k = ${primes(n)[0]}$ only generates $\\langle ${primes(n)[0]} \\rangle$, not all of $${Zn(n)}$.`,
          `那数的是所有非零的 $k$，但例如 $k = ${primes(n)[0]}$ 只生成 $\\langle ${primes(n)[0]} \\rangle$，不是整个 $${Zn(n)}$。`,
        ),
        why(
          m,
          `That counts the elements of $${Zn(m)}$, but a homomorphism is fixed by the image of $1$ in $${Zn(n)}$.`,
          `那数的是 $${Zn(m)}$ 的元素，但同态由 $1$ 在 $${Zn(n)}$ 中的像决定。`,
        ),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `How many surjective homomorphisms are there from $${Zn(m)}$ to $${Zn(n)}$?`,
          `从 $${Zn(m)}$ 到 $${Zn(n)}$ 的满同态有多少个？`,
        ),
        answer,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [
              ["Fix the generator", "看生成元"],
              t(
                `A homomorphism is fixed by $k = \\varphi(1)$, and every $k$ is allowed, because $${n}$ divides $${m}$, so $${m} \\cdot k \\equiv 0 \\pmod{${n}}$.`,
                `同态由 $k = \\varphi(1)$ 决定；由于 $${n}$ 整除 $${m}$，有 $${m} \\cdot k \\equiv 0 \\pmod{${n}}$，所以每个 $k$ 都允许。`,
              ),
            ],
            [
              ["Ask for onto", "要求满射"],
              t(
                `The image is $\\langle k \\rangle$, which is all of $${Zn(n)}$ exactly when $\\gcd(k, ${n}) = 1$.`,
                `像是 $\\langle k \\rangle$，它是整个 $${Zn(n)}$ 当且仅当 $\\gcd(k, ${n}) = 1$。`,
              ),
            ],
            [
              ["Count", "计数"],
              t(`The generators are $${gens.join(", ")}$: $${answer}$ of them.`, `生成元是 $${gens.join(", ")}$，共 $${answer}$ 个。`),
            ],
          ],
          t(`By the product formula, $${totientTex(n)}$.`, `由乘积公式，$${totientTex(n)}$。`),
        ),
      });
    }
  },
};

const automorphismCount: KnowledgePointDef = {
  id: "counting-automorphisms-of-a-cyclic-group",
  title: t("Counting automorphisms of a cyclic group", "数循环群的自同构"),
  explanation: t(
    "An automorphism of a cyclic group sends a generator to a generator, and each choice of generator gives exactly one automorphism. So $\\mathbb{Z}_n$ has $\\varphi(n)$ automorphisms. A product of cyclic groups of coprime orders is itself cyclic, by the Chinese remainder theorem, so the same count applies to the order of the whole product. For example $\\mathbb{Z}_3 \\times \\mathbb{Z}_4 \\cong \\mathbb{Z}_{12}$ has $\\varphi(12) = 4$ automorphisms, one for each of the generators $1, 5, 7, 11$.\n\nCheck: $\\varphi$ is multiplicative on coprime numbers, and $\\varphi(3) \\cdot \\varphi(4) = 2 \\cdot 2 = 4$.\n\n> **Watch out.** Multiply $\\varphi(m)$ and $\\varphi(n)$, do not add them: here $2 + 2 = 4$ happens to agree, but for $\\mathbb{Z}_3 \\times \\mathbb{Z}_5$ the sum $2 + 4 = 6$ is wrong and the product $8$ is right.",
    "循环群的自同构把生成元映到生成元，每种选择恰好给出一个自同构。所以 $\\mathbb{Z}_n$ 有 $\\varphi(n)$ 个自同构。由中国剩余定理，阶互素的循环群之积本身是循环群，所以同样的计数适用于整个积的阶。例如 $\\mathbb{Z}_3 \\times \\mathbb{Z}_4 \\cong \\mathbb{Z}_{12}$ 有 $\\varphi(12) = 4$ 个自同构，分别对应生成元 $1, 5, 7, 11$。\n\n检验：$\\varphi$ 对互素的数是积性的，而 $\\varphi(3) \\cdot \\varphi(4) = 2 \\cdot 2 = 4$。\n\n> **注意。** 要把 $\\varphi(m)$ 与 $\\varphi(n)$ 相乘，而不是相加：这里 $2 + 2 = 4$ 恰好一致，但对 $\\mathbb{Z}_3 \\times \\mathbb{Z}_5$，和 $2 + 4 = 6$ 是错的，积 $8$ 才对。",
  ),
  generate(rng) {
    for (;;) {
      const [m, n] = rng.pick(
        range(2, 16)
          .flatMap((i) => range(i + 1, 17).map((j) => [i, j] as const))
          .filter(([i, j]) => gcd(i, j) === 1),
      );
      const answer = totient(m * n);
      const [a, b] = [totient(m), totient(n)];
      const mistakes = apart(answer, [
        why(
          m * n,
          `That counts every element of the group, but an automorphism must send $(1, 1)$ to a generator.`,
          "那数的是群的所有元素，但自同构必须把 $(1, 1)$ 送到生成元。",
        ),
        why(
          a + b,
          `That adds $\\varphi(${m}) = ${a}$ and $\\varphi(${n}) = ${b}$; a generator pairs a generator of each factor, so multiply.`,
          `那是把 $\\varphi(${m}) = ${a}$ 与 $\\varphi(${n}) = ${b}$ 相加；生成元由每个因子的生成元配对而成，所以要相乘。`,
        ),
        why(
          m * n - 1,
          "That counts every nonzero element, but only the generators give automorphisms.",
          "那数的是所有非零元素，但只有生成元给出自同构。",
        ),
        why(
          (m - 1) * (n - 1),
          "That pairs the nonzero elements of the factors, but each coordinate must be a generator of its factor.",
          "那是把两个因子的非零元素配对，但每个坐标都必须是所在因子的生成元。",
        ),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(`How many automorphisms does $${Zn(m)} \\times ${Zn(n)}$ have?`, `$${Zn(m)} \\times ${Zn(n)}$ 有多少个自同构？`),
        answer,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [
              ["Make it cyclic", "化为循环群"],
              t(
                `Since $${m}$ and $${n}$ are coprime, $${Zn(m)} \\times ${Zn(n)} \\cong ${Zn(m * n)}$.`,
                `由于 $${m}$ 与 $${n}$ 互素，$${Zn(m)} \\times ${Zn(n)} \\cong ${Zn(m * n)}$。`,
              ),
            ],
            [
              ["Count generators", "数生成元"],
              t(
                `An automorphism sends a generator to a generator, so there are $\\varphi(${m * n})$ of them.`,
                `自同构把生成元送到生成元，所以共有 $\\varphi(${m * n})$ 个。`,
              ),
            ],
            [
              ["Multiply", "相乘"],
              t(
                `$\\varphi(${m * n}) = \\varphi(${m}) \\cdot \\varphi(${n}) = ${a} \\cdot ${b} = ${answer}$.`,
                `$\\varphi(${m * n}) = \\varphi(${m}) \\cdot \\varphi(${n}) = ${a} \\cdot ${b} = ${answer}$。`,
              ),
            ],
          ],
          t(`By the product formula, $${totientTex(m * n)}$.`, `由乘积公式，$${totientTex(m * n)}$。`),
        ),
      });
    }
  },
};

const setStabilizer: KnowledgePointDef = {
  id: "the-stabilizer-of-a-subset",
  title: t("The stabilizer of a subset", "子集的稳定子"),
  explanation: t(
    "A permutation can fix a subset as a whole without fixing each of its elements. It must then rearrange the subset among itself, and rearrange the rest among itself, independently. So the stabilizer of a set of $k$ symbols in $S_n$ has order $k!(n - k)!$. This agrees with the orbit-stabilizer theorem, as the orbit has $\\binom{n}{k}$ elements.",
    "置换可以整体保持一个子集不变，而不固定其中每个元素。这时它必须在子集内部重排，也在其余部分内部重排，两者相互独立。所以 $S_n$ 中 $k$ 个符号的集合的稳定子阶为 $k!(n - k)!$。这与轨道-稳定子定理一致，因为轨道有 $\\binom{n}{k}$ 个元素。",
  ),
  generate(rng) {
    const n = rng.int(5, 12);
    const k = rng.int(2, n - 2);
    const factorial = (m: number): number => (m < 2 ? 1 : m * factorial(m - 1));
    const answer = factorial(k) * factorial(n - k);
    return numberProblem({
      prompt: t(
        `In the action of $S_{${n}}$ on subsets of $\\{1, \\dots, ${n}\\}$, what is the order of the stabilizer of $\\{${range(1, k).join(", ")}\\}$?`,
        `在 $S_{${n}}$ 对 $\\{1, \\dots, ${n}\\}$ 的子集的作用下，$\\{${range(1, k).join(", ")}\\}$ 的稳定子的阶是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [factorial(n - k), factorial(n) / answer, factorial(n) / factorial(k)],
      solution: t(
        `The stabilizer rearranges the ${k} symbols of the set and the other ${n - k} symbols separately, in $${k}! \\cdot ${n - k}! = ${answer}$ ways.`,
        `稳定子分别重排集合中的 ${k} 个符号和其余 ${n - k} 个符号，共 $${k}! \\cdot ${n - k}! = ${answer}$ 种方式。`,
      ),
    });
  },
};

const elementsOfPrimeOrder: KnowledgePointDef = {
  id: "elements-of-prime-order-from-the-sylow-count",
  title: t("Elements of prime order from the Sylow count", "由西罗子群个数求素数阶元素"),
  explanation: t(
    "If a prime $p$ divides the order of a group only once, each Sylow $p$-subgroup is cyclic of order $p$. Two different such subgroups meet only in the identity, and every element of order $p$ lies in exactly one. So $s$ Sylow subgroups give $s(p - 1)$ elements of order $p$. This counting often leaves too little room for other subgroups.\n\n$A_5$ has order $60 = 4 \\cdot 3 \\cdot 5$ and $6$ Sylow $5$-subgroups. Since $5$ divides $60$ only once, they give $6 \\cdot 4 = 24$ elements of order $5$.\n\nCheck: the elements of order $5$ in $A_5$ are the five-cycles, and there are $\\frac{5!}{5} = 24$ of them.\n\n> **Watch out.** The count needs $p$ to divide the order only once: $S_4$ has $3$ Sylow $2$-subgroups of order $8$, but they share elements, and $S_4$ has only $15$ elements of order $2$ or $4$, not $3 \\cdot 7 = 21$.",
    "如果素数 $p$ 只整除群的阶一次，每个西罗 $p$ 子群都是 $p$ 阶循环群。两个不同的这种子群只有单位元这一个公共元素，每个 $p$ 阶元素恰在其中一个子群里。所以 $s$ 个西罗子群给出 $s(p - 1)$ 个 $p$ 阶元素。这种计数常常说明其他子群已没有足够的位置。\n\n$A_5$ 的阶为 $60 = 4 \\cdot 3 \\cdot 5$，有 $6$ 个西罗 $5$ 子群。由于 $5$ 只整除 $60$ 一次，它们给出 $6 \\cdot 4 = 24$ 个 $5$ 阶元素。\n\n检验：$A_5$ 中的 $5$ 阶元素就是 $5$-轮换，共有 $\\frac{5!}{5} = 24$ 个。\n\n> **注意。** 这种计数要求 $p$ 只整除群的阶一次：$S_4$ 有 $3$ 个 $8$ 阶西罗 $2$ 子群，但它们有公共元素，$S_4$ 中 $2$ 阶或 $4$ 阶元素只有 $15$ 个，而不是 $3 \\cdot 7 = 21$ 个。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [2, 3],
      [2, 5],
      [2, 7],
      [2, 11],
      [2, 13],
      [3, 7],
      [3, 13],
      [3, 19],
      [3, 31],
      [3, 37],
      [5, 11],
      [5, 31],
      [5, 41],
      [7, 29],
      [7, 43],
    ] as const);
    const r = rng.pick(range(1, 6).filter((i) => i % p !== 0));
    const answer = q * (p - 1);
    return numberProblem({
      prompt: t(
        `A group of order ${p * q * r} has exactly ${q} Sylow ${p}-subgroups. How many elements of order ${p} does it have?`,
        `${p * q * r} 阶群恰有 ${q} 个西罗 ${p} 子群。它有多少个 ${p} 阶元素？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          q,
          `${q} is the number of subgroups; each contributes $${p} - 1$ elements of order ${p}.`,
          `${q} 是子群的个数；每个子群贡献 $${p} - 1$ 个 ${p} 阶元素。`,
        ),
        why(
          p * q,
          "Each subgroup has the identity too, which has order $1$ and is shared by all of them.",
          "每个子群都含单位元，它的阶是 $1$，并且是所有子群共有的。",
        ),
        why(answer + 1, "The identity has order $1$, so it is not counted.", "单位元的阶是 $1$，所以不计入。"),
      ]),
      solution: walked(
        [
          [
            ["Size each Sylow subgroup", "确定西罗子群的大小"],
            t(
              `Since ${p} divides ${p * q * r} only once, each Sylow subgroup is cyclic of order ${p}, and all of its elements except the identity have order ${p}.`,
              `由于 ${p} 只整除 ${p * q * r} 一次，每个西罗子群都是 ${p} 阶循环群，除单位元外它的元素都是 ${p} 阶。`,
            ),
          ],
          [
            ["Count without overlap", "不重复地计数"],
            p === 2
              ? t(
                  `Two different subgroups meet only in the identity, so each of the ${q} subgroups gives one element of order 2: ${answer} in all.`,
                  `两个不同的子群只交于单位元，所以 ${q} 个子群各给出一个 2 阶元素：共 ${answer} 个。`,
                )
              : t(
                  `Two different subgroups meet only in the identity, so the ${q} subgroups give $${q} \\cdot ${p - 1} = ${answer}$ elements of order ${p}.`,
                  `两个不同的子群只交于单位元，所以 ${q} 个子群给出 $${q} \\cdot ${p - 1} = ${answer}$ 个 ${p} 阶元素。`,
                ),
          ],
        ],
        t(
          `The ${q} subgroups have $${q} \\cdot ${p} = ${p * q}$ elements counted with repetition, and removing the identity from each leaves $${p * q} - ${q} = ${answer}$.`,
          `${q} 个子群重复计数共 $${q} \\cdot ${p} = ${p * q}$ 个元素，从每个中去掉单位元，剩下 $${p * q} - ${q} = ${answer}$ 个。`,
        ),
      ),
    });
  },
};

const subgroupsOfPrimeOrder: KnowledgePointDef = {
  id: "counting-subgroups-of-prime-order-in-an-abelian-p-group",
  title: t("Counting subgroups of prime order in an abelian p-group", "数交换 p 群中的素数阶子群"),
  explanation: t(
    "In a product of $k$ nontrivial cyclic $p$-groups, each factor has a unique subgroup of order $p$, whatever its size. So the elements with $x^p = e$ form a group of order $p^k$, which leaves $p^k - 1$ elements of order $p$. Each subgroup of order $p$ contains $p - 1$ of them, so dividing counts the subgroups.\n\nIn $\\mathbb{Z}_{11} \\times \\mathbb{Z}_{121}$ there are $k = 2$ factors, so there are $11^2 - 1 = 120$ elements of order $11$. They give $\\frac{120}{10} = 12$ subgroups of order $11$.\n\nCheck: $12 = 1 + 11$, one subgroup inside each factor and $10$ more that mix the two.\n\n> **Watch out.** Only the number of factors matters, not their sizes: $\\mathbb{Z}_8 \\times \\mathbb{Z}_2$ and $\\mathbb{Z}_2 \\times \\mathbb{Z}_2$ both have $3$ subgroups of order $2$.",
    "在 $k$ 个非平凡循环 $p$ 群之积中，每个因子无论多大，都恰有一个 $p$ 阶子群。所以满足 $x^p = e$ 的元素构成 $p^k$ 阶群，其中有 $p^k - 1$ 个 $p$ 阶元素。每个 $p$ 阶子群含其中 $p - 1$ 个，相除就得到子群个数。\n\n在 $\\mathbb{Z}_{11} \\times \\mathbb{Z}_{121}$ 中有 $k = 2$ 个因子，所以有 $11^2 - 1 = 120$ 个 $11$ 阶元素。它们给出 $\\frac{120}{10} = 12$ 个 $11$ 阶子群。\n\n检验：$12 = 1 + 11$，每个因子里各有一个子群，另有 $10$ 个混合两个因子。\n\n> **注意。** 只有因子的个数起作用，与它们的大小无关：$\\mathbb{Z}_8 \\times \\mathbb{Z}_2$ 与 $\\mathbb{Z}_2 \\times \\mathbb{Z}_2$ 都有 $3$ 个 $2$ 阶子群。",
  ),
  generate(rng) {
    const p = rng.pick([2, 3, 5, 7]);
    const k = rng.int(2, 4);
    const orders = range(1, k).map(() => p ** rng.int(1, 3));
    const elements = p ** k - 1;
    const answer = elements / (p - 1);
    const group = orders.map(Zn).join(" \\times ");
    return numberProblem({
      prompt: t(`How many subgroups of order ${p} does $${group}$ have?`, `$${group}$ 有多少个 ${p} 阶子群？`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        p === 2
          ? why(p ** k, "That counts the identity too, which has order $1$.", "这把单位元也算进去了，它的阶是 $1$。")
          : why(
              elements,
              `That counts the elements of order ${p}; each subgroup holds $${p - 1}$ of them.`,
              `这数的是 ${p} 阶元素；每个子群含其中 $${p - 1}$ 个。`,
            ),
        why(
          k,
          "That counts one subgroup per factor, but elements mixing the factors give more.",
          "这只给每个因子数了一个子群，但混合各因子的元素给出更多。",
        ),
        why(
          p ** k + 1,
          `The subgroups number $\\frac{${p}^{${k}} - 1}{${p} - 1}$, which is less than $${p}^{${k}}$.`,
          `子群个数是 $\\frac{${p}^{${k}} - 1}{${p} - 1}$，它小于 $${p}^{${k}}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the elements of prime order", "找出素数阶元素"],
            t(
              `Each of the ${k} factors has a unique subgroup of order ${p}, so the elements with $x^{${p}} = e$ form a group of order $${p}^{${k}}$. That leaves $${p}^{${k}} - 1 = ${elements}$ elements of order ${p}.`,
              `${k} 个因子各恰有一个 ${p} 阶子群，所以满足 $x^{${p}} = e$ 的元素构成 $${p}^{${k}}$ 阶群。于是有 $${p}^{${k}} - 1 = ${elements}$ 个 ${p} 阶元素。`,
            ),
          ],
          [
            ["Divide among the subgroups", "分到各子群"],
            p === 2
              ? t(
                  `Each subgroup of order 2 holds exactly one of them, which gives ${answer} subgroups.`,
                  `每个 2 阶子群恰含其中一个，得 ${answer} 个子群。`,
                )
              : t(
                  `Each subgroup holds $${p - 1}$ of them, which gives $\\frac{${elements}}{${p - 1}} = ${answer}$ subgroups.`,
                  `每个子群含其中 $${p - 1}$ 个，得 $\\frac{${elements}}{${p - 1}} = ${answer}$ 个子群。`,
                ),
          ],
        ],
        t(
          `$${answer} = ${range(0, k - 1)
            .map((i) => p ** i)
            .join(" + ")}$, the count of subgroups of order ${p} in a space of ${k} coordinates.`,
          `$${answer} = ${range(0, k - 1)
            .map((i) => p ** i)
            .join(" + ")}$，正是 ${k} 个坐标的空间中 ${p} 阶子群的个数。`,
        ),
      ),
    });
  },
};

const nilpotentCount: KnowledgePointDef = {
  id: "counting-nilpotent-elements-of-zn",
  title: t("Counting nilpotent elements of $\\mathbb{Z}_n$", "数 $\\mathbb{Z}_n$ 的幂零元"),
  explanation: t(
    "An element is nilpotent if some power of it is zero. An integral domain has no nonzero nilpotents, but $\\mathbb{Z}_n$ can. A power of $a$ is divisible by $n$ exactly when every prime dividing $n$ divides $a$. So the nilpotents are the multiples of the product of the distinct primes of $n$.\n\nFor $n = 360 = 2^3 \\cdot 3^2 \\cdot 5$, the distinct primes multiply to $30$, so the nilpotents are the multiples of $30$ in $\\mathbb{Z}_{360}$, and there are $\\frac{360}{30} = 12$ of them.\n\nCheck: $30^3 = 27000 = 75 \\cdot 360$, so $30^3 = 0$ in $\\mathbb{Z}_{360}$.\n\n> **Watch out.** A zero divisor need not be nilpotent: in $\\mathbb{Z}_{12}$, $4 \\cdot 3 = 0$, but $4^2 = 16 = 4$, so no power of $4$ is zero.",
    "如果元素的某个幂是零，它就是幂零元。整环没有非零幂零元，但 $\\mathbb{Z}_n$ 可以有。$a$ 的某个幂被 $n$ 整除，当且仅当整除 $n$ 的每个素数都整除 $a$。所以幂零元就是 $n$ 的不同素因子之积的倍数。\n\n对 $n = 360 = 2^3 \\cdot 3^2 \\cdot 5$，不同素因子之积是 $30$，所以幂零元就是 $\\mathbb{Z}_{360}$ 中 $30$ 的倍数，共 $\\frac{360}{30} = 12$ 个。\n\n检验：$30^3 = 27000 = 75 \\cdot 360$，所以在 $\\mathbb{Z}_{360}$ 中 $30^3 = 0$。\n\n> **注意。** 零因子不一定是幂零元：在 $\\mathbb{Z}_{12}$ 中 $4 \\cdot 3 = 0$，但 $4^2 = 16 = 4$，所以 $4$ 的任何幂都不是零。",
  ),
  generate(rng) {
    const n = rng.pick(nonsquarefree(200));
    const r = radical(n);
    const answer = n / r;
    return numberProblem({
      prompt: t(`How many nilpotent elements does $${Zn(n)}$ have, counting zero?`, `$${Zn(n)}$ 有多少个幂零元（包括零）？`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          n - totient(n),
          "That counts every non-unit; a zero divisor need not have a power equal to zero.",
          "这数的是所有非单位；零因子的幂不一定是零。",
        ),
        why(
          r,
          `$${r}$ is the step between nilpotents; the count is $${n}$ divided by it.`,
          `$${r}$ 是相邻幂零元的间隔；个数是 $${n}$ 除以它。`,
        ),
        why(answer - 1, "Zero is nilpotent too, and the question counts it.", "零也是幂零元，题目要求把它算进去。"),
      ]),
      solution: walked(
        [
          [
            ["Find the distinct primes", "找出不同的素因子"],
            t(
              `The primes dividing ${n} are ${primes(n).join(", ")}, and they multiply to ${r}. An element is nilpotent exactly when it is a multiple of ${r}.`,
              `整除 ${n} 的素数是 ${primes(n).join("、")}，它们的积是 ${r}。元素是幂零元，当且仅当它是 ${r} 的倍数。`,
            ),
          ],
          [
            ["Count the multiples", "数倍数"],
            t(
              `The multiples of ${r} in $${Zn(n)}$ number $\\frac{${n}}{${r}} = ${answer}$, zero included.`,
              `$${Zn(n)}$ 中 ${r} 的倍数共 $\\frac{${n}}{${r}} = ${answer}$ 个，包括零。`,
            ),
          ],
        ],
        t(
          `$${r}$ is a multiple of every prime of ${n}, so a high enough power of ${r} is divisible by ${n}.`,
          `$${r}$ 是 ${n} 的每个素因子的倍数，所以 ${r} 的足够高次幂能被 ${n} 整除。`,
        ),
      ),
    });
  },
};

const idempotentCount: KnowledgePointDef = {
  id: "counting-idempotent-elements-of-zn",
  title: t("Counting idempotent elements of $\\mathbb{Z}_n$", "数 $\\mathbb{Z}_n$ 的幂等元"),
  explanation: t(
    "An element is idempotent if $a^2 = a$, that is, if $a(a - 1) = 0$. Since $a$ and $a - 1$ are coprime, each prime power in $n$ must divide one or the other, entirely. By the Chinese remainder theorem these choices are independent. So there is one idempotent for each way of choosing, and the zero and the unity are only two of them.\n\nFor $n = 300 = 2^2 \\cdot 3 \\cdot 5^2$ there are three prime powers, so $\\mathbb{Z}_{300}$ has $2^3 = 8$ idempotents. One of them is $76$, which is divisible by $4$ and leaves remainder $1$ on division by $3$ and by $25$.\n\nCheck: $76^2 = 5776 = 19 \\cdot 300 + 76$, so $76^2 = 76$ in $\\mathbb{Z}_{300}$.\n\n> **Watch out.** Count distinct primes, not prime factors with repetition: $12 = 2^2 \\cdot 3$ gives $2^2 = 4$ idempotents, namely $0, 1, 4, 9$, not $2^3$.",
    "如果 $a^2 = a$，即 $a(a - 1) = 0$，元素就是幂等元。由于 $a$ 和 $a - 1$ 互素，$n$ 中每个素数幂都必须整个整除其中一个。由中国剩余定理，这些选择相互独立。所以每种选法对应一个幂等元，零和幺元只是其中两个。\n\n对 $n = 300 = 2^2 \\cdot 3 \\cdot 5^2$，共有三个素数幂，所以 $\\mathbb{Z}_{300}$ 有 $2^3 = 8$ 个幂等元。其中一个是 $76$，它被 $4$ 整除，除以 $3$ 和除以 $25$ 都余 $1$。\n\n检验：$76^2 = 5776 = 19 \\cdot 300 + 76$，所以在 $\\mathbb{Z}_{300}$ 中 $76^2 = 76$。\n\n> **注意。** 要数不同的素数，而不是重复计数的素因子：$12 = 2^2 \\cdot 3$ 给出 $2^2 = 4$ 个幂等元，即 $0, 1, 4, 9$，而不是 $2^3$ 个。",
  ),
  generate(rng) {
    const n = rng.pick(range(6, 240).filter((i) => primes(i).length >= 2));
    const w = primes(n).length;
    const answer = 2 ** w;
    return numberProblem({
      prompt: t(`How many solutions does $a^2 = a$ have in $${Zn(n)}$?`, `$a^2 = a$ 在 $${Zn(n)}$ 中有多少个解？`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          2,
          `$0$ and $1$ are only two of them; mixed choices across the primes of ${n} give more.`,
          `$0$ 和 $1$ 只是其中两个；对 ${n} 的各素数混合选择还会给出更多。`,
        ),
        why(
          w,
          `${w} is the number of primes; each one doubles the count, so the count is $2^{${w}}$.`,
          `${w} 是素数的个数；每个素数使个数加倍，所以个数是 $2^{${w}}$。`,
        ),
        why(
          n - totient(n),
          "That counts the non-units; most of them do not satisfy $a^2 = a$.",
          "这数的是非单位；其中大多数不满足 $a^2 = a$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the prime powers", "找出素数幂"],
            t(
              `The primes dividing ${n} are ${primes(n).join(", ")}, so ${n} has ${w} prime power factors.`,
              `整除 ${n} 的素数是 ${primes(n).join("、")}，所以 ${n} 有 ${w} 个素数幂因子。`,
            ),
          ],
          [
            ["Choose for each", "逐个选择"],
            t(
              `Each prime power divides either $a$ or $a - 1$, and by the Chinese remainder theorem the choices are independent. This gives $2^{${w}} = ${answer}$ solutions.`,
              `每个素数幂要么整除 $a$，要么整除 $a - 1$，由中国剩余定理这些选择相互独立。于是得 $2^{${w}} = ${answer}$ 个解。`,
            ),
          ],
        ],
        t(
          `Choosing $a - 1$ for every prime power gives $a = 1$, and choosing $a$ for every one gives $a = 0$; the other $${answer - 2}$ choices give the rest.`,
          `每个素数幂都选 $a - 1$ 得 $a = 1$，都选 $a$ 得 $a = 0$；其余 $${answer - 2}$ 种选法给出其他解。`,
        ),
      ),
    });
  },
};

const wilson: KnowledgePointDef = {
  id: "wilsons-theorem-in-a-prime-field",
  title: t("Wilson's theorem in a prime field", "素数域中的威尔逊定理"),
  explanation: t(
    "In the product of all nonzero elements of $\\mathbb{Z}_p$, each element cancels with its inverse. Only $1$ and $-1$ are their own inverses, because $x^2 = 1$ has just these two solutions in a field. So the product is $-1$, which is Wilson's theorem: $(p - 1)! \\equiv -1$. Dividing by the last factors reaches smaller factorials.\n\nFor $p = 7$, Wilson's theorem gives $6! \\equiv -1$. Since $6 \\equiv -1$, dividing by it gives $5! \\equiv 1$ modulo $7$.\n\nCheck: $6! = 720 = 102 \\cdot 7 + 6$ and $5! = 120 = 17 \\cdot 7 + 1$.\n\n> **Watch out.** The theorem needs a prime modulus: for $n = 6$, $5! = 120 = 20 \\cdot 6$, so $5! \\equiv 0$, not $-1$.",
    "在 $\\mathbb{Z}_p$ 所有非零元素的乘积中，每个元素都与它的逆抵消。只有 $1$ 和 $-1$ 是自己的逆，因为在域中 $x^2 = 1$ 只有这两个解。所以乘积是 $-1$，这就是威尔逊定理：$(p - 1)! \\equiv -1$。除以最后几个因子，就能得到更小的阶乘。\n\n对 $p = 7$，威尔逊定理给出 $6! \\equiv -1$。由于 $6 \\equiv -1$，两边除以它得到模 $7$ 时 $5! \\equiv 1$。\n\n检验：$6! = 720 = 102 \\cdot 7 + 6$，$5! = 120 = 17 \\cdot 7 + 1$。\n\n> **注意。** 这个定理要求模是素数：对 $n = 6$，$5! = 120 = 20 \\cdot 6$，所以 $5! \\equiv 0$，而不是 $-1$。",
  ),
  generate(rng) {
    const p = rng.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
    const back = rng.int(1, 3);
    const half = (p - 1) / 2;
    const answer = back === 1 ? p - 1 : back === 2 ? 1 : half;
    const reduce =
      back === 1
        ? t(`So the remainder is $-1 + ${p} = ${p - 1}$.`, `所以余数是 $-1 + ${p} = ${p - 1}$。`)
        : back === 2
          ? t(
              `$${p - 1}! = ${p - 1} \\cdot ${p - 2}!$ and $${p - 1} \\equiv -1$. Dividing by $-1$ gives $${p - 2}! \\equiv 1$.`,
              `$${p - 1}! = ${p - 1} \\cdot ${p - 2}!$，而 $${p - 1} \\equiv -1$。两边除以 $-1$ 得 $${p - 2}! \\equiv 1$。`,
            )
          : t(
              `$${p - 1}! = ${p - 1} \\cdot ${p - 2} \\cdot ${p - 3}!$ and $${p - 1} \\cdot ${p - 2} \\equiv (-1)(-2) = 2$. So $2 \\cdot ${p - 3}! \\equiv -1 \\equiv ${p - 1}$, and halving gives ${half}.`,
              `$${p - 1}! = ${p - 1} \\cdot ${p - 2} \\cdot ${p - 3}!$，而 $${p - 1} \\cdot ${p - 2} \\equiv (-1)(-2) = 2$。所以 $2 \\cdot ${p - 3}! \\equiv -1 \\equiv ${p - 1}$，两边减半得 ${half}。`,
            );
    const check =
      back === 1
        ? t(`$${p - 1} + 1 = ${p}$, so ${p - 1} is $-1$ modulo ${p}.`, `$${p - 1} + 1 = ${p}$，所以模 ${p} 时 ${p - 1} 就是 $-1$。`)
        : back === 2
          ? t(
              `Multiplying back, $(${p - 1})(1) = ${p - 1} \\equiv -1$, which matches Wilson's theorem.`,
              `乘回去，$(${p - 1})(1) = ${p - 1} \\equiv -1$，与威尔逊定理一致。`,
            )
          : t(
              `Multiplying back, $2 \\cdot ${half} = ${p - 1} \\equiv -1$, which matches Wilson's theorem.`,
              `乘回去，$2 \\cdot ${half} = ${p - 1} \\equiv -1$，与威尔逊定理一致。`,
            );
    return numberProblem({
      prompt: t(`Find the remainder of $${p - back}!$ on division by ${p}.`, `求 $${p - back}!$ 除以 ${p} 的余数。`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          0,
          `Every factor of $${p - back}!$ is below the prime ${p}, so ${p} does not divide the product.`,
          `$${p - back}!$ 的每个因子都小于素数 ${p}，所以 ${p} 不整除这个乘积。`,
        ),
        why(1, `$1$ is the value of $${p - 2}!$, not of $${p - back}!$.`, `$1$ 是 $${p - 2}!$ 的值，不是 $${p - back}!$ 的值。`),
        why(
          p - 1,
          `${p - 1}, that is $-1$, is the value of $${p - 1}!$, not of $${p - back}!$.`,
          `${p - 1} 即 $-1$，是 $${p - 1}!$ 的值，不是 $${p - back}!$ 的值。`,
        ),
        why(half, `${half} is the value of $${p - 3}!$, not of $${p - back}!$.`, `${half} 是 $${p - 3}!$ 的值，不是 $${p - back}!$ 的值。`),
      ]),
      solution: walked(
        [
          [
            ["Apply Wilson's theorem", "应用威尔逊定理"],
            t(`Since ${p} is prime, $${p - 1}! \\equiv -1$ modulo ${p}.`, `由于 ${p} 是素数，模 ${p} 时 $${p - 1}! \\equiv -1$。`),
          ],
          [["Reach the factorial", "化到所求阶乘"], reduce],
        ],
        check,
      ),
    });
  },
};

const ideaOfProductIdeals: KnowledgePointDef = {
  id: "counting-ideals-of-a-product-of-residue-rings",
  title: t("Counting ideals of a product of residue rings", "数剩余环之积的理想"),
  explanation: t(
    "The ideals of $\\mathbb{Z}_n$ correspond to the divisors of $n$, one for each. In a product of two rings with unity, every ideal is a product of an ideal of each factor, because multiplying by $(1, 0)$ and $(0, 1)$ separates the components. So the numbers of ideals multiply, even when $m$ and $n$ are not coprime.\n\nIn $\\mathbb{Z}_2 \\times \\mathbb{Z}_3$, the factor $\\mathbb{Z}_2$ has the $2$ ideals $\\{0\\}$ and $\\mathbb{Z}_2$, and $\\mathbb{Z}_3$ has $2$ as well. So the product has $2 \\cdot 2 = 4$ ideals: $\\{0\\} \\times \\{0\\}$, $\\mathbb{Z}_2 \\times \\{0\\}$, $\\{0\\} \\times \\mathbb{Z}_3$ and the whole ring.\n\nCheck: $\\mathbb{Z}_2 \\times \\mathbb{Z}_3 \\cong \\mathbb{Z}_6$, and $6$ has the $4$ divisors $1, 2, 3, 6$.\n\n> **Watch out.** An additive subgroup need not be an ideal: in $\\mathbb{Z}_2 \\times \\mathbb{Z}_2$ the diagonal $\\{(0, 0), (1, 1)\\}$ is a subgroup, but $(1, 0)(1, 1) = (1, 0)$ lies outside it.",
    "$\\mathbb{Z}_n$ 的理想与 $n$ 的因数一一对应。在两个有幺元的环之积中，每个理想都是各因子理想之积，因为乘以 $(1, 0)$ 和 $(0, 1)$ 可以分开各分量。所以理想个数相乘，即使 $m$ 和 $n$ 不互素也是如此。\n\n在 $\\mathbb{Z}_2 \\times \\mathbb{Z}_3$ 中，因子 $\\mathbb{Z}_2$ 有 $\\{0\\}$ 和 $\\mathbb{Z}_2$ 这 $2$ 个理想，$\\mathbb{Z}_3$ 也有 $2$ 个。所以积有 $2 \\cdot 2 = 4$ 个理想：$\\{0\\} \\times \\{0\\}$、$\\mathbb{Z}_2 \\times \\{0\\}$、$\\{0\\} \\times \\mathbb{Z}_3$ 和整个环。\n\n检验：$\\mathbb{Z}_2 \\times \\mathbb{Z}_3 \\cong \\mathbb{Z}_6$，而 $6$ 有 $1, 2, 3, 6$ 这 $4$ 个因数。\n\n> **注意。** 加法子群不一定是理想：在 $\\mathbb{Z}_2 \\times \\mathbb{Z}_2$ 中，对角线 $\\{(0, 0), (1, 1)\\}$ 是子群，但 $(1, 0)(1, 1) = (1, 0)$ 不在其中。",
  ),
  generate(rng) {
    const m = rng.int(4, 60);
    const n = rng.int(4, 60);
    const a = divisors(m).length;
    const b = divisors(n).length;
    return numberProblem({
      prompt: t(
        `How many ideals does the ring $${Zn(m)} \\times ${Zn(n)}$ have, counting the zero ideal and the whole ring?`,
        `环 $${Zn(m)} \\times ${Zn(n)}$ 有多少个理想（包括零理想和整个环）？`,
      ),
      answer: a * b,
      form: "integer",
      mistakes: apart(a * b, [
        why(
          a + b,
          "Each ideal pairs an ideal of the first factor with one of the second, so the counts multiply, not add.",
          "每个理想把第一个因子的一个理想与第二个因子的一个理想配对，所以个数相乘，而不是相加。",
        ),
        why(
          divisors(m * n).length,
          `That counts the ideals of $${Zn(m * n)}$, which is a different ring unless ${m} and ${n} are coprime.`,
          `这数的是 $${Zn(m * n)}$ 的理想，除非 ${m} 与 ${n} 互素，它是另一个环。`,
        ),
        why(m * n, "That is the number of elements, not of ideals.", "这是元素的个数，不是理想的个数。"),
      ]),
      solution: walked(
        [
          [
            ["Count each factor's ideals", "数每个因子的理想"],
            t(
              `The ideals of $${Zn(m)}$ match the ${a} divisors of ${m}, and those of $${Zn(n)}$ match the ${b} divisors of ${n}.`,
              `$${Zn(m)}$ 的理想对应 ${m} 的 ${a} 个因数，$${Zn(n)}$ 的理想对应 ${n} 的 ${b} 个因数。`,
            ),
          ],
          [
            ["Multiply", "相乘"],
            t(
              `Every ideal is a product of an ideal of each factor, which makes $${a} \\cdot ${b} = ${a * b}$.`,
              `每个理想都是各因子理想之积，共 $${a} \\cdot ${b} = ${a * b}$ 个。`,
            ),
          ],
        ],
        t(
          `The divisors of ${m} are ${divisors(m).join(", ")}, and those of ${n} are ${divisors(n).join(", ")}.`,
          `${m} 的因数是 ${divisors(m).join("、")}，${n} 的因数是 ${divisors(n).join("、")}。`,
        ),
      ),
    });
  },
};

const unitsOfAQuadraticQuotient: KnowledgePointDef = {
  id: "counting-units-of-a-quadratic-quotient-ring",
  title: t("Counting units of a quadratic quotient ring", "数二次商环的单位"),
  explanation: t(
    "The ring $\\mathbb{Z}_p[x]/(f)$ with $f$ quadratic has $p^2$ elements, and its structure depends on how $f$ factors. With no root, it is a field. With two different roots, it is $\\mathbb{Z}_p \\times \\mathbb{Z}_p$. With a double root $a$, a class is a unit exactly when it is nonzero at $a$. So the factorization decides the number of units.\n\nOver $\\mathbb{Z}_3$, the polynomial $x^2 + 1$ takes the values $1, 2, 2$ at $0, 1, 2$, so it has no root. Then $\\mathbb{Z}_3[x]/(x^2 + 1)$ is a field with $9$ elements and $9 - 1 = 8$ units.\n\nCheck: $(x + 1)(x + 2) = x^2 + 3x + 2 = x^2 + 2$, which is $1$ in the quotient, so $x + 1$ is a unit.\n\n> **Watch out.** A double root gives neither a field nor a product: in $\\mathbb{Z}_3[x]/(x^2)$ the class $x$ is nonzero, but $x \\cdot x = 0$, so $x$ is not a unit.",
    "$f$ 为二次时，环 $\\mathbb{Z}_p[x]/(f)$ 有 $p^2$ 个元素，它的结构取决于 $f$ 的分解。没有根时它是域。有两个不同的根时它是 $\\mathbb{Z}_p \\times \\mathbb{Z}_p$。有重根 $a$ 时，一个类是单位当且仅当它在 $a$ 处非零。所以分解决定了单位的个数。\n\n在 $\\mathbb{Z}_3$ 上，多项式 $x^2 + 1$ 在 $0, 1, 2$ 处的值是 $1, 2, 2$，所以没有根。于是 $\\mathbb{Z}_3[x]/(x^2 + 1)$ 是有 $9$ 个元素的域，有 $9 - 1 = 8$ 个单位。\n\n检验：$(x + 1)(x + 2) = x^2 + 3x + 2 = x^2 + 2$，它在商环中是 $1$，所以 $x + 1$ 是单位。\n\n> **注意。** 有重根时既不是域也不是积：在 $\\mathbb{Z}_3[x]/(x^2)$ 中，类 $x$ 非零，但 $x \\cdot x = 0$，所以 $x$ 不是单位。",
  ),
  generate(rng) {
    const p = rng.pick([5, 7, 11, 13]);
    const kind = rng.int(0, 2);
    const a = rng.int(0, p - 1);
    const b = kind === 0 ? rng.pick(range(0, p - 1).filter((i) => i !== a)) : a;
    const hasRoot = (u: number, v: number) => range(0, p - 1).some((x) => (x * x + u * x + v) % p === 0);
    const noRoot = range(0, p - 1)
      .flatMap((u) => range(0, p - 1).map((v) => [u, v] as const))
      .filter(([u, v]) => !hasRoot(u, v));
    const [u, v] = kind === 2 ? rng.pick(noRoot) : ([(2 * p - a - b) % p, (a * b) % p] as const);
    const f = poly([1, "x^2"], [u, "x"], [v, ""]);
    const answer = kind === 0 ? (p - 1) ** 2 : kind === 1 ? p * (p - 1) : p * p - 1;
    return numberProblem({
      prompt: t(`How many units does the ring $${Zn(p)}[x]/(${f})$ have?`, `环 $${Zn(p)}[x]/(${f})$ 有多少个单位？`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          (p - 1) ** 2,
          `That count belongs to two different roots, where the ring is $${Zn(p)} \\times ${Zn(p)}$.`,
          `这个个数属于有两个不同根的情形，那时环是 $${Zn(p)} \\times ${Zn(p)}$。`,
        ),
        why(
          p * (p - 1),
          "That count belongs to a double root, where the classes vanishing at the root are not units.",
          "这个个数属于有重根的情形，那时在根处为零的类不是单位。",
        ),
        why(
          p * p - 1,
          "That count belongs to a polynomial with no root, where the ring is a field.",
          "这个个数属于没有根的多项式，那时环是域。",
        ),
        why(p * p, "That counts every class, but zero is never a unit.", "这数的是所有类，但零从来不是单位。"),
      ]),
      solution: walked(
        [
          [
            ["Look for roots", "寻找根"],
            kind === 0
              ? t(
                  `The polynomial has the two roots ${a} and ${b} in $${Zn(p)}$, so the ring is $${Zn(p)} \\times ${Zn(p)}$.`,
                  `这个多项式在 $${Zn(p)}$ 中有 ${a} 和 ${b} 两个根，所以这个环是 $${Zn(p)} \\times ${Zn(p)}$。`,
                )
              : kind === 1
                ? t(
                    `The polynomial has the double root ${a}, so a class is a unit exactly when it is nonzero at ${a}.`,
                    `这个多项式有重根 ${a}，所以一个类是单位当且仅当它在 ${a} 处非零。`,
                  )
                : t(
                    `The polynomial has no root in $${Zn(p)}$, so as a quadratic it is irreducible and the ring is a field.`,
                    `这个多项式在 $${Zn(p)}$ 中没有根，作为二次多项式它不可约，所以这个环是域。`,
                  ),
          ],
          [
            ["Count the units", "数单位"],
            kind === 0
              ? t(
                  `A pair is a unit when both entries are nonzero, which gives $${p - 1}^2 = ${answer}$ units.`,
                  `一对元素是单位当且仅当两个分量都非零，所以有 $${p - 1}^2 = ${answer}$ 个单位。`,
                )
              : kind === 1
                ? t(
                    `Of the $${p * p}$ classes $c + d${a === 0 ? "x" : `(x - ${a})`}$, the ${p} with $c = 0$ vanish at ${a}, which leaves $${p * p} - ${p} = ${answer}$.`,
                    `在 $${p * p}$ 个类 $c + d${a === 0 ? "x" : `(x - ${a})`}$ 中，$c = 0$ 的 ${p} 个在 ${a} 处为零，剩下 $${p * p} - ${p} = ${answer}$ 个。`,
                  )
                : t(`All $${p * p} - 1 = ${answer}$ nonzero classes are units.`, `所有 $${p * p} - 1 = ${answer}$ 个非零类都是单位。`),
          ],
        ],
        kind === 0
          ? t(
              `The ${p * p - answer} non-units are the classes that vanish at ${a} or at ${b}: ${p} at each, with zero counted in both, and $${p} + ${p} - 1 = ${p * p - answer}$.`,
              `${p * p - answer} 个非单位是在 ${a} 或 ${b} 处为零的类：每处 ${p} 个，零在两处都被计入，$${p} + ${p} - 1 = ${p * p - answer}$。`,
            )
          : kind === 1
            ? t(`$${answer} + ${p} = ${p * p}$ accounts for every class.`, `$${answer} + ${p} = ${p * p}$，正好是所有的类。`)
            : t(
                `Substituting each of $0, 1, \\ldots, ${p - 1}$ into $${f}$ never gives $0$ modulo ${p}.`,
                `把 $0, 1, \\ldots, ${p - 1}$ 逐个代入 $${f}$，模 ${p} 都不为 $0$。`,
              ),
      ),
    });
  },
};

const countingPolynomials: KnowledgePointDef = {
  id: "counting-polynomials-of-a-given-degree-over-zp",
  title: t("Counting polynomials of a given degree over $\\mathbb{Z}_p$", "数 $\\mathbb{Z}_p$ 上给定次数的多项式"),
  explanation: t(
    "A polynomial over $\\mathbb{Z}_p$ is a list of coefficients, each with $p$ possible values. Degree exactly $d$ means the leading coefficient is one of the $p - 1$ nonzero values, and the other $d$ coefficients are free. Monic means the leading coefficient is 1. Degree at most $d$ leaves all $d + 1$ coefficients free.",
    "$\\mathbb{Z}_p$ 上的多项式就是一列系数，每个系数有 $p$ 种取值。次数恰好为 $d$，表示首项系数是 $p - 1$ 个非零值之一，其余 $d$ 个系数任取。首一表示首项系数是 1。次数至多为 $d$ 时，全部 $d + 1$ 个系数都可以任取。",
  ),
  generate(rng) {
    const p = rng.pick([2, 3, 5, 7, 11]);
    const d = rng.int(2, 6);
    const kind = rng.int(0, 2);
    const answer = kind === 0 ? (p - 1) * p ** d : kind === 1 ? p ** d : p ** (d + 1);
    const en =
      kind === 0
        ? `have degree exactly ${d}`
        : kind === 1
          ? `are monic of degree ${d}`
          : `have degree at most ${d}, counting the zero polynomial`;
    const zh = kind === 0 ? `次数恰好为 ${d}` : kind === 1 ? `首一且次数为 ${d}` : `次数至多为 ${d}（包括零多项式）`;
    return numberProblem({
      prompt: t(`How many polynomials in $${Zn(p)}[x]$ ${en}?`, `$${Zn(p)}[x]$ 中有多少个多项式${zh}？`),
      answer,
      form: "integer",
      wrong: [(p - 1) * p ** d, p ** d, p ** (d + 1), d ** p],
      solution:
        kind === 0
          ? t(
              `The leading coefficient has $${p - 1}$ values and each of the other ${d} coefficients has ${p}, which gives ${answer}.`,
              `首项系数有 $${p - 1}$ 种取值，其余 ${d} 个系数各有 ${p} 种，得 ${answer}。`,
            )
          : kind === 1
            ? t(
                `The leading coefficient is fixed, and each of the other ${d} coefficients has ${p} values, which gives $${p}^{${d}} = ${answer}$.`,
                `首项系数已固定，其余 ${d} 个系数各有 ${p} 种取值，得 $${p}^{${d}} = ${answer}$。`,
              )
            : t(
                `All ${d + 1} coefficients are free, with ${p} values each, which gives $${p}^{${d + 1}} = ${answer}$.`,
                `全部 ${d + 1} 个系数都任取，各有 ${p} 种取值，得 $${p}^{${d + 1}} = ${answer}$。`,
              ),
    });
  },
};

const linearUnits: KnowledgePointDef = {
  id: "counting-linear-units-over-zn",
  title: t("Counting linear units over $\\mathbb{Z}_n$", "数 $\\mathbb{Z}_n$ 上的一次单位"),
  explanation: t(
    "Over a ring with nilpotents, a polynomial of positive degree can be a unit. The polynomial $a + bx$ is a unit in $\\mathbb{Z}_n[x]$ exactly when $a$ is a unit and $b$ is nilpotent, because then the geometric series for the inverse stops. So the two coefficients can be counted separately, and the counts multiply.",
    "在有幂零元的环上，正次数的多项式也可以是单位。$a + bx$ 是 $\\mathbb{Z}_n[x]$ 中的单位，当且仅当 $a$ 是单位且 $b$ 是幂零元，因为这时逆的几何级数会终止。所以两个系数可以分别计数，再把个数相乘。",
  ),
  generate(rng) {
    const n = rng.pick(nonsquarefree(120));
    const r = radical(n);
    const nil = n / r;
    const units = totient(n);
    const answer = units * nil;
    return numberProblem({
      prompt: t(
        `How many polynomials $a + bx$ in $${Zn(n)}[x]$, with $b$ allowed to be zero, are units?`,
        `$${Zn(n)}[x]$ 中有多少个多项式 $a + bx$（$b$ 可以为零）是单位？`,
      ),
      answer,
      form: "integer",
      wrong: [units, units * n, units + nil],
      solution: t(
        `There are $\\varphi(${n}) = ${units}$ units for $a$. The nilpotents, for $b$, are the multiples of ${r}, and there are ${nil} of them. That makes $${units} \\cdot ${nil} = ${answer}$.`,
        `$a$ 有 $\\varphi(${n}) = ${units}$ 种取值。$b$ 必须是幂零元，即 ${r} 的倍数，有 ${nil} 个。共 $${units} \\cdot ${nil} = ${answer}$ 个。`,
      ),
    });
  },
};

const cyclotomicFactors: KnowledgePointDef = {
  id: "counting-the-irreducible-factors-of-x-to-the-n-minus-one",
  title: t("Counting the irreducible factors of $x^n - 1$", "数 $x^n - 1$ 的不可约因子"),
  explanation: t(
    "Each root of $x^n - 1$ is a primitive root of unity of exactly one order $d$ dividing $n$. Collecting the roots by order gives the factorization $x^n - 1 = \\prod_{d \\mid n} \\Phi_d(x)$ into cyclotomic polynomials. Each of these has integer coefficients and is irreducible over $\\mathbb{Q}$, so there is one irreducible factor for each divisor of $n$.",
    "$x^n - 1$ 的每个根都恰是某个整除 $n$ 的 $d$ 次本原单位根。按次数归类这些根，就得到分圆多项式的分解 $x^n - 1 = \\prod_{d \\mid n} \\Phi_d(x)$。每个分圆多项式都有整数系数，而且在 $\\mathbb{Q}$ 上不可约，所以 $n$ 的每个因数对应一个不可约因子。",
  ),
  generate(rng) {
    const n = rng.int(2, 72);
    const list = divisors(n);
    return numberProblem({
      prompt: t(
        `Into how many irreducible factors does $x^{${n}} - 1$ split over $\\mathbb{Q}$?`,
        `$x^{${n}} - 1$ 在 $\\mathbb{Q}$ 上分解成多少个不可约因子？`,
      ),
      answer: list.length,
      form: "integer",
      wrong: [n, 2, primes(n).length + 1],
      solution: t(
        `There is one cyclotomic factor for each divisor of ${n}. The divisors are ${list.join(", ")}, so there are ${list.length}.`,
        `${n} 的每个因数对应一个分圆因子。因数是 ${list.join("、")}，所以有 ${list.length} 个。`,
      ),
    });
  },
};

const squareOfAPureQuaternion: KnowledgePointDef = {
  id: "the-square-of-a-pure-quaternion",
  title: t("The square of a pure quaternion", "纯四元数的平方"),
  explanation: t(
    "A pure quaternion has no real part. When $bi + cj + dk$ is squared, the mixed terms cancel in pairs, since $ij = -ji$ and likewise for the others. Only the squares remain, and each of $i^2$, $j^2$, $k^2$ is $-1$. So the square is the negative of a sum of squares, which is why every pure unit quaternion is a square root of $-1$.",
    "纯四元数没有实部。把 $bi + cj + dk$ 平方时，混合项成对抵消，因为 $ij = -ji$，其余类似。只剩下平方项，而 $i^2$、$j^2$、$k^2$ 都是 $-1$。所以平方是平方和的相反数，这也是每个纯单位四元数都是 $-1$ 的平方根的原因。",
  ),
  generate(rng) {
    const b = pickNonzero(rng, 9);
    const c = pickNonzero(rng, 9);
    const d = pickNonzero(rng, 9);
    const q = poly([b, "i"], [c, "j"], [d, "k"]);
    const total = b * b + c * c + d * d;
    return numberProblem({
      prompt: t(`The square of the quaternion $q = ${q}$ is a real number. Find it.`, `四元数 $q = ${q}$ 的平方是实数。求这个数。`),
      answer: -total,
      form: "integer",
      wrong: [total, -((b + c + d) ** 2), -(Math.abs(b) + Math.abs(c) + Math.abs(d))],
      solution: t(
        `The mixed terms cancel, so $q^2 = -(${b * b} + ${c * c} + ${d * d}) = ${-total}$.`,
        `混合项抵消，所以 $q^2 = -(${b * b} + ${c * c} + ${d * d}) = ${-total}$。`,
      ),
    });
  },
};

const normOfAProduct: KnowledgePointDef = {
  id: "the-norm-of-a-product-of-quaternions",
  title: t("The norm of a product of quaternions", "四元数之积的范数"),
  explanation: t(
    "The norm $N(a + bi + cj + dk) = a^2 + b^2 + c^2 + d^2$ is multiplicative: $N(pq) = N(p)N(q)$. This holds even though multiplication is not commutative, and it means the norm of a product can be found without multiplying the quaternions. It also explains why a product of nonzero quaternions is never zero.",
    "范数 $N(a + bi + cj + dk) = a^2 + b^2 + c^2 + d^2$ 是可乘的：$N(pq) = N(p)N(q)$。即使乘法不交换这也成立，这意味着不必把四元数相乘就能求出积的范数。这也解释了为什么在这个除环中，非零元素之积永远不为零。",
  ),
  generate(rng) {
    const coefficients = () => [pickNonzero(rng, 4), pickNonzero(rng, 4), pickNonzero(rng, 4), pickNonzero(rng, 4)] as const;
    const [a, b, c, d] = coefficients();
    const [e, f, g, h] = coefficients();
    const P = a * a + b * b + c * c + d * d;
    const R = e * e + f * f + g * g + h * h;
    const p = poly([a, ""], [b, "i"], [c, "j"], [d, "k"]);
    const q = poly([e, ""], [f, "i"], [g, "j"], [h, "k"]);
    return numberProblem({
      prompt: t(
        `Let $p = ${p}$ and $q = ${q}$. Find the norm $N(pq)$, where $N(a + bi + cj + dk) = a^2 + b^2 + c^2 + d^2$.`,
        `设 $p = ${p}$，$q = ${q}$。求范数 $N(pq)$，其中 $N(a + bi + cj + dk) = a^2 + b^2 + c^2 + d^2$。`,
      ),
      answer: P * R,
      form: "integer",
      wrong: [P + R, P, R],
      solution: t(
        `$N(p) = ${P}$ and $N(q) = ${R}$. The norm is multiplicative, so $N(pq) = ${P} \\cdot ${R} = ${P * R}$.`,
        `$N(p) = ${P}$，$N(q) = ${R}$。范数是可乘的，所以 $N(pq) = ${P} \\cdot ${R} = ${P * R}$。`,
      ),
    });
  },
};

const dependentPolynomials: KnowledgePointDef = {
  id: "the-parameter-that-makes-polynomials-dependent",
  title: t("The parameter that makes polynomials dependent", "使多项式线性相关的参数"),
  explanation: t(
    "Three polynomials in the space of polynomials of degree at most two are dependent exactly when one is a combination of the others. Combine two of them to remove a power of $x$ that the third lacks. The third must then be a multiple of this combination, and comparing the remaining coefficients gives the parameter. For example, for $1 + x$, $x + x^2$ and $2 + kx^2$: $(1 + x) - (x + x^2) = 1 - x^2$, and $2 + kx^2$ must be $2(1 - x^2)$, so $k = -2$.\n\n> **Watch out.** The third polynomial is a multiple of the combination, so scale the whole combination, its $x^2$ coefficient included, to match the constant term.",
    "在次数至多为二的多项式空间中，三个多项式线性相关，当且仅当其中一个是其余两个的组合。把其中两个组合起来，消去第三个所没有的 $x$ 的幂。第三个就必须是这个组合的倍数，比较剩下的系数就得到参数。例如对 $1 + x$、$x + x^2$ 和 $2 + kx^2$：$(1 + x) - (x + x^2) = 1 - x^2$，而 $2 + kx^2$ 必须是 $2(1 - x^2)$，所以 $k = -2$。\n\n> **注意。** 第三个多项式是这个组合的倍数，所以要把整个组合（包括 $x^2$ 的系数）一起放大，使常数项吻合。",
  ),
  generate(rng) {
    const a = pickNonzero(rng, 6);
    const b = pickNonzero(rng, 6);
    const c = rng.int(1, 5);
    const answer = -a * b * c;
    const p1 = poly([1, ""], [a, "x"]);
    const p2 = poly([1, "x"], [b, "x^2"]);
    const combination = poly([1, ""], [-a * b, "x^2"]);
    return numberProblem({
      prompt: t(
        `For which $k$ are $${p1}$, $${p2}$ and $${c} + kx^2$ linearly dependent?`,
        `$k$ 取何值时，$${p1}$、$${p2}$ 和 $${c} + kx^2$ 线性相关？`,
      ),
      answer,
      solveFor: "k",
      form: "integer",
      mistakes: [
        why(
          a * b * c,
          `The sign is flipped: the combination that removes $x$ has $x^2$ coefficient $${-a * b}$.`,
          `符号反了：消去 $x$ 的组合中 $x^2$ 的系数是 $${-a * b}$。`,
        ),
        why(
          -a * b,
          `That matches the combination itself, but its constant term is $1$, not $${c}$; scale it by $${c}$.`,
          `这与组合本身吻合，但它的常数项是 $1$ 而不是 $${c}$；要乘以 $${c}$。`,
        ),
        why(
          -a * c,
          `The weight on the second polynomial is $${-a * c}$, and it multiplies the $x^2$ coefficient $${b}$ too.`,
          `第二个多项式的权重是 $${-a * c}$，它也要乘上 $x^2$ 的系数 $${b}$。`,
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Remove the $x$ term", "消去 $x$ 项"],
            t(
              `The third polynomial has no $x$ term, so combine the first two to cancel $x$:`,
              `第三个多项式没有 $x$ 项，所以组合前两个以消去 $x$：`,
            ),
            [`(${p1}) ${a < 0 ? "+" : "-"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}(${p2}) = ${combination}`],
          ],
          [
            ["Match the constant term", "对齐常数项"],
            t(
              `The third polynomial has constant term $${c}$, so it must be $${c}$ times this combination:`,
              `第三个多项式的常数项是 $${c}$，所以它必须是这个组合的 $${c}$ 倍：`,
            ),
            [`${c} + kx^2 = ${c}(${combination}) = ${poly([c, ""], [answer, "x^2"])}`, `k = ${answer}`],
          ],
        ],
        t(
          `Indeed, $${c}(${p1}) ${-a * c < 0 ? "-" : "+"} ${Math.abs(a * c) === 1 ? "" : Math.abs(a * c)}(${p2}) = ${poly([c, ""], [answer, "x^2"])}$ is the third polynomial, so the three are dependent.`,
          `确实，$${c}(${p1}) ${-a * c < 0 ? "-" : "+"} ${Math.abs(a * c) === 1 ? "" : Math.abs(a * c)}(${p2}) = ${poly([c, ""], [answer, "x^2"])}$ 正是第三个多项式，所以三者线性相关。`,
        ),
      ),
    });
  },
};

const associativityParameter: KnowledgePointDef = {
  id: "the-constant-that-makes-an-operation-associative",
  title: t("The constant that makes an operation associative", "使运算满足结合律的常数"),
  explanation: t(
    "An operation $a \\ast b = mab + k(a + b) + c$ looks like multiplication after a shift. Multiplying by $m$ and adding $k$ gives $m(a \\ast b) + k = (ma + k)(mb + k) + (mc + k - k^2)$. A product plus a constant is associative only if the constant is zero, so associativity fixes $c$.\n\nFor $a \\ast b = ab + 2(a + b) + c$, here $m = 1$ and $k = 2$, so $(a \\ast b) + 2 = (a + 2)(b + 2) + (c + 2 - 4)$, and $c - 2 = 0$ gives $c = 2$.\n\nCheck: with $c = 2$, $0 \\ast 0 = 2$ and $2 \\ast 1 = 2 + 6 + 2 = 10$, while $0 \\ast 1 = 4$ and $0 \\ast 4 = 8 + 2 = 10$.\n\n> **Watch out.** The leftover constant is $mc + k - k^2$: multiply $c$ by $m$ as well, and subtract $k^2$ rather than add it.",
    "运算 $a \\ast b = mab + k(a + b) + c$ 平移后就像乘法。乘以 $m$ 再加 $k$，得 $m(a \\ast b) + k = (ma + k)(mb + k) + (mc + k - k^2)$。乘积加常数只有在常数为零时才满足结合律，所以结合律确定了 $c$。\n\n对 $a \\ast b = ab + 2(a + b) + c$，这里 $m = 1$，$k = 2$，所以 $(a \\ast b) + 2 = (a + 2)(b + 2) + (c + 2 - 4)$，由 $c - 2 = 0$ 得 $c = 2$。\n\n检验：取 $c = 2$，$0 \\ast 0 = 2$，$2 \\ast 1 = 2 + 6 + 2 = 10$；而 $0 \\ast 1 = 4$，$0 \\ast 4 = 8 + 2 = 10$。\n\n> **注意。** 剩下的常数是 $mc + k - k^2$：$c$ 也要乘以 $m$，并且要减去 $k^2$ 而不是加上。",
  ),
  generate(rng) {
    const m = rng.int(1, 6);
    const k = pickNonzero(rng, 9);
    const answer = Q.of(k * k - k, m);
    const form = poly([m, "ab"], [k, "a"], [k, "b"]);
    return numberProblem({
      prompt: t(
        `On the real numbers, $a \\ast b = ${form} + c$. For which $c$ is this operation associative?`,
        `在实数上，$a \\ast b = ${form} + c$。$c$ 取何值时这个运算满足结合律？`,
      ),
      answer,
      solveFor: "c",
      mistakes: apart(answer, [
        why(
          Q.of(k * k + k, m),
          `This takes the leftover constant as $mc - k - k^2$; the $k$ term enters with a plus sign.`,
          `这把剩下的常数当成 $mc - k - k^2$；$k$ 这一项应带加号。`,
        ),
        why(Q.of(k * k, m), "This leaves out the $k$ in $mc + k - k^2$.", "这漏掉了 $mc + k - k^2$ 中的 $k$。"),
        why(Q.of(k * k - k), `This forgets to divide by $m = ${m}$.`, `这忘了除以 $m = ${m}$。`),
      ]),
      solution: walked(
        [
          [
            ["Shift to a product", "平移成乘积"],
            t(
              `With $m = ${m}$ and $k = ${k}$, $${m === 1 ? "" : m}(a \\ast b) ${signed(k)} = (${poly([m, "a"], [k, ""])})(${poly([m, "b"], [k, ""])}) + (${poly([m, "c"], [k - k * k, ""])})$.`,
              `取 $m = ${m}$，$k = ${k}$，$${m === 1 ? "" : m}(a \\ast b) ${signed(k)} = (${poly([m, "a"], [k, ""])})(${poly([m, "b"], [k, ""])}) + (${poly([m, "c"], [k - k * k, ""])})$。`,
            ),
          ],
          [
            ["Make the constant zero", "令常数为零"],
            t(
              `$${poly([m, "c"], [k - k * k, ""])} = 0$ gives $c = ${answer.toLatex()}$.`,
              `由 $${poly([m, "c"], [k - k * k, ""])} = 0$ 得 $c = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `Then $${m === 1 ? "" : m}(a \\ast b) ${signed(k)} = (${poly([m, "a"], [k, ""])})(${poly([m, "b"], [k, ""])})$ exactly, so the shifted operation is ordinary multiplication, which is associative.`,
          `于是 $${m === 1 ? "" : m}(a \\ast b) ${signed(k)} = (${poly([m, "a"], [k, ""])})(${poly([m, "b"], [k, ""])})$ 恰好成立，平移后的运算就是普通乘法，满足结合律。`,
        ),
      ),
    });
  },
};

const orderOfAnAffineMap: KnowledgePointDef = {
  id: "the-order-of-an-affine-map",
  figure: algebraDrawings1["function-groups#the-order-of-an-affine-map"],
  title: t("The order of an affine map", "仿射映射的阶"),
  explanation: t(
    "The map $f(x) = ax + b$ on $\\mathbb{Z}_p$ has a fixed point when $a \\ne 1$. Measured from that point, $f$ just multiplies by $a$, so the order of $f$ is the order of $a$ modulo $p$, and $b$ has no effect. When $a = 1$, $f$ is a nonzero translation, and its order is $p$.\n\nFor $f(x) = 2x + 1$ on $\\mathbb{Z}_7$, the fixed point is $6$, since $2 \\cdot 6 + 1 = 13 \\equiv 6$. The powers of $2$ modulo $7$ are $2, 4, 1$, so $f$ has order $3$.\n\nCheck: as in the figure, $f$ sends $0 \\to 1 \\to 3 \\to 0$ and $2 \\to 5 \\to 4 \\to 2$, cycles of length $3$.\n\n> **Watch out.** The order is the order of $a$, which only divides $p - 1$: here it is $3$, not $6$. And the constant $b$ does not change it.",
    "当 $a \\ne 1$ 时，$\\mathbb{Z}_p$ 上的映射 $f(x) = ax + b$ 有不动点。从这个点量起，$f$ 只是乘以 $a$，所以 $f$ 的阶就是 $a$ 模 $p$ 的阶，$b$ 不起作用。当 $a = 1$ 时，$f$ 是非零平移，阶是 $p$。\n\n对 $\\mathbb{Z}_7$ 上的 $f(x) = 2x + 1$，不动点是 $6$，因为 $2 \\cdot 6 + 1 = 13 \\equiv 6$。$2$ 模 $7$ 的幂依次为 $2, 4, 1$，所以 $f$ 的阶是 $3$。\n\n检验：如图所示，$f$ 把 $0 \\to 1 \\to 3 \\to 0$，$2 \\to 5 \\to 4 \\to 2$，都是长度为 $3$ 的圈。\n\n> **注意。** 阶是 $a$ 的阶，它只是 $p - 1$ 的因数：这里是 $3$，不是 $6$。常数 $b$ 也不改变它。",
  ),
  generate(rng) {
    const p = rng.pick([5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43]);
    const a = rng.int(1, 6) === 1 ? 1 : rng.int(2, p - 1);
    const b = rng.int(1, p - 1);
    const f = poly([a, "x"], [b, ""]);
    const powers: number[] = [a];
    while (powers[powers.length - 1] !== 1) powers.push(((powers[powers.length - 1] as number) * a) % p);
    const order = a === 1 ? p : powers.length;
    const fixed = range(0, p - 1).find((x) => (a * x + b) % p === x);
    return numberProblem({
      prompt: t(
        `What is the order of the map $f(x) = ${f}$ on $${Zn(p)}$, under composition?`,
        `映射 $f(x) = ${f}$ 在 $${Zn(p)}$ 上关于复合的阶是多少？`,
      ),
      answer: order,
      form: "integer",
      mistakes: apart(
        order,
        a === 1
          ? [
              why(
                p - 1,
                `This is the order of the group of units modulo ${p}; a translation has order ${p}.`,
                `这是模 ${p} 单位群的阶；平移的阶是 ${p}。`,
              ),
              why(
                b,
                "This is the size of the shift, not the number of steps back to the identity.",
                "这是平移的距离，不是回到恒等映射所需的步数。",
              ),
              why(
                1,
                "This treats the translation as the identity map, but $b \\ne 0$ moves every point.",
                "这把平移当成了恒等映射，但 $b \\ne 0$ 会移动每个点。",
              ),
            ]
          : [
              why(
                p,
                "This is the order of a translation; with $a \\ne 1$ the map has a fixed point.",
                "这是平移的阶；$a \\ne 1$ 时映射有不动点。",
              ),
              why(
                p - 1,
                `This is the order of the whole group of units modulo ${p}; the order of ${a} only divides it.`,
                `这是模 ${p} 整个单位群的阶；${a} 的阶只是它的因数。`,
              ),
              why(a, "This is the coefficient $a$ itself, not its order.", "这是系数 $a$ 本身，不是它的阶。"),
            ],
      ),
      solution:
        a === 1
          ? walked(
              [
                [
                  ["Recognize a translation", "认出平移"],
                  t(`$f(x) = x + ${b}$ moves every point by ${b}.`, `$f(x) = x + ${b}$ 把每个点移动 ${b}。`),
                ],
                [
                  ["Count the steps", "数步数"],
                  t(
                    `$f^n(x) = x + ${b === 1 ? "" : b}n$, which is $x$ only when ${p} divides $${b === 1 ? "" : b}n$; since ${p} is prime, that first happens at $n = ${p}$.`,
                    `$f^n(x) = x + ${b === 1 ? "" : b}n$，只有当 ${p} 整除 $${b === 1 ? "" : b}n$ 时才等于 $x$；由于 ${p} 是素数，这第一次发生在 $n = ${p}$。`,
                  ),
                ],
              ],
              t(`$f^{${p}}(0) = ${b * p} \\equiv 0 \\pmod{${p}}$.`, `$f^{${p}}(0) = ${b * p} \\equiv 0 \\pmod{${p}}$。`),
            )
          : walked(
              [
                [
                  ["Find the fixed point", "求不动点"],
                  t(
                    `$${a} \\cdot ${fixed} + ${b} = ${a * (fixed as number) + b} \\equiv ${fixed}$, so $f$ fixes ${fixed} and multiplies the distance from it by ${a}.`,
                    `$${a} \\cdot ${fixed} + ${b} = ${a * (fixed as number) + b} \\equiv ${fixed}$，所以 $f$ 固定 ${fixed}，并把到它的距离乘以 ${a}。`,
                  ),
                ],
                [
                  ["Find the order of the coefficient", "求系数的阶"],
                  t(
                    `The powers of ${a} modulo ${p} are $${powers.join(", ")}$, so the order is ${order}.`,
                    `${a} 模 ${p} 的幂依次为 $${powers.join(", ")}$，所以阶是 ${order}。`,
                  ),
                ],
              ],
              t(
                `$${a}^{${order}} \\equiv 1$, so $f^{${order}}(x) - ${fixed} \\equiv ${a}^{${order}}(x - ${fixed}) = x - ${fixed}$ for every $x$.`,
                `$${a}^{${order}} \\equiv 1$，所以对每个 $x$，$f^{${order}}(x) - ${fixed} \\equiv ${a}^{${order}}(x - ${fixed}) = x - ${fixed}$。`,
              ),
            ),
    });
  },
};

// ---------------------------------------------------------------------------
// Second pass
// ---------------------------------------------------------------------------

/** signed writes an integer as a term to be added, with its sign and a space. */
const signed = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`);
/** primeList lists the primes up to hi. */
const primeList = (hi: number) => range(2, hi).filter((n) => divisors(n).length === 2);
/** compositeList lists the composite numbers from lo to hi. */
const compositeList = (lo: number, hi: number) => range(lo, hi).filter((n) => divisors(n).length > 2);

const associativityDefect: KnowledgePointDef = {
  id: "measuring-how-far-an-operation-is-from-associative",
  title: t("Measuring how far an operation is from associative", "度量运算与结合律的差距"),
  explanation: t(
    "Many formulas define a closed operation without being associative, and a single computation can show it. Evaluate $(x \\ast y) \\ast z$ and $x \\ast (y \\ast z)$ separately, always working inside the parentheses first, and compare the results. A nonzero difference for one triple is enough to prove that the operation is not associative.\n\nFor $a \\ast b = 2a + 3b$ and $x = y = z = 1$: $1 \\ast 1 = 5$, so $(1 \\ast 1) \\ast 1 = 10 + 3 = 13$, while $1 \\ast (1 \\ast 1) = 2 + 15 = 17$. The difference is $13 - 17 = -4$.\n\nCheck: expanding in general, the difference for $a \\ast b = pa + qb$ is $(p^2 - p)x - (q^2 - q)z$, which here gives $2 - 6 = -4$.\n\n> **Watch out.** Subtract in the order asked, left bracketing minus right bracketing; swapping them flips the sign.",
    "许多公式定义的运算封闭但不满足结合律，一次计算就能说明这一点。分别计算 $(x \\ast y) \\ast z$ 和 $x \\ast (y \\ast z)$，总是先算括号内的部分，再比较结果。只要有一组三元数使差不为零，就足以证明这个运算不满足结合律。\n\n对 $a \\ast b = 2a + 3b$ 与 $x = y = z = 1$：$1 \\ast 1 = 5$，所以 $(1 \\ast 1) \\ast 1 = 10 + 3 = 13$，而 $1 \\ast (1 \\ast 1) = 2 + 15 = 17$。差为 $13 - 17 = -4$。\n\n检验：一般地展开，$a \\ast b = pa + qb$ 的差为 $(p^2 - p)x - (q^2 - q)z$，这里得 $2 - 6 = -4$。\n\n> **注意。** 要按题目的顺序相减，左边的加括号方式减去右边的；顺序颠倒会使符号相反。",
  ),
  generate(rng) {
    for (;;) {
      const p = rng.int(2, 5);
      const q = rng.int(2, 5);
      const x = rng.int(1, 9);
      const y = rng.int(1, 9);
      const z = rng.int(1, 9);
      const left = p * (p * x + q * y) + q * z;
      const right = p * x + q * (p * y + q * z);
      const answer = left - right;
      const mistakes = apart(answer, [
        why(0, "This assumes the operation is associative without computing.", "这没有计算就假设运算满足结合律。"),
        why(-answer, "This subtracts in the wrong order, right minus left.", "这把顺序减反了，用右边减左边。"),
        why(left + right, "This adds the two bracketings instead of subtracting.", "这把两种加括号的结果相加了，而不是相减。"),
        why(
          left,
          "This is only the left bracketing; the right one still has to be subtracted.",
          "这只是左边的加括号结果；还要减去右边的。",
        ),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `On $\\mathbb{Z}$, let $a \\ast b = ${p}a + ${q}b$. Find $(${x} \\ast ${y}) \\ast ${z} - ${x} \\ast (${y} \\ast ${z})$.`,
          `在 $\\mathbb{Z}$ 上，设 $a \\ast b = ${p}a + ${q}b$。求 $(${x} \\ast ${y}) \\ast ${z} - ${x} \\ast (${y} \\ast ${z})$。`,
        ),
        answer,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [
              ["Left bracketing", "左边的加括号"],
              t(
                `$${x} \\ast ${y} = ${p * x + q * y}$, so $(${x} \\ast ${y}) \\ast ${z} = ${p * (p * x + q * y)} + ${q * z} = ${left}$.`,
                `$${x} \\ast ${y} = ${p * x + q * y}$，所以 $(${x} \\ast ${y}) \\ast ${z} = ${p * (p * x + q * y)} + ${q * z} = ${left}$。`,
              ),
            ],
            [
              ["Right bracketing", "右边的加括号"],
              t(
                `$${y} \\ast ${z} = ${p * y + q * z}$, so $${x} \\ast (${y} \\ast ${z}) = ${p * x} + ${q * (p * y + q * z)} = ${right}$.`,
                `$${y} \\ast ${z} = ${p * y + q * z}$，所以 $${x} \\ast (${y} \\ast ${z}) = ${p * x} + ${q * (p * y + q * z)} = ${right}$。`,
              ),
            ],
            [["Subtract", "相减"], t(`$${left} - ${right} = ${answer}$.`, `$${left} - ${right} = ${answer}$。`)],
          ],
          t(
            `The general difference $(p^2 - p)x - (q^2 - q)z$ gives $${p * p - p} \\cdot ${x} - ${q * q - q} \\cdot ${z} = ${answer}$.`,
            `一般的差 $(p^2 - p)x - (q^2 - q)z$ 给出 $${p * p - p} \\cdot ${x} - ${q * q - q} \\cdot ${z} = ${answer}$。`,
          ),
        ),
      });
    }
  },
};

const commutingPairs: KnowledgePointDef = {
  id: "counting-the-pairs-that-commute",
  title: t("Counting the pairs that commute", "计算可交换的元素对"),
  explanation: t(
    "An operation that is not commutative may still commute on many pairs. For $a \\ast b = a + kb$ on $\\mathbb{Z}_n$, the condition $a \\ast b = b \\ast a$ reduces to $(k - 1)(a - b) = 0$. This depends only on the difference $a - b$. The difference can take $\\gcd(k - 1, n)$ values, and each works with any of the $n$ choices of $b$.\n\nFor $a \\ast b = a + 3b$ on $\\mathbb{Z}_8$, the condition is $2(a - b) = 0$, so $a - b$ is $0$ or $4$: $\\gcd(2, 8) = 2$ differences, and $8 \\cdot 2 = 16$ ordered pairs.\n\nCheck: $(1, 5)$ is one of them: $1 \\ast 5 = 16 \\equiv 0$ and $5 \\ast 1 = 8 \\equiv 0$.\n\n> **Watch out.** Count ordered pairs, all of them: the $n$ pairs with $a = b$ always commute, and the other allowed differences add more.",
    "不满足交换律的运算，仍可能在很多对元素上可交换。对 $\\mathbb{Z}_n$ 上的 $a \\ast b = a + kb$，条件 $a \\ast b = b \\ast a$ 化为 $(k - 1)(a - b) = 0$。这只取决于差 $a - b$。这个差可以取 $\\gcd(k - 1, n)$ 个值，每个值都可以搭配 $b$ 的 $n$ 种选择。\n\n对 $\\mathbb{Z}_8$ 上的 $a \\ast b = a + 3b$，条件是 $2(a - b) = 0$，所以 $a - b$ 为 $0$ 或 $4$：共 $\\gcd(2, 8) = 2$ 个差，$8 \\cdot 2 = 16$ 个有序对。\n\n检验：$(1, 5)$ 是其中之一：$1 \\ast 5 = 16 \\equiv 0$，$5 \\ast 1 = 8 \\equiv 0$。\n\n> **注意。** 要数全部有序对：$a = b$ 的 $n$ 对总是可交换，其他允许的差还会带来更多。",
  ),
  generate(rng) {
    for (;;) {
      const n = rng.int(6, 36);
      const k = rng.int(2, 13);
      const g = gcd(k - 1, n);
      const answer = n * g;
      const mistakes = apart(answer, [
        why(n, "This counts only the pairs with $a = b$.", "这只数了 $a = b$ 的对。"),
        why(n * n, "This counts every ordered pair, as if the operation were commutative.", "这数了所有有序对，好像运算可交换一样。"),
        why(
          g,
          `This counts the allowed differences $a - b$ but forgets the ${n} choices of $b$.`,
          `这数了允许的差 $a - b$，却忘了 $b$ 的 ${n} 种选择。`,
        ),
        why(
          n * (k - 1),
          `This multiplies by $k - 1 = ${k - 1}$ instead of by $\\gcd(${k - 1}, ${n})$.`,
          `这乘的是 $k - 1 = ${k - 1}$，而不是 $\\gcd(${k - 1}, ${n})$。`,
        ),
      ]);
      if (mistakes.length < 2) continue;
      const differences = range(0, g - 1)
        .map((i) => i * (n / g))
        .join(", ");
      return numberProblem({
        prompt: t(
          `On ${"$"}${Zn(n)}$, let $a \\ast b = a + ${k}b$. How many ordered pairs $(a, b)$ satisfy $a \\ast b = b \\ast a$?`,
          `在 ${"$"}${Zn(n)}$ 上，设 $a \\ast b = a + ${k}b$。有多少个有序对 $(a, b)$ 满足 $a \\ast b = b \\ast a$？`,
        ),
        answer,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [
              ["Reduce the condition", "化简条件"],
              t(
                `$a + ${k}b = b + ${k}a$ becomes $${k - 1 === 1 ? "" : k - 1}(a - b) = 0$ in $${Zn(n)}$.`,
                `$a + ${k}b = b + ${k}a$ 在 $${Zn(n)}$ 中化为 $${k - 1 === 1 ? "" : k - 1}(a - b) = 0$。`,
              ),
            ],
            [
              ["Count the differences", "数差的个数"],
              t(
                `$\\gcd(${k - 1}, ${n}) = ${g}$ differences satisfy it, and with ${n} choices of $b$ there are $${n} \\cdot ${g} = ${answer}$ pairs.`,
                `有 $\\gcd(${k - 1}, ${n}) = ${g}$ 个差满足它，$b$ 有 ${n} 种选择，所以有 $${n} \\cdot ${g} = ${answer}$ 对。`,
              ),
            ],
          ],
          t(
            `The allowed differences are the multiples of $${n / g}$: $${differences}$, and $${k - 1} \\cdot ${n / g} = ${(k - 1) * (n / g)}$ is a multiple of ${n}.`,
            `允许的差是 $${n / g}$ 的倍数：$${differences}$，而 $${k - 1} \\cdot ${n / g} = ${(k - 1) * (n / g)}$ 是 ${n} 的倍数。`,
          ),
        ),
      });
    }
  },
};

const shiftedIdentity: KnowledgePointDef = {
  id: "the-identity-of-a-shifted-product",
  title: t("The identity of a shifted product", "平移乘积的单位元"),
  explanation: t(
    "An operation such as $a \\ast b = (a + c)(b + c) - c$ is ordinary multiplication in disguise, because $a \\ast b + c$ equals $(a + c)(b + c)$. So the map $a \\mapsto a + c$ carries it to multiplication, whose identity is 1. The identity of the new operation is the element sent to 1, that is $1 - c$.\n\nFor $a \\ast b = (a + 3)(b + 3) - 3$, the identity is $1 - 3 = -2$, because $-2 + 3 = 1$.\n\nCheck: $(-2) \\ast 5 = (1)(8) - 3 = 5$ and $5 \\ast (-2) = (8)(1) - 3 = 5$.\n\n> **Watch out.** The shifted identity must be $1$, the identity of multiplication, not $0$: $e + 3 = 0$ gives $e = -3$, and $(-3) \\ast 5 = 0 - 3 = -3$, not $5$.",
    "$a \\ast b = (a + c)(b + c) - c$ 这样的运算其实是伪装的普通乘法，因为 $a \\ast b + c$ 等于 $(a + c)(b + c)$。所以映射 $a \\mapsto a + c$ 把它变成乘法，而乘法的单位元是 1。新运算的单位元就是被映到 1 的元素，即 $1 - c$。\n\n对 $a \\ast b = (a + 3)(b + 3) - 3$，单位元为 $1 - 3 = -2$，因为 $-2 + 3 = 1$。\n\n检验：$(-2) \\ast 5 = (1)(8) - 3 = 5$，$5 \\ast (-2) = (8)(1) - 3 = 5$。\n\n> **注意。** 平移后的单位元必须是乘法的单位元 $1$，而不是 $0$：由 $e + 3 = 0$ 得 $e = -3$，但 $(-3) \\ast 5 = 0 - 3 = -3$，不是 $5$。",
  ),
  generate(rng) {
    const c = pickNonzero(rng, 20);
    const answer = 1 - c;
    const operation = `(a ${signed(c)})(b ${signed(c)}) ${signed(-c)}`;
    return numberProblem({
      prompt: t(
        `Find the identity element of the operation $a \\ast b = ${operation}$ on $\\mathbb{Z}$.`,
        `求 $\\mathbb{Z}$ 上运算 $a \\ast b = ${operation}$ 的单位元。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          -c,
          `This solves $e ${signed(c)} = 0$; the shifted identity must be $1$, the identity of multiplication.`,
          `这解的是 $e ${signed(c)} = 0$；平移后的单位元必须是乘法的单位元 $1$。`,
        ),
        why(c, "This copies the shift instead of solving for the identity.", "这照抄了平移量，而没有解出单位元。"),
        why(
          1 + c,
          `This shifts the wrong way: $e ${signed(c)} = 1$ gives $e = 1 ${signed(-c)}$.`,
          `这把平移方向弄反了：由 $e ${signed(c)} = 1$ 得 $e = 1 ${signed(-c)}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Set up the condition", "列出条件"],
            t(
              `We need $(a ${signed(c)})(e ${signed(c)}) ${signed(-c)} = a$, that is $(a ${signed(c)})(e ${signed(c)}) = a ${signed(c)}$, for all $a$.`,
              `需要对所有 $a$ 有 $(a ${signed(c)})(e ${signed(c)}) ${signed(-c)} = a$，即 $(a ${signed(c)})(e ${signed(c)}) = a ${signed(c)}$。`,
            ),
          ],
          [["Solve", "求解"], t(`So $e ${signed(c)} = 1$ and $e = ${answer}$.`, `所以 $e ${signed(c)} = 1$，$e = ${answer}$。`)],
        ],
        t(
          `$${answer < 0 ? `(${answer})` : answer} \\ast 0 = (1)(${c}) ${signed(-c)} = 0$, and the same works for every $a$.`,
          `$${answer < 0 ? `(${answer})` : answer} \\ast 0 = (1)(${c}) ${signed(-c)} = 0$，对每个 $a$ 同样成立。`,
        ),
      ),
    });
  },
};

const noInverse: KnowledgePointDef = {
  id: "the-element-with-no-inverse",
  title: t("The element with no inverse", "没有逆元的元素"),
  explanation: t(
    "Under $a \\ast b = a + b + kab$ on the rationals, the identity is 0, so an inverse of $a$ must solve $b(1 + ka) = -a$. Dividing by $1 + ka$ works except when this factor vanishes. At $a = -\\frac{1}{k}$ the equation reads $0 = -a$, which is false. That single element keeps the operation from being a group on all of the rationals.\n\nFor $a \\ast b = a + b + 2ab$, the factor $1 + 2a$ vanishes at $a = -\\frac{1}{2}$, so $-\\frac{1}{2}$ has no inverse.\n\nCheck: $\\left(-\\frac{1}{2}\\right) \\ast b = -\\frac{1}{2} + b - b = -\\frac{1}{2}$ for every $b$, so the result is never the identity $0$.\n\n> **Watch out.** The answer is $-\\frac{1}{k}$, the reciprocal of the coefficient with its sign flipped, not $k$ itself or $-k$.",
    "在有理数上的 $a \\ast b = a + b + kab$ 之下，单位元是 0，所以 $a$ 的逆元必须满足 $b(1 + ka) = -a$。除以 $1 + ka$ 是可行的，除非这个因子为零。在 $a = -\\frac{1}{k}$ 处，方程变成 $0 = -a$，这不成立。正是这一个元素，使这个运算在全体有理数上不构成群。\n\n对 $a \\ast b = a + b + 2ab$，因子 $1 + 2a$ 在 $a = -\\frac{1}{2}$ 处为零，所以 $-\\frac{1}{2}$ 没有逆元。\n\n检验：对每个 $b$，$\\left(-\\frac{1}{2}\\right) \\ast b = -\\frac{1}{2} + b - b = -\\frac{1}{2}$，结果永远不是单位元 $0$。\n\n> **注意。** 答案是 $-\\frac{1}{k}$，即系数的倒数再变号，而不是 $k$ 本身或 $-k$。",
  ),
  generate(rng) {
    const q = rng.int(1, 9);
    const p = rng.pick(range(1, 9).filter((v) => gcd(v, q) === 1));
    const negative = rng.pick([false, true]);
    const size = Q.of(p, q);
    const k = negative ? size.neg() : size;
    const coefficient = p === q ? "" : size.toLatex();
    const sign = negative ? "-" : "+";
    const answer = Q.of(negative ? q : -q, p);
    return numberProblem({
      prompt: t(
        `On $\\mathbb{Q}$, the operation $a \\ast b = a + b ${sign} ${coefficient}ab$ has identity 0. Which element has no inverse?`,
        `在 $\\mathbb{Q}$ 上，运算 $a \\ast b = a + b ${sign} ${coefficient}ab$ 的单位元是 0。哪个元素没有逆元？`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          answer.neg(),
          "This drops the sign: the factor vanishes where the coefficient times $a$ equals $-1$.",
          "这丢掉了符号：因子为零的地方是系数乘 $a$ 等于 $-1$。",
        ),
        why(
          k,
          "This copies the coefficient instead of solving for the element where the factor vanishes.",
          "这照抄了系数，而没有解出使因子为零的元素。",
        ),
        why(k.neg(), "This negates the coefficient but forgets to take its reciprocal.", "这把系数变了号，却忘了取倒数。"),
        why(Q.of(0), "The element $0$ is the identity, which is its own inverse.", "元素 $0$ 是单位元，它是自己的逆元。"),
      ]),
      solution: walked(
        [
          [
            ["Set up the inverse", "列出逆元的条件"],
            t(
              `An inverse $b$ of $a$ needs $a + b ${sign} ${coefficient}ab = 0$, that is $b(1 ${sign} ${coefficient}a) = -a$.`,
              `$a$ 的逆元 $b$ 需满足 $a + b ${sign} ${coefficient}ab = 0$，即 $b(1 ${sign} ${coefficient}a) = -a$。`,
            ),
          ],
          [
            ["Find where it fails", "找出不成立之处"],
            t(
              `This has no solution when $1 ${sign} ${coefficient}a = 0$, that is at $a = ${answer.toLatex()}$, where it would read $0 = -a \\ne 0$.`,
              `当 $1 ${sign} ${coefficient}a = 0$，即 $a = ${answer.toLatex()}$ 时，它变成 $0 = -a \\ne 0$，没有解。`,
            ),
          ],
        ],
        t(
          `For $a = ${answer.toLatex()}$, the term $${sign === "-" ? "-" : ""}${coefficient}ab$ equals $-b$, so $a \\ast b = ${answer.toLatex()} + b - b = ${answer.toLatex()}$, never $0$.`,
          `当 $a = ${answer.toLatex()}$ 时，项 $${sign === "-" ? "-" : ""}${coefficient}ab$ 等于 $-b$，所以 $a \\ast b = ${answer.toLatex()} + b - b = ${answer.toLatex()}$，永远不是 $0$。`,
        ),
      ),
    });
  },
};

const triangularInverse: KnowledgePointDef = {
  id: "the-inverse-of-an-upper-triangular-matrix",
  title: t("The inverse of an upper triangular matrix", "上三角矩阵的逆"),
  explanation: t(
    "Invertible upper triangular matrices form a subgroup of $GL(2, \\mathbb{Q})$, so an inverse of one is again upper triangular. Its diagonal entries are simply the reciprocals of the originals. The top right entry takes more care: it is $-\\frac{b}{ad}$, which comes from the usual formula, with the determinant $ad$ dividing the swapped and negated entries.\n\nFor $A = \\begin{pmatrix} 2 & 3 \\\\ 0 & 4 \\end{pmatrix}$, the determinant is $8$, so the top right entry of $A^{-1}$ is $-\\frac{3}{8}$, and the diagonal is $\\frac{1}{2}, \\frac{1}{4}$.\n\nCheck: the first row of $A$ times the second column of $A^{-1}$ is $2 \\cdot \\left(-\\frac{3}{8}\\right) + 3 \\cdot \\frac{1}{4} = 0$, as the identity requires.\n\n> **Watch out.** The top right entry is not simply $-b$: it is divided by the whole determinant $ad$, not by $a$ alone or $a^2$.",
    "可逆上三角矩阵构成 $GL(2, \\mathbb{Q})$ 的子群，所以它的逆仍是上三角矩阵。逆的对角元就是原对角元的倒数。右上角元素要多加小心：它是 $-\\frac{b}{ad}$，来自通常的公式，其中行列式 $ad$ 去除交换并取负后的元素。\n\n对 $A = \\begin{pmatrix} 2 & 3 \\\\ 0 & 4 \\end{pmatrix}$，行列式为 $8$，所以 $A^{-1}$ 右上角的元素是 $-\\frac{3}{8}$，对角元为 $\\frac{1}{2}, \\frac{1}{4}$。\n\n检验：$A$ 的第一行乘 $A^{-1}$ 的第二列为 $2 \\cdot \\left(-\\frac{3}{8}\\right) + 3 \\cdot \\frac{1}{4} = 0$，正如单位矩阵所要求的。\n\n> **注意。** 右上角元素不只是 $-b$：它要除以整个行列式 $ad$，而不是只除以 $a$ 或 $a^2$。",
  ),
  generate(rng) {
    for (;;) {
      const a = pickNonzero(rng, 9);
      const b = pickNonzero(rng, 9);
      const d = pickNonzero(rng, 9);
      const answer = Q.of(-b, a * d);
      const mistakes = apart(answer, [
        why(answer.neg(), "This forgets to negate $b$ in the adjugate.", "这忘了在伴随矩阵中把 $b$ 取负。"),
        why(Q.of(-b), "This negates $b$ but forgets to divide by the determinant.", "这把 $b$ 取负了，却忘了除以行列式。"),
        why(Q.of(-b, a * a), "This divides by $a^2$ instead of the determinant $ad$.", "这除以了 $a^2$，而不是行列式 $ad$。"),
        why(Q.of(1, a), "This is the top left entry of the inverse, not the top right one.", "这是逆矩阵左上角的元素，而不是右上角的。"),
      ]);
      if (mistakes.length < 2) continue;
      const shown = answer.toNumber() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex();
      const last = Q.of(1, d);
      const lastShown = d < 0 ? `\\left(${last.toLatex()}\\right)` : last.toLatex();
      const scale = a * d === 1 ? "" : a * d === -1 ? "-" : Q.of(1, a * d).toLatex();
      return numberProblem({
        prompt: t(
          `Let $A = \\begin{pmatrix} ${a} & ${b} \\\\ 0 & ${d} \\end{pmatrix}$ in $GL(2, \\mathbb{Q})$. Find the top right entry of $A^{-1}$.`,
          `设 $GL(2, \\mathbb{Q})$ 中的 $A = \\begin{pmatrix} ${a} & ${b} \\\\ 0 & ${d} \\end{pmatrix}$。求 $A^{-1}$ 右上角的元素。`,
        ),
        answer,
        mistakes,
        solution: walked(
          [
            [
              ["Find the determinant", "求行列式"],
              t(
                `$\\det A = ${a < 0 ? `(${a})` : a} \\cdot ${d < 0 ? `(${d})` : d} = ${a * d}$.`,
                `$\\det A = ${a < 0 ? `(${a})` : a} \\cdot ${d < 0 ? `(${d})` : d} = ${a * d}$。`,
              ),
            ],
            [
              ["Apply the formula", "套用公式"],
              t(
                `$A^{-1} = ${scale}\\begin{pmatrix} ${d} & ${-b} \\\\ 0 & ${a} \\end{pmatrix}$, so the top right entry is $${answer.toLatex()}$.`,
                `$A^{-1} = ${scale}\\begin{pmatrix} ${d} & ${-b} \\\\ 0 & ${a} \\end{pmatrix}$，所以右上角的元素是 $${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            `The first row of $A$ times the second column of $A^{-1}$ is $${a} \\cdot ${shown} ${b < 0 ? "-" : "+"} ${Math.abs(b)} \\cdot ${lastShown} = 0$.`,
            `$A$ 的第一行乘 $A^{-1}$ 的第二列为 $${a} \\cdot ${shown} ${b < 0 ? "-" : "+"} ${Math.abs(b)} \\cdot ${lastShown} = 0$。`,
          ),
        ),
      });
    }
  },
};

const orderFromTwoPowers: KnowledgePointDef = {
  id: "the-order-allowed-by-two-powers",
  title: t("The order allowed by two powers", "两个幂所允许的阶"),
  explanation: t(
    "If $a^m = e$ then the order of $a$ divides $m$, because the powers of $a$ repeat with that order as period. So two such equations force the order to divide both exponents, and hence their greatest common divisor. An element of that exact order exists in a cyclic group of that size, so the bound cannot be improved.\n\nIf $a^{12} = e$ and $a^{18} = e$, the order of $a$ divides $\\gcd(12, 18) = 6$, so it is at most $6$.\n\nCheck: in $\\mathbb{Z}_6$ the element $1$ has order $6$, and $12 \\cdot 1$ and $18 \\cdot 1$ are both multiples of $6$, so both equations hold and the order $6$ is reached.\n\n> **Watch out.** The order must divide both exponents, so take their greatest common divisor, not their least common multiple or the smaller exponent.",
    "如果 $a^m = e$，那么 $a$ 的阶整除 $m$，因为 $a$ 的幂以阶为周期重复。所以两个这样的方程迫使阶同时整除两个指数，从而整除它们的最大公约数。在这个大小的循环群中，恰好有这个阶的元素，所以这个界不能再改进。\n\n若 $a^{12} = e$ 且 $a^{18} = e$，则 $a$ 的阶整除 $\\gcd(12, 18) = 6$，所以至多为 $6$。\n\n检验：在 $\\mathbb{Z}_6$ 中元素 $1$ 的阶为 $6$，而 $12 \\cdot 1$ 与 $18 \\cdot 1$ 都是 $6$ 的倍数，所以两个方程都成立，阶 $6$ 可以达到。\n\n> **注意。** 阶必须同时整除两个指数，所以要取它们的最大公约数，而不是最小公倍数或较小的指数。",
  ),
  generate(rng) {
    // Mostly a common factor above one, so that the answer is rarely the trivial order.
    const common = rng.int(1, 12);
    const [p, q] = rng.shuffle(
      rng.pick([
        [2, 3],
        [2, 5],
        [2, 7],
        [3, 4],
        [3, 5],
        [3, 7],
        [4, 5],
        [4, 7],
        [5, 6],
        [5, 7],
      ] as const),
    );
    const m = common * (p as number);
    const n = common * (q as number);
    const answer = gcd(m, n);
    return numberProblem({
      prompt: t(
        `In a group, an element $a$ satisfies $a^{${m}} = e$ and $a^{${n}} = e$. What is the largest possible order of $a$?`,
        `在一个群中，元素 $a$ 满足 $a^{${m}} = e$ 和 $a^{${n}} = e$。$a$ 的阶最大可能是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          lcm(m, n),
          "This is the least common multiple; the order must divide both exponents, so it is at most their greatest common divisor.",
          "这是最小公倍数；阶必须同时整除两个指数，所以至多是它们的最大公约数。",
        ),
        why(
          Math.min(m, n),
          "The smaller exponent need not divide the larger one, so it is not a possible order here.",
          "较小的指数不一定整除较大的指数，所以它在这里不可能是阶。",
        ),
        why(
          Math.abs(m - n),
          "The difference of the exponents is only a multiple of the order, not the largest order allowed.",
          "两个指数之差只是阶的倍数，而不是所允许的最大的阶。",
        ),
      ]),
      solution: walked(
        [
          [["Use divisibility", "利用整除"], t(`The order of $a$ divides both ${m} and ${n}.`, `$a$ 的阶同时整除 ${m} 和 ${n}。`)],
          [
            ["Take the gcd", "取最大公约数"],
            t(
              `So it divides $\\gcd(${m}, ${n}) = ${answer}$, and the largest possible order is $${answer}$.`,
              `所以它整除 $\\gcd(${m}, ${n}) = ${answer}$，阶最大可能是 $${answer}$。`,
            ),
          ],
        ],
        t(
          `In $\\mathbb{Z}_{${answer}}$ the element $1$ has order ${answer}, and $${m} = ${answer} \\cdot ${m / answer}$, $${n} = ${answer} \\cdot ${n / answer}$, so both equations hold.`,
          `在 $\\mathbb{Z}_{${answer}}$ 中元素 $1$ 的阶为 ${answer}，而 $${m} = ${answer} \\cdot ${m / answer}$，$${n} = ${answer} \\cdot ${n / answer}$，所以两个方程都成立。`,
        ),
      ),
    });
  },
};

const orderOfProductWithUnits: KnowledgePointDef = {
  id: "the-order-of-a-units-group-times-a-cyclic-group",
  title: t("The order of a units group times a cyclic group", "单位群与循环群之积的阶"),
  explanation: t(
    "The order of a direct product is the product of the orders, because an element is a free choice of one coordinate from each factor. The first factor here must be counted with care: $U(m)$ has $\\varphi(m)$ elements, not $m$, since only residues coprime to $m$ belong to it. So the total is $\\varphi(m)$ times the size of the other factor.\n\nFor $U(10) \\times \\mathbb{Z}_4$: the units modulo $10$ are $1, 3, 7, 9$, so $\\varphi(10) = 4$ and the order is $4 \\cdot 4 = 16$.\n\nCheck: each of the $4$ units pairs with each of the $4$ elements of $\\mathbb{Z}_4$, which gives $16$ pairs.\n\n> **Watch out.** $U(m)$ is not $\\mathbb{Z}_m$: counting it as $m$ elements gives $10 \\cdot 4 = 40$ here, which is wrong.",
    "直积的阶是各因子阶的乘积，因为一个元素就是从每个因子中自由选一个坐标。这里第一个因子要仔细数：$U(m)$ 有 $\\varphi(m)$ 个元素，而不是 $m$ 个，因为只有与 $m$ 互素的剩余才属于它。所以总数是 $\\varphi(m)$ 乘以另一个因子的大小。\n\n对 $U(10) \\times \\mathbb{Z}_4$：模 $10$ 的单位为 $1, 3, 7, 9$，所以 $\\varphi(10) = 4$，阶为 $4 \\cdot 4 = 16$。\n\n检验：$4$ 个单位中的每一个与 $\\mathbb{Z}_4$ 的 $4$ 个元素中的每一个配对，共 $16$ 对。\n\n> **注意。** $U(m)$ 不是 $\\mathbb{Z}_m$：把它算成 $m$ 个元素，这里会得到 $10 \\cdot 4 = 40$，这是错的。",
  ),
  generate(rng) {
    const m = rng.int(3, 30);
    const n = rng.int(2, 20);
    const phi = totient(m);
    const answer = phi * n;
    const units = range(1, m - 1).filter((k) => gcd(m, k) === 1);
    return numberProblem({
      prompt: t(`Find the order of the group $U(${m}) \\times ${Zn(n)}$.`, `求群 $U(${m}) \\times ${Zn(n)}$ 的阶。`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          m * n,
          `This counts $U(${m})$ as ${m} elements; only the residues coprime to ${m} are units.`,
          `这把 $U(${m})$ 算成了 ${m} 个元素；只有与 ${m} 互素的剩余才是单位。`,
        ),
        why(phi + n, "This adds the orders; the order of a direct product is their product.", "这把阶相加了；直积的阶是它们的乘积。"),
        why(
          phi * totient(n),
          `This treats $${Zn(n)}$ as a units group too; it has all ${n} residues.`,
          `这把 $${Zn(n)}$ 也当成了单位群；它含有全部 ${n} 个剩余。`,
        ),
        why((m - 1) * n, `This counts every nonzero residue modulo ${m} as a unit.`, `这把模 ${m} 的每个非零剩余都算作单位。`),
      ]),
      solution: walked(
        [
          [
            ["Count the units", "数单位"],
            t(`The group $U(${m})$ has $\\varphi(${m}) = ${phi}$ elements.`, `群 $U(${m})$ 有 $\\varphi(${m}) = ${phi}$ 个元素。`),
          ],
          [
            ["Multiply the orders", "阶相乘"],
            t(`So the product has $${phi} \\cdot ${n} = ${answer}$ elements.`, `所以直积有 $${phi} \\cdot ${n} = ${answer}$ 个元素。`),
          ],
        ],
        t(
          `The residues coprime to ${m} are ${units.join(", ")}, which is ${phi} of them, and each pairs with ${n} elements of $${Zn(n)}$.`,
          `与 ${m} 互素的剩余为 ${units.join("、")}，共 ${phi} 个，每个与 $${Zn(n)}$ 的 ${n} 个元素配对。`,
        ),
      ),
    });
  },
};

const inverseOfSquare: KnowledgePointDef = {
  id: "the-inverse-of-a-square-from-a-known-inverse",
  title: t("The inverse of a square from a known inverse", "由已知逆元求平方的逆元"),
  explanation: t(
    "In any group, the inverse of a power is the same power of the inverse, since $a^2 \\cdot (a^{-1})^2 = e$. So once one inverse in $U(p)$ has been found, others come cheaply. Squaring the known inverse and reducing modulo $p$ gives the inverse of $a^2$, without running the Euclidean algorithm a second time.\n\nIn $U(11)$ the inverse of $3$ is $4$, since $12 \\equiv 1$. So the inverse of $3^2 = 9$ is $4^2 = 16 \\equiv 5$.\n\nCheck: $9 \\cdot 5 = 45 = 44 + 1 \\equiv 1 \\pmod{11}$.\n\n> **Watch out.** Square the inverse, not the element and not twice the inverse: $3^2 = 9$ and $2 \\cdot 4 = 8$ are not inverses of $9$.",
    "在任何群中，幂的逆元就是逆元的同次幂，因为 $a^2 \\cdot (a^{-1})^2 = e$。所以在 $U(p)$ 中求出一个逆元后，其他逆元就很容易得到。把已知逆元平方并模 $p$ 化简，就得到 $a^2$ 的逆元，不必再做一次欧几里得算法。\n\n在 $U(11)$ 中 $3$ 的逆元是 $4$，因为 $12 \\equiv 1$。所以 $3^2 = 9$ 的逆元是 $4^2 = 16 \\equiv 5$。\n\n检验：$9 \\cdot 5 = 45 = 44 + 1 \\equiv 1 \\pmod{11}$。\n\n> **注意。** 要把逆元平方，而不是把元素平方，也不是把逆元乘 2：$3^2 = 9$ 和 $2 \\cdot 4 = 8$ 都不是 $9$ 的逆元。",
  ),
  generate(rng) {
    const p = rng.pick(primeList(47).filter((v) => v >= 7));
    const a = rng.int(2, p - 2);
    const c = range(1, p - 1).find((v) => (v * a) % p === 1) ?? 1;
    const answer = (c * c) % p;
    return numberProblem({
      prompt: t(
        `In $U(${p})$, the inverse of $${a}$ is $${c}$. Find the inverse of $${a}^2$. Give an answer between $0$ and $${p - 1}$.`,
        `在 $U(${p})$ 中，$${a}$ 的逆元是 $${c}$。求 $${a}^2$ 的逆元。答案取 $0$ 到 $${p - 1}$ 之间的数。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(c, `This is the inverse of $${a}$ itself, not of its square.`, `这是 $${a}$ 本身的逆元，而不是它平方的逆元。`),
        why((a * a) % p, "This squares the element instead of its inverse.", "这把元素平方了，而不是把逆元平方。"),
        why(
          (2 * c) % p,
          "This doubles the inverse; a square calls for multiplying the inverse by itself.",
          "这把逆元乘了 2；平方需要把逆元乘以它自己。",
        ),
        why(p - c, `This is the inverse of $-${a}$, not of $${a}^2$.`, `这是 $-${a}$ 的逆元，而不是 $${a}^2$ 的。`),
      ]),
      solution: walked(
        [
          [
            ["Use the power rule", "利用幂的规则"],
            t(
              `The inverse of $${a}^2$ is the square of the inverse of $${a}$, that is $${c}^2$.`,
              `$${a}^2$ 的逆元是 $${a}$ 的逆元的平方，即 $${c}^2$。`,
            ),
          ],
          [
            ["Reduce", "化简"],
            t(`$${c}^2 = ${c * c} \\equiv ${answer} \\pmod{${p}}$.`, `$${c}^2 = ${c * c} \\equiv ${answer} \\pmod{${p}}$。`),
          ],
        ],
        t(
          `$${a}^2 = ${a * a} \\equiv ${(a * a) % p}$, and $${(a * a) % p} \\cdot ${answer} = ${((a * a) % p) * answer} \\equiv 1 \\pmod{${p}}$.`,
          `$${a}^2 = ${a * a} \\equiv ${(a * a) % p}$，而 $${(a * a) % p} \\cdot ${answer} = ${((a * a) % p) * answer} \\equiv 1 \\pmod{${p}}$。`,
        ),
      ),
    });
  },
};

const productSetSize: KnowledgePointDef = {
  id: "the-size-of-a-product-of-two-subgroups",
  title: t("The size of a product of two subgroups", "两个子群乘积的大小"),
  explanation: t(
    "The set $HK$ of all products $hk$ need not be a subgroup, but its size can still be counted. There are $|H||K|$ pairs $(h, k)$, and each product arises from exactly $|H \\cap K|$ of them, because an element of the intersection can be moved from one factor to the other. So $|HK| = \\frac{|H||K|}{|H \\cap K|}$.\n\nIn $S_3$, take $H = \\{e, s\\}$ and $K = \\{e, rs\\}$, with $H \\cap K = \\{e\\}$: $|HK| = 2 \\cdot 2 = 4$, namely $e$, $rs$, $s$ and $s \\cdot rs = r^2$.\n\nCheck: $4$ does not divide $6$, so this $HK$ cannot be a subgroup, which agrees with the warning that $HK$ need not be one.\n\n> **Watch out.** Divide by the size of the intersection: when $H$ and $K$ share elements, $|H||K|$ counts each product more than once.",
    "所有乘积 $hk$ 构成的集合 $HK$ 不一定是子群，但它的大小仍然可以计算。有 $|H||K|$ 个对 $(h, k)$，每个乘积恰好由其中 $|H \\cap K|$ 个对得到，因为交集中的元素可以从一个因子移到另一个因子。所以 $|HK| = \\frac{|H||K|}{|H \\cap K|}$。\n\n在 $S_3$ 中取 $H = \\{e, s\\}$、$K = \\{e, rs\\}$，$H \\cap K = \\{e\\}$：$|HK| = 2 \\cdot 2 = 4$，即 $e$、$rs$、$s$ 与 $s \\cdot rs = r^2$。\n\n检验：$4$ 不整除 $6$，所以这个 $HK$ 不可能是子群，这与“$HK$ 不一定是子群”一致。\n\n> **注意。** 要除以交的大小：当 $H$ 与 $K$ 有公共元素时，$|H||K|$ 会把每个乘积算多次。",
  ),
  generate(rng) {
    const g = rng.int(1, 9);
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const answer = g * a * b;
    const m = g * a;
    const n = g * b;
    return numberProblem({
      prompt: t(
        `Subgroups $H$ and $K$ of a group have orders ${m} and ${n}, and $|H \\cap K| = ${g}$. How many elements does the set $HK$ have?`,
        `群的子群 $H$、$K$ 的阶分别是 ${m} 和 ${n}，且 $|H \\cap K| = ${g}$。集合 $HK$ 有多少个元素？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(m * n, `This counts the pairs; each product arises from $${g}$ of them.`, `这数的是对的个数；每个乘积由其中 $${g}$ 个对得到。`),
        why(m + n - g, "This counts the union $H \\cup K$, not the set of products.", "这数的是并集 $H \\cup K$，而不是乘积的集合。"),
        why(
          m + n,
          "Adding the orders counts the elements of $H$ and $K$, not their products.",
          "把阶相加数的是 $H$ 与 $K$ 的元素，而不是它们的乘积。",
        ),
        why(
          lcm(m, n),
          "The lcm would be the size of a cyclic subgroup containing both, which $HK$ need not be.",
          "最小公倍数是同时包含两者的循环子群的大小，而 $HK$ 不一定是这样的子群。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Count the pairs", "数对"],
            t(`There are $${m} \\cdot ${n} = ${m * n}$ pairs $(h, k)$.`, `共有 $${m} \\cdot ${n} = ${m * n}$ 个对 $(h, k)$。`),
          ],
          [
            ["Divide by the repeats", "除以重复次数"],
            t(
              `Each product arises from $|H \\cap K| = ${g}$ pairs, so $|HK| = ${m * n} \\div ${g} = ${answer}$.`,
              `每个乘积由 $|H \\cap K| = ${g}$ 个对得到，所以 $|HK| = ${m * n} \\div ${g} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$${answer} \\cdot ${g} = ${m * n}$, and $${answer}$ is at least $${Math.max(m, n)}$, since $HK$ contains both $H$ and $K$.`,
          `$${answer} \\cdot ${g} = ${m * n}$，且 $${answer}$ 不小于 $${Math.max(m, n)}$，因为 $HK$ 同时包含 $H$ 与 $K$。`,
        ),
      ),
    });
  },
};

const annihilatedElements: KnowledgePointDef = {
  id: "the-solutions-of-kx-equals-zero-in-zn",
  title: t("The solutions of $kx = 0$ in $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 中 $kx = 0$ 的解"),
  explanation: t(
    "The map $x \\mapsto kx$ is a homomorphism from $\\mathbb{Z}_n$ to itself, and the solutions of $kx = 0$ are its kernel. The image is the subgroup generated by $k$, which has $\\frac{n}{\\gcd(k, n)}$ elements. Dividing $n$ by this size leaves $\\gcd(k, n)$ for the kernel. The solutions are exactly the multiples of $\\frac{n}{\\gcd(k, n)}$.\n\nIn $\\mathbb{Z}_{12}$, $8x = 0$: $\\gcd(8, 12) = 4$, so there are $4$ solutions, the multiples of $\\frac{12}{4} = 3$: $0, 3, 6, 9$.\n\nCheck: $8 \\cdot 3 = 24$, $8 \\cdot 6 = 48$ and $8 \\cdot 9 = 72$ are all multiples of $12$, while $8 \\cdot 1 = 8$ is not.\n\n> **Watch out.** Count $x = 0$ too: it always solves $kx = 0$.",
    "映射 $x \\mapsto kx$ 是 $\\mathbb{Z}_n$ 到自身的同态，$kx = 0$ 的解就是它的核。像是由 $k$ 生成的子群，有 $\\frac{n}{\\gcd(k, n)}$ 个元素。用 $n$ 除以这个大小，得到核的大小 $\\gcd(k, n)$。这些解恰好是 $\\frac{n}{\\gcd(k, n)}$ 的倍数。\n\n在 $\\mathbb{Z}_{12}$ 中解 $8x = 0$：$\\gcd(8, 12) = 4$，所以有 $4$ 个解，即 $\\frac{12}{4} = 3$ 的倍数 $0, 3, 6, 9$。\n\n检验：$8 \\cdot 3 = 24$、$8 \\cdot 6 = 48$、$8 \\cdot 9 = 72$ 都是 $12$ 的倍数，而 $8 \\cdot 1 = 8$ 不是。\n\n> **注意。** $x = 0$ 也要算上：它总是 $kx = 0$ 的解。",
  ),
  generate(rng) {
    // n = answer * a and k = answer * b with a and b coprime, so that the count is above one.
    const common = rng.int(2, 10);
    const a = rng.int(2, 8);
    const b = rng.pick(range(1, a - 1).filter((v) => gcd(v, a) === 1));
    const n = common * a;
    const k = common * b;
    const answer = gcd(k, n);
    return numberProblem({
      prompt: t(`How many elements $x$ of ${"$"}${Zn(n)}$ satisfy $${k}x = 0$?`, `${"$"}${Zn(n)}$ 中有多少个元素 $x$ 满足 $${k}x = 0$？`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          n / answer,
          "This is the size of the image, the subgroup generated by $k$; the solutions form the kernel.",
          "这是像的大小，即由 $k$ 生成的子群；解构成的是核。",
        ),
        why(answer - 1, "This leaves out $x = 0$, which always solves the equation.", "这漏掉了 $x = 0$，它总是方程的解。"),
        why(
          1,
          `Not only $x = 0$: $\\gcd(${k}, ${n}) = ${answer}$ elements solve the equation.`,
          `不只是 $x = 0$：共有 $\\gcd(${k}, ${n}) = ${answer}$ 个元素满足方程。`,
        ),
        why(
          n,
          `Not every element works: $${k} \\cdot 1 = ${k}$ is not $0$ in ${"$"}${Zn(n)}$.`,
          `并非每个元素都行：在 ${"$"}${Zn(n)}$ 中 $${k} \\cdot 1 = ${k}$ 不是 $0$。`,
        ),
        why(
          k,
          "The coefficient is not the number of solutions; count the multiples of $\\frac{n}{\\gcd(k, n)}$.",
          "系数不是解的个数；要数 $\\frac{n}{\\gcd(k, n)}$ 的倍数。",
        ),
      ]),
      solution: walked(
        [
          [["Take the gcd", "求最大公约数"], t(`$\\gcd(${k}, ${n}) = ${answer}$.`, `$\\gcd(${k}, ${n}) = ${answer}$。`)],
          [
            ["Count the kernel", "数核"],
            t(
              `The image of $x \\mapsto ${k}x$ has $\\frac{${n}}{${answer}} = ${n / answer}$ elements, so the kernel has $\\frac{${n}}{${n / answer}} = ${answer}$: the multiples of $${n / answer}$.`,
              `映射 $x \\mapsto ${k}x$ 的像有 $\\frac{${n}}{${answer}} = ${n / answer}$ 个元素，所以核有 $\\frac{${n}}{${n / answer}} = ${answer}$ 个元素：即 $${n / answer}$ 的倍数。`,
            ),
          ],
        ],
        t(
          `$${k} \\cdot ${n / answer} = ${k * (n / answer)} = ${(k * (n / answer)) / n} \\cdot ${n}$, so $${n / answer}$ solves it, and so do its $${answer}$ multiples below $${n}$.`,
          `$${k} \\cdot ${n / answer} = ${k * (n / answer)} = ${(k * (n / answer)) / n} \\cdot ${n}$，所以 $${n / answer}$ 是解，它在 $${n}$ 以下的 $${answer}$ 个倍数也都是解。`,
        ),
      ),
    });
  },
};

const subgroupOfGivenOrder: KnowledgePointDef = {
  id: "the-smallest-element-of-the-subgroup-of-a-given-order",
  title: t("The smallest element of the subgroup of a given order", "给定阶子群的最小元素"),
  explanation: t(
    "For each divisor $d$ of $n$, the group $\\mathbb{Z}_n$ has exactly one subgroup of order $d$. It consists of the multiples of $\\frac{n}{d}$, since those are the elements that $d$ annihilates. So its smallest positive element, which also generates it, is $\\frac{n}{d}$. Confusing the order with the generator gives the wrong subgroup.\n\nIn $\\mathbb{Z}_{20}$, the subgroup of order $4$ consists of the multiples of $\\frac{20}{4} = 5$: $\\{0, 5, 10, 15\\}$, with smallest positive element $5$.\n\nCheck: the list has $4$ elements, and $4 \\cdot 5 = 20 \\equiv 0$, so $5$ has order $4$.\n\n> **Watch out.** The subgroup of order $d$ is not generated by $d$: in $\\mathbb{Z}_{20}$, $\\langle 4 \\rangle$ has order $5$, not $4$.",
    "对 $n$ 的每个因子 $d$，群 $\\mathbb{Z}_n$ 恰有一个 $d$ 阶子群。它由 $\\frac{n}{d}$ 的倍数组成，因为这些元素正是乘以 $d$ 后为零的元素。所以它的最小正元素，也是它的生成元，是 $\\frac{n}{d}$。把阶和生成元混淆，就会得到错误的子群。\n\n在 $\\mathbb{Z}_{20}$ 中，$4$ 阶子群由 $\\frac{20}{4} = 5$ 的倍数组成：$\\{0, 5, 10, 15\\}$，最小正元素为 $5$。\n\n检验：这个列表有 $4$ 个元素，且 $4 \\cdot 5 = 20 \\equiv 0$，所以 $5$ 的阶为 $4$。\n\n> **注意。** $d$ 阶子群不是由 $d$ 生成的：在 $\\mathbb{Z}_{20}$ 中，$\\langle 4 \\rangle$ 的阶是 $5$，不是 $4$。",
  ),
  generate(rng) {
    const n = rng.pick(compositeList(12, 120));
    const d = rng.pick(divisors(n).filter((v) => v > 1 && v < n));
    const answer = n / d;
    return numberProblem({
      prompt: t(
        `Find the smallest positive element of the subgroup of order ${d} in ${"$"}${Zn(n)}$.`,
        `求 ${"$"}${Zn(n)}$ 中 ${d} 阶子群的最小正元素。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          d,
          `$${d}$ is the order of the subgroup; the element $${d}$ generates the subgroup of order $\\frac{${n}}{${d}}$ instead.`,
          `$${d}$ 是子群的阶；元素 $${d}$ 生成的是 $\\frac{${n}}{${d}}$ 阶子群。`,
        ),
        why(
          n - d,
          `This is the inverse of $${d}$, which generates the same wrong subgroup as $${d}$.`,
          `这是 $${d}$ 的逆元，它与 $${d}$ 生成同一个错误的子群。`,
        ),
        why(
          2 * answer,
          `$${2 * answer}$ lies in the subgroup, but $${answer}$ is smaller.`,
          `$${2 * answer}$ 在该子群中，但 $${answer}$ 更小。`,
        ),
        why(
          n - answer,
          `$${n - answer}$ is the largest element of the subgroup, not the smallest.`,
          `$${n - answer}$ 是该子群中最大的元素，而不是最小的。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the generator", "找生成元"],
            t(
              `The subgroup of order $${d}$ consists of the multiples of $\\frac{${n}}{${d}} = ${answer}$.`,
              `$${d}$ 阶子群由 $\\frac{${n}}{${d}} = ${answer}$ 的倍数组成。`,
            ),
          ],
          [["Take the smallest", "取最小的"], t(`Its smallest positive element is $${answer}$.`, `它的最小正元素是 $${answer}$。`)],
        ],
        t(
          `$${d} \\cdot ${answer} = ${n} \\equiv 0$, and no smaller positive multiple of $${answer}$ is $0$, so $${answer}$ has order $${d}$.`,
          `$${d} \\cdot ${answer} = ${n} \\equiv 0$，而 $${answer}$ 更小的正倍数都不为 $0$，所以 $${answer}$ 的阶为 $${d}$。`,
        ),
      ),
    });
  },
};

const sumOfGenerators: KnowledgePointDef = {
  id: "the-sum-of-the-generators-of-zn",
  title: t("The sum of the generators of $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 生成元之和"),
  explanation: t(
    "The generators of $\\mathbb{Z}_n$ are the residues coprime to $n$. If $k$ is one, so is $n - k$, since the two share their common divisors with $n$. For $n > 2$ these pair up, with $k \\ne n - k$, and each pair adds to $n$. There are $\\frac{\\varphi(n)}{2}$ pairs, so the total of the representatives is $\\frac{n\\varphi(n)}{2}$.\n\nFor $\\mathbb{Z}_{12}$: the generators $1, 5, 7, 11$ pair as $1 + 11$ and $5 + 7$, each adding to $12$, so the total is $\\frac{12 \\cdot 4}{2} = 24$.\n\nCheck: $1 + 5 + 7 + 11 = 24$ added directly.\n\n> **Watch out.** Add only the generators, not all residues: $1 + 2 + \\dots + 11 = 66$ is the sum of every nonzero element.",
    "$\\mathbb{Z}_n$ 的生成元是与 $n$ 互素的剩余。如果 $k$ 是生成元，$n - k$ 也是，因为它们与 $n$ 有相同的公因子。当 $n > 2$ 时，它们两两配对，$k \\ne n - k$，每对之和是 $n$。一共有 $\\frac{\\varphi(n)}{2}$ 对，所以代表元的总和是 $\\frac{n\\varphi(n)}{2}$。\n\n对 $\\mathbb{Z}_{12}$：生成元 $1, 5, 7, 11$ 配成 $1 + 11$ 与 $5 + 7$，每对之和为 $12$，所以总和为 $\\frac{12 \\cdot 4}{2} = 24$。\n\n检验：直接相加 $1 + 5 + 7 + 11 = 24$。\n\n> **注意。** 只加生成元，不加所有剩余：$1 + 2 + \\dots + 11 = 66$ 是所有非零元素之和。",
  ),
  generate(rng) {
    const n = rng.int(3, 60);
    const phi = totient(n);
    const answer = (n * phi) / 2;
    const gens = range(1, n - 1).filter((k) => gcd(n, k) === 1);
    return numberProblem({
      prompt: t(
        `Add the integers from 1 to $${n - 1}$ that generate ${"$"}${Zn(n)}$. What is the total?`,
        `把 1 到 $${n - 1}$ 中能生成 ${"$"}${Zn(n)}$ 的整数相加。总和是多少？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(phi, "This counts the generators instead of adding them.", "这是数生成元的个数，而不是把它们相加。"),
        why(
          n * phi,
          `Each pair adds to $${n}$, but there are only $\\frac{${phi}}{2}$ pairs, not $${phi}$.`,
          `每对之和为 $${n}$，但只有 $\\frac{${phi}}{2}$ 对，而不是 $${phi}$ 对。`,
        ),
        why(
          (n * (n - 1)) / 2,
          `This adds every integer from $1$ to $${n - 1}$, not only the generators.`,
          `这把 $1$ 到 $${n - 1}$ 的所有整数都加了，而不只是生成元。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["List the generators", "列出生成元"],
            t(
              `The integers coprime to $${n}$ are $${gens.join(", ")}$: $\\varphi(${n}) = ${phi}$ of them.`,
              `与 $${n}$ 互素的整数为 $${gens.join(", ")}$：共 $\\varphi(${n}) = ${phi}$ 个。`,
            ),
          ],
          [
            ["Pair them", "配对"],
            t(
              `They pair up as $k$ and $${n} - k$, each pair adding to $${n}$, so the total is $\\frac{${n} \\cdot ${phi}}{2} = ${answer}$.`,
              `它们按 $k$ 与 $${n} - k$ 配对，每对之和为 $${n}$，所以总和为 $\\frac{${n} \\cdot ${phi}}{2} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The total divided by the count, $${answer} \\div ${phi}$, is $\\frac{${n}}{2}$, the middle of $1$ and $${n - 1}$, as the pairing predicts.`,
          `总和除以个数 $${answer} \\div ${phi}$ 等于 $\\frac{${n}}{2}$，即 $1$ 与 $${n - 1}$ 的中点，正如配对所预测的。`,
        ),
      ),
    });
  },
};

const surjectionsFromFree: KnowledgePointDef = {
  id: "counting-surjections-from-a-free-group",
  title: t("Counting surjections from a free group", "计算自由群的满同态"),
  explanation: t(
    "The universal property says a homomorphism from a free group is a free choice of an image for each generator. Mapping to a group of prime order, the image is either trivial or the whole group, by Lagrange's theorem. So a homomorphism fails to be onto only if every generator goes to 0. That excludes exactly one of the choices.\n\nFrom the free group on $2$ generators to $\\mathbb{Z}_3$: there are $3^2 = 9$ homomorphisms, and only the one sending both generators to $0$ is not onto, so $8$ are surjective.\n\nCheck: a homomorphism sending $a$ to $1$ and $b$ to $0$ has image containing $1$, which generates $\\mathbb{Z}_3$, so it is onto.\n\n> **Watch out.** One generator with a nonzero image is enough for a surjection onto $\\mathbb{Z}_p$: do not require every generator to have a nonzero image.",
    "泛性质说，自由群的同态就是为每个生成元自由选择一个像。映到素数阶群时，由拉格朗日定理，像要么是平凡群，要么是整个群。所以同态不是满射，只有在每个生成元都映到 0 时才发生。这恰好排除了其中一种选择。\n\n从 $2$ 个生成元的自由群到 $\\mathbb{Z}_3$：共有 $3^2 = 9$ 个同态，只有把两个生成元都映到 $0$ 的那个不是满射，所以有 $8$ 个满同态。\n\n检验：把 $a$ 映到 $1$、$b$ 映到 $0$ 的同态，其像含 $1$，而 $1$ 生成 $\\mathbb{Z}_3$，所以它是满射。\n\n> **注意。** 映到 $\\mathbb{Z}_p$ 时，只要有一个生成元的像非零就是满射：不必要求每个生成元的像都非零。",
  ),
  generate(rng) {
    const p = rng.pick(primeList(23));
    const r = rng.int(2, 5);
    const answer = p ** r - 1;
    return numberProblem({
      prompt: t(
        `How many surjective homomorphisms are there from the free group on ${r} generators to ${"$"}${Zn(p)}$?`,
        `从 ${r} 个生成元的自由群到 ${"$"}${Zn(p)}$ 的满同态有多少个？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(p ** r, "This counts every homomorphism, including the zero map, which is not onto.", "这数了所有同态，包括不是满射的零映射。"),
        why(
          (p - 1) ** r,
          "This requires every generator to have a nonzero image; one nonzero image already makes the map onto.",
          "这要求每个生成元的像都非零；其实一个非零的像就足以使映射成为满射。",
        ),
        why(
          r * (p - 1),
          "Images are chosen for all generators at once, so the choices multiply rather than add.",
          "所有生成元的像是同时选的，所以选择数相乘，而不是相加。",
        ),
        why(
          p ** r - p,
          `Only the zero map fails to be onto; the other $${p - 1}$ maps excluded here are onto.`,
          `只有零映射不是满射；这里多排除的 $${p - 1}$ 个映射都是满射。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Count the homomorphisms", "数同态"],
            t(
              `Each of the $${r}$ generators can go to any of $${p}$ elements: $${p}^{${r}} = ${p ** r}$ homomorphisms.`,
              `$${r}$ 个生成元中的每一个都可以映到 $${p}$ 个元素中的任何一个：共 $${p}^{${r}} = ${p ** r}$ 个同态。`,
            ),
          ],
          [
            ["Remove the ones not onto", "去掉非满射"],
            t(
              `Since $${p}$ is prime, only the zero map is not onto, leaving $${p ** r} - 1 = ${answer}$.`,
              `由于 $${p}$ 是素数，只有零映射不是满射，剩下 $${p ** r} - 1 = ${answer}$ 个。`,
            ),
          ],
        ],
        t(
          `The image of a homomorphism is a subgroup of ${"$"}${Zn(p)}$, whose only subgroups are $\\{0\\}$ and ${"$"}${Zn(p)}$ itself, so every nonzero map is onto.`,
          `同态的像是 ${"$"}${Zn(p)}$ 的子群，而它只有 $\\{0\\}$ 与 ${"$"}${Zn(p)}$ 本身两个子群，所以每个非零映射都是满射。`,
        ),
      ),
    });
  },
};

const twoRelationsOnOneGenerator: KnowledgePointDef = {
  id: "two-relations-on-one-generator",
  title: t("Two relations on one generator", "一个生成元上的两个关系"),
  explanation: t(
    "A presentation with one generator describes a cyclic group, and the relations decide its size. The relations $a^m = e$ and $a^n = e$ together imply $a^{\\gcd(m, n)} = e$, because the greatest common divisor is an integer combination of $m$ and $n$. Nothing further is forced, so the group is cyclic of order $\\gcd(m, n)$.\n\nFor $\\langle a \\mid a^{12} = a^{18} = e \\rangle$: $6 = 18 - 12$, so $a^6 = a^{18}(a^{12})^{-1} = e$, and the group is cyclic of order $\\gcd(12, 18) = 6$.\n\nCheck: $\\mathbb{Z}_6$ with $a = 1$ satisfies both relations, since $6$ divides $12$ and $18$, so the group really has $6$ elements.\n\n> **Watch out.** Two relations make the group smaller, not larger: the order is the gcd, not the lcm.",
    "只有一个生成元的表现描述一个循环群，关系决定它的大小。关系 $a^m = e$ 和 $a^n = e$ 合起来推出 $a^{\\gcd(m, n)} = e$，因为最大公约数是 $m$ 和 $n$ 的整数线性组合。没有更多的限制，所以这个群是 $\\gcd(m, n)$ 阶循环群。\n\n对 $\\langle a \\mid a^{12} = a^{18} = e \\rangle$：$6 = 18 - 12$，所以 $a^6 = a^{18}(a^{12})^{-1} = e$，该群是 $\\gcd(12, 18) = 6$ 阶循环群。\n\n检验：$\\mathbb{Z}_6$ 取 $a = 1$ 满足两个关系，因为 $6$ 整除 $12$ 与 $18$，所以该群确实有 $6$ 个元素。\n\n> **注意。** 两个关系使群变小，而不是变大：阶是最大公约数，而不是最小公倍数。",
  ),
  generate(rng) {
    // Mostly a common factor above one, so that the answer is rarely the trivial group.
    const common = rng.int(1, 12);
    const [p, q] = rng.shuffle(
      rng.pick([
        [2, 3],
        [2, 5],
        [2, 7],
        [3, 4],
        [3, 5],
        [3, 7],
        [4, 5],
        [4, 7],
        [5, 6],
        [5, 7],
      ] as const),
    );
    const m = common * (p as number);
    const n = common * (q as number);
    const answer = gcd(m, n);
    return numberProblem({
      prompt: t(
        `Find the order of the group $\\langle a \\mid a^{${m}} = a^{${n}} = e \\rangle$.`,
        `求群 $\\langle a \\mid a^{${m}} = a^{${n}} = e \\rangle$ 的阶。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          lcm(m, n),
          "The lcm is a common multiple of the exponents, but the two relations together force the smaller gcd.",
          "最小公倍数是两个指数的公倍数；两个关系合起来迫使阶为更小的最大公约数。",
        ),
        why(
          m * n,
          "Two relations on one generator do not multiply the sizes; they cut the group down.",
          "一个生成元上的两个关系不会让大小相乘，只会让群变小。",
        ),
        why(
          Math.min(m, n),
          `$a^{${Math.min(m, n)}} = e$ is not all: combining it with $a^{${Math.max(m, n)}} = e$ forces a smaller power to be $e$.`,
          `$a^{${Math.min(m, n)}} = e$ 还不是全部：与 $a^{${Math.max(m, n)}} = e$ 结合，会迫使更小的幂等于 $e$。`,
        ),
        why(
          Math.max(m, n) - Math.min(m, n),
          "The difference is one combination, but the gcd may be smaller still.",
          "差只是一种组合，最大公约数可能还更小。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Combine the relations", "结合关系"],
            t(
              `$\\gcd(${m}, ${n}) = ${answer}$ is an integer combination of $${m}$ and $${n}$, so $${answer === 1 ? "a" : `a^{${answer}}`} = e$.`,
              `$\\gcd(${m}, ${n}) = ${answer}$ 是 $${m}$ 与 $${n}$ 的整数组合，所以 $${answer === 1 ? "a" : `a^{${answer}}`} = e$。`,
            ),
          ],
          [
            ["Read off the order", "读出阶"],
            t(`Nothing more is forced, so the group is cyclic of order $${answer}$.`, `没有更多限制，所以该群是 $${answer}$ 阶循环群。`),
          ],
        ],
        t(
          `${"$"}${Zn(answer)}$ with $a = 1$ satisfies both relations, since $${answer}$ divides $${m}$ and $${n}$.`,
          `${"$"}${Zn(answer)}$ 取 $a = 1$ 满足两个关系，因为 $${answer}$ 整除 $${m}$ 与 $${n}$。`,
        ),
      ),
    });
  },
};

const generatorsOfProduct: KnowledgePointDef = {
  id: "counting-generators-of-a-cyclic-direct-product",
  title: t("Counting generators of a cyclic direct product", "循环直积的生成元个数"),
  explanation: t(
    "When $\\gcd(m, n) = 1$, the group $\\mathbb{Z}_m \\times \\mathbb{Z}_n$ is cyclic of order $mn$. An element $(a, b)$ has order $mn$ exactly when $a$ generates the first factor and $b$ generates the second, because its order is the least common multiple of the orders of its coordinates. So the choices multiply, and the count is $\\varphi(m)\\varphi(n)$.\n\nFor $\\mathbb{Z}_{25} \\times \\mathbb{Z}_{36}$, $\\gcd(25, 36) = 1$, so there are $\\varphi(25)\\varphi(36) = 20 \\cdot 12 = 240$ generators.\n\nCheck: the group is $\\mathbb{Z}_{900}$, and $\\varphi(900) = 900 \\cdot \\frac{1}{2} \\cdot \\frac{2}{3} \\cdot \\frac{4}{5} = 240$.\n\n> **Watch out.** Both coordinates must be generators: taking every $(a, b)$ with $a \\ne 0$ counts elements such as $(5, 0)$, whose order is only $5$.",
    "当 $\\gcd(m, n) = 1$ 时，群 $\\mathbb{Z}_m \\times \\mathbb{Z}_n$ 是 $mn$ 阶循环群。元素 $(a, b)$ 的阶为 $mn$，当且仅当 $a$ 生成第一个因子且 $b$ 生成第二个因子，因为它的阶是各坐标阶的最小公倍数。所以选择数相乘，个数是 $\\varphi(m)\\varphi(n)$。\n\n对 $\\mathbb{Z}_{25} \\times \\mathbb{Z}_{36}$，$\\gcd(25, 36) = 1$，所以生成元有 $\\varphi(25)\\varphi(36) = 20 \\cdot 12 = 240$ 个。\n\n检验：这个群就是 $\\mathbb{Z}_{900}$，而 $\\varphi(900) = 900 \\cdot \\frac{1}{2} \\cdot \\frac{2}{3} \\cdot \\frac{4}{5} = 240$。\n\n> **注意。** 两个坐标都必须是生成元：把所有 $a \\ne 0$ 的 $(a, b)$ 都算上，会算进像 $(5, 0)$ 这样阶只有 $5$ 的元素。",
  ),
  generate(rng) {
    const m = rng.int(2, 20);
    const n = rng.pick(range(2, 20).filter((v) => gcd(v, m) === 1));
    const answer = totient(m) * totient(n);
    const product = `\\varphi(${m})\\varphi(${n})`;
    return numberProblem({
      prompt: t(
        `How many elements generate the cyclic group $${Zn(m)} \\times ${Zn(n)}$?`,
        `有多少个元素能生成循环群 $${Zn(m)} \\times ${Zn(n)}$？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(m * n, "That counts every element; only those of order $mn$ generate.", "那是所有元素的个数；只有阶为 $mn$ 的元素才是生成元。"),
        why(totient(m) + totient(n), "The choices for the two coordinates multiply, not add.", "两个坐标的选择数应相乘，不是相加。"),
        why(
          (m - 1) * n,
          "That allows any nonzero first coordinate and any second one; both must be generators.",
          "那允许第一个坐标取任意非零值、第二个坐标任意取；两者都必须是生成元。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Count generators of each factor", "数每个因子的生成元"],
            t(
              `$\\varphi(${m}) = ${totient(m)}$ and $\\varphi(${n}) = ${totient(n)}$.`,
              `$\\varphi(${m}) = ${totient(m)}$，$\\varphi(${n}) = ${totient(n)}$。`,
            ),
          ],
          [
            ["Multiply", "相乘"],
            t(
              `Each coordinate must be a generator, so there are $${product} = ${answer}$ generators.`,
              `每个坐标都必须是生成元，所以生成元有 $${product} = ${answer}$ 个。`,
            ),
          ],
        ],
        t(
          `The group is $${Zn(m * n)}$, and $\\varphi(${m * n}) = ${totient(m * n)}$ as well.`,
          `这个群就是 $${Zn(m * n)}$，而 $\\varphi(${m * n}) = ${totient(m * n)}$，结果一致。`,
        ),
      ),
    });
  },
};

const torsionOrder: KnowledgePointDef = {
  id: "the-order-of-an-element-of-a-product-of-rationals-modulo-integers",
  title: t("Orders in a product of rationals modulo integers", "有理数模整数之积中的阶"),
  explanation: t(
    "Every element of $\\mathbb{Q}/\\mathbb{Z}$ has finite order, so the whole group is torsion even though $\\mathbb{Q}$ has no torsion at all. The order of $\\frac{a}{b} + \\mathbb{Z}$, in lowest terms, is $b$, because that is the first multiple to reach an integer. In a product, both coordinates must reach an integer together, so the denominators combine by their least common multiple.\n\nThe element $\\left(\\frac{5}{12} + \\mathbb{Z}, \\frac{7}{18} + \\mathbb{Z}\\right)$ has order $\\operatorname{lcm}(12, 18) = 36$.\n\nCheck: $36 \\cdot \\frac{5}{12} = 15$ and $36 \\cdot \\frac{7}{18} = 14$ are integers, while $18 \\cdot \\frac{5}{12} = 7.5$ is not.\n\n> **Watch out.** Write each fraction in lowest terms first: $\\frac{6}{8} + \\mathbb{Z}$ has order $4$, not $8$, because $\\frac{6}{8} = \\frac{3}{4}$.",
    "$\\mathbb{Q}/\\mathbb{Z}$ 的每个元素都有有限阶，所以整个群都是挠群，尽管 $\\mathbb{Q}$ 本身完全没有挠元。最简形式的 $\\frac{a}{b} + \\mathbb{Z}$ 的阶是 $b$，因为这是第一个达到整数的倍数。在乘积中，两个坐标必须同时达到整数，所以分母按最小公倍数合并。\n\n元素 $\\left(\\frac{5}{12} + \\mathbb{Z}, \\frac{7}{18} + \\mathbb{Z}\\right)$ 的阶是 $\\operatorname{lcm}(12, 18) = 36$。\n\n检验：$36 \\cdot \\frac{5}{12} = 15$ 与 $36 \\cdot \\frac{7}{18} = 14$ 都是整数，而 $18 \\cdot \\frac{5}{12} = 7.5$ 不是。\n\n> **注意。** 先把每个分数化成最简形式：$\\frac{6}{8} + \\mathbb{Z}$ 的阶是 $4$，不是 $8$，因为 $\\frac{6}{8} = \\frac{3}{4}$。",
  ),
  generate(rng) {
    const b = rng.int(2, 12);
    const a = rng.pick(range(1, b - 1).filter((v) => gcd(v, b) === 1));
    const d = rng.int(2, 12);
    const c = rng.pick(range(1, d - 1).filter((v) => gcd(v, d) === 1));
    const answer = lcm(b, d);
    return numberProblem({
      prompt: t(
        `Find the order of $\\left(\\frac{${a}}{${b}} + \\mathbb{Z}, \\frac{${c}}{${d}} + \\mathbb{Z}\\right)$ in $\\mathbb{Q}/\\mathbb{Z} \\times \\mathbb{Q}/\\mathbb{Z}$.`,
        `求 $\\left(\\frac{${a}}{${b}} + \\mathbb{Z}, \\frac{${c}}{${d}} + \\mathbb{Z}\\right)$ 在 $\\mathbb{Q}/\\mathbb{Z} \\times \\mathbb{Q}/\\mathbb{Z}$ 中的阶。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          b * d,
          "That multiplies the denominators; the orders combine by least common multiple.",
          "那是分母相乘；阶应按最小公倍数合成。",
        ),
        why(
          Math.max(b, d),
          "That is only the larger denominator; both coordinates must reach an integer together.",
          "那只是较大的分母；两个坐标必须同时成为整数。",
        ),
        why(b + d, "Orders combine by least common multiple, not by adding.", "阶按最小公倍数合成，不是相加。"),
      ]),
      solution: walked(
        [
          [
            ["Read off each order", "读出每个坐标的阶"],
            t(
              `Both fractions are in lowest terms, so the coordinates have orders $${b}$ and $${d}$.`,
              `两个分数都是最简形式，所以两个坐标的阶分别是 $${b}$ 和 $${d}$。`,
            ),
          ],
          [
            ["Take the lcm", "取最小公倍数"],
            t(
              `The element has order $\\operatorname{lcm}(${b}, ${d}) = ${answer}$.`,
              `这个元素的阶是 $\\operatorname{lcm}(${b}, ${d}) = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$${answer} \\cdot \\frac{${a}}{${b}} = ${(answer * a) / b}$ and $${answer} \\cdot \\frac{${c}}{${d}} = ${(answer * c) / d}$ are both integers.`,
          `$${answer} \\cdot \\frac{${a}}{${b}} = ${(answer * a) / b}$ 与 $${answer} \\cdot \\frac{${c}}{${d}} = ${(answer * c) / d}$ 都是整数。`,
        ),
      ),
    });
  },
};

const centerOfProduct: KnowledgePointDef = {
  id: "the-center-of-a-dihedral-group-times-a-cyclic-group",
  title: t("The center of a dihedral group times a cyclic group", "二面体群与循环群之积的中心"),
  explanation: t(
    "An element of a direct product is central exactly when each of its coordinates is central in its own factor, because products are computed coordinate by coordinate. So the center of a product is the product of the centers. A cyclic group is its own center, while the center of $D_n$, for $n \\ge 3$, has two elements if $n$ is even and one if $n$ is odd.\n\nThe center of $D_{30} \\times \\mathbb{Z}_{25}$ is $\\{e, r^{15}\\} \\times \\mathbb{Z}_{25}$, with $2 \\cdot 25 = 50$ elements. For $D_{31} \\times \\mathbb{Z}_{25}$ it is $\\{e\\} \\times \\mathbb{Z}_{25}$, with $25$.\n\nCheck: $r^{15}$ is the half turn of the $30$-gon, and $s r^{15} s = r^{-15} = r^{15}$, so it commutes with every reflection.\n\n> **Watch out.** Every element of the cyclic factor is central, so keep all $25$ of them; only the dihedral factor shrinks to its center.",
    "直积的元素在中心里，当且仅当它的每个坐标都在各自因子的中心里，因为乘积是逐坐标计算的。所以乘积的中心是中心的乘积。循环群的中心是它自身，而 $D_n$（$n \\ge 3$）的中心在 $n$ 为偶数时有两个元素，在 $n$ 为奇数时有一个元素。\n\n$D_{30} \\times \\mathbb{Z}_{25}$ 的中心是 $\\{e, r^{15}\\} \\times \\mathbb{Z}_{25}$，有 $2 \\cdot 25 = 50$ 个元素。$D_{31} \\times \\mathbb{Z}_{25}$ 的中心是 $\\{e\\} \\times \\mathbb{Z}_{25}$，有 $25$ 个。\n\n检验：$r^{15}$ 是正 $30$ 边形的半周旋转，且 $s r^{15} s = r^{-15} = r^{15}$，所以它与每个反射交换。\n\n> **注意。** 循环因子的每个元素都在中心里，所以 $25$ 个全都保留；只有二面体因子缩小为它的中心。",
  ),
  generate(rng) {
    const n = rng.int(3, 20);
    const m = rng.int(2, 20);
    const center = n % 2 === 0 ? 2 : 1;
    const answer = center * m;
    return numberProblem({
      prompt: t(
        `How many elements does the center of $D_{${n}} \\times ${Zn(m)}$ have, where $D_{${n}}$ has order ${2 * n}?`,
        `$D_{${n}} \\times ${Zn(m)}$ 的中心有多少个元素？其中 $D_{${n}}$ 的阶是 ${2 * n}。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          m,
          `That leaves out the half turn $r^{${n / 2}}$, which is central in $D_{${n}}$.`,
          `那漏掉了半周旋转 $r^{${n / 2}}$，它在 $D_{${n}}$ 的中心里。`,
        ),
        why(
          2 * m,
          `$${n}$ is odd, so $D_{${n}}$ has no half turn and its center is trivial.`,
          `$${n}$ 是奇数，$D_{${n}}$ 没有半周旋转，中心是平凡的。`,
        ),
        why(2 * n * m, "That is the size of the whole group; the group is not abelian.", "那是整个群的大小；这个群不是交换群。"),
        why(
          center,
          "That is the center of the dihedral factor alone; the cyclic factor is entirely central.",
          "那只是二面体因子的中心；循环因子整个都在中心里。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the dihedral center", "求二面体群的中心"],
            center === 1
              ? t(`$${n}$ is odd, so the center of $D_{${n}}$ is $\\{e\\}$.`, `$${n}$ 是奇数，所以 $D_{${n}}$ 的中心是 $\\{e\\}$。`)
              : t(
                  `$${n}$ is even, so the center of $D_{${n}}$ is $\\{e, r^{${n / 2}}\\}$, with $2$ elements.`,
                  `$${n}$ 是偶数，所以 $D_{${n}}$ 的中心是 $\\{e, r^{${n / 2}}\\}$，有 $2$ 个元素。`,
                ),
          ],
          [
            ["Multiply by the cyclic factor", "乘以循环因子"],
            center === 1
              ? t(
                  `All $${m}$ elements of $${Zn(m)}$ are central, so the center has $${answer}$ elements.`,
                  `$${Zn(m)}$ 的 $${m}$ 个元素都在中心里，所以中心有 $${answer}$ 个元素。`,
                )
              : t(
                  `All $${m}$ elements of $${Zn(m)}$ are central, so the center has $2 \\cdot ${m} = ${answer}$ elements.`,
                  `$${Zn(m)}$ 的 $${m}$ 个元素都在中心里，所以中心有 $2 \\cdot ${m} = ${answer}$ 个元素。`,
                ),
          ],
        ],
        center === 1
          ? t(
              `A rotation $r^k$ with $0 < k < ${n}$ fails to commute with $s$, since $s r^k s = r^{-k}$ and $2k$ is not a multiple of $${n}$.`,
              `$0 < k < ${n}$ 的旋转 $r^k$ 与 $s$ 不交换，因为 $s r^k s = r^{-k}$，而 $2k$ 不是 $${n}$ 的倍数。`,
            )
          : t(
              `$s r^{${n / 2}} s = r^{-${n / 2}} = r^{${n / 2}}$, so the half turn commutes with every reflection.`,
              `$s r^{${n / 2}} s = r^{-${n / 2}} = r^{${n / 2}}$，所以半周旋转与每个反射交换。`,
            ),
      ),
    });
  },
};

const centralizerFromClass: KnowledgePointDef = {
  id: "a-centralizer-from-the-size-of-a-conjugacy-class",
  title: t("A centralizer from the size of a conjugacy class", "由共轭类大小求中心化子"),
  explanation: t(
    "A group acts on itself by conjugation. The orbit of $g$ is its conjugacy class, and the stabilizer of $g$ is its centralizer, so the orbit-stabilizer theorem gives $|\\text{cl}(g)| \\cdot |C(g)| = |G|$. A large class therefore means few elements commute with $g$. This also explains why the size of any conjugacy class divides the order of the group.",
    "群通过共轭作用于自身。$g$ 的轨道是它的共轭类，$g$ 的稳定子是它的中心化子，所以轨道-稳定子定理给出 $|\\text{cl}(g)| \\cdot |C(g)| = |G|$。因此，共轭类越大，与 $g$ 可交换的元素就越少。这也解释了为什么任何共轭类的大小都整除群的阶。",
  ),
  generate(rng) {
    const size = rng.int(2, 30);
    const answer = rng.int(2, 30);
    const order = size * answer;
    return numberProblem({
      prompt: t(
        `In a group of order ${order}, the conjugacy class of $g$ has ${size} elements. How many elements does the centralizer of $g$ have?`,
        `在一个 ${order} 阶群中，$g$ 的共轭类有 ${size} 个元素。$g$ 的中心化子有多少个元素？`,
      ),
      answer,
      form: "integer",
      wrong: [size, order - size, order - answer],
      solution: t(
        `The class size times the centralizer size is the group order, so the centralizer has $\\frac{${order}}{${size}} = ${answer}$ elements.`,
        `共轭类大小乘以中心化子大小等于群的阶，所以中心化子有 $\\frac{${order}}{${size}} = ${answer}$ 个元素。`,
      ),
    });
  },
};

const smallestKernel: KnowledgePointDef = {
  id: "the-smallest-possible-kernel-between-cyclic-groups",
  title: t("The smallest possible kernel between cyclic groups", "循环群之间最小可能的核"),
  explanation: t(
    "The size of the image of a homomorphism divides both the size of the source and the size of the target, so it is at most $\\gcd(m, n)$ for cyclic groups of orders $m$ and $n$. The kernel and image sizes multiply to $m$. So the kernel has at least $\\frac{m}{\\gcd(m, n)}$ elements, and the homomorphism is injective only when $m$ divides $n$. From $\\mathbb{Z}_{12}$ to $\\mathbb{Z}_{18}$ the image has at most $\\gcd(12, 18) = 6$ elements, so the kernel has at least $\\frac{12}{6} = 2$.\n\nCheck: $\\varphi(1) = 3$ is allowed, since $12 \\cdot 3 = 36 = 2 \\cdot 18$, and $3$ has order $6$ in $\\mathbb{Z}_{18}$, so this map has the kernel $\\{0, 6\\}$ of exactly $2$ elements.\n\n> **Watch out.** Divide $m$, the order of the source, by the gcd, not $n$: here $\\frac{18}{6} = 3$ is not even possible, since a kernel of $3$ elements would leave an image of $4$, and $4$ does not divide $18$.",
    "同态的像的大小同时整除源群和目标群的大小，所以对 $m$ 阶和 $n$ 阶循环群，它不超过 $\\gcd(m, n)$。核和像的大小之积是 $m$。所以核至少有 $\\frac{m}{\\gcd(m, n)}$ 个元素，只有当 $m$ 整除 $n$ 时，同态才可能是单射。从 $\\mathbb{Z}_{12}$ 到 $\\mathbb{Z}_{18}$，像至多有 $\\gcd(12, 18) = 6$ 个元素，所以核至少有 $\\frac{12}{6} = 2$ 个。\n\n检验：$\\varphi(1) = 3$ 是允许的，因为 $12 \\cdot 3 = 36 = 2 \\cdot 18$；而 $3$ 在 $\\mathbb{Z}_{18}$ 中的阶为 $6$，所以这个映射的核 $\\{0, 6\\}$ 恰有 $2$ 个元素。\n\n> **注意。** 要用源群的阶 $m$ 除以最大公因数，而不是 $n$：这里 $\\frac{18}{6} = 3$ 根本取不到，因为核有 $3$ 个元素时像有 $4$ 个，而 $4$ 不整除 $18$。",
  ),
  generate(rng) {
    for (;;) {
      const m = rng.int(4, 60);
      const n = rng.pick(range(4, 60).filter((v) => v !== m));
      const g = gcd(m, n);
      const answer = m / g;
      const mistakes = apart(answer, [
        why(
          g,
          `That is the largest possible size of the image; the kernel has $${m}$ divided by it.`,
          `那是像的最大可能大小；核的大小是 $${m}$ 除以它。`,
        ),
        why(m, `That is the kernel of the zero map, the largest kernel, not the smallest.`, "那是零映射的核，是最大的核，而不是最小的。"),
        why(
          n / g,
          `That divides $${n}$, the order of the target, by the gcd; the kernel lies in $${Zn(m)}$, so divide $${m}$.`,
          `那是用目标群的阶 $${n}$ 除以最大公因数；核在 $${Zn(m)}$ 中，所以要除 $${m}$。`,
        ),
        why(
          1,
          `A one-to-one map would need an image of $${m}$ elements, but $${m}$ does not divide $${n}$.`,
          `单射需要像有 $${m}$ 个元素，但 $${m}$ 不整除 $${n}$。`,
        ),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `What is the smallest possible size of the kernel of a homomorphism from $${Zn(m)}$ to $${Zn(n)}$?`,
          `从 $${Zn(m)}$ 到 $${Zn(n)}$ 的同态，核最小可能有多少个元素？`,
        ),
        answer,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [
              ["Bound the image", "估计像"],
              t(
                `The size of the image divides both $${m}$ and $${n}$, so it is at most $\\gcd(${m}, ${n}) = ${g}$.`,
                `像的大小同时整除 $${m}$ 和 $${n}$，所以至多为 $\\gcd(${m}, ${n}) = ${g}$。`,
              ),
            ],
            [
              ["Bound the kernel", "估计核"],
              t(
                `The kernel and image sizes multiply to $${m}$, so the kernel has at least $${g === 1 ? `${m}` : `\\frac{${m}}{${g}} = ${answer}`}$ elements.`,
                `核与像的大小之积为 $${m}$，所以核至少有 $${g === 1 ? `${m}` : `\\frac{${m}}{${g}} = ${answer}`}$ 个元素。`,
              ),
            ],
          ],
          g === 1
            ? t(
                `Since $\\gcd(${m}, ${n}) = 1$, only the zero map exists, and its kernel is all $${m}$ elements.`,
                `由于 $\\gcd(${m}, ${n}) = 1$，只有零映射，它的核是全部 $${m}$ 个元素。`,
              )
            : t(
                `$\\varphi(1) = ${n / g}$ is allowed, since $${m} \\cdot ${n / g} = ${(m * n) / g} = ${answer} \\cdot ${n}$, and $${n / g}$ has order $${g}$ in $${Zn(n)}$, so this map has a kernel of exactly $${answer}$ ${answer === 1 ? "element" : "elements"}.`,
                `$\\varphi(1) = ${n / g}$ 是允许的，因为 $${m} \\cdot ${n / g} = ${(m * n) / g} = ${answer} \\cdot ${n}$；而 $${n / g}$ 在 $${Zn(n)}$ 中的阶为 $${g}$，所以这个映射的核恰有 $${answer}$ 个元素。`,
              ),
        ),
      });
    }
  },
};

const orderPElements: KnowledgePointDef = {
  id: "elements-of-prime-order-in-a-nonabelian-group",
  title: t("Elements of prime order in a nonabelian group", "非阿贝尔群中素数阶的元素"),
  explanation: t(
    "A nonabelian group of order $pq$, with primes $p < q$, has a normal subgroup of order $q$. If its Sylow $p$-subgroups were also normal, the group would be their direct product, and so abelian. So there are $q$ Sylow $p$-subgroups, the only other value the third Sylow theorem allows. Any two meet trivially, and each contains $p - 1$ elements of order $p$.\n\nA nonabelian group of order $309 = 3 \\cdot 103$ has $103$ Sylow $3$-subgroups, since $103 \\equiv 1 \\pmod 3$. So it has $103 \\cdot 2 = 206$ elements of order $3$.\n\nCheck: with the $102$ elements of order $103$ and the identity, $206 + 102 + 1 = 309$ fills the group.\n\n> **Watch out.** Being nonabelian is what forces $q$ Sylow $p$-subgroups: the cyclic group of order $pq$ has only $p - 1$ elements of order $p$.",
    "素数 $p < q$ 时，$pq$ 阶非阿贝尔群有一个 $q$ 阶正规子群。如果它的西罗 $p$-子群也是正规的，这个群就是它们的直积，因而是阿贝尔群。所以有 $q$ 个西罗 $p$-子群，这是第三西罗定理允许的唯一另一个值。任意两个的交是平凡的，每个含有 $p - 1$ 个 $p$ 阶元素。\n\n$309 = 3 \\cdot 103$ 阶非阿贝尔群有 $103$ 个西罗 $3$-子群，因为 $103 \\equiv 1 \\pmod 3$。所以它有 $103 \\cdot 2 = 206$ 个 $3$ 阶元素。\n\n检验：加上 $102$ 个 $103$ 阶元素和单位元，$206 + 102 + 1 = 309$ 正好填满整个群。\n\n> **注意。** 正是非阿贝尔性迫使有 $q$ 个西罗 $p$-子群：$pq$ 阶循环群只有 $p - 1$ 个 $p$ 阶元素。",
  ),
  generate(rng) {
    const pairs = primeList(13).flatMap((p) =>
      primeList(97)
        .filter((q) => q > p && q % p === 1)
        .map((q) => [p, q] as [number, number]),
    );
    const [p, q] = rng.pick(pairs);
    const answer = q * (p - 1);
    return numberProblem({
      prompt: t(
        `A nonabelian group has order $${p * q} = ${p} \\cdot ${q}$. How many of its elements have order ${p}?`,
        `一个非阿贝尔群的阶是 $${p * q} = ${p} \\cdot ${q}$。它有多少个 ${p} 阶元素？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          p - 1,
          `That is the count for a single Sylow ${p}-subgroup; a nonabelian group has ${q} of them.`,
          `这是一个西罗 ${p}-子群的个数；非阿贝尔群有 ${q} 个这样的子群。`,
        ),
        why(q - 1, `That is the number of elements of order ${q}.`, `这是 ${q} 阶元素的个数。`),
        why(
          q * p - 1,
          `That counts every element except the identity, including those of order ${q}.`,
          `这数的是除单位元外的所有元素，包括 ${q} 阶元素。`,
        ),
        why(
          p * (q - 1),
          `That swaps the roles: there are ${q} subgroups of order ${p}, each with ${p - 1} elements of order ${p}.`,
          `这把角色弄反了：有 ${q} 个 ${p} 阶子群，每个含 ${p - 1} 个 ${p} 阶元素。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Count the Sylow subgroups", "数西罗子群"],
            t(
              `$n_{${p}}$ divides ${q} and is $\\equiv 1 \\pmod{${p}}$. If it were $1$, both Sylow subgroups would be normal and the group abelian, so $n_{${p}} = ${q}$.`,
              `$n_{${p}}$ 整除 ${q} 且 $\\equiv 1 \\pmod{${p}}$。若它为 $1$，两个西罗子群都正规，群就是阿贝尔群，所以 $n_{${p}} = ${q}$。`,
            ),
          ],
          [
            ["Count the elements", "数元素"],
            p === 2
              ? t(
                  `The subgroups meet only in the identity, and each has one element of order 2, which makes ${answer}.`,
                  `这些子群只交于单位元，每个有一个 2 阶元素，共 ${answer} 个。`,
                )
              : t(
                  `The subgroups meet only in the identity, and each has ${p - 1} elements of order ${p}, which makes $${q} \\cdot ${p - 1} = ${answer}$.`,
                  `这些子群只交于单位元，每个有 ${p - 1} 个 ${p} 阶元素，共 $${q} \\cdot ${p - 1} = ${answer}$ 个。`,
                ),
          ],
        ],
        t(
          `With the ${q - 1} elements of order ${q} and the identity, $${answer} + ${q - 1} + 1 = ${p * q}$ fills the group.`,
          `加上 ${q - 1} 个 ${q} 阶元素和单位元，$${answer} + ${q - 1} + 1 = ${p * q}$ 正好填满整个群。`,
        ),
      ),
    });
  },
};

const orderFromCycleType: KnowledgePointDef = {
  id: "the-order-of-a-permutation-from-its-cycle-type",
  title: t("The order of a permutation from its cycle type", "由循环类型求置换的阶"),
  explanation: t(
    "Disjoint cycles commute, so a power of a permutation is computed one cycle at a time. A power is the identity exactly when it is the identity on each cycle, which requires the exponent to be a multiple of each cycle length. So the order is the least common multiple of the lengths, and conjugate permutations have the same order.",
    "不相交的循环可交换，所以置换的幂可以逐个循环计算。一个幂是恒等置换，当且仅当它在每个循环上都是恒等的，这要求指数是每个循环长度的倍数。所以阶是各长度的最小公倍数，共轭的置换有相同的阶。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const c = rng.int(2, 9);
    const answer = lcm(lcm(a, b), c);
    return numberProblem({
      prompt: t(
        `A permutation is a product of three disjoint cycles of lengths ${a}, ${b} and ${c}, and fixes every other symbol. Find its order.`,
        `一个置换是长度为 ${a}、${b}、${c} 的三个不相交循环之积，并固定其他所有符号。求它的阶。`,
      ),
      answer,
      form: "integer",
      wrong: [a + b + c, a * b * c, Math.max(a, b, c)],
      solution: t(`The order is $\\text{lcm}(${a}, ${b}, ${c}) = ${answer}$.`, `阶是 $\\text{lcm}(${a}, ${b}, ${c}) = ${answer}$。`),
    });
  },
};

const polynomialQuotientSize: KnowledgePointDef = {
  id: "the-size-of-a-quotient-of-a-polynomial-ring",
  title: t("The size of a quotient of a polynomial ring", "多项式环商环的大小"),
  explanation: t(
    "Dividing by a monic polynomial of degree $d$ is always possible over $\\mathbb{Z}_n$, even if $n$ is not prime, because no leading coefficient has to be inverted. So each coset has exactly one representative of degree below $d$. Such a representative is a free choice of $d$ coefficients from $\\mathbb{Z}_n$, which gives $n^d$ elements in the quotient.\n\nIn $\\mathbb{Z}_{10}[x]/\\langle x^3 + 7 \\rangle$, every coset has one representative $a + bx + cx^2$ with $a, b, c$ in $\\mathbb{Z}_{10}$. So the quotient has $10^3 = 1000$ elements.\n\nCheck: $x^3 = (x^3 + 7) - 7$, so the class of $x^3$ is the class of $-7 = 3$, a representative of degree below $3$.\n\n> **Watch out.** A representative of degree below $d$ has $d$ coefficients, not $d + 1$: $\\mathbb{Z}_2[x]/\\langle x^2 + 1 \\rangle$ has the $2^2 = 4$ elements $0$, $1$, $x$ and $x + 1$.",
    "在 $\\mathbb{Z}_n$ 上，除以 $d$ 次首一多项式总是可行的，即使 $n$ 不是素数，因为不需要对首项系数求逆。所以每个陪集恰有一个次数低于 $d$ 的代表元。这样的代表元就是从 $\\mathbb{Z}_n$ 中自由选取 $d$ 个系数，因此商环有 $n^d$ 个元素。\n\n在 $\\mathbb{Z}_{10}[x]/\\langle x^3 + 7 \\rangle$ 中，每个陪集有一个代表元 $a + bx + cx^2$，其中 $a, b, c$ 属于 $\\mathbb{Z}_{10}$。所以商环有 $10^3 = 1000$ 个元素。\n\n检验：$x^3 = (x^3 + 7) - 7$，所以 $x^3$ 的类就是 $-7 = 3$ 的类，它是次数低于 $3$ 的代表元。\n\n> **注意。** 次数低于 $d$ 的代表元有 $d$ 个系数，而不是 $d + 1$ 个：$\\mathbb{Z}_2[x]/\\langle x^2 + 1 \\rangle$ 有 $0$、$1$、$x$、$x + 1$ 这 $2^2 = 4$ 个元素。",
  ),
  generate(rng) {
    const n = rng.int(2, 9);
    const d = rng.int(2, 5);
    const c = rng.int(1, n - 1);
    const answer = n ** d;
    return numberProblem({
      prompt: t(
        `How many elements does ${"$"}${Zn(n)}[x]/\\langle x^{${d}} + ${c} \\rangle$ have?`,
        `${"$"}${Zn(n)}[x]/\\langle x^{${d}} + ${c} \\rangle$ 有多少个元素？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          n * d,
          "The coefficients are chosen independently, so the numbers of choices multiply rather than add.",
          "各系数独立选取，所以选择数相乘，而不是相加。",
        ),
        why(
          n ** (d - 1),
          `That leaves out a coefficient: degrees $0$ to $${d - 1}$ give ${d} coefficients.`,
          `这漏掉了一个系数：次数 $0$ 到 $${d - 1}$ 共 ${d} 个系数。`,
        ),
        why(
          n ** (d + 1),
          `That counts the coefficient of $x^{${d}}$ too, but every representative has degree below ${d}.`,
          `这把 $x^{${d}}$ 的系数也算进去了，但每个代表元的次数都低于 ${d}。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Reduce to representatives", "化为代表元"],
            t(
              `The polynomial $x^{${d}} + ${c}$ is monic, so division by it works over ${"$"}${Zn(n)}$. Each coset has one representative of degree below ${d}.`,
              `多项式 $x^{${d}} + ${c}$ 是首一的，所以在 ${"$"}${Zn(n)}$ 上可以用它作除法。每个陪集有一个次数低于 ${d} 的代表元。`,
            ),
          ],
          [
            ["Count the coefficients", "数系数"],
            t(
              `A representative has ${d} free coefficients in ${"$"}${Zn(n)}$, which gives $${n}^{${d}} = ${answer}$.`,
              `代表元有 ${d} 个可在 ${"$"}${Zn(n)}$ 中自由选取的系数，于是得 $${n}^{${d}} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Multiplying ${d} choices of ${n} values each gives $${Array.from({ length: d }, () => n).join(" \\cdot ")} = ${answer}$.`,
          `把 ${d} 个各有 ${n} 种取值的选择相乘，得 $${Array.from({ length: d }, () => n).join(" \\cdot ")} = ${answer}$。`,
        ),
      ),
    });
  },
};

const solutionSpaceSize: KnowledgePointDef = {
  id: "the-size-of-a-solution-space-over-a-finite-field",
  title: t("The size of a solution space over a finite field", "有限域上解空间的大小"),
  explanation: t(
    "The rank-nullity theorem holds over any field. A homogeneous system in $n$ unknowns whose matrix has rank $r$ has a solution space of dimension $n - r$. Over $\\mathbb{Z}_p$, a space of dimension $k$ has exactly $p^k$ vectors, since each of $k$ coordinates is a free choice. So dimension counts become exact element counts.",
    "秩-零化度定理在任何域上都成立。$n$ 个未知数、矩阵秩为 $r$ 的齐次方程组，解空间的维数是 $n - r$。在 $\\mathbb{Z}_p$ 上，$k$ 维空间恰有 $p^k$ 个向量，因为 $k$ 个坐标都可以自由选择。所以维数的计算就成为元素个数的精确计算。",
  ),
  generate(rng) {
    const p = rng.pick(primeList(13));
    const n = rng.int(3, 6);
    const r = rng.int(1, n - 1);
    const m = r + rng.int(0, 2);
    const answer = p ** (n - r);
    const count = n - r === 1 ? `${answer}` : `${p}^{${n - r}} = ${answer}`;
    return numberProblem({
      prompt: t(
        `A homogeneous system of ${m} ${m === 1 ? "equation" : "equations"} in ${n} unknowns over ${"$"}${Zn(p)}$ has a coefficient matrix of rank ${r}. How many solutions does it have?`,
        `${"$"}${Zn(p)}$ 上有 ${n} 个未知数、${m} 个方程的齐次方程组，系数矩阵的秩是 ${r}。它有多少个解？`,
      ),
      answer,
      form: "integer",
      wrong: [p ** r, p ** n, (n - r) * p, p ** (n - r + 1)],
      solution: t(
        `The solution space has dimension $${n} - ${r} = ${n - r}$, so it has $${count}$ vectors.`,
        `解空间的维数是 $${n} - ${r} = ${n - r}$，所以它有 $${count}$ 个向量。`,
      ),
    });
  },
};

const productDimension: KnowledgePointDef = {
  id: "the-dimension-of-a-product-of-abstract-spaces",
  title: t("The dimension of a product of abstract spaces", "抽象空间之积的维数"),
  explanation: t(
    "Abstract vector spaces have dimensions that come from counting free coefficients. Polynomials of degree at most $a$ have $a + 1$ coefficients, because the constant term counts too, and $b \\times c$ matrices have $bc$ entries. A pair drawn from two spaces has all the coordinates of both, so the dimension of a product is the sum of the two dimensions. For example, $\\mathbb{P}_2 \\times M_{2 \\times 2}$ has dimension $3 + 4 = 7$: a pair is fixed by $3$ coefficients and $4$ entries.\n\n> **Watch out.** A product of spaces adds the dimensions; it does not multiply them.",
    "抽象向量空间的维数来自对自由系数的计数。次数不超过 $a$ 的多项式有 $a + 1$ 个系数，因为常数项也算在内，$b \\times c$ 矩阵有 $bc$ 个元素。从两个空间各取一个组成的对，含有两者的全部坐标，所以乘积的维数是两个维数之和。例如 $\\mathbb{P}_2 \\times M_{2 \\times 2}$ 的维数是 $3 + 4 = 7$：一个对由 $3$ 个系数和 $4$ 个元素确定。\n\n> **注意。** 空间之积的维数是维数相加，而不是相乘。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 6);
    const c = rng.int(2, 6);
    const answer = a + 1 + b * c;
    return numberProblem({
      prompt: t(
        `Find the dimension of $\\mathbb{P}_{${a}} \\times M_{${b} \\times ${c}}$, where $\\mathbb{P}_{${a}}$ is the space of polynomials of degree at most ${a}.`,
        `求 $\\mathbb{P}_{${a}} \\times M_{${b} \\times ${c}}$ 的维数，其中 $\\mathbb{P}_{${a}}$ 是次数不超过 ${a} 的多项式空间。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          a + b * c,
          `$\\mathbb{P}_{${a}}$ has $${a + 1}$ coefficients, counting the constant term, so its dimension is $${a + 1}$.`,
          `$\\mathbb{P}_{${a}}$ 算上常数项有 $${a + 1}$ 个系数，所以维数是 $${a + 1}$。`,
        ),
        why((a + 1) * b * c, "The dimensions of a product add; they do not multiply.", "乘积空间的维数相加，而不是相乘。"),
        why(
          a + 1 + b + c,
          `A $${b} \\times ${c}$ matrix has $${b} \\cdot ${c} = ${b * c}$ entries, not $${b} + ${c}$.`,
          `$${b} \\times ${c}$ 矩阵有 $${b} \\cdot ${c} = ${b * c}$ 个元素，而不是 $${b} + ${c}$ 个。`,
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Dimension of each factor", "各因子的维数"],
            t("", ""),
            [`\\dim \\mathbb{P}_{${a}} = ${a} + 1 = ${a + 1}`, `\\dim M_{${b} \\times ${c}} = ${b} \\cdot ${c} = ${b * c}`],
          ],
          [
            ["Add them", "相加"],
            t("A pair carries the coordinates of both parts:", "一个对含有两部分的全部坐标："),
            [`${a + 1} + ${b * c} = ${answer}`],
          ],
        ],
        t(
          `A basis is the $${a + 1}$ pairs $(t^i, O)$ together with the $${b * c}$ pairs $(0, E_{jk})$, $${answer}$ in all.`,
          `一组基由 $${a + 1}$ 个对 $(t^i, O)$ 与 $${b * c}$ 个对 $(0, E_{jk})$ 组成，共 $${answer}$ 个。`,
        ),
      ),
    });
  },
};

const shiftedBasisCoordinate: KnowledgePointDef = {
  id: "a-coordinate-in-a-shifted-polynomial-basis",
  title: t("A coordinate in a shifted polynomial basis", "平移多项式基下的坐标"),
  explanation: t(
    "The polynomials $1, t - c, (t - c)^2$ form a basis of $\\mathbb{P}_2$, and it is well suited to working near $t = c$. Differentiating an expansion $p(t) = x + y(t - c) + z(t - c)^2$ and setting $t = c$ removes every term except $y$. So the coordinate on $t - c$ is the derivative $p'(c)$, and no linear system has to be solved. For example, for $p(t) = t^2 + 3t$ and $c = 1$, $p'(t) = 2t + 3$, so the coordinate on $t - 1$ is $p'(1) = 5$; indeed $t^2 + 3t = 4 + 5(t - 1) + (t - 1)^2$.\n\n> **Watch out.** The coordinate on $t - c$ is not the ordinary coefficient of $t$: the $(t - c)^2$ term also contributes to $t$, which is why the derivative is evaluated at $c$.",
    "多项式 $1, t - c, (t - c)^2$ 构成 $\\mathbb{P}_2$ 的一组基，它很适合在 $t = c$ 附近使用。对展开式 $p(t) = x + y(t - c) + z(t - c)^2$ 求导并令 $t = c$，除了 $y$ 之外的项都消失了。所以 $t - c$ 上的坐标就是导数 $p'(c)$，不必解线性方程组。例如 $p(t) = t^2 + 3t$、$c = 1$ 时，$p'(t) = 2t + 3$，所以 $t - 1$ 上的坐标是 $p'(1) = 5$；确实 $t^2 + 3t = 4 + 5(t - 1) + (t - 1)^2$。\n\n> **注意。** $t - c$ 上的坐标不是 $t$ 的原系数：$(t - c)^2$ 项也贡献了 $t$ 项，所以要在 $c$ 处求导数的值。",
  ),
  generate(rng) {
    const a = pickNonzero(rng, 5);
    const b = pickNonzero(rng, 9);
    const g = pickNonzero(rng, 9);
    const c = pickNonzero(rng, 5);
    const answer = 2 * a * c + b;
    const polynomial = poly([a, "t^2"], [b, "t"], [g, ""]);
    const linear = `t ${signed(-c)}`;
    return numberProblem({
      prompt: t(
        `Write $p(t) = ${polynomial}$ in the basis $1, ${linear}, (${linear})^2$ of $\\mathbb{P}_2$. Find the coordinate on $${linear}$.`,
        `把 $p(t) = ${polynomial}$ 写成 $\\mathbb{P}_2$ 的基 $1, ${linear}, (${linear})^2$ 下的形式。求 $${linear}$ 上的坐标。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          b,
          `That is the ordinary coefficient of $t$; the $(${linear})^2$ term also contributes to $t$, so use $p'(${c})$.`,
          `这是 $t$ 的原系数；$(${linear})^2$ 项也贡献了 $t$ 项，所以要用 $p'(${c})$。`,
        ),
        why(
          2 * a * c,
          `That drops the constant $${b}$ of $p'(t)$, the derivative of $${poly([b, "t"])}$.`,
          `这漏掉了 $p'(t)$ 中的常数 $${b}$，即 $${poly([b, "t"])}$ 的导数。`,
        ),
        why(a * c + b, `The derivative of $${a}t^2$ is $${2 * a}t$, not $${a}t$.`, `$${a}t^2$ 的导数是 $${2 * a}t$，而不是 $${a}t$。`),
        why(
          a * c * c + b * c + g,
          `That is $p(${c})$, the coordinate on $1$; the coordinate on $${linear}$ is $p'(${c})$.`,
          `这是 $p(${c})$，即 $1$ 上的坐标；$${linear}$ 上的坐标是 $p'(${c})$。`,
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Differentiate", "求导"],
            t(
              `Differentiating $p(t) = x + y(${linear}) + z(${linear})^2$ gives $p'(t) = y + 2z(${linear})$, so $y = p'(${c})$. Here:`,
              `对 $p(t) = x + y(${linear}) + z(${linear})^2$ 求导得 $p'(t) = y + 2z(${linear})$，所以 $y = p'(${c})$。这里：`,
            ),
            [`p'(t) = ${poly([2 * a, "t"], [b, ""])}`],
          ],
          [
            [`Evaluate at $t = ${c}$`, `在 $t = ${c}$ 处求值`],
            t("", ""),
            [`y = p'(${c}) = ${2 * a} \\cdot ${c < 0 ? `(${c})` : c} + ${b < 0 ? `(${b})` : b} = ${answer}`],
          ],
        ],
        t(
          `The coordinate on $(${linear})^2$ is $${a}$, and $${a}(${linear})^2$ contributes $${-2 * a * c}t$; adding $${answer}t$ from $${answer}(${linear})$ gives $${b}t$, as in $p$.`,
          `$(${linear})^2$ 上的坐标是 $${a}$，$${a}(${linear})^2$ 贡献 $${-2 * a * c}t$；加上 $${answer}(${linear})$ 中的 $${answer}t$，得 $${b}t$，与 $p$ 一致。`,
        ),
      ),
    });
  },
};

const matrixSubspaceDimension: KnowledgePointDef = {
  id: "the-dimension-of-a-subspace-of-square-matrices",
  title: t("The dimension of a subspace of square matrices", "方阵子空间的维数"),
  explanation: t(
    "A symmetric matrix is decided by its entries on and above the diagonal, which number $\\frac{n(n + 1)}{2}$. A skew-symmetric matrix has a zero diagonal, because each diagonal entry equals its own negative, so it is decided by the $\\frac{n(n - 1)}{2}$ entries above it. The two dimensions add to $n^2$, since every square matrix splits uniquely into these two kinds. For example, in $M_{3 \\times 3}$ the symmetric matrices have dimension $6$ and the skew-symmetric ones $3$, and $6 + 3 = 9$.\n\n> **Watch out.** The diagonal is free for symmetric matrices but forced to zero for skew-symmetric ones, so the two counts differ by exactly $n$.",
    "对称矩阵由对角线及其上方的元素决定，共 $\\frac{n(n + 1)}{2}$ 个。反对称矩阵的对角线为零，因为每个对角元等于自身的相反数，所以它由对角线上方的 $\\frac{n(n - 1)}{2}$ 个元素决定。两个维数之和是 $n^2$，因为每个方阵都能唯一地分解成这两类之和。例如在 $M_{3 \\times 3}$ 中，对称矩阵的维数是 $6$，反对称矩阵的维数是 $3$，而 $6 + 3 = 9$。\n\n> **注意。** 对称矩阵的对角元是自由的，反对称矩阵的对角元则被迫为零，所以两个维数恰好相差 $n$。",
  ),
  generate(rng) {
    const n = rng.int(2, 25);
    const symmetric = rng.pick([true, false]);
    const answer = symmetric ? (n * (n + 1)) / 2 : (n * (n - 1)) / 2;
    const other = symmetric ? (n * (n - 1)) / 2 : (n * (n + 1)) / 2;
    return numberProblem({
      prompt: t(
        `Find the dimension of the subspace of ${symmetric ? "symmetric" : "skew-symmetric"} matrices in $M_{${n} \\times ${n}}$.`,
        `求 $M_{${n} \\times ${n}}$ 中${symmetric ? "对称" : "反对称"}矩阵子空间的维数。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        why(
          other,
          symmetric
            ? "That leaves out the diagonal, which is free for a symmetric matrix."
            : "That counts the diagonal, but each diagonal entry of a skew-symmetric matrix equals its own negative, so it is $0$.",
          symmetric
            ? "这漏掉了对角线，而对称矩阵的对角元是自由的。"
            : "这把对角线也算上了，但反对称矩阵的每个对角元等于自身的相反数，所以是 $0$。",
        ),
        why(
          n * n,
          "That is the dimension of all of $M_{n \\times n}$; the condition ties the entries below the diagonal to those above.",
          "这是整个 $M_{n \\times n}$ 的维数；条件使对角线下方的元素由上方确定。",
        ),
        why(n, "That counts only the diagonal; the entries above it are free too.", "这只数了对角线；对角线上方的元素也是自由的。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Find the free entries", "找出自由元素"],
            t(
              symmetric
                ? "$A^T = A$ makes each entry below the diagonal equal the one above it, so the free entries are those on and above the diagonal."
                : "$A^T = -A$ makes each entry below the diagonal the negative of the one above it, and gives $a_{ii} = -a_{ii}$, so the diagonal is $0$ and the free entries are those strictly above it.",
              symmetric
                ? "$A^T = A$ 使对角线下方的每个元素等于上方对应的元素，所以自由元素是对角线及其上方的元素。"
                : "$A^T = -A$ 使对角线下方的每个元素等于上方对应元素的相反数，并给出 $a_{ii} = -a_{ii}$，所以对角线为 $0$，自由元素是严格位于对角线上方的元素。",
            ),
          ],
          [["Count them", "数个数"], t("", ""), [`\\frac{${n} \\cdot ${symmetric ? n + 1 : n - 1}}{2} = ${answer}`]],
        ],
        t(
          `The symmetric and skew-symmetric counts add up: $${symmetric ? answer : other} + ${symmetric ? other : answer} = ${n * n} = ${n}^2$.`,
          `对称与反对称的个数相加：$${symmetric ? answer : other} + ${symmetric ? other : answer} = ${n * n} = ${n}^2$。`,
        ),
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Third pass
// ---------------------------------------------------------------------------

/** factorial computes n! for a small n. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
/** choose computes the binomial coefficient of n and k. */
const choose = (n: number, k: number) => factorial(n) / (factorial(k) * factorial(n - k));

const powerUnderShiftedSum: KnowledgePointDef = {
  id: "a-power-under-a-shifted-sum",
  title: t("A power under a shifted sum", "平移加法下的幂"),
  explanation: t(
    "The integers form a group under the operation $x \\ast y = x + y + k$, with identity $-k$. In a group, the $n$th power of an element means the element combined with itself $n$ times, whatever the operation is called. Here it is not a product in the usual sense. Each extra copy of $a$ adds both $a$ and $k$, so that the operation produces a simple linear pattern in $n$, and not a true power.\n\nUnder $x \\ast y = x + y + 2$, four copies of $3$ give $4 \\cdot 3 + 3 \\cdot 2 = 18$: the four copies contribute $12$, and the three operations between them add $2$ each.\n\nCheck: $3 \\ast 3 = 8$, then $8 \\ast 3 = 13$, then $13 \\ast 3 = 18$.\n\n> **Watch out.** $n$ copies are joined by only $n - 1$ operations, so $k$ is added $n - 1$ times, not $n$ times.",
    "整数在运算 $x \\ast y = x + y + k$ 下构成群，单位元是 $-k$。在群中，元素的 $n$ 次幂指这个元素与自身运算 $n$ 次，不管运算叫什么。这里它不是通常意义的乘积。每多一个 $a$，就多加 $a$ 和 $k$，所以运算给出关于 $n$ 的简单线性规律，而不是真正的乘方。\n\n在 $x \\ast y = x + y + 2$ 下，四个 $3$ 运算得 $4 \\cdot 3 + 3 \\cdot 2 = 18$：四个 $3$ 贡献 $12$，它们之间的三次运算各加 $2$。\n\n检验：$3 \\ast 3 = 8$，$8 \\ast 3 = 13$，$13 \\ast 3 = 18$。\n\n> **注意。** $n$ 个元素之间只有 $n - 1$ 次运算，所以 $k$ 加了 $n - 1$ 次，而不是 $n$ 次。",
  ),
  generate(rng) {
    const a = pickNonzero(rng, 9);
    const k = pickNonzero(rng, 9);
    const n = rng.int(3, 9);
    const answer = n * a + (n - 1) * k;
    const previous = (n - 1) * a + (n - 2) * k;
    return numberProblem({
      prompt: t(
        `The integers form a group under $x \\ast y = ${poly([1, "x"], [1, "y"], [k, ""])}$. Find $${a} \\ast ${a} \\ast \\cdots \\ast ${a}$, with ${n} copies of $${a}$.`,
        `整数在运算 $x \\ast y = ${poly([1, "x"], [1, "y"], [k, ""])}$ 下构成群。求 $${a} \\ast ${a} \\ast \\cdots \\ast ${a}$，其中有 ${n} 个 $${a}$。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          n * a,
          "This adds the copies but forgets the constant added by each operation.",
          "这把各个元素相加了，却忘了每次运算都要加上的常数。",
        ),
        why(
          n * a + n * k,
          `This adds the constant ${n} times; ${n} copies are joined by only ${n - 1} operations.`,
          `这把常数加了 ${n} 次；${n} 个元素之间只有 ${n - 1} 次运算。`,
        ),
        why(n * a + k, "This adds the constant only once, though every operation adds it.", "这只加了一次常数，但每次运算都要加它。"),
        why(a + (n - 1) * k, "This adds the constants but keeps only one copy of the element.", "这加上了各个常数，却只保留了一个元素。"),
      ]),
      solution: walked(
        [
          [
            ["Count the operations", "数运算次数"],
            t(
              `${n} copies of $${a}$ are joined by ${n - 1} operations, and each adds $${k}$.`,
              `${n} 个 $${a}$ 之间有 ${n - 1} 次运算，每次加上 $${k}$。`,
            ),
          ],
          [
            ["Add everything", "全部相加"],
            t(
              `$${n} \\cdot ${a < 0 ? `(${a})` : a} + ${n - 1} \\cdot ${k < 0 ? `(${k})` : k} = ${answer}$.`,
              `$${n} \\cdot ${a < 0 ? `(${a})` : a} + ${n - 1} \\cdot ${k < 0 ? `(${k})` : k} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `With one copy fewer the result is $${previous}$, and $${previous} \\ast ${a} = ${previous} ${signed(a)} ${signed(k)} = ${answer}$.`,
          `少一个时结果为 $${previous}$，而 $${previous} \\ast ${a} = ${previous} ${signed(a)} ${signed(k)} = ${answer}$。`,
        ),
      ),
    });
  },
};

const powerOfOnePlusI: KnowledgePointDef = {
  id: "a-power-of-one-plus-or-minus-i",
  title: t("A power of one plus or minus i", "1 加减 i 的幂"),
  explanation: t(
    "In the group of nonzero complex numbers under multiplication, powers of an element can often be found through a convenient small power. Here $(1 + i)^2 = 2i$ and $(1 - i)^2 = -2i$, which are much easier to raise to a power, since powers of $i$ run through a cycle of four. So write the exponent as a multiple of 2, plus a possible remainder of 1, rather than multiplying out each factor.\n\nFor $(1 + i)^5$: it equals $(2i)^2(1 + i) = -4(1 + i) = -4 - 4i$, so $x = -4$ and $y = -4$.\n\nCheck: the modulus of $1 + i$ is $\\sqrt{2}$, so $x^2 + y^2$ must be $2^5 = 32$, and indeed $16 + 16 = 32$.\n\n> **Watch out.** $(1 + i)^2$ is $2i$, not $2$: the cross term gives $2i$ and $i^2 = -1$ cancels the $1$.",
    "在非零复数的乘法群中，元素的幂常常可以借助一个方便的小次幂求出。这里 $(1 + i)^2 = 2i$，$(1 - i)^2 = -2i$，它们的幂要容易得多，因为 $i$ 的幂以四为周期循环。所以把指数写成 2 的倍数，可能再加余数 1，而不是逐个因子相乘。\n\n对 $(1 + i)^5$：它等于 $(2i)^2(1 + i) = -4(1 + i) = -4 - 4i$，所以 $x = -4$，$y = -4$。\n\n检验：$1 + i$ 的模为 $\\sqrt{2}$，所以 $x^2 + y^2$ 必须是 $2^5 = 32$，确实 $16 + 16 = 32$。\n\n> **注意。** $(1 + i)^2$ 是 $2i$，而不是 $2$：交叉项给出 $2i$，而 $i^2 = -1$ 抵消了 $1$。",
  ),
  generate(rng) {
    const s = rng.pick([1, -1]);
    const n = rng.int(4, 24);
    let re = 1;
    let im = 0;
    for (let i = 0; i < n; i += 1) {
      [re, im] = [re - s * im, im + s * re];
    }
    const half = Math.floor(n / 2);
    const asksReal = n % 2 === 1 ? rng.pick([true, false]) : im === 0;
    const answer = asksReal ? re : im;
    const base = s === 1 ? "1 + i" : "1 - i";
    const square = s === 1 ? "2i" : "-2i";
    const form = n % 2 === 1 ? `(${square})^{${half}}(${base})` : `(${square})^{${half}}`;
    return numberProblem({
      prompt: t(
        `In the group of nonzero complex numbers, $(${base})^{${n}} = x + yi$. Find ${asksReal ? "$x$" : "$y$"}.`,
        `在非零复数群中，$(${base})^{${n}} = x + yi$。求 ${asksReal ? "$x$" : "$y$"}。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          -answer,
          `This loses a sign in the powers of $i$, which cycle $i, -1, -i, 1$.`,
          `这在 $i$ 的幂中丢了一个符号；$i$ 的幂按 $i, -1, -i, 1$ 循环。`,
        ),
        why(2 * answer, "This takes one factor of 2 too many from the squares.", "这从平方中多取了一个因子 2。"),
        why(
          2 ** n,
          `This uses $(${base})^2 = 2$; the modulus of the power is only $\\sqrt{2}^{${n}}$.`,
          `这用了 $(${base})^2 = 2$；这个幂的模只有 $\\sqrt{2}^{${n}}$。`,
        ),
        why(n, "This multiplies the exponent instead of raising to the power.", "这把指数当成了乘数，而不是做乘方。"),
      ]),
      solution: walked(
        [
          [["Square the base", "把底数平方"], t(`$(${base})^2 = ${square}$.`, `$(${base})^2 = ${square}$。`)],
          [
            ["Split the exponent", "拆分指数"],
            t(
              `$(${base})^{${n}} = ${form} = ${poly([re, ""], [im, "i"])}$.`,
              `$(${base})^{${n}} = ${form} = ${poly([re, ""], [im, "i"])}$。`,
            ),
          ],
          [
            ["Read off the part", "读出所求部分"],
            t(`So ${asksReal ? "$x$" : "$y$"} is $${answer}$.`, `所以 ${asksReal ? "$x$" : "$y$"} 是 $${answer}$。`),
          ],
        ],
        t(
          `The modulus of $${base}$ is $\\sqrt{2}$, and $(${re})^2 + (${im})^2 = ${re * re + im * im} = 2^{${n}}$.`,
          `$${base}$ 的模为 $\\sqrt{2}$，而 $(${re})^2 + (${im})^2 = ${re * re + im * im} = 2^{${n}}$。`,
        ),
      ),
    });
  },
};

const triangularGroupSize: KnowledgePointDef = {
  id: "the-size-of-a-triangular-matrix-group-over-zp",
  title: t("The size of a triangular matrix group over Zp", "Zp 上三角矩阵群的大小"),
  explanation: t(
    "The upper triangular matrices with nonzero diagonal entries form a subgroup of the invertible matrices, because their determinant is the product of the diagonal. To count them over a finite field, choose each entry independently: a diagonal entry has $p - 1$ choices, and an entry above the diagonal has $p$. An $n \\times n$ matrix has $\\frac{n(n - 1)}{2}$ entries above the diagonal. If all the diagonal entries must equal 1, only those entries remain free.\n\nFor invertible upper triangular $2 \\times 2$ matrices over $\\mathbb{Z}_3$: the two diagonal entries have $2$ choices each and the one entry above has $3$, so there are $2 \\cdot 2 \\cdot 3 = 12$.\n\nCheck: with both diagonal entries equal to $1$ only the entry above is free, giving $3$ matrices, and $12 = 3 \\cdot 2^2$ accounts for the $2^2$ diagonals.\n\n> **Watch out.** A diagonal entry may not be $0$, since the determinant would vanish, so it has $p - 1$ choices, not $p$.",
    "对角元非零的上三角矩阵构成可逆矩阵的子群，因为它们的行列式是对角元之积。在有限域上计数时，每个元素独立选择：对角元有 $p - 1$ 种选择，对角线上方的元素有 $p$ 种。$n \\times n$ 矩阵在对角线上方有 $\\frac{n(n - 1)}{2}$ 个元素。如果所有对角元都必须是 1，就只有这些元素是自由的。\n\n对 $\\mathbb{Z}_3$ 上可逆的上三角 $2 \\times 2$ 矩阵：两个对角元各有 $2$ 种选择，对角线上方的一个元素有 $3$ 种，所以共 $2 \\cdot 2 \\cdot 3 = 12$ 个。\n\n检验：若两个对角元都等于 $1$，只有上方的元素是自由的，给出 $3$ 个矩阵；而 $12 = 3 \\cdot 2^2$ 正好计入了 $2^2$ 种对角线。\n\n> **注意。** 对角元不能为 $0$，否则行列式为零，所以它有 $p - 1$ 种选择，而不是 $p$ 种。",
  ),
  generate(rng) {
    const n = rng.int(2, 4);
    const p = rng.pick([2, 3, 5, 7, 11]);
    const unit = rng.pick([true, false]);
    const above = (n * (n - 1)) / 2;
    const free = p ** above;
    const answer = unit ? free : (p - 1) ** n * free;
    const kind = unit ? ["with every diagonal entry equal to 1", "对角元全为 1 的"] : ["that are invertible", "可逆的"];
    return numberProblem({
      prompt: t(
        `How many upper triangular $${n} \\times ${n}$ matrices over $${Zn(p)}$ are there ${kind[0]}?`,
        `$${Zn(p)}$ 上有多少个${kind[1]}上三角 $${n} \\times ${n}$ 矩阵？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(p ** (n * n), "This counts every matrix, not only the upper triangular ones.", "这数了所有矩阵，而不只是上三角矩阵。"),
        unit
          ? why(
              (p - 1) ** n * free,
              "The diagonal entries are all fixed at $1$, so they contribute no choices.",
              "对角元全都固定为 $1$，不提供任何选择。",
            )
          : why(
              free,
              "This fixes the diagonal at $1$; here each diagonal entry can be any nonzero value.",
              "这把对角线固定为 $1$；这里每个对角元可以是任何非零值。",
            ),
        why(
          p ** ((n * (n + 1)) / 2),
          "This lets the diagonal entries be $0$, which makes the matrix singular.",
          "这允许对角元为 $0$，会使矩阵不可逆。",
        ),
        why(
          p ** n,
          "This counts only one row's worth of entries; the entries above the diagonal number $\\frac{n(n - 1)}{2}$.",
          "这只数了一行的元素；对角线上方的元素有 $\\frac{n(n - 1)}{2}$ 个。",
        ),
        why((p - 1) ** n, "This counts only the diagonal and forgets the free entries above it.", "这只数了对角线，忘了上方的自由元素。"),
      ]),
      solution: walked(
        [
          [
            ["Entries above the diagonal", "对角线上方的元素"],
            t(
              `There ${above === 1 ? "is $1$ entry" : `are $${above}$ entries`} above the diagonal, each with $${p}$ choices: $${p}${above === 1 ? "" : `^{${above}}`} = ${free}$.`,
              `对角线上方有 $${above}$ 个元素，各有 $${p}$ 种选择：$${p}${above === 1 ? "" : `^{${above}}`} = ${free}$。`,
            ),
          ],
          [
            ["The diagonal", "对角线"],
            unit
              ? t(`The diagonal is fixed at $1$, so the count is $${answer}$.`, `对角线固定为 $1$，所以个数为 $${answer}$。`)
              : t(
                  `Each of the $${n}$ diagonal entries has $${p - 1}$ nonzero ${p === 2 ? "choice" : "choices"}, so the count is $${p === 2 ? "" : `${p - 1}^{${n}} \\cdot ${free} = `}${answer}$.`,
                  `$${n}$ 个对角元各有 $${p - 1}$ 种非零选择，所以个数为 $${p === 2 ? "" : `${p - 1}^{${n}} \\cdot ${free} = `}${answer}$。`,
                ),
          ],
        ],
        t(
          `The determinant of an upper triangular matrix is the product of its diagonal, which is nonzero modulo the prime $${p}$ exactly when every diagonal entry is.`,
          `上三角矩阵的行列式是对角元之积，它模素数 $${p}$ 非零当且仅当每个对角元都非零。`,
        ),
      ),
    });
  },
};

const affineGroupSize: KnowledgePointDef = {
  id: "the-size-of-the-affine-group-modulo-n",
  title: t("The size of the affine group modulo n", "模 n 仿射群的大小"),
  explanation: t(
    "A map $x \\mapsto ax + b$ on the residues modulo $n$ is a bijection exactly when $a$ is a unit, since $b$ only shifts the values. The invertible maps of this form are closed under composition and form a group. Its size comes from two independent choices: $a$ must be one of the $\\varphi(n)$ units, and $b$ can be any of the $n$ residues. The composition of two such maps is again one of them.\n\nModulo $6$: the units are $1$ and $5$, so $a$ has $\\varphi(6) = 2$ choices and $b$ has $6$, giving $2 \\cdot 6 = 12$ bijections.\n\nCheck: $x \\mapsto 2x$ sends both $0$ and $3$ to $0$, so a non-unit $a$ really does fail, and $x \\mapsto 5x + 1$ sends $0, 1, 2, 3, 4, 5$ to $1, 0, 5, 4, 3, 2$, all different.\n\n> **Watch out.** Over $\\mathbb{Z}_n$ with $n$ not prime, a nonzero $a$ is not enough: $a$ must be coprime to $n$.",
    "模 $n$ 剩余上的映射 $x \\mapsto ax + b$ 是双射，当且仅当 $a$ 是单位，因为 $b$ 只是平移取值。这种形式的可逆映射对复合封闭，构成一个群。它的大小来自两个独立的选择：$a$ 必须是 $\\varphi(n)$ 个单位之一，$b$ 可以是 $n$ 个剩余中的任何一个。两个这样的映射的复合仍是这样的映射。\n\n模 $6$：单位为 $1$ 与 $5$，所以 $a$ 有 $\\varphi(6) = 2$ 种选择，$b$ 有 $6$ 种，共 $2 \\cdot 6 = 12$ 个双射。\n\n检验：$x \\mapsto 2x$ 把 $0$ 与 $3$ 都映到 $0$，所以非单位的 $a$ 确实不行；而 $x \\mapsto 5x + 1$ 把 $0, 1, 2, 3, 4, 5$ 映到 $1, 0, 5, 4, 3, 2$，互不相同。\n\n> **注意。** 当 $n$ 不是素数时，$a$ 非零还不够：$a$ 必须与 $n$ 互素。",
  ),
  generate(rng) {
    const n = rng.int(3, 60);
    const units = totient(n);
    const answer = n * units;
    return numberProblem({
      prompt: t(
        `How many maps $x \\mapsto ax + b$ on $${Zn(n)}$ are bijections?`,
        `$${Zn(n)}$ 上有多少个映射 $x \\mapsto ax + b$ 是双射？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          n * n,
          "This counts every map; $a$ must be a unit for the map to be a bijection.",
          "这数了所有映射；$a$ 必须是单位，映射才是双射。",
        ),
        why(
          n * (n - 1),
          `This allows every nonzero $a$, but $a$ must be coprime to $${n}$.`,
          `这允许所有非零的 $a$，但 $a$ 必须与 $${n}$ 互素。`,
        ),
        why(units, "This counts the choices of $a$ only; $b$ can be any residue.", "这只数了 $a$ 的选择；$b$ 可以是任何剩余。"),
        why(
          n + units,
          "The choices of $a$ and $b$ are independent, so they multiply rather than add.",
          "$a$ 与 $b$ 的选择相互独立，所以相乘而不是相加。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Choose $a$", "选 $a$"],
            t(
              `The map is a bijection exactly when $a$ is a unit: $\\varphi(${n}) = ${units}$ choices.`,
              `映射是双射当且仅当 $a$ 是单位：共 $\\varphi(${n}) = ${units}$ 种选择。`,
            ),
          ],
          [
            ["Choose $b$", "选 $b$"],
            t(
              `$b$ is free: $${n}$ choices, so the total is $${units} \\cdot ${n} = ${answer}$.`,
              `$b$ 是自由的：$${n}$ 种选择，所以总数为 $${units} \\cdot ${n} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The inverse of $x \\mapsto ax + b$ is $x \\mapsto a^{-1}(x - b)$, which exists exactly when $a$ has an inverse modulo $${n}$.`,
          `$x \\mapsto ax + b$ 的逆为 $x \\mapsto a^{-1}(x - b)$，它存在当且仅当 $a$ 模 $${n}$ 有逆。`,
        ),
      ),
    });
  },
};

const smallestPrimitiveRoot: KnowledgePointDef = {
  id: "the-smallest-generator-of-the-units-modulo-a-prime",
  title: t("The smallest generator of the units modulo a prime", "模素数单位群的最小生成元"),
  explanation: t(
    "The group of units modulo a prime $p$ is cyclic of order $p - 1$, but no simple formula gives a generator. An element generates the group exactly when its order is $p - 1$, and the order must divide $p - 1$. So to test a candidate, it is enough to compute its powers until they reach 1. Trying $2, 3, 4, \\dots$ in turn finds the smallest generator, usually after only a few tries.\n\nModulo $11$: the powers of $2$ are $2, 4, 8, 5, 10, 9, 7, 3, 6, 1$, so $2$ has order $10 = 11 - 1$ and is the smallest generator.\n\nCheck: $2^5 = 32 = 2 \\cdot 11 + 10 \\equiv -1$, so neither $2^2$ nor $2^5$ is $1$, and the only divisors of $10$ below $10$ are $1, 2, 5$.\n\n> **Watch out.** A candidate with order a proper divisor of $p - 1$ is not a generator, however many distinct powers it has before repeating.",
    "模素数 $p$ 的单位群是 $p - 1$ 阶循环群，但没有简单公式给出生成元。一个元素生成这个群，当且仅当它的阶是 $p - 1$，而阶必须整除 $p - 1$。所以要检验一个候选，只需计算它的幂直到得到 1。依次试 $2, 3, 4, \\dots$ 就能找到最小的生成元，通常只需试几次。\n\n模 $11$：$2$ 的幂为 $2, 4, 8, 5, 10, 9, 7, 3, 6, 1$，所以 $2$ 的阶为 $10 = 11 - 1$，是最小生成元。\n\n检验：$2^5 = 32 = 2 \\cdot 11 + 10 \\equiv -1$，所以 $2^2$ 与 $2^5$ 都不是 $1$，而 $10$ 的小于 $10$ 的因数只有 $1, 2, 5$。\n\n> **注意。** 阶为 $p - 1$ 的真因数的候选不是生成元，不论它在重复之前有多少个不同的幂。",
  ),
  generate(rng) {
    const p = rng.pick(primeList(199).filter((q) => q > 2));
    const orderOf = (g: number) => {
      let value = g % p;
      let order = 1;
      while (value !== 1) {
        value = (value * g) % p;
        order += 1;
      }
      return order;
    };
    const answer = range(2, p - 1).find((g) => orderOf(g) === p - 1) ?? 2;
    const smaller = range(2, answer - 1).map((g) => [g, orderOf(g)]);
    const tests = primes(p - 1)
      .map((q) => (p - 1) / q)
      .map((e) => (e === 1 ? `${answer}` : `${answer}^{${e}}`))
      .join(", ");
    return numberProblem({
      prompt: t(`Find the smallest positive integer that generates the group of units modulo ${p}.`, `求生成模 ${p} 单位群的最小正整数。`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          p - 1,
          `$${p - 1} \\equiv -1$ has order $2$, so it generates only $\\{1, ${p - 1}\\}$.`,
          `$${p - 1} \\equiv -1$ 的阶为 $2$，只生成 $\\{1, ${p - 1}\\}$。`,
        ),
        why(
          totient(p - 1),
          `$\\varphi(${p - 1}) = ${totient(p - 1)}$ is the number of generators, not the smallest one.`,
          `$\\varphi(${p - 1}) = ${totient(p - 1)}$ 是生成元的个数，而不是最小的生成元。`,
        ),
        ...(answer > 2
          ? [
              why(
                2,
                `$2$ has order $${orderOf(2)}$, less than $${p - 1}$, so it is not a generator.`,
                `$2$ 的阶为 $${orderOf(2)}$，小于 $${p - 1}$，所以不是生成元。`,
              ),
            ]
          : []),
        ...(answer === 2
          ? [why(3, "$3$ may also be a generator, but $2$ is smaller and already works.", "$3$ 也许也是生成元，但 $2$ 更小且已经可行。")]
          : []),
        why(1, "$1$ has order $1$ and generates only itself.", "$1$ 的阶为 $1$，只生成它自己。"),
      ]),
      solution: walked(
        [
          [["The target order", "目标阶"], t(`A generator must have order $${p - 1}$.`, `生成元的阶必须是 $${p - 1}$。`)],
          [
            ["Test in turn", "依次检验"],
            smaller.length > 0
              ? t(
                  `The smaller candidates fall short: ${smaller.map(([g, order]) => `$${g}$ has order $${order}$`).join(", ")}.`,
                  `较小的候选都不满足：${smaller.map(([g, order]) => `$${g}$ 的阶为 $${order}$`).join("，")}。`,
                )
              : t("$2$ is the first candidate.", "$2$ 是第一个候选。"),
          ],
          [
            ["Find the generator", "找到生成元"],
            t(
              `The powers of $${answer}$ first reach $1$ at exponent $${p - 1}$, so it is the smallest.`,
              `$${answer}$ 的幂第一次等于 $1$ 是在指数 $${p - 1}$ 处，所以它最小。`,
            ),
          ],
        ],
        t(
          `$${answer}^{${p - 1}} \\equiv 1 \\pmod{${p}}$ by Fermat's little theorem, while $${tests}$ ${primes(p - 1).length === 1 ? "is not" : "are not"} $1$, which rules out every proper divisor of $${p - 1}$ as the order.`,
          `由费马小定理 $${answer}^{${p - 1}} \\equiv 1 \\pmod{${p}}$，而 $${tests}$ 都不等于 $1$，这排除了 $${p - 1}$ 的每个真因数作为阶的可能。`,
        ),
      ),
    });
  },
};

const sumOfOrders: KnowledgePointDef = {
  id: "the-sum-of-the-orders-of-the-elements-of-zn",
  title: t("The sum of the orders of the elements of Zn", "Zn 中元素的阶之和"),
  explanation: t(
    "In a cyclic group of order $n$, the order of every element divides $n$, and for each divisor $d$ there are exactly $\\varphi(d)$ elements of order $d$. So instead of finding the order of each element in turn, group the elements by their order. Each divisor $d$ contributes $d\\varphi(d)$ to the sum. This counting by classes is a common way of adding up something over all the elements of a group.\n\nFor $\\mathbb{Z}_6$: the divisors $1, 2, 3, 6$ give $1 \\cdot 1 + 2 \\cdot 1 + 3 \\cdot 2 + 6 \\cdot 2 = 21$.\n\nCheck: element by element, $0, 1, 2, 3, 4, 5$ have orders $1, 6, 3, 2, 3, 6$, and $1 + 6 + 3 + 2 + 3 + 6 = 21$.\n\n> **Watch out.** The identity has order $1$, not $0$, and the order of $k$ is $\\frac{n}{\\gcd(k, n)}$, not $k$.",
    "在 $n$ 阶循环群中，每个元素的阶都整除 $n$，对每个因数 $d$，恰好有 $\\varphi(d)$ 个 $d$ 阶元素。所以不必逐个求元素的阶，而是按阶把元素分组。每个因数 $d$ 对总和贡献 $d\\varphi(d)$。这种分类计数是对群的所有元素求和的常用方法。\n\n对 $\\mathbb{Z}_6$：因数 $1, 2, 3, 6$ 给出 $1 \\cdot 1 + 2 \\cdot 1 + 3 \\cdot 2 + 6 \\cdot 2 = 21$。\n\n检验：逐个元素看，$0, 1, 2, 3, 4, 5$ 的阶为 $1, 6, 3, 2, 3, 6$，而 $1 + 6 + 3 + 2 + 3 + 6 = 21$。\n\n> **注意。** 单位元的阶是 $1$，不是 $0$；$k$ 的阶是 $\\frac{n}{\\gcd(k, n)}$，而不是 $k$。",
  ),
  generate(rng) {
    const n = rng.int(4, 60);
    const parts = divisors(n);
    const answer = sum(parts.map((d) => d * totient(d)));
    const terms = parts.map((d) => `${d} \\cdot ${totient(d)}`).join(" + ");
    return numberProblem({
      prompt: t(`Add up the orders of all the elements of $${Zn(n)}$.`, `把 $${Zn(n)}$ 中所有元素的阶相加。`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          (n * (n + 1)) / 2,
          "This takes the order of $k$ to be $k$; the order of $k$ is $\\frac{n}{\\gcd(k, n)}$.",
          "这把 $k$ 的阶当成了 $k$；$k$ 的阶是 $\\frac{n}{\\gcd(k, n)}$。",
        ),
        why(
          sum(parts),
          "This adds each possible order once, but there are $\\varphi(d)$ elements of order $d$.",
          "这把每个可能的阶只加了一次，但 $d$ 阶元素有 $\\varphi(d)$ 个。",
        ),
        why(n * n, `Not every element has order $${n}$: only the generators do.`, `并不是每个元素的阶都是 $${n}$：只有生成元才是。`),
        why(answer - 1, "The identity has order $1$, not $0$.", "单位元的阶是 $1$，不是 $0$。"),
      ]),
      solution: walked(
        [
          [
            ["Group by order", "按阶分组"],
            t(
              `Each divisor $d$ of $${n}$ gives $\\varphi(d)$ elements of order $d$; the divisors are $${parts.join(", ")}$.`,
              `$${n}$ 的每个因数 $d$ 给出 $\\varphi(d)$ 个 $d$ 阶元素；因数为 $${parts.join(", ")}$。`,
            ),
          ],
          [["Add", "相加"], t(`The sum is $${terms} = ${answer}$.`, `和为 $${terms} = ${answer}$。`)],
        ],
        t(
          `The counts $${parts.map((d) => totient(d)).join(" + ")}$ add up to $${n}$, so every element is counted exactly once.`,
          `个数 $${parts.map((d) => totient(d)).join(" + ")}$ 加起来等于 $${n}$，所以每个元素恰好算了一次。`,
        ),
      ),
    });
  },
};

const cyclesInPower: KnowledgePointDef = {
  id: "the-number-of-cycles-in-a-power-of-a-cycle",
  title: t("The number of cycles in a power of a cycle", "循环的幂中循环的个数"),
  explanation: t(
    "A power of a cycle need not be a cycle. Moving $k$ steps at a time around a loop of $\\ell$ symbols returns to the start after $\\frac{\\ell}{\\gcd(\\ell, k)}$ moves, so that this is the length of each piece. All the pieces have equal length, and together they use all $\\ell$ symbols, which means that there are $\\gcd(\\ell, k)$ of them. In particular, the power is a single cycle exactly when $\\ell$ and $k$ are coprime.\n\nFor $c = (1\\;2\\;3\\;\\dots\\;12)$ and $c^8$: $\\gcd(12, 8) = 4$, so $c^8$ splits into $4$ cycles, each of length $\\frac{12}{4} = 3$. Following $1$ in steps of $8$ gives $1 \\to 9 \\to 5 \\to 1$, the cycle $(1\\;9\\;5)$.\n\nCheck: $4$ cycles of length $3$ use $4 \\cdot 3 = 12$ symbols, all of them.\n\n> **Watch out.** $\\gcd(\\ell, k)$ counts the cycles, while $\\frac{\\ell}{\\gcd(\\ell, k)}$ is the length of each one; do not swap them.",
    "循环的幂不一定是循环。沿着 $\\ell$ 个符号的环每次走 $k$ 步，走 $\\frac{\\ell}{\\gcd(\\ell, k)}$ 次回到起点，这就是每一段的长度。所有段长度相等，合起来用完全部 $\\ell$ 个符号，所以共有 $\\gcd(\\ell, k)$ 段。特别地，当且仅当 $\\ell$ 与 $k$ 互素时，这个幂是一个循环。\n\n对 $c = (1\\;2\\;3\\;\\dots\\;12)$ 与 $c^8$：$\\gcd(12, 8) = 4$，所以 $c^8$ 分解成 $4$ 个循环，每个长度为 $\\frac{12}{4} = 3$。从 $1$ 出发每次走 $8$ 步，得 $1 \\to 9 \\to 5 \\to 1$，即循环 $(1\\;9\\;5)$。\n\n检验：$4$ 个长度为 $3$ 的循环共用 $4 \\cdot 3 = 12$ 个符号，恰好是全部符号。\n\n> **注意。** $\\gcd(\\ell, k)$ 是循环的个数，$\\frac{\\ell}{\\gcd(\\ell, k)}$ 是每个循环的长度；不要弄反。",
  ),
  generate(rng) {
    for (;;) {
      const length = rng.int(6, 40);
      const k = rng.int(2, length - 1);
      const answer = gcd(length, k);
      const piece = length / answer;
      const mistakes = apart(answer, [
        why(piece, "That is the length of each cycle, not the number of cycles.", "那是每个循环的长度，不是循环的个数。"),
        why(
          k,
          `That is the size of each step; the number of cycles is $\\gcd(${length}, ${k})$.`,
          `那是每一步的步长；循环的个数是 $\\gcd(${length}, ${k})$。`,
        ),
        why(
          length,
          `That would make every symbol fixed, which happens only when ${length} divides the exponent.`,
          `那意味着每个符号都不动，这只在指数是 ${length} 的倍数时发生。`,
        ),
        why(
          1,
          `$${length}$ and $${k}$ are not coprime, so the power is not a single cycle.`,
          `$${length}$ 与 $${k}$ 不互素，所以这个幂不是一个循环。`,
        ),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `Let $c$ be a cycle of length ${length}. Into how many disjoint cycles does $c^{${k}}$ split?`,
          `设 $c$ 是长度为 ${length} 的循环。$c^{${k}}$ 分解成多少个不相交的循环？`,
        ),
        answer,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [["Take the gcd", "求最大公因数"], t(`$\\gcd(${length}, ${k}) = ${answer}$.`, `$\\gcd(${length}, ${k}) = ${answer}$。`)],
            [
              ["Find the length of each cycle", "求每个循环的长度"],
              t(
                `Moving ${k} steps at a time, each cycle closes after $\\frac{${length}}{\\gcd(${length}, ${k})} = ${piece}$ moves.`,
                `每次走 ${k} 步，每个循环走 $\\frac{${length}}{\\gcd(${length}, ${k})} = ${piece}$ 次后闭合。`,
              ),
            ],
            [
              ["Count the cycles", "数循环"],
              t(
                `The cycles share out all ${length} symbols equally, so their number is $\\frac{${length}}{${piece}} = ${answer}$.`,
                `这些循环平分全部 ${length} 个符号，所以个数是 $\\frac{${length}}{${piece}} = ${answer}$。`,
              ),
            ],
          ],
          answer === 1
            ? t(`One cycle of length $${piece}$ uses all ${length} symbols.`, `一个长度为 $${piece}$ 的循环用完全部 ${length} 个符号。`)
            : t(
                `$${answer}$ cycles of length $${piece}$ use $${answer} \\cdot ${piece} = ${length}$ symbols, all of them.`,
                `$${answer}$ 个长度为 $${piece}$ 的循环共用 $${answer} \\cdot ${piece} = ${length}$ 个符号，恰好是全部符号。`,
              ),
        ),
      });
    }
  },
};

const inversionsCount: KnowledgePointDef = {
  id: "counting-inversions-as-adjacent-transpositions",
  title: t("Counting inversions as adjacent transpositions", "用逆序数计算相邻对换"),
  explanation: t(
    "An adjacent transposition swaps two neighbouring entries in a row, and it changes the relative order of exactly one pair. So it changes the number of inversions, the pairs of entries that are out of order, by exactly 1. Sorting needs the inversions to reach zero, and each swap of a neighbouring out-of-order pair removes one. So the fewest swaps equals the number of inversions, and this is more than an arbitrary factorization into transpositions may need.\n\nFor the row $3, 2, 1$: the pairs out of order are $(3, 2)$, $(3, 1)$ and $(2, 1)$, so it takes $3$ swaps of neighbours: $3, 2, 1 \\to 2, 3, 1 \\to 2, 1, 3 \\to 1, 2, 3$.\n\nCheck: each of the three swaps put one out-of-order pair right, and the last row has none left.\n\n> **Watch out.** The single transposition $(1\\;3)$ also sorts $3, 2, 1$, but it swaps entries that are not neighbours. With only neighbouring swaps allowed, count inversions, not $n$ minus the number of cycles.",
    "相邻对换交换一行中相邻的两个元素，它恰好改变一对元素的相对顺序。所以它使逆序数（顺序颠倒的元素对的个数）恰好改变 1。排序需要逆序数变为零，而每次交换一对顺序颠倒的相邻元素就减少一个。所以最少交换次数等于逆序数，这比任意分解为对换可能需要的次数要多。\n\n对一行 $3, 2, 1$：顺序颠倒的对是 $(3, 2)$、$(3, 1)$ 与 $(2, 1)$，所以要交换 $3$ 次相邻元素：$3, 2, 1 \\to 2, 3, 1 \\to 2, 1, 3 \\to 1, 2, 3$。\n\n检验：三次交换各纠正了一对颠倒的元素，最后一行已没有颠倒的对。\n\n> **注意。** 一个对换 $(1\\;3)$ 也能把 $3, 2, 1$ 排好，但它交换的不是相邻元素。只允许相邻交换时，要数逆序数，而不是用 $n$ 减去循环个数。",
  ),
  generate(rng) {
    for (;;) {
      const n = rng.int(5, 8);
      const row = range(1, n);
      for (let i = n - 1; i > 0; i -= 1) {
        const j = rng.int(0, i);
        const held = row[i] ?? 0;
        row[i] = row[j] ?? 0;
        row[j] = held;
      }
      if (row.every((v, i) => v === i + 1)) {
        row.reverse();
      }
      const counts = row.map((v, i) => row.slice(i + 1).filter((w) => w < v).length);
      const answer = sum(counts);
      const seen = new Set<number>();
      let cycles = 0;
      for (const start of row) {
        if (!seen.has(start)) {
          cycles += 1;
          let at = start;
          while (!seen.has(at)) {
            seen.add(at);
            at = row[at - 1] ?? at;
          }
        }
      }
      const descents = row.filter((v, i) => i + 1 < n && v > (row[i + 1] ?? v)).length;
      const misplaced = row.filter((v, i) => v !== i + 1).length;
      const mistakes = apart(answer, [
        why(
          n - cycles,
          `That is the fewest transpositions of any kind, $${n} - ${cycles}$; swaps of neighbours cannot jump over entries, so they need one swap per inversion.`,
          `那是任意对换的最少个数 $${n} - ${cycles}$；相邻交换不能越过其他元素，所以每个逆序需要一次交换。`,
        ),
        why(
          descents,
          "That counts only neighbouring pairs out of order; pairs that are far apart in the row count too.",
          "那只数了相邻的颠倒对；在行中相隔较远的颠倒对也要算。",
        ),
        why(
          misplaced,
          "That counts the entries out of place, but one entry may need several swaps to reach its place.",
          "那数的是不在原位的元素，但一个元素可能要交换好几次才能到位。",
        ),
        why(
          (n * (n - 1)) / 2,
          `That counts every pair, $\\binom{${n}}{2}$; only the pairs out of order need a swap.`,
          `那数了所有的对 $\\binom{${n}}{2}$；只有顺序颠倒的对才需要交换。`,
        ),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `A permutation of $\\{1, \\dots, ${n}\\}$ is written in a row as ${row.join(", ")}. What is the fewest swaps of neighbouring entries that will sort the row into increasing order?`,
          `$\\{1, \\dots, ${n}\\}$ 的一个排列写成一行：${row.join("，")}。把这一行排成递增顺序，最少要交换多少次相邻元素？`,
        ),
        answer,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [
              ["Use inversions", "用逆序数"],
              t(
                "Each swap of neighbours changes the number of inversions by exactly 1, so the fewest swaps is the number of inversions.",
                "每次相邻交换使逆序数恰好改变 1，所以最少交换次数就是逆序数。",
              ),
            ],
            [
              ["Count per entry", "逐个计数"],
              t(
                `For each entry from the left, the number of smaller entries to its right is ${counts.join(", ")}.`,
                `从左到右，每个元素右边比它小的元素个数依次是 ${counts.join("、")}。`,
              ),
            ],
            [["Add", "相加"], t(`$${counts.join(" + ")} = ${answer}$.`, `$${counts.join(" + ")} = ${answer}$。`)],
          ],
          answer === n - cycles
            ? t(
                `The parity agrees: the permutation has ${cycles} ${cycles === 1 ? "cycle" : "cycles"}, so it is a product of $${n} - ${cycles} = ${n - cycles}$ transpositions, the same number.`,
                `奇偶性一致：这个排列有 ${cycles} 个循环，是 $${n} - ${cycles} = ${n - cycles}$ 个对换之积，个数相同。`,
              )
            : t(
                `The parity agrees: the permutation has ${cycles} ${cycles === 1 ? "cycle" : "cycles"}, so it is a product of $${n} - ${cycles} = ${n - cycles}$ transpositions, and $${answer}$ and $${n - cycles}$ are both ${answer % 2 === 0 ? "even" : "odd"}.`,
                `奇偶性一致：这个排列有 ${cycles} 个循环，是 $${n} - ${cycles} = ${n - cycles}$ 个对换之积，而 $${answer}$ 与 $${n - cycles}$ 都是${answer % 2 === 0 ? "偶数" : "奇数"}。`,
              ),
        ),
      });
    }
  },
};

const involutionsWithSwaps: KnowledgePointDef = {
  id: "counting-permutations-equal-to-their-inverse",
  title: t("Counting permutations equal to their inverse", "计算等于自身逆的排列"),
  explanation: t(
    "A permutation equals its own inverse exactly when applying it twice gives the identity, which means that all its cycles have length 1 or 2. So such a permutation is a set of disjoint transpositions. To count those with $k$ transpositions, line up the symbols and pair the first $2k$. Since this overcounts, divide by $2^k$ for the order within each pair and by $k!$ for the order of the pairs, and by $(n - 2k)!$ for the remaining symbols.\n\nFor $n = 4$ and $k = 2$: $\\frac{4!}{2^2 \\cdot 2! \\cdot 0!} = \\frac{24}{8} = 3$.\n\nCheck: the three are $(1\\;2)(3\\;4)$, $(1\\;3)(2\\;4)$ and $(1\\;4)(2\\;3)$, since $1$ can be paired with $2$, $3$ or $4$ and the other two symbols then form the second pair.\n\n> **Watch out.** Divide by both $2^k$ and $k!$: $(1\\;2)(3\\;4)$, $(2\\;1)(3\\;4)$ and $(3\\;4)(1\\;2)$ are the same permutation.",
    "一个排列等于自身的逆，当且仅当应用两次得到恒等排列，也就是它的所有循环长度都是 1 或 2。所以这样的排列是一组不相交的对换。要数含 $k$ 个对换的排列，把符号排成一行，把前 $2k$ 个配对。由于这样数多了，要除以 $2^k$（每对内的顺序）、$k!$（各对的顺序）和 $(n - 2k)!$（其余的符号）。\n\n对 $n = 4$、$k = 2$：$\\frac{4!}{2^2 \\cdot 2! \\cdot 0!} = \\frac{24}{8} = 3$。\n\n检验：这三个是 $(1\\;2)(3\\;4)$、$(1\\;3)(2\\;4)$ 与 $(1\\;4)(2\\;3)$，因为 $1$ 可以与 $2$、$3$ 或 $4$ 配对，其余两个符号组成第二对。\n\n> **注意。** $2^k$ 和 $k!$ 都要除：$(1\\;2)(3\\;4)$、$(2\\;1)(3\\;4)$ 与 $(3\\;4)(1\\;2)$ 是同一个排列。",
  ),
  generate(rng) {
    for (;;) {
      const n = rng.int(4, 14);
      const k = rng.int(2, Math.floor(n / 2));
      const pairs = factorial(2 * k) / (2 ** k * factorial(k));
      const answer = choose(n, 2 * k) * pairs;
      const mistakes = apart(answer, [
        why(
          answer * factorial(k),
          `That keeps the order of the ${k} pairs; the pairs commute, so divide by $${k}!$.`,
          `那保留了 ${k} 对之间的顺序；这些对换可交换，所以要除以 $${k}!$。`,
        ),
        why(
          answer * 2 ** k,
          `That keeps the order within each pair; $(a\\;b) = (b\\;a)$, so divide by $2^{${k}}$.`,
          `那保留了每对内的顺序；$(a\\;b) = (b\\;a)$，所以要除以 $2^{${k}}$。`,
        ),
        why(
          choose(n, 2 * k),
          `That only chooses the $${2 * k}$ symbols that move; they can still be paired up in $${pairs}$ ways.`,
          `那只选出了要移动的 $${2 * k}$ 个符号；它们还有 $${pairs}$ 种配对方式。`,
        ),
        why(
          choose(n, 2) ** k,
          "That picks each pair from all the symbols, letting pairs overlap and keeping their order.",
          "那从全部符号中挑每一对，允许各对重叠，还保留了它们的顺序。",
        ),
      ]);
      if (mistakes.length < 2) continue;
      return numberProblem({
        prompt: t(
          `How many permutations in $S_{${n}}$ are products of exactly ${k} disjoint transpositions, and so equal their own inverse?`,
          `$S_{${n}}$ 中有多少个排列恰好是 ${k} 个不相交对换的积，因而等于自身的逆？`,
        ),
        answer,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [
              ["Line up and pair", "排成一行再配对"],
              t(
                `Arrange the ${n} symbols in $${n}!$ ways and pair the first $${2 * k}$.`,
                `把 ${n} 个符号排成一行，有 $${n}!$ 种排法，把前 $${2 * k}$ 个配对。`,
              ),
            ],
            [
              ["Divide out the repeats", "除掉重复"],
              t(
                `Divide by $2^{${k}} = ${2 ** k}$ for the order within each pair, $${k}! = ${factorial(k)}$ for the order of the pairs, and $${n - 2 * k}! = ${factorial(n - 2 * k)}$ for the fixed symbols.`,
                `除以 $2^{${k}} = ${2 ** k}$（每对内的顺序）、$${k}! = ${factorial(k)}$（各对的顺序）和 $${n - 2 * k}! = ${factorial(n - 2 * k)}$（不动的符号）。`,
              ),
            ],
            [
              ["Compute", "计算"],
              t(
                `$\\frac{${n}!}{${2 ** k} \\cdot ${factorial(k)} \\cdot ${factorial(n - 2 * k)}} = ${answer}$.`,
                `$\\frac{${n}!}{${2 ** k} \\cdot ${factorial(k)} \\cdot ${factorial(n - 2 * k)}} = ${answer}$。`,
              ),
            ],
          ],
          t(
            `Choose the $${2 * k}$ moving symbols in $\\binom{${n}}{${2 * k}}$ ways and pair them in $${pairs}$ ways: $\\binom{${n}}{${2 * k}} \\cdot ${pairs} = ${answer}$.`,
            `先选出移动的 $${2 * k}$ 个符号，有 $\\binom{${n}}{${2 * k}}$ 种，再配对，有 $${pairs}$ 种：$\\binom{${n}}{${2 * k}} \\cdot ${pairs} = ${answer}$。`,
          ),
        ),
      });
    }
  },
};

const permutationsOfCycleType: KnowledgePointDef = {
  id: "counting-permutations-of-a-given-cycle-type",
  title: t("Counting permutations of a given cycle type", "计算给定循环类型的排列"),
  explanation: t(
    "To count the permutations with a given cycle type, first choose which symbols go into each cycle, and then arrange them. A cycle on $\\ell$ chosen symbols can be written in $(\\ell - 1)!$ different ways, because rotating a cycle does not change it. Two cycles of equal length are unordered, so choosing them in turn counts each permutation twice, and this must be divided out. Symbols not used are fixed, and contribute a single way.\n\nFor one $3$-cycle and one disjoint $2$-cycle in $S_5$: the $3$-cycle takes $\\binom{5}{3} \\cdot 2! = 20$ ways, and the remaining two symbols form the $2$-cycle in $\\binom{2}{2} \\cdot 1! = 1$ way, so there are $20$. For two disjoint $2$-cycles in $S_5$: $\\frac{\\binom{5}{2} \\cdot \\binom{3}{2}}{2} = \\frac{30}{2} = 15$.\n\nCheck: $\\frac{5!}{3 \\cdot 2} = 20$, since each of the $5!$ rows of symbols, cut into a $3$-cycle and a $2$-cycle, gives each permutation $3 \\cdot 2$ times, once for each rotation of each cycle.\n\n> **Watch out.** A cycle on $\\ell$ symbols has $(\\ell - 1)!$ arrangements, not $\\ell!$, and two cycles of the same length must be divided by $2$.",
    "要数给定循环类型的排列，先选出每个循环包含哪些符号，再排列它们。选定的 $\\ell$ 个符号组成的循环有 $(\\ell - 1)!$ 种不同的写法，因为旋转循环不会改变它。两个长度相同的循环没有顺序，所以依次选择会把每个排列数两次，必须除掉。没有用到的符号是不动点，只有一种情形。\n\n对 $S_5$ 中一个 $3$-循环与一个与之不相交的 $2$-循环：$3$-循环有 $\\binom{5}{3} \\cdot 2! = 20$ 种，剩下两个符号组成 $2$-循环只有 $\\binom{2}{2} \\cdot 1! = 1$ 种，共 $20$ 个。对 $S_5$ 中两个不相交的 $2$-循环：$\\frac{\\binom{5}{2} \\cdot \\binom{3}{2}}{2} = \\frac{30}{2} = 15$。\n\n检验：$\\frac{5!}{3 \\cdot 2} = 20$，因为把 $5!$ 种符号排列切成一个 $3$-循环和一个 $2$-循环，每个排列恰好出现 $3 \\cdot 2$ 次，对应每个循环的每种旋转。\n\n> **注意。** $\\ell$ 个符号的循环有 $(\\ell - 1)!$ 种写法，而不是 $\\ell!$；两个长度相同的循环还要除以 $2$。",
  ),
  generate(rng) {
    for (;;) {
      const n = rng.int(5, 10);
      const a = rng.int(2, n - 2);
      const b = rng.int(2, Math.min(a, n - a));
      const same = a === b;
      const first = choose(n, a) * factorial(a - 1);
      const second = choose(n - a, b) * factorial(b - 1);
      const answer = (first * second) / (same ? 2 : 1);
      const type = same ? `two disjoint ${a}-cycles` : `one ${a}-cycle and one disjoint ${b}-cycle`;
      const typeZh = same ? `两个不相交的 ${a}-循环` : `一个 ${a}-循环和一个与之不相交的 ${b}-循环`;
      const mistakes = apart(answer, [
        ...(same
          ? [
              why(
                2 * answer,
                "That chooses the two cycles in turn, so each permutation is counted twice; divide by 2.",
                "那是依次选择两个循环，每个排列被数了两次；要除以 2。",
              ),
            ]
          : [
              why(
                answer * a,
                `That writes the ${a}-cycle in $${a}!$ ways; rotating it changes nothing, so it has $${a - 1}!$.`,
                `那把 ${a}-循环写成 $${a}!$ 种；旋转不改变循环，所以只有 $${a - 1}!$ 种。`,
              ),
            ]),
        why(
          answer * a * b,
          `That arranges each cycle's symbols in every order; a cycle on $\\ell$ symbols has only $(\\ell - 1)!$ arrangements.`,
          `那把每个循环的符号按所有顺序排列；$\\ell$ 个符号的循环只有 $(\\ell - 1)!$ 种写法。`,
        ),
        why(
          choose(n, a) * choose(n - a, b),
          "That only chooses the symbols of each cycle, without arranging them into cycles.",
          "那只选出了每个循环的符号，没有把它们排成循环。",
        ),
      ]);
      if (mistakes.length < 2) continue;
      const centralizer = a * b * factorial(n - a - b) * (same ? 2 : 1);
      return numberProblem({
        prompt: t(
          `How many permutations in $S_{${n}}$ consist of ${type}, with all other symbols fixed?`,
          `$S_{${n}}$ 中有多少个排列由${typeZh}组成，其余符号都不动？`,
        ),
        answer,
        form: "integer",
        mistakes,
        solution: walked(
          [
            [
              ["The first cycle", "第一个循环"],
              t(
                `Choose its ${a} symbols and arrange them: $\\binom{${n}}{${a}} \\cdot ${a - 1}! = ${first}$.`,
                `选出它的 ${a} 个符号并排列：$\\binom{${n}}{${a}} \\cdot ${a - 1}! = ${first}$。`,
              ),
            ],
            [
              ["The second cycle", "第二个循环"],
              t(
                `From the ${n - a} left: $\\binom{${n - a}}{${b}} \\cdot ${b - 1}! = ${second}$.`,
                `从剩下的 ${n - a} 个中：$\\binom{${n - a}}{${b}} \\cdot ${b - 1}! = ${second}$。`,
              ),
            ],
            same
              ? [
                  ["Divide by 2", "除以 2"],
                  t(
                    `The two cycles have equal length, so each permutation was counted twice: $\\frac{${first} \\cdot ${second}}{2} = ${answer}$.`,
                    `两个循环长度相同，每个排列被数了两次：$\\frac{${first} \\cdot ${second}}{2} = ${answer}$。`,
                  ),
                ]
              : [["Multiply", "相乘"], t(`$${first} \\cdot ${second} = ${answer}$.`, `$${first} \\cdot ${second} = ${answer}$。`)],
          ],
          t(
            `Counting rows of all ${n} symbols instead, each permutation appears $${a} \\cdot ${b} \\cdot ${n - a - b}!${same ? " \\cdot 2" : ""} = ${centralizer}$ times, and $\\frac{${n}!}{${centralizer}} = ${answer}$.`,
            `改为数全部 ${n} 个符号的排列，每个排列出现 $${a} \\cdot ${b} \\cdot ${n - a - b}!${same ? " \\cdot 2" : ""} = ${centralizer}$ 次，而 $\\frac{${n}!}{${centralizer}} = ${answer}$。`,
          ),
        ),
      });
    }
  },
};

const prismSymmetries: KnowledgePointDef = {
  id: "the-symmetries-of-a-regular-prism",
  figure: algebraDrawings1["the-symmetry-group-of-a-figure#the-symmetries-of-a-regular-prism"],
  title: t("The symmetries of a regular prism", "正棱柱的对称"),
  explanation: t(
    "A right prism on a regular $n$-gon keeps the two bases apart from the side faces, unless it happens to be a cube, so every symmetry must send the bases to the bases. The $n$ rotations about the central axis keep each base in place, and $n$ half-turns about axes through the middle of the prism swap the bases. These are the $2n$ rotations. Adding reflection through the middle plane doubles the count, giving $4n$ symmetries in all.\n\nFor the triangular prism drawn, $n = 3$: the central axis gives $3$ rotations, counting the identity, and the $3$ half-turn axes such as the dashed one give $3$ more, so there are $6$ rotations. The reflection in the shaded middle plane doubles this to $12$ symmetries.\n\nCheck: a symmetry can send one corner to any of the $6$ corners, and then either keep or swap the two base edges there, which gives $6 \\cdot 2 = 12$.\n\n> **Watch out.** The half-turns that swap the two bases are rotations too: counting only the turns about the central axis gives $n$ rotations, not $2n$.",
    "正 $n$ 边形上的直棱柱，除非恰好是立方体，底面和侧面是区分开的，所以每个对称都把底面变到底面。绕中心轴的 $n$ 个旋转保持每个底面不动，绕过棱柱中部的轴的 $n$ 个半周旋转交换两个底面。这就是 $2n$ 个旋转。加上关于中间平面的反射，个数加倍，总共有 $4n$ 个对称。\n\n对图中的三棱柱，$n = 3$：中心轴给出 $3$ 个旋转（包括恒等变换），虚线那样的 $3$ 条半周旋转轴再给出 $3$ 个，共 $6$ 个旋转。关于阴影中截面的反射把它加倍到 $12$ 个对称。\n\n检验：一个对称可以把某个顶点送到 $6$ 个顶点中的任何一个，然后保持或交换那里的两条底边，共 $6 \\cdot 2 = 12$ 种。\n\n> **注意。** 交换两个底面的半周旋转也是旋转：只数绕中心轴的旋转得到的是 $n$ 个，而不是 $2n$ 个。",
  ),
  generate(rng) {
    const n = rng.pick(range(3, 40).filter((v) => v !== 4));
    const all = rng.pick([true, false]);
    const answer = all ? 4 * n : 2 * n;
    const mistakes = apart(answer, [
      why(
        n,
        "That counts only the rotations about the central axis; the half-turns that swap the bases count too.",
        "那只数了绕中心轴的旋转；交换两个底面的半周旋转也要算。",
      ),
      ...(all
        ? [
            why(
              2 * n,
              "That counts only the rotations; the reflections, such as the one in the middle plane, double the count.",
              "那只数了旋转；反射（如关于中间平面的反射）使个数加倍。",
            ),
            why(
              3 * n,
              `That adds only the ${n} mirror planes through the central axis to the rotations, missing the middle plane and the reflections combined with it.`,
              `那只在旋转之外加了过中心轴的 ${n} 个镜面，漏掉了中间平面及与之复合的反射。`,
            ),
          ]
        : [why(4 * n, "That also counts the reflections, but only rotations were asked for.", "那把反射也算进去了，但题目只问旋转。")]),
    ]);
    return numberProblem({
      prompt: t(
        `A right prism has regular ${n}-gons as its bases. How many ${all ? "symmetries, counting rotations and reflections," : "rotational symmetries, counting the identity,"} does it have?`,
        `一个直棱柱的底面是正 ${n} 边形。它有多少个${all ? "对称（包括旋转和反射）" : "旋转对称（包括恒等变换）"}？`,
      ),
      answer,
      form: "integer",
      mistakes,
      solution: walked(
        [
          [
            ["Turns about the axis", "绕中心轴的旋转"],
            t(`There are ${n} rotations about the central axis, counting the identity.`, `绕中心轴有 ${n} 个旋转（包括恒等变换）。`),
          ],
          [
            ["Half-turns", "半周旋转"],
            t(
              `There are ${n} half-turns that swap the bases, which makes $${n} + ${n} = ${2 * n}$ rotations.`,
              `交换两个底面的半周旋转有 ${n} 个，共 $${n} + ${n} = ${2 * n}$ 个旋转。`,
            ),
          ],
          all
            ? [
                ["Add the reflections", "加上反射"],
                t(
                  `Each rotation can also be followed by the reflection in the middle plane, which gives $2 \\cdot ${2 * n} = ${answer}$.`,
                  `每个旋转还可以再接一次关于中间平面的反射，得 $2 \\cdot ${2 * n} = ${answer}$。`,
                ),
              ]
            : [
                ["Leave out the reflections", "不算反射"],
                t(`Reflections are not rotations, so the answer is $${answer}$.`, `反射不是旋转，所以答案是 $${answer}$。`),
              ],
        ],
        all
          ? t(
              `A symmetry can send one corner to any of the $${2 * n}$ corners, and then keep or swap the two base edges there: $${2 * n} \\cdot 2 = ${answer}$.`,
              `一个对称可以把某个顶点送到 $${2 * n}$ 个顶点中的任何一个，然后保持或交换那里的两条底边：$${2 * n} \\cdot 2 = ${answer}$。`,
            )
          : t(
              `A rotation can send one corner to any of the $${2 * n}$ corners, and that choice fixes the rotation, so there are $${answer}$.`,
              `一个旋转可以把某个顶点送到 $${2 * n}$ 个顶点中的任何一个，而这个选择确定了旋转，所以共有 $${answer}$ 个。`,
            ),
      ),
    });
  },
};

const elementsOfOrderInProduct: KnowledgePointDef = {
  id: "counting-elements-of-a-given-order-in-a-product",
  title: t("Counting elements of a given order in a product", "计算积群中给定阶的元素"),
  explanation: t(
    "The order of an element $(x, y)$ of a direct product is the least common multiple of the orders of $x$ and $y$. So to count the elements of order $d$, list the pairs of orders $(d_1, d_2)$ with $\\operatorname{lcm}(d_1, d_2) = d$, using divisors of the two group orders. In a cyclic factor, there are $\\varphi(d_1)$ elements of order $d_1$, so each pair of orders contributes the product of two totients.\n\nIn $\\mathbb{Z}_{20} \\times \\mathbb{Z}_{30}$, the pairs of orders with least common multiple $4$ are $(4, 1)$ and $(4, 2)$, so there are $\\varphi(4) + \\varphi(4) = 2 + 2 = 4$ elements of order $4$.\n\nCheck: they are $(x, y)$ with $x \\in \\{5, 15\\}$ and $y \\in \\{0, 15\\}$, which gives $4$ pairs.\n\n> **Watch out.** A pair counts only when its least common multiple is exactly $d$: $(2, 2)$ has least common multiple $2$, so it adds nothing to the elements of order $4$.",
    "直积中元素 $(x, y)$ 的阶是 $x$ 和 $y$ 的阶的最小公倍数。所以要数 $d$ 阶元素，就用两个群的阶的因数，列出满足 $\\operatorname{lcm}(d_1, d_2) = d$ 的阶对 $(d_1, d_2)$。在循环因子中，有 $\\varphi(d_1)$ 个 $d_1$ 阶元素，所以每个阶对贡献两个欧拉函数值之积。\n\n在 $\\mathbb{Z}_{20} \\times \\mathbb{Z}_{30}$ 中，最小公倍数为 $4$ 的阶对是 $(4, 1)$ 与 $(4, 2)$，所以 $4$ 阶元素有 $\\varphi(4) + \\varphi(4) = 2 + 2 = 4$ 个。\n\n检验：它们是 $x \\in \\{5, 15\\}$、$y \\in \\{0, 15\\}$ 的 $(x, y)$，共 $4$ 对。\n\n> **注意。** 只有最小公倍数恰为 $d$ 的阶对才算：$(2, 2)$ 的最小公倍数是 $2$，对 $4$ 阶元素没有贡献。",
  ),
  generate(rng) {
    const m = rng.int(2, 12);
    const n = rng.int(2, 12);
    const d = rng.pick(divisors(lcm(m, n)).filter((v) => v > 1));
    const pairs = divisors(m).flatMap((d1) =>
      divisors(n)
        .filter((d2) => lcm(d1, d2) === d)
        .map((d2) => [d1, d2] as const),
    );
    const answer = sum(pairs.map(([d1, d2]) => totient(d1) * totient(d2)));
    const term = (a: number, b: number) => (a === 1 ? `${b}` : b === 1 ? `${a}` : `${a} \\cdot ${b}`);
    const shown = pairs.map(([d1, d2]) => term(totient(d1), totient(d2))).join(" + ");
    const [f1, f2] = pairs[0] ?? [d, 1];
    return numberProblem({
      prompt: t(
        `How many elements of order ${d} does $${Zn(m)} \\times ${Zn(n)}$ have?`,
        `$${Zn(m)} \\times ${Zn(n)}$ 中有多少个 ${d} 阶元素？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          totient(d),
          `That counts the elements of order $${d}$ in one cyclic group of order $${d}$; here several pairs of orders contribute.`,
          `那是一个 $${d}$ 阶循环群中 $${d}$ 阶元素的个数；这里有多个阶对都有贡献。`,
        ),
        why(
          pairs.length,
          "That counts the pairs of orders; each pair contributes $\\varphi(d_1)\\varphi(d_2)$ elements.",
          "那是阶对的个数；每个阶对贡献 $\\varphi(d_1)\\varphi(d_2)$ 个元素。",
        ),
        why(
          2 * totient(d),
          "Do not just double one totient; list every pair of orders with the right least common multiple.",
          "不要只把一个欧拉函数值加倍；要列出最小公倍数正确的每个阶对。",
        ),
        why(m * n, "That is the size of the whole group.", "那是整个群的大小。"),
      ]),
      solution: walked(
        [
          [
            ["List the pairs of orders", "列出阶对"],
            t(
              `The orders must have least common multiple $${d}$, and the possible pairs are ${pairs.map(([d1, d2]) => `$(${d1}, ${d2})$`).join(", ")}.`,
              `两个阶的最小公倍数必须是 $${d}$，可能的阶对是 ${pairs.map(([d1, d2]) => `$(${d1}, ${d2})$`).join("、")}。`,
            ),
          ],
          [
            ["Add the counts", "把个数相加"],
            t(`Counting elements of these orders gives $${shown} = ${answer}$.`, `数出这些阶的元素，得 $${shown} = ${answer}$。`),
          ],
        ],
        t(
          `$\\operatorname{lcm}(${f1}, ${f2}) = ${d}$, with $${f1}$ dividing $${m}$ and $${f2}$ dividing $${n}$${pairs.length > 1 ? "; the other pairs check the same way" : ""}.`,
          `$\\operatorname{lcm}(${f1}, ${f2}) = ${d}$，其中 $${f1}$ 整除 $${m}$，$${f2}$ 整除 $${n}$${pairs.length > 1 ? "；其余阶对同样可验证" : ""}。`,
        ),
      ),
    });
  },
};

const smallestInCoset: KnowledgePointDef = {
  id: "the-smallest-element-of-a-coset-of-a-subgroup-of-units",
  title: t("The smallest element of a coset of a subgroup of units", "单位子群陪集中的最小元素"),
  explanation: t(
    "A coset $aH$ of a subgroup $H$ of the units modulo $p$ is found by multiplying each element of $H$ by $a$ and reducing. The result has the same number of elements as $H$, and it is disjoint from $H$ when $a$ lies outside $H$. A coset has no natural first element, because any of its elements can serve as the representative $a$. So choosing the smallest is a way of naming the coset uniquely.\n\nModulo $101$, the subgroup generated by $10$ is $H = \\{1, 10, 100, 91\\}$. The coset $50H$ is $\\{50, 96, 51, 5\\}$, so its smallest element is $5$.\n\nCheck: $5H = \\{5, 50, 96, 51\\}$ is the same set, since $5 \\cdot 10 = 50$, $5 \\cdot 100 = 500 = 4 \\cdot 101 + 96$ and $5 \\cdot 91 = 455 = 4 \\cdot 101 + 51$.\n\n> **Watch out.** The representative $a$ is often not the smallest element: reduce every product $ah$ modulo $p$ before comparing.",
    "模 $p$ 单位群的子群 $H$ 的陪集 $aH$，是把 $H$ 的每个元素乘以 $a$ 再化简得到的。结果与 $H$ 的元素个数相同，当 $a$ 在 $H$ 之外时与 $H$ 不相交。陪集没有天然的第一个元素，因为它的任何元素都可以作代表元 $a$。所以选最小的元素是给陪集唯一命名的一种方法。\n\n模 $101$ 时，由 $10$ 生成的子群是 $H = \\{1, 10, 100, 91\\}$。陪集 $50H$ 是 $\\{50, 96, 51, 5\\}$，所以最小元素是 $5$。\n\n检验：$5H = \\{5, 50, 96, 51\\}$ 是同一个集合，因为 $5 \\cdot 10 = 50$，$5 \\cdot 100 = 500 = 4 \\cdot 101 + 96$，$5 \\cdot 91 = 455 = 4 \\cdot 101 + 51$。\n\n> **注意。** 代表元 $a$ 往往不是最小元素：比较之前要把每个乘积 $ah$ 都模 $p$ 化简。",
  ),
  generate(rng) {
    const p = rng.pick(primeList(97).filter((q) => q > 10));
    const subgroupOf = (g: number) => {
      const members = [1];
      let value = g % p;
      while (value !== 1) {
        members.push(value);
        value = (value * g) % p;
      }
      return members;
    };
    const g = rng.pick(
      range(2, p - 1).filter((v) => {
        const size = subgroupOf(v).length;
        return size <= 12 && size < p - 1;
      }),
    );
    const subgroup = subgroupOf(g);
    const a = rng.pick(range(2, p - 1).filter((v) => !subgroup.includes(v)));
    const coset = subgroup.map((h) => (a * h) % p).sort((x, y) => x - y);
    const answer = coset[0] ?? a;
    const listed = [...subgroup].sort((x, y) => x - y).join(", ");
    return numberProblem({
      prompt: t(
        `In the group of units modulo ${p}, let $H$ be the subgroup generated by ${g}. Find the smallest element of the coset $${a}H$, taken as an integer from 1 to ${p - 1}.`,
        `在模 ${p} 的单位群中，设 $H$ 是由 ${g} 生成的子群。求陪集 $${a}H$ 的最小元素，取 1 到 ${p - 1} 之间的整数。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(a, `That is the representative $${a}$; another element of the coset is smaller.`, `那是代表元 $${a}$；陪集中还有更小的元素。`),
        why(g, `$${g}$ lies in $H$ itself, not in the coset $${a}H$.`, `$${g}$ 在 $H$ 中，不在陪集 $${a}H$ 中。`),
        why(
          (a * g) % p,
          `That is $${a} \\cdot ${g}$ reduced, one element of the coset but not the smallest.`,
          `那是 $${a} \\cdot ${g}$ 化简的结果，是陪集的一个元素，但不是最小的。`,
        ),
        why(coset[coset.length - 1] ?? a, "That is the largest element of the coset.", "那是陪集中最大的元素。"),
      ]),
      solution: walked(
        [
          [
            ["List the subgroup", "列出子群"],
            t(`The powers of $${g}$ modulo $${p}$ give $H = \\{${listed}\\}$.`, `$${g}$ 模 $${p}$ 的各次幂给出 $H = \\{${listed}\\}$。`),
          ],
          [
            ["Multiply and reduce", "相乘并化简"],
            t(
              `Multiplying by $${a}$ and reducing gives $\\{${coset.join(", ")}\\}$, whose smallest element is $${answer}$.`,
              `乘以 $${a}$ 并化简，得 $\\{${coset.join(", ")}\\}$，最小元素是 $${answer}$。`,
            ),
          ],
        ],
        t(
          `$${answer}H = \\{${subgroup
            .map((h) => (answer * h) % p)
            .sort((x, y) => x - y)
            .join(", ")}\\}$ is the same set, as it must be for an element of the coset.`,
          `$${answer}H = \\{${subgroup
            .map((h) => (answer * h) % p)
            .sort((x, y) => x - y)
            .join(", ")}\\}$ 是同一个集合，陪集中的元素必然如此。`,
        ),
      ),
    });
  },
};

const subgroupsOfQuotient: KnowledgePointDef = {
  id: "counting-the-subgroups-of-a-quotient-of-zn",
  title: t("Counting the subgroups of a quotient of Zn", "计算 Zn 的商群的子群个数"),
  explanation: t(
    "The element $k$ of $\\mathbb{Z}_n$ generates the same subgroup as $\\gcd(n, k)$, and this has $\\frac{n}{\\gcd(n, k)}$ elements. So the quotient by it has order $\\gcd(n, k)$. A quotient of a cyclic group is cyclic, and a cyclic group has exactly one subgroup for each divisor of its order. So the number of subgroups of the quotient is the number of divisors of $\\gcd(n, k)$, and it has nothing further to do with $n$.\n\nFor $\\mathbb{Z}_{360} / \\langle 84 \\rangle$: $\\gcd(360, 84) = 12$, so the quotient is cyclic of order $12$ and has $6$ subgroups, one for each of $1, 2, 3, 4, 6, 12$.\n\nCheck: $\\langle 84 \\rangle$ has $\\frac{360}{12} = 30$ elements, and $\\frac{360}{30} = 12$.\n\n> **Watch out.** Count the divisors of $\\gcd(n, k)$, not of $n$: $360$ has $24$ divisors, but the quotient has only $6$ subgroups.",
    "$\\mathbb{Z}_n$ 中的元素 $k$ 与 $\\gcd(n, k)$ 生成相同的子群，它有 $\\frac{n}{\\gcd(n, k)}$ 个元素。所以对它的商群的阶是 $\\gcd(n, k)$。循环群的商群是循环群，循环群对其阶的每个因数恰有一个子群。所以商群的子群个数是 $\\gcd(n, k)$ 的因数个数，与 $n$ 再无其他关系。\n\n对 $\\mathbb{Z}_{360} / \\langle 84 \\rangle$：$\\gcd(360, 84) = 12$，所以商群是 $12$ 阶循环群，有 $6$ 个子群，分别对应 $1, 2, 3, 4, 6, 12$。\n\n检验：$\\langle 84 \\rangle$ 有 $\\frac{360}{12} = 30$ 个元素，且 $\\frac{360}{30} = 12$。\n\n> **注意。** 要数 $\\gcd(n, k)$ 的因数，而不是 $n$ 的因数：$360$ 有 $24$ 个因数，但商群只有 $6$ 个子群。",
  ),
  generate(rng) {
    const n = rng.pick(compositeList(12, 120));
    const k = rng.pick(range(2, n - 1).filter((v) => gcd(n, v) > 1));
    const order = gcd(n, k);
    const answer = divisors(order).length;
    return numberProblem({
      prompt: t(
        `How many subgroups does the quotient group $${Zn(n)} / \\langle ${k} \\rangle$ have?`,
        `商群 $${Zn(n)} / \\langle ${k} \\rangle$ 有多少个子群？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(order, "That is the order of the quotient; count its divisors.", "那是商群的阶；应数它的因数。"),
        why(divisors(n).length, `That counts the subgroups of $${Zn(n)}$ itself.`, `那是 $${Zn(n)}$ 本身的子群个数。`),
        why(
          divisors(n / order).length,
          `That counts the subgroups of $\\langle ${k} \\rangle$, not of the quotient.`,
          `那是 $\\langle ${k} \\rangle$ 的子群个数，不是商群的。`,
        ),
        why(n / order, `That is the number of elements of $\\langle ${k} \\rangle$.`, `那是 $\\langle ${k} \\rangle$ 的元素个数。`),
      ]),
      solution: walked(
        [
          [
            ["Find the order of the quotient", "求商群的阶"],
            t(
              `$\\langle ${k} \\rangle$ has $\\frac{${n}}{\\gcd(${n}, ${k})} = ${n / order}$ elements, so the quotient is cyclic of order $${order}$.`,
              `$\\langle ${k} \\rangle$ 有 $\\frac{${n}}{\\gcd(${n}, ${k})} = ${n / order}$ 个元素，所以商群是 $${order}$ 阶循环群。`,
            ),
          ],
          [
            ["Count the divisors", "数因数"],
            t(
              `The divisors of $${order}$ are $${divisors(order).join(", ")}$, one subgroup each: $${answer}$ subgroups.`,
              `$${order}$ 的因数为 $${divisors(order).join(", ")}$，各对应一个子群：共 $${answer}$ 个子群。`,
            ),
          ],
        ],
        t(
          `$\\frac{${n}}{${n / order}} = ${order}$, so the quotient really has $${order}$ cosets.`,
          `$\\frac{${n}}{${n / order}} = ${order}$，所以商群确有 $${order}$ 个陪集。`,
        ),
      ),
    });
  },
};

const orbitsOfNegation: KnowledgePointDef = {
  id: "counting-the-orbits-of-negation-on-zn",
  title: t("Counting the orbits of negation on Zn", "计算 Zn 上取负作用的轨道数"),
  explanation: t(
    "The two-element group $\\{1, -1\\}$ acts on the residues modulo $n$ by multiplication. Each orbit is the pair $\\{x, -x\\}$, and this pair has only one element when $x \\equiv -x$. Those fixed residues are 0 and, for even $n$, also $\\frac{n}{2}$. All other residues pair up, so the number of orbits is the number of fixed residues plus half of the rest. Burnside's lemma gives the same count, as the average number of points fixed.",
    "二元群 $\\{1, -1\\}$ 通过乘法作用在模 $n$ 的剩余上。每个轨道是一对 $\\{x, -x\\}$，当 $x \\equiv -x$ 时这一对只有一个元素。这些不动的剩余是 0，当 $n$ 为偶数时还有 $\\frac{n}{2}$。其余剩余两两配对，所以轨道数是不动剩余的个数加上其余个数的一半。伯恩赛德引理作为不动点个数的平均值，给出同样的结果。",
  ),
  generate(rng) {
    const n = rng.int(5, 100);
    const fixed = n % 2 === 0 ? 2 : 1;
    const answer = fixed + (n - fixed) / 2;
    return numberProblem({
      prompt: t(
        `The group $\\{1, -1\\}$ acts on $${Zn(n)}$ by multiplication. How many orbits are there?`,
        `群 $\\{1, -1\\}$ 通过乘法作用在 $${Zn(n)}$ 上。共有多少个轨道？`,
      ),
      answer,
      form: "integer",
      wrong: [Math.floor(n / 2), answer + 1, n, 2],
      solution: t(
        `Each orbit is $\\{x, -x\\}$. There ${fixed === 1 ? "is $1$ fixed residue, namely 0" : `are $2$ fixed residues, namely 0 and ${n / 2}`}, and the other $${n - fixed}$ residues form $${(n - fixed) / 2}$ pairs. So there are $${answer}$ orbits.`,
        `每个轨道是 $\\{x, -x\\}$。不动的剩余有 ${fixed === 1 ? "$1$ 个，即 0" : `$2$ 个，即 0 和 ${n / 2}`}，其余 $${n - fixed}$ 个剩余组成 $${(n - fixed) / 2}$ 对。所以共有 $${answer}$ 个轨道。`,
      ),
    });
  },
};

const gridColorings: KnowledgePointDef = {
  id: "colorings-of-a-square-grid-up-to-rotation",
  figure: algebraDrawings2["burnsides-lemma#colorings-of-a-square-grid-up-to-rotation"],
  title: t("Colorings of a square grid up to rotation", "旋转意义下方格的染色"),
  explanation: t(
    "Burnside's lemma counts colorings up to rotation by averaging the numbers of colorings fixed by each of the four rotations. A coloring is fixed by a rotation exactly when it is constant on each cycle of cells, so a rotation with $m$ cycles fixes $c^m$ colorings. The identity has one cycle per cell. The quarter turns have the fewest cycles, since most cells move through a four-cell loop. A central cell, if there is one, always forms a cycle by itself.",
    "伯恩赛德引理把四个旋转各自固定的染色数取平均，来计算旋转意义下的染色数。一个染色被旋转固定，当且仅当它在方格的每个循环上取常数，所以有 $m$ 个循环的旋转固定 $c^m$ 种染色。恒等变换每格一个循环。四分之一转的循环最少，因为大多数方格在四格环中移动。如果有中心格，它总是单独成一个循环。",
  ),
  generate(rng) {
    const size = rng.pick([2, 3, 3, 4, 4]);
    const c = rng.pick(range(2, size === 2 ? 20 : size === 3 ? 10 : 6));
    const [identity, half, quarter] = size === 2 ? [4, 2, 1] : size === 3 ? [9, 5, 3] : [16, 8, 4];
    const answer = (c ** identity + c ** half + 2 * c ** quarter) / 4;
    const power = (e: number) => (e === 1 ? `${c}` : `${c}^{${e}}`);
    return numberProblem({
      prompt: t(
        `The cells of a ${size}×${size} grid are colored using ${c} colors. How many colorings are there, counting two as the same if a rotation of the grid turns one into the other?`,
        `用 ${c} 种颜色给 ${size}×${size} 方格的格子染色。如果旋转方格能把一种染色变成另一种，就算作相同。共有多少种染色？`,
      ),
      answer,
      form: "integer",
      wrong: [c ** identity, Math.floor(c ** identity / 4), (c ** identity + c ** half) / 2, answer + 1],
      solution: t(
        `The identity has ${identity} cycles of cells, the half turn has ${half}, and each of the two quarter turns has ${quarter}. So Burnside's lemma gives $\\frac{${power(identity)} + ${power(half)} + 2 \\cdot ${power(quarter)}}{4} = ${answer}$.`,
        `恒等变换有 ${identity} 个方格循环，半周旋转有 ${half} 个，两个四分之一转各有 ${quarter} 个。所以伯恩赛德引理给出 $\\frac{${power(identity)} + ${power(half)} + 2 \\cdot ${power(quarter)}}{4} = ${answer}$。`,
      ),
    });
  },
};

const sylowOfSymmetric: KnowledgePointDef = {
  id: "the-order-of-a-sylow-subgroup-of-a-symmetric-group",
  title: t("The order of a Sylow subgroup of a symmetric group", "对称群的西罗子群的阶"),
  explanation: t(
    "A Sylow $p$-subgroup has as its order the highest power of $p$ that divides the order of the group. For $S_n$, the order is $n!$, and the exponent of $p$ in it is $\\lfloor \\frac{n}{p} \\rfloor + \\lfloor \\frac{n}{p^2} \\rfloor + \\dots$, because the multiples of $p$ each contribute a factor, the multiples of $p^2$ contribute another, and so on. Note that the answer is the power itself, not its exponent.\n\nFor $S_{25}$ and $p = 5$, the multiples of $5$ up to $25$ give $\\lfloor \\frac{25}{5} \\rfloor = 5$ factors, and $25$ gives one more. So the exponent is $6$, and a Sylow $5$-subgroup has order $5^6 = 15625$.\n\nCheck: $5, 10, 15, 20$ each contribute one $5$ and $25 = 5^2$ contributes two, which makes $4 + 2 = 6$.\n\n> **Watch out.** Count the multiples of $p^2$ again: in $8!$ the exponent of $2$ is $4 + 2 + 1 = 7$, not $4$, so a Sylow $2$-subgroup of $S_8$ has order $128$.",
    "西罗 $p$-子群的阶是整除群的阶的 $p$ 的最高次幂。对 $S_n$，阶是 $n!$，其中 $p$ 的指数是 $\\lfloor \\frac{n}{p} \\rfloor + \\lfloor \\frac{n}{p^2} \\rfloor + \\dots$，因为 $p$ 的每个倍数贡献一个因子，$p^2$ 的倍数再贡献一个，依此类推。注意答案是这个幂本身，不是它的指数。\n\n对 $S_{25}$ 与 $p = 5$，$25$ 以内 $5$ 的倍数给出 $\\lfloor \\frac{25}{5} \\rfloor = 5$ 个因子，$25$ 再多给一个。所以指数是 $6$，西罗 $5$-子群的阶为 $5^6 = 15625$。\n\n检验：$5, 10, 15, 20$ 各贡献一个 $5$，$25 = 5^2$ 贡献两个，共 $4 + 2 = 6$。\n\n> **注意。** $p^2$ 的倍数要再数一次：$8!$ 中 $2$ 的指数是 $4 + 2 + 1 = 7$，而不是 $4$，所以 $S_8$ 的西罗 $2$-子群的阶是 $128$。",
  ),
  generate(rng) {
    const n = rng.int(4, 12);
    const p = rng.pick(primeList(n));
    const parts = [p, p * p, p * p * p].filter((q) => q <= n).map((q) => Math.floor(n / q));
    const exponent = sum(parts);
    const answer = p ** exponent;
    return numberProblem({
      prompt: t(`Find the order of a Sylow ${p}-subgroup of $S_{${n}}$.`, `求 $S_{${n}}$ 的西罗 ${p}-子群的阶。`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          exponent,
          `${exponent} is the exponent of ${p} in ${n}!; the order is the power itself.`,
          `${exponent} 是 ${n}! 中 ${p} 的指数；阶是幂本身。`,
        ),
        why(p * answer, `That is one factor of ${p} too many: it does not divide ${n}!.`, `这多了一个因子 ${p}：它不整除 ${n}!。`),
        why(
          p * exponent,
          `That multiplies ${p} by the exponent instead of raising ${p} to it.`,
          `这是用 ${p} 乘以指数，而不是求 ${p} 的这个次幂。`,
        ),
        why(
          answer + p,
          `Adding ${p} does not give the highest power of ${p} dividing ${n}!.`,
          `加上 ${p} 得不到整除 ${n}! 的 ${p} 的最高次幂。`,
        ),
        why(
          n,
          `${n} is the number of points moved; the order comes from the power of ${p} in ${n}!.`,
          `${n} 是被置换的点数；阶来自 ${n}! 中 ${p} 的幂。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Count the factors of the prime", "数素因子"],
            t(
              `The multiples of ${p} up to ${n} give ${parts[0]}${parts.length > 1 ? `, the multiples of ${p * p} give ${parts[1]} more` : ""}${parts.length > 2 ? `, and the multiples of ${p ** 3} give ${parts[2]} more` : ""}. So the exponent of ${p} in ${n}! is $${parts.length > 1 ? `${parts.join(" + ")} = ` : ""}${exponent}$.`,
              `${n} 以内 ${p} 的倍数给出 ${parts[0]} 个${parts.length > 1 ? `，${p * p} 的倍数再给出 ${parts[1]} 个` : ""}${parts.length > 2 ? `，${p ** 3} 的倍数再给出 ${parts[2]} 个` : ""}。所以 ${n}! 中 ${p} 的指数是 $${parts.length > 1 ? `${parts.join(" + ")} = ` : ""}${exponent}$。`,
            ),
          ],
          [
            ["Raise the prime to it", "求幂"],
            t(
              `The order is $${exponent === 1 ? `${p}` : `${p}^{${exponent}} = ${answer}`}$.`,
              `阶是 $${exponent === 1 ? `${p}` : `${p}^{${exponent}} = ${answer}`}$。`,
            ),
          ],
        ],
        t(
          `$\\frac{${n}!}{${answer}} = ${range(1, n).reduce((a, b) => a * b, 1) / answer}$ is not divisible by ${p}.`,
          `$\\frac{${n}!}{${answer}} = ${range(1, n).reduce((a, b) => a * b, 1) / answer}$ 不被 ${p} 整除。`,
        ),
      ),
    });
  },
};

const triangularUnits: KnowledgePointDef = {
  id: "counting-units-of-triangular-matrices-over-zn",
  title: t("Counting units of triangular matrices over Zn", "计算 Zn 上三角矩阵环的单位"),
  explanation: t(
    "The upper triangular $2 \\times 2$ matrices over $\\mathbb{Z}_n$ form a ring. A matrix in this ring is a unit exactly when its inverse is also upper triangular, and this happens when both diagonal entries are units of $\\mathbb{Z}_n$. The entry above the diagonal can be anything, since it does not affect the determinant. So the count is a product of three independent choices, and the ring is not commutative even though $\\mathbb{Z}_n$ is.\n\nOver $\\mathbb{Z}_{60}$ there are $\\varphi(60) = 16$ units, so the ring has $16^2 \\cdot 60 = 15360$ units out of $60^3 = 216000$ matrices.\n\nCheck: the matrix with diagonal $7, 11$ and corner $5$ has determinant $77 = 60 + 17$, and $\\gcd(17, 60) = 1$, so it is a unit.\n\n> **Watch out.** The diagonal entries must be units, not merely nonzero: over $\\mathbb{Z}_4$ the diagonal $2, 3$ gives determinant $6 = 2$, which is not a unit.",
    "$\\mathbb{Z}_n$ 上的 $2 \\times 2$ 上三角矩阵构成环。这个环中的矩阵是单位，当且仅当它的逆也是上三角矩阵，这发生在两个对角元都是 $\\mathbb{Z}_n$ 的单位时。对角线上方的元素可以任取，因为它不影响行列式。所以个数是三个独立选择之积，尽管 $\\mathbb{Z}_n$ 可交换，这个环却不可交换。\n\n在 $\\mathbb{Z}_{60}$ 上有 $\\varphi(60) = 16$ 个单位，所以这个环在 $60^3 = 216000$ 个矩阵中有 $16^2 \\cdot 60 = 15360$ 个单位。\n\n检验：对角元为 $7, 11$、右上角为 $5$ 的矩阵行列式是 $77 = 60 + 17$，而 $\\gcd(17, 60) = 1$，所以它是单位。\n\n> **注意。** 对角元必须是单位，而不只是非零：在 $\\mathbb{Z}_4$ 上，对角元 $2, 3$ 给出行列式 $6 = 2$，它不是单位。",
  ),
  generate(rng) {
    const n = rng.int(3, 40);
    const units = totient(n);
    const answer = units * units * n;
    return numberProblem({
      prompt: t(
        `How many units does the ring of upper triangular $2 \\times 2$ matrices over $${Zn(n)}$ have?`,
        `$${Zn(n)}$ 上的 $2 \\times 2$ 上三角矩阵环有多少个单位？`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(units * n, "Both diagonal entries must be units, not only one of them.", "两个对角元都必须是单位，而不只是其中一个。"),
        why(
          units * units,
          `The entry above the diagonal is free, which multiplies the count by ${n}.`,
          `对角线上方的元素可以任取，这使个数乘以 ${n}。`,
        ),
        why(n ** 3, "That counts every upper triangular matrix, units or not.", "这数的是所有上三角矩阵，不论是否为单位。"),
        why(
          (n - 1) ** 2 * n,
          `That allows any nonzero diagonal entry, but only the ${units} units of $${Zn(n)}$ can be inverted.`,
          `这允许对角元取任意非零值，但只有 $${Zn(n)}$ 的 ${units} 个单位可逆。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Choose the diagonal", "选对角元"],
            t(
              `Both diagonal entries must be units, with $\\varphi(${n}) = ${units}$ choices each.`,
              `两个对角元都必须是单位，各有 $\\varphi(${n}) = ${units}$ 种选择。`,
            ),
          ],
          [
            ["Choose the corner", "选右上角"],
            t(
              `The entry above the diagonal is free, with ${n} choices. This gives $${units}^2 \\cdot ${n} = ${answer}$.`,
              `对角线上方的元素可以任取，有 ${n} 种选择。所以是 $${units}^2 \\cdot ${n} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `The determinant is the product of the diagonal entries, and a product of two units of $${Zn(n)}$ is a unit.`,
          `行列式是对角元之积，而 $${Zn(n)}$ 的两个单位之积仍是单位。`,
        ),
      ),
    });
  },
};

const gaussianFraction: KnowledgePointDef = {
  id: "a-fraction-of-gaussian-integers-in-standard-form",
  title: t("A fraction of Gaussian integers in standard form", "把高斯整数之比写成标准形式"),
  explanation: t(
    "The Gaussian integers $\\mathbb{Z}[i]$ form an integral domain, and their field of quotients is the set of $x + yi$ with $x$ and $y$ rational. A fraction is put in this form by multiplying the top and bottom by the conjugate of the denominator. The new denominator is the integer $c^2 + d^2$, which is why every fraction has rational coordinates. So every quotient of Gaussian integers has one standard form, although many fractions represent it.\n\nFor $\\frac{1 + 12i}{3 + 2i}$, multiplying the top and bottom by $3 - 2i$ gives the denominator $9 + 4 = 13$ and the numerator $3 - 2i + 36i + 24 = 27 + 34i$. So the standard form is $\\frac{27}{13} + \\frac{34}{13}i$.\n\nCheck: $(3 + 2i)(27 + 34i) = 81 + 102i + 54i - 68 = 13 + 156i$, and dividing by $13$ gives $1 + 12i$ back.\n\n> **Watch out.** The new denominator has a plus sign: $(c + di)(c - di) = c^2 - d^2 i^2 = c^2 + d^2$, so for $3 + 2i$ it is $13$, not $5$.",
    "高斯整数 $\\mathbb{Z}[i]$ 构成整环，它的分式域是 $x$、$y$ 为有理数的 $x + yi$ 的集合。把分子分母同乘以分母的共轭，就把分式写成这种形式。新的分母是整数 $c^2 + d^2$，这就是每个分式都有有理坐标的原因。所以高斯整数的每个商都有唯一的标准形式，尽管有许多分式表示它。\n\n对 $\\frac{1 + 12i}{3 + 2i}$，分子分母同乘以 $3 - 2i$，分母是 $9 + 4 = 13$，分子是 $3 - 2i + 36i + 24 = 27 + 34i$。所以标准形式是 $\\frac{27}{13} + \\frac{34}{13}i$。\n\n检验：$(3 + 2i)(27 + 34i) = 81 + 102i + 54i - 68 = 13 + 156i$，除以 $13$ 就回到 $1 + 12i$。\n\n> **注意。** 新的分母是加号：$(c + di)(c - di) = c^2 - d^2 i^2 = c^2 + d^2$，所以对 $3 + 2i$ 它是 $13$，而不是 $5$。",
  ),
  generate(rng) {
    const a = pickNonzero(rng, 9);
    const b = pickNonzero(rng, 9);
    const c = pickNonzero(rng, 9);
    const d = pickNonzero(rng, 9);
    const norm = c * c + d * d;
    const re = a * c + b * d;
    const im = b * c - a * d;
    const asksReal = rng.pick([true, false]);
    const answer = Q.of(asksReal ? re : im, norm);
    return numberProblem({
      prompt: t(
        `In the field of quotients of $\\mathbb{Z}[i]$, write $\\frac{${poly([a, ""], [b, "i"])}}{${poly([c, ""], [d, "i"])}} = x + yi$ with $x$ and $y$ rational. Find ${asksReal ? "$x$" : "$y$"}.`,
        `在 $\\mathbb{Z}[i]$ 的分式域中，写成 $\\frac{${poly([a, ""], [b, "i"])}}{${poly([c, ""], [d, "i"])}} = x + yi$，其中 $x$、$y$ 是有理数。求 ${asksReal ? "$x$" : "$y$"}。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(asksReal ? a : b, c),
          "Dividing coordinate by coordinate is not division of complex numbers; multiply by the conjugate first.",
          "逐个坐标相除不是复数的除法；要先乘以共轭。",
        ),
        why(
          Q.of(asksReal ? a * c - b * d : b * c + a * d, norm),
          "A sign in the numerator is off: multiplying by the conjugate gives real part $ac + bd$ and imaginary part $bc - ad$.",
          "分子中有个符号错了：乘以共轭后，实部是 $ac + bd$，虚部是 $bc - ad$。",
        ),
        why(
          answer.neg(),
          "The sign is reversed; recheck the sign of each product in the numerator.",
          "符号反了；要重新检查分子中每个乘积的符号。",
        ),
        why(
          Q.of(asksReal ? re : im, 2 * norm),
          `The denominator is $c^2 + d^2 = ${norm}$, not twice it.`,
          `分母是 $c^2 + d^2 = ${norm}$，不是它的两倍。`,
        ),
        why(answer.add(Q.of(1)), "That is one more than the coordinate; recheck the division.", "这比所求坐标大一；要重新检查除法。"),
        why(answer.sub(Q.of(1)), "That is one less than the coordinate; recheck the division.", "这比所求坐标小一；要重新检查除法。"),
      ]),
      solution: walked(
        [
          [
            ["Multiply by the conjugate", "乘以共轭"],
            t(
              `Multiply the top and bottom by $${poly([c, ""], [-d, "i"])}$. The denominator becomes $(${c})^2 + (${d})^2 = ${norm}$.`,
              `分子分母同乘以 $${poly([c, ""], [-d, "i"])}$。分母变为 $(${c})^2 + (${d})^2 = ${norm}$。`,
            ),
          ],
          [
            ["Expand the numerator", "展开分子"],
            t(
              `The real part is $(${a})(${c}) + (${b})(${d}) = ${re}$ and the imaginary part is $(${b})(${c}) - (${a})(${d}) = ${im}$.`,
              `实部是 $(${a})(${c}) + (${b})(${d}) = ${re}$，虚部是 $(${b})(${c}) - (${a})(${d}) = ${im}$。`,
            ),
          ],
          [
            ["Divide", "相除"],
            t(
              `So ${asksReal ? "$x$" : "$y$"} is $\\frac{${asksReal ? re : im}}{${norm}} = ${answer.toLatex()}$.`,
              `所以 ${asksReal ? "$x$" : "$y$"} 是 $\\frac{${asksReal ? re : im}}{${norm}} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$(${poly([c, ""], [d, "i"])})(${poly([c, ""], [-d, "i"])}) = ${norm}$ is real, as the denominator must be.`,
          `$(${poly([c, ""], [d, "i"])})(${poly([c, ""], [-d, "i"])}) = ${norm}$ 是实数，分母理应如此。`,
        ),
      ),
    });
  },
};

const idealGenerator: KnowledgePointDef = {
  id: "the-generator-of-a-sum-or-intersection-of-ideals",
  title: t("The generator of a sum or intersection of ideals", "理想的和或交的生成元"),
  explanation: t(
    "Every ideal of the integers is principal, so the sum and the intersection of two ideals have single generators. The sum $(a) + (b)$ contains all $ax + by$, which by Bezout's identity are exactly the multiples of $\\gcd(a, b)$. The intersection $(a) \\cap (b)$ contains the common multiples, which are the multiples of $\\operatorname{lcm}(a, b)$. It is easy to swap these: a larger ideal has a smaller generator, so the sum belongs with the gcd.\n\nFor $(84) + (126)$, the generator is $\\gcd(84, 126) = 42$, and for $(84) \\cap (126)$ it is $\\operatorname{lcm}(84, 126) = \\frac{84 \\cdot 126}{42} = 252$.\n\nCheck: $(-1) \\cdot 84 + 126 = 42$ lies in the sum, and $252 = 3 \\cdot 84 = 2 \\cdot 126$ lies in both ideals.\n\n> **Watch out.** The sum of ideals is not the ideal of the sum: $(4) + (6) = (2)$, not $(10)$.",
    "整数的每个理想都是主理想，所以两个理想的和与交都有单个生成元。和 $(a) + (b)$ 包含所有 $ax + by$，由贝祖等式，它们恰好是 $\\gcd(a, b)$ 的倍数。交 $(a) \\cap (b)$ 包含公倍数，也就是 $\\operatorname{lcm}(a, b)$ 的倍数。这两者容易弄混：较大的理想有较小的生成元，所以和对应最大公因数。\n\n对 $(84) + (126)$，生成元是 $\\gcd(84, 126) = 42$；对 $(84) \\cap (126)$，生成元是 $\\operatorname{lcm}(84, 126) = \\frac{84 \\cdot 126}{42} = 252$。\n\n检验：$(-1) \\cdot 84 + 126 = 42$ 在和中，$252 = 3 \\cdot 84 = 2 \\cdot 126$ 在两个理想中。\n\n> **注意。** 理想的和不是和的理想：$(4) + (6) = (2)$，而不是 $(10)$。",
  ),
  generate(rng) {
    const a = rng.int(4, 60);
    const b = rng.pick(range(4, 60).filter((v) => v !== a));
    const asksSum = rng.pick([true, false]);
    const g = gcd(a, b);
    const answer = asksSum ? g : lcm(a, b);
    const symbol = asksSum ? "+" : "\\cap";
    return numberProblem({
      prompt: t(
        `In the ring of integers, find the positive generator of the ideal $(${a}) ${symbol} (${b})$.`,
        `在整数环中，求理想 $(${a}) ${symbol} (${b})$ 的正生成元。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          asksSum ? lcm(a, b) : g,
          asksSum
            ? "That generates the intersection; the sum is the larger ideal, so it has the smaller generator."
            : "That generates the sum; the intersection is the smaller ideal, so it has the larger generator.",
          asksSum ? "那是交的生成元；和是较大的理想，所以生成元较小。" : "那是和的生成元；交是较小的理想，所以生成元较大。",
        ),
        why(
          a * b,
          asksSum
            ? `The sum contains ${a} and ${b} themselves, so its generator divides both and cannot be $${a * b}$.`
            : `$${a * b}$ is a common multiple, but $\\frac{${a} \\cdot ${b}}{${g}} = ${lcm(a, b)}$ is a smaller one.`,
          asksSum
            ? `和包含 ${a} 和 ${b} 本身，所以它的生成元同时整除两者，不可能是 $${a * b}$。`
            : `$${a * b}$ 是公倍数，但 $\\frac{${a} \\cdot ${b}}{${g}} = ${lcm(a, b)}$ 更小。`,
        ),
        why(
          a + b,
          `$(${a}) + (${b})$ is the set of all $${a}x + ${b}y$, not the ideal generated by $${a} + ${b}$.`,
          `$(${a}) + (${b})$ 是所有 $${a}x + ${b}y$ 的集合，不是由 $${a} + ${b}$ 生成的理想。`,
        ),
        why(
          Math.abs(a - b) + 1,
          asksSum
            ? `The generator must divide both ${a} and ${b}, and $${Math.abs(a - b) + 1}$ does not.`
            : `The generator must be a multiple of both ${a} and ${b}, and $${Math.abs(a - b) + 1}$ is not.`,
          asksSum
            ? `生成元必须同时整除 ${a} 和 ${b}，而 $${Math.abs(a - b) + 1}$ 不满足。`
            : `生成元必须同时是 ${a} 和 ${b} 的倍数，而 $${Math.abs(a - b) + 1}$ 不满足。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Name the generator", "确定生成元"],
            t(
              asksSum
                ? `The ideal holds all combinations $${a}x + ${b}y$, which are the multiples of $\\gcd(${a}, ${b})$.`
                : `The ideal holds the common multiples of ${a} and ${b}, which are the multiples of $\\operatorname{lcm}(${a}, ${b})$.`,
              asksSum
                ? `这个理想包含所有组合 $${a}x + ${b}y$，它们是 $\\gcd(${a}, ${b})$ 的倍数。`
                : `这个理想包含 ${a} 和 ${b} 的公倍数，它们是 $\\operatorname{lcm}(${a}, ${b})$ 的倍数。`,
            ),
          ],
          [
            ["Compute it", "计算"],
            t(
              asksSum
                ? `$\\gcd(${a}, ${b}) = ${answer}$.`
                : `$\\gcd(${a}, ${b}) = ${g}$, so $\\operatorname{lcm}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{${g}} = ${answer}$.`,
              asksSum
                ? `$\\gcd(${a}, ${b}) = ${answer}$。`
                : `$\\gcd(${a}, ${b}) = ${g}$，所以 $\\operatorname{lcm}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{${g}} = ${answer}$。`,
            ),
          ],
        ],
        asksSum
          ? t(
              `$\\frac{${a}}{${g}} = ${a / g}$ and $\\frac{${b}}{${g}} = ${b / g}$ have no common factor, so no larger divisor is shared.`,
              `$\\frac{${a}}{${g}} = ${a / g}$ 与 $\\frac{${b}}{${g}} = ${b / g}$ 没有公因数，所以没有更大的公因数。`,
            )
          : t(
              `$\\frac{${answer}}{${a}} = ${answer / a}$ and $\\frac{${answer}}{${b}} = ${answer / b}$ have no common factor, so no smaller common multiple exists.`,
              `$\\frac{${answer}}{${a}} = ${answer / a}$ 与 $\\frac{${answer}}{${b}} = ${answer / b}$ 没有公因数，所以没有更小的公倍数。`,
            ),
      ),
    });
  },
};

const kernelIntoProduct: KnowledgePointDef = {
  id: "the-kernel-of-a-map-into-a-product-of-residue-rings",
  title: t("The kernel of a map into a product of residue rings", "到剩余环之积的映射的核"),
  explanation: t(
    "The ring homomorphism from the integers to a product of residue rings sends an integer to its remainders. An integer lies in the kernel when every remainder is zero, so that it is divisible by every modulus. So the kernel is the ideal generated by the least common multiple of the moduli. By the first isomorphism theorem, the image is a copy of the residue ring modulo this number, which need not be the whole product.\n\nFor $\\mathbb{Z} \\to \\mathbb{Z}_{16} \\times \\mathbb{Z}_{20} \\times \\mathbb{Z}_{30}$, the kernel is generated by $\\operatorname{lcm}(16, 20, 30) = 240$, while the product of the moduli is $9600$.\n\nCheck: $\\frac{240}{16} = 15$, $\\frac{240}{20} = 12$ and $\\frac{240}{30} = 8$ are whole numbers.\n\n> **Watch out.** The product of the moduli is the answer only when they are pairwise coprime: for $\\mathbb{Z} \\to \\mathbb{Z}_4 \\times \\mathbb{Z}_6$ the kernel is $(12)$, not $(24)$.",
    "从整数到剩余环之积的环同态把一个整数映到它的余数。整数在核中，当且仅当每个余数都是零，也就是它能被每个模整除。所以核是由各模的最小公倍数生成的理想。由第一同构定理，像同构于模这个数的剩余环，它不一定是整个积。\n\n对 $\\mathbb{Z} \\to \\mathbb{Z}_{16} \\times \\mathbb{Z}_{20} \\times \\mathbb{Z}_{30}$，核由 $\\operatorname{lcm}(16, 20, 30) = 240$ 生成，而各模之积是 $9600$。\n\n检验：$\\frac{240}{16} = 15$，$\\frac{240}{20} = 12$，$\\frac{240}{30} = 8$ 都是整数。\n\n> **注意。** 只有各模两两互素时，答案才是各模之积：对 $\\mathbb{Z} \\to \\mathbb{Z}_4 \\times \\mathbb{Z}_6$，核是 $(12)$，而不是 $(24)$。",
  ),
  generate(rng) {
    const a = rng.int(2, 15);
    const b = rng.pick(range(2, 15).filter((v) => v !== a));
    const c = rng.pick(range(2, 15).filter((v) => v !== a && v !== b));
    const ab = lcm(a, b);
    const answer = lcm(ab, c);
    return numberProblem({
      prompt: t(
        `The homomorphism $\\mathbb{Z} \\to ${Zn(a)} \\times ${Zn(b)} \\times ${Zn(c)}$ sends $x$ to its three remainders. Find the positive generator of its kernel.`,
        `同态 $\\mathbb{Z} \\to ${Zn(a)} \\times ${Zn(b)} \\times ${Zn(c)}$ 把 $x$ 映到它的三个余数。求它的核的正生成元。`,
      ),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          a * b * c,
          "The product of the moduli is a common multiple, but these moduli share factors, so a smaller one exists.",
          "各模之积是公倍数，但这些模有公因数，所以存在更小的公倍数。",
        ),
        why(
          gcd(gcd(a, b), c),
          "A multiple of the gcd need not have zero remainders; the kernel needs multiples of every modulus.",
          "最大公因数的倍数的余数不一定是零；核要求是每个模的倍数。",
        ),
        why(
          a + b + c,
          `The sum of the moduli is not divisible by all of ${a}, ${b} and ${c}.`,
          `各模之和不能同时被 ${a}、${b}、${c} 整除。`,
        ),
        why(ab, `That leaves out the third modulus ${c}, which does not divide $${ab}$.`, `这漏掉了第三个模 ${c}，它不整除 $${ab}$。`),
        why(
          2 * answer,
          `$${2 * answer}$ lies in the kernel, but so does $${answer}$, which generates a larger ideal.`,
          `$${2 * answer}$ 在核中，但 $${answer}$ 也在核中，它生成更大的理想。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Describe the kernel", "描述核"],
            t(
              `An integer lies in the kernel when ${a}, ${b} and ${c} all divide it, so the generator is their least common multiple.`,
              `整数在核中，当且仅当 ${a}、${b}、${c} 都整除它，所以生成元是它们的最小公倍数。`,
            ),
          ],
          [
            ["Compute the lcm", "计算最小公倍数"],
            t(
              `$\\operatorname{lcm}(${a}, ${b}) = ${ab}$, and $\\operatorname{lcm}(${ab}, ${c}) = ${answer}$.`,
              `$\\operatorname{lcm}(${a}, ${b}) = ${ab}$，$\\operatorname{lcm}(${ab}, ${c}) = ${answer}$。`,
            ),
          ],
        ],
        t(
          `$\\frac{${answer}}{${a}} = ${answer / a}$, $\\frac{${answer}}{${b}} = ${answer / b}$ and $\\frac{${answer}}{${c}} = ${answer / c}$ are whole numbers.`,
          `$\\frac{${answer}}{${a}} = ${answer / a}$，$\\frac{${answer}}{${b}} = ${answer / b}$，$\\frac{${answer}}{${c}} = ${answer / c}$ 都是整数。`,
        ),
      ),
    });
  },
};

const primeIdealsOfProduct: KnowledgePointDef = {
  id: "counting-prime-ideals-of-a-product-of-residue-rings",
  title: t("Counting prime ideals of a product of residue rings", "计算剩余环之积的素理想"),
  explanation: t(
    "Every ideal of a product of two rings $R \\times S$ has the form $I \\times J$, and it is prime exactly when one factor is the whole ring and the other is prime. So the prime ideals of $R \\times S$ come from those of $R$ and those of $S$ separately, and the counts add. For $\\mathbb{Z}_n$, the prime ideals correspond to the prime divisors of $n$. A prime dividing both moduli counts once for each factor.\n\nIn $\\mathbb{Z}_4 \\times \\mathbb{Z}_5$, the factor $\\mathbb{Z}_4$ has one prime ideal, $(2)$, and $\\mathbb{Z}_5$ has one, $(0)$. So the prime ideals are $(2) \\times \\mathbb{Z}_5$ and $\\mathbb{Z}_4 \\times (0)$, two in all.\n\nCheck: the quotients by these ideals are $\\mathbb{Z}_2$ and $\\mathbb{Z}_5$, both fields.\n\n> **Watch out.** A shared prime is not merged: $\\mathbb{Z}_6 \\times \\mathbb{Z}_{10}$ has $2 + 2 = 4$ prime ideals, although $\\operatorname{lcm}(6, 10) = 30$ has only $3$ prime divisors.",
    "两个环之积 $R \\times S$ 的每个理想都形如 $I \\times J$，它是素理想当且仅当一个因子是整个环，另一个是素理想。所以 $R \\times S$ 的素理想分别来自 $R$ 和 $S$ 的素理想，个数相加。对 $\\mathbb{Z}_n$，素理想对应 $n$ 的素因数。同时整除两个模的素数在每个因子中各算一次。\n\n在 $\\mathbb{Z}_4 \\times \\mathbb{Z}_5$ 中，因子 $\\mathbb{Z}_4$ 有一个素理想 $(2)$，$\\mathbb{Z}_5$ 有一个素理想 $(0)$。所以素理想是 $(2) \\times \\mathbb{Z}_5$ 和 $\\mathbb{Z}_4 \\times (0)$，共两个。\n\n检验：对这两个理想的商环分别是 $\\mathbb{Z}_2$ 和 $\\mathbb{Z}_5$，都是域。\n\n> **注意。** 公共的素数不合并：$\\mathbb{Z}_6 \\times \\mathbb{Z}_{10}$ 有 $2 + 2 = 4$ 个素理想，尽管 $\\operatorname{lcm}(6, 10) = 30$ 只有 $3$ 个素因数。",
  ),
  generate(rng) {
    const m = rng.int(6, 120);
    const n = rng.int(6, 120);
    const left = primes(m);
    const right = primes(n);
    const answer = left.length + right.length;
    return numberProblem({
      prompt: t(`How many prime ideals does the ring $${Zn(m)} \\times ${Zn(n)}$ have?`, `环 $${Zn(m)} \\times ${Zn(n)}$ 有多少个素理想？`),
      answer,
      form: "integer",
      mistakes: apart(answer, [
        why(
          primes(lcm(m, n)).length,
          "A prime dividing both moduli gives one prime ideal in each factor, so it counts twice.",
          "同时整除两个模的素数在每个因子中各给出一个素理想，所以算两次。",
        ),
        why(
          left.length * right.length,
          "A prime ideal is prime in one factor and whole in the other, so the counts add rather than multiply.",
          "素理想在一个因子中是素理想，在另一个因子中是整个环，所以个数相加，而不是相乘。",
        ),
        why(
          divisors(m).length + divisors(n).length,
          "That counts divisors, which match all ideals of a factor, not only the prime ones.",
          "这数的是因数，它们对应因子的所有理想，而不只是素理想。",
        ),
        why(answer + 1, "The whole ring is never a prime ideal.", "整个环从来不是素理想。"),
        why(
          answer + 2,
          "Neither the whole ring nor the zero ideal is prime here: $(1, 0)(0, 1) = (0, 0)$, with neither factor zero.",
          "这里整个环和零理想都不是素理想：$(1, 0)(0, 1) = (0, 0)$，而两个因子都不为零。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Describe the prime ideals", "描述素理想"],
            t(
              "A prime ideal is a prime ideal of one factor times the whole of the other.",
              "素理想是一个因子的素理想乘以另一个因子的整个环。",
            ),
          ],
          [
            ["Count the primes", "数素数"],
            t(
              `The prime divisors are ${left.join(", ")} for ${m} and ${right.join(", ")} for ${n}, which gives $${left.length} + ${right.length} = ${answer}$.`,
              `${m} 的素因数是 ${left.join("、")}，${n} 的素因数是 ${right.join("、")}，所以是 $${left.length} + ${right.length} = ${answer}$。`,
            ),
          ],
        ],
        t(
          "The quotient by each such ideal is $\\mathbb{Z}_p$ for its prime $p$, which is a field.",
          "对每个这样的理想，商环是对应素数 $p$ 的 $\\mathbb{Z}_p$，它是域。",
        ),
      ),
    });
  },
};

/** deeperAbstractAlgebraPoints gives, by topic id, the knowledge points added after an Abstract Algebra topic's own. */
export const deeperAbstractAlgebraPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "associative-binary-operations": [associativityParameter],
  "function-groups": [orderOfAnAffineMap],
  "orders-of-group-elements": [orderOfAPower],
  "abelian-groups": [productOfCoprimeOrders],
  "cyclic-subgroups-in-the-complex-plane": [rootsTogether],
  "generating-sets": [smallestGeneratingSet],
  "free-groups": [reducedWords],
  "the-order-of-a-permutation": [smallestSymmetricGroup],
  "the-alternating-group-on-n-symbols": [evenPartOfACyclicGroup],
  "dihedral-group": [dihedralSubgroups],
  "finitely-generated-abelian-groups": [largestOrderInAProduct],
  "free-abelian-groups": [latticeSubgroups],
  "normal-subgroups": [dihedralNormalSubgroups],
  "lagranges-theorem": [largestIntersection],
  "group-homomorphisms": [surjectiveHomomorphisms],
  "group-isomorphisms": [automorphismCount],
  stabilizers: [setStabilizer],
  "p-groups": [subgroupsOfPrimeOrder],
  "the-second-sylow-theorem": [elementsOfPrimeOrder],
  "integral-domains": [nilpotentCount],
  "rings-with-unity": [idempotentCount],
  "introduction-to-fields": [wilson],
  ideals: [ideaOfProductIdeals],
  "polynomial-quotient-rings": [unitsOfAQuadraticQuotient],
  "rings-of-polynomials": [countingPolynomials],
  "units-in-polynomial-rings": [linearUnits],
  "irreducible-polynomials-over-the-integers-and-rational-numbers": [cyclotomicFactors],
  "the-division-ring-of-quaternions": [squareOfAPureQuaternion],
  "inverting-quaternions": [normOfAProduct],
  "linear-independence-in-abstract-vector-spaces": [dependentPolynomials],
  "introduction-to-binary-operations": [associativityDefect],
  "commutative-binary-operations": [commutingPairs],
  "identities-of-binary-operations": [shiftedIdentity],
  "inverses-under-binary-operations": [noInverse],
  "matrix-groups": [triangularInverse],
  "general-groups": [orderFromTwoPowers],
  "the-order-of-a-group": [orderOfProductWithUnits],
  "computing-inverses-of-elements-in-zn": [inverseOfSquare],
  "properties-of-subgroups": [productSetSize],
  "finite-cyclic-groups": [annihilatedElements],
  "cyclic-subgroups": [subgroupOfGivenOrder],
  "generators-of-cyclic-groups": [sumOfGenerators],
  "universal-property-of-free-groups": [surjectionsFromFree],
  "presentations-of-groups": [twoRelationsOnOneGenerator],
  "cyclic-direct-product-groups": [generatorsOfProduct],
  "torsion-groups": [torsionOrder],
  "the-center-of-a-group": [centerOfProduct],
  "conjugation-and-conjugacy-classes": [centralizerFromClass],
  "the-kernel-of-a-group-homomorphism": [smallestKernel],
  "the-third-sylow-theorem": [orderPElements],
  "cycle-types-of-permutations": [orderFromCycleType],
  "quotient-rings": [polynomialQuotientSize],
  "vector-spaces-over-finite-fields": [solutionSpaceSize],
  "introduction-to-abstract-vector-spaces": [productDimension],
  "bases-in-abstract-vector-spaces": [shiftedBasisCoordinate],
  "subspaces-of-abstract-vector-spaces": [matrixSubspaceDimension],
  "introduction-to-groups": [powerUnderShiftedSum],
  "real-rational-and-complex-groups": [powerOfOnePlusI],
  "subgroups-of-matrix-groups": [triangularGroupSize],
  "subgroups-of-function-groups": [affineGroupSize],
  "cyclic-groups": [smallestPrimitiveRoot],
  "properties-of-cyclic-groups": [sumOfOrders],
  "the-order-of-a-cycle": [cyclesInPower],
  transpositions: [inversionsCount],
  "the-inverse-of-a-permutation": [involutionsWithSwaps],
  "the-symmetric-group-on-n-symbols": [permutationsOfCycleType],
  "the-symmetry-group-of-a-figure": [prismSymmetries],
  "external-direct-products": [elementsOfOrderInProduct],
  "cosets-of-the-multiplicative-groups-of-integers-modulo-n": [smallestInCoset],
  "quotient-groups": [subgroupsOfQuotient],
  "group-actions": [orbitsOfNegation],
  "burnsides-lemma": [gridColorings],
  "the-first-sylow-theorem": [sylowOfSymmetric],
  "the-units-of-a-ring": [triangularUnits],
  "the-field-of-quotients-of-an-integral-domain": [gaussianFraction],
  "generating-elements-of-principal-ideal-rings": [idealGenerator],
  "the-image-and-kernel-of-a-ring-homomorphism": [kernelIntoProduct],
  "prime-ideals-and-maximal-ideals": [primeIdealsOfProduct],
};
