// Further knowledge points for topics of Abstract Algebra, each a skill the topic's own
// points leave out. See `deeperAbstractAlgebraPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";

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

const largestIntersection: KnowledgePointDef = {
  id: "the-largest-possible-intersection-of-two-subgroups",
  title: t("The largest possible intersection of two subgroups", "两个子群交集的最大可能阶"),
  explanation: t(
    "The intersection of two subgroups is a subgroup of each. So by Lagrange's theorem its order divides both of their orders, and therefore divides their greatest common divisor. Inside a cyclic group this bound is reached. In particular, two subgroups whose orders are coprime share only the identity element.",
    "两个子群的交集是它们各自的子群。所以由拉格朗日定理，它的阶同时整除两个子群的阶，因而整除它们的最大公因数。在循环群中这个上界可以达到。特别地，阶互素的两个子群只有单位元这一个公共元素。",
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
      wrong: [Math.min(a, b), lcm(a, b), 1],
      solution: t(
        `The order of $H \\cap K$ divides both ${a} and ${b}, so it divides $\\gcd(${a}, ${b}) = ${g}$. In a cyclic group of order ${lcm(a, b)}, the subgroups of these orders meet in a subgroup of order exactly ${g}.`,
        `$H \\cap K$ 的阶同时整除 ${a} 和 ${b}，所以整除 $\\gcd(${a}, ${b}) = ${g}$。在 ${lcm(a, b)} 阶循环群中，这两个阶的子群的交集恰好是 ${g} 阶子群。`,
      ),
    });
  },
};

const orderOfAPower: KnowledgePointDef = {
  id: "the-order-of-a-power-of-an-element",
  title: t("The order of a power of an element", "元素的幂的阶"),
  explanation: t(
    "If $g$ has order $n$, then $(g^k)^m$ is the identity exactly when $n$ divides $km$. The smallest such $m$ is $\\frac{n}{\\gcd(n, k)}$, which is the order of $g^k$. This holds in every group, and it depends only on $n$ and $k$, not on which group $g$ belongs to.",
    "如果 $g$ 的阶是 $n$，那么 $(g^k)^m$ 是单位元，当且仅当 $n$ 整除 $km$。这样的最小 $m$ 是 $\\frac{n}{\\gcd(n, k)}$，它就是 $g^k$ 的阶。这在任何群中都成立，而且只取决于 $n$ 和 $k$，与 $g$ 属于哪个群无关。",
  ),
  generate(rng) {
    const n = rng.pick([12, 18, 20, 24, 30, 36, 40, 42, 48, 60, 72, 84, 90, 100, 120]);
    const k = rng.pick(range(2, n - 1).filter((i) => gcd(n, i) > 1));
    const g = gcd(n, k);
    return numberProblem({
      prompt: t(
        `An element $g$ of a group has order ${n}. What is the order of $g^{${k}}$?`,
        `群中元素 $g$ 的阶是 ${n}。$g^{${k}}$ 的阶是多少？`,
      ),
      answer: n / g,
      form: "integer",
      wrong: [n, g, k],
      solution: t(
        `Since $\\gcd(${n}, ${k}) = ${g}$, the order is $\\frac{${n}}{${g}} = ${n / g}$.`,
        `由于 $\\gcd(${n}, ${k}) = ${g}$，阶是 $\\frac{${n}}{${g}} = ${n / g}$。`,
      ),
    });
  },
};

const productOfCoprimeOrders: KnowledgePointDef = {
  id: "the-order-of-a-product-in-an-abelian-group",
  title: t("The order of a product in an abelian group", "交换群中乘积的阶"),
  explanation: t(
    "In an abelian group, $(ab)^k = a^kb^k$. If the orders of $a$ and $b$ are coprime, then $a^kb^k$ can be the identity only when both factors are, since $\\langle a \\rangle$ and $\\langle b \\rangle$ share only the identity. So the order of $ab$ is the product of the two orders. Without commutativity this fails.",
    "在交换群中，$(ab)^k = a^kb^k$。如果 $a$ 和 $b$ 的阶互素，那么由于 $\\langle a \\rangle$ 和 $\\langle b \\rangle$ 只有单位元这一个公共元素，$a^kb^k$ 是单位元时两个因子都必须是单位元。所以 $ab$ 的阶是两个阶的乘积。没有交换性时这个结论不成立。",
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
      wrong: [m + n, n, 1],
      solution: t(
        `The orders ${m} and ${n} are coprime, so the order of $ab$ is their product, ${m * n}.`,
        `${m} 和 ${n} 互素，所以 $ab$ 的阶是它们的乘积 ${m * n}。`,
      ),
    });
  },
};

const rootsTogether: KnowledgePointDef = {
  id: "the-subgroup-generated-by-two-roots-of-unity",
  title: t("The subgroup generated by two roots of unity", "两个单位根生成的子群"),
  explanation: t(
    "The roots of unity of a given order form a cyclic group. Two primitive roots, of orders $m$ and $n$, both lie among the roots of order $\\operatorname{lcm}(m, n)$, and together they generate all of these. So the subgroup they generate has $\\operatorname{lcm}(m, n)$ elements, which are evenly spaced on the unit circle.",
    "给定次数的单位根构成循环群。阶为 $m$ 和 $n$ 的两个本原单位根，都在 $\\operatorname{lcm}(m, n)$ 次单位根之中，而且它们合起来能生成所有这些单位根。所以它们生成的子群有 $\\operatorname{lcm}(m, n)$ 个元素，这些元素在单位圆上均匀分布。",
  ),
  generate(rng) {
    const m = rng.int(2, 24);
    const n = rng.pick(range(2, 24).filter((i) => i !== m));
    return numberProblem({
      prompt: t(
        `How many elements has the subgroup of $\\mathbb{C}^\\times$ generated by $e^{2\\pi i/${m}}$ and $e^{2\\pi i/${n}}$?`,
        `$\\mathbb{C}^\\times$ 中由 $e^{2\\pi i/${m}}$ 和 $e^{2\\pi i/${n}}$ 生成的子群有多少个元素？`,
      ),
      answer: lcm(m, n),
      form: "integer",
      wrong: [m * n, m + n, Math.max(m, n)],
      solution: t(
        `The generators have orders ${m} and ${n}, and they generate exactly the roots of unity of order $\\operatorname{lcm}(${m}, ${n}) = ${lcm(m, n)}$.`,
        `两个生成元的阶是 ${m} 和 ${n}，它们恰好生成所有 $\\operatorname{lcm}(${m}, ${n}) = ${lcm(m, n)}$ 次单位根。`,
      ),
    });
  },
};

const smallestGeneratingSet: KnowledgePointDef = {
  id: "the-smallest-generating-set-of-a-product-of-cyclic-groups",
  title: t("The smallest generating set of a product of cyclic groups", "循环群之积的最小生成集"),
  explanation: t(
    "Each factor of a product of cyclic groups splits into cyclic groups of prime power order. For one prime, the part with $c$ nontrivial factors needs exactly $c$ generators. Different primes do not compete, since their parts can share generators. So the smallest generating set has as many elements as the largest number of factors that one prime divides.",
    "循环群之积的每个因子都能分解成素数幂阶的循环群。对一个素数，有 $c$ 个非平凡因子的部分恰好需要 $c$ 个生成元。不同素数互不冲突，它们的部分可以共用生成元。所以最小生成集的元素个数，等于同一个素数最多整除的因子个数。",
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
      wrong: [1, 2, 3],
      solution:
        answer === 1
          ? t(
              `No prime divides two of ${a}, ${b}, ${c}, so the product is cyclic and one generator is enough.`,
              `没有素数同时整除 ${a}、${b}、${c} 中的两个，所以这个积是循环群，一个生成元就够了。`,
            )
          : t(
              `The prime ${p} divides ${answer} of the orders, and no prime divides more. So ${answer} generators are needed, and the Chinese remainder theorem shows that ${answer} are enough.`,
              `素数 ${p} 整除其中 ${answer} 个阶，没有素数整除更多。所以需要 ${answer} 个生成元，而中国剩余定理说明 ${answer} 个就够了。`,
            ),
    });
  },
};

const reducedWords: KnowledgePointDef = {
  id: "counting-reduced-words-of-a-given-length",
  title: t("Counting reduced words of a given length", "数给定长度的既约字"),
  explanation: t(
    "A reduced word in a free group on $k$ generators never has a letter next to its own inverse. Its first letter can be any of the $2k$ generators and inverses. Every later letter can be anything except the inverse of the letter before it, which leaves $2k - 1$ choices. Multiplying these choices counts the elements of each length.",
    "$k$ 个生成元的自由群中，既约字里不会有字母紧挨着自己的逆。第一个字母可以是 $2k$ 个生成元和逆中的任何一个。之后每个字母只要不是前一个字母的逆就行，还有 $2k - 1$ 种选择。把这些选择相乘，就数出了每种长度的元素个数。",
  ),
  generate(rng) {
    const k = rng.int(2, 8);
    const n = rng.int(2, 6);
    const answer = 2 * k * (2 * k - 1) ** (n - 1);
    return numberProblem({
      prompt: t(
        `How many reduced words of length ${n} does the free group on ${k} generators have?`,
        `${k} 个生成元的自由群有多少个长度为 ${n} 的既约字？`,
      ),
      answer,
      form: "integer",
      wrong: [(2 * k) ** n, k ** n, (2 * k - 1) ** n],
      solution: t(
        `There are $${2 * k}$ choices for the first letter and $${2 * k - 1}$ for ${n === 2 ? "the second letter" : `each of the other ${n - 1} letters`}, which makes $${2 * k} \\cdot ${2 * k - 1}${n === 2 ? "" : `^{${n - 1}}`} = ${answer}$.`,
        `第一个字母有 $${2 * k}$ 种选择，${n === 2 ? "第二个字母有" : `其余 ${n - 1} 个字母各有`} $${2 * k - 1}$ 种选择，共 $${2 * k} \\cdot ${2 * k - 1}${n === 2 ? "" : `^{${n - 1}}`} = ${answer}$ 个。`,
      ),
    });
  },
};

const smallestSymmetricGroup: KnowledgePointDef = {
  id: "the-smallest-symmetric-group-with-an-element-of-a-given-order",
  title: t("The smallest symmetric group with an element of a given order", "含给定阶元素的最小对称群"),
  explanation: t(
    "The order of a permutation is the least common multiple of its cycle lengths. To reach a given order with as few symbols as possible, use one cycle for each prime power in the factorization, because splitting a composite length into coprime parts never uses more symbols. So the smallest number of symbols is the sum of those prime powers.",
    "置换的阶是各循环长度的最小公倍数。要用尽量少的符号达到给定的阶，就让分解式中的每个素数幂各对应一个循环，因为把合数长度拆成互素的部分不会用更多符号。所以最少的符号数就是这些素数幂之和。",
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
      wrong: [order, smallPrimes, Math.max(...parts)],
      solution: t(
        `Since $${order} = ${parts.join(" \\cdot ")}$, the cheapest choice is disjoint cycles of lengths ${parts.join(", ")}, which use $${parts.join(" + ")} = ${answer}$ symbols.`,
        `由于 $${order} = ${parts.join(" \\cdot ")}$，最省的选择是长度为 ${parts.join("、")} 的不相交循环，共用 $${parts.join(" + ")} = ${answer}$ 个符号。`,
      ),
    });
  },
};

const evenPartOfACyclicGroup: KnowledgePointDef = {
  id: "the-even-permutations-in-a-cyclic-subgroup",
  title: t("The even permutations in a cyclic subgroup", "循环子群中的偶置换"),
  explanation: t(
    "A cycle of length $\\ell$ is a product of $\\ell - 1$ transpositions, which gives the parity of any permutation. If a generator is even, all of its powers are even. If it is odd, the even and odd powers alternate, so exactly half of the subgroup lies in $A_n$. A subgroup is therefore either inside $A_n$ or half inside it.",
    "长度为 $\\ell$ 的循环是 $\\ell - 1$ 个对换之积，由此可得任何置换的奇偶性。如果生成元是偶置换，它的所有幂都是偶置换。如果它是奇置换，偶次幂和奇次幂交替出现，所以子群恰好有一半在 $A_n$ 中。因此子群要么全在 $A_n$ 中，要么恰有一半在其中。",
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
      wrong: [odd || order % 2 === 1 ? order : order / 2, a * b, 2 * order],
      solution: odd
        ? t(
            `$\\sigma$ has order ${order}, and it is a product of $${a - 1} + ${b - 1} = ${a + b - 2}$ transpositions, which is odd. So only half of its powers are even, which gives ${answer}.`,
            `$\\sigma$ 的阶是 ${order}，它是 $${a - 1} + ${b - 1} = ${a + b - 2}$ 个对换之积，这是奇置换。所以只有一半的幂是偶置换，得 ${answer}。`,
          )
        : t(
            `$\\sigma$ has order ${order}, and it is a product of $${a - 1} + ${b - 1} = ${a + b - 2}$ transpositions, which is even. So all of its powers are even, which gives ${answer}.`,
            `$\\sigma$ 的阶是 ${order}，它是 $${a - 1} + ${b - 1} = ${a + b - 2}$ 个对换之积，这是偶置换。所以它的所有幂都是偶置换，得 ${answer}。`,
          ),
    });
  },
};

const dihedralSubgroups: KnowledgePointDef = {
  id: "counting-the-subgroups-of-a-dihedral-group",
  title: t("Counting the subgroups of a dihedral group", "数二面体群的子群"),
  explanation: t(
    "A subgroup of $D_n$ either contains only rotations or also contains reflections. The rotations form a cyclic group, with one subgroup for each divisor of $n$. A subgroup with reflections is fixed by its rotation part, of index $d$ in the rotations, together with one of $d$ families of reflections. So there are $\\sigma(n)$ of these, the sum of the divisors.",
    "$D_n$ 的子群要么只含旋转，要么还含反射。旋转构成循环群，$n$ 的每个因数对应一个子群。含反射的子群由它的旋转部分（在旋转群中指数为 $d$）和 $d$ 族反射之一确定。所以这样的子群有 $\\sigma(n)$ 个，即因数之和。",
  ),
  generate(rng) {
    const n = rng.int(3, 40);
    const list = divisors(n);
    const tau = list.length;
    const sigma = sum(list);
    return numberProblem({
      prompt: t(
        `How many subgroups does the dihedral group of symmetries of a regular ${n}-gon have, counting the trivial subgroup and the whole group?`,
        `正 ${n} 边形的二面体对称群有多少个子群（包括平凡子群和整个群）？`,
      ),
      answer: tau + sigma,
      form: "integer",
      wrong: [tau, sigma, tau + 1],
      solution: t(
        `The divisors of ${n} are ${list.join(", ")}. There are ${tau} subgroups of rotations, one per divisor, and $${list.join(" + ")} = ${sigma}$ subgroups containing reflections, which makes ${tau + sigma}.`,
        `${n} 的因数是 ${list.join("、")}。只含旋转的子群有 ${tau} 个，每个因数对应一个；含反射的子群有 $${list.join(" + ")} = ${sigma}$ 个；共 ${tau + sigma} 个。`,
      ),
    });
  },
};

const largestOrderInAProduct: KnowledgePointDef = {
  id: "the-largest-order-of-an-element-of-a-product",
  title: t("The largest order of an element of a product", "直积中元素的最大阶"),
  explanation: t(
    "An element of a product of cyclic groups has as its order the least common multiple of the orders of its components. That is largest when each component is a generator, which gives the least common multiple of all the factors' orders. In a finite abelian group, every element's order divides this largest order.",
    "循环群之积中元素的阶，是各分量阶的最小公倍数。当每个分量都是生成元时它最大，这时得到所有因子阶的最小公倍数。在有限交换群中，每个元素的阶都整除这个最大阶。",
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
      wrong: [a * b * c, Math.max(a, b, c), a + b + c],
      solution: t(
        `Taking a generator in each factor gives the largest order, $\\operatorname{lcm}(${a}, ${b}, ${c}) = ${answer}$.`,
        `每个因子都取生成元时阶最大，即 $\\operatorname{lcm}(${a}, ${b}, ${c}) = ${answer}$。`,
      ),
    });
  },
};

const latticeSubgroups: KnowledgePointDef = {
  id: "counting-subgroups-of-a-given-index-in-z2",
  title: t("Counting subgroups of a given index in $\\mathbb{Z}^2$", "数 $\\mathbb{Z}^2$ 中给定指数的子群"),
  explanation: t(
    "Every subgroup of index $n$ in $\\mathbb{Z}^2$ has a unique basis of the form $(a, b)$, $(0, d)$ with $ad = n$ and $0 \\le b < d$. This is the integer form of row reduction. Each divisor $d$ of $n$ allows $d$ values of $b$. So the number of such subgroups is the sum of the divisors of $n$.",
    "$\\mathbb{Z}^2$ 中指数为 $n$ 的子群都有唯一的形如 $(a, b)$、$(0, d)$ 的基，其中 $ad = n$，$0 \\le b < d$。这就是整数上的行化简。$n$ 的每个因数 $d$ 允许 $b$ 取 $d$ 个值。所以这样的子群个数是 $n$ 的因数之和。",
  ),
  generate(rng) {
    const n = rng.int(2, 60);
    const list = divisors(n);
    const answer = sum(list);
    return numberProblem({
      prompt: t(`How many subgroups of index ${n} does $\\mathbb{Z}^2$ have?`, `$\\mathbb{Z}^2$ 有多少个指数为 ${n} 的子群？`),
      answer,
      form: "integer",
      wrong: [list.length, n, n * n],
      solution: t(
        `Each divisor $d$ of ${n} gives $d$ subgroups, so the count is $${list.join(" + ")} = ${answer}$.`,
        `${n} 的每个因数 $d$ 给出 $d$ 个子群，所以个数是 $${list.join(" + ")} = ${answer}$。`,
      ),
    });
  },
};

const dihedralNormalSubgroups: KnowledgePointDef = {
  id: "counting-the-normal-subgroups-of-a-dihedral-group",
  title: t("Counting the normal subgroups of a dihedral group", "数二面体群的正规子群"),
  explanation: t(
    "In $D_n$ with $n \\ge 3$, every subgroup of rotations is normal, because conjugating a rotation gives a power of it. A normal subgroup containing a reflection must contain all of its conjugates. For odd $n$ that forces the whole group. For even $n$ the reflections form two classes, which adds two subgroups of index 2.",
    "在 $n \\ge 3$ 的 $D_n$ 中，旋转构成的子群都是正规的，因为旋转的共轭仍是它的幂。含反射的正规子群必须含这个反射的所有共轭。$n$ 为奇数时这就迫使它是整个群。$n$ 为偶数时反射分成两个共轭类，于是多出两个指数为 2 的子群。",
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
      wrong: [tau, even ? tau + 1 : tau + 3, tau + sum(divisors(n))],
      solution: even
        ? t(
            `${n} has ${tau} divisors, which give ${tau} subgroups of rotations. Since ${n} is even, the whole group and two subgroups of index 2 are also normal, which makes ${answer}.`,
            `${n} 有 ${tau} 个因数，给出 ${tau} 个旋转子群。由于 ${n} 是偶数，整个群和两个指数为 2 的子群也是正规的，共 ${answer} 个。`,
          )
        : t(
            `${n} has ${tau} divisors, which give ${tau} subgroups of rotations. Since ${n} is odd, the only other normal subgroup is the whole group, which makes ${answer}.`,
            `${n} 有 ${tau} 个因数，给出 ${tau} 个旋转子群。由于 ${n} 是奇数，其余的正规子群只有整个群，共 ${answer} 个。`,
          ),
    });
  },
};

const surjectiveHomomorphisms: KnowledgePointDef = {
  id: "counting-surjective-homomorphisms-between-cyclic-groups",
  title: t("Counting surjective homomorphisms between cyclic groups", "数循环群之间的满同态"),
  explanation: t(
    "A homomorphism out of a cyclic group is fixed by the image of a generator. When $n$ divides $m$, any element of $\\mathbb{Z}_n$ can be that image. The homomorphism is surjective exactly when the image generates $\\mathbb{Z}_n$, and there are $\\varphi(n)$ generators. The size of $m$ does not matter beyond being a multiple of $n$.",
    "循环群出发的同态由生成元的像确定。当 $n$ 整除 $m$ 时，$\\mathbb{Z}_n$ 的任何元素都可以作这个像。同态是满射，当且仅当这个像生成 $\\mathbb{Z}_n$，而生成元有 $\\varphi(n)$ 个。$m$ 的大小除了是 $n$ 的倍数以外没有影响。",
  ),
  generate(rng) {
    const n = rng.int(3, 20);
    const m = n * rng.int(2, 9);
    const answer = totient(n);
    return numberProblem({
      prompt: t(
        `How many surjective homomorphisms are there from $${Zn(m)}$ to $${Zn(n)}$?`,
        `从 $${Zn(m)}$ 到 $${Zn(n)}$ 的满同态有多少个？`,
      ),
      answer,
      form: "integer",
      wrong: [n, totient(m), m],
      solution: t(
        `The image of 1 must be a generator of $${Zn(n)}$, and any generator works because ${n} divides ${m}. There are $\\varphi(${n}) = ${answer}$ of them.`,
        `1 的像必须是 $${Zn(n)}$ 的生成元，由于 ${n} 整除 ${m}，任何生成元都可以。共有 $\\varphi(${n}) = ${answer}$ 个。`,
      ),
    });
  },
};

const automorphismCount: KnowledgePointDef = {
  id: "counting-automorphisms-of-a-cyclic-group",
  title: t("Counting automorphisms of a cyclic group", "数循环群的自同构"),
  explanation: t(
    "An automorphism of a cyclic group sends a generator to a generator, and each choice of generator gives exactly one automorphism. So $\\mathbb{Z}_n$ has $\\varphi(n)$ automorphisms. A product of cyclic groups of coprime orders is itself cyclic, by the Chinese remainder theorem, so the same count applies to the order of the whole product.",
    "循环群的自同构把生成元映到生成元，每种选择恰好给出一个自同构。所以 $\\mathbb{Z}_n$ 有 $\\varphi(n)$ 个自同构。由中国剩余定理，阶互素的循环群之积本身是循环群，所以同样的计数适用于整个积的阶。",
  ),
  generate(rng) {
    const [m, n] = rng.pick(
      range(2, 16)
        .flatMap((i) => range(i + 1, 17).map((j) => [i, j] as const))
        .filter(([i, j]) => gcd(i, j) === 1),
    );
    const answer = totient(m * n);
    return numberProblem({
      prompt: t(`How many automorphisms does $${Zn(m)} \\times ${Zn(n)}$ have?`, `$${Zn(m)} \\times ${Zn(n)}$ 有多少个自同构？`),
      answer,
      form: "integer",
      wrong: [m * n, totient(m) + totient(n), m * n - 1],
      solution: t(
        `Since ${m} and ${n} are coprime, the group is cyclic of order ${m * n}. It has $\\varphi(${m * n}) = \\varphi(${m})\\varphi(${n}) = ${answer}$ automorphisms.`,
        `由于 ${m} 和 ${n} 互素，这个群是 ${m * n} 阶循环群。它有 $\\varphi(${m * n}) = \\varphi(${m})\\varphi(${n}) = ${answer}$ 个自同构。`,
      ),
    });
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
    "If a prime $p$ divides the order of a group only once, each Sylow $p$-subgroup is cyclic of order $p$. Two different such subgroups meet only in the identity, and every element of order $p$ lies in exactly one. So $s$ Sylow subgroups give $s(p - 1)$ elements of order $p$. This counting often leaves too little room for other subgroups.",
    "如果素数 $p$ 只整除群的阶一次，每个西罗 $p$ 子群都是 $p$ 阶循环群。两个不同的这种子群只有单位元这一个公共元素，每个 $p$ 阶元素恰在其中一个子群里。所以 $s$ 个西罗子群给出 $s(p - 1)$ 个 $p$ 阶元素。这种计数常常说明其他子群已没有足够的位置。",
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
      wrong: [q, p * q, answer + 1],
      solution: t(
        `Since ${p} divides ${p * q * r} only once, each Sylow subgroup has order ${p}, and each holds $${p} - 1 = ${p - 1}$ of the elements of order ${p}, none of them shared. That makes $${q} \\cdot ${p - 1} = ${answer}$.`,
        `由于 ${p} 只整除 ${p * q * r} 一次，每个西罗子群的阶都是 ${p}，各含 $${p} - 1 = ${p - 1}$ 个 ${p} 阶元素，互不重复。共 $${q} \\cdot ${p - 1} = ${answer}$ 个。`,
      ),
    });
  },
};

const subgroupsOfPrimeOrder: KnowledgePointDef = {
  id: "counting-subgroups-of-prime-order-in-an-abelian-p-group",
  title: t("Counting subgroups of prime order in an abelian p-group", "数交换 p 群中的素数阶子群"),
  explanation: t(
    "In a product of $k$ nontrivial cyclic $p$-groups, each factor has a unique subgroup of order $p$, whatever its size. So the elements with $x^p = e$ form a group of order $p^k$, which leaves $p^k - 1$ elements of order $p$. Each subgroup of order $p$ contains $p - 1$ of them, so dividing counts the subgroups.",
    "在 $k$ 个非平凡循环 $p$ 群之积中，每个因子无论多大，都恰有一个 $p$ 阶子群。所以满足 $x^p = e$ 的元素构成 $p^k$ 阶群，其中有 $p^k - 1$ 个 $p$ 阶元素。每个 $p$ 阶子群含其中 $p - 1$ 个，相除就得到子群个数。",
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
      wrong: [p === 2 ? p ** k : elements, k, p ** k + 1],
      solution: t(
        `There are ${k} factors, so there are $${p}^{${k}} - 1 = ${elements}$ elements of order ${p}. Each subgroup holds $${p - 1}$ of them, which gives ${answer} subgroups.`,
        `共有 ${k} 个因子，所以有 $${p}^{${k}} - 1 = ${elements}$ 个 ${p} 阶元素。每个子群含其中 $${p - 1}$ 个，得 ${answer} 个子群。`,
      ),
    });
  },
};

const nilpotentCount: KnowledgePointDef = {
  id: "counting-nilpotent-elements-of-zn",
  title: t("Counting nilpotent elements of $\\mathbb{Z}_n$", "数 $\\mathbb{Z}_n$ 的幂零元"),
  explanation: t(
    "An element is nilpotent if some power of it is zero. An integral domain has no nonzero nilpotents, but $\\mathbb{Z}_n$ can. A power of $a$ is divisible by $n$ exactly when every prime dividing $n$ divides $a$. So the nilpotents are the multiples of the product of the distinct primes of $n$.",
    "如果元素的某个幂是零，它就是幂零元。整环没有非零幂零元，但 $\\mathbb{Z}_n$ 可以有。$a$ 的某个幂被 $n$ 整除，当且仅当整除 $n$ 的每个素数都整除 $a$。所以幂零元就是 $n$ 的不同素因子之积的倍数。",
  ),
  generate(rng) {
    const n = rng.pick(nonsquarefree(200));
    const r = radical(n);
    const answer = n / r;
    return numberProblem({
      prompt: t(`How many nilpotent elements does $${Zn(n)}$ have, counting zero?`, `$${Zn(n)}$ 有多少个幂零元（包括零）？`),
      answer,
      form: "integer",
      wrong: [n - totient(n), r, answer - 1],
      solution: t(
        `The distinct primes of ${n} multiply to ${r}, so the nilpotents are the multiples of ${r} in $${Zn(n)}$. There are $\\frac{${n}}{${r}} = ${answer}$ of them.`,
        `${n} 的不同素因子之积是 ${r}，所以幂零元就是 $${Zn(n)}$ 中 ${r} 的倍数，共 $\\frac{${n}}{${r}} = ${answer}$ 个。`,
      ),
    });
  },
};

const idempotentCount: KnowledgePointDef = {
  id: "counting-idempotent-elements-of-zn",
  title: t("Counting idempotent elements of $\\mathbb{Z}_n$", "数 $\\mathbb{Z}_n$ 的幂等元"),
  explanation: t(
    "An element is idempotent if $a^2 = a$, that is, if $a(a - 1) = 0$. Since $a$ and $a - 1$ are coprime, each prime power in $n$ must divide one or the other, entirely. By the Chinese remainder theorem these choices are independent. So there is one idempotent for each way of choosing, and the zero and the unity are only two of them.",
    "如果 $a^2 = a$，即 $a(a - 1) = 0$，元素就是幂等元。由于 $a$ 和 $a - 1$ 互素，$n$ 中每个素数幂都必须整个整除其中一个。由中国剩余定理，这些选择相互独立。所以每种选法对应一个幂等元，零和幺元只是其中两个。",
  ),
  generate(rng) {
    const n = rng.pick(range(6, 240).filter((i) => primes(i).length >= 2));
    const w = primes(n).length;
    const answer = 2 ** w;
    return numberProblem({
      prompt: t(`How many solutions does $a^2 = a$ have in $${Zn(n)}$?`, `$a^2 = a$ 在 $${Zn(n)}$ 中有多少个解？`),
      answer,
      form: "integer",
      wrong: [2, w, n - totient(n)],
      solution: t(
        `The primes dividing ${n} are ${primes(n).join(", ")}, so there are ${w}. Each prime power divides either $a$ or $a - 1$, which gives $2^{${w}} = ${answer}$ solutions.`,
        `整除 ${n} 的素数是 ${primes(n).join("、")}，共 ${w} 个。每个素数幂要么整除 $a$，要么整除 $a - 1$，得 $2^{${w}} = ${answer}$ 个解。`,
      ),
    });
  },
};

const wilson: KnowledgePointDef = {
  id: "wilsons-theorem-in-a-prime-field",
  title: t("Wilson's theorem in a prime field", "素数域中的威尔逊定理"),
  explanation: t(
    "In the product of all nonzero elements of $\\mathbb{Z}_p$, each element cancels with its inverse. Only $1$ and $-1$ are their own inverses, because $x^2 = 1$ has just these two solutions in a field. So the product is $-1$, which is Wilson's theorem: $(p - 1)! \\equiv -1$. Dividing by the last factors reaches smaller factorials.",
    "在 $\\mathbb{Z}_p$ 所有非零元素的乘积中，每个元素都与它的逆抵消。只有 $1$ 和 $-1$ 是自己的逆，因为在域中 $x^2 = 1$ 只有这两个解。所以乘积是 $-1$，这就是威尔逊定理：$(p - 1)! \\equiv -1$。除以最后几个因子，就能得到更小的阶乘。",
  ),
  generate(rng) {
    const p = rng.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
    const back = rng.int(1, 3);
    const half = (p - 1) / 2;
    const answer = back === 1 ? p - 1 : back === 2 ? 1 : half;
    const steps =
      back === 1
        ? t(`By Wilson's theorem it is $-1$, which is ${p - 1} in $${Zn(p)}$.`, `由威尔逊定理它是 $-1$，在 $${Zn(p)}$ 中就是 ${p - 1}。`)
        : back === 2
          ? t(
              `Wilson's theorem gives $${p - 1}! \\equiv -1$, and $${p - 1} \\equiv -1$. Dividing by it gives $${p - 2}! \\equiv 1$.`,
              `威尔逊定理给出 $${p - 1}! \\equiv -1$，而 $${p - 1} \\equiv -1$。两边相除得 $${p - 2}! \\equiv 1$。`,
            )
          : t(
              `Wilson's theorem gives $${p - 1}! \\equiv -1$, and $${p - 1} \\cdot ${p - 2} \\equiv 2$. So $2 \\cdot ${p - 3}! \\equiv -1$, and since $2 \\cdot ${half} = ${p - 1} \\equiv -1$, the value is ${half}.`,
              `威尔逊定理给出 $${p - 1}! \\equiv -1$，而 $${p - 1} \\cdot ${p - 2} \\equiv 2$。所以 $2 \\cdot ${p - 3}! \\equiv -1$，由于 $2 \\cdot ${half} = ${p - 1} \\equiv -1$，值是 ${half}。`,
            );
    return numberProblem({
      prompt: t(`Find the remainder of $${p - back}!$ on division by ${p}.`, `求 $${p - back}!$ 除以 ${p} 的余数。`),
      answer,
      form: "integer",
      wrong: [0, 1, p - 1, half],
      solution: steps,
    });
  },
};

const ideaOfProductIdeals: KnowledgePointDef = {
  id: "counting-ideals-of-a-product-of-residue-rings",
  title: t("Counting ideals of a product of residue rings", "数剩余环之积的理想"),
  explanation: t(
    "The ideals of $\\mathbb{Z}_n$ correspond to the divisors of $n$, one for each. In a product of two rings with unity, every ideal is a product of an ideal of each factor, because multiplying by $(1, 0)$ and $(0, 1)$ separates the components. So the numbers of ideals multiply, even when $m$ and $n$ are not coprime.",
    "$\\mathbb{Z}_n$ 的理想与 $n$ 的因数一一对应。在两个有幺元的环之积中，每个理想都是各因子理想之积，因为乘以 $(1, 0)$ 和 $(0, 1)$ 可以分开各分量。所以理想个数相乘，即使 $m$ 和 $n$ 不互素也是如此。",
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
      wrong: [a + b, divisors(m * n).length, m * n],
      solution: t(
        `$${m}$ has ${a} divisors and $${n}$ has ${b}. Every ideal is a product of an ideal of each factor, which makes $${a} \\cdot ${b} = ${a * b}$.`,
        `${m} 有 ${a} 个因数，${n} 有 ${b} 个因数。每个理想都是各因子理想之积，共 $${a} \\cdot ${b} = ${a * b}$ 个。`,
      ),
    });
  },
};

const unitsOfAQuadraticQuotient: KnowledgePointDef = {
  id: "counting-units-of-a-quadratic-quotient-ring",
  title: t("Counting units of a quadratic quotient ring", "数二次商环的单位"),
  explanation: t(
    "The ring $\\mathbb{Z}_p[x]/(f)$ with $f$ quadratic has $p^2$ elements, and its structure depends on how $f$ factors. With no root, it is a field. With two different roots, it is $\\mathbb{Z}_p \\times \\mathbb{Z}_p$. With a double root $a$, a class is a unit exactly when it is nonzero at $a$. So the factorization decides the number of units.",
    "$f$ 为二次时，环 $\\mathbb{Z}_p[x]/(f)$ 有 $p^2$ 个元素，它的结构取决于 $f$ 的分解。没有根时它是域。有两个不同的根时它是 $\\mathbb{Z}_p \\times \\mathbb{Z}_p$。有重根 $a$ 时，一个类是单位当且仅当它在 $a$ 处非零。所以分解决定了单位的个数。",
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
      wrong: [(p - 1) ** 2, p * (p - 1), p * p - 1, p * p],
      solution:
        kind === 0
          ? t(
              `The polynomial has the two roots ${a} and ${b} in $${Zn(p)}$, so the ring is $${Zn(p)} \\times ${Zn(p)}$, with $${p - 1}^2 = ${answer}$ units.`,
              `这个多项式在 $${Zn(p)}$ 中有 ${a} 和 ${b} 两个根，所以这个环是 $${Zn(p)} \\times ${Zn(p)}$，有 $${p - 1}^2 = ${answer}$ 个单位。`,
            )
          : kind === 1
            ? t(
                `The polynomial has the double root ${a}. Of the $${p * p}$ classes, the ${p} that vanish at ${a} are not units, which leaves ${answer}.`,
                `这个多项式有重根 ${a}。在 $${p * p}$ 个类中，在 ${a} 处为零的 ${p} 个不是单位，剩下 ${answer} 个。`,
              )
            : t(
                `The polynomial has no root in $${Zn(p)}$, so it is irreducible and the ring is a field. All $${p * p} - 1 = ${answer}$ nonzero classes are units.`,
                `这个多项式在 $${Zn(p)}$ 中没有根，所以不可约，这个环是域。所有 $${p * p} - 1 = ${answer}$ 个非零类都是单位。`,
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
    "Three polynomials in the space of polynomials of degree at most two are dependent exactly when one is a combination of the others. Combine two of them to remove a power of $x$ that the third lacks. The third must then be a multiple of this combination, and comparing the remaining coefficients gives the parameter.",
    "在次数至多为二的多项式空间中，三个多项式线性相关，当且仅当其中一个是其余两个的组合。把其中两个组合起来，消去第三个所没有的 $x$ 的幂。第三个就必须是这个组合的倍数，比较剩下的系数就得到参数。",
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
      wrong: [a * b * c, -a * b, a + b],
      solution: t(
        `Removing $x$ from the first two gives $(${p1}) ${a < 0 ? "+" : "-"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}(${p2}) = ${combination}$. The third polynomial must be ${c === 1 ? "this one" : `${c} times this one`}, so $k = ${answer}$.`,
        `从前两个中消去 $x$，得 $(${p1}) ${a < 0 ? "+" : "-"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}(${p2}) = ${combination}$。第三个多项式必须${c === 1 ? "就是它" : `是它的 ${c} 倍`}，所以 $k = ${answer}$。`,
      ),
    });
  },
};

const associativityParameter: KnowledgePointDef = {
  id: "the-constant-that-makes-an-operation-associative",
  title: t("The constant that makes an operation associative", "使运算满足结合律的常数"),
  explanation: t(
    "An operation $a \\ast b = mab + k(a + b) + c$ looks like multiplication after a shift. Multiplying by $m$ and adding $k$ gives $m(a \\ast b) + k = (ma + k)(mb + k) + (mc + k - k^2)$. A product plus a constant is associative only if the constant is zero, so associativity fixes $c$.",
    "运算 $a \\ast b = mab + k(a + b) + c$ 平移后就像乘法。乘以 $m$ 再加 $k$，得 $m(a \\ast b) + k = (ma + k)(mb + k) + (mc + k - k^2)$。乘积加常数只有在常数为零时才满足结合律，所以结合律确定了 $c$。",
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
      wrong: [Q.of(k * k + k, m), Q.of(k * k, m), Q.of(k * k - k)],
      solution: t(
        `The constant $${poly([m, "c"], [k - k * k, ""])}$ left over after factoring must be zero, which gives $c = ${answer.toLatex()}$.`,
        `分解后剩下的常数 $${poly([m, "c"], [k - k * k, ""])}$ 必须为零，得 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const orderOfAnAffineMap: KnowledgePointDef = {
  id: "the-order-of-an-affine-map",
  title: t("The order of an affine map", "仿射映射的阶"),
  explanation: t(
    "The map $f(x) = ax + b$ on $\\mathbb{Z}_p$ has a fixed point when $a \\ne 1$. Measured from that point, $f$ just multiplies by $a$, so the order of $f$ is the order of $a$ modulo $p$, and $b$ has no effect. When $a = 1$, $f$ is a nonzero translation, and its order is $p$.",
    "当 $a \\ne 1$ 时，$\\mathbb{Z}_p$ 上的映射 $f(x) = ax + b$ 有不动点。从这个点量起，$f$ 只是乘以 $a$，所以 $f$ 的阶就是 $a$ 模 $p$ 的阶，$b$ 不起作用。当 $a = 1$ 时，$f$ 是非零平移，阶是 $p$。",
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
      wrong: [p, p - 1, a],
      solution:
        a === 1
          ? t(
              `This is a translation by ${b}, which returns to the identity after ${p} steps, since ${p} is prime.`,
              `这是平移 ${b}，由于 ${p} 是素数，${p} 步后才回到恒等映射。`,
            )
          : t(
              `The map fixes ${fixed}, so it acts by multiplying the distance from ${fixed} by ${a}. The powers of ${a} modulo ${p} first reach 1 at the power ${order}, so the order is ${order}.`,
              `这个映射固定 ${fixed}，所以它把到 ${fixed} 的距离乘以 ${a}。${a} 模 ${p} 的幂第一次等于 1 是在第 ${order} 次幂，所以阶是 ${order}。`,
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
    "Many formulas define a closed operation without being associative, and a single computation can show it. Evaluate $(x \\ast y) \\ast z$ and $x \\ast (y \\ast z)$ separately, always working inside the parentheses first, and compare the results. A nonzero difference for one triple is enough to prove that the operation is not associative.",
    "许多公式定义的运算封闭但不满足结合律，一次计算就能说明这一点。分别计算 $(x \\ast y) \\ast z$ 和 $x \\ast (y \\ast z)$，总是先算括号内的部分，再比较结果。只要有一组三元数使差不为零，就足以证明这个运算不满足结合律。",
  ),
  generate(rng) {
    const p = rng.int(2, 5);
    const q = rng.int(2, 5);
    const x = rng.int(1, 9);
    const y = rng.int(1, 9);
    const z = rng.int(1, 9);
    const left = p * (p * x + q * y) + q * z;
    const right = p * x + q * (p * y + q * z);
    const answer = left - right;
    return numberProblem({
      prompt: t(
        `On $\\mathbb{Z}$, let $a \\ast b = ${p}a + ${q}b$. Find $(${x} \\ast ${y}) \\ast ${z} - ${x} \\ast (${y} \\ast ${z})$.`,
        `在 $\\mathbb{Z}$ 上，设 $a \\ast b = ${p}a + ${q}b$。求 $(${x} \\ast ${y}) \\ast ${z} - ${x} \\ast (${y} \\ast ${z})$。`,
      ),
      answer,
      form: "integer",
      wrong: [0, -answer, left + right, p * (p - 1) * x],
      solution: t(
        `First $${x} \\ast ${y} = ${p * x + q * y}$, so the left term is $${left}$. Next $${y} \\ast ${z} = ${p * y + q * z}$, so the right term is $${right}$. The difference is $${answer}$.`,
        `先算 $${x} \\ast ${y} = ${p * x + q * y}$，所以左项是 $${left}$。再算 $${y} \\ast ${z} = ${p * y + q * z}$，所以右项是 $${right}$。差是 $${answer}$。`,
      ),
    });
  },
};

const commutingPairs: KnowledgePointDef = {
  id: "counting-the-pairs-that-commute",
  title: t("Counting the pairs that commute", "计算可交换的元素对"),
  explanation: t(
    "An operation that is not commutative may still commute on many pairs. For $a \\ast b = a + kb$ on $\\mathbb{Z}_n$, the condition $a \\ast b = b \\ast a$ reduces to $(k - 1)(a - b) = 0$. This depends only on the difference $a - b$. The difference can take $\\gcd(k - 1, n)$ values, and each works with any of the $n$ choices of $b$.",
    "不满足交换律的运算，仍可能在很多对元素上可交换。对 $\\mathbb{Z}_n$ 上的 $a \\ast b = a + kb$，条件 $a \\ast b = b \\ast a$ 化为 $(k - 1)(a - b) = 0$。这只取决于差 $a - b$。这个差可以取 $\\gcd(k - 1, n)$ 个值，每个值都可以搭配 $b$ 的 $n$ 种选择。",
  ),
  generate(rng) {
    const n = rng.int(6, 36);
    const k = rng.int(2, 13);
    const g = gcd(k - 1, n);
    const answer = n * g;
    return numberProblem({
      prompt: t(
        `On ${"$"}${Zn(n)}$, let $a \\ast b = a + ${k}b$. How many ordered pairs $(a, b)$ satisfy $a \\ast b = b \\ast a$?`,
        `在 ${"$"}${Zn(n)}$ 上，设 $a \\ast b = a + ${k}b$。有多少个有序对 $(a, b)$ 满足 $a \\ast b = b \\ast a$？`,
      ),
      answer,
      form: "integer",
      wrong: [n, n * n, g, n * (k - 1)],
      solution: t(
        `The condition is $${k - 1}(a - b) = 0$, which $\\gcd(${k - 1}, ${n}) = ${g}$ differences satisfy. With ${n} choices of $b$, there are $${answer}$ pairs.`,
        `条件是 $${k - 1}(a - b) = 0$，有 $\\gcd(${k - 1}, ${n}) = ${g}$ 个差满足它。$b$ 有 ${n} 种选择，所以有 $${answer}$ 对。`,
      ),
    });
  },
};

const shiftedIdentity: KnowledgePointDef = {
  id: "the-identity-of-a-shifted-product",
  title: t("The identity of a shifted product", "平移乘积的单位元"),
  explanation: t(
    "An operation such as $a \\ast b = (a + c)(b + c) - c$ is ordinary multiplication in disguise, because $a \\ast b + c$ equals $(a + c)(b + c)$. So the map $a \\mapsto a + c$ carries it to multiplication, whose identity is 1. The identity of the new operation is the element sent to 1, that is $1 - c$.",
    "$a \\ast b = (a + c)(b + c) - c$ 这样的运算其实是伪装的普通乘法，因为 $a \\ast b + c$ 等于 $(a + c)(b + c)$。所以映射 $a \\mapsto a + c$ 把它变成乘法，而乘法的单位元是 1。新运算的单位元就是被映到 1 的元素，即 $1 - c$。",
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
      wrong: [-c, c, 1 + c],
      solution: t(
        `We need $(a ${signed(c)})(e ${signed(c)}) = a ${signed(c)}$ for all $a$, so $e ${signed(c)} = 1$ and $e = ${answer}$.`,
        `需要对所有 $a$ 有 $(a ${signed(c)})(e ${signed(c)}) = a ${signed(c)}$，所以 $e ${signed(c)} = 1$，$e = ${answer}$。`,
      ),
    });
  },
};

const noInverse: KnowledgePointDef = {
  id: "the-element-with-no-inverse",
  title: t("The element with no inverse", "没有逆元的元素"),
  explanation: t(
    "Under $a \\ast b = a + b + kab$ on the rationals, the identity is 0, so an inverse of $a$ must solve $b(1 + ka) = -a$. Dividing by $1 + ka$ works except when this factor vanishes. At $a = -\\frac{1}{k}$ the equation reads $0 = -a$, which is false. That single element keeps the operation from being a group on all of the rationals.",
    "在有理数上的 $a \\ast b = a + b + kab$ 之下，单位元是 0，所以 $a$ 的逆元必须满足 $b(1 + ka) = -a$。除以 $1 + ka$ 是可行的，除非这个因子为零。在 $a = -\\frac{1}{k}$ 处，方程变成 $0 = -a$，这不成立。正是这一个元素，使这个运算在全体有理数上不构成群。",
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
      wrong: [answer.neg(), k, k.neg(), Q.of(0)],
      solution: t(
        `An inverse $b$ of $a$ must satisfy $b(1 ${sign} ${coefficient}a) = -a$. This has no solution when $1 ${sign} ${coefficient}a = 0$, that is at $a = ${answer.toLatex()}$.`,
        `$a$ 的逆元 $b$ 必须满足 $b(1 ${sign} ${coefficient}a) = -a$。当 $1 ${sign} ${coefficient}a = 0$，即 $a = ${answer.toLatex()}$ 时，它没有解。`,
      ),
    });
  },
};

const triangularInverse: KnowledgePointDef = {
  id: "the-inverse-of-an-upper-triangular-matrix",
  title: t("The inverse of an upper triangular matrix", "上三角矩阵的逆"),
  explanation: t(
    "Invertible upper triangular matrices form a subgroup of $GL(2, \\mathbb{Q})$, so an inverse of one is again upper triangular. Its diagonal entries are simply the reciprocals of the originals. The top right entry takes more care: it is $-\\frac{b}{ad}$, which comes from the usual formula, with the determinant $ad$ dividing the swapped and negated entries.",
    "可逆上三角矩阵构成 $GL(2, \\mathbb{Q})$ 的子群，所以它的逆仍是上三角矩阵。逆的对角元就是原对角元的倒数。右上角元素要多加小心：它是 $-\\frac{b}{ad}$，来自通常的公式，其中行列式 $ad$ 去除交换并取负后的元素。",
  ),
  generate(rng) {
    const a = pickNonzero(rng, 9);
    const b = pickNonzero(rng, 9);
    const d = pickNonzero(rng, 9);
    const answer = Q.of(-b, a * d);
    return numberProblem({
      prompt: t(
        `Let $A = \\begin{pmatrix} ${a} & ${b} \\\\ 0 & ${d} \\end{pmatrix}$ in $GL(2, \\mathbb{Q})$. Find the top right entry of $A^{-1}$.`,
        `设 $GL(2, \\mathbb{Q})$ 中的 $A = \\begin{pmatrix} ${a} & ${b} \\\\ 0 & ${d} \\end{pmatrix}$。求 $A^{-1}$ 右上角的元素。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(-b), Q.of(-b, a * a), Q.of(1, a)],
      solution: t(
        `Here $A^{-1} = \\frac{1}{\\det A}\\begin{pmatrix} ${d} & ${-b} \\\\ 0 & ${a} \\end{pmatrix}$ with $\\det A = ${a * d}$. So the entry is $${answer.toLatex()}$.`,
        `这里 $A^{-1} = \\frac{1}{\\det A}\\begin{pmatrix} ${d} & ${-b} \\\\ 0 & ${a} \\end{pmatrix}$，$\\det A = ${a * d}$。所以这个元素是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const orderFromTwoPowers: KnowledgePointDef = {
  id: "the-order-allowed-by-two-powers",
  title: t("The order allowed by two powers", "两个幂所允许的阶"),
  explanation: t(
    "If $a^m = e$ then the order of $a$ divides $m$, because the powers of $a$ repeat with that order as period. So two such equations force the order to divide both exponents, and hence their greatest common divisor. An element of that exact order exists in a cyclic group of that size, so the bound cannot be improved.",
    "如果 $a^m = e$，那么 $a$ 的阶整除 $m$，因为 $a$ 的幂以阶为周期重复。所以两个这样的方程迫使阶同时整除两个指数，从而整除它们的最大公约数。在这个大小的循环群中，恰好有这个阶的元素，所以这个界不能再改进。",
  ),
  generate(rng) {
    const m = rng.int(4, 60);
    const n = rng.pick(range(4, 60).filter((v) => v !== m));
    const answer = gcd(m, n);
    return numberProblem({
      prompt: t(
        `In a group, an element $a$ satisfies $a^{${m}} = e$ and $a^{${n}} = e$. What is the largest possible order of $a$?`,
        `在一个群中，元素 $a$ 满足 $a^{${m}} = e$ 和 $a^{${n}} = e$。$a$ 的阶最大可能是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [lcm(m, n), Math.min(m, n), Math.abs(m - n)],
      solution: t(
        `The order must divide both ${m} and ${n}, so it divides $\\gcd(${m}, ${n}) = ${answer}$. A cyclic group of order ${answer} reaches this value.`,
        `阶必须同时整除 ${m} 和 ${n}，所以它整除 $\\gcd(${m}, ${n}) = ${answer}$。${answer} 阶循环群达到了这个值。`,
      ),
    });
  },
};

const orderOfProductWithUnits: KnowledgePointDef = {
  id: "the-order-of-a-units-group-times-a-cyclic-group",
  title: t("The order of a units group times a cyclic group", "单位群与循环群之积的阶"),
  explanation: t(
    "The order of a direct product is the product of the orders, because an element is a free choice of one coordinate from each factor. The first factor here must be counted with care: $U(m)$ has $\\varphi(m)$ elements, not $m$, since only residues coprime to $m$ belong to it. So the total is $\\varphi(m)$ times the size of the other factor.",
    "直积的阶是各因子阶的乘积，因为一个元素就是从每个因子中自由选一个坐标。这里第一个因子要仔细数：$U(m)$ 有 $\\varphi(m)$ 个元素，而不是 $m$ 个，因为只有与 $m$ 互素的剩余才属于它。所以总数是 $\\varphi(m)$ 乘以另一个因子的大小。",
  ),
  generate(rng) {
    const m = rng.int(3, 30);
    const n = rng.int(2, 20);
    const answer = totient(m) * n;
    return numberProblem({
      prompt: t(`Find the order of the group $U(${m}) \\times ${Zn(n)}$.`, `求群 $U(${m}) \\times ${Zn(n)}$ 的阶。`),
      answer,
      form: "integer",
      wrong: [m * n, totient(m) + n, (m - 1) * n],
      solution: t(
        `The group $U(${m})$ has $\\varphi(${m}) = ${totient(m)}$ elements. Multiplying by ${n} gives $${answer}$.`,
        `群 $U(${m})$ 有 $\\varphi(${m}) = ${totient(m)}$ 个元素。乘以 ${n}，得 $${answer}$。`,
      ),
    });
  },
};

const inverseOfSquare: KnowledgePointDef = {
  id: "the-inverse-of-a-square-from-a-known-inverse",
  title: t("The inverse of a square from a known inverse", "由已知逆元求平方的逆元"),
  explanation: t(
    "In any group, the inverse of a power is the same power of the inverse, since $a^2 \\cdot (a^{-1})^2 = e$. So once one inverse in $U(p)$ has been found, others come cheaply. Squaring the known inverse and reducing modulo $p$ gives the inverse of $a^2$, without running the Euclidean algorithm a second time.",
    "在任何群中，幂的逆元就是逆元的同次幂，因为 $a^2 \\cdot (a^{-1})^2 = e$。所以在 $U(p)$ 中求出一个逆元后，其他逆元就很容易得到。把已知逆元平方并模 $p$ 化简，就得到 $a^2$ 的逆元，不必再做一次欧几里得算法。",
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
      wrong: [c, (a * a) % p, (2 * c) % p],
      solution: t(
        `The inverse of the square is the square of the inverse: $${c}^2 = ${c * c} \\equiv ${answer} \\pmod{${p}}$.`,
        `平方的逆元是逆元的平方：$${c}^2 = ${c * c} \\equiv ${answer} \\pmod{${p}}$。`,
      ),
    });
  },
};

const productSetSize: KnowledgePointDef = {
  id: "the-size-of-a-product-of-two-subgroups",
  title: t("The size of a product of two subgroups", "两个子群乘积的大小"),
  explanation: t(
    "The set $HK$ of all products $hk$ need not be a subgroup, but its size can still be counted. There are $|H||K|$ pairs $(h, k)$, and each product arises from exactly $|H \\cap K|$ of them, because an element of the intersection can be moved from one factor to the other. So $|HK| = \\frac{|H||K|}{|H \\cap K|}$.",
    "所有乘积 $hk$ 构成的集合 $HK$ 不一定是子群，但它的大小仍然可以计算。有 $|H||K|$ 个对 $(h, k)$，每个乘积恰好由其中 $|H \\cap K|$ 个对得到，因为交集中的元素可以从一个因子移到另一个因子。所以 $|HK| = \\frac{|H||K|}{|H \\cap K|}$。",
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
      wrong: [m * n, m + n - g, m + n, lcm(m, n)],
      solution: t(
        `The ${m * n} pairs give each product ${g} ${g === 1 ? "time" : "times"}, so $|HK| = ${m * n} \\div ${g} = ${answer}$.`,
        `${m * n} 个对中，每个乘积出现 ${g} 次，所以 $|HK| = ${m * n} \\div ${g} = ${answer}$。`,
      ),
    });
  },
};

const annihilatedElements: KnowledgePointDef = {
  id: "the-solutions-of-kx-equals-zero-in-zn",
  title: t("The solutions of $kx = 0$ in $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 中 $kx = 0$ 的解"),
  explanation: t(
    "The map $x \\mapsto kx$ is a homomorphism from $\\mathbb{Z}_n$ to itself, and the solutions of $kx = 0$ are its kernel. The image is the subgroup generated by $k$, which has $\\frac{n}{\\gcd(k, n)}$ elements. Dividing $n$ by this size leaves $\\gcd(k, n)$ for the kernel. The solutions are exactly the multiples of $\\frac{n}{\\gcd(k, n)}$.",
    "映射 $x \\mapsto kx$ 是 $\\mathbb{Z}_n$ 到自身的同态，$kx = 0$ 的解就是它的核。像是由 $k$ 生成的子群，有 $\\frac{n}{\\gcd(k, n)}$ 个元素。用 $n$ 除以这个大小，得到核的大小 $\\gcd(k, n)$。这些解恰好是 $\\frac{n}{\\gcd(k, n)}$ 的倍数。",
  ),
  generate(rng) {
    const n = rng.int(6, 60);
    const k = rng.int(2, n - 1);
    const answer = gcd(k, n);
    return numberProblem({
      prompt: t(`How many elements $x$ of ${"$"}${Zn(n)}$ satisfy $${k}x = 0$?`, `${"$"}${Zn(n)}$ 中有多少个元素 $x$ 满足 $${k}x = 0$？`),
      answer,
      form: "integer",
      wrong: [1, n, n / answer, k, answer + 1],
      solution: t(`The number of solutions is $\\gcd(${k}, ${n}) = ${answer}$.`, `解的个数是 $\\gcd(${k}, ${n}) = ${answer}$。`),
    });
  },
};

const subgroupOfGivenOrder: KnowledgePointDef = {
  id: "the-smallest-element-of-the-subgroup-of-a-given-order",
  title: t("The smallest element of the subgroup of a given order", "给定阶子群的最小元素"),
  explanation: t(
    "For each divisor $d$ of $n$, the group $\\mathbb{Z}_n$ has exactly one subgroup of order $d$. It consists of the multiples of $\\frac{n}{d}$, since those are the elements that $d$ annihilates. So its smallest positive element, which also generates it, is $\\frac{n}{d}$. Confusing the order with the generator gives the wrong subgroup.",
    "对 $n$ 的每个因子 $d$，群 $\\mathbb{Z}_n$ 恰有一个 $d$ 阶子群。它由 $\\frac{n}{d}$ 的倍数组成，因为这些元素正是乘以 $d$ 后为零的元素。所以它的最小正元素，也是它的生成元，是 $\\frac{n}{d}$。把阶和生成元混淆，就会得到错误的子群。",
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
      wrong: [d, n - d, 2 * answer],
      solution: t(
        `The subgroup of order ${d} consists of the multiples of $\\frac{${n}}{${d}} = ${answer}$, and its smallest positive element is that number.`,
        `${d} 阶子群由 $\\frac{${n}}{${d}} = ${answer}$ 的倍数组成，它的最小正元素就是这个数。`,
      ),
    });
  },
};

const sumOfGenerators: KnowledgePointDef = {
  id: "the-sum-of-the-generators-of-zn",
  title: t("The sum of the generators of $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 生成元之和"),
  explanation: t(
    "The generators of $\\mathbb{Z}_n$ are the residues coprime to $n$. If $k$ is one, so is $n - k$, since the two share their common divisors with $n$. For $n > 2$ these pair up, with $k \\ne n - k$, and each pair adds to $n$. There are $\\frac{\\varphi(n)}{2}$ pairs, so the total of the representatives is $\\frac{n\\varphi(n)}{2}$.",
    "$\\mathbb{Z}_n$ 的生成元是与 $n$ 互素的剩余。如果 $k$ 是生成元，$n - k$ 也是，因为它们与 $n$ 有相同的公因子。当 $n > 2$ 时，它们两两配对，$k \\ne n - k$，每对之和是 $n$。一共有 $\\frac{\\varphi(n)}{2}$ 对，所以代表元的总和是 $\\frac{n\\varphi(n)}{2}$。",
  ),
  generate(rng) {
    const n = rng.int(3, 60);
    const phi = totient(n);
    const answer = (n * phi) / 2;
    return numberProblem({
      prompt: t(
        `Add the integers from 1 to $${n - 1}$ that generate ${"$"}${Zn(n)}$. What is the total?`,
        `把 1 到 $${n - 1}$ 中能生成 ${"$"}${Zn(n)}$ 的整数相加。总和是多少？`,
      ),
      answer,
      form: "integer",
      wrong: [phi, n * phi, (n * (n - 1)) / 2],
      solution: t(
        `There are $\\varphi(${n}) = ${phi}$ generators, and they pair up as $k$ and ${n} minus $k$. That gives $\\frac{${n} \\cdot ${phi}}{2} = ${answer}$.`,
        `有 $\\varphi(${n}) = ${phi}$ 个生成元，它们按 $k$ 和 ${n} 减 $k$ 配对。于是得 $\\frac{${n} \\cdot ${phi}}{2} = ${answer}$。`,
      ),
    });
  },
};

const surjectionsFromFree: KnowledgePointDef = {
  id: "counting-surjections-from-a-free-group",
  title: t("Counting surjections from a free group", "计算自由群的满同态"),
  explanation: t(
    "The universal property says a homomorphism from a free group is a free choice of an image for each generator. Mapping to a group of prime order, the image is either trivial or the whole group, by Lagrange's theorem. So a homomorphism fails to be onto only if every generator goes to 0. That excludes exactly one of the choices.",
    "泛性质说，自由群的同态就是为每个生成元自由选择一个像。映到素数阶群时，由拉格朗日定理，像要么是平凡群，要么是整个群。所以同态不是满射，只有在每个生成元都映到 0 时才发生。这恰好排除了其中一种选择。",
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
      wrong: [p ** r, p ** r - p, r * (p - 1)],
      solution: t(
        `There are $${p}^${r}$ homomorphisms, and only the zero map is not onto. That leaves $${answer}$.`,
        `一共有 $${p}^${r}$ 个同态，只有零映射不是满射。剩下 $${answer}$ 个。`,
      ),
    });
  },
};

const twoRelationsOnOneGenerator: KnowledgePointDef = {
  id: "two-relations-on-one-generator",
  title: t("Two relations on one generator", "一个生成元上的两个关系"),
  explanation: t(
    "A presentation with one generator describes a cyclic group, and the relations decide its size. The relations $a^m = e$ and $a^n = e$ together imply $a^{\\gcd(m, n)} = e$, because the greatest common divisor is an integer combination of $m$ and $n$. Nothing further is forced, so the group is cyclic of order $\\gcd(m, n)$.",
    "只有一个生成元的表现描述一个循环群，关系决定它的大小。关系 $a^m = e$ 和 $a^n = e$ 合起来推出 $a^{\\gcd(m, n)} = e$，因为最大公约数是 $m$ 和 $n$ 的整数线性组合。没有更多的限制，所以这个群是 $\\gcd(m, n)$ 阶循环群。",
  ),
  generate(rng) {
    const m = rng.int(4, 60);
    const n = rng.pick(range(4, 60).filter((v) => v !== m));
    const answer = gcd(m, n);
    return numberProblem({
      prompt: t(
        `Find the order of the group $\\langle a \\mid a^{${m}} = a^{${n}} = e \\rangle$.`,
        `求群 $\\langle a \\mid a^{${m}} = a^{${n}} = e \\rangle$ 的阶。`,
      ),
      answer,
      form: "integer",
      wrong: [lcm(m, n), m * n, Math.min(m, n)],
      solution: t(
        `Both exponents are multiples of the order, and $\\gcd(${m}, ${n}) = ${answer}$ is a combination of them. So the group is cyclic of order $${answer}$.`,
        `两个指数都是阶的倍数，而 $\\gcd(${m}, ${n}) = ${answer}$ 是它们的组合。所以这个群是 $${answer}$ 阶循环群。`,
      ),
    });
  },
};

const generatorsOfProduct: KnowledgePointDef = {
  id: "counting-generators-of-a-cyclic-direct-product",
  title: t("Counting generators of a cyclic direct product", "循环直积的生成元个数"),
  explanation: t(
    "When $\\gcd(m, n) = 1$, the group $\\mathbb{Z}_m \\times \\mathbb{Z}_n$ is cyclic of order $mn$. An element $(a, b)$ has order $mn$ exactly when $a$ generates the first factor and $b$ generates the second, because its order is the least common multiple of the orders of its coordinates. So the choices multiply, and the count is $\\varphi(m)\\varphi(n)$.",
    "当 $\\gcd(m, n) = 1$ 时，群 $\\mathbb{Z}_m \\times \\mathbb{Z}_n$ 是 $mn$ 阶循环群。元素 $(a, b)$ 的阶为 $mn$，当且仅当 $a$ 生成第一个因子且 $b$ 生成第二个因子，因为它的阶是各坐标阶的最小公倍数。所以选择数相乘，个数是 $\\varphi(m)\\varphi(n)$。",
  ),
  generate(rng) {
    const m = rng.int(2, 20);
    const n = rng.pick(range(2, 20).filter((v) => gcd(v, m) === 1));
    const answer = totient(m) * totient(n);
    return numberProblem({
      prompt: t(
        `How many elements generate the cyclic group $${Zn(m)} \\times ${Zn(n)}$?`,
        `有多少个元素能生成循环群 $${Zn(m)} \\times ${Zn(n)}$？`,
      ),
      answer,
      form: "integer",
      wrong: [m * n, totient(m) + totient(n), (m - 1) * n],
      solution: t(
        `Each coordinate must be a generator, which allows $\\varphi(${m}) = ${totient(m)}$ and $\\varphi(${n}) = ${totient(n)}$ choices. The product is $${answer}$.`,
        `每个坐标都必须是生成元，分别有 $\\varphi(${m}) = ${totient(m)}$ 和 $\\varphi(${n}) = ${totient(n)}$ 种选择。乘积是 $${answer}$。`,
      ),
    });
  },
};

const torsionOrder: KnowledgePointDef = {
  id: "the-order-of-an-element-of-a-product-of-rationals-modulo-integers",
  title: t("Orders in a product of rationals modulo integers", "有理数模整数之积中的阶"),
  explanation: t(
    "Every element of $\\mathbb{Q}/\\mathbb{Z}$ has finite order, so the whole group is torsion even though $\\mathbb{Q}$ has no torsion at all. The order of $\\frac{a}{b} + \\mathbb{Z}$, in lowest terms, is $b$, because that is the first multiple to reach an integer. In a product, both coordinates must reach an integer together, so the denominators combine by their least common multiple.",
    "$\\mathbb{Q}/\\mathbb{Z}$ 的每个元素都有有限阶，所以整个群都是挠群，尽管 $\\mathbb{Q}$ 本身完全没有挠元。最简形式的 $\\frac{a}{b} + \\mathbb{Z}$ 的阶是 $b$，因为这是第一个达到整数的倍数。在乘积中，两个坐标必须同时达到整数，所以分母按最小公倍数合并。",
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
      wrong: [b * d, Math.max(b, d), b + d],
      solution: t(
        `The coordinates have orders ${b} and ${d}, so the element has order $\\text{lcm}(${b}, ${d}) = ${answer}$.`,
        `两个坐标的阶分别是 ${b} 和 ${d}，所以这个元素的阶是 $\\text{lcm}(${b}, ${d}) = ${answer}$。`,
      ),
    });
  },
};

const centerOfProduct: KnowledgePointDef = {
  id: "the-center-of-a-dihedral-group-times-a-cyclic-group",
  title: t("The center of a dihedral group times a cyclic group", "二面体群与循环群之积的中心"),
  explanation: t(
    "An element of a direct product is central exactly when each of its coordinates is central in its own factor, because products are computed coordinate by coordinate. So the center of a product is the product of the centers. A cyclic group is its own center, while the center of $D_n$, for $n \\ge 3$, has two elements if $n$ is even and one if $n$ is odd.",
    "直积的元素在中心里，当且仅当它的每个坐标都在各自因子的中心里，因为乘积是逐坐标计算的。所以乘积的中心是中心的乘积。循环群的中心是它自身，而 $D_n$（$n \\ge 3$）的中心在 $n$ 为偶数时有两个元素，在 $n$ 为奇数时有一个元素。",
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
      wrong: [m, 2 * m, 2 * n * m, center],
      solution: t(
        `The center of $D_{${n}}$ has ${center} ${center === 1 ? "element" : "elements"}, since ${n} is ${center === 1 ? "odd" : "even"}, and all ${m} elements of the cyclic factor are central. The product is $${answer}$.`,
        `由于 ${n} 是${center === 1 ? "奇" : "偶"}数，$D_{${n}}$ 的中心有 ${center} 个元素，循环因子的 ${m} 个元素都在中心里。乘积是 $${answer}$。`,
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
    "The size of the image of a homomorphism divides both the size of the source and the size of the target, so it is at most $\\gcd(m, n)$ for cyclic groups of orders $m$ and $n$. The kernel and image sizes multiply to $m$. So the kernel has at least $\\frac{m}{\\gcd(m, n)}$ elements, and the homomorphism is injective only when $m$ divides $n$.",
    "同态的像的大小同时整除源群和目标群的大小，所以对 $m$ 阶和 $n$ 阶循环群，它不超过 $\\gcd(m, n)$。核和像的大小之积是 $m$。所以核至少有 $\\frac{m}{\\gcd(m, n)}$ 个元素，只有当 $m$ 整除 $n$ 时，同态才可能是单射。",
  ),
  generate(rng) {
    const m = rng.int(4, 60);
    const n = rng.pick(range(4, 60).filter((v) => v !== m));
    const g = gcd(m, n);
    const answer = m / g;
    return numberProblem({
      prompt: t(
        `What is the smallest possible size of the kernel of a homomorphism from $${Zn(m)}$ to $${Zn(n)}$?`,
        `从 $${Zn(m)}$ 到 $${Zn(n)}$ 的同态，核最小可能有多少个元素？`,
      ),
      answer,
      form: "integer",
      wrong: [g, m, n / g, answer + g],
      solution: t(
        `The image has at most $\\gcd(${m}, ${n}) = ${g}$ elements, so the kernel has at least $${m} \\div ${g} = ${answer}$ elements.`,
        `像最多有 $\\gcd(${m}, ${n}) = ${g}$ 个元素，所以核至少有 $${m} \\div ${g} = ${answer}$ 个元素。`,
      ),
    });
  },
};

const orderPElements: KnowledgePointDef = {
  id: "elements-of-prime-order-in-a-nonabelian-group",
  title: t("Elements of prime order in a nonabelian group", "非阿贝尔群中素数阶的元素"),
  explanation: t(
    "A nonabelian group of order $pq$, with primes $p < q$, has a normal subgroup of order $q$. If its Sylow $p$-subgroups were also normal, the group would be their direct product, and so abelian. So there are $q$ Sylow $p$-subgroups, the only other value the third Sylow theorem allows. Any two meet trivially, and each contains $p - 1$ elements of order $p$.",
    "素数 $p < q$ 时，$pq$ 阶非阿贝尔群有一个 $q$ 阶正规子群。如果它的西罗 $p$-子群也是正规的，这个群就是它们的直积，因而是阿贝尔群。所以有 $q$ 个西罗 $p$-子群，这是第三西罗定理允许的唯一另一个值。任意两个的交是平凡的，每个含有 $p - 1$ 个 $p$ 阶元素。",
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
      wrong: [p - 1, q - 1, q * p - 1, p * (q - 1)],
      solution: t(
        `There are ${q} Sylow ${p}-subgroups, meeting only in the identity, and each has ${p - 1} ${p === 2 ? "element" : "elements"} of order ${p}. That makes $${answer}$.`,
        `有 ${q} 个西罗 ${p}-子群，它们只相交于单位元，每个有 ${p - 1} 个 ${p} 阶元素。总共 $${answer}$ 个。`,
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
    "Dividing by a monic polynomial of degree $d$ is always possible over $\\mathbb{Z}_n$, even if $n$ is not prime, because no leading coefficient has to be inverted. So each coset has exactly one representative of degree below $d$. Such a representative is a free choice of $d$ coefficients from $\\mathbb{Z}_n$, which gives $n^d$ elements in the quotient.",
    "在 $\\mathbb{Z}_n$ 上，除以 $d$ 次首一多项式总是可行的，即使 $n$ 不是素数，因为不需要对首项系数求逆。所以每个陪集恰有一个次数低于 $d$ 的代表元。这样的代表元就是从 $\\mathbb{Z}_n$ 中自由选取 $d$ 个系数，因此商环有 $n^d$ 个元素。",
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
      wrong: [n * d, n ** (d - 1), n ** (d + 1)],
      solution: t(
        `Each coset has one representative of degree below ${d}, with ${d} free coefficients in ${"$"}${Zn(n)}$. That gives $${n}^${d} = ${answer}$.`,
        `每个陪集有一个次数低于 ${d} 的代表元，它有 ${d} 个可在 ${"$"}${Zn(n)}$ 中自由选取的系数。于是得 $${n}^${d} = ${answer}$。`,
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
    "Abstract vector spaces have dimensions that come from counting free coefficients. Polynomials of degree at most $a$ have $a + 1$ coefficients, because the constant term counts too, and $b \\times c$ matrices have $bc$ entries. A pair drawn from two spaces has all the coordinates of both, so the dimension of a product is the sum of the two dimensions.",
    "抽象向量空间的维数来自对自由系数的计数。次数不超过 $a$ 的多项式有 $a + 1$ 个系数，因为常数项也算在内，$b \\times c$ 矩阵有 $bc$ 个元素。从两个空间各取一个组成的对，含有两者的全部坐标，所以乘积的维数是两个维数之和。",
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
      wrong: [a + b * c, (a + 1) * b * c, a + 1 + b + c],
      solution: t(
        `The dimensions are ${a + 1} and $${b} \\cdot ${c} = ${b * c}$, and they add to $${answer}$.`,
        `维数分别是 ${a + 1} 和 $${b} \\cdot ${c} = ${b * c}$，相加得 $${answer}$。`,
      ),
    });
  },
};

const shiftedBasisCoordinate: KnowledgePointDef = {
  id: "a-coordinate-in-a-shifted-polynomial-basis",
  title: t("A coordinate in a shifted polynomial basis", "平移多项式基下的坐标"),
  explanation: t(
    "The polynomials $1, t - c, (t - c)^2$ form a basis of $\\mathbb{P}_2$, and it is well suited to working near $t = c$. Differentiating an expansion $p(t) = x + y(t - c) + z(t - c)^2$ and setting $t = c$ removes every term except $y$. So the coordinate on $t - c$ is the derivative $p'(c)$, and no linear system has to be solved.",
    "多项式 $1, t - c, (t - c)^2$ 构成 $\\mathbb{P}_2$ 的一组基，它很适合在 $t = c$ 附近使用。对展开式 $p(t) = x + y(t - c) + z(t - c)^2$ 求导并令 $t = c$，除了 $y$ 之外的项都消失了。所以 $t - c$ 上的坐标就是导数 $p'(c)$，不必解线性方程组。",
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
      wrong: [b, 2 * a * c, a * c + b, a * c * c + b * c + g],
      solution: t(
        `The coordinate is $p'(${c})$. Since $p'(t) = ${poly([2 * a, "t"], [b, ""])}$, this equals $${answer}$.`,
        `这个坐标是 $p'(${c})$。由于 $p'(t) = ${poly([2 * a, "t"], [b, ""])}$，它等于 $${answer}$。`,
      ),
    });
  },
};

const matrixSubspaceDimension: KnowledgePointDef = {
  id: "the-dimension-of-a-subspace-of-square-matrices",
  title: t("The dimension of a subspace of square matrices", "方阵子空间的维数"),
  explanation: t(
    "A symmetric matrix is decided by its entries on and above the diagonal, which number $\\frac{n(n + 1)}{2}$. A skew-symmetric matrix has a zero diagonal, because each diagonal entry equals its own negative, so it is decided by the $\\frac{n(n - 1)}{2}$ entries above it. The two dimensions add to $n^2$, since every square matrix splits uniquely into these two kinds.",
    "对称矩阵由对角线及其上方的元素决定，共 $\\frac{n(n + 1)}{2}$ 个。反对称矩阵的对角线为零，因为每个对角元等于自身的相反数，所以它由对角线上方的 $\\frac{n(n - 1)}{2}$ 个元素决定。两个维数之和是 $n^2$，因为每个方阵都能唯一地分解成这两类之和。",
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
      wrong: [other, n * n, n],
      solution: t(
        `A ${symmetric ? "symmetric matrix is decided by its entries on and above the diagonal" : "skew-symmetric matrix has a zero diagonal and is decided by its entries above it"}, and there are $${answer}$ of them.`,
        `${symmetric ? "对称矩阵由对角线及其上方的元素决定" : "反对称矩阵对角线为零，由对角线上方的元素决定"}，共有 $${answer}$ 个。`,
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
    "The integers form a group under the operation $x \\ast y = x + y + k$, with identity $-k$. In a group, the $n$th power of an element means the element combined with itself $n$ times, whatever the operation is called. Here it is not a product in the usual sense. Each extra copy of $a$ adds both $a$ and $k$, so that the operation produces a simple linear pattern in $n$, and not a true power.",
    "整数在运算 $x \\ast y = x + y + k$ 下构成群，单位元是 $-k$。在群中，元素的 $n$ 次幂指这个元素与自身运算 $n$ 次，不管运算叫什么。这里它不是通常意义的乘积。每多一个 $a$，就多加 $a$ 和 $k$，所以运算给出关于 $n$ 的简单线性规律，而不是真正的乘方。",
  ),
  generate(rng) {
    const a = pickNonzero(rng, 9);
    const k = pickNonzero(rng, 9);
    const n = rng.int(3, 9);
    const answer = n * a + (n - 1) * k;
    return numberProblem({
      prompt: t(
        `The integers form a group under $x \\ast y = ${poly([1, "x"], [1, "y"], [k, ""])}$. Find $${a} \\ast ${a} \\ast \\cdots \\ast ${a}$, with ${n} copies of $${a}$.`,
        `整数在运算 $x \\ast y = ${poly([1, "x"], [1, "y"], [k, ""])}$ 下构成群。求 $${a} \\ast ${a} \\ast \\cdots \\ast ${a}$，其中有 ${n} 个 $${a}$。`,
      ),
      answer,
      form: "integer",
      wrong: [n * a, n * a + n * k, n * a + k, a + (n - 1) * k],
      solution: t(
        `Each further copy adds $${a} ${signed(k)} = ${a + k}$. With ${n - 1} further copies, the result is $${a} + ${n - 1} \\cdot ${a + k < 0 ? `(${a + k})` : a + k} = ${answer}$.`,
        `每多一个，就加上 $${a} ${signed(k)} = ${a + k}$。多了 ${n - 1} 个，结果是 $${a} + ${n - 1} \\cdot ${a + k < 0 ? `(${a + k})` : a + k} = ${answer}$。`,
      ),
    });
  },
};

const powerOfOnePlusI: KnowledgePointDef = {
  id: "a-power-of-one-plus-or-minus-i",
  title: t("A power of one plus or minus i", "1 加减 i 的幂"),
  explanation: t(
    "In the group of nonzero complex numbers under multiplication, powers of an element can often be found through a convenient small power. Here $(1 + i)^2 = 2i$ and $(1 - i)^2 = -2i$, which are much easier to raise to a power, since powers of $i$ run through a cycle of four. So write the exponent as a multiple of 2, plus a possible remainder of 1, rather than multiplying out each factor.",
    "在非零复数的乘法群中，元素的幂常常可以借助一个方便的小次幂求出。这里 $(1 + i)^2 = 2i$，$(1 - i)^2 = -2i$，它们的幂要容易得多，因为 $i$ 的幂以四为周期循环。所以把指数写成 2 的倍数，可能再加余数 1，而不是逐个因子相乘。",
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
      wrong: [-answer, 2 * answer, 2 ** n, n],
      solution: t(
        `Since $(${base})^2 = ${square}$, the power is $${form} = ${poly([re, ""], [im, "i"])}$. So ${asksReal ? "$x$" : "$y$"} is $${answer}$.`,
        `由于 $(${base})^2 = ${square}$，这个幂等于 $${form} = ${poly([re, ""], [im, "i"])}$。所以 ${asksReal ? "$x$" : "$y$"} 是 $${answer}$。`,
      ),
    });
  },
};

const triangularGroupSize: KnowledgePointDef = {
  id: "the-size-of-a-triangular-matrix-group-over-zp",
  title: t("The size of a triangular matrix group over Zp", "Zp 上三角矩阵群的大小"),
  explanation: t(
    "The upper triangular matrices with nonzero diagonal entries form a subgroup of the invertible matrices, because their determinant is the product of the diagonal. To count them over a finite field, choose each entry independently: a diagonal entry has $p - 1$ choices, and an entry above the diagonal has $p$. An $n \\times n$ matrix has $\\frac{n(n - 1)}{2}$ entries above the diagonal. If all the diagonal entries must equal 1, only those entries remain free.",
    "对角元非零的上三角矩阵构成可逆矩阵的子群，因为它们的行列式是对角元之积。在有限域上计数时，每个元素独立选择：对角元有 $p - 1$ 种选择，对角线上方的元素有 $p$ 种。$n \\times n$ 矩阵在对角线上方有 $\\frac{n(n - 1)}{2}$ 个元素。如果所有对角元都必须是 1，就只有这些元素是自由的。",
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
      wrong: [p ** (n * n), unit ? (p - 1) ** n * free : free, p ** n, (p - 1) ** n, answer + 1],
      solution: t(
        `There ${above === 1 ? "is 1 entry" : `are ${above} entries`} above the diagonal, giving $${free}$ choices. ${unit ? "The diagonal is fixed, so the count is that number" : `Each of the ${n} diagonal entries has ${p - 1} nonzero choices, which gives $${answer}$ in all`}.`,
        `对角线上方有 ${above} 个元素，给出 $${free}$ 种选择。${unit ? "对角线已固定，所以个数就是这个数" : `${n} 个对角元各有 ${p - 1} 种非零选择，总共 $${answer}$ 个`}。`,
      ),
    });
  },
};

const affineGroupSize: KnowledgePointDef = {
  id: "the-size-of-the-affine-group-modulo-n",
  title: t("The size of the affine group modulo n", "模 n 仿射群的大小"),
  explanation: t(
    "A map $x \\mapsto ax + b$ on the residues modulo $n$ is a bijection exactly when $a$ is a unit, since $b$ only shifts the values. The invertible maps of this form are closed under composition and form a group. Its size comes from two independent choices: $a$ must be one of the $\\varphi(n)$ units, and $b$ can be any of the $n$ residues. The composition of two such maps is again one of them.",
    "模 $n$ 剩余上的映射 $x \\mapsto ax + b$ 是双射，当且仅当 $a$ 是单位，因为 $b$ 只是平移取值。这种形式的可逆映射对复合封闭，构成一个群。它的大小来自两个独立的选择：$a$ 必须是 $\\varphi(n)$ 个单位之一，$b$ 可以是 $n$ 个剩余中的任何一个。两个这样的映射的复合仍是这样的映射。",
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
      wrong: [n * n, n * (n - 1), units, n + units],
      solution: t(
        `The map is a bijection exactly when $a$ is a unit, which gives $\\varphi(${n}) = ${units}$ choices, and $b$ is free, with ${n} choices. The total is $${answer}$.`,
        `映射是双射当且仅当 $a$ 是单位，这给出 $\\varphi(${n}) = ${units}$ 种选择，$b$ 是自由的，有 ${n} 种选择。总数是 $${answer}$。`,
      ),
    });
  },
};

const smallestPrimitiveRoot: KnowledgePointDef = {
  id: "the-smallest-generator-of-the-units-modulo-a-prime",
  title: t("The smallest generator of the units modulo a prime", "模素数单位群的最小生成元"),
  explanation: t(
    "The group of units modulo a prime $p$ is cyclic of order $p - 1$, but no simple formula gives a generator. An element generates the group exactly when its order is $p - 1$, and the order must divide $p - 1$. So to test a candidate, it is enough to compute its powers until they reach 1. Trying $2, 3, 4, \\dots$ in turn finds the smallest generator, usually after only a few tries.",
    "模素数 $p$ 的单位群是 $p - 1$ 阶循环群，但没有简单公式给出生成元。一个元素生成这个群，当且仅当它的阶是 $p - 1$，而阶必须整除 $p - 1$。所以要检验一个候选，只需计算它的幂直到得到 1。依次试 $2, 3, 4, \\dots$ 就能找到最小的生成元，通常只需试几次。",
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
    return numberProblem({
      prompt: t(`Find the smallest positive integer that generates the group of units modulo ${p}.`, `求生成模 ${p} 单位群的最小正整数。`),
      answer,
      form: "integer",
      wrong: [answer + 1, p - 1, totient(p - 1), answer + 2, answer + 3],
      solution: t(
        `A generator must have order $${p - 1}$. ${smaller.length > 0 ? `The smaller candidates fall short, with orders ${smaller.map(([g, order]) => `$${order}$ for $${g}$`).join(", ")}. ` : ""}The powers of $${answer}$ first reach 1 at exponent $${p - 1}$, so it is the smallest.`,
        `生成元的阶必须是 $${p - 1}$。${smaller.length > 0 ? `较小的候选都不满足，它们的阶是：${smaller.map(([g, order]) => `$${g}$ 的阶为 $${order}$`).join("，")}。` : ""}$${answer}$ 的幂第一次等于 1 是在指数 $${p - 1}$ 处，所以它最小。`,
      ),
    });
  },
};

const sumOfOrders: KnowledgePointDef = {
  id: "the-sum-of-the-orders-of-the-elements-of-zn",
  title: t("The sum of the orders of the elements of Zn", "Zn 中元素的阶之和"),
  explanation: t(
    "In a cyclic group of order $n$, the order of every element divides $n$, and for each divisor $d$ there are exactly $\\varphi(d)$ elements of order $d$. So instead of finding the order of each element in turn, group the elements by their order. Each divisor $d$ contributes $d\\varphi(d)$ to the sum. This counting by classes is a common way of adding up something over all the elements of a group.",
    "在 $n$ 阶循环群中，每个元素的阶都整除 $n$，对每个因数 $d$，恰好有 $\\varphi(d)$ 个 $d$ 阶元素。所以不必逐个求元素的阶，而是按阶把元素分组。每个因数 $d$ 对总和贡献 $d\\varphi(d)$。这种分类计数是对群的所有元素求和的常用方法。",
  ),
  generate(rng) {
    const n = rng.int(4, 60);
    const parts = divisors(n);
    const answer = sum(parts.map((d) => d * totient(d)));
    return numberProblem({
      prompt: t(`Add up the orders of all the elements of $${Zn(n)}$.`, `把 $${Zn(n)}$ 中所有元素的阶相加。`),
      answer,
      form: "integer",
      wrong: [(n * (n + 1)) / 2, sum(parts), n * n, answer + 1],
      solution: t(
        `Each divisor $d$ of ${n} gives $\\varphi(d)$ elements of order $d$. So the sum is $${parts.map((d) => `${d} \\cdot ${totient(d)}`).join(" + ")} = ${answer}$.`,
        `${n} 的每个因数 $d$ 给出 $\\varphi(d)$ 个 $d$ 阶元素。所以和是 $${parts.map((d) => `${d} \\cdot ${totient(d)}`).join(" + ")} = ${answer}$。`,
      ),
    });
  },
};

const cyclesInPower: KnowledgePointDef = {
  id: "the-number-of-cycles-in-a-power-of-a-cycle",
  title: t("The number of cycles in a power of a cycle", "循环的幂中循环的个数"),
  explanation: t(
    "A power of a cycle need not be a cycle. Moving $k$ steps at a time around a loop of $\\ell$ symbols returns to the start after $\\frac{\\ell}{\\gcd(\\ell, k)}$ moves, so that this is the length of each piece. All the pieces have equal length, and together they use all $\\ell$ symbols, which means that there are $\\gcd(\\ell, k)$ of them. In particular, the power is a single cycle exactly when $\\ell$ and $k$ are coprime.",
    "循环的幂不一定是循环。沿着 $\\ell$ 个符号的环每次走 $k$ 步，走 $\\frac{\\ell}{\\gcd(\\ell, k)}$ 次回到起点，这就是每一段的长度。所有段长度相等，合起来用完全部 $\\ell$ 个符号，所以共有 $\\gcd(\\ell, k)$ 段。特别地，当且仅当 $\\ell$ 与 $k$ 互素时，这个幂是一个循环。",
  ),
  generate(rng) {
    const length = rng.int(6, 40);
    const k = rng.int(2, length - 1);
    const answer = gcd(length, k);
    return numberProblem({
      prompt: t(
        `Let $c$ be a cycle of length ${length}. Into how many disjoint cycles does $c^{${k}}$ split?`,
        `设 $c$ 是长度为 ${length} 的循环。$c^{${k}}$ 分解成多少个不相交的循环？`,
      ),
      answer,
      form: "integer",
      wrong: [k, length / answer, answer + 1, length - k, answer + 2],
      solution: t(
        `Moving ${k} steps at a time, each cycle closes after $\\frac{${length}}{\\gcd(${length}, ${k})} = ${length / answer}$ moves. Since the cycles use all ${length} symbols, the number of them is $${answer}$.`,
        `每次走 ${k} 步，每个循环走 $\\frac{${length}}{\\gcd(${length}, ${k})} = ${length / answer}$ 次后闭合。由于这些循环用完全部 ${length} 个符号，它们的个数是 $${answer}$。`,
      ),
    });
  },
};

const inversionsCount: KnowledgePointDef = {
  id: "counting-inversions-as-adjacent-transpositions",
  title: t("Counting inversions as adjacent transpositions", "用逆序数计算相邻对换"),
  explanation: t(
    "An adjacent transposition swaps two neighbouring entries in a row, and it changes the relative order of exactly one pair. So it changes the number of inversions, the pairs of entries that are out of order, by exactly 1. Sorting needs the inversions to reach zero, and each swap of a neighbouring out-of-order pair removes one. So the fewest swaps equals the number of inversions, and this is more than an arbitrary factorization into transpositions may need.",
    "相邻对换交换一行中相邻的两个元素，它恰好改变一对元素的相对顺序。所以它使逆序数（顺序颠倒的元素对的个数）恰好改变 1。排序需要逆序数变为零，而每次交换一对顺序颠倒的相邻元素就减少一个。所以最少交换次数等于逆序数，这比任意分解为对换可能需要的次数要多。",
  ),
  generate(rng) {
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
    const answer = sum(row.map((v, i) => row.slice(i + 1).filter((w) => w < v).length));
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
    return numberProblem({
      prompt: t(
        `A permutation of $\\{1, \\dots, ${n}\\}$ is written in a row as ${row.join(", ")}. What is the fewest swaps of neighbouring entries that will sort the row into increasing order?`,
        `$\\{1, \\dots, ${n}\\}$ 的一个排列写成一行：${row.join("，")}。把这一行排成递增顺序，最少要交换多少次相邻元素？`,
      ),
      answer,
      form: "integer",
      wrong: [n - cycles, (n * (n - 1)) / 2, answer + 1, answer - 1],
      solution: t(
        `Each swap of neighbours changes the number of inversions by exactly 1, so the fewest swaps is the number of inversions. Counting the pairs that are out of order in the row gives $${answer}$.`,
        `每次相邻交换使逆序数恰好改变 1，所以最少交换次数就是逆序数。数出这一行中顺序颠倒的元素对，得 $${answer}$。`,
      ),
    });
  },
};

const involutionsWithSwaps: KnowledgePointDef = {
  id: "counting-permutations-equal-to-their-inverse",
  title: t("Counting permutations equal to their inverse", "计算等于自身逆的排列"),
  explanation: t(
    "A permutation equals its own inverse exactly when applying it twice gives the identity, which means that all its cycles have length 1 or 2. So such a permutation is a set of disjoint transpositions. To count those with $k$ transpositions, line up the symbols and pair the first $2k$. Since this overcounts, divide by $2^k$ for the order within each pair and by $k!$ for the order of the pairs, and by $(n - 2k)!$ for the remaining symbols.",
    "一个排列等于自身的逆，当且仅当应用两次得到恒等排列，也就是它的所有循环长度都是 1 或 2。所以这样的排列是一组不相交的对换。要数含 $k$ 个对换的排列，把符号排成一行，把前 $2k$ 个配对。由于这样数多了，要除以 $2^k$（每对内的顺序）、$k!$（各对的顺序）和 $(n - 2k)!$（其余的符号）。",
  ),
  generate(rng) {
    const n = rng.int(4, 14);
    const k = rng.int(2, Math.floor(n / 2));
    const answer = factorial(n) / (2 ** k * factorial(k) * factorial(n - 2 * k));
    return numberProblem({
      prompt: t(
        `How many permutations in $S_{${n}}$ are products of exactly ${k} disjoint transpositions, and so equal their own inverse?`,
        `$S_{${n}}$ 中有多少个排列恰好是 ${k} 个不相交对换的积，因而等于自身的逆？`,
      ),
      answer,
      form: "integer",
      wrong: [choose(n, 2 * k), answer * factorial(k), answer * 2 ** k, choose(n, 2) ** k, answer + 1],
      solution: t(
        `The count is $\\frac{${n}!}{${2 ** k} \\cdot ${k}! \\cdot ${n - 2 * k}!} = ${answer}$, dividing out the order within each pair, the order of the pairs, and the order of the remaining symbols.`,
        `个数是 $\\frac{${n}!}{${2 ** k} \\cdot ${k}! \\cdot ${n - 2 * k}!} = ${answer}$，这里除掉了每对内的顺序、各对的顺序和其余符号的顺序。`,
      ),
    });
  },
};

const permutationsOfCycleType: KnowledgePointDef = {
  id: "counting-permutations-of-a-given-cycle-type",
  title: t("Counting permutations of a given cycle type", "计算给定循环类型的排列"),
  explanation: t(
    "To count the permutations with a given cycle type, first choose which symbols go into each cycle, and then arrange them. A cycle on $\\ell$ chosen symbols can be written in $(\\ell - 1)!$ different ways, because rotating a cycle does not change it. Two cycles of equal length are unordered, so choosing them in turn counts each permutation twice, and this must be divided out. Symbols not used are fixed, and contribute a single way.",
    "要数给定循环类型的排列，先选出每个循环包含哪些符号，再排列它们。选定的 $\\ell$ 个符号组成的循环有 $(\\ell - 1)!$ 种不同的写法，因为旋转循环不会改变它。两个长度相同的循环没有顺序，所以依次选择会把每个排列数两次，必须除掉。没有用到的符号是不动点，只有一种情形。",
  ),
  generate(rng) {
    const n = rng.int(5, 10);
    const a = rng.int(2, n - 2);
    const b = rng.int(2, Math.min(a, n - a));
    const same = a === b;
    const first = choose(n, a) * factorial(a - 1);
    const second = choose(n - a, b) * factorial(b - 1);
    const answer = (first * second) / (same ? 2 : 1);
    const type = same ? `two disjoint ${a}-cycles` : `one ${a}-cycle and one disjoint ${b}-cycle`;
    const typeZh = same ? `两个不相交的 ${a}-循环` : `一个 ${a}-循环和一个与之不相交的 ${b}-循环`;
    return numberProblem({
      prompt: t(
        `How many permutations in $S_{${n}}$ consist of ${type}, with all other symbols fixed?`,
        `$S_{${n}}$ 中有多少个排列由${typeZh}组成，其余符号都不动？`,
      ),
      answer,
      form: "integer",
      wrong: [same ? 2 * answer : answer * a, choose(n, a) * choose(n - a, b), answer * b, answer + 1, answer + 2],
      solution: t(
        `Choosing and arranging gives $\\binom{${n}}{${a}} \\cdot ${factorial(a - 1)}$ ways for the first cycle and $\\binom{${n - a}}{${b}} \\cdot ${factorial(b - 1)}$ for the second${same ? ", and the two cycles have equal length, so divide by 2" : ""}. The result is $${answer}$.`,
        `选择并排列，第一个循环有 $\\binom{${n}}{${a}} \\cdot ${factorial(a - 1)}$ 种方法，第二个有 $\\binom{${n - a}}{${b}} \\cdot ${factorial(b - 1)}$ 种${same ? "，两个循环长度相同，所以要除以 2" : ""}。结果是 $${answer}$。`,
      ),
    });
  },
};

const prismSymmetries: KnowledgePointDef = {
  id: "the-symmetries-of-a-regular-prism",
  title: t("The symmetries of a regular prism", "正棱柱的对称"),
  explanation: t(
    "A right prism on a regular $n$-gon keeps the two bases apart from the side faces, unless it happens to be a cube, so every symmetry must send the bases to the bases. The $n$ rotations about the central axis keep each base in place, and $n$ half-turns about axes through the middle of the prism swap the bases. These are the $2n$ rotations. Adding reflection through the middle plane doubles the count, giving $4n$ symmetries in all.",
    "正 $n$ 边形上的直棱柱，除非恰好是立方体，底面和侧面是区分开的，所以每个对称都把底面变到底面。绕中心轴的 $n$ 个旋转保持每个底面不动，绕过棱柱中部的轴的 $n$ 个半周旋转交换两个底面。这就是 $2n$ 个旋转。加上关于中间平面的反射，个数加倍，总共有 $4n$ 个对称。",
  ),
  generate(rng) {
    const n = rng.pick(range(3, 40).filter((v) => v !== 4));
    const all = rng.pick([true, false]);
    const answer = all ? 4 * n : 2 * n;
    return numberProblem({
      prompt: t(
        `A right prism has regular ${n}-gons as its bases. How many ${all ? "symmetries, counting rotations and reflections," : "rotational symmetries, counting the identity,"} does it have?`,
        `一个直棱柱的底面是正 ${n} 边形。它有多少个${all ? "对称（包括旋转和反射）" : "旋转对称（包括恒等变换）"}？`,
      ),
      answer,
      form: "integer",
      wrong: [n, all ? 2 * n : 4 * n, 6 * n, n + 2],
      solution: t(
        `There are ${n} rotations about the central axis and ${n} half-turns that swap the bases, which makes $${2 * n}$ rotations. ${all ? `Each can also be followed by the reflection in the middle plane, which gives $${answer}$.` : "So the answer is that number."}`,
        `绕中心轴有 ${n} 个旋转，交换两个底面的半周旋转有 ${n} 个，共 $${2 * n}$ 个旋转。${all ? `每个旋转还可以再接一次关于中间平面的反射，得 $${answer}$。` : "所以答案就是这个数。"}`,
      ),
    });
  },
};

const elementsOfOrderInProduct: KnowledgePointDef = {
  id: "counting-elements-of-a-given-order-in-a-product",
  title: t("Counting elements of a given order in a product", "计算积群中给定阶的元素"),
  explanation: t(
    "The order of an element $(x, y)$ of a direct product is the least common multiple of the orders of $x$ and $y$. So to count the elements of order $d$, list the pairs of orders $(d_1, d_2)$ with $\\operatorname{lcm}(d_1, d_2) = d$, using divisors of the two group orders. In a cyclic factor, there are $\\varphi(d_1)$ elements of order $d_1$, so each pair of orders contributes the product of two totients.",
    "直积中元素 $(x, y)$ 的阶是 $x$ 和 $y$ 的阶的最小公倍数。所以要数 $d$ 阶元素，就用两个群的阶的因数，列出满足 $\\operatorname{lcm}(d_1, d_2) = d$ 的阶对 $(d_1, d_2)$。在循环因子中，有 $\\varphi(d_1)$ 个 $d_1$ 阶元素，所以每个阶对贡献两个欧拉函数值之积。",
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
    const shown = pairs.map(([d1, d2]) => `${totient(d1)} \\cdot ${totient(d2)}`).join(" + ");
    return numberProblem({
      prompt: t(
        `How many elements of order ${d} does $${Zn(m)} \\times ${Zn(n)}$ have?`,
        `$${Zn(m)} \\times ${Zn(n)}$ 中有多少个 ${d} 阶元素？`,
      ),
      answer,
      form: "integer",
      wrong: [totient(d), 2 * totient(d), m * n, answer + 1, answer + 2],
      solution: t(
        `The orders must have least common multiple ${d}, and the possible pairs of orders are ${pairs.map(([d1, d2]) => `$(${d1}, ${d2})$`).join(", ")}. Counting elements of these orders gives $${shown} = ${answer}$.`,
        `两个阶的最小公倍数必须是 ${d}，可能的阶对是 ${pairs.map(([d1, d2]) => `$(${d1}, ${d2})$`).join("、")}。数出这些阶的元素，得 $${shown} = ${answer}$。`,
      ),
    });
  },
};

const smallestInCoset: KnowledgePointDef = {
  id: "the-smallest-element-of-a-coset-of-a-subgroup-of-units",
  title: t("The smallest element of a coset of a subgroup of units", "单位子群陪集中的最小元素"),
  explanation: t(
    "A coset $aH$ of a subgroup $H$ of the units modulo $p$ is found by multiplying each element of $H$ by $a$ and reducing. The result has the same number of elements as $H$, and it is disjoint from $H$ when $a$ lies outside $H$. A coset has no natural first element, because any of its elements can serve as the representative $a$. So choosing the smallest is a way of naming the coset uniquely.",
    "模 $p$ 单位群的子群 $H$ 的陪集 $aH$，是把 $H$ 的每个元素乘以 $a$ 再化简得到的。结果与 $H$ 的元素个数相同，当 $a$ 在 $H$ 之外时与 $H$ 不相交。陪集没有天然的第一个元素，因为它的任何元素都可以作代表元 $a$。所以选最小的元素是给陪集唯一命名的一种方法。",
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
      wrong: [a, g, (a * g) % p, answer + 1, answer + 2, p - answer],
      solution: t(
        `Here $H = \\{${listed}\\}$. Multiplying by ${a} and reducing gives $\\{${coset.join(", ")}\\}$, whose smallest element is $${answer}$.`,
        `这里 $H = \\{${listed}\\}$。乘以 ${a} 并化简，得 $\\{${coset.join(", ")}\\}$，最小元素是 $${answer}$。`,
      ),
    });
  },
};

const subgroupsOfQuotient: KnowledgePointDef = {
  id: "counting-the-subgroups-of-a-quotient-of-zn",
  title: t("Counting the subgroups of a quotient of Zn", "计算 Zn 的商群的子群个数"),
  explanation: t(
    "The element $k$ of $\\mathbb{Z}_n$ generates the same subgroup as $\\gcd(n, k)$, and this has $\\frac{n}{\\gcd(n, k)}$ elements. So the quotient by it has order $\\gcd(n, k)$. A quotient of a cyclic group is cyclic, and a cyclic group has exactly one subgroup for each divisor of its order. So the number of subgroups of the quotient is the number of divisors of $\\gcd(n, k)$, and it has nothing further to do with $n$.",
    "$\\mathbb{Z}_n$ 中的元素 $k$ 与 $\\gcd(n, k)$ 生成相同的子群，它有 $\\frac{n}{\\gcd(n, k)}$ 个元素。所以对它的商群的阶是 $\\gcd(n, k)$。循环群的商群是循环群，循环群对其阶的每个因数恰有一个子群。所以商群的子群个数是 $\\gcd(n, k)$ 的因数个数，与 $n$ 再无其他关系。",
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
      wrong: [order, divisors(n).length, divisors(n / order).length, answer + 1, answer + 2, n / order, answer + 3],
      solution: t(
        `The subgroup $\\langle ${k} \\rangle$ has $\\frac{${n}}{\\gcd(${n}, ${k})} = ${n / order}$ elements, so the quotient is cyclic of order $${order}$. It has one subgroup for each of the $${answer}$ divisors of ${order}.`,
        `子群 $\\langle ${k} \\rangle$ 有 $\\frac{${n}}{\\gcd(${n}, ${k})} = ${n / order}$ 个元素，所以商群是 $${order}$ 阶循环群。${order} 的每个因数对应一个子群，共 $${answer}$ 个。`,
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
    "A Sylow $p$-subgroup has as its order the highest power of $p$ that divides the order of the group. For $S_n$, the order is $n!$, and the exponent of $p$ in it is $\\lfloor \\frac{n}{p} \\rfloor + \\lfloor \\frac{n}{p^2} \\rfloor + \\dots$, because the multiples of $p$ each contribute a factor, the multiples of $p^2$ contribute another, and so on. Note that the answer is the power itself, not its exponent.",
    "西罗 $p$-子群的阶是整除群的阶的 $p$ 的最高次幂。对 $S_n$，阶是 $n!$，其中 $p$ 的指数是 $\\lfloor \\frac{n}{p} \\rfloor + \\lfloor \\frac{n}{p^2} \\rfloor + \\dots$，因为 $p$ 的每个倍数贡献一个因子，$p^2$ 的倍数再贡献一个，依此类推。注意答案是这个幂本身，不是它的指数。",
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
      wrong: [exponent, p * answer, p * exponent, answer + p, n],
      solution: t(
        `The exponent of ${p} in ${n}! is $${parts.length > 1 ? `${parts.join(" + ")} = ` : ""}${exponent}$, so the order is $${exponent === 1 ? `${p}` : `${p}^{${exponent}} = ${answer}`}$.`,
        `${n}! 中 ${p} 的指数是 $${parts.length > 1 ? `${parts.join(" + ")} = ` : ""}${exponent}$，所以阶是 $${exponent === 1 ? `${p}` : `${p}^{${exponent}} = ${answer}`}$。`,
      ),
    });
  },
};

const triangularUnits: KnowledgePointDef = {
  id: "counting-units-of-triangular-matrices-over-zn",
  title: t("Counting units of triangular matrices over Zn", "计算 Zn 上三角矩阵环的单位"),
  explanation: t(
    "The upper triangular $2 \\times 2$ matrices over $\\mathbb{Z}_n$ form a ring. A matrix in this ring is a unit exactly when its inverse is also upper triangular, and this happens when both diagonal entries are units of $\\mathbb{Z}_n$. The entry above the diagonal can be anything, since it does not affect the determinant. So the count is a product of three independent choices, and the ring is not commutative even though $\\mathbb{Z}_n$ is.",
    "$\\mathbb{Z}_n$ 上的 $2 \\times 2$ 上三角矩阵构成环。这个环中的矩阵是单位，当且仅当它的逆也是上三角矩阵，这发生在两个对角元都是 $\\mathbb{Z}_n$ 的单位时。对角线上方的元素可以任取，因为它不影响行列式。所以个数是三个独立选择之积，尽管 $\\mathbb{Z}_n$ 可交换，这个环却不可交换。",
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
      wrong: [units * n, units * units, n ** 3, (n - 1) ** 2 * n],
      solution: t(
        `Both diagonal entries must be units, with $\\varphi(${n}) = ${units}$ choices each, and the third entry is free, with ${n} choices. This gives $${units}^2 \\cdot ${n} = ${answer}$.`,
        `两个对角元都必须是单位，各有 $\\varphi(${n}) = ${units}$ 种选择，第三个元素是自由的，有 ${n} 种选择。所以是 $${units}^2 \\cdot ${n} = ${answer}$。`,
      ),
    });
  },
};

const gaussianFraction: KnowledgePointDef = {
  id: "a-fraction-of-gaussian-integers-in-standard-form",
  title: t("A fraction of Gaussian integers in standard form", "把高斯整数之比写成标准形式"),
  explanation: t(
    "The Gaussian integers $\\mathbb{Z}[i]$ form an integral domain, and their field of quotients is the set of $x + yi$ with $x$ and $y$ rational. A fraction is put in this form by multiplying the top and bottom by the conjugate of the denominator. The new denominator is the integer $c^2 + d^2$, which is why every fraction has rational coordinates. So every quotient of Gaussian integers has one standard form, although many fractions represent it.",
    "高斯整数 $\\mathbb{Z}[i]$ 构成整环，它的分式域是 $x$、$y$ 为有理数的 $x + yi$ 的集合。把分子分母同乘以分母的共轭，就把分式写成这种形式。新的分母是整数 $c^2 + d^2$，这就是每个分式都有有理坐标的原因。所以高斯整数的每个商都有唯一的标准形式，尽管有许多分式表示它。",
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
      wrong: [
        Q.of(asksReal ? a : b, c),
        Q.of(asksReal ? a * c - b * d : b * c + a * d, norm),
        answer.neg(),
        Q.of(asksReal ? re : im, 2 * norm),
        answer.add(Q.of(1)),
        answer.sub(Q.of(1)),
      ],
      solution: t(
        `Multiplying the top and bottom by $${poly([c, ""], [-d, "i"])}$ gives the denominator $${norm}$ and the numerator $${poly([re, ""], [im, "i"])}$. So ${asksReal ? "$x$" : "$y$"} is $${answer.toLatex()}$.`,
        `分子分母同乘以 $${poly([c, ""], [-d, "i"])}$，分母是 $${norm}$，分子是 $${poly([re, ""], [im, "i"])}$。所以 ${asksReal ? "$x$" : "$y$"} 是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const idealGenerator: KnowledgePointDef = {
  id: "the-generator-of-a-sum-or-intersection-of-ideals",
  title: t("The generator of a sum or intersection of ideals", "理想的和或交的生成元"),
  explanation: t(
    "Every ideal of the integers is principal, so the sum and the intersection of two ideals have single generators. The sum $(a) + (b)$ contains all $ax + by$, which by Bezout's identity are exactly the multiples of $\\gcd(a, b)$. The intersection $(a) \\cap (b)$ contains the common multiples, which are the multiples of $\\operatorname{lcm}(a, b)$. It is easy to swap these: a larger ideal has a smaller generator, so the sum belongs with the gcd.",
    "整数的每个理想都是主理想，所以两个理想的和与交都有单个生成元。和 $(a) + (b)$ 包含所有 $ax + by$，由贝祖等式，它们恰好是 $\\gcd(a, b)$ 的倍数。交 $(a) \\cap (b)$ 包含公倍数，也就是 $\\operatorname{lcm}(a, b)$ 的倍数。这两者容易弄混：较大的理想有较小的生成元，所以和对应最大公因数。",
  ),
  generate(rng) {
    const a = rng.int(4, 60);
    const b = rng.pick(range(4, 60).filter((v) => v !== a));
    const asksSum = rng.pick([true, false]);
    const answer = asksSum ? gcd(a, b) : lcm(a, b);
    const symbol = asksSum ? "+" : "\\cap";
    return numberProblem({
      prompt: t(
        `In the ring of integers, find the positive generator of the ideal $(${a}) ${symbol} (${b})$.`,
        `在整数环中，求理想 $(${a}) ${symbol} (${b})$ 的正生成元。`,
      ),
      answer,
      form: "integer",
      wrong: [asksSum ? lcm(a, b) : gcd(a, b), a * b, a + b, Math.abs(a - b) + 1],
      solution: t(
        asksSum
          ? `The ideal holds all combinations $${a}x + ${b}y$, which are the multiples of $\\gcd(${a}, ${b}) = ${answer}$.`
          : `The ideal holds the common multiples of ${a} and ${b}, which are the multiples of $\\operatorname{lcm}(${a}, ${b}) = ${answer}$.`,
        asksSum
          ? `这个理想包含所有组合 $${a}x + ${b}y$，它们是 $\\gcd(${a}, ${b}) = ${answer}$ 的倍数。`
          : `这个理想包含 ${a} 和 ${b} 的公倍数，它们是 $\\operatorname{lcm}(${a}, ${b}) = ${answer}$ 的倍数。`,
      ),
    });
  },
};

const kernelIntoProduct: KnowledgePointDef = {
  id: "the-kernel-of-a-map-into-a-product-of-residue-rings",
  title: t("The kernel of a map into a product of residue rings", "到剩余环之积的映射的核"),
  explanation: t(
    "The ring homomorphism from the integers to a product of residue rings sends an integer to its remainders. An integer lies in the kernel when every remainder is zero, so that it is divisible by every modulus. So the kernel is the ideal generated by the least common multiple of the moduli. By the first isomorphism theorem, the image is a copy of the residue ring modulo this number, which need not be the whole product.",
    "从整数到剩余环之积的环同态把一个整数映到它的余数。整数在核中，当且仅当每个余数都是零，也就是它能被每个模整除。所以核是由各模的最小公倍数生成的理想。由第一同构定理，像同构于模这个数的剩余环，它不一定是整个积。",
  ),
  generate(rng) {
    const a = rng.int(2, 15);
    const b = rng.pick(range(2, 15).filter((v) => v !== a));
    const c = rng.pick(range(2, 15).filter((v) => v !== a && v !== b));
    const answer = lcm(lcm(a, b), c);
    return numberProblem({
      prompt: t(
        `The homomorphism $\\mathbb{Z} \\to ${Zn(a)} \\times ${Zn(b)} \\times ${Zn(c)}$ sends $x$ to its three remainders. Find the positive generator of its kernel.`,
        `同态 $\\mathbb{Z} \\to ${Zn(a)} \\times ${Zn(b)} \\times ${Zn(c)}$ 把 $x$ 映到它的三个余数。求它的核的正生成元。`,
      ),
      answer,
      form: "integer",
      wrong: [a * b * c, gcd(gcd(a, b), c), a + b + c, lcm(a, b), 2 * answer],
      solution: t(
        `An integer lies in the kernel when ${a}, ${b} and ${c} all divide it. So the generator is their least common multiple, $${answer}$.`,
        `整数在核中，当且仅当 ${a}、${b}、${c} 都整除它。所以生成元是它们的最小公倍数 $${answer}$。`,
      ),
    });
  },
};

const primeIdealsOfProduct: KnowledgePointDef = {
  id: "counting-prime-ideals-of-a-product-of-residue-rings",
  title: t("Counting prime ideals of a product of residue rings", "计算剩余环之积的素理想"),
  explanation: t(
    "Every ideal of a product of two rings $R \\times S$ has the form $I \\times J$, and it is prime exactly when one factor is the whole ring and the other is prime. So the prime ideals of $R \\times S$ come from those of $R$ and those of $S$ separately, and the counts add. For $\\mathbb{Z}_n$, the prime ideals correspond to the prime divisors of $n$. A prime dividing both moduli counts once for each factor.",
    "两个环之积 $R \\times S$ 的每个理想都形如 $I \\times J$，它是素理想当且仅当一个因子是整个环，另一个是素理想。所以 $R \\times S$ 的素理想分别来自 $R$ 和 $S$ 的素理想，个数相加。对 $\\mathbb{Z}_n$，素理想对应 $n$ 的素因数。同时整除两个模的素数在每个因子中各算一次。",
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
      wrong: [primes(lcm(m, n)).length, left.length * right.length, divisors(m).length + divisors(n).length, answer + 1, answer + 2],
      solution: t(
        `A prime ideal comes from one factor, with the other factor whole. The prime divisors are ${left.join(", ")} for ${m} and ${right.join(", ")} for ${n}, which gives $${left.length} + ${right.length} = ${answer}$.`,
        `素理想来自一个因子，另一个因子取整个环。${m} 的素因数是 ${left.join("、")}，${n} 的素因数是 ${right.join("、")}，所以是 $${left.length} + ${right.length} = ${answer}$。`,
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
