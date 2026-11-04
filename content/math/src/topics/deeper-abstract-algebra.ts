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
};
